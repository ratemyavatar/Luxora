using Dapper;
using Luxora.Services;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class GameJoinController:ControllerBase
{
    private readonly GameTicketService _tickets;private readonly Db _db;private readonly LuxoraConfig _cfg;
    public GameJoinController(GameTicketService tickets,Db db,LuxoraConfig cfg){_tickets=tickets;_db=db;_cfg=cfg;}
    private sealed class JoinUser{public string Name{get;set;}="";public DateTimeOffset Created{get;set;}public long CreatorId{get;set;}public long GameId{get;set;}}
    [HttpGet("/game/join-script")]
    [HttpGet("/game/PlaceLauncher.ashx")]
    public async Task<IActionResult> Script([FromQuery]Guid ticket)
    {
        var t=_tickets.Get(ticket);if(t is null)return Unauthorized();using var c=_db.Open();var u=await c.QueryFirstOrDefaultAsync<JoinUser>(@"select u.username::text as Name,u.created as Created,g.creator_id as CreatorId,g.id as GameId from users u cross join place p join game g on g.id=p.game_id where u.id=@uid and p.id=@pid",new{uid=t.UserId,pid=t.PlaceId});if(u is null)return NotFound();var age=Math.Max(0,(int)(DateTimeOffset.UtcNow-u.Created).TotalDays);
        return Ok(new{ClientPort=0,MachineAddress=t.Address,ServerPort=t.Port,DirectServerReturn=true,PingUrl="",PingInterval=0,UserName=u.Name,DisplayName=u.Name,SeleniumTestMode=false,UserId=t.UserId,RobloxLocale="en_us",GameLocale="en_us",SuperSafeChat=false,CharacterAppearance=$"{_cfg.BaseUrl}/v1.1/avatar-fetch?userId={t.UserId}&placeId={t.PlaceId}",ClientTicket=t.Id.ToString(),NewClientTicket=t.Id.ToString(),GameChatType="AllUsers",GameId=t.ServerId.ToString(),PlaceId=t.PlaceId,WaitingForCharacterGuid=Guid.NewGuid().ToString(),BaseUrl=_cfg.BaseUrl+"/",ChatStyle="ClassicAndBubble",VendorId="0",ScreenShotInfo="",VideoInfo="",CreatorId=u.CreatorId,CreatorTypeEnum="User",MembershipType="None",AccountAge=age,CookieStoreEnabled=true,IsRobloxPlace=false,IsUnknownOrUnder13=false,SessionId=$"{Guid.NewGuid()}|{t.ServerId}|{t.UserId}|{t.Address}|8|{DateTime.Now:MM/dd/yyyy HH:mm:ss}",DataCenterId=1,UniID=u.GameId,BrowserTrackerId=0,UsePortraitMode=false,FollowUserId=0,CountryCode="US"});
    }
    [HttpGet("/login/negotiate.ashx")]
    public IActionResult Negotiate([FromQuery]Guid? ticket)=>ticket is null?Content("true","text/plain"):_tickets.Get(ticket.Value) is null?Unauthorized():Content(ticket.ToString()!,"text/plain");
    [HttpGet("/v1.1/avatar-fetch")]
    public IActionResult AvatarFetch([FromQuery]long userId)=>Ok(new{resolvedAvatarType="R6",equippedGearVersionIds=Array.Empty<long>(),accessoryVersionIds=Array.Empty<long>(),assetAndAssetTypeIds=Array.Empty<object>(),bodyColors=new{headColorId=24,leftArmColorId=24,leftLegColorId=119,rightArmColorId=24,rightLegColorId=119,torsoColorId=23},scales=new{height=1,width=1,head=1,depth=1,proportion=0,bodyType=0},playerAvatarType="R6",defaultShirtApplied=false,defaultPantsApplied=false,emotes=Array.Empty<object>()});
}
