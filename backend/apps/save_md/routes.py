"""Save MD blueprint.

Mounted at ``/api/save-md``. Data lives in ``backend/data/SaveMD/``.
Documents are stored as plain ``.md`` files so existing Markdown notes can be
copied into category folders and rendered by the app without import steps.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import secrets
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.tts import audio_file_is_usable, generate_audio
from shared.voices import ALLOWED_VOICES, default_voice_for_language, normalise_language, voices_for_language

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "SaveMD"
DATA_DIR = Path(os.environ.get("SAVE_MD_DATA_DIR", DEFAULT_DATA_DIR))
AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
CATEGORIES_FILE = DATA_DIR / "categories.json"
METADATA_FILE = DATA_DIR / "metadata.json"

RESERVED_DIRS = {"audio", "__pycache__"}
DEFAULT_CATEGORIES = [
    {"id": "english", "name": "英语"},
    {"id": "spanish", "name": "西语"},
    {"id": "french", "name": "法语"},
    {"id": "devotion", "name": "灵修"},
    {"id": "thoughts", "name": "思想"},
]
SEED_DOCS = {
    "english": {
        "How to Save a Useful AI Answer.md": "# How to Save a Useful AI Answer\n\nUse this space for answers worth reviewing later.\n\n- Keep the original wording.\n- Add one short note about why it matters.\n- Revisit it after a few days.\n",
        "Speaking Practice Ideas.md": "# Speaking Practice Ideas\n\nCollect practical prompts, corrections, and expressions that you want to reuse in conversation.\n",
        "Writing Feedback.md": "# Writing Feedback\n\nSave strong feedback about structure, tone, vocabulary, and grammar.\n",
    },
    "spanish": {
        "Expresiones útiles.md": "# Expresiones útiles\n\nGuarda frases naturales que puedas usar en clase, en una tutoría o durante un viaje.\n",
        "Correcciones de gramática.md": "# Correcciones de gramática\n\nAnota errores frecuentes, especialmente preposiciones, tiempos verbales y conectores.\n",
        "Ideas para hablar.md": "# Ideas para hablar\n\nTemas, ejemplos y respuestas modelo para practicar español oral.\n",
    },
    "french": {
        "Expressions naturelles.md": "# Expressions naturelles\n\nGarde ici les formulations qui sonnent naturelles en français parlé ou écrit.\n",
        "Notes de grammaire.md": "# Notes de grammaire\n\nQuelques rappels sur les temps, les prépositions et les tournures fréquentes.\n",
        "Pratique orale.md": "# Pratique orale\n\nQuestions, mini-réponses et exemples à relire avant de parler.\n",
    },
    "devotion": {
        "Prayer Notes.md": "# Prayer Notes\n\nSave prayers, reflections, and passages that you want to return to slowly.\n",
        "Bible Study Answers.md": "# Bible Study Answers\n\nKeep helpful explanations, cross references, and application notes.\n",
        "Sermon Reflections.md": "# Sermon Reflections\n\nCapture strong ideas from sermons, books, and conversations.\n",
    },
    "thoughts": {
        "Thinking Clearly.md": "# Thinking Clearly\n\nSave answers that sharpen your thinking or help you name a problem accurately.\n",
        "Life Decisions.md": "# Life Decisions\n\nKeep frameworks, tradeoffs, and questions that are worth revisiting.\n",
        "Quotes and Ideas.md": "# Quotes and Ideas\n\nCollect memorable ideas, metaphors, and practical lines you may use later.\n",
    },
}

bp = Blueprint("save_md", __name__)


class SaveMdError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(SaveMdError)
def handle_error(error: SaveMdError):
    return jsonify({"error": str(error)}), error.status_code


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _read_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return fallback


def _write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _safe_category_id(value: str) -> str:
    text = re.sub(r"[^a-z0-9_-]+", "-", str(value or "").strip().lower())
    text = re.sub(r"-+", "-", text).strip("-_")
    return text[:80] or f"category-{secrets.token_hex(3)}"


def _safe_filename(value: str) -> str:
    text = str(value or "").strip()
    text = re.sub(r"[\\/:*?\"<>|]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip(". ")
    if text.lower().endswith(".md"):
        text = text[:-3].strip(". ")
    return (text[:120] or f"Untitled {secrets.token_hex(3)}") + ".md"


def _category_dir(category_id: str) -> Path:
    categories = {item["id"] for item in _load_categories()}
    if category_id not in categories:
        raise SaveMdError("Category not found.", 404)
    path = (DATA_DIR / category_id).resolve()
    if DATA_DIR.resolve() not in path.parents and path != DATA_DIR.resolve():
        raise SaveMdError("Invalid category path.")
    return path


def _doc_path(category_id: str, doc_id: str) -> Path:
    filename = _safe_filename(doc_id)
    path = (_category_dir(category_id) / filename).resolve()
    if _category_dir(category_id).resolve() not in path.parents:
        raise SaveMdError("Invalid document path.")
    return path


def _unique_file_path(category_id: str, filename: str, ignore: Path | None = None) -> Path:
    folder = _category_dir(category_id)
    stem = Path(filename).stem
    suffix = ".md"
    candidate = folder / f"{stem}{suffix}"
    index = 2
    while candidate.exists() and (ignore is None or candidate.resolve() != ignore.resolve()):
        candidate = folder / f"{stem}-{index}{suffix}"
        index += 1
    return candidate


def _plain_text(markdown: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", markdown or "")
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[*_>#~|\\-]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _stats(markdown: str) -> dict[str, int]:
    plain = _plain_text(markdown)
    chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", plain))
    latin_words = len(re.findall(r"[A-Za-zÀ-ÿ0-9]+(?:[-'][A-Za-zÀ-ÿ0-9]+)?", plain))
    return {
        "charCount": len(plain),
        "wordCount": chinese_chars + latin_words,
    }


def _has_markdown_documents() -> bool:
    if not DATA_DIR.exists():
        return False
    return any(path.is_file() for path in DATA_DIR.glob("*/*.md"))


def _load_categories() -> list[dict[str, str]]:
    _ensure_seed_data()
    items = _read_json(CATEGORIES_FILE, DEFAULT_CATEGORIES)
    out: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in items if isinstance(items, list) else []:
        category_id = _safe_category_id(item.get("id") or item.get("name"))
        if category_id in seen or category_id in RESERVED_DIRS:
            continue
        seen.add(category_id)
        out.append({"id": category_id, "name": str(item.get("name") or category_id)})
    for path in sorted(DATA_DIR.iterdir()) if DATA_DIR.exists() else []:
        if path.is_dir() and path.name not in seen and path.name not in RESERVED_DIRS:
            out.append({"id": path.name, "name": path.name})
    return out


def _load_metadata() -> dict[str, Any]:
    data = _read_json(METADATA_FILE, {})
    return data if isinstance(data, dict) else {}


def _save_metadata(data: dict[str, Any]) -> None:
    _write_json(METADATA_FILE, data)


def _metadata_key(category_id: str, filename: str) -> str:
    return f"{category_id}/{filename}"


def _doc_summary(category_id: str, path: Path, metadata: dict[str, Any], content: str | None = None) -> dict[str, Any]:
    stat = path.stat()
    key = _metadata_key(category_id, path.name)
    meta = metadata.get(key, {}) if isinstance(metadata.get(key), dict) else {}
    if content is not None:
        stats = _stats(content)
        excerpt = _plain_text(content)[:180]
    else:
        stats = {
            "charCount": int(meta.get("charCount") or 0),
            "wordCount": int(meta.get("wordCount") or 0),
        }
        excerpt = str(meta.get("excerpt") or "")
    return {
        "id": path.stem,
        "filename": path.name,
        "title": path.stem,
        "categoryId": category_id,
        "createdAt": meta.get("createdAt") or datetime.fromtimestamp(stat.st_ctime, timezone.utc).isoformat(timespec="seconds"),
        "updatedAt": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
        "fileSize": stat.st_size,
        "charCount": stats["charCount"],
        "wordCount": stats["wordCount"],
        "excerpt": excerpt,
    }


def _metadata_for_content(existing: dict[str, Any] | None, content: str) -> dict[str, Any]:
    metadata = dict(existing or {})
    metadata.setdefault("createdAt", _now_iso())
    stats = _stats(content)
    metadata.update({
        "charCount": stats["charCount"],
        "wordCount": stats["wordCount"],
        "excerpt": _plain_text(content)[:180],
    })
    return metadata


def _ensure_seed_data() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    should_seed_docs = not CATEGORIES_FILE.exists() and not _has_markdown_documents()
    if not CATEGORIES_FILE.exists():
        _write_json(CATEGORIES_FILE, DEFAULT_CATEGORIES)
    for category in DEFAULT_CATEGORIES:
        (DATA_DIR / category["id"]).mkdir(parents=True, exist_ok=True)
    if not should_seed_docs:
        if not METADATA_FILE.exists():
            _save_metadata({})
        return
    metadata = _read_json(METADATA_FILE, {})
    changed = False
    now = _now_iso()
    for category in DEFAULT_CATEGORIES:
        folder = DATA_DIR / category["id"]
        folder.mkdir(parents=True, exist_ok=True)
        for filename, content in SEED_DOCS.get(category["id"], {}).items():
            path = folder / filename
            if not path.exists():
                path.write_text(content, encoding="utf-8")
                metadata[_metadata_key(category["id"], filename)] = {"createdAt": now}
                changed = True
    if changed and isinstance(metadata, dict):
        _save_metadata(metadata)


def _tts_cache_key(text: str, voice: str) -> str:
    payload = f"save-md-edge-tts-v1\n{voice}\n{text}"
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


def _tts_output_path(text: str, voice: str, language: str) -> tuple[str, Path]:
    cache_key = _tts_cache_key(text, voice)
    return cache_key, AUDIO_CACHE_DIR / language / voice / f"{cache_key}.mp3"


@bp.route("/library", methods=["GET", "OPTIONS"])
def library():
    if request.method == "OPTIONS":
        return "", 204
    metadata = _load_metadata()
    categories = []
    total_docs = 0
    for category in _load_categories():
        folder = DATA_DIR / category["id"]
        folder.mkdir(parents=True, exist_ok=True)
        docs = [
            _doc_summary(category["id"], path, metadata)
            for path in sorted(folder.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
        ]
        total_docs += len(docs)
        categories.append({**category, "documents": docs})
    return jsonify({"categories": categories, "totalDocuments": total_docs})


@bp.route("/categories", methods=["POST", "OPTIONS"])
def create_category():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name") or "").strip()
    if not name:
        raise SaveMdError("Category name is required.")
    categories = _load_categories()
    base_id = _safe_category_id(payload.get("id") or name)
    category_id = base_id
    existing = {item["id"] for item in categories}
    index = 2
    while category_id in existing or category_id in RESERVED_DIRS:
        category_id = f"{base_id}-{index}"
        index += 1
    categories.append({"id": category_id, "name": name[:80]})
    (DATA_DIR / category_id).mkdir(parents=True, exist_ok=True)
    _write_json(CATEGORIES_FILE, categories)
    return jsonify({"id": category_id, "name": name[:80], "documents": []}), 201


@bp.route("/categories/<category_id>", methods=["PATCH", "DELETE", "OPTIONS"])
def mutate_category(category_id: str):
    if request.method == "OPTIONS":
        return "", 204
    categories = _load_categories()
    match = next((item for item in categories if item["id"] == category_id), None)
    if not match:
        raise SaveMdError("Category not found.", 404)
    if request.method == "DELETE":
        shutil.rmtree(_category_dir(category_id), ignore_errors=True)
        categories = [item for item in categories if item["id"] != category_id]
        metadata = {
            key: value for key, value in _load_metadata().items()
            if not key.startswith(f"{category_id}/")
        }
        _write_json(CATEGORIES_FILE, categories)
        _save_metadata(metadata)
        return jsonify({"deletedId": category_id})
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name") or "").strip()
    if not name:
        raise SaveMdError("Category name is required.")
    match["name"] = name[:80]
    _write_json(CATEGORIES_FILE, categories)
    return jsonify(match)


@bp.route("/categories/<category_id>/documents", methods=["POST", "OPTIONS"])
def create_document(category_id: str):
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or "").strip() or "Untitled"
    content = str(payload.get("content") or "")
    target = _unique_file_path(category_id, _safe_filename(title))
    target.write_text(content, encoding="utf-8")
    metadata = _load_metadata()
    metadata[_metadata_key(category_id, target.name)] = _metadata_for_content({"createdAt": _now_iso()}, content)
    _save_metadata(metadata)
    return jsonify({"document": _doc_summary(category_id, target, metadata, content), "content": content}), 201


@bp.route("/categories/<category_id>/documents/<path:doc_id>", methods=["GET", "PATCH", "DELETE", "OPTIONS"])
def document(category_id: str, doc_id: str):
    if request.method == "OPTIONS":
        return "", 204
    path = _doc_path(category_id, doc_id)
    if not path.exists():
        raise SaveMdError("Document not found.", 404)
    metadata = _load_metadata()
    if request.method == "GET":
        content = path.read_text(encoding="utf-8", errors="replace")
        return jsonify({"document": _doc_summary(category_id, path, metadata, content), "content": content})
    if request.method == "DELETE":
        path.unlink()
        metadata.pop(_metadata_key(category_id, path.name), None)
        _save_metadata(metadata)
        return jsonify({"deletedId": doc_id})
    payload = request.get_json(silent=True) or {}
    content = str(payload.get("content")) if "content" in payload else path.read_text(encoding="utf-8", errors="replace")
    new_title = str(payload.get("title") or path.stem).strip()
    target = _unique_file_path(category_id, _safe_filename(new_title), ignore=path)
    if target.resolve() != path.resolve():
        target.write_text(content, encoding="utf-8")
        path.unlink()
        old_key = _metadata_key(category_id, path.name)
        metadata[_metadata_key(category_id, target.name)] = _metadata_for_content(
            metadata.pop(old_key, {"createdAt": _now_iso()}),
            content,
        )
        path = target
    else:
        path.write_text(content, encoding="utf-8")
        metadata[_metadata_key(category_id, path.name)] = _metadata_for_content(
            metadata.get(_metadata_key(category_id, path.name), {"createdAt": _now_iso()}),
            content,
        )
    _save_metadata(metadata)
    return jsonify({"document": _doc_summary(category_id, path, metadata, content), "content": content})


@bp.route("/tts/voices", methods=["GET", "OPTIONS"])
def tts_voices():
    if request.method == "OPTIONS":
        return "", 204
    language = normalise_language(request.args.get("language"), default="en")
    return jsonify({"language": language, "voices": voices_for_language(language), "engine": "edge-tts"})


@bp.route("/tts", methods=["POST", "OPTIONS"])
def create_tts_audio():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    text = re.sub(r"\s+", " ", str(payload.get("text") or "")).strip()
    if not text:
        raise SaveMdError("Text is required.")
    if len(text) > 4500:
        raise SaveMdError("Text is too long for one TTS request.")
    language = normalise_language(payload.get("language"), default="en")
    voice = str(payload.get("voice") or "").strip() or default_voice_for_language(language)
    if voice not in ALLOWED_VOICES:
        voice = default_voice_for_language(language)
    cache_key, output_path = _tts_output_path(text, voice, language)
    if audio_file_is_usable(output_path):
        return jsonify({
            "audio_url": f"/audio/save-md/edge-tts/{language}/{voice}/{cache_key}.mp3",
            "cached": True,
            "engine": "edge-tts",
            "language": language,
            "voice": voice,
        })
    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:  # noqa: BLE001 - edge-tts raises several exception types.
        raise SaveMdError(f"Could not generate audio: {exc}", 500) from exc
    return jsonify({
        "audio_url": f"/audio/save-md/edge-tts/{language}/{voice}/{cache_key}.mp3",
        "cached": False,
        "engine": "edge-tts",
        "language": language,
        "voice": voice,
    })
