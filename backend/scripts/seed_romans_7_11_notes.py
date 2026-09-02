"""Write static, verse-level Bible and Eng notes for Romans 7–11 (ESV)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


# Each row is tied to its own verse.  Phrase stays in ESV-style English for
# learning, while the explanation follows the flow of Paul's argument in Chinese.
NOTES = {
    7: [
        ("bound by the law", "婚约的例子说明：律法的管辖以人的存活为界；死亡使原来的约束终止。"),
        ("released from the law", "丈夫死后，妇人不再受原婚约约束；保罗借此预备解释信徒与律法关系的改变。"),
        ("belong to another", "信徒藉着基督的身体向律法死，如今归属复活的基督，目的不是无律，而是为神结果子。"),
        ("while we were living in the flesh", "旧生命中，罪的情欲借律法的禁令被激动，最后结出死亡的果子。"),
        ("serve in the new way", "如今脱离律法的旧辖制，服事不再只是字句的外在要求，而是在圣灵的新样式里。"),
        ("Is the law sin?", "保罗立刻否认律法本身是罪；律法的作用是揭露罪，例如“不可贪心”使贪心显明。"),
        ("seizing an opportunity", "罪像有行动力的势力，利用诫命制造各种贪心；问题不在诫命，而在罪。"),
        ("apart from the law", "没有明确诫命时，罪似乎不被识别；这不是说罪不存在，而是说它未被律法照出。"),
        ("sin came alive", "诫命来到时，罪的真实面目和能力暴露出来；保罗用“活了”描写罪被唤起的活动。"),
        ("proved to be death", "原为生命道路的诫命，因罪的扭曲，在罪人经验中反成为带来死亡的判决。"),
        ("deceived me", "罪借诫命欺骗并杀害人，呼应创世记中蛇的欺骗；责任仍在罪，不在神的律法。"),
        ("holy and righteous and good", "保罗三重肯定律法的品格：它属神、符合公义、并且本为良善。"),
        ("sin might be shown to be sin", "良善的律法带来死亡，是为了显出罪何等可憎、何等越发成为罪。"),
        ("sold under sin", "“属乎肉体”描述人落在罪权势下的软弱；保罗开始描画想行善却无力完成的冲突。"),
        ("I do not understand", "说话者的行动与认可的善相矛盾，显明罪不是单纯无知，而是内在的奴役。"),
        ("the law is good", "当人愿意却做恶时，反而承认律法对善恶的判断是正确的。"),
        ("sin that dwells within me", "保罗不是推卸责任，而是揭露罪住在人里面、夺取行动控制权的严重现实。"),
        ("nothing good dwells", "“肉体”不是身体本身邪恶，而是离开神、受罪支配的人性状态；意愿不足以产生善行。"),
        ("the evil I do not want", "重复的反讽强化困境：人并非没有道德认知，却无法靠自己摆脱罪的实践。"),
        ("a law that", "law 在此可理解为“规律、原则”：当人立志行善，恶却近在身边。"),
        ("delight in the law of God", "内在的人喜爱神的律法，显示这段挣扎不是对律法的蔑视，而是认识到罪的抵抗。"),
        ("another law in my members", "“members”指身体各部分和实际能力；罪的规律在其中与心思的律法交战。"),
        ("wretched man", "绝望的呼喊不是终点，而是承认自救无能、转而寻求神拯救的关键时刻。"),
        ("Thanks be to God", "答案是藉耶稣基督得拯救；本节总结心思服事神律法、肉体服事罪律的张力。"),
        ("serve the law of sin", "本章结尾重新陈述尚未完全的冲突，为第八章圣灵里的释放与生命铺路。"),
    ],
    8: [
        ("no condemnation", "在基督耶稣里的人不再被定罪；这是整章安慰和生命更新的起点。"),
        ("law of the Spirit of life", "圣灵赐生命的权能已在基督里释放信徒，胜过罪与死的规律。"),
        ("what the law could not do", "律法因人的肉体软弱无法使人称义或改变；神差遣自己的儿子处理罪。"),
        ("righteous requirement", "神在基督里定罪罪的目的，是使律法所要求的义在随从圣灵的人身上得以成全。"),
        ("set their minds", "肉体与圣灵的差别首先表现在心思所持续指向、珍视和追求的对象。"),
        ("life and peace", "圣灵所定向的心思带来生命与平安；肉体的心思则通向死亡。"),
        ("hostile to God", "肉体的心思不是中立的，它敌对神，不顺服也不能顺服神的律法。"),
        ("cannot please God", "仍在肉体范围的人不能讨神喜悦，突显人需要圣灵的新生命。"),
        ("Spirit of God dwells in you", "信徒不再“在肉体里”，因为神的灵住在他们里面；没有基督的灵就不属基督。"),
        ("the Spirit is life", "即使身体因罪仍会死亡，圣灵因神所赐的义已成为里面生命的源头。"),
        ("will also give life", "使耶稣复活的灵同样住在信徒里面，保证神将使必死的身体得生命。"),
        ("not to the flesh", "信徒对肉体没有债务，不必再顺从它提出的要求。"),
        ("put to death", "靠圣灵治死身体的恶行是持续的实际行动；结果是生命，不是靠自律赚取生命。"),
        ("led by the Spirit", "被神的灵引导的人显明为神的儿女；这不是偶尔感觉，而是生命归属的标记。"),
        ("Spirit of adoption", "圣灵不是使人回到惧怕的奴仆之灵，而是使人有儿女名分、能呼喊“阿爸，父”。"),
        ("bears witness", "圣灵与我们的灵一同见证我们确属神的儿女，提供属于神的确据。"),
        ("heirs of God", "儿女的身份包含产业：我们与基督同作后嗣，也与他同受苦、最终同得荣耀。"),
        ("not worth comparing", "现今苦难真实却不足与将来在我们身上显出的荣耀相比。"),
        ("creation waits", "受造界被人格化为热切等候，盼望神儿女的荣耀完全显明。"),
        ("subjected to futility", "受造界的虚空不是其自主选择，而是因神审判中的安排，却同时带着盼望。"),
        ("bondage to corruption", "受造界也将从败坏奴役中释放，进入神儿女荣耀的自由。"),
        ("groaning together", "全受造界像临产一样呻吟；疼痛指向艰难，也指向新生命将要来到。"),
        ("firstfruits of the Spirit", "信徒已有圣灵作为初熟果子，却仍叹息等候身体得赎，显示救恩的“已然与未然”。"),
        ("saved in this hope", "所见的不再是盼望；基督徒以忍耐等候尚未看见、却因神应许而确信的完成。"),
        ("wait for it with patience", "既然盼望的对象仍不可见，信徒就以忍耐持续等候；忍耐是盼望的实践形态。"),
        ("helps us in our weakness", "圣灵并非旁观者，在我们不知如何祷告时亲自扶助并代求。"),
        ("groanings too deep", "圣灵的代求超越言语；神洞察人心，也完全知道圣灵按神旨意的祈求。"),
        ("all things work together", "神使万事共同效力于爱他、按他旨意蒙召的人之益；这不是说每件事本身都是善。"),
        ("foreknew ... predestined", "神救恩的目的在于使信徒效法儿子的形像，让基督在众多弟兄中居首位。"),
        ("called ... justified ... glorified", "保罗用一连串过去式概述神救恩的确定性：从预定到得荣耀都在神的行动中稳固。"),
        ("If God is for us", "若神站在我们这一边，没有敌对力量能最终成功反对我们。"),
        ("did not spare his own Son", "神已经赐下最宝贵的儿子，因此信徒可确信他必连同基督赐下所需的一切。"),
        ("bring any charge", "神拣选并称义的人，谁能提出最终有效的控告？法庭图像强调神的判决。"),
        ("who is to condemn", "基督已死、复活、在神右边代求，因此没有定罪能推翻他的救赎工作。"),
        ("separate us", "苦难、逼迫和匮乏不能把信徒从基督的爱中割开。"),
        ("for your sake", "诗篇引文承认神子民会受苦；苦难并不证明他们被神遗弃。"),
        ("more than conquerors", "信徒不是靠环境轻松得胜，而是藉爱我们的基督，在患难中获得压倒性的胜利。"),
        ("neither death nor life", "保罗列举各种宇宙、属灵与时间性的力量，宣告没有任何受造物能隔绝神在基督里的爱。"),
        ("love of God", "全章以神在基督耶稣里的爱收束；这爱是信徒盼望、忍耐和确据的根基。"),
    ],
    9: [
        ("great sorrow", "保罗面对同胞以色列人的不信，并不冷漠；他以持续的忧伤开始这段论证。"),
        ("accursed and cut off", "这是极强的代求式表达：保罗宁愿自己受咒诅，只为同胞得益，显出深切爱心。"),
        ("Israelites", "保罗列出以色列的特权：儿子名分、荣耀、诸约、律法、敬拜和应许都属于他们。"),
        ("Christ ... God over all", "按肉身基督出自以色列；保罗随即以颂赞宣告他的至高地位。"),
        ("word of God has not failed", "以色列多数不信不表示神的应许落空，因为“以色列”须按神拣选的应许来理解。"),
        ("not all ... Israel", "外在血统与属应许的真以色列并不完全等同，保罗开始区分自然后代和应许后代。"),
        ("through Isaac", "神所应许的后裔线不是由人的自然繁衍决定，而是经过以撒的应许之线。"),
        ("children of the promise", "真正算为后裔的是神以应许生出的儿女，而不是单凭肉身的儿女。"),
        ("at this time", "以撒的出生来自神明确的应许和时间安排，突显救恩首先是神的行动。"),
        ("Rebecca ... conceived", "保罗再举利百加双子为例，进一步说明拣选不建立在人的表现或出生顺序上。"),
        ("not because of works", "在两个孩子尚未行善作恶之前，神的拣选目的已经显明，根基在呼召者而不在行为。"),
        ("The older will serve", "神反转通常的长子优先顺序，显示他的恩典拣选不受人类惯例限制。"),
        ("Jacob I loved", "玛拉基书的引文以雅各和以扫的历史来说明神拣选的自由与审判的严肃。"),
        ("Is there injustice", "保罗预见道德质疑：若神自由拣选，他是否不公？答案绝对是否定的。"),
        ("I will have mercy", "神向摩西的话表明怜悯源于神的主权恩典，不是人可以索取的权利。"),
        ("not on human will", "人的意愿和努力不能使神欠他怜悯；救恩的起点是怜悯的神。"),
        ("raised you up", "法老的例子说明神可在反抗者的历史中彰显能力，使自己的名传遍天下。"),
        ("mercy on whomever", "本节总结神的自由：他施怜悯，也任凭顽梗；这不是任性，而是圣洁主权。"),
        ("Why does he still find fault?", "保罗再次提出反对意见：若神旨意不可抗拒，人怎能仍被责备？"),
        ("Who are you, O man?", "受造者不能以审判者姿态质问造物主；陶匠与泥土的比喻强调神与人的位分差异。"),
        ("right over the clay", "陶匠有权按自己的旨意用同一团泥作不同器皿，保罗使用旧约图像论神的权柄。"),
        ("vessels of wrath", "保罗谨慎地用假设句说明神忍耐预备受审判的器皿，同时显明忿怒和权能。"),
        ("riches of his glory", "神显出荣耀的丰富在蒙怜悯的器皿上；怜悯不是偶然，而是为荣耀预备的。"),
        ("not from the Jews only", "蒙召者来自犹太人和外邦人，神的怜悯跨越民族边界。"),
        ("not my people", "何西阿书原本对北国的应许，如今说明神能称外邦人为“我的子民”。"),
        ("sons of the living God", "原先“不蒙爱”的人被称为永生神的儿子，强调身份完全由神的呼召改变。"),
        ("only a remnant", "以赛亚预言即使以色列人数如海沙，最终得救的仍是神所保守的余数。"),
        ("will carry out his sentence", "主对地上的审判既公义又决定性；保罗用此解释不信的严重后果。"),
        ("unless ... left us offspring", "若非神保留后裔，以色列早已如所多玛蛾摩拉一样完全毁灭；存留本身就是恩典。"),
        ("attained righteousness", "未追求律法的外邦人因信得到义，显示神的救恩道路出人意外。"),
        ("did not succeed", "以色列热心追求律法之义却未达到，因为追求方式出了问题。"),
        ("as if it were based on works", "关键不是律法本身，而是把律法当作赚取义的途径，因而在基督这块石头上跌倒。"),
        ("stone of stumbling", "旧约把弥赛亚比作房角石，也可能成为绊脚石；信靠他的人不会羞愧。"),
    ],
    10: [
        ("heart's desire and prayer", "保罗对以色列的结论仍以祷告和救恩的愿望开始，神学论证不取代爱与代求。"),
        ("zeal for God", "以色列有热心，却不是按真知识；热心若脱离神所启示的义，仍会走错方向。"),
        ("their own", "不知道神所赐的义而试图建立自己的义，就是拒绝顺服神的救恩方式。"),
        ("Christ is the end of the law", "end 可指终点、目标和成全：基督完成律法所指向的目的，使信的人得义。"),
        ("does the commandments", "摩西的原则说明律法道路要求完全实行；它不能成为罪人自我建立义的基础。"),
        ("righteousness based on faith", "信心的义不要求人把基督带下来或从死人中带上来，因为基督已完成救恩。"),
        ("Do not say in your heart", "保罗借申命记的语言拒绝不可能的宗教努力；救恩并非人攀登天路的成就。"),
        ("bring Christ up", "基督已从死人中复活，所以人不必以自己的努力制造或重演救恩。"),
        ("word is near you", "信心的信息近在口中和心里，强调福音可听、可宣认、可相信。"),
        ("confess ... believe", "救恩的回应包含公开承认耶稣为主和内心相信神叫他从死里复活。"),
        ("with the heart", "心里的信导致称义，口里的承认表达得救的信；两者是同一信心的内外维度。"),
        ("will not be put to shame", "以赛亚的应许适用于每一位相信的人；信靠基督不会以最终羞愧告终。"),
        ("no distinction", "犹太人与希腊人没有救恩地位的区别；同一位主厚赐给所有呼求他的人。"),
        ("everyone who calls", "约珥书的应许以“每一个”打开福音邀请：真诚呼求主名的人必得救。"),
        ("How then will they call", "四个连续问句展示宣教逻辑：呼求需要相信，相信需要听见，听见需要传道者。"),
        ("beautiful are the feet", "以赛亚的图像称赞传好消息者；“脚”代表他们奔走传扬福音的使命。"),
        ("not all obeyed", "听见福音并不自动产生信心；以赛亚早已哀叹人对所传之道的不信。"),
        ("faith comes from hearing", "信心产生于听见，而听见藉着基督的话；这凸显清楚传讲福音的重要性。"),
        ("their voice has gone out", "保罗用诗篇中创造普遍见证的语言，说明福音信息已经广传，不信并非没有听闻。"),
        ("Did Israel not understand?", "第二个问题转向理解：以色列是否因不明白福音的普世性而有借口？"),
        ("not a nation ... disobedient", "摩西预告神借外邦人激发以色列嫉妒；以赛亚同时宣告外邦人被寻见，而以色列仍悖逆顶撞神。"),
    ],
    11: [
        ("Has God rejected his people?", "保罗以“绝不可能”回答；他自己身为亚伯拉罕后裔、便雅悯支派的人，就是神仍保留以色列百姓的证据。"),
        ("foreknew", "神并未弃绝他预先所认识的百姓；以利亚故事将说明神保留余数的方式。"),
        ("I alone am left", "以利亚以为自己孤单，向神控诉以色列的偶像崇拜与逼迫。"),
        ("seven thousand", "神保留了七千未向巴力屈膝的人；神的余数常超出人眼所能见。"),
        ("remnant, chosen by grace", "如今也有按恩典拣选的余数；余数的存在根基是神的恩典。"),
        ("no longer on the basis of works", "恩典若以行为为基础就不再是恩典；保罗保持两种原则不可混合的区别。"),
        ("the elect obtained it", "以色列所追求的义，蒙拣选者得着，其余的人却在不信中刚硬。"),
        ("spirit of stupor", "旧约引文描述神对持续悖逆的审判性任凭：眼看不见、耳听不见。"),
        ("table become a snare", "大卫的诗篇被用来祈求审判：原该为福分的桌席，因悖逆竟成为陷阱。"),
        ("bend their backs", "弯腰图像描写审判下持续的重压，表达不信并非轻微问题。"),
        ("Did they stumble in order to fall?", "他们跌倒不是最终、无可挽回的毁灭；神借此使救恩临到外邦人，也借外邦人的蒙恩激发以色列回转。"),
        ("riches for the world", "若以色列的过失已带来外邦人的丰富，保罗期待他们完全归回时更大的祝福。"),
        ("magnify my ministry", "保罗对外邦人说话，却珍视自己的外邦使命，因为这使命也可能激发同胞得救。"),
        ("their rejection", "以色列被暂时搁置带来世界与神和好；他们被接纳将如“死而复生”般伟大。"),
        ("firstfruits ... root", "初熟果子和根的比喻表明：若起头和根是圣的，连带的面团和枝子也带着圣约归属。"),
        ("wild olive shoot", "外邦信徒像野橄榄枝被接在以色列的橄榄树上，分享祖先之根的丰盛。"),
        ("do not be arrogant", "被接上的外邦枝子不可向原枝夸口；枝子不是托住根，而是根托住枝子。"),
        ("Branches were broken off", "保罗先准确复述外邦人可能的想法：原枝被折下，好让野枝接上；下一节会校正其中的骄傲。"),
        ("they were broken off", "保罗承认不信的枝子被折下，却警告外邦人：他们站立是因信，应当敬畏。"),
        ("kindness and severity", "神的严厉临到跌倒者，恩慈临到持续在恩慈中的人；这不是轻忽信心的道德呼唤。"),
        ("grafted in", "以色列人若不持续不信，神有能力把他们重新接回自己的橄榄树。"),
        ("contrary to nature", "外邦枝子尚且被接入好橄榄树，原本的枝子更有可能被接回自己的树。"),
        ("mystery", "保罗揭示神先前隐藏的计划，防止外邦信徒自以为聪明、自高自大。"),
        ("partial hardening", "以色列的刚硬是部分且有期限的，直到外邦人的数目满足。"),
        ("all Israel will be saved", "保罗把以色列未来的拯救连于救主从锡安而来、除去雅各不敬虔的旧约应许。"),
        ("when I take away", "赦除罪是神与他们所立之约的核心；拯救不只是民族复兴，而是罪得除去。"),
        ("enemies for your sake", "就福音而言他们现今敌对，外邦因此得益；就拣选而言仍因列祖蒙爱。"),
        ("irrevocable", "神的恩赐和呼召不反悔；他的信实支撑保罗对以色列未来的盼望。"),
        ("now received mercy", "外邦人昔日不顺服，如今因以色列不顺服而蒙怜悯，这改变了他们看待他人的姿态。"),
        ("may now receive mercy", "以色列的不顺服并非神故事的最后一句；神的目的仍是使他们也领受怜悯。"),
        ("consigned all to disobedience", "神容许所有人显明在不顺服之下，为要显明怜悯并无人可自夸。"),
        ("depth of the riches", "保罗从论证转为敬拜：神的智慧、知识、判断和道路深不可测。"),
        ("Who has known", "以赛亚的反问提醒读者：没有人能成为神的顾问，向他提供缺少的知识。"),
        ("given a gift to him", "约伯记的语言否定人与神交易的想法：没有人先施恩使神必须偿还。"),
        ("from him and through him", "万有以神为源头、藉神得以维系、并归向神为终局；因此荣耀单单归他。"),
        ("to him be glory", "doctrinal argument 最终落在敬拜：一切荣耀归给神，直到永远。"),
    ],
}


VOCAB = {
    "law": ("n.", "律法"), "released": ("v.", "被释放；解除约束"), "flesh": ("n.", "肉体；受罪支配的人性状态"),
    "sin": ("n.", "罪"), "commandment": ("n.", "诫命"), "deceived": ("v.", "欺骗"),
    "holy": ("adj.", "圣洁的"), "righteous": ("adj.", "公义的；义的"),
    "condemnation": ("n.", "定罪"), "Spirit": ("n.", "圣灵"), "adoption": ("n.", "儿子的名分；收纳为儿女"),
    "heirs": ("n.", "后嗣；承受产业的人"), "suffering": ("n.", "苦难"), "creation": ("n.", "受造界"),
    "groaning": ("n.", "叹息；难以言喻的呻吟"), "hope": ("n.", "盼望"), "intercedes": ("v.", "代求"),
    "predestined": ("v.", "预定"), "glorified": ("v.", "得荣耀"), "justified": ("v.", "被称义"),
    "separate": ("v.", "使隔绝；分离"), "Israelites": ("n.", "以色列人"), "covenants": ("n.", "诸约"),
    "promise": ("n.", "应许"), "mercy": ("n.", "怜悯"), "harden": ("v.", "使刚硬"),
    "remnant": ("n.", "余数；神保守的少数人"), "circumcision": ("n.", "割礼"), "zeal": ("n.", "热心"),
    "confess": ("v.", "承认；公开宣认"), "proclaim": ("v.", "传扬"), "grafted": ("v.", "接枝"),
    "olive": ("n.", "橄榄树"), "arrogant": ("adj.", "骄傲自大的"), "mystery": ("n.", "奥秘；神先前隐藏而今启示的计划"),
    "irrevocable": ("adj.", "不撤回的；不反悔的"), "disobedience": ("n.", "不顺服"),
}


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗藉问题推进辩论；问题常预备紧随其后的否定、答案或福音结论。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 提出一面的事实，so 推出相应结果；注意比较或救恩历史的平行结构。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出条件、假设或反例；留意条件如何服务保罗整体的论证，而非孤立解释。"
    if lower.startswith("for "):
        return "For 理由连接", "For 说明前文的根据、原因或进一步解释；读时要把本节与上一节连起来。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把前面的神学事实推向结论、问题或实际回应。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定错误道路或身份，再用 but 指出真正的福音事实；这是保罗常用的校正句型。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 显出转折、例外或反差；转折前后的信息必须一起把握。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气要求具体回应；将命令放回前文神已成就的恩典和新身份中理解。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为人物、事物或真理补充身份与内容；先找其所修饰的中心名词。"
    return "主句与修饰成分", "先辨认主语和主要动词，再处理并列、介词短语和分词结构，跟上保罗的推理。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    matches = [
        {"word": word, "ipa": "", "pos": pos, "meaning": meaning}
        for word, (pos, meaning) in VOCAB.items()
        if word.lower() in lower
    ][:2]
    if matches:
        return matches
    words = [w.strip(".,;:!?\"'“”()��") for w in text.split()]
    word = next((w for w in words if len(w) >= 7), words[0])
    return [{"word": word.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合本段论证和 ESV 语境理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Romans"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Romans")
    for chapter in range(7, 12):
        source = filter_chapter(verses, chapter)
        assert len(source) == len(NOTES[chapter]), (chapter, len(source), len(NOTES[chapter]))
        payload = {}
        for item in source:
            verse = int(item["verse"])
            phrase, explanation = NOTES[chapter][verse - 1]
            title, detail = grammar(clean_verse_text(str(item["text"])))
            payload[str(verse)] = {
                "vocab": vocabulary(clean_verse_text(str(item["text"]))),
                "grammar": [{"title": title, "detail": detail}],
                "expression": [{"phrase": phrase, "note": explanation}],
                "translation": "",
            }
        write_json(output / f"{chapter}.json", payload)
        print(f"Romans {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
