"""Create static ESV learning notes for every verse of 2 Timothy."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


THEMES = {
    1: [
        (1, "the promise of life", "保罗按神旨意作基督耶稣使徒，为的是传扬在基督耶稣里生命的应许；他以父子般情感问安提摩太。"),
        (3, "remembering you in prayer", "保罗昼夜祷告感谢神，想起提摩太真诚的眼泪与他从罗以、友尼基承受的无伪信心。"),
        (6, "fan into flame", "提摩太应重新挑旺藉按手所得的神恩赐；神所赐不是胆怯的灵，乃是能力、爱和自制。"),
        (8, "share in suffering", "不可因主的见证或被囚的保罗羞耻，要按神能力为福音同受苦；神救我们、召我们，完全出于恩典旨意。"),
        (10, "abolished death", "恩典如今藉救主基督显明，他废掉死亡、藉福音把生命和不朽显明出来；保罗因此受派传道。"),
        (12, "I know whom I have believed", "保罗受苦却不羞耻，因为他认识所信的主，确信主能保守自己所交托的直到那日。"),
        (13, "guard the good deposit", "提摩太当以在基督里的信爱守住纯正话语的模范，靠住在我们里面的圣灵看守所托付的美好真理。"),
        (15, "the Lord grant mercy", "亚细亚许多人离弃保罗；阿尼色弗却常使他畅快、不以锁链为耻，并在罗马殷勤寻找他，保罗为此祈求怜悯。"),
    ],
    2: [
        (1, "strengthened by grace", "提摩太应在基督耶稣的恩典里刚强，并把从保罗所听见、由众见证人印证的教导交托忠心能教导别人的人。"),
        (3, "share in suffering", "兵士不让世务缠身，为要讨招他当兵者喜悦；运动员须按规矩竞赛；劳苦农夫当先得收成，三种图像都呼唤专一忍耐。"),
        (8, "remember Jesus Christ", "要记念从死里复活、大卫后裔的耶稣基督；保罗为福音受苦被捆绑，神的道却不被捆绑。"),
        (10, "endure for the elect", "保罗为选民忍耐，使他们也在基督里得救和永远荣耀；可信的话以与基督同死同活、忍耐同作王为应许，也警告不认主的后果。"),
        (14, "rightly handling the word", "要提醒众人并在神面前嘱咐不可为言语争辩；工人应竭力得神喜悦、无愧地按正意分解真理的道。"),
        (16, "avoid irreverent babble", "世俗虚谈会使人越发不敬虔，如坏疽扩散；许米乃和腓理徒偏离真道，说复活已过，扰乱人的信心。"),
        (19, "the Lord knows", "神坚固根基站立，有印记说明主认识属他的人，也叫称主名的人离开不义。"),
        (20, "a vessel for honorable use", "大户人家有金银与木瓦器皿；人若自洁、离开卑贱事，就成为圣洁合乎主用、预备行各样善事的器皿。"),
        (22, "flee youthful passions", "逃避少年的私欲，和清心求告主的人一同追求公义、信心、仁爱、和平；愚拙无学问的争辩只会生争竞。"),
        (24, "the Lord's servant", "主的仆人不可争竞，须温温和和待众人、善于教导、存心忍耐，以温柔劝戒反对者，盼望神赐他们悔改。"),
    ],
    3: [
        (1, "last days", "末世将有艰难的日子，人以自我、金钱、享乐为中心，外有敬虔外貌却背了敬虔能力。"),
        (6, "capturing weak women", "假教师暗中侵入家庭，利用被罪压制、被私欲牵引的人；他们常常学习却不能明白真道。"),
        (8, "oppose the truth", "如同雅尼和佯庇敌挡摩西，这些人也敌挡真理，心地坏了，信仰经不起试验；但他们的愚妄终会显露。"),
        (10, "you have followed my teaching", "提摩太知道保罗的教训、生活、志向、信心、忍耐、爱心、坚忍与在安提阿、以哥念、路司得遭遇的逼迫；主却救他脱离。"),
        (12, "all who desire", "凡立志在基督耶稣里敬虔度日的都要受逼迫；恶人和迷惑人的将越久越恶，既迷惑人又被迷惑。"),
        (14, "continue in what you learned", "提摩太当持守所学所确信的，记得教导者，并从小明白圣经；圣经能使人因信基督有得救智慧。"),
        (16, "all Scripture is breathed out", "全部圣经都由神呼出，对教训、责备、归正、教导人学义都有益处，使属神的人完全预备行各样善事。"),
    ],
    4: [
        (1, "preach the word", "在将来审判活人死人的神和基督面前，保罗庄严嘱咐：务要传道，无论得时不得时，总要专心劝勉、责备、警戒。"),
        (3, "sound teaching", "人将厌烦纯正教训，随从私欲增添教师，耳朵发痒转向荒渺故事；提摩太却要凡事谨慎、忍受苦难、作传福音者。"),
        (6, "poured out as a drink offering", "保罗把自己看作已被浇奠、离世时候到了；他已打美好的仗、跑尽当跑的路、守住所信的道。"),
        (8, "the crown of righteousness", "公义冠冕为保罗存留，主这公义审判者在那日必赐给他，也赐给所有爱慕主显现的人。"),
        (9, "come to me soon", "保罗求提摩太尽快来；底马贪爱今世离弃他，多人分赴各地，惟路加同在，并嘱咐带马可来。"),
        (13, "bring the cloak", "他请求带来留在特罗亚的外衣、书卷尤其皮卷；末后岁月仍显出对圣经和文字的珍视。"),
        (14, "the Lord will repay", "铜匠亚力山大多多害保罗，主必按其行为报应；提摩太也当防备他，因为他强烈敌挡使徒的话。"),
        (16, "the Lord stood by me", "初次申诉无人扶助，保罗求主不归罪给他们；主却站在他旁边加给力量，使福音藉他传开，他也从狮子口被救出。"),
        (18, "the heavenly kingdom", "主必救保罗脱离各样凶恶，带他进天上的国；荣耀归主直到永永远远。"),
        (19, "final greetings", "保罗问候百基拉、亚居拉、阿尼色弗一家，说明同工动向，催提摩太冬前赶来，并以恩典为结尾。"),
    ],
}

VOCAB = {
    "promise": ("n.", "应许"), "faith": ("n.", "信心"), "gift": ("n.", "恩赐"), "spirit": ("n.", "灵"),
    "power": ("n.", "能力"), "self-control": ("n.", "自制"), "suffer": ("v.", "受苦"), "gospel": ("n.", "福音"),
    "immortality": ("n.", "不朽坏"), "deposit": ("n.", "所托付的；存款"), "pattern": ("n.", "模范；样式"),
    "grace": ("n.", "恩典"), "entrust": ("v.", "交托"), "soldier": ("n.", "兵士"), "athlete": ("n.", "运动员"),
    "endure": ("v.", "忍耐；忍受"), "resurrection": ("n.", "复活"), "word": ("n.", "道；话语"), "approved": ("adj.", "蒙认可的"),
    "quarreling": ("n.", "争竞"), "repentance": ("n.", "悔改"), "last days": ("n.", "末世"), "godliness": ("n.", "敬虔"),
    "persecution": ("n.", "逼迫"), "Scripture": ("n.", "圣经"), "breathed": ("v.", "吹出；神所默示"),
    "preach": ("v.", "传讲"), "sound": ("adj.", "纯正的；健康的"), "offering": ("n.", "祭；奠祭"), "crown": ("n.", "冠冕"),
    "righteousness": ("n.", "义"), "kingdom": ("n.", "国度"),
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
        return "修辞问句", "问句在此用于澄清真理、揭露错误推论或强化使徒的劝勉。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 引出比较或前提，so 导向相应结论，必须把两边连读。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、假设或可能性；留意其结果与段落劝勉的关系。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明理由、证据或进一步解释，把本节接回上一节。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把已经陈述的福音事实推向忠心的实践。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定错误道路，再突出合乎福音的正确态度和行动。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标记反差或校正，需同时观察前后论点。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("flee ") or " must " in lower:
        return "命令句", "祈使语气把福音托付落实为具体的牧养、忍耐和忠心。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充身份、目的或结果；先找清楚其修饰对象。"
    return "主句与修饰成分", "先辨认主要动词和主语，再处理并列、介词短语和补语，读出保罗的交托。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 和整段论证理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "2 Timothy"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "2 Timothy")
    for chapter in range(1, 5):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {"vocab": vocabulary(text), "grammar": [{"title": title, "detail": detail}], "expression": [{"phrase": phrase, "note": note}], "translation": ""}
        write_json(output / f"{chapter}.json", payload)
        print(f"2 Timothy {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
