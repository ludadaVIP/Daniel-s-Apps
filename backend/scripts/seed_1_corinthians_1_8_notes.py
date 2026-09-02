"""Write static, verse-level Bible and Eng notes for 1 Corinthians 1–8 (ESV)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


NOTES = {
    1: [
        ("called by the will of God", "保罗以神的呼召界定自己的使徒职分，并提及同工所提尼；权柄来自神而非派系。"),
        ("sanctified in Christ", "哥林多教会虽问题重重，仍先被称为在基督里成圣、蒙召为圣徒的人。"),
        ("Grace to you and peace", "恩典与平安来自父神和主耶稣基督，是保罗处理教会问题的福音起点。"),
        ("I give thanks", "保罗先为神在他们身上的恩典感谢，而不是先以责备定义这间教会。"),
        ("enriched in him", "他们在言语和知识上富足；属灵恩赐本是基督恩典的果子，不是自夸资本。"),
        ("testimony about Christ", "他们的恩赐证实基督的见证在其中得以坚固。"),
        ("not lacking in any gift", "教会等候主再来期间并不缺少恩赐，提醒恩赐有末世等候的目的。"),
        ("sustain you to the end", "坚固信徒到底的是神，使他们在主耶稣的日子无可责备。"),
        ("God is faithful", "信徒蒙召进入与神儿子相交，根基是信实的神，不是人的稳定性。"),
        ("that all of you agree", "保罗开始处理分党：他呼吁言语一致，拒绝教会中破裂的派别。"),
        ("quarreling among you", "革来氏家里的人报告争竞；保罗直接说明问题来源，而非忽略冲突。"),
        ("I follow Paul", "以属灵领袖为旗号的口号显示教会把福音传道人变成了身份标记。"),
        ("Is Christ divided?", "连续问句揭露荒谬：基督不可被分割，保罗也未为他们钉十字架或使他们归入自己。"),
        ("I thank God", "保罗感谢自己只给少数人施洗，避免人误以为洗礼使他们属于某位传道人。"),
        ("in the name of Paul", "洗礼的“名”表明归属；信徒受洗归入基督，绝不归入保罗。"),
        ("household of Stephanas", "保罗谨慎补充记忆，强调他不是在建立自己的施洗名单。"),
        ("not sent me to baptize", "保罗并非贬低洗礼，而是说明其主要使徒使命是传福音，免得十字架被人的技巧掏空。"),
        ("word of the cross", "十字架的信息对走向灭亡者是愚拙，对得救者却显为神的大能。"),
        ("destroy the wisdom", "以赛亚引文宣告神会挫败自恃的智慧，预备十字架对人类智慧的颠覆。"),
        ("where is the wise", "保罗连问哲学家、文士、辩士在哪里；神已经显明世界的智慧不能认识他。"),
        ("through the folly", "神乐意借人看似愚拙的福音宣讲拯救相信的人。"),
        ("signs ... wisdom", "犹太人求神迹、希腊人寻智慧，保罗却传钉十字架的基督。"),
        ("stumbling block", "十字架令犹太人跌倒、令外邦人看为愚拙，却正是神所召之人的能力与智慧。"),
        ("Christ the power", "对蒙召者而言，基督本人就是神的能力和智慧，不是可供选择的思想系统。"),
        ("foolishness of God", "神看似愚拙的作为仍远超人类智慧；看似软弱的作为胜过人力。"),
        ("consider your calling", "哥林多信徒的社会组成证明神没有按世俗智慧、权势和出身来拣选人。"),
        ("chose what is foolish", "神拣选世人看为愚拙和软弱的，使自以为聪明、强大的人羞愧，反转世俗的尺度。"),
        ("things that are not", "神拣选卑微、被轻看的，废去自以为“是”的，叫人不能自夸。"),
        ("no human being might boast", "神的拣选方式关上人在他面前夸口的门。"),
        ("because of him", "信徒在基督里完全出于神；基督成为我们的智慧、公义、圣洁和救赎。"),
        ("Let the one who boasts", "结论引用耶利米书：若要夸口，只能夸主所成就的事。"),
    ],
    2: [
        ("not ... lofty speech", "保罗初到哥林多没有靠炫目的修辞或哲学展示，而是宣讲神的见证。"),
        ("Jesus Christ and him crucified", "他的决定性焦点是钉十字架的基督，十字架不是信息中的附属主题。"),
        ("weakness and fear", "保罗坦承人性的软弱，防止教会把他的果效归因于个人魅力。"),
        ("demonstration of the Spirit", "福音的说服力在于圣灵和能力的工作，而不是人的智慧言辞。"),
        ("not rest in wisdom", "信心应建立在神的能力上，而非传道者的论证技巧或文化地位。"),
        ("wisdom among the mature", "保罗并非反智；他宣讲一种属神、给成熟者的智慧，却不同于今世终将过去的掌权者之智慧。"),
        ("secret and hidden", "神的智慧曾隐藏，如今在福音中启示，是神在万世以前为我们得荣耀所定的。"),
        ("Lord of glory", "若今世掌权者真正明白神的智慧，就不会把荣耀之主钉十字架。"),
        ("What no eye has seen", "神为爱他的人预备的远超自然感官和人心能自发设想的范围。"),
        ("revealed ... through the Spirit", "神藉圣灵启示这些事，因为圣灵探究神深奥的事。"),
        ("thoughts of a person", "人的内在思想只有人的灵知道；同理，神深处的事只有神的灵知道。"),
        ("Spirit who is from God", "信徒领受圣灵，为要知道神白白赐给他们的恩典。"),
        ("words not taught", "使徒所传不靠人类智慧所教的词汇，而是由圣灵教导、解释属灵的事。"),
        ("natural person", "未领受圣灵的人不能接受属神之灵的事，因为这些事只能属灵地辨明。"),
        ("judges all things", "属灵的人能按圣灵辨明万事，却不能被仅按属世标准的人作终极判断。"),
        ("mind of the Lord", "没有人能作神的顾问；然而信徒在与基督联合中领受“基督的心”。"),
    ],
    3: [
        ("people of the flesh", "保罗称他们为属肉体、在基督里仍如婴孩，不是说他们不属基督，而是指出不成熟。"),
        ("milk, not solid food", "属灵婴孩需要基础教导；他们的争竞表明仍不能承受更成熟的教导。"),
        ("jealousy and strife", "嫉妒和纷争是属肉体生活的可见证据，不能与属灵成熟并存。"),
        ("merely human", "以“属保罗”“属亚波罗”划分，正按世俗的领导者竞争逻辑行事。"),
        ("servants through whom", "保罗和亚波罗只是主所分派的仆人；他们的角色是帮助人相信，不是成为派别中心。"),
        ("God gave the growth", "栽种与浇灌是真实劳动，但生命成长完全由神赐下。"),
        ("only God", "人的事工者不应被神化；决定性的是使生命成长的神。"),
        ("one", "栽种和浇灌者在同一使命中合一，却会按各人的劳苦从神领受赏赐。"),
        ("God's fellow workers", "同工属于神；教会既是神的田地，也是神正在建造的房屋。"),
        ("wise master builder", "保罗按所赐恩典立下根基；后来的人必须谨慎在其上建造。"),
        ("no one can lay", "唯一根基是耶稣基督；任何教会建造都不能以人格、潮流或成就替代他。"),
        ("gold, silver", "不同材料代表不同质量的建造工作；有价值与易毁坏的事工会在终日显明。"),
        ("Day will disclose", "末日的火要试验每人工作，不是凭表面成功，而按神的检验。"),
        ("receive a reward", "经得起检验的建造者得赏赐，说明神严肃看待服事质量。"),
        ("suffer loss", "工作被烧毁者会损失赏赐，但本人仍可得救，如同从火中经过。"),
        ("God's temple", "教会整体是神的圣殿，圣灵住在其中，因此教会合一极其神圣。"),
        ("destroy God's temple", "破坏神教会的人面对神严肃的审判；此处直接针对分裂和破坏。"),
        ("become a fool", "若要真正有智慧，须放下今世自夸的智慧，在神面前承认其愚拙。"),
        ("catches the wise", "约伯记说明神使聪明人的诡计反制他们自己。"),
        ("thoughts of the wise", "诗篇宣告主知道人的思想虚妄，拆毁以智慧自夸的基础。"),
        ("let no one boast in men", "因此不可为传道人夸口；属灵领袖不是信徒彼此竞争的资产。"),
        ("all are yours", "保罗、亚波罗、矶法、世界、生死、现在将来都在基督里为教会益处，而非派别私产。"),
        ("you are Christ's", "正确的归属次序是：万有为信徒，信徒属基督，基督属神。"),
    ],
    4: [
        ("servants of Christ", "使徒应被看作基督的仆役、神奥秘的管家，而不是派系领袖。"),
        ("found faithful", "管家最首要的要求不是受欢迎或显赫，而是忠心。"),
        ("very small thing", "保罗不以哥林多人或自己为最终审判者；人的评断有限。"),
        ("I am not aware", "良心无亏不等于自动称义，只有主能作最终宣判。"),
        ("judge nothing before", "不要抢在主来以前作最终判断；他会显明隐藏的动机，并按真相称赞。"),
        ("not go beyond", "保罗把原则应用在自己和亚波罗身上，叫他们不超过经上所写，免得为一人自高。"),
        ("what do you have", "一切所有皆为领受，故没有空间如同自得般自夸。"),
        ("Already you have", "一连串讽刺显示哥林多人自以为已经丰富、作王，却忽略使徒受苦的现实。"),
        ("last of all", "使徒好像被陈列给世界观看、注定受死的人，反映十字架式的事奉。"),
        ("fools for Christ", "保罗以尖锐对比讽刺教会自满：他们自觉聪明强盛尊贵，使徒却被看作愚弱卑贱。"),
        ("to the present hour", "使徒经历饥渴、赤身、挨打和漂泊，挑战把成功当作属灵成熟的标准。"),
        ("when reviled", "使徒遭辱骂仍祝福，受逼迫仍忍耐，被毁谤仍温和回答，效法基督。"),
        ("scum of the world", "保罗直言使徒被社会视为渣滓，却不以此否定神的呼召。"),
        ("beloved children", "严厉话语的目的不是羞辱，而是以父亲般的爱警戒属灵儿女。"),
        ("not many fathers", "即使有许多导师，福音中使他们得生命的属灵父亲却不多。"),
        ("imitators of me", "保罗呼吁效法他，是因他的生活模式与所传的十字架福音一致。"),
        ("my ways in Christ", "提摩太将提醒他们保罗在各教会一致的基督里生活和教导。"),
        ("some are arrogant", "有人以为保罗不会来，因而骄傲；保罗预备以实际行动处理问题。"),
        ("if the Lord wills", "保罗若主许可就会到访，并要察验骄傲者真实的能力，而不只听他们的言谈。"),
        ("not talk but power", "神的国不在空洞言辞，而在能改变生命、施行纪律的属灵能力。"),
        ("rod ... spirit of gentleness", "保罗让教会选择：悔改可带来温柔探访，持续骄傲则需严肃管教。"),
    ],
    5: [
        ("sexual immorality", "教会中有严重乱伦，连外邦社会也不认可；保罗指责他们竟仍自高。"),
        ("let him be removed", "合宜反应是哀痛并实行纪律，将持续犯罪者从团契中除去。"),
        ("present in spirit", "保罗虽不在场，却以使徒权柄在灵里作出判断。"),
        ("when you are assembled", "教会要在主耶稣的名里聚集，并倚靠主的能力共同实行纪律，而非私下报复。"),
        ("delivered to Satan", "在主耶稣名里把人交到教会外的属世领域，为使肉体受毁坏、灵在主日得救，纪律有恢复目的。"),
        ("your boasting is not good", "对罪的容忍不能与属灵自豪并存；保罗用面酵说明罪会扩散。"),
        ("a little leaven", "少量面酵能使全团发起，说明公开且不悔改的罪会污染整个教会。"),
        ("Christ, our Passover lamb", "逾越节背景使教会成为新团；基督已被献祭，因此旧酵必须除去。"),
        ("sincerity and truth", "节期不是外在仪式，而是以真诚和真理的无酵生活庆祝基督的救赎。"),
        ("not at all meaning", "保罗澄清不是叫信徒逃离世上一切不信者，否则必须离开世界。"),
        ("bears the name", "若自称弟兄者持续在明显罪中，教会不可把他当作正常团契成员，甚至不可同席。"),
        ("judge outsiders", "教会不被托付审判世界；神审判外面的人，教会却要处理自己里面公开的罪。"),
        ("purge the evil", "申命记的用语命令教会除去恶人，维护基督身体的圣洁。"),
    ],
    6: [
        ("before the unrighteous", "信徒彼此争讼竟带到不信法庭，保罗质问他们为何不让圣徒处理可处理的纠纷。"),
        ("saints will judge", "末世身份意味着圣徒将参与审判世界；因此应有处理今生小事的智慧。"),
        ("judge angels", "保罗以更大的将来责任论证：何况今生生活事务。"),
        ("those who have no standing", "把教会内部纠纷交给外面的人，讽刺地显示他们未按教会身份行事。"),
        ("wise man among you", "哥林多自夸智慧，保罗反问难道没有一人能在弟兄之间作公正判断。"),
        ("brother goes to law", "争讼已发展为弟兄对弟兄，并在不信者面前进行，损害福音见证。"),
        ("Why not rather suffer", "宁愿受亏损的反问挑战权利至上的逻辑，呼召十字架式的舍己。"),
        ("you yourselves wrong", "事实上他们反倒伤害和欺负弟兄，显示真正问题不只是程序而是罪。"),
        ("will not inherit", "持续不悔改的恶行与神国不相容；保罗列举生活方式，不是给人比较罪的清单。"),
        ("nor thieves", "这份清单延续到贪婪、醉酒、辱骂和欺诈，表明不义的生活方式不能承受神国。"),
        ("such were some of you", "福音带来真实转变：他们曾如此，如今却在主名和圣灵里洗净、成圣、称义。"),
        ("All things are lawful", "保罗引用或回应哥林多口号：自由不可变为无益或使人受任何事辖制。"),
        ("food is meant", "食物和肚腹都是暂时的；身体却不是为淫乱，乃是为主，主也关乎身体。"),
        ("raise us up", "神使主复活，也要用能力使我们的身体复活，身体因此有永恒的重要性。"),
        ("members of Christ", "信徒的身体属于基督，绝不可把基督的肢体与妓女结合。"),
        ("one body", "创世记的“二人成为一体”说明性结合具有深刻的身体与盟约意义。"),
        ("one spirit", "与主联合的人在灵里与他成为一，构成逃避淫乱的积极身份理由。"),
        ("Flee from sexual immorality", "命令是逃离而非试探边缘；淫乱特别涉及人的身体，破坏身体的圣洁用途。"),
        ("temple of the Holy Spirit", "个人身体是内住圣灵的殿，信徒不属于自己。"),
        ("bought with a price", "基督的救赎代价确立身体的归属，因此要用身体荣耀神。"),
    ],
    7: [
        ("good ... not to have", "保罗回应来信中的口号；他肯定独身的价值，却即刻处理淫乱的现实压力。"),
        ("each man ... own wife", "因性试探现实存在，婚姻是神所设立、合宜的性关系场所。"),
        ("give to his wife", "夫妻之间的身体关系是相互的责任，不是单向权利。"),
        ("does not have authority", "婚姻中双方以互惠方式看待身体，挑战自我中心的占有观。"),
        ("do not deprive", "不可长期拒绝配偶，除非双方同意、暂时专心祷告，随后仍要同房以免受试探。"),
        ("concession, not a command", "保罗区分牧养性的许可与普遍命令，显示如何谨慎处理具体处境。"),
        ("each has his own gift", "独身和婚姻都可视为神所赐的恩赐，不宜以一种状态轻看另一种。"),
        ("unmarried and widows", "保罗认为若能如他一般独身是好的，既为主事奉提供自由，也不是强制。"),
        ("cannot exercise self-control", "若不能自守，就应结婚；婚姻优于被情欲持续焚烧。"),
        ("not I, but the Lord", "对已婚者，保罗传递主已教导的原则：妻子不可离开丈夫。"),
        ("remain unmarried", "若发生分离，应寻求和好或保持未婚；丈夫也不可离弃妻子。"),
        ("I, not the Lord", "这里不是低权威，而是主耶稣在地上未直接处理的混合婚情形，保罗以使徒智慧教导。"),
        ("consents to live", "信主者若有不信配偶愿继续共同生活，不应主动离婚。"),
        ("made holy", "不信配偶因与信徒的约关系被分别在特殊影响范围中；不是自动得救，儿女也因此被视为圣洁。"),
        ("not enslaved", "若不信者坚持离开，信徒不受捆绑；神呼召我们在和平中生活。"),
        ("How do you know", "不应把留在婚姻中当作拯救配偶的保证，却仍可在盼望与忠心中见证。"),
        ("assigned to him", "总原则：各人可在主所分派、所召的处境中忠心生活，不必以外在改变证明属灵。"),
        ("called circumcised", "割礼状态不应成为焦虑；福音不要求人以外在记号重新定义身份。"),
        ("keeping the commandments", "真正重要的是守神诫命，不是割礼或未受割礼的社会标识。"),
        ("remain in the condition", "信主的呼召改变人对处境的服事方式，却不必要求立即改变每一个社会身份。"),
        ("do not be concerned", "奴仆身份不废除在主里的自由；若可合法得自由，则可把握机会。"),
        ("freedman of the Lord", "在主里蒙召的奴仆是主的自由人；自由人蒙召则是基督的仆人，十字架重置身份。"),
        ("bought with a price", "既被基督买赎，不要再作人的奴仆，即不让人的控制决定终极忠诚。"),
        ("with God", "无论何种处境，核心是“与神同在”；这比外在阶层变化更根本。"),
        ("no command from the Lord", "论童身者，保罗再次区分无直接主命令与自己作为蒙怜悯忠心者的判断。"),
        ("present distress", "因当时特别艰难的处境，保罗认为维持现状较好；原则与具体环境有关。"),
        ("not seek to be free", "已婚者不可借属灵理由摆脱婚约；未婚者也不必焦虑地追求婚姻。"),
        ("have not sinned", "结婚不是罪，保罗并不贬低婚姻；他只是体谅婚姻在患难时期会有实际忧虑。"),
        ("appointed time", "末世紧迫感要求信徒不把暂时处境当最终现实，保持自由的心。"),
        ("as though they had none", "保罗不是否定婚姻、悲伤、喜乐、财物，而是说这些不能占据终极地位。"),
        ("passing away", "现今世界的样式正在过去，故信徒应以永恒视角使用世界。"),
        ("free from anxieties", "独身者能更直接专注主的事，这解释保罗的牧养性建议。"),
        ("how to please the Lord", "未婚者的关切可较少分散，目标是讨主喜悦。"),
        ("divided interests", "婚姻的正常责任使已婚者关心配偶和家庭；保罗承认这不是罪，而是现实。"),
        ("secure undivided devotion", "保罗的建议为信徒益处，不是设圈套，目标是端正、专一服事主。"),
        ("let them marry", "若父亲判断女儿适婚且有需要，应让她结婚；婚姻不是罪。"),
        ("will do better", "在可自由选择、能坚守独身并出于合宜动机时，保罗认为不嫁也可更合适于当时处境。"),
        ("bound ... as long", "婚约在配偶活着时具有约束力；配偶去世后才有再婚自由。"),
        ("only in the Lord", "再婚必须在主里，即与属主者结合并服从基督的主权。"),
        ("happier if she remains", "保罗给出自己的判断，认为寡妇留在独身状态在当时可能更有益，并确信自己有神的灵。"),
    ],
    8: [
        ("knowledge puffs up", "保罗回应祭偶像之物：知识若脱离爱会使人自高，爱却建立教会。"),
        ("does not yet know", "自以为已完全知道的人，尚未按应有方式认识；真知识带着谦卑。"),
        ("known by God", "爱神的人已被神认识，关系先于自我夸耀的知识。"),
        ("no real existence", "偶像本身不是神，除独一真神外没有别神；这是基督徒自由的神学基础。"),
        ("many gods", "社会文化虽称许许多多神明和主宰，保罗承认这种语言的现实影响。"),
        ("one God ... one Lord", "基督徒信仰告白：万物本于父神、我们归于他；万物也借着主耶稣基督而有，我们借着他得生命。"),
        ("not all possess", "不是所有信徒都有这种自由的认知；有些人因旧日偶像经验，良心仍会受伤。"),
        ("food will not commend", "食物本身不增加或减少我们在神面前的地位，故不可把饮食当作属灵等级。"),
        ("this right ... stumbling", "拥有正确知识和自由的人须谨慎，免得自己的权利成为软弱者跌倒的原因。"),
        ("emboldened", "软弱者看见有知识者在偶像庙坐席，可能违背良心仿效而吃。"),
        ("brother for whom Christ died", "错误使用自由会毁坏基督为之死的弟兄；弟兄的价值远超一餐食物。"),
        ("sinning against Christ", "伤害弟兄软弱的良心不仅是人际失误，也是得罪基督。"),
        ("never eat meat", "爱使保罗愿意永久放弃可行的自由，若这能避免使弟兄跌倒。"),
    ],
}


VOCAB = {
    "apostle": ("n.", "使徒；奉差遣者"), "sanctified": ("adj.", "成圣的；被分别归神的"),
    "grace": ("n.", "恩典"), "fellowship": ("n.", "相交；团契"), "quarreling": ("n.", "争竞"),
    "cross": ("n.", "十字架"), "wisdom": ("n.", "智慧"), "foolishness": ("n.", "愚拙"),
    "boast": ("v.", "夸口"), "Spirit": ("n.", "圣灵"), "mature": ("adj.", "成熟的"),
    "revealed": ("v.", "启示；显明"), "natural": ("adj.", "属血气的；未受圣灵引导的"),
    "jealousy": ("n.", "嫉妒"), "strife": ("n.", "纷争"), "servants": ("n.", "仆人；服事者"),
    "foundation": ("n.", "根基"), "temple": ("n.", "圣殿"), "stewards": ("n.", "管家"),
    "faithful": ("adj.", "忠心的"), "arrogant": ("adj.", "骄傲的"), "immorality": ("n.", "淫乱；性道德罪"),
    "leaven": ("n.", "酵"), "discipline": ("n.", "管教"), "lawsuit": ("n.", "诉讼"),
    "inherit": ("v.", "承受"), "justified": ("v.", "被称义"), "resurrection": ("n.", "复活"),
    "members": ("n.", "肢体；身体各部分"), "fornication": ("n.", "淫乱"), "authority": ("n.", "权柄；支配权"),
    "self-control": ("n.", "自制"), "unbeliever": ("n.", "不信者"), "circumcision": ("n.", "割礼"),
    "distress": ("n.", "艰难；困苦"), "devotion": ("n.", "委身；专心"), "widow": ("n.", "寡妇"),
    "knowledge": ("n.", "知识"), "idol": ("n.", "偶像"), "conscience": ("n.", "良心"),
    "stumbling": ("n.", "绊倒"),
}


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗常以问句揭露不合福音的推论，并引导读者接受上下文中的答案。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 引出比较或前提，so 推出相应结论；要把两边的逻辑关系读完整。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出真实条件、假设或反例；观察它如何服务保罗对教会的劝勉。"
    if lower.startswith("for "):
        return "For 理由连接", "For 将本节连回前文，说明保罗提出命令或判断的依据。"
    if lower.startswith("therefore") or lower.startswith("so ") or lower.startswith("then "):
        return "推论连接词", "Therefore / So / Then 把前面的福音事实推向实际的教会生活结论。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "保罗否定一种错误道路，再用 but 指出真正合乎基督的理解或行动。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出保罗论证中的关键反差、例外或校正。"
    if lower.startswith("let ") or lower.startswith("do not ") or lower.startswith("flee ") or " must " in lower:
        return "命令句", "祈使语气呼召实际行动；留意命令是建立在基督救赎和信徒归属之上的。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 为名词补充身份、内容、目的或结果；先找其所修饰的对象。"
    return "主句与修饰成分", "先锁定主语与主要动词，再处理并列、介词短语和分词，跟上句子的论证重点。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [{"word": word, "ipa": "", "pos": pos, "meaning": meaning}
             for word, (pos, meaning) in VOCAB.items() if word.lower() in lower][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；请结合 ESV 上下文和保罗的论证理解。"}]


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "1 Corinthians"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "1 Corinthians")
    for chapter in range(1, 9):
        source = filter_chapter(verses, chapter)
        assert len(source) == len(NOTES[chapter]), (chapter, len(source), len(NOTES[chapter]))
        payload = {}
        for index, item in enumerate(source):
            verse = int(item["verse"])
            text = clean_verse_text(str(item["text"]))
            phrase, note = NOTES[chapter][index]
            title, detail = grammar(text)
            payload[str(verse)] = {
                "vocab": vocabulary(text),
                "grammar": [{"title": title, "detail": detail}],
                "expression": [{"phrase": phrase, "note": note}],
                "translation": "",
            }
        write_json(output / f"{chapter}.json", payload)
        print(f"1 Corinthians {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
