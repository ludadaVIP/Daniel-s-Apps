"""One-click launcher for the standalone AI Practice app."""

from __future__ import annotations

import os
import platform
import shutil
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
VENV_DIR = BACKEND_DIR / ".venv"
IS_WINDOWS = os.name == "nt"
VENV_PYTHON = VENV_DIR / ("Scripts/python.exe" if IS_WINDOWS else "bin/python")
APP_PORT = 1234
APP_URL = f"http://127.0.0.1:{APP_PORT}"
PROCESSES: list[subprocess.Popen] = []
RUNTIME_MARKER = ROOT / ".ai-practice-runtime.json"


def executable(name: str) -> str:
    for candidate in ([name, f"{name}.cmd", f"{name}.exe"] if IS_WINDOWS else [name]):
        if resolved := shutil.which(candidate):
            return resolved
    raise SystemExit(f"{name} was not found. Install Python 3.10+ and Node.js 18+ first.")


def run_npm(args: list[str], *, wait: bool) -> subprocess.Popen:
    command = ["cmd.exe", "/c", "npm", *args] if IS_WINDOWS else ["npm", *args]
    process = subprocess.Popen(command, cwd=FRONTEND_DIR)
    if wait and process.wait() != 0:
        raise SystemExit(f"npm {' '.join(args)} failed.")
    return process


def runtime_signature() -> dict[str, str]:
    return {
        "computer": os.environ.get("COMPUTERNAME") or platform.node(),
        "python": str(Path(sys.executable).resolve()),
        "platform": sys.platform,
    }


def installed_for_this_computer() -> bool:
    try:
        return json.loads(RUNTIME_MARKER.read_text(encoding="utf-8")) == runtime_signature()
    except (FileNotFoundError, ValueError):
        return False


def clear_copied_runtime() -> bool:
    """Discard only generated dependencies copied from a different computer."""
    if installed_for_this_computer():
        return False
    for generated_dir in (VENV_DIR, FRONTEND_DIR / "node_modules"):
        if generated_dir.exists():
            shutil.rmtree(generated_dir)
    RUNTIME_MARKER.unlink(missing_ok=True)
    return True


def ensure_dependencies() -> bool:
    copied_runtime_removed = clear_copied_runtime()
    if not VENV_PYTHON.exists():
        print("[setup] Creating Python environment and installing backend packages…")
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV_DIR)])
        subprocess.check_call([str(VENV_PYTHON), "-m", "pip", "install", "--quiet", "--upgrade", "pip"])
        subprocess.check_call([str(VENV_PYTHON), "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt")])
    if not (FRONTEND_DIR / "node_modules").exists():
        print("[setup] Installing the AI Practice interface packages…")
        run_npm(["install"], wait=True)
    RUNTIME_MARKER.write_text(json.dumps(runtime_signature(), ensure_ascii=False), encoding="utf-8")
    return copied_runtime_removed


def stop_children() -> None:
    for process in PROCESSES:
        if process.poll() is not None:
            continue
        if IS_WINDOWS:
            subprocess.call(["taskkill", "/F", "/T", "/PID", str(process.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            process.terminate()


def shutdown(*_args) -> None:
    stop_children()
    raise SystemExit(0)


def app_ready() -> bool:
    try:
        with urllib.request.urlopen(APP_URL, timeout=1):
            return True
    except (urllib.error.URLError, TimeoutError):
        return False


def port_is_available() -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.2)
        return probe.connect_ex(("127.0.0.1", APP_PORT)) != 0


def main() -> None:
    if sys.version_info < (3, 10):
        raise SystemExit("Python 3.10+ is required.")
    executable("node")
    executable("npm")
    copied_runtime_removed = ensure_dependencies()
    frontend_build = FRONTEND_DIR / "dist" / "index.html"
    if copied_runtime_removed or not frontend_build.exists():
        print("[setup] Building the AI Practice interface…")
        run_npm(["run", "build"], wait=True)
    if not port_is_available():
        raise SystemExit(f"Port {APP_PORT} is already in use. Close the other program using it, then run start.bat again.")
    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    backend = subprocess.Popen(
        [str(VENV_PYTHON), "-u", "app.py"],
        cwd=BACKEND_DIR,
        env={**os.environ, "PORT": str(APP_PORT)},
    )
    PROCESSES.append(backend)
    print(f"\nAI Practice: {APP_URL}\nPress Ctrl+C to stop.\n")

    opened = False
    try:
        while True:
            if not opened and app_ready():
                webbrowser.open(APP_URL)
                opened = True
            if backend.poll() is not None:
                raise SystemExit("AI Practice stopped unexpectedly; check the messages above.")
            time.sleep(0.5)
    finally:
        stop_children()


if __name__ == "__main__":
    main()
