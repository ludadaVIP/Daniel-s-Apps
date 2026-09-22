#!/usr/bin/env bash
# Sons Apps - macOS / Linux launcher.
# All real work lives in start.py so the Windows launcher (start.bat)
# can reuse it.

set -e
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  exec python3 start.py "$@"
elif command -v python >/dev/null 2>&1; then
  exec python start.py "$@"
else
  echo "ERROR: Python 3.10+ not found on PATH." >&2
  echo "Install it from https://www.python.org/ and re-run." >&2
  exit 1
fi
