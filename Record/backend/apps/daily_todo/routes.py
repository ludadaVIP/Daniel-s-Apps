"""Daily Todo blueprint.

Mounted at ``/api/daily-todo``. Data lives in ``backend/data/DailyTodo/``.
The app keeps daily planning data in one compact JSON file because todos are
usually scanned together by day rather than archived like long-form notes.
"""

from __future__ import annotations

import os
import re
import secrets
from datetime import date as date_cls
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "DailyTodo"
DATA_DIR = Path(os.environ.get("DAILY_TODO_DATA_DIR", DEFAULT_DATA_DIR))
DATA_FILE = DATA_DIR / "planner.json"

DATE_RX = re.compile(r"^(\d{4})-(\d{2})-(\d{2})$")
STATUSES = {"todo", "doing", "done", "skipped"}
PRIORITIES = {"low", "normal", "high", "urgent"}
FREQUENCIES = {"daily", "weekdays", "weekly"}
DEFAULT_SECTIONS = ["晨间启动", "深度工作", "日常事务", "生活健康", "晚间复盘"]

bp = Blueprint("daily_todo", __name__)


class DailyTodoError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(DailyTodoError)
def handle_error(error: DailyTodoError):
    return jsonify({"error": str(error)}), error.status_code


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _today_iso() -> str:
    return datetime.now().date().isoformat()


def _validate_date(value: Any) -> str:
    text = str(value or "").strip()[:10]
    match = DATE_RX.match(text)
    if not match:
        raise DailyTodoError("Date must look like YYYY-MM-DD.")
    year, month, day = (int(piece) for piece in match.groups())
    try:
        datetime(year=year, month=month, day=day)
    except ValueError as exc:
        raise DailyTodoError(f"Invalid calendar date: {exc}.")
    return text


def _new_id(date: str) -> str:
    return f"{date.replace('-', '')}-{secrets.token_hex(3)}"


def _normalise_tags(value: Any) -> list[str]:
    if value is None:
        return []
    pieces = value.split(",") if isinstance(value, str) else value
    seen: set[str] = set()
    tags: list[str] = []
    for piece in pieces:
        tag = re.sub(r"\s+", " ", str(piece or "").strip())[:36]
        if not tag:
            continue
        key = tag.lower()
        if key in seen:
            continue
        seen.add(key)
        tags.append(tag)
    return tags


def _normalise_status(value: Any) -> str:
    status = str(value or "todo").strip()
    return status if status in STATUSES else "todo"


def _normalise_priority(value: Any) -> str:
    priority = str(value or "normal").strip()
    return priority if priority in PRIORITIES else "normal"


def _normalise_minutes(value: Any) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(number, 1440))


def _safe_text(value: Any, fallback: str = "", limit: int = 240) -> str:
    text = re.sub(r"\s+", " ", str(value or "").strip())
    return (text or fallback)[:limit]


def _empty_store() -> dict[str, Any]:
    return {
        "dates": {},
        "todos": {},
        "recurring": [],
        "sections": DEFAULT_SECTIONS,
    }


def _load_store() -> dict[str, Any]:
    store = read_json(DATA_FILE, None)
    if not isinstance(store, dict):
        store = _empty_store()
    dates = store.get("dates")
    todos = store.get("todos")
    recurring = store.get("recurring")
    sections = store.get("sections")
    if not isinstance(dates, dict):
        dates = {}
    if not isinstance(todos, dict):
        todos = {}
    if not isinstance(recurring, list):
        recurring = []
    if not isinstance(sections, list):
        sections = DEFAULT_SECTIONS
    store = {"dates": dates, "todos": todos, "recurring": recurring, "sections": sections}
    if not dates and not todos:
        today = _today_iso()
        now = _now_iso()
        dates[today] = {
            "date": today,
            "title": "今天",
            "notes": "",
            "createdAt": now,
            "updatedAt": now,
        }
        write_json(DATA_FILE, store)
    return store


def _save_store(store: dict[str, Any]) -> None:
    write_json(DATA_FILE, store)


def _ensure_date(store: dict[str, Any], date: str, title: str | None = None) -> dict[str, Any]:
    now = _now_iso()
    dates = store["dates"]
    if date not in dates:
        dates[date] = {
            "date": date,
            "title": title or date,
            "notes": "",
            "createdAt": now,
            "updatedAt": now,
        }
    return dates[date]


