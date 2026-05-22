"""Record & Meditation blueprint.

Mounted at ``/api/record-meditation``. Data lives in
``backend/data/RecordMeditation/``.

Storage layout (one file per month so we never load the whole archive
at once, and Git diffs stay small):

    data/RecordMeditation/
    ├── entries-index.csv          — master sheet (regenerated on every write)
    └── entries/
        └── 2024/
            ├── 10.json            — list of entries dated 2024-10-XX
            └── 11.json

An entry object:

    {
      "id": "20241015-a3f1",
      "date": "2024-10-15",
      "createdAt": "2024-10-15T08:21:43+00:00",
      "updatedAt": "2024-10-15T08:21:43+00:00",
      "title": "Reading: Sapiens, chapter 4",
      "summary": "Cognitive revolution gave humans the ability to gossip…",
      "body": "<p>...</p>",                 — sanitised HTML from the editor
      "tags": ["reading", "history"],
      "mood": null
    }
"""

from __future__ import annotations

import csv
import html
import io
import json
import os
import re
import secrets
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import bcrypt
from flask import Blueprint, Response, jsonify, request, send_file

from shared.io import read_json, write_json

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "RecordMeditation"
DATA_DIR = Path(os.environ.get("RECORD_MEDITATION_DATA_DIR", DEFAULT_DATA_DIR))
ENTRIES_DIR = DATA_DIR / "entries"
INDEX_CSV = DATA_DIR / "entries-index.csv"
AUTH_FILE = DATA_DIR / "auth.json"
DEFAULT_PASSWORD = "123456"

SUMMARY_MAX = 160
DATE_RX = re.compile(r"^(\d{4})-(\d{2})-(\d{2})$")
ALLOWED_TAGS = {
    "p", "br", "strong", "em", "u", "s", "blockquote", "code", "pre",
    "h1", "h2", "h3", "h4", "ul", "ol", "li", "a", "span", "hr",
}
ALLOWED_ATTRS = {"a": {"href", "title", "target", "rel"}}

bp = Blueprint("record_meditation", __name__)


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------


class RecordError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(RecordError)
def handle_error(error: RecordError):
    return jsonify({"error": str(error)}), error.status_code


# ---------------------------------------------------------------------------
# Auth (bcrypt password gate)
# ---------------------------------------------------------------------------


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _load_password_hash() -> str:
    """Return the stored bcrypt hash; seed with DEFAULT_PASSWORD on first run."""
    data = read_json(AUTH_FILE, None)
    if isinstance(data, dict) and isinstance(data.get("hash"), str) and data["hash"]:
        return data["hash"]
    new_hash = _hash_password(DEFAULT_PASSWORD)
    write_json(AUTH_FILE, {"hash": new_hash})
    return new_hash


def _check_password(password: str) -> bool:
    if not isinstance(password, str) or not password:
        return False
    try:
        return bcrypt.checkpw(password.encode("utf-8"), _load_password_hash().encode("utf-8"))
    except ValueError:
        return False


@bp.route("/auth/verify", methods=["POST", "OPTIONS"])
def auth_verify():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    password = payload.get("password")
    if not _check_password(password if isinstance(password, str) else ""):
        return jsonify({"ok": False, "error": "密码错误"}), 401
    return jsonify({"ok": True})


@bp.route("/auth/change-password", methods=["POST", "OPTIONS"])
def auth_change_password():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    current = payload.get("currentPassword")
    new_password = payload.get("newPassword")
    if not _check_password(current if isinstance(current, str) else ""):
        return jsonify({"ok": False, "error": "当前密码错误"}), 401
    if not isinstance(new_password, str) or len(new_password) < 4:
        return jsonify({"ok": False, "error": "新密码至少 4 个字符"}), 400
    write_json(AUTH_FILE, {"hash": _hash_password(new_password)})
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _validate_date(value: Any) -> str:
    text = str(value or "").strip()[:10]
    match = DATE_RX.match(text)
    if not match:
        raise RecordError("`date` must look like YYYY-MM-DD.")
    year, month, day = (int(p) for p in match.groups())
    try:
        datetime(year=year, month=month, day=day)
    except ValueError as exc:
        raise RecordError(f"Invalid calendar date: {exc}.")
    return text


def _month_file(year: int, month: int) -> Path:
    return ENTRIES_DIR / f"{year:04d}" / f"{month:02d}.json"


