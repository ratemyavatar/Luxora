using System.Text.Json;
using Luxora.Services;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class ThumbnailController : ControllerBase
{
    private readonly ThumbnailService _thumbs;
    private readonly LuxoraConfig _cfg;
    public ThumbnailController(ThumbnailService thumbs, LuxoraConfig cfg) { _thumbs = thumbs; _cfg = cfg; }

    public sealed class BatchRequest
    {
        public JsonElement RequestId { get; set; }
        public long TargetId { get; set; }
        public string? Type { get; set; }
        public string? Size { get; set; }
        public string? Format { get; set; }
        public bool IsCircular { get; set; }
    }

    [HttpPost("/apisite/thumbnails/v1/batch")]
    public IActionResult Batch([FromBody] BatchRequest[]? requests)
    {
        var data = (requests ?? Array.Empty<BatchRequest>()).Take(100).Select(request =>
        {
            var kind = ThumbnailService.ParseKind(request.Type);
            var (width, height) = _thumbs.ClampSize(request.Size);
            var result = _thumbs.GetOrQueue(kind, request.TargetId, width, height);
            return new
            {
                requestId = RequestId(request.RequestId), targetId = request.TargetId,
                state = State(result.State), imageUrl = result.Url, version = "RCC1"
            };
        });
        return Ok(new { data });
    }

    [HttpGet("/apisite/thumbnails/v1/users/avatar-headshot")]
    public IActionResult AvatarHeadshots([FromQuery] string? userIds, [FromQuery] string? size)
        => Collection(ThumbnailKind.AvatarHeadshot, userIds, size);

    [HttpGet("/apisite/thumbnails/v1/users/avatar")]
    public IActionResult Avatars([FromQuery] string? userIds, [FromQuery] string? size)
        => Collection(ThumbnailKind.Avatar, userIds, size);

    [HttpGet("/apisite/thumbnails/v1/games/icons")]
    public IActionResult GameIcons([FromQuery] string? universeIds, [FromQuery] string? size)
        => Collection(ThumbnailKind.GameIcon, universeIds, size);

    [HttpGet("/apisite/thumbnails/v1/games/multiget/thumbnails")]
    public IActionResult GameThumbnails([FromQuery] string? universeIds, [FromQuery] string? size)
        => Collection(ThumbnailKind.GameThumbnail, universeIds, size ?? "768x432");

    [HttpGet("/thumbs/{kind}/{targetId:long}/{size}.png")]
    public async Task<IActionResult> Image(string kind, long targetId, string size)
        => await RenderImage(ThumbnailService.ParseKind(kind), targetId, size);

    [HttpGet("/headshot-thumbnail/image")]
    public async Task<IActionResult> LegacyHeadshot([FromQuery] long userId, [FromQuery] int width = 150, [FromQuery] int height = 150)
        => await RenderImage(ThumbnailKind.AvatarHeadshot, userId, $"{width}x{height}");

    [HttpGet("/avatar-thumbnail/image")]
    [HttpGet("/Thumbs/Avatar.ashx")]
    public async Task<IActionResult> LegacyAvatar([FromQuery] long userId, [FromQuery] int width = 150, [FromQuery] int height = 150)
        => await RenderImage(ThumbnailKind.Avatar, userId, $"{width}x{height}");

    [HttpGet("/apisite/thumbnails/luxora/rcc-status")]
    public IActionResult Status() => Ok(new { enabled = _cfg.Grid.Enabled, soapUrl = _cfg.Grid.SoapUrl, renderer = "RCCService 2020 OpenJob" });

    private IActionResult Collection(ThumbnailKind kind, string? ids, string? size)
    {
        var (width, height) = _thumbs.ClampSize(size);
        var targets = (ids ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(x => long.TryParse(x, out var id) ? id : 0).Where(x => x > 0).Distinct().Take(100);
        var data = targets.Select(id =>
        {
            var result = _thumbs.GetOrQueue(kind, id, width, height);
            return new { targetId = id, state = State(result.State), imageUrl = result.Url, version = "RCC1" };
        });
        return Ok(new { data });
    }

    private async Task<IActionResult> RenderImage(ThumbnailKind kind, long targetId, string size)
    {
        var (width, height) = _thumbs.ClampSize(size);
        var result = await _thumbs.RenderAsync(kind, targetId, width, height);
        Response.Headers.CacheControl = result.State == ThumbnailState.Completed ? "public,max-age=300" : "no-store";
        if (result.State == ThumbnailState.Completed && result.Url is not null) return Redirect(result.Url);
        return Redirect("/bundles/img/__thumb.png");
    }

    private static string State(ThumbnailState state) => state switch
    {
        ThumbnailState.Completed => "Completed",
        ThumbnailState.Pending => "Pending",
        _ => "Error",
    };

    private static object? RequestId(JsonElement id) => id.ValueKind switch
    {
        JsonValueKind.String => id.GetString(),
        JsonValueKind.Number when id.TryGetInt64(out var n) => n,
        _ => null,
    };
}
