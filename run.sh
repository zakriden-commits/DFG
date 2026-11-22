#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r backend/requirements.txt
echo "Запускаю NAREZKA SASNOGO на http://0.0.0.0:${PORT:-8000}"
exec .venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port "${PORT:-8000}"
