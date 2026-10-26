import { t } from '../model';
const pair = (i: number) =>
  ['J83', 'J84'].map((u) => `${u}-MAINT-CORE-ALGEBRA-Q${i}`);
const e = (
  skill: string,
  z: string,
  en: string,
  l: string,
  targets: string[],
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
const originalCoreAlgebraRecurrence = [
  e(
    'rational-opposite-sign',
    '有理数等值、相反数与倒数',
    'Rational equivalence, opposite and reciprocal',
    'J71-L01',
    pair(1),
    'J83在同单位轴定位−5/4、−1.25、−10/8，J84定位−7/2、−3.5、−21/6。都重建同点等值、相反数和0、负倒数积1，核零有相反数却无倒数，不靠去负号。',
    'J83 locates −5/4,−1.25,−10/8 on one fixed-unit axis; J84 uses −7/2,−3.5,−21/6. Both regenerate equivalent positions, opposite/sum-zero and negative-reciprocal/product-one relations, including zero’s opposite but no reciprocal.',
  ),
  e(
    'rational-absolute-distance',
    '有理数有向差与距离',
    'Rational signed changes and distances',
    'J71-L02',
    pair(2),
    'J83由−7/6到−1/3生成变化±5/6、距离5/6，改+1/3跨零距3/2；J84由−9/8到−1/4生成±7/8、距离7/8，改+1/4距11/8。都画反向与实际路径，解释同侧重叠、同绝对值不等位置、|0|。',
    'J83 generates changes ±5/6 and distance 5/6 from −7/6 to −1/3, versus 3/2 across zero. J84 generates ±7/8 and 7/8, versus 11/8 across zero. Both draw paths and reversal and explain same-side overlap, equal magnitudes at different positions and |0|.',
  ),
  e(
    'signed-fraction-addition',
    '带符号分数相加的两种模型',
    'Two models for signed fraction addition',
    'J71-L03',
    pair(3),
    'J83用同整体十二分之一和数轴解释−5/6+3/4=−1/12；J84用二十四分之一解释−7/8+5/6=−1/24。两处强制相消与数轴双过程、减回、向右却仍负及同整体单位，不能只交末值。',
    'J83 explains −5/6+3/4=−1/12 in common-whole twelfths and on an axis; J84 uses twenty-fourths for −7/8+5/6=−1/24. Both require cancellation and axis models, inverse checks and a negative endpoint despite rightward movement, retaining the same whole.',
  ),
  e(
    'subtraction-as-opposite',
    '减负分数与加负分数',
    'Subtracting versus adding a negative fraction',
    'J71-L04',
    pair(4),
    'J83比较减−3/4得−1/12与加−3/4得−19/12；J84比较减−5/6得−1/24与加−5/6得−41/24。都保首项、改运算并取整个减数相反数，画箭头、差加回原减数，核减0及增大仍负。',
    'J83 contrasts subtracting −3/4 for −1/12 with adding it for −19/12; J84 contrasts −1/24 with −41/24. Both retain the first term, rewrite the operation and whole subtrahend, draw arrows, add the original subtrahend back and check zero and increased-yet-negative values.',
  ),
  e(
    'signed-scaling-and-division',
    '负因子缩放、反射与非零除法',
    'Negative scaling, reflection and nonzero division',
    'J71-L05',
    pair(5),
    'J83由5/6乘−2/3反射缩放得−5/9，再由q乘−2/3为−5/6推5/4；J84对应得−21/32与商7/6。都解释数轴缩放不等于负份实物重复、原除数与负倒数、乘回、除法可放大及零除数无解/不唯一。',
    'J83 reflects/scales 5/6 by −2/3 for −5/9 and solves q×(−2/3)=−5/6 for 5/4. J84 obtains −21/32 and quotient 7/6. Both distinguish numerical scaling from physical copies, divisor from negative reciprocal, inverse checks, enlargement and no-solution/non-unique zero divisors.',
  ),
  e(
    'rational-operation-structure',
    '幂底数与混合运算结构',
    'Power bases and mixed-operation structure',
    'J71-L06',
    pair(6),
    'J83区分−3²与(−3)²，逐步算−8÷2×(−3)+1/2为25/2，错加分母括号变11/6；J84以−4²、(−4)²及另一混合式得17/3、错式7/6。均保每步未算部分、同级从左到右、精确分数及零除数停止。',
    'J83 distinguishes −3² from (−3)² and calculates −8÷2×(−3)+1/2=25/2 versus an invented-denominator result 11/6. J84 uses −4²,(−4)² and a different mixed expression for 17/3 versus 7/6. Both retain untouched parts, left-to-right equal precedence, exact fractions and stopping on zero divisors.',
  ),
  e(
    'polynomial-substitution',
    '代入保底数、符号与一般关系',
    'Substitution retains bases, signs and general relations',
    'J72-L01',
    ['J81-L04-Q6', 'J82-L05-Q6'],
    'J81用b=2、x=1否定漏中项式，解释x=0巧合不足；J82将x=0、x=1一致代入原多项式与错误因式，0处都6而1处12与14。都保每个字母同值、底数与外部运算，区分有限试值和完整恒等推导。',
    'J81 uses b=2,x=1 to refute a missing-cross-term expression despite coincidence at zero. J82 consistently substitutes zero and one into a polynomial and proposed factors, obtaining six at zero but twelve versus fourteen at one. Both retain assignments, bases and outside operations and distinguish finite trials from identity derivations.',
  ),
  e(
    'like-monomial-coefficients',
    '按字母指数合并并保留零',
    'Collecting by exponents and retaining zero',
    'J72-L02',
    [...pair(7), 'J81-L03-Q6'],
    '两组Q7按平方、一次、常数收集完整差式、保每项系数，否定x²和x因一次同值就同类，并主动将A−A写0。J81由四对乘积合ax与bx为(a+b)x，不把平方项合入一次。',
    'Both Q7 tasks collect complete differences by square, linear and constant terms, retain coefficients, reject term classification by one matching input and write A−A as zero. J81 combines ax and bx into (a+b)x after four products without merging square and linear terms.',
  ),
  e(
    'distribution-every-term',
    '外部因子覆盖每项',
    'An outside factor applies to every term',
    'J72-L03',
    [...pair(7), ...pair(8), 'J81-L02-Q6', 'J82-L01-Q6'],
    'Q7将负1覆盖被减式每项，Q8将非零公倍数覆盖包括整数的每项再展开负括号；J81核−2x(x−3)及正长度面积范围，J82逆分配6x(x+2)并核x=0仍成立。不是只改首项或偷偷除去零因子。',
    'Q7 distributes −1 across every subtracted term; Q8 applies a nonzero common multiple to every term including integers and expands negative brackets. J81 checks −2x(x−3) and positive-length model bounds; J82 reverses distribution to 6x(x+2), retaining x=0 rather than cancelling a possibly zero factor.',
  ),
  e(
    'polynomial-sum-difference',
    '整式差、逐项符号与加回',
    'Polynomial difference, term signs and adding back',
    'J72-L04',
    pair(7),
    'J83生成2x²−7x+10，J84生成2y²+6y−10。均将第二式整体取反、保第一式、按类收集、加回原第二式，再代负1得到19或−14，核A−A全消为0。',
    'J83 generates 2x²−7x+10 and J84 2y²+6y−10. Both negate the whole second expression, retain the first, collect by type, add the original second back and substitute negative one for nineteen or −14, checking A−A=0.',
  ),
  e(
    'contextual-polynomial-model',
    '由数量组成生成一般式',
    'Generating expressions from quantity structure',
    'J72-L05',
    ['J81-L02-Q6', 'J92-L06-X'],
    'J81由高2x、宽x+3生成两块面积2x²、6x和2x(x+3)，区分负代数项与负宽度；J92出口由宽x、长x+1、面积2cm²生成原模型，求根1/−2后筛正长度并给单位。都重建变量、组成和范围，不拿一次代值当一般关系。',
    'J81 generates areas 2x² and 6x and expression 2x(x+3) from positive lengths, distinguishing negative algebraic terms from negative widths. J92’s exit builds the original area model from width x,length x+1 and area 2cm², solves one and −2, then filters positive lengths with units. Both reconstruct variables, composition and domain rather than substituting a single value for a general relation.',
  ),
  e(
    'original-equation-check',
    '原式检验与解集范围',
    'Original checks and solution-set scope',
    'J73-L01',
    ['J83-L01-Q6', 'J92-L01-Q6', 'J92-L02-Q6'],
    'J83用同一数对核两原式，(2,5)只过一条、(4,3)都过；J92逐值联系左=右与左−右=0、区别矛盾/恒等，并用x=0原式检查反驳除x丢根。不能把一个候选通过当全域恒等或完整解集。',
    'J83 checks each pair against both originals: (2,5) passes one and (4,3) both. J92 relates equality to a zero difference for each value, distinguishes contradiction/identity and checks x=0 to refute a lost root after division by x. One candidate passing does not establish an identity or complete solution set.',
  ),
  e(
    'reversible-equation-steps',
    '可逆两边操作与分支条件',
    'Reversible both-side operations and branch conditions',
    'J73-L02',
    [...pair(8), 'J83-L03-Q6', 'J92-L02-Q6'],
    'Q8逐项同乘非零12、同减合并、同除非零系数并原式核验；J83保留原行及非零替换系数，反驳零倍丢条件；J92除x前分零与非零分支。都重建保解条件，不只背移项变号。',
    'Q8 multiplies every term by nonzero twelve, subtracts/collects, divides by a nonzero coefficient and checks the original. J83 retains an original row and nonzero replacement coefficient, refuting zero-factor information loss. J92 branches zero and nonzero before division by x. Each reconstructs solution preservation rather than a sign-changing mnemonic.',
  ),
  e(
    'bracket-linear-equations',
    '完整括号与一次方程',
    'Whole brackets in linear equations',
    'J73-L03',
    pair(8),
    'J83展开4(x−2)−3(x+1)+12=2求x=1，J84展开6(y+1)−4(y−2)+12=3求y=−23/2。都说明每项符号、两边可逆步骤、精确解、原式检查及系数抵消后的恒等/矛盾，不除零。',
    'J83 expands 4(x−2)−3(x+1)+12=2 to x=1; J84 expands 6(y+1)−4(y−2)+12=3 to y=−23/2. Both justify every sign, reversible both-side steps, exact solution, original check and identity/contradiction after coefficient cancellation without zero division.',
  ),
  e(
    'constant-denominator-equations',
    '常数分母逐项去分母',
    'Clearing constant denominators term by term',
    'J73-L04',
    pair(8),
    'Q8从分母3/4/6或2/3/4的原式选非零公倍数12，强制整数项也乘、负因子覆盖整括号，再代回x=1或y=−23/2。明确常数分母固定非零，没有额外排变量0，不隐藏变量分母条件。',
    'Q8 chooses nonzero common multiple twelve for constants 3,4,6 or 2,3,4, explicitly multiplying integer terms and whole negative groups before substituting x=1 or y=−23/2. Fixed nonzero denominators add no variable-zero exclusion and hide no variable-denominator condition.',
  ),
  e(
    'original-quantity-modelling',
    '保留原数量关系的模型',
    'Models retaining original quantity relationships',
    'J73-L05',
    ['J83-L05-Q6', 'J92-L06-X'],
    'J83定义票数/升数x,y，重建总量x+y=7与金额5x+3y=30，再核精确数对和范围；J92出口由宽x、长x+1、面积2生成原模型、完整根分支、正长筛选及cm单位。都展示模型两侧数量来源，不能只交解值或移项零式。',
    'J83 defines x,y as tickets/litres, regenerates total x+y=7 and cost 5x+3y=30 and checks the exact pair and domain. J92’s exit constructs an original area model, complete root branches, positive-length filtering and centimetre units. Both show quantity sources rather than only solved values or a zero form.',
  ),
  e(
    'context-solution-domain',
    '等式成立与情境允许分别核',
    'Separate validity from contextual admissibility',
    'J73-L06',
    ['J83-L05-Q6', 'J92-L06-X', 'J85-L06-Q6'],
    'J83的(9/2,5/2)原等式都成立，却只允许连续升数而非整数票；J92出口−2通过面积等式却违正长度，1两关均过；J85区分连续非负排水和整包整数域。均先核原式再核情境，不舍入造解或把域外代数值叫原方程无解。',
    'J83’s (9/2,5/2) satisfies both equations but is allowed for continuous litres rather than integer tickets. J92’s exit has −2 passing the equation but failing positive lengths while one passes both; J85 distinguishes nonnegative continuous drainage from integer packs. All check original relations and context separately, without rounding into a false solution or confusing inadmissibility with no algebraic solution.',
  ),
];

const rationalDetails = [
  [
    '新两组Q1规范负分母、以整数比容纳整数零，重建有限截断/明确无限循环之差1/3000或1/1500，并比较负小数顺序、双相反与等分单位。',
    'New Q1s normalise negative denominators, include integers/zero as integer ratios, derive finite-versus-infinite-repeat gaps 1/3000 or 1/1500 and check negative-decimal order, double opposites and equal-unit subdivisions.',
  ],
  [
    '新两组Q1由原X/Y求有向差与距离，独立重建重合点、零端点与反射Y后跨零距离，四等分改八等分不改单位。',
    'New Q1s reconstruct signed differences/distances from X/Y, independently checking coincident/zero endpoints and reflected-Y crossing distances while quarters-to-eighths refinement preserves units.',
  ],
  [
    '新两组Q2用共同十二/二十四份求四种加减，另亲算同号、相反、零与有限小数及两种合法加法交换结合。',
    'New Q2s use common twelfths/twenty-fourths for four signed sums/differences, then generate same-sign, opposite, zero and finite-decimal cases and two justified addition orders.',
  ],
  [
    '新两组Q2亲算减正、减负、减零、零减与跨零，加回原减数并比较不同减法括号，保首项和精确值。',
    'New Q2s calculate positive/negative/zero subtrahends, zero minuends and crossing zero, add back ORIGINAL subtrahends and compare changed subtraction brackets while retaining the first term.',
  ],
  [
    '新两组Q3生成七因子映射与正大/负小除数，分数值顺序与幅距，算三负积，并由分配律推负一映射而非背符号。',
    'New Q3s build seven factor maps, divide by positive-large/negative-small divisors, separate order from magnitude, compute three-negative products and derive the minus-one map by distributivity.',
  ],
  [
    '新两组Q4保完整分数括号乘法、另分配核算、内外减子式、负分数平方/立方及同级加减，外乘零不救内部零除数。',
    'New Q4s retain complete bracketed fractional products, independently distribute, evaluate nested subtraction, signed fractional squares/cubes and left-to-right subtraction, and reject using an outside zero to rescue internal zero division.',
  ],
];
export const coreAlgebraRecurrence = originalCoreAlgebraRecurrence.map(
  (entry) => {
    if (entry.sourceLesson.startsWith('J73-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1,
        question = [1, 2, 3, 0, 4, 4][i]!;
      if (!question) return entry;
      const details = [
        [
          '新J83/J92第1卡分别重建精确分数原式左右值与近似差，另分唯一零、矛盾和恒等，完整性靠可逆步骤而非单次代入。',
          'New J83/J92 card ones reconstruct exact fractional original-side values and rounded discrepancies, then distinguish unique zero, contradiction and identity; completeness follows from reversible steps rather than one passing trial.',
        ],
        [
          '新两组第2卡以负分数同乘及逆操作保解，另以零乘新增候选、零除未定义、单侧碰巧同解与另一方程反例、除变量失零分支区分规则与实例。',
          'New card twos use a negative fractional multiplier and its inverse, then separate zero-multiplication extra candidates, undefined zero division, one-sided coincidental equality versus a counterexample, and a lost variable-zero branch.',
        ],
        [
          '新两组第3卡把负分数连到每个完整项，分别求2/3或−3/4，并对错中间式的−7/3或7/4候选重代最初括号两边给反例。',
          'New card threes connect a negative fractional factor to every term, solve for 2/3 or −3/4, and refute erroneous-intermediate candidates −7/3 or 7/4 by checking both original bracketed sides.',
        ],
        ['', ''],
        [
          '新两组第4卡先构造精确年龄和/差、两人同过年数的未来倍数、完整包/散卡及长度/温度/零总量/非负价格的原关系，再求解筛选；另自创不同可行分数年龄与不可行整包模型。',
          'New card fours construct original age-total/gap, whole future-age multiple, pack/extras and length/temperature/zero-total/nonnegative-price relations before solving/filtering, then invent a different feasible fractional-age and impossible-whole-pack pair.',
        ],
        [
          '新两组第4卡逐情境保代数解、原式检验和域，正分数长度、非负分数年龄、负温与零组可行，分数整包与负价格不行；具体舍入反例不得改原条件。J85直接题已补三个原条件。',
          'New card fours retain algebraic roots, original checks and contextual domains: positive fractional lengths, nonnegative fractional ages, negative temperatures and zero groups are valid, while fractional packs and negative prices are not. Concrete rounding counterexamples retain the original givens. J85 now supplies its three original condition sets.',
        ],
      ][i]!;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J83', 'J92'].map(
            (u) => `${u}-MAINT-LINEAR-MEANING-Q${question}`,
          ),
        ],
        rationale: t(
          `${entry.rationale.zh} ${details[0]}`,
          `${entry.rationale.en} ${details[1]}`,
        ),
      };
    }
    if (entry.sourceLesson.startsWith('J72-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1,
        question = [1, 2, 3, 2, 4][i]!;
      const details = [
        [
          '新两组Q1保x/y独立分数赋值，完整重代得11/12或−13/36，仅改y后得−5/12或77/36；保外负号并对有限吻合另给反例。',
          'New Q1s consistently substitute separate fractional x/y assignments for 11/12 or −13/36, then change only y for −5/12 or 77/36, retaining outside minus signs and counterexamples to finite-agreement claims.',
        ],
        [
          '新两组Q2保九原ID与完整字母指数，重建分数系数/xy-yx/同次数异字母类型与零抵消，不靠某次同值分组。',
          'New Q2s retain nine original IDs and each letter exponent, reconstructing fractional coefficients, xy/yx, equal-degree unlike types and cancellation without grouping by a coincident numerical value.',
        ],
        [
          '新两组Q3把负分数因子连三项，包括常数，另与H合并并核0/1/−1/正反因子；原式等值不代完成展开。',
          'New Q3s connect negative fractional factors to all three terms including constants, collect with H and check 0/1/−1/opposite factors, distinguishing equivalent originals from finished expansion.',
        ],
        [
          '新两组Q2独立重求分数系数双变量A+B/A−B/嵌套A−(B−C)/A−A，并把差加原B逐类还原，保每项来源。',
          'New Q2s independently reconstruct fractional two-variable sums, differences, nested A−(B−C) and A−A, adding original B back by type while retaining every source term.',
        ],
        [
          '新两组Q4按原收费/整单与逐本优惠/袋装/正分数长方形亲建一般式，核零价格或组费、不同n域及周长面积的单位和1/2或3/2样例。',
          'New Q4s derive group charges, order/per-item discounts, bag totals and positive-fraction rectangles, checking zero prices/fees, distinct n domains, perimeter/area units and samples 1/2 or 3/2.',
        ],
      ][i]!;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J83', 'J84'].map(
            (u) => `${u}-MAINT-POLYNOMIAL-MEANING-Q${question}`,
          ),
        ],
        rationale: t(
          `${entry.rationale.zh} ${details[0]}`,
          `${entry.rationale.en} ${details[1]}`,
        ),
      };
    }
    if (!entry.sourceLesson.startsWith('J71-')) return entry;
    const i = Number(entry.sourceLesson.slice(-2)) - 1,
      question = [1, 1, 2, 2, 3, 4][i]!;
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['J83', 'J84'].map(
          (u) => `${u}-MAINT-RATIONAL-MEANING-Q${question}`,
        ),
      ],
      rationale: t(
        `${entry.rationale.zh} ${rationalDetails[i]![0]}`,
        `${entry.rationale.en} ${rationalDetails[i]![1]}`,
      ),
    };
  },
);
