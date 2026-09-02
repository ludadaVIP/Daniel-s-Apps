"""Quality gate for the completed Koine Greek course levels.

Run from the repository root:
    python backend/scripts/verify_koine_greek_course.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "data" / "KoineGreek"
LESSONS = ROOT / "lessons"
EXPECTED = {
    "foundation": 36,
    "a1-core": 42,
    "a2-bridge": 36,
    "a2-core": 42,
    "b1-bridge": 36,
    "b1-core": 42,
}
LATIN = re.compile(r"[A-Za-z]")


def fail(message: str) -> None:
    raise AssertionError(message)


def main() -> None:
    library = json.loads((ROOT / "library.json").read_text(encoding="utf-8"))
    for level, expected_count in EXPECTED.items():
        entries = [entry for entry in library["lessons"] if entry["levelId"] == level]
        if len(entries) != expected_count:
            fail(f"{level}: expected {expected_count} indexed lessons, found {len(entries)}")

        for entry in entries:
            path = LESSONS / f"{entry['id']}.json"
            if not path.is_file():
                fail(f"{entry['id']}: missing lesson file")
            lesson = json.loads(path.read_text(encoding="utf-8"))
            if len(lesson.get("overview", [])) < 2:
                fail(f"{entry['id']}: needs at least two teaching points")
            kinds = {section.get("kind") for section in lesson.get("sections", [])}
            if not {"table", "cards"}.issubset(kinds):
                fail(f"{entry['id']}: needs both a table and read-aloud cards")

            for section in lesson["sections"]:
                if section.get("kind") == "cards":
                    for item in section.get("items", []):
                        if LATIN.search(item.get("grc", "")):
                            fail(f"{entry['id']}: English/Latin text in card.grc")
                if section.get("kind") == "table":
                    for index, column in enumerate(section.get("columns", [])):
                        if column != "Koine Greek":
                            continue
                        for row in section.get("rows", []):
                            if index < len(row) and LATIN.search(str(row[index])):
                                fail(f"{entry['id']}: English/Latin text in Koine Greek table column")

        print(f"{level}: {expected_count}/{expected_count} lessons pass")

    print("Koine Greek course quality gate passed.")


if __name__ == "__main__":
    main()
