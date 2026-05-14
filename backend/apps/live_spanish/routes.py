"""Live Spanish blueprint.

Mounted at ``/api/live-spanish`` in the unified backend. Data path is
configurable via ``LIVE_SPANISH_DATA_DIR``.

This is the largest blueprint of the four; it carries the lenient JSON
importer, quiz rename / delete operations, per-question audio caching,
and per-quiz progress tracking that the standalone app exposed.
"""

from __future__ import annotations

import ast
import hashlib
import html
import json
import os
import re
import shutil
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, abort, jsonify, request

from shared.io import read_json, write_json
from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import (
    ALLOWED_VOICES,
    SUPPORTED_LANGUAGES,
    language_name,
    normalise_language,
    voice_for_language_gender,
)


DEFAULT_DATA_ROOT = Path(__file__).resolve().parents[2] / "data" / "Live-Spanish"
DATA_ROOT = Path(os.environ.get("LIVE_SPANISH_DATA_DIR", DEFAULT_DATA_ROOT))
QUIZ_DIR = DATA_ROOT / "quizzes"
INDEX_PATH = QUIZ_DIR / "index.json"
AUDIO_DIR = DATA_ROOT / "audio"
PROGRESS_DIR = DATA_ROOT / "progress"
QUIZ_ID_RE = re.compile(r"^[a-z0-9-]+$")
ALLOWED_LEVELS = {"A1", "A2", "A2-B1", "B1", "B1-B2", "B2", "C1", "C2"}
DEFAULT_LANGUAGE = "es"
PRIVATE_QUESTION_KEYS = {
    "valid", "best", "feedback", "acceptable", "correctChoiceId",
    "correct_choice_id", "correctIndex", "correct_index", "correctAnswer",
    "correct_answer", "correctSentence", "correct_sentence", "audioText",
    "audio_text", "answer", "answers", "explanation", "rationale",
}

bp = Blueprint("live_spanish", __name__)


def ensure_data_dirs() -> None:
    QUIZ_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    PROGRESS_DIR.mkdir(parents=True, exist_ok=True)


def default_voice_for_language(language: Any) -> str:
    return SUPPORTED_LANGUAGES[normalise_language(language)]["voices"][0]["id"]


def voice_options_for_language(language: Any) -> list[dict[str, str]]:
    return SUPPORTED_LANGUAGES[normalise_language(language)]["voices"]


def language_payload(language: Any) -> dict[str, str]:
    code = normalise_language(language)
    return {
        "language": code,
        "languageName": SUPPORTED_LANGUAGES[code]["name"],
        "defaultVoice": default_voice_for_language(code),
        "femaleVoice": voice_for_language_gender(code, "female"),
        "maleVoice": voice_for_language_gender(code, "male"),
        "voices": voice_options_for_language(code),
    }


def slugify(value: Any, fallback: str = "quiz") -> str:
    text = str(value or "").strip().lower()
    without_accents = "".join(
        char for char in unicodedata.normalize("NFD", text)
        if unicodedata.category(char) != "Mn"
    )
    slug = re.sub(r"[^a-z0-9]+", "-", without_accents).strip("-")
    return slug or fallback


def unique_quiz_id(desired_id: Any) -> str:
    base = slugify(desired_id, "quiz")
    candidate = base
    counter = 2
    while (QUIZ_DIR / f"{candidate}.json").exists():
        candidate = f"{base}-{counter}"
        counter += 1
    return candidate


def unique_quiz_id_for_rename(desired_title: Any, current_id: str) -> str:
    base = slugify(desired_title, "quiz")
    candidate = base
    counter = 2
    while candidate != current_id and (
        (QUIZ_DIR / f"{candidate}.json").exists()
        or (PROGRESS_DIR / f"{candidate}.json").exists()
        or (AUDIO_DIR / candidate).exists()
    ):
        candidate = f"{base}-{counter}"
        counter += 1
    return candidate


def next_quiz_order(index: dict[str, Any]) -> int:
    return max([int(item.get("order", 0)) for item in index.get("quizzes", [])] or [0]) + 1


def question_kind(question: dict[str, Any]) -> str:
    kind = str(
        question.get("kind") or question.get("questionKind")
        or question.get("question_type") or question.get("questionType")
        or question.get("type") or ""
    ).lower()
    if kind in {"choice", "multiple-choice", "multiple_choice", "mcq", "multiple choice", "select"}:
        return "choice"
    if kind in {"fill", "fill-in", "fill_blank", "fill-in-blank", "blank"}:
        return "fill"
    return (
        "choice" if (
            question.get("choices") or question.get("options")
            or question.get("answerOptions") or question.get("answer_options")
        ) else "fill"
    )


def infer_quiz_kind(quiz: dict[str, Any]) -> str:
    questions = quiz.get("questions", [])
    if questions and all(question_kind(q) == "choice" for q in questions):
        return "choice"
    return "fill"


def quizzes_payload() -> dict[str, Any]:
    if not INDEX_PATH.exists():
        return {"quizzes": []}
    index = read_json(INDEX_PATH)
    quizzes = []
    seen_ids = set()

    indexed = sorted(index.get("quizzes", []), key=lambda item: item.get("order", 0))
    for meta in indexed:
        path = QUIZ_DIR / f"{meta['id']}.json"
        question_count = 0
        quiz_kind = meta.get("kind", "fill")
        quiz_language = meta.get("language", DEFAULT_LANGUAGE)
        if path.exists():
            quiz = read_json(path)
            question_count = len(quiz.get("questions", []))
            quiz_kind = (
                meta.get("kind") or quiz.get("kind")
                or quiz.get("quizType") or infer_quiz_kind(quiz)
            )
            quiz_language = (
                meta.get("language") or quiz.get("language")
                or quiz.get("targetLanguage") or quiz_language
            )
        quizzes.append({
            **meta,
            **language_payload(quiz_language),
            "kind": quiz_kind,
            "questionCount": question_count,
        })
        seen_ids.add(meta["id"])

    next_order = next_quiz_order(index)
    for path in sorted(QUIZ_DIR.glob("*.json")):
        if path.name == "index.json" or path.stem in seen_ids:
            continue
        quiz = read_json(path)
        quiz_language = quiz.get("language") or quiz.get("targetLanguage") or DEFAULT_LANGUAGE
        quizzes.append({
            "id": path.stem,
            **language_payload(quiz_language),
            "title": quiz.get("title", path.stem),
            "subtitle": quiz.get("subtitle", quiz.get("description", "")),
            "level": quiz.get("level", ""),
            "kind": quiz.get("kind") or quiz.get("quizType") or infer_quiz_kind(quiz),
            "status": quiz.get("status", "ready"),
            "order": next_order,
            "questionCount": len(quiz.get("questions", [])),
        })
        next_order += 1

    return {"quizzes": quizzes}


