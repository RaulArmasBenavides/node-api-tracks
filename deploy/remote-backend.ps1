# Se ejecuta en la instancia BACK-APP-G2001 vía SSM (desde S3).
$ErrorActionPreference = 'Stop'
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
Stop-ScheduledTask -TaskName BackendPM2 -ErrorAction SilentlyContinue
Get-Process node, pm2* -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Copy-Item C:\app\.env C:\env.keep -Force
Remove-Item C:\app -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path C:\backend.zip -DestinationPath C:\app -Force
Copy-Item C:\env.keep C:\app\.env -Force
Set-Location C:\app
cmd /c "npm ci --no-audit --no-fund && npm run build"
if ($LASTEXITCODE -ne 0) { throw 'npm build failed' }
Start-ScheduledTask -TaskName BackendPM2
Write-Output 'backend desplegado'
