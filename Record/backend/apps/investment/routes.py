"""Investment blueprint.

Mounted at ``/api/investment``. Data lives in ``backend/data/Investment/``.

Phase 1 + 2 surface:
    - GET  /meta                           ← lightweight app metadata
    - GET  /workbench/watchlist            ← list watchlist items
    - POST /workbench/watchlist            ← create watchlist item
    - PATCH/DELETE /workbench/watchlist/<id>
    - GET  /workbench/journal              ← list decision-journal entries
    - POST /workbench/journal
    - PATCH/DELETE /workbench/journal/<id>

Later phases will add /knowledge, /models, /cases, /brief, /training endpoints
that read from ``backend/data/Investment/{knowledge,models,...}`` markdown.
Design contract lives in ``Investment.md`` (repo root) and
``backend/data/Investment/README.md``.
"""

from __future__ import annotations

import os
import re
import secrets
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json

from .markdown_io import (
    extract_one_line,
    make_snippet,
    parse_frontmatter,
    read_markdown,
)

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "Investment"
DATA_DIR = Path(os.environ.get("INVESTMENT_DATA_DIR", DEFAULT_DATA_DIR))
WORKBENCH_DIR = DATA_DIR / "workbench"
WATCHLIST_FILE = WORKBENCH_DIR / "watchlist.json"
JOURNAL_FILE = WORKBENCH_DIR / "journal.json"
KNOWLEDGE_DIR = DATA_DIR / "knowledge"
MODELS_DIR = DATA_DIR / "models"
CASES_DIR = DATA_DIR / "cases"
MASTERS_DIR = DATA_DIR / "masters"
DAILY_DIR = DATA_DIR / "daily"
WEEKLY_DIR = DATA_DIR / "weekly"

KNOWLEDGE_CATEGORY_LABELS = {
    "00-foundations": "00 · 基础 Foundations",
    "10-value": "10 · 价值投资 Value",
    "20-frontier": "20 · 前沿 Frontier",
    "30-wisdom": "30 · 商业认知 Wisdom",
    "40-psychology": "40 · 心理与偏差 Psychology",
}

DATE_RX = re.compile(r"^(\d{4})-(\d{2})-(\d{2})$")
PILLARS = {"frontier", "value", "wisdom", "foundations", "psychology", "other"}
DIRECTIONS = {"buy", "hold", "trim", "sell", "avoid", "watch"}

bp = Blueprint("investment", __name__)


class InvestmentError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(InvestmentError)
def handle_error(error: InvestmentError):
    return jsonify({"error": str(error)}), error.status_code


# ---------- shared helpers ----------

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _today_iso() -> str:
    return datetime.now().date().isoformat()


def _validate_date(value: Any, *, allow_empty: bool = False) -> str:
    text = str(value or "").strip()[:10]
    if not text:
        if allow_empty:
            return ""
        raise InvestmentError("Date is required (YYYY-MM-DD).")
    match = DATE_RX.match(text)
    if not match:
        raise InvestmentError("Date must look like YYYY-MM-DD.")
    year, month, day = (int(piece) for piece in match.groups())
    try:
        datetime(year=year, month=month, day=day)
    except ValueError as exc:
        raise InvestmentError(f"Invalid calendar date: {exc}.")
    return text


def _safe_text(value: Any, fallback: str = "", limit: int = 240) -> str:
    text = re.sub(r"\s+", " ", str(value or "").strip())
    return (text or fallback)[:limit]


def _safe_block(value: Any, limit: int = 5000) -> str:
    """Preserve newlines for longer free-form fields (thesis, pre_mortem...)."""
    return str(value or "").strip()[:limit]


def _safe_pillar(value: Any) -> str:
    pillar = str(value or "").strip().lower()
    return pillar if pillar in PILLARS else "other"


def _safe_direction(value: Any) -> str:
    direction = str(value or "").strip().lower()
    return direction if direction in DIRECTIONS else "watch"


