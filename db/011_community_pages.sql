-- LUXORA db — 011: messages, groups, and economy history for universal navigation pages.
create table if not exists private_message (
 id bigint generated always as identity primary key,
 sender_id bigint not null references users(id) on delete cascade,
 recipient_id bigint not null references users(id) on delete cascade,
 subject varchar(100) not null default '', body varchar(4000) not null,
 is_read boolean not null default false, created timestamptz not null default now()
);
create index if not exists ix_private_message_recipient on private_message(recipient_id,created desc);
create table if not exists user_group (
 id bigint generated always as identity primary key,name varchar(100) not null,description text not null default '',owner_id bigint not null references users(id),created timestamptz not null default now()
);
create table if not exists user_group_member (
 group_id bigint not null references user_group(id) on delete cascade,user_id bigint not null references users(id) on delete cascade,role varchar(50) not null default 'Member',joined timestamptz not null default now(),primary key(group_id,user_id)
);
create table if not exists economy_transaction (
 id bigint generated always as identity primary key,user_id bigint not null references users(id) on delete cascade,amount bigint not null,reason text not null,created timestamptz not null default now()
);
