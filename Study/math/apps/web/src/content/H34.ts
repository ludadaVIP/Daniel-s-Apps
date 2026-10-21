import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { textR } from '../algebraModels';
import {
  exactBinomialTest,
  type InferenceCode,
} from '../statisticalInferenceModels';
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
const C = (stem: Pair, value: InferenceCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'inference-code', value }, step, wrong);
const B = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'real-union', value }, step, wrong);
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
    title: ['总体、样本与抽样误差', 'Population, sample and sampling error'],
    objective: [
      '区分总体参数、样本统计量与带符号抽样误差，并检查抽样框是否覆盖目标总体。',
      'Distinguish a population parameter, sample statistic and signed sampling error, checking coverage of the sampling frame.',
    ],
    hook: [
      '样本均值碰巧等于真值，能证明抽样方法没有偏差吗？',
      'If one sample mean happens to match truth, does that prove an unbiased design?',
    ],
    prerequisites: ['H27-L04', 'H27-L05'],
    keywords: [
      ['总体参数', 'population parameter'],
      ['样本统计量', 'sample statistic'],
      ['抽样误差', 'sampling error'],
    ],
    lab: 'stat-inference-population',
    hints: [
      [
        '先确定目标总体与不同编号单位，再算样本均值；相同观测值不等于同一个人。',
        'Define the target population and distinct IDs before averaging a sample; equal values do not mean the same person.',
      ],
      [
        '带符号误差是样本均值减总体均值；设计偏差是重复抽样统计量的期望减参数。演示公开真值供核验，真实研究通常未知。',
        'Signed error is sample mean minus population mean; design bias is expected statistic minus parameter. Simulation reveals truth for checking, whereas real parameters are usually unknown.',
      ],
    ],
    items: [
      N(
        [
          '演示总体六个编号：A1,A2,A3值均0；B1,B2,B3值均6分钟。抽A1,A2，求样本均值减总体均值。',
          'A toy population has A1,A2,A3 all zero and B1,B2,B3 all six minutes. For sample A1,A2, find sample mean minus population mean.',
        ],
        '-3',
        [
          '总体均值18/6=3，样本均值0，误差0−3=−3分钟。',
          'Population mean 18/6=3, sample mean zero, signed error −3 minutes.',
        ],
        ['3', '0', '6'],
      ),
      N(
        [
          '同一演示总体共有多少个不同编号单位？',
          'How many distinct population units are in that model?',
        ],
        '6',
        [
          '六个编号不能按两个数值压成两个单位。',
          'Six IDs remain six units despite only two values.',
        ],
        ['2', '3'],
      ),
      N(
        [
          '同一总体抽A1,B1，样本均值多少分钟？',
          'In that population, what is the mean for sample A1,B1, in minutes?',
        ],
        '3',
        ['(0+6)/2=3。', '(0+6)/2=3.'],
        ['6', '0'],
      ),
      N(
        [
          '同一A1,B1样本的带符号抽样误差多少分钟？',
          'What is the signed sampling error for that A1,B1 sample?',
        ],
        '0',
        [
          '样本与总体均值恰同为3；单次误差0不证明设计无偏。',
          'Both means happen to be three; one zero error does not prove unbiasedness.',
        ],
        ['3', '6'],
      ),
      N(
        [
          '若抽样框只含A1,A2,A3，框内普查n=3，仍估计全体六人的均值。重复该设计的偏差多少分钟？',
          'If the frame contains only A1,A2,A3 and all three are observed, while targeting all six units, what is the design bias in minutes?',
        ],
        '-3',
        [
          '统计量恒0而目标均值3，偏差−3；框内普查不是目标总体普查。',
          'The statistic is always zero against target three: bias−3. A frame census is not a target-population census.',
        ],
        ['0', '3'],
      ),
      E(
        [
          '用六编号演示区分参数、统计量、一次误差、设计偏差，并解释为何框内多抽不能补回遗漏组。',
          'Use the six-ID model to distinguish parameter, statistic, one error and design bias, and explain why more draws inside a restricted frame do not restore the omitted group.',
        ],
        [
          '目标六人均值3是参数；A1,A2均值0是本次统计量，误差−3。全体简单随机抽样的均值期望3，设计无偏但单次仍可错；只在A框抽则统计量恒0、偏差−3，框内n增至3也不修复B组三人完全遗漏。全体普查n6消除本模型抽样变异，不自动消除测量或缺失问题。演示知道真值为方便核验，现实参数通常未知。',
          'Target mean three is a parameter; the A1,A2 mean zero is one statistic with error −3. Full-frame SRS is unbiased though individual samples can err. An A-only frame always returns zero and bias−3; taking all three A members still omits every B member. A full census removes sampling variability in this fixed model, not measurement or missing-data problems. Truth is revealed only to audit the demonstration.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对固定六人已给出的数值，什么设计消除抽样变异？',
        'For the six fixed supplied values, which design removes sampling variability?',
      ],
      correct: 1,
      options: [
        ['只把A框多抽几次', 'Repeat samples only inside frame A'],
        ['观察全部六个编号', 'Observe all six IDs'],
        ['把相同数值当同一个编号', 'Merge equal values into one ID'],
      ],
      feedback: [
        ['框外B仍遗漏。', 'B remains outside the frame.'],
        [
          '固定值下全体普查只有一个完整样本。',
          'A fixed-value census has one full sample.',
        ],
        [
          '数值相同不取消单位身份。',
          'Equal measurements do not remove unit identity.',
        ],
      ],
    },
    reason: [
      '一次误差为0与抽样方法无偏是同一个命题吗？',
      'Is one zero sampling error the same claim as an unbiased method?',
    ],
    rubric: [
      '不是。一次误差比较本次统计量与真参数；无偏比较在指定设计下所有可能样本统计量的概率加权期望与参数。偶然取到A1,B1恰均值3不证明任何设计都无偏；无偏也不保证每次恰3。还须检查目标总体、抽样框、非响应与测量，不能由单次接近就认证代表性。',
      'No. One error concerns one realised statistic; unbiasedness concerns its design-weighted expectation across possible samples. A coincidental mean three neither validates every design nor is guaranteed by an unbiased one. Audit the target population, frame, nonresponse and measurement rather than certifying representation from one close result.',
    ],
    prompts: [
      [
        '哪个数属于固定总体，哪个随样本变？',
        'Which number belongs to the fixed population and which varies with the sample?',
      ],
      ['谁根本没有机会进入样本？', 'Who has no chance of entering the sample?'],
    ],
    misconception: [
      '一次误差不是设计偏差；样本更多不自动修复覆盖缺失。',
      'One error is not design bias; more observations do not automatically repair frame undercoverage.',
    ],
  },
  {
    title: ['抽样分布模拟', 'Simulating sampling distributions'],
    objective: [
      '把重复样本均值作为随机变量，区分每次样本量n、重复次数R与理论抽样分布。',
      'Treat repeated sample means as a random variable, distinguishing within-sample n, repetition count R and the theoretical sampling distribution.',
    ],
    hook: [
      '再模拟100次，会让一次样本变大，还是让均值分布的频率估计更稳定？',
      'Do one hundred more repetitions enlarge each sample or refine empirical frequencies of sample means?',
    ],
    prerequisites: ['H34-L01', 'H33-L01', 'H33-L03'],
    keywords: [
      ['抽样分布', 'sampling distribution'],
      ['重复次数', 'repetition count'],
      ['标准误', 'standard error'],
    ],
    lab: 'stat-inference-sampling',
    hints: [
      [
        '按不同编号枚举所有同样大小的样本，再按均值归并；同均值的多个样本都要保留权重。',
        'Enumerate distinct-ID samples of fixed size and merge equal means while retaining every sample’s weight.',
      ],
      [
        '标准误是统计量抽样分布的标准差，不是单个观测值的标准差。R改变有限模拟频率，不改变固定n与设计的理论分布。',
        'SE is the SD of the statistic’s sampling distribution, not of individual observations. R changes simulated frequencies, not the theoretical law at fixed n and design.',
      ],
    ],
    items: [
      N(
        [
          '总体六个编号值为0,0,0,6,6,6。简单随机不放回抽n=2，样本均值的期望多少？',
          'From six distinct units valued 0,0,0,6,6,6, take SRS without replacement of size two. Find the expectation of the sample mean.',
        ],
        '3',
        [
          '15个等可能编号样本按0、3、6均值归并为3、9、3个，期望3。',
          'Fifteen equally likely samples produce means 0,3,6 with multiplicities 3,9,3, giving expectation three.',
        ],
        ['0', '6', '9'],
      ),
      N(
        [
          '同一设计共有多少个等可能的不同编号二人样本？',
          'How many equally likely distinct-ID two-member samples are possible?',
        ],
        '15',
        [
          'C(6,2)=15，不把重复值合并成一个人。',
          'C(6,2)=15; equal values remain different people.',
        ],
        ['3', '6', '36'],
      ),
      I(
        [
          '构造同一n=2样本均值的完整分布表，格式均值:概率;均值:概率。',
          'Construct the complete distribution table of that n=2 sample mean, using mean:probability rows.',
        ],
        { kind: 'distribution-table', value: '0:1/5;3:3/5;6:1/5' },
        [
          '同组样本各3个、跨组9个，除总15。',
          'There are three samples within each group and nine mixed samples, divided by fifteen.',
        ],
        ['0:1/3;3:1/3;6:1/3'],
      ),
      N(
        [
          '该n=2抽样均值的方差是多少？',
          'What is the variance of that n=2 sample mean?',
        ],
        '18/5',
        [
          '均值3，平方偏差9、0、9按1/5、3/5、1/5加权。',
          'Weight squared deviations 9,0,9 by 1/5,3/5,1/5.',
        ],
        ['9', '9/2', '3'],
      ),
      N(
        [
          '改为全体普查n=6，该样本均值的抽样方差是多少？',
          'For the census n=6, what is the sampling variance of the mean?',
        ],
        '0',
        [
          '只有一个完整样本，均值恒3。',
          'There is one full sample and its mean is always three.',
        ],
        ['9', '3'],
      ),
      E(
        [
          '解释原始观测分布、均值的理论抽样分布、有限模拟频率及标准误，保留不放回条件。',
          'Explain the raw-value law, theoretical mean sampling law, simulated frequencies and SE, retaining the without-replacement condition.',
        ],
        [
          '六个原值的均值3、总体方差9；n2均值只取0、3、6，质量1/5、3/5、1/5，方差18/5、标准误√(18/5)。n3时质量在0、2、4、6为1/20、9/20、9/20、1/20，方差9/5；n6方差0。不放回含有限总体修正，不能无条件用9/n。R增多只改善频率估计，不改这个离散理论分布，也不使其自动正态。零次频率未定义。',
          'Raw values have mean three and population variance nine. For n=2, means 0,3,6 have masses 1/5,3/5,1/5, variance 18/5 and SE √(18/5). For n=3 the four masses are1/20,9/20,9/20,1/20 at0,2,4,6, with variance 9/5; a census has zero variance. Without-replacement sampling needs a finite-population correction, not unconditional 9/n. More repetitions refine frequencies without changing this discrete law or making it normal. Zero-repetition frequency is undefined.',
        ],
      ),
    ],
    pick: {
      stem: [
        '固定n与抽样设计，只增大R会怎样？',
        'With n and design fixed, what does increasing R change?',
      ],
      correct: 2,
      options: [
        ['单次样本人数增大', 'Each sample contains more people'],
        ['理论分布必变正态', 'The theoretical law must become normal'],
        [
          '有限模拟频率可更稳定，理论分布不变',
          'Empirical frequencies can stabilise while the theoretical law stays the same',
        ],
      ],
      feedback: [
        ['n与R不是同一数量。', 'n and R are different counts.'],
        [
          '当前理论分布仍只有有限个均值。',
          'The law still has finitely many possible means.',
        ],
        [
          '重复只补充对固定分布的观察。',
          'Repetition adds observations of a fixed distribution.',
        ],
      ],
    },
    reason: [
      '为何R很大也不能把有偏框的均值“校正”为全体真均值？',
      'Why cannot a large R correct a biased-frame mean to the target population mean?',
    ],
    rubric: [
      '重复会更清楚地呈现该设计自己的分布。只在A框时所有样本均值为0，R再大也仍集中0，目标全体均值3不会自动出现。理论偏差−3不是有限模拟误差。必须修正覆盖与设计，而不是通过重采同一有偏框或把直方图平滑来声称消除偏差。',
      'Repetition reveals the chosen design more clearly. Under the A-only frame every mean is zero, so a larger R concentrates evidence there rather than at the target mean three. Design bias−3 is not finite-simulation error. Repair coverage and design instead of resampling or smoothing the biased frame.',
    ],
    prompts: [
      [
        '这张图的每个点是一个观测还是一个样本均值？',
        'Does one plotted value represent an observation or a sample mean?',
      ],
      ['改变了n、R还是抽样设计？', 'Did you change n, R or the design?'],
    ],
    misconception: [
      '重复数非样本量；更多模拟不改变理论分布或修复偏差。',
      'Repetitions are not sample size; more simulations do not change the theoretical law or repair bias.',
    ],
  },
  {
    title: ['置信区间的直觉', 'Intuition of confidence intervals'],
    objective: [
      '在明确已知σ的正态独立模型中构造区间，并用重复覆盖解释置信水平。',
      'Construct an interval under an explicit independent normal model with known σ and interpret confidence through repeated coverage.',
    ],
    hook: [
      '已经得到的区间固定后，“95%”说的是谁在重复变化？',
      'Once an observed interval is fixed, what is varying in the repeated-sampling meaning of 95%?',
    ],
    prerequisites: ['H34-L02', 'H33-L06'],
    keywords: [
      ['区间估计', 'interval estimate'],
      ['误差界', 'margin of error'],
      ['覆盖率', 'coverage'],
    ],
    lab: 'stat-inference-confidence',
    hints: [
      [
        '此处另设iid正态观测且σ已知；SE=σ/√n，区间为均值±z*SE。不要套到前课有限总体不放回模型。',
        'Here observations are iid normal with known σ: SE=σ/√n and interval=mean±z*SE. Do not silently apply this to the previous finite-population design.',
      ],
      [
        '参数固定，重复变化的是样本与区间；z*=2对应覆盖约0.9545，不是精确95%。这不是个体预测区间。',
        'The parameter is fixed while samples and intervals vary. z*=2 gives coverage approximately 0.9545, not exactly 95%. This is not an individual prediction interval.',
      ],
    ],
    items: [
      B(
        [
          'iid正态观测、总体σ已知为4，n=16，观测均值10，给定z*=2。构造闭区间，用[a,b]。',
          'For iid normal observations with known population σ=4, n=16, observed mean 10 and z*=2, construct the closed interval [a,b].',
        ],
        '[8,12]',
        [
          'SE4/4=1，误差界2，区间[8,12]。',
          'SE=1, margin two, interval [8,12].',
        ],
        ['[9,11]', '(8,12)', '[6,14]'],
      ),
      N(
        [
          '同一已知σ=4、n=16模型的标准误是多少？',
          'For the same known σ=4 and n=16 model, find SE.',
        ],
        '1',
        ['σ除√n，不是σ除n。', 'Divide σ by √n, not n.'],
        ['1/4', '4'],
      ),
      N(
        [
          '同一模型给定z*=2，误差界是多少？',
          'With z*=2 under that model, find the margin.',
        ],
        '2',
        ['z*乘SE，即2×1。', 'Multiply critical value two by SE one.'],
        ['1', '4'],
      ),
      B(
        [
          '观测均值仍10、σ已知4、z*=2，改n=64，构造闭区间。',
          'Keep observed mean 10, known σ=4 and z*=2, but set n=64. Construct the closed interval.',
        ],
        '[9,11]',
        ['SE4/8=1/2，误差界1。', 'SE=1/2 and margin one.'],
        ['[8,12]', '[9.5,10.5]'],
      ),
      I(
        [
          'iid正态已知σ时，用z*=2构造双侧区间，其理论覆盖率近似到四位小数是多少？',
          'For iid normal known-σ intervals with z*=2, give theoretical two-sided coverage to four decimals.',
        ],
        { kind: 'distribution-rounded', value: '0.9545' },
        ['P(−2≤Z≤2)=2Φ(2)−1≈0.9545。', 'Use 2Φ(2)−1≈0.9545.'],
        ['0.9500', '0.9772'],
      ),
      E(
        [
          '说明区间公式的条件、重复覆盖、固定参数及个体预测区别；有限模拟覆盖能否强制等于名义水平？',
          'Explain model conditions, repeated coverage, the fixed parameter and prediction distinction. Must simulated coverage equal the nominal level?',
        ],
        [
          '在独立同分布正态、总体σ确已知条件下，样本均值分布SE=σ/√n，区间均值±z*SE。固定真μ，重复抽样时不同区间覆盖它的比例长期接近2Φ(z*)−1；已观测区间固定后不能据此给μ赋这个频率概率，也非95%个体都在其中。z2为约95.45%、1.96为约95%，均有近似标记。有限覆盖率会波动，不能硬改到名义值；σ未知、依赖、有偏抽样或有限总体不放回需另审方法。',
          'Under iid normal observations with truly known σ, SE=σ/√n and the interval is mean±z*SE. With fixed μ, repeated random intervals cover it at long-run rate 2Φ(z*)−1. A realised fixed interval does not thereby assign μ that frequentist probability, nor contain that proportion of individuals. z*=2 gives about 95.45% and 1.96 about 95%. Finite coverage fluctuates. Unknown σ, dependence, biased sampling or finite-population designs require a fresh method check.',
        ],
      ),
    ],
    pick: {
      stem: [
        '给定一个已观察区间，标准频率学派的置信水平解释是？',
        'What is the standard frequentist interpretation of confidence level?',
      ],
      correct: 0,
      options: [
        [
          '同一方法重复产生的区间长期按该比例覆盖固定参数',
          'Repeated intervals from the method cover the fixed parameter at that long-run rate',
        ],
        [
          '该固定区间包含95%的个体',
          'That fixed interval contains 95% of individuals',
        ],
        [
          '固定μ会在区间内随机移动',
          'The fixed μ moves randomly inside the interval',
        ],
      ],
      feedback: [
        [
          '概率首先属于抽样过程与随机区间。',
          'The sampling process and random interval carry the probability.',
        ],
        [
          '均值区间不是个体预测区间。',
          'A mean interval is not a prediction interval.',
        ],
        [
          '参数固定，区间随样本变化。',
          'The parameter stays fixed as intervals change.',
        ],
      ],
    },
    reason: [
      '更宽的区间一定比更窄的区间“更准确”吗？',
      'Is a wider interval always more accurate than a narrower one?',
    ],
    rubric: [
      '在同一正确模型、数据与方法族下，提高置信水平通常增加宽度和长期覆盖，但降低精度；样本量增加可在同一水平下缩窄区间。宽窄本身不能修复有偏设计或错模型，也不能由一次区间是否碰巧覆盖来判定普遍质量。须一起报告覆盖水平、条件、样本量、σ信息和区间宽度。',
      'For the same valid model, data and method family, higher confidence usually widens intervals and raises coverage while reducing precision. More data can narrow them at fixed confidence. Width alone repairs neither bias nor a wrong model; one realised hit or miss does not establish overall quality. Report level, assumptions, n, σ information and width together.',
    ],
    prompts: [
      [
        '重复时固定的是μ还是区间？',
        'Across repetitions, is μ or the interval fixed?',
      ],
      [
        '这里σ真已知吗？样本是独立正态吗？',
        'Is σ really known, and are observations independent and normal?',
      ],
    ],
    misconception: [
      '置信水平非参数后验概率，非个体覆盖；z2也非精确95%。',
      'Confidence is not a posterior probability or individual coverage; z*=2 is not exactly 95%.',
    ],
  },
  {
    title: ['假设检验的基本逻辑', 'Logic of hypothesis testing'],
    objective: [
      '在预先指定的公平硬币零假设下，计算至少同样极端的概率并解释拒绝或不拒绝。',
      'Under a prespecified fair-coin null, calculate probability of outcomes at least as extreme and interpret rejection or non-rejection.',
    ],
    hook: [
      '四次全正面很少见，是零假设为真的概率很小吗？',
      'Four heads are rare under fairness. Is that the probability that fairness is true?',
    ],
    prerequisites: ['H33-L04', 'H34-L02'],
    keywords: [
      ['零假设', 'null hypothesis'],
      ['p值', 'p-value'],
      ['拒绝规则', 'rejection rule'],
    ],
    lab: 'stat-inference-test',
    hints: [
      [
        '先固定n、H0成功率1/2、备择方向与α，再按H0分布合并至少同样极端的结果，包含观测值。',
        'Prespecify n, null p=1/2, alternative and α, then sum null outcomes at least as extreme, including the observation.',
      ],
      [
        '本课规则p≤α则reject，否则do-not-reject。不拒绝不证明H0真；p是H0下尾概率，不是P(H0|数据)。',
        'Use reject when p≤α, otherwise do-not-reject. Non-rejection does not establish truth; p is a null-tail probability, not P(H0|data).',
      ],
    ],
    items: [
      N(
        [
          '预设H0为独立公平抛币，固定n=4，备择为正面率>1/2。观察X=4，求单侧p值。',
          'Prespecify four independent tosses, null fairness and alternative head rate>1/2. Observing X=4, find the one-sided p-value.',
        ],
        '1/16',
        [
          'H0下X≥4只含4，概率1/16。',
          'The null event X≥4 contains only four heads, with mass 1/16.',
        ],
        ['0', '1/8', '15/16'],
      ),
      C(
        [
          '上述p=1/16，预设α=1/10。按p≤α规则写reject或do-not-reject。',
          'With that p=1/16 and prespecified α=1/10, apply the p≤α rule: reject or do-not-reject.',
        ],
        'reject',
        [
          '1/16≤1/10，按规则拒绝；并非证明公平不可能。',
          '1/16≤1/10 triggers rejection, not proof that fairness is impossible.',
        ],
        ['do-not-reject', 'accept'],
      ),
      N(
        [
          '同一上侧检验改观察X=3，p值是多少？',
          'In the same upper-tail test, what is the p-value at X=3?',
        ],
        '5/16',
        ['包括X3与4，4/16+1/16。', 'Include counts three and four:4/16+1/16.'],
        ['1/16', '1/4'],
      ),
      N(
        [
          '若事先选双侧统计量|X−2|，仍观察4，求P_H0(|X−2|≥2)。',
          'If the two-sided statistic |X−2| was chosen in advance and four is observed, find P_H0(|X−2|≥2).',
        ],
        '1/8',
        [
          '计数0和4都同样极端，1/16+1/16。',
          'Counts zero and four are equally extreme, giving 2/16.',
        ],
        ['1/16', '0'],
      ),
      C(
        [
          '预设规则仍p≤α，若p与α恰同为1/16，写reject或do-not-reject。',
          'Under the declared p≤α convention, if both equal 1/16, enter reject or do-not-reject.',
        ],
        'reject',
        [
          '本题规则明确包括等号，不能改成严格小于。',
          'The stated rule includes equality.',
        ],
        ['do-not-reject', 'accept'],
      ),
      E(
        [
          '解释p值、α、至少同样极端、双侧方向与两类错误，并保留预设分析条件。',
          'Explain p, α, at-least-as-extreme outcomes, sidedness and the two error types, retaining prespecification.',
        ],
        [
          'p在H0及其他模型条件下计算，四币上侧4为1/16，不是公平为真的概率。至少同样极端包含观测值；事先双侧|X−2|在4还加0得1/8。α是重复H0为真时拒绝的控制水平，离散检验实际错误率可低于它；n4上侧α0.1的拒绝域只4，错误率1/16。拒绝可能犯I类错误，不拒绝可能漏掉实际差异而犯II类；不拒绝不等于证实H0。不能看结果换尾、反复窥看直到显著或隐瞒多次检验。',
          'p is computed under H0 and other assumptions, not the probability that H0 is true. At least as extreme includes the observation. A preplanned two-sided statistic adds the opposite tail. α controls repeated rejection under true H0; discreteness may make actual type-I rate smaller, here 1/16 at α=0.1. Rejection can be type-I error; non-rejection can miss a real departure, a type-II error. Non-rejection is not confirmation. Do not choose tails after seeing results, peek until significant or hide multiple tests.',
        ],
      ),
    ],
    pick: {
      stem: ['p=1/16的正确含义是哪项？', 'What does p=1/16 correctly mean?'],
      correct: 2,
      options: [
        ['H0有1/16概率为真', 'H0 has probability 1/16 of being true'],
        [
          '数据有15/16概率没有随机性',
          'The data have 15/16 probability of being nonrandom',
        ],
        [
          '在H0与设计条件下，至少同样极端事件概率1/16',
          'Under H0 and design assumptions, the at-least-as-extreme event has probability 1/16',
        ],
      ],
      feedback: [
        ['条件方向反了。', 'This reverses the conditioning.'],
        ['不是在给随机性分配这类概率。', 'That is not what is being measured.'],
        [
          '这是预设检验下的尾概率定义。',
          'This is the null-tail definition for the planned test.',
        ],
      ],
    },
    reason: [
      'p大就可以宣布“没有差异”吗？',
      'Can a large p-value establish no difference?',
    ],
    rubric: [
      '不拒绝只表示当前设计与数据没有达到既定反对H0的规则，不是证明无差异。样本小、变异大、设计问题或效应小都可能使证据不足；要结合效应估计、区间与研究能力。若要主张足够接近零，还需预先定义实际可忽略范围与相应方法，不能把普通不显著直接当等效。',
      'Non-rejection means the current design and data did not meet the declared rule against H0, not proof of equality. Small samples, variation, design issues or small effects can limit evidence. Examine effect estimates, intervals and study capability. A claim of practical equivalence needs a prespecified negligible range and an appropriate method; ordinary non-significance is insufficient.',
    ],
    prompts: [
      [
        '这个概率是在假设什么为真时计算？',
        'Under which assumed model is this probability computed?',
      ],
      [
        '方向、停止规则与阈值是否事先确定？',
        'Were direction, stopping rule and threshold set beforehand?',
      ],
    ],
    misconception: [
      'p非H0真概率；不拒绝非证实；事后换尾或窥看会改变错误率。',
      'p is not the probability of H0; non-rejection is not confirmation, and post-hoc tails or peeking alter error control.',
    ],
  },
  {
    title: ['统计显著与实际重要', 'Statistical vs practical significance'],
    objective: [
      '联合报告效应、单位、区间与预定实际阈值，区分小p与有用改善。',
      'Report effect, units, interval and a prespecified practical threshold, separating small p from useful improvement.',
    ],
    hook: [
      '巨大样本把0.2分钟变得显著，就意味着达到了至少1分钟的目标吗？',
      'If a huge sample makes 0.2 minutes significant, has it reached a one-minute improvement target?',
    ],
    prerequisites: ['H34-L03', 'H34-L04'],
    keywords: [
      ['效应大小', 'effect size'],
      ['实际阈值', 'practical threshold'],
      ['不确定性', 'uncertainty'],
    ],
    lab: 'stat-inference-importance',
    hints: [
      [
        '先写方向、单位与事先阈值Δ。这里正数表示改善；p检验与0的差异，不直接检验达到Δ。',
        'State direction, units and prespecified Δ. Positive means improvement; a p-value against zero does not directly test reaching Δ.',
      ],
      [
        '本课按区间分类：下限≥Δ为meets-target，上限<Δ为below-target，否则uncertain。这是区间比较，不是对参数赋确定概率。',
        'For this interval comparison: lower≥Δ means meets-target, upper<Δ below-target, otherwise uncertain. This compares interval positions rather than assigning certainty to a parameter.',
      ],
    ],
    items: [
      C(
        [
          '改善估计0.2分钟，约95%区间[0.1216,0.2784]，p约0.00000057；事先目标改善至少1分钟。按区间规则填meets-target、below-target或uncertain。',
          'Estimated improvement is 0.2 minutes, approximate 95% interval [0.1216,0.2784], p≈0.00000057. The prespecified goal is at least one minute. Classify by the interval rule: meets-target, below-target or uncertain.',
        ],
        'below-target',
        [
          '整个区间低于1，虽与0有很强差异证据，仍未达设定改善目标。',
          'The whole interval lies below one; evidence of departure from zero does not establish the target benefit.',
        ],
        ['meets-target', 'uncertain'],
      ),
      N(
        [
          '已知σ=4分钟、iid正态模型，n=10000，均值估计的标准误是多少分钟？',
          'Under an iid normal model with known σ=4 minutes and n=10000, find SE in minutes.',
        ],
        '1/25',
        ['4/√10000=4/100=1/25。', '4/100=1/25.'],
        ['4/10000', '4'],
      ),
      N(
        [
          '同一模型点估计差0.2分钟，对比零差异的z值是多少？',
          'With estimated difference 0.2 minutes in that model, what is z against zero?',
        ],
        '5',
        [
          '(1/5)/(1/25)=5，变得精确不改变0.2分钟本身。',
          '(1/5)/(1/25)=5; precision does not enlarge the effect itself.',
        ],
        ['1/5', '25'],
      ),
      C(
        [
          '改善点估计2分钟，约95%区间[−1.92,5.92]，目标至少1分钟。按区间规则分类。',
          'Estimated improvement is two minutes, approximate 95% interval [−1.92,5.92], and target at least one minute. Classify by the interval rule.',
        ],
        'uncertain',
        [
          '区间跨越目标，既未全达标也未全低于；不能只凭点估计2宣布成功。',
          'The interval crosses the target; a point estimate two does not settle it.',
        ],
        ['meets-target', 'below-target'],
      ),
      C(
        [
          '改善点估计2分钟，约95%区间[1.216,2.784]，目标至少1分钟。按区间规则分类。',
          'Estimated improvement is two minutes, approximate 95% interval [1.216,2.784], target at least one minute. Classify by the interval rule.',
        ],
        'meets-target',
        [
          '下限已≥1，在本模型与区间程序下支持达到目标，仍要报告条件。',
          'The lower endpoint exceeds one, supporting the target under the stated model and interval procedure.',
        ],
        ['uncertain', 'below-target'],
      ),
      E(
        [
          '比较微小精确效应、大而不精确效应与负向效应，写有单位、区间、阈值、p和局限的报告。',
          'Compare a tiny precise effect, a large uncertain effect and a negative effect in a report with units, interval, threshold, p and limitations.',
        ],
        [
          '0.2分钟在n10000已知σ4下SE0.04、z5、小p，但约95%区间[0.1216,0.2784]全低于1分钟目标。2分钟在n4下区间[−1.92,5.92]很宽，不显著也不证明无用；n100时区间[1.216,2.784]支持目标。负向−2分钟的精确区间全在0左侧时可显著有害，不该称无影响。p不衡量效应大小或价值，区间不赋固定参数后验概率；还需预设方向阈值、成本、设计及完整报告，不能事后挑阈值。',
          'A 0.2-minute estimate with n=10000 and known σ=4 has SE=0.04, z=5 and a tiny p, yet its approximate 95% interval [0.1216,0.2784] stays below the one-minute goal. A two-minute estimate with n=4 has wide interval [−1.92,5.92]; non-significance does not establish uselessness. With n=100, interval [1.216,2.784] supports the goal. A precise negative effect can indicate harm. p measures neither size nor value, and a confidence interval is not a posterior probability. Prespecify direction and threshold, consider costs and design, and report transparently.',
        ],
      ),
    ],
    pick: {
      stem: ['哪份结论最完整？', 'Which conclusion is most complete?'],
      correct: 1,
      options: [
        [
          'p<0.05，所以一定值得采用',
          'p<0.05, so adoption is necessarily worthwhile',
        ],
        [
          '同时给效应、单位、区间、预定阈值及模型条件',
          'Report effect, units, interval, prespecified threshold and model conditions',
        ],
        ['p大，所以真效应必为0', 'A large p proves the true effect zero'],
      ],
      feedback: [
        [
          '小p不自动代表效应够大或收益够好。',
          'A small p does not guarantee sufficient benefit.',
        ],
        [
          '统计证据与实际问题一起解释。',
          'Interpret statistical evidence with the practical question.',
        ],
        ['不拒绝不是证明零效应。', 'Non-rejection does not prove zero effect.'],
      ],
    },
    reason: [
      '为什么“非常显著但效应很小”与“大效应但不显著”都可能发生？',
      'Why can a tiny effect be highly significant and a large estimate non-significant?',
    ],
    rubric: [
      '在已知σ正态均值模型，z=估计差/SE，SE=σ/√n；大n可使小差异的SE很小，小n或大波动可使大点估计仍不精确。显著性针对零假设和程序，不等于效应大小、实际价值或因果性。应报告原单位效应、区间、预定重要阈值与设计，不能把p当决策的唯一开关。',
      'For a known-σ normal mean, z is estimated difference divided by SE, and SE=σ/√n. Large n can make a tiny difference precise; small n or high variation can leave a large estimate uncertain. Significance concerns a null and procedure, not size, value or causality. Report the original-unit effect, interval, prespecified threshold and design rather than using p as the sole decision switch.',
    ],
    prompts: [
      [
        '差异有多少原单位，目标是多少？',
        'How large is the difference in original units, and what is the target?',
      ],
      [
        '区间相对0与实际阈值的位置各怎样？',
        'Where does the interval lie relative to zero and to the practical threshold?',
      ],
    ],
    misconception: [
      '显著不等于重要，不显著不等于无效；负向显著也可能有害。',
      'Significant need not mean important, non-significant need not mean no effect, and a significant negative effect can be harmful.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `stat-inference-${i + 1}`;
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
    `stat-inference-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h34Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H34-L0${i + 1}`;
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
    unit: 'H34',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`stat-inference-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `stat-inference-${i + 1}`,
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

export function h34ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H34-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H34 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = N(
      [
        `为核验演示，已知总体均值${10 + a}；抽到三个不同编号，其值都为${10 + b}。样本均值减总体均值是多少？`,
        `For an audit demonstration, population mean is known to be ${10 + a}. Three distinct sampled units each have value ${10 + b}. Find sample mean minus population mean.`,
      ],
      String(b - a),
      [
        '相同值不取消不同编号；先求本次均值，再减给定参数。',
        'Equal values retain distinct IDs; calculate the realised mean and subtract the supplied parameter.',
      ],
    );
  else if (i === 1)
    item = N(
      [
        `六编号值为${b},${b},${b},${b + 2 * a},${b + 2 * a},${b + 2 * a}。简单随机不放回抽2人，样本均值的期望是多少？`,
        `Six distinct units have values ${b},${b},${b},${b + 2 * a},${b + 2 * a},${b + 2 * a}. Under SRS of two without replacement, find expected sample mean.`,
      ],
      String(a + b),
      [
        '同组与跨组样本保留多重性；无偏均值估计的期望等于总体均值。',
        'Retain sample multiplicities; the unbiased mean has expectation equal to the population mean.',
      ],
    );
  else if (i === 2) {
    const m = 10 + a;
    item = B(
      [
        `iid正态、σ已知${2 * b}、n4、观测均值${m}、z*=2，构造闭区间。`,
        `Under iid normal observations with known σ=${2 * b}, n4, observed mean ${m} and z*=2, construct the closed interval.`,
      ],
      `[${m - 2 * b},${m + 2 * b}]`,
      [
        'SE=σ/2，误差界再乘2；写有序闭端点。',
        'SE is σ/2; multiply by two for the margin and write ordered closed endpoints.',
      ],
      ['[0,0]'],
    );
  } else if (i === 3) {
    const n = a + 3,
      observed = n - b + 1,
      p = exactBinomialTest(n, observed, 'upper').p;
    item = N(
      [
        `预设公平独立硬币H0，固定n=${n}，上侧备择，观察X=${observed}。求精确p值。`,
        `Prespecify fair independent tosses under H0, fixed n=${n} and an upper-tail alternative. With X=${observed}, find the exact p-value.`,
      ],
      textR(p),
      [
        '在H0下把观察值及更大的次数概率相加，不反转条件。',
        'Sum null masses at the observed count and above, without reversing the conditioning.',
      ],
    );
  } else {
    const d = a - 3,
      lower = d - b / 2,
      upper = d + b / 2,
      value: InferenceCode =
        lower >= 1 ? 'meets-target' : upper < 1 ? 'below-target' : 'uncertain';
    item = C(
      [
        `正数为改善，事先目标至少1。给定约95%区间[${lower},${upper}]，按区间规则分类。`,
        `Positive means improvement and the prespecified target is at least one. Given approximate 95% interval [${lower},${upper}], classify by the interval rule.`,
      ],
      value,
      [
        '全区间≥目标才meets-target；全低于才below-target；跨阈值为uncertain。',
        'Use meets-target only when the full interval reaches the target, below-target when entirely lower, otherwise uncertain.',
      ],
      ['999'],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h34CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H34-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H34-CHECK-Q6', 2, specs[2]!.items[5]!),
  question('H34-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H34-CHECK-Q8', 4, specs[4]!.items[5]!),
];
