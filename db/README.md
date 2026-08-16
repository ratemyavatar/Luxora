# Luxora database — setup tutorial (Windows VPS)

One-time ~5 min. You do this part; the site code never hardcodes the password.

## 1. Install PostgreSQL 13+ (Windows)
1. Download the EDB installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads (pick 16.x or 15.x, x64).
2. Run it. When it asks for the **superuser (postgres) password** — pick one and save it.
   Components: keep defaults (PostgreSQL Server + pgAdmin 4 optional but handy). Port **5432**.
3. Finish. Postgres now runs as a Windows service automatically.

## 2. Create the Luxora database + login
Open **SQL Shell (psql)** from the Start Menu. Press Enter for server/database/port defaults, user `postgres`, enter your superuser password. Then:

```sql
create user luxora with password 'PUT-A-STRONG-PASSWORD-HERE';
create database luxora owner luxora;
\q
```

## 3. Import the schema + seed
In a normal Command Prompt / PowerShell from the repo folder:

```bat
cd C:\path\to\Luxora\db
set PGPASSWORD=PUT-A-STRONG-PASSWORD-HERE
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 001_schema.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 010_seed.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 002_games.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 003_social.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 004_remove_placeholder_games.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 005_thumbnails.sql
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 006_develop.sql
```

(pgAdmin alternative: right-click the `luxora` database → Query Tool → open each .sql → Execute.)

## 4. Give the site the password (locally only — never commit it)
```bat
cd C:\path\to\Luxora\site
copy appsettings.Example.json appsettings.json
notepad appsettings.json
```
Replace `PUT-YOUR-DB-PASSWORD-HERE` with the password from step 2.
`site/appsettings.json` is in `.gitignore` — it will not be committed.

## 5. Reset / inspect (any time)
```bat
psql -h 127.0.0.1 -U luxora -d luxora -c "select id, username, created from users;"
```
To wipe and start over: `drop database luxora; create database luxora owner luxora;` then re-run step 3.

## Migrations
Each build phase adds numbered files (`002_*.sql`, …). Import them **in order, once each**, same psql command. The site checks the tables it needs at startup and will log if a migration is missing.
