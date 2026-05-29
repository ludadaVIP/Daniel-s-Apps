"""Minimal YAML-frontmatter + markdown reader used by the Investment app.

We deliberately avoid a PyYAML dependency — the schema we use is small enough
that a hand-rolled parser is easier to reason about and impossible to break
with surprise constructs. Supported in front matter:

  - simple ``key: value`` lines (value is a string)
  - flow-style lists ``key: [a, b, "c with space"]``
  - block scalar list (``key:\n  - item\n  - item``)
  - comments (``# ...``) and blank lines are skipped
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


_FRONT_DELIM = "---"


@dataclass(frozen=True)
class MarkdownDoc:
    meta: dict[str, Any]
    body: str
    raw: str


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    """Split a markdown string into (meta, body)."""
    if not text.startswith(_FRONT_DELIM):
        return {}, text
    lines = text.splitlines()
    if not lines or lines[0].strip() != _FRONT_DELIM:
        return {}, text
    end_index: int | None = None
    for i in range(1, len(lines)):
        if lines[i].strip() == _FRONT_DELIM:
            end_index = i
            break
    if end_index is None:
        return {}, text
    front_lines = lines[1:end_index]
    body = "\n".join(lines[end_index + 1:]).lstrip("\n")
    return _parse_front_block(front_lines), body


def _parse_front_block(lines: list[str]) -> dict[str, Any]:
    meta: dict[str, Any] = {}
    pending_list_key: str | None = None
    pending_list: list[str] = []
    for raw_line in lines:
        line = raw_line.rstrip()
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        # Continuation of a block list (key:\n  - item)
        stripped = line.lstrip()
        if pending_list_key is not None and stripped.startswith("- "):
            pending_list.append(_strip_string(stripped[2:].strip()))
            continue
        if pending_list_key is not None:
            meta[pending_list_key] = pending_list
            pending_list_key = None
            pending_list = []
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if not value:
            # Possibly start of a block list — wait for the next iteration.
            pending_list_key = key
            pending_list = []
            continue
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            if not inner:
                meta[key] = []
            else:
                meta[key] = [_strip_string(piece) for piece in _split_flow_list(inner)]
            continue
        meta[key] = _strip_string(value)
    if pending_list_key is not None:
        meta[pending_list_key] = pending_list
    return meta


def _split_flow_list(text: str) -> list[str]:
    """Split a flow-style YAML list inside [...] while respecting quoted commas."""
    out: list[str] = []
    buf: list[str] = []
    quote: str | None = None
    for ch in text:
        if quote:
            buf.append(ch)
            if ch == quote:
                quote = None
            continue
        if ch in ("'", '"'):
            quote = ch
            buf.append(ch)
            continue
        if ch == ",":
            piece = "".join(buf).strip()
            if piece:
                out.append(piece)
            buf = []
            continue
        buf.append(ch)
    tail = "".join(buf).strip()
    if tail:
        out.append(tail)
    return out


def _strip_string(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def read_markdown(path: Path) -> MarkdownDoc:
    text = path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)
    return MarkdownDoc(meta=meta, body=body, raw=text)


_ONE_LINER_RX = re.compile(r"^##\s*一句话\s*$", re.MULTILINE)


def extract_one_line(body: str, *, fallback_chars: int = 120) -> str:
    """Pull the "## 一句话" section's first non-empty line, or fall back to the
    first prose paragraph trimmed to fallback_chars."""
    match = _ONE_LINER_RX.search(body)
    if match:
        tail = body[match.end():]
        for line in tail.splitlines():
            text = line.strip()
            if not text or text.startswith("#"):
                if text.startswith("#") and "一句话" not in text:
                    break
                continue
            return text[:fallback_chars]
    # fallback: first non-heading paragraph
    for line in body.splitlines():
        text = line.strip()
        if not text or text.startswith("#") or text.startswith(">") or text.startswith("-"):
            continue
        return text[:fallback_chars]
    return ""


def make_snippet(text: str, query_lower: str, *, before: int = 40, after: int = 120) -> str:
    """Return a short snippet around the first occurrence of query_lower."""
    if not query_lower:
        return text[:before + after].replace("\n", " ").strip()
    idx = text.lower().find(query_lower)
    if idx < 0:
        return text[:before + after].replace("\n", " ").strip()
    start = max(0, idx - before)
    end = min(len(text), idx + after)
    snippet = text[start:end].replace("\n", " ").strip()
    if start > 0:
        snippet = "… " + snippet
    if end < len(text):
        snippet = snippet + " …"
    return snippet
