-- ============================================================================
-- LUXORA db — 003: friendships, requests, presence, and status/feed entries
-- PostgreSQL 13+. Safe to run repeatedly.
-- ============================================================================

create table if not exists friendship (
    user_id_a   bigint      not null references users(id) on delete cascade,
    user_id_b   bigint      not null references users(id) on delete cascade,
    created     timestamptz not null default now(),
    primary key (user_id_a, user_id_b),
    check (user_id_a < user_id_b)
);
create index if not exists ix_friendship_b on friendship(user_id_b);

create table if not exists friend_request (
    requester_id bigint      not null references users(id) on delete cascade,
    addressee_id bigint      not null references users(id) on delete cascade,
    created      timestamptz not null default now(),
    primary key (requester_id, addressee_id),
    check (requester_id <> addressee_id)
);
create index if not exists ix_friend_request_addressee on friend_request(addressee_id, created desc);

create table if not exists user_status (
    id          bigint generated always as identity primary key,
    user_id     bigint      not null references users(id) on delete cascade,
    body        varchar(254) not null,
    created     timestamptz not null default now(),
    check (length(trim(body)) > 0)
);
create index if not exists ix_user_status_user_created on user_status(user_id, created desc);

create table if not exists user_presence (
    user_id         bigint primary key references users(id) on delete cascade,
    presence_type   smallint    not null default 0, -- 0 offline, 1 online, 2 in game, 3 studio
    place_id        bigint      null references place(id) on delete set null,
    game_id         uuid        null,
    last_location   text        not null default 'Website',
    updated         timestamptz not null default now()
);
