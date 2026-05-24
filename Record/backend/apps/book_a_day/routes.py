"""A Book a Day blueprint.

Mounted at ``/api/book-a-day``. Data lives in ``backend/data/ABookADay/``.

Each book is a folder ``<bookId>/`` containing:

* ``book.json`` - metadata + the editable Markdown sections (one-liner,
  synopsis, key points, mind map, quotes, notes, narration script).
* ``materials/`` - user-managed files (PDF, audio, mind map images, etc.).
  The app lists what's there and lets you open it; uploads/deletes happen
  through the OS file manager so nothing surprising is ever moved.

Shelves are a flat list defined in ``shelves.json`` and each book carries a
``shelfId``. Default shelves are reading-status oriented (want/reading/read/
skimmed/collection); they can be renamed or augmented freely.
"""

from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import secrets
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import ALLOWED_VOICES, default_voice_for_language, normalise_language, voices_for_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "ABookADay"
DATA_DIR = Path(os.environ.get("BOOK_A_DAY_DATA_DIR", DEFAULT_DATA_DIR))
AUDIO_DIR = DATA_DIR / "_audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
SHELVES_FILE = DATA_DIR / "shelves.json"

RESERVED_DIRS = {"_audio", "__pycache__"}
MATERIALS_DIRNAME = "materials"

DEFAULT_SHELVES = [
    {"id": "wantToRead", "name": "想读"},
    {"id": "reading", "name": "在读"},
    {"id": "read", "name": "已读"},
    {"id": "collection", "name": "收藏"},
]

SECTION_KEYS = ("oneLiner", "synopsis", "points", "mindmap", "quotes", "notes", "narration")

EMPTY_SECTIONS = {
    "oneLiner": "",
    "synopsis": "",
    "points": "",
    "mindmap": "",
    "quotes": "",
    "notes": "",
    "narration": "",
}

bp = Blueprint("book_a_day", __name__)


class BookError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(BookError)
def handle_error(error: BookError):
    return jsonify({"error": str(error)}), error.status_code


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _read_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return fallback


def _write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _safe_id(value: str, prefix: str) -> str:
    text = re.sub(r"[^A-Za-z0-9_-]+", "-", str(value or "").strip())
    text = re.sub(r"-+", "-", text).strip("-_")
    text = text[:60]
    return text or f"{prefix}-{secrets.token_hex(3)}"


def _new_book_id(title: str) -> str:
    base = _safe_id(title, "book").lower() or "book"
    existing = {p.name for p in DATA_DIR.iterdir() if p.is_dir()} if DATA_DIR.exists() else set()
    candidate = base
    index = 2
    while candidate in existing or candidate in RESERVED_DIRS:
        candidate = f"{base}-{index}"
        index += 1
    return candidate


def _book_dir(book_id: str) -> Path:
    safe = _safe_id(book_id, "book")
    if safe in RESERVED_DIRS:
        raise BookError("Invalid book id.")
    path = (DATA_DIR / safe).resolve()
    if DATA_DIR.resolve() not in path.parents:
        raise BookError("Invalid book path.")
    return path


def _book_file(book_id: str) -> Path:
    return _book_dir(book_id) / "book.json"


def _ensure_seed() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not SHELVES_FILE.exists():
        _write_json(SHELVES_FILE, DEFAULT_SHELVES)


def _load_shelves() -> list[dict[str, str]]:
    _ensure_seed()
    items = _read_json(SHELVES_FILE, DEFAULT_SHELVES)
    out: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in items if isinstance(items, list) else []:
        shelf_id = _safe_id(item.get("id") or item.get("name") or "", "shelf")
        if shelf_id in seen:
            continue
        seen.add(shelf_id)
        out.append({"id": shelf_id, "name": str(item.get("name") or shelf_id)[:80]})
    if not out:
        out = list(DEFAULT_SHELVES)
        _write_json(SHELVES_FILE, out)
    return out


def _shelf_exists(shelf_id: str) -> bool:
    return any(item["id"] == shelf_id for item in _load_shelves())


def _normalise_book(book_id: str, raw: dict[str, Any]) -> dict[str, Any]:
    sections_raw = raw.get("sections") if isinstance(raw.get("sections"), dict) else {}
    sections = {key: str(sections_raw.get(key) or "") for key in SECTION_KEYS}
    tags = raw.get("tags")
    if not isinstance(tags, list):
        tags = []
    return {
        "id": book_id,
        "shelfId": str(raw.get("shelfId") or "wantToRead"),
        "title": str(raw.get("title") or book_id),
        "author": str(raw.get("author") or ""),
        "originalTitle": str(raw.get("originalTitle") or ""),
        "year": str(raw.get("year") or ""),
        "language": str(raw.get("language") or "en"),
        "pages": str(raw.get("pages") or ""),
        "isbn": str(raw.get("isbn") or ""),
        "tags": [str(tag)[:40] for tag in tags if str(tag).strip()][:20],
        "rating": int(raw.get("rating") or 0),
        "startedAt": str(raw.get("startedAt") or "")[:10],
        "finishedAt": str(raw.get("finishedAt") or "")[:10],
        "myTake": str(raw.get("myTake") or "")[:500],
        "createdAt": str(raw.get("createdAt") or _now_iso()),
        "updatedAt": str(raw.get("updatedAt") or _now_iso()),
        "sections": sections,
    }


