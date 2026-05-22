"""Shared data helpers for the expandable "900" speaking apps."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from shared.io import read_json, write_json

GROUPS_DIR_NAME = "groups"
INDEX_FILE_NAME = "index.json"

FIELD_ALIASES = {
    "english": {"english", "en", "source", "sentence", "text", "target"},
    "chinese": {"chinese", "zh", "zh_cn", "translation", "中文", "汉语"},
    "spanish": {"spanish", "es", "espanol", "español"},
    "french": {"french", "fr", "francais", "français"},
    "german": {"german", "de", "deutsch"},
}


def _groups_dir(data_dir: Path) -> Path:
    return data_dir / GROUPS_DIR_NAME


def _group_file_sort_key(path: Path) -> tuple[int, str]:
    match = re.search(r"group-(\d+)", path.stem)
    return (int(match.group(1)) if match else 10_000, path.name)


def ensure_900_sentence_ids(course: dict[str, Any]) -> dict[str, Any]:
    group_size = int(course.get("groupSize") or 100)
    for group_index, group in enumerate(course.get("groups", []) or [], start=1):
      group_id = str(group.get("id") or f"group-{group_index}")
      group["id"] = group_id
      sentences = group.get("sentences") or []
      for index, sentence in enumerate(sentences, start=1):
          sentence.setdefault("id", f"{group_id}-{index:03d}")
          sentence["groupNumber"] = index
          sentence["number"] = (group_index - 1) * group_size + index
      group["count"] = len(sentences)
    course["totalSentences"] = sum(group.get("count", 0) for group in course.get("groups", []))
    return course


def group_summary(group: dict[str, Any]) -> dict[str, Any]:
    sentences = group.get("sentences", [])
    return {
        "id": group.get("id"),
        "title": group.get("title"),
        "level": group.get("level"),
        "focus": group.get("focus"),
        "count": group.get("count", len(sentences)),
        "firstSentence": sentences[0] if sentences else None,
    }


def load_900_course(data_dir: Path, legacy_file: Path, error_cls: type[ValueError]) -> dict[str, Any]:
    groups_dir = _groups_dir(data_dir)
    index_file = groups_dir / INDEX_FILE_NAME

    if index_file.exists():
        course = read_json(index_file, {})
        groups = []
        index_groups = course.get("groups") or []
        if index_groups:
            for item in index_groups:
                filename = item.get("file") or f"{item.get('id')}.json"
                group = read_json(groups_dir / filename)
                if group:
                    groups.append(group)
        else:
            for path in sorted(groups_dir.glob("group-*.json"), key=_group_file_sort_key):
                group = read_json(path)
                if group:
                    groups.append(group)
        course["groups"] = groups
        return ensure_900_sentence_ids(course)

    course = read_json(legacy_file)
    if not course:
        raise error_cls("900 data is missing.", 500)
    return ensure_900_sentence_ids(course)


def load_900_index(data_dir: Path, legacy_file: Path, error_cls: type[ValueError]) -> dict[str, Any]:
    """Lazy variant of load_900_course: returns course metadata + group summaries only.

    No per-group sentence files are read; the per-group counts come from index.json.
    Used by the /groups endpoint so entering an app does not fault in all 900+ rows.
    """
    groups_dir = _groups_dir(data_dir)
    index_file = groups_dir / INDEX_FILE_NAME

    if index_file.exists():
        course = read_json(index_file, {})
        summaries = []
        for item in course.get("groups") or []:
            summaries.append({
                "id": item.get("id"),
                "title": item.get("title"),
                "level": item.get("level"),
                "focus": item.get("focus"),
                "count": item.get("count", 0),
                "firstSentence": None,
            })
        course["groups"] = summaries
        if "totalSentences" not in course:
            course["totalSentences"] = sum(item.get("count", 0) for item in summaries)
        return course

    # Legacy fallback: no split files yet, so we still have to load the whole thing.
    return load_900_course(data_dir, legacy_file, error_cls)


def load_900_group(
    data_dir: Path,
    legacy_file: Path,
    group_id: str,
    error_cls: type[ValueError],
) -> dict[str, Any]:
    """Load a single group's sentences without reading any sibling group files."""
    groups_dir = _groups_dir(data_dir)
    index_file = groups_dir / INDEX_FILE_NAME

    if index_file.exists():
        course_index = read_json(index_file, {})
        group_meta = next(
            (item for item in course_index.get("groups") or [] if item.get("id") == group_id),
            None,
        )
        if not group_meta:
            raise error_cls("Group not found.", 404)
        filename = group_meta.get("file") or f"{group_id}.json"
        group = read_json(groups_dir / filename)
        if not group:
            raise error_cls("Group not found.", 404)
        group_size = int(course_index.get("groupSize") or 100)
        group_index = next(
            (i + 1 for i, item in enumerate(course_index.get("groups") or []) if item.get("id") == group_id),
            1,
        )
        _ensure_group_sentence_ids(group, group_index=group_index, group_size=group_size)
        return group

    # Legacy fallback.
    course = load_900_course(data_dir, legacy_file, error_cls)
    for group in course.get("groups", []):
        if group.get("id") == group_id:
            return group
    raise error_cls("Group not found.", 404)


