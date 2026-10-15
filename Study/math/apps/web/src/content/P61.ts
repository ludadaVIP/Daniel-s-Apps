import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
const skills = [
  'repeat-fraction',
  'fraction-area-product',
  'fraction-of-amount',
  'fraction-sharing',
  'fraction-measurement-division',
  'reciprocal-reasoning',
];
const hints: [Pair, Pair][] = [
  [
    [
      '先说有几组、每组几分之几，完整一条代表什么。',
      'Name the group count, the fraction in each and the reference whole.',
    ],
    [
      '把相同分数相加，分母标记的每份大小不改变。',
      'Add identical fractions while preserving the part size named by the denominator.',
    ],
  ],
  [
    [
      '两个方向各分多少等份？找同时被选中的交叠。',
      'How many equal parts in each direction? Find the overlap selected in both.',
    ],
    [
      '每个原整体的总小格数来自分母相乘，交叠来自分子相乘。',
      'Cells per original whole come from multiplying denominators; overlap comes from multiplying numerators.',
    ],
  ],
  [
    [
      '先确定本题的整体是多少，再用分母把总量等分。',
      'Identify the actual whole amount, then divide it into denominator-many shares.',
    ],
    [
      '取分子那么多份；分数无单位，实际量的单位保留。',
      'Take numerator-many shares. The fraction has no unit; the measured amount keeps its unit.',
    ],
  ],
  [
    [
      '保持原总水量，只把每个已有小份再平均分给人数。',
      'Keep total water fixed and subdivide each existing part among the people.',
    ],
    [
      '每份再分人数份，分母乘人数；把每人的量乘回人数核查。',
      'Subdivide each part by the number of people, multiplying the denominator; multiply shares back to check.',
    ],
  ],
  [
    [
      '问的是精确份数、装满份数，还是剩余升数？先分清对象。',
      'Identify whether the question asks exact groups, complete groups or remaining litres.',
    ],
    [
      '把两种升数化成相同小份，比较总小份数与每份小份数。',
      'Use identical small litre pieces and compare total pieces with pieces per group.',
    ],
  ],
  [
    [
      '先用同样小份解释相除，再找与除数相乘得一的数。',
      'First explain division using equal small pieces; then find what multiplies the divisor to make one.',
    ],
    [
      '翻转除数而不是被除数，最后用商乘原除数恢复总量；不能除零。',
      'Invert the divisor, not the dividend. Multiply the quotient by the original divisor to restore the amount; never divide by zero.',
    ],
  ],
];
function q(
  id: string,
  stem: Pair,
  value: string | number,
  index: number,
  steps: Pair[],
  wrong: string[],
  unit?: Unit,
  diagram?: Question['diagram'],
): Question {
  const raw = String(value),
    [n, d] = exactRational(raw)!;
  const item = numeric(
    id,
    T(stem),
    raw,
    skills[index]!,
    hints[index]!.map(T),
    steps.map(T),
    {
      accepted: [
        raw,
        `${n * 2n}/${d * 2n}`,
        ...(unit ? [`${raw} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram,
  );
  item.answer = {
    kind: 'number',
    value: raw,
    unit,
    formats: ['decimal', 'fraction'],
  };
  item.type = diagram ? 'visual_select' : unit ? 'word_problem' : 'fraction';
  item.misconceptionTags = [
    skills[index]!,
    'reference-whole',
    'representation',
    ...(unit ? ['reading-units'] : []),
  ];
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  index: number,
  options: [Pair, Pair][],
  steps: Pair[],
) {
  return choice(
    id,
    T(stem),
    correct,
    skills[index]!,
    options.map(([text, feedback]) => ({
      text: T(text),
      feedback: T(feedback),
    })),
    hints[index]!.map(T),
    steps.map(T),
  );
}
const r = (id: string, stem: Pair, index: number, rubric: Pair) =>
  reasoning(id, T(stem), skills[index]!, T(rubric), hints[index]!.map(T));
const repeat = (count: number, n: number, d: number): Question['diagram'] => ({
  kind: 'product-repeat',
  count,
  part: { n, d },
});
const area = (
  a: number,
  b: number,
  c: number,
  d: number,
): Question['diagram'] => ({
  kind: 'product-area',
  left: { n: a, d: b },
  right: { n: c, d },
});
const share = (n: number, d: number, people: number): Question['diagram'] => ({
  kind: 'product-share',
  amount: { n, d },
  people,
  stage: 2,
});
const groups = (
  a: number,
  b: number,
  c: number,
  d: number,
): Question['diagram'] => ({
  kind: 'product-groups',
  amount: { n: a, d: b },
  group: { n: c, d },
});
const lesson = (l: Lesson): Lesson => ({
  ...l,
  stage: 'P06',
  unit: 'P61',
  order: Number(l.id.slice(-2)),
  skillTags: [...new Set(l.questions.map((q) => q.skill))],
  nzYearHints: [6, 7],
  cnGradeHints: [6],
  contentStatus: 'ready',
});
export const p61Lessons: Lesson[] = [
  lesson({
    id: 'P61-L01',
    title: t('整数乘分数的图示', 'Whole number times a fraction visually'),
    objective: t(
      '把整数乘分数解释为相同分数量的重复相加，并保持原整体不变。',
      'Explain whole-number multiplication of a fraction as repeated equal amounts while retaining the reference whole.',
    ),
    prerequisites: ['P53-L02', 'P54-L01', 'B02-L02'],
    keywords: [
      t('等组', 'equal groups'),
      t('单位分数', 'unit fraction'),
      t('重复相加', 'repeated addition'),
    ],
    minutes: 16,
    lab: 'product-repeat',
    hook: t(
      '每壶 3/4 L，三壶合在一起。为什么不是 9/12 L？三条图合起来会把“一升”也改大吗？',
      'Three jugs each hold 3/4 L. Why is the total not 9/12 L? Does combining three strips change the meaning of one litre?',
    ),
    guided: q(
      'P61-L01-G',
      [
        '三组每组 3/4 L，合计多少升？',
        'Three groups each contain 3/4 L. How many litres altogether?',
      ],
      '9/4',
      0,
      [
        [
          '3/4+3/4+3/4=9/4 L，每小份始终是 1/4 L。',
          '3/4+3/4+3/4=9/4 L; every small part stays 1/4 L.',
        ],
        [
          '9/4=2.25 L，超过两升但未到三升。',
          '9/4=2.25 L, between two and three litres.',
        ],
      ],
      ['9/12', '3/4', '9'],
      'L',
      repeat(3, 3, 4),
    ),
    questions: [
      c(
        'P61-L01-Q1',
        [
          '4×2/3 中，为什么分母仍是三？',
          'Why does the denominator stay three in 4×2/3?',
        ],
        1,
        0,
        [
          [
            [
              '乘四就把整体改为四倍大',
              'Multiplication redefines the whole four times larger',
            ],
            [
              '单位整体固定，不能偷偷改尺。',
              'The unit whole stays fixed; do not change the scale.',
            ],
          ],
          [
            [
              '仍在数同样大小的三分之一',
              'We still count parts of size one third',
            ],
            [
              '四组各两个三分之一，共八个三分之一。',
              'Four groups of two thirds contain eight one-third parts.',
            ],
          ],
          [
            [
              '所有分数运算都不能改分母',
              'No fraction operation ever changes a denominator',
            ],
            [
              '其他运算可能需要细分；这里是相同小份重复相加。',
              'Other operations may refine parts; here identical parts are repeatedly added.',
            ],
          ],
        ],
        [['4×2/3=8/3，而不是 8/12。', '4×2/3=8/3, not 8/12.']],
      ),
      q(
        'P61-L01-Q2',
        ['计算 4×2/3。', 'Calculate 4×2/3.'],
        '8/3',
        0,
        [
          [
            '四次各两个三分之一，合计八个三分之一。',
            'Four lots of two thirds make eight thirds.',
          ],
        ],
        ['8/12', '2/3', '6/3'],
        undefined,
        repeat(4, 2, 3),
      ),
      q(
        'P61-L01-Q3',
        [
          '每组有 5/4 L，两组共有多少升？',
          'Each group has 5/4 L. How many litres in two groups?',
        ],
        '5/2',
        0,
        [
          [
            '2×5/4=10/4=5/2 L；每组本身超过一升。',
            '2×5/4=10/4=5/2 L; each group already exceeds one litre.',
          ],
        ],
        ['10/8', '5/4', '10'],
        'L',
        repeat(2, 5, 4),
      ),
      q(
        'P61-L01-Q4',
        [
          '零组，每组可装 7/8 L，实际加入的水共多少升？',
          'There are zero groups; each could hold 7/8 L. How many litres are actually added?',
        ],
        0,
        0,
        [['没有加入任何组：0×7/8=0 L。', 'No groups are added: 0×7/8=0 L.']],
        ['7/8', '1', '7'],
        'L',
      ),
      q(
        'P61-L01-Q5',
        [
          '五段彩带各长 1/6 m，排在一起总长多少米？',
          'Five ribbons each measure 1/6 m. Find their total length in metres.',
        ],
        '5/6',
        0,
        [
          [
            '5×1/6=5/6 m；合计五个六分之一米。',
            '5×1/6=5/6 m, five one-sixth-metre parts.',
          ],
        ],
        ['5/30', '1/6', '6'],
        'm',
      ),
      r(
        'P61-L01-Q6',
        [
          '有人说 3×3/4=9/12，因为“分子分母都乘三”。指出他改变了什么，并用固定一升标尺解释正确总量。',
          'Someone claims 3×3/4=9/12 by multiplying numerator and denominator by three. What did they change? Explain the correct total using a fixed one-litre reference.',
        ],
        0,
        [
          '分子分母同乘三只是把同一个 3/4 细分成 9/12，并未加入三份水。三组各三个四分之一，共九个四分之一，量为 9/4 L。完整一条始终是一升；结果超过两升，而 9/12 只有不到一升，估量也能发现矛盾。',
          'Multiplying both numerator and denominator by three only refines the same 3/4 into 9/12; it does not add three quantities. Three groups of three quarter-litres contain nine quarters, or 9/4 L. A complete reference strip stays one litre. The total exceeds two litres, whereas 9/12 is below one, exposing the mismatch.',
        ],
      ),
    ],
    exit: q(
      'P61-L01-X',
      [
        '四壶各有 3/8 L，合计多少升？',
        'Four jugs each contain 3/8 L. How many litres altogether?',
      ],
      '3/2',
      0,
      [['4×3/8=12/8=3/2 L。', '4×3/8=12/8=3/2 L.']],
      ['12/32', '3/8', '12'],
      'L',
    ),
    exitReason: t(
      '说明相同小份的大小为何没有随组数改变。',
      'Explain why equal-part size does not change with the number of groups.',
    ),
    parent: {
      goal: t(
        '孩子数相同单位分数，而不同时扩大整体。',
        'The learner counts identical unit-fraction parts without enlarging the reference whole.',
      ),
      misconception: t(
        '整数也乘进分母；把图条合计重新当作一；遗漏零组。',
        'Multiplying the denominator too, redefining all strips as one, or mishandling zero groups.',
      ),
      prompts: [
        t(
          '每个小格仍是几分之一升？',
          'What fraction of a litre is each small part still?',
        ),
        t(
          '结果应该比一壶多还是少？',
          'Should the total exceed one jug’s amount?',
        ),
      ],
      bridge: 'P54-L01',
    },
  }),
  lesson({
    id: 'P61-L02',
    title: t('分数乘分数的面积模型', 'Fraction times fraction using area'),
    objective: t(
      '用两个方向的等分与交叠解释分数乘法，保持原整体和每格面积。',
      'Explain fraction multiplication through two-direction subdivision and overlap while retaining the original whole and cell area.',
    ),
    prerequisites: ['P61-L01', 'P53-L04', 'P56-L02'],
    keywords: [
      t('交叠', 'overlap'),
      t('面积份额', 'area fraction'),
      t('因数', 'factor'),
    ],
    minutes: 18,
    lab: 'product-area',
    hook: t(
      '先选原整体的 2/3，再取其中 3/4；为什么结果反而小于 2/3？图上交叠的格子该相加还是相乘？',
      'Select 2/3 of a whole, then take 3/4 of that selection. Why is the result below 2/3? How do overlapping grid cells explain the calculation?',
    ),
    guided: q(
      'P61-L02-G',
      [
        '求 2/3×3/4，结果是原整体的几分之几？',
        'Find 2/3×3/4 as a fraction of the original whole.',
      ],
      '1/2',
      1,
      [
        [
          '三列四行，每个原整体十二个同面积格；交叠 2×3=6 格。',
          'Three columns by four rows give twelve equal-area cells per original whole; 2×3=6 overlap.',
        ],
        [
          '6/12=1/2；没有把两份面积直接相加。',
          '6/12=1/2; the operation is not addition of two separate selections.',
        ],
      ],
      ['5/7', '6/7', '3/4'],
      undefined,
      area(2, 3, 3, 4),
    ),
    questions: [
      c(
        'P61-L02-Q1',
        [
          '面积图为何用两个分母的乘积作每整体小格数？',
          'Why does the product of denominators count cells per original whole?',
        ],
        0,
        1,
        [
          [
            [
              '一个方向分列，另一个方向分行',
              'One direction makes columns and the other rows',
            ],
            [
              '每列都有相同的行数，等面积格总数为列数乘行数。',
              'Each column contains the same rows; cells per whole are columns times rows.',
            ],
          ],
          [
            [
              '因为分数乘法要把分母相加',
              'Because multiplying fractions adds denominators',
            ],
            [
              '相加没有计数二维分割。',
              'Adding does not count the two-direction partition.',
            ],
          ],
          [
            [
              '把所有扩大后的画面重新当一',
              'Redefine the entire expanded drawing as one',
            ],
            [
              '超过一时仍保留原来的单位框。',
              'When the drawing extends beyond one, retain original unit frames.',
            ],
          ],
        ],
        [
          [
            '分母相乘来自二维等分，不是任选一个分母。',
            'Multiplying denominators follows the two-direction partition.',
          ],
        ],
      ),
      q(
        'P61-L02-Q2',
        ['计算 1/2×2/5。', 'Calculate 1/2×2/5.'],
        '1/5',
        1,
        [
          [
            '交叠 1×2=2 格，每原整体 2×5=10 格，2/10=1/5。',
            'Two overlap cells among ten per original whole give 2/10=1/5.',
          ],
        ],
        ['3/7', '2/7', '1/2'],
        undefined,
        area(1, 2, 2, 5),
      ),
      q(
        'P61-L02-Q3',
        ['计算 3/4×4/5。', 'Calculate 3/4×4/5.'],
        '3/5',
        1,
        [['3×4/(4×5)=12/20=3/5。', '3×4/(4×5)=12/20=3/5.']],
        ['7/9', '12/9', '3/4'],
      ),
      q(
        'P61-L02-Q4',
        [
          '原选择为 2/3，再取其中零份，0×2/3 等于多少？',
          'Take zero of a 2/3 selection. Find 0×2/3.',
        ],
        0,
        1,
        [
          [
            '横纵没有交叠被选量，乘积为零。',
            'There is no doubly selected overlap; the product is zero.',
          ],
        ],
        ['2/3', '1', '2'],
        undefined,
        area(0, 1, 2, 3),
      ),
      q(
        'P61-L02-Q5',
        [
          '计算 5/4×2/3，仍以原单位框为整体。',
          'Calculate 5/4×2/3 using the original unit frame as the whole.',
        ],
        '5/6',
        1,
        [
          [
            '图跨过一个原整体，仍每整体十二格，交叠十格。',
            'The drawing extends beyond one original whole; each whole still has twelve cells and ten overlap.',
          ],
          [
            '10/12=5/6，不能把扩大的外框当一。',
            '10/12=5/6; do not redefine the expanded outside frame as one.',
          ],
        ],
        ['7/7', '10/7', '5/12'],
        undefined,
        area(5, 4, 2, 3),
      ),
      r(
        'P61-L02-Q6',
        [
          '“乘法一定使数变大”对分数还成立吗？用 2/3×3/4 和乘以一、零的情形说明，别只说记住公式。',
          'Does multiplication always make a number larger? Explain 2/3×3/4 and multiplication by one or zero rather than merely citing a rule.',
        ],
        1,
        [
          '对正数，乘小于一且大于零的分数只取原量一部分，2/3 的 3/4 为 1/2，小于 2/3；乘一保留全部，乘零没有任何量。乘大于一可增加，方向由因数与一的关系决定，不由运算名称决定。面积交叠给出原量内的实际选择。',
          'For a positive amount, multiplying by a fraction strictly between zero and one selects only part of it: 3/4 of 2/3 is 1/2, below 2/3. Multiplying by one retains all, and by zero retains none. A factor above one can enlarge the amount; compare the factor with one rather than relying on the operation’s name.',
        ],
      ),
    ],
    exit: q(
      'P61-L02-X',
      ['计算 3/5×5/6。', 'Calculate 3/5×5/6.'],
      '1/2',
      1,
      [
        [
          '15/30=1/2；结果小于两个正的真分数因数。',
          '15/30=1/2, smaller than both positive proper-fraction factors.',
        ],
      ],
      ['8/11', '15/11', '3/5'],
    ),
    exitReason: t(
      '用行列与原整体解释分子、分母分别相乘。',
      'Explain multiplying numerators and denominators using rows, columns and the original whole.',
    ),
    parent: {
      goal: t(
        '孩子指出交叠及一个原整体，而不只报乘积。',
        'The learner identifies overlap and one original whole, not just the final product.',
      ),
      misconception: t(
        '分母相加、乘法一定变大、扩展画面重定义为一。',
        'Adding denominators, assuming multiplication enlarges, or redefining an extended drawing as one.',
      ),
      prompts: [
        t(
          '交叠占原来那个一多少？',
          'What fraction of the original whole overlaps?',
        ),
        t(
          '因数超过一时，哪个标尺不能变？',
          'When a factor exceeds one, which reference must stay fixed?',
        ),
      ],
      bridge: 'P53-L04',
    },
  }),
  lesson({
    id: 'P61-L03',
    title: t('求一个量的几分之几', 'Finding a fraction of an amount'),
    objective: t(
      '先等分再选份，求给定实际量的分数，并保留测量对象与单位。',
      'Find a fraction of an actual amount by sharing then selecting, retaining the measurement object and unit.',
    ),
    prerequisites: ['P61-L02', 'P53-L01', 'B06-L01'],
    keywords: [
      t('实际整体', 'actual whole'),
      t('每份量', 'amount per share'),
      t('单位', 'unit'),
    ],
    minutes: 16,
    lab: 'product-amount',
    hook: t(
      '12 L 水的 2/3 和 1 L 水的 2/3，都是同一个分数，为什么实际升数不同？',
      'Why do 2/3 of 12 L and 2/3 of 1 L have different litre amounts, despite using the same fraction?',
    ),
    guided: q(
      'P61-L03-G',
      [
        '12 L 水取 2/3，取出多少升？',
        'Take 2/3 of 12 L water. How many litres is that?',
      ],
      8,
      2,
      [
        [
          '先 12÷3=4 L 每份，再取两份 4×2=8 L。',
          'First 12÷3=4 L per share, then take two: 4×2=8 L.',
        ],
        [
          '等价写 12×2/3=8 L；12 L 才是本题整体。',
          'Equivalently 12×2/3=8 L; the whole in this problem is 12 L.',
        ],
      ],
      ['2/3', '4', '18'],
      'L',
    ),
    questions: [
      c(
        'P61-L03-Q1',
        [
          '求 18 张卡的 2/3，第一步把十八怎样处理？',
          'To find 2/3 of 18 cards, what is a useful first step?',
        ],
        1,
        2,
        [
          [
            ['把十八加上三', 'Add three to eighteen'],
            [
              '三是等份数，不是新增卡片。',
              'Three names equal shares, not extra cards.',
            ],
          ],
          [
            ['平均分成三份，每份六张', 'Split into three equal shares of six'],
            [
              '再取两份，得到十二张。',
              'Then take two shares, giving twelve cards.',
            ],
          ],
          [
            [
              '每个小份自动当一张卡',
              'Automatically treat each part as one card',
            ],
            [
              '每份量由总卡数和等份数共同决定。',
              'The total and number of shares determine cards per share.',
            ],
          ],
        ],
        [['18÷3×2=12 张。', '18÷3×2=12 cards.']],
      ),
      q(
        'P61-L03-Q2',
        ['18 张卡的 2/3 是多少张？', 'How many cards are 2/3 of 18 cards?'],
        12,
        2,
        [
          [
            '18÷3=6，6×2=12 张，原整体是十八张。',
            '18÷3=6, then 6×2=12 cards; the whole is eighteen cards.',
          ],
        ],
        ['6', '2/3', '27'],
        'cards',
      ),
      q(
        'P61-L03-Q3',
        [
          '假想 NZ$20 的 3/4 是多少新西兰元？',
          'What is 3/4 of a fictional NZ$20 amount, in dollars?',
        ],
        15,
        2,
        [
          [
            '20÷4=5 元每份，三份为 5×3=15 元。',
            '20÷4=5 dollars per share; three shares give fifteen dollars.',
          ],
        ],
        ['5', '3/4', '80'],
        'NZD',
      ),
      q(
        'P61-L03-Q4',
        [
          '5 L 水的 2/3 是多少升？保留精确分数。',
          'Find 2/3 of 5 L water as an exact fraction in litres.',
        ],
        '10/3',
        2,
        [
          [
            '每份 5/3 L，取两份为 10/3 L，不截为三升。',
            'Each share is 5/3 L; two shares give 10/3 L, not a truncated three litres.',
          ],
        ],
        ['3', '2/3', '3.33'],
        'L',
      ),
      q(
        'P61-L03-Q5',
        [
          '15 m 彩带取 4/5，长度多少米？',
          'Take 4/5 of a 15 m ribbon. Find the length in metres.',
        ],
        12,
        2,
        [
          [
            '15÷5×4=3×4=12 m；求的是长度，不是段数。',
            '15÷5×4=3×4=12 m; the result is length rather than number of pieces.',
          ],
        ],
        ['3', '4/5', '20'],
        'm',
      ),
      r(
        'P61-L03-Q6',
        [
          '同是 2/3，为什么 12 L 的 2/3 是 8 L，而 6 L 的 2/3 是 4 L？说明分数、整体与实际量，不能说两个 2/3 大小不同。',
          'Why is 2/3 of 12 L eight litres but 2/3 of 6 L four litres? Distinguish the fraction, whole and measured amount without claiming the fractions differ.',
        ],
        2,
        [
          '两个比例分数都等于 2/3，但参考总量不同。十二升分三份每份四，选两份八升；六升分三份每份二，选两份四升。分数没有升单位，乘给定总量后才得到实际升数。比较实际量必须同时知道整体，不能只看涂色比例。',
          'The fractions both equal 2/3, but the reference amounts differ. Twelve litres give three shares of four and a selection of eight; six litres give shares of two and a selection of four. The dimensionless fraction becomes a litre quantity only when applied to a specified total. Knowing only the shaded proportion is insufficient to compare actual amounts.',
        ],
      ),
    ],
    exit: q(
      'P61-L03-X',
      [
        '24 g 材料取 3/8，所取多少克？',
        'Take 3/8 of 24 g of material. How many grams are selected?',
      ],
      9,
      2,
      [['24÷8×3=3×3=9 g。', '24÷8×3=3×3=9 g.']],
      ['3', '3/8', '64'],
      'g',
    ),
    exitReason: t(
      '指出整体、每份量与所取份数，解释结果为何有克单位。',
      'Identify the whole, amount per share and selected shares, and explain the gram unit.',
    ),
    parent: {
      goal: t(
        '孩子能辨认整体不同造成的实际量差异。',
        'The learner explains how different reference totals change actual amounts.',
      ),
      misconception: t(
        '分数当实际单位量、总量分不尽就取整、长度与份数混淆。',
        'Treating a fraction as a measured amount, rounding non-integer shares, or confusing length and count.',
      ),
      prompts: [
        t(
          '这里的一代表多少升？',
          'How many litres does the whole represent here?',
        ),
        t(
          '取一份是多少，再取几份？',
          'How much is one share, and how many do you select?',
        ),
      ],
      bridge: 'P53-L01',
    },
  }),
  lesson({
    id: 'P61-L04',
    title: t('分数除整数', 'Dividing fractions by whole numbers'),
    objective: t(
      '把分数量平均分给正整数份，用细分解释分母乘份数并验回原总量。',
      'Share a fractional amount among a positive whole-number count, explaining denominator multiplication through subdivision and checking the original total.',
    ),
    prerequisites: ['P61-L01', 'P53-L04', 'B02-L03'],
    keywords: [
      t('平均分', 'equal sharing'),
      t('细分', 'subdivision'),
      t('每人量', 'amount per person'),
    ],
    minutes: 18,
    lab: 'product-share',
    hook: t(
      '3/4 L 水平均给两人，三个四分之一不够整齐分，是否就不能分？每个四分之一还能怎样切？',
      'Share 3/4 L equally between two people. Three quarters do not split as whole quarter-pieces; can each quarter be subdivided?',
    ),
    guided: q(
      'P61-L04-G',
      [
        '3/4 L 平均分给两人，每人多少升？',
        'Share 3/4 L equally between two people. How many litres per person?',
      ],
      '3/8',
      3,
      [
        [
          '每个四分之一再分二，变为八分之一，共六个小份。',
          'Split each quarter into two eighths, making six small pieces.',
        ],
        [
          '每人三小份，为 3/8 L；两人共 6/8=3/4 L。',
          'Each gets three pieces, or 3/8 L. Together 6/8=3/4 L.',
        ],
      ],
      ['3/2', '3/4', '6/4'],
      'L',
      share(3, 4, 2),
    ),
    questions: [
      c(
        'P61-L04-Q1',
        ['3/4÷2 为什么可写成 3/8？', 'Why can 3/4÷2 be written as 3/8?'],
        1,
        3,
        [
          [
            ['把分子分母同时除二', 'Divide numerator and denominator by two'],
            [
              '同时改分子分母只可能改写等值量，不是平均分量。',
              'Changing both numerator and denominator rewrites a value rather than sharing it.',
            ],
          ],
          [
            ['每个四分之一再分成两份', 'Split every quarter into two'],
            [
              '单位变成八分之一，每人取原三个小份各一半。',
              'The unit becomes an eighth; each person receives half of each original quarter.',
            ],
          ],
          [
            [
              '除法必须把数字变整数',
              'Division must make the result an integer',
            ],
            [
              '每人量可以是精确分数。',
              'A per-person amount can be an exact fraction.',
            ],
          ],
        ],
        [['3/4÷2=3/(4×2)=3/8。', '3/4÷2=3/(4×2)=3/8.']],
      ),
      q(
        'P61-L04-Q2',
        [
          '2/3 L 平均分四份，每份多少升？',
          'Share 2/3 L into four equal shares. How many litres per share?',
        ],
        '1/6',
        3,
        [
          [
            '每个三分之一分四份，每份 1/12 L；每人得两小份，2/12=1/6 L。',
            'Split each third into four twelfths. Each share gets two, so 2/12=1/6 L.',
          ],
        ],
        ['2/7', '8/3', '2/3'],
        'L',
        share(2, 3, 4),
      ),
      q(
        'P61-L04-Q3',
        [
          '5/4 m 彩带平均剪五段，每段多少米？',
          'Cut a 5/4 m ribbon into five equal lengths. How many metres per length?',
        ],
        '1/4',
        3,
        [
          [
            '5/4÷5=5/20=1/4 m；五段相加仍为 5/4 m。',
            '5/4÷5=5/20=1/4 m; five lengths still total 5/4 m.',
          ],
        ],
        ['25/4', '5/9', '5/4'],
        'm',
        share(5, 4, 5),
      ),
      q(
        'P61-L04-Q4',
        [
          '零升水平均给三人，每人多少升？',
          'Share zero litres among three people. How many litres each?',
        ],
        0,
        3,
        [
          [
            '0÷3=0 L，除数三为正，合法。',
            '0÷3=0 L; the divisor is the positive number three.',
          ],
        ],
        ['3', '1', '1/3'],
        'L',
      ),
      q(
        'P61-L04-Q5',
        [
          '7/8 L 水平均给七人，每人多少升？',
          'Share 7/8 L equally among seven people. How many litres each?',
        ],
        '1/8',
        3,
        [
          [
            '7/(8×7)=7/56=1/8 L，七份合计 7/8 L。',
            '7/(8×7)=7/56=1/8 L; seven shares total 7/8 L.',
          ],
        ],
        ['7/15', '49/8', '7/8'],
        'L',
      ),
      r(
        'P61-L04-Q6',
        [
          '解释 1/2 L 分给两人为何每人 1/4 L，而不是把分子分母都乘二得到的 2/4 L。怎样用乘法核查？',
          'Why does sharing 1/2 L between two give 1/4 L each, rather than 2/4 L from multiplying both numerator and denominator? How can multiplication check it?',
        ],
        3,
        [
          '2/4 等于原来的半升，只是等值细分，不是每人量。把半升分两份，每份原整体的四分之一升；两份 1/4 合为 1/2 L，守住原总量。若每人 2/4，两人合计一升，凭空增加水。正整数人数不能取零，一人则保留全部。',
          'Two quarters equal the original half-litre, merely rewritten. Sharing that half into two gives one quarter-litre each; two quarters restore the original half. Giving each person two quarters would create a litre from half a litre. The sharing count must be positive; sharing with one person keeps the whole amount.',
        ],
      ),
    ],
    exit: q(
      'P61-L04-X',
      [
        '5/6 L 平均分两份，每份多少升？',
        'Share 5/6 L into two equal portions. How many litres per portion?',
      ],
      '5/12',
      3,
      [
        [
          '5/6÷2=5/12 L；两份恢复 10/12=5/6 L。',
          '5/6÷2=5/12 L; two portions restore 10/12=5/6 L.',
        ],
      ],
      ['5/3', '5/6', '10/6'],
      'L',
    ),
    exitReason: t(
      '用细分或乘回份数说明每份量，而非只背分母乘二。',
      'Use subdivision or multiplying back to explain each share, rather than just reciting a denominator rule.',
    ),
    parent: {
      goal: t(
        '孩子指出每人的同量颜色，并核查合计原水量。',
        'The learner identifies equal coloured allocations and checks their total.',
      ),
      misconception: t(
        '不细分就说不能分、把等值改写当平均分、零被除数与零人数混淆。',
        'Refusing subdivision, confusing equivalent rewriting with sharing, or mixing zero dividend with zero people.',
      ),
      prompts: [
        t('每个原小份还可以再分吗？', 'Can each original part be subdivided?'),
        t(
          '所有人重新合起来有多少升？',
          'How many litres do all shares make together?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
  lesson({
    id: 'P61-L05',
    title: t('整数除以分数', 'Dividing whole numbers by fractions'),
    objective: t(
      '用包含关系解释整数除以分数，并区分精确份数、完整份数和余量。',
      'Explain a whole number divided by a fraction as grouping, distinguishing exact groups, complete groups and remainder.',
    ),
    prerequisites: ['P61-L04', 'P53-L06', 'B02-L03'],
    keywords: [
      t('每份量', 'group size'),
      t('包含除法', 'measurement division'),
      t('余量', 'remainder'),
    ],
    minutes: 20,
    lab: 'product-whole-divide',
    hook: t(
      '2 L 水，每份 3/4 L，能量出多少份？若只能装满完整杯，答案为什么与精确份数不同？',
      'Measure 2 L in 3/4 L groups. How many groups does it represent, and why does the full-cup count differ from the exact quotient?',
    ),
    guided: q(
      'P61-L05-G',
      [
        '2 L，每份 3/4 L，全部水相当于多少份的量？包含不足一份的部分。',
        'With 2 L total and 3/4 L per group, how many group-sized amounts are there, including a partial group?',
      ],
      '8/3',
      4,
      [
        [
          '2 L=8 个 1/4 L；每份三个相同小份，8÷3=8/3 份。',
          'Two litres contain eight quarter-litres; each group contains three. Thus 8÷3=8/3 groups.',
        ],
        [
          '可装满两份，剩 1/2 L，占目标一份的 2/3。',
          'There are two complete groups; the remaining 1/2 L is 2/3 of a group.',
        ],
      ],
      ['2', '1/2', '3/8'],
      'groups',
      groups(2, 1, 3, 4),
    ),
    questions: [
      c(
        'P61-L05-Q1',
        ['2÷1/2 为什么是四而不是一？', 'Why is 2÷1/2 four rather than one?'],
        0,
        4,
        [
          [
            ['两升包含四个半升', 'Two litres contain four half-litres'],
            [
              '商数的是半升组，不是取两升的一半。',
              'The quotient counts half-litre groups; it does not take half of two litres.',
            ],
          ],
          [
            ['除法永远比原数小', 'Division always reduces the starting number'],
            [
              '正数除以小于一的正数，数出的份数可能更大。',
              'A positive dividend divided by a positive fraction below one can give a larger count.',
            ],
          ],
          [
            ['把两升平均分给两个人', 'Share two litres between two people'],
            [
              '那是除以整数二，问题不同。',
              'That divides by the whole number two, a different question.',
            ],
          ],
        ],
        [
          [
            '先说单位与问题：2 L 中有几个 1/2 L。',
            'First name the units and question: how many 1/2 L groups fit in 2 L?',
          ],
        ],
      ),
      q(
        'P61-L05-Q2',
        [
          '3 L 按每份 1/2 L 量取，相当于多少份？',
          'Measure 3 L in 1/2 L groups. How many groups?',
        ],
        6,
        4,
        [
          [
            '每升有两份半升，三升有 3×2=6 份。',
            'Each litre contains two half-litre groups; three litres contain six.',
          ],
        ],
        ['3/2', '3', '1/6'],
        'groups',
        groups(3, 1, 1, 2),
      ),
      q(
        'P61-L05-Q3',
        [
          '1 L，每份标准量 3/2 L，总水相当于多少份？可填不足一份的精确分数。',
          'With 1 L and a standard group size of 3/2 L, what fraction of a group does the water represent?',
        ],
        '2/3',
        4,
        [
          [
            '一升为两个半升，标准一份为三个半升，比较得 2/3 份。',
            'One litre is two half-litres, while a target group is three; the quotient is 2/3 of a group.',
          ],
        ],
        ['3/2', '1', '0'],
        'groups',
        groups(1, 1, 3, 2),
      ),
      q(
        'P61-L05-Q4',
        [
          '2 L 水，每份 3/4 L，只问能装满几份完整标准量？',
          'From 2 L with 3/4 L per group, how many complete groups can be filled?',
        ],
        2,
        4,
        [
          [
            '两份用 6/4 L，第三份需总 9/4 L，超过两升，所以完整份数为二。',
            'Two use 6/4 L; three would need 9/4 L, exceeding two litres. Thus two are complete.',
          ],
        ],
        ['8/3', '3', '1/2'],
        'groups',
      ),
      q(
        'P61-L05-Q5',
        [
          '同样 2 L 水装满两份，每份 3/4 L，剩多少升？',
          'After filling two 3/4 L groups from 2 L, how many litres remain?',
        ],
        '1/2',
        4,
        [
          [
            '2−2×3/4=2−3/2=1/2 L；这是升数，不是 2/3 份。',
            '2−2×3/4=1/2 L. This is litres, not the partial group count 2/3.',
          ],
        ],
        ['2/3', '8/3', '0'],
        'L',
      ),
      r(
        'P61-L05-Q6',
        [
          '在 2÷3/4 中，解释 8/3 份、完整两份、余 1/2 L 与不足一份的 2/3 之间的关系。为什么不能写“余 2/3 L”？',
          'For 2÷3/4, relate 8/3 groups, two complete groups, 1/2 L remaining and 2/3 of a group. Why is “2/3 L left” incorrect?',
        ],
        4,
        [
          '精确商为两又三分之二份。两份用一又二分之一升，剩半升。目标一份是四分之三升，半升占它的三分之二；这里三分之二的参照是一份，不是一升。检查 (8/3)×(3/4)=2 L，或 2×3/4+1/2=2 L，两个关系都恢复原量。',
          'The exact quotient is two and two thirds of a group. Two complete groups use one and a half litres, leaving half a litre. That half-litre is two thirds of the three-quarter-litre group. The reference for two thirds is one group, not one litre. Check (8/3)×(3/4)=2 L, or two complete groups plus 1/2 L restore the total.',
        ],
      ),
    ],
    exit: q(
      'P61-L05-X',
      [
        '3 L 水，每份 2/3 L，全部水相当于多少份？包括不足一份的量。',
        'With 3 L and 2/3 L per group, how many group-sized amounts are represented, including a partial group?',
      ],
      '9/2',
      4,
      [
        [
          '三升是九个三分之一升，每份两个，9÷2=9/2 份。',
          'Three litres are nine thirds; each group contains two, giving 9/2 groups.',
        ],
      ],
      ['2', '4', '2/9'],
      'groups',
    ),
    exitReason: t(
      '说明商的单位是份，以及不足一份怎样保留。',
      'Explain the group-count unit and how the incomplete group is retained.',
    ),
    parent: {
      goal: t(
        '孩子读清题目所求，区分份数与实际剩余量。',
        'The learner distinguishes the requested count from the measured remainder.',
      ),
      misconception: t(
        '除法一定变小、精确商一律取整、余量按一升与按一份混用。',
        'Assuming division reduces, always rounding quotients, or confusing a litre remainder with a fraction of a group.',
      ),
      prompts: [
        t(
          '每个括框代表一升还是一份？',
          'Does each bracket mean one litre or one group?',
        ),
        t(
          '余半升占目标一份的多少？',
          'What fraction of the target group is the remaining half-litre?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
  lesson({
    id: 'P61-L06',
    title: t('分数除分数及倒数', 'Fraction division and reciprocals'),
    objective: t(
      '从同小份比较推导除以非零分数等于乘其倒数，并用乘回验证。',
      'Derive division by a nonzero fraction as multiplication by its reciprocal from equal-piece comparison, then verify by multiplication.',
    ),
    prerequisites: ['P61-L02', 'P61-L05', 'P53-L06'],
    keywords: [
      t('倒数', 'reciprocal'),
      t('共同小份', 'common small unit'),
      t('逆运算', 'inverse operation'),
    ],
    minutes: 20,
    lab: 'product-fraction-divide',
    hook: t(
      '3/4 L 里有多少个 2/3 L？把两种量都换成十二分之一升，为什么会得到九除八？',
      'How many 2/3 L groups fit in 3/4 L? Why does using twelfths of a litre turn the question into nine divided by eight?',
    ),
    guided: q(
      'P61-L06-G',
      [
        '3/4 L 按每份 2/3 L 量取，相当于多少份？包括不足一份的量。',
        'Measure 3/4 L in groups of 2/3 L. How many groups, including a partial group?',
      ],
      '9/8',
      5,
      [
        [
          '3/4=9/12 L，2/3=8/12 L，两个小份单位相同。',
          '3/4=9/12 L and 2/3=8/12 L, using identical small units.',
        ],
        [
          '9÷8=9/8 份，也等于 3/4×3/2；乘回 9/8×2/3=3/4 L。',
          '9÷8=9/8 groups, also 3/4×3/2. Multiply back: 9/8×2/3=3/4 L.',
        ],
      ],
      ['8/9', '1/2', '1'],
      'groups',
      groups(3, 4, 2, 3),
    ),
    questions: [
      c(
        'P61-L06-Q1',
        ['在 3/4÷2/3 中，为什么乘 3/2？', 'Why multiply by 3/2 in 3/4÷2/3?'],
        1,
        5,
        [
          [
            ['把被除数 3/4 翻成 4/3', 'Invert the dividend 3/4 into 4/3'],
            [
              '翻转被除数改变了已有总量。',
              'Inverting the dividend changes the available amount.',
            ],
          ],
          [
            ['2/3 与 3/2 相乘得一', '2/3 times 3/2 equals one'],
            [
              '3/2 是原除数的倒数，可与同小份比较核对。',
              '3/2 is the divisor’s reciprocal, consistent with common-piece comparison.',
            ],
          ],
          [
            ['因为所有分数都要同时翻转', 'Invert every fraction at once'],
            [
              '同时翻转不是原问题的等价运算。',
              'Inverting both is not equivalent to the original question.',
            ],
          ],
        ],
        [
          [
            '保留被除数，用除数倒数完成逆运算。',
            'Retain the dividend and use the divisor’s reciprocal for the inverse operation.',
          ],
        ],
      ),
      q(
        'P61-L06-Q2',
        [
          '2/3 L，每份 1/4 L，相当于多少份？',
          'With 2/3 L total and 1/4 L per group, how many groups?',
        ],
        '8/3',
        5,
        [
          [
            '2/3=8/12，1/4=3/12；8÷3=8/3 份，也等于 2/3×4。',
            'Use twelfths: eight pieces divided by three per group gives 8/3, also 2/3×4.',
          ],
        ],
        ['3/8', '1/6', '2'],
        'groups',
        groups(2, 3, 1, 4),
      ),
      q(
        'P61-L06-Q3',
        [
          '5/6 L，每份标准量 5/3 L，相当于多少份？',
          'With 5/6 L and a standard group size of 5/3 L, what fraction of a group is represented?',
        ],
        '1/2',
        5,
        [
          [
            '5/3=10/6，已有五个六分之一而一份需十个，5/10=1/2 份。',
            'A group is ten sixths while five sixths are available, giving 5/10=1/2 of a group.',
          ],
        ],
        ['2', '25/18', '1'],
        'groups',
        groups(5, 6, 5, 3),
      ),
      q(
        'P61-L06-Q4',
        [
          '3/5 的乘法倒数是多少？',
          'What is the multiplicative reciprocal of 3/5?',
        ],
        '5/3',
        5,
        [
          [
            '3/5×5/3=15/15=1；倒数不是相反数。',
            '3/5×5/3=1. A reciprocal is not an additive opposite.',
          ],
        ],
        ['3/5', '-3/5', '0'],
      ),
      q(
        'P61-L06-Q5',
        [
          '0 L 按每份 2/5 L 量取，相当于多少份？',
          'Measure 0 L in groups of 2/5 L. How many groups?',
        ],
        0,
        5,
        [
          [
            '正的每份量合法，0÷2/5=0 份；这不是除以零。',
            'The positive group size is valid: 0÷2/5=0 groups. This is not division by zero.',
          ],
        ],
        ['2/5', '5/2', '1'],
        'groups',
      ),
      r(
        'P61-L06-Q6',
        [
          '解释除以分数时为什么翻除数而不翻总量；零有没有倒数？怎样区分 0÷2/5 与 2/5÷0？',
          'Why invert the divisor rather than the available amount? Does zero have a reciprocal? Distinguish 0÷2/5 from 2/5÷0.',
        ],
        5,
        [
          '除数倒数与原除数相乘为一，商乘回除数应恢复原被除数；翻被除数则改变了要分的总量。任何数乘零都为零，不能得到一，所以零无倒数且不能作除数。零除以正的 2/5 则是零份，乘回仍为零，合法。',
          'The divisor’s reciprocal multiplies it to make one; multiplying the quotient back by the divisor must restore the original dividend. Inverting the dividend changes the amount. Any number times zero is zero, never one, so zero has no reciprocal and cannot be a divisor. Zero divided by positive 2/5 is legitimately zero groups.',
        ],
      ),
    ],
    exit: q(
      'P61-L06-X',
      [
        '5/8 L，每份 3/4 L，相当于多少份？',
        'With 5/8 L and 3/4 L per group, what fraction of a group is represented?',
      ],
      '5/6',
      5,
      [
        [
          '5/8÷3/4=5/8×4/3=20/24=5/6 份；乘回 5/6×3/4=5/8 L。',
          '5/8÷3/4=5/8×4/3=5/6 groups. Multiply back: 5/6×3/4=5/8 L.',
        ],
      ],
      ['6/5', '15/32', '1'],
      'groups',
    ),
    exitReason: t(
      '先用同小份或倒数解释，再乘回原除数检查总量。',
      'Explain through common pieces or the reciprocal, then multiply by the divisor to check the amount.',
    ),
    parent: {
      goal: t(
        '孩子给出倒数成立的理由，并能用乘回检查。',
        'The learner justifies the reciprocal and verifies by multiplying back.',
      ),
      misconception: t(
        '翻错对象、把倒数当相反数、零有倒数、份数与升数混写。',
        'Inverting the wrong quantity, confusing reciprocal with additive opposite, inventing a reciprocal for zero, or mixing groups and litres.',
      ),
      prompts: [
        t(
          '哪个数与原除数相乘得一？',
          'What multiplies the original divisor to make one?',
        ),
        t(
          '商乘回每份量，能恢复原总量吗？',
          'Does quotient times group size restore the available amount?',
        ),
      ],
      bridge: 'P53-L06',
    },
    familyChallenge: t(
      '纸上规划即可：用 2 L 假想果汁，分别按 1/2 L 与 3/4 L 标准份量比较精确份数、可装满份数和余量。前者四份无剩余；后者 8/3 份，可装满两份、剩 1/2 L，占一份的 2/3。再解释 3/4 L 中含 9/8 个 2/3 L 标准量，并乘回验证。无需倒水、购买或实际饮用。',
      'Plan on paper with 2 L fictional juice. Compare exact groups, complete servings and remainder for 1/2 L and 3/4 L group sizes. The first gives four with no remainder; the second gives 8/3 groups, two complete and 1/2 L left, equal to 2/3 of a group. Then explain why 3/4 L represents 9/8 of a 2/3 L standard group and multiply back. No pouring, purchase or drinking is needed.',
    ),
  }),
];
export const p61CheckQuestions: Question[] = [
  q(
    'P61-CHECK-Q1',
    [
      '四组各 3/8 L，合计多少升？',
      'Four groups each contain 3/8 L. Find total litres.',
    ],
    '3/2',
    0,
    [['4×3/8=12/8=3/2 L。', '4×3/8=12/8=3/2 L.']],
    ['12/32', '3/8', '12'],
    'L',
    repeat(4, 3, 8),
  ),
  q(
    'P61-CHECK-Q2',
    ['计算 3/5×5/6。', 'Calculate 3/5×5/6.'],
    '1/2',
    1,
    [
      [
        '15/30=1/2，仍以一个原单位框为整体。',
        '15/30=1/2 using the original unit frame.',
      ],
    ],
    ['8/11', '15/11', '3/5'],
    undefined,
    area(3, 5, 5, 6),
  ),
  q(
    'P61-CHECK-Q3',
    ['24 g 的 5/8 是多少克？', 'How many grams are 5/8 of 24 g?'],
    15,
    2,
    [['24÷8×5=15 g。', '24÷8×5=15 g.']],
    ['3', '5/8', '64'],
    'g',
  ),
  q(
    'P61-CHECK-Q4',
    [
      '5/6 L 平均分五份，每份多少升？',
      'Share 5/6 L equally into five. Find litres per share.',
    ],
    '1/6',
    3,
    [['5/(6×5)=5/30=1/6 L。', '5/(6×5)=5/30=1/6 L.']],
    ['25/6', '5/11', '5/6'],
    'L',
    share(5, 6, 5),
  ),
  q(
    'P61-CHECK-Q5',
    [
      '2 L 按每份 3/4 L 计，精确相当于多少份？',
      'With 2 L and 3/4 L per group, find the exact group count.',
    ],
    '8/3',
    4,
    [
      [
        '八个四分之一除每份三个，得 8/3 份。',
        'Eight quarter-litres divided by three per group gives 8/3 groups.',
      ],
    ],
    ['2', '3/8', '1/2'],
    'groups',
    groups(2, 1, 3, 4),
  ),
  c(
    'P61-CHECK-Q6',
    [
      '为什么零不能当除数，也没有乘法倒数？',
      'Why can zero be neither a divisor nor have a multiplicative reciprocal?',
    ],
    2,
    5,
    [
      [
        ['因为零不是整数', 'Because zero is not a whole number'],
        [
          '零是整数，问题不在这个分类。',
          'Zero is a whole number; that is not the reason.',
        ],
      ],
      [
        ['因为任何除法都必须变小', 'Because all division must reduce'],
        [
          '除以小于一的正分数可以得到较大数。',
          'Division by a positive fraction below one can produce a larger quotient.',
        ],
      ],
      [
        [
          '零乘任何数都得零，不能得到一',
          'Zero times any number is zero, never one',
        ],
        [
          '不能找到乘零得一的数，也不能由零份量确定一般商。',
          'No number times zero gives one, nor does a zero group size define general division.',
        ],
      ],
    ],
    [
      [
        '允许零作为被除数、正数作除数；不能把这与除零混淆。',
        'Zero dividends with positive divisors are allowed; distinguish this from division by zero.',
      ],
    ],
  ),
  q(
    'P61-CHECK-Q7',
    [
      '5/8 L 按每份 3/4 L 计，相当于多少份？',
      'Measure 5/8 L in 3/4 L groups. What fraction of a group?',
    ],
    '5/6',
    5,
    [
      [
        '5/8×4/3=5/6 份；乘回得到 5/8 L。',
        '5/8×4/3=5/6 groups; multiplying back restores 5/8 L.',
      ],
    ],
    ['6/5', '15/32', '1'],
    'groups',
  ),
  r(
    'P61-CHECK-Q8',
    [
      '同为 2 L 和 3/4：“求 2 L 的 3/4”与“2 L 中有多少个 3/4 L”为什么不同？列式、说明答案单位并核查。',
      'With 2 L and 3/4, why do “find 3/4 of 2 L” and “how many 3/4 L groups are in 2 L” differ? Give equations, units and checks.',
    ],
    5,
    [
      '前者选总量的份额，2×3/4=3/2 L，结果是升；后者按每份量计组，2÷3/4=8/3 份，结果是份数。可用三份四分之一选择解释前者；后者乘回 (8/3)×3/4 L=2 L，或两整份加余半升核查。运算要由问题和单位决定，不能见分数就自动乘或翻转。',
      'The first selects part of a total: 2×3/4=3/2 L, a litre amount. The second counts group-sized amounts: 2÷3/4=8/3 groups. Check the grouping by (8/3)×3/4 L=2 L, or two complete groups plus half a litre. Choose the operation from the relationship and units, rather than multiplying or inverting whenever a fraction appears.',
    ],
  ),
];
export function p61ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative safe-integer round');
  const index = p61Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new Error(`Unknown P61 lesson ${id}`);
  const k = round % 80,
    n = 1 + (k % 5),
    d = 2 + (Math.floor(k / 5) % 7),
    a = 1 + (Math.floor(k / 35) % 2),
    qid = `${id}-R${round}`;
  if (index === 0)
    return q(
      qid,
      [
        `${a + 1} 组各 ${n}/${d} L，共多少升？`,
        `${a + 1} groups each contain ${n}/${d} L. Find total litres.`,
      ],
      `${(a + 1) * n}/${d}`,
      0,
      [
        [
          `(${a + 1}×${n})/${d}=${(a + 1) * n}/${d} L。`,
          `(${a + 1}×${n})/${d}=${(a + 1) * n}/${d} L.`,
        ],
      ],
      ['0/0', '0'],
      'L',
    );
  if (index === 1) {
    const p = 1 + (k % 3),
      b = 3 + (Math.floor(k / 3) % 4),
      c = 1 + (Math.floor(k / 12) % 3),
      e = 4 + (Math.floor(k / 36) % 3);
    return q(
      qid,
      [`计算 ${p}/${b}×${c}/${e}。`, `Calculate ${p}/${b}×${c}/${e}.`],
      `${p * c}/${b * e}`,
      1,
      [
        [
          `${p}×${c}/(${b}×${e})=${p * c}/${b * e}。`,
          `${p}×${c}/(${b}×${e})=${p * c}/${b * e}.`,
        ],
      ],
      ['0/0', `${p + c}/${b + e}`],
      undefined,
      area(p, b, c, e),
    );
  }
  if (index === 2) {
    const total = (a + 2) * d;
    return q(
      qid,
      [`${total} L 的 ${n}/${d} 是多少升？`, `Find ${n}/${d} of ${total} L.`],
      (a + 2) * n,
      2,
      [
        [
          `${total}÷${d}×${n}=${(a + 2) * n} L。`,
          `${total}÷${d}×${n}=${(a + 2) * n} L.`,
        ],
      ],
      ['0/0', '0'],
      'L',
    );
  }
  if (index === 3)
    return q(
      qid,
      [
        `${n}/${d} L 平均分 ${a + 1} 份，每份多少升？`,
        `Share ${n}/${d} L into ${a + 1} equal portions. Find litres per portion.`,
      ],
      `${n}/${d * (a + 1)}`,
      3,
      [
        [
          `${n}/(${d}×${a + 1})=${n}/${d * (a + 1)} L。`,
          `${n}/(${d}×${a + 1})=${n}/${d * (a + 1)} L.`,
        ],
      ],
      ['0/0', `${n * (a + 1)}/${d}`],
      'L',
    );
  if (index === 4) {
    const total = 1 + (k % 3),
      gn = 1 + (Math.floor(k / 3) % 3),
      gd = 2 + (Math.floor(k / 9) % 5);
    return q(
      qid,
      [
        `${total} L 每份 ${gn}/${gd} L，相当于多少份？保留精确商。`,
        `Measure ${total} L in groups of ${gn}/${gd} L. Find the exact group count.`,
      ],
      `${total * gd}/${gn}`,
      4,
      [
        [
          `${total}×${gd}/${gn}=${total * gd}/${gn} 份。`,
          `${total}×${gd}/${gn}=${total * gd}/${gn} groups.`,
        ],
      ],
      ['0/0', '0'],
      'groups',
      groups(total, 1, gn, gd),
    );
  }
  const an = 1 + (k % 5),
    ad = 2 + (Math.floor(k / 5) % 5),
    bn = 1 + (Math.floor(k / 25) % 3),
    bd = 2 + (Math.floor(k / 3) % 5);
  return q(
    qid,
    [
      `${an}/${ad} L 按每份 ${bn}/${bd} L 计，相当于多少份？`,
      `${an}/${ad} L measured in ${bn}/${bd} L groups: find the exact group count.`,
    ],
    `${an * bd}/${ad * bn}`,
    5,
    [
      [
        `${an}/${ad}×${bd}/${bn}=${an * bd}/${ad * bn} 份。`,
        `${an}/${ad}×${bd}/${bn}=${an * bd}/${ad * bn} groups.`,
      ],
    ],
    ['0/0', '0'],
    'groups',
    groups(an, ad, bn, bd),
  );
}