def _load_book(book_id: str) -> dict[str, Any]:
    path = _book_file(book_id)
    if not path.exists():
        raise BookError("Book not found.", 404)
    return _normalise_book(book_id, _read_json(path, {}))


def _save_book(book_id: str, data: dict[str, Any]) -> dict[str, Any]:
    normalised = _normalise_book(book_id, data)
    normalised["updatedAt"] = _now_iso()
    _write_json(_book_file(book_id), normalised)
    return normalised


def _book_summary(book: dict[str, Any]) -> dict[str, Any]:
    sections = book.get("sections", {}) or {}
    excerpt = (sections.get("oneLiner") or sections.get("synopsis") or "").strip()
    summary = {key: book[key] for key in (
        "id", "shelfId", "title", "author", "year", "language",
        "tags", "rating", "startedAt", "finishedAt", "myTake",
        "createdAt", "updatedAt",
    )}
    summary["excerpt"] = excerpt[:200]
    summary["hasNarration"] = bool(sections.get("narration", "").strip())
    return summary


def _list_books() -> list[dict[str, Any]]:
    _ensure_seed()
    out: list[dict[str, Any]] = []
    for entry in sorted(DATA_DIR.iterdir(), key=lambda p: p.name) if DATA_DIR.exists() else []:
        if not entry.is_dir() or entry.name in RESERVED_DIRS:
            continue
        book_file = entry / "book.json"
        if not book_file.exists():
            continue
        try:
            book = _normalise_book(entry.name, _read_json(book_file, {}))
        except Exception:
            continue
        out.append(_book_summary(book))
    out.sort(key=lambda item: item.get("updatedAt", ""), reverse=True)
    return out


@bp.route("/library", methods=["GET", "OPTIONS"])
def library():
    if request.method == "OPTIONS":
        return "", 204
    shelves = _load_shelves()
    books = _list_books()
    grouped: dict[str, list[dict[str, Any]]] = {shelf["id"]: [] for shelf in shelves}
    orphans: list[dict[str, Any]] = []
    for book in books:
        if book["shelfId"] in grouped:
            grouped[book["shelfId"]].append(book)
        else:
            orphans.append(book)
    response_shelves = [
        {**shelf, "books": grouped[shelf["id"]]} for shelf in shelves
    ]
    if orphans:
        response_shelves.append({"id": "_unfiled", "name": "未归类", "books": orphans})
    return jsonify({
        "shelves": response_shelves,
        "totalBooks": len(books),
    })


@bp.route("/shelves", methods=["POST", "OPTIONS"])
def create_shelf():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name") or "").strip()
    if not name:
        raise BookError("Shelf name is required.")
    shelves = _load_shelves()
    base = _safe_id(payload.get("id") or name, "shelf")
    existing = {item["id"] for item in shelves}
    shelf_id = base
    index = 2
    while shelf_id in existing:
        shelf_id = f"{base}-{index}"
        index += 1
    shelves.append({"id": shelf_id, "name": name[:80]})
    _write_json(SHELVES_FILE, shelves)
    return jsonify({"id": shelf_id, "name": name[:80], "books": []}), 201


@bp.route("/shelves/<shelf_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_shelf(shelf_id: str):
    if request.method == "OPTIONS":
        return "", 204
    shelves = _load_shelves()
    match = next((item for item in shelves if item["id"] == shelf_id), None)
    if not match:
        raise BookError("Shelf not found.", 404)
    if request.method == "DELETE":
        # Move books on this shelf to the first remaining shelf (or wantToRead).
        remaining = [item for item in shelves if item["id"] != shelf_id]
        fallback = remaining[0]["id"] if remaining else "wantToRead"
        for entry in DATA_DIR.iterdir() if DATA_DIR.exists() else []:
            if not entry.is_dir() or entry.name in RESERVED_DIRS:
                continue
            book_file = entry / "book.json"
            if not book_file.exists():
                continue
            data = _read_json(book_file, {})
            if data.get("shelfId") == shelf_id:
                data["shelfId"] = fallback
                _save_book(entry.name, data)
        _write_json(SHELVES_FILE, remaining if remaining else DEFAULT_SHELVES)
        return jsonify({"deletedId": shelf_id, "movedTo": fallback})
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name") or "").strip()
    if not name:
        raise BookError("Shelf name is required.")
    match["name"] = name[:80]
    _write_json(SHELVES_FILE, shelves)
    return jsonify(match)


@bp.route("/books", methods=["POST", "OPTIONS"])
def create_book():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or "").strip() or "未命名书籍"
    shelf_id = str(payload.get("shelfId") or "wantToRead")
    if not _shelf_exists(shelf_id):
        shelves = _load_shelves()
        shelf_id = shelves[0]["id"] if shelves else "wantToRead"
    book_id = _new_book_id(title)
    folder = _book_dir(book_id)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / MATERIALS_DIRNAME).mkdir(parents=True, exist_ok=True)
    now = _now_iso()
    data = {
        "shelfId": shelf_id,
        "title": title,
        "author": str(payload.get("author") or ""),
        "language": str(payload.get("language") or "en"),
        "createdAt": now,
        "updatedAt": now,
        "sections": dict(EMPTY_SECTIONS),
    }
    book = _save_book(book_id, data)
    return jsonify({"book": book}), 201


