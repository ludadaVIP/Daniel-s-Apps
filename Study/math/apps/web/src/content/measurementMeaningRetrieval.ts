import { t, type Question } from '../model';
import { reasoning } from './builders';

const reviewRulesZh = [
  ' 依据1cm=10mm、1m=100cm=1000mm、1km=1000m逐步换算。端点是位置，不自动等于长度；平移是两端同时减去同一起点。换单位改变计数，不伸缩物体；零长度没有正区间，不能为显眼而补一格。屏幕示意尺的像素不是实物厘米。',
  ' 亲画并标四边、逐段画箭头，每段边界恰计一次并回到起点。长方形两组对边相等才有2×(宽+高)，不能当所有多边形通式；正方形四条等边、三角形实际三边各计一次。内部单位格数另算面积。同周长可以不同面积，长度单位与平方单位不可互代。',
  ' 行从上向下、列从左向右，从1编号；顺时针将旧(行,列)变为(列,旧行数−行+1)。每个覆盖位置只计一次，同格重涂不增加面积。旋转和无重叠重排都保持格数与每格实际面积；放大格边长则改变每格面积，不能只凭格数相同断言覆盖量相同。清空是0覆盖，不是外框正面积。周长用长度单位，面积用平方单位。',
  ' 准确范围：零角=0°；锐角0°<角<90°；直角=90°；钝角90°<角<180°；平角=180°。延臂和整图转动保持两臂相对方向，只转一臂会改变开口；净转向要计方向，不能用总转过路程代替。正方形属于长方形，反过来还须四边相等；任何合条件的非正方形长方形都接受。一个例子不能证明所有三角形的性质。仅外观不能证明未给定的等边或直角；应说明已知性质、合适测量或数学依据。',
  ' A完整刻度0,2,4,6,8,10,12,14,16,18,20；B完整刻度0,5,10,15,20,25,30,35,40。两图均标类别、人数单位和柱顶原值。在两图全量程绘图区等高时，上限加倍只使柱子图示高度减半，不改变任何人数。柱顶不必恰在刻度线上；零柱高度严格为0，仍保留类别名。自编方案须C1–C10全部各出现一次，三个非负整数人数和为10，两种刻度图与表匹配，正确写指定两类合计及公交/步行的非负差和大小方向；任何满足条件的分配都接受，不照抄范例。指定两类与全体的数值偶合相同也不能混淆所计对象。重复C1时须一致去重，才能称不同人数；计选择次数是另一种量。这些假想人数不能证明哪种方式更快、更健康或更好，也不能代表所有学校；需相应行程时间、费用或其他观察及适当采集方案。无需真实调查、出行或购买。',
];

