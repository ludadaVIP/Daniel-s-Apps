"""Translator Trio blueprint.

Mounted at ``/api/translator`` in the unified backend.
Quiz files live in ``data/Translator/quizzes/`` using the schema:

    {
      "id": "quiz-1",
      "title": "Quiz 1",
      "level": "A2",
      "sentences": [{"zh": "...", "en": "...", "es": "..."}]
    }
"""

from __future__ import annotations

import asyncio
import json
import random
import re
from pathlib import Path
from typing import Any

from flask import Blueprint, Response, jsonify, request

try:
    import edge_tts  # type: ignore
except ImportError:
    edge_tts = None


DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Translator"
QUIZ_DIR = DATA_DIR / "quizzes"
QUIZ_DIR.mkdir(parents=True, exist_ok=True)

bp = Blueprint("translator", __name__)

SAFE_ID = re.compile(r"^[a-zA-Z0-9_-]+$")

TTS_VOICES: dict[str, list[tuple[str, str]]] = {
    "zh": [
        ("zh-CN-XiaoxiaoNeural", "F"),
        ("zh-CN-XiaoyiNeural", "F"),
        ("zh-CN-YunxiNeural", "M"),
        ("zh-CN-YunyangNeural", "M"),
    ],
    "en": [
        ("en-US-AvaMultilingualNeural", "F"),
        ("en-US-EmmaMultilingualNeural", "F"),
        ("en-US-AndrewMultilingualNeural", "M"),
        ("en-US-BrianMultilingualNeural", "M"),
    ],
    "es": [
        ("es-MX-DaliaNeural", "F"),
        ("es-ES-ElviraNeural", "F"),
        ("es-MX-JorgeNeural", "M"),
        ("es-ES-AlvaroNeural", "M"),
    ],
}


class TranslatorError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(TranslatorError)
def handle_error(error: TranslatorError):
    return jsonify({"error": str(error)}), error.status_code


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _natural_key(path: Path) -> list[tuple[int, Any]]:
    parts: list[tuple[int, Any]] = []
    for part in re.split(r"(\d+)", path.stem.casefold()):
        parts.append((0, int(part)) if part.isdigit() else (1, part))
    return parts


