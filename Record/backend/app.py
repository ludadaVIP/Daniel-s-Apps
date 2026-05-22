"""Flask backend for Record & Meditation and Save MD."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

# Make `apps.*` and `shared.*` importable regardless of cwd.
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from apps.record_meditation.routes import bp as record_meditation_bp
from apps.save_md.routes import AUDIO_DIR as SAVE_MD_AUDIO_DIR
from apps.save_md.routes import bp as save_md_bp


FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PATCH,DELETE,OPTIONS"
        return response

    app.register_blueprint(record_meditation_bp, url_prefix="/api/record-meditation")
    app.register_blueprint(save_md_bp, url_prefix="/api/save-md")

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "apps": ["record-meditation", "save-md"]})

    @app.get("/audio/save-md/<path:filename>")
    def serve_save_md_audio(filename: str):
        return send_from_directory(SAVE_MD_AUDIO_DIR, filename, max_age=31536000)

    @app.get("/", defaults={"path": ""})
    @app.get("/<path:path>")
    def serve_frontend(path: str):
        target = FRONTEND_DIST / path if path else FRONTEND_DIST / "index.html"
        if path and target.exists() and target.is_file():
            return send_from_directory(FRONTEND_DIST, path)
        index = FRONTEND_DIST / "index.html"
        if index.exists():
            return send_from_directory(FRONTEND_DIST, "index.html")
        return jsonify({
            "status": "ok",
            "message": (
                "Flask is running. Frontend build not found; start the Vite "
                "dev server in frontend/ or run `npm run build` first."
            ),
            "health": "/api/health",
        })

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8005"))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    create_app().run(host="127.0.0.1", port=port, debug=debug, use_reloader=False)