const makeSet = (unit: 'P66' | 'J87') => {
  const first = unit === 'P66',
    id = (n: number) => unit + '-MAINT-MEASUREMENT-Q' + n;
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
    reasoning(id(n), t(z, e), skill, t(rz + reviewRulesZh[n - 1], re), [
      t(hz, he),
      t(
        '一次只做一个小问；先画或写自己的过程，再逐项核验，得数或关键词不能代替完整理由。',
        'Do one subpart at a time. Generate your own drawing or process before checking each part; a result or keyword does not replace complete reasoning.',
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
      columns: headers.map(([a, b]) => t(a, b)),
      rows: rows.map((r) =>
        r.map((s) => (typeof s === 'string' ? t(s, s) : s)),
      ),
    };
  };
  const start = first ? 35 : 45,
    end = first ? 115 : 135,
    zero = first ? 70 : 90,
    mixedM = first ? 3 : 2,
    mixedCm = first ? 45 : 65,
    track = first ? 2500 : 3750;
  const q1 = task(
    1,
    'length-units',
    'A、Z是两条独立示意记录。按表中毫米端点求各自长度，用mm、cm、m表示，再不伸缩地把左端移到0，给新右端。对A另从左端起每隔1cm画一个刻度直到右端，分别数区间与含两端刻度点；Z对应几个区间？另将' +
      mixedM +
      'm ' +
      mixedCm +
      'cm统一成cm、mm与m，再换回原混合单位；为什么不能把两个裸数字相加当厘米？假想步道' +
      track +
      'm又是多少km？以A长度的厘米数和相同数字的毫米数比较实际长短：数字一样就等长吗？说明换单位不伸缩，屏幕像素也不是实物厘米。',
    'A and Z are TWO independent schematic records. Use the millimetre endpoints to generate each length in mm, cm and m. Translate its left end to zero WITHOUT stretching and give the new right end. For A ALSO mark every one centimetre from its left end through its right end: count intervals and ticks INCLUDING both endpoints separately. How many intervals does Z span? Independently convert ' +
      mixedM +
      ' m ' +
      mixedCm +
      ' cm to cm, mm and m, then recover the mixed units. Why not add the bare numbers as centimetres? Convert an imaginary ' +
      track +
      ' m track to km. Compare A’s centimetre count with the SAME numerical count of millimetres: are the lengths equal? Explain why conversion does not stretch an object and screen pixels are not physical centimetres.',
    first
      ? 'A: 115−35=80mm=8cm=0.08m，移后0到80mm；按1cm一格有8区间、9刻度。Z: 70−70=0mm=0cm=0m，移后两端0，0区间、一个重合端点。3m45cm=345cm=3450mm=3.45m；345cm=3×100cm+45cm，换回3m45cm，3+45=48cm不保单位。2500m=2.5km。8cm=80mm>8mm，前者10倍，不是等长。'
      : 'A: 135−45=90mm=9cm=0.09m，移后0到90mm；按1cm一格有9区间、10刻度。Z: 90−90=0mm=0cm=0m，移后两端0，0区间、一个重合端点。2m65cm=265cm=2650mm=2.65m；265cm=2×100cm+65cm，换回2m65cm；2+65=67cm错误。3750m=3.75km。9cm=90mm>9mm，前者10倍。',
    (first
      ? 'A: 115−35=80 mm=8 cm=0.08 m; translated endpoints 0 and 80 mm. One-centimetre marks give 8 intervals and 9 ticks. Z: 70−70=0 mm=0 cm=0 m; both translated endpoints zero, 0 intervals and one coincident endpoint. Mixed: 3 m 45 cm=345 cm=3450 mm=3.45 m; 345=3×100+45 recovers 3 m 45 cm. The bare 3+45=48 cm mixes units. Track: 2500 m=2.5 km. Same numeral: 8 cm=80 mm>8 mm, TEN times as long.'
      : 'A: 135−45=90 mm=9 cm=0.09 m; translated endpoints 0 and 90 mm. One-centimetre marks give 9 intervals and 10 ticks. Z: 90−90=0 mm=0 cm=0 m; both translated endpoints zero, 0 intervals and one coincident endpoint. Mixed: 2 m 65 cm=265 cm=2650 mm=2.65 m; 265=2×100+65 recovers 2 m 65 cm. The bare 2+65=67 cm mixes units. Track: 3750 m=3.75 km. Same numeral: 9 cm=90 mm>9 mm, TEN times as long.') +
      ' Use 1 cm=10 mm, 1 m=100 cm=1000 mm, 1 km=1000 m. The endpoint is a POSITION, not automatically length. Translation subtracts the same start from both endpoints. Counts change with unit size, not physical length. Zero has no positive interval; do not invent one to make it visible. A schematic screen ruler is not an actual-size household ruler.',
    '先统一端点单位、做终点减起点；混合单位先换同单位再相加。',
    'First match endpoint units and subtract start from end; convert mixed units before adding.',
  );
  table(
    q1,
    '两条独立记录；端点单位都是mm。',
    'Two independent records; ALL endpoints are in mm.',
    [
      ['记录', 'Record'],
      ['左端/mm', 'Left/mm'],
      ['右端/mm', 'Right/mm'],
    ],
    [
      ['A', String(start), String(end)],
      ['Z', String(zero), String(zero)],
    ],
  );

  const w = first ? 7 : 8,
    h = first ? 4 : 3,
    cw = first ? 6 : 7,
    ch = first ? 5 : 4,
    square = first ? 5 : 4,
    tri = first ? [3, 4, 5] : [4, 5, 6],
    perimeter = first ? 26 : 30,
    known = first ? 8 : 9;
  const q2 = task(
    2,
    'boundary-length',
    '先画表中R、C两长方形，沿四边写实际长度与箭头，生成一圈周长和覆盖面积，单位分别标清。R只算宽+高走完了吗，宽×高能充当围栏长吗？两图同周长必同面积吗，用本次数字核验。另三个独立问题：正方形每边' +
      square +
      'cm；三角形三边' +
      tri.join('、') +
      'cm；另一长方形周长' +
      perimeter +
      'cm、宽' +
      known +
      'cm、高未知。分别求周长、周长和缺少的高，并逐边反查；三角形能直接套长方形公式吗？从任意角起走一圈，每段应计几次，在哪里停？',
    'DRAW rectangles R and C, label each of four sides and trace a complete circuit. Generate perimeter AND covered area with their different units. Does width+height complete R’s circuit, or width×height give fence length? Do equal perimeters force equal area? Check using THESE dimensions. THREE independent problems follow: square side ' +
      square +
      ' cm; triangle sides ' +
      tri.join(',') +
      ' cm; missing-side rectangle perimeter ' +
      perimeter +
      ' cm and width ' +
      known +
      ' cm. Find the square perimeter, triangle perimeter and missing rectangle height, then check from actual sides. May the rectangle expression be applied unchanged to a triangle? Starting at any corner, how often is each segment counted and where must the walk stop?',
    first
      ? 'R: 7+4+7+4=22cm，面积7×4=28cm²；C: 6+5+6+5=22cm，面积6×5=30cm²。同周长不同面积。R的7+4=11cm只走半圈；28cm²不是围栏长。正方形4×5=20cm；三角形3+4+5=12cm，三个边各一次。缺高26÷2−8=5cm，8+5+8+5=26cm；26−8=18没有解决另三边关系。'
      : 'R: 8+3+8+3=22cm，面积8×3=24cm²；C: 7+4+7+4=22cm，面积7×4=28cm²。同周长不同面积。8+3=11cm只计半圈，24cm²不是围栏。正方形4×4=16cm；三角形4+5+6=15cm。缺高30÷2−9=6cm，9+6+9+6=30cm；30−9=21不是所求高。',
    (first
      ? 'R: 7+4+7+4=22 cm; 7×4=28 cm². C: 6+5+6+5=22 cm; 6×5=30 cm². Width+height 7+4=11 cm is only half a circuit. Square: 4×5=20 cm. Triangle: 3+4+5=12 cm. Missing height: 26÷2−8=5 cm; check 8+5+8+5=26 cm. The bare 26−8=18 is not the height.'
      : 'R: 8+3+8+3=22 cm; 8×3=24 cm². C: 7+4+7+4=22 cm; 7×4=28 cm². Width+height 8+3=11 cm is only half a circuit. Square: 4×4=16 cm. Triangle: 4+5+6=15 cm. Missing height: 30÷2−9=6 cm; check 9+6+9+6=30 cm. The bare 30−9=21 is not the height.') +
      ' Trace EVERY boundary segment ONCE and return to the starting point. Rectangle opposite sides form two pairs; this justifies 2×(width+height), not a rule for every polygon. A square has four equal sides, a triangle three actual sides. Count interior unit squares separately. Equal perimeter can accompany different area; length units and square units cannot substitute for one another.',
    '给四条边逐一编号，再看已走的是半圈还是一圈；缺边先从半周长恢复。',
    'Number all four sides and distinguish half a circuit from a whole; recover a missing side using half the perimeter.',
  );
  table(
    q2,
    '两个独立完整长方形；边长均为cm，图与结果待生成。',
    'Two independent COMPLETE rectangles; side lengths in cm, drawings and results to be generated.',
    [
      ['图', 'Figure'],
      ['宽/cm', 'Width/cm'],
      ['高/cm', 'Height/cm'],
    ],
    [
      ['R', String(w), String(h)],
      ['C', String(cw), String(ch)],
    ],
  );

  const cols = first ? 4 : 5,
    covered = first
      ? [
          [1, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3],
        ]
      : [
          [2, 3, 4, 5],
          [1, 2, 3, 5],
          [1, 2, 3, 4],
        ];
  const arrange = first
    ? [
        [2, 5],
        [1, 10],
      ]
    : [
        [3, 4],
        [2, 6],
      ];
  const q3 = task(
    3,
    'unit-square-cover',
    '原外框' +
      cols +
      '列、3行，每格1cm×1cm，表列出各行已覆盖列号，其他格都是空。亲画原图，按行与“外框−空格”两法求实际覆盖面积；同格重涂两遍能多计一格吗？把整图连同空格顺时针转90°，给新列/行数、空格的新(行,列)与面积，说明哪些变哪些不变。再从原图重新开始，将同一批已覆盖单位格无重叠无空隙地排成' +
      arrange.map((a) => a.join('×')).join('与') +
      '两个完整长方形，分别求面积和周长；同面积是否保证同周长？另独立重画，每格边长改2cm，仍覆盖相同格数，实际面积还等于原来吗？最后清除全部覆盖，外框仍在，面积应是多少？',
    'The ORIGINAL frame has ' +
      cols +
      ' columns and THREE rows. Every cell is 1 cm×1 cm; the table lists covered column numbers in each row, with every other cell empty. DRAW it and find covered area by row sums AND bounding cells minus holes. Does painting the same location twice add another square? Rotate the WHOLE drawing, holes included, 90° clockwise: generate new column/row counts, every hole’s NEW (row,column), and area. State what changes and what stays. Independently restart with the original covered unit squares and rearrange them WITHOUT overlap or gaps into complete rectangles ' +
      arrange.map((a) => a.join('×')).join(' and ') +
      '. Find each area and perimeter. Does equal area guarantee equal perimeter? In a SEPARATE redrawing, change each cell SIDE to two cm while keeping covered count: is actual area unchanged? Finally clear all coverage; what area remains even though the frame is still drawn?',
    first
      ? '原各行3、4、3格，3+4+3=10cm²；外框4×3=12格，空(1,2)、(3,4)，12−2=10cm²。顺时针后3列4行，空格变(2,3)、(4,1)，覆盖仍10cm²。重排2×5面积10cm²、周长14cm；1×10面积10cm²、周长22cm。改每格2cm×2cm为4cm²，相同10格面积40cm²，不是10。清空0格为0cm²，外框存在不等于被覆盖。'
      : '各行4、4、4格，4+4+4=12cm²；外框5×3=15格，空(1,1)、(2,4)、(3,5)，15−3=12cm²。顺时针后3列5行，空格(1,3)、(4,2)、(5,1)，仍12cm²。重排3×4面积12cm²、周长14cm；2×6面积12cm²、周长16cm。每格改2cm×2cm为4cm²，相同12格面积48cm²。清空为0cm²。',
    (first
      ? 'Original rows 3,4,3: 3+4+3=10 cm². Bounds 4×3=12 cells, holes (1,2),(3,4); 12−2=10 cm². Clockwise: 3 columns, 4 rows; holes (2,3),(4,1); area still 10 cm². Rearranged 2×5: area 10 cm², perimeter 14 cm. Rearranged 1×10: area 10 cm², perimeter 22 cm. Larger cells: 2×2=4 cm² EACH, so 10×4=40 cm². Clear: 0 cm².'
      : 'Original rows 4,4,4: 4+4+4=12 cm². Bounds 5×3=15 cells, holes (1,1),(2,4),(3,5); 15−3=12 cm². Clockwise: 3 columns, 5 rows; holes (1,3),(4,2),(5,1); area still 12 cm². Rearranged 3×4: area 12 cm², perimeter 14 cm. Rearranged 2×6: area 12 cm², perimeter 16 cm. Larger cells: 2×2=4 cm² EACH, so 12×4=48 cm². Clear: 0 cm².') +
      ' Rows count from TOP, columns from LEFT, both starting at one. Clockwise maps old (row,column) to (column,old row count−row+1). Count each covered LOCATION once; repainting it does not add coverage. Rotation and nonoverlapping rearrangement retain cell count AND unit area. Resizing cells changes the unit area, so equal counts alone do not prove equal coverage. Zero selected cells means zero covered area, not the positive bounding area. Lengths label perimeters, square lengths label area.',
    '先标清行列编号和空格；旋转整图时空格也旋转，重排时保每格实际大小。',
    'Label row/column numbers and holes first. Rotation moves holes too; rearrangement retains each cell’s actual size.',
  );
  table(
    q3,
    '行从上到下、列从左到右，编号从1起。只列已覆盖列号，不列空格或答案。',
    'Rows run top to bottom, columns left to right, starting at ONE. Only covered column numbers are given, not holes or answers.',
    [
      ['行号', 'Row'],
      ['已覆盖列号', 'Covered columns'],
    ],
    covered.map((r, i) => [String(i + 1), r.join(', ')]),
  );

  const angles = first
      ? [0, 1, 89, 90, 91, 179, 180]
      : [0, 30, 88, 90, 92, 150, 180],
    opening = first ? 55 : 70,
    rotation = first ? 25 : 35,
    oneArm = first ? 15 : 20,
    turn1 = first ? 35 : 40,
    turn2 = first ? 55 : 50;
  const q4 = task(
    4,
    'angle-shape-properties',
    '逐行按开口分类表中各角，先写零、锐、直、钝、平角的准确范围，0、90、180不能放进邻类。另独立画' +
      opening +
      '°角，延长两臂并把整图一起顺时针转' +
      rotation +
      '°，开口怎样变？再只把一臂向远离另一臂方向转' +
      oneArm +
      '°，在未超过180°的开口内求新角，为什么这次不同？两项转向题均从同一原朝向重新开始：①顺时针' +
      turn1 +
      '°再顺时针' +
      turn2 +
      '°；②顺时针' +
      turn1 +
      '°再逆时针' +
      turn2 +
      '°。分别求净转角与方向，不能只把数都加。最后给一个非正方形的长方形反例，列性质；已知另一个三角形三个内角都为60°，能否由一个直角三角形例子推出所有三角形有直角？若仅“画着像正方形”却未给边角性质，能当证明吗？',
    'Classify EVERY listed opening after stating exact ranges for zero, acute, right, obtuse and straight angles; keep 0,90,180 out of neighbouring categories. Independently DRAW a ' +
      opening +
      '° angle, extend both arms and rotate the WHOLE drawing ' +
      rotation +
      '° clockwise. What is its opening? Then move ONLY ONE arm ' +
      oneArm +
      '° farther away from the other, keeping the opening within 180°: find the new angle and explain the difference. Restart from the SAME original heading for EACH turn problem: (1) clockwise ' +
      turn1 +
      '° then clockwise ' +
      turn2 +
      '°; (2) clockwise ' +
      turn1 +
      '° then anticlockwise ' +
      turn2 +
      '°. Give NET turn and direction, rather than always adding. Finally construct a rectangle that is NOT a square and state its properties. Another triangle has stated angles 60°,60°,60°: can one right-triangle example establish that ALL triangles have a right angle? Is an unmeasured drawing that merely looks square a proof?',
    first
      ? '分类依次零、锐、锐、直、钝、钝、平。55°角延长两臂及整图转25°后仍55°；只转一臂使开口55+15=70°。同向35+55=90°顺时针；反向净55−35=20°逆时针，虽然两段合计转过90°，净朝向改变不是90°。非正方形长方形可取6cm×4cm、四直角，两邻边不等。三角60°、60°、60°无直角，反驳所有三角形都直角。'
      : '分类依次零、锐、锐、直、钝、钝、平。70°角延臂和整图转35°后仍70°；一臂远离转20°后70+20=90°为直角。同向40+50=90°顺时针；反向净50−40=10°逆时针，不是90°。可举8cm×5cm四直角的长方形，邻边不等故非正方形。60°、60°、60°的三角形没有直角，是全称判断反例。',
    (first
      ? 'Kinds in order: zero, acute, acute, right, obtuse, obtuse, straight. Fixed opening: 55° remains 55° after extending and rotating the WHOLE by 25°. One arm only: 55+15=70°. Same-direction turn: 35+55=90° clockwise. Opposite-direction NET: 55−35=20° anticlockwise, although total turned distance is ninety degrees. Counterexample rectangle: 6 cm×4 cm with four right angles, unequal adjacent sides.'
      : 'Kinds in order: zero, acute, acute, right, obtuse, obtuse, straight. Fixed opening: 70° remains 70° after extending and rotating the WHOLE by 35°. One arm only: 70+20=90°. Same-direction turn: 40+50=90° clockwise. Opposite-direction NET: 50−40=10° anticlockwise, despite ninety degrees of total turning. Counterexample rectangle: 8 cm×5 cm with four right angles, unequal adjacent sides.') +
      ' Ranges: zero=0°; acute 0°<a<90°; right=90°; obtuse 90°<a<180°; straight=180°. The stated 60°,60°,60° triangle has no right angle and disproves the ALL-triangles claim. One example cannot establish every triangle’s properties. A square is a rectangle, but the converse needs equal sides; accept ANY valid non-square rectangle. Appearance alone does not prove unstated equal sides or right angles. Use given properties, suitable measurement or a mathematical justification, and distinguish whole rotation from changing relative arm directions.',
    '写严格范围，再分清整图转动、单臂转动与净转向；反例只需一个确实满足条件的图形。',
    'State strict ranges, distinguish whole/one-arm turns and NET heading, and give one valid counterexample.',
  );
  table(
    q4,
    '七个独立已知开口（度），分类与理由待求。',
    'Seven independent stated openings in degrees; classification and reasons are to be generated.',
    [
      ['样本', 'Case'],
      ['开口/°', 'Opening/°'],
    ],
    angles.map((a, i) => [String.fromCharCode(65 + i), String(a)]),
  );

  const intervals = first ? [4, 0, 6] : [3, 0, 5];
  const q5 = task(
    5,
    'chart-scale-reading',
    '表为同一假想班的三类记录，每人恰选一种主要方式；末列是从零数的条形区间数，每格2人，不是直接人数。逐类还原人数，求全班总数、只计步行与骑车的合计、公交比步行多的人数，分别指出题目所求。亲画两张同数据的零起点图：A上限20、每格2人；B上限40、每格5人，标类别、单位、全刻度和柱顶原值。B的柱顶必须落在刻度线上吗？零人数仍保类别但该画多高？人数是否因柱子相对变矮而改变？另次用10张编号C1–C10的卡，自选三类归属，每卡只记一次，生成完整名单、人数表和这两种刻度图；说明指定两类合计与全体合计各在计谁，数值偶合相同也不表示问法相同；另比较公交与步行人数的多、少或相等，写非负差。若C1重复记入两类还能直接当不同人数相加吗？给出不能由这些假想人数推出的结论及还需要什么资料。',
    'The table describes ONE fictional class, each person choosing exactly ONE main mode. The last column counts bar intervals FROM ZERO, at TWO people each; it is not already the people count. Recover each count, the whole-class total, Walk+Bike ONLY, and Bus−Walk, naming each requested quantity. DRAW two zero-baseline charts of the SAME data: A maximum twenty with ticks of two; B maximum forty with ticks of five. Label categories, people units, ALL ticks and original values at bar tops. Must B’s tops coincide with tick marks? Retain the zero category: what height should it have? Do shorter relative bars change counts? In another sitting, assign ten cards C1–C10 to the three modes yourself, ONCE each; generate complete ID lists, a count table and both scales. Distinguish a selected-two total from the whole total even if their values happen to match. Report whether Bus or Walk is larger (or equal), with a nonnegative difference. If C1 appears in two categories, may their sum automatically be called DISTINCT people? State a conclusion these fictional counts cannot establish and what additional information it would need.',
    first
      ? '人数步行4×2=8、骑车0×2=0、公交6×2=12；全体8+0+12=20人，步行与骑车8人，公交比步行多12−8=4人。A刻度0,2,…,20；B刻度0,5,…,40，同人数不变。B步行顶在5与10间的8，公交顶在10与15间的12；分别跨1.6与2.4格，不必在刻度线上。骑车高度0，不画成1人。自编示例C1–C4步行、C5–C10公交、骑车无卡，表4/0/6、合10、指定两类4、公交多2；同数据可换尺度，其他有效分配也接受。'
      : '人数步行3×2=6、骑车0、公交5×2=10；全体6+0+10=16人，步行与骑车6人，公交比步行多10−6=4人。A刻度0,2,…,20；B刻度0,5,…,40；B步行顶在5与10之间6处，跨1.2格，公交在10处跨2格，骑车高度0。自编示例C1–C2步行、C3–C5骑车、C6–C10公交，表2/3/5、合10、指定两类5、公交多3；其他完整有效分配同样可。',
    (first
      ? 'Recovered: Walk 4×2=8, Bike 0×2=0, Bus 6×2=12 people. Total 8+0+12=20; Walk+Bike=8; Bus−Walk=12−8=4. At max forty/step five, Walk spans 8÷5=1.6 intervals and Bus 12÷5=2.4, between labelled ticks. ONE card example: C1–C4 Walk, C5–C10 Bus, Bike empty; counts 4,0,6 total ten; selected Walk+Bike four; Bus exceeds Walk by two.'
      : 'Recovered: Walk 3×2=6, Bike 0×2=0, Bus 5×2=10 people. Total 6+0+10=16; Walk+Bike=6; Bus−Walk=10−6=4. At max forty/step five, Walk spans 6÷5=1.2 intervals and Bus 10÷5=2. ONE card example: C1–C2 Walk, C3–C5 Bike, C6–C10 Bus; counts 2,3,5 total ten; selected Walk+Bike five; Bus exceeds Walk by three.') +
      ' Chart A ticks: 0,2,4,6,8,10,12,14,16,18,20. Chart B ticks: 0,5,10,15,20,25,30,35,40. All three original counts stay unchanged. With equal plotted heights for the full ranges, doubling the maximum halves each bar’s plotted height, not its people count. A zero bar has EXACTLY zero height with its category label retained. Tops need not coincide with ticks. For ANY card allocation require all ten IDs exactly once, nonnegative integer counts summing to ten, matching labels, both correct scales, original values, selected sum and stated nonnegative comparison/direction. A repeated C1 invalidates the distinct-person total unless deduplicated consistently; counting selections is a different quantity. These fictional counts cannot prove a mode faster, healthier or better, or represent all schools; appropriate journey-time/cost/other observations and a suitable collection plan would be needed. No actual survey, travel or purchase is required.',
    '先算区间数×每格人数，再统一同一表的标签；换上限不换原人数。',
    'First multiply interval count by people per interval, keeping table/category identities; changing the maximum does not change counts.',
  );
  table(
    q5,
    '同班互不重复三类记录：全部从零起画，每区间2人。只给原区间数。',
    'Mutually exclusive categories in ONE class; zero baseline and TWO people per interval. Only original interval counts are given.',
    [
      ['方式', 'Mode'],
      ['从零到柱顶的区间数', 'Intervals from zero'],
    ],
    [
      [t('步行', 'Walk'), String(intervals[0])],
      [t('骑车', 'Bike'), String(intervals[1])],
      [t('公交', 'Bus'), String(intervals[2])],
    ],
  );
  return {
    id: unit + '-MAINT-MEASUREMENT',
    unit,
    title: t(
      '量、边界与图表，再生成一次',
      'Regenerate measures, boundaries and charts',
    ),
    bridge: 'B05-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), 'B05-L0' + i]),
    ),
    intro: t(
      '五张复现卡分多次，一次一个小问，不计时。先在纸上画图、写单位与理由，再展开核验；全部小问经家长核齐才确认。读题协助与数学提示分开，可用熟悉语言。所有记录是假想，纸卡活动不需真实调查、出行或购买。',
      'Split five retrieval cards across sittings, ONE SUBPART at a time, without a timer. Draw and write units/reasons before checking; confirm only after EVERY part is reviewed. Use a familiar language and distinguish reading help from maths hints. All records are fictional; card activities need no real survey, travel or purchase.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const measurementMeaningRetrieval = {
  P66_MEASUREMENT: makeSet('P66'),
  J87_MEASUREMENT: makeSet('J87'),
};
