using Dapper;
using Microsoft.AspNetCore.Mvc;
namespace Luxora.Controllers;
[ApiController]
public sealed class AvatarController:ControllerBase
{
 private readonly Db _db;public AvatarController(Db db)=>_db=db;
 private sealed class Item{public long Id{get;set;}public string Name{get;set;}="";public string AssetType{get;set;}="";public string? ThumbnailPath{get;set;}public bool Equipped{get;set;}}
 [HttpGet("/apisite/avatar/v1/avatar")]
 public async Task<IActionResult> Get(){var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();using var c=_db.Open();var items=await c.QueryAsync<Item>(@"select i.id as Id,i.name as Name,i.asset_type as AssetType,i.thumbnail_path as ThumbnailPath,(a.item_id is not null) as Equipped from user_asset o join catalog_item i on i.id=o.item_id left join user_avatar_asset a on a.user_id=o.user_id and a.item_id=o.item_id where o.user_id=@me order by i.asset_type,i.name",new{me});return Ok(new{userId=me,avatarUrl=$"/thumbs/avatar/{me}/420x420.png",items=items.Select(x=>new{id=x.Id,name=x.Name,assetType=x.AssetType,equipped=x.Equipped,imageUrl=x.ThumbnailPath??"/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg"})});}
 public sealed class WearRequest{public bool Wear{get;set;}}
 [HttpPost("/apisite/avatar/v1/items/{itemId:long}/wear")]
 public async Task<IActionResult> Wear(long itemId,[FromBody]WearRequest r){var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();using var c=_db.Open();if(await c.ExecuteScalarAsync<int>("select count(*) from user_asset where user_id=@me and item_id=@itemId",new{me,itemId})==0)return Forbid();if(r.Wear)await c.ExecuteAsync("insert into user_avatar_asset(user_id,item_id) values(@me,@itemId) on conflict do update set equipped=now()",new{me,itemId});else await c.ExecuteAsync("delete from user_avatar_asset where user_id=@me and item_id=@itemId",new{me,itemId});return Ok(new{itemId,equipped=r.Wear});}
}
