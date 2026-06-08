"""Book In Depth blueprint.

Mounted at ``/api/book-in-depth``. Data lives in ``backend/data/BookInDepth/``.

Sibling of A Book a Day, but cut to the bone for *deep reading*:

* Only two writable sections per book: ``mindmap`` and ``narration``.
* No TTS, no materials browser — this app is for reading long-form summaries
  (~10,000 Chinese characters per book), not listening or filing.
* Same library / shelf / workflow model as A Book a Day so users keep a familiar
  navigation.
"""

from __future__ import annotations

import json
import os
import re
import secrets
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "BookInDepth"
DATA_DIR = Path(os.environ.get("BOOK_IN_DEPTH_DATA_DIR", DEFAULT_DATA_DIR))
SHELVES_FILE = DATA_DIR / "shelves.json"
QUEUE_FILE = DATA_DIR / "books_queue.xlsx"
TRIGGER_FILE = DATA_DIR / ".trigger"

RESERVED_DIRS = {"__pycache__"}

DEFAULT_SHELVES = [
    {"id": "wantToRead", "name": "想读"},
    {"id": "reading", "name": "在读"},
    {"id": "read", "name": "已读"},
    {"id": "collection", "name": "收藏"},
]

SECTION_KEYS = ("mindmap", "narration")
EMPTY_SECTIONS = {"mindmap": "", "narration": ""}

bp = Blueprint("book_in_depth", __name__)


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
        "language": str(raw.get("language") or "zh"),
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


def _word_count(text: str) -> int:
    """Rough length used by the UI ('about N characters'). Counts CJK chars +
    Latin words so both Chinese narrations and English ones look reasonable."""
    if not text:
        return 0
    cjk = len(re.findall(r"[㐀-鿿]", text))
    latin = len(re.findall(r"[A-Za-z]+", text))
    return cjk + latin


def _book_summary(book: dict[str, Any]) -> dict[str, Any]:
    sections = book.get("sections", {}) or {}
    narration = sections.get("narration") or ""
    excerpt = narration.strip()[:200]
    summary = {key: book[key] for key in (
        "id", "shelfId", "title", "author", "year", "language",
        "tags", "rating", "startedAt", "finishedAt", "myTake",
        "createdAt", "updatedAt",
    )}
    summary["excerpt"] = excerpt
    summary["narrationLength"] = _word_count(narration)
    summary["hasNarration"] = bool(narration.strip())
    summary["hasMindmap"] = bool((sections.get("mindmap") or "").strip())
    return summary


def _title_sort_key(title: str) -> tuple:
    """Build a sort key that puts Chinese titles in pinyin order.

    Used by both /library (book list) and the frontend secondary sort. The
    plain Unicode codepoint sort would put 「地球」 way after 「中文」 — useless
    when the user wants to find 「地球往事」 alphabetically. pypinyin gives us
    a proper alphabetical ordering for mixed Chinese/Latin titles.
    """
    s = str(title or "").strip()
    if not s:
        return ("zzz", "")
    try:
        from pypinyin import lazy_pinyin, Style  # type: ignore
        py = "".join(lazy_pinyin(s, style=Style.NORMAL))
        return (py.lower(), s)
    except ImportError:
        # Fallback: just lowercase. Won't sort Chinese properly but won't crash.
        return (s.lower(), s)


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
    # Sort by pinyin so users can find books alphabetically — 「地球往事」 lands
    # under D, not buried somewhere by recent updatedAt.
    out.sort(key=lambda item: _title_sort_key(item.get("title", "")))
    return out


def _load_queue() -> list[dict[str, Any]]:
    """Read books_queue.xlsx — returns list of row dicts.

    The queue is the user-editable source of truth for *what to read next*.
    The Claude autonomous loop reads this every few hours to find new pending
    rows. The frontend reads it via /queue to show status.
    Returns [] if the file doesn't exist or openpyxl isn't installed.
    """
    if not QUEUE_FILE.exists():
        return []
    try:
        import openpyxl  # type: ignore
    except ImportError:
        return []
    try:
        wb = openpyxl.load_workbook(QUEUE_FILE, data_only=True, read_only=True)
        ws = wb.active
        if ws is None:
            return []
        rows_iter = ws.iter_rows(values_only=True)
        headers_row = next(rows_iter, None)
        if not headers_row:
            return []
        # Map Chinese column headers → English keys for stable JSON
        key_map = {
            "序号": "seq",
            "中文标题": "title",
            "作者": "author",
            "原标题": "originalTitle",
            "年份": "year",
            "状态": "status",
            "添加日期": "addedAt",
            "完成日期": "completedAt",
            "book_id": "bookId",
            "备注": "notes",
        }
        cols = [key_map.get(str(h or "").strip(), str(h or "").strip()) for h in headers_row]
        out: list[dict[str, Any]] = []
        for row in rows_iter:
            if not row or all(cell is None or str(cell).strip() == "" for cell in row):
                continue
            entry: dict[str, Any] = {}
            for col_name, value in zip(cols, row):
                if not col_name:
                    continue
                entry[col_name] = "" if value is None else str(value).strip()
            if not entry.get("title"):
                continue
            out.append(entry)
        wb.close()
        return out
    except Exception:
        return []


@bp.route("/trigger", methods=["POST", "GET", "DELETE", "OPTIONS"])
def trigger():
    """Immediate-trigger flag for the queue scanner.

    The cron runs every 6 hours. If the user just added a row to the xlsx and
    doesn't want to wait, they click "立即生成" in the UI — the frontend POSTs
    here, which writes a small flag file. Claude (in the chat session) reads
    the flag on the next prompt and scans the queue immediately.

    GET → returns whether the flag is set and when (for the UI badge).
    POST → set the flag (frontend "立即生成" button).
    DELETE → clear the flag (Claude calls this after consuming it).
    """
    if request.method == "OPTIONS":
        return "", 204
    if request.method == "POST":
        TRIGGER_FILE.parent.mkdir(parents=True, exist_ok=True)
        TRIGGER_FILE.write_text(_now_iso(), encoding="utf-8")
        return jsonify({"triggered": True, "at": _now_iso()})
    if request.method == "DELETE":
        if TRIGGER_FILE.exists():
            TRIGGER_FILE.unlink()
        return jsonify({"cleared": True})
    # GET
    if TRIGGER_FILE.exists():
        try:
            stamp = TRIGGER_FILE.read_text(encoding="utf-8").strip()
        except Exception:
            stamp = ""
        return jsonify({"triggered": True, "at": stamp})
    return jsonify({"triggered": False, "at": ""})


@bp.route("/queue", methods=["GET", "OPTIONS"])
def queue():
    """Expose the books_queue.xlsx contents — read-only.

    The user edits the xlsx directly (Excel / WPS / Numbers). This endpoint
    just surfaces it for the frontend to show status.
    """
    if request.method == "OPTIONS":
        return "", 204
    items = _load_queue()
    # Summary counts so the frontend can show "5 pending / 3 done" at a glance.
    counts: dict[str, int] = {}
    for item in items:
        status = item.get("status") or "pending"
        counts[status] = counts.get(status, 0) + 1
    return jsonify({
        "items": items,
        "counts": counts,
        "total": len(items),
        "queueFile": str(QUEUE_FILE.name),
    })


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
    now = _now_iso()
    data = {
        "shelfId": shelf_id,
        "title": title,
        "author": str(payload.get("author") or ""),
        "language": str(payload.get("language") or "zh"),
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
