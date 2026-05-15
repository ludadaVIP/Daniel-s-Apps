"""AI Practice blueprint.

Mounted at ``/api/ai-practice`` in the unified backend.
Data lives in ``backend/data/AIPractice/``.
"""

from __future__ import annotations

import asyncio
import json
import os
import re
import hashlib
import threading
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request, send_file


DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "AIPractice"
QUIZ_DIR = DATA_DIR / "quizzes"
TTS_CACHE_DIR = DATA_DIR / "tts_cache"
TAKEAWAY_DIR = DATA_DIR / "takeaways"
PROGRESS_DIR = DATA_DIR / "progress"
SETTINGS_PATH = DATA_DIR / "settings.json"

QUIZ_DIR.mkdir(parents=True, exist_ok=True)
TTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)
TAKEAWAY_DIR.mkdir(parents=True, exist_ok=True)
PROGRESS_DIR.mkdir(parents=True, exist_ok=True)

bp = Blueprint("ai_practice", __name__)

TTS_VOICES = {
    "female": [
        "en-US-AriaNeural",
        "en-US-JennyNeural",
        "en-GB-SoniaNeural",
        "en-US-MichelleNeural",
    ],
    "male": [
        "en-US-GuyNeural",
        "en-US-DavisNeural",
        "en-GB-RyanNeural",
        "en-US-EricNeural",
    ],
}
TTS_ZH_VOICES = {
    "female": ["zh-CN-XiaoxiaoNeural", "zh-CN-XiaoyiNeural"],
    "male": ["zh-CN-YunxiNeural", "zh-CN-YunjianNeural"],
}

DEFAULT_SETTINGS = {"voiceGender": "female"}

_tts_loop = asyncio.new_event_loop()
_tts_lock = threading.Lock()


def _start_loop(loop: asyncio.AbstractEventLoop) -> None:
    asyncio.set_event_loop(loop)
    loop.run_forever()


threading.Thread(target=_start_loop, args=(_tts_loop,), daemon=True).start()


class AIPracticeError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(AIPracticeError)
def handle_error(error: AIPracticeError):
    return jsonify({"error": str(error)}), error.status_code


# ---------------------------------------------------------------------------
# HTML sanitizer for takeaway editor
# ---------------------------------------------------------------------------

_TAKEAWAY_ALLOWED_TAGS = {"b", "strong", "i", "em", "u", "p", "br", "span", "font", "div"}
_TAKEAWAY_ALLOWED_ATTRS = {
    "span": {"style"},
    "font": {"color"},
}
_TAKEAWAY_VOID_TAGS = {"br"}
_COLOR_NAME_RE = re.compile(r"^[a-zA-Z]{1,30}$")
_COLOR_HEX_RE = re.compile(r"^#[0-9a-fA-F]{3,8}$")
_COLOR_RGB_RE = re.compile(r"^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$")


def _safe_color(value: str) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    if _COLOR_HEX_RE.fullmatch(value):
        return value
    if _COLOR_RGB_RE.fullmatch(value):
        return value
    if _COLOR_NAME_RE.fullmatch(value):
        return value
    return ""


def _safe_style(value: str) -> str:
    declarations = []
    for raw in (value or "").split(";"):
        if ":" not in raw:
            continue
        prop, val = raw.split(":", 1)
        prop = prop.strip().lower()
        val = val.strip()
        if prop == "color":
            safe = _safe_color(val)
            if safe:
                declarations.append(f"color: {safe}")
    return "; ".join(declarations)


