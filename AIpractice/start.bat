@echo off
setlocal
cd /d "%~dp0"

REM This is the only file a normal user needs to open. It installs missing
REM runtimes when Windows Package Manager is available, then lets start.py
REM handle all app-specific packages and startup.
where python >nul 2>&1
if errorlevel 1 (
  where py >nul 2>&1
  if errorlevel 1 call :install_python
)

where node >nul 2>&1
if errorlevel 1 call :install_node

where npm >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js was not installed successfully. Please restart this file once.
  pause
  exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
  where py >nul 2>&1
  if errorlevel 1 (
    echo.
    echo Python was not installed successfully. Please restart this file once.
    pause
    exit /b 1
  ) else (
    py -3 start.py %*
  )
) else (
  python start.py %*
)

if not "%errorlevel%"=="0" pause
exit /b %errorlevel%

:install_python
where winget >nul 2>&1
if errorlevel 1 (
  echo.
  echo Python 3.10+ is required, but Windows Package Manager is unavailable.
  echo Install Python from https://www.python.org/downloads/ then open this file again.
  pause
  exit /b 1
)
echo.
echo [setup] Installing Python. This may take a few minutes...
winget install --id Python.Python.3.12 --exact --source winget --silent --accept-source-agreements --accept-package-agreements
if errorlevel 1 exit /b 1
set "PATH=%PATH%;%LocalAppData%\Programs\Python\Python312;%LocalAppData%\Programs\Python\Python312\Scripts"
exit /b 0

:install_node
where winget >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js 18+ is required, but Windows Package Manager is unavailable.
  echo Install Node.js LTS from https://nodejs.org/ then open this file again.
  pause
  exit /b 1
)
echo.
echo [setup] Installing Node.js LTS. This may take a few minutes...
winget install --id OpenJS.NodeJS.LTS --exact --source winget --silent --accept-source-agreements --accept-package-agreements
if errorlevel 1 exit /b 1
set "PATH=%PATH%;%ProgramFiles%\nodejs"
exit /b 0