def _todo_sort_key(todo: dict[str, Any]) -> tuple[str, int, str, str]:
    priority_rank = {"urgent": 0, "high": 1, "normal": 2, "low": 3}
    status_rank = {"doing": 0, "todo": 1, "done": 2, "skipped": 3}
    return (
        str(todo.get("date") or ""),
        status_rank.get(todo.get("status"), 4),
        priority_rank.get(todo.get("priority"), 4),
        str(todo.get("dueTime") or "99:99"),
    )


def _parse_date(value: str) -> date_cls:
    return datetime.strptime(_validate_date(value), "%Y-%m-%d").date()


def _date_range(start: str, end: str) -> list[str]:
    start_day = _parse_date(start)
    end_day = _parse_date(end)
    if end_day < start_day:
        start_day, end_day = end_day, start_day
    if (end_day - start_day).days > 370:
        end_day = start_day + timedelta(days=370)
    out = []
    current = start_day
    while current <= end_day:
        out.append(current.isoformat())
        current += timedelta(days=1)
    return out


def _default_window() -> tuple[str, str]:
    today = _parse_date(_today_iso())
    return (today - timedelta(days=31)).isoformat(), (today + timedelta(days=92)).isoformat()


def _request_window() -> tuple[str, str]:
    default_start, default_end = _default_window()
    return (
        _validate_date(request.args.get("start") or default_start),
        _validate_date(request.args.get("end") or default_end),
    )


def _date_stats(store: dict[str, Any], date: str) -> dict[str, int]:
    day_todos = [todo for todo in store["todos"].values() if todo.get("date") == date]
    done = sum(1 for todo in day_todos if todo.get("status") == "done")
    skipped = sum(1 for todo in day_todos if todo.get("status") == "skipped")
    doing = sum(1 for todo in day_todos if todo.get("status") == "doing")
    total = len(day_todos)
    return {
        "total": total,
        "done": done,
        "doing": doing,
        "skipped": skipped,
        "open": max(0, total - done - skipped),
        "minutes": sum(_normalise_minutes(todo.get("estimateMinutes")) for todo in day_todos),
    }


def _tree(store: dict[str, Any]) -> list[dict[str, Any]]:
    dates = sorted(store["dates"].values(), key=lambda item: item.get("date", ""), reverse=True)
    years: dict[str, dict[str, Any]] = {}
    for day in dates:
        date = day.get("date", "")
        year_key, month_key, day_key = date[:4], date[5:7], date[8:10]
        year = years.setdefault(year_key, {"year": int(year_key), "months": [], "_months": {}})
        month = year["_months"].setdefault(
            month_key,
            {"year": int(year_key), "month": int(month_key), "days": []},
        )
        stats = _date_stats(store, date)
        month["days"].append({
            "date": date,
            "day": int(day_key),
            "title": day.get("title") or date,
            "notes": day.get("notes") or "",
            **stats,
        })
    out = []
    for year in sorted(years.values(), key=lambda item: item["year"], reverse=True):
        months = []
        for month in sorted(year["_months"].values(), key=lambda item: item["month"], reverse=True):
            month["days"].sort(key=lambda item: item["date"], reverse=True)
            month["total"] = sum(day["total"] for day in month["days"])
            month["done"] = sum(day["done"] for day in month["days"])
            months.append(month)
        year["months"] = months
        year["total"] = sum(month["total"] for month in months)
        year["done"] = sum(month["done"] for month in months)
        year.pop("_months", None)
        out.append(year)
    return out


def _find_todo(store: dict[str, Any], todo_id: str) -> dict[str, Any]:
    todo = store["todos"].get(todo_id)
    if not isinstance(todo, dict):
        raise DailyTodoError("Todo not found.", 404)
    return todo


def _normalise_weekdays(value: Any) -> list[int]:
    pieces = value if isinstance(value, list) else []
    out: list[int] = []
    for piece in pieces:
        try:
            number = int(piece)
        except (TypeError, ValueError):
            continue
        if 0 <= number <= 6 and number not in out:
            out.append(number)
    return sorted(out)


