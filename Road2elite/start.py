"""Cross-platform launcher for Sons Apps.

Run with `python start.py` (or `python3 start.py`). It works the same way
on Windows and macOS:

1. Creates `backend/.venv/` and installs `backend/requirements.txt` if
   missing.
2. Runs `npm install` in `frontend/` if `node_modules/` is missing.
3. Starts Flask on :8005 and Vite on :5175 concurrently. Hit Ctrl+C in
   the terminal where this script runs to stop both.

Windows-specific notes (the reason this script exists at all):

- `npm` is `npm.cmd` on Windows but a plain shell script on macOS/Linux.
  Calling `subprocess.Popen([npm.cmd, ...])` directly on Windows can lose
  the child's stdout. We route npm through `cmd.exe /c` to fix that.
- The venv interpreter lives at `.venv/Scripts/python.exe` on Windows
  but `.venv/bin/python` on macOS/Linux.
- Ctrl+C handling: we install a signal handler that terminates both
  children before letting the process exit, so you don't get the
  Windows "终止批处理操作吗 / Terminate batch job?" prompt with stale
  servers still running in the background.
"""

from __future__ import annotations

import os
import shutil
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
VENV_DIR = BACKEND_DIR / ".venv"
IS_WINDOWS = os.name == "nt"
BACKEND_PORT = "8005"
FRONTEND_PORT = "5175"

VENV_PYTHON = (
    VENV_DIR / "Scripts" / "python.exe" if IS_WINDOWS
    else VENV_DIR / "bin" / "python"
)

# Updated by spawn_*() so the signal handler can find them.
_PROCESSES: list[subprocess.Popen] = []


def find_executable(name: str) -> str:
    """Find a CLI tool on PATH, accepting Windows .cmd / .exe variants."""
    candidates = [name]
    if IS_WINDOWS:
        candidates += [f"{name}.cmd", f"{name}.exe", f"{name}.bat"]
    for candidate in candidates:
        resolved = shutil.which(candidate)
        if resolved:
            return resolved
    raise FileNotFoundError(
        f"Could not find `{name}` on PATH. "
        f"Install it (Python 3.10+ / Node 18+) and re-run."
    )


def ensure_python_version() -> None:
    if sys.version_info < (3, 10):
        raise SystemExit(
            f"Python 3.10+ is required, you are on {sys.version.split()[0]}."
        )


def ensure_venv() -> None:
    if VENV_PYTHON.exists():
        return
    print(f"[setup] Creating Python venv at {VENV_DIR.relative_to(ROOT)} ...")
    subprocess.check_call([sys.executable, "-m", "venv", str(VENV_DIR)])
    print("[setup] Upgrading pip ...")
    subprocess.check_call(
        [str(VENV_PYTHON), "-m", "pip", "install", "--quiet", "--upgrade", "pip"]
    )
    print("[setup] Installing backend requirements ...")
    subprocess.check_call(
        [str(VENV_PYTHON), "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt")]
    )


def ensure_node_modules() -> None:
    node_modules = FRONTEND_DIR / "node_modules"
    if node_modules.exists():
        return
    print("[setup] Running `npm install` in frontend/ (first run only) ...")
    run_npm(["install"], wait=True)


def run_npm(args: list[str], *, wait: bool, cwd: Path = FRONTEND_DIR) -> subprocess.Popen:
    """Run npm in a way that streams output correctly on every OS.

    On Windows, npm is a .cmd file that CreateProcess can't run directly
    while keeping stdout connected — we route through cmd.exe /c.
    """
    if IS_WINDOWS:
        cmd = ["cmd.exe", "/c", "npm", *args]
    else:
        cmd = ["npm", *args]
    process = subprocess.Popen(cmd, cwd=cwd)
    if wait:
        rc = process.wait()
        if rc != 0:
            raise SystemExit(f"`npm {' '.join(args)}` exited with code {rc}.")
    return process


def spawn_flask() -> subprocess.Popen:
    env = os.environ.copy()
    env.setdefault("PORT", BACKEND_PORT)
    print(f"[run] Flask backend at http://127.0.0.1:{env['PORT']}")
    proc = subprocess.Popen(
        [str(VENV_PYTHON), "-u", "app.py"],  # -u for unbuffered stdout
        cwd=BACKEND_DIR,
        env=env,
    )
    _PROCESSES.append(proc)
    return proc


def spawn_vite() -> subprocess.Popen:
    print(f"[run] Vite dev server at http://127.0.0.1:{FRONTEND_PORT} (first start may take 10-30s)")
    proc = run_npm(["run", "dev"], wait=False)
    _PROCESSES.append(proc)
    return proc


def shutdown_children() -> None:
    """Terminate any child still running. Safe to call multiple times."""
    for proc in _PROCESSES:
        if proc.poll() is not None:
            continue
        try:
            if IS_WINDOWS:
                # taskkill /T kills the whole process tree, which matters
                # because we launched npm via cmd.exe — terminating the cmd
                # shell alone would orphan the actual Vite node process.
                subprocess.call(
                    ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
            else:
                proc.terminate()
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
    # Wait briefly for them to die so we exit cleanly.
    deadline = time.time() + 5
    for proc in _PROCESSES:
        remaining = max(0.0, deadline - time.time())
        try:
            proc.wait(timeout=remaining)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass


def install_signal_handlers() -> None:
    """Forward Ctrl+C / SIGTERM to children, then exit cleanly."""
    def handler(signum, _frame):
        print(f"\n[exit] Signal {signum} received, stopping Flask + Vite ...")
        shutdown_children()
        sys.exit(0)

    signal.signal(signal.SIGINT, handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, handler)
    if IS_WINDOWS and hasattr(signal, "SIGBREAK"):
        signal.signal(signal.SIGBREAK, handler)


def main() -> int:
    ensure_python_version()
    print(f"[setup] Project root: {ROOT}")
    ensure_venv()
    ensure_node_modules()

    install_signal_handlers()

    flask_proc = spawn_flask()
    # Small delay so Flask binds before Vite starts proxying.
    time.sleep(1.5)
    vite_proc = spawn_vite()

    print()
    print("=" * 60)
    print(f"  Open http://127.0.0.1:{FRONTEND_PORT} in your browser.")
    print("  Vite usually prints 'ready in NN ms' once it's serving.")
    print("  Press Ctrl+C in this terminal to stop everything cleanly.")
    print("=" * 60)
    print()

    try:
        while True:
            if flask_proc.poll() is not None:
                print(f"[exit] Flask exited with code {flask_proc.returncode}.")
                break
            if vite_proc.poll() is not None:
                print(f"[exit] Vite exited with code {vite_proc.returncode}.")
                break
            time.sleep(0.5)
    finally:
        shutdown_children()
    return 0


if __name__ == "__main__":
    sys.exit(main())
