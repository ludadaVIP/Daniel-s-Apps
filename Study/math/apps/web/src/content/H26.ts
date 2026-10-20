import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { productModel, chainModel } from '../functionAnalysisModels';
import { polynomialText } from '../polynomialModels';
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
const C = (
  stem: Pair,
  value:
    | 'increasing'
    | 'decreasing'
    | 'constant'
    | 'local-max'
    | 'local-min'
    | 'neither',
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'analysis-code', value }, step, wrong);
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
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['导数的正负与增减', 'Derivative sign and monotonicity'],
    objective: [
      '由连续区间上的导数符号判断增减，并用规则而非有限采样支持结论。',
      'Use derivative signs on an interval to justify behaviour from the rule rather than finite sampling.',
    ],
    hook: [
      '函数值是负的，函数就一定在下降吗？',
      'If a function value is negative, must the function be falling?',
    ],
    prerequisites: ['H25-L05', 'H02-L03'],
    keywords: [
      ['导数符号', 'derivative sign'],
      ['严格递增', 'strictly increasing'],
      ['区间', 'interval'],
    ],
    lab: 'analysis-sign',
    hints: [
      [
        '先求f′，再用零点分开区间；比较的是斜率符号，不是f的正负。',
        'Differentiate, then split the interval at derivative zeros. Inspect slope signs, not the sign of f.',
      ],
      [
        '在整个区间内可导且f′>0则严格递增，f′<0则严格递减。孤立的零斜率点不能直接判为恒定。',
        'A derivative positive throughout an interval gives strict increase; negative gives strict decrease. An isolated zero slope does not establish constancy.',
      ],
    ],
    items: [
      C(
        [
          'f(x)=x³−3x在(−1,1)上递增、递减还是恒定？',
          'Is f(x)=x³−3x increasing, decreasing or constant on (−1,1)?',
        ],
        'decreasing',
        [
          'f′=3(x−1)(x+1)，在此区间负。',
          'f′=3(x−1)(x+1) is negative throughout this interval.',
        ],
        ['increasing', 'constant', '-1'],
      ),
      N(
        ['f(x)=x³−3x，求f′(2)。', 'For f(x)=x³−3x, find f′(2).'],
        '9',
        ['3·4−3=9；这是斜率而非f(2)=2。', '3·4−3=9 is a slope, not f(2)=2.'],
        ['2', '3', '12'],
      ),
      C(
        [
          'f(x)=x³在整个实数域严格递增吗？填increasing、decreasing或constant。',
          'Classify x³ over the whole real line: increasing, decreasing or constant.',
        ],
        'increasing',
        [
          '尽管f′(0)=0，若b>a，则b³−a³=(b−a)(a²+ab+b²)>0。',
          'Although f′(0)=0, b>a gives b³−a³=(b−a)(a²+ab+b²)>0.',
        ],
        ['constant', 'decreasing', 'neither'],
      ),
      C(
        [
          'f(x)=−x²在(0,∞)上的增减性？',
          'Classify the behaviour of −x² on (0,∞).',
        ],
        'decreasing',
        ['f′=−2x<0。', 'f′=−2x<0.'],
        ['increasing', 'constant', 'local-max'],
      ),
      C(
        [
          'f(x)=2在ℝ上的增减性？用constant表示恒定。',
          'Classify f(x)=2 on ℝ, using constant for unchanged output.',
        ],
        'constant',
        [
          '所有输入的输出都2，f′处处0。',
          'Every output is two; the derivative is zero everywhere.',
        ],
        ['increasing', 'decreasing', '0'],
      ),
      E(
        [
          '用f(x)=x³−3x写出导数、三个开区间的符号与增减，再解释为何不能只核三张数值卡就证明。',
          'For x³−3x give the derivative, signs and behaviour on all three open intervals, then explain why three numerical cards alone are not proof.',
        ],
        [
          'f′=3(x−1)(x+1)；(−∞,−1)正递增，(−1,1)负递减，(1,∞)正递增。因子在各区间符号固定才支持整段结论；有限采样不能排除样点间转折。函数在ℝ可导，区间没有定义域缺口；f的正负与增减不同。',
          'f′=3(x−1)(x+1): positive and increasing on (−∞,−1), negative and decreasing on (−1,1), positive and increasing on (1,∞). Factor signs remain fixed throughout each interval; three samples alone cannot exclude intervening turns. The function is differentiable on ℝ with no domain gaps; output sign differs from behaviour.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于x³在0处，哪个判断正确？',
        'Which statement about x³ at zero is correct?',
      ],
      options: [
        ['导数0，所以附近恒定', 'Zero derivative makes it locally constant'],
        [
          '导数0，但仍严格递增',
          'Derivative zero, yet still strictly increasing',
        ],
        ['函数值0，所以开始递减', 'Value zero means decrease starts'],
      ],
      feedback: [
        [
          '单点斜率不能代替整段性质。',
          'One slope cannot replace an interval property.',
        ],
        ['比较任意a<b可证a³<b³。', 'For arbitrary a<b, a³<b³.'],
        ['函数高度不是斜率。', 'Function height is not slope.'],
      ],
      correct: 1,
    },
    reason: [
      'f(x)=−1/x在(−∞,0)∪(0,∞)导数都正，能说它在整个定义域严格递增吗？给反例。',
      'For −1/x the derivative is positive on both sides of zero. Is it strictly increasing across its whole disconnected domain? Give a counterexample.',
    ],
    rubric: [
      '不能跨缺口应用区间结论。f′=1/x²>0，只证明各连续区间分别递增。取−1<1却f(−1)=1>−1=f(1)，违反全域递增定义。0不在域中，不能用连接两支的假线或跨缺口的平均值定理证明。',
      'No. The derivative 1/x² is positive, establishing increase separately on each interval. Yet −1<1 while f(−1)=1>−1=f(1), contradicting increase across the entire domain. Zero is excluded, so joining branches or applying an interval theorem across the gap is invalid.',
    ],
    prompts: [
      [
        '你比较的是函数高度还是斜率符号？',
        'Are you comparing height or slope sign?',
      ],
      [
        '这个区间是否完整在定义域内？',
        'Does the whole interval lie in the domain?',
      ],
    ],
    misconception: [
      'f>0不等于f′>0，单点f′=0不等于整段恒定。',
      'Positive output is not positive slope; zero slope at one point does not make an interval constant.',
    ],
  },
  {
    title: ['驻点与极值', 'Stationary points and extrema'],
    objective: [
      '把驻点当候选，用两侧符号检验严格局部极值，并与闭区间最大最小值区分。',
      'Treat stationary points as candidates, test strict local extrema by nearby signs, and distinguish absolute extrema on a closed interval.',
    ],
    hook: [
      '水平切线一定在山顶或谷底吗？',
      'Does a horizontal tangent always mark a peak or valley?',
    ],
    prerequisites: ['H26-L01', 'H25-L04'],
    keywords: [
      ['驻点', 'stationary point'],
      ['局部极值', 'local extremum'],
      ['端点', 'endpoint'],
    ],
    lab: 'analysis-extrema',
    hints: [
      [
        '先解f′=0找驻点；函数有定义但不可导的点和闭区间端点也要另外考虑。',
        'Solve f′=0 for stationary points. Also consider defined but nondifferentiable points and closed-interval endpoints.',
      ],
      [
        '连续候选点左右导数+→−为严格局部极大，−→+为严格局部极小；同号不能仅凭零导数判极值。全局值要比较所有候选。',
        'At a continuous candidate, +→− gives a strict local maximum and −→+ a strict local minimum. Same-sign sides do not turn a zero derivative into an extremum. Compare all candidates for absolute values.',
      ],
    ],
    items: [
      C(
        [
          'x³−3x在驻点x=−1是严格局部极大、极小还是两者都不是？',
          'Classify stationary x=−1 for x³−3x: strict local maximum, minimum or neither.',
        ],
        'local-max',
        [
          'f′由正变负，函数先增后减。',
          'The derivative changes positive to negative: rise then fall.',
        ],
        ['local-min', 'neither', '2'],
      ),
      N(
        [
          'x³−3x在x=−1的局部极大值是多少？',
          'What is the local maximum value of x³−3x at x=−1?',
        ],
        '2',
        [
          '(−1)³−3(−1)=2；值不是位置−1。',
          '(−1)³−3(−1)=2; value differs from location −1.',
        ],
        ['-1', '0', '-2'],
      ),
      C(
        [
          'x³在驻点0是严格局部极值吗？',
          'Classify the stationary point zero of x³ using strict local extrema.',
        ],
        'neither',
        [
          'f′=3x²，两侧均正；函数通过0继续增加。',
          'f′=3x² is positive on both sides; the function keeps rising through zero.',
        ],
        ['local-max', 'local-min', 'constant'],
      ),
      N(
        [
          'x³−3x在闭区间[−2,3]的绝对最大值？',
          'Find the absolute maximum value of x³−3x on [−2,3].',
        ],
        '18',
        [
          '比较x=−2,−1,1,3的值−2,2,−2,18。',
          'Compare values −2,2,−2,18 at x=−2,−1,1,3.',
        ],
        ['2', '3', '-2'],
      ),
      N(
        [
          'x³−3x在[−2,3]的绝对最小值？',
          'Find the absolute minimum value of x³−3x on [−2,3].',
        ],
        '-2',
        [
          'x=−2与1同为−2；允许在多个位置达到。',
          'Both x=−2 and one give −2; an absolute value may occur at several locations.',
        ],
        ['1', '-1', '2'],
      ),
      E(
        [
          '比较x³在0、|x|在0和x³−3x在[−2,3]的极值；说明驻点条件的限度。',
          'Compare extrema of x³ at zero, |x| at zero, and x³−3x on [−2,3]. Explain the limits of the stationary-point condition.',
        ],
        [
          'x³在0可导且斜率0，但两侧都递增，无严格局部极值。|x|在0连续有严格局部极小，却不可导，故不是驻点。三次式的闭区间最大值18在端点3，最小值−2在−2和1。可导内点的局部极值必须导数0；逆命题不成立，也不能漏不可导点与端点。本课局部指双侧内点且严格；恒定函数的非严格极值另行说明。',
          'x³ has derivative zero at zero but increases on both sides, so has no strict local extremum there. |x| has a strict local minimum at zero but no derivative, so zero is not stationary. The cubic has absolute maximum 18 at endpoint three and minimum −2 at −2 and one. A differentiable interior local extremum requires zero derivative; the converse fails, and corners and endpoints must not be omitted. Here local classification is strict and two-sided; constant functions require the separate non-strict convention.',
        ],
      ),
    ],
    pick: {
      stem: ['|x|在0的正确描述？', 'Which describes |x| at zero?'],
      options: [
        [
          '不可导，但有严格局部极小',
          'Not differentiable, with a strict local minimum',
        ],
        ['驻点且导数0', 'Stationary with derivative zero'],
        ['不可导就没有极值', 'No derivative means no extremum'],
      ],
      feedback: [
        [
          '左右斜率−1、1；函数值0小于所有附近非零输入的值。',
          'One-sided slopes −1 and one differ; value zero is less than nearby nonzero outputs.',
        ],
        ['左右差商极限不同。', 'The one-sided derivative limits differ.'],
        [
          '极值按值比较，并不要求可导。',
          'Extrema compare values and do not require differentiability.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '为何“解f′=0得到所有最大最小值”不可靠？用本课两个不同反例说明。',
      'Why does solving f′=0 not automatically give all maxima and minima? Give two different counterexamples.',
    ],
    rubric: [
      '第一类错误是把候选当结论：x³在0导数0却没有严格局部极值。第二类是漏候选：|x|在0不可导但有极小，或x在[0,1]端点1给最大值且导数不为0。必须说明定义域、内点/端点和局部/绝对，比较两侧或所有闭区间候选。',
      'First, candidates need not be extrema: x³ has slope zero at zero without a strict local extremum. Second, solving can miss candidates: |x| has a corner minimum, or x on [0,1] attains its maximum at endpoint one with nonzero derivative. Specify domain, interior versus endpoint and local versus absolute; test nearby behaviour or compare all closed-interval candidates.',
    ],
    prompts: [
      [
        '现在求的是位置还是函数值？',
        'Are you finding a location or a function value?',
      ],
      [
        '端点和不可导点有没有检查？',
        'Have you checked endpoints and nondifferentiable points?',
      ],
    ],
    misconception: [
      '驻点只是候选；局部极大值不必为闭区间最大值。',
      'Stationary points are candidates; a local maximum need not be the absolute maximum.',
    ],
  },
  {
    title: ['基本乘法求导法则', 'Product rule'],
    objective: [
      '把两个变化因子的乘积导数写成u′v+uv′，并用展开后的多项式独立核验。',
      'Differentiate two varying factors as u′v+uv′ and independently check by expanding.',
    ],
    hook: [
      '长和宽都在变，面积变化率能只乘两个变化率吗？',
      'If both length and width change, can their rates simply be multiplied to find area rate?',
    ],
    prerequisites: ['H25-L05', 'J81-L03'],
    keywords: [
      ['乘积法则', 'product rule'],
      ['两项贡献', 'two contributions'],
      ['展开核验', 'expansion check'],
    ],
    lab: 'analysis-product',
    hints: [
      [
        '标清u、v、u′、v′；每项只有一个因子被求导。',
        'Label u, v, u′ and v′. Each term differentiates one factor.',
      ],
      [
        '(uv)′=u′v+uv′；先换一个、再换另一个，不是u′v′。用展开求导交叉核验。',
        '(uv)′=u′v+uv′, changing each factor in turn rather than multiplying both derivatives. Cross-check by expanding first.',
      ],
    ],
    items: [
      P(
        [
          '求[(x²+1)(x−2)]′，用x写导数。',
          'Differentiate (x²+1)(x−2), giving an expression in x.',
        ],
        '3x^2-4x+1',
        ['2x(x−2)+(x²+1)=3x²−4x+1。', '2x(x−2)+(x²+1)=3x²−4x+1.'],
        ['2x', '3x^2+1', 'x^3-2x^2+x-2'],
      ),
      N(
        ['f=(x²+1)(x−2)，求f′(1)。', 'For f=(x²+1)(x−2), find f′(1).'],
        '0',
        ['2·(−1)+2·1=0，两项可相消。', '2·(−1)+2·1=0; contributions cancel.'],
        ['2', '-2', '1'],
      ),
      P(
        ['求[(2x+1)(x+3)]′。', 'Differentiate (2x+1)(x+3).'],
        '4x+7',
        ['2(x+3)+(2x+1)=4x+7。', '2(x+3)+(2x+1)=4x+7.'],
        ['2', '4x+6', '2x^2+7x+3'],
      ),
      P(
        ['求[5(x²+1)]′。', 'Differentiate 5(x²+1).'],
        '10x',
        [
          'u=5的导数0，0·(x²+1)+5·2x=10x。',
          'The constant factor contributes zero: 0·(x²+1)+5·2x=10x.',
        ],
        ['0', '5x', '10x+5'],
      ),
      P(
        ['求[x²·x²]′。', 'Differentiate x²·x².'],
        '4x^3',
        [
          '2x·x²+x²·2x=4x³，与(x⁴)′一致。',
          '2x·x²+x²·2x=4x³, agreeing with differentiating x⁴.',
        ],
        ['4x^2', '2x^3', 'x^4'],
      ),
      E(
        [
          '用u=x²+1、v=x−2推导乘积导数，并解释差商中为何出现两项，不是u′v′。',
          'For u=x²+1 and v=x−2 derive the product derivative and explain why the difference quotient produces two terms rather than u′v′.',
        ],
        [
          '在u(x+h)v(x+h)−u(x)v(x)中加减u(x)v(x+h)，除h得[Δu/h]v(x+h)+u(x)[Δv/h]。可导保证连续，极限为u′v+uv′=2x(x−2)+(x²+1)=3x²−4x+1。展开原式x³−2x²+x−2再求导同得此式；u′v′=2x在x=1错误地给2而非0。',
          'Add and subtract u(x)v(x+h) in u(x+h)v(x+h)−u(x)v(x). Dividing by h gives [Δu/h]v(x+h)+u(x)[Δv/h]. Differentiability gives continuity, so the limit is u′v+uv′=3x²−4x+1. Expanding to x³−2x²+x−2 and differentiating agrees. The incorrect u′v′=2x gives two at one instead of zero.',
        ],
      ),
    ],
    pick: {
      stem: ['(uv)′的正确一般形式？', 'What is the general derivative of uv?'],
      options: [
        ['u′v′', 'u′v′'],
        ['u′v+uv′', 'u′v+uv′'],
        ['u′+v′', 'u′+v′'],
      ],
      feedback: [
        [
          '这漏掉原因子，不是两个贡献之和。',
          'This loses the original factors and is not the sum of contributions.',
        ],
        [
          '两个因子轮流变化，各保留另一个。',
          'Each factor changes in turn while the other is retained.',
        ],
        ['这是和的法则。', 'That is the sum rule.'],
      ],
      correct: 1,
    },
    reason: [
      'u(1)=2、v(1)=−1、u′(1)=2、v′(1)=1。乘积变化率为何为0，而非原乘积−2或斜率乘积2？',
      'Given u(1)=2, v(1)=−1, u′(1)=2, v′(1)=1, why is the product rate zero rather than product value −2 or product of slopes two?',
    ],
    rubric: [
      'u′v=−2、uv′=2，两项贡献相消为0；原乘积uv=−2是高度，u′v′=2是两个率的乘积，均不是(uv)′。例如本课u=x²+1、v=x−2展开后导数3x²−4x+1在1恰为0。这只说明该点瞬时率0，不能推出乘积在附近恒定。',
      'The contributions u′v=−2 and uv′=2 cancel to zero. The original product −2 is a height, and u′v′=2 multiplies slopes; neither is (uv)′. For u=x²+1, v=x−2 the expanded derivative 3x²−4x+1 is zero at one, confirming the rule. Zero instantaneous rate does not imply local constancy.',
    ],
    prompts: [
      ['每一项里哪个因子在变化？', 'Which factor changes in each term?'],
      [
        '先展开再求导会得到同一式吗？',
        'Does expanding first give the same derivative?',
      ],
    ],
    misconception: [
      '乘积的导数一般不等于导数的乘积。',
      'The derivative of a product is generally not the product of derivatives.',
    ],
  },
  {
    title: ['复合函数求导法则', 'Chain rule'],
    objective: [
      '辨认内外层，在内层输出处求外层导数并乘内层变化率。',
      'Identify inner and outer functions, evaluate the outer derivative at the inner output, and multiply by the inner rate.',
    ],
    hook: [
      '平方机器前加一个快两倍的输入机器，输出变化率会怎样？',
      'What happens to output rate when a doubling machine feeds a squaring machine?',
    ],
    prerequisites: ['H25-L05', 'H02-L01'],
    keywords: [
      ['内函数', 'inner function'],
      ['外函数', 'outer function'],
      ['链式法则', 'chain rule'],
    ],
    lab: 'analysis-chain',
    hints: [
      [
        '写z=g(x)、y=F(z)，先找谁先接收x。F′要在g(x)处计算。',
        'Write z=g(x), y=F(z). Identify the first machine, and evaluate F′ at g(x).',
      ],
      [
        '[F(g(x))]′=F′(g(x))g′(x)。对[g(x)]ⁿ得n[g(x)]ⁿ⁻¹g′(x)，不要漏内导。',
        '[F(g(x))]′=F′(g(x))g′(x). For [g(x)]ⁿ use n[g(x)]ⁿ⁻¹g′(x), retaining the inner derivative.',
      ],
    ],
    items: [
      P(
        ['求[(2x+1)³]′。', 'Differentiate (2x+1)³.'],
        '6(2x+1)^2',
        [
          '外导3(2x+1)²乘内导2。',
          'Multiply outer derivative 3(2x+1)² by inner derivative two.',
        ],
        ['3(2x+1)^2', '6x^2', '(2x+1)^3'],
      ),
      N(
        ['f=(2x+1)³，求f′(1)。', 'For f=(2x+1)³, find f′(1).'],
        '54',
        [
          '内值3、外导27、内导2，乘积54。',
          'Inner value three, outer derivative 27, inner derivative two give 54.',
        ],
        ['27', '6', '18'],
      ),
      P(
        ['求[(x²+1)²]′。', 'Differentiate (x²+1)².'],
        '4x(x^2+1)',
        ['外导2(x²+1)乘内导2x。', 'Multiply 2(x²+1) by inner derivative 2x.'],
        ['2(x^2+1)', '4x', '2x^2+2'],
      ),
      P(
        ['求[(1−x)³]′。', 'Differentiate (1−x)³.'],
        '-3(1-x)^2',
        [
          '内导−1决定负号。',
          'The inner derivative −1 supplies the minus sign.',
        ],
        ['3(1-x)^2', '-3x^2', '-3(1-x)'],
      ),
      N(
        [
          'f=(x²+1)²在x=0的导数值？',
          'Find the derivative value of (x²+1)² at x=0.',
        ],
        '0',
        [
          '外导2，内导0，两者相乘0。',
          'The outer derivative is two but the inner derivative is zero, giving zero.',
        ],
        ['2', '1', '4'],
      ),
      E(
        [
          '对(2x+1)³给内外层、完整导数、x=1的值，再先展开独立核验；说明不能从数值吻合一处推出函数恒等。',
          'For (2x+1)³ identify both layers, differentiate, evaluate the derivative at one, and independently check by expansion. Explain why one matching numerical value alone is insufficient.',
        ],
        [
          'z=2x+1，F(z)=z³，F′(z)=3z²，z′=2，所以导数6(2x+1)²，在1为54。原式8x³+12x²+6x+1逐项求导24x²+24x+6，与6(4x²+4x+1)对每个x一致。只比一个输入会让不同多项式偶然相等；需代数恒等核验，内导不能漏。',
          'Let z=2x+1, F(z)=z³. Then F′(z)=3z² and z′=2, giving 6(2x+1)² and derivative value 54 at one. Expanding the source to 8x³+12x²+6x+1 gives 24x²+24x+6, algebraically identical for every x. Agreement at one input can be accidental for distinct polynomials; verify the identity and retain the inner rate.',
        ],
      ),
    ],
    pick: {
      stem: [
        'F(z)=z³、z=2x+1，在x=1处的外层导数F′(z)应在哪个z求值？',
        'For F(z)=z³ and z=2x+1, at x=1 where should F′(z) be evaluated?',
      ],
      options: [
        ['z=1，得到3', 'At z=1, giving three'],
        ['z=2，得到12', 'At z=2, giving twelve'],
        ['z=3，得到27，再乘2', 'At z=3, giving 27, then multiply by two'],
      ],
      feedback: [
        [
          '外层接收的是内层输出，不直接接收x。',
          'The outer function receives the inner output, not x directly.',
        ],
        [
          '2是内导，不是此时的内值。',
          'Two is the inner rate, not the inner value.',
        ],
        [
          '内值3与内导2的角色不同。',
          'Inner value three and inner rate two play different roles.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '[(x²+1)²]′=2(x²+1)为何少一层？给正确式，并比较x=0处两个式子的值。',
      'Why does 2(x²+1) miss a layer when differentiating (x²+1)²? Give the correct expression and compare both at zero.',
    ],
    rubric: [
      '令z=x²+1，外导2z，但z也随x变，z′=2x，所以导数4x(x²+1)。在0正确导数0，漏内导式为2。原式展开x⁴+2x²+1求导4x³+4x可复核；不能把平方公式的外层操作当作关于x的全部变化率。',
      'With z=x²+1 the outer derivative is 2z, but z changes at rate 2x. The complete derivative is 4x(x²+1), zero at x=0, while the incomplete expression gives two. Expanding to x⁴+2x²+1 gives derivative 4x³+4x, confirming the result. An outer operation alone is not the full rate with respect to x.',
    ],
    prompts: [
      [
        '外层收到的输入是x还是g(x)？',
        'Does the outer function receive x or g(x)?',
      ],
      [
        '内层变化率是否也乘上了？',
        'Have you also multiplied by the inner rate?',
      ],
    ],
    misconception: [
      '外导在内值处求，随后乘内导；不能只做外导。',
      'Evaluate the outer derivative at the inner value, then multiply by the inner derivative.',
    ],
  },
  {
    title: ['变化率应用题', 'Applied rates of change'],
    objective: [
      '从有范围的虚构模型求瞬时变化率，解释符号和单位并拒绝无依据外推。',
      'Find instantaneous rates in bounded fictional models, interpreting signs and units without unsupported extrapolation.',
    ],
    hook: [
      '位置负、速度负、速率负，是同一个意思吗？',
      'Do negative position, negative velocity and negative speed mean the same thing?',
    ],
    prerequisites: ['H26-L03', 'H26-L04', 'H25-L01'],
    keywords: [
      ['有向速度', 'signed velocity'],
      ['量纲', 'units'],
      ['模型范围', 'model domain'],
    ],
    lab: 'analysis-rates',
    hints: [
      [
        '先写量、变量、单位与有效时间范围，再对时间求导；输出数值按题干指定单位。',
        'State quantity, variable, units and valid time range before differentiating with respect to time. Enter numbers in the units stated.',
      ],
      [
        '位置s的导数是有向速度，速率=|s′|；面积A的导数单位为面积/时间。先求导再代时刻，范围外不沿用情境结论。',
        'The derivative of position is signed velocity; speed is |s′|. An area derivative has area/time units. Differentiate before evaluating, and do not extend contextual claims outside the range.',
      ],
    ],
    items: [
      N(
        [
          '虚构s(t)=t²−4t+3米，0≤t≤4秒。求t=1秒的有向速度（米/秒），只填数值。',
          'Fictional s(t)=t²−4t+3 metres for 0≤t≤4 seconds. Give signed velocity at t=1 in m/s; enter the number.',
        ],
        '-2',
        ['s′=2t−4，在1为−2米/秒。', 's′=2t−4 gives −2 m/s at one.'],
        ['2', '0', '-4'],
      ),
      N(
        [
          '同一位移模型在t=1秒的速率（米/秒）？只填数值。',
          'For the same position model, give speed at t=1 in m/s; enter the number.',
        ],
        '2',
        ['速率是速度的绝对值|−2|=2。', 'Speed is absolute velocity |−2|=2.'],
        ['-2', '0', '1'],
      ),
      N(
        [
          '同一s(t)在[0,2]秒的平均速度（米/秒）？',
          'For this s(t), give average velocity over [0,2] seconds in m/s.',
        ],
        '-2',
        [
          '[s(2)−s(0)]/2=(−1−3)/2=−2；不声称每时刻都−2。',
          '[s(2)−s(0)]/2=(−1−3)/2=−2, without asserting constant instantaneous velocity.',
        ],
        ['0', '-4', '2'],
      ),
      N(
        [
          '虚构正方形边长ℓ(t)=1+2t米，0≤t≤3秒。t=1秒的面积变化率（平方米/秒）？',
          'A fictional square has side ℓ(t)=1+2t metres for 0≤t≤3 seconds. Find area rate at t=1 in m²/s.',
        ],
        '12',
        ['A=ℓ²，A′=2ℓ·ℓ′=2·3·2=12。', 'A=ℓ², so A′=2ℓℓ′=2·3·2=12.'],
        ['6', '9', '4'],
      ),
      N(
        [
          '同一正方形t=2秒的面积变化率（平方米/秒）？',
          'For the same square, find area rate at t=2 in m²/s.',
        ],
        '20',
        ['ℓ=5米，2·5·2=20平方米/秒。', 'Side five metres gives 2·5·2=20 m²/s.'],
        ['10', '25', '4'],
      ),
      E(
        [
          '把边长1+2t的正方形模型解释给家长：求t=1的面积、面积变化率，核对单位；能直接用于t=−1或10吗？',
          'Explain the square-side model 1+2t to a parent: find area and area rate at one, check units, and discuss t=−1 or ten.',
        ],
        [
          't=1边长3米，面积9平方米，A′=2(1+2t)·2=12平方米/秒。面积与面积变化率不能混；2ℓ单位米、ℓ′单位米/秒，相乘平方米/秒。模型只授权0≤t≤3，−1给负边长且不合情境，10虽代数可算也超观测范围，不能据此断言实际面积或变化率；这是虚构理想模型而非测量事实。',
          'At one the side is 3 m, area 9 m² and area rate 2(1+2t)·2=12 m²/s. Area and area rate are distinct; multiplying 2ℓ in metres by ℓ′ in m/s gives m²/s. The model only authorises 0≤t≤3: −1 gives an invalid negative side, and ten remains outside the range even though algebra permits substitution. Neither extrapolation establishes actual behaviour; this is a fictional ideal model, not measured evidence.',
        ],
      ),
    ],
    pick: {
      stem: [
        '面积A的时间导数的单位是什么？',
        'What are the units of the time derivative of area A?',
      ],
      options: [
        ['米/秒', 'm/s'],
        ['平方米/秒', 'm²/s'],
        ['平方米', 'm²'],
      ],
      feedback: [
        ['这是长度的变化率单位。', 'These are length-rate units.'],
        ['输出面积单位除以时间单位。', 'Divide area units by time units.'],
        ['这是面积而不是变化率。', 'This is area, not its rate.'],
      ],
      correct: 1,
    },
    reason: [
      's=t²−4t+3在[0,4]内，t=2时速度0，可说物体在整个区间静止吗？用两时刻和速度符号解释。',
      'For s=t²−4t+3 on [0,4], velocity is zero at two. Is it stationary throughout the interval? Explain using two times and velocity signs.',
    ],
    rubric: [
      '不能。s(0)=3、s(2)=−1，位置确实变了。s′=2t−4在(0,2)负，在(2,4)正，t=2瞬时速度0只是转向时刻，不是整段静止。速率为|2t−4|非负，位置负只表示相对原点的位置。范围外即使公式可求值也没有情境授权。',
      'No. Positions s(0)=3 and s(2)=−1 differ. Velocity 2t−4 is negative on (0,2) and positive on (2,4); zero at two is an instant of reversal, not rest throughout the interval. Speed |2t−4| is nonnegative, while negative position indicates location relative to the origin. Algebraic evaluation outside the stated range has no contextual authority.',
    ],
    prompts: [
      [
        '求的是量、平均率还是瞬时率？单位呢？',
        'Is this a quantity, average rate or instantaneous rate, and what are its units?',
      ],
      [
        '这个时刻在模型范围内吗？',
        'Does this time lie inside the model domain?',
      ],
    ],
    misconception: [
      '速率非负，速度可负；面积不是面积变化率；代数可算不等于模型可用。',
      'Speed is nonnegative, velocity may be negative; area differs from area rate, and algebraic evaluability does not validate extrapolation.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `analysis-${i + 1}`;
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
    `analysis-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h26Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H26-L0${i + 1}`;
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
    unit: 'H26',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`analysis-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `analysis-${i + 1}`,
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
export function h26ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H26-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H26 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0) {
    const left = k % 2 === 0,
      interval = left ? `(${a - 2},${a - 1})` : `(${a + 1},${a + 2})`;
    item = C(
      [
        `f(x)=${b}(x−${a})²，在${interval}上递增、递减还是恒定？`,
        `For f(x)=${b}(x−${a})², classify its behaviour on ${interval}.`,
      ],
      left ? 'decreasing' : 'increasing',
      [
        `f′(x)=${2 * b}(x−${a})，所给区间完全在顶点${left ? '左' : '右'}侧，导数${left ? '负' : '正'}。`,
        `f′(x)=${2 * b}(x−${a}); the interval lies wholly ${left ? 'left' : 'right'} of the vertex, so the derivative is ${left ? 'negative' : 'positive'}.`,
      ],
      ['constant', left ? 'increasing' : 'decreasing'],
    );
  } else if (i === 1)
    item = N(
      [
        `f(x)=(x−${a})²+${b}，求其在ℝ的最小值（不是位置）。`,
        `Find the minimum value, not location, of f(x)=(x−${a})²+${b} on ℝ.`,
      ],
      String(b),
      [
        '平方非负，在x=a为0，最小值b。',
        'The square is nonnegative and zero at a, so the minimum value is b.',
      ],
      ['999'],
    );
  else if (i === 2) {
    const u = `x^2+${a}`,
      v = `${b}x-1`,
      m = productModel(u, v, '0');
    item = P(
      [`求[(${u})(${v})]′。`, `Differentiate (${u})(${v}).`],
      polynomialText(m.derivative),
      [
        '用u′v+uv′后合并，或先展开独立核验。',
        'Apply u′v+uv′ and collect, or expand first to check.',
      ],
      ['999x'],
    );
  } else if (i === 3) {
    const inner = `${b}x+${a}`,
      m = chainModel(inner, 3, '0');
    item = P(
      [`求[(${inner})³]′。`, `Differentiate (${inner})³.`],
      polynomialText(m.derivative),
      [
        '外导3(inner)²乘内导b。',
        'Multiply the outer derivative 3(inner)² by inner derivative b.',
      ],
      ['999x'],
    );
  } else
    item = N(
      [
        `虚构边长ℓ(t)=${a}+${b}t米，0≤t≤2秒。t=1秒时面积变化率（平方米/秒）？`,
        `A fictional square has side ℓ(t)=${a}+${b}t m for 0≤t≤2 s. Find area rate at t=1 in m²/s.`,
      ],
      String(2 * (a + b) * b),
      ['2ℓℓ′=2(a+b)b，单位平方米/秒。', '2ℓℓ′=2(a+b)b, in m²/s.'],
      ['999'],
    );
  return question(`${id}-R${round}`, i, item);
}
export const h26CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H26-CHECK-Q${i + 1}`, i, s.items[0]!)),
  pick('H26-CHECK-Q6', 1),
  question('H26-CHECK-Q7', 1, specs[1]!.items[5]!),
  question('H26-CHECK-Q8', 4, specs[4]!.items[5]!),
];
