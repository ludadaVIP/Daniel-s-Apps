import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  powerText,
  exactLog,
  readPositive,
  firstWholeStep,
} from '../exponentialModels';
import { textR } from '../algebraModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
): Item => ({
  stem,
  answer: { kind: 'number', value, unit },
  step,
  wrong,
});
const E = (stem: Pair, rubric: Pair): Item => ({
  stem,
  answer: { kind: 'explain', rubric: T(rubric) },
  step: rubric,
  wrong: [],
});
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  skill: string;
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['指数定律与负指数', 'Exponent laws and negative powers'],
    objective: [
      '用同底数的乘除结构解释零指数和负整数指数。',
      'Explain zero and negative integer powers through same-base multiplication and division.',
    ],
    hook: [
      '2³、2²、2¹每次除以2，下一步为什么不是0？',
      'From 2³ to 2² to 2¹, divide by two each time. Why is the next value not zero?',
    ],
    prerequisites: ['J81-L01', 'J71-L05', 'J91-L01'],
    keywords: [
      ['底数', 'base'],
      ['指数', 'exponent'],
      ['倒数', 'reciprocal'],
    ],
    skill: 'exponent-laws-reciprocal',
    lab: 'exp-integers',
    hints: [
      [
        '先圈出完整底数；同底相乘加指数、相除减指数。',
        'Identify the entire base. Add exponents for same-base products; subtract for quotients.',
      ],
      [
        'a≠0时a⁰=1，a⁻ⁿ=1/aⁿ；负号在括号内外意义不同。',
        'For a≠0, a⁰=1 and a⁻ⁿ=1/aⁿ. A minus sign inside or outside brackets has different roles.',
      ],
    ],
    items: [
      N(
        ['求2⁻³。', 'Evaluate 2⁻³.'],
        '1/8',
        [
          '2⁻³=1/2³=1/8。负指数指定倒数，不指定负数。',
          '2⁻³=1/2³=1/8. A negative exponent specifies a reciprocal, not a negative result.',
        ],
        ['-8', '-1/8'],
      ),
      N(
        ['求3⁴÷3⁶。', 'Evaluate 3⁴÷3⁶.'],
        '1/9',
        ['同底相除得3^(4−6)=3⁻²=1/9。', 'Subtract exponents: 3^(4−6)=3⁻²=1/9.'],
        ['9', '-9'],
      ),
      N(
        ['求(2⁻²)³。', 'Evaluate (2⁻²)³.'],
        '1/64',
        [
          '幂的乘方乘指数：2⁻⁶=1/64。',
          'Multiply exponents in a power of a power: 2⁻⁶=1/64.',
        ],
        ['1/32', '64'],
      ),
      N(
        [
          '求(−2)⁻²；负号属于底数。',
          'Evaluate (−2)⁻², with the minus sign in the base.',
        ],
        '1/4',
        ['1/(−2)²=1/4；对比−2⁻²=−1/4。', '1/(−2)²=1/4; in contrast −2⁻²=−1/4.'],
        ['-1/4', '4'],
      ),
      N(
        ['求5⁰+5⁻¹。', 'Evaluate 5⁰+5⁻¹.'],
        '6/5',
        [
          '5⁰=1且5⁻¹=1/5，相加为6/5；相加不能直接加指数。',
          '5⁰=1 and 5⁻¹=1/5, so the sum is 6/5. Addition does not add exponents.',
        ],
        ['1', '1/5'],
      ),
      N(
        [
          '虚构缩放模型：初始16 cm，每步缩为一半。倒退2步即16×(1/2)⁻²，求长度（cm）。',
          'A fictional scaling model starts at 16 cm and halves per step. Two steps backwards gives 16×(1/2)⁻². Find the length in cm.',
        ],
        '64',
        [
          '倒退时乘2两次，16×4=64 cm；负步数与负长度不同。',
          'Going backwards multiplies by two twice: 16×4=64 cm. Negative steps do not mean negative length.',
        ],
        ['4', '-64'],
        'cm',
      ),
    ],
    pick: {
      stem: [
        '哪条在其所写条件下成立？',
        'Which statement is valid under its stated conditions?',
      ],
      options: [
        ['0⁰=1，无须条件', '0⁰=1 without qualification'],
        ['a≠0时a⁰=1', 'a⁰=1 when a≠0'],
        ['a⁻²=−a²', 'a⁻²=−a²'],
      ],
      feedback: [
        [
          '本课不定义0⁰；商aⁿ/aⁿ需要非零底数。',
          'This lesson leaves 0⁰ undefined; aⁿ/aⁿ needs a nonzero base.',
        ],
        [
          '非零数除以自身是1，与指数差0一致。',
          'A nonzero number divided by itself is one, agreeing with exponent difference zero.',
        ],
        [
          '负指数取倒数，例如2⁻²=1/4。',
          'A negative exponent takes a reciprocal: 2⁻²=1/4.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '纠错：“2³+2⁴=2⁷，且0⁻¹=0。”逐条解释。',
      'Repair: “2³+2⁴=2⁷ and 0⁻¹=0.” Explain both corrections.',
    ],
    rubric: [
      '加指数对应乘法而非加法，8+16=24；0⁻¹会要求1/0，因此无定义。指出非零条件。',
      'Adding exponents corresponds to multiplication, not addition: 8+16=24. Zero to power −1 would require 1/0, so is undefined. State the nonzero condition.',
    ],
    misconception: [
      '把负指数当负值、把加法当乘法，或忽略零底数与括号。',
      'Confusing negative exponents with negative values, addition with multiplication, or ignoring zero bases and brackets.',
    ],
  },
  {
    title: ['有理指数与根式', 'Rational exponents and radicals'],
    objective: [
      '对正底数用根式解释约分后的有理指数，并区分主值与方程根。',
      'Interpret reduced rational exponents of positive bases using radicals, distinguishing principal values from equation roots.',
    ],
    hook: [
      '如果16^(1/2)写±4，函数还能让同一输入只给一个输出吗？',
      'If 16^(1/2) meant ±4, could it remain a single-valued function?',
    ],
    prerequisites: ['H03-L01', 'J91-L03', 'H02-L05'],
    keywords: [
      ['有理指数', 'rational exponent'],
      ['主值', 'principal value'],
      ['根式', 'radical'],
    ],
    skill: 'exponent-rational-root',
    lab: 'exp-rational',
    hints: [
      [
        '正底数a，先把m/n约分，a^(m/n)=(ⁿ√a)^m。',
        'For a positive base a, reduce m/n first: a^(m/n)=(ⁿ√a)^m.',
      ],
      [
        '偶次主根取非负值；负指数再取倒数。x²=a的全部根是另一问题。',
        'An even principal root is nonnegative; a negative exponent then takes a reciprocal. All roots of x²=a are a different question.',
      ],
    ],
    items: [
      N(
        ['求27^(2/3)。', 'Evaluate 27^(2/3).'],
        '9',
        [
          '先取立方根3，再平方得9。',
          'Take the cube root three, then square to get nine.',
        ],
        ['18', '6'],
      ),
      N(
        ['求16^(3/4)。', 'Evaluate 16^(3/4).'],
        '8',
        ['四次主根为2，2³=8。', 'The principal fourth root is two, and 2³=8.'],
        ['12', '-8'],
      ),
      N(
        ['求81^(−1/2)。', 'Evaluate 81^(−1/2).'],
        '1/9',
        [
          '√81=9，负指数取倒数1/9。',
          '√81=9; the negative exponent gives reciprocal 1/9.',
        ],
        ['-9', '9'],
      ),
      N(
        ['求(1/16)^(−3/4)。', 'Evaluate (1/16)^(−3/4).'],
        '8',
        [
          '四次根为1/2，三次幂为1/8，再倒数为8。',
          'The fourth root is 1/2, cubing gives 1/8, and reciprocating gives eight.',
        ],
        ['1/8', '-8'],
      ),
      N(
        [
          '求64^(2/6)；先约分指数。',
          'Evaluate 64^(2/6); first reduce the exponent.',
        ],
        '4',
        [
          '2/6=1/3，所以取64的立方根4。',
          '2/6=1/3, so take the cube root of 64 to get four.',
        ],
        ['8', '16'],
      ),
      E(
        [
          '比较25^(1/2)与方程x²=25的全部实根；为什么答案集合不同？',
          'Compare 25^(1/2) with all real solutions of x²=25. Why do the answers differ?',
        ],
        [
          '主值25^(1/2)=5；方程有x=−5和5，两者平方均25。正底数指数函数必须单值，±属于解方程。',
          'The principal value 25^(1/2)=5. The equation has x=−5 and five because both square to 25. Positive-base exponentiation is single-valued; ± belongs to solving the equation.',
        ],
      ),
    ],
    pick: {
      stem: [
        '本课采用正底数约定，哪项正确？',
        'Under this lesson’s positive-base convention, which is correct?',
      ],
      options: [
        ['√9=±3', '√9=±3'],
        ['9^(1/2)=3', '9^(1/2)=3'],
        ['9^(−1/2)=−3', '9^(−1/2)=−3'],
      ],
      feedback: [
        [
          '√记号给主值；方程x²=9才有两根。',
          'The radical denotes the principal value; x²=9 has two roots.',
        ],
        [
          '主平方根是非负的3。',
          'The principal square root is nonnegative three.',
        ],
        ['负指数给1/3，不是−3。', 'The negative exponent gives 1/3, not −3.'],
      ],
      correct: 1,
    },
    reason: [
      '有人将(−8)^(2/6)按“先平方再六次根”算成2，又按2/6=1/3算成−2。问题在哪？',
      'Someone evaluates (−8)^(2/6) as two by squaring then taking a sixth root, but as −2 after reducing 2/6=1/3. What went wrong?',
    ],
    rubric: [
      '对负底数不能无条件沿用正底数有理指数法则。约分后的奇分母可另定义实根，但不可换成未约分偶根随意重排。本课实验只承诺正底数，不把两种流程当恒等式。',
      'Positive-base rational-power laws cannot be extended unconditionally to negative bases. A reduced odd denominator can support a separate real-root convention, but an unreduced even root cannot be substituted freely. The lab promises positive bases only; these workflows are not an identity.',
    ],
    misconception: [
      '混淆主值与双根，或将正底数法则无条件搬到负底数。',
      'Confusing principal values with paired roots or applying positive-base laws to negative bases unconditionally.',
    ],
  },
  {
    title: ['指数函数的增长', 'Exponential growth'],
    objective: [
      '由相等输入步长的相同倍率识别指数增长或衰减。',
      'Identify exponential growth or decay through equal multipliers over equal input steps.',
    ],
    hook: [
      '每天多3个和每天变成3倍，四天后差在哪里？',
      'How do adding three each day and tripling each day differ after four days?',
    ],
    prerequisites: ['H03-L02', 'H02-L02', 'P62-L06'],
    keywords: [
      ['增长因子', 'growth factor'],
      ['衰减', 'decay'],
      ['渐近线', 'asymptote'],
    ],
    skill: 'exponential-equal-ratios',
    lab: 'exp-growth',
    hints: [
      [
        'y=C aˣ中C>0、a>0且a≠1；输入每增加1，输出乘a。',
        'In y=C aˣ use C>0, a>0 and a≠1. Increasing input by one multiplies output by a.',
      ],
      [
        'a>1递增，0<a<1递减；y始终正，趋近0不等于某步达到0。',
        'a>1 increases and 0<a<1 decreases. Outputs stay positive: approaching zero is not reaching zero at a finite step.',
      ],
    ],
    items: [
      N(
        [
          '纸上种群模型N(n)=3×2ⁿ，n为非负整数。求N(4)。',
          'A paper population model is N(n)=3×2ⁿ for nonnegative integers n. Find N(4).',
        ],
        '48',
        ['四次乘2，3×16=48。', 'Multiply by two four times: 3×16=48.'],
        ['24', '11'],
      ),
      N(
        [
          '假设每年减少20%，原来100单位。两年后多少？',
          'Assume a 20% reduction each year from 100 units. How much remains after two years?',
        ],
        '64',
        ['每年保留0.8，100×0.8²=64。', 'Retain 0.8 each year: 100×0.8²=64.'],
        ['60', '4'],
      ),
      N(
        [
          '连续模型y=5×2ˣ在x=−2时为多少？',
          'Evaluate the continuous model y=5×2ˣ at x=−2.',
        ],
        '5/4',
        [
          '2⁻²=1/4，因此输出5/4；负输入不代表负输出。',
          '2⁻²=1/4, so the output is 5/4. Negative input does not mean negative output.',
        ],
        ['-20', '20'],
      ),
      N(
        [
          '相等一步的输出为6、9、13.5，假定恒定倍率模型，求每步倍率。',
          'Outputs at equal one-step intervals are 6, 9, 13.5. Assuming a constant-multiplier model, find its multiplier.',
        ],
        '3/2',
        [
          '9/6=13.5/9=1.5；差不是常数。',
          '9/6=13.5/9=1.5; the differences are not constant.',
        ],
        ['3', '4.5'],
      ),
      N(
        [
          'y=7×(1/2)ˣ的纵截距是多少？',
          'What is the y-intercept of y=7×(1/2)ˣ?',
        ],
        '7',
        [
          'x=0时倍率的零次幂为1，所以纵截距7。',
          'At x=0 the multiplier to power zero is one, so the intercept is seven.',
        ],
        ['0', '1/2'],
      ),
      N(
        [
          '纸上模型有80单位，每步保留一半。首次不超过11单位在第几整步？',
          'A paper model starts at 80 units and halves per step. At which first whole step is it at most 11?',
        ],
        '3',
        [
          '第2步20>11，第3步10≤11；首次须核相邻两步。',
          'Step two gives 20>11; step three gives 10≤11. Check both adjacent steps for a first crossing.',
        ],
        ['2', '4'],
      ),
    ],
    pick: {
      stem: [
        '关于y=(1/2)ˣ（实数x），哪项正确？',
        'For y=(1/2)ˣ on real x, which is true?',
      ],
      options: [
        ['输出最终变成负数', 'Outputs eventually become negative'],
        ['严格递减且始终大于0', 'It strictly decreases and remains positive'],
        ['x=0时输出0', 'Its output at x=0 is zero'],
      ],
      feedback: [
        [
          '正底数的任意实数次幂保持正。',
          'A positive base to any real power remains positive.',
        ],
        [
          '每向右一步减半；0为水平渐近线。',
          'Each step right halves the value; zero is a horizontal asymptote.',
        ],
        ['非零底数的零次幂为1。', 'A nonzero base to power zero equals one.'],
      ],
      correct: 1,
    },
    reason: [
      '只观测到(0,2)、(1,4)，就能证明真实规律必是2×2ˣ吗？说明模型假设和离散域。',
      'Do observations (0,2), (1,4) prove the real rule must be 2×2ˣ? Discuss the model assumption and a discrete domain.',
    ],
    rubric: [
      '不能；2x+2也通过两点。只有额外假定恒定倍率才确定此指数模型。整数时间记录不能自动允许半步查询；连续延伸需要额外模型约定。',
      'No: 2x+2 also fits. The exponential model requires an additional constant-multiplier premise. Integer-time records do not automatically permit half-step queries; continuous extension is another modelling assumption.',
    ],
    misconception: [
      '将百分比减少当固定减数、将趋近0当达到0，或从有限点证明模型。',
      'Treating percentage decay as fixed subtraction, approaching zero as reaching it, or finite points as proof of a model.',
    ],
  },
  {
    title: ['对数是指数的逆运算', 'Logarithms as inverse exponents'],
    objective: [
      '在合法底数与真数条件下把对数改写为唯一指数。',
      'Rewrite a logarithm as a unique exponent under valid base and argument conditions.',
    ],
    hook: [
      '2的几次方等于1/8？这个“几”可以作为一种新运算的输出吗？',
      'Two to what power equals 1/8? Can that unknown exponent become the output of a new operation?',
    ],
    prerequisites: ['H03-L03', 'H02-L05'],
    keywords: [
      ['对数', 'logarithm'],
      ['真数', 'argument'],
      ['逆运算', 'inverse operation'],
    ],
    skill: 'log-inverse-domain',
    lab: 'exp-log',
    hints: [
      [
        'logₐb=c就是aᶜ=b，不是a×c=b，也不是b/a。',
        'logₐb=c means aᶜ=b, not a×c=b or b/a.',
      ],
      [
        '实数对数要求a>0、a≠1、b>0；0<a<1也合法，逆函数递减。',
        'Real logarithms require a>0, a≠1, b>0. Bases between zero and one are valid and yield decreasing inverses.',
      ],
    ],
    items: [
      N(
        ['求log₂(1/8)。', 'Evaluate log₂(1/8).'],
        '-3',
        ['2⁻³=1/8，所求指数是−3。', '2⁻³=1/8, so the required exponent is −3.'],
        ['1/16', '3'],
      ),
      N(
        ['求log₃1。', 'Evaluate log₃1.'],
        '0',
        ['3⁰=1，所以log₃1=0。', '3⁰=1, so log₃1=0.'],
        ['1', '3'],
      ),
      N(
        ['求log_(1/2)8。', 'Evaluate log_(1/2)8.'],
        '-3',
        [
          '(1/2)⁻³=8；小于1的合法底数不要求对数为正。',
          '(1/2)⁻³=8. A valid base below one need not give a positive logarithm.',
        ],
        ['3', '4'],
      ),
      N(
        ['已知log₅x=−2，求x。', 'Given log₅x=−2, find x.'],
        '1/25',
        [
          '改写5⁻²=x，得正数1/25，符合真数条件。',
          'Rewrite as 5⁻²=x to get positive 1/25, satisfying the argument domain.',
        ],
        ['-25', '-2/5'],
      ),
      N(
        ['求log₄8。', 'Evaluate log₄8.'],
        '3/2',
        [
          '4^(3/2)=(√4)³=8，所以对数为3/2。',
          '4^(3/2)=(√4)³=8, so the logarithm is 3/2.',
        ],
        ['2', '1/2'],
      ),
      N(
        [
          '纸上模型y=3×2ᵗ给输出12，求允许的实数时间t。',
          'A paper model y=3×2ᵗ gives output 12. Find real time t.',
        ],
        '2',
        [
          '先除以3得2ᵗ=4，再取指数t=log₂4=2。',
          'Divide by three to get 2ᵗ=4, then t=log₂4=2.',
        ],
        ['4', '3'],
      ),
    ],
    pick: {
      stem: ['哪一个有实数意义？', 'Which has a real value?'],
      options: [
        ['log₁7', 'log₁7'],
        ['log₂0', 'log₂0'],
        ['log_(1/2)4', 'log_(1/2)4'],
      ],
      feedback: [
        [
          '1的每个实数次幂都是1，不能有唯一逆指数。',
          'Every real power of one is one, so it cannot have a unique inverse exponent.',
        ],
        [
          '2的实数次幂始终正，不会等于0。',
          'Real powers of two stay positive and never equal zero.',
        ],
        [
          '底数正且不等于1，真数正；答案−2。',
          'The base is positive and not one; the argument is positive. The answer is −2.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '为什么log₂(−4)、log₁1不能作为本课实数对数？后者有指数解，为什么仍无定义？',
      'Why are log₂(−4) and log₁1 undefined as real logarithms here? The latter has exponent solutions; why is that insufficient?',
    ],
    rubric: [
      '2ˣ永远正，所以第一式没有实指数解；1ˣ=1对所有实数x成立，没有唯一指数。对数既需存在又需唯一，故底数必须正且不为1、真数正。',
      '2ˣ is always positive, so the first has no real exponent solution. 1ˣ=1 for every real x, so the exponent is not unique. A logarithm needs existence and uniqueness: positive base other than one and positive argument.',
    ],
    misconception: [
      '把log当除法、认为底数必须大于1，或忽略逆向唯一性。',
      'Treating log as division, requiring every base to exceed one, or ignoring inverse uniqueness.',
    ],
  },
  {
    title: ['对数运算法则', 'Logarithm laws'],
    objective: [
      '在保留原定义域的前提下，用同底指数结构推导乘积、商与幂的对数法则。',
      'Derive logarithm product, quotient and power laws from same-base exponents while retaining original domains.',
    ],
    hook: [
      'log₂8+log₂4能合并，log₂(8+4)也能拆开吗？',
      'log₂8+log₂4 can be combined. Can log₂(8+4) be split the same way?',
    ],
    prerequisites: ['H03-L04', 'H01-L05'],
    keywords: [
      ['乘积法则', 'product law'],
      ['换底', 'change of base'],
      ['定义域', 'domain'],
    ],
    skill: 'log-laws-domain',
    lab: 'exp-laws',
    hints: [
      [
        'a>0、a≠1且u,v>0时，logₐ(uv)=logₐu+logₐv。',
        'For a>0, a≠1 and u,v>0, logₐ(uv)=logₐu+logₐv.',
      ],
      [
        '商对应减法、幂对应系数；logₐb=log_cb/log_ca须c>0、c≠1。保留原真数条件。',
        'Quotients give differences and powers give coefficients. Change base by logₐb=log_cb/log_ca for c>0, c≠1. Keep original argument conditions.',
      ],
    ],
    items: [
      N(
        ['求log₂8+log₂4。', 'Evaluate log₂8+log₂4.'],
        '5',
        [
          '3+2=5，也等于log₂32；相加对应真数相乘。',
          '3+2=5, also log₂32. Adding logarithms corresponds to multiplying arguments.',
        ],
        ['12', '6'],
      ),
      N(
        ['求log₃81−log₃3。', 'Evaluate log₃81−log₃3.'],
        '3',
        ['4−1=3，也等于log₃(81/3)=log₃27。', '4−1=3, also log₃(81/3)=log₃27.'],
        ['-3', '27'],
      ),
      N(
        ['求2log₅5−log₅25。', 'Evaluate 2log₅5−log₅25.'],
        '0',
        [
          '2×1−2=0；同样log₅(5²/25)=log₅1=0。',
          '2×1−2=0; equivalently log₅(5²/25)=log₅1=0.',
        ],
        ['1', '2'],
      ),
      N(
        [
          '用log₂换底：log₈4=log₂4/log₂8，求值。',
          'Change to base two: log₈4=log₂4/log₂8. Evaluate.',
        ],
        '2/3',
        [
          '分子2、分母3，得到2/3；不能倒置。',
          'The numerator is two and denominator three, giving 2/3; do not reverse them.',
        ],
        ['3/2', '2'],
      ),
      N(
        [
          '求log₂(4+4)的确切值；先做括号内加法。',
          'Evaluate log₂(4+4) exactly; first add inside brackets.',
        ],
        '3',
        [
          'log₂8=3，而log₂4+log₂4=4，是可见反例。',
          'log₂8=3, whereas log₂4+log₂4=4, an explicit counterexample.',
        ],
        ['4', '8'],
      ),
      E(
        [
          '解log₂(x−1)+log₂(x+1)=3，保留定义域并检验全部候选。',
          'Solve log₂(x−1)+log₂(x+1)=3, retaining the domain and checking all candidates.',
        ],
        [
          '原条件x−1>0且x+1>0，得x>1。合并得log₂(x²−1)=3，故x²=9，候选±3中仅3满足原域；代回log₂2+log₂4=3。',
          'Original arguments require x>1. Combine to log₂(x²−1)=3, hence x²=9. Of candidates ±3 only three satisfies the original domain. Substitution gives log₂2+log₂4=3.',
        ],
      ),
    ],
    pick: {
      stem: ['哪条对全部x≠0成立？', 'Which holds for every nonzero real x?'],
      options: [
        ['log₂(x²)=2log₂x', 'log₂(x²)=2log₂x'],
        ['log₂(x²)=2log₂|x|', 'log₂(x²)=2log₂|x|'],
        ['log₂(x²)=log₂x+2', 'log₂(x²)=log₂x+2'],
      ],
      feedback: [
        [
          '右式只对x>0有实数意义，漏掉负x。',
          'The right side is real only for x>0, omitting negative inputs.',
        ],
        [
          '|x|>0且|x|²=x²，故此式保留x≠0的全部域。',
          '|x|>0 and |x|²=x², so this retains the full nonzero domain.',
        ],
        [
          '平方对应系数2，不是加2。',
          'Squaring gives a coefficient of two, not addition of two.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用u=aᵖ、v=aᑫ推导乘积法则，并用具体数反驳“和的对数等于对数的和”。',
      'Use u=aᵖ, v=aᑫ to derive the product law, then refute a proposed sum law with numbers.',
    ],
    rubric: [
      '写a>0、a≠1、u,v>0；uv=a^(p+q)，由唯一逆指数得logₐ(uv)=p+q。反例log₂(4+4)=3而log₂4+log₂4=4。有限例证明反例成立，通式推导证明乘积律。',
      'State a>0, a≠1, u,v>0. Then uv=a^(p+q), so unique inverse exponents give logₐ(uv)=p+q. Counterexample: log₂(4+4)=3 but log₂4+log₂4=4. The example refutes the sum law; the general derivation establishes the product law.',
    ],
    misconception: [
      '套用不存在的和法则，换底颠倒，或合并后扩大原定义域。',
      'Inventing a sum law, reversing change-of-base ratios or enlarging the original domain after combining.',
    ],
  },
  {
    title: ['指数与对数模型', 'Exponential and logarithmic models'],
    objective: [
      '用倍率模型求阈值时间，并按连续或整步情境解释与核验。',
      'Find threshold times with a multiplier model, interpreting and auditing continuous versus whole-step contexts.',
    ],
    hook: [
      '算出2.8天，是第2天还是第3天第一次达到目标？',
      'A calculation gives 2.8 days. Is the first whole-day crossing on day two or day three?',
    ],
    prerequisites: ['H03-L05', 'P62-L06', 'H01-L05', 'H02-L01'],
    keywords: [
      ['阈值', 'threshold'],
      ['时间单位', 'time unit'],
      ['模型假设', 'model assumption'],
    ],
    skill: 'exponential-model-threshold',
    lab: 'exp-model',
    hints: [
      [
        '先写N(t)=N₀aᵗ和t单位、允许范围；除去N₀后才反求指数。',
        'Write N(t)=N₀aᵗ with the time unit and admissible domain. Divide by N₀ before solving for the exponent.',
      ],
      [
        '连续交点t=log(目标/N₀)/log a；整步首次要核前一步和本步，衰减时不等号方向改变。',
        'The continuous crossing is t=log(target/N₀)/log a. For a first whole step check the previous and current steps; a decay base reverses inequality direction.',
      ],
    ],
    items: [
      N(
        [
          '虚构纸上模型N(n)=5×2ⁿ，仅n=0,1,…天可查。首次达到至少35在第几天？',
          'Fictional paper model N(n)=5×2ⁿ is checked only on whole days n=0,1,… . Find the first day at least 35.',
        ],
        '3',
        [
          '第2天20<35，第3天40≥35。连续交点log₂7≈2.807天，首次整日为3。',
          'Day two gives 20<35; day three gives 40≥35. The continuous crossing log₂7≈2.807 days rounds upwards to first whole day three.',
        ],
        ['2', '2.8'],
        'days',
      ),
      N(
        [
          '假定连续模型N(t)=5×2ᵗ；达到35的时间取最近0.1天。',
          'Assume the continuous model N(t)=5×2ᵗ. Find time to reach 35, to the nearest 0.1 day.',
        ],
        '2.8',
        [
          't=log₂7≈2.8073549天，最近0.1天为2.8；这是近似交点，不是整日首次。',
          't=log₂7≈2.8073549 days, rounded to 2.8 days. This is an approximate crossing, not a first whole-day index.',
        ],
        ['3', '7'],
        'days',
      ),
      N(
        [
          '虚构模型有80单位，每小时保留一半，仅整小时读数。首次不超过11在第几小时？',
          'A fictional model starts at 80 units and halves hourly, read only at whole hours. Find the first hour at most 11.',
        ],
        '3',
        [
          '第2小时20>11，第3小时10≤11；对衰减需寻找不超过目标。',
          'Hour two gives 20>11; hour three gives 10≤11. For decay the target condition is at most.',
        ],
        ['2', '4'],
        'h',
      ),
      N(
        [
          '纸上储量按每年增长10%的假设从100单位开始。两年后多少单位？',
          'A paper stock model starts at 100 units and assumes 10% annual growth. Find the stock after two years.',
        ],
        '121',
        [
          '倍率1.10，100×1.1²=121；增长率本身不是倍率。',
          'The multiplier is 1.10: 100×1.1²=121. The rate itself is not the multiplier.',
        ],
        ['120', '1'],
      ),
      N(
        [
          '假定正值模型N(n)=C aⁿ，每步1天；N(0)=6、N(2)=24。求每日倍率a。',
          'Assume N(n)=C aⁿ with positive C,a and one day per step. N(0)=6, N(2)=24. Find daily multiplier a.',
        ],
        '2',
        [
          'C=6，a²=24/6=4；a>0选2，不是把两天倍率4当每日倍率。',
          'C=6 and a²=24/6=4; positivity gives a=2. Four is the two-day multiplier, not the daily one.',
        ],
        ['4', '-2'],
      ),
      E(
        [
          '一张纸上地图的虚构存储量N(n)=80×(1/2)ⁿ，仅整天n≥0记录，显示限11。给出首次可满足的日数、相邻核验、单位与模型限制。',
          'A fictional map-storage model N(n)=80×(1/2)ⁿ is recorded only at whole days n≥0, with a limit of 11. Give the first feasible day, adjacent checks, units and a model limitation.',
        ],
        [
          '首次第3天：N(2)=20>11，N(3)=10≤11，且模型单调递减保证之前不行。说明每天恒定减半是假设，整数域无半天记录，有限观测不证明长期真实规律；本任务不涉及真实设备决策。',
          'First day three: N(2)=20>11 and N(3)=10≤11; monotone decay excludes earlier days. Constant daily halving is an assumption, the integer domain has no half-day records, and finite data do not prove a permanent real law. This is a paper model, not a device decision.',
        ],
      ),
    ],
    pick: {
      stem: [
        '每小时减少20%，时间以小时计，哪个倍率正确？',
        'For a 20% hourly reduction with time in hours, which multiplier is correct?',
      ],
      options: [
        ['0.2', '0.2'],
        ['0.8', '0.8'],
        ['−0.2', '−0.2'],
      ],
      feedback: [
        [
          '0.2表示只保留20%，与减少20%不同。',
          '0.2 retains only 20%, which differs from a 20% reduction.',
        ],
        [
          '原量的100%−20%=80%留下，倍率0.8。',
          '100%−20%=80% remains, giving multiplier 0.8.',
        ],
        [
          '负倍率不属于本课正值指数模型。',
          'A negative multiplier is outside this positive exponential model.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '“两个数据点完全吻合，所以该指数模型必然永远准确；把每小时倍率直接用于天即可。”纠正这段报告。',
      'Repair: “Two points fit, so this exponential model must remain exact forever; use the hourly multiplier directly for days.”',
    ],
    rubric: [
      '吻合只能支持在所给假设和范围内使用，不能证明机制与长期准确性。时间单位改变须换倍率：若每小时a，一天是a²⁴；明确连续/整数域和目标方向，并用原模型及单位检验结果。',
      'Fit supports use within stipulated assumptions and range, not proof of a mechanism or permanent accuracy. If the hourly multiplier is a, the daily multiplier is a²⁴. State continuous/integer domain and target direction, and audit with the original model and units.',
    ],
    misconception: [
      '把增长率当倍率、用四舍五入代替首次整步，或改变单位不改变倍率。',
      'Confusing rate with multiplier, rounding to nearest for a first whole step, or changing time units without changing the multiplier.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  const s = specs[i]!;
  if (v.answer.kind === 'explain')
    return reasoning(id, T(v.stem), s.skill, v.answer.rubric, s.hints.map(T));
  const value = 'value' in v.answer ? String(v.answer.value) : '';
  const result = numeric(
    id,
    T(v.stem),
    value,
    s.skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(v.step)],
    { accepted: [value], rejected: v.wrong },
  );
  result.answer = v.answer;
  return result;
}
function pick(id: string, i: number): Question {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h03Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H03-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H10',
    unit: 'H03',
    order: i + 1,
    nzYearHints: [10, 11, 12],
    cnGradeHints: [10],
    contentStatus: 'ready',
    skillTags: [s.skill],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(`${id}-Q6`, T(s.reason), s.skill, T(s.rubric), s.hints.map(T)),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: [
        t(
          '底数、真数、定义域与时间单位分别是什么？',
          'What are the base, argument, domain and time unit?',
        ),
        t(
          '能用逆运算或相邻两步检验，并解释为什么吗？',
          'Can you audit by an inverse operation or adjacent steps, and explain why?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上设计一个增长和一个衰减模型，写初量、每步倍率、单位、整数或连续时间、目标方向。预测后列至少五行数表并核首次整步的前一步；写明模型假设，由家长审核，勿把虚构资料当现实预测。',
            'Design one growth and one decay model on paper. State initial quantity, multiplier, unit, integer or continuous time and target direction. Predict, make at least five table rows and check the step before the first whole crossing. State assumptions for parent review; fictional data are not real predictions.',
          ),
        }
      : {}),
  };
});
export function h03ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H03-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H03 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    b = String(2 + Math.floor(k / (i === 2 ? 5 : 9))),
    n = (k % 9) - 4;
  let item: Item;
  if (i === 0)
    item = N(
      [`求${b}^(${n})。`, `Evaluate ${b}^(${n}).`],
      powerText(b, n),
      [
        '正指数重复乘，零指数为1，负指数取倒数。',
        'Multiply for positive exponents, use one at zero, and reciprocate for negative exponents.',
      ],
      ['999', '-999'],
    );
  else if (i === 1) {
    const a = 2 + Math.floor(k / 5),
      m = (k % 5) - 2;
    item = N(
      [
        `正底数：求${a ** 3}^(${m}/3)。`,
        `Positive base: evaluate ${a ** 3}^(${m}/3).`,
      ],
      powerText(String(a), m),
      [
        `先取立方根${a}，再取${m}次幂。`,
        `Take cube root ${a}, then power ${m}.`,
      ],
      ['999', '-999'],
    );
  } else if (i === 2)
    item = N(
      [
        `给定N(n)=3×${b}ⁿ，n为非负整数，求N(${k % 5})。`,
        `Given N(n)=3×${b}ⁿ on nonnegative integers, find N(${k % 5}).`,
      ],
      String(3 * Number(b) ** (k % 5)),
      [
        '初量乘倍率的步数次幂。',
        'Multiply the initial quantity by the multiplier to the step power.',
      ],
      ['999', '-999'],
    );
  else if (i === 3) {
    const v = powerText(b, n),
      result = exactLog(readPositive(b), readPositive(v))!;
    item = N(
      [`求log_${b}(${v})。`, `Evaluate log_${b}(${v}).`],
      textR(result),
      [
        `${b}^(${n})=${v}，所以所求指数为${n}。`,
        `${b}^(${n})=${v}, so the exponent is ${n}.`,
      ],
      ['999', '-999'],
    );
  } else if (i === 4) {
    const p = Math.floor(k / 4) + 1,
      r = (k % 4) + 1;
    item = N(
      [
        `求log₂(${2 ** p})−log₂(${2 ** r})。`,
        `Evaluate log₂(${2 ** p})−log₂(${2 ** r}).`,
      ],
      String(p - r),
      [
        `分别为${p}、${r}，相减得${p - r}；也可用商法则。`,
        `The values are ${p} and ${r}; subtract to get ${p - r}, or apply the quotient law.`,
      ],
      ['999', '-999'],
    );
  } else {
    const target = String(11 + k),
      initial = readPositive('5'),
      multiplier = readPositive('2'),
      first = firstWholeStep(initial, multiplier, readPositive(target))!;
    item = N(
      [
        `纸上模型5×2ⁿ，仅整天n≥0，首次至少${target}在第几天？`,
        `Paper model 5×2ⁿ on whole days n≥0: find the first day at least ${target}.`,
      ],
      String(first),
      [
        `第${first - 1}天${5 * 2 ** (first - 1)}<${target}，第${first}天${5 * 2 ** first}≥${target}。`,
        `Day ${first - 1}: ${5 * 2 ** (first - 1)}<${target}; day ${first}: ${5 * 2 ** first}≥${target}.`,
      ],
      ['999', '-999'],
      'days',
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h03CheckQuestions: Question[] = [
  q('H03-CHECK-Q1', 0, specs[0]!.items[2]!),
  q('H03-CHECK-Q2', 1, specs[1]!.items[3]!),
  q('H03-CHECK-Q3', 2, specs[2]!.items[1]!),
  q('H03-CHECK-Q4', 3, specs[3]!.items[4]!),
  q('H03-CHECK-Q5', 4, specs[4]!.items[5]!),
  pick('H03-CHECK-Q6', 4),
  q('H03-CHECK-Q7', 5, specs[5]!.items[0]!),
  q('H03-CHECK-Q8', 5, specs[5]!.items[5]!),
];
