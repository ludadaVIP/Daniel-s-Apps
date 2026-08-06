#!/usr/bin/env bash
# macOS double-click launcher for Daniel's Apps.

cd "$(dirname "$0")" || exit 1

bash ./start.sh "$@"
status=$?

if [ "$status" -ne 0 ]; then
  echo
  echo "start.py exited with code $status."
  read -r -p "Press Return to close this window..."
fi

exit "$status"
