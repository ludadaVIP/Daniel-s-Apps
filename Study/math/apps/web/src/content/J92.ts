import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { solveQuadratic, feasibleQuadraticRoots } from '../quadraticModels';
import { radicalText } from '../radicalModels';
import { textR } from '../algebraModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  steps: Pair[];
  wrong: string[];
  accepted?: string[];
  diagram?: Question['diagram'];
};
const item = (
  stem: Pair,
  answer: AnswerSpec,
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ stem, answer, steps, wrong, diagram });
const roots = (
  stem: Pair,
  values: string[],
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
) =>
  item(
    stem,
    {
      kind: 'quadratic-roots',
      values,
      value: values.join(',') || 'no real solutions',
    },
    steps,
    wrong,
    diagram,
  );
const count = (stem: Pair, value: string, steps: Pair[], wrong: string[]) =>
  item(stem, { kind: 'number', value }, steps, wrong);
const classify = (
  stem: Pair,
  value: Extract<AnswerSpec, { kind: 'quadratic-kind' }>['value'],
  steps: Pair[],
  wrong: string[],
) => item(stem, { kind: 'quadratic-kind', value }, steps, wrong);
const manual = (stem: Pair, rubric: Pair) =>
  item(stem, { kind: 'explain', rubric: T(rubric) }, [rubric], []);
