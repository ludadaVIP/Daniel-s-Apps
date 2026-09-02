"""Create static ESV learning notes for every verse of 2 Corinthians 1–7."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "comfort in all affliction", "保罗以颂赞开始：慈悲的父、各样安慰的神在患难中安慰我们，使我们也能安慰经历患难的人。"),
        (6, "sharing Christ's sufferings", "患难与安慰都服务于哥林多人的坚固和救恩；他们既分享使徒的苦难，也将分享神所赐的安慰。"),
        (9, "the sentence of death", "保罗说明在亚西亚遭遇极重压力，甚至绝望；这经历使他不倚靠自己，只倚靠使死人复活的神。"),
        (12, "a clear conscience", "保罗辩明自己的行事为人出于圣洁、真诚和神的恩典，不靠世俗智慧；他盼望主日彼此成为夸耀。"),
        (15, "a change of plans", "保罗解释旅行计划的变更不是轻率反复，而是为使哥林多人再得益处；他的“是”仍以神旨意为准。"),
        (18, "Yes in Christ", "神在基督里的应许都成为“是”；因此教会藉基督说阿们，把荣耀归给神。"),
        (21, "sealed with the Spirit", "神在基督里坚固、膏抹并印证信徒，又把圣灵放在心里作凭据，保证将来完全的救恩。"),
        (23, "to spare you", "保罗以神作证，他暂不去哥林多是为宽容他们；使徒不辖制人的信心，而是为他们的喜乐同工。"),
    ],
    2: [
        (1, "not another painful visit", "保罗没有再作叫双方忧愁的访问；他写严厉信不是要使他们伤心，而是让他们知道他格外的爱。"),
        (5, "forgive and comfort", "受惩戒者已承受多数人的责备，现在应被赦免安慰，免得忧愁过度；饶恕也防止撒但乘机。"),
        (12, "a door was opened", "保罗在特罗亚有主所开的福音门，却因未遇提多而心里不安，便往马其顿去。"),
        (14, "the fragrance of Christ", "神在基督里率领使徒凯旋，藉他们散发认识基督的香气；这香气对得救者与灭亡者产生不同结果。"),
        (16, "who is sufficient", "福音事工的严肃使人问“谁能当得起”；保罗与贩卖神话语者不同，乃从神面前、在基督里真诚说话。"),
    ],
    3: [
        (1, "a letter from Christ", "哥林多人本身就是保罗事工的推荐信，是基督用永生神的灵写在心版上，不是写在石版上。"),
        (4, "sufficient from God", "保罗的信心在神面前藉基督而有；人的够用不是出于自己，乃是神使人有资格作新约执事。"),
        (6, "the new covenant", "字句叫人死，圣灵叫人活；这不是贬低旧约，而是对比律法的定罪功能与圣灵赐生命的新约荣耀。"),
        (9, "surpassing glory", "若定罪和死亡的职事尚有荣耀，圣灵和称义的职事就更有超越的荣耀，使前者相形失色。"),
        (12, "unveiled faces", "因有盼望，使徒坦然讲道；摩西的帕子象征以色列读旧约时尚未在基督里除去的遮蔽。"),
        (16, "the veil is removed", "人归向主时帕子就除去；主就是那灵，主的灵所在就有使人事奉神的自由。"),
        (18, "being transformed", "信徒敞着脸观看主的荣光，正持续被改变为同一形像，荣耀加增，出于主的灵。"),
    ],
    4: [
        (1, "we do not lose heart", "既因怜悯得着新约职事，使徒不丧胆，不行诡诈，也不歪曲神的话，只公开真理。"),
        (3, "the god of this world", "福音若被蒙蔽，是对灭亡者蒙蔽；这世代的神弄瞎不信者心眼，使其不见基督荣耀的光。"),
        (5, "Jesus Christ as Lord", "使徒不传自己，只传耶稣基督为主，并因耶稣作众人的仆人；创造光的神也照进人心。"),
        (7, "treasure in jars of clay", "福音宝贝放在脆弱瓦器中，为显明莫大的能力出于神，不出于我们；四面受敌却不被压碎。"),
        (10, "the death of Jesus", "使徒常带着耶稣的死，为使耶稣的生命也显明在必死的身体上；死在使徒身上发动，生命却临到教会。"),
        (13, "we also believe", "保罗引用诗篇说明：因同一信心的灵，他相信所以说话，并确信叫耶稣复活的神也要叫信徒复活。"),
        (15, "grace extends", "一切为教会益处，好叫恩典临到更多人，感谢加增，荣耀归给神。"),
        (16, "the unseen is eternal", "外体虽毁坏，内心却日日更新；至暂至轻的苦楚正成就极重无比永远的荣耀，焦点在未见的永恒。"),
    ],
    5: [
        (1, "a building from God", "地上的帐棚毁坏时，信徒有从神而来永存的房屋；这表达复活身体和最终与神同住的盼望。"),
        (4, "clothed with immortality", "今生叹息不是渴望无身体，而是盼望穿上属天居所，使必死被生命吞灭；圣灵是凭据。"),
        (6, "walk by faith", "住在身体内便与主分离，仍应常存勇敢，因为行事为人是凭信心，不凭眼见。"),
        (9, "the judgment seat of Christ", "信徒的志向是讨主喜悦；众人要在基督审判台前显露，按身体所行的善恶受报。"),
        (11, "the fear of the Lord", "认识敬畏主的严肃，使徒劝人；他们的良心和事奉在神面前显明，也盼在哥林多人良心中显明。"),
        (14, "the love of Christ controls", "基督的爱催迫使徒：一人为众人死，众人便都死；活着的人不再为自己，乃为替他们死而复活的主。"),
        (16, "a new creation", "在基督里，人不再按肉体看任何人；旧事已过，一切都成为新的，完全出于使人和好的神。"),
        (18, "the ministry of reconciliation", "神在基督里叫世人与自己和好，不将过犯归给他们，并把和好的道托付使徒。"),
        (20, "ambassadors for Christ", "使徒代表基督恳求人与神和好；无罪的基督为我们成为罪，使我们在他里面成为神的义。"),
    ],
    6: [
        (1, "not receive grace in vain", "作为神同工，使徒劝哥林多人不要徒受神的恩典；如今正是悦纳和拯救的日子。"),
        (3, "commending ourselves", "使徒不叫人因事工跌倒，反在各样患难、殴打、囚禁、劳苦中表明自己是神的仆人。"),
        (6, "weapons of righteousness", "他们以纯洁、知识、忍耐、仁慈、圣灵、真爱、真理和神能力服事，以左右手的义兵面对荣耀羞辱。"),
        (8, "as dying, and behold", "一连串“似乎……却是……”描绘十字架形态的事工：被看为无名、将死、忧愁、贫穷，却在神里真实活着、喜乐、富足。"),
        (11, "open wide your hearts", "保罗向哥林多人敞开心怀，限制不在他这边，而在他们狭窄的爱；他以父亲语气呼吁他们也敞开。"),
        (14, "unequally yoked", "不要与不信者负不配的轭；保罗以义与不法、光与暗、基督与彼列的反问强调圣洁身份不可与偶像妥协。"),
        (16, "the temple of the living God", "信徒是永生神的殿，神应许住在其间、作他们的神、称他们为儿女；因此应洁净自己，敬畏神得以成圣。"),
    ],
    7: [
        (1, "bring holiness to completion", "承接神的应许，信徒应洁净身体和心灵一切污秽，在敬畏神中完成成圣。"),
        (2, "make room in your hearts", "保罗再次要求他们敞开心；他没有亏负、败坏或占谁便宜，即使受苦仍因他们得安慰和喜乐。"),
        (5, "comforted by Titus", "保罗在马其顿外有争战、内有惧怕，神却藉提多来到和其带回的哥林多人的想念、哀恸和热心安慰他。"),
        (8, "godly grief", "先前严厉信使他们忧愁，保罗一度不安却不后悔；属神的忧愁带来无需后悔的悔改和救恩，世俗忧愁却导致死亡。"),
        (11, "earnestness and longing", "哥林多人的属神忧愁产生热切、自辩、愤慨、敬畏、想念、热心和惩治恶事，证明他们在此事上清洁。"),
        (12, "your earnestness for us", "保罗写信的目的不只针对加害者或受害者，更要使他们在神面前显明自己对使徒的热心。"),
        (13, "Titus's joy", "他们的顺服使保罗得安慰，也使提多因众人的接待而更喜乐；保罗先前对他们的夸奖没有落空。"),
        (15, "with fear and trembling", "提多记念他们以敬畏、战兢的顺服接待他；保罗因此喜乐，能在凡事上信任他们。"),
    ],
}

VOCAB = {
    "comfort": ("n./v.", "安慰；安慰人"), "affliction": ("n.", "患难；苦难"), "sufferings": ("n.", "苦难"),
    "deliver": ("v.", "拯救；救出"), "conscience": ("n.", "良心"), "sincerity": ("n.", "真诚"),
    "promise": ("n.", "应许"), "seal": ("v.", "印证；盖印"), "guarantee": ("n.", "凭据；保证"),
    "forgive": ("v.", "赦免"), "Satan": ("n.", "撒但"), "fragrance": ("n.", "香气"),
    "sufficient": ("adj.", "够用的；足够的"), "covenant": ("n.", "约"), "Spirit": ("n.", "圣灵"),
    "glory": ("n.", "荣耀"), "veil": ("n.", "帕子；遮盖"), "transformed": ("v.", "被改变形像"),
    "gospel": ("n.", "福音"), "treasure": ("n.", "宝贝"), "jars": ("n.", "瓦器；罐子"),
    "resurrection": ("n.", "复活"), "eternal": ("adj.", "永恒的"), "tent": ("n.", "帐棚"),
    "judgment": ("n.", "审判"), "reconciliation": ("n.", "和好"), "ambassadors": ("n.", "使者；大使"),
    "righteousness": ("n.", "义"), "grace": ("n.", "恩典"), "hardships": ("n.", "艰难"),
    "holiness": ("n.", "圣洁"), "idol": ("n.", "偶像"), "repentance": ("n.", "悔改"), "grief": ("n.", "忧愁"),
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
        return "修辞问句", "保罗用问题唤醒良心、显明对比或引导读者进入下文的答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 与 so 构成比较或推论；先找前项事实，再找相应的结论。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出条件或假设；阅读时应连同其后果和段落论证一起理解。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明前文的理由、根据或解释，使句子成为保罗论证的一环。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把已陈述的恩典或事实推向结论和实际回应。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "保罗否定错误理解或道路，再强调合乎福音的真实情形。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标明重要的反差、例外或校正；要同时保留其前后的张力。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气呼召具体回应；哥林多后书的命令以神的安慰、和好与圣洁应许为基础。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充人物或事物的身份、内容、目的或结果；先找所修饰的中心词。"
    return "主句与修饰成分", "先辨识主要动词与主语，再整理并列、介词和分词结构，跟随保罗的牧养思路。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 经文和本段上下文理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "2 Corinthians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "2 Corinthians")
    for chapter in range(1, 8):
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
