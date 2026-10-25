import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'P51' | 'P52') => {
  const first = unit === 'P51',
    id = (n: number) => unit + '-MAINT-CALCULATION-Q' + n;
  const make = (
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
        '一次只做一个小问，先在纸上生成过程，再逐项核；得数、关键词或抄参考答案都不能代替理由。',
        'Work on one subpart at a time. Generate the process on paper before checking each part; a result, keyword or copied reference answer cannot replace reasoning.',
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
  const q1 = make(
    1,
    'whole-regroup',
    '表中A–E是五个独立整数记录。先把同单位对齐，逐列写进/退位，标出每个“1”计一、十、百还是千，并各做一次逆运算。B须写跨零后、尚未相减的完整顶行及其加权总量；经过的零位为什么留下9，临时的12/13为什么不是答案的一位数字？另算出B若逐列“大数字减小数字”会得到什么，加回能恢复原数吗？C须保留最左进位，D说明经过零的交换链，E的零结果能留空吗？',
    'A–E are FIVE independent whole-number records. Align matching units, generate column exchanges, label whether each carried 1 counts ones, tens, hundreds or thousands, and give an inverse check for EVERY row. For B, write the complete exchanged top row BEFORE subtracting and its weighted total. Why do intermediate zero places retain nine, and why is a temporary 12/13 not one digit of the answer? Also calculate B by the faulty rule “larger digit minus smaller in each column” and test whether adding back recovers the original. Keep C’s final left carry; explain D’s exchange chain. May E’s zero answer be left blank?',
    first
      ? 'A: 798+207=1005；个位8+7=15，进1十；十位9+0+1=10，进1百；百位7+2+1=10，进1千；1005−207=798。B: 3002=2000+900+90+12，顶行为2千9百9十12一，总量仍3002；经过百、十各把一个单位继续换给右边，故留9而非10。12一减6一得6一，9十减8十得1十，9百减7百得2百，2千减1千得1千；3002−1786=1216，1216+1786=3002。逐列倒减误得2784，2784+1786=4570≠3002。C: 999+1=1000；1000−1=999。D: 1000=0千+9百+9十+10一=900+90+10，1000−1=999；999+1=1000。E: 407−407=0；0+407=407。'
      : 'A: 687+318=1005；个位7+8=15进1十；十位8+1+1=10进1百；百位6+3+1=10进1千；1005−318=687。B: 4003=3000+900+90+13，顶行为3千9百9十13一，仍4003；百、十各传出一个较大单位，留下9。13−6=7，9−7=2，9−8=1，3−2=1；4003−2876=1127，1127+2876=4003。逐列倒减误得2873，2873+2876=5749≠4003。C: 1999+1=2000；2000−1=1999。D: 2000=1千+9百+9十+10一=1000+900+90+10，2000−1=1999；1999+1=2000。E: 506−506=0；0+506=506。',
    (first
      ? 'A: 798+207=1005; ones 8+7=15 carry one TEN, tens 9+0+1=10 carry one HUNDRED, hundreds 7+2+1=10 carry one THOUSAND. Check 1005−207=798. B: 3002=2000+900+90+12: 2 thousands, 9 hundreds, 9 tens, 12 ones. Intermediate places pass a unit onward and retain nine. Subtract matching units: 12−6=6, 9−8=1, 9−7=2, 2−1=1. Thus 3002−1786=1216; 1216+1786=3002. Reversing individual columns gives 2784; 2784+1786=4570≠3002. C: 999+1=1000; 1000−1=999. D: 1000=0 thousands+9 hundreds+9 tens+10 ones=900+90+10; 1000−1=999; 999+1=1000. E: 407−407=0; 0+407=407.'
      : 'A: 687+318=1005; ones 7+8=15 carry one TEN, tens 8+1+1=10 carry one HUNDRED, hundreds 6+3+1=10 carry one THOUSAND. Check 1005−318=687. B: 4003=3000+900+90+13: 3 thousands, 9 hundreds, 9 tens, 13 ones. Each intermediate place passes one unit onward and retains nine. Subtract 13−6=7, 9−7=2, 9−8=1, 3−2=1: 4003−2876=1127; 1127+2876=4003. Column reversal gives 2873; 2873+2876=5749≠4003. C: 1999+1=2000; 2000−1=1999. D: 2000=1 thousand+9 hundreds+9 tens+10 ones=1000+900+90+10; 2000−1=1999; 1999+1=2000. E: 506−506=0; 0+506=506.') +
      ' Exchanges change representation, never the starting quantity. Temporary multi-digit unit counts must become ordinary digits in the final answer. Align units rather than left edges; zero is a value and must be written.',
    '从个位开始；跨零先向左找仍有的单位，再一路换回来。',
    'Start with ones. Across zero, find an available larger unit and exchange back through every place.',
  );
  table(
    q1,
    '五个独立原式；只给原数，不给换组顶行或结果。',
    'Five independent original expressions; exchanged rows and results are not supplied.',
    [
      ['记录', 'Record'],
      ['第一数', 'First'],
      ['运算', 'Operation'],
      ['第二数', 'Second'],
    ],
    first
      ? [
          ['A', '798', '+', '207'],
          ['B', '3002', '−', '1786'],
          ['C', '999', '+', '1'],
          ['D', '1000', '−', '1'],
          ['E', '407', '−', '407'],
        ]
      : [
          ['A', '687', '+', '318'],
          ['B', '4003', '−', '2876'],
          ['C', '1999', '+', '1'],
          ['D', '2000', '−', '1'],
          ['E', '506', '−', '506'],
        ],
  );
  q1.answer = {
    kind: 'explain',
    rubric: t(
      q1.solution.zh +
        '换组不改原量；多位临时单位数不能当答案的一位。按个位对齐而非左边缘，零必须写出。',
      q1.solution.en,
    ),
  };
  q1.solution = q1.answer.rubric;

  const g = first ? 4 : 6,
    size = first ? 9 : 8,
    cut = first ? 5 : 3,
    other = 4;
  const q2 = make(
    2,
    'multiplication-decompose',
    'A1–A4是同一个阵列的四个切法，行数与每行量不变；Z1、Z2是另两种阵列。逐行生成左右块及总量，先画原阵列再移动切线，解释为什么两块都须重复全部行数、边缘空块不是丢掉物体。A1另用每行10个再补偿到原每行量的方法计算，生成被减去的整块而非只减一次每行差。问“右块”时应交右块还是总量？另给已知事实' +
      (first
        ? '4×3=12，只把每行3个加倍为6个，行数仍4'
        : '6×2=12，只把每行2个加倍为4个，行数仍6') +
      '，画两份并给新总量；若行数也加倍，为什么成了原总量四倍？Z1无行与Z2有行但每行0的图有何不同？',
    'A1–A4 are FOUR cuts of the SAME array: row count and objects per row stay fixed. Z1 and Z2 are separate arrays. Generate left, right and total for EVERY row. Draw the original array and move the cut: explain why BOTH regions repeat in all rows and why an empty edge region loses no objects. For A1 also start with ten per row and compensate to the given size; generate the WHOLE removed block rather than subtracting the per-row difference only once. If asked for the RIGHT region, should you give that region or the total? Separately, given ' +
      (first
        ? '4×3=12, double ONLY three per row to six while keeping four rows'
        : '6×2=12, double ONLY two per row to four while keeping six rows') +
      ', draw two copies and find the new total. Why would doubling the row count TOO make the original total fourfold? How do no rows in Z1 and existing empty rows in Z2 differ?',
    first
      ? 'A1: 4×5+4×4=20+16=36；A2: 4×0+4×9=0+36=36；A3: 4×9+4×0=36+0=36；A4: 4×4+4×5=16+20=36。A1右块16，不是总量36；4×5+4=24只计右部一行。补偿4×9=4×10−4×1=40−4=36，40−1=39只拿走一枚。加倍4×6=4×3+4×3=12+12=24，行数不变；8×6=48是原12的四倍。Z1: 0×5+0×4=0；Z2: 4×0+4×0=0。'
      : 'A1: 6×3+6×5=18+30=48；A2: 6×0+6×8=0+48=48；A3: 6×8+6×0=48+0=48；A4: 6×4+6×4=24+24=48。A1右块30，不是总量48；6×3+5=23漏掉其他行右部。补偿6×8=6×10−6×2=60−12=48，60−2=58只少两枚。加倍6×4=6×2+6×2=12+12=24，行数不变；12×4=48为原12四倍。Z1: 0×3+0×5=0；Z2: 6×0+6×0=0。',
    (first
      ? 'A1: 4×5+4×4=20+16=36. A2: 4×0+4×9=0+36=36. A3: 4×9+4×0=36+0=36. A4: 4×4+4×5=16+20=36. RIGHT region A1 is sixteen, not total thirty-six. The faulty 4×5+4=24 omits the other right-hand rows. Compensate: 4×9=4×10−4×1=40−4=36; 40−1=39 removes only one object. Doubling: 4×6=4×3+4×3=12+12=24; 8×6=48 doubles BOTH factors and quadruples original twelve. Z1: 0×5+0×4=0. Z2: 4×0+4×0=0.'
      : 'A1: 6×3+6×5=18+30=48. A2: 6×0+6×8=0+48=48. A3: 6×8+6×0=48+0=48. A4: 6×4+6×4=24+24=48. RIGHT region A1 is thirty, not total forty-eight. The faulty 6×3+5=23 omits other right-hand rows. Compensate: 6×8=6×10−6×2=60−12=48; 60−2=58 removes only two objects. Doubling: 6×4=6×2+6×2=12+12=24; 12×4=48 doubles BOTH factors and quadruples original twelve. Z1: 0×3+0×5=0. Z2: 6×0+6×0=0.') +
      ' A cut changes grouping, never the objects or row count. Z1 has no rows; draw no objects. Z2 retains the stated row outlines, all empty. Edge cuts and zero dimensions give zero regions, not invented objects.',
    '先写右块每行量=原每行量−切线位置，再分别乘同一个行数。',
    'First find right-hand objects per row as size minus cut; multiply BOTH parts by the same row count.',
  );
  table(
    q2,
    '切线位置是左块每行量；A1–A4不增加物体。',
    'Cut is the LEFT count per row; A1–A4 add no objects.',
    [
      ['切法', 'Cut ID'],
      ['行数', 'Rows'],
      ['每行量', 'Per row'],
      ['左块每行量', 'Left per row'],
    ],
    [
      ['A1', String(g), String(size), String(cut)],
      ['A2', String(g), String(size), '0'],
      ['A3', String(g), String(size), String(size)],
      ['A4', String(g), String(size), String(other)],
      ['Z1', '0', String(size), String(cut)],
      ['Z2', String(g), '0', '0'],
    ],
  );

  q2.answer = {
    kind: 'explain',
    rubric: t(
      q2.solution.zh +
        '切线只改分组，不改行数与物体；Z1无行，Z2保留所给行数的空行框。边缘空块和零维均计零，不增加物体。',
      q2.solution.en,
    ),
  };
  q2.solution = q2.answer.rubric;

  const q3 = make(
    3,
    'two-digit-area',
    'N、Z是两张独立纸板。每张都在两轴用同一长度比例画长方形，将两边各拆成整十和个位；标四种宽×高与面积，说明无重叠无空缺，再把四块合成按高度的两条部分积。纠正N中“用高度十位数字直接乘宽，再加个位部分积”的算法，写它实际代表的错误高度。另求两边长相加与完整周长，分别标单位，为什么都不是面积？Z中哪两块宽为零，能画成有正面积的色块吗？指出两个零项与漏算正面积的区别。',
    'N and Z are TWO independent boards. Draw each rectangle using the SAME length scale on both axes. Split BOTH sides into tens and ones, label all four width×height regions and areas, explain no overlap or gaps, then combine into TWO horizontal partial-product bands. Repair N’s method of multiplying width by the HEIGHT’S TENS DIGIT rather than its value, then adding the ones product: what wrong height does it represent? Also calculate the side-length sum and full perimeter with units; why is neither the area? Which TWO regions of Z have zero width, and may they be drawn with positive area? Distinguish including zero terms from omitting positive regions.',
    first
      ? 'N: 27=20+7，16=10+6；200+70+120+42=432 cm²。两条为270+162=432 cm²；十位1代表10 cm，错误27×1+27×6=189只对应高7 cm。边长和27+16=43 cm，周长2×43=86 cm，均非432 cm²。Z: 30=30+0，14=10+4；300+0+120+0=420 cm²，两条300+120=420。'
      : 'N: 26=20+6，23=20+3；400+120+60+18=598 cm²。两条520+78=598 cm²；十位2代表20 cm，错误26×2+26×3=130只对应高5 cm。边长和26+23=49 cm，周长2×49=98 cm，均非598 cm²。Z: 40=40+0，12=10+2；400+0+80+0=480 cm²，两条400+80=480。',
    (first
      ? 'N: 27=20+7 and 16=10+6. Four areas: 200+70+120+42=432 cm². Horizontal bands: 270+162=432 cm². Tens digit one means TEN centimetres. Wrong 27×1+27×6=189 represents height seven. Side sum 27+16=43 cm, perimeter 2×43=86 cm, neither area 432 cm². Z: 30=30+0, 14=10+4; 300+0+120+0=420 cm²; bands 300+120=420.'
      : 'N: 26=20+6 and 23=20+3. Four areas: 400+120+60+18=598 cm². Horizontal bands: 520+78=598 cm². Tens digit two means TWENTY centimetres. Wrong 26×2+26×3=130 represents height five. Side sum 26+23=49 cm, perimeter 2×49=98 cm, neither area 598 cm². Z: 40=40+0, 12=10+2; 400+0+80+0=480 cm²; bands 400+80=480.') +
      ' Label each product with its two ACTUAL side lengths, using cm×cm=cm². Regions partition the original once. The ones-width regions of Z both have zero width and zero area, so draw no positive-width patches for them. A zero term is valid; omitting a nonzero region loses area. Accept any common drawing scale, with true lengths labelled; screen appearance alone is not a proof.',
    '先写四对实际边长，再合并同高度的两块；不要只看十位数字。',
    'Write all four pairs of actual side lengths, then combine regions of equal height; a tens digit is not its full length.',
  );
  table(
    q3,
    '两张独立纸板，所有原始长度单位均为cm；图与面积待求。',
    'Two separate boards; ALL original lengths are in cm. Diagrams and areas are to be generated.',
    [
      ['纸板', 'Board'],
      ['宽/cm', 'Width/cm'],
      ['高/cm', 'Height/cm'],
    ],
    first
      ? [
          ['N', '27', '16'],
          ['Z', '30', '14'],
        ]
      : [
          ['N', '26', '23'],
          ['Z', '40', '12'],
        ],
  );
  q3.answer = {
    kind: 'explain',
    rubric: t(
      q3.solution.zh +
        '四块须写实际宽×高，cm×cm=cm²；统一长度比例，完整无重叠地覆盖原板。Z的两个零宽区域不画正面积；接纳任意统一比例且标真实边长的图，不能凭视觉相近证明。',
      q3.solution.en,
    ),
  };
  q3.solution = q3.answer.rubric;

  const q4 = make(
    4,
    'long-division-place',
    '表中每行各有一批不可拆卡片，d是每个满盒的张数；剩卡另放。每行求整数商q、余数r，写N=d×q+r并核0≤r<d，再分别说满盒数、装全部的最少盒数及普通数值除法的精确值q+r/d。无需空盒，零张可用0盒。L与I另逐位写“当前量=除数×商位+余量”，给当前单位及余量×10+下一位；不要只拼数字。比较L可省的开头0与I必须留的中间0，删掉I中间0再乘加会恢复多少？另把R的q故意减少1并调整r，等式仍成立时为什么还不是合法整数商/余数？解释零总量可除以正d却不能除以0。',
    'Each row is a SEPARATE batch of indivisible cards, with d cards per full box and leftovers set aside. Generate whole quotient q, remainder r, N=d×q+r and 0≤r<d for EVERY row. Separately give full boxes, MINIMUM boxes holding ALL cards, and exact numerical division q+r/d. Empty boxes are not required; zero cards may use zero boxes. For L and I ALSO write every place as “available=divisor×quotient digit+remainder”, name its unit, and show previous remainder×10+next digit. Compare L’s omissible LEADING zero with I’s essential INTERNAL zero. Delete I’s internal zero and calculate what multiplying back plus remainder reconstructs. Then deliberately decrease R’s q by one and adjust r: why is an identity alone insufficient for a valid quotient/remainder? Explain why zero total with positive d is valid but dividing by zero is not.',
    first
      ? 'L: 864=12×72+0，满72/全部72盒，精确864÷12=72。逐位百8=12×0+8；十86=8×10+6=12×7+2；一24=2×10+4=12×2+0，商072可省开头0为72。I: 1208=4×302+0，满302/全部302盒，精确302；逐位千1=4×0+1，百12=1×10+2=4×3+0，十0=0×10+0=4×0+0，一8=0×10+8=4×2+0；0302可省首0，不能删中间0，4×32+0=128≠1208。R: 437=6×72+5，满72/全部73盒，精确437÷6=72+5/6；437=6×71+11虽成立，11≥6还可满一盒，须改72余5。T: 3=6×0+3，满0/全部1盒，精确3÷6=0+3/6=1/2。Z: 0=6×0+0，满0/全部0盒，精确0÷6=0。'
      : 'L: 756=12×63+0，满63/全部63盒，精确756÷12=63；逐位百7=12×0+7，十75=7×10+5=12×6+3，一36=3×10+6=12×3+0，商063可省首0。I: 1506=5×301+1，满301/全部302盒，精确1506÷5=301+1/5；逐位千1=5×0+1，百15=1×10+5=5×3+0，十0=0×10+0=5×0+0，一6=0×10+6=5×1+1；0301可省首0，中间0不能删，5×31+1=156≠1506。R: 578=7×82+4，满82/全部83盒，精确578÷7=82+4/7；578=7×81+11虽成立，11≥7还能满一盒，改82余4。T: 4=7×0+4，满0/全部1盒，精确4÷7=0+4/7。Z: 0=7×0+0，满0/全部0盒，精确0÷7=0。',
    (first
      ? 'L: 864=12×72+0; full 72, minimum all 72, exact 864÷12=72. HUNDREDS 8=12×0+8; TENS 86=8×10+6=12×7+2; ONES 24=2×10+4=12×2+0. Omit the leading zero in 072. I: 1208=4×302+0; full 302, minimum all 302, exact 302. THOUSANDS 1=4×0+1; HUNDREDS 12=1×10+2=4×3+0; TENS 0=0×10+0=4×0+0; ONES 8=0×10+8=4×2+0. 0302 may lose its LEADING zero only; deleting the internal zero gives 4×32+0=128≠1208. R: 437=6×72+5; full 72, minimum all 73, exact 437÷6=72+5/6. Wrong 437=6×71+11 is an identity but 11≥6 fills another box, so correct to 72 remainder five. T: 3=6×0+3; full 0, minimum all 1, exact 3÷6=0+3/6=1/2. Z: 0=6×0+0; full 0, minimum all 0, exact 0÷6=0.'
      : 'L: 756=12×63+0; full 63, minimum all 63, exact 756÷12=63. HUNDREDS 7=12×0+7; TENS 75=7×10+5=12×6+3; ONES 36=3×10+6=12×3+0. Omit the leading zero in 063. I: 1506=5×301+1; full 301, minimum all 302, exact 1506÷5=301+1/5. THOUSANDS 1=5×0+1; HUNDREDS 15=1×10+5=5×3+0; TENS 0=0×10+0=5×0+0; ONES 6=0×10+6=5×1+1. Omit only the leading zero in 0301; deleting the internal zero gives 5×31+1=156≠1506. R: 578=7×82+4; full 82, minimum all 83, exact 578÷7=82+4/7. Wrong 578=7×81+11 is an identity but 11≥7 fills another box; correct to 82 remainder four. T: 4=7×0+4; full 0, minimum all 1, exact 4÷7=0+4/7. Z: 0=7×0+0; full 0, minimum all 0, exact 0÷7=0.') +
      ' Every remainder is nonnegative and below its positive divisor; every available amount is in the CURRENT unit. For all boxes add ONE only when r>0: r<d makes one extra sufficient, and q boxes cannot hold N when r>0. With r=0, q boxes suffice, including zero boxes. Nonzero remainder belongs in exact numerical division; never write N÷d=q alone. Dividing by zero is undefined, including 0÷0; a zero dividend does not make the divisor zero.',
    '每一行先定单位，再把上行余量换成十倍小单位；整数商与精确商分开写。',
    'Name each row’s unit before exchanging the previous remainder into ten times as many smaller units; distinguish whole quotient from exact division.',
  );
  table(
    q4,
    '五批独立原卡；d是正容量，图、商与余数都待求。',
    'Five separate original batches; d is positive capacity. Diagrams, quotients and remainders are to be generated.',
    [
      ['批次', 'Batch'],
      ['N/张', 'N/cards'],
      ['d/张每盒', 'd/cards per box'],
    ],
    first
      ? [
          ['L', '864', '12'],
          ['I', '1208', '4'],
          ['R', '437', '6'],
          ['T', '3', '6'],
          ['Z', '0', '6'],
        ]
      : [
          ['L', '756', '12'],
          ['I', '1506', '5'],
          ['R', '578', '7'],
          ['T', '4', '7'],
          ['Z', '0', '7'],
        ],
  );
  q4.answer = {
    kind: 'explain',
    rubric: t(
      q4.solution.zh +
        '每行余数须非负小于正除数，当前量计当前单位。r>0才加一箱，因r<d一箱够、q箱不够；r=0不加。余数进入普通除法精确值，不能删成N÷d=q；除零包括0÷0均无定义。',
      q4.solution.en,
    ),
  };
  q4.solution = q4.answer.rubric;

  const q5 = make(
    5,
    'estimate-check',
    'A为两段步道合长（m），M为纸板面积（两边cm），S为两段长度的差（m）。按表中指定精度将两个原数各自四舍五入再运算，写≈；另从原数找相邻该精度倍数，生成可靠上下界及理由。S下界为什么要“小被减数−大减数”，上界反过来？不能把两个下界相减就叫差的下界。先只用范围筛各候选，再精算/反查区分范围内相差1的候选，说明≈与=、数值接近与单位正确分别需要什么证据。最后另做可分次的纸上挑战：自己选两种物品1–10元的整数单价、各至少1件的整数数量，设计先超过NZ$50的原方案，再固定价格、调整数量（仍各至少1件）至不超过50。每个方案先将两类精确小计各舍入到十估合计，再列精确拆分成本、近似余额和精确余额。为什么估计余额非负还不能决定够用？自选的有效方案均可，不要求购买。',
    'A combines two track lengths in m; M finds a board area from cm side lengths; S finds a length difference in m. Round EACH ORIGINAL operand to the table’s nearest-unit precision before applying its operation, using ≈. Separately find bounding multiples at that precision and generate reliable lower/upper result bounds with reasons. Why does S use SMALLER minuend minus LARGER subtrahend for its lower bound, and the reverse for its upper? Subtracting both lower endpoints does not establish the lower difference. Screen EVERY candidate using bounds alone, then use exact/inverse work to distinguish the two inside candidates one apart. Explain ≈ versus = and why a nearby number with the wrong unit still fails. Separately, over further sittings if needed, invent TWO item prices of whole NZ dollars from 1–10 and positive whole counts of EACH. Design an original plan exceeding NZ$50, then KEEP prices and change counts (still at least one of each) to fit fifty. For EACH plan, round the two exact category subtotals separately to tens to estimate cost, then give decomposed exact cost, estimated balance and exact balance. Why is a nonnegative estimated balance insufficient to decide affordability? Accept any valid self-chosen plan; no purchase is needed.',
    first
      ? 'A: 298+407≈300+410=710 m；界690≤298+407≤710，精确705，705−407=298；7050在外，704/705在内，704仍错。M: 27×19≈30×20=600 cm²；界200≤27×19≤600，精确513，27×20−27=540−27=513；51在外，512/513在内，512仍错。S: 913−486≈900−500=400 m；下界900−500=400，上界1000−400=600，精确427，427+486=913；42在外，426/427在内，426仍错；900−400=500不是下界，因为真实427更小。自创示例：单价7/9元，数量4/3，成本7×4+9×3=28+27=55；估30+30=60，近似余额−10，精确−5，超5。改3/3件，成本21+27=48，估20+30=50，近似余额0，精确2。'
      : 'A: 397+506≈400+510=910 m；界890≤397+506≤910，精确903，903−506=397；9030在外，902/903在内，902仍错。M: 34×29≈30×30=900 cm²；界600≤34×29≤1200，精确986，34×30−34=1020−34=986；98在外，985/986在内，985仍错。S: 724−283≈700−300=400 m；下界700−300=400，上界800−200=600，精确441，441+283=724；44在外，440/441在内，440仍错；700−200=500不是下界，因为441更小。自创示例：单价8/6元，数量5/2，成本8×5+6×2=40+12=52；估40+10=50，近似余额0但精确−2，实际超2。改4/2件，成本32+12=44，估30+10=40，近似余额10，精确6。',
    (first
      ? 'A: 298+407≈300+410=710 m. Bounds 690≤298+407≤710; exact 705, check 705−407=298. Outside 7050; inside 704/705, but 704 is wrong. M: 27×19≈30×20=600 cm². Bounds 200≤27×19≤600; exact 513 by 27×20−27=540−27=513. Outside 51; inside 512/513, but 512 is wrong. S: 913−486≈900−500=400 m. Lower 900−500=400, upper 1000−400=600; exact 427, check 427+486=913. Outside 42; inside 426/427, but 426 is wrong. Subtracting lower endpoints gives 900−400=500, NOT a lower bound because actual 427 is smaller. ONE invented plan: prices 7/9 NZD, counts 4/3, 7×4+9×3=28+27=55; estimate 30+30=60, estimated balance −10, exact −5, overspend five. Repair counts 3/3: cost 21+27=48, estimate 20+30=50, estimated balance zero, exact two.'
      : 'A: 397+506≈400+510=910 m. Bounds 890≤397+506≤910; exact 903, check 903−506=397. Outside 9030; inside 902/903, but 902 is wrong. M: 34×29≈30×30=900 cm². Bounds 600≤34×29≤1200; exact 986 by 34×30−34=1020−34=986. Outside 98; inside 985/986, but 985 is wrong. S: 724−283≈700−300=400 m. Lower 700−300=400, upper 800−200=600; exact 441, check 441+283=724. Outside 44; inside 440/441, but 440 is wrong. Subtracting lower endpoints gives 700−200=500, NOT a lower bound because actual 441 is smaller. ONE invented plan: prices 8/6 NZD, counts 5/2, 8×5+6×2=40+12=52; estimate 40+10=50, estimated balance zero but exact −2, overspend two. Repair counts 4/2: cost 32+12=44, estimate 30+10=40, estimated balance ten, exact six.') +
      ' For EACH original operand give its bounding multiples: A uses tens, M tens, S hundreds. Addition/product bounds use corresponding endpoints because operands are nonnegative; subtraction crosses endpoints. A and S retain m, M uses cm², not cm or km. Inside only means not excluded, never proven correct. Approximation does not change originals; equality belongs to exact relationships. For ANY challenge plan review positive integer counts, integer prices 1–10, unchanged prices, original >50, repaired ≤50, the stated rounding method, decomposed cost and cost+exact balance=50. A coarse estimate can miss overspending; for example exact category costs 40 and 12 estimate 40+10=50 but total 52 exceeds fifty. Accept other valid prices/counts; the reference is one example, not a required answer.',
    '舍入、界限、精确值分三栏；减数越大，差反而越小。',
    'Keep separate columns for rounding, bounds and exact values. Increasing a subtrahend decreases the difference.',
  );
  table(
    q5,
    '三个独立问题；精度10/100指每个原数到最近的十/百。候选单位沿用本行目标单位。',
    'Three independent problems; precision 10/100 means round EACH original to nearest ten/hundred. Candidates use the row’s target unit.',
    [
      ['问题', 'Task'],
      ['原数a', 'Operand a'],
      ['运算', 'Operation'],
      ['原数b', 'Operand b'],
      ['精度', 'Precision'],
      ['候选', 'Candidates'],
    ],
    first
      ? [
          ['A', '298', '+', '407', '10', '7050 / 704 / 705'],
          ['M', '27', '×', '19', '10', '51 / 512 / 513'],
          ['S', '913', '−', '486', '100', '42 / 426 / 427'],
        ]
      : [
          ['A', '397', '+', '506', '10', '9030 / 902 / 903'],
          ['M', '34', '×', '29', '10', '98 / 985 / 986'],
          ['S', '724', '−', '283', '100', '44 / 440 / 441'],
        ],
  );
  q5.answer = {
    kind: 'explain',
    rubric: t(
      q5.solution.zh +
        (first
          ? '原数端点：298在290–300，407在400–410；27在20–30，19在10–20；913在900–1000，486在400–500。'
          : '原数端点：397在390–400，506在500–510；34在30–40，29在20–30；724在700–800，283在200–300。') +
        '逐个原数补端点：A/M按十、S按百；非负加乘用同向端点，减法交叉。A/S保m、M用cm²，不接受近数错单位。在范围内只是未排除。自选方案须核整数价格1–10、正整数数量、原超50/改后不超50、价格不变、指定舍入与成本+精确余额=50；估计可能漏超支，如40+12=52而估40+10=50。参考只是一个方案，其他满足全部条件的方案同样接受。',
      q5.solution.en +
        (first
          ? ' Original endpoints: 298 in 290–300, 407 in 400–410; 27 in 20–30, 19 in 10–20; 913 in 900–1000, 486 in 400–500.'
          : ' Original endpoints: 397 in 390–400, 506 in 500–510; 34 in 30–40, 29 in 20–30; 724 in 700–800, 283 in 200–300.'),
    ),
  };
  q5.solution = q5.answer.rubric;
  return {
    id: unit + '-MAINT-CALCULATION',
    unit,
    title: t(
      '换组、拆分与核验，再生成一次',
      'Regenerate exchanges, partitions and checks',
    ),
    bridge: 'B03-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), 'B03-L0' + n]),
    ),
    intro: t(
      '五题分多次，一次只做一个小问，不计时；无需一口气做完一题。先用纸笔生成图、单位和过程，再展开核对，全部小问核齐后才由家长确认。可用熟悉语言，读题帮助与数学提示分开。记录均虚构，纸上设计不要求购买。',
      'Spread five tasks over several sittings, ONE SUBPART at a time, without a timer; a whole task need not fit one sitting. Generate diagrams, units and process on paper before checking, and confirm only after ALL subparts have been reviewed. Use a familiar language; distinguish reading help from mathematical hints. Records are fictional; paper designs require no purchase.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const calculationStructureRetrieval = {
  P51_CALCULATION: makeSet('P51'),
  P52_CALCULATION: makeSet('P52'),
};
