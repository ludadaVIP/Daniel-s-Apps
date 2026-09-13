@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul || (echo Node.js 24.15.0 or newer is required.& pause & exit /b 1)
where npm >nul 2>nul || (echo npm was not found.& pause & exit /b 1)

if not exist "node_modules\" (
  echo Installing shared dependencies for NodeApps...
  call npm install
  if errorlevel 1 (echo Installation failed.& pause & exit /b 1)
)

echo.
echo NodeApps is starting at http://127.0.0.1:5888
echo One window, seven apps. Press Ctrl+C to stop.
echo.
call npm run dev
pause
