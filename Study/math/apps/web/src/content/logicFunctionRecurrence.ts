import { t } from '../model';
const pair = (i: number) =>
  ['H25', 'H26'].map((u) => `${u}-MAINT-LOGIC-FUNCTION-Q${i}`);
const e = (
  skill: string,
  l: string,
  targets: string[],
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets,
  rationale: t(rz, re),
});
export const logicFunctionRecurrence = [
  e(
    'set-elements-boundaries',
    'H01-L01',
    pair(1),
    '数值元素、子集与原始清单',
    'Numerical elements, subsets and original lists',
    '两组四个不同ID清单1,1,2,4或2,2,4,6生成三个不同元素，保原观测次数，区分数∈A与单元素集⊆A而非∈A，空集是子集却非该数值集元素。集合顺序/重复不改，但不能据此删除不同ID原记录。',
    'Each four-ID list, 1,1,2,4 or 2,2,4,6, generates three set elements without deleting observations. Learners distinguish a numerical element from its singleton subset, an empty subset from a numerical element, and set order/multiplicity from original record counts.',
  ),
  e(
    'set-boolean-operations',
    'H01-L02',
    pair(1),
    '全集下逐元素交并补',
    'Elementwise intersection, union and complement in a universe',
    'H25在U0..6、H26在U1..8实际生成交并补，核A∩Aᶜ为空及A∪Aᶜ=U，逐元素给既在/不在理由。只扩U到8或10时补集加入7与8或9与10、A不变，不能不声明全集求补。',
    'H25 uses universe 0..6 and H26 uses 1..8 to generate intersection, union and complement, proving A∩Aᶜ empty and A∪Aᶜ=U elementwise. Expanding only U adds seven/eight or nine/ten to its complement while A stays unchanged; the universe is required.',
  ),
  e(
    'logic-domain-counterexample',
    'H01-L03',
    pair(2),
    '域改变的全称真假与存在否定',
    'Domain-sensitive universals and negating existence',
    '两处x²≥x或(x−2)²≥x−2在整数域用m≤0或m≥1的一般证明，在实数用1/2或5/2反例；否定全称换存在且保域。存在整数平方2或3的否定是所有整数不等，按|n|≤1或≥2证明；存在一个不等不能否定存在相等。',
    'Both prove x²≥x or (x−2)²≥x−2 over integers by m≤0/m≥1, then refute over reals at 1/2 or 5/2. Universal negation changes to existence while retaining domain. Negating existence of an integer square two/three requires all integers to differ, proved by |n|≤1 or ≥2; one unequal square is not that negation.',
  ),
  e(
    'logic-two-directions',
    'H01-L04',
    pair(3),
    '必要充分的指向与逆否',
    'Directed necessity/sufficiency and contraposition',
    'P:x3、Q:x²9或P:x4、Q:x²16逐箭头审，负根反驳Q⇒P，明确谁对谁充分/必要；逆否真而单独否定两边不成立。加x≥0后负反例域外、两方向真，实际重审不是按中文词感判。',
    'P:x3/Q:x²9 or P:x4/Q:x²16 are audited both ways, using the negative root against Q⇒P and explicitly naming necessity/sufficiency. Contraposition holds but the inverse fails. Restricting x≥0 removes that witness and makes both directions true, requiring a domain-aware re-audit.',
  ),
  e(
    'absolute-complete-real-set',
    'H01-L05',
    pair(4),
    '完整绝对值集合及零负半径',
    'Complete absolute-value sets and zero/negative right sides',
    '两组中心3半径2或中心−1半径4亲画全部<≤>≥解集，内侧且/交、外侧或/并，核两端及中心。另逐项给c0的空/单点/去一点/全实及c−2的空或全实，由距离非负而非盲背内外口诀，不用有限整数表替完整集合。',
    'Both draw all four comparison sets about centre three/radius two or centre negative one/radius four, distinguish inside AND/intersection from outside OR/union, and test endpoints/centre. They classify c=0 into empty/singleton/punctured/all-real sets and c=−2 into empty or all reals using nonnegative distance, not mnemonics or finite lists.',
  ),
  e(
    'function-domain-image',
    'H02-L01',
    pair(5),
    '全域单值、像集与目标集',
    'Total single-valuedness, image and codomain',
    'H25给x²域[−2,2]、H26给(x−1)²域[−1,3]，目标[0,9]而实际像[0,4]，亲画多对一仍函数。另同输入两输出及漏一个声明域内输入的关系无效，用每个输入恰一输出说明，不把未达到9当函数失效。',
    'H25 uses x² on [−2,2] and H26 (x−1)² on [−1,3], with codomain [0,9] but actual image [0,4]. Both draw valid many-to-one maps and invalid double-output/missing-input relations, requiring exactly one output for every declared input rather than demanding output nine be attained.',
  ),
  e(
    'function-linked-representations',
    'H02-L02',
    ['H28-MAINT-INTEGRATION-AUDIT-Q1', 'H38-MAINT-INTEGRATION-AUDIT-Q1'],
    '完整图、值与规则假设',
    'Complete graph, values and rule assumptions',
    '复用H28/H38实际完整水量折线及双语全部端点，求三段内分数输入值和变化率，并与整包离散规则、只有两观测的两不同候选函数比较。完整图是给定规则才可插值；有限点不能擅连，离散域不补半包，图窗不改率或域。',
    'H28/H38 supply actual complete water polylines with all endpoints in bilingual text, requiring fractional-input values and segment rates. They contrast given continuous rules, discrete whole-pack rules and two observations matching different functions. Interpolation needs the given rule; finite points do not authorise joining, discrete domains do not admit half packs, and viewport does not change rates or domains.',
  ),
  e(
    'function-domain-properties',
    'H02-L03',
    pair(6),
    '全域严格性、零函数与奇偶前提',
    'Whole-domain strictness, zero function and parity premises',
    '两组平方/移位平方给域内反例否定全域严格增，并用两点平方差符号一般证两侧增减。零函数在非退化对称域既奇且偶、非严格增减但非递减且非递增；奇偶先查关于0对称域，x公式在正域或图轴x1不自动满足。',
    'Both refute whole-domain strict increase for square/shifted-square examples and prove each side by the general difference-of-squares sign. On nondegenerate symmetric domains zero is both odd/even, not strictly monotone but both nondecreasing/nonincreasing. Parity first requires zero-centred domain symmetry; formula x on a positive domain or an x=1 graph axis is insufficient.',
  ),
  e(
    'function-point-transform',
    'H02-L04',
    pair(7),
    '推点对应、给定域与零系数重审',
    'Derived point mapping, supplied domain and zero coefficients',
    '两处推x=h+u/b、y=k+a f(u)与{x:b(x−h)∈D}；负b−2/−3横反射缩1/2或1/3，亲算三个像点。仅a0保给定复合域；b0必须重查内0：H25的[1,9]不含0无允许输入，H26的[−2,1]含0则常值全实，不能除0或把缩放写无穷。',
    'Both derive x=h+u/b, y=k+a f(u) and the supplied-domain preimage. Negative b−2/−3 reflects with horizontal factor 1/2 or 1/3, and three image points are calculated. Changing only a=0 retains that domain. At b=0, recheck inner zero: H25 excludes it in [1,9], so no inputs are allowed; H26 includes it in [−2,1], giving an all-real constant. Division by zero or an infinite-scale label is invalid.',
  ),
  e(
    'function-inverse-correspondence',
    'H02-L05',
    pair(5),
    '全部像的唯一原像与坐标交换',
    'Unique preimage for every image value and coordinate swap',
    '两组输出0唯一原像0或1不证明可逆；输出4有−2与2或−1与3，水平线两交与交换坐标给同输入双输出。右半域[0,2]/[1,3]才得逆√y/1+√y，逆域为实际像[0,4]，不让原目标9自动进入，明确函数/反函数唯一性方向。',
    'A unique preimage zero/one for output zero does not certify invertibility. Output four has negative two/two or negative one/three; horizontal lines and coordinate swapping reveal double inverse outputs. Restricting to right halves [0,2]/[1,3] gives inverses √y or 1+√y with domain actual image [0,4], not unused codomain nine. Original and inverse uniqueness directions differ.',
  ),
  e(
    'function-piecewise-boundaries',
    'H02-L06',
    pair(8),
    '完整分段、累计与整件按档的预算并集',
    'Complete partition, cumulative versus whole-tier budget unions',
    'H25域[0,6]阈2、预算5，H26域[0,8]阈3、预算10，表中每输入恰一适用规则。累计预算[0,3]/[0,7/2]；整件按档因跳价给[0,5/3]∪(2,5/2]或[0,5/2]∪(3,5]，每段先解后交域再并，核阈值只归第一档及开闭，不擅平滑或补间隙。',
    'H25 uses domain [0,6], threshold two, budget five; H26 uses [0,8], threshold three, budget ten. Each input has one table rule. Cumulative feasible sets are [0,3]/[0,7/2]. Whole-shipment tier jumps give [0,5/3]∪(2,5/2] or [0,5/2]∪(3,5]. Learners solve each segment, intersect its domain, then union and check first-tier threshold ownership/endpoints without smoothing or filling gaps.',
  ),
];

