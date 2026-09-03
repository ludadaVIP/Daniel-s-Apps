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
import re
from datetime import datetime, timezone
from functools import lru_cache
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


# Static chapter counts for every NT book — fixed canon data, identical
# across every translation. Used by /config so we don't have to open and
# parse every NT book file just to count chapters. Keys are the canonical
# English book names; we map target-language names through CANONICAL_BOOK
# (or fall back to the key itself for "en").
NT_CHAPTER_COUNTS: dict[str, int] = {
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21,
    "Acts": 28, "Romans": 16,
    "1 Corinthians": 16, "2 Corinthians": 13,
    "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4,
    "1 Thessalonians": 5, "2 Thessalonians": 3,
    "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1,
    "Hebrews": 13, "James": 5,
    "1 Peter": 5, "2 Peter": 3,
    "1 John": 5, "2 John": 1, "3 John": 1,
    "Jude": 1, "Revelation": 22,
}


def chapters_for(lang: str, book: str) -> int:
    """Return the chapter count for *book* in language *lang*.

    Pure dictionary lookup — no disk read. Falls back to 0 only if a book is
    missing from the canon table (which would indicate a config bug)."""
    canonical = CANONICAL_BOOK.get(lang, {}).get(book, book)
    return NT_CHAPTER_COUNTS.get(canonical, 0)


bp = Blueprint("bible_lang", __name__)


def cached_json(payload: dict[str, Any], max_age: int):
    """Return a JSON response with an appropriate Cache-Control header.

    Bible text itself is immutable, but verse study notes are authored while
    the app is running.  A non-positive ``max_age`` deliberately disables
    browser storage for those dynamic responses, so a newly written note is
    visible immediately after a reload rather than after an hour."""
    response = jsonify(payload)
    response.headers["Cache-Control"] = (
        "no-store" if max_age <= 0 else f"public, max-age={max_age}"
    )
    return response


# ----------------------------------------------------------- Helpers ----

def lang_config(code: str | None) -> dict[str, Any]:
    cfg = LANGUAGES.get((code or "en").lower())
    if not cfg:
        cfg = LANGUAGES["en"]
    return cfg


def verse_file(version: str, book: str) -> Path:
    return BIBLE_DIR / f"{version}_data" / f"{book}.json"


# Cache up to 128 (version, book) pairs in memory. Each verse-list is small
# (a typical NT book is 10–60 KB of JSON; even the longest OT books are
# under 400 KB). At 128 entries that's well under 20 MB even for the worst
# case — and in practice a session touches maybe 5–10 distinct books, so
# real memory use stays in the single-digit-MB range.
#
# IMPORTANT: each cache entry is a list of dicts that get *returned by
# reference* to multiple callers. Callers must NOT mutate them — this
# module only reads from them (filter_chapter copies; clean_verse_text
# returns new strings).
@lru_cache(maxsize=128)
def load_verses(version: str, book: str) -> tuple[dict[str, Any], ...]:
    path = verse_file(version, book)
    if not path.exists():
        return ()
    data = read_json(path, [])
    if not isinstance(data, list):
        return ()
    # Return as a tuple so the cached value is immutable-by-convention and
    # cheap to hash if anyone tries to use it as a key elsewhere.
    return tuple(data)


# Footnote markers in the source corpora — these are visual artefacts of the
# original publisher, not part of the inspired text. NVI uses HTML
# (``<sup>[1]</sup>``); some versions leave bare ``[1]``/``(1)``. Strip them
# all before the frontend ever sees the verse.
_FOOTNOTE_RE = re.compile(
    r"<sup>\s*\[?\s*[\w.,\-]+\s*\]?\s*</sup>"  # <sup>[1]</sup>, <sup>1</sup>
    r"|\s*\[\s*[a-zA-Z]?\d+[a-zA-Z]?\s*\]"      # standalone [1], [a], [1a]
    r"|<[^>]+>",                                 # any other stray HTML tag
)

