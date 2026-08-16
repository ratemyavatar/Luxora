-- ============================================================================
-- LUXORA db — 002: experiences, places, live servers, and home-page game data
-- PostgreSQL 13+. Safe to run repeatedly.
-- ============================================================================

create table if not exists game (
    id              bigint generated always as identity primary key,
    name            text        not null,
    description     text        not null default '',
    creator_id      bigint      not null references users(id),
    icon_path       text        null,
    is_active       boolean     not null default true,
    max_players     integer     not null default 20 check (max_players between 1 and 100),
    visits          bigint      not null default 0 check (visits >= 0),
    favorites       bigint      not null default 0 check (favorites >= 0),
    created         timestamptz not null default now(),
    updated         timestamptz not null default now()
);

create table if not exists place (
    id              bigint generated always as identity primary key,
    game_id         bigint      not null references game(id) on delete cascade,
    name            text        not null,
    rcc_file        text        null,
    is_root_place   boolean     not null default false,
    created         timestamptz not null default now(),
    updated         timestamptz not null default now()
);
create unique index if not exists ux_place_one_root_per_game on place(game_id) where is_root_place;
create index if not exists ix_place_game on place(game_id);

create table if not exists game_session (
    id              uuid        primary key default gen_random_uuid(),
    place_id        bigint      not null references place(id) on delete cascade,
    server_ip       inet        null,
    server_port     integer     null check (server_port is null or server_port between 1 and 65535),
    status          smallint    not null default 0, -- 0 starting, 1 open, 2 closing, 3 stopped
    player_count    integer     not null default 0 check (player_count >= 0),
    max_players     integer     not null default 20 check (max_players > 0),
    started         timestamptz not null default now(),
    last_heartbeat  timestamptz not null default now(),
    stopped         timestamptz null
);
create index if not exists ix_game_session_open on game_session(place_id, status, last_heartbeat);

create table if not exists user_recent_game (
    user_id         bigint      not null references users(id) on delete cascade,
    game_id         bigint      not null references game(id) on delete cascade,
    last_played     timestamptz not null default now(),
    primary key (user_id, game_id)
);
create index if not exists ix_user_recent_game_time on user_recent_game(user_id, last_played desc);
