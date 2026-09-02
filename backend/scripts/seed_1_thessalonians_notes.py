"""Create static ESV learning notes for every verse of 1 Thessalonians."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "grace and peace", "保罗、西拉和提摩太向在父神和主耶稣基督里的教会问安；书信一开始便以恩典和平安界定教会身份。"),
        (2, "work of faith", "使徒为他们常常感谢祷告，记念他们信心所作的工、爱心所受的劳苦，以及在主耶稣里的盼望所生的忍耐。"),
        (4, "chosen by God", "保罗知道他们蒙拣选，因为福音临到不只在言语，也在能力、圣灵和充足确据中，并可从传道人的生活看出。"),
        (6, "imitators and an example", "他们在患难中仍带着圣灵的喜乐领受真道，效法主和使徒，且成为马其顿、亚该亚信徒的榜样。"),
        (8, "turned to God", "主的道从他们传扬出去；他们离弃偶像归向神，服事又真又活的神，并等候从天降临、救他们脱离将来忿怒的耶稣。"),
    ],
    2: [
        (1, "not in vain", "保罗的访问虽受逼迫却不徒然；他靠神壮胆，在强烈争战中传福音。"),
        (3, "not from error", "他的劝勉不出于错误、污秽或诡诈；既受神验中托付福音，就为讨神喜悦而说话。"),
        (5, "not with flattery", "使徒从未用谄媚、贪心遮掩或寻求人荣耀，神可以作证。"),
        (7, "gentle among you", "他们虽可行使使徒权柄，却像母亲乳养孩子般温柔，乐意分享福音并自己的生命。"),
        (9, "working night and day", "保罗昼夜劳苦，避免成为教会负担，同时传神的福音；信徒和神都见证他圣洁、公义、无可指摘的生活。"),
        (11, "like a father", "他又像父亲劝勉、安慰、嘱咐每一个人，使他们行事为人配得召他们进入自己国度和荣耀的神。"),
        (13, "the word of God", "帖撒罗尼迦人领受使徒的话不是人的道，乃是神的道；这道如今在信的人里面运行。"),
        (14, "suffering from your own countrymen", "他们效法犹太地教会，在同胞手中受苦；保罗描述拒绝福音者的敌对，并把最终审判交给神。"),
        (17, "endeavored to see you", "保罗暂时与他们分离，心里却不分离，多次想探访却受撒但拦阻；他们是他在主再来时的盼望、喜乐与冠冕。"),
    ],
    3: [
        (1, "sent Timothy", "保罗在雅典宁愿独自留下，差提摩太去坚固和劝勉信徒，免得有人因患难动摇。"),
        (3, "destined for afflictions", "患难不是意外：使徒早已预告，信徒也知道自己在这世界被定于面对患难。"),
        (5, "the tempter", "保罗担心试探者使他们的信心动摇，令先前劳苦归于徒然，因此急切派人查验。"),
        (6, "good news of faith and love", "提摩太带回他们信心和爱心的好消息，也说他们常常想念保罗、盼望相见，使保罗在困苦中得安慰。"),
        (8, "now we live", "他们在主里站立坚固，令保罗如得生命；他以难以尽述的感谢在神面前为他们欢喜。"),
        (10, "increase and abound in love", "保罗昼夜切切祈求能补足他们信心的不足，并愿主使他们彼此相爱、爱众人的心增长充足。"),
        (12, "blameless in holiness", "爱的目标是主再来时在父面前坚固内心、圣洁无可责备，且主来时与众圣徒同临。"),
    ],
    4: [
        (1, "walk to please God", "保罗劝他们照所领受的教导继续行事讨神喜悦，并更加长进。"),
        (3, "your sanctification", "神的旨意是成圣：要远避淫乱，各人以圣洁尊贵管理自己的身体，而非像不认识神的外邦人放纵情欲。"),
        (6, "the Lord is an avenger", "不可在这事上越分欺负弟兄，因为主必追讨；神召我们不是要沾染污秽，乃要成为圣洁。"),
        (8, "God gives his Holy Spirit", "拒绝这圣洁教导不是拒绝人，而是拒绝把圣灵赐给信徒的神。"),
        (9, "taught by God to love", "他们已有神亲自教导的弟兄之爱，且已爱马其顿众弟兄；保罗仍劝勉他们越发增多。"),
        (11, "aspire to live quietly", "安静、办自己的事、亲手作工，使人可以在外人面前端正行事，不倚赖别人。"),
        (13, "those who are asleep", "保罗不愿他们为已睡的信徒忧伤如没有盼望的人，因为耶稣死而复活，神也必把睡了的人同耶稣带来。"),
        (15, "the coming of the Lord", "主的话保证：活到主降临的人不能先于睡了的人；主亲自降临，死人先复活，活着者随后被提与主相遇。"),
        (18, "encourage one another", "这些再临与复活的真理不是供猜测时间表，而是要信徒彼此安慰。"),
    ],
    5: [
        (1, "day of the Lord", "日期时候无需另写，因为主的日子像夜间贼一样临到；当人说平安稳妥，突如其来的毁灭就来到。"),
        (4, "children of light", "信徒不在黑暗中，不会让那日如贼临到；他们是光明之子、白昼之子，不属黑夜与黑暗。"),
        (6, "be sober", "因此不可睡觉，要警醒谨守；睡和醉属夜间，白昼的人当以信爱作护心镜，以得救盼望作头盔。"),
        (9, "destined for salvation", "神不是预定信徒受忿怒，乃预定他们藉主耶稣得救；他为我们死，叫我们或醒或睡都与他同活。"),
        (11, "encourage and build up", "既有这样的盼望，教会当彼此劝慰、彼此建立，并尊重那些在主里劳苦、治理、劝戒他们的人。"),
        (13, "be at peace", "应因同工的劳苦格外敬重他们，也要彼此和睦；对不守规矩者警戒、扶助软弱者、向众人忍耐。"),
        (15, "always seek to do good", "不可恶报恶，应常彼此并向众人追求善。"),
        (16, "rejoice always", "简洁命令串连：常常喜乐、不住祷告、凡事谢恩；这就是神在基督耶稣里对信徒的旨意。"),
        (19, "do not quench the Spirit", "不可熄灭圣灵感动，也不可藐视先知讲道；却要凡事察验，善的持守，各样恶事禁戒。"),
        (23, "sanctify you completely", "平安的神亲自使他们全然成圣，保守灵、魂、身子在主来时完全无可指摘；呼召他们的神是信实的，必成就。"),
        (25, "pray and greet", "保罗求代祷，命令以圣洁亲嘴问安，并确保书信向众弟兄宣读；结尾仍是主耶稣基督的恩典。"),
    ],
}

VOCAB = {
    "faith": ("n.", "信心"), "love": ("n.", "爱"), "hope": ("n.", "盼望"), "election": ("n.", "拣选"),
    "gospel": ("n.", "福音"), "Spirit": ("n.", "圣灵"), "imitators": ("n.", "效法者"), "idols": ("n.", "偶像"),
    "affliction": ("n.", "患难"), "flattery": ("n.", "谄媚"), "greed": ("n.", "贪心"), "gentle": ("adj.", "温柔的"),
    "blameless": ("adj.", "无可指摘的"), "glory": ("n.", "荣耀"), "temptation": ("n.", "试探"),
    "encouragement": ("n.", "劝勉；安慰"), "holiness": ("n.", "圣洁"), "sanctification": ("n.", "成圣"),
    "immorality": ("n.", "淫乱"), "passion": ("n.", "情欲"), "avenge": ("v.", "追讨；报应"),
    "resurrection": ("n.", "复活"), "coming": ("n.", "降临"), "asleep": ("adj.", "睡了；指信徒离世"),
    "sober": ("adj.", "清醒谨守的"), "salvation": ("n.", "救恩"), "quench": ("v.", "熄灭；压制"),
    "prophecies": ("n.", "预言；先知讲道"), "test": ("v.", "察验"), "grace": ("n.", "恩典"),
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
        return "修辞问句", "保罗藉问句澄清盼望或挑战错误推论，答案由紧邻上下文给出。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 与 so 连接比较或前提和结果；要把两边的关系一起读。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件或假设；留意它所导向的安慰、警告或劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 给出前文的理由、证据或进一步解释。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 将前面的福音事实推进到实际生活结论。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "保罗先否定错误道路，再用 but 指明真正合乎主的行动。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 指示反差或校正，需要同时看清前后文。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("rejoice") or " must " in lower:
        return "命令句", "祈使语气将信徒的盼望转为具体生活、团契和祷告实践。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、目的或结果；先找其所修饰的对象。"
    return "主句与修饰成分", "先找主要动词和主语，再处理并列和介词结构，跟随保罗的牧养思路。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 与本段脉络理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 Thessalonians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 Thessalonians")
    for chapter in range(1, 6):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / f"{chapter}.json", payload)
        print(f"1 Thessalonians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
