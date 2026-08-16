@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Install Node.js 24.15.0 or newer, then run this launcher again.
  echo https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo npm was not found. Repair or reinstall Node.js 24.15.0 or newer.
  pause
  exit /b 1
)

node -e "const [major,minor,patch]=process.versions.node.split('.').map(Number); process.exit(major > 24 || (major === 24 && (minor > 15 || (minor === 15 && patch >= 0))) ? 0 : 1)"
if errorlevel 1 (
  echo.
  echo Bible Devotion requires Node.js 24.15.0 or newer. Your installed version is:
  node --version
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing Bible Devotion dependencies for the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependencies could not be installed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo Starting Bible Devotion at http://127.0.0.1:5181/
echo Keep this window open while you use the app. Press Ctrl+C to stop it.
npm run dev
