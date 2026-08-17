# Refreshes the captured 2022 Create Experience template cards through Roblox's
# thumbnail metadata API. The original tr.rbxcdn URLs expired; place IDs are stable.
$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$repo = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $repo 'site\wwwroot\bundles\img\templates'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$items = @(
    @{ Id=95206881;  Hash='f8573c39d3145534b016b0b5d9317206' },
    @{ Id=6560363541; Hash='ee7a7040fffb577ef06306effd5d316c' },
    @{ Id=95206192;  Hash='d1d3cbe88e0b313735f6bdec4d8640db' },
    @{ Id=520390648; Hash='a35d9ca69016f260cb1f1d6309d2b62e' },
    @{ Id=203810088; Hash='81108c7d12f9b427728c7654e963a3ae' },
    @{ Id=366130569; Hash='dd3c0fe77724a1ccdc95bbb0de680def' },
    @{ Id=215383192; Hash='ed30d9c6b2dd76e1208f988ee00468f7' },
    @{ Id=264719325; Hash='3be067a7fa1ac7fd8f09d1725a540af3' },
    @{ Id=366120910; Hash='fea798f7fd230b72767721f497d3305d' },
    @{ Id=203783329; Hash='10538b7a5a5c8e2e3d263450020e36bb' },
    @{ Id=203812057; Hash='b293e72e38902f4644ada99468b0de35' },
    @{ Id=379736082; Hash='3989c06d3d44d304e507778743f80a60' },
    @{ Id=301530843; Hash='28c1393bc6b6e521f0ec4ceb77e50ee8' },
    @{ Id=92721754;  Hash='8850bd0a58888f59745634ceab9c1ae0' },
    @{ Id=301529772; Hash='538a29e7b8476335838ba9d3aca84c86' },
    @{ Id=203885589; Hash='b403e6102aecad666cc584d1a3dcff61' }
)
$ok=0; $fail=0
foreach ($item in $items) {
    $out = Join-Path $dest ($item.Hash + '.jpg')
    try {
        $api = "https://thumbnails.roblox.com/v1/places/gameicons?placeIds=$($item.Id)&returnPolicy=PlaceHolder&size=150x150&format=Jpeg&isCircular=false"
        $metadata = Invoke-RestMethod -Uri $api -TimeoutSec 30
        $entry = $metadata.data | Select-Object -First 1
        if (!$entry -or $entry.state -ne 'Completed' -or !$entry.imageUrl) { throw "thumbnail state: $($entry.state)" }
        Invoke-WebRequest -UseBasicParsing -Uri $entry.imageUrl -OutFile $out -TimeoutSec 30
        if ((Get-Item $out).Length -lt 100) { throw 'download was empty' }
        $ok++; Write-Host "OK   bundles/img/templates/$($item.Hash).jpg"
    } catch {
        $fail++; if (Test-Path $out) { Remove-Item $out -Force }
        Write-Host "FAIL template $($item.Id): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host "template images: $ok ok, $fail failed" -ForegroundColor Cyan
if ($fail -gt 0) { exit 1 }
