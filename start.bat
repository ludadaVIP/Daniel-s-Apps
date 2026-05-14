@echo off
REM Daniel's Apps - Windows launcher.
REM All real work lives in start.py so the Mac/Linux launcher (start.sh)
REM can reuse it. If `python` is not on PATH, try `py -3`.

cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel%==0 (
  python start.py %*
  set EXITCODE=%errorlevel%
) else (
  where py >nul 2>&1
  if %errorlevel%==0 (
    py -3 start.py %*
    set EXITCODE=%errorlevel%
  ) else (
    echo.
    echo ERROR: neither `python` nor `py` was found on PATH.
    echo Install Python 3.10+ from https://www.python.org/downloads/
    echo and tick "Add Python to PATH" during install.
    echo.
    pause
    exit /b 1
  )
)

REM Keep the window open if start.py crashed early, so the error is readable.
if not "%EXITCODE%"=="0" (
  echo.
  echo start.py exited with code %EXITCODE%.
  pause
)