def _recurring_from_payload(payload: dict[str, Any], existing: dict[str, Any] | None = None) -> dict[str, Any]:
    base = dict(existing or {})
    if "title" in payload or not base.get("title"):
        base["title"] = _safe_text(payload.get("title"), "重复任务", 160)
    if "frequency" in payload or not base.get("frequency"):
        frequency = str(payload.get("frequency") or base.get("frequency") or "daily").strip()
        base["frequency"] = frequency if frequency in FREQUENCIES else "daily"
    if "weekdays" in payload or "weekdays" not in base:
        base["weekdays"] = _normalise_weekdays(payload.get("weekdays"))
    if "startDate" in payload or not base.get("startDate"):
        base["startDate"] = _validate_date(payload.get("startDate") or base.get("startDate") or _today_iso())
    if "endDate" in payload:
        end_date = str(payload.get("endDate") or "").strip()
        base["endDate"] = _validate_date(end_date) if end_date else ""
    else:
        base.setdefault("endDate", "")
    if "active" in payload or "active" not in base:
        base["active"] = bool(payload.get("active", base.get("active", True)))
    todo_fields = _todo_from_payload({**base, **payload, "date": base["startDate"]}, base)
    for key in (
        "title", "notes", "priority", "section", "tags", "startTime",
        "dueTime", "estimateMinutes", "energy", "pinned",
    ):
        base[key] = todo_fields.get(key)
    base["status"] = "todo"
    return base


def _find_recurring(store: dict[str, Any], rule_id: str) -> dict[str, Any]:
    for rule in store["recurring"]:
        if isinstance(rule, dict) and rule.get("id") == rule_id:
            return rule
    raise DailyTodoError("Recurring rule not found.", 404)


def _rule_occurs_on(rule: dict[str, Any], day_text: str) -> bool:
    if not rule.get("active", True):
        return False
    day = _parse_date(day_text)
    start = _parse_date(rule.get("startDate") or _today_iso())
    if day < start:
        return False
    end_date = rule.get("endDate")
    if end_date and day > _parse_date(end_date):
        return False
    frequency = rule.get("frequency") or "daily"
    weekday = (day.weekday() + 1) % 7  # Sunday=0, Monday=1, ..., Saturday=6
    if frequency == "daily":
        return True
    if frequency == "weekdays":
        return 1 <= weekday <= 5
    if frequency == "weekly":
        weekdays = rule.get("weekdays") or [weekday]
        return weekday in weekdays
    return False


def _materialise_recurring(store: dict[str, Any], start: str, end: str) -> bool:
    changed = False
    existing = {
        (todo.get("recurringRuleId"), todo.get("date"))
        for todo in store["todos"].values()
        if todo.get("recurringRuleId") and todo.get("date")
    }
    for day_text in _date_range(start, end):
        for rule in store["recurring"]:
            if not isinstance(rule, dict) or not rule.get("id"):
                continue
            key = (rule["id"], day_text)
            if key in existing or not _rule_occurs_on(rule, day_text):
                continue
            now = _now_iso()
            todo = _todo_from_payload({
                "date": day_text,
                "title": rule.get("title"),
                "notes": rule.get("notes"),
                "priority": rule.get("priority"),
                "section": rule.get("section"),
                "tags": rule.get("tags"),
                "startTime": rule.get("startTime"),
                "dueTime": rule.get("dueTime"),
                "estimateMinutes": rule.get("estimateMinutes"),
                "energy": rule.get("energy"),
                "pinned": rule.get("pinned"),
                "status": "todo",
            })
            todo["id"] = _new_id(day_text)
            todo["recurringRuleId"] = rule["id"]
            todo["createdAt"] = now
            todo["updatedAt"] = now
            _ensure_date(store, day_text, day_text)
            store["todos"][todo["id"]] = todo
            existing.add(key)
            changed = True
    return changed


def _sync_future_recurring_todos(store: dict[str, Any], rule: dict[str, Any]) -> None:
    today = _today_iso()
    remove_ids: list[str] = []
    for todo_id, todo in store["todos"].items():
        if (
            todo.get("recurringRuleId") != rule.get("id")
            or todo.get("date", "") < today
            or todo.get("status") != "todo"
        ):
            continue
        if not _rule_occurs_on(rule, todo.get("date") or today):
            remove_ids.append(todo_id)
            continue
        for key in (
            "title", "notes", "priority", "section", "tags", "startTime",
            "dueTime", "estimateMinutes", "energy", "pinned",
        ):
            todo[key] = rule.get(key, todo.get(key))
        todo["updatedAt"] = _now_iso()
    for todo_id in remove_ids:
        store["todos"].pop(todo_id, None)


