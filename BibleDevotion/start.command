#!/bin/bash
set -u

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || exit 1

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

if [ ! -d "node_modules" ]; then
  echo "Installing Bible Devotion dependencies for the first time..."
  if ! npm install; then
    echo "Dependencies could not be installed. Check your internet connection and try again."
    read -r -p "Press Return to close..."
    exit 1
  fi
fi

echo "Starting Bible Devotion at http://127.0.0.1:5181/"
echo "Keep this window open while you use the app. Press Control+C to stop it."
npm run dev
