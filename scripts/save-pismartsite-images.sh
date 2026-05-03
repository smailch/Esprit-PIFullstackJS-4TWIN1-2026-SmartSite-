#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docker-images/pismartsite-stack.tar"
B="${BACKEND_IMAGE:-missaouimourad/pismartsite-backend:55-72bf0631}"
F="${FRONTEND_IMAGE:-missaouimourad/pismartsite-frontend:55-72bf0631}"
mkdir -p "$(dirname "$OUT")"
docker pull "$B" || true
docker pull "$F" || true
docker save -o "$OUT" "$B" "$F"
echo "OK $OUT"
