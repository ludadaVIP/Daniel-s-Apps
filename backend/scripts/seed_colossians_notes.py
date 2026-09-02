"""Create static, verse-level Bible and Eng notes for Colossians 1–4."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


VOCAB = {
    "grace": ("n.", "恩典；神白白赐下的恩惠"),
    "gospel": ("n.", "福音；好消息"),
    "hope": ("n.", "盼望"),
    "knowledge": ("n.", "认识、知识"),
    "wisdom": ("n.", "智慧"),
    "strengthened": ("v.", "被加强、得力量"),
    "deliver": ("v.", "拯救、救出"),
    "redemption": ("n.", "救赎；付代价得释放"),
    "forgiveness": ("n.", "赦免"),
    "image": ("n.", "形像、形象"),
    "firstborn": ("n.", "首生者；居首位者"),
    "created": ("v.", "被创造"),
    "reconcile": ("v.", "使和好"),
    "mystery": ("n.", "奥秘；从前隐藏、如今启示的计划"),
    "suffering": ("n.", "受苦"),
    "fullness": ("n.", "丰满、完全"),
    "circumcision": ("n.", "割礼"),
    "baptism": ("n.", "洗礼"),
    "forgiven": ("v.", "被赦免"),
    "shadow": ("n.", "影子、预表"),
    "substance": ("n.", "实体、本体"),
    "humility": ("n.", "谦卑"),
    "self-made": ("adj.", "人为制定的"),
    "raised": ("v.", "被复活、被举起"),
    "put to death": ("phr.", "治死、彻底弃绝"),
    "compassion": ("n.", "怜悯"),
    "forgiving": ("v.", "饶恕"),
    "peace": ("n.", "平安、和好"),
    "thankful": ("adj.", "感恩的"),
    "prayer": ("n.", "祷告"),
    "devote": ("v.", "专心投入"),
    "redeem": ("v.", "善用、赎回"),
}

THEMES = {
    1: [
        (range(1, 15), "thanksgiving and gospel fruit", "保罗为歌罗西信徒的信心、爱心与福音结出的果子感恩，并为他们求属灵智慧。"),
        (range(15, 21), "the supremacy of Christ", "基督是神的完全彰显、万有的创造主与维系者，也是教会的元首。"),
        (range(21, 30), "reconciliation and ministry", "神借十字架使敌对者和好，并托付保罗传扬“基督在你们里面”的奥秘。"),
    ],
    2: [
        (range(1, 9), "fullness in Christ", "保罗要信徒在基督里扎根建造；神一切的丰满有形有体地居住在基督里。"),
        (range(9, 16), "alive with Christ", "信徒借与基督联合得着属灵割礼、同死同复活，并蒙赦罪、胜过仇敌。"),
        (range(16, 24), "Christ, not human regulations", "饮食、节期等只是影子；不可让人为规条、假谦卑或天使敬拜取代基督。"),
    ],
    3: [
        (range(1, 12), "the new life above", "既与基督同复活，信徒当思念上面的事，治死旧人属地的罪欲。"),
        (range(12, 18), "the new community", "蒙拣选者当穿上怜悯、谦卑、温柔和忍耐，以基督的平安与道建立群体。"),
        (range(18, 26), "Christ in household and work", "家庭与工作关系都要在主里重塑；服事人时最终是在服事主基督。"),
    ],
    4: [
        (range(1, 7), "prayer and wise witness", "以公正对待人、恒切祷告、把握机会和有恩慈的话语见证福音。"),
        (range(7, 19), "fellow workers and final instructions", "推基古、阿尼西母等同工承载保罗对教会的关怀；书信以问安、劝勉和恩典结束。"),
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
        return "if 条件句", "if 引出条件或假设；注意主句所给出的属灵结论与行动。"
    if lower.startswith("let ") or " let " in lower:
        return "Let + 宾语 + 动词", "let 引出劝勉：让真理具体塑造群体生活。"
    if "not " in lower and " but " in lower:
        return "not ... but ...", "否定错误道路，以 but 转向保罗所强调的基督中心回应。"
    if lower.startswith("for "):
        return "For 连接论证", "For 说明前一句的理由、依据或进一步解释。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为前面的名词补充身份、内容或结果。"
    return "主句与修饰成分", "先找主语与有限动词，再把介词短语和分词短语接回主句。"


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
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Colossians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Colossians")
    for chapter in range(1, 5):
        payload = {
            str(int(verse["verse"])): note(
                chapter, int(verse["verse"]), clean_verse_text(str(verse["text"]))
            )
            for verse in filter_chapter(verses, chapter)
        }
        write_json(output / f"{chapter}.json", payload)
        print(f"Colossians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
