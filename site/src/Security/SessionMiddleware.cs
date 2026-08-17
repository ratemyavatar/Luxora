using Dapper;
using Luxora.Security;

namespace Luxora;

/// <summary>
/// Resolves .ROBLOSECURITY on every request into ctx.Items:
///   "luxora.userId" (string), "luxora.username"
/// </summary>
public sealed class SessionMiddleware
{
    private readonly RequestDelegate _next;
    public SessionMiddleware(RequestDelegate next) => _next = next;

    private sealed class SessionUser
    {
        public long UserId { get; set; }
        public string Username { get; set; } = "";
        public bool IsUnder13 { get; set; }
        public short Theme { get; set; }
        public DateTimeOffset Created { get; set; }
    }

    public async Task Invoke(HttpContext ctx, RobloxCookieAuth auth, Db db)
    {
        var sid = auth.ReadSessionId(ctx.Request.Cookies[RobloxCookieAuth.CookieName]);
        if (sid is { } id)
        {
            using var c = db.Open();
            var r = await c.QueryFirstOrDefaultAsync<SessionUser>(
                @"update user_session s set last_seen = now()
                  from users u where s.id = @id and u.id = s.user_id and u.account_status = 0
                  returning s.user_id as UserId, u.username::text as Username, u.is_under13 as IsUnder13,
                            u.theme as Theme, u.created as Created", new { id });
            if (r is not null)
            {
                ctx.Items["luxora.userId"] = r.UserId.ToString();
                ctx.Items["luxora.username"] = r.Username;
                ctx.Items["luxora.isUnder13"] = r.IsUnder13;
                ctx.Items["luxora.theme"] = r.Theme;
                ctx.Items["luxora.created"] = r.Created;
                ctx.Items["luxora.sessionId"] = id.ToString("N");
            }
        }
        await _next(ctx);
    }
}

public sealed class PageRenderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;
    private readonly Dictionary<string, string> _cache = new();
    public PageRenderMiddleware(RequestDelegate next, IWebHostEnvironment env) { _next = next; _env = env; }

    // vanity routes -> processed page templates produced by tools/pageprep.py
    private static readonly Dictionary<string, string> Routes = new(StringComparer.OrdinalIgnoreCase)
    {
        ["/"] = "landing",                 // logged-out landing = 2020 signup experience
        ["/signup"] = "landing",
        ["/login"] = "login",
        ["/newlogin"] = "login",
        ["/login/default.aspx"] = "login",
        ["/home"] = "home",
        ["/develop"] = "develop",
        ["/places/create"] = "createexperience",
        ["/universes/configure"] = "configureexperience",
        ["/discover"] = "discover",
        ["/games"] = "discover",
        ["/catalog"] = "catalog",
        ["/catalog/create"] = "catalogeditor",
        ["/catalog/configure"] = "catalogeditor",
        ["/robux"] = "navpage",
        ["/users/friends"] = "navpage",
        ["/my/messages"] = "navpage",
        ["/my/avatar"] = "navpage",
        ["/trades"] = "navpage",
        ["/my/groups"] = "navpage",
        ["/giftcards-us"] = "navpage",
        ["/premium/membership"] = "navpage",
        ["/my/account"] = "navpage",
        ["/crossdevicelogin/confirmcode"] = "navpage",
        ["/info/help"] = "navpage",
    };

    public async Task Invoke(HttpContext ctx, LuxoraConfig cfg, XsrfTokenService xsrf)
    {
        var rawPath = ctx.Request.Path.Value ?? "/";
        var path = rawPath.TrimEnd('/').Length == 0 ? "/" : rawPath.TrimEnd('/');
        Routes.TryGetValue(path, out var page);
        if (page is null && System.Text.RegularExpressions.Regex.IsMatch(path, @"^/users/\d+/profile$", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            page = "profile";
        if (page is null && System.Text.RegularExpressions.Regex.IsMatch(path, @"^/users/\d+/inventory$", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            page = "navpage";
        if (page is null && System.Text.RegularExpressions.Regex.IsMatch(path, @"^/games/\d+(?:/[^/]+)?$", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            page = "game";
        if (page is null && System.Text.RegularExpressions.Regex.IsMatch(path, @"^/catalog/\d+(?:/[^/]+)?$", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            page = "catalog";
        if (ctx.Request.Method == "GET" && page is not null)
        {
            // Signed-in users skip signup, but /login remains directly testable and can
            // switch accounts (the captured navigation currently has no reliable logout UI).
            if (ctx.Items["luxora.userId"] is not null && page == "landing")
            { ctx.Response.Redirect("/home"); return; }
            if (page != "landing" && page != "login" && ctx.Items["luxora.userId"] is null)
            { ctx.Response.Redirect("/login?returnUrl=" + Uri.EscapeDataString(ctx.Request.Path)); return; }
            var file = Path.Combine(_env.ContentRootPath, "wwwroot", "pages", page + ".htmltpl");
            if (File.Exists(file))
            {
                if (!_cache.TryGetValue(file, out var tpl))
                {
                    tpl = await File.ReadAllTextAsync(file);
                    _cache[file] = tpl;
                }
                var subject = XsrfMiddleware.Subject(ctx);
                var nav = "";
                if (tpl.Contains("{{LUXORA_UNIVERSAL_NAV}}", StringComparison.Ordinal))
                {
                    var navFile = Path.Combine(_env.ContentRootPath, "fragments", "universal-nav.htmltpl");
                    if (!_cache.TryGetValue(navFile, out var navTemplate))
                    {
                        navTemplate = File.Exists(navFile) ? await File.ReadAllTextAsync(navFile) : "";
                        _cache[navFile] = navTemplate;
                    }
                    nav = navTemplate;
                }
                var html = tpl
                    .Replace("{{LUXORA_UNIVERSAL_NAV}}", nav)
                    .Replace("{{LUXORA_XSRF}}", xsrf.Issue(subject))
                    .Replace("{{LUXORA_BASEURL}}", cfg.BaseUrl)
                    .Replace("{{LUXORA_TURNSTILE_SITEKEY}}", cfg.Captcha.Enabled ? cfg.Captcha.SiteKey : "")
                    .Replace("{{LUXORA_USERID}}", ctx.Items["luxora.userId"] as string ?? "0")
                    .Replace("{{LUXORA_USERNAME}}", ctx.Items["luxora.username"] as string ?? "Guest")
                    .Replace("{{LUXORA_ISUNDER13}}", ctx.Items["luxora.isUnder13"] is bool under13 && under13 ? "true" : "false")
                    .Replace("{{LUXORA_AGEBRACKET}}", ctx.Items["luxora.isUnder13"] is bool isUnder13 && isUnder13 ? "&lt;13" : "13+")
                    .Replace("{{LUXORA_CREATED}}", ctx.Items["luxora.created"] is DateTimeOffset created ? created.ToString("O") : "")
                    .Replace("{{LUXORA_THEME}}", ctx.Items["luxora.theme"] is short theme && theme == 1 ? "dark-theme" : "light-theme");
                ctx.Response.ContentType = "text/html; charset=utf-8";
                ctx.Response.Headers.CacheControl = "no-cache"; // never serve a stale page shell
                await ctx.Response.WriteAsync(html);
                return;
            }
        }
        await _next(ctx);
    }
}
