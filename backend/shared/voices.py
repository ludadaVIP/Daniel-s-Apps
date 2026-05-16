"""Edge TTS voice catalog shared across sub-apps.

This file is the single source of truth for which Edge Neural voices each
language exposes. Sub-app code should import the constants here instead of
defining its own copy.
"""

from __future__ import annotations

import re
from typing import Any


SUPPORTED_LANGUAGES: dict[str, dict[str, Any]] = {
    "en": {
        "name": "English",
        "nameZh": "英语",
        "promptName": "English",
        "voices": [
            {"id": "en-US-JennyNeural", "name": "Jenny", "gender": "Female",
             "style": "Friendly, clear, general practice"},
            {"id": "en-US-AriaNeural", "name": "Aria", "gender": "Female",
             "style": "Confident, polished, story/news-like"},
            {"id": "en-US-GuyNeural", "name": "Guy", "gender": "Male",
             "style": "Warm, steady, expressive"},
        ],
    },
    "zh": {
        "name": "Chinese",
        "nameZh": "中文",
        "promptName": "Chinese",
        "voices": [
            {"id": "zh-CN-XiaoxiaoNeural", "name": "Xiaoxiao", "gender": "Female",
             "style": "Mandarin Chinese, warm, clear, general practice"},
            {"id": "zh-CN-YunxiNeural", "name": "Yunxi", "gender": "Male",
             "style": "Mandarin Chinese, clear, friendly"},
            {"id": "zh-CN-XiaoyiNeural", "name": "Xiaoyi", "gender": "Female",
             "style": "Mandarin Chinese, natural, expressive"},
        ],
    },
    "es": {
        "name": "Spanish",
        "nameZh": "西班牙语",
        "promptName": "Spanish",
        "voices": [
            {"id": "es-ES-ElviraNeural", "name": "Elvira", "gender": "Female",
             "style": "Spain Spanish, friendly, natural"},
            {"id": "es-ES-XimenaNeural", "name": "Ximena", "gender": "Female",
             "style": "Spanish, smooth, friendly"},
            {"id": "es-ES-AlvaroNeural", "name": "Alvaro", "gender": "Male",
             "style": "Spain Spanish, clear, warm"},
        ],
    },
    "fr": {
        "name": "French",
        "nameZh": "法语",
        "promptName": "French",
        "voices": [
            {"id": "fr-FR-VivienneMultilingualNeural", "name": "Vivienne",
             "gender": "Female",
             "style": "France French, friendly, very smooth"},
            {"id": "fr-FR-DeniseNeural", "name": "Denise", "gender": "Female",
             "style": "France French, friendly, general practice"},
            {"id": "fr-FR-HenriNeural", "name": "Henri", "gender": "Male",
             "style": "France French, calm, clear"},
        ],
    },
    "de": {
        "name": "German",
        "nameZh": "德语",
        "promptName": "German",
        "voices": [
            {"id": "de-DE-SeraphinaMultilingualNeural", "name": "Seraphina",
             "gender": "Female",
             "style": "Germany German, friendly, very smooth"},
            {"id": "de-DE-KatjaNeural", "name": "Katja", "gender": "Female",
             "style": "Germany German, friendly, general practice"},
            {"id": "de-DE-ConradNeural", "name": "Conrad", "gender": "Male",
             "style": "Germany German, calm, clear"},
        ],
    },
}

LANGUAGE_ALIASES = {
    "english": "en", "eng": "en", "en-us": "en", "en-gb": "en", "英语": "en",
    "chinese": "zh", "mandarin": "zh", "zh-cn": "zh", "cn": "zh",
    "中文": "zh", "汉语": "zh", "普通话": "zh",
    "spanish": "es", "espanol": "es", "español": "es", "spa": "es",
    "es-es": "es", "西语": "es", "西班牙语": "es",
    "french": "fr", "francais": "fr", "français": "fr", "fra": "fr",
    "fr-fr": "fr", "法语": "fr",
    "german": "de", "deutsch": "de", "ger": "de", "de-de": "de", "德语": "de",
}

ALLOWED_VOICES: set[str] = {
    voice["id"]
    for language in SUPPORTED_LANGUAGES.values()
    for voice in language["voices"]
}


def normalise_language(value: Any, default: str = "en") -> str:
    """Map a free-form language string to one of: en, zh, es, fr, de."""
    text = str(value or "").strip().lower()
    if not text:
        return default
    if text in SUPPORTED_LANGUAGES:
        return text
    return LANGUAGE_ALIASES.get(re.sub(r"\s+", "-", text), default)


def language_name(value: Any) -> str:
    return SUPPORTED_LANGUAGES[normalise_language(value)]["name"]


def voice_for_language_gender(language: Any, gender: Any) -> str:
    """Return the default voice id for a language + gender combination."""
    code = normalise_language(language)
    requested = str(gender or "female").strip().lower()
    target = "male" if requested in {"male", "m", "man", "男", "男声"} else "female"
    for voice in SUPPORTED_LANGUAGES[code]["voices"]:
        if voice["gender"].lower() == target:
            return voice["id"]
    return SUPPORTED_LANGUAGES[code]["voices"][0]["id"]


def voices_for_language(language: Any) -> list[dict[str, Any]]:
    return SUPPORTED_LANGUAGES[normalise_language(language)]["voices"]


def default_voice_for_language(language: Any) -> str:
    return voices_for_language(language)[0]["id"]
