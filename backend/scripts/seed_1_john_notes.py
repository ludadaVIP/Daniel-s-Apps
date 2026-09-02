"""Create static ESV learning notes for every verse of 1 John."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "the word of life", "约翰见证从起初原有的生命之道：使徒亲耳听见、亲眼看见、亲手摸过那位显现的永生，并把所见所闻传给读者。"),
        (3, "fellowship with the Father", "传扬的目的不是知识炫耀，而是使读者与使徒相交，而这相交是在父神和他儿子耶稣基督里，使喜乐满足。"),
        (5, "God is light", "神就是光，在他毫无黑暗；若说与神相交却仍行在黑暗中，就是说谎、不行真理。"),
        (7, "the blood of Jesus", "在光中行不表示无罪完美，却表示与彼此相交，并持续倚靠耶稣儿子的血洗净一切罪。"),
        (8, "confess our sins", "若说自己无罪就是自欺；若承认罪，信实公义的神必赦免并洁净。若说没有犯过罪，就是把神当作说谎的。"),
    ],
    2: [
        (1, "our advocate", "约翰写信使人不犯罪；若有人犯罪，耶稣基督这义者在父面前作中保，他也是为罪的挽回祭，不只为我们，也为普天下。"),
        (3, "keep his commandments", "认识神的确据表现为遵守诫命；口称认识却不遵守的是说谎，遵守神道的，神的爱在他里面得以完全。"),
        (6, "walk as Jesus walked", "住在基督里面的人当照主所行的去行；爱的命令既是旧的也是新的，在基督和信徒身上真成为事实。"),
        (9, "love your brother", "恨弟兄仍在黑暗中，爱弟兄就住在光明中，没有使人跌倒的缘由；恨使人瞎眼，不知往哪里去。"),
        (12, "I am writing to you", "约翰按属灵阶段称呼小子、父老和少年人：罪因主名得赦，认识父与从起初原有者，并靠神道胜过那恶者。"),
        (15, "do not love the world", "不可爱世界和世界上的事；肉体情欲、眼目情欲和今生骄傲不从父来，世界及其情欲都要过去，惟遵行神旨意的永远常存。"),
        (18, "many antichrists", "末时已有许多敌基督者从教会出去，显明他们本不属我们；信徒有从圣者来的恩膏，知道真理。"),
        (22, "the liar", "否认耶稣是基督的就是敌基督，否认子也没有父；承认子的人也有父。"),
        (24, "let what you heard abide", "要让从起初所听见的福音常住在里面，如此就住在子和父里面；主所应许的是永生。"),
        (26, "abide in him", "约翰写这些为防迷惑者；神的恩膏教导信徒真理，叫他们住在主里，在他显现时坦然无惧。"),
    ],
    3: [
        (1, "children of God", "父赐何等的爱，使我们称为神的儿女，而且确是如此；世人不认识我们，是因未认识他。"),
        (2, "we shall be like him", "现今已是神儿女，将来如何尚未显明；主显现时必见他真体，我们也必像他，盼望使人洁净自己。"),
        (4, "lawlessness", "罪就是不法；基督显现是为除掉罪，他里面没有罪。住在他里面的人不持续活在罪的模式中。"),
        (7, "practice righteousness", "不要受迷惑：行义的才是义人，如同基督是义的；持续犯罪显出属魔鬼，神儿子显现为要除灭魔鬼作为。"),
        (9, "born of God", "从神生的人不以罪为持续身份，因为神的种子住在他里面；这里强调新生命与持续犯罪的根本不相容。"),
        (10, "love his brother", "神儿女与魔鬼儿女的区别显明在是否行义、是否爱弟兄；这正是从起初所听见的命令。"),
        (12, "not like Cain", "不可像该隐属那恶者而杀弟兄；他的行为恶、亚伯行为善，世人的恨不应令信徒惊讶。"),
        (14, "passed out of death", "爱弟兄显明已从死入生；不爱的人仍住在死中，恨弟兄的等同杀人者，没有永生住在其中。"),
        (16, "lay down our lives", "基督为我们舍命定义了爱；我们也应为弟兄舍命，至少不可见弟兄缺乏却关闭怜悯的心。"),
        (18, "in deed and in truth", "爱不可只在言语舌头上，乃要在行动和真理上；这使我们知道属真理，也能在神前安稳良心。"),
        (20, "God is greater than our heart", "良心若责备，神比我们的心大，知道一切；若良心不责备，就可坦然到神面前，并因遵命行他所喜悦的得着祈求。"),
        (23, "believe and love", "神的命令可概括为信他儿子耶稣基督的名，并照所赐命令彼此相爱；遵守命令者住在神里面，圣灵作此确据。"),
    ],
    4: [
        (1, "test the spirits", "不可每个灵都信，要试验是否出于神，因为许多假先知已经出来；承认耶稣基督成了肉身的灵出于神。"),
        (4, "greater is he", "属神的儿女已胜过假先知，因为在信徒里面的圣灵比在世界里的更大；假师属世界，说世界的话，世界也听从他们。"),
        (6, "the Spirit of truth", "使徒属神，认识神的人听从使徒教训，不属神的不听；由此分辨真理的灵和谬妄的灵。"),
        (7, "God is love", "应彼此相爱，因为爱从神来；凡有爱的是从神生、认识神。不爱的不认识神，因为神就是爱。"),
        (9, "sent his only Son", "神的爱在于差独生子到世间，使我们藉他得生；爱不在我们先爱神，乃在他爱我们，差子作挽回祭。"),
        (11, "God abides in us", "神既这样爱我们，我们也当彼此相爱；虽无人见过神，彼此相爱使神住在我们里面，他的爱得以完全。"),
        (13, "confess that Jesus", "神赐圣灵使我们知道住在他里面；使徒见证父差子作世人救主，承认耶稣是神儿子的人，神住在他里面。"),
        (16, "perfect love casts out fear", "住在爱里的就住在神里；爱在我们里面得以完全，使审判日坦然。惧怕含着刑罚，成熟的爱除去这种惧怕。"),
        (19, "love one another", "我们爱因为神先爱我们；口称爱神却恨弟兄的是说谎，不能爱看得见弟兄者也不能爱未见的神。"),
    ],
    5: [
        (1, "born of God", "信耶稣是基督者从神而生；爱生人的，也爱从他生的。爱神并遵守诫命就是爱神儿女的标记。"),
        (3, "his commandments are not burdensome", "爱神就是遵守他的诫命；诫命不沉重，因为从神生的胜过世界，胜过世界的就是我们的信心。"),
        (5, "the one who believes", "胜过世界的是信耶稣是神儿子的人；耶稣藉水和血而来，不只藉水，圣灵也作见证，因为圣灵是真理。"),
        (7, "the testimony of God", "水、血、圣灵一致作见证；若接受人的见证，神为他儿子所作的见证更大，不信者是把神当作说谎的。"),
        (11, "eternal life in his Son", "神所作见证就是赐我们永生，这生命在他儿子里面；有子就有生命，没有神儿子就没有生命。"),
        (13, "that you may know", "约翰写给信神儿子之名的人，叫他们知道自己有永生；我们向神所存的坦然是照他旨意求什么他就听。"),
        (16, "sin leading to death", "看见弟兄犯罪可为他祈求，神会赐生命；“至于死的罪”是困难经文，约翰不命令人为此祈求，同时坚持一切不义都是罪。"),
        (18, "keeps him safe", "从神生的人不持续犯罪；那从神生的保守他，那恶者不能害他。我们属神，全世界却卧在那恶者手下。"),
        (20, "true God and eternal life", "神儿子已经来到，赐我们悟性认识真实者；我们在真实者里面，就是在他儿子耶稣基督里面，他是真神也是永生。"),
        (21, "keep yourselves from idols", "最后简短命令警告一切取代真神和其儿子的敬拜对象；全书的真理、爱和生命都防止偶像。"),
    ],
}

VOCAB = {
    "life": ("n.", "生命"), "manifested": ("v.", "显现；显明"), "fellowship": ("n.", "相交；团契"), "light": ("n.", "光"),
    "darkness": ("n.", "黑暗"), "confess": ("v.", "承认"), "forgive": ("v.", "赦免"), "advocate": ("n.", "中保；辩护者"),
    "propitiation": ("n.", "挽回祭"), "commandments": ("n.", "诫命"), "abide": ("v.", "住在；常存"), "world": ("n.", "世界"),
    "antichrist": ("n.", "敌基督"), "anointing": ("n.", "恩膏"), "righteousness": ("n.", "义"), "lawlessness": ("n.", "不法"),
    "born": ("v.", "出生；从神生"), "love": ("n.", "爱"), "conscience": ("n.", "良心"), "spirits": ("n.", "诸灵"),
    "test": ("v.", "试验；辨别"), "truth": ("n.", "真理"), "fear": ("n.", "惧怕"), "testimony": ("n.", "见证"),
    "eternal": ("adj.", "永恒的"), "prayer": ("n.", "祷告"), "sin": ("n.", "罪"), "idols": ("n.", "偶像"),
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
        return "修辞问句", "约翰用问句检验信仰宣称或揭示其逻辑后果，应联系前后文回答。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出关系或前提，so 给出相应结论；两边共同构成约翰的论证。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入真实检验或假设；注意它连接的生活、信仰与确据。"
    if lower.startswith("for "):
        return "For 理由连接", "For 给出前文陈述的依据和解释，常把神的本性与信徒实践相连。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把神的爱与基督工作推向信徒的生活结论。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "约翰常用此句型区分真与假、光与暗、神的儿女与世界的道路。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出神的真理与错误声称之间的关键反差。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气呼召人在光中行、彼此相爱、分辨真理并保守自己。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为人物、真理或见证补充身份与内容；先找所修饰对象。"
    return "主句与修饰成分", "先找主语和主要动词，再读并列与补语，跟随约翰简洁却循环深化的论证。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 和本书光、爱、生命的脉络理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 John"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 John")
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
        print(f"1 John {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
