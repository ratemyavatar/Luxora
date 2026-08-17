using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class GamePageController : ControllerBase
{
    private readonly Db _db; private readonly Luxora.Services.RccGameService _rcc; private readonly Luxora.Services.GameTicketService _tickets; private readonly LuxoraConfig _cfg;
    public GamePageController(Db db,Luxora.Services.RccGameService rcc,Luxora.Services.GameTicketService tickets,LuxoraConfig cfg){_db=db;_rcc=rcc;_tickets=tickets;_cfg=cfg;}

    private sealed class DetailRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public long CreatorId { get; set; }
        public string CreatorName { get; set; } = "";
        public int MaxPlayers { get; set; }
        public long Visits { get; set; }
        public long Favorites { get; set; }
        public bool IsActive { get; set; }
        public bool IsCopyingAllowed { get; set; }
        public string Genre { get; set; } = "All";
        public DateTimeOffset Created { get; set; }
        public DateTimeOffset Updated { get; set; }
        public bool HasFile { get; set; }
        public long Playing { get; set; }
    }

    private sealed class DiscoverRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public string CreatorName { get; set; } = "";
        public long Playing { get; set; }
        public long Visits { get; set; }
        public DateTimeOffset Updated { get; set; }
    }

    [HttpGet("/apisite/games/v1/discover")]
    public async Task<IActionResult> Discover([FromQuery] string? keyword, [FromQuery] string? sort)
    {
        using var c = _db.Open();
        var rows = await c.QueryAsync<DiscoverRow>(@"
            select g.id as Id,p.id as PlaceId,g.name as Name,u.username::text as CreatorName,
                   g.visits as Visits,g.updated as Updated,
                   coalesce(sum(case when s.status=1 and s.last_heartbeat>now()-interval '90 seconds' then s.player_count else 0 end),0)::bigint as Playing
            from game g join place p on p.game_id=g.id and p.is_root_place join users u on u.id=g.creator_id
            left join game_session s on s.place_id=p.id
            where g.is_active and (@keyword='' or g.name ilike '%'||@keyword||'%' or u.username::text ilike '%'||@keyword||'%')
            group by g.id,p.id,u.username
            order by case when @sort='Updated' then extract(epoch from g.updated) else coalesce(sum(case when s.status=1 then s.player_count else 0 end),0)*1000000+g.visits end desc,g.id desc
            limit 120", new { keyword = (keyword ?? "").Trim(), sort = sort ?? "Popular" });
        return Ok(new { data = rows.Select(x => new { universeId=x.Id,placeId=x.PlaceId,name=x.Name,
            creatorName=x.CreatorName,playerCount=x.Playing,visits=x.Visits,updated=x.Updated,
            imageUrl=$"/thumbs/game-icon/{x.Id}/150x150.png" }) });
    }

    [HttpGet("/apisite/games/v1/places/{placeId:long}/details")]
    public async Task<IActionResult> Details(long placeId)
    {
        var me = CurrentUser.Id(HttpContext);
        using var c = _db.Open();
        var row = await c.QueryFirstOrDefaultAsync<DetailRow>(@"
            select g.id as Id,p.id as PlaceId,g.name as Name,g.description as Description,
                   g.creator_id as CreatorId,u.username::text as CreatorName,g.max_players as MaxPlayers,
                   g.visits as Visits,g.favorites as Favorites,g.is_active as IsActive,
                   g.is_copying_allowed as IsCopyingAllowed,g.genre as Genre,g.created as Created,g.updated as Updated,
                   (p.rcc_file is not null) as HasFile,
                   coalesce(sum(case when s.status=1 and s.last_heartbeat>now()-interval '90 seconds' then s.player_count else 0 end),0)::bigint as Playing
            from game g join place p on p.game_id=g.id and p.is_root_place join users u on u.id=g.creator_id
            left join game_session s on s.place_id=p.id
            where p.id=@placeId
            group by g.id,p.id,u.username", new { placeId });
        if (row is null) return NotFound();
        var favorited = me is not null && await c.ExecuteScalarAsync<int>(
            "select count(*) from game_favorite where user_id=@me and game_id=@id", new { me, id = row.Id }) > 0;
        return Ok(new
        {
            universeId=row.Id,placeId=row.PlaceId,name=row.Name,description=row.Description,
            creatorId=row.CreatorId,creatorName=row.CreatorName,maxPlayers=row.MaxPlayers,
            visits=row.Visits,favorites=row.Favorites,playing=row.Playing,isActive=row.IsActive,
            isCopyingAllowed=row.IsCopyingAllowed,genre=row.Genre,created=row.Created,updated=row.Updated,
            hasPlaceFile=row.HasFile,isFavorited=favorited,canManage=me==row.CreatorId,
            imageUrl=$"/thumbs/game-thumbnail/{row.Id}/768x432.png"
        });
    }

    public sealed class FavoriteRequest { public bool IsFavorited { get; set; } }
    [HttpPost("/apisite/games/v1/games/{gameId:long}/favorite")]
    public async Task<IActionResult> Favorite(long gameId, [FromBody] FavoriteRequest request)
    {
        var me=CurrentUser.Id(HttpContext); if(me is null)return Unauthorized();
        using var c=_db.Open(); using var tx=c.BeginTransaction();
        if(request.IsFavorited) await c.ExecuteAsync("insert into game_favorite(user_id,game_id) values(@me,@gameId) on conflict do nothing",new{me,gameId},tx);
        else await c.ExecuteAsync("delete from game_favorite where user_id=@me and game_id=@gameId",new{me,gameId},tx);
        await c.ExecuteAsync("update game set favorites=(select count(*) from game_favorite where game_id=@gameId) where id=@gameId",new{gameId},tx);
        tx.Commit();
        return Ok(new{isFavorited=request.IsFavorited});
    }

    private sealed class ServerRow
    {
        public Guid Id { get; set; }
        public string Ip { get; set; } = "";
        public int? Port { get; set; }
        public int Players { get; set; }
        public int MaxPlayers { get; set; }
    }

    [HttpGet("/apisite/games/v1/places/{placeId:long}/servers")]
    public async Task<IActionResult> Servers(long placeId)
    {
        using var c=_db.Open();
        var rows=await c.QueryAsync<ServerRow>(@"select id as Id,server_ip::text as Ip,server_port as Port,player_count as Players,max_players as MaxPlayers
            from game_session where place_id=@placeId and status=1 and last_heartbeat>now()-interval '90 seconds' order by player_count desc",new{placeId});
        return Ok(new{data=rows});
    }

    [HttpPost("/apisite/games/v1/places/{placeId:long}/join")]
    public async Task<IActionResult> Join(long placeId)
    {
        var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();
        var server=await _rcc.GetOrStart(placeId);if(server is null)return Conflict(new{errors=new[]{new{code=1,message="Upload a place file before playing."}}});
        using var c=_db.Open();await c.ExecuteAsync(@"insert into user_recent_game(user_id,game_id,last_played) select @me,game_id,now() from place where id=@placeId on conflict(user_id,game_id) do update set last_played=now()",new{me,placeId});
        var ticket=_tickets.Issue(me.Value,placeId,server);var launch=$"luxora-player://join?ticket={ticket.Id}&placeId={placeId}&baseUrl={Uri.EscapeDataString(_cfg.BaseUrl)}";
        return Ok(new{placeId,serverId=server.Id,machineAddress=server.Address,serverPort=server.Port,ticket=ticket.Id,launcherUrl=launch,joinScriptUrl=$"{_cfg.BaseUrl}/game/join-script?ticket={ticket.Id}"});
    }
}
