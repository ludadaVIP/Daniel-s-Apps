import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  equationWorking,
  equationText,
  equationSides,
  equationQuantity,
  rationalText,
  patternPieces,
  type EarlyEquation,
} from '../equationModels';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
const B = 'box-unknown',
  E = 'equal-sign-relationship',
  P = 'pattern-expression',
  S = 'one-step-equation',
  W = 'equation-story';
const eq = (
  kind: EarlyEquation['kind'],
  a: string,
  b: string,
  reversed = false,
): EarlyEquation => ({ kind, a, b, reversed });
function q(
  id: string,
  stem: Pair,
  equation: EarlyEquation,
  value: string,
  skill: string,
  wrong: string[],
  unit?: Unit,
  diagram = false,
): Question {
  const inverse =
    equation.kind === 'add'
      ? t(
          '未知加数是总量减已知加数；等号两边减同量。',
          'An unknown addend is the total minus the known addend; subtract the same amount on both sides.',
        )
      : equation.kind === 'subtract'
        ? t(
            '原量减去已知量得到剩余；把去掉量加回两边。',
            'Original minus removed gives remaining; add the removed amount back on both sides.',
          )
        : equation.kind === 'subtract-from'
          ? t(
              '原量减未知去掉量得到剩余；去掉量是原量与剩余之差。',
              'Original minus unknown removal gives remaining; removal is original minus remaining.',
            )
          : equation.kind === 'multiply'
            ? t(
                '相等组数乘每组量是总量；两边除以同一非零组数。',
                'Equal-group count times each amount gives the total; divide both sides by the same nonzero group count.',
              )
            : t(
                '未知原量平均分后得到每组量；两边乘同一个非零除数。',
                'An unknown original divided equally gives each amount; multiply both sides by the same nonzero divisor.',
              );
  const steps = [
    t(
      `关系为 ${equationText(equation)}${unit ? `；x 的单位是 ${unit}` : ''}。先保持未知量的对象。`,
      `The relationship is ${equationText(equation)}${unit ? `; x uses ${unit}` : ''}. Retain the object represented by the unknown.`,
    ),
    ...equationWorking(equation).map((s) => t(s, s)),
    t(
      `把 x=${value} 代回原式，两边都为 ${equation.b}${unit ? ` ${unit}` : ''}；不是只看新式或答案大小。`,
      `Substitute x=${value} into the original: both sides equal ${equation.b}${unit ? ` ${unit}` : ''}. Check the original relationship, not merely the new expression or answer size.`,
    ),
  ];
  const item = numeric(
    id,
    T(stem),
    value,
    skill,
    [
      t(
        '先指出未知量的对象、位置和单位，等号表示两边值相等。',
        'Identify the unknown’s object, position and unit. The equal sign states that both side values agree.',
      ),
      inverse,
    ],
    steps,
    {
      accepted: [
        value,
        ...(/^\d+$/.test(value) ? [`${value}.0`] : []),
        ...(unit ? [`${value} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram
      ? { kind: 'equation-board', equation, symbol: skill === B ? '□' : 'x' }
      : undefined,
  );
  item.answer = {
    kind: 'number',
    value,
    unit,
    formats: ['decimal', 'fraction'],
  };
  if (unit) item.type = 'word_problem';
  item.misconceptionTags = [
    skill,
    'unknown-object',
    'substitution',
    ...(unit ? ['reading-units'] : []),
  ];
  return item;
}
function patternQ(
  id: string,
  stem: Pair,
  pattern: 'squares' | 'counters',
  n: number,
  value: number,
  wrong: string[],
  diagram = false,
): Question {
  const item = numeric(
    id,
    T(stem),
    String(value),
    P,
    [
      pattern === 'squares'
        ? t(
            '每增加一个共边方形添三根，不把共边再算一次。',
            'Each added joined square adds three sticks; do not recount the shared edge.',
          )
        : t(
            '两行各 n 个点，再加那一个额外点。',
            'Each of two rows contains n counters, plus the single extra.',
          ),
      t(
        '先写适用于每一步的式子，再代入给出的 n。',
        'Write a construction expression for every step, then substitute the given n.',
      ),
    ],
    [
      pattern === 'squares'
        ? t(
            'n 个上边、n 个下边、n+1 个竖边：3n+1。',
            'n top edges, n bottom edges and n+1 vertical edges: 3n+1.',
          )
        : t(
            '两行 n 个点再加一个：2n+1。',
            'Two rows of n counters plus one: 2n+1.',
          ),
      t(
        `代入 n=${n} 得 ${pattern === 'squares' ? '3' : '2'}×${n}+1=${value}，按构造核查。`,
        `Substitute n=${n}: ${pattern === 'squares' ? '3' : '2'}×${n}+1=${value}, checked against the construction.`,
      ),
    ],
    {
      accepted: [
        String(value),
        `${value}.0`,
        `${2 * value}/2`,
        ...(pattern === 'squares'
          ? [`${value} sticks`, `${value} 根小棒`]
          : []),
      ],
      rejected: wrong,
    },
    diagram ? { kind: 'growing-pattern', pattern, n } : undefined,
  );
  item.answer = {
    kind: 'number',
    value: String(value),
    unit: pattern === 'squares' ? 'sticks' : undefined,
    formats: ['decimal', 'fraction'],
  };
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
const lesson = (l: Lesson): Lesson => ({
  ...l,
  stage: 'P05',
  unit: 'P55',
  order: Number(l.id.slice(-2)),
  skillTags: [...new Set(l.questions.map((q) => q.skill))],
  nzYearHints: [5, 6],
  cnGradeHints: [5],
  contentStatus: 'ready',
});
export const p55Lessons: Lesson[] = [
  lesson({
    id: 'P55-L01',
    title: t('用方框表示未知数', 'Using boxes for unknowns'),
    objective: t(
      '用方框明确表示同一问题的未知数量，根据位置找候选值并代回关系。',
      'Use a box to identify an unknown quantity, find a candidate from its position and substitute into the relationship.',
    ),
    prerequisites: ['B02-L04', 'B06-L02'],
    keywords: [
      t('未知数', 'unknown'),
      t('方框', 'box placeholder'),
      t('试代', 'trial substitution'),
    ],
    minutes: 15,
    lab: 'equation-box',
    hook: t(
      '□+7=19 的方框是零、一个按钮，还是暂时不知道的数？如果换成 24−□=9，方框的对象有什么变化？',
      'In □+7=19, is the box zero, a button, or a number not yet known? What changes when the relationship is 24−□=9?',
    ),
    guided: q(
      'P55-L01-G',
      [
        '□+7=19，方框是多少？先说它是未知加数。',
        'Find the box in □+7=19; identify it as the unknown addend.',
      ],
      eq('add', '7', '19'),
      '12',
      B,
      ['26', '7', '19'],
      undefined,
      true,
    ),
    questions: [
      c(
        'P55-L01-Q1',
        [
          '同一题 □+□=14 中，两个方框按约定表示什么？',
          'By convention, what do the two boxes mean in □+□=14 within one problem?',
        ],
        1,
        B,
        [
          [
            ['两个可以随便不同的数', 'Two freely different numbers'],
            [
              '本题相同方框表示同一个未知数，不能随意一个五一个九。',
              'Identical boxes in this problem represent one unknown, not freely five and nine.',
            ],
          ],
          [
            ['同一个暂时未知的数', 'The same number not yet known'],
            [
              '用同一个候选值代入两处，七加七等于十四。',
              'Substitute the same candidate in both places; seven plus seven equals fourteen.',
            ],
          ],
          [
            ['每个方框都必须是零', 'Every box must be zero'],
            [
              '方框未给值，不代表零。零加零不能满足十四。',
              'An unassigned box is not zero; zero plus zero does not equal fourteen.',
            ],
          ],
        ],
        [
          [
            '看题目对相同符号的约定。',
            'Check the convention for identical symbols.',
          ],
          [
            '试代时要把同一个数放到两处。',
            'Use the same candidate in both places.',
          ],
        ],
        [['2×□=14，所以 □=7，代回 7+7=14。', '2×□=14, so □=7; check 7+7=14.']],
      ),
      q(
        'P55-L01-Q2',
        ['24−□=9，去掉的量是多少？', 'Find the removed amount in 24−□=9.'],
        eq('subtract-from', '24', '9'),
        '15',
        B,
        ['33', '9', '24'],
      ),
      q(
        'P55-L01-Q3',
        [
          '4×□=28，四个相同方框每个是多少？',
          'In 4×□=28, what is the value in each identical box?',
        ],
        eq('multiply', '4', '28'),
        '7',
        B,
        ['24', '32', '28'],
        undefined,
        true,
      ),
      q(
        'P55-L01-Q4',
        ['□÷5=6，未知原量是多少？', 'Find the unknown original in □÷5=6.'],
        eq('divide', '5', '6'),
        '30',
        B,
        ['1.2', '11', '6'],
      ),
      q(
        'P55-L01-Q5',
        [
          '□+6=6，方框可以是零吗？填写使原式成立的数。',
          'Can the box be zero in □+6=6? Enter the value that satisfies the original.',
        ],
        eq('add', '6', '6'),
        '0',
        B,
        ['6', '12', '0/0'],
      ),
      r(
        'P55-L01-Q6',
        [
          '为什么同一题 □+□=14 不能一个填 5、一个填 9，虽然 5+9=14？换一道独立题时，方框一定仍是 7 吗？',
          'Why can □+□=14 not use five in one box and nine in the other, although 5+9=14? Must a box in a separate problem still equal seven?',
        ],
        B,
        [
          '本题相同方框约定为同一个未知数，需要两处都为七并代回。五与九虽和正确，却违反相同未知量的约定。独立新题由新关系确定未知数，不要求仍为七；先解释对象。',
          'Identical boxes in this equation stand for the same unknown, so both are seven. Five and nine total fourteen but violate that identity. A separate problem determines its unknown from its own relationship; the symbol need not always mean seven. Identify the object first.',
        ],
        [
          [
            '本题的同一符号表示同一数量。',
            'The same symbol here represents the same quantity.',
          ],
          [
            '区分同一关系中的重复符号与另一道新题。',
            'Distinguish repeated symbols within one relationship from a separate problem.',
          ],
        ],
      ),
    ],
    exit: q(
      'P55-L01-X',
      [
        '收到 8 张卡后共有 23 张。设原有 □ 张，原有多少张？',
        'Receive eight cards and have 23 in total. Let the box be the original count. How many originally?',
      ],
      eq('add', '8', '23'),
      '15',
      B,
      ['31', '8', '15 bags'],
      'cards',
    ),
    exitReason: t(
      '把符号与原有张数联系，而非把总张数填入方框。',
      'Connect the symbol to the original card count, rather than insert the final total.',
    ),
    parent: {
      goal: t(
        '孩子先说方框指哪个数量，再代回核查。',
        'The child states which quantity the box represents, then checks by substitution.',
      ),
      misconception: t(
        '方框等于零、任意空格或总数；同题重复方框用不同值。',
        'Treating a box as zero, an arbitrary blank or the total; using different values for repeated boxes.',
      ),
      prompts: [
        t(
          '24−□=9 的方框是原量、去掉量还是剩余？',
          'Is the box in 24−□=9 original, removed or remaining?',
        ),
        t(
          '为什么把候选值放回原式比只看答案更有用？',
          'Why is substituting into the original more useful than merely looking at the answer?',
        ),
      ],
      bridge: 'B02-L04',
    },
  }),
  lesson({
    id: 'P55-L02',
    title: t('等号意味着两边相等', 'The equal sign means balance'),
    objective: t(
      '把等号读成两边值相等，解释交换两边与两边同量加减保留关系，拒绝不等值的连等式。',
      'Read equality relationally, explain side reversal and identical additions/subtractions, and reject unequal chains.',
    ),
    prerequisites: ['P55-L01', 'B02-L04'],
    keywords: [
      t('等号', 'equal sign'),
      t('等量关系', 'equality relationship'),
      t('两边同量', 'same amount on both sides'),
    ],
    minutes: 16,
    lab: 'equation-balance',
    hook: t(
      '8+4=□+5，等号后不是只写一个答案。你需要让哪两边的值相等？',
      'In 8+4=□+5, the equal sign is not merely followed by an answer. Which two side values must agree?',
    ),
    guided: q(
      'P55-L02-G',
      [
        '8+4=□+5，填几才使两边相等？',
        'Find the box so both sides of 8+4=□+5 agree.',
      ],
      eq('add', '5', '12', true),
      '7',
      E,
      ['12', '17', '5'],
    ),
    questions: [
      c(
        'P55-L02-Q1',
        [
          '哪一句正确解释等号？',
          'Which statement correctly explains equality?',
        ],
        2,
        E,
        [
          [
            [
              '等号后只能放一个计算答案',
              'Only one calculated answer may follow it',
            ],
            [
              '等号两边都可有式子，只要求值相等。',
              'Both sides may be expressions; their values must agree.',
            ],
          ],
          [
            [
              '把等号反向就一定改变值',
              'Reversing the equal sign always changes values',
            ],
            [
              '12=7+5 与 7+5=12 表达同一等量关系。',
              '12=7+5 and 7+5=12 state the same equality.',
            ],
          ],
          [
            [
              '两边的值相同，方向可交换',
              'Both side values agree; the sides may be reversed',
            ],
            [
              '等号是关系，两边必须先核对；不是下一步按钮。',
              'Equality is a relationship to check, not a next-step command.',
            ],
          ],
        ],
        [
          [
            '分别算两边，不只盯等号右边。',
            'Evaluate both sides, not only the right.',
          ],
          ['12 与 7+5 的值都为十二。', 'Both 12 and 7+5 have value twelve.'],
        ],
        [
          [
            'a=b 与 b=a 的相等关系相同。',
            'a=b and b=a express the same equality.',
          ],
        ],
      ),
      q(
        'P55-L02-Q2',
        ['15=9+□，方框是多少？', 'Find the box in 15=9+□.'],
        eq('add', '9', '15', true),
        '6',
        E,
        ['24', '15', '9'],
        undefined,
        true,
      ),
      q(
        'P55-L02-Q3',
        [
          '□+8=17，填入后核对两边。',
          'Find the box in □+8=17, then compare both sides.',
        ],
        eq('add', '8', '17'),
        '9',
        E,
        ['25', '17', '8'],
      ),
      q(
        'P55-L02-Q4',
        ['20−4=□+7，方框是多少？', 'Find the box in 20−4=□+7.'],
        eq('add', '7', '16', true),
        '9',
        E,
        ['16', '23', '13'],
      ),
      q(
        'P55-L02-Q5',
        ['6+□=14+3，方框是多少？', 'Find the box in 6+□=14+3.'],
        eq('add', '6', '17'),
        '11',
        E,
        ['17', '8', '23'],
      ),
      r(
        'P55-L02-Q6',
        [
          '有人写 7+5=12+4=16 来记录“算完再加四”。为什么不成立？怎样修正，并说明只改右边不保留原等量关系？',
          'Someone writes 7+5=12+4=16 to mean “calculate, then add four.” Why is this invalid? Correct it and explain why changing only the right side fails to preserve equality.',
        ],
        E,
        [
          '连等式要求所有段的值都相等，但 7+5 为十二、12+4 为十六。写成 7+5=12，另写 12+4=16；或若整体都加四，写 (7+5)+4=12+4=16。只给一边加四会改变差。',
          'An equality chain requires every linked expression to have the same value, but 7+5 is twelve and 12+4 is sixteen. Write separate equalities, or add four to both sides: (7+5)+4=12+4=16. Adding four to only one side changes the difference.',
        ],
        [
          ['分别求每个等号连接的值。', 'Evaluate each linked expression.'],
          [
            '下一步叙述可另起一行，不能把时间先后当相等。',
            'Use a separate line for the next calculation; sequence is not equality.',
          ],
        ],
      ),
    ],
    exit: q(
      'P55-L02-X',
      ['□+9=5+13，填写使等号成立的数。', 'Find the box in □+9=5+13.'],
      eq('add', '9', '18'),
      '9',
      E,
      ['18', '27', '4'],
    ),
    exitReason: t(
      '把等号两边都当作有值的式子，而非右侧答案槽。',
      'Treat both sides as valued expressions rather than the right as an answer slot.',
    ),
    parent: {
      goal: t(
        '孩子能独立说明同量操作保持两边的差。',
        'The child explains that identical operations preserve the difference.',
      ),
      misconception: t(
        '等号当下一步指令；只改一边；把两边同减理解为让原本不等的值相等。',
        'Using equality as a next-step command, changing one side, or thinking identical subtraction makes unequal values equal.',
      ),
      prompts: [
        t(
          '□+3 与 11 两边各减一，候选值四会突然正确吗？',
          'Does subtracting one from both □+3 and 11 suddenly make candidate four correct?',
        ),
        t(
          '把 12=7+5 反向写，改变了什么、保留什么？',
          'What changes and stays the same when reversing 12=7+5?',
        ),
      ],
      bridge: 'P55-L01',
    },
  }),
  lesson({
    id: 'P55-L03',
    title: t('从图形规律写算式', 'Writing expressions for patterns'),
    objective: t(
      '按明确构造写 n 的式子，解释共边与固定额外量，并代入新步数计算而不把式子当方程。',
      'Write an expression from an explicit construction, justify shared edges and fixed extras, and substitute a new step without treating an expression as an equation.',
    ),
    prerequisites: ['B03-L03', 'B05-L02', 'P55-L01'],
    keywords: [
      t('构造规律', 'construction rule'),
      t('代数式', 'expression'),
      t('代入', 'substitution'),
    ],
    minutes: 18,
    lab: 'equation-pattern',
    hook: t(
      '第一个方形四根小棒，每多一个共边方形添几根？4n 恰好符合第一幅图，就能代表所有图吗？',
      'The first square uses four sticks. How many does each added joined square need? If 4n fits the first picture, must it fit all pictures?',
    ),
    guided: patternQ(
      'P55-L03-G',
      [
        '4 个方形排成一行，相邻恰好共一边。共多少根小棒？',
        'Four squares in a row share exactly one edge between neighbours. How many distinct sticks?',
      ],
      'squares',
      4,
      13,
      ['16', '12', '4'],
      true,
    ),
    questions: [
      c(
        'P55-L03-Q1',
        [
          'n 个方形按同样规则排成一行，邻居共一边。哪一个式子适用于所有正整数 n？',
          'For n squares in a row, neighbours sharing an edge, which expression works for every positive integer n?',
        ],
        1,
        P,
        [
          [
            ['4n', '4n'],
            [
              '相邻共边不能重复计数；n=2 就只有七根。',
              'Do not count shared edges twice; n=2 uses seven sticks.',
            ],
          ],
          [
            ['3n+1', '3n+1'],
            [
              '上 n、下 n、竖 n+1，总共 3n+1。',
              'n top, n bottom and n+1 vertical gives 3n+1.',
            ],
          ],
          [
            ['n+3', 'n+3'],
            [
              'n=1 虽得四根，但后续每步添三根，不是添一根。',
              'It fits n=1, but each later step adds three, not one.',
            ],
          ],
        ],
        [
          [
            '找重复增加的部分和固定的一根。',
            'Identify repeated growth and the fixed extra.',
          ],
          [
            '数三类边，不重复数共边。',
            'Count three edge types without repeating shared edges.',
          ],
        ],
        [
          [
            '4+3(n−1)=3n+1，与边分类计数一致。',
            '4+3(n−1)=3n+1 agrees with counting edge types.',
          ],
        ],
      ),
      patternQ(
        'P55-L03-Q2',
        [
          '按相同共边构造，10 个方形共多少根小棒？不必画全。',
          'For ten squares in the same shared-edge construction, how many sticks? You need not draw all.',
        ],
        'squares',
        10,
        31,
        ['40', '30', '13'],
      ),
      patternQ(
        'P55-L03-Q3',
        [
          '两行点每行 5 个，另加一个独立点。共多少个点？',
          'Two rows each contain five counters, plus one separate extra. How many counters?',
        ],
        'counters',
        5,
        11,
        ['10', '15', '6'],
        true,
      ),
      patternQ(
        'P55-L03-Q4',
        [
          '按共边构造，8 个方形需要多少根小棒？',
          'How many sticks for eight squares in the shared-edge construction?',
        ],
        'squares',
        8,
        25,
        ['32', '24', '11'],
      ),
      patternQ(
        'P55-L03-Q5',
        [
          '两行点每行 6 个，另加一个独立点。共多少个点？',
          'Two rows each contain six counters, plus one separate extra. How many counters?',
        ],
        'counters',
        6,
        13,
        ['12', '18', '7'],
      ),
      r(
        'P55-L03-Q6',
        [
          '有人说共边方形小棒数是 n+3，因为 n=1 得四根。用第二幅图反驳，再给出按构造成立的一般式；只有前三个数能唯一确定所有未来规律吗？',
          'Someone proposes n+3 because n=1 gives four sticks. Use the second picture to refute it, then justify a general expression from construction. Do only three observed numbers uniquely determine every future term?',
        ],
        P,
        [
          'n=2 有七根，n+3 只给五根。按明确共边构造，首幅四根每增一个添三根，得 4+3(n−1)=3n+1；也可数边分类。有限几个数字不能唯一确定所有后续规律，本题的一般式依据构造规则而非盲目猜数。',
          'For n=2 there are seven sticks, whereas n+3 gives five. The specified shared-edge construction starts with four and adds three per square: 4+3(n−1)=3n+1. Counting edge types also works. A few observed numbers alone do not uniquely determine all future terms; the construction justifies this expression.',
        ],
        [
          [
            '第二幅图的共边只数一次。',
            'Count the second picture’s shared edge once.',
          ],
          [
            '说明为什么每一步都增加三，而不只列前几项。',
            'Explain why every added square adds three, rather than only list early terms.',
          ],
        ],
      ),
    ],
    exit: patternQ(
      'P55-L03-X',
      [
        '仍按相邻共一边的一行方形构造，20 个方形要多少根小棒？',
        'Using the same row of squares sharing one edge between neighbours, how many sticks for twenty squares?',
      ],
      'squares',
      20,
      61,
      ['80', '60', '23'],
    ),
    exitReason: t(
      '把构造的一般式用于更远步数，不靠小图逐个猜。',
      'Use the justified expression for a more distant step rather than guess from a small picture.',
    ),
    parent: {
      goal: t(
        '孩子能把每一步的增量与固定额外量指到图中。',
        'The child locates repeated growth and the fixed extra in the picture.',
      ),
      misconception: t(
        '共边重计、漏掉固定一根、第一项偶合当通用规律、把 n 当总小棒数。',
        'Double-counting shared edges, missing the extra, treating a first-term coincidence as a rule, or confusing n with the total.',
      ),
      prompts: [
        t(
          '为什么新增方形只新增三根？',
          'Why does each new square add only three sticks?',
        ),
        t(
          '3n+1 没有等号，和 3n+1=16 的任务一样吗？',
          'Does 3n+1 without equality pose the same task as 3n+1=16?',
        ),
      ],
      bridge: 'B03-L03',
    },
  }),
  lesson({
    id: 'P55-L04',
    title: t('一步方程初步', 'One-step equations'),
    objective: t(
      '按未知量的运算选择合法逆运算，保持等量关系，接受精确分数解并代回核查。',
      'Choose a valid inverse from the unknown’s operation, retain equality, allow exact fraction solutions and check by substitution.',
    ),
    prerequisites: ['P55-L02', 'P54-L04', 'B03-L04'],
    keywords: [
      t('方程', 'equation'),
      t('解', 'solution'),
      t('逆运算', 'inverse operation'),
    ],
    minutes: 18,
    lab: 'equation-one-step',
    hook: t(
      '4x=5 的解一定是整数吗？能不能把两边除以零？解方程后，怎样确认自己找到的是原方程的解？',
      'Must 4x=5 have an integer solution? Can both sides be divided by zero? How do you verify a solution in the original equation?',
    ),
    guided: q(
      'P55-L04-G',
      ['解 x+7=19，填写 x 的值。', 'Solve x+7=19; enter the value of x.'],
      eq('add', '7', '19'),
      '12',
      S,
      ['26', '19', '7'],
      undefined,
      true,
    ),
    questions: [
      c(
        'P55-L04-Q1',
        [
          '解 4x=28，哪一个操作保留关系并直接求每个 x？',
          'Which operation retains 4x=28 and directly finds each x?',
        ],
        0,
        S,
        [
          [
            ['两边同除以 4', 'Divide both sides by four'],
            [
              '非零因数四可逆，四个相同量平均分为每个七。',
              'The factor four is nonzero; dividing both sides gives seven per equal amount.',
            ],
          ],
          [
            ['只给右边减 4', 'Subtract four only on the right'],
            [
              '只改一边不保留等量关系，乘四也不是加四。',
              'Changing one side breaks equivalence; multiplying by four is not adding four.',
            ],
          ],
          [
            ['两边除以零', 'Divide both sides by zero'],
            [
              '除零没有定义，即使写“两边相同”也不合法。',
              'Division by zero is undefined, even if done on both sides.',
            ],
          ],
        ],
        [
          [
            '辨别四与 x 是乘法，不是加法。',
            'Identify multiplication, not addition, between four and x.',
          ],
          [
            '四个相同量平均分成四组。',
            'Divide four equal amounts into four groups.',
          ],
        ],
        [
          [
            '4x÷4=28÷4，所以 x=7；代回 4×7=28。',
            '4x÷4=28÷4, so x=7; check 4×7=28.',
          ],
        ],
      ),
      q(
        'P55-L04-Q2',
        ['解 x−8=14。', 'Solve x−8=14.'],
        eq('subtract', '8', '14'),
        '22',
        S,
        ['6', '14', '8'],
      ),
      q(
        'P55-L04-Q3',
        [
          '解 4x=5，保留精确值，可写分数或小数。',
          'Solve 4x=5 exactly; a fraction or decimal is accepted.',
        ],
        eq('multiply', '4', '5'),
        '5/4',
        S,
        ['1', '0.8', '9'],
      ),
      q(
        'P55-L04-Q4',
        ['解 x÷5=6。', 'Solve x÷5=6.'],
        eq('divide', '5', '6'),
        '30',
        S,
        ['1.2', '11', '6'],
      ),
      q(
        'P55-L04-Q5',
        ['解 x+1/4=1。', 'Solve x+1/4=1.'],
        eq('add', '1/4', '1'),
        '3/4',
        S,
        ['5/4', '1/4', '3'],
      ),
      r(
        'P55-L04-Q6',
        [
          '为什么 0×x=0 不能确定唯一 x，而 0×x=5 没有解？不能把两边除零，怎样直接用乘法事实解释？',
          'Why does 0×x=0 not determine a unique x, whereas 0×x=5 has no solution? Explain directly without dividing by zero.',
        ],
        S,
        [
          '零乘任何允许数都为零，因此 0×x=0 的每个允许候选值都满足，不能给唯一值。0×x=5 左边恒零，无法等于五，所以无解。不能除以零；“两边同操作”必须先保证操作有定义。',
          'Zero times any allowed number is zero, so every allowed value satisfies 0×x=0 and no unique value is determined. In 0×x=5, the left stays zero and cannot equal five, so none works. Dividing by zero is undefined; identical operations require validity first.',
        ],
        [
          [
            '试代零、一、二，观察零乘的结果。',
            'Try zero, one and two and inspect their products with zero.',
          ],
          [
            '区分每个值满足和一个值也不满足。',
            'Distinguish every value satisfying an equation from no value satisfying it.',
          ],
        ],
      ),
    ],
    exit: q(
      'P55-L04-X',
      [
        '纸上假想 x 新西兰元花去 NZ$1.25 后剩 NZ$2.75。解 x−1.25=2.75，原有多少？',
        'Imagine x NZD, spend NZ$1.25 and have NZ$2.75 remaining. Solve x−1.25=2.75 for the original amount.',
      ],
      eq('subtract', '1.25', '2.75'),
      '4',
      S,
      ['1.50', '2.75', '4 m'],
      'NZD',
    ),
    exitReason: t(
      '按原量关系恢复钱数，用精确小数或等值分数代回核查。',
      'Recover the original money amount and verify it with exact decimal or fraction arithmetic.',
    ),
    parent: {
      goal: t(
        '孩子说清为什么两边做这个合法逆运算，并代回原式。',
        'The child explains why the chosen inverse is valid on both sides and substitutes back.',
      ),
      misconception: t(
        '只移数字不解释、乘法当加法、非整数解截断、两边除零。',
        'Moving numbers without justification, treating multiplication as addition, truncating fractional solutions or dividing by zero.',
      ),
      prompts: [
        t(
          '4x=5 的 5/4 为什么不能截为 1？',
          'Why may 5/4 in 4x=5 not be truncated to one?',
        ),
        t(
          '候选值满足新式，就一定检查过原式了吗？',
          'Does satisfying a new expression mean the original has already been checked?',
        ),
      ],
      bridge: 'P55-L02',
    },
  }),
  lesson({
    id: 'P55-L05',
    title: t('等量关系的应用题', 'Balance-model word problems'),
    objective: t(
      '先定义未知对象与单位，按原量/剩余或等组列等量关系，求解后在情境中代回。',
      'Define the unknown object and unit, form an equality for original/remaining or equal-group quantities, then solve and substitute into the story.',
    ),
    prerequisites: ['P55-L04', 'B06-L02', 'B06-L05'],
    keywords: [
      t('设未知量', 'define the unknown'),
      t('等量关系', 'quantity equality'),
      t('情境核查', 'context check'),
    ],
    minutes: 20,
    lab: 'equation-story',
    hook: t(
      '收到七张卡后共十九张，x 应该是原有张数还是总张数？“设 x”以后，怎样让每个数字都指向题中的对象？',
      'Receive seven cards and now have nineteen. Does x mean original or total cards? After defining x, how does every number connect to an object in the story?',
    ),
    guided: q(
      'P55-L05-G',
      [
        '收到 7 张卡后共 19 张，设原有 x 张。原有多少张？',
        'Receive seven cards and have nineteen. Let x be the original count. How many cards originally?',
      ],
      eq('add', '7', '19'),
      '12',
      W,
      ['26', '19', '12 bags'],
      'cards',
      true,
    ),
    questions: [
      c(
        'P55-L05-Q1',
        [
          '三袋同样多的铅笔共 24 支，x 表示每袋支数。哪一组式子保留关系？',
          'Three equal bags hold 24 pencils; x is the count per bag. Which expressions retain the relationship?',
        ],
        1,
        W,
        [
          [
            ['x+3=24', 'x+3=24'],
            [
              '三是袋数，不能当三支加到每袋支数。',
              'Three counts bags, not three pencils to add to a per-bag count.',
            ],
          ],
          [
            ['3x=24，或 24=3x', '3x=24, or 24=3x'],
            [
              '组数乘每组量为总量，交换等号两边保留关系。',
              'Group count times each amount gives total; reversing sides retains equality.',
            ],
          ],
          [
            ['x÷3=24', 'x÷3=24'],
            [
              '本题 x 是每袋量，不是待平均分的总量。',
              'x is the per-bag amount, not a total to divide.',
            ],
          ],
        ],
        [
          ['先把 x 的对象说完整。', 'State the object represented by x.'],
          [
            '三组相同每组量合成二十四。',
            'Three equal amounts form twenty-four.',
          ],
        ],
        [
          [
            '3x=24，x=8 支；三袋各八支恢复二十四支。',
            '3x=24, so x=8 pencils; three eights restore twenty-four.',
          ],
        ],
      ),
      q(
        'P55-L05-Q2',
        [
          '纸上假想花去 NZ$1.25，剩 NZ$2.75。设原有 x 新西兰元，原有多少？',
          'On paper, imagine spending NZ$1.25 with NZ$2.75 remaining. Let x be original NZD. How much originally?',
        ],
        eq('subtract', '1.25', '2.75'),
        '4',
        W,
        ['1.5', '2.75', '4 L'],
        'NZD',
      ),
      q(
        'P55-L05-Q3',
        [
          '5 m 彩带平均剪成 4 段，设每段 x m。每段多少米？',
          'Divide five metres of ribbon into four equal pieces. Let x m be each length. How long is each?',
        ],
        eq('multiply', '4', '5'),
        '5/4',
        W,
        ['1', '4/5', '5/4 L'],
        'm',
        true,
      ),
      q(
        'P55-L05-Q4',
        [
          '6 袋同样多的铅笔共 48 支。设每袋 x 支，每袋多少支？',
          'Six equal bags contain 48 pencils. Let x be the pencil count per bag. How many per bag?',
        ],
        eq('multiply', '6', '48'),
        '8',
        W,
        ['42', '54', '8 bags'],
        'pencils',
      ),
      q(
        'P55-L05-Q5',
        [
          '蓝彩带比红彩带长 1/4 m，红彩带长 3/4 m。设蓝彩带 x m，蓝彩带多长？',
          'Blue ribbon is 1/4 m longer than red ribbon of length 3/4 m. Let x m be the blue length. How long is it?',
        ],
        eq('subtract', '1/4', '3/4'),
        '1',
        W,
        ['1/2', '3/4', '1 L'],
        'm',
      ),
      r(
        'P55-L05-Q6',
        [
          '三袋各 x 张卡，另有两张散卡，共二十张。为什么 3(x+2)=20 改变了题意？只要求列正确关系与解释，不要求解两步方程。',
          'Three bags each hold x cards, with two loose cards, twenty in total. Why does 3(x+2)=20 change the story? State and justify the correct relationship; solving a two-step equation is not required.',
        ],
        W,
        [
          '散卡两张只加一次，不是每袋两张。三袋合计 3x 张，再加两张得 3x+2=20；3(x+2) 会把两张重复放进三袋，共额外六张。x 是每袋张数，单位仍是张卡。',
          'The two loose cards are added once, not inside every bag. The bags contain 3x cards; adding two gives 3x+2=20. In 3(x+2), two extras are counted in every bag, six altogether. x remains the per-bag card count and the unit is cards.',
        ],
        [
          ['把散卡画在袋子外面。', 'Draw loose cards outside the bags.'],
          [
            '括号里的两张会被乘三次。',
            'The two inside brackets would be multiplied by three.',
          ],
        ],
      ),
    ],
    exit: q(
      'P55-L05-X',
      [
        '送出 9 张卡后剩 17 张。设原有 x 张，原有多少张？自己列关系并核查。',
        'Give away nine cards and have seventeen left. Let x be the original count. Form and check the relationship independently.',
      ],
      eq('subtract', '9', '17'),
      '26',
      W,
      ['8', '17', '26 bags'],
      'cards',
    ),
    exitReason: t(
      '保留未知原量与剩余的对象差异，代回送出量后仍得剩余。',
      'Distinguish unknown original from remainder and recover the remainder after removing the given amount.',
    ),
    parent: {
      goal: t(
        '孩子能先定义 x 与单位，再解释每一项从哪里来。',
        'The child defines x and its unit, then explains where every term comes from.',
      ),
      misconception: t(
        'x 总是最后总量、袋数与每袋数量相加、把散卡重复到每组、单位填错。',
        'Assuming x always means final total, adding group count to per-group amount, repeating loose cards or mismatching units.',
      ),
      prompts: [
        t(
          '为什么 5 m 分四段的 x 是每段米数，不是四段？',
          'Why is x for five metres divided into four pieces a per-piece metre length, not four pieces?',
        ),
        t(
          '送出后的剩余怎样帮你核查原有量？',
          'How does the remaining count check the original?',
        ),
      ],
      bridge: 'B06-L02',
    },
    familyChallenge: t(
      '纸笔天平，不需采购：写 8+4=□+5，孩子先解释等号两边的对象，再找 □=7 并代回。两边各加三得到 8+4+3=□+5+3，观察七仍满足；只给一边加三则不保留关系。再画四个共边方形，解释为何十三根而非十六根。接受不同有依据的解释，不计时。',
      'Use a paper balance. No real purchase is required. Write 8+4=□+5, identify both sides, find □=7 and substitute. Add three to both sides and see that seven still works; adding to only one side changes the relationship. Draw four joined squares and explain thirteen rather than sixteen sticks. Accept different sound explanations without timing.',
    ),
  }),
];
export const p55CheckQuestions: Question[] = [
  q(
    'P55-CHECK-Q1',
    ['30−□=12，方框是多少？', 'Find the box in 30−□=12.'],
    eq('subtract-from', '30', '12'),
    '18',
    B,
    ['42', '12', '30'],
  ),
  q(
    'P55-CHECK-Q2',
    ['9+5=□+6，填几使两边相等？', 'Find the box in 9+5=□+6.'],
    eq('add', '6', '14', true),
    '8',
    E,
    ['14', '20', '6'],
  ),
  patternQ(
    'P55-CHECK-Q3',
    [
      '七个共边方形排成一行，邻居共一边。共多少根小棒？',
      'Seven joined squares in a row share one edge between neighbours. How many sticks?',
    ],
    'squares',
    7,
    22,
    ['28', '21', '10'],
    true,
  ),
  q(
    'P55-CHECK-Q4',
    ['解 x÷4=3。', 'Solve x÷4=3.'],
    eq('divide', '4', '3'),
    '12',
    S,
    ['0.75', '7', '3'],
  ),
  c(
    'P55-CHECK-Q5',
    [
      '哪一个操作保证保留原等量关系？',
      'Which operation guarantees retaining an equality?',
    ],
    2,
    E,
    [
      [
        ['只给左边加二', 'Add two only to the left'],
        [
          '只改一边改变两边的差，不保证原关系。',
          'Changing one side changes the difference and does not preserve the relationship.',
        ],
      ],
      [
        ['两边都除零', 'Divide both sides by zero'],
        [
          '除零没有定义，不因两边一样操作而变合法。',
          'Division by zero is undefined even if done to both sides.',
        ],
      ],
      [
        ['两边同时加同一个二', 'Add the same two to both sides'],
        [
          '相同加法保留两边差，原来相等仍相等。',
          'Identical addition preserves the difference and therefore retains equality.',
        ],
      ],
    ],
    [
      [
        '合法操作与两边同操作都要检查。',
        'Check both validity and identical treatment of the sides.',
      ],
      [
        '相同加法有定义且不改变差。',
        'Identical addition is defined and preserves the difference.',
      ],
    ],
    [['a=b ⇒ a+2=b+2。', 'a=b implies a+2=b+2.']],
  ),
  q(
    'P55-CHECK-Q6',
    [
      '5 袋同样多的铅笔共 35 支。每袋多少支？',
      'Five equal bags contain 35 pencils. How many per bag?',
    ],
    eq('multiply', '5', '35'),
    '7',
    W,
    ['30', '40', '7 bags'],
    'pencils',
  ),
  q(
    'P55-CHECK-Q7',
    [
      '纸上假想花 NZ$2.40 后剩 NZ$3.60。原有多少新西兰元？',
      'Imagine spending NZ$2.40 with NZ$3.60 left. How many dollars originally?',
    ],
    eq('subtract', '2.40', '3.60'),
    '6',
    W,
    ['1.20', '3.60', '6 m'],
    'NZD',
  ),
  r(
    'P55-CHECK-Q8',
    [
      '5 m 彩带平均分四段，有人设 x 是“段数”又写 4x=5。修正 x 的对象和单位，再给解与情境核查。',
      'Five metres of ribbon are divided into four equal pieces. Someone defines x as “the piece count” but writes 4x=5. Correct the unknown and unit, then give a solution and a story check.',
    ],
    W,
    [
      '4x=5 中 x 应为每段米数，四是段数，总长五米；x=5/4 m=1.25 m。四段乘每段长度恢复五米。若 x 是段数，不能沿用这条同一意义的式子；单位必须对应对象。',
      'In 4x=5, x is the metre length per piece; four counts pieces and five is the total metres. x=5/4 m=1.25 m; four such lengths restore five metres. Defining x as piece count does not retain the same meaning. Units must follow the objects.',
    ],
    [
      [
        '把每个数和 x 的对象写完整。',
        'Name the object for every number and x.',
      ],
      [
        '组数乘每组长度才是总长度。',
        'Piece count times length per piece yields total length.',
      ],
    ],
  ),
];
export function p55ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative safe-integer round');
  const index = p55Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new Error(`Unknown P55 lesson ${id}`);
  const k = round % 80,
    number = 4 + Math.floor(k / 4),
    a = 2 + (k % 7);
  if (index === 2) {
    const kind = k % 2 ? 'counters' : 'squares',
      n = 1 + (k % 30);
    return patternQ(
      `${id}-R${round}`,
      kind === 'squares'
        ? [
            `按相邻共一边的构造，${n} 个一行方形共多少小棒？`,
            `A row of ${n} square${n === 1 ? '' : 's'} follows the stated shared-edge construction. How many sticks?`,
          ]
        : [
            `两行每行 ${n} 个点，另加一个，共多少个点？`,
            `Two rows each have ${n} counter${n === 1 ? '' : 's'}, plus one extra. How many counters?`,
          ],
      kind,
      n,
      patternPieces(kind, n).count,
      [String(n), String(n === 1 ? 5 : 4 * n)],
      true,
    );
  }
  let equation: EarlyEquation, unit: Unit;
  const kinds: EarlyEquation['kind'][] = [
    'add',
    'subtract',
    'multiply',
    'divide',
  ];
  const kind = kinds[k % 4]!;
  const solution =
    index === 3 && k % 4 === 2
      ? `${number}/4`
      : index === 3 && k % 4 === 0
        ? `${number}.25`
        : String(number);
  if (index === 1) {
    equation = eq('add', String(a), String(number + a), k % 2 === 0);
  } else {
    const base = eq(
      kind,
      index === 3 && k % 4 === 0
        ? '1/4'
        : kind === 'subtract'
          ? String(2 + (k % 3))
          : String(a),
      '0',
    );
    const value = equationSides(base, solution).left;
    equation = { ...base, b: rationalText(value) };
  }
  if (index === 4) {
    unit = k % 2 ? 'NZD' : 'cards';
    if (k % 2) equation = eq('subtract', String(a), String(number));
    else equation = eq('add', String(a), String(number + a));
  }
  const answer =
    index === 4
      ? k % 2
        ? String(number + a)
        : String(number)
      : rationalText(equationQuantity(solution));
  const stem: Pair =
    index === 4
      ? k % 2
        ? [
            `纸上假想花去 NZ$${a} 后剩 NZ$${number}，原有多少新西兰元？`,
            `Imagine spending NZ$${a} with NZ$${number} left. How much originally?`,
          ]
        : [
            `收到 ${a} 张卡后共 ${number + a} 张，原有多少张？`,
            `Receive ${a} cards and have ${number + a}. How many originally?`,
          ]
      : [
          `找使 ${equationText(equation, index === 0 ? '□' : 'x')} 成立的未知数。`,
          `Find the unknown satisfying ${equationText(equation, index === 0 ? '□' : 'x')}.`,
        ];
  return q(
    `${id}-R${round}`,
    stem,
    equation,
    answer,
    index === 0 ? B : index === 1 ? E : index === 3 ? S : W,
    [String(Number(number) + a + 1), '0/0'],
    unit,
    true,
  );
}
