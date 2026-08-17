# Installs a revival-compatible late-2020 client and registers luxora-player://.
$ErrorActionPreference='Stop'
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
$root=Split-Path -Parent $PSScriptRoot
$dest=Join-Path $root 'client\Player2020'
$tmp=Join-Path $env:TEMP 'luxora-player2020.zip'
if(Test-Path $dest){Remove-Item $dest -Recurse -Force}
New-Item -ItemType Directory -Force -Path $dest|Out-Null

# Prefer BubbaBlox's public patched 2020L package: unlike the stock RobloxApp ZIP,
# it accepts revival BaseUrls and join tickets. Fall back to the official package.
$ver='version-66446108dba5497e'
$urls=@(
 'https://bb.zawg.ca/assets/ecsr/bubbaclient2020.zip?v=15',
 'https://zawg.ca/assets/ecsr/bubbaclient2020.zip?v=15',
 "https://setup.rbxcdn.com/channel/zlive/$ver-RobloxApp.zip",
 "https://setup.rbxcdn.com/$ver-RobloxApp.zip"
)
$ok=$false
foreach($url in $urls){
 try{
  Write-Host "Downloading $url"
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $tmp -TimeoutSec 180
  if((Get-Item $tmp).Length -gt 1000000){$ok=$true;break}
 }catch{Write-Host "Download failed: $($_.Exception.Message)" -ForegroundColor Yellow}
}
if(!$ok){throw 'Could not download a compatible 2020 client package.'}
Expand-Archive -Path $tmp -DestinationPath $dest -Force
$rcc=Join-Path $root 'grid\RCCService2020'
foreach($name in @('content','platformcontent','shaders','ExtraContent','ExtraContent2020')){
 $src=Join-Path $rcc $name
 if(Test-Path $src){Copy-Item $src $dest -Recurse -Force}
}
$client=Get-ChildItem $dest -Recurse -File|Where-Object{$_.Name-in@('BBPlayerBeta.exe','RobloxPlayerBeta.exe')}|Select-Object -First 1
if(!$client){throw 'The downloaded archive contained no player executable.'}
$launcher=Join-Path $root 'client\LuxoraPlayer.ps1'
$command="powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$launcher`" `"%1`""
New-Item 'HKCU:\Software\Classes\luxora-player' -Force|Out-Null
Set-ItemProperty 'HKCU:\Software\Classes\luxora-player' -Name '(default)' -Value 'URL:Luxora Player Protocol'
New-ItemProperty 'HKCU:\Software\Classes\luxora-player' -Name 'URL Protocol' -Value '' -Force|Out-Null
New-Item 'HKCU:\Software\Classes\luxora-player\shell\open\command' -Force|Out-Null
Set-ItemProperty 'HKCU:\Software\Classes\luxora-player\shell\open\command' -Name '(default)' -Value $command
Write-Host "Installed compatible 2020 player: $($client.FullName)" -ForegroundColor Green
Write-Host 'Registered luxora-player:// protocol.' -ForegroundColor Green
