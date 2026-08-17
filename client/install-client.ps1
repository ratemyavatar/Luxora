# Installs the final December 2020 Roblox player and registers luxora-player://.
$ErrorActionPreference='Stop';[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
$root=Split-Path -Parent $PSScriptRoot;$dest=Join-Path $root 'client\Player2020';$tmp=Join-Path $env:TEMP 'luxora-player2020.zip'
New-Item -ItemType Directory -Force -Path $dest|Out-Null
$ver='version-66446108dba5497e';$urls=@("https://setup.rbxcdn.com/channel/zlive/$ver-RobloxApp.zip","https://setup.rbxcdn.com/$ver-RobloxApp.zip")
$ok=$false;foreach($url in $urls){try{Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $tmp -TimeoutSec 120;if((Get-Item $tmp).Length -gt 1000000){$ok=$true;break}}catch{}}
if(!$ok){throw 'Could not download the 2020 RobloxApp package.'}
Expand-Archive -Path $tmp -DestinationPath $dest -Force
$rcc=Join-Path $root 'grid\RCCService2020';foreach($name in @('content','platformcontent','shaders','ExtraContent','ExtraContent2020')){$src=Join-Path $rcc $name;if(Test-Path $src){Copy-Item $src $dest -Recurse -Force}}
$launcher=Join-Path $root 'client\LuxoraPlayer.ps1';$command="powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$launcher`" `"%1`""
New-Item 'HKCU:\Software\Classes\luxora-player' -Force|Out-Null;Set-ItemProperty 'HKCU:\Software\Classes\luxora-player' -Name '(default)' -Value 'URL:Luxora Player Protocol';New-ItemProperty 'HKCU:\Software\Classes\luxora-player' -Name 'URL Protocol' -Value '' -Force|Out-Null;New-Item 'HKCU:\Software\Classes\luxora-player\shell\open\command' -Force|Out-Null;Set-ItemProperty 'HKCU:\Software\Classes\luxora-player\shell\open\command' -Name '(default)' -Value $command
Write-Host "Installed 2020 player and luxora-player:// protocol." -ForegroundColor Green
