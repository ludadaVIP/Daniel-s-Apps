import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; correct: number; options: Pair[]; feedback: Pair[] };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['复合函数与逆函数深化', 'Composition and inverses revisited'],
    objective: [
      '通过中间输入条件和一对一分支，构造复合函数的定义域并检查逆运算顺序。',
      'Use intermediate-input restrictions and one-to-one branches to determine a composite domain and audit inverse order.',
    ],
    hook: [
      '平方再平移，与平移再平方相同吗？交换坐标后总能得到反函数吗？',
      'Does shifting then squaring equal squaring then shifting? Does swapping coordinates always give an inverse function?',
    ],
    prerequisites: ['H02-L01', 'H02-L05'],
    keywords: [
      ['复合定义域', 'composite domain'],
      ['一对一分支', 'one-to-one branch'],
      ['逆序还原', 'reverse-order undoing'],
    ],
    lab: 'equation-composition',
    hints: [
      [
        '先写内函数输出，再检查它是否能进入外函数；不能仅看最终多项式。',
        'Write the inner output first and check whether the outer function accepts it; the final polynomial alone is insufficient.',
      ],
      [
        '若H=f∘g且两步可逆，H的逆按g的逆∘f的逆还原。平方的分支决定根号前符号。',
        'If H=f∘g and both steps are invertible, undo with g inverse after f inverse. The square branch decides the sign of the root.',
      ],
    ],
    items: [
      {
        stem: [
          'f(u)=u²限u≥0，g(x)=x+1。求H=f∘g的定义域。',
          'Let f(u)=u² for u≥0 and g(x)=x+1. Find the domain of H=f∘g.',
        ],
        answer: {
          kind: 'real-union',
          value: '[-1,∞)',
        },
        step: [
          'x+1≥0，所以x≥−1；最终式虽是多项式，原复合条件仍保留。',
          'Require x+1≥0, hence x≥−1. A polynomial final formula does not remove the original restriction.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['同一H，求H(2)。', 'For that H, find H(2).'],
        answer: {
          kind: 'number',
          value: '9',
        },
        step: [
          'g(2)=3，f(3)=9，且3在f定义域内。',
          'g(2)=3 and f(3)=9; the intermediate input is allowed.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['同一f、g，求g(f(2))。', 'For the same f and g, find g(f(2)).'],
        answer: {
          kind: 'number',
          value: '5',
        },
        step: [
          '先平方得到4，再加1得5，与9不同。',
          'Square first to obtain four, then add one, giving five rather than nine.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'H(x)=(x+1)²限x≥−1，求H(x)=9的完整实数解集。',
          'For H(x)=(x+1)² restricted to x≥−1, solve H(x)=9 completely.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{2}',
        },
        step: [
          '代数候选−4和2；−4不在定义域，所以只留2。',
          'The algebraic candidates are −4 and 2; only 2 belongs to the domain.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '改限f(u)=u²于u≤0，g(x)=x+1。H的反函数在9处是多少？',
          'Now restrict f(u)=u² to u≤0, with g(x)=x+1. What is the inverse of H at 9?',
        ],
        answer: {
          kind: 'number',
          value: '-4',
        },
        step: [
          '先按负分支取−√9=−3，再撤销加1，得−4。',
          'Use the negative branch −√9=−3, then undo the shift to obtain −4.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '比较全实数平方、正半轴平方和负半轴平方的反函数，并解释复合逆序与定义域。',
          'Compare squaring on all reals and on each half-line, explaining composite inverse order and domains.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '全实数平方不是一对一，±u可同像，交换后仅是两支关系。限u≥0时逆为√y，限u≤0时逆为−√y，逆输入均y≥0。H=f∘g先走g再f，逆先撤f再撤g；g=x+1时得到±√y−1，分支符号保留，不能把反函数写成倒数或任意双值式。',
            en: 'Squaring on all reals is not one-to-one; opposite inputs share an output, so swapping gives a relation with two branches. Restricting to u≥0 gives √y and to u≤0 gives −√y, both for y≥0. For H=f∘g, undo f then g, giving the selected ±√y−1 branch when g=x+1. An inverse is neither a reciprocal nor an arbitrary two-valued function.',
          },
        },
        step: [
          '全实数平方不是一对一，±u可同像，交换后仅是两支关系。限u≥0时逆为√y，限u≤0时逆为−√y，逆输入均y≥0。H=f∘g先走g再f，逆先撤f再撤g；g=x+1时得到±√y−1，分支符号保留，不能把反函数写成倒数或任意双值式。',
          'Squaring on all reals is not one-to-one; opposite inputs share an output, so swapping gives a relation with two branches. Restricting to u≥0 gives √y and to u≤0 gives −√y, both for y≥0. For H=f∘g, undo f then g, giving the selected ±√y−1 branch when g=x+1. An inverse is neither a reciprocal nor an arbitrary two-valued function.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '全实数上H(x)=(x+1)²，交换坐标得到什么？',
        'On all reals, what does swapping coordinates of H(x)=(x+1)² produce?',
      ],
      options: [
        ['必然一个反函数', 'Always one inverse function'],
        [
          '一个逆关系，需限分支才成反函数',
          'An inverse relation; restrict a branch for an inverse function',
        ],
        ['1/H(x)', 'The reciprocal 1/H(x)'],
      ],
      correct: 1,
      feedback: [
        [
          '同一正输出通常有两个原像。',
          'A positive output usually has two preimages.',
        ],
        [
          '先检查一对一，分支是函数规则的一部分。',
          'Check one-to-one behaviour; the branch is part of the rule.',
        ],
        [
          '倒数是另一种运算，不交换输入输出。',
          'A reciprocal does not swap input and output.',
        ],
      ],
    },
    reason: [
      '有人只化成(x+1)²便写定义域R。用x=−2说明为何不能。',
      'Someone simplifies to (x+1)² and declares domain R. Use x=−2 to challenge this.',
    ],
    rubric: [
      '原f只收u≥0，x=−2经g成为−1，不能进入f。最终多项式在−2可算，不等于原复合在该处有定义；定义域必须随函数保存。',
      'The original f accepts only u≥0. At x=−2, g produces −1, which f rejects. An extended polynomial value does not define the original composite there; retain its domain.',
    ],
    prompts: [
      [
        '中间值是谁，外层接受吗？',
        'What is the intermediate value, and does the outer function accept it?',
      ],
      [
        '哪个分支保证唯一，撤销顺序怎样？',
        'Which branch gives uniqueness, and in what order are the steps undone?',
      ],
    ],
    misconception: [
      '反函数不是倒数；多项式化简不取消原复合定义域。',
      'An inverse is not a reciprocal, and polynomial simplification does not erase a composite domain.',
    ],
  },
  {
    title: ['指数方程与对数方程', 'Exponential and logarithmic equations'],
    objective: [
      '在合法底数和各真数条件下等价变形，并返回原式排除增根。',
      'Transform equations under valid-base and individual argument conditions, then reject extraneous candidates in the original equation.',
    ],
    hook: [
      '两个负数的乘积为正，能说明它们的实对数之和有定义吗？',
      'If two negative numbers have positive product, is the sum of their real logarithms defined?',
    ],
    prerequisites: ['H03-L04', 'H03-L05', 'H35-L01'],
    keywords: [
      ['合法底数', 'valid base'],
      ['正真数', 'positive argument'],
      ['等价变形', 'equivalent transformation'],
    ],
    lab: 'equation-logarithms',
    hints: [
      [
        '实对数要求b>0、b≠1、每个真数>0。先把这些写成条件。',
        'Real logarithms require b>0, b≠1 and every individual argument positive. Record these first.',
      ],
      [
        '同底指数一对一；合并对数时保留各正真数条件，求候选后代回原式。',
        'Equal-base exponentials are one-to-one. Keep individual positivity when combining logs and substitute candidates back.',
      ],
    ],
    items: [
      {
        stem: [
          '解log₂(x−1)+log₂(x+1)=3，给完整实数解集。',
          'Solve log₂(x−1)+log₂(x+1)=3 over the reals.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{3}',
        },
        step: [
          '原域x>1；合并后x²−1=8，候选±3，只有3满足原域。',
          'The original domain is x>1. Combining gives x²−1=8; only candidate 3 from ±3 survives.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['解2^(x−1)=8，填x。', 'Solve 2^(x−1)=8; enter x.'],
        answer: {
          kind: 'number',
          value: '4',
        },
        step: [
          '8=2³，同底一对一给x−1=3。',
          'Since 8=2³, injectivity gives x−1=3.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['解log₃(x+1)=−2，填x。', 'Solve log₃(x+1)=−2; enter x.'],
        answer: {
          kind: 'number',
          value: '-8/9',
        },
        step: [
          'x+1=1/9，得−8/9，且x+1>0；x本身可以负。',
          'x+1=1/9 gives −8/9. The argument is positive even though x is negative.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'log₂(x−3)+log₂(x+3)的实数定义域是什么？',
          'Find the real domain of log₂(x−3)+log₂(x+3).',
        ],
        answer: {
          kind: 'real-union',
          value: '(3,∞)',
        },
        step: [
          '同时x−3>0及x+3>0，交集x>3。',
          'Intersect x−3>0 and x+3>0 to get x>3.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['解log₂(x−3)+log₂(x+3)=4。', 'Solve log₂(x−3)+log₂(x+3)=4.'],
        answer: {
          kind: 'finite-set',
          value: '{5}',
        },
        step: [
          '候选±5；−5使两真数为负，原式无定义。',
          'Candidates are ±5; −5 makes both arguments negative and is undefined in the original.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '解释为何log₂(x−1)+log₂(x+1)=3不能保留−3，并比较指数方程的唯一性。',
          'Explain why −3 is rejected from the logarithmic equation and compare uniqueness for an equal-base exponential equation.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '原式需x−1>0且x+1>0即x>1。乘积变正只够合并式有定义，不使两项各自有定义；−3虽满足x²−1=8却不是原式解。合法底数指数严格单调，所以同底等式可等价比较指数，含0<b<1的递减情形；本例完整解为{3}。',
            en: 'The original requires x>1. A positive product is not enough for both separate logs: −3 solves x²−1=8 but not the original equation. For a valid base the exponential is strictly monotone, including decreasing bases between zero and one, so equal-base equations permit equivalent exponent comparison. The complete logarithmic solution set is {3}.',
          },
        },
        step: [
          '原式需x−1>0且x+1>0即x>1。乘积变正只够合并式有定义，不使两项各自有定义；−3虽满足x²−1=8却不是原式解。合法底数指数严格单调，所以同底等式可等价比较指数，含0<b<1的递减情形；本例完整解为{3}。',
          'The original requires x>1. A positive product is not enough for both separate logs: −3 solves x²−1=8 but not the original equation. For a valid base the exponential is strictly monotone, including decreasing bases between zero and one, so equal-base equations permit equivalent exponent comparison. The complete logarithmic solution set is {3}.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '关于log₃(x+1)=−2，哪项正确？',
        'Which statement about log₃(x+1)=−2 is correct?',
      ],
      options: [
        ['x必须为正', 'x must be positive'],
        ['负对数无实数意义', 'A negative logarithm cannot be real'],
        ['真数正，x可为−8/9', 'The argument is positive; x can be −8/9'],
      ],
      correct: 2,
      feedback: [
        [
          '需正的是x+1，不是x。',
          'The argument x+1 must be positive, not x itself.',
        ],
        ['1/9的三底对数就是−2。', 'The base-three log of 1/9 is −2.'],
        ['代入真数1/9即可核验。', 'Substitute the positive argument 1/9.'],
      ],
    },
    reason: [
      '在0<b<1时，同底指数等式仍可比较指数吗？说明等式与不等式的区别。',
      'For 0<b<1, may equal-base equations still compare exponents? Distinguish equations from inequalities.',
    ],
    rubric: [
      '可以：函数严格递减仍一对一，所以b^u=b^v等价u=v。若比较不等式，递减会反转方向。b=1无一对一，b≤0也不在本课任意实指数模型中。',
      'Yes: strict decrease still implies injectivity, so b^u=b^v iff u=v. Inequalities reverse direction for a decreasing base. Base one is not injective; nonpositive bases are outside this real-exponent model.',
    ],
    prompts: [
      ['每一个真数都正吗？', 'Is every individual argument positive?'],
      [
        '所得数是候选还是已通过原式检验的解？',
        'Is this merely a candidate or a verified original solution?',
      ],
    ],
    misconception: [
      '乘积正不等于各因子正；对数值可负，真数必须正。',
      'A positive product need not have positive factors. A logarithm may be negative; its argument must be positive.',
    ],
  },
  {
    title: ['三角恒等变形', 'Trigonometric identities'],
    objective: [
      '在原式定义域内用单位圆恒等式化简，并区分恒等变形与填孔延拓。',
      'Use unit-circle identities on the original domain and distinguish a valid rewrite from an extension across holes.',
    ],
    hook: [
      '把sin²θ/(1−cosθ)化成1+cosθ，θ=0处也突然有值了吗？',
      'After simplifying sin²θ/(1−cosθ) to 1+cosθ, does the original suddenly have a value at θ=0?',
    ],
    prerequisites: ['H04-L05', 'H04-L06'],
    keywords: [
      ['恒等式', 'identity'],
      ['公共定义域', 'common domain'],
      ['可去间断', 'removable hole'],
    ],
    lab: 'equation-identities',
    hints: [
      [
        '设s=sinθ、c=cosθ，用s²+c²=1；先列所有分母非零条件。',
        'Let s=sinθ and c=cosθ, with s²+c²=1. Record nonzero denominators first.',
      ],
      [
        '先因式分解再约去非零因子；化简式可在更多角有定义，但原式条件不会消失。',
        'Factor before cancelling a nonzero factor. A simplified expression may extend farther; the original restrictions remain.',
      ],
    ],
    items: [
      {
        stem: [
          '设s=sinθ、c=cosθ。在1−c≠0时，把s²/(1−c)化为仅含c的多项式。',
          'Let s=sinθ and c=cosθ. For 1−c≠0, rewrite s²/(1−c) as a polynomial only in c.',
        ],
        answer: {
          kind: 'trig-identity',
          value: '1+c',
          only: 'c',
        },
        step: [
          's²=1−c²=(1−c)(1+c)，只在1−c≠0时约去。',
          'Factor s²=(1−c)(1+c), cancelling only when 1−c≠0.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '在闭区间[0,2π]，原式sin²θ/(1−cosθ)排除哪些角？用π表示全部角。',
          'Which angles in [0,2π] are excluded by sin²θ/(1−cosθ)? Give all angles using pi.',
        ],
        answer: {
          kind: 'radian-set',
          value: '0,2pi',
          values: ['0', '2'],
        },
        step: [
          'cosθ=1在该闭区间为0及2π；右端也包含。',
          'cosθ=1 at zero and 2π; the upper endpoint is included.',
        ],
        wrong: ['999'],
      },
      {
        stem: ['把(s+c)²−2sc化为常数。', 'Rewrite (s+c)²−2sc as a constant.'],
        answer: {
          kind: 'trig-identity',
          value: '1',
          only: 'constant',
        },
        step: ['展开得s²+c²=1。', 'Expansion leaves s²+c²=1.'],
        wrong: ['999'],
      },
      {
        stem: [
          '把s²−c²化为仅含c的多项式。',
          'Rewrite s²−c² as a polynomial only in c.',
        ],
        answer: {
          kind: 'trig-identity',
          value: '1-2*c^2',
          only: 'c',
        },
        step: ['用s²=1−c²得到1−2c²。', 'Substitute s²=1−c² to obtain 1−2c².'],
        wrong: ['999'],
      },
      {
        stem: [
          '在原式定义域内，把(1−c²)/s化为仅含s的多项式。',
          'On the original domain, rewrite (1−c²)/s as a polynomial only in s.',
        ],
        answer: {
          kind: 'trig-identity',
          value: 's',
          only: 's',
        },
        step: [
          '1−c²=s²，需s≠0，约去一项s。',
          'Use 1−c²=s² and cancel one s only when s≠0.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '审查sin²θ/(1−cosθ)=1+cosθ：给等价化简步骤、完整原定义域，并说明图上的孔。',
          'Audit the quotient identity: give the rewrite, original domain and meaning of its graph holes.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '用s²=1−c²因式分解；约去1−c必须它非零。原式要求cosθ≠1，即θ≠2kπ，k为整数。化简式在这些角的值是2，但只是延拓，不是原式的值；两式在公共原域相等。单角或有限图像相合不是恒等式证明，恒等式也不是要求只求使等式成立的几个角。',
            en: 'Factor s²=1−c² and cancel 1−c only when nonzero. The original domain excludes θ=2kπ for integers k. The simplified expression has value two there, but that is an extension, not an original value. Equality is on the original domain. Agreement at finitely many angles or graph samples does not prove an identity, nor is an identity merely an equation with a few solutions.',
          },
        },
        step: [
          '用s²=1−c²因式分解；约去1−c必须它非零。原式要求cosθ≠1，即θ≠2kπ，k为整数。化简式在这些角的值是2，但只是延拓，不是原式的值；两式在公共原域相等。单角或有限图像相合不是恒等式证明，恒等式也不是要求只求使等式成立的几个角。',
          'Factor s²=1−c² and cancel 1−c only when nonzero. The original domain excludes θ=2kπ for integers k. The simplified expression has value two there, but that is an extension, not an original value. Equality is on the original domain. Agreement at finitely many angles or graph samples does not prove an identity, nor is an identity merely an equation with a few solutions.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '关于tanθ cosθ=sinθ，哪项最准确？',
        'Which statement about tanθ cosθ=sinθ is most accurate?',
      ],
      options: [
        ['在cosθ≠0的原域内恒等', 'An identity on the original domain cosθ≠0'],
        ['左侧在所有实数处都有值', 'The left side is defined for all reals'],
        ['只要验θ=0便是证明', 'Checking θ=0 proves it'],
      ],
      correct: 0,
      feedback: [
        [
          'tanθ先要除cosθ，约掉后条件仍保留。',
          'Tangent first divides by cosθ; cancellation retains that restriction.',
        ],
        [
          'cosθ=0时原式含无定义的tan。',
          'At cosθ=0 the original tangent is undefined.',
        ],
        [
          '一个样本不能证明对全部允许角成立。',
          'One sample does not prove a universal identity.',
        ],
      ],
    },
    reason: [
      '为何不能直接把s²/(1−c)中的分子分母分别减去1来“约掉”？用合法分解解释。',
      'Why can we not cancel terms across s²/(1−c)? Explain a legitimate factorisation.',
    ],
    rubric: [
      '约分只约公共非零因子，不能约加减项。先用s²=(1−c)(1+c)，才有公共因子1−c；同时保留该因子非零。检验几个角只能发现反例，不能代替符号证明。',
      'Cancellation applies to common nonzero factors, not added terms. First factor s²=(1−c)(1+c), then cancel 1−c while retaining its nonzero restriction. Testing angles can reveal a counterexample but cannot replace symbolic proof.',
    ],
    prompts: [
      [
        '被约掉的是因子还是加减项？',
        'Are you cancelling a factor or an added term?',
      ],
      ['原式在哪些角有孔？', 'At which angles does the original have holes?'],
    ],
    misconception: [
      '化简不填孔，数值核验不等于恒等式证明。',
      'Simplification does not fill holes, and numerical checks are not an identity proof.',
    ],
  },
  {
    title: ['参数对函数图像的影响', 'Effects of parameters on graphs'],
    objective: [
      '从内部输入等式推导点映射，解释水平因子与退化参数，而非背方向口诀。',
      'Derive point mappings from the inner-input equation, including horizontal scale and degenerate parameters.',
    ],
    hook: [
      'G(x)=2f(2(x−1))−1中，源点(1,2)移动到哪里？横向是乘2吗？',
      'For G(x)=2f(2(x−1))−1, where does source point (1,2) move? Is the horizontal factor two?',
    ],
    prerequisites: ['H02-L04', 'H35-L01'],
    keywords: [
      ['内部输入', 'inner input'],
      ['点映射', 'point mapping'],
      ['退化参数', 'degenerate parameter'],
    ],
    lab: 'equation-parameters',
    hints: [
      [
        '令u=b(x−h)。当b≠0，先解x=h+u/b；输出再算af(u)+k。',
        'Set u=b(x−h). For b≠0 solve x=h+u/b, then calculate output af(u)+k.',
      ],
      [
        '水平长度因子1/|b|，负b还反射。a=0或b=0另审；本课源f=u²+u定义域R。',
        'Horizontal lengths scale by 1/|b|, with reflection for negative b. Treat zero a or b separately; here f=u²+u has domain R.',
      ],
    ],
    items: [
      {
        stem: [
          'f(u)=u²+u，G(x)=2f(2(x−1))−1。源输入u=1对应的x是多少？',
          'Let f(u)=u²+u and G(x)=2f(2(x−1))−1. Which x corresponds to source input u=1?',
        ],
        answer: {
          kind: 'number',
          value: '3/2',
        },
        step: ['2(x−1)=1，得x=3/2。', 'Solve 2(x−1)=1 to get x=3/2.'],
        wrong: ['999'],
      },
      {
        stem: [
          '同一映射，源点(1,2)对应的纵坐标是多少？',
          'For that mapping, what is the new y-coordinate of source point (1,2)?',
        ],
        answer: {
          kind: 'number',
          value: '3',
        },
        step: ['2×2−1=3。', '2×2−1=3.'],
        wrong: ['999'],
      },
      {
        stem: [
          '将G(x)=2f(2(x−1))−1、f(u)=u²+u写为x的多项式。',
          'Write G(x)=2f(2(x−1))−1 with f(u)=u²+u as a polynomial in x.',
        ],
        answer: {
          kind: 'polynomial',
          value: '8*x^2-12*x+3',
          variables: ['x'],
          collected: true,
        },
        step: [
          '代入再展开：2[4(x−1)²+2(x−1)]−1=8x²−12x+3。',
          'Substitute and expand: 2[4(x−1)²+2(x−1)]−1=8x²−12x+3.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'G(x)=f(−2(x−1))。源输入u=2对应x是多少？',
          'For G(x)=f(−2(x−1)), which x corresponds to source input u=2?',
        ],
        answer: {
          kind: 'number',
          value: '0',
        },
        step: [
          '−2(x−1)=2得x=0，负因子造成水平反射。',
          'Solve −2(x−1)=2 to get zero; the negative factor reflects horizontally.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'f(u)=u²+u，G(x)=3f(0(x−2))−1，求G(5)。',
          'For f(u)=u²+u and G(x)=3f(0(x−2))−1, find G(5).',
        ],
        answer: {
          kind: 'number',
          value: '-1',
        },
        step: [
          '内部恒0且f(0)=0，故G恒−1，不能除以b=0。',
          'The inner input is always zero and f(0)=0, so G is −1. Do not divide by b=0.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '推导一般G(x)=a f(b(x−h))+k的点映射，保留b=0和a=0情形，并用源点核验。',
          'Derive the general point mapping, treating b=0 and a=0, and verify it using a source point.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: 'b≠0时u=b(x−h)给x=h+u/b，纵坐标af(u)+k；水平长度1/|b|，b负则反射，a负则纵反射。对源点(1,2)、a2 b2 h1 k−1得(3/2,3)。b=0内部恒0，本课f(0)=0故G=k；u≠0无对应，u=0对应全部x不唯一。a=0也为k。源域本课为R，不把该结论直接套到f(0)无定义的函数。',
            en: 'For b≠0, u=b(x−h) gives x=h+u/b and new output af(u)+k. Horizontal lengths scale by 1/|b|; negative b reflects horizontally and negative a vertically. The source point (1,2) maps to (3/2,3) for a=2,b=2,h=1,k=−1. At b=0 the input is always zero, and this source has f(0)=0, so G=k; nonzero u has no preimage and u=0 has every x. At a=0 it is also k. These claims use the stated real-domain source, not an undefined f(0).',
          },
        },
        step: [
          'b≠0时u=b(x−h)给x=h+u/b，纵坐标af(u)+k；水平长度1/|b|，b负则反射，a负则纵反射。对源点(1,2)、a2 b2 h1 k−1得(3/2,3)。b=0内部恒0，本课f(0)=0故G=k；u≠0无对应，u=0对应全部x不唯一。a=0也为k。源域本课为R，不把该结论直接套到f(0)无定义的函数。',
          'For b≠0, u=b(x−h) gives x=h+u/b and new output af(u)+k. Horizontal lengths scale by 1/|b|; negative b reflects horizontally and negative a vertically. The source point (1,2) maps to (3/2,3) for a=2,b=2,h=1,k=−1. At b=0 the input is always zero, and this source has f(0)=0, so G=k; nonzero u has no preimage and u=0 has every x. At a=0 it is also k. These claims use the stated real-domain source, not an undefined f(0).',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '当内部参数b=2时，水平长度因子是多少？',
        'When inner multiplier b=2, what is the horizontal length factor?',
      ],
      options: [
        ['2', '2'],
        ['1/2', '1/2'],
        ['−2', '−2'],
      ],
      correct: 1,
      feedback: [
        [
          '解内部输入等式得到除以2。',
          'Solving the inner equation divides by two.',
        ],
        [
          'x差为u差除以b，长度用绝对值。',
          'Differences in x are differences in u divided by b; lengths use absolute values.',
        ],
        [
          'b为正，不产生水平反射。',
          'Positive b does not reflect horizontally.',
        ],
      ],
    },
    reason: [
      '若源函数偶对称，b换负后图形可能不变。为何不能因此断言没有输入反射？',
      'If the source is even, changing the sign of b may leave its graph unchanged. Why does this not disprove input reflection?',
    ],
    rubric: [
      '点映射仍有u/b符号反转；偶函数满足f(−u)=f(u)，反射后集合可能重合。应区分逐点映射与最终点集，不能只凭外形反推所有参数。',
      'The mapping still reverses the sign of u/b. For an even source, f(−u)=f(u), so the reflected point set can coincide. Distinguish labelled point mappings from the final point set; appearance alone may not identify parameters.',
    ],
    prompts: [
      [
        '先令内层等于哪个源输入？',
        'Which source input does the inner expression equal?',
      ],
      [
        '参数为0时，刚才哪一步不能做？',
        'Which step becomes invalid when the parameter is zero?',
      ],
    ],
    misconception: [
      '内部乘b的水平长度因子是倒数；b0不能代入除法。',
      'An inner multiplier scales horizontal lengths by its reciprocal; b=0 cannot enter that division.',
    ],
  },
  {
    title: ['多解与定义域检查', 'Checking multiple solutions and domains'],
    objective: [
      '将代数候选与原式定义、符号和代回等式分层检查，报告全部实数解。',
      'Separate candidates from original-domain, sign and substitution checks, reporting the complete real solution set.',
    ],
    hook: [
      'sqrt(x+2)=x平方后得到−1和2，两者根号都有定义，就都是真解吗？',
      'Squaring sqrt(x+2)=x gives −1 and 2. Both have defined radicals; are both original solutions?',
    ],
    prerequisites: ['J91-L04', 'H35-L02', 'H35-L03'],
    keywords: [
      ['候选集', 'candidate set'],
      ['增根与丢根', 'extra and lost roots'],
      ['原式检验', 'original substitution'],
    ],
    lab: 'equation-solutions',
    hints: [
      [
        '先写原定义域，再标每步是否可逆；平方前保留两侧符号，除法前保留非零条件。',
        'Record the original domain and which steps are reversible. Retain signs before squaring and nonzero conditions before division.',
      ],
      [
        '逐个候选先核原域，再将未变形原式两侧代入；证明没有漏掉分支。空集不同于{0}。',
        'Audit each candidate in the original domain and original two sides, then justify completeness. The empty set is not {0}.',
      ],
    ],
    items: [
      {
        stem: [
          '求sqrt(x+2)=x的全部实数解。',
          'Find every real solution of sqrt(x+2)=x.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{2}',
        },
        step: [
          '原域x≥−2；平方候选−1、2，但左侧非负要求x≥0。代回只2成立。',
          'The domain is x≥−2. Squaring gives −1 and 2, but the nonnegative left side requires x≥0; only 2 survives.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求(x²−4)/(x−2)=4的全部实数解。',
          'Find every real solution of (x²−4)/(x−2)=4.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{}',
        },
        step: [
          '原域x≠2，约分后候选x=2，恰是孔，故无解。',
          'The original excludes two. Cancellation gives candidate two, exactly the hole, so the solution set is empty.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求|x−1|=2的全部实数解。',
          'Find every real solution of |x−1|=2.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{-1,3}',
        },
        step: [
          'x−1=2或−2，两支都必须保留。',
          'Solve x−1=2 or −2, retaining both branches.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求x(x−3)=0的全部实数解。',
          'Find every real solution of x(x−3)=0.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{0,3}',
        },
        step: [
          '零乘积定律分两支；直接除x会丢0。',
          'Use both zero-product branches; dividing by x loses zero.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求|x−1|=0的全部实数解。',
          'Find every real solution of |x−1|=0.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{1}',
        },
        step: [
          '两种符号分支重合，集合中只写一个1。',
          'The two sign branches coincide, giving one distinct root.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '用根式、分式和零乘积例子写一份完整解集审查报告，区分增根、丢根与合法空集。',
          'Write a complete-solution audit using radical, rational and zero-product examples, distinguishing extra roots, lost roots and an empty set.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: 'sqrt(x+2)=x的−1在原域内却不满足两侧符号，代回1≠−1，只留2。分式(x²−4)/(x−2)=4的候选2在原域外，故解集空。x(x−3)=0须保留0和3，除x会丢根。完整报告列原域、变形方向、所有候选、原式两侧和最终集合，并用平方候选包含原解、非零因子约分与零乘积定律解释未漏解；图只辅助观察。',
            en: 'For sqrt(x+2)=x, candidate −1 lies in the original domain but fails the sign and substitution checks: 1≠−1, leaving 2. For (x²−4)/(x−2)=4, candidate 2 is outside the original domain, leaving an empty set. In x(x−3)=0 retain both zero and three; division by x loses zero. State domains, transformation directions, all candidates, original substitutions and final sets. Explain completeness via the squared candidate superset, legal cancellation and zero-product law; a graph is only supporting evidence.',
          },
        },
        step: [
          'sqrt(x+2)=x的−1在原域内却不满足两侧符号，代回1≠−1，只留2。分式(x²−4)/(x−2)=4的候选2在原域外，故解集空。x(x−3)=0须保留0和3，除x会丢根。完整报告列原域、变形方向、所有候选、原式两侧和最终集合，并用平方候选包含原解、非零因子约分与零乘积定律解释未漏解；图只辅助观察。',
          'For sqrt(x+2)=x, candidate −1 lies in the original domain but fails the sign and substitution checks: 1≠−1, leaving 2. For (x²−4)/(x−2)=4, candidate 2 is outside the original domain, leaving an empty set. In x(x−3)=0 retain both zero and three; division by x loses zero. State domains, transformation directions, all candidates, original substitutions and final sets. Explain completeness via the squared candidate superset, legal cancellation and zero-product law; a graph is only supporting evidence.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        'sqrt(x+2)=x的候选−1被拒绝的直接原因是什么？',
        'Why is candidate −1 rejected from sqrt(x+2)=x?',
      ],
      options: [
        [
          '因为负数不可能是任何方程的解',
          'Because no negative number can solve any equation',
        ],
        ['因为根号在−1处无定义', 'Because the radical is undefined at −1'],
        [
          '原式有定义，但两侧不相等',
          'The original is defined there, but its sides differ',
        ],
      ],
      correct: 2,
      feedback: [
        [
          '很多方程可有负根，必须检查本题条件。',
          'Many equations have negative roots; examine this equation.',
        ],
        ['根号内是1，确实有定义。', 'The radicand is one and is defined.'],
        [
          '左侧1、右侧−1；定义域检验与等式检验不同。',
          'The left side is one and the right side −1; domain and equality are separate checks.',
        ],
      ],
    },
    reason: [
      '图上在当前视窗只见一个交点，能证明全实数只有一个解吗？说明这里如何获得完整性。',
      'One intersection is visible in a finite graph window. Does that prove one real solution? Explain how these examples establish completeness.',
    ],
    rubric: [
      '不能。视窗和数值采样可能漏解，须代数推导候选全集并检查各支。原解平方后必在二次候选内，再逐项回代；分式先排孔后在原域等价约分；绝对值按正负或零情形，零乘积按两因子为0。',
      'No. A finite window and numerical samples may miss roots. Derive a candidate superset and check every branch: original radical roots must satisfy the squared quadratic; cancel rational factors only on the original domain; split absolute-value cases and apply both zero-product factors.',
    ],
    prompts: [
      [
        '这个数是无定义，还是有定义但不相等？',
        'Is the candidate undefined, or defined but unequal?',
      ],
      [
        '哪一步保证没有漏掉另一支？',
        'Which step ensures another branch was not lost?',
      ],
    ],
    misconception: [
      '原域通过不等于解；平方可增根，除未知数可丢根。',
      'Passing the domain check does not prove a root. Squaring can add roots, and dividing by an unknown can lose them.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `advanced-equation-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(id, T(item.stem), skill, item.answer.rubric, hints.map(T));
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    hints.map(T),
    [T(hints[0]!), T(item.step)],
    { accepted: [value], rejected: item.wrong },
  );
  q.answer = item.answer;
  return q;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `advanced-equation-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h35Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H35-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H12',
    unit: 'H35',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`advanced-equation-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `advanced-equation-${i + 1}`,
        T(s.rubric),
        s.hints.map(T),
      ),
    ],
    exit: question(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});

export function h35ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H35-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H35 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = I(
      [
        `f(u)=u²限u≥0，g(x)=x+${a}，给定H(x)=${b * b}。求H=f∘g的全部实数原像。`,
        `Let f(u)=u² for u≥0 and g(x)=x+${a}. Find all preimages of ${b * b} under H=f∘g.`,
      ],
      { kind: 'finite-set', value: `{${b - a}}` },
      [
        '先按正分支开根，再撤销平移。',
        'Use the nonnegative square branch, then undo the shift.',
      ],
    );
  else if (i === 1)
    item = I(
      [
        `解log₂(x−${a})+log₂(x+${a})=log₂(${(a + b) ** 2 - a * a})。给完整实数解集。`,
        `Solve log₂(x−${a})+log₂(x+${a})=log₂(${(a + b) ** 2 - a * a}) over the reals.`,
      ],
      { kind: 'finite-set', value: `{${a + b}}` },
      [
        '原域x>a，乘积变形后只留正且在域内的候选。',
        'Keep x>a before combining the logs and checking both quadratic candidates.',
      ],
    );
  else if (i === 2)
    item = I(
      [
        `设s=sinθ、c=cosθ，且1−c≠0。将${a}s²/(1−c)+${b}化为仅含c的多项式。`,
        `Let s=sinθ and c=cosθ, with 1−c≠0. Rewrite ${a}s²/(1−c)+${b} as a polynomial only in c.`,
      ],
      { kind: 'trig-identity', value: `${a + b}+${a}*c`, only: 'c' },
      [
        '在原域用s²=(1−c)(1+c)，不能填孔。',
        'Factor s²=(1−c)(1+c) on the original domain; do not fill its holes.',
      ],
    );
  else if (i === 3)
    item = I(
      [
        `f(u)=u²+u，G(x)=${a}f(2(x−${b}))−1。源输入u=1对应x是多少？`,
        `For f(u)=u²+u and G(x)=${a}f(2(x−${b}))−1, which x corresponds to source input u=1?`,
      ],
      { kind: 'number', value: `${2 * b + 1}/2` },
      [
        '由2(x−b)=1解x；外部倍率不影响横坐标。',
        'Solve the inner equation 2(x−b)=1; the outer multiplier does not affect x.',
      ],
    );
  else
    item = I(
      [
        `求sqrt((x−${a})+${b * (b + 1)})=x−${a}的全部实数解。`,
        `Find every real solution of sqrt((x−${a})+${b * (b + 1)})=x−${a}.`,
      ],
      { kind: 'finite-set', value: `{${a + b + 1}}` },
      [
        '令y=x−a，平方候选y为−b和b+1；负分支不满足原式，再还原x。',
        'Set y=x−a. Squaring gives y=−b or b+1; reject the negative branch, then recover x.',
      ],
    );
  return question(`${id}-R${round}`, i, item);
}
export const h35CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H35-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H35-CHECK-Q6', 0, specs[0]!.items[5]!),
  question('H35-CHECK-Q7', 2, specs[2]!.items[5]!),
  question('H35-CHECK-Q8', 4, specs[4]!.items[5]!),
];