def quiz_path(quiz_id: str) -> Path:
    if not QUIZ_ID_RE.match(quiz_id):
        abort(404)
    path = QUIZ_DIR / f"{quiz_id}.json"
    if not path.exists():
        abort(404)
    return path


def find_question(quiz: dict[str, Any], question_id: int) -> dict[str, Any]:
    for question in quiz.get("questions", []):
        if question.get("id") == question_id:
            return question
    abort(404)


def find_question_index(quiz: dict[str, Any], question_id: int) -> int:
    for index, question in enumerate(quiz.get("questions", [])):
        if question.get("id") == question_id:
            return index
    abort(404)


def public_question(question: dict[str, Any]) -> dict[str, Any]:
    payload = {
        key: value for key, value in question.items()
        if key not in PRIVATE_QUESTION_KEYS and not key.startswith("audio_")
    } | {
        "kind": question_kind(question),
        "blankCount": len(question.get("valid", [])) if question_kind(question) == "fill" else 0,
    }
    if question_kind(question) == "choice":
        payload["choices"] = normalise_choices(question)
    return payload


def public_quiz(quiz: dict[str, Any]) -> dict[str, Any]:
    quiz_language = quiz.get("language") or quiz.get("targetLanguage") or DEFAULT_LANGUAGE
    return {
        **{key: value for key, value in quiz.items() if key != "questions"},
        **language_payload(quiz_language),
        "kind": quiz.get("kind") or quiz.get("quizType") or infer_quiz_kind(quiz),
        "questionCount": len(quiz.get("questions", [])),
        "questions": [public_question(q) for q in quiz.get("questions", [])],
    }


def normalise(value: str) -> str:
    stripped = value.strip().lower()
    without_accents = "".join(
        char for char in unicodedata.normalize("NFD", stripped)
        if unicodedata.category(char) != "Mn"
    )
    return re.sub(r"\s+", " ", without_accents)


def is_blank_correct(value: str, valid_answers: list[str]) -> bool:
    if not value.strip():
        return False
    user_answer = normalise(value)
    return any(normalise(answer) == user_answer for answer in valid_answers)


def choice_id(choice: Any, index: int) -> str:
    if isinstance(choice, dict):
        return str(choice.get("id") or choice.get("value") or chr(65 + index))
    return chr(65 + index)


def choice_text(choice: Any) -> str:
    if isinstance(choice, dict):
        return str(choice.get("text") or choice.get("label") or choice.get("value") or choice.get("id") or "")
    return str(choice)


def choice_rationale(choice: Any) -> str:
    if not isinstance(choice, dict):
        return ""
    return str(
        choice.get("rationale") or choice.get("reason")
        or choice.get("explanation") or choice.get("feedback") or ""
    ).strip()


def raw_choice_items(question: dict[str, Any]) -> list[Any]:
    choices = (
        question.get("choices") or question.get("options")
        or question.get("answerOptions") or question.get("answer_options") or []
    )
    if isinstance(choices, dict):
        return [{"id": key, "text": value} for key, value in choices.items()]
    return choices if isinstance(choices, list) else []


def normalise_choices(question: dict[str, Any]) -> list[dict[str, str]]:
    return [
        {"id": choice_id(choice, index), "text": choice_text(choice)}
        for index, choice in enumerate(question.get("choices", []))
    ]


def normalise_choice_rationales(question: dict[str, Any]) -> list[dict[str, str]]:
    rationales = []
    for index, choice in enumerate(question.get("choices", [])):
        rationale = choice_rationale(choice)
        if rationale:
            rationales.append({
                "id": choice_id(choice, index),
                "text": choice_text(choice),
                "rationale": rationale,
            })
    return rationales


def correct_choice_id(question: dict[str, Any]) -> str:
    choices = normalise_choices(question)
    direct = (
        question.get("correctChoiceId") or question.get("correct_choice_id")
        or question.get("correctAnswer") or question.get("correct_answer")
    )
    if direct is not None:
        direct_text = str(direct)
        for choice in choices:
            if (
                direct_text == choice["id"]
                or normalise(direct_text) == normalise(choice["id"])
                or normalise(direct_text) == normalise(choice["text"])
            ):
                return choice["id"]
        if direct_text.strip().isdigit():
            direct_index = int(direct_text.strip())
            if 0 <= direct_index < len(choices):
                return choices[direct_index]["id"]
            if 1 <= direct_index <= len(choices):
                return choices[direct_index - 1]["id"]
        return direct_text

    index = question.get("correctIndex", question.get("correct_index"))
    if isinstance(index, str):
        stripped_index = index.strip()
        if stripped_index.isdigit():
            index = int(stripped_index)
        elif len(stripped_index) == 1 and stripped_index.upper().isalpha():
            letter_index = ord(stripped_index.upper()) - 65
            if 0 <= letter_index < len(choices):
                return choices[letter_index]["id"]
    if isinstance(index, int):
        if 0 <= index < len(choices):
            return choices[index]["id"]
        if 1 <= index <= len(choices):
            return choices[index - 1]["id"]

    return choices[0]["id"] if choices else ""


def correct_choice_text(question: dict[str, Any]) -> str:
    correct_id = correct_choice_id(question)
    for choice in normalise_choices(question):
        if choice["id"] == correct_id:
            return choice["text"]
    return str(question.get("correctAnswer") or question.get("correct_answer") or correct_id)


def canonical_answer(value: str) -> str:
    return re.split(r"\s*/\s*", str(value), maxsplit=1)[0].strip()


