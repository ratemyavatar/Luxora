-- LUXORA db — 006: creator settings used by the captured Develop/Create pages.
alter table game add column if not exists genre text not null default 'All';
alter table game add column if not exists access_mode text not null default 'Everyone';
alter table game add column if not exists is_copying_allowed boolean not null default false;
alter table game add column if not exists template_id bigint null;
alter table game add column if not exists social_slot_type text not null default 'Automatic';
alter table game add column if not exists custom_social_slots integer not null default 0;
