using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
using Dapper;

namespace Luxora.Services;

public enum ThumbnailKind { AvatarHeadshot, Avatar, GameIcon, GameThumbnail }
public enum ThumbnailState { Pending, Completed, Error }
public sealed record ThumbnailResult(ThumbnailState State, string? Url, string? Error = null);

/// <summary>
/// RCCService 2020 thumbnail bridge. Browser/API thumbnail requests resolve to a
/// deterministic local file; cache misses are rendered through RCC's SOAP OpenJob.
/// </summary>
public sealed class ThumbnailService
{
    private const string RendererVersion = "rcc2";
    private readonly Db _db;
    private readonly LuxoraConfig _cfg;
    private readonly IHttpClientFactory _http;
    private readonly ILogger<ThumbnailService> _log;
    private readonly string _root;
    private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();
    private readonly ConcurrentDictionary<string, byte> _queued = new();

    public ThumbnailService(Db db, LuxoraConfig cfg, IHttpClientFactory http, IWebHostEnvironment env, ILogger<ThumbnailService> log)
    {
        _db = db; _cfg = cfg; _http = http; _log = log;
        _root = Path.Combine(env.WebRootPath, "thumbnails");
    }

    public static ThumbnailKind ParseKind(string? type) => (type ?? "").Replace("-", "").ToLowerInvariant() switch
    {
        "avatarheadshot" or "headshot" => ThumbnailKind.AvatarHeadshot,
        "avatar" or "avatarthumbnail" => ThumbnailKind.Avatar,
        "gameicon" or "gameicons" => ThumbnailKind.GameIcon,
        "gamethumbnail" or "game" or "place" => ThumbnailKind.GameThumbnail,
        _ => ThumbnailKind.AvatarHeadshot,
    };

    public (int Width, int Height) ClampSize(string? size, int fallback = 150)
    {
        var bits = (size ?? "").ToLowerInvariant().Split('x');
        var w = bits.Length > 0 && int.TryParse(bits[0], out var parsedW) ? parsedW : fallback;
        var h = bits.Length > 1 && int.TryParse(bits[1], out var parsedH) ? parsedH : w;
        var max = Math.Clamp(_cfg.Grid.ThumbnailMaxSize, 48, 2048);
        return (Math.Clamp(w, 1, max), Math.Clamp(h, 1, max));
    }

    public string Url(ThumbnailKind kind, long targetId, int width, int height)
        => $"/thumbnails/{KindName(kind)}/{targetId}/{width}x{height}-{RendererVersion}.png";

    private string DiskPath(ThumbnailKind kind, long targetId, int width, int height)
        => Path.Combine(_root, KindName(kind), targetId.ToString(), $"{width}x{height}-{RendererVersion}.png");

    public ThumbnailResult GetOrQueue(ThumbnailKind kind, long targetId, int width, int height)
    {
        var disk = DiskPath(kind, targetId, width, height);
        if (File.Exists(disk)) return new(ThumbnailState.Completed, Url(kind, targetId, width, height));
        var key = Key(kind, targetId, width, height);
        if (_queued.TryAdd(key, 0))
            _ = Task.Run(async () => { try { await RenderAsync(kind, targetId, width, height); } catch { } finally { _queued.TryRemove(key, out _); } });
        return new(ThumbnailState.Pending, null);
    }

    public async Task<ThumbnailResult> RenderAsync(ThumbnailKind kind, long targetId, int width, int height)
    {
        var disk = DiskPath(kind, targetId, width, height);
        var url = Url(kind, targetId, width, height);
        if (File.Exists(disk)) return new(ThumbnailState.Completed, url);
        if (!_cfg.Grid.Enabled) return new(ThumbnailState.Error, null, "RCC thumbnails are disabled");

        var key = Key(kind, targetId, width, height);
        var gate = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync();
        try
        {
            if (File.Exists(disk)) return new(ThumbnailState.Completed, url);
            await SaveState(kind, targetId, width, height, 0, null, null);
            var script = await BuildScript(kind, targetId, width, height);
            if (script is null)
            {
                const string msg = "Target has no RCC source file";
                await SaveState(kind, targetId, width, height, 2, null, msg);
                return new(ThumbnailState.Error, null, msg);
            }
            var bytes = await ExecuteOpenJob(script);
            Directory.CreateDirectory(Path.GetDirectoryName(disk)!);
            var temp = disk + ".tmp-" + Guid.NewGuid().ToString("N");
            await File.WriteAllBytesAsync(temp, bytes);
            File.Move(temp, disk, true);
            await SaveState(kind, targetId, width, height, 1, url, null);
            _log.LogInformation("RCC thumbnail ready: {kind} {target} {width}x{height}", kind, targetId, width, height);
            return new(ThumbnailState.Completed, url);
        }
        catch (Exception ex)
        {
            var msg = ex.Message.Length > 500 ? ex.Message[..500] : ex.Message;
            _log.LogWarning(ex, "RCC thumbnail failed: {kind} {target} {width}x{height}", kind, targetId, width, height);
            try { await SaveState(kind, targetId, width, height, 2, null, msg); } catch { }
            return new(ThumbnailState.Error, null, msg);
        }
        finally { gate.Release(); }
    }