def complete_sentence(question: dict[str, Any]) -> str:
    if question_kind(question) == "choice":
        if question.get("audioText"):
            return str(question["audioText"])
        if question.get("audio_text"):
            return str(question["audio_text"])
        prompt = str(question.get("prompt") or question.get("sentence") or question.get("question") or "")
        answer = correct_choice_text(question)
        if "{0}" in prompt:
            return prompt.replace("{0}", answer)
        if re.search(r"_{2,}", prompt):
            return re.sub(r"_{2,}", answer, prompt)
        return f"{prompt} {answer}".strip()

    sentence = question.get("sentence", "")
    valid = question.get("valid", [])
    best = question.get("best", [])
    multi_blank = len(valid) > 1

    def replacement(match: re.Match[str]) -> str:
        blank_index = int(match.group(1))
        if multi_blank and blank_index < len(best):
            answer = best[blank_index]
        elif not multi_blank and best:
            answer = best[0]
        elif blank_index < len(valid) and valid[blank_index]:
            answer = valid[blank_index][0]
        else:
            answer = ""
        return canonical_answer(answer)

    return re.sub(r"\{(\d+)\}", replacement, sentence)


def audio_url_to_path(audio_path: str | None) -> Path | None:
    if not audio_path:
        return None
    # Accept both legacy "/audio/..." and namespaced "/audio/live-spanish/..."
    prefixes = ("/audio/live-spanish/", "/audio/")
    relative = None
    for prefix in prefixes:
        if audio_path.startswith(prefix):
            relative = audio_path[len(prefix):]
            break
    if relative is None:
        return None
    path = (AUDIO_DIR / relative).resolve()
    if AUDIO_DIR.resolve() not in path.parents and path != AUDIO_DIR.resolve():
        return None
    return path


def remove_audio_file(audio_path: str | None) -> None:
    path = audio_url_to_path(audio_path)
    if path and path.exists() and path.is_file():
        path.unlink()


def retarget_audio_urls(value: Any, old_quiz_id: str, new_quiz_id: str) -> Any:
    old_prefix = f"/audio/live-spanish/{old_quiz_id}/"
    new_prefix = f"/audio/live-spanish/{new_quiz_id}/"
    legacy_old_prefix = f"/audio/{old_quiz_id}/"
    legacy_new_prefix = f"/audio/live-spanish/{new_quiz_id}/"
    if isinstance(value, dict):
        return {k: retarget_audio_urls(v, old_quiz_id, new_quiz_id) for k, v in value.items()}
    if isinstance(value, list):
        return [retarget_audio_urls(item, old_quiz_id, new_quiz_id) for item in value]
    if isinstance(value, str):
        if value.startswith(old_prefix):
            return new_prefix + value[len(old_prefix):]
        if value.startswith(legacy_old_prefix):
            return legacy_new_prefix + value[len(legacy_old_prefix):]
    return value


def remove_question_audio_files(question: dict[str, Any]) -> None:
    remove_audio_file(question.get("audio_path"))
    cache = question.get("audio_cache")
    if isinstance(cache, dict):
        for entry in cache.values():
            if isinstance(entry, dict):
                remove_audio_file(entry.get("audio_path"))


def progress_path(quiz_id: str) -> Path:
    if not QUIZ_ID_RE.match(quiz_id):
        abort(404)
    return PROGRESS_DIR / f"{quiz_id}.json"


def empty_progress(quiz_id: str) -> dict[str, Any]:
    return {"quizId": quiz_id, "current": {}, "attempts": [], "updatedAt": None}


def read_progress(quiz_id: str) -> dict[str, Any]:
    path = progress_path(quiz_id)
    if not path.exists():
        return empty_progress(quiz_id)
    progress = read_json(path)
    progress.setdefault("quizId", quiz_id)
    progress.setdefault("current", {})
    progress.setdefault("attempts", [])
    progress.setdefault("updatedAt", None)
    return progress


def write_progress(quiz_id: str, progress: dict[str, Any]) -> None:
    write_json(progress_path(quiz_id), progress)


def move_progress_file(old_quiz_id: str, new_quiz_id: str) -> None:
    if old_quiz_id == new_quiz_id:
        return
    old_path = progress_path(old_quiz_id)
    if not old_path.exists():
        return
    progress = read_json(old_path)
    progress["quizId"] = new_quiz_id
    progress["updatedAt"] = datetime.now(timezone.utc).isoformat()
    write_json(progress_path(new_quiz_id), progress)
    old_path.unlink(missing_ok=True)


def record_progress_entry(
    quiz_id: str, question: dict[str, Any],
    answer_payload: dict[str, Any], result: dict[str, Any],
) -> None:
    progress = read_progress(quiz_id)
    now = datetime.now(timezone.utc).isoformat()
    question_id = question["id"]
    entry = {
        "questionId": question_id,
        "kind": question_kind(question),
        "category": str(question.get("category") or ""),
        "typeBadge": str(question.get("typeBadge") or ""),
        **answer_payload,
        "grade": result,
        "status": "correct" if result.get("correct") else "wrong",
        "updatedAt": now,
    }
    progress["current"][str(question_id)] = entry
    progress["attempts"].append({**entry, "attemptNumber": len(progress["attempts"]) + 1})
    progress["attempts"] = progress["attempts"][-1000:]
    progress["updatedAt"] = now
    write_progress(quiz_id, progress)


def remove_question_progress(quiz_id: str, question_id: int) -> None:
    progress = read_progress(quiz_id)
    progress["current"].pop(str(question_id), None)
    progress["attempts"] = [
        attempt for attempt in progress.get("attempts", [])
        if attempt.get("questionId") != question_id
    ]
    progress["updatedAt"] = datetime.now(timezone.utc).isoformat()
    write_progress(quiz_id, progress)


# ------------------------------------------------------------ JSON importer
def strip_json_wrapper(text: str) -> str:
    cleaned = text.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, flags=re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    object_start = cleaned.find("{")
    object_end = cleaned.rfind("}")
    array_start = cleaned.find("[")
    array_end = cleaned.rfind("]")

    if object_start != -1 and object_end > object_start:
        return cleaned[object_start: object_end + 1]
    if array_start != -1 and array_end > array_start:
        return cleaned[array_start: array_end + 1]
    return cleaned


