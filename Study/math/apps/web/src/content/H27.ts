import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
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
const C = (
  stem: Pair,
  value: 'undefined' | 'not-identified' | 'interpolation' | 'extrapolation',
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'data-code', value }, step, wrong);
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
    title: ['相关系数', 'Correlation coefficient'],
    objective: [
      '用配对中心化计算相关系数，区分线性强度、斜率、曲线关联与因果。',
      'Calculate correlation from centred pairs and distinguish linear strength from slope, curved association and causation.',
    ],
    hook: [
      '把厘米改成米，会改变相关程度吗？r=0就代表两变量无关吗？',
      'Does changing centimetres to metres alter correlation? Does r=0 mean no relationship?',
    ],
    prerequisites: ['H08-L04', 'H08-L05'],
    keywords: [
      ['配对中心化', 'centred pairs'],
      ['线性相关', 'linear correlation'],
      ['零方差', 'zero variance'],
    ],
    lab: 'stats-correlation',
    hints: [
      [
        '先保留同一对象的(x,y)配对，算两列均值与中心化差；不能分别排序后再配。',
        'Retain each subject’s (x,y) pair, then centre both columns. Sorting each column separately destroys the pairing.',
      ],
      [
        'r=Sxy/√(Sxx Syy)，两列都必须有变异；r²无符号，r保留Sxy符号。r=0只说明无样本线性相关。',
        'Use r=Sxy/√(Sxx Syy), requiring variation in both columns. r² loses direction; r retains the sign of Sxy. Zero describes sample linear correlation only.',
      ],
    ],
    items: [
      N(
        [
          '配对(1,1)、(2,3)、(3,2)，求Pearson相关系数r。',
          'For pairs (1,1), (2,3), (3,2), find Pearson correlation r.',
        ],
        '1/2',
        [
          '两均值2，Sxx=2、Syy=2、Sxy=1，所以r=1/2。',
          'Both means are two; Sxx=2, Syy=2, Sxy=1, giving r=1/2.',
        ],
        ['1', '1/4', '2'],
      ),
      N(
        ['同三对数据r=1/2，求r²。', 'For the same pairs with r=1/2, find r².'],
        '1/4',
        ['(1/2)²=1/4，r²不是r。', '(1/2)²=1/4; r² differs from r.'],
        ['1/2', '-1/4', '1'],
      ),
      N(
        [
          '将配对改成(1,−1)、(2,−3)、(3,−2)，求r。',
          'For pairs (1,−1), (2,−3), (3,−2), find r.',
        ],
        '-1/2',
        [
          'y整体乘−1，Sxy反号，相关系数反号。',
          'Multiplying y by −1 reverses Sxy and the sign of correlation.',
        ],
        ['1/2', '-1', '1/4'],
      ),
      C(
        [
          '配对(1,2)、(2,2)、(3,2)的r？未定义填undefined。',
          'Find r for (1,2), (2,2), (3,2); enter undefined if undefined.',
        ],
        'undefined',
        [
          'y无变异，Syy=0，分母0，不能定义成r=0。',
          'Y has no variation, so Syy=0 and the denominator is zero; r is not zero.',
        ],
        ['0', '1', 'not-identified'],
      ),
      N(
        [
          '配对(1,4)、(2,1)、(3,0)、(4,1)、(5,4)，求r。',
          'For (1,4), (2,1), (3,0), (4,1), (5,4), find r.',
        ],
        '0',
        [
          '均值(3,2)，Sxy=0但Sxx、Syy正；r=0，图形仍有U形关系。',
          'The means are (3,2); Sxy=0 with both sums of squares positive. Correlation is zero despite a U-shaped relationship.',
        ],
        ['1', '-1', 'undefined'],
      ),
      E(
        [
          '解释三对数据r=1/2的计算，并比较正向单位转换、负向反射、常数列与U形数据。能从r推出因果吗？',
          'Explain the r=1/2 calculation and compare positive unit changes, negative reflection, a constant column and the U-shaped data. Can r establish causation?',
        ],
        [
          '中心差x为−1,0,1、y为−1,1,0，交积和1、各平方和2，r=1/2。正比例单位转换与平移不改r，负比例转换反号，斜率则随单位变。常数列使r未定义，U形案例r=0仍有关联。r只描述这些配对的线性方向强度，不能单凭它推出因果、独立性或总体结论；先查设计、异常点和范围。',
          'Centred x values −1,0,1 and y values −1,1,0 give cross-product sum one and square sums two, so r=1/2. Positive unit changes and shifts preserve r; negative scaling reverses its sign, while slope depends on units. A constant column makes r undefined, and the U-shaped example has zero correlation despite association. This sample statistic alone establishes neither causation, independence nor a population conclusion; inspect design, unusual observations and scope.',
        ],
      ),
    ],
    pick: {
      stem: ['r=0时哪项结论可靠？', 'Which conclusion is justified by r=0?'],
      options: [
        ['一定独立', 'The variables must be independent'],
        ['一定没有任何关系', 'No relationship of any kind exists'],
        [
          '样本线性相关为0，仍需看散点图',
          'Sample linear correlation is zero; still inspect the scatterplot',
        ],
      ],
      feedback: [
        ['零相关不推出独立。', 'Zero correlation does not imply independence.'],
        [
          '曲线关系可有零线性相关。',
          'A curved relationship may have zero linear correlation.',
        ],
        [
          'U形例子说明需要完整图形。',
          'The U-shaped example shows why the full pattern matters.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '把x列和y列分别从小到大排序再配对，为什么不能称为“清理数据后相关变强”？',
      'Why is separately sorting x and y before re-pairing not legitimate cleaning that strengthens correlation?',
    ],
    rubric: [
      '一行代表同一个对象的两项测量。分别排序会把不同对象拼成新配对，改变Sxy及研究资料，而非只换单位或显示顺序。必须保留原ID，最多按整行一起重排。较强的人工相关不能支持原数据结论，先核配对、来源和设计；不能为了得到较大r删改原记录。',
      'Each row links two measurements on the same unit. Sorting columns separately creates artificial pairings and changes Sxy and the evidence. Preserve IDs and reorder whole rows together. An artificially stronger r does not support a conclusion about the original data; audit pairing, sources and design rather than editing records to enlarge r.',
    ],
    prompts: [
      [
        '配对身份还保留吗？',
        'Have the original pair identities been preserved?',
      ],
      [
        '你在解释线性程度、斜率还是因果？',
        'Are you interpreting linear strength, slope or causation?',
      ],
    ],
    misconception: [
      'r不等于斜率；零相关不等于无关系，常数列的r不是0。',
      'Correlation is not slope; zero correlation does not mean no relationship, and a constant column does not give r=0.',
    ],
  },
  {
    title: ['最小二乘直线的直觉', 'Least-squares regression intuition'],
    objective: [
      '以同一x处的竖直残差平方和评价候选线，用精确恒等式确认全局最小。',
      'Evaluate candidate lines by squared vertical residuals at the same x and confirm the global minimum with an exact identity.',
    ],
    hook: [
      '残差正负相加为0，就已经是最好的线了吗？',
      'If signed residuals add to zero, is the line necessarily best?',
    ],
    prerequisites: ['H27-L01', 'H08-L05'],
    keywords: [
      ['竖直残差', 'vertical residual'],
      ['残差平方和', 'sum of squared errors'],
      ['中心点', 'mean point'],
    ],
    lab: 'stats-least-squares',
    hints: [
      [
        '先用ŷ=a+bx算每个x的预测，再算e=y−ŷ和e²；正负不能在平方前抵消。',
        'Compute ŷ=a+bx at each observed x, then e=y−ŷ and e². Do not cancel signs before squaring.',
      ],
      [
        '含截距且Sxx>0时b*=Sxy/Sxx，a*=ȳ−b*x̄。候选SSE=SSEmin+n(a+bx̄−ȳ)²+Sxx(b−b*)²。',
        'With an intercept and Sxx>0, b*=Sxy/Sxx and a*=ȳ−b*x̄. Candidate SSE equals SSEmin+n(a+bx̄−ȳ)²+Sxx(b−b*)².',
      ],
    ],
    items: [
      N(
        [
          '对(1,1)、(2,3)、(3,2)，含截距的最小二乘斜率b是多少？',
          'For (1,1), (2,3), (3,2), find the least-squares slope with an intercept.',
        ],
        '1/2',
        [
          'Sxy/Sxx=1/2；有x变异才能唯一识别斜率。',
          'Sxy/Sxx=1/2; variation in x identifies the slope.',
        ],
        ['1', '2', '0'],
      ),
      N(
        [
          '同三对数据最小二乘截距a是多少？',
          'Find the fitted intercept a for the same three pairs.',
        ],
        '1',
        ['a=ȳ−bx̄=2−(1/2)·2=1。', 'a=ȳ−bx̄=2−(1/2)·2=1.'],
        ['0', '2', '1/2'],
      ),
      N(
        [
          '同三对数据用候选线ŷ=x，残差平方和是多少？',
          'For the same pairs, find SSE for candidate ŷ=x.',
        ],
        '2',
        [
          '残差0、1、−1，平方和0+1+1=2。',
          'Residuals 0,1,−1 give squared sum two.',
        ],
        ['0', '1', '4'],
      ),
      N(
        [
          '同三对数据用最小二乘线ŷ=1+x/2，求最小SSE。',
          'For the same pairs, find minimum SSE using ŷ=1+x/2.',
        ],
        '3/2',
        [
          '残差−1/2、1、−1/2，平方和1/4+1+1/4=3/2。',
          'Residuals −1/2,1,−1/2 give SSE=1/4+1+1/4=3/2.',
        ],
        ['0', '2', '1/2'],
      ),
      C(
        [
          '所有x都为2，y为1、3、2。含截距拟合的斜率是否唯一？用not-identified表示不能唯一识别。',
          'All x values are two and y values are 1,3,2. Is the slope with an intercept uniquely identified? Enter not-identified if not.',
        ],
        'not-identified',
        [
          '只确定a+2b=2，任意满足的(a,b)给同样预测；不是强制b=0。',
          'Only a+2b=2 is identified; every satisfying pair gives the same predictions, rather than forcing b=0.',
        ],
        ['0', 'undefined', '1'],
      ),
      E(
        [
          '比较候选ŷ=x、ŷ=2与最小二乘线。解释为什么有限候选比较不能独自证明全局最优，并给非负平方恒等式。',
          'Compare ŷ=x, ŷ=2 and the fitted line. Explain why a finite candidate search alone does not prove global optimality, and give the nonnegative-square identity.',
        ],
        [
          '两候选SSE都2，最小二乘ŷ=1+x/2的SSE=3/2。对任意a,b，有SSE=3/2+3(a+2b−2)²+2(b−1/2)²，因此所有差额非负，且同时为0唯一要求b=1/2、a=1。这是整个实参数空间的证明；抽几个下拉选项只能发现线索。竖直残差不是到直线的最短距离；结论以含截距模型且x有变异为前提。',
          'Both candidates have SSE two, while ŷ=1+x/2 has SSE=3/2. For every a,b, SSE=3/2+3(a+2b−2)²+2(b−1/2)². Both extra terms are nonnegative and vanish together only at b=1/2, a=1. This proves global optimality, whereas a finite dropdown search merely supplies evidence. Residuals are vertical rather than shortest distances, and uniqueness requires an intercept model with x variation.',
        ],
      ),
    ],
    pick: {
      stem: [
        '本课最小二乘法最小化哪个量？',
        'What does least squares minimise here?',
      ],
      options: [
        ['残差代数和', 'The signed sum of residuals'],
        [
          '同一x处竖直残差的平方和',
          'The sum of squared vertical residuals at the same x',
        ],
        ['到线的最短距离总和', 'The sum of shortest distances to the line'],
      ],
      feedback: [
        ['不同误差可以抵消。', 'Opposite errors can cancel.'],
        [
          '平方保留误差大小，防止正负抵消。',
          'Squares retain error magnitude without sign cancellation.',
        ],
        ['这是不同的拟合目标。', 'That is a different fitting objective.'],
      ],
      correct: 1,
    },
    reason: [
      '候选ŷ=2对三对数据残差和0，为什么仍不是最小二乘线？',
      'For the three pairs, candidate ŷ=2 has residual sum zero. Why is it still not the least-squares line?',
    ],
    rubric: [
      '其残差−1、1、0相加0，但平方和2。ŷ=1+x/2给平方和3/2更小；故只过均值点或只让残差和0不足以最优。含截距OLS还满足Σx e=0，平方差恒等式核全部候选；不把“平均误差零”误称“所有误差零”。',
      'Its residuals −1,1,0 sum to zero but have SSE two. The fitted line yields SSE=3/2, so passing through the mean point or zero residual sum alone is insufficient. Intercept OLS also satisfies Σx e=0, and the square-gap identity checks all candidates. Zero average residual is not zero error at every point.',
    ],
    prompts: [
      [
        '你是在相加残差还是残差平方？',
        'Are you adding residuals or their squares?',
      ],
      [
        '怎样排除下拉菜单之外更好的线？',
        'How can you rule out a better line outside the menu?',
      ],
    ],
    misconception: [
      '残差和0不等于SSE最小；有限搜索不证明全局最优。',
      'Zero residual sum is insufficient, and a finite search does not prove global optimality.',
    ],
  },
  {
    title: ['残差与模型检验', 'Residuals and model checking'],
    objective: [
      '计算有符号残差并结合残差图的形状检查线性模型的局限。',
      'Calculate signed residuals and use residual-plot patterns to inspect the limits of a linear model.',
    ],
    hook: [
      '一条残差平均为0的线，是否可能漏掉一整条曲线？',
      'Can a line with mean residual zero still miss an entire curved pattern?',
    ],
    prerequisites: ['H27-L02', 'H08-L02'],
    keywords: [
      ['观测减预测', 'observed minus predicted'],
      ['残差图', 'residual plot'],
      ['模型诊断', 'model checking'],
    ],
    lab: 'stats-residuals',
    hints: [
      [
        '残差e=y−ŷ，横坐标仍用原x；负残差表示观察点在预测线下方。',
        'Residual e=y−ŷ retains the original x coordinate. A negative residual places the observation below the predicted line.',
      ],
      [
        '看0线两侧、弯曲和随x变化的散布；平均为0是含截距OLS的代数性质，不是模型充分或因果的证明。',
        'Inspect signs around zero, curvature and spread changing with x. Mean zero is an algebraic property of intercept OLS, not proof of model adequacy or causation.',
      ],
    ],
    items: [
      N(
        [
          '观测(1,1)，预测线ŷ=1+x/2，求残差e。',
          'For observed (1,1) and fitted ŷ=1+x/2, find residual e.',
        ],
        '-1/2',
        [
          'e=1−3/2=−1/2，点在线下方。',
          'e=1−3/2=−1/2; the point is below the line.',
        ],
        ['1/2', '3/2', '1'],
      ),
      N(
        [
          '观测(1,1)、(2,3)、(3,2)，用ŷ=1+x/2，求残差代数和。',
          'For (1,1), (2,3), (3,2) and ŷ=1+x/2, find the signed residual sum.',
        ],
        '0',
        [
          '−1/2+1−1/2=0，不能据此说误差都0。',
          '−1/2+1−1/2=0 does not make every residual zero.',
        ],
        ['3/2', '1', '-1'],
      ),
      N(
        [
          '同一组三个残差−1/2、1、−1/2，求SSE。',
          'For residuals −1/2,1,−1/2, find SSE.',
        ],
        '3/2',
        ['逐个平方后相加：1/4+1+1/4。', 'Square each first: 1/4+1+1/4.'],
        ['0', '1', '2'],
      ),
      N(
        [
          'U形数据在x=3观测y=0，拟合水平线ŷ=2，该点残差？',
          'For the U-shaped data at x=3, observed y=0 and fitted ŷ=2. Find its residual.',
        ],
        '-2',
        [
          '0−2=−2；横坐标3没有改变。',
          '0−2=−2; its x coordinate remains three.',
        ],
        ['2', '0', '3'],
      ),
      N(
        [
          'U形数据的残差为2、−1、−2、−1、2，求SSE。',
          'For U-shaped residuals 2,−1,−2,−1,2, find SSE.',
        ],
        '14',
        [
          '4+1+4+1+4=14，残差和仍为0。',
          '4+1+4+1+4=14, despite signed sum zero.',
        ],
        ['0', '2', '10'],
      ),
      E(
        [
          '用U形配对(1,4)、(2,1)、(3,0)、(4,1)、(5,4)解释r=0、残差和0与模型遗漏曲线可以同时成立；再解释扇形残差提醒检查什么。',
          'Using the five U-shaped pairs, explain how r=0, zero residual sum and a missed curve can coexist. What should a fan-shaped residual plot prompt you to check?',
        ],
        [
          '均值(3,2)，Sxy=0使斜率0、截距2；残差2,−1,−2,−1,2和0但SSE14，两端正、中间负的系统弯曲说明直线遗漏形状。不能由平均残差0宣布线性充分，更不能推出独立或因果。随x扩大的扇形散布提醒检查误差变异是否恒定、量纲、分组或遗漏因素；有限小样本的图形只能提出诊断线索，不能自动证明某种误差分布。',
          'Means (3,2) and Sxy=0 give slope zero and intercept two. Residuals 2,−1,−2,−1,2 sum to zero but have SSE14; positive ends and negative middle reveal missed curvature. Zero mean residual does not validate linearity, independence or causation. A widening fan suggests checking changing error variation, units, subgroups or omitted factors. A small residual plot offers diagnostic evidence rather than automatically proving a particular error distribution.',
        ],
      ),
    ],
    pick: {
      stem: ['残差为−1/2意味着什么？', 'What does residual −1/2 mean?'],
      options: [
        [
          '观测比同x处预测低1/2',
          'Observed y is 1/2 below its prediction at the same x',
        ],
        ['观测横坐标少1/2', 'Observed x is 1/2 smaller'],
        [
          '误差大小不可能为负，所以无效',
          'The result is invalid because errors cannot be negative',
        ],
      ],
      feedback: [
        [
          '残差有方向，绝对残差才是非负大小。',
          'Residuals are signed; absolute residual is the nonnegative magnitude.',
        ],
        ['残差在y方向比较。', 'Residuals compare the y direction.'],
        [
          '符号记录在预测线上下。',
          'The sign records above or below the prediction.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '为何“r很大”或“残差图没有明显弯曲”仍不能单独证明预测可靠？',
      'Why does a large r or no obvious residual curvature fail to prove reliable predictions by itself?',
    ],
    rubric: [
      '还需查配对身份、样本设计、异常点与杠杆、误差散布和依赖、测量质量、适用范围及独立新数据表现。有限小样本无明显图案不等于误差独立、恒方差或正态已被证明；r描述线性程度而非因果和外推保证。须带条件报告预测，保留误差与不确定性。',
      'Also inspect pairing, sampling design, unusual or influential observations, error spread and dependence, measurement quality, domain and performance on independent new data. A small plot with no obvious pattern does not prove independence, constant variance or normality. Correlation is neither causation nor an extrapolation guarantee; report predictions conditionally with uncertainty.',
    ],
    prompts: [
      [
        '这个残差的正负对应图上哪一边？',
        'Which side of the prediction does this residual sign represent?',
      ],
      [
        '残差是否遗漏了系统形状或变化散布？',
        'Do residuals reveal systematic shape or changing spread?',
      ],
    ],
    misconception: [
      '残差均值0是拟合性质，不是模型正确的证明。',
      'Zero mean residual is a fitting property, not proof that the model is adequate.',
    ],
  },
  {
    title: ['模拟抽样变异', 'Simulating sampling variability'],
    objective: [
      '比较固定样本量下全部样本均值的精确分布与重复模拟，区分变异和偏差。',
      'Compare the exact distribution of sample means with repeated simulation at fixed sample size, separating variation from bias.',
    ],
    hook: [
      '同一总体抽两次会不同；多模拟一百次，能让每个样本更大吗？',
      'Two samples from one population can differ. Does repeating the simulation enlarge each sample?',
    ],
    prerequisites: ['H24-L03', 'H08-L03'],
    keywords: [
      ['抽样分布', 'sampling distribution'],
      ['样本量与重复数', 'sample size and repetitions'],
      ['偏差', 'bias'],
    ],
    lab: 'stats-sampling',
    hints: [
      [
        '总体成员A=0、B=0、C=4、D=4有四个不同身份；每次不放回抽n人，下一轮恢复整个总体。',
        'A=0, B=0, C=4, D=4 are four distinct identities. Draw n without replacement within each sample, restoring the population between repetitions.',
      ],
      [
        '简单随机抽样中各n元子集等可能；枚举均值及次数求分布。重复数不是n，便利抽样的偏差也不等于一次误差。',
        'Under simple random sampling each n-member subset is equally likely. Enumerate means and multiplicities. Repetition count is not n; design bias differs from one sample error.',
      ],
    ],
    items: [
      N(
        [
          '从A=0、B=0、C=4、D=4简单随机不放回抽2人，共多少种不同样本？',
          'How many distinct simple random samples of two without replacement exist from A=0, B=0, C=4, D=4?',
        ],
        '6',
        [
          '按身份组合C(4,2)=6，即AB、AC、AD、BC、BD、CD。',
          'Choose identities: C(4,2)=6, namely AB,AC,AD,BC,BD,CD.',
        ],
        ['3', '4', '12'],
      ),
      N(
        [
          '上述6个等可能样本中，样本均值等于2的概率？',
          'Among those six equally likely samples, what is the probability that the mean is two?',
        ],
        '2/3',
        [
          'AC、AD、BC、BD四种，4/6=2/3。',
          'AC,AD,BC,BD give four of six, or 2/3.',
        ],
        ['1/3', '1/2', '1'],
      ),
      N(
        [
          '上述简单随机抽2人的样本均值分布的期望是多少？',
          'What is the expected sample mean under that simple random design with n=2?',
        ],
        '2',
        [
          '六均值0,2,2,2,2,4，平均12/6=2。',
          'The six means 0,2,2,2,2,4 average to 12/6=2.',
        ],
        ['0', '4', '12'],
      ),
      N(
        [
          '上述样本均值分布的方差是多少？按6个等可能样本计算。',
          'Find the variance of that sample-mean distribution across six equally likely samples.',
        ],
        '4/3',
        [
          '关于2的平方偏差4,0,0,0,0,4，除6得4/3。',
          'Squared deviations from two are 4,0,0,0,0,4; divide by six to obtain 4/3.',
        ],
        ['4', '2', '8/5'],
      ),
      N(
        [
          '每次抽齐4个人（n=4），样本均值的抽样方差是多少？',
          'If every sample includes all four people (n=4), what is the sampling variance of the mean?',
        ],
        '0',
        [
          '只有完整总体一个子集，均值恒2，抽样方差0。',
          'There is one full-population subset; its mean is always two, so sampling variance is zero.',
        ],
        ['2', '4', 'undefined'],
      ),
      E(
        [
          '列出n=2的全部样本与均值，解释期望和方差；再比较改变n、改变重复次数与永远只选A、B的便利设计。',
          'List all n=2 samples and means and explain their expectation and variance. Compare changing n, changing repetitions and a convenience design that always selects A,B.',
        ],
        [
          'AB0、AC2、AD2、BC2、BD2、CD4等可能，期望2、方差4/3。n=1方差4，n=4方差0，说明此有限总体不放回设计下n改变分布；重复次数只改变经验频率精度，不改变固定n的理论分布，也不保证每次更接近。固定选AB得到均值0、方差0但偏差−2，低变异不代表好估计。每轮恢复总体，种子固定可重现模拟；精确枚举才支持这些概率，不把有限模拟当证明。',
          'AB has mean0; AC,AD,BC,BD have mean2; CD has mean4, all equally likely. Expectation is two and variance4/3. In this finite population without replacement, n=1 gives variance4 and n=4 gives zero; changing n changes the distribution. More repetitions change empirical approximation, not the theoretical distribution at fixed n, and need not improve every realised run. Always selecting AB gives mean0 and variance0 but bias−2, so low variation need not mean a good estimate. Restore the population each round; seeds make simulation reproducible, while enumeration establishes exact probabilities.',
        ],
      ),
    ],
    pick: {
      stem: [
        '固定n=2，把重复次数从12增到192，会怎样？',
        'With n=2 fixed, what does increasing repetitions from 12 to 192 do?',
      ],
      options: [
        ['把每个样本变成192人', 'It enlarges each sample to 192 people'],
        [
          '改变经验频率，不改理论抽样分布',
          'It changes empirical frequencies, not the theoretical sampling distribution',
        ],
        [
          '保证每次模拟都更接近总体均值',
          'It guarantees every realised simulation is closer to the population mean',
        ],
      ],
      feedback: [
        ['n仍是2。', 'The sample size remains two.'],
        [
          '更多轮次帮助观察固定分布，但不是逐次保证。',
          'More repetitions help observe a fixed distribution without a run-by-run guarantee.',
        ],
        ['有限模拟仍有随机波动。', 'Finite simulations still fluctuate.'],
      ],
      correct: 1,
    },
    reason: [
      '固定选A、B的均值总是0，为什么方差0不能证明这个估计好？',
      'Always selecting A,B gives mean zero every time. Why does zero variance not make this a good estimate?',
    ],
    rubric: [
      '目标总体均值2，而此设计的估计期望0，偏差−2；重复任意多次仍错在相同方向。方差描述围绕自身期望的散布，不衡量它与目标的距离。要检查选择机制与覆盖；增加便利样本量不一般保证去偏（抽齐总体的普查是明确例外），不能只增加重复轮数。',
      'The population mean is two, while this design’s expected estimate is zero, giving bias−2. Repetition preserves the same directional error. Variance measures spread around an estimator’s own expectation, not distance from the target. Inspect selection and coverage; increasing a convenience sample does not generally remove bias, with a complete census as an explicit exception. More repetitions alone do not repair the design.',
    ],
    prompts: [
      [
        '你改的是每轮人数n还是重复轮数？',
        'Are you changing members per sample or repetitions?',
      ],
      [
        '精确分布与模拟频率分别来自哪里？',
        'Where do the exact distribution and simulated frequencies come from?',
      ],
    ],
    misconception: [
      '重复次数不等于样本量；低方差不等于无偏，模拟不是证明。',
      'Repetitions are not sample size; low variance does not imply lack of bias, and simulation is not proof.',
    ],
  },
  {
    title: ['数据结论的局限性', 'Limits of data conclusions'],
    objective: [
      '按观察对象、抽样/分配设计与未知资料，给结论加上可核验的范围和不确定性。',
      'Scope conclusions using observed units, sampling and assignment design, and missing information.',
    ],
    hook: [
      '200人中只有20人回应，15人选“是”，能说全体75%都选是吗？',
      'If only 20 of 200 respond and 15 say yes, may we say 75% of everyone says yes?',
    ],
    prerequisites: ['H27-L01', 'H27-L04', 'J88-L05'],
    keywords: [
      ['抽样与随机分配', 'sampling and random assignment'],
      ['未知资料', 'missing information'],
      ['结论范围', 'scope of conclusion'],
    ],
    lab: 'stats-limits',
    hints: [
      [
        '先写分母对应谁；回应者比例不是自动的总体比例，随机抽样与随机分配回答不同问题。',
        'Identify whom the denominator represents. A respondent proportion is not automatically the population proportion; random sampling and random assignment serve different purposes.',
      ],
      [
        '已知N人中n人有明确是/否、其中y人是，其余未知：总体是比例在y/N与(y+N−n)/N之间。这是逻辑界，不是置信区间。',
        'If n distinct members of N have known binary outcomes, y yes and the rest unknown, the population yes proportion lies between y/N and (y+N−n)/N. These are logical bounds, not a confidence interval.',
      ],
    ],
    items: [
      N(
        [
          '虚构200名成员中20名不同成员回应，其中15人是。回应者中“是”的比例？',
          'Among 200 fictional members, 20 distinct members respond and 15 say yes. What proportion of respondents says yes?',
        ],
        '3/4',
        [
          '15/20=3/4，分母只是回应者20。',
          '15/20=3/4; the denominator is the twenty respondents.',
        ],
        ['3/40', '39/40', '15/200'],
      ),
      N(
        [
          '其余180人是/否均未知。全体200人“是”比例的最小可能值？',
          'The remaining 180 binary outcomes are unknown. What is the minimum possible yes proportion among all 200?',
        ],
        '3/40',
        [
          '未知者全否给15/200=3/40。',
          'If all unknowns are no, the proportion is 15/200=3/40.',
        ],
        ['3/4', '0', '1/40'],
      ),
      N(
        [
          '同一资料全体200人“是”比例的最大可能值？',
          'For the same information, what is the maximum possible population yes proportion?',
        ],
        '39/40',
        [
          '未知者全是给(15+180)/200=195/200=39/40。',
          'If all unknowns are yes, (15+180)/200=39/40.',
        ],
        ['3/4', '1', '37/40'],
      ),
      N(
        [
          '200人中只有20人已知明确是/否，未知人数是多少？',
          'Of 200 members, twenty have known binary outcomes. How many remain unknown?',
        ],
        '180',
        [
          '200−20=180，未回应不能直接记作“否”。',
          '200−20=180; nonresponse is not automatically no.',
        ],
        ['185', '5', '20'],
      ),
      C(
        [
          '某拟合数据只覆盖x∈[1,5]，用线预测x=6属于内插还是外推？',
          'A fit uses observations only over x∈[1,5]. Is predicting at x=6 interpolation or extrapolation?',
        ],
        'extrapolation',
        [
          '6不在观测范围[1,5]内，算得出不代表模型可靠。',
          'Six lies beyond [1,5]; algebraic evaluability does not establish reliability.',
        ],
        ['interpolation', 'undefined', '0'],
      ),
      E(
        [
          '为200人、20回应、15是写一份有限结论：报告观察比例、总体逻辑界及未知；区分随机抽样与志愿者随机分组实验，说明能支持什么。',
          'Write a scoped report for 200 members, twenty responses and fifteen yes: state the observed proportion, logical population bounds and unknowns. Distinguish random sampling from random assignment of volunteers and the conclusions each supports.',
        ],
        [
          '已观察20人中15是，即75%；180人的固定二元结果未知，总体比例只被逻辑限制在15/200到195/200，非置信区间。便利/自愿回应不自动代表200人，不能把未回应记否。恰当随机抽样且回应完整可支持带抽样不确定性的总体估计，但样本比例不等于真值。对志愿者随机分配处理，在依从、无干扰和可靠测量等条件下支持参与者的处理效果比较，不自动推广全体；仅观察相关不推出因果。注明观测x范围，范围外预测另需依据。',
          'Among twenty observed members, fifteen say yes, or75%. With180 unknown fixed binary outcomes, the population proportion is logically between15/200 and195/200; this is not a confidence interval. Convenience or voluntary response does not automatically represent all200, and nonresponse is not no. Proper random sampling with complete response can support population estimation with sampling uncertainty, but does not equate the sample proportion to truth. Random assignment among volunteers can support treatment-effect comparisons for participants under conditions such as adherence, no interference and reliable measurement, without automatic population generalisation. Observational correlation alone is not causation; report the observed x range and justify any extrapolation separately.',
        ],
      ),
    ],
    pick: {
      stem: [
        '志愿者被随机分到两个处理组，最恰当的设计解读是？',
        'Volunteers are randomly assigned to two treatment groups. Which interpretation best matches the design?',
      ],
      options: [
        ['因此他们自动代表所有人', 'They automatically represent everyone'],
        [
          '在适当条件下支持参与者处理效果比较，但推广另需依据',
          'Under appropriate conditions it supports treatment comparisons for participants; generalisation needs separate support',
        ],
        [
          '必然每个个体都有完全相同效果',
          'Every individual must have the identical effect',
        ],
      ],
      feedback: [
        [
          '随机分配不等于随机抽样。',
          'Random assignment differs from random sampling.',
        ],
        [
          '分别核因果比较与推广范围。',
          'Audit causal comparison and scope of generalisation separately.',
        ],
        [
          '平均处理效果不等于每人相同效果。',
          'An average treatment effect does not imply identical individual effects.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '为何一个大样本的高r、很小SSE或很多模拟轮次仍不能单独消除结论局限？',
      'Why can a large sample, high r, small SSE or many simulations fail to remove a conclusion’s limitations?',
    ],
    rubric: [
      '这些指标分别描述线性程度、训练拟合误差或模拟精度，不能自动修复选择偏差、未回应、配对错误、混杂、测量问题、误差依赖或范围外机制。应明确总体和观察对象，核查抽样/随机分配、未知资料及适用范围，保留不确定性，用独立新数据检查预测，不把数值漂亮当成因果与普遍规律的证明。',
      'These numbers describe linear strength, training fit or simulation precision; they do not automatically repair selection bias, nonresponse, pairing errors, confounding, measurement problems, dependence or changed mechanisms outside the observed range. State target and observed units, audit sampling and assignment, missing information and scope, retain uncertainty and test predictions on independent new data. Attractive numbers do not prove causation or a universal rule.',
    ],
    prompts: [
      [
        '这个分母和结论究竟覆盖谁？',
        'Whom do this denominator and conclusion cover?',
      ],
      [
        '哪些未知和设计限制尚未解决？',
        'Which unknowns and design limitations remain?',
      ],
    ],
    misconception: [
      '样本比例不是总体真值；随机抽样不等于随机分配，逻辑界不等于置信区间。',
      'A sample proportion is not population truth; sampling differs from assignment, and logical bounds differ from confidence intervals.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `statistics-${i + 1}`;
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
    `statistics-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h27Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H27-L0${i + 1}`;
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
    unit: 'H27',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`statistics-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `statistics-${i + 1}`,
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
export function h27ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H27-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H27 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0) {
    const sign = k % 2 === 0 ? 1 : -1,
      ys = [1, 3, 2].map((v) => a + sign * b * v);
    item = N(
      [
        `配对(${a + 1},${ys[0]})、(${a + 2},${ys[1]})、(${a + 3},${ys[2]})，求r。`,
        `For pairs (${a + 1},${ys[0]}), (${a + 2},${ys[1]}), (${a + 3},${ys[2]}), find r.`,
      ],
      sign > 0 ? '1/2' : '-1/2',
      [
        '中心化后平移消失，正比例缩放约去，负比例只反号。',
        'Centring removes shifts; positive scale cancels and negative scale reverses the sign.',
      ],
      ['999'],
    );
  } else if (i === 1) {
    const ys = [1, 3, 2].map((v) => b * v + a);
    item = N(
      [
        `对(1,${ys[0]})、(2,${ys[1]})、(3,${ys[2]})，求含截距OLS斜率。`,
        `For (1,${ys[0]}), (2,${ys[1]}), (3,${ys[2]}), find the intercept-OLS slope.`,
      ],
      `${b}/2`,
      [
        'Sxy随y缩放为b，Sxx仍2，平移不改斜率。',
        'Y scaling multiplies Sxy by b while Sxx remains two; the shift leaves slope unchanged.',
      ],
      ['999'],
    );
  } else if (i === 2) {
    const residual = (k % 2 === 0 ? -1 : 1) * b,
      observed = a + b * a + residual;
    item = N(
      [
        `预测线ŷ=${a}+${b}x，观测(${a},${observed})。求有符号残差。`,
        `For predicted ŷ=${a}+${b}x and observation (${a},${observed}), find the signed residual.`,
      ],
      String(residual),
      [
        '同一x处计算观测减预测。',
        'Subtract prediction from observation at the same x.',
      ],
      ['999'],
    );
  } else if (i === 3) {
    const n = k % 2 === 0 ? 1 : 2;
    item = N(
      [
        `总体四个不同成员值为${a},${a},${a + 2 * b},${a + 2 * b}；简单随机不放回抽n=${n}，求样本均值分布方差。`,
        `Four distinct population members have values ${a},${a},${a + 2 * b},${a + 2 * b}. Draw n=${n} by simple random sampling without replacement. Find the variance of the sample mean.`,
      ],
      n === 1 ? String(b * b) : `${b * b}/3`,
      [
        'n=1的四个均值围绕中心相差±b；n=2的六均值仅两端偏离±b，均方分别b²或b²/3。',
        'For n=1, four means deviate by ±b. For n=2, only two of six means deviate by ±b, giving b² or b²/3.',
      ],
      ['999'],
    );
  } else {
    const population = 40 + 10 * a,
      n = 10 + b,
      yes = 2 * b,
      lower = k % 2 === 0;
    item = N(
      [
        `已知总体${population}名不同成员中${n}人明确是/否，其中${yes}人是，其余未知。总体是比例的${lower ? '最小' : '最大'}可能值？`,
        `Of ${population} distinct members, ${n} binary outcomes are known and ${yes} are yes; all others are unknown. Find the ${lower ? 'minimum' : 'maximum'} possible population yes proportion.`,
      ],
      textR(
        rational(
          BigInt(lower ? yes : yes + population - n),
          BigInt(population),
        ),
      ),
      [
        '把未知者全部设否或全部设是，按总体人数作分母；这是逻辑界，不是置信区间。',
        'Set unknowns all no or all yes and divide by population size. These are logical bounds, not a confidence interval.',
      ],
      ['999'],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h27CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H27-CHECK-Q${i + 1}`, i, s.items[0]!)),
  pick('H27-CHECK-Q6', 4),
  question('H27-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H27-CHECK-Q8', 4, specs[4]!.items[5]!),
];
