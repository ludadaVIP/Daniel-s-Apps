"""Bible Language Learning blueprint.

Mounted at ``/api/bible-lang`` in the unified backend. The same blueprint
powers every future "Bible and <Language>" app — Eng, Esp, FR, GE — by
routing every request through a ``lang`` query parameter.

URL layout
----------
- ``GET  /api/bible-lang/config?lang=en``                  app metadata (book list, voices, copy)
- ``GET  /api/bible-lang/chapter?lang=en&book=Ephesians&chapter=1``
                                                            verses + parallel CUV + study notes
- ``POST /api/bible-lang/tts``                              Edge TTS (lang + text + optional voice)
- ``GET  /api/bible-lang/health``                           liveness probe

Data layout
-----------
Verse text reuses the Recall-Bible corpus under ``backend/data/Bible/``:

    backend/data/Bible/<version>_data/<Book>.json   (e.g. esv_data/Ephesians.json)

Study notes live in their own folder so the Recall app stays untouched::

    backend/data/BibleLang/<lang>/<Book>/<chapter>.json

Each study-note file is a dict ``{ "<verse>": {vocab, grammar, expression, translation} }``.

TTS audio is cached under ``backend/data/BibleLang/audio/edge-tts/<lang>/<voice>/<hash>.mp3``
and served by the main ``backend/app.py`` at ``/audio/bible-lang/...``.
"""

from __future__ import annotations

import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from shared.io import read_json, write_json
from shared.tts import audio_file_is_usable, generate_audio


# ---------------------------------------------------------------- Paths ----

DEFAULT_BIBLE_DIR = Path(__file__).resolve().parents[2] / "data" / "Bible"
BIBLE_DIR = Path(os.environ.get("BIBLE_DATA_DIR", DEFAULT_BIBLE_DIR))

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "BibleLang"
DATA_DIR = Path(os.environ.get("BIBLE_LANG_DATA_DIR", DEFAULT_DATA_DIR))
DATA_DIR.mkdir(parents=True, exist_ok=True)

AUDIO_DIR = DATA_DIR / "audio"
AUDIO_CACHE_DIR = AUDIO_DIR / "edge-tts"
AUDIO_MANIFEST_FILE = AUDIO_CACHE_DIR / "manifest.json"

AUDIO_TEXT_LIMIT = 5000


# -------------------------------------------------------- Language config ----

# Each language entry maps the target version (used for the verse text on the
# left), the parallel version (shown as a small reference line — currently
# Chinese CUV for everyone since the user reads Chinese), and the Edge TTS
# voice used by the "play verse" / "play chapter" buttons.
#
# When adding a new language (Esp/FR/GE), just append a new entry here. No
# other code change is needed in this blueprint.

LANGUAGES: dict[str, dict[str, Any]] = {
    "en": {
        "code": "en",
        "label": "Bible and Eng",
        "subtitle": "用圣经学英语",
        "primaryVersion": "esv",
        "primaryVersionLabel": "ESV",
        "parallelVersion": "cuv",
        "parallelVersionLabel": "CUV",
        "ttsLang": "en-US",
        "ttsVoice": "en-US-AriaNeural",
        "ttsVoiceFallback": "en-US-JennyNeural",
        # In the ESV folder the book filenames are English ("Ephesians.json")
        # so the canonical English book names below are also the on-disk keys.
        "books": [
            "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
            "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
            "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
            "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
            "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
            "Jude", "Revelation",
        ],
        "ready": True,
    },
    "es": {
        "code": "es",
        "label": "Bible and Esp",
        # Audience: English speakers learning Spanish. UI copy is in Spanish
        # only; explanations on the right are written in English.
        "subtitle": "Learn Spanish with the Bible — NVI + ESV parallel",
        "primaryVersion": "nvi",
        "primaryVersionLabel": "NVI",
        "parallelVersion": "esv",
        "parallelVersionLabel": "ESV",
        "ttsLang": "es-ES",
        "ttsVoice": "es-ES-ElviraNeural",
        "ttsVoiceFallback": "es-ES-AlvaroNeural",
        "books": [
            "Mateo", "Marcos", "Lucas", "Juan", "Hechos", "Romanos",
            "1 Corintios", "2 Corintios", "Gálatas", "Efesios",
            "Filipenses", "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses",
            "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos",
            "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan",
            "Judas", "Apocalipsis",
        ],
        "ready": True,
    },
    "fr": {
        "code": "fr",
        "label": "Bible and FR",
        "subtitle": "Apprends le français avec la Bible",
        "primaryVersion": "lsg",  # not on disk yet — placeholder
        "primaryVersionLabel": "LSG",
        "parallelVersion": "cuv",
        "parallelVersionLabel": "CUV",
        "ttsLang": "fr-FR",
        "ttsVoice": "fr-FR-DeniseNeural",
        "ttsVoiceFallback": "fr-FR-HenriNeural",
        "books": [],
        "ready": False,
    },
    "de": {
        "code": "de",
        "label": "Bible and GE",
        "subtitle": "Lerne Deutsch mit der Bibel",
        "primaryVersion": "luther",  # not on disk yet — placeholder
        "primaryVersionLabel": "Luther",
        "parallelVersion": "cuv",
        "parallelVersionLabel": "CUV",
        "ttsLang": "de-DE",
        "ttsVoice": "de-DE-KatjaNeural",
        "ttsVoiceFallback": "de-DE-ConradNeural",
        "books": [],
        "ready": False,
    },
}


