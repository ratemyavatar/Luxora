using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class ProfileController : ControllerBase
{
    private readonly Db _db;
    public ProfileController(Db db) => _db = db;

    private sealed class UserRow
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public DateTimeOffset Created { get; set; }
    }
    private sealed class EquippedRow
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string AssetType { get; set; } = "";
        public string? ThumbnailPath { get; set; }
    }
    private sealed class GameRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public long Playing { get; set; }
        public long Visits { get; set; }
    }

    [HttpGet("/apisite/users/v1/users/{userId:long}/profile")]
    public async Task<IActionResult> Profile(long userId)
    {
        var me = CurrentUser.Id(HttpContext);
        using var c = _db.Open();
        var user = await c.QueryFirstOrDefaultAsync<UserRow>(
            "select id as Id,username::text as Name,description as Description,created as Created from users where id=@userId and account_status=0",
            new { userId });
        if (user is null) return NotFound();
        var friendCount = await c.ExecuteScalarAsync<int>("select count(*) from friendship where user_id_a=@userId or user_id_b=@userId", new { userId });
        var relation = "None";
        if (me == userId) relation = "Self";
        else if (me is not null)
        {
            if (await c.ExecuteScalarAsync<int>("select count(*) from friendship where user_id_a=least(@me,@userId) and user_id_b=greatest(@me,@userId)", new { me, userId }) > 0) relation = "Friends";
            else if (await c.ExecuteScalarAsync<int>("select count(*) from friend_request where requester_id=@me and addressee_id=@userId", new { me, userId }) > 0) relation = "RequestSent";
            else if (await c.ExecuteScalarAsync<int>("select count(*) from friend_request where requester_id=@userId and addressee_id=@me", new { me, userId }) > 0) relation = "RequestReceived";
        }
        var games = await c.QueryAsync<GameRow>(@"
            select g.id as Id,p.id as PlaceId,g.name as Name,g.visits as Visits,
                   coalesce(sum(case when s.status=1 and s.last_heartbeat>now()-interval '90 seconds' then s.player_count else 0 end),0)::bigint as Playing
            from game g join place p on p.game_id=g.id and p.is_root_place left join game_session s on s.place_id=p.id
            where g.creator_id=@userId and g.is_active group by g.id,p.id order by g.visits desc,g.id desc limit 30", new { userId });
        var wearing = await c.QueryAsync<EquippedRow>(@"
            select i.id as Id,i.name as Name,i.asset_type as AssetType,i.thumbnail_path as ThumbnailPath
            from user_avatar_asset a join catalog_item i on i.id=a.item_id where a.user_id=@userId
            order by a.equipped desc limit 16",new{userId});
        var favorites = await c.QueryAsync<GameRow>(@"
            select g.id as Id,p.id as PlaceId,g.name as Name,g.visits as Visits,
                   coalesce(sum(case when s.status=1 and s.last_heartbeat>now()-interval '90 seconds' then s.player_count else 0 end),0)::bigint as Playing
            from game_favorite f join game g on g.id=f.game_id join place p on p.game_id=g.id and p.is_root_place
            left join game_session s on s.place_id=p.id where f.user_id=@userId and g.is_active
            group by g.id,p.id,f.created order by f.created desc limit 6", new { userId });
        return Ok(new
        {
            id=user.Id,name=user.Name,displayName=user.Name,description=user.Description,created=user.Created,
            friends=friendCount,followers=0,following=0,relation,canEdit=me==userId,
            avatarUrl=$"/thumbs/avatar/{userId}/420x420.png",headshotUrl=$"/thumbs/avatar-headshot/{userId}/150x150.png",
            currentlyWearing=wearing.Select(x=>new{id=x.Id,name=x.Name,assetType=x.AssetType,
                imageUrl=x.ThumbnailPath??"/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg"}),
            games=games.Select(Game),favoriteGames=favorites.Select(Game),placeVisits=games.Sum(x=>x.Visits)
        });
        static object Game(GameRow x) => new { universeId=x.Id,placeId=x.PlaceId,name=x.Name,playerCount=x.Playing,visits=x.Visits,imageUrl=$"/thumbs/game-icon/{x.Id}/150x150.png" };
    }

    public sealed class DescriptionRequest { public string? Description { get; set; } }
    [HttpPost("/apisite/users/v1/users/{userId:long}/description")]
    public async Task<IActionResult> Description(long userId,[FromBody] DescriptionRequest request)
    {
        var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();if(me!=userId)return Forbid();
        var body=(request.Description??"").Trim();if(body.Length>1000)return BadRequest(new{errors=new[]{new{code=1,message="Description is too long."}}});
        using var c=_db.Open();await c.ExecuteAsync("update users set description=@body where id=@userId",new{body,userId});return Ok(new{description=body});
    }

    [HttpPost("/apisite/friends/v1/users/{userId:long}/request")]
    public async Task<IActionResult> Friend(long userId)
    {
        var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();if(me==userId)return BadRequest();
        using var c=_db.Open();using var tx=c.BeginTransaction();
        if(await c.ExecuteScalarAsync<int>("select count(*) from friend_request where requester_id=@userId and addressee_id=@me",new{userId,me},tx)>0)
        {
            await c.ExecuteAsync("delete from friend_request where (requester_id=@userId and addressee_id=@me) or (requester_id=@me and addressee_id=@userId)",new{userId,me},tx);
            await c.ExecuteAsync("insert into friendship(user_id_a,user_id_b) values(least(@me,@userId),greatest(@me,@userId)) on conflict do nothing",new{me,userId},tx);
            tx.Commit();return Ok(new{relation="Friends"});
        }
        await c.ExecuteAsync("insert into friend_request(requester_id,addressee_id) values(@me,@userId) on conflict do nothing",new{me,userId},tx);
        tx.Commit();return Ok(new{relation="RequestSent"});
    }
}
