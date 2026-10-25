import { t, type Question } from '../model';
import { reasoning } from './builders';
import { ratio, ratioText, decimalText } from '../percentModels';
const f = (n: number, d = 1) => ratioText(ratio(n, d));
const dec = (n: number, d = 1) => decimalText(ratio(n, d))!;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const simplest = (a: number, b: number) => {
  const g = gcd(a, b);
  return `${a / g}:${b / g}`;
};
const makeSet = (unit: 'P68' | 'J75') => {
  const near = unit === 'P68';
  const id = (n: number) => `${unit}-MAINT-RATIO-MEANING-Q${n}`;
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
        '一次一个编号小问，可分多次。先自己画图、列单位/数量关系并说理由，再逐项人工核查。读题协助与数学提示分开。',
        'Do ONE numbered part per sitting if useful. Independently draw, label units and quantity relationships and explain before human review of EVERY part. Separate reading assistance from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '各编号是本卡给定条件；修改与另题按题干区分，待求比、量与图须自己生成。',
        'IDs give the card’s conditions; distinguish modifications and separate questions as specified. Generate requested ratios, amounts and diagrams yourself.',
      ),
      columns: [t('编号', 'ID'), t('条件', 'Condition'), t('给定值', 'Given')],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const aCm = near ? 75 : 120,
    bCm = near ? 125 : 180;
  const q1 = task(
    1,
    'ratio-order-and-reference',
    '① A和B为同类长度，单位不同。先各写成厘米，再画同一厘米小单位的两条，分别给A:B、B:A、A:(A+B)、A占合长的分数和B比A多多少厘米。说明冒号的两项、除法比值与带单位的差分别回答什么，不能用一个裸分数替代所有答案。② 两条都加倍，重新核合长、比和差；同一比是否保留原实际长度与原差？用米再写一遍A:B，说明共同单位改变不改变真实比较。③ 独立把A改0、B保原正长，哪些比值仍可定义？A:B如何最简，B:A和0:0为何不能用除法给比值？',
    '① A and B measure the SAME kind of length in different units. Convert BOTH to cm, DRAW bars in a shared cm unit, then give A:B, B:A, A:(A+B), A as a fraction of their combined length, and how many cm B exceeds A. Distinguish colon terms, a division quotient and a measured difference; one bare fraction cannot answer all questions. ② Double BOTH lengths and recheck total, ratios and difference. Does the same ratio retain the original actual amounts or difference? Re-express A:B using metres too: does a common unit change the physical comparison? ③ Separately set A=0 while retaining positive B. Which quotients remain defined? Simplify A:B and explain why B:A and 0:0 cannot define division quotients.',
    `A=${aCm}cm、B=${bCm}cm；A:B=${simplest(aCm, bCm)}、B:A=${simplest(bCm, aCm)}、A:合长=${simplest(aCm, aCm + bCm)}，A占${f(aCm, aCm + bCm)}；比值A/B=${f(aCm, bCm)}无量纲，差${bCm - aCm}cm有长度单位，合长${aCm + bCm}cm。两条加倍后合长${2 * (aCm + bCm)}cm、差${2 * (bCm - aCm)}cm，比不变但实际量和差都加倍。米单位${dec(aCm, 100)}:${dec(bCm, 100)}同最简比，不能混比原${dec(aCm, 100)}和${bCm}。零A时0:${bCm}=0:1，比值0，A占合长0；B:A后项0与0:0都不能除零，0:0不是1:1。`,
    `A=${aCm}cm and B=${bCm}cm. A:B=${simplest(aCm, bCm)}, B:A=${simplest(bCm, aCm)}, A:combined=${simplest(aCm, aCm + bCm)} and A’s fraction=${f(aCm, aCm + bCm)}. Quotient A/B=${f(aCm, bCm)} is dimensionless; difference=${bCm - aCm}cm and total=${aCm + bCm}cm are lengths. Doubling gives total=${2 * (aCm + bCm)}cm and difference=${2 * (bCm - aCm)}cm, retaining ratios but not actual quantities. In metres, ${dec(aCm, 100)}:${dec(bCm, 100)} has the same simplest ratio; mixing ${dec(aCm, 100)} with ${bCm} omits unit conversion. At A=0, 0:${bCm}=0:1 and the quotient/share of total are zero. B:A has a zero second term, and 0:0 is also undefined, not 1:1.`,
    '先把两个量写成同一种长度单位，再分别写每个问题的后项。',
    'Convert both lengths to one unit, then name the second quantity in each comparison.',
  );
  table(q1, [
    ['A', 'A长度/m', 'A length/m', dec(aCm, 100)],
    ['B', 'B长度/cm', 'B length/cm', String(bCm)],
  ]);

  const d1 = near ? 12 : 15,
    d2 = near ? 18 : 25,
    unitDen = near ? 5 : 2,
    alt1 = (d1 * unitDen) / 10,
    alt2 = (d2 * unitDen) / 10;
  const fn = near ? 3 : 2,
    fd = near ? 4 : 3,
    gn = 5,
    gd = near ? 6 : 4,
    common = 12,
    fa = (fn * common) / fd,
    fb = (gn * common) / gd;
  const nonfactor = near ? 5 : 3;
  const q2 = task(
    2,
    'simplest-integer-ratio',
    '① D两项已同单位。先各用十分之一原单位计数、画出所有原小份并圈共同组，再化成最简整数比，核等值与互质两个条件；除1为何通常未完成？尝试题给非公因数K，能截断成整数个组吗？② 同一D改用U这个共同小单位，各有多少小份，最终比会不同吗？F两分数以1/12原单位计数，先数两边小份再化简，不能只改一项或只改各自分子。③ 把一个最简结果两项同乘2，再用对应的等值小数项表示：它们等值就都已满足最简整数要求吗？另说明0:5的最简形式与两项乘0的区别；任何分组是否取走原量？',
    '① D’s terms already share a unit. Count TENTH-unit pieces, DRAW all original pieces and circle common groups, then find simplest integer terms. Check BOTH equivalence and coprimality. Why does division by one usually leave work unfinished? Try the given nonfactor K: may fractional group counts be truncated? ② Recount the SAME D using common unit U. How many pieces of U are present, and does the final ratio change? For F, count 1/12-unit pieces BEFORE simplifying; do not alter only one term or just individual numerators. ③ Double both terms of a simplest answer and express the same ratio with decimal terms: does equivalence alone meet “simplest INTEGER” form? Contrast simplifying 0:5 with multiplying both terms by zero. Does grouping remove any original amount?',
    `D=${dec(d1, 10)}:${dec(d2, 10)}，十分之一计数${d1}:${d2}，同除${gcd(d1, d2)}得${simplest(d1, d2)}，交叉乘相等且互质；除1保等值但未最简。${nonfactor}不是两项公因数，不能截断。U=1/${unitDen}时为${alt1}:${alt2}，同样化${simplest(d1, d2)}；共同计数单位不同不删原量。F=${fn}/${fd}:${gn}/${gd}，乘共同分母12为${fa}:${fb}，最简${simplest(fa, fb)}。最简比两项同乘2仍等值但可除2；把该最简两项各除10得小数项仍等值但非整数。0:5最简0:1；两项乘0成0:0，零比值未定义，不是合法等值缩放。`,
    `D=${dec(d1, 10)}:${dec(d2, 10)} contains ${d1}:${d2} tenth-unit pieces. Divide both by ${gcd(d1, d2)} for ${simplest(d1, d2)}; equal cross-products plus coprimality establish the result. Dividing by one preserves equivalence but is unfinished. ${nonfactor} is not a common factor; truncation cannot create complete groups. Using U=1/${unitDen} gives ${alt1}:${alt2}, with the SAME simplest ratio and no original quantity removed. F=${fn}/${fd}:${gn}/${gd} contains ${fa}:${fb} twelfth-unit pieces and simplifies to ${simplest(fa, fb)}. Doubling simplest terms remains equivalent but reducible; dividing both simplest terms by ten yields equivalent decimal terms, not integer form. 0:5 simplifies to 0:1. Scaling by zero gives undefined 0:0 and is not legitimate equivalent scaling.`,
    '每次先说“共同一个小份多大”，再数两边；最终须同时保等值和互质整数。',
    'Name the size of one shared piece before counting each side. The final form needs both equivalence and coprime integers.',
  );
  table(q2, [
    [
      'D',
      '同单位待化简比',
      'Same-unit decimal ratio',
      `${dec(d1, 10)}:${dec(d2, 10)}`,
    ],
    [
      'U',
      'D的另一共同计数单位',
      'Alternative common counting unit for D',
      `1/${unitDen}`,
    ],
    ['K', '待检非公因数', 'Candidate nonfactor', String(nonfactor)],
    [
      'F',
      '同单位分数比',
      'Same-unit fractional ratio',
      `${fn}/${fd}:${gn}/${gd}`,
    ],
  ]);

  const w = near ? 12 : 18,
    wa = near ? 2 : 3,
    wb = near ? 3 : 4,
    parts = wa + wb;
  const q3 = task(
    3,
    'allocate-by-ratio',
    '① 按给定A:B将W升连续水全部分配。亲画等权重条，标总份数、每份升数、两份实际量，同时核和与原比。另一个人把水各分一半，合计也为W，就一定按原比吗？用交叉乘反查，说明只核总量不够。② 保W不变，两项权重同时加倍，重画总格数、每格升数与两份量。比较每格实际量和两人最终量，不能误把多画的格当更多水。③ 原W若是不可拆整卡，能恰好全分吗？另自行算总张数为原权重和两倍时的有效整卡分配。零总水按同计划分配时，检查等式与总量，不用0:0冒充实际比值。',
    '① Allocate ALL W litres of continuous water in the stated A:B ratio. DRAW equal-weight shares, label total parts, litres per part and both allocations, and check BOTH sum and ratio. Someone instead splits W equally: does a correct total guarantee the original ratio? Test cross-products. ② Retain W but DOUBLE BOTH weights. Redraw total cells, litres per cell and allocations. Distinguish a smaller counting share from the unchanged final amounts; extra drawn cells create no water. ③ Replace W litres by W INDIVISIBLE cards: is complete exact allocation feasible? Separately construct a valid whole-card allocation when the total is TWICE the original weight sum. With zero water, check allocation equations and total without claiming a quotient from 0:0.',
    `原${parts}份，每份${f(w, parts)}L；A=${f(w * wa, parts)}L、B=${f(w * wb, parts)}L，和${w}L，A×${wb}=B×${wa}。均分各${w / 2}L虽和正确，但${w / 2}×${wb}≠${w / 2}×${wa}，不按原比。权重变${2 * wa}:${2 * wb}共${2 * parts}格，每格${f(w, 2 * parts)}L减半，A仍${f(w * wa, parts)}、B仍${f(w * wb, parts)}L。${w}整卡不能按互质${wa}:${wb}全分，因为总张数不是${parts}倍数；总${2 * parts}张可给A=${2 * wa}、B=${2 * wb}。零总量给各0L，权重计划保留，实际0/0未定义。`,
    `There are ${parts} parts of ${f(w, parts)}L. A=${f(w * wa, parts)}L, B=${f(w * wb, parts)}L, sum=${w}L and A×${wb}=B×${wa}. Equal halves of ${w / 2}L conserve the total but ${w / 2}×${wb}≠${w / 2}×${wa}, so the ratio fails. Doubling weights to ${2 * wa}:${2 * wb} gives ${2 * parts} cells of ${f(w, 2 * parts)}L, HALF as much per cell but the same A/B amounts. ${w} whole cards cannot all satisfy coprime weights ${wa}:${wb}, since the total is not a multiple of ${parts}. A separate total of ${2 * parts} cards can give ${2 * wa} and ${2 * wb}. Zero water allocates 0L to each; planned weights remain while actual 0/0 is undefined.`,
    '整体对应两项权重之和；等分与按比是两种条件，必须另核原比。',
    'The whole corresponds to the SUM of weights. Equal splitting and ratio allocation impose different conditions; check the original ratio separately.',
  );
  table(q3, [
    [
      'W',
      '待分连续水/L，或整卡分支张数',
      'Continuous water/L, or card count in separate branch',
      String(w),
    ],
    ['A_W', 'A原权重', 'Original A weight', String(wa)],
    ['B_W', 'B原权重', 'Original B weight', String(wb)],
  ]);

  const ta = near ? 4 : 6,
    tb = near ? 6 : 8,
    onlyBn = near ? 9 : 14,
    onlyBd = near ? 2 : 3;
  const q4 = task(
    4,
    'equivalent-ratio-table',
    '① R为没有固定额外加入量的连续水配方，两列都用升。不要强制先化简：分别求A为S和L时的B，A/B两列各相对原行乘几倍？给定B为V时反求A。亲画三行表，写共同倍数并用交叉乘核回，倍数小于一或不是整数会破坏关系吗？② 另审(0,0)、(0,1)、(1,0)三行：哪些满足给定乘法关系，哪些能定义原正比值？零行乘法成立不等于0/0有值。③ 在正确B上另外固定加1L，仍是R吗？用S、L两行重求比值说明；列名、单位和原配方条件都保留，不能只看两列都增加。',
    '① R is a CONTINUOUS-water recipe with NO fixed extra addition, both columns in litres. Without requiring simplification first, find B when A is S and L; state each column’s multiplier from the original row. Recover A from B=V. DRAW the three rows and verify common multipliers with cross-products. Are fractional or below-one multipliers invalid? ② Audit (0,0),(0,1),(1,0): which satisfy the supplied multiplication relationship and which define its positive quotient? A valid zero product does not define 0/0. ③ Add a FIXED extra 1L to every correct B. Is it still R? Recompute quotients for S and L, retaining column names, units and the original no-addition condition.',
    `R=${ta}:${tb}。A=1/2L时倍数1/${2 * ta}，B=${f(tb, 2 * ta)}L；A=${(5 * ta) / 2}L时倍数5/2，B=${f(5 * tb, 2)}L。B=${onlyBn}/${onlyBd}L时倍数${f(onlyBn, onlyBd * tb)}，A=${f(onlyBn * ta, onlyBd * tb)}L，各行${tb}×A=${ta}×B。正分数倍有效。零零满足B=(${tb}/${ta})A但不算0/0；(0,1)、(1,0)均不符合此正配方。正确B另加1后，两行B/A分别${f(tb + 2 * ta, ta)}与${f(5 * tb + 2, 5 * ta)}，不恒定且不等原${f(tb, ta)}，原关系已改变。`,
    `R=${ta}:${tb}. At A=1/2L the shared multiplier is 1/${2 * ta}, giving B=${f(tb, 2 * ta)}L. At A=${(5 * ta) / 2}L it is 5/2, giving B=${f(5 * tb, 2)}L. Given B=${onlyBn}/${onlyBd}L, multiplier=${f(onlyBn, onlyBd * tb)} and A=${f(onlyBn * ta, onlyBd * tb)}L. Every valid row has ${tb}×A=${ta}×B; positive fractional multipliers are valid. (0,0) fits multiplication B=(${tb}/${ta})A without defining 0/0. The one-zero rows fail this positive recipe. After adding 1L to B, the S/L quotients are ${f(tb + 2 * ta, ta)} and ${f(5 * tb + 2, 5 * ta)}, unequal and different from original ${f(tb, ta)}. The condition has changed.`,
    '先分别求两列相对原行的倍数；固定加量会多出一个与A有关的比值项。',
    'Find BOTH column multipliers from the original row. A fixed addition introduces an A-dependent quotient term.',
  );
  table(q4, [
    ['R', '原行A:B，数值单位均L', 'Original A:B, both in L', `${ta}:${tb}`],
    ['S', '第一行给定A/L', 'First given A/L', '1/2'],
    ['L', '第二行给定A/L', 'Second given A/L', String((5 * ta) / 2)],
    ['V', '另一行只给B/L', 'Separate given B/L', `${onlyBn}/${onlyBd}`],
  ]);

  const scale = near ? 25000 : 40000,
    hTenths = near ? 24 : 12,
    vTenths = near ? 16 : 28,
    shrink = near ? 2 : 4,
    groundKmN = near ? 125 : 18,
    groundKmD = near ? 100 : 10;
  const routeTenths = hTenths + vTenths,
    realCm = (routeTenths * scale) / 10;
  const mapN = groundKmN * 100000,
    mapD = groundKmD * scale;
  const q5 = task(
    5,
    'map-scale-units',
    '① N是原纸图1:N，同单位比较。沿A→B→C给定两段原图厘米走，先亲画折线与端点虚线，再求实际cm、m、km，不能拿虚线替代路线或把小数厘米取整。原图2cm的图示标尺代表多少实际米，用路线是几段标尺再核。② 另题实际D千米在同一原图长多少厘米？列单位链并乘回。随后把原纸图线性缩至原来的1/Z，重求指定路线的纸厘米与新数值比例尺；现实路线改变吗，能用旧比乘新纸厘米吗？③ 屏幕仅显示放大2倍，原图坐标不改时，路线与图示标尺怎样同步？说明屏幕cm、原图坐标cm与实际km的区别，不把面积倍数用作长度倍率。',
    '① N means original PAPER scale 1:N with matching units. Follow the two GIVEN original-map centimetre legs A→B→C: DRAW the bent route and an endpoint shortcut, then derive ground cm, m and km. Do not substitute the shortcut or round decimal map lengths. How many ground metres does a 2cm original-map graphic bar represent? Check the route as a number of bars. ② SEPARATELY recover original-map cm for D ground km, showing units and multiplication back. Then linearly SHRINK the paper map to 1/Z of its original size. Recalculate this route’s paper cm and the numerical scale. Does ground distance change? May the OLD scale multiply the NEW paper length? ③ If ONLY screen display doubles while original coordinates stay fixed, how must route and graphic bar change together? Distinguish screen cm, original-map coordinate cm and ground km; an area factor is not a length factor.',
    `原图路线${dec(hTenths, 10)}+${dec(vTenths, 10)}=${dec(routeTenths, 10)}cm，实际${realCm}cm=${dec(realCm, 100)}m=${dec(realCm, 100000)}km。2原cm标尺为${dec(2 * scale, 100)}m，路线两段标尺，恢复同距离。另D=${dec(groundKmN, groundKmD)}km=${f(groundKmN * 100000, groundKmD)}cm，原图${f(mapN, mapD)}cm，乘${scale}回实际cm。缩印1/${shrink}后路线${f(routeTenths, 10 * shrink)}新纸cm，新比1:${scale * shrink}，乘积仍${realCm}cm；误用旧比会仅得原实际的1/${shrink}。屏幕2倍只使路线与标尺显示同倍变长，原坐标和实际量不变；不能拿屏幕实尺或面积倍数套原比。`,
    `Original route=${dec(hTenths, 10)}+${dec(vTenths, 10)}=${dec(routeTenths, 10)}cm, giving ${realCm} ground cm=${dec(realCm, 100)}m=${dec(realCm, 100000)}km. A 2cm original-map bar represents ${dec(2 * scale, 100)}m; this route spans TWO such bars. D=${dec(groundKmN, groundKmD)}km=${f(groundKmN * 100000, groundKmD)}cm, so original-map length=${f(mapN, mapD)}cm; multiplying by ${scale} recovers ground cm. At 1/${shrink} print size, the route is ${f(routeTenths, 10 * shrink)} NEW paper cm and scale 1:${scale * shrink}, retaining ${realCm} ground cm. Using the old scale would give only 1/${shrink} of the real distance. Screen doubling enlarges route and graphic bar together without altering original coordinates or ground length. Neither screen ruler measurements nor area factors replace the required linear scale.`,
    '先写清所用厘米属于哪张纸图，再做同单位乘除；图示标尺须与地图一起缩放。',
    'Identify WHICH paper map the centimetres belong to before same-unit scaling. A graphic scale must resize with the map.',
  );
  table(q5, [
    [
      'N',
      '原纸图比例尺后项',
      'Original paper scale denominator',
      String(scale),
    ],
    ['AB', '原图第一段/cm', 'First original-map leg/cm', dec(hTenths, 10)],
    ['BC', '原图第二段/cm', 'Second original-map leg/cm', dec(vTenths, 10)],
    [
      'D',
      '另题实际距离/km',
      'Separate ground distance/km',
      dec(groundKmN, groundKmD),
    ],
    [
      'Z',
      '线性缩印倍率为1/Z',
      'Linear print multiplier is 1/Z',
      String(shrink),
    ],
  ]);

  const k = near ? 3 : 4,
    price = 6 * k;
  const q6 = task(
    6,
    'direct-proportion-evidence',
    '① 给定完整规则y=Kx在0–8L连续水量范围内成立，y为NZ$。自行生成x=0、1.5、2.5、6的价格，在正输入逐行求y/x并标单位；再由题给总价Y反求升数并乘回。零行用规则检查什么，为什么不除0？依据是已给全范围规则，还是几个点本身证明一切？② 两张图宽高相同、横轴0–8L，纵轴分别0–40和0–80NZ$，亲画同一组点与规则图线。哪个只改变屏幕斜陡，原单价会变吗？把第一图横轴改为mL而仍表示同一实际0–8L，重标坐标和完整新式，常数数字与单位怎样配套改变？③ 与同单位长度比的无量纲值比较，这里的NZ$/L单位能省掉吗？若x改为必须整件售卖的卡片张数，半整数位置能否自动称实际交易？给定连续量与离散件数的定义域不能仅靠画线替换。',
    '① The COMPLETE rule y=Kx is GIVEN for continuous x in 0–8L, with y in NZ$. Generate prices at x=0,1.5,2.5,6, then find y/x WITH units for positive inputs. Recover litres from the given total Y and multiply back. What does the rule check at zero without dividing? Does the full-domain claim come from the GIVEN rule or from a few plotted points alone? ② DRAW this same dataset/rule on two equally sized graphs, both x=0–8L, with vertical ranges 0–40 and 0–80NZ$. Does altered apparent steepness change the actual unit price? Relabel the FIRST graph in mL while retaining the same physical 0–8L range. Give the new coordinates and full rule, changing coefficient and unit together. ③ Contrast this NZ$/L constant with a dimensionless ratio of same-unit lengths. May units be omitted? If x instead counted INDIVISIBLE cards, would half-integer positions automatically be actual transactions? Drawing a line cannot replace a stated continuous or discrete domain.',
    `K=${k}NZ$/L，x=0,1.5,2.5,6L对应y=0,${dec(3 * k, 2)},${dec(5 * k, 2)},${price}NZ$，正行y/x恒${k}NZ$/L；Y=${price}NZ$反求${price}÷${k}=6L并乘回。零点由y=K×0=0核，不算0/0；全范围依据已给规则，有限点只核结果。两纵轴图数据相同，0–80使同一y的竖向位移为0–40的一半，不能凭斜陡换单价。改横单位u=mL，端点0–8000，点u=0,1500,2500,6000，y不变，新式y=(${f(k, 1000)})u，常数${f(k, 1000)}NZ$/mL与${k}NZ$/L同一真实单价。不同量的单价保单位，同类长度比可无量纲；整卡只允许整数x，半张位置不是自动可售交易，连续水量才允许这些插值。`,
    `K=${k}NZ$/L gives y=0,${dec(3 * k, 2)},${dec(5 * k, 2)},${price}NZ$ at x=0,1.5,2.5,6L. Every positive-row quotient is ${k}NZ$/L. From Y=${price}NZ$, recover ${price}÷${k}=6L and check. At zero use y=K×0=0, not 0/0. The GIVEN rule supplies the full-domain premise; finite points only check its consequences. Both vertical ranges retain all values; the 0–80 graph halves the vertical displacement for a given y relative to 0–40, changing appearance, not price. With u in mL, the domain is 0–8000, coordinates u=0,1500,2500,6000 retain the same y, and y=(${f(k, 1000)})u. The constant ${f(k, 1000)}NZ$/mL equals the physical rate ${k}NZ$/L. Unit prices compare DIFFERENT quantities and retain units; a same-unit length ratio may be dimensionless. Indivisible-card sales allow integer x only, while the continuous-water premise permits the half-litre values.`,
    '比值先带NZ$/L；换mL要把同一实际升数乘1000，不能只改标签却保数字系数。',
    'Keep NZ$/L on quotients. Converting the same volumes to mL multiplies x by 1000; changing labels alone cannot retain the old numerical coefficient.',
  );
  table(q6, [
    ['K', '给定每升系数/NZ$/L', 'Given coefficient/NZ$/L', String(k)],
    [
      'X',
      '待求价格的升数',
      'Volumes whose prices must be generated/L',
      '0, 1.5, 2.5, 6',
    ],
    ['Y', '另题已知总价/NZ$', 'Separate known total price/NZ$', String(price)],
  ]);
  return {
    id: `${unit}-MAINT-RATIO-MEANING`,
    unit,
    title: t(
      '共同单位、分数倍与实际缩放',
      'Shared units, fractional multipliers and actual scaling',
    ),
    bridge: 'P63-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), `P63-L0${n}`]),
    ),
    intro: t(
      '六张纸笔过程卡可分多次，一次一个编号小问，不计时。自己画图、列单位和关系并说理由后，再逐项人审。可口述或用熟悉语言；读题协助与数学提示分开。全部水、地图和价格均假想，无需配制、出行、打印或购买。',
      'Six paper-and-pencil cards can span several sittings, ONE numbered part at a time without a timer. Draw, label units and relationships and explain independently before human review of each requirement. Oral or familiar-language explanations are welcome; separate reading assistance from mathematical hints. Water, maps and prices are fictional; no mixing, travel, printing or purchase is needed.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const ratioMeaningRetrieval = {
  P68_RATIO_MEANING: makeSet('P68'),
  J75_RATIO_MEANING: makeSet('J75'),
};