def _escape_text(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


class _TakeawaySanitizer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def _emit_tag(self, tag: str, attrs: list[tuple[str, str | None]], void: bool = False) -> None:
        if tag not in _TAKEAWAY_ALLOWED_TAGS:
            return
        kept: list[str] = []
        allowed = _TAKEAWAY_ALLOWED_ATTRS.get(tag, set())
        for name, value in attrs:
            if name not in allowed:
                continue
            if name == "style":
                cleaned = _safe_style(value or "")
                if cleaned:
                    kept.append(f'style="{_escape_text(cleaned)}"')
            elif name == "color":
                cleaned = _safe_color(value or "")
                if cleaned:
                    kept.append(f'color="{_escape_text(cleaned)}"')
        attrs_str = (" " + " ".join(kept)) if kept else ""
        self.parts.append(f"<{tag}{attrs_str}{' /' if void else ''}>")

    def handle_starttag(self, tag, attrs):
        self._emit_tag(tag, attrs, void=tag in _TAKEAWAY_VOID_TAGS)

    def handle_startendtag(self, tag, attrs):
        self._emit_tag(tag, attrs, void=True)

    def handle_endtag(self, tag):
        if tag in _TAKEAWAY_ALLOWED_TAGS and tag not in _TAKEAWAY_VOID_TAGS:
            self.parts.append(f"</{tag}>")

    def handle_data(self, data):
        self.parts.append(_escape_text(data))


def sanitize_takeaway_html(html: str) -> str:
    if not isinstance(html, str) or not html:
        return ""
    parser = _TakeawaySanitizer()
    parser.feed(html)
    parser.close()
    return "".join(parser.parts)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def read_quiz_file(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def quiz_path(quiz_id: str) -> Path:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id):
        raise AIPracticeError("Invalid quiz id.", 400)
    path = QUIZ_DIR / f"{quiz_id}.json"
    if not path.exists():
        raise AIPracticeError("Quiz not found.", 404)
    return path


def load_quiz(quiz_id: str) -> dict[str, Any]:
    return read_quiz_file(quiz_path(quiz_id))


def natural_quiz_sort_key(path: Path) -> list[tuple[int, Any]]:
    key: list[tuple[int, Any]] = []
    for part in re.split(r"(\d+)", path.stem.casefold()):
        key.append((0, int(part)) if part.isdigit() else (1, part))
    return key


def list_quizzes() -> list[dict[str, Any]]:
    quizzes = []
    for path in sorted(QUIZ_DIR.glob("*.json"), key=natural_quiz_sort_key):
        quiz = read_quiz_file(path)
        questions = quiz.get("questions", [])
        categories: dict[str, int] = {}
        for question in questions:
            category = question.get("category", "General")
            categories[category] = categories.get(category, 0) + 1
        quizzes.append({
            "id": quiz.get("id", path.stem),
            "title": quiz.get("title", path.stem),
            "subtitle": quiz.get("subtitle", ""),
            "level": quiz.get("level", ""),
            "estimatedMinutes": quiz.get("estimatedMinutes"),
            "questionCount": len(questions),
            "categories": categories,
        })
    return quizzes


def public_question(question: dict[str, Any]) -> dict[str, Any]:
    output = {
        "id": question["id"],
        "domain": question.get("domain", ""),
        "category": question.get("category", "General"),
        "skill": question.get("skill", question.get("category", "General")),
        "icon": question.get("icon", "Sparkles"),
        "type": question["type"],
        "question": question["question"],
    }
    if question.get("reading"):
        output["reading"] = question["reading"]
    if question["type"] == "mc":
        output["options"] = question.get("options", [])
    return output


def public_quiz(quiz: dict[str, Any]) -> dict[str, Any]:
    questions = quiz.get("questions", [])
    return {
        "id": quiz["id"],
        "title": quiz.get("title", quiz["id"]),
        "subtitle": quiz.get("subtitle", ""),
        "level": quiz.get("level", ""),
        "estimatedMinutes": quiz.get("estimatedMinutes"),
        "questionCount": len(questions),
        "questions": [public_question(question) for question in questions],
    }


def find_question(quiz: dict[str, Any], question_id: int) -> dict[str, Any]:
    for question in quiz.get("questions", []):
        if int(question["id"]) == int(question_id):
            return question
    raise AIPracticeError("Question not found.", 404)


def normalize_fill(value: str) -> str:
    value = re.sub(r"[.,!?]+$", "", value or "")
    value = re.sub(r"\s+", " ", value)
    return value.strip().casefold()


def grade_multiple_choice(question: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    options = question.get("options", [])
    try:
        answer_index = int(payload["answerIndex"])
    except (KeyError, TypeError, ValueError) as exc:
        raise AIPracticeError("answerIndex is required for multiple choice questions.") from exc
    if answer_index < 0 or answer_index >= len(options):
        raise AIPracticeError("answerIndex is outside the option range.")
    correct_index = int(question["correctIndex"])
    return {
        "answerIndex": answer_index,
        "answerText": options[answer_index],
        "correctIndex": correct_index,
        "correctText": options[correct_index],
        "correct": answer_index == correct_index,
    }


def grade_fill(question: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    answer_text = str(payload.get("answerText", "")).strip()
    if not answer_text:
        raise AIPracticeError("answerText is required for fill questions.")
    acceptable = question.get("acceptable") or [question["answer"]]
    normalized_answer = normalize_fill(answer_text)
    correct = any(normalize_fill(option) == normalized_answer for option in acceptable)
    return {
        "answerText": answer_text,
        "correctText": question["answer"],
        "correct": correct,
    }


# ---------- Settings ----------

def load_settings() -> dict[str, Any]:
    if not SETTINGS_PATH.exists():
        return dict(DEFAULT_SETTINGS)
    try:
        with SETTINGS_PATH.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except (json.JSONDecodeError, OSError):
        return dict(DEFAULT_SETTINGS)
    merged = dict(DEFAULT_SETTINGS)
    merged.update({k: v for k, v in data.items() if v is not None})
    if merged.get("voiceGender") not in ("male", "female"):
        merged["voiceGender"] = "female"
    return merged


def save_settings(settings: dict[str, Any]) -> dict[str, Any]:
    SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SETTINGS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(settings, handle, indent=2)
    return settings


# ---------- TTS ----------

def contains_cjk(text: str) -> bool:
    return bool(re.search(r"[㐀-鿿]", text or ""))


def pick_voice(text: str, gender: str) -> str:
    voice_bank = TTS_ZH_VOICES if contains_cjk(text) else TTS_VOICES
    voices = voice_bank.get(gender) or voice_bank["female"]
    digest = hashlib.sha256(f"{gender}|{text}".encode("utf-8")).digest()
    return voices[digest[0] % len(voices)]


def tts_cache_key(text: str, voice: str) -> str:
    blob = f"{voice}|{text}".encode("utf-8")
    return hashlib.sha256(blob).hexdigest()


def synthesize_tts_async(text: str, voice: str, out_path: Path) -> None:
    import edge_tts

    async def _run() -> None:
        communicate = edge_tts.Communicate(text=text, voice=voice)
        tmp = out_path.with_suffix(out_path.suffix + ".part")
        await communicate.save(str(tmp))
        tmp.replace(out_path)

    future = asyncio.run_coroutine_threadsafe(_run(), _tts_loop)
    future.result(timeout=60)


def ensure_tts_audio(text: str, gender: str | None = None) -> tuple[Path, str]:
    settings = load_settings()
    resolved_gender = (gender or settings.get("voiceGender") or "female").lower()
    if resolved_gender not in ("male", "female"):
        resolved_gender = "female"
    voice = pick_voice(text, resolved_gender)
    key = tts_cache_key(text, voice)
    out_path = TTS_CACHE_DIR / f"{key}.mp3"
    if not out_path.exists() or out_path.stat().st_size == 0:
        with _tts_lock:
            if not out_path.exists() or out_path.stat().st_size == 0:
                synthesize_tts_async(text, voice, out_path)
    return out_path, voice


def clear_quiz_audio(quiz_id: str) -> int:
    index_path = TTS_CACHE_DIR / f"_index_{quiz_id}.json"
    removed = 0
    if index_path.exists():
        try:
            keys = json.loads(index_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            keys = []
        for key in keys:
            audio_path = TTS_CACHE_DIR / f"{key}.mp3"
            if audio_path.exists():
                try:
                    audio_path.unlink()
                    removed += 1
                except OSError:
                    pass
        try:
            index_path.unlink()
        except OSError:
            pass
    return removed


def clear_quiz_takeaway(quiz_id: str) -> None:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id or ""):
        return
    path = TAKEAWAY_DIR / f"{quiz_id}.json"
    if path.exists():
        try:
            path.unlink()
        except OSError:
            pass


def progress_path(quiz_id: str) -> Path:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id or ""):
        raise AIPracticeError("Invalid quiz id.", 400)
    return PROGRESS_DIR / f"{quiz_id}.json"


def blank_quiz_state() -> dict[str, Any]:
    return {
        "currentIndex": -1,
        "answers": {},
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "finishedAt": None,
        "savedAttemptId": None,
    }


def load_progress_record(quiz_id: str) -> dict[str, Any]:
    path = progress_path(quiz_id)
    if not path.exists():
        return {"quizId": quiz_id, "state": blank_quiz_state()}
    try:
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except (json.JSONDecodeError, OSError):
        return {"quizId": quiz_id, "state": blank_quiz_state()}
    state = blank_quiz_state()
    saved_state = data.get("state")
    if isinstance(saved_state, dict):
        state.update(saved_state)
    if not isinstance(state.get("answers"), dict):
        state["answers"] = {}
    return {"quizId": quiz_id, "state": state}


def save_progress_record(quiz_id: str, state: dict[str, Any]) -> dict[str, Any]:
    PROGRESS_DIR.mkdir(parents=True, exist_ok=True)
    record = {
        "quizId": quiz_id,
        "state": state,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    with progress_path(quiz_id).open("w", encoding="utf-8") as handle:
        json.dump(record, handle, indent=2, ensure_ascii=False)
    return record


def clear_quiz_progress(quiz_id: str) -> None:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id or ""):
        return
    path = PROGRESS_DIR / f"{quiz_id}.json"
    if path.exists():
        try:
            path.unlink()
        except OSError:
            pass


def record_quiz_audio(quiz_id: str, cache_key: str) -> None:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id or ""):
        return
    index_path = TTS_CACHE_DIR / f"_index_{quiz_id}.json"
    try:
        keys = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else []
    except (json.JSONDecodeError, OSError):
        keys = []
    if cache_key not in keys:
        keys.append(cache_key)
        try:
            index_path.write_text(json.dumps(keys), encoding="utf-8")
        except OSError:
            pass


def _next_quiz_id() -> str:
    existing = {p.stem for p in QUIZ_DIR.glob("*.json")}
    index = 1
    while True:
        candidate = f"quiz-{index}"
        if candidate not in existing:
            return candidate
        index += 1


def _slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9-_]+", "-", value or "")
    value = re.sub(r"-{2,}", "-", value).strip("-_")
    return value.lower()