# Map a *target-language* book name (e.g. "Efesios", "Ephesians") to the
# *canonical English* book name used by the parallel CUV files (which are
# named in English on disk). For "en", these are identity.
CANONICAL_BOOK = {
    "en": {name: name for name in LANGUAGES["en"]["books"]},
    "es": {
        "Mateo": "Matthew", "Marcos": "Mark", "Lucas": "Luke", "Juan": "John",
        "Hechos": "Acts", "Romanos": "Romans",
        "1 Corintios": "1 Corinthians", "2 Corintios": "2 Corinthians",
        "Gálatas": "Galatians", "Efesios": "Ephesians",
        "Filipenses": "Philippians", "Colosenses": "Colossians",
        "1 Tesalonicenses": "1 Thessalonians", "2 Tesalonicenses": "2 Thessalonians",
        "1 Timoteo": "1 Timothy", "2 Timoteo": "2 Timothy",
        "Tito": "Titus", "Filemón": "Philemon", "Hebreos": "Hebrews",
        "Santiago": "James", "1 Pedro": "1 Peter", "2 Pedro": "2 Peter",
        "1 Juan": "1 John", "2 Juan": "2 John", "3 Juan": "3 John",
        "Judas": "Jude", "Apocalipsis": "Revelation",
    },
    "fr": {},
    "de": {},
}


bp = Blueprint("bible_lang", __name__)


# ----------------------------------------------------------- Helpers ----

def lang_config(code: str | None) -> dict[str, Any]:
    cfg = LANGUAGES.get((code or "en").lower())
    if not cfg:
        cfg = LANGUAGES["en"]
    return cfg


def verse_file(version: str, book: str) -> Path:
    return BIBLE_DIR / f"{version}_data" / f"{book}.json"


def load_verses(version: str, book: str) -> list[dict[str, Any]]:
    path = verse_file(version, book)
    if not path.exists():
        return []
    data = read_json(path, [])
    return data if isinstance(data, list) else []


def filter_chapter(verses: list[dict[str, Any]], chapter: int) -> list[dict[str, Any]]:
    return [
        v for v in verses
        if int(v.get("chapter") or 0) == chapter
    ]


def chapter_count(verses: list[dict[str, Any]]) -> int:
    return max((int(v.get("chapter") or 0) for v in verses), default=0)


def notes_file(lang: str, book: str, chapter: int) -> Path:
    return DATA_DIR / lang / book / f"{chapter}.json"


def load_notes(lang: str, book: str, chapter: int) -> dict[str, Any]:
    path = notes_file(lang, book, chapter)
    if not path.exists():
        return {}
    data = read_json(path, {})
    return data if isinstance(data, dict) else {}


def tts_cache_key(text: str, voice: str) -> str:
    return hashlib.sha1(f"bible-lang-v1\n{voice}\n{text}".encode("utf-8")).hexdigest()


def tts_output_path(text: str, voice: str, tts_lang: str) -> tuple[str, Path]:
    key = tts_cache_key(text, voice)
    output_dir = AUDIO_CACHE_DIR / tts_lang / voice
    return key, output_dir / f"{key}.mp3"


