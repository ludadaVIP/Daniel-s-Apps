"""German Sprint blueprint.

Mounted at ``/api/german`` in the unified backend.

Mirrors the French Sprint architecture: a JSON-driven roadmap + per-lesson
content, Edge TTS audio cached on disk, simple persistent progress.

Data layout::

  backend/data/German/
  ├─ lessons/<lesson-id>.json     ← curriculum content
  ├─ progress/progress.json        ← user progress
  └─ audio/edge-tts/de-DE/...      ← cached TTS mp3 files
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


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "German"
DATA_DIR = Path(os.environ.get("GERMAN_DATA_DIR", DEFAULT_DATA_DIR))
LESSON_DIR = DATA_DIR / "lessons"
PROGRESS_FILE = DATA_DIR / "progress" / "progress.json"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 5000

GERMAN_TTS_VOICES = [
    {"id": "de-DE-KatjaNeural", "name": "Katja",
     "style": "Germany Standard German, warm female voice — good default for learners"},
    {"id": "de-DE-ConradNeural", "name": "Conrad",
     "style": "Germany Standard German, calm male voice with clear articulation"},
    {"id": "de-DE-AmalaNeural", "name": "Amala",
     "style": "Germany Standard German, expressive female voice"},
    {"id": "de-DE-FlorianMultilingualNeural", "name": "Florian",
     "style": "Germany Standard German, smooth multilingual male voice"},
]
ALLOWED_TTS_VOICES = {voice["id"] for voice in GERMAN_TTS_VOICES}

bp = Blueprint("german", __name__)


def default_progress() -> dict[str, Any]:
    return {
        "currentLessonId": "alphabet",
        "blockStates": {},
        "heardBlocks": {},
        "visitedLessons": [],
        "completedLessons": [],
        "sessions": [],
    }


def get_progress() -> dict[str, Any]:
    return read_json(PROGRESS_FILE, default_progress())


def voice_for_text(text: str) -> str:
    digest = hashlib.sha1(text.encode("utf-8")).hexdigest()
    index = int(digest[:8], 16) % len(GERMAN_TTS_VOICES)
    return GERMAN_TTS_VOICES[index]["id"]


def tts_cache_key(text: str, voice: str) -> str:
    return hashlib.sha1(f"edge-tts-v1\n{voice}\n{text}".encode("utf-8")).hexdigest()


def tts_output_path(text: str, voice: str) -> tuple[str, Path]:
    cache_key = tts_cache_key(text, voice)
    output_dir = AUDIO_CACHE_DIR / "de-DE" / voice
    return cache_key, output_dir / f"{cache_key}.mp3"


def update_audio_manifest(cache_key: str, text: str, voice: str, output_path: Path) -> None:
    manifest = read_json(AUDIO_MANIFEST_FILE, {"items": {}})
    items = manifest.setdefault("items", {})
    items[cache_key] = {
        "voice": voice,
        "language": "de-DE",
        "engine": "edge-tts",
        "chars": len(text),
        "textPreview": text[:240],
        "path": output_path.relative_to(AUDIO_DIR).as_posix(),
        "bytes": output_path.stat().st_size if output_path.exists() else 0,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    write_json(AUDIO_MANIFEST_FILE, manifest)


@bp.get("/tts/voices")
def tts_voices():
    return jsonify({
        "language": "de-DE",
        "engine": "edge-tts",
        "randomMode": "stable-by-text",
        "voices": GERMAN_TTS_VOICES,
    })


@bp.get("/roadmap")
def roadmap():
    return jsonify({
        "phases": [
            {
                "id": "pronunciation",
                "title": "Phase 1 — Sounds & Alphabet",
                "description": "Build a reliable pronunciation core so every later word is readable.",
                "lessons": [
                    {"id": "alphabet", "title": "L01 · Alphabet & Umlauts",
                     "level": "A0", "status": "active",
                     "goal": "26 letters + ä ö ü ß. Say letter names; hear an example word for each."},
                    {"id": "pronunciation", "title": "L02 · Sound Combinations",
                     "level": "A0", "status": "ready",
                     "goal": "ch / sch / r / ie vs ei / eu vs äu / final -e / word stress."},
                ],
            },
            {
                "id": "foundation",
                "title": "Phase 2 — A1 Core",
                "description": "Make your first real sentences. Articles, present tense, cases, modals.",
                "lessons": [
                    {"id": "greetings", "title": "L03 · Greetings & Verbs sein/haben/heißen",
                     "level": "A1", "status": "ready",
                     "goal": "Introduce yourself. Conjugate the three most important verbs."},
                    {"id": "articles-gender", "title": "L04 · Articles, Gender, Plural",
                     "level": "A1", "status": "ready",
                     "goal": "der/die/das, ein/eine, three genders, common plural patterns."},
                    {"id": "present-tense", "title": "L05 · Present Tense & Word Order",
                     "level": "A1", "status": "ready",
                     "goal": "Regular verb conjugation across all 9 pronouns. The V2 rule."},
                    {"id": "cases-nom-acc", "title": "L06 · Nominative & Accusative",
                     "level": "A1", "status": "ready",
                     "goal": "Subject vs direct object. How articles change in the accusative."},
                    {"id": "modal-verbs", "title": "L07 · Modal Verbs",
                     "level": "A1", "status": "ready",
                     "goal": "können, wollen, müssen, sollen, dürfen, mögen — plus their word order."},
                    {"id": "numbers-time-vocab", "title": "L08 · Numbers, Time, Everyday Vocab",
                     "level": "A1", "status": "ready",
                     "goal": "Numbers, dates, days, months, family, food, body — the survival kit."},
                ],
            },
            {
                "id": "expanding",
                "title": "Phase 3 — A2 Expansion",
                "description": "Talk about the past, deal with prepositions, build complex sentences.",
                "lessons": [
                    {"id": "perfekt", "title": "L09 · Perfect Tense (Perfekt)",
                     "level": "A2", "status": "ready",
                     "goal": "haben/sein + Partizip II. Talk about what you did yesterday."},
                    {"id": "dative-prepositions", "title": "L10 · Dative Case & Prepositions",
                     "level": "A2", "status": "ready",
                     "goal": "Dative endings; dative-only and two-way prepositions (Wechselpräpositionen)."},
                    {"id": "subordinate-clauses", "title": "L11 · Subordinate Clauses",
                     "level": "A2-B1", "status": "ready",
                     "goal": "weil, dass, wenn, als, ob — and the verb-at-the-end rule."},
                ],
            },
            {
                "id": "advanced",
                "title": "Phase 4 — B1/B2 Milestones",
                "description": "Hypotheticals, passive, formal style.",
                "lessons": [
                    {"id": "konjunktiv-passiv", "title": "L12 · Konjunktiv II & Passiv",
                     "level": "B1-B2", "status": "ready",
                     "goal": "würde/wäre/hätte for politeness and hypotheticals; werden + Partizip II for passive."},
                ],
            },
        ],
    })


@bp.get("/lessons/<lesson_id>")
def lesson(lesson_id: str):
    lesson_path = LESSON_DIR / f"{lesson_id}.json"
    data = read_json(lesson_path)
    if data is None:
        return jsonify({"error": "Lesson not found"}), 404
    return jsonify(data)


@bp.route("/progress", methods=["GET", "POST", "OPTIONS"])
def progress():
    if request.method == "OPTIONS":
        return "", 204
    if request.method == "GET":
        return jsonify(get_progress())

    payload = request.get_json(silent=True) or {}
    current = get_progress()
    updated = {
        **current,
        **payload,
        "blockStates": {
            **current.get("blockStates", {}),
            **payload.get("blockStates", {}),
        },
        "heardBlocks": {
            **current.get("heardBlocks", {}),
            **payload.get("heardBlocks", {}),
        },
        "visitedLessons": list(dict.fromkeys([
            *current.get("visitedLessons", []),
            *payload.get("visitedLessons", []),
        ])),
    }
    write_json(PROGRESS_FILE, updated)
    return jsonify(updated)


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

    requested_voice = str(payload.get("voice") or "").strip()
    voice = requested_voice if requested_voice in ALLOWED_TTS_VOICES else voice_for_text(text)
    cache_key, output_path = tts_output_path(text, voice)
    audio_path = f"/audio/german/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if audio_file_is_usable(output_path):
        update_audio_manifest(cache_key, text, voice, output_path)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "cached": True, "engine": "edge-tts", "language": "de-DE", "voice": voice,
        })

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:
        return jsonify({"error": f"Could not generate German audio with {voice}: {exc}"}), 502

    update_audio_manifest(cache_key, text, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False, "engine": "edge-tts", "language": "de-DE", "voice": voice,
    })