def _ensure_group_sentence_ids(group: dict[str, Any], *, group_index: int, group_size: int) -> None:
    group_id = str(group.get("id") or f"group-{group_index}")
    group["id"] = group_id
    sentences = group.get("sentences") or []
    for index, sentence in enumerate(sentences, start=1):
        sentence.setdefault("id", f"{group_id}-{index:03d}")
        sentence["groupNumber"] = index
        sentence["number"] = (group_index - 1) * group_size + index
    group["count"] = len(sentences)


def write_900_index(data_dir: Path, course: dict[str, Any]) -> None:
    groups_dir = _groups_dir(data_dir)
    groups = course.get("groups", [])
    index = {
        key: value
        for key, value in course.items()
        if key not in {"groups"}
    }
    index["groups"] = [
        {
            "id": group.get("id"),
            "title": group.get("title"),
            "level": group.get("level"),
            "focus": group.get("focus"),
            "count": group.get("count", len(group.get("sentences", []))),
            "file": f"{group.get('id')}.json",
        }
        for group in groups
    ]
    index["totalSentences"] = sum(item["count"] for item in index["groups"])
    write_json(groups_dir / INDEX_FILE_NAME, index)


def delete_900_group(
    data_dir: Path,
    course: dict[str, Any],
    group_id: str,
    error_cls: type[ValueError],
) -> dict[str, Any]:
    groups = course.get("groups", [])
    group = next((item for item in groups if item.get("id") == group_id), None)
    if not group:
        raise error_cls("Group not found.", 404)

    remaining = [item for item in groups if item.get("id") != group_id]
    if not remaining:
        raise error_cls("You cannot delete the last remaining group.", 400)

    course["groups"] = remaining
    course["totalSentences"] = sum(len(item.get("sentences", [])) for item in remaining)
    (_groups_dir(data_dir) / f"{group_id}.json").unlink(missing_ok=True)
    write_900_index(data_dir, course)
    return group


def cleanup_900_audio_cache(
    group: dict[str, Any],
    field_languages: dict[str, str],
    *,
    audio_dir: Path,
    manifest_file: Path,
    language_config: dict[str, dict[str, Any]],
) -> dict[str, int]:
    manifest = read_json(manifest_file, {"items": {}})
    items = manifest.get("items", {})
    if not isinstance(items, dict):
        return {"audioFilesDeleted": 0, "manifestItemsDeleted": 0}

    previews: set[tuple[str, str]] = set()
    for sentence in group.get("sentences", []) or []:
        for field, language in field_languages.items():
            text = " ".join(str(sentence.get(field) or "").split())
            if text:
                previews.add((language_config[language]["language"], text[:240]))

    deleted_files = 0
    deleted_manifest_items = 0
    for key, item in list(items.items()):
        signature = (item.get("language"), item.get("textPreview"))
        if signature not in previews:
            continue
        relative_path = item.get("path")
        if relative_path:
            path = audio_dir / relative_path
            if path.exists():
                path.unlink()
                deleted_files += 1
        items.pop(key, None)
        deleted_manifest_items += 1

    if deleted_manifest_items:
        write_json(manifest_file, manifest)

    return {
        "audioFilesDeleted": deleted_files,
        "manifestItemsDeleted": deleted_manifest_items,
    }


