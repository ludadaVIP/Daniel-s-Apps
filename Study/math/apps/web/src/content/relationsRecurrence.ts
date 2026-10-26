import { t } from '../model';
const pair = (i: number) =>
  ['J81', 'J82'].map((u) => `${u}-MAINT-RELATIONS-Q${i}`);
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
const originalRelationsRecurrence = [
  e(
    'ratio-order-and-reference',
    '比的顺序与整体参照',
    'Ratio order and whole reference',
    'P63-L01',
    pair(1),
    'J81从18和30重建A:B=3:5、反向5:3及A占全部3/8；J82从14和35给2:5、5:2及2/7。两处主动区分后项与合并总量、保留量名与顺序。',
    'J81 reconstructs A:B=3:5, reverse 5:3 and part-of-total 3/8 from eighteen and thirty. J82 gives 2:5,5:2 and 2/7 from fourteen and thirty-five. Both actively distinguish the second quantity from the combined whole and retain names and order.',
  ),
  e(
    'simplest-integer-ratio',
    '等值与最简整数比',
    'Equivalent and simplest whole-number ratios',
    'P63-L02',
    pair(1),
    'J81用最大公因数6将18:30约成3:5，否定未最简9:15及同减6；J82用7将14:35约成2:5，否定未最简4:10及同减7。均要求共同非零缩放、互质与交叉乘，不能只认可等值数值。',
    'J81 reduces 18:30 by greatest common factor six to 3:5, rejecting unfinished 9:15 and subtraction of six. J82 reduces 14:35 by seven to 2:5, rejecting unfinished 4:10 and subtraction of seven. Both require common nonzero scaling, coprime terms and cross-products rather than mere numerical equivalence.',
  ),
  e(
    'allocate-by-ratio',
    '权重分配与允许量',
    'Weighted allocation and allowed amounts',
    'P63-L03',
    pair(2),
    'J81把11L按3:5分为33/8与55/8L；J82把13m按2:7分为26/9与91/9m。都画等权重份、核和与原比，再区分连续量、不可拆整数件及零总量的0:0未定义。',
    'J81 allocates 11L in ratio 3:5 as 33/8 and 55/8L; J82 allocates 13m in ratio 2:7 as 26/9 and 91/9m. Both draw weighted shares, check sum and ratio, then distinguish continuous amounts, indivisible integer objects and undefined actual 0:0 at zero total.',
  ),
  e(
    'equivalent-ratio-table',
    '同比表的成对缩放',
    'Paired scaling in ratio tables',
    'P63-L04',
    pair(3),
    'J81主动生成B=(5/3)A的四行表，比较3:5到6:10与6:8；J82生成B=(7/2)A表，比较2:7到4:14与4:9。两处核整对同乘、交叉乘、列名及零行可对应但不可除0。',
    'J81 generates four rows for B=(5/3)A and contrasts 3:5→6:10 with 6:8; J82 generates B=(7/2)A and contrasts 2:7→4:14 with 4:9. Both require paired scaling, cross-products, named columns and zero-row correspondence without dividing by zero.',
  ),
  e(
    'map-scale-units',
    '地图比例尺、路线与显示',
    'Map scales, routes and display',
    'P63-L05',
    [...pair(4), 'J94-L05-Q2', 'J94-L05-Q6'],
    'J81从1:25000折线6cm得1.5km，二倍印图改1:12500；J82从1:40000折线5cm得2km，四倍改1:10000。都核同单位、指定路线及图示标尺同步缩放；J94另反求2km在1:50000原图为4cm并讨论原图与屏幕条件。',
    'J81 converts a six-centimetre bent route at 1:25000 to 1.5km and a double-size print to 1:12500. J82 converts five centimetres at 1:40000 to 2km and a quadruple print to 1:10000. Both retain units, route and synchronised graphical scaling. J94 inversely maps 2km at 1:50000 to four centimetres and explains paper/screen conditions.',
  ),
  e(
    'direct-proportion-evidence',
    '正比例规则的充分依据',
    'Evidence for a direct-proportion rule',
    'P63-L06',
    [...pair(3), 'J75-L04-Q6'],
    '两组Q3均从已给完整B=kA规则解释所有正输入的恒比及零对应，另用非零截距直线和平方规则分别否定“直就够”与“过零就够”。J75进一步核y=kx+b及有限试值不能证明恒等。不是从几行偶合点直接宣布整体正比例。',
    'Both Q3 tasks use a supplied complete B=kA rule to justify constant ratios for every positive input and zero correspondence, contrasting nonzero-intercept lines and squaring. J75 further checks y=kx+b and why finite agreeing trials do not prove an identity. A few coinciding table rows are not treated as proof of the full rule.',
  ),
  e(
    'signed-temperature-reference',
    '摄氏参照与负读数',
    'Celsius reference and negative readings',
    'P64-L01',
    [...pair(6), 'J73-L06-Q5', 'J73-L06-Q6', 'J75-L05-Q5', 'J75-L05-Q6'],
    'J81与J82须画摄氏零两侧，解释负读数有效、零非最低且每格一度不因稀疏标字改变；J73反求升5到2的原读数−3°C并核允许范围；J75从−4每时升1.5的局部模型重求−1°C并承认负值有效。',
    'J81 and J82 draw both sides of Celsius zero and explain valid negative readings, zero not being a minimum and unchanged one-degree intervals under sparse labels. J73 recovers −3°C from a rise of five to two and checks its domain. J75 recomputes −1°C from a local −4 plus 1.5-per-hour rule and retains valid negative readings.',
  ),
  e(
    'integer-axis-position',
    '数轴方向、区间与零',
    'Axis direction, intervals and zero',
    'P64-L02',
    [...pair(6), 'J75-L02-Q3'],
    'J81从零向左数七区间至−7，J82数九至−9，都强制标单位、方向与零的整数/非正非负分类，稀疏标签不冒充步数。J75由每格2、向左3格生成−6，进一步区别屏幕格与数值单位。',
    'J81 counts seven leftward intervals from zero to −7; J82 counts nine to −9. Both label units and direction, classify zero and distinguish sparse labels from movement count. J75 generates −6 from three leftward intervals of two, further distinguishing displayed cells from numerical units.',
  ),
  e(
    'negative-number-order',
    '负数按位置比较',
    'Ordering negatives by position',
    'P64-L03',
    [...pair(6), 'J71-L01-Q5'],
    'J81排序−7、−2、0、2，J82排序−9、−3、0、3，均须画位置并解释不能只比无符号数码；J71主动在−2.5与−2.05中选更靠右的−2.05。两负数靠零较大与跨零顺序都被重新生成。',
    'J81 orders −7,−2,0,2 and J82 orders −9,−3,0,3, requiring positions rather than unsigned-digit comparisons. J71 actively selects −2.05 as the rightward larger value over −2.5. Both same-side negative order and order across zero are regenerated.',
  ),
  e(
    'signed-cross-zero-movement',
    '跨零、变化与终点',
    'Crossing zero, change and endpoint',
    'P64-L04',
    [...pair(7), 'J71-L03-Q6', 'J71-L04-Q6', 'J75-L02-X'],
    'J81由−4加7或减−7到3，J82由−6加10或减−10到4，都核箭头、逆操作、终点/变化/距离、反向、只到零及加零。J71以分数扩展相同结构，J75从(−2,−1)分别跨零到(3,2)，不把方向直接当终点正负。',
    'J81 moves from −4 by adding seven or subtracting −7 to three; J82 moves from −6 by adding ten or subtracting −10 to four. Both check arrows, inverse operations, endpoint/change/distance, reversal, merely reaching zero and adding zero. J71 extends the structure to fractions; J75 crosses both coordinate zeros from (−2,−1) to (3,2).',
  ),
  e(
    'absolute-value-distance',
    '绝对值、相反数与距离',
    'Absolute value, opposite and distance',
    'P64-L05',
    [...pair(8), 'J71-L02-Q6'],
    'J81画±5，J82画±8，均解释同距不等位置、正数相反数与绝对值不同、|0|=0；再求同侧−5到−2为3、−8到−3为5，否定一律相加到零距离。J71将同样原则迁移到负分数与反向变化。',
    'J81 draws ±5 and J82 ±8, distinguishing equal distances from equal positions, opposite from absolute value, and |0|=0. They compute same-side distances three from −5 to −2 and five from −8 to −3, rejecting automatic sums of distances to zero. J71 extends the same principles to negative fractions and reversed changes.',
  ),
  e(
    'letter-substitution',
    '同一字母一致代入',
    'Consistent substitution for one letter',
    'P65-L01',
    ['J72-L01-Q6', 'J82-L05-Q6'],
    'J72把x=−2一致代入x²及−x²并区别底数；J82将x=0、1分别代入原多项式与错误因式，得到0处巧合、1处12与14的反例。都保留每次同字母同值与原运算，不能凭一次吻合宣称恒等。',
    'J72 consistently substitutes x=−2 into x² and −x² while retaining base scope. J82 substitutes zero and one into a polynomial and proposed factors, finding coincidence at zero but twelve versus fourteen at one. Both preserve the assigned value and operations, rejecting identity claims based on one match.',
  ),
  e(
    'constructed-nth-term',
    '完整构造支持第n项',
    'A complete construction supports the nth term',
    'P65-L02',
    [...pair(5), 'H07-L01-Q6'],
    'J81按三行n加固定2推3n+2，第5幅17；J82按四行n加固定1推4n+1，第6幅25。都画前两幅、指出固定项与幅号正整数，有限给数不唯一；H07用两个明确公式在前三项吻合、第四项不同强化反例。',
    'J81 derives 3n+2 from three rows of n plus two fixed tiles, giving seventeen in figure five. J82 derives 4n+1 and twenty-five in figure six. Both draw initial figures, identify fixed terms and positive integer indices, and explain non-unique continuations from finite data. H07 provides two explicit formulas agreeing initially but differing at the fourth term.',
  ),
  e(
    'expression-structure',
    '括号分组与表达式结构',
    'Grouping and expression structure',
    'P65-L03',
    ['J72-L03-Q6', 'J81-L02-Q6'],
    'J72须把−2乘3x与−4的每项，解释常数也受外部因子；J81须把−2x乘x与−3，并以正长度2x(x+3)解释两块面积。两处重新解析完整括号与每项重复，核零因子、符号和图示正长度范围，不只比较末值。',
    'J72 distributes −2 across both 3x and −4, explaining why the constant also receives the factor. J81 distributes −2x across x and −3 and models positive-length 2x(x+3) as two areas. Both actively parse whole groups and repeated terms, checking zero factors, signs and positive-length diagram conditions rather than final values alone.',
  ),
  e(
    'equivalent-equation',
    '可逆变形保留全部限制',
    'Reversible transformations retain all constraints',
    'P65-L04',
    ['J73-L02-Q6', 'J83-L03-Q6'],
    'J73还原5x+2=2x+11每步两边操作，说明乘零或单边改变丢解集信息；J83保留一式作可逆行替换，具体展示用零倍原第一式使(1,0)成为新组伪解。两处都要求原式代回、非零可逆条件及反例，不由新式成立倒推原限制。',
    'J73 restores both-side operations for 5x+2=2x+11 and explains information loss from multiplication by zero or unilateral change. J83 retains one equation for reversible row replacement and explicitly shows a zero coefficient introducing spurious pair (1,0). Both require original checks, nonzero reversibility and counterexamples rather than inferring original validity from a weakened relation.',
  ),
  e(
    'bracket-equation',
    '含括号方程的等值步骤',
    'Equivalent steps in bracketed equations',
    'P65-L05',
    ['J73-L03-Q6', 'J83-L02-Q6'],
    'J73将−3(x−2)=2x+1逐项展开、两边变形到x=1并代回，核系数抵消时不能除零；J83完整代入y=7−x形成2x+(7−x)=11，再合并求x=4、回代y=3并核两原式。两处必须保留括号整组与原限制，不能只交答案。',
    'J73 expands −3(x−2)=2x+1 term by term, transforms both sides to x=1 and checks, retaining the no-division-by-zero boundary after cancellation. J83 substitutes the whole y=7−x to form 2x+(7−x)=11, solves x=4, recovers y=3 and checks both originals. Both require whole-group brackets and original constraints rather than just an answer.',
  ),
];

