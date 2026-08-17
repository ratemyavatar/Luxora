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

    private sealed class GameDetailRow
    {
        public long Id { get; set; }
        public long PlaceId { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Genre { get; set; } = "All";
        public string AccessMode { get; set; } = "Everyone";
        public int MaxPlayers { get; set; }
        public long? TemplateId { get; set; }
        public bool IsCopyingAllowed { get; set; }
        public bool IsActive { get; set; }
        public string SocialSlotType { get; set; } = "Automatic";
        public int CustomSocialSlots { get; set; }
        public string[] PlayableDevices { get; set; } = Array.Empty<string>();
        public bool PrivateServersAllowed { get; set; }
        public bool PrivateServersFree { get; set; }
        public long PrivateServerPrice { get; set; }
        public bool AllGearGenresAllowed { get; set; }
        public string[] AllowedGearTypes { get; set; } = Array.Empty<string>();
        public string ChatType { get; set; } = "Classic";
        public bool OverridesDefaultAvatar { get; set; }
        public bool HasPlaceFile { get; set; }
    }

    public sealed class SaveGameRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public string? Access { get; set; }
        public int NumberOfPlayersMax { get; set; } = 20;
        public long? TemplateId { get; set; }
        public bool IsCopyingAllowed { get; set; }
        public bool IsActive { get; set; }
        public string? SocialSlotType { get; set; }
        public int NumberOfCustomSocialSlots { get; set; }
        public string[]? PlayableDevices { get; set; }
        public bool ArePrivateServersAllowed { get; set; }
        public bool IsFreePrivateServer { get; set; } = true;
        public long PrivateServersPrice { get; set; }
        public bool IsAllGenresAllowed { get; set; }
        public string[]? AllowedGearTypes { get; set; }
        public string? ChatType { get; set; }
        public bool OverridesDefaultAvatar { get; set; }
    }

    [HttpGet("/apisite/develop/v1/user/games")]
    public async Task<IActionResult> MyGames([FromQuery] bool publicOnly = false)
    {
        Response.Headers.CacheControl = "no-store";
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


    [HttpGet("/apisite/develop/v1/games/{gameId:long}")]
    public async Task<IActionResult> Game(long gameId)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var row = await c.QueryFirstOrDefaultAsync<GameDetailRow>(@"
            select g.id as Id, p.id as PlaceId, g.name as Name, g.description as Description,
                   g.genre as Genre, g.access_mode as AccessMode, g.max_players as MaxPlayers,
                   g.template_id as TemplateId, g.is_copying_allowed as IsCopyingAllowed,
                   g.is_active as IsActive, g.social_slot_type as SocialSlotType,
                   g.custom_social_slots as CustomSocialSlots, g.playable_devices as PlayableDevices,
                   g.private_servers_allowed as PrivateServersAllowed, g.private_servers_free as PrivateServersFree,
                   g.private_server_price as PrivateServerPrice, g.all_gear_genres_allowed as AllGearGenresAllowed,
                   g.allowed_gear_types as AllowedGearTypes, g.chat_type as ChatType,
                   g.overrides_default_avatar as OverridesDefaultAvatar,
                   (p.rcc_file is not null) as HasPlaceFile
            from game g join place p on p.game_id=g.id and p.is_root_place
            where g.id=@gameId and g.creator_id=@me", new { gameId, me });
        if (row is null) return NotFound();
        return Ok(new { id = row.Id, rootPlaceId = row.PlaceId, name = row.Name,
            description = row.Description, genre = row.Genre, access = row.AccessMode,
            numberOfPlayersMax = row.MaxPlayers, templateId = row.TemplateId,
            isCopyingAllowed = row.IsCopyingAllowed, isActive = row.IsActive,
            socialSlotType = row.SocialSlotType, numberOfCustomSocialSlots = row.CustomSocialSlots,
            playableDevices = row.PlayableDevices, arePrivateServersAllowed = row.PrivateServersAllowed,
            isFreePrivateServer = row.PrivateServersFree, privateServersPrice = row.PrivateServerPrice,
            isAllGenresAllowed = row.AllGearGenresAllowed, allowedGearTypes = row.AllowedGearTypes,
            chatType = row.ChatType, overridesDefaultAvatar = row.OverridesDefaultAvatar,
            hasPlaceFile = row.HasPlaceFile });
    }

    [HttpPost("/apisite/develop/v1/games")]
    public async Task<IActionResult> Create([FromBody] SaveGameRequest request)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        var error = Validate(request, out var name);
        if (error is not null) return BadRequest(new { errors = new[] { new { code = 1, message = error } } });
        using var c = _db.Open();
        using var tx = await c.BeginTransactionAsync();
        var gameId = await c.ExecuteScalarAsync<long>(@"
            insert into game(name,description,creator_id,is_active,max_players,genre,access_mode,
                             is_copying_allowed,template_id,social_slot_type,custom_social_slots,
                             playable_devices,private_servers_allowed,private_servers_free,private_server_price,
                             all_gear_genres_allowed,allowed_gear_types,chat_type,overrides_default_avatar)
            values(@name,@description,@me,true,@maxPlayers,@genre,@access,@copying,@templateId,@social,@slots,
                   @devices,@privateAllowed,@privateFree,@privatePrice,@allGear,@gearTypes,@chatType,@avatarOverride)
            returning id", Values(request, name, me.Value), tx);
        var placeId = await c.ExecuteScalarAsync<long>(@"
            insert into place(game_id,name,is_root_place) values(@gameId,@name,true) returning id",
            new { gameId, name }, tx);
        await tx.CommitAsync();
        return Ok(new { id = gameId, rootPlaceId = placeId });
    }

    [HttpPut("/apisite/develop/v1/games/{gameId:long}")]
    public async Task<IActionResult> Update(long gameId, [FromBody] SaveGameRequest request)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        var error = Validate(request, out var name);
        if (error is not null) return BadRequest(new { errors = new[] { new { code = 1, message = error } } });
        using var c = _db.Open();
        using var tx = await c.BeginTransactionAsync();
        var values = Values(request, name, me.Value);
        values.Add("gameId", gameId);
        var changed = await c.ExecuteAsync(@"
            update game set name=@name,description=@description,is_active=@active,max_players=@maxPlayers,
                genre=@genre,access_mode=@access,is_copying_allowed=@copying,template_id=@templateId,
                social_slot_type=@social,custom_social_slots=@slots,playable_devices=@devices,
                private_servers_allowed=@privateAllowed,private_servers_free=@privateFree,
                private_server_price=@privatePrice,all_gear_genres_allowed=@allGear,
                allowed_gear_types=@gearTypes,chat_type=@chatType,overrides_default_avatar=@avatarOverride,updated=now()
            where id=@gameId and creator_id=@me", values, tx);
        if (changed == 0) { await tx.RollbackAsync(); return NotFound(); }
        await c.ExecuteAsync("update place set name=@name,updated=now() where game_id=@gameId and is_root_place",
            new { name, gameId }, tx);
        await tx.CommitAsync();
        return Ok(new { id = gameId });
    }

    public sealed class ActiveRequest { public bool IsActive { get; set; } }
    [HttpPost("/apisite/develop/v1/games/{gameId:long}/active")]
    public async Task<IActionResult> Active(long gameId, [FromBody] ActiveRequest request)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var changed = await c.ExecuteAsync("update game set is_active=@active,updated=now() where id=@gameId and creator_id=@me",
            new { active = request.IsActive, gameId, me });
        return changed == 0 ? NotFound() : Ok(new { id = gameId, isActive = request.IsActive });
    }

    [HttpDelete("/apisite/develop/v1/games/{gameId:long}")]
    public async Task<IActionResult> Delete(long gameId)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var changed = await c.ExecuteAsync("delete from game where id=@gameId and creator_id=@me", new { gameId, me });
        return changed == 0 ? NotFound() : NoContent();
    }

    private static string? Validate(SaveGameRequest request, out string name)
    {
        name = (request.Name ?? "").Trim();
        if (name.Length is < 1 or > 50) return "Name must be between 1 and 50 characters.";
        if ((request.Description ?? "").Length > 1000) return "Description is too long.";
        if (request.NumberOfPlayersMax is < 1 or > 100) return "Maximum Visitor Count must be from 1 to 100.";
        if (request.PrivateServersPrice is < 0 or > 10000) return "Private server price is invalid.";
        return null;
    }

    private static DynamicParameters Values(SaveGameRequest r, string name, long me)
    {
        var values = new DynamicParameters();
        values.Add("name", name);
        values.Add("description", (r.Description ?? "").Trim());
        values.Add("me", me);
        values.Add("active", r.IsActive);
        values.Add("maxPlayers", Math.Clamp(r.NumberOfPlayersMax, 1, 100));
        values.Add("genre", r.Genre ?? "All");
        values.Add("access", r.Access is "Friends" ? "Friends" : "Everyone");
        values.Add("copying", r.IsCopyingAllowed);
        values.Add("templateId", r.TemplateId);
        values.Add("social", r.SocialSlotType ?? "Automatic");
        values.Add("slots", Math.Clamp(r.NumberOfCustomSocialSlots, 0, 100));
        var allowedDevices = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Computer", "Phone", "Tablet", "Console" };
        values.Add("devices", (r.PlayableDevices ?? Array.Empty<string>()).Where(allowedDevices.Contains).Distinct(StringComparer.OrdinalIgnoreCase).ToArray());
        values.Add("privateAllowed", r.ArePrivateServersAllowed);
        values.Add("privateFree", r.IsFreePrivateServer);
        values.Add("privatePrice", r.IsFreePrivateServer ? 0 : Math.Clamp(r.PrivateServersPrice, 0, 10000));
        values.Add("allGear", r.IsAllGenresAllowed);
        var gear = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Melee", "PowerUps", "Ranged", "Navigation", "Explosive", "Musical", "Social", "PersonalTransport", "Building" };
        values.Add("gearTypes", (r.AllowedGearTypes ?? Array.Empty<string>()).Where(gear.Contains).Distinct(StringComparer.OrdinalIgnoreCase).ToArray());
        values.Add("chatType", r.ChatType is "Classic" or "Bubble" ? r.ChatType : "Classic");
        values.Add("avatarOverride", r.OverridesDefaultAvatar);
        return values;
    }

}
