"""Daniel's Apps — unified Flask backend.

Mounts each sub-application as a Flask blueprint under a distinct
URL prefix so the four apps no longer collide on shared paths like
``/api/quizzes`` or ``/api/tts``.

URL layout
----------
- ``/api/french/*``         French Sprint (lessons, roadmap, TTS, progress)
- ``/api/quiz/*``           English Adventure Quiz (mc / wordorder / fill)
- ``/api/live-spanish/*``   Live Spanish (rich quizzes with per-question audio)
- ``/api/lab/*``            Language Output Lab (topics across 4 languages)
- ``/api/bible/*``          Bible Memorizer (random verses across CUV/ESV/NVI)
- ``/audio/<app>/*``        Audio cache for the matching sub-app
- ``/api/health``           Liveness probe
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Make `apps.*` and `shared.*` importable regardless of cwd.
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from flask import Flask, jsonify, send_from_directory

from apps.french.routes import bp as french_bp, AUDIO_DIR as FRENCH_AUDIO_DIR
from apps.quiz.routes import bp as quiz_bp
from apps.live_spanish.routes import bp as live_spanish_bp, AUDIO_DIR as LIVE_SPANISH_AUDIO_DIR
from apps.language_lab.routes import bp as language_lab_bp, AUDIO_DIR as LANGUAGE_LAB_AUDIO_DIR
from apps.bible.routes import bp as bible_bp
from apps.translator.routes import bp as translator_bp
from apps.ai_practice.routes import bp as ai_practice_bp
from apps.german.routes import bp as german_bp, AUDIO_DIR as GERMAN_AUDIO_DIR


FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)

    # Permissive CORS — Vite dev server on :5173 talks to Flask on :8000.
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PATCH,DELETE,OPTIONS"
        return response

    app.register_blueprint(french_bp, url_prefix="/api/french")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
    app.register_blueprint(live_spanish_bp, url_prefix="/api/live-spanish")
    app.register_blueprint(language_lab_bp, url_prefix="/api/lab")
    app.register_blueprint(bible_bp, url_prefix="/api/bible")
    app.register_blueprint(translator_bp, url_prefix="/api/translator")
    app.register_blueprint(ai_practice_bp, url_prefix="/api/ai-practice")
    app.register_blueprint(german_bp, url_prefix="/api/german")

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "apps": ["french", "quiz", "live-spanish", "lab", "bible", "translator", "ai-practice", "german"]})

    # Per-app audio serving — each sub-app has its own audio root directory.
    @app.get("/audio/french/<path:filename>")
    def serve_french_audio(filename: str):
        return send_from_directory(FRENCH_AUDIO_DIR, filename, max_age=31536000)

    @app.get("/audio/live-spanish/<path:filename>")
    def serve_live_spanish_audio(filename: str):
        return send_from_directory(LIVE_SPANISH_AUDIO_DIR, filename, max_age=31536000)

    @app.get("/audio/lab/<path:filename>")
    def serve_lab_audio(filename: str):
        return send_from_directory(LANGUAGE_LAB_AUDIO_DIR, filename, max_age=31536000)

    @app.get("/audio/german/<path:filename>")
    def serve_german_audio(filename: str):
        return send_from_directory(GERMAN_AUDIO_DIR, filename, max_age=31536000)

    # Fallback: serve the built Vite SPA if it exists (single-port deployment).
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
                "Flask is running. Frontend build not found — start the Vite "
                "dev server (npm run dev in frontend/) or run `npm run build` "
                "first."
            ),
            "health": "/api/health",
        })

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    create_app().run(host="127.0.0.1", port=port, debug=debug, use_reloader=False)
