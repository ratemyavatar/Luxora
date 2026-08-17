using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Controllers;

[ApiController]
public sealed class CatalogController : ControllerBase
{
    private readonly Db _db;
    public CatalogController(Db db)=>_db=db;
    private sealed class ItemRow
    {
        public long Id{get;set;} public string Name{get;set;}=""; public string Description{get;set;}="";
        public long CreatorId{get;set;} public string CreatorName{get;set;}=""; public string AssetType{get;set;}="";
        public long? Price{get;set;} public bool IsForSale{get;set;} public string? ThumbnailPath{get;set;}
        public long Sales{get;set;} public long Favorites{get;set;} public DateTimeOffset Updated{get;set;}
    }
    [HttpGet("/apisite/catalog/v1/search/items")]
    public async Task<IActionResult> Search([FromQuery]string? keyword,[FromQuery]string? category,[FromQuery]string? sort)
    {
        using var c=_db.Open();var rows=await c.QueryAsync<ItemRow>(@"
            select i.id as Id,i.name as Name,i.description as Description,i.creator_id as CreatorId,
                   u.username::text as CreatorName,i.asset_type as AssetType,i.price as Price,
                   i.is_for_sale as IsForSale,i.thumbnail_path as ThumbnailPath,i.sales as Sales,
                   i.favorites as Favorites,i.updated as Updated
            from catalog_item i join users u on u.id=i.creator_id
            where (@keyword='' or i.name ilike '%'||@keyword||'%') and (@category='' or @category='Featured' or i.asset_type=@category)
            order by case when @sort='PriceLow' then coalesce(i.price,9223372036854775807) end asc,
                     case when @sort='PriceHigh' then coalesce(i.price,-1) end desc,
                     case when @sort='Updated' then extract(epoch from i.updated) else i.sales*1000+i.favorites end desc,i.id desc limit 120",
            new{keyword=(keyword??"").Trim(),category=category??"",sort=sort??"Popular"});
        return Ok(new{data=rows.Select(x=>new{id=x.Id,name=x.Name,description=x.Description,creatorId=x.CreatorId,
            creatorName=x.CreatorName,assetType=x.AssetType,price=x.Price,isForSale=x.IsForSale,sales=x.Sales,
            favorites=x.Favorites,updated=x.Updated,canManage=me==x.CreatorId,imageUrl=x.ThumbnailPath??"/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg"})});
    }
    [HttpGet("/apisite/catalog/v1/items/{itemId:long}")]
    public async Task<IActionResult> Item(long itemId)
    {
        var me=CurrentUser.Id(HttpContext);using var c=_db.Open();var x=await c.QueryFirstOrDefaultAsync<ItemRow>(@"select i.id as Id,i.name as Name,i.description as Description,i.creator_id as CreatorId,u.username::text as CreatorName,i.asset_type as AssetType,i.price as Price,i.is_for_sale as IsForSale,i.thumbnail_path as ThumbnailPath,i.sales as Sales,i.favorites as Favorites,i.updated as Updated from catalog_item i join users u on u.id=i.creator_id where i.id=@itemId",new{itemId});
        return x is null?NotFound():Ok(new{id=x.Id,name=x.Name,description=x.Description,creatorId=x.CreatorId,creatorName=x.CreatorName,assetType=x.AssetType,price=x.Price,isForSale=x.IsForSale,sales=x.Sales,favorites=x.Favorites,updated=x.Updated,canManage=me==x.CreatorId,imageUrl=x.ThumbnailPath??"/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg"});
    }
    public sealed class SaveItemRequest{public string? Name{get;set;}public string? Description{get;set;}public string? AssetType{get;set;}public long? Price{get;set;}public bool IsForSale{get;set;}}
    [HttpPost("/apisite/catalog/v1/items")]
    public async Task<IActionResult> Create([FromBody]SaveItemRequest r){var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();var name=(r.Name??"").Trim();if(name.Length is <1 or >60)return BadRequest();using var c=_db.Open();var id=await c.ExecuteScalarAsync<long>("insert into catalog_item(name,description,creator_id,asset_type,price,is_for_sale) values(@name,@description,@me,@type,@price,@sale) returning id",new{name,description=(r.Description??"").Trim(),me,type=r.AssetType??"Hat",price=r.Price,sale=r.IsForSale});return Ok(new{id});}
    [HttpPut("/apisite/catalog/v1/items/{itemId:long}")]
    public async Task<IActionResult> Update(long itemId,[FromBody]SaveItemRequest r){var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();using var c=_db.Open();var changed=await c.ExecuteAsync("update catalog_item set name=@name,description=@description,asset_type=@type,price=@price,is_for_sale=@sale,updated=now() where id=@itemId and creator_id=@me",new{name=(r.Name??"").Trim(),description=(r.Description??"").Trim(),type=r.AssetType??"Hat",price=r.Price,sale=r.IsForSale,itemId,me});return changed==0?NotFound():Ok(new{id=itemId});}
    [HttpPost("/apisite/catalog/v1/items/{itemId:long}/purchase")]
    public async Task<IActionResult> Purchase(long itemId)
    {
        var me=CurrentUser.Id(HttpContext);if(me is null)return Unauthorized();using var c=_db.Open();using var tx=c.BeginTransaction();
        if(await c.ExecuteScalarAsync<int>("select count(*) from user_asset where user_id=@me and item_id=@itemId",new{me,itemId},tx)>0){tx.Rollback();return Ok(new{purchased=true,alreadyOwned=true});}
        var price=await c.ExecuteScalarAsync<long?>("select price from catalog_item where id=@itemId and is_for_sale",new{itemId},tx);
        if(price is null)return NotFound();var changed=await c.ExecuteAsync("update user_economy set robux=robux-@price where user_id=@me and robux>=@price",new{price,me},tx);
        if(changed==0){tx.Rollback();return Conflict(new{errors=new[]{new{code=1,message="Not enough Robux."}}});}
        await c.ExecuteAsync("insert into user_asset(user_id,item_id) values(@me,@itemId) on conflict do nothing",new{me,itemId},tx);
        await c.ExecuteAsync("update catalog_item set sales=sales+1 where id=@itemId",new{itemId},tx);tx.Commit();return Ok(new{purchased=true});
    }
}
