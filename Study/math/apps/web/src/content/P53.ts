import { t as T, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning, p53Lesson } from './builders';
import {
  simplifyFraction,
  commonDenominator,
  mixedFraction,
} from '../fractionModels';
type Options = {
  rule?: Extract<AnswerSpec, { kind: 'number' }>['fractionRule'];
  denominator?: number;
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
  diagram?: Question['diagram'];
  fraction?: boolean;
};
const hints = (h: [string, string, string, string]) => [
  T(h[0], h[1]),
  T(h[2], h[3]),
];
function q(
  id: string,
  zh: string,
  en: string,
  value: string,
  skill: string,
  h: [string, string, string, string],
  steps: ReturnType<typeof T>[],
  accepted: string[],
  rejected: string[],
  options: Options = {},
) {
  const result = numeric(
    id,
    T(zh, en),
    value,
    skill,
    hints(h),
    steps,
    { accepted, rejected },
    options.diagram,
  );
  result.type = options.diagram
    ? 'visual_select'
    : options.fraction || options.rule
      ? 'fraction'
      : options.unit
        ? 'word_problem'
        : 'numeric';
  result.answer = {
    kind: 'number',
    value,
    unit: options.unit,
    fractionRule: options.rule,
    requiredDenominator: options.denominator,
    formats:
      options.fraction || options.rule
        ? options.rule === 'mixed' || options.rule === 'simplest'
          ? ['fraction', 'decimal']
          : ['fraction']
        : undefined,
  };
  if (options.rule === 'mixed') {
    const [n, d] = value.split('/').map(Number);
    if (n !== undefined && d) {
      const converted = mixedFraction({ n, d });
      result.answer.value = converted.n
        ? `${converted.whole} ${converted.n}/${converted.d}`
        : String(converted.whole);
    }
  }
  if (options.unit) result.difficulty = 'transfer';
  return result;
}
function c(
  id: string,
  zh: string,
  en: string,
  correct: number,
  skill: string,
  options: [string, string, string, string][],
  h: [string, string, string, string],
  steps: ReturnType<typeof T>[],
) {
  return choice(
    id,
    T(zh, en),
    correct,
    skill,
    options.map((o) => ({ text: T(o[0], o[1]), feedback: T(o[2], o[3]) })),
    hints(h),
    steps,
  );
}
function r(
  id: string,
  zh: string,
  en: string,
  skill: string,
  rubricZh: string,
  rubricEn: string,
  h: [string, string, string, string],
  questionType: Question['type'] = 'error_spotting',
) {
  const result = reasoning(
    id,
    T(zh, en),
    skill,
    T(rubricZh, rubricEn),
    hints(h),
  );
  result.type = questionType;
  return result;
}
const unit = 'unit-fraction-whole',
  kind = 'proper-improper',
  mixed = 'mixed-fraction',
  equivalent = 'equivalent-fraction',
  simplest = 'simplest-fraction',
  compare = 'fraction-comparison';
