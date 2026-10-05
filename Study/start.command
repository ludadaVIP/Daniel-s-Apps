#!/bin/zsh -l
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 20.19 or newer, then run this file again."
  read -r "?Press Enter to close..."
  exit 1
fi

node ./scripts/launch.mjs
exit_code=$?
if (( exit_code != 0 )); then
  echo
  read -r "?Startup failed. Read the error above, then press Enter to close..."
fi
exit $exit_code
