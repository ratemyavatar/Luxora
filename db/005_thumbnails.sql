-- LUXORA db — 005: RCC-backed thumbnail cache state.
-- Image bytes live under site/wwwroot/thumbnails; this table records render state.
create table if not exists thumbnail (
    id              bigint generated always as identity primary key,
    target_type     text        not null,
    target_id       bigint      not null,
    width           integer     not null check (width between 1 and 2048),
    height          integer     not null check (height between 1 and 2048),
    format          text        not null default 'png',
    state           smallint    not null default 0, -- 0 pending, 1 complete, 2 failed
    relative_path   text        null,
    error            text        null,
    requested       timestamptz not null default now(),
    updated         timestamptz not null default now(),
    unique (target_type, target_id, width, height, format)
);
create index if not exists ix_thumbnail_target on thumbnail(target_type, target_id);
