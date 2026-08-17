param([Parameter(Mandatory=$true)][string]$Uri)
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
$log=Join-Path $repo 'client\launcher.log'
try {
    Add-Content $log "`n[$(Get-Date -Format o)] protocol: $Uri"
    $u=[Uri]$Uri;$query=@{}
    $u.Query.TrimStart('?').Split('&')|ForEach-Object{$p=$_.Split('=',2);if($p.Length-eq2){$query[$p[0]]=[Uri]::UnescapeDataString($p[1])}}
    $ticket=$query.ticket;$placeId=$query.placeId;$base=$query.baseUrl
    if(!$base){$base='http://localhost:5299'}
    $player=Get-ChildItem (Join-Path $repo 'client\Player2020') -Recurse -Filter 'RobloxPlayerBeta.exe' -File | Select-Object -First 1
    if(!$player){throw 'RobloxPlayerBeta.exe was not found. Run client\install-client.ps1 again.'}
    # Match the known working BubbaBlox 2020 invocation: auth URL, PlaceLauncher URL, ticket.
    $join="$base/game/PlaceLauncher.ashx?placeid=$placeId&ticket=$ticket&2020=true"
    $auth="$base/login/negotiate.ashx"
    $arguments="-a `"$auth`" -j `"$join`" -t `"$ticket`""
    Add-Content $log "player: $($player.FullName)`nargs: $arguments"
    $process=Start-Process -FilePath $player.FullName -ArgumentList $arguments -WorkingDirectory $player.DirectoryName -PassThru
    Add-Content $log "started pid $($process.Id)"
} catch {
    Add-Content $log "ERROR: $($_.Exception.ToString())"
    Write-Host "Luxora client launch failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host 'Press Enter to close'
}
