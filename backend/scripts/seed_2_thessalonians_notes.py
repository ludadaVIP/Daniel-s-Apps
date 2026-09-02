"""Create static ESV learning notes for every verse of 2 Thessalonians."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "grace and peace", "保罗、西拉和提摩太向在父神和主耶稣基督里的教会问安；恩典和平安是患难中教会身份的根基。"),
        (3, "faith growing abundantly", "保罗为他们不断感谢，因为信心大大增长、彼此相爱的心增加；使徒在众教会中夸耀他们在逼迫患难中的坚忍与信心。"),
        (5, "worthy of the kingdom", "他们的忍耐是神公义审判的明证，表明他们配得神的国；他们正为这国受苦。"),
        (6, "relief at the revelation", "神必以患难报应加患难者，并在主耶稣从天显现、带着大能天使和火焰时，使受苦者得安息。"),
        (8, "the penalty of eternal destruction", "拒绝认识神、不顺从主耶稣福音者面对审判，永远离开主的面和他权能的荣光。"),
        (10, "glorified in his saints", "主那日要在圣徒身上得荣耀、在信的人身上被惊奇；帖撒罗尼迦人也包括在内，因为他们信了使徒的见证。"),
        (11, "worthy of his calling", "使徒常为他们祷告，愿神使他们配得呼召，以能力成就一切良善愿望和信心工作，使主名得荣耀。"),
    ],
    2: [
        (1, "the coming and our gathering", "论到主再来和信徒被聚集到他那里，保罗劝他们不要因所谓灵感、言语或假信而轻易动心或惊慌。"),
        (3, "the rebellion and the man of lawlessness", "主的日子尚未到；先有背道，并显露不法的人，他自高敌挡神，甚至坐在神的殿中自称为神。"),
        (5, "what is restraining", "保罗提醒他们已受过有关拦阻者的教导；不法奥秘已经发动，却仍受神所容许的拦阻，直到规定时候。"),
        (8, "the Lord Jesus will kill", "不法者显露时，主耶稣要以口中的气灭绝他，并以降临的显现使他无用。"),
        (9, "false signs and wonders", "不法者按撒但活动而来，有各样虚假的能力、神迹奇事和不义的诡诈，迷惑那些拒绝爱真理的人。"),
        (11, "believe what is false", "因人不领受真理的爱，神任凭他们受强烈迷惑，以致相信虚谎；审判临到不信真理、喜爱不义的人。"),
        (13, "chosen ... through sanctification", "保罗转为感谢：神从起初拣选信徒，藉圣灵成圣和信真道得救，并藉福音召他们得着主耶稣的荣耀。"),
        (15, "stand firm", "因此要站立得稳，持守从使徒口传或书信所受的教训；永远安慰和美好盼望来自爱我们、施恩的父神和主。"),
        (16, "establish them", "保罗祷告愿主和父神安慰他们的心，并在一切善行善言上坚固他们。"),
    ],
    3: [
        (1, "pray for us", "保罗求代祷，使主的道快快行开、得着荣耀，也使使徒脱离不合理恶人的手；并非人人都有信心。"),
        (3, "the Lord is faithful", "人可以不信实，主却信实，必坚固并保守信徒脱离那恶者；保罗确信他们正在并将继续遵行所吩咐的。"),
        (5, "direct your hearts", "愿主引导他们的心进入神的爱和基督的忍耐，说明坚守首先是主在内心的工作。"),
        (6, "keep away from disorderly", "保罗奉主名命令他们远离不按使徒传统、游手好闲而不守规矩的弟兄。"),
        (7, "imitate us", "使徒在他们中间不懒惰、不白吃人的饭，昼夜劳苦作工，不是没有权柄，而是给教会榜样。"),
        (10, "not willing to work", "“不肯作工的，不可吃饭”针对拒绝工作的游手好闲者，不是针对无力工作或真正贫困者。"),
        (11, "busybody", "有人不安静作工却专管闲事；保罗吩咐他们安静作工，吃自己的饭，也劝其他人不可灰心行善。"),
        (14, "take note of that person", "若有人不听此信，应标记并不与他交往，使他羞愧；但不可当仇敌，要像弟兄劝戒，纪律仍带恢复目的。"),
        (16, "the Lord of peace", "结尾祈求平安的主随时随事赐平安；保罗亲笔问安作为书信真伪的记号，并以恩典祝福众人。"),
    ],
}

VOCAB = {
    "grace": ("n.", "恩典"), "peace": ("n.", "平安"), "faith": ("n.", "信心"), "steadfastness": ("n.", "坚忍；坚定"),
    "persecution": ("n.", "逼迫"), "affliction": ("n.", "患难"), "judgment": ("n.", "审判"), "kingdom": ("n.", "国度"),
    "revelation": ("n.", "显现；启示"), "gospel": ("n.", "福音"), "glory": ("n.", "荣耀"), "calling": ("n.", "呼召"),
    "coming": ("n.", "降临"), "gathering": ("n.", "聚集"), "rebellion": ("n.", "背道"), "lawlessness": ("n.", "不法"),
    "restrain": ("v.", "拦阻；抑制"), "signs": ("n.", "神迹；记号"), "deception": ("n.", "迷惑；欺骗"),
    "sanctification": ("n.", "成圣"), "traditions": ("n.", "传统；使徒教训"), "establish": ("v.", "坚固；建立"),
    "faithful": ("adj.", "信实的"), "disorderly": ("adj.", "不守规矩的；游手好闲的"), "imitate": ("v.", "效法"),
    "work": ("v.", "工作"), "busybody": ("n.", "好管闲事的人"), "admonish": ("v.", "劝戒"),
}


def theme(chapter: int, verse: int) -> tuple[str, str]:
    units = THEMES[chapter]
    for index, (start, phrase, explanation) in enumerate(units):
        next_start = units[index + 1][0] if index + 1 < len(units) else None
        if verse >= start and (next_start is None or verse < next_start):
            return phrase, explanation
    raise AssertionError((chapter, verse))


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗的问句用来澄清真理或挑战错误推论，应从上下文寻找预期答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出前提或比较，so 推出对应结果；二者须一起理解。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、可能性或反例；留意后面的警告、结果或劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 把本节接回前文，说明理由、依据或更进一步的解释。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 将教义事实推向坚守、安慰和实际生活。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "保罗否定一种错误反应，再以 but 指出应有的真理与行为。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标示反差或校正，需要把转折前后的论点一起读。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气将主再来的盼望落实为祷告、坚守和教会纪律。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、内容或结果；先找其回指对象。"
    return "主句与修饰成分", "先找主语和主要动词，再处理介词、并列和补语，跟上保罗的论证。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 与本段上下文理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "2 Thessalonians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "2 Thessalonians")
    for chapter in range(1, 4):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / f"{chapter}.json", payload)
        print(f"2 Thessalonians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
