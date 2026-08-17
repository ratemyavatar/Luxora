# Prompt / handoff for another AI: continue Luxora

You are taking over development of **Luxora**, a 2020-era Roblox revival. Read this entire handoff before changing anything.

## Repository and environment

- GitHub: `ratemyavatar/Luxora`
- Arena checkout used by the previous agent: `/home/user/Luxora`
- Current branch: `arena/01a00c5f-luxora`
- Current head at handoff: `34039eb`
- VPS repository: `C:\Users\Administrator\Documents\luxora`
- VPS OS: Windows Server 2022, user `Administrator`
- Public VPS IP: `13.140.161.125`
- Intended domain: `luxora.wtf`
- Site: ASP.NET 8 / C#, Kestrel on port `5299`
- Database: PostgreSQL 13, database/user `luxora`
- RCC: 2020L `RCCService.exe` build `0.450.0.411923`, SOAP port `64989`
- Everything is intended to run on this one VPS.

If working inside an Arena session, obey the branch lock given by that session. Do not commit secrets or `site/appsettings.json`.

## Non-negotiable user rules

1. **Do not invent or redesign HTML/CSS.** Reuse HTML and CSS from the supplied Roblox captures, 2020–2022 snapshots, or explicitly approved fan/revival sources. Backend C#, JS binding/glue, configs, scripts, and database work may be authored.
2. Keep the visible site in the **2020–2022 Roblox look**. Do not copy modern Foundation/Tailwind Roblox markup directly.
3. When a complete page capture is absent, search the repository archives and public historical sources first. Rebuild using structures/classes from captured pages rather than one generic placeholder page.
4. Never expose captured users, games, friends, groups, counts, descriptions, or IDs. Every visible dynamic value must come from Luxora’s database.
5. Do not seed fake placeholder games/items to make pages look populated.
6. Build and test pages in dependency order. The user is a beginner at Windows operations; provide exact PowerShell/CMD commands.
7. Never commit DB passwords, cookie HMAC secrets, Turnstile secrets, or auth cookies.

## Research/capture inventory

Important root files:

- `RobloxSourceCode.html`: 2020 login capture
- `home.htm`: older authenticated home capture
- `g3jmjxG9.html`: authenticated home capture/shell
- `Junedevelopgame.html`: 2021/2022 Develop page
- `create.html`: captured Create Experience form
- `2020Lavatareditor.html`: 2020 Avatar Editor shell
- `2020LAccountSettings.html`: 2020 Account Settings page
- `MatchMySettings.html`: another settings capture
- `Places_BasicSettings.html`, `Places_Access.html`, `Places_AdvancedSettings*.html`: captured configuration fragments
- `roblox_2020.html`: fan-made 2020-ish mock. It contains profanity; never expose that text. Only small approved structural/CSS ideas were reused.
- `pages.tar`: especially:
  - `pages/www.roblox.com/games/games.htm` — real 2021 Discover/Games page shell
  - `pages/www.roblox.com/games/286090429/Arsenal.htm` — real 2021 game detail capture
  - profile, inventory, groups, and avatar captures
- `2022ECache.7z`: cached 2022 CSS/JS/content
- `catalog.roblox.com.tar` and `roblox website cache*.tar`: captured API responses
- `2019_site_src_1.7z`, `ORC.7z`, CoreScripts archives: source/research

Public reference studied:

- `harryzawg/bubbablox-v2` branch `2021`
- `bubbablox/launcher`

BubbaBlox may be used for **structural reference only** where requested, then rendered with captured 2020–2022 Roblox classes/CSS. The user explicitly rejected using BubbaBlox’s game-page layout. The game page must remain based on the real 2021 Roblox capture.

## HTML processing architecture

- `tools/pageprep.py` converts captures into `site/wwwroot/pages/*.htmltpl`.
- It rewrites service hosts to `/apisite/{service}`, localizes assets, injects XSRF/base URL/user tokens, removes stale captured data, and injects Luxora JS glue.
- `PageRenderMiddleware` in `site/src/Security/SessionMiddleware.cs` serves templates and inserts `site/fragments/universal-nav.htmltpl`.
- Universal navbar/sidebar is the rendered captured 2022 navigation, shared by authenticated pages.
- `site/wwwroot/luxora/hostshim.js` reroutes era API hosts.
- The user is sensitive to missing/mismatched CSS. Prefer the exact immutable stylesheet referenced by a capture. Several templates currently load exact `css.rbxcdn.com` styles externally because the local cache lacked those exact hashes.

