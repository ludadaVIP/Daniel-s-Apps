"""Shared backend factory for Free Language apps."""

from __future__ import annotations

import hashlib
import re
import secrets
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json
from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import ALLOWED_VOICES, default_voice_for_language, normalise_language

AUDIO_TEXT_LIMIT = 5000


class FreeLanguageError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def create_free_language_blueprint(
    *,
    blueprint_name: str,
    data_dir: Path,
    audio_slug: str,
    default_language: str,
    cache_namespace: str,
) -> tuple[Blueprint, Path]:
    data_dir = Path(data_dir)
    library_file = data_dir / "library.json"
    lesson_dir = data_dir / "lessons"
    md_dir = data_dir / "MD"
    audio_dir = data_dir / "audio"
    audio_cache_dir = audio_dir / "edge-tts"

    bp = Blueprint(blueprint_name, __name__)

    @bp.errorhandler(FreeLanguageError)
    def handle_error(error: FreeLanguageError):
        return jsonify({"error": str(error)}), error.status_code

    def now_iso() -> str:
        return datetime.now(timezone.utc).isoformat(timespec="seconds")

    def safe_id(value: str, prefix: str) -> str:
        text = re.sub(r"[^a-z0-9_-]+", "-", str(value or "").strip().lower())
        text = re.sub(r"-+", "-", text).strip("-_")
        return text[:80] or f"{prefix}-{secrets.token_hex(3)}"

    def ensure_data_dirs() -> None:
        data_dir.mkdir(parents=True, exist_ok=True)
        lesson_dir.mkdir(parents=True, exist_ok=True)
        md_dir.mkdir(parents=True, exist_ok=True)

    def lesson_path(lesson_id: str) -> Path:
        cleaned = safe_id(lesson_id, "lesson")
        if cleaned != lesson_id:
            raise FreeLanguageError("Invalid lesson id.")
        return lesson_dir / f"{lesson_id}.json"

    def full_lesson_summary(lesson: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": lesson.get("id"),
            "levelId": lesson.get("levelId"),
            "title": lesson.get("title"),
            "subtitle": lesson.get("subtitle", ""),
            "tags": lesson.get("tags", []),
            "createdAt": lesson.get("createdAt", ""),
            "updatedAt": lesson.get("updatedAt", ""),
        }

    def lesson_summary(lesson: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": lesson.get("id"),
            "levelId": lesson.get("levelId"),
            "title": lesson.get("title"),
            "subtitle": lesson.get("subtitle", ""),
            "tags": lesson.get("tags", []),
            "updatedAt": lesson.get("updatedAt", ""),
        }

    def write_lesson(lesson: dict[str, Any]) -> None:
        lesson_id = str(lesson.get("id") or "").strip()
        if not lesson_id:
            raise FreeLanguageError("Lesson id is required.")
        write_json(lesson_path(lesson_id), lesson)

    def read_lesson(lesson_id: str) -> dict[str, Any]:
        lesson = read_json(lesson_path(lesson_id))
        if not isinstance(lesson, dict):
            raise FreeLanguageError("Lesson file not found.", 404)
        return lesson

    def migrate_embedded_lessons(data: dict[str, Any]) -> dict[str, Any]:
        migrated: list[dict[str, Any]] = []
        for lesson in data.get("lessons", []):
            if not isinstance(lesson, dict):
                continue
            lesson_id = str(lesson.get("id") or "").strip()
            if not lesson_id:
                continue
            if "sections" in lesson:
                write_lesson(lesson)
            migrated.append(full_lesson_summary(lesson))
        data["lessons"] = migrated
        write_json(library_file, data)
        return data

    def load_library() -> dict[str, Any]:
        ensure_data_dirs()
        data = read_json(library_file, {"levels": [], "lessons": []})
        if not isinstance(data, dict):
            raise FreeLanguageError("Library data is invalid.", 500)
        data.setdefault("levels", [])
        data.setdefault("lessons", [])
        if any(isinstance(lesson, dict) and "sections" in lesson for lesson in data.get("lessons", [])):
            data = migrate_embedded_lessons(data)
        return data

    def save_library(data: dict[str, Any]) -> None:
        write_json(library_file, data)

    def find_level(data: dict[str, Any], level_id: str) -> dict[str, Any]:
        for level in data.get("levels", []):
            if level.get("id") == level_id:
                return level
        raise FreeLanguageError("Level not found.", 404)

    def find_lesson_summary(data: dict[str, Any], lesson_id: str) -> dict[str, Any]:
        for lesson in data.get("lessons", []):
            if lesson.get("id") == lesson_id:
                return lesson
        raise FreeLanguageError("Lesson not found.", 404)

    def sync_lesson_summary(data: dict[str, Any], lesson: dict[str, Any]) -> None:
        lesson_id = lesson.get("id")
        summary = full_lesson_summary(lesson)
        for index, item in enumerate(data.get("lessons", [])):
            if item.get("id") == lesson_id:
                data["lessons"][index] = summary
                return
        data.setdefault("lessons", []).append(summary)

    def delete_lesson_audio_cache(lesson_id: str) -> None:
        lesson_audio_dir = audio_cache_dir / "lessons" / lesson_id
        if lesson_audio_dir.exists():
            shutil.rmtree(lesson_audio_dir)

    def md_summaries() -> list[dict[str, Any]]:
        ensure_data_dirs()
        items = []
        for path in sorted(md_dir.rglob("*.md")):
            if not path.is_file():
                continue
            if path.relative_to(md_dir).as_posix().lower() == "readme.md":
                continue
            stat = path.stat()
            text = path.read_text(encoding="utf-8", errors="ignore")
            plain = re.sub(r"\s+", " ", re.sub(r"[#>*_`~-]+", " ", text)).strip()
            items.append({
                "filename": path.relative_to(md_dir).as_posix(),
                "title": path.stem,
                "updatedAt": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
                "charCount": len(plain),
                "excerpt": plain[:180],
            })
        return items

    def library_payload(data: dict[str, Any]) -> dict[str, Any]:
        lessons = data.get("lessons", [])
        return {
            "levels": [
                {
                    **level,
                    "lessons": [
                        lesson_summary(lesson)
                        for lesson in lessons
                        if lesson.get("levelId") == level.get("id")
                    ],
                }
                for level in data.get("levels", [])
            ],
            "lessons": [lesson_summary(lesson) for lesson in lessons],
            "mdInbox": md_summaries(),
        }

    @bp.route("/library", methods=["GET", "OPTIONS"])
    def library():
        if request.method == "OPTIONS":
            return "", 204
        return jsonify(library_payload(load_library()))

    @bp.route("/lessons/<lesson_id>", methods=["GET", "PATCH", "DELETE", "OPTIONS"])
    def lesson(lesson_id: str):
        if request.method == "OPTIONS":
            return "", 204

        data = load_library()
        find_lesson_summary(data, lesson_id)

        if request.method == "GET":
            return jsonify(read_lesson(lesson_id))

        if request.method == "DELETE":
            data["lessons"] = [item for item in data.get("lessons", []) if item.get("id") != lesson_id]
            lesson_path(lesson_id).unlink(missing_ok=True)
            delete_lesson_audio_cache(lesson_id)
            save_library(data)
            return jsonify(library_payload(data))

        current = read_lesson(lesson_id)
        payload = request.get_json(silent=True) or {}
        allowed = {"title", "subtitle", "tags", "overview", "sections", "levelId"}
        for key in allowed:
            if key in payload:
                current[key] = payload[key]
        if "levelId" in payload:
            find_level(data, str(payload["levelId"]))
        current["updatedAt"] = now_iso()
        write_lesson(current)
        sync_lesson_summary(data, current)
        save_library(data)
        return jsonify(current)

    @bp.route("/levels", methods=["POST", "OPTIONS"])
    def create_level():
        if request.method == "OPTIONS":
            return "", 204

        payload = request.get_json(silent=True) or {}
        title = str(payload.get("title") or "New level").strip()
        data = load_library()
        level_id = safe_id(payload.get("id") or title, "level")
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
            "createdAt": now_iso(),
            "updatedAt": now_iso(),
        })
        save_library(data)
        return jsonify(library_payload(data)), 201

    @bp.route("/levels/<level_id>", methods=["PATCH", "DELETE", "OPTIONS"])
    def update_level(level_id: str):
        if request.method == "OPTIONS":
            return "", 204

        data = load_library()
        level = find_level(data, level_id)

        if request.method == "DELETE":
            if any(lesson.get("levelId") == level_id for lesson in data.get("lessons", [])):
                raise FreeLanguageError("Move or delete this level's lessons first.")
            data["levels"] = [item for item in data.get("levels", []) if item.get("id") != level_id]
            save_library(data)
            return jsonify(library_payload(data))

        payload = request.get_json(silent=True) or {}
        for key in ("title", "subtitle", "description"):
            if key in payload:
                level[key] = str(payload[key] or "").strip()
        level["updatedAt"] = now_iso()
        save_library(data)
        return jsonify(library_payload(data))

    @bp.route("/levels/<level_id>/lessons", methods=["POST", "OPTIONS"])
    def create_lesson(level_id: str):
        if request.method == "OPTIONS":
            return "", 204

        data = load_library()
        find_level(data, level_id)
        payload = request.get_json(silent=True) or {}
        title = str(payload.get("title") or "New lesson").strip()
        lesson_id = safe_id(payload.get("id") or title, "lesson")
        existing_ids = {item.get("id") for item in data.get("lessons", [])}
        base = lesson_id
        suffix = 2
        while lesson_id in existing_ids:
            lesson_id = f"{base}-{suffix}"
            suffix += 1

        lesson_data = {
            "id": lesson_id,
            "levelId": level_id,
            "title": title,
            "subtitle": str(payload.get("subtitle") or "A small, speakable note.").strip(),
            "tags": payload.get("tags") if isinstance(payload.get("tags"), list) else [],
            "overview": payload.get("overview") if isinstance(payload.get("overview"), list) else [],
            "sections": payload.get("sections") if isinstance(payload.get("sections"), list) else [],
            "createdAt": now_iso(),
            "updatedAt": now_iso(),
        }
        write_lesson(lesson_data)
        data["lessons"].append(full_lesson_summary(lesson_data))
        save_library(data)
        return jsonify(library_payload(data)), 201

    def tts_cache_key(text: str, voice: str) -> str:
        return hashlib.sha1(f"{cache_namespace}\n{voice}\n{text}".encode("utf-8")).hexdigest()

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

        language = normalise_language(payload.get("language"), default_language)
        requested_voice = str(payload.get("voice") or "").strip()
        voice = requested_voice if requested_voice in ALLOWED_VOICES else default_voice_for_language(language)
        lesson_id = safe_id(str(payload.get("lessonId") or "shared"), "lesson")
        output_path = audio_cache_dir / "lessons" / lesson_id / language / voice / f"{tts_cache_key(text, voice)}.mp3"
        audio_path = f"/audio/{audio_slug}/{output_path.relative_to(audio_dir).as_posix()}"

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

    return bp, audio_dir
