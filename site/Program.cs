using Luxora;
using Luxora.Security;
using Luxora.Services;

var builder = WebApplication.CreateBuilder(args);

// config: appsettings.json (local, gitignored) -> env vars -> example defaults
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
var cfg = builder.Configuration.GetSection("Luxora").Get<LuxoraConfig>()
          ?? throw new InvalidOperationException("Luxora config section missing — copy site/appsettings.Example.json to site/appsettings.json");
builder.Services.AddSingleton(cfg);

builder.Services.AddSingleton<Db>();
builder.Services.AddSingleton<RobloxCookieAuth>();
builder.Services.AddSingleton<XsrfTokenService>();
builder.Services.AddSingleton<TurnstileService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddHttpClient();

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = null;   // Roblox-era APIs are camelCase; we emit per-DTO instead
});

var app = builder.Build();

// quick boot check: db must answer
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Db>();
    try { await db.Execute("select 1"); app.Logger.LogInformation("Postgres OK"); }
    catch (Exception ex) { app.Logger.LogError("POSTGRES NOT REACHABLE — run db/README.md steps. {msg}", ex.Message); }
}

// real client IP behind Cloudflare
app.UseMiddleware<CloudflareIpMiddleware>();

// .ROBLOSECURITY session resolution for every request
app.UseMiddleware<SessionMiddleware>();

// Roblox-convention XSRF for API mutation calls (403 + X-CSRF-TOKEN retry-flow)
app.UseMiddleware<XsrfMiddleware>();

// processed 2020 pages (scrubbed captures + per-request config injection)
app.UseMiddleware<PageRenderMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();          // wwwroot: /bundles/* (era css/js/imgs), /luxora/* (our glue)
app.MapControllers();

app.Run();
