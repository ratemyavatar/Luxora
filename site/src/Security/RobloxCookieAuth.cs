using System.Security.Cryptography;
using System.Text;

namespace Luxora.Security;

/// <summary>
/// Issues/validates the era-accurate .ROBLOSECURITY cookie.
/// Value = WARNING_TEXT + base64url(sessionId) + "." + base64url(hmac256(sessionId, key))
/// (Roblox-era JS only checks the warning prefix + presence; the payload format is ours.)
/// </summary>
public sealed class RobloxCookieAuth
{
    public const string CookieName = ".ROBLOSECURITY";
    private const string Warning =
        "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";

    private readonly LuxoraConfig _cfg;
    private readonly byte[] _key;
    public RobloxCookieAuth(LuxoraConfig cfg)
    {
        _cfg = cfg;
        _key = Encoding.UTF8.GetBytes(cfg.Security.CookieHmacKey);
    }

    public string Issue(Guid sessionId)
    {
        var sid = sessionId.ToString("N");
        return Warning + B64(Encoding.UTF8.GetBytes(sid)) + "." + B64(Sign(sid));
    }

    public Guid? ReadSessionId(string? cookieValue)
    {
        if (string.IsNullOrEmpty(cookieValue) || !cookieValue.StartsWith(Warning)) return null;
        var body = cookieValue[Warning.Length..];
        var dot = body.LastIndexOf('.');
        if (dot < 1) return null;
        string sid;
        try { sid = Encoding.UTF8.GetString(UnB64(body[..dot])); } catch { return null; }
        var expected = Sign(sid);
        byte[] got;
        try { got = UnB64(body[(dot + 1)..]); } catch { return null; }
        return CryptographicOperations.FixedTimeEquals(got, expected) && Guid.TryParseExact(sid, "N", out var g) ? g : null;
    }

    public CookieOptions Options(DateTimeOffset? expires = null)
    {
        var o = new CookieOptions
        {
            HttpOnly = true,
            Secure = _cfg.Security.CookieSecure,
            SameSite = SameSiteMode.Lax,
            Expires = expires ?? DateTimeOffset.UtcNow.AddDays(30),
            Path = "/"
        };
        if (!string.IsNullOrWhiteSpace(_cfg.CookieDomain)) o.Domain = _cfg.CookieDomain; // blank = localhost-friendly
        return o;
    }

    private byte[] Sign(string sid)
    {
        using var h = new HMACSHA256(_key);
        return h.ComputeHash(Encoding.UTF8.GetBytes("luxora-session:" + sid));
    }

    private static string B64(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    private static byte[] UnB64(string s)
    {
        s = s.Replace('-', '+').Replace('_', '/');
        return Convert.FromBase64String(s.PadRight(s.Length + (4 - s.Length % 4) % 4, '='));
    }
}
