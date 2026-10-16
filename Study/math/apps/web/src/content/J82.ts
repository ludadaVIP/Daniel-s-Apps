import { t, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
import { parsePolynomial, polynomialText } from '../polynomialModels';
import {
  differenceFactor,
  perfectSquareFactor,
  quadraticSearch,
} from '../factorModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  variables: string[];
  mode: 'factor' | 'expand' | 'number';
  accepted: string[];
};
const F = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  variables = ['x'],
  accepted: string[] = [],
): Item => ({ stem, value, step, wrong, variables, mode: 'factor', accepted });
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
  'integer-common-factor',
  'complete-square-difference-factors',
  'perfect-square-factor-pattern',
  'integer-quadratic-product-sum',
  'factor-expansion-audit',
];
const hints: Pair[][] = [
  [
    [
      '系数找最大公因数，每个字母取所有项共同的最低次数。',
      'Find the greatest numerical common divisor and minimum shared exponent of each letter.',
    ],
    [
      '每一项都要包含公因子，括号内不再留可提整数公因子；展开还原，零取值不丢失。',
      'Every term must contain the factor. Extract remaining integer content and expand back, retaining zero inputs.',
    ],
  ],
  [
    [
      '先提公因子，再将两个完整项认作 A² 与 B²，注意是相减。',
      'Extract common factors first, then identify whole squares A² and B², with subtraction.',
    ],
    [
      '写 (A−B)(A+B)，再检查每个新括号是否还能在整数范围分解。',
      'Write (A−B)(A+B), then inspect every new bracket for further integer factorisation.',
    ],
  ],
  [
    [
      '核两端能否作平方，再核中项是否恰为正或负二倍乘积。',
      'Check square ends and whether the middle is exactly plus or minus twice their product.',
    ],
    [
      '负中项对应差的平方，末项仍正；三项有共同整数因子先提出，再展开回查。',
      'A negative middle gives a squared difference with a positive final square. Extract common integer content first and expand to check.',
    ],
  ],
  [
    [
      '对首项为 x² 的式子，找整数 r、s，积为常数、和为一次项系数。',
      'For a monic quadratic find integers r,s whose product is the constant and sum is the linear coefficient.',
    ],
    [
      '积与和同时满足才写 (x+r)(x+s)；常数零先提 x，范围限整数系数。',
      'Both conditions must hold before writing (x+r)(x+s). For zero constant extract x first; the scope is integer coefficients.',
    ],
  ],
  [
    [
      '完整展开候选因式，逐类比较原式的系数，不只看首尾。',
      'Expand every proposed factor pair and compare all coefficients, not just the ends.',
    ],
    [
      '恒等不等于分解完成；再查公因子和可分括号。一次吻合不证明恒等，反例可否证。',
      'Identity alone does not establish completion: inspect common factors and reducible brackets. One agreement cannot prove identity; a counterexample disproves it.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const value =
    item.mode === 'expand'
      ? polynomialText(parsePolynomial(item.value, item.variables)!)
      : item.value;
  const h: Pair[] =
    item.mode === 'number'
      ? [
          [
            '把指定 x 代入原式和主张，各自完整计算。',
            'Substitute the specified x into both source and proposal, calculating each fully.',
          ],
          [
            '按题目方向作差；数值不同能检错，相同不能证明所有输入恒等。',
            'Subtract in the requested direction. Different values reveal an error; matching values do not prove every input.',
          ],
        ]
      : item.mode === 'expand'
        ? [
            [
              '每项与另一因式每项配对，保留完整符号。',
              'Pair each term with every term of the other factor, retaining signs.',
            ],
            [
              '完成所有乘积，再合并同类项；此题要展开而非保留因式。',
              'Finish all products and collect like terms; this task requests expansion rather than factors.',
            ],
          ]
        : hints[i]!;
  const result = numeric(
    id,
    T(item.stem),
    value,
    skills[i]!,
    h.map(T),
    [T(item.step), T(h[1]!)],
    { accepted: [value, ...item.accepted], rejected: item.wrong },
  );
  result.answer =
    item.mode === 'factor'
      ? { kind: 'factorisation', value, variables: item.variables }
      : item.mode === 'number'
        ? { kind: 'number', value, formats: ['decimal', 'fraction'] }
        : {
            kind: 'polynomial',
            value,
            variables: item.variables,
            collected: true,
            finishedProduct: true,
          };
  result.misconceptionTags = [
    skills[i]!,
    'identity-versus-completion',
    'integer-coefficient-scope',
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
    title: ['提公因式', 'Taking out common factors'],
    objective: [
      '按所有项共同的数因子与最低字母次数提取最大公因式，并展开回查。',
      'Extract the greatest common factor using every term’s shared numerical divisor and minimum exponents, then expand to check.',
    ],
    prerequisites: ['J81-L01', 'J81-L02', 'P51-L05'],
    keywords: [
      ['公因式', 'common factor'],
      ['最低次数', 'minimum shared exponent'],
      ['分配律逆用', 'reverse distribution'],
    ],
    lab: 'factor-common',
    hook: [
      '6x²+12x 的每项都含 6x 吗？只提出 3x 后是否还有共同因子？',
      'Does every term of 6x²+12x contain 6x? After extracting 3x, is anything still shared?',
    ],
    items: [
      F(
        [
          '在整数系数范围完整分解 6x²+12x，提出最大公因式。',
          'Factor 6x²+12x completely over integer coefficients, extracting the greatest common factor.',
        ],
        '6x(x+2)',
        [
          '系数公因数六，最低 x 次数一，余 x+2；展开为原式。',
          'The numerical divisor is six and the minimum x exponent one; x+2 remains and expands back.',
        ],
        ['3x(2x+4)', '6(x^2+2x)', '6x^2+12x'],
        ['x'],
        ['6(x+2)x', '-6x(-x-2)'],
      ),
      F(
        [
          '在整数系数范围完整分解 −6x²+9x。',
          'Factor −6x²+9x completely over integer coefficients.',
        ],
        '-3x(2x-3)',
        [
          '共同三 x，可提负三 x，余 2x−3；两项都还原。',
          'Extract −3x, leaving 2x−3, and recover both signed terms.',
        ],
        ['-3x(2x+3)', '3(-2x^2+3x)', '-6x^2+9x'],
        ['x'],
        ['3x(3-2x)'],
      ),
      F(
        [
          '在整数系数范围完整分解 8x²y−12xy²。',
          'Factor 8x²y−12xy² completely over integer coefficients.',
        ],
        '4xy(2x-3y)',
        [
          '系数公因数四，x 与 y 的共同最低次数都一。',
          'The coefficient divisor is four; the minimum shared exponent is one for both x and y.',
        ],
        ['4x(2xy-3y^2)', '4xy(2x+3y)', '8x^2y-12xy^2'],
        ['x', 'y'],
      ),
      F(
        [
          '在整数系数范围完整分解 6x³+9x²。',
          'Factor 6x³+9x² completely over integer coefficients.',
        ],
        '3x^2(2x+3)',
        [
          '数因子三，x 的共同次数二，余 2x+3。',
          'Extract numerical factor three and x², leaving 2x+3.',
        ],
        ['3x(2x^2+3x)', '3x^2(2x+9)', '6x^3+9x^2'],
      ),
      F(
        [
          '在整数系数范围完整分解 10x²−15x。',
          'Factor 10x²−15x completely over integer coefficients.',
        ],
        '5x(2x-3)',
        [
          '五 x 乘 2x 与负三，逐项还原。',
          '5x multiplies 2x and −3 to recover the source terms.',
        ],
        ['5(2x^2-3x)', '5x(2x+3)', '10x^2-15x'],
      ),
      F(
        [
          '在整数系数范围完整分解 4xy+8y²。',
          'Factor 4xy+8y² completely over integer coefficients.',
        ],
        '4y(x+2y)',
        [
          '共同四 y，不是四 x；第一项的 x 留在括号里。',
          'The common factor is 4y, not 4x; x remains inside from the first term.',
        ],
        ['4(xy+2y^2)', '4x(y+2y)', '4xy+8y^2'],
        ['x', 'y'],
      ),
    ],
    pick: {
      stem: [
        '关于 6x²+12x，哪条判断正确？',
        'Which statement about 6x²+12x is correct?',
      ],
      options: [
        [
          '6x² 是每项的整数单项式因子',
          '6x² is an integer monomial factor of every term',
        ],
        [
          '6x 是最大公因式，3x 只是一个公因式',
          '6x is greatest; 3x is common but not greatest',
        ],
        ['提 x 必须排除 x=0', 'Extracting x requires x≠0'],
      ],
      feedback: [
        [
          '第二项只有一个 x，不能整数整式除出 x²。',
          'The second term has only one x, not two.',
        ],
        [
          '两系数公因数六，最低 x 次数一。',
          'The coefficient GCD is six and minimum x exponent one.',
        ],
        [
          '这是恒等改写，没有将方程两边除 x。',
          'This is an identity rewrite, not dividing an equation by x.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释 6x²+12x 为何提 6x 而非 6x²，并说明 x=0 是否仍满足分解关系。',
      'Explain why the shared factor is 6x rather than 6x², and whether the identity retains x=0.',
    ],
    rubric: [
      '六与十二的最大公因数六；两项的 x 次数为二与一，共同只能取一。分别写成 6x·x 与 6x·2，合得 6x(x+2)。若只提 3x，括号 2x+4 还有数因子二；提 6x² 会让第二项余 2/x，不再是整式。x=0 时两边都零，因为分解只是逆用分配律，不是取消非零因子求解。家长逐项核对共同性、最大性和展开。',
      'The coefficient GCD is six and minimum x exponent one. Write 6x·x and 6x·2, giving 6x(x+2). Extracting only 3x leaves numerical content two; extracting 6x² would leave 2/x, not a polynomial. At x=0 both sides remain zero because reverse distribution is an identity, not cancellation in an equation. Check commonness, greatest content and full expansion.',
    ],
    misconception: [
      '只看首项、取最高次数、漏括号常数、把提取当除法丢零值。',
      'Using only the first term, taking maximum exponents, losing a remainder constant, or dropping zero inputs through cancellation.',
    ],
    prompts: [
      [
        '每一项都真正含这个因子吗？',
        'Does every term actually contain that factor?',
      ],
      ['展开后能还原每一项吗？', 'Does expansion recover every term?'],
    ],
  },
  {
    title: ['平方差分解', 'Factoring a difference of squares'],
    objective: [
      '先提公因式，识别平方差并继续检查因式，明确整数范围。',
      'Extract common factors, recognise a difference of squares and inspect the remaining factors within integer scope.',
    ],
    prerequisites: ['J82-L01', 'J81-L05'],
    keywords: [
      ['平方差', 'difference of squares'],
      ['和差因式', 'conjugate factors'],
      ['继续分解', 'continuing factorisation'],
    ],
    lab: 'factor-difference',
    hook: [
      'x²−9 与 x²+9 能用同一公式吗？x⁴−16 分成两个括号就一定结束了吗？',
      'Can x²−9 and x²+9 use the same formula? Is x⁴−16 finished as soon as two brackets appear?',
    ],
    items: [
      F(
        [
          '在整数系数范围完整分解 x²−9。',
          'Factor x²−9 completely over integer coefficients.',
        ],
        '(x-3)(x+3)',
        [
          '九为三平方，和差乘积的交叉项相消。',
          'Nine is three squared; the conjugate cross terms cancel.',
        ],
        ['(x-3)^2', '(x-9)(x+9)', 'x^2-9'],
        ['x'],
        ['(x+3)(x-3)', '(3-x)(-x-3)'],
      ),
      F(
        [
          '在整数系数范围完整分解 4x²−25。',
          'Factor 4x²−25 completely over integer coefficients.',
        ],
        '(2x-5)(2x+5)',
        [
          '两个整体是 2x 与五，不是四 x 与二十五。',
          'The whole square roots are 2x and five, not 4x and twenty-five.',
        ],
        ['(x-5)(4x+5)', '(2x-5)^2', '4x^2-25'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−y²。',
          'Factor x²−y² completely over integer coefficients.',
        ],
        '(x-y)(x+y)',
        [
          '两个完整字母项平方相减，写和乘差。',
          'Use the conjugate product for two whole squared terms.',
        ],
        ['(x-y)^2', '(x+y)^2', 'x^2-y^2'],
        ['x', 'y'],
      ),
      F(
        [
          '在整数系数范围完整分解 x⁴−16，检查新因式。',
          'Factor x⁴−16 completely over integer coefficients, inspecting the new factors.',
        ],
        '(x-2)(x+2)(x^2+4)',
        [
          '先得 (x²−4)(x²+4)，前者继续平方差；后者在整数范围不继续。',
          'First obtain (x²−4)(x²+4); split the former again. The latter stays over integers.',
        ],
        ['(x^2-4)(x^2+4)', '(x-4)(x+4)', 'x^4-16'],
      ),
      F(
        [
          '在整数系数范围完整分解 2x²−18，先找公因子。',
          'Factor 2x²−18 completely over integer coefficients, starting with common content.',
        ],
        '2(x-3)(x+3)',
        [
          '先提二，括号 x²−9 再作平方差。',
          'Extract two, then factor x²−9 as a difference of squares.',
        ],
        ['2(x^2-9)', '(2x-3)(x+3)', '2x^2-18'],
      ),
      F(
        [
          '在整数系数范围完整分解 9x²−4。',
          'Factor 9x²−4 completely over integer coefficients.',
        ],
        '(3x-2)(3x+2)',
        [
          '整体三 x 与二分别平方，交叉项相消。',
          'Use whole terms 3x and two; opposite cross terms cancel.',
        ],
        ['(3x-2)^2', '(9x-2)(x+2)', '9x^2-4'],
      ),
    ],
    pick: {
      stem: [
        '哪一个可直接作平方差分解？',
        'Which is directly a difference of squares?',
      ],
      options: [
        ['x²−16', 'x²−16'],
        ['x²+16', 'x²+16'],
        ['(x−4)²', '(x−4)²'],
      ],
      feedback: [
        [
          '两个平方相减，对应 x 与四。',
          'It subtracts two squares with whole terms x and four.',
        ],
        ['这是平方和，符号不符合。', 'This is a sum of squares.'],
        [
          '这是差的平方，不能改成 x²−16。',
          'This is a squared difference, not x²−16.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '用 x⁴−16 说明为什么要继续检查因式，再比较 x²−9 与 x²+9 的符号条件。',
      'Use x⁴−16 to explain continued factor checking, then compare the sign conditions of x²−9 and x²+9.',
    ],
    rubric: [
      'x⁴−16=(x²−4)(x²+4)，前因式再作平方差成 (x−2)(x+2)，最终三因式；x²+4 在本课整数系数范围保留。x²−9=(x−3)(x+3)，交叉项相消且常数负九；平方和 x²+9 不能套同一结果。一般整数分解范围要说清，不把“本方法不适用”当所有数域的无限结论。展开三因式可先合并前两项为 x²−4，再乘 x²+4 回到原式。',
      'x⁴−16=(x²−4)(x²+4), then split the first factor into x−2 and x+2. Retain x²+4 within integer scope. x²−9 has conjugate factors with constant product −9; x²+9 cannot use them. State the number domain rather than treating a method’s failure as a universal impossibility. Expanding the three factors recovers x⁴−16.',
    ],
    misconception: [
      '平方和套平方差、把系数当平方根、两个括号出现就结束。',
      'Applying the formula to square sums, confusing coefficients with square roots, or stopping at the first two brackets.',
    ],
    prompts: [
      ['两个完整平方项分别是什么？', 'What are the two whole squared terms?'],
      [
        '新括号还能用本单元方法分吗？',
        'Can any new bracket be split further by these methods?',
      ],
    ],
  },
  {
    title: ['完全平方分解', 'Factoring perfect squares'],
    objective: [
      '同时核对两端平方与中项二倍乘积，提公因式后写成整体平方。',
      'Check both square ends and twice-product middle, extracting common content before writing a whole square.',
    ],
    prerequisites: ['J82-L01', 'J81-L04'],
    keywords: [
      ['中项核验', 'middle-term check'],
      ['完全平方', 'perfect square'],
      ['重复因式', 'repeated factor'],
    ],
    lab: 'factor-square',
    hook: [
      'x²+6x+9 与 x²+4x+9 两端相同，为什么不能都写成 (x+3)²？',
      'With the same end squares, why cannot both x²+6x+9 and x²+4x+9 equal (x+3)²?',
    ],
    items: [
      F(
        [
          '在整数系数范围完整分解 x²+6x+9。',
          'Factor x²+6x+9 completely over integer coefficients.',
        ],
        '(x+3)^2',
        [
          '两端 x²、三平方，中项 2·x·3=6x。',
          'The ends are x² and three squared; twice x times three is 6x.',
        ],
        ['(x-3)^2', 'x(x+6)+9', 'x^2+6x+9'],
        ['x'],
        ['(x+3)(x+3)'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−8x+16。',
          'Factor x²−8x+16 completely over integer coefficients.',
        ],
        '(x-4)^2',
        [
          '中项为 −2·x·4，末项仍正十六。',
          'The middle is −2·x·4 and the final square positive sixteen.',
        ],
        ['(x+4)^2', '(x-4)(x+4)', 'x^2-8x+16'],
      ),
      F(
        [
          '在整数系数范围完整分解 4x²−12x+9。',
          'Factor 4x²−12x+9 completely over integer coefficients.',
        ],
        '(2x-3)^2',
        [
          '完整首项 2x，二倍乘三带负号为 −12x。',
          'The whole first term is 2x; negative twice its product with three is −12x.',
        ],
        ['(4x-3)^2', '(2x+3)^2', '4x^2-12x+9'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−2xy+y²。',
          'Factor x²−2xy+y² completely over integer coefficients.',
        ],
        '(x-y)^2',
        [
          '中项恰为 −2xy，差平方展开还原三项。',
          'The middle is exactly −2xy; a squared difference restores all three terms.',
        ],
        ['(x-y)(x+y)', '(x+y)^2', 'x^2-2xy+y^2'],
        ['x', 'y'],
      ),
      F(
        [
          '在整数系数范围完整分解 2x²+12x+18。',
          'Factor 2x²+12x+18 completely over integer coefficients.',
        ],
        '2(x+3)^2',
        [
          '先提二，余 x²+6x+9 再写成 (x+3)²。',
          'Extract two, then recognise x²+6x+9 as (x+3)².',
        ],
        ['2(x^2+6x+9)', '(2x+6)(x+3)', '2(x-3)^2'],
      ),
      F(
        [
          '在整数系数范围完整分解 9x²+6x+1。',
          'Factor 9x²+6x+1 completely over integer coefficients.',
        ],
        '(3x+1)^2',
        [
          '首项整体三 x，中项二倍三 x 乘一为六 x。',
          'The whole first term is 3x; twice its product with one is 6x.',
        ],
        ['(9x+1)^2', '(3x-1)^2', '9x^2+6x+1'],
      ),
    ],
    pick: {
      stem: [
        '识别 x²−6x+9 时，哪条检查不可少？',
        'Which check is essential for x²−6x+9?',
      ],
      options: [
        ['只看第一项是 x²', 'Only check the first term x²'],
        ['只看常数是九', 'Only check constant nine'],
        ['中项必须是 −2·x·3', 'The middle must be −2·x·3'],
      ],
      feedback: [
        [
          '第一项平方不保证整个三项式是平方。',
          'A squared first term does not establish a perfect-square trinomial.',
        ],
        [
          '末项平方仍不足以判结构。',
          'A squared final term is still insufficient.',
        ],
        [
          '两端与中项同时匹配才能写 (x−3)²。',
          'Both ends and the middle must match before writing (x−3)².',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较 x²−6x+9 与 x²−4x+9，说明完整平方核对和整数范围；再解释 2x²+12x+18 的先后步骤。',
      'Compare x²−6x+9 with x²−4x+9, then explain the steps for 2x²+12x+18.',
    ],
    rubric: [
      '前式两端平方且中项 −2·x·3，成 (x−3)²；后式中项负四 x 不符，不能为了套公式改成负六 x，也不能因两端平方就宣称完全平方。本课整数系数范围内识别具体结构，不把方法失败泛化。第三式先提出二，余 x²+6x+9，再成 2(x+3)²；(2x+6)(x+3) 虽等值，前因式还留公因数二，应移到外部。展开回查首项、交叉项、常数及总体倍数。',
      'The first matches −2·x·3 and equals (x−3)²; the second has the wrong middle and cannot be changed to fit. Square ends alone are insufficient. State integer scope without universalising a failed pattern. Extract two from the third expression, then recognise 2(x+3)². Although (2x+6)(x+3) is equivalent, numerical content two remains in a nonconstant factor. Check every expanded coefficient and the overall multiplier.',
    ],
    misconception: [
      '只看两端、负中项却选加号、复合系数不平方、外公因数丢失。',
      'Checking only ends, choosing plus for a negative middle, failing to square whole coefficients, or losing outside content.',
    ],
    prompts: [
      ['二倍乘积算出来究竟是多少？', 'What is twice the full product?'],
      [
        '三个系数还有共同数因子吗？',
        'Do all three coefficients share numerical content?',
      ],
    ],
  },
  {
    title: ['简单二次三项式分解', 'Factoring simple quadratics'],
    objective: [
      '在首项系数为一的整数二次式中，同时用积与和寻找两个一次因式。',
      'Factor monic integer quadratics by simultaneously matching the product and sum of two integer offsets.',
    ],
    prerequisites: ['J82-L01', 'J81-L03'],
    keywords: [
      ['首项系数一', 'monic quadratic'],
      ['积与和', 'product and sum'],
      ['整数因式', 'integer factors'],
    ],
    lab: 'factor-quadratic',
    hook: [
      'x²+5x+6 中，乘积六的 1 和 6 为什么不行？还需核哪个数？',
      'Why do 1 and 6 fail for x²+5x+6 despite product six? What else must match?',
    ],
    items: [
      F(
        [
          '在整数系数范围完整分解 x²+5x+6。',
          'Factor x²+5x+6 completely over integer coefficients.',
        ],
        '(x+2)(x+3)',
        [
          '二与三乘六、加五，两条件同时符合。',
          'Two and three multiply to six and add to five.',
        ],
        ['(x+1)(x+6)', 'x^2+5x+6', 'x(x+5)+6'],
        ['x'],
        ['(x+3)(x+2)'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²+x−6。',
          'Factor x²+x−6 completely over integer coefficients.',
        ],
        '(x+3)(x-2)',
        [
          '三与负二积负六、和一。',
          'Three and −2 multiply to −6 and add to one.',
        ],
        ['(x-3)(x+2)', '(x+6)(x-1)', 'x^2+x-6'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−5x+6。',
          'Factor x²−5x+6 completely over integer coefficients.',
        ],
        '(x-2)(x-3)',
        [
          '负二与负三积正六、和负五。',
          '−2 and −3 multiply to positive six and add to −5.',
        ],
        ['(x+2)(x+3)', '(x-1)(x-6)', 'x^2-5x+6'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−x−6。',
          'Factor x²−x−6 completely over integer coefficients.',
        ],
        '(x-3)(x+2)',
        [
          '负三与二积负六、和负一。',
          '−3 and two multiply to −6 and add to −1.',
        ],
        ['(x+3)(x-2)', '(x-6)(x+1)', 'x^2-x-6'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²+4x。',
          'Factor x²+4x completely over integer coefficients.',
        ],
        'x(x+4)',
        [
          '常数零，先提共同 x，余 x+4；零输入不丢。',
          'With zero constant extract x, leaving x+4 while retaining input zero.',
        ],
        ['x^2+4x', '4x(x+1)', 'x(x+2)^2'],
      ),
      F(
        [
          '在整数系数范围完整分解 x²−2x−8。',
          'Factor x²−2x−8 completely over integer coefficients.',
        ],
        '(x-4)(x+2)',
        [
          '负四与二积负八、和负二。',
          '−4 and two multiply to −8 and add to −2.',
        ],
        ['(x+4)(x-2)', '(x-8)(x+1)', 'x^2-2x-8'],
      ),
    ],
    pick: {
      stem: [
        '从 x²+px+q 写成 (x+r)(x+s)，r、s 要满足什么？',
        'For x²+px+q=(x+r)(x+s), which constraints must r,s satisfy?',
      ],
      options: [
        ['只需 rs=q', 'Only rs=q'],
        ['rs=q 且 r+s=p', 'Both rs=q and r+s=p'],
        ['r+s=q 且 rs=p', 'r+s=q and rs=p'],
      ],
      feedback: [
        [
          '只匹配常数会漏掉中项。',
          'Matching only the constant misses the middle coefficient.',
        ],
        [
          '展开得到 x²+(r+s)x+rs，两类系数都要匹配。',
          'Expansion gives x²+(r+s)x+rs, requiring both matches.',
        ],
        [
          '把中项系数和常数的角色交换了。',
          'The roles of the linear coefficient and constant are reversed.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用完整展开推导“积与和”条件，解释 x²+x−6 的符号选择，再说明常数为零与无整数配对时的结论范围。',
      'Derive the product-and-sum constraints, explain signs for x²+x−6, and discuss zero constants and a missing integer pair.',
    ],
    rubric: [
      '(x+r)(x+s)=x²+(r+s)x+rs，所以两条件同时必要；本课首项系数一且要求整数 r、s。常数负六意味着异号，三与负二和一，得 (x+3)(x−2)。常数零先提 x，不需要列无穷多积零对。完整检查所有整数乘积对后若无匹配，只能说不能分成此整数一次因式形式，不是任何实数或其他数域都不可分。展开逐项对比而非仅试一个 x。',
      'Distribution gives x²+(r+s)x+rs, so both constraints are necessary for this monic integer setting. A negative constant −6 needs opposite signs; three and −2 sum to one. For zero constant extract x rather than listing infinitely many product-zero pairs. Exhausting integer product pairs can rule out two integer linear factors, not factorisation over every number domain. Compare expanded coefficients rather than only one input.',
    ],
    misconception: [
      '只匹配积、和与积交换、负常数取同号、无整数配对就泛称永不可分。',
      'Matching only products, swapping sum and product, using same signs for negative constants, or universalising missing integer factors.',
    ],
    prompts: [
      ['这对数的积与和分别是什么？', 'What are this pair’s product and sum?'],
      [
        '当前首项系数与数域范围是什么？',
        'What are the leading coefficient and number domain here?',
      ],
    ],
  },
  {
    title: ['分解与展开互相检查', 'Checking factorisation by expansion'],
    objective: [
      '逐项展开并核所有系数，再检查整数范围是否分解完整，区分试数与恒等证据。',
      'Expand and compare every coefficient, then audit completion over integers, distinguishing numerical checks from proof.',
    ],
    prerequisites: ['J82-L02', 'J82-L03', 'J82-L04'],
    keywords: [
      ['展开回查', 'expansion check'],
      ['分解完整', 'complete factorisation'],
      ['恒等证据', 'evidence of identity'],
    ],
    lab: 'factor-check',
    hook: [
      '2(x²−9) 展开正确，为什么还未完成分解？两式在 x=0 相等，就对所有 x 都相等吗？',
      'Why is 2(x²−9) unfinished despite a correct expansion? Does agreement at x=0 establish every input?',
    ],
    items: [
      F(
        [
          '在整数系数范围完整分解 2x²−18；2(x²−9) 尚未完成。',
          'Factor 2x²−18 completely over integer coefficients; 2(x²−9) is unfinished.',
        ],
        '2(x-3)(x+3)',
        [
          '先提二，再将括号平方差继续分解，展开还原两项。',
          'Extract two, split the remaining difference of squares and expand back.',
        ],
        ['2(x^2-9)', '2(x-3)^2', '2x^2-18'],
      ),
      {
        ...F(
          [
            '展开并合并 (2x−1)(x+3)，用作回查。',
            'Expand and collect (2x−1)(x+3) as a check.',
          ],
          '2x^2+5x-3',
          [
            '四对 2x²、6x、−x、−3，合并一次项。',
            'The products 2x²,6x,−x,−3 collect to the stated result.',
          ],
          ['(2x-1)(x+3)', '2x^2+6x-3', '2x^2+6x-x-3'],
        ),
        mode: 'expand',
      },
      F(
        [
          '在整数系数范围完整分解 x²−4x+4，再自行展开回查。',
          'Factor x²−4x+4 completely over integer coefficients, then check by expansion.',
        ],
        '(x-2)^2',
        [
          '末项四，中项为 −2·x·2，差平方展开回三项。',
          'The middle is −2·x·2 and final square four.',
        ],
        ['(x-2)(x+2)', '(x+2)^2', 'x^2-4x+4'],
      ),
      {
        ...F(
          [
            '原式 x²+5x+6，错拟 (x+1)(x+6)。x=1 时，错式比原式多几？只写数值。',
            'For source x²+5x+6 and false proposal (x+1)(x+6), how much larger is the proposal at x=1? Enter the number.',
          ],
          '2',
          [
            '原式十二，错式十四，多二；x=0 时两者六的吻合不能证明恒等。',
            'The source is twelve and proposal fourteen, a difference of two. Their agreement at x=0 proves no identity.',
          ],
          ['0', '12', '14'],
        ),
        mode: 'number',
      },
      F(
        [
          '在整数系数范围完整分解 3x³−12x。',
          'Factor 3x³−12x completely over integer coefficients.',
        ],
        '3x(x-2)(x+2)',
        [
          '提三 x，再分括号 x²−4；三因式加外系数一起回查。',
          'Extract 3x, then split x²−4; retain the outside multiplier when checking.',
        ],
        ['3x(x^2-4)', '3x(x-2)^2', '3x^3-12x'],
      ),
      {
        ...F(
          [
            '展开并合并 (x−3)²，区分平方差与差平方。',
            'Expand and collect (x−3)², distinguishing it from a difference of squares.',
          ],
          'x^2-6x+9',
          [
            '两个 −3x 同向合并，末项正九。',
            'Two −3x terms combine; the final square is positive nine.',
          ],
          ['x^2-9', '(x-3)^2', 'x^2-3x-3x+9'],
        ),
        mode: 'expand',
      },
    ],
    pick: {
      stem: [
        '哪种检查同时处理“恒等”和“完成分解”？',
        'Which check addresses both identity and completed factorisation?',
      ],
      options: [
        ['只代一个方便的 x', 'Try one convenient x'],
        ['只看乘积有两个括号', 'Look for two brackets'],
        [
          '完整展开比系数，再查剩余公因子与可分括号',
          'Expand and compare coefficients, then inspect remaining common content and reducible brackets',
        ],
      ],
      feedback: [
        [
          '单个吻合可巧合，不能覆盖全部输入。',
          'One matching input may be coincidental.',
        ],
        [
          '括号内可能还有共同因子或平方差。',
          'A bracket may still contain common content or a difference of squares.',
        ],
        [
          '先核一般关系，再核所要求的整数分解结构。',
          'First verify the general relationship, then the required integer factor structure.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较原式 x²+5x+6 与主张 (x+1)(x+6) 在零与一的值，再用展开给一般结论；另解释 2(x²−9) 为何等值但未完成。',
      'Compare source x²+5x+6 with (x+1)(x+6) at zero and one, then expand for the general conclusion. Explain why 2(x²−9) is equivalent but unfinished.',
    ],
    rubric: [
      'x=0 时都六，不足以证明；x=1 原式十二、主张十四，足以否证。展开主张为 x²+7x+6，中项七而非五，系数比较给一般差异。正确因式为 (x+2)(x+3)。2(x²−9) 展开为 2x²−18 关系正确，但括号仍平方差，要成 2(x−3)(x+3)。本课检查的是恒等与整数范围完整乘积，非解方程的零点列表，也不通过除 x 排除零。家长核对全部项来源、范围和证据强弱。',
      'At zero both give six, which proves no identity. At one the source is twelve and proposal fourteen, disproving it. Expansion gives x²+7x+6 rather than x²+5x+6; correct factors are (x+2)(x+3). The expansion of 2(x²−9) matches 2x²−18 but leaves a reducible bracket, so continue to 2(x−3)(x+3). This checks identity and integer factor structure, not roots of an equation; no cancellation removes input zero. Check all terms, scope and evidence.',
    ],
    misconception: [
      '一次吻合当证明、只比首尾、等值就算完整、把分解写成解方程。',
      'Treating one agreement as proof, checking only ends, equating identity with completion, or returning equation roots instead of factors.',
    ],
    prompts: [
      [
        '展开后每一种字母部分系数都相同吗？',
        'Do all expanded variable-part coefficients match?',
      ],
      [
        '每个括号内部还能继续本单元的分解吗？',
        'Can any bracket still be factored by the unit’s methods?',
      ],
    ],
  },
];
export const j82Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J82-L0${i + 1}`;
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
    unit: 'J82',
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
            '纸上为虚构社区花园写三种面积表达式：公因式、完全平方与积和三项式。注明正长度图只用于允许值；先分解找边长，再完整展开核每项，交换因式或成对改号检查关系。另设计一个在 x=0 巧合相等的错主张，找反例并给系数回查；最后找等值但未分解完整的例子。只需纸笔，不要求实测、购买或真实个人数据。',
            'On paper, create fictional community-garden area expressions using common factors, perfect squares and monic quadratics. State the positive-length picture’s domain, factor to identify sides and expand every term back. Check reordered factors and balanced signs. Create a false proposal agreeing at x=0, find a counterexample and compare coefficients; also show an equivalent unfinished factorisation. Paper is sufficient, without measurement, purchases or personal data.',
          ),
        }
      : {}),
  };
});
export function j82ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J82-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J82 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = 1 + (k % 5),
    b = 1 + (Math.floor(k / 5) % 6),
    r = (k % 9) - 4,
    s = (Math.floor(k / 9) % 9) - 4;
  let item: Item;
  if (i === 0)
    item = F(
      [
        `在整数系数范围完整分解 ${a}x²+${a * b}x。`,
        `Factor ${a}x²+${a * b}x completely over integer coefficients.`,
      ],
      `${a}x(x+${b})`,
      [
        '数公因数与共同 x 一起提出，展开逐项核。',
        'Extract numerical content and shared x, then expand term by term.',
      ],
      [`${a}(x^2+${b}x)`, `${a}x^2+${a * b}x`],
    );
  else if (i === 1) {
    const m = differenceFactor(1 + (k % 3), b);
    item = F(
      [
        `在整数系数范围完整分解 ${m.source}。`,
        `Factor ${m.source} completely over integer coefficients.`,
      ],
      m.result,
      [
        '先提数公因子，再对剩余平方差分解，括号须为本原整数因式。',
        'Extract numerical content, then split the remaining difference of squares into primitive integer factors.',
      ],
      [m.source],
    );
  } else if (i === 2) {
    const m = perfectSquareFactor(1 + (k % 3), b, k % 2 === 1);
    item = F(
      [
        `在整数系数范围完整分解 ${m.source}。`,
        `Factor ${m.source} completely over integer coefficients.`,
      ],
      m.result,
      [
        '核全部三个系数，数公因子先提，整体平方可写重复因式。',
        'Check all three coefficients, extract numerical content and write the repeated primitive factor.',
      ],
      [m.source],
    );
  } else if (i === 3) {
    const m = quadraticSearch(r + s, r * s);
    item = F(
      [
        `在整数系数范围完整分解 ${m.source}。`,
        `Factor ${m.source} completely over integer coefficients.`,
      ],
      m.factor!,
      [
        '找积与和同时符合的一对整数；零常数先提 x。',
        'Match product and sum simultaneously; extract x for zero constant.',
      ],
      m.source === 'x^2' ? [] : [m.source],
    );
  } else if (k % 2 === 0)
    item = {
      ...F(
        [
          `展开并合并 (x+(${r}))(x+(${s}))，用于回查。`,
          `Expand and collect (x+(${r}))(x+(${s})) as a check.`,
        ],
        `x^2+(${r + s})x+(${r * s})`,
        [
          '四对全乘再合并；回查要比较每类系数。',
          'Multiply all four pairs and compare every coefficient after collection.',
        ],
        [`(x+(${r}))(x+(${s}))`],
      ),
      mode: 'expand',
    };
  else
    item = F(
      [
        `在整数系数范围完整分解 ${a}x²−${a * b * b}，并自行展开回查。`,
        `Factor ${a}x²−${a * b * b} completely over integer coefficients and expand to check.`,
      ],
      `${a}(x-${b})(x+${b})`,
      [
        '外部数因子保留，括号平方差分完，展开还原。',
        'Retain outside content, finish the difference of squares and expand back.',
      ],
      [`${a}(x^2-${b * b})`],
    );
  return q(`${id}-R${round}`, i, item);
}
export const j82CheckQuestions: Question[] = [
  q(
    'J82-CHECK-Q1',
    0,
    F(
      [
        '在整数系数范围完整分解 12x²+18x。',
        'Factor 12x²+18x completely over integer coefficients.',
      ],
      '6x(2x+3)',
      [
        '系数公因数六，共同最低次数一。',
        'Coefficient GCD six and minimum shared x exponent one.',
      ],
      ['6(2x^2+3x)', '3x(4x+6)'],
    ),
  ),
  q(
    'J82-CHECK-Q2',
    1,
    F(
      [
        '在整数系数范围完整分解 x²−16。',
        'Factor x²−16 completely over integer coefficients.',
      ],
      '(x-4)(x+4)',
      [
        '四平方为十六，和差交叉项相消。',
        'Four squared is sixteen; conjugate cross terms cancel.',
      ],
      ['(x-4)^2', 'x^2-16'],
    ),
  ),
  q(
    'J82-CHECK-Q3',
    2,
    F(
      [
        '在整数系数范围完整分解 x²−10x+25。',
        'Factor x²−10x+25 completely over integer coefficients.',
      ],
      '(x-5)^2',
      ['中项为负二倍 x 乘五。', 'The middle is negative twice x times five.'],
      ['(x+5)^2', '(x-5)(x+5)'],
    ),
  ),
  q(
    'J82-CHECK-Q4',
    3,
    F(
      [
        '在整数系数范围完整分解 x²+2x−8。',
        'Factor x²+2x−8 completely over integer coefficients.',
      ],
      '(x+4)(x-2)',
      ['四与负二积负八、和二。', 'Four and −2 multiply to −8 and add to two.'],
      ['(x-4)(x+2)', '(x+8)(x-1)'],
    ),
  ),
  q(
    'J82-CHECK-Q5',
    4,
    F(
      [
        '在整数系数范围完整分解 2x³−8x。',
        'Factor 2x³−8x completely over integer coefficients.',
      ],
      '2x(x-2)(x+2)',
      ['先提二 x，剩余 x²−4 再分。', 'Extract 2x, then split x²−4.'],
      ['2x(x^2-4)', '2x(x-2)^2'],
    ),
  ),
  q('J82-CHECK-Q6', 4, {
    ...F(
      [
        '展开并合并 (x+2)(x−3)，用作回查。',
        'Expand and collect (x+2)(x−3) as a check.',
      ],
      'x^2-x-6',
      [
        'x²−3x+2x−6，合并得负 x。',
        'Collect x²−3x+2x−6 to obtain linear term −x.',
      ],
      ['(x+2)(x-3)', 'x^2-6'],
    ),
    mode: 'expand',
  }),
  pick('J82-CHECK-Q7', 3, specs[3]!.pick),
  reasoning(
    'J82-CHECK-Q8',
    t(
      '说明如何依次检查公因子、公式、积与和，以及为何必须完整展开再检查分解是否完成；给一个一次吻合的错主张。',
      'Explain a common-factor, identity-pattern and product/sum strategy, followed by complete expansion and completion checks. Give a false proposal agreeing at one input.',
    ),
    skills[4]!,
    t(
      '先覆盖所有项提最大整数单项式因子，再查平方差或两端与中项的完全平方；首项系数一的三项式才用本课整数积和配对。新括号逐个检查，例 2(x²−9) 要继续到 2(x−3)(x+3)。完整展开比每类系数证明恒等；仅在零吻合不够，如 (x+1)(x+6) 与 x²+5x+6 在零都六，在一分别十四与十二，中项系数七与五。说明整数范围，分解不等于求零点，也不取消零输入。家长检查步骤与证据，不按关键词数量判。',
      'Extract shared integer monomial content from every term, then inspect differences of squares or all three perfect-square coefficients. Use this unit’s integer product/sum search for monic quadratics. Inspect new brackets, continuing 2(x²−9) to 2(x−3)(x+3). Compare every expanded coefficient for identity. For example, (x+1)(x+6) and x²+5x+6 agree at zero but give fourteen and twelve at one; their middle coefficients differ. State integer scope, distinguish factors from roots and retain zero inputs. A parent reviews reasoning rather than keywords.',
    ),
    hints[4]!.map(T),
  ),
];
