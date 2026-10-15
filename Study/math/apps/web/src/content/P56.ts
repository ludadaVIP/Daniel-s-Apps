import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  convertGeometryUnit,
  conversionText,
  type GeoUnit,
} from '../geometryModels';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
const U = 'metric-dimension-conversion',
  R = 'rectangle-area',
  Tg = 'triangle-rearrangement',
  P = 'parallel-base-area',
  V = 'unit-cube-volume',
  S = 'box-surface-area';
function q(
  id: string,
  stem: Pair,
  value: string,
  skill: string,
  hints: [Pair, Pair],
  steps: Pair[],
  wrong: string[],
  unit: Unit,
  diagram?: Question['diagram'],
): Question {
  const [n, d] = exactRational(value)!;
  const item = numeric(
    id,
    T(stem),
    value,
    skill,
    hints.map(T),
    steps.map(T),
    {
      accepted: [
        value,
        `${n * 2n}/${d * 2n}`,
        ...(unit ? [`${value} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram,
  );
  item.answer = {
    kind: 'number',
    value,
    unit,
    formats: ['decimal', 'fraction'],
  };
  item.type = diagram ? 'visual_select' : unit ? 'word_problem' : 'numeric';
  item.misconceptionTags = [
    skill,
    'reading-units',
    'dimension',
    'representation',
  ];
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  skill: string,
  options: [Pair, Pair][],
  hints: [Pair, Pair],
  steps: Pair[],
) {
  return choice(
    id,
    T(stem),
    correct,
    skill,
    options.map(([text, feedback]) => ({
      text: T(text),
      feedback: T(feedback),
    })),
    hints.map(T),
    steps.map(T),
  );
}
const r = (
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) => reasoning(id, T(stem), skill, T(rubric), hints.map(T));
const hints = {
  U: [
    [
      '先判断长度、面积还是体积，只在同类量之间改写单位。',
      'Identify length, area or volume; convert only between the same dimension.',
    ],
    [
      '每条棱的进率分别作用于一、二、三个方向；实际量不变。',
      'Apply the edge conversion factor in one, two or three directions; retain the quantity.',
    ],
  ],
  R: [
    [
      '先统一两条边的单位，再数一行与行数。',
      'Use the same edge unit, then count cells per row and rows.',
    ],
    [
      '面积数覆盖单位格；周长数外边界，不混用平方与长度单位。',
      'Area counts covering squares; perimeter counts boundary length.',
    ],
  ],
  T: [
    [
      '找与底垂直的高，斜边不能代替。',
      'Use height perpendicular to the base, not a slanted side.',
    ],
    [
      '两份相同三角形切拼成同底同高矩形，一份是其一半。',
      'Two identical triangles rearrange into a same-base, same-height rectangle; one has half its area.',
    ],
  ],
  P: [
    [
      '高是平行底之间的垂直距离，先统一单位。',
      'Height is the perpendicular distance between parallel bases; align units.',
    ],
    [
      '平行四边形切拼保留面积；梯形两份拼成底为两底和的图，最后分回一份。',
      'Parallelogram dissection retains area; a trapezoid pair has base equal to the base sum, then halve for one copy.',
    ],
  ],
  V: [
    [
      '先数底层每行多少颗、几行，再数层数。',
      'Count cubes per row and rows in a layer, then layers.',
    ],
    [
      '每颗单位立方体计一个体积单位；容量用内部尺寸。',
      'Each unit cube contributes one volume unit; capacity uses internal dimensions.',
    ],
  ],
  S: [
    [
      '先区分有盖六面与无盖五面，再逐面列边长乘积。',
      'Distinguish six closed faces from five open-top faces, then list face products.',
    ],
    [
      '面片总面积与外接纸张面积、接缝余量是不同的量。',
      'Panel sum, a bounding sheet and seam allowance are different quantities.',
    ],
  ],
} satisfies Record<string, [Pair, Pair]>;
const rect = (w: number, h: number): Question['diagram'] => ({
  kind: 'geo-rectangle',
  w,
  h,
});
const tri = (b: number, h: number, apex: number): Question['diagram'] => ({
  kind: 'geo-triangle',
  b,
  h,
  apex,
});
const parallel = (
  b: number,
  h: number,
  shift: number,
): Question['diagram'] => ({ kind: 'geo-parallel', b, h, shift });
const trap = (
  a: number,
  b: number,
  h: number,
  shift = 2,
): Question['diagram'] => ({ kind: 'geo-trapezoid', a, b, h, shift });
const prism = (
  w: number,
  d: number,
  h: number,
  unit: 'cm' | 'dm' = 'cm',
): Question['diagram'] => ({ kind: 'geo-prism', w, d, h, unit });
const net = (
  w: number,
  d: number,
  h: number,
  lid = true,
): Question['diagram'] => ({ kind: 'geo-net', w, d, h, lid });
const lesson = (l: Lesson): Lesson => ({
  ...l,
  stage: 'P05',
  unit: 'P56',
  order: Number(l.id.slice(-2)),
  skillTags: [...new Set(l.questions.map((q) => q.skill))],
  nzYearHints: [5, 6],
  cnGradeHints: [5],
  contentStatus: 'ready',
});
export const p56Lessons: Lesson[] = [
  lesson({
    id: 'P56-L01',
    title: t('单位换算的含义', 'Meaningful unit conversion'),
    objective: t(
      '用一、二、三方向的单位分割解释换算进率，保持实际量并只换算同类量。',
      'Explain conversion through one-, two- and three-direction unit subdivision, retaining the quantity and dimension.',
    ),
    prerequisites: ['B05-L01', 'B05-L03', 'P52-L01'],
    keywords: [
      t('单位', 'unit'),
      t('维度', 'dimension'),
      t('进率', 'conversion factor'),
    ],
    minutes: 18,
    lab: 'geo-units',
    hook: t(
      '1 m 改写成 cm 是一百，但 1 m² 是一百平方厘米吗？如果还有第三个方向，会怎样？',
      'One metre becomes one hundred centimetres, but does one square metre become one hundred square centimetres? What if there is a third direction?',
    ),
    guided: q(
      'P56-L01-G',
      [
        '把 2.5 m 改写成 cm，填写厘米数量。',
        'Convert 2.5 m to centimetres; enter the centimetre quantity.',
      ],
      '250',
      U,
      hints.U,
      [
        [
          '1 m=100 cm，2.5×100=250 cm；长度没变。',
          '1 m=100 cm, so 2.5×100=250 cm; length is unchanged.',
        ],
        [
          '250÷100=2.5 m，逆向核查。',
          '250÷100=2.5 m checks the conversion backwards.',
        ],
      ],
      ['25', '2500', '250 m'],
      'cm',
    ),
    questions: [
      c(
        'P56-L01-Q1',
        [
          '1 m² 改写成 cm²，为什么是 10000？',
          'Why is 1 m² equal to 10000 cm²?',
        ],
        2,
        U,
        [
          [
            [
              '所有单位都只乘 100',
              'Every unit conversion only multiplies by 100',
            ],
            [
              '面积有两个方向，不能只换一条边。',
              'Area has two directions, not one converted edge.',
            ],
          ],
          [
            ['把面积拉大一百倍', 'Enlarge the actual area a hundred times'],
            [
              '实际面积保持不变，只换计数单位。',
              'Actual area stays fixed; only the counting unit changes.',
            ],
          ],
          [
            [
              '两条边各一百个厘米，100×100',
              'Both edges have one hundred centimetres: 100×100',
            ],
            [
              '一百行各一百个单位正方形，共一万。',
              'One hundred rows of one hundred unit squares make ten thousand.',
            ],
          ],
        ],
        hints.U,
        [['1 m²=100 cm×100 cm=10000 cm²。', '1 m²=100 cm×100 cm=10000 cm².']],
      ),
      q(
        'P56-L01-Q2',
        ['1.2 m² 是多少 cm²？', 'Convert 1.2 m² to cm².'],
        '12000',
        U,
        hints.U,
        [
          [
            '每平方米一万平方厘米：1.2×10000=12000 cm²。',
            'Each square metre has ten thousand square centimetres: 1.2×10000=12000 cm².',
          ],
        ],
        ['120', '1200', '12000 cm³'],
        'cm²',
      ),
      q(
        'P56-L01-Q3',
        ['0.003 m³ 是多少 cm³？', 'Convert 0.003 m³ to cm³.'],
        '3000',
        U,
        hints.U,
        [
          [
            '每条棱一百倍，1 m³=100×100×100 cm³=1000000 cm³。',
            'Each edge contributes factor one hundred: 1 m³=1000000 cm³.',
          ],
          ['0.003×1000000=3000 cm³。', '0.003×1000000=3000 cm³.'],
        ],
        ['0.3', '30', '3000 cm²'],
        'cm³',
      ),
      q(
        'P56-L01-Q4',
        ['250 cm 改写成 m 是多少？', 'Convert 250 cm to metres.'],
        '2.5',
        U,
        hints.U,
        [
          [
            '单位变大，计数变小：250÷100=2.5 m。',
            'A larger unit needs a smaller count: 250÷100=2.5 m.',
          ],
        ],
        ['25', '25000', '2.5 cm'],
        'm',
      ),
      q(
        'P56-L01-Q5',
        [
          '已知 1 L=1000 cm³，0.6 L 是多少 cm³？',
          'Given 1 L=1000 cm³, convert 0.6 L to cm³.',
        ],
        '600',
        U,
        hints.U,
        [
          [
            '0.6×1000=600 cm³；两者均为体积单位。',
            '0.6×1000=600 cm³; both measure volume.',
          ],
        ],
        ['60', '0.0006', '600 cm²'],
        'cm³',
      ),
      r(
        'P56-L01-Q6',
        [
          '解释为何 1 m²=10000 cm²，1 m³=1000000 cm³，而不能把平方厘米直接换成厘米；同样大小的图不保证单位相同。',
          'Explain why 1 m²=10000 cm² and 1 m³=1000000 cm³, but square centimetres cannot directly convert to centimetres. Identical picture size does not guarantee identical units.',
        ],
        U,
        [
          '一条棱一百段，面积两个方向得一百乘一百，体积三个方向再乘一百。单位更小计数增多，实际量不变。平方单位与长度单位维度不同，需要额外长度或关系才可从面积求边长；图的屏幕缩放不决定单位。',
          'An edge has one hundred centimetre segments; area uses two factors and volume three. Smaller units increase the count without changing the quantity. Area and length have different dimensions; a length or relationship is needed to find an edge from area. Screen zoom does not determine units.',
        ],
        hints.U,
      ),
    ],
    exit: q(
      'P56-L01-X',
      ['2 L 是多少 mL？填写毫升数量。', 'Convert two litres to millilitres.'],
      '2000',
      U,
      hints.U,
      [['1 L=1000 mL，所以 2 L=2000 mL。', '1 L=1000 mL, so 2 L=2000 mL.']],
      ['200', '0.002', '2000 L'],
      'mL',
    ),
    exitReason: t(
      '在同类体积单位中改写数量，不把进率套错维度。',
      'Rewrite a volume in the requested unit without mixing dimensions.',
    ),
    parent: {
      goal: t(
        '孩子用方向数解释进率，不只移动小数点。',
        'The child explains factors through directions, not only decimal-point movement.',
      ),
      misconception: t(
        '长度、面积、体积进率都一样；图缩放等于实物改变。',
        'Using one factor for every dimension or treating screen zoom as a physical change.',
      ),
      prompts: [
        t(
          '每平方米为什么有一百行而不只一行？',
          'Why does a square metre have one hundred rows, not one?',
        ),
        t(
          '放大一个 dm³ 看 cm³，还是整个 m³ 吗？',
          'When zooming into one dm³, is it still the entire m³?',
        ),
      ],
      bridge: 'B05-L03',
    },
  }),
  lesson({
    id: 'P56-L02',
    title: t('长方形与正方形面积', 'Area of rectangles and squares'),
    objective: t(
      '由每行单位格与行数推导面积，统一边长单位，并区别覆盖面积与周长。',
      'Derive area from cells per row and rows, align edge units and distinguish coverage from perimeter.',
    ),
    prerequisites: ['P56-L01', 'B05-L03', 'B03-L03', 'P55-L04'],
    keywords: [
      t('单位正方形', 'unit square'),
      t('行与列', 'rows and columns'),
      t('面积', 'area'),
    ],
    minutes: 16,
    lab: 'geo-rectangle',
    hook: t(
      '六厘米乘四厘米的图有二十四格，边界却长二十厘米。为什么这两个数不能当作同一类量？',
      'A six-by-four-centimetre rectangle has twenty-four cells but twenty centimetres around. Why are these different quantities?',
    ),
    guided: q(
      'P56-L02-G',
      [
        '长方形长 6 cm、宽 4 cm，面积多少 cm²？',
        'A rectangle is 6 cm by 4 cm. What is its area in cm²?',
      ],
      '24',
      R,
      hints.R,
      [
        [
          '四行各六个 1 cm² 格：6×4=24 cm²。',
          'Four rows each contain six 1 cm² cells: 6×4=24 cm².',
        ],
      ],
      ['20', '10', '24 cm'],
      'cm²',
      rect(6, 4),
    ),
    questions: [
      c(
        'P56-L02-Q1',
        [
          '长方形面积为什么用长×宽？',
          'Why multiply length by width for rectangle area?',
        ],
        1,
        R,
        [
          [
            ['把两条边相加', 'Add two edges'],
            [
              '边长相加仍是长度，不数覆盖格。',
              'Adding edge lengths measures length, not covering cells.',
            ],
          ],
          [
            ['每行单位格数×行数', 'Cells per row times row count'],
            [
              '两方向单位相同，乘积计数单位正方形。',
              'The two compatible directions count covering unit squares.',
            ],
          ],
          [
            ['沿外边界走一圈', 'Walk around the boundary'],
            ['这求周长，不是面积。', 'That measures perimeter, not area.'],
          ],
        ],
        hints.R,
        [
          [
            '面积=每行格数×行数，单位为平方单位。',
            'Area=cells per row×rows, in square units.',
          ],
        ],
      ),
      q(
        'P56-L02-Q2',
        [
          '边长 5 cm 的正方形面积是多少？',
          'Find the area of a square with 5 cm edges.',
        ],
        '25',
        R,
        hints.R,
        [
          [
            '5×5=25 cm²；正方形两边相等。',
            '5×5=25 cm²; a square has equal adjacent edges.',
          ],
        ],
        ['20', '10', '25 cm'],
        'cm²',
        rect(5, 5),
      ),
      q(
        'P56-L02-Q3',
        [
          '长方形长 2.5 m、宽 1.2 m，面积多少 m²？',
          'Find the area in m² of a 2.5 m by 1.2 m rectangle.',
        ],
        '3',
        R,
        hints.R,
        [
          [
            '也可统一为 250 cm 与 120 cm，面积 30000 cm²。',
            'Alternatively use 250 cm and 120 cm, giving 30000 cm².',
          ],
          ['30000÷10000=3 m²。', '30000÷10000=3 m².'],
        ],
        ['3.7', '0.3', '3 m'],
        'm²',
      ),
      q(
        'P56-L02-Q4',
        [
          '长 4 m、宽 50 cm 的长方形，面积多少 m²？',
          'A rectangle is 4 m by 50 cm. Find area in m².',
        ],
        '2',
        R,
        hints.R,
        [
          [
            '50 cm=0.5 m，4×0.5=2 m²；不能直接 4×50 后写 m²。',
            '50 cm=0.5 m, so 4×0.5=2 m²; do not multiply 4×50 and label m².',
          ],
        ],
        ['200', '20', '2 cm²'],
        'm²',
      ),
      q(
        'P56-L02-Q5',
        [
          '长方形面积 20 cm²，宽 4 cm，长是多少厘米？',
          'A rectangle has area 20 cm² and width 4 cm. Find length in cm.',
        ],
        '5',
        R,
        [
          [
            '面积由长乘宽组成，未知长可用逆运算。',
            'Area is length times width; use an inverse for unknown length.',
          ],
          [
            '每行四格，共二十格，需几行？',
            'Four cells per row and twenty cells altogether: how many rows?',
          ],
        ],
        [['20÷4=5 cm，代回 5×4=20 cm²。', '20÷4=5 cm; check 5×4=20 cm².']],
        ['16', '24', '5 cm²'],
        'cm',
      ),
      r(
        'P56-L02-Q6',
        [
          '2 cm×4 cm 与 3 cm×3 cm 的周长都为 12 cm，面积相同吗？用格子与单位解释，不只说公式不同。',
          'A 2 cm by 4 cm rectangle and 3 cm by 3 cm square both have perimeter 12 cm. Do their areas agree? Explain using cells and units.',
        ],
        R,
        [
          '前者覆盖八格、后者九格，面积为八与九平方厘米。边界长度同为十二厘米不决定覆盖格数；长度与平方单位不能相互替代。可逐行数格来说明差异。',
          'They cover eight and nine unit squares respectively, so areas differ. Equal boundary length does not fix covering cell count. Length and square units are different quantities; count rows to explain the difference.',
        ],
        hints.R,
      ),
    ],
    exit: q(
      'P56-L02-X',
      [
        '长方形长 3 m、宽 0.8 m，面积多少 m²？',
        'Find the area in m² of a 3 m by 0.8 m rectangle.',
      ],
      '2.4',
      R,
      hints.R,
      [
        [
          '300 cm×80 cm=24000 cm²，改写为 2.4 m²。',
          '300 cm×80 cm=24000 cm², equal to 2.4 m².',
        ],
      ],
      ['3.8', '24', '2.4 m'],
      'm²',
    ),
    exitReason: t(
      '在小数边长情境中仍按单位格关系计算。',
      'Retain unit-square reasoning with decimal edge lengths.',
    ),
    parent: {
      goal: t(
        '孩子指出每行格数与行数，并说出平方单位。',
        'The child identifies rows and cells per row and names square units.',
      ),
      misconception: t(
        '周长当面积；厘米与米未对齐；正方形面积乘四。',
        'Confusing perimeter with area, mixed edge units or multiplying a square edge by four.',
      ),
      prompts: [
        t('旋转后格数变了吗？', 'Does rotation change cell count?'),
        t(
          '同周长怎样覆盖不同格数？',
          'How can equal perimeters cover different numbers of cells?',
        ),
      ],
      bridge: 'B05-L03',
    },
  }),
  lesson({
    id: 'P56-L03',
    title: t('三角形面积的拼接证明', 'Area of triangles by rearrangement'),
    objective: t(
      '用两个全等三角形和保面积切拼解释底乘垂直高的一半，包括高在延长线上的情形。',
      'Use two congruent triangles and area-preserving dissection to justify half base times perpendicular height, including an exterior altitude.',
    ),
    prerequisites: ['P56-L02', 'B05-L04', 'P54-L01'],
    keywords: [
      t('垂直高', 'perpendicular height'),
      t('全等复制', 'congruent copy'),
      t('保面积切拼', 'area-preserving dissection'),
    ],
    minutes: 18,
    lab: 'geo-triangle',
    hook: t(
      '三角形往旁边倾斜，高仍为四厘米，面积会随斜边变长吗？两份一样的三角形怎样变成能数格的矩形？',
      'If a triangle leans sideways but remains four centimetres high, does a longer slanted side change area? How can two identical copies make a measurable rectangle?',
    ),
    guided: q(
      'P56-L03-G',
      [
        '三角形底 6 cm、垂直高 4 cm，面积多少？',
        'A triangle has base 6 cm and perpendicular height 4 cm. Find its area.',
      ],
      '12',
      Tg,
      hints.T,
      [
        [
          '两份切拼成 6×4 的矩形，合计 24 cm²。',
          'Two copies rearrange into a 6×4 rectangle, area 24 cm².',
        ],
        ['原一份 24÷2=12 cm²。', 'One original copy has 24÷2=12 cm².'],
      ],
      ['24', '10', '12 cm'],
      'cm²',
      tri(6, 4, 2),
    ),
    questions: [
      c(
        'P56-L03-Q1',
        ['底×高后为什么除二？', 'Why divide base times height by two?'],
        0,
        Tg,
        [
          [
            [
              '矩形面积包含两份一样的三角形',
              'The rectangle contains two equal triangle copies',
            ],
            [
              '取其中一份面积，因此除二。',
              'Divide by two to recover one copy.',
            ],
          ],
          [
            [
              '三角形有三条边，所以随便少算一些',
              'It has three edges, so count a smaller amount',
            ],
            [
              '边数不是二分之一的依据。',
              'The number of edges does not justify the half factor.',
            ],
          ],
          [
            ['任何斜图都要除二', 'Every slanted shape needs halving'],
            [
              '平行四边形虽倾斜，面积仍为底乘垂直高。',
              'A slanted parallelogram still has base times height area.',
            ],
          ],
        ],
        hints.T,
        [
          [
            '两份全等图保面积拼切，才得到二倍关系。',
            'Congruent copies and area-preserving dissection justify the doubled area.',
          ],
        ],
      ),
      q(
        'P56-L03-Q2',
        [
          '底 5 cm、垂直高 3 cm，顶点在底的左侧，面积多少？',
          'Base is 5 cm and perpendicular height 3 cm, with the apex left of the base. Find area.',
        ],
        '7.5',
        Tg,
        hints.T,
        [
          [
            '高可落在底边延长线上，仍与底垂直。',
            'An altitude may meet the extended base and remain perpendicular.',
          ],
          [
            '5×3÷2=7.5 cm²，不截成七。',
            '5×3÷2=7.5 cm², without truncating to seven.',
          ],
        ],
        ['15', '7', '8'],
        'cm²',
        tri(5, 3, -1),
      ),
      q(
        'P56-L03-Q3',
        [
          '底 8 cm、垂直高 5 cm，一条斜边 6 cm。面积多少？',
          'Base is 8 cm, perpendicular height 5 cm and a slanted side 6 cm. Find area.',
        ],
        '20',
        Tg,
        hints.T,
        [
          [
            '用垂直高五，不用斜边六：8×5÷2=20 cm²。',
            'Use perpendicular height five, not slanted side six: 8×5÷2=20 cm².',
          ],
        ],
        ['24', '40', '14'],
        'cm²',
      ),
      q(
        'P56-L03-Q4',
        [
          '底 0.6 m、垂直高 0.5 m，面积多少 m²？',
          'Base is 0.6 m and perpendicular height 0.5 m. Find area in m².',
        ],
        '0.15',
        Tg,
        hints.T,
        [
          [
            '60 cm×50 cm÷2=1500 cm²，改写为 0.15 m²。',
            '60 cm×50 cm÷2=1500 cm², equal to 0.15 m².',
          ],
        ],
        ['0.3', '0.55', '15'],
        'm²',
      ),
      q(
        'P56-L03-Q5',
        [
          '面积 18 cm²、底 6 cm，垂直高是多少厘米？',
          'A triangle has area 18 cm² and base 6 cm. Find perpendicular height in cm.',
        ],
        '6',
        Tg,
        [
          [
            '先把一份面积加倍，得到同底高的矩形面积。',
            'Double the one-copy area to obtain the same-base-height rectangle area.',
          ],
          ['再用矩形面积除以底。', 'Divide that rectangle area by the base.'],
        ],
        [
          [
            '18×2÷6=6 cm，代回 6×6÷2=18 cm²。',
            '18×2÷6=6 cm; check 6×6÷2=18 cm².',
          ],
        ],
        ['3', '12', '6 cm²'],
        'cm',
      ),
      r(
        'P56-L03-Q6',
        [
          '解释为什么钝角三角形的高可在底边外侧，但底×高÷2 仍成立。为什么不能量顶点到某个底端的斜线当高？',
          'Explain why an obtuse triangle may have an exterior altitude but still use half base times height. Why not use the slanted distance to a base endpoint?',
        ],
        Tg,
        [
          '高是顶点到所在底直线的垂直距离，足点可在延长线上。两份全等图拼成平行四边形，再切拼矩形，不改变底与垂直高，总面积底乘高，一份为其一半。斜线含水平位移，长度不是两平行线间的垂直距离。',
          'Height is the perpendicular distance to the line containing the base; its foot may lie on an extension. Two congruent copies form a parallelogram, then rearrange into a same-base-height rectangle. One copy has half the rectangle area. A slanted endpoint distance includes horizontal displacement and is not perpendicular height.',
        ],
        hints.T,
      ),
    ],
    exit: q(
      'P56-L03-X',
      [
        '底 9 cm、垂直高 4 cm 的三角形，面积多少？',
        'Find area of a triangle with base 9 cm and perpendicular height 4 cm.',
      ],
      '18',
      Tg,
      hints.T,
      [
        [
          '9×4÷2=18 cm²；两份应为三十六。',
          '9×4÷2=18 cm²; two copies should have area thirty-six.',
        ],
      ],
      ['36', '13', '18 cm³'],
      'cm²',
    ),
    exitReason: t(
      '把切拼依据用于新底高，保留一份与两份的区别。',
      'Transfer the dissection argument to new measurements, distinguishing one copy from two.',
    ),
    parent: {
      goal: t(
        '孩子能说旋转和平移保留每份面积，另复制一份则让总面积加倍。',
        'The child explains that rotating and translating retain each copy’s area, while adding a copy doubles the total.',
      ),
      misconception: t(
        '斜边当高；忘除二；高在外侧就说公式失效；小数面积截断。',
        'Using a slanted side, omitting halving, rejecting exterior altitudes or truncating fractional area.',
      ),
      prompts: [
        t(
          '两份图组成的面积为什么不能当一份？',
          'Why is the pair’s area not the original’s area?',
        ),
        t(
          '顶点左右移动但底高不变时，哪些量变了？',
          'What changes when the apex moves sideways but base and height stay fixed?',
        ),
      ],
      bridge: 'P56-L02',
    },
  }),
  lesson({
    id: 'P56-L04',
    title: t('平行四边形与梯形面积', 'Area of parallelograms and trapezoids'),
    objective: t(
      '用保面积切拼与全等配对推导两种平行底图形的面积，识别垂直高和相等底的边界。',
      'Derive parallel-base areas by dissection and congruent pairing, identifying perpendicular height and the equal-base boundary.',
    ),
    prerequisites: ['P56-L02', 'P56-L03'],
    keywords: [
      t('平行底', 'parallel bases'),
      t('垂直距离', 'perpendicular separation'),
      t('配对', 'pairing'),
    ],
    minutes: 20,
    lab: 'geo-parallel-trapezoid',
    hook: t(
      '底和高不变，只把上边错移，面积会跟着斜边增长吗？两个梯形拼出的长底是哪两段组成？',
      'With fixed base and height, does shearing the top change area as the side grows? Which two bases form the long base of a trapezoid pair?',
    ),
    guided: q(
      'P56-L04-G',
      [
        '平行四边形底 6 cm、垂直高 4 cm，面积多少？',
        'A parallelogram has base 6 cm and perpendicular height 4 cm. Find area.',
      ],
      '24',
      P,
      hints.P,
      [
        [
          '沿高切下一块，平移补矩形，面积不变。',
          'Cut along a perpendicular and translate to a rectangle without changing area.',
        ],
        ['6×4=24 cm²。', '6×4=24 cm².'],
      ],
      ['12', '20', '24 cm'],
      'cm²',
      parallel(6, 4, 2),
    ),
    questions: [
      c(
        'P56-L04-Q1',
        [
          '底 6 cm、高 4 cm、斜边 5 cm 的平行四边形，哪个面积有依据？',
          'For a parallelogram of base 6 cm, perpendicular height 4 cm and slanted side 5 cm, which area is justified?',
        ],
        1,
        P,
        [
          [
            ['30 cm²', '30 cm²'],
            [
              '六乘五用了斜边，没有量垂直高。',
              'Six times five uses the slanted side, not perpendicular height.',
            ],
          ],
          [
            ['24 cm²', '24 cm²'],
            [
              '切拼矩形保留底六与垂直高四。',
              'Dissection retains base six and perpendicular height four.',
            ],
          ],
          [
            ['12 cm²', '12 cm²'],
            [
              '这里不是两份图的一半，不需除二。',
              'This is not half of a pair; no halving is needed.',
            ],
          ],
        ],
        hints.P,
        [['A=bh=6×4=24 cm²。', 'A=bh=6×4=24 cm².']],
      ),
      q(
        'P56-L04-Q2',
        [
          '底 8 cm、高 3 cm，上边向左错移，面积多少？',
          'Base is 8 cm, height 3 cm and the top is sheared left. Find area.',
        ],
        '24',
        P,
        hints.P,
        [
          [
            '错移保留底和垂直高：8×3=24 cm²。',
            'Shear retains base and perpendicular height: 8×3=24 cm².',
          ],
        ],
        ['12', '22', '11'],
        'cm²',
        parallel(8, 3, -2),
      ),
      q(
        'P56-L04-Q3',
        [
          '梯形上底 3 cm、下底 7 cm、高 4 cm，面积多少？',
          'A trapezoid has bases 3 cm and 7 cm, height 4 cm. Find area.',
        ],
        '20',
        P,
        hints.P,
        [
          [
            '两份拼成底 3+7=10、高四的图，面积四十。',
            'A pair has base 3+7=10 and height four, area forty.',
          ],
          ['一份 (3+7)×4÷2=20 cm²。', 'One copy: (3+7)×4÷2=20 cm².'],
        ],
        ['40', '42', '10'],
        'cm²',
        trap(3, 7, 4),
      ),
      q(
        'P56-L04-Q4',
        [
          '梯形两底 5 cm 与 8 cm，高 3 cm，面积多少？',
          'A trapezoid has bases 5 cm and 8 cm, height 3 cm. Find area.',
        ],
        '19.5',
        P,
        hints.P,
        [
          [
            '(5+8)×3÷2=19.5 cm²，不把底相乘。',
            '(5+8)×3÷2=19.5 cm²; add, not multiply, bases.',
          ],
        ],
        ['39', '60', '19'],
        'cm²',
      ),
      q(
        'P56-L04-Q5',
        [
          '平行四边形面积 35 cm²、高 5 cm，底多少厘米？',
          'A parallelogram has area 35 cm² and height 5 cm. Find base in cm.',
        ],
        '7',
        P,
        [
          [
            '切拼后的矩形面积也是三十五。',
            'The rearranged rectangle also has area thirty-five.',
          ],
          [
            '底乘高为面积，逆向除以高。',
            'Base times height is area; divide by height.',
          ],
        ],
        [['35÷5=7 cm；7×5=35 cm² 核查。', '35÷5=7 cm; check 7×5=35 cm².']],
        ['30', '40', '7 cm²'],
        'cm',
      ),
      r(
        'P56-L04-Q6',
        [
          '解释梯形面积为何用两底的和再乘高除二，而不是两底相乘。两底相等时，图形与公式有什么联系？',
          'Explain why trapezoid area uses the base sum times height, halved, rather than multiplying the bases. What happens when the parallel bases are equal?',
        ],
        P,
        [
          '两份全等梯形旋转拼成平行四边形，其底由原两底接成和，垂直高不变。再切拼矩形，总面积两底和乘高；一份除二。两平行底相等时是平行四边形，按狭义不称梯形，但同式化为底乘高，仍有效。',
          'A rotated congruent copy forms a parallelogram whose base joins the two original bases, with height unchanged. Dissection gives a rectangle with that base sum times height; halve for one copy. Equal parallel bases form a parallelogram, and the same expression reduces to base times height.',
        ],
        hints.P,
      ),
    ],
    exit: q(
      'P56-L04-X',
      [
        '梯形上底 6 cm、下底 10 cm、高 5 cm，面积多少？',
        'A trapezoid has bases 6 cm and 10 cm, height 5 cm. Find area.',
      ],
      '40',
      P,
      hints.P,
      [
        [
          '(6+10)×5÷2=40 cm²，两份合计八十。',
          '(6+10)×5÷2=40 cm²; a pair has area eighty.',
        ],
      ],
      ['80', '150', '40 cm³'],
      'cm²',
    ),
    exitReason: t(
      '在新尺寸中解释长底相加与配对二倍关系。',
      'Transfer the joined-base and doubled-copy argument to new dimensions.',
    ),
    parent: {
      goal: t(
        '孩子在图里指到矩形底和原来的高，并说明两底相加。',
        'The child identifies the rectangle base and original height and explains the base sum.',
      ),
      misconception: t(
        '斜边当高、梯形两底相乘、任何倾斜图都除二、相等底误判失效。',
        'Using slanted sides, multiplying bases, halving every slanted shape or rejecting the equal-base boundary.',
      ),
      prompts: [
        t(
          '错移改变斜边，为什么面积不变？',
          'Why does changing a slanted side by shear leave area fixed?',
        ),
        t(
          '两份梯形合成的长底是哪些段？',
          'Which segments form the long base of a trapezoid pair?',
        ),
      ],
      bridge: 'P56-L03',
    },
  }),
  lesson({
    id: 'P56-L05',
    title: t('长方体与正方体体积', 'Volume of rectangular prisms and cubes'),
    objective: t(
      '以每层单位立方体和层数推导体积，保留立方单位，并用内部尺寸判断容量。',
      'Derive volume from unit cubes per layer and layers, retain cubic units and use internal dimensions for capacity.',
    ),
    prerequisites: ['P56-L01', 'P56-L02', 'P55-L04'],
    keywords: [
      t('单位立方体', 'unit cube'),
      t('层', 'layer'),
      t('体积与容积', 'volume and capacity'),
    ],
    minutes: 18,
    lab: 'geo-volume',
    hook: t(
      '4×3×2 的积木，从正面数看见的块就是全部吗？一张底面面积图为什么还不能告诉你整块体积？',
      'In a 4×3×2 block, are the cubes visible from the front all the cubes? Why does bottom-face area alone not determine volume?',
    ),
    guided: q(
      'P56-L05-G',
      [
        '长 4 cm、宽 3 cm、高 2 cm 的长方体，体积多少？',
        'A prism is 4 cm by 3 cm by 2 cm. Find volume.',
      ],
      '24',
      V,
      hints.V,
      [
        [
          '每层 4×3=12 颗，两个单位高层。',
          'Each layer has 4×3=12 cubes, with two unit-height layers.',
        ],
        ['12×2=24 cm³。', '12×2=24 cm³.'],
      ],
      ['12', '9', '24 cm²'],
      'cm³',
      prism(4, 3, 2),
    ),
    questions: [
      c(
        'P56-L05-Q1',
        [
          '体积公式中的第三个方向表示什么？',
          'What does the third direction in the volume formula represent?',
        ],
        0,
        V,
        [
          [
            ['单位高的层数', 'The number of unit-height layers'],
            [
              '底层格数乘层数计数所有单位立方体。',
              'Cubes in a layer times layers counts every unit cube.',
            ],
          ],
          [
            ['沿外边界再绕一圈', 'Another trip around the boundary'],
            [
              '周长没有计算内部层数。',
              'Perimeter does not count internal layers.',
            ],
          ],
          [
            ['只数最上面一层', 'Only count the top layer'],
            [
              '最上层不能代替其他层和内部块。',
              'The top layer does not include other layers or inside cubes.',
            ],
          ],
        ],
        hints.V,
        [['V=每层立方体数×层数。', 'V=cubes per layer×layers.']],
      ),
      q(
        'P56-L05-Q2',
        [
          '棱长 3 cm 的正方体，体积多少？',
          'Find volume of a cube with 3 cm edges.',
        ],
        '27',
        V,
        hints.V,
        [
          [
            '3×3×3=27 cm³，不是三条边相加。',
            '3×3×3=27 cm³, not the sum of three edges.',
          ],
        ],
        ['9', '18', '27 cm²'],
        'cm³',
        prism(3, 3, 3),
      ),
      q(
        'P56-L05-Q3',
        [
          '理想长方体容器内部长 5 cm、宽 4 cm、高 3 cm。已知 1 cm³=1 mL，容量多少 mL？',
          'An ideal rectangular container has internal dimensions 5 cm, 4 cm, 3 cm. Given 1 cm³=1 mL, find capacity in mL.',
        ],
        '60',
        V,
        hints.V,
        [
          [
            '内部体积 5×4×3=60 cm³，因此 60 mL。',
            'Internal volume is 5×4×3=60 cm³, hence 60 mL.',
          ],
        ],
        ['20', '12', '60 cm²'],
        'mL',
        prism(5, 4, 3),
      ),
      q(
        'P56-L05-Q4',
        [
          '长方体长 0.5 m、宽 0.4 m、高 0.3 m，体积多少 m³？',
          'Find volume in m³ for a prism 0.5 m by 0.4 m by 0.3 m.',
        ],
        '0.06',
        V,
        hints.V,
        [
          [
            '先用厘米：50×40×30=60000 cm³。',
            'In centimetres: 50×40×30=60000 cm³.',
          ],
          ['60000÷1000000=0.06 m³。', '60000÷1000000=0.06 m³.'],
        ],
        ['0.6', '0.2', '0.06 m²'],
        'm³',
      ),
      q(
        'P56-L05-Q5',
        [
          '体积 84 cm³，长 7 cm、宽 4 cm，高是多少厘米？',
          'Volume is 84 cm³, length 7 cm and depth 4 cm. Find height in cm.',
        ],
        '3',
        V,
        [
          ['先求一层立方体数。', 'Find cubes in one layer first.'],
          [
            '总体积除每层对应量得到单位高层数。',
            'Divide total volume by the per-layer contribution to find layers.',
          ],
        ],
        [
          [
            '84÷(7×4)=3 cm；7×4×3=84 cm³。',
            '84÷(7×4)=3 cm; check 7×4×3=84 cm³.',
          ],
        ],
        ['12', '21', '3 cm³'],
        'cm',
      ),
      r(
        'P56-L05-Q6',
        [
          '某盒外部长 5 cm、宽 4 cm、高 3 cm。为什么不能没有其他资料就说它能装 60 mL？只数看到的外面小块又为什么不够？',
          'A box has external dimensions 5 cm, 4 cm, 3 cm. Why can capacity not be declared 60 mL without more information? Why is counting only visible outside cubes insufficient?',
        ],
        V,
        [
          '外部围成的几何体积为六十立方厘米，但容积需内部可容纳空间，壁厚或内尺寸未知，不能确定六十毫升。单位立方体层图包括被遮挡内部块；只数外面可见块会漏层或内部。',
          'The external bounding volume is sixty cubic centimetres, but capacity measures available internal space. Wall thickness or internal dimensions are missing, so sixty millilitres is not justified. Layer maps include occluded inside cubes; counting visible exterior cubes can miss layers or inside units.',
        ],
        hints.V,
      ),
    ],
    exit: q(
      'P56-L05-X',
      [
        '理想容器内部长 2 dm、宽 3 dm、高 4 dm。已知 1 dm³=1 L，容量多少升？',
        'An ideal container has internal dimensions 2 dm, 3 dm, 4 dm. Given 1 dm³=1 L, find capacity in litres.',
      ],
      '24',
      V,
      hints.V,
      [['2×3×4=24 dm³，改写为 24 L。', '2×3×4=24 dm³, equal to 24 L.']],
      ['9', '12', '24 mL'],
      'L',
      prism(2, 3, 4, 'dm'),
    ),
    exitReason: t(
      '在内部尺寸和分米单位中保持层计数及容量换算。',
      'Retain layer counting and capacity conversion with internal decimetre dimensions.',
    ),
    parent: {
      goal: t(
        '孩子能说每层多少、共几层，并识别内部尺寸。',
        'The child states cubes per layer, layer count and internal dimensions.',
      ),
      misconception: t(
        '只数可见块、面积当体积、只乘两棱、外部尺寸自动当容量。',
        'Counting only visible cubes, confusing area and volume, multiplying only two edges or using exterior dimensions as capacity.',
      ),
      prompts: [
        t(
          '图里没看见的内部块怎样查？',
          'How can you inspect hidden inside cubes?',
        ),
        t(
          '内部与外部尺寸为什么可能不同？',
          'Why may internal and external dimensions differ?',
        ),
      ],
      bridge: 'P56-L02',
    },
  }),
  lesson({
    id: 'P56-L06',
    title: t('表面积与包装盒', 'Surface area and packaging'),
    objective: t(
      '在可折叠展开图中逐面合计面积，区分无盖、面片预算和特定排版的纸张外接范围。',
      'Sum face areas on a foldable net and distinguish open tops, panel budgets and the bounding sheet for a chosen layout.',
    ),
    prerequisites: ['P56-L02', 'P56-L05', 'B06-L04'],
    keywords: [
      t('展开图', 'net'),
      t('表面积', 'surface area'),
      t('排版与余量', 'layout and allowance'),
    ],
    minutes: 20,
    lab: 'geo-surface',
    hook: t(
      '4×3×2 cm 盒体积二十四，包住六个面也只需二十四平方厘米吗？面片总面积五十二，保证五十二平方厘米的纸就能剪出这张网吗？',
      'A 4×3×2 cm box has volume twenty-four. Do its six faces need twenty-four square centimetres? If panels total fifty-two, does any fifty-two-square-centimetre sheet fit the net?',
    ),
    guided: q(
      'P56-L06-G',
      [
        '有盖长方体盒长 4 cm、宽 3 cm、高 2 cm，理想六面表面积多少？',
        'A closed box is 4 cm by 3 cm by 2 cm. Find ideal six-face surface area.',
      ],
      '52',
      S,
      hints.S,
      [
        [
          '前后各 4×2=8，左右各 3×2=6，顶底各 4×3=12 cm²。',
          'Front/back each 4×2=8, sides each 3×2=6, top/bottom each 4×3=12 cm².',
        ],
        ['2×(8+6+12)=52 cm²。', '2×(8+6+12)=52 cm².'],
      ],
      ['24', '26', '52 cm³'],
      'cm²',
      net(4, 3, 2),
    ),
    questions: [
      c(
        'P56-L06-Q1',
        [
          '包装六个面的面片面积，应该数什么？',
          'What should be counted for six wrapping panels?',
        ],
        1,
        S,
        [
          [
            ['内部所有单位小正方体', 'All unit cubes inside'],
            [
              '这是体积，不能作纸面面积。',
              'That measures volume, not panel area.',
            ],
          ],
          [
            ['外面六个面的单位正方形', 'Unit squares on the six outside faces'],
            [
              '每面两边相乘，六面相加。',
              'Multiply face edges, then sum six faces.',
            ],
          ],
          [
            ['只数三个看得见的面', 'Only three visible faces'],
            [
              '背面和底面仍需要面片，有三对相等面。',
              'Back and bottom still need panels; there are three equal pairs.',
            ],
          ],
        ],
        hints.S,
        [['表面积单位为 cm²，不是 cm³。', 'Surface area uses cm², not cm³.']],
      ),
      q(
        'P56-L06-Q2',
        [
          '同样 4×3×2 cm 盒去掉顶盖，五面面积多少？',
          'Remove the top from the same 4×3×2 cm box. Find five-face area.',
        ],
        '40',
        S,
        hints.S,
        [
          [
            '六面五十二，顶面 4×3=12：52−12=40 cm²。',
            'Six faces total fifty-two; top is 4×3=12: 52−12=40 cm².',
          ],
        ],
        ['52', '28', '40 cm³'],
        'cm²',
        net(4, 3, 2, false),
      ),
      q(
        'P56-L06-Q3',
        [
          '棱长 3 cm 的正方体，六面表面积多少？',
          'Find the six-face surface area of a cube with 3 cm edges.',
        ],
        '54',
        S,
        hints.S,
        [
          [
            '每面 3×3=9 cm²，共六面，6×9=54 cm²。',
            'Each face is 3×3=9 cm²; six faces give 54 cm².',
          ],
        ],
        ['27', '18', '54 cm³'],
        'cm²',
        net(3, 3, 3),
      ),
      q(
        'P56-L06-Q4',
        [
          '有盖长方体盒长 5 cm、宽 2 cm、高 3 cm，表面积多少？',
          'Find surface area of a closed 5 cm by 2 cm by 3 cm box.',
        ],
        '62',
        S,
        hints.S,
        [
          [
            '三对面积 5×2、5×3、2×3：2×(10+15+6)=62 cm²。',
            'Three pairs: 5×2, 5×3 and 2×3; 2×(10+15+6)=62 cm².',
          ],
        ],
        ['30', '31', '62 cm³'],
        'cm²',
        net(5, 2, 3),
      ),
      q(
        'P56-L06-Q5',
        [
          '六面面片预算 52 cm²，另明确留 6 cm² 接缝。按题给预算，合计面积多少？不保证任意形状的纸都可裁出。',
          'Panels are budgeted at 52 cm², plus a specified 6 cm² for seams. What is the total area budget? This does not guarantee any sheet shape fits.',
        ],
        '58',
        S,
        hints.S,
        [
          [
            '52+6=58 cm²；裁切排版还需纸的形状与尺寸。',
            '52+6=58 cm²; cutting layout also needs sheet shape and dimensions.',
          ],
        ],
        ['46', '52', '58 cm³'],
        'cm²',
      ),
      r(
        'P56-L06-Q6',
        [
          '本模型六面总面积 52 cm²，这张网外接长方形为 14 cm×8 cm。为什么面片总数不能保证任意 52 cm² 纸可裁成盒？其他排版一定也要 112 cm² 吗？',
          'Panels total 52 cm², but this net’s bounding rectangle is 14 cm by 8 cm. Why does the panel sum not guarantee that any 52 cm² sheet fits? Must every other layout also need 112 cm²?',
        ],
        S,
        [
          '这张网的外接矩形为一百一十二平方厘米，包含空白裁切区；面片五十二不等于所选排版的矩形纸面积。实际还可能需接缝或余量。不同网和排版可改变外接尺寸，不能把本图的一百一十二说成所有方案的最小面积。需知道纸形状、尺寸、排版和余量。',
          'This net’s 112 cm² bounding rectangle includes empty cutting regions. Its 52 cm² panel sum differs from the rectangular sheet area for this layout. Seams may need more. Other nets and layouts may change bounds, so 112 is not a universal minimum. Sheet shape, dimensions, layout and allowances are needed.',
        ],
        hints.S,
      ),
    ],
    exit: q(
      'P56-L06-X',
      [
        '理想有盖长方体外部长 1.5 m、宽 1 m、高 0.5 m，六面表面积多少 m²？不计接缝。',
        'An ideal closed prism has external dimensions 1.5 m, 1 m, 0.5 m. Find six-face surface area in m², excluding seams.',
      ],
      '5.5',
      S,
      hints.S,
      [
        [
          '用厘米：三对为 150×100、150×50、100×50；合计 55000 cm²。',
          'In cm, three pairs are 150×100, 150×50 and 100×50, totalling 55000 cm².',
        ],
        ['55000÷10000=5.5 m²。', '55000÷10000=5.5 m².'],
      ],
      ['0.75', '2.75', '5.5 m³'],
      'm²',
    ),
    exitReason: t(
      '以一致单位逐面核算，保留表面积与体积、实际用纸的差异。',
      'Sum faces in consistent units while distinguishing surface area, volume and actual paper requirements.',
    ),
    parent: {
      goal: t(
        '孩子在网中找每一面，不漏背面，说明纸张排版与面片总量不同。',
        'The child locates all faces, includes hidden faces and distinguishes sheet layout from panel sum.',
      ),
      misconception: t(
        '体积当面积、无盖少两面、三可见面当全部、表面积直接当任意矩形纸需求。',
        'Using volume as area, removing two faces for an open top, counting only visible faces or treating surface area as any sheet’s requirement.',
      ),
      prompts: [
        t('无盖只去掉哪个面？', 'Which single face disappears without a lid?'),
        t(
          '网外接矩形里的空白算盒表面积吗？',
          'Do blank areas in the bounding rectangle count as box surface area?',
        ),
      ],
      bridge: 'P56-L02',
    },
    familyChallenge: t(
      '只画或在屏幕指认，不需剪或买材料：4×3×2 cm 的理想盒有两面十二、两面八、两面六平方厘米，合计五十二。体积是二十四立方厘米。去顶盖少十二得四十。观察本图十四乘八的外接纸框一百一十二平方厘米，解释空白裁切区与面片的差异，不宣称所有排版都需同样纸张。',
      'Draw or point on screen only; no cutting or purchase is required. The ideal 4×3×2 cm box has two faces of twelve, two of eight and two of six cm², totalling fifty-two. Volume is twenty-four cm³. Removing the top subtracts twelve, leaving forty. Explain why this layout’s 14×8 bounding frame of 112 cm² includes blank cutting regions, without claiming every layout uses the same sheet.',
    ),
  }),
];
export const p56CheckQuestions: Question[] = [
  q(
    'P56-CHECK-Q1',
    ['0.04 m² 改写成多少 cm²？', 'Convert 0.04 m² to cm².'],
    '400',
    U,
    hints.U,
    [['0.04×10000=400 cm²。', '0.04×10000=400 cm².']],
    ['4', '40', '400 cm³'],
    'cm²',
  ),
  q(
    'P56-CHECK-Q2',
    [
      '长方形长 8 cm、宽 5 cm，面积多少？',
      'Find area of an 8 cm by 5 cm rectangle.',
    ],
    '40',
    R,
    hints.R,
    [['8×5=40 cm²。', '8×5=40 cm².']],
    ['26', '13', '40 cm'],
    'cm²',
    rect(8, 5),
  ),
  q(
    'P56-CHECK-Q3',
    [
      '三角形底 7 cm、垂直高 5 cm，面积多少？',
      'Find area of a triangle with base 7 cm and perpendicular height 5 cm.',
    ],
    '17.5',
    Tg,
    hints.T,
    [['7×5÷2=17.5 cm²。', '7×5÷2=17.5 cm².']],
    ['35', '12', '17'],
    'cm²',
    tri(7, 5, -1),
  ),
  q(
    'P56-CHECK-Q4',
    [
      '梯形两底 4 cm、8 cm，高 5 cm，面积多少？',
      'Find area of a trapezoid with bases 4 cm and 8 cm, height 5 cm.',
    ],
    '30',
    P,
    hints.P,
    [['(4+8)×5÷2=30 cm²。', '(4+8)×5÷2=30 cm².']],
    ['60', '80', '30 cm³'],
    'cm²',
    trap(4, 8, 5),
  ),
  c(
    'P56-CHECK-Q5',
    [
      '把 1 m³ 改写成 cm³，要用哪个进率？',
      'Which factor converts 1 m³ to cm³?',
    ],
    2,
    U,
    [
      [
        ['100', '100'],
        ['只换一方向。', 'This converts only one direction.'],
      ],
      [
        ['10000', '10000'],
        ['这是面积的两方向进率。', 'That is the two-direction area factor.'],
      ],
      [
        ['1000000', '1000000'],
        [
          '三方向各一百：100×100×100。',
          'Three directions of one hundred: 100×100×100.',
        ],
      ],
    ],
    hints.U,
    [
      [
        '体积每条棱换算后相乘。',
        'Multiply conversion factors for all three edges.',
      ],
    ],
  ),
  q(
    'P56-CHECK-Q6',
    [
      '长方体长 5 cm、宽 3 cm、高 2 cm，体积多少？',
      'Find volume of a 5 cm by 3 cm by 2 cm prism.',
    ],
    '30',
    V,
    hints.V,
    [
      [
        '每层十五，两层三十：5×3×2=30 cm³。',
        'Fifteen per layer and two layers: 5×3×2=30 cm³.',
      ],
    ],
    ['15', '10', '30 cm²'],
    'cm³',
    prism(5, 3, 2),
  ),
  q(
    'P56-CHECK-Q7',
    [
      '5×3×2 cm 盒无顶盖，五面面积多少？',
      'Find the five-face area of an open-top 5×3×2 cm box.',
    ],
    '47',
    S,
    hints.S,
    [
      [
        '六面 2×(15+10+6)=62，减顶面十五得 47 cm²。',
        'Six faces total 2×(15+10+6)=62; subtract top fifteen to get 47 cm².',
      ],
    ],
    ['62', '32', '47 cm³'],
    'cm²',
    net(5, 3, 2, false),
  ),
  r(
    'P56-CHECK-Q8',
    [
      '一个盒的表面积、体积和实际包装纸需求为什么不能只看同一个数？说明各自单位、所需尺寸与额外资料。',
      'Why cannot surface area, volume and actual wrapping-paper requirements be determined from one interchangeable number? Explain units, dimensions and extra information.',
    ],
    S,
    [
      '表面积是面片平方单位，体积是单位立方体层数对应的立方单位，容量需内部尺寸。实际纸张还要网的排版、纸的形状尺寸、接缝和裁切余量。相同数值或同样缩放图不让单位维度变成同一种量。',
      'Surface area counts square-unit panels; volume counts cubic units through layers, while capacity needs internal dimensions. Real paper also needs net layout, sheet shape and dimensions, seams and cutting allowances. Equal numerical values or equal display scale do not make different dimensions interchangeable.',
    ],
    hints.S,
  ),
];
export function p56ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative safe-integer round');
  const index = p56Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new Error(`Unknown P56 lesson ${id}`);
  const k = round % 80;
  if (index === 0) {
    const pairs: [GeoUnit, GeoUnit][] = [
      ['m', 'cm'],
      ['cm', 'm'],
      ['m²', 'cm²'],
      ['cm²', 'm²'],
      ['m³', 'cm³'],
      ['L', 'mL'],
      ['cm³', 'L'],
      ['mL', 'cm³'],
    ];
    const [from, to] = pairs[k % 8]!,
      amount = String((1 + Math.floor(k / 8)) / 4),
      value = conversionText(convertGeometryUnit(amount, from, to));
    return q(
      `${id}-R${round}`,
      [
        `把 ${amount} ${from} 改写为 ${to} 的数量。`,
        `Convert ${amount} ${from} to ${to}.`,
      ],
      value,
      U,
      hints.U,
      [
        [
          `同类量保持实际量：${amount} ${from}=${value} ${to}。`,
          `Retain the same quantity: ${amount} ${from}=${value} ${to}.`,
        ],
      ],
      ['-1', '0/0'],
      to,
    );
  }
  const w = 2 + (k % 5),
    d = 2 + (Math.floor(k / 5) % 4),
    h = 2 + (Math.floor(k / 20) % 4);
  if (index === 1)
    return q(
      `${id}-R${round}`,
      [
        `长方形长 ${w} cm、宽 ${d} cm，面积多少？`,
        `Rectangle ${w} cm by ${d} cm: find area.`,
      ],
      String(w * d),
      R,
      hints.R,
      [[`${w}×${d}=${w * d} cm²。`, `${w}×${d}=${w * d} cm².`]],
      [String(2 * (w + d) === w * d ? w * d + 1 : 2 * (w + d)), '0/0'],
      'cm²',
      rect(w, d),
    );
  if (index === 2)
    return q(
      `${id}-R${round}`,
      [
        `三角形底 ${w} cm、垂直高 ${d} cm，面积多少？`,
        `Triangle base ${w} cm, perpendicular height ${d} cm: find area.`,
      ],
      String((w * d) / 2),
      Tg,
      hints.T,
      [[`${w}×${d}÷2=${(w * d) / 2} cm²。`, `${w}×${d}÷2=${(w * d) / 2} cm².`]],
      [String(w * d), '0/0'],
      'cm²',
      tri(w, d, k % 2 ? -1 : 1),
    );
  if (index === 3) {
    const trapezoid = k % 2 === 1,
      value = trapezoid ? ((w + d) * h) / 2 : w * h;
    return q(
      `${id}-R${round}`,
      trapezoid
        ? [
            `${w === d ? '两底相等的平行四边形' : '梯形'}上底 ${w} cm、下底 ${d} cm、高 ${h} cm，面积多少？`,
            `Parallel-base quadrilateral with bases ${w} cm and ${d} cm, height ${h} cm: find area.`,
          ]
        : [
            `平行四边形底 ${w} cm、垂直高 ${h} cm，面积多少？`,
            `Parallelogram base ${w} cm, perpendicular height ${h} cm: find area.`,
          ],
      String(value),
      P,
      hints.P,
      [
        [
          trapezoid
            ? `(${w}+${d})×${h}÷2=${value} cm²。`
            : `${w}×${h}=${value} cm²。`,
          trapezoid
            ? `(${w}+${d})×${h}÷2=${value} cm².`
            : `${w}×${h}=${value} cm².`,
        ],
      ],
      ['0/0', String(value + 1)],
      'cm²',
      trapezoid ? trap(w, d, h, 1) : parallel(w, h, (k % 3) - 1),
    );
  }
  if (index === 4)
    return q(
      `${id}-R${round}`,
      [
        `长方体长 ${w} cm、宽 ${d} cm、高 ${h} cm，体积多少？`,
        `Prism ${w} cm by ${d} cm by ${h} cm: find volume.`,
      ],
      String(w * d * h),
      V,
      hints.V,
      [
        [
          `${w}×${d}×${h}=${w * d * h} cm³。`,
          `${w}×${d}×${h}=${w * d * h} cm³.`,
        ],
      ],
      [String(w * d), `${w * d * h} cm²`],
      'cm³',
      prism(w, d, h),
    );
  const lid = k % 2 === 0,
    value = 2 * (w * d + w * h + d * h) - (lid ? 0 : w * d);
  return q(
    `${id}-R${round}`,
    [
      `${w}×${d}×${h} cm 的${lid ? '有盖' : '无盖'}盒，面片面积多少？`,
      `${w}×${d}×${h} cm ${lid ? 'closed' : 'open-top'} box: find panel area.`,
    ],
    String(value),
    S,
    hints.S,
    [
      [
        `${lid ? '六面' : '五面'}合计 ${value} cm²。`,
        `${lid ? 'Six' : 'Five'} faces total ${value} cm².`,
      ],
    ],
    ['0/0', `${value} cm³`],
    'cm²',
    net(w, d, h, lid),
  );
}