def repair_json_text(text: str) -> str:
    repaired = text.strip().lstrip("﻿")
    repaired = re.sub(r"^\s*(?:const|let|var)\s+\w+\s*=\s*", "", repaired)
    repaired = re.sub(r";\s*$", "", repaired)
    repaired = repaired.replace("“", '"').replace("”", '"')
    repaired = repaired.replace("‘", "'").replace("’", "'")
    repaired = re.sub(r"/\*[\s\S]*?\*/", "", repaired)
    repaired = re.sub(r"(^|[^:])//.*$", r"\1", repaired, flags=re.MULTILINE)
    repaired = re.sub(r",\s*([}\]])", r"\1", repaired)
    return repaired


def parse_pythonish_payload(text: str) -> Any:
    stripped = text.strip().lstrip("﻿").rstrip(";")
    candidates = [stripped]

    try:
        module = ast.parse(stripped)
    except SyntaxError:
        module = None
    if module:
        for node in module.body:
            if isinstance(node, ast.Assign):
                candidates.append(ast.unparse(node.value))
            elif isinstance(node, ast.Expr):
                candidates.append(ast.unparse(node.value))

    assignment_removed = re.sub(
        r"^\s*(?:questions_data|quiz|quiz_data|data|result|output)\s*=\s*",
        "", stripped,
    )
    if assignment_removed != stripped:
        candidates.append(assignment_removed)

    for candidate in candidates:
        candidate = candidate.strip()
        if not candidate:
            continue
        for wrapped in (candidate, f"[{candidate.strip().strip(',')}]"):
            try:
                return ast.literal_eval(wrapped)
            except (SyntaxError, ValueError):
                continue

    raise ValueError(
        "Could not parse this as JSON or Python-style question data. "
        "Include surrounding [...] or { \"questions\": [...] }."
    )


def parse_json_lenient(text: str) -> Any:
    cleaned = strip_json_wrapper(text)
    json_error: json.JSONDecodeError | None = None
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        json_error = exc

    repaired = repair_json_text(cleaned)
    try:
        return json.loads(repaired)
    except json.JSONDecodeError as exc:
        json_error = exc

    wrapped = f"[{repaired.strip().strip(',')}]"
    try:
        return json.loads(wrapped)
    except json.JSONDecodeError as exc:
        json_error = exc

    try:
        return parse_pythonish_payload(cleaned)
    except ValueError:
        if json_error:
            raise json_error
        raise


def unwrap_import_container(value: Any) -> Any:
    current = value
    for _ in range(4):
        if not isinstance(current, dict):
            return current
        if "questions" in current:
            return current
        for key in ("quiz", "quizData", "quiz_data", "data", "result", "output"):
            nested = current.get(key)
            if isinstance(nested, (dict, list)):
                current = nested
                break
        else:
            return current
    return current


def parse_import_payload(payload: Any, raw_body: str) -> Any:
    if isinstance(payload, dict):
        if "quiz" in payload:
            return unwrap_import_container(payload["quiz"])
        raw_text = payload.get("rawText") or payload.get("raw_text") or payload.get("json")
        if raw_text is not None:
            return unwrap_import_container(parse_json_lenient(str(raw_text)))
        if "questions" in payload:
            return payload
        unwrapped = unwrap_import_container(payload)
        if unwrapped is not payload:
            return unwrapped

    if isinstance(payload, list):
        return payload

    body = raw_body.strip()
    if not body:
        raise ValueError("Paste JSON quiz data first.")
    return unwrap_import_container(parse_json_lenient(body))


def coerce_string(value: Any, fallback: str = "") -> str:
    text = str(value or "").strip()
    return text or fallback


def coerce_list_of_strings(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value.strip()] if value.strip() else []
    if not isinstance(value, list):
        return [str(value).strip()] if str(value).strip() else []
    return [str(item).strip() for item in value if str(item).strip()]


def coerce_answer_groups(value: Any) -> list[list[str]]:
    if value is None:
        return []
    if isinstance(value, str):
        return [[value.strip()]] if value.strip() else []
    if not isinstance(value, list):
        text = str(value).strip()
        return [[text]] if text else []
    if not value:
        return []
    if all(not isinstance(item, list) for item in value):
        return [coerce_list_of_strings(value)]
    return [coerce_list_of_strings(group) for group in value]


def normalise_sentence_blanks(sentence: str) -> str:
    if re.search(r"\{\d+\}", sentence):
        return sentence
    if re.search(r"_{2,}", sentence):
        return re.sub(r"_{2,}", "{0}", sentence, count=1)
    for pattern in (r"\[(?:blank|gap|answer)\]", r"\((?:blank|gap|answer)\)"):
        if re.search(pattern, sentence, flags=re.IGNORECASE):
            return re.sub(pattern, "{0}", sentence, count=1, flags=re.IGNORECASE)
    return sentence


def blank_count_for_sentence(sentence: str) -> int:
    indexes = [int(match) for match in re.findall(r"\{(\d+)\}", sentence)]
    return max(indexes) + 1 if indexes else 0


def normalise_feedback(value: Any) -> dict[str, str]:
    if isinstance(value, str):
        value = {"natural": value}
    feedback = value if isinstance(value, dict) else {}
    return {
        "natural": coerce_string(
            feedback.get("natural") or feedback.get("explanation") or feedback.get("rationale"),
            "This answer is the most natural option in this context.",
        ),
        "alternatives": coerce_string(
            feedback.get("alternatives"),
            "Review the distractors and notice which meaning, register, or structure does not fit.",
        ),
        "chunk": coerce_string(
            feedback.get("chunk"),
            "Save the reusable expression or grammar pattern from this question.",
        ),
    }


def clean_rationale_prefix(value: str) -> str:
    return re.sub(r"^\s*(?:correct|incorrect)\s*[!:. -]*\s*", "", value.strip(), flags=re.IGNORECASE)


def first_sentence(value: str) -> str:
    text = clean_rationale_prefix(re.sub(r"\s+", " ", value))
    parts = re.split(r"(?<=[.!?])\s+", text)
    return parts[0].strip() if parts and parts[0].strip() else text


