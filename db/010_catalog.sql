-- LUXORA db — 010: Avatar Shop items, ownership, and currently-wearing assets.
create table if not exists catalog_item (
    id bigint generated always as identity primary key,
    name text not null,
    description text not null default '',
    creator_id bigint not null references users(id),
    asset_type text not null,
    price bigint null check(price is null or price>=0),
    is_for_sale boolean not null default false,
    thumbnail_path text null,
    file_path text null,
    sales bigint not null default 0,
    favorites bigint not null default 0,
    created timestamptz not null default now(),
    updated timestamptz not null default now()
);
create index if not exists ix_catalog_item_type on catalog_item(asset_type,is_for_sale,updated desc);

create table if not exists user_asset (
    user_id bigint not null references users(id) on delete cascade,
    item_id bigint not null references catalog_item(id) on delete cascade,
    acquired timestamptz not null default now(),
    primary key(user_id,item_id)
);
create table if not exists user_avatar_asset (
    user_id bigint not null references users(id) on delete cascade,
    item_id bigint not null references catalog_item(id) on delete cascade,
    equipped timestamptz not null default now(),
    primary key(user_id,item_id)
);
