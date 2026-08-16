using System.Text.Json;

namespace Luxora.Services;

public sealed class TurnstileService
{
    private readonly LuxoraConfig _cfg;
    private readonly IHttpClientFactory _http;
    public TurnstileService(LuxoraConfig cfg, IHttpClientFactory http) { _cfg = cfg; _http = http; }

    /// <summary>Verify a Cloudflare Turnstile token. Disabled captcha = always true (dev).</summary>
    public async Task<bool> Verify(string? token, string? remoteIp)
    {
        if (!_cfg.Captcha.Enabled) return true;
        if (string.IsNullOrEmpty(token)) return false;
        var cli = _http.CreateClient();
        using var form = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["secret"] = _cfg.Captcha.Secret,
            ["response"] = token,
            ["remoteip"] = remoteIp ?? ""
        });
        try
        {
            using var res = await cli.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", form);
            var json = await res.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.TryGetProperty("success", out var s) && s.GetBoolean();
        }
        catch { return false; }
    }
}