def update_audio_manifest(key: str, text: str, voice: str,
                          tts_lang: str, output_path: Path) -> None:
    manifest = read_json(AUDIO_MANIFEST_FILE, {"items": {}})
    items = manifest.setdefault("items", {})
    items[key] = {
        "voice": voice,
        "language": tts_lang,
        "engine": "edge-tts",
        "chars": len(text),
        "textPreview": text[:240],
        "path": output_path.relative_to(AUDIO_DIR).as_posix(),
        "bytes": output_path.stat().st_size if output_path.exists() else 0,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    write_json(AUDIO_MANIFEST_FILE, manifest)


# ----------------------------------------------------------- Routes ----

@bp.get("/health")
def health():
    return jsonify({
        "ok": True,
        "languages": [code for code, cfg in LANGUAGES.items() if cfg["ready"]],
    })


@bp.get("/config")
def get_config():
    """Return everything the frontend needs to render one language: book list,
    chapter counts, version labels, voice ids, and a ``ready`` flag."""
    cfg = lang_config(request.args.get("lang"))

    book_summary: list[dict[str, Any]] = []
    for book in cfg["books"]:
        verses = load_verses(cfg["primaryVersion"], book)
        book_summary.append({
            "book": book,
            "chapters": chapter_count(verses),
            "hasText": bool(verses),
        })

    return jsonify({
        "lang": cfg["code"],
        "label": cfg["label"],
        "subtitle": cfg["subtitle"],
        "primaryVersion": cfg["primaryVersion"],
        "primaryVersionLabel": cfg["primaryVersionLabel"],
        "parallelVersion": cfg["parallelVersion"],
        "parallelVersionLabel": cfg["parallelVersionLabel"],
        "ttsLang": cfg["ttsLang"],
        "ttsVoice": cfg["ttsVoice"],
        "ttsVoiceFallback": cfg["ttsVoiceFallback"],
        "books": book_summary,
        "ready": cfg["ready"],
    })


@bp.get("/chapter")
def get_chapter():
    """Return all verses for one chapter, with parallel CUV text and any
    seeded study notes merged in."""
    cfg = lang_config(request.args.get("lang"))
    book = (request.args.get("book") or "").strip()
    try:
        chapter = int(request.args.get("chapter") or "0")
    except ValueError:
        return jsonify({"error": "chapter must be an integer."}), 400
    if not book or chapter <= 0:
        return jsonify({"error": "book and chapter are required."}), 400

    primary_verses = filter_chapter(load_verses(cfg["primaryVersion"], book), chapter)
    if not primary_verses:
        return jsonify({
            "error": f"No verses found for {book} {chapter} in {cfg['primaryVersionLabel']}.",
        }), 404

    # The CUV files are named in English on disk; map the target-language book
    # name back to its canonical English equivalent.
    canonical_book = CANONICAL_BOOK.get(cfg["code"], {}).get(book, book)
    parallel_verses = filter_chapter(
        load_verses(cfg["parallelVersion"], canonical_book), chapter
    )
    parallel_by_num = {int(v.get("verse") or 0): str(v.get("text") or "").strip()
                       for v in parallel_verses}

    notes = load_notes(cfg["code"], book, chapter)

    payload_verses: list[dict[str, Any]] = []
    for verse in primary_verses:
        n = int(verse.get("verse") or 0)
        note = notes.get(str(n)) or {}
        payload_verses.append({
            "verse": n,
            "text": str(verse.get("text") or "").strip(),
            "parallelText": parallel_by_num.get(n, ""),
            "vocab": note.get("vocab") or [],
            "grammar": note.get("grammar") or [],
            "expression": note.get("expression") or [],
            "translation": note.get("translation") or "",
        })

    return jsonify({
        "lang": cfg["code"],
        "book": book,
        "chapter": chapter,
        "primaryVersion": cfg["primaryVersion"],
        "primaryVersionLabel": cfg["primaryVersionLabel"],
        "parallelVersion": cfg["parallelVersion"],
        "parallelVersionLabel": cfg["parallelVersionLabel"],
        "verses": payload_verses,
    })


@bp.route("/tts", methods=["POST", "OPTIONS"])
def create_tts_audio():
    if request.method == "OPTIONS":
        return "", 204

    payload = request.get_json(silent=True) or {}
    cfg = lang_config(payload.get("lang"))

    text = " ".join(str(payload.get("text") or "").split())
    if not text:
        return jsonify({"error": "Text is required."}), 400
    if len(text) > AUDIO_TEXT_LIMIT:
        return jsonify({
            "error": f"Text is too long. Keep it under {AUDIO_TEXT_LIMIT} characters."
        }), 400

    voice = str(payload.get("voice") or "").strip() or cfg["ttsVoice"]
    key, output_path = tts_output_path(text, voice, cfg["ttsLang"])
    audio_path = f"/audio/bible-lang/{output_path.relative_to(AUDIO_DIR).as_posix()}"

    if audio_file_is_usable(output_path):
        update_audio_manifest(key, text, voice, cfg["ttsLang"], output_path)
        return jsonify({
            "audio_path": audio_path,
            "audio_url": request.host_url.rstrip("/") + audio_path,
            "cached": True,
            "engine": "edge-tts",
            "language": cfg["ttsLang"],
            "voice": voice,
        })

    try:
        generate_audio(text, voice, output_path)
    except Exception as exc:  # noqa: BLE001 — edge-tts can raise many things
        fallback = cfg["ttsVoiceFallback"]
        if fallback and fallback != voice:
            try:
                key, output_path = tts_output_path(text, fallback, cfg["ttsLang"])
                generate_audio(text, fallback, output_path)
                voice = fallback
            except Exception as exc2:  # noqa: BLE001
                return jsonify({
                    "error": f"Could not generate audio ({cfg['ttsLang']}): {exc2}"
                }), 502
        else:
            return jsonify({
                "error": f"Could not generate audio ({cfg['ttsLang']}): {exc}"
            }), 502

    audio_path = f"/audio/bible-lang/{output_path.relative_to(AUDIO_DIR).as_posix()}"
    update_audio_manifest(key, text, voice, cfg["ttsLang"], output_path)
    return jsonify({
        "audio_path": audio_path,
        "audio_url": request.host_url.rstrip("/") + audio_path,
        "cached": False,
        "engine": "edge-tts",
        "language": cfg["ttsLang"],
        "voice": voice,
    })
