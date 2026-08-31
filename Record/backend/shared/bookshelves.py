"""One shared bookshelf catalogue for the reading apps.

The two apps keep their book folders separate because their content formats are
different, but shelf definitions are a user-level concern.  This module keeps
that catalogue in one file and performs a one-time, non-destructive merge of
the two former per-app shelf files when upgrading.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DATA_ROOT = Path(__file__).resolve().parents[1] / "data"
SHARED_SHELVES_FILE = Path(
    os.environ.get("BOOK_SHELVES_FILE", DATA_ROOT / "BookShelves" / "shelves.json")
)

SHELF_GROUPS = ("pre", "reading", "finished", "post")
DEFAULT_GROUP = "pre"
DEFAULT_SHELVES = [
    {"id": "wantToRead", "name": "想读", "group": "pre"},
    {"id": "spirit", "name": "属灵", "group": "pre"},
    {"id": "culture", "name": "文化", "group": "pre"},
    {"id": "investment", "name": "投资", "group": "pre"},
    {"id": "reading", "name": "在读", "group": "reading"},
    {"id": "read", "name": "已读", "group": "finished"},
    {"id": "collection", "name": "收藏", "group": "post"},
    {"id": "revisit", "name": "回看", "group": "post"},
    {"id": "archive", "name": "存档", "group": "post"},
    {"id": "shallow", "name": "浅显", "group": "post"},
    {"id": "deep", "name": "深奥", "group": "post"},
    {"id": "monthly", "name": "月读", "group": "post"},
]
DEFAULT_GROUP_BY_ID = {shelf["id"]: shelf["group"] for shelf in DEFAULT_SHELVES}


def _read_list(path: Path) -> list[dict[str, Any]]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []


def legacy_shelves() -> list[dict[str, Any]]:
    """Merge former app-local shelf files, preserving first occurrence/order."""
    legacy_paths = (
        Path(os.environ.get("BOOK_A_DAY_DATA_DIR", DATA_ROOT / "ABookADay")) / "shelves.json",
        Path(os.environ.get("BOOK_IN_DEPTH_DATA_DIR", DATA_ROOT / "BookInDepth")) / "shelves.json",
    )
    merged: list[dict[str, Any]] = []
    seen: set[str] = set()
    for path in legacy_paths:
        for item in _read_list(path):
            shelf_id = str(item.get("id") or item.get("name") or "").strip()
            if not shelf_id or shelf_id in seen:
                continue
            merged.append(item)
            seen.add(shelf_id)
    return merged


def reassign_books_from_shelf(shelf_id: str, destination_shelf_id: str) -> None:
    """Move references in both book stores without touching their content schema."""
    data_dirs = (
        Path(os.environ.get("BOOK_A_DAY_DATA_DIR", DATA_ROOT / "ABookADay")),
        Path(os.environ.get("BOOK_IN_DEPTH_DATA_DIR", DATA_ROOT / "BookInDepth")),
    )
    updated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    for data_dir in data_dirs:
        if not data_dir.exists():
            continue
        for entry in data_dir.iterdir():
            if not entry.is_dir() or entry.name.startswith("_"):
                continue
            book_file = entry / "book.json"
            if not book_file.exists():
                continue
            try:
                book = json.loads(book_file.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                continue
            if not isinstance(book, dict) or book.get("shelfId") != shelf_id:
                continue
            book["shelfId"] = destination_shelf_id
            book["updatedAt"] = updated_at
            book_file.write_text(json.dumps(book, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