## Current database migrations

Import in this order after `001`/seed:

- `001_schema.sql`: users, sessions, economy, settings, moderation, signup events
- `002_games.sql`: game, place, game sessions, recent games
- `003_social.sql`: friendships, requests, status, presence
- `004_remove_placeholder_games.sql`: removes the temporary fake games
- `005_thumbnails.sql`: RCC thumbnail cache state
- `006_develop.sql`: experience settings
- `007_place_uploads.sql`: remaining experience options and uploaded place metadata
- `008_game_page.sql`: game favorites
- `009_public_experiences.sql`: public-by-default and repairs previously forced-private games
- `010_catalog.sql`: catalog items, ownership, equipped avatar assets
- `011_community_pages.sql`: messages, groups, economy transaction history
- `010_seed.sql`: original account seed (despite its number, was historically imported after `001`)

All newer migrations are intended to be idempotent where practical.

## Auth/session/security status

Implemented:

- PBKDF2-SHA512 passwords
- Signup and login
- `.ROBLOSECURITY` signed session cookie
- Session DB rows
- Roblox-style XSRF challenge/retry
- Cloudflare client IP middleware
- Turnstile signup
- Logout
- Signed-in users cannot access signup/root landing
- `/login` remains directly accessible to switch accounts

Known old Dapper issue: Dapper cannot map `DateOnly` parameters; use `DynamicParameters` with `DbType.Date` and `DateTime`.

## Universal navigation

Files:

- `site/fragments/universal-nav.htmltpl`
- `site/wwwroot/luxora/universal-nav.js`

Implemented:

- Shared top bar and sidebar
- Username, age bracket, theme, Robux
- Search
- Settings dropdown
- Logout
- Mobile sidebar
- Robux/notification routing
- Official Store was explicitly removed at user request

Do not put separate inconsistent navbars back into each capture.

## Current pages and routes

### Auth

- `/`, `/signup`: captured 2020 landing/signup
- `/login`, `/newlogin`, `/login/default.aspx`: captured 2020 login

### Home

- `/home`
- Captured authenticated shell, friends, presence, Continue/Recommended/Popular rows
- Database-backed; fake games removed
- RCC headshots/icons
- There have been repeated styling complaints. Keep using captured 2020–2022 component classes.

### Develop / creation

- `/develop`: captured Develop page and database-owned experiences
- `/places/create`: captured Create Experience
- `/universes/configure?id=...`: dedicated Configure Experience derived from captured form
- Create/configure supports name, description, genre, access, max players, devices, social slots, gear permissions, copying, chat/avatar flags, template, and `.rbxl/.rbxlx` upload
- Private-server controls were removed at user request
- Public/private toggle exists; migration `009` repairs forced-private rows
- Place files save under `grid/RCCService2020/places`
- Studio upload aliases:
  - `/Data/Upload.ashx`
  - `/ide/publish/UploadExistingAsset`
- Status endpoint: `/apisite/develop/v1/places/{id}/file-status`

### Discover

- `/discover`, `/games`
- Uses real 2021 Games shell and exact GameCarousel stylesheet:
  `5d58fdaa60dedc843176981258306a3168ced80bfdb11ea8a382186e1c419caa.css`
- Database public games, responsive 2021 grid, RCC icons
- The user rejected the previous fan-made Discover layout. Do not revert to it.

### Game detail

- `/games/{placeId}/{slug}`
- Must remain based on real captured 2021 Arsenal game-page HTML, not BubbaBlox
- Uses exact captured GameDetails/page CSS plus local fallback
- 640×360 media/placeholder, title, creator, Play, Favorite, About/Store/Servers, stats, owner Configure
- Live servers from `game_session`
- User has repeatedly said it still looks wrong. Obtain screenshots and compare element-by-element with `/tmp/Arsenal.htm` extracted from `pages.tar`; do not redesign.

