import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  accepted?: string[];
  kind?: 'linear-equation' | 'solution-class';
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
};
type Pick = {
  stem: Pair;
  options: Pair[];
  feedback: Pair[];
  correct: number;
  step: Pair;
};
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
  'original-equation-check',
  'reversible-equation-steps',
  'bracket-linear-equations',
  'constant-denominator-equations',
  'original-quantity-modelling',
  'context-solution-domain',
];
const hints: Pair[][] = [
  [
    [
      '解要使原方程两边相等。分别代入两边，而不是只算左边。',
      'A solution makes both original sides equal. Substitute into both, not only the left.',
    ],
    [
      '化简到 ax=b：a 非零才可除；a=0 时看剩下恒等还是矛盾，区别零、无解和任意有理数。',
      'In ax=b, divide only when a is nonzero. For a=0 distinguish an identity from a contradiction, and distinguish zero from none and all rationals.',
    ],
  ],
  [
    [
      '把“移项”还原为等号两边同加或同减一个完整的项。',
      'Translate transposition into adding or subtracting the same complete term on both sides.',
    ],
    [
      '先聚含 x 项，再聚常数，最后两边同除非零系数；乘零不可逆、除零无定义。',
      'Gather x terms, then constants, then divide both sides by a nonzero coefficient. Multiplying by zero is irreversible; dividing by zero is undefined.',
    ],
  ],
  [
    [
      '外部因子连到括号内每一项，单独负号表示负一。',
      'Connect the outside factor to every bracket term; a lone minus is negative one.',
    ],
    [
      '展开后按等式性质合并、同减同除；最后把精确解代回带括号的原方程。',
      'After expansion, collect and apply equal operations on both sides. Check the exact solution in the original bracket equation.',
    ],
  ],
  [
    [
      '找已知常数分母的最小公倍数；本课分母不含 x。',
      'Find the least common multiple of the known constant denominators; x is not in a denominator here.',
    ],
    [
      '两边每一项都乘这个非零数，整数项也乘，负号作用于整个分子；解后代回原分数式。',
      'Multiply every term on both sides, including integers. A minus acts on the whole numerator; check the original fractions afterwards.',
    ],
  ],
  [
    [
      '定义 x、单位和范围，先把题干两种原数量分别写在等号两边。',
      'Define x, units and domain, then place the two original quantities on opposite sides.',
    ],
    [
      '建模可展开或交换两边，但本题先不移项；求解后核对年龄差、总量及整数或非负限制。',
      'The model may be expanded or reversed, but do not transpose yet. After solving, check differences, totals and integer or non-negative restrictions.',
    ],
  ],
  [
    [
      '先精确求代数解，再代回原式；这与核查情境取值范围是两关。',
      'Find the exact algebraic solution and check the original; the context domain is a separate gate.',
    ],
    [
      '人数或完整组数须非负整数，长度可为正分数，精确年龄可为非负分数，摄氏读数可负；不要靠舍入凑等式。',
      'Counts require non-negative integers, lengths may be positive fractions, exact ages may be non-negative fractions, and Celsius readings may be negative. Do not round to force equality.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const value = item.kind
    ? item.value
    : exactRational(item.value)!.map(String).join('/');
  const answer: AnswerSpec =
    item.kind === 'linear-equation'
      ? { kind: 'linear-equation', value, model: true }
      : item.kind === 'solution-class'
        ? { kind: 'solution-class', value: value as 'none' | 'all' }
        : {
            kind: 'number',
            value,
            formats: ['decimal', 'fraction'],
            ...(item.unit ? { unit: item.unit } : {}),
          };
  const accepted = [value, ...(item.accepted ?? [])];
  if (answer.kind === 'number') {
    const r = exactRational(value)!;
    accepted.push(`${r[0] * 2n}/${r[1] * 2n}`);
    if (item.unit) accepted.push(`${item.value} ${item.unit}`);
  }
  if (answer.kind === 'solution-class')
    accepted.push(answer.value === 'none' ? '无符合条件的解' : '任意有理数');
  const result = numeric(
    id,
    T(item.stem),
    value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    { accepted: [...new Set(accepted)], rejected: item.wrong },
  );
  result.answer = answer;
  result.type = i >= 4 ? 'word_problem' : 'numeric';
  result.misconceptionTags = [
    skills[i]!,
    'original-versus-transformed',
    'zero-versus-no-solution',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    hints[i]!.map(T),
    [T(p.step)],
  );
const specs: Spec[] = [
  {
    title: ['方程的解与检验', 'Solutions and checking'],
    objective: [
      '用原方程两边检验解，并区分唯一零解、无解和恒成立。',
      'Check solutions in both original sides and distinguish a unique zero, no solution and an identity.',
    ],
    prerequisites: ['J72-L01', 'P65-L04'],
    keywords: [
      ['方程的解', 'solution'],
      ['代回检验', 'substitution check'],
      ['解集', 'solution set'],
    ],
    lab: 'linear-check',
    hook: [
      '2x+3=11 中，x=4 为什么通过、x=3 为什么不通过？零与无解相同吗？',
      'Why does x=4 pass 2x+3=11 while x=3 fails? Is zero the same as no solution?',
    ],
    items: [
      {
        stem: ['解 2x+3=11，写 x 的精确值。', 'Solve 2x+3=11 for the exact x.'],
        value: '4',
        step: [
          '两边同减三得 2x=8，再同除二得 x=4；代回左边十一，右边十一。',
          'Subtract three from both sides, giving 2x=8, then divide by two: x=4. Both original sides equal eleven.',
        ],
        wrong: ['3', '7', '8'],
      },
      {
        stem: ['解 x−3/2=1/2，并代回。', 'Solve x−3/2=1/2 and check.'],
        value: '2',
        step: [
          '两边加 3/2，x=2；2−3/2=1/2。',
          'Add 3/2 to both sides: x=2; 2−3/2=1/2.',
        ],
        wrong: ['1', '-1', '1/2'],
      },
      {
        stem: [
          '3x+1=1 的唯一解是多少？',
          'What is the unique solution of 3x+1=1?',
        ],
        value: '0',
        step: [
          '同减一得 3x=0，除以非零三得 x=0。代入两边都是一，零是一个有效解。',
          'Subtract one: 3x=0. Divide by nonzero three: x=0. Both sides are one, so zero is a valid solution.',
        ],
        wrong: ['无解', 'all', '1'],
      },
      {
        stem: [
          '在有理数范围，2(x+1)=2x+2 的完整解集是什么？恒成立写“任意有理数”。',
          'Over the rationals, give the complete solution set of 2(x+1)=2x+2. Write “all” for an identity.',
        ],
        value: 'all',
        kind: 'solution-class',
        step: [
          '展开后同减 2x 和二，余 0=0。每个有理数都满足，不是唯一的零解。',
          'Expand and subtract 2x and two from both sides: 0=0. Every rational works; zero is not the unique solution.',
        ],
        wrong: ['0', '1', 'none'],
      },
      {
        stem: [
          '在有理数范围，2x+1=2x+3 的完整解集是什么？',
          'Over the rationals, give the complete solution set of 2x+1=2x+3.',
        ],
        value: 'none',
        kind: 'solution-class',
        step: [
          '两边同减 2x 得 1=3，矛盾，因此无解；不是把 x 写成零。',
          'Subtract 2x from both sides: 1=3, a contradiction. There is no solution, rather than x=0.',
        ],
        wrong: ['0', '2', 'all'],
      },
      {
        stem: ['解 3x−2=−3，保留精确分数。', 'Solve 3x−2=−3 exactly.'],
        value: '-1/3',
        step: [
          '两边同加二得 3x=−1，除三得 −1/3；代回 −1−2=−3。',
          'Add two to both sides: 3x=−1; divide by three to obtain −1/3. The original left is −1−2=−3.',
        ],
        wrong: ['1/3', '-5/3', '-0.33'],
      },
    ],
    pick: {
      stem: [
        '哪种证据能说明一个候选数是原方程的解？',
        'Which evidence proves a candidate is a solution of the original equation?',
      ],
      correct: 1,
      options: [
        ['只把候选代入左边，算出一个数', 'Evaluate the left side only'],
        [
          '同一个候选代入原式两边，精确结果相等',
          'The same candidate gives equal exact values on both original sides',
        ],
        ['候选接近估计值就行', 'The candidate is near an estimate'],
      ],
      feedback: [
        [
          '还没有与原右边比较。',
          'The original right side has not been compared.',
        ],
        [
          '这正是解的定义，还要满足题设允许范围。',
          'This is the definition of a solution; also check the stated domain.',
        ],
        [
          '近似吻合不保证原等式成立。',
          'Approximate agreement does not guarantee the original equality.',
        ],
      ],
      step: [
        '一个候选的通过只证明这个值是解，不能由一次检验断言所有值都满足。',
        'One passing candidate proves that value works, not that every value works.',
      ],
    },
    reason: [
      '比较 3x=0、2x+1=2x+3、2(x+1)=2x+2，说明零解、无解、任意有理数的区别，并解释一次代入能证明什么。',
      'Compare 3x=0, 2x+1=2x+3 and 2(x+1)=2x+2. Explain zero, none and all rationals, and what one substitution proves.',
    ],
    rubric: [
      '第一式除以非零三得唯一解零；第二式消去 x 后为矛盾，解集为空；第三式恒等化为 0=0，所有有理数均满足。后两式是系数抵消的退化边界，不都属于 ax+b=0 且 a≠0 的一元一次方程。代回原式两边相等能验证某个候选；一次吻合不能证明恒成立，恒等要由对所有允许值有效的变形说明。家长核对三种集合和原式检验，而非关键词。',
      'The first has the unique zero solution after division by nonzero three. The second cancels to a contradiction, giving the empty set. The third is an identity, reducing to 0=0 for all rationals. The latter two are degenerate cancellation cases, rather than equations ax+b=0 with a≠0. Equal original sides verify one candidate; one match cannot prove an identity, which needs reasoning valid for every permitted value. A parent checks the three sets and the original-side evidence.',
    ],
    misconception: [
      '把零当无解；只算一边；以一个候选通过证明恒等。',
      'Treating zero as none, evaluating only one side, or claiming identity from one passing candidate.',
    ],
    prompts: [
      [
        '你检验的是哪一个原式，两边分别多少？',
        'Which original equation did you check, and what are both values?',
      ],
      [
        '系数抵消以后，是恒等还是矛盾？',
        'After coefficients cancel, is the result an identity or contradiction?',
      ],
    ],
  },
  {
    title: [
      '移项的本质是等式变形',
      'Equation balance rather than magic transposition',
    ],
    objective: [
      '把移项说明为两边同做可逆操作，并识别乘零、除零与单侧操作。',
      'Explain transposition through equal reversible operations and identify zero and one-sided traps.',
    ],
    prerequisites: ['J73-L01', 'J72-L04'],
    keywords: [
      ['等式性质', 'equality properties'],
      ['可逆', 'reversible'],
      ['非零系数', 'nonzero coefficient'],
    ],
    lab: 'linear-balance',
    hook: [
      '5x+2=2x+11 怎样变成 3x+2=11？被移走的 2x 到了哪里？',
      'How does 5x+2=2x+11 become 3x+2=11? What happened to 2x?',
    ],
    items: [
      {
        stem: ['解 5x+2=2x+11。', 'Solve 5x+2=2x+11.'],
        value: '3',
        step: [
          '两边同减 2x 得 3x+2=11，同减二得 3x=9，同除三得 x=3；原式两边十七。',
          'Subtract 2x from both sides, then two, then divide by three: x=3. Both original sides are seventeen.',
        ],
        wrong: ['9', '13/3', '-3'],
      },
      {
        stem: ['解 4x−7=2x+1。', 'Solve 4x−7=2x+1.'],
        value: '4',
        step: [
          '同减 2x，再同加七，2x=8；x=4，原式两边九。',
          'Subtract 2x and add seven to both sides: 2x=8, x=4. Both original sides are nine.',
        ],
        wrong: ['-3', '3', '8'],
      },
      {
        stem: ['解 3x+4=19。', 'Solve 3x+4=19.'],
        value: '5',
        step: [
          '两边同减四再同除三，x=5，代回十五加四为十九。',
          'Subtract four then divide by three on both sides: x=5; fifteen plus four is nineteen.',
        ],
        wrong: ['23/3', '15', '-5'],
      },
      {
        stem: ['解 2−3x=11。', 'Solve 2−3x=11.'],
        value: '-3',
        step: [
          '同减二得 −3x=9，同除负三得 x=−3，原左 2−3×(−3)=11。',
          'Subtract two: −3x=9. Divide by negative three: x=−3; 2−3×(−3)=11.',
        ],
        wrong: ['3', '-13/3', '9'],
      },
      {
        stem: ['解 (1/2)x+2=5。', 'Solve (1/2)x+2=5.'],
        value: '6',
        step: [
          '同减二后 x/2=3，两边同乘二得 x=6；6/2+2=5。',
          'Subtract two: x/2=3. Multiply both sides by two: x=6; 6/2+2=5.',
        ],
        wrong: ['3/2', '3', '14'],
      },
      {
        stem: ['解 7x−3=4x+2，保留精确分数。', 'Solve 7x−3=4x+2 exactly.'],
        value: '5/3',
        step: [
          '同减 4x 再同加三得 3x=5，x=5/3；原式两边 26/3。',
          'Subtract 4x then add three on both sides: 3x=5, x=5/3. Both original sides are 26/3.',
        ],
        wrong: ['1/3', '-5/3', '1.67'],
      },
    ],
    pick: {
      stem: [
        '哪一步不能作为通用的保解变形？',
        'Which is not a general solution-preserving step?',
      ],
      correct: 2,
      options: [
        ['两边同减 2x', 'Subtract 2x from both sides'],
        ['两边同除已知非零数 −3', 'Divide both sides by known nonzero −3'],
        ['两边同乘零', 'Multiply both sides by zero'],
      ],
      feedback: [
        [
          '加减同一式可逆，定义范围内保解。',
          'Adding or subtracting the same defined expression is reversible.',
        ],
        [
          '负数非零，除法有逆操作。',
          'A negative nonzero constant has an inverse operation.',
        ],
        [
          '会变为 0=0，丢失原来的限制。',
          'This creates 0=0 and loses the original restriction.',
        ],
      ],
      step: [
        '两边乘零可能扩大解集；除零则没有定义。左右相同操作还必须检查可逆条件。',
        'Multiplication by zero may enlarge the solution set, while division by zero is undefined. Equal operations also need reversibility.',
      ],
    },
    reason: [
      '把 5x+2=2x+11 的“移项”逐步还原为两边的操作。为什么乘零与只改左边不能作为通用方法？',
      'Reconstruct each transposition in 5x+2=2x+11 as operations on both sides. Why are zero multiplication and changing only the left not general methods?',
    ],
    rubric: [
      '写出两边同减 2x、同减二、同除非零三，每步都有逆操作且原解三仍成立。乘零使原式变 0=0，其他值也通过，不能由此推出原解；除零无定义。只改左边通常破坏等式，即使某例巧合保解也不构成通用规则。代入三在原式两边都为十七；一次检验是检查候选，保解依据来自步骤可逆。家长核对具体等式和理由。',
      'Subtract 2x, subtract two, then divide by nonzero three on both sides. Each operation has an inverse. Multiplying by zero produces 0=0 and allows other values, so cannot recover the original restriction; division by zero is undefined. A one-sided change usually breaks equality and a coincidental preserved set does not make it a general rule. Substituting three gives seventeen on both original sides. Reversibility justifies the transformation; substitution checks the candidate.',
    ],
    misconception: [
      '说“过等号变号”却不解释；负系数除错；两边乘零后任取答案。',
      'Unexplained sign changes, incorrect division by a negative coefficient, or choosing any value after zero multiplication.',
    ],
    prompts: [
      [
        '把等号遮住，左右各做了哪个相同操作？',
        'What identical operation was applied to each side?',
      ],
      ['怎样反向还原这一步？', 'How can you reverse this step?'],
    ],
  },
  {
    title: ['含括号的一元一次方程', 'Equations with brackets'],
    objective: [
      '逐项展开带正负或分数因子的括号，再用可逆步骤求解并代回。',
      'Expand every term under signed or fractional factors, solve reversibly and check the original.',
    ],
    prerequisites: ['J73-L02', 'J72-L03'],
    keywords: [
      ['分配律', 'distributive law'],
      ['去括号', 'expansion'],
      ['原式检验', 'original check'],
    ],
    lab: 'linear-brackets',
    hook: [
      '2(x−3)=x+1 的负六从哪里来？−3(x−2) 中两个负号怎样作用？',
      'Where does negative six come from in 2(x−3)=x+1? How do the two minus signs in −3(x−2) act?',
    ],
    items: [
      {
        stem: ['解 2(x−3)=x+1。', 'Solve 2(x−3)=x+1.'],
        value: '7',
        step: [
          '展开 2x−6=x+1，同减 x、同加六得 x=7；2(7−3)=8=7+1。',
          'Expand: 2x−6=x+1. Subtract x and add six: x=7; 2(7−3)=8=7+1.',
        ],
        wrong: ['4', '-5', '-7'],
      },
      {
        stem: ['解 −3(x−2)=2x+1。', 'Solve −3(x−2)=2x+1.'],
        value: '1',
        step: [
          '负三乘两项得 −3x+6=2x+1；同减 2x、同减六，−5x=−5，x=1；原式两边三。',
          'Distribute to get −3x+6=2x+1. Subtract 2x and six: −5x=−5, x=1. Both original sides are three.',
        ],
        wrong: ['-7/5', '-1', '5'],
      },
      {
        stem: ['解 3(x+2)=2(x−1)+5。', 'Solve 3(x+2)=2(x−1)+5.'],
        value: '-3',
        step: [
          '展开 3x+6=2x+3，得 x=−3；左边负三，右边 2(−4)+5=−3。',
          'Expand to 3x+6=2x+3: x=−3. The left is −3 and the right 2(−4)+5=−3.',
        ],
        wrong: ['3', '-9', '1'],
      },
      {
        stem: ['解 4(x−1)−(x+2)=0。', 'Solve 4(x−1)−(x+2)=0.'],
        value: '2',
        step: [
          '展开 4x−4−x−2=0，3x−6=0；x=2，原式四减四为零。',
          'Expand: 4x−4−x−2=0, then 3x−6=0. x=2; the original left is four minus four.',
        ],
        wrong: ['2/3', '-2', '6'],
      },
      {
        stem: ['解 (1/2)(4x−6)=x+1。', 'Solve (1/2)(4x−6)=x+1.'],
        value: '4',
        step: [
          '分数也乘每项，2x−3=x+1，x=4；原式两边五。',
          'The fraction multiplies every term: 2x−3=x+1, x=4. Both original sides are five.',
        ],
        wrong: ['7', '-4', '5/2'],
      },
      {
        stem: ['解 −2(3x−1)=x+3。', 'Solve −2(3x−1)=x+3.'],
        value: '-1/7',
        step: [
          '−6x+2=x+3，−7x=1，x=−1/7；原式两边 20/7。',
          '−6x+2=x+3 gives −7x=1, x=−1/7. Both original sides are 20/7.',
        ],
        wrong: ['1/7', '-5/7', '-0.14'],
      },
    ],
    pick: {
      stem: ['−(x+2) 应展开成什么？', 'What is the expansion of −(x+2)?'],
      correct: 0,
      options: [
        ['−x−2', '−x−2'],
        ['−x+2', '−x+2'],
        ['x−2', 'x−2'],
      ],
      feedback: [
        [
          '外部负一乘每项，两个项都取反。',
          'Outside negative one multiplies both terms.',
        ],
        [
          '只改变了第一项，漏了常数。',
          'Only the first term changed; the constant was missed.',
        ],
        ['只改变了常数，漏了 x。', 'Only the constant changed; x was missed.'],
      ],
      step: [
        '去括号保持表达式恒等，不是把项任意移到另一边。',
        'Expansion preserves an expression identity; it does not arbitrarily move terms across equality.',
      ],
    },
    reason: [
      '解释 −3(x−2)=2x+1 的每一步并代回原式；如果展开后 x 系数全抵消，为什么不能继续除零？',
      'Explain every step for −3(x−2)=2x+1 and check the original. Why cannot you divide by zero if all x coefficients cancel?',
    ],
    rubric: [
      '负三分别乘 x 与负二，得到 −3x+6=2x+1；两边同减 2x、同减六，得 −5x=−5；同除非零负五得一，代回两边三。若系数抵消，剩下恒等或矛盾，应分别给所有允许值或无解。用 2(x+1)=2x+2 与 2(x+1)=2x+3 对照；这类退化情形没有可除的非零 x 系数。家长核对负号覆盖每项、可逆操作与原式。',
      'Negative three multiplies x and negative two: −3x+6=2x+1. Subtract 2x and six from both sides: −5x=−5; divide by nonzero −5 to get one. Both original sides are three. If coefficients cancel, interpret an identity or contradiction as all permitted values or none. Compare 2(x+1)=2x+2 with 2(x+1)=2x+3: these degenerate cases have no nonzero x coefficient to divide by. Check every distributed sign, reversible operation and original substitution.',
    ],
    misconception: [
      '因子只乘第一项；外部负号漏常数；原式没检验。',
      'Multiplying only the first term, missing a constant under a minus, or failing to check the original.',
    ],
    prompts: [
      [
        '外部因子与括号中哪几项相乘？',
        'Which inside terms receive the outside factor?',
      ],
      [
        '把求出的值放回带括号的原式会怎样？',
        'What happens in the original bracket equation?',
      ],
    ],
  },
  {
    title: ['含分数的一元一次方程', 'Linear equations involving fractions'],
    objective: [
      '用非零常数公倍数整体去分母，保留括号与符号并验证精确分数解。',
      'Clear constant denominators using a nonzero common multiple, preserving signs and checking exact fractional solutions.',
    ],
    prerequisites: ['J73-L03', 'J71-L04'],
    keywords: [
      ['去分母', 'clearing denominators'],
      ['最小公倍数', 'least common multiple'],
      ['精确解', 'exact solution'],
    ],
    lab: 'linear-fractions',
    hook: [
      '(x−1)/2−(x+2)/3=1/6 两边乘六，为什么是 3(x−1)−2(x+2)=1？',
      'Why does multiplying (x−1)/2−(x+2)/3=1/6 by six give 3(x−1)−2(x+2)=1?',
    ],
    items: [
      {
        stem: ['解 (x−1)/2−(x+2)/3=1/6。', 'Solve (x−1)/2−(x+2)/3=1/6.'],
        value: '8',
        step: [
          '两边整体乘六：3(x−1)−2(x+2)=1；3x−3−2x−4=1，x=8。原左 7/2−10/3=1/6。',
          'Multiply both whole sides by six: 3(x−1)−2(x+2)=1. Expand to x−7=1: x=8. Originally 7/2−10/3=1/6.',
        ],
        wrong: ['0', '-6', '7'],
      },
      {
        stem: ['解 (x+1)/3=x/2−1。', 'Solve (x+1)/3=x/2−1.'],
        value: '8',
        step: [
          '两边乘六得 2(x+1)=3x−6，整数负一也乘六。解得八，原式两边三。',
          'Multiply by six: 2(x+1)=3x−6; integer negative one also receives six. x=8; both original sides are three.',
        ],
        wrong: ['3', '-8', '2'],
      },
      {
        stem: ['解 3x/4+1/2=x/2−1/4。', 'Solve 3x/4+1/2=x/2−1/4.'],
        value: '-3',
        step: [
          '两边乘四：3x+2=2x−1，x=−3；原式两边 −7/4。',
          'Multiply by four: 3x+2=2x−1, x=−3. Both original sides are −7/4.',
        ],
        wrong: ['3', '-1', '-3/4'],
      },
      {
        stem: ['解 x/3=1/6。', 'Solve x/3=1/6.'],
        value: '1/2',
        step: [
          '两边乘六得 2x=1，因此 x=1/2；分数系数方程也可得到分数解。',
          'Multiply by six: 2x=1, so x=1/2. Fractional coefficients may yield fractional solutions.',
        ],
        wrong: ['2', '1/18', '0.51'],
      },
      {
        stem: ['解 (x−2)/4+(x+1)/2=3。', 'Solve (x−2)/4+(x+1)/2=3.'],
        value: '4',
        step: [
          '两边乘四得 x−2+2(x+1)=12，3x=12，x=4；原式 1/2+5/2=3。',
          'Multiply by four: x−2+2(x+1)=12, hence 3x=12, x=4; 1/2+5/2=3.',
        ],
        wrong: ['1', '-4', '10/3'],
      },
      {
        stem: ['解 (2x−1)/3−(x+2)/4=1/6。', 'Solve (2x−1)/3−(x+2)/4=1/6.'],
        value: '12/5',
        step: [
          '两边乘十二：4(2x−1)−3(x+2)=2；5x−10=2，x=12/5。代回 19/15−11/10=1/6。',
          'Multiply by twelve: 4(2x−1)−3(x+2)=2; 5x−10=2, x=12/5. Check 19/15−11/10=1/6.',
        ],
        wrong: ['0', '8/5', '2.41'],
      },
    ],
    pick: {
      stem: [
        'x/2+1=3 两边乘二，哪一行正确？',
        'Multiply both sides of x/2+1=3 by two. Which line is correct?',
      ],
      correct: 1,
      options: [
        ['x+1=3', 'x+1=3'],
        ['x+2=6', 'x+2=6'],
        ['x+1=6', 'x+1=6'],
      ],
      feedback: [
        [
          '只删分母，两个整数项都漏乘。',
          'Only the denominator disappeared; both integers missed multiplication.',
        ],
        [
          '左边每项与右边整体都乘二。',
          'Every left term and the whole right side receive two.',
        ],
        [
          '左边的一也要乘二。',
          'The left integer one must also be multiplied by two.',
        ],
      ],
      step: [
        '去分母是整体等式变形，不能把它理解为只删除分母。',
        'Clearing denominators transforms both whole sides; it is not deletion of denominator symbols.',
      ],
    },
    reason: [
      '写出 (x−1)/2−(x+2)/3=1/6 去分母、去括号与检验，解释负号与公倍数为何覆盖整组。',
      'Show clearing, expansion and checking for (x−1)/2−(x+2)/3=1/6, explaining the scope of the minus and common multiple.',
    ],
    rubric: [
      '已知分母二、三、六均非零，公倍数六非零，两边同乘可逆。每项分别得到 3(x−1)、−2(x+2)、一；展开负二要得到 −2x−4，不能只变 x 项。最后 x=8，原式 7/2−10/3=1/6。对含整数的一边也必须全乘，例如 (x+1)/3=x/2−1 得 2(x+1)=3x−6。本课不处理含 x 分母，不把未知非零条件隐藏掉。家长核对每项来源和精确原式检验。',
      'Denominators two, three and six are known nonzero constants. Multiplication of both sides by nonzero six is reversible. Terms become 3(x−1), −2(x+2) and one; distributing negative two gives −2x−4. The solution eight checks as 7/2−10/3=1/6. Integer terms also receive the factor: (x+1)/3=x/2−1 becomes 2(x+1)=3x−6. Variable denominators are outside this lesson; their nonzero conditions must not be hidden. A parent checks every term and the exact original equation.',
    ],
    misconception: [
      '只删分母；漏乘整数项；负分子只变第一项；舍入后声称精确。',
      'Deleting denominators, missing integer terms, changing only one numerator term, or claiming rounded results are exact.',
    ],
    prompts: [
      ['这个六分别乘到哪些项？', 'Which terms each receive six?'],
      ['为什么可以反向除回去？', 'Why can this step be reversed by division?'],
    ],
  },
  {
    title: ['方程应用：年龄与数量', 'Age and quantity word problems'],
    objective: [
      '用有单位和范围的未知数表示两种原数量，列方程后求解并核对情境。',
      'Model two original quantities using a defined variable, units and domain, then solve and check the context.',
    ],
    prerequisites: ['J73-L04', 'J72-L05'],
    keywords: [
      ['设未知数', 'define the unknown'],
      ['数量关系', 'quantity relationship'],
      ['取值条件', 'domain conditions'],
    ],
    lab: 'linear-model',
    hook: [
      '两人相差八年、年龄和三十年，为什么不是 x+x=30？固定两支为什么不每袋重复？',
      'With an age gap of eight and sum thirty, why not x+x=30? Why do two fixed pencils not repeat per bag?',
    ],
    items: [
      {
        stem: [
          '虚构两人精确年龄相差八年、和三十年，求较小年龄的年数。允许分数年，年龄非负。',
          'Two fictional exact ages differ by eight years and sum to thirty. Find the younger age in years; non-negative fractional years are allowed.',
        ],
        value: '11',
        unit: 'years',
        step: [
          '设较小年龄 x，较大 x+8，x+(x+8)=30，解得十一；较大十九，差八、和三十且均非负。',
          'Let younger age be x and older x+8. Solve x+(x+8)=30 to get eleven; older nineteen gives gap eight, sum thirty and non-negative ages.',
        ],
        wrong: ['15', '19', '22'],
      },
      {
        stem: [
          '设 x 为较小精确年龄，年龄差八年、和三十年。先把“两人年龄和”与“三十”写在等号两边；可展开或交换两边，不先移项或只写解。',
          'Let x be the younger exact age, with gap eight and sum thirty. Equate the sum of ages to thirty; expansion or side reversal is allowed, but do not transpose or give only the solution.',
        ],
        value: 'x+(x+8)=30',
        kind: 'linear-equation',
        accepted: ['2x+8=30', '30=x+x+8'],
        step: [
          '一人 x，另一人 x+8，两种原数量为 x+(x+8) 与三十。2x=22、x=11 虽同解，但尚未展示本题指定的原数量关系。',
          'The original quantities are x+(x+8) and thirty. 2x=22 and x=11 have the same solution but do not display the original relationship requested here.',
        ],
        wrong: ['x=11', '2x=22', '2x+8=38'],
      },
      {
        stem: [
          '虚构两人现相差六年，四年后较大年龄是较小的两倍。设现较小 x 年，求 x；精确年龄非负。',
          'Two fictional people differ by six years. Four years later the older is twice the younger. Let the current younger age be x; find x in non-negative exact years.',
        ],
        value: '2',
        unit: 'years',
        step: [
          '四年后分别 x+4、x+10，x+10=2(x+4)，解得二。现二与八，四年后六与十二。',
          'In four years the ages are x+4 and x+10, so x+10=2(x+4), giving two. Current ages two and eight become six and twelve.',
        ],
        wrong: ['6', '10', '-2'],
      },
      {
        stem: [
          '已有两支笔，另有 x 个完整袋，每袋三支，共二十支。x 是非负整数。先把“原总量表达式”和“二十”写成方程，不先移项或只写袋数。',
          'Two fixed pencils plus x whole bags of three make twenty pencils, with non-negative integer x. Equate the original total expression to twenty before transposing or giving the bag count.',
        ],
        value: '3x+2=20',
        kind: 'linear-equation',
        accepted: ['20=2+3x', 'x*3+2=20'],
        step: [
          '按袋重复三支，固定两支只计一次，因此 3x+2=20；解六袋代回十八加二为二十。',
          'Three pencils repeat per bag while two extras occur once: 3x+2=20. Six bags check as eighteen plus two equals twenty.',
        ],
        wrong: ['x=6', '3x=18', '5x=20'],
      },
      {
        stem: [
          '两盒卡片数是相邻非负整数，总共十七张。设较少一盒 x 张，求 x。',
          'Two boxes hold consecutive non-negative integer counts totalling seventeen cards. Let the smaller count be x; find x.',
        ],
        value: '8',
        unit: 'cards',
        step: [
          '另一盒 x+1，x+(x+1)=17，2x=16，x=8；八与九满足整数和总数。',
          'The other count is x+1. Solve x+(x+1)=17 to get x=8; eight and nine satisfy integrality and total.',
        ],
        wrong: ['17/2', '9', '16'],
      },
      {
        stem: [
          '虚构两人精确年龄相差五年、和二十四年，求较小年龄（年）。允许非负分数年。',
          'Two fictional exact ages differ by five years and sum to twenty-four. Find the younger age in years; non-negative fractional years are allowed.',
        ],
        value: '19/2',
        unit: 'years',
        accepted: ['9.5岁'],
        step: [
          'x+(x+5)=24，2x=19，x=19/2 年；另一人为 29/2 年，差五、和二十四，分数年龄有效。',
          'x+(x+5)=24 gives 2x=19, x=19/2 years. The other is 29/2; the gap is five and sum twenty-four, so fractional exact ages are valid.',
        ],
        wrong: ['12', '14.5', '9'],
      },
    ],
    pick: {
      stem: [
        '较小年龄现 x，较大现 x+6。四年后“较大是较小两倍”如何列式？',
        'Current ages are x and x+6. How do you model the older being twice the younger four years later?',
      ],
      correct: 2,
      options: [
        ['x+6=2x', 'x+6=2x'],
        ['x+10=2x+4', 'x+10=2x+4'],
        ['x+10=2(x+4)', 'x+10=2(x+4)'],
      ],
      feedback: [
        ['漏了两人都增长四年。', 'Both people need four additional years.'],
        [
          '两倍作用于未来较小年龄整个 x+4。',
          'Twice acts on the entire future younger age x+4.',
        ],
        [
          '同一未来时间，两边年龄都正确。',
          'Both ages refer correctly to the same future time.',
        ],
      ],
      step: [
        '先统一时间，再写两倍的对象；不能只让较大年龄增长。',
        'Use the same time on both sides, then identify the complete quantity being doubled.',
      ],
    },
    reason: [
      '说明年龄与完整袋数建模时 x 的意义、范围、原数量关系与最后核对。为什么只写正确数值仍没有展示建模过程？',
      'Explain the variable, domain, original quantities and final checks in age and whole-bag models. Why does a correct number alone not show modelling?',
    ],
    rubric: [
      '较小精确年龄 x 可为非负分数，另一人 x+8；原关系 x+(x+8)=30，解十一并核十九的差与和。四年后两人都加四，倍数对象是整组未来年龄。完整袋数 x 必须非负整数，3x+2=20 中固定两支只计一次，解六并代回。方程原数量题可展开或交换两边；x=11 与 2x=22 数学上同解，但不是题目明确要求展示的原数量两边，需补原建模式，不能说它们是错误等式。家长核对意义与条件，不只对答案。',
      'The younger exact age x can be a non-negative fraction; the other is x+8. The original relation x+(x+8)=30 gives eleven and nineteen, checking gap and sum. Four years later both ages increase by four; doubling acts on the whole future age. Whole-bag count x must be a non-negative integer; 3x+2=20 includes extras once and gives six. Original-quantity models may be expanded or reversed. x=11 and 2x=22 are mathematically equivalent but omit the explicitly requested original sides; ask for the model rather than calling them false equations. Check meaning and conditions as well as numbers.',
    ],
    misconception: [
      '两种年龄都设 x；只一人长大；固定余量乘袋数；默认分数年龄无效。',
      'Using x for both ages, ageing only one person, repeating fixed extras per bag, or rejecting fractional exact ages.',
    ],
    prompts: [
      [
        '这两个式子各代表原题哪种数量？',
        'Which original quantity does each side represent?',
      ],
      [
        '这个 x 可以是分数或负数吗，为什么？',
        'May this x be fractional or negative, and why?',
      ],
    ],
  },
  {
    title: ['不合理答案的识别', 'Spotting impossible solutions'],
    objective: [
      '分别核对原等式与情境范围，允许合理负数或分数，并拒绝靠舍入掩盖不可能条件。',
      'Check equation and domain separately, allow appropriate signed or fractional values and reject rounding that hides impossible conditions.',
    ],
    prerequisites: ['J73-L05', 'J71-L01'],
    keywords: [
      ['代数解', 'algebraic solution'],
      ['允许范围', 'allowed domain'],
      ['情境检验', 'context check'],
    ],
    lab: 'linear-context',
    hook: [
      '3x=8 得 8/3，可当完整组数吗？那 1/3 cm 或 −3°C 为什么可能有效？',
      'Can 8/3 from 3x=8 count whole groups? Why may 1/3 cm or −3°C still be valid?',
    ],
    items: [
      {
        stem: [
          '恰好八人分成每组三人的完整组，x 为组数且满足 3x=8。能否满足全部条件？无符合条件的解写“无解”。',
          'Exactly eight people must form complete groups of three, with integer group count x satisfying 3x=8. Give an allowed solution or write “no solution”.',
        ],
        value: 'none',
        kind: 'solution-class',
        step: [
          '唯一代数解 8/3 不是非负整数；二组剩二人、三组需九人，均不满足原条件，因此情境无解。',
          'The unique algebraic root 8/3 is not a non-negative integer. Two groups leave two people; three need nine. No allowed solution exists.',
        ],
        wrong: ['8/3', '3', '2'],
      },
      {
        stem: [
          '虚构单价 x 元且 x≥0，两件加固定五元共三元，2x+5=3。给允许解，或写“无解”。',
          'A fictional non-negative unit price x satisfies 2x+5=3. Give the allowed solution or write “no solution”.',
        ],
        value: 'none',
        kind: 'solution-class',
        step: [
          '代数解负一可使等式成立，但违反单价非负条件；题设合起来无解，不能偷偷改固定费。',
          'The algebraic root −1 satisfies equality but violates the stated non-negative price, so the combined conditions have no solution. Do not alter the fixed fee.',
        ],
        wrong: ['-1', '1', '0'],
      },
      {
        stem: [
          '一厘米线段三等分，每段 x cm，3x=1 且 x>0。给允许的精确长度。',
          'A one-centimetre segment has three equal parts, each x cm, with 3x=1 and x>0. Give the allowed exact length.',
        ],
        value: '1/3',
        unit: 'cm',
        step: [
          'x=1/3 cm 是正长度，三倍正好一厘米；不因出现分数拒绝。',
          'x=1/3 cm is positive and triples exactly to one centimetre; being fractional does not invalidate it.',
        ],
        wrong: ['无解', '0.33', '3'],
      },
      {
        stem: [
          '九人恰分每组三人的完整组，3x=9，x 为非负整数，求组数。',
          'Nine people form complete groups of three, 3x=9 with non-negative integer x. Find the group count.',
        ],
        value: '3',
        unit: 'groups',
        step: [
          'x=3 是非负整数，三组三人正好九人，两关都通过。',
          'x=3 is a non-negative integer and three groups of three total nine, passing both gates.',
        ],
        wrong: ['无解', '9', '6'],
      },
      {
        stem: [
          '假想摄氏读数 x，升高五度后为二度，x+5=2。允许负读数，求 x（°C）。',
          'A fictional Celsius reading x rises five degrees to two, x+5=2. Negative readings are allowed; find x in °C.',
        ],
        value: '-3',
        unit: '°C',
        step: [
          'x=−3°C，−3+5=2，摄氏读数可负，符合本题范围。',
          'x=−3°C; −3+5=2 and negative Celsius readings are allowed here.',
        ],
        wrong: ['无解', '3', '7'],
      },
      {
        stem: [
          '恰好五支笔分成每袋两支的完整袋，2x=5，x 为非负整数。给允许解或写“无解”。',
          'Exactly five pencils must form whole bags of two, 2x=5 with non-negative integer x. Give an allowed solution or write “no solution”.',
        ],
        value: 'none',
        kind: 'solution-class',
        step: [
          '代数解 5/2 不是整数袋数；取二袋或三袋都会破坏总数五，所以情境无解。',
          'The algebraic root 5/2 is not an integer bag count. Two or three bags break the total of five; no allowed solution exists.',
        ],
        wrong: ['2.5', '2', '3'],
      },
    ],
    pick: {
      stem: ['哪种判断正确？', 'Which judgement is correct?'],
      correct: 0,
      options: [
        [
          '是否拒绝负数或分数，要看变量意义和原式',
          'Whether to reject negatives or fractions depends on meaning and the original equation',
        ],
        ['所有分数解都不合理', 'Every fractional solution is impossible'],
        [
          '组数四舍五入后总能通过原式',
          'Rounding a group count always passes the original',
        ],
      ],
      feedback: [
        [
          '还要分别检查等式成立与允许范围。',
          'Check equality and allowed domain separately.',
        ],
        [
          '正分数长度和精确分数年龄都可能有效。',
          'Positive fractional lengths and exact fractional ages may be valid.',
        ],
        [
          '舍入通常改变总量，必须代回，不能冒充精确解。',
          'Rounding usually changes the total; substitute it rather than claim exactness.',
        ],
      ],
      step: [
        '范围由本题定义，不由答案外观决定。',
        'The task definition determines the domain, not the appearance of the answer.',
      ],
    },
    reason: [
      '比较完整组数 3x=8、长度 3x=1、摄氏读数 x+5=2 与袋中支数 4x=0。说明两关检验、零与负分数的适用条件。',
      'Compare whole groups 3x=8, length 3x=1, Celsius x+5=2 and pencil count 4x=0. Explain the two checks and the roles of zero, negatives and fractions.',
    ],
    rubric: [
      '组数代数解 8/3 代回成立却非整数，情境无解，不能舍入二或三。长度 1/3 为正且满足原式，允许；读数负三在摄氏条件下允许且代回二，不能一概拒绝负数。袋中支数零为非负整数，4×0=0，零是解而不是无解。每项都先精确核原式，再核题设范围；如果原式本身不成立，无论范围合适也不是解。家长核对具体数量与两个判断，而非“分数错、负数错”的口号。',
      'The group root 8/3 passes equality but is not an integer, so no contextual solution exists; rounding to two or three fails. Length 1/3 is positive and satisfies its equation. Celsius reading −3 is allowed and checks to two. Pencil count zero is a non-negative integer and 4×0=0, so zero is a solution rather than no solution. Check exact equality first and the stated domain separately. A value in the domain still fails if the original equality does not hold. A parent checks both judgements and their quantity meanings.',
    ],
    misconception: [
      '分数或负数一概拒绝；满足原式便忽略范围；把人数舍入后当解；把零当无解。',
      'Rejecting every fraction or negative, ignoring domain after equality passes, rounding counts into solutions, or treating zero as none.',
    ],
    prompts: [
      [
        '这是哪一关没通过：原式还是情境？',
        'Which gate failed: the original equation or the domain?',
      ],
      [
        '零、分数、负数在这个变量里分别允许吗？',
        'Are zero, fractions and negatives allowed for this variable?',
      ],
    ],
  },
];
export const j73Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J73-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i >= 3 ? 26 : 23,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J07',
    unit: 'J73',
    order: i + 1,
    nzYearHints: [7, 8],
    cnGradeHints: [7],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((item, j) => q(`${id}-Q${j + 2}`, i, item)),
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
            '纸上设计两组虚构条件：一组精确年龄允许分数，一组完整袋数要求整数。先定义未知数、原数量方程和范围，再各自求解、代回并判情境。故意造一组无解条件，说明如何发现；另给乘零或漏乘整数项的错步骤，让家人找出丢失的依据。只需纸笔。',
            'On paper, invent an exact-age context allowing fractions and a whole-bag context requiring integers. Define the unknown, original-quantity equation and domain; solve, substitute and judge both. Deliberately create impossible conditions and explain their detection. Add a mistaken zero-multiplication or missed-integer step for a family member to diagnose. Paper is sufficient.',
          ),
        }
      : {}),
  };
});
export function j73ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J73-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J73 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 9) - 4,
    b = 1 + (Math.floor(k / 9) % 5),
    c = (k % 5) - 2,
    d = [2, 3, 4][k % 3]!,
    p = 1 + (k % 8);
  let item: Item;
  if (i === 0 && k % 5 === 0)
    item = {
      stem: [
        `有理数范围，${b}(x+1)=${b}x+${b} 的完整解集？`,
        `Over the rationals, give the complete solution set of ${b}(x+1)=${b}x+${b}.`,
      ],
      value: 'all',
      kind: 'solution-class',
      step: [
        '展开后恒成立，所有有理数均满足。',
        'Expansion yields an identity, so every rational works.',
      ],
      wrong: ['0', 'none'],
    };
  else if (i === 0 && k % 5 === 1)
    item = {
      stem: [
        `有理数范围，${b}x+(${c})=${b}x+(${c + 1}) 的完整解集？`,
        `Over the rationals, give the complete solution set of ${b}x+(${c})=${b}x+(${c + 1}).`,
      ],
      value: 'none',
      kind: 'solution-class',
      step: [
        '两边同减含 x 项得到相差一的常数，不可能相等。',
        'Subtract the x term from both sides: constants differing by one cannot be equal.',
      ],
      wrong: ['0', 'all'],
    };
  else if (i === 0)
    item = {
      stem: [
        `解 ${b}x+(${c})=${b * a + c} 并核原式。`,
        `Solve ${b}x+(${c})=${b * a + c} and check the original.`,
      ],
      value: String(a),
      step: [
        `同减 ${c} 再除非零 ${b}，x=${a}。`,
        `Subtract ${c}, then divide by nonzero ${b}: x=${a}.`,
      ],
      wrong: [String(a + 1)],
    };
  else if (i === 1)
    item = {
      stem: [
        `解 ${b + 1}x+(${c})=x+(${b * a + c})，每步说明两边操作。`,
        `Solve ${b + 1}x+(${c})=x+(${b * a + c}), explaining equal operations.`,
      ],
      value: String(a),
      step: [
        `同减 x 与 ${c} 后，${b}x=${b * a}；除非零 ${b}。`,
        `Subtract x and ${c} from both sides: ${b}x=${b * a}; divide by nonzero ${b}.`,
      ],
      wrong: [String(a + 2)],
    };
  else if (i === 2)
    item = {
      stem: [
        `解 ${b + 1}(x-(${c}))=x+(${b * a - (b + 1) * c})。`,
        `Solve ${b + 1}(x-(${c}))=x+(${b * a - (b + 1) * c}).`,
      ],
      value: String(a),
      step: [
        `展开并同加 ${(b + 1) * c}、同减 x，${b}x=${b * a}，x=${a}。`,
        `Expand, add ${(b + 1) * c} and subtract x on both sides: ${b}x=${b * a}, x=${a}.`,
      ],
      wrong: [String(a + 1)],
    };
  else if (i === 3)
    item = {
      stem: [
        `解 ${b}x/${d}+(${c})/${d}=(${a})/${d}。`,
        `Solve ${b}x/${d}+(${c})/${d}=(${a})/${d}.`,
      ],
      value: `${a - c}/${b}`,
      step: [
        `两边整体乘非零 ${d} 得 ${b}x+(${c})=${a}，解为 (${a}−(${c}))/${b}。`,
        `Multiply both whole sides by nonzero ${d}: ${b}x+(${c})=${a}, so x=(${a}−(${c}))/${b}.`,
      ],
      wrong: [String((a - c) / b + 1)],
    };
  else if (i === 4 && k % 2 === 0)
    item = {
      stem: [
        `虚构年龄差 ${b} 年、和 ${2 * p + b} 年，设较小 x，求较小精确年龄（年）；允许非负分数年。`,
        `Fictional ages have gap ${b} and sum ${2 * p + b} years. Find the younger exact age x in years; non-negative fractions are allowed.`,
      ],
      value: String(p),
      unit: 'years',
      step: [
        `x+(x+${b})=${2 * p + b}，解得 ${p}，较大 ${p + b}。`,
        `x+(x+${b})=${2 * p + b} gives ${p}; the older age is ${p + b}.`,
      ],
      wrong: [String(p + b)],
    };
  else if (i === 4)
    item = {
      stem: [
        `已有两支笔，x 个完整袋每袋 ${b} 支，总计 ${b * p + 2} 支。写原总量与总计的方程，可展开或交换两边，不先移项或写解。`,
        `Two fixed pencils plus x whole bags of ${b} total ${b * p + 2}. Equate the original total to the given total; expansion or reversal is allowed, without transposition or only a solution.`,
      ],
      value: `${b}x+2=${b * p + 2}`,
      kind: 'linear-equation',
      accepted: [`${b * p + 2}=2+${b}x`],
      step: [
        `每袋 ${b} 支重复 x 次，另加固定二。`,
        `Repeat ${b} pencils x times, then add the fixed two.`,
      ],
      wrong: [`x=${p}`, `${b}x=${b * p}`],
    };
  else if (k % 3 === 0)
    item = {
      stem: [
        `完整组数 x 为非负整数，${b}x=${a}。给允许解，无符合条件解写“无解”。`,
        `Whole-group count x is a non-negative integer and ${b}x=${a}. Give an allowed solution or write “no solution”.`,
      ],
      value: a >= 0 && a % b === 0 ? String(a / b) : 'none',
      ...(a >= 0 && a % b === 0 ? {} : { kind: 'solution-class' as const }),
      step: [
        `代数解 ${a}/${b}；检查非负整数限制，不舍入。`,
        `The algebraic root is ${a}/${b}; check the non-negative integer restriction without rounding.`,
      ],
      wrong:
        a >= 0 && a % b === 0
          ? [String(a / b + 1), 'none']
          : ['0', String(a / b + 1)],
    };
  else if (k % 3 === 1)
    item = {
      stem: [
        `长度 x cm>0，${b}x=${p}，求精确长度。`,
        `Length x cm>0 satisfies ${b}x=${p}. Find the exact length.`,
      ],
      value: `${p}/${b}`,
      unit: 'cm',
      step: [
        `x=${p}/${b} 是正长度，允许分数，乘回 ${b} 得 ${p}。`,
        `x=${p}/${b} is a positive allowed length; multiplying by ${b} gives ${p}.`,
      ],
      wrong: ['none', String(p / b + 1)],
    };
  else
    item = {
      stem: [
        `假想摄氏读数 x，x+${b}=${a}，求 x（°C），允许负值。`,
        `A fictional Celsius reading satisfies x+${b}=${a}; find x in °C, allowing negatives.`,
      ],
      value: String(a - b),
      unit: '°C',
      step: [
        `x=${a - b}，代回加 ${b} 得 ${a}，负摄氏读数允许。`,
        `x=${a - b}; adding ${b} gives ${a}, with negative Celsius readings allowed.`,
      ],
      wrong: ['none', String(a - b + 1)],
    };
  return q(`${id}-R${round}`, i, item);
}
export const j73CheckQuestions: Question[] = [
  q('J73-CHECK-Q1', 0, {
    stem: ['解 4x−1=11，并核原式。', 'Solve 4x−1=11 and check.'],
    value: '3',
    step: [
      '同加一再同除四，x=3；十二减一为十一。',
      'Add one then divide by four: x=3; twelve minus one is eleven.',
    ],
    wrong: ['5/2', '12'],
  }),
  q('J73-CHECK-Q2', 1, {
    stem: ['解 2x+7=x+3。', 'Solve 2x+7=x+3.'],
    value: '-4',
    step: [
      '同减 x 和七，x=−4；原式两边负一。',
      'Subtract x and seven from both sides: x=−4. Both original sides are −1.',
    ],
    wrong: ['4', '10'],
  }),
  q('J73-CHECK-Q3', 2, {
    stem: ['解 3(x−2)=x+1。', 'Solve 3(x−2)=x+1.'],
    value: '7/2',
    step: [
      '3x−6=x+1，2x=7，x=7/2；原式两边 9/2。',
      '3x−6=x+1 gives 2x=7, x=7/2. Both original sides are 9/2.',
    ],
    wrong: ['7', '-5/2'],
  }),
  q('J73-CHECK-Q4', 3, {
    stem: ['解 (x+1)/2=2/3。', 'Solve (x+1)/2=2/3.'],
    value: '1/3',
    step: [
      '同乘六得 3(x+1)=4，x=1/3；(1/3+1)/2=2/3。',
      'Multiply by six: 3(x+1)=4, x=1/3; (1/3+1)/2=2/3.',
    ],
    wrong: ['4/3', '0.33'],
  }),
  q('J73-CHECK-Q5', 4, {
    stem: [
      '虚构年龄差六、和二十六年。设较小精确年龄 x，写原年龄和与二十六的方程；可展开或换边，不先移项或只写解。',
      'Fictional ages differ by six and sum to twenty-six years. Let younger exact age be x. Equate the original sum to twenty-six, allowing expansion or reversal but no transposition or solution alone.',
    ],
    value: 'x+(x+6)=26',
    kind: 'linear-equation',
    accepted: ['2x+6=26', '26=x+x+6'],
    step: [
      '另一人为 x+6，先写 x+(x+6)=26；后来解得十与十六。',
      'The other is x+6, giving x+(x+6)=26 before solving to ten and sixteen.',
    ],
    wrong: ['x=10', '2x=20', '2x=26'],
  }),
  q('J73-CHECK-Q6', 5, {
    stem: [
      '完整袋数 x 为非负整数，每袋两支总五支，2x=5。给允许解或写“无解”。',
      'Whole-bag count x is a non-negative integer, with two pencils per bag totalling five, 2x=5. Give an allowed solution or “no solution”.',
    ],
    value: 'none',
    kind: 'solution-class',
    step: [
      '代数解 5/2 违反整数限制，不能舍入后假称原式成立。',
      'The algebraic root 5/2 violates integrality; rounding cannot be claimed to satisfy the original.',
    ],
    wrong: ['2.5', '2', '3'],
  }),
  pick('J73-CHECK-Q7', 1, specs[1]!.pick),
  reasoning(
    'J73-CHECK-Q8',
    t(
      '自拟一个含括号或分数系数的方程，说明每步为何保解并代回；再说明同一个分数值作为长度和完整袋数时，允许范围为何不同。',
      'Create an equation with brackets or fractional coefficients, justify every reversible step and check the original. Explain why the same fraction may be allowed as a length but not a whole-bag count.',
    ),
    skills[5]!,
    t(
      '要求原式明确、逐项展开或用非零常数去分母、每步两边同做可逆操作，解精确且两边代回相等。再定义长度为正、完整袋数为非负整数，例如 1/2 cm 允许而半个完整袋不允许；若整数条件导致无解应直说，不能舍入。家长需查看推导和情境意义，不仅对最终数。',
      'Require a clear original equation, complete expansion or clearing by a nonzero constant, identical reversible operations and an exact root checking in both original sides. Define positive length versus non-negative integer whole bags: 1/2 cm may be allowed, while half a whole bag is not. State no allowed solution when integrality fails rather than round. A parent reviews derivation and context, not just the final number.',
    ),
    hints[5]!.map(T),
  ),
];
