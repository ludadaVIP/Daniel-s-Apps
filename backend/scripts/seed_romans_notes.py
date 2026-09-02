"""Write static, verse-level Bible and Eng notes for Romans 1–6 (ESV)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from apps.bible_lang.routes import clean_verse_text, filter_chapter, load_verses  # noqa: E402
from shared.io import write_json  # noqa: E402


# The entry for every verse deliberately follows Paul's argument in Romans rather
# than treating a verse as an isolated English sentence.
NOTES = {
    1: [
        ("servant ... set apart", "Paul introduces himself as Christ's servant and commissioned apostle; the gospel is the purpose that sets his life apart."),
        ("promised beforehand", "The gospel is not an innovation: God had already promised it through Israel's prophets and Scriptures."),
        ("concerning his Son", "The good news centres on God's Son, truly descended from David in his human lineage."),
        ("declared ... in power", "Resurrection publicly marks Jesus as the powerful Son of God; Paul joins his humanity, holiness, resurrection, and lordship."),
        ("obedience of faith", "Faith is not mere agreement; it produces the allegiance and obedience that honours Christ's name among all nations."),
        ("called to belong", "Roman believers are included in Christ's calling: Christian identity begins with belonging to Jesus."),
        ("Grace to you and peace", "This letter greeting names grace as God's gift and peace as its result, both flowing from Father and Son."),
        ("your faith is proclaimed", "Paul starts with thanksgiving; the Romans' faith has become publicly known beyond their own city."),
        ("God is my witness", "Paul invokes God as witness to the sincerity and constancy of his prayerful service in the gospel."),
        ("by God's will", "Paul's travel desire is placed beneath God's will, a pattern for Christian plans and prayer."),
        ("impart ... spiritual gift", "Paul hopes his visit will strengthen them; ministry is aimed at building others up, not personal reputation."),
        ("mutually encouraged", "Paul corrects any one-way picture of ministry: apostle and church will both be encouraged by shared faith."),
        ("reap some harvest", "Harvest pictures fruitful gospel ministry; Paul has repeatedly planned to visit but acknowledges providential hindrance."),
        ("under obligation", "Paul sees Greeks and non-Greeks, educated and uneducated alike as people to whom he owes the gospel."),
        ("eager to preach", "The gospel is for Christians as well as newcomers: Paul wants to establish Roman believers in it."),
        ("not ashamed ... power of God", "The gospel, though socially unimpressive, is God's effective power bringing salvation to every believer without ethnic exclusion."),
        ("righteousness of God", "God's saving righteousness is revealed in the gospel and received from beginning to end by faith; Habakkuk supplies the scriptural summary."),
        ("wrath ... suppress the truth", "God's wrath is his holy opposition to ungodliness; people actively hold down truth they know through unrighteous living."),
        ("plain to them", "Paul says knowledge of God is not unavailable: God has made what can be known evident in creation."),
        ("without excuse", "God's enduring power and divine nature are perceived in what he made, leaving humanity accountable rather than ignorant."),
        ("did not honor ... give thanks", "The root disorder is refusing worship and gratitude; it darkens thinking and turns the heart futile."),
        ("claiming to be wise", "Human claims to wisdom become folly when they reject the Creator rather than worship him."),
        ("exchanged the glory", "Idolatry is an exchange: the immortal God is traded for created images, reversing the proper order of worship."),
        ("God gave them up", "Therefore signals judicial consequence: God hands people over to the impurity their desires have chosen."),
        ("the creature rather than the Creator", "Paul identifies idolatry's central error—serving created things instead of the eternally blessed Creator."),
        ("dishonorable passions", "This continues the consequence language: refusing God's truth disorders desires and embodied relationships."),
        ("contrary to nature", "Paul describes same-sex sexual acts as contrary to God's created order and as carrying the consequences of that error."),
        ("debased mind", "A refusal to acknowledge God results in a mind unable to make sound moral judgments; thought and conduct are connected."),
        ("filled with all manner", "The vice list broadens the diagnosis beyond one sin: evil spreads through desire, relationships, speech, and social conduct."),
        ("haters of God", "Paul's compressed list includes arrogance, cruelty, and family disobedience, showing sin's reach into ordinary life."),
        ("foolish, faithless", "The final four adjectives portray broken loyalty and lovelessness—the opposite of covenant faithfulness and mercy."),
        ("give approval", "Culpability includes not only practising evil but celebrating or endorsing it in others despite knowing God's righteous decree."),
    ],
    2: [
        ("you have no excuse", "Having judged others does not make one righteous; the same standard exposes the judge who practises the same sins."),
        ("judgment of God", "God's judgment is according to truth, not appearances or a person's comparison with someone else."),
        ("will you escape", "Paul's direct question dismantles the illusion that condemning others protects a guilty judge from God."),
        ("kindness ... lead you to repentance", "God's patience is not permission to sin; its intended direction is a changed mind and life."),
        ("storing up wrath", "A hard, unrepentant heart accumulates judgment for the day when God reveals his righteous verdict."),
        ("according to his works", "God will render justly to each person; works reveal the reality and direction of a life."),
        ("patience in well-doing", "Persevering pursuit of God's glory, honour, and immortality is contrasted with self-seeking rebellion."),
        ("wrath and fury", "The but contrast makes the two paths stark: rejecting truth to obey unrighteousness brings God's judgment."),
        ("tribulation and distress", "Judgment falls on every evildoer—Jew first and Greek also—because neither group is exempt from moral accountability."),
        ("glory and honor and peace", "The corresponding promise is universal in scope as well: God rewards good without ethnic privilege."),
        ("no partiality", "This brief principle governs the entire paragraph: God does not show favouritism based on status, heritage, or knowledge."),
        ("without the law ... under the law", "Both Gentiles without Mosaic law and Jews possessing it remain answerable to God; differing light does not erase accountability."),
        ("hearers ... doers", "Merely hearing Torah cannot justify; Paul presses the law's demand for actual obedience, preparing the case that all need grace."),
        ("a law to themselves", "Gentiles sometimes do what the law requires, showing that moral awareness is not restricted to possession of the written Torah."),
        ("written on their hearts", "Conscience bears witness internally, alternately accusing and defending thoughts; it is evidence of moral knowledge, not a saviour."),
        ("secrets of men", "God's final judgment reaches hidden motives and deeds, and it comes through Christ Jesus in Paul's gospel."),
        ("rely on the law", "Paul turns to the Jew who boasts in Torah: religious privilege can become false security when it is merely possessed."),
        ("approve what is excellent", "Instruction from the law gives discernment of God's will, which increases rather than removes responsibility."),
        ("guide to the blind", "The string of metaphors states the Jew's claimed teaching role toward those without the law."),
        ("embodiment of knowledge", "Having a form or outline of truth in the law is valuable, yet it exposes the inconsistency of unpractised teaching."),
        ("do you not teach yourself?", "Rapid rhetorical questions expose hypocrisy: moral instruction addressed to others must first confront the teacher."),
        ("do you rob temples?", "Paul continues the piercing questions; outward abhorrence of idols must match inward and practical faithfulness."),
        ("dishonor God", "Boasting in Torah while breaking it turns a privilege into an occasion for dishonouring the Giver of the law."),
        ("name of God is blasphemed", "Paul cites Scripture to show the public consequence of hypocrisy: nations speak against God because of his people's conduct."),
        ("circumcision ... of value if", "The covenant sign has value only with law-keeping; the conditional clause strips away confidence in an external marker."),
        ("regarded as circumcision", "Paul's question reverses expectations: obedient Gentile conduct exposes the insufficiency of a merely physical badge."),
        ("written code and circumcision", "The Gentile who fulfils the law becomes a witness against the Jew who has Scripture and sign but breaks God's command."),
        ("merely one outwardly", "Paul distinguishes visible identity from its covenant reality; external rites alone do not make a person God's faithful people."),
        ("matter of the heart", "True Jewishness is inward and Spirit-worked, not merely letter-based; praise ultimately comes from God, not human recognition."),
    ],
    3: [
        ("what advantage", "Paul anticipates an objection: if outward marks do not justify, what value remains in Jewish privilege?"),
        ("entrusted with the oracles", "Israel's great advantage is stewardship of God's revealed words—an honour that also carries responsibility."),
        ("nullify the faithfulness", "Human unfaithfulness raises a question about God, but cannot cancel God's covenant faithfulness."),
        ("By no means", "Paul's emphatic denial preserves God's truthfulness even if every human being proves false; Psalm 51 supports the point."),
        ("what shall we say?", "Paul voices a distorted inference: can human sin make God look righteous and thus make judgment unfair?"),
        ("how could God judge", "The answer is decisive: if God could not judge sin, he could not judge the world at all."),
        ("God's truth abounds", "Paul rejects the excuse that personal lying or sin is justified because it provides a contrast for God's glory."),
        ("do evil that good may come", "Grace never authorizes evil; Paul disowns the slander and calls such reasoning justly condemnable."),
        ("all ... under sin", "The verdict embraces Jews and Greeks alike: no group has a moral advantage before God."),
        ("None is righteous", "The opening Scripture citation gives the universal verdict—no person is righteous by natural standing."),
        ("no one seeks", "Sin affects understanding and desire: left to themselves, people do not seek God rightly."),
        ("all have turned aside", "The collective language stresses universality; no one does good in the sense needed to establish righteousness before God."),
        ("open grave", "The citations move to speech: deceptive tongues and deadly words reveal the corruption that comes from within."),
        ("curses and bitterness", "The mouth, meant for blessing, is portrayed as full of destructive speech."),
        ("swift to shed blood", "The portrait widens from speech to violent action; sinful humanity rushes toward harm."),
        ("ruin and misery", "The paths people make leave devastation, both for themselves and for those around them."),
        ("way of peace", "Humanity has not known the path of shalom—right relationship with God and neighbour."),
        ("no fear of God", "The root diagnosis comes last: absence of reverent fear of God governs what the eyes desire and the life pursues."),
        ("every mouth may be stopped", "The law silences self-defence and makes the whole world accountable, rather than giving anyone grounds for boasting."),
        ("works of the law", "Law exposes sin but cannot justify sinners; it functions diagnostically, showing the need for God's saving righteousness."),
        ("But now", "This is a major turn in Romans: God's righteousness has now been displayed apart from law-keeping, though Scripture witnesses to it."),
        ("through faith in Jesus Christ", "God's righteousness is received through faith and offered to all believers; there is no ethnic distinction at this point."),
        ("all have sinned", "The universal problem explains the universal offer: every person falls short of the glory for which humans were made."),
        ("justified ... as a gift", "Justification is God's gracious verdict, given freely through Christ's redemption rather than earned by the sinner."),
        ("propitiation by his blood", "God publicly presented Christ's sacrificial death as the sin-bearing means received by faith, demonstrating his righteousness."),
        ("just and the justifier", "At the cross God remains just while justifying the believer in Jesus; mercy is not achieved by overlooking righteousness."),
        ("boasting ... excluded", "Since righteousness is received by faith rather than earned by works, human boasting has no place."),
        ("apart from works", "Paul states the thesis plainly: a person is justified by faith apart from works of the law."),
        ("God of Gentiles also", "Monotheism has missionary implications: the one God is God of Gentiles as well as Jews."),
        ("God is one", "The same God justifies circumcised and uncircumcised alike by faith; different prepositions do not create different gospels."),
        ("we uphold the law", "Faith does not abolish the law; it establishes its true witness to sin, promise, and God's righteous purpose."),
    ],
    4: [
        ("what ... gained by Abraham", "Abraham is the decisive test case: Paul asks what Israel's forefather discovered regarding righteousness before God."),
        ("not before God", "Even if works could yield human boasting, they cannot create a claim before the God who sees the heart."),
        ("believed God", "Genesis 15:6 supplies Paul's key text: Abraham trusted God's promise, and God counted that faith as righteousness."),
        ("wages ... due", "The wage/gift contrast clarifies grace: what is earned is an obligation, not a freely given gift."),
        ("justifies the ungodly", "Faith rests in the God who declares ungodly people righteous; this is grace, not a reward for prior achievement."),
        ("David also speaks", "David's Psalm confirms that the blessed person receives righteousness apart from works."),
        ("lawless deeds are forgiven", "Forgiveness is pictured as sins removed from the account and covered by God's mercy."),
        ("will not count his sin", "Blessing includes God's refusal to reckon sin against the forgiven person—accounting language central to this chapter."),
        ("only for the circumcised?", "Paul asks whether this blessing is limited by ethnic boundary; Abraham's timeline will answer no."),
        ("before ... circumcised", "Abraham was counted righteous before circumcision, so the sign cannot be the basis of his justification."),
        ("sign ... seal", "Circumcision marked and confirmed righteousness already received by faith; it did not produce that righteousness."),
        ("walk in the footsteps", "Abraham fathers circumcised believers who share his pre-circumcision faith, not those who rely on the rite alone."),
        ("promise ... through faith", "The inheritance promise comes through faith-righteousness, not Torah; this preserves grace's priority."),
        ("faith is null", "If inheritance depended on law observers, faith and promise would be emptied of their function."),
        ("law brings wrath", "Law defines transgression and therefore exposes guilt; it cannot be the basis for securing the promise."),
        ("depends on faith", "Faith ensures the promise rests on grace and is guaranteed to all Abraham's offspring, Jew and Gentile alike."),
        ("gives life to the dead", "Abraham trusts the Creator whose power reaches beyond human possibility, giving life and calling into being."),
        ("in hope ... against hope", "Abraham's hope stood against visible circumstances because it rested on God's stated promise."),
        ("did not weaken", "He faced the physical reality of age and Sarah's barrenness without making those facts the final authority."),
        ("grew strong in faith", "Faith gives glory to God by treating his promise as more decisive than apparent impossibility."),
        ("fully convinced", "Biblical faith includes persuasion about God's ability and faithfulness to do what he has promised."),
        ("counted ... righteousness", "This conclusion repeats the key verdict: Abraham's trusting faith was reckoned as righteousness."),
        ("not ... alone", "Genesis was recorded not only as Abraham's biography but as instruction for later believers."),
        ("raised ... Jesus our Lord", "The same accounting applies to those who trust the God who raised Jesus; Christian faith is resurrection-shaped."),
        ("for our trespasses", "Jesus was handed over because of our sins and raised in connection with our justification—the saving work is death and resurrection together."),
    ],
    5: [
        ("peace with God", "Having been justified by faith, believers now possess peace with God through Christ, not merely a hope of future calm."),
        ("access ... this grace", "Through Christ believers have continuing access into grace and rejoice in confident hope of sharing God's glory."),
        ("rejoice in our sufferings", "Christian joy is not denial of pain: suffering begins a God-directed chain toward endurance and hope."),
        ("endurance produces character", "Endurance is tested steadfastness; its formation makes hope more mature rather than wishful."),
        ("does not put us to shame", "Hope will not disappoint because God's love has already been poured into believers' hearts by the given Spirit."),
        ("at the right time", "Christ died for the ungodly when we were powerless; salvation begins with divine initiative, not human readiness."),
        ("scarcely die", "Paul uses ordinary human reluctance to sharpen the extraordinary character of Christ's self-giving."),
        ("while we were still sinners", "God demonstrates—not merely asserts—love in Christ's death for us before our moral reform."),
        ("much more ... saved", "If Christ's blood has justified us, Paul argues from the greater accomplished gift to confidence about deliverance from wrath."),
        ("enemies ... reconciled", "Reconciliation came while we were enemies; Christ's risen life gives still greater assurance to those now reconciled."),
        ("received reconciliation", "Believers rejoice in God himself, because reconciliation is a received gift through the Lord Jesus Christ."),
        ("through one man", "Paul begins the Adam–Christ comparison: sin entered the human world through Adam, and death spread with it."),
        ("before the law", "Sin existed before Sinai; although law affects reckoning of transgression, death's reign shows sin's universal reality."),
        ("death reigned", "Death ruled even over people whose sin differed from Adam's direct command-breaking; Adam is a type pointing forward to Christ."),
        ("free gift is not like", "The comparison contains a crucial contrast: Christ's grace overflows far beyond Adam's single trespass."),
        ("condemnation ... justification", "One trespass brought a condemning verdict; grace answers many trespasses with a justifying verdict."),
        ("reign in life", "Those receiving abundant grace and righteousness will reign in life through the one man, Jesus Christ."),
        ("as ... so", "Paul completes the parallel: Adam's trespass brought condemnation, while Christ's righteous act brings justification and life."),
        ("one man's obedience", "The many are constituted sinners through Adam's disobedience and constituted righteous through Christ's obedient act."),
        ("grace abounded all the more", "Law makes trespass visible and multiplying, yet grace super-abounds beyond sin; this prepares the objection of 6:1."),
        ("grace ... reign", "The goal is not grace as permissiveness but grace reigning through righteousness toward eternal life in Christ."),
    ],
    6: [
        ("continue in sin?", "Paul raises the predictable misuse of overflowing grace: should believers remain in sin so grace increases?"),
        ("By no means", "His strongest rejection follows: those who died to sin cannot coherently continue living under its rule."),
        ("baptized into Christ", "Baptism signifies incorporation into Christ, specifically participation in his death rather than a merely external washing."),
        ("walk in newness of life", "Union with Christ's burial and resurrection has a purpose: believers are to live a new kind of life now."),
        ("united with him", "The conditional statement assures that participation in Christ's death entails participation in his resurrection life."),
        ("old self was crucified", "The former Adamic self was crucified with Christ so sin's controlling body might be rendered powerless and slavery ended."),
        ("set free from sin", "Death breaks a master's claim; in union with Christ, the believer has been released from sin's dominion."),
        ("live with him", "Dying with Christ grounds a settled confidence that we also will live with him."),
        ("no longer has dominion", "Christ's resurrection is irreversible: death has no continuing mastery over the risen Lord."),
        ("once for all", "Christ's death to sin was once-for-all; his present life is lived to God, setting the pattern for believers' reckoning."),
        ("consider yourselves", "This imperative calls for faith-shaped calculation: count as true what union with Christ has made true—dead to sin, alive to God."),
        ("Let not sin reign", "Paul moves from identity to command: refuse sin's kingship in the mortal body and its desires."),
        ("present yourselves to God", "Do not offer bodily capacities as weapons for sin; place your whole selves at God's disposal as people brought from death to life."),
        ("under law but under grace", "Sin will not rule because believers stand in the new realm of grace, not under law as the condemning covenant administration."),
        ("are we to sin", "Paul repeats the objection in a new form; freedom from law's condemnation is never authorization for sin."),
        ("slaves of the one", "The slavery image exposes moral allegiance: habitual presentation to a master produces obedience either toward death or righteousness."),
        ("obedient from the heart", "Paul gives thanks for transformation: former slaves of sin have heart-level obedience to the gospel teaching entrusted to them."),
        ("slaves of righteousness", "Freedom from sin is not moral autonomy; it is transfer into the service of righteousness."),
        ("human terms", "Paul flags the slavery metaphor as an accommodation to human weakness, then applies its logic to practical bodily obedience."),
        ("free in regard to righteousness", "Former freedom from righteousness was no true freedom; it meant alienation from the good."),
        ("what fruit", "Paul asks believers to evaluate the old life by its outcome: shame in the present and death as its end."),
        ("fruit ... sanctification", "Now freed for God, believers bear fruit leading to sanctification, whose final outcome is eternal life."),
        ("wages ... free gift", "The closing antithesis summarises the chapter: sin pays earned death; God freely gives eternal life in Christ Jesus."),
    ],
}


VOCAB = {
    "servant": ("n.", "仆人；受主人委派服事的人"), "apostle": ("n.", "使徒；奉差遣者"),
    "gospel": ("n.", "福音；好消息"), "grace": ("n.", "恩典；白白赐下的恩惠"),
    "righteousness": ("n.", "义；在神面前正确的地位"), "faith": ("n.", "信心；信靠"),
    "salvation": ("n.", "救恩；拯救"), "wrath": ("n.", "震怒；神对罪公义的审判"),
    "ungodliness": ("n.", "不敬虔"), "suppress": ("v.", "压制；故意抑制"),
    "creation": ("n.", "受造界；创造"), "excuse": ("n.", "借口；免责理由"),
    "exchanged": ("v.", "交换；以一物替代另一物"), "Creator": ("n.", "创造主"),
    "conscience": ("n.", "良心；内在道德意识"), "repentance": ("n.", "悔改；转向神的心思与生活改变"),
    "partiality": ("n.", "偏待；偏袒"), "circumcision": ("n.", "割礼"),
    "justify": ("v.", "称义；宣告为义"), "justified": ("v.", "被称义"),
    "redemption": ("n.", "救赎；付代价释放"), "propitiation": ("n.", "挽回祭；除去神对罪的忿怒的祭"),
    "boasting": ("n.", "夸口；自我炫耀"), "forgiven": ("adj.", "蒙赦免的"),
    "promise": ("n.", "应许"), "inheritance": ("n.", "产业；承受的基业"),
    "reconciliation": ("n.", "和好；敌对关系被恢复"), "suffering": ("n.", "苦难"),
    "endurance": ("n.", "忍耐；坚忍"), "reconciled": ("v.", "与神和好"),
    "trespass": ("n.", "过犯；越界的罪"), "condemnation": ("n.", "定罪"),
    "baptized": ("v.", "受洗；藉洗礼表明归入基督"), "resurrection": ("n.", "复活"),
    "crucified": ("v.", "被钉十字架"), "enslaved": ("adj.", "受奴役的"),
    "sanctification": ("n.", "成圣；被分别归神并逐渐圣洁"), "wages": ("n.", "工价；应得报酬"),
}


def grammar(text: str) -> tuple[str, str]:
    lower = text.lower()
    if text.endswith("?"):
        return "修辞问句", "保罗以问题推进辩论；问题通常要求读者接受紧随其后的答案，而非只等待资讯。"
    if "as " in lower and " so " in lower:
        return "as ... so ... 对照", "as 引出前项，so 引出对应结论；特别留意保罗如何把亚当与基督、罪与恩典并列。"
    if lower.startswith("if ") or " if " in lower:
        return "if 条件句", "if 引出论证中的条件或假设；分辨它是在假设反例、说明结果，还是确立真实前提。"
    if lower.startswith("for "):
        return "For 理由连接", "For 将本节与前文相连，说明原因、根据或保罗论证的下一步。"
    if lower.startswith("therefore") or lower.startswith("so "):
        return "推论连接词", "Therefore / So 将前面的福音事实推向本节结论或实际应用。"
    if "not " in lower and " but " in lower:
        return "not ... but ... 对比", "否定错误的理解或道路，再以 but 指明真正的福音事实与回应。"
    if lower.startswith("but ") or " but " in lower:
        return "but 转折", "but 标出重要反差；阅读时要同时保留转折前后两面的张力。"
    if lower.startswith("let ") or lower.startswith("do not ") or " must " in lower:
        return "命令句", "祈使语气把已经陈述的福音身份落实为具体回应；先看命令建立在哪个恩典事实之上。"
    if "who " in lower or "which " in lower or "that " in lower:
        return "关系从句", "who / which / that 补充人物或事物的身份、内容、目的或结果；先找它所修饰的名词。"
    return "主句与修饰成分", "先找主语和主要动词，再把介词短语、分词或并列成分放回保罗的论证脉络。"


def vocabulary(text: str) -> list[dict[str, str]]:
    lower = text.lower()
    found = [
        {"word": word, "ipa": "", "pos": pos, "meaning": meaning}
        for word, (pos, meaning) in VOCAB.items()
        if word.lower() in lower
    ][:2]
    if found:
        return found
    words = [word.strip(".,;:!?\"'“”()��") for word in text.split()]
    key = next((word for word in words if len(word) >= 7), words[0])
    return [{"word": key.lower(), "ipa": "", "pos": "key word", "meaning": "本节关键内容词；结合上下文观察其在保罗论证中的作用。"}]


def make_note(chapter: int, verse: int, text: str) -> dict:
    phrase, explanation = NOTES[chapter][verse - 1]
    title, detail = grammar(text)
    return {
        "vocab": vocabulary(text),
        "grammar": [{"title": title, "detail": detail}],
        "expression": [{"phrase": phrase, "note": explanation}],
        "translation": "",
    }


def main() -> None:
    output = ROOT / "backend" / "data" / "BibleLang" / "en" / "Romans"
    output.mkdir(parents=True, exist_ok=True)
    verses = load_verses("esv", "Romans")
    for chapter in range(1, 7):
        chapter_verses = filter_chapter(verses, chapter)
        assert len(chapter_verses) == len(NOTES[chapter]), (chapter, len(chapter_verses), len(NOTES[chapter]))
        payload = {
            str(int(item["verse"])): make_note(chapter, int(item["verse"]), clean_verse_text(str(item["text"])))
            for item in chapter_verses
        }
        write_json(output / f"{chapter}.json", payload)
        print(f"Romans {chapter}: wrote {len(payload)} notes")


if __name__ == "__main__":
    main()
