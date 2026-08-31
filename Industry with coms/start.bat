@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found. Install Node.js 24.15.0 or newer.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [FIRST RUN] Installing dependencies. Please wait...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting Industry Atlas...
echo Open: http://127.0.0.1:5188
echo Press Ctrl+C to stop the server.
echo.
call npm run dev

pause
