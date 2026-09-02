"""Create static ESV learning notes for every verse of 1 Peter."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "elect exiles", "彼得写给分散在各地的寄居者；他们按父神预知蒙拣选，藉圣灵成圣，得以顺服耶稣基督并蒙他血洒净。"),
        (3, "a living hope", "神因大怜悯藉耶稣基督从死人复活，重生信徒进入活泼盼望和天上不朽坏、不玷污、不衰残的基业。"),
        (6, "tested genuineness", "信徒虽暂时在百般试炼中忧愁，却可欢喜，因为信心比火炼仍会坏的金子更宝贵，要在主显现时得称赞荣耀尊贵。"),
        (8, "joy in believing", "他们虽未见过耶稣却爱他，如今不见仍信，便有说不出来、满有荣光的大喜乐，得着信心的果效——灵魂的救恩。"),
        (10, "the prophets searched", "旧约先知详细寻求考察所预言的恩典，基督的灵预先证明基督受苦和后来的荣耀；这些事如今藉圣灵传福音者显明。"),
        (13, "be holy", "既然救恩如此宏大，信徒应约束心思、谨慎自守，专心盼望主显现的恩典，不效法从前无知时的私欲，因召他们的主是圣洁的。"),
        (17, "conduct yourselves with fear", "既称那按各人行为审判且不偏待人的为父，就当在寄居日子敬畏度日，知道自己不是用金银乃是基督宝血救赎。"),
        (20, "foreknown before the foundation", "基督在创世以前预先被神知道，末世为信徒显现；藉他信神的人，神使他复活得荣耀，故信心盼望都在神。"),
        (22, "love one another earnestly", "既因顺从真理洁净心灵以致真诚爱弟兄，就要从清洁的心彼此切实相爱，因为重生是藉永存的神道。"),
        (24, "the word remains", "凡有血气的尽都如草、荣美如草花，草必枯干花必凋谢，惟有主的道永远长存；这道就是所传给他们的福音。"),
    ],
    2: [
        (1, "long for pure spiritual milk", "既已重生，就当除去恶毒、诡诈、假善、嫉妒、毁谤，像初生婴孩爱慕纯净灵奶，使人靠此渐长得救。"),
        (4, "a living stone", "基督是被人弃绝、在神却拣选宝贵的活石；信徒到他面前也被建造成灵宫、圣洁祭司，献上神藉基督悦纳的灵祭。"),
        (6, "chosen and precious", "经上称基督为锡安所安放、宝贵的房角石，信靠他的人不至羞愧；不信者却因不顺从在这石头上跌倒。"),
        (9, "a people for his possession", "教会是被拣选的族类、有君尊的祭司、圣洁的国度、属神的子民，为宣扬召他们出黑暗入奇妙光明者的美德。"),
        (11, "sojourners and exiles", "作为寄居者要禁戒与灵魂争战的肉体私欲，在外邦人中有好品行，使诬赖者因看见善行在神眷顾日归荣耀给神。"),
        (13, "be subject for the Lord's sake", "为主缘故要顺服人的一切制度，包括君王和官长；政府的职能是惩恶赏善，行善能堵住无知人的糊涂话。"),
        (16, "servants of God", "信徒是自由人，却不可把自由当作恶的遮盖，而要作为神的仆人：尊敬众人、爱弟兄、敬畏神、尊敬君王。"),
        (18, "Christ's example in suffering", "仆人即使遭遇不公平的苦待也要存敬畏神的心忍耐；为行善受苦能忍耐在神看是可喜爱的。"),
        (21, "he suffered for you", "基督为信徒受苦留下榜样，叫人跟随他的脚踪；他无罪不诡诈，受骂不还口，乃把自己交托给按公义审判的主。"),
        (24, "he bore our sins", "基督亲身担当我们的罪在木头上，使我们既然向罪死，就得以向义活；我们因他的伤痕得医治，从前如迷羊如今归到灵魂的牧人监督。"),
    ],
    3: [
        (1, "conduct may win", "妻子的敬虔顺服和清洁敬畏的品行，能在没有言语时见证给不信的丈夫；真正的妆饰是里面温柔安静的心。"),
        (5, "hope in God", "旧时仰望神的圣洁妇人以此妆饰自己、顺服丈夫；撒拉称亚伯拉罕为主，行善不因惊吓害怕的姊妹是她的女儿。"),
        (7, "honor the woman", "丈夫要按知识与妻子同住，尊敬她为较软弱的器皿，也因同作生命之恩的后嗣，免得祷告受阻。"),
        (8, "seek peace", "众人要同心、体恤、弟兄相爱、存怜悯谦卑的心，不以恶报恶、以辱骂还辱骂，倒要祝福以承受福气。"),
        (10, "turn away from evil", "诗篇引文呼吁要爱生命见好日，就禁戒舌头不出恶言、嘴唇不说诡诈，离恶行善，寻求追赶和平。"),
        (12, "the eyes of the Lord", "主的眼看顾义人，耳听他们祈祷；主的脸却敌挡作恶的人。这为受苦中行善提供神学根基。"),
        (13, "suffer for righteousness", "若热心行善通常无人加害；即便为义受苦也是有福，不必怕人的威吓，心里要尊基督为主。"),
        (15, "a reason for the hope", "要常作准备，以温柔敬畏回答人所问盼望的缘由，并保守无亏良心，使毁谤者因善行羞愧。"),
        (17, "Christ also suffered", "若是神旨意，因行善受苦胜过因行恶受苦；基督一次为罪受苦，就是义的代替不义的，为要领我们到神面前。"),
        (18, "made alive in the spirit", "本段涉及基督宣讲、挪亚时代和洗礼的难解经文；核心是基督胜过死亡、如今在神右边，洗礼表明藉复活向神求无亏良心。"),
    ],
    4: [
        (1, "arm yourselves", "基督既在肉身受苦，信徒也应以同样心志武装；在肉身受苦者已断绝与罪的旧主权，余下光阴当遵神旨意。"),
        (3, "enough time", "过去随从外邦人意志，活在放纵、情欲、醉酒、荒宴和拜偶像中已够了；他们会因信徒不再同流而毁谤。"),
        (5, "ready to judge", "所有人都要向那预备审判活人死人的主交账；福音也传给已死的人，使他们在肉身按人受审判，却在灵里按神活着。"),
        (7, "the end is at hand", "万物的结局近了，所以要谨慎自守、警醒祷告；首先要切实相爱，因为爱能遮掩许多罪。"),
        (9, "stewards of God's grace", "要互相款待不发怨言，按各人所得恩赐彼此服事，作神百般恩典的好管家；说话与服事都靠神所赐力量。"),
        (11, "God may be glorified", "恩赐使用的目标是藉耶稣基督荣耀神；荣耀权能都归给他直到永永远远。"),
        (12, "the fiery trial", "火炼的试验临到不可惊奇，倒要因有分于基督苦难欢喜，使基督荣耀显现时也可欢喜快乐。"),
        (14, "the Spirit of glory", "若为基督名受辱骂便有福，因为荣耀的灵、神的灵住在你们身上；不可因犯罪受苦，却不可因作基督徒羞耻。"),
        (17, "judgment begins", "审判从神的家起首；若义人仅仅得救，不敬虔犯罪的人将如何？因此受苦者要按善行把灵魂交托信实的造化之主。"),
    ],
    5: [
        (1, "shepherd the flock", "彼得作为同作长老、基督受苦见证和将来荣耀有分者，劝长老牧养神托付的群羊，不出于勉强或贪财，乃甘心作榜样。"),
        (4, "the chief Shepherd", "牧长显现时，忠心牧者必得不衰残的荣耀冠冕。"),
        (5, "clothe yourselves with humility", "年轻人要顺服长老，众人彼此以谦卑束腰；神阻挡骄傲人，赐恩给谦卑人。"),
        (6, "cast all your anxieties", "要在神大能手下自卑，时候到了他必叫人升高；所有忧虑可卸给他，因为他顾念你们。"),
        (8, "your adversary the devil", "要谨守警醒，魔鬼如吼叫狮子遍地游行寻找可吞吃的人；要用坚固信心抵挡，知道普世弟兄也经历同样苦难。"),
        (10, "restore, confirm, strengthen", "赐诸般恩典的神在信徒暂受苦难后，亲自成全、坚固、赐力量、立定他们；权能归他直到永远。"),
        (12, "stand firm", "彼得藉西拉简略写信，见证这是真神恩典并劝他们站立得稳；巴比伦的教会和马可问安。"),
        (14, "peace to all", "以爱心亲嘴彼此问安，平安归给一切在基督里的人。"),
    ],
}

VOCAB = {
    "elect": ("n./adj.", "蒙拣选的人；被选的"), "exiles": ("n.", "寄居者；流散者"), "sanctification": ("n.", "成圣"),
    "hope": ("n.", "盼望"), "inheritance": ("n.", "基业"), "trials": ("n.", "试炼"), "revealed": ("v.", "显明；启示"),
    "holy": ("adj.", "圣洁的"), "redeemed": ("v.", "被救赎的"), "precious": ("adj.", "宝贵的"),
    "word": ("n.", "道；话语"), "spiritual": ("adj.", "属灵的"), "stone": ("n.", "石头"),
    "priesthood": ("n.", "祭司职分"), "sojourners": ("n.", "寄居者"), "submission": ("n.", "顺服"),
    "suffering": ("n.", "苦难"), "example": ("n.", "榜样"), "sins": ("n.", "罪"), "conduct": ("n.", "品行"),
    "honor": ("n./v.", "尊敬；尊荣"), "peace": ("n.", "和平；平安"), "conscience": ("n.", "良心"),
    "baptism": ("n.", "洗礼"), "judgment": ("n.", "审判"), "hospitality": ("n.", "接待"), "stewards": ("n.", "管家"),
    "fiery": ("adj.", "火炼般的"), "glory": ("n.", "荣耀"), "shepherd": ("v.", "牧养"), "humility": ("n.", "谦卑"),
    "anxieties": ("n.", "忧虑"), "adversary": ("n.", "仇敌"), "resist": ("v.", "抵挡"), "grace": ("n.", "恩典"),
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
        return "修辞问句", "彼得以问句建立受苦中的盼望或挑战错误判断，答案由上下文展开。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出比较或前提，so 推出对应结论；应将两边合起来读。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、可能性或反例，注意它所导向的安慰、警告或命令。"
    if lower.startswith("for "):
        return "For 理由连接", "For 为前一句提供理由或依据，使论证继续向前。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把救恩身份推向寄居生活的实际回应。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "先否定旧生命或错误回应，再以 but 指明合乎基督的道路。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出重要反差或校正，需要看清它前后的关系。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("be ") or " must " in lower:
        return "命令句", "祈使语气把活泼盼望落实为圣洁、善行、谦卑和警醒。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充身份、目的和结果；先找所修饰的中心对象。"
    return "主句与修饰成分", "先找主要动词与主语，再分析并列、介词短语和补语，跟随彼得对寄居者的劝勉。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 与本段寄居者主题理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 Peter"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 Peter")
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
        print(f"1 Peter {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
