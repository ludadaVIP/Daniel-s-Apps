"""Materialize Hebrews 9–13 study notes as reviewable chapter JSON files.

Run from the repository root with ``python backend/scripts/seed_hebrews_notes.py``.
The generator is the same verse-aware source used during authoring; this
script deliberately writes ordinary BibleLang chapter files so content is
inspectable, versionable, and served without a runtime fallback.
"""

from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
sys.path.insert(0, str(BACKEND))

from apps.bible_lang.routes import (  # noqa: E402
    DATA_DIR,
    clean_verse_text,
    filter_chapter,
    generated_hebrews_note,
    load_verses,
)
from shared.io import write_json  # noqa: E402


def main() -> None:
    notes_dir = DATA_DIR / "en" / "Hebrews"
    notes_dir.mkdir(parents=True, exist_ok=True)
    for chapter in range(9, 14):
        notes = {
            str(int(verse["verse"])): generated_hebrews_note(
                chapter,
                int(verse["verse"]),
                clean_verse_text(str(verse.get("text") or "")),
            )
            for verse in filter_chapter(load_verses("esv", "Hebrews"), chapter)
        }
        write_json(notes_dir / f"{chapter}.json", notes)
        print(f"Hebrews {chapter}: wrote {len(notes)} notes")


if __name__ == "__main__":
    main()