### Profile

- `/users/{id}/profile`
- Captured 2021 profile shell
- Header, counts, friend actions, about, current avatar, favorite games, statistics, creations
- Currently Wearing uses the two-column idea requested from BubbaBlox, but actual captured 2021 profile classes:
  `profile-avatar-left`, `profile-avatar-right`, `profile-accoutrements-slider`, `accoutrement-item`
- RCC head/full-body thumbnails

### Avatar Editor

- `/my/avatar`
- Captured 2020 Avatar Editor shell and exact stylesheet:
  `43246eb063d4fce7f3f28a2c6d167e33c7ecc50cf90dec5888d84a4923e7f243.css`
- Wardrobe/equip API using `user_asset` and `user_avatar_asset`
- A frozen-screen bug was caused by captured cookie modal overlays. `pageprep.py` now removes `cookieConsentModalOverlay`, `cookieConsentModalWrapper`, and `cookie-banner-wrapper` for Avatar/Catalog. Verify this remains true after regeneration.

### Avatar Shop / Catalog

- `/catalog`
- `/catalog/{id}/{slug}`
- `/catalog/create`
- `/catalog/configure?id=...`
- Catalog search/categories/sorting, details, purchase, creator editor
- Database tables in migration `010`
- A frozen-screen bug was caused by the same captured cookie modal backdrop; it is removed in pageprep.
- The page may correctly be empty when there are no real `catalog_item` rows. Do not seed fake items.

### Community/navigation pages

Latest batch at `34039eb` replaced generic routes with dedicated capture-derived templates:

- `/users/friends` → `friends.htmltpl`
- `/my/messages` → `messages.htmltpl`
- `/my/groups` → `groups.htmltpl`
- `/users/{id}/inventory` → `inventory.htmltpl`
- `/robux` → `robux.htmltpl`
- `/my/account` → `settings.htmltpl`

Sources:

- Inventory: exact `pages.tar` inventory capture and exact Inventory CSS
- Groups: exact `pages.tar` group capture and exact GroupDetails CSS
- Settings: exact `2020LAccountSettings.html` and exact AccountSettings CSS
- Friends/Messages/Robux: no full local captures were found; these use the captured 2021 profile/content shell rather than the generic home page

All bind through `site/wwwroot/luxora/nav-page.js` and `CommunityController`.

## RCC thumbnails

Files:

- `ThumbnailService.cs`
- `ThumbnailController.cs`
- `grid/RCCService2020/internalscripts/thumbnails/LuxoraAvatar.lua`
- `LuxoraHeadshot.lua`

Important RCC behavior discovered:

- This RCC does not accept raw Lua in `OpenJob.script`; it expects a JSON dispatcher envelope:
  `{"Mode":"Thumbnail","Settings":{"Type":"LuxoraHeadshot","Arguments":[...]}}`
- SOAP namespace: `http://roblox.com/`
- Avatar/headshot/game icon/game thumbnail endpoints are wired
- Generated PNGs cache under `site/wwwroot/thumbnails`
- Uploaded places must be loaded through the internal site URL:
  `http://127.0.0.1:5299/asset/?id={placeId}`
  not `rbxasset://places/...`
- `SiteInternalUrl` exists in Grid config for this reason
- The site auto-starts RCC if port `64989` is closed and warms avatar/headshot renders for all active users every ten minutes
- RCC content must exist under `grid/RCCService2020/{content,platformcontent,shaders,ExtraContent,ExtraContent2020}`
- `grid/FETCH_CONTENT.ps1` does exact sparse checkout from kornet

Useful status/test URLs:

- `/apisite/thumbnails/luxora/rcc-status`
- `/thumbs/avatar-headshot/7/150x150.png`
- `/apisite/develop/v1/places/9/file-status`

## RCC game servers and joining

Implemented experimental pipeline:

- `RccGameService.cs` sends `Mode: GameServer`, `Type: GameOpen` JSON via SOAP OpenJob
- Uses ports `53640–53689`
- Creates/uses `game_session`
- Issues five-minute in-memory join tickets
- `/game/join-script`
- `/game/PlaceLauncher.ashx`
- `/login/negotiate.ashx`
- `/v1.1/avatar-fetch`
- Play button invokes `luxora-player://`

