"""Bible Memorizer blueprint.

Mounted at ``/api/bible`` in the unified backend. Reads flattened
per-book JSON files from ``backend/data/Bible/<version>_data/<Book>.json``.

The original standalone app was Flask + MySQL with two endpoints
(``/get_verse`` for the "memorize the text from the reference" mode and
``/get_random_verse_content`` for the "guess the reference from the
text" mode). This rewrite collapses both into a single
``/api/bible/random`` that returns the whole verse — the React frontend
decides what to hide.

Bible JSON format
-----------------
Each file is a flat array of verse objects::

    [
      {"book": "Romans", "chapter": 1, "verse": 1, "text": "..."},
      ...
    ]

Available versions live as ``<version>_data/`` folders. Drop a new folder
in (e.g. ``niv_data/``) and the API will pick it up automatically.
"""

from __future__ import annotations

import os
import random
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json


DEFAULT_DATA_ROOT = Path(__file__).resolve().parents[2] / "data" / "Bible"
DATA_ROOT = Path(os.environ.get("BIBLE_DATA_DIR", DEFAULT_DATA_ROOT))

# Human-friendly metadata for each version folder. Anything not listed
# here still works — it'll show up with auto-generated label and lang
# derived from the folder name.
VERSION_META: dict[str, dict[str, str]] = {
    "cuv": {
        "label": "中文和合本",
        "shortLabel": "CUV",
        "language": "zh",
        "languageName": "Chinese",
        "description": "Chinese Union Version (和合本)",
    },
    "esv": {
        "label": "English Standard Version",
        "shortLabel": "ESV",
        "language": "en",
        "languageName": "English",
        "description": "English Standard Version",
    },
    "nvi": {
        "label": "Nueva Versión Internacional",
        "shortLabel": "NVI",
        "language": "es",
        "languageName": "Spanish",
        "description": "Nueva Versión Internacional (Spanish)",
    },
}

# Canonical 66-book ordering, used to sort book lists deterministically.
# Books not in this map are pushed to the end alphabetically.
CANONICAL_ORDER = {
    name: index
    for index, name in enumerate([
        # Old Testament
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
        "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
        "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Psalm",
        "Proverbs", "Ecclesiastes", "Song of Solomon",
        "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
        "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
        "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
        # New Testament
        "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
        "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
        "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
        "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude", "Revelation",
    ])
}

# Treat the New Testament epistles + Revelation as the default "memorize
# set" so the experience matches the original standalone app, which
# rotated through Paul's letters, the general epistles, and Revelation.
DEFAULT_BOOK_SETS: dict[str, list[str]] = {
    "esv": [
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
        "Ephesians", "Philippians", "Colossians",
        "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
        "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude", "Revelation",
    ],
    "cuv": [
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
        "Ephesians", "Philippians", "Colossians",
        "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
        "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude", "Revelation",
    ],
    "nvi": [
        "Romanos", "1 Corintios", "2 Corintios", "Gálatas",
        "Efesios", "Filipenses", "Colosenses",
        "1 Tesalonicenses", "2 Tesalonicenses",
        "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos",
        "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan",
        "Judas", "Apocalipsis",
    ],
}


bp = Blueprint("bible", __name__)


def list_version_codes() -> list[str]:
    """Return every ``<code>_data`` folder found under DATA_ROOT."""
    if not DATA_ROOT.exists():
        return []
    codes: list[str] = []
    for entry in sorted(DATA_ROOT.iterdir()):
        if not entry.is_dir():
            continue
        match = re.fullmatch(r"(?P<code>[a-z0-9]+)_data", entry.name, re.IGNORECASE)
        if match:
            codes.append(match.group("code").lower())
    return codes


def version_folder(code: str) -> Path:
    return DATA_ROOT / f"{code}_data"


def version_payload(code: str) -> dict[str, Any]:
    meta = VERSION_META.get(code, {})
    return {
        "code": code,
        "label": meta.get("label", code.upper()),
        "shortLabel": meta.get("shortLabel", code.upper()),
        "language": meta.get("language", ""),
        "languageName": meta.get("languageName", ""),
        "description": meta.get("description", ""),
    }


def book_sort_key(name: str) -> tuple[int, str]:
    """Order known canonical books by their canonical index, others last."""
    return (CANONICAL_ORDER.get(name, 9999), name.casefold())