// Reuse complete later problems for natural domains, inverse branches and
// square transformations. Their original primary bridges remain unchanged.
const conceptSupplements = [1, 1, 2, 3, 4, 5];
const conceptReuse: Record<number, number> = { 1: 5, 4: 4, 5: 1 };
const conceptReasons = [
  t(
    '有限与连续同公式实际像、可达性与真改域另用两新卡；自然根式/分式最大原域直接复用H36/H38四式审核。',
    'Two new cards compare actual finite/interval images and attainability under an explicit domain change; reuse H36/H38 equation audits for maximal radical/rational domains.',
  ),
  t(
    '另两卡亲生同一输入的精确函数值/表行/图点、全部原像和自主有限规则到连续域；函数记号非乘法或点编号，视图/视窗不改原函数。',
    'Two cards generate a value,row,point,all preimages and an own finite rule explicitly changed to a continuous domain; notation is not multiplication/point numbering and views do not redefine functions.',
  ),
  t(
    '另两卡一般立方奇/严格增、绝对值分半、x²加常数偶、合法有序对、研究区间与真改原域、f0必要不充分及穿孔域奇函数；保原平方/零函数强证明。',
    'Two cards audit cube oddness/strict increase,absolute-value halves,nonzero-at-zero even examples,ordered-pair admissibility,study versus original domains,and conditional zero necessity with a punctured odd domain; retain square/zero proofs.',
  ),
  t(
    '另两卡分数立方完整展开/三源点/不对称给定域及源u与查询x、奇函数同图集不同点身份；平方点图/原域直接复用H36/H38现有任务。',
    'Two cards require a collected fractional cubic,three mapped points,asymmetric domains,source/query separation and coincident odd-function graph sets with different point maps; reuse H36/H38 square graph/domain tasks.',
  ),
  t(
    '另两卡负斜率一次逆域/逆式/往返、倒数零点及精确分数/根式回验；负平方支及双向复合直接复用H36/H38原任务，不再重创。',
    'Two cards require negative-slope affine inverse domains/rules,round trips,reciprocal zero exclusions and exact fractional/radical recovery; reuse H36/H38 negative-square-branch and two-composition tasks.',
  ),
  t(
    '另两卡完整开始小时分支/比例误纳反例与预算集、自主两完整费率/表/图/域/预算证明；原累计与整件断开集合保留。',
    'Two cards require all started-hour branches,a proportional-model counterexample,budget sets and two own complete tariffs/tables/graphs/domain/budget proofs; retain the original marginal and disconnected whole-tier tasks.',
  ),
];
for (let n = 1; n <= 6; n++) {
  const entry = logicFunctionRecurrence.find(
    (v) => v.sourceLesson === `H02-L0${n}`,
  )!;
  entry.targets.push(
    ...['H25', 'H26'].map(
      (u) =>
        `${u}-MAINT-FUNCTION-CONCEPT-MEANING-Q${conceptSupplements[n - 1]}`,
    ),
  );
  if (conceptReuse[n])
    entry.targets.push(
      ...['H36', 'H38'].map(
        (u) => `${u}-MAINT-ADVANCED-EQUATION-Q${conceptReuse[n]}`,
      ),
    );
  entry.rationale = t(
    entry.rationale.zh + ' ' + conceptReasons[n - 1]!.zh,
    entry.rationale.en + ' ' + conceptReasons[n - 1]!.en,
  );
}