def short_takeaway_title(value: str) -> str:
    title = re.sub(r"\s+", " ", value).strip().strip(".")
    if len(title) > 48:
        title = title[:45].rstrip() + "..."
    return title or "Core expression"


def imported_choice_is_correct(choice: Any) -> bool:
    if not isinstance(choice, dict):
        return False
    for key in ("isCorrect", "is_correct", "correct"):
        if key in choice:
            value = choice[key]
            if isinstance(value, bool):
                return value
            return str(value).strip().lower() in {"true", "yes", "y", "1", "correct"}
    return False


def correct_choice_from_imported_flags(raw_question: dict[str, Any], choices: list[dict[str, str]]) -> str:
    for index, choice in enumerate(raw_choice_items(raw_question)):
        if imported_choice_is_correct(choice) and index < len(choices):
            return choices[index]["id"]
    return ""


def choice_feedback_from_rationales(
    choices: list[dict[str, str]], correct_id: str, hint: str = "",
) -> dict[str, str]:
    correct_choice = next((c for c in choices if c["id"] == correct_id), None)
    correct_text = correct_choice["text"] if correct_choice else correct_choice_text(
        {"choices": choices, "correctChoiceId": correct_id}
    )
    correct_rationale = choice_rationale(correct_choice) if correct_choice else ""
    incorrect_parts = [
        f"<strong>{html.escape(c['id'])}. {html.escape(c['text'])}</strong>: {html.escape(choice_rationale(c))}"
        for c in choices if c["id"] != correct_id and choice_rationale(c)
    ]
    chunk_hint = f" Hint: {html.escape(hint)}" if hint else ""
    return {
        "natural": (
            f"<strong>{html.escape(correct_text)}</strong> is the best answer. "
            f"{html.escape(clean_rationale_prefix(correct_rationale)) if correct_rationale else ''}"
        ).strip(),
        "alternatives": " ".join(incorrect_parts)
            or "Review the distractors and notice which meaning, register, or structure does not fit.",
        "chunk": (
            f"Practice <em>{html.escape(correct_text)}</em> as the reusable expression or grammar pattern here."
            f"{chunk_hint}"
        ),
    }


def choice_takeaway_from_rationale(
    choices: list[dict[str, str]], correct_id: str, fallback_title: str,
) -> dict[str, str]:
    correct_choice = next((c for c in choices if c["id"] == correct_id), None)
    correct_text = correct_choice["text"] if correct_choice else fallback_title
    rationale = first_sentence(choice_rationale(correct_choice)) if correct_choice else ""
    body = f'Use "{correct_text}" here.'
    if rationale:
        body = f"{body} {rationale}"
    return {"title": short_takeaway_title(correct_text), "body": body}


def normalise_takeaway(value: Any, fallback_title: str) -> dict[str, str]:
    takeaway = value if isinstance(value, dict) else {}
    title = coerce_string(takeaway.get("title"), fallback_title)[:120]
    body = coerce_string(
        takeaway.get("body"),
        "Review the best answer and reuse it in a similar real-life sentence.",
    )
    return {"title": title, "body": body}


def normalise_imported_choices(question: dict[str, Any], question_number: int) -> list[dict[str, str]]:
    choices = raw_choice_items(question)
    if not isinstance(choices, list) or len(choices) < 2:
        raise ValueError(
            f"Question {question_number} is a choice question but has no usable choices array."
        )
    normalised = []
    for index, choice in enumerate(choices):
        entry = {"id": choice_id(choice, index), "text": choice_text(choice)}
        rationale = choice_rationale(choice)
        if rationale:
            entry["rationale"] = rationale
        normalised.append(entry)
    if any(not c["text"] for c in normalised):
        raise ValueError(f"Question {question_number} has an empty choice text.")
    return normalised


def normalise_imported_question(
    raw_question: Any, question_number: int, default_kind: str,
) -> dict[str, Any]:
    if not isinstance(raw_question, dict):
        raise ValueError(f"Question {question_number} must be an object.")

    raw_kind = question_kind({**raw_question, "kind": raw_question.get("kind") or default_kind})
    category = coerce_string(raw_question.get("category"), "Practice")
    imported_feedback = raw_question.get("feedback")
    imported_takeaway = raw_question.get("takeaway")
    base = {
        "id": question_number,
        "kind": raw_kind,
        "icon": coerce_string(raw_question.get("icon"), "✦"),
        "category": category,
        "typeBadge": coerce_string(
            raw_question.get("typeBadge") or raw_question.get("type_badge"),
            "multiple-choice" if raw_kind == "choice" else "fill-in-blank",
        ),
        "situation": coerce_string(
            raw_question.get("situation") or raw_question.get("context"),
            "Choose the best answer for this learning context.",
        ),
        "feedback": normalise_feedback(imported_feedback),
        "takeaway": normalise_takeaway(imported_takeaway, category),
    }

    if raw_kind == "choice":
        prompt = coerce_string(
            raw_question.get("prompt") or raw_question.get("question") or raw_question.get("sentence")
        )
        if not prompt:
            raise ValueError(f"Question {question_number} is missing prompt.")
        choices = normalise_imported_choices(raw_question, question_number)
        correct_from_flags = correct_choice_from_imported_flags(raw_question, choices)
        has_correct_marker = any(
            key in raw_question for key in (
                "correctChoiceId", "correct_choice_id", "correctAnswer", "correct_answer",
                "answer", "answerId", "answer_id", "correctIndex", "correct_index",
            )
        ) or bool(correct_from_flags)
        if not has_correct_marker:
            raise ValueError(
                f"Question {question_number} is missing the correct answer."
            )
        correct_id = correct_from_flags or correct_choice_id({**raw_question, "choices": choices})
        if correct_id not in {c["id"] for c in choices}:
            correct_id = correct_choice_id({
                **raw_question, "choices": choices,
                "correctAnswer": raw_question.get("answer")
                    or raw_question.get("answerId") or raw_question.get("answer_id"),
            })
        if correct_id not in {c["id"] for c in choices}:
            raise ValueError(f"Question {question_number} has an unmatched correct answer.")
        if imported_feedback is None and any(choice_rationale(c) for c in choices):
            base["feedback"] = choice_feedback_from_rationales(
                choices, correct_id, coerce_string(raw_question.get("hint")),
            )
        if imported_takeaway is None and any(choice_rationale(c) for c in choices):
            base["takeaway"] = choice_takeaway_from_rationale(choices, correct_id, category)
        audio_text = coerce_string(
            raw_question.get("audioText") or raw_question.get("audio_text")
            or correct_choice_text({"choices": choices, "correctChoiceId": correct_id})
        )
        return {
            **base, "prompt": prompt, "choices": choices,
            "correctChoiceId": correct_id, "audioText": audio_text,
        }

    sentence = normalise_sentence_blanks(coerce_string(
        raw_question.get("sentence") or raw_question.get("prompt")
    ))
    if not sentence:
        raise ValueError(f"Question {question_number} is missing sentence.")
    blank_count = blank_count_for_sentence(sentence)
    if blank_count == 0:
        raise ValueError(
            f"Question {question_number} is a fill question but the sentence has no blank."
        )

    valid = coerce_answer_groups(
        raw_question.get("valid") or raw_question.get("acceptable")
        or raw_question.get("acceptedAnswers") or raw_question.get("accepted_answers")
        or raw_question.get("answers") or raw_question.get("answer")
        or raw_question.get("correctAnswer") or raw_question.get("correct_answer")
    )
    if len(valid) == 1 and blank_count > 1:
        valid = valid + [[] for _ in range(blank_count - 1)]
    if len(valid) != blank_count or any(not group for group in valid):
        raise ValueError(
            f"Question {question_number} needs one non-empty valid answer group per blank."
        )

    best = coerce_list_of_strings(
        raw_question.get("best") or raw_question.get("answer")
        or raw_question.get("correctAnswer") or raw_question.get("correct_answer")
    )
    if len(best) < blank_count:
        best = best + [group[0] for group in valid[len(best):]]
    best = best[:blank_count]

    hints = coerce_answer_groups(raw_question.get("hints") or raw_question.get("options"))
    if len(hints) < blank_count:
        hints = hints + [group[:4] for group in valid[len(hints):]]
    hints = [
        (group + [best[index]])[:4] if group else [best[index]]
        for index, group in enumerate(hints[:blank_count])
    ]

    return {**base, "sentence": sentence, "valid": valid, "best": best, "hints": hints}


