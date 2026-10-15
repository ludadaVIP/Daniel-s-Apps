import {
  t,
  type Lesson,
  type Question,
  type AnswerSpec,
  type NumberDiagram,
} from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (s: Pair) => t(...s);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  accepted?: string[];
  outcomes?: string[];
  probability?: boolean;
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
  diagram?: NumberDiagram;
};
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  probability = false,
  unit?: Item['unit'],
  diagram?: NumberDiagram,
): Item => ({ stem, value, step, wrong, probability, unit, diagram });
const S = (
  stem: Pair,
  outcomes: string[],
  step: Pair,
  wrong: string[],
): Item => ({ stem, value: outcomes.join(','), step, wrong, outcomes });
const dots = (
  values: number[],
  max = 10,
  step = 1,
  name = 'Data',
): NumberDiagram => ({ kind: 'dot-distribution', values, max, step, name });
type Pick = {
  stem: Pair;
  options: Pair[];
  feedback: Pair[];
  correct: number;
  step: Pair;
};
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
  'sample-population-and-frame',
  'distribution-centre-spread-shape',
  'mean-and-unusual-record',
  'complete-equally-likely-space',
  'conditional-two-step-tree',
];
const hints: Pair[][] = [
  [
    [
      '先问研究的是全部哪些记录，再找本次真正取得的记录。',
      'Identify the full target records, then the records actually observed this time.',
    ],
    [
      '样本条数不是总体条数；覆盖范围、抽取办法与未回答都影响推断，粗估不是确数。',
      'Sample count differs from population count. Coverage, selection and nonresponse matter; an estimate is not an exact population result.',
    ],
  ],
  [
    [
      '把所有记录放在相同刻度上，看集中位置、分散、空隙与簇。',
      'Use the same scale for all records; inspect centre, spread, gaps and clusters.',
    ],
    [
      '极差为最大减最小，区间计数先读清是否含端点；相同均值不保证相同分布。',
      'Range is maximum minus minimum. Read interval endpoints carefully. Equal means do not guarantee equal distributions.',
    ],
  ],
  [
    [
      '保留全部记录，先求总和与条数，再排序找中间位置。',
      'Retain every record, find sum and count, then order values for the middle position.',
    ],
    [
      '一条改动使均值变化为总和变化除以固定条数；中位数看位置也可能改变。异常先核来源，不自动删除。',
      'A changed record shifts the mean by total change divided by fixed count. Median depends on positions and may also change. Check an unusual record rather than automatically deleting it.',
    ],
  ],
  [
    [
      '按第一步结果分组，再逐个列第二步，保留先后顺序。',
      'Group by the first result and list each second result, retaining order.',
    ],
    [
      '完整、不重复；只有基本结果等可能才用符合数/总数。骰子和的种类并不等可能。',
      'List all distinct outcomes. Favourable/total counts require equally likely basics; different dice sums are not equally likely.',
    ],
  ],
  [
    [
      '先标清是否放回，以及每一步在什么球中等机会抽。',
      'Specify replacement and the tokens equally eligible at each step.',
    ],
    [
      '一条路径乘首步与条件概率，互斥路径相加；不放回时分母少一、抽中色的个数也少一。',
      'Multiply first and conditional probabilities along a path, then add exclusive paths. Without replacement the denominator and drawn-colour count both fall by one.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const answer: AnswerSpec = item.outcomes
    ? { kind: 'outcome-set', values: item.outcomes, value: item.value }
    : {
        kind: 'number',
        value: item.value,
        formats: item.probability
          ? ['decimal', 'fraction', 'percent']
          : ['decimal', 'fraction'],
        ...(item.unit ? { unit: item.unit } : {}),
      };
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    {
      accepted: [
        item.value,
        ...(item.accepted ?? []),
        ...(item.outcomes
          ? [`{${[...item.outcomes].reverse().join(', ')}}`]
          : []),
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  result.answer = answer;
  result.misconceptionTags = [
    skills[i]!,
    'scope-and-evidence',
    'ordered-versus-equiprobable',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((s, j) => ({ text: T(s), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.step)],
  );
const specs: Spec[] = [
  {
    title: ['样本与总体初识', 'Population and sample basics'],
    objective: [
      '区分总体、样本和抽样框，识别覆盖偏差与估计的不确定性。',
      'Distinguish population, sample and sampling frame, recognising coverage bias and uncertainty.',
    ],
    prerequisites: ['P57-L01', 'P67-L02'],
    keywords: [
      ['总体', 'population'],
      ['样本', 'sample'],
      ['抽样框', 'sampling frame'],
    ],
    lab: 'infer-sample',
    hook: [
      '只问最容易遇到的六人，能代表全部二十四条记录吗？抽更多同一小组就能解决问题吗？',
      'Can six convenient observations represent all twenty-four? Does taking more from the same limited group solve the problem?',
    ],
    items: [
      N(
        [
          '研究 24 条虚构通勤记录，本次抽取六条不同记录。样本条数是多少？',
          'A study targets 24 fictional commute records and selects six distinct records. What is the sample size?',
        ],
        '6',
        [
          '总体二十四条，样本是本次六条，不把两者相加。',
          'The population has twenty-four; this sample has six, without adding the counts.',
        ],
        ['24', '30'],
      ),
      N(
        [
          '虚构书区研究全部 48 本书厚度，只抽八本测量。总体包含几本书的记录？',
          'A fictional study targets all 48 books in a section and measures eight. How many book records belong to the population?',
        ],
        '48',
        [
          '目标是全部四十八本，八本是样本，未抽中的仍属于总体。',
          'The target includes all forty-eight; eight are sampled and unselected books remain in the population.',
        ],
        ['8', '40'],
      ),
      N(
        [
          '从 24 条记录取六条不同记录，样本条数占总体多少？',
          'Six distinct records are sampled from twenty-four. What fraction of the population is sampled?',
        ],
        '1/4',
        [
          '六除二十四等于四分之一；覆盖比例不自动保证代表性。',
          '6/24=1/4; the sampling fraction alone does not guarantee representativeness.',
        ],
        ['4', '6/18'],
        true,
      ),
      N(
        [
          '在抽样方式适合估计比例的假设下，十个样本中二个有某特征。对 100 个总体成员作同一比例粗估，估计多少个？此值不是确数。',
          'Assume the sampling design supports a rough proportion estimate. Two of ten sampled members have a feature. Estimate the count among a population of 100; this is not exact.',
        ],
        '20',
        [
          '样本比例 2/10，粗估 100×2/10=20；抽样误差与偏差仍需考虑。',
          'Use 100×2/10=20 as a rough estimate, retaining sampling uncertainty and possible bias.',
        ],
        ['2', '50', '100'],
      ),
      N(
        [
          '四条完整样本通勤分钟数为 6、8、10、12，求此样本均值。',
          'Complete sample commute times are 6,8,10,12 minutes. Find the sample mean.',
        ],
        '9',
        [
          '总和三十六除四得九分钟；不能未经条件就称总体均值九。',
          'The total thirty-six divided by four gives nine minutes; do not automatically call it the population mean.',
        ],
        ['36', '8'],
        false,
        'min',
      ),
      N(
        [
          '邀请八个不同编号回答，五个回答。回答率是多少？未回答不是零值记录。',
          'Eight distinct IDs are invited and five respond. What is the response fraction? Missing responses are not zero-valued records.',
        ],
        '5/8',
        [
          '回答率五除八，未答三条需要说明，不能补成三个零观测。',
          'The response fraction is 5/8; report the three nonresponses rather than inventing zero observations.',
        ],
        ['5/3', '3/8'],
        true,
      ),
    ],
    pick: {
      stem: [
        '哪项更能支持对全部记录的推断？',
        'Which better supports inference about all records?',
      ],
      correct: 2,
      options: [
        [
          '只把同一便利小组样本加大',
          'Increase only the same convenience group sample',
        ],
        [
          '只保留支持预想结论的回答',
          'Keep only answers supporting the expected conclusion',
        ],
        [
          '明确目标与抽样框，让目标记录有合适机会并报告未回答',
          'Define target and frame, provide appropriate selection opportunities and report nonresponse',
        ],
      ],
      feedback: [
        [
          '覆盖缺口不会靠重复同组消失。',
          'A coverage gap does not vanish by repeating one group.',
        ],
        [
          '按结论挑数据会产生偏差。',
          'Selecting records by a preferred conclusion creates bias.',
        ],
        [
          '方法与缺失比单看条数更有依据。',
          'Design and missingness matter beyond the count alone.',
        ],
      ],
      step: [
        '随机抽样也有变动，不保证某一次恰好代表总体。',
        'Random samples vary and no single sample is guaranteed representative.',
      ],
    },
    reason: [
      '解释总体、样本、抽样框与未回答的区别，为什么便利抽样条数变大仍可能偏，随机样本也不能保证每次准确？',
      'Explain population, sample, frame and nonresponse. Why may a larger convenience sample remain biased, and why is a random sample not guaranteed exact?',
    ],
    rubric: [
      '总体是目标全部记录，样本是实际取得的不同记录，抽样框是允许进入抽取机制的范围，未答不是零值。只取 A 组会漏 B/C，即使取完 A 也未覆盖总体；随机机制可让全部编号有机会，但本次构成与均值仍有抽样变动，不保证含每组或一定更接近。估计需说明方法、数量单位与不确定性；不能由一个模拟样本证明总体性质。家长核对目标、机制和结论范围。',
      'The population is the full target, the sample the actual distinct observed records, and the frame the eligible records. Nonresponse is not a zero. Restricting selection to A omits B/C even if all A is measured. Random eligibility can cover all IDs, yet realised composition and means still vary; every group or a closer mean is not guaranteed. Report method, observation unit and uncertainty rather than treating one simulation as proof.',
    ],
    misconception: [
      '总体样本相加；样本大便无偏；漏答补零；随机一次必代表。',
      'Adding population/sample counts, treating size as bias removal, filling missing data with zeros, or assuming one random sample must represent the whole.',
    ],
    prompts: [
      [
        '谁属于研究目标，谁根本没机会被抽？',
        'Who belongs to the target and who has no selection chance?',
      ],
      [
        '这个数是样本计算、总体确数还是粗估？',
        'Is this a sample calculation, population fact or estimate?',
      ],
    ],
  },
  {
    title: ['统计图中的分布', 'Distribution in charts'],
    objective: [
      '在共同刻度下比较集中、分散和形状，不以单一平均数替代分布。',
      'Compare centre, spread and shape on common scales rather than replacing a distribution by one mean.',
    ],
    prerequisites: ['J76-L01', 'J75-L03', 'P67-L01'],
    keywords: [
      ['分布', 'distribution'],
      ['分散', 'spread'],
      ['极差', 'range'],
    ],
    lab: 'infer-distribution',
    hook: [
      '两组平均数都三，一组全在三，另一组全在零和六。它们真的差不多吗？',
      'Both means are three: one group is all threes and another only zeros and sixes. Are they really similar?',
    ],
    items: [
      N(
        [
          'A 组记录 3、3、3、3，极差是多少？',
          'Group A is 3,3,3,3. Find its range.',
        ],
        '0',
        [
          '最大三减最小三为零，不是没有记录。',
          'Maximum three minus minimum three is zero, not an absence of records.',
        ],
        ['3', '6'],
        false,
        undefined,
        dots([3, 3, 3, 3], 10, 1, 'A'),
      ),
      N(
        [
          'B 组记录 0、0、6、6，极差是多少？',
          'Group B is 0,0,6,6. Find its range.',
        ],
        '6',
        ['最大六减最小零等于六。', 'Six minus zero is six.'],
        ['0', '3'],
        false,
        undefined,
        dots([0, 0, 6, 6], 10, 1, 'B'),
      ),
      N(
        [
          '记录 3、3、3、3 中，落在 2≤x≤4 区间的有几条？两端包含。',
          'How many of 3,3,3,3 lie in 2≤x≤4, including both endpoints?',
        ],
        '4',
        [
          '每条三都在区间，重复值仍是四条记录。',
          'Every three is inside; duplicates remain four separate records.',
        ],
        ['1', '2'],
      ),
      N(
        ['记录 0、0、6、6 的均值是多少？', 'Find the mean of 0,0,6,6.'],
        '3',
        [
          '总和十二除四为三；均值处不一定有真实记录。',
          'Twelve divided by four is three; the mean need not be an observed value.',
        ],
        ['0', '6', '12'],
      ),
      N(
        [
          '记录 0、0、6、6 中，数值等于六的相对频数是多少？',
          'What relative frequency of 0,0,6,6 equals six?',
        ],
        '1/2',
        [
          '两条符合除四条总记录为二分之一，不是除不同值种数二。',
          'Two matching records among four gives one half, not a denominator of two distinct values.',
        ],
        ['1', '2'],
        true,
      ),
      N(
        [
          '新组 2、2、3、7、7，极差是多少？',
          'A new group is 2,2,3,7,7. Find its range.',
        ],
        '5',
        [
          '七减二为五，重复次数影响分布但不改变这次最值差。',
          'Seven minus two is five; repetitions affect distribution but not these extremes.',
        ],
        ['7', '3'],
        false,
        undefined,
        dots([2, 2, 3, 7, 7]),
      ),
    ],
    pick: {
      stem: [
        'A 全是三，B 为零零六六，均值都三。能得出什么？',
        'A contains only threes; B is 0,0,6,6. Both means are three. What follows?',
      ],
      correct: 1,
      options: [
        ['两组分布相同', 'The distributions are identical'],
        [
          '中心摘要相同，但分散与形状不同',
          'The centre summary matches while spread and shape differ',
        ],
        ['均值三说明 B 必有一条三', 'Mean three means B must contain a three'],
      ],
      feedback: [
        [
          '均值丢掉了很多位置与频数信息。',
          'A mean omits much positional and frequency information.',
        ],
        [
          'A 集中，B 分两端，中间有空隙。',
          'A is concentrated; B clusters at two ends with a gap.',
        ],
        [
          '均值是平摊值，不一定实际出现。',
          'A mean is a fair-share summary, not necessarily an observed value.',
        ],
      ],
      step: [
        '比较分布要看全体记录，而非只对一个统计量。',
        'Compare the records as a distribution, not only one statistic.',
      ],
    },
    reason: [
      '用同刻度点图比较全三与零六两端的两组，再解释整体平移和分散改变的区别。为什么不能只用均值推原因？',
      'Compare the all-three and zero/six groups on the same scale, then distinguish shifting location from changing spread. Why cannot the mean alone reveal a cause?',
    ],
    rubric: [
      '两组均值与中位数都三，但A极差零、B极差六，B有两簇及中间空隙；均值相同不等于分布相同。整体加同一个数会移中心而保留形状/极差；把值向两端分散则可保持中心但改形状。共同刻度与同单位不可省，图只描述观察，不能自动确定因果或总体差异。家长核点数、重复与证据范围。',
      'Both means and medians are three, but A has range zero and B range six, two clusters and a gap. Adding a constant shifts centre while preserving shape/range; spreading values towards both ends can preserve centre while changing shape. Use common scales and units. A chart describes observations without automatically establishing causes or population differences.',
    ],
    misconception: [
      '只看平均数；重复点删掉；每图自动缩放后比外观；平均值必为一条记录。',
      'Looking only at means, deleting duplicates, comparing separately rescaled pictures, or assuming a mean must occur.',
    ],
    prompts: [
      [
        '有多少条记录堆在这里，空隙在哪里？',
        'How many records stack here, and where is the gap?',
      ],
      [
        '这个结论描述数据，还是声称原因？',
        'Does the claim describe data or assert a cause?',
      ],
    ],
  },
  {
    title: ['平均数与异常值', 'Means and outliers'],
    objective: [
      '保留并核查异常记录，解释单条变化怎样影响均值与中位数。',
      'Retain and check unusual records, explaining how one change affects mean and median.',
    ],
    prerequisites: ['J76-L02', 'P67-L02'],
    keywords: [
      ['异常记录', 'unusual record'],
      ['均值敏感性', 'mean sensitivity'],
      ['核查来源', 'source check'],
    ],
    lab: 'infer-outlier',
    hook: [
      '4、5、6、7、8 中最后一条变五十，平均数怎样变？看着不合群就能删掉吗？',
      'If the last of 4,5,6,7,8 becomes fifty, what happens to the mean? May an unusual record simply be deleted?',
    ],
    items: [
      N(
        [
          '五条有效记录 4、5、6、7、50，求均值，保留精确值。',
          'Five valid records are 4,5,6,7,50. Find the exact mean.',
        ],
        '72/5',
        [
          '总和七十二除五为 72/5=14.4，五十仍计入。',
          'The total seventy-two divided by five is 72/5=14.4, including fifty.',
        ],
        ['6', '22/4', '72'],
        false,
        undefined,
        dots([4, 5, 6, 7, 50], 60, 10),
      ),
      N(
        [
          '同五条 4、5、6、7、50 的中位数是多少？',
          'Find the median of 4,5,6,7,50.',
        ],
        '6',
        [
          '已排序五条，中间第三条为六，不能拿最大最小平均。',
          'The ordered third of five is six, not the average of extremes.',
        ],
        ['27', '14.4'],
      ),
      N(
        [
          '原 4、5、6、7、8 只把末条八改零，条数仍五。新均值是多少？',
          'Replace only the eight in 4,5,6,7,8 by zero, retaining five observations. Find the new mean.',
        ],
        '22/5',
        [
          '总和二十二除五，零是有效记录，不从分母删掉。',
          'Twenty-two divided by five; zero remains a valid record in the count.',
        ],
        ['22/4', '6', '0'],
      ),
      N(
        [
          '末条改零后的 4、5、6、7、0，中位数是多少？',
          'Find the median after the change to 4,5,6,7,0.',
        ],
        '5',
        [
          '排序零、四、五、六、七，中间为五，说明中位数也可能变。',
          'Order 0,4,5,6,7: the middle is five, showing median can change.',
        ],
        ['6', '22/5'],
      ),
      N(
        [
          '保持五条，只把八改五十，均值增加多少？',
          'With five records fixed, replace eight by fifty. How much does the mean increase?',
        ],
        '42/5',
        [
          '总和增加四十二，均值增加 42/5=8.4，不是直接增四十二。',
          'The total rises forty-two, so the mean rises 42/5=8.4.',
        ],
        ['42', '50', '5'],
      ),
      N(
        [
          '五条有效记录 1、2、3、4、20，求均值。',
          'Find the mean of five valid records 1,2,3,4,20.',
        ],
        '6',
        [
          '总和三十除五为六；不因二十显得特别就擅删。',
          'Thirty divided by five is six; do not delete twenty for being unusual.',
        ],
        ['5/2', '3', '30'],
      ),
    ],
    pick: {
      stem: [
        '一条数据明显偏离其余记录，正确处理是哪项？',
        'How should an unusual record be handled?',
      ],
      correct: 0,
      options: [
        [
          '核来源、单位或录入；若有效则保留并解释影响',
          'Check source, units and entry; retain it if valid and explain its influence',
        ],
        ['直接删掉让平均数正常', 'Delete it to make the mean look normal'],
        ['把它改成中位数但不说明', 'Silently replace it by the median'],
      ],
      feedback: [
        [
          '异常是核查信号，不是自动错误证明。',
          'Unusualness prompts checking, not automatic rejection.',
        ],
        [
          '这会无依据改变数据和结论。',
          'This changes data and conclusions without evidence.',
        ],
        [
          '隐瞒替换破坏记录来源。',
          'Undisclosed replacement breaks traceability.',
        ],
      ],
      step: [
        '核实、保留与清楚报告比把图弄整齐重要。',
        'Checking and transparent reporting matter more than tidying the plot.',
      ],
    },
    reason: [
      '比较末条八改五十、改零对均值与中位数的影响；解释为何不能把异常值一律删掉，也不能说中位数永远不变。',
      'Compare replacing eight by fifty or zero. Explain effects on mean/median, why unusual values cannot be automatically removed and why median is not always unchanged.',
    ],
    rubric: [
      '原均值/中位数均六；改五十后均值72/5、中位六，均值增加42/5；改零后均值22/5、中位五。条数保持五，重复与零均计入；中位靠排序位置而非不受任何改动。异常需查原始来源、单位、录入，若真实有效就保留并用全分布与不同摘要说明；若证实错误则有依据记录更正，不偷偷删改。家长核算及检查结论条件。',
      'The original mean/median are six. Replacing eight by fifty gives mean 72/5, median six and mean change 42/5. Replacing it by zero gives mean 22/5 and median five. Keep five records including zeros and duplicates. Median depends on positions, not immunity to all changes. Check source, units and entry; retain valid unusual data and report its influence. Correct only verified errors transparently.',
    ],
    misconception: [
      '异常必错；零不计数；改总和直接当均值变化；中位数永不变。',
      'Assuming unusual means wrong, excluding zero, using total change as mean change, or claiming median never changes.',
    ],
    prompts: [
      [
        '条数变了吗，总和变多少？',
        'Did the count change, and how much did the total change?',
      ],
      [
        '这是核实错误，还是只是看起来不合群？',
        'Was an error verified, or does the value merely look unusual?',
      ],
    ],
  },
  {
    title: ['列举概率的样本空间', 'Listing sample spaces'],
    objective: [
      '系统列举有序基本结果，在等可能前提下计数求概率。',
      'List ordered basic outcomes systematically and count probabilities under equal likelihood.',
    ],
    prerequisites: ['J76-L01', 'P67-L03', 'P67-L04'],
    keywords: [
      ['样本空间', 'sample space'],
      ['基本结果', 'basic outcome'],
      ['等可能', 'equally likely'],
    ],
    lab: 'infer-space',
    hook: [
      '两次硬币的 HT 与 TH 能合并成“一正一反”吗？两枚骰子和有十一种，和七就是 1/11 吗？',
      'May HT and TH be merged for two tosses? Dice sums have eleven values: does that make sum seven have probability 1/11?',
    ],
    items: [
      S(
        [
          '两次独立公平硬币，H 正面、T 反面，先后组成两个字母。列完整样本空间，逗号分隔。',
          'Toss an independent fair coin twice. H/T label faces; first then second form each code. List the complete space, comma-separated.',
        ],
        ['HH', 'HT', 'TH', 'TT'],
        [
          '先 H 分 HH/HT，再 T 分 TH/TT；四个等可能有序结果不合并。',
          'Group first H into HH/HT and first T into TH/TT; retain all four ordered outcomes.',
        ],
        ['HH,HT,TT', 'HH,HT,TH,TT,HT'],
      ),
      N(
        [
          '独立公平硬币 H/T 与公平三等分转盘 1/2/3，硬币记前。有几个等可能基本结果？',
          'An independent fair H/T coin and equal-sector 1/2/3 spinner are recorded coin first. How many equally likely basic outcomes?',
        ],
        '6',
        [
          '两种首步分别配三种次步，共六，不是两加三。',
          'Each of two first results pairs with three second results, giving six, not five.',
        ],
        ['5', '3'],
      ),
      S(
        [
          '上述硬币与三等分转盘实验，用 H1 表示 H 后转到一，列完整代码集合。',
          'For that coin/spinner experiment, H1 means H then one. List every code.',
        ],
        ['H1', 'H2', 'H3', 'T1', 'T2', 'T3'],
        [
          '按首字母分两组，每组按一二三列齐；不把独立结果合成 H、T、1、2、3。',
          'List two first-face groups, each paired with one,two,three; do not collapse them to separate component labels.',
        ],
        ['H,T,1,2,3', 'H1,H2,H3,T1,T2'],
      ),
      N(
        [
          '两枚可区分、独立公平六面骰，和为七的概率？用有序数对计数。',
          'Roll two distinguishable independent fair six-sided dice. Find the chance of sum seven using ordered pairs.',
        ],
        '1/6',
        [
          '基本结果三十六个，和七有 (1,6)…(6,1) 六个，所以6/36=1/6；十一种和不等可能。',
          'There are thirty-six equal basics and six summing to seven, giving 6/36=1/6; the eleven sums are not equally likely.',
        ],
        ['1/11', '1/36', '1/7'],
        true,
      ),
      N(
        [
          '两次独立公平硬币，恰一次 H 的概率是多少？',
          'For two independent fair tosses, find the probability of exactly one H.',
        ],
        '1/2',
        [
          '符合 HT、TH 两条，全部四条，2/4=1/2。',
          'HT and TH are two favourable outcomes among four: 1/2.',
        ],
        ['1/3', '1/4'],
        true,
      ),
      S(
        [
          '两个独立公平二等分转盘均标 1、2，先第一盘再第二盘，11 表示一后再一。列完整代码。',
          'Two independent equal two-sector spinners each show 1 or 2. Record the first then second, with 11 meaning one then one. List the complete codes.',
        ],
        ['11', '12', '21', '22'],
        [
          '第一盘一配11/12，第一盘二配21/22；12和21分别保留。',
          'First one gives 11/12, first two gives 21/22; keep 12 and 21 distinct.',
        ],
        ['11,12,22', '1,2'],
      ),
    ],
    pick: {
      stem: [
        '为什么两枚骰子的和不能直接按十一种数值平均分概率？',
        'Why cannot the eleven dice-sum values simply share probability equally?',
      ],
      correct: 2,
      options: [
        ['因为和七绝不可能', 'Because sum seven is impossible'],
        ['因为骰子不能区分', 'Because the dice cannot be distinguished'],
        [
          '不同和值对应的等可能有序点数对数量不同',
          'Different sums contain different numbers of equally likely ordered face pairs',
        ],
      ],
      feedback: [
        ['有六个有序点数对和七。', 'Six ordered pairs sum to seven.'],
        [
          '题设已明确可区分，关键在合并后的权重。',
          'The dice are distinguishable; aggregation weights are the issue.',
        ],
        [
          '和二只有(1,1)，和七却六条，所以概率不同。',
          'Sum two contains only(1,1), while sum seven contains six pairs.',
        ],
      ],
      step: [
        '等可能要检查基本结果，不由结果名称的种类数自动决定。',
        'Equal likelihood belongs to the basic outcomes, not automatically to named categories.',
      ],
    },
    reason: [
      '写两次硬币空间并解释为何 HT、TH 不合并；比较骰子和二与和七，说明计数公式的前提。',
      'List the two-toss space and explain why HT/TH remain distinct. Compare dice sums two and seven and state the premise behind counting probability.',
    ],
    rubric: [
      '硬币空间HH、HT、TH、TT完整不重不漏；先后不同导致HT、TH是两条基本路径，即使某事件把它们归为一类也不能丢权重。公平独立给四条等可能。两公平独立可区分骰有36有序点数对，和二一条概率1/36，和七六条概率1/6；合并后的11种和不等可能。若基本结果不同权，不能用类别数比值，须按概率或进一步细分。家长看系统列举及假设。',
      'HH,HT,TH,TT are complete and distinct. HT/TH differ in order even if an event groups them together; retain their weights. Fair independence gives four equal basics. Two fair independent distinguishable dice give thirty-six equal ordered pairs: sum two has one and probability 1/36; sum seven has six and probability 1/6. Aggregated sums are unequal. Unequal basics require probability weights or a finer equal-outcome space.',
    ],
    misconception: [
      '忽略先后；只列事件而非空间；重复条目；类别名多便等可能。',
      'Ignoring order, listing only the event, repeating entries, or assuming named categories are equally likely.',
    ],
    prompts: [
      [
        '你按哪一步分组，有没有漏掉一种配对？',
        'Which step groups the list, and is any pairing missing?',
      ],
      [
        '这些是等可能基本结果，还是合并后的类别？',
        'Are these equal basic outcomes or aggregated categories?',
      ],
    ],
  },
  {
    title: ['两步随机实验的树状图', 'Tree diagrams for two-step experiments'],
    objective: [
      '用条件计数完成两步树，比较放回与不放回并合并互斥事件路径。',
      'Build a two-step tree from conditional counts, comparing replacement and adding exclusive event paths.',
    ],
    prerequisites: ['J76-L04', 'P61-L02'],
    keywords: [
      ['条件概率', 'conditional probability'],
      ['放回', 'replacement'],
      ['路径', 'path'],
    ],
    lab: 'infer-tree',
    hook: [
      '两红一蓝抽两次，不放回时第二次红球还是 2/3 吗？四条颜色路径真的等可能吗？',
      'With two red and one blue token, is the second red chance still 2/3 without replacement? Are four colour paths equally likely?',
    ],
    items: [
      N(
        [
          '两红一蓝各有不同编号，每步在现存球中等机会抽一球，抽两次不放回。两红概率？',
          'Two red and one blue distinctly numbered tokens are equally eligible at each draw. Draw twice without replacement. Find P(two red).',
        ],
        '1/3',
        [
          '首红2/3，取走一红后剩一红一蓝，次红1/2，乘得1/3。',
          'First red is 2/3; then one red and one blue remain, giving 1/2 conditionally. Product 1/3.',
        ],
        ['4/9', '1/2', '2/3'],
        true,
      ),
      N(
        [
          '同两红一蓝，第一次后放回并混匀，再等机会抽。两红概率？',
          'For the same two-red/one-blue bag, replace and remix after the first draw. Find P(two red).',
        ],
        '4/9',
        [
          '放回恢复总数和颜色，2/3×2/3=4/9。',
          'Replacement restores counts:2/3×2/3=4/9.',
        ],
        ['1/3', '2/9'],
        true,
      ),
      N(
        [
          '三红一蓝编号球，等机会连抽两次不放回，不同色的概率？',
          'Three red and one blue numbered tokens are drawn equally twice without replacement. Find P(different colours).',
        ],
        '1/2',
        [
          'R→B为3/4×1/3=1/4，B→R为1/4×3/3=1/4；互斥相加1/2。',
          'R→B gives 3/4×1/3=1/4; B→R gives 1/4×3/3=1/4. Add the exclusive paths:1/2.',
        ],
        ['1/4', '3/8', '2/3'],
        true,
      ),
      S(
        [
          '编号 R1、R2、B1 连抽两次不放回，写全部有序编号路径，格式 R1-B1。不是只列颜色类别。',
          'Draw twice without replacement from IDs R1,R2,B1. List every ordered ID path using R1-B1 format, not colour categories.',
        ],
        ['R1-R2', 'R1-B1', 'R2-R1', 'R2-B1', 'B1-R1', 'B1-R2'],
        [
          '首步三种，每种次步剩两种，共六条；不能同一编号连抽，也不能合并相反顺序。',
          'Three first IDs each leave two second IDs, giving six paths. No repeated same token or merged reverse order.',
        ],
        ['RR,RB,BR', 'R1-R1,R1-R2,R1-B1,R2-R1,R2-B1,B1-R1,B1-R2'],
      ),
      N(
        [
          '两红一蓝编号球抽两次，每次放回混匀。至少一蓝的概率？',
          'Draw twice from two red/one blue numbered tokens with replacement and remixing. Find P(at least one blue).',
        ],
        '5/9',
        [
          '用补事件：1−P(RR)=1−4/9=5/9；也可把RB、BR、BB相加，不重复计。',
          'Use the complement 1−4/9=5/9, or add RB,BR,BB without overlap.',
        ],
        ['1/3', '4/9', '2/9'],
        true,
      ),
      N(
        [
          '两红两蓝编号球，等机会连抽两次不放回，不同色概率？',
          'Two red and two blue numbered tokens are drawn twice without replacement. Find P(different colours).',
        ],
        '2/3',
        [
          'RB为2/4×2/3=1/3，BR也1/3，相加2/3。',
          'RB is 2/4×2/3=1/3 and BR also 1/3, totalling 2/3.',
        ],
        ['1/2', '1/3'],
        true,
      ),
    ],
    pick: {
      stem: [
        '不放回抽走一红后，第二步概率应该怎样写？',
        'After drawing one red without replacement, how should the second step be formed?',
      ],
      correct: 1,
      options: [
        ['仍照原总数和原颜色数', 'Keep both original counts'],
        [
          '总数减一、红数减一，再按剩余球算',
          'Reduce total and red count by one, then use the remaining tokens',
        ],
        ['把每种颜色都看成 1/2', 'Assign 1/2 to each colour'],
      ],
      feedback: [
        [
          '这忽略了第一次改变袋内条件。',
          'This ignores the first draw changing the bag.',
        ],
        [
          '条件概率来自这条首步路径后的实际状态。',
          'Conditional chance uses the state after this particular first path.',
        ],
        [
          '颜色名不决定权重，可能有不同数量甚至零。',
          'Colour names do not determine weights; counts can differ or be zero.',
        ],
      ],
      step: [
        '一条路径乘条件概率，互斥路径再相加；不能把不放回当独立重复。',
        'Multiply conditional probabilities along a path and add exclusive paths; no replacement is not independent repetition.',
      ],
    },
    reason: [
      '用两红一蓝比较放回/不放回的树，并解释颜色路径与编号基本结果的区别，以及零概率分支。',
      'Compare replacement trees for two red/one blue, explaining colour paths, numbered basic outcomes and zero-probability branches.',
    ],
    rubric: [
      '放回首步R2/3、B1/3，次步相同，RR 4/9、RB 2/9、BR 2/9、BB 1/9，总和一，颜色路径不等可能。不放回RR 1/3、RB 1/3、BR 1/3、BB0；抽蓝后蓝数零，所以BB不可发生，不计可发生空间。编号R1/R2/B1不放回有六条等可能有序路径，每条1/6；颜色RR合并两条而非一个基本结果。沿路相乘、互斥相加来自条件计数，不能由概率预测下一次必然结果。家长核对每步分母、颜色数和事件归并。',
      'With replacement, first R/B chances 2/3 and 1/3 persist, giving RR 4/9,RB 2/9,BR 2/9,BB 1/9 and total one; colour paths are unequal. Without replacement RR,RB,BR each have 1/3 and BB is zero because no blue remains. Six ordered ID paths are equally likely at 1/6; RR aggregates two, not one basic outcome. Multiply conditional chances and add exclusive paths. Probabilities do not predict the next realised draw.',
    ],
    misconception: [
      '不放回仍原分母；只改分母不改颜色数；四颜色路径一律1/4；零分支当可发生结果。',
      'Keeping the original denominator, changing only total but not colour count, assigning 1/4 to every colour path, or counting a zero branch as possible.',
    ],
    prompts: [
      [
        '沿这条首步走后，袋里究竟还剩什么？',
        'What exactly remains after this first branch?',
      ],
      [
        '这条颜色路径合并了几个编号路径？',
        'How many numbered paths does this colour path combine?',
      ],
    ],
  },
];
export const j76Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J76-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J07',
    unit: 'J76',
    order: i + 1,
    nzYearHints: [7, 8],
    cnGradeHints: [7],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((item, j) => q(`${id}-Q${j + 2}`, i, item)),
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
            '纸上制作虚构的新西兰社区花园记录：标清总体与抽样框，画两组同均值不同分布，再修改一条记录比较摘要。用三张不同编号纸卡代表两红一蓝，分别写放回/不放回的完整两步树与编号空间，说明等可能前提和不同色概率。只需纸笔或纸卡，无须购买或收集真实个人数据；家长检查理由而非只核答案。',
            'On paper, create fictional New Zealand community-garden records: define the population/frame, draw equal-mean but different distributions and change one record. Use three distinct paper-card IDs for two red/one blue, writing complete replacement/nonreplacement trees and ID spaces. Explain equal likelihood and different-colour probability. Paper is sufficient, without purchases or a real personal survey. A parent reviews reasons rather than numbers alone.',
          ),
        }
      : {}),
  };
});
export function j76ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J76-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J76 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = 2 + (k % 7),
    b = 1 + (Math.floor(k / 7) % 6),
    c = 1 + (k % 5),
    scale = 3 + Math.floor(k / 7);
  let item: Item;
  if (i === 0)
    item = N(
      [
        `虚构总体 ${a * scale} 条，取得 ${a} 条不同样本，样本条数占总体多少？这不保证代表性。`,
        `A fictional population has ${a * scale} records and a sample ${a} distinct records. Find the sampling fraction; it does not guarantee representativeness.`,
      ],
      `1/${scale}`,
      [
        '样本条数除总体条数，机制与不确定性另核。',
        'Divide sample by population count; design and uncertainty require separate checks.',
      ],
      [String(scale), String(a)],
      true,
    );
  else if (i === 1)
    item = N(
      [
        `同单位记录 ${a}、${a}、${a + b}、${a + 2 * b}，求极差。`,
        `Same-unit observations are ${a},${a},${a + b},${a + 2 * b}. Find the range.`,
      ],
      String(2 * b),
      [
        '最大减最小，不删重复记录。',
        'Subtract the minimum from the maximum, retaining duplicates.',
      ],
      [String(a + 2 * b)],
    );
  else if (i === 2)
    item = N(
      [
        `五条有效记录 ${a}、${a + 1}、${a + 2}、${a + 3}、${a + 10 * b}，求精确均值。`,
        `Five valid records are ${a},${a + 1},${a + 2},${a + 3},${a + 10 * b}. Find the exact mean.`,
      ],
      `${5 * a + 6 + 10 * b}/5`,
      [
        '全体求和除五，异常不自动删。',
        'Sum all five and divide by five; unusualness does not justify deletion.',
      ],
      [String(a + 2)],
    );
  else if (i === 3) {
    const n = 2 + (k % 3),
      outcomes = ['H', 'T'].flatMap((face) =>
        Array.from({ length: n }, (_, j) => `${face}${j + 1}`),
      );
    item = S(
      [
        `独立公平H/T硬币与 ${n} 等分标1至${n}转盘，硬币在前，列完整代码集合。`,
        `An independent fair H/T coin and equal ${n}-sector spinner numbered 1 to ${n} are recorded coin first. List the complete codes.`,
      ],
      outcomes,
      [
        '逐个首步配齐全部次步，不漏、不重、不合并。',
        'Pair every first face with every second result, without omission, duplication or merging.',
      ],
      [outcomes.slice(1).join(',')],
    );
  } else
    item = N(
      [
        `红 ${a}、蓝 ${c} 个编号球，等机会抽两次不放回，两红概率？`,
        `Draw twice equally without replacement from ${a} red and ${c} blue numbered tokens. Find P(two red).`,
      ],
      `${a * (a - 1)}/${(a + c) * (a + c - 1)}`,
      [
        `首红 ${a}/${a + c}，次红 ${a - 1}/${a + c - 1}，沿路相乘。`,
        `Multiply first ${a}/${a + c} by conditional ${a - 1}/${a + c - 1}.`,
      ],
      ['1/2', `${a * a}/${(a + c) * (a + c)}`].filter(
        (s) => s !== '1/2' || a * (a - 1) * 2 !== (a + c) * (a + c - 1),
      ),
      true,
    );
  return q(`${id}-R${round}`, i, item);
}
export const j76CheckQuestions: Question[] = [
  q(
    'J76-CHECK-Q1',
    0,
    N(
      [
        '研究三十条总体记录，抽八条不同记录。样本条数？',
        'A target population has thirty records and eight distinct records are sampled. Find the sample size.',
      ],
      '8',
      [
        '样本为实际抽的八条，总体仍三十。',
        'Eight are sampled; the population remains thirty.',
      ],
      ['30', '38'],
    ),
  ),
  q(
    'J76-CHECK-Q2',
    1,
    N(
      ['记录 1、1、4、10、10，极差？', 'Find the range of 1,1,4,10,10.'],
      '9',
      [
        '十减一为九，重复仍保留。',
        'Ten minus one is nine, retaining repetitions.',
      ],
      ['10', '4'],
      false,
      undefined,
      dots([1, 1, 4, 10, 10], 10, 1),
    ),
  ),
  q(
    'J76-CHECK-Q3',
    2,
    N(
      [
        '五条有效记录 2、3、3、4、18，均值？',
        'Find the mean of five valid records 2,3,3,4,18.',
      ],
      '6',
      [
        '总和三十除五为六，不把十八擅删。',
        'Thirty divided by five is six; do not delete eighteen.',
      ],
      ['3', '18'],
    ),
  ),
  q(
    'J76-CHECK-Q4',
    3,
    S(
      [
        '两次独立公平转盘，每次L或R等可能，先后记两字母。列完整空间。',
        'Two independent fair spins each give L or R. List the ordered two-letter outcome space.',
      ],
      ['LL', 'LR', 'RL', 'RR'],
      [
        '首L配LL/LR，首R配RL/RR。',
        'First L gives LL/LR and first R gives RL/RR.',
      ],
      ['LL,LR,RR', 'L,R'],
    ),
  ),
  q(
    'J76-CHECK-Q5',
    3,
    N(
      [
        '独立公平硬币H/T与三等分1/2/3转盘，事件T2概率？',
        'For an independent fair H/T coin and equal-sector 1/2/3 spinner, find P(T2).',
      ],
      '1/6',
      [
        '六条等可能有序结果中一条T2。',
        'One T2 among six equally likely ordered outcomes.',
      ],
      ['1/5', '1/3'],
      true,
    ),
  ),
  q(
    'J76-CHECK-Q6',
    4,
    N(
      [
        '三红两蓝编号球等机会抽两次不放回，两蓝概率？',
        'Draw twice equally without replacement from three red and two blue numbered tokens. Find P(two blue).',
      ],
      '1/10',
      [
        '首蓝2/5、次蓝1/4，乘得2/20=1/10。',
        'First blue 2/5 times conditional 1/4 gives 1/10.',
      ],
      ['4/25', '2/5'],
      true,
    ),
  ),
  pick('J76-CHECK-Q7', 0, specs[0]!.pick),
  reasoning(
    'J76-CHECK-Q8',
    t(
      '分别给一个“样本不足以保证总体结论”和“类别不等可能”的反例；再用一条两步路径说明放回条件如何改变第二步。',
      'Give counterexamples to guaranteed population inference from a sample and to equal likelihood of named categories. Then show how replacement changes a second-step probability.',
    ),
    skills[4]!,
    t(
      '样本反例应明确总体、抽样框与覆盖缺口或随机变动；分布不能仅由均值代表，异常先核查不擅删。概率可用骰子和二一条、和七六条，基本空间36等可能而和类别不同权；或两红一蓝放回颜色路径4/9、2/9、2/9、1/9。路径例要写抽后剩余数量、分母以及首步乘条件，不放回两红1/3与放回4/9分开。家长检查假设和完整推理，不能按术语数量自动判。',
      'Specify population, frame and a coverage gap or random variability. A mean alone does not describe distribution, and unusual records need checking. For probability use dice sums two versus seven within thirty-six equal basics, or unequal replacement colour-path weights 4/9,2/9,2/9,1/9. A path must show remaining counts and denominators, multiplying first and conditional probabilities; two-red chances 1/3 without versus 4/9 with replacement differ. A parent checks assumptions and reasoning.',
    ),
    hints[4]!.map(T),
  ),
];
