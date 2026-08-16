-- ============================================================================
-- LUXORA db — 001: core identity/economy schema (auth phase)
-- Target: PostgreSQL 13+ on the Windows VPS. Import per db/README.md.
-- Later phases add migrations 002_games.sql, 003_social.sql, ... (never edit 001 in place)
-- ============================================================================
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- case-insensitive usernames

create table if not exists users (
    id              bigint generated always as identity primary key,
    username        citext          not null,                 -- case-insensitive login/display
    username_lower  text            generated always as (lower(username::text)) stored,
    password_hash   text            not null,                 -- PBKDF2-SHA512 format: v1$iter$salt$hash
    description     text            not null default '',
    gender          smallint        not null default 0,       -- 0 unknown, 2 male, 3 female (era convention)
    birthday        date            null,
    is_under13      boolean         not null default false,
    account_status  smallint        not null default 0,       -- 0 ok,1 suppressed,2 deleted,3 poisoned,4 forgotten
    theme           smallint        not null default 0,       -- 0 light, 1 dark (2020 dark theme!)
    created         timestamptz     not null default now(),
    unique (username_lower)
);

create table if not exists user_session (
    id          uuid         not null default gen_random_uuid() primary key,  -- sid inside .ROBLOSECURITY
    user_id     bigint       not null references users(id) on delete cascade,
    created     timestamptz  not null default now(),
    last_seen   timestamptz  not null default now(),
    ip          text         null,
    user_agent  text         null
);
create index if not exists ix_user_session_user on user_session(user_id);

create table if not exists user_economy (
    user_id  bigint primary key references users(id) on delete cascade,
    robux    bigint not null default 0 check (robux >= 0)
);

create table if not exists user_settings (
    user_id            bigint primary key references users(id) on delete cascade,
    inventory_privacy  smallint not null default 0,   -- 0 everyone,1 friends,2 none (era enum-ish)
    trade_privacy      smallint not null default 0,
    trade_value_filter smallint not null default 0,
    app_chat_privacy   text     not null default 'AllUsers'
);

create table if not exists moderation_ban (
    id           bigint generated always as identity primary key,
    user_id      bigint not null references users(id) on delete cascade,
    moderator_id bigint not null references users(id),
    reason       text   not null default 'Unknown',
    note         text   not null default '',
    reviewed     timestamptz not null default now(),
    expires      timestamptz null,               -- null = account disabled
    lifted       timestamptz null
);
create index if not exists ix_moderation_ban_user on moderation_ban(user_id);

-- signup analytics/events (cheap audit, helps anti-bot tuning)
create table if not exists signup_event (
    id         bigint generated always as identity primary key,
    username   text not null,
    ip         text null,
    ok         boolean not null,
    fail_code  smallint null,
    created    timestamptz not null default now()
);
