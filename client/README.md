# Luxora 2020 client

Run from the repository root in Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File client\install-client.ps1
```

This downloads Roblox build `version-66446108dba5497e` (December 2020), copies the already-installed RCC content trees, and registers the per-user `luxora-player://` browser protocol. The downloaded player stays gitignored under `client/Player2020`.

The site Play button starts/selects an RCC game server, issues a five-minute join ticket, then opens this protocol. Local testing uses `127.0.0.1`; before public testing set `Luxora.Grid.GameServerAddress` in `site/appsettings.json` to the VPS public game-server IP and open UDP/TCP ports 53640-53689.
