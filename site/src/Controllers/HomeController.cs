using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

internal static class CurrentUser
{
    public static long? Id(HttpContext ctx)
        => long.TryParse(ctx.Items["luxora.userId"] as string, out var id) ? id : null;
}

[ApiController]
public sealed class SocialController : ControllerBase
{
    private readonly Db _db;
    public SocialController(Db db) => _db = db;

    private sealed class FriendRow
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public DateTimeOffset Created { get; set; }
    }

    [HttpGet("/apisite/friends/v1/users/{userId:long}/friends")]
    public async Task<IActionResult> Friends(long userId)
    {
        if (CurrentUser.Id(HttpContext) is null) return Unauthorized();
        using var c = _db.Open();
        var rows = await c.QueryAsync<FriendRow>(@"
            select u.id as Id, u.username::text as Name, f.created as Created
            from friendship f
            join users u on u.id = case when f.user_id_a = @id then f.user_id_b else f.user_id_a end
            where (f.user_id_a = @id or f.user_id_b = @id) and u.account_status = 0
            order by f.created desc limit 50", new { id = userId });
        return Ok(new { data = rows.Select(x => new { id = x.Id, name = x.Name, displayName = x.Name, isBanned = false, created = x.Created }) });
    }

    public sealed class PresenceRequest { public long[]? UserIds { get; set; } }

    private sealed class PresenceRow
    {
        public long UserId { get; set; }
        public short PresenceType { get; set; }
        public long? PlaceId { get; set; }
        public Guid? GameId { get; set; }
        public string LastLocation { get; set; } = "Website";
        public DateTimeOffset Updated { get; set; }
    }

    [HttpPost("/apisite/presence/v1/presence/users")]
    public async Task<IActionResult> Presence([FromBody] PresenceRequest req)
    {
        if (CurrentUser.Id(HttpContext) is null) return Unauthorized();
        var ids = (req.UserIds ?? Array.Empty<long>()).Distinct().Take(100).ToArray();
        using var c = _db.Open();
        var rows = (await c.QueryAsync<PresenceRow>(@"
            select user_id as UserId, presence_type as PresenceType, place_id as PlaceId,
                   game_id as GameId, last_location as LastLocation, updated as Updated
            from user_presence where user_id = any(@ids)", new { ids })).ToDictionary(x => x.UserId);
        var data = ids.Select(id => rows.TryGetValue(id, out var p)
            ? new { userPresenceType = (int)p.PresenceType, lastLocation = p.LastLocation, placeId = p.PlaceId, rootPlaceId = p.PlaceId, gameId = p.GameId, userId = id, lastOnline = p.Updated }
            : new { userPresenceType = 0, lastLocation = "Offline", placeId = (long?)null, rootPlaceId = (long?)null, gameId = (Guid?)null, userId = id, lastOnline = DateTimeOffset.UnixEpoch });
        return Ok(new { userPresences = data });
    }

    private sealed class StatusRow
    {
        public long Id { get; set; }
        public string Body { get; set; } = "";
        public DateTimeOffset Created { get; set; }
    }

    [HttpGet("/apisite/users/v1/users/{userId:long}/status")]
    public async Task<IActionResult> GetStatus(long userId)
    {
        if (CurrentUser.Id(HttpContext) is null) return Unauthorized();
        using var c = _db.Open();
        var row = await c.QueryFirstOrDefaultAsync<StatusRow>(
            "select id as Id, body as Body, created as Created from user_status where user_id=@userId order by created desc limit 1",
            new { userId });
        return Ok(new { status = row?.Body ?? "", created = row?.Created });
    }

    private sealed class FeedRow
    {
        public long UserId { get; set; }
        public string Name { get; set; } = "";
        public string Body { get; set; } = "";
        public DateTimeOffset Created { get; set; }
    }

    [HttpGet("/apisite/users/v1/users/{userId:long}/feed")]
    public async Task<IActionResult> Feed(long userId)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        if (me.Value != userId) return Forbid();
        using var c = _db.Open();
        var rows = await c.QueryAsync<FeedRow>(@"
            select s.user_id as UserId, u.username::text as Name, s.body as Body, s.created as Created
            from user_status s join users u on u.id=s.user_id
            where s.user_id=@userId or exists (
                select 1 from friendship f where
                (f.user_id_a=@userId and f.user_id_b=s.user_id) or
                (f.user_id_b=@userId and f.user_id_a=s.user_id))
            order by s.created desc limit 30", new { userId });
        return Ok(new { data = rows.Select(x => new { userId = x.UserId, name = x.Name, status = x.Body, created = x.Created }) });
    }

    public sealed class StatusRequest { public string? Status { get; set; } }

    [HttpPost("/apisite/users/v1/users/{userId:long}/status")]
    public async Task<IActionResult> SetStatus(long userId, [FromBody] StatusRequest req)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        if (me.Value != userId) return Forbid();
        var body = (req.Status ?? "").Trim();
        if (body.Length is 0 or > 254)
            return BadRequest(new { errors = new[] { new { code = 1, message = "Status must be between 1 and 254 characters." } } });
        using var c = _db.Open();
        await c.ExecuteAsync("insert into user_status(user_id, body) values (@userId, @body)", new { userId, body });
        return Ok(new { status = body });
    }
}

[ApiController]
public sealed class GamesController : ControllerBase
{
    private readonly Db _db;
    public GamesController(Db db) => _db = db;

    private sealed class GameRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public long CreatorId { get; set; }
        public string CreatorName { get; set; } = "";
        public string? IconPath { get; set; }
        public long Playing { get; set; }
        public long Visits { get; set; }
        public long Favorites { get; set; }
        public DateTimeOffset? LastPlayed { get; set; }
    }

    [HttpGet("/apisite/games/v1/games/sorts")]
    public async Task<IActionResult> Sorts()
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        const string select = @"
            select g.id as Id, p.id as PlaceId, g.name as Name, g.creator_id as CreatorId,
                   u.username::text as CreatorName, g.icon_path as IconPath, g.visits as Visits,
                   g.favorites as Favorites, coalesce(sum(case when s.status=1 and s.last_heartbeat > now()-interval '90 seconds' then s.player_count else 0 end),0)::bigint as Playing,
                   max(r.last_played) as LastPlayed
            from game g join users u on u.id=g.creator_id join place p on p.game_id=g.id and p.is_root_place
            left join game_session s on s.place_id=p.id
            left join user_recent_game r on r.game_id=g.id and r.user_id=@me
            where g.is_active
            group by g.id,p.id,u.username";
        var all = (await c.QueryAsync<GameRow>(select, new { me })).ToList();
        object Card(GameRow g) => new
        {
            universeId = g.Id, placeId = g.PlaceId, name = g.Name,
            creatorId = g.CreatorId, creatorName = g.CreatorName,
            playerCount = g.Playing, totalVisits = g.Visits, favoritedCount = g.Favorites,
            imageUrl = string.IsNullOrWhiteSpace(g.IconPath) ? $"/thumbs/game-icon/{g.Id}/150x150.png" : g.IconPath
        };
        var cont = all.Where(x => x.LastPlayed is not null).OrderByDescending(x => x.LastPlayed).Take(6).Select(Card);
        var recommended = all.OrderBy(x => (x.Id * 1103515245L + me.Value) & 0x7fffffff).Take(6).Select(Card);
        var popular = all.OrderByDescending(x => x.Playing).ThenByDescending(x => x.Visits).ThenBy(x => x.Id).Take(6).Select(Card);
        return Ok(new { sorts = new object[] {
            new { token = "continue", displayName = "Continue", games = cont },
            new { token = "recommended", displayName = "Recommended For You", games = recommended },
            new { token = "popular", displayName = "Popular", games = popular }
        }});
    }
}

[ApiController]
public sealed class HomeMetaController : ControllerBase
{
    private readonly Db _db;
    public HomeMetaController(Db db) => _db = db;

    private sealed class MeRow
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public long Robux { get; set; }
    }

    [HttpGet("/apisite/users/v1/users/authenticated")]
    [HttpGet("/navigation/userdata")]
    public async Task<IActionResult> Authenticated()
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var row = await c.QuerySingleAsync<MeRow>(@"
            select u.id as Id, u.username::text as Name, coalesce(e.robux,0) as Robux
            from users u left join user_economy e on e.user_id=u.id where u.id=@me", new { me });
        return Ok(new { id = row.Id, name = row.Name, displayName = row.Name, robux = row.Robux,
            UserID = row.Id, UserName = row.Name, RobuxBalance = row.Robux,
            ThumbnailUrl = $"/thumbs/avatar-headshot/{row.Id}/150x150.png" });
    }

}