@bp.route("/books/<book_id>", methods=["GET", "PATCH", "DELETE", "OPTIONS"])
def book_detail(book_id: str):
    if request.method == "OPTIONS":
        return "", 204
    if request.method == "GET":
        return jsonify({"book": _load_book(book_id)})
    if request.method == "DELETE":
        folder = _book_dir(book_id)
        if not folder.exists():
            raise BookError("Book not found.", 404)
        shutil.rmtree(folder, ignore_errors=True)
        return jsonify({"deletedId": book_id})

    existing = _load_book(book_id)
    payload = request.get_json(silent=True) or {}
    merged = dict(existing)
    for key in (
        "shelfId", "title", "author", "originalTitle", "year", "language",
        "pages", "isbn", "rating", "startedAt", "finishedAt", "myTake",
    ):
        if key in payload:
            merged[key] = payload[key]
    if "tags" in payload and isinstance(payload["tags"], list):
        merged["tags"] = payload["tags"]
    if "sections" in payload and isinstance(payload["sections"], dict):
        sections = dict(existing.get("sections", EMPTY_SECTIONS))
        for key, value in payload["sections"].items():
            if key in SECTION_KEYS:
                sections[key] = str(value or "")
        merged["sections"] = sections
    if "shelfId" in payload and not _shelf_exists(str(payload["shelfId"])):
        raise BookError("Shelf not found.", 404)
    book = _save_book(book_id, merged)
    return jsonify({"book": book})


@bp.route("/books/<book_id>/materials", methods=["GET", "OPTIONS"])
def list_materials(book_id: str):
    if request.method == "OPTIONS":
        return "", 204
    folder = _book_dir(book_id) / MATERIALS_DIRNAME
    folder.mkdir(parents=True, exist_ok=True)
    items: list[dict[str, Any]] = []
    for entry in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
        if entry.name.startswith("."):
            continue
        stat = entry.stat()
        mime, _ = mimetypes.guess_type(entry.name)
        kind = "other"
        if entry.is_dir():
            kind = "folder"
        elif mime:
            if mime.startswith("audio/"):
                kind = "audio"
            elif mime.startswith("image/"):
                kind = "image"
            elif mime.startswith("video/"):
                kind = "video"
            elif mime == "application/pdf":
                kind = "pdf"
            elif mime.startswith("text/"):
                kind = "text"
        items.append({
            "name": entry.name,
            "size": stat.st_size if entry.is_file() else 0,
            "updatedAt": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
            "kind": kind,
            "mime": mime or "",
            "isDir": entry.is_dir(),
            "url": f"/files/book-a-day/{book_id}/{entry.name}" if entry.is_file() else "",
        })
    return jsonify({
        "bookId": book_id,
        "path": str(folder),
        "items": items,
    })


def _tts_cache_key(text: str, voice: str) -> str:
    payload = f"book-a-day-edge-tts-v1\n{voice}\n{text}"
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


def _tts_output_path(text: str, voice: str, language: str) -> tuple[str, Path]:
    cache_key = _tts_cache_key(text, voice)
    return cache_key, AUDIO_CACHE_DIR / language / voice / f"{cache_key}.mp3"


@bp.route("/tts/voices", methods=["GET", "OPTIONS"])
def tts_voices():
    if request.method == "OPTIONS":
        return "", 204
    language = normalise_language(request.args.get("language"), default="en")
    return jsonify({"language": language, "voices": voices_for_language(language), "engine": "edge-tts"})


@bp.route("/tts", methods=["POST", "OPTIONS"])
def create_tts_audio():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    text = re.sub(r"\s+", " ", str(payload.get("text") or "")).strip()
    if not text:
        raise BookError("Text is required.")
    if len(text) > 4500:
        raise BookError("Text is too long for one TTS request.")
    language = normalise_language(payload.get("language"), default="en")
    voice = str(payload.get("voice") or "").strip() or default_voice_for_language(language)
    if voice not in ALLOWED_VOICES:
        voice = default_voice_for_language(language)
    cache_key, output_path = _tts_output_path(text, voice, language)
    if audio_file_is_usable(output_path):
        return jsonify({
            "audio_url": f"/audio/book-a-day/edge-tts/{language}/{voice}/{cache_key}.mp3",
            "cached": True,
            "engine": "edge-tts",
            "language": language,
            "voice": voice,
        })
    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:  # noqa: BLE001
        raise BookError(f"Could not generate audio: {exc}", 500) from exc
    return jsonify({
        "audio_url": f"/audio/book-a-day/edge-tts/{language}/{voice}/{cache_key}.mp3",
        "cached": False,
        "engine": "edge-tts",
        "language": language,
        "voice": voice,
    })
