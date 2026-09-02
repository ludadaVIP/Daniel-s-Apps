"""Write static, verse-level Bible and Eng notes for Romans 12–16 (ESV)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


NOTES = {
    12: [
        ("living sacrifice", "因此连接 1–11 章的神怜悯：信徒以全人持续献给神，这才是合宜的敬拜。"),
        ("transformed by the renewal", "不要随从现今世代的模式，而要让心意更新带来生命形塑，从而辨明神善良的旨意。"),
        ("sober judgment", "恩典排除自高；每个人应按神所分给的信心，以清醒、适度的眼光看自己。"),
        ("one body", "身体有许多肢体却同属一个身体，说明教会里的差异不是竞争，而是彼此需要。"),
        ("gifts that differ", "恩赐来自恩典并且各不相同；保罗呼吁信徒忠心运用所得的恩赐。"),
        ("in proportion to our faith", "说预言者应按所领受的信心忠实发言，不把个人意见伪装成神的话。"),
        ("the one who serves", "服事、教导等普通却必要的职分应专注实行，显示恩赐不是地位而是责任。"),
        ("with generosity", "劝勉、施舍、带领、怜悯都有相应品格：慷慨、殷勤和喜乐，使事奉真实而非表演。"),
        ("genuine", "爱不可虚假；真爱既厌恶恶，也紧紧持守善，不能只停留在温柔感觉。"),
        ("brotherly affection", "信徒要以家人般的爱彼此相待，并主动把尊荣让给别人。"),
        ("fervent in spirit", "在殷勤中拒绝懒惰，以火热的心服事主；热心的对象首先是主。"),
        ("patient in tribulation", "盼望带来喜乐，患难要求忍耐，祷告使信徒持续转向神。"),
        ("contribute to the needs", "对圣徒的实际需要要慷慨分享，并把接待陌生人当作经常操练。"),
        ("Bless those", "面对逼迫，基督徒的回应不是咒诅而是祝福，反映神向仇敌施恩的性情。"),
        ("weep with those", "团契不是抽象礼貌；要真实进入他人的喜乐和眼泪。"),
        ("live in harmony", "合一要求谦卑：不志向高位，愿意与卑微者同行，也不自以为聪明。"),
        ("Repay no one evil", "不要以恶报恶；在众人面前努力行善，使见证经得起公开检视。"),
        ("live peaceably", "尽力与众人和睦，但“若是能行”承认和平并不总由一方单独决定。"),
        ("leave it to the wrath", "不要自行报复，把最终审判交给神；引用申命记说明报应属于主。"),
        ("overcome evil with good", "箴言的图像教导以实际善待仇敌，把报复的循环交给神来处理。"),
        ("with good", "本段最后的命令不是消极忍耐，而是主动用善战胜恶。"),
    ],
    13: [
        ("subject to governing authorities", "信徒应顺服掌权者，因为一切合法权柄最终在神许可的秩序之下。"),
        ("resists what God", "抗拒正当权柄就是抵挡神所设立的秩序，并可能招致相应的审判。"),
        ("not a terror to good conduct", "通常而言，政府的职能是抑制恶、鼓励善；保罗据此劝人行善而不必惧怕。"),
        ("God's servant", "掌权者被称为神的仆人，执行公共秩序和惩恶的职责；这不等于其每一行为都无误。"),
        ("for the sake of conscience", "顺服不只为避免刑罚，也出于良心对神秩序的回应。"),
        ("pay taxes", "纳税是承认公共服务和权柄职责的一部分；保罗把它置于对神的顺服中。"),
        ("pay to all", "税、贡、敬畏、尊荣各归应得者；基督徒的公共伦理包含诚实履行责任。"),
        ("owe no one anything", "不要拖欠当尽的债；唯有爱的债永远持续，因为爱人是不断的呼召。"),
        ("love your neighbor", "十诫中关于邻舍的禁令，被总结为爱邻舍如同自己。"),
        ("does no wrong", "爱不伤害邻舍，因此爱不是废除律法，而是律法在关系中的成全。"),
        ("you know the time", "保罗用末世的清醒催促信徒：救恩完全显现的日子比初信时更近。"),
        ("night is far gone", "黑夜和白昼比喻旧世代与将临的日子；信徒当脱去黑暗行为，穿上光明军装。"),
        ("walk properly", "白昼的生活拒绝放纵、醉酒、性混乱、纷争和嫉妒，属于公开可见的正直。"),
        ("put on the Lord", "“穿上”基督表示以基督为生命的新身份，不为肉体预先安排满足私欲的机会。"),
    ],
    14: [
        ("weak in faith", "要接纳信心较软弱的人，却不要把团契变成争论可争议意见的场所。"),
        ("eats only vegetables", "保罗用饮食差异举例；“强”“弱”关乎良心与信心的把握，不是人的价值高低。"),
        ("God has welcomed him", "吃与不吃的人不可彼此轻看或论断，因为决定性的事实是神已经接纳对方。"),
        ("his own master", "信徒最终向主负责，不是向彼此的偏好负责；主有能力使属他的人站立。"),
        ("fully convinced", "对日子的不同看法可在主里存在，但每个人应在自己心里确实，出于良心行事。"),
        ("in honor of the Lord", "守日、吃或不吃都应以感谢神、尊主为目的，而不是用来建立优越感。"),
        ("none of us lives", "基督徒的生命不是私有财产；无论活着或死去都属于主。"),
        ("we are the Lord's", "属主的身份跨越生死，是伦理和彼此接纳的根基。"),
        ("Lord of both", "基督死而复活的目的之一，是在死人与活人之上作主。"),
        ("why do you pass judgment", "既然所有人都要站在神的审判台前，信徒不该僭越终极审判者的位置，轻看或定罪弟兄姊妹。"),
        ("every knee", "以赛亚的宣告表明终有一天每个人都承认神的主权并向他交账。"),
        ("give an account", "共同的末日问责改变现在的相处方式：不再彼此定罪。"),
        ("never put a stumbling block", "应当转而判断自己的行为会否使弟兄跌倒，或令其良心受伤。"),
        ("nothing is unclean", "在主耶稣里食物本身不是污秽；但对认定它不洁而违背良心的人，它就成为污秽。"),
        ("walking in love", "若食物使弟兄忧愁，就不再按爱行事；不可为可吃之物毁坏基督为之死的人。"),
        ("not be spoken of as evil", "即使拥有自由，也要谨慎使用，免得善的自由因无爱而被人毁谤。"),
        ("righteousness and peace", "神的国核心不是饮食规条，而是圣灵里的义、平安和喜乐。"),
        ("approved by men", "这样服事基督的人蒙神悦纳，也会在合宜处得到人的认可。"),
        ("pursue what makes for peace", "信徒应积极追求建立和睦与造就彼此的事，而非只捍卫个人权利。"),
        ("do not destroy", "不可为食物拆毁神的工作；食物本是洁净，却会因使人跌倒而成为恶。"),
        ("never eat meat", "爱可能自愿限制自由；宁可不吃喝，也不愿成为弟兄跌倒的原因。"),
        ("keep between yourself and God", "自由的确信可在神面前持守；蒙福的是不因自己认可的事而自我定罪的人。"),
        ("does not proceed from faith", "怀疑而吃的人因违背良心被定罪；不出于信心的行为就是罪。"),
    ],
    15: [
        ("bear with the failings", "刚强者应担当软弱者的不足，不以取悦自己为目标；自由服务于爱。"),
        ("build him up", "取悦邻舍不是讨好，而是在真正益处上造就他。"),
        ("Christ did not please himself", "基督是榜样：诗篇的引文显示他担当辱骂，舍己服事神的旨意。"),
        ("written for our instruction", "旧约为今日信徒写下，使我们借忍耐和安慰持守盼望。"),
        ("live in such harmony", "忍耐和安慰的神赐合一的心，使教会按基督耶稣彼此同心。"),
        ("with one voice", "合一最终的方向是共同荣耀神——主耶稣基督的父。"),
        ("welcome one another", "彼此接纳的尺度是基督怎样接纳我们，目标同样是荣耀神。"),
        ("servant to the circumcised", "基督先为受割礼者服事，显明神对列祖应许的信实。"),
        ("Gentiles might glorify", "外邦人蒙怜悯也为荣耀神；紧随的诗篇引文预示列国将与神的百姓同声赞美他的名。"),
        ("Rejoice, O Gentiles", "摩西之歌邀请万民与神的子民同乐，扩大救恩赞美的范围。"),
        ("Praise the Lord", "诗篇呼召所有列国赞美主，证明普世敬拜并非新约的附加主题。"),
        ("root of Jesse", "以赛亚预言大卫家的弥赛亚将成为万邦盼望的旗帜。"),
        ("God of hope", "保罗祈求盼望的神使信徒充满喜乐和平安，使他们藉圣灵能力大有盼望。"),
        ("full of goodness", "保罗肯定罗马信徒已有善良、知识和彼此劝戒的能力，不是将他们视为毫无根基。"),
        ("remind you", "他仍大胆提醒，因为使徒职分是神所赐的恩典，为要坚固教会。"),
        ("minister ... to the Gentiles", "保罗以祭司语言描述福音使命：外邦人如献给神、被圣灵分别为圣的供物。"),
        ("in Christ Jesus", "保罗若有夸口，只能在基督耶稣里，指向神已经完成的事。"),
        ("what Christ has accomplished", "他拒绝谈论个人功劳，只述说基督藉他、以言语和行为使外邦人顺服的工作。"),
        ("fully proclaimed", "从耶路撒冷直到以利哩古，保罗广泛完成传讲基督福音的先锋使命。"),
        ("where Christ was already named", "他的志向是在未闻基督之名的地方传福音，不在别人的根基上建造。"),
        ("those who have never", "以赛亚的引文支撑这项开拓使命：未曾听闻的人要看见并明白。"),
        ("hindered from coming", "保罗多次未能到罗马，是因他优先在尚未听福音的地区开拓。"),
        ("no longer any room", "如今东方区域的开拓阶段告一段落，保罗渴望在往西班牙途中探访罗马。"),
        ("journey to Spain", "罗马教会将成为他西行时的团契伙伴；保罗盼望先得他们交通的满足。"),
        ("going to Jerusalem", "计划西行之前，保罗先带着外邦教会的捐项前往耶路撒冷服事圣徒。"),
        ("pleased to make", "马其顿和亚该亚乐意捐助耶路撒冷贫穷圣徒，显示跨地域教会的实际合一。"),
        ("they were pleased", "外邦人既分享犹太人属灵的福分，就有责任用物质帮助他们；恩典形成感恩的互惠。"),
        ("sealed to them", "保罗完成交托捐项后，计划经罗马前往西班牙，显示宣教与怜悯事工相连。"),
        ("fullness of the blessing", "他确信到罗马时会带着基督丰盛的祝福，而非只完成一次私人访问。"),
        ("strive together", "保罗请求他们在祷告里与他一同争战，表明宣教需要全教会代祷参与。"),
        ("delivered from the unbelievers", "他求从犹太不信者手中得救，也求耶路撒冷圣徒悦纳这项外邦人的服事。"),
        ("by God's will", "最终旅行计划仍受神旨意约束；保罗盼望到他们那里得安息和更新。"),
        ("God of peace", "本章以平安之神的同在祝福众人；合一与宣教皆根植于他的平安。"),
    ],
    16: [
        ("our sister Phoebe", "腓比是坚革哩教会的女执事/服事者，保罗郑重推荐她给罗马教会。"),
        ("worthy of the saints", "接待腓比要合乎圣徒的方式，并在她所需的事上帮助她；她自己曾帮助许多人和保罗。"),
        ("fellow workers", "百基拉和亚居拉与保罗同工，且曾冒生命危险保护他，外邦教会也为他们感谢。"),
        ("church in their house", "家庭可以成为教会聚会的地方；问安也包括以拜尼土这位在亚细亚最早信主的人。"),
        ("worked hard for you", "马利亚的显著记号是为罗马信徒劳苦，保罗重视看似不显眼的辛勤服事。"),
        ("fellow prisoners", "安多尼古和犹尼亚是保罗的亲属与同囚者，在使徒中有名望，并且比他更早归主。"),
        ("beloved in the Lord", "暗伯利是“在主里所亲爱的”，问安的措辞把深厚关系放在与主联合的框架内。"),
        ("fellow worker", "又巴奴是基督里的同工，士大古则是保罗所爱的人，显示不同形式的同工关系。"),
        ("approved in Christ", "亚比利被称为在基督里经过考验、蒙认可的人；信仰品格经得起试炼。"),
        ("those in the Lord", "亚利多布家里的人未必全是亲属，却有属于主的信徒，保罗逐一承认他们。"),
        ("kinsman", "希罗天是保罗的同族；拿其数家里“在主里的人”说明福音已进入复杂家户网络。"),
        ("workers in the Lord", "土非拿、土富撒和彼息都是在主里劳苦的姊妹；保罗特别纪念她们的辛劳。"),
        ("chosen in the Lord", "鲁孚在主里蒙拣选；其母对保罗如同母亲，显出教会家庭般的照顾。"),
        ("the brothers", "这组名字与他们同在的弟兄，提醒我们罗马教会由多个家庭和聚会群体组成。"),
        ("the saints", "另一组问安名单包括非罗罗古等人与他们同在的众圣徒，显示广泛而具体的团契网络。"),
        ("holy kiss", "圣洁的亲嘴是当时文化中表达家人般和平与接纳的方式，不是空洞礼仪。"),
        ("watch out", "保罗转而警告：要留意制造分裂、使人跌倒且违背所学教训的人，并远离他们。"),
        ("serve ... their own appetites", "这些人并不服事基督，而是服事自己的欲望；甜言蜜语会欺骗单纯的人。"),
        ("wise as to what is good", "罗马信徒顺服的名声令人喜乐；保罗希望他们在善上有智慧，在恶上保持纯全。"),
        ("crush Satan", "平安的神将很快把撒但践踏在信徒脚下，呼应蛇被胜过的应许；本节随即以主耶稣的恩典祝福教会。"),
        ("my fellow worker", "提摩太与保罗同工；路求、耶孙和所西巴德作为同族也一同问安。"),
        ("I Tertius", "代笔者德丢亲自加上一句问安，显示书信的写作有具体真实的同工过程。"),
        ("host to me", "该犹接待保罗和全教会；以拉都为城内财主，括土为弟兄，福音连结不同社会位置的人。"),
        ("now disclosed", "颂赞转向神所能坚固信徒的奥秘：如今借先知书启示、按永恒神命令传给万国。"),
        ("obedience of faith", "书信开头与结尾呼应：福音启示的目标是使万国因信而归顺。"),
        ("only wise God", "荣耀归给独一智慧的神，藉耶稣基督直到永远；神学最终归向敬拜。"),
    ],
}


VOCAB = {
    "sacrifice": ("n.", "祭；献上的祭物"), "worship": ("n.", "敬拜；事奉"), "transformed": ("v.", "被改变形像"),
    "renewal": ("n.", "更新"), "gifts": ("n.", "恩赐"), "genuine": ("adj.", "真诚的；不虚假的"),
    "tribulation": ("n.", "患难"), "hospitality": ("n.", "接待客旅"), "persecute": ("v.", "逼迫"),
    "authorities": ("n.", "执政掌权者"), "conscience": ("n.", "良心"), "taxes": ("n.", "税款"),
    "fulfillment": ("n.", "成全；应验"), "salvation": ("n.", "救恩"), "flesh": ("n.", "肉体；受罪支配的人性"),
    "weak": ("adj.", "软弱的"), "judgment": ("n.", "审判；论断"), "stumbling": ("n.", "绊倒"),
    "conscience": ("n.", "良心"), "righteousness": ("n.", "义"), "peace": ("n.", "平安"),
    "edification": ("n.", "造就"), "endurance": ("n.", "忍耐"), "instruction": ("n.", "教导"),
    "Gentiles": ("n.", "外邦人"), "hope": ("n.", "盼望"), "minister": ("n./v.", "服事者；服事"),
    "proclaimed": ("v.", "被传扬"), "reconciliation": ("n.", "和好"), "strive": ("v.", "竭力争战"),
    "sister": ("n.", "姊妹；主里的女性信徒"), "servant": ("n.", "服事者"), "fellow": ("adj.", "同一；同工的"),
    "approved": ("adj.", "经考验蒙认可的"), "saints": ("n.", "圣徒"), "division": ("n.", "分裂"),
    "deceive": ("v.", "欺骗"), "Satan": ("n.", "撒但"), "mystery": ("n.", "奥秘"),
}


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗用问题唤醒良心、预备答案或校正读者的判断；不要把它当作纯信息提问。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出一面事实，so 给出对应结论；特别留意比较如何推进保罗的伦理劝勉。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、可能性或反例；从上下文判断它是劝勉、警告还是论证。"
    if lower.startswith("for "):
        return "For 理由连接", "For 把本节同前文连起来，给出原因、圣经依据或结论的说明。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把前面已陈述的福音真理推向具体结论和行动。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "保罗先否定一种误解或道路，再以 but 标出真正合乎福音的回应。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 显示反差或校正；需把它前后两边一同理解。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("be ") or " must " in lower:
        return "命令句", "祈使语气呼召具体实践；本段命令建立在神先施的怜悯和基督里的身份上。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充名词的身份、内容或目的；先找它回指的中心名词。"
    return "主句与修饰成分", "先找主要动词和主语，再分析介词短语、并列结构和补语，读出保罗劝勉的逻辑。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [
        {"word": word, "ipa": "", "pos": pos, "meaning": meaning}
        for word, (pos, meaning) in VOCAB.items() if word.lower() in lower
    ][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合经文上下文和 ESV 语气来理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Romans"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Romans")
    for chapter in range(12, 17):
        source = filter_chapter(verses, chapter)
        assert len(source) == len(NOTES[chapter]), (chapter, len(source), len(NOTES[chapter]))
        payload = {}
        for index, item in enumerate(source):
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            # Romans 16 has no verse 24 in the source corpus, so study rows
            # must follow the actual verse sequence rather than verse - 1.
            phrase, note = NOTES[chapter][index]
            title, detail = grammar(text)
            payload[str(verse)] = {
                "vocab": vocabulary(text),
                "grammar": [{"title": title, "detail": detail}],
                "expression": [{"phrase": phrase, "note": note}],
                "translation": "",
            }
        write_json(output / f"{chapter}.json", payload)
        print(f"Romans {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
