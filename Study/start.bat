@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Install Node.js 20.19 or newer, then run this file again.
  pause
  exit /b 1
)

node "%~dp0scripts\launch.mjs"
if errorlevel 1 (
  echo.
  echo Startup failed. Read the error above, then press any key to close.
  pause >nul
  exit /b 1
)