def list_books_for(code: str) -> list[str]:
    folder = version_folder(code)
    if not folder.exists():
        return []
    books = [path.stem for path in folder.glob("*.json")]
    books.sort(key=book_sort_key)
    return books


@lru_cache(maxsize=512)
def load_book_verses(code: str, book: str) -> list[dict[str, Any]]:
    """Return every verse in <version>/<book>.json. Cached so repeated
    random picks don't re-read the file on every request."""
    path = version_folder(code) / f"{book}.json"
    if not path.exists():
        return []
    data = read_json(path)
    return data if isinstance(data, list) else []


def public_verse(verse: dict[str, Any], version_code: str) -> dict[str, Any]:
    """Strip to the fields the UI cares about."""
    return {
        "version": version_code,
        "book": str(verse.get("book") or ""),
        "chapter": int(verse.get("chapter") or 0),
        "verse": int(verse.get("verse") or 0),
        "text": str(verse.get("text") or "").strip(),
    }


def reference(verse: dict[str, Any]) -> str:
    """Build a `Book chapter:verse` string."""
    return f"{verse.get('book', '')} {verse.get('chapter', '')}:{verse.get('verse', '')}".strip()


def parse_books_param(raw: str | None, fallback: list[str]) -> list[str]:
    if not raw:
        return fallback
    parsed = [item.strip() for item in raw.split(",") if item.strip()]
    return parsed or fallback


def coerce_version(raw: str | None) -> str:
    codes = list_version_codes()
    if not codes:
        return ""
    requested = (raw or "").strip().lower()
    if requested in codes:
        return requested
    # Sensible default: ESV if present, otherwise the first folder we found.
    return "esv" if "esv" in codes else codes[0]


# --------------------------------------------------------------- Routes ----

@bp.get("/versions")
def list_versions():
    codes = list_version_codes()
    return jsonify({
        "versions": [version_payload(code) for code in codes],
        "defaultVersion": coerce_version(None),
        "defaultBookSets": {
            code: DEFAULT_BOOK_SETS.get(code, []) for code in codes
        },
    })


@bp.get("/books")
def list_books():
    version = coerce_version(request.args.get("version"))
    if not version:
        return jsonify({"error": "No Bible versions are available on disk."}), 404
    books = list_books_for(version)
    default_books = [book for book in DEFAULT_BOOK_SETS.get(version, []) if book in books]
    return jsonify({
        "version": version,
        "books": books,
        "defaultBooks": default_books,
    })


@bp.get("/random")
def random_verse():
    version = coerce_version(request.args.get("version"))
    if not version:
        return jsonify({"error": "No Bible versions are available on disk."}), 404

    all_books = list_books_for(version)
    if not all_books:
        return jsonify({"error": f"No book files found for version {version}."}), 404

    requested_books = parse_books_param(
        request.args.get("books"),
        DEFAULT_BOOK_SETS.get(version, all_books),
    )
    candidate_books = [book for book in requested_books if book in all_books] or all_books

    # Pick a book first, then a random verse inside that book. Two-stage
    # sampling keeps the per-request work cheap even when the Bible has
    # ~31000 verses.
    for _ in range(10):
        book = random.choice(candidate_books)
        verses = load_book_verses(version, book)
        if verses:
            verse = random.choice(verses)
            payload = public_verse(verse, version)
            payload["reference"] = reference(payload)
            return jsonify(payload)

    return jsonify({"error": "Could not find any verse in the selected books."}), 404


@bp.get("/verse")
def specific_verse():
    """Look up one exact verse — useful for the parallel-version view."""
    version = coerce_version(request.args.get("version"))
    if not version:
        return jsonify({"error": "No Bible versions are available on disk."}), 404
    book = request.args.get("book", "").strip()
    try:
        chapter = int(request.args.get("chapter", "").strip())
        verse_num = int(request.args.get("verse", "").strip())
    except ValueError:
        return jsonify({"error": "chapter and verse must be integers."}), 400
    if not book:
        return jsonify({"error": "book is required."}), 400

    verses = load_book_verses(version, book)
    if not verses:
        return jsonify({"error": f"{book} not found in {version}."}), 404
    for entry in verses:
        if int(entry.get("chapter") or 0) == chapter and int(entry.get("verse") or 0) == verse_num:
            payload = public_verse(entry, version)
            payload["reference"] = reference(payload)
            return jsonify(payload)
    return jsonify({"error": f"{book} {chapter}:{verse_num} not found in {version}."}), 404
