"""Create static ESV learning notes for every verse of 1 Corinthians 9–16."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


# Short units keep each verse in its immediate argument, rather than attaching
# a chapter-level summary to isolated sentences.
THEMES = {
    9: [
        (range(1, 7), "apostolic rights", "保罗先确立使徒有得供应的正当权利：他见过主、教会是他劳苦的印证，服役、耕种和牧养都应有相应供应。"),
        (range(7, 15), "the right to material support", "保罗从生活常识、摩西律法和圣殿服事论证传福音者可由福音供养；但他自己甘愿不使用这权利，免得拦阻福音。"),
        (range(15, 19), "a gospel entrusted", "传福音不是保罗可夸的个人成就，而是托付；他宁可放弃报酬，使福音白白传开。"),
        (range(19, 24), "all things to all people", "保罗在不违背神律法、仍属基督律法的前提下适应不同群体，为要多救一些人并同享福音的福分。"),
        (range(24, 28), "run for the prize", "竞赛比喻呼召有目的的自制：可朽的冠冕尚且值得训练，信徒更当为不朽的奖赏节制，不让自己失去资格。"),
    ],
    10: [
        (range(1, 6), "examples from the wilderness", "以色列在云和海下都经历神的带领，却多数仍倒毙旷野；属灵特权不能代替忠心，历史成为我们的警戒。"),
        (range(6, 11), "do not desire evil", "保罗列举旷野中的贪恋、拜偶像、淫乱、试探主和发怨言；这些记录是末世信徒的警告。"),
        (range(12, 14), "the way of escape", "自以为站立者当谨慎；神信实地限制试探并预备出路，因此结论是逃避偶像崇拜。"),
        (range(15, 18), "participation in Christ", "主餐的杯和饼表示与基督的血和身体相交；以色列祭坛的例子说明吃祭物也表示参与敬拜。"),
        (range(19, 23), "not partners with demons", "偶像本身不是神，但外邦祭祀实际与鬼相交；信徒不能同时领主的杯和鬼的杯，也不可用“凡事可行”误用自由。"),
        (range(23, 31), "seek another's good", "市场食物可凭良心自由吃；若有人明确说是祭偶像之物，为他人的良心应放弃。凡做什么都要为荣耀神。"),
        (range(31, 34), "give no offense", "保罗的总体原则是不使犹太人、希腊人和神的教会跌倒；他不求自己的益处，只求多人的益处使他们得救。"),
    ],
    11: [
        (range(1, 3), "imitate Christ's servant", "保罗先肯定他们持守传统，并以基督、男人、女人的关系秩序引入关于祷告和讲道时头部记号的讨论。"),
        (range(4, 10), "honor in gathered worship", "本段按哥林多文化中头部遮盖的记号讨论敬拜中的荣耀、性别和受造秩序；重点是不让个人表达破坏对神的尊荣。"),
        (range(11, 16), "mutual dependence", "在主里男女彼此相属：女人出于男人，男人也藉女人而生，万有出于神；保罗要求按共同敬拜的合宜性作判断。"),
        (range(17, 22), "division at the Lord's Supper", "保罗严厉责备他们聚会反倒受害：富足者先吃喝、贫穷者被羞辱，使主的晚餐变成阶层分裂的餐会。"),
        (range(23, 26), "the Lord's Supper received", "主亲自设立的传统以饼和杯宣告他的身体与新约之血；每逢吃喝，就宣告主的死直到他来。"),
        (range(27, 32), "examine yourselves", "不按合宜方式吃喝就是干犯主的身体和血；应省察、分辨身体。神的管教甚至在软弱疾病中发生，为免与世界一同被定罪。"),
        (range(32, 35), "wait for one another", "实际纠正很简单：聚会吃主餐时彼此等候；若只是满足饥饿应在家吃，余下事项保罗到时安排。"),
    ],
    12: [
        (range(1, 4), "varieties of gifts", "属灵恩赐不可无知；从前被偶像牵引的人如今以“耶稣是主”的圣灵见证为标记，恩赐虽不同，圣灵却是一位。"),
        (range(4, 11), "one Spirit, one God", "恩赐、职事和功用各有不同，却由同一位神运行；每人领受圣灵的显现为叫人得益处，圣灵按己意分给各人。"),
        (range(12, 14), "one body in Christ", "身体虽多肢体仍是一个，基督也是如此；犹太人与希腊人、奴仆与自由人都在一位圣灵里受洗归入一体。"),
        (range(14, 21), "every member is necessary", "脚、耳、眼的反问表明不同肢体不因不同便不属身体；神按自己的意思安置各肢体，没有一肢可以轻看另一肢。"),
        (range(21, 27), "honor the weaker members", "看似软弱或不体面的肢体反而不可少、应得更大尊荣，使身体没有分门别类，而能同受苦、同得荣耀。"),
        (range(27, 32), "gifts and the more excellent way", "教会是基督身体，各人互为肢体；使徒、先知、教师和各样恩赐并不由每人全有。保罗要指示更妙的路。"),
    ],
    13: [
        (range(1, 4), "without love, nothing", "即使有方言、预言、知识、信心、施舍或舍身，若没有爱，人的事工和牺牲在神面前仍归于无。"),
        (range(4, 8), "the character of love", "爱是恒久忍耐又有恩慈，不嫉妒、不自夸、不自私、不记恨，反倒因真理欢喜，并恒久忍耐、相信、盼望。"),
        (range(8, 13), "love never ends", "预言、方言、知识都是部分的并将止息；如今所知有限，将来面对面。信、望、爱常存，其中最大的是爱。"),
    ],
    14: [
        (range(1, 6), "pursue love and prophecy", "爱是首要道路，也要切慕属灵恩赐，尤其先知讲道；方言若无人明白是向神说奥秘，预言却造就人和教会。"),
        (range(6, 12), "intelligible speech", "乐器若发音无分别，听者不能辨认；同样方言若没有可明白的话，便如向空气说话。应追求多得造就教会的恩赐。"),
        (range(12, 20), "pray for interpretation", "说方言者应求能翻出来；祷告、歌唱和祝谢既要用灵也要用悟性，使外人能说阿们并得造就。成熟不在炫耀，而在心志上成长。"),
        (range(20, 26), "a sign and conviction", "律法预言陌生言语仍不能使以色列听从；无翻译的方言会使外人以为聚会癫狂，清楚预言却显明人心，使其敬拜神。"),
        (range(26, 33), "let all things build up", "聚会中的诗歌、教训、启示、方言都应为造就；方言最多两三人且须翻译，先知也按次序发言，因为神不是混乱而是和平的神。"),
        (range(33, 37), "order and authority", "保罗处理当时聚会中扰乱秩序的发言，并要求人顺服主的命令；解释此段时须将其与本章的造就、秩序和全书的共同事奉一并理解。"),
        (range(37, 41), "desire gifts, do all things decently", "结语维持双重平衡：要切慕先知讲道，也不要禁止说方言；一切必须规规矩矩、按着次序行。"),
    ],
    15: [
        (range(1, 5), "the gospel received", "保罗重申他们所领受、所站立、并借以得救的福音：基督照圣经为罪死、埋葬、第三天复活并向矶法和十二使徒显现。"),
        (range(5, 12), "witnesses to the resurrection", "复活主向五百弟兄、雅各、众使徒和最后的保罗显现；无论谁传，众教会所信的都是这复活福音。"),
        (range(12, 19), "if Christ has not been raised", "若没有复活，传道、信心和赦罪皆为空，见证者成了妄证，死去的信徒也灭亡，基督徒便最可怜。"),
        (range(20, 29), "Christ the firstfruits", "事实是基督已复活，成为睡了之人初熟果子；亚当带来死，基督带来生命，末期废掉一切权柄并将国交给父。"),
        (range(29, 35), "live consistently with resurrection", "若死人不复活，替死人受洗、使徒每日冒死皆无意义；“吃喝吧”不是答案，信徒当清醒，停止犯罪。"),
        (range(35, 42), "how are the dead raised?", "种子先死后生、神按己意赐形体；肉体、天体和荣耀各异，复活身体与现今身体有连续性也有转变。"),
        (range(42, 50), "the imperishable body", "所种的是朽坏、羞辱、软弱的，复活的是不朽、荣耀、有能力的；属天的基督带来属天形像，血肉不能承受神国。"),
        (range(50, 55), "the mystery of transformation", "末次号筒时死人复活、活人改变，必朽坏穿上不朽坏；死亡被胜利吞灭，预言完全实现。"),
        (range(55, 59), "victory and steadfast work", "死亡的毒钩是罪，罪的权势是律法；神藉主耶稣赐胜利，因此信徒当坚固、不摇动，劳苦在主里不徒然。"),
    ],
    16: [
        (range(1, 5), "collection for the saints", "保罗安排每周按收入预留捐项给耶路撒冷圣徒，避免他到时仓促募集；他计划先到马其顿再探访哥林多。"),
        (range(5, 10), "plans under the Lord's will", "保罗不愿只匆匆经过，盼望若主许可与他们同住；他暂留以弗所，因为有宽大有效的门，也有许多敌挡者。"),
        (range(10, 13), "receive Timothy and stand firm", "应让提摩太无惧作主工，也不可轻看他；信徒则要警醒、站稳、刚强。"),
        (range(13, 19), "love in service and greetings", "一切所作要凭爱；司提反一家是亚该亚初熟果子，已委身服事圣徒，教会当顺服这样的同工。亚细亚众教会问安。"),
        (range(19, 25), "greetings and devotion", "百基拉、亚居拉和家庭教会问安；圣洁亲嘴表达团契。保罗亲笔问安、严肃宣告爱主者的归属，并以主快来表达盼望。"),
        (range(25, 28), "grace, love, and closing", "结尾以主耶稣的恩典和保罗在基督里的爱祝福教会；严厉纠正始终服务于福音里的爱。"),
    ],
}

VOCAB = {
    "apostle": ("n.", "使徒；奉差遣者"), "gospel": ("n.", "福音"), "rights": ("n.", "权利"),
    "support": ("n./v.", "供给；支持"), "boast": ("v.", "夸口"), "enslaved": ("adj.", "受奴役的"),
    "self-control": ("n.", "自制"), "temptation": ("n.", "试探"), "idolatry": ("n.", "拜偶像"),
    "participation": ("n.", "参与；相交"), "conscience": ("n.", "良心"), "glory": ("n.", "荣耀"),
    "traditions": ("n.", "传统；使徒所传的教导"), "head": ("n.", "头；首位"), "Supper": ("n.", "晚餐；主的晚餐"),
    "examine": ("v.", "省察；检验"), "gifts": ("n.", "恩赐"), "manifestation": ("n.", "显现"),
    "body": ("n.", "身体；基督的身体"), "prophecy": ("n.", "预言；先知讲道"), "tongues": ("n.", "方言"),
    "interpret": ("v.", "翻译；解释"), "edify": ("v.", "造就"), "resurrection": ("n.", "复活"),
    "firstfruits": ("n.", "初熟果子"), "perishable": ("adj.", "会朽坏的"), "imperishable": ("adj.", "不朽坏的"),
    "victory": ("n.", "胜利"), "collection": ("n.", "捐项；募捐"), "devoted": ("adj.", "委身的"),
    "grace": ("n.", "恩典"),
}


def theme(chapter: int, verse: int) -> tuple[str, str]:
    units = THEMES[chapter]
    for index, (verses, phrase, explanation) in enumerate(units):
        # Ranges document each unit's opening verse.  Calculate its upper
        # boundary from the next opening verse, so a human-written endpoint
        # cannot accidentally omit the final verse of a paragraph.
        start = verses.start
        next_start = units[index + 1][0].start if index + 1 < len(units) else None
        if verse >= start and (next_start is None or verse < next_start):
            return phrase, explanation
    raise AssertionError((chapter, verse))


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗以问题推进论证或暴露错误推论；需在上下文中寻找其预期的答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出比较或前提，so 推出对应结果；这是保罗解释救恩和伦理时常用的平行结构。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引入条件、假设或反例；辨认其结论，避免把条件句从整段论证中抽离。"
    if lower.startswith("for "):
        return "For 理由连接", "For 给出前一句的原因、证据或进一步说明，阅读时应同前文连读。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 将福音事实推向结论或具体实践。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定一种错误理解或行为，再以 but 强调保罗要建立的真理。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出重要的反差、例外或校正，要把转折前后两部分一起理解。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("flee ") or " must " in lower:
        return "命令句", "祈使语气要求实际回应；本书的命令以基督的十字架、身体和复活为基础。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、目的或结果；先找清楚其所修饰的对象。"
    return "主句与修饰成分", "先找主语和主要动词，再整理介词短语、并列与分词，跟随保罗的论证层次。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [w.strip(".,;:!?\"'“”()��") for w in text.split()]
    key = next((w for w in words if len(w) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合本段的 ESV 论证理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 Corinthians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 Corinthians")
    for chapter in range(9, 17):
        source = filter_chapter(verses, chapter)
        payload = {}
        for item in source:
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, explanation = theme(chapter, verse)
            title, detail = grammar(text)
            payload[str(verse)] = {
                "vocab": vocabulary(text),
                "grammar": [{"title": title, "detail": detail}],
                "expression": [{"phrase": phrase, "note": explanation}],
                "translation": "",
            }
        write_json(output / f"{chapter}.json", payload)
        print(f"1 Corinthians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
