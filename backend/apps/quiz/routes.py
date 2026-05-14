"""Quiz for Jason blueprint.

Mounted at ``/api/quiz`` in the unified backend. The quiz data lives in the
original project folder by default; override with ``QUIZ_DATA_DIR``.
"""

from __future__ import annotations

import hashlib
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Quiz"
DATA_DIR = Path(os.environ.get("QUIZ_DATA_DIR", DEFAULT_DATA_DIR))
QUIZ_DIR = DATA_DIR / "quizzes"

bp = Blueprint("quiz", __name__)


class QuizError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def quiz_path(quiz_id: str) -> Path:
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", quiz_id):
        raise QuizError("Invalid quiz id.", 400)
    path = QUIZ_DIR / f"{quiz_id}.json"
    if not path.exists():
        raise QuizError("Quiz not found.", 404)
    return path


def load_quiz(quiz_id: str) -> dict[str, Any]:
    return read_json(quiz_path(quiz_id))


def natural_quiz_sort_key(path: Path) -> list[tuple[int, Any]]:
    key: list[tuple[int, Any]] = []
    for part in re.split(r"(\d+)", path.stem.casefold()):
        key.append((0, int(part)) if part.isdigit() else (1, part))
    return key


def list_quizzes() -> list[dict[str, Any]]:
    quizzes = []
    if not QUIZ_DIR.exists():
        return quizzes
    for path in sorted(QUIZ_DIR.glob("*.json"), key=natural_quiz_sort_key):
        quiz = read_json(path)
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


def stable_shuffle_words(words: list[str], seed_text: str, correct_sentence: str = "") -> list[str]:
    shuffled = list(words)
    if len(shuffled) < 2:
        return shuffled

    seed = int(hashlib.sha256(seed_text.encode("utf-8")).hexdigest()[:16], 16)
    for index in range(len(shuffled) - 1, 0, -1):
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        swap_index = seed % (index + 1)
        shuffled[index], shuffled[swap_index] = shuffled[swap_index], shuffled[index]

    if normalize_sentence(" ".join(shuffled)) == normalize_sentence(correct_sentence):
        shuffled = shuffled[1:] + shuffled[:1]
    return shuffled


def public_question(question: dict[str, Any]) -> dict[str, Any]:
    output = {
        "id": question["id"],
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
    if question["type"] == "wordorder":
        output["words"] = stable_shuffle_words(
            question.get("words", []),
            f"{question.get('id')}|{question.get('category')}|{question.get('correctSentence')}",
            question.get("correctSentence", ""),
        )
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
    raise QuizError("Question not found.", 404)


def normalize_sentence(value: str) -> str:
    value = re.sub(r"\s+([?.!,;:])", r"\1", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip().casefold()


def tidy_sentence(value: str) -> str:
    return re.sub(r"\s+([?.!,;:])", r"\1", value).strip()


def normalize_fill(value: str) -> str:
    value = re.sub(r"[.,!?]+$", "", value or "")
    value = re.sub(r"\s+", " ", value)
    return value.strip().casefold()


def grade_multiple_choice(question: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    options = question.get("options", [])
    try:
        answer_index = int(payload["answerIndex"])
    except (KeyError, TypeError, ValueError) as exc:
        raise QuizError("answerIndex is required for multiple choice questions.") from exc
    if answer_index < 0 or answer_index >= len(options):
        raise QuizError("answerIndex is outside the option range.")
    correct_index = int(question["correctIndex"])
    return {
        "answerIndex": answer_index,
        "answerText": options[answer_index],
        "correctIndex": correct_index,
        "correctText": options[correct_index],
        "correct": answer_index == correct_index,
    }


def grade_word_order(question: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    words = question.get("words", [])
    tokens = payload.get("answerTokens")
    answer_words = payload.get("answerWords")

    if isinstance(answer_words, list):
        selected_words = [str(word) for word in answer_words]
    elif isinstance(tokens, list):
        try:
            selected_words = [words[int(token)] for token in tokens]
        except (IndexError, TypeError, ValueError) as exc:
            raise QuizError("answerTokens contains an invalid word index.") from exc
    else:
        raise QuizError("answerWords is required for word order questions.")

    if len(selected_words) != len(words):
        raise QuizError("Use every word before checking the answer.")
    answer_text = tidy_sentence(" ".join(selected_words))
    correct_text = tidy_sentence(question["correctSentence"])
    return {
        "answerTokens": tokens if isinstance(tokens, list) else None,
        "answerText": answer_text,
        "correctText": correct_text,
        "correct": normalize_sentence(answer_text) == normalize_sentence(correct_text),
    }


def grade_fill(question: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    answer_text = str(payload.get("answerText", "")).strip()
    if not answer_text:
        raise QuizError("answerText is required for fill questions.")
    acceptable = question.get("acceptable") or [question["answer"]]
    normalized_answer = normalize_fill(answer_text)
    correct = any(normalize_fill(option) == normalized_answer for option in acceptable)
    return {
        "answerText": answer_text,
        "correctText": question["answer"],
        "correct": correct,
    }


@bp.errorhandler(QuizError)
def handle_quiz_error(error: QuizError):
    return jsonify({"error": str(error)}), error.status_code


@bp.get("/quizzes")
def api_quizzes():
    return jsonify({"quizzes": list_quizzes()})


@bp.get("/quizzes/<quiz_id>")
def api_quiz(quiz_id: str):
    return jsonify(public_quiz(load_quiz(quiz_id)))


@bp.route("/quizzes/<quiz_id>/grade", methods=["POST", "OPTIONS"])
def api_grade(quiz_id: str):
    if request.method == "OPTIONS":
        return ("", 204)
    payload = request.get_json(silent=True) or {}
    try:
        question_id = int(payload["questionId"])
    except (KeyError, TypeError, ValueError) as exc:
        raise QuizError("questionId is required.") from exc

    quiz = load_quiz(quiz_id)
    question = find_question(quiz, question_id)
    if question["type"] == "mc":
        result = grade_multiple_choice(question, payload)
    elif question["type"] == "wordorder":
        result = grade_word_order(question, payload)
    elif question["type"] == "fill":
        result = grade_fill(question, payload)
    else:
        raise QuizError("Unsupported question type.", 500)

    result.update({
        "questionId": question["id"],
        "category": question.get("category", "General"),
        "skill": question.get("skill", question.get("category", "General")),
        "type": question["type"],
        "explanation": question.get("explanation", ""),
        "answeredAt": datetime.now(timezone.utc).isoformat(),
    })
    return jsonify(result)
