import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'P53' | 'P63') => {
  const first = unit === 'P53',
    id = (n: number) => unit + '-MAINT-FIRST-FRACTIONS-Q' + n;
  const make = (
    i: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '每次只做一个小问；先画或写自己的过程，再由家长逐项核验，不能只凭关键词确认。',
        'Do one subpart at a time. Draw or write your own process before a parent reviews every part; keywords alone are insufficient.',
      ),
    ]);
  const table = (
    q: Question,
    zh: string,
    en: string,
    headers: [string, string][],
    rows: string[][],
  ) => {
    q.contextTable = {
      caption: t(zh, en),
      columns: headers.map(([z, e]) => t(z, e)),
      rows: rows.map((r) => r.map((s) => t(s, s))),
    };
  };
  const n = first ? 6 : 8,
    selected = first ? 2 : 3,
    whole = first ? 12 : 20,
    pieces = first ? [1, 2, 3, 6] : [2, 3, 5, 10];
  const q1 = make(
    1,
    'fraction',
    'A、Z、W各从同样大小的完整巧克力开始，每块按表分成相同方格。逐行先圈出原整体，再写“取走”和“剩余”各占原整体的分数，分别指出分子/分母数什么，并核两部分合为1。取走之后能把分母改成剩余格数吗？另有一条长' +
      whole +
      'cm、宽处处相同的纸带，沿长度切成' +
      pieces.join('、') +
      'cm四段：各段能一律叫1/4吗？分别求四段占原带的准确分数，再亲画四个真正的四等份并给每份长度。只数四段为什么不够？',
    'A, Z and W each start with a COMPLETE bar of the SAME size, partitioned into equal squares as listed. For EVERY row identify the original whole, generate the fractions REMOVED and REMAINING, name what numerator/denominator count, and check that the parts combine to one. May removing squares change the denominator to the remaining-square count? Separately, a uniformly wide strip ' +
      whole +
      ' cm long is cut along its length into ' +
      pieces.join(', ') +
      ' cm sections. Are these all quarters? Give EACH section’s exact fraction of the original, then DRAW a genuine four-equal-part repair and find each length. Why does counting four sections not suffice?',
    first
      ? 'A取2/6=1/3、余4/6=2/3；Z取0/6=0、余6/6=1；W取6/6=1、余0/6=0。三行分母始终6，指原整体等份数；分子分别数取走/留下的等份。原整体没随剩余量重新定义，各行分子相加都为6。纸带各段1/12、2/12=1/6、3/12=1/4、6/12=1/2，不能都叫1/4；真四等份每份12÷4=3cm。'
      : 'A取3/8、余5/8；Z取0/8=0、余8/8=1；W取8/8=1、余0/8=0。分母始终8，数原整体等份数，分子数该种所取份。三行两分子各合为8。纸带各段2/20=1/10、3/20、5/20=1/4、10/20=1/2，不能都叫1/4；真四等份每份20÷4=5cm。',
    (first
      ? 'A: removed 2/6=1/3, remaining 4/6=2/3. Z: removed 0/6=0, remaining 6/6=1. W: removed 6/6=1, remaining 0/6=0. The original denominator stays six; removed plus remaining numerators give six. Strip fractions: 1/12, 2/12=1/6, 3/12=1/4, 6/12=1/2. Repair: 12÷4=3 cm per quarter.'
      : 'A: removed 3/8, remaining 5/8. Z: removed 0/8=0, remaining 8/8=1. W: removed 8/8=1, remaining 0/8=0. The original denominator stays eight; both numerators sum to eight. Strip fractions: 2/20=1/10, 3/20, 5/20=1/4, 10/20=1/2. Repair: 20÷4=5 cm per quarter.') +
      ' The denominator counts equal parts of the ORIGINAL whole, not merely remaining squares or visible pieces. Numerators count the selected kind of part. The strip has constant width, so equal lengths give equal areas; original unequal lengths cannot all carry the same quarter label. Draw four equal regions covering the repaired whole once. Zero and the whole are valid boundary amounts. Accept equivalent fractions, retaining the reference whole.',
    '在取走前给整块画边框；取走与留下用两种标记，仍使用同一个分母。',
    'Outline the complete bar BEFORE removing anything. Mark removed and remaining parts differently while retaining the same denominator.',
  );
  q1.answer = {
    kind: 'explain',
    rubric: t(
      q1.solution.zh +
        '分母数原整体的等份，不是可见块数或余量；等宽纸带同长度才同面积，修图须四块等大且完整覆盖。零与整体均是有效量，接纳保原整体的等值分数。',
      q1.solution.en,
    ),
  };
  q1.solution = q1.answer.rubric;
  table(
    q1,
    '三块独立原巧克力；均由相同大小方格组成。',
    'Three separate original bars, each made of equal-sized squares.',
    [
      ['记录', 'Record'],
      ['原整块等份数', 'Original equal parts'],
      ['取走份数', 'Removed parts'],
    ],
    [
      ['A', String(n), String(selected)],
      ['Z', String(n), '0'],
      ['W', String(n), String(n)],
    ],
  );

  const length = first ? 12 : 24,
    big = first ? 20 : 28,
    small = first ? 8 : 12;
  const q2 = make(
    2,
    'unit-fraction',
    '表中三行是同一条' +
      length +
      'cm纸带的不同等分法。用相同长度标尺画三条原带，求每一份的分数与实际厘米数，把1/2、1/3、1/4排序并解释分母较大为何一份较小。另在四等份图上拼2个四分之一、4个四分之一，分别写分数等式与厘米数，拼接是否换了整体？再独立比较' +
      big +
      'cm大带的1/4与' +
      small +
      'cm小带的1/2。分数数值的1/4<1/2还成立吗，两个实际长度却谁更大？区分数的大小与不同整体的实际份量。',
    'The three rows partition the SAME ' +
      length +
      ' cm strip in different ways. Draw equal-length wholes using one common length scale. Generate each unit fraction and actual centimetres, order 1/2, 1/3, 1/4, and explain why a larger denominator makes one share smaller. On the quarters drawing join TWO quarters, then FOUR quarters; give fraction equations and centimetres. Has joining changed the whole? Separately compare one quarter of a ' +
      big +
      ' cm large strip with one half of an ' +
      small +
      ' cm small strip. Is the NUMERICAL inequality 1/4<1/2 still true, and which ACTUAL length is larger? Distinguish numbers from amounts measured against different wholes.',
    first
      ? '同12cm整体：1/2为6cm、1/3为4cm、1/4为3cm，1/2>1/3>1/4。两份1/4+1/4=2/4=1/2，3+3=6cm；四份4/4=1，4×3=12cm，原整体仍12cm。另20×1/4=5cm，8×1/2=4cm，5>4；数值1/4<1/2始终成立，但这次大带四分之一的实际长度更大。'
      : '同24cm整体：1/2为12cm、1/3为8cm、1/4为6cm，1/2>1/3>1/4。1/4+1/4=2/4=1/2，6+6=12cm；4/4=1，4×6=24cm，原整体不变。另28×1/4=7cm，12×1/2=6cm，7>6；1/4<1/2的数值顺序没变，不同整体的实际量却四分之一那段更长。',
    (first
      ? 'Same whole twelve cm: 12÷2=6 cm, 12÷3=4 cm, 12÷4=3 cm. Two quarters: 1/4+1/4=2/4=1/2, 3+3=6 cm. Four quarters: 4/4=1, 4×3=12 cm. Different wholes: 20×1/4=5 cm, 8×1/2=4 cm, so 5>4.'
      : 'Same whole twenty-four cm: 24÷2=12 cm, 24÷3=8 cm, 24÷4=6 cm. Two quarters: 1/4+1/4=2/4=1/2, 6+6=12 cm. Four quarters: 4/4=1, 4×6=24 cm. Different wholes: 28×1/4=7 cm, 12×1/2=6 cm, so 7>6.') +
      ' Numerical order remains 1/2>1/3>1/4. More EQUAL parts of a fixed whole make each smaller. Joining quarters changes the selected count, not the reference whole or share size. The number inequality 1/4<1/2 remains true even when the differently referenced physical quarter is longer. Use a COMMON drawing scale; do not stretch both different-size wholes to appear equal.',
    '每种分法先算原长÷等份数；比较实际份量时，还要带上各自原长。',
    'For each partition calculate whole length divided by equal-part count. Comparing actual amounts also needs EACH whole length.',
  );
  q2.answer = {
    kind: 'explain',
    rubric: t(
      q2.solution.zh +
        '相同整体须等长、每种分法内部须等份；拼接只改取份数，不改整体或份大小。不同整体也用同一厘米比例画，不能为比较把大小两带拉成等长。',
      q2.solution.en,
    ),
  };
  q2.solution = q2.answer.rubric;
  table(
    q2,
    '同一原带的三种分法，长度单位cm。',
    'Three partitions of the SAME original strip, in cm.',
    [
      ['分法', 'Partition'],
      ['原长/cm', 'Whole/cm'],
      ['等份数', 'Equal parts'],
    ],
    [
      ['H', String(length), '2'],
      ['T', String(length), '3'],
      ['Q', String(length), '4'],
    ],
  );

  const d = first ? 4 : 3,
    move = first ? 3 : 2,
    paper = first ? 3 : 5,
    badMid = first ? 1 : 2;
  const q3 = make(
    3,
    'number-line',
    'A、B都是0到1这同一个数值整体，只改变等分数。亲画两根数轴，列全部刻度，生成每格值、刻度点总数、P的两种分数及最简值；两图的P应落在同一点吗？指出0、1和1/2，比较P与1/2，说明向右增大。若把A份数加倍却保持原“已走格数”，新终点在哪里，是仍在P吗？从原A重新出发，零格与走完全部格又到哪里？另有假纸尺把数值0、1/2、1依次放在0、' +
      badMid +
      '、' +
      paper +
      'cm处，为什么不能叫等距分数数轴？保留两端，修中点位置。最后比较1/3和显示到三位的0.333：分别取三次能精确到1吗？',
    'A and B use the SAME numerical whole from zero to one, with different equal partitions. DRAW both axes, list ALL ticks, and generate one-interval value, total tick count, P in both fractions and simplest form. Must both P marks coincide? Locate zero, one and one half; compare P with one half and explain increasing to the right. Double A’s interval count but KEEP its original travelled count: where is the new endpoint, and is it still P? Restart from A for zero travelled intervals and for all intervals. Separately, a faulty paper ruler places numerical 0, 1/2, 1 at paper positions 0, ' +
      badMid +
      ', ' +
      paper +
      ' cm. Why is this not an equally scaled fraction axis? Keep endpoints and repair the midpoint. Finally compare exact 1/3 with a three-place display 0.333: do THREE copies of each reach exactly one?',
    first
      ? 'A每格1/4，全部刻度0、1/4、2/4、3/4、1，共5点，P=3/4；B每格1/8，共9点，刻度0、1/8、2/8、3/8、4/8、5/8、6/8、7/8、1，P=6/8=3/4，同点。1/2=2/4=4/8，P在其右。A份数加倍却仍走3格到3/8，不是原P；保原P须走6格。原A走0格到0、4格到1。假尺两半数值差相同，纸距1cm与2cm却不同，中点应1.5cm。'
      : 'A每格1/3，刻度0、1/3、2/3、1，共4点，P=2/3；B每格1/6，刻度0、1/6、2/6、3/6、4/6、5/6、1，共7点，P=4/6=2/3，同点。1/2在A的一格与两格之间，在B的3/6处，P在右。A份数加倍仍走2格到2/6=1/3，不是P；保原P须走4格。原A走0格到0、3格到1。假尺两半纸距2cm、3cm不等，中点应2.5cm。',
    (first
      ? 'A: interval 1/4; ticks 0,1/4,2/4,3/4,1, FIVE marks; P=3/4. B: interval 1/8; ticks 0,1/8,2/8,3/8,4/8,5/8,6/8,7/8,1, NINE marks; P=6/8=3/4. Half is 2/4=4/8, left of P. Keeping three travelled intervals after doubling gives 3/8, not P; keeping P requires six. Zero intervals end at zero; four at one. Faulty half-gaps are 1 and 2 cm; repaired middle is 1.5 cm.'
      : 'A: interval 1/3; ticks 0,1/3,2/3,1, FOUR marks; P=2/3. B: interval 1/6; ticks 0,1/6,2/6,3/6,4/6,5/6,1, SEVEN marks; P=4/6=2/3. Half is between A’s first and second intervals, and at B’s 3/6, left of P. Keeping two travelled intervals after doubling gives 2/6=1/3, not P; keeping P requires four. Zero intervals end at zero; three at one. Faulty half-gaps are 2 and 3 cm; repaired middle is 2.5 cm.') +
      ' Count spaces: d intervals have d+1 marks INCLUDING endpoints. All interval lengths must match. The exact number 1/3 satisfies 3×1/3=1, while 3×0.333=0.999≠1. Thus 1/3≈0.333, not exact equality; the displayed decimal does not redefine the fraction or move its exact point. Accept equivalent fraction labels and a consistent drawing scale.',
    '从0数走过的空隙；分母变大时一格变小，要保原点就重新求格数。',
    'Count spaces travelled from zero. More intervals make each smaller; recompute the travelled count to preserve a point.',
  );
  q3.answer = {
    kind: 'explain',
    rubric: t(
      q3.solution.zh +
        '区间d个含端点刻度d+1个；每格须同长。3×1/3=1，而3×0.333=0.999≠1，因此1/3≈0.333不是精确相等，不改原分数及点。接纳同值标法与统一绘图比例。',
      q3.solution.en,
    ),
  };
  q3.solution = q3.answer.rubric;
  table(
    q3,
    '两图均从0到1；末列是已走区间数，不是刻度点数或坐标。',
    'Both axes run from zero to one; last column counts travelled intervals, not ticks or coordinates.',
    [
      ['图', 'Axis'],
      ['等区间总数', 'Equal intervals'],
      ['到P已走', 'Travelled to P'],
    ],
    [
      ['A', String(d), String(move)],
      ['B', String(d * 2), String(move * 2)],
    ],
  );

  const full = first ? 37 : 46,
    ones = first ? 7 : 6;
  const q4 = make(
    4,
    'decimal',
    '每行代表同样大小的完整百格板，每板100个等面积小格，表只给涂格数。亲画或涂百格图，逐行写“几个十分之一+几个百分之一”、以100为分母的分数及两位小数；100格时还要写几个完整整体。将A、B、C按大小排序，为什么不能看小数数字个数？C的小数去掉末尾0，B的小数去掉小数点后第一个0，分别还表示多少格，是同样的删零吗？说明0.00与1.00分别覆盖多少，十分之一为什么等于十个百分之一。',
    'Each row uses an equally sized COMPLETE hundred grid with one hundred equal-area cells. Only shaded counts are given. Draw/shade the grids and generate, for EVERY row, tenths plus hundredths, a fraction with denominator one hundred, and a TWO-place decimal; at one hundred cells also name the whole count. Order A, B, C. Why cannot decimal digit count decide? Remove C’s FINAL zero, then separately remove B’s FIRST zero after the decimal point: how many cells does each new numeral represent? Are these the same kind of zero deletion? Explain the coverage of 0.00 and 1.00 and why one tenth equals ten hundredths.',
    first
      ? 'A: 37格=3个十分之一+7个百分之一=37/100=0.37；B: 7格=0个十分之一+7个百分之一=7/100=0.07；C: 70格=7个十分之一+0个百分之一=70/100=0.70=0.7。Z: 0格=0/100=0.00=0；W: 100格=100/100=1.00=1个整体=10个十分之一。0.70>0.37>0.07，因为70>37>7；0.70删尾零为0.7仍70格，0.07删占位零为0.7却从7变70格，为原10倍。'
      : 'A: 46格=4个十分之一+6个百分之一=46/100=0.46；B: 6格=0个十分之一+6个百分之一=6/100=0.06；C: 60格=6个十分之一+0个百分之一=60/100=0.60=0.6。Z: 0格=0/100=0.00=0；W: 100格=100/100=1.00=1个整体=10个十分之一。0.60>0.46>0.06，因为60>46>6；0.60删尾零为0.6仍60格，0.06删占位零为0.6从6变60格，为原10倍。',
    (first
      ? 'A: 37 cells=3 tenths+7 hundredths=37/100=0.37. B: 7 cells=0 tenths+7 hundredths=7/100=0.07. C: 70 cells=7 tenths+0 hundredths=70/100=0.70=0.7. Order 0.70>0.37>0.07 follows 70>37>7. Final-zero deletion 0.70→0.7 still gives seventy cells. Placeholder deletion 0.07→0.7 changes seven to seventy cells, TENFOLD.'
      : 'A: 46 cells=4 tenths+6 hundredths=46/100=0.46. B: 6 cells=0 tenths+6 hundredths=6/100=0.06. C: 60 cells=6 tenths+0 hundredths=60/100=0.60=0.6. Order 0.60>0.46>0.06 follows 60>46>6. Final-zero deletion 0.60→0.6 still gives sixty cells. Placeholder deletion 0.06→0.6 changes six to sixty cells, TENFOLD.') +
      ' Z: 0 cells=0 tenths+0 hundredths=0/100=0.00=0. W: 100 cells=10 tenths+0 hundredths=100/100=1.00=1 whole, or 1 whole+0 tenths+0 hundredths. A row of ten cells is one tenth: 1/10=10/100=0.10. All grids keep the SAME whole and cell size. Use common hundredths, not digit count; a trailing decimal zero preserves value but a placeholder cannot be removed freely.',
    '把一整行10小格圈为一个十分之一，其余小格单列；0和100也使用原来的整板。',
    'Circle each full row of ten cells as one tenth, then count remaining cells; zero and one hundred still refer to the original whole grid.',
  );
  q4.answer = {
    kind: 'explain',
    rubric: t(
      q4.solution.zh +
        'Z为0个十分之一+0个百分之一；W也可写1整体+0十分之一+0百分之一。一行10格即1/10=10/100=0.10，整板与格大小始终相同。',
      q4.solution.en,
    ),
  };
  q4.solution = q4.answer.rubric;
  table(
    q4,
    '五个完整百格板的原始涂格数；每板原总数100。',
    'Original shaded counts for five complete grids; EACH original has one hundred cells.',
    [
      ['板', 'Grid'],
      ['原总格数', 'Original cells'],
      ['涂格数', 'Shaded cells'],
    ],
    [
      ['A', '100', String(full)],
      ['B', '100', String(ones)],
      ['C', '100', String(ones * 10)],
      ['Z', '100', '0'],
      ['W', '100', '100'],
    ],
  );

  const p = first ? '1.35' : '2.65',
    price2 = first ? '2.40' : '1.20',
    paid = first ? '5.00' : '10.00',
    dollars = first ? 3 : 4,
    cents = first ? 6 : 8;
  const q5 = make(
    5,
    'money',
    'M1–M3各是独立金额，逐行写完整的元数、小数部分有几分、总金额共几分，分别标单位，再按通常两位小数写回元。M2与M3相等吗，M1能删占位0变成M2吗？另有独立纸上交易T：两件物品的价与付款见表，无其他费用，按标价精确计算；不模拟现金舍入，也不用钱币面额证明数值不存在。先将两价各到最近整元（中点取较大整数）估合计，再用整数分精算合价、找零并加回核验；估计找零与精确找零要分开。若付款恰等于合价，找零怎样写？另次可自编两项正的整分价格与够付的整元付款，重复估算/精算/反查；有家中价签可抄真实两价另记来源，但本题不要求寻找或购买。',
    'M1–M3 are INDEPENDENT money amounts. For EACH, give whole dollars, cents in the decimal part and TOTAL cents, clearly naming units, then write dollars with the usual two decimal places. Are M2 and M3 equal? May M1 lose its placeholder zero to become M2? A SEPARATE paper transaction T has two prices and a payment in the table, no extra charges, and exact arithmetic at the stated prices. Do not model cash rounding or treat coin denominations as proof that a numerical amount cannot exist. First round EACH price to nearest whole dollar (ties to the larger integer) and estimate total; then use INTEGER CENTS for exact total/change and add back to check. Keep estimated and exact change separate. If payment equals total exactly, how is change written? In another sitting, invent two positive whole-cent prices and a whole-dollar payment sufficient to cover them, then repeat estimation, exact calculation and inverse checking. Existing household price labels may supply real prices with their source recorded separately; searching or buying is not required.',
    first
      ? 'M1: NZ$3.06=3元6分=306分；M2: NZ$3.60=3元60分=360分；M3: NZ$3.6=NZ$3.60=3元60分=360分。6分是6/100元，60分是60/100元；M1与M2差54分，不能删占位0。T估1+2≈3元，估找零5−3=2元；精确135+240=375分=NZ$3.75，500−375=125分=NZ$1.25，375+125=500分。付款若375分则找0分=NZ$0.00。自编例：两价NZ$1.10/NZ$2.20、付NZ$5；估1+2=3、估找2，精确110+220=330分、找170分=NZ$1.70，330+170=500。'
      : 'M1: NZ$4.08=4元8分=408分；M2: NZ$4.80=4元80分=480分；M3: NZ$4.8=NZ$4.80=4元80分=480分。8分是8/100元，80分是80/100元；两者差72分，不能删M1的占位0。T估3+1≈4元，估找10−4=6元；精确265+120=385分=NZ$3.85，1000−385=615分=NZ$6.15，385+615=1000分。若付385分找0分=NZ$0.00。自编例：两价NZ$2.10/NZ$1.30、付NZ$5；估2+1=3、估找2，精确210+130=340分、找160分=NZ$1.60，340+160=500。',
    (first
      ? 'M1: NZ$3.06=3 dollars+6 cents=306 cents. M2: NZ$3.60=3 dollars+60 cents=360 cents. M3: NZ$3.6=NZ$3.60=3 dollars+60 cents=360 cents. Six cents is 6/100 dollar; sixty cents is 60/100 dollar. M1 differs from M2 by 54 cents. T: rounded prices 1 and 2, estimated total 3 dollars, estimated change 2. Exactly 135+240=375 cents=NZ$3.75; 500−375=125 cents=NZ$1.25; 375+125=500 cents. Paying exactly 375 cents gives zero cents=NZ$0.00. ONE invented example: prices 110/220 cents, payment 500 cents; estimate 1+2=3 dollars, estimated change two; 110+220=330 cents, change 500−330=170 cents=NZ$1.70, check 330+170=500.'
      : 'M1: NZ$4.08=4 dollars+8 cents=408 cents. M2: NZ$4.80=4 dollars+80 cents=480 cents. M3: NZ$4.8=NZ$4.80=4 dollars+80 cents=480 cents. Eight cents is 8/100 dollar; eighty cents is 80/100 dollar. M1 differs from M2 by 72 cents. T: rounded prices 3 and 1, estimated total 4 dollars, estimated change 6. Exactly 265+120=385 cents=NZ$3.85; 1000−385=615 cents=NZ$6.15; 385+615=1000 cents. Paying exactly 385 cents gives zero cents=NZ$0.00. ONE invented example: prices 210/130 cents, payment 500 cents; estimate 2+1=3 dollars, estimated change two; 210+130=340 cents, change 500−340=160 cents=NZ$1.60, check 340+160=500.') +
      ' One cent is 1/100 dollar; keep WHOLE dollars, decimal-part cents and TOTAL cents distinct. Final zero removal preserves M2/M3; placeholder removal changes value. Estimated change is approximate; exact total plus exact change must equal payment. The reference prices are fictional, not a claim about a shop or real family activity. For a self-chosen plan accept ANY two positive whole-cent prices and sufficient whole-dollar payment, with the stated rounding and exact cent ledger; the example is not the only answer. Two real labels and their source can be recorded later, without treating a paper example as real observation.',
    '先把每个金额统一换成整数分；总分与小数部分有几分不是一回事。',
    'Convert every amount to INTEGER cents first. Total cents are not the same as cents in the decimal part.',
  );
  q5.answer = {
    kind: 'explain',
    rubric: t(
      q5.solution.zh +
        '一分=1/100元；整体元、小数部分的分币数量和总分须区分。估计只用约等号；精确合价+找零=付款。自编只要两正整分价格、够付整元付款及指定舍入/精算/反查都满足，均接受，不只收范例；真实价签与来源以后另记，不把虚构题当家庭实测。',
      q5.solution.en,
    ),
  };
  q5.solution = q5.answer.rubric;
  table(
    q5,
    'M行只给原金额；T行给两个精确价与付款，均NZD。M各行与T相互独立。',
    'M rows give original amounts only; T gives TWO exact prices and payment, all in NZD. M rows and T are independent.',
    [
      ['记录', 'Record'],
      ['金额/元', 'Amount/dollars'],
      ['第二价/元', 'Second price/dollars'],
      ['付款/元', 'Payment/dollars'],
    ],
    [
      ['M1', dollars + '.0' + cents, '—', '—'],
      ['M2', dollars + '.' + cents + '0', '—', '—'],
      ['M3', dollars + '.' + cents, '—', '—'],
      ['T', p, price2, paid],
    ],
  );
  return {
    id: unit + '-MAINT-FIRST-FRACTIONS',
    unit,
    title: t(
      '从整体到小数，再解释一次',
      'Explain wholes, fractions and decimals again',
    ),
    bridge: 'B04-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), 'B04-L0' + i]),
    ),
    intro: t(
      '五题分多次，每次只做一个小问，不计时。先用纸笔画图、写原整体和单位，再展开核对；全部小问经家长核齐才确认。可用熟悉语言，读题协助与数学提示分开。记录和价格均虚构；真实家庭观察另记，不需要购买。',
      'Split five tasks across sittings, ONE SUBPART at a time, without a timer. Draw and identify the original whole and units before checking; confirm only after EVERY subpart is reviewed. Use a familiar language and distinguish reading help from maths hints. Records/prices are fictional; real family observations are separate and no purchase is needed.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const fractionDecimalMeaningRetrieval = {
  P53_FIRST_FRACTIONS: makeSet('P53'),
  P63_FIRST_FRACTIONS: makeSet('P63'),
};
