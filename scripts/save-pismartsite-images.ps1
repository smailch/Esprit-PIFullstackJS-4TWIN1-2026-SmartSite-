$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $repoRoot "docker-images"
$outFile = Join-Path $outDir "pismartsite-stack.tar"
$backend = if ($env:BACKEND_IMAGE) { $env:BACKEND_IMAGE } else { "missaouimourad/pismartsite-backend:55-72bf0631" }
$frontend = if ($env:FRONTEND_IMAGE) { $env:FRONTEND_IMAGE } else { "missaouimourad/pismartsite-frontend:55-72bf0631" }
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
docker pull $backend; docker pull $frontend
docker save -o $outFile $backend $frontend
Write-Host "OK -> $outFile"
