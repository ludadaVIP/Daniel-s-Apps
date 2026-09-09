@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto :missing_node

if exist "node_modules\" goto :start_app
echo [InsightMatrix] Installing dependencies for the first run...
call npm install
if errorlevel 1 goto :install_failed

:start_app
echo [InsightMatrix] Starting at http://127.0.0.1:5757
start "InsightMatrix Browser" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:5757'"
call npm run dev
if errorlevel 1 goto :startup_failed
goto :done

:missing_node
echo [InsightMatrix] Node.js 24.15.0 or newer is required.
pause
exit /b 1

:install_failed
echo [InsightMatrix] npm install failed.
pause
exit /b 1

:startup_failed
echo [InsightMatrix] The app could not start. Check whether ports 5757 and 5758 are already in use.
pause
exit /b 1

:done
endlocal