def _read_month(year: int, month: int) -> list[dict[str, Any]]:
    items = read_json(_month_file(year, month), [])
    return items if isinstance(items, list) else []


def _write_month(year: int, month: int, items: list[dict[str, Any]]) -> None:
    # Stable order: newest first inside the file (each item already has date+time).
    items_sorted = sorted(
        items, key=lambda e: (e.get("date", ""), e.get("createdAt", "")), reverse=True,
    )
    write_json(_month_file(year, month), items_sorted)


def _iter_all_entries() -> Iterable[tuple[int, int, dict[str, Any]]]:
    if not ENTRIES_DIR.exists():
        return
    for year_dir in sorted(ENTRIES_DIR.iterdir()):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
        for month_file in sorted(year_dir.glob("*.json")):
            year = int(year_dir.name)
            try:
                month = int(month_file.stem)
            except ValueError:
                continue
            for entry in _read_month(year, month):
                yield year, month, entry


_TAG_RX = re.compile(r"<[^>]+>")
_WS_RX = re.compile(r"\s+")


def _strip_html(value: str) -> str:
    no_tags = _TAG_RX.sub(" ", value or "")
    decoded = html.unescape(no_tags)
    return _WS_RX.sub(" ", decoded).strip()


def _auto_summary(body_html: str) -> str:
    plain = _strip_html(body_html)
    if len(plain) <= SUMMARY_MAX:
        return plain
    cut = plain[: SUMMARY_MAX].rstrip()
    return cut + "…"


def _sanitise_html(raw: str) -> str:
    """Very small allowlist sanitiser.

    Removes any tag not in ALLOWED_TAGS and strips attributes that are not in
    ALLOWED_ATTRS. Keeps line breaks. Not a full HTML5 parser — we accept
    minor breakage because the input comes from the app's own editor.
    """
    if not raw:
        return ""

    def keep_tag(match: re.Match[str]) -> str:
        full = match.group(0)
        slash = full.startswith("</")
        # tag name
        name_match = re.match(r"</?([A-Za-z][A-Za-z0-9]*)", full)
        if not name_match:
            return ""
        name = name_match.group(1).lower()
        if name not in ALLOWED_TAGS:
            return ""
        if slash:
            return f"</{name}>"
        # collect allowed attributes
        attrs = ""
        if name in ALLOWED_ATTRS:
            for attr_match in re.finditer(
                r'([A-Za-z][\w-]*)\s*=\s*"([^"]*)"', full,
            ):
                attr_name = attr_match.group(1).lower()
                if attr_name in ALLOWED_ATTRS[name]:
                    safe_value = (
                        attr_match.group(2)
                        .replace("javascript:", "")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                    )
                    attrs += f' {attr_name}="{safe_value}"'
        # self-close hr / br
        if name in {"br", "hr"}:
            return f"<{name}{attrs}/>"
        return f"<{name}{attrs}>"

    cleaned = re.sub(r"<[^>]+>", keep_tag, raw)
    return cleaned


def _new_id(date: str) -> str:
    return f"{date.replace('-', '')}-{secrets.token_hex(2)}"


def _normalise_tags(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        items = [piece.strip() for piece in value.split(",")]
    else:
        items = [str(piece).strip() for piece in value]
    seen, out = set(), []
    for item in items:
        if not item:
            continue
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def _entry_summary_view(entry: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": entry.get("id"),
        "date": entry.get("date"),
        "title": entry.get("title"),
        "summary": entry.get("summary"),
        "tags": entry.get("tags") or [],
        "wordCount": entry.get("wordCount", 0),
        "createdAt": entry.get("createdAt"),
        "updatedAt": entry.get("updatedAt"),
    }


# ---------------------------------------------------------------------------
# Master CSV regeneration
# ---------------------------------------------------------------------------


def _rebuild_index_csv() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, Any]] = []
    for year, month, entry in _iter_all_entries():
        rows.append({
            "id": entry.get("id", ""),
            "date": entry.get("date", ""),
            "title": entry.get("title", ""),
            "summary": entry.get("summary", ""),
            "tags": ";".join(entry.get("tags") or []),
            "wordCount": entry.get("wordCount", 0),
            "file": f"entries/{year:04d}/{month:02d}.json",
            "createdAt": entry.get("createdAt", ""),
            "updatedAt": entry.get("updatedAt", ""),
        })

    rows.sort(key=lambda row: (row["date"], row["createdAt"]), reverse=True)
    with INDEX_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "date", "id", "title", "summary", "tags",
                "wordCount", "file", "createdAt", "updatedAt",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)


