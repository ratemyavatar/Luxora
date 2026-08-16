# Fetch the exact content trees paired with Luxora's kornet RCCService2020 build.
# Run from any directory in Windows PowerShell:
#   powershell -ExecutionPolicy Bypass -File grid\FETCH_CONTENT.ps1
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $repo 'grid\RCCService2020'
$temp = Join-Path $env:TEMP 'luxora-kornet-rcc-content'
$paths = @(
    'RCCService2020/content',
    'RCCService2020/platformcontent',
    'RCCService2020/shaders',
    'RCCService2020/ExtraContent',
    'RCCService2020/ExtraContent2020'
)

if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
Write-Host 'Cloning the exact RCC content with sparse checkout (several hundred MB)...' -ForegroundColor Cyan
& git clone --depth 1 --filter=blob:none --sparse https://github.com/rytiufi1/kornet $temp
if ($LASTEXITCODE -ne 0) { throw 'git clone failed' }
& git -C $temp sparse-checkout set @paths
if ($LASTEXITCODE -ne 0) { throw 'git sparse-checkout failed' }

foreach ($relative in $paths) {
    $name = Split-Path $relative -Leaf
    $source = Join-Path $temp ($relative -replace '/', '\')
    $target = Join-Path $dest $name
    if (!(Test-Path $source)) { throw "source tree is missing: $source" }
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    Copy-Item (Join-Path $source '*') $target -Recurse -Force
    $count = (Get-ChildItem $target -Recurse -File).Count
    Write-Host ("OK {0}: {1} files" -f $name, $count) -ForegroundColor Green
    if ($count -eq 0) { throw "$name is empty after copy" }
}

Remove-Item $temp -Recurse -Force
Write-Host 'Exact RCCService2020 content installation complete.' -ForegroundColor Cyan
