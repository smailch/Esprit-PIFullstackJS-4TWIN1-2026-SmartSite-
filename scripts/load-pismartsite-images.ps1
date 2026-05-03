$ErrorActionPreference = "Stop"
$r = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$t = Join-Path $r "docker-images\pismartsite-stack.tar"
if (-not (Test-Path -LiteralPath $t)) { throw "Manquant: $t — exécutez scripts\save-pismartsite-images.ps1" }
docker load -i $t
