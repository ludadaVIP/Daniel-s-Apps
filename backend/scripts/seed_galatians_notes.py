"""Create static, verse-level Bible and Eng notes for Galatians 1–6."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


VOCAB = {
    "apostle": ("n.", "使徒；奉差遣者"), "grace": ("n.", "恩典"),
    "gospel": ("n.", "福音；好消息"), "astonished": ("adj.", "惊讶的"),
    "accursed": ("adj.", "被咒诅的"), "revelation": ("n.", "启示"),
    "persecute": ("v.", "逼迫"), "justify": ("v.", "称义；宣告为义"),
    "faith": ("n.", "信心、信靠"), "works": ("n.", "行为、功劳"),
    "hypocrisy": ("n.", "假冒为善"), "crucified": ("v.", "被钉十字架"),
    "righteousness": ("n.", "义、称义地位"), "promise": ("n.", "应许"),
    "law": ("n.", "律法"), "curse": ("n.", "咒诅"),
    "redeemed": ("v.", "救赎、赎出"), "inheritance": ("n.", "基业"),
    "guardian": ("n.", "监护人、训蒙师"), "sons": ("n.", "儿女、后嗣"),
    "adoption": ("n.", "儿子的名分"), "slave": ("n.", "奴仆"),
    "freedom": ("n.", "自由"), "circumcision": ("n.", "割礼"),
    "flesh": ("n.", "肉体；堕落本性"), "Spirit": ("n.", "圣灵"),
    "fruit": ("n.", "果子"), "gentleness": ("n.", "温柔"),
    "bear": ("v.", "承担"), "sow": ("v.", "撒种"),
    "boast": ("v.", "夸口"), "new creation": ("n.", "新造的人"),
}

THEMES = {
    1: [
        (range(1, 11), "one true gospel", "保罗宣告福音来自神；任何更改恩典福音的“别的福音”都不是真福音。"),
        (range(11, 25), "Paul's gospel by revelation", "保罗的福音和使徒职分来自基督启示；他从逼迫者转为传扬主的人。"),
    ],
    2: [
        (range(1, 11), "the gospel preserved", "耶路撒冷使徒承认保罗给外邦人的福音职分，不可把割礼当作得救条件。"),
        (range(11, 15), "gospel integrity at Antioch", "保罗公开责备彼得，因为退缩与隔离外邦人不合福音真理。"),
        (range(15, 22), "justified through faith", "人称义不靠律法行为，乃因信耶稣基督；保罗与基督同钉十字架而活。"),
    ],
    3: [
        (range(1, 10), "faith, not works of the law", "圣灵与称义起于信心；亚伯拉罕因信称义，靠律法行为的人落在咒诅下。"),
        (range(10, 15), "Christ redeems from the curse", "基督代替我们承受律法咒诅，使亚伯拉罕的福临到万邦。"),
        (range(15, 23), "promise before the law", "神对亚伯拉罕的应许先于律法；律法不能废掉应许，也不能赐生命。"),
        (range(23, 30), "sons of God through faith", "律法如暂时的监护，信徒因信在基督里成为神儿女、同为后嗣。"),
    ],
    4: [
        (range(1, 12), "from slavery to sonship", "神在日期满足时差遣儿子，使受律法辖制的人得儿子名分与自由。"),
        (range(12, 21), "Paul's pastoral appeal", "保罗以深情呼唤加拉太人回到恩典，不可被靠肉体夸口的人迷惑。"),
        (range(21, 32), "Hagar and Sarah", "夏甲与撒拉的图像对比奴役与应许、旧约辖制与在基督里的自由。"),
    ],
    5: [
        (range(1, 13), "freedom in Christ", "基督使人得自由；不可再受律法规条辖制，也不可把自由当作放纵肉体的机会。"),
        (range(13, 16), "serve one another through love", "全律法在爱邻舍上得成全；自由的正确用法是藉爱互相服事。"),
        (range(16, 27), "walk by the Spirit", "肉体与圣灵相争；圣灵的果子取代肉体明显的恶行，属基督者已钉死肉体。"),
    ],
    6: [
        (range(1, 11), "restore, bear, and sow", "以温柔挽回跌倒者、彼此担当重担；人种什么就收什么，不可灰心行善。"),
        (range(11, 19), "the cross and new creation", "保罗拒绝靠割礼夸口，只夸基督十字架；真正的记号是新造的人。"),
    ],
}


def theme(chapter: int, verse: int) -> tuple[str, str]:
    for verses, phrase, explanation in THEMES[chapter]:
        if verse in verses:
            return phrase, explanation
    raise ValueError((chapter, verse))


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出条件、假设或反问；留意保罗用它推进论证的方式。"
    if lower.startswith("for "):
        return "For 连接论证", "For 把本节与前文相连，给出理由、依据或后果。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出保罗所否定的道路与福音真理之间的关键对比。"
    if "not " in lower and " but " in lower:
        return "not ... but ...", "否定一种错误倚靠，以 but 强调真正的福音道路。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、内容或结果；先找它所指代的对象。"
    return "主句与修饰成分", "先找主语与有限动词，再把介词短语、分词短语放回保罗的论证链。"


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
        vocab = [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合 ESV 与 CUV 上下文理解。"}]
    title, detail = grammar(text)
    phrase, explanation = theme(chapter, verse)
    return {
        "vocab": vocab,
        "grammar": [{"title": title, "detail": detail}],
        "expression": [{"phrase": phrase, "note": explanation}],
        "translation": "",
    }


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Galatians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Galatians")
    for chapter in range(1, 7):
        payload = {
            str(int(verse["verse"])): note(
                chapter, int(verse["verse"]), clean_verse_text(str(verse["text"]))
            )
            for verse in filter_chapter(verses, chapter)
        }
        write_json(output / f"{chapter}.json", payload)
        print(f"Galatians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
