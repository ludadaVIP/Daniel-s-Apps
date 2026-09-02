"""Create static ESV learning notes for every verse of 2 Peter."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "a faith of equal standing", "西门彼得写给因我们神和救主耶稣基督的义得着同样宝贵信心的人；恩典和平安藉认识神和耶稣加增。"),
        (3, "partakers of the divine nature", "神的能力已把关乎生命敬虔的一切赐给信徒，藉荣耀美德呼召他们，并赐宝贵极大的应许，使他们脱离世上情欲败坏，有分于神的性情。"),
        (5, "make every effort", "既有神所赐的根基，信徒当殷勤在信心上加德行、知识、节制、忍耐、敬虔、弟兄之爱和爱。"),
        (8, "confirm your calling", "这些品格若充足增长，就使人认识基督不至闲懒不结果；缺少者近视瞎眼，忘记旧罪已经洁净，因此当更殷勤坚固蒙召拣选。"),
        (11, "the eternal kingdom", "这样行的人永不失脚，并得丰富进入主救主耶稣基督永远的国。"),
        (12, "remind you", "彼得知道读者已经知道并坚固在真道中，仍要常常提醒；在地上帐棚中他认为激励他们是应当的。"),
        (14, "after my departure", "主耶稣已指示彼得将要离开身体，他要尽力使信徒在他去世后仍常记念这些事。"),
        (16, "eyewitnesses of his majesty", "使徒传主的能力和降临不是随从乖巧捏造的虚言，而是亲眼见过他在圣山上的威荣。"),
        (17, "the prophetic word", "父神在荣耀中称耶稣为爱子，使徒亲耳听见；预言的话因此更确实，信徒当留意如同黑暗处的灯，直到晨星在心里出现。"),
        (20, "not from man's own interpretation", "预言不是人意产生的，乃是人被圣灵感动说出神的话；解释和使用圣经必须尊重其神圣来源。"),
    ],
    2: [
        (1, "false teachers", "假先知曾在以色列中，假教师也会在教会中暗暗引进毁灭性异端，甚至否认买他们的主，自取速速灭亡。"),
        (2, "their sensuality", "许多人会随从其淫荡，真道因此被毁谤；他们因贪心用捏造言语取利，神的审判早已不迟延。"),
        (4, "God knows how", "神没有宽容犯罪天使、古时不敬虔世界或不义的所多玛蛾摩拉，却保守挪亚和罗得；这证明主能救敬虔人脱离试探、留不义者受审判。"),
        (10, "bold and willful", "假教师随从污秽情欲、轻慢权柄，胆大任性毁谤属灵尊荣；天使尚且不在主前用毁谤话控告他们。"),
        (12, "creatures of instinct", "他们如无理性牲畜，为捉拿宰杀而生，毁谤所不明白的，必在败坏中败坏；他们以白日宴乐为快乐，玷污聚会。"),
        (15, "the way of Balaam", "他们离弃正路，随从巴兰贪爱不义工价；驴以人言拦阻先知的狂妄。"),
        (17, "springs without water", "假师是无水的泉、暴风催逼的雾气，结局是幽暗；他们说虚妄夸大的话，以肉身情欲引诱刚脱离错谬者。"),
        (19, "slaves of corruption", "他们应许自由，自己却作败坏奴仆；人被谁制伏就作谁奴仆。认识主又回到世俗污秽者，后来的景况比先前更坏。"),
        (21, "the dog returns", "知道义路又离弃圣命，比不知道更糟；箴言的狗回到所吐的和猪洗净又回泥里，描写回转旧罪的悲剧。"),
    ],
    3: [
        (1, "stir up your sincere mind", "彼得写第二封信要唤醒他们纯洁的心思，记念先知的话和主救主藉使徒所传的命令。"),
        (3, "scoffers will come", "末世必有人随私欲讥诮主再来，问应许在哪里；他们故意忘记天地由神话而有，也曾被洪水毁灭。"),
        (8, "the Lord is not slow", "主的一日如千年、千年如一日；他不是耽延，而是宽容，不愿一人沉沦，乃愿人人悔改。"),
        (10, "the day of the Lord", "主的日子要像贼来到，天地有形质被烈火销化；既知万物将如此销毁，信徒当有圣洁敬虔生活。"),
        (12, "new heavens and a new earth", "信徒等候并催促神日子来到，也按应许盼望有义居住的新天新地。"),
        (14, "be diligent", "既等候这些事，就要殷勤使自己在主面前无玷污、无可指摘、安然；把主的忍耐看作得救。"),
        (15, "our beloved brother Paul", "彼得认可保罗按所赐智慧所写的书信，也警告无学问不坚固的人强解圣经，自取沉沦。"),
        (17, "grow in grace", "既预先知道假师危险，就要谨慎免得被恶人的错谬诱惑而失落坚固，反要在主救主耶稣基督的恩典和知识上长进。"),
    ],
}

VOCAB = {
    "faith": ("n.", "信心"), "righteousness": ("n.", "义"), "knowledge": ("n.", "知识"), "divine": ("adj.", "属神的"),
    "godliness": ("n.", "敬虔"), "promises": ("n.", "应许"), "corruption": ("n.", "败坏"), "virtue": ("n.", "德行"),
    "self-control": ("n.", "自制"), "steadfastness": ("n.", "忍耐；坚定"), "calling": ("n.", "呼召"), "kingdom": ("n.", "国度"),
    "eyewitnesses": ("n.", "亲眼见证人"), "prophetic": ("adj.", "预言的"), "interpretation": ("n.", "解释"), "Holy Spirit": ("n.", "圣灵"),
    "false": ("adj.", "虚假的"), "heresies": ("n.", "异端"), "sensuality": ("n.", "放纵情欲"), "judgment": ("n.", "审判"),
    "unrighteous": ("adj.", "不义的"), "authority": ("n.", "权柄"), "Balaam": ("n.", "巴兰"), "freedom": ("n.", "自由"),
    "slaves": ("n.", "奴仆"), "scoffers": ("n.", "讥诮者"), "repentance": ("n.", "悔改"), "day": ("n.", "日子"),
    "holy": ("adj.", "圣洁的"), "new": ("adj.", "新的"), "grace": ("n.", "恩典"),
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
        return "修辞问句", "彼得以问句反驳讥诮或唤醒读者，应从相邻经文把握预期答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出比较或前提，so 推出对应结果；要把前后两面一同理解。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件或假设，留意它带出的警告、结论或盼望。"
    if lower.startswith("for "):
        return "For 理由连接", "For 给出前文的理由、依据或进一步说明。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 将神学真理推进到坚守和圣洁的实践。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定错误看法或生活，再用 but 指出正确的真理和回应。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标示反差和校正；需留心转折前后彼此解释。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气将末世盼望落实为分辨、悔改和在恩典中长进。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 说明身份、内容或结果；先找清楚其修饰对象。"
    return "主句与修饰成分", "先找到主语和主要动词，再整理并列与介词结构，跟随彼得的劝勉。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 和本段劝勉理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "2 Peter"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "2 Peter")
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
        print(f"2 Peter {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