const skills = [
  'equation-zero-and-degree',
  'quadratic-zero-product',
  'completing-square-equivalence',
  'quadratic-formula-derivation',
  'discriminant-distinct-roots',
  'quadratic-model-domain',
];
const hints: Pair[][] = [
  [
    [
      '先用原左边减原右边，再合并同类项。',
      'Subtract original right from left and collect like terms.',
    ],
    [
      '二次项系数必须非零；零点是使差为零的横坐标，全部不同根都要列。',
      'The quadratic coefficient must be nonzero. Zeros are inputs making the difference zero; list all distinct roots.',
    ],
  ],
  [
    [
      '先核右边是否为零，再分解整个左式。',
      'Check that the right side is zero, then factor the whole left side.',
    ],
    [
      '每个因子分别等于零；不能除以可能为零的未知式。代回原式核验并查是否漏根。',
      'Set each factor to zero. Do not divide by a possibly zero expression; substitute into the original and check completeness.',
    ],
  ],
  [
    [
      '先把二次项系数变为一，再取一次项系数的一半。',
      'Make the quadratic coefficient one, then halve the linear coefficient.',
    ],
    [
      '两边同加半系数的平方；平方等于正数有两分支、零有一值、负数没有实根。',
      'Add the half-coefficient squared to both sides. A positive square target gives two branches, zero one value, a negative none.',
    ],
  ],
  [
    [
      '先整理为 ax²+bx+c=0 并确认 a≠0。',
      'Collect as ax²+bx+c=0 and verify a≠0.',
    ],
    [
      'Δ=b²−4ac；整个分子除以2a。公式源自配方，√(4a²)=2|a|，负a会交换±分支。',
      'Use Δ=b²−4ac and divide the whole numerator by 2a. Completing gives √(4a²)=2|a|; negative a exchanges the ± branches.',
    ],
  ],
  [
    [
      '先确认是二次方程，再算带符号的判别式。',
      'Verify a quadratic first, then calculate the signed discriminant.',
    ],
    [
      'Δ正、零、负分别有2、1、0个不同实根。重根只一个数；图像窗口外也可能有根。',
      'Positive, zero and negative Δ give 2,1,0 distinct real roots. A repeated root is one number; roots may lie outside the window.',
    ],
  ],
  [
    [
      '先定义x和允许范围，再按题设两种原数量列等式。',
      'Define x and its domain, then equate the two original quantities.',
    ],
    [
      '列式、代数全部根、代回原式、范围筛选是不同步骤；卡数须整数，不能靠四舍五入补救。',
      'Separate modelling, all algebraic roots, original substitution and domain filtering. Card counts must be integers; rounding cannot repair them.',
    ],
  ],
];
function q(id: string, i: number, v: Item): Question {
  if (v.answer.kind === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      v.answer.rubric,
      hints[i]!.map(T),
    );
  return {
    ...numeric(
      id,
      T(v.stem),
      v.answer.value,
      skills[i]!,
      hints[i]!.map(T),
      v.steps.map(T),
      { accepted: v.accepted ?? [v.answer.value], rejected: v.wrong },
      v.diagram,
    ),
    answer: v.answer,
  };
}
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
const specs: Spec[] = [
  {
    title: ['二次方程与零点', 'Quadratic equations and zeros'],
    objective: [
      '整理方程后判断次数，连接原等式的解与差函数的零点，并列出完整实根集合。',
      'Classify after collecting, connect original equation solutions to zeros of the difference, and list complete real root sets.',
    ],
    prerequisites: ['J91-L01', 'J73-L01', 'J85-L04'],
    keywords: [
      ['一元二次方程', 'quadratic equation'],
      ['零点', 'zero'],
      ['二次项系数', 'quadratic coefficient'],
    ],
    lab: 'quadratic-meaning',
    hook: [
      '含有x²的等式，合并以后也可能不是二次方程。',
      'An equation containing x² may cease to be quadratic after collecting.',
    ],
    items: [
      roots(
        [
          '解 x²−5x+6=0，写全部不同实根。',
          'Solve x²−5x+6=0 for every distinct real root.',
        ],
        ['2', '3'],
        [
          [
            '(x−2)(x−3)=0，得到2、3；代入原左式分别为0。',
            '(x−2)(x−3)=0 gives 2 and 3, each making the original left zero.',
          ],
        ],
        ['2', '3', '5', '2,2'],
        { kind: 'quadratic-graph', source: 'x²-5x+6=0' },
      ),
      classify(
        ['合并 x²+x=x²+3 后分类。', 'Classify x²+x=x²+3 after collecting.'],
        'linear',
        [
          [
            '二次项相消，剩x=3，是一次方程。',
            'Quadratic terms cancel, leaving x=3, a linear equation.',
          ],
        ],
        ['quadratic', 'identity'],
      ),
      roots(
        [
          '解 (x−2)²=0，只列不同实根。',
          'Solve (x−2)²=0, listing distinct real roots.',
        ],
        ['2'],
        [
          [
            '平方为零只能x−2=0，重根只有一个不同值2。',
            'A zero square requires x−2=0; the repeated root has one distinct value, 2.',
          ],
        ],
        ['-2', '2,2', '0'],
      ),
      roots(
        ['解 x²+1=0，限定实数。', 'Solve x²+1=0 over the reals.'],
        [],
        [
          [
            '实数平方非负，不可能等于−1；没有实数根。',
            'A real square is nonnegative and cannot equal −1; no real roots.',
          ],
        ],
        ['0', '1', '-1', '±1'],
      ),
      classify(
        ['合并 x²=x² 后分类。', 'Classify x²=x² after collecting.'],
        'identity',
        [
          [
            '差恒为零，所有实数满足，不是只有x=0。',
            'The difference is identically zero: all reals satisfy it, not just zero.',
          ],
        ],
        ['quadratic', 'contradiction', 'linear'],
      ),
      roots(
        [
          '新式 x²=4x，写全部不同实根。',
          'For the new equation x²=4x give every distinct real root.',
        ],
        ['0', '4'],
        [
          [
            '移项x²−4x=0，再x(x−4)=0；零与四均满足原式。',
            'Move to x²−4x=0, factor x(x−4)=0; both zero and four satisfy the original.',
          ],
        ],
        ['4', '0', '-4,4'],
      ),
    ],
    pick: {
      stem: [
        '哪项足以把整理后的方程称为一元二次方程？',
        'What makes a collected equation quadratic in one variable?',
      ],
      options: [
        ['出现过x²就行', 'It once contained x²'],
        ['形如ax²+bx+c=0且a≠0', 'It has form ax²+bx+c=0 with a≠0'],
        ['必须恰有两个不同实根', 'It must have two distinct real roots'],
      ],
      feedback: [
        ['两边的x²可能相消。', 'The x² terms may cancel.'],
        [
          '正确：看整理后的非零二次项系数。',
          'Correct: use the nonzero quadratic coefficient after collecting.',
        ],
        [
          '二次方程也可能重根或无实根。',
          'A quadratic can have a repeated root or no real roots.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释原式解与f(x)=左−右的零点为何相同；用x²+1=x²说明表面x²不够。',
      'Explain why original solutions equal zeros of left−right; use x²+1=x² to show that a visible x² is insufficient.',
    ],
    rubric: [
      '对每个实数x，左=右等价于左−右=0；零点指横坐标，不是整个点或纵坐标。x²+1=x²合并为1=0，是矛盾而非二次方程，无实数满足。还要区别恒等式0=0的所有实数。',
      'For each real x, left=right iff left−right=0. A zero is an input, not the whole plotted point or its ordinate. x²+1=x² reduces to contradiction 1=0, not a quadratic, with no solutions. Distinguish identity 0=0, satisfied by all reals.',
    ],
    misconception: [
      '按表面符号判次数；把重根当两个不同数，或把无根当零。',
      'Classifying by surface symbols; counting a repeated root twice or confusing no roots with zero.',
    ],
    prompts: [
      [
        '移项后哪个最高次项没有消失？',
        'Which highest-degree term survives collecting?',
      ],
      [
        '候选值代回原左右两边各是多少？',
        'What are the original left and right values at the candidate?',
      ],
    ],
  },
  {
    title: ['因式分解法', 'Solving by factorisation'],
    objective: [
      '在乘积等于零的前提下逐因子求解，保留零根，核验完整解集。',
      'Use the zero-product rule under its premise, retain zero roots and verify a complete solution set.',
    ],
    prerequisites: ['J92-L01', 'J82-L04'],
    keywords: [
      ['零积法', 'zero-product rule'],
      ['因子', 'factor'],
      ['漏根', 'lost root'],
    ],
    lab: 'quadratic-factor',
    hook: [
      'x(x−3)=0时除以x，为什么会丢一个答案？',
      'Why does dividing x(x−3)=0 by x lose an answer?',
    ],
    items: [
      roots(
        ['解 x²−3x=0。', 'Solve x²−3x=0.'],
        ['0', '3'],
        [
          [
            '提x得x(x−3)=0；两个分支x=0或3，不能先除以x。',
            'Factor x(x−3)=0: x=0 or 3. Do not divide by x first.',
          ],
        ],
        ['3', '0', '-3,3'],
      ),
      item(
        [
          '把 x²−5x+6 完整因式分解；只写乘积。',
          'Factor x²−5x+6 completely; enter only a product.',
        ],
        { kind: 'factorisation', value: '(x-2)(x-3)', variables: ['x'] },
        [
          [
            '常数积6、一次项和−5，得到(x−2)(x−3)。',
            'Constants have product 6 and sum −5: (x−2)(x−3).',
          ],
        ],
        ['x²-5x+6', '(x+2)(x+3)', '2,3'],
      ),
      roots(
        ['解 2x²+x−1=0。', 'Solve 2x²+x−1=0.'],
        ['-1', '1/2'],
        [
          [
            '(2x−1)(x+1)=0，各因子为零得1/2、−1。',
            '(2x−1)(x+1)=0 gives 1/2 and −1.',
          ],
        ],
        ['1,-1', '1/2', '-1'],
      ),
      roots(
        [
          '解 x(x−3)=4；先整体移项。',
          'Solve x(x−3)=4, moving the whole equation first.',
        ],
        ['-1', '4'],
        [
          [
            'x²−3x−4=(x−4)(x+1)=0，根4与−1。0与3使原左边为0而非4。',
            'x²−3x−4=(x−4)(x+1)=0 gives 4 and −1. Zero and three give original left zero, not four.',
          ],
        ],
        ['0,3', '4', '-1'],
      ),
      roots(
        [
          '解 (x+2)²=0，不重复列值。',
          'Solve (x+2)²=0 without duplicate values.',
        ],
        ['-2'],
        [
          [
            '两个相同因子给同一根−2。',
            'Both identical factors give the same root −2.',
          ],
        ],
        ['2', '-2,-2', '±2'],
      ),
      roots(
        ['解 3x²=6x，写完整实根。', 'Solve 3x²=6x for all real roots.'],
        ['0', '2'],
        [
          [
            '移项后3x(x−2)=0；常数3非零，根为0与2。',
            'After collecting, 3x(x−2)=0. Nonzero constant three gives no branch; roots are 0 and 2.',
          ],
        ],
        ['2', '0', '3,2'],
      ),
    ],
    pick: {
      stem: ['由uv=0可推出什么？', 'What follows from uv=0?'],
      options: [
        ['u和v必须同时为零', 'Both u and v must be zero'],
        ['u=0或v=0，允许同时', 'u=0 or v=0, possibly both'],
        ['只要uv=4也可以各自置零', 'The same branches work for uv=4'],
      ],
      feedback: [
        ['只要一个为零乘积即可为零。', 'One zero factor suffices.'],
        ['正确：这里的或包含同时。', 'Correct: this OR includes both.'],
        [
          'uv=4时任一因子为零都不成立。',
          'For uv=4 neither factor can be zero.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '纠错：x(x−3)=0，两边除以x得x=3，所以只有3。',
      'Correct: divide x(x−3)=0 by x to get x=3, so three is the only root.',
    ],
    rubric: [
      '除法要求x≠0，原式没有这一条件，且x=0代回成立。应先分支x=0或x−3=0，完整解集{0,3}。若坚持除法，必须另检x=0再在x≠0分支相除；两根分别代回仍需说明因子分支穷尽。',
      'Division assumes x≠0, absent from the original, and zero satisfies it. Use x=0 or x−3=0, giving {0,3}. Alternatively check x=0 separately before division on the x≠0 branch. Substitution checks correctness, while the exhaustive factor branches establish completeness.',
    ],
    misconception: [
      '非零右边直接零积；除以x漏零根；只验一个根就声称完整。',
      'Using zero product on a nonzero right side, losing zero by division, or claiming completeness from one substitution.',
    ],
    prompts: [
      ['乘积现在等于几？', 'What does the product equal now?'],
      ['你进行的除法可能除以零吗？', 'Could your division be by zero?'],
    ],
  },
  {
    title: ['配方法的面积解释', 'Completing the square visually'],
    objective: [
      '把一次项拆成两条半系数面积条，两边同补平方角，连接恒等变形与全部实数分支。',
      'Split the linear term into two half-coefficient strips, add a squared corner on both sides, and connect equivalent algebra to all real branches.',
    ],
    prerequisites: ['J92-L02', 'J81-L04', 'J91-L04'],
    keywords: [
      ['配方', 'completing the square'],
      ['半系数', 'half-coefficient'],
      ['等价变形', 'equivalent transformation'],
    ],
    lab: 'quadratic-complete',
    hook: [
      'x²+6x的两条长条各宽3，缺的角面积为何不是3？',
      'Two strips for x²+6x each have width three; why is the corner area not three?',
    ],
    items: [
      count(
        [
          'x²+6x=7两边应同加多少才能配方？',
          'What must be added to both sides of x²+6x=7?',
        ],
        '9',
        [
          [
            '半系数6/2=3，角面积3²=9；两边同加才等价。',
            'Half of six is three; corner area 3²=9. Add to both sides for equivalence.',
          ],
        ],
        ['3', '6', '36'],
      ),
      roots(
        [
          '配方解 x²+6x=7，保留全部实根。',
          'Complete the square to solve x²+6x=7 for all real roots.',
        ],
        ['-7', '1'],
        [
          [
            '两边加9得(x+3)²=16，x+3=±4，所以x=1或−7。',
            'Adding nine gives (x+3)²=16; x+3=±4, hence x=1 or −7.',
          ],
        ],
        ['1', '-7', '±4'],
        { kind: 'completing-area', source: 'x²+6x=7' },
      ),
      count(
        [
          'x²+3x=1两边应同加哪个精确数？',
          'What exact number completes x²+3x=1?',
        ],
        '9/4',
        [
          [
            '半系数3/2，平方9/4，不是3/2或9。',
            'The half-coefficient is 3/2, whose square is 9/4, not 3/2 or nine.',
          ],
        ],
        ['3/2', '9', '3/4'],
      ),
      roots(
        ['配方解 x²−4x=1。', 'Complete the square to solve x²−4x=1.'],
        ['2-√5', '2+√5'],
        [
          [
            '同加4得(x−2)²=5，x−2=±√5，因此x=2±√5。',
            'Add four: (x−2)²=5, so x−2=±√5 and x=2±√5.',
          ],
        ],
        ['±√5', '-2±√5', '2+√5'],
      ),
      roots(
        [
          '配方解 x²+4x=−5，只考虑实数。',
          'Complete the square to solve x²+4x=−5 over the reals.',
        ],
        [],
        [
          [
            '同加4得(x+2)²=−1，实数平方不能为负。',
            'Add four to get (x+2)²=−1, impossible for a real square.',
          ],
        ],
        ['-2', '-2±1', '0'],
      ),
      roots(
        [
          '配方解 x²+3x=1，写精确根。',
          'Complete the square to solve x²+3x=1 exactly.',
        ],
        ['(-3-√13)/2', '(-3+√13)/2'],
        [
          [
            '同加9/4得(x+3/2)²=13/4，取两分支后x=(−3±√13)/2。',
            'Add 9/4: (x+3/2)²=13/4. Taking both branches gives x=(−3±√13)/2.',
          ],
        ],
        ['(-3+√13)/2', '-3±√13', '(3±√13)/2'],
      ),
    ],
    pick: {
      stem: [
        '把x²+6x看作正长度面积，缺角是什么？',
        'In the positive-length area model of x²+6x, what is missing?',
      ],
      options: [
        ['3×3的正方形，面积9', 'A 3×3 square of area nine'],
        ['一条面积3的长条', 'One strip of area three'],
        ['只需左边加9，右边不动', 'Add nine only on the left'],
      ],
      feedback: [
        [
          '正确：两条3x长条外侧留下3×3角。',
          'Correct: two 3x strips leave a 3×3 corner.',
        ],
        ['三是边长，不是角面积。', 'Three is the corner side, not its area.'],
        [
          '单边加数会改变方程解集。',
          'Adding on only one side changes the solution set.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '图中x>0，为什么x²+6x=7仍须保留−7？负一次项又怎样配方？',
      'The picture uses x>0; why must x²+6x=7 retain −7? How does completing handle a negative linear term?',
    ],
    rubric: [
      '正长度图解释恒等式x²+6x+9=(x+3)²，不给原方程增加x>0限制。代数给x=−7和1，−7代回49−42=7。对x²−4x=1，用有符号半系数−2，两边加4，得(x−2)²=5；不画负宽度正面积块。',
      'The positive-length picture illustrates identity x²+6x+9=(x+3)² without imposing x>0 on the equation. Algebra gives −7 and one; 49−42=7 checks −7. For x²−4x=1 use signed half-coefficient −2 and add four on both sides: (x−2)²=5. Do not draw a negative-width positive-area tile.',
    ],
    misconception: [
      '加半系数而非它的平方；只改一边；把面积图正长度当作方程定义域。',
      'Adding the half-coefficient rather than its square, changing one side, or imposing the picture’s positive lengths on the equation.',
    ],
    prompts: [
      [
        '两条长条各宽多少，角的两条边呢？',
        'What is each strip width and each corner side?',
      ],
      [
        '哪个条件来自原题，哪个只是画图方便？',
        'Which condition is in the original problem and which only helps the picture?',
      ],
    ],
  },
  {
    title: ['求根公式的来源与使用', 'Deriving and using the quadratic formula'],
    objective: [
      '从一般配方推导求根公式，处理a≠0、负系数、整分母与精确根。',
      'Derive the formula by general completing and handle a≠0, signed coefficients, the full denominator and exact roots.',
    ],
    prerequisites: ['J92-L03', 'J91-L04'],
    keywords: [
      ['求根公式', 'quadratic formula'],
      ['判别式', 'discriminant'],
      ['非零条件', 'nonzero condition'],
    ],
    lab: 'quadratic-formula',
    hook: [
      '公式能处理负a；推导中的√(4a²)应怎样写？',
      'The formula handles negative a; what is √(4a²) during its derivation?',
    ],
    items: [
      roots(
        ['用公式解 x²−3x+1=0。', 'Use the formula to solve x²−3x+1=0.'],
        ['(3-√5)/2', '(3+√5)/2'],
        [
          [
            'a=1,b=−3,c=1，Δ=9−4=5；−b=3，整个分子除2。',
            'a=1,b=−3,c=1 gives Δ=9−4=5 and −b=3; divide the whole numerator by two.',
          ],
        ],
        ['(3+√5)/2', '3±√5', '(-3±√5)/2'],
      ),
      roots(
        ['用公式解 −2x²+3x+2=0。', 'Use the formula to solve −2x²+3x+2=0.'],
        ['-1/2', '2'],
        [
          [
            'Δ=3²−4(−2)(2)=25；x=(−3±5)/(−4)，得−1/2和2。',
            'Δ=3²−4(−2)(2)=25; x=(−3±5)/(−4) gives −1/2 and two.',
          ],
        ],
        ['1/2,-2', '2', '-1/2'],
      ),
      count(
        ['2x²−4x−1=0的判别式是多少？', 'Find the discriminant of 2x²−4x−1=0.'],
        '24',
        [
          [
            'a=2,b=−4,c=−1，Δ=(−4)²−4×2×(−1)=16+8=24。',
            'a=2,b=−4,c=−1: Δ=(−4)²−4×2×(−1)=16+8=24.',
          ],
        ],
        ['8', '-8', '0'],
      ),
      roots(
        [
          '公式解 2x²−4x−1=0，保留精确根。',
          'Solve 2x²−4x−1=0 with exact roots.',
        ],
        ['1-√6/2', '1+√6/2'],
        [
          [
            'x=(4±√24)/4=(4±2√6)/4=1±√6/2；不是(1±√6)/2。',
            'x=(4±√24)/4=(4±2√6)/4=1±√6/2, not (1±√6)/2.',
          ],
        ],
        ['1+√6/2', '(1±√6)/2', '1±√6'],
      ),
      classify(
        [
          '0x²+2x−4=0能否套二次求根公式？先分类。',
          'Classify 0x²+2x−4=0 before trying the quadratic formula.',
        ],
        'linear',
        [
          [
            'a=0使2a分母为零；实际是一次方程2x−4=0。',
            'a=0 makes denominator 2a zero; the equation is actually linear, 2x−4=0.',
          ],
        ],
        ['quadratic', 'identity', 'contradiction'],
      ),
      roots(
        [
          '用公式解 x²+2x+1=0，只写不同根。',
          'Use the formula for x²+2x+1=0, listing distinct roots.',
        ],
        ['-1'],
        [
          [
            'Δ=0，两个公式分支相同：x=−2/2=−1，只列一次。',
            'Δ=0 makes both branches equal: x=−2/2=−1, listed once.',
          ],
        ],
        ['1', '-1,-1', '0'],
      ),
    ],
    pick: {
      stem: [
        '求根公式的整个分母是什么，前提是什么？',
        'What is the full denominator and its required condition?',
      ],
      options: [
        ['2；任何a都可', 'Two; any a'],
        ['2a；a≠0', '2a; a≠0'],
        ['a；只有b>0才可', 'a; only b>0'],
      ],
      feedback: [
        [
          '除以的是2a，a=0时不可用。',
          'The denominator is 2a and cannot vanish.',
        ],
        [
          '正确：整个−b±√Δ都要除以2a。',
          'Correct: divide the whole −b±√Δ by 2a.',
        ],
        [
          '分母少了2，b无需为正。',
          'This loses factor two; b need not be positive.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '从配方说明公式来源，尤其a为负时为何√(4a²)=2|a|仍可写分母2a。',
      'Explain the formula from completing, especially how √(4a²)=2|a| still leads to denominator 2a for negative a.',
    ],
    rubric: [
      'a≠0时两边除a、移常数、同加(b/(2a))²得(x+b/(2a))²=Δ/(4a²)。Δ≥0时x=−b/(2a)±√Δ/(2|a|)。a<0只交换正负两个分支，完整集合等于(−b±√Δ)/(2a)；不能声称|a|=a。Δ<0无实根，Δ=0只一个不同值。',
      'For a≠0 divide by a, move the constant and add (b/(2a))² to get (x+b/(2a))²=Δ/(4a²). For Δ≥0, x=−b/(2a)±√Δ/(2|a|). Negative a exchanges the two branches, giving the same full set as (−b±√Δ)/(2a); it does not make |a|=a. Negative Δ gives no real roots, zero Δ one distinct root.',
    ],
    misconception: [
      '把−b写成b；漏分母括号；忘记a=0或把√(a²)写a。',
      'Replacing −b by b, losing denominator grouping, ignoring a=0 or writing √(a²)=a.',
    ],
    prompts: [
      ['a、b、c来自整理后的哪三项？', 'Which collected terms supply a,b,c?'],
      [
        '负a是改变根集还是交换两条分支？',
        'Does negative a change the set or exchange its branches?',
      ],
    ],
  },
  {
    title: ['判别式与根的个数', 'Discriminant and number of roots'],
    objective: [
      '在a≠0前提下用判别式区分2、1、0个不同实根，并解释重根与窗口局限。',
      'Use the discriminant under a≠0 to distinguish 2,1,0 distinct real roots and explain repeated roots and window limits.',
    ],
    prerequisites: ['J92-L04'],
    keywords: [
      ['判别式', 'discriminant'],
      ['重根', 'repeated root'],
      ['不同实根', 'distinct real roots'],
    ],
    lab: 'quadratic-discriminant',
    hook: [
      '图像窗口里没有交点，能宣布没有实根吗？',
      'Can a graph with no visible crossing prove there are no real roots?',
    ],
    items: [
      count(
        [
          'x²−2x=0有几个不同实根？',
          'How many distinct real roots does x²−2x=0 have?',
        ],
        '2',
        [
          [
            'a=1,b=−2,c=0，Δ=4>0，根0、2。',
            'a=1,b=−2,c=0: Δ=4>0, roots zero and two.',
          ],
        ],
        ['0', '1'],
      ),
      count(
        [
          'x²−2x+1=0有几个不同实根？',
          'How many distinct real roots does x²−2x+1=0 have?',
        ],
        '1',
        [
          [
            'Δ=4−4=0，(x−1)²=0，唯一不同值1。',
            'Δ=4−4=0 and (x−1)²=0; one distinct value, one.',
          ],
        ],
        ['2', '0'],
      ),
      count(
        [
          'x²−2x+2=0有几个不同实根？',
          'How many distinct real roots does x²−2x+2=0 have?',
        ],
        '0',
        [
          [
            'Δ=4−8=−4<0，无实根；零是根的个数，不是x的根值。',
            'Δ=4−8=−4<0: no real roots. Zero is the count, not a root value.',
          ],
        ],
        ['1', '2'],
      ),
      count(
        [
          '(x−8)(x−10)=0，在横轴只显示−4到6时，方程仍有几个不同实根？',
          'For (x−8)(x−10)=0 with a displayed x-window −4 to 6, how many distinct real roots does the equation have?',
        ],
        '2',
        [
          [
            '展开x²−18x+80，Δ=324−320=4>0，根8、10在窗外，仍是两根。',
            'Expand to x²−18x+80: Δ=324−320=4>0. Roots eight and ten lie outside but still count.',
          ],
        ],
        ['0', '1'],
      ),
      classify(
        [
          '0x²+2x−4=0，能用二次判别式计根吗？先分类。',
          'Classify 0x²+2x−4=0 before discriminant counting.',
        ],
        'linear',
        [
          [
            'a=0，实际一次方程；即使b²=4，也不能推出两根。',
            'a=0 gives a linear equation. Even though b²=4, it does not imply two roots.',
          ],
        ],
        ['quadratic', 'identity'],
      ),
      count(
        [
          '3x²+6x+3=0有几个不同实根？',
          'How many distinct real roots does 3x²+6x+3=0 have?',
        ],
        '1',
        [
          [
            'Δ=36−36=0；3(x+1)²=0，只有−1一个不同值。',
            'Δ=36−36=0; 3(x+1)²=0 has only the distinct value −1.',
          ],
        ],
        ['2', '0'],
      ),
    ],
    pick: {
      stem: [
        'Δ=0且a≠0时哪种说法正确？',
        'For Δ=0 and a≠0, which statement is correct?',
      ],
      options: [
        ['没有实根', 'No real roots'],
        ['两个不同实根', 'Two distinct real roots'],
        [
          '一重合位置，对应一个不同实根',
          'One coincident position, giving one distinct real root',
        ],
      ],
      feedback: [
        ['根号为零仍有−b/(2a)。', 'A zero radical still gives −b/(2a).'],
        [
          '两个分支相等，不是两个不同数。',
          'The branches coincide rather than giving different numbers.',
        ],
        [
          '正确：二重根的不同数值计数为一。',
          'Correct: a double root counts as one distinct value.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '解释Δ三种符号与根数；为何窗内没点和a=0都不能直接套结论？',
      'Explain the three discriminant signs; why do an empty visible window and a=0 require care?',
    ],
    rubric: [
      'a≠0时公式中√Δ正、零、非实分别给两不同分支、一相同值、无实值。窗口只显示局部，(x−8)(x−10)=0的两根可在窗外。a=0时公式分母零、实际次数改变，应改按一次/恒等/矛盾分类，不能用b²正推两根。',
      'With a≠0, √Δ is positive, zero or not real, giving two different branches, one shared value or no real value. A window is local: both roots of (x−8)(x−10)=0 can be outside it. With a=0 the formula denominator vanishes and the degree changes; classify linear/identity/contradiction instead of inferring two roots from positive b².',
    ],
    misconception: [
      '重根重复计数；把无交点窗口当全局；忽略a≠0。',
      'Double-counting a repeated root, treating the visible window as global, or ignoring a≠0.',
    ],
    prompts: [
      [
        '你在数不同的值，还是公式的两个符号？',
        'Are you counting distinct values or two formula signs?',
      ],
      [
        '把窗口放宽会改变方程吗？',
        'Does widening the window change the equation?',
      ],
    ],
  },
  {
    title: ['二次模型应用', 'Quadratic modelling problems'],
    objective: [
      '从原数量关系建立二次模型，分开原式核验与正值、整数或区间条件筛选，并解释不可行情境。',
      'Build a quadratic from original quantities, separate substitution from positive/integer/interval checks, and explain infeasible contexts.',
    ],
    prerequisites: ['J92-L05', 'J73-L06'],
    keywords: [
      ['原数量模型', 'original quantity model'],
      ['定义域', 'domain'],
      ['可行解', 'feasible solution'],
    ],
    lab: 'quadratic-apply',
    hook: [
      '根代回正确，为什么仍可能不能作宽度或卡数？',
      'Why might a checked root still fail as a width or card count?',
    ],
    items: [
      item(
        [
          '虚构矩形宽x m、长x+3 m、面积40 m²，保留原面积两种数量列等式。',
          'A fictional rectangle is x m by x+3 m with area 40 m². Write its original quantity equation.',
        ],
        { kind: 'quadratic-equation', value: 'x(x+3)=40' },
        [
          [
            '面积=宽×长，故x(x+3)=40，且另记x>0；不能只交x=5。',
            'Area is width×length, so x(x+3)=40, with separate domain x>0. Do not submit only x=5.',
          ],
        ],
        ['x=5', 'x²+3x-40=0', 'x+x+3=40', 'x(x+3)=20'],
      ),
      roots(
        [
          '同一矩形方程的代数根为5、−8。仅写可作宽度的全部值（不附单位）。',
          'The rectangle equation has algebraic roots five and −8. Give all feasible widths without units.',
        ],
        ['5'],
        [
          [
            '5×8=40，−8×(−5)=40也成立，但负边长不合x>0，故宽5m。',
            '5×8=40 and (−8)(−5)=40, but negative dimensions fail x>0; width is 5 m.',
          ],
        ],
        ['5,-8', '-8', '40'],
      ),
      roots(
        [
          '五张完整卡排两个相同x×x正方阵，x须非负整数。2x²=5；写可行x，无则写 ∅ 或无可行解。',
          'Five whole cards must form two identical x×x square arrays, with x a nonnegative integer. For 2x²=5 give feasible x, or ∅ if none.',
        ],
        [],
        [
          [
            '代数根±√(5/2)=±√10/2；正根不是整数，不能四舍五入成2，故没有可行安排。',
            'Algebraic roots are ±√(5/2)=±√10/2. The positive root is not integral and cannot be rounded to two; no arrangement is feasible.',
          ],
        ],
        ['√10/2', '2', '1', '±√10/2'],
      ),
      roots(
        [
          '虚构信号x²−6x+5在0≤x≤2 min内何时为零？只写范围内x。',
          'When is the fictional signal x²−6x+5 zero in 0≤x≤2 min? Give only admissible x.',
        ],
        ['1'],
        [
          [
            '(x−1)(x−5)=0，代数根1、5；规定区间仅接受1min。',
            '(x−1)(x−5)=0 gives algebraic roots one and five; the interval accepts only 1 min.',
          ],
        ],
        ['1,5', '5', '0,2'],
      ),
      item(
        [
          '两个相同x×x完整卡阵共五张，按原卡数写等式。',
          'Two identical x×x whole-card arrays use five cards in total. Write the original count equation.',
        ],
        { kind: 'quadratic-equation', value: '2x²=5' },
        [
          [
            '每阵x²张，两阵2x²张与总数5相等；x非负整数另核。',
            'Each array has x² cards, hence 2x²=5. Check the nonnegative-integer domain separately.',
          ],
        ],
        ['x²=5', '2x=5', '2x²-5=0', 'x=2'],
      ),
      manual(
        [
          '虚构矩形宽x cm、长x+1 cm、面积2 cm²。写原模型、全部代数根、筛选与单位，并检查负根的两项条件。',
          'A fictional rectangle has width x cm, length x+1 cm and area 2 cm². Give the model, all algebraic roots, filtering and units, and both checks for the negative root.',
        ],
        [
          '模型x(x+1)=2，x>0；移项(x−1)(x+2)=0，代数根1、−2。1×2=2且正，宽1cm、长2cm；(−2)(−1)=2虽通过原等式，却违反正长度，不能保留。说明完整分支而非只猜1。',
          'Model x(x+1)=2 with x>0. Collect to (x−1)(x+2)=0, giving one and −2. One passes 1×2=2 and positivity, so width 1 cm and length 2 cm. (−2)(−1)=2 passes the equation but fails positive lengths. Explain the exhaustive branches rather than guessing one.',
        ],
      ),
    ],
    pick: {
      stem: [
        '一个根满足原等式，就一定是应用题的可行答案吗？',
        'Does satisfying the original equation guarantee a feasible contextual answer?',
      ],
      options: [
        ['是，代回即可', 'Yes, substitution suffices'],
        [
          '否，还要核原题正值、整数、区间等条件',
          'No; check original positivity, integrality or interval conditions',
        ],
        ['不是整数就四舍五入', 'Round any noninteger'],
      ],
      feedback: [
        [
          '代回只检查等式，不包含全部情境限制。',
          'Substitution checks the equation, not every context restriction.',
        ],
        [
          '正确：两项条件分别成立才接受。',
          'Correct: accept only after both checks pass.',
        ],
        [
          '四舍五入通常破坏原等式。',
          'Rounding usually breaks the original equation.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '区分“方程无实根”与“有实根但没有可行卡阵”，并解释为何原模型不能只交移项后的零式。',
      'Distinguish no real equation roots from real roots but no feasible card array; explain why the original model should not be replaced by a transposed zero form.',
    ],
    rubric: [
      '2x²=5有两实根±√10/2，但非负整数范围内没有值；这不是Δ<0。四舍五入到1或2分别用2或8张，并非5。原数量建模需清楚展示两阵卡数2x²与总数5；零式虽等价求解，未按题意保留两种来源数量。家长核数量来源、范围、代回和单位，不按术语评分。',
      '2x²=5 has two real roots ±√10/2 but none in the nonnegative integers; Δ is not negative. Rounding to one or two uses two or eight cards, not five. The original model shows two-array count 2x² equated to total five. A zero form is equivalent for solving but omits the requested quantity-source layout. Review sources, domain, substitution and units, not terminology.',
    ],
    misconception: [
      '把代回通过当范围通过；用近似整数挽救不可行方案；只交最后根代替建模。',
      'Confusing equation and domain checks, rounding to rescue infeasibility, or replacing modelling with final roots.',
    ],
    prompts: [
      [
        '等号每边是哪种原数量，单位一致吗？',
        'Which original quantity is on each side, and do units match?',
      ],
      [
        '这个根通过原式了吗？通过原题范围了吗？',
        'Does this root pass the original equation and the stated domain separately?',
      ],
    ],
  },
];
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const j92Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J92-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J09',
    unit: 'J92',
    order: i + 1,
    nzYearHints: [9, 10, 11],
    cnGradeHints: [9],
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
            '纸上设计一个虚构矩形标牌：选宽比长少1、2或3单位，再选面积。先写原数量模型和正长度范围，用两种方法求全部根并代回，给正根附单位，解释负根为何不能作边长。再设计一个有实根但无整数卡数的反例。家长检查来源、等价步骤和两项条件，不需购买、实测或上传。',
            'On paper design a fictional rectangular sign with length one, two or three units greater than width and a chosen area. Write its original model and positive-length domain. Solve by two methods, check all roots in the original, attach units to the feasible width and explain the rejected root. Add a whole-card counterexample with real roots but no integer count. A parent checks sources, equivalent steps and both conditions; no purchase, measurement or upload is needed.',
          ),
        }
      : {}),
  };
});
export function j92ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J92-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J92 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    u = (k % 9) - 4,
    v = (Math.floor(k / 9) % 9) - 4,
    p = (k % 5) + 1,
    n = (k % 7) + 1;
  let value: Item;
  if (i === 0 && k % 4 === 0) {
    const source = k % 8 === 0 ? 'x²+x=x²+3' : 'x²+1=x²';
    value = classify(
      [`合并后分类 ${source}。`, `Classify ${source} after collecting.`],
      k % 8 === 0 ? 'linear' : 'contradiction',
      [
        [
          k % 8 === 0 ? '二次项抵消得到x=3，一次方程。' : '抵消后1=0，矛盾。',
          k % 8 === 0
            ? 'Quadratic terms cancel to x=3, a linear equation.'
            : 'Cancellation gives contradiction 1=0.',
        ],
      ],
      ['quadratic'],
    );
  } else if (i <= 1) {
    const source = `(x-(${u}))(x-(${v}))=0`,
      values = [...new Set([String(u), String(v)])];
    value = roots(
      [
        `解 ${source}，给全部不同实根。`,
        `Solve ${source} for every distinct real root.`,
      ],
      values,
      [
        [
          `每个因子为零给${u}、${v}，相同值只列一次；不用除以未知式。`,
          `Each zero factor gives ${u} or ${v}; list an equal value once and do not divide by an unknown expression.`,
        ],
      ],
      ['99'],
    );
  } else if (i === 2 && k % 4 === 0)
    value = count(
      [
        `x²+${2 * p}x=${n}两边应同加多少？`,
        `What should be added to both sides of x²+${2 * p}x=${n}?`,
      ],
      String(p * p),
      [
        [
          `半系数${p}，平方${p * p}，两边同加。`,
          `Half-coefficient ${p} squared is ${p * p}; add on both sides.`,
        ],
      ],
      ['999'],
    );
  else if (i === 2 || i === 3) {
    const source =
        i === 2 ? `x²+${2 * p}x=${n}` : `${k % 2 ? -2 : 2}x²+(${u})x+(${v})=0`,
      s = solveQuadratic(source);
    value = roots(
      [
        `用${i === 2 ? '配方' : '公式'}解 ${source}，写精确完整实根。`,
        `Use ${i === 2 ? 'completing' : 'the formula'} to solve ${source} exactly for all real roots.`,
      ],
      s.roots!.map(radicalText),
      [
        [
          i === 2
            ? `两边加${p * p}，得(x+${p})²=${n + p * p}，取全分支后移去${p}。`
            : `a≠0，Δ=${textR(s.discriminant!)}；使用(−b±√Δ)/(2a)，负Δ无实根，零Δ只列一值。`,
          i === 2
            ? `Add ${p * p} on both sides: (x+${p})²=${n + p * p}. Take every real branch and subtract ${p}.`
            : `a≠0 and Δ=${textR(s.discriminant!)}. Use (−b±√Δ)/(2a); negative Δ gives no real roots, zero Δ one distinct value.`,
        ],
      ],
      ['99'],
    );
  } else if (i === 4) {
    const c = (k % 3) - 1,
      source = `(x-(${u}))²+(${c})=0`,
      s = solveQuadratic(source);
    value = count(
      [
        `二次方程 ${source} 有几个不同实根？`,
        `How many distinct real roots does the quadratic ${source} have?`,
      ],
      String(s.roots!.length),
      [
        [
          `Δ=${textR(s.discriminant!)}，按正二、零一、负零计不同值，窗口不改变计数。`,
          `Δ=${textR(s.discriminant!)}. Count two/one/zero distinct values for positive/zero/negative; window changes do not affect the count.`,
        ],
      ],
      ['99'],
    );
  } else {
    const area = n * (n + p),
      source = `x(x+${p})=${area}`;
    value =
      k % 4 === 0
        ? item(
            [
              `虚构矩形宽x、长x+${p}、面积${area}。保留原数量列等式。`,
              `A fictional rectangle has width x, length x+${p} and area ${area}. Write its original quantity equation.`,
            ],
            { kind: 'quadratic-equation', value: source },
            [
              [
                `宽乘长等于面积：${source}，另核x>0。`,
                `Width times length equals area: ${source}; separately require x>0.`,
              ],
            ],
            ['x=99'],
          )
        : roots(
            [
              `虚构矩形满足 ${source}，x是正宽度，只写可行x。`,
              `A fictional rectangle satisfies ${source}, where x is positive width. Give feasible x only.`,
            ],
            feasibleQuadraticRoots(source, 'positive'),
            [
              [
                `代数根${n}与${-n - p}均代回成立，但仅正根${n}作宽度。`,
                `Algebraic roots ${n} and ${-n - p} both pass substitution, but only positive ${n} is a width.`,
              ],
            ],
            ['-99'],
          );
  }
  return q(`${id}-R${round}`, i, value);
}
export const j92CheckQuestions: Question[] = [
  q(
    'J92-CHECK-Q1',
    0,
    classify(
      ['合并 x²+x=x²+2 后分类。', 'Classify x²+x=x²+2 after collecting.'],
      'linear',
      [['二次项相消，剩x=2。', 'The quadratic terms cancel to x=2.']],
      ['quadratic', 'identity'],
    ),
  ),
  q(
    'J92-CHECK-Q2',
    1,
    roots(
      ['解 x²−5x=0。', 'Solve x²−5x=0.'],
      ['0', '5'],
      [['x(x−5)=0，得到0与5。', 'x(x−5)=0 gives zero and five.']],
      ['5', '0'],
    ),
  ),
  q(
    'J92-CHECK-Q3',
    2,
    roots(
      ['配方解 x²+4x=1。', 'Complete the square to solve x²+4x=1.'],
      ['-2-√5', '-2+√5'],
      [['同加4得(x+2)²=5，根−2±√5。', 'Add four: (x+2)²=5, giving −2±√5.']],
      ['-2+√5', '2±√5'],
    ),
  ),
  q(
    'J92-CHECK-Q4',
    3,
    roots(
      ['公式解 −2x²+3x+2=0。', 'Use the formula for −2x²+3x+2=0.'],
      ['-1/2', '2'],
      [
        [
          'Δ=25，(−3±5)/(−4)，根−1/2与2。',
          'Δ=25 and (−3±5)/(−4) gives −1/2 and two.',
        ],
      ],
      ['1/2,-2', '2'],
    ),
  ),
  q(
    'J92-CHECK-Q5',
    4,
    count(
      [
        'x²+6x+9=0有几个不同实根？',
        'How many distinct real roots does x²+6x+9=0 have?',
      ],
      '1',
      [['Δ=36−36=0，唯一不同根−3。', 'Δ=36−36=0; only the distinct root −3.']],
      ['2', '0'],
    ),
  ),
  q(
    'J92-CHECK-Q6',
    5,
    manual(
      [
        '审查2x²=5在非负整数卡数范围内的解；能把正根舍入到2吗？',
        'Audit 2x²=5 for nonnegative integer card counts. May its positive root be rounded to two?',
      ],
      specs[5]!.rubric,
    ),
  ),
  pick('J92-CHECK-Q7', 1, specs[1]!.pick),
  q(
    'J92-CHECK-Q8',
    5,
    manual(
      [
        '用一个例子连起原数量建模、零式、配方或公式、判别式、全部根与情境筛选。',
        'Connect original modelling, zero form, completing or formula, discriminant, all roots and context filtering in one example.',
      ],
      [
        '如x(x+3)=40且x>0；零式x²+3x−40=0，Δ=169>0，两根(−3±13)/2=5、−8。两根均满足原面积等式；−8违反正长度，宽5m、长8m。另说明零积须右边零、配方两边同加或公式a≠0；家长阅读依据，不由最终5代替推理。',
        'For example x(x+3)=40 with x>0 gives x²+3x−40=0, Δ=169>0 and roots (−3±13)/2=5,−8. Both satisfy the original area equation; −8 fails positive lengths, giving width 5 m and length 8 m. Explain zero product’s zero right side, adding on both sides when completing, or the formula’s a≠0. A parent reads these reasons; a final five cannot replace them.',
      ],
    ),
  ),
];