def rename_or_retitle_quiz(old_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    path = quiz_path(old_id)
    quiz = read_quiz_file(path)

    new_title = payload.get("title")
    requested_id = payload.get("id")
    if requested_id is not None and not re.fullmatch(r"[a-zA-Z0-9_-]+", str(requested_id)):
        requested_id = _slugify(str(requested_id)) or None
    new_id = requested_id or old_id

    if isinstance(new_title, str) and new_title.strip():
        quiz["title"] = new_title.strip()
    if payload.get("subtitle") is not None:
        quiz["subtitle"] = str(payload.get("subtitle") or "")
    if payload.get("level") is not None:
        quiz["level"] = str(payload.get("level") or "")

    target_path = QUIZ_DIR / f"{new_id}.json"
    if new_id != old_id and target_path.exists():
        raise AIPracticeError(f"A quiz named '{new_id}' already exists.", 409)

    quiz["id"] = new_id
    with target_path.open("w", encoding="utf-8") as handle:
        json.dump(quiz, handle, indent=2, ensure_ascii=False)
    if new_id != old_id:
        try:
            path.unlink()
        except OSError:
            pass
        for old_file, new_file in [
            (TTS_CACHE_DIR / f"_index_{old_id}.json", TTS_CACHE_DIR / f"_index_{new_id}.json"),
            (TAKEAWAY_DIR / f"{old_id}.json", TAKEAWAY_DIR / f"{new_id}.json"),
            (PROGRESS_DIR / f"{old_id}.json", PROGRESS_DIR / f"{new_id}.json"),
        ]:
            if old_file.exists():
                try:
                    old_file.replace(new_file)
                except OSError:
                    pass

    return {
        "oldId": old_id,
        "id": new_id,
        "title": quiz.get("title", new_id),
        "renamed": new_id != old_id,
    }


def create_imported_quiz(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise AIPracticeError("Imported quiz must be a JSON object.")

    questions = payload.get("questions")
    if not isinstance(questions, list) or not questions:
        raise AIPracticeError("Imported quiz must include a non-empty 'questions' list.")

    requested_id = payload.get("id")
    if requested_id and not re.fullmatch(r"[a-zA-Z0-9_-]+", str(requested_id)):
        requested_id = _slugify(str(requested_id)) or None

    if requested_id and (QUIZ_DIR / f"{requested_id}.json").exists():
        index = 2
        while (QUIZ_DIR / f"{requested_id}-{index}.json").exists():
            index += 1
        requested_id = f"{requested_id}-{index}"

    quiz_id = requested_id or _next_quiz_id()

    cleaned_questions: list[dict[str, Any]] = []
    for offset, raw in enumerate(questions, start=1):
        if not isinstance(raw, dict):
            raise AIPracticeError(f"Question #{offset} must be a JSON object.")
        qtype = raw.get("type")
        if qtype not in ("mc", "fill"):
            raise AIPracticeError(f"Question #{offset} has unsupported type '{qtype}'.")
        question_text = raw.get("question")
        if not isinstance(question_text, str) or not question_text.strip():
            raise AIPracticeError(f"Question #{offset} is missing 'question'.")

        cleaned: dict[str, Any] = {
            "id": int(raw.get("id") or offset),
            "domain": str(raw.get("domain") or ""),
            "category": str(raw.get("category") or "General"),
            "skill": str(raw.get("skill") or raw.get("category") or "General"),
            "icon": str(raw.get("icon") or "✨"),
            "type": qtype,
            "question": question_text,
            "explanation": str(raw.get("explanation") or ""),
            "explanationZh": str(raw.get("explanationZh") or ""),
            "coreTakeaway": str(raw.get("coreTakeaway") or raw.get("explanation") or ""),
        }
        if raw.get("reading"):
            cleaned["reading"] = str(raw["reading"])

        if qtype == "mc":
            options = raw.get("options")
            if not isinstance(options, list) or len(options) < 2:
                raise AIPracticeError(f"Question #{offset} (mc) needs an 'options' list.")
            try:
                correct_index = int(raw.get("correctIndex"))
            except (TypeError, ValueError) as exc:
                raise AIPracticeError(f"Question #{offset} (mc) needs a numeric 'correctIndex'.") from exc
            if correct_index < 0 or correct_index >= len(options):
                raise AIPracticeError(f"Question #{offset} (mc) 'correctIndex' is out of range.")
            cleaned["options"] = [str(option) for option in options]
            cleaned["correctIndex"] = correct_index
        elif qtype == "fill":
            answer = raw.get("answer")
            if not isinstance(answer, str) or not answer.strip():
                raise AIPracticeError(f"Question #{offset} (fill) needs an 'answer'.")
            cleaned["answer"] = answer.strip()
            acceptable = raw.get("acceptable")
            if isinstance(acceptable, list) and acceptable:
                cleaned["acceptable"] = [str(value) for value in acceptable]
            else:
                cleaned["acceptable"] = [answer.strip()]
        cleaned_questions.append(cleaned)

    quiz_record = {
        "id": quiz_id,
        "title": str(payload.get("title") or quiz_id.replace("-", " ").title()),
        "subtitle": str(payload.get("subtitle") or ""),
        "level": str(payload.get("level") or ""),
        "audience": str(payload.get("audience") or ""),
        "estimatedMinutes": payload.get("estimatedMinutes"),
        "source": str(payload.get("source") or "Imported via Prompt Generator"),
        "createdAt": datetime.now(timezone.utc).date().isoformat(),
        "questions": cleaned_questions,
    }

    target = QUIZ_DIR / f"{quiz_id}.json"
    with target.open("w", encoding="utf-8") as handle:
        json.dump(quiz_record, handle, indent=2, ensure_ascii=False)

    return {
        "id": quiz_id,
        "title": quiz_record["title"],
        "questionCount": len(cleaned_questions),
        "path": str(target.name),
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@bp.route("/quizzes", methods=["GET", "POST", "OPTIONS"])
def api_quizzes():
    if request.method == "OPTIONS":
        return ("", 204)
    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        return jsonify(create_imported_quiz(payload)), 201
    return jsonify({"quizzes": list_quizzes()})


@bp.route("/quizzes/<quiz_id>", methods=["GET", "PUT", "DELETE", "OPTIONS"])
def api_quiz(quiz_id: str):
    if request.method == "OPTIONS":
        return ("", 204)
    if request.method == "DELETE":
        path = quiz_path(quiz_id)
        path.unlink()
        removed = clear_quiz_audio(quiz_id)
        clear_quiz_takeaway(quiz_id)
        clear_quiz_progress(quiz_id)
        return jsonify({"deleted": quiz_id, "audioRemoved": removed})
    if request.method == "PUT":
        payload = request.get_json(silent=True) or {}
        return jsonify(rename_or_retitle_quiz(quiz_id, payload))
    return jsonify(public_quiz(load_quiz(quiz_id)))


@bp.route("/quizzes/<quiz_id>/questions/<int:question_id>", methods=["DELETE", "OPTIONS"])
def api_quiz_question(quiz_id: str, question_id: int):
    if request.method == "OPTIONS":
        return ("", 204)
    path = quiz_path(quiz_id)
    quiz = read_quiz_file(path)
    questions = quiz.get("questions", [])
    new_questions = [q for q in questions if int(q.get("id", -1)) != question_id]
    if len(new_questions) == len(questions):
        raise AIPracticeError("Question not found.", 404)
    quiz["questions"] = new_questions
    with path.open("w", encoding="utf-8") as handle:
        json.dump(quiz, handle, indent=2, ensure_ascii=False)
    return jsonify({"deleted": question_id, "remaining": len(new_questions), "quizId": quiz_id})


@bp.route("/quizzes/<quiz_id>/grade", methods=["POST", "OPTIONS"])
def api_grade_question(quiz_id: str):
    if request.method == "OPTIONS":
        return ("", 204)
    payload = request.get_json(silent=True) or {}
    try:
        question_id = int(payload["questionId"])
    except (KeyError, TypeError, ValueError) as exc:
        raise AIPracticeError("questionId is required.") from exc

    quiz = load_quiz(quiz_id)
    question = find_question(quiz, question_id)
    if question["type"] == "mc":
        result = grade_multiple_choice(question, payload)
    elif question["type"] == "fill":
        result = grade_fill(question, payload)
    else:
        raise AIPracticeError("Unsupported question type.", 500)

    explanation_en = question.get("explanation", "")
    explanation_zh = question.get("explanationZh", "")
    explanation = (
        f"{explanation_en}\n\n{explanation_zh}"
        if explanation_en and explanation_zh
        else explanation_en or explanation_zh
    )
    result.update({
        "questionId": question["id"],
        "category": question.get("category", "General"),
        "skill": question.get("skill", question.get("category", "General")),
        "type": question["type"],
        "explanation": explanation,
        "explanationEn": explanation_en,
        "explanationZh": explanation_zh,
        "coreTakeaway": question.get("coreTakeaway", "") or explanation_en or "",
        "answeredAt": datetime.now(timezone.utc).isoformat(),
    })
    return jsonify(result)


@bp.route("/quizzes/<quiz_id>/takeaway", methods=["GET", "PUT", "OPTIONS"])
def api_quiz_takeaway(quiz_id: str):
    if request.method == "OPTIONS":
        return ("", 204)
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id):
        raise AIPracticeError("Invalid quiz id.", 400)
    path = TAKEAWAY_DIR / f"{quiz_id}.json"

    def read_takeaway_record() -> dict[str, Any]:
        if not path.exists():
            return {"quizId": quiz_id, "perQuestion": {}, "updatedAt": None}
        try:
            with path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
        except (json.JSONDecodeError, OSError):
            return {"quizId": quiz_id, "perQuestion": {}, "updatedAt": None}
        per_question = data.get("perQuestion")
        if not isinstance(per_question, dict):
            per_question = {}
        return {"quizId": quiz_id, "perQuestion": per_question, "updatedAt": data.get("updatedAt")}

    if request.method == "GET":
        return jsonify(read_takeaway_record())

    payload = request.get_json(silent=True) or {}
    html = payload.get("html")
    question_id = payload.get("questionId")
    if not isinstance(html, str):
        raise AIPracticeError("'html' must be a string.")
    if question_id is None:
        raise AIPracticeError("'questionId' is required.")
    if len(html) > 200_000:
        raise AIPracticeError("Takeaway is too long (max 200 KB).")
    safe_html = sanitize_takeaway_html(html)
    record = read_takeaway_record()
    per_question = dict(record.get("perQuestion") or {})
    per_question[str(question_id)] = safe_html
    record = {
        "quizId": quiz_id,
        "perQuestion": per_question,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    with path.open("w", encoding="utf-8") as handle:
        json.dump(record, handle, indent=2, ensure_ascii=False)
    return jsonify(record)


@bp.route("/progress-summary", methods=["GET", "OPTIONS"])
def api_progress_summary():
    if request.method == "OPTIONS":
        return ("", 204)
    summary: dict[str, Any] = {}
    for quiz in list_quizzes():
        progress = load_progress_record(quiz["id"])
        summary[quiz["id"]] = {"state": progress["state"]}
    return jsonify({"progress": summary})


@bp.route("/quizzes/<quiz_id>/progress", methods=["GET", "PUT", "DELETE", "OPTIONS"])
def api_quiz_progress(quiz_id: str):
    if request.method == "OPTIONS":
        return ("", 204)
    quiz_path(quiz_id)
    if request.method == "DELETE":
        state = blank_quiz_state()
        return jsonify(save_progress_record(quiz_id, state))
    if request.method == "GET":
        return jsonify(load_progress_record(quiz_id))
    payload = request.get_json(silent=True) or {}
    state = payload.get("state")
    if not isinstance(state, dict):
        raise AIPracticeError("'state' must be an object.")
    merged_state = blank_quiz_state()
    merged_state.update(state)
    if not isinstance(merged_state.get("answers"), dict):
        merged_state["answers"] = {}
    return jsonify(save_progress_record(quiz_id, merged_state))


@bp.route("/settings", methods=["GET", "PUT", "OPTIONS"])
def api_settings():
    if request.method == "OPTIONS":
        return ("", 204)
    if request.method == "PUT":
        payload = request.get_json(silent=True) or {}
        gender = str(payload.get("voiceGender") or "").lower()
        if gender not in ("male", "female"):
            raise AIPracticeError("voiceGender must be 'male' or 'female'.")
        return jsonify(save_settings({"voiceGender": gender}))
    return jsonify(load_settings())


@bp.route("/tts", methods=["POST", "OPTIONS"])
def api_tts():
    if request.method == "OPTIONS":
        return ("", 204)
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("text") or "").strip()
    if not text:
        raise AIPracticeError("text is required for TTS.")
    if len(text) > 1200:
        raise AIPracticeError("text is too long for TTS (max 1200 chars).")
    quiz_id = str(payload.get("quizId") or "").strip()
    gender = payload.get("gender")
    try:
        audio_path, voice = ensure_tts_audio(text, gender=gender)
    except Exception as exc:
        raise AIPracticeError(f"Could not synthesize speech: {exc}", 500) from exc
    if quiz_id:
        record_quiz_audio(quiz_id, audio_path.stem)
    response = send_file(audio_path, mimetype="audio/mpeg", conditional=True)
    response.headers["X-TTS-Voice"] = voice
    return response
