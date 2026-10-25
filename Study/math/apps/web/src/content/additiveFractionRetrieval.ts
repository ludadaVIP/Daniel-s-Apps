import { t, type Question } from '../model';
import { reasoning } from './builders';
type F = { n: number; d: number };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const f = (text: string): F => {
  const [n, d = 1] = text.split('/').map(Number);
  return { n: n!, d };
};
const text = (a: F) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
const simplify = (a: F): F => {
  const g = gcd(a.n, a.d);
  return { n: a.n / g, d: a.d / g };
};
const op = (a: F, b: F, sign: '+' | '−'): F =>
  simplify({
    n: a.n * b.d + (sign === '+' ? 1 : -1) * b.n * a.d,
    d: a.d * b.d,
  });
const trace = (
  a: F,
  b: F,
  sign: '+' | '−',
  d = (a.d / gcd(a.d, b.d)) * b.d,
) => {
  const an = (a.n * d) / a.d,
    bn = (b.n * d) / b.d,
    n = sign === '+' ? an + bn : an - bn,
    v = text(simplify({ n, d }));
  return `${text(a)}${sign}${text(b)}=${an}/${d}${sign}${bn}/${d}=${n}/${d}=${v}; ${v}${sign === '+' ? '−' : '+'}${text(b)}=${text(a)}`;
};
const makeSet = (unit: 'P55' | 'P61') => {
  const first = unit === 'P55',
    id = (n: number) => `${unit}-MAINT-FRACTION-ADDITIVE-Q${n}`;
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
        '一次只做一个小问，先画、列关系和单位，再核全部小问；终值或关键词不自动表示理解。',
        'Do ONE subpart at a time. Draw, state relationships and units, then review EVERY part; final values or keywords do not automatically establish understanding.',
      ),
    ]);
  const table = (
    q: Question,
    zh: string,
    en: string,
    headers: [string, string][],
    rows: (string | ReturnType<typeof t>)[][],
  ) => {
    q.contextTable = {
      caption: t(zh, en),
      columns: headers.map((h) => t(...h)),
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };
  const pairs = [
    ['编号', 'ID'],
    ['左量', 'Left amount'],
    ['右量', 'Right amount'],
  ] as [string, string][];
  const roles = [
    ['编号', 'ID'],
    ['量的含义', 'Quantity meaning'],
    ['给定值', 'Given value'],
  ] as [string, string][];
  const likeD = first ? 6 : 8,
    adds = [
      [first ? 5 : 7, first ? 7 : 9],
      [0, first ? 5 : 7],
      [first ? 11 : 13, first ? 10 : 15],
    ],
    jugA = first ? 2 : 3,
    jugB = first ? 3 : 5;
  const addTrace = adds
    .map(
      ([a, b], i) =>
        `${['A', 'B', 'C'][i]}:${trace({ n: a!, d: likeD }, { n: b!, d: likeD }, '+')} L`,
    )
    .join('. ');
  const q1 = task(
    1,
    'add-like-fractions',
    '① A/B/C都按1L整体计量；先画同大小整条、标每小份单位，合并并保原分母，再写最简分数或整数，各用减回核查。为何分母不能相加，B的零有何意义？② C含几个完整升，最少几条轮廓才能容纳全部涂色？每整条大小可变吗，和必须小于1吗？先估范围再算；同值但未按指定形式写完不等于数量错误。③ D给两壶容量L，各取半壶，先换算实际升数再合并，并与“一整壶左壶容量”比较；同分母能免除整体检查吗？',
    '① A/B/C use ONE LITRE as the measurement whole. DRAW equal whole strips, label each piece unit, join while retaining the original denominator, then give simplest fractions or integers and subtract back to check. Why not add denominators, and what does B’s zero mean? ② For C state complete litres and minimum outlines holding all shading. May whole widths change, or must a sum stay below one? Estimate first; equivalent but unfinished form is not a wrong quantity. ③ D gives two jug capacities in litres; take HALF of each. Convert to actual litres before joining and compare with one full LEFT jug. Do matching denominators remove the need to check wholes?',
    `${addTrace}。估算A在1与3L之间、B不足1L、C两加数均在1与2L之间故和在2与4L之间。每份仍1/${likeD}L，B零不增加份。A结果2L；C为7/2L=3 1/2L，完整3升、需4轮廓，每条仍1L，不漏整升或把分母改成两倍。D:${jugA}/2+${jugB}/2=${text(simplify({ n: jugA + jugB, d: 2 }))}L，不等于左壶${jugA}L；两个半壶的整体不同。原分母写法、最简分数与整数的数量等价，但须完成所要求的形式。`,
    `${addTrace}. Estimate A between one and three litres and B below one. Each C addend is between one and two, so its sum is between two and four litres. Each piece remains 1/${likeD} L; B adds no pieces. A gives 2 L; C gives 7/2 L=3 1/2 L, THREE complete litres but FOUR required outlines. Every whole remains one litre; do not drop whole litres or double denominators. D:${jugA}/2+${jugB}/2=${text(simplify({ n: jugA + jugB, d: 2 }))} L, not the left jug’s ${jugA} L. The half-jugs use different wholes. Original-denominator, simplest and integer representations can be equal quantities while serving different form requirements.`,
    '先标1L及每份单位，再区分完整数与装下全部涂色的轮廓数。',
    'Label one litre and the piece unit, then distinguish filled wholes from outlines holding all shading.',
  );
  table(
    q1,
    'A/B/C为独立升数相加；D左右数为两壶容量L，均取一半。',
    'A/B/C add independent litre amounts; D gives jug capacities in litres, HALF of each.',
    pairs,
    [
      ...adds.map(([a, b], i) => [
        ['A', 'B', 'C'][i]!,
        `${a}/${likeD}`,
        `${b}/${likeD}`,
      ]),
      ['D', String(jugA), String(jugB)],
    ],
  );

  const sd = first ? 8 : 10,
    subPairs = [
      ['A', `${first ? 13 : 17}/${sd}`, `${first ? 5 : 7}/${sd}`],
      ['B', `${first ? 5 : 7}/${sd}`, `${first ? 5 : 7}/${sd}`],
      ['C', '1', `3/${sd}`],
      ['D', `3/${sd}`, `${first ? 5 : 7}/${sd}`],
      ['E', `${sd}/${sd}`, `0/${sd}`],
    ];
  const subTrace = subPairs
    .filter((r) => r[0] !== 'D')
    .map(([key, a, b]) => `${key}:${trace(f(a!), f(b!), '−')} m`)
    .join('. ');
  const q2 = task(
    2,
    'subtract-like-fractions',
    '① 每行以1m计量，先命名原有/去掉/剩余。A/B/C/E画同尺度格，划去指定份并保分母，给最简结果，剩余加去掉量还原。C先把整数换成同单位份，A原量超过1也要完整画。② B空了为什么仍可保整体标尺，零差可写0/0吗？E减零是否严格变小？约分会丢掉剩余实物吗？③ D先比较可否划去。不能调换两量、改小去掉量或把不足截成0；说清当前非负实物模型的边界，后续才研究有向负数。',
    '① Every row measures metres with a ONE-METRE reference. Name original/removed/remaining. For A/B/C/E DRAW equal-scale tiles, cross out the required count, retain the denominator, simplify and add back. Convert C’s integer to matching pieces first, and retain A’s amount above one whole. ② Why does empty B retain its reference? Is 0/0 a zero answer? Must E decrease strictly when subtracting zero? Does simplifying discard material? ③ For D compare availability BEFORE removing. Do not swap operands, shrink the removal or force a zero answer; explain this non-negative material model’s boundary, with signed negatives studied later.',
    `${subTrace}。A与E均1m，B为0m不是0/0；C的1m=${sd}/${sd}m。每个未去掉格大小不变，空白格仍属于原1m标尺；约分保剩余端点。D原有3/${sd}m小于去掉${first ? 5 : 7}/${sd}m，不足以划去；颠倒后虽能算，但换了情境，不得给0冒充原结果。减去正量时剩余变小，减0保持原量。`,
    `${subTrace}. A and E give one metre; B gives 0 m, never 0/0. C first writes 1 m=${sd}/${sd} m. Remaining tiles do not resize; empty background retains the one-metre reference. Simplification preserves the shaded endpoint. D starts with 3/${sd} m but removes ${first ? 5 : 7}/${sd} m, which exceeds availability. Reversal changes the story and zero is not its answer. Removing a positive amount decreases the remainder; subtracting zero leaves it unchanged.`,
    '整数先换成分母个小份；用加回核查，遇不足先说边界。',
    'Exchange an integer for denominator-many pieces. Check by adding back and explain insufficient material before calculating.',
  );
  table(
    q2,
    '每行独立求剩余米数；D专门检查可划去的范围。',
    'Independent metre remainders; D tests the availability boundary.',
    pairs,
    subPairs,
  );

  const ua = first ? '5/6' : '7/10',
    ub = first ? '1/4' : '5/6',
    af = f(ua),
    bf = f(ub),
    lcd = (af.d / gcd(af.d, bf.d)) * bf.d,
    highA = first ? '1/11' : '2/11',
    zeroA = first ? '0/5' : '0/4',
    zeroB = first ? '3/10' : '5/8',
    km = first ? '3/5' : '7/10',
    metres = first ? '1/4' : '3/4';
  const length = op({ n: f(km).n * 1000, d: f(km).d }, f(metres), '+');
  const q3 = task(
    3,
    'add-unlike-fractions',
    '① A先估和的范围，再列最小共同分母与两倍共同分母两条完整等值链；各分子应乘自己的哪个倍数？画同整体、端点不移动的细分并合并，减回核查。用两倍分母的指定写法与最简形式各写一个，值相同但要求有别。分母和能用吗，何谓“共同分母被原分母整除”？② B含零量，H用11与12作原分母。H先独立预测，再用原工作台生成132等格或分段纸图，核每整条真实格数、两个涂色计数与和；不能用少量大格冒充132格，纸图分段须保完整编号。③ U左为km、右为m，先换成同实际单位，再统一分数单位并求和；只通分原分数为什么不成立？',
    '① Estimate A’s sum, then write complete chains using the least common denominator and DOUBLE that denominator. Find EACH numerator’s own scale factor. DRAW unchanged-whole refinements with fixed endpoints, join and subtract back. Give both the requested doubled-denominator result and simplest form: equal value does not erase form requirements. Does the denominator SUM work? Explain why both original denominators must DIVIDE the new one. ② B includes zero. H uses denominators eleven and twelve: predict independently, then generate an actual 132-part grid in the original workshop or on sectioned paper. Verify real cells per whole, both shaded counts and the sum. Do not substitute a few large tiles; a paper diagram may wrap while retaining all piece indices. ③ U is kilometres on the LEFT and metres on the RIGHT. Align actual measurement units BEFORE fraction units, then add. Why is merely giving the original fractions a common denominator insufficient?',
    `A:${trace(af, bf, '+', lcd)} L；另${trace(af, bf, '+', 2 * lcd)} L。原分母${af.d}对应${lcd / af.d}倍细分，原分母${bf.d}对应${lcd / bf.d}倍细分；和在1与2之间：${first ? '5/6>3/4，再加1/4超过1' : '两个加数均大于1/2'}，且各加数<1。${2 * lcd}分母结果${2 * ((af.n * lcd) / af.d + (bf.n * lcd) / bf.d)}/${2 * lcd}与最简${text(op(af, bf, '+'))}同值；分母和${af.d + bf.d}不可作公倍数。B:${trace(f(zeroA), f(zeroB), '+')} L。H:${trace(f(highA), f('1/12'), '+', 132)} L，每整条132格。U:${km}km=${text(simplify({ n: f(km).n * 1000, d: f(km).d }))}m，与${metres}m相加得${text(length)}m=${text(simplify({ n: length.n, d: length.d * 1000 }))}km；不能把km比例和米数裸加。`,
    `A:${trace(af, bf, '+', lcd)} L. Also ${trace(af, bf, '+', 2 * lcd)} L. Original denominator ${af.d} requires factor ${lcd / af.d}; original denominator ${bf.d} requires factor ${lcd / bf.d}; the sum lies between one and two: ${first ? '5/6 exceeds 3/4, so adding 1/4 passes one' : 'both addends exceed one half'}, and both addends are below one. Requested denominator ${2 * lcd} gives ${2 * ((af.n * lcd) / af.d + (bf.n * lcd) / bf.d)}/${2 * lcd}, equal to simplest ${text(op(af, bf, '+'))}. Denominator sum ${af.d + bf.d} is not a common multiple. B:${trace(f(zeroA), f(zeroB), '+')} L. H:${trace(f(highA), f('1/12'), '+', 132)} L, with 132 actual cells per whole. U:${km} km=${text(simplify({ n: f(km).n * 1000, d: f(km).d }))} m; adding ${metres} m gives ${text(length)} m=${text(simplify({ n: length.n, d: length.d * 1000 }))} km. Do not add a kilometre fraction directly to a metre quantity.`,
    '实际单位与分数单位是两次核对；每个分子的倍数来自自己的分母。',
    'Measurement units and fraction units need separate checks. Each numerator uses its own denominator’s scale factor.',
  );
  table(
    q3,
    'A/B/H相加的单位为L；U左为km、右为m。',
    'A/B/H add litres; U is kilometres LEFT, metres RIGHT.',
    pairs,
    [
      ['A', ua, ub],
      ['B', zeroA, zeroB],
      ['H', highA, '1/12'],
      ['U', km, metres],
    ],
  );

  const subA = first ? '11/6' : '19/12',
    subB = first ? '3/4' : '2/3',
    sa = f(subA),
    sb = f(subB),
    slcd = (sa.d / gcd(sa.d, sb.d)) * sb.d;
  const unlikeSubs = [
    ['A', subA, subB],
    ['B', first ? '3/5' : '5/6', first ? '6/10' : '10/12'],
    ['C', '1', first ? '5/12' : '7/10'],
    ['D', first ? '1/4' : '2/5', first ? '2/3' : '3/4'],
    ['E', first ? '5/7' : '7/9', first ? '0/3' : '0/4'],
  ];
  const unlikeTrace = unlikeSubs
    .filter((r) => r[0] !== 'D')
    .map(([key, a, b]) => `${key}:${trace(f(a!), f(b!), '−')} L`)
    .join('. ');
  const q4 = task(
    4,
    'subtract-unlike-fractions',
    '① 每行以1L为整体，先比较可去掉多少；对A/B/C/E保原顺序通分、画细格和划去叉号，再给最简结果并加回。A用最小及两倍共同分母两条链；原量超过1、结果也可能超过1，不要丢整升。② B不同写法能否同量而差为零？C整数如何换小单位？E去掉0时为何不严格变小？③ D实物不足时说明边界，不能交换原有量与去掉量，也不能把差改0。通分改变的是份数和小单位，不改变原有或去掉的量。',
    '① Every whole is ONE LITRE. Check availability, retain order and convert A/B/C/E to common units. DRAW fine tiles and removal crosses, simplify and add back. For A use both the least and doubled common denominator. The original and even the result may exceed one; retain whole litres. ② Can B’s different writings be equal and give zero? How does C exchange its integer into small pieces? Why does E not decrease strictly when removing zero? ③ D lacks enough material: explain the boundary without swapping original/removal or replacing its difference by zero. Conversion changes the piece count and unit, not either original amount.',
    `${unlikeTrace}。A另用${2 * slcd}：${trace(sa, sb, '−', 2 * slcd)} L，原量和去掉量均不变。B为0L，不是0/0；C先换为${f(unlikeSubs[2]![2]!).d}/${f(unlikeSubs[2]![2]!).d}L。E减0保持原升数，去掉正量才严格减小。D:${unlikeSubs[3]![1]}L小于${unlikeSubs[3]![2]}L，当前实物不足；不交换、不截零，后续负数另有解释。每次剩余加去掉应恢复原量，图中完整整体同宽。`,
    `${unlikeTrace}. A also uses ${2 * slcd}: ${trace(sa, sb, '−', 2 * slcd)} L, preserving both amounts. B is 0 L, not 0/0. C first writes ${f(unlikeSubs[2]![2]!).d}/${f(unlikeSubs[2]![2]!).d} L. E subtracts zero and retains its amount; only positive removal strictly decreases it. D:${unlikeSubs[3]![1]} L is below ${unlikeSubs[3]![2]} L, so material is insufficient. Do not reverse or truncate; signed negatives belong to later work. Add remaining and removed amounts to recover each original; full diagram wholes have equal widths.`,
    '比较在先、通分保量、减法保序、加回检查，四件事分别核。',
    'Check availability, conserved conversion, subtraction order and adding back as four separate conditions.',
  );
  table(
    q4,
    '各行独立求剩余L；D检查当前非负实物范围。',
    'Independent litre remainders; D tests this non-negative material model.',
    pairs,
    unlikeSubs,
  );

  const ma = first ? 2 : 3,
    mb = first ? 3 : 4,
    used = first ? '3/4' : '5/6',
    mt = simplify({ n: ma + mb, d: 2 }),
    mr = op(mt, f(used), '−');
  const nt = first ? '2' : '3/2',
    n1 = first ? '2/3' : '1/4',
    n2 = first ? '3/4' : '2/3',
    nu = op(f(n1), f(n2), '+'),
    ni = op(f(nt), f(n1), '−'),
    nr = op(f(nt), nu, '−');
  const route = first ? 3 : 4,
    rp = first ? '1/4' : '1/3',
    extra = '1/2',
    distance = op({ n: route * f(rp).n, d: f(rp).d }, f(extra), '+'),
    routeFraction = simplify({ n: distance.n, d: distance.d * route }),
    distance2 = op({ n: 2 * route * f(rp).n, d: f(rp).d }, f(extra), '+'),
    rf2 = simplify({ n: distance2.n, d: distance2.d * 2 * route });
  const moneyA = first ? '7/8' : '9/10',
    moneyB = first ? '3/8' : '1/4',
    fa = first ? 5 : 7,
    fb = first ? 4 : 5;
  const q5 = task(
    5,
    'fraction-story-relationship',
    '① M为两壶容量，各装半壶，合并后用去M_U升；先说所求对象和两步计划，写各壶实际L、中间总L、最终剩余L，逆查恢复两壶。② N从给定原有L先后用两次：分别用“先合计用量再减”和“逐次减”完成，写中间量与单位，加回两次用量。③ R先走全程的R_P，再走R_E km，给实际km与全程比例；只将全程R_T翻倍而保持这两条用量条件，重新计算，为何缺全程长度不能直接加比例与km？④ S钱数相减给NZ$最简结果，钱数能和硬币枚数混加吗？⑤ 自编纸上1L水活动：12等格，选正整数a、b作两次用去的格数，a+b≤12；画不重叠去掉格、给两种计划与剩余，全部可行选择都可，刚好用完也合法。仅用假想数据，无需倒水、采购或出行。',
    '① M gives two jug CAPACITIES, each HALF full; combine, then use M_U litres. Name the unknown and plan both steps, giving each actual litre amount, the intermediate total and final remainder. Reverse-check both original jugs. ② N starts with a stated litre amount and makes two uses: solve by “add uses, then subtract” AND successive subtraction, retaining intermediates and units, then add both uses back. ③ R first covers fraction R_P of the route, then R_E kilometres. Find actual kilometres and fraction of the route. DOUBLE only total route R_T while retaining those two conditions and recalculate. Why can a route fraction not simply be added to kilometres when total length is missing? ④ Subtract S money amounts in NZ$, in simplest form. May money amounts be mixed with coin counts? ⑤ GENERATE a paper one-litre activity on TWELVE equal tiles: choose POSITIVE integer counts a,b with a+b≤12 for two uses; cross out nonoverlapping tiles, give BOTH plans and the remainder. ALL feasible choices are valid, including exactly using up the litre. Fictional data require no pouring, purchase or trip.',
    `M:${ma}/2+${mb}/2=${text(mt)}L；${trace(mt, f(used), '−')} L，最终${text(mr)}L，剩余加用量回中间总量，再减右壶回左壶。N两次用量${trace(f(n1), f(n2), '+')} L；原量${nt}L−合计${text(nu)}L=${text(nr)}L；逐次${nt}−${n1}=${text(ni)}，再${text(ni)}−${n2}=${text(nr)}L；${text(nr)}+${n1}+${n2}=${nt}L。R:${route}×${rp}+${extra}=${text(distance)}km，占全程${text(routeFraction)}；全程${2 * route}km时走${text(distance2)}km，占${text(rf2)}，不能缺R_T而宣称直接加分数。S:${trace(f(moneyA), f(moneyB), '−')} NZ$，不是硬币枚数。纸上一例a=${fa},b=${fb}，用${fa}/12、${fb}/12L，余${text(simplify({ n: 12 - fa - fb, d: 12 }))}L；也可先1−${fa}/12再−${fb}/12。任何正整数a,b且a+b≤12、图无重叠与关系核对一致的方案都可；a+b=12时0L，0/0无定义。`,
    `M:${ma}/2+${mb}/2=${text(mt)} L. ${trace(mt, f(used), '−')} L; final ${text(mr)} L. Add use back for the intermediate total, then remove the right jug to recover the left. N uses: ${trace(f(n1), f(n2), '+')} L. Original ${nt} L minus used ${text(nu)} L gives ${text(nr)} L. Successively: ${nt}−${n1}=${text(ni)}, then ${text(ni)}−${n2}=${text(nr)} L. Add back: ${text(nr)}+${n1}+${n2}=${nt} L. R:${route}×${rp}+${extra}=${text(distance)} km, fraction ${text(routeFraction)} of the route. At total ${2 * route} km, distance=${text(distance2)} km and route fraction=${text(rf2)}. Missing R_T cannot justify simply adding the fractions. S:${trace(f(moneyA), f(moneyB), '−')} NZ$, never a coin count. ONE paper example: a=${fa},b=${fb}; uses ${fa}/12 and ${fb}/12 L, remainder ${text(simplify({ n: 12 - fa - fb, d: 12 }))} L. Alternatively subtract ${fa}/12 then ${fb}/12 from one. Accept ANY positive integers a,b with a+b≤12, nonoverlapping tiles and consistent relationships; a+b=12 leaves 0 L, not undefined 0/0.`,
    '每个中间量都命名、带单位；比例先找整体，别让“再”字决定加减。',
    'Name every intermediate with its unit. Identify a proportion’s whole instead of letting “then” decide addition or subtraction.',
  );
  table(
    q5,
    'M合并后使用，N两次使用，R步道与S钱数是独立故事；F纸上自编。',
    'M combines then uses; N has two uses. R route and S money are SEPARATE stories; F is paper generation.',
    roles,
    [
      ['M_A', t('左壶容量/L', 'Left jug capacity/L'), String(ma)],
      ['M_B', t('右壶容量/L', 'Right jug capacity/L'), String(mb)],
      ['M_U', t('合并后用去/L', 'Used after combining/L'), used],
      ['N_T', t('原有/L', 'Original/L'), nt],
      ['N_1', t('第一次用去/L', 'First use/L'), n1],
      ['N_2', t('第二次用去/L', 'Second use/L'), n2],
      ['R_T', t('全程/km', 'Route total/km'), String(route)],
      ['R_P', t('第一段占全程', 'First leg / route'), rp],
      ['R_E', t('后走/km', 'Extra leg/km'), extra],
      ['S_A', t('原有/NZ$', 'Money original/NZ$'), moneyA],
      ['S_B', t('花去/NZ$', 'Spent/NZ$'), moneyB],
      ['F', t('每1L等格数', 'Equal cells per litre'), '12'],
    ],
  );
  return {
    id: `${unit}-MAINT-FRACTION-ADDITIVE`,
    unit,
    title: t(
      '先对齐单位，再合并或划去',
      'Align units before joining or removing',
    ),
    bridge: 'P54-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P54-L0${n}`]),
    ),
    intro: t(
      '五张过程卡分多次，一次只做一个编号小问，不计时。先画同整体图、标单位、写自己的过程，全部小问核齐才确认；读题帮助与数学提示分开，可口述或用熟悉语言。均为假想纸上记录，不是家庭实测，不需采购、倒水、剪绳或出行。',
      'Split FIVE process cards across sittings, ONE NUMBERED SUBPART at a time without a timer. Draw common-whole diagrams, label units and generate your own reasoning before reviewing EVERY part. Separate reading help from maths hints; oral or familiar-language explanations are welcome. All records are fictional paper activities, not family observations; no purchase, pouring, cutting or travel is required.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const additiveFractionRetrieval = {
  P55_ADDITIVE: makeSet('P55'),
  P61_ADDITIVE: makeSet('P61'),
};
