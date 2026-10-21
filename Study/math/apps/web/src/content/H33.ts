import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
import { normalCdf, probability4 } from '../distributionModels';
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
const D = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'distribution-table', value }, step, wrong);
const A = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'distribution-rounded', value }, step, wrong);
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
    title: ['随机变量与概率分布表', 'Random variables and distribution tables'],
    objective: [
      '把每个样本结果映射到数值，并合并相同取值的概率写成完整分布表。',
      'Map sample outcomes to numbers and combine masses sharing a value into a full distribution table.',
    ],
    hook: [
      '两枚硬币有四个等可能结果，正面数有几个取值？这些取值也等可能吗？',
      'Two coins have four equally likely outcomes. How many head counts are possible, and are those counts equally likely?',
    ],
    prerequisites: ['H24-L01', 'H24-L06'],
    keywords: [
      ['随机变量', 'random variable'],
      ['概率质量', 'probability mass'],
      ['归一化', 'normalisation'],
    ],
    lab: 'distribution-table',
    hints: [
      [
        '先列每个样本结果，再按题中的映射合并相同数值；不能默认不同取值等可能。',
        'List sample outcomes, apply the stated map and merge equal values; distinct values need not be equally likely.',
      ],
      [
        '每项概率非负，总和1；填value:probability，各行用分号隔开，格式示例−2:1/3;5:2/3。',
        'Every probability is nonnegative and their sum is one. Enter value:probability, separating rows with semicolons, for example−2:1/3;5:2/3.',
      ],
    ],
    items: [
      D(
        [
          '两次独立公平抛币，X为正面数。构造完整概率表，格式取值:概率;取值:概率。',
          'For two independent fair tosses, X counts heads. Construct the complete value:probability table with semicolon-separated rows.',
        ],
        '0:1/4;1:1/2;2:1/4',
        [
          'TT映0，HT与TH都映1，HH映2；四个等可能结果按1、2、1个归并。',
          'TT maps to zero, HT and TH to one, HH to two: merge the four equally likely outcomes in counts1,2,1.',
        ],
        ['0:1/3;1:1/3;2:1/3', '0:1/4;1:1/4;2:1/4'],
      ),
      N(
        [
          '同一硬币实验，P(X=1)是多少？',
          'In that coin experiment, find P(X=1).',
        ],
        '1/2',
        ['HT、TH两个结果，共2/4。', 'HT and TH give two of four outcomes.'],
        ['1/3', '1/4'],
      ),
      N(
        ['同一实验，P(X≥1)是多少？', 'For the same experiment, find P(X≥1).'],
        '3/4',
        ['合并X1与X2的概率1/2+1/4。', 'Add masses at one and two:1/2+1/4.'],
        ['1/2', '1/4'],
      ),
      N(
        [
          '同一实验，P(X=0或X=2)是多少？',
          'Find P(X=0 or X=2) in the same experiment.',
        ],
        '1/2',
        ['两个互斥取值，1/4+1/4。', 'The values are disjoint, so add1/4+1/4.'],
        ['1', '1/4'],
      ),
      N(
        [
          '某分布只列X=0、1、2，概率依次1/4、p、1/4，求p。',
          'A distribution lists only values 0,1,2 with masses1/4,p,1/4. Find p.',
        ],
        '1/2',
        ['总概率1，减去两个1/4。', 'Subtract the two quarter masses from one.'],
        ['1/3', '1/4'],
      ),
      E(
        [
          '解释为什么正面数有三个取值却不是各1/3，并核分布表的两个合法条件。',
          'Explain why three head counts do not each have probability 1/3, and check both validity conditions.',
        ],
        [
          '随机变量是样本结果到数值的函数。四个等可能结果TT、HT、TH、HH映到0、1、1、2，中间值合并两条结果，故质量1/4、1/2、1/4。不同数值不是新的等可能样本。概率各非负且总和1，缺一条件都不能是分布；总和1也不能容许负项。',
          'A random variable is a map from outcomes to numbers. TT,HT,TH,HH map to 0,1,1,2, so masses are1/4,1/2,1/4. Distinct values do not create an equally likely sample space. All masses must be nonnegative and sum to one; a total of one does not excuse negative entries.',
        ],
      ),
    ],
    pick: {
      stem: ['哪个分布表合法？', 'Which distribution is valid?'],
      correct: 2,
      options: [
        ['概率−1/4、5/4', 'Masses−1/4,5/4'],
        ['概率1/4、1/4', 'Masses1/4,1/4'],
        ['概率1/4、3/4', 'Masses1/4,3/4'],
      ],
      feedback: [
        ['总和虽1但有负项。', 'The sum is one but one entry is negative.'],
        ['没有列出完整概率1。', 'The total is not one.'],
        ['非负且总和1。', 'Both masses are nonnegative and sum to one.'],
      ],
    },
    reason: [
      '把HT和TH合并后，为什么不能把它们的一半概率丢掉？',
      'Why must merging HT and TH retain both probability contributions?',
    ],
    rubric: [
      '两条互斥样本结果仍都可能发生，随机变量只是把它们记作同一数值，不会改变原实验的概率。合并用互斥加法，1/4+1/4=1/2。写三个取值各1/3会改造原模型；还需核所有不同数值覆盖、各概率非负且总和1。',
      'Both disjoint sample outcomes remain possible. A numerical map changes their label, not their original probabilities. Merge by addition:1/4+1/4=1/2. Assigning thirds changes the model. Check coverage of distinct values, nonnegative masses and total one.',
    ],
    prompts: [
      [
        '哪些不同结果被记成同一个数？',
        'Which different outcomes receive the same number?',
      ],
      [
        '非负与总和1是否都核过？',
        'Have you checked both nonnegativity and total one?',
      ],
    ],
    misconception: [
      '取值个数不决定等可能；随机变量归并不删概率。',
      'Counting distinct values does not make them equiprobable; merging preserves probability.',
    ],
  },
  {
    title: ['期望值的意义', 'Meaning of expected value'],
    objective: [
      '用概率加权求期望，并把理论长期均值与单次值、有限模拟均值分开。',
      'Compute a probability-weighted expectation, separating it from one outcome and a finite simulated mean.',
    ],
    hook: [
      '每次只能得到0或3，平均目标能是1.5吗？',
      'If each outcome is zero or three, can the expected value be1.5?',
    ],
    prerequisites: ['H33-L01', 'H24-L06'],
    keywords: [
      ['概率加权', 'probability weighting'],
      ['期望', 'expectation'],
      ['长期均值', 'long-run mean'],
    ],
    lab: 'distribution-expectation',
    hints: [
      [
        '逐行算x·P(X=x)再加，概率才是权重，不能直接按取值个数平均。',
        'Multiply each value by its probability and add. Probabilities are the weights, not the number of values.',
      ],
      [
        'E(aX+b)=aE(X)+b；期望不必是可能取值。有限伪随机均值只是一次模拟，不保证单调趋近。',
        'E(aX+b)=aE(X)+b. The mean need not be attainable. A finite pseudorandom mean is one simulation and need not approach monotonically.',
      ],
    ],
    items: [
      N(
        [
          'X只能取0、3，各概率1/2，求E(X)。',
          'X takes only zero or three, each with probability 1/2. Find E(X).',
        ],
        '3/2',
        [
          '0×1/2+3×1/2=3/2，1.5不是单次可得值。',
          '0×1/2+3×1/2=3/2, although1.5 is not attainable once.',
        ],
        ['3', '0', '1'],
      ),
      N(
        ['同一X，Y=2X+1，求E(Y)。', 'For the same X, Y=2X+1. Find E(Y).'],
        '4',
        [
          'E(Y)=2×3/2+1=4；也可对Y的1、7分别加权。',
          'Use2×3/2+1=4, or weight Y values one and seven.',
        ],
        ['3', '7', '5/2'],
      ),
      N(
        [
          '各次都服从该0或3分布，十次所得之和的期望是多少？',
          'Each of ten draws has that zero-or-three distribution. What is the expected sum?',
        ],
        '15',
        [
          '期望逐项相加，10×3/2=15；此加法本身不要求独立。',
          'Expectations add to 10×3/2=15; linearity itself does not require independence.',
        ],
        ['3/2', '30'],
      ),
      N(
        [
          'X取0概率9/10、取10概率1/10，求E(X)。',
          'X is zero with probability 9/10 and ten with probability 1/10. Find E(X).',
        ],
        '1',
        [
          '0×9/10+10×1/10=1，不是取值平均5。',
          'The weighted sum is one, not the unweighted mean five.',
        ],
        ['5', '10', '9'],
      ),
      N(
        [
          'X取0、3各1/2，P(X=E(X))是多少？',
          'For X equal to zero or three with equal masses, find P(X=E(X)).',
        ],
        '0',
        [
          'E=3/2不在支持中，概率0。',
          'The expectation3/2 is not in the support.',
        ],
        ['1/2', '1'],
      ),
      E(
        [
          '解释理论期望、单次结果、模拟均值三者关系，并说明十次结果总和不保证等于其期望。',
          'Explain theoretical expectation, one outcome and a simulated mean; why need a ten-draw total not equal its expectation?',
        ],
        [
          '期望3/2由整个分布概率加权确定，单次只能0或3；独立同分布重复下长期平均以大数定律意义接近期望，但有限均值可偏离、反复上下波动。十次总和期望15不保证本次恰15，更不要求下一次补偿。模拟使用标明种子的伪随机序列，不能把有限轨迹当定理证明。',
          'Expectation3/2 is determined by the distribution, while one draw is zero or three. Under iid repetition the law of large numbers describes convergence of averages, but finite means can miss the expectation and fluctuate. Expected ten-draw total fifteen does not promise that total or a compensating next draw. A seeded pseudorandom trace illustrates, rather than proves, the theorem.',
        ],
      ),
    ],
    pick: {
      stem: [
        'E(X)=1.5直接保证什么？',
        'What does E(X)=1.5 directly guarantee?',
      ],
      correct: 1,
      options: [
        ['下一次等于1.5', 'The next draw is1.5'],
        ['分布的概率加权均值为1.5', 'The distribution’s weighted mean is1.5'],
        ['每两次平均必为1.5', 'Every pair must average1.5'],
      ],
      feedback: [
        ['期望未必可取。', 'The expectation may be unattainable.'],
        ['这是分布层面的量。', 'This describes the distribution.'],
        ['有限两次没有此保证。', 'No such finite-pair guarantee holds.'],
      ],
    },
    reason: [
      '长期均值接近期望，是否意味着连续偏小后下一次必须偏大？',
      'Does long-run averaging require the next value to be large after a run of small values?',
    ],
    rubric: [
      '独立同分布模型中，过去的结果不改变下一次的分布；0或3仍各1/2。长期平均的收敛是重复次数增大后的概率陈述，不是每一步补偿或误差单调缩小。模拟轨迹只是所选种子的一例，有限偏离与理论期望不矛盾。',
      'Under an iid model, previous outcomes leave the next distribution unchanged: zero and three remain equally likely. Convergence of averages is a probabilistic large-sample statement, not forced compensation or monotone error reduction. A seeded finite trace is one illustration; deviation is consistent with the expected value.',
    ],
    prompts: [
      [
        '这个期望本身能在一次中取到吗？',
        'Can one draw actually equal this expectation?',
      ],
      [
        '这条轨迹是理论还是一次有限模拟？',
        'Is this theory or one finite simulation?',
      ],
    ],
    misconception: [
      '期望不是保证值，有限平均不必等于期望或单调靠近。',
      'Expectation is not a guarantee; finite averages need not equal it or approach monotonically.',
    ],
  },
  {
    title: ['方差与标准差', 'Variance and standard deviation'],
    objective: [
      '用概率加权平方偏差衡量分布离散程度，并追踪平移、缩放和单位。',
      'Measure spread with weighted squared deviations and track translation, scaling and units.',
    ],
    hook: [
      '同样平均为1，能一个几乎不偏离、另一个波动很大吗？',
      'Can two distributions both have mean one but very different spreads?',
    ],
    prerequisites: ['H33-L02', 'H08-L03'],
    keywords: [
      ['平方偏差', 'squared deviation'],
      ['方差', 'variance'],
      ['标准差', 'standard deviation'],
    ],
    lab: 'distribution-spread',
    hints: [
      [
        '先算μ，再把每项(x−μ)²乘概率相加；不是把有符号偏差直接相加。',
        'Find μ, then sum probability times(x−μ)². Signed deviations alone cancel.',
      ],
      [
        'Var(aX+b)=a²Var(X)，SD(aX+b)=|a|SD(X)。分布方差用概率权重，非样本估计的n−1。',
        'Var(aX+b)=a²Var(X), SD(aX+b)=|a|SD(X). This is a distribution variance, not an n−1 sample estimate.',
      ],
    ],
    items: [
      N(
        [
          'X取0和2，各概率1/2，求Var(X)。',
          'X is zero or two, each with probability 1/2. Find Var(X).',
        ],
        '1',
        [
          'μ1，两个平方偏差均1，概率加权仍1。',
          'Mean one; both squared deviations are one, giving variance one.',
        ],
        ['0', '2'],
      ),
      N(
        ['上述X的标准差是多少？', 'Find the standard deviation of that X.'],
        '1',
        [
          '标准差取方差的非负平方根√1。',
          'Take the nonnegative square root of variance one.',
        ],
        ['-1', '0'],
      ),
      N(
        ['同一X，Y=3X−2，求Var(Y)。', 'For Y=3X−2 with that X, find Var(Y).'],
        '9',
        [
          '缩放3使平方偏差乘9，平移−2不改方差。',
          'Scale three multiplies variance by nine; translation changes none.',
        ],
        ['3', '7', '1'],
      ),
      N(
        ['同一Y=3X−2，求E(Y)。', 'For the same Y=3X−2, find E(Y).'],
        '1',
        [
          '3×1−2=1，均值与方差按不同规则变换。',
          '3×1−2=1: mean and variance transform differently.',
        ],
        ['9', '3'],
      ),
      I(
        [
          '两次公平硬币正面数的方差1/2，标准差精确值是多少？可写sqrt(2)/2。',
          'A two-fair-coin head count has variance 1/2. Give its exact SD, using sqrt(2)/2 if useful.',
        ],
        { kind: 'radical', value: 'sqrt(2)/2' },
        [
          '标准差√(1/2)=√2/2，不能把方差直接当标准差。',
          'SD=√(1/2)=√2/2, not the variance itself.',
        ],
        ['1/2', '-sqrt(2)/2'],
      ),
      E(
        [
          '比较同均值的分布，并解释变换Y=aX+b、方差与标准差单位，以及σ=0的意义。',
          'Compare equal-mean distributions and explain affine changes, units, and what zero SD means.',
        ],
        [
          'X为0或2各半时μ1、方差1；另一分布−1或3各半也μ1但方差4。方差加权平方距离，不是正负距离相消。平移b改均值不改离散程度；缩放a使方差乘a²、标准差乘|a|，负a也不产生负标准差。原量米时方差平方米、标准差米。方差0意味着概率1集中在均值；此时不可除以σ算z。这里是分布理论方差，不用样本n−1。',
          'The equally weighted0/2 distribution has mean one and variance one; −1/3 has the same mean but variance four. Weighted squared distances avoid signed cancellation. Translation changes mean, not spread; scaling multiplies variance by a² and SD by|a|. Negative scale does not give negative SD. Metre-valued X has variance m² and SD m. Zero variance concentrates probability one at the mean and prevents division by σ. This distribution calculation does not use n−1.',
        ],
      ),
    ],
    pick: {
      stem: ['Y=−2X+7，SD(Y)怎样变？', 'For Y=−2X+7, how does SD change?'],
      correct: 0,
      options: [
        ['乘2', 'Multiply by two'],
        ['乘−2', 'Multiply by minus two'],
        ['先乘4再加7', 'Multiply by four and add seven'],
      ],
      feedback: [
        ['标准差用绝对缩放因子。', 'Use absolute scale.'],
        ['标准差非负。', 'SD is nonnegative.'],
        [
          '方差才用平方，平移不加到离散程度。',
          'Variance uses squared scale; translation does not add to spread.',
        ],
      ],
    },
    reason: [
      '为什么带符号偏差的均值不能衡量离散程度？',
      'Why cannot the mean signed deviation measure spread?',
    ],
    rubric: [
      '概率加权偏差∑(x−μ)p=E(X)−μ=0，对很分散与很集中分布都如此；正负会抵消。平方后非负，远离均值的值贡献更大，再按概率加权得到方差。标准差取非负根恢复原单位，不能用负根或把平方单位误称原单位。',
      'Weighted signed deviations equal E(X)−μ=0, whether spread is small or large. Squaring prevents cancellation and weights distant values more strongly. Probability-weighted squares give variance; its nonnegative square root restores original units. A negative root or unchanged units for variance is incorrect.',
    ],
    prompts: [
      [
        '平方偏差各是多少，权重是什么？',
        'What are the squared deviations and their weights?',
      ],
      [
        '改变的是中心、尺度还是两者？',
        'Are you changing centre, scale or both?',
      ],
    ],
    misconception: [
      '均值相同不保证方差相同；平移不改方差，负缩放也须用绝对标准差。',
      'Equal means need not give equal variances; translation preserves spread and negative scale still uses absolute SD.',
    ],
  },
  {
    title: ['二项分布', 'Binomial distribution'],
    objective: [
      '先核固定次数、独立、二分类与恒定成功率，再计算成功次数事件的概率。',
      'Check fixed trials, independence, binary outcomes and constant success probability before calculating count events.',
    ],
    hook: [
      '“四次中恰好两次”只要算某一个顺序吗？',
      'Does exactly two successes in four trials mean only one order?',
    ],
    prerequisites: ['H33-L01', 'H24-L03', 'H24-L06'],
    keywords: [
      ['固定次数', 'fixed trials'],
      ['成功次数', 'success count'],
      ['二项概率', 'binomial probability'],
    ],
    lab: 'distribution-binomial',
    hints: [
      [
        'X为n次独立同成功率p的二分类成功次数；恰k的每条顺序概率pᵏ(1−p)ⁿ⁻ᵏ，共C(n,k)条。',
        'X counts successes in n independent binary trials with the same p. Each order with k successes has mass pᵏ(1−p)ⁿ⁻ᵏ; there are C(n,k) orders.',
      ],
      [
        '至少、至多、恰好是不同事件。E(X)=np、Var(X)=np(1−p)；p0或1可退化但仍合法。',
        'At least, at most and exactly are different events. E(X)=np, Var(X)=np(1−p); endpoints p=0 or1 are valid degenerate cases.',
      ],
    ],
    items: [
      N(
        [
          'X为4次独立公平抛币正面数，求P(X=2)。',
          'X counts heads in four independent fair tosses. Find P(X=2).',
        ],
        '3/8',
        [
          'C(4,2)=6条顺序，各1/16，共6/16。',
          'Six orders each have mass 1/16, giving6/16.',
        ],
        ['1/16', '1/2'],
      ),
      N(
        ['同一实验，P(X≥1)是多少？', 'For the same experiment, find P(X≥1).'],
        '15/16',
        ['用补事件1−P(X0)=1−1/16。', 'Use the complement of zero successes.'],
        ['1/4', '1/16'],
      ),
      N(
        ['同一实验E(X)是多少？', 'For that experiment, find E(X).'],
        '2',
        ['np=4×1/2。', 'np=4×1/2.'],
        ['4', '1'],
      ),
      N(
        ['同一实验Var(X)是多少？', 'For that experiment, find Var(X).'],
        '1',
        ['np(1−p)=4×1/2×1/2。', '4×1/2×1/2=1.'],
        ['2', '4'],
      ),
      N(
        [
          '3次独立试验，每次成功率1/3，求恰1次成功的概率。',
          'Three independent trials each have success probability 1/3. Find probability of exactly one success.',
        ],
        '4/9',
        ['3×1/3×(2/3)²=4/9。', '3×1/3×(2/3)²=4/9.'],
        ['4/27', '1/3'],
      ),
      E(
        [
          '解释组合因子、至少一次的补事件以及何时不能直接用二项模型。',
          'Explain the combination factor, the at-least-one complement and when the binomial model is unjustified.',
        ],
        [
          '4次中恰2次有C(4,2)=6条互斥顺序，独立且恒定p使每条概率相同p²(1−p)²；不能只数一条。至少1次是0次的补事件。不放回通常令后续条件概率改变、试验相依，次数按结果停止也不是固定n；这些需别的模型。p0、1合法退化，方差0；n0是空重复、X恒0的边界。',
          'Exactly two in four has six disjoint orders. Independence and fixed p give each order mass p²(1−p)²; one order is insufficient. At least one complements zero. Without replacement usually changes conditional probabilities and creates dependence; stopping by outcomes removes fixed n. Endpoints p=0,1 are valid with zero variance, and n=0 gives the constant zero count.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪种情形满足所述二项假设？',
        'Which setting meets the binomial assumptions?',
      ],
      correct: 1,
      options: [
        [
          '有限袋不放回取4次',
          'Four draws without replacement from a finite bag',
        ],
        [
          '固定4次独立、每次成功率1/3',
          'Four fixed independent trials, each with p=1/3',
        ],
        ['一直做到首次成功为止', 'Continue until the first success'],
      ],
      feedback: [
        [
          '通常相依且成功率改变。',
          'Dependence and changing probabilities usually occur.',
        ],
        [
          '次数固定、独立、二分类且同p。',
          'Fixed count, independence, binary outcomes and same p.',
        ],
        ['次数不是固定值。', 'The number of trials is not fixed.'],
      ],
    },
    reason: [
      '为何仅说“每次有成功或失败”还不足以推出二项分布？',
      'Why is success/failure classification alone insufficient for a binomial count?',
    ],
    rubric: [
      '还需固定试验次数、各次独立和成功率相同；二分类只说明每次可记0或1。相依结果、不同p或按结果停止都可能有相同二分类标签而成功次数分布不同。应先核模型条件，再使用C(n,k)pᵏ(1−p)ⁿ⁻ᵏ与均值方差式，有限模拟接近也不能证明独立。',
      'Binary labels alone provide0/1 outcomes. Fixed n, independence and identical success probability are additional requirements. Dependence, changing p or outcome-based stopping can produce different count distributions. Check these conditions before using the formula and moments; finite agreement in a simulation does not establish independence.',
    ],
    prompts: [
      [
        '六条顺序为何能相加，概率为何相同？',
        'Why can the six orders be added, and why are their masses equal?',
      ],
      [
        '固定、独立、二分类、同p都满足吗？',
        'Are fixed trials, independence, binary outcomes and same p all satisfied?',
      ],
    ],
    misconception: [
      '二项模型不只需要二分类；组合因子与事件边界不可漏。',
      'Binary outcomes alone are insufficient; retain combinations and event boundaries.',
    ],
  },
  {
    title: ['正态分布', 'Normal distribution'],
    objective: [
      '把正态模型的概率解释为密度曲线下区间面积，并识别μ与正标准差σ的作用。',
      'Interpret normal probabilities as density areas over intervals and identify the roles of μ and positive σ.',
    ],
    hook: [
      '曲线在均值处最高，就意味着恰好等于均值的概率最大吗？',
      'The density peaks at its mean. Does that give a positive probability of exactly that value?',
    ],
    prerequisites: ['H33-L03', 'H32-L04', 'H32-L06'],
    keywords: [
      ['概率密度', 'probability density'],
      ['区间面积', 'interval area'],
      ['正态模型', 'normal model'],
    ],
    lab: 'distribution-normal',
    hints: [
      [
        '连续模型的区间概率是密度积分，不是某点高度；单点宽度0，概率0。',
        'A continuous interval probability is a density integral, not a point height. A singleton has zero width and probability zero.',
      ],
      [
        '记号N(μ,σ²)的第二参数为方差，σ>0；给定正态模型才用其面积规律。近似题保留四位小数。',
        'In N(μ,σ²) the second parameter is variance, with σ>0. Normal area rules require a normal model. Give approximate probabilities to four decimal places.',
      ],
    ],
    items: [
      A(
        [
          '假设X~N(50,2²)，求P(48≤X≤52)，近似到四位小数。',
          'Assume X~N(50,2²). Find P(48≤X≤52), rounded to four decimal places.',
        ],
        '0.6827',
        [
          '这是μ±σ间面积，约0.68268949，舍入0.6827。',
          'The μ±σ area is approximately0.68268949, rounding to 0.6827.',
        ],
        ['0.3413', '0.9545', '0.6826'],
      ),
      N(
        [
          '该N(50,2²)模型的均值是多少？',
          'What is the mean of this N(50,2²) model?',
        ],
        '50',
        ['中心参数μ=50。', 'The centre parameter is fifty.'],
        ['2', '4'],
      ),
      N(
        ['该模型的方差是多少？', 'What is the variance of this model?'],
        '4',
        [
          '第二参数2²=4；标准差才是2。',
          'The second parameter is2²=4; the SD is two.',
        ],
        ['2', '50'],
      ),
      N(
        [
          '该连续正态模型P(X=50)是多少？',
          'In this continuous normal model, find P(X=50).',
        ],
        '0',
        [
          '单点区间宽度0，密度虽正但概率0。',
          'The point has zero interval width, despite positive density.',
        ],
        ['1/2', '1'],
      ),
      N(
        ['该正态模型P(X<50)是多少？', 'For this normal model, find P(X<50).'],
        '1/2',
        [
          '以μ对称，左半总面积1/2。',
          'Symmetry about μ gives half the total area on the left.',
        ],
        ['0', '1'],
      ),
      E(
        [
          '解释密度高度、区间面积、单点概率、μ/σ和模型适用性，并说明有限图窗的尾部。',
          'Explain density height, interval area, point probability, μ/σ, applicability and tails outside a finite plotting window.',
        ],
        [
          '正态密度总面积1，区间积分才是概率；单点宽0所以P(X=50)=0，高度不是单点概率。μ定位中心，σ>0决定尺度，σ增大时曲线更宽更低但总面积仍1；N(μ,σ²)写的是方差。μ±σ内约0.6827不是精确分数，也不适用于所有钟形数据。正态定义于整个实轴，有限图窗外尾部仍存在，现实变量如长度不能仅凭形状无条件正态化。',
          'A normal density integrates to one; interval integrals are probabilities and singleton probability is zero. μ locates the centre; positive σ controls scale, widening and lowering the curve while preserving total area. N(μ,σ²) uses variance. The μ±σ mass is approximately0.6827, not an exact fraction or a rule for every bell-shaped dataset. The model has infinite tails outside a finite plot. Physical quantities such as length require justification before normal modelling.',
        ],
      ),
    ],
    pick: {
      stem: [
        '密度曲线上一点的高度表示什么？',
        'What does the height of a density curve represent?',
      ],
      correct: 2,
      options: [
        ['恰等于该点的概率', 'The probability of exactly that value'],
        ['小于该点的累计概率', 'The cumulative probability below it'],
        [
          '密度；概率需对区间积分',
          'Density; probability needs an interval integral',
        ],
      ],
      feedback: [
        ['连续单点概率0。', 'A continuous singleton probability is zero.'],
        [
          '累计概率是整段左侧面积。',
          'A cumulative probability is area to the left.',
        ],
        ['高度与面积扮演不同角色。', 'Height and area have different roles.'],
      ],
    },
    reason: [
      '为何仅凭直方图像钟形，不能断言每条“均值±标准差”区间都恰有68.27%？',
      'Why does a bell-shaped histogram not guarantee exactly68.27% inside every mean±SD interval?',
    ],
    rubric: [
      '0.6827来自正态模型的积分并且已舍入；不是所有对称或钟形分布的普遍结论。有限样本频率还会波动，直方图又依赖组距。需结合生成过程、范围、尾部与拟合证据核模型，并区分理论概率、样本比例和舍入值，不能用外观代替假设。',
      'The rounded0.6827 comes from a normal integral, not every symmetric or bell-shaped distribution. Finite sample proportions fluctuate and histograms depend on binning. Check the generating process, range, tails and model evidence, distinguishing theoretical probability, observed proportion and rounded value. Shape alone cannot establish the assumption.',
    ],
    prompts: [
      [
        '你读取的是高度还是一段面积？',
        'Are you reading a height or an interval area?',
      ],
      [
        '正态假设从哪里来，图窗外还有什么？',
        'What supports normality, and what lies outside the window?',
      ],
    ],
    misconception: [
      '密度非点概率；钟形外观不等于已证正态；面积数值有近似标记。',
      'Density is not point probability; bell shape does not establish normality, and numerical areas are approximate.',
    ],
  },
  {
    title: ['标准正态与z分数', 'Standard normal and z-scores'],
    objective: [
      '用正标准差把原量转换为z，保留方向并用左尾累计概率计算区间或右尾。',
      'Convert values to signed z-scores with positive SD and use left-tail cumulative probabilities for intervals and right tails.',
    ],
    hook: [
      '85分在不同均值与波动的两组里，代表同样位置吗？',
      'Does a score of 85 occupy the same relative position in two groups with different means and spreads?',
    ],
    prerequisites: ['H33-L05', 'H33-L03'],
    keywords: [
      ['标准化', 'standardisation'],
      ['z分数', 'z-score'],
      ['左尾累计', 'left-tail cumulative'],
    ],
    lab: 'distribution-standard',
    hints: [
      [
        'z=(x−μ)/σ，σ>0；减均值保方向，除标准差变为无量纲。反向x=μ+σz。',
        'z=(x−μ)/σ with σ>0. Subtraction preserves direction; division removes units. Invert with x=μ+σz.',
      ],
      [
        'Φ(z)=P(Z≤z)。区间为Φ(z₂)−Φ(z₁)，右尾1−Φ(z)，不能忘尾方向；近似概率四位小数。',
        'Φ(z)=P(Z≤z). Subtract CDFs for an interval and use1−Φ(z) for a right tail. Give approximate probabilities to four decimal places.',
      ],
    ],
    items: [
      N(
        [
          'X~N(100,10²)，x=85的z分数是多少？',
          'For X~N(100,10²), what is the z-score of x=85?',
        ],
        '-3/2',
        [
          '(85−100)/10=−3/2，低于均值保留负号。',
          '(85−100)/10=−3/2; below the mean keeps a negative sign.',
        ],
        ['3/2', '-15'],
      ),
      N(
        [
          '同一模型，z=2对应原值x是多少？',
          'In the same model, what original value corresponds to z=2?',
        ],
        '120',
        ['x=100+10×2。', 'Use100+10×2.'],
        ['102', '20'],
      ),
      A(
        [
          '同一模型求P(X≤115)，保留四位小数。',
          'For the same model, find P(X≤115) to four decimal places.',
        ],
        '0.9332',
        [
          'z1.5，左尾Φ(1.5)≈0.9331928。',
          'z=1.5 and the left tail Φ(1.5)≈0.9331928.',
        ],
        ['0.0668', '0.4332'],
      ),
      A(
        [
          '同一模型求P(85≤X≤115)，保留四位小数。',
          'For the same model, find P(85≤X≤115) to four decimal places.',
        ],
        '0.8664',
        [
          'Φ(1.5)−Φ(−1.5)≈0.8663856。',
          'Subtract the CDFs at 1.5 and−1.5, giving approximately0.8663856.',
        ],
        ['0.9332', '0.0668'],
      ),
      A(
        [
          '同一模型求P(X>120)，保留四位小数。',
          'For the same model, find P(X>120) to four decimal places.',
        ],
        '0.0228',
        ['z2，右尾1−Φ(2)≈0.0227501。', 'z=2 and right tail1−Φ(2)≈0.0227501.'],
        ['0.9772', '0.4772'],
      ),
      E(
        [
          '写一份原值到z再到概率的报告，说明表的定义、尾方向、σ=0及非正态数据的限制。',
          'Report the conversion from original values to z and probability, including table convention, tail direction, σ=0 and nonnormal data.',
        ],
        [
          '85在均值100、标准差10的正态模型中z−1.5；115为1.5。先核表是左尾Φ还是0到z面积：本课Φ为左尾，区间作两端差，右尾用1−Φ。P85..115≈0.8664，P大于120≈0.0228，均是近似。z无单位且可负或大于1，不是概率。σ0不能除；一般数据可用正σ标准化，但不会自动变为正态，不能无条件查正态概率表。比较不同群体还需说明量的意义与高低方向。',
          'For normal mean 100 and SD 10,85 gives z−1.5 and 115 gives1.5. Check whether a table gives left-tail Φ or area from zero; this lesson uses left tails. Subtract endpoint CDFs for intervals and complement for right tails. The interval probability is approximately0.8664 and the tail beyond120 approximately0.0228. z is unitless, may be negative or exceed one, and is not a probability. SD zero prevents division. Positive-SD standardisation does not make arbitrary data normal, and cross-group comparisons require compatible meanings and directions.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于z=(x−μ)/σ，哪项正确？',
        'Which claim about z=(x−μ)/σ is correct?',
      ],
      correct: 0,
      options: [
        [
          'σ>0时可标准化，但查正态表还需正态假设',
          'Positive SD permits standardisation, but normal probabilities still need normality',
        ],
        ['所有数据标准化后都是正态', 'All standardised data are normal'],
        ['z一定在0与1之间', 'z must lie between zero and one'],
      ],
      feedback: [
        [
          '代数变换与分布假设是两件事。',
          'An algebraic transform and a distribution assumption are separate.',
        ],
        [
          '平移缩放不改变原分布形状类别。',
          'An affine transform does not change arbitrary shape into normality.',
        ],
        ['z是有方向的标准差个数。', 'z counts signed standard deviations.'],
      ],
    },
    reason: [
      '同为z=1，能否不看原模型就说都在第84.13百分位？',
      'Does z=1 alone establish the84.13th percentile without knowing the distribution?',
    ],
    rubric: [
      'z1只表示高于各自均值1个标准差；左尾概率还依赖分布形状。正态模型才有Φ1≈0.8413，其他分布可以不同。标准化保留原有形状，不能创造正态性；σ须正，单位消去不代表不同测量目标可直接排名，还需明确方向与情境。',
      'z=1 means one SD above the relevant mean; the left-tail probability still depends on distribution shape. A normal model gives Φ(1)≈0.8413, while others may differ. Standardising preserves shape rather than creating normality. SD must be positive, and removing units does not by itself make different measurement goals comparable.',
    ],
    prompts: [
      [
        '这个表给左尾还是0到z面积？',
        'Does the table give a left tail or area from zero to z?',
      ],
      [
        '你有正标准差和正态模型依据吗？',
        'Do you have positive SD and support for a normal model?',
      ],
    ],
    misconception: [
      'z不是概率，标准化不创造正态性；表定义和尾方向须先核。',
      'z is not a probability and standardising does not create normality; check table convention and tail direction.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `distribution-${i + 1}`;
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
    `distribution-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h33Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H33-L0${i + 1}`;
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
    unit: 'H33',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`distribution-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `distribution-${i + 1}`,
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

export function h33ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H33-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H33 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = D(
      [
        `共${b + 2}张等可能编号票，一张记−${a}，一张记${a}，其余${b}张记0。构造X完整分布表。`,
        `There are ${b + 2} equally likely numbered tickets: one labelled−${a}, one ${a}, and ${b} labelled zero. Construct the full X table.`,
      ],
      `-${a}:1/${b + 2};0:${b}/${b + 2};${a}:1/${b + 2}`,
      [
        '按编号票数归并同值，再除总票数。',
        'Merge equal labels by ticket counts and divide by the total.',
      ],
      ['0:1'],
    );
  else if (i === 1)
    item = N(
      [
        `X取${a}的概率1/${b + 1}，取0的概率${b}/${b + 1}，求E(X)。`,
        `X is ${a} with probability 1/${b + 1} and zero with probability${b}/${b + 1}. Find E(X).`,
      ],
      textR(rational(BigInt(a), BigInt(b + 1))),
      [
        '用概率加权，不按两个值直接平均。',
        'Use probability weights rather than an unweighted mean.',
      ],
    );
  else if (i === 2)
    item = N(
      [
        `X取±${a}各半，Y=${b}X+7，求Var(Y)。`,
        `X takes ±${a} equally. For Y=${b}X+7, find Var(Y).`,
      ],
      String(a * a * b * b),
      [
        'X均值0、方差a²，再乘缩放因子的平方；平移不改方差。',
        'X has mean zero and variance a²; multiply by squared scale, with no translation effect.',
      ],
    );
  else if (i === 3) {
    const n = a + 1;
    item = N(
      [
        `${n}次独立二分类，每次成功率1/${b + 1}，求恰1次成功概率。`,
        `For ${n} independent binary trials each with p=1/${b + 1}, find probability of exactly one success.`,
      ],
      textR(
        rational(
          BigInt(n) * BigInt(b) ** BigInt(n - 1),
          BigInt(b + 1) ** BigInt(n),
        ),
      ),
      [
        '任一成功位置共有n种，各项概率p(1−p)ⁿ⁻¹。',
        'There are n possible success positions, each with mass p(1−p)ⁿ⁻¹.',
      ],
    );
  } else if (i === 4) {
    const mu = 10 * a,
      s = b,
      l = 1 + (a % 3) / 2,
      r = b / 2;
    item = A(
      [
        `X~N(${mu},${s}²)，求P(${mu - s * l}≤X≤${mu + s * r})，四位小数。`,
        `For X~N(${mu},${s}²), find P(${mu - s * l}≤X≤${mu + s * r}) to four decimal places.`,
      ],
      probability4(normalCdf(r) - normalCdf(-l)),
      [
        '先标准化两个端点，再作左尾累计概率差，最后舍入。',
        'Standardise both endpoints, subtract left-tail CDFs, then round.',
      ],
      ['0.0000', '1.0000'],
    );
  } else {
    const mu = 10 * a,
      x = mu + ((a - 3) * b) / 2;
    item = N(
      [
        `某量均值${mu}、正标准差${b}，原值${x}的z是多少？`,
        `A quantity has mean ${mu} and positive SD ${b}. Find the z-score of ${x}.`,
      ],
      textR(rational(BigInt(a - 3), 2n)),
      [
        '原值先减均值再除正标准差；无需假设正态来算z。',
        'Subtract the mean, divide by positive SD; computing z alone needs no normality.',
      ],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h33CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H33-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H33-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H33-CHECK-Q8', 5, specs[5]!.items[5]!),
];