def _todo_from_payload(payload: dict[str, Any], existing: dict[str, Any] | None = None) -> dict[str, Any]:
    base = dict(existing or {})
    if "date" in payload or not base.get("date"):
        base["date"] = _validate_date(payload.get("date") or base.get("date") or _today_iso())
    if "title" in payload or not base.get("title"):
        base["title"] = _safe_text(payload.get("title"), "新的待办", 160)
    if "notes" in payload:
        base["notes"] = str(payload.get("notes") or "")[:5000]
    else:
        base.setdefault("notes", "")
    if "status" in payload or not base.get("status"):
        base["status"] = _normalise_status(payload.get("status") or base.get("status"))
    if "priority" in payload or not base.get("priority"):
        base["priority"] = _normalise_priority(payload.get("priority") or base.get("priority"))
    if "section" in payload or not base.get("section"):
        base["section"] = _safe_text(payload.get("section") or base.get("section"), "日常事务", 60)
    if "tags" in payload or "tags" not in base:
        base["tags"] = _normalise_tags(payload.get("tags", base.get("tags", [])))
    for key in ("startTime", "dueTime"):
        if key in payload:
            value = str(payload.get(key) or "").strip()
            base[key] = value[:5] if re.match(r"^\d{2}:\d{2}$", value) else ""
        else:
            base.setdefault(key, "")
    if "estimateMinutes" in payload or "estimateMinutes" not in base:
        base["estimateMinutes"] = _normalise_minutes(payload.get("estimateMinutes", base.get("estimateMinutes", 0)))
    if "energy" in payload or "energy" not in base:
        base["energy"] = _safe_text(payload.get("energy") or base.get("energy"), "medium", 20)
    if "pinned" in payload or "pinned" not in base:
        base["pinned"] = bool(payload.get("pinned", base.get("pinned", False)))
    return base


@bp.route("/planner", methods=["GET", "OPTIONS"])
def planner():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    start, end = _request_window()
    if _materialise_recurring(store, start, end):
        _save_store(store)
    todos = list(store["todos"].values())
    total = len(todos)
    done = sum(1 for todo in todos if todo.get("status") == "done")
    tags = sorted({tag for todo in todos for tag in todo.get("tags", [])})
    return jsonify({
        "tree": _tree(store),
        "sections": store["sections"],
        "recurring": store["recurring"],
        "tags": tags,
        "stats": {
            "dates": len(store["dates"]),
            "total": total,
            "done": done,
            "open": total - done,
        },
    })


@bp.route("/dates", methods=["POST", "OPTIONS"])
def create_date():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    payload = request.get_json(silent=True) or {}
    date = _validate_date(payload.get("date") or _today_iso())
    if date in store["dates"]:
        raise DailyTodoError("Date already exists.")
    day = _ensure_date(store, date, _safe_text(payload.get("title"), date, 80))
    day["notes"] = str(payload.get("notes") or "")[:1200]
    _save_store(store)
    return jsonify(day), 201


@bp.route("/dates/<date>", methods=["GET", "PATCH", "DELETE", "OPTIONS"])
def date_detail(date: str):
    if request.method == "OPTIONS":
        return "", 204
    current_date = _validate_date(date)
    store = _load_store()
    if _materialise_recurring(store, current_date, current_date):
        _save_store(store)
    if current_date not in store["dates"]:
        raise DailyTodoError("Date not found.", 404)

    if request.method == "GET":
        todos = [
            todo for todo in store["todos"].values()
            if todo.get("date") == current_date
        ]
        todos.sort(key=_todo_sort_key)
        return jsonify({"date": store["dates"][current_date], "todos": todos})

    if request.method == "DELETE":
        delete_todos = request.args.get("deleteTodos", "true").lower() != "false"
        if delete_todos:
            store["todos"] = {
                todo_id: todo for todo_id, todo in store["todos"].items()
                if todo.get("date") != current_date
            }
        elif any(todo.get("date") == current_date for todo in store["todos"].values()):
            raise DailyTodoError("This date still has todos.")
        deleted = store["dates"].pop(current_date)
        _save_store(store)
        return jsonify({"deletedDate": deleted["date"]})

    payload = request.get_json(silent=True) or {}
    day = store["dates"][current_date]
    new_date = _validate_date(payload.get("date") or current_date)
    if new_date != current_date:
        if new_date in store["dates"]:
            raise DailyTodoError("Target date already exists.")
        day = {**day, "date": new_date}
        store["dates"][new_date] = day
        del store["dates"][current_date]
        for todo in store["todos"].values():
            if todo.get("date") == current_date:
                todo["date"] = new_date
                todo["updatedAt"] = _now_iso()
    if "title" in payload:
        day["title"] = _safe_text(payload.get("title"), new_date, 80)
    if "notes" in payload:
        day["notes"] = str(payload.get("notes") or "")[:1200]
    day["updatedAt"] = _now_iso()
    _save_store(store)
    return jsonify(day)


