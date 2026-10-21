import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
import { fenceAudit, motionAudit } from '../optimisationModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[] = ['999']) =>
  I(stem, { kind: 'number', value }, step, wrong);
const D = (
  stem: Pair,
  value: string,
  family: 'natural' | 'base' | 'trig',
  step: Pair,
  wrong: string[],
  rate = '1',
  base = 2,
) =>
  I(
    stem,
    { kind: 'advanced-derivative', value, family, rate, base },
    step,
    wrong,
  );
const C = (
  stem: Pair,
  value: Extract<AnswerSpec, { kind: 'advanced-code' }>['value'],
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'advanced-code', value }, step, wrong);
const S = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'finite-set', value }, step, wrong);
const E = (stem: Pair, step: Pair) =>
  I(stem, { kind: 'explain', rubric: T(step) }, step);
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
    title: [
      '多项式与指数函数求导复习',
      'Derivative review: polynomials and exponentials',
    ],
    objective: [
      '用求和、幂与指数规则求导，并保留复合内层与底数条件。',
      'Differentiate polynomial/exponential sums while retaining inner derivatives and base conditions.',
    ],
    hook: [
      'x³和3ˣ都有一个3，为什么求导规则不同？',
      'Why do x³ and 3ˣ need different derivative rules?',
    ],
    prerequisites: ['H25-L05', 'H26-L04', 'H03-L04'],
    keywords: [
      ['幂规则', 'power rule'],
      ['自然指数', 'natural exponential'],
      ['内层导数', 'inner derivative'],
    ],
    lab: 'optimisation-review',
    hints: [
      [
        '先辨变量在底还是指数；常数导数0，逐项求导，(eᵘ)′=u′eᵘ。',
        'Locate the variable in the base or exponent. Constants differentiate to zero; apply (eᵘ)′=u′eᵘ term by term.',
      ],
      [
        '(aˣ)′=ln(a)aˣ，实数全域要求a>0；a=1是常数。不要把aˣ套成xⁿ幂规则。',
        'For a>0, (aˣ)′=ln(a)aˣ; a=1 is constant. Do not apply the xⁿ rule to aˣ.',
      ],
    ],
    items: [
      D(
        [
          '求f(x)=3x³−2x+eˣ的导函数；用e^x或exp(x)输入。',
          'Differentiate f(x)=3x³−2x+eˣ. Use e^x or exp(x).',
        ],
        '9x^2-2+e^x',
        'natural',
        ['逐项求导：9x²−2+eˣ。', 'Differentiate term by term: 9x²−2+eˣ.'],
        ['3x^2-2+e^x', '9x^2-2', '9x^2+e^x'],
      ),
      D(
        ['求5e^(2x)的导数。', 'Differentiate 5e^(2x).'],
        '10e^(2x)',
        'natural',
        [
          '外层指数函数保留，乘内导2及系数5。',
          'Retain the exponential and multiply by inner rate two and coefficient five.',
        ],
        ['5e^(2x)', '10e^x'],
        '2',
      ),
      D(
        [
          '求2ˣ的导数，用ln(2)和2^x输入精确式。',
          'Differentiate 2ˣ, using ln(2) and 2^x in an exact expression.',
        ],
        'ln(2)*2^x',
        'base',
        [
          '底2的变化率因子是ln2，不是指数x。',
          'The base-two rate factor is ln2, not the exponent x.',
        ],
        ['2^x', '2x', 'x*2^x'],
      ),
      D(
        ['求e^(−x)的导数。', 'Differentiate e^(−x).'],
        '-e^(-x)',
        'natural',
        [
          '内层−x的导数−1，所以指数函数前变负。',
          'The inner derivative is −1, giving a negative exponential.',
        ],
        ['e^(-x)', '-e^x'],
        '-1',
      ),
      N(
        ['f(x)=x⁴+eˣ，求f′(0)。', 'For f(x)=x⁴+eˣ, find f′(0).'],
        '1',
        ['f′=4x³+eˣ，在0为0+1。', 'f′=4x³+eˣ, giving zero plus one at zero.'],
        ['0', '4'],
      ),
      E(
        [
          '解释x³、3ˣ、e^(2x)三种导数，并说明aˣ在a=1和a≤0时的实数全域问题。',
          'Explain derivatives of x³, 3ˣ and e^(2x), including the cases a=1 and a≤0 for aˣ over all real x.',
        ],
        [
          'x³是变量底的固定幂，导数3x²；3ˣ为固定正底指数，导数ln(3)3ˣ；e^(2x)还乘内导2。a=1给恒定1、导数0，和ln1=0一致。a≤0不能用这条实数全域指数规则：负底不对任意实指数有实值，零底也不覆盖全体实数。精确ln与指数不可随意换成舍入小数；几个数值吻合不证明导函数恒等。',
          'x³ is a fixed power of a variable base and differentiates to 3x². A fixed positive base 3 gives ln(3)3ˣ, and e^(2x) also needs inner factor two. Base one gives constant one and derivative zero, consistent with ln1=0. Nonpositive bases do not define this exponential rule on all real inputs: negative bases fail for some real exponents and zero does not cover the real line. Keep exact logarithms and exponentials; a few numerical matches do not prove identity.',
        ],
      ),
    ],
    pick: {
      stem: ['哪一个是e^(3x)的导数？', 'Which is the derivative of e^(3x)?'],
      correct: 2,
      options: [
        ['e^(3x)', 'e^(3x)'],
        ['3e^x', '3e^x'],
        ['3e^(3x)', '3e^(3x)'],
      ],
      feedback: [
        ['少了内导3。', 'The inner factor three is missing.'],
        ['内层3x须保留。', 'Retain the inner argument 3x.'],
        [
          '保留函数，再乘内导。',
          'Retain the function and multiply by the inner derivative.',
        ],
      ],
    },
    reason: [
      '为何“把指数降一次”不能用于2ˣ？用2⁰和它的导数值说明函数值、导数和底数条件。',
      'Why does “lower the exponent” fail for 2ˣ? Use x=0 to distinguish value, derivative and base conditions.',
    ],
    rubric: [
      '幂规则xⁿ的指数n固定，2ˣ的变量在指数，故用ln(2)2ˣ。x=0时函数值1、导数ln2，两者不同，不能凭函数值给变化率。底2正，指数函数对所有实数可定义；正底a的一般公式还包含a=1的恒定情形。复合指数需乘内导；完整解释由家长审核。',
      'The power rule holds for fixed exponent n, while the variable in 2ˣ is the exponent, giving ln(2)2ˣ. At zero its value is one and derivative ln2; value is not rate. Base two is positive, allowing all real inputs. The positive-base rule includes the constant case a=1. Composite exponentials require an inner derivative; a parent reviews the full distinction.',
    ],
    prompts: [
      ['变量在底还是指数？', 'Is the variable the base or the exponent?'],
      [
        '内层变化快几倍，哪项必须跟着变？',
        'Which factor changes when the inner input changes faster?',
      ],
    ],
    misconception: [
      'xⁿ与aˣ的变量位置不同，指数函数求导不能降指数。',
      'xⁿ and aˣ place the variable differently; exponential differentiation does not lower the exponent.',
    ],
  },
  {
    title: ['三角函数的导数', 'Derivatives of trig functions'],
    objective: [
      '在弧度制下应用正弦、余弦与正切导数，核验内导和定义域。',
      'Apply sine, cosine and tangent derivatives in radians, checking inner factors and domains.',
    ],
    hook: [
      '为什么sin x在0的斜率是1，而不是sin 0的值0？',
      'Why is the slope of sin x at zero one rather than its value zero?',
    ],
    prerequisites: ['H04-L01', 'H04-L02', 'H26-L04'],
    keywords: [
      ['弧度', 'radian'],
      ['相位变化率', 'phase rate'],
      ['定义域', 'domain'],
    ],
    lab: 'optimisation-trig',
    hints: [
      [
        '本课x为弧度：(sin x)′=cos x，(cos x)′=−sin x。函数值和导数值分开。',
        'Use radians: (sin x)′=cos x and (cos x)′=−sin x. Separate function value from slope.',
      ],
      [
        'sin(kx)、cos(kx)再乘k；tan导数1/cos²x，只在cos x≠0处。度数变量另有π/180因子。',
        'Multiply by k for sin(kx), cos(kx). Tangent has derivative 1/cos²x where cos x≠0. Degree inputs introduce π/180.',
      ],
    ],
    items: [
      D(
        [
          'x为弧度，求3sin(2x)的导数，用sin(…)或cos(…)。',
          'In radians, differentiate 3sin(2x), using sin(…) or cos(…).',
        ],
        '6cos(2x)',
        'trig',
        [
          '外导cos(2x)乘3与内导2。',
          'Multiply cos(2x) by three and inner rate two.',
        ],
        ['3cos(2x)', '6sin(2x)', '-6cos(2x)'],
        '2',
      ),
      D(
        ['弧度制，求4cos(3x)的导数。', 'In radians, differentiate 4cos(3x).'],
        '-12sin(3x)',
        'trig',
        [
          '余弦求导变负正弦，再乘3。',
          'Cosine becomes negative sine, with inner factor three.',
        ],
        ['12sin(3x)', '-4sin(3x)', '-12cos(3x)'],
        '3',
      ),
      D(
        [
          '弧度制，求sin(x)+cos(x)的导数。',
          'In radians, differentiate sin(x)+cos(x).',
        ],
        'cos(x)-sin(x)',
        'trig',
        [
          '逐项相加，余弦项给负正弦。',
          'Add derivatives; cosine contributes negative sine.',
        ],
        ['cos(x)+sin(x)', 'sin(x)-cos(x)'],
      ),
      N(
        [
          '弧度制f(x)=tan x，求f′(0)。',
          'For f(x)=tan x in radians, find f′(0).',
        ],
        '1',
        [
          '1/cos²0=1；tan0=0是函数值而非斜率。',
          '1/cos²0=1; tan0=0 is the value, not the slope.',
        ],
        ['0', '-1'],
      ),
      I(
        [
          '弧度制tan x在x=π/2处的导数？不存在该函数值时填undefined。',
          'What is the derivative of tan x at x=π/2? Enter undefined if the function is not defined there.',
        ],
        { kind: 'calculus-code', value: 'undefined' },
        [
          'cos(π/2)=0，tan本身未定义，不能声称斜率为很大有限数。',
          'Cosine is zero, so tangent itself is undefined; no large finite slope replaces this.',
        ],
        ['0', '1', '999'],
      ),
      E(
        [
          '说明弧度制公式为什么不能直接用于变量d（单位为度）的sin(πd/180)，并解释正切定义域。',
          'Explain why the radian formula cannot be applied unchanged to sin(πd/180) when d measures degrees. Include tangent’s domain.',
        ],
        [
          '令g(d)=sin(πd/180)，内层角度转弧度，所以g′(d)=(π/180)cos(πd/180)，在0为π/180而非1。sin x的标准导数公式默认弧度；余弦导数有负号。tan x=sin x/cos x，商法则得到1/cos²x，只适用于cos x≠0；π/2+kπ处函数和导数均未定义，图线不得跨渐近线连通。',
          'For g(d)=sin(πd/180), conversion to radians gives g′(d)=(π/180)cos(πd/180), so the slope at zero is π/180 rather than one. Standard sine differentiation assumes radians, and cosine carries a minus sign. The quotient rule gives (tan x)′=1/cos²x where cosine is nonzero. At π/2+kπ both function and derivative are undefined; plotted branches must not cross asymptotes.',
        ],
      ),
    ],
    pick: {
      stem: [
        'cos x求导时哪项必须保留？',
        'What must be retained when differentiating cos x?',
      ],
      correct: 0,
      options: [
        ['负号，导数−sin x', 'The minus sign: derivative −sin x'],
        ['仍为cos x', 'It remains cos x'],
        ['必为正数', 'It must be positive'],
      ],
      feedback: [
        [
          '这与余弦在0右侧下降一致。',
          'This agrees with cosine decreasing just to the right of zero.',
        ],
        ['函数与斜率不同。', 'The function differs from its slope.'],
        ['导数随x改变符号。', 'The derivative changes sign with x.'],
      ],
    },
    reason: [
      'sin(2x)在0的函数值是0，导数却是2，是否矛盾？解释单位和内导。',
      'sin(2x) has value zero at zero but derivative two. Is this contradictory? Explain units and the inner factor.',
    ],
    rubric: [
      '函数值表示输出位置，导数表示每输入单位的瞬时变化率，二者不必相等。弧度制中导数2cos(2x)，在0为2；2来自内层角2x对x的导数。若x改成度数变量，需先乘π/180的换算因子，不能借同一个图的数字刻度假设斜率公式不变。数值近似可启发，规则及单位给出理由。',
      'Value describes output, while derivative describes instantaneous change per input unit; equality is not required. In radians the derivative is 2cos(2x), equal to two at zero, with factor two from the inner angle. A degree variable requires a π/180 conversion factor; numerical axis labels do not preserve the slope formula across units. Approximations illustrate the result, while rules and units justify it.',
    ],
    prompts: [
      ['此处输入单位是什么？', 'What is the input unit here?'],
      [
        '余弦的负号和内导各来自哪里？',
        'Where do the cosine minus sign and inner factor come from?',
      ],
    ],
    misconception: [
      '标准三角导数默认弧度；渐近线附近的大读数不等于在那里有导数。',
      'Standard trig derivatives assume radians; large nearby values do not define a derivative at an asymptote.',
    ],
  },
  {
    title: ['隐函数求导入门', 'Introduction to implicit differentiation'],
    objective: [
      '沿曲线把y视作x的局部函数，判断斜率公式的适用条件。',
      'Treat y locally as a function along a curve and check when the implicit slope formula applies.',
    ],
    hook: [
      '圆的同一x可以有两个y，还能在一个具体点求切线斜率吗？',
      'A circle has two y-values at some x. Can a selected point still have a tangent slope?',
    ],
    prerequisites: ['H26-L04', 'H22-L03'],
    keywords: [
      ['局部分支', 'local branch'],
      ['隐函数导数', 'implicit derivative'],
      ['奇点', 'singular point'],
    ],
    lab: 'optimisation-implicit',
    hints: [
      [
        '先代回曲线核点。沿F(x,y)=0求导，y²给2yy′，不是2y。',
        'First substitute the point into the curve. Along F(x,y)=0, y² differentiates to 2yy′, not 2y.',
      ],
      [
        'Fy≠0才用y′=−Fx/Fy；Fy=0且Fx≠0检查竖直切线，两者都0不能据此定唯一切线。',
        'Use y′=−Fx/Fy when Fy≠0. If Fy=0, Fx≠0 check a vertical tangent; if both vanish, the formula alone gives no unique tangent.',
      ],
    ],
    items: [
      N(
        [
          '在圆x²+y²=25的点(3,4)，求dy/dx。',
          'Find dy/dx at (3,4) on x²+y²=25.',
        ],
        '-3/4',
        ['2x+2yy′=0，y′=−x/y=−3/4。', '2x+2yy′=0 gives y′=−x/y=−3/4.'],
        ['3/4', '-4/3', '-3'],
      ),
      N(
        [
          '同一圆在(0,5)的dy/dx是多少？',
          'Find dy/dx at (0,5) on the same circle.',
        ],
        '0',
        [
          'y非0，可除得−0/5=0，是水平切线。',
          'Since y≠0, −0/5=0 gives a horizontal tangent.',
        ],
        ['5', 'undefined'],
      ),
      C(
        [
          '圆x²+y²=25在(5,0)的类型？竖直写vertical，奇点写singular，不在曲线写off-curve。',
          'Classify (5,0) on the circle: vertical, singular or off-curve.',
        ],
        'vertical',
        [
          'Fy=0、Fx=10非0，切线x=5竖直；dy/dx不是有限数。',
          'Fy=0 but Fx=10, so x=5 is vertical; dy/dx is not finite.',
        ],
        ['singular', 'off-curve', '0'],
      ),
      C(
        [
          '曲线x²−y²=0在(0,0)的类型？填vertical、singular或off-curve。',
          'Classify (0,0) on x²−y²=0 as vertical, singular or off-curve.',
        ],
        'singular',
        [
          '两偏导都0，曲线有y=x与y=−x两分支，不能给唯一斜率。',
          'Both partials vanish; branches y=x and y=−x have different slopes.',
        ],
        ['vertical', '0', 'off-curve'],
      ),
      C(
        [
          '拟在圆x²+y²=25的(3,3)用−x/y求切线。点的类型？填vertical、singular或off-curve。',
          'Before using −x/y at (3,3) on x²+y²=25, classify the point: vertical, singular or off-curve.',
        ],
        'off-curve',
        [
          '9+9=18≠25，代数比值−1不是该圆在该点的斜率。',
          'Nine plus nine is eighteen, not 25; ratio −1 is not a tangent slope on that circle.',
        ],
        ['vertical', 'singular', '-1'],
      ),
      E(
        [
          '推导圆的隐导数，并对(3,4)、(5,0)和交叉曲线原点解释公式的能力与限制。',
          'Derive the circle’s implicit slope and explain its use at (3,4), failure at (5,0) and the crossing curve’s origin.',
        ],
        [
          '局部沿圆有x²+y(x)²=25，链式求导为2x+2yy′=0；y≠0时y′=−x/y。(3,4)在圆上且y非0，所以斜率−3/4。圆(5,0)的Fy0、Fx非0，可给竖直切线x=5，但不能给有限dy/dx。交叉曲线x²−y²=0在原点两偏导0，实际有两条斜率±1分支，0/0不能解释成0或竖直。先核点，再核局部分支条件，解释由人复核。',
          'Along a local circle branch x²+y(x)²=25, the chain rule gives 2x+2yy′=0 and y′=−x/y when y≠0. The point (3,4) lies on the circle and has slope −3/4. At (5,0), Fy=0 but Fx≠0, giving vertical tangent x=5 without a finite dy/dx. The crossing x²−y²=0 has both partials zero at the origin and two branches with slopes ±1. Treating 0/0 as zero or vertical is invalid. Verify the point and local conditions before interpreting the formula.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对y(x)²关于x求导，哪项正确？',
        'Differentiate y(x)² with respect to x.',
      ],
      correct: 1,
      options: [
        ['2y', '2y'],
        ['2y·dy/dx', '2y·dy/dx'],
        ['(dy/dx)²', '(dy/dx)²'],
      ],
      feedback: [
        ['漏了y随x变化的内导。', 'The inner derivative of y is missing.'],
        ['链式法则保留内导。', 'The chain rule retains the inner derivative.'],
        [
          '求导不等于将导数平方。',
          'Differentiation does not square the derivative.',
        ],
      ],
    },
    reason: [
      '为什么“分母y=0，所以一定是竖直切线”不可靠？比较圆和交叉曲线。',
      'Why is “y=0 implies a vertical tangent” unreliable? Compare the circle and crossing curve.',
    ],
    rubric: [
      '必须先核点在曲线上，然后看完整隐关系。圆端点(5,0)有Fx10非0、Fy0，能由x作为y的局部函数确认竖直切线。交叉曲线原点Fx、Fy都0，有两条不同斜率分支，并不唯一竖直；分母0只说明当前除法不合法，不能替代几何或局部条件检查。',
      'First verify curve membership and the complete implicit relation. At circle endpoint (5,0), Fx=10 and Fy=0; solving x locally as a function of y confirms a vertical tangent. At the crossing origin both partials vanish and two different slopes exist. A zero denominator only blocks this division; it does not replace geometric or local-condition checks.',
    ],
    prompts: [
      [
        '这个点先代回原曲线了吗？',
        'Have you checked the point in the original curve?',
      ],
      [
        '不能除以这个量时，还知道哪些几何信息？',
        'When division fails, what geometric information remains?',
      ],
    ],
    misconception: [
      '圆非全局单值函数仍可有局部导数；0/0不自动给竖直切线。',
      'A circle can have local derivatives without being a global function; 0/0 does not imply a vertical tangent.',
    ],
  },
  {
    title: ['局部与全局最值', 'Local and global extrema'],
    objective: [
      '在给定区间核全部候选与端点是否取到，区分局部转折和全局最值。',
      'Audit all candidates and endpoint attainment on a stated interval, separating local turns from global extrema.',
    ],
    hook: [
      '找到一个导数为零的点，是否就找到最大值？开端点会改变答案吗？',
      'Does a zero derivative locate the maximum? What changes at an excluded endpoint?',
    ],
    prerequisites: ['H26-L02', 'H28-L03'],
    keywords: [
      ['候选点', 'candidate'],
      ['端点是否包含', 'endpoint inclusion'],
      ['取到', 'attainment'],
    ],
    lab: 'optimisation-extrema',
    hints: [
      [
        '连续闭区间上比较内点f′=0、不可导点和两端点；先查定理条件。',
        'On a continuous closed interval compare interior stationary and nondifferentiable points plus both endpoints; check the theorem’s conditions.',
      ],
      [
        '最大值是输出，取到位置是输入集合。开端点的极限可能只给上/下确界，并未取到。',
        'The extreme value is an output; its locations form an input set. An open endpoint limit may be a bound without attainment.',
      ],
    ],
    items: [
      S(
        [
          'f(x)=x³−3x，x∈[−2,2]。求取到全局最大值的全部x集合。',
          'For f(x)=x³−3x on [−2,2], give all locations of the global maximum.',
        ],
        '{-1,2}',
        [
          '候选−2,−1,1,2的函数值−2,2,−2,2；最大2在−1与2。',
          'Candidate values at −2,−1,1,2 are −2,2,−2,2. Maximum two occurs at −1 and two.',
        ],
        ['{-1}', '{2}', '{1,-2}'],
      ),
      N(
        [
          '同一函数和区间的全局最小值是多少（填输出值）？',
          'For the same function and interval, find the global minimum value, not its locations.',
        ],
        '-2',
        ['在−2和1都取到−2。', 'Both −2 and one attain value −2.'],
        ['1', '-1', '2'],
      ),
      C(
        [
          'f(x)=x²在(0,2)的最小值是否取到？若未取到填not-attained。',
          'Does x² attain a minimum on (0,2)? Enter not-attained if it does not.',
        ],
        'not-attained',
        [
          '下确界0，但x=0不在域内，所有允许输出均正。',
          'Infimum zero is excluded; every admissible output is positive.',
        ],
        ['0', '2', 'neither'],
      ),
      I(
        [
          'f(x)=x³在x=0有f′=0，是严格局部极大、极小还是都不是？填local-max、local-min或neither。',
          'For x³ at zero, classify strict local maximum, minimum or neither.',
        ],
        { kind: 'analysis-code', value: 'neither' },
        [
          '0左右仍递增，没有转折；驻点只是一种候选。',
          'The function increases through zero; a stationary point is only a candidate.',
        ],
        ['local-max', 'local-min'],
      ),
      S(
        [
          'f(x)=|x|在[−2,1]，求取到全局最小值的完整x集合。',
          'For |x| on [−2,1], give all locations of the global minimum.',
        ],
        '{0}',
        [
          '0处不可导却是最小值位置，不能只找导数为0。',
          'Zero is nondifferentiable but minimises the function; stationary points alone are insufficient.',
        ],
        ['{}', '{-2}', '{1}'],
      ),
      E(
        [
          '比较连续闭区间定理、开区间x²以及|x|尖点。用x³−3x的全部候选说明局部与全局的区别。',
          'Compare the closed-interval theorem, x² on an open interval and the corner of |x|. Use every candidate of x³−3x to distinguish local and global results.',
        ],
        [
          '连续函数在非空闭有界区间必取到最大最小，但定理不声称唯一或都在驻点。x³−3x在[−2,2]须比−2、−1、1、2，输出分别−2、2、−2、2，两个全局最大与两个全局最小位置均须保留。局部转折只比较附近，端点也可能是全局最优。x²在(0,2)无最小和最大，界0与4未取到；|x|在含0区间的不可导尖点仍可能最小。',
          'A continuous function attains extrema on a nonempty closed bounded interval, without a uniqueness or stationary-location guarantee. For x³−3x on [−2,2], candidates −2,−1,1,2 have values −2,2,−2,2; retain both locations of each global extreme. Local turns compare only nearby inputs, while endpoints can be globally best. On (0,2), x² attains neither bound zero nor four. A nondifferentiable corner such as |x| at zero may still minimise.',
        ],
      ),
    ],
    pick: {
      stem: [
        '闭区间全局最值检查中不能漏掉什么？',
        'What must not be omitted from a closed-interval global search?',
      ],
      correct: 2,
      options: [
        ['只要驻点就够', 'Stationary points alone suffice'],
        ['只看图最高像素', 'Only the highest plotted pixel'],
        [
          '端点和内点不可导候选',
          'Endpoints and interior nondifferentiable candidates',
        ],
      ],
      feedback: [
        ['可能漏端点与尖点。', 'This misses endpoints and corners.'],
        [
          '有限视窗与分辨率不是证明。',
          'Finite plotting resolution is not a proof.',
        ],
        [
          '还要比较全部候选的精确值。',
          'Compare exact values at all candidates.',
        ],
      ],
    },
    reason: [
      '“f′(a)=0所以a是最大值点”漏了什么？给反例并说明怎样完善检查。',
      'What is missing from “f′(a)=0, so a maximises f”? Give a counterexample and repair the procedure.',
    ],
    rubric: [
      'x³在0导数0但左右递增，所以既非严格局部极大也非极小。即使是局部极大也未必全局；必须先给定义域，查连续性与区间条件，列内点驻点及不可导候选、包含的端点，比较输出且保留并列位置。开端点可能只趋近而不能取到；图形或有限试点不能取代覆盖整个域的论证。',
      'x³ has derivative zero at zero but increases through it, giving neither strict local extreme. Even a local maximum need not be global. Specify domain, continuity and interval conditions; collect stationary and nondifferentiable candidates and included endpoints, compare values and retain ties. Excluded endpoints may only be approached. A picture or selected trials cannot replace an argument covering the domain.',
    ],
    prompts: [
      [
        '你报的是最值，还是取到它的位置？',
        'Are you reporting the extreme value or its locations?',
      ],
      [
        '所有候选和开闭端点都检查了吗？',
        'Have you checked all candidates and endpoint inclusion?',
      ],
    ],
    misconception: [
      '导数零既不充分保证极值，也不是所有极值的必要形式；全局判断须保留域。',
      'A zero derivative does not guarantee an extreme or describe all extremes; global claims require the domain.',
    ],
  },
  {
    title: ['约束条件下的优化', 'Optimisation under constraints'],
    objective: [
      '将三边围栏约束消元为面积函数，比较边界和整数域中的全部最优解。',
      'Reduce a three-sided fence constraint to an area function and compare boundary and integer optima.',
    ],
    hook: [
      '连续最优深度6米，如果深度最多4米，导数为零还管用吗？',
      'If the unconstrained best depth is six metres but depth is capped at four, does the stationary point still solve it?',
    ],
    prerequisites: ['H31-L04', 'H28-L01', 'J93-L05'],
    keywords: [
      ['可行域', 'feasible domain'],
      ['消元', 'elimination'],
      ['并列最优', 'tied optima'],
    ],
    lab: 'optimisation-fence',
    hints: [
      [
        '靠直墙围矩形，只围两条深度x和一条宽度y。2x+y=L，x>0、y>0，另有x≤c。',
        'Against a straight wall, fence two depths x and width y: 2x+y=L, x>0,y>0 and depth cap x≤c.',
      ],
      [
        '面积A=x(L−2x)，连续驻点L/4还须在域内。整数域检查邻近允许整数及边界，保留并列。',
        'Area is x(L−2x). The continuous stationary point L/4 must be feasible. For integer dimensions check nearby allowed integers and boundaries, retaining ties.',
      ],
    ],
    items: [
      N(
        [
          '三边围栏L=24米，深度x>0、宽y>0且x≤4，连续长度。使面积最大时x多少米？',
          'A three-sided fence has L=24 m, x>0,y>0 and depth x≤4, with continuous lengths. Find the maximising depth in metres.',
        ],
        '4',
        [
          'A=24x−2x²在0<x≤4递增，最优在约束端点4，不是不可行驻点6。',
          'A=24x−2x² increases on 0<x≤4; the cap four wins, not infeasible stationary point six.',
        ],
        ['6', '12'],
      ),
      N(
        [
          '同一L24、上限4的最大面积多少平方米？',
          'For L24 and cap four, find maximum area in square metres.',
        ],
        '64',
        [
          'x4，y24−8=16，面积64。',
          'Depth four gives width sixteen and area64.',
        ],
        ['72', '96'],
      ),
      N(
        [
          '改成L24、深度上限9，连续长度的最优x多少？',
          'For L24 with cap nine and continuous lengths, find the optimal depth.',
        ],
        '6',
        [
          '驻点6可行，面积72；配方A=72−2(x−6)²证明全域最大。',
          'Stationary point six is feasible; A=72−2(x−6)² proves maximum72.',
        ],
        ['9', '4'],
      ),
      S(
        [
          'L=22米，深度上限9米，x与y都须为整米。求全部最优深度x集合。',
          'L=22 m, cap nine, and both dimensions must be whole metres. Give all optimal depths.',
        ],
        '{5,6}',
        [
          '连续最优5.5，整数5和6都给面积60；不能只四舍五入留一个。',
          'Continuous optimum is5.5; integer depths five and six both give area60.',
        ],
        ['{5}', '{6}', '{5.5}'],
      ),
      C(
        [
          'L24但深度x≤0，又要求x>0、y>0。填empty-domain或not-attained。',
          'With L24 and x≤0 but x>0,y>0 required, enter empty-domain or not-attained.',
        ],
        'empty-domain',
        [
          '没有任何满足约束的矩形，不能把零面积退化图称为最优可行解。',
          'No rectangle meets the constraints; a degenerate zero-area drawing is not feasible.',
        ],
        ['not-attained', '0', '6'],
      ),
      E(
        [
          '给出L24、深度上限4的建模与最优证明，再比较L22整米情形。说明不能只套驻点或四舍五入。',
          'Model and prove the optimum for L24 with depth cap four, then compare L22 with whole-metre lengths. Explain why stationary points or rounding alone are insufficient.',
        ],
        [
          '三边总长2x+y=L，正边长给0<x<L/2，深度上限再交x≤c。消元得A=Lx−2x²。L24、c4时A′=24−4x>0于可行域，故最大在x4、y16、A64，驻点6不可行。L22的连续最优5.5，但整米需比较5、6及可行边界；二者面积60并列，不能只保留舍入值。c0时域空，零面积不是可行最优。假设直墙、无接缝损耗与整长围栏均须报告。',
          'Three-side length 2x+y=L and positive sides give 0<x<L/2, intersected with x≤c. Eliminate y to get A=Lx−2x². At L24,c4, derivative24−4x is positive throughout the domain, so x4,y16,area64 is optimal; stationary six is infeasible. At L22 the continuous optimum5.5 must be replaced by comparison of feasible whole depths five and six plus boundaries. Both areas are60, so rounding cannot discard a tie. Cap zero gives an empty domain, not a feasible zero-area optimum. State the straight-wall and no-loss assumptions.',
        ],
      ),
    ],
    pick: {
      stem: [
        '导数方程给x6，但约束x≤4，应怎样做？',
        'The derivative gives x6 but the constraint is x≤4. What next?',
      ],
      correct: 0,
      options: [
        [
          '在可行域重新比较边界与候选',
          'Recheck candidates and boundaries within the feasible domain',
        ],
        ['忽略约束用6', 'Ignore the constraint and use six'],
        ['直接说没有任何矩形', 'Declare no rectangle possible'],
      ],
      feedback: [
        ['可行域里仍可能有端点最优。', 'A feasible endpoint may optimise.'],
        ['不可行点不能执行。', 'An infeasible point cannot be implemented.'],
        ['0<x≤4仍有可行矩形。', 'Positive depths up to four remain feasible.'],
      ],
    },
    reason: [
      'L22、整米、上限9时，为什么“连续答案5.5，四舍五入6”不是完整解？',
      'For L22, whole metres and cap nine, why is rounding5.5 to six incomplete?',
    ],
    rubric: [
      '目标是所有可行整数中的最大面积，不能把连续变量结果直接当整数证明。A=60.5−2(x−5.5)²，离中心最近的允许整数5和6等距，各面积60；更远整数面积更小，边界也受这个恒等式覆盖。应报告两组尺寸(5,12)、(6,10)，均满足2x+y22、正边长与上限9，并明确面积单位平方米。',
      'The objective is a maximum over all feasible integers, requiring more than rounding a continuous optimum. A=60.5−2(x−5.5)²; the closest allowed integers five and six are equally distant, each area60, while farther integers do worse. This identity also covers boundaries. Report both dimension pairs(5,12),(6,10), verify length22, positivity and cap nine, and use square metres for area.',
    ],
    prompts: [
      ['消元后还保留了哪些约束？', 'Which constraints survive elimination?'],
      [
        '为什么你的候选覆盖所有整数，含并列？',
        'Why do your candidates cover all integers and ties?',
      ],
    ],
    misconception: [
      '驻点须可行；整数最优可能并列，不能盲目舍入连续答案。',
      'Stationary points must be feasible; integer optima can tie, so blind rounding is insufficient.',
    ],
  },
  {
    title: ['运动中的速度与加速度', 'Velocity and acceleration'],
    objective: [
      '从位置的两阶导数解释方向与速率变化，并按转向点分段计算路程。',
      'Interpret direction and speed change from two position derivatives, splitting distance at reversals.',
    ],
    hook: [
      '物体回到起点，路程一定是0吗？速度为负就一定在减速吗？',
      'If an object returns to its start, is distance zero? Does negative velocity mean slowing down?',
    ],
    prerequisites: ['H31-L01', 'H26-L05'],
    keywords: [
      ['有向速度', 'signed velocity'],
      ['速率', 'speed'],
      ['转向分段', 'split at reversals'],
    ],
    lab: 'optimisation-motion',
    hints: [
      [
        '位置s(t)=t³−6t²+9t（米），t为秒。v=s′，a=v′，速率=|v|；v与a同号时速率增大。',
        'Position s(t)=t³−6t²+9t in metres with seconds t. v=s′, a=v′, speed=|v|; matching nonzero signs increase speed.',
      ],
      [
        '0至4秒先找v=0的1、3秒，按单调段累加位置变化绝对值；位移只用终点减起点。',
        'On0–4 seconds, zeros of v are one and three. Sum absolute position changes on monotone pieces; displacement uses only final minus initial.',
      ],
    ],
    items: [
      N(
        [
          's(t)=t³−6t²+9t米，0≤t≤4秒。求总路程（米）。',
          'For s(t)=t³−6t²+9t metres on0≤t≤4 seconds, find total distance in metres.',
        ],
        '12',
        [
          '位置0→4→0→4，对应0、1、3、4秒，路程4+4+4=12。',
          'Positions0→4→0→4 at times0,1,3,4 give distance twelve.',
        ],
        ['4', '0', '8'],
      ),
      N(
        [
          '同一运动0至4秒的有向位移多少米？',
          'Find signed displacement over0–4 seconds for the same motion.',
        ],
        '4',
        [
          's4−s0=4−0=4，不把返程绝对值加到位移里。',
          's4−s0=4; do not add absolute return changes to displacement.',
        ],
        ['12', '-4'],
      ),
      N(
        [
          '同一运动在t=2秒的有向速度多少米/秒？',
          'Find signed velocity at t=2 seconds.',
        ],
        '-3',
        ['v=3t²−12t+9，在2为−3。', 'v=3t²−12t+9 equals−3 at two.'],
        ['3', '0'],
      ),
      N(
        ['同一运动在t=2秒的速率多少米/秒？', 'Find speed at t=2 seconds.'],
        '3',
        [
          '速率|−3|=3，与负方向分开。',
          'Speed is absolute velocity, three, independent of its negative direction.',
        ],
        ['-3', '0'],
      ),
      C(
        [
          '同一运动t=0秒的速度9、加速度−12。速率瞬时增加还是减小？填speeding-up或slowing-down。',
          'At t=0, velocity nine and acceleration−12. Is speed increasing or decreasing? Enter speeding-up or slowing-down.',
        ],
        'slowing-down',
        [
          '非零速度与加速度异号，va<0，速率减小；不能只看加速度是否正。',
          'Opposite nonzero signs give va<0 and decreasing speed; acceleration sign alone does not decide.',
        ],
        ['speeding-up', 'instant-rest', 'neither'],
      ),
      E(
        [
          '解释0至4秒的位置、速度、加速度、路程与位移；再说明瞬时静止、a=0以及位置加常数的意义。',
          'Explain position, velocity, acceleration, distance and displacement over0–4 seconds. Include instantaneous rest, a=0 and adding a position constant.',
        ],
        [
          'v=3(t−1)(t−3)、a=6t−12。v在0–1正、1–3负、3–4正，1和3为瞬时静止且前后符号变化，所以转向。位置0、4、0、4给位移4米、路程12米；平均速度1米/秒、平均速率3米/秒。t2时v−3、a0，只能说该瞬间速率导数0，不表示整段静止或匀速。非零v与a同号速率增大、异号减小；位置加10米不改导数、位移或路程。',
          'v=3(t−1)(t−3) and a=6t−12. Velocity is positive on0–1, negative on1–3 and positive on3–4. At one and three the object is instantaneously at rest and reverses because the signs change. Positions0,4,0,4 give displacement four metres and distance twelve, average velocity one and average speed three metres per second. At two, v=−3 and a=0: the instantaneous speed derivative is zero, not an interval of rest or constant speed. Matching nonzero v,a signs increase speed; opposite signs decrease it. Adding ten metres to position changes neither derivatives nor displacement or distance.',
        ],
      ),
    ],
    pick: {
      stem: [
        '负速度、负加速度且都非0，说明什么？',
        'What follows from negative nonzero velocity and acceleration?',
      ],
      correct: 1,
      options: [
        ['必定减速', 'It must slow down'],
        ['负方向运动且速率增大', 'It moves negatively and speeds up'],
        ['速率为负', 'Its speed is negative'],
      ],
      feedback: [
        ['同号使速率增大。', 'Matching signs increase speed.'],
        [
          'v定方向，va定速率增减。',
          'v gives direction; va gives speed change.',
        ],
        ['速率是绝对值，非负。', 'Speed is an absolute value and nonnegative.'],
      ],
    },
    reason: [
      '为何路程不能只算|s(4)−s(0)|？v=0一定转向吗？用本例与另一简单位置函数解释。',
      'Why is |s(4)−s(0)| insufficient for distance? Must v=0 imply reversal? Use this motion and another simple position function.',
    ],
    rubric: [
      '本例1、3秒转向，直接|4−0|=4只给位移大小，漏掉往返。按v符号分段，绝对变化4+4+4=12米。v=0仅瞬时静止，需看左右符号；例如s=t³在0速度3t²=0但两侧非负，没有转向。加速度与速度单位不同，速率|v|不表示方向；全段运动结论不能从单一时刻推出。',
      'This motion reverses at one and three, so |4−0| gives only displacement magnitude and misses returns. Split by velocity sign and add4+4+4=12 metres. Zero velocity means instantaneous rest; reversal requires a sign change. For s=t³ at zero, v=3t² vanishes but stays nonnegative, so no reversal. Acceleration and velocity have different units, speed has no direction, and one instant does not determine an interval’s motion.',
    ],
    prompts: [
      [
        '负号在表达方向，还是大小？',
        'Does this minus sign describe direction or magnitude?',
      ],
      [
        '你在哪里分段，怎样知道那里转向？',
        'Where do you split, and how do you know reversal occurs?',
      ],
    ],
    misconception: [
      '速率不带方向；零速度不必转向，零加速度不保证一整段匀速。',
      'Speed has no direction; zero velocity need not reverse, and zero acceleration at one instant does not guarantee constant speed over an interval.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `optimisation-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(
      id,
      T(item.stem),
      skill,
      item.answer.rubric,
      s.hints.map(T),
    );
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(item.step)],
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
    `optimisation-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h31Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H31-L0${i + 1}`;
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
    unit: 'H31',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`optimisation-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `optimisation-${i + 1}`,
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
    ...(i === 5 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h31ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H31-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H31 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = D(
      [`求${a}x³+${b}e^(2x)的导数。`, `Differentiate ${a}x³+${b}e^(2x).`],
      `${3 * a}x^2+${2 * b}e^(2x)`,
      'natural',
      [
        '分别用幂规则与指数链式法则。',
        'Apply the power rule and exponential chain rule separately.',
      ],
      ['999'],
      '2',
    );
  else if (i === 1)
    item = D(
      [
        `弧度制，求${a}sin(${b}x)的导数。`,
        `In radians, differentiate ${a}sin(${b}x).`,
      ],
      `${a * b}cos(${b}x)`,
      'trig',
      [
        '变余弦并乘原系数及内导。',
        'Use cosine and multiply by both coefficient and inner rate.',
      ],
      ['999'],
      String(b),
    );
  else if (i === 2) {
    const d = b + 6,
      r = 5 + b,
      den = d * d + a * a,
      x = textR(rational(BigInt(r * (d * d - a * a)), BigInt(den))),
      y = textR(rational(BigInt(r * 2 * a * d), BigInt(den)));
    item = N(
      [
        `圆x²+y²=${r * r}在(${x},${y})的dy/dx是多少？`,
        `Find dy/dx on x²+y²=${r * r} at (${x},${y}).`,
      ],
      textR(rational(BigInt(-(d * d - a * a)), BigInt(2 * a * d))),
      [
        '该点在圆上且y>0，用−x/y约去公共因子。',
        'The point lies on the circle with y>0; use −x/y and cancel the common factor.',
      ],
    );
  } else if (i === 3)
    item = S(
      [
        `f(x)=(x−${a})²在[${a - b},${a + b}${k % 2 === 0 ? ']' : ')'}，求全部全局最大值位置集合。`,
        `For f(x)=(x−${a})² on [${a - b},${a + b}${k % 2 === 0 ? ']' : ')'}, give every global maximum location.`,
      ],
      k % 2 === 0 ? `{${a - b},${a + b}}` : `{${a - b}}`,
      [
        '两端同高；只保留实际包含的端点。',
        'Both endpoint limits agree; retain only included endpoints.',
      ],
      ['{999}'],
    );
  else if (i === 4) {
    const length = 12 + 2 * a + b,
      cap = 2 + b,
      m = fenceAudit(length, cap, true);
    item = S(
      [
        `三边围栏L=${length}米，2x+y=L，正整米边长且x≤${cap}。求全部最优深度x集合。`,
        `A three-sided fence has L=${length} m,2x+y=L, positive whole-metre sides and x≤${cap}. Give all optimal depths.`,
      ],
      m.bestText,
      [
        '在允许整数内比较面积Lx−2x²，保留所有并列。',
        'Compare Lx−2x² over allowed integers and retain ties.',
      ],
      ['{999}'],
    );
  } else {
    const end = b + 2,
      m = motionAudit(a, 0, '0', end);
    item = N(
      [
        `s(t)=${a}(t³−6t²+9t)米，0≤t≤${end}秒，求路程米数。`,
        `Position s(t)=${a}(t³−6t²+9t) metres on0≤t≤${end} seconds. Find distance in metres.`,
      ],
      textR(m.distance),
      [
        '在1和3秒的转向点分段（只保留区间内点），累加绝对位置变化。',
        'Split at reversals one and three within the interval, then sum absolute position changes.',
      ],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h31CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H31-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H31-CHECK-Q7', 4, specs[4]!.items[5]!),
  question('H31-CHECK-Q8', 5, specs[5]!.items[5]!),
];
