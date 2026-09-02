"""Create static ESV learning notes for every verse of Titus."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "faith of God's elect", "保罗作为神仆人与耶稣基督使徒，为使神选民有信心、认识敬虔的真理，并盼望永生；这永生由不说谎的神在万古以前应许。"),
        (4, "grace and peace", "提多是保罗按共同信仰所生的真儿子；问安以父神和救主基督的恩典、平安为基础。"),
        (5, "appoint elders", "提多留在革哩底是要整顿未办完的事，在各城设立长老；职分是为建立地方教会，不是个人地位。"),
        (6, "above reproach", "长老应无可指摘、婚姻忠贞，儿女不受放荡不服约束的控告，显示其家庭见证。"),
        (7, "God's steward", "监督作为神管家不可任性、暴躁、醉酒、凶暴、贪不义之财，反要乐意接待、爱善、自守、公义、圣洁、节制。"),
        (9, "hold firm to the trustworthy word", "长老须坚守合乎使徒教训的真道，既能以纯正教训劝人，也能驳倒反对的人。"),
        (10, "empty talkers", "有许多不服约束、说虚空话、迷惑人的，尤其割礼派；他们为不义之财教导不该教的，败坏全家。"),
        (12, "rebuke them sharply", "革哩底人的文化刻板评价被保罗引用来说明假教师的处境，但解决之道是严厉责备，使人回转到健全信心。"),
        (14, "pure to the pure", "不可转向犹太荒渺言语和离弃真理者的诫命；污秽不信者心思良心都污秽，口称认识神却以行为否认他。"),
    ],
    2: [
        (1, "sound doctrine", "提多应教导与纯正教训相称的生活，显示真道必会塑造不同年龄和身份的人。"),
        (2, "older men", "老年男人应节制、庄重、自守，在信心、爱心和忍耐上健全。"),
        (3, "older women", "老年女人应有敬虔举止，不毁谤、不被酒奴役，作善的教师，训练年轻女子。"),
        (4, "younger women", "年轻女子学习爱丈夫儿女、自守纯洁、勤于家务、良善顺服，目的不让神的道受毁谤。"),
        (6, "younger men", "年轻男人也要自守；提多本人要在善行上作榜样，教训纯全庄重、言语健全无可指责。"),
        (9, "adorn the doctrine", "奴仆应凡事顺服、讨主人喜悦、不顶撞、不私拿东西，以忠诚使救主神的教训得荣耀。"),
        (11, "the grace of God has appeared", "救众人的神恩已经显明，训练信徒拒绝不敬虔和世俗私欲，在今世自守、公义、敬虔地生活。"),
        (13, "our great God and Savior", "信徒等候所盼望的福和大荣耀显现，就是我们伟大之神和救主耶稣基督的显现。"),
        (14, "a people for his own possession", "基督为我们舍己，要赎我们脱离一切不法，洁净我们作属自己的子民，热心为善。"),
        (15, "declare these things", "提多要以全权柄讲明、劝戒、责备这些事，不容人轻看。"),
    ],
    3: [
        (1, "ready for every good work", "信徒应顺服掌权者、预备行各样善事，不毁谤、不争竞、温柔待众人，活出和平的公共见证。"),
        (3, "the kindness of God", "我们从前也是无知、悖逆、受私欲奴役、可憎彼此相恨；救恩开始于神救主的恩慈和慈爱显明。"),
        (5, "not because of works", "他救我们不是因自己所行的义，乃照怜悯，藉重生的洗和圣灵的更新；圣灵丰富浇灌是藉耶稣基督。"),
        (7, "heirs according to hope", "我们因恩典称义，按永生盼望成为后嗣；这可信的话应被郑重讲明，使信徒专心行善。"),
        (9, "avoid foolish controversies", "要避开愚拙争辩、家谱、纷争和律法争竞，因这些无益虚妄。"),
        (10, "a divisive person", "分门结党的人经过一两次劝戒仍不改，就要拒绝；他已经背弃正道，自我定罪。"),
        (12, "devote themselves to good works", "保罗安排提多的行程，要求帮助同工供应旅费；信徒也当学习专心行善，补足急需，免得不结果子。"),
        (15, "grace be with you all", "全体同工问安，保罗也问候爱使徒团队的人；书信以恩典祝福众人收束。"),
    ],
}

VOCAB = {
    "elect": ("n./adj.", "蒙拣选的人；被选的"), "godliness": ("n.", "敬虔"), "eternal": ("adj.", "永恒的"), "promise": ("n.", "应许"),
    "elders": ("n.", "长老"), "overseer": ("n.", "监督"), "steward": ("n.", "管家"), "reproach": ("n.", "责备；指控"),
    "sound": ("adj.", "纯正的；健康的"), "doctrine": ("n.", "教训"), "rebuke": ("v.", "责备"), "pure": ("adj.", "纯洁的"),
    "self-controlled": ("adj.", "自守的"), "adorn": ("v.", "装饰；使增光"), "grace": ("n.", "恩典"), "appeared": ("v.", "显现"),
    "salvation": ("n.", "救恩"), "Savior": ("n.", "救主"), "redeem": ("v.", "救赎"), "possession": ("n.", "产业；所属"),
    "gentleness": ("n.", "温柔"), "kindness": ("n.", "恩慈"), "mercy": ("n.", "怜悯"), "regeneration": ("n.", "重生"),
    "renewal": ("n.", "更新"), "justify": ("v.", "称义"), "heirs": ("n.", "后嗣"), "controversies": ("n.", "争辩"),
    "divisive": ("adj.", "分门结党的"), "good works": ("n.", "善行"),
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
        return "修辞问句", "保罗用问句暴露无益的推论或强调所需的答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 引出比较或前提，so 给出相应结果；两边合起来才构成完整论证。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、假设或反例，注意其后的结果和劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明上一句的理由、神学根据或进一步解释。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把福音真理落实为教会秩序和敬虔生活。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "先否定错误的动力或道路，再以 but 指出真道所要求的行动。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标明反差或校正，需留意前后文的逻辑关系。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("declare") or " must " in lower:
        return "命令句", "祈使语气将神的恩典落实为教导、纪律与善行。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、内容、目的或结果；先找它回指的中心词。"
    return "主句与修饰成分", "先找主语和主要动词，再处理介词、并列和补语，读出保罗的牧养重点。"


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
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Titus"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Titus")
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
        print(f"Titus {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