    private async Task<string?> BuildScript(ThumbnailKind kind, long targetId, int width, int height)
    {
        // This RCC train does not execute raw Lua from OpenJob. Its script field is
        // a JSON dispatcher envelope; Mode=Thumbnail loads internalscripts/thumbnails/{Type}.lua.
        if (kind is ThumbnailKind.Avatar or ThumbnailKind.AvatarHeadshot)
        {
            var type = kind == ThumbnailKind.AvatarHeadshot ? "LuxoraHeadshot" : "LuxoraAvatar";
            return JsonSerializer.Serialize(new
            {
                Mode = "Thumbnail",
                Settings = new { Type = type, Arguments = new object[] { targetId, _cfg.BaseUrl, "PNG", width, height } }
            });
        }

        using var c = _db.Open();
        var source = await c.QueryFirstOrDefaultAsync<string?>(@"
            select p.rcc_file from place p join game g on g.id=p.game_id
            where g.id=@targetId and p.is_root_place limit 1", new { targetId });
        if (string.IsNullOrWhiteSpace(source)) return null;
        var asset = source.Contains("://", StringComparison.Ordinal) ? source : "rbxasset://" + source.Replace('\\', '/');
        return JsonSerializer.Serialize(new
        {
            Mode = "Thumbnail",
            Settings = new
            {
                Type = "Place",
                Arguments = new object[] { asset, "PNG", width, height, _cfg.BaseUrl, targetId }
            }
        });
    }

    private async Task<byte[]> ExecuteOpenJob(string script)
    {
        XNamespace soap = "http://schemas.xmlsoap.org/soap/envelope/";
        XNamespace rcc = "http://roblox.com/";
        var jobId = Guid.NewGuid().ToString("N");
        var document = new XDocument(
            new XElement(soap + "Envelope",
                new XAttribute(XNamespace.Xmlns + "SOAP-ENV", soap),
                new XAttribute(XNamespace.Xmlns + "ns1", rcc),
                new XElement(soap + "Body",
                    new XElement(rcc + "OpenJob",
                        new XElement(rcc + "job",
                            new XElement(rcc + "id", jobId),
                            new XElement(rcc + "expirationInSeconds", 30),
                            new XElement(rcc + "category", 1),
                            new XElement(rcc + "cores", 1)),
                        new XElement(rcc + "script",
                            new XElement(rcc + "name", "LuxoraThumbnail"),
                            new XElement(rcc + "script", script))))));

        var client = _http.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(Math.Clamp(_cfg.Grid.ThumbnailTimeoutSeconds, 5, 120));
        using var content = new StringContent(document.ToString(SaveOptions.DisableFormatting), Encoding.UTF8, "text/xml");
        content.Headers.ContentType = new MediaTypeHeaderValue("text/xml") { CharSet = "utf-8" };
        using var response = await client.PostAsync(_cfg.Grid.SoapUrl, content);
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode) throw new InvalidOperationException($"RCC SOAP returned {(int)response.StatusCode}");

        var xml = XDocument.Parse(body);
        var fault = xml.Descendants().FirstOrDefault(x => x.Name.LocalName.Equals("Fault", StringComparison.OrdinalIgnoreCase));
        if (fault is not null) throw new InvalidOperationException("RCC SOAP fault: " + fault.Value.Trim());
        var encoded = xml.Descendants().FirstOrDefault(x => x.Name.LocalName == "value" && !string.IsNullOrWhiteSpace(x.Value))?.Value.Trim();
        if (string.IsNullOrWhiteSpace(encoded)) throw new InvalidOperationException("RCC returned no thumbnail value");
        var bytes = Convert.FromBase64String(encoded);
        if (bytes.Length < 8 || bytes[0] != 0x89 || bytes[1] != 0x50 || bytes[2] != 0x4e || bytes[3] != 0x47)
            throw new InvalidOperationException("RCC result was not a PNG");
        return bytes;
    }

    private async Task SaveState(ThumbnailKind kind, long targetId, int width, int height, short state, string? path, string? error)
    {
        using var c = _db.Open();
        await c.ExecuteAsync(@"
            insert into thumbnail(target_type,target_id,width,height,format,state,relative_path,error)
            values (@kind,@targetId,@width,@height,'png',@state,@path,@error)
            on conflict(target_type,target_id,width,height,format) do update
            set state=excluded.state, relative_path=excluded.relative_path, error=excluded.error, updated=now()",
            new { kind = KindName(kind), targetId, width, height, state, path, error });
    }

    private static string KindName(ThumbnailKind kind) => kind switch
    {
        ThumbnailKind.AvatarHeadshot => "avatar-headshot",
        ThumbnailKind.Avatar => "avatar",
        ThumbnailKind.GameIcon => "game-icon",
        _ => "game-thumbnail",
    };
    private static string Key(ThumbnailKind kind, long id, int w, int h) => $"{kind}:{id}:{w}:{h}";
}