def normalise_imported_quiz(raw_quiz: Any) -> dict[str, Any]:
    if isinstance(raw_quiz, list):
        raw_quiz = {"questions": raw_quiz}
    if not isinstance(raw_quiz, dict):
        raise ValueError("Imported quiz must be a JSON object.")

    questions = (
        raw_quiz.get("questions") or raw_quiz.get("items")
        or raw_quiz.get("quizQuestions") or raw_quiz.get("quiz_questions")
        or raw_quiz.get("questionData") or raw_quiz.get("question_data")
    )
    if not isinstance(questions, list) or not questions:
        raise ValueError('Imported quiz must include a non-empty "questions" array.')
    if len(questions) > 200:
        raise ValueError("Imported quiz is too large. Keep it under 200 questions.")

    default_kind = question_kind({"kind": raw_quiz.get("kind") or raw_quiz.get("quizType")})
    if not raw_quiz.get("kind") and questions:
        default_kind = question_kind(questions[0]) if isinstance(questions[0], dict) else "fill"

    language = normalise_language(
        raw_quiz.get("language") or raw_quiz.get("targetLanguage")
        or raw_quiz.get("languageName") or raw_quiz.get("target_language")
    )
    level = coerce_string(raw_quiz.get("level"), "B1-B2").upper()
    if level not in ALLOWED_LEVELS:
        raise ValueError(
            f'Unsupported level "{level}". Use one of: {", ".join(sorted(ALLOWED_LEVELS))}.'
        )

    title = coerce_string(
        raw_quiz.get("title"),
        f"{language_name(language)} {level} {'Choice' if default_kind == 'choice' else 'Fill'} Quiz",
    )
    subtitle = coerce_string(
        raw_quiz.get("subtitle"),
        f"{len(questions)} {level} {language_name(language)} questions",
    )
    description = coerce_string(
        raw_quiz.get("description"),
        f"Imported {language_name(language)} practice set.",
    )

    normalised_questions = [
        normalise_imported_question(q, index + 1, default_kind)
        for index, q in enumerate(questions)
    ]
    quiz_kind = infer_quiz_kind({"questions": normalised_questions})
    desired_id = raw_quiz.get("id") or f"{language}-{level.lower()}-{quiz_kind}-quiz"

    return {
        "id": slugify(desired_id),
        "kind": quiz_kind,
        "language": language,
        "languageName": language_name(language),
        "title": title,
        "subtitle": subtitle,
        "level": level,
        "description": description,
        "status": coerce_string(raw_quiz.get("status"), "ready"),
        "questions": normalised_questions,
    }


def add_quiz_to_index(quiz: dict[str, Any]) -> None:
    index = read_json(INDEX_PATH) if INDEX_PATH.exists() else {"quizzes": []}
    index["quizzes"] = [
        item for item in index.get("quizzes", []) if item.get("id") != quiz["id"]
    ]
    index["quizzes"].append({
        "id": quiz["id"], "title": quiz["title"], "subtitle": quiz["subtitle"],
        "level": quiz["level"], "language": quiz["language"], "kind": quiz["kind"],
        "status": quiz.get("status", "ready"), "order": next_quiz_order(index),
    })
    write_json(INDEX_PATH, index)


# Initialise data dirs lazily so the blueprint can be imported even when the
# Live-Spanish source folder is missing.
def _bootstrap():
    try:
        ensure_data_dirs()
    except Exception:
        pass


_bootstrap()


# ------------------------------------------------------------------- Routes
@bp.get("/quizzes")
def list_quizzes():
    return jsonify(quizzes_payload())


@bp.get("/tts/voices")
def list_tts_voices():
    return jsonify({
        "languages": [
            {
                "code": code, "name": cfg["name"],
                "defaultVoice": cfg["voices"][0]["id"], "voices": cfg["voices"],
            }
            for code, cfg in SUPPORTED_LANGUAGES.items()
        ]
    })


