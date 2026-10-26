import { t, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
import { parsePolynomial, polynomialText } from '../polynomialModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  variables: string[];
  number?: boolean;
  accepted?: string[];
};
const P = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  variables = ['x'],
  accepted?: string[],
): Item => ({ stem, value, step, wrong, variables, accepted });
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hook: Pair;
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'monomial-product-factors',
  'monomial-every-term-product',
  'all-pairs-polynomial-product',
  'square-cross-terms',
  'conjugate-cancellation',
];
const hints: Pair[][] = [
  [
    [
      '先拆开系数与字母因子，负数系数用括号。',
      'Separate coefficients from letter factors; bracket negative coefficients.',
    ],
    [
      '系数相乘；同底重复因子个数相加，不同字母分开。完成乘积并省零。',
      'Multiply coefficients; add counts only for the same letter. Keep other letters separate, finish products and omit zero terms.',
    ],
  ],
  [
    [
      '给外部单项式连到括号内每一个完整项，包括符号。',
      'Connect the outside monomial to every signed term inside.',
    ],
    [
      '逐对乘系数与字母，再合并；等值的原括号式还未完成展开。',
      'Multiply coefficients and letters for every pair, then collect. The equivalent original brackets are not yet an expansion.',
    ],
  ],
  [
    [
      '第一括号每一项都配第二括号每一项，先列全配对。',
      'Pair each term of the first factor with every term of the second.',
    ],
    [
      '两项乘两项有四对，计算后再合并同类项；数值面积不能代替一般式。',
      'Two terms by two terms give four pairs; compute before collecting. A numerical area cannot replace the general expression.',
    ],
  ],
  [
    [
      '平方是整个括号乘自身，先写四对，不只平方首尾。',
      'A squared bracket multiplies itself: list four pairs, not just end squares.',
    ],
    [
      '两块交叉项相同而同号，合成正或负二倍乘积；末项的平方为正。',
      'The equal cross terms have the same sign and combine to plus or minus twice the product. The final square is positive.',
    ],
  ],
  [
    [
      '找同一个整体 A，以及互为相反数的 B 和 −B。',
      'Identify the same whole A and opposite terms B and −B.',
    ],
    [
      '展开 AB 与 −AB 相消，保留 A²−B²；这与 (A−B)² 不同。',
      'Distribution cancels AB with −AB, leaving A²−B². This differs from (A−B)².',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const value = item.number
    ? item.value
    : polynomialText(parsePolynomial(item.value, item.variables)!);
  const result = numeric(
    id,
    T(item.stem),
    value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    { accepted: [value, ...(item.accepted ?? [])], rejected: item.wrong },
  );
  result.answer = item.number
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
    'all-pairs-before-collection',
    'identity-not-finite-testing',
  ];
  return result;
}
const pick = (id: string, i: number, s: Spec['pick']) =>
  choice(
    id,
    T(s.stem),
    s.correct,
    skills[i]!,
    s.options.map((p, j) => ({ text: T(p), feedback: T(s.feedback[j]!) })),
    hints[i]!.map(T),
    [T(s.feedback[s.correct]!)],
  );
const specs: Spec[] = [
  {
    title: ['单项式乘单项式', 'Multiplying monomials'],
    objective: [
      '按系数与重复字母因子解释单项式乘法，区分同底与不同字母。',
      'Explain monomial multiplication through coefficients and repeated letter factors, distinguishing matching from different bases.',
    ],
    prerequisites: ['J72-L02', 'J71-L06'],
    keywords: [
      ['系数乘积', 'coefficient product'],
      ['同底数', 'same base'],
      ['指数相加', 'adding exponents'],
    ],
    lab: 'identity-monomial',
    hook: [
      '两个 x 乘三个 x 一共有几个 x 因子？系数相乘和指数相加是一回事吗？',
      'Two x factors times three x factors give how many? Are multiplying coefficients and adding exponents the same operation?',
    ],
    items: [
      P(
        ['完成乘积并整理：(−2x²)(3x)。', 'Multiply and simplify: (−2x²)(3x).'],
        '-6x^3',
        [
          '系数负二乘三为负六，x² 的两个因子再接一个 x，共三个。',
          'Multiply coefficients to get −6; two x factors followed by one give x³.',
        ],
        ['-6x^2', 'x^3', '-6x^2*x'],
        ['x'],
        ['−6x³'],
      ),
      P(
        ['完成乘积并整理：(3xy)(−2x)。', 'Multiply and simplify: (3xy)(−2x).'],
        '-6x^2y',
        [
          '系数负六；两个 x、一个 y，各字母分别计数。',
          'Coefficient −6, two x factors and one y; count each letter separately.',
        ],
        ['-6xy', '-6x^2y^2', '3xy*(-2x)'],
        ['x', 'y'],
      ),
      P(
        [
          '完成乘积并整理：((1/2)x²)(−4x²)。',
          'Multiply and simplify: ((1/2)x²)(−4x²).',
        ],
        '-2x^4',
        [
          '半乘负四为负二，二加二为四个 x 因子。',
          'One half times −4 is −2; two plus two gives four x factors.',
        ],
        ['-2x^2', '-4x^4', '(1/2)x^2*(-4x^2)'],
      ),
      P(
        ['完成乘积并整理：(2x)(3y²)。', 'Multiply and simplify: (2x)(3y²).'],
        '6xy^2',
        [
          '系数六；x 与 y 不同，保留 x 和 y²。',
          'Coefficient six; different bases remain x and y².',
        ],
        ['6x^3', '5xy^2', '2x*3y^2'],
        ['x', 'y'],
      ),
      P(
        [
          '完成乘积并整理：(0x)(7x²)，写最简结果。',
          'Multiply (0x)(7x²), writing the simplest result.',
        ],
        '0',
        [
          '零系数使整个乘积为零，不保留零字母项。',
          'A zero coefficient makes the entire product zero; omit the zero letter term.',
        ],
        ['7x^3', 'x^3', '0x^3'],
      ),
      P(
        [
          '完成乘积并整理：(−3x)(−2x²)。',
          'Multiply and simplify: (−3x)(−2x²).',
        ],
        '6x^3',
        [
          '负乘负为正六，指数一加二为三。',
          'The coefficient is positive six; one plus two gives exponent three.',
        ],
        ['-6x^3', '6x^2', '(-3x)*(-2x^2)'],
      ),
    ],
    pick: {
      stem: [
        '哪条规则来自重复因子的乘法？',
        'Which rule follows from multiplying repeated factors?',
      ],
      options: [
        ['x²·x³=x⁶', 'x²·x³=x⁶'],
        ['x²·x³=x⁵', 'x²·x³=x⁵'],
        ['x²+x³=x⁵', 'x²+x³=x⁵'],
      ],
      feedback: [
        [
          '乘方的指数相乘不是本题同底幂乘法。',
          'Multiplying exponents is not the same-base product rule.',
        ],
        [
          '二个接三个因子，共五个。',
          'Two followed by three factors gives five.',
        ],
        [
          '加法不是连接重复因子的乘法。',
          'Addition does not concatenate repeated factors.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用重复因子解释 (−2xy)(3x²)，再区分 x²·x 与 x²+x；说明 x=0 时规则是否仍成立。',
      'Use repeated factors for (−2xy)(3x²), distinguish x²·x from x²+x, and discuss x=0.',
    ],
    rubric: [
      '系数为负六，字母因子 x·y·x·x 整理为 x³y，总积 −6x³y。x²·x 有三个 x 因子；x²+x 是不同次数的项相加，不能加指数。x=0 时等式两边都零，规则仍成立，不需要除 x。零结果写零。家长核对系数符号、每个字母计数及乘法与加法的区别，不只核结果。',
      'The coefficient is −6; x·y·x·x rearranges to x³y, giving −6x³y. x²·x has three repeated factors, whereas x²+x adds unlike terms. At x=0 both product forms equal zero; no division by x was used. Write zero for a zero result. Check signs, separate letter counts and the distinction between addition and multiplication.',
    ],
    misconception: [
      '指数相乘、不同字母合并、乘法规则套到加法、漏系数或零项。',
      'Multiplying exponents, merging different letters, applying a product rule to sums, or omitting coefficients and zero cases.',
    ],
    prompts: [
      [
        '把全部字母因子写出来会有几个？',
        'How many of each letter appear when written out?',
      ],
      [
        '这一步在相乘还是相加？',
        'Is this operation multiplication or addition?',
      ],
    ],
  },
  {
    title: ['单项式乘多项式', 'Monomial times polynomial'],
    objective: [
      '用完整逐项配对展开单项式乘多项式，处理负数、分数与零因子。',
      'Expand a monomial times every polynomial term, including negative, fractional and zero factors.',
    ],
    prerequisites: ['J81-L01', 'J72-L03'],
    keywords: [
      ['分配律', 'distributive law'],
      ['逐项乘积', 'termwise product'],
      ['完整展开', 'complete expansion'],
    ],
    lab: 'identity-distribute',
    hook: [
      '2x(x+3) 的两个部分各来自哪里？−x 是否只改变第一项？',
      'Where do both parts of 2x(x+3) come from? Does −x affect only the first term?',
    ],
    items: [
      P(
        ['展开并合并：2x(x+3)。', 'Expand and collect: 2x(x+3).'],
        '2x^2+6x',
        [
          '2x 分别乘 x 与三，得到 2x² 与 6x。',
          '2x multiplies x and three, giving 2x² and 6x.',
        ],
        ['2x^2+3', '2x^2+6', '2x(x+3)'],
      ),
      P(
        ['展开并合并：−x(2x+5)。', 'Expand and collect: −x(2x+5).'],
        '-2x^2-5x',
        [
          '负 x 同时乘两项，两项均为负。',
          'Negative x multiplies both terms; both resulting coefficients are negative.',
        ],
        ['-2x^2+5x', '-2x^2+5', '-x(2x+5)'],
      ),
      P(
        ['展开并合并：(1/2)x(4x−6)。', 'Expand and collect: (1/2)x(4x−6).'],
        '2x^2-3x',
        [
          '半乘四为二，半乘负六为负三，x 也分别相乘。',
          'One half times four is two, and times −6 is −3; multiply the letter factors too.',
        ],
        ['2x^2-6', '2x^2+3x', '(1/2)x(4x-6)'],
      ),
      P(
        ['展开并合并：−2y(x−y+3)。', 'Expand and collect: −2y(x−y+3).'],
        '-2xy+2y^2-6y',
        [
          '三对分别为 −2xy、+2y²、−6y，负乘负项变正。',
          'The three products are −2xy,+2y²,−6y; the negative inside term produces a positive product.',
        ],
        ['-2xy-2y^2-6y', '-2xy+2y^2+3', '-2y(x-y+3)'],
        ['x', 'y'],
      ),
      P(
        ['展开并整理：0(x²−x+2)。', 'Expand and simplify: 0(x²−x+2).'],
        '0',
        [
          '每一项都乘零，整个结果零，不能保留原常数二。',
          'Every term is multiplied by zero, including constant two.',
        ],
        ['2', 'x^2-x', '0x^2'],
      ),
      P(
        ['展开并合并：3x(2x²−x+4)。', 'Expand and collect: 3x(2x²−x+4).'],
        '6x^3-3x^2+12x',
        [
          '逐项得到 6x³、−3x²、12x，各类次数不同不能再合并。',
          'The products are 6x³,−3x²,12x; their degrees differ, so do not merge them.',
        ],
        ['6x^3-3x+4', '6x^2-3x^2+12x', '3x(2x^2-x+4)'],
      ),
    ],
    pick: {
      stem: [
        '−2x(x−3) 的正确展开是哪一个？',
        'Which expands −2x(x−3) correctly?',
      ],
      options: [
        ['−2x²−6x', '−2x²−6x'],
        ['−2x²−3', '−2x²−3'],
        ['−2x²+6x', '−2x²+6x'],
      ],
      feedback: [
        [
          '负二乘负三应为正六。',
          'Negative two times negative three is positive six.',
        ],
        [
          '常数负三也必须乘外部负二 x。',
          'The inside −3 must also be multiplied by −2x.',
        ],
        [
          '两对全乘，第二对负乘负为正。',
          'Both pairs are included and the second has a positive coefficient.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '解释 −2x(x−3) 的每一项，并用正长度例 2x(x+3) 说明面积分割；负项能直接当负长度吗？',
      'Explain every term of −2x(x−3), then relate 2x(x+3) to a positive-length area partition. Can a negative term simply be a negative length?',
    ],
    rubric: [
      '−2x 乘 x 为 −2x²，乘 −3 为 +6x，每一项都保留外因子的 x；结果 −2x²+6x。正长度 x>0 的长方形高 2x、宽 x+3，可分成宽 x 和三的两块，面积 2x² 与 6x。图只解释给定正长度，负项用代数符号处理，不能画负宽度。分配律适用于负数和分数，不依赖画出负面积，也不由一次代入证明。',
      '−2x times x is −2x² and times −3 is +6x, retaining the outside x in both. For x>0, a rectangle 2x by x+3 splits into areas 2x² and 6x. This positive-length picture does not license negative widths. Signed distribution also works for negative and fractional values; it does not require negative areas or a numerical proof.',
    ],
    misconception: [
      '只乘首项、负号只改一项、常数不乘字母、把负项当负长度。',
      'Multiplying only the first term, changing only one sign, omitting letters from constant products, or drawing negative lengths.',
    ],
    prompts: [
      ['每个括号内项与谁相乘？', 'What multiplies each inside term?'],
      [
        '这张图的长度条件是什么？',
        'What length conditions does the picture require?',
      ],
    ],
  },
  {
    title: ['多项式乘多项式', 'Multiplying polynomials'],
    objective: [
      '列全两个整式的所有项配对，再合并同类项，并说明图形情境的取值条件。',
      'List every term pair before collecting, and state the domain of a geometric model.',
    ],
    prerequisites: ['J81-L02', 'J72-L04'],
    keywords: [
      ['全部配对', 'all term pairs'],
      ['交叉项', 'cross terms'],
      ['合并同类项', 'collecting like terms'],
    ],
    lab: 'identity-binomial',
    hook: [
      '(x+2)(x+3) 能只算 x·x 和 2·3 吗？另外两对乘积去了哪里？',
      'Can (x+2)(x+3) use only x·x and 2·3? Where are the other two pairs?',
    ],
    items: [
      P(
        ['展开并合并：(x+2)(x+3)。', 'Expand and collect: (x+2)(x+3).'],
        'x^2+5x+6',
        [
          '四对为 x²、3x、2x、6；中间两项合为 5x。',
          'The four pairs give x²,3x,2x,6; collect the middle pair to 5x.',
        ],
        ['x^2+6', 'x^2+6x+6', '(x+2)(x+3)', 'x^2+3x+2x+6'],
      ),
      P(
        ['展开并合并：(x−2)(x+5)。', 'Expand and collect: (x−2)(x+5).'],
        'x^2+3x-10',
        [
          '四对 x²、5x、−2x、−10，合并一次项为 3x。',
          'The pairs are x²,5x,−2x,−10; the linear coefficient is three.',
        ],
        ['x^2-10', 'x^2+7x-10', '(x-2)(x+5)'],
      ),
      P(
        ['展开并合并：(2x+1)(x−3)。', 'Expand and collect: (2x+1)(x−3).'],
        '2x^2-5x-3',
        [
          '2x²−6x+x−3，合成 −5x，不是 −6x。',
          '2x²−6x+x−3 collects to −5x, not −6x.',
        ],
        ['2x^2-6x-3', '2x^2+5x-3', '(2x+1)(x-3)'],
      ),
      P(
        ['展开并合并：(x+y)(x+2y)。', 'Expand and collect: (x+y)(x+2y).'],
        'x^2+3xy+2y^2',
        [
          'x²+2xy+xy+2y²，xy 与 yx 是同类项。',
          'x²+2xy+xy+2y²; xy and yx have the same variable part.',
        ],
        ['x^2+2y^2', 'x^2+3xy+2y', '(x+y)(x+2y)'],
        ['x', 'y'],
      ),
      P(
        [
          '虚构花园长 n+2 米、宽 n+3 米，n>0。写展开合并后的面积一般式；省略 m² 单位。',
          'A fictional garden is n+2 metres by n+3 metres, with n>0. Write its expanded and collected area expression, omitting m².',
        ],
        'n^2+5n+6',
        [
          '面积为两长度相乘，四块合并成 n²+5n+6；单位是平方米。',
          'Multiply lengths, combining four pieces to n²+5n+6 square metres.',
        ],
        ['4n+10', 'n^2+6', '(n+2)(n+3)'],
        ['n'],
      ),
      P(
        ['展开并合并：(x−4)(x+4)。', 'Expand and collect: (x−4)(x+4).'],
        'x^2-16',
        [
          'x²+4x−4x−16，中间两项相消。',
          'x²+4x−4x−16; the middle terms cancel.',
        ],
        ['x^2+16', 'x^2-8x+16', 'x^2+4x-4x-16'],
      ),
    ],
    pick: {
      stem: [
        '(x+2)(x+3) 应先记录哪些乘积？',
        'Which products must be recorded for (x+2)(x+3)?',
      ],
      options: [
        ['x²、3x、2x、6', 'x²,3x,2x,6'],
        ['只有 x²、6', 'Only x² and 6'],
        ['x²、5、6', 'x²,5,6'],
      ],
      feedback: [
        [
          '第一括号两项分别配第二括号两项，四对齐全。',
          'Each of two terms meets each of the other two: all four pairs.',
        ],
        ['漏掉两个交叉乘积。', 'Both cross products are missing.'],
        ['交叉项仍含 x，不能丢字母。', 'Cross products still contain x.'],
      ],
      correct: 0,
    },
    reason: [
      '推导 (x+a)(x+b)，解释为何中间系数为 a+b；a 或 b 为负时，面积图与代数证明分别能说明什么？',
      'Derive (x+a)(x+b), explain the coefficient a+b, and distinguish a positive-length picture from the signed algebraic proof.',
    ],
    rubric: [
      '按分配律得 x²+bx+ax+ab，再合并为 x²+(a+b)x+ab。两交叉项来自不同配对，不能漏。若用 x、a、b 作分块边长，应非负且外边长为正；负偏移不直接画成负分块长度。代数分配不受此图的正长度条件限制，对所有实数成立。代入可检错但不能用几次吻合证明恒等。家长核对四对、同类项和图形范围。',
      'Distribution gives x²+bx+ax+ab, hence x²+(a+b)x+ab. The cross terms come from distinct pairs. Partition lengths x,a,b must be nonnegative with positive outer lengths; negative offsets are not negative pieces. The algebraic proof holds for all real values beyond this picture. Numerical checks may reveal errors but do not prove an identity. Check every pair, collection and the geometric domain.',
    ],
    misconception: [
      '只乘首尾、两括号相加、漏掉一个交叉项、用周长式代面积式。',
      'Multiplying only ends, adding factors, omitting a cross term, or substituting perimeter for area.',
    ],
    prompts: [
      [
        '有几行、几列，应有几对？',
        'How many rows and columns determine the number of pairs?',
      ],
      ['哪两项同类，为什么？', 'Which two products are like terms, and why?'],
    ],
  },
  {
    title: ['完全平方公式', 'Perfect-square identities'],
    objective: [
      '从四对乘积与面积重叠推导完全平方，准确处理二倍乘积与整体平方。',
      'Derive perfect squares from four pairs and area overlap, retaining twice the product and squaring whole terms.',
    ],
    prerequisites: ['J81-L03', 'J72-L01'],
    keywords: [
      ['完全平方', 'perfect square'],
      ['二倍乘积', 'twice the product'],
      ['整体平方', 'square of a whole term'],
    ],
    lab: 'identity-square',
    hook: [
      '(x+3)² 为什么不只是 x²+9？(x−3)² 的最后一项该是正还是负？',
      'Why is (x+3)² more than x²+9? Is the final term of (x−3)² positive or negative?',
    ],
    items: [
      P(
        ['展开并合并：(x+3)²。', 'Expand and collect: (x+3)².'],
        'x^2+6x+9',
        [
          '两次交叉乘积各为 3x，总共 6x，再加两端平方。',
          'The two cross products each give 3x, totalling 6x, alongside the end squares.',
        ],
        ['x^2+9', 'x^2+3x+9', '(x+3)^2'],
      ),
      P(
        ['展开并合并：(x−4)²。', 'Expand and collect: (x−4)².'],
        'x^2-8x+16',
        [
          '两个 −4x 合为 −8x，负四的平方为正十六。',
          'Two −4x terms combine to −8x; (−4)² is positive sixteen.',
        ],
        ['x^2-16', 'x^2-8x-16', '(x-4)^2'],
      ),
      P(
        ['展开并合并：(2x+3)²。', 'Expand and collect: (2x+3)².'],
        '4x^2+12x+9',
        [
          '整个 2x 平方为 4x²；二倍乘积 2·2x·3 为 12x。',
          'Square the entire 2x to get 4x²; twice 2x times three gives 12x.',
        ],
        ['2x^2+6x+9', '4x^2+6x+9', '(2x+3)^2'],
      ),
      P(
        ['展开并合并：(x−y)²。', 'Expand and collect: (x−y)².'],
        'x^2-2xy+y^2',
        [
          '两交叉项均为 −xy，末项 (−y)(−y)=y²。',
          'Both cross terms are −xy, while (−y)(−y)=y².',
        ],
        ['x^2-y^2', 'x^2+2xy+y^2', '(x-y)^2'],
        ['x', 'y'],
      ),
      P(
        ['展开并合并：((1/2)x+2)²。', 'Expand and collect: ((1/2)x+2)².'],
        '(1/4)x^2+2x+4',
        [
          '首项平方系数四分之一，二倍交叉乘积为 2x，末项四。',
          'The square coefficient is one quarter; twice the cross product is 2x, and the constant is four.',
        ],
        ['(1/2)x^2+2x+4', '(1/4)x^2+x+4', '((1/2)x+2)^2'],
      ),
      P(
        ['展开并合并：(3x−1)²。', 'Expand and collect: (3x−1)².'],
        '9x^2-6x+1',
        [
          '整个三 x 平方得九 x²，两交叉项合为负六 x。',
          'Squaring all of 3x gives 9x²; the cross terms total −6x.',
        ],
        ['3x^2-6x+1', '9x^2-1', '(3x-1)^2'],
      ),
    ],
    pick: {
      stem: ['哪一个与 (A−B)² 恒等？', 'Which is identical to (A−B)²?'],
      options: [
        ['A²−B²', 'A²−B²'],
        ['A²−2AB+B²', 'A²−2AB+B²'],
        ['A²+2AB−B²', 'A²+2AB−B²'],
      ],
      feedback: [
        [
          '漏中间项，且末项不应为负。',
          'The middle term is missing and the final square must be positive.',
        ],
        ['四对为 A²、−AB、−AB、B²。', 'The four products are A²,−AB,−AB,B².'],
        [
          '两个交叉项应负，末项应正。',
          'Both cross terms are negative and the final square positive.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '从 (x−b)(x−b) 推导平方公式，再解释 x>b>0 时“大正方形减两条再补角块”。另对错误主张 (x−b)²=x²+b²，比较 x=0 的吻合与 b=2、x=1 的反例；区分代数检验与图形正长度条件。',
      'Derive (x−b)² by distribution and by subtracting two overlapping strips for x>b>0. Separately test the false claim (x−b)²=x²+b²: compare agreement at x=0 with b=2,x=1. Distinguish algebraic tests from the picture’s positive-length conditions.',
    ],
    rubric: [
      '四对 x²、−xb、−bx、b² 合并成 x²−2bx+b²。几何从 x² 减两条各 xb，b² 角块重减一次，须补回一次才能留下 (x−b)²；不是新添面积。图取 x>b>0，代数式对任意实数成立。x=0 时错误式 x²+b² 与原平方均为 b²，这只是一处吻合；b=2,x=1 时原 (1−2)²=1，错式五，不同即可否证。恒等的依据是完整分配，不是若干试数。',
      'The four terms x²,−xb,−bx,b² collect to x²−2bx+b². Geometrically subtract two strips of area xb, then restore their b² overlap once because it was removed twice. This leaves (x−b)²; the picture needs x>b>0 but the algebra works for all reals. At x=0 a missing-middle expression also equals b². At b=2,x=1 the actual square is one and the false expression five, disproving it. Distribution proves the identity; finite agreements do not.',
    ],
    misconception: [
      '平方分配到加减、漏二倍乘积、只平方字母不平方系数、末项错号。',
      'Distributing a square over sums, omitting twice the product, failing to square coefficients, or making the final square negative.',
    ],
    prompts: [
      [
        '两块交叉项分别来自哪一对？',
        'Which separate pairs supply the cross terms?',
      ],
      ['减两条时角块被减过几次？', 'How many times was the corner removed?'],
    ],
  },
  {
    title: ['平方差公式', 'Difference of squares'],
    objective: [
      '识别互为和差的整体，用交叉项相消推导平方差并区分差的平方。',
      'Identify conjugate whole terms and derive a difference of squares through cancellation, distinguishing a squared difference.',
    ],
    prerequisites: ['J81-L03', 'J81-L04', 'P66-L04'],
    keywords: [
      ['互为和差', 'conjugate factors'],
      ['交叉项相消', 'cross-term cancellation'],
      ['平方差', 'difference of squares'],
    ],
    lab: 'identity-difference',
    hook: [
      '(x+3)(x−3) 与 (x−3)² 的中间项为何不同？去掉角块后能只重排不拉伸吗？',
      'Why do (x+3)(x−3) and (x−3)² have different middle terms? Can the remaining area be rearranged without stretching?',
    ],
    items: [
      P(
        ['展开并合并：(x+3)(x−3)。', 'Expand and collect: (x+3)(x−3).'],
        'x^2-9',
        [
          'x²−3x+3x−9，中间两项互为相反数。',
          'x²−3x+3x−9 has opposite middle terms.',
        ],
        ['x^2+9', 'x^2-6x+9', '(x+3)(x-3)'],
      ),
      P(
        ['展开并合并：(2x+5)(2x−5)。', 'Expand and collect: (2x+5)(2x−5).'],
        '4x^2-25',
        [
          '整体 A=2x、B=5，A² 为 4x²，B² 为二十五。',
          'Use whole terms A=2x,B=5, so A²=4x² and B²=25.',
        ],
        ['2x^2-25', '4x^2-20x+25', '(2x+5)(2x-5)'],
      ),
      P(
        ['展开并合并：(x+y)(x−y)。', 'Expand and collect: (x+y)(x−y).'],
        'x^2-y^2',
        ['−xy 与 +xy 相消，留下 x²−y²。', '−xy and +xy cancel, leaving x²−y².'],
        ['x^2-2xy+y^2', 'x^2+y^2', '(x+y)(x-y)'],
        ['x', 'y'],
      ),
      {
        ...P(
          [
            '用平方差计算 99×101，只写准确数值。',
            'Use a difference of squares to calculate 99×101; enter the exact number.',
          ],
          '9999',
          ['(100−1)(100+1)=10000−1=9999。', '(100−1)(100+1)=10000−1=9999.'],
          ['10001', '9801', '10000'],
        ),
        number: true,
      },
      P(
        ['展开并合并：(x²+2)(x²−2)。', 'Expand and collect: (x²+2)(x²−2).'],
        'x^4-4',
        [
          '把 x² 看作整体 A，A² 为 x⁴；交叉项相消。',
          'Treat x² as whole A, whose square is x⁴; the cross terms cancel.',
        ],
        ['x^2-4', 'x^4+4', '(x^2+2)(x^2-2)'],
      ),
      P(
        ['展开并合并：(3x+2)(3x−2)。', 'Expand and collect: (3x+2)(3x−2).'],
        '9x^2-4',
        [
          '同一首项三 x 平方为九 x²；相反的二相乘为负四。',
          'Square the common term 3x to get 9x²; opposite constants produce −4.',
        ],
        ['3x^2-4', '9x^2+4', '(3x+2)(3x-2)'],
      ),
    ],
    pick: {
      stem: [
        '哪一组可以直接按 A²−B² 计算？',
        'Which product directly has the form A²−B²?',
      ],
      options: [
        ['(2x+3)(2x−3)', '(2x+3)(2x−3)'],
        ['(2x+3)(x−3)', '(2x+3)(x−3)'],
        ['(2x−3)(2x−3)', '(2x−3)(2x−3)'],
      ],
      feedback: [
        [
          '首项相同为 2x，次项互为正负三。',
          'The first term is the same 2x and second terms are opposite threes.',
        ],
        [
          '两个首项不同，不能直接相消交叉项。',
          'The first terms differ, so cross terms do not cancel.',
        ],
        [
          '这是差的平方，两个交叉项同号。',
          'This is a squared difference with same-sign cross terms.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '推导 (A+B)(A−B)，比较 (A−B)²，并说明去角小正方形重排图的条件与每块面积如何保持。',
      'Derive (A+B)(A−B), compare it with (A−B)², and explain the domain and preserved areas in a corner-square rearrangement.',
    ],
    rubric: [
      '四对 A²、−AB、+AB、−B²，中间互为相反数，得 A²−B²；差的平方中两交叉项均负，结果 A²−2AB+B²，不能混用。图取 x>b>0，从 x² 去 b² 得两块 x(x−b)、b(x−b)，第二块旋转成 b 宽、x−b 高，不拉伸，拼成 (x+b)(x−b)。图是正长度解释，代数证明对任意实数 A、B 成立。若题目首项不同或次项不互为相反数，应回到完整配对。家长核对整体识别、抵消符号与面积守恒。',
      'The four products A²,−AB,+AB,−B² leave A²−B². A squared difference instead has two negative cross terms and a positive final square. For x>b>0, removing b² from x² leaves pieces x(x−b) and b(x−b). Rotate the second without stretching to form a rectangle (x+b) by (x−b). The picture requires positive lengths while distribution proves the identity for all real A,B. If the matching/opposite structure fails, use every term pair. Check whole-term identification, cancellation and area conservation.',
    ],
    misconception: [
      '平方差等于差的平方、不同首项也套公式、整体平方漏系数、重排拉伸面积。',
      'Confusing a difference of squares with a squared difference, using nonconjugate factors, failing to square whole coefficients, or stretching pieces.',
    ],
    prompts: [
      [
        '两括号哪个整体完全相同，哪个互为相反数？',
        'Which whole terms match and which are opposites?',
      ],
      [
        '每块旋转前后的两边与面积是什么？',
        'What are each piece’s dimensions and area before and after rotation?',
      ],
    ],
  },
];
export const j81Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J81-L0${i + 1}`;
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
    unit: 'J81',
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
            '纸上为虚构新西兰社区花园画一个 n+2 米乘 n+3 米分块图，再画边长 x 的正方形去掉边长 b 的角块，注明 n>0、x>b>0。给各块编号，列全部乘积，将两块不拉伸重排并核面积。另选一条漏中项的错误公式，找反例再给分配推导；区分试数检错与恒等证明。只需纸笔，不要求实际测量、购买或收集个人资料。',
            'On paper, design a fictional New Zealand community-garden partition n+2 by n+3 metres and a square x with corner square b removed, stating n>0 and x>b>0. Label pieces, list all products and rearrange without stretching, checking areas. Find a counterexample to a missing-middle formula, then give a distributive derivation. Distinguish error checks from proof. Paper is sufficient; no measurement, purchase or personal data is required.',
          ),
        }
      : {}),
  };
});
export function j81ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J81-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J81 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 7) - 3,
    b = 1 + (Math.floor(k / 7) % 5),
    c = (k % 5) - 2,
    u = 1 + (k % 4),
    v = 1 + (Math.floor(k / 4) % 5),
    m = 1 + (k % 2),
    n = 1 + (Math.floor(k / 2) % 2);
  let item: Item;
  if (i === 0) {
    const different = k % 3 === 0,
      expr = `(${a}x^${m})(${b}${different ? 'y' : 'x'}^${n})`,
      value = different ? `${a * b}x^${m}y^${n}` : `${a * b}x^${m + n}`;
    item = P(
      [`完成乘积并整理：${expr}。`, `Multiply and simplify: ${expr}.`],
      value,
      [
        '系数相乘，同底指数相加，不同字母保留。',
        'Multiply coefficients; add exponents for matching bases and retain different letters.',
      ],
      [expr],
      ['x', 'y'],
    );
  } else if (i === 1)
    item = P(
      [
        `展开并合并 ${a}x(${b}x+(${c}))。`,
        `Expand and collect ${a}x(${b}x+(${c})).`,
      ],
      `${a * b}x^2+(${a * c})x`,
      [
        '外因子分别乘每一项，包括符号与字母。',
        'Multiply the outside factor into every signed term, retaining letters.',
      ],
      [`${a}x(${b}x+(${c}))`],
    );
  else if (i === 2)
    item = P(
      [
        `展开并合并 (x+(${a}))(x+(${c}))。`,
        `Expand and collect (x+(${a}))(x+(${c})).`,
      ],
      `x^2+(${a + c})x+(${a * c})`,
      [
        '四对全列再合并；零系数省去。',
        'List all four pairs, collect and omit zero coefficients.',
      ],
      [`(x+(${a}))(x+(${c}))`],
    );
  else if (i === 3) {
    const sign = k % 2 ? -1 : 1;
    item = P(
      [
        `展开并合并 (${u}x+(${sign * v}))²。`,
        `Expand and collect (${u}x+(${sign * v}))².`,
      ],
      `${u * u}x^2+(${2 * u * sign * v})x+${v * v}`,
      [
        '整个首项平方，保留二倍交叉乘积及正的末项平方。',
        'Square the entire first term and retain twice the cross product and a positive final square.',
      ],
      [`${u * u}x^2+${v * v}`, `(${u}x+(${sign * v}))^2`],
    );
  } else
    item = P(
      [
        `展开并合并 (${u}x+${v})(${u}x−${v})。`,
        `Expand and collect (${u}x+${v})(${u}x−${v}).`,
      ],
      `${u * u}x^2-${v * v}`,
      [
        '共同首项平方减第二项平方，交叉项互相抵消。',
        'Square the common first term and subtract the second square; opposite cross terms cancel.',
      ],
      [`${u * u}x^2+${v * v}`, `(${u}x+${v})(${u}x-${v})`],
    );
  return q(`${id}-R${round}`, i, item);
}
export const j81CheckQuestions: Question[] = [
  q(
    'J81-CHECK-Q1',
    0,
    P(
      ['完成乘积：(−2xy)(−3x)。', 'Multiply and simplify: (−2xy)(−3x).'],
      '6x^2y',
      [
        '系数正六，两个 x、一个 y。',
        'Coefficient positive six, two x factors and one y.',
      ],
      ['-6x^2y', '6xy'],
      ['x', 'y'],
    ),
  ),
  q(
    'J81-CHECK-Q2',
    1,
    P(
      ['展开并合并：−2x(x−4)。', 'Expand and collect: −2x(x−4).'],
      '-2x^2+8x',
      [
        '负二 x 乘两项，第二项为正八 x。',
        'Multiply −2x into both terms; the second is +8x.',
      ],
      ['-2x^2-8x', '-2x(x-4)'],
    ),
  ),
  q(
    'J81-CHECK-Q3',
    2,
    P(
      ['展开并合并：(x+1)(x−4)。', 'Expand and collect: (x+1)(x−4).'],
      'x^2-3x-4',
      ['x²−4x+x−4，合并一次项。', 'Collect the linear terms in x²−4x+x−4.'],
      ['x^2-4', '(x+1)(x-4)'],
    ),
  ),
  q(
    'J81-CHECK-Q4',
    3,
    P(
      ['展开并合并：(2x−1)²。', 'Expand and collect: (2x−1)².'],
      '4x^2-4x+1',
      [
        '平方系数四，二倍交叉项负四 x，末项正一。',
        'Square coefficient four, cross total −4x and positive one.',
      ],
      ['4x^2-1', '(2x-1)^2'],
    ),
  ),
  q(
    'J81-CHECK-Q5',
    4,
    P(
      ['展开并合并：(3x+4)(3x−4)。', 'Expand and collect: (3x+4)(3x−4).'],
      '9x^2-16',
      ['把三 x 看整体，平方得九 x²。', 'Square whole 3x to obtain 9x².'],
      ['3x^2-16', '9x^2+16'],
    ),
  ),
  q('J81-CHECK-Q6', 4, {
    ...P(
      [
        '用平方差计算 102×98，只写准确数值。',
        'Use a difference of squares to calculate 102×98; enter the exact number.',
      ],
      '9996',
      ['(100+2)(100−2)=10000−4。', '(100+2)(100−2)=10000−4.'],
      ['10004', '10000'],
    ),
    number: true,
  }),
  pick('J81-CHECK-Q7', 3, specs[3]!.pick),
  reasoning(
    'J81-CHECK-Q8',
    t(
      '比较 (x+2)²、(x−2)²、(x+2)(x−2)，从全部乘积解释中项与末项符号，再说明面积图条件和试数局限。',
      'Compare (x+2)², (x−2)² and (x+2)(x−2) through all term pairs; explain middle/final signs, geometric conditions and limits of numerical testing.',
    ),
    skills[4]!,
    t(
      '依次为 x²+4x+4、x²−4x+4、x²−4。两个平方的交叉项分别同正、同负，末项都是正四；和差乘积的交叉项相反抵消，常数为负四。图用正长度，减块图另需 x>2；代数分配对任意实数 x 成立。一次或数次代入相同不能证明恒等，反例则能否证错误主张。家长检查四对来源、整体平方、面积守恒与证据范围。',
      'The results are x²+4x+4, x²−4x+4 and x²−4. Cross terms in each square have the same sign and final squares are positive; conjugate cross terms cancel and their constant product is negative. Pictures need positive lengths, with x>2 for removal. Distribution proves identities for all real x. Finite agreements do not prove identity, while a counterexample disproves a false claim. Check all term sources, whole squares, area conservation and the scope of evidence.',
    ),
    hints[4]!.map(T),
  ),
];