export const p53Lessons: Lesson[] = [
  p53Lesson({
    id: 'P53-L01',
    title: T('单位分数与整体', 'Unit fractions and the whole'),
    objective: T(
      '先确定整体，再把等分后的一份表示成单位分数。',
      'Identify the whole before representing one equal part as a unit fraction.',
    ),
    prerequisites: ['B04-L01', 'B04-L02'],
    keywords: [
      T('整体', 'whole'),
      T('等分', 'equal parts'),
      T('单位分数', 'unit fraction'),
    ],
    minutes: 15,
    lab: 'fraction-whole',
    hook: T(
      '一根 12 米绳子与一根 6 米绳子，各取一半。分数一样，实际长度也一样吗？',
      'Take half of a twelve-metre rope and half of a six-metre rope. Do matching fractions mean matching lengths?',
    ),
    guided: q(
      'P53-L01-G',
      '一个整体等分成 6 份，一份用单位分数表示。',
      'Divide one whole into six equal parts. Write the unit fraction for one part.',
      '1/6',
      unit,
      [
        '先说明这一个整体是谁。',
        'Identify the whole first.',
        '分子为 1；分母数整体的等份。',
        'The numerator is one; the denominator counts equal parts.',
      ],
      [
        T(
          '整体的 6 份一样大，一份是 1/6。',
          'The six parts are equal, so one is 1/6.',
        ),
        T(
          '六个这样的单位分数合成整体。',
          'Six such unit fractions make the whole.',
        ),
      ],
      ['1/6', '1 / 6'],
      ['6', '1/5', '2/12'],
      { rule: 'unit' },
    ),
    questions: [
      c(
        'P53-L01-Q1',
        '两个大小不同的整体，各取 1/2，实际量一定相等吗？',
        'Take 1/2 of two differently sized wholes. Must the actual amounts match?',
        1,
        unit,
        [
          [
            '一定相等',
            'Always equal',
            '分数相同，但整体大小不同，实际量可能不同。',
            'The fraction matches, but different wholes may give different amounts.',
          ],
          [
            '不一定，要知道整体大小',
            'Not necessarily; whole sizes matter',
            '先确定整体，再比较实际量。',
            'Identify whole sizes before comparing actual amounts.',
          ],
          [
            '整体越小，一半必然越大',
            'Half of the smaller whole must be larger',
            '同样取一半时，较小整体的一半也较小。',
            'Taking the same half of a smaller whole gives a smaller amount.',
          ],
        ],
        [
          '1/2 描述的是哪个整体的一半？',
          'Half of which whole?',
          '可以分别想 12 米和 6 米的一半。',
          'Consider halves of twelve and six metres.',
        ],
        [
          T(
            '12 米的一半是 6 米；6 米的一半是 3 米。',
            'Half of twelve metres is six; half of six is three.',
          ),
          T(
            '同一个分数不保证不同整体的实际量相同。',
            'Matching fractions do not guarantee matching amounts from different wholes.',
          ),
        ],
      ),
      q(
        'P53-L01-Q2',
        '一个整体等分成 8 份，一份是什么单位分数？',
        'One whole has eight equal parts. What unit fraction is one part?',
        '1/8',
        unit,
        [
          '分母表示 8 个相等部分。',
          'The denominator counts eight equal parts.',
          '只取一份，分子是什么？',
          'What numerator represents one part?',
        ],
        [
          T('一份是 1/8。', 'One part is 1/8.'),
          T('八份合成 8/8，也就是整体。', 'Eight parts make 8/8, the whole.'),
        ],
        ['1/8', '1 /8'],
        ['8/1', '2/16', '1/7'],
        { rule: 'unit' },
      ),
      q(
        'P53-L01-Q3',
        '图中整体分成 5 等份。每一小份是什么单位分数？不要写两份的总量。',
        'The diagram divides the whole into five equal parts. What unit fraction is each part? Do not write the two-part total.',
        '1/5',
        unit,
        [
          '涂色两份，不会改变每份的单位。',
          'Shading two parts does not change the unit for each.',
          '整体有五等份；一份的分子是 1。',
          'There are five equal parts; one part has numerator one.',
        ],
        [
          T(
            '每一份是 1/5；涂色总量才是 2/5。',
            'Each part is 1/5; the total shading is 2/5.',
          ),
          T(
            '区分小单位和有几个小单位。',
            'Distinguish the small unit from its count.',
          ),
        ],
        ['1/5'],
        ['2/5', '5', '2/10'],
        {
          rule: 'unit',
          diagram: { kind: 'fraction-bars', values: [{ n: 2, d: 5 }] },
        },
      ),
      q(
        'P53-L01-Q4',
        '12 米绳子等分成 6 段，每段多少米？',
        'Split twelve metres of rope into six equal lengths. How many metres per length?',
        '2',
        unit,
        [
          '每段是整根的 1/6。',
          'Each length is one sixth of the rope.',
          '把 12 米平均分给六段。',
          'Share twelve metres equally among six lengths.',
        ],
        [
          T('12÷6=2 米。', '12÷6=2 metres.'),
          T(
            '1/6 是比例；2 米是实际长度。',
            '1/6 is the fraction; two metres is the actual length.',
          ),
        ],
        ['2', '2 m', '2 metres'],
        ['6', '12', '2 L'],
        { unit: 'm' },
      ),
      q(
        'P53-L01-Q5',
        '分别取 12 米和 6 米绳子的一半。较长绳子的一半有多少米？',
        'Take half of twelve-metre and six-metre ropes. How many metres is half of the longer rope?',
        '6',
        unit,
        [
          '先选作为整体的较长绳子。',
          'Identify the longer rope as the whole.',
          '一半表示平均分成两段的一段。',
          'Half is one of two equal lengths.',
        ],
        [
          T(
            '较长绳子是 12 米，一半为 12÷2=6 米。',
            'The longer rope is twelve metres; half is 12÷2=6 metres.',
          ),
          T(
            '另一根的一半为 3 米，不相同。',
            'Half of the other rope is three metres, a different amount.',
          ),
        ],
        ['6', '6 m'],
        ['3', '12', '6 km'],
        { unit: 'm' },
      ),
      r(
        'P53-L01-Q6',
        '同学把一个整体分成三块不等大的区域，却说每块都是 1/3。问题在哪里？',
        'A learner cuts one whole into three unequal regions and calls each 1/3. What is wrong?',
        unit,
        '分母 3 要求整体分成三个相等部分，而不只是有三块。指出这些区域不等大，应重新等分，或不能给每块同一个 1/3 标签；画图时需比较面积，不能只数块。',
        'The denominator three requires three equal parts, not merely three pieces. Explain that the regions differ in area: repartition equally or stop labelling each one third. Compare areas rather than only count pieces.',
        [
          '分母同时说明份数与什么条件？',
          'What condition accompanies the part count?',
          '三个区域覆盖同一整体，但面积一样吗？',
          'Do the three regions have equal areas within the same whole?',
        ],
      ),
    ],
    exit: q(
      'P53-L01-X',
      '1 升果汁平均分进 8 杯，每杯占原总量的什么单位分数？',
      'Share one litre equally among eight cups. What unit fraction of the original total is each cup?',
      '1/8',
      unit,
      [
        '总量是一升这一个整体。',
        'The one-litre total is the whole.',
        '每杯取八等份中的一份。',
        'Each cup is one of eight equal shares.',
      ],
      [
        T('每杯为整体的 1/8。', 'Each cup is 1/8 of the whole.'),
        T(
          '八个同样的 1/8 合成一升。',
          'Eight equal eighths recover one litre.',
        ),
      ],
      ['1/8', '1 / 8'],
      ['8', '2/16', '1/7'],
      { rule: 'unit' },
    ),
    exitReason: T(
      '说明整体是谁，为什么必须等分；换成两升总量时，同样的 1/8 对应的实际量会怎样变？',
      'Identify the whole and explain why parts must be equal. If the total becomes two litres, how does the amount represented by the same 1/8 change?',
    ),
    parent: {
      goal: T(
        '区分整体、单位分数与实际量。',
        'Distinguish the whole, unit fraction and actual amount.',
      ),
      misconception: T(
        '只数切成几块，不检查等大；认为不同整体的一半必然同量。',
        'Counting pieces without checking equality, or assuming halves of different wholes have equal amounts.',
      ),
      prompts: [
        T('这个 1 是哪一个整体？', 'What whole does this one refer to?'),
        T(
          '如果整体变长，分数不变，实际长度变吗？',
          'If the whole becomes longer but the fraction stays the same, does actual length change?',
        ),
      ],
      bridge: 'B04-L01',
    },
  }),
  p53Lesson({
    id: 'P53-L02',
    title: T('真分数与假分数', 'Proper and improper fractions'),
    objective: T(
      '把正分数的分子与分母关系连接到比一个整体小、等于或大的量。',
      'Connect numerator and denominator in positive fractions to amounts below, equal to or above one whole.',
    ),
    prerequisites: ['P53-L01'],
    keywords: [
      T('真分数', 'proper fraction'),
      T('假分数', 'improper fraction'),
      T('一个整体', 'one whole'),
    ],
    minutes: 15,
    lab: 'fraction-kind',
    hook: T(
      '七个四分之一能放进一个整体吗？假分数的“假”，表示它不是实际数量吗？',
      'Can seven quarters fit in one whole? Does “improper” mean the fraction is not a real amount?',
    ),
    guided: q(
      'P53-L02-G',
      '五个二分之一，用分母为 2 的假分数表示。',
      'Write five halves as an improper fraction with denominator two.',
      '5/2',
      kind,
      [
        '每份是 1/2，有五份。',
        'Each part is one half; there are five.',
        '分子数小份，分母说明每个整体的等份数。',
        'The numerator counts parts; the denominator counts parts per whole.',
      ],
      [
        T('五个二分之一是 5/2。', 'Five halves make 5/2.'),
        T(
          '分子 5 大于分母 2，超过一个整体。',
          'Five exceeds two, so the amount exceeds one whole.',
        ),
      ],
      ['5/2', '5 /2'],
      ['2/5', '10/4', '2.5'],
      { rule: 'improper', denominator: 2 },
    ),
    questions: [
      c(
        'P53-L02-Q1',
        '下面哪一个正分数小于 1，是本课的真分数？',
        'Which positive fraction is less than one and proper in this lesson?',
        0,
        kind,
        [
          [
            '3/5',
            '3/5',
            '三个五分之一不足五个，所以小于一。',
            'Three fifths are fewer than five fifths, so below one.',
          ],
          [
            '5/5',
            '5/5',
            '分子等于分母，恰好一个整体，属于假分数边界。',
            'Matching numerator and denominator make exactly one, the equality boundary for improper fractions.',
          ],
          [
            '7/5',
            '7/5',
            '七个五分之一超过一个整体。',
            'Seven fifths exceed one whole.',
          ],
        ],
        [
          '分母说明凑成一个整体要几份。',
          'The denominator tells how many parts make a whole.',
          '比较分子与分母。',
          'Compare numerator and denominator.',
        ],
        [
          T('3<5，所以 3/5<1。', 'Since 3<5, 3/5<1.'),
          T('5/5=1；7/5>1。', '5/5=1; 7/5>1.'),
        ],
      ),
      q(
        'P53-L02-Q2',
        '7/3 里面有几个完整的整体？',
        'How many complete wholes are contained in 7/3?',
        '2',
        kind,
        [
          '每三个三分之一合成一个整体。',
          'Every three thirds make one whole.',
          '七份能组成几组完整的三份？',
          'How many complete groups of three fit into seven parts?',
        ],
        [
          T('7=3+3+1。', '7=3+3+1.'),
          T(
            '有 2 个完整整体，还有一个三分之一。',
            'There are two complete wholes and one third left.',
          ),
        ],
        ['2', '2.0'],
        ['3', '7', '1'],
      ),
      q(
        'P53-L02-Q3',
        '图中每整条有四等份，涂色量用分母为 4 的假分数表示。',
        'Each complete strip has four equal parts. Write the shading as an improper fraction with denominator four.',
        '5/4',
        kind,
        [
          '第一整条涂了四份，第二条涂了一份。',
          'The first whole has four shaded parts, the second has one.',
          '总共计五个四分之一。',
          'Count five quarters altogether.',
        ],
        [
          T('4+1=5 份，每份 1/4。', '4+1=5 parts, each one quarter.'),
          T(
            '涂色量为 5/4，不能把两个整体的分母相加。',
            'The shading is 5/4; do not add denominators across wholes.',
          ),
        ],
        ['5/4'],
        ['5/8', '10/8', '4/5'],
        {
          rule: 'improper',
          denominator: 4,
          diagram: { kind: 'fraction-bars', values: [{ n: 5, d: 4 }] },
        },
      ),
      q(
        'P53-L02-Q4',
        '要画出 9/4，至少需要几条完整的整体轮廓？最后一条可以只涂一部分。',
        'How many whole-strip outlines are needed to show 9/4? The final strip may be partially shaded.',
        '3',
        kind,
        [
          '两条最多容纳八个四分之一。',
          'Two strips hold at most eight quarters.',
          '还有一份，需要再有一条轮廓。',
          'One part remains and needs another outline.',
        ],
        [
          T('9=4+4+1。', '9=4+4+1.'),
          T(
            '需要 3 条轮廓，其中只有 2 条完全涂满。',
            'Three outlines are needed, but only two are completely filled.',
          ),
        ],
        ['3'],
        ['2', '9', '4'],
      ),
      q(
        'P53-L02-Q5',
        '八瓶果汁，每瓶 1/3 升。总量写成分母为 3 的假分数，单位为升。',
        'Eight bottles each hold 1/3 litre. Write the total as an improper fraction with denominator three, in litres.',
        '8/3',
        kind,
        [
          '这里的一升是计量整体，瓶数是份数。',
          'One litre is the measurement whole; bottle count counts parts.',
          '八个三分之一就是八份。',
          'Eight thirds mean eight parts.',
        ],
        [
          T('8×1/3=8/3 升。', '8×1/3=8/3 litres.'),
          T(
            '两个整体加两份，但要求仍用假分数表示。',
            'It is two wholes plus two parts, but the requested form is improper.',
          ),
        ],
        ['8/3', '8/3 L', '8 / 3 litres'],
        ['3/8', '2 2/3', '8/6', '8/3 m'],
        { rule: 'improper', denominator: 3, unit: 'L' },
      ),
      r(
        'P53-L02-Q6',
        '同学说“5/5 不是假分数，因为假分数一定大于 1”。怎样补全规则？',
        'A learner says 5/5 is not improper because improper fractions must exceed one. How should the rule be completed?',
        kind,
        '对本单元正分数，假分数的分子大于或等于分母。5/5=1 属于等于的边界；假分数可以等于 1，不一定严格大于 1。“假”不意味着数量不存在。',
        'For positive fractions here, an improper fraction has numerator greater than or equal to denominator. 5/5=1 is the equality boundary: an improper fraction need not strictly exceed one. “Improper” does not make the quantity unreal.',
        [
          '五个五分之一恰好凑成什么？',
          'What do five fifths make?',
          '规则里是否需要“或等于”？',
          'Does the rule need “or equal to”?',
        ],
      ),
    ],
    exit: q(
      'P53-L02-X',
      '七块面包，每块是同样大小面包整体的 1/5。总量写成分母为 5 的假分数。',
      'Seven pieces are each one fifth of equal-sized loaves. Write the total as an improper fraction with denominator five.',
      '7/5',
      kind,
      [
        '所有整体必须一样大。',
        'All loaf wholes must be equal in size.',
        '分子数七块，分母保持每整体五等份。',
        'Count seven parts; retain five equal parts per whole.',
      ],
      [
        T('七个五分之一是 7/5。', 'Seven fifths make 7/5.'),
        T(
          '5/5 是一整块，还有 2/5。',
          '5/5 is one whole loaf, with 2/5 remaining.',
        ),
      ],
      ['7/5'],
      ['5/7', '14/10', '1 2/5'],
      { rule: 'improper', denominator: 5 },
    ),
    exitReason: T(
      '用图解释为什么它超过一个整体，并说明分母为什么不随整体条数增加。',
      'Explain with a diagram why it exceeds one whole, and why the denominator does not grow with the number of strips.',
    ),
    parent: {
      goal: T(
        '以一个整体为基准理解正分数的分类，包含等于 1 的边界。',
        'Use one whole as the reference for positive-fraction classification, including equality at one.',
      ),
      misconception: T(
        '以为分子不能比分母大；把假分数当成不存在的数量。',
        'Assuming a numerator cannot exceed its denominator or an improper fraction is not a real amount.',
      ),
      prompts: [
        T('每个整体由几小份组成？', 'How many small parts make each whole?'),
        T(
          '分子等于分母时，图恰好怎样？',
          'What does the diagram show when numerator equals denominator?',
        ),
      ],
      bridge: 'P53-L01',
    },
  }),
  p53Lesson({
    id: 'P53-L03',
    title: T('带分数与假分数互化', 'Mixed numbers and improper fractions'),
    objective: T(
      '用每个整体的小份数解释带分数与假分数的互化。',
      'Explain conversion between mixed numbers and improper fractions using parts per whole.',
    ),
    prerequisites: ['P53-L02'],
    keywords: [
      T('带分数', 'mixed number'),
      T('假分数', 'improper fraction'),
      T('余下的小份', 'remaining parts'),
    ],
    minutes: 16,
    lab: 'fraction-mixed',
    hook: T(
      '十一块四分之一能拼成几整条和几小份？2 3/4 与 11/4 是两种数量，还是同一数量的两种记法？',
      'Eleven quarters make how many wholes and leftover parts? Are 2 3/4 and 11/4 two amounts or two descriptions of one amount?',
    ),
    guided: q(
      'P53-L03-G',
      '把 11/4 写成带分数。整数部分与分数之间留空格，如 2 1/3。',
      'Write 11/4 as a mixed number. Leave a space between the whole and fraction, for example 2 1/3.',
      '11/4',
      mixed,
      [
        '四个四分之一合成一。',
        'Four quarters make one.',
        '11=2×4+3，余下三份仍是四分之一。',
        '11=2×4+3; three remaining parts are still quarters.',
      ],
      [
        T(
          '11÷4 得 2 个完整整体，余 3。',
          '11÷4 gives two complete wholes and remainder three.',
        ),
        T(
          '11/4=2 3/4，分数部分的分母不变。',
          '11/4=2 3/4; the fractional denominator stays unchanged.',
        ),
      ],
      ['2 3/4', '2 6/8'],
      ['11/4', '2.75', '2 3/11', '1 7/4'],
      { rule: 'mixed' },
    ),
    questions: [
      c(
        'P53-L03-Q1',
        '2 1/3 等于哪个假分数？',
        'Which improper fraction equals 2 1/3?',
        2,
        mixed,
        [
          [
            '3/3',
            '3/3',
            '2 是两个整体，每个含三份，不能只加 2+1。',
            'Two counts wholes with three parts each; do not simply add 2+1.',
          ],
          [
            '5/3',
            '5/3',
            '两个整体应有六个三分之一，再加一份。',
            'Two wholes have six thirds before adding the extra third.',
          ],
          ['7/3', '7/3', '2×3+1=7 个三分之一。', '2×3+1=7 thirds.'],
        ],
        [
          '一个完整整体含几个三分之一？',
          'How many thirds are in one whole?',
          '先算两个整体的小份数，再加余下的一份。',
          'Count parts in two wholes, then add the remaining part.',
        ],
        [
          T(
            '2 个整体含 2×3=6 个三分之一。',
            'Two wholes contain 2×3=6 thirds.',
          ),
          T('再加一份，合计 7/3。', 'Add one part to get 7/3.'),
        ],
      ),
      q(
        'P53-L03-Q2',
        '把 2 2/5 写成分母为 5 的假分数。',
        'Write 2 2/5 as an improper fraction with denominator five.',
        '12/5',
        mixed,
        [
          '每个整体有五小份。',
          'Each whole has five small parts.',
          '2×5+2 是小份总数。',
          '2×5+2 counts all the small parts.',
        ],
        [
          T('两个整体是 10/5。', 'Two wholes are 10/5.'),
          T('加 2/5 得 12/5。', 'Adding 2/5 gives 12/5.'),
        ],
        ['12/5'],
        ['4/5', '24/10', '2 2/5'],
        { rule: 'improper', denominator: 5 },
      ),
      q(
        'P53-L03-Q3',
        '图中涂色十三个六分之一，写成带分数。',
        'The diagram shades thirteen sixths. Write the amount as a mixed number.',
        '13/6',
        mixed,
        [
          '每六份合成一个整体。',
          'Each six parts make one whole.',
          '13=2×6+1。',
          '13=2×6+1.',
        ],
        [
          T(
            '涂满两条，还剩一个六分之一。',
            'Two strips are full, with one sixth remaining.',
          ),
          T('13/6=2 1/6。', '13/6=2 1/6.'),
        ],
        ['2 1/6', '2 2/12'],
        ['13/6', '2 1/13', '1 7/6'],
        {
          rule: 'mixed',
          diagram: { kind: 'fraction-bars', values: [{ n: 13, d: 6 }] },
        },
      ),
      q(
        'P53-L03-Q4',
        '把 3 1/4 写成分母为 4 的假分数。',
        'Write 3 1/4 as an improper fraction with denominator four.',
        '13/4',
        mixed,
        [
          '三个完整整体含十二个四分之一。',
          'Three wholes contain twelve quarters.',
          '再把余下的一份加入分子。',
          'Add the remaining part to the numerator.',
        ],
        [T('3×4+1=13。', '3×4+1=13.'), T('总共 13/4。', 'The total is 13/4.')],
        ['13/4'],
        ['4/4', '26/8', '3 1/4'],
        { rule: 'improper', denominator: 4 },
      ),
      q(
        'P53-L03-Q5',
        '九段绳子各长 1/2 米。总长用带分数表示，单位为米。',
        'Nine rope lengths are each 1/2 metre. Write the total length as a mixed number in metres.',
        '9/2',
        mixed,
        [
          '先计九个二分之一米。',
          'Count nine half-metres first.',
          '每两份合成一米，还剩一份。',
          'Every two halves make a metre, with one part left.',
        ],
        [
          T('9/2 米=4 1/2 米。', '9/2 metres=4 1/2 metres.'),
          T('检查：4×2+1=9 个半米。', 'Check: 4×2+1=9 half-metres.'),
        ],
        ['4 1/2', '4 2/4 m'],
        ['9/2', '4.5', '4 1/9', '4 1/2 km'],
        { rule: 'mixed', unit: 'm' },
      ),
      r(
        'P53-L03-Q6',
        '同学把 2 1/3 写成 (2+1)/3=3/3。为什么错？',
        'A learner writes 2 1/3 as (2+1)/3=3/3. Why is that wrong?',
        mixed,
        '2 表示整体，不是两个三分之一；每个整体有三个三分之一。两个整体要换成六小份，再加一份，共 7/3。允许用两整条和一份的图说明；不能只给正确答案而不指出单位错误。',
        'Two counts wholes, not two thirds. Each whole has three thirds; two wholes become six parts, then one more gives 7/3. A drawing of two wholes and one third is valid. Explain the unit error rather than only give the answer.',
        [
          '2 的单位是什么？',
          'What unit does the two count?',
          '把两个整体换成三分之一计数。',
          'Count the two wholes in thirds.',
        ],
      ),
    ],
    exit: q(
      'P53-L03-X',
      '八个三分之一升的果汁合在一起，总量用带分数表示，单位为升。',
      'Combine eight one-third-litre amounts. Write the total as a mixed number in litres.',
      '8/3',
      mixed,
      [
        '每三份合成一升。',
        'Every three parts make one litre.',
        '8=2×3+2。',
        '8=2×3+2.',
      ],
      [
        T('8/3 升=2 2/3 升。', '8/3 litres=2 2/3 litres.'),
        T(
          '两个整体加两份，仍是八个三分之一。',
          'Two wholes plus two parts still count eight thirds.',
        ),
      ],
      ['2 2/3', '2 4/6 L'],
      ['8/3', '2 2/8', '1 5/3'],
      { rule: 'mixed', unit: 'L' },
    ),
    exitReason: T(
      '说明整数部分在数什么、分数部分在数什么，再换回假分数检查。',
      'Explain what each part of the mixed number counts, then convert back to check.',
    ),
    parent: {
      goal: T(
        '用单位换算解释互化，不只背乘加公式。',
        'Explain conversion through units rather than memorise a multiply-and-add rule.',
      ),
      misconception: T(
        '把整数部分直接加到分子；余数误放到分母；带分数误读成乘法。',
        'Adding the whole directly to the numerator, putting the remainder in the denominator, or reading a mixed number as multiplication.',
      ),
      prompts: [
        T(
          '一个整体有多少个这种小份？',
          'How many of these small parts make one whole?',
        ),
        T(
          '换回原来的表示，数量还能对上吗？',
          'Does conversion back recover the original quantity?',
        ),
      ],
      bridge: 'P53-L02',
    },
  }),
  p53Lesson({
    id: 'P53-L04',
    title: T('等值分数与分数条', 'Equivalent fractions with strips'),
    objective: T(
      '用同一个整体的重新等分解释并产生等值分数。',
      'Explain and generate equivalent fractions by repartitioning the same whole.',
    ),
    prerequisites: ['B04-L01', 'B04-L02', 'P53-L01'],
    keywords: [
      T('等值分数', 'equivalent fraction'),
      T('分子', 'numerator'),
      T('分母', 'denominator'),
    ],
    minutes: 16,
    lab: 'fraction-equivalent',
    hook: T(
      '两块同样大小的巧克力，取一块的 1/2 与另一块的 2/4。切法不同，拿走的总量变了吗？',
      'Take 1/2 of one chocolate bar and 2/4 of another equal-sized bar. Does a different cut change the total taken?',
    ),
    guided: q(
      'P53-L04-G',
      '2/3 = ?/6，缺少的分子是多少？',
      '2/3 = ?/6. What numerator is missing?',
      '4',
      equivalent,
      [
        '把每个三分之一再等分成两份。',
        'Split each third into two equal parts.',
        '分母乘 2，涂色小份数也乘 2。',
        'The denominator doubles, and the shaded part count doubles.',
      ],
      [
        T('3×2=6。', '3×2=6.'),
        T('2×2=4，因此 2/3=4/6。', '2×2=4, so 2/3=4/6.'),
      ],
      ['4'],
      ['2', '6', '5'],
    ),
    questions: [
      c(
        'P53-L04-Q1',
        '哪个分数与 1/2 等值？',
        'Which fraction equals 1/2?',
        1,
        equivalent,
        [
          [
            '1/4',
            '1/4',
            '只把分母加倍，每份变小，但份数没变，总量减半。',
            'Doubling only the denominator halves the amount when the count stays fixed.',
          ],
          [
            '2/4',
            '2/4',
            '每个半份再分成两份，涂色一半变成两份四分之一。',
            'Splitting each half in two turns the shaded half into two quarters.',
          ],
          [
            '2/3',
            '2/3',
            '三个等份中的两份超过一半。',
            'Two of three equal parts exceed half.',
          ],
        ],
        [
          '先确定比较的是同样大小的整体。',
          'Use equal-sized wholes.',
          '两份四分之一能否铺满一个半份？',
          'Do two quarters cover exactly one half?',
        ],
        [
          T('1/2=(1×2)/(2×2)=2/4。', '1/2=(1×2)/(2×2)=2/4.'),
          T(
            '小份变细，总涂色量没变。',
            'The parts become finer; total shading stays fixed.',
          ),
        ],
      ),
      q(
        'P53-L04-Q2',
        '2/3 = ?/12，缺少的分子是多少？',
        '2/3 = ?/12. Find the numerator.',
        '8',
        equivalent,
        [
          '3 要乘多少才得到 12？',
          'What factor changes three to twelve?',
          '分子乘同一个数。',
          'Multiply the numerator by the same factor.',
        ],
        [
          T('3×4=12。', '3×4=12.'),
          T('2×4=8，所以 2/3=8/12。', '2×4=8, so 2/3=8/12.'),
        ],
        ['8'],
        ['2', '6', '12'],
      ),
      q(
        'P53-L04-Q3',
        '3/4 = 9/?，缺少的分母是多少？',
        '3/4 = 9/?. Find the denominator.',
        '12',
        equivalent,
        [
          '分子从 3 变成 9，乘了 3。',
          'The numerator changes from three to nine by a factor of three.',
          '分母也要乘 3。',
          'The denominator must use the same factor.',
        ],
        [
          T('3×3=9。', '3×3=9.'),
          T('4×3=12，所以 3/4=9/12。', '4×3=12, so 3/4=9/12.'),
        ],
        ['12'],
        ['4', '9', '7'],
      ),
      q(
        'P53-L04-Q4',
        'A 是 2/5；B 把同一整体分成十等份。用分母为 10 的分数写出 B 的同量涂色。',
        'A shows 2/5; B uses ten equal parts of the same-sized whole. Write the equal shading in B as a fraction with denominator ten.',
        '4/10',
        equivalent,
        [
          '每个五分之一变成两个十分之一。',
          'Each fifth becomes two tenths.',
          '涂色两份五分之一，对应四份十分之一。',
          'Two shaded fifths correspond to four shaded tenths.',
        ],
        [
          T('5×2=10，2×2=4。', '5×2=10 and 2×2=4.'),
          T(
            'B 的写法为 4/10，与 2/5 等值。',
            'B is written 4/10, equal in value to 2/5.',
          ),
        ],
        ['4/10', '4 /10'],
        ['2/10', '2/5', '8/20'],
        {
          fraction: true,
          denominator: 10,
          diagram: {
            kind: 'fraction-bars',
            values: [
              { n: 2, d: 5 },
              { n: 4, d: 10 },
            ],
          },
        },
      ),
      r(
        'P53-L04-Q5',
        '3/6 = 1/2 对吗？用分数条或等份重新分组说明。',
        'Is 3/6 = 1/2 true? Explain with strips or regrouped equal parts.',
        equivalent,
        '对；同一个整体中，三个六分之一恰好覆盖一个二分之一。把六小份每三份合为一组，整体成为两组，涂色一组；或分子分母同时除以 3。必须说明整体与总量保持不变，不只回答“对”。',
        'True: three sixths cover exactly one half of the same whole. Group the six parts in threes: two groups make the whole and one is shaded. Dividing numerator and denominator by three is also valid. Explain the unchanged whole and amount, not only “true”.',
        [
          '每三个六分之一合成什么？',
          'What do three sixths make?',
          '整体一共有几组三小份？',
          'How many groups of three parts make the whole?',
        ],
        'true_false_reason',
      ),
      r(
        'P53-L04-Q6',
        '同学说 2/3 = 2/6，因为只把分母乘 2 就是等值分数。找出错误。',
        'A learner says 2/3 = 2/6 because doubling only the denominator gives an equivalent fraction. Find the error.',
        equivalent,
        '只把分母乘 2，使每份减半，却仍只取两份，总量也减半。保留原涂色区域时，分子也要乘 2，正确是 2/3=4/6。可用两条同样长的分数条解释。',
        'Doubling only the denominator halves each part while still taking just two; the total halves. To preserve shading, double the numerator too: 2/3=4/6. Two equal-length strips can show this.',
        [
          '每份变小后，涂色总量要怎样保持？',
          'How can total shading stay fixed when each part becomes smaller?',
          '把原来的每一涂色份也分成两份。',
          'Split each original shaded part into two as well.',
        ],
      ),
      c(
        'P53-L04-Q7',
        '两杯原来装着同样多的果汁，分别喝掉 1/2 与 3/6。谁喝得多？',
        'Two cups initially hold equal amounts of juice. Drink 1/2 of one and 3/6 of the other. Who drinks more?',
        2,
        equivalent,
        [
          [
            '喝 1/2 的多',
            'The 1/2 drinker',
            '三个六分之一也是同一整体的一半。',
            'Three sixths are also half of the same-sized whole.',
          ],
          [
            '喝 3/6 的多',
            'The 3/6 drinker',
            '份数多，但每份更小，不能只比分子。',
            'There are more parts, but smaller ones; do not compare numerators alone.',
          ],
          [
            '一样多',
            'Equal amounts',
            '整体相同且分数等值，所以实际量相同。',
            'Equal wholes and equivalent fractions give equal actual amounts.',
          ],
        ],
        [
          '杯中原始总量是一样的吗？',
          'Are the original amounts equal?',
          '把一半分成三小份，整体共有六份。',
          'Split a half into three parts, making six per whole.',
        ],
        [
          T('1/2=3/6。', '1/2=3/6.'),
          T(
            '两杯原量相等，所以喝掉量相等。',
            'The original amounts match, so the amounts drunk match.',
          ),
        ],
      ),
    ],
    exit: q(
      'P53-L04-X',
      '把 4/6 写成分母为 3 的等值分数。',
      'Write a fraction equal to 4/6 with denominator three.',
      '2/3',
      equivalent,
      [
        '两个六分之一合成一个三分之一。',
        'Two sixths make one third.',
        '分子分母同时除以 2。',
        'Divide numerator and denominator by two.',
      ],
      [
        T('4÷2=2；6÷2=3。', '4÷2=2; 6÷2=3.'),
        T(
          '得到 2/3，涂色量保持不变。',
          'The result is 2/3 with unchanged shading.',
        ),
      ],
      ['2/3'],
      ['4/3', '4/6', '8/12'],
      { fraction: true, denominator: 3 },
    ),
    exitReason: T(
      '不靠提示解释 4/6 与 2/3 为什么相等，再写出另一个等值分数并说明如何产生。',
      'Without hints, explain why 4/6 and 2/3 are equal, then give another equivalent fraction and explain how you made it.',
    ),
    parent: {
      goal: T(
        '先看总量不变，再把等分操作连接到同时乘除规则。',
        'Observe unchanged amount before connecting repartitioning to multiplying or dividing both numbers.',
      ),
      misconception: T(
        '只变分母、只比分子，或忽略同样大小的整体。',
        'Changing only the denominator, comparing only numerators, or ignoring equal whole sizes.',
      ),
      prompts: [
        T(
          '切得更细后，总涂色量有没有变？',
          'Did total shading change when the cuts became finer?',
        ),
        T(
          '原来涂色的一份现在对应几小份？',
          'How many new small parts correspond to one original shaded part?',
        ),
      ],
      bridge: 'P53-L01',
    },
  }),
  p53Lesson({
    id: 'P53-L05',
    title: T('约分与最简分数', 'Simplifying fractions'),
    objective: T(
      '用共同分组解释约分，并检查分子分母是否仍有共同因数。',
      'Explain simplification through common grouping and check for remaining common factors.',
    ),
    prerequisites: ['P53-L04'],
    keywords: [
      T('共同因数', 'common factor'),
      T('约分', 'simplification'),
      T('最简分数', 'simplest form'),
    ],
    minutes: 16,
    lab: 'fraction-simplify',
    hook: T(
      '把十二份涂色的十八等份重新分组：先约成 6/9 就可以停了吗？每次分组会改变总量吗？',
      'Regroup twelve shaded parts out of eighteen. Can you stop at 6/9? Does each regrouping change the amount?',
    ),
    guided: q(
      'P53-L05-G',
      '把 12/18 写成最简分数。',
      'Write 12/18 in simplest form.',
      '2/3',
      simplest,
      [
        '12 与 18 都可以除以 6。',
        'Twelve and eighteen both divide by six.',
        '结果的分子与分母还共有大于 1 的因数吗？',
        'Do the resulting numbers still share a factor greater than one?',
      ],
      [
        T('12÷6=2，18÷6=3。', '12÷6=2 and 18÷6=3.'),
        T(
          '2 与 3 没有大于 1 的共同因数，最简为 2/3。',
          'Two and three share no factor above one, so 2/3 is simplest.',
        ),
      ],
      ['2/3', '2 / 3'],
      ['6/9', '12/18', '0.666', '1/3'],
      { rule: 'simplest' },
    ),
    questions: [
      c(
        'P53-L05-Q1',
        '18/24 的最简分数是哪一个？',
        'Which is the simplest form of 18/24?',
        2,
        simplest,
        [
          [
            '9/12',
            '9/12',
            '这是等值的中间结果，还可同除以 3。',
            'This equivalent intermediate result still divides by three.',
          ],
          ['6/8', '6/8', '还可同除以 2。', 'Both numbers still divide by two.'],
          [
            '3/4',
            '3/4',
            '18 与 24 同除以 6，3 与 4 已互质。',
            'Divide eighteen and twenty-four by six; three and four have no common factor above one.',
          ],
        ],
        [
          '不仅要等值，还要不能继续共同分组。',
          'It must be equivalent and have no further common grouping.',
          '检查分子分母的共同因数。',
          'Check common factors of numerator and denominator.',
        ],
        [
          T('18÷6=3，24÷6=4。', '18÷6=3 and 24÷6=4.'),
          T('3/4 已不能继续约分。', '3/4 cannot be simplified further.'),
        ],
      ),
      q(
        'P53-L05-Q2',
        '把 8/12 约成最简分数。',
        'Simplify 8/12 fully.',
        '2/3',
        simplest,
        [
          '8 与 12 都有因数 4。',
          'Eight and twelve both have factor four.',
          '两数同时除以 4。',
          'Divide both numbers by four.',
        ],
        [
          T('8÷4=2，12÷4=3。', '8÷4=2 and 12÷4=3.'),
          T(
            '2/3 保留原量，已无共同因数大于 1。',
            '2/3 preserves the amount and has no common factor above one.',
          ),
        ],
        ['2/3'],
        ['4/6', '8/12', '2/12'],
        { rule: 'simplest' },
      ),
      q(
        'P53-L05-Q3',
        '图中十个十五分之一，写成最简分数。',
        'The diagram shows ten fifteenths. Write it in simplest form.',
        '2/3',
        simplest,
        [
          '每五小份合成一组。',
          'Group each five small parts together.',
          '十五份变三组，十份涂色变两组。',
          'Fifteen parts become three groups; ten shaded parts become two.',
        ],
        [
          T('分子分母同时除以 5。', 'Divide both numbers by five.'),
          T(
            '10/15=2/3，整体和涂色量不变。',
            '10/15=2/3, preserving the whole and shading.',
          ),
        ],
        ['2/3'],
        ['10/15', '5/7', '1/3'],
        {
          rule: 'simplest',
          diagram: { kind: 'fraction-bars', values: [{ n: 10, d: 15 }] },
        },
      ),
      q(
        'P53-L05-Q4',
        '把 16/20 写成最简分数。',
        'Write 16/20 in simplest form.',
        '4/5',
        simplest,
        [
          '共同因数为 4。',
          'Four is a common factor.',
          '约分后检查 4 与 5 是否还有共同因数。',
          'After simplifying, check common factors of four and five.',
        ],
        [
          T('16÷4=4，20÷4=5。', '16÷4=4 and 20÷4=5.'),
          T('最简为 4/5。', 'The simplest form is 4/5.'),
        ],
        ['4/5'],
        ['8/10', '16/20', '4/20'],
        { rule: 'simplest' },
      ),
      q(
        'P53-L05-Q5',
        '量杯中有 9/12 升牛奶。用最简分数写出升数。',
        'A measuring jug holds 9/12 litre of milk. Write the amount in litres as a simplest fraction.',
        '3/4',
        simplest,
        [
          '同除以 3 不改变容量。',
          'Dividing both numbers by three preserves volume.',
          '最简结果仍带升的单位。',
          'Retain litres as the unit.',
        ],
        [
          T('9/12=3/4。', '9/12=3/4.'),
          T(
            '3 与 4 没有共同因数大于 1，容量仍为 3/4 升。',
            'Three and four share no factor above one; the volume remains 3/4 litre.',
          ),
        ],
        ['3/4', '3/4 L'],
        ['6/8', '9/12', '0.75', '3/4 m'],
        { rule: 'simplest', unit: 'L' },
      ),
      r(
        'P53-L05-Q6',
        '同学把 12/18 约成 6/9，说“已经最简”。怎样检查并继续？',
        'A learner reduces 12/18 to 6/9 and calls it simplest. How can you check and continue?',
        simplest,
        '6/9 与 12/18 等值，所以这一步没有改变数量；但 6 与 9 仍有共同因数 3。再同时除以 3 得 2/3，2 与 3 已无大于 1 的共同因数。要区分“等值中间结果”和“最终最简”。',
        '6/9 is equivalent to 12/18, so the first step preserves value. But six and nine still share factor three. Divide both by three to reach 2/3, which has no common factor above one. Distinguish an equivalent intermediate result from a fully simplified one.',
        [
          '6 与 9 还能同时除以什么？',
          'What factor still divides both six and nine?',
          '约分的结束条件是什么？',
          'What tells you simplification is finished?',
        ],
      ),
    ],
    exit: q(
      'P53-L05-X',
      '有 15/20 升果汁，把这个量写成最简分数，单位为升。',
      'There are 15/20 litre of juice. Write the amount in simplest fractional form, in litres.',
      '3/4',
      simplest,
      [
        '15 与 20 同除以 5。',
        'Divide fifteen and twenty by five.',
        '结果要等值且不能继续约分。',
        'The result must preserve value and be fully simplified.',
      ],
      [
        T('15÷5=3，20÷5=4。', '15÷5=3 and 20÷5=4.'),
        T(
          '3/4 升是最简，容量没有改变。',
          '3/4 litre is simplest; the volume is unchanged.',
        ),
      ],
      ['3/4', '3 / 4 L'],
      ['15/20', '6/8', '3/5'],
      { rule: 'simplest', unit: 'L' },
    ),
    exitReason: T(
      '说明你怎样确认总量不变，以及结果已经不能继续约分。',
      'Explain how you know the amount is unchanged and the result cannot be simplified further.',
    ),
    parent: {
      goal: T(
        '把约分理解为相同小份的共同分组，再检查最简。',
        'Understand simplification as common grouping of equal parts, then check simplest form.',
      ),
      misconception: T(
        '看到数字变小就以为数量变少，或做到一个等值分数就停止。',
        'Assuming smaller written numbers mean a smaller amount, or stopping at any equivalent fraction.',
      ),
      prompts: [
        T(
          '这次每几个原小份合成一组？',
          'How many original parts make each new group?',
        ),
        T(
          '新分子分母还有共同因数吗？',
          'Do the new numerator and denominator still have a common factor?',
        ),
      ],
      bridge: 'P53-L04',
    },
  }),
  p53Lesson({
    id: 'P53-L06',
    title: T('通分与比较大小', 'Common denominators and comparison'),
    objective: T(
      '为同一整体的分数找到共同小单位，再准确比较大小。',
      'Find a common small unit for fractions of the same whole and compare them exactly.',
    ),
    prerequisites: ['P53-L04', 'P53-L05'],
    keywords: [
      T('共同分母', 'common denominator'),
      T('通分', 'common-denominator form'),
      T('比较', 'comparison'),
    ],
    minutes: 17,
    lab: 'fraction-compare',
    hook: T(
      '3/4 与 2/3，只看分子或分母能判断吗？若两条都用十二分之一计数，会看到什么？',
      'Can numerator or denominator alone compare 3/4 and 2/3? What happens when both strips use twelfths?',
    ),
    guided: q(
      'P53-L06-G',
      '把 3/4 改写为 ?/12 来与 2/3 比较。缺少的分子是多少？',
      'Rewrite 3/4 as ?/12 to compare it with 2/3. What numerator is missing?',
      '9',
      compare,
      [
        '4×3=12，分子也乘 3。',
        '4×3=12; multiply the numerator by three too.',
        '3×3 得到几份十二分之一？',
        'How many twelfths does 3×3 give?',
      ],
      [
        T('3/4=9/12；2/3=8/12。', '3/4=9/12; 2/3=8/12.'),
        T(
          '同单位比较份数，9>8，所以 3/4>2/3。',
          'With matching units, compare counts: nine exceeds eight, so 3/4>2/3.',
        ),
      ],
      ['9'],
      ['3', '8', '12'],
    ),
    questions: [
      c(
        'P53-L06-Q1',
        '大蛋糕的 1/2 与小蛋糕的 3/4，哪一个实际蛋糕量多？没有给两块蛋糕的大小。',
        'Which actual amount is greater: 1/2 of a large cake or 3/4 of a small cake? Their sizes are not given.',
        1,
        compare,
        [
          [
            '小蛋糕的 3/4 一定多',
            '3/4 of the small cake must be more',
            '3/4>1/2 只比较同一大小整体的比例，不能忽略蛋糕大小。',
            '3/4>1/2 compares proportions of equal-sized wholes; cake sizes still matter.',
          ],
          [
            '只凭分数不能确定实际量',
            'Fractions alone cannot determine actual amounts',
            '还需要两个整体的大小才能比较实际量。',
            'Whole sizes are needed to compare actual amounts.',
          ],
          [
            '大蛋糕的 1/2 一定多',
            '1/2 of the large cake must be more',
            '“大”与“小”没有给出比例，大蛋糕可能只是稍大。',
            'The size ratio is unspecified; the large cake may be only slightly larger.',
          ],
        ],
        [
          '分数的整体一样大吗？',
          'Are the fraction wholes equal in size?',
          '比较比例与比较实际量要区分。',
          'Distinguish comparing proportions from comparing actual amounts.',
        ],
        [
          T(
            '整体大小不同且比例未知。',
            'Whole sizes differ and their size ratio is unknown.',
          ),
          T(
            '不能仅凭 1/2 与 3/4 确定实际蛋糕量。',
            'The fractions alone cannot determine actual cake amounts.',
          ),
        ],
      ),
      q(
        'P53-L06-Q2',
        '用十二分之一比较 5/6 与 3/4。5/6 = ?/12，缺少的分子是多少？',
        'Compare 5/6 and 3/4 in twelfths. For 5/6 = ?/12, find the numerator.',
        '10',
        compare,
        ['6×2=12。', '6×2=12.', '5 也乘 2。', 'Multiply five by two as well.'],
        [
          T('5/6=10/12，3/4=9/12。', '5/6=10/12 and 3/4=9/12.'),
          T('10>9，所以 5/6 较大。', 'Ten exceeds nine, so 5/6 is greater.'),
        ],
        ['10'],
        ['5', '9', '12'],
      ),
      q(
        'P53-L06-Q3',
        '图中 A 为 3/5，B 为 7/10，整体一样大。用分数写较大的量。',
        'A is 3/5 and B is 7/10 of equal-sized wholes. Write the greater amount as a fraction.',
        '7/10',
        compare,
        [
          '把 A 的每份分成两个十分之一。',
          'Split each part of A into two tenths.',
          '3/5=6/10，再与 7/10 比。',
          '3/5=6/10; compare with 7/10.',
        ],
        [
          T('6/10<7/10。', '6/10<7/10.'),
          T('较大是 7/10，相差 1/10。', '7/10 is greater, by 1/10.'),
        ],
        ['7/10', '14/20'],
        ['3/5', '6/10', '10/7'],
        {
          fraction: true,
          diagram: {
            kind: 'fraction-bars',
            values: [
              { n: 3, d: 5 },
              { n: 7, d: 10 },
            ],
          },
        },
      ),
      q(
        'P53-L06-Q4',
        '4/9 与 5/12 的最小共同分母是多少？',
        'What is the least common denominator for 4/9 and 5/12?',
        '36',
        compare,
        [
          '找同时是 9 与 12 倍数的最小正整数。',
          'Find the smallest positive multiple of both nine and twelve.',
          '9 的倍数 9、18、27、36；12 的倍数 12、24、36。',
          'Multiples of nine: 9,18,27,36; multiples of twelve: 12,24,36.',
        ],
        [
          T('最小共同倍数是 36。', 'The least common multiple is thirty-six.'),
          T(
            '因此可写成 16/36 与 15/36。',
            'The fractions become 16/36 and 15/36.',
          ),
        ],
        ['36'],
        ['21', '108', '12'],
      ),
      q(
        'P53-L06-Q5',
        '同一单位下，两段假想步道长 5/8 km 与 2/3 km。用分数写较长的千米数。',
        'Two imaginary track sections measure 5/8 km and 2/3 km in the same unit. Write the longer distance as a fraction of a kilometre.',
        '2/3',
        compare,
        [
          '把一个千米作为共同计量整体。',
          'Use one kilometre as the shared measurement whole.',
          '通成二十四分之一：15/24 与 16/24。',
          'Convert to twenty-fourths: 15/24 and 16/24.',
        ],
        [
          T('5/8=15/24，2/3=16/24。', '5/8=15/24 and 2/3=16/24.'),
          T('较长是 2/3 km，多 1/24 km。', '2/3 km is longer, by 1/24 km.'),
        ],
        ['2/3', '4/6 km'],
        ['5/8', '15/24', '2/3 m'],
        { fraction: true, unit: 'km' },
      ),
      r(
        'P53-L06-Q6',
        '同学说 1/8>1/6，因为 8>6。用同一个整体的等分来纠错。',
        'A learner says 1/8>1/6 because eight exceeds six. Correct this using equal parts of the same whole.',
        compare,
        '同一个整体分成更多等份时，每份更小。八分之一比六分之一小；或通成二十四分之一：1/8=3/24，1/6=4/24，所以 1/8<1/6。必须说明整体相同，不能只反转符号。',
        'For the same whole, more equal parts make each part smaller. One eighth is smaller than one sixth. Alternatively, 1/8=3/24 and 1/6=4/24, so 1/8<1/6. Identify the shared whole rather than only reverse the sign.',
        [
          '整体是否固定？',
          'Is the whole fixed?',
          '相同整体分得越细，每份变大还是变小？',
          'Do finer equal cuts make each part larger or smaller?',
        ],
      ),
    ],
    exit: q(
      'P53-L06-X',
      '同样大小的两块园地，分别有 7/12 与 5/8 需要浇水。用分数写较大的比例。',
      'Two equal-sized garden plots need watering over 7/12 and 5/8 of their areas. Write the greater fraction.',
      '5/8',
      compare,
      [
        '整体一样大，先找共同小单位。',
        'The wholes match; find a common small unit.',
        '用二十四分之一比较 14/24 和 15/24。',
        'Compare 14/24 and 15/24.',
      ],
      [
        T('7/12=14/24；5/8=15/24。', '7/12=14/24; 5/8=15/24.'),
        T('较大比例是 5/8。', 'The greater fraction is 5/8.'),
      ],
      ['5/8', '15/24'],
      ['7/12', '14/24', '8/5'],
      { fraction: true },
    ),
    exitReason: T(
      '说明共同分母为什么让比较有效；若园地面积不同，能否只凭分数比较浇水面积？',
      'Explain why a common denominator makes comparison valid. If plot sizes differ, can these fractions alone compare actual areas?',
    ),
    familyChallenge: T(
      '家庭挑战：在一张假想新西兰 1 km 步道草图上，用两条同长纸带表示 2/3 km 和 3/4 km。先预测长短，通成十二分之一并标出差距；再保持标尺不变，把其中一条代表的整体改成 2 km 并改好标签，说明哪些实际长度结论需要重新检查。保留图、等值式和一句理由，不计分，也不需要出行。',
      'Family challenge: on an imaginary one-kilometre New Zealand track sketch, use two equal paper strips for 2/3 km and 3/4 km. Predict the order, repartition into twelfths and mark the difference. Then keep the drawing scale fixed, change one labelled whole to two kilometres, and explain which actual-length conclusions need rechecking. Keep a diagram, equivalent expressions and a reason. No score or outing is needed.',
    ),
    parent: {
      goal: T(
        '先确认同一计量整体，再用共同单位比较份数。',
        'Confirm a shared measurement whole before comparing counts of common units.',
      ),
      misconception: T(
        '只比较分子或分母；把共同分母随意相加；忽略不同整体。',
        'Comparing only numerators or denominators, adding denominators arbitrarily, or ignoring different wholes.',
      ),
      prompts: [
        T(
          '每一小份的单位现在一样吗？',
          'Are the small-part units now the same?',
        ),
        T(
          '你能在同长分数条上标出差距吗？',
          'Can you mark the difference on equal-length strips?',
        ),
      ],
      bridge: 'P53-L04',
    },
  }),
];
export const p53CheckQuestions: Question[] = [
  q(
    'P53-CHECK-Q1',
    '一个整体有七等份，一份写成单位分数。',
    'A whole has seven equal parts. Write one part as a unit fraction.',
    '1/7',
    unit,
    [
      '分子计一份。',
      'The numerator counts one part.',
      '分母计每整体七份。',
      'The denominator counts seven parts per whole.',
    ],
    [T('一份为 1/7。', 'One part is 1/7.')],
    ['1/7'],
    ['7', '2/14'],
    { rule: 'unit' },
  ),
  c(
    'P53-CHECK-Q2',
    '11/4 与一个整体相比属于哪一类？',
    'How is 11/4 classified relative to one whole?',
    1,
    kind,
    [
      [
        '真分数，小于 1',
        'Proper, below one',
        '十一份超过四份，不能小于一。',
        'Eleven parts exceed four, so this is not below one.',
      ],
      [
        '假分数，大于 1',
        'Improper, above one',
        '分子大于分母。',
        'The numerator exceeds the denominator.',
      ],
      [
        '恰好等于 1',
        'Exactly one',
        '等于一需要分子与分母相等。',
        'Equality at one requires matching numerator and denominator.',
      ],
    ],
    [
      '四份合成一个整体。',
      'Four parts make one whole.',
      '十一份能超过四份吗？',
      'Do eleven parts exceed four?',
    ],
    [T('11>4，所以 11/4>1，是假分数。', '11>4, so 11/4>1 and is improper.')],
  ),
  q(
    'P53-CHECK-Q3',
    '把 9/4 写成带分数。',
    'Write 9/4 as a mixed number.',
    '9/4',
    mixed,
    [
      '9=2×4+1。',
      '9=2×4+1.',
      '余下一份仍是四分之一。',
      'The remaining part is still a quarter.',
    ],
    [T('9/4=2 1/4。', '9/4=2 1/4.')],
    ['2 1/4', '2 2/8'],
    ['9/4', '2.25', '2 1/9'],
    { rule: 'mixed' },
  ),
  q(
    'P53-CHECK-Q4',
    '2 1/5 写成分母为 5 的假分数。',
    'Write 2 1/5 as an improper fraction with denominator five.',
    '11/5',
    mixed,
    [
      '两个整体有十个五分之一。',
      'Two wholes have ten fifths.',
      '再加一份。',
      'Add one more part.',
    ],
    [T('2×5+1=11，结果是 11/5。', '2×5+1=11, giving 11/5.')],
    ['11/5'],
    ['3/5', '22/10', '2 1/5'],
    { rule: 'improper', denominator: 5 },
  ),
  q(
    'P53-CHECK-Q5',
    '3/5=?/20，缺少的分子是多少？',
    '3/5=?/20. Find the missing numerator.',
    '12',
    equivalent,
    [
      '5×4=20。',
      '5×4=20.',
      '分子也乘 4。',
      'Multiply the numerator by four too.',
    ],
    [T('3×4=12，所以 3/5=12/20。', '3×4=12, so 3/5=12/20.')],
    ['12'],
    ['3', '8', '15'],
  ),
  q(
    'P53-CHECK-Q6',
    '把 18/24 写成最简分数。',
    'Write 18/24 in simplest form.',
    '3/4',
    simplest,
    [
      '共同因数为 6。',
      'Six is a common factor.',
      '结果不能还有共同因数大于 1。',
      'The result must have no common factor above one.',
    ],
    [
      T(
        '18÷6=3，24÷6=4，最简是 3/4。',
        '18÷6=3 and 24÷6=4; simplest form is 3/4.',
      ),
    ],
    ['3/4'],
    ['9/12', '6/8', '0.75'],
    { rule: 'simplest' },
  ),
  q(
    'P53-CHECK-Q7',
    '同一大小整体的 7/10 与 2/3，较大的比例用分数表示。',
    'For equal-sized wholes, write the greater fraction of 7/10 and 2/3.',
    '7/10',
    compare,
    [
      '共同分母为 30。',
      'Thirty is a common denominator.',
      '比较 21/30 和 20/30。',
      'Compare 21/30 and 20/30.',
    ],
    [
      T(
        '7/10=21/30，2/3=20/30，因此 7/10 较大。',
        '7/10=21/30 and 2/3=20/30, so 7/10 is greater.',
      ),
    ],
    ['7/10', '21/30'],
    ['2/3', '20/30', '10/7'],
    { fraction: true },
  ),
  r(
    'P53-CHECK-Q8',
    '取 50 克巧克力的一半，与 80 克巧克力的三分之一。有人只看 1/2>1/3 就说第一份更多。用实际量检查。',
    'Compare half of a fifty-gram bar with one third of an eighty-gram bar. Someone claims the first is larger using only 1/2>1/3. Check actual amounts.',
    unit,
    '两个整体大小不同。第一份 50÷2=25 克；第二份 80÷3=26 2/3 克，所以第二份实际更多。要说明分数比较的是同大小整体的比例，不是任意整体的实际量；可用按克标尺的图或除法检查。',
    'The wholes differ. The first portion is 50÷2=25 grams; the second is 80÷3=26 2/3 grams, so the second actual portion is larger. Fraction comparison alone assumes equal-sized wholes for actual-amount conclusions. A gram-scale diagram or division check is valid.',
    [
      '先确定两个整体的克数。',
      'Identify the mass of each whole.',
      '把分数转换成克再比较。',
      'Convert each fractional portion to grams before comparing.',
    ],
  ),
];
export function p53ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative review round');
  const k = round % 80,
    qid = `${id}-R${round}`;
  if (id === 'P53-L01') {
    const d = 2 + (k % 7);
    return q(
      qid,
      `一个整体等分 ${d} 份，一份写成单位分数。`,
      `Divide a whole into ${d} equal parts. Write one part as a unit fraction.`,
      `1/${d}`,
      unit,
      [
        '先确定一个整体。',
        'Identify one whole.',
        '分子为一，分母为等份数。',
        'The numerator is one; the denominator counts equal parts.',
      ],
      [
        T(
          `一份是 1/${d}，${d} 份合成整体。`,
          `One part is 1/${d}; ${d} parts make the whole.`,
        ),
      ],
      [`1/${d}`],
      [`2/${2 * d}`, `${d}`],
      { rule: 'unit' },
    );
  }
  if (id === 'P53-L02') {
    const d = 2 + (k % 5),
      n = k % 8 === 7 ? d : d + 1 + (k % 6);
    if (k % 2) {
      const wholes = Math.floor(n / d);
      return q(
        qid,
        `${n}/${d} 包含几个完整整体？`,
        `How many complete wholes are contained in ${n}/${d}?`,
        String(wholes),
        kind,
        [
          '每个整体需要分母所示的小份数。',
          'Each whole needs the number of parts shown by the denominator.',
          '只数完整组，不把余下小份算成整组。',
          'Count complete groups only.',
        ],
        [
          T(
            `${n}=${wholes}×${d}+${n % d}，共有 ${wholes} 个完整整体。`,
            `${n}=${wholes}×${d}+${n % d}, giving ${wholes} complete wholes.`,
          ),
        ],
        [String(wholes)],
        [String(wholes + 1), String(n)],
      );
    }
    return q(
      qid,
      `${n} 个 ${d} 分之一，写成分母为 ${d} 的假分数。`,
      `Write ${n} parts of 1/${d} as an improper fraction with denominator ${d}.`,
      `${n}/${d}`,
      kind,
      [
        '小份数写在分子。',
        'Put the part count in the numerator.',
        '每整体的等份数保持在分母。',
        'Retain parts per whole in the denominator.',
      ],
      [
        T(
          `${n}≥${d}，假分数是 ${n}/${d}。`,
          `${n}≥${d}; the improper fraction is ${n}/${d}.`,
        ),
      ],
      [`${n}/${d}`],
      [`${d}/${n}`, `${2 * n}/${2 * d}`],
      { rule: 'improper', denominator: d },
    );
  }
  if (id === 'P53-L03') {
    const d = 2 + (k % 5),
      whole = 1 + (k % 3),
      part = 1 + (k % (d - 1)),
      n = whole * d + part;
    return k % 2
      ? q(
          qid,
          `把 ${whole} ${part}/${d} 写成分母为 ${d} 的假分数。`,
          `Write ${whole} ${part}/${d} as an improper fraction with denominator ${d}.`,
          `${n}/${d}`,
          mixed,
          [
            '一个整体含分母所示的小份数。',
            'A whole contains the denominator’s number of parts.',
            '完整整体的小份数加余下份数。',
            'Add remaining parts to the parts in complete wholes.',
          ],
          [
            T(
              `${whole}×${d}+${part}=${n}，结果 ${n}/${d}。`,
              `${whole}×${d}+${part}=${n}, giving ${n}/${d}.`,
            ),
          ],
          [`${n}/${d}`],
          [`${whole + part}/${d}`, `${whole} ${part}/${d}`],
          { rule: 'improper', denominator: d },
        )
      : q(
          qid,
          `把 ${n}/${d} 写成带分数。`,
          `Write ${n}/${d} as a mixed number.`,
          `${n}/${d}`,
          mixed,
          [
            '先分出完整整体。',
            'Separate complete wholes first.',
            '余下小份的单位不变。',
            'The remaining-part unit stays fixed.',
          ],
          [
            T(
              `${n}=${whole}×${d}+${part}，带分数为 ${whole} ${part}/${d}。`,
              `${n}=${whole}×${d}+${part}, giving ${whole} ${part}/${d}.`,
            ),
          ],
          [`${whole} ${part}/${d}`],
          [`${n}/${d}`, `${whole + 1} ${part}/${d}`],
          { rule: 'mixed' },
        );
  }
  if (id === 'P53-L04') {
    const n = 1 + (k % 3),
      d = 4 + (k % 3),
      factor = 2 + (k % 4),
      findNumerator = k % 2 === 0,
      value = findNumerator ? n * factor : d * factor;
    return q(
      qid,
      findNumerator
        ? `${n}/${d}=?/${d * factor}，分子是多少？`
        : `${n}/${d}=${n * factor}/?，分母是多少？`,
      findNumerator
        ? `${n}/${d}=?/${d * factor}. Find the numerator.`
        : `${n}/${d}=${n * factor}/?. Find the denominator.`,
      String(value),
      equivalent,
      [
        '先找两边的倍数关系。',
        'Find the refinement factor.',
        '分子分母使用相同倍数。',
        'Use the same factor for numerator and denominator.',
      ],
      [
        T(
          `分子分母同乘 ${factor}，得到 ${n * factor}/${d * factor}。`,
          `Multiplying both by ${factor} gives ${n * factor}/${d * factor}.`,
        ),
      ],
      [String(value)],
      [String(findNumerator ? n : d), String(value + 1)],
    );
  }
  if (id === 'P53-L05') {
    const n = 2 + (k % 4),
      d = 3 + (k % 5),
      factor = 2 + (k % 4),
      result = simplifyFraction({ n: n * factor, d: d * factor }),
      value = `${result.n}/${result.d}`;
    return q(
      qid,
      `把 ${n * factor}/${d * factor} 写成最简分数。`,
      `Write ${n * factor}/${d * factor} in simplest form.`,
      value,
      simplest,
      [
        '同时除以共同因数，数量不变。',
        'Divide both by common factors to preserve value.',
        '继续检查是否还可以共同分组。',
        'Check whether more common grouping is possible.',
      ],
      [
        T(
          `约分得到 ${value}，分子分母已无共同因数大于 1。`,
          `Simplification gives ${value}, with no common factor above one.`,
        ),
      ],
      [value, ...(result.d === 1 ? [String(result.n)] : [])],
      [`${n * factor}/${d * factor}`, `${result.n + 1}/${result.d}`],
      { rule: 'simplest' },
    );
  }
  if (id === 'P53-L06') {
    const a = { n: 1 + (k % 2), d: 3 + (k % 4) },
      b = { n: 1 + ((k + 2) % 3), d: 4 + (k % 5) },
      common = commonDenominator(a, b);
    if (k % 2 === 0)
      return q(
        qid,
        `${a.n}/${a.d} 与 ${b.n}/${b.d} 的最小共同分母是多少？`,
        `Find the least common denominator of ${a.n}/${a.d} and ${b.n}/${b.d}.`,
        String(common.d),
        compare,
        [
          '找分母的最小共同倍数。',
          'Find the least common multiple of the denominators.',
          '共同分母必须能被原来两个分母整除。',
          'Both original denominators must divide the common denominator.',
        ],
        [
          T(
            `通分成 ${common.left.n}/${common.d} 与 ${common.right.n}/${common.d}。`,
            `Convert to ${common.left.n}/${common.d} and ${common.right.n}/${common.d}.`,
          ),
        ],
        [String(common.d)],
        [String(a.d + b.d), String(common.d + 1)],
      );
    const aGreater = common.left.n >= common.right.n,
      left = aGreater ? a : b,
      other = aGreater ? b : a,
      wrong =
        common.left.n === common.right.n
          ? `${left.n * 2}/${left.d}`
          : `${other.n}/${other.d}`;
    return q(
      qid,
      `同一整体的 ${a.n}/${a.d} 与 ${b.n}/${b.d}，写出较大的分数；若相等可写任一个。`,
      `For the same whole, write the greater of ${a.n}/${a.d} and ${b.n}/${b.d}; if equal, either is valid.`,
      `${left.n}/${left.d}`,
      compare,
      [
        '先用共同小单位计数。',
        'Count in a common small unit.',
        '通分后比较分子。',
        'Compare numerators after common-denominator conversion.',
      ],
      [
        T(
          `同分母后为 ${common.left.n}/${common.d} 与 ${common.right.n}/${common.d}，比较 ${common.left.n} 与 ${common.right.n}。`,
          `Common-denominator forms are ${common.left.n}/${common.d} and ${common.right.n}/${common.d}; compare ${common.left.n} and ${common.right.n}.`,
        ),
      ],
      [`${left.n}/${left.d}`],
      [wrong],
      { fraction: true },
    );
  }
  throw new Error(`Unknown P53 lesson ${id}`);
}
