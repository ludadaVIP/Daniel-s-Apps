"""好奇心科学 (Curiosity Science) blueprint.

Mounted at ``/api/curiosity`` in the unified backend.
Data lives in ``backend/data/Curiosity/categories.json``.

A kid-friendly "ten thousand whys" library for a curious 10-year-old.
Each entry has a Chinese question + Chinese answer plus an English
parallel translation; Edge TTS reads either language.
"""

from __future__ import annotations

import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json
from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import default_voice_for_language, voices_for_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Curiosity"
DATA_DIR = Path(os.environ.get("CURIOSITY_DATA_DIR", DEFAULT_DATA_DIR))
DATA_FILE = DATA_DIR / "categories.json"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 1400

LANGUAGE_CONFIG = {
    "zh": {
        "language": "zh-CN",
        "voice": default_voice_for_language("zh"),
        "voices": {voice["id"] for voice in voices_for_language("zh")},
    },
    "en": {
        "language": "en-US",
        "voice": default_voice_for_language("en"),
        "voices": {voice["id"] for voice in voices_for_language("en")},
    },
}

bp = Blueprint("curiosity", __name__)


class CuriosityError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(CuriosityError)
def handle_error(error: CuriosityError):
    return jsonify({"error": str(error)}), error.status_code


def _ensure_story_ids(course: dict[str, Any]) -> dict[str, Any]:
    """Inject stable IDs so the front-end can address every story.

    Schema (kept minimal in source JSON):
      categories: [
        {id, title, emoji, subtitle?, subcategories: [
          {id, title, emoji?, stories: [
            {title_zh, title_en, answer_zh, answer_en, fun?}
          ]}
        ]}
      ]
    """
    for cat in course.get("categories", []) or []:
        cat_id = cat.get("id") or ""
        for sub in cat.get("subcategories", []) or []:
            sub_id = sub.get("id") or ""
            stories = sub.get("stories") or []
            for index, story in enumerate(stories, start=1):
                if not story.get("id"):
                    story["id"] = f"{cat_id}-{sub_id}-{index:03d}"
                story.setdefault("number", index)
            sub["count"] = len(stories)
        cat_total = sum(len(sub.get("stories") or []) for sub in cat.get("subcategories") or [])
        cat["count"] = cat_total
    return course


def load_course() -> dict[str, Any]:
    course = read_json(DATA_FILE)
    if not course:
        raise CuriosityError("好奇心科学数据缺失。", 500)
    return _ensure_story_ids(course)


def subcategory_summary(sub: dict[str, Any]) -> dict[str, Any]:
    stories = sub.get("stories", [])
    return {
        "id": sub.get("id"),
        "title": sub.get("title"),
        "emoji": sub.get("emoji"),
        "count": sub.get("count", len(stories)),
        "firstStory": stories[0] if stories else None,
    }


def category_summary(cat: dict[str, Any]) -> dict[str, Any]:
    subs = cat.get("subcategories", []) or []
    return {
        "id": cat.get("id"),
        "title": cat.get("title"),
        "emoji": cat.get("emoji"),
        "subtitle": cat.get("subtitle"),
        "count": cat.get("count", sum(len(s.get("stories") or []) for s in subs)),
        "subcategories": [subcategory_summary(s) for s in subs],
    }


def normalise_tts_language(value: Any) -> str:
    language = str(value or "zh").strip().lower()
    if language in {"chinese", "mandarin", "zh-cn", "cn", "中文", "普通话"}:
        return "zh"
    if language in {"english", "en-us", "en-gb"}:
        return "en"
    if language not in LANGUAGE_CONFIG:
        raise CuriosityError("Language must be 'zh' or 'en'.")
    return language


def tts_cache_key(text: str, language: str, voice: str) -> str:
    payload = f"curiosity-edge-tts-v1\n{language}\n{voice}\n{text}"
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


@bp.route("/categories", methods=["GET", "OPTIONS"])
def categories():
    """Lightweight tree: every category with its subcategory list (no story bodies)."""
    if request.method == "OPTIONS":
        return "", 204
    course = load_course()
    return jsonify({
        "id": course.get("id"),
        "title": course.get("title"),
        "subtitle": course.get("subtitle"),
        "description": course.get("description"),
        "totalStories": sum(c.get("count", 0) for c in course.get("categories", [])),
        "categories": [category_summary(cat) for cat in course.get("categories", [])],
    })


@bp.route("/subcategory/<sub_id>", methods=["GET", "OPTIONS"])
def subcategory_detail(sub_id: str):
    """Full body of a single subcategory: stories with zh + en text."""
    if request.method == "OPTIONS":
        return "", 204
    course = load_course()
    for cat in course.get("categories", []):
        for sub in cat.get("subcategories", []) or []:
            if sub.get("id") == sub_id:
                return jsonify({
                    "category": {
                        "id": cat.get("id"),
                        "title": cat.get("title"),
                        "emoji": cat.get("emoji"),
                    },
                    "subcategory": sub,
                })
    raise CuriosityError("Subcategory not found.", 404)


@bp.route("/tts/voices", methods=["GET", "OPTIONS"])
def tts_voices():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify({
        "engine": "edge-tts",
        "languages": {
            "zh": {
                "language": "zh-CN",
                "defaultVoice": LANGUAGE_CONFIG["zh"]["voice"],
                "voices": voices_for_language("zh"),
            },
            "en": {
                "language": "en-US",
                "defaultVoice": LANGUAGE_CONFIG["en"]["voice"],
                "voices": voices_for_language("en"),
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
        raise CuriosityError("Text is required.")
    if len(text) > AUDIO_TEXT_LIMIT:
        raise CuriosityError(f"Text is too long. Keep it under {AUDIO_TEXT_LIMIT} characters.")

    language = normalise_tts_language(payload.get("language"))
    config = LANGUAGE_CONFIG[language]
    requested_voice = str(payload.get("voice") or "").strip()
    voice = requested_voice if requested_voice in config["voices"] else config["voice"]
    cache_key, output_path = tts_output_path(text, language, voice)
    audio_path = f"/audio/curiosity/{output_path.relative_to(AUDIO_DIR).as_posix()}"

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
        raise CuriosityError(f"Could not generate audio with {voice}: {exc}", 502) from exc

    update_audio_manifest(cache_key, text, language, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False,
        "engine": "edge-tts",
        "language": config["language"],
        "voice": voice,
    })
