"""Small, local-first calendar note API."""

from __future__ import annotations

import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Calendar"
DATA_DIR = Path(os.environ.get("CALENDAR_DATA_DIR", DEFAULT_DATA_DIR))
LEGACY_DATA_FILE = DATA_DIR / "notes.json"
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
MONTH_FILE_PATTERN = re.compile(r"^\d{4}-\d{2}\.json$")
MAX_NOTES_PER_DAY = 5
MAX_TITLE_LENGTH = 120
MAX_DETAIL_LENGTH = 8000

bp = Blueprint("calendar", __name__)


class CalendarError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(CalendarError)
def handle_error(error: CalendarError):
    return jsonify({"error": str(error)}), error.status_code


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _valid_date(value: Any) -> str:
    date = str(value or "").strip()
    if not DATE_PATTERN.fullmatch(date):
        raise CalendarError("日期格式应为 YYYY-MM-DD。")
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError as exc:
        raise CalendarError("日期无效。") from exc
    return date


def _normalise_note(note: Any) -> dict[str, str] | None:
    if not isinstance(note, dict):
        return None
    note_id = str(note.get("id") or "").strip()
    title = str(note.get("title") or "").strip()[:MAX_TITLE_LENGTH]
    if not note_id or not title:
        return None
    return {
        "id": note_id,
        "title": title,
        "detail": str(note.get("detail") or "").strip()[:MAX_DETAIL_LENGTH],
        "createdAt": str(note.get("createdAt") or ""),
        "updatedAt": str(note.get("updatedAt") or ""),
    }


def _month_key(date: str) -> str:
    return date[:7]


def _month_file(month: str) -> Path:
    return DATA_DIR / f"{month}.json"


def _clean_notes(raw: Any) -> dict[str, list[dict[str, str]]]:
    if not isinstance(raw, dict):
        return {}
    notes: dict[str, list[dict[str, str]]] = {}
    for date, entries in raw.items():
        try:
            valid_date = _valid_date(date)
        except CalendarError:
            continue
        if not isinstance(entries, list):
            continue
        clean = [item for item in (_normalise_note(entry) for entry in entries) if item]
        if clean:
            notes[valid_date] = clean[:MAX_NOTES_PER_DAY]
    return notes


def _month_files() -> list[Path]:
    if not DATA_DIR.exists():
        return []
    return sorted(
        (path for path in DATA_DIR.glob("*.json") if MONTH_FILE_PATTERN.fullmatch(path.name)),
        key=lambda path: path.name,
    )


def _migrate_legacy_notes() -> None:
    """Move the original single-file store into monthly files once, if needed."""
    if _month_files() or not LEGACY_DATA_FILE.exists():
        return
    legacy_notes = _clean_notes(read_json(LEGACY_DATA_FILE, {}))
    if not legacy_notes:
        return
    for month in sorted({_month_key(date) for date in legacy_notes}):
        monthly_notes = {date: entries for date, entries in legacy_notes.items() if _month_key(date) == month}
        write_json(_month_file(month), monthly_notes)
    # The data now lives in its month files. Leave a harmless empty marker so
    # an interrupted or older installation cannot import it again.
    write_json(LEGACY_DATA_FILE, {})


def _load_notes() -> dict[str, list[dict[str, str]]]:
    _migrate_legacy_notes()
    notes: dict[str, list[dict[str, str]]] = {}
    for path in _month_files():
        notes.update(_clean_notes(read_json(path, {})))
    return notes


def _save_month(month: str, all_notes: dict[str, list[dict[str, str]]]) -> None:
    monthly_notes = {date: entries for date, entries in all_notes.items() if _month_key(date) == month}
    target = _month_file(month)
    if monthly_notes:
        write_json(target, monthly_notes)
    elif target.exists():
        target.unlink()


def _response(notes: dict[str, list[dict[str, str]]]):
    return jsonify({"notes": notes, "maxNotesPerDay": MAX_NOTES_PER_DAY})


@bp.route("/notes", methods=["GET", "OPTIONS"])
def get_notes():
    if request.method == "OPTIONS":
        return "", 204
    return _response(_load_notes())


@bp.route("/notes", methods=["POST", "OPTIONS"])
def create_note():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    date = _valid_date(payload.get("date"))
    title = str(payload.get("title") or "").strip()
    if not title:
        raise CalendarError("请写下一件事。")
    if len(title) > MAX_TITLE_LENGTH:
        raise CalendarError(f"标题最多 {MAX_TITLE_LENGTH} 个字符。")
    detail = str(payload.get("detail") or "").strip()
    if len(detail) > MAX_DETAIL_LENGTH:
        raise CalendarError("详情内容过长。")
    notes = _load_notes()
    entries = notes.setdefault(date, [])
    if len(entries) >= MAX_NOTES_PER_DAY:
        raise CalendarError(f"每天最多记录 {MAX_NOTES_PER_DAY} 件事。")
    now = _now()
    note = {"id": uuid.uuid4().hex, "title": title, "detail": detail, "createdAt": now, "updatedAt": now}
    entries.append(note)
    _save_month(_month_key(date), notes)
    return jsonify({"note": note, "notes": _load_notes()}), 201


@bp.route("/notes/<note_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_note(note_id: str):
    if request.method == "OPTIONS":
        return "", 204
    notes = _load_notes()
    location: tuple[str, int] | None = None
    for date, entries in notes.items():
        index = next((idx for idx, note in enumerate(entries) if note["id"] == note_id), None)
        if index is not None:
            location = (date, index)
            break
    if location is None:
        raise CalendarError("这条记录不存在。", 404)
    date, index = location
    if request.method == "DELETE":
        notes[date].pop(index)
        if not notes[date]:
            del notes[date]
        _save_month(_month_key(date), notes)
        return jsonify({"deletedId": note_id, "notes": _load_notes()})

    payload = request.get_json(silent=True) or {}
    note = notes[date][index]
    title = str(payload.get("title", note["title"]) or "").strip()
    if not title:
        raise CalendarError("请写下一件事。")
    if len(title) > MAX_TITLE_LENGTH:
        raise CalendarError(f"标题最多 {MAX_TITLE_LENGTH} 个字符。")
    detail = str(payload.get("detail", note["detail"]) or "").strip()
    if len(detail) > MAX_DETAIL_LENGTH:
        raise CalendarError("详情内容过长。")
    note.update({"title": title, "detail": detail, "updatedAt": _now()})
    _save_month(_month_key(date), notes)
    return jsonify({"note": note, "notes": _load_notes()})


@bp.route("/search", methods=["GET", "OPTIONS"])
def search_notes():
    if request.method == "OPTIONS":
        return "", 204
    query = re.sub(r"\s+", " ", str(request.args.get("q") or "").strip()).casefold()
    if not query:
        return jsonify({"query": "", "results": []})
    results = []
    for date, entries in sorted(_load_notes().items(), reverse=True):
        for note in entries:
            haystack = f"{date}\n{note['title']}\n{note['detail']}".casefold()
            if query in haystack:
                results.append({"date": date, "note": note})
    return jsonify({"query": query, "results": results[:100]})
