"""Free French blueprint.

Mounted at ``/api/free-french`` in the unified backend.
Data lives in ``backend/data/FreeFrench/``.
"""

from __future__ import annotations

import hashlib
import os
import re
import secrets
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json
from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import ALLOWED_VOICES, default_voice_for_language, normalise_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "FreeFrench"
DATA_DIR = Path(os.environ.get("FREE_FRENCH_DATA_DIR", DEFAULT_DATA_DIR))
LIBRARY_FILE = DATA_DIR / "library.json"
MD_DIR = DATA_DIR / "MD"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_TEXT_LIMIT = 5000

bp = Blueprint("free_french", __name__)


class FreeFrenchError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(FreeFrenchError)
def handle_error(error: FreeFrenchError):
    return jsonify({"error": str(error)}), error.status_code


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _safe_id(value: str, prefix: str) -> str:
    text = re.sub(r"[^a-z0-9_-]+", "-", str(value or "").strip().lower())
    text = re.sub(r"-+", "-", text).strip("-_")
    return text[:80] or f"{prefix}-{secrets.token_hex(3)}"


def _ensure_data_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MD_DIR.mkdir(parents=True, exist_ok=True)


def _load_library() -> dict[str, Any]:
    _ensure_data_dirs()
    data = read_json(LIBRARY_FILE, {"levels": [], "lessons": []})
    if not isinstance(data, dict):
        raise FreeFrenchError("Library data is invalid.", 500)
    data.setdefault("levels", [])
    data.setdefault("lessons", [])
    return data


def _save_library(data: dict[str, Any]) -> None:
    write_json(LIBRARY_FILE, data)


def _find_level(data: dict[str, Any], level_id: str) -> dict[str, Any]:
    for level in data.get("levels", []):
        if level.get("id") == level_id:
            return level
    raise FreeFrenchError("Level not found.", 404)


def _find_lesson(data: dict[str, Any], lesson_id: str) -> dict[str, Any]:
    for lesson in data.get("lessons", []):
        if lesson.get("id") == lesson_id:
            return lesson
    raise FreeFrenchError("Lesson not found.", 404)


def _lesson_summary(lesson: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": lesson.get("id"),
        "levelId": lesson.get("levelId"),
        "title": lesson.get("title"),
        "subtitle": lesson.get("subtitle", ""),
        "tags": lesson.get("tags", []),
        "updatedAt": lesson.get("updatedAt", ""),
    }


def _library_payload(data: dict[str, Any]) -> dict[str, Any]:
    lessons = data.get("lessons", [])
    return {
        "levels": [
            {
                **level,
                "lessons": [
                    _lesson_summary(lesson)
                    for lesson in lessons
                    if lesson.get("levelId") == level.get("id")
                ],
            }
            for level in data.get("levels", [])
        ],
        "lessons": [_lesson_summary(lesson) for lesson in lessons],
        "mdInbox": _md_summaries(),
    }


def _md_summaries() -> list[dict[str, Any]]:
    _ensure_data_dirs()
    items = []
    for path in sorted(MD_DIR.rglob("*.md")):
        if not path.is_file():
            continue
        if path.relative_to(MD_DIR).as_posix().lower() == "readme.md":
            continue
        stat = path.stat()
        text = path.read_text(encoding="utf-8", errors="ignore")
        plain = re.sub(r"\s+", " ", re.sub(r"[#>*_`~-]+", " ", text)).strip()
        items.append({
            "filename": path.relative_to(MD_DIR).as_posix(),
            "title": path.stem,
            "updatedAt": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
            "charCount": len(plain),
            "excerpt": plain[:180],
        })
    return items


@bp.route("/library", methods=["GET", "OPTIONS"])
def library():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify(_library_payload(_load_library()))


@bp.route("/lessons/<lesson_id>", methods=["GET", "PATCH", "DELETE", "OPTIONS"])
def lesson(lesson_id: str):
    if request.method == "OPTIONS":
        return "", 204

    data = _load_library()
    current = _find_lesson(data, lesson_id)

    if request.method == "GET":
        return jsonify(current)

    if request.method == "DELETE":
        data["lessons"] = [item for item in data.get("lessons", []) if item.get("id") != lesson_id]
        _save_library(data)
        return jsonify(_library_payload(data))

    payload = request.get_json(silent=True) or {}
    allowed = {"title", "subtitle", "tags", "overview", "duolingoBridge", "sections", "levelId"}
    for key in allowed:
        if key in payload:
            current[key] = payload[key]
    if "levelId" in payload:
        _find_level(data, str(payload["levelId"]))
    current["updatedAt"] = _now_iso()
    _save_library(data)
    return jsonify(current)


