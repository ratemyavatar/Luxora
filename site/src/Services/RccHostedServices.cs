using System.Diagnostics;
using System.Net.Sockets;
using Dapper;

namespace Luxora.Services;

public sealed class RccProcessHostedService : BackgroundService
{
    private readonly LuxoraConfig _cfg; private readonly IWebHostEnvironment _env; private readonly ILogger<RccProcessHostedService> _log; private Process? _process;
    public RccProcessHostedService(LuxoraConfig cfg,IWebHostEnvironment env,ILogger<RccProcessHostedService> log){_cfg=cfg;_env=env;_log=log;}
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if(!_cfg.Grid.Enabled||!_cfg.Grid.AutoStart)return;
        while(!stoppingToken.IsCancellationRequested)
        {
            if(!await IsOpen()) Start();
            await Task.Delay(TimeSpan.FromSeconds(5),stoppingToken);
        }
    }
    private async Task<bool> IsOpen(){try{using var c=new TcpClient();await c.ConnectAsync("127.0.0.1",new Uri(_cfg.Grid.SoapUrl).Port);return true;}catch{return false;}}
    private void Start()
    {
        if(_process is{HasExited:false})return;var root=Path.GetFullPath(Path.IsPathRooted(_cfg.Grid.RccRoot)?_cfg.Grid.RccRoot:Path.Combine(_env.ContentRootPath,_cfg.Grid.RccRoot));var exe=Path.Combine(root,"RCCService.exe");if(!File.Exists(exe)){_log.LogWarning("RCC executable missing: {path}",exe);return;}
        var port=new Uri(_cfg.Grid.SoapUrl).Port;_process=Process.Start(new ProcessStartInfo(exe,$"-Console -verbose -settingsfile \"DevSettingsFile.json\" -port {port}"){WorkingDirectory=root,UseShellExecute=true});_log.LogInformation("Started RCCService renderer on port {port}",port);
    }
    public override Task StopAsync(CancellationToken token){try{if(_process is{HasExited:false})_process.Kill(true);}catch{}return base.StopAsync(token);}
}

public sealed class ThumbnailWarmupHostedService : BackgroundService
{
    private readonly Db _db;private readonly ThumbnailService _thumbs;private readonly LuxoraConfig _cfg;private readonly ILogger<ThumbnailWarmupHostedService> _log;
    public ThumbnailWarmupHostedService(Db db,ThumbnailService thumbs,LuxoraConfig cfg,ILogger<ThumbnailWarmupHostedService> log){_db=db;_thumbs=thumbs;_cfg=cfg;_log=log;}
    protected override async Task ExecuteAsync(CancellationToken token)
    {
        if(!_cfg.Grid.Enabled||!_cfg.Grid.WarmUserThumbnails)return;await Task.Delay(TimeSpan.FromSeconds(12),token);
        while(!token.IsCancellationRequested){try{using var c=_db.Open();var ids=await c.QueryAsync<long>("select id from users where account_status=0 order by id");foreach(var id in ids){_thumbs.GetOrQueue(ThumbnailKind.AvatarHeadshot,id,150,150);_thumbs.GetOrQueue(ThumbnailKind.Avatar,id,420,420);}}catch(Exception ex){_log.LogWarning(ex,"Thumbnail warmup failed");}await Task.Delay(TimeSpan.FromMinutes(10),token);}
    }
}
