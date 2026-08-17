namespace Luxora;

public sealed class LuxoraConfig
{
    public required string BaseUrl { get; set; } = "https://luxora.wtf";
    public string CookieDomain { get; set; } = ".luxora.wtf";
    public required string Postgres { get; set; }
    public SecurityCfg Security { get; set; } = new();
    public CaptchaCfg Captcha { get; set; } = new();
    public NewUserCfg NewUser { get; set; } = new();
    public GridCfg Grid { get; set; } = new();

    public sealed class SecurityCfg
    {
        public string CookieHmacKey { get; set; } = "dev-only-key-change-me";
        public bool CookieSecure { get; set; } = true;
    }
    public sealed class CaptchaCfg
    {
        public bool Enabled { get; set; } = true;
        public string Provider { get; set; } = "Turnstile";
        public string SiteKey { get; set; } = "1x00000000000000000000AA";      // CF always-pass test pair
        public string Secret { get; set; } = "1x0000000000000000000000000000000AA";
    }
    public sealed class NewUserCfg
    {
        public long StarterRobux { get; set; } = 50;
        public string HomeRedirectAfterSignup { get; set; } = "/home";
    }
    public sealed class GridCfg
    {
        public bool Enabled { get; set; } = true;
        public string SoapUrl { get; set; } = "http://127.0.0.1:64989";
        public int ThumbnailTimeoutSeconds { get; set; } = 30;
        public int ThumbnailMaxSize { get; set; } = 720;
        public string RccRoot { get; set; } = "../grid/RCCService2020";
        public bool AutoStart { get; set; } = true;
        public bool WarmUserThumbnails { get; set; } = true;
        public string GameServerAddress { get; set; } = "127.0.0.1";
        public int GamePortStart { get; set; } = 53640;
    }
}