# CUV stores verses with a space between every CJK char and even around CJK
# punctuation, e.g. "奉 神 旨 意 ， 作 ...". Two passes handle this:
#   1) collapse runs of CJK glyph + space + glyph;
#   2) remove any remaining spaces that sit directly between CJK glyphs or
#      between a CJK glyph and CJK punctuation (so "意 。" → "意。").
# Latin spaces are untouched. The character class covers CJK Unified
# Ideographs + the most common CJK/full-width punctuation marks.
_CJK_CHAR = r"[㐀-鿿＀-￯　-〿]"
_CJK_SPACED_RE = re.compile(rf"(?:{_CJK_CHAR}\s){{2,}}{_CJK_CHAR}")
_CJK_PUNCT_SPACE_RE = re.compile(rf"({_CJK_CHAR})\s+({_CJK_CHAR})")


def _collapse_cjk_spaces(match: re.Match) -> str:
    return match.group(0).replace(" ", "")


def clean_verse_text(text: str) -> str:
    """Make a verse string safe and pretty for direct display:

    - drop publisher footnote markers (``<sup>[1]</sup>`` etc.)
    - strip any other stray HTML
    - collapse the inter-character spaces the CUV uses between CJK glyphs
    - normalise leading/trailing whitespace and the ASCII colon-space combo
    """
    if not text:
        return ""
    cleaned = _FOOTNOTE_RE.sub("", text)
    cleaned = _CJK_SPACED_RE.sub(_collapse_cjk_spaces, cleaned)
    # Sweep up any straggler spaces between adjacent CJK glyphs/punctuation
    # — repeat until stable so chains like "意 。 ”" all collapse.
    while True:
        next_pass = _CJK_PUNCT_SPACE_RE.sub(r"\1\2", cleaned)
        if next_pass == cleaned:
            break
        cleaned = next_pass
    # Collapse any double spaces that the deletions left behind, then trim.
    cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)
    return cleaned.strip()


def filter_chapter(
    verses: "tuple[dict[str, Any], ...] | list[dict[str, Any]]",
    chapter: int,
) -> list[dict[str, Any]]:
    return [
        v for v in verses
        if int(v.get("chapter") or 0) == chapter
    ]


def notes_file(lang: str, book: str, chapter: int) -> Path:
    return DATA_DIR / lang / book / f"{chapter}.json"


def load_notes(lang: str, book: str, chapter: int) -> dict[str, Any]:
    path = notes_file(lang, book, chapter)
    if not path.exists():
        return {}
    data = read_json(path, {})
    return data if isinstance(data, dict) else {}


def normalize_note(note: Any) -> dict[str, Any]:
    """Accept both the original verbose note schema and the compact corpus schema.

    The corpus is intentionally hand-authored verse by verse. Compact tuples
    keep a chapter readable while this adapter preserves the public API shape
    consumed by the React app:

    ``v: [[word, part_of_speech, meaning], ...]``
    ``g: [[title, detail], ...]``
    ``e: [[phrase, note], ...]``
    """
    if not isinstance(note, dict):
        return {"vocab": [], "grammar": [], "expression": [], "translation": ""}

    vocab = note.get("vocab")
    if vocab is None:
        vocab = [
            {"word": item[0], "ipa": "", "pos": item[1], "meaning": item[2]}
            for item in note.get("v", [])
            if isinstance(item, list) and len(item) >= 3
        ]

    grammar = note.get("grammar")
    if grammar is None:
        grammar = [
            {"title": item[0], "detail": item[1]}
            for item in note.get("g", [])
            if isinstance(item, list) and len(item) >= 2
        ]

    expression = note.get("expression")
    if expression is None:
        expression = [
            {"phrase": item[0], "note": item[1]}
            for item in note.get("e", [])
            if isinstance(item, list) and len(item) >= 2
        ]

    return {
        "vocab": vocab if isinstance(vocab, list) else [],
        "grammar": grammar if isinstance(grammar, list) else [],
        "expression": expression if isinstance(expression, list) else [],
        "translation": note.get("translation") or "",
    }


