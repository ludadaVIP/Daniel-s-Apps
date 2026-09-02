"""Create static ESV learning notes for every verse of 2 Corinthians 8–13."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    8: [
        (1, "the grace given in Macedonia", "马其顿教会在极大患难和贫穷中仍满有喜乐，按力量甚至过了力量地甘心捐助，显明奉献首先是神的恩典。"),
        (5, "gave themselves first to the Lord", "他们超越保罗期待：先把自己献给主，再按神旨意献给使徒和圣徒的需要。"),
        (7, "excel in this act of grace", "哥林多人在信心、言语、知识和爱上丰富，也应在慷慨奉献的恩典上长进；保罗借此检验爱的真实。"),
        (9, "though he was rich", "基督本富足却为我们成为贫穷，使我们因他的贫穷成为富足；福音是慷慨的根基，不是操控捐献的工具。"),
        (10, "complete what you began", "一年前已经愿意并开始的事，如今当按所有的完成；神看重甘心，不按人所没有的要求。"),
        (13, "a fair balance", "捐助的目标不是叫一方受累、另一方轻松，而是在资源中有均平，正如旷野吗哪的供应。"),
        (16, "Titus's earnest care", "神把与保罗同样的热心放在提多心里；他甘心前往哥林多，也有弟兄同行。"),
        (19, "taking care to do what is honorable", "教会选派同工经管捐项，为主得荣耀也在人面前显为诚实；财务事工需要公开可信的安排。"),
        (22, "tested and earnest", "另一位多次受验证的弟兄因对哥林多人的信心而格外热心；同工是众教会的使者、基督的荣耀。"),
        (24, "proof of your love", "哥林多人应在众教会面前显出爱和保罗对他们夸奖的真实根据。"),
    ],
    9: [
        (1, "your readiness", "保罗知道他们愿意帮助耶路撒冷圣徒，也曾以亚该亚的预备激励马其顿人；他写信是要使他们的热心成为实际行动。"),
        (3, "a willing gift", "他先派弟兄去预备捐项，免得夸奖落空，也免得这奉献看似出于勉强或临时压力。"),
        (6, "sow bountifully", "撒种比喻说明慷慨与收成的关系；各人应按心里所定的给，不作难、不勉强，因为神爱乐捐的人。"),
        (8, "all grace abound", "神能使各样恩典充足，使人常常有余可以多行善事；慷慨不是靠匮乏焦虑而是靠神供应。"),
        (10, "supply and multiply", "赐种给撒种者、赐粮给人吃的神会供应并加增慷慨的资源，使义的果子增长。"),
        (12, "thanksgiving to God", "这服事补足圣徒缺乏，又使多人向神感恩；受助者会因施者顺服福音并慷慨分享而荣耀神。"),
        (14, "the surpassing grace", "耶路撒冷信徒为哥林多人祈祷并想念他们，因为他们看见神格外的恩典。"),
        (15, "his inexpressible gift", "整段奉献教导以对神说感谢为高潮：基督和福音是无法言尽的恩赐。"),
    ],
    10: [
        (1, "meekness and gentleness of Christ", "保罗以基督的温柔谦和恳求，回应有人说他见面软弱、写信强硬的批评。"),
        (3, "weapons of warfare", "使徒虽在肉身中行事，却不按肉体争战；属神的兵器有能力攻破坚固营垒，夺回心意使之顺服基督。"),
        (7, "belongs to Christ", "看事情不可只看表面；若有人自信属基督，也应承认保罗同样属基督并拥有为造就教会的权柄。"),
        (10, "letters are weighty", "保罗承认外界的批评，却说明他书信所说与到场所行一致；他不敢与自我推荐者比较。"),
        (12, "measure themselves", "自我比较、自我推荐是无知的标准；使徒只在神所量给的使命范围内夸口，其中包括哥林多。"),
        (15, "the field God assigned", "他盼他们信心增长，使自己的事工范围扩展到更远处，却不越界夸别人的劳苦。"),
        (17, "boast in the Lord", "真正蒙称许的不是自我推荐的人，而是主所推荐的人。"),
    ],
    11: [
        (1, "a divine jealousy", "保罗以神圣的嫉妒守护教会，如父亲把童女许配给一位丈夫，要把他们纯洁地献给基督。"),
        (3, "another Jesus", "蛇怎样欺骗夏娃，哥林多人也可能离开对基督单纯纯洁的委身，接受另一个耶稣、灵或福音。"),
        (5, "not inferior", "保罗虽不以言辞炫耀，却在知识和一切事上显明自己不低于那些“超级使徒”。"),
        (7, "free of charge", "他在哥林多免费传福音，不是贬低他们，而是为高举他们；其他教会供给他，使他不成为哥林多人的负担。"),
        (10, "no one will stop", "保罗坚持不取哥林多金钱，为要除去假使徒藉金钱自夸和比较的机会；他这样做是因爱。"),
        (13, "false apostles", "假使徒是诡诈工人，装作基督使徒；撒但也装作光明天使，所以其差役伪装义的仆人并不奇怪，结局按行为而定。"),
        (16, "a little foolishness", "保罗勉强以“愚妄”的方式夸口，是为回应他们容忍自称高明者的讽刺处境。"),
        (20, "you bear it", "他们容忍人奴役、吞吃、占便宜、自高和打脸，保罗以尖锐反讽揭露他们判断的颠倒。"),
        (21, "boasting in weakness", "保罗开始列出自己真实的“资格”：犹太背景、事工劳苦、囚禁、鞭打、死亡危险，显明十字架式使徒职分。"),
        (24, "danger and hardship", "他经历犹太鞭打、罗马棍打、石头、船难、旅途的各样危险，以及饥渴、寒冷、赤身。"),
        (28, "anxiety for all the churches", "在外在苦难之外，保罗每日为众教会挂心；谁软弱、跌倒，他并非无动于衷。"),
        (30, "boast of the things", "若必须夸口，保罗要夸自己的软弱；他以大马士革逃脱的羞辱经历结束这段反世俗的夸口。"),
    ],
    12: [
        (1, "visions and revelations", "保罗不得不继续回应夸口文化，却承认异象本身不能带来益处；他讲一位十四年前被提到三层天的人。"),
        (5, "I will not boast", "对于那人可夸异象，对于自己保罗只夸软弱，避免人按所见所闻过高估他。"),
        (7, "a thorn was given", "为免因启示过大而自高，保罗得着肉体的刺、撒但的差役攻击他，使他保持谦卑。"),
        (8, "my grace is sufficient", "他三次求主挪去刺，主却回答恩典够用，能力在软弱上得以完全；所以他乐意夸软弱。"),
        (10, "when I am weak", "为基督缘故，他以软弱、凌辱、急难、逼迫、困苦为可喜乐的，因为软弱时正显出基督能力。"),
        (11, "signs of a true apostle", "哥林多人本应为保罗辩护；他虽算不得什么，却在忍耐、神迹、奇事和异能中显出真使徒记号。"),
        (13, "not a burden", "唯一“亏待”是保罗没有成为他们负担；他用讽刺请求原谅，重申不求他们的钱，只求他们自己。"),
        (15, "spend and be spent", "父母为儿女积蓄而非儿女为父母；保罗甘愿为他们耗尽自己，即使他们爱他更少。"),
        (16, "crafty and deceitful", "他直接反驳说自己狡诈取利的控告：提多和同工从未占他们便宜，大家按同一灵、同一脚踪行。"),
        (19, "for your upbuilding", "保罗的一切辩白都在神面前、在基督里说，为的是爱人者的造就；他担心来时发现他们仍有纷争和不悔改的污秽。"),
    ],
    13: [
        (1, "every charge established", "第三次访问将按两三见证人确立证据；保罗预先警告持续犯罪者，他再来必不宽容。"),
        (3, "Christ speaking in me", "有人求基督藉保罗说话的凭据；基督向他们不是软弱，乃在他们里面有能力。"),
        (5, "examine yourselves", "不要只检验使徒，先省察自己是否在信仰中；基督在他们里面，除非他们经不起检验。"),
        (7, "do no wrong", "保罗祷告他们不作恶，不是为了让自己显为通过检验，而是让他们行善，即使使徒看似软弱。"),
        (8, "for the truth", "使徒不能敌挡真理，只能为真理效力；他们软弱而哥林多人刚强，是保罗所喜乐并祈求的。"),
        (10, "build up and not tear down", "保罗远距离写严厉话，是为到场时不必按主所赐权柄严厉处理；权柄目的在造就而非拆毁。"),
        (11, "aim for restoration", "结语呼吁喜乐、追求完全、彼此劝慰、同心和平；爱与和平的神必与他们同在。"),
        (12, "the grace ... love ... fellowship", "圣洁问安表达团契；三一式祝福以主耶稣的恩典、神的爱和圣灵的相交结束全书。"),
    ],
}

VOCAB = {
    "grace": ("n.", "恩典"), "generosity": ("n.", "慷慨"), "gift": ("n.", "恩赐；礼物"), "eager": ("adj.", "热心的"),
    "honorable": ("adj.", "尊荣的；诚实可敬的"), "sow": ("v.", "撒种"), "bountifully": ("adv.", "丰丰富富地"),
    "cheerful": ("adj.", "乐意的"), "thanksgiving": ("n.", "感恩"), "weapons": ("n.", "兵器"),
    "warfare": ("n.", "争战"), "obedience": ("n.", "顺服"), "authority": ("n.", "权柄"),
    "boast": ("v.", "夸口"), "jealousy": ("n.", "嫉妒；热切守护"), "gospel": ("n.", "福音"),
    "false": ("adj.", "假的；虚假的"), "apostles": ("n.", "使徒"), "deceitful": ("adj.", "诡诈的"),
    "weakness": ("n.", "软弱"), "visions": ("n.", "异象"), "thorn": ("n.", "刺"),
    "sufficient": ("adj.", "够用的"), "upbuilding": ("n.", "造就"), "examine": ("v.", "省察；检验"),
    "restoration": ("n.", "恢复；成全"), "fellowship": ("n.", "相交；团契"),
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
        return "修辞问句", "保罗用问题揭露错误的判断、提出挑战，或引导读者进入段落中的答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出比较或前提，so 推出相应结论；应把两部分连在一起读。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、假设或反例；留意其结果如何推进保罗的劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 解释前文的理由或根据，标出论证的下一步。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 将前面的真理转为结论、计划或具体回应。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定一种错误道路，再以 but 强调真正合乎福音的行动或事实。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出反差、校正或例外；阅读时须留意其前后的逻辑。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气要求实际回应；保罗的管教与劝勉目的始终是教会得造就。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充人物、事物或行动的身份与结果；先找它修饰的中心词。"
    return "主句与修饰成分", "先找主语和主要动词，再整理介词短语、并列和补语，跟随保罗的辩明和劝勉。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合 ESV 和本段的论证理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "2 Corinthians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "2 Corinthians")
    for chapter in range(8, 14):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / f"{chapter}.json", payload)
        print(f"2 Corinthians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