@bp.post("/quizzes/import")
def import_quiz():
    payload = request.get_json(silent=True)
    raw_body = request.get_data(as_text=True) if payload is None else ""

    try:
        imported = parse_import_payload(payload, raw_body)
        quiz = normalise_imported_quiz(imported)
        quiz["id"] = unique_quiz_id(quiz["id"])
        write_json(QUIZ_DIR / f"{quiz['id']}.json", quiz)
        add_quiz_to_index(quiz)
    except json.JSONDecodeError as exc:
        return jsonify({
            "error": (
                f"Could not parse JSON near line {exc.lineno}, column {exc.colno}: {exc.msg}."
            ),
            "hint": "Accepts { quiz: ... }, { quizData: ... }, an object with questions, or a raw list.",
        }), 400
    except ValueError as exc:
        return jsonify({"error": str(exc), "hint": "Check the question number named in the error first."}), 400

    return jsonify({"quiz": public_quiz(quiz), **quizzes_payload()})


@bp.get("/quizzes/<quiz_id>")
def get_quiz(quiz_id: str):
    quiz = read_json(quiz_path(quiz_id))
    return jsonify(public_quiz(quiz))


@bp.patch("/quizzes/<quiz_id>")
@bp.post("/quizzes/<quiz_id>/rename")
def rename_quiz(quiz_id: str):
    path = quiz_path(quiz_id)
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or payload.get("name") or "").strip()
    if not title:
        return jsonify({"error": "Quiz title cannot be empty."}), 400
    if len(title) > 120:
        return jsonify({"error": "Quiz title is too long. Keep it under 120 characters."}), 400

    quiz = read_json(path)
    new_id = unique_quiz_id_for_rename(title, quiz_id)
    new_path = QUIZ_DIR / f"{new_id}.json"
    if new_id != quiz_id and new_path.exists():
        return jsonify({"error": f'A quiz file named "{new_id}.json" already exists.'}), 409

    index = read_json(INDEX_PATH) if INDEX_PATH.exists() else {"quizzes": []}
    old_audio_dir = AUDIO_DIR / quiz_id
    new_audio_dir = AUDIO_DIR / new_id

    quiz["id"] = new_id
    quiz["title"] = title
    if new_id != quiz_id:
        quiz = retarget_audio_urls(quiz, quiz_id, new_id)
        if old_audio_dir.exists():
            if new_audio_dir.exists():
                return jsonify({"error": f'Audio folder "{new_id}" already exists.'}), 409
            old_audio_dir.rename(new_audio_dir)
        move_progress_file(quiz_id, new_id)
        write_json(new_path, quiz)
        path.unlink(missing_ok=True)
    else:
        write_json(path, quiz)

    found = False
    for item in index.get("quizzes", []):
        if item.get("id") == quiz_id:
            item["id"] = new_id
            item["title"] = title
            item["subtitle"] = quiz.get("subtitle", item.get("subtitle", ""))
            item["level"] = quiz.get("level", item.get("level", ""))
            item["language"] = quiz.get("language", item.get("language", DEFAULT_LANGUAGE))
            item["kind"] = quiz.get("kind") or quiz.get("quizType") or infer_quiz_kind(quiz)
            item["status"] = quiz.get("status", item.get("status", "ready"))
            found = True
            break
    if not found:
        index.setdefault("quizzes", []).append({
            "id": new_id, "title": title,
            "subtitle": quiz.get("subtitle", quiz.get("description", "")),
            "level": quiz.get("level", ""),
            "language": quiz.get("language", DEFAULT_LANGUAGE),
            "kind": quiz.get("kind") or quiz.get("quizType") or infer_quiz_kind(quiz),
            "status": quiz.get("status", "ready"), "order": next_quiz_order(index),
        })
    write_json(INDEX_PATH, index)

    return jsonify({"oldId": quiz_id, "quiz": public_quiz(quiz), **quizzes_payload()})


@bp.get("/quizzes/<quiz_id>/progress")
def get_quiz_progress(quiz_id: str):
    quiz_path(quiz_id)
    return jsonify(read_progress(quiz_id))


@bp.delete("/quizzes/<quiz_id>/progress/current")
def clear_current_progress(quiz_id: str):
    quiz_path(quiz_id)
    progress = read_progress(quiz_id)
    progress["current"] = {}
    progress["updatedAt"] = datetime.now(timezone.utc).isoformat()
    write_progress(quiz_id, progress)
    return jsonify(progress)


@bp.post("/quizzes/<quiz_id>/grade")
def grade_question(quiz_id: str):
    payload = request.get_json(silent=True) or {}
    question_id = payload.get("questionId")
    answers = payload.get("answers", [])

    if not isinstance(question_id, int):
        return jsonify({"error": "questionId must be an integer"}), 400
    if isinstance(answers, str):
        answers = [answers]
    if not isinstance(answers, list):
        return jsonify({"error": "answers must be a list of strings"}), 400

    quiz = read_json(quiz_path(quiz_id))
    question = find_question(quiz, question_id)
    if question_kind(question) == "choice":
        selected_choice_id = str(
            payload.get("choiceId") or payload.get("selectedChoiceId")
            or payload.get("answerId") or ""
        )
        if not selected_choice_id and isinstance(payload.get("choiceIndex"), int):
            choices = normalise_choices(question)
            index = payload["choiceIndex"]
            if 0 <= index < len(choices):
                selected_choice_id = choices[index]["id"]
        if not selected_choice_id:
            return jsonify({"error": "choiceId is required"}), 400

        correct_id = correct_choice_id(question)
        selected_text = ""
        for choice in normalise_choices(question):
            if choice["id"] == selected_choice_id:
                selected_text = choice["text"]
                break

        result = {
            "correct": selected_choice_id == correct_id,
            "selectedChoiceId": selected_choice_id,
            "selectedChoiceText": selected_text,
            "correctChoiceId": correct_id,
            "best": [correct_choice_text(question)],
            "feedback": question.get("feedback", {}),
        }
        choice_rationales = normalise_choice_rationales(question)
        if choice_rationales:
            result["choiceRationales"] = choice_rationales
        if payload.get("record", True) is not False:
            record_progress_entry(
                quiz_id, question,
                {"choiceId": selected_choice_id, "choiceText": selected_text},
                result,
            )
        return jsonify(result)

    valid = question.get("valid", [])
    answer_values = [str(a) for a in answers]

    blank_results = [
        is_blank_correct(answer_values[i] if i < len(answer_values) else "", valid_answers)
        for i, valid_answers in enumerate(valid)
    ]

    result = {
        "correct": bool(blank_results) and all(blank_results),
        "blankResults": blank_results,
        "best": question.get("best", []),
        "feedback": question.get("feedback", {}),
    }
    if payload.get("record", True) is not False:
        record_progress_entry(quiz_id, question, {"answers": answer_values}, result)
    return jsonify(result)