# Hebrews 9–13 is deliberately supplied by the same study-note pipeline as
# the hand-authored chapters.  Its vocabulary and grammar selectors keep the
# verse cards useful even when a learner moves rapidly through this long,
# argument-dense closing half of the letter.
_HEBREWS_VOCABULARY: dict[str, tuple[str, str]] = {
    "covenant": ("n.", "约；神所设立的盟约关系"),
    "tabernacle": ("n.", "会幕；敬拜与神同在的帐幕"),
    "priest": ("n.", "祭司；代表人亲近神的人"),
    "sacrifice": ("n.", "祭物；为罪献上的祭"),
    "blood": ("n.", "血；本书常指立约和洁净的代价"),
    "conscience": ("n.", "良心、内在道德意识"),
    "redemption": ("n.", "救赎；付代价得释放"),
    "eternal": ("adj.", "永恒的、永远有效的"),
    "perfect": ("v./adj.", "使完全；完全的"),
    "sanctified": ("adj.", "被分别为圣的"),
    "confidence": ("n.", "坦然、确信"),
    "endurance": ("n.", "忍耐、坚忍"),
    "faith": ("n.", "信心；对神的信靠"),
    "promise": ("n.", "应许"),
    "heavenly": ("adj.", "属天的、天上的"),
    "discipline": ("n.", "管教、训练"),
    "holiness": ("n.", "圣洁"),
    "kingdom": ("n.", "国度、王权统治"),
    "hospitality": ("n.", "接待客旅"),
    "marriage": ("n.", "婚姻"),
    "content": ("adj.", "知足的"),
    "shepherd": ("n.", "牧者"),
    "grace": ("n.", "恩典；神白白赐下的恩惠"),
}


def _hebrews_theme(chapter: int, verse: int) -> tuple[str, str]:
    """Return the local argument of Hebrews 9–13 for a verse card."""
    ranges: dict[int, list[tuple[range, str, str]]] = {
        9: [
            (range(1, 11), "the earthly tabernacle", "地上会幕与礼仪是暂时的预表，显出旧制度的限制。"),
            (range(11, 15), "Christ's greater sacrifice", "基督借自己的血进入更大、更完全的帐幕，洁净人的良心。"),
            (range(15, 23), "the new covenant", "新约以死亡、血与赦罪确立；立约需要真实的代价。"),
            (range(23, 29), "once for all", "基督一次献上自己，除掉罪，并将再来拯救等候他的人。"),
        ],
        10: [
            (range(1, 19), "one sacrifice for sins", "律法的祭物是影子；基督一次永远的献祭真正使属他的人得以完全。"),
            (range(19, 26), "draw near and hold fast", "因耶稣开了又新又活的路，信徒可亲近神、坚守盼望并彼此激励。"),
            (range(26, 32), "a serious warning", "故意弃绝基督的祭会面对严肃审判；这段警告呼召真实持守。"),
            (range(32, 40), "endurance and faith", "回想从前的忍耐，继续以信心持守，不退后而得生命。"),
        ],
        11: [
            (range(1, 8), "faith and the unseen", "信心是对所盼望之事的把握，使人按神所启示、尚未看见的现实行动。"),
            (range(8, 23), "the faith of the patriarchs", "亚伯拉罕一家以寄居者身份仰望更美的家乡与神所建造的城。"),
            (range(23, 32), "faith in the exodus", "摩西与以色列人因信离开埃及、越过红海、进入神所应许的道路。"),
            (range(32, 41), "faithful witnesses", "信心见证人经历得胜也经历受苦；他们与我们同等候神最终的成全。"),
        ],
        12: [
            (range(1, 4), "run with endurance", "众见证人环绕，信徒当卸下缠累，定睛于忍受十字架的耶稣。"),
            (range(4, 18), "the discipline of a Father", "苦难中的管教证实神儿女身份，结出平安的义果。"),
            (range(18, 25), "Mount Zion", "信徒来到的不是西奈的恐惧，而是天上锡安、永活神的城与新约中保耶稣。"),
            (range(25, 30), "an unshakable kingdom", "要敬畏聆听说话的神；震动之后，信徒领受不能震动的国。"),
        ],
        13: [
            (range(1, 7), "love in the Christian community", "信仰在弟兄相爱、接待、婚姻忠贞、知足与倚靠神中成为可见生活。"),
            (range(7, 15), "Jesus Christ is the same", "记念忠心领袖，拒绝异端，以永不改变的耶稣为中心，甘愿担当他的凌辱。"),
            (range(15, 20), "a sacrifice of praise", "借基督常献赞美，并以行善、分享和顺服建造群体。"),
            (range(20, 26), "a benediction of peace", "结尾祷告颂赞赐平安的神，求他借永约之血装备信徒遵行旨意。"),
        ],
    }
    for verse_range, phrase, note in ranges[chapter]:
        if verse in verse_range:
            return phrase, note
    return "the argument of Hebrews", "请把本节放回本段论证中阅读，留意作者如何把旧约预表指向基督。"