# ---------------------------------------------------------------------------
# Calendar endpoint
# ---------------------------------------------------------------------------


@bp.route("/calendar", methods=["GET", "OPTIONS"])
def calendar():
    if request.method == "OPTIONS":
        return "", 204

    by_month: dict[tuple[int, int], dict[str, Any]] = {}
    total = 0
    for year, month, entry in _iter_all_entries():
        key = (year, month)
        bucket = by_month.setdefault(key, {
            "year": year,
            "month": month,
            "count": 0,
            "days": {},
            "tags": set(),
        })
        bucket["count"] += 1
        day_key = entry.get("date", "")[-2:]
        bucket["days"][day_key] = bucket["days"].get(day_key, 0) + 1
        for tag in entry.get("tags") or []:
            bucket["tags"].add(tag)
        total += 1

    months = []
    for (year, month), bucket in sorted(by_month.items(), reverse=True):
        months.append({
            "year": bucket["year"],
            "month": bucket["month"],
            "count": bucket["count"],
            "days": [
                {"day": int(day), "count": count}
                for day, count in sorted(bucket["days"].items())
            ],
            "tags": sorted(bucket["tags"]),
        })

    return jsonify({"totalEntries": total, "months": months})


# ---------------------------------------------------------------------------
# Month entries (full bodies)
# ---------------------------------------------------------------------------


@bp.route("/month/<int:year>/<int:month>", methods=["GET", "OPTIONS"])
def month(year: int, month: int):
    if request.method == "OPTIONS":
        return "", 204
    if not (1 <= month <= 12):
        raise RecordError("Month must be between 1 and 12.")
    entries = _read_month(year, month)
    return jsonify({"year": year, "month": month, "entries": entries})


# ---------------------------------------------------------------------------
# Entry CRUD
# ---------------------------------------------------------------------------


def _persist_entry(entry: dict[str, Any]) -> dict[str, Any]:
    year = int(entry["date"][:4])
    month_num = int(entry["date"][5:7])
    items = _read_month(year, month_num)
    # Replace if same id exists, otherwise append.
    found = False
    for index, existing in enumerate(items):
        if existing.get("id") == entry["id"]:
            items[index] = entry
            found = True
            break
    if not found:
        items.append(entry)
    _write_month(year, month_num, items)
    _rebuild_index_csv()
    return entry


@bp.route("/entries", methods=["POST", "OPTIONS"])
def create_entry():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    date = _validate_date(payload.get("date") or datetime.now().date().isoformat())
    title = str(payload.get("title") or "").strip() or "Untitled"
    body_html = _sanitise_html(str(payload.get("body") or ""))
    summary = str(payload.get("summary") or "").strip() or _auto_summary(body_html)
    tags = _normalise_tags(payload.get("tags"))
    mood = payload.get("mood")
    now = _now_iso()
    entry = {
        "id": _new_id(date),
        "date": date,
        "createdAt": now,
        "updatedAt": now,
        "title": title[:200],
        "summary": summary[:SUMMARY_MAX + 1],
        "body": body_html,
        "tags": tags,
        "mood": mood if isinstance(mood, str) and mood else None,
        "wordCount": len(_strip_html(body_html).split()),
    }
    _persist_entry(entry)
    return jsonify(entry), 201


def _find_entry(entry_id: str) -> tuple[int, int, list[dict[str, Any]], int]:
    """Return (year, month, items, index). Raises if not found."""
    for year, month_num, entry in _iter_all_entries():
        if entry.get("id") == entry_id:
            items = _read_month(year, month_num)
            for index, candidate in enumerate(items):
                if candidate.get("id") == entry_id:
                    return year, month_num, items, index
    raise RecordError("Entry not found.", 404)