@bp.route("/todos", methods=["POST", "OPTIONS"])
def create_todo():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    payload = request.get_json(silent=True) or {}
    todo = _todo_from_payload(payload)
    now = _now_iso()
    todo["id"] = _new_id(todo["date"])
    todo["createdAt"] = now
    todo["updatedAt"] = now
    _ensure_date(store, todo["date"])
    store["todos"][todo["id"]] = todo
    _save_store(store)
    return jsonify(todo), 201


@bp.route("/recurring", methods=["POST", "OPTIONS"])
def create_recurring():
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    payload = request.get_json(silent=True) or {}
    now = _now_iso()
    rule = _recurring_from_payload(payload)
    rule["id"] = f"rule-{secrets.token_hex(4)}"
    rule["createdAt"] = now
    rule["updatedAt"] = now
    store["recurring"].append(rule)
    start, end = _request_window()
    _materialise_recurring(store, start, end)
    _save_store(store)
    return jsonify(rule), 201


@bp.route("/recurring/<rule_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_recurring(rule_id: str):
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    rule = _find_recurring(store, rule_id)
    if request.method == "DELETE":
        today = _today_iso()
        store["recurring"] = [item for item in store["recurring"] if item.get("id") != rule_id]
        store["todos"] = {
            todo_id: todo for todo_id, todo in store["todos"].items()
            if not (
                todo.get("recurringRuleId") == rule_id
                and todo.get("date", "") >= today
                and todo.get("status") == "todo"
            )
        }
        _save_store(store)
        return jsonify({"deletedId": rule_id})
    payload = request.get_json(silent=True) or {}
    updated = _recurring_from_payload(payload, rule)
    updated["id"] = rule_id
    updated.setdefault("createdAt", _now_iso())
    updated["updatedAt"] = _now_iso()
    for index, item in enumerate(store["recurring"]):
        if item.get("id") == rule_id:
            store["recurring"][index] = updated
            break
    _sync_future_recurring_todos(store, updated)
    start, end = _request_window()
    _materialise_recurring(store, start, end)
    _save_store(store)
    return jsonify(updated)


@bp.route("/todos/<todo_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_todo(todo_id: str):
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    todo = _find_todo(store, todo_id)
    if request.method == "DELETE":
        del store["todos"][todo_id]
        _save_store(store)
        return jsonify({"deletedId": todo_id})
    payload = request.get_json(silent=True) or {}
    updated = _todo_from_payload(payload, todo)
    updated["id"] = todo_id
    updated.setdefault("createdAt", _now_iso())
    updated["updatedAt"] = _now_iso()
    _ensure_date(store, updated["date"])
    store["todos"][todo_id] = updated
    _save_store(store)
    return jsonify(updated)


@bp.route("/todos/<todo_id>/duplicate", methods=["POST", "OPTIONS"])
def duplicate_todo(todo_id: str):
    if request.method == "OPTIONS":
        return "", 204
    store = _load_store()
    source = _find_todo(store, todo_id)
    payload = request.get_json(silent=True) or {}
    target_date = _validate_date(payload.get("date") or source.get("date") or _today_iso())
    now = _now_iso()
    clone = {**source}
    clone["id"] = _new_id(target_date)
    clone["date"] = target_date
    clone["status"] = "todo"
    clone["createdAt"] = now
    clone["updatedAt"] = now
    _ensure_date(store, target_date)
    store["todos"][clone["id"]] = clone
    _save_store(store)
    return jsonify(clone), 201
