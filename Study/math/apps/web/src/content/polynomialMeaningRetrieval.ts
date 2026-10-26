import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J83' | 'J84') => {
  const near = unit === 'J83',
    id = (n: number) => `${unit}-MAINT-POLYNOMIAL-MEANING-Q${n}`;
  const card = (
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
        '一次一个编号小问，可分多次、不计时。先保原项身份、写完整关系或画图，再逐项人审；允许口述与熟悉语言，读题协助与数学提示分开。',
        'One numbered part per untimed sitting. Retain original term identities and construct full relationships/diagrams before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '给定原式与条件，各分支独立；没有预填合并结果或代入值。符号项不代表按比例的实物面积。',
        'Given original expressions and conditions; branches are independent. Collected results and evaluated values are not supplied. Symbolic terms do not represent physical areas to scale.',
      ),
      columns: [
        t('编号', 'ID'),
        t('原对象', 'Original object'),
        t('原式/条件', 'Original expression/condition'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const p = near ? 'x²+2xy−y' : '2x²−xy+y',
    x = near ? '-3/2' : '-2/3',
    y = near ? '1/3' : '-3/4';
  const q1 = card(
    1,
    'polynomial-substitution',
    `① 对原P把每一个x、y都替换成各自给定值，写带括号的完整算式，按原运算结构求精确值。x²、2xy和−x²各是什么意思？不同字母能擅自代同值吗？② 保x，仅把y改${near ? '2/3' : '3/4'}，重写替换与结果；原P的一般关系改变了吗，旧数值还能沿用吗？另对原x分别求x²和−x²，圈底数与外部负号。③ 独立比较${near ? 'x²+x与2x' : 'x²−x与0'}在0、1、2的值，说明哪一个赋值能否证恒等、两次吻合为何不足；再用分配律给x(x+1)=x²+x的一般理由，不靠试数证明。`,
    `① Replace EVERY x,y in original P by its OWN assignment, writing the complete bracketed calculation and an exact result. What do x²,2xy and −x² mean? May different letters silently receive the same value? ② Keep x and change ONLY y to ${near ? '2/3' : '3/4'}: rewrite every substitution and recalculate. Does the general P relationship change, and may its old numerical value be retained? Separately evaluate x² and −x² at the ORIGINAL x, marking the power base and outside minus. ③ Independently compare ${near ? 'x²+x with 2x' : 'x²−x with zero'} at 0,1,2. Which assignment refutes identity, and why do two matches not prove it? Then justify x(x+1)=x²+x generally by distribution rather than trials.`,
    `原替换${near ? '(−3/2)²+2(−3/2)(1/3)−1/3=9/4−1−1/3=11/12' : '2(−2/3)²−(−2/3)(−3/4)−3/4=8/9−1/2−3/4=−13/36'}，每次同字母同值，xy为乘积。仅改y后${near ? '9/4−2−2/3=−5/12' : '8/9+1/2+3/4=77/36'}；原式关系保留、具体值不同。原x平方${near ? '9/4' : '4/9'}，外负平方${near ? '−9/4' : '−4/9'}，外运算不消失。取x=0时两式同为0；取x=1时两式同为${near ? '2' : '0'}；取x=2时两式分别为${near ? '6与4' : '2与0'}，足以否证；分配x到x与1给x²+x是一般推导，未由少数吻合宣布恒等。`,
    `Original replacement: ${near ? '(−3/2)²+2(−3/2)(1/3)−1/3=9/4−1−1/3=11/12' : '2(−2/3)²−(−2/3)(−3/4)−3/4=8/9−1/2−3/4=−13/36'}. Every occurrence of one letter uses its assigned value; xy is multiplication. Changing only y gives ${near ? '9/4−2−2/3=−5/12' : '8/9+1/2+3/4=77/36'}. P remains the same relationship while its numerical value changes. Original x²=${near ? '9/4' : '4/9'}, whereas −x²=${near ? '−9/4' : '−4/9'} retains the outside operation. At x=0 both expressions give zero; at x=1 both give ${near ? 'two' : 'zero'}. At x=2 they give ${near ? 'six and four' : 'two and zero'}, refuting identity. Distribution of x to x and one proves x(x+1)=x²+x generally; a few matches do not.`,
    '先列每个字母的赋值，再逐处完整替换；代入数值与对所有允许值的一般关系分开说明。',
    'List each assignment and replace every occurrence fully. Distinguish a value at that assignment from a relationship for all allowed values.',
  );
  table(q1, [
    ['P', '原代数式', 'Original expression', p],
    ['X', '原x值', 'Original x', x],
    ['Y', '原y值', 'Original y', y],
  ]);

  const terms = near
    ? ['3x²', '−2xy', '5yx', '−3x²', '−4y²', '(1/2)x', '(1/3)x', '4y²', '−2']
    : ['4x²', '−3xy', '7yx', '−x²', '2y²', '−(1/2)x', '(1/4)x', '−2y²', '3'];
  const A = near ? '(1/2)x²+2xy−3' : '(3/4)x²−xy+2',
    B = near ? '(1/3)x²−xy+4' : '(1/2)x²+2xy−5',
    C = near ? '−x²+3' : '2x²−1';
  const q2 = card(
    2,
    'like-monomial-coefficients',
    'T1–T9是一个相加的原项清单；A/B/C另为独立分支的三个完整整式，不混入T。① 保每个T编号，登记系数和每个字母指数，再按完整字母部分分组，写全部组及已完成的合并式。xy与yx为什么同类，x²与y²、x²y与xy²为何不同类，即使总次数相同或一次代入相同？分数系数是否使一个项不再是整式，1/x又为什么不同？② 解释抵消组仍能回看原项、结果省零项；所有类型相消时明确写什么？给出一个与结果等值但尚未完成合并的写法，说明任务形式与恒等是两层检查，不把加系数当加指数。③ 从原A/B/C各自独立求A+B、A−B、A−(B−C)、A−A，逐项保来源、外部符号及常数；每个结果要完成合并。A−B的结果加回原B，能否恢复A？外加号与外减号作用有何不同，嵌套为何不是A−B−C？',
    'T1–T9 are ONE sum of original terms. A/B/C are THREE whole polynomials for a SEPARATE branch and are not added to T. ① Retain every T ID, register coefficient and EACH letter exponent, group by complete variable part and give all buckets and a finished collected result. Why are xy/yx like but x²/y² and x²y/xy² unlike despite equal total degree or a matching trial? Do fractional coefficients destroy polynomial status, and why is 1/x different? ② Explain why original IDs survive cancellation while zero terms disappear from the result; what must be written if ALL types cancel? Give one equivalent but unfinished collection, distinguishing identity from requested form and coefficient sums from exponent addition. ③ Independently from ORIGINAL A/B/C find A+B,A−B,A−(B−C),A−A in finished form, retaining sources, all outside signs and constants. Add original B back to the difference. How do outside addition/subtraction differ, and why is the nested expression not A−B−C?',
    `T字母类x²、xy、y²、x、常数；系数分别${near ? '0、3、0、5/6、−2' : '3、4、0、−1/4、3'}，结果${near ? '3xy+(5/6)x−2' : '3x²+4xy−(1/4)x+3'}。yx按交换因子归xy；字母或对应指数不同不能合，x²y/xy²虽总次数3仍不同。分数系数可为整式，1/x含字母分母不在本课整式范围。T每ID保留一次，抵消的原项不删证据；结果省0类，全消写0非空。重抄原T和仍等值但未合完，不能改成加指数。A+B=${near ? '(5/6)x²+xy+1' : '(5/4)x²+xy−3'}；A−B=${near ? '(1/6)x²+3xy−7' : '(1/4)x²−3xy+7'}；嵌套A−B+C=${near ? '−(5/6)x²+3xy−4' : '(9/4)x²−3xy+6'}；A−A=0。加B保原符号，减B给每项乘−1而A保留；差加原B逐类回A。嵌套外负把内−C改+C，常数也受作用，不由几次试值替代各类系数推导。`,
    `T types x²,xy,y²,x,constant have coefficients ${near ? '0,3,0,5/6,−2' : '3,4,0,−1/4,3'}, giving ${near ? '3xy+(5/6)x−2' : '3x²+4xy−(1/4)x+3'}. Commute yx to xy; different letters/corresponding powers stay unlike. x²y and xy² both have degree three but different variable parts. Fractional coefficients are allowed, while variable denominator 1/x lies outside this polynomial scope. Retain every T ID once even after cancellation. Omit zero RESULT types; all types cancelling gives explicit zero, not a blank. Repeating the original T sum is equivalent but unfinished; collection does not add exponents. A+B=${near ? '(5/6)x²+xy+1' : '(5/4)x²+xy−3'}; A−B=${near ? '(1/6)x²+3xy−7' : '(1/4)x²−3xy+7'}; A−B+C=${near ? '−(5/6)x²+3xy−4' : '(9/4)x²−3xy+6'}; A−A=0. Addition preserves B’s signs; subtraction multiplies EVERY B term by −1 and retains A. Adding original B back restores every A coefficient. The outer minus changes inner −C into +C, including constants. General coefficient relationships, not a few matching trials, justify these results.`,
    '每项保来源编号，先按字母及各指数定类，再算系数；A/B/C分支要先圈外部符号作用的完整对象。',
    'Keep source IDs and classify letters/exponents before adding coefficients. In the A/B/C branch, mark the WHOLE object affected by each outside sign.',
  );
  table(q2, [
    ...terms.map(
      (v, i) =>
        [`T${i + 1}`, '原相加项', 'Original summand', v] as [
          string,
          string,
          string,
          string,
        ],
    ),
    ['A', '另分支整式A', 'Separate polynomial A', A],
    ['B', '另分支整式B', 'Separate polynomial B', B],
    ['C', '另分支整式C', 'Separate polynomial C', C],
  ]);

  const k = near ? '−1/2' : '−2/3',
    inside = near ? '6x²−4xy+2' : '3x²+6xy−9',
    H = near ? '2(x²−xy+1)' : '3(x²+xy−1)';
  const q3 = card(
    3,
    'distribution-every-term',
    `G=kI、H原式见表。① 画k连接I每个带符号项的图，写每一乘积、G完整展开式，再求G+H并完成合并；图中连线长短能充当系数或真实面积吗？② 独立保原I，只把k改0、1、−1及原k的相反数，分别展开，核常数有没有漏乘，零因子是否还留下原常数。③ 某人把G写成${near ? '−3x²+2xy+2' : '−2x²−4xy−9'}，以x=y=0找具体反例，再说明所有允许值的正确性来自哪条逐项关系，不能由一次吻合认证。④ 本次要求“展开并合并”时，原kI与仍有重复类型的展开中间式是否已完成？与建模允许因式形式的任务比较，解释同样等值为何完成条件不同。`,
    `G=kI and original H are in the table. ① DRAW k connected to EVERY signed I term, write each product and G’s full expansion, then collect G+H. Do connector lengths represent coefficients or physical areas? ② Independently retain original I and replace k by 0,1,−1 and the ORIGINAL k’s opposite. Expand every branch, checking the constant receives its factor and does not survive a zero factor. ③ Someone proposes G=${near ? '−3x²+2xy+2' : '−2x²−4xy−9'}. Find a concrete counterexample at x=y=0, then justify the correct expression for ALL allowed assignments by a term-by-term relationship rather than one agreement. ④ For an EXPAND-AND-COLLECT task, are unchanged kI or repeated-type intermediate sums finished? Compare a modelling task that allows factored forms: why does equal value not settle the requested form?`,
    `G逐项${near ? '−3x²、2xy、−1' : '−2x²、−4xy、6'}；H展开${near ? '2x²−2xy+2' : '3x²+3xy−3'}；合G+H=${near ? '−x²+1' : 'x²−xy+3'}，所有原项均处理。连线仅符号关系不作比例面积。k=0→0；k=1→原I；k=−1→${near ? '−6x²+4xy−2' : '−3x²−6xy+9'}；原k的相反数→${near ? '3x²−2xy+1' : '2x²+4xy−6'}，各项包括常数。x=y=0时原G=${near ? '−1' : '6'}、错式=${near ? '2' : '−9'}，一个反例足以否证，普遍成立由k乘每项及精确系数。原kI虽等值未展开；重复类型仍未合并，零应写0不保0x。建模只要求准确关系可保因式，不把本次形式要求推广所有任务。`,
    `G products: ${near ? '−3x²,2xy,−1' : '−2x²,−4xy,6'}. H expands to ${near ? '2x²−2xy+2' : '3x²+3xy−3'}, so G+H=${near ? '−x²+1' : 'x²−xy+3'}, accounting for every term. Connectors show algebraic relationships, not scaled areas. k=0 gives zero; k=1 gives I; k=−1 gives ${near ? '−6x²+4xy−2' : '−3x²−6xy+9'}; the opposite of original k gives ${near ? '3x²−2xy+1' : '2x²+4xy−6'}. Constants receive the same factor. At x=y=0, original G=${near ? '−1' : '6'} versus false ${near ? 'two' : '−9'}, a counterexample. General validity comes from distribution and exact coefficients. Unchanged kI has not expanded; repeated variable parts remain uncollected, and zero should be written explicitly rather than 0x. A modelling task can retain a correct factored relationship; its form goal differs.`,
    '把外部因子连到每个完整带符号项，先核常数，再与另一组按同类项合并。',
    'Connect the outside factor to each complete signed term, check the constant, then collect with the other group.',
  );
  table(q3, [
    ['k', '原外部因子', 'Original outside factor', k],
    ['I', '原括号内整式', 'Original bracket polynomial', inside],
    ['H', '另加整式', 'Additional polynomial', H],
  ]);

  const fare = near ? 3 : 4,
    fee = near ? 5 : 7,
    price = near ? 6 : 7,
    coupon = near ? 4 : 3,
    bags = near ? 4 : 5,
    extra = near ? 3 : 2,
    offset = near ? 3 : 4;
  const q4 = card(
    4,
    'contextual-polynomial-model',
    `全部为互不相混的虚构情境。① 团体n人为正整数，每人NZ$${fare}，一次整组费NZ$${fee}。定义n、单位、一般总费并分别以n=2、n=3检错；分别只把每人价或固定费增加1，一般式哪部分改变？另独立把每人价改0、固定费改0，结果可为常数整式吗？② 另买正整数n本，每本NZ$${price}，整单只优惠NZ$${coupon}一次；与“每本优惠${coupon}”写两式，代n=1及2比较。一次吻合能把两种收费条件混同吗？③ 另${bags}袋各n+${extra}支，n是非负整数，求总支数、解释n=0，并对比团体人数的正整数范围。④ 长方形宽n cm、长n+${offset} cm，n为任意正有理数。画图推周长/面积一般式及单位，再取n=${near ? '1/2' : '3/2'}算具体量；说明分数长度允许而分数人数不允许、n=0在正长方形模型为何排除。因式与展开式都可作本题关系，一次数值不能替代一般式，试两点不能代替组成关系推导。`,
    `All are SEPARATE fictional contexts. ① A group has positive integer n people at NZ$${fare} each PLUS one NZ$${fee} group fee. Define n, units and GENERAL cost; check separately at n=2 and n=3. Independently increase per-person price or fixed fee by one: which expression part changes? Separately set per-person price to zero or fixed fee to zero: may a constant polynomial result? ② A DIFFERENT order has positive integer n notebooks at NZ$${price} each, with ONE NZ$${coupon} order discount. Contrast a discount of ${coupon} PER notebook using two expressions and n=1,2 checks. Does one agreement merge the conditions? ③ Separately ${bags} bags each contain n+${extra} pencils, with NONNEGATIVE integer n. Model total pencils and interpret n=0, contrasting the group’s positive-count domain. ④ A rectangle has width n cm, length n+${offset} cm and ANY positive rational n. DRAW and derive perimeter/area expressions and units; evaluate n=${near ? '1/2' : '3/2'}. Explain why fractional length is allowed but fractional people are not, and why zero is excluded from this positive rectangle model. Factored/expanded relationships both work here; numerical examples do not replace general expressions or relationship derivations.`,
    `团体费${fare}n+${fee} NZD，n正整数；n=2、n=3时分别为NZ$${fare * 2 + fee}与NZ$${fare * 3 + fee}。每人价加1为${fare + 1}n+${fee}，固定费加1为${fare}n+${fee + 1}；零票价只余常数${fee}，零组费仅${fare}n，变量允许不表示必须含变量。整单优惠${price}n−${coupon}；每本优惠${price - coupon}n，n=1时均${price - coupon}，n=2时为${price * 2 - coupon}对${2 * (price - coupon)}，一次巧合不改角色。袋总${bags}(n+${extra})=${bags}n+${bags * extra}支，n=0时仍${bags * extra}，此n不是团体正人数。矩形周长4n+${offset * 2}cm、面积n(n+${offset})=n²+${offset}n cm²；n=${near ? '1/2' : '3/2'}，长${near ? '7/2' : '11/2'}cm，周长${near ? '8' : '14'}cm，面积${near ? '7/4' : '33/4'}cm²。正分数长度合法，n=0时会退化宽0不属本模型。一般式可因式/展开，但需由每项重复范围、两长两宽/长乘宽推导，试值只检错。`,
    `Group cost=${fare}n+${fee} NZD for positive integer n; n=2 and n=3 give ${fare * 2 + fee},${fare * 3 + fee}. Raising per-person price gives ${fare + 1}n+${fee}; raising ONLY fixed fee gives ${fare}n+${fee + 1}. Zero ticket price leaves constant ${fee}; zero group fee leaves ${fare}n. An allowed variable need not appear in a constant result. Order discount=${price}n−${coupon}; per-notebook discount=${price - coupon}n. At one both give ${price - coupon}; at two they give ${price * 2 - coupon} versus ${2 * (price - coupon)}: coincidence does not merge scopes. Pencils=${bags}(n+${extra})=${bags}n+${bags * extra}; n=0 still gives ${bags * extra} since this n has a DIFFERENT domain/meaning. Rectangle perimeter=4n+${offset * 2} cm and area=n(n+${offset})=n²+${offset}n cm². At n=${near ? '1/2' : '3/2'}, length=${near ? '7/2' : '11/2'} cm, perimeter=${near ? '8' : '14'} cm, area=${near ? '7/4' : '33/4'} cm². Positive fractional lengths are allowed; n=0 degenerates the width and lies outside the stated positive-rectangle model. Derive general expressions from repeated versus fixed amounts, two lengths/two widths or length×width. Factored and expanded forms both express the relationship; trials only check examples.`,
    '给每个分支分别定义n和单位，再圈“每人/每本/整单/每袋/边界/覆盖”的数量角色。',
    'Define n and units SEPARATELY in each branch; identify per-person, per-item, whole-order, per-bag, boundary and coverage roles.',
  );
  table(q4, [
    [
      'G',
      '团体原收费',
      'Original group charges',
      `每人NZ$${fare}，整组一次NZ$${fee}；n正整数`,
      `NZ$${fare} per person; NZ$${fee} once per group; positive integer n`,
    ],
    [
      'N',
      '另笔订单原条件',
      'Separate original order',
      `每本NZ$${price}，整单优惠NZ$${coupon}一次；n正整数`,
      `NZ$${price} per notebook; ONE NZ$${coupon} order discount; positive integer n`,
    ],
    [
      'B',
      '另袋装条件',
      'Separate bag conditions',
      `${bags}袋，每袋n+${extra}支；n非负整数`,
      `${bags} bags, n+${extra} pencils per bag; nonnegative integer n`,
    ],
    [
      'R',
      '另长方形条件',
      'Separate rectangle conditions',
      `宽n cm，长n+${offset} cm；n正有理数`,
      `Width n cm; length n+${offset} cm; positive rational n`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-POLYNOMIAL-MEANING`,
    unit,
    title: t(
      '整式的原项、完整对象与情境范围',
      'Original polynomial terms, whole objects and contextual domains',
    ),
    bridge: 'J72-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 5].map((l, i) => [id(i + 1), `J72-L0${l}`]),
    ),
    intro: t(
      '四张纸笔卡，一次一个编号小问，可分次、不计时。第2卡同时核同类项与整式加减；先保原项、给关系与单位，再逐项人审。允许口述/熟悉语言，读题协助与数学提示分开。数据虚构，纸笔即可，不需购买或实测。',
      'Four paper cards, one numbered part per untimed sitting. Card two checks both collection and polynomial sums/differences. Retain original terms and provide relationships/units before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Fictional data need only paper, no purchases or measurement.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const polynomialMeaningRetrieval = {
  J83_POLYNOMIAL_MEANING: makeSet('J83'),
  J84_POLYNOMIAL_MEANING: makeSet('J84'),
};
