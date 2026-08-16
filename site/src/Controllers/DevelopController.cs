using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class DevelopController : ControllerBase
{
    private readonly Db _db;
    public DevelopController(Db db) => _db = db;

    private sealed class CreationRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public bool IsActive { get; set; }
        public DateTimeOffset Updated { get; set; }
    }

    [HttpGet("/apisite/develop/v1/user/games")]
    public async Task<IActionResult> MyGames([FromQuery] bool publicOnly = false)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var rows = await c.QueryAsync<CreationRow>(@"
            select g.id as Id, p.id as PlaceId, g.name as Name, g.is_active as IsActive, g.updated as Updated
            from game g join place p on p.game_id=g.id and p.is_root_place
            where g.creator_id=@me and (not @publicOnly or g.is_active)
            order by g.updated desc, g.id desc", new { me, publicOnly });
        return Ok(new { data = rows.Select(x => new
        {
            id = x.Id, rootPlaceId = x.PlaceId, name = x.Name, isActive = x.IsActive,
            updated = x.Updated, imageUrl = $"/thumbs/game-icon/{x.Id}/150x150.png"
        }) });
    }
}
