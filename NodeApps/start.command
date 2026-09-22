#!/bin/bash

# Double-click launcher for macOS (Apple Silicon and Intel).
set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

fail() {
  echo
  echo "${1}"
  read -r -p "Press Return to close this window..."
  exit 1
}

command -v node >/dev/null 2>&1 || fail "Node.js 24.15.0 or newer is required. Install it from https://nodejs.org first."
command -v npm >/dev/null 2>&1 || fail "npm was not found. Reinstall Node.js from https://nodejs.org."

node -e "const [major, minor] = process.versions.node.split('.').map(Number); process.exit(major > 24 || (major === 24 && minor >= 15) ? 0 : 1)" \
  || fail "Node.js $(node --version) is too old. Node.js 24.15.0 or newer is required."

if [ ! -d "node_modules" ]; then
  echo "Installing shared dependencies for NodeApps..."
  npm install || fail "Dependency installation failed. Check your internet connection, then try again."
fi

echo
echo "NodeApps is starting at http://127.0.0.1:5888"
echo "Building the interface, then starting one stable local service."
echo "One window, nine apps. Press Control-C to stop."
echo

npm run build || fail "NodeApps could not build the interface."

# Open only after the single production server reports healthy. `exec` keeps
# Control-C attached to npm so the local service shuts down cleanly.
(
  for _ in {1..80}; do
    if curl --silent --fail "http://127.0.0.1:5888/api/health" >/dev/null; then
      open "http://127.0.0.1:5888"
      exit 0
    fi
    sleep 0.25
  done
) &
exec npm run start
