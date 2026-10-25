import { t, type Question } from '../model';
import { reasoning } from './builders';

const f = (milli: number) =>
  `${Math.floor(milli / 1000)}.${String(milli % 1000).padStart(3, '0')}`;
const money = (cents: number) =>
  `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const fraction = (milli: number, groups: number) => {
  const d = 1000 * groups,
    g = gcd(milli, d);
  return `${milli / g}/${d / g}`;
};
const makeSet = (unit: 'P61' | 'P65') => {
  const first = unit === 'P61',
    id = (n: number) => unit + '-MAINT-DECIMAL-STRUCTURE-Q' + n;
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
        '一次只做一个小问。先画、写关系和单位，再逐项核查全部小问；结果或关键词不自动表示理解。',
        'Do ONE subpart at a time. Generate a drawing, relationships and units before checking EVERY part; a result or keyword does not automatically establish understanding.',
      ),
    ]);
  const table = (
    q: Question,
    z: string,
    e: string,
    headers: [string, string][],
    rows: (string | ReturnType<typeof t>)[][],
  ) => {
    q.contextTable = {
      caption: t(z, e),
      columns: headers.map((h) => t(...h)),
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };

  const place = first
      ? [2406, 2460, 6, 60, 600, 0]
      : [3507, 3570, 7, 70, 700, 0],
    a = place[0]!,
    digit = first ? 6 : 7,
    whole = first ? 2 : 3,
    leading = first ? 4 : 5,
    ropeM = first ? 1 : 2,
    ropeMm = first ? 7 : 8;
  const q1 = task(
    1,
    'decimal-place-value',
    '同一个整体下，逐行画个位/十分/百分/千分四列，写各位贡献、完整小数与总千分之一个数。比较C/D/E的同一个数字在三个单位的大小比；B删尾零与A删中间零各保值吗，用计数核。把A的千分位加1、再从原A重开只把百分位0改1，各增多少？亲画三个等画宽的放大窗：1个整体、0.1整体、0.01整体，各十格并标每格单位；只观察A小数部分，给它所在十分之一窗和百分之一窗的起止值、余下涂色量，为什么等画宽不等量，整数部分是否也画进去？另根独立绳长' +
      ropeM +
      'm又' +
      ropeMm +
      'mm，用1m=1000mm写成m与总mm并换回。',
    'Using the SAME whole, draw ones/tenths/hundredths/thousandths columns for every row, giving place contributions, the decimal and TOTAL thousandths. Compare C/D/E: the same digit counts different units—what are their ratios? Does deleting B’s trailing zero preserve value, and does deleting A’s internal zero? Check by counting units. Increase A’s thousandths digit by one; independently restart A and change only its zero hundredths to one. What changes in each case? DRAW three equally wide zoom windows representing one whole, 0.1 whole and 0.01 whole, each with ten labelled cells. For A’s FRACTIONAL part, give its tenth/hundredth window endpoints and remaining shaded amount. Why do equal drawn widths not mean equal amounts, and where is the integer part? Separately convert a rope of ' +
      ropeM +
      ' m and ' +
      ropeMm +
      ' mm to m and total mm, then recover the mixed units, using 1 m=1000 mm.',
    place
      .map(
        (v, i) =>
          `${String.fromCharCode(65 + i)}：${f(v)}=${Math.floor(v / 1000)}+${f((Math.floor(v / 100) % 10) * 100)}+${f((Math.floor(v / 10) % 10) * 10)}+${f(v % 10)}，共${v}个千分之一。`,
      )
      .join('') +
      `C/D/E为${digit}个千分之一/百分之一/十分之一，E=10D=100C，D=10C。B的${f(place[1]!)}去尾0保${place[1]}千分之一；A去中间0变${whole}.${leading}${digit}，即${whole * 1000 + leading * 100 + digit * 10}千分之一，原${a}不同。A千分位加1为${f(a + 1)}，增0.001；从原A百分位0改1为${f(a + 10)}，增0.010。三整窗依次1/0.1/0.01，每格0.1/0.01/0.001；A只画小数部分${f(a % 1000)}，整数${whole}另计。十分之一窗${f(leading * 100)}到${f((leading + 1) * 100)}、百分之一窗${f(leading * 100)}到${f(leading * 100 + 10)}，两次余下涂色均${f(digit)}，但两窗单位不同。屏幕等画宽因放大倍数不同，不能据此当相同整体。绳${ropeM}m${ropeMm}mm=${ropeM}.${String(ropeMm).padStart(3, '0')}m=${ropeM * 1000 + ropeMm}mm，反拆${ropeM}×1000+${ropeMm}，换单位不伸缩。`,
    place
      .map(
        (v, i) =>
          `${String.fromCharCode(65 + i)}: ${f(v)}=${Math.floor(v / 1000)}+${f((Math.floor(v / 100) % 10) * 100)}+${f((Math.floor(v / 10) % 10) * 10)}+${f(v % 10)}; total ${v} thousandths.`,
      )
      .join(' ') +
      ` C/D/E are ${digit} thousandths/hundredths/tenths: E=10D=100C and D=10C. Removing B’s trailing zero preserves ${place[1]} thousandths; deleting A’s internal zero gives ${whole}.${leading}${digit}, or ${whole * 1000 + leading * 100 + digit * 10} thousandths, DIFFERENT from ${a}. Thousandths plus one gives ${f(a + 1)}, increase 0.001. Restarting A and changing hundredths 0 to 1 gives ${f(a + 10)}, increase 0.010. Full zoom windows represent 1/0.1/0.01; cells represent 0.1/0.01/0.001. Show ONLY fractional ${f(a % 1000)}; the ${whole} whole units remain separate. Tenth window ${f(leading * 100)} to ${f((leading + 1) * 100)}; hundredth window ${f(leading * 100)} to ${f(leading * 100 + 10)}. Remaining shading is ${f(digit)} in each zoom, with different window units. Equal screen widths do not imply equal represented quantities. Rope ${ropeM} m ${ropeMm} mm=${ropeM}.${String(ropeMm).padStart(3, '0')} m=${ropeM * 1000 + ropeMm} mm; reverse ${ropeM}×1000+${ropeMm}. Conversion does not stretch the rope.`,
    '先把每位都换成千分之一；放大窗只显示小数部分，整窗与每格的单位都要标。',
    'Express every place in thousandths first; zoom only the fractional part and label BOTH window and cell units.',
  );
  table(
    q1,
    '六个原小数；字母为身份，不是位值答案。',
    'Six original decimals; letters are IDs, not place-value answers.',
    [
      ['编号', 'ID'],
      ['原小数', 'Original decimal'],
    ],
    place.map((v, i) => [String.fromCharCode(65 + i), f(v)]),
  );

  const sort = first
      ? ['0.9', '0.89', '0.905', '0.090']
      : ['0.6', '0.59', '0.605', '0.060'],
    r = first ? 2995 : 3995,
    double = first ? 449 : 349,
    pair = first ? [904, 906] : [604, 606],
    runs = first ? [1260, 2670] : [1340, 2780];
  const q2 = task(
    2,
    'decimal-comparison',
    '先把S1–S4写到千分位，画有数值标尺的小数数轴并从小到大排，比较时指出第一次不同的高位，不能看位数长短。R到最近百分之一：给两邻居、中点及距离，非负数中点取上边，保留两位报告并保原值。D直接到十分之一，再比较先到百分之一后到十分之一；能把后者代替直接舍入吗？E1/E2各到十分之一，近似同值能证明原值相等吗，给精确差。最后K1/K2单位km，先各自到十分之一再估合计，另给精确合计，分别标≈与=；不能把这种估合计当成直接舍入精确和。',
    'Express S1–S4 to thousandths, DRAW a labelled decimal number line and sort ascending, naming the first differing higher place rather than counting digits. Round R to hundredths: give neighbours, midpoint and distances; use the UPPER neighbour for a nonnegative halfway tie and keep two decimal places in the report while retaining R. Round D DIRECTLY to tenths, then compare rounding to hundredths followed by tenths: may the second procedure replace direct rounding? Round E1/E2 to tenths; does a shared report prove equal originals? Give their exact difference. K1/K2 are in km: first round EACH to tenths and estimate their sum; separately give the exact sum, marking approximation versus equality. Do not call this the same procedure as directly rounding the exact sum.',
    (first
      ? '排序0.090<0.890<0.900<0.905；0.890与0.900首次十分位8<9，0.900与0.905首次千分位0<5，0.090与其后各数首先十分位不同。'
      : '排序0.060<0.590<0.600<0.605；0.590与0.600首先十分位5<6，0.600与0.605首先千分位0<5，0.060与其后各数首先十分位不同。') +
      `R=${f(r)}邻居${f(r - 5).slice(0, -1)}与${f(r + 5).slice(0, -1)}，中点原R，两距0.005，报告≈${f(r + 5).slice(0, -1)}，尾零表精度，原值未变。D=${f(double)}直接到十分之一≈${first ? '0.4' : '0.3'}；先百分之一≈${first ? '0.45' : '0.35'}，再十分之一≈${first ? '0.5' : '0.4'}，两次舍入改变选择，应按题目从原数直接舍入。E精确${f(pair[0]!)}≠${f(pair[1]!)}，差0.002，虽都≈${first ? '0.9' : '0.6'}也不精确相等。K各估${first ? '1.3+2.7=4.0' : '1.3+2.8=4.1'}km，精确${f(runs[0]!)}+${f(runs[1]!)}=${f(runs[0]! + runs[1]!)}km；估合计写≈，不改原数或说两种舍入过程相同。图的标尺须对应原千分之一，不以很近的像素判相等。`,
    (first
      ? 'Order 0.090<0.890<0.900<0.905. The first difference between 0.890 and 0.900 is tenths 8<9; between 0.900 and 0.905 it is thousandths 0<5;0.090 first differs at tenths from the rest.'
      : 'Order 0.060<0.590<0.600<0.605. The first difference between 0.590 and 0.600 is tenths 5<6; between 0.600 and 0.605 it is thousandths 0<5;0.060 first differs at tenths from the rest.') +
      ` R=${f(r)} has neighbours ${f(r - 5).slice(0, -1)} and ${f(r + 5).slice(0, -1)}; midpoint R and distances 0.005 give report≈${f(r + 5).slice(0, -1)}. Keep trailing zeros for reported precision and retain the original. D=${f(double)} directly to tenths≈${first ? '0.4' : '0.3'}, but first to hundredths≈${first ? '0.45' : '0.35'} and then tenths≈${first ? '0.5' : '0.4'}. This is double rounding, not the requested direct result. E originals ${f(pair[0]!)} and ${f(pair[1]!)} differ by 0.002 despite both rounding≈${first ? '0.9' : '0.6'}. K separate estimates ${first ? '1.3+2.7=4.0' : '1.3+2.8=4.1'} km versus exact ${f(runs[0]!)}+${f(runs[1]!)}=${f(runs[0]! + runs[1]!)} km. Label estimates approximately; do not change originals or identify the two rounding procedures. Number-line scales use original thousandths, not pixel proximity.`,
    '原数先对齐，再分清直接舍入、两次舍入及先各量舍入；每次保留原值。',
    'Align originals, then distinguish direct rounding, double rounding and rounding each input; retain originals.',
  );
  table(
    q2,
    'S为排序，R/D/E为指定舍入，K为km原距离。',
    'S rows are for sorting, R/D/E for rounding, K for original distances in km.',
    [
      ['编号', 'ID'],
      ['原记录', 'Original record'],
    ],
    [
      ...sort.map((s, i) => ['S' + (i + 1), s]),
      ['R', f(r)],
      ['D', f(double)],
      ['E1', f(pair[0]!)],
      ['E2', f(pair[1]!)],
      ['K1', f(runs[0]!) + 'km'],
      ['K2', f(runs[1]!) + 'km'],
    ],
  );

  const calc = first
    ? ([
        ['A', '+', 2786, 657],
        ['B', '−', 4002, 586],
        ['C', '−', 1240, 1240],
        ['D', '+', 700, 65],
      ] as const)
    : ([
        ['A', '+', 3875, 268],
        ['B', '−', 5003, 728],
        ['C', '−', 2050, 2050],
        ['D', '+', 800, 75],
      ] as const);
  const q3 = task(
    3,
    'decimal-addition',
    '四行各自独立，长度单位均m。亲画小数点对齐的四列竖式，末尾补零不改值，每列写单位、从右传入/向左换出的量，再求结果。A每次进位具体把哪10个小单位换成1个大单位？B经过两个0借位时，先完整重写被减数的换组形式并核原值，再减，不能借出却忘记左列减少。C相同值相减与未知量有何区别？D若把删小数点后的裸数字直接相加、再当千分之一，为什么单位混了？每行用逆运算和整数千分之一交叉核查；末尾零可保留，单位m不能换写为cm或L。',
    'The four rows are INDEPENDENT lengths in metres. DRAW aligned ones/tenths/hundredths/thousandths columns, add trailing zeros without changing value, and record incoming/outgoing exchanges and the unit of each column before finding results. In A, which ten smaller units become one larger unit at each carry? For B, borrow across TWO zeros: first rewrite the entire minuend as regrouped units and verify its original value, then subtract without forgetting reductions in left columns. In C, distinguish a determined zero difference from an unknown. In D, why does adding bare digit strings after deleting decimal points and calling the result thousandths mix units? Check EVERY result by an inverse operation and integer thousandths. Trailing zeros may stay; do not relabel metres as cm or litres.',
    (first
      ? 'A：2.786+0.657=3.443m；千分6+7=13写3进1百分，百分8+5+1=14写4进1十分，十分7+6+1=14写4进1整体，个位2+0+1=3。B：4.002−0.586=3.416m；4.002可换3个一、9个十分、9个百分、12个千分，3000+900+90+12=4002千分；逐列减0.586得3.416m，3.416+0.586=4.002。C：1.240−1.240=0.000m，已知零不是未知。D：0.700+0.065=0.765m，7原计十分之一，65计千分之一，应700+65=765，不能7+65=72再写0.072。'
      : 'A：3.875+0.268=4.143m；千分5+8=13写3进1百分，百分7+6+1=14写4进1十分，十分8+2+1=11写1进1整体，个位3+0+1=4。B：5.003−0.728=4.275m；5.003可换4个一、9个十分、9个百分、13个千分，4000+900+90+13=5003千分；逐列减0.728得4.275m，4.275+0.728=5.003。C：2.050−2.050=0.000m，是确定的零差。D：0.800+0.075=0.875m，8计十分之一、75计千分之一，应800+75=875，不是8+75=83再写0.083。') +
      ' 每次换组保持总值；十分之一、百分之一、千分之一不能按末位对齐混列。加法结果减第二量应回第一量，减法结果加减数应回被减数。四行还须用原整数千分之一验证，不能只有末值而没有换组解释。',
    (first
      ? 'A:2.786+0.657=3.443 m. Thousandths 6+7=13: write 3/carry 1 hundredth; hundredths 8+5+1=14: write 4/carry 1 tenth; tenths 7+6+1=14: write 4/carry 1 whole; ones 2+0+1=3. B:4.002−0.586=3.416 m; regroup 4.002=3 ones+9 tenths+9 hundredths+12 thousandths;3000+900+90+12=4002 thousandths. Subtract 0.586 to get 3.416 m;3.416+0.586=4.002. C:1.240−1.240=0.000 m, a determined zero. D:0.700+0.065=0.765 m:7 counts tenths but65 counts thousandths;700+65=765, not 7+65=72 then 0.072.'
      : 'A:3.875+0.268=4.143 m. Thousandths 5+8=13: write 3/carry 1 hundredth; hundredths 7+6+1=14: write 4/carry 1 tenth; tenths 8+2+1=11: write 1/carry 1 whole; ones 3+0+1=4. B:5.003−0.728=4.275 m; regroup 5.003=4 ones+9 tenths+9 hundredths+13 thousandths;4000+900+90+13=5003 thousandths. Subtract 0.728 to get 4.275 m;4.275+0.728=5.003. C:2.050−2.050=0.000 m, a determined zero. D:0.800+0.075=0.875 m:8 counts tenths but75 counts thousandths;800+75=875, not 8+75=83 then 0.083.') +
      ' Every exchange preserves value. Align decimal places, not final nonzero digits. Subtract the second amount from an addition result, or add a subtrahend back to a difference. Also verify all four with integer thousandths. Require exchanges and units, not only the final numbers.',
    '每列先说是什么单位；借过0要把整份原量重新分组，再逐列扣除。',
    'Name each column’s unit; when borrowing through zeros, rewrite the whole original amount before subtracting columns.',
  );
  q3.misconceptionTags = ['decimal-addition', 'decimal-subtraction'];
  table(
    q3,
    '四条独立长度计算，原量均为m。',
    'Four independent length calculations; all amounts are in metres.',
    [
      ['编号', 'ID'],
      ['运算', 'Operation'],
      ['第一量/m', 'First/m'],
      ['第二量/m', 'Second/m'],
    ],
    calc.map(([id, op, a, b]) => [id, op, f(a), f(b)]),
  );

  const multiply = first
    ? ([
        ['A', 248, 4],
        ['B', 1250, 4],
        ['C', 864, 0],
        ['D', 0, 4],
      ] as const)
    : ([
        ['A', 175, 4],
        ['B', 750, 4],
        ['C', 1406, 0],
        ['D', 0, 4],
      ] as const);
  const q4 = task(
    4,
    'decimal-whole-multiplication',
    '各行每组量单位L，整数为组数。亲画相等组，每条完整轨道统一代表2L、涂色按每组量成比例，标组数和每组量，再用重复加法与千分之一整数乘法两法求总L。B结果可为整数吗？C零组与D四组每组0，总量虽相同，组的存在是否相同？从原A另开组数为1和0比较，再与原4组比较，纠正“乘法总会变大”，须说清正量、组数条件；不能把组数当额外L相加或用随意移小数点代替单位说明。',
    'Each amount per group is in litres; integers count groups. DRAW equal groups on tracks EACH representing TWO litres, shading proportionally to amount per group and labelling both roles. Find totals in litres by repeated addition AND integer thousandths. May B’s product be a whole number? C has zero groups and D has four groups each holding zero: do equal totals mean the same groups exist? Independently restart A with ONE and ZERO groups, comparing with its original four. Correct “multiplication always makes larger” by stating positive-amount and group-count conditions. Do not add group count as extra litres or replace unit reasoning with an unexplained decimal-point shift.',
    multiply
      .map(
        ([id, a, g]) =>
          `${id}：${f(a)}L×${g}=${f(a * g)}L；${a}×${g}=${a * g}个千分之一升。${g ? Array.from({ length: g }, () => f(a)).join('+') + '=' + f(a * g) : '零组没有加任何量'}。`,
      )
      .join('') +
      `B=${first ? '5.000=5' : '3.000=3'}L，整数结果合法。C无组，D有4个空组，涂色量都0但组数角色不同；D每条涂色宽0，不画最小正量。A改1组得${f(multiply[0][1])}L、0组得0L；正量×4大于一组、×1相等、×0变0，因此不能无条件说乘总增大。每轨道2L是同尺度，L单位保留，组数不是L。`,
    multiply
      .map(
        ([id, a, g]) =>
          `${id}:${f(a)} L×${g}=${f(a * g)} L; ${a}×${g}=${a * g} thousandths of a litre. ${g ? Array.from({ length: g }, () => f(a)).join('+') + '=' + f(a * g) : 'Zero groups add no amount'}.`,
      )
      .join(' ') +
      ` B=${first ? '5.000=5' : '3.000=3'} L is a legitimate whole-number product. C has no groups; D has FOUR empty groups, all with zero shading width, not a positive minimum. Restart A: one group gives ${f(multiply[0][1])} L, zero gives 0 L. For positive amount, four groups exceed one, one preserves it and zero makes zero; multiplication does not unconditionally increase quantity. Each full track is 2 L with one scale. Retain litre units and distinguish group count from litres.`,
    '整数乘法在计多少个千分之一升；画0组与画4个空组要分开。',
    'The integer product counts thousandths of a litre; distinguish no groups from four empty groups.',
  );
  table(
    q4,
    '四个独立等组记录；每组量的单位L。',
    'Four independent equal-group records; each group amount is in litres.',
    [
      ['编号', 'ID'],
      ['每组/L', 'Each/L'],
      ['组数', 'Group count'],
    ],
    multiply.map(([id, a, g]) => [id, f(a), String(g)]),
  );

  const divide = first
    ? ([
        ['A', 1728, 4],
        ['B', 2400, 2],
        ['C', 1000, 3],
        ['D', 2000, 3],
        ['Z', 0, 5],
      ] as const)
    : ([
        ['A', 1575, 5],
        ['B', 2700, 2],
        ['C', 1000, 6],
        ['D', 2000, 6],
        ['Z', 0, 5],
      ] as const);
  const fixed = first ? 2700 : 1800;
  const q5 = task(
    5,
    'decimal-whole-division',
    '各行总L平均分到正整数份，先画等宽份图，标整个条表示该行总量而非都当1L。A/B用千分之一计数求精确每份，乘回检查；每份能超过1L吗？C/D先给精确分数，再按最近千分之一、中点取上边写近似显示，计算所有显示值合计与原总L的正差距及方向；为什么精确份额仍守恒，不能把约等号改等号？Z零总量与给0份为何不同，正量÷0及0÷0能否写0？F保持总量不变，从3份改6份求每份，比较并乘回，不能以减掉份数当除法。',
    'Share each total in litres into its POSITIVE whole-number count. DRAW equal-width shares, labelling the WHOLE strip with that row’s total rather than assuming every strip is one litre. For A/B, count thousandths to find exact shares and multiply back; can a share exceed one litre? For C/D, give exact fractions first, then nearest-thousandth displays with halfway ties up. Sum ALL rounded displays and report the POSITIVE discrepancy and whether above or below the original. Why do exact shares still conserve total, and why must approximation not become equality? For Z, distinguish zero total from ZERO shares: may positive÷0 or0÷0 be called zero? F fixes the total: change THREE shares to SIX, find and compare shares and multiply back. Division is not subtraction of a share count.',
    divide
      .map(([id, a, g]) => {
        const exact = fraction(a, g),
          rounded = Math.floor((a + g / 2) / g),
          shown = rounded * g,
          delta = Math.abs(shown - a);
        return `${id}：${f(a)}÷${g}=${exact}L${a % g === 0 ? '=' + f(a / g) + 'L，乘回' + f(a / g) + '×' + g + '=' + f(a) : '≈' + f(rounded) + 'L；显示合' + f(rounded) + '×' + g + '=' + f(shown) + 'L，' + (shown > a ? '多' : '少') + f(delta) + 'L；精确分数×' + g + '仍为' + f(a) + 'L'}。`;
      })
      .join('') +
      `B每份${first ? '1.200' : '1.350'}L>1，不能把商错写成整数小单位而换L。Z有5个空份，每份0，原总量0；正量÷0与0÷0均无定义。F：${f(fixed)}÷3=${f(fixed / 3)}L，÷6=${f(fixed / 6)}L，后一份为一半，各乘3/6回${f(fixed)}L。有限三位不够时保分数，舍入显示合计的偏差不是精确等分失去总量；零总量图无涂色但正份数仍在。`,
    divide
      .map(([id, a, g]) => {
        const exact = fraction(a, g),
          rounded = Math.floor((a + g / 2) / g),
          shown = rounded * g,
          delta = Math.abs(shown - a);
        return `${id}:${f(a)}÷${g}=${exact} L${a % g === 0 ? '=' + f(a / g) + ' L; check ' + f(a / g) + '×' + g + '=' + f(a) : '≈' + f(rounded) + ' L; displays ' + f(rounded) + '×' + g + '=' + f(shown) + ' L, ' + f(delta) + ' L ' + (shown > a ? 'ABOVE' : 'BELOW') + ' original; exact fraction×' + g + ' still gives' + f(a) + ' L'}.`;
      })
      .join(' ') +
      ` B gives ${first ? '1.200' : '1.350'} L per share, exceeding one; do not relabel the small-unit integer quotient as whole litres. Z has five empty shares, each zero, retaining zero total. Positive÷0 and 0÷0 are undefined. F:${f(fixed)}÷3=${f(fixed / 3)} L; ÷6=${f(fixed / 6)} L, HALF as much per share; multiplying by three/six respectively recovers ${f(fixed)} L. Preserve exact fractions when three decimals do not suffice. Rounded-display discrepancies do not violate exact conservation. Zero total means no shading while the positive share count remains.`,
    '先用精确分数乘回；再单独相加显示的小数，用原总量检查偏差方向。',
    'Multiply exact fractions back first; separately add displayed decimals and compare their total with the original.',
  );
  table(
    q5,
    'A/B/C/D/Z独立分享；F是固定总量改份数。',
    'A/B/C/D/Z are independent sharing cases; F changes the count for a fixed total.',
    [
      ['编号', 'ID'],
      ['总量/L', 'Total/L'],
      ['平均份数', 'Equal shares'],
    ],
    [
      ...divide.map(([id, a, g]) => [id, f(a), String(g)]),
      ['F', f(fixed), '3 → 6'],
    ],
  );

  const price = first ? 135 : 175,
    count = first ? 3 : 4,
    budget = first ? 500 : 600,
    alt = first ? 400 : 800,
    total = price * count,
    estimate = Math.floor((price + 5) / 10) * 10 * count,
    length = first ? 4000 : 5000,
    piece = first ? 875 : 625,
    cuts = first ? 3 : 4,
    pencilTotal = first ? 480 : 465,
    pencils = first ? 4 : 3,
    prices = first ? [125, 240, 85] : [135, 220, 75],
    sample = first ? [2, 1, 3] : [1, 2, 3],
    sampleCost = prices.reduce((s, p, i) => s + p * sample[i]!, 0),
    sampleEstimate = prices.reduce(
      (s, p, i) => s + Math.floor((p + 5) / 10) * 10 * sample[i]!,
      0,
    );
  const q6 = task(
    6,
    'decimal-modelling',
    'M只买指定瓶数、每瓶价同，无折扣或其他费用，B/B2为两个独立预算。先辨认单价/数量/总价/钱余额，按单价到最近10分（中点取上边）估总价，再用整数分精算；分别报告余额或正短缺并加回核查，恰好付总价又如何？L从原布剪指定条数、每条相同长度，先合已用再求剩余并反查；另从未剪原布重开平均分4段，画等份关系。E为同价铅笔合价与支数，求每支，不把总价当单价。最后用F1–F3三种假想单价，自己为每种选正整数件数，在NZ$10内生成清单、估算/精确合计/余额及检查，可有多种有效方案；价格不需真实查找。说明为什么瓶数不能直接加到L或m，且同数字的km不等于m。',
    'M buys only the stated number of identically priced bottles, with no discounts or extra charges; B/B2 are TWO independent budgets. Name unit price/count/cost/money remaining. Estimate by rounding EACH unit price to nearest ten cents, halfway up, then compute EXACTLY in integer cents. Report remaining money or a POSITIVE shortfall for each budget and reverse-check; what if payment exactly equals cost? L cuts the specified count of equal strips: find used and remaining lengths and check. Independently RESTART with uncut cloth and share it into FOUR equal pieces, drawing the relationship. E gives total cost and count of equally priced pencils: find price per pencil. Finally use the THREE fictional F1–F3 prices to choose POSITIVE whole counts of EACH type within NZ$10, generating a list, estimates, exact cost, balance and checks. MANY valid plans are allowed; no real price search is needed. Explain why bottle counts cannot be added directly to litres/metres and the same numeral in km is not the same length in m.',
    `M总价${price}×${count}=${total}分=NZ$${money(total)}；单价估${Math.floor((price + 5) / 10) * 10}分，估合NZ$${money(estimate)}，不作精确付款。B=${budget}分时${budget >= total ? '余' + (budget - total) + '分=NZ$' + money(budget - total) + '，核' + total + '+' + (budget - total) + '=' + budget : '短缺' + (total - budget) + '分=NZ$' + money(total - budget) + '，核' + budget + '+' + (total - budget) + '=' + total}；B2=${alt}分时${alt >= total ? '余' + (alt - total) + '分=NZ$' + money(alt - total) + '，核' + total + '+' + (alt - total) + '=' + alt : '短缺' + (total - alt) + '分=NZ$' + money(total - alt) + '，核' + alt + '+' + (total - alt) + '=' + total}。恰付${total}分找零0.00，不给负找零。L已用${f(piece)}×${cuts}=${f(piece * cuts)}m，剩${f(length)}−${f(piece * cuts)}=${f(length - piece * cuts)}m，加回原${f(length)}；只减一条不合故事。未剪布另分4段每段${f(length / 4)}m，×4回原长。E：${pencilTotal}分÷${pencils}=${pencilTotal / pencils}分/支=NZ$${money(pencilTotal / pencils)}/支。自编一例件数${sample.join('/')}，精确成本${prices.map((p, i) => p + '×' + sample[i]).join('+')}=${sampleCost}分，余${1000 - sampleCost}分=NZ$${money(1000 - sampleCost)}；单价各到10分估合${sampleEstimate}分=NZ$${money(sampleEstimate)}，精确${sampleCost}分不变。任何三种件数为正整数、按原价格成本≤1000分、估精算/余额/反查一致的方案都可，不只范例。3瓶是数量不是3L；同数字km为m的1000倍。情境均假想，按给定价、无额外费用，不模拟现金舍入或真实交易。`,
    `M cost ${price}×${count}=${total} cents=NZ$${money(total)}. Estimated unit price ${Math.floor((price + 5) / 10) * 10} cents gives total≈NZ$${money(estimate)}, not exact payment. Budget B=${budget} cents: ${budget >= total ? 'remaining ' + (budget - total) + ' cents=NZ$' + money(budget - total) + '; check ' + total + '+' + (budget - total) + '=' + budget : 'shortfall ' + (total - budget) + ' cents=NZ$' + money(total - budget) + '; check ' + budget + '+' + (total - budget) + '=' + total}. B2=${alt} cents: ${alt >= total ? 'remaining ' + (alt - total) + ' cents=NZ$' + money(alt - total) + '; check ' + total + '+' + (alt - total) + '=' + alt : 'shortfall ' + (total - alt) + ' cents=NZ$' + money(total - alt) + '; check ' + alt + '+' + (total - alt) + '=' + total}. Paying exactly ${total} cents gives 0.00 change, never negative change. L used ${f(piece)}×${cuts}=${f(piece * cuts)} m; remaining ${f(length)}−${f(piece * cuts)}=${f(length - piece * cuts)} m, adding back restores ${f(length)}. Removing only one strip changes the story. Independent uncut sharing gives ${f(length / 4)} m each, times four restoring original length. E:${pencilTotal} cents÷${pencils}=${pencilTotal / pencils} cents each=NZ$${money(pencilTotal / pencils)} each. ONE plan: counts ${sample.join('/')}, exact cost ${prices.map((p, i) => p + '×' + sample[i]).join('+')}=${sampleCost} cents; remaining ${1000 - sampleCost} cents=NZ$${money(1000 - sampleCost)}. Rounding each unit price to ten cents estimates ${sampleEstimate} cents=NZ$${money(sampleEstimate)} without changing exact ${sampleCost} cents. Accept ANY positive whole count for each type with original-price cost≤1000 cents, consistent estimates/exact costs/balance/reverse checks, not only the example. Three bottles are not three litres. The same numeral in km gives a length 1000 times its metre version. All facts are fictional with no extra charges, cash-rounding simulation or actual transaction.`,
    '钱用整数分、长度用整数千分之一米；先给中间量命名，再根据目标选运算。',
    'Use integer cents for money and thousandths of metres for length; name intermediates before choosing operations.',
  );
  table(
    q6,
    'M购物、L剪布、E单价与F家庭纸上方案相互独立。',
    'M shopping, L cloth, E unit price and F paper plans are separate cases.',
    [
      ['编号', 'ID'],
      ['量', 'Quantity'],
      ['给定值', 'Given value'],
    ],
    [
      ['M_P', t('每瓶单价', 'Price per bottle'), 'NZ$' + money(price)],
      ['M_N', t('瓶数', 'Bottle count'), String(count)],
      ['B', t('预算1', 'Budget1'), 'NZ$' + money(budget)],
      ['B2', t('预算2', 'Budget2'), 'NZ$' + money(alt)],
      ['L_T', t('原布长度', 'Original cloth'), f(length) + 'm'],
      ['L_E', t('每条长度', 'Each strip'), f(piece) + 'm'],
      ['L_N', t('剪条数', 'Strip count'), String(cuts)],
      ['E_T', t('铅笔合价', 'Total pencil cost'), 'NZ$' + money(pencilTotal)],
      ['E_N', t('同价铅笔支数', 'Equal-price pencil count'), String(pencils)],
      ...prices.map((p, i) => [
        'F' + (i + 1),
        t('第' + (i + 1) + '种单价', 'Type' + (i + 1) + ' unit price'),
        'NZ$' + money(p),
      ]),
    ],
  );

  return {
    id: unit + '-MAINT-DECIMAL-STRUCTURE',
    unit,
    title: t(
      '同单位、原精度，再算一次',
      'Rebuild units, precision and decimal operations',
    ),
    bridge: 'P52-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), 'P52-L0' + n]),
    ),
    intro: t(
      '六张过程卡分多次，一次一个小问，不计时。先画位值/等组图、写单位和自己的过程，全部小问核齐才确认；读题帮助与数学提示分开，可用熟悉语言。原始记录均假想，不是家庭实测，不需调查、采购或付款。',
      'Split SIX process cards across sittings, ONE SUBPART at a time without a timer. Generate place/group diagrams, units and your own reasoning before review; confirm only after EVERY part is checked. Separate reading assistance from maths hints and use a familiar language. All records are fictional, not family observations; no survey, purchase or payment is required.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const decimalStructureRetrieval = {
  P61_DECIMAL_STRUCTURE: makeSet('P61'),
  P65_DECIMAL_STRUCTURE: makeSet('P65'),
};