def _strip_json_fence(text: str) -> str:
    stripped = text.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", stripped, re.IGNORECASE)
    if fence_match:
        stripped = fence_match.group(1).strip()
    if stripped.startswith("{") or stripped.startswith("["):
        return stripped
    starts = [index for index in (stripped.find("{"), stripped.find("[")) if index >= 0]
    if starts:
        start = min(starts)
        end = max(stripped.rfind("}"), stripped.rfind("]"))
        if end > start:
            return stripped[start : end + 1]
    return stripped


def parse_import_payload(payload: Any, error_cls: type[ValueError]) -> Any:
    data = payload
    if isinstance(payload, dict) and "content" in payload:
        data = payload.get("content")
    if isinstance(data, str):
        try:
            return json.loads(_strip_json_fence(data))
        except json.JSONDecodeError as exc:
            raise error_cls(f"Import JSON could not be parsed: {exc.msg}.", 400) from exc
    return data


def _extract_group(data: Any, error_cls: type[ValueError]) -> dict[str, Any]:
    if isinstance(data, list):
        return {"sentences": data}
    if not isinstance(data, dict):
        raise error_cls("Import data must be a JSON object or an array of sentences.", 400)
    if isinstance(data.get("sentences"), list):
        return data
    if isinstance(data.get("items"), list):
        return {**data, "sentences": data["items"]}
    if isinstance(data.get("data"), dict):
        return _extract_group(data["data"], error_cls)
    if isinstance(data.get("groups"), list) and data["groups"]:
        return _extract_group(data["groups"][0], error_cls)
    raise error_cls("Import JSON must include a 'sentences' array.", 400)


def _value_for_field(raw: dict[str, Any], field: str) -> str:
    aliases = FIELD_ALIASES.get(field, {field})
    for key, value in raw.items():
        normalised_key = str(key).strip().lower().replace("-", "_")
        if normalised_key in aliases and value is not None:
            return " ".join(str(value).split())
    return ""


def _next_group_number(groups: list[dict[str, Any]]) -> int:
    max_number = 0
    for group in groups:
        match = re.search(r"(\d+)$", str(group.get("id") or ""))
        if match:
            max_number = max(max_number, int(match.group(1)))
    return max_number + 1


def import_900_group(
    data_dir: Path,
    course: dict[str, Any],
    payload: Any,
    *,
    app_label: str,
    required_fields: list[str],
    error_cls: type[ValueError],
) -> dict[str, Any]:
    incoming = _extract_group(parse_import_payload(payload, error_cls), error_cls)
    raw_sentences = incoming.get("sentences") or []
    if not raw_sentences:
        raise error_cls("Import group must contain at least one sentence.", 400)

    groups = course.setdefault("groups", [])
    group_number = _next_group_number(groups)
    group_id = f"group-{group_number}"
    group_size = int(course.get("groupSize") or 100)
    normalised_sentences = []

    for index, raw in enumerate(raw_sentences, start=1):
        if not isinstance(raw, dict):
            raise error_cls(f"Sentence {index} must be a JSON object.", 400)
        sentence = {
            "id": f"{group_id}-{index:03d}",
            "number": (group_number - 1) * group_size + index,
            "groupNumber": index,
            "tag": " ".join(str(raw.get("tag") or raw.get("topic") or "Custom").split()),
        }
        for field in required_fields:
            value = _value_for_field(raw, field)
            if not value:
                raise error_cls(f"Sentence {index} is missing '{field}'.", 400)
            sentence[field] = value
        normalised_sentences.append(sentence)

    today = datetime.now(timezone.utc).date().isoformat()
    group = {
        "id": group_id,
        "title": str(incoming.get("title") or f"Custom 100 - {today}").strip(),
        "level": str(incoming.get("level") or incoming.get("difficulty") or "Custom").strip(),
        "focus": str(incoming.get("focus") or f"Imported {app_label} speaking practice.").strip(),
        "count": len(normalised_sentences),
        "sentences": normalised_sentences,
    }

    groups.append(group)
    course["totalSentences"] = sum(len(item.get("sentences", [])) for item in groups)
    write_json(_groups_dir(data_dir) / f"{group_id}.json", group)
    write_900_index(data_dir, course)
    return group
