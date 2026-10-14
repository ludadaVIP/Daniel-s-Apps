import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  fractionOperation,
  type FractionOperation,
} from '../fractionOperationModels';
import type { FractionValue } from '../fractionModels';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
const A = 'add-like-fractions',
  S = 'subtract-like-fractions',
  U = 'add-unlike-fractions',
  D = 'subtract-unlike-fractions',
  W = 'fraction-story-relationship';
type Options = {
  unit?: Unit;
  anyForm?: boolean;
  diagram?: boolean;
  denominator?: number;
  before?: Pair[];
};
function fq(
  id: string,
  stem: Pair,
  left: FractionValue,
  right: FractionValue,
  op: FractionOperation,
  value: string,
  skill: string,
  wrong: string[],
  options: Options = {},
): Question {
  const m = fractionOperation(left, right, op, options.denominator);
  const like = left.d === right.d;
  const form: Pair = options.denominator
    ? [
        `写成分母为 ${options.denominator} 的分数。`,
        `Write a fraction with denominator ${options.denominator}.`,
      ]
    : options.anyForm
      ? [
          '可用等值分数、带分数或小数。',
          'An equivalent fraction, mixed number or decimal is accepted.',
        ]
      : [
          '用最简分数表示；整数结果写整数。',
          'Use a simplest fraction; write an integer result as an integer.',
        ];
  const hints = [
    t(
      '先确认相同整体和单位，再辨别是合并量还是求剩余。',
      'Check the same whole and measurement unit, then decide whether to combine or find what remains.',
    ),
    like
      ? t(
          `每一份都是 1/${left.d}，只数份数；分母描述每份的大小。`,
          `Every piece is 1/${left.d}; count pieces. The denominator describes their size.`,
        )
      : t(
          `找 ${left.d} 与 ${right.d} 的公倍数；每个分子的倍数必须和自己的分母相同。`,
          `Find a common multiple of ${left.d} and ${right.d}; scale each numerator by the same factor as its own denominator.`,
        ),
  ];
  const steps = [
    ...(options.before ?? []).map(T),
    t(
      like
        ? `两量都以 1/${left.d} 为一份，整体标尺相同。`
        : `选共同分母 ${m.raw.d}：${left.n}/${left.d}=${m.left.n}/${m.left.d}，${right.n}/${right.d}=${m.right.n}/${m.right.d}。`,
      like
        ? `Both amounts count pieces of size 1/${left.d}, with the same whole reference.`
        : `Choose common denominator ${m.raw.d}: ${left.n}/${left.d}=${m.left.n}/${m.left.d} and ${right.n}/${right.d}=${m.right.n}/${m.right.d}.`,
    ),
    t(
      `同大小的份：${m.left.n}${op}${m.right.n}=${m.raw.n}，得到 ${m.raw.n}/${m.raw.d}${options.unit ? ` ${options.unit}` : ''}。`,
      `Equal-size pieces: ${m.left.n}${op}${m.right.n}=${m.raw.n}, giving ${m.raw.n}/${m.raw.d}${options.unit ? ` ${options.unit}` : ''}.`,
    ),
    t(
      `按题意整理为 ${value}${options.unit ? ` ${options.unit}` : ''}。${op === '−' ? '剩余加回去掉的量，恢复原量。' : '总量减去一个加数，恢复另一个加数。'}`,
      `Represent as requested: ${value}${options.unit ? ` ${options.unit}` : ''}. ${op === '−' ? 'Add the removed amount back to the remainder to recover the original.' : 'Subtract one addend from the total to recover the other.'}`,
    ),
  ];
  const item = numeric(
    id,
    t(`${stem[0]} ${form[0]}`, `${stem[1]} ${form[1]}`),
    value,
    skill,
    hints,
    steps,
    {
      accepted: [
        value,
        ...(options.anyForm ? [`${m.simplest.n * 2}/${m.simplest.d * 2}`] : []),
        ...(options.unit ? [`${value} ${options.unit}`] : []),
      ],
      rejected: wrong,
    },
    options.diagram
      ? { kind: 'fraction-operation', left, right, operation: op }
      : undefined,
  );
  item.answer = {
    kind: 'number',
    value,
    unit: options.unit,
    formats: ['fraction', 'decimal'],
    fractionRule:
      options.anyForm || options.denominator ? undefined : 'simplest',
    requiredDenominator: options.denominator,
  };
  item.type = options.unit
    ? 'word_problem'
    : options.diagram
      ? 'visual_select'
      : 'fraction';
  item.misconceptionTags = [
    skill,
    'same-whole',
    'equal-piece-size',
    ...(options.unit ? ['reading-units'] : []),
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
function r(
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) {
  return reasoning(id, T(stem), skill, T(rubric), hints.map(T));
}
function lesson(l: Lesson): Lesson {
  return {
    ...l,
    stage: 'P05',
    unit: 'P54',
    order: Number(l.id.slice(-2)),
    skillTags: [...new Set(l.questions.map((q) => q.skill))],
    nzYearHints: [5, 6],
    cnGradeHints: [5],
    contentStatus: 'ready',
  };
}
export const p54Lessons: Lesson[] = [
  lesson({
    id: 'P54-L01',
    title: t('同分母分数相加', 'Adding like-denominator fractions'),
    objective: t(
      '在相同整体下合并同大小的份，保留分母，解释并核查和可以超过 1。',
      'Combine equal-size pieces of the same whole, retain the denominator and explain why the sum may exceed 1.',
    ),
    prerequisites: ['P53-L01', 'P53-L02', 'P53-L05', 'B02-L01'],
    keywords: [
      t('同分母', 'like denominators'),
      t('分数单位', 'fraction unit'),
      t('和', 'sum'),
    ],
    minutes: 15,
    lab: 'fraction-add-like',
    hook: t(
      '同一块等分八份的巧克力，先取三份再取两份。合并后每一份会变成十六分之一吗？',
      'A chocolate bar has eight equal parts. Take three, then two more. Does joining them turn each piece into a sixteenth?',
    ),
    guided: fq(
      'P54-L01-G',
      [
        '同一整体的 3/8 与 2/8 合并，是多少？',
        'Join 3/8 and 2/8 of the same whole. How much?',
      ],
      { n: 3, d: 8 },
      { n: 2, d: 8 },
      '+',
      '5/8',
      A,
      ['5/16', '1/8'],
      { diagram: true },
    ),
    questions: [
      c(
        'P54-L01-Q1',
        [
          '计算 2/7+3/7，哪一个解释正确？',
          'Which explanation is correct for 2/7+3/7?',
        ],
        1,
        A,
        [
          [
            ['分子分母都相加，5/14', 'Add tops and bottoms: 5/14'],
            [
              '两组每份仍为 1/7；把分母加成 14 改变了每份大小。',
              'Each piece remains 1/7; adding denominators changes piece size.',
            ],
          ],
          [
            ['五个七分之一，5/7', 'Five sevenths: 5/7'],
            [
              '合并相同大小的份，只把份数相加。',
              'Join equal-size pieces by adding only their counts.',
            ],
          ],
          [
            [
              '只要分母一样，任何整体都可直接合并',
              'Matching denominators allow any wholes to be combined',
            ],
            [
              '一半小饼与一半大饼的实际量不同，需先约定共同整体。',
              'Half a small cake and half a large cake differ; agree on a common reference whole.',
            ],
          ],
        ],
        [
          ['分母是在说每份多大。', 'The denominator describes piece size.'],
          ['两份与三份都是七分之一。', 'Both counts refer to sevenths.'],
        ],
        [['2/7+3/7=(2+3)/7=5/7。', '2/7+3/7=(2+3)/7=5/7.']],
      ),
      fq(
        'P54-L01-Q2',
        ['算 1/6+3/6。', 'Calculate 1/6+3/6.'],
        { n: 1, d: 6 },
        { n: 3, d: 6 },
        '+',
        '2/3',
        A,
        ['4/12', '4/6', '1/3'],
      ),
      fq(
        'P54-L01-Q3',
        [
          '算 5/8+7/8，和可以超过一个整体。',
          'Calculate 5/8+7/8; a sum may exceed one whole.',
        ],
        { n: 5, d: 8 },
        { n: 7, d: 8 },
        '+',
        '3/2',
        A,
        ['12/16', '1/2', '12/8'],
        { diagram: true },
      ),
      fq(
        'P54-L01-Q4',
        [
          '彩带有 2/5 m 和 1/5 m，合计多少米？',
          'Ribbon lengths are 2/5 m and 1/5 m. How many metres altogether?',
        ],
        { n: 2, d: 5 },
        { n: 1, d: 5 },
        '+',
        '3/5',
        A,
        ['3/10', '3/5 L'],
        { unit: 'm' },
      ),
      fq(
        'P54-L01-Q5',
        ['算 0/9+4/9。', 'Calculate 0/9+4/9.'],
        { n: 0, d: 9 },
        { n: 4, d: 9 },
        '+',
        '4/9',
        A,
        ['4/18', '0'],
      ),
      r(
        'P54-L01-Q6',
        [
          '小宁说：1/2 小饼加 1/2 大饼，必然等于 1 块小饼。用整体标尺解释问题，不只说分母不能相加。',
          'Ning says half a small cake plus half a large cake must equal one small cake. Explain the reference-whole problem rather than only saying not to add denominators.',
        ],
        A,
        [
          '两份的整体大小不同，两个 1/2 的实际量不一定相同。先用同样大小的一块作共同单位或换算实际质量；不能直接称为一块小饼。',
          'The reference cakes differ in size, so the halves need not have equal actual amounts. Use an agreed equal-size cake or convert to a common measured mass; one small cake is not justified.',
        ],
        [
          ['分别问：谁的一半？', 'Ask: half of which whole?'],
          [
            '画一块小饼与一块大饼，比较实际两半。',
            'Draw the unequal cakes and compare their halves.',
          ],
        ],
      ),
    ],
    exit: fq(
      'P54-L01-X',
      [
        '两壶各有 3/4 L 和 3/4 L 水，倒入足够大的容器，合计多少升？',
        'Two jugs each hold 3/4 L. Pour into a sufficiently large container. How many litres altogether?',
      ],
      { n: 3, d: 4 },
      { n: 3, d: 4 },
      '+',
      '3/2',
      A,
      ['6/8', '3/4', '3/2 m'],
      { unit: 'L' },
    ),
    exitReason: t(
      '跨过一个整体仍保留 1 L 标尺，并用等值最简分数表达总量。',
      'Cross one whole while retaining a 1 L reference and express the total in simplest form.',
    ),
    parent: {
      goal: t(
        '孩子能说每一份大小不变，合并的是份数。',
        'The child explains that piece size stays fixed while piece counts combine.',
      ),
      misconception: t(
        '把分母相加；认为分数和一定小于 1；忽略不同整体。',
        'Adding denominators, requiring sums below 1, or ignoring different reference wholes.',
      ),
      prompts: [
        t(
          '把五个八分之一接在七个八分之一后，要几条整体？',
          'How many wholes are needed for five eighths followed by seven eighths?',
        ),
        t(
          '怎样从总量减回一个加数，核查另一个？',
          'How can subtracting an addend from the total check the other?',
        ),
      ],
      bridge: 'P53-L01',
    },
  }),
  lesson({
    id: 'P54-L02',
    title: t('同分母分数相减', 'Subtracting like-denominator fractions'),
    objective: t(
      '从同单位的份中划去指定份数，解释非负差、零差与约分不改变剩余量。',
      'Remove a specified count of equal-size pieces and explain non-negative differences, zero and unchanged remainder under simplification.',
    ),
    prerequisites: ['P54-L01', 'P53-L05', 'B02-L04'],
    keywords: [
      t('被减数', 'minuend'),
      t('剩余', 'remainder'),
      t('逆运算', 'inverse operation'),
    ],
    minutes: 15,
    lab: 'fraction-subtract-like',
    hook: t(
      '七个八分之一中划去三个。剩下四份，为什么不是四个零分之一？',
      'Cross out three of seven eighths. Four pieces remain: why does the denominator not become zero?',
    ),
    guided: fq(
      'P54-L02-G',
      ['算 7/8−3/8。', 'Calculate 7/8−3/8.'],
      { n: 7, d: 8 },
      { n: 3, d: 8 },
      '−',
      '1/2',
      S,
      ['4/0', '4/8', '1'],
      { diagram: true },
    ),
    questions: [
      c(
        'P54-L02-Q1',
        [
          '7/10−2/10 的结果为什么仍用十分之一作单位？',
          'Why does 7/10−2/10 still use tenths?',
        ],
        0,
        S,
        [
          [
            ['只去掉份数，没有改变等分方式', 'Pieces are removed, not resized'],
            [
              '五份每份仍为 1/10，得到 5/10，再约为 1/2。',
              'Five pieces remain, each 1/10, so 5/10 simplifies to 1/2.',
            ],
          ],
          [
            [
              '十减十为零，所以不能减',
              'Ten minus ten is zero, so subtraction is impossible',
            ],
            [
              '分母不是待减的份数，不能相减。',
              'The denominator is not the count to subtract.',
            ],
          ],
          [
            ['减法会让每一份变小', 'Subtraction makes each piece smaller'],
            [
              '划去某些份不改变其他份的大小。',
              'Removing pieces leaves each remaining piece the same size.',
            ],
          ],
        ],
        [
          [
            '区分每份大小与取了几份。',
            'Distinguish piece size from piece count.',
          ],
          [
            '把七格中的两格划掉，观察其余格的宽度。',
            'Cross out two of seven tiles and inspect remaining widths.',
          ],
        ],
        [['7/10−2/10=5/10=1/2。', '7/10−2/10=5/10=1/2.']],
      ),
      fq(
        'P54-L02-Q2',
        ['算 5/6−1/6。', 'Calculate 5/6−1/6.'],
        { n: 5, d: 6 },
        { n: 1, d: 6 },
        '−',
        '2/3',
        S,
        ['4/0', '4/6', '1/3'],
      ),
      fq(
        'P54-L02-Q3',
        [
          '算 9/8−5/8，先保留超过一个整体的原量。',
          'Calculate 9/8−5/8, retaining the original amount above one whole.',
        ],
        { n: 9, d: 8 },
        { n: 5, d: 8 },
        '−',
        '1/2',
        S,
        ['4/8', '1', '5/8'],
        { diagram: true },
      ),
      fq(
        'P54-L02-Q4',
        [
          '有 3/7 L 水，恰好用掉 3/7 L。剩多少升？',
          'There is 3/7 L of water; use exactly 3/7 L. How many litres remain?',
        ],
        { n: 3, d: 7 },
        { n: 3, d: 7 },
        '−',
        '0',
        S,
        ['0/0', '3/7', '0 m'],
        { unit: 'L' },
      ),
      fq(
        'P54-L02-Q5',
        [
          '1 m 彩带剪去 2/5 m，剩多少米？先把 1 写成 5/5。',
          'Cut 2/5 m from 1 m of ribbon. How many metres remain? Express 1 as 5/5.',
        ],
        { n: 5, d: 5 },
        { n: 2, d: 5 },
        '−',
        '3/5',
        S,
        ['1/5', '3/5 L'],
        { unit: 'm' },
      ),
      r(
        'P54-L02-Q6',
        [
          '有人把 6/8−2/8=4/8 写成 4/0，又说约为 1/2 会丢掉两份。说明两个错误，并用加法核查。',
          'Someone writes 6/8−2/8=4/0, then says simplifying 4/8 to 1/2 loses two pieces. Explain both errors and check with addition.',
        ],
        S,
        [
          '每份仍为 1/8，所以剩 4/8；分母不相减。4/8 与 1/2 涂色端点相同，重新成组改变份的计数单位而不是量。4/8+2/8=6/8 核查。',
          'Pieces remain eighths, so the remainder is 4/8; denominators are not subtracted. 4/8 and 1/2 have the same shaded endpoint; regrouping changes the counting unit, not the amount. Check 4/8+2/8=6/8.',
        ],
        [
          [
            '划去后，每个剩余格的宽度变了吗？',
            'Did removing pieces change remaining tile widths?',
          ],
          [
            '两格八分之一合成一份四分之一，四格的总宽度不变。',
            'Regroup pairs of eighths without changing total shaded width.',
          ],
        ],
      ),
    ],
    exit: fq(
      'P54-L02-X',
      [
        '有 11/10 L 果汁，倒出 3/10 L。剩多少升？',
        'There is 11/10 L of juice; pour out 3/10 L. How many litres remain?',
      ],
      { n: 11, d: 10 },
      { n: 3, d: 10 },
      '−',
      '4/5',
      S,
      ['8/10', '8/0', '4/5 m'],
      { unit: 'L' },
    ),
    exitReason: t(
      '从假分数原量划去同单位份数，再约分并加回核查。',
      'Subtract equal-size pieces from an improper fraction, simplify and add back to check.',
    ),
    parent: {
      goal: t(
        '孩子用剩余加去掉量恢复原量，不把分母相减。',
        'The child recovers the original using remainder plus removed amount, retaining piece size.',
      ),
      misconception: t(
        '分母相减或零差写成 0/0；约分被误解为丢失实物。',
        'Subtracting denominators, writing zero as 0/0, or treating simplification as losing material.',
      ),
      prompts: [
        t(
          '3/7−3/7 的条空了，为什么仍有整体标尺？',
          'Why does an empty strip for 3/7−3/7 retain a whole reference?',
        ),
        t(
          '9/8−5/8 的结果加回 5/8，恢复多少？',
          'What does adding 5/8 back to 9/8−5/8 restore?',
        ),
      ],
      bridge: 'P54-L01',
    },
  }),
  lesson({
    id: 'P54-L03',
    title: t('异分母分数相加', 'Adding unlike-denominator fractions'),
    objective: t(
      '选择有效共同分母，对每个分数的分子分母同倍细分后相加，解释非最小公倍数也可用。',
      'Choose a valid common denominator, scale each numerator and denominator together, then add; explain why nonleast common multiples also work.',
    ),
    prerequisites: ['P54-L01', 'P53-L04', 'P53-L06', 'P51-L05'],
    keywords: [
      t('共同分母', 'common denominator'),
      t('等值细分', 'equivalent refinement'),
      t('公倍数', 'common multiple'),
    ],
    minutes: 18,
    lab: 'fraction-add-unlike',
    hook: t(
      '两个三分之一与一个四分之一，不能只喊“三份”。怎样让三分之一和四分之一变成同样大的份？',
      'Two thirds and one quarter are not simply three identical pieces. How can thirds and quarters become equal-size pieces?',
    ),
    guided: fq(
      'P54-L03-G',
      ['算 2/3+1/4。', 'Calculate 2/3+1/4.'],
      { n: 2, d: 3 },
      { n: 1, d: 4 },
      '+',
      '11/12',
      U,
      ['3/7', '3/12', '2/3'],
      { diagram: true },
    ),
    questions: [
      c(
        'P54-L03-Q1',
        [
          '1/4+1/6 通分时，哪一句成立？',
          'Which statement holds when finding a common denominator for 1/4+1/6?',
        ],
        2,
        U,
        [
          [
            ['分母 10 是 4+6，所以可用', '10 works because 4+6=10'],
            [
              '10 不能被 4 与 6 都整除，不是公倍数。',
              '10 is not divisible by both 4 and 6.',
            ],
          ],
          [
            [
              '只把分母改为 12，分子保持 1',
              'Change denominators to 12, retaining numerator 1',
            ],
            [
              '1/4=3/12，1/6=2/12；只改分母会改变原量。',
              '1/4=3/12 and 1/6=2/12; changing only denominators changes amounts.',
            ],
          ],
          [
            [
              '12 和 24 都有效，12 格子更少',
              'Both 12 and 24 work; 12 uses fewer pieces',
            ],
            [
              '两者都是公倍数；5/12 与 10/24 的总量相同。',
              'Both are common multiples; 5/12 and 10/24 have equal amounts.',
            ],
          ],
        ],
        [
          [
            '共同分母必须同时整除两分母。',
            'Both denominators must divide the common denominator.',
          ],
          [
            '把每个分数单独写成等值分数。',
            'Rewrite each fraction independently without changing its value.',
          ],
        ],
        [['1/4+1/6=3/12+2/12=5/12=10/24。', '1/4+1/6=3/12+2/12=5/12=10/24.']],
      ),
      fq(
        'P54-L03-Q2',
        ['算 1/2+1/3。', 'Calculate 1/2+1/3.'],
        { n: 1, d: 2 },
        { n: 1, d: 3 },
        '+',
        '5/6',
        U,
        ['2/5', '2/6', '1/6'],
      ),
      fq(
        'P54-L03-Q3',
        [
          '算 3/4+2/3，和可超过 1。',
          'Calculate 3/4+2/3; the sum may exceed 1.',
        ],
        { n: 3, d: 4 },
        { n: 2, d: 3 },
        '+',
        '17/12',
        U,
        ['5/7', '5/12', '1/12'],
        { diagram: true },
      ),
      fq(
        'P54-L03-Q4',
        [
          '算 1/4+1/6，特意使用分母 24，写出结果。',
          'Calculate 1/4+1/6, deliberately using denominator 24 for the result.',
        ],
        { n: 1, d: 4 },
        { n: 1, d: 6 },
        '+',
        '10/24',
        U,
        ['5/12', '2/24', '10/10'],
        { denominator: 24 },
      ),
      fq(
        'P54-L03-Q5',
        [
          '步道两段长 2/5 km 和 1/10 km，合计多少千米？',
          'Two path sections are 2/5 km and 1/10 km. How many kilometres altogether?',
        ],
        { n: 2, d: 5 },
        { n: 1, d: 10 },
        '+',
        '1/2',
        U,
        ['3/15', '5/10', '1/2 m'],
        { unit: 'km' },
      ),
      r(
        'P54-L03-Q6',
        [
          '解释为什么 2/3+1/4 不能写 3/7，也不能直接写 3/12；给出保留原量的通分步骤。',
          'Explain why 2/3+1/4 is neither 3/7 nor simply 3/12; give refinement steps that retain each amount.',
        ],
        U,
        [
          '三分之一与四分之一大小不同，不能直接加分子或分母。2/3 分子分母乘四得 8/12；1/4 同乘三得 3/12；8+3 个十二分之一为 11/12，可减去 3/12 恢复 8/12。',
          'Thirds and quarters differ in size. Scale both parts of 2/3 by four to 8/12 and both parts of 1/4 by three to 3/12. Eleven twelfths result; subtract 3/12 to recover 8/12.',
        ],
        [
          [
            '每一原份细分后变成几小份？',
            'How many new pieces does each original piece become?',
          ],
          [
            '三分之一分四小份；四分之一分三小份。',
            'Each third splits into four; each quarter into three.',
          ],
        ],
      ),
    ],
    exit: fq(
      'P54-L03-X',
      [
        '两笔纸上假想钱数为 NZ$1/2 和 NZ$1/4，合计多少新西兰元？',
        'Two imagined amounts on paper are NZ$1/2 and NZ$1/4. How many New Zealand dollars altogether?',
      ],
      { n: 1, d: 2 },
      { n: 1, d: 4 },
      '+',
      '3/4',
      U,
      ['2/6', '3/4 m', '0.75'],
      { unit: 'NZD' },
    ),
    exitReason: t(
      '单位金额与分数单位都对齐，不把两个分母的和当共同分母。',
      'Align currency units and fraction-piece sizes without adding denominators.',
    ),
    parent: {
      goal: t(
        '孩子能说明每个分子的倍数从自己的分母得到。',
        'The child explains each numerator’s scale factor using its own denominator.',
      ),
      misconception: t(
        '只改分母；以分母之和通分；误以为只能用最小公倍数。',
        'Changing only denominators, adding denominators, or accepting only the least common multiple.',
      ),
      prompts: [
        t(
          '为什么 2/3=8/12 的涂色端点没移动？',
          'Why does the shaded endpoint stay fixed for 2/3=8/12?',
        ),
        t(
          '改用 24 作分母，为什么结果还等值？',
          'Why does denominator 24 preserve the result?',
        ),
      ],
      bridge: 'P53-L04',
    },
  }),
  lesson({
    id: 'P54-L04',
    title: t('异分母分数相减', 'Subtracting unlike-denominator fractions'),
    objective: t(
      '通分后从等大小的份中相减，保留减数顺序，并用加回核查非负差。',
      'Refine to equal-size pieces before subtracting, retain operand order and check a non-negative difference by adding back.',
    ),
    prerequisites: ['P54-L02', 'P54-L03', 'P53-L06'],
    keywords: [
      t('通分', 'common-denominator conversion'),
      t('差', 'difference'),
      t('加回核查', 'add-back check'),
    ],
    minutes: 18,
    lab: 'fraction-subtract-unlike',
    hook: t(
      '四分之三米彩带剪去六分之一米。只算 3−1，能知道剩下的是几分之一米吗？',
      'Cut one sixth of a metre from three quarters of a metre. Does calculating 3−1 tell you the size of each remaining piece?',
    ),
    guided: fq(
      'P54-L04-G',
      ['算 3/4−1/6。', 'Calculate 3/4−1/6.'],
      { n: 3, d: 4 },
      { n: 1, d: 6 },
      '−',
      '7/12',
      D,
      ['2/2', '2/12', '5/12'],
      { diagram: true },
    ),
    questions: [
      c(
        'P54-L04-Q1',
        [
          '3/4−1/6 的通分与顺序，哪一项正确？',
          'Which conversion and order are correct for 3/4−1/6?',
        ],
        1,
        D,
        [
          [
            ['3/12−1/12', '3/12−1/12'],
            [
              '每个分子也必须随分母同倍改变。',
              'Scale each numerator together with its denominator.',
            ],
          ],
          [
            ['9/12−2/12', '9/12−2/12'],
            [
              '保留原量和先后，划去两个十二分之一，剩七个。',
              'Retain amounts and order; remove two twelfths, leaving seven.',
            ],
          ],
          [
            ['2/12−9/12', '2/12−9/12'],
            [
              '减法交换次序改变结果，本情境去掉量小于原量。',
              'Swapping subtraction order changes the result; the removed amount is smaller here.',
            ],
          ],
        ],
        [
          ['先让两量都用十二分之一数。', 'Count both in twelfths first.'],
          [
            '原有量与划去量不能互换。',
            'Do not swap the starting and removed amounts.',
          ],
        ],
        [['3/4−1/6=9/12−2/12=7/12。', '3/4−1/6=9/12−2/12=7/12.']],
      ),
      fq(
        'P54-L04-Q2',
        ['算 5/6−1/4。', 'Calculate 5/6−1/4.'],
        { n: 5, d: 6 },
        { n: 1, d: 4 },
        '−',
        '7/12',
        D,
        ['4/2', '4/12', '11/12'],
      ),
      fq(
        'P54-L04-Q3',
        [
          '算 7/6−3/4，原量可以大于 1。',
          'Calculate 7/6−3/4; the starting amount may exceed 1.',
        ],
        { n: 7, d: 6 },
        { n: 3, d: 4 },
        '−',
        '5/12',
        D,
        ['4/2', '4/12', '23/12'],
        { diagram: true },
      ),
      fq(
        'P54-L04-Q4',
        [
          '算 2/3−4/6，两个不同写法可能表示同量。',
          'Calculate 2/3−4/6; different writing may represent equal amounts.',
        ],
        { n: 2, d: 3 },
        { n: 4, d: 6 },
        '−',
        '0',
        D,
        ['2/3', '0/0', '2/6'],
      ),
      fq(
        'P54-L04-Q5',
        [
          '1 m 彩带剪去 3/8 m，剩多少米？',
          'Cut 3/8 m from 1 m of ribbon. How many metres remain?',
        ],
        { n: 1, d: 1 },
        { n: 3, d: 8 },
        '−',
        '5/8',
        D,
        ['2/7', '5/8 L'],
        { unit: 'm' },
      ),
      r(
        'P54-L04-Q6',
        [
          '解释 3/4−1/6=7/12 后，为什么 7/12+1/6 应恢复 3/4？另一种分母 24 可以怎样核查？',
          'After 3/4−1/6=7/12, why should 7/12+1/6 recover 3/4? How can denominator 24 check the same difference?',
        ],
        D,
        [
          '原量=剩余+去掉。7/12+2/12=9/12=3/4；以 24 为分母为 18/24−4/24=14/24=7/12，再加 4/24 回到 18/24。另一共同分母改变份数而不改变各量。',
          'Original=remainder+removed: 7/12+2/12=9/12=3/4. With denominator 24, 18/24−4/24=14/24=7/12; adding 4/24 recovers 18/24. Another common denominator changes counts, not amounts.',
        ],
        [
          [
            '先说原量、剩余、去掉量之间的关系。',
            'State the original/remainder/removed relationship first.',
          ],
          [
            '原量和去掉量都再细分成二十四分之一。',
            'Refine both original and removed amounts into twenty-fourths.',
          ],
        ],
      ),
    ],
    exit: fq(
      'P54-L04-X',
      [
        '有 4/5 L 水，倒出 1/2 L。剩多少升？',
        'There is 4/5 L of water; pour out 1/2 L. How many litres remain?',
      ],
      { n: 4, d: 5 },
      { n: 1, d: 2 },
      '−',
      '3/10',
      D,
      ['3/3', '3/10 m', '13/10'],
      { unit: 'L' },
    ),
    exitReason: t(
      '在升的情境中通分相减，保留顺序，并检查差应小于原量。',
      'Subtract with common fraction units in a litre context, retaining order and checking that the difference is below the original.',
    ),
    parent: {
      goal: t(
        '孩子通分时保持原量，能用加回解释而非重复背公式。',
        'The child retains amounts under conversion and explains an add-back check.',
      ),
      misconception: t(
        '直接减不同单位的分子；颠倒顺序；不同分母就认为量不相等。',
        'Subtracting unequal-size piece counts, reversing operands, or assuming different denominators mean unequal amounts.',
      ),
      prompts: [
        t('为什么 2/3−4/6 可以为零？', 'Why can 2/3−4/6 equal zero?'),
        t(
          '去掉量若大于原量，本单元的实物模型能怎么提醒？',
          'How does this unit’s material model warn when removal exceeds what is available?',
        ),
      ],
      bridge: 'P53-L06',
    },
  }),
  lesson({
    id: 'P54-L05',
    title: t('分数加减应用题', 'Fraction word problems'),
    objective: t(
      '先明确同一整体与测量单位，再用合并或剩余关系列式，完成两步分数情境并核查数量。',
      'Identify a common reference whole and measurement unit, model combining or remaining amounts, solve a two-step fraction story and check quantities.',
    ),
    prerequisites: ['P54-L03', 'P54-L04', 'B06-L03', 'B06-L05'],
    keywords: [
      t('共同标尺', 'common reference'),
      t('数量关系', 'quantity relationship'),
      t('两步计划', 'two-step plan'),
    ],
    minutes: 20,
    lab: 'fraction-story',
    hook: t(
      '两壶水的“1/2 壶”可以直接相加吗？如果标成升，怎样知道先加还是先减？',
      'Can you add “half a jug” from unequal jugs directly? If amounts are given in litres, how do you choose addition or subtraction?',
    ),
    guided: fq(
      'P54-L05-G',
      [
        '两壶水有 3/4 L 与 2/3 L，合并到足够大的容器。共有多少升？',
        'Two jugs hold 3/4 L and 2/3 L; combine into a sufficiently large container. How many litres altogether?',
      ],
      { n: 3, d: 4 },
      { n: 2, d: 3 },
      '+',
      '17/12',
      W,
      ['5/7', '5/12', '17/12 m'],
      { unit: 'L', diagram: true },
    ),
    questions: [
      c(
        'P54-L05-Q1',
        [
          '一壶容量 1 L，另一壶容量 2 L，各装半壶水。哪一个结论有依据？',
          'One jug has capacity 1 L, another 2 L; each is half full. Which conclusion is justified?',
        ],
        2,
        W,
        [
          [
            ['半壶加半壶一定是 1 L', 'Half a jug plus half a jug must be 1 L'],
            [
              '两壶整体不同，半壶实际升数不同。',
              'The jugs differ, so their halves have different litre amounts.',
            ],
          ],
          [
            [
              '只要分母同为 2，就不用看容量',
              'Both denominators are 2, so capacity is irrelevant',
            ],
            [
              '分数必须连着它的整体解释。',
              'A fraction must be interpreted with its reference whole.',
            ],
          ],
          [
            [
              '先换为 1/2 L 与 1 L，再合计 3/2 L',
              'Convert to 1/2 L and 1 L, then total 3/2 L',
            ],
            [
              '统一到 1 L 的测量标尺，才是同单位加法。',
              'Use a shared 1 L measurement reference before addition.',
            ],
          ],
        ],
        [
          [
            '先算每壶的一半实际多少升。',
            'Find the actual litres in each half-jug.',
          ],
          [
            '1 L 的一半与 2 L 的一半并不等量。',
            'Half of 1 L and half of 2 L are not equal amounts.',
          ],
        ],
        [
          [
            '1/2×1 L=1/2 L；1/2×2 L=1 L；合计 3/2 L。',
            'Half of 1 L is 1/2 L; half of 2 L is 1 L; total 3/2 L.',
          ],
        ],
      ),
      fq(
        'P54-L05-Q2',
        [
          '彩带长 5/6 m，剪去 1/4 m，剩多少米？',
          'A ribbon is 5/6 m long; cut off 1/4 m. How many metres remain?',
        ],
        { n: 5, d: 6 },
        { n: 1, d: 4 },
        '−',
        '7/12',
        W,
        ['13/12', '4/2', '7/12 L'],
        { unit: 'm' },
      ),
      fq(
        'P54-L05-Q3',
        [
          '先合并 3/4 L 与 2/3 L，再用去 1/2 L。最终剩多少升？先自己求合计量。',
          'Combine 3/4 L and 2/3 L, then use 1/2 L. How many litres finally remain? Find the combined amount first.',
        ],
        { n: 17, d: 12 },
        { n: 1, d: 2 },
        '−',
        '11/12',
        W,
        ['23/12', '1/12', '11/12 m'],
        {
          unit: 'L',
          before: [
            [
              '先合计 3/4 L+2/3 L=9/12 L+8/12 L=17/12 L。',
              'First combine 3/4 L+2/3 L=9/12 L+8/12 L=17/12 L.',
            ],
          ],
        },
      ),
      fq(
        'P54-L05-Q4',
        [
          '纸上假想存有 NZ$3/4，花去 NZ$1/2，剩多少新西兰元？',
          'Imagine saving NZ$3/4 on paper and spending NZ$1/2. How many New Zealand dollars remain?',
        ],
        { n: 3, d: 4 },
        { n: 1, d: 2 },
        '−',
        '1/4',
        W,
        ['5/4', '2/2', '1/4 L'],
        { unit: 'NZD' },
      ),
      fq(
        'P54-L05-Q5',
        [
          '步道两段长 1/3 km 与 1/6 km，合计多少千米？',
          'Two path sections are 1/3 km and 1/6 km. How many kilometres altogether?',
        ],
        { n: 1, d: 3 },
        { n: 1, d: 6 },
        '+',
        '1/2',
        W,
        ['2/9', '3/6', '1/2 m'],
        { unit: 'km' },
      ),
      r(
        'P54-L05-Q6',
        [
          '“已走全程的 1/3，再走 1/4 km，所以共走全程的 7/12。”还缺什么信息？说明如何把关系列对，不能仅通分就宣布正确。',
          '“Walk 1/3 of a route, then 1/4 km, so 7/12 of the route has been walked.” What information is missing? Explain how to form a valid relationship rather than only finding a common denominator.',
        ],
        W,
        [
          '缺全程多少 km：全程的 1/3 与 1/4 km 不是同一单位。设全程长 R km，第一段为 R/3 km，总长为 R/3+1/4 km，再除以 R 才是全程比例；或先把 1/4 km 换成全程比例。没有 R 不能确定 7/12。',
          'The route length is missing. One third of the route and 1/4 km use different references. If the route is R km, the first part is R/3 km; total distance is R/3+1/4 km, then divide by R for a route fraction. Alternatively convert 1/4 km to a route fraction. Without R, 7/12 is not justified.',
        ],
        [
          [
            '分别写两量的单位与整体。',
            'Write each quantity’s unit and reference.',
          ],
          [
            '若全程 2 km，1/4 km 是全程的几分之几？',
            'If the route is 2 km, what fraction of it is 1/4 km?',
          ],
        ],
      ),
    ],
    exit: fq(
      'P54-L05-X',
      [
        '有 1 L 水，先用 1/3 L，再用 1/4 L。最后剩多少升？',
        'Start with 1 L of water, use 1/3 L, then 1/4 L. How many litres remain?',
      ],
      { n: 1, d: 1 },
      { n: 7, d: 12 },
      '−',
      '5/12',
      W,
      ['7/12', '1/12', '5/12 m'],
      {
        unit: 'L',
        before: [
          [
            '先合计两次用量 1/3 L+1/4 L=4/12 L+3/12 L=7/12 L。',
            'First combine both uses: 1/3 L+1/4 L=4/12 L+3/12 L=7/12 L.',
          ],
        ],
      },
    ),
    exitReason: t(
      '自己组织两步数量关系，保留 1 L 的整体标尺，并把剩余与两次用量加回一升。',
      'Organise a two-step relationship independently, retain the 1 L reference and add remaining water plus both uses back to one litre.',
    ),
    parent: {
      goal: t(
        '孩子能先说所求对象和单位，再解释两步关系，并核查情境。',
        'The child states the unknown and unit before explaining the two-step relationship and checking the story.',
      ),
      misconception: t(
        '看到“再”就相加；把全程比例与千米相加；忘掉中间总量和最后剩余不同。',
        'Automatically adding for “then”, mixing route fractions with kilometres, or confusing intermediate total with final remainder.',
      ),
      prompts: [
        t(
          '两个半壶为什么不总是一升？',
          'Why are two half-jugs not always one litre?',
        ),
        t(
          '最终剩余加两次用量，应恢复什么？',
          'What should final remainder plus both uses recover?',
        ),
      ],
      bridge: 'B06-L03',
    },
    familyChallenge: t(
      '只用纸画，不要求采购或实际倒水：把 1 L 画成十二等份，想象先用 1/3 L 再用 1/4 L。孩子先列自己的计划，再划去四格与三格，剩五格；把五、四、三格加回十二格。再讨论容量 1 L 与 2 L 的半壶为何共 3/2 L，不强求同一句解释。',
      'Use paper only. No real purchase or pouring is required. Draw 1 L in twelve equal pieces; imagine using 1/3 L then 1/4 L. Make a plan first, cross out four then three tiles and leave five; five plus four plus three restores twelve. Discuss why half-filled 1 L and 2 L jugs hold 3/2 L altogether. Accept different sound explanations.',
    ),
  }),
];
export const p54CheckQuestions: Question[] = [
  fq(
    'P54-CHECK-Q1',
    ['算 3/10+4/10。', 'Calculate 3/10+4/10.'],
    { n: 3, d: 10 },
    { n: 4, d: 10 },
    '+',
    '7/10',
    A,
    ['7/20', '1/10'],
  ),
  fq(
    'P54-CHECK-Q2',
    ['算 13/12−5/12。', 'Calculate 13/12−5/12.'],
    { n: 13, d: 12 },
    { n: 5, d: 12 },
    '−',
    '2/3',
    S,
    ['8/12', '8/0', '3/2'],
    { diagram: true },
  ),
  fq(
    'P54-CHECK-Q3',
    ['算 2/3+1/6。', 'Calculate 2/3+1/6.'],
    { n: 2, d: 3 },
    { n: 1, d: 6 },
    '+',
    '5/6',
    U,
    ['3/9', '3/6'],
  ),
  fq(
    'P54-CHECK-Q4',
    [
      '有 7/8 m 彩带，剪去 1/3 m。剩多少米？',
      'There is 7/8 m of ribbon; cut off 1/3 m. How many metres remain?',
    ],
    { n: 7, d: 8 },
    { n: 1, d: 3 },
    '−',
    '13/24',
    D,
    ['6/5', '29/24', '13/24 L'],
    { unit: 'm' },
  ),
  c(
    'P54-CHECK-Q5',
    [
      '1/3+1/4 通分时，哪一个共同分母也有效？',
      'Which is also a valid common denominator for 1/3+1/4?',
    ],
    1,
    U,
    [
      [
        ['7', '7'],
        ['7 不是 3 和 4 的共同倍数。', '7 is not a multiple of both 3 and 4.'],
      ],
      [
        ['24', '24'],
        [
          '1/3=8/24，1/4=6/24，和 14/24=7/12。',
          '1/3=8/24 and 1/4=6/24, so the sum is 14/24=7/12.',
        ],
      ],
      [
        ['只允许 12', 'Only 12 is allowed'],
        [
          '12 是最小有效分母，不是唯一有效分母。',
          '12 is the least valid denominator, not the only one.',
        ],
      ],
    ],
    [
      [
        '共同分母要同时被 3 与 4 整除。',
        'Both 3 and 4 must divide the denominator.',
      ],
      [
        '检查 24/3 与 24/4 是否整数。',
        'Check whether 24/3 and 24/4 are integers.',
      ],
    ],
    [['12、24、36……都是公倍数。', '12, 24, 36, … are common multiples.']],
  ),
  fq(
    'P54-CHECK-Q6',
    [
      '两壶各有 5/6 L 与 1/2 L 水，合计多少升？',
      'Two jugs hold 5/6 L and 1/2 L. How many litres altogether?',
    ],
    { n: 5, d: 6 },
    { n: 1, d: 2 },
    '+',
    '4/3',
    W,
    ['6/8', '8/6', '4/3 m'],
    { unit: 'L' },
  ),
  fq(
    'P54-CHECK-Q7',
    [
      '有 1 L 水，先用 1/4 L，再用 1/3 L，最后剩多少升？',
      'Start with 1 L, use 1/4 L then 1/3 L. How many litres finally remain?',
    ],
    { n: 1, d: 1 },
    { n: 7, d: 12 },
    '−',
    '5/12',
    W,
    ['7/12', '1/12', '5/12 m'],
    {
      unit: 'L',
      before: [
        [
          '先合计两次用量 1/3 L+1/4 L=4/12 L+3/12 L=7/12 L。',
          'First combine both uses: 1/3 L+1/4 L=4/12 L+3/12 L=7/12 L.',
        ],
      ],
    },
  ),
  r(
    'P54-CHECK-Q8',
    [
      '把“1/2 个小披萨+1/2 个大披萨=1 个小披萨”修正为有依据的解释；若不知道大小，能给出确定的总量吗？',
      'Correct “half a small pizza plus half a large pizza equals one small pizza” with a justified explanation. Can you give a definite total without knowing sizes?',
    ],
    W,
    [
      '两半的整体不同，不能直接以小披萨为共同整体。需知道大小并转换到相同面积、质量或同样大小的披萨单位后相加；未知大小时不能给确定的小披萨数量。单位一致后才能通分或同分母相加。',
      'The reference wholes differ. Obtain sizes and convert both portions to a common measured area, mass or equal-size pizza unit before adding. Without the sizes, a definite small-pizza count is not justified. Common measurement/reference units precede common-denominator arithmetic.',
    ],
    [
      ['说清每个 1/2 是谁的一半。', 'Identify the whole for each half.'],
      [
        '可以用同单位面积或质量比较，但需要数据。',
        'Use a common area or mass unit, with the necessary data.',
      ],
    ],
  ),
];
export function p54ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative safe-integer review round');
  const index = p54Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new Error(`Unknown P54 lesson ${id}`);
  const k = round % 80,
    d = 4 + (k % 9),
    a = 1 + (Math.floor(k / 9) % d),
    b = 1 + (k % d);
  let left: FractionValue,
    right: FractionValue,
    op: FractionOperation,
    skill: string,
    unit: Unit;
  if (index < 2) {
    left = { n: index === 0 ? a : Math.min(2 * d, a + b), d };
    right = { n: b, d };
    op = index === 0 ? '+' : '−';
    skill = index === 0 ? A : S;
  } else {
    const pairs = [
      [2, 3],
      [3, 4],
      [4, 6],
      [5, 10],
      [6, 8],
      [8, 12],
      [3, 6],
      [4, 12],
    ];
    const [da, db] = pairs[k % pairs.length]!;
    left = { n: 1 + (Math.floor(k / 8) % da!), d: da! };
    right = { n: 1 + (Math.floor(k / 24) % db!), d: db! };
    op = index === 2 || (index === 4 && k % 2 === 0) ? '+' : '−';
    if (op === '−' && left.n * right.d < right.n * left.d)
      [left, right] = [right, left];
    skill = index === 2 ? U : index === 3 ? D : W;
    if (index === 4) unit = k % 3 === 0 ? 'L' : k % 3 === 1 ? 'm' : 'NZD';
  }
  const model = fractionOperation(left, right, op),
    s = model.simplest,
    value = s.d === 1 ? String(s.n) : `${s.n}/${s.d}`;
  const expression = `${left.n}/${left.d}${unit ? ` ${unit}` : ''}${op}${right.n}/${right.d}${unit ? ` ${unit}` : ''}`;
  const stem: Pair =
    index === 4
      ? op === '+'
        ? [
            `两笔同单位量为 ${left.n}/${left.d} ${unit} 与 ${right.n}/${right.d} ${unit}，合计多少？`,
            `Two same-unit amounts are ${left.n}/${left.d} ${unit} and ${right.n}/${right.d} ${unit}. How much altogether?`,
          ]
        : [
            `有 ${left.n}/${left.d} ${unit}，用去 ${right.n}/${right.d} ${unit}，还剩多少？`,
            `Start with ${left.n}/${left.d} ${unit}; use ${right.n}/${right.d} ${unit}. How much remains?`,
          ]
      : [`计算 ${expression}。`, `Calculate ${expression}.`];
  const question = fq(
    `${id}-R${round}`,
    stem,
    left,
    right,
    op,
    value,
    skill,
    [String(s.n / s.d + 1), '0/0'],
    { unit },
  );
  if (index === 4) question.difficulty = 'transfer';
  return question;
}
