import { t, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  functionModel,
  functionCurve,
  functionWideBounds,
  type FunctionClass,
} from '../functionModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  accepted: string[];
  mode: 'number' | 'expression' | 'coordinate' | FunctionClass;
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  mode: Item['mode'] = 'number',
  accepted: string[] = [],
): Item => ({ stem, value, steps, wrong, mode, accepted });
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
  'affine-rule-parameters',
  'slope-as-unit-rate',
  'y-intercept-at-zero',
  'two-point-function-model',
  'direct-versus-first-degree',
  'bounded-linear-context',
];
const hints: Pair[][] = [
  [
    [
      '先分清输入 x、对应输出 y 与固定参数 m/b。',
      'Separate input x, output y and fixed parameters m/b.',
    ],
    [
      '计算先乘后加；一般式要对全部允许输入成立，m=0 的特例另看。',
      'Multiply before adding; a general expression must hold for all permitted inputs. Check the m=0 exception.',
    ],
  ],
  [
    [
      '按同一顺序计算 Δx=x₂−x₁ 与 Δy=y₂−y₁。',
      'Compute Δx=x₂-x₁ and Δy=y₂-y₁ in the same order.',
    ],
    [
      'm=Δy/Δx，保留正负与精确分数；像素倾角不是变化率，Δx=0 时不能除。',
      'm=Δy/Δx with exact sign and fraction. A screen angle is not a rate; never divide by a zero Δx.',
    ],
  ],
  [
    [
      'y 轴上的点满足 x=0，把零代入原关系。',
      'A point on the y axis has x=0; substitute zero in the relationship.',
    ],
    [
      'b 是 y 值，截距点写 (0,b)；不是 (b,0)，不自动表示观测起点。',
      'b is the y value; the intercept point is (0,b), not (b,0). It need not be the start of observations.',
    ],
  ],
  [
    [
      '先比较两点的 x；不同才用 Δy/Δx 求 m。',
      'First compare the x coordinates; use Δy/Δx only if they differ.',
    ],
    [
      '再用 b=y₁−mx₁，写一般式并回代两点。重复点不唯一，竖直线不是 y 关于 x 的函数。',
      'Then b=y₁-mx₁; write the rule and check both points. Duplicate points are underdetermined; a vertical line is not y as a function of x.',
    ],
  ],
  [
    [
      '按本单元 m≠0 的约定检查是否形如 mx+b，再核 b=0。',
      'Under this unit’s m≠0 convention, test the form mx+b, then whether b=0.',
    ],
    [
      '过原点不够，x² 也过原点；m=0 为常函数，y/x 在零输入未定义。',
      'Origin crossing is insufficient: x² crosses too. m=0 is constant; y/x is undefined at zero.',
    ],
  ],
  [
    [
      '定义输入/输出和单位；固定起始量是 b，每单位变化是 m。',
      'Define inputs, outputs and units. The fixed starting amount is b and per-unit change is m.',
    ],
    [
      '原公式、允许输入域和连续/整数条件都要核；排空后或域外不能任意延长。',
      'Check the rule, input domain and continuous/integer restriction. Do not extend past emptying or outside the stated domain.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const r = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [...item.steps.map(T), T(hints[i]![1]!)],
    { accepted: [item.value, ...item.accepted], rejected: item.wrong },
    item.diagram,
  );
  r.answer =
    item.mode === 'expression'
      ? { kind: 'expression', value: item.value, variable: 'x' }
      : item.mode === 'coordinate'
        ? { kind: 'coordinate', value: item.value }
        : item.mode === 'number'
          ? {
              kind: 'number',
              value: item.value,
              formats: ['decimal', 'fraction'],
            }
          : { kind: 'function-class', value: item.mode };
  r.misconceptionTags = [skills[i]!, 'rate-versus-value', 'scale-and-domain'];
  return r;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((o, j) => ({ text: T(o), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
const plot = (
  m: string,
  b: string,
  points: { x: number; y: number; label: string }[] = [],
): Question['diagram'] => ({
  kind: 'cartesian',
  bounds: functionWideBounds,
  points,
  curves: [
    {
      points: functionCurve(functionModel(m, b), functionWideBounds),
      name: 'given relationship',
    },
  ],
  caption: t(
    '按各轴单位读取；公式为题设给定关系，图只显示有限部分。',
    'Read each axis scale; the formula is a supplied relationship and the plot shows only a finite portion.',
  ),
});
const specs: Spec[] = [
  {
    title: ['关系式y=mx+b', 'The form y=mx+b'],
    objective: [
      '区分输入、输出与参数，用 y=mx+b 表示一般关系并识别零斜率特例。',
      'Separate input, output and parameters in y=mx+b and recognise the zero-slope exception.',
    ],
    prerequisites: ['J75-L04', 'J72-L01', 'J73-L01'],
    keywords: [
      ['输入输出', 'input and output'],
      ['参数', 'parameter'],
      ['一次函数', 'first-degree function'],
    ],
    lab: 'function-form',
    hook: [
      'y=2x+3 中，改 x 与改那个固定的三，会让图发生同一种变化吗？',
      'In y=2x+3, does changing x do the same thing as changing the fixed three?',
    ],
    items: [
      I(
        [
          '给定 m=2、b=3，写 y 右侧的完整一般式，只用 x、不写 y=。',
          'Given m=2,b=3, write the general expression after y= using x, without y=.',
        ],
        '2x+3',
        [
          [
            '把固定参数代入 mx+b，而 x 仍表示输入。',
            'Substitute fixed parameters into mx+b, retaining x as input.',
          ],
          [
            '得到 2x+3，不是某次输入对应的五或七。',
            'The rule is 2x+3, not five or seven from a single input.',
          ],
        ],
        ['5', '2x', '3x+2'],
        'expression',
        ['3+2*x'],
      ),
      I(
        [
          '给定 y=2x+3，输入 x=4，输出 y 是多少？只写数值。',
          'For y=2x+3 at x=4, find the output y. Enter the number only.',
        ],
        '11',
        [
          [
            '先算二乘四等八，再加三等十一。',
            'Multiply two by four, then add three, giving eleven.',
          ],
          [
            '这里问一次输出，故应填数值，不是整条规则。',
            'This task asks for one output, so enter a number rather than the whole rule.',
          ],
        ],
        ['14', '8', '7'],
      ),
      I(
        [
          'y=−x/2+4 中参数 m 是多少？只写精确数值。',
          'What is m in y=-x/2+4? Enter its exact number.',
        ],
        '-1/2',
        [['−x/2=(−1/2)x，故系数 m 为 −1/2。', '-x/2=(-1/2)x, so m=-1/2.']],
        ['-2', '1/2', '4'],
        'number',
        ['-0.5'],
      ),
      I(
        ['y=3x−4 中参数 b 是多少？', 'What is b in y=3x-4?'],
        '-4',
        [
          [
            '固定项包含自己的负号，所以 b=−4。',
            'The constant includes its sign, so b=-4.',
          ],
        ],
        ['4', '3', '0'],
      ),
      I(
        [
          '按本单元一次函数要求 m≠0 的约定，y=4 属哪一类？',
          'Under this unit’s first-degree convention m≠0, classify y=4.',
        ],
        'constant',
        [
          [
            'm=0、b=4，输出不随输入变化，是常函数。',
            'm=0,b=4 gives an unchanged output, a constant function.',
          ],
          [
            '它仍是函数，但不属于本课一次或正比例。',
            'It is still a function, but not first-degree or direct under this convention.',
          ],
        ],
        ['direct', 'affine', 'vertical'],
        'constant',
        ['常函数'],
      ),
      I(
        [
          '给定每增加一个 x，y 减少一，且 x=0 时 y=5。已知模型为 mx+b，写 y 右侧一般式。',
          'A supplied mx+b model decreases y by one for each unit of x and has y=5 at x=0. Write its right-side expression.',
        ],
        '-x+5',
        [
          [
            '每单位变化负一给 m=−1，零输入的五给 b=5。',
            'The per-unit change gives m=-1, and the zero-input value gives b=5.',
          ],
          ['两条件一起写成 −x+5。', 'Combine both conditions as -x+5.'],
        ],
        ['x+5', '-5x+1', '4'],
        'expression',
        ['5-x'],
      ),
    ],
    pick: {
      stem: [
        '给定一条 y=2x+3 关系，哪项只是在同一条线上换输入？',
        'For the fixed rule y=2x+3, which action moves along the same line?',
      ],
      options: [
        ['保持 m/b，只把 x 从一改二', 'Keep m/b and change x from one to two'],
        ['把 m 从二改三', 'Change m from two to three'],
        ['把 b 从三改四', 'Change b from three to four'],
      ],
      feedback: [
        [
          '固定规则的不同输入给不同点，关系未改变。',
          'Different inputs give different points under the unchanged rule.',
        ],
        [
          '改变变化率，整条关系改变。',
          'Changing the rate changes the whole relationship.',
        ],
        [
          '改变零输入值，整条关系改变。',
          'Changing the zero-input value changes the whole relationship.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释 y=2x+3 中参数、一次输出与一般式的区别，并说明 m=0 的特例。',
      'Explain parameters, a single output and the general rule in y=2x+3, including the m=0 exception.',
    ],
    rubric: [
      'm=2 是每单位变化，b=3 是零输入值，x 是可变输入，y 为对应输出；x=4 得十一，但十一不是一般关系。改变 x 在同一关系上移动，改 m/b 改关系。按本课一次函数 m≠0 的约定，m=0 是常函数，仍为函数但不归本课一次或正比例。家长核具体代入与分类依据。',
      'm=2 is per-unit change and b=3 the zero-input value; x varies and y is its corresponding output. At x=4 the output is eleven, not a general rule. Changing x moves within one relationship; changing m/b changes it. With this unit’s m≠0 convention, m=0 is constant, still a function but not first-degree or direct. Review concrete substitutions and reasons.',
    ],
    misconception: [
      '交换 m/b、遗漏常数负号、把一次输出当一般式、常函数当非函数。',
      'Swapping m/b, losing a constant’s sign, replacing a rule with one output or calling a constant not a function.',
    ],
    prompts: [
      [
        '哪个量固定，哪个量可变？',
        'Which quantities are fixed and which vary?',
      ],
      [
        '换另一个 x，刚才的答案还表示整条规则吗？',
        'With another x, does that answer still express the whole rule?',
      ],
    ],
  },
  {
    title: ['斜率代表变化速度', 'Slope as rate of change'],
    objective: [
      '按一致顺序计算 Δy/Δx，解释符号、单位及显示比例不变性。',
      'Compute Δy/Δx consistently and explain its sign, units and independence from display scales.',
    ],
    prerequisites: ['J85-L01', 'P68-L01', 'J71-L05'],
    keywords: [
      ['斜率', 'slope'],
      ['变化量', 'change'],
      ['每单位', 'per unit'],
    ],
    lab: 'function-slope',
    hook: [
      '从 (1,3) 到 (4,9)，纵向增加六，但每个横向单位增加多少？',
      'From (1,3) to (4,9), y rises by six. How much is that per x unit?',
    ],
    items: [
      {
        ...I(
          [
            '已知直线过 P(1,3)、Q(4,9)，求精确斜率 m。',
            'A line passes through P(1,3),Q(4,9). Find its exact slope m.',
          ],
          '2',
          [
            ['Δx=4−1=3，Δy=9−3=6。', 'Δx=4-1=3 and Δy=9-3=6.'],
            [
              'm=6/3=2，是每一个 x 单位对应的 y 变化，不是总变化六。',
              'm=6/3=2 is y change per x unit, not the total change six.',
            ],
          ],
          ['6', '1/2', '3'],
        ),
        diagram: plot('2', '1', [
          { x: 1, y: 3, label: 'P' },
          { x: 4, y: 9, label: 'Q' },
        ]),
      },
      I(
        [
          '直线过 (−2,5)、(2,−3)，求 m。',
          'A line passes through (-2,5),(2,-3). Find m.',
        ],
        '-2',
        [
          ['Δy=−3−5=−8，Δx=2−(−2)=4。', 'Δy=-3-5=-8 and Δx=2-(-2)=4.'],
          [
            'm=−8/4=−2，向右时 y 减少。',
            'm=-8/4=-2, so y decreases as x increases.',
          ],
        ],
        ['2', '-8', '-1/2'],
      ),
      I(
        [
          '直线过 (−1,0)、(2,2)，求精确 m。',
          'A line passes through (-1,0),(2,2). Find exact m.',
        ],
        '2/3',
        [
          ['Δy=2，Δx=3，所以 m=2/3。', 'Δy=2 and Δx=3, so m=2/3.'],
          [
            '0.67 只是近似，不能当精确斜率。',
            '0.67 is an approximation rather than the exact slope.',
          ],
        ],
        ['3/2', '0.67', '2'],
      ),
      I(
        [
          '把点序改成 P(2,−3)、Q(−2,5)，求 m。',
          'Reverse the order to P(2,-3),Q(-2,5). Find m.',
        ],
        '-2',
        [
          ['Δy=5−(−3)=8，Δx=−2−2=−4。', 'Δy=5-(-3)=8 and Δx=-2-2=-4.'],
          [
            '分子分母同时改号，8/(−4) 仍为 −2。',
            'Both differences reverse sign, leaving 8/(-4)=-2.',
          ],
        ],
        ['2', '8', '-4'],
      ),
      I(
        [
          '水平线过 (−2,3)、(3,3)，求 m。',
          'A horizontal line passes through (-2,3),(3,3). Find m.',
        ],
        '0',
        [
          ['Δy=0，Δx=5，斜率零。', 'Δy=0 and Δx=5, so slope is zero.'],
          [
            '零是有定义的斜率，不同于竖直线的零分母。',
            'Zero is a defined slope, unlike the zero denominator for a vertical line.',
          ],
        ],
        ['5', '3', '1'],
      ),
      I(
        [
          '给定线性模型中，x 增加 4 h 时 y 改变 −6°C，求每小时变化率，只写数值，单位另述。',
          'In a supplied linear model, x increases 4 h while y changes -6°C. Find the per-hour rate as a number; explain units separately.',
        ],
        '-3/2',
        [
          ['变化率为 −6/4=−3/2，单位 °C/h。', 'The rate is -6/4=-3/2 in °C/h.'],
          [
            '负号表示下降，一小时下降一点五摄氏度。',
            'The negative sign means a fall of one and a half degrees per hour.',
          ],
        ],
        ['3/2', '-6', '-2/3'],
        'number',
        ['-1.5'],
      ),
    ],
    pick: {
      stem: [
        '只把纵轴显示范围拉宽，原坐标不变，斜率会怎样？',
        'If only the vertical display range changes and coordinates stay fixed, what happens to slope?',
      ],
      options: [
        [
          '像素变平，斜率必变小',
          'A flatter screen angle always means smaller slope',
        ],
        [
          '斜率不变，仍由单位变化比决定',
          'Slope stays fixed, determined by the ratio of changes in units',
        ],
        ['必变成零', 'It becomes zero'],
      ],
      feedback: [
        [
          '显示比例改变像素角度，不改变数值变化比。',
          'Display scaling changes the pixel angle rather than numerical changes.',
        ],
        [
          '需分别读取两轴刻度，不按屏幕倾斜程度猜。',
          'Read each axis scale separately instead of guessing by appearance.',
        ],
        [
          '只有 y 的变化量为零且 Δx 非零才是零斜率。',
          'Slope is zero when Δy=0 with nonzero Δx, not merely from rescaling.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释交换两点顺序为何不改斜率，以及为何不能只交换分母次序或按像素角度判断。',
      'Explain why reversing both points preserves slope, but reversing only the denominator or judging pixel angles fails.',
    ],
    rubric: [
      'Δy 与 Δx 使用同一有向点序；交换两点时两者同时改号，比值不变。若只改分母，会把 m 错改成 −m。像素横纵单位长度可不同，变化率必须按坐标单位算。例如 (1,3) 到 (4,9) 为六除三等二，反向为负六除负三仍二；m 的单位为 y 单位/x 单位。',
      'Use the same oriented point order in Δy and Δx. Reversing both negates both differences, preserving the quotient; changing only the denominator falsely negates m. Pixels may use different scales. From (1,3) to (4,9), slope is 6/3=2; reversing gives -6/-3=2. Units are y units per x unit.',
    ],
    misconception: [
      '用 Δx/Δy、把总变化当速度、只改一个差的次序、像素倾角当数值。',
      'Using Δx/Δy, treating total change as rate, reversing only one difference or treating screen angle as numerical slope.',
    ],
    prompts: [
      [
        '这六个单位经过了几个横向单位？',
        'Across how many x units did those six y units occur?',
      ],
      ['两轴每格单位相同吗？', 'Do the axes use the same units per interval?'],
    ],
  },
  {
    title: ['截距代表初值', 'Intercept as starting value'],
    objective: [
      '用 x=0 求 y 截距点，并区分模型初值、观测起点与 x 轴交点。',
      'Find the y intercept at x=0 and distinguish model initial value, observation start and x-axis crossing.',
    ],
    prerequisites: ['J85-L01', 'J75-L01', 'J73-L01'],
    keywords: [
      ['y 截距', 'y intercept'],
      ['零输入', 'zero input'],
      ['初值', 'initial value'],
    ],
    lab: 'function-intercept',
    hook: [
      'y=−x+3 的 x 轴交点与 y 轴交点，都能写成 (3,0) 吗？',
      'Can both axis crossings of y=-x+3 be written (3,0)?',
    ],
    items: [
      {
        ...I(
          [
            '给定 y=−x+3，求 y 轴截距点，写 (x,y)。',
            'For y=-x+3, give the y-intercept point (x,y).',
          ],
          '(0,3)',
          [
            ['y 轴上 x=0，所以 y=3。', 'On the y axis x=0, so y=3.'],
            [
              'b 是三，点是 (0,3)，不是 x 轴上的 (3,0)。',
              'b is three; the point is (0,3), not the x-axis point (3,0).',
            ],
          ],
          ['(3,0)', '(0,-3)', '3'],
          'coordinate',
        ),
        diagram: plot('-1', '3'),
      },
      I(
        [
          'y=3x−4 的截距数值 b 是多少？只写数值。',
          'What is the intercept value b of y=3x-4? Enter only the number.',
        ],
        '-4',
        [
          ['把 x=0 代入，得到 y=−4。', 'Substituting x=0 gives y=-4.'],
          [
            '数值 b 与截距点 (0,−4) 的格式不同。',
            'The value b differs in format from the intercept point (0,-4).',
          ],
        ],
        ['4', '3', '0'],
      ),
      I(
        [
          'y=x/2+5 的 y 截距点是多少？',
          'What is the y-intercept point of y=x/2+5?',
        ],
        '(0,5)',
        [
          [
            '零乘任意系数仍为零，留下固定项五。',
            'Zero times the slope is zero, leaving five.',
          ],
        ],
        ['(5,0)', '(0,1/2)', '5'],
        'coordinate',
      ),
      I(
        [
          'y=2x−6 的 y 截距点是多少？不要写 x 轴交点。',
          'Find the y-intercept point of y=2x-6, not the x-axis crossing.',
        ],
        '(0,-6)',
        [
          [
            '令 x=0 得 y=−6；令 y=0 得 x=3 是另一个问题。',
            'Setting x=0 gives y=-6; setting y=0 gives x=3, a different crossing.',
          ],
        ],
        ['(3,0)', '(-6,0)', '(0,6)'],
        'coordinate',
      ),
      I(
        [
          '给定代数关系 y=2x+3；实际只观测 2≤x≤6。问其代数直线的 y 截距点，不把它声称为观测记录。',
          'The supplied algebraic rule is y=2x+3, but observations cover only 2≤x≤6. Give the algebraic line’s y intercept, without claiming it was observed.',
        ],
        '(0,3)',
        [
          [
            '代数延长线令 x=0 得三，故点 (0,3)。',
            'The algebraic extension gives three at x=0, hence (0,3).',
          ],
          [
            '零不在观测区间，这不是已经观测到的起点值。',
            'Zero lies outside observations, so this is not an observed starting value.',
          ],
        ],
        ['(2,7)', '(3,0)', '7'],
        'coordinate',
      ),
      I(
        [
          'y=−3x+8 的 y 截距点是多少？即使初始图窗没显示八，也按公式回答。',
          'What is the y intercept of y=-3x+8? Use the rule even if eight lies outside the initial window.',
        ],
        '(0,8)',
        [
          [
            '零输入给八，视窗不改变参数或真实坐标。',
            'Zero input gives eight; the window does not change parameters or coordinates.',
          ],
        ],
        ['(8,0)', '(0,-3)', '(0,5)'],
        'coordinate',
      ),
    ],
    pick: {
      stem: [
        '什么时候能把 b 称为实际情境的初始量？',
        'When can b represent a contextual starting amount?',
      ],
      options: [
        ['任何图窗左端都等于 b', 'The left screen edge always equals b'],
        [
          '观测的第一行无论 x 为多少都是 b',
          'The first observed row is b regardless of x',
        ],
        [
          '输入零确实表示所定义起点且模型适用',
          'Input zero represents the defined start and the model applies',
        ],
      ],
      feedback: [
        ['图窗边界可以不是 x=0。', 'A window may start away from x=0.'],
        [
          '第一条记录可能从 x=2 开始，不是零输入。',
          'The first observation may begin at x=2 instead of zero.',
        ],
        [
          'b 是零输入输出，现实初始意义还需变量定义与域。',
          'b is the zero-input output; contextual meaning depends on definitions and domain.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '解释 y=2x−6 中 b、y 截距点与 x 轴交点，并说明域不含零时的限制。',
      'Explain b, the y intercept and the x-axis crossing for y=2x-6, including a domain excluding zero.',
    ],
    rubric: [
      'b=−6，是 y 数值；y 轴上 x=0，所以截距点 (0,−6)。x 轴上 y=0，所以 2x−6=0 得 (3,0)，两点不同。如果只允许 x≥2，零输入不在情境域；(0,−6) 可属于代数延长线，却不能声称实际出现负数量或记录了初值。家长核坐标顺序与模型范围。',
      'b=-6 is a y value. At x=0 the y intercept is (0,-6). At y=0, 2x-6=0 gives the x-axis crossing (3,0). If only x≥2 is allowed, the zero input lies outside the contextual domain; the algebraic extension does not establish an observed initial value or real negative quantity. Check coordinate order and model scope.',
    ],
    misconception: [
      '把 (0,b) 写成 (b,0)、固定项漏负号、把图窗左端或第一条记录当零输入。',
      'Swapping (0,b) with (b,0), losing the constant sign or equating a screen edge/first observation with zero input.',
    ],
    prompts: [
      [
        'y 轴上哪个坐标必须为零？',
        'Which coordinate must be zero on the y axis?',
      ],
      [
        '这个起点在题目允许域内吗？',
        'Is that starting input inside the stated domain?',
      ],
    ],
  },
  {
    title: ['由两点求直线', 'Finding a line from two points'],
    objective: [
      '在两横坐标不同的条件下求 m/b 并回代，同时辨别竖直与重复点。',
      'Find m/b from distinct x coordinates and verify both points, distinguishing vertical and duplicate cases.',
    ],
    prerequisites: ['J85-L02', 'J85-L03', 'J83-L02'],
    keywords: [
      ['两点', 'two points'],
      ['回代', 'substitution check'],
      ['唯一性', 'uniqueness'],
    ],
    lab: 'function-points',
    hook: [
      '两点都叫 (2,1)，与 (2,1)、(2,4) 有何不同？',
      'How do two copies of (2,1) differ from the pair (2,1),(2,4)?',
    ],
    items: [
      I(
        [
          '已知关系为 mx+b，过 (2,5)、(5,11)，写 y 右侧一般式。',
          'A supplied mx+b relationship passes through (2,5),(5,11). Write its right-side expression.',
        ],
        '2x+1',
        [
          [
            'm=(11−5)/(5−2)=2，再用 5=2×2+b 得 b=1。',
            'm=(11-5)/(5-2)=2; then 5=2×2+b gives b=1.',
          ],
          [
            '两点分别给五与十一，都通过。',
            'The two inputs give five and eleven, checking both.',
          ],
        ],
        ['2x', 'x+3', '6x+1'],
        'expression',
        ['1+2*x'],
      ),
      I(
        [
          '已知关系为 mx+b，过 (1,1)、(3,2)，写精确一般式。',
          'A supplied mx+b relationship passes through (1,1),(3,2). Write its exact expression.',
        ],
        'x/2+1/2',
        [
          [
            'm=(2−1)/(3−1)=1/2，b=1−1/2=1/2。',
            'm=(2-1)/(3-1)=1/2 and b=1-1/2=1/2.',
          ],
          [
            '可写 (x+1)/2，两个点都须成立。',
            'The equivalent (x+1)/2 must pass both points.',
          ],
        ],
        ['2x-1', 'x/2', '0.5x+0.33'],
        'expression',
        ['(x+1)/2'],
      ),
      I(
        [
          '关系为 mx+b，过 (−2,3)、(3,3)。写一般式，常函数允许作为特例。',
          'An mx+b relationship passes through (-2,3),(3,3). Write its expression, allowing the constant exception.',
        ],
        '3',
        [
          [
            '不同 x 的 y 都为三，m=0，b=3。',
            'Distinct x coordinates have equal y, so m=0,b=3.',
          ],
          [
            'y 恒为三，写右侧三，不误称无法定线。',
            'The expression is constant three, rather than underdetermined.',
          ],
        ],
        ['3x', '0', 'x+3'],
        'expression',
        ['0x+3'],
      ),
      I(
        [
          '点 (2,1)、(2,4) 能否由一个 y=mx+b 同时通过？按特殊情形写“竖直线”或 vertical line。',
          'Can (2,1),(2,4) both lie on one y=mx+b? Name the exceptional case as vertical line.',
        ],
        'vertical',
        [
          [
            'Δx=0、Δy=3，斜率不能除零。',
            'Δx=0 and Δy=3, so the slope quotient is undefined.',
          ],
          [
            '同一 x=2 对应不同输出，是竖直线，不是 y 关于 x 的函数。',
            'The same x=2 has different outputs: a vertical line, not y as a function of x.',
          ],
        ],
        ['constant', 'undetermined', '0'],
        'vertical',
        ['竖直线'],
      ),
      I(
        [
          '把同一点 (2,1) 给两次，是否唯一确定 mx+b？写 undetermined 或无法唯一确定。',
          'If (2,1) is supplied twice, is mx+b uniquely fixed? Enter undetermined.',
        ],
        'undetermined',
        [
          [
            '只留下 1=2m+b 一条独立关系，可有不同 m/b。',
            'Only one independent relation 1=2m+b remains, allowing multiple m/b choices.',
          ],
          [
            '例如 y=x−1 与 y=1 都通过；不是无解或竖直线。',
            'For example y=x-1 and y=1 both pass; this is not inconsistency or a required vertical line.',
          ],
        ],
        ['vertical', 'constant', 'no solution'],
        'undetermined',
        ['无法唯一确定'],
      ),
      I(
        [
          '已知关系为 mx+b，过 (−1,5)、(2,2)，写一般式。',
          'A supplied mx+b relationship passes through (-1,5),(2,2). Write its expression.',
        ],
        '-x+4',
        [
          [
            'm=(2−5)/(2−(−1))=−1，再用 2=−2+b 得四。',
            'm=(2-5)/(2-(-1))=-1; then 2=-2+b gives four.',
          ],
          ['−(−1)+4=5 与 −2+4=2 都通过。', 'Both -(-1)+4=5 and -2+4=2 pass.'],
        ],
        ['x+4', '-x+2', '-3x+4'],
        'expression',
        ['4-x'],
      ),
    ],
    pick: {
      stem: [
        '使用 m=(y₂−y₁)/(x₂−x₁) 前必须先查什么？',
        'What must be checked before m=(y₂-y₁)/(x₂-x₁)?',
      ],
      options: [
        ['x₂≠x₁', 'x₂≠x₁'],
        ['两点必须在第一象限', 'Both points must be in the first quadrant'],
        ['两个 y 必须不同', 'The y coordinates must differ'],
      ],
      feedback: [
        [
          '分母不能为零；相同 x 还需分不同 y 与重复点。',
          'The denominator must be nonzero; equal x needs vertical/duplicate cases.',
        ],
        [
          '负数或零坐标也能定线，关键是不同 x。',
          'Negative or zero coordinates can define a rule when x differs.',
        ],
        [
          '相同 y 与不同 x 定水平常函数，合法。',
          'Equal y with distinct x defines a valid horizontal constant.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '分别说明不同 x、相同 x 不同 y、重复同一点对 y=mx+b 的含义，给重复点两个不同的可行规则。',
      'Explain distinct x, equal x with different y, and duplicate points for y=mx+b. Give two different rules through a duplicate point.',
    ],
    rubric: [
      '不同 x 可求唯一 m/b（也可能 m=0 常函数），再核两点。相同 x 不同 y 是竖直线，一个输入有不同输出，不能表示成该函数。重复同点只给一个独立条件，不唯一而非无解；(2,1) 可由 x−1 与常数一通过。把两点拟合成线还需题目已给线性模型假设，不能从两个观测证明所有真实关系都线性。',
      'Distinct x gives unique m/b, including possible zero-slope constants, checked in both points. Equal x with different y is vertical and cannot be y as a function of x. Duplicates give one condition, so many rules remain rather than none; x-1 and one both pass (2,1). Fitting presumes a supplied linear model; two observations alone do not prove a real relationship globally linear.',
    ],
    misconception: [
      '除零当零斜率、重复点当矛盾、只回代一个点、两点数据推出全局线性。',
      'Calling zero division zero slope, treating duplicates as contradictory, checking only one point or claiming global linearity from two observations.',
    ],
    prompts: [
      ['两个横坐标真的不同吗？', 'Are the x coordinates distinct?'],
      [
        '这是已知线性模型，还是仅有两个观测？',
        'Is a linear model given, or are these merely two observations?',
      ],
    ],
  },
  {
    title: ['正比例与一次函数对比', 'Direct proportion vs linear functions'],
    objective: [
      '按 m≠0 的约定区分正比例、非正比例一次、常函数与非线性反例。',
      'Distinguish direct, non-direct first-degree, constant and nonlinear rules under the m≠0 convention.',
    ],
    prerequisites: ['J85-L01', 'J85-L02', 'P63-L05'],
    keywords: [
      ['正比例', 'direct proportion'],
      ['固定比', 'constant ratio'],
      ['反例', 'counterexample'],
    ],
    lab: 'function-compare',
    hook: [
      'y=x² 过原点，为什么仍不能叫 y 与 x 成正比例？',
      'Why is y=x² not direct proportion even though its graph crosses the origin?',
    ],
    items: [
      I(
        [
          '按本单元约定分类 y=2x。',
          'Classify y=2x under this unit’s convention.',
        ],
        'direct',
        [
          [
            '非零 m=2、b=0，是正比例，也是一次函数的特例。',
            'Nonzero m=2,b=0 gives direct proportion, a first-degree special case.',
          ],
          [
            'x≠0 时 y/x 恒为二；零输入时不计算零除零。',
            'For x≠0, y/x is always two; do not compute 0/0 at zero.',
          ],
        ],
        ['affine', 'constant', 'nonlinear'],
        'direct',
        ['正比例'],
      ),
      I(
        [
          '分类 y=2x+3，须区分是否正比例。',
          'Classify y=2x+3, distinguishing direct proportion.',
        ],
        'linear but not direct',
        [
          [
            'm=2 非零，一次；b=3 非零，所以不是正比例。',
            'Nonzero m=2 makes it first-degree; b=3 prevents direct proportion.',
          ],
          [
            '每单位增量固定，但比值 y/x 并不固定。',
            'The per-unit increment is constant, but y/x is not.',
          ],
        ],
        ['direct', 'constant', 'nonlinear'],
        'affine',
        ['一次但非正比例'],
      ),
      I(
        [
          '按本单元一次函数 m≠0 约定分类 y=4。',
          'Classify y=4 using the first-degree m≠0 convention.',
        ],
        'constant',
        [
          [
            'm=0，为水平常函数，仍有每个输入唯一输出。',
            'm=0 gives a horizontal constant function, with one output per input.',
          ],
        ],
        ['direct', 'affine', 'vertical'],
        'constant',
        ['常函数'],
      ),
      I(
        [
          '给定完整公式 y=x²，分类为本课一次关系还是非线性函数？',
          'Given the complete rule y=x², classify it as first-degree or nonlinear.',
        ],
        'nonlinear',
        [
          [
            'x 的次数为二，不是 mx+b 形式。',
            'The power of x is two, outside mx+b.',
          ],
          [
            '过原点只是必要特征之一，不足以证明正比例；x=1 与二的比值分别一、二。',
            'Origin crossing is insufficient: ratios at x=1 and two are one and two.',
          ],
        ],
        ['direct', 'affine', 'constant'],
        'nonlinear',
        ['非线性函数'],
      ),
      I(
        [
          '按本单元 m≠0 约定，y=0 属哪类？',
          'Under this unit’s m≠0 convention, classify y=0.',
        ],
        'constant',
        [
          [
            'm=0、b=0，仍是常函数，不归本课正比例。',
            'm=0,b=0 is still a constant function, excluded from direct proportion here.',
          ],
          [
            '必须同时满足 m≠0，不能只看过原点。',
            'The nonzero m condition matters in addition to origin crossing.',
          ],
        ],
        ['direct', 'affine', 'vertical'],
        'constant',
        ['常函数'],
      ),
      I(
        [
          '按本单元约定分类 y=−x/2。',
          'Classify y=-x/2 under this unit’s convention.',
        ],
        'direct',
        [
          [
            'm=−1/2 非零、b=0，正比例可有负比例系数。',
            'm=-1/2 is nonzero and b=0; direct proportion can have a negative coefficient.',
          ],
          [
            '下降不代表非正比例；看形式与固定比，不看“正”字猜正数。',
            'Decreasing does not disqualify it; use the form and ratio rather than interpreting “direct” as positive.',
          ],
        ],
        ['affine', 'nonlinear', 'constant'],
        'direct',
        ['正比例'],
      ),
    ],
    pick: {
      stem: [
        '哪一项足以在本单元约定下判定正比例？',
        'Which condition establishes direct proportion under this unit’s convention?',
      ],
      options: [
        ['图像经过原点', 'The graph passes through the origin'],
        ['y 随 x 增大而增大', 'y increases with x'],
        ['已知 y=mx，且 m≠0', 'The supplied rule is y=mx with m≠0'],
      ],
      feedback: [
        [
          'x² 也过原点，但比值变化。',
          'x² also crosses the origin but has changing ratios.',
        ],
        [
          '例如 x² 或 2x+3 也可递增，却不正比例。',
          'x² or 2x+3 may increase without direct proportion.',
        ],
        [
          '明确完整形式和非零系数，非零输入的比值固定。',
          'The whole form and nonzero coefficient guarantee a fixed ratio for nonzero inputs.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较 2x、2x+3、4、x² 与零函数，说明固定变化率、固定比值与过原点不是同一件事。',
      'Compare 2x,2x+3,4,x² and the zero function, separating constant rate, constant ratio and origin crossing.',
    ],
    rubric: [
      '2x 非零斜率且零截距，为正比例；2x+3 有固定变化率二但 y/x 不恒定，一次但非正比例；四是常函数，斜率零；x² 过原点却非一次，非零输入比值为 x；零函数按本课非零系数约定归常函数。比值在 x=0 未定义，不能用 0/0 核正比例；完整关系形式而非有限样本保证分类。',
      '2x is direct with nonzero slope and zero intercept. 2x+3 has constant rate two but changing y/x, so is first-degree but not direct. Four is constant with slope zero. x² crosses the origin but is nonlinear, with ratio x at nonzero inputs. The zero function is constant under the stated nonzero-coefficient convention. y/x is undefined at zero; use the full supplied rule rather than finite samples as proof.',
    ],
    misconception: [
      '过原点必正比例、递增必正比例、固定增量当固定比、零函数忽略非零约定。',
      'Origin crossing or increase mistaken for direct proportion, constant increments confused with ratios, or ignoring the zero-coefficient convention.',
    ],
    prompts: [
      [
        '两个非零输入的 y/x 分别是多少？',
        'What are y/x for two nonzero inputs?',
      ],
      [
        '完整公式确实是 mx 吗？',
        'Is the complete supplied formula actually mx?',
      ],
    ],
  },
  {
    title: ['生活中的线性模型', 'Linear models in real contexts'],
    objective: [
      '按单位建立线性模型并同时核对代数关系、输入范围和连续/计数域。',
      'Build a unit-aware linear model and audit its equation, input range and continuous/count domain.',
    ],
    prerequisites: ['J85-L04', 'J85-L05', 'J84-L05'],
    keywords: [
      ['单位变化率', 'unit rate'],
      ['模型范围', 'model domain'],
      ['离散与连续', 'discrete and continuous'],
    ],
    lab: 'function-context',
    hook: [
      '十二升水每分钟少两升，七分钟时公式算出负二升，能当作真实剩水吗？',
      'A 12-litre tank loses two litres per minute. Can the formula’s minus two litres at seven minutes represent remaining water?',
    ],
    items: [
      I(
        [
          '虚构已启动接送服务：x km（0≤x≤8），启动费 NZ$5、每 km 加 NZ$2，y 为 NZD 费用。写 y 右侧一般式。',
          'Fictional started transport service: x km with 0≤x≤8, an NZ$5 starting fee plus NZ$2 per km; y is cost in NZD. Write its right-side expression.',
        ],
        '2x+5',
        [
          [
            '固定费用五给 b，按公里二元给 m。',
            'The fixed five gives b; two dollars per kilometre gives m.',
          ],
          [
            '2x 与五单位都是 NZD，再相加；只在题设域内使用。',
            'Both 2x and five have units NZD; add them within the stated domain.',
          ],
        ],
        ['5x+2', '2x', '7'],
        'expression',
        ['5+2*x'],
      ),
      I(
        [
          '同一虚构服务 y=2x+5，行程三公里时费用多少 NZD？只写数值。',
          'For the fictional service y=2x+5, find the cost in NZD at three kilometres. Enter the number only.',
        ],
        '11',
        [
          [
            '二乘三加五等十一；三个输入公里在域内。',
            'Two times three plus five is eleven; three kilometres lies in the domain.',
          ],
        ],
        ['6', '7', '17'],
      ),
      I(
        [
          '虚构恒速排水初有 12 L，每分钟少 2 L，0≤x≤6。两分钟后余水多少 L？只写数值。',
          'Fictional constant draining starts with 12 L and loses 2 L per minute for 0≤x≤6. How many litres remain after two minutes? Enter the number only.',
        ],
        '8',
        [
          [
            'y=12−2x，代二得八升，时间在原域内。',
            'y=12-2x gives eight litres at two minutes, within the stated domain.',
          ],
        ],
        ['10', '16', '-8'],
      ),
      I(
        [
          '同一恒速排水模型到排空为止，x 最大可取多少分钟？',
          'For the same draining model ending at emptying, what is the largest allowed x in minutes?',
        ],
        '6',
        [
          [
            '12−2x=0 得 x=6，超过后不能继续解释为负水量。',
            '12-2x=0 gives x=6; beyond it, negative water is not allowed.',
          ],
        ],
        ['12', '2', '7'],
      ),
      I(
        [
          '虚构卡片已有两张，每包三张，最多打开四整包。打开四包后总张数多少？',
          'Fictional cards: two initially, three per pack, at most four whole packs. How many cards after opening four packs?',
        ],
        '14',
        [
          [
            'y=3x+2，在允许整数 x=4 得十四张。',
            'y=3x+2 at allowed integer x=4 gives fourteen cards.',
          ],
          [
            '半包不在题设域，不用连续连线暗示所有实数输入都允许。',
            'Fractional packs lie outside this domain; a continuous line would imply extra inputs.',
          ],
        ],
        ['12', '20', '6'],
      ),
      I(
        [
          '给定虚构线性服务模型，x 小时在 0≤x≤6，x=1 时收费 NZ$7，x=3 时 NZ$13。写一般费用式，不写 y=；不保证六小时外。',
          'A supplied fictional linear service model applies for x hours in 0≤x≤6. At one hour the cost is NZ$7, and at three hours NZ$13. Write its cost expression without y=; no extrapolation beyond six hours is promised.',
        ],
        '3x+4',
        [
          [
            'm=(13−7)/(3−1)=3 NZD/h，b=7−3=4 NZD。',
            'm=(13-7)/(3-1)=3 NZD/h and b=7-3=4 NZD.',
          ],
          [
            '三 x 加四，回代一与三均符合；线性是假设且范围有限。',
            '3x+4 passes both observations; linearity is supplied and the range is bounded.',
          ],
        ],
        ['6x+1', '4x+3', '3x'],
        'expression',
        ['4+3*x'],
      ),
    ],
    pick: {
      stem: [
        '排水公式 y=12−2x 在 x=7 算出 −2，正确解释是？',
        'The draining rule y=12-2x gives -2 at x=7. What follows?',
      ],
      options: [
        ['水量可以负，所以接受', 'Accept negative water'],
        [
          '代数可算但超出到排空的原域；后续须另建 y=0 模型',
          'The algebra evaluates outside the emptying domain; later behaviour needs a separate y=0 rule',
        ],
        [
          '把 −2 改成正二继续用同一公式',
          'Change -2 to positive two under the same formula',
        ],
      ],
      feedback: [
        [
          '剩水量不能按该情境解释为负。',
          'Remaining water is not negative in this context.',
        ],
        [
          '原直线只适用零至六分钟，后续水平段不是原斜率继续。',
          'The original line applies through six minutes; a later horizontal segment changes the rate.',
        ],
        [
          '取绝对值会改变模型，不能修复原适用范围。',
          'Taking an absolute value changes the model rather than repairing its domain.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较接送固定费、排空停止与整包卡片：分别解释 m/b 单位、允许域及为何“公式可算”不够。',
      'Compare transport fees, draining until empty and whole card packs: explain m/b units, allowed domains and why evaluability is insufficient.',
    ],
    rubric: [
      '接送 m=2 NZD/km、b=5 NZD，输入公里限定零至八且服务已启动；排水 m=−2 L/min、b=12 L，原式只到六分钟，七分钟负二是域外代数输出，不是允许余水；排空后另用零。卡片 m=3 cards/pack、b=2 cards，输入仅零至四整数，半包即便代数给三点五张也不允许，图只画离散点。现实模型有明确假设，有限数据不证明无限外推；家长核单位、边界和原条件。',
      'Transport uses m=2 NZD/km and b=5 NZD with started-service inputs zero to eight km. Draining uses -2 L/min and 12 L only through six minutes; the algebraic output -2 at seven is outside the original domain, with a separate zero rule after emptying. Cards use 3 cards/pack and 2 cards with integer inputs zero to four; half a pack is not allowed even if algebra gives 3.5 cards. Plot discrete points. Models require assumptions and bounded use; finite data does not justify unlimited extrapolation.',
    ],
    misconception: [
      '固定费也乘 x、单位混合、连续图冒充计数、域外负量取绝对值或无限外推。',
      'Multiplying the fixed fee by x, mixing units, connecting count inputs, taking absolute values of impossible amounts or unlimited extrapolation.',
    ],
    prompts: [
      [
        'm 的单位为什么是输出单位除以输入单位？',
        'Why are slope units output units per input unit?',
      ],
      [
        '原条件真的允许这个 x 吗？',
        'Do the original conditions actually allow this x?',
      ],
    ],
  },
];
export const j85Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J85-L0${i + 1}`;
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
    unit: 'J85',
    order: i + 1,
    nzYearHints: [8, 9, 10],
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
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上设计虚构社区材料模型：一个含固定费的连续升数费用、一个整包卡片数量。定义输入/输出及单位、每单位变化和零输入值，说明允许范围。列三行并画图，用两点回求 m/b 后核第三点；交换两点、改变轴刻度，解释斜率为何不变。另设计排空停止的模型，指出原直线何时结束。只用纸笔，无需购买、实测或个人资料；给定假设不当现实数据。',
            'On paper, design fictional continuous-litre costs with a fixed fee and a whole-pack card model. Define units, rate, zero-input value and domains. Table three inputs, graph, recover m/b from two points and check the third. Reverse point order and rescale axes while explaining the unchanged slope. Add draining with an emptying stop. Paper is sufficient; no purchases, measurements or personal data. Treat assumptions as fictional rather than observed data.',
          ),
        }
      : {}),
  };
});
export function j85ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J85-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J85 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    n = (k % 9) - 4,
    d = [1, 2, 3][k % 3]!,
    b = (k % 7) - 3,
    m = `${n}/${d}`,
    source = `(${m})x+(${b})`;
  let item: Item;
  if (i === 0)
    item = I(
      [
        `给定 m=${m}、b=${b}，写 y 右侧一般式，允许常函数特例。`,
        `Given m=${m},b=${b}, write the right-side expression, allowing constant exceptions.`,
      ],
      source,
      [
        [
          '固定参数代入，x 留作所有允许输入。',
          'Substitute parameters while retaining x for all permitted inputs.',
        ],
      ],
      ['x+100'],
      'expression',
    );
  else if (i === 1) {
    const x = (k % 5) - 2,
      dx = d * 2,
      y = (k % 7) - 3;
    item = I(
      [
        `直线过 (${x},${y})、(${x + dx},${y + 2 * n})，求精确 m。`,
        `A line passes through (${x},${y}),(${x + dx},${y + 2 * n}). Find exact m.`,
      ],
      m,
      [
        [
          `Δy=${2 * n}，Δx=${dx}，比值 ${m}。`,
          `Δy=${2 * n},Δx=${dx}, giving ${m}.`,
        ],
      ],
      [`${n + d}/${d}`],
    );
  } else if (i === 2)
    item = I(
      [
        `给定 y=${source}，求代数 y 截距点。`,
        `For y=${source}, give the algebraic y-intercept point.`,
      ],
      `(0,${b})`,
      [
        [
          '令 x=0，点的第二坐标为 b。',
          'Set x=0; the point’s second coordinate is b.',
        ],
      ],
      [`(0,${b + 1})`],
      'coordinate',
    );
  else if (i === 3) {
    const x = (k % 5) - 2,
      dx = d,
      y1 = n * x + b * d,
      y2 = n * (x + dx) + b * d;
    item = I(
      [
        `已知 mx+b 模型过 (${x},${y1}/${d})、(${x + dx},${y2}/${d})，写一般式。`,
        `A supplied mx+b model passes through (${x},${y1}/${d}),(${x + dx},${y2}/${d}). Write its expression.`,
      ],
      source,
      [
        [
          '先按同序变化比求 m，再用任一点求 b，核两点。',
          'Use consistently ordered changes for m, then find b and check both points.',
        ],
      ],
      ['x+100'],
      'expression',
    );
  } else if (i === 4) {
    const mode = k % 4,
      expr =
        mode === 0
          ? `${n || 1}x`
          : mode === 1
            ? `${n || 1}x+1`
            : mode === 2
              ? `${b}`
              : 'x^2',
      cls: FunctionClass =
        mode === 0
          ? 'direct'
          : mode === 1
            ? 'affine'
            : mode === 2
              ? 'constant'
              : 'nonlinear',
      value = cls === 'affine' ? 'linear but not direct' : cls;
    item = I(
      [
        `按本单元一次函数 m≠0 约定分类 y=${expr}。`,
        `Under the first-degree m≠0 convention, classify y=${expr}.`,
      ],
      value,
      [
        [
          '先核完整 mx+b 形式与非零 m，再看 b 是否零；常函数与平方反例另列。',
          'Check the complete mx+b form and nonzero m, then b=0; distinguish constants and the square counterexample.',
        ],
      ],
      [cls === 'direct' ? 'constant' : 'direct'],
      cls,
    );
  } else {
    const rate = (k % 5) + 1,
      fee = k % 7,
      x = k % 6;
    item = I(
      [
        `虚构连续费用 y=${rate}x+${fee} NZD，0≤x≤5 km。求 x=${x} km 时费用，只写数值。`,
        `Fictional continuous cost y=${rate}x+${fee} NZD for 0≤x≤5 km. Find the cost at x=${x} km as a number.`,
      ],
      String(rate * x + fee),
      [
        [
          '先乘每公里费再加固定费，核输入在零至五范围。',
          'Multiply the per-km rate, add the fixed fee, and check the input domain.',
        ],
      ],
      [String(rate * x + fee + 1)],
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const j85CheckQuestions: Question[] = [
  q(
    'J85-CHECK-Q1',
    0,
    I(
      [
        'm=−2、b=3，写 y 右侧一般式。',
        'For m=-2,b=3, write the right-side expression.',
      ],
      '-2x+3',
      [
        [
          '保留负系数与固定正三。',
          'Retain the negative coefficient and fixed positive three.',
        ],
      ],
      ['2x+3', '-2x', '1'],
      'expression',
    ),
  ),
  q(
    'J85-CHECK-Q2',
    1,
    I(
      [
        '直线过 (−1,2)、(3,8)，求 m。',
        'A line passes through (-1,2),(3,8). Find m.',
      ],
      '3/2',
      [
        [
          '纵变六、横变四，6/4 约分为 3/2。',
          'The changes are six over four, giving 3/2.',
        ],
      ],
      ['2/3', '6', '-3/2'],
    ),
  ),
  q(
    'J85-CHECK-Q3',
    2,
    I(
      ['y=3x−4 的 y 截距点是多少？', 'What is the y intercept of y=3x-4?'],
      '(0,-4)',
      [
        [
          '令 x=0 得负四，不是把坐标交换。',
          'Set x=0 to get minus four; do not swap coordinates.',
        ],
      ],
      ['(-4,0)', '(0,3)', '(4/3,0)'],
      'coordinate',
    ),
  ),
  q(
    'J85-CHECK-Q4',
    3,
    I(
      [
        '已知 mx+b 模型过 (1,−1)、(4,5)，写一般式。',
        'A supplied mx+b model passes through (1,-1),(4,5). Write its expression.',
      ],
      '2x-3',
      [
        [
          'm=6/3=2，b=−1−2=−3，回代两点。',
          'm=6/3=2 and b=-1-2=-3; check both points.',
        ],
      ],
      ['2x+3', '-2x+1', 'x-2'],
      'expression',
    ),
  ),
  q(
    'J85-CHECK-Q5',
    3,
    I(
      [
        '点 (1,2)、(1,5) 属哪种特殊情形？',
        'Which exceptional case is described by (1,2),(1,5)?',
      ],
      'vertical',
      [
        [
          '同一输入有两个输出，竖直线，斜率未定义。',
          'One input has two outputs: a vertical line with undefined slope.',
        ],
      ],
      ['constant', 'undetermined', '0'],
      'vertical',
    ),
  ),
  q(
    'J85-CHECK-Q6',
    4,
    I(
      [
        '按完整公式分类 y=x²，不只看过原点。',
        'Classify the complete rule y=x² rather than origin crossing alone.',
      ],
      'nonlinear',
      [
        [
          '平方关系不属一次形式，非零输入比值随 x 变。',
          'The square is not first-degree, with y/x changing at nonzero inputs.',
        ],
      ],
      ['direct', 'affine', 'constant'],
      'nonlinear',
    ),
  ),
  pick('J85-CHECK-Q7', 5, specs[5]!.pick),
  reasoning(
    'J85-CHECK-Q8',
    t(
      '解释斜率与截距、两点唯一性、正比例分类和现实模型范围，并给出一个域外代数值的反例。',
      'Explain slope/intercept, two-point uniqueness, direct proportion and contextual domains, giving an algebraic value outside its model domain.',
    ),
    skills[5]!,
    t(
      '斜率是有向 Δy/Δx，不按像素倾角；截距点为 (0,b)。不同 x 才可按公式求 m/b，重复点不唯一、竖直不是 y 关于 x 的函数。本课 m≠0 时 b=0 才正比例，常函数与 x² 分开。m/b 单位需匹配，零输入需在情境域才作实际初值；排水十二减二 x 在七分钟给负二但域只到六分钟，卡片整包不能连成允许半包的线。家长核具体例子、原条件与两点回代，不按术语数评分。',
      'Slope is oriented Δy/Δx rather than a pixel angle; the intercept point is (0,b). Distinct x permits finding m/b; duplicates are underdetermined and vertical lines are not y as a function of x. Under this unit’s m≠0 convention, b=0 gives direct proportion; distinguish constants and x². Match units and domain before treating b as a real starting value. The draining formula 12-2x gives -2 at seven minutes outside its domain through six; whole packs cannot be represented as allowing half packs. Review concrete examples and substitutions, not keywords.',
    ),
    hints[5]!.map(T),
  ),
];