const ratioDetails = [
  [
    '新P68/J75-Q1先统一m/cm，重画顺序、合长份额和差，检同倍后差及零前后项的不同域。',
    'New P68/J75 Q1s match m/cm before reconstructing order, whole share and difference, then compare doubled differences and zero first/second-term domains.',
  ],
  [
    '新两组Q2由十分之一和另一共同小单位计数，重建小数及分数项的最简比、非公因数和零缩放边界。',
    'New Q2s count tenths and alternative shared units, reconstruct decimal/fractional simplest ratios and check nonfactors and zero scaling.',
  ],
  [
    '新两组Q3给出和正确却比例错误的均分反例，同量加倍权重重画细份，并构造有效整卡总数的分配。',
    'New Q3s refute equal splits with a correct total, redraw refined doubled weights at fixed supply and construct feasible whole-card allocations.',
  ],
  [
    '新两组Q4主动生成分数倍与反向给B求A的表，核单零行及正确B固定加1后的非恒比。',
    'New Q4s generate fractional-multiplier rows and recover A from B, checking one-zero rows and varying quotients after a fixed extra litre.',
  ],
  [
    '新两组Q5补非半厘米原图路线、反求、1/2与1/4线性缩印及原图两厘米图示标尺的独立核查。',
    'New Q5s add non-half-centimetre routes, inverse mapping, half/quarter-size prints and an independent two-centimetre graphic-bar check.',
  ],
  [
    '新两组Q6画同数据不同纵轴范围，换L/mL的常数与定义域，反求连续水量并区别整卡不能任意插值。',
    'New Q6s plot identical data on different vertical ranges, convert L/mL coefficients and domains, invert continuous quantities and reject automatic interpolation for indivisible cards.',
  ],
];
const signedDetails = [
  [
    '新P67/J75-Q1在稀疏标数的一度刻度自主读−6/−8°C，辨间隔与线、负号和三种零记号，并举窗外合理读数。',
    'New P67/J75 Q1s independently read −6/−8°C on sparsely labelled one-degree scales, distinguish intervals/ticks, signs and zero notations, and construct a reasonable reading beyond the window.',
  ],
  [
    '新两组Q2从零逐步生成−6/−8及邻数，数6/8间隔与7/9条线，扩窗保单位并举原窗外整数，区分按钮边界与整数范围。',
    'New Q2s generate −6/−8 and neighbours, count six/eight intervals versus seven/nine ticks, extend the window with fixed units and construct an integer beyond the original button limit.',
  ],
  [
    '新两组Q3同时给大小、相等及跨零关系，生成正数反例，保留“两负数”近零较大的限定及温度负号。',
    'New Q3s reconstruct larger/smaller, equality and cross-zero order, generate positive counterexamples, and retain the two-negative restriction and signed temperature readings.',
  ],
  [
    '新两组Q4各八独立行，核加减带符号项、向右仍负、两阶段跨零、恰零、不动、扩窗到±18及逆操作，区分终点/变化/距离。',
    'New Q4s each supply eight independent rows: signed addition/subtraction, rightward yet negative endpoints, staged zero crossing, reaching zero, staying still, expanded windows to ±18 and inverse checks, distinguishing endpoint/change/distance.',
  ],
  [
    '新两组Q5求一般两点同侧和跨零距离、反向变化与原数/相反数/绝对值，并逆构造同距两点、零和负距离边界。',
    'New Q5s reconstruct arbitrary same-side/cross-zero distances and reversed changes, distinguish value/opposite/absolute value, and generate equal-distance points with zero and negative-distance boundaries.',
  ],
];
const algebraDetails = [
  [
    '新J71/J73-Q1逐处同值代入负数/零/半数，构造乘积与拼数反例、不同字母同值、纯数与完整片数域，并区分表达式/赋值/条件。',
    'New J71/J73 Q1s substitute negatives, zero and halves consistently, construct product/concatenation and equal-value/different-letter examples, distinguish pure-number/count domains and expression/assignment/condition roles.',
  ],
  [
    '新两组Q2从总数反求合法与非法正整数幅号、求超十幅窗口的第17/23幅，并构造两种完整延续检验前缀证据。',
    'New Q2s invert valid and invalid positive-integer indices, compute beyond the ten-figure display at stages 17/23 and construct two complete continuations to test finite-prefix evidence.',
  ],
  [
    '新两组Q3画零时完整袋框/固定块，生成每袋与袋外总式、两个少量数、减法顺序及两种折半次序，区分通式与当前总值。',
    'New Q3s draw retained zero-count boxes/extras, construct per-bag/overall expressions, repeated differences, subtraction order and two halving orders, distinguishing a general expression from a current total.',
  ],
  [
    '新两组Q4用负系数精确解，逐枝核四种同做的逆、单边假解、乘零新增候选及三种零系数关系，保全部解而非一次平衡。',
    'New Q4s solve negative-coefficient equations exactly, check inverses of four equal actions, a one-sided false solution, an additional zero-multiplication candidate and three zero relations, distinguishing full solution preservation from one balance.',
  ],
  [
    '新两组Q5以−2/3、−1/6双路径解及原式代回，精确比较近似3.99/4.98，另解先乘后加分支和唯一零解。',
    'New Q5s obtain −2/3 and −1/6 through two valid paths, check originals against approximate 3.99/4.98, then solve multiply-before-add inverse branches and unique zero-solution cases.',
  ],
];
export const relationsRecurrence = originalRelationsRecurrence.map((entry) => {
  if (entry.sourceLesson.startsWith('P65-')) {
    const i = Number(entry.sourceLesson.slice(-2)) - 1;
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['J71', 'J73'].map((u) => `${u}-MAINT-ALGEBRA-MEANING-Q${i + 1}`),
      ],
      rationale: t(
        `${entry.rationale.zh} ${algebraDetails[i]![0]}`,
        `${entry.rationale.en} ${algebraDetails[i]![1]}`,
      ),
    };
  }
  if (entry.sourceLesson.startsWith('P64-')) {
    const i = Number(entry.sourceLesson.slice(-2)) - 1;
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['P67', 'J75'].map((u) => `${u}-MAINT-SIGNED-MEANING-Q${i + 1}`),
      ],
      rationale: t(
        `${entry.rationale.zh} ${signedDetails[i]![0]}`,
        `${entry.rationale.en} ${signedDetails[i]![1]}`,
      ),
    };
  }
  if (!entry.sourceLesson.startsWith('P63-')) return entry;
  const i = Number(entry.sourceLesson.slice(-2)) - 1;
  return {
    ...entry,
    targets: [
      ...entry.targets,
      ...['P68', 'J75'].map((u) => `${u}-MAINT-RATIO-MEANING-Q${i + 1}`),
    ],
    rationale: t(
      `${entry.rationale.zh} ${ratioDetails[i]![0]}`,
      `${entry.rationale.en} ${ratioDetails[i]![1]}`,
    ),
  };
});
