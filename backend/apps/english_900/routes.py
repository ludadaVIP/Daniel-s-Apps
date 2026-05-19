"""English 900 blueprint.

Mounted at ``/api/english-900`` in the unified backend.
Data lives in ``backend/data/English900/``.
"""

from __future__ import annotations

import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json
from shared.nine_hundred import (
    cleanup_900_audio_cache,
    delete_900_group,
    group_summary,
    import_900_group,
    load_900_course,
    load_900_group,
    load_900_index,
)
from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import default_voice_for_language, voices_for_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "English900"
DATA_DIR = Path(os.environ.get("ENGLISH_900_DATA_DIR", DEFAULT_DATA_DIR))
DATA_FILE = DATA_DIR / "groups.json"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 1200

LANGUAGE_CONFIG = {
    "en": {
        "language": "en-US",
        "voice": default_voice_for_language("en"),
        "voices": {voice["id"] for voice in voices_for_language("en")},
    },
    "zh": {
        "language": "zh-CN",
        "voice": default_voice_for_language("zh"),
        "voices": {voice["id"] for voice in voices_for_language("zh")},
    },
}

bp = Blueprint("english_900", __name__)


class English900Error(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(English900Error)
def handle_error(error: English900Error):
    return jsonify({"error": str(error)}), error.status_code


def load_course() -> dict[str, Any]:
    return load_900_course(DATA_DIR, DATA_FILE, English900Error)


def normalise_tts_language(value: Any) -> str:
    language = str(value or "en").strip().lower()
    if language in {"english", "en-us", "en-gb"}:
        return "en"
    if language in {"chinese", "mandarin", "zh-cn", "cn", "中文", "普通话"}:
        return "zh"
    if language not in LANGUAGE_CONFIG:
        raise English900Error("Language must be 'en' or 'zh'.")
    return language


def tts_cache_key(text: str, language: str, voice: str) -> str:
    payload = f"english-900-edge-tts-v1\n{language}\n{voice}\n{text}"
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


def tts_output_path(text: str, language: str, voice: str) -> tuple[str, Path]:
    cache_key = tts_cache_key(text, language, voice)
    output_dir = AUDIO_CACHE_DIR / language / voice
    return cache_key, output_dir / f"{cache_key}.mp3"


def update_audio_manifest(
    cache_key: str,
    text: str,
    language: str,
    voice: str,
    output_path: Path,
) -> None:
    manifest = read_json(AUDIO_MANIFEST_FILE, {"items": {}})
    items = manifest.setdefault("items", {})
    items[cache_key] = {
        "voice": voice,
        "language": LANGUAGE_CONFIG[language]["language"],
        "engine": "edge-tts",
        "chars": len(text),
        "textPreview": text[:240],
        "path": output_path.relative_to(AUDIO_DIR).as_posix(),
        "bytes": output_path.stat().st_size if output_path.exists() else 0,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    write_json(AUDIO_MANIFEST_FILE, manifest)


@bp.route("/groups", methods=["GET", "OPTIONS"])
def groups():
    if request.method == "OPTIONS":
        return "", 204
    course = load_900_index(DATA_DIR, DATA_FILE, English900Error)
    return jsonify({
        "id": course.get("id"),
        "title": course.get("title"),
        "subtitle": course.get("subtitle"),
        "description": course.get("description"),
        "totalSentences": course.get("totalSentences"),
        "groupSize": course.get("groupSize"),
        "groups": course.get("groups", []),
    })


@bp.route("/groups/<group_id>", methods=["GET", "OPTIONS"])
def group_detail(group_id: str):
    if request.method == "OPTIONS":
        return "", 204
    return jsonify(load_900_group(DATA_DIR, DATA_FILE, group_id, English900Error))


@bp.route("/groups/<group_id>", methods=["DELETE", "OPTIONS"])
def delete_group(group_id: str):
    if request.method == "OPTIONS":
        return "", 204
    course = load_course()
    group = delete_900_group(DATA_DIR, course, group_id, English900Error)
    cleanup = cleanup_900_audio_cache(
        group,
        {"english": "en", "chinese": "zh"},
        audio_dir=AUDIO_DIR,
        manifest_file=AUDIO_MANIFEST_FILE,
        language_config=LANGUAGE_CONFIG,
    )
    return jsonify({"deletedGroupId": group_id, **cleanup})


@bp.route("/groups/import", methods=["POST", "OPTIONS"])
def import_group():
    if request.method == "OPTIONS":
        return "", 204
    course = load_course()
    group = import_900_group(
        DATA_DIR,
        course,
        request.get_json(silent=True) or {},
        app_label="English 900",
        required_fields=["english", "chinese"],
        error_cls=English900Error,
    )
    return jsonify({"group": group, "summary": group_summary(group)}), 201


@bp.route("/tts/voices", methods=["GET", "OPTIONS"])
def tts_voices():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify({
        "engine": "edge-tts",
        "languages": {
            "en": {
                "language": "en-US",
                "defaultVoice": LANGUAGE_CONFIG["en"]["voice"],
                "voices": voices_for_language("en"),
            },
            "zh": {
                "language": "zh-CN",
                "defaultVoice": LANGUAGE_CONFIG["zh"]["voice"],
                "voices": voices_for_language("zh"),
            },
        },
    })


@bp.route("/tts", methods=["POST", "OPTIONS"])
def create_tts_audio():
    if request.method == "OPTIONS":
        return "", 204

    payload = request.get_json(silent=True) or {}
    text = " ".join(str(payload.get("text") or "").split())
    if not text:
        raise English900Error("Text is required.")
    if len(text) > AUDIO_TEXT_LIMIT:
        raise English900Error(f"Text is too long. Keep it under {AUDIO_TEXT_LIMIT} characters.")

    language = normalise_tts_language(payload.get("language"))
    config = LANGUAGE_CONFIG[language]
    requested_voice = str(payload.get("voice") or "").strip()
    voice = requested_voice if requested_voice in config["voices"] else config["voice"]
    cache_key, output_path = tts_output_path(text, language, voice)
    audio_path = f"/audio/english-900/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if audio_file_is_usable(output_path):
        update_audio_manifest(cache_key, text, language, voice, output_path)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "cached": True,
            "engine": "edge-tts",
            "language": config["language"],
            "voice": voice,
        })

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:
        raise English900Error(f"Could not generate audio with {voice}: {exc}", 502) from exc

    update_audio_manifest(cache_key, text, language, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False,
        "engine": "edge-tts",
        "language": config["language"],
        "voice": voice,
    })