@bp.patch("/quizzes/<quiz_id>/questions/<int:question_id>/takeaway")
def update_takeaway(quiz_id: str, question_id: int):
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title", "")).strip()
    body = str(payload.get("body", "")).strip()

    if not title or not body:
        return jsonify({"error": "title and body are required"}), 400
    if len(title) > 120 or len(body) > 5000:
        return jsonify({"error": "takeaway is too long"}), 400

    path = quiz_path(quiz_id)
    quiz = read_json(path)
    question = find_question(quiz, question_id)
    question["takeaway"] = {"title": title, "body": body}
    write_json(path, quiz)
    return jsonify({"takeaway": question["takeaway"]})


@bp.post("/quizzes/<quiz_id>/questions/<int:question_id>/audio")
def create_question_audio(quiz_id: str, question_id: int):
    payload = request.get_json(silent=True) or {}
    path = quiz_path(quiz_id)
    quiz = read_json(path)
    quiz_language = normalise_language(quiz.get("language") or quiz.get("targetLanguage"))
    gender = str(payload.get("gender") or "female").strip().lower()
    if gender not in {"male", "female"}:
        gender = "male" if gender in {"m", "man", "男", "男声"} else "female"
    voice = str(payload.get("voice") or voice_for_language_gender(quiz_language, gender))
    if voice not in ALLOWED_VOICES:
        return jsonify({"error": "Unsupported voice"}), 400

    question = find_question(quiz, question_id)
    text = complete_sentence(question)
    audio_hash = hashlib.sha1(f"{voice}\n{text}".encode("utf-8")).hexdigest()[:12]
    audio_cache = question.get("audio_cache") if isinstance(question.get("audio_cache"), dict) else {}
    cached_entry = audio_cache.get(voice) if isinstance(audio_cache.get(voice), dict) else {}
    existing_path = audio_url_to_path(cached_entry.get("audio_path"))
    legacy_path = audio_url_to_path(question.get("audio_path"))

    if (
        cached_entry.get("audio_hash") == audio_hash
        and cached_entry.get("audio_voice") == voice
        and existing_path and audio_file_is_usable(existing_path)
    ):
        audio_path = cached_entry["audio_path"]
        if not audio_path.startswith("/audio/live-spanish/"):
            audio_path = audio_path.replace("/audio/", "/audio/live-spanish/", 1)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "audio_text": text, "voice": voice, "gender": gender,
            "language": quiz_language, "cached": True,
        })

    if (
        question.get("audio_hash") == audio_hash
        and question.get("audio_voice") == voice
        and legacy_path and audio_file_is_usable(legacy_path)
    ):
        audio_path = question["audio_path"]
        if not audio_path.startswith("/audio/live-spanish/"):
            audio_path = audio_path.replace("/audio/", "/audio/live-spanish/", 1)
        audio_cache[voice] = {
            "audio_path": audio_path, "audio_voice": voice,
            "audio_text": text, "audio_hash": audio_hash,
            "audio_language": quiz_language, "audio_gender": gender,
        }
        question["audio_cache"] = audio_cache
        write_json(path, quiz)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "audio_text": text, "voice": voice, "gender": gender,
            "language": quiz_language, "cached": True,
        })

    output_dir = AUDIO_DIR / quiz_id
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"q{question_id}-{audio_hash}.mp3"

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:
        return jsonify({
            "error": f"Could not generate audio with {voice}: {exc}. "
                     "Check that edge-tts is installed and this computer can reach Microsoft Edge TTS."
        }), 502

    audio_path = f"/audio/live-spanish/{quiz_id}/{output_path.name}"
    audio_cache[voice] = {
        "audio_path": audio_path, "audio_voice": voice,
        "audio_text": text, "audio_hash": audio_hash,
        "audio_language": quiz_language, "audio_gender": gender,
    }
    question["audio_cache"] = audio_cache
    question["audio_path"] = audio_path
    question["audio_voice"] = voice
    question["audio_text"] = text
    question["audio_hash"] = audio_hash
    question["audio_language"] = quiz_language
    question["audio_gender"] = gender
    write_json(path, quiz)

    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "audio_text": text, "voice": voice, "gender": gender,
        "language": quiz_language, "cached": False,
    })


@bp.delete("/quizzes/<quiz_id>/questions/<int:question_id>")
def delete_question(quiz_id: str, question_id: int):
    path = quiz_path(quiz_id)
    quiz = read_json(path)
    question_index = find_question_index(quiz, question_id)
    question = quiz["questions"].pop(question_index)
    remove_question_audio_files(question)
    write_json(path, quiz)
    remove_question_progress(quiz_id, question_id)
    return jsonify(public_quiz(quiz))


@bp.delete("/quizzes/<quiz_id>")
def delete_quiz(quiz_id: str):
    if not QUIZ_ID_RE.match(quiz_id):
        abort(404)
    path = QUIZ_DIR / f"{quiz_id}.json"
    index = read_json(INDEX_PATH) if INDEX_PATH.exists() else {"quizzes": []}
    original_count = len(index.get("quizzes", []))
    index["quizzes"] = [q for q in index.get("quizzes", []) if q.get("id") != quiz_id]

    if len(index["quizzes"]) == original_count and not path.exists():
        abort(404)

    path.unlink(missing_ok=True)
    shutil.rmtree(AUDIO_DIR / quiz_id, ignore_errors=True)
    progress_path(quiz_id).unlink(missing_ok=True)
    write_json(INDEX_PATH, index)
    return jsonify({"deleted": quiz_id, **quizzes_payload()})
