"""Create reviewable, verse-level ESV study notes for James 1–5.

Each generated entry follows the Bible and Eng schema and is written to its
own chapter JSON file. The material is intentionally static after seeding:
the application only reads the resulting files at runtime.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


VOCAB = {
    "trial": ("n.", "试炼、考验"), "steadfastness": ("n.", "坚忍、坚定"),
    "wisdom": ("n.", "智慧；按神眼光生活的能力"), "doubt": ("v./n.", "怀疑、摇摆"),
    "tempted": ("v.", "受试探、受诱惑"), "endure": ("v.", "忍耐、经受"),
    "perfect": ("adj.", "完全、成熟"), "hearer": ("n.", "听道的人"),
    "doer": ("n.", "行道的人"), "religion": ("n.", "敬虔实践、宗教生活"),
    "partiality": ("n.", "偏待、偏心"), "mercy": ("n.", "怜悯"),
    "faith": ("n.", "信心；信靠神"), "works": ("n.", "行为、行动"),
    "tongue": ("n.", "舌头；言语"), "wisdom": ("n.", "智慧"),
    "humility": ("n.", "谦卑"), "resist": ("v.", "抵挡"),
    "patience": ("n.", "忍耐"), "judge": ("v.", "论断、审判"),
    "rich": ("adj.", "富有的"), "prayer": ("n.", "祷告"),
    "confess": ("v.", "承认、认罪"), "righteous": ("adj.", "义的、正直的"),
}

THEMES = {
    1: [
        (range(1, 13), "trials and wisdom", "试炼能产生坚忍；信徒当以不摇摆的信心向慷慨赐智慧的神求。"),
        (range(13, 19), "temptation and God's goodness", "神不诱惑人；试探从私欲而来，良善恩赐却从众光之父而来。"),
        (range(19, 28), "hear and do the word", "真道要被温柔领受并实行；纯正敬虔显于受约束的言语与怜悯行动。"),
    ],
    2: [
        (range(1, 14), "faith without partiality", "教会不可按财富偏待人；爱邻舍与怜悯是合乎君王律法的生活。"),
        (range(14, 27), "faith shown by works", "真实信心不是空洞宣称，必在怜悯与顺服的行动中显明；行为使信心可见。"),
    ],
    3: [
        (range(1, 13), "the power of the tongue", "言语虽小却影响深远；成熟的人学习约束舌头，不以赞美与咒诅并存。"),
        (range(13, 19), "wisdom from above", "属天智慧表现为清洁、和平、温柔和怜悯；嫉妒纷争属地且带来混乱。"),
    ],
    4: [
        (range(1, 11), "humility before God", "纷争源于私欲；当顺服神、抵挡魔鬼、亲近神，并在主前谦卑。"),
        (range(11, 18), "do not judge or presume", "不可毁谤弟兄，也不可自信掌控明日；计划当说“主若愿意”。"),
    ],
    5: [
        (range(1, 7), "warning to the rich", "囤积与欺压遭神审判；受压者当忍耐等候主的来临。"),
        (range(7, 13), "patience until the Lord comes", "农夫、先知和约伯说明在受苦中坚定与忍耐，主满有怜悯。"),
        (range(13, 21), "prayer, confession, and restoration", "患难、喜乐与病痛都带到神前；群体彼此认罪祷告，追求使迷失者回转。"),
    ],
}


def theme(chapter: int, verse: int) -> tuple[str, str]:
    for verses, phrase, note in THEMES[chapter]:
        if verse in verses:
            return phrase, note
    raise ValueError((chapter, verse))


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出条件或假设；先找主句，再判断作者说明的结果或劝勉。"
    if lower.startswith("let ") or " let " in lower:
        return "Let + 宾语 + 动词", "let 引出劝勉或许可；留意它把真理转为具体行动。"
    if "not " in lower and " but " in lower:
        return "not ... but ...", "否定一种错误道路，以 but 转向雅各强调的真实回应。"
    if lower.startswith("for "):
        return "For 连接论证", "For 说明前一句的理由、依据或进一步解释。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为前面的名词补充身份、内容或结果。"
    return "主句与修饰成分", "先找本节主语与有限动词，再把介词短语、分词短语逐层接回主句。"


def note(chapter: int, verse: int, text: str) -> dict:
    lower = text.lower()
    vocab = [
        {"word": word, "ipa": "", "pos": pos, "meaning": meaning}
        for word, (pos, meaning) in VOCAB.items()
        if word in lower
    ][:2]
    if not vocab:
        words = [word.strip(".,;:!?\"'“”") for word in text.split()]
        key = next((word for word in words if len(word) >= 7), words[0])
        vocab = [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合 ESV 与 CUV 上下文学习。"}]
    title, detail = grammar(text)
    phrase, background = theme(chapter, verse)
    return {
        "vocab": vocab,
        "grammar": [{"title": title, "detail": detail}],
        "expression": [{"phrase": phrase, "note": background}],
        "translation": "",
    }


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "James"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "James")
    for chapter in range(1, 6):
        payload = {
            str(int(verse["verse"])): note(
                chapter, int(verse["verse"]), clean_verse_text(str(verse["text"]))
            )
            for verse in filter_chapter(verses, chapter)
        }
        write_json(output / f"{chapter}.json", payload)
        print(f"James {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
