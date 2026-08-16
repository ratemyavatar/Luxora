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

    public async Task Invoke(HttpContext ctx, RobloxCookieAuth auth, Db db)
    {
        var sid = auth.ReadSessionId(ctx.Request.Cookies[RobloxCookieAuth.CookieName]);
        if (sid is { } id)
        {
            using var c = db.Open();
            var row = await c.QueryFirstOrDefaultAsync<(long userId, string username)?>(
                @"update user_session s set last_seen = now()
                  from users u where s.id = @id and u.id = s.user_id and u.account_status = 0
                  returning s.user_id as userId, u.username as username", new { id });
            if (row is { } r)
            {
                ctx.Items["luxora.userId"] = r.userId.ToString();
                ctx.Items["luxora.username"] = r.username;
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
        ["/login"] = "login",              // wired in the login phase (template may not exist yet)
    };

    public async Task Invoke(HttpContext ctx, LuxoraConfig cfg, XsrfTokenService xsrf)
    {
        if ((ctx.Request.Method == "GET") && Routes.TryGetValue(ctx.Request.Path.Value?.TrimEnd('/').Length == 0 ? "/" : ctx.Request.Path.Value ?? "", out var page))
        {
            var file = Path.Combine(_env.ContentRootPath, "wwwroot", "pages", page + ".htmltpl");
            if (File.Exists(file))
            {
                if (!_cache.TryGetValue(file, out var tpl))
                {
                    tpl = await File.ReadAllTextAsync(file);
                    _cache[file] = tpl;
                }
                var subject = XsrfMiddleware.Subject(ctx);
                var html = tpl
                    .Replace("{{LUXORA_XSRF}}", xsrf.Issue(subject))
                    .Replace("{{LUXORA_BASEURL}}", cfg.BaseUrl)
                    .Replace("{{LUXORA_TURNSTILE_SITEKEY}}", cfg.Captcha.Enabled ? cfg.Captcha.SiteKey : "");
                ctx.Response.ContentType = "text/html; charset=utf-8";
                ctx.Response.Headers.CacheControl = "no-cache"; // never serve a stale page shell
                await ctx.Response.WriteAsync(html);
                return;
            }
        }
        await _next(ctx);
    }
}
