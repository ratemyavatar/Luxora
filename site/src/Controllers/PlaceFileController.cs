using System.Security.Cryptography;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class PlaceFileController : ControllerBase
{
    private const long MaxBytes = 100 * 1024 * 1024;
    private readonly Db _db;
    private readonly string _rccRoot;
    private readonly string _webRoot;
    public PlaceFileController(Db db, LuxoraConfig cfg, IWebHostEnvironment env)
    {
        _db = db;
        _rccRoot = Path.GetFullPath(Path.IsPathRooted(cfg.Grid.RccRoot)
            ? cfg.Grid.RccRoot : Path.Combine(env.ContentRootPath, cfg.Grid.RccRoot));
        _webRoot = env.WebRootPath;
    }

    [HttpPost("/apisite/develop/v1/places/{placeId:long}/upload")]
    [RequestSizeLimit(MaxBytes)]
    public async Task<IActionResult> Upload(long placeId, IFormFile? file)
    {
        if (file is null || file.Length == 0) return BadRequest(Error("Choose an .rbxl or .rbxlx file."));
        if (file.Length > MaxBytes) return BadRequest(Error("Place file is larger than 100 MB."));
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension is not (".rbxl" or ".rbxlx")) return BadRequest(Error("Only .rbxl and .rbxlx files are accepted."));
        await using var input = file.OpenReadStream();
        return await Save(placeId, input, extension);
    }

    // Roblox Studio 2020-compatible raw publish aliases.
    [HttpPost("/Data/Upload.ashx")]
    [HttpPost("/ide/publish/UploadExistingAsset")]
    [RequestSizeLimit(MaxBytes)]
    public async Task<IActionResult> StudioUpload([FromQuery] long? assetid, [FromQuery] long? assetId)
    {
        var id = assetid ?? assetId;
        if (id is null or <= 0) return BadRequest("missing assetId");
        if (Request.ContentLength is > MaxBytes) return BadRequest("place file is too large");
        return await Save(id.Value, Request.Body, ".rbxl");
    }

    [HttpGet("/asset")]
    public async Task<IActionResult> Asset([FromQuery] long id)
    {
        var path = await PathFor(id, requireOwner: false);
        return path is null || !System.IO.File.Exists(path) ? NotFound() : PhysicalFile(path, "application/octet-stream", enableRangeProcessing: true);
    }

    [HttpGet("/apisite/develop/v1/places/{placeId:long}/download")]
    public async Task<IActionResult> Download(long placeId)
    {
        var path = await PathFor(placeId, requireOwner: true);
        return path is null || !System.IO.File.Exists(path) ? NotFound() : PhysicalFile(path, "application/octet-stream", Path.GetFileName(path));
    }

    private async Task<IActionResult> Save(long placeId, Stream input, string extension)
    {
        var me = CurrentUser.Id(HttpContext);
        if (me is null) return Unauthorized();
        using var c = _db.Open();
        var gameId = await c.ExecuteScalarAsync<long?>(@"
            select g.id from place p join game g on g.id=p.game_id
            where p.id=@placeId and g.creator_id=@me", new { placeId, me });
        if (gameId is null) return NotFound();

        var folder = Path.Combine(_rccRoot, "places");
        Directory.CreateDirectory(folder);
        var fileName = placeId + extension;
        var destination = Path.Combine(folder, fileName);
        var temp = destination + ".upload-" + Guid.NewGuid().ToString("N");
        await using (var output = System.IO.File.Create(temp)) await input.CopyToAsync(output);
        var info = new FileInfo(temp);
        var size = info.Length;
        if (size == 0 || size > MaxBytes) { System.IO.File.Delete(temp); return BadRequest(Error("Invalid place file size.")); }
        var bytes = await System.IO.File.ReadAllBytesAsync(temp);
        var sha = Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant();
        foreach (var old in Directory.GetFiles(folder, placeId + ".rbxl*")) if (!old.Equals(temp, StringComparison.OrdinalIgnoreCase)) System.IO.File.Delete(old);
        System.IO.File.Move(temp, destination, true);
        var relative = "places/" + fileName;
        await c.ExecuteAsync(@"
            update place set rcc_file=@relative,file_version=file_version+1,file_size=@size,
                file_sha256=@sha,published=now(),updated=now() where id=@placeId",
            new { relative, size, sha, placeId });
        foreach (var kind in new[] { "game-icon", "game-thumbnail" })
        {
            var cache = Path.Combine(_webRoot, "thumbnails", kind, gameId.Value.ToString());
            if (Directory.Exists(cache)) Directory.Delete(cache, true);
        }
        return Ok(new { placeId, gameId, path = relative, size, sha256 = sha });
    }

    private async Task<string?> PathFor(long placeId, bool requireOwner)
    {
        var me = CurrentUser.Id(HttpContext);
        if (requireOwner && me is null) return null;
        using var c = _db.Open();
        var relative = await c.QueryFirstOrDefaultAsync<string?>(@"
            select p.rcc_file from place p join game g on g.id=p.game_id
            where p.id=@placeId and (@requireOwner=false or g.creator_id=@me)", new { placeId, requireOwner, me });
        if (string.IsNullOrWhiteSpace(relative)) return null;
        var path = Path.GetFullPath(Path.Combine(_rccRoot, relative.Replace('/', Path.DirectorySeparatorChar)));
        return path.StartsWith(_rccRoot, StringComparison.OrdinalIgnoreCase) ? path : null;
    }

    private static object Error(string message) => new { errors = new[] { new { code = 1, message } } };
}
