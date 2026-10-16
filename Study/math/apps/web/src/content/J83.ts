import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  coordinateText,
  readCoordinate,
  basicBounds,
  type PlotBounds,
} from '../cartesianModels';
import { parseLinearSystem, systemLineSegment, rowText } from '../systemModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Mode = 'pair' | 'model' | 'none' | 'infinite' | 'number' | 'expression';
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  mode: Mode;
  accepted: string[];
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  mode: Mode = 'pair',
  accepted: string[] = [],
): Item => ({ stem, value, step, wrong, mode, accepted });
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'simultaneous-pair-relations',
  'whole-expression-substitution',
  'reversible-row-elimination',
  'graphical-system-classification',
  'two-quantity-system-model',
];
const hints: Pair[][] = [
  [
    [
      '同一对 x、y 分别代入两条原式，不只核第一式。',
      'Substitute the same x,y into both original equations, not only the first.',
    ],
    [
      '写先 x 后 y 的数对；单式的许多解中找同时符合第二式的。原数量关系建模与最后解值分开。',
      'Write the ordered pair x then y. Find a shared pair among first-equation solutions; modelling original relationships differs from listing solved values.',
    ],
  ],
  [
    [
      '从一式用另一个字母表示一个未知数，把整个表达式带括号代入另一式。',
      'Isolate one variable and substitute its entire bracketed expression into the other equation.',
    ],
    [
      '先解剩余未知数，再代回求另一个，最后核两式。零等于零仍保留原关系，零等于非零为矛盾。',
      'Solve the remaining variable, back-substitute and check both. An identity still retains the original relation; zero equal to nonzero is a contradiction.',
    ],
  ],
  [
    [
      '选择能抵消一个字母的倍数，左右全部项都一起倍乘。',
      'Choose multipliers cancelling a variable, scaling every term on both sides.',
    ],
    [
      '保留另一式，只用可还原的行替换；不能把两式都换成同一条或乘零丢信息。',
      'Retain the other equation and use a reversible row replacement; do not replace both with one row or lose information through zero multiplication.',
    ],
  ],
  [
    [
      '读两条线的共同点，区分相交、平行与重合，并核刻度和视窗。',
      'Inspect common points, distinguishing intersecting, parallel and coincident lines; read scales and the window.',
    ],
    [
      '图可能只给近似，精确数对代回两式；交点在视窗外不等于无解，重合线不等于所有数对。',
      'A picture may give only an approximation. Check exact pairs in both equations; an off-window intersection is not no solution, and a coincident line is not every pair.',
    ],
  ],
  [
    [
      '先定义 x、y 所代表的量与单位，分别写总量与加权金额。',
      'Define both quantities and units, then write total quantity and weighted cost separately.',
    ],
    [
      '两条原关系要保留；求得代数数对后另核非负、整数或连续量条件，不把票数四舍五入。',
      'Retain both original relationships. After solving, separately audit nonnegative, integer or continuous amounts; do not round ticket counts.',
    ],
  ],
];
function diagram(
  source: string,
  bounds: PlotBounds = basicBounds,
): Question['diagram'] {
  const rows = parseLinearSystem(source)!;
  return {
    kind: 'cartesian',
    bounds,
    points: [],
    curves: rows.map((r, i) => ({
      points: systemLineSegment(r, bounds),
      name: `${i + 1}: ${rowText(r)}`,
      color: i ? '#a14532' : '#5954a3',
      dash: i ? '7 4' : undefined,
    })),
    caption: t(
      `① 实线：${rowText(rows[0])}；② 虚线：${rowText(rows[1])}。先读刻度与视窗，再用原式核验。`,
      `① solid: ${rowText(rows[0])}; ② dashed: ${rowText(rows[1])}. Read the scales/window, then verify in the original equations.`,
    ),
  };
}
function q(id: string, i: number, item: Item): Question {
  const value =
    item.mode === 'pair'
      ? coordinateText(readCoordinate(item.value)!)
      : item.value;
  const answer: AnswerSpec =
    item.mode === 'pair'
      ? { kind: 'coordinate', value }
      : item.mode === 'model'
        ? { kind: 'linear-system', value }
        : item.mode === 'none' || item.mode === 'infinite'
          ? { kind: 'system-class', value: item.mode }
          : item.mode === 'expression'
            ? { kind: 'expression', value, variable: 'x' }
            : { kind: 'number', value, formats: ['decimal', 'fraction'] };
  const custom: Pair[] =
    item.mode === 'number'
      ? [
          hints[i]![0]!,
          [
            '只写题目所求数值，区分代入左值、合成系数与右侧常数。',
            'Enter only the requested number, distinguishing an evaluated left side, a combined coefficient and a right-side constant.',
          ],
        ]
      : item.mode === 'model'
        ? [
            [
              '先定义 x、y 的量与单位，再分别保留题干的两条数量关系。',
              'Define the quantities and units of x,y, then retain the two stated quantity relationships separately.',
            ],
            [
              '每条方程须对应一条原数量关系，可逐式等价改写，不能只交最后的两个解值。',
              'Each equation must retain an original quantity relationship; equivalent rewrites are allowed, but not merely the final two solved values.',
            ],
          ]
        : item.mode === 'expression'
          ? [
              [
                '将含 y 的项单独留一边，整条等式同步变形。',
                'Isolate the y term while transforming the full equation.',
              ],
              [
                '只写 y 等号右侧的 x 表达式，不写等号；系数与负号作用到整个余项。',
                'Enter only the x expression after y=, without the equal sign; apply coefficients and signs to the whole remainder.',
              ],
            ]
          : hints[i]!;
  const result = numeric(
    id,
    T(item.stem),
    value,
    skills[i]!,
    custom.map(T),
    [T(item.step), T(custom[1]!)],
    { accepted: [value, ...item.accepted], rejected: item.wrong },
    item.diagram,
  );
  result.answer = answer;
  result.misconceptionTags = [
    skills[i]!,
    'same-pair-both-relations',
    'equivalence-and-domain',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
const specs: Spec[] = [
  {
    title: ['两个未知数的关系', 'Relationships with two unknowns'],
    objective: [
      '用同一个有序数对同时核两条一次关系，区分单式与方程组的解。',
      'Use the same ordered pair to check both linear relationships, distinguishing one equation from a system.',
    ],
    prerequisites: ['J73-L01', 'J75-L01', 'J72-L01'],
    keywords: [
      ['有序数对', 'ordered pair'],
      ['同时满足', 'simultaneous satisfaction'],
      ['两条关系', 'two relationships'],
    ],
    lab: 'system-relations',
    hook: [
      '(2,5) 满足 x+y=7，就一定满足 2x+y=11 吗？一个数对要通过几次核验？',
      'If (2,5) satisfies x+y=7, must it satisfy 2x+y=11? How many checks must the same pair pass?',
    ],
    items: [
      I(
        [
          '求 x+y=7、2x+y=11 的共同解，按 (x,y) 写精确数对。',
          'Find the shared solution of x+y=7 and 2x+y=11. Give the exact pair (x,y).',
        ],
        '(4,3)',
        [
          '同对四、三代回，两式左值分别七、十一。',
          'Substitute the same four and three; the left values are seven and eleven.',
        ],
        ['(2,5)', '(3,4)', '4'],
      ),
      I(
        [
          '求 x+y=4、x−y=0 的共同解，写 (x,y)。',
          'Solve x+y=4 and x−y=0, giving (x,y).',
        ],
        '(2,2)',
        [
          '差为零所以两量相同，和四得到各二，核两式。',
          'The zero difference makes the quantities equal; their sum four gives two each.',
        ],
        ['(4,0)', '(0,4)', '2'],
      ),
      I(
        [
          'x、y 的和为八，x 比 y 多二。写保留这两条原关系的方程组，用分号分开，不只写最后解值。',
          'x and y sum to eight, and x exceeds y by two. Write both original equations separated by a semicolon, rather than only solved values.',
        ],
        'x+y=8;x-y=2',
        [
          '总量关系 x+y=8，差量关系 x−y=2，各自保留。',
          'Retain total x+y=8 and difference x−y=2.',
        ],
        ['x=5;y=3', 'x+y=8;x+y=2', 'x+y=8'],
        'model',
        ['x-y=2;y+x=8', '2x+2y=16;3x-3y=6'],
      ),
      I(
        [
          '求 x+y=3、2x−y=0 的共同解，写 (x,y)。',
          'Solve x+y=3 and 2x−y=0, giving (x,y).',
        ],
        '(1,2)',
        [
          'y=2x，和为三，得 x=1、y=2。',
          'y=2x and the sum is three, giving x=1,y=2.',
        ],
        ['(2,1)', '(0,3)', '1'],
      ),
      I(
        [
          '候选 (2,5) 满足 x+y=7。将同对代入 2x+y，左值是多少？只写数值。',
          'Candidate (2,5) satisfies x+y=7. What is the left value of 2x+y for that same pair? Enter the number.',
        ],
        '9',
        [
          '二乘二再加五为九，不等于十一，所以不是该组的解。',
          'Two times two plus five is nine, not eleven, so the pair fails the system.',
        ],
        ['7', '11', '4'],
        'number',
      ),
      I(
        [
          '求 x+y=9、x−y=3 的共同解，写 (x,y)。',
          'Solve x+y=9 and x−y=3, giving (x,y).',
        ],
        '(6,3)',
        [
          '和与差相加得二 x 等十二，再代回得 y=3。',
          'Adding sum and difference gives 2x=12; back-substitution gives y=3.',
        ],
        ['(3,6)', '(9,3)', '6'],
      ),
    ],
    pick: {
      stem: [
        '方程组的一个解必须怎样？',
        'What must a solution of a system do?',
      ],
      options: [
        ['只符合第一式即可', 'Satisfy only the first equation'],
        ['x、y 可分别来自两个不同数对', 'Take x and y from different pairs'],
        [
          '同一个数对同时符合每条原式',
          'Use the same pair to satisfy every original equation',
        ],
      ],
      feedback: [
        [
          '只满足一条仍可能不满足另一条。',
          'Passing one equation may fail the other.',
        ],
        [
          '必须用同一对同时代入，不能拼接。',
          'The same ordered pair must be substituted throughout.',
        ],
        [
          '两条关系共同约束同一组未知数。',
          'Both relationships constrain the same unknown quantities.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '用 (2,5) 与 (4,3) 检查 x+y=7、2x+y=11，解释单式的解与方程组共同解的区别。',
      'Check (2,5) and (4,3) in x+y=7 and 2x+y=11, explaining one-equation solutions versus shared solutions.',
    ],
    rubric: [
      '(2,5) 第一式七通过，第二式九不等十一；(4,3) 两式分别七与十一，都通过。每个数对内部先 x 后 y，整个代入过程使用同一组值。一条关系有许多数对，第二条取交集；两个方程也不自动保证唯一，后续需判断是否独立、矛盾或同线。不能从两组各挑一个坐标拼解。家长核对每次代入与同时含义。',
      '(2,5) passes the first equation but gives nine rather than eleven in the second. (4,3) passes both. Keep x,y order and the same pair throughout. A second relation selects shared pairs from the first set; two equations do not automatically ensure uniqueness. Do not assemble coordinates from different solutions. Check every substitution and the meaning of simultaneous satisfaction.',
    ],
    misconception: [
      '只核一式、交换 x/y、把两组不同解拼接、两式必有唯一解。',
      'Checking only one equation, swapping coordinates, mixing pairs or assuming two equations always give a unique solution.',
    ],
    prompts: [
      [
        '这个数对在两式左边分别算出什么？',
        'What does this pair produce on each left side?',
      ],
      [
        '两个坐标一直指同一组量吗？',
        'Do the coordinates retain the same meanings throughout?',
      ],
    ],
  },
  {
    title: ['代入消元法', 'Substitution method'],
    objective: [
      '把一个未知数的整个等值表达式代入另一式，回代并同时核验。',
      'Substitute one variable’s entire equal expression into the other equation, back-substitute and verify both.',
    ],
    prerequisites: ['J83-L01', 'J73-L03'],
    keywords: [
      ['等值代换', 'equal substitution'],
      ['整个表达式', 'whole expression'],
      ['回代', 'back-substitution'],
    ],
    lab: 'system-substitute',
    hook: [
      '由 x+y=7 得 y=7−x 后，代入 2x+y=11 时，原来 y 的位置该放整个什么？',
      'After y=7−x, what whole expression replaces y in 2x+y=11?',
    ],
    items: [
      I(
        [
          '用代入法求 x+y=7、2x+y=11 的解，写 (x,y)。',
          'Use substitution to solve x+y=7 and 2x+y=11, giving (x,y).',
        ],
        '(4,3)',
        [
          'y=7−x，2x+(7−x)=11，得 x=4，回代 y=3。',
          'y=7−x gives 2x+(7−x)=11, so x=4 and then y=3.',
        ],
        ['(3,4)', '(4,7)', '4'],
      ),
      I(
        [
          '由 2x+y=1 表示 y，只写 y 等号右侧的 x 表达式，不写等号。',
          'From 2x+y=1 isolate y. Enter only the right-side expression in x, without the equal sign.',
        ],
        '1-2x',
        [
          '两边减二 x，得到 y=1−2x，负号作用完整。',
          'Subtract 2x from both sides to obtain y=1−2x.',
        ],
        ['1+2x', '2x-1', 'y=1-2x'],
        'expression',
        ['-2x+1'],
      ),
      I(
        [
          '用代入法求 2x+y=1、x−y=0 的精确解，写 (x,y)。',
          'Solve 2x+y=1 and x−y=0 by substitution. Give the exact pair (x,y).',
        ],
        '(1/3,1/3)',
        [
          'x=y，三 x 等一，两个量均为三分之一；不要用截断小数。',
          'x=y, so 3x=1 and both equal one third; do not use truncated decimals.',
        ],
        ['(0.33,0.33)', '(1,0)', '(1/3,2/3)'],
      ),
      I(
        [
          '判断 x+y=4、2x+2y=8 的解的情况，写无解或无穷多解。',
          'Classify the solutions of x+y=4 and 2x+2y=8: no solution or infinitely many solutions.',
        ],
        'infinite',
        [
          '代入得 0=0，原 x+y=4 仍限制数对，同线上无穷多。',
          'Substitution gives 0=0 but x+y=4 still constrains the pairs on one line.',
        ],
        ['none', 'all pairs', '(2,2)'],
        'infinite',
        ['无穷多解', 'infinitely many solutions'],
      ),
      I(
        [
          '判断 x+y=4、2x+2y=9 的解的情况。',
          'Classify the solutions of x+y=4 and 2x+2y=9.',
        ],
        'none',
        [
          '代入得到八等于九矛盾，无同一数对。',
          'Substitution requires eight to equal nine, a contradiction.',
        ],
        ['infinite', 'all', '(2,2)'],
        'none',
        ['无解', 'no solution'],
      ),
      I(
        [
          '求 y=2x−1、x+y=8 的解，写 (x,y)。',
          'Solve y=2x−1 and x+y=8, giving (x,y).',
        ],
        '(3,5)',
        [
          'x+(2x−1)=8，三 x 等九，回代 y=5。',
          'x+(2x−1)=8 gives 3x=9, then y=5.',
        ],
        ['(5,3)', '(3,6)', '3'],
      ),
    ],
    pick: {
      stem: [
        '把 y=7−x 代入 2x+3y=11，哪条正确？',
        'Substitute y=7−x into 2x+3y=11. Which is correct?',
      ],
      options: [
        ['2x+21−x=11', '2x+21−x=11'],
        ['2x+3(7−x)=11', '2x+3(7−x)=11'],
        ['2x+3·7+x=11', '2x+3·7+x=11'],
      ],
      feedback: [
        ['三还要乘负 x，不能只乘七。', 'Three must also multiply −x.'],
        [
          '原 y 被整个带括号表达式替换，三保留。',
          'The whole bracketed expression replaces y, retaining its coefficient.',
        ],
        [
          '代入不能把表达式的负号改为正。',
          'Substitution does not reverse the inside sign.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '写出 x+y=7、2x+y=11 的代入与回代理由，再说明得到 0=0 时为何不能说“所有数对”。',
      'Explain substitution and back-substitution for x+y=7 and 2x+y=11, then explain why 0=0 would not establish every pair.',
    ],
    rubric: [
      '由第一式 y=7−x，整段替换第二式 y，得 2x+(7−x)=11，合并成 x=4，回代得 y=3，再核两原式。代换使用已知相等表达式，系数和符号完整保留。若消元得到恒等式，只说明这条新式不再增加条件；原式仍需保留，例如 x+y=4 限制一条线，(0,0) 不符合。零等于非零则是矛盾，不能通过除零处理。',
      'From the first equation y=7−x, replace all of y in the second, giving 2x+(7−x)=11. Solve x=4, back-substitute y=3 and verify both originals. A resulting identity adds no condition but does not remove the retained relation: x+y=4 still excludes (0,0). Zero equal to nonzero is a contradiction, not an instruction to divide by zero.',
    ],
    misconception: [
      '只代入一部分、括号系数漏分配、只求一个未知数、恒等式误判所有数对。',
      'Partial substitution, incomplete distribution, solving only one variable or interpreting an identity as every pair.',
    ],
    prompts: [
      ['原式里哪个完整对象被替换？', 'Which whole object is being replaced?'],
      [
        '回代后两条原关系都核过吗？',
        'Were both original relations checked after back-substitution?',
      ],
    ],
  },
  {
    title: ['加减消元法', 'Elimination method'],
    objective: [
      '完整倍乘并加减消去一个未知数，保留另一式并识别可逆条件。',
      'Scale and combine complete equations to eliminate a variable, retaining the other equation and reversibility.',
    ],
    prerequisites: ['J83-L01', 'J73-L02'],
    keywords: [
      ['整式倍乘', 'whole-equation scaling'],
      ['相消', 'cancellation'],
      ['保留关系', 'retained relationship'],
    ],
    lab: 'system-eliminate',
    hook: [
      '两式相加消去 y 后，只剩一条方程就足够了吗？乘零再替换会丢掉什么？',
      'After addition eliminates y, is one equation enough? What information is lost by a zero-multiplier replacement?',
    ],
    items: [
      I(
        [
          '用加减法解 2x+y=11、x−y=1，写 (x,y)。',
          'Use elimination to solve 2x+y=11 and x−y=1, giving (x,y).',
        ],
        '(4,3)',
        [
          '相加得三 x 等十二，保留 x−y=1，回代得 y=3。',
          'Addition gives 3x=12; retain x−y=1 to obtain y=3.',
        ],
        ['(3,4)', '(4,1)', '4'],
      ),
      I(
        [
          '解 2x+3y=13、3x−2y=0，写精确 (x,y)。',
          'Solve 2x+3y=13 and 3x−2y=0, giving the exact pair (x,y).',
        ],
        '(2,3)',
        [
          '第一式乘二、第二式乘三，相加十三 x 等二十六。',
          'Scale the first by two and second by three; addition gives 13x=26.',
        ],
        ['(3,2)', '(2,2)', '(13,0)'],
      ),
      I(
        [
          '第一式 2x+3y=13 乘二，第二式 3x−2y=0 乘三后相加，所得 x 的系数是多少？',
          'Multiply 2x+3y=13 by two and 3x−2y=0 by three, then add. What is the coefficient of x?',
        ],
        '13',
        [
          '二倍首式给四 x，三倍次式给九 x，总系数十三。',
          'The x coefficients become four and nine, totalling thirteen.',
        ],
        ['5', '6', '26'],
        'number',
      ),
      I(
        [
          '判断 3x−y=2、6x−2y=4 的解的情况。',
          'Classify the solutions of 3x−y=2 and 6x−2y=4.',
        ],
        'infinite',
        [
          '两式成倍数，消元得恒等式，但原直线约束仍在。',
          'The equations are proportional; elimination leaves an identity while retaining the original line.',
        ],
        ['none', 'all pairs', '(0,0)'],
        'infinite',
        ['无穷多解', 'infinitely many pairs'],
      ),
      I(
        [
          '判断 3x−y=2、6x−2y=5 的解的情况。',
          'Classify the solutions of 3x−y=2 and 6x−2y=5.',
        ],
        'none',
        [
          '左边两倍，右边却非两倍，消元出现矛盾。',
          'The left sides are proportional but the constants are inconsistent.',
        ],
        ['infinite', 'all', '(1,1)'],
        'none',
        ['无解', 'no solution'],
      ),
      I(
        [
          '用加减法解 3x−y=7、x+y=5，写 (x,y)。',
          'Use elimination to solve 3x−y=7 and x+y=5, giving (x,y).',
        ],
        '(3,2)',
        [
          '相加四 x 等十二，回代 y=2，两式均符合。',
          'Addition gives 4x=12; back-substitution gives y=2.',
        ],
        ['(2,3)', '(3,1)', '3'],
      ),
    ],
    pick: {
      stem: [
        '保留第二式，用 k₁×第一式+k₂×第二式替换第一式，哪条保证可还原？',
        'Retain equation two and replace equation one by k₁ times one plus k₂ times two. Which condition preserves reversibility?',
      ],
      options: [
        ['k₁ 非零，并保留第二式', 'k₁ is nonzero and equation two is retained'],
        ['只保留合成的一式就够', 'Retain only the combined equation'],
        [
          'k₁ 可取零，信息不会改变',
          'k₁ may be zero without losing information',
        ],
      ],
      feedback: [
        [
          '可由新第一式减回 k₂ 倍第二式，再除非零 k₁ 恢复原第一式。',
          'Subtract k₂ times the retained second row and divide by nonzero k₁ to recover the first.',
        ],
        [
          '单一合成式通常含有额外数对，丢失原约束。',
          'One combined equation usually permits extra pairs.',
        ],
        [
          '零使原第一式不再参与，无法还原。',
          'Zero removes the original first row and prevents recovery.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释 2x+y=11、x−y=1 的加减步骤，为何要保留一式；再给出 k₁=0 替换丢失条件的反例。',
      'Explain elimination for 2x+y=11 and x−y=1, why one equation is retained, and a counterexample to replacing row one with k₁=0.',
    ],
    rubric: [
      '将两式完整相加得 3x=12，保留 x−y=1，所以 x=4、y=3。只留 3x=12 会让任意 y 都通过，额外增加解。若保留第二式并用零倍第一式加一倍第二式替换第一式，两条都成 x−y=1，(1,0) 通过新组，却使原第一式左值二而非十一，信息已丢。一般替换需原第一式系数 k₁ 非零，才可从新行及保留行还原。完整倍乘左右所有项，不靠“看到 y 消了”就宣称同解。',
      'Adding complete rows gives 3x=12; retain x−y=1 to get x=4,y=3. The combined row alone permits any y. With k₁=0,k₂=1, both rows become x−y=1; (1,0) passes but fails the original first equation. Nonzero k₁ allows recovery using the retained row. Scale every term on both sides; cancellation alone does not establish an equivalent system.',
    ],
    misconception: [
      '只乘左边或一项、同号不改倍数硬消、只剩一式、乘零丢原关系。',
      'Scaling one side or term, forcing cancellation, discarding the retained row or losing a relation through zero multiplication.',
    ],
    prompts: [
      [
        '相加后哪条原关系仍保留？',
        'Which original relationship remains after combining?',
      ],
      [
        '能从新组还原旧组吗？',
        'Can the old system be recovered from the new one?',
      ],
    ],
  },
  {
    title: ['坐标图解方程组', 'Solving systems graphically'],
    objective: [
      '将解理解为两直线共同点，区分三种情况并用代数核精确值与视窗边界。',
      'Interpret solutions as common points, distinguishing line cases and checking exact values and window limits algebraically.',
    ],
    prerequisites: ['J83-L01', 'J75-L02', 'J75-L03'],
    keywords: [
      ['交点', 'intersection'],
      ['平行与重合', 'parallel and coincident'],
      ['视窗与精度', 'window and precision'],
    ],
    lab: 'system-graph',
    hook: [
      '两线在屏幕上没相交，能断言无解吗？两式重合时，是否每个坐标点都符合？',
      'If lines do not meet on screen, is there no solution? If they coincide, does every point satisfy them?',
    ],
    items: [
      {
        ...I(
          [
            '读两条给定直线的共同点，并代回 x+y=5、x−y=1，写精确 (x,y)。',
            'Read the common point of the supplied lines and verify x+y=5 and x−y=1. Give exact (x,y).',
          ],
          '(3,2)',
          [
            '共同点三、二使和五、差一，数对顺序不能交换。',
            'The common point three,two has sum five and difference one.',
          ],
          ['(2,3)', '(5,1)', 'none'],
        ),
        diagram: diagram('x+y=5;x-y=1'),
      },
      {
        ...I(
          [
            '两条直线 y=x+1、y=x−2 的共同解是什么情况？',
            'Classify the shared solutions of y=x+1 and y=x−2.',
          ],
          'none',
          [
            '相同变化率、不同截距，平行不同线，无共同点。',
            'Equal rate and different intercepts give distinct parallel lines.',
          ],
          ['infinite', 'all pairs', '(0,1)'],
          'none',
          ['无解', 'no solution'],
        ),
        diagram: diagram('y=x+1;y=x-2'),
      },
      {
        ...I(
          [
            'x+y=4 与 2x+2y=8 在图中重合，解是什么情况？',
            'The graphs of x+y=4 and 2x+2y=8 coincide. Classify the solutions.',
          ],
          'infinite',
          [
            '共同解是这条线上无穷多个点，并非整个平面。',
            'The shared set is infinitely many points on that line, not the whole plane.',
          ],
          ['none', 'all pairs', '所有数对'],
          'infinite',
          ['无穷多解'],
        ),
        diagram: diagram('x+y=4;2x+2y=8'),
      },
      {
        ...I(
          [
            '直线 x=2 与 y=3 的共同点是什么？写 (x,y)。',
            'What point is shared by x=2 and y=3? Give (x,y).',
          ],
          '(2,3)',
          [
            '竖直线固定 x=2，水平线固定 y=3，交点同时符合。',
            'The vertical fixes x=2 and horizontal fixes y=3.',
          ],
          ['(3,2)', 'none', '(2,2)'],
        ),
        diagram: diagram('x=2;y=3'),
      },
      {
        ...I(
          [
            '给定直线 x+y=1、x−y=0，图读近似后写精确解 (x,y)。',
            'For x+y=1 and x−y=0, use the graph then give the exact pair (x,y).',
          ],
          '(1/2,1/2)',
          [
            '两量相同而和一，精确各半，代回两式。',
            'Equal quantities sum to one, giving exactly one half each.',
          ],
          ['(0,1)', '(1,0)', '(0.49,0.49)'],
          'pair',
          ['(0.5,0.5)'],
        ),
        diagram: diagram('x+y=1;x-y=0'),
      },
      {
        ...I(
          [
            '当前图窗两轴均 −5 至 5。x+y=12、x−y=2 的交点未见；不能据此判无解。用拓宽或代数求精确 (x,y)。',
            'The window spans −5 to 5 on each axis. The intersection of x+y=12 and x−y=2 is unseen; this does not prove no solution. Expand the view or use algebra for exact (x,y).',
          ],
          '(7,5)',
          [
            '相加二 x 等十四，得七、五；x 超出当前窗，解仍存在。',
            'Addition gives 2x=14, hence seven,five; x lies beyond the current window.',
          ],
          ['none', '(5,5)', '(5,7)'],
        ),
        diagram: diagram('x+y=12;x-y=2'),
      },
    ],
    pick: {
      stem: [
        '两条原方程表示同一直线时，哪条正确？',
        'When both equations describe the same line, which statement is correct?',
      ],
      options: [
        ['整个平面所有数对都是解', 'Every pair in the plane is a solution'],
        [
          '只要选一个点就证明只有一个解',
          'Choosing one point proves uniqueness',
        ],
        [
          '直线上有无穷多解，线外点不符合',
          'Infinitely many line points solve it; off-line points do not',
        ],
      ],
      feedback: [
        [
          '仍有共同直线的关系约束。',
          'The shared line still imposes a relationship.',
        ],
        [
          '一个共同点不排除其他共同点。',
          'One shared point does not exclude other shared points.',
        ],
        [
          '两式约束重复，但并未消失。',
          'The repeated constraint is retained rather than removed.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较相交、平行与重合；说明竖直线、半单位交点及图窗外交点为什么都需回到原式核验。',
      'Compare intersecting, parallel and coincident lines; explain vertical, fractional and off-window cases through the original equations.',
    ],
    rubric: [
      '每条直线是该式的数对解集，共同点即两集合交集。不同非平行线一交点，平行不同线无交点，重合线无穷多但非所有平面点。x=2 为竖直线，不必写成 y=mx+b；与 y=3 交在 (2,3)。x+y=1、x−y=0 精确交半、半，像素近似不能代替分数。x+y=12、x−y=2 交七、五，初窗看不见不影响存在。更换视窗或两轴比例只改显示，不改方程解；精确类型由原关系核验。',
      'Each line is one equation’s pair set; shared points form the intersection. Distinct nonparallel lines meet once, distinct parallels never meet, and coincident lines share infinitely many points without covering the plane. A vertical x=2 need not be written y=mx+b. Fractions require exact substitution rather than pixels, and the point (7,5) can exist outside a small window. Changing scales or range changes display, not the solution set.',
    ],
    misconception: [
      '看不到交点就无解、重合等于所有数对、竖直线不能表示关系、近似读数作精确值。',
      'Equating unseen with nonexistent intersections, coincidence with every pair, rejecting vertical relations or using approximate pixels as exact values.',
    ],
    prompts: [
      [
        '这是方程没有交点，还是窗口没包括交点？',
        'Is there no intersection, or is it outside the window?',
      ],
      [
        '这个精确数对代回每式都成立吗？',
        'Does the exact pair satisfy each original equation?',
      ],
    ],
  },
  {
    title: ['实际情境建模', 'Modelling a real-world system'],
    objective: [
      '定义两个量、单位与条件，建立总量及加权关系，分开核代数解与情境允许性。',
      'Define two quantities, units and domains, build total and weighted relationships, and separately audit algebra and context.',
    ],
    prerequisites: ['J83-L02', 'J83-L03', 'J73-L06'],
    keywords: [
      ['变量与单位', 'variables and units'],
      ['两条原关系', 'original relationships'],
      ['情境允许性', 'context admissibility'],
    ],
    lab: 'system-model',
    hook: [
      '同一个分数数对表示票数与升数，结论会一样吗？建模该写两条原关系，还是直接写最后解？',
      'Does the same fractional pair mean the same thing for tickets and litres? Should modelling retain original relationships or only solved values?',
    ],
    items: [
      I(
        [
          '虚构活动成人票 x 张，每张 NZ$5；儿童票 y 张，每张 NZ$3。共七张，总价 NZ$29，x、y 为非负整数。写两条原数量关系，用分号分开。',
          'At a fictional event, x adult tickets cost NZ$5 each and y child tickets NZ$3 each. Seven tickets total NZ$29, with nonnegative integer counts. Write the two original quantity equations separated by a semicolon.',
        ],
        'x+y=7;5x+3y=29',
        [
          '总张数 x+y=7，总金额 5x+3y=29；单价与张数相乘。',
          'Total count is x+y=7 and cost 5x+3y=29; multiply each price by its count.',
        ],
        ['x=4;y=3', 'x+y=7;5x+3y=7', 'x+y=29;5x+3y=7'],
        'model',
        ['3y+5x=29;y+x=7', '2x+2y=14;10x+6y=58'],
      ),
      I(
        [
          '同一虚构七张票、总价二十九的模型，写允许的 (x,y)。',
          'For the same fictional seven-ticket, twenty-nine-dollar model, give the allowed pair (x,y).',
        ],
        '(4,3)',
        [
          '代数得四、三，两式成立且均为非负整数张数。',
          'The pair four,three satisfies both equations and nonnegative integer counts.',
        ],
        ['(3,4)', '(4.5,2.5)', '4'],
      ),
      I(
        [
          '改为七张票总价 NZ$30，方程 x+y=7、5x+3y=30。暂只求代数精确数对 (x,y)，另核票数范围。',
          'Change the seven-ticket cost to NZ$30, with x+y=7 and 5x+3y=30. First give the exact algebraic pair (x,y), before checking count restrictions.',
        ],
        '(9/2,5/2)',
        [
          '消元二 x 等九，x=9/2、y=5/2，代数成立。',
          'Elimination gives 2x=9, so x=9/2,y=5/2 algebraically.',
        ],
        ['(5,2)', '(4,3)', '(5/2,9/2)'],
      ),
      I(
        [
          '上述总价三十模型要求票数为非负整数。允许的情境解是什么情况？不要把代数唯一解说成方程无解。',
          'The thirty-dollar ticket model requires nonnegative integer counts. Is there an allowed contextual solution? Distinguish this from the algebraic solution.',
        ],
        'none',
        [
          '唯一代数数对为 9/2、5/2，非整数票数，所以本情境无允许解；不能四舍五入。',
          'The unique algebraic pair 9/2,5/2 is not integer ticket counts; no contextual solution is allowed and rounding does not fix it.',
        ],
        ['infinite', '(5,2)', '(4,3)'],
        'none',
        ['no allowed solution', '无符合条件的解'],
      ),
      I(
        [
          '虚构果汁 x 升每升 NZ$5、y 升每升 NZ$3，共七升、总价 NZ$30；量为非负实数。写允许的 (x,y)，单位 L 不写进数对。',
          'Fictional juices are x litres at NZ$5 per litre and y litres at NZ$3 per litre. Seven litres cost NZ$30; amounts are nonnegative real quantities. Give the allowed pair, omitting L inside it.',
        ],
        '(9/2,5/2)',
        [
          '相同代数数对，在连续升数情境允许，均非负。',
          'The same algebraic pair is allowed for continuous nonnegative litres.',
        ],
        ['none', '(5,2)', '(5/2,9/2)'],
      ),
      I(
        [
          '虚构活动成人票 x 张每张 NZ$6、儿童票 y 张每张 NZ$2，共八张、总价 NZ$32。写两条原数量关系，非负整数条件另说明。',
          'A fictional event has x adult tickets at NZ$6 and y child tickets at NZ$2, eight tickets totalling NZ$32. Write both original equations; state the nonnegative integer domain separately.',
        ],
        'x+y=8;6x+2y=32',
        [
          '总张数八与加权金额三十二是不同量纲的两条关系。',
          'Total count eight and weighted cost thirty-two are separate relationships with different units.',
        ],
        ['x=4;y=4', 'x+y=32;6x+2y=8', 'x+y=8;6+2=32'],
        'model',
        ['6x+2y=32;x+y=8'],
      ),
    ],
    pick: {
      stem: [
        '票数模型的唯一代数解是 (9/2,5/2)，怎样处理？',
        'A ticket model has the unique algebraic pair (9/2,5/2). What follows?',
      ],
      options: [
        ['四舍五入成五张与两张即可', 'Round to five and two tickets'],
        [
          '代数有解，但无允许整数票数组；回查条件或数据',
          'There is an algebraic solution but no allowed integer counts; recheck assumptions or data',
        ],
        ['方程组代数上无解', 'The system has no algebraic solution'],
      ],
      feedback: [
        [
          '取整后金额通常不再符合原式。',
          'Rounding generally breaks the original cost equation.',
        ],
        [
          '代数关系与现实取值范围要分开判断。',
          'Algebraic relationships and contextual domains require separate decisions.',
        ],
        [
          '分数数对实际满足两式，不能说代数无解。',
          'The fractional pair satisfies both equations, so algebra is not inconsistent.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较七张票总价三十与七升果汁总价三十的相同方程，解释两条原关系、单位、分数数对与允许性。',
      'Compare the identical equations for seven tickets versus seven litres costing thirty, explaining original relationships, units, the fractional pair and admissibility.',
    ],
    rubric: [
      '先定义 x/y 为各类型的张数或升数，单价五/三乘数量，总量 x+y=7、金额5x+3y=30。解为 (9/2,5/2)，分别代回和七、金额三十。票数须非负整数，故没有情境允许解，但代数唯一解仍存在；果汁非负连续量允许分数升，数对有效。取整五、二会金额三十一而非三十，不能作为修复。建模保留两条原数量关系，不能只写 x=9/2;y=5/2 冒充模型。家长核定义、量纲、条件和两层结论。',
      'Define x/y as ticket counts or litres, with total x+y=7 and weighted cost 5x+3y=30. The exact pair (9/2,5/2) satisfies both. It is not allowed for integer ticket counts, despite a unique algebraic solution, but is allowed for nonnegative continuous litres. Rounding to five and two changes cost to thirty-one. Preserve both original quantity relationships rather than submitting only solved values. Check definitions, dimensions, conditions and separate conclusions.',
    ],
    misconception: [
      '总量与金额混用、单价不乘数量、只交最终解当模型、分数票数取整、代数与情境无解混称。',
      'Mixing totals and costs, omitting weighted quantities, replacing models with solved values, rounding ticket counts or conflating algebraic inconsistency with context rejection.',
    ],
    prompts: [
      [
        '每条方程两边的单位相同吗？',
        'Do both sides of each equation have matching units?',
      ],
      [
        '这个数对是方程成立，还是也满足情境条件？',
        'Does this pair satisfy only the equations, or also the context domain?',
      ],
    ],
  },
];
export const j83Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J83-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J08',
    unit: 'J83',
    order: i + 1,
    nzYearHints: [8, 9],
    cnGradeHints: [8],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上设计虚构社区活动的两种票或两种按升计价材料，定义 x/y、单位与范围。写总量和加权金额，用代入与加减各解一次，再画两线并将同一数对代回两式。改变总价制造分数票数，比较相同代数关系在连续升数下是否允许；另给一个重合线与图窗外交点案例。只需纸笔，不要求购买、实测或真实个人资料。',
            'On paper, design fictional community tickets or two materials priced per litre. Define x/y, units and domains, write total and weighted cost, solve by substitution and elimination, and plot/check the same pair in both equations. Change the total to produce fractional counts and compare continuous litres. Add coincident and off-window examples. Paper is sufficient, without purchases, measurements or personal data.',
          ),
        }
      : {}),
  };
});
export function j83ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J83-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J83 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 9) - 4,
    b = (Math.floor(k / 9) % 9) - 4,
    n = (k % 7) - 3,
    d = [1, 2, 3][k % 3]!,
    c = a + 5;
  let item: Item;
  if (i === 0)
    item = I(
      [
        `求 x+y=${a + b}、2x+y=${2 * a + b} 的共同解，写 (x,y)。`,
        `Solve x+y=${a + b} and 2x+y=${2 * a + b}, giving (x,y).`,
      ],
      `(${a},${b})`,
      [
        '同对代入两条，和与加权值分别核。',
        'Substitute the same pair into both the sum and weighted equation.',
      ],
      [`(${a + 1},${b})`],
    );
  else if (i === 1)
    item = I(
      [
        `代入求 2x+y=1、x−y=${3 * n - d}/${d}，写精确 (x,y)。`,
        `Use substitution for 2x+y=1 and x−y=${3 * n - d}/${d}, giving exact (x,y).`,
      ],
      `(${n}/${d},${d - 2 * n}/${d})`,
      [
        '整个表达式代入，保留分数，回代后核两式。',
        'Substitute the whole expression, retain exact fractions and check both.',
      ],
      [`(${n + 1}/${d},${d - 2 * n}/${d})`],
    );
  else if (i === 2 && (k % 4 === 1 || k % 4 === 2)) {
    const infinite = k % 4 === 1;
    item = I(
      [
        `判断 x+y=${c}、2x+2y=${2 * c + (infinite ? 0 : 1)} 的解的情况。`,
        `Classify x+y=${c} and 2x+2y=${2 * c + (infinite ? 0 : 1)}.`,
      ],
      infinite ? 'infinite' : 'none',
      [
        '消元核零行的常数，仍保留另一式，不把重合线当全平面。',
        'Inspect the eliminated row’s constant while retaining the other equation; coincidence is not the whole plane.',
      ],
      infinite ? ['none', 'all pairs'] : ['infinite', 'all'],
      infinite ? 'infinite' : 'none',
    );
  } else if (i === 2)
    item = I(
      [
        `加减求 2x+y=${2 * a + b}、x−y=${a - b}，写 (x,y)。`,
        `Use elimination for 2x+y=${2 * a + b} and x−y=${a - b}, giving (x,y).`,
      ],
      `(${a},${b})`,
      [
        '两式相加消 y，保留一式回代，不丢条件。',
        'Add to eliminate y and retain one equation for back-substitution.',
      ],
      [`(${a},${b + 1})`],
    );
  else if (i === 3) {
    const mode = k % 5;
    let source: string;
    if (mode === 1 || mode === 2) {
      const infinite = mode === 2;
      source = infinite ? `x+y=${c};3x+3y=${3 * c}` : `x+y=${c};x+y=${c + 1}`;
      item = I(
        [
          `图像来自 ${source}。判断共同解的情况。`,
          `The graphs come from ${source}. Classify shared solutions.`,
        ],
        infinite ? 'infinite' : 'none',
        [
          '判原式是否同一关系，平行不同或重合，不只看颜色。',
          'Check the original relationships for distinct parallels or coincidence, not colours alone.',
        ],
        infinite ? ['none', 'all pairs'] : ['infinite', 'all'],
        infinite ? 'infinite' : 'none',
      );
    } else {
      source =
        mode === 3
          ? `x=${a};y=${b}`
          : mode === 4
            ? `x+y=1;x-y=${2 * n - d}/${d}`
            : `x+y=${a + b};x-y=${a - b}`;
      item = I(
        [
          `图像来自 ${source}。核精确共同数对 (x,y)。`,
          `The graphs come from ${source}. Verify the exact shared pair (x,y).`,
        ],
        mode === 4 ? `(${n}/${d},${d - n}/${d})` : `(${a},${b})`,
        [
          '按两轴刻度读后代回两式，竖直线也表示关系。',
          'Read both scales and verify both equations; vertical lines also represent relations.',
        ],
        [mode === 4 ? `(${n + 1}/${d},${d - n}/${d})` : `(${a + 1},${b})`],
      );
    }
    item.diagram = diagram(source);
  } else {
    const total = 8 + (k % 5),
      adult = 1 + (k % 5),
      cost = 3 * total + 2 * adult;
    item = I(
      [
        `虚构活动 x 张五元票、y 张三元票，共 ${total} 张、总价 ${cost} 元。非负整数张数，写两条原数量关系。`,
        `A fictional event has x five-dollar and y three-dollar tickets, ${total} tickets costing ${cost} dollars. Counts are nonnegative integers; write both original equations.`,
      ],
      `x+y=${total};5x+3y=${cost}`,
      [
        '总张数与加权金额分开保留，不直接用最后解代替。',
        'Retain total count and weighted cost separately rather than replacing them with solved values.',
      ],
      [`x=${adult};y=${total - adult}`],
      'model',
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const j83CheckQuestions: Question[] = [
  q(
    'J83-CHECK-Q1',
    0,
    I(
      ['解 x+y=9、x−y=1，写 (x,y)。', 'Solve x+y=9 and x−y=1, giving (x,y).'],
      '(5,4)',
      [
        '和差相加得十，两量五与四。',
        'Adding gives 2x=10, hence five and four.',
      ],
      ['(4,5)', '(9,1)', '5'],
    ),
  ),
  q(
    'J83-CHECK-Q2',
    4,
    I(
      [
        '虚构两种书，x 本每本四元、y 本每本二元，共六本、总价十八。写保留原数量的两式，本数为非负整数。',
        'Fictional books: x cost four dollars each and y cost two each, six books total eighteen dollars. Write both original quantity equations with nonnegative integer counts.',
      ],
      'x+y=6;4x+2y=18',
      [
        '总本数六，加权金额十八，不是两单价直接相加。',
        'Total count six and weighted cost eighteen are separate.',
      ],
      ['x=3;y=3', 'x+y=18;4x+2y=6'],
      'model',
    ),
  ),
  q(
    'J83-CHECK-Q3',
    2,
    I(
      ['解 2x+y=7、x−y=2，写 (x,y)。', 'Solve 2x+y=7 and x−y=2, giving (x,y).'],
      '(3,1)',
      ['相加三 x 等九，回代 y=1。', 'Addition gives 3x=9, then y=1.'],
      ['(1,3)', '(2,3)', '3'],
    ),
  ),
  q('J83-CHECK-Q4', 3, {
    ...I(
      ['判断 x−2y=1、2x−4y=3 的解的情况。', 'Classify x−2y=1 and 2x−4y=3.'],
      'none',
      [
        '左边成倍数而常数不符，是平行不同线。',
        'Proportional left sides with inconsistent constants give distinct parallels.',
      ],
      ['infinite', 'all pairs'],
      'none',
    ),
    diagram: diagram('x-2y=1;2x-4y=3'),
  }),
  q('J83-CHECK-Q5', 3, {
    ...I(
      ['判断 x+y=3、3x+3y=9 的解的情况。', 'Classify x+y=3 and 3x+3y=9.'],
      'infinite',
      [
        '同线重合，无穷多点但不覆盖所有数对。',
        'The same line gives infinitely many pairs, not all pairs.',
      ],
      ['none', 'all pairs'],
      'infinite',
    ),
    diagram: diagram('x+y=3;3x+3y=9'),
  }),
  q(
    'J83-CHECK-Q6',
    4,
    I(
      [
        '虚构两种液体 x、y 升均非负，x+y=5、4x+2y=13，写允许的精确 (x,y)，单位另说明。',
        'Fictional liquid amounts x,y litres are nonnegative, with x+y=5 and 4x+2y=13. Give the allowed exact pair, stating units separately.',
      ],
      '(3/2,7/2)',
      [
        '两 x 等三，x 一点五升、y 三点五升，连续量允许。',
        '2x=3 gives one and a half and three and a half litres, permitted continuous amounts.',
      ],
      ['(2,3)', '(7/2,3/2)', 'none'],
    ),
  ),
  pick('J83-CHECK-Q7', 4, specs[4]!.pick),
  reasoning(
    'J83-CHECK-Q8',
    t(
      '说明方程组的共同数对、代入或加减的等价依据、图像三种情况，以及代数解与情境条件的两层核验。',
      'Explain shared pairs, equivalent substitution or elimination, the three line cases, and separate algebraic and contextual audits.',
    ),
    skills[4]!,
    t(
      '同一对 x/y 同时代入两条原关系；代入整个表达式，或完整倍乘并只替换一行、保留另一行，不能用零丢信息。相交唯一、平行不同无解、重合无穷多而非全平面；图窗和近似读数不改变代数结论，竖直线合法。建模先定义数量和单位、写总量及加权关系；分数票数不允许但分数升数可以，代数唯一不保证情境允许，不能靠取整修复。家长检查具体方程、每一步及原式回代，不按术语数评分。',
      'Use the same x/y pair in both originals. Substitute the whole expression, or scale complete equations and replace one row while retaining the other without zero information loss. Intersecting lines have one shared point, distinct parallels none, coincident lines infinitely many without covering the plane. Windows and approximate pixels do not determine exact types; vertical lines are valid. Define quantities/units and retain total plus weighted relationships. Fractional tickets fail a count domain while fractional litres may pass. Review concrete steps and substitution, not keywords.',
    ),
    hints[4]!.map(T),
  ),
];
