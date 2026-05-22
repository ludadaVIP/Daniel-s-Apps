"""German Vocab blueprint - German vocabulary by CEFR level.

Mounted at ``/api/german-vocab``. Data lives in ``backend/data/GermanVocab/``.

This mirrors the shared vocab app pattern used by Esp/Eng/French Vocab.
TTS languages: ``de`` for lemmas/examples and ``es`` for Spanish translations.
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
from shared.vocab import (
    group_words_by_pos,
    load_group,
    load_level,
    load_levels,
)
from shared.voices import default_voice_for_language, voices_for_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "GermanVocab"
DATA_DIR = Path(os.environ.get("GERMAN_VOCAB_DATA_DIR", DEFAULT_DATA_DIR))
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 600

LANGUAGE_CONFIG = {
    "de": {
        "language": "de-DE",
        "voice": default_voice_for_language("de"),
        "voices": {voice["id"] for voice in voices_for_language("de")},
    },
    "es": {
        "language": "es-ES",
        "voice": default_voice_for_language("es"),
        "voices": {voice["id"] for voice in voices_for_language("es")},
    },
}

bp = Blueprint("german_vocab", __name__)


class GermanVocabError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(GermanVocabError)
def handle_error(error: GermanVocabError):
    return jsonify({"error": str(error)}), error.status_code


def normalise_tts_language(value: Any) -> str:
    language = str(value or "de").strip().lower()
    if language in {"german", "deutsch", "de-de"}:
        return "de"
    if language in {"spanish", "espanol", "español", "es-es"}:
        return "es"
    if language not in LANGUAGE_CONFIG:
        raise GermanVocabError("Language must be 'de' or 'es'.")
    return language


def tts_cache_key(text: str, language: str, voice: str) -> str:
    payload = f"german-vocab-edge-tts-v1\n{language}\n{voice}\n{text}"
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


@bp.route("/levels", methods=["GET", "OPTIONS"])
def levels():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify(load_levels(DATA_DIR, GermanVocabError))


@bp.route("/levels/<level_id>", methods=["GET", "OPTIONS"])
def level_detail(level_id: str):
    if request.method == "OPTIONS":
        return "", 204
    return jsonify(load_level(DATA_DIR, level_id, GermanVocabError))


@bp.route("/levels/<level_id>/groups/<group_id>", methods=["GET", "OPTIONS"])
def group_detail(level_id: str, group_id: str):
    if request.method == "OPTIONS":
        return "", 204
    group = load_group(DATA_DIR, level_id, group_id, GermanVocabError)
    return jsonify({
        **{key: value for key, value in group.items() if key != "words"},
        "level": level_id,
        "sections": group_words_by_pos(group),
    })


@bp.route("/tts/voices", methods=["GET", "OPTIONS"])
def tts_voices():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify({
        "engine": "edge-tts",
        "languages": {
            "de": {
                "language": "de-DE",
                "defaultVoice": LANGUAGE_CONFIG["de"]["voice"],
                "voices": voices_for_language("de"),
            },
            "es": {
                "language": "es-ES",
                "defaultVoice": LANGUAGE_CONFIG["es"]["voice"],
                "voices": voices_for_language("es"),
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
        raise GermanVocabError("Text is required.")
    if len(text) > AUDIO_TEXT_LIMIT:
        raise GermanVocabError(f"Text is too long. Keep it under {AUDIO_TEXT_LIMIT} characters.")

    language = normalise_tts_language(payload.get("language"))
    config = LANGUAGE_CONFIG[language]
    requested_voice = str(payload.get("voice") or "").strip()
    voice = requested_voice if requested_voice in config["voices"] else config["voice"]
    cache_key, output_path = tts_output_path(text, language, voice)
    audio_path = f"/audio/german-vocab/{output_path.relative_to(AUDIO_DIR).as_posix()}"

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
        raise GermanVocabError(f"Could not generate audio with {voice}: {exc}", 502) from exc

    update_audio_manifest(cache_key, text, language, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False,
        "engine": "edge-tts",
        "language": config["language"],
        "voice": voice,
    })
