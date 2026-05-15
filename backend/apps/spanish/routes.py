"""Español Sprint blueprint.

Mounted at ``/api/spanish`` in the unified backend. Distinct from
``/api/live-spanish`` which serves the quiz-driven Live Spanish app.

Mirrors the French/German Sprint architecture: roadmap + per-lesson
content, Edge TTS audio cached on disk, simple persistent progress.

Data layout::

  backend/data/Spanish/
  ├─ lessons/<lesson-id>.json     ← curriculum content
  ├─ progress/progress.json        ← user progress
  └─ audio/edge-tts/es-ES/...      ← cached TTS mp3 files
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


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Spanish"
DATA_DIR = Path(os.environ.get("SPANISH_DATA_DIR", DEFAULT_DATA_DIR))
LESSON_DIR = DATA_DIR / "lessons"
PROGRESS_FILE = DATA_DIR / "progress" / "progress.json"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 5000

SPANISH_TTS_VOICES = [
    {"id": "es-ES-ElviraNeural", "name": "Elvira",
     "style": "Castilian Spanish, warm female voice — recommended default"},
    {"id": "es-ES-AlvaroNeural", "name": "Álvaro",
     "style": "Castilian Spanish, calm clear male voice"},
    {"id": "es-ES-XimenaNeural", "name": "Ximena",
     "style": "Castilian Spanish, expressive female voice"},
    {"id": "es-ES-AbrilNeural", "name": "Abril",
     "style": "Castilian Spanish, natural female voice"},
]
ALLOWED_TTS_VOICES = {voice["id"] for voice in SPANISH_TTS_VOICES}

bp = Blueprint("spanish", __name__)


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
    index = int(digest[:8], 16) % len(SPANISH_TTS_VOICES)
    return SPANISH_TTS_VOICES[index]["id"]


def tts_cache_key(text: str, voice: str) -> str:
    return hashlib.sha1(f"edge-tts-v1\n{voice}\n{text}".encode("utf-8")).hexdigest()


def tts_output_path(text: str, voice: str) -> tuple[str, Path]:
    cache_key = tts_cache_key(text, voice)
    output_dir = AUDIO_CACHE_DIR / "es-ES" / voice
    return cache_key, output_dir / f"{cache_key}.mp3"


def update_audio_manifest(cache_key: str, text: str, voice: str, output_path: Path) -> None:
    manifest = read_json(AUDIO_MANIFEST_FILE, {"items": {}})
    items = manifest.setdefault("items", {})
    items[cache_key] = {
        "voice": voice,
        "language": "es-ES",
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
        "language": "es-ES",
        "engine": "edge-tts",
        "randomMode": "stable-by-text",
        "voices": SPANISH_TTS_VOICES,
    })


@bp.get("/roadmap")
def roadmap():
    return jsonify({
        "phases": [
            {
                "id": "pronunciation",
                "title": "Phase 1 — Sounds & Spelling",
                "description": "Spanish spelling is more regular than English or French. Lock the sounds, then read anything.",
                "lessons": [
                    {"id": "alphabet", "title": "L01 · Alphabet & Tricky Sounds",
                     "level": "A0", "status": "active",
                     "goal": "Letter names + the sounds that surprise English/French speakers (j, ñ, ll, rr, c/z, ü)."},
                    {"id": "stress-accents", "title": "L02 · Stress & Written Accents",
                     "level": "A0", "status": "ready",
                     "goal": "When to stress which syllable, when an accent mark is required, what it changes."},
                ],
            },
            {
                "id": "foundation",
                "title": "Phase 2 — A1 Core",
                "description": "The conjugations and pronouns that make Spanish, Spanish. By the end you can introduce yourself, describe things, talk about likes and routines.",
                "lessons": [
                    {"id": "greetings", "title": "L03 · Greetings + ser / estar / tener / haber",
                     "level": "A1", "status": "ready",
                     "goal": "Greet someone. Master the four most-used verbs — including the famous ser-vs-estar split."},
                    {"id": "articles-gender", "title": "L04 · Articles, Gender, Plural",
                     "level": "A1", "status": "ready",
                     "goal": "el/la/los/las, un/una/unos/unas, gender of nouns (with the French-speaker traps)."},
                    {"id": "present-regular", "title": "L05 · Present Tense — Regular Verbs",
                     "level": "A1", "status": "ready",
                     "goal": "-ar / -er / -ir conjugation, the 6 personal endings, basic word order."},
                    {"id": "present-irregular", "title": "L06 · Stem-Changers & Common Irregulars",
                     "level": "A1", "status": "ready",
                     "goal": "e→ie, o→ue, e→i. Plus the irregulars ir, dar, ver, saber, conocer, decir, hacer."},
                    {"id": "object-pronouns-gustar", "title": "L07 · Object Pronouns & Gustar-type Verbs",
                     "level": "A1", "status": "ready",
                     "goal": "me/te/lo/la/le/se. The reversed-subject construction of gustar, doler, faltar."},
                    {"id": "numbers-time-vocab", "title": "L08 · Numbers, Time, Everyday Vocab",
                     "level": "A1", "status": "ready",
                     "goal": "Numbers, dates, family, food, body, weather — the survival kit."},
                ],
            },
            {
                "id": "expanding",
                "title": "Phase 3 — A2 Expansion",
                "description": "Past tenses, the por/para split, and chaining sentences into real conversations.",
                "lessons": [
                    {"id": "preterite-imperfect", "title": "L09 · Preterite vs Imperfect — Two Past Tenses",
                     "level": "A2", "status": "ready",
                     "goal": "When something HAPPENED (pretérito) vs what WAS happening / used to happen (imperfecto)."},
                    {"id": "por-para", "title": "L10 · Por vs Para + Key Prepositions",
                     "level": "A2", "status": "ready",
                     "goal": "The classic split + a/de/en/con/sin and idiomatic combinations."},
                    {"id": "future-conditional", "title": "L11 · Future, Conditional & Subordinate Clauses",
                     "level": "A2-B1", "status": "ready",
                     "goal": "Express plans, predictions, polite requests; link clauses with porque, que, cuando, si."},
                ],
            },
            {
                "id": "advanced",
                "title": "Phase 4 — B1/B2 Milestones",
                "description": "The Spanish skill that separates beginners from confident speakers: the subjunctive.",
                "lessons": [
                    {"id": "subjunctive", "title": "L12 · Subjunctive (presente + imperfecto)",
                     "level": "B1-B2", "status": "ready",
                     "goal": "Form it, recognise triggers (querer que, ojalá, cuando + future, conditionals), and use it confidently."},
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
    audio_path = f"/audio/spanish/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if audio_file_is_usable(output_path):
        update_audio_manifest(cache_key, text, voice, output_path)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "cached": True, "engine": "edge-tts", "language": "es-ES", "voice": voice,
        })

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:
        return jsonify({"error": f"Could not generate Spanish audio with {voice}: {exc}"}), 502

    update_audio_manifest(cache_key, text, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False, "engine": "edge-tts", "language": "es-ES", "voice": voice,
    })