Observed success:

- RCC game OpenJob returned HTTP 200
- A server row opened for place 9 on port 53640

## Client state — still broken/deferred

Files:

- `client/install-client.ps1`
- `client/LuxoraPlayer.ps1`
- `client/README.md`

The custom protocol works and starts a player process. The official December 2020 package downloads, but `RobloxPlayerBeta.exe` exits before producing a Player log. Only RCC logs appear.

Attempted patched BubbaBlox client URLs are dead:

- `https://bb.zawg.ca/assets/ecsr/bubbaclient2020.zip?v=15` — DNS failure
- `https://zawg.ca/assets/ecsr/bubbaclient2020.zip?v=15` — 404

Do not call the official fallback “compatible.” A real solution requires either:

1. A trustworthy archived patched 2020L client, or
2. A reproducible binary patch pipeline for BaseUrl trust, HTTPS, signature/public key, and version compatibility.

The user explicitly deferred this after repeated failures. Do not waste time retrying dead URLs without finding a verified archive.

## Important API groups

Controllers include:

- Auth: signup/login/logout/username validation
- Home/social: friends, presence, status/feed, game sorts
- Develop: game CRUD, active/public toggle
- PlaceFile: web upload, Studio upload aliases, asset serving, file status/download
- Thumbnails: batch, avatar/headshot/game icons/game media, legacy aliases
- GamePage: details, favorite, servers, join
- GameJoin: join script, PlaceLauncher, negotiation, avatar-fetch
- Profile: profile data, description, friend request/accept
- Avatar: inventory/equip/unequip
- Catalog: search, details, create/update, purchase
- Community: friends, messages, groups, inventory, economy, settings

Use `grep -R "HttpGet\|HttpPost\|HttpPut\|HttpDelete" site/src/Controllers` for the exact route list.

## Windows/VPS operational facts

PostgreSQL command:

```powershell
& "C:\Program Files\PostgreSQL\13\bin\psql.exe" -h 127.0.0.1 -U luxora -d luxora ...
```

Run site:

```powershell
cd C:\Users\Administrator\Documents\luxora\site
dotnet run
```

RCC manual launch if needed:

```powershell
cd C:\Users\Administrator\Documents\luxora\grid\RCCService2020
.\RCCService.exe -Console -verbose -settingsfile ".\DevSettingsFile.json" -port 64989
```

Firewall must be configured from an elevated PowerShell. Open TCP/UDP `53640-53689` for external game clients. Keep SOAP `64989` localhost-only.

Public config:

- `Luxora.BaseUrl`: use `https://luxora.wtf` when reverse proxy/domain is ready, otherwise public HTTP test URL
- `Luxora.Grid.GameServerAddress`: `13.140.161.125`
- `Luxora.Grid.SiteInternalUrl`: `http://127.0.0.1:5299`

`site/appsettings.json` is gitignored and contains the real DB password. Never ask the user to paste it.

## Known quality problems / immediate next work

1. **Get screenshots before further visual guessing.** The user has repeatedly reported “looks bad” when exact CSS or wrappers were missing.
2. Verify the new dedicated Friends/Messages/Groups/Inventory/Robux/Settings templates after `34039eb`. They use real capture shells but much of their body markup is still JS-bound; compare against historical screenshots and captured bundles.
3. Verify Avatar no longer has any cookie overlay and that exact Avatar CSS loads.
4. Game page needs screenshot-based comparison to the real Arsenal capture. Keep its 2021 structure.
5. Catalog requires real creator item uploads/thumbnails; do not fake inventory.
6. Client is not solved. Find a verified patched archive or make a deterministic patcher before promising it works.
7. Add integration tests or a jsdom replay for each page. Previous jsdom tests were useful for detecting missing bundles and stale capture data.

## Communication style

The user types quickly with many typos, is enthusiastic, and is a beginner at operations. Be direct, avoid pretending something works when it is experimental, and give exact Windows commands. When a compile/runtime error appears, fix that exact error before adding more features.
