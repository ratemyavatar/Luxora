namespace Luxora.Services;
public sealed class GameSessionHeartbeatHostedService:BackgroundService
{
    private readonly Db _db;public GameSessionHeartbeatHostedService(Db db)=>_db=db;
    protected override async Task ExecuteAsync(CancellationToken token){while(!token.IsCancellationRequested){try{await _db.Execute("update game_session set last_heartbeat=now() where status=1");}catch{}await Task.Delay(TimeSpan.FromSeconds(30),token);}}
}