def generated_hebrews_note(chapter: int, verse: int, text: str) -> dict[str, Any]:
    """Produce a focused learner note for every Hebrews 9–13 verse.

    This preserves the API's standard three blocks while selecting vocabulary
    from the actual ESV verse, grammar from its visible construction, and
    background from the verse's local line of argument.
    """
    lower = text.lower()
    vocab = [
        {"word": word, "ipa": "", "pos": pos, "meaning": meaning}
        for word, (pos, meaning) in _HEBREWS_VOCABULARY.items()
        if word in lower
    ][:2]
    if not vocab:
        key = next((word.strip(".,;:!?\"'").lower() for word in text.split()
                    if len(word.strip(".,;:!?\"'")) >= 7), "passage")
        vocab = [{"word": key, "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合上下文与 CUV 对照理解。"}]

    if "let us" in lower:
        grammar = ("Let us + 动词", "共同劝勉：作者邀请全体信徒一同采取行动。")
    elif "if " in lower:
        grammar = ("if 条件句", "if 引出条件或假设；留意主句所说明的结果。")
    elif "not " in lower and " but " in lower:
        grammar = ("not ... but ...", "否定一种理解或做法，并以 but 转向作者强调的重点。")
    elif "who " in lower or "which " in lower or "that " in lower:
        grammar = ("关系从句", "who / which / that 为前面的名词补充身份、内容或结果。")
    elif lower.startswith("for "):
        grammar = ("For 连接论证", "For 常说明前一句的理由、依据或进一步解释。")
    else:
        grammar = ("主句与修饰成分", "先找本节有限动词与主语，再把介词短语和分词短语逐层接回主句。")

    phrase, note = _hebrews_theme(chapter, verse)
    return {
        "vocab": vocab,
        "grammar": [{"title": grammar[0], "detail": grammar[1]}],
        "expression": [{"phrase": phrase, "note": note}],
        "translation": "",
    }


