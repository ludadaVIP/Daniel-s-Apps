import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'P57' | 'P68') => {
  const first = unit === 'P57',
    id = (n: number) => unit + '-MAINT-WORD-PROBLEMS-Q' + n;
  const task = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次一个小问。先给量命名并写关系，再算、标单位并从另一方向核查；核齐所有小问才确认。',
        'Do one subpart at a time. Name quantities and form a relationship before calculating, labelling units and checking in reverse. Confirm only after every subpart is reviewed.',
      ),
    ]);
  const table = (
    q: Question,
    caption: ReturnType<typeof t>,
    columns: ReturnType<typeof t>[],
    rows: (string | ReturnType<typeof t>)[][],
  ) => {
    q.contextTable = {
      caption,
      columns,
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };
  const metres = first ? 2 : 3,
    cm = first ? 40 : 20,
    removed = first ? 85 : 125,
    birds = first ? 4 : 6,
    whole = metres * 100 + cm,
    remaining = whole - removed;
  const q1 = task(
    1,
    'known-unknown-units',
    '纸带按表记录，剪下的部分属于原纸带；旁边鸟数是独立事实。先只读“给出的原全长”，不求剩余，直接回答；再把问题改为“剪后还剩多少cm”，将三张卡分为本题相关已知或不用信息，另写待求量及单位。统一长度单位，画整体和两部分并列关系、求剩余、加回核查。有人将原全长与剪下量相加，再把鸟数加入，哪里改变了对象或把部分重复算进整体？若鸟数改变，原剩余长度是否改变？',
    'The removed piece belongs to the original strip; nearby bird count is a separate fact. FIRST answer only “What original length was GIVEN?”, without finding a remainder. THEN change the question to “How many cm remain after cutting?” Sort all three cards into relevant knowns or unused facts and separately name the unknown and its unit. Match length units, DRAW a whole with two parts, form a relationship, find the remainder and check by adding back. Why does adding the whole, removed part and birds mix objects or count an included part again? Would changing only the bird count change the remainder?',
    `原全长已给${metres}m${cm}cm，不需要先做减法；1m=100cm，原长${metres}×100+${cm}=${whole}cm，换单位不伸缩。T、R相关已知，B本题不用；待求为剩余长度，单位cm。${removed}+剩余=${whole}，${whole}−${removed}=${remaining}cm；核查${remaining}+${removed}=${whole}cm。图须标整体${whole}cm、剪下${removed}cm和剩余问号，求出后再补数。全长已含剪下部分，不能再加成剩余；鸟数计只数，不计长度，改鸟数不改纸带关系。即使两个长度已同单位，也不能忽略整体/部分角色而随意相加。`,
    `The GIVEN original is ${metres} m ${cm} cm, with no subtraction needed. Using 1 m=100 cm gives ${metres}×100+${cm}=${whole} cm without stretching. T and R are relevant knowns; B is unused here. Unknown: remaining length in cm. Relationship ${removed}+remaining=${whole}; ${whole}−${removed}=${remaining} cm. Reverse check ${remaining}+${removed}=${whole} cm. The drawing labels whole ${whole} cm and removed ${removed} cm, with a question mark on remaining until solved. The whole already includes the removed part; adding it again does not find remaining. Birds count animals, not length, and changing that count does not change the strip. Matching units alone do not justify ignoring whole/part roles.`,
    '先区分“读已知”和“求剩余”，再给每个数写对象与单位。',
    'Distinguish reading a given from finding remaining; name each number’s object and unit.',
  );
  table(
    q1,
    t(
      '三张原始信息卡；不提供待求剩余。',
      'Three original fact cards; the requested remainder is not supplied.',
    ),
    [t('卡号', 'Card'), t('对象', 'Quantity'), t('给定记录', 'Given record')],
    [
      ['T', t('原全长', 'Original length'), `${metres}m ${cm}cm`],
      ['R', t('剪下长度', 'Removed length'), `${removed}cm`],
      ['B', t('旁边鸟数', 'Nearby birds'), String(birds)],
    ],
  );

  const a = first ? 8 : 9,
    b = first ? 13 : 15,
    total = a + b,
    bags = first ? 3 : 4,
    each = total / bags;
  const q2 = task(
    2,
    'bar-relationships',
    '按表分别亲画W、C、E三图，标对象、单位和问号：W两段首尾无重叠连接，求整体；C是两个人各自持有卡，不发生送卡，求较大量比小量多多少；E是相等袋，求全部张数。解释为什么W首尾相接、C同起点对齐、E等段。另从同一关系重新开始：W只给整体和第一段求第二段；C只给较大量和差距求较小量，再只给较小量和差距求较大量；E只给总张数和袋数求每袋。分别列式并反查。最后独立画三个零情形：W第二段0、C两人同为表中较小量、E每袋0张但袋数不变；标零量和结果，不能为显眼而画正长度。图示厘米是否是实物测量尺？',
    'DRAW three labelled bar models from W, C and E, placing question marks first. W joins two strips end to end without overlap: find the whole. C compares two people’s separate card holdings, with no cards given away: find the excess. E has equal bags: find all cards. Explain joined parts, aligned comparison starts and equal sections. Independently RESTART the same relationships: in W give only whole and first part to find the second; in C give larger and gap to find smaller, then smaller and gap to find larger; in E give total and bag count to find cards per bag. Write expressions and reverse checks. Finally draw separate zero cases: W’s second part zero, C’s two holdings both equal the listed smaller count, and E’s cards per bag zero with bag count unchanged. Label zero quantities and results without positive-width zero bars. Are on-screen centimetres an actual ruler?',
    `W：${a}+${b}=${total}cm；问号移到第二段则${total}−${a}=${b}cm，以${a}+${b}=${total}反查。C：较大${total}张、较小${a}张，差${total}−${a}=${b}张；求小${total}−${b}=${a}，求大${a}+${b}=${total}，都回到小+差=大。比较图没有实际送卡，不能与W部分图混为一个故事。E：${bags}袋×每袋${each}张=${total}张，反求每袋${total}÷${bags}=${each}张，乘回${bags}×${each}=${total}；袋数不是张数。零分支W=${a}+0=${a}cm，C=${a}−${a}=0张，E=${bags}×0=0张；袋子仍有${bags}个。零段/差距/每组宽度为0，等量比较条同长；全零整体的括号也不能画正量。三图只在各自同图内共用比例，纸上示意合理并标清即可；图示不是实际厘米尺，不凭像素代替给定数值。先由关系和未知位置选运算，不由“多”机械选加法。`,
    `W: ${a}+${b}=${total} cm; moving the unknown to the second part gives ${total}−${a}=${b} cm, checked by ${a}+${b}=${total}. C: larger ${total}, smaller ${a}, gap ${total}−${a}=${b} cards. Find smaller ${total}−${b}=${a} or larger ${a}+${b}=${total}; all satisfy smaller+gap=larger. Comparison removes no cards and differs from a whole-part story. E: ${bags} bags × ${each} cards per bag=${total} cards; inverse ${total}÷${bags}=${each} cards per bag, checked by multiplication. Bags are not cards. Separate zero cases: W ${a}+0=${a} cm; C ${a}−${a}=0 cards; E ${bags}×0=0 cards despite ${bags} bags. Zero parts, gaps and per-group bars have zero width; equal holdings have equal bars and an all-zero whole has no positive span. Use one scale within each drawing and reasonable labelled paper sketches. Screen pixels are not physical centimetres or a substitute for stated quantities. Operations follow the relationship and unknown, not the word “more”.`,
    '先问“部分、比较还是等组”，再移动问号；比较始终满足小量+差距=大量。',
    'Identify parts, comparison or equal groups before moving the question mark; comparison always satisfies smaller+gap=larger.',
  );
  table(
    q2,
    t(
      '三段独立故事；各行内部使用给定单位。',
      'Three independent stories, each using its stated units.',
    ),
    [
      t('故事', 'Story'),
      t('第一个已知', 'First given'),
      t('第二个已知', 'Second given'),
    ],
    [
      [
        'W',
        t(`第一段${a}cm`, `First strip ${a} cm`),
        t(`第二段${b}cm`, `Second strip ${b} cm`),
      ],
      [
        'C',
        t(`较大量${total}张`, `Larger holding ${total} cards`),
        t(`较小量${a}张`, `Smaller holding ${a} cards`),
      ],
      [
        'E',
        t(`${bags}袋`, `${bags} bags`),
        t(`每袋${each}张`, `${each} cards per bag`),
      ],
    ],
  );

  const boxes = first ? 4 : 5,
    perBox = first ? 6 : 7,
    given = first ? 5 : 6,
    people1 = 4,
    people2 = first ? 2 : 5,
    perPerson = first ? 3 : 2,
    stock = first ? 36 : 42,
    reserve = first ? 6 : 7,
    capacity = 5,
    packs = first ? 2 : 3,
    perPack = first ? 9 : 6,
    loose = first ? 4 : 5;
  const original = boxes * perBox,
    mRemain = original - given,
    people = people1 + people2,
    needed = people * perPerson,
    available = stock - reserve,
    bagCount = available / capacity,
    inside = packs * perPack,
    combined = inside + loose;
  const q3 = task(
    3,
    'two-step-plan',
    '表中M/A/D/U是四个独立故事，每次只做一行。M各盒等量，总共送出末列张数；A两组互不重叠，每人发末列张数；D先留第二个量所示张数，余下每袋末列张数且正好装完；U各包等量，再加入末列散卡。每行先说最终需要什么，给第一步输出命名及单位，再写第二步、合并式和加回/乘回核查。M若误写盒数×(每盒张数−总送出张数)，实际每盒及全部送出多少，是否还是原故事？另从M原有量重新开始，若全部送完，剩多少；从D原库存重新开始，若全数留下不装，每袋容量仍正数，可装几袋？零结果与没有资料有何区别？',
    'M/A/D/U are FOUR independent stories; do one row per sitting. M: equal boxes, giving the last-column card count away IN TOTAL. A: two NON-OVERLAPPING groups, each person receiving the last-column card count. D: set aside the middle-column cards, then put the rest in bags of the last-column capacity with no leftovers. U: equal packs plus the last-column loose cards. For each, name what the final step needs, the first output and its unit, then write the second step, combined expression and reverse check. For M, what story does boxes×(cards per box−TOTAL given) actually describe, including total given? Independently restart M giving ALL original cards away, and restart D setting ALL stock aside with positive bag capacity. What results follow, and why are determined zeros different from missing facts?',
    `M原有${boxes}×${perBox}=${original}张，余${original}−${given}=${mRemain}张；合式${boxes}×${perBox}−${given}=${mRemain}，核${mRemain}+${given}=${original}、${original}÷${boxes}=${perBox}。错括号${boxes}×(${perBox}−${given})=${boxes * (perBox - given)}表示每盒送${given}张，总送${boxes * given}张，不是总送${given}张。A人数${people1}+${people2}=${people}人，需${people}×${perPerson}=${needed}张；(${people1}+${people2})×${perPerson}=${needed}，核${needed}÷${perPerson}=${people}、${people}−${people2}=${people1}，不能只乘第二组。D可装${stock}−${reserve}=${available}张，再${available}÷${capacity}=${bagCount}袋；(${stock}−${reserve})÷${capacity}=${bagCount}，核${bagCount}×${capacity}+${reserve}=${stock}张。U包内${packs}×${perPack}=${inside}张，再${inside}+${loose}=${combined}张，合${packs}×${perPack}+${loose}=${combined}；核${combined}−${loose}=${inside}、${inside}÷${packs}=${perPack}。单位沿步骤走：人到张、张到袋；散卡加入不能照搬送出减法。M全送${original}−${original}=0张；D全留(${stock}−${stock})÷${capacity}=0袋，除数${capacity}>0，两个零均由已知确定，不是资料缺失。步骤先后来自中间量依赖，不能背所有故事都先乘。`,
    `M original ${boxes}×${perBox}=${original} cards, remaining ${original}−${given}=${mRemain} cards; combined ${boxes}×${perBox}−${given}=${mRemain}. Check ${mRemain}+${given}=${original} and ${original}÷${boxes}=${perBox}. Wrong brackets ${boxes}×(${perBox}−${given})=${boxes * (perBox - given)} give ${given} FROM EACH box, ${boxes * given} in total, rather than ${given} in total. A people ${people1}+${people2}=${people}, then ${people}×${perPerson}=${needed} cards; (${people1}+${people2})×${perPerson}=${needed}. Check ${needed}÷${perPerson}=${people} and ${people}−${people2}=${people1}; both groups receive cards. D available ${stock}−${reserve}=${available} cards, then ${available}÷${capacity}=${bagCount} bags; (${stock}−${reserve})÷${capacity}=${bagCount}. Check ${bagCount}×${capacity}+${reserve}=${stock} cards. U inside ${packs}×${perPack}=${inside} cards, then ${inside}+${loose}=${combined}; combined ${packs}×${perPack}+${loose}=${combined}. Check ${combined}−${loose}=${inside} and ${inside}÷${packs}=${perPack}. Follow units: people to cards, cards to bags. Loose cards are ADDED, not removed. Independent zeros: M ${original}−${original}=0 cards; D (${stock}−${stock})÷${capacity}=0 bags with divisor ${capacity}>0. These are determined zeros, not missing data. Step order follows intermediate dependencies, not a universal multiply-first story rule.`,
    '给第一步写“原有张数/总人数/可装张数/包内张数”，再看第二步单位。',
    'Name the first output original cards, total people, packable cards or cards inside packs, then follow units into step two.',
  );
  table(
    q3,
    t(
      '四行各自独立，所有量均为精确计数。',
      'Each row is independent; all quantities are exact counts.',
    ),
    [
      t('故事', 'Story'),
      t('第一个量', 'First quantity'),
      t('第二个量', 'Second quantity'),
      t('第三个量', 'Third quantity'),
    ],
    [
      [
        'M',
        t(`${boxes}盒`, `${boxes} boxes`),
        t(`每盒${perBox}张`, `${perBox} cards per box`),
        t(`总送${given}张`, `${given} cards given in total`),
      ],
      [
        'A',
        t(`第一组${people1}人`, `First group ${people1} people`),
        t(`第二组${people2}人`, `Second group ${people2} people`),
        t(`每人${perPerson}张`, `${perPerson} cards per person`),
      ],
      [
        'D',
        t(`原有${stock}张`, `${stock} original cards`),
        t(`留下${reserve}张`, `${reserve} cards set aside`),
        t(`每袋${capacity}张`, `${capacity} cards per bag`),
      ],
      [
        'U',
        t(`${packs}包`, `${packs} packs`),
        t(`每包${perPack}张`, `${perPack} cards per pack`),
        t(`散卡${loose}张`, `${loose} loose cards`),
      ],
    ],
  );

  const count = first ? 3 : 5,
    price = first ? 8 : 6,
    budget = first ? 30 : 40,
    penPrice = first ? 2 : 4,
    year = first ? 2019 : 2021,
    cost = count * price,
    change = budget - cost;
  const q4 = task(
    4,
    'relevant-information',
    '只买表中笔记本，不买笔，也无折扣或其他费用。分别问①笔记本总价②买后余钱③笔记本总质量：逐次写所需卡号、哪些不用、是否足够；可算的生成关系、数值与单位，不能求的具体说缺什么。用“每本100g”和“每本150g”两个假设补全资料，说明原给定价格和数量可同时符合不同总质量，不能把缺质量记成0；它们不是实测。另次补给“每本200g”后再算总质量。最后独立假定记录年为2025，只求它与印刷年份的年份差（非精确周年），这时哪张原卡变得相关？为什么不用信息随问题改变，不能只看单位或数字大小删除？',
    'Buy ONLY the listed notebooks, no pens, with no discounts or extra charges. For EACH goal—(1) notebook cost, (2) money remaining, (3) total notebook mass—identify required card IDs, unused facts and sufficiency. Generate relationships, values and units where possible; state precisely what is missing otherwise. Complete the original facts hypothetically with 100 g per notebook and with 150 g per notebook: show different masses can fit the same given prices/counts, so missing mass is not zero. These are NOT observations. In a separate updated case, mass of 200 g per notebook is actually supplied: calculate then. Finally assume a record year of 2025 and find only its year-number difference from printing, NOT an exact anniversary. Which original card now matters? Why must relevance follow the question rather than units or numerical size alone?',
    `总价用F2/F3：${count}×${price}=NZ$${cost}；余钱用F1/F2/F3：${budget}−${cost}=NZ$${change}，核${change}+${cost}=${budget}。未买笔的F4同为钱数仍不用，F5年份与F6开门时间均不参与这两问。质量有数量F2却缺每本质量或合计质量，原资料不能确定；价格不能充当克数。假设每本100g得${count * 100}g，150g得${count * 150}g，两者都不冲突于原钱数，所以不能判0或猜一个。另次给200g后，${count}×200=${count * 200}g，原价格仍不用；若直接给合计质量可直接读取。年份差改用F5：2025−${year}=${2025 - year}年，只是年份数字之差，不声称已过精确周年。不用的数据不是不存在，换目标可能变相关；缺必要资料则不能用多余数字补，选全卡也不能制造所缺关系。`,
    `Cost uses F2/F3: ${count}×${price}=NZ$${cost}. Remaining uses F1/F2/F3: ${budget}−${cost}=NZ$${change}, checked by ${change}+${cost}=${budget}. F4 is also money but buys nothing here; F5 printing and F6 opening time are unused for these two goals. Mass has count F2 but lacks per-notebook or total mass. Price cannot act as grams. Hypothetical 100 g each gives ${count * 100} g; 150 g each gives ${count * 150} g. Both fit the original money facts, demonstrating non-uniqueness rather than observing weights. Do not conclude zero or invent a mass. With separately supplied 200 g, ${count}×200=${count * 200} g; prices remain unused. A supplied total mass could instead be read directly. The changed year question uses F5: 2025−${year}=${2025 - year} years, only a difference of year numbers, not elapsed exact anniversaries. An unused fact still exists and can matter to another goal. Missing necessary relationships cannot be supplied by selecting every irrelevant card.`,
    '分别写“求钱/求质量/求年份差”的关系；给两种可能质量检查原资料能否唯一确定。',
    'Write separate money, mass and year-difference relationships; use two possible masses to test whether the original facts determine one value.',
  );
  table(
    q4,
    t(
      '假想笔记本资料；质量未给，笔不购买。',
      'Fictional notebook facts; mass is NOT given and pens are not bought.',
    ),
    [t('卡号', 'Card'), t('给定事实', 'Given fact')],
    [
      ['F1', t(`预算NZ$${budget}`, `Budget NZ$${budget}`)],
      ['F2', t(`买${count}本`, `Buy ${count} notebooks`)],
      ['F3', t(`每本NZ$${price}`, `NZ$${price} per notebook`)],
      [
        'F4',
        t(`未买的笔每支NZ$${penPrice}`, `Unbought pens NZ$${penPrice} each`),
      ],
      ['F5', t(`印刷年份${year}`, `Printing year ${year}`)],
      ['F6', t('店铺9点开门', 'Shop opens at 9')],
    ],
  );

  const shopPacks = first ? 3 : 4,
    shopEach = first ? 7 : 5,
    shopLoose = first ? 5 : 3,
    shopGiven = first ? 4 : 6,
    shopPrice = first ? 6 : 7,
    shopBudget = first ? 25 : 40,
    shopOriginal = shopPacks * shopEach + shopLoose,
    shopRemaining = shopOriginal - shopGiven,
    spent = shopPacks * shopPrice,
    moneyLeft = shopBudget - spent,
    bad = shopPacks + shopEach + shopLoose - shopGiven,
    areaW = first ? 4 : 5,
    areaH = first ? 3 : 2;
  const q5 = task(
    5,
    'explain-and-check',
    '用纸卡表示表中假想小铺，不需购买：原散卡已经拥有，不另付钱；只买整包，无折扣或其他费用。分别求送出后剩余卡与买后余钱。对比A“只写剩余卡数”、B“包数+每包张数+散卡−总送出=正确剩余数”、C“完整说明”：先计算B左边的真实值，指出为何正确末值不能修好关系；再亲写C，给每步量与单位、原问题回答及加回/乘回核查，不照抄固定句子。另从原有卡数重新开始，把总送出改为收到相同张数，新结果怎样变并如何核查？独立用末两行边长画单位方格矩形，求面积、以逐行加法反查；为什么不能写长度单位cm？最后若问这些卡总质量，哪些资料仍缺？',
    'Use paper cards for this fictional shop, with no purchase. Loose cards are ALREADY owned and cost nothing extra; buy only whole packs with no discounts or extra charges. Find cards remaining after giving some away AND money remaining after buying. Compare A, a bare remaining-card number; B, “packs+cards per pack+loose−total given=the CORRECT final remainder”; and C, a full explanation. Compute B’s actual left side and explain why its correct final number does not repair its relationship. Generate C yourself, naming each output/unit, answering the question and checking by adding/multiplying back. In a SEPARATE restart from original cards, RECEIVE the same count instead of giving it away; find and check the new total. Independently DRAW a unit-square rectangle with the last two side lengths, calculate area and check by adding rows; why not label it cm? Finally identify information still missing for total card mass.',
    `包内${shopPacks}×${shopEach}=${shopPacks * shopEach}张，加入已有散卡${shopLoose}张，原有${shopOriginal}张；总送${shopGiven}后${shopOriginal}−${shopGiven}=${shopRemaining}张。A只写${shopRemaining}张缺关系与核查；B左边${shopPacks}+${shopEach}+${shopLoose}−${shopGiven}=${bad}，不等于所写${shopRemaining}，包数不能直接当张数相加。C须自己说明上述组关系，核${shopRemaining}+${shopGiven}=${shopOriginal}、${shopOriginal}−${shopLoose}=${shopPacks * shopEach}、${shopPacks * shopEach}÷${shopPacks}=${shopEach}。花费${shopPacks}×${shopPrice}=NZ$${spent}，余${shopBudget}−${spent}=NZ$${moneyLeft}，核${moneyLeft}+${spent}=${shopBudget}；每包卡数不能当单价，原散卡不再收费。另次收到${shopGiven}张则${shopOriginal}+${shopGiven}=${shopOriginal + shopGiven}张，核${shopOriginal + shopGiven}−${shopGiven}=${shopOriginal}，不是重复扣除。面积${areaW}×${areaH}=${areaW * areaH}cm²，${areaH}行各${areaW}个1cm²方格，逐行和为${areaW * areaH}；cm计长度，cm²计覆盖。质量仍需各部分相应的质量或合计质量，不能从卡数/价钱猜测。接受任何正确短句、图或口头解释，人审关系/计算/单位/情境/有效核查而非关键词；复制范例或最终数不能证明独立理解。`,
    `Inside packs ${shopPacks}×${shopEach}=${shopPacks * shopEach} cards, plus ${shopLoose} already-owned loose cards gives ${shopOriginal}; ${shopOriginal}−${shopGiven}=${shopRemaining} cards remain. A’s bare ${shopRemaining} lacks relationships and checks. B actually has ${shopPacks}+${shopEach}+${shopLoose}−${shopGiven}=${bad}, NOT its claimed ${shopRemaining}; pack count is not a card-count part. C should explain the grouping, checking ${shopRemaining}+${shopGiven}=${shopOriginal}, ${shopOriginal}−${shopLoose}=${shopPacks * shopEach} and ${shopPacks * shopEach}÷${shopPacks}=${shopEach}. Cost ${shopPacks}×${shopPrice}=NZ$${spent}, leaving ${shopBudget}−${spent}=NZ$${moneyLeft}; check ${moneyLeft}+${spent}=${shopBudget}. Cards per pack are not price per pack; already-owned loose cards incur no new charge. Independent receipt: ${shopOriginal}+${shopGiven}=${shopOriginal + shopGiven} cards, checked by ${shopOriginal + shopGiven}−${shopGiven}=${shopOriginal}, rather than subtracting again. Area ${areaW}×${areaH}=${areaW * areaH} cm²: ${areaH} rows of ${areaW} unit squares, each 1 cm²; repeated row addition gives ${areaW * areaH}. cm measures length while cm² measures coverage. Mass still needs appropriate mass information for the cards or their total, not an invented value from price/count. Accept ANY sound short text, diagram or spoken explanation. Human review checks relationships, calculation, units, context and effective verification, not keywords; copied references or a final number do not establish independent understanding.`,
    '把张数关系和钱数关系分开，先算错误式左边，再用反向关系恢复原卡数与预算。',
    'Separate card and money relationships; calculate the invalid left side, then restore original cards and budget with reverse checks.',
  );
  table(
    q5,
    t(
      '假想小铺原始资料；最后两行仅用于独立面积题。',
      'Original fictional shop data; the last TWO rows belong only to an independent area question.',
    ),
    [t('项目', 'Item'), t('给定量', 'Given quantity')],
    [
      ['N', t(`${shopPacks}包`, `${shopPacks} packs`)],
      ['E', t(`每包${shopEach}张`, `${shopEach} cards per pack`)],
      [
        'L',
        t(`已有散卡${shopLoose}张`, `${shopLoose} loose cards already owned`),
      ],
      ['G', t(`总送出${shopGiven}张`, `${shopGiven} cards given in total`)],
      ['P', t(`每包NZ$${shopPrice}`, `NZ$${shopPrice} per pack`)],
      ['B', t(`预算NZ$${shopBudget}`, `Budget NZ$${shopBudget}`)],
      ['W', `${areaW}cm`],
      ['H', `${areaH}cm`],
    ],
  );

  return {
    id: unit + '-MAINT-WORD-PROBLEMS',
    unit,
    title: t(
      '先定所求，再重建关系',
      'Identify the goal and rebuild the relationship',
    ),
    bridge: 'B06-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), 'B06-L0' + n]),
    ),
    intro: t(
      '五张过程卡分多次，一次一个小问，不计时。先画纸图、给量命名并写自己的理由，全部小问核齐后再确认。读题帮助与数学提示分开，可用熟悉语言；资料均为假想，纸卡不是家庭实测，也无需购买或真实调查。',
      'Split five process cards across sittings, ONE SUBPART at a time, without a timer. Draw on paper, name quantities and generate your own reasoning before review; confirm only after EVERY part is checked. Distinguish reading assistance from maths hints and use a familiar language. All data are fictional; paper cards are not family observations and require no purchase or real survey.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const wordProblemMeaningRetrieval = {
  P57: makeSet('P57'),
  P68: makeSet('P68'),
};
