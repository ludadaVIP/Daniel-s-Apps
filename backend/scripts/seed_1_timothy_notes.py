"""Create static ESV learning notes for every verse of 1 Timothy."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "the command to remain", "保罗按神和基督耶稣的命令写信，嘱咐提摩太留在以弗所，吩咐某些人不可传别的教训。"),
        (3, "sound doctrine and love", "无穷家谱和虚构故事带来猜测，不能推进神的工作；命令的目标是从清洁心、无亏良心和无伪信心生出的爱。"),
        (6, "vain discussion", "有人离弃这目标，转向虚空谈论，想作律法师却不明白自己所说所断言的。"),
        (8, "the lawful use of the law", "律法本是好的，若人用得合宜；它针对不法与罪人，显明与纯正教义相反的罪，并与荣耀福音相合。"),
        (12, "mercy to the foremost", "保罗感谢基督托付他事奉；他从前亵渎、逼迫、侮慢，却因无知不信蒙怜悯，显明主的恩典格外丰盛。"),
        (15, "Christ Jesus came to save sinners", "可信、配得完全接纳的话是：基督耶稣降世为要拯救罪人；保罗以自己为首，成为后来信主得永生之人的榜样。"),
        (17, "honor and glory", "个人蒙恩的见证自然转为颂赞：荣耀归给万世之王、不朽、不能看见、独一的神。"),
        (18, "wage the good warfare", "保罗把职分托付提摩太，要他按先前预言打美好的仗，持守信心和无亏良心；弃绝良心者使信仰如船破坏。"),
    ],
    2: [
        (1, "prayer for all people", "首先应为万人作恳求、祷告、代求和感谢，也为君王和一切掌权者祷告，使信徒能敬虔端正地平安生活。"),
        (3, "God desires all to be saved", "这样的祷告在救主神面前是好的；他愿万人得救、明白真道，因为神只有一位，神人之间也只有一位中保基督耶稣。"),
        (6, "a ransom for all", "基督舍自己作万人的赎价，在适当时候成为见证；保罗受派作传道者和使徒，教导外邦人信心和真理。"),
        (8, "pray with holy hands", "男人应在各处举起圣洁的手祷告，远离忿怒和争论；祷告的姿态必须与生活和关系相称。"),
        (9, "adorn themselves", "女人的装饰应以端庄、节制和敬畏神相配，不以炫耀财富或外表为中心，而以善行为真正装饰。"),
        (11, "learn quietly", "本段处理以弗所教会聚会中的学习和教导秩序；应把“安静”理解为安定、非扰乱的态度，并结合上下文的敬虔与真理。"),
        (13, "Adam was formed first", "保罗以创造和堕落叙事说明他的教导；这段难解经文不应脱离整本圣经关于救恩、学习和教会建造的脉络。"),
    ],
    3: [
        (1, "a noble task", "监督职分是善工，渴慕它不是追求地位，而是愿意承担高尚的牧养责任。"),
        (2, "above reproach", "监督应无可指摘、婚姻忠贞、自守端正、乐意接待、善于教导，不沉溺酒和暴力，也不贪财。"),
        (4, "manage his household", "家庭管理是检验牧养能力的场所；若不能照顾自己的家，怎能照管神的教会。"),
        (6, "not a recent convert", "不可让初信者匆忙担任监督，免得因骄傲落入魔鬼的审判；也须在教外有好名声。"),
        (8, "deacons likewise", "执事也应庄重、不两舌、不嗜酒、不贪不义之财，持守信仰奥秘并有清洁良心。"),
        (10, "let them be tested", "执事应先受试验，证明无可责备才可服事；其配偶/女执事同样要端庄、忠心、不毁谤。"),
        (12, "great confidence", "执事须在婚姻和家庭上忠心；善尽职分者在基督耶稣的信道上得美好地步和大有胆量。"),
        (14, "the household of God", "保罗说明写信目的，是使提摩太知道神家当怎样行；教会是永生神的家、真理的柱石和根基。"),
        (16, "the mystery of godliness", "早期信仰告白颂扬基督：显现在肉身、被圣灵称义、被天使看见、传于万邦、为世人信服、接在荣耀里。"),
    ],
    4: [
        (1, "some will depart", "圣灵明说后来有人离弃真道，听从欺骗的灵和鬼魔教训；假教师说谎、良心如被烙铁。"),
        (3, "everything created by God", "禁止婚嫁、禁戒食物的教训违背创造主；神所造的物若以感谢领受便是好的，藉神的道和祷告成为圣洁。"),
        (6, "trained in the words", "提摩太把这些事提醒弟兄就是基督耶稣的好执事，靠信心和纯正教训的话得养育，拒绝世俗荒渺言语。"),
        (7, "train yourself for godliness", "身体操练有些益处，敬虔却凡事有益，带着今生和来生的应许；这话可信，值得全然接纳。"),
        (10, "set our hope", "使徒劳苦奋斗，是因盼望在永生神身上；他是万人的救主，尤其是信徒的救主。"),
        (11, "set an example", "提摩太不可因年轻被轻看，反要在言语、行为、爱心、信心、清洁上作信徒榜样，并专心读经、劝勉和教导。"),
        (14, "do not neglect the gift", "不可忽略藉预言和长老按手所领受的恩赐，应殷勤操练，使众人看见长进。"),
        (16, "watch your life and doctrine", "谨慎自己和教训，并持守到底；这样既救自己，也救听你的人，显示生命与真道不可分离。"),
    ],
    5: [
        (1, "treat as family", "劝戒不同年龄性别的信徒应如家人：老人如父、少年如弟、老妇如母、年轻女子如姊妹，存完全清洁的心。"),
        (3, "honor widows", "教会应尊敬真正无依的寡妇；有儿女孙子者先在家庭中尽孝，这是蒙神悦纳的报答。"),
        (5, "a true widow", "真正孤单仰赖神的寡妇昼夜恳求祷告；放纵宴乐者虽活着也是死的。"),
        (8, "provide for relatives", "不供养亲属尤其自己家的人，是背弃信仰，比不信者还不好；信仰必结出家庭责任。"),
        (9, "enrolled as a widow", "名单制度关乎受教会长期供养、祷告服事的寡妇，应有年龄、婚姻忠贞和善行的明证。"),
        (11, "younger widows", "较年轻者可能因欲望离开对基督的委身，又落在闲散、搬弄是非；保罗劝她们嫁人、管理家务、不给敌人毁谤机会。"),
        (16, "relieve the church", "有信主家属的妇女应供养本家的寡妇，使教会资源能用于真正无依者。"),
        (17, "elders who rule well", "治理得好的长老尤其劳苦传道教导者，应配受加倍敬奉；经文支持对事工者的物质供应。"),
        (19, "two or three witnesses", "控告长老不可轻易接纳，须有两三见证人；持续犯罪者应公开责备，使其余的人惧怕。"),
        (21, "without prejudging", "在神、基督和蒙拣选天使面前要不存成见、无偏心执行这些原则；不要急促按手，免得与人的罪有分。"),
        (23, "use a little wine", "保罗给提摩太实际健康建议，显示属灵牧养也顾及身体软弱；人的罪或善行有时显明得快、有时随后才显露。"),
    ],
    6: [
        (1, "honor their masters", "在罗马社会奴仆应尊敬主人，免得神名和教训被毁谤；信主主人更不可成为轻看的理由。"),
        (3, "godliness with contentment", "不同于主耶稣纯正话语和敬虔教训的人骄傲无知，沉迷争辩，产生嫉妒纷争、毁谤和邪恶猜疑。"),
        (6, "we brought nothing", "敬虔加上知足是真大利益；人没有带什么到世上，也不能带什么去，有衣有食就当知足。"),
        (9, "love of money", "想要发财的人落在试探和网罗；贪财是万恶之根/各样恶事的根，有人贪恋钱财就离弃信仰并用许多愁苦把自己刺透。"),
        (11, "flee and pursue", "属神的人应逃避贪财，追求公义、敬虔、信心、爱心、忍耐、温柔，并打信心美好的仗，持定永生。"),
        (13, "the good confession", "在赐万物生命的神和向彼拉多作美好见证的基督面前，提摩太受嘱咐无玷污守命令直到主显现。"),
        (15, "the blessed and only Sovereign", "主显现由那可称颂、独有权能、万王之王、万主之主的神按时候显明；他独居不死，人未曾看见也不能看见。"),
        (17, "not to be haughty", "富足者不可倚靠无定的钱财，应倚靠厚赐百物享受的神，并要行善、富足于善行、甘心施舍和分享。"),
        (19, "the life that is truly life", "这样积成美好根基，为将来持定真正的生命；提摩太要保守所托付的，躲避世俗虚谈和假称知识的矛盾。"),
        (21, "grace be with you", "有人自称有这种“知识”却偏离真道；书信以恩典祝福众人收束。"),
    ],
}

VOCAB = {
    "command": ("n.", "命令；嘱咐"), "doctrine": ("n.", "教训；教义"), "love": ("n.", "爱"), "conscience": ("n.", "良心"),
    "law": ("n.", "律法"), "gospel": ("n.", "福音"), "mercy": ("n.", "怜悯"), "grace": ("n.", "恩典"),
    "warfare": ("n.", "争战"), "prayer": ("n.", "祷告"), "mediator": ("n.", "中保"), "ransom": ("n.", "赎价"),
    "modesty": ("n.", "端庄；谦逊"), "overseer": ("n.", "监督"), "deacons": ("n.", "执事"), "reproach": ("n.", "责备；指控"),
    "mystery": ("n.", "奥秘"), "godliness": ("n.", "敬虔"), "apostasy": ("n.", "离弃真道"), "created": ("v.", "被创造"),
    "train": ("v.", "操练；训练"), "gift": ("n.", "恩赐"), "doctrine": ("n.", "教训"), "widow": ("n.", "寡妇"),
    "honor": ("n./v.", "尊敬；尊荣"), "elders": ("n.", "长老"), "witnesses": ("n.", "见证人"), "partiality": ("n.", "偏心"),
    "contentment": ("n.", "知足"), "money": ("n.", "钱财"), "temptation": ("n.", "试探"), "confession": ("n.", "承认；宣认"),
    "Sovereign": ("n.", "至高掌权者"), "eternal": ("adj.", "永恒的"), "generous": ("adj.", "慷慨的"),
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
        return "修辞问句", "保罗用问句揭示错误推论或唤醒良心，答案须从相邻经文中寻找。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 引出比较、前提，so 导出对应结果；应把二者作为一个论证单位阅读。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件或假设，留意它如何支撑保罗的教会劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明前文的原因、经文依据或进一步解释。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把真理推进到牧养的结论和实践。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定一种不合福音的态度或行为，再强调应有的道路。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标明反差或校正，应同时注意转折前后的信息。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("flee ") or " must " in lower:
        return "命令句", "祈使语气呼召具体的教会生活和个人敬虔，建立在福音恩典之上。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充身份、内容、目的或结果；先找它回指的名词。"
    return "主句与修饰成分", "先找主语和主要动词，再整理介词、并列和补语，理解保罗的牧养重点。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 与本段教会处境理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 Timothy"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 Timothy")
    for chapter in range(1, 7):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / f"{chapter}.json", payload)
        print(f"1 Timothy {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
