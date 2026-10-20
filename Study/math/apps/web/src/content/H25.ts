import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { textR } from '../algebraModels';
import {
  rateModel,
  secantModel,
  tangentModel,
  derivativeText,
} from '../calculusModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'number', value }, step, wrong);
const P = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'polynomial', value, variables: ['x'] }, step, wrong);
const L = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'plane-equation', value }, step, wrong);
const U = (stem: Pair, step: Pair, dne = false) =>
  I(
    stem,
    { kind: 'calculus-code', value: dne ? 'does-not-exist' : 'undefined' },
    step,
    ['0', '1'],
  );
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
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
    title: ['平均变化率', 'Average rate of change'],
    objective: [
      '用两点间的输出变化除以输入变化解释平均变化率，并保留符号与单位。',
      'Interpret average rate as output change divided by input change, retaining sign and units.',
    ],
    hook: [
      '同样升高8个单位，用1个输入单位和2个输入单位，变化率一样吗？',
      'If output rises eight units, is the rate the same over one input unit and two?',
    ],
    prerequisites: ['J85-L02', 'H02-L02'],
    keywords: [
      ['输出增量', 'output increment'],
      ['输入增量', 'input increment'],
      ['平均变化率', 'average rate'],
    ],
    lab: 'calculus-average',
    hints: [
      [
        '先分别算f(b)−f(a)与b−a，不能把输出差直接当变化率。',
        'Compute f(b)−f(a) and b−a separately; an output difference alone is not a rate.',
      ],
      [
        '平均变化率=[f(b)−f(a)]/(b−a)，要求a≠b；单位为输出单位/输入单位。',
        'Average rate is [f(b)−f(a)]/(b−a), requiring a≠b; units are output units per input unit.',
      ],
    ],
    items: [
      N(
        [
          'f(x)=x²，从a=1到b=3的平均变化率？',
          'For f(x)=x², find the average rate from a=1 to b=3.',
        ],
        '4',
        ['(9−1)/(3−1)=8/2=4。', '(9−1)/(3−1)=8/2=4.'],
        ['8', '2', '3'],
      ),
      N(
        [
          'f(x)=x²，从1到3的输出变化Δy？',
          'For f(x)=x² from 1 to 3, find output change Δy.',
        ],
        '8',
        [
          'Δy=9−1=8，尚未除输入变化。',
          'Δy=9−1=8, before dividing by input change.',
        ],
        ['4', '2', '9'],
      ),
      N(
        [
          'f(x)=x²，交换端点，从3到1的平均变化率？',
          'For f(x)=x², reverse the endpoints from 3 to 1. What is the average rate?',
        ],
        '4',
        ['(1−9)/(1−3)=−8/−2=4。', '(1−9)/(1−3)=−8/−2=4.'],
        ['-4', '8', '-8'],
      ),
      N(
        [
          'f(x)=7，从−2到3的平均变化率？',
          'For constant f(x)=7, find the average rate from −2 to 3.',
        ],
        '0',
        [
          '输出变化0，分母5非零，变化率0。',
          'The output change is zero over nonzero increment five, giving zero.',
        ],
        ['7', '5', 'undefined'],
      ),
      U(
        [
          'f(x)=x²，把平均变化率的两个端点都设为1，差商是多少？',
          'For f(x)=x², set both average-rate endpoints to one. What is the quotient?',
        ],
        [
          '分母0，0/0未定义；不能用导数2代填。',
          'The denominator is zero: 0/0 is undefined, not replaced by derivative two.',
        ],
      ),
      E(
        [
          '虚构位移s(t)=t²米，t以秒计。从1秒到3秒，给两个增量、平均速度和单位；再解释给位移加4米为何不改平均速度。',
          'For fictional displacement s(t)=t² metres with time in seconds, give both increments and average velocity from one to three seconds. Explain why adding four metres to s leaves that rate unchanged.',
        ],
        [
          'Δs=9−1=8米，Δt=2秒，平均速度4米/秒。加4后端点位置5、13米，两者差仍8米，故变化率仍4米/秒。输出增量和变化率对象不同；需要不同时间端点，且未由区间平均推出每时刻速度都4。',
          'Δs=8 m and Δt=2 s give average velocity 4 m/s. Adding four changes endpoint positions to 5 and 13 m but leaves their difference eight, so the rate stays 4 m/s. Output change differs from rate, distinct times are required, and this average does not establish velocity four at every instant.',
        ],
      ),
    ],
    pick: {
      stem: [
        '位移从9米降到1米，时间从1秒增到3秒，平均速度？',
        'Position falls from nine to one metre while time increases from one to three seconds. Average velocity?',
      ],
      correct: 1,
      options: [
        ['4米/秒', '4 m/s'],
        ['−4米/秒', '−4 m/s'],
        ['−8米', '−8 m'],
      ],
      feedback: [
        [
          '有向位移为负，不能自动取绝对值。',
          'Signed displacement is negative; do not automatically take its absolute value.',
        ],
        ['Δs/Δt=−8/2=−4米/秒。', 'Δs/Δt=−8/2=−4 m/s.'],
        [
          '这是位移变化，还缺除以时间。',
          'That is displacement change, not its rate.',
        ],
      ],
    },
    reason: [
      'f(x)=x²在[−1,1]平均变化率0，能推出区间上函数恒定吗？',
      'The average rate of x² on [−1,1] is zero. Must the function be constant there?',
    ],
    rubric: [
      '不能。两端值同为1，所以平均变化率(1−1)/2=0；但中间f(0)=0与端点不同。区间平均只比较端点，不断言内部每处相同或每个瞬时率为0。需检查完整函数规则，不能用两个相同读数替代区间性质。',
      'No. Both endpoint values are one, giving average rate zero, but f(0)=0 differs. An interval average compares endpoints; it does not make all internal values or instantaneous rates zero. Check the full rule rather than inferring interval behaviour from two equal readings.',
    ],
    prompts: [
      [
        '你算的是输出变化，还是每单位输入的变化？',
        'Are you finding output change or change per input unit?',
      ],
      [
        '交换端点后，两个差分别怎样变？',
        'How do both differences change when endpoints are reversed?',
      ],
    ],
    misconception: [
      'Δy不是Δy/Δx，平均率不代表区间内每点瞬时率。',
      'Output change is not its rate; an interval average does not specify every instantaneous rate.',
    ],
  },
  {
    title: ['割线逼近切线', 'Secants approaching tangents'],
    objective: [
      '保留非零增量的差商，以代数规则解释割线斜率的极限。',
      'Keep increments nonzero and explain the limiting secant slope algebraically.',
    ],
    hook: [
      '两个点越来越近，差商能把h直接填0吗？',
      'As two points get closer, may we substitute h=0 into their quotient?',
    ],
    prerequisites: ['H25-L01', 'J81-L04'],
    keywords: [
      ['割线', 'secant'],
      ['差商', 'difference quotient'],
      ['趋近', 'approach'],
    ],
    lab: 'calculus-secant',
    hints: [
      [
        '固定a，只移动a+h；差商分母h必须非零。',
        'Fix a and move only a+h; the quotient requires h≠0.',
      ],
      [
        '对x²，展开后为(2ah+h²)/h=2a+h，仅在h≠0合法，极限为2a。',
        'For x², expansion gives (2ah+h²)/h=2a+h for h≠0, whose limit is 2a.',
      ],
    ],
    items: [
      N(
        [
          'f(x)=x²，a=1、h=1/2，求当前差商。',
          'For f(x)=x², a=1 and h=1/2, find the current quotient.',
        ],
        '5/2',
        ['2a+h=2+1/2=5/2。', '2a+h=2+1/2=5/2.'],
        ['2', '3', '1/2'],
      ),
      N(
        [
          '同一平方函数a=1、h=−1/10，当前差商？',
          'For the square function at a=1 with h=−1/10, find the current quotient.',
        ],
        '19/10',
        [
          '2+h=19/10，从另一侧也靠近2。',
          '2+h=19/10, approaching two from the other side.',
        ],
        ['21/10', '-2', '2'],
      ),
      N(
        [
          '平方函数固定a=1，h从两侧趋近0，差商极限？',
          'For the square function at a=1, what is the quotient limit as h approaches zero from both sides?',
        ],
        '2',
        [
          '2+h趋近2，有限h一般不等于2。',
          '2+h tends to two; a finite nonzero h generally does not give exactly two.',
        ],
        ['0', '1', 'undefined'],
      ),
      U(
        [
          '平方函数在a=1，把h=0代入原差商，值是什么？',
          'For the square function at a=1, substitute h=0 into the original quotient. What is its value?',
        ],
        [
          '原式分母0；趋近的极限存在不使0/0有定义。',
          'The denominator is zero; an existing limit does not define 0/0.',
        ],
      ),
      N(
        [
          'f(x)=x³，a=1、h=1/10，求当前差商。',
          'For f(x)=x³, a=1, h=1/10, find the current quotient.',
        ],
        '331/100',
        [
          '3a²+3ah+h²=3+3/10+1/100=331/100。',
          '3a²+3ah+h²=3+3/10+1/100=331/100.',
        ],
        ['3', '31/10', '1/100'],
      ),
      E(
        [
          '对f(x)=x²、任意实数a，推导h≠0时的差商与h→0的极限，解释为何有限表不是证明。',
          'For f(x)=x² and any real a, derive the quotient for h≠0 and its limit as h→0; explain why a finite table is not proof.',
        ],
        [
          '[(a+h)²−a²]/h=(2ah+h²)/h=2a+h，约h需h≠0。h从正负两侧趋0，h项趋0，极限2a。表中有限个h可观察趋势，却不能涵盖所有邻近h；代数恒等式与h项趋0说明全邻域。原差商在h=0仍未定义。',
          '[(a+h)²−a²]/h=2a+h only for h≠0. From both sides h tends to zero, so the limit is 2a. A finite table suggests behaviour but cannot cover every nearby h; the identity and vanishing h term explain the whole neighbourhood. The original quotient remains undefined at zero.',
        ],
      ),
    ],
    pick: {
      stem: [
        'a=1、h=1/100时，割线斜率2.01应该怎样描述？',
        'At a=1,h=1/100 the secant slope is 2.01. Which description is correct?',
      ],
      correct: 0,
      options: [
        [
          '接近2，但仍是当前割线的斜率',
          'Close to two, but still the current secant slope',
        ],
        [
          '小数很近，所以严格等于2',
          'Strictly equal to two because it is close',
        ],
        ['因此0/0=2', 'Therefore 0/0=2'],
      ],
      feedback: [
        [
          '非零h对应两点；极限与有限差商分开。',
          'A nonzero h gives two points; distinguish the finite quotient from its limit.',
        ],
        [
          '相差0.01，不是精确相等。',
          'They differ by 0.01, so are not exactly equal.',
        ],
        [
          '极限不为未定义式指定值。',
          'A limit does not assign a value to an undefined expression.',
        ],
      ],
    },
    reason: [
      '一张只有h=0.1,0.01,0.001的数表为何不够证明切线斜率？用x²补足理由。',
      'Why does a table for h=0.1,0.01,0.001 not prove a tangent slope? Complete the argument for x².',
    ],
    rubric: [
      '有限表只看有限输入且仅一侧。平方函数可对所有h≠0证明差商2a+h，再从两侧令h→0得到2a；误差恰为h，可随|h|变小任意小。证明不依赖屏幕重合，也不令h=0后再除0。',
      'A finite table checks finitely many inputs on only one side. For x² the identity 2a+h holds for every nonzero h; both sides tend to 2a, with error exactly h. It can be made arbitrarily small by shrinking |h|. No visual coincidence or division by zero supplies the proof.',
    ],
    prompts: [
      [
        '图里的两个点，横坐标真的不同吗？',
        'Do the two plotted points have different inputs?',
      ],
      [
        '你观察到的近似，能由原式展开解释吗？',
        'Can expansion explain the approximation you observe?',
      ],
    ],
    misconception: [
      '靠近不等于相等，极限不把差商的0/0变成合法值。',
      'Approach is not equality, and a limit does not legalise 0/0.',
    ],
  },
  {
    title: ['极限的直觉', 'Intuition of limits'],
    objective: [
      '分别核对左右靠近值与中心点值，判断有限双侧极限。',
      'Distinguish left/right approach from point value when deciding a finite two-sided limit.',
    ],
    hook: [
      'f(1)没有值，x趋近1时函数值还可能趋近2吗？',
      'Can values approach two as x approaches one even if f(1) is undefined?',
    ],
    prerequisites: ['H25-L02', 'H02-L06'],
    keywords: [
      ['左极限', 'left-hand limit'],
      ['右极限', 'right-hand limit'],
      ['点值', 'point value'],
    ],
    lab: 'calculus-limit',
    hints: [
      [
        '极限看x≠a的邻近行为，不先要求f(a)有定义。',
        'A limit concerns nearby x≠a and does not first require f(a) to exist.',
      ],
      [
        '两侧趋同一有限数才有该双侧极限；补一个点不改邻域，但可能改连续性。',
        'A finite two-sided limit requires the same finite approach from both sides; changing one point leaves the neighbourhood unchanged but may affect continuity.',
      ],
    ],
    items: [
      N(
        [
          'f(x)=(x²−1)/(x−1)，定义域x≠1，求x→1的极限。',
          'For f(x)=(x²−1)/(x−1), x≠1, find the limit as x→1.',
        ],
        '2',
        [
          'x≠1时约分得x+1，从两侧趋近2。',
          'For x≠1 cancellation gives x+1, tending to two from both sides.',
        ],
        ['0', '1', 'undefined'],
      ),
      U(
        [
          '上述原函数f(x)=(x²−1)/(x−1)，f(1)是多少？',
          'For the original function (x²−1)/(x−1), what is f(1)?',
        ],
        [
          '定义域排除1，0/0未定义；约分没有补点。',
          'One is excluded from the domain; cancellation does not fill the hole.',
        ],
      ),
      N(
        [
          '把邻域规则保持为x+1，另定义f(1)=5。中心点值是多少？',
          'Keep rule x+1 away from one and define f(1)=5. What is the centre value?',
        ],
        '5',
        [
          '题设直接指定点值5；它不等于邻域极限2。',
          'The point value is explicitly five, distinct from limit two.',
        ],
        ['2', '0', 'undefined'],
      ),
      N(
        [
          '同一补点函数f(1)=5、x≠1时f(x)=x+1，x→1极限？',
          'For f(1)=5 and f(x)=x+1 elsewhere, find the limit as x→1.',
        ],
        '2',
        [
          '改变单点不改邻近两侧趋近2。',
          'Changing one point leaves the approach to two unchanged.',
        ],
        ['5', '0', 'undefined'],
      ),
      U(
        [
          'g(x)=0(x<1)、2(x≥1)，x→1的有限双侧极限？输入does-not-exist表示不存在。',
          'For g(x)=0 if x<1 and 2 if x≥1, give the finite two-sided limit at one, or does-not-exist.',
        ],
        [
          '左极限0、右极限2，不相等，双侧极限不存在。',
          'The one-sided limits zero and two differ, so no two-sided limit exists.',
        ],
        true,
      ),
      E(
        [
          '比较空洞、补f(1)=5、跳跃0/2三种情形的左右极限和点值；指出哪些在1连续，并说明有限表的局限。',
          'Compare the hole, patch f(1)=5 and jump 0/2 by one-sided limits and point values. Which are continuous at one, and what can a finite table establish?',
        ],
        [
          '空洞左右均2但点值未定义；补5左右仍2而点值5；跳跃左右0、2且点值2。三者均不在1连续；若把空洞补为2才连续。表提供趋势证据，完整规则说明邻域；两侧不同足以否定双侧极限，不能把点值或两侧平均当极限。',
          'The hole has limits two/two but no point value. Patching five keeps both limits two but sets point value five. The jump has limits zero/two and point value two. None is continuous at one; patching the hole with two would be. Tables suggest behaviour; full rules justify it. Unequal sides refute a two-sided limit, which is neither the point value nor the average of the sides.',
        ],
      ),
    ],
    pick: {
      stem: [
        '有限双侧极限存在，必能推出哪项？',
        'What must hold if a finite two-sided limit exists?',
      ],
      correct: 2,
      options: [
        ['点值必与极限相等', 'The point value must equal it'],
        ['函数在该点必有定义', 'The function must be defined at that point'],
        ['左右邻近值趋同一有限数', 'Both sides approach the same finite value'],
      ],
      feedback: [
        [
          '这还需连续性等条件。',
          'Equality to the point value is an additional continuity condition.',
        ],
        ['空洞也可有极限。', 'A hole can still have a limit.'],
        [
          '这是这里判断双侧极限的必要一致性。',
          'This is the required agreement for the two-sided limit.',
        ],
      ],
    },
    reason: [
      '为什么不能把跳跃两侧的0和2取平均为1，称作极限？',
      'Why can the average of jump limits zero and two not be called the limit one?',
    ],
    rubric: [
      '极限要求所有足够近且非中心的输入，其函数值都靠近同一数；左侧始终0，右侧始终2，不能都靠近1。平均运算不描述任一侧的实际行为。必须分别核左右，点值2也不能代替共同极限。',
      'A limit requires every sufficiently nearby noncentral input to give values close to the same number. Left values remain zero and right values two, so both cannot approach one. Averaging does not describe either side. Check both sides; point value two does not supply a common limit.',
    ],
    prompts: [
      [
        '这个空心点说的是点值，还是附近走向？',
        'Does this open mark describe a point value or nearby behaviour?',
      ],
      [
        '把点值改掉，会改哪些量、不改哪些量？',
        'Which quantities change if only the point value is changed?',
      ],
    ],
    misconception: [
      '极限、点值与连续性分开；左右平均不是极限。',
      'Limits, point values and continuity are distinct; averaging the sides does not create a limit.',
    ],
  },
  {
    title: ['导数作为瞬时变化率', 'Derivative as instantaneous rate'],
    objective: [
      '把存在的双侧差商极限解释为有符号瞬时变化率，并识别不可导点。',
      'Interpret an existing two-sided quotient limit as a signed instantaneous rate and identify nondifferentiability.',
    ],
    hook: [
      '位移为0时，速度一定为0吗？连续的尖点一定可导吗？',
      'Must velocity be zero when position is zero, and must a continuous corner be differentiable?',
    ],
    prerequisites: ['H25-L03', 'J85-L06'],
    keywords: [
      ['瞬时变化率', 'instantaneous rate'],
      ['导数值', 'derivative value'],
      ['可导性', 'differentiability'],
    ],
    lab: 'calculus-instant',
    hints: [
      [
        'f′(a)是h→0时差商的极限，不是把h设0，也不是f(a)。',
        'f′(a) is a quotient limit as h→0, not a substitution h=0 or the value f(a).',
      ],
      [
        '两侧差商需趋同一有限实数。位移导数是有符号速度，速率是速度绝对值。',
        'Both quotient sides must approach the same finite real number. A position derivative is signed velocity; speed is its absolute value.',
      ],
    ],
    items: [
      N(
        [
          's(t)=t²米，t以秒计，在t=2秒的瞬时速度（米/秒）？',
          'For s(t)=t² metres with t in seconds, find instantaneous velocity at t=2 in m/s.',
        ],
        '4',
        [
          '差商4+h趋4，速度4米/秒。',
          'The quotient 4+h tends to four, giving 4 m/s.',
        ],
        ['5', '2', '0'],
      ),
      N(
        [
          '相对参照时刻可有负时间。s(t)=t²，在t=−1的有符号速度？',
          'Time is relative to a reference instant. For s(t)=t², find signed velocity at t=−1.',
        ],
        '-2',
        ['s′(t)=2t，代−1得−2。', 's′(t)=2t gives −2 at −1.'],
        ['2', '1', '0'],
      ),
      N(
        [
          '上题速度−2米/秒，对应速率（米/秒）？',
          'Velocity is −2 m/s. What is the corresponding speed in m/s?',
        ],
        '2',
        [
          '速率为速度的非负绝对值2。',
          'Speed is the nonnegative magnitude of velocity: two.',
        ],
        ['-2', '0', '4'],
      ),
      N(
        [
          's(t)=t³，在t=0的导数值？',
          'For s(t)=t³, find the derivative at t=0.',
        ],
        '0',
        [
          '差商h²从两侧趋0，不意味整个函数恒定。',
          'The quotient h² tends to zero from both sides, without making the function constant.',
        ],
        ['1', '3', 'undefined'],
      ),
      U(
        [
          'f(x)=|x|在0的有限双侧导数？',
          'What is the finite two-sided derivative of f(x)=|x| at zero?',
        ],
        [
          '差商|h|/h在左为−1、右为1，不存在共同有限值，导数未定义。',
          'The quotient |h|/h is −1 on the left and one on the right; the derivative is undefined.',
        ],
      ),
      E(
        [
          '用差商证明|x|在0连续但不可导，再比较x³在0的水平切线，解释连续和零导数分别不能推出什么。',
          'Use quotients to show |x| is continuous but not differentiable at zero; compare the horizontal tangent of x³ at zero and explain the limits of continuity and a zero derivative.',
        ],
        [
          '|x|两侧函数值趋0且f(0)=0，连续；差商|h|/h左右−1、1，不可导。x³在0差商h²趋0，导数0，但函数并不恒定，还穿过水平切线。连续不保证可导，单点导数0也不保证局部极值；相关极值判据在后续研究。',
          'For |x|, values tend to zero and f(0)=0, so it is continuous; |h|/h has limits −1 and one, so no derivative. For x³ at zero, quotient h² tends to zero, yet the function is nonconstant and crosses its horizontal tangent. Continuity need not imply differentiability, and a zero derivative at one point need not imply an extremum.',
        ],
      ),
    ],
    pick: {
      stem: [
        '下列哪项定义有限导数f′(a)？',
        'Which defines a finite derivative f′(a)?',
      ],
      correct: 1,
      options: [
        ['f(a)/a', 'f(a)/a'],
        [
          '非零h的差商在h→0时的共同有限极限',
          'The common finite limit of nonzero-h quotients as h→0',
        ],
        ['h=0时的0/0', '0/0 at h=0'],
      ],
      feedback: [
        [
          '从原点比值一般不是局部变化率。',
          'A ratio from the origin is generally not the local rate.',
        ],
        [
          '两侧趋同一有限值才给本课导数。',
          'Agreement at a finite limit supplies the derivative here.',
        ],
        [
          '0/0未定义，不是定义式的点值。',
          '0/0 is undefined, not a value of the defining quotient.',
        ],
      ],
    },
    reason: [
      '连续函数一定可导吗？用明确函数和值/差商说明。',
      'Must a continuous function be differentiable? Give a function and explicit value/quotient checks.',
    ],
    rubric: [
      'f(x)=|x|在0函数值0，左右函数值均趋0，故连续。但h<0时差商−1，h>0为1，不同，所以有限双侧导数未定义。函数值的两侧一致与变化率的两侧一致是两项不同检查。',
      'For |x| at zero, the function value and both limiting values are zero, establishing continuity. But the quotient is −1 for negative h and one for positive h, so the finite two-sided derivative is undefined. Agreement of values and agreement of rates are separate checks.',
    ],
    prompts: [
      [
        '你读的是原函数高度，还是局部斜率？',
        'Are you reading the original function’s height or its local slope?',
      ],
      [
        '左右两侧的函数值与差商，是否分别一致？',
        'Do the values and the quotients separately agree from both sides?',
      ],
    ],
    misconception: [
      '点值不等于导数，连续不保证可导，速度的符号不能丢。',
      'Point value differs from derivative; continuity does not ensure differentiability, and velocity retains its sign.',
    ],
  },
  {
    title: ['基本函数的求导规则', 'Derivative rules for basic functions'],
    objective: [
      '把常数、整数幂和线性组合逐项求导，区分导数函数与点值。',
      'Differentiate constants, integer powers and linear combinations term by term, distinguishing function from point value.',
    ],
    hook: [
      'f(1)=6，为什么f′(x)不能只写一个6？',
      'If f(1)=6, why can f′(x) not simply be written as six?',
    ],
    prerequisites: ['H25-L04', 'J81-L03', 'J72-L03'],
    keywords: [
      ['幂规则', 'power rule'],
      ['常数倍规则', 'constant multiple rule'],
      ['导数函数', 'derivative function'],
    ],
    lab: 'calculus-rules',
    hints: [
      [
        '常数导数0；n≥1整数时(xⁿ)′=nxⁿ⁻¹，再保留常数倍和和差。',
        'Constants differentiate to zero; for positive integer n, (xⁿ)′=nxⁿ⁻¹, retaining constant multiples and sums.',
      ],
      [
        '先求关于x的导数函数，再把a代入；不能以单次代入代替函数恒等。',
        'First find the derivative function in x, then substitute a; one value cannot establish a function identity.',
      ],
    ],
    items: [
      P(
        [
          'f(x)=3x³−2x+5，求导数函数。',
          'For f(x)=3x³−2x+5, give the derivative function.',
        ],
        '9x^2-2',
        ['3·3x²−2+0=9x²−2。', '3·3x²−2+0=9x²−2.'],
        ['9x^2-2x+5', '3x^2-2', '7'],
      ),
      N(
        ['f′(x)=9x²−2，求f′(2)。', 'Given f′(x)=9x²−2, find f′(2).'],
        '34',
        ['9·4−2=34；这是一个点值。', '9·4−2=34, a value at one input.'],
        ['10', '18', '7'],
      ),
      P(
        [
          '常数函数f(x)=7，导数函数是什么？',
          'For constant f(x)=7, give the derivative function.',
        ],
        '0',
        [
          '任意非零h的输出变化均0，所以导数恒0。',
          'Every nonzero-h output change is zero, so the derivative is identically zero.',
        ],
        ['7', 'x', 'undefined'],
      ),
      P(
        [
          'f(x)=(1/2)x²−3x，求导数函数。',
          'For f(x)=(1/2)x²−3x, give its derivative function.',
        ],
        'x-3',
        ['(1/2)·2x−3=x−3。', '(1/2)·2x−3=x−3.'],
        ['x^2-3', 'x-3x', '2x-3'],
      ),
      P(
        ['f(x)=x⁴，求导数函数。', 'For f(x)=x⁴, give the derivative function.'],
        '4x^3',
        [
          '指数4乘到前面，指数减1，得4x³。',
          'Multiply by the original exponent four and reduce the exponent by one: 4x³.',
        ],
        ['x^3', '4x^4', '4'],
      ),
      E(
        [
          '从x²的差商推导幂规则的一个实例，再逐项求(3x³−2x+5)′，解释为什么常数和函数值不能混进答案。',
          'Derive the power-rule example for x² from its quotient, then differentiate 3x³−2x+5 term by term. Explain why the constant and one function value do not remain in the answer.',
        ],
        [
          'x²差商2x+h趋2x；x³展开差商3x²+3xh+h²趋3x²。常数倍与和差可逐项取有限极限，故导数9x²−2+0。原常数5变化量0；f(1)=6、f′(1)=7均是点值，不能代替导数函数9x²−2。',
          'For x², quotient 2x+h tends to 2x; for x³, 3x²+3xh+h² tends to 3x². Constant multiples and sums of finite limits give 9x²−2+0. The constant five has zero change. f(1)=6 and f′(1)=7 are point values, not the derivative function 9x²−2.',
        ],
      ),
    ],
    pick: {
      stem: [
        '常数函数在0处的导数如何处理？',
        'How is a constant function’s derivative at zero handled?',
      ],
      correct: 0,
      options: [
        ['差商恒0，导数0', 'Its quotients are zero, so the derivative is zero'],
        ['把0·x⁻¹在0处计算', 'Evaluate 0·x⁻¹ at zero'],
        ['常数不含x，所以没定义域', 'No x means no domain'],
      ],
      feedback: [
        [
          '常数规则单独给出，不需制造负幂除0。',
          'The constant rule applies directly without introducing division by zero.',
        ],
        [
          '这会引入原题不存在的0分母。',
          'That introduces a denominator problem absent from the original function.',
        ],
        [
          '常数函数可在所有实数输入有定义。',
          'A constant function can be defined for every real input.',
        ],
      ],
    },
    reason: [
      '“(x²·x)′=(x²)′·x′=2x”对吗？不用尚未学的乘积法则，修正它。',
      'Is (x²·x)′=(x²)′·x′=2x valid? Correct it without using a product rule not yet studied.',
    ],
    rubric: [
      '不对，不能把乘积的导数当导数的乘积。先化简x²·x=x³，再用整数幂规则得3x²，例如x=1正确斜率3而非2。常数倍/和差规则不自动推广到两个变量函数相乘；一般乘积法则在H26单独学。',
      'No: a product’s derivative is not the product of derivatives. Simplify x²·x=x³, then differentiate to 3x²; at one the slope is three, not two. Constant multiple and sum rules do not automatically extend to two varying factors; the general product rule is studied in H26.',
    ],
    prompts: [
      [
        '这一项的常数系数和指数分别如何处理？',
        'What happens separately to the coefficient and exponent?',
      ],
      [
        '你写的是导数函数，还是代入后的数？',
        'Have you written a derivative function or an evaluated number?',
      ],
    ],
    misconception: [
      '常数项导数为0，求导不是把函数值照抄；和差规则不能冒充乘积规则。',
      'Constants differentiate to zero; differentiation is not copying a value, and a sum rule is not a product rule.',
    ],
  },
  {
    title: ['切线方程', 'Equation of a tangent line'],
    objective: [
      '用接触点与导数斜率共同确定切线方程，并核对两项条件。',
      'Determine and check a tangent equation using both contact point and derivative slope.',
    ],
    hook: [
      '一条线经过曲线上一点，为什么还不够证明是该点切线？',
      'Why is passing through a curve point insufficient to establish tangency there?',
    ],
    prerequisites: ['H25-L05', 'H22-L01'],
    keywords: [
      ['接触点', 'contact point'],
      ['导数斜率', 'derivative slope'],
      ['点斜式', 'point-slope form'],
    ],
    lab: 'calculus-tangent',
    hints: [
      [
        '先算f(a)找点，再算f′(a)找斜率，两者不能互换。',
        'Find the point from f(a) and the slope from f′(a); they are not interchangeable.',
      ],
      [
        '有限导数存在时，y−f(a)=f′(a)(x−a)；代回点并核对斜率。',
        'With a finite derivative, y−f(a)=f′(a)(x−a); check both incidence and slope.',
      ],
    ],
    items: [
      L(
        [
          'f(x)=x²在a=2处的完整切线方程？',
          'Give the complete tangent equation to f(x)=x² at a=2.',
        ],
        'y=4x-4',
        [
          '接触点(2,4)，斜率4，y−4=4(x−2)。',
          'The point is (2,4), slope four: y−4=4(x−2).',
        ],
        ['y=4x', 'y=2x', 'y=x^2'],
      ),
      N(
        [
          'f(x)=x²在a=2的接触点纵坐标？',
          'For f(x)=x² at a=2, find the contact height.',
        ],
        '4',
        ['f(2)=4，接触点为(2,4)。', 'f(2)=4, so the contact point is (2,4).'],
        ['2', '0', '8'],
      ),
      L(
        [
          'f(x)=x³在0处的切线方程？',
          'Give the tangent equation to f(x)=x³ at zero.',
        ],
        'y=0',
        [
          '接触点(0,0)，导数0，所以y=0；曲线会穿过此线。',
          'The point is (0,0) and slope zero, giving y=0; the curve crosses it.',
        ],
        ['x=0', 'y=x', 'y=3x^2'],
      ),
      L(
        [
          'f(x)=x³−3x在a=1处的切线方程？',
          'Give the tangent equation to f(x)=x³−3x at a=1.',
        ],
        'y=-2',
        [
          'f(1)=−2，f′(1)=3−3=0，所以水平线y=−2。',
          'f(1)=−2 and f′(1)=0, so y=−2.',
        ],
        ['y=0', 'x=1', 'y=-2x'],
      ),
      L(
        [
          'f(x)=x²在a=−1处的切线方程？',
          'Give the tangent equation to f(x)=x² at a=−1.',
        ],
        'y=-2x-1',
        [
          '点(−1,1)，斜率−2，y−1=−2(x+1)。',
          'The point is (−1,1), slope −2: y−1=−2(x+1).',
        ],
        ['y=-2x+1', 'y=2x-1', 'y=-2x'],
      ),
      E(
        [
          '推导x²在2处切线，并给两个反例分别反驳“过点即切线”和“一般切线只能碰曲线一次且不能穿过”。',
          'Derive the tangent to x² at two and give counterexamples to “through the point means tangent” and “a general tangent meets the curve only once and never crosses it”.',
        ],
        [
          '点(2,4)、斜率4给y=4x−4；y=2x虽过点但斜率2，不是该处切线。x³在0切线y=0且穿过；x³−3x在1切线y=−2，还在x=−2相交，因为−8+6=−2。一般函数切线由局部导数定义，不把圆的单交点性质当通用定义。',
          'The point (2,4) and slope four give y=4x−4. The line y=2x passes through the point but has slope two, so is not that tangent. x³ crosses y=0 at zero; the tangent y=−2 to x³−3x at one also intersects at x=−2. General tangency is local and derivative-based, not defined by the circle’s single-intersection property.',
        ],
      ),
    ],
    pick: {
      stem: [
        'y=4x经过x²在a=2处的接触点吗？',
        'Does y=4x pass through the contact point of x² at a=2?',
      ],
      correct: 2,
      options: [
        ['是，斜率4就够了', 'Yes; slope four is sufficient'],
        ['是，所有过原点线都可以', 'Yes; every line through the origin works'],
        ['否，代x=2得8而非4', 'No; x=2 gives eight instead of four'],
      ],
      feedback: [
        [
          '斜率正确仍须通过正确的点。',
          'A correct slope still needs the correct point.',
        ],
        ['接触点不在原点。', 'The contact point is not the origin.'],
        [
          '点斜式中截距由接触点确定为−4。',
          'The contact point fixes intercept −4.',
        ],
      ],
    },
    reason: [
      '切线是否一定不穿过曲线？用x³在0的值、导数和两侧符号解释。',
      'Must a tangent never cross its curve? Use x³ at zero, its derivative and signs on both sides.',
    ],
    rubric: [
      'x³在0函数值0、导数0，切线y=0。x<0时x³<0，x>0时x³>0，曲线从切线下到切线上，所以穿过。局部斜率一致不要求整条曲线位于线的一侧，圆切线的特例不能变为一般定义。',
      'At zero, x³ has value zero and derivative zero, giving tangent y=0. Cubic values are negative to the left and positive to the right, so the curve crosses from below to above the tangent. Local slope agreement does not require the whole curve to stay on one side; the circle case is not a general definition.',
    ],
    prompts: [
      [
        '这条线能同时通过接触点并保持正确斜率吗？',
        'Does the line satisfy both contact incidence and correct slope?',
      ],
      [
        '曲线在切点左右分别在线的哪一侧？',
        'Which side of the tangent contains the curve on either side of contact?',
      ],
    ],
    misconception: [
      '过点或斜率正确单独都不够；一般切线可以穿过曲线、也可在别处再相交。',
      'Incidence or slope alone is insufficient; a general tangent may cross or meet the curve again.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `derivative-${i + 1}`;
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
    `derivative-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h25Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H25-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H11',
    unit: 'H25',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`derivative-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `derivative-${i + 1}`,
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
export function h25ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H25-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H25 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = -2 + (k % 6),
    j = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0) {
    const m = rateModel('x^2', String(a), String(a + j));
    item = N(
      [
        `f(x)=x²，从${a}到${a + j}的平均变化率？`,
        `For f(x)=x², find average rate from ${a} to ${a + j}.`,
      ],
      textR(m.average!),
      [
        '两个增量相除，或平方差约去非零区间长度。',
        'Divide increments or cancel the nonzero interval length in a difference of squares.',
      ],
      ['999'],
    );
  } else if (i === 1) {
    const h = ['-1/2', '-1/10', '1/10', '1/2'][j - 1]!,
      m = secantModel('x^2', String(a), h);
    item = N(
      [
        `f(x)=x²，a=${a}、h=${h}，当前差商？`,
        `For f(x)=x², a=${a}, h=${h}, find the current quotient.`,
      ],
      textR(m.average!),
      ['h≠0时差商2a+h。', 'For nonzero h the quotient is 2a+h.'],
      ['999'],
    );
  } else if (i === 2) {
    const c = a,
      point = j + 3;
    item = N(
      [
        `f(x)=x+(${c})在x≠${j}成立，另令f(${j})=${point}。求x→${j}的极限。`,
        `Let f(x)=x+(${c}) for x≠${j}, and set f(${j})=${point}. Find the limit as x→${j}.`,
      ],
      String(j + c),
      [
        '邻域规则决定两侧极限，单点补值不改变它。',
        'The neighbourhood rule determines both limiting sides; patching one point does not change them.',
      ],
      ['999'],
    );
  } else if (i === 3) {
    item = N(
      [
        `s(t)=${j}t²+${k % 3}，求相对时间t=${a}的瞬时有符号变化率。`,
        `For s(t)=${j}t²+${k % 3}, find the signed instantaneous rate at relative time t=${a}.`,
      ],
      String(2 * j * a),
      [
        '常数位移不影响导数，瞬时率为2jt。',
        'A constant position shift leaves the derivative 2jt unchanged.',
      ],
      ['999'],
    );
  } else if (i === 4) {
    const n = 1 + Math.floor(k / 6),
      c = 1 + (k % 6),
      raw = `${c}x^${n}+${j}`;
    item = P(
      [`求f(x)=${raw}的导数函数。`, `Differentiate f(x)=${raw}.`],
      derivativeText(raw),
      [
        '常数项变0，幂项乘原指数并降一次幂。',
        'The constant vanishes; multiply the power term by its original exponent and lower the power.',
      ],
      ['999x'],
    );
  } else {
    const raw = `${j}x^2+1`,
      m = tangentModel(raw, String(a));
    item = L(
      [
        `求f(x)=${raw}在a=${a}处的切线方程。`,
        `Find the tangent to f(x)=${raw} at a=${a}.`,
      ],
      m.equation,
      [
        '由(a,f(a))与f′(a)用点斜式。',
        'Use point-slope form with (a,f(a)) and f′(a).',
      ],
      ['y=999x+999'],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h25CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H25-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H25-CHECK-Q7', 2, specs[2]!.items[5]!),
  question('H25-CHECK-Q8', 5, specs[5]!.items[5]!),
];