def _normalise_list(value: Any, *, item_limit: int = 60, max_items: int = 32) -> list[str]:
    if value is None:
        return []
    pieces = value.split(",") if isinstance(value, str) else value
    out: list[str] = []
    seen: set[str] = set()
    for piece in pieces:
        item = re.sub(r"\s+", " ", str(piece or "").strip())[:item_limit]
        if not item:
            continue
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= max_items:
            break
    return out


def _new_id(prefix: str) -> str:
    return f"{prefix}-{secrets.token_hex(4)}"


# ---------- watchlist ----------

def _empty_watchlist() -> dict[str, Any]:
    return {"items": [], "updated_at": _now_iso()}


def _load_watchlist() -> dict[str, Any]:
    store = read_json(WATCHLIST_FILE, None)
    if not isinstance(store, dict):
        store = _empty_watchlist()
    items = store.get("items")
    if not isinstance(items, list):
        items = []
    store = {"items": items, "updated_at": store.get("updated_at") or _now_iso()}
    return store


def _save_watchlist(store: dict[str, Any]) -> None:
    store["updated_at"] = _now_iso()
    write_json(WATCHLIST_FILE, store)


def _watchlist_from_payload(payload: dict[str, Any], existing: dict[str, Any] | None = None) -> dict[str, Any]:
    base = dict(existing or {})
    if "ticker" in payload or not base.get("ticker"):
        base["ticker"] = _safe_text(payload.get("ticker"), base.get("ticker") or "", 24)
    if "name" in payload or not base.get("name"):
        base["name"] = _safe_text(payload.get("name") or base.get("name"), "未命名标的", 120)
    if "pillar" in payload or not base.get("pillar"):
        base["pillar"] = _safe_pillar(payload.get("pillar") or base.get("pillar"))
    if "thesis" in payload or "thesis" not in base:
        base["thesis"] = _safe_block(payload.get("thesis", base.get("thesis", "")), 4000)
    if "catalyst" in payload or "catalyst" not in base:
        base["catalyst"] = _safe_block(payload.get("catalyst", base.get("catalyst", "")), 1200)
    if "risk" in payload or "risk" not in base:
        base["risk"] = _safe_block(payload.get("risk", base.get("risk", "")), 1200)
    if "entry_zone" in payload or "entry_zone" not in base:
        base["entry_zone"] = _safe_text(payload.get("entry_zone", base.get("entry_zone", "")), "", 120)
    if "exit_zone" in payload or "exit_zone" not in base:
        base["exit_zone"] = _safe_text(payload.get("exit_zone", base.get("exit_zone", "")), "", 120)
    if "position_size" in payload or "position_size" not in base:
        base["position_size"] = _safe_text(payload.get("position_size", base.get("position_size", "")), "", 60)
    if "opened_at" in payload or not base.get("opened_at"):
        opened = payload.get("opened_at") or base.get("opened_at") or _today_iso()
        base["opened_at"] = _validate_date(opened)
    if "linked_models" in payload or "linked_models" not in base:
        base["linked_models"] = _normalise_list(payload.get("linked_models", base.get("linked_models", [])))
    if "linked_cases" in payload or "linked_cases" not in base:
        base["linked_cases"] = _normalise_list(payload.get("linked_cases", base.get("linked_cases", [])))
    if "tags" in payload or "tags" not in base:
        base["tags"] = _normalise_list(payload.get("tags", base.get("tags", [])))
    if "notes" in payload or "notes" not in base:
        base["notes"] = _safe_block(payload.get("notes", base.get("notes", "")), 4000)
    if "status" in payload or not base.get("status"):
        status = str(payload.get("status") or base.get("status") or "active").strip().lower()
        base["status"] = status if status in {"active", "paused", "closed"} else "active"
    return base


def _find_watchlist_item(store: dict[str, Any], item_id: str) -> tuple[int, dict[str, Any]]:
    for index, item in enumerate(store["items"]):
        if isinstance(item, dict) and item.get("id") == item_id:
            return index, item
    raise InvestmentError("Watchlist item not found.", 404)