# Revelation 14–18 continues the same verse-card approach as the hand-authored
# opening chapters.  These chapters are especially dense with rare image words
# and long prophetic sentences, so the fallback remains deliberately local to
# the actual ESV line rather than offering a generic blank card.
_REVELATION_VOCABULARY: dict[str, tuple[str, str]] = {
    "lamb": ("n.", "羔羊；本书中作为称号时通常大写为 Lamb"),
    "mount": ("n.", "山；Mount Zion 为锡安山这一专名"),
    "harp": ("n.", "竖琴；古代敬拜中常见的乐器"),
    "virgin": ("n.", "童身、贞洁的人；文学/宗教语境词"),
    "firstfruits": ("n.", "初熟的果子；复数形式，指首先归给神的一部分"),
    "proclaim": ("v.", "宣告、高声传讲；proclaiming 为现在分词"),
    "everlasting": ("adj.", "永恒的、长存的；比 eternal 更具文学色彩"),
    "worship": ("v.", "敬拜；worshiped 为过去式"),
    "wrath": ("n.", "烈怒、震怒；正式且强烈的 anger"),
    "harvest": ("n./v.", "收割、庄稼；reap the harvest 指收割"),
    "reap": ("v.", "收割；过去式 reaped"),
    "sickle": ("n.", "镰刀；农业收割工具"),
    "winepress": ("n.", "榨酒池；wine + press 的复合名词"),
    "plague": ("n.", "灾害、瘟疫"),
    "tabernacle": ("n.", "帐幕；神同在/敬拜的帐幕图像"),
    "sanctuary": ("n.", "圣所、圣殿中的圣洁空间"),
    "pour": ("v.", "倾倒；过去式 poured"),
    "bowl": ("n.", "碗、钵；bowl of 指盛装某物的器皿"),
    "fierce": ("adj.", "猛烈的、凶猛的"),
    "scorch": ("v.", "灼烧；be scorched by 表被……灼伤"),
    "throne": ("n.", "宝座；也可指王权"),
    "euphrates": ("proper n.", "幼发拉底河"),
    "assemble": ("v.", "聚集、召集；assemble for battle"),
    "armageddon": ("proper n.", "哈米吉多顿；希伯来语地名的希腊化形式"),
    "harlot": ("n.", "妓女；古典/经文用词，现代英语避免用于称呼人"),
    "wilderness": ("n.", "旷野、荒野"),
    "blasphemy": ("n.", "亵渎、毁谤神；blasphemous 为形容词"),
    "mystery": ("n.", "奥秘；在经文中常指被揭示的隐藏事实"),
    "desolate": ("adj.", "荒凉的、被弃绝的；make ... desolate"),
    "merchandise": ("n.", "商品、货物；通常不可数"),
    "lament": ("v./n.", "哀哭、哀歌；正式文学词"),
    "sorcery": ("n.", "邪术；不可数名词"),
    "hallelujah": ("interj.", "哈利路亚；希伯来语赞美呼喊的音译"),
    "multitude": ("n.", "众多的人群；a great multitude"),
    "judgment": ("n.", "审判、判断；judge 是动词"),
    "bride": ("n.", "新娘；Bride 大写时为象征性称号"),
    "linen": ("n.", "细麻布；不可数名词"),
    "righteous": ("adj.", "公义的、正直的；righteous deeds 指公义的行为"),
    "testimony": ("n.", "见证、证词；testify 是动词"),
    "robe": ("n.", "长袍、外衣；正式文学词"),
    "diadem": ("n.", "王冠、冠冕"),
    "fury": ("n.", "狂怒、暴怒；比 wrath 更强调猛烈"),
    "bottomless": ("adj.", "无底的；bottomless pit 指无底坑"),
    "resurrection": ("n.", "复活；rise 是动词"),
    "torment": ("n./v.", "折磨；可作名词或动词"),
    "thirsty": ("adj.", "口渴的；the thirsty 可指“口渴的人”"),
    "heritage": ("n.", "产业、承受物；比 inheritance 更庄重"),
    "cowardly": ("adj.", "胆怯的；coward 是名词"),
    "jasper": ("n.", "碧玉；宝石名称"),
    "foundation": ("n.", "根基、地基；复数 foundations"),
    "transparent": ("adj.", "透明的；transparent glass"),
    "accursed": ("adj.", "受咒诅的；古典/经文用词"),
    "recompense": ("n.", "报应、报偿；正式词"),
}


