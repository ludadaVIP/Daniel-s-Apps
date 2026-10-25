import { t, type Question } from '../model';
import type { LocalizedText } from '@study/shared';
import { reasoning } from './builders';
const frac = (n: number, d: number) => {
  const gcd = (a: number, b: number): number =>
    b ? gcd(b, a % b) : Math.abs(a);
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const makeSet = (unit: 'P68' | 'J76') => {
  const near = unit === 'P68',
    id = (n: number) => `${unit}-MAINT-DATA-MEANING-Q${n}`;
  const task = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次只做一个编号小问或一行，先整理原记录、画图或列关系并写自己的理由，再核全部小问才确认。读题帮助与数学提示分开。',
        'Do ONE numbered part or row at a time. Organise the original records, draw or model and give your own reason before reviewing EVERY part. Separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    caption: [string, string],
    headers: [string, string][],
    rows: (string | LocalizedText)[][],
  ) => {
    q.contextTable = {
      caption: t(...caption),
      columns: headers.map((h) => t(...h)),
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };
  const labels = {
    walk: t('步行', 'Walk'),
    bike: t('骑车', 'Bike'),
    bus: t('公交', 'Bus'),
    other: t('其他已答方式', 'Other stated method'),
    missing: t('无回应', 'No response'),
    unentered: t('未录入', 'Unentered'),
  };
  const raw = (
    near
      ? ['walk', 'bus', 'walk', 'bike', 'missing', 'bus', 'walk', 'bus']
      : ['bike', 'walk', 'bus', 'bike', 'missing', 'bike', 'walk', 'bus']
  ) as (keyof typeof labels)[];
  const initial = (key: keyof typeof labels) =>
    raw.slice(0, 5).filter((v, i) => (i === 2 ? 'other' : v) === key).length;
  const final = (key: keyof typeof labels) =>
    raw.filter((v) => v === key).length;
  const correct = (key: keyof typeof labels) =>
    raw.slice(0, 5).filter((v) => v === key).length;
  const q1 = task(
    1,
    'frequency-and-sample',
    '① 同一门口邀请八人各答一次“今天主要怎样来”，允许不答且不是随机样本。原始回应与当前录入并列；先核前五条，找出与原回应不符的一条，按来源更正且不新增一人。分别给更正前、后频数/回答/无回应/未录入数，已存在但未录入的资料能当无回应吗？② 把后三条也整理完，亲画类别频数与记号表，核回答加无回应等于邀请；再在自己的表上遮住骑车频数，用邀请减无回应和其余类别之和求回，逐条反查。两位不同ID同方式能并成一人吗，“其他零”表示资料缺失吗？另有两名从未入表的新步行者R9/R10时，邀请与步行数怎样更新？③ 写一个本表支持的结论和一个不支持的结论，说明今天方式与最喜欢方式、门口样本与全校的差别。',
    '① Eight people at one gate are invited to answer ONCE about their main travel method TODAY; nonresponse is allowed and this is not a random sample. Compare raw responses with current entries. Audit the first five, correct the mismatched entry from its source WITHOUT adding a person, and report each category’s frequency, the answered count, the missing count and the unentered count before and after correction. Is available but unentered information a nonresponse? ② Complete the last three, DRAW category tallies/frequencies and reconcile answered+missing with invitations. Then cover the bike frequency on YOUR table, recover it from invitations minus missing and all OTHER category counts, and check against the raw rows. May distinct IDs with the same method be merged? Does zero Other mean missing information? Then add TWO previously absent walkers R9/R10 and update invitations and walk count. ③ Write one supported and one unsupported claim, distinguishing today from favourite and this gate group from the school.',
    `前五条错把R3录其他；更正前步行${initial('walk')}、骑车${initial('bike')}、公交${initial('bus')}、其他1，无回应1，回答4、已录5、未录3、受邀8。按R3原回应${labels[raw[2]!].zh}更正，不额外加一人；更正后步行${correct('walk')}、骑车${correct('bike')}、公交${correct('bus')}、其他0，其余记录数不变。全表步行${final('walk')}、骑车${final('bike')}、公交${final('bus')}、其他0，回答7、无回应1、受邀8。遮住骑车频数后由8−1−(${final('walk')}+${final('bus')}+0)=${final('bike')}求回，不把缺失者归入骑车。零其他表示无人回答其他方式，缺失者方式未知，未录入原回应已有，三者不同。不同ID相同方式仍各一人；新增两名步行后步行${final('walk') + 2}、回答9、无回应1、受邀10。可说此组今天步行${final('walk')}人（新增前）；不能推全校最喜欢步行，问题与取样范围都不同。保原记录与更正理由。`,
    `First-five BEFORE:walk=${initial('walk')},bike=${initial('bike')},bus=${initial('bus')},other=1; answered=4,missing=1,entered=5,unentered=3,invited=8. R3 was wrongly entered as Other; its source says ${labels[raw[2]!].en}. Correct the existing row, without an extra person. AFTER:walk=${correct('walk')},bike=${correct('bike')},bus=${correct('bus')},other=0; all record counts stay fixed. COMPLETE:walk=${final('walk')},bike=${final('bike')},bus=${final('bus')},other=0; answered=7,missing=1,invited=8. Covering bike gives 8−1−(${final('walk')}+${final('bus')}+0)=${final('bike')}; do not assign nonrespondents to bike. Zero Other, an unknown nonresponse and available unentered information are distinct. Distinct equal-valued IDs each count once. After two NEW walkers:walk=${final('walk') + 2},answered=9,missing=1,invited=10. Before that addition, this gate group has ${final('walk')} walkers TODAY; it does not establish a school-wide FAVOURITE. Retain originals and correction reasons.`,
    '先按ID对照原回应，记清更正现有行与新增不同人两种动作。',
    'Match entries to source IDs, distinguishing correction of an existing row from adding a new person.',
  );
  table(
    q1,
    [
      '最后三条原回应已存在但还未录入；R3的当前录入需审核。',
      'The last three raw responses exist but are not yet entered; audit R3’s current entry.',
    ],
    [
      ['编号', 'ID'],
      ['原始回应', 'Raw response'],
      ['当前录入', 'Current entry'],
    ],
    raw.map((v, i) => [
      `R${i + 1}`,
      labels[v],
      i >= 5 ? labels.unentered : i === 2 ? labels.other : labels[v],
    ]),
  );
  const a = near ? [0, 3, 9] : [0, 3, 12],
    b = near ? [1, 1, 3] : [1, 2, 4],
    big = near ? [2, 2, 2, 22] : [3, 3, 3, 27],
    totalA = a.reduce((s, v) => s + v, 0),
    totalB = b.reduce((s, v) => s + v, 0),
    totalD = big.reduce((s, v) => s + v, 0),
    meanA = totalA / 3,
    meanD = totalD / 4;
  const q2 = task(
    2,
    'mean-as-fair-share',
    '① A所有零和重复都是有效观测。先求总量与份数，自画卡堆，再每次从较多堆移一张到较少堆，或用总量关系说明公平份额；保留原始A。漏零会回答哪个不同问题？均值必须原来有人恰好拥有吗？② B求精确平均并乘回核总量，说明整张卡不一定真能均分；检表给近似值，三份能精确恢复总量吗？C全零与M另组三条（中间确实缺失）分别怎样处理：M已观测均值和完整三条均值能都确定吗？③ K只给人数与平均，逆求总量，生成两组同人数同总量但分布不同的完整卡数。D中的大值真实有效，说明对平均和多数人的影响；能为喜欢的结果删除吗？卡数与分钟的均值单位能互换吗？',
    '① A includes valid zero and repeated observations. Find total/count, DRAW original piles, then move one card from a larger to a smaller pile or explain equal shares through the total. Preserve original A. What DIFFERENT question does omitting zero answer? Must someone originally hold the mean? ② Find B’s EXACT mean and multiply back; explain why whole cards need not physically equalise. Test the supplied approximate value by multiplying three shares. Compare all-zero C with independent M, whose middle observation is genuinely missing: are its observed-only mean and full three-record mean both known? ③ K supplies count and mean only: recover the total and GENERATE two complete distributions sharing those values. D’s large value is valid; explain its effect and the majority’s actual counts. May it be deleted to obtain a preferred result? Are card and minute units interchangeable?',
    `A总${totalA}张、3条、均值${meanA}张；每次移动保总量与条数，可达${meanA},${meanA},${meanA}。原A没有${meanA}，不妨碍均值。漏零后除2得${frac(totalA, 2)}，那是只在正卡数两条中的平均。B总${totalB}张、3条，均值${frac(totalB, 3)}张，乘3回${totalB}；近似${near ? '1.67' : '2.33'}乘3为${near ? '5.01' : '6.99'}，不等原总，不能截成整张。C总0、三条，均值0，不是无观察。M只有0与${a[2]}两条已观测，均值${frac(a[2]!, 2)}张；完整三条总量未知，不能把缺失补0或抹去后声称资料齐全。K总4×${meanD}=${totalD}张；可全为${meanD}，或D的${big.join(',')}，相同总均值不定每人。D三人仅${big[0]}、一人${big[3]}，均值${meanD}不是多数实际量；保留真实大值并说明影响，不为结论删数。单位跟原观察，卡与分钟不换。`,
    `A:total=${totalA},count=3,mean=${meanA} cards. Moves preserve total/count and can reach ${meanA},${meanA},${meanA}; original A has no ${meanA}. Omitting zero gives ${frac(totalA, 2)} across TWO positive-count observations, a different question. B:total=${totalB},mean=${frac(totalB, 3)} cards; multiply by three to restore ${totalB}. Approximate ${near ? '1.67' : '2.33'} times three is ${near ? '5.01' : '6.99'}, not that total. C has three observations,total=0,mean=0, not no observations. M has observed-only mean=${frac(a[2]!, 2)} from 0 and ${a[2]}; the FULL three-record mean is unknown, not justified by filling zero or concealing a missing record. K:total=4×${meanD}=${totalD}; examples are four ${meanD}s or D’s ${big.join(',')}. D has three ${big[0]}s and one ${big[3]}, so mean=${meanD} need not describe the majority. Retain the valid extreme and explain its influence. Mean units follow original observations; cards and minutes are different.`,
    '先分别数每组有效观察，不把缺失当0；逆求总量不等于恢复每个原值。',
    'Count valid observations in each separate group; missing is not zero, and recovering a total does not recover every original value.',
  );
  table(
    q2,
    [
      'A/B/C/D/M为独立卡堆记录；—是确实缺失，不是零。K为另给摘要。',
      'A/B/C/D/M are separate card-pile records; — is genuinely missing, not zero. K is a separately supplied summary.',
    ],
    [
      ['编号', 'ID'],
      ['含义', 'Meaning'],
      ['原始记录', 'Original record'],
    ],
    [
      ['A', t('三条完整卡数', 'Three complete card counts'), a.join(', ')],
      ['B', t('三条完整卡数', 'Three complete card counts'), b.join(', ')],
      [
        'B_P',
        t('B待检近似均值/张', 'Approximate B mean/cards'),
        near ? '1.67' : '2.33',
      ],
      ['C', t('三条完整卡数', 'Three complete card counts'), '0, 0, 0'],
      [
        'M',
        t('独立三条记录含缺失', 'Independent three records with missing'),
        `0, —, ${a[2]}`,
      ],
      [
        'D',
        t('完整且大值有效', 'Complete, including valid large value'),
        big.join(', '),
      ],
      ['K_N', t('K人数', 'K people'), '4'],
      ['K_M', t('K平均卡数/张', 'K mean/cards'), String(meanD)],
    ],
  );
  const times = near ? [0, 2, 5, 9] : [0, 1, 4, 8],
    temps = near ? [6, 10, 7, 15] : [4, 9, 6, 14],
    gaps = times.slice(1).map((v, i) => v - times[i]!),
    changes = temps.slice(1).map((v, i) => v - temps[i]!);
  const q3 = task(
    3,
    'time-series-reading',
    '① 原表配对记录同一地点的时刻与°C温度，亲画两张相同大小、纵轴分别0–20与0–40的图，横轴每小时同长。标四点、真实时间间距、全部相邻有向温差、降低量正数、每段经过小时和首尾差；两种标尺会改原温度或只改外观？② 原表保留不改，另两个独立假想分支：M的第三时刻确实缺测，Z的第三时刻确实测得0。分别画图，M不跨缺测连线，Z保零点；说明为何不同。给M第三时刻两个与已知端点均不冲突的可能值，能把其中一个当实测吗？插值需要何种额外假设与标签？③ 区分上升量和经过时间，不仅凭更大的温差或不同尺度图的倾角比较变化快慢。末次已测值较高就保证未来上升吗？自编一个下一次较低、却不违反既有记录的可能值。',
    '① The ORIGINAL pairs describe temperatures in °C at one place. DRAW two equal-sized charts with vertical scales 0–20 and 0–40 and equal length per elapsed hour. Plot four observations and label true time gaps, every signed temperature change, the positive fall amount, segment hours and endpoint change. Does rescaling alter readings or appearance? ② Preserve the original table. Draw TWO SEPARATE fictional branches: M truly lacks the third-time reading; Z actually records zero there. Do not bridge M’s missing entry; retain Z’s zero dot. Give TWO possible missing values compatible with known endpoints: may either be called measured? What extra assumption and label would interpolation need? ③ Separate rise amount from duration; larger changes or steeper-looking charts with different scales alone do not compare speeds. Does a higher last observed value guarantee future rise? GENERATE one possible next lower value consistent with the past.',
    `原横向间距${gaps.join(':')}小时，纵轴°C；温差依次${changes.map((v) => (v > 0 ? '+' + v : v)).join(',')}°C，第二段降低量3°C；首尾${temps[3]}−${temps[0]}=${temps[3]! - temps[0]!}°C，与有向温差之和一致，经过小时依次${gaps.join(',')}。纵轴加倍量程使点相对零线高度减半，表中四值不改，温度差与小时不同量。M只有首两点相邻连线，共三已测点且第三时刻留缺口；Z有四点、三相邻段，第三零为有效观测。M中0或20都可对应某种未观察过程，只能作可能性反例，不补成实测；直线插值须另声明线性变化等假设并标估计，不是测值。比较快慢还要时间和同尺度，不能只比温差；未来值例如${temps[3]! - 2}°C也不违背已知点，反驳“保证继续上升”，不是作预测。`,
    `Original time gaps=${gaps.join(':')} hours. Signed changes=${changes.map((v) => (v > 0 ? '+' + v : v)).join(',')}°C; positive fall=3°C; endpoint change=${temps[3]}−${temps[0]}=${temps[3]! - temps[0]!}°C equals their sum. Segment durations=${gaps.join(',')}h. Doubling the vertical range halves heights above zero, not original readings. M has THREE measured dots and ONLY the first adjacent segment; Z has FOUR measured dots and THREE segments, including the genuine zero. For M, third values 0 or 20 illustrate two possible unmeasured paths, not observed replacements. A linear interpolation needs an extra linear-change assumption and an ESTIMATE label. Changes, durations and chart scales all matter; a larger rise alone does not compare speeds. A next value such as ${temps[3]! - 2}°C is compatible with all past points and disproves guaranteed continued rise; it is an example, not a prediction.`,
    '先保留时刻/温度配对；改变显示范围与改成另组观察是不同动作。',
    'Keep time/value pairs intact; changing a display range differs from considering another observation set.',
  );
  table(
    q3,
    [
      '原表完整；M/Z是另组独立分支，不能偷偷覆盖原第三观测。',
      'This original table is complete; M/Z are separate branches, not silent overwrites of its third reading.',
    ],
    [
      ['编号', 'ID'],
      ['经过小时', 'Elapsed hours'],
      ['温度/°C', 'Temperature/°C'],
    ],
    times.map((v, i) => [`T${i + 1}`, String(v), String(temps[i])]),
  );
  const countA = near ? 50 : 60,
    countB = countA + 6,
    baseline = countA - 2,
    max = near ? 60 : 70,
    invited = near ? 12 : 15,
    answered = near ? 9 : 10;
  const q4 = task(
    4,
    'chart-evidence',
    '① A/B为同一小组一年最后两天各日到场人数，每日每人一次、跨日可同人。用相同画布分别画零起点与Z截断起点的两图，保MAX上限，标等间刻度、原人数和断裂。分别求原人数差、原数量比和截断后高出起点的数值及其比；柱高四倍证明人数四倍吗？② 海报标题说“全年人数四倍，全校都赞成”。只选两天能证全年吗？两日合计应叫什么量，能断言不同个体总数吗？给同人复来与两日完全不同两种可能。③ 独立S只给邀请与回答人数，求无回应；能因此知道回答者意见或全校意见吗？改写一条数据支持的事实，并列进一步需要的问题原文、原回答和收集范围。截断是否一定不可用，若用于放大小变化须怎么标示？',
    '① A/B count attendance on the FINAL TWO days of a year for one group: each person once per day, but people may return across days. On equal canvases DRAW a zero-baseline and a Z-truncated chart with maximum MAX. Label uniform ticks, original counts and the break. Calculate count difference/ratio and the amounts ABOVE the truncated baseline and their ratio. Does fourfold bar height establish fourfold attendance? ② The poster claims “Fourfold across the year; the whole school agrees.” Do two selected days prove a year? Name the two-day sum’s unit and explain why it need not count distinct people, using returning versus wholly different groups. ③ Independent S supplies invitations and responses ONLY: find missing responses. Are respondents’ opinions or school opinions known? Rewrite one supported fact and identify missing question wording, raw answers and collection scope. May truncation ever be useful, and what labelling is needed to inspect small changes honestly?',
    `原人数差${countB}−${countA}=6人，原比${frac(countB, countA)}，不是4；截断高出量${countA}−${baseline}=2、${countB}−${baseline}=8，后者为前者4倍。换零起点不改人数，只改画法；标起点、上限、等距刻度、断裂与原值，截断可用于细看但不把截断柱高比当总数比。两日${countA + countB}人次，不必是不同人；可首日全于次日重来（不同人总${countB}）或完全不同（总${countA + countB}），两天不代表全年。S无回应${invited}−${answered}=${invited - answered}人；仅回答人数没有回答内容，连回答者是否赞成都未知，更不能推全校。可写“此组最后两次到场后一次比前一次多6人”；需全年资料/时段选择、同对象单位、抽样与原问题和回答，不能由整齐图形补出。`,
    `Original difference=${countB}−${countA}=6 people; original ratio=${frac(countB, countA)}, not four. Truncated amounts=${countA}−${baseline}=2 and ${countB}−${baseline}=8; height ratio=4. Keep origins, maxima, uniform ticks, break and original counts explicit. Truncation may inspect small changes but does not make height ratios total-count ratios. The two-day sum=${countA + countB} person-visits, not necessarily distinct people. All earlier attendees could return, giving ${countB} distinct people, or the days could be disjoint, giving ${countA + countB}. Two selected days do not establish a year. S:missing=${invited}−${answered}=${invited - answered}; response counts alone do not even reveal RESPONDENTS’ opinions, much less school agreement. A supported fact is six more attendees in the later of these two records. Seek full periods/selection reasons, consistent objects/units, sampling, question wording and raw answers.`,
    '把人数、超过基线的差与人次分开；作答人数不是赞成人数。',
    'Separate people, amounts above baseline and person-visits; respondent counts are not agreement counts.',
  );
  table(
    q4,
    [
      'A/B为末两天各日人数；Z/MAX是图轴，S为独立受邀调查计数，无意见内容。',
      'A/B are final-two-day attendance counts; Z/MAX specify axes. S is an independent invitation survey with no opinion contents supplied.',
    ],
    [
      ['编号', 'ID'],
      ['量名', 'Quantity'],
      ['原始记录', 'Original record'],
    ],
    [
      ['A', t('较早日到场人数', 'Earlier-day people'), String(countA)],
      ['B', t('较晚日到场人数', 'Later-day people'), String(countB)],
      ['Z', t('截断起点/人', 'Truncated baseline/people'), String(baseline)],
      ['MAX', t('纵轴上限/人', 'Vertical maximum/people'), String(max)],
      ['S_I', t('S邀请人数', 'S invited'), String(invited)],
      ['S_R', t('S回答人数', 'S respondents'), String(answered)],
    ],
  );
  const base = near ? 4 : 5,
    flour = near ? 160 : 250,
    milk = near ? 240 : 400,
    packF = near ? 400 : 500,
    packM = near ? 750 : 1000,
    priceF = near ? 225 : 260,
    priceM = near ? 280 : 315,
    budget = priceF + priceM,
    highBudget = near ? 800 : 900,
    targets = near ? [4, 10, 11] : [5, 10, 11],
    stock = near ? 40 : 50;
  const plans = targets.map((n) => {
    const f = (flour * n) / base,
      m = (milk * n) / base,
      nf = Math.ceil(f / packF),
      nm = Math.ceil(m / packM);
    return {
      n,
      f,
      m,
      nf,
      nm,
      cost: nf * priceF + nm * priceM,
      lf: nf * packF - f,
      lm: nm * packM - m,
    };
  });
  const ledger = (english: boolean) =>
    plans
      .map((p) =>
        english
          ? `n=${p.n}:need=${p.f}g/${p.m}mL,packs=${p.nf}/${p.nm},paid=${p.cost}c,left=${p.lf}g/${p.lm}mL,budgetDifference=${budget - p.cost}c`
          : `${p.n}份：需${p.f}g/${p.m}mL，包数${p.nf}/${p.nm}，付款${p.cost}分，余料${p.lf}g/${p.lm}mL，预算差${budget - p.cost}分`,
      )
      .join(english ? '; ' : '；');
  const q5 = task(
    5,
    'recipe-and-pack-budget',
    '① 按原配方，为T三个目标份数独立列用量、最少够用整包数、买到的量、整数分付款、余料与预算结果；每种包数既验证够用，也验证少一包会不足。比较前两种和跨边界的第三种：用量同比，付款也总同比吗？金额差为0、正、负各怎样命名，短缺要报正金额。② 第三种份数改用H预算，重新给付款、余钱；余料是否自动抵付款，能将g、mL和钱相加吗？③ 独立库存分支S有表给面粉库存、牛奶0，仍做第三种份数；先扣库存再买整包，重新核购买、付款、余料。能把该分支的库存偷偷用在原零库存计划吗？全部是假想纸笔活动，无额外费或退款，不采购烹饪。',
    '① Independently tabulate requirements, LEAST sufficient whole-pack counts, purchased amounts, integer-cent payment, leftovers and budget status for ALL THREE T serving counts. Verify sufficiency AND why one fewer pack of each ingredient fails. Compare the first two cases and the third across a pack boundary: must payment scale like consumption? Label zero/positive/negative budget differences correctly, reporting a POSITIVE shortfall. ② For the third case use budget H and recalculate payment and money left. Do leftovers automatically reduce payment, or may g, mL and money be added? ③ In SEPARATE stock branch S, use its flour stock and zero milk stock for that third serving count. Deduct stock BEFORE buying whole packs, then recheck purchases, payment and leftovers. May S’s stock silently be used in the original zero-stock cases? Everything is fictional paper work with no extra fees/refunds, purchase or cooking.',
    `${ledger(false)}。买到量分别为面粉包数×${packF}g、奶包数×${packM}mL，使用后余量如表；包数需整数，四舍五入或只按用掉份额付款不满足整包条件。前两种付款相同${budget}分且预算刚好，第三种付款${plans[2]!.cost}分、短缺${plans[2]!.cost - budget}分，不称负余额。第三种用H=${highBudget}分预算时余${highBudget - plans[2]!.cost}分，原购买与用量不改。库存分支S先用面粉${stock}g后还需${plans[2]!.f - stock}g，买1包面粉、1包奶，付${budget}分；最终面粉余0g、奶余${plans[2]!.lm}mL，按原预算刚好。S与零库存原计划不同，不能互借假设。余料不是退款，各单位分列，不混相加。`,
    `${ledger(true)}. Purchased amounts are flour packs×${packF}g and milk packs×${packM}mL. Counts must be whole, sufficient and minimal; rounding down or paying only consumed fractions violates the conditions. The first TWO payments both equal ${budget}c, exactly the original budget. The third costs ${plans[2]!.cost}c with POSITIVE shortfall=${plans[2]!.cost - budget}c, not money left. With H=${highBudget}c, third-case money left=${highBudget - plans[2]!.cost}c; requirements/purchases stay fixed. SEPARATE stock branch: after ${stock}g flour stock, buy the remaining ${plans[2]!.f - stock}g as ONE flour pack plus ONE milk pack, paid=${budget}c, flour left=0g,milk left=${plans[2]!.lm}mL, exactly the original budget. Do not import stock into zero-stock cases. Leftovers earn no refund; keep grams, millilitres and cents in separate columns.`,
    '需求先按份数算，库存另分支；最少整包须同时够用且少一包不够。',
    'Scale requirements first and isolate the stock branch; least whole packs must suffice while one fewer fails.',
  );
  table(
    q5,
    [
      '原T三计划都从零库存、整包销售、无其他费用、余料不退钱；价格为假想整数分。S另给库存。',
      'Original T plans start with zero stock, whole packs only, no extra fees and no leftover refund; fictional prices are integer cents. S separately supplies stock.',
    ],
    [
      ['编号', 'ID'],
      ['量名与单位', 'Quantity and unit'],
      ['原始记录', 'Original record'],
    ],
    [
      ['N', t('原配方份数', 'Base servings'), String(base)],
      ['F', t('原配方面粉/g', 'Base flour/g'), String(flour)],
      ['M', t('原配方牛奶/mL', 'Base milk/mL'), String(milk)],
      ['F_Q', t('面粉每包/g', 'Flour per pack/g'), String(packF)],
      ['M_Q', t('牛奶每包/mL', 'Milk per carton/mL'), String(packM)],
      ['F_C', t('面粉每包价/分', 'Flour pack price/cents'), String(priceF)],
      ['M_C', t('牛奶每盒价/分', 'Milk carton price/cents'), String(priceM)],
      ['T', t('目标份数', 'Target servings'), targets.join(', ')],
      ['B', t('原预算/分', 'Original budget/cents'), String(budget)],
      [
        'H',
        t('第三计划另预算/分', 'Other third-case budget/cents'),
        String(highBudget),
      ],
      ['S_F', t('S已有面粉/g', 'S existing flour/g'), String(stock)],
      ['S_M', t('S已有牛奶/mL', 'S existing milk/mL'), '0'],
    ],
  );
  return {
    id: `${unit}-MAINT-DATA-MEANING`,
    unit,
    title: t(
      '还原记录、尺度与整包决策',
      'Reconstruct records, scales and whole-pack decisions',
    ),
    bridge: 'P57-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P57-L0${n}`]),
    ),
    intro: t(
      '五张过程卡分多次，一次一个编号小问或一行，不计时。先保留原始资料、自己整理/画图/计算并写理由，再逐项人工核查后确认。读题协助与数学提示分开，可口述或用熟悉语言。全部回应、温度、人数、配方与价格均为假想，无需真实调查、出行、购物或烹饪。',
      'Split FIVE process cards across sittings, ONE numbered part or row at a time without a timer. Preserve originals, independently organise/draw/calculate and explain before human review of every part. Separate reading help from mathematical hints; oral or familiar-language explanations are welcome. All responses, readings, counts, recipes and prices are fictional; no real survey, travel, purchase or cooking is needed.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const dataMeaningRetrieval = {
  P68_DATA_MEANING: makeSet('P68'),
  J76_DATA_MEANING: makeSet('J76'),
};
