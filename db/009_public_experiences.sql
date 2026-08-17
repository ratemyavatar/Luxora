-- LUXORA db — 009: new experiences are public by default; repair rows created during the private-default phase.
alter table game alter column is_active set default true;
update game set is_active=true where is_active=false;
