"""Create static ESV learning notes for 2 John, 3 John, Philemon, and Jude."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    "2 John": [
        (1, "the elder to the elect lady", "长老约翰写给“蒙拣选的夫人和她的儿女”，可能指一间教会及其成员；他按真理爱他们，所有认识真理的人也爱他们。"),
        (2, "truth that abides", "真理住在信徒里面，也必永远与他们同在；恩典、怜悯、平安从父和父子耶稣基督在真理与爱中临到。"),
        (4, "walking in the truth", "约翰因有些儿女照父的命令行在真理中大大欢喜，并重申不是新命令，而是从起初就有的彼此相爱。"),
        (6, "walk according to his commandments", "爱就是照神诫命而行；从起初所听见的命令是要在爱中行。"),
        (7, "many deceivers", "许多迷惑人者不承认耶稣基督成了肉身，已经进入世界；这种人是迷惑者和敌基督。"),
        (8, "watch yourselves", "要谨慎，免得失去已经劳苦所得，反要得着满足的赏赐；越过基督教训不常守的就没有神。"),
        (10, "do not receive him", "若有人不带这教训到来，不可接他进家或向他问安，因为问安者会在他的恶行上有分。"),
        (12, "face to face", "约翰虽有许多事要写，却盼望面对面交谈，使双方喜乐满足；以蒙拣选姊妹的儿女问安结束。"),
    ],
    "3 John": [
        (1, "beloved Gaius", "长老写给所爱、在真理中所爱的该犹，为他的灵魂兴盛、凡事兴盛并身体健壮祷告。"),
        (3, "walking in the truth", "弟兄来证明该犹忠于真理、行在真理中，约翰听见属灵儿女如此行便无比喜乐。"),
        (5, "faithful in service", "该犹忠心接待作客旅的弟兄，尤其陌生同工；他们在教会前见证他的爱。"),
        (6, "worthy of God", "应以合乎神的方式供给他们前行，因为他们为主名出外，不从外邦人取什么。"),
        (8, "fellow workers for the truth", "信徒接待这样的人，就与他们同工为真理效力。"),
        (9, "Diotrephes", "丢特腓好为首、不接待使徒，且以恶言妄论约翰，不仅自己不接待弟兄，也拦阻别人并把人赶出教会。"),
        (11, "imitate good", "不要效法恶，只要效法善；行善的属神，行恶的未曾见过神。"),
        (12, "Demetrius", "低米丢得众人和真理本身的见证，约翰也作见证；这为可靠同工提供正面榜样。"),
        (13, "peace to you", "约翰与二书相似，宁愿面对面交谈；朋友彼此问安，平安归给该犹。"),
    ],
    "Philemon": [
        (1, "a prisoner for Christ", "保罗和提摩太问候腓利门、亚腓亚、亚基布与在腓利门家里的教会；保罗以基督耶稣囚徒的身份开启代求。"),
        (4, "love and faith", "保罗常常感谢祷告，因为听见腓利门对主耶稣及众圣徒的爱与信心。"),
        (6, "sharing of your faith", "他祈求腓利门的信心相交发挥功用，使其充分明白在基督里一切美善；腓利门使众圣徒心得畅快。"),
        (8, "for love's sake", "保罗虽可奉基督权柄命令，宁可因爱请求；他以年老且为基督被囚的保罗身份代求。"),
        (10, "my child Onesimus", "阿尼西母在保罗捆锁中成为他的儿子；他从前对腓利门无益，如今对腓利门和保罗都有益。"),
        (12, "my very heart", "保罗把阿尼西母送回，仿佛送回自己的心；本想留他在自己身边替腓利门服事，却不愿未经主人同意。"),
        (15, "no longer as a slave", "阿尼西母暂时离开或许是为让腓利门永远得着他，不再只是奴仆，乃是亲爱的弟兄，在主里尤其如此。"),
        (17, "receive him as you would me", "若腓利门以保罗为同伴，就应接待阿尼西母如同接待保罗；若他亏负或欠债，保罗愿意承担。"),
        (20, "refresh my heart", "保罗盼望腓利门在主里使他得益处、使心畅快，并确信他会顺服、甚至超过所说的去行。"),
        (22, "prepare a guest room", "保罗也盼借众人的祷告获准到他们那里，故请预备住处；以同工问安和恩典结尾。"),
    ],
    "Jude": [
        (1, "called, beloved, and kept", "犹大是耶稣基督仆人、雅各弟兄，写给在父神里蒙爱、为耶稣基督保守、蒙召的人，愿怜悯平安慈爱多多加给他们。"),
        (3, "contend for the faith", "原想写共同救恩，现必须劝信徒为一次交付圣徒的真道竭力争辩，因为有人偷着进来，把神恩典变作放纵并否认独一主宰耶稣基督。"),
        (5, "examples of judgment", "主救以色列出埃及后又灭绝不信的人；不守本位的天使被永远锁链拘留，所多玛蛾摩拉因淫乱受永火刑罚。"),
        (8, "reject authority", "这些作梦的人污秽身体、轻慢主治、毁谤尊荣；米迦勒与魔鬼争辩尚且只说“主责备你”，假师却毁谤所不明白的。"),
        (11, "the way of Cain", "他们走该隐的路，为利奔巴兰的错谬，在可拉的背叛中灭亡；犹大用一连串图像描写其危险与空虚。"),
        (14, "the Lord comes", "以诺预言主带着千万圣者降临，要审判众人，定罪不敬虔者一切不敬虔行为和所说刚愎话。"),
        (16, "showing favoritism", "假师发怨言、随从私欲、口说夸大话、为利奉承人；读者应记念使徒早已预言末世必有好讥诮者。"),
        (20, "build yourselves up", "亲爱的信徒却要在至圣真道上造就自己，在圣灵里祷告，保守自己常在神爱中，仰望主耶稣基督的怜悯直到永生。"),
        (22, "have mercy", "对怀疑者要怜悯，对有些人要从火中抢出来，对另一些人要存惧怕怜悯，同时厌恶被情欲沾染的衣服。"),
        (24, "able to keep you", "颂赞归给那能保守人不失脚、叫人无瑕疵欢欢喜喜站在荣耀前的神；藉耶稣基督荣耀威严权能权柄直到万世。"),
    ],
}

VOCAB = {
    "elder": ("n.", "长老"), "truth": ("n.", "真理"), "love": ("n.", "爱"), "commandment": ("n.", "诫命"),
    "deceivers": ("n.", "迷惑人的人"), "antichrist": ("n.", "敌基督"), "doctrine": ("n.", "教训"), "reward": ("n.", "赏赐"),
    "faithful": ("adj.", "忠心的"), "hospitality": ("n.", "接待客旅"), "fellow": ("adj.", "同工的"), "authority": ("n.", "权柄"),
    "prisoner": ("n.", "囚徒"), "fellowship": ("n.", "相交；团契"), "appeal": ("v./n.", "请求；恳求"), "slave": ("n.", "奴仆"),
    "brother": ("n.", "弟兄"), "receive": ("v.", "接待；接纳"), "grace": ("n.", "恩典"), "called": ("adj.", "蒙召的"),
    "contend": ("v.", "竭力争辩；奋斗"), "faith": ("n.", "信仰；信心"), "ungodly": ("adj.", "不敬虔的"),
    "judgment": ("n.", "审判"), "authority": ("n.", "权柄"), "mercy": ("n.", "怜悯"), "Spirit": ("n.", "圣灵"),
    "keep": ("v.", "保守"), "glory": ("n.", "荣耀"),
}


def theme(book: str, verse: int) -> tuple[str, str]:
    units = THEMES[book]
    for index, (start, phrase, explanation) in enumerate(units):
        next_start = units[index + 1][0] if index + 1 < len(units) else None
        if verse >= start and (next_start is None or verse < next_start):
            return phrase, explanation
    raise AssertionError((book, verse))


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "问句用来挑战错误态度或强化书信的结论，须由上下文把握预期答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出关系或前提，so 导出相应结果；两部分要合起来理解。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、假设或实际检验，注意其后的结果和劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明上一句的理由、证据或更深解释。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把福音真理推进为接待、分辨或坚守的行动。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定一种错误道路，再以 but 指出真正应有的回应。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出反差和校正；请同时观察前后句的关系。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("keep ") or " must " in lower:
        return "命令句", "祈使语气把真理落实为彼此相爱、正确接待和保守信仰。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充身份、内容、目的或结果；先找它所修饰的对象。"
    return "主句与修饰成分", "先找主要动词和主语，再整理并列、介词和补语，跟随短书信紧凑的论证。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 和本书的写作目的理解。"}]


def main() -> None:
    for book in THEMES:
        output = ROOT / "backend" / "data" / "BibleLang" / "en" / book
        output.mkdir(parents=True, exist_ok=True)
        source = filter_chapter(load_verses("esv", book), 1)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(book, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / "1.json", payload)
        print(f"{book}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