@bp.route("/levels", methods=["POST", "OPTIONS"])
def create_level():
    if request.method == "OPTIONS":
        return "", 204

    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or "New level").strip()
    data = _load_library()
    level_id = _safe_id(payload.get("id") or title, "level")
    existing_ids = {item.get("id") for item in data.get("levels", [])}
    base = level_id
    suffix = 2
    while level_id in existing_ids:
        level_id = f"{base}-{suffix}"
        suffix += 1
    data["levels"].append({
        "id": level_id,
        "title": title,
        "subtitle": str(payload.get("subtitle") or "").strip(),
        "description": str(payload.get("description") or "").strip(),
        "createdAt": _now_iso(),
        "updatedAt": _now_iso(),
    })
    _save_library(data)
    return jsonify(_library_payload(data)), 201


@bp.route("/levels/<level_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def update_level(level_id: str):
    if request.method == "OPTIONS":
        return "", 204

    data = _load_library()
    level = _find_level(data, level_id)

    if request.method == "DELETE":
        if any(lesson.get("levelId") == level_id for lesson in data.get("lessons", [])):
            raise FreeFrenchError("Move or delete this level's lessons first.")
        data["levels"] = [item for item in data.get("levels", []) if item.get("id") != level_id]
        _save_library(data)
        return jsonify(_library_payload(data))

    payload = request.get_json(silent=True) or {}
    for key in ("title", "subtitle", "description"):
        if key in payload:
            level[key] = str(payload[key] or "").strip()
    level["updatedAt"] = _now_iso()
    _save_library(data)
    return jsonify(_library_payload(data))


@bp.route("/levels/<level_id>/lessons", methods=["POST", "OPTIONS"])
def create_lesson(level_id: str):
    if request.method == "OPTIONS":
        return "", 204

    data = _load_library()
    _find_level(data, level_id)
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or "New lesson").strip()
    lesson_id = _safe_id(payload.get("id") or title, "lesson")
    existing_ids = {item.get("id") for item in data.get("lessons", [])}
    base = lesson_id
    suffix = 2
    while lesson_id in existing_ids:
        lesson_id = f"{base}-{suffix}"
        suffix += 1

    data["lessons"].append({
        "id": lesson_id,
        "levelId": level_id,
        "title": title,
        "subtitle": str(payload.get("subtitle") or "A small, speakable note.").strip(),
        "tags": payload.get("tags") if isinstance(payload.get("tags"), list) else [],
        "overview": payload.get("overview") if isinstance(payload.get("overview"), list) else [],
        "duolingoBridge": str(payload.get("duolingoBridge") or "").strip(),
        "sections": payload.get("sections") if isinstance(payload.get("sections"), list) else [],
        "createdAt": _now_iso(),
        "updatedAt": _now_iso(),
    })
    _save_library(data)
    return jsonify(_library_payload(data)), 201


def _tts_cache_key(text: str, voice: str) -> str:
    return hashlib.sha1(f"free-french-v1\n{voice}\n{text}".encode("utf-8")).hexdigest()


@bp.route("/tts", methods=["POST", "OPTIONS"])
def create_tts_audio():
    if request.method == "OPTIONS":
        return "", 204

    payload = request.get_json(silent=True) or {}
    text = " ".join(str(payload.get("text") or "").split())
    if not text:
        return jsonify({"error": "Text is required."}), 400
    if len(text) > AUDIO_TEXT_LIMIT:
        return jsonify({"error": f"Text is too long. Keep it under {AUDIO_TEXT_LIMIT} characters."}), 400

    language = normalise_language(payload.get("language"), "fr")
    requested_voice = str(payload.get("voice") or "").strip()
    voice = requested_voice if requested_voice in ALLOWED_VOICES else default_voice_for_language(language)
    cache_key = _tts_cache_key(text, voice)
    output_path = AUDIO_CACHE_DIR / language / voice / f"{cache_key}.mp3"
    audio_path = f"/audio/free-french/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if not audio_file_is_usable(output_path):
        try:
            generate_audio(text, voice, output_path)
        except Exception as exc:
            return jsonify({"error": f"Could not generate audio with {voice}: {exc}"}), 502

    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "engine": "edge-tts",
        "language": language,
        "voice": voice,
    })
