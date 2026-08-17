-- LUXORA db — 007: remaining 2022 experience configuration + published place files.
alter table game add column if not exists playable_devices text[] not null default array['Computer','Phone','Tablet'];
alter table game add column if not exists private_servers_allowed boolean not null default false;
alter table game add column if not exists private_servers_free boolean not null default true;
alter table game add column if not exists private_server_price bigint not null default 0;
alter table game add column if not exists all_gear_genres_allowed boolean not null default false;
alter table game add column if not exists allowed_gear_types text[] not null default array[]::text[];
alter table game add column if not exists chat_type text not null default 'Classic';
alter table game add column if not exists overrides_default_avatar boolean not null default false;

alter table place add column if not exists file_version integer not null default 0;
alter table place add column if not exists file_size bigint null;
alter table place add column if not exists file_sha256 text null;
alter table place add column if not exists published timestamptz null;
