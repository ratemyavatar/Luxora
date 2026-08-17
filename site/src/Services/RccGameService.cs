using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
using Dapper;

namespace Luxora.Services;

public sealed class StartedGameServer
{
    public Guid Id { get; set; }
    public long PlaceId { get; set; }
    public string Address { get; set; } = "";
    public int Port { get; set; }
    public StartedGameServer() { }
    public StartedGameServer(Guid id,long placeId,string address,int port){Id=id;PlaceId=placeId;Address=address;Port=port;}
}
public sealed class RccGameService
{
    private readonly Db _db;private readonly LuxoraConfig _cfg;private readonly IHttpClientFactory _http;private readonly ILogger<RccGameService> _log;private readonly SemaphoreSlim _gate=new(1,1);
    public RccGameService(Db db,LuxoraConfig cfg,IHttpClientFactory http,ILogger<RccGameService> log){_db=db;_cfg=cfg;_http=http;_log=log;}
    private sealed class PlaceRow{public long PlaceId{get;set;}public long GameId{get;set;}public long CreatorId{get;set;}public int MaxPlayers{get;set;}public string? RccFile{get;set;}}
    public async Task<StartedGameServer?> GetOrStart(long placeId)
    {
        await _gate.WaitAsync();try
        {
            using var c=_db.Open();var existing=await c.QueryFirstOrDefaultAsync<StartedGameServer>(@"select id as Id,place_id as PlaceId,server_ip::text as Address,server_port as Port from game_session where place_id=@placeId and status=1 and last_heartbeat>now()-interval '90 seconds' and player_count<max_players order by player_count desc limit 1",new{placeId});if(existing is not null)return existing;
            var p=await c.QueryFirstOrDefaultAsync<PlaceRow>(@"select p.id as PlaceId,g.id as GameId,g.creator_id as CreatorId,g.max_players as MaxPlayers,p.rcc_file as RccFile from place p join game g on g.id=p.game_id where p.id=@placeId and g.is_active",new{placeId});if(p is null||string.IsNullOrWhiteSpace(p.RccFile))return null;
            var gamePort=FindPort(_cfg.Grid.GamePortStart,50);if(gamePort==0)throw new InvalidOperationException("No game-server port is free");var job=Guid.NewGuid();
            var payload=JsonSerializer.Serialize(new{Mode="GameServer",GameId=job.ToString(),Settings=new{Type="GameOpen",PlaceId=placeId,SessionId=Guid.NewGuid().ToString(),CreatorId=p.CreatorId,GameId=job.ToString(),MachineAddress=_cfg.Grid.GameServerAddress,GsmInterval=5,MaxPlayers=p.MaxPlayers,MaxGameInstances=1,ApiKey="Luxora",PreferredPlayerCapacity=p.MaxPlayers,DataCenterId="1",PlaceVisitAccessKey="",UniverseId=p.GameId,PlaceFetchUrl=$"{_cfg.BaseUrl}/asset/?id={placeId}",MatchmakingContextId=1,CreatorType="User",PlaceVersion=1,BaseUrl=_cfg.BaseUrl,JobId=job.ToString(),script="print('Luxora RCC Init')",PreferredPort=gamePort},Arguments=new{}});
            await OpenJob(job,payload,43600,0);
            await c.ExecuteAsync(@"insert into game_session(id,place_id,server_ip,server_port,status,player_count,max_players,last_heartbeat) values(@job,@placeId,cast(@ip as inet),@port,1,0,@max,now())",new{job,placeId,ip=_cfg.Grid.GameServerAddress,port=gamePort,max=p.MaxPlayers});
            _log.LogInformation("RCC game server {job} opened for place {place} on {port}",job,placeId,gamePort);return new(job,placeId,_cfg.Grid.GameServerAddress,gamePort);
        }finally{_gate.Release();}
    }
    private async Task OpenJob(Guid id,string payload,int expiration,int category)
    {
        XNamespace soap="http://schemas.xmlsoap.org/soap/envelope/",rcc="http://roblox.com/";var doc=new XDocument(new XElement(soap+"Envelope",new XAttribute(XNamespace.Xmlns+"soap",soap),new XElement(soap+"Body",new XElement(rcc+"OpenJob",new XElement(rcc+"job",new XElement(rcc+"id",id.ToString()),new XElement(rcc+"expirationInSeconds",expiration),new XElement(rcc+"category",category),new XElement(rcc+"cores",1)),new XElement(rcc+"script",new XElement(rcc+"name","GameServer"),new XElement(rcc+"script",payload)),new XElement(rcc+"arguments",new XElement(rcc+"LuaValue",new XElement(rcc+"type","LUA_TNIL"))))));
        var client=_http.CreateClient();client.Timeout=TimeSpan.FromSeconds(30);using var content=new StringContent(doc.ToString(SaveOptions.DisableFormatting),Encoding.UTF8,"text/xml");using var response=await client.PostAsync(_cfg.Grid.SoapUrl,content);var body=await response.Content.ReadAsStringAsync();if(!response.IsSuccessStatusCode||body.Contains("Fault",StringComparison.OrdinalIgnoreCase))throw new InvalidOperationException("RCC game OpenJob failed: "+body[..Math.Min(body.Length,500)]);
    }
    private static int FindPort(int start,int count){for(var p=start;p<start+count;p++){try{var l=new TcpListener(IPAddress.Any,p);l.Start();l.Stop();return p;}catch{}}return 0;}
}
