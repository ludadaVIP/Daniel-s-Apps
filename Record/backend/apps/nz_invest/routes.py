"""NZ Invest blueprint.

Mounted at ``/api/nz-invest``. This app is intentionally separate from the
existing Investment app and reads its own Markdown course files from
``backend/data/NZInvest``.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "NZInvest"
DATA_DIR = Path(os.environ.get("NZ_INVEST_DATA_DIR", DEFAULT_DATA_DIR))
LEARN_DIR = DATA_DIR / "learn"

bp = Blueprint("nz_invest", __name__)


@dataclass(frozen=True)
class MarkdownDoc:
    meta: dict[str, Any]
    body: str
    raw: str


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---"):
        return {}, text
    lines = text.splitlines()
    end = None
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            end = index
            break
    if end is None:
        return {}, text
    meta: dict[str, Any] = {}
    current_list_key: str | None = None
    current_list: list[str] = []
    for raw in lines[1:end]:
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if current_list_key and stripped.startswith("- "):
            current_list.append(_strip_value(stripped[2:]))
            continue
        if current_list_key:
            meta[current_list_key] = current_list
            current_list_key = None
            current_list = []
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if not value:
            current_list_key = key
            current_list = []
            continue
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            meta[key] = [_strip_value(part) for part in inner.split(",") if part.strip()]
        else:
            meta[key] = _strip_value(value)
    if current_list_key:
        meta[current_list_key] = current_list
    body = "\n".join(lines[end + 1 :]).lstrip("\n")
    return meta, body


def _strip_value(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def read_markdown(path: Path) -> MarkdownDoc:
    text = path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)
    return MarkdownDoc(meta=meta, body=body, raw=text)


def one_line(body: str) -> str:
    for line in body.splitlines():
        text = line.strip()
        if not text or text.startswith("#") or text.startswith(">") or text.startswith("-"):
            continue
        return text[:150]
    return ""


def doc_summary(path: Path) -> dict[str, Any]:
    doc = read_markdown(path)
    rel = path.relative_to(DATA_DIR).as_posix()
    order = doc.meta.get("order") or "999"
    try:
        sort_order = int(str(order))
    except ValueError:
        sort_order = 999
    return {
        "path": rel,
        "slug": doc.meta.get("slug") or path.stem,
        "title": doc.meta.get("title") or path.stem,
        "section": doc.meta.get("section") or "课程",
        "order": sort_order,
        "level": doc.meta.get("level") or "",
        "tags": doc.meta.get("tags") or [],
        "one_line": doc.meta.get("one_line") or one_line(doc.body),
    }


def safe_data_path(rel: str) -> Path:
    rel = (rel or "").strip().replace("\\", "/")
    parts = [part for part in rel.split("/") if part and part != "."]
    if not parts or any(part == ".." or part.startswith(".") for part in parts):
        raise ValueError("Invalid path.")
    target = (DATA_DIR / Path(*parts)).resolve()
    data_root = DATA_DIR.resolve()
    if target != data_root and data_root not in target.parents:
        raise ValueError("Invalid path.")
    return target


@bp.get("/library")
def library():
    sections: dict[str, list[dict[str, Any]]] = {}
    if LEARN_DIR.exists():
        for md_path in sorted(LEARN_DIR.glob("*.md")):
            summary = doc_summary(md_path)
            sections.setdefault(summary["section"], []).append(summary)
    out = []
    total = 0
    for section, docs in sections.items():
        docs.sort(key=lambda item: (item["order"], item["title"]))
        total += len(docs)
        out.append({"id": _section_id(section), "title": section, "docs": docs})
    out.sort(key=lambda section: section["docs"][0]["order"] if section["docs"] else 999)
    return jsonify({"sections": out, "total": total})


@bp.get("/doc")
def document():
    try:
        target = safe_data_path(request.args.get("path", ""))
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    learn_root = LEARN_DIR.resolve()
    if learn_root != target and learn_root not in target.parents:
        return jsonify({"error": "Path must live under learn/."}), 400
    if not target.exists() or target.suffix.lower() != ".md":
        return jsonify({"error": "Document not found."}), 404
    doc = read_markdown(target)
    return jsonify({
        "path": target.relative_to(DATA_DIR).as_posix(),
        "meta": doc.meta,
        "body": doc.body,
    })


def _section_id(title: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9\u4e00-\u9fff]+", "-", title).strip("-").lower()
    return slug or "section"

