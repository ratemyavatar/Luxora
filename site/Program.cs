using Luxora;
using Luxora.Security;
using Luxora.Services;

var builder = WebApplication.CreateBuilder(args);

// config: appsettings.Example.json (defaults) -> appsettings.json (your local, gitignored, WINS)
builder.Configuration.AddJsonFile("appsettings.Example.json", optional: true);
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
var cfg = builder.Configuration.GetSection("Luxora").Get<LuxoraConfig>()
          ?? throw new InvalidOperationException("Luxora config section missing — copy site/appsettings.Example.json to site/appsettings.json");
builder.Services.AddSingleton(cfg);

builder.Services.AddSingleton<Db>();
builder.Services.AddSingleton<RobloxCookieAuth>();
builder.Services.AddSingleton<XsrfTokenService>();
builder.Services.AddSingleton<TurnstileService>();
builder.Services.AddSingleton<ThumbnailService>();
builder.Services.AddSingleton<RccGameService>();
builder.Services.AddSingleton<GameTicketService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddHostedService<RccProcessHostedService>();
builder.Services.AddHostedService<ThumbnailWarmupHostedService>();
builder.Services.AddHostedService<GameSessionHeartbeatHostedService>();
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

// see the REAL exception behind any 500 in the console (era-shaped 500 to the client)
app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (Exception ex)
    {
        Console.WriteLine($"[luxora][500] {ctx.Request.Method} {ctx.Request.Path}\n{ex}\n");
        if (!ctx.Response.HasStarted)
        {
            ctx.Response.StatusCode = 500;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(new { errors = new[] { new { code = 500, message = "Something went wrong. Try again." } } });
        }
    }
});

// real client IP behind Cloudflare
app.UseMiddleware<CloudflareIpMiddleware>();

// .ROBLOSECURITY session resolution for every request
app.UseMiddleware<SessionMiddleware>();

// Roblox-convention XSRF for API mutation calls (403 + X-CSRF-TOKEN retry-flow)
app.UseMiddleware<XsrfMiddleware>();

// processed 2020 pages (scrubbed captures + per-request config injection)
app.UseMiddleware<PageRenderMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // our glue must NEVER be served stale — one old cached auth.js already cost us a day
        if (ctx.Context.Request.Path.StartsWithSegments("/luxora"))
            ctx.Context.Response.Headers.CacheControl = "no-store";
    }
});          // wwwroot: /bundles/* (era css/js/imgs), /luxora/* (our glue)
app.MapControllers();

app.Run();
