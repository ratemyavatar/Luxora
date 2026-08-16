using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace Luxora.Security;

/// <summary>
/// Era-accurate XSRF convention: a mutating API call without a valid token gets
/// HTTP 403 with header "X-CSRF-TOKEN: {fresh}" — era JS retries with the header set.
/// Tokens are random, short-lived, and bound to session when authed (per-IP when anon).
/// </summary>
public sealed class XsrfTokenService
{
    private sealed record Entry(string Subject, DateTimeOffset Expires);
    private readonly ConcurrentDictionary<string, Entry> _tokens = new();
    private static readonly TimeSpan Ttl = TimeSpan.FromMinutes(30);

    public string Issue(string subject)
    {
        var tok = Convert.ToBase64String(RandomNumberGenerator.GetBytes(12)).TrimEnd('=');
        _tokens[tok] = new Entry(subject, DateTimeOffset.UtcNow.Add(Ttl));
        // opportunistic cleanup
        if (_tokens.Count > 100_000)
            foreach (var kv in _tokens.Where(kv => kv.Value.Expires < DateTimeOffset.UtcNow).Take(10_000).ToList())
                _tokens.TryRemove(kv.Key, out _);
        return tok;
    }

    public bool Validate(string? token, string subject)
    {
        if (string.IsNullOrEmpty(token)) return false;
        if (!_tokens.TryGetValue(token, out var e)) return false;
        if (e.Expires < DateTimeOffset.UtcNow) { _tokens.TryRemove(token, out _); return false; }
        if (e.Subject != subject) return false;
        _tokens[token] = e with { Expires = DateTimeOffset.UtcNow.Add(Ttl) }; // sliding
        return true;
    }
}

public sealed class XsrfMiddleware
{
    private static readonly HashSet<string> Mutating = new(StringComparer.OrdinalIgnoreCase) { "POST", "PUT", "PATCH", "DELETE" };
    private readonly RequestDelegate _next;
    public XsrfMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext ctx, XsrfTokenService xsrf)
    {
        var path = ctx.Request.Path.Value ?? "";
        var isApi = path.StartsWith("/apisite/", StringComparison.OrdinalIgnoreCase) || path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase);
        // era telemetry beacons POST without tokens and would just spam 403s — exempt
        var isTelemetry = path.StartsWith("/apisite/metrics/", StringComparison.OrdinalIgnoreCase)
                       || path.StartsWith("/apisite/abtesting/", StringComparison.OrdinalIgnoreCase);
        if (isApi && !isTelemetry && Mutating.Contains(ctx.Request.Method))
        {
            var subject = Subject(ctx);
            // LoginNegotiate for client joins is authenticated differently; phase-1 exempt none.
            if (!xsrf.Validate(ctx.Request.Headers["X-CSRF-TOKEN"], subject))
            {
                ctx.Response.StatusCode = 403;
                ctx.Response.Headers["X-CSRF-TOKEN"] = xsrf.Issue(subject);
                return;
            }
        }
        await _next(ctx);
    }

    public static string Subject(HttpContext ctx) =>
        ctx.Items["luxora.userId"] as string is { } uid ? "u" + uid : "ip_" + (ctx.Items["luxora.ip"] as string ?? "anon");
}

public sealed class CloudflareIpMiddleware
{
    private readonly RequestDelegate _next;
    public CloudflareIpMiddleware(RequestDelegate next) => _next = next;
    public Task Invoke(HttpContext ctx)
    {
        var ip = ctx.Request.Headers.TryGetValue("CF-Connecting-IP", out var cf) && !string.IsNullOrWhiteSpace(cf)
            ? cf.ToString()
            : ctx.Connection.RemoteIpAddress?.ToString();
        ctx.Items["luxora.ip"] = ip;
        return _next(ctx);
    }
}
