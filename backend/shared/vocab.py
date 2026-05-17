"""Shared data helpers for the reusable vocabulary apps.

The on-disk layout is intentionally small-file friendly so each vocab
language can grow without one giant JSON. Layout per language:

    backend/data/<AppData>/
    ├── levels.json                       — top-level index of CEFR levels
    └── levels/
        ├── a1/
        │   ├── index.json                — list of groups in A1
        │   ├── group-1.json              — 100 words in this group
        │   └── group-2.json
        ├── a2/
        │   ├── index.json
        │   └── group-1.json
        ├── b1/  …
        └── c2/  …

Each word object looks like:
    {
      "id": "es-a1-g1-001",      # injected on load if missing
      "lemma": "casa",
      "ipa": "ˈka.sa",            # optional pronunciation hint
      "pos": "noun",              # noun | verb | adj | adv | phrase | other
      "gender": "f",              # for nouns: m | f | mf  (optional)
      "translation_en": "house",
      "example": "La casa es grande.",
      "example_en": "The house is big.",
      "tag": "Home"               # free-form topic tag
    }

`pos` is used to group words inside a group on the frontend (one
section per part of speech, with a "play this section" button).
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from shared.io import read_json

LEVELS_FILE_NAME = "levels.json"
LEVELS_DIR_NAME = "levels"
INDEX_FILE_NAME = "index.json"

#: The order of POS sections inside a group. Words with a pos not in
#: this list fall into a final "other" bucket.
POS_ORDER: tuple[str, ...] = ("noun", "verb", "adj", "adv", "phrase", "other")

POS_ALIASES: dict[str, str] = {
    "n": "noun",
    "noun": "noun",
    "sustantivo": "noun",
    "v": "verb",
    "verb": "verb",
    "verbo": "verb",
    "adj": "adj",
    "adjective": "adj",
    "adjetivo": "adj",
    "adv": "adv",
    "adverb": "adv",
    "adverbio": "adv",
    "phr": "phrase",
    "phrase": "phrase",
    "expresion": "phrase",
    "expresión": "phrase",
    "frase": "phrase",
    "idiom": "phrase",
}


def _levels_dir(data_dir: Path) -> Path:
    return data_dir / LEVELS_DIR_NAME


def _level_dir(data_dir: Path, level_id: str) -> Path:
    return _levels_dir(data_dir) / level_id


def _group_file_sort_key(path: Path) -> tuple[int, str]:
    match = re.search(r"group-(\d+)", path.stem)
    return (int(match.group(1)) if match else 10_000, path.name)


def normalise_pos(value: Any) -> str:
    text = str(value or "").strip().lower()
    if not text:
        return "other"
    return POS_ALIASES.get(text, text if text in POS_ORDER else "other")


def _ensure_word_ids(group: dict[str, Any], level_id: str) -> dict[str, Any]:
    group_id = str(group.get("id") or "")
    words = group.get("words") or []
    for index, word in enumerate(words, start=1):
        word["pos"] = normalise_pos(word.get("pos"))
        word.setdefault("id", f"{level_id}-{group_id}-{index:03d}")
        word.setdefault("number", index)
    group["count"] = len(words)
    return group


def load_levels(data_dir: Path, error_cls: type[ValueError]) -> dict[str, Any]:
    """Return the top-level course summary (no per-word bodies)."""
    levels_file = data_dir / LEVELS_FILE_NAME
    if not levels_file.exists():
        raise error_cls("Vocab levels.json is missing.", 500)
    course = read_json(levels_file) or {}
    levels: list[dict[str, Any]] = []
    for entry in course.get("levels", []) or []:
        level_id = str(entry.get("id") or "").strip()
        if not level_id:
            continue
        index_file = _level_dir(data_dir, level_id) / INDEX_FILE_NAME
        groups: list[dict[str, Any]] = []
        if index_file.exists():
            index = read_json(index_file) or {}
            for raw in index.get("groups", []) or []:
                groups.append({
                    "id": raw.get("id"),
                    "title": raw.get("title"),
                    "focus": raw.get("focus"),
                    "count": int(raw.get("count") or 0),
                })
        levels.append({
            **entry,
            "id": level_id,
            "groupCount": len(groups),
            "wordCount": sum(g["count"] for g in groups),
            "groups": groups,
        })
    return {
        "id": course.get("id"),
        "title": course.get("title"),
        "subtitle": course.get("subtitle"),
        "description": course.get("description"),
        "totalWords": sum(level["wordCount"] for level in levels),
        "totalGroups": sum(level["groupCount"] for level in levels),
        "levels": levels,
    }


def load_level(data_dir: Path, level_id: str, error_cls: type[ValueError]) -> dict[str, Any]:
    level_dir = _level_dir(data_dir, level_id)
    if not level_dir.exists():
        raise error_cls(f"Level '{level_id}' not found.", 404)
    index_file = level_dir / INDEX_FILE_NAME
    index = read_json(index_file) or {}
    summaries: list[dict[str, Any]] = []
    for raw in index.get("groups", []) or []:
        summaries.append({
            "id": raw.get("id"),
            "title": raw.get("title"),
            "focus": raw.get("focus"),
            "count": int(raw.get("count") or 0),
        })
    return {
        "id": level_id,
        "title": index.get("title") or level_id.upper(),
        "subtitle": index.get("subtitle"),
        "focus": index.get("focus"),
        "groups": summaries,
        "wordCount": sum(g["count"] for g in summaries),
    }


def load_group(
    data_dir: Path,
    level_id: str,
    group_id: str,
    error_cls: type[ValueError],
) -> dict[str, Any]:
    path = _level_dir(data_dir, level_id) / f"{group_id}.json"
    if not path.exists():
        raise error_cls(f"Group '{group_id}' not found in level '{level_id}'.", 404)
    group = read_json(path)
    if not group:
        raise error_cls(f"Group '{group_id}' is empty.", 500)
    return _ensure_word_ids(group, level_id)


def group_words_by_pos(group: dict[str, Any]) -> list[dict[str, Any]]:
    """Return a list of POS sections in canonical order, with words and a count."""
    buckets: dict[str, list[dict[str, Any]]] = {pos: [] for pos in POS_ORDER}
    for word in group.get("words") or []:
        buckets.setdefault(word.get("pos") or "other", buckets["other"]).append(word)
    sections = []
    for pos in POS_ORDER:
        words = buckets.get(pos) or []
        if not words:
            continue
        sections.append({"pos": pos, "count": len(words), "words": words})
    return sections
