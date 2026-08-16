# Luxora — 2020-era Roblox revival

ASP.NET 8 backend + authentic 2020-era pages + 2020 RCC game servers. Single machine: **everything runs on one Windows box** (your VPS, or localhost for testing).

```
site/   the website (Kestrel + ASP.NET). wwwroot/ holds the era pages + 2020 bundles.
db/     PostgreSQL schema files + import tutorial (you run Postgres; password never in git)
grid/   ready-to-run RCCService 2020 (game server node) + GameServer lua scripts
tools/  pageprep.py — turn captured 2020 pages into served Luxora pages
```

---

## 🚀 Localhost test setup (~10 min)

### 1. Install the things
| Need | Get it |
|---|---|
| **.NET 8 SDK** | https://dotnet.microsoft.com/download → "SDK 8" |
| **PostgreSQL 14+** | https://www.enterprisedb.com/downloads/postgres-postgresql-downloads (remember the superuser password you set) |

(Checking: open a NEW terminal → `dotnet --version` should print 8.x, `psql --version` prints 14+.)

### 2. Create the database
In **SQL Shell (psql)** (Start Menu → PostgreSQL folder). Defaults = press Enter; user = `postgres`; enter the password from install:

```sql
create user luxora with password 'test123';
create database luxora owner luxora;
\q
```

Then import, from a normal terminal in the repo folder:
```bat
cd db
set PGPASSWORD=test123
psql -h 127.0.0.1 -U luxora -d luxora -v ON_ERROR_STOP=1 -f 001_schema.sql
               (same)            -f 010_seed.sql
               (same)            -f 002_games.sql
               (same)            -f 003_social.sql
               (same)            -f 004_remove_placeholder_games.sql
```

### 3. Configure the site (one copy command — profiles are pre-made)
```bat
cd site
copy appsettings.Localhost.json appsettings.json
```
That's it — the Localhost profile already matches this guide (db password `test123`, port `5299`, Turnstile always-pass test keys).

**Profiles (both committed, swappable anytime):**
| File | Use it when |
|---|---|
| `appsettings.Localhost.json` | **local testing** (this guide) |
| `appsettings.Production-luxora.wtf.json` | **deploying on the VPS domain** — fill `****` placeholders first |
| `appsettings.Example.json` | default fallback, loaded automatically if no appsettings.json exists |

The active one is always `appsettings.json` (gitignored — never commits). Switch profile = copy another one over it. Want the production luxora.wtf config back? Just say "revert to production config" and it's `copy appsettings.Production-luxora.wtf.json appsettings.json`.

### 4. Run it
```bat
cd site
dotnet restore
dotnet run
```
Console prints `Now listening on: http://0.0.0.0:5299`.

### 5. Test signup, login, and home
1. Open **http://localhost:5299/** → the captured 2020 logged-out landing/signup page.
2. Create an account (the Turnstile test key always passes). You receive **50 Robux** and a `.ROBLOSECURITY` session cookie.
3. The redirect opens `/home`: greeting, friends, presence, status feed, and game rows are loaded from PostgreSQL.
4. Test an existing account in an InPrivate window at **http://localhost:5299/login**.
5. Verify users with `psql -U luxora -d luxora -c "select id, username, created from users;"`.

---

## 🩺 Troubleshooting
| Symptom | Fix |
|---|---|
| `POSTGRES NOT REACHABLE` in console | Postgres service running? password in appsettings.json matches step 2? |
| Signup button does nothing / form never appears | Open browser console: era bundles should be 200s under `/bundles/js/...` — if you see 404s for real bundles, re-run `python tools/pageprep.py <capture> landing` |
| Login cookie not sticking | `CookieDomain` must be **empty** on localhost; `CookieSecure` false on http |
| Captcha loops/fails | keep test keys (`1x0000…AA`) for local; real keys only on the real domain |
| 403 on signup POST | that's the era XSRF handshake working — the page retries automatically with the header; if it persists, hard-refresh |

## 🧱 Project layout notes
- **Public landing = signup** (2020-accurate: logged-out root IS the signup form rendered by the era `Landing.js` bundle).
- API style: kornet-style squash — real Roblox `auth.roblox.com/v2/signup` becomes `/apisite/auth/v2/signup` here.
- Fresh build phases each add numbered db files (`002_…`) — import in order.

## ▶️ Full VPS hosting (later/same steps)
Same as localhost except: buy domain → point DNS → set `BaseUrl=https://luxora.wtf`, `CookieDomain=".luxora.wtf"`, `CookieSecure=true`, register real Turnstile keys, run `grid/FETCH_CONTENT.sh` once (game-server content), firewall 80/443 + UDP 53640-53690. `grid/README.md` covers the RCC node.
