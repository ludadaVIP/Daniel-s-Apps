#!/usr/bin/env bash
# macOS double-click launcher.
# Finder opens .command files in Terminal, so this gives macOS the same
# one-gesture startup flow as start.bat on Windows.

cd "$(dirname "$0")" || exit 1

if [ ! -x "./start.sh" ]; then
  chmod +x "./start.sh" 2>/dev/null || true
fi

./start.sh "$@"
status=$?

if [ "$status" -ne 0 ]; then
  echo
  echo "start.sh exited with code $status."
  echo "Press Return to close this window."
  read -r _
fi

exit "$status"