// Retain original task identities and bridges; these independent cards address
// operations absent from the original proofs, quantifier and threshold tasks.
for (let n = 1; n <= 5; n++) {
  const entry = logicFunctionRecurrence.find(
    (v) => v.sourceLesson === `H01-L0${n}`,
  )!;
  entry.targets.push(
    ...['H25', 'H26'].map((u) => `${u}-MAINT-LOGIC-MEANING-Q${n}`),
  );
  const additions = [
    t(
      '另两处自主完整整数规则与正/非负边界、等值有理数去重、0/空/单元素及另定义集合的集，实际核对象和包含。',
      'Two supplements require complete own integer rules, positive/nonnegative bounds, rational-value deduplication, zero/empty/singleton distinctions and separately defined set-valued elements.',
    ),
    t(
      '另两处亲画四区、实际双向差与补的不同起点、缩U同步筛A/B、相等/不交/空边界及自主虚构标签。',
      'Two supplements require four ID regions, directed differences versus complement, simultaneous membership updates when U shrinks, equal/disjoint/empty cases and own fictional labels.',
    ),
    t(
      '另两处分类未知真值/请求/开语句及指定或量化后的命题，精核域内成功非反例，并分清有理输入入口与实域。',
      'Two supplements classify unknown truth, requests, open sentences and assigned/quantified statements, audit admissible confirming candidates, and separate rational input limits from the real domain.',
    ),
    t(
      '另两处由完整真值集核充要/交叠两者皆非/空前提，给双向失败见证、两假行与互换主体后的四分类；空蕴含不证明存在。',
      'Two supplements audit equal, overlapping and empty full truth sets, directional counterexamples, both-false rows and exchanged subjects. Empty-premise implication does not establish existence.',
    ),
    t(
      '另两处正负分数系数等价边界、零系数常数四比较、真非负情境域取交及并集单点桥/缺点，不把视窗或有限代回当完整域证明。',
      'Two supplements require signed fractional-coefficient bounds, zero-coefficient constant comparisons, intersection with a nonnegative context domain and bridged versus punctured unions, separating display windows and substitutions from full-domain proof.',
    ),
  ];
  entry.rationale = t(
    entry.rationale.zh + ' ' + additions[n - 1]!.zh,
    entry.rationale.en + ' ' + additions[n - 1]!.en,
  );
}
