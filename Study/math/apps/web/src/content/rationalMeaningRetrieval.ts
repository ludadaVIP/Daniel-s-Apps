import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J83' | 'J84') => {
  const near = unit === 'J83',
    id = (n: number) => `${unit}-MAINT-RATIONAL-MEANING-Q${n}`;
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
        '一次一个编号小问，可分次、不计时。先自主画图、写完整等值步骤和反例，再逐项人审；允许口述/熟悉语言，读题协助与数学提示分开。',
        'One numbered part per untimed sitting. Construct diagrams, complete equivalent steps and counterexamples before human review of each requirement. Oral/familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '纸笔给定原条件，各分支从原值独立开始；等值结果与图须自行生成。省略号明确表示该数字无限重复，非测量舍入。',
        'Given paper conditions; restart each independent branch from the originals. Generate equivalent results and diagrams yourself. An ellipsis explicitly means that digit repeats forever, not measurement rounding.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象/结构', 'Object/structure'),
        t('原值', 'Original value'),
      ],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const x = near ? '-5/4' : '-7/4',
    y = near ? '-1/2' : '-3/4';
  const q1 = card(
    1,
    'rational-opposite-sign',
    `① 把${near ? '3/(−2)、(−3)/(−2)' : '5/(−4)、(−5)/(−4)'}规范成正分母，另用整数比表示−2与0；说清有理数定义的分子/分母条件，零的类别和负零。② 对表中X求相反数、倒数与再取一次相反数，各用和0/积1核验。画每单位4等分的固定单位数轴，标X、Y、0与X的相反数；改8等分或改小数表示，会移动点吗？③ 求X、Y各到零的距离、X到Y及反向的有向变化和距离。分别从原条件把Y改为X、改为0、改为原Y的相反数，重算两点距，解释重合/零端点/跨零以及同侧路径重叠。距离相同可断定位置相同吗？④ 表中D为有限截断，R为明确无限循环。分别化整数比并精确算D−R，能因显示接近就写相等吗？另在数轴上比较${near ? '−2.05与−2.5' : '−3.04与−3.4'}，不能只比较无符号数字。`,
    `① Normalise ${near ? '3/(−2) and (−3)/(−2)' : '5/(−4) and (−5)/(−4)'} to positive denominators. Also write −2 and zero as integer ratios, stating the rational-number numerator/denominator conditions, zero’s category and negative zero. ② For original X find its opposite, reciprocal and double opposite, checking zero sums/unit products. DRAW X,Y,zero and X’s opposite on a FIXED unit line partitioned into quarters. Would eighths or decimal notation move the points? ③ Find each point’s distance to zero, X-to-Y and reverse signed changes and distances. Independently replace Y by X, by zero and by the ORIGINAL Y’s opposite: recompute pairwise distance for coincidence, a zero endpoint and crossing zero, explaining same-side overlap. Do equal distances imply equal positions? ④ D is a FINITE truncation, R the explicitly INFINITE repeat. Convert both to integer ratios and find exact D−R; does display closeness establish equality? Separately order ${near ? '−2.05 and −2.5' : '−3.04 and −3.4'} on a line without comparing unsigned digits alone.`,
    `正分母规范${near ? '−3/2、3/2' : '−5/4、5/4'}；−2=−2/1、0=0/1，分子分母整数且分母非0；零不正不负、无不同负零。X相反数${near ? '5/4' : '7/4'}，倒数${near ? '−4/5' : '−4/7'}，双相反回X，分别和0/积1。原单位不变，4等分改8等分只加细分；X可写${near ? '−1.25' : '−1.75'}。到零${near ? '5/4、1/2' : '7/4、3/4'}；正向${near ? '3/4' : '1'}，反向${near ? '−3/4' : '−1'}，距离${near ? '3/4' : '1'}。Y=X距0，Y=0距${near ? '5/4' : '7/4'}，Y反射后距${near ? '7/4' : '5/2'}。同侧不把到零路径重复加；±X同到零距不同位置。D=${near ? '−333/1000' : '−333/500'}，R=${near ? '−1/3' : '−2/3'}，差${near ? '1/3000' : '1/1500'}>0，有限截断不是精确循环。较大为${near ? '−2.05' : '−3.04'}，因更靠右。`,
    `Normal forms: ${near ? '−3/2,3/2' : '−5/4,5/4'}. Integers −2=−2/1 and zero=0/1 qualify with integer numerator/denominator and NONZERO denominator. Zero is neither sign and has no separate negative-zero position. X’s opposite=${near ? '5/4' : '7/4'}, reciprocal=${near ? '−4/5' : '−4/7'}, double opposite=X; check sum zero/product one. Changing quarters to eighths refines the SAME unit. X=${near ? '−1.25' : '−1.75'}. Zero-distances=${near ? '5/4,1/2' : '7/4,3/4'}; signed forward/reverse changes=${near ? '3/4,−3/4' : '1,−1'}, distance=${near ? '3/4' : '1'}. With Y=X distance zero; Y=0 gives ${near ? '5/4' : '7/4'}; reflecting original Y gives ${near ? '7/4' : '5/2'}. Same-side paths overlap. Opposite positions have equal zero-distances without being equal. D=${near ? '−333/1000' : '−333/500'}, R=${near ? '−1/3' : '−2/3'}; D−R=${near ? '1/3000' : '1/1500'}>0. A finite truncation is not the exact repeat. The larger ordered number is ${near ? '−2.05' : '−3.04'}, farther right.`,
    '把位置、有向变化与距离分列；有限小数按位值写分母，循环小数用明示无限重复的意义，不能偷换。',
    'Separate position, directed change and distance. Use place value for finite decimals and the explicitly infinite meaning of the repeat; do not interchange them.',
  );
  table(q1, [
    ['X', '原位置X', 'Original point X', x],
    ['Y', '原位置Y', 'Original point Y', y],
    ['D', '有限小数', 'Finite decimal', near ? '-0.333' : '-0.666'],
    ['R', '无限循环', 'Infinite repeat', near ? '-0.333…' : '-0.666…'],
  ]);

  const a = near ? '-5/6' : '-7/8',
    b = near ? '1/4' : '1/3';
  const q2 = card(
    2,
    'signed-fraction-addition',
    `原a、b见表，每单位保持同长。① 用共同小份相消与数轴两种方法求a+b、a+(−b)，再求a−b、a−(−b)，四式均保留完整符号，解释哪些结果相同而过程不同。每个差加回原减数核验，不能改a的符号。② 从原a独立求a+a、a+(−a)、a+0、a−0、0−a与a−(−2)，说明同号、完全相消、零与跨零，既不能见异号就写0，也不能见减号就说变小。③ 自写两种合法加法交换/结合次序计算(a+b)+(−a)，保持整个带符号项，给精确值；再比较(a−b)−a与a−(b−a)，指出括号不能随加法性质搬到减法。④ 独立算${near ? '−0.7+1.2' : '−0.9+1.4'}，用共同十分之一解释，说明不同物理整体的“半份”为什么不能直接相消。`,
    `Original a,b are in the table; preserve one unit. ① Use BOTH common-part cancellation and a number line for a+b and a+(−b), then calculate a−b and a−(−b), retaining every sign. Explain equal endpoints versus different operations. Check EVERY difference by adding its ORIGINAL subtrahend back, without changing a’s sign. ② Independently calculate a+a, a+(−a), a+0, a−0, 0−a and a−(−2), explaining same signs, complete cancellation, zero and crossing zero. Opposite signs need not cancel completely and subtraction need not decrease. ③ Calculate (a+b)+(−a) in TWO justified addition orders using commutativity/associativity, retaining whole signed terms and exact values. Compare (a−b)−a with a−(b−a): addition properties do not licence new subtraction brackets. ④ Separately calculate ${near ? '−0.7+1.2' : '−0.9+1.4'} in common tenths, and explain why halves of differently sized physical wholes cannot automatically cancel.`,
    `共同${near ? '十二' : '二十四'}分之一：a=${near ? '−10/12' : '−21/24'}、b=${near ? '3/12' : '8/24'}。a+b与a−(−b)均${near ? '−7/12' : '−13/24'}；a+(−b)与a−b均${near ? '−13/12' : '−29/24'}，箭头方向由完整变化决定，向右仍负。减法保a，改加原减数相反数，差加原b或−b均回a。同号a+a=${near ? '−5/3' : '−7/4'}；a+反a=0；加/减0仍a；0−a=${near ? '5/6' : '7/8'}；a−(−2)=${near ? '7/6' : '9/8'}正，均可核回。加法原顺序先得a+b再加−a，或合法交换结合(a+−a)+b，均b=${b}；不是把符号删掉。(a−b)−a=−b=${near ? '−1/4' : '−1/3'}，a−(b−a)=${near ? '−23/12' : '−25/12'}，不等。十分之一${near ? '−7+12' : '−9+14'}剩正5份，得1/2。相消需共同原单位，同名半份不保证同物理量。`,
    `Common ${near ? 'twelfths' : 'twenty-fourths'}: a=${near ? '−10/12' : '−21/24'}, b=${near ? '3/12' : '8/24'}. a+b and a−(−b) both give ${near ? '−7/12' : '−13/24'}; a+(−b) and a−b both give ${near ? '−13/12' : '−29/24'}. Arrows show the WHOLE change; a rightward move still ends negative. Preserve a and add the subtrahend’s opposite, checking each difference plus its original b or −b. Same-sign a+a=${near ? '−5/3' : '−7/4'}; opposite sum=0; adding/subtracting zero preserves a; 0−a=${near ? '5/6' : '7/8'}; a−(−2)=${near ? '7/6' : '9/8'} crosses zero. The original addition order and justified rearrangement (a+−a)+b both give b=${b}, retaining signed terms. But (a−b)−a=−b=${near ? '−1/4' : '−1/3'}, whereas a−(b−a)=${near ? '−23/12' : '−25/12'} differs. In tenths ${near ? '−7+12' : '−9+14'} leaves positive five tenths=1/2. Cancellation needs a common original unit; matching fraction names do not guarantee equal physical quantities.`,
    '先把四种运算各自改成完整的带符号加数，统一小份，再看方向；核验加的是原减数。',
    'Rewrite each operation as complete signed addends in common parts, then inspect direction. Add back the ORIGINAL subtrahend in a check.',
  );
  table(q2, [
    ['a', '原数a', 'Original a', a],
    ['b', '原数b', 'Original b', b],
  ]);

  const v = near ? '-5/4' : '-7/6';
  const q3 = card(
    3,
    'signed-scaling-and-division',
    '① 由原X自己建七行表，依次乘1/2、−1/2、2、−2、0、1、−1。每行给精确结果、到零距离缩放倍数和是否反射/归零，画至少一幅正因子和一幅负因子映射。负份数不是实物重复。② 另求X÷2与X÷(−1/2)，写原除数、倒数、乘回；比较原X与结果的数值大小和绝对值大小，不能只说“变大/变小”。③ 展开三个X的乘积，报告符号与精确值；两负相乘为正能推广到任意个负因子吗？④ 用X×1+X×(−1)=X×[1+(−1)]证明乘−1与相反数的关系，不只背口诀。乘零都有定义，能否因此让零成为除数或让非零数有零倒数？用唯一乘回条件区分。',
    '① BUILD a seven-row table multiplying original X by 1/2,−1/2,2,−2,0,1,−1. Give every exact result, magnitude scale and reflection/zero-map status. DRAW at least one positive-factor and one negative-factor map; negative copies are not physical repeated addition. ② Separately find X÷2 and X÷(−1/2), identifying original divisor, reciprocal and multiplication check. Compare numerical order AND absolute magnitude with X rather than saying only bigger/smaller. ③ Expand THREE copies of X into an exact product and sign: do two-negative sign rules apply unchanged to any number of negatives? ④ Use X×1+X×(−1)=X×[1+(−1)] to justify the opposite relationship for multiplying by −1. Does defined multiplication by zero permit a zero divisor or zero reciprocal for a nonzero number? Explain using unique inverse checks.',
    `七结果${near ? '−5/8、5/8、−5/2、5/2、0、−5/4、5/4' : '−7/12、7/12、−7/3、7/3、0、−7/6、7/6'}，幅距倍数1/2、1/2、2、2、0、1、1；负非零因子反射，正不反射，零全归原点。X÷2=${near ? '−5/8' : '−7/12'}，原除数2倒数1/2；幅距缩半但负数数值增大。X÷(−1/2)=${near ? '5/2' : '7/3'}，倒数−2，幅距加倍并反射，各乘回原除数还原X。三X积${near ? '−125/64' : '−343/216'}，先两负得正，再乘负转负，非任意负因子均正。分配律右边X×0=0，故X×(−1)与X和0，正是相反数。零乘合法不等零除合法：非零/0无乘回解，0/0不唯一，0/非零才唯一为0；非零的倒数也非零。`,
    `Seven products: ${near ? '−5/8,5/8,−5/2,5/2,0,−5/4,5/4' : '−7/12,7/12,−7/3,7/3,0,−7/6,7/6'}. Magnitude scales: 1/2,1/2,2,2,0,1,1. Negative nonzero factors reflect, positive factors do not; zero maps all points to the origin. X÷2=${near ? '−5/8' : '−7/12'} uses reciprocal 1/2: magnitude halves but numerical value increases from negative X. X÷(−1/2)=${near ? '5/2' : '7/3'} uses reciprocal −2: magnitude doubles and reflects. Multiplying each quotient by its ORIGINAL divisor restores X. THREE X factors give ${near ? '−125/64' : '−343/216'}: the first two yield positive, then a negative gives negative. Distributivity gives X×[1+(−1)]=X×0=0, so X×(−1) is X’s opposite. Defined multiplication by zero does not permit zero division: nonzero/0 has no inverse solution, 0/0 is non-unique and zero/nonzero is uniquely zero. A nonzero number’s reciprocal is nonzero.`,
    '先按因子的绝对值缩放，再决定是否关于零反射；数值顺序与到零距离分别比较。',
    'Scale by the factor’s magnitude, then decide whether to reflect. Compare numerical order separately from distance to zero.',
  );
  table(q3, [['X', '原有理数', 'Original rational', v]]);

  const q4 = card(
    4,
    'rational-operation-structure',
    `① 对表中E逐步只替换一个已算子式，每行保留其余完整式子，写精确值；再合法用分配律另算，核两路径同值，不先舍入。② 对F标内外减数，完整逐步算，解释“减整个子式”的范围。③ 比较−(${near ? '3/2' : '5/3'})²、(−${near ? '3/2' : '5/3'})²与(−${near ? '3/2' : '5/3'})³，圈每个底数并展开乘法，不能只靠负号个数猜范围。④ 独立给0×[1/(${near ? '2−2' : '3−3'})]，先标定义域，再说明外面乘0能否把未定义变为0；与0÷(−2/3)比较。⑤ 另比较${near ? '1/3−1/2−1/6与1/3−(1/2−1/6)' : '1/4−1/2−1/8与1/4−(1/2−1/8)'}，保留全式说明同级加减的原顺序。`,
    `① For original E, replace ONE completed subtree per line, preserving the ENTIRE remaining expression and exact values. Calculate again by justified distribution to check both paths; do not round first. ② For F mark inner/outer subtrahends and calculate in complete lines, explaining the scope of subtracting an entire subtree. ③ Compare −(${near ? '3/2' : '5/3'})², (−${near ? '3/2' : '5/3'})² and (−${near ? '3/2' : '5/3'})³. CIRCLE each base and expand multiplication instead of guessing scope from the number of minus signs. ④ Independently consider 0×[1/(${near ? '2−2' : '3−3'})]. Check its DOMAIN: does an outside zero turn an undefined subexpression into zero? Compare 0÷(−2/3). ⑤ Separately compare ${near ? '1/3−1/2−1/6 with 1/3−(1/2−1/6)' : '1/4−1/2−1/8 with 1/4−(1/2−1/8)'}, preserving whole expressions and the original equal-precedence order.`,
    `E内括号${near ? '−7/12' : '−13/24'}，保外乘${near ? '−3/2' : '−6/5'}，得${near ? '7/8' : '13/20'}；分配另算${near ? '5/4−3/8=7/8' : '21/20−2/5=13/20'}，逐步全式且无舍入。F内${near ? '−5/6+1/2=−1/3' : '−7/8+3/8=−1/2'}，外减整个负子式，得${near ? '1/3+1/3=2/3' : '1/4+1/2=3/4'}。三乘方分别${near ? '−9/4、9/4、−27/8' : '−25/9、25/9、−125/27'}：首式平方底数为正分数、外取相反，另两式底数含负号。零乘未定义仍未定义，因子1/0不存在，不能假写0×数；0÷非零为0且可唯一乘回。新减法原从左得${near ? '−1/3' : '−3/8'}，新加右括号式得${near ? '0' : '−1/8'}，不是等值步骤；须展示完整余式，不凭最后巧合数字判中间理由。`,
    `E’s bracket=${near ? '−7/12' : '−13/24'}; retain its outside factor ${near ? '−3/2' : '−6/5'} for ${near ? '7/8' : '13/20'}. Distributing independently gives ${near ? '5/4−3/8=7/8' : '21/20−2/5=13/20'}, with complete lines and no rounding. F’s inner bracket=${near ? '−5/6+1/2=−1/3' : '−7/8+3/8=−1/2'}; subtract that WHOLE negative subtree to get ${near ? '1/3+1/3=2/3' : '1/4+1/2=3/4'}. The three powers are ${near ? '−9/4,9/4,−27/8' : '−25/9,25/9,−125/27'}. The first square has a positive fraction base with an outside negation; the others include the minus in the base. Zero times an undefined factor remains undefined: 1/0 is not a number. Zero divided by a nonzero number is uniquely zero. The new subtraction gives ${near ? '−1/3' : '−3/8'} from the left versus ${near ? 'zero' : '−1/8'} with added right brackets, so these are not equivalent steps. Preserve whole expressions; numerical coincidence cannot validate an invalid intermediate reason.`,
    '圈子式和底数范围；算完一处只替换这一处，其他运算仍完整保留，先查每个除数。',
    'Mark subtree and base scope. Replace only the completed part, preserving all other operations, and inspect every divisor.',
  );
  table(q4, [
    [
      'E',
      '原括号乘法',
      'Original bracketed product',
      near ? '(−5/6+1/4)×(−3/2)' : '(−7/8+1/3)×(−6/5)',
    ],
    [
      'F',
      '原嵌套减法',
      'Original nested subtraction',
      near ? '1/3−[−5/6−(−1/2)]' : '1/4−[−7/8−(−3/8)]',
    ],
  ]);
  return {
    id: `${unit}-MAINT-RATIONAL-MEANING`,
    unit,
    title: t(
      '有理数的单位、零与完整结构',
      'Rational units, zero and complete structure',
    ),
    bridge: 'J71-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 3, 5, 6].map((l, i) => [id(i + 1), `J71-L0${l}`]),
    ),
    intro: t(
      '四张纸笔卡，一次一个编号小问，可分次、不计时。第1卡共享位置/距离，第2卡共享加/减；先生成同单位图与完整等值步骤，再逐项人审。允许口述/熟悉语言，读题协助与数学提示分开；纸笔数据不冒实际测量，图的显示范围不改变精确值。',
      'Four paper cards, one numbered part per untimed sitting. Card one shares position/distance; card two shares addition/subtraction. Construct common-unit diagrams and complete equivalent steps before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Paper data are not measurements, and a drawing’s display range does not alter an exact value.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const rationalMeaningRetrieval = {
  J83_RATIONAL_MEANING: makeSet('J83'),
  J84_RATIONAL_MEANING: makeSet('J84'),
};
