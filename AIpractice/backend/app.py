"""Standalone backend for AI Practice."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
FRONTEND_DIST = PROJECT_DIR / "frontend" / "dist"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from apps.ai_practice.routes import bp as ai_practice_bp


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    app.register_blueprint(ai_practice_bp, url_prefix="/api/ai-practice")

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "app": "AI Practice"})

    @app.get("/", defaults={"path": ""})
    @app.get("/<path:path>")
    def serve_frontend(path: str):
        target = FRONTEND_DIST / path if path else FRONTEND_DIST / "index.html"
        if path and target.is_file():
            return send_from_directory(FRONTEND_DIST, path)
        if (FRONTEND_DIST / "index.html").is_file():
            return send_from_directory(FRONTEND_DIST, "index.html")
        return jsonify({
            "status": "ok",
            "message": "AI Practice is starting. Run start.bat or python start.py.",
        })

    return app


if __name__ == "__main__":
    create_app().run(
        host="127.0.0.1",
        port=int(os.environ.get("PORT", "8000")),
        debug=os.environ.get("FLASK_DEBUG", "0") == "1",
        use_reloader=False,
    )
