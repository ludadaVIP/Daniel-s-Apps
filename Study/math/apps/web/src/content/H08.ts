import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { textR } from '../algebraModels';
import {
  dataSummary,
  transformData,
  shapeCases,
  regressionCases,
  leastSquares,
  regressionPrediction,
  zScore,
  type DataCode,
} from '../dataModellingModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const N = (stem: Pair, value: string, step: Pair, wrong: string[]): Item => ({
  stem,
  answer: { kind: 'number', value },
  step,
  wrong,
});
const C = (stem: Pair, value: DataCode, step: Pair, wrong: string[]): Item => ({
  stem,
  answer: { kind: 'data-code', value },
  step,
  wrong,
});
const R = (stem: Pair, value: string, step: Pair, wrong: string[]): Item => ({
  stem,
  answer: { kind: 'radical', value },
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
  lab: Lesson['lab'];
  skill: string;
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
    title: ['变量类型与数据清理', 'Variable types and data cleaning'],
    objective: [
      '按变量意义分类，用身份、单位和来源核对建立可追溯的分析数据。',
      'Classify variables by meaning and build traceable analysis data using identities, units and source checks.',
    ],
    hook: [
      '20 cm与200 mm是否不同长度？同ID导入两次和两个人刚好同值有什么区别？',
      'Do 20 cm and 200 mm differ? How does importing one ID twice differ from two people sharing a value?',
    ],
    prerequisites: ['J88-L05', 'P57-L01', 'P56-L01'],
    keywords: [
      ['变量类型', 'variable type'],
      ['缺失', 'missing value'],
      ['审计轨迹', 'audit trail'],
    ],
    lab: 'data-cleaning',
    skill: 'data-type-identity-source',
    hints: [
      [
        '先说明一行代表谁、每列测什么；类别编码不是数量，测量取整不改变原变量。',
        'State what each row represents and each column measures. Category codes are not quantities; rounding does not change the underlying variable.',
      ],
      [
        '统一单位、按ID查重复、按字段处理缺失/无效，改值必须有来源并保留原值。',
        'Standardize units, check duplicate IDs and handle missing/invalid fields. Corrections require a source and retain the original.',
      ],
    ],
    items: [
      N(
        ['将长度200 mm统一为cm，填多少？', 'Convert a length of 200 mm to cm.'],
        '20',
        [
          '10 mm=1 cm，所以200÷10=20 cm；先统一再比较。',
          'Since 10 mm=1 cm, 200÷10=20 cm. Convert before comparing.',
        ],
        ['200', '2000'],
      ),
      C(
        [
          '变量“某盒中的纸卡件数”，包括真实的0件，属于nominal、ordinal、discrete还是continuous？',
          'Classify the number of cards in a box, including a genuine count of zero: nominal, ordinal, discrete or continuous.',
        ],
        'discrete',
        [
          '计数只能取非负整数；0件是有效观测，不是缺失。',
          'A count takes nonnegative whole numbers. Zero is an observation, not missing.',
        ],
        ['continuous', 'nominal'],
      ),
      N(
        [
          '7行记录的ID为R1,R2,R3,R4,R5,R6,R2，末行确认同一次记录重复导入。不同记录有几个？',
          'Seven row IDs are R1,R2,R3,R4,R5,R6,R2; the last is confirmed as a repeated import. How many distinct records?',
        ],
        '6',
        [
          '仅合并重复身份R2一次；不同ID同值仍保留。',
          'Merge only the duplicated identity R2; keep equal values from distinct IDs.',
        ],
        ['7', '5'],
      ),
      N(
        [
          '六个不同记录统一后的长度为20,20,缺失,−5,20,24 cm；负长度无效待核，不补值。长度均值的分母是多少？',
          'Six distinct records have lengths 20,20,missing,−5,20,24 cm. Negative length is invalid and no values are imputed. What denominator is used for the length mean?',
        ],
        '4',
        [
          '保留四个有效长度，排除缺失和待核负值；分母不是总人数六。',
          'Use the four usable lengths, rather than all six records, as the denominator.',
        ],
        ['6', '5'],
      ),
      N(
        [
          '已按来源把200 cm改为20 cm，并统一单位、合并重复ID，留下20,20,20,24 cm。求长度均值，填数值。',
          'After a source-confirmed correction of 200 cm to 20 cm, unit conversion and duplicate-ID merging, lengths are 20,20,20,24 cm. Give the numerical mean.',
        ],
        '21',
        [
          '总和84 cm，4个有效长度，84/4=21 cm；同值三次均保留。',
          'The total is 84 cm across four usable lengths, giving 21 cm. All three distinct observations of 20 remain.',
        ],
        ['14', '28', '66'],
      ),
      E(
        [
          '六个不同ID的原长度为20 cm、200 mm、缺失、−5 cm、200 cm（来源确认为20 cm）、24 cm，另有第二个ID的同次记录重复导入。说明从原表到长度均值的可追溯步骤；真实0件数另列。',
          'Six distinct IDs have raw lengths 20 cm,200 mm,missing,−5 cm,200 cm confirmed by the supplied source as 20 cm,and 24 cm. An additional import repeats the second ID from the same occasion. Explain a traceable route to a length mean, keeping a genuine count of zero as a separate field.',
        ],
        [
          '保留原值、ID、单位与来源；200 mm转20 cm，来源确认后200 cm改20 cm，记录理由。仅合并确认重复ID，不删不同个体的同值；长度缺失不填0，负长度待核并从长度分母排除，不删掉同记录有效件数。按本题四个有效长度求84/4=21 cm，报告n=4及排除理由，0件仍有效。',
          'Retain originals, IDs, units and sources. Convert 200 mm to 20 cm; apply the source-confirmed 200-to-20 cm correction with a reason. Merge only the confirmed repeated ID, retaining equal values from different individuals. Do not replace missing length with zero; exclude the invalid length from this field while retaining valid counts. Report four usable lengths, mean 84/4=21 cm, and exclusions. A genuine count of zero remains valid.',
        ],
      ),
    ],
    pick: {
      stem: [
        '长度按最接近的整cm记录。原变量应怎样分类？',
        'Lengths are recorded to the nearest whole cm. How is the underlying variable classified?',
      ],
      options: [
        [
          '离散，因为表中只有整数',
          'Discrete because entries are whole numbers',
        ],
        [
          '连续，记录精度不改变测量性质',
          'Continuous; recording precision does not change measurement type',
        ],
        ['名义，因为cm是标签', 'Nominal because cm is a label'],
      ],
      feedback: [
        [
          '记录格式不等于变量允许的真实取值，长度仍可有中间值。',
          'Recorded precision differs from the underlying possible measurements.',
        ],
        [
          '长度为连续测量；需另记录精度和单位。',
          'Length is continuous; retain precision and units separately.',
        ],
        [
          'cm是单位，长度不是无序类别。',
          'cm is a unit, not an unordered category.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '把蓝、绿、红编码为1、2、3，平均“颜色代码2”能解释为平均颜色吗？',
      'If blue,green,red are coded 1,2,3, does a mean code of two describe an average colour?',
    ],
    rubric: [
      '不能。代码只是无序类别的标签，换成10、20、90不改变颜色却改变均值。应按颜色统计频数/比例，不把任意标签的算术当颜色量。',
      'No. These are nominal labels; recoding as 10,20,90 changes the mean without changing colours. Use category counts or proportions instead of treating arbitrary codes as quantities.',
    ],
    prompts: [
      [
        '这一行是谁？相同值是否就代表重复身份？',
        'Whose record is this? Do equal values imply the same identity?',
      ],
      [
        '这个0确实量到了吗，还是原本没有记录？',
        'Was zero observed, or was nothing recorded?',
      ],
    ],
    misconception: [
      '按同值删重复、把缺失填0、为了图好看删异常值。',
      'Deleting equal values as duplicates, filling missing values with zero or removing unusual observations for appearance.',
    ],
  },
  {
    title: ['分布的形状和偏态', 'Shape and skewness'],
    objective: [
      '用原始点、镜像与尾部描述分布，检验分组和单个统计量的局限。',
      'Describe distributions using individual observations, reflection and tails, recognizing limits of binning and single summaries.',
    ],
    hook: [
      '大多数值挤在左侧时，为什么仍可能叫右偏？组距变大能证明数据变对称吗？',
      'Why can a distribution crowded on the left be called right-skewed? Can wider bins prove symmetry?',
    ],
    prerequisites: ['J88-L01', 'J88-L02', 'H08-L01'],
    keywords: [
      ['尾部', 'tail'],
      ['偏态', 'skewness'],
      ['组距', 'bin width'],
    ],
    lab: 'data-shape',
    skill: 'data-shape-tail-evidence',
    hints: [
      [
        '先画全部点并保留重复，观察数值较少却延伸较远的一侧；偏态按尾部命名。',
        'Keep every observation and inspect the less crowded, extended tail. Skew is named for the tail.',
      ],
      [
        '改变组距不改变原数据；均值、中位数相等或一个柱形外观都不能证明对称/正态。',
        'Binning does not change raw data. Equal mean/median or a single histogram does not establish symmetry or normality.',
      ],
    ],
    items: [
      N(
        ['对0,1,1,1,2,3,13，求均值。', 'Find the mean of 0,1,1,1,2,3,13.'],
        '3',
        [
          '总和21，7个观测，均值3；三个1都计入。',
          'The total is 21 across seven observations, giving mean three; retain all three ones.',
        ],
        ['1', '7/3'],
      ),
      C(
        [
          '0,1,1,1,2,3,13的大多数点较小，长尾伸向13。写right-skew或left-skew。',
          'For 0,1,1,1,2,3,13, most values are small and the long tail extends toward 13. Enter right-skew or left-skew.',
        ],
        'right-skew',
        [
          '长尾向较大值延伸，叫右偏，不按人最多的一侧命名。',
          'The extended upper-value tail makes this right-skewed, regardless of the crowded side.',
        ],
        ['left-skew', 'symmetric'],
      ),
      N(
        ['求0,1,1,1,2,3,13的中位数。', 'Find the median of 0,1,1,1,2,3,13.'],
        '1',
        [
          '七项排序后第4项为1；不是最大最小平均。',
          'The fourth of seven ordered observations is one, not the midrange.',
        ],
        ['3', '6.5'],
      ),
      N(
        [
          '求镜像数据1,11,12,13,13,13,14的均值。',
          'Find the mean of the reflected data 1,11,12,13,13,13,14.',
        ],
        '11',
        [
          '和77除7为11；这组由原数据x映为14−x，均值14−3=11。',
          'The total 77 gives mean 11. Reflection x↦14−x also gives mean 14−3=11.',
        ],
        ['13', '3'],
      ),
      C(
        [
          '0,0,0,4,4,4关于2镜像一致，有两个峰。写symmetric或asymmetric。',
          'The data 0,0,0,4,4,4 mirror exactly about two and have two peaks. Enter symmetric or asymmetric.',
        ],
        'symmetric',
        [
          '两侧三个点对应，故对称；两个峰说明对称不必钟形。',
          'Three pairs reflect across two, so the data are symmetric. Two peaks show symmetry need not be bell-shaped.',
        ],
        ['asymmetric', 'right-skew'],
      ),
      E(
        [
          '对0,0,2,3,5核对均值、中位数和镜像，判断“均值等于中位数，所以对称”是否成立。',
          'For 0,0,2,3,5, check mean,median and reflected observations. Assess the claim that equal mean and median prove symmetry.',
        ],
        [
          '总和10除5得均值2，中位数也是2；若关于2对称，每个0须对应4，但没有4，而5的镜像−1也不存在。所以不对称。均值/中位数仅为摘要，不能代替整组形状证据。',
          'The mean is 10/5=2 and median two. Symmetry about two would pair each zero with four, which is absent; five would reflect to −1, also absent. Thus the data are asymmetric despite equal summaries. Inspect the full distribution.',
        ],
      ),
    ],
    pick: {
      stem: [
        '用同一数据画组距1和4的直方图，哪句话可靠？',
        'The same observations are drawn with histogram widths one and four. Which statement is justified?',
      ],
      options: [
        [
          '柱形外观可能改变，原观测和样本数不变',
          'The bars may look different; observations and sample size remain unchanged',
        ],
        [
          '组距越宽，数据本身越对称',
          'Wider bins make the underlying data more symmetric',
        ],
        [
          '对称直方图足以证明正态总体',
          'A symmetric histogram proves a normal population',
        ],
      ],
      feedback: [
        [
          '分组是表示选择；应回看原始点，并交代边界。',
          'Grouping changes the representation. Inspect raw observations and state boundaries.',
        ],
        [
          '表示更粗不等于原数据改变。',
          'Coarser presentation does not change observations.',
        ],
        [
          '对称可有两个峰，有限图不能证明总体分布。',
          'Symmetry can be bimodal; a finite display does not prove a population distribution.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '0,0,0,4,4,4是对称数据。能据此套用正态分布的68%规则吗？',
      'The data 0,0,0,4,4,4 are symmetric. Does this justify applying the normal 68% rule?',
    ],
    rubric: [
      '不能。它们有两个峰，与正态钟形不同；对称只是镜像性质，不是正态假设。本课不从z或对称性推断概率，若谈比例应直接数有限数据并给分母。',
      'No. The two peaks differ from a normal bell shape. Symmetry is a reflection property, not a normality assumption. Do not infer probabilities from symmetry or z alone; for this finite dataset, count observations with a stated denominator.',
    ],
    prompts: [
      [
        '尾巴指向哪里？你说的是尾部还是人数最多处？',
        'Which way does the tail extend: is that different from the crowded side?',
      ],
      [
        '换组距后，哪条原始记录真的改变了？',
        'Which original observation changed when the bin width changed?',
      ],
    ],
    misconception: [
      '按峰的位置叫偏态，把均值等中位数或对称当正态证明。',
      'Naming skew by the peak, or treating equal mean/median or symmetry as proof of normality.',
    ],
  },
  {
    title: ['标准差的意义', 'Meaning of standard deviation'],
    objective: [
      '从离均差平方解释标准差，并保持分母约定、单位与零波动边界。',
      'Explain standard deviation through squared deviations, retaining divisor conventions, units and zero-spread boundaries.',
    ],
    hook: [
      '1和3的离均差相加为0，为什么它们并非毫无波动？',
      'Deviations for one and three add to zero. Why does that not imply no spread?',
    ],
    prerequisites: ['P57-L02', 'J91-L03', 'H08-L02'],
    keywords: [
      ['离均差', 'deviation from the mean'],
      ['方差', 'variance'],
      ['标准差', 'standard deviation'],
    ],
    lab: 'data-spread',
    skill: 'data-squared-spread-convention',
    hints: [
      [
        '每项先减同一个均值，平方后相加，不能先把带符号离差相加。',
        'Subtract the same mean from each value, square, then sum; do not sum signed deviations first.',
      ],
      [
        '完整有限总体用n，样本方差估计用n−1；最后开非负根，标准差保留原单位。',
        'Use n for the entire finite population and n−1 for sample variance estimation. Take the nonnegative root; SD retains the original units.',
      ],
    ],
    items: [
      R(
        [
          '把2,4,4,6 cm当完整有限总体，求总体标准差，填精确数值根式。',
          'Treat 2,4,4,6 cm as the entire finite population. Give the exact numerical population SD.',
        ],
        'sqrt(2)',
        [
          '均值4，平方贡献4,0,0,4；方差8/4=2 cm²，标准差√2 cm。',
          'Mean four gives squared contributions 4,0,0,4; variance 8/4=2 cm² and SD √2 cm.',
        ],
        ['2', '0', '-sqrt(2)'],
      ),
      N(
        [
          '对2,4,4,6，均值4，求离均差平方和。',
          'For 2,4,4,6 with mean four, find the sum of squared deviations.',
        ],
        '8',
        [
          '(−2)²+0²+0²+2²=8，离差和0不是平方和。',
          '(−2)²+0²+0²+2²=8; the zero signed sum is different.',
        ],
        ['0', '2'],
      ),
      N(
        [
          '把2,4,4,6视为样本，用n−1约定求样本方差，非标准差。',
          'Treat 2,4,4,6 as a sample. Using divisor n−1, find the sample variance, not SD.',
        ],
        '8/3',
        [
          '平方和8，样本分母4−1=3，方差8/3。',
          'The squared sum is eight and divisor 4−1=3, giving variance 8/3.',
        ],
        ['2', 'sqrt(8/3)', '8/4'],
      ),
      R(
        [
          '完整总体2,4,4,6的每项都加10，求新总体标准差。',
          'Add ten to every value in the finite population 2,4,4,6. Find the new population SD.',
        ],
        'sqrt(2)',
        [
          '新均值14，每个离均差仍是−2,0,0,2，所以标准差不变。',
          'The new mean is 14; deviations remain −2,0,0,2, so SD is unchanged.',
        ],
        ['sqrt(2)+10', 'sqrt(12)'],
      ),
      C(
        [
          '只有一个观测4，用样本n−1约定能得到标准差0吗？若无定义写undefined。',
          'With only one observation, four, can the sample n−1 convention give SD zero? Enter undefined if it is undefined.',
        ],
        'undefined',
        [
          '分母n−1=0；不能用0/0估计。若另把它当完整单元素总体，总体标准差才为0。',
          'Here n−1=0: 0/0 is undefined. The distinct convention of an entire singleton population would give population SD zero.',
        ],
        ['0', '1'],
      ),
      E(
        [
          '完整有限总体4,4,4,4的标准差为何为0？反过来，完整有限总体标准差0为何推出全部观测相同？',
          'Why is population SD zero for 4,4,4,4? Conversely, why does zero population SD in a nonempty finite population imply all observations are equal?',
        ],
        [
          '均值4，每个离均差0，平方和/4=0，非负根0。反向：每个平方非负，平方和为0只能每个离均差平方都为0，因此每个值等于共同均值。不能把“离差和0”当同样证据，因为任何数据的带符号离差和都为0。',
          'Mean four gives four zero deviations, variance zero and nonnegative root zero. Conversely, a sum of nonnegative squared deviations is zero only when every squared deviation is zero, so each value equals the mean. A zero signed deviation sum would not suffice: it occurs for every dataset.',
        ],
      ),
    ],
    pick: {
      stem: [
        '长度用cm记录，方差与标准差的单位分别是什么？',
        'Lengths are in cm. What are the units of variance and SD respectively?',
      ],
      options: [
        ['方差cm，标准差cm²', 'Variance cm; SD cm²'],
        ['两者都无单位', 'Both are unitless'],
        ['方差cm²，标准差cm', 'Variance cm²; SD cm'],
      ],
      feedback: [
        [
          '平方产生cm²，开根才恢复cm，不能反过来。',
          'Squaring gives cm²; the root restores cm.',
        ],
        [
          '标准化的z才无单位，原数据离散量仍有单位。',
          'A standardized z is unitless; these spread summaries retain units.',
        ],
        [
          '方差平方单位，标准差回到原测量单位。',
          'Variance has squared units; SD returns to measurement units.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '有人说“离均差−2,0,0,2相加为0，所以标准差0”。找出错误，并解释同乘−2后标准差怎样变。',
      'Someone adds deviations −2,0,0,2 to get zero and concludes SD is zero. Locate the error and explain what multiplying all values by −2 does to SD.',
    ],
    rubric: [
      '需先逐项平方，平方和8，不是0。乘−2后均值也乘−2，离差乘−2，平方贡献乘4，标准差乘|−2|=2且保持非负；符号反射不使标准差为负。',
      'Square each deviation first, giving squared sum eight. Multiplication by −2 also multiplies the mean and deviations by −2, squared contributions by four, and SD by |−2|=2. Reflection does not make SD negative.',
    ],
    prompts: [
      [
        '你开根之前求到的是平方和还是方差？',
        'Before taking the root, did you find a squared sum or a variance?',
      ],
      [
        '同加10和同乘2，哪一步改变离均差的长度？',
        'How do adding ten and multiplying by two affect deviation lengths differently?',
      ],
    ],
    misconception: [
      '先求离差和、混用n与n−1、标准差忘记开根或带负号。',
      'Summing signed deviations, mixing n and n−1, or omitting the root or assigning a negative SD.',
    ],
  },
  {
    title: ['标准分数与比较', 'Z-scores and comparisons'],
    objective: [
      '用明确参照均值与标准差解释带符号z，不把相对位置当概率或价值判断。',
      'Interpret signed z-scores using stated reference means and SDs, without inventing probabilities or value judgments.',
    ],
    hook: [
      'A得70，B得85。若A均值50、标准差10，B均值80、标准差5，谁离各自均值更高？',
      'A is 70 and B is 85. With reference means/SDs 50/10 and 80/5, which is farther above its own mean?',
    ],
    prerequisites: ['H08-L03', 'J71-L04', 'P63-L04'],
    keywords: [
      ['参照分布', 'reference distribution'],
      ['标准分数', 'z-score'],
      ['无量纲', 'unitless'],
    ],
    lab: 'data-standard',
    skill: 'data-z-reference-boundary',
    hints: [
      [
        'z=(x−μ)/σ，先说明参照，先减后除，σ必须正。',
        'Use z=(x−μ)/σ with a stated reference: subtract, then divide, with positive σ.',
      ],
      [
        'z为正/负表示高/低于参照均值；没有分布假设就没有自动百分位，也没有“更好”。',
        'Positive/negative z means above/below the reference mean. Without distribution assumptions it does not supply a percentile or define better.',
      ],
    ],
    items: [
      N(
        [
          '参照均值50、标准差10，观测70的z是多少？',
          'A reference has mean 50 and SD 10. Find z for an observation of 70.',
        ],
        '2',
        [
          '(70−50)/10=2，即高于参照均值两个标准差。',
          '(70−50)/10=2, two reference SDs above its mean.',
        ],
        ['7', '20', '-2'],
      ),
      N(
        [
          'B参照均值80、标准差5，观测85的z是多少？',
          'Reference B has mean 80 and SD five. Find z for 85.',
        ],
        '1',
        [
          '(85−80)/5=1，不把原分数85直接与70作相对位置比较。',
          '(85−80)/5=1; comparing raw 85 with 70 alone does not compare relative positions.',
        ],
        ['17', '5', '2'],
      ),
      N(
        [
          '参照均值80、标准差5，观测75的z是多少？',
          'With reference mean 80 and SD five, find z for 75.',
        ],
        '-1',
        [
          '(75−80)/5=−1，负号表示低于均值，不是负标准差。',
          '(75−80)/5=−1; the sign describes position, not a negative SD.',
        ],
        ['1', '-5'],
      ),
      N(
        [
          '同作正向单位变换x′=10x+100后，原x=70、μ=50、σ=10变为x′=800、μ′=600、σ′=100。新z是多少？',
          'Under the positive unit transformation x′=10x+100, x=70,μ=50,σ=10 become 800,600,100. Find the new z.',
        ],
        '2',
        [
          '(800−600)/100=2，平移抵消，正比例因子约去。',
          '(800−600)/100=2: shifts cancel and the positive scale factor cancels.',
        ],
        ['20', '8'],
      ),
      C(
        [
          '参照为80,80,80,80，标准差0；观测也为80。z应为0还是undefined？',
          'A reference is 80,80,80,80 with SD zero; the observation is also 80. Enter zero or undefined for z.',
        ],
        'undefined',
        [
          '(80−80)/0=0/0无定义，不能伪造平均位置的标准分数0。',
          '(80−80)/0 is undefined; do not invent z=0 for a reference with no spread.',
        ],
        ['0', '1'],
      ),
      E(
        [
          'A观测70、参照均值50/标准差10；B观测85、参照均值80/标准差5。比较相对位置，并解释能否由此说A更优秀或位于第97.5百分位。',
          'A is 70 with reference mean/SD 50/10; B is 85 with 80/5. Compare relative positions and assess claims that A is better or at the 97.5th percentile.',
        ],
        [
          'zA=2，zB=1，所以A在各自参照的标准差尺度上更高；B原数值更高不矛盾。没有指标好坏方向、可比情境和参照分布假设，不能推出谁更优秀；没有正态等分布信息，z=2不确定百分位或概率。',
          'zA=2 and zB=1, so A is higher relative to its own reference on an SD scale, despite B having the larger raw value. Better requires a meaningful direction and comparable context. Without a reference distribution such as a justified normal model, z=2 does not determine a percentile or probability.',
        ],
      ),
    ],
    pick: {
      stem: [
        '在σ>0的参照下，z=0意味着什么？',
        'For a reference with σ>0, what does z=0 mean?',
      ],
      options: [
        ['原观测一定是0', 'The original observation must be zero'],
        ['观测等于参照均值', 'The observation equals its reference mean'],
        ['参照没有波动', 'The reference has no spread'],
      ],
      feedback: [
        [
          '原观测等于μ，μ不必是0。',
          'The value equals μ, which need not be zero.',
        ],
        [
          '分子x−μ=0，且分母正，因此z=0。',
          'The numerator x−μ is zero and the denominator is positive.',
        ],
        ['σ=0反而使z无定义。', 'Zero spread instead makes z undefined.'],
      ],
      correct: 1,
    },
    reason: [
      '若把方向倒过来x′=−x，均值μ′=−μ、标准差σ′=σ>0，z是否仍完全不变？',
      'Reverse the measurement direction using x′=−x, μ′=−μ and σ′=σ>0. Does z remain unchanged?',
    ],
    rubric: [
      'z′=(−x+μ)/σ=−z。正向单位换算保持z，反向会翻转正负；标准差按绝对比例缩放仍为正。不能把所有线性变换都称z不变，也不能据符号自动判断优劣。',
      'z′=(−x+μ)/σ=−z. Positive unit conversion preserves z; reversing direction reverses its sign while SD scales by absolute magnitude. Do not claim invariance under every linear transformation or infer better from sign alone.',
    ],
    prompts: [
      [
        '你减去的是哪个参照均值？这个观测有加入重算参照吗？',
        'Which reference mean did you subtract, and was this observation added to recalculate it?',
      ],
      [
        '“高两个标准差”还缺什么，才能变成百分位？',
        'What else would you need to turn two SDs above the mean into a percentile?',
      ],
    ],
    misconception: [
      '比较原分数代替相对位置、把z当百分位或σ=0时强行给0。',
      'Comparing raw values instead of relative position, treating z as a percentile, or forcing zero when σ=0.',
    ],
  },
  {
    title: ['线性回归的直观理解', 'Intuition of linear regression'],
    objective: [
      '用成对数据的竖直残差平方和理解拟合线，明确外推与参数不可识别边界。',
      'Understand a fitted line through squared vertical residuals in paired data, with extrapolation and nonidentification boundaries.',
    ],
    hook: [
      '穿过最多点的线一定最好吗？向上和向下的误差能直接抵消吗？',
      'Must a line through the most points be best? Can positive and negative errors simply cancel?',
    ],
    prerequisites: ['J88-L03', 'J88-L04', 'H02-L02', 'H08-L03'],
    keywords: [
      ['拟合值', 'fitted value'],
      ['残差', 'residual'],
      ['最小二乘', 'least squares'],
    ],
    lab: 'data-regression',
    skill: 'data-paired-residual-model',
    hints: [
      [
        '每对(x,y)保留身份，在同一个x算ŷ，残差为y−ŷ的竖直差。',
        'Retain each pair identity, compute ŷ at that same x, and use vertical residual y−ŷ.',
      ],
      [
        '最小化残差平方和且保留截距；最优拟合不是每点都通过，也不保证外推或因果。',
        'Minimize squared residuals with an intercept. The optimum need not pass through every point, justify extrapolation or establish causation.',
      ],
    ],
    items: [
      N(
        [
          '对(1,3),(2,3),(3,6)作含截距最小二乘拟合。给x均值2、y均值4、Sxx=2、Sxy=3，求斜率b=Sxy/Sxx。',
          'Fit an intercept-containing least-squares line to (1,3),(2,3),(3,6). Given x mean two,y mean four,Sxx=2,Sxy=3, find slope b=Sxy/Sxx.',
        ],
        '3/2',
        [
          'b=3/2，表示x每增加1，拟合y增加1.5，不是每条观测都必须增加1.5。',
          'b=3/2: one extra x unit increases fitted y by 1.5, not necessarily each observation.',
        ],
        ['2/3', '3'],
      ),
      N(
        [
          '同三对数据的均值点为(2,4)，斜率3/2。用a=ȳ−bx̄求截距。',
          'For the same pairs, the mean point is (2,4) and slope 3/2. Find intercept a=ȳ−bx̄.',
        ],
        '1',
        [
          '4−(3/2)×2=1，含截距拟合线过均值点，不强制过原点。',
          '4−(3/2)×2=1. The line with intercept passes through the mean point, not necessarily the origin.',
        ],
        ['0', '4'],
      ),
      N(
        [
          '模型ŷ=1+(3/2)x，在x=2的拟合值是多少？',
          'For model ŷ=1+(3/2)x, find the fitted value at x=2.',
        ],
        '4',
        [
          '1+3=4；该x处观测y=3并不使拟合值变成3。',
          '1+3=4; an observed y of three at this x does not change the fitted value.',
        ],
        ['3', '5'],
      ),
      N(
        [
          '观测点(2,3)，模型ŷ=1+(3/2)x。求该点带符号残差y−ŷ。',
          'For observation (2,3) and model ŷ=1+(3/2)x, find signed residual y−ŷ.',
        ],
        '-1',
        [
          '在x=2处ŷ=4，残差3−4=−1，表示点在拟合线下方。',
          'At x=2 the fit is four, so residual 3−4=−1 places the observation below the line.',
        ],
        ['1', '0'],
      ),
      N(
        [
          '对(1,3),(2,3),(3,6)，候选线ŷ=1+x。求残差平方和。',
          'For (1,3),(2,3),(3,6), find the residual sum of squares for candidate ŷ=1+x.',
        ],
        '5',
        [
          '拟合2,3,4，残差1,0,2，平方和1+0+4=5。',
          'Fits 2,3,4 give residuals 1,0,2 and squared sum five.',
        ],
        ['3', '0', '3/2'],
      ),
      E(
        [
          '虚构成对记录(1,3),(2,3),(3,6)，拟合线ŷ=1+1.5x。核对三条残差与平方和；查询x=4得到多少，属于什么范围，能否保证真实y或推断因果？',
          'Fictional pairs are (1,3),(2,3),(3,6) with fitted line ŷ=1+1.5x. Check all residuals and their squared sum. Predict at x=4, classify the scope and assess guarantees or causal conclusions.',
        ],
        [
          '拟合2.5,4,5.5，残差0.5,−1,0.5，平方和0.25+1+0.25=1.5，带符号和0不表示无误差。x=4给7，超出观测x范围[1,3]为外推；不能保证真实y=7。原数据为虚构观测，线性趋势不证明因果；应核来源、形状、残差、情境与新数据，不为改善拟合随意删有效远点。',
          'Fitted values 2.5,4,5.5 give residuals 0.5,−1,0.5 and squared sum 1.5. Their signed sum zero does not imply no error. At x=4 the fit is seven, extrapolating beyond observed [1,3], not guaranteeing y=7. Fictional observational pairs do not establish causation. Check sources, shape, residuals, context and new data; do not remove valid distant points merely to improve the fit.',
        ],
      ),
    ],
    pick: {
      stem: [
        '本课含截距最小二乘直线在最小化什么？',
        'What does the least-squares line with an intercept minimize here?',
      ],
      options: [
        ['到直线的最短距离之和', 'Sum of shortest distances to the line'],
        ['未被穿过的点数', 'Number of points not on the line'],
        [
          '同一x处竖直残差的平方和',
          'Sum of squared vertical residuals at the same x',
        ],
      ],
      feedback: [
        [
          '普通y对x回归使用竖直残差，不是正交距离回归。',
          'Ordinary regression of y on x uses vertical residuals, not orthogonal distances.',
        ],
        [
          '穿过点数不是本课目标，小误差和一个大误差仍需按平方比较。',
          'The number hit is not the objective; squared errors weigh their magnitudes.',
        ],
        [
          '逐点用y−ŷ，平方求和；极小值不要求每项0。',
          'Use y−ŷ for each pair and sum squares; the minimum need not be zero.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '三对数据(2,3),(2,4),(2,6)的x都相同。能唯一确定ŷ=a+bx的斜率吗？原x=2处的最佳共同拟合值呢？',
      'The pairs (2,3),(2,4),(2,6) all have x=2. Is the slope of ŷ=a+bx unique? What about the best common fitted value at x=2?',
    ],
    rubric: [
      'x无变化，Sxx=0，不能除0确定唯一b。任意满足a+2b=13/3的直线都给相同最小平方和，因此斜率/截距组合不唯一；但原x=2处的最佳共同拟合值唯一为y均值13/3。原x之外的预测随b变化，不可唯一确定。',
      'There is no x variation, so Sxx=0 and no division gives a unique slope. Every line satisfying a+2b=13/3 has the same minimum squared error. Coefficients are nonunique, while the best common fit at x=2 is uniquely mean y=13/3. Predictions away from two vary with b and are not identified.',
    ],
    prompts: [
      [
        '你减的是y−ŷ还是ŷ−y？为什么画竖线？',
        'Is the residual y−ŷ or its reverse, and why is its segment vertical?',
      ],
      [
        '查询的x在观测范围内吗？模型还需要哪些证据？',
        'Is the requested x in the observed range, and what evidence does the model still need?',
      ],
    ],
    misconception: [
      '用穿点数选线、把残差抵消当无误差、把拟合当因果或可靠外推。',
      'Choosing by points hit, cancelling residuals to claim no error, or treating a fit as causation or reliable extrapolation.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  const s = specs[i]!;
  if (v.answer.kind === 'explain')
    return reasoning(id, T(v.stem), s.skill, v.answer.rubric, s.hints.map(T));
  const value = 'value' in v.answer ? String(v.answer.value) : '',
    out = numeric(
      id,
      T(v.stem),
      value,
      s.skill,
      s.hints.map(T),
      [T(s.hints[0]!), T(v.step)],
      { accepted: [value], rejected: v.wrong },
    );
  out.answer = v.answer;
  return out;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h08Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H08-L0${i + 1}`;
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
    unit: 'H08',
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
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h08ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H08-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H08 retrieval');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24;
  let item: Item;
  if (i === 0) {
    if (k % 3 === 0)
      item = N(
        [
          `长度${(5 + k) * 10} mm换算成cm，填数值。`,
          `Convert ${(5 + k) * 10} mm to cm; give the number.`,
        ],
        String(5 + k),
        ['每10 mm为1 cm，除以10。', 'Divide by ten because 10 mm is one cm.'],
        ['999', '-999'],
      );
    else if (k % 3 === 1)
      item = N(
        [
          `不同ID的长度为${k},${k + 2},缺失,${k + 4} cm；另一次导入重复第一ID。缺失不补值，求去重复后的有效长度均值。`,
          `Distinct IDs have lengths ${k},${k + 2},missing,${k + 4} cm; a further import duplicates the first ID. With no imputation, find the mean after merging that repeated ID.`,
        ],
        String(k + 2),
        [
          '三条有效长度，重复导入不多计，缺失不当0。',
          'Use the three valid lengths once each; missing is not zero.',
        ],
        ['999', '-999'],
      );
    else {
      const cases: [Pair, DataCode][] = [
          [['颜色标签蓝/绿', 'colour labels blue/green'], 'nominal'],
          [['低/中/高满意度', 'low/medium/high satisfaction'], 'ordinal'],
          [['一盒纸卡件数', 'number of cards in a box'], 'discrete'],
          [['测得的步道长度', 'measured trail length'], 'continuous'],
          [['以1/2/3编码的交通方式', 'travel modes coded 1/2/3'], 'nominal'],
          [['小/中/大尺码等级', 'ordered small/medium/large sizes'], 'ordinal'],
          [
            ['一次实验的成功次数', 'number of successes in an experiment'],
            'discrete',
          ],
          [
            ['取整记录的持续时间', 'duration recorded after rounding'],
            'continuous',
          ],
        ],
        v = cases[Math.floor(k / 3)]!;
      item = C(
        [
          `将变量“${v[0][0]}”分为nominal/ordinal/discrete/continuous。`,
          `Classify ${v[0][1]} as nominal/ordinal/discrete/continuous.`,
        ],
        v[1],
        [
          '按变量意义而非编码外观分类。',
          'Classify by meaning, not by code appearance.',
        ],
        ['999', 'undefined'],
      );
    }
  } else if (i === 1) {
    const base = [
        shapeCases[0]!,
        shapeCases[1]!,
        shapeCases[2]!,
        shapeCases[4]!,
      ][Math.floor(k / 6)]!,
      j = k % 6,
      values = transformData(base.values, '1', String(j)),
      s = dataSummary(values),
      stem: Pair = [
        `原数据${values.join(',')}；${j % 3 === 0 ? '求均值' : j % 3 === 1 ? '求中位数' : '给right-skew/left-skew/symmetric/asymmetric形状代码'}。`,
        `For raw observations ${values.join(',')}, ${j % 3 === 0 ? 'find the mean' : j % 3 === 1 ? 'find the median' : 'give the shape code right-skew/left-skew/symmetric/asymmetric'}.`,
      ];
    item =
      j % 3 === 2
        ? C(
            stem,
            base.shape,
            [
              '同加常数平移形状，回看尾部和镜像。',
              'A common shift preserves shape; inspect tails and reflection.',
            ],
            ['undefined', '999'],
          )
        : N(
            stem,
            textR(j % 3 === 0 ? s.mean : s.median),
            [
              '用全部原始观测，均值与中位数分开。',
              'Use all raw observations and distinguish mean from median.',
            ],
            ['999', '-999'],
          );
  } else if (i === 2) {
    const m = k % 6,
      d = 1 + Math.floor(k / 6),
      values = [String(m - d), String(m), String(m + d)],
      sample = k % 2 === 1,
      s = dataSummary(values, sample ? 'sample' : 'population'),
      stem: Pair = [
        `数据${values.join(',')}，${sample ? '样本n−1' : '完整总体n'}约定，${k % 3 === 0 ? '求离均差平方和' : '求精确标准差'}。`,
        `Data ${values.join(',')}, using ${sample ? 'sample divisor n−1' : 'finite-population divisor n'}: ${k % 3 === 0 ? 'find the squared deviation sum' : 'find the exact SD'}.`,
      ];
    item =
      k % 3 === 0
        ? N(
            stem,
            textR(s.ss),
            [
              '先逐项平方再加，不相消。',
              'Square each deviation before summing.',
            ],
            ['999', '-999'],
          )
        : R(
            stem,
            `sqrt(${textR(s.variance!)})`,
            [
              '先按指定分母求方差，再开非负根。',
              'Use the specified divisor for variance, then its nonnegative root.',
            ],
            ['999', '-999'],
          );
  } else if (i === 3) {
    const m = 40 + k,
      s = k % 6 === 5 ? 0 : 2 + Math.floor(k / 6),
      x = m + s * (-2 + (k % 5)),
      z = zScore(String(x), String(m), String(s)),
      stem: Pair = [
        `参照μ=${m}、σ=${s}，观测x=${x}，求z；无定义写undefined。`,
        `Reference μ=${m},σ=${s}, observation x=${x}: find z, using undefined if needed.`,
      ];
    item =
      z === null
        ? C(
            stem,
            'undefined',
            [
              '标准差0不能作分母，包括0/0。',
              'Zero SD cannot be a denominator, including 0/0.',
            ],
            ['0', '999'],
          )
        : N(
            stem,
            textR(z),
            [
              '先减参照均值，再除参照标准差，保留符号。',
              'Subtract the reference mean, divide by its SD and retain the sign.',
            ],
            ['999', '-999'],
          );
  } else {
    const shift = k % 6,
      lift = Math.floor(k / 6),
      rows = regressionCases[0]!.rows.map((r) => ({
        ...r,
        x: String(Number(r.x) + shift),
        y: String(Number(r.y) + lift),
      })),
      fit = leastSquares(rows),
      kind = k % 4,
      query = 4 + shift,
      value =
        kind === 0
          ? fit.slope!
          : kind === 1
            ? fit.intercept!
            : kind === 2
              ? regressionPrediction(rows, String(query))!
              : fit.rows[1]!.residual,
      task: Pair =
        kind === 0
          ? ['求斜率', 'find the slope']
          : kind === 1
            ? ['求截距', 'find the intercept']
            : kind === 2
              ? [
                  `求x=${query}的拟合值（外推）`,
                  `find the fitted value at x=${query} (extrapolation)`,
                ]
              : ['求第2条记录的y−ŷ残差', 'find residual y−ŷ for record two'];
    item = N(
      [
        `对${rows.map((r) => `(${r.x},${r.y})`).join(',')}作含截距最小二乘线，${task[0]}。`,
        `For intercept-containing least squares on ${rows.map((r) => `(${r.x},${r.y})`).join(',')}, ${task[1]}.`,
      ],
      textR(value),
      [
        `拟合线截距${textR(fit.intercept!)}、斜率${textR(fit.slope!)}，残差用观测减拟合。`,
        `The fitted intercept is ${textR(fit.intercept!)} and slope ${textR(fit.slope!)}; residual is observed minus fitted.`,
      ],
      ['999', '-999'],
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h08CheckQuestions: Question[] = [
  q('H08-CHECK-Q1', 0, specs[0]!.items[1]!),
  q('H08-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('H08-CHECK-Q3', 2, specs[2]!.items[0]!),
  q('H08-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('H08-CHECK-Q5', 4, specs[4]!.items[2]!),
  pick('H08-CHECK-Q6', 4),
  q('H08-CHECK-Q7', 2, specs[2]!.items[5]!),
  q('H08-CHECK-Q8', 4, specs[4]!.items[5]!),
];
