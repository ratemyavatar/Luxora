-- LUXORA db — 008: game-page user interactions.
create table if not exists game_favorite (
    user_id bigint not null references users(id) on delete cascade,
    game_id bigint not null references game(id) on delete cascade,
    created timestamptz not null default now(),
    primary key(user_id, game_id)
);
create index if not exists ix_game_favorite_game on game_favorite(game_id);
