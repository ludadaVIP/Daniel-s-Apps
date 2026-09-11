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
PARAGRAPH_DATA_ROOT = DATA_ROOT / "cuv_paragraphs"

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

# Treat the New Testament epistles as the default "memorize set". This is
# deliberately Romans through Jude (21 books), leaving Revelation available
# in the picker without including it in a new Recall Bible session.
DEFAULT_BOOK_SETS: dict[str, list[str]] = {
    "esv": [
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
        "Ephesians", "Philippians", "Colossians",
        "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
        "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude",
    ],
    "cuv": [
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
        "Ephesians", "Philippians", "Colossians",
        "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
        "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude",
    ],
    "nvi": [
        "Romanos", "1 Corintios", "2 Corintios", "Gálatas",
        "Efesios", "Filipenses", "Colosenses",
        "1 Tesalonicenses", "2 Tesalonicenses",
        "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos",
        "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan",
        "Judas",
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


@lru_cache(maxsize=128)
def load_book_paragraphs(book: str) -> dict[str, Any]:
    """Return the CUV paragraph ranges for one New Testament book."""
    path = PARAGRAPH_DATA_ROOT / f"{book}.json"
    if not path.exists():
        return {}
    data = read_json(path)
    return data if isinstance(data, dict) else {}


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


def reference_for_verses(verse: dict[str, Any], verse_numbers: list[int]) -> str:
    """Build a reference for one or more selected verses in one chapter."""
    if len(verse_numbers) == 1:
        return reference(verse)
    is_contiguous = verse_numbers == list(range(verse_numbers[0], verse_numbers[-1] + 1))
    label = (
        f"{verse_numbers[0]}-{verse_numbers[-1]}"
        if is_contiguous
        else "+".join(str(number) for number in verse_numbers)
    )
    return f"{verse.get('book', '')} {verse.get('chapter', '')}:{label}".strip()


def parse_books_param(raw: str | None, fallback: list[str]) -> list[str]:
    if not raw:
        return fallback
    parsed = [item.strip() for item in raw.split(",") if item.strip()]
    return parsed or fallback


def parse_verse_numbers(raw: str | None) -> list[int]:
    """Return the supported verse numbers requested by the practice mode."""
    if not raw:
        return []
    numbers: list[int] = []
    for item in raw.split(","):
        try:
            number = int(item.strip())
        except ValueError:
            continue
        if number in {1, 2, 3} and number not in numbers:
            numbers.append(number)
    return [number for number in (1, 2, 3) if number in numbers]


def is_truthy_param(raw: str | None) -> bool:
    return (raw or "").strip().lower() in {"1", "true", "yes"}


def coerce_version(raw: str | None) -> str:
    codes = list_version_codes()
    if not codes:
        return ""
    requested = (raw or "").strip().lower()
    if requested in codes:
        return requested
    # Recall Bible starts in the Chinese Union Version when it is available.
    return "cuv" if "cuv" in codes else codes[0]


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
    requested_verses = parse_verse_numbers(request.args.get("verses"))
    # Keep the previous parameter working for bookmarked or older clients.
    if not requested_verses and is_truthy_param(request.args.get("firstVerse")):
        requested_verses = [1]
    paragraph_first = is_truthy_param(request.args.get("paragraphFirst"))

    if paragraph_first and version != "cuv":
        return jsonify({"error": "Paragraph mode is currently available for CUV only."}), 400
    if paragraph_first:
        candidate_books = [book for book in candidate_books if load_book_paragraphs(book)]
        if not candidate_books:
            return jsonify({"error": "No paragraph data found in the selected books."}), 404

    # Pick a book first, then a random verse inside that book. Two-stage
    # sampling keeps the per-request work cheap even when the Bible has
    # ~31000 verses.
    for _ in range(10):
        book = random.choice(candidate_books)
        verses = load_book_verses(version, book)
        if verses:
            if paragraph_first:
                verses_by_chapter: dict[int, dict[int, dict[str, Any]]] = {}
                for entry in verses:
                    chapter = int(entry.get("chapter") or 0)
                    verse_number = int(entry.get("verse") or 0)
                    verses_by_chapter.setdefault(chapter, {})[verse_number] = entry

                paragraph_map = load_book_paragraphs(book)
                chapter_segments: dict[int, list[dict[str, int]]] = {}
                for chapter_key, segments in (paragraph_map.get("chapters") or {}).items():
                    try:
                        chapter = int(chapter_key)
                    except (TypeError, ValueError):
                        continue
                    valid_segments = [
                        segment for segment in (segments if isinstance(segments, list) else [])
                        if isinstance(segment, dict)
                        and int(segment.get("start") or 0) in verses_by_chapter.get(chapter, {})
                    ]
                    if valid_segments:
                        chapter_segments[chapter] = valid_segments

                if not chapter_segments:
                    continue
                chapter = random.choice(list(chapter_segments))
                segment = random.choice(chapter_segments[chapter])
                start_verse = int(segment["start"])
                verse = verses_by_chapter[chapter][start_verse]
                payload = public_verse(verse, version)
                payload["paragraph"] = {
                    "start": start_verse,
                    "end": int(segment.get("end") or start_verse),
                }
                payload["reference"] = reference(payload)
                return jsonify(payload)
            elif requested_verses:
                verses_by_chapter: dict[int, dict[int, dict[str, Any]]] = {}
                for entry in verses:
                    chapter = int(entry.get("chapter") or 0)
                    verse_number = int(entry.get("verse") or 0)
                    if verse_number in requested_verses:
                        verses_by_chapter.setdefault(chapter, {})[verse_number] = entry

                eligible_chapters = [
                    chapter for chapter, chapter_verses in verses_by_chapter.items()
                    if all(number in chapter_verses for number in requested_verses)
                ]
                if not eligible_chapters:
                    continue

                chapter = random.choice(eligible_chapters)
                chapter_verses = verses_by_chapter[chapter]
                verse = chapter_verses[requested_verses[0]]
                if len(requested_verses) > 1:
                    selected_verses = [chapter_verses[number] for number in requested_verses]
                    payload = public_verse(verse, version)
                    payload["verseNumbers"] = requested_verses
                    if requested_verses == list(range(requested_verses[0], requested_verses[-1] + 1)):
                        payload["verseEnd"] = requested_verses[-1]
                    payload["text"] = "\n".join(
                        str(item.get("text") or "").strip() for item in selected_verses
                    ).strip()
                    payload["reference"] = reference_for_verses(payload, requested_verses)
                    return jsonify(payload)
            else:
                verse = random.choice(verses)
            payload = public_verse(verse, version)
            payload["reference"] = reference(payload)
            return jsonify(payload)

    return jsonify({"error": "Could not find any verse in the selected books."}), 404


@bp.get("/paragraph")
def specific_paragraph():
    """Return the CUV paragraph containing one exact verse."""
    version = coerce_version(request.args.get("version"))
    if not version:
        return jsonify({"error": "No Bible versions are available on disk."}), 404
    if version != "cuv":
        return jsonify({"error": "Paragraph mode is currently available for CUV only."}), 400

    book = request.args.get("book", "").strip()
    if not book:
        return jsonify({"error": "book is required."}), 400
    if book not in list_books_for(version):
        return jsonify({"error": f"Unknown book: {book}."}), 404

    try:
        chapter = int(request.args.get("chapter", "").strip())
        verse_num = int(request.args.get("verse", "").strip())
    except ValueError:
        return jsonify({"error": "chapter and verse must be integers."}), 400

    paragraph_map = load_book_paragraphs(book)
    segments = (paragraph_map.get("chapters") or {}).get(str(chapter), [])
    segment = next(
        (
            item
            for item in segments
            if int(item.get("start") or 0) <= verse_num <= int(item.get("end") or 0)
        ),
        None,
    )
    if not segment:
        return jsonify({"error": f"{book} {chapter}:{verse_num} has no paragraph data."}), 404

    start = int(segment["start"])
    end = int(segment["end"])
    verses = load_book_verses(version, book)
    selected = [
        entry
        for entry in verses
        if int(entry.get("chapter") or 0) == chapter
        and start <= int(entry.get("verse") or 0) <= end
    ]
    selected.sort(key=lambda item: int(item.get("verse") or 0))
    if not selected:
        return jsonify({"error": f"{book} {chapter}:{verse_num} not found."}), 404

    return jsonify({
        "version": version,
        "book": book,
        "chapter": chapter,
        "startVerse": start,
        "endVerse": end,
        "verseNumbers": [int(item.get("verse") or 0) for item in selected],
        "reference": f"{book} {chapter}:{start}-{end}" if start != end else f"{book} {chapter}:{start}",
        "text": "\n".join(str(item.get("text") or "").strip() for item in selected).strip(),
    })


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
