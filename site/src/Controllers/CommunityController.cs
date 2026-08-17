using Dapper;using Microsoft.AspNetCore.Mvc;
namespace Luxora.Controllers;
[ApiController]public sealed class CommunityController:ControllerBase
{
 private readonly Db _db;public CommunityController(Db db)=>_db=db;
 private long? Me()=>CurrentUser.Id(HttpContext);
 private sealed class InventoryRow{public long Id{get;set;}public string Name{get;set;}="";public string AssetType{get;set;}="";public string? ThumbnailPath{get;set;}public DateTimeOffset Acquired{get;set;}}
 [HttpGet("/apisite/community/v1/friends")]
 public async Task<IActionResult> Friends(){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();var friends=await c.QueryAsync(@"select u.id,u.username::text as name from friendship f join users u on u.id=case when f.user_id_a=@me then f.user_id_b else f.user_id_a end where f.user_id_a=@me or f.user_id_b=@me order by u.username",new{me});var requests=await c.QueryAsync(@"select u.id,u.username::text as name,r.created from friend_request r join users u on u.id=r.requester_id where r.addressee_id=@me order by r.created desc",new{me});return Ok(new{friends,requests});}
 [HttpGet("/apisite/community/v1/messages")]
 public async Task<IActionResult> Messages(){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();var data=await c.QueryAsync(@"select m.id,m.subject,m.body,m.is_read as isRead,m.created,u.id as senderId,u.username::text as senderName from private_message m join users u on u.id=m.sender_id where m.recipient_id=@me order by m.created desc limit 100",new{me});return Ok(new{data});}
 public sealed class MessageRequest{public long RecipientId{get;set;}public string? Subject{get;set;}public string? Body{get;set;}}
 [HttpPost("/apisite/community/v1/messages")]
 public async Task<IActionResult> Send([FromBody]MessageRequest r){var me=Me();if(me is null)return Unauthorized();var body=(r.Body??"").Trim();if(body.Length is <1 or >4000)return BadRequest();using var c=_db.Open();await c.ExecuteAsync("insert into private_message(sender_id,recipient_id,subject,body) values(@me,@recipient,@subject,@body)",new{me,recipient=r.RecipientId,subject=(r.Subject??"")[..Math.Min((r.Subject??"").Length,100)],body});return Ok(new{});}
 [HttpGet("/apisite/community/v1/groups")]
 public async Task<IActionResult> Groups(){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();var data=await c.QueryAsync(@"select g.id,g.name,g.description,m.role,(select count(*) from user_group_member x where x.group_id=g.id) as memberCount from user_group_member m join user_group g on g.id=m.group_id where m.user_id=@me order by g.name",new{me});return Ok(new{data});}
 [HttpGet("/apisite/community/v1/inventory/{userId:long}")]
 public async Task<IActionResult> Inventory(long userId){using var c=_db.Open();var data=await c.QueryAsync<InventoryRow>(@"select i.id as Id,i.name as Name,i.asset_type as AssetType,i.thumbnail_path as ThumbnailPath,o.acquired as Acquired from user_asset o join catalog_item i on i.id=o.item_id where o.user_id=@userId order by o.acquired desc",new{userId});return Ok(new{data=data.Select(x=>new{id=x.Id,name=x.Name,assetType=x.AssetType,imageUrl=x.ThumbnailPath??"/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg",acquired=x.Acquired})});}
 [HttpGet("/apisite/community/v1/economy")]
 public async Task<IActionResult> Economy(){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();var balance=await c.ExecuteScalarAsync<long>("select robux from user_economy where user_id=@me",new{me});var transactions=await c.QueryAsync("select amount,reason,created from economy_transaction where user_id=@me order by created desc limit 100",new{me});return Ok(new{balance,transactions});}
 public sealed class SettingsRequest{public short Theme{get;set;}public string? AppChatPrivacy{get;set;}}
 [HttpGet("/apisite/community/v1/settings")]
 public async Task<IActionResult> Settings(){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();var data=await c.QuerySingleAsync(@"select u.theme,s.app_chat_privacy as appChatPrivacy from users u join user_settings s on s.user_id=u.id where u.id=@me",new{me});return Ok(data);}
 [HttpPost("/apisite/community/v1/settings")]
 public async Task<IActionResult> Settings([FromBody]SettingsRequest r){var me=Me();if(me is null)return Unauthorized();using var c=_db.Open();await c.ExecuteAsync("update users set theme=@theme where id=@me;update user_settings set app_chat_privacy=@privacy where user_id=@me",new{theme=r.Theme==1?1:0,privacy=r.AppChatPrivacy??"AllUsers",me});return Ok(new{});}
}
