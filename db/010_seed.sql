-- ============================================================================
-- LUXORA db — 010: minimal seed (safe to re-run; inserts only if users empty)
-- ============================================================================
-- User 1 = the Luxora system/admin account (change the password after first login!).
insert into users (id, username, password_hash, description, gender, created)
overriding system value
select 1, 'Luxora', 'v1$210000$REPLACE_ME_SALT$REPLACE_ME_HASH', 'The official Luxora account.', 0, '2020-09-01'
where not exists (select 1 from users where id = 1);

insert into user_economy (user_id, robux)
select 1, 1000000 where not exists (select 1 from user_economy where user_id = 1);

insert into user_settings (user_id)
select 1 where not exists (select 1 from user_settings where user_id = 1);

-- keep identity sequence ahead of seed row
select setval(pg_get_serial_sequence('users','id'), greatest((select max(id) from users), 2));
