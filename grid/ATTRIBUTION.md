# Attribution / provenance for grid/

## kornet src v2 — AGPL-3.0
`RCCService2020/internalscripts/`, `internalscripts/GameServer*.lua`, `DevSettingsFile.json`, `AppSettings.xml`
and the prepatched binary arrangement are taken from `https://github.com/rytiufi1/kornet`
("Kornet src v2", authors rytiufi / unknown / potato / syn / yxga et al.), licensed **GNU AGPL-3.0** (a copy of that license lives in their repo). These files in turn derive from the Economy Simulator (ECS) lineage (floatzel, harryzawg).

If Luxora keeps and/or modifies these specific files, the AGPL obligations apply to them
(network use = conveyance: source + license must stay available). Clean-room rewrites of
the surrounding Luxora backend are our own and can carry any license; keep this file with
the folder so the origin of the derived material stays documented.

## Roblox Corporation binaries
`RCCService.exe`, `OPENGL32.DLL`, `msvc*.dll`, `cacert.pem` and the stock content fetched by
`FETCH_CONTENT.sh` are proprietary Roblox Corporation material (client build 0.450.0.411923).
They are committed here solely as reference/runtime material for a private historical
revival/educational project; no rights are claimed. Remove for any public redistribution.