import { t as T, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning, b05Lesson } from './builders';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const text = (p: Pair) => T(...p);
const length = 'length-units',
  perimeter = 'boundary-length',
  area = 'unit-square-cover',
  angle = 'angle-shape-properties',
  chart = 'chart-scale-reading';
function q(
  id: string,
  stem: Pair,
  value: number,
  skill: string,
  hints: [Pair, Pair],
  steps: Pair[],
  wrong: string[],
  unit?: Unit,
  diagram?: Question['diagram'],
) {
  const accepted = [
    String(value),
    Number.isInteger(value) ? `${value}.0` : value.toFixed(2),
    `${value * 2}/2`,
    ...(unit ? [`${value} ${unit}`] : []),
  ];
  const item = numeric(
    id,
    text(stem),
    String(value),
    skill,
    hints.map(text),
    steps.map(text),
    { accepted, rejected: wrong },
    diagram,
  );
  item.answer = {
    kind: 'number',
    value: String(value),
    unit,
    formats: ['decimal', 'fraction'],
  };
  if (unit) {
    item.type = 'word_problem';
    item.difficulty = 'transfer';
  }
  item.misconceptionTags = [
    skill,
    'representation',
    ...(unit ? ['reading-units'] : []),
  ];
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  skill: string,
  options: { label: Pair; feedback: Pair }[],
  hints: [Pair, Pair],
  steps: Pair[],
) {
  const item = choice(
    id,
    text(stem),
    correct,
    skill,
    options.map((o) => ({ text: text(o.label), feedback: text(o.feedback) })),
    hints.map(text),
    steps.map(text),
  );
  item.misconceptionTags = [skill, 'concept', 'representation'];
  return item;
}
function r(
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) {
  return reasoning(id, text(stem), skill, text(rubric), hints.map(text));
}
const transport = [T('步行', 'Walk'), T('骑车', 'Bike'), T('公交', 'Bus')];
const bars = (counts: number[], max = 20, step = 2): Question['diagram'] => ({
  kind: 'measurement-bars',
  values: counts.map((count, i) => ({ count, label: transport[i]! })),
  max,
  step,
});
export const b05Lessons: Lesson[] = [
  b05Lesson({
    id: 'B05-L01',
    title: T('长度和常见单位', 'Lengths and common units'),
    objective: T(
      '用两端刻度之差测量长度，并保留毫米、厘米、米与千米之间的数量关系。',
      'Measure length from the difference of endpoints and retain quantity when converting millimetres, centimetres, metres and kilometres.',
    ),
    prerequisites: ['B01-L03', 'B02-L01'],
    keywords: [
      T('起点与终点', 'endpoints'),
      T('长度差', 'length difference'),
      T('单位换算', 'unit conversion'),
    ],
    minutes: 16,
    lab: 'measurement-length',
    hook: T(
      '纸条从 3 cm 到 10 cm，长度是十厘米吗？移到尺上的零点后，它真的变长了吗？',
      'A strip runs from 3 cm to 10 cm. Is its length ten centimetres? Does moving it to zero change its length?',
    ),
    guided: q(
      'B05-L01-G',
      [
        '尺上纸条从 3 cm 到 10 cm，长多少 cm？',
        'A strip extends from 3 cm to 10 cm on a ruler. How long is it in cm?',
      ],
      7,
      length,
      [
        [
          '起点前的部分不属于纸条。',
          'The length before the start is not part of the strip.',
        ],
        ['终点减起点。', 'Subtract start from end.'],
      ],
      [
        [
          '10−3=7 cm；移到零点会从 0 到 7。',
          '10−3=7 cm; moved to zero, it runs from 0 to 7.',
        ],
      ],
      ['10', '13', '7 mm'],
      'cm',
    ),
    questions: [
      c(
        'B05-L01-Q1',
        [
          '1 cm 与多少 mm 是同一长度？',
          'How many mm represent the same length as 1 cm?',
        ],
        1,
        length,
        [
          {
            label: ['1 mm', '1 mm'],
            feedback: [
              '厘米与毫米不是同大小单位。',
              'Centimetres and millimetres are different-sized units.',
            ],
          },
          {
            label: ['10 mm', '10 mm'],
            feedback: [
              '十个毫米组成一厘米。',
              'Ten millimetres make one centimetre.',
            ],
          },
          {
            label: ['100 mm', '100 mm'],
            feedback: [
              '一百毫米等于十厘米，不是一厘米。',
              'A hundred millimetres make ten centimetres rather than one.',
            ],
          },
        ],
        [
          [
            '一厘米里有十个毫米间隔。',
            'One centimetre contains ten millimetre intervals.',
          ],
          [
            '换小单位会用更多单位来计同一长度。',
            'A smaller unit requires more units for the same length.',
          ],
        ],
        [['1 cm=10 mm。', '1 cm=10 mm.']],
      ),
      q(
        'B05-L01-Q2',
        ['4 cm 等于多少 mm？', 'How many mm equal 4 cm?'],
        40,
        length,
        [
          ['每厘米有十毫米。', 'Each centimetre contains ten millimetres.'],
          ['四个十毫米相加。', 'Combine four ten-millimetre amounts.'],
        ],
        [['4×10=40 mm，长度不变。', '4×10=40 mm; the length is unchanged.']],
        ['4', '400', '40 cm'],
        'mm',
      ),
      q(
        'B05-L01-Q3',
        [
          '图中纸条从 3 cm 到 11 cm，长多少 cm？',
          'The strip in the diagram runs from 3 cm to 11 cm. How long is it in cm?',
        ],
        8,
        length,
        [
          [
            '不是读出终点就结束。',
            'Reading only the endpoint is insufficient.',
          ],
          [
            '去掉起点前的三厘米。',
            'Exclude the three centimetres before the start.',
          ],
        ],
        [['11−3=8 cm。', '11−3=8 cm.']],
        ['11', '14', '8 mm'],
        'cm',
        { kind: 'measurement-ruler', startMm: 30, endMm: 110, unit: 'cm' },
      ),
      q(
        'B05-L01-Q4',
        ['750 mm 写成多少 cm？', 'Express 750 mm in cm.'],
        75,
        length,
        [
          ['十毫米合成一厘米。', 'Ten millimetres form a centimetre.'],
          [
            '找七百五十里有几个十。',
            'Count groups of ten in seven hundred and fifty.',
          ],
        ],
        [
          [
            '750÷10=75 cm，数字变小但长度不变。',
            '750÷10=75 cm; the number decreases but the length stays the same.',
          ],
        ],
        ['7500', '7.5', '75 mm'],
        'cm',
      ),
      q(
        'B05-L01-Q5',
        [
          '假想步道长 1500 m，用 km 写是多少？',
          'An imaginary track is 1500 m long. Express its length in km.',
        ],
        1.5,
        length,
        [
          [
            '一千米由一千个一米单位组成。',
            'One kilometre contains a thousand metre units.',
          ],
          ['1500÷1000。', 'Calculate 1500÷1000.'],
        ],
        [
          [
            '1500 m=1.5 km；其中 1000 m 是一千米，500 m 是半千米。',
            '1500 m=1.5 km: 1000 m is one kilometre and 500 m half a kilometre.',
          ],
        ],
        ['15', '1500000', '1.5 m'],
        'km',
      ),
      r(
        'B05-L01-Q6',
        [
          '纸条从 2 cm 到 8 cm，同学说长 8 cm。怎样解释并用移动纸条检查？',
          'A strip runs from 2 cm to 8 cm. A learner says it is 8 cm long. Explain and check by moving the strip.',
        ],
        length,
        [
          '8 是终点位置，不是这条纸条的长度。8−2=6 cm；不伸缩地移到零点，终点会在 6 cm。每个刻度间隔等长，纸条与起点之前的两厘米不应合并。',
          'Eight is the endpoint position rather than strip length. Subtract 8−2=6 cm. Moving the strip to zero without stretching puts its end at 6 cm. Ruler intervals are equal, and the two centimetres before the strip must not be included.',
        ],
        [
          [
            '哪个部分真的被纸条占据？',
            'Which part is actually occupied by the strip?',
          ],
          [
            '保持长度，把起点移到零。',
            'Keep the length and move its start to zero.',
          ],
        ],
      ),
    ],
    exit: q(
      'B05-L01-X',
      ['2 m 35 cm 用 cm 表示是多少？', 'Express 2 m 35 cm entirely in cm.'],
      235,
      length,
      [
        [
          '先把两米换成厘米。',
          'Convert the two metres into centimetres first.',
        ],
        [
          '200 cm 与 35 cm 单位相同，可以合并。',
          '200 cm and 35 cm share a unit and can combine.',
        ],
      ],
      [['2 m=200 cm；200+35=235 cm。', '2 m=200 cm; 200+35=235 cm.']],
      ['37', '2035', '235 m'],
      'cm',
    ),
    exitReason: T(
      '说明为什么不能直接做 2+35，并给出换回米与厘米的检查。',
      'Explain why adding 2+35 directly fails, and check by converting back to metres and centimetres.',
    ),
    parent: {
      goal: T(
        '先辨认长度而非位置，再说清每个计量单位。',
        'Distinguish length from position and identify each measuring unit.',
      ),
      misconception: T(
        '把终点刻度当长度，或把不同单位数字直接相加。',
        'Treating an endpoint as length or adding numbers with unlike units.',
      ),
      prompts: [
        T(
          '起点没在零，应该去掉哪段？',
          'If the start is not zero, what part must be excluded?',
        ),
        T('换单位后物体有没有伸长？', 'Did changing units stretch the object?'),
      ],
      bridge: 'B01-L03',
    },
  }),
  b05Lesson({
    id: 'B05-L02',
    title: T('周长是围一圈', 'Perimeter as distance around'),
    objective: T(
      '沿封闭边界计一次全部长度，并区分周长与内部覆盖量。',
      'Count the full closed boundary once and distinguish perimeter from covered interior.',
    ),
    prerequisites: ['B05-L01', 'B02-L01'],
    keywords: [
      T('边界', 'boundary'),
      T('一圈', 'one circuit'),
      T('长度单位', 'length unit'),
    ],
    minutes: 15,
    lab: 'measurement-perimeter',
    hook: T(
      '围栏绕长方形一圈，需要的长度是 8+5，还是还有两条边没走？',
      'A fence goes around an 8-by-5 rectangle. Is its length 8+5, or are two sides still missing?',
    ),
    guided: q(
      'B05-L02-G',
      [
        '长方形两边 8 cm 与 5 cm，周长多少 cm？',
        'A rectangle is 8 cm by 5 cm. What is its perimeter in cm?',
      ],
      26,
      perimeter,
      [
        ['四条边都走一次。', 'Walk all four sides once.'],
        ['相对两边长度相等。', 'Opposite sides have matching lengths.'],
      ],
      [
        [
          '8+5+8+5=26 cm，也可 2×(8+5)。',
          '8+5+8+5=26 cm, equivalently 2×(8+5).',
        ],
      ],
      ['13', '40', '26 cm²'],
      'cm',
    ),
    questions: [
      c(
        'B05-L02-Q1',
        [
          '8 cm×5 cm 长方形的围栏长度是哪一个？',
          'Which is the fence length around an 8 cm by 5 cm rectangle?',
        ],
        0,
        perimeter,
        [
          {
            label: ['26 cm', '26 cm'],
            feedback: [
              '四条边合计二十六厘米。',
              'The four sides total twenty-six centimetres.',
            ],
          },
          {
            label: ['40 cm²', '40 cm²'],
            feedback: [
              '这是内部覆盖面积，不是边界长度。',
              'This is covered area rather than boundary length.',
            ],
          },
          {
            label: ['13 cm', '13 cm'],
            feedback: [
              '只走了一条长边与一条短边，尚未一圈。',
              'This counts one long and one short side, not a circuit.',
            ],
          },
        ],
        [
          [
            '目标是沿边走，还是铺满内部？',
            'Is the target walking the edge or covering inside?',
          ],
          ['一圈必须回到起点。', 'A complete circuit returns to the start.'],
        ],
        [['周长用长度单位 cm。', 'Perimeter uses the length unit cm.']],
      ),
      q(
        'B05-L02-Q2',
        [
          '正方形每边 6 cm，周长多少 cm？',
          'A square has sides of 6 cm. What is its perimeter in cm?',
        ],
        24,
        perimeter,
        [
          ['四条边都相等。', 'All four sides match.'],
          ['六厘米重复四次。', 'Repeat six centimetres four times.'],
        ],
        [['6+6+6+6=24 cm。', '6+6+6+6=24 cm.']],
        ['12', '36', '24 cm²'],
        'cm',
      ),
      q(
        'B05-L02-Q3',
        [
          '三角形三边 5、6、7 cm，周长多少 cm？',
          'A triangle has sides 5, 6 and 7 cm. What is its perimeter in cm?',
        ],
        18,
        perimeter,
        [
          [
            '周长适用于整个封闭边界。',
            'Perimeter covers the whole closed boundary.',
          ],
          [
            '三条边各计一次，不套长方形公式。',
            'Count each of three sides once rather than use the rectangle formula.',
          ],
        ],
        [['5+6+7=18 cm。', '5+6+7=18 cm.']],
        ['30', '11', '18 cm²'],
        'cm',
      ),
      q(
        'B05-L02-Q4',
        [
          '长方形周长 30 cm，宽 9 cm，高多少 cm？',
          'A rectangle has perimeter 30 cm and width 9 cm. What is its height in cm?',
        ],
        6,
        perimeter,
        [
          ['宽与高各重复两次。', 'Width and height each appear twice.'],
          [
            '一条宽加一条高为周长的一半。',
            'One width plus one height is half the perimeter.',
          ],
        ],
        [['30÷2=15；15−9=6 cm。', '30÷2=15; 15−9=6 cm.']],
        ['21', '12', '15'],
        'cm',
      ),
      q(
        'B05-L02-Q5',
        [
          '假想菜地长方形两边 4 m 与 3 m，四周围栏多少 m？',
          'An imaginary rectangular garden is 4 m by 3 m. How many metres of fence enclose it?',
        ],
        14,
        perimeter,
        [
          ['四条边都是米。', 'All four side lengths use metres.'],
          ['4+3 只计半圈。', '4+3 counts only half a circuit.'],
        ],
        [['4+3+4+3=14 m。', '4+3+4+3=14 m.']],
        ['7', '12', '14 cm'],
        'm',
      ),
      r(
        'B05-L02-Q6',
        [
          '同学用 8+5=13 cm 当长方形一圈的长度。少算了哪里？',
          'A learner calls 8+5=13 cm the perimeter of a rectangle. What is missing?',
        ],
        perimeter,
        [
          '只计了一条八厘米边与一条五厘米边；相对的八与五也要走。四边合计 26 cm，回到起点才是一圈。不能用 8×5 的内部方格数代替围栏长度。',
          'Only one eight-centimetre side and one five-centimetre side were counted. The opposite eight and five also belong to the boundary. All four total 26 cm, completing a circuit. The interior square count 8×5 cannot replace fence length.',
        ],
        [
          ['现在走回起点了吗？', 'Have you returned to the start?'],
          ['指出另外两条边。', 'Identify the other two sides.'],
        ],
      ),
    ],
    exit: q(
      'B05-L02-X',
      [
        '9 cm×4 cm 长方形的周长多少 cm？',
        'What is the perimeter of a 9 cm by 4 cm rectangle in cm?',
      ],
      26,
      perimeter,
      [
        ['每条边只计一次。', 'Count each side once.'],
        ['两条九与两条四。', 'Two nines and two fours.'],
      ],
      [['9+4+9+4=26 cm。', '9+4+9+4=26 cm.']],
      ['13', '36', '26 cm²'],
      'cm',
    ),
    exitReason: T(
      '解释边界为什么包含四条边；与 8×5 比较同周长是否保证同面积。',
      'Explain why all four sides belong to the boundary; compare with 8×5 and ask whether equal perimeter ensures equal area.',
    ),
    parent: {
      goal: T(
        '把周长读成沿边的一圈距离。',
        'Interpret perimeter as one circuit along the edge.',
      ),
      misconception: T(
        '漏掉相对边、把边长乘积当周长或混用平方单位。',
        'Omitting opposite sides, using a side-length product as perimeter, or using square units.',
      ),
      prompts: [
        T('走到哪里才完成一圈？', 'Where must the path finish for a circuit?'),
        T(
          '计的是小线段还是内部小方格？',
          'Are you counting edge segments or interior squares?',
        ),
      ],
      bridge: 'B05-L01',
    },
  }),
  b05Lesson({
    id: 'B05-L03',
    title: T('面积是铺满多少格', 'Area as covering units'),
    objective: T(
      '用不重叠的单位方格计覆盖面积，空格不计入，旋转保留覆盖量。',
      'Count covered area with non-overlapping unit squares, exclude gaps and preserve area under rotation.',
    ),
    prerequisites: ['B05-L01', 'B02-L02'],
    keywords: [
      T('单位方格', 'unit square'),
      T('覆盖', 'coverage'),
      T('平方单位', 'square unit'),
    ],
    minutes: 16,
    lab: 'measurement-area',
    hook: T(
      '六列四行的覆盖图转个方向，方格变多了吗？若挖掉两格，还能直接用外框长乘宽吗？',
      'Does rotating six columns by four rows create more squares? If two cells are removed, can bounding width times height still give covered area?',
    ),
    guided: q(
      'B05-L03-G',
      [
        '每格 1 cm²，六列四行全部铺满，面积多少 cm²？',
        'Each cell is 1 cm². Six columns and four rows are fully covered. What is the area in cm²?',
      ],
      24,
      area,
      [
        ['一行六格，一共有四行。', 'There are six cells in each of four rows.'],
        ['每格只计一次。', 'Count each cell once.'],
      ],
      [
        [
          '6×4=24 cm²，不是围边的 20 cm。',
          '6×4=24 cm², rather than the 20 cm boundary.',
        ],
      ],
      ['20', '10', '24 cm'],
      'cm²',
    ),
    questions: [
      c(
        'B05-L03-Q1',
        [
          '边长 1 cm 的单位方格面积是多少？',
          'What is the area of a unit square with side length 1 cm?',
        ],
        1,
        area,
        [
          {
            label: ['1 cm', '1 cm'],
            feedback: [
              '这是长度单位，不是覆盖面积单位。',
              'This is a length unit, not an area unit.',
            ],
          },
          {
            label: ['1 cm²', '1 cm²'],
            feedback: [
              '一个 1 cm×1 cm 方格定义一个平方厘米。',
              'A 1 cm by 1 cm square defines a square centimetre.',
            ],
          },
          {
            label: ['4 cm', '4 cm'],
            feedback: [
              '四厘米是它的周长，不是面积。',
              'Four centimetres is its perimeter, not area.',
            ],
          },
        ],
        [
          [
            '面积在计方格，不是小边段。',
            'Area counts squares rather than edge segments.',
          ],
          ['写平方单位。', 'Use a square unit.'],
        ],
        [['1 cm×1 cm=1 cm²。', '1 cm×1 cm=1 cm².']],
      ),
      q(
        'B05-L03-Q2',
        [
          '三列四行，每格 1 cm²，全部覆盖的面积多少 cm²？',
          'A fully covered three-column, four-row grid uses 1 cm² cells. What is the area in cm²?',
        ],
        12,
        area,
        [
          ['四行都各有三格。', 'Each of four rows has three cells.'],
          ['相加四个三或用乘法。', 'Add four threes or multiply.'],
        ],
        [['3×4=12 cm²。', '3×4=12 cm².']],
        ['7', '14', '12 cm'],
        'cm²',
      ),
      q(
        'B05-L03-Q3',
        [
          '图中每格 1 cm²，只计涂色覆盖，面积多少 cm²？',
          'Each diagram cell is 1 cm². Count only covered cells. What is the covered area in cm²?',
        ],
        7,
        area,
        [
          ['白色空格不覆盖。', 'White gaps are not covered.'],
          [
            '各行覆盖三、三、一格。',
            'Covered rows contain three, three and one cells.',
          ],
        ],
        [
          [
            '3+3+1=7 cm²，外框九格包含两个空格。',
            '3+3+1=7 cm²; the nine-cell bounding rectangle includes two gaps.',
          ],
        ],
        ['9', '8', '7 cm'],
        'cm²',
        {
          kind: 'measurement-grid',
          width: 3,
          height: 3,
          selected: [0, 1, 2, 3, 4, 5, 6],
        },
      ),
      q(
        'B05-L03-Q4',
        [
          '长方形两边 4 m 与 3 m，面积多少 m²？',
          'A rectangle has sides 4 m and 3 m. What is its area in m²?',
        ],
        12,
        area,
        [
          [
            '每个单位方格边长一米。',
            'Each unit square has sides of one metre.',
          ],
          ['三行每行四个平方米。', 'Three rows each cover four square metres.'],
        ],
        [
          [
            '4×3=12 m²，周长 14 m 是另一数量。',
            '4×3=12 m²; perimeter 14 m is a different quantity.',
          ],
        ],
        ['14', '7', '12 m'],
        'm²',
      ),
      q(
        'B05-L03-Q5',
        [
          '24 个相同的 1 cm² 方格从六列四行排成八列三行，面积多少 cm²？',
          'Rearrange 24 identical 1 cm² squares from six columns and four rows into eight columns and three rows. What is the area in cm²?',
        ],
        24,
        area,
        [
          [
            '没有增加、删除或重叠方格。',
            'No squares are added, removed or overlapped.',
          ],
          [
            '仍有二十四个同样大小的单位。',
            'There are still twenty-four equal units.',
          ],
        ],
        [
          [
            '8×3=24 cm²；周长可改变，面积不变。',
            '8×3=24 cm²; perimeter can change while area stays the same.',
          ],
        ],
        ['22', '20', '11'],
        'cm²',
      ),
      r(
        'B05-L03-Q6',
        [
          '三乘三外框中只覆盖七格，同学仍用 3×3=9 cm² 当覆盖面积。怎样修正？',
          'Only seven cells are covered in a three-by-three bounding grid. A learner calls 3×3=9 cm² the covered area. How should this be corrected?',
        ],
        area,
        [
          '3×3 给整个外框面积，把两个空格也计入了。只数覆盖的七个单位方格，或用 9−2=7 cm²。空格不覆盖，不重复计边界；若旋转这七格，覆盖数量仍为七。',
          '3×3 counts the whole bounding rectangle, including two gaps. Count the seven covered unit squares or subtract 9−2=7 cm². Gaps are uncovered and edges are not extra squares. Rotating the seven covered cells retains their area.',
        ],
        [
          [
            '哪个量是外框，哪个是实际覆盖？',
            'Which quantity describes the bounds and which the coverage?',
          ],
          ['空格应该加上还是去掉？', 'Should gaps be included or excluded?'],
        ],
      ),
    ],
    exit: q(
      'B05-L03-X',
      [
        '五列三行铺满，每格 1 cm²，面积多少 cm²？',
        'Five columns and three rows are fully covered with 1 cm² cells. What is the area in cm²?',
      ],
      15,
      area,
      [
        ['三行每行五格。', 'Three rows have five cells each.'],
        [
          '计方格，不计四周小边。',
          'Count squares, not small boundary segments.',
        ],
      ],
      [['5×3=15 cm²。', '5×3=15 cm².']],
      ['16', '8', '15 cm'],
      'cm²',
    ),
    exitReason: T(
      '说明为何用平方单位，转动整图后面积为什么不变。',
      'Explain the square unit and why rotating the whole coverage retains area.',
    ),
    parent: {
      goal: T(
        '覆盖面积对应相同单位方格的实际数量。',
        'Link covered area to the actual count of equal unit squares.',
      ),
      misconception: T(
        '计空格、重叠重复计数，或把面积与周长互换。',
        'Counting gaps or overlaps twice, or confusing area with perimeter.',
      ),
      prompts: [
        T(
          '每一个面积单位是哪一个方格？',
          'Which square represents one area unit?',
        ),
        T(
          '旋转前后哪个方格被增加或删去了吗？',
          'Was any square added or removed during rotation?',
        ),
      ],
      bridge: 'B02-L02',
    },
  }),
  b05Lesson({
    id: 'B05-L04',
    title: T('角度与常见图形', 'Angles and common shapes'),
    objective: T(
      '按开口和明确性质识别角与常见图形，避免受线臂长短及朝向误导。',
      'Identify angles and common shapes from openings and stated properties rather than arm length or orientation.',
    ),
    prerequisites: ['B05-L01', 'B02-L01'],
    keywords: [
      T('开口', 'opening'),
      T('直角', 'right angle'),
      T('图形性质', 'shape properties'),
    ],
    minutes: 17,
    lab: 'measurement-angle',
    hook: T(
      '直角的两条线臂变长，再转斜一些，还会是直角吗？斜着的正方形是不是就不算长方形？',
      'If right-angle arms lengthen and rotate, is it still a right angle? Does a tilted square stop meeting the rectangle definition?',
    ),
    guided: q(
      'B05-L04-G',
      [
        '一整圈是 360°，四分之一圈是多少度？',
        'A full turn is 360°. How many degrees are in a quarter turn?',
      ],
      90,
      angle,
      [
        ['四个相同的转动合成整圈。', 'Four equal turns make a full turn.'],
        ['360÷4。', 'Calculate 360÷4.'],
      ],
      [['360÷4=90°，这是直角开口。', '360÷4=90°, a right-angle opening.']],
      ['45', '180', '90 cm'],
      '°',
    ),
    questions: [
      c(
        'B05-L04-Q1',
        [
          '已知正方形有四条直边、四个直角。它也算长方形吗？',
          'A square has four straight sides and four right angles. Does it also count as a rectangle?',
        ],
        1,
        angle,
        [
          {
            label: ['不算，只能有一个名字', 'No; it can have only one name'],
            feedback: [
              '性质类别可以包含更特殊的图形。',
              'A property-based category can include a more specific shape.',
            ],
          },
          {
            label: [
              '算，符合长方形的性质',
              'Yes; it meets the rectangle properties',
            ],
            feedback: [
              '正方形多了四边相等的条件，仍有四个直角。',
              'A square adds equal sides while retaining four right angles.',
            ],
          },
          {
            label: ['只有横着放才算', 'Only when placed horizontally'],
            feedback: [
              '旋转不会改变边长关系与直角。',
              'Rotation preserves side relationships and right angles.',
            ],
          },
        ],
        [
          [
            '先用定义，不凭摆放方向。',
            'Use the definition rather than orientation.',
          ],
          ['四个直角条件仍成立吗？', 'Do four right angles still hold?'],
        ],
        [
          [
            '本课用四边四直角的包含式定义；正方形是特殊长方形。',
            'With the inclusive four-side, four-right-angle definition, a square is a special rectangle.',
          ],
        ],
      ),
      q(
        'B05-L04-Q2',
        [
          '同方向先转 45°，再转 45°，合计转多少度？',
          'Turn 45° and then another 45° in the same direction. How many degrees altogether?',
        ],
        90,
        angle,
        [
          [
            '同方向的两个转动合并。',
            'Combine the two turns in the same direction.',
          ],
          ['两个四十五相加。', 'Add two forty-fives.'],
        ],
        [['45+45=90°。', '45+45=90°.']],
        ['45', '180', '90 mm'],
        '°',
      ),
      q(
        'B05-L04-Q3',
        ['圆的边界有几条直边？', 'How many straight sides does a circle have?'],
        0,
        angle,
        [
          ['注意问题限定“直边”。', 'Notice the word straight.'],
          [
            '曲线边界不是一条直线段。',
            'A curved boundary is not a straight segment.',
          ],
        ],
        [
          [
            '圆没有直边，数目为 0；它仍有曲线边界。',
            'A circle has zero straight sides, while still having a curved boundary.',
          ],
        ],
        ['1', '4'],
      ),
      q(
        'B05-L04-Q4',
        [
          '三角形由几条直边围成？',
          'How many straight sides enclose a triangle?',
        ],
        3,
        angle,
        [
          ['边与角的数量在这里相对应。', 'Sides and corners correspond here.'],
          [
            '三条直边形成封闭边界。',
            'Three straight segments form a closed boundary.',
          ],
        ],
        [
          [
            '三角形有 3 条直边，不要求一定有直角。',
            'A triangle has three straight sides; a right angle is not required.',
          ],
        ],
        ['4', '0'],
      ),
      q(
        'B05-L04-Q5',
        [
          '角的开口已测得 60°，只把两条线臂延长，不改变方向，角现在多少度？',
          'An opening is measured as 60°. Extend both arms without changing their directions. How many degrees is it now?',
        ],
        60,
        angle,
        [
          [
            '角计开口，不计线段长度。',
            'An angle measures opening rather than segment length.',
          ],
          [
            '两臂的方向关系保持。',
            'The directions of the arms retain their relationship.',
          ],
        ],
        [
          [
            '仍是 60°；延长线臂不改变开口。',
            'It remains 60°; extending arms does not change opening.',
          ],
        ],
        ['120', '30', '60 cm'],
        '°',
      ),
      r(
        'B05-L04-Q6',
        [
          '一个有四条相等直边、四个直角的正方形被转斜。同学说“斜了，就不是正方形也不是长方形”。怎样判断？',
          'A square with four equal straight sides and four right angles is tilted. A learner says it is now neither square nor rectangle. How should you decide?',
        ],
        angle,
        [
          '旋转只改变朝向，保留四边相等和四直角。它仍为正方形，也满足长方形的包含式定义。应检查给定或可验证性质，不能以“横着站”作为定义，也不能只凭外观证明未给定的性质。',
          'Rotation changes orientation while retaining four equal sides and four right angles. It remains a square and meets the inclusive rectangle definition. Use stated or verified properties rather than being upright; appearance alone cannot prove unstated properties.',
        ],
        [
          ['旋转有没有把一个直角打开？', 'Did rotation open any right angle?'],
          ['哪些给定性质保持了？', 'Which stated properties were preserved?'],
        ],
      ),
    ],
    exit: q(
      'B05-L04-X',
      [
        '一整圈为 360°，半圈是多少度？',
        'A full turn is 360°. How many degrees are in a half turn?',
      ],
      180,
      angle,
      [
        ['两个半圈组成整圈。', 'Two half turns make a full turn.'],
        ['360÷2。', 'Calculate 360÷2.'],
      ],
      [['360÷2=180°，是平角开口。', '360÷2=180°, a straight-angle opening.']],
      ['90', '360', '180 cm'],
      '°',
    ),
    exitReason: T(
      '说明开口、线臂长度与旋转方向是不同量，并与 90° 作比较。',
      'Distinguish opening from arm length and orientation, and compare with 90°.',
    ),
    parent: {
      goal: T(
        '用性质识别，不让图形方向替代定义。',
        'Identify by properties without replacing definitions with orientation.',
      ),
      misconception: T(
        '长线臂意味着大角、倾斜就不再是直角或正方形。',
        'Assuming longer arms make larger angles or tilting removes right-angle or square properties.',
      ),
      prompts: [
        T(
          '开口变了，还是只转了方向？',
          'Did the opening change or only orientation?',
        ),
        T(
          '哪些性质是题目给出的，哪些只是看着像？',
          'Which properties are stated, and which merely look plausible?',
        ),
      ],
      bridge: 'B05-L01',
    },
  }),
  b05Lesson({
    id: 'B05-L05',
    title: T('读条形图与简易表格', 'Reading bar charts and tables'),
    objective: T(
      '根据单位和刻度读人数，并用同一份表格检查比较与合计。',
      'Read counts using units and tick spacing, checking comparisons and totals against the same table.',
    ),
    prerequisites: ['B01-L03', 'B02-L01'],
    keywords: [
      T('刻度', 'scale'),
      T('类别', 'category'),
      T('同一数据', 'same data'),
    ],
    minutes: 16,
    lab: 'measurement-bars',
    hook: T(
      '每条刻度相差两人，一根条形跨五个间隔，是五人吗？把纵轴上限翻倍，班级人数就减半了吗？',
      'If ticks differ by two people and a bar spans five intervals, is that five people? Does doubling the axis maximum halve the class count?',
    ),
    guided: q(
      'B05-L05-G',
      [
        '假想表格：步行 8 人、骑车 6 人、公交 10 人。公交有多少人？',
        'An illustrative table records Walk 8, Bike 6 and Bus 10 people. How many use Bus?',
      ],
      10,
      chart,
      [
        ['读公交对应的那一行。', 'Read the row for Bus.'],
        [
          '人数不是三个类别的总数。',
          'This is one category rather than the total of all categories.',
        ],
      ],
      [
        [
          '公交为 10 人；刻度间隔为二时也应读到十。',
          'Bus has 10 people; ticks of two still lead to ten.',
        ],
      ],
      ['5', '24', '10 cm'],
      'people',
    ),
    questions: [
      c(
        'B05-L05-Q1',
        [
          '纵轴每个间隔 2 人，条形从零跨 3 个间隔，应读多少人？',
          'Each vertical interval is 2 people. A bar spans three intervals from zero. How many people?',
        ],
        1,
        chart,
        [
          {
            label: ['3 人', '3 people'],
            feedback: [
              '三是间隔数，不是每格一人的读数。',
              'Three counts intervals, not people at one per interval.',
            ],
          },
          {
            label: ['6 人', '6 people'],
            feedback: [
              '三个间隔各两人，合计六人。',
              'Three intervals of two represent six people.',
            ],
          },
          {
            label: ['2 人', '2 people'],
            feedback: [
              '这只计一个间隔，没有走到条形顶端。',
              'This counts one interval rather than reaching the bar top.',
            ],
          },
        ],
        [
          ['先读一个间隔代表什么。', 'Identify what one interval represents.'],
          ['三次两个。', 'Three amounts of two.'],
        ],
        [['3×2=6 人。', '3×2=6 people.']],
      ),
      q(
        'B05-L05-Q2',
        [
          '每人只记一种主要方式：步行 8、骑车 6、公交 10 人，总共多少人？',
          'Each person records one main mode: Walk 8, Bike 6 and Bus 10. How many people in total?',
        ],
        24,
        chart,
        [
          [
            '类别没有重复计同一个人。',
            'No person is counted in multiple categories here.',
          ],
          ['三个部分相加。', 'Add the three parts.'],
        ],
        [['8+6+10=24 人。', '8+6+10=24 people.']],
        ['18', '10', '24 m'],
        'people',
      ),
      q(
        'B05-L05-Q3',
        [
          '读图：公交比步行多多少人？',
          'Read the chart: how many more people use Bus than Walk?',
        ],
        2,
        chart,
        [
          [
            '比较两根对应条形的数值。',
            'Compare the values of the two relevant bars.',
          ],
          [
            '求差距，不是合计。',
            'Find the difference rather than their combined count.',
          ],
        ],
        [['10−8=2 人。', '10−8=2 people.']],
        ['18', '5', '2 cm'],
        'people',
        bars([8, 6, 10]),
      ),
      q(
        'B05-L05-Q4',
        [
          '假想表格三类分别 4、0、6 人，每人只计一次，总共多少人？',
          'Three illustrative categories contain 4, 0 and 6 people, with one record each. What is the total?',
        ],
        10,
        chart,
        [
          ['零也是一个明确的记录。', 'Zero is an explicit record too.'],
          ['零类不增加人数。', 'The zero category adds no people.'],
        ],
        [
          [
            '4+0+6=10 人；零高条形不能画成一个人的高度。',
            '4+0+6=10 people; a zero-height bar must not be drawn as one person.',
          ],
        ],
        ['11', '6', '10 cm'],
        'people',
      ),
      q(
        'B05-L05-Q5',
        [
          '同一份数据换成上限 40 的图，公交仍有多少人？',
          'The same data are drawn with axis maximum 40. How many people still use Bus?',
        ],
        10,
        chart,
        [
          [
            '只是换图的纵轴范围，数据没有改。',
            'Only the axis range changed, not the data.',
          ],
          [
            '公交条形对齐十人的数值。',
            'The Bus bar still represents ten people.',
          ],
        ],
        [
          [
            '仍是 10 人；条形看起来更矮，不表示人数减少。',
            'It remains 10 people; a shorter-looking bar does not mean a smaller count.',
          ],
        ],
        ['5', '20', '40'],
        'people',
        bars([8, 6, 10], 40, 5),
      ),
      r(
        'B05-L05-Q6',
        [
          '纵轴间隔两人，公交条形从零跨五格，同学数格子说“五人”。怎样纠正？',
          'Ticks differ by two people and the Bus bar spans five intervals from zero. A learner counts the intervals and says five people. How should this be corrected?',
        ],
        chart,
        [
          '五是间隔数，每间隔两人，5×2=10 人。先看零起点、单位与刻度；再用表格公交十人核对。改变每格单位或纵轴上限不改变同一份人数数据，不能只比较屏幕高度。',
          'Five is the interval count; each interval represents two people, so 5×2=10. Read the zero baseline, unit and scale, then check the table value of ten for Bus. Changing tick size or axis maximum does not alter the underlying counts; screen height alone is insufficient.',
        ],
        [
          [
            '刻度标签之间相差多少人？',
            'How many people separate adjacent tick labels?',
          ],
          ['用表格同一类别再核对。', 'Check the same category in the table.'],
        ],
      ),
    ],
    exit: q(
      'B05-L05-X',
      [
        '新图中，步行与公交两类合计多少人？只计这两类。',
        'In the new chart, how many people use Walk or Bus combined? Count only these two categories.',
      ],
      20,
      chart,
      [
        ['先读两根对应条形。', 'Read the two relevant bars first.'],
        [
          '骑车那一类不是这次未知量的部分。',
          'Bike is not part of the requested combined count.',
        ],
      ],
      [
        [
          '12+8=20 人；全部三类合计 24 是另一问题。',
          '12+8=20 people; all three total 24, answering a different question.',
        ],
      ],
      ['24', '4', '20 m'],
      'people',
      bars([12, 4, 8], 16, 2),
    ),
    exitReason: T(
      '解释每个刻度间隔代表几人、为何不计第三类，以及改标尺后数据为何保持。',
      'Explain people per interval, why the third category is excluded and why data stay fixed under rescaling.',
    ),
    familyChallenge: T(
      '家庭挑战：用十张纸卡代表十位假想通勤者，每张只选择步行、骑车或公交一种方式。整理人数表，画零起点条形图，再用另一刻度画同一份数据。说明能比较哪些人数、不能据此断言哪种方式更好。不需真实调查或出行，不计分。',
      'Family challenge: use ten cards for ten imaginary travellers, assigning each to Walk, Bike or Bus once. Make a count table and a zero-baseline bar chart, then redraw the same data with another scale. Explain which counts can be compared and why the data do not prove a mode is better. No real survey, travel or score is needed.',
    ),
    parent: {
      goal: T(
        '读标签、单位和刻度，再比数量。',
        'Read labels, units and scale before comparing quantities.',
      ),
      misconception: T(
        '每格都当一人、图变矮就认为人数减少、重复计人或无依据推断。',
        'Treating every interval as one, assuming shorter bars mean fewer people, double-counting people or making unsupported conclusions.',
      ),
      prompts: [
        T(
          '这一格在计一个人还是多个人？',
          'Does one interval represent one or several people?',
        ),
        T(
          '图和表是不是同一份数据？',
          'Do the chart and table show the same data?',
        ),
      ],
      bridge: 'B01-L03',
    },
  }),
];
export const b05CheckQuestions: Question[] = [
  q(
    'B05-CHECK-Q1',
    [
      '纸条从 5 cm 到 13 cm，长多少 cm？',
      'A strip runs from 5 cm to 13 cm. How long is it in cm?',
    ],
    8,
    length,
    [
      ['去掉起点前的长度。', 'Exclude the length before the start.'],
      ['13−5。', 'Calculate 13−5.'],
    ],
    [['13−5=8 cm。', '13−5=8 cm.']],
    ['13', '18', '8 mm'],
    'cm',
  ),
  q(
    'B05-CHECK-Q2',
    ['3 m 40 cm 写成多少 cm？', 'Express 3 m 40 cm in cm.'],
    340,
    length,
    [
      ['把米先换成厘米。', 'Convert metres to centimetres first.'],
      [
        '三个一百厘米与四十厘米合并。',
        'Combine three hundred centimetres and forty centimetres.',
      ],
    ],
    [['300+40=340 cm。', '300+40=340 cm.']],
    ['43', '3040', '340 mm'],
    'cm',
  ),
  q(
    'B05-CHECK-Q3',
    [
      '7 cm×4 cm 长方形的周长多少 cm？',
      'What is the perimeter of a 7 cm by 4 cm rectangle in cm?',
    ],
    22,
    perimeter,
    [
      ['四条边都计。', 'Include all four sides.'],
      ['两条七与两条四。', 'Two sevens and two fours.'],
    ],
    [['7+4+7+4=22 cm。', '7+4+7+4=22 cm.']],
    ['11', '28', '22 cm²'],
    'cm',
  ),
  q(
    'B05-CHECK-Q4',
    [
      '每格 1 cm²，图中覆盖面积多少 cm²？',
      'Each cell is 1 cm². What is the covered area in cm²?',
    ],
    10,
    area,
    [
      ['只数涂色格。', 'Count covered cells only.'],
      [
        '各行三、三、三、一格。',
        'Rows cover three, three, three and one cells.',
      ],
    ],
    [['3+3+3+1=10 cm²。', '3+3+3+1=10 cm².']],
    ['12', '14', '10 cm'],
    'cm²',
    {
      kind: 'measurement-grid',
      width: 3,
      height: 4,
      selected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
  ),
  c(
    'B05-CHECK-Q5',
    [
      '直角图形被整体转斜，开口没改，仍是直角吗？',
      'A right-angle drawing is tilted as a whole without changing its opening. Is it still a right angle?',
    ],
    0,
    angle,
    [
      {
        label: ['是，开口仍为 90°', 'Yes; its opening is still 90°'],
        feedback: [
          '方向改变，不改变两臂相对开口。',
          'Orientation changes without changing the relative opening.',
        ],
      },
      {
        label: ['不是，看起来斜了', 'No; it looks tilted'],
        feedback: [
          '“朝上”不是直角定义。',
          'Being upright is not the definition of a right angle.',
        ],
      },
      {
        label: ['取决于线臂是否够长', 'It depends on arm length'],
        feedback: ['角度不是线段长度。', 'Angle size is not segment length.'],
      },
    ],
    [
      ['判断开口有没有变。', 'Check whether the opening changed.'],
      ['不凭方向或线长。', 'Do not use orientation or arm length.'],
    ],
    [['直角开口仍为 90°。', 'The right-angle opening remains 90°.']],
  ),
  q(
    'B05-CHECK-Q6',
    [
      '半圈是多少度？整圈为 360°。',
      'How many degrees make a half turn? A full turn is 360°.',
    ],
    180,
    angle,
    [
      ['两个半圈组成整圈。', 'Two half turns make a full turn.'],
      ['360÷2。', 'Calculate 360÷2.'],
    ],
    [['180°。', '180°.']],
    ['90', '360', '180 mm'],
    '°',
  ),
  q(
    'B05-CHECK-Q7',
    [
      '读图，步行比骑车多多少人？',
      'Read the chart: how many more people Walk than Bike?',
    ],
    8,
    chart,
    [
      ['每个间隔为两人。', 'Each interval represents two people.'],
      ['比较十二与四。', 'Compare twelve and four.'],
    ],
    [['12−4=8 人。', '12−4=8 people.']],
    ['16', '4', '8 cm'],
    'people',
    bars([12, 4, 8], 16, 2),
  ),
  r(
    'B05-CHECK-Q8',
    [
      '六乘四与八乘三的长方形，每小格 1 cm×1 cm，都铺满。面积相同能保证周长相同吗？用单位解释。',
      'Fully covered 6-by-4 and 8-by-3 rectangles use 1 cm by 1 cm cells. Does equal area ensure equal perimeter? Explain with units.',
    ],
    area,
    [
      '两者都为 24 cm²，方格覆盖量相同。周长分别 2×(6+4)=20 cm 与 2×(8+3)=22 cm，沿边长度不同。平方厘米与厘米计不同量，不能凭面积相同推出周长相同，也不需要靠外观猜测。',
      'Both cover 24 cm². Their perimeters are 2×(6+4)=20 cm and 2×(8+3)=22 cm. Square centimetres and centimetres count different quantities; equal coverage does not ensure equal boundary length. Use these calculations rather than visual guessing.',
    ],
    [
      [
        '面积计方格，周长计什么？',
        'Area counts squares; what does perimeter count?',
      ],
      ['分别把四边加一次。', 'Add the four sides of each rectangle.'],
    ],
  ),
];
export function b05ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative review round');
  const k = round % 80,
    qid = `${id}-R${round}`;
  if (id === 'B05-L01') {
    const form = k % 3,
      c = 1 + (k % 18),
      start = k % 11,
      len = k % 19,
      m = 1 + (k % 4),
      extra = 5 + (k % 90),
      value = form === 0 ? c * 10 : form === 1 ? len : m * 100 + extra,
      unit = form === 0 ? 'mm' : 'cm';
    return q(
      qid,
      [
        form === 0
          ? `${c} cm 等于多少 mm？`
          : form === 1
            ? `两端在 ${start} 与 ${start + len} cm，长度多少 cm？`
            : `${m} m ${extra} cm 用 cm 写是多少？`,
        form === 0
          ? `Express ${c} cm in mm.`
          : form === 1
            ? `Endpoints are ${start} and ${start + len} cm. What is the length in cm?`
            : `Express ${m} m ${extra} cm entirely in cm.`,
      ],
      value,
      length,
      [
        [
          '先辨认刻度位置与长度、当前单位与目标单位。',
          'Distinguish endpoint position from length and current from target units.',
        ],
        [
          '同一量先统一单位再运算。',
          'Express matching units before calculating.',
        ],
      ],
      [
        [
          form === 0
            ? `${c}×10=${value} mm。`
            : form === 1
              ? `${start + len}−${start}=${value} cm。`
              : `${m}×100+${extra}=${value} cm。`,
          form === 0
            ? `${c}×10=${value} mm.`
            : form === 1
              ? `${start + len}−${start}=${value} cm.`
              : `${m}×100+${extra}=${value} cm.`,
        ],
      ],
      [
        String(
          form === 0
            ? c
            : form === 1
              ? start
                ? start + len
                : len + 1
              : m + extra,
        ),
      ],
      unit,
    );
  }
  if (id === 'B05-L02') {
    const w = 2 + (k % 9),
      h = 2 + (Math.floor(k / 9) % 9),
      p = 2 * (w + h),
      findH = k % 2 === 1,
      value = findH ? h : p;
    return q(
      qid,
      [
        findH
          ? `长方形周长 ${p} cm，宽 ${w} cm，高多少 cm？`
          : `长方形 ${w} cm×${h} cm，周长多少 cm？`,
        findH
          ? `A rectangle has perimeter ${p} cm and width ${w} cm. Find height in cm.`
          : `Find the perimeter in cm of a ${w} cm by ${h} cm rectangle.`,
      ],
      value,
      perimeter,
      [
        [
          '宽与高各在一圈里出现两次。',
          'Width and height each appear twice around a circuit.',
        ],
        [
          '先辨认是在求整圈还是缺少的一边。',
          'Identify whether the unknown is a whole circuit or a missing side.',
        ],
      ],
      [
        [
          findH ? `${p}÷2−${w}=${h} cm。` : `${w}+${h}+${w}+${h}=${p} cm。`,
          findH ? `${p}÷2−${w}=${h} cm.` : `${w}+${h}+${w}+${h}=${p} cm.`,
        ],
      ],
      [String(findH ? p - w : w + h)],
      'cm',
    );
  }
  if (id === 'B05-L03') {
    const w = 2 + (k % 7),
      h = 2 + (Math.floor(k / 7) % 7),
      total = w * h,
      removed = k % 2 ? 1 + (k % 3) : 0,
      value = total - removed;
    return q(
      qid,
      [
        `${w} 列、${h} 行，${removed} 格空着，其余覆盖。每格 1 cm²，覆盖多少 cm²？`,
        `${w} columns and ${h} rows have ${removed} uncovered cells and all others covered. Each cell is 1 cm². Find covered area in cm².`,
      ],
      value,
      area,
      [
        ['外框格数包括空格。', 'The bounding count includes gaps.'],
        [
          '去掉未覆盖格，单位保持平方厘米。',
          'Exclude uncovered cells and retain square centimetres.',
        ],
      ],
      [
        [
          `${w}×${h}−${removed}=${value} cm²。`,
          `${w}×${h}−${removed}=${value} cm².`,
        ],
      ],
      [String(removed ? total : value + 1), `${value} cm`],
      'cm²',
    );
  }
  if (id === 'B05-L04') {
    const form = k % 3,
      opening = [45, 90, 120, 180][k % 4]!,
      extra = 15 * (k % 7),
      shape = ['三角形', '长方形', '正方形', '圆'][k % 4]!,
      enShape = ['triangle', 'rectangle', 'square', 'circle'][k % 4]!,
      sides = [3, 4, 4, 0][k % 4]!,
      value = form === 0 ? 45 + extra : form === 1 ? opening : sides;
    return q(
      qid,
      [
        form === 0
          ? `同方向先转 45° 再转 ${extra}°，合计多少度？`
          : form === 1
            ? `开口 ${opening}°，只延长线臂与转动整图，开口仍多少度？`
            : `${shape}有几条直边？`,
        form === 0
          ? `Turn 45° then ${extra}° in the same direction. How many degrees altogether?`
          : form === 1
            ? `An opening is ${opening}°. Only extend its arms and rotate the whole drawing. What is the opening now?`
            : `How many straight sides does a ${enShape} have?`,
      ],
      value,
      angle,
      [
        [
          '开口、方向、线长与边数是不同量。',
          'Opening, orientation, arm length and side count are different quantities.',
        ],
        [
          '按转动关系或明确图形性质判断。',
          'Use the turn relationship or stated shape properties.',
        ],
      ],
      [
        [
          form === 0
            ? `45+${extra}=${value}°。`
            : form === 1
              ? `开口仍为 ${value}°。`
              : `直边数为 ${value}。`,
          form === 0
            ? `45+${extra}=${value}°.`
            : form === 1
              ? `The opening remains ${value}°.`
              : `The straight-side count is ${value}.`,
        ],
      ],
      [String(value + 1)],
      form === 2 ? undefined : '°',
    );
  }
  if (id === 'B05-L05') {
    const a = 4 + (k % 13),
      b = 1 + (Math.floor(k / 6) % 10),
      c = 2 + (Math.floor(k / 3) % 16),
      form = k % 3,
      value = form === 0 ? a + b + c : form === 1 ? Math.abs(a - c) : a + c;
    return q(
      qid,
      [
        `假想表格步行 ${a}、骑车 ${b}、公交 ${c} 人，每人只计一次。${form === 0 ? '三类总共多少人？' : form === 1 ? '步行与公交人数相差多少？' : '只合计步行与公交，有多少人？'}`,
        `An illustrative table has Walk ${a}, Bike ${b} and Bus ${c}, with one record per person. ${form === 0 ? 'What is the total?' : form === 1 ? 'What is the difference between Walk and Bus?' : 'Combine only Walk and Bus. How many people?'} `,
      ],
      value,
      chart,
      [
        [
          '先辨认题目要哪些类别与哪个关系。',
          'Identify the requested categories and relationship.',
        ],
        [
          '合计用相加，差距用相减。',
          'Add for a combined count and subtract for a difference.',
        ],
      ],
      [
        [
          form === 0
            ? `${a}+${b}+${c}=${value} 人。`
            : form === 1
              ? `${Math.max(a, c)}−${Math.min(a, c)}=${value} 人。`
              : `${a}+${c}=${value} 人。`,
          form === 0
            ? `${a}+${b}+${c}=${value} people.`
            : form === 1
              ? `${Math.max(a, c)}−${Math.min(a, c)}=${value} people.`
              : `${a}+${c}=${value} people.`,
        ],
      ],
      [String(form === 2 ? a + b + c : a + c)],
      'people',
    );
  }
  throw new Error(`Unknown B05 lesson ${id}`);
}
