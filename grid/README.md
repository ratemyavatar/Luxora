# Luxora grid node — RCCService 2020

Solved + committed 2026-08-16. This is a **ready-to-run 2020L Roblox grid server** (RCC),
sourced from `github.com/rytiufi1/kornet` (their production setup) — see `ATTRIBUTION.md`.

## What's here
| Path | Purpose |
|---|---|
| `RCCService2020/RCCService.exe` | The grid node itself — build **0.450.0.411923** (2020-09-30, mid-2020L), pre-patched by the kornet team for revival use (http base-url, trust-check bypass). sha256 in `SHA256SUMS.txt`. |
| `RCCService2020/OPENGL32.DLL` | shim needed for headless/offscreen GL on Windows server boxes |
| `RCCService2020/msvcp110.dll`, `msvcr110.dll`, `VMProtectSDK32.dll` | runtime deps |
| `RCCService2020/AppSettings.xml` | `<ContentFolder>content</ContentFolder>` + `<BaseUrl>http://127.0.0.1:5299</BaseUrl>` for the one-VPS localhost setup (change only when RCC and site are on different hosts) |
| `RCCService2020/DevSettingsFile.json` | complete 2020 FFlag set for grid mode (240KB, feeds `-settingsfile`) |
| `RCCService2020/ssl/cacert.pem` | CA bundle for the RCC's internal https client |
| `RCCService2020/internalscripts/` | **real 2020 internal scripts** — `thumbnails/` (Avatar, Avatar_R15_*, Hat, Model, Place, Shirt, Pants, Mesh, Gear, Head, Closeup, Package, Image, Video, Animation…), `scripts/ValidateUgcContent.lua`, `modules/assetValidation/Hat.lua` — our render + validation script basis |
| `internalscripts/GameServer.lua` | kornet game-server bootstrap (sent via OpenJobEx). Placeholders the site fills: `%port% %placeId% %creatorId% %apiKey%` + `_AUTHORIZATION_STRING_` |
| `internalscripts/GameServerFloatzelECS.lua` | ECS's original bootstrap (reference) |
| `internalscripts/GameServerRCC.lua` | RCC-specific variant |
| `FETCH_CONTENT.sh` | pulls the stock `content/`, `platformcontent/`, `shaders/`, `ExtraContent*` trees (~360MB, intentionally not committed) |

## First-time setup (per grid machine)
On the Windows VPS, use the exact sparse-copy installer (preferred):
```powershell
powershell -ExecutionPolicy Bypass -File grid\FETCH_CONTENT.ps1
```
It fills `content`, `platformcontent`, `shaders`, `ExtraContent`, and `ExtraContent2020` from the exact kornet RCC build. `FETCH_CONTENT.sh` is only a CDN fallback; some old CDN packages now return 403 and are not sufficient by themselves.

## Running a node (Windows grid box)
```
cd grid/RCCService2020
RCCService.exe -console -verbose -port 64989 -settingsfile DevSettingsFile.json
```
Then the Luxora site drives it over **SOAP** at `http://127.0.0.1:64989`:
- Thumbnail requests use `OpenJob` (ns `http://roblox.com/`) and save returned PNGs under `site/wwwroot/thumbnails`. Headshots, full avatars, game icons, game thumbnails, the navbar, and the home cards all point to this cache.
- Published `.rbxl`/`.rbxlx` files are saved under `RCCService2020/places`. Web uploads and the 2020 Studio aliases `/Data/Upload.ashx` and `/ide/publish/UploadExistingAsset` update `place.rcc_file`; RCC thumbnails consume that same file.
- `grid/soapui/thumbnail-smoke-request.xml` is a ready-to-paste SoapUI request. Create a POST request to `http://127.0.0.1:64989`, content type `text/xml`, paste it, and the first returned Lua value is a base64 PNG.
- Game servers use `OpenJobEx` with job `{id: guid, category: 1, cores: 1, expirationInSeconds: 43600}` and CDATA script = `internalscripts/GameServer.lua` with `%name%`-placeholders filled in
- GameServer.lua registers the server back at the site (`/gs/ping`, `/gs/activity`, `/gs/shutdown`, `/gs/players/report` + shared `GameServerAuthorization` header; badge award via `game/badge/award.ashx`).
- 2021-era RCC builds want the SOAP12 `RCCServiceSoap`/`RCCServiceSoap12` namespaces instead (client handled in site code — see study notes `study/backend_api/kornet_architecture.md`).

Port plan: SOAP port = random free port per node process; game traffic port (`%port%` in GameServer.lua) = the one advertised to players inside joinscripts (`MachineAddress`).

## Compatibility
- Player client pinned to **0.459.2.415973 (2020-12-11)** talks to this 0.450 RCC fine (same network protocol family; 2020L trains interop — kornet and other revivals ran mixed 2020 minors in production).
- If we ever want an exact-459 RCC: archive.roblonium.com `RCCServiceR7Z9CYTW7WBR95VW` version-* zips (~21MB each) + the HxD patches in `study/_references/orc_keyfiles/` (https→http byte patch, non-trusted BaseURL jne→jmp, timeout patch) — only do this if 0.450 gives trouble.