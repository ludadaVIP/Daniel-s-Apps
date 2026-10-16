import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { parabolaForms, type QuadraticForm } from '../parabolaModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  steps: Pair[];
  wrong: string[];
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  answer: AnswerSpec,
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ stem, answer, steps, wrong, diagram });
const N = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
  unit?: 'cm²',
) => I(stem, { kind: 'number', value, unit }, steps, wrong, diagram);
const C = (
  stem: Pair,
  value: 'up' | 'down' | 'not-quadratic',
  steps: Pair[],
  wrong: string[],
) => I(stem, { kind: 'parabola-class', value }, steps, wrong);
const P = (stem: Pair, value: string, steps: Pair[], wrong: string[]) =>
  I(stem, { kind: 'coordinate', value }, steps, wrong);
const F = (
  stem: Pair,
  value: string,
  form: QuadraticForm,
  steps: Pair[],
  wrong: string[],
) => I(stem, { kind: 'quadratic-form', value, form }, steps, wrong);
const R = (
  stem: Pair,
  values: string[],
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
) =>
  I(
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
const M = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, [rubric], []);
const skills = [
  'parabola-opening-and-scale',
  'parabola-vertex-and-symmetry',
  'quadratic-function-forms',
  'horizontal-intersection-equivalence',
  'quadratic-domain-optimum',
];
const hints: Pair[][] = [
  [
    ['先整理成ax²+bx+c，检查a≠0。', 'Collect ax²+bx+c and check a≠0 first.'],
    [
      'a的符号决定向上/向下；|a|比较同一离轴距离的高度差，不能由缩放后的外观猜。',
      'The sign of a determines opening. Compare |a| using output displacement at equal distances from the axis, not arbitrary screen zoom.',
    ],
  ],
  [
    [
      '配方为a(x−h)²+k；括号减h，顶点(h,k)。',
      'Complete as a(x−h)²+k: the bracket subtracts h and the vertex is (h,k).',
    ],
    [
      '一般式h=−b/(2a)，k=f(h)。对称轴是x=h，等距点h−d、h+d的平方项相同。',
      'In standard form h=−b/(2a), k=f(h). The axis is x=h; h−d and h+d give the same squared term.',
    ],
  ],
  [
    [
      '先确认对所有x等值，再检查指定结构。',
      'First verify identity for every x, then inspect the requested structure.',
    ],
    [
      '一般式展开合并，顶点式保留一个移位平方，因式形式保留一次因子乘积；根集相同不代表函数相同。',
      'Collect standard form, retain one shifted square in vertex form, or linear-factor products in factored form. Equal zero sets do not establish equal functions.',
    ],
  ],
  [
    [
      '原图y=f(x)与哪条水平线相交？',
      'Which horizontal line intersects the original y=f(x)?',
    ],
    [
      'f(x)=q的答案是交点横坐标；用代数精确核原式，重合只列一次，窗外根仍计入。',
      'For f(x)=q give intersection x-values, verify the original exactly, count a repeated value once and retain off-window roots.',
    ],
  ],
  [
    [
      '先说未知数、函数关系、单位和允许范围。',
      'State the input, function, units and allowed domain.',
    ],
    [
      '连续闭区间比较端点及区间内顶点；整数逐核允许值。最大输出与达到它的所有输入分开回答。',
      'On a closed interval compare endpoints and an in-range vertex; for integers audit all allowed inputs. Separate the largest output from every input attaining it.',
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
      { accepted: [v.answer.value], rejected: v.wrong },
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
    title: ['抛物线与开口方向', 'Parabolas and opening direction'],
    objective: [
      '用非零二次系数判断抛物线开口，在同一标尺比较形状，并识别a=0退化情形。',
      'Use the nonzero quadratic coefficient to determine opening, compare shape on common scales and identify degeneration at a=0.',
    ],
    prerequisites: ['J92-L01', 'J85-L01'],
    keywords: [
      ['抛物线', 'parabola'],
      ['开口方向', 'opening direction'],
      ['二次项系数', 'quadratic coefficient'],
    ],
    lab: 'parabola-opening',
    hook: [
      '把y=x²前的系数从正拖到负，经过零时发生什么？',
      'What happens as the coefficient of y=x² passes from positive through zero to negative?',
    ],
    items: [
      C(
        [
          'y=2x²开口向上、向下，还是非二次函数？',
          'Does y=2x² open up, open down or fail to be quadratic?',
        ],
        'up',
        [
          [
            '二次项系数2>0，平方项非负，开口向上。',
            'The quadratic coefficient 2>0 makes the parabola open up.',
          ],
        ],
        ['down', 'not-quadratic'],
      ),
      C(
        ['y=−(1/2)x²+3的开口方向？', 'What is the opening of y=−(1/2)x²+3?'],
        'down',
        [
          [
            'a=−1/2<0，向下；常数3移动位置，不改变开口。',
            'a=−1/2<0 gives down; constant three shifts the graph without changing opening.',
          ],
        ],
        ['up', 'not-quadratic'],
      ),
      N(
        ['y=2x²在x=−3时的函数值？', 'Find y=2x² at x=−3.'],
        '18',
        [
          [
            '先算(−3)²=9，再乘2得18，不是−18。',
            'First (−3)²=9, then multiply by two to get eighteen, not −18.',
          ],
        ],
        ['-18', '36', '-6'],
      ),
      C(
        [
          '整理y=0x²+2x+1后，用up/down/not-quadratic分类。',
          'Classify y=0x²+2x+1 as up, down or not-quadratic.',
        ],
        'not-quadratic',
        [
          [
            'a=0，实际y=2x+1，是一次函数而非抛物线。',
            'a=0 leaves y=2x+1, a linear function rather than a parabola.',
          ],
        ],
        ['up', 'down'],
      ),
      M(
        [
          '在同一标尺比较y=x²、y=2x²与y=−2x²；能用不同截图的“窄”判断a大小吗？',
          'Compare y=x², y=2x² and y=−2x² on common scales. Can apparent width across different screenshots determine a?',
        ],
        [
          '同一x=1时三值1、2、−2；|a|=2给相同离轴距离的纵向变化两倍，正负号决定开口并关于横轴反射。比较形状必须固定横纵标尺，跨缩放外观不能证明系数大小，a不是恒定斜率。',
          'At x=1 the outputs are one, two and −2. |a|=2 doubles output displacement at the same axis distance; its sign controls opening and reflects across the x-axis. Hold both scales fixed when comparing shape. Apparent width across zoom levels does not prove a coefficient, and a is not a constant slope.',
        ],
      ),
      C(
        [
          '新函数y=−2(x+1)²+4，判断开口。',
          'Determine the opening of y=−2(x+1)²+4.',
        ],
        'down',
        [
          [
            '非零平方项系数−2决定向下；平移不改变方向。',
            'The nonzero square coefficient −2 gives down; translation does not change opening.',
          ],
        ],
        ['up', 'not-quadratic'],
      ),
    ],
    pick: {
      stem: [
        '一般式y=ax²+bx+c何时是二次函数？',
        'When is y=ax²+bx+c a quadratic function?',
      ],
      options: [
        ['a≠0，b、c可为零', 'a≠0; b,c may be zero'],
        ['只要出现x²符号', 'Whenever x² appears'],
        ['a必须为正', 'Only when a is positive'],
      ],
      feedback: [
        [
          '正确：整理后必须有非零二次项。',
          'Correct: a nonzero quadratic term must survive collecting.',
        ],
        [
          '零系数或抵消可能使次数下降。',
          'Zero coefficients or cancellation can reduce the degree.',
        ],
        [
          '负a也有抛物线，只是开口向下。',
          'Negative a also gives a parabola, opening down.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '用平方非负解释a的正负与开口，并指出a=0和“a就是斜率”的问题。',
      'Use nonnegative squares to explain opening, including a=0 and the claim that a is the slope.',
    ],
    rubric: [
      '顶点式a(x−h)²+k中平方≥0。a>0输出≥k、a<0输出≤k，分别向上、向下；a=0后不能称二次函数或唯一抛物线顶点。相邻单位x的输出差会变化，如x²在0到1差1、1到2差3，故a不是恒定斜率。',
      'In a(x−h)²+k the square is nonnegative, giving y≥k for a>0 and y≤k for a<0. At a=0 this is not quadratic and has no unique parabola vertex. Unit-input output changes vary: x² rises by one from zero to one and by three from one to two, so a is not a constant slope.',
    ],
    misconception: [
      '用常数项或图像缩放判开口；把a当作恒定斜率。',
      'Using the constant or screen zoom to infer opening; treating a as a constant slope.',
    ],
    prompts: [
      [
        '二次项系数整理后还是非零吗？',
        'Is the collected quadratic coefficient nonzero?',
      ],
      [
        '比较的是相同x距离和相同标尺吗？',
        'Are the x-distances and axis scales the same?',
      ],
    ],
  },
  {
    title: ['顶点与对称轴', 'Vertex and axis of symmetry'],
    objective: [
      '读顶点式与配方求顶点，写竖直对称轴，并用等距输入解释对称。',
      'Read or complete the square for the vertex, state the vertical symmetry axis and explain equal-distance input symmetry.',
    ],
    prerequisites: ['J93-L01', 'J92-L03'],
    keywords: [
      ['顶点', 'vertex'],
      ['对称轴', 'axis of symmetry'],
      ['等距输入', 'equal-distance inputs'],
    ],
    lab: 'parabola-vertex',
    hook: [
      '(x−2)²何时最小：x=−2还是x=2？',
      'When is (x−2)² smallest: at x=−2 or x=2?',
    ],
    items: [
      P(
        ['写y=(x−2)²−1的顶点坐标。', 'Give the vertex of y=(x−2)²−1.'],
        '(2,-1)',
        [
          [
            'x=2时平方为零，最小输出−1，顶点(2,−1)。',
            'At x=2 the square is zero and the minimum output is −1; vertex (2,−1).',
          ],
        ],
        ['(-2,-1)', '(2,1)', '(-1,2)'],
      ),
      N(
        [
          'y=−2(x+3)²+5的轴为x=多少？只填数值。',
          'For y=−2(x+3)²+5, the axis is x=what? Enter only the value.',
        ],
        '-3',
        [
          [
            'x+3=x−(−3)，轴x=−3；负a只改变开口。',
            'x+3=x−(−3), so the axis is x=−3; negative a changes opening only.',
          ],
        ],
        ['3', '5', '-2'],
      ),
      P(
        [
          '配方求y=2x²−8x+3的顶点。',
          'Complete the square for the vertex of y=2x²−8x+3.',
        ],
        '(2,-5)',
        [
          [
            '2(x²−4x)+3=2[(x−2)²−4]+3=2(x−2)²−5。',
            '2(x²−4x)+3=2[(x−2)²−4]+3=2(x−2)²−5.',
          ],
        ],
        ['(4,3)', '(2,3)', '(-2,-5)'],
      ),
      N(
        [
          'y=2(x−2)²−5中，x=0与x=4的共同函数值是多少？',
          'For y=2(x−2)²−5, what common output occurs at x=0 and x=4?',
        ],
        '3',
        [
          [
            '两输入距轴x=2均为2，平方同为4，输出8−5=3。',
            'Both inputs are distance two from x=2, giving square four and output 8−5=3.',
          ],
        ],
        ['-5', '4', '-3'],
      ),
      P(
        [
          '写y=−(x+1)²+4的顶点，不把纵轴截距当作顶点。',
          'Give the vertex of y=−(x+1)²+4, distinguishing it from the y-intercept.',
        ],
        '(-1,4)',
        [
          [
            '顶点(−1,4)，而x=0的纵轴截距为3。',
            'The vertex is (−1,4), while the y-intercept at x=0 is three.',
          ],
        ],
        ['(0,4)', '(-1,3)', '(1,4)'],
      ),
      P(
        [
          '求y=−(1/2)x²+3x−2的顶点，保留分数。',
          'Find the vertex of y=−(1/2)x²+3x−2, retaining fractions.',
        ],
        '(3,5/2)',
        [
          [
            'h=−3/(2×(−1/2))=3；f(3)=−9/2+9−2=5/2。',
            'h=−3/(2×(−1/2))=3; f(3)=−9/2+9−2=5/2.',
          ],
        ],
        ['(-3,5/2)', '(3,-2)', '(5/2,3)'],
      ),
    ],
    pick: {
      stem: [
        'y=a(x−h)²+k，a≠0，对称轴是什么？',
        'For y=a(x−h)²+k, a≠0, what is the symmetry axis?',
      ],
      options: [
        ['点(h,k)', 'The point (h,k)'],
        ['竖直线x=h', 'The vertical line x=h'],
        ['水平线y=k', 'The horizontal line y=k'],
      ],
      feedback: [
        ['这是顶点，不是对称轴。', 'That is the vertex, not an axis.'],
        ['正确：h±d的平方相同。', 'Correct: h±d give identical squared terms.'],
        [
          '这是过顶点的水平线，通常不是此抛物线的对称轴。',
          'That horizontal line through the vertex is not its symmetry axis.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明h−d与h+d为何函数值相同，并纠正“x−2意味着顶点向左二”。',
      'Explain equal outputs at h−d and h+d, and correct the claim that x−2 shifts the vertex two left.',
    ],
    rubric: [
      '代入后两个平方分别为(−d)²和d²，均d²，故函数值同为ad²+k。x−2在x=2时为零，所以顶点横坐标2；顶点是(2,k)，轴是x=2。a=0时上述式子退化为常数，不能沿用唯一顶点结论。',
      'The squared inputs are (−d)² and d², both d², so outputs equal ad²+k. x−2 vanishes at x=2, hence vertex x-coordinate two. The vertex is (2,k), while the axis is x=2. At a=0 the function is constant and the unique-vertex conclusion no longer applies.',
    ],
    misconception: [
      '把括号符号直接照抄为h；把轴当点；用c直接作顶点高度。',
      'Copying the bracket sign as h, confusing an axis with a point, or treating c as vertex height.',
    ],
    prompts: [
      ['括号何时恰为零？', 'When is the bracket exactly zero?'],
      [
        '两个输入到轴的距离一样吗？',
        'Are both inputs equally far from the axis?',
      ],
    ],
  },
  {
    title: ['一般式、顶点式与因式形式', 'Standard, vertex and factored forms'],
    objective: [
      '用展开、配方与分解连接同一二次函数的三种形式，区分形式完成、实因子存在与函数恒等。',
      'Connect three forms by expansion, completing and factoring; distinguish completed form, real factor existence and function identity.',
    ],
    prerequisites: ['J93-L02', 'J92-L02', 'J92-L04'],
    keywords: [
      ['一般式', 'standard form'],
      ['顶点式', 'vertex form'],
      ['因式形式', 'factored form'],
    ],
    lab: 'parabola-forms',
    hook: [
      'x²−4x+3与2(x−1)(x−3)零点相同，曲线相同吗？',
      'Do x²−4x+3 and 2(x−1)(x−3) share a curve because they share zeros?',
    ],
    items: [
      F(
        [
          '把y=x²−4x+3改为顶点式，只写右侧。',
          'Rewrite y=x²−4x+3 in vertex form, entering only its right side.',
        ],
        '(x-2)²-1',
        'vertex',
        [
          [
            'x²−4x+4−1=(x−2)²−1，补四还要减四。',
            'x²−4x+4−1=(x−2)²−1; adding four inside requires compensating outside.',
          ],
        ],
        ['x²-4x+3', '(x+2)²-1', '(x-2)²+3'],
      ),
      F(
        [
          '把y=2(x−1)²−3改为一般式，只写右侧。',
          'Rewrite y=2(x−1)²−3 in standard form, entering only its right side.',
        ],
        '2x²-4x-1',
        'standard',
        [
          [
            '2(x²−2x+1)−3=2x²−4x−1，系数2分配到每项。',
            '2(x²−2x+1)−3=2x²−4x−1; distribute two to every term.',
          ],
        ],
        ['2(x-1)²-3', '2x²-2x-1', '2x²-4x+1'],
      ),
      F(
        [
          '把y=x²−4x+3改为因式形式，只写右侧。',
          'Rewrite y=x²−4x+3 in factored form, entering only its right side.',
        ],
        '(x-1)(x-3)',
        'factored',
        [
          [
            '根1、3给(x−1)(x−3)，展开中间项−4x、常数3。',
            'Roots one and three give (x−1)(x−3), expanding to middle term −4x and constant three.',
          ],
        ],
        ['x²-4x+3', '(x+1)(x+3)', '1,3'],
      ),
      M(
        [
          'x²+1没有整数因子就一定没有实因子吗？再用x²−2说明整数与实数范围的区别。',
          'Does failing to find integer factors prove x²+1 has no real factors? Contrast x²−2 to explain coefficient domains.',
        ],
        [
          '不能仅靠整数搜索下结论。x²+1对所有实数≥1，或Δ=−4<0，所以没有实零点，不能分为两个实一次因子。x²−2没有整数一次因子，却有实根±√2，可写(x−√2)(x+√2)。说明是在整数、有理数还是实数范围分解。',
          'Integer searching alone is insufficient. x²+1≥1 for every real input, or Δ=−4<0, so there are no real zeros and no two real linear factors. x²−2 lacks integer linear factors but has roots ±√2 and factors (x−√2)(x+√2) over the reals. State the coefficient domain.',
        ],
      ),
      F(
        ['把y=−2x²−8x+1改为顶点式。', 'Rewrite y=−2x²−8x+1 in vertex form.'],
        '-2(x+2)²+9',
        'vertex',
        [
          [
            '−2(x²+4x)+1=−2[(x+2)²−4]+1=−2(x+2)²+9。',
            '−2(x²+4x)+1=−2[(x+2)²−4]+1=−2(x+2)²+9.',
          ],
        ],
        ['-2x²-8x+1', '-2(x-2)²+9', '-2(x+2)²-7'],
      ),
      F(
        ['把y=2x²−4x−6改为因式形式。', 'Rewrite y=2x²−4x−6 in factored form.'],
        '2(x-3)(x+1)',
        'factored',
        [
          [
            '先提2，再x²−2x−3=(x−3)(x+1)；不能遗漏外系数。',
            'Extract two, then factor x²−2x−3=(x−3)(x+1); retain the outside coefficient.',
          ],
        ],
        ['(x-3)(x+1)', '2x²-4x-6', '2(x+3)(x-1)'],
      ),
    ],
    pick: {
      stem: [
        '有相同零点的两个二次函数一定相同吗？',
        'Must two quadratic functions with the same zeros be identical?',
      ],
      options: [
        ['是，零点决定所有系数', 'Yes; zeros determine every coefficient'],
        [
          '否，还要确定纵向系数，例如外系数a',
          'No; the vertical coefficient a must also be determined',
        ],
        ['只需在一个零点核对输出', 'Checking one zero is enough'],
      ],
      feedback: [
        [
          '非零倍数保留零点，却改变其他输出。',
          'A nonzero multiple preserves zeros but changes other outputs.',
        ],
        [
          '正确：x(x−1)与2x(x−1)在x=2时为2与4。',
          'Correct: x(x−1) and 2x(x−1) give two and four at x=2.',
        ],
        [
          '在零点两者都为零，不能区别。',
          'Both equal zero there, so that check cannot distinguish them.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用同一函数三种形式说明各自便于读什么，并以系数或展开核同一性，而不是只试几个点。',
      'Explain what each form of one function reveals, verifying identity by expansion or coefficients rather than a few samples.',
    ],
    rubric: [
      'x²−4x+3=(x−2)²−1=(x−1)(x−3)。一般式读纵轴截距3，顶点式读顶点(2,−1)和轴x=2，因式形式读零点1、3。逐项展开均得到同一系数(1,−4,3)，保证所有x相同；只看相同根集会漏外系数，例如两倍原函数。',
      'x²−4x+3=(x−2)²−1=(x−1)(x−3). Standard form reveals y-intercept three; vertex form gives (2,−1) and axis x=2; factored form gives zeros one and three. Expanding yields identical coefficients (1,−4,3), ensuring equality for every input. Equal zero sets miss an outside multiplier such as twice the function.',
    ],
    misconception: [
      '形式等值却未完成；配方补偿漏外系数；由相同零点断言相同函数。',
      'Equivalent but unfinished form, losing the outside multiplier when completing, or inferring function identity from equal zeros.',
    ],
    prompts: [
      [
        '这道题要读零点、顶点还是截距？',
        'Does this task need zeros, the vertex or the intercept?',
      ],
      [
        '展开后的三个系数逐一相同吗？',
        'Do all three expanded coefficients match?',
      ],
    ],
  },
  {
    title: ['用图像解二次方程', 'Solving quadratics graphically'],
    objective: [
      '把f(x)=q解释为原曲线与水平线交点，保留全部横坐标并用精确代数核验近似读图。',
      'Interpret f(x)=q as curve–horizontal-line intersections, retain every x-value and verify graph estimates with exact algebra.',
    ],
    prerequisites: ['J93-L03', 'J92-L05'],
    keywords: [
      ['水平目标线', 'horizontal target'],
      ['交点横坐标', 'intersection x-value'],
      ['精确核验', 'exact verification'],
    ],
    lab: 'parabola-intersections',
    hook: [
      'x²=2的解是2，还是曲线达到高度2时的两个输入？',
      'Are the solutions of x²=2 the number two or the two inputs where the curve reaches height two?',
    ],
    items: [
      R(
        [
          '原曲线y=x²−4x+3与y=0相交，写全部交点横坐标。',
          'Give every intersection x-value of y=x²−4x+3 and y=0.',
        ],
        ['1', '3'],
        [
          [
            '(x−1)(x−3)=0给1、3；交点为(1,0)、(3,0)，答案只填横坐标。',
            '(x−1)(x−3)=0 gives one and three; points are (1,0),(3,0), but enter only x-values.',
          ],
        ],
        ['1', '3', '0'],
        { kind: 'parabola', source: 'x²-4x+3', level: '0' },
      ),
      R(
        [
          '同一原曲线与y=−1相交，给全部不同x。',
          'For the same curve meeting y=−1, give every distinct x.',
        ],
        ['2'],
        [
          [
            '(x−2)²−1=−1即(x−2)²=0，只有x=2。',
            '(x−2)²−1=−1 means (x−2)²=0, giving only x=2.',
          ],
        ],
        ['-1', '2,2', '1,3'],
      ),
      R(
        [
          'y=x²−4x+3与y=−2相交吗？给全部实数x或∅。',
          'Give all real intersection x-values of y=x²−4x+3 and y=−2, or ∅.',
        ],
        [],
        [
          [
            '(x−2)²=−1，无实数满足；原曲线最小为−1。',
            '(x−2)²=−1 has no real solutions; the original curve’s minimum is −1.',
          ],
        ],
        ['0', '2', '-2'],
      ),
      R(
        [
          '解x²=2，给精确完整解集，非近似小数。',
          'Solve x²=2 with an exact complete set, not decimal estimates.',
        ],
        ['-√2', '√2'],
        [
          [
            '原y=x²与y=2交于(−√2,2)、(√2,2)，两个横坐标±√2。',
            'Original y=x² meets y=2 at (−√2,2),(√2,2), giving x-values ±√2.',
          ],
        ],
        ['√2', '-1.41,1.41', '2'],
      ),
      R(
        [
          'y=(x−8)(x−10)与横轴相交；即使窗口x≤6，也写全部x。',
          'Give all x-axis intersection inputs of y=(x−8)(x−10), even if the window ends at x=6.',
        ],
        ['8', '10'],
        [
          [
            '两因子零点8、10均在原窗外，窗口不改变方程。',
            'Both factor zeros eight and ten are outside the original window; the equation is unchanged.',
          ],
        ],
        ['∅', '8', '10'],
      ),
      R(
        [
          'y=(x−1)²+2与y=6相交，求全部横坐标。',
          'Find all intersection x-values of y=(x−1)²+2 and y=6.',
        ],
        ['-1', '3'],
        [
          [
            '(x−1)²=4，x−1=±2，故−1、3；交点纵坐标均6。',
            '(x−1)²=4 gives x−1=±2 and x=−1,3; both intersection ordinates are six.',
          ],
        ],
        ['6', '1', '-2,2'],
      ),
    ],
    pick: {
      stem: [
        '解原函数f(x)=q时，原图上的目标是什么？',
        'To solve f(x)=q on the original graph, what is the target?',
      ],
      options: [
        ['总是横轴y=0', 'Always the x-axis y=0'],
        [
          '水平线y=q，取全部交点横坐标',
          'Horizontal y=q, taking every intersection x-value',
        ],
        ['只取交点纵坐标q', 'Take only the ordinate q'],
      ],
      feedback: [
        [
          '只有q=0或另画差函数时才找零点。',
          'Use zeros only if q=0 or if graphing a separate difference function.',
        ],
        [
          '正确：高度给定，未知的是输入。',
          'Correct: the height is given and inputs are unknown.',
        ],
        [
          'q已经给出，不是所求输入。',
          'q is already supplied, not the unknown input.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较原图y=x²与y=2的交点，和差函数g(x)=x²−2的零点；为什么1.41不是精确解？',
      'Compare intersections of original y=x² with y=2 to zeros of g(x)=x²−2. Why is 1.41 not an exact solution?',
    ],
    rubric: [
      '两个方法都给横坐标±√2，但原交点纵坐标2，差图零点纵坐标0，必须说明画的是哪个函数。1.41²=1.9881不等于2，只是近似；精确根式平方恰为2。负根也要列，代回正确仍另需完整性说明。',
      'Both methods give x-values ±√2, but original intersections have ordinate two while difference-function zeros have ordinate zero. Identify which function is graphed. Since 1.41²=1.9881≠2, it is approximate; exact radical roots square to two. Retain the negative branch and justify completeness as well as substitution.',
    ],
    misconception: [
      '不管q是什么都找横轴；把交点纵坐标当答案；小数像素冒充精确根。',
      'Always seeking the x-axis, submitting the ordinate, or treating a decimal pixel estimate as an exact root.',
    ],
    prompts: [
      [
        '当前图画原函数还是差函数？',
        'Is this the original function or its difference from the target?',
      ],
      [
        '代回目标等式严格相等吗？',
        'Does the candidate satisfy the target equation exactly?',
      ],
    ],
  },
  {
    title: ['最值和实际应用', 'Maximum and minimum problems'],
    objective: [
      '由原数量建立二次函数，在连续闭区间或整数范围内比较完整候选，分别报告最值与全部达到输入。',
      'Model original quantities and compare complete candidates on closed intervals or integer domains, reporting the extremum and every attaining input separately.',
    ],
    prerequisites: ['J93-L04', 'J92-L06'],
    keywords: [
      ['最值', 'extremum'],
      ['允许范围', 'allowed domain'],
      ['达到最值的输入', 'attaining inputs'],
    ],
    lab: 'parabola-maximum',
    hook: [
      '顶点能给全实数最大值；实际允许的宽度或卡数也一定包含它吗？',
      'A vertex gives an unrestricted extremum; must the allowed widths or card counts include it?',
    ],
    items: [
      N(
        [
          '虚构矩形周长20 cm，宽x、长10−x，1≤x≤5。最大面积是多少cm²？',
          'A fictional rectangle has perimeter 20 cm, width x and length 10−x, with 1≤x≤5. Find its maximum area in cm².',
        ],
        '25',
        [
          [
            'A=x(10−x)=25−(x−5)²≤25，x=5在范围内且达到。',
            'A=x(10−x)=25−(x−5)²≤25; x=5 is allowed and attains it.',
          ],
        ],
        ['5', '20', '24'],
        {
          kind: 'parabola',
          source: 'x(10-x)',
          wide: true,
          domain: { lower: '1', upper: '5' },
        },
        'cm²',
      ),
      N(
        [
          '同一矩形在1≤x≤5时，最小面积是多少cm²？',
          'For the same rectangle on 1≤x≤5, what is its minimum area in cm²?',
        ],
        '9',
        [
          [
            '距顶点5最远的允许输入是1，面积1×9=9cm²；25是最大面积。',
            'The allowed input farthest from vertex five is one, giving area 1×9=9cm²; twenty-five is the maximum.',
          ],
        ],
        ['25', '1', '5'],
        undefined,
        'cm²',
      ),
      N(
        [
          '另限1≤x≤4，面积x(10−x)的最大值是多少cm²？',
          'Restrict to 1≤x≤4. What is the maximum of area x(10−x), in cm²?',
        ],
        '24',
        [
          [
            '区间外顶点5不可用；范围内越靠近5越大，端点x=4给4×6=24。',
            'Vertex five is unavailable. On this interval moving closer to five increases output; endpoint four gives 4×6=24.',
          ],
        ],
        ['25', '5', '9'],
        undefined,
        'cm²',
      ),
      N(
        [
          '完整卡数x∈{0,1,2,3,4,5}，虚构得分−x²+5x+1的最高分？',
          'For whole-card counts x∈{0,1,2,3,4,5}, find the highest fictional score −x²+5x+1.',
        ],
        '7',
        [
          [
            '连续顶点x=5/2不可作整数；所有得分1、5、7、7、5、1，最高7。',
            'The continuous vertex x=5/2 is not integral. All scores are 1,5,7,7,5,1; the maximum is seven.',
          ],
        ],
        ['29/4', '5/2', '3'],
      ),
      R(
        [
          '同一完整卡数得分模型，写所有获最高分的x。',
          'For the same whole-card score model, give every count attaining the maximum.',
        ],
        ['2', '3'],
        [
          [
            '2和3到5/2等距，得分均7；不能只留四舍五入后的3。',
            'Two and three are equally far from 5/2 and both score seven; retaining only rounded three loses a tie.',
          ],
        ],
        ['2', '3', '5/2'],
      ),
      M(
        [
          '虚构信号y=−x²+6x+1仅在0≤x≤2 min考察。给最大读数和全部达到时刻，解释不能用全实数顶点。',
          'A fictional signal y=−x²+6x+1 is studied only for 0≤x≤2 min. Give the maximum reading and all attaining times, explaining why the unrestricted vertex cannot be used.',
        ],
        [
          'y=10−(x−3)²，连续延伸顶点(3,10)在规定区间外。区间内距3最近的是x=2，输出9；端点0输出1，最大读数9单位，开始后2min达到。读数和时间单位分开，不把10或3当本题答案。',
          'y=10−(x−3)² has unrestricted vertex (3,10), outside the interval. The allowed input nearest three is two, giving nine; endpoint zero gives one. Maximum reading nine units occurs 2 min after the start. Separate output and time units; neither ten nor three answers this restricted problem.',
        ],
      ),
    ],
    pick: {
      stem: [
        '有限闭区间上的二次函数，求最值应怎样选候选？',
        'How should candidates be chosen for a quadratic on a finite closed interval?',
      ],
      options: [
        ['总是只用全实数顶点', 'Always use only the unrestricted vertex'],
        [
          '比较端点与区间内顶点；整数情境再核允许整数',
          'Compare endpoints and an in-range vertex; check allowed integers in count contexts',
        ],
        ['只试中点和一个端点', 'Try only the midpoint and one endpoint'],
      ],
      feedback: [
        ['顶点可能不在题设范围。', 'The vertex may lie outside the domain.'],
        [
          '正确：候选需完整且满足范围。',
          'Correct: candidates must be complete and admissible.',
        ],
        [
          '任意有限试点不能保证全局最优。',
          'Arbitrary trial points do not establish a global optimum.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '从周长20 cm推导矩形面积函数、正长度范围及最大面积，说明为何顶点能证明最优。',
      'Derive a rectangle’s area from perimeter 20 cm, state positive-length conditions and explain how its vertex proves optimality.',
    ],
    rubric: [
      '2(宽+长)=20，设宽x cm，长10−x cm，原正长度需0<x<10。面积A=x(10−x)=25−(x−5)²，单位cm²。平方≥0，故A≤25，x=5满足正长度且达到；若另限1≤x≤4，则顶点不可用，最大24在x=4。展示定义域如何改变答案，不能只凭几次试算。',
      'From 2(width+length)=20, set width x cm and length 10−x cm, with 0<x<10 for positive dimensions. A=x(10−x)=25−(x−5)² in cm². Nonnegative squares give A≤25, attained at allowed x=5. Under the extra restriction 1≤x≤4, the vertex is excluded and the maximum is twenty-four at x=4. Explain how the domain changes the answer rather than relying on a few trials.',
    ],
    misconception: [
      '不核定义域直接报顶点；混淆最值与横坐标；把半整数顶点舍入丢并列最优。',
      'Reporting a vertex without checking domain, confusing output with input, or rounding away tied integer optima.',
    ],
    prompts: [
      [
        '顶点输入在题设范围内吗？是整数吗？',
        'Is the vertex input in the stated domain and, if required, an integer?',
      ],
      [
        '你回答的是最大输出，还是达到它的所有输入？',
        'Are you reporting the largest output or all inputs attaining it?',
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
export const j93Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J93-L0${i + 1}`;
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
    unit: 'J93',
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
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上设计虚构20 cm周长矩形标牌，先列长宽和面积函数，再在1≤x≤5与1≤x≤4两个范围比较最大面积。用三种形式解释同一曲线，画原曲线与一个目标面积水平线，核所有交点和允许宽度。再设计整数卡数模型，找有两个并列最优输入的例子。家长核来源、范围、最优依据与单位；不需购买、真实测量或上传。',
            'On paper design a fictional rectangular sign of perimeter 20 cm. Model its dimensions and area, then compare maxima on 1≤x≤5 and 1≤x≤4. Explain one curve using three forms, intersect it with a chosen target-area line and check all intersections and allowed widths. Add a whole-card model with two tied optimal inputs. A parent checks sources, domain, optimality and units; no purchase, real measurement or upload is needed.',
          ),
        }
      : {}),
  };
});
export function j93ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J93-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J93 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    h = (k % 9) - 4,
    c = (Math.floor(k / 9) % 9) - 4,
    a = [-2, -1, 1, 2][k % 4]!,
    n = k % 5;
  let v: Item;
  if (i === 0) {
    const coef = [-3, -2, -1, 0, 0.5, 1, 2, 3][k % 8]!,
      source = `(${coef})(x-(${h}))²+(${c})`;
    v = C(
      [
        `判断y=${source}的开口或非二次函数。`,
        `Classify the opening or nonquadratic status of y=${source}.`,
      ],
      coef === 0 ? 'not-quadratic' : coef > 0 ? 'up' : 'down',
      [
        [
          `二次系数${coef}，正向上、负向下、零退化，移位不改变方向。`,
          `Quadratic coefficient ${coef}: positive opens up, negative down, zero degenerates; shifts do not change opening.`,
        ],
      ],
      ['left'],
    );
  } else if (i === 1) {
    const source = `(${a})(x-(${h}))²+(${c})`,
      general = parabolaForms(source).standard;
    v =
      k % 4 === 0
        ? N(
            [
              `y=${general}的轴x=多少？只填数值。`,
              `For y=${general}, the axis is x=what? Enter only its value.`,
            ],
            String(h),
            [
              [
                `配方回${source}，轴x=${h}。`,
                `Completing returns ${source}, so the axis is x=${h}.`,
              ],
            ],
            ['99'],
          )
        : P(
            [`求y=${general}的顶点。`, `Find the vertex of y=${general}.`],
            `(${h},${c})`,
            [
              [
                `配方为${source}，顶点(${h},${c})。`,
                `Complete to ${source}, giving vertex (${h},${c}).`,
              ],
            ],
            ['(99,99)'],
          );
  } else if (i === 2) {
    const u = (k % 7) - 3,
      w = (Math.floor(k / 7) % 7) - 3,
      source = `(${a})(x-(${u}))(x-(${w}))`,
      forms = parabolaForms(source),
      form = (['standard', 'vertex', 'factored'] as const)[k % 3]!,
      given = form === 'standard' ? source : forms.standard,
      value = forms[form]!;
    v = F(
      [
        `把y=${given}改为${form === 'standard' ? '一般式' : form === 'vertex' ? '顶点式' : '因式形式'}，只写右侧。`,
        `Rewrite y=${given} in ${form} form, entering only its right side.`,
      ],
      value,
      form,
      [
        [
          `展开系数一致；目标式${value}，不由相同零点替代恒等检查。`,
          `Expanded coefficients agree; the requested form is ${value}. Equal zeros alone do not establish identity.`,
        ],
      ],
      ['x²+99'],
    );
  } else if (i === 3) {
    const no = k % 5 === 4,
      target = no ? c - a : c + a * n,
      source = `(${a})(x-(${h}))²+(${c})`,
      values = no ? [] : n === 0 ? [String(h)] : [`${h}-√${n}`, `${h}+√${n}`];
    v = R(
      [
        `原曲线y=${source}与y=${target}相交，写全部精确横坐标。`,
        `Give every exact intersection x-value of original y=${source} and y=${target}.`,
      ],
      values,
      [
        [
          `整理得(x−(${h}))²=${no ? -1 : n}，${no ? '无实根' : n === 0 ? '平方零一值' : '取正负两分支'}；纵坐标${target}不是输入答案。`,
          `Collect to (x−(${h}))²=${no ? -1 : n}, ${no ? 'with no real roots' : n === 0 ? 'one value for a zero square' : 'taking both branches'}. Ordinate ${target} is not an input answer.`,
        ],
      ],
      ['99'],
    );
  } else if (k % 4 === 0) {
    const p = (k % 5) + 1,
      source = `-x²+${2 * p + 1}x+(${c})`,
      value = p * p + p + c;
    v = N(
      [
        `虚构得分y=${source}，整数0≤x≤${2 * p + 1}，最高分是多少？`,
        `For fictional score y=${source} at integer 0≤x≤${2 * p + 1}, what is the highest score?`,
      ],
      String(value),
      [
        [
          `连续顶点${p}+1/2不允许，邻近整数${p}、${p + 1}并列达到${value}。`,
          `The continuous vertex ${p}+1/2 is inadmissible; adjacent integers ${p},${p + 1} tie at ${value}.`,
        ],
      ],
      ['999'],
    );
  } else {
    const upper = (k % 5) + 1,
      vertex = (k % 9) - 2,
      best = Math.max(0, Math.min(upper, vertex)),
      source = `-(x-(${vertex}))²+(${c})`,
      least = Math.min(
        -vertex * vertex + c,
        -(upper - vertex) * (upper - vertex) + c,
      );
    v =
      k % 2 === 0
        ? N(
            [
              `虚构函数y=${source}，连续0≤x≤${upper}，最小值多少？`,
              `For fictional y=${source} on continuous 0≤x≤${upper}, what is its minimum value?`,
            ],
            String(least),
            [
              [
                `开口向下，最小值在距顶点更远的端点，比较两端得到${least}。`,
                `Opening down, the minimum is at a farthest endpoint. Comparing both endpoints gives ${least}.`,
              ],
            ],
            ['999'],
          )
        : R(
            [
              `虚构函数y=${source}，连续0≤x≤${upper}，写所有达到最大值的x。`,
              `For fictional y=${source} on continuous 0≤x≤${upper}, give every input attaining its maximum.`,
            ],
            [String(best)],
            [
              [
                `平方非负；允许区间最靠近${vertex}的唯一输入${best}达到最大。`,
                `By the square structure, the unique allowed input nearest ${vertex}, namely ${best}, attains the maximum.`,
              ],
            ],
            ['99'],
          );
  }
  return q(`${id}-R${round}`, i, v);
}
export const j93CheckQuestions: Question[] = [
  q(
    'J93-CHECK-Q1',
    0,
    C(
      ['y=−3(x−1)²+2开口如何？', 'What is the opening of y=−3(x−1)²+2?'],
      'down',
      [['a=−3<0，开口向下。', 'a=−3<0 gives downward opening.']],
      ['up', 'not-quadratic'],
    ),
  ),
  q(
    'J93-CHECK-Q2',
    1,
    P(
      ['求y=2x²−8x+3的顶点。', 'Find the vertex of y=2x²−8x+3.'],
      '(2,-5)',
      [
        [
          '配方得2(x−2)²−5，顶点(2,−5)。',
          'Complete to 2(x−2)²−5, giving (2,−5).',
        ],
      ],
      ['(2,3)', '(-2,-5)'],
    ),
  ),
  q(
    'J93-CHECK-Q3',
    2,
    F(
      [
        '把y=x²+2x−3改为顶点式，只写右侧。',
        'Rewrite y=x²+2x−3 in vertex form, entering only the right side.',
      ],
      '(x+1)²-4',
      'vertex',
      [['同加减1得(x+1)²−4。', 'Add and subtract one to get (x+1)²−4.']],
      ['x²+2x-3', '(x-1)²-4'],
    ),
  ),
  q(
    'J93-CHECK-Q4',
    3,
    R(
      [
        '原y=x²与y=3相交，写全部精确横坐标。',
        'Give all exact intersection x-values of original y=x² and y=3.',
      ],
      ['-√3', '√3'],
      [
        [
          'x²=3给±√3，交点纵坐标为3。',
          'x²=3 gives ±√3; intersection ordinates are three.',
        ],
      ],
      ['√3', '3'],
    ),
  ),
  q(
    'J93-CHECK-Q5',
    4,
    N(
      [
        '面积x(10−x)，1≤x≤4，最大面积数值？',
        'For area x(10−x) on 1≤x≤4, give the maximum value.',
      ],
      '24',
      [
        [
          '顶点5在外，x=4时面积24。',
          'Vertex five is outside; x=4 gives area twenty-four.',
        ],
      ],
      ['25', '4'],
    ),
  ),
  q(
    'J93-CHECK-Q6',
    4,
    M(
      [
        '完整卡数0≤x≤5，解释−x²+5x+1的最大得分及全部最优输入，和连续顶点比较。',
        'For whole-card counts 0≤x≤5, explain the maximum of −x²+5x+1 and every optimal input, comparing with the continuous vertex.',
      ],
      [
        '配方29/4−(x−5/2)²，连续最大29/4在5/2，但卡数不允许。整数2、3最近且同距1/2，得分均7；或完整列1、5、7、7、5、1。两个最优输入都要列，不只舍入到3。',
        'Complete to 29/4−(x−5/2)². The continuous maximum 29/4 at 5/2 is inadmissible. Integers two and three are both distance 1/2 away and score seven, or enumerate 1,5,7,7,5,1. Retain both tied inputs rather than rounding only to three.',
      ],
    ),
  ),
  pick('J93-CHECK-Q7', 2, specs[2]!.pick),
  q(
    'J93-CHECK-Q8',
    4,
    M(
      [
        '用同一函数连接三种形式、顶点轴、水平交点与有范围最值，说明哪些量是输入、哪些是输出。',
        'Use one function to connect three forms, vertex/axis, horizontal intersections and a constrained extremum, distinguishing inputs from outputs.',
      ],
      [
        '如y=x²−4x+3=(x−2)²−1=(x−1)(x−3)，a>0向上，顶点(2,−1)、轴x=2，原y=0交点横坐标1、3。若只允许0≤x≤1，顶点2不在内，最小输出0在x=1，最大输出3在x=0；说明区间内距2的平方变化。系数展开保证同函数，根集相同不能替代；原交点的纵坐标与输入另说。',
        'For example y=x²−4x+3=(x−2)²−1=(x−1)(x−3) opens up, with vertex (2,−1), axis x=2 and original y=0 intersection inputs one and three. On 0≤x≤1 the vertex is excluded: minimum output zero occurs at x=1, maximum three at x=0, by distance squared from two. Expanded coefficients establish identity; equal zeros alone do not. Distinguish intersection ordinate from input.',
      ],
    ),
  ),
];