@bp.route("/workbench/watchlist", methods=["GET", "POST", "OPTIONS"])
def watchlist_collection():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_watchlist()
    if request.method == "GET":
        items = sorted(
            store["items"],
            key=lambda item: (item.get("opened_at") or "", item.get("updatedAt") or ""),
            reverse=True,
        )
        return jsonify({"items": items, "updated_at": store["updated_at"]})

    payload = request.get_json(silent=True) or {}
    item = _watchlist_from_payload(payload)
    now = _now_iso()
    item["id"] = _new_id("wl")
    item["createdAt"] = now
    item["updatedAt"] = now
    store["items"].append(item)
    _save_watchlist(store)
    return jsonify(item), 201


@bp.route("/workbench/watchlist/<item_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def watchlist_detail(item_id: str):
    if request.method == "OPTIONS":
        return "", 204
    store = _load_watchlist()
    index, existing = _find_watchlist_item(store, item_id)
    if request.method == "DELETE":
        store["items"].pop(index)
        _save_watchlist(store)
        return jsonify({"deletedId": item_id})
    payload = request.get_json(silent=True) or {}
    updated = _watchlist_from_payload(payload, existing)
    updated["id"] = item_id
    updated.setdefault("createdAt", existing.get("createdAt") or _now_iso())
    updated["updatedAt"] = _now_iso()
    store["items"][index] = updated
    _save_watchlist(store)
    return jsonify(updated)


# ---------- decision journal ----------

def _empty_journal() -> dict[str, Any]:
    return {"entries": [], "updated_at": _now_iso()}


def _load_journal() -> dict[str, Any]:
    store = read_json(JOURNAL_FILE, None)
    if not isinstance(store, dict):
        store = _empty_journal()
    entries = store.get("entries")
    if not isinstance(entries, list):
        entries = []
    return {"entries": entries, "updated_at": store.get("updated_at") or _now_iso()}


def _save_journal(store: dict[str, Any]) -> None:
    store["updated_at"] = _now_iso()
    write_json(JOURNAL_FILE, store)


def _journal_from_payload(payload: dict[str, Any], existing: dict[str, Any] | None = None) -> dict[str, Any]:
    base = dict(existing or {})
    if "date" in payload or not base.get("date"):
        base["date"] = _validate_date(payload.get("date") or base.get("date") or _today_iso())
    if "asset" in payload or not base.get("asset"):
        base["asset"] = _safe_text(payload.get("asset") or base.get("asset"), "未命名标的", 120)
    if "direction" in payload or not base.get("direction"):
        base["direction"] = _safe_direction(payload.get("direction") or base.get("direction"))
    if "thesis" in payload or "thesis" not in base:
        base["thesis"] = _safe_block(payload.get("thesis", base.get("thesis", "")), 6000)
    if "pre_mortem" in payload or "pre_mortem" not in base:
        base["pre_mortem"] = _safe_block(payload.get("pre_mortem", base.get("pre_mortem", "")), 3000)
    if "cognitive_check" in payload or "cognitive_check" not in base:
        base["cognitive_check"] = _normalise_list(
            payload.get("cognitive_check", base.get("cognitive_check", [])),
            item_limit=200,
            max_items=24,
        )
    if "size" in payload or "size" not in base:
        base["size"] = _safe_text(payload.get("size", base.get("size", "")), "", 60)
    if "outcome" in payload or "outcome" not in base:
        base["outcome"] = _safe_block(payload.get("outcome", base.get("outcome", "")), 3000)
    if "lesson" in payload or "lesson" not in base:
        base["lesson"] = _safe_block(payload.get("lesson", base.get("lesson", "")), 3000)
    if "linked_models" in payload or "linked_models" not in base:
        base["linked_models"] = _normalise_list(payload.get("linked_models", base.get("linked_models", [])))
    if "linked_watchlist" in payload or "linked_watchlist" not in base:
        base["linked_watchlist"] = _normalise_list(payload.get("linked_watchlist", base.get("linked_watchlist", [])))
    if "tags" in payload or "tags" not in base:
        base["tags"] = _normalise_list(payload.get("tags", base.get("tags", [])))
    return base


def _find_journal_entry(store: dict[str, Any], entry_id: str) -> tuple[int, dict[str, Any]]:
    for index, entry in enumerate(store["entries"]):
        if isinstance(entry, dict) and entry.get("id") == entry_id:
            return index, entry
    raise InvestmentError("Journal entry not found.", 404)


@bp.route("/workbench/journal", methods=["GET", "POST", "OPTIONS"])
def journal_collection():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_journal()
    if request.method == "GET":
        entries = sorted(
            store["entries"],
            key=lambda entry: (entry.get("date") or "", entry.get("createdAt") or ""),
            reverse=True,
        )
        return jsonify({"entries": entries, "updated_at": store["updated_at"]})

    payload = request.get_json(silent=True) or {}
    entry = _journal_from_payload(payload)
    now = _now_iso()
    entry["id"] = _new_id("j")
    entry["createdAt"] = now
    entry["updatedAt"] = now
    store["entries"].append(entry)
    _save_journal(store)
    return jsonify(entry), 201


@bp.route("/workbench/journal/<entry_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def journal_detail(entry_id: str):
    if request.method == "OPTIONS":
        return "", 204
    store = _load_journal()
    index, existing = _find_journal_entry(store, entry_id)
    if request.method == "DELETE":
        store["entries"].pop(index)
        _save_journal(store)
        return jsonify({"deletedId": entry_id})
    payload = request.get_json(silent=True) or {}
    updated = _journal_from_payload(payload, existing)
    updated["id"] = entry_id
    updated.setdefault("createdAt", existing.get("createdAt") or _now_iso())
    updated["updatedAt"] = _now_iso()
    store["entries"][index] = updated
    _save_journal(store)
    return jsonify(updated)


# ---------- knowledge library ----------

def _safe_rel_path(rel: str, *, root: Path) -> Path:
    """Resolve ``rel`` against ``root`` and refuse anything that escapes it."""
    rel = (rel or "").strip().replace("\\", "/")
    if not rel:
        raise InvestmentError("Path is required.")
    parts = [p for p in rel.split("/") if p not in ("", ".")]
    if any(p == ".." for p in parts) or any(p.startswith(".") for p in parts):
        raise InvestmentError("Invalid path.")
    target = (root / Path(*parts)).resolve()
    root_resolved = root.resolve()
    if target != root_resolved and root_resolved not in target.parents:
        raise InvestmentError("Invalid path.")
    return target


def _knowledge_doc_summary(md_path: Path) -> dict[str, Any]:
    try:
        doc = read_markdown(md_path)
    except OSError:
        return {}
    meta = doc.meta
    rel = md_path.relative_to(DATA_DIR).as_posix()
    return {
        "slug": meta.get("slug") or md_path.stem,
        "title": meta.get("title") or md_path.stem,
        "path": rel,
        "category": md_path.parent.name,
        "pillar": meta.get("pillar") or "",
        "tags": meta.get("tags") or [],
        "created": meta.get("created") or "",
        "source": meta.get("source") or "",
        "one_line": extract_one_line(doc.body),
    }


@bp.get("/knowledge/tree")
def knowledge_tree():
    if not KNOWLEDGE_DIR.exists():
        return jsonify({"categories": [], "total": 0})
    categories: list[dict[str, Any]] = []
    total = 0
    for category_dir in sorted(KNOWLEDGE_DIR.iterdir()):
        if not category_dir.is_dir() or category_dir.name.startswith("."):
            continue
        docs = []
        for md_path in sorted(category_dir.glob("*.md")):
            summary = _knowledge_doc_summary(md_path)
            if summary:
                docs.append(summary)
        if not docs:
            continue
        total += len(docs)
        categories.append({
            "key": category_dir.name,
            "label": KNOWLEDGE_CATEGORY_LABELS.get(category_dir.name, category_dir.name),
            "count": len(docs),
            "docs": docs,
        })
    return jsonify({"categories": categories, "total": total})


@bp.get("/knowledge/doc")
def knowledge_doc():
    # Tree returns paths relative to DATA_DIR (e.g. ``knowledge/10-value/foo.md``),
    # so we resolve against DATA_DIR and then verify the target sits under
    # ``knowledge/`` — no traversal escapes, no symlink shenanigans.
    rel = request.args.get("path", "")
    target = _safe_rel_path(rel, root=DATA_DIR)
    knowledge_root = KNOWLEDGE_DIR.resolve()
    if knowledge_root != target and knowledge_root not in target.parents:
        raise InvestmentError("Path must live under knowledge/.")
    if not target.exists() or target.suffix.lower() != ".md":
        raise InvestmentError("Knowledge doc not found.", 404)
    doc = read_markdown(target)
    return jsonify({
        "path": target.relative_to(DATA_DIR).as_posix(),
        "category": target.parent.name,
        "meta": doc.meta,
        "body": doc.body,
    })


# ---------- mental models ----------

def _model_summary(md_path: Path) -> dict[str, Any]:
    try:
        doc = read_markdown(md_path)
    except OSError:
        return {}
    meta = doc.meta
    return {
        "slug": meta.get("slug") or md_path.stem,
        "title": meta.get("title") or md_path.stem,
        "pillar": meta.get("pillar") or "other",
        "origin_field": meta.get("origin_field") or "",
        "tags": meta.get("tags") or [],
        "source": meta.get("source") or "",
        "one_line": extract_one_line(doc.body),
    }


@bp.get("/models")
def models_list():
    if not MODELS_DIR.exists():
        return jsonify({"items": [], "pillars": {}})
    items: list[dict[str, Any]] = []
    pillars: dict[str, int] = {}
    for md_path in sorted(MODELS_DIR.glob("*.md")):
        summary = _model_summary(md_path)
        if not summary:
            continue
        items.append(summary)
        pillar = summary["pillar"] or "other"
        pillars[pillar] = pillars.get(pillar, 0) + 1
    return jsonify({"items": items, "pillars": pillars})


@bp.get("/models/<slug>")
def model_detail(slug: str):
    safe_slug = re.sub(r"[^a-zA-Z0-9_-]+", "", slug)[:80]
    if not safe_slug:
        raise InvestmentError("Invalid model slug.")
    target = MODELS_DIR / f"{safe_slug}.md"
    if not target.exists():
        raise InvestmentError("Model not found.", 404)
    doc = read_markdown(target)
    return jsonify({
        "slug": safe_slug,
        "meta": doc.meta,
        "body": doc.body,
    })


# ---------- cases ----------

def _case_summary(md_path: Path) -> dict[str, Any]:
    try:
        doc = read_markdown(md_path)
    except OSError:
        return {}
    meta = doc.meta
    return {
        "slug": meta.get("slug") or md_path.stem,
        "title": meta.get("title") or md_path.stem,
        "pillar": meta.get("pillar") or "other",
        "era": str(meta.get("era") or ""),
        "winner_or_loser": str(meta.get("winner_or_loser") or "mixed").lower(),
        "tags": meta.get("tags") or [],
        "source": meta.get("source") or "",
        "one_line": extract_one_line(doc.body),
    }


@bp.get("/cases")
def cases_list():
    if not CASES_DIR.exists():
        return jsonify({"items": [], "pillars": {}, "outcomes": {}})
    items: list[dict[str, Any]] = []
    pillars: dict[str, int] = {}
    outcomes: dict[str, int] = {}
    for md_path in sorted(CASES_DIR.glob("*.md")):
        s = _case_summary(md_path)
        if not s:
            continue
        items.append(s)
        pillars[s["pillar"]] = pillars.get(s["pillar"], 0) + 1
        outcomes[s["winner_or_loser"]] = outcomes.get(s["winner_or_loser"], 0) + 1
    # Sort by era DESC (newest first); cases without era go last.
    items.sort(key=lambda c: (c["era"] or "0000"), reverse=True)
    return jsonify({"items": items, "pillars": pillars, "outcomes": outcomes})


@bp.get("/cases/<slug>")
def case_detail(slug: str):
    safe_slug = re.sub(r"[^a-zA-Z0-9_-]+", "", slug)[:80]
    if not safe_slug:
        raise InvestmentError("Invalid case slug.")
    target = CASES_DIR / f"{safe_slug}.md"
    if not target.exists():
        raise InvestmentError("Case not found.", 404)
    doc = read_markdown(target)
    return jsonify({"slug": safe_slug, "meta": doc.meta, "body": doc.body})


# ---------- masters (市场大咖) ----------

def _master_summary(md_path: Path) -> dict[str, Any]:
    try:
        doc = read_markdown(md_path)
    except OSError:
        return {}
    meta = doc.meta
    return {
        "slug": meta.get("slug") or md_path.stem,
        "title": meta.get("title") or md_path.stem,
        "role": meta.get("role") or "",
        "country": meta.get("country") or "",
        "era": str(meta.get("era") or ""),
        "status": meta.get("status") or "active",
        "key_companies": meta.get("key_companies") or [],
        "tags": meta.get("tags") or [],
        "source": meta.get("source") or "",
        "one_line": extract_one_line(doc.body),
    }


@bp.get("/masters")
def masters_list():
    if not MASTERS_DIR.exists():
        return jsonify({"items": [], "roles": {}, "countries": {}})
    items: list[dict[str, Any]] = []
    roles: dict[str, int] = {}
    countries: dict[str, int] = {}
    for md_path in sorted(MASTERS_DIR.glob("*.md")):
        s = _master_summary(md_path)
        if not s:
            continue
        items.append(s)
        if s["role"]:
            roles[s["role"]] = roles.get(s["role"], 0) + 1
        if s["country"]:
            countries[s["country"]] = countries.get(s["country"], 0) + 1
    # Sort by era start descending; living legends (no end year) first.
    items.sort(key=lambda m: (m["era"] or "0000"), reverse=True)
    return jsonify({"items": items, "roles": roles, "countries": countries})


@bp.get("/masters/<slug>")
def master_detail(slug: str):
    safe_slug = re.sub(r"[^a-zA-Z0-9_-]+", "", slug)[:80]
    if not safe_slug:
        raise InvestmentError("Invalid master slug.")
    target = MASTERS_DIR / f"{safe_slug}.md"
    if not target.exists():
        raise InvestmentError("Master not found.", 404)
    doc = read_markdown(target)
    return jsonify({"slug": safe_slug, "meta": doc.meta, "body": doc.body})


# ---------- market brief (daily + weekly) ----------

def _brief_summary(md_path: Path, *, kind: str) -> dict[str, Any]:
    try:
        doc = read_markdown(md_path)
    except OSError:
        return {}
    meta = doc.meta
    summary = {
        "slug": meta.get("slug") or md_path.stem,
        "title": meta.get("title") or md_path.stem,
        "path": md_path.relative_to(DATA_DIR).as_posix(),
        "kind": kind,
        "one_line": extract_one_line(doc.body),
        "sample": str(meta.get("sample", "")).lower() in ("true", "yes", "1"),
        "generated_by": meta.get("generated_by", ""),
    }
    if kind == "daily":
        summary["date"] = meta.get("date") or md_path.stem
        summary["weekday"] = meta.get("weekday", "")
    else:
        summary["week_start"] = meta.get("week_start", "")
        summary["week_end"] = meta.get("week_end", "")
        summary["focus_industry"] = meta.get("focus_industry", "")
    return summary


@bp.get("/brief/list")
def brief_list():
    daily: list[dict[str, Any]] = []
    if DAILY_DIR.exists():
        for md_path in sorted(DAILY_DIR.glob("*.md"), reverse=True):
            s = _brief_summary(md_path, kind="daily")
            if s:
                daily.append(s)
    weekly: list[dict[str, Any]] = []
    if WEEKLY_DIR.exists():
        for md_path in sorted(WEEKLY_DIR.glob("*.md"), reverse=True):
            s = _brief_summary(md_path, kind="weekly")
            if s:
                weekly.append(s)
    return jsonify({"daily": daily, "weekly": weekly})


@bp.get("/brief/doc")
def brief_doc():
    rel = request.args.get("path", "")
    target = _safe_rel_path(rel, root=DATA_DIR)
    brief_roots = (DAILY_DIR.resolve(), WEEKLY_DIR.resolve())
    if not any(target == r or r in target.parents for r in brief_roots):
        raise InvestmentError("Path must live under daily/ or weekly/.")
    if not target.exists() or target.suffix.lower() != ".md":
        raise InvestmentError("Brief not found.", 404)
    doc = read_markdown(target)
    return jsonify({
        "path": target.relative_to(DATA_DIR).as_posix(),
        "kind": "daily" if DAILY_DIR.resolve() in target.parents else "weekly",
        "meta": doc.meta,
        "body": doc.body,
    })


# ---------- search (knowledge + models + cases + briefs) ----------

@bp.get("/search")
def search():
    raw_q = request.args.get("q", "").strip()
    if len(raw_q) < 2:
        return jsonify({"results": [], "query": raw_q})
    q_lower = raw_q.lower()
    results: list[dict[str, Any]] = []
    for kind, root in (
        ("knowledge", KNOWLEDGE_DIR),
        ("models", MODELS_DIR),
        ("cases", CASES_DIR),
        ("masters", MASTERS_DIR),
        ("daily", DAILY_DIR),
        ("weekly", WEEKLY_DIR),
    ):
        if not root.exists():
            continue
        for md_path in sorted(root.rglob("*.md")):
            try:
                text = md_path.read_text(encoding="utf-8")
            except OSError:
                continue
            text_lower = text.lower()
            if q_lower not in text_lower:
                # Also accept matches in path/filename for slug-style queries.
                if q_lower not in md_path.name.lower():
                    continue
            meta, body = parse_frontmatter(text)
            results.append({
                "kind": kind,
                "slug": meta.get("slug") or md_path.stem,
                "title": meta.get("title") or md_path.stem,
                "pillar": meta.get("pillar") or "",
                "path": md_path.relative_to(DATA_DIR).as_posix(),
                "snippet": make_snippet(body or text, q_lower),
            })
            if len(results) >= 60:
                break
        if len(results) >= 60:
            break
    return jsonify({"results": results, "query": raw_q})


# ---------- meta (used by Home dashboard) ----------

def _count_markdown(root: Path) -> int:
    if not root.exists():
        return 0
    return sum(1 for _ in root.rglob("*.md"))


@bp.get("/meta")
def meta():
    watchlist = _load_watchlist()["items"]
    journal = _load_journal()["entries"]
    pillars: dict[str, int] = {}
    for item in watchlist:
        key = item.get("pillar") or "other"
        pillars[key] = pillars.get(key, 0) + 1
    pending_review = [
        entry for entry in journal
        if not (entry.get("outcome") or "").strip() or not (entry.get("lesson") or "").strip()
    ]
    return jsonify({
        "ok": True,
        "phase": "1+2+3+3b+4 (scaffold + workbench + knowledge/models + cases + brief)",
        "counts": {
            "watchlist": len(watchlist),
            "journal": len(journal),
            "journal_pending_review": len(pending_review),
            "knowledge": _count_markdown(KNOWLEDGE_DIR),
            "models": _count_markdown(MODELS_DIR),
            "cases": _count_markdown(CASES_DIR),
            "masters": _count_markdown(MASTERS_DIR),
            "daily": _count_markdown(DAILY_DIR),
            "weekly": _count_markdown(WEEKLY_DIR),
        },
        "watchlist_pillars": pillars,
        "data_dir": str(DATA_DIR),
    })
