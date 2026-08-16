using System.Text.Json;
using System.Text.Json.Serialization;
using Luxora.Security;
using Luxora.Services;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

/// <summary>
/// 2020-era auth endpoints, kornet-style host squash:
/// real roblox auth.roblox.com/v1|v2 -> luxora.wtf/apisite/auth/v1|v2
/// </summary>
[ApiController]
[Route("/apisite/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserService _users;
    private readonly TurnstileService _captcha;
    private readonly RobloxCookieAuth _cookie;
    private readonly LuxoraConfig _cfg;
    public AuthController(UserService users, TurnstileService captcha, RobloxCookieAuth cookie, LuxoraConfig cfg)
    { _users = users; _captcha = captcha; _cookie = cookie; _cfg = cfg; }

    // ---- GET /apisite/auth/v1/usernames/validate?username=...&birthday=... ----
    [HttpGet("v1/usernames/validate")]
    public async Task<IActionResult> ValidateUsername([FromQuery] string? username, [FromQuery] string? birthday)
    {
        var (code, msg) = await _users.ValidateUsername(username ?? "");
        // era shape; code 0 = available
        return Ok(new { code = code == UserService.UsernameCheck.Available ? 0 : (int)code, message = msg });
    }

    public sealed class SignupRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? PasswordConfirm { get; set; }
        public string? Birthday { get; set; }           // "2000-01-31" / "Jan 31, 2000" tolerated
        public JsonElement? Gender { get; set; }        // era sent "Male"/"Female" or 2/3
        public string? CaptchaToken { get; set; }
        public string? CaptchaId { get; set; }
        public string? CaptchaProvider { get; set; }
        public string[]? AgreementIds { get; set; }
        public bool IsTosAgreementBoxChecked { get; set; }
    }

    // ---- POST /apisite/auth/v2/signup ----
    [HttpPost("v2/signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        var ip = HttpContext.Items["luxora.ip"] as string;
        var ua = Request.Headers.UserAgent.ToString();

        static IActionResult Err(int code, string msg, int http = 400)
            => new ObjectResult(new { errors = new[] { new { code, message = msg } } }) { StatusCode = http };

        if (req.Username is null || req.Password is null)
            return Err(5, "Missing username or password.");

        if (req.PasswordConfirm is not null && req.Password != req.PasswordConfirm)
            return Err(4, "Passwords do not match.");

        // Turnstile (2020 used Funcaptcha; Luxora era-faithful swap — still "prove human" on signup)
        if (!await _captcha.Verify(req.CaptchaToken, ip))
        { _users.LogSignupFailure(req.Username, ip, UserService.SignupError.CaptchaFailed); return Err(0, "Token validation failed."); }

        DateOnly? bday = ParseBirthday(req.Birthday);
        var gender = ParseGender(req.Gender);
        if (gender is null)
        { _users.LogSignupFailure(req.Username, ip, UserService.SignupError.GenderInvalid); return Err(6, "Please pick a gender."); }

        var (err, msg, created) = await _users.CreateUser(req.Username, req.Password, bday, gender.Value, ip, ua);
        if (err != UserService.SignupError.None || created is null)
        {
            _users.LogSignupFailure(req.Username, ip, err);
            var code = err switch
            {
                UserService.SignupError.UsernameTaken => 1,
                UserService.SignupError.PasswordInvalid => 4,
                UserService.SignupError.UsernameInvalid => 5,
                UserService.SignupError.BirthdayInvalid => 5,
                UserService.SignupError.GenderInvalid => 6,
                UserService.SignupError.IpRateLimited => 8,
                _ => 500
            };
            return Err(code, msg);
        }

        Response.Cookies.Append(RobloxCookieAuth.CookieName, _cookie.Issue(created.SessionId), _cookie.Options());
        return Ok(new { userId = created.Id, starterRobux = _cfg.NewUser.StarterRobux });
    }

    private static DateOnly? ParseBirthday(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return null;
        if (DateOnly.TryParse(s, out var d)) return d;
        if (DateTime.TryParse(s, out var dt)) return DateOnly.FromDateTime(dt);
        return null;
    }

    private static short? ParseGender(JsonElement? g)
    {
        if (g is null || g.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined) return 0;
        var el = g.Value;
        if (el.ValueKind == JsonValueKind.Number && el.TryGetInt16(out var n)) return n is 0 or 2 or 3 ? n : null;
        if (el.ValueKind == JsonValueKind.String)
        {
            var s = el.GetString()?.Trim().ToLowerInvariant();
            return s switch { null or "" or "unknown" => 0, "male" => (short)2, "female" => (short)3, _ => null };
        }
        return null;
    }
}

/// <summary>Dead-ends the era page beacons/telemetry so the 2020 bundles run quiet.</summary>
[ApiController]
public sealed class MetaController : ControllerBase
{
    [Route("/apisite/metrics/v1/bundle-metrics/report")]
    [Route("/v1/bundle-metrics/report")]
    [AcceptVerbs("GET", "POST")]
    public IActionResult BundleMetrics() => NoContent();

    // era tracking pixel: a 204 here renders as a broken-image icon in the corner of the
    // page — serve a real transparent 1x1 GIF so it stays invisible like the original.
    private static readonly byte[] PixelGif = Convert.FromBase64String(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");

    [Route("/timg/rbx")]
    public IActionResult Timg() => File(PixelGif, "image/gif");

    [HttpGet("/apisite/abtesting/v1/enrollments")]
    public IActionResult Enrollments() => Ok(new { data = new { } });

    [HttpGet("/apisite/captcha/v1/metadata")]
    [HttpGet("/apisite/captcha/v1/captcha/metadata")]
    public IActionResult CaptchaMeta() => Ok(new { enabled = false }); // era Funcaptcha metadata: off — our glue injects Turnstile instead

    [HttpGet("/apisite/metrics/v1/thumbnails/metadata")]
    public IActionResult ThumbMeta() => Ok(new { isWebappCacheEnabled = false });

    [HttpGet("/apisite/abtesting/v1/get-enrollments")]
    public IActionResult GetEnrollments() => Ok(new { data = new { } });

    // ---- locale (era footer language selector needs these or it crashes its render) ----
    private static readonly object EnglishLocale = new
    {
        locale = new
        {
            locale = "en_us",
            name = new { name = "English", nativeName = "English" },
            language = new { id = 1, languageCode = "en", englishName = "English", nativeName = "English" },
        },
        name = "English",
        nativeName = "English",
        isEnabledForFullExperience = true,
    };

    [HttpGet("/apisite/locale/v1/locales/supported-locales")]
    public IActionResult SupportedLocales() => Ok(new { supportedLocales = new[] { EnglishLocale } });

    // the era footer dataStore reads e.data as the array itself from GET /v1/locales
    [HttpGet("/apisite/locale/v1/locales")]
    public IActionResult Locales() => Ok(new { data = new[] { EnglishLocale } });

    [HttpGet("/apisite/locale/v1/locales/user-localization-locus-supported-locales")]
    public IActionResult LocusLocales() => Ok(new
    {
        ugc = new { locale = "en_us" },
        signupAndLogin = new { locale = "en_us" },
    });

    [HttpGet("/apisite/locale/v1/locales/user-locale")]
    public IActionResult UserLocale() => Ok(new { supportedLocale = new { locale = "en_us" } });

    [HttpPost("/apisite/locale/v1/locales/set-user-supported-locale")]
    public IActionResult SetUserSupportedLocale() => Ok(new { });
}