def _revelation_theme(chapter: int, verse: int) -> tuple[str, str]:
    ranges: dict[int, list[tuple[range, str, str]]] = {
        14: [(range(1, 6), "the Lamb and the faithful", "留意身份、声音和敬拜词汇；先辨认异象中名词群，再抓主要动词。"), (range(6, 14), "three angelic announcements", "本段由天使宣告推进；关注 proclaim、worship、fear 等命令或宣告动词。"), (range(14, 21), "the harvest imagery", "收割和榨酒池为连续图像；英语上先分清 harvest、reap、sickle 的动作关系。")],
        15: [(range(1, 5), "the song of Moses and the Lamb", "赞美段落常有表语前置、抽象名词并列；朗读时按并列结构停顿。"), (range(5, 9), "the sanctuary and the seven plagues", "本段以 sanctuary、tabernacle、plagues 建立异象场景；留意被动语态。")],
        16: [(range(1, 8), "the first four bowls", "连续命令与被动结果构成叙事骨架；识别 pour out、become、be given 等动词。"), (range(8, 13), "the fifth and sixth bowls", "黑暗、河流和污灵的描述使用大量地点介词；先找介词短语修饰谁。"), (range(13, 22), "the gathering and the seventh bowl", "本段反复出现 gather、come、fall；注意直接引语内的祈使和警醒表达。")],
        17: [(range(1, 7), "the woman and the beast", "先分辨 woman、beast、waters 等名词指代；复杂描写多由 with 短语逐层累加。"), (range(7, 15), "the mystery explained", "解释段落常用 that / which 关系从句；可把每个从句接回它修饰的名词。"), (range(15, 19), "the beast and the woman", "本段动词多为将来或情态结构；留意 make ... desolate、devour、burn。")],
        18: [(range(1, 9), "the fall of Babylon announced", "宣告与哀叹交错；注意 fallen、come out、receive 等动词和命令式。"), (range(9, 20), "the merchants lament", "长串商品名词是并列清单；阅读时先定位主句 weep/lament，再逐项浏览清单。"), (range(20, 25), "Babylon's fall pictured", "结尾使用强烈的比喻、被动和过去时；先抓图像的核心动词。")],
        19: [(range(1, 7), "hallelujah in heaven", "本段有密集的敬拜与赞美名词；留意直接引语中的并列结构和 for 引出的理由。"), (range(7, 11), "the marriage supper of the Lamb", "婚宴图像中常有被动语态和邀请用语；先辨认 Bride、Lamb、linen 的关系。"), (range(11, 17), "the rider on the white horse", "描述性长句把外貌、称号与行动逐层叠加；先抓主语 The one / He，再读修饰语。"), (range(17, 22), "the final battle scene", "本段使用 gather、slain、thrown 等强动词；注意过去被动所描写的结果。")],
        20: [(range(1, 7), "the thousand years", "锁、深渊和王权的场景混合将来与过去叙事；尤其注意 be bound / be released 被动结构。"), (range(7, 11), "the final deception ended", "本段以条件时间从句和连续过去时推进；先找 when / after that 的时间层次。"), (range(11, 16), "the great white throne", "审判段落出现 books、judged、according to；留意被动语态与按……而定的介词短语。")],
        21: [(range(1, 9), "the new heaven and earth", "新造的宣告使用 shall、will 和否定并列；先区分异象所见与宝座所说。"), (range(9, 15), "the holy city shown", "城市描写有许多位置短语和过去分词；先定位 city / wall / gates 等中心名词。"), (range(15, 22), "the city's beauty and dimensions", "量度与材料词汇较密；数字和宝石名可先按名词清单理解。"), (range(22, 28), "God and the Lamb as the city's light", "结尾反复使用 no / never / nothing；观察否定怎样建立永恒安全的画面。")],
        22: [(range(1, 6), "the river and tree of life", "本段有 flowing、yielding 等分词，补充河流和树的状态；先找主句动词。"), (range(6, 12), "the trustworthy words and the coming one", "命令式与 blessed 宣告交替；注意 keep、seal up、repay 的搭配。"), (range(12, 18), "the final invitation", "邀请句多用 let + 宾语 + 动词原形；整体朗读能帮助掌握节奏。"), (range(18, 22), "the warning and farewell", "警告以 if 条件句展开；最后是简短书信式祝祷。")],
    }
    for verse_range, phrase, note in ranges[chapter]:
        if verse in verse_range:
            return phrase, note
    return "the vision of Revelation", "把本节放回相邻段落阅读，先找主要动词，再处理附加的图像和介词短语。"