@bp.route("/entries/<entry_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_entry(entry_id: str):
    if request.method == "OPTIONS":
        return "", 204

    year, month_num, items, index = _find_entry(entry_id)
    entry = items[index]

    if request.method == "DELETE":
        items.pop(index)
        _write_month(year, month_num, items)
        _rebuild_index_csv()
        return jsonify({"deletedId": entry_id})

    payload = request.get_json(silent=True) or {}
    if "date" in payload:
        new_date = _validate_date(payload["date"])
        if new_date != entry["date"]:
            # Move entry to a (possibly) different month file.
            items.pop(index)
            _write_month(year, month_num, items)
            entry["date"] = new_date
    if "title" in payload:
        entry["title"] = str(payload["title"] or "").strip()[:200] or "Untitled"
    if "body" in payload:
        entry["body"] = _sanitise_html(str(payload["body"] or ""))
        entry["wordCount"] = len(_strip_html(entry["body"]).split())
        if "summary" not in payload:
            entry["summary"] = _auto_summary(entry["body"])
    if "summary" in payload:
        entry["summary"] = str(payload["summary"] or "").strip()[:SUMMARY_MAX + 1]
    if "tags" in payload:
        entry["tags"] = _normalise_tags(payload["tags"])
    if "mood" in payload:
        mood = payload["mood"]
        entry["mood"] = mood if isinstance(mood, str) and mood else None
    entry["updatedAt"] = _now_iso()

    _persist_entry(entry)  # writes to new month file if date moved
    return jsonify(entry)


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------


@bp.route("/search", methods=["GET", "OPTIONS"])
def search():
    if request.method == "OPTIONS":
        return "", 204
    needle = (request.args.get("q") or "").strip().lower()
    tag_filter = (request.args.get("tag") or "").strip().lower()
    matches: list[dict[str, Any]] = []
    for _, _, entry in _iter_all_entries():
        if tag_filter:
            tags = {t.lower() for t in entry.get("tags") or []}
            if tag_filter not in tags:
                continue
        if needle:
            hay = " ".join([
                entry.get("title") or "",
                entry.get("summary") or "",
                " ".join(entry.get("tags") or []),
                _strip_html(entry.get("body") or ""),
            ]).lower()
            if needle not in hay:
                continue
        matches.append(_entry_summary_view(entry))
    matches.sort(key=lambda row: (row.get("date") or "", row.get("createdAt") or ""), reverse=True)
    return jsonify({"query": needle, "tag": tag_filter, "matches": matches})


# ---------------------------------------------------------------------------
# Exports
# ---------------------------------------------------------------------------


@bp.route("/export/month/<int:year>/<int:month>.json", methods=["GET", "OPTIONS"])
def export_month(year: int, month: int):
    if request.method == "OPTIONS":
        return "", 204
    if not (1 <= month <= 12):
        raise RecordError("Month must be between 1 and 12.")
    payload = json.dumps({
        "year": year,
        "month": month,
        "exportedAt": _now_iso(),
        "entries": _read_month(year, month),
    }, ensure_ascii=False, indent=2)
    return Response(
        payload,
        mimetype="application/json",
        headers={"Content-Disposition": f'attachment; filename="record-meditation-{year:04d}-{month:02d}.json"'},
    )


@bp.route("/export/year/<int:year>.zip", methods=["GET", "OPTIONS"])
def export_year(year: int):
    if request.method == "OPTIONS":
        return "", 204
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        year_dir = ENTRIES_DIR / f"{year:04d}"
        if year_dir.exists():
            for path in sorted(year_dir.glob("*.json")):
                with path.open("r", encoding="utf-8") as handle:
                    zf.writestr(f"{year:04d}/{path.name}", handle.read())
        # Stick the master CSV in too for convenience.
        if INDEX_CSV.exists():
            with INDEX_CSV.open("r", encoding="utf-8-sig") as handle:
                zf.writestr("entries-index.csv", handle.read())
    buffer.seek(0)
    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name=f"record-meditation-{year:04d}.zip",
    )


@bp.route("/export/csv", methods=["GET", "OPTIONS"])
def export_csv():
    if request.method == "OPTIONS":
        return "", 204
    if not INDEX_CSV.exists():
        _rebuild_index_csv()
    return send_file(
        INDEX_CSV,
        mimetype="text/csv",
        as_attachment=True,
        download_name="record-meditation-index.csv",
    )


@bp.route("/export/all.zip", methods=["GET", "OPTIONS"])
def export_all():
    if request.method == "OPTIONS":
        return "", 204
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        if ENTRIES_DIR.exists():
            for path in sorted(ENTRIES_DIR.glob("**/*.json")):
                rel = path.relative_to(DATA_DIR)
                zf.writestr(str(rel).replace("\\", "/"), path.read_text(encoding="utf-8"))
        if INDEX_CSV.exists():
            zf.writestr("entries-index.csv", INDEX_CSV.read_text(encoding="utf-8-sig"))
    buffer.seek(0)
    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="record-meditation-all.zip",
    )
