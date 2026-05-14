"""French Sprint blueprint.

Mounted at ``/api/french`` in the unified backend.

Data lives in the original French project folder by default so we don't
duplicate the (sizable) audio cache. Override with the
``FRENCH_DATA_DIR`` environment variable to relocate it.
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


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "French"
DATA_DIR = Path(os.environ.get("FRENCH_DATA_DIR", DEFAULT_DATA_DIR))
LESSON_DIR = DATA_DIR / "lessons"
PROGRESS_FILE = DATA_DIR / "progress" / "progress.json"
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"
AUDIO_TEXT_LIMIT = 5000

FRENCH_TTS_VOICES = [
    {"id": "fr-FR-VivienneMultilingualNeural", "name": "Vivienne",
     "style": "France French, smooth and friendly"},
    {"id": "fr-FR-DeniseNeural", "name": "Denise",
     "style": "France French, clear general practice"},
    {"id": "fr-FR-HenriNeural", "name": "Henri",
     "style": "France French, calm and clear"},
]
ALLOWED_TTS_VOICES = {voice["id"] for voice in FRENCH_TTS_VOICES}

bp = Blueprint("french", __name__)


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
    index = int(digest[:8], 16) % len(FRENCH_TTS_VOICES)
    return FRENCH_TTS_VOICES[index]["id"]


def tts_cache_key(text: str, voice: str) -> str:
    return hashlib.sha1(f"edge-tts-v1\n{voice}\n{text}".encode("utf-8")).hexdigest()


def tts_output_path(text: str, voice: str) -> tuple[str, Path]:
    cache_key = tts_cache_key(text, voice)
    output_dir = AUDIO_CACHE_DIR / "fr-FR" / voice
    return cache_key, output_dir / f"{cache_key}.mp3"


def update_audio_manifest(cache_key: str, text: str, voice: str, output_path: Path) -> None:
    manifest = read_json(AUDIO_MANIFEST_FILE, {"items": {}})
    items = manifest.setdefault("items", {})
    items[cache_key] = {
        "voice": voice,
        "language": "fr-FR",
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
        "language": "fr-FR",
        "engine": "edge-tts",
        "randomMode": "stable-by-text",
        "voices": FRENCH_TTS_VOICES,
    })


@bp.get("/roadmap")
def roadmap():
    return jsonify({
        "phases": [
            {
                "id": "pronunciation", "title": "发音系统",
                "description": "先建立可读、可听、可模仿的基础。",
                "lessons": [
                    {"id": "alphabet", "title": "认识字母", "status": "active",
                     "goal": "听懂并读出 26 个法语字母名。"},
                    {"id": "letter-combinations", "title": "常见字母组合", "status": "ready",
                     "goal": "系统掌握元音组合、鼻化音、辅音变化、词尾与连读。"},
                    {"id": "word-reading", "title": "从单词到短句", "status": "ready",
                     "goal": "按阶梯练习词组、节奏组、连读、省音、否定和问句。"},
                ],
            },
            {
                "id": "foundation", "title": "基础表达",
                "description": "用高频词和现在时搭出句子。",
                "lessons": [
                    {"id": "core-words", "title": "基础单词", "status": "ready",
                     "goal": "名词、形容词、人称、时间、家庭、居家、身体、地点、交通。"},
                    {"id": "present-verbs", "title": "动词变位-现在时", "status": "ready",
                     "goal": "100+ 高频动词现在时，逐格发音，并用四类例句落到句子里。"},
                    {"id": "present-tense", "title": "现在时表达", "status": "ready",
                     "goal": "人称、动作、结果和基本否定。"},
                ],
            },
            {
                "id": "verbs", "title": "动词变位",
                "description": "从规则动词到高频不规则动词。",
                "lessons": [
                    {"id": "regular-verbs", "title": "-er / -ir / -re 规则动词", "status": "ready",
                     "goal": "快速识别和产出基础变位。"},
                    {"id": "irregular-verbs", "title": "être / avoir / aller / faire", "status": "ready",
                     "goal": "优先掌握最高频不规则动词。"},
                ],
            },
            {
                "id": "advanced", "title": "复杂表达",
                "description": "过去、将来、条件、虚拟等逐步推进。",
                "lessons": [
                    {"id": "past-future", "title": "过去与将来", "status": "ready",
                     "goal": "讲经历、计划和预测。"},
                    {"id": "mood", "title": "条件式与虚拟式", "status": "ready",
                     "goal": "表达假设、愿望、态度和不确定性。"},
                ],
            },
        ]
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
    audio_path = f"/audio/french/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if audio_file_is_usable(output_path):
        update_audio_manifest(cache_key, text, voice, output_path)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "cached": True, "engine": "edge-tts", "language": "fr-FR", "voice": voice,
        })

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:
        return jsonify({"error": f"Could not generate French audio with {voice}: {exc}"}), 502

    update_audio_manifest(cache_key, text, voice, output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False, "engine": "edge-tts", "language": "fr-FR", "voice": voice,
    })