def _read_quiz(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _quiz_path(quiz_id: str) -> Path:
    if not SAFE_ID.match(quiz_id):
        raise TranslatorError("Invalid quiz id.", 400)
    path = QUIZ_DIR / f"{quiz_id}.json"
    if not path.exists():
        raise TranslatorError("Quiz not found.", 404)
    return path


def _normalize_quiz(payload: dict[str, Any], fallback_id: str) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise TranslatorError("Quiz JSON must be an object.")

    quiz_id = str(payload.get("id") or fallback_id).strip()
    if not SAFE_ID.match(quiz_id):
        raise TranslatorError("Quiz id must be alphanumeric/underscore/dash.")

    sentences_raw = payload.get("sentences") or payload.get("items") or []
    if not isinstance(sentences_raw, list) or not sentences_raw:
        raise TranslatorError("Quiz JSON must include a non-empty 'sentences' array.")

    sentences: list[dict[str, str]] = []
    for index, entry in enumerate(sentences_raw, start=1):
        if not isinstance(entry, dict):
            raise TranslatorError(f"Sentence #{index} must be an object.")
        zh = str(entry.get("zh") or entry.get("chinese") or "").strip()
        en = str(entry.get("en") or entry.get("english") or "").strip()
        es = str(entry.get("es") or entry.get("spanish") or "").strip()
        if not zh or not en or not es:
            raise TranslatorError(f"Sentence #{index} is missing zh/en/es text.")
        sentences.append({"zh": zh, "en": en, "es": es})

    return {
        "id": quiz_id,
        "title": str(payload.get("title") or quiz_id).strip(),
        "level": str(payload.get("level") or "").strip(),
        "subtitle": str(payload.get("subtitle") or "").strip(),
        "sentences": sentences,
    }


def _list_quizzes() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for path in sorted(QUIZ_DIR.glob("*.json"), key=_natural_key):
        try:
            quiz = _read_quiz(path)
        except (OSError, json.JSONDecodeError):
            continue
        sentences = quiz.get("sentences") or []
        if not isinstance(sentences, list) or not sentences:
            continue
        out.append({
            "id": quiz.get("id", path.stem),
            "title": quiz.get("title", path.stem),
            "level": quiz.get("level", ""),
            "subtitle": quiz.get("subtitle", ""),
            "count": len(sentences),
        })
    return out


def _pick_voice(lang: str, gender: str | None = None) -> tuple[str, str]:
    pool = TTS_VOICES.get(lang.lower()) or TTS_VOICES["en"]
    if gender in {"F", "M"}:
        filtered = [item for item in pool if item[1] == gender]
        if filtered:
            return random.choice(filtered)
    return random.choice(pool)


async def _synthesize(text: str, voice: str) -> bytes:
    if edge_tts is None:
        raise TranslatorError(
            "edge-tts is not installed. Run `pip install -r requirements.txt`.", 500
        )
    communicate = edge_tts.Communicate(text=text, voice=voice)
    buf = bytearray()
    async for chunk in communicate.stream():
        if chunk.get("type") == "audio":
            buf.extend(chunk.get("data") or b"")
    return bytes(buf)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@bp.get("/quizzes")
def api_quizzes():
    return jsonify({"quizzes": _list_quizzes()})


@bp.get("/quizzes/<quiz_id>")
def api_quiz(quiz_id: str):
    quiz = _read_quiz(_quiz_path(quiz_id))
    return jsonify(_normalize_quiz(quiz, quiz_id))


@bp.route("/quizzes/import", methods=["POST", "OPTIONS"])
def api_import():
    if request.method == "OPTIONS":
        return ("", 204)
    payload = request.get_json(silent=True)
    if payload is None:
        raise TranslatorError("Body must be valid JSON.")

    fallback = payload.get("id") if isinstance(payload, dict) else None
    if not fallback:
        existing = {p.stem for p in QUIZ_DIR.glob("*.json")}
        index = 1
        while f"quiz-{index}" in existing:
            index += 1
        fallback = f"quiz-{index}"

    normalized = _normalize_quiz(payload, fallback)

    overwrite = bool(request.args.get("overwrite"))
    target = QUIZ_DIR / f"{normalized['id']}.json"
    if target.exists() and not overwrite:
        try:
            existing_quiz = _read_quiz(target)
            existing_sentences = existing_quiz.get("sentences") if isinstance(existing_quiz, dict) else None
            if existing_sentences:
                raise TranslatorError(
                    f"{normalized['id']} already exists. Pass ?overwrite=1 to replace.", 409
                )
        except (OSError, json.JSONDecodeError):
            pass

    with target.open("w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return jsonify({"ok": True, "quiz": normalized})


@bp.delete("/quizzes/<quiz_id>")
def api_delete(quiz_id: str):
    path = _quiz_path(quiz_id)
    path.unlink()
    return jsonify({"ok": True})


@bp.get("/tts")
def api_tts():
    text = (request.args.get("text") or "").strip()
    if not text:
        raise TranslatorError("text is required.")
    if len(text) > 1000:
        raise TranslatorError("text is too long (max 1000 chars).")
    lang = (request.args.get("lang") or "en").strip().lower()
    gender = (request.args.get("gender") or "").strip().upper() or None

    voice, voice_gender = _pick_voice(lang, gender)
    try:
        audio = asyncio.run(_synthesize(text, voice))
    except TranslatorError:
        raise
    except Exception as exc:
        raise TranslatorError(f"TTS failed: {exc}", 502)

    return Response(
        audio,
        status=200,
        headers={
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-store",
            "X-TTS-Voice": voice,
            "X-TTS-Gender": voice_gender,
        },
    )
