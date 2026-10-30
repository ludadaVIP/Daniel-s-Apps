import { t } from '../model';
const pair = (i: number) =>
  ['H31', 'H35'].map((u) => `${u}-MAINT-EXP-LOG-Q${i}`);
const e = (
  skill: string,
  l: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H03-L0${l}`,
  sourceTask: `H03-L0${l}-Q6`,
  targets: pair(i),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const exponentialLogRecurrence = [
  e(
    'exponent-laws-reciprocal',
    '1',
    1,
    '非零倒数、同底运算与括号',
    'Nonzero reciprocals, equal-base operations and parentheses',
    'H31主动算3⁻²×3⁵、3²+3³及括号正负16；H35算5³÷5⁵、5²+5³与正负9。两处从aⁿa⁻ⁿ=1推倒数和非零底条件，乘回反驳0负指数，明确乘除才加减指数而非加法。',
    'H31 generates 3⁻²×3⁵,3²+3³ and signed sixteen; H35 generates 5³÷5⁵,5²+5³ and signed nine. Both derive reciprocal powers and the nonzero-base premise from aⁿa⁻ⁿ=1, reject zero negative powers by multiplying back, and distinguish product/quotient laws from addition.',
  ),
  e(
    'exponent-rational-root',
    '2',
    2,
    '正根定义与负底步骤冲突',
    'Positive-root definitions and conflicting negative-base procedures',
    'H31求16^(−3/4)=1/8并核四次根；H35求81^(−3/4)=1/27。负底分别−27的2/6与−32的2/10，先平方偶根与先约分奇根得相反号，要求指出正底前提及另定义奇分母实根的范围，不宣称负底任何有理指数都不存在。',
    'H31 derives16^(−3/4)=1/8 and H35 derives81^(−3/4)=1/27 through checked positive fourth roots. Negative-base2/6 of−27 and2/10 of−32 give opposite signs under incompatible procedures. Both identify the lost positive-base premise and distinguish a separately declared reduced odd-denominator convention from a blanket claim that all negative-base rational powers are undefined.',
  ),
  e(
    'exponential-equal-ratios',
    '3',
    3,
    '恒倍率假设与有限观测',
    'Constant-ratio assumptions versus finite observations',
    'H31的两点(0,3),(1,6)也被3(1+t)吻合；H35的(0,80),(1,40)也被80/(t+1)吻合且全t≥0正。两例下一时刻与指数不同，需额外指定相等时间恒定倍率与连续延伸，不能由整数记录擅许半时查询或声称现实模型必真。',
    'The growth observations also fit3(1+t); the decay observations also fit80/(t+1), positive for all t≥0. Different next predictions expose non-identification. Equal-interval constant ratios and continuous extension must be stipulated, not inferred from two integer-time records or treated as proof of the real mechanism.',
  ),
  e(
    'log-inverse-domain',
    '4',
    4,
    '存在、唯一与递减的逆',
    'Existence, uniqueness and decreasing inverses',
    '两处将log₄(1/8)与log₉(1/27)改写指数并核−3/2，分别说明负真数无解与底1有多解，写正底非1及正真数完整条件；0<b<1虽递减仍一一覆盖正数，不能误判无逆。',
    'Both rewrite logarithms of1/8 base4 or1/27 base9 into exponent equations and check−3/2. They distinguish no solution for a negative argument from nonunique exponents for base one, state complete real-log domains, and explain why decreasing bases0<b<1 remain one-to-one onto positive values.',
  ),
  e(
    'log-laws-domain',
    '5',
    5,
    '通式推导、拆和反例与原真数',
    'General laws, a sum counterexample and original arguments',
    '两处由u=aᵖ、v=aᑫ推乘积和商定律，给拆和精确反例。H31原域x>2求±6筛{6}；H35原域x>1求±√10筛{√10}。负候选虽使乘积正却两原真数负，须核回原式，不能借合并式扩大域。',
    'Both derive product and quotient laws from inverse exponents, refute splitting sums with exact examples, then solve log equations. H31 filters±6 to{6} on x>2; H35 filters±√10 to{√10} on x>1. Negative candidates have positive products but invalid original arguments, so a merged expression cannot enlarge the original domain.',
  ),
  e(
    'exponential-model-threshold',
    '6',
    3,
    '升降阈值、离散域与时间单位',
    'Growth/decay thresholds, discrete domains and time units',
    'H31解3×2ᵗ≥20得t≥log₂(20/3)，相邻2/3小时给12/24；H35解80×(1/2)ᵗ≤12得t≥log_(1/2)(3/20)，相邻2/3天给20/10。均首整数3且实域为半直线，递减比较反向；小时转天倍率2²⁴，天转小时倍率(1/2)^(1/24)，保模型适用及单位边界。',
    'Growth gives t≥log₂(20/3), checked by12/24 at hours2/3; decay gives t≥log_(1/2)(3/20), checked by20/10 at days2/3, with the decreasing-base comparison reversed. Both give a complete real ray and first integer three without rounding. Time conversions use2²⁴ per day or(1/2)^(1/24) per hour, preserving model and unit scope.',
  ),
];

// Original task identities and primary bridges remain unchanged.
const supplements = [
  t(
    '补零指数一般商、分数负底、幂的乘方与积的幂的整数范围。',
    'Add general zero-power division, negative fractional bases, powers of powers and integer product powers.',
  ),
  t(
    '补等值指数、正有理底精确主根/倒数与合法无理幂；复用两正负支题的√(x²)=|x|和双向回验，以及两精确几何卡的根式/小数非零差，原H35/J87主桥不改。',
    'Add equivalent exponents, exact positive rational roots/reciprocals and defined irrational powers; reuse both square-branch tasks for √(x²)=|x| and two-way checks, plus both exact-geometry cards for nonzero radical/decimal differences, retaining H35/J87 bridges.',
  ),
  t(
    '补分数倍率恢复/百分比率、一般严格性质/完整像与渐近、有限离散/连续像和确切半步、窗外输出。',
    'Add fractional multiplier recovery/rates, general strict properties/full image/asymptotes, finite discrete versus continuous images, exact half steps and off-window outputs.',
  ),
  t(
    '补指数/对数同点角色交换和完整域像、合法无理对数与最后近似；复用H36/H38半底等式/不等式及1/非正底的实际退化任务。',
    'Add exponent/log point-role swaps and full domains/images, defined irrational logs and final approximation; reuse H36/H38 decreasing-base equality/inequality and actual unit/nonpositive-base cases.',
  ),
  t(
    '补一般幂律/全非零域绝对值、换底非零条件/负分母与混用ln/log的实际错误值，复用半底原双真数域任务。',
    'Add the general power law/full nonzero absolute-value domain, change-of-base nonzero premises/negative denominator and an actual mixed-ln/log error; reuse decreasing-base original-argument tasks.',
  ),
  t(
    '补初始恰等/已严格满足、有限域未达到与全域、精确交点最后舍入及自主升降模型/完整图表/单位转换；不把负等式交点改0伪造相等。',
    'Add initially equal versus already strictly satisfying targets, finite versus global non-attainment, exact crossings before rounding and own growth/decay models/full graphs/tables/unit conversion; do not clamp a negative equality time to fabricate equality.',
  ),
];
for (const [i, entry] of exponentialLogRecurrence.entries()) {
  entry.targets.push(
    ...['H31', 'H35'].map((u) => `${u}-MAINT-EXPONENTIAL-MEANING-Q${i + 1}`),
  );
  if (i === 1)
    entry.targets.push(
      ...['H05', 'H06'].map((u) => `${u}-MAINT-PYTHAGOREAN-MEANING-Q3`),
      ...['H36', 'H38'].map((u) => `${u}-MAINT-ADVANCED-EQUATION-Q1`),
    );
  if (i === 3 || i === 4)
    entry.targets.push(
      ...['H36', 'H38'].map((u) => `${u}-MAINT-ADVANCED-EQUATION-Q2`),
    );
  entry.rationale = t(
    entry.rationale.zh + ' ' + supplements[i]!.zh,
    entry.rationale.en + ' ' + supplements[i]!.en,
  );
}