def generated_revelation_note(chapter: int, verse: int, text: str) -> dict[str, Any]:
    """Return a text-sensitive study card for Revelation 14–18."""
    lower = text.lower()
    vocab = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in _REVELATION_VOCABULARY.items()
             if word in lower][:2]
    if len(vocab) < 2:
        candidates = [w.strip(".,;:!?\"'—()") for w in text.split()]
        for word in candidates:
            key = word.lower()
            if len(key) >= 7 and key.isalpha() and all(item["word"] != key for item in vocab):
                vocab.append({"word": key, "ipa": "", "pos": "key word", "meaning": "本节的重要内容词；结合 ESV 原句、上下文和 CUV 对照理解。"})
            if len(vocab) == 2:
                break
    if not vocab:
        vocab = [{"word": "key expression", "ipa": "", "pos": "key phrase", "meaning": "本节以完整表达为学习单位；先结合 ESV 原句辨认核心动词和对象。"}]
    lower_spaced = f" {lower} "
    if "let " in lower_spaced:
        grammar = ("Let + 宾语 + 动词", "let 引导劝勉或命令；后面用动词原形。")
    elif "if " in lower_spaced or "unless " in lower_spaced:
        grammar = ("条件句", "if / unless 引出条件；先找主句，再看条件所限制的结果。")
    elif "who " in lower_spaced or "which " in lower_spaced or "that " in lower_spaced:
        grammar = ("关系从句", "who / which / that 为前面的名词补充身份、内容或结果；先找它所修饰的先行词。")
    elif "was " in lower_spaced or "were " in lower_spaced or "been " in lower_spaced:
        grammar = ("被动与状态表达", "be + 过去分词常表示“被……”，也可能描述已形成的状态；结合上下文判断。")
    elif lower.startswith(("and ", "then ", "for ", "but ")):
        grammar = ("连接词推进叙事", "And / Then 推进画面，For 给出原因，But 引出转折；先辨认其与上一句的关系。")
    else:
        grammar = ("主句与修饰成分", "先找有限动词和主语，再把介词短语、分词短语或同位语逐层接回主句。")
    phrase, note = _revelation_theme(chapter, verse)
    return {"vocab": vocab, "grammar": [{"title": grammar[0], "detail": grammar[1]}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}


def generated_acts_note(chapter: int, verse: int, text: str) -> dict[str, Any]:
    """A distinct, text-led English card for every Acts 1–7 verse."""
    words = [w.strip(".,;:!?\"'—()[]") for w in text.split()]
    key_words = []
    for word in words:
        normal = word.lower()
        if len(normal) >= 6 and normal.isalpha() and normal not in key_words:
            key_words.append(normal)
        if len(key_words) == 2:
            break
    vocab = [{"word": word, "ipa": "", "pos": "key word", "meaning": "本节的核心内容词；先在 ESV 原句中定位它所连接的对象、动作或结果。"} for word in key_words]
    if not vocab:
        vocab = [{"word": "key expression", "ipa": "", "pos": "key phrase", "meaning": "本节以完整表达学习；先辨认主语、动词和宾语。"}]
    lower = text.lower()
    if "who " in lower or "which " in lower or "that " in lower:
        grammar = ("关系从句", "who / which / that 为前面名词补充身份或内容；先找它所修饰的名词。")
    elif "if " in lower or "unless " in lower:
        grammar = ("条件句", "if / unless 引出条件；先找主句所表达的结果、命令或应许。")
    elif "was " in lower or "were " in lower or "been " in lower:
        grammar = ("被动与叙事时态", "be + 过去分词多表示被动或状态；注意叙事中动作发生的先后。")
    elif "to " in lower:
        grammar = ("不定式 to + 动词", "to + 动词原形常表示目的、内容或下一步行动；判断它修饰哪个动词/名词。")
    else:
        grammar = ("主句与并列动作", "先找有限动词，再观察 and / but / for 如何连接叙事动作与理由。")
    excerpt = " ".join(words[:min(7, len(words))])
    chapter_topics = {1: "升天、等候与圣灵应许", 2: "五旬节、彼得讲道与初代群体", 3: "医治与圣殿讲道", 4: "见证、祷告与群体生活", 5: "使徒见证与逼迫", 6: "服事分工与司提反", 7: "司提反的历史讲论", 8: "分散中的福音、腓利与埃提阿伯太监", 9: "扫罗归主与彼得事工", 10: "哥尼流异象与福音临到外邦人", 11: "安提阿教会与福音扩展", 12: "彼得获救与希律的结局", 13: "第一次宣教旅程与彼西底安提阿讲道", 14: "坚固众教会与宣教回程"}
    topic = chapter_topics.get(chapter, "使徒行传的宣教与见证叙事")
    return {"vocab": vocab, "grammar": [{"title": grammar[0], "detail": grammar[1]}], "expression": [{"phrase": excerpt, "note": f"本节位于“{topic}”段落；将这段原文作为整体朗读，留意其核心动词如何推进事件。"}], "translation": ""}


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

    # /config does ZERO Bible JSON disk reads. Chapter counts come from the
    # static NT_CHAPTER_COUNTS table; "hasText" comes from a simple
    # Path.exists() check (a stat call, not a file read). "seededChapters"
    # comes from globbing the small per-book notes folder.
    book_summary: list[dict[str, Any]] = []
    for book in cfg["books"]:
        chapters = chapters_for(cfg["code"], book)
        has_text = verse_file(cfg["primaryVersion"], book).exists()
        notes_dir = DATA_DIR / cfg["code"] / book
        seeded_chapters = sorted(
            int(p.stem) for p in notes_dir.glob("*.json")
            if p.stem.isdigit()
        ) if notes_dir.exists() else []
        book_summary.append({
            "book": book,
            "chapters": chapters,
            "hasText": has_text,
            "hasNotes": bool(seeded_chapters),
            "seededChapters": seeded_chapters,
        })

    # /config changes as study chapters are seeded. Do not permit a browser
    # to keep a stale book/chapter availability map.
    return cached_json({
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
    }, max_age=0)


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
    parallel_by_num = {
        int(v.get("verse") or 0): clean_verse_text(str(v.get("text") or ""))
        for v in parallel_verses
    }

    notes = load_notes(cfg["code"], book, chapter)

    payload_verses: list[dict[str, Any]] = []
    for verse in primary_verses:
        n = int(verse.get("verse") or 0)
        note = normalize_note(notes.get(str(n)))
        # The opening Revelation chapters have hand-authored JSON.  The next
        # five chapters use the same public card schema, generated from each
        # exact ESV line and its local scene until their corpus files exist.
        if (cfg["code"] == "en" and book == "Revelation" and 14 <= chapter <= 22
                and not (note["vocab"] or note["grammar"] or note["expression"])):
            note = generated_revelation_note(chapter, n, str(verse.get("text") or ""))
        if (cfg["code"] == "en" and book == "Acts" and 1 <= chapter <= 28
                and not (note["vocab"] or note["grammar"] or note["expression"])):
            note = generated_acts_note(chapter, n, str(verse.get("text") or ""))
        payload_verses.append({
            "verse": n,
            "text": clean_verse_text(str(verse.get("text") or "")),
            "parallelText": parallel_by_num.get(n, ""),
            "vocab": note.get("vocab") or [],
            "grammar": note.get("grammar") or [],
            "expression": note.get("expression") or [],
            "translation": note.get("translation") or "",
        })

    # The verse text is immutable, but its study notes are not. Keep a
    # server-side source of truth on every navigation and avoid stale notes.
    return cached_json({
        "lang": cfg["code"],
        "book": book,
        "chapter": chapter,
        "primaryVersion": cfg["primaryVersion"],
        "primaryVersionLabel": cfg["primaryVersionLabel"],
        "parallelVersion": cfg["parallelVersion"],
        "parallelVersionLabel": cfg["parallelVersionLabel"],
        "verses": payload_verses,
    }, max_age=0)


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
