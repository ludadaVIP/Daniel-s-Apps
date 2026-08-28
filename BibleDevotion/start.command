#!/bin/bash
set -u

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || exit 1

# Finder launches .command files without the interactive shell configuration that
# normally adds Homebrew or nvm to PATH.  Add the Apple Silicon locations first,
# then fall back to the user's nvm installation when no global Node is available.
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin${PATH:+:$PATH}"

if ! command -v node >/dev/null 2>&1; then
  NVM_DIR="${NVM_DIR:-${HOME:-}/.nvm}"
  if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
    nvm use --silent >/dev/null 2>&1 || true
  fi
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Install Node.js 24.15.0 or newer, then run this launcher again."
  echo "https://nodejs.org/"
  read -r -p "Press Return to close..."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Repair or reinstall Node.js 24.15.0 or newer."
  read -r -p "Press Return to close..."
  exit 1
fi

if ! node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); process.exit(major > 24 || (major === 24 && (minor > 15 || (minor === 15 && patch >= 0))) ? 0 : 1)'; then
  echo "Bible Devotion requires Node.js 24.15.0 or newer. Your installed version is:"
  node --version
  read -r -p "Press Return to close..."
  exit 1
fi

if [ ! -d "node_modules" ] || ! npm ls --depth=0 >/dev/null 2>&1; then
  echo "Installing or repairing Bible Devotion dependencies..."
  # package-lock.json makes this a clean, repeatable repair even when an older
  # copied node_modules directory has become partially corrupted.
  if ! npm ci --no-audit --no-fund; then
    echo "Dependencies could not be installed. Check your internet connection and try again."
    read -r -p "Press Return to close..."
    exit 1
  fi
fi

echo "Starting Bible Devotion at http://127.0.0.1:5181/"
echo "Keep this window open while you use the app. Press Control+C to stop it."
npm run dev
