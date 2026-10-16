import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  associationAliases,
  pairedCases,
  quartileCases,
  type Association,
} from '../researchModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  kind: 'number' | 'coordinate' | 'association' | 'proof-verdict' | 'explain';
  diagram?: Question['diagram'];
};
const N = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ stem, value, steps, wrong, kind: 'number', diagram });
const C = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
): Item => ({ ...N(stem, value, steps, wrong), kind: 'coordinate' });
const A = (
  stem: Pair,
  value: Association,
  steps: Pair[],
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ ...N(stem, value, steps, wrong, diagram), kind: 'association' });
const V = (stem: Pair, steps: Pair[]): Item => ({
  ...N(stem, 'insufficient', steps, ['sufficient', 'positive']),
  kind: 'proof-verdict',
});
const M = (stem: Pair, rubric: Pair): Item => ({
  ...N(stem, '', [rubric], []),
  kind: 'explain',
});
const skills = [
  'quartile-convention',
  'spread-evidence',
  'paired-association',
  'causal-evidence',
  'statistical-enquiry',
];
const hints: Pair[][] = [
  [
    [
      '先排序、保留重复，声明奇数时排除中位数的约定。',
      'Sort while retaining duplicates, stating the convention of excluding an odd middle observation.',
    ],
    [
      '整体中位数先求；Q1/Q3 分别是下半/上半中位数，IQR=Q3−Q1，不是最大减最小。',
      'Find the overall median first. Q1/Q3 are medians of the lower/upper halves; IQR=Q3−Q1, not max−min.',
    ],
  ],
  [
    [
      '先明确问典型值、极差还是中间一半的宽度。',
      'Identify whether the target is centre, range or the width of the middle half.',
    ],
    [
      '同尺度比较；极差=max−min，IQR=Q3−Q1。同中位数不保证同离散，指标结论可能不同。',
      'Use a common scale. Range=max−min, IQR=Q3−Q1. Equal medians do not ensure equal spread; measures may give different comparisons.',
    ],
  ],
  [
    [
      '一个编号的一行提供一个数对，缺失不填零。',
      'One identified row supplies one pair; missing is not zero.',
    ],
    [
      '看整体方向及是否弯曲；无明显线性关联不等于没有任何关系，散点不能单独证明因果。',
      'Inspect overall direction and curvature. No clear linear association does not mean no relationship, and scatter alone cannot prove causation.',
    ],
  ],
  [
    [
      '分清观察到的共同变化与改变一个量导致另一个量改变。',
      'Separate observed co-variation from changing one variable causing another to change.',
    ],
    [
      '考虑共同因素、反向关系和选择方式；随机抽样不等于随机分配处理。设计改进不是已经取得因果结论。',
      'Consider common causes, reverse direction and selection. Random sampling differs from random treatment assignment. A better design is not an obtained causal result.',
    ],
  ],
  [
    [
      '先写问题与范围，计划单位/记录/缺失，再核原卡后分析。',
      'State question and scope, plan units/records/missingness, then check sources before analysis.',
    ],
    [
      'PPDAC：问题、计划、数据、分析、结论。结论带数值、有效 n、缺失及局限；草稿须人工核验。',
      'PPDAC: Problem, Plan, Data, Analysis, Conclusion. Include evidence, observed n, missingness and limits; a person reviews the draft.',
    ],
  ],
];
function q(id: string, i: number, v: Item): Question {
  if (v.kind === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      T(v.steps[0]!),
      hints[i]!.map(T),
    );
  const answer: AnswerSpec =
    v.kind === 'association'
      ? { kind: 'association', value: v.value as Association }
      : v.kind === 'proof-verdict'
        ? { kind: 'proof-verdict', value: 'insufficient' }
        : { kind: v.kind, value: v.value };
  const accepted =
    v.kind === 'association'
      ? associationAliases[v.value as Association]
      : v.kind === 'proof-verdict'
        ? ['insufficient', '条件不足']
        : v.kind === 'coordinate'
          ? [v.value]
          : [v.value];
  return {
    ...numeric(
      id,
      T(v.stem),
      v.value,
      skills[i]!,
      hints[i]!.map(T),
      v.steps.map(T),
      { accepted, rejected: v.wrong },
      v.diagram,
    ),
    answer,
  };
}
const box = (values: string[], max = 12, min = 0): Question['diagram'] => ({
  kind: 'research-boxes',
  groups: [{ name: 'D', values }],
  min,
  max,
  step: 2,
});
const scatter = (i: number): Question['diagram'] => ({
  kind: 'research-scatter',
  records: pairedCases[i]!.records,
  xLabel: 'Practice / rounds',
  yLabel: 'Score / points',
});
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
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
const specs: Spec[] = [
  {
    title: ['四分位数和箱线图', 'Quartiles and box plots'],
    objective: [
      '按已声明的分半法计算五数概括并解释最小–最大须箱线图。',
      'Calculate a five-number summary under a stated halves convention and interpret min–max box plots.',
    ],
    prerequisites: ['P67-L01', 'J76-L02'],
    keywords: [
      ['四分位数', 'quartile'],
      ['五数概括', 'five-number summary'],
      ['四分位距', 'interquartile range'],
    ],
    lab: 'research-quartiles',
    hook: [
      '九个数里，中位数要不要加入两半？先写约定再算。',
      'Should the median of nine observations enter both halves? State the convention before calculating.',
    ],
    items: [
      N(
        [
          '虚构记录 9,2,4,4,5,7,8,1,6。奇数时排除整体中位数，求 Q1。',
          'Fictional records 9,2,4,4,5,7,8,1,6. Exclude the odd overall median and find Q1.',
        ],
        '3',
        [
          [
            '排序1,2,4,4,5,6,7,8,9，中位数5；下半1,2,4,4，中间2与4平均为3。',
            'Sort to 1,2,4,4,5,6,7,8,9, with median five. The lower half 1,2,4,4 has median (2+4)/2=3.',
          ],
        ],
        ['2', '4', '5'],
        box(quartileCases[0]!),
      ),
      N(
        [
          '同九个值 1,2,4,4,5,6,7,8,9，排除中位数，求 Q3。',
          'For 1,2,4,4,5,6,7,8,9, exclude the middle and find Q3.',
        ],
        '15/2',
        [
          [
            '上半6,7,8,9，中间7与8平均为15/2。',
            'The upper half 6,7,8,9 has median (7+8)/2=15/2.',
          ],
        ],
        ['7', '8', '5'],
      ),
      N(
        [
          '八个值 1,2,4,4,5,6,7,8 的整体中位数是多少？',
          'Find the overall median of eight values 1,2,4,4,5,6,7,8.',
        ],
        '9/2',
        [
          [
            '第四4与第五5平均为9/2；偶数样本没有单独中心观察。',
            'Average fourth value four and fifth value five, giving 9/2; no single centre record is removed.',
          ],
        ],
        ['4', '5', '3'],
        box(quartileCases[1]!),
      ),
      N(
        [
          '九个值的 Q1=3、Q3=15/2，求 IQR。',
          'Nine observations have Q1=3 and Q3=15/2. Find IQR.',
        ],
        '9/2',
        [
          [
            '15/2−3=9/2，是箱长，不是全体极差8。',
            '15/2-3=9/2 is the box length, not the full range eight.',
          ],
        ],
        ['8', '15/2', '3'],
      ),
      N(
        [
          '数据 −2,−1/2,0,1/2,2，排除中位数，求 Q1。',
          'For -2,-1/2,0,1/2,2, exclude the middle and find Q1.',
        ],
        '-5/4',
        [
          [
            '下半−2与−1/2平均为−5/4，负号不能省。',
            'The lower half -2,-1/2 averages to -5/4; retain the sign.',
          ],
        ],
        ['-2', '-1/2', '5/4'],
        box(quartileCases[3]!, 4, -4),
      ),
      N(
        [
          '1,2,3,4,5 排除中位数后求 Q1。',
          'Exclude the middle of 1,2,3,4,5 and find Q1.',
        ],
        '3/2',
        [
          [
            '去掉中心3；下半1,2的中位数3/2。',
            'Exclude centre three; lower half 1,2 has median 3/2.',
          ],
        ],
        ['2', '3', '1'],
      ),
    ],
    pick: {
      stem: [
        '关于本课箱线图，哪项正确？',
        'Which statement matches this lesson’s box plots?',
      ],
      options: [
        ['须一定在 1.5×IQR 处截断', 'Whiskers always stop at 1.5×IQR'],
        [
          'Q1 到 Q3 是箱，须到最小最大；先声明分半约定',
          'The box spans Q1–Q3, whiskers min–max; state the halves convention',
        ],
        [
          '每段越长就代表人数越多',
          'Longer segments always contain more observations',
        ],
      ],
      feedback: [
        [
          '这里采用最小–最大须；离群截须是另一规则。',
          'This lesson uses min–max whiskers; outlier whiskers are another rule.',
        ],
        [
          '正确；数轴距离与记录数量分开。',
          'Correct: numerical distance is distinct from observation count.',
        ],
        [
          '段长表示数值跨度；重复与有限样本使精确人数比例需另核。',
          'Length shows numerical span; ties and finite samples require checking actual counts.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释为什么先声明四分位数约定，并说明重复记录与箱长不能如何误读。',
      'Explain why the quartile convention comes first, and how to avoid misreading duplicates and box length.',
    ],
    rubric: [
      '用1,2,3,4,5演示排除法Q1=3/2、包含法Q1=2；这不是算术矛盾。保留重复值和负号，五数顺序正确。最小最大须与1.5×IQR截须分开；箱长表示数值宽度，不能由四段长度判断各段人数，有限样本与重复值未必恰好各25%。',
      'For 1,2,3,4,5 show Q1=3/2 with exclusion and Q1=2 with inclusion: a convention difference, not an arithmetic contradiction. Retain duplicates and signs, order the five numbers, distinguish min–max from 1.5×IQR whiskers, and explain that segment lengths show numerical spans. Finite samples/ties need not put exactly 25% in each segment.',
    ],
    misconception: [
      '把中位数分半约定藏起来，或把箱长当人数。',
      'Hiding the halves convention or treating box length as count.',
    ],
    prompts: [
      ['你把整体中位数放在哪里？', 'Where did the overall median go?'],
      ['两个四还都是记录吗？', 'Do both fours remain records?'],
    ],
  },
  {
    title: ['波动与离散程度', 'Variability and spread'],
    objective: [
      '用同尺度、极差与 IQR 比较中心相近的数据，给出有指标边界的结论。',
      'Compare similarly centred data using a common scale, range and IQR, stating which measure supports the conclusion.',
    ],
    prerequisites: ['J88-L01', 'J76-L02', 'J76-L03'],
    keywords: [
      ['极差', 'range'],
      ['离散程度', 'spread'],
      ['稳定性', 'consistency'],
    ],
    lab: 'research-spread',
    hook: [
      '同样的中位数五，能藏着多不同的分布？',
      'How different can two distributions be while sharing median five?',
    ],
    items: [
      N(
        [
          'A=4,4,5,5,5,5,6,6,6，排除中位数法，求 IQR。',
          'A=4,4,5,5,5,5,6,6,6. Exclude the middle and find IQR.',
        ],
        '3/2',
        [
          [
            '下半4,4,5,5给Q1=9/2；上半5,6,6,6给Q3=6；差3/2。',
            'Lower half 4,4,5,5 gives Q1=9/2; upper half 5,6,6,6 gives Q3=6, so IQR=3/2.',
          ],
        ],
        ['2', '5', '1'],
      ),
      N(
        [
          'B=0,1,2,4,5,6,8,9,10，排除中位数，求 IQR。',
          'For B=0,1,2,4,5,6,8,9,10, exclude the middle and find IQR.',
        ],
        '7',
        [
          [
            'Q1=(1+2)/2=3/2，Q3=(8+9)/2=17/2，相减七。',
            'Q1=3/2 and Q3=17/2, giving difference seven.',
          ],
        ],
        ['10', '5', '8'],
      ),
      N(
        [
          'A=4,4,5,5,5,5,6,6,6，求极差。',
          'Find the range of A=4,4,5,5,5,5,6,6,6.',
        ],
        '2',
        [
          [
            '最大六减最小四等二，不是中位数。',
            'Maximum six minus minimum four is two, distinct from the median.',
          ],
        ],
        ['5', '3/2', '6'],
      ),
      N(
        [
          '只把 A 最后一条6改为30，得到4,4,5,5,5,5,6,6,30。求极差。',
          'Change only A’s final six to thirty: 4,4,5,5,5,5,6,6,30. Find the range.',
        ],
        '26',
        [
          [
            '三十减四等二十六，九条记录仍全部保留。',
            'Thirty minus four is twenty-six, with all nine records retained.',
          ],
        ],
        ['30', '2', '25'],
      ),
      N(
        [
          '同改动后 A=4,4,5,5,5,5,6,6,30，排除中位数，求 IQR。',
          'For changed A=4,4,5,5,5,5,6,6,30, exclude the middle and find IQR.',
        ],
        '3/2',
        [
          [
            'Q1仍9/2、Q3仍6，差仍3/2；只说明本次改动。',
            'Q1 remains 9/2 and Q3 remains six, so IQR is still 3/2; this statement concerns this change.',
          ],
        ],
        ['26', '30', '0'],
      ),
      N(
        [
          '一组数据的极差2，全部值各加4，新的极差是多少？',
          'A data set has range two. Add four to every value. What is its new range?',
        ],
        '2',
        [
          [
            '最大最小都加四，相减抵消；整体平移不改跨度。',
            'Maximum and minimum both gain four, so the difference stays two.',
          ],
        ],
        ['6', '8', '4'],
      ),
    ],
    pick: {
      stem: [
        '两组中位数同为五，能确定什么？',
        'Two groups both have median five. What follows?',
      ],
      options: [
        [
          '仍要比较离散度，不能说每条都一样',
          'Spread still needs comparison; individual values need not match',
        ],
        ['两组极差一定相同', 'Their ranges must match'],
        ['两组每个值都等于五', 'Every value must equal five'],
      ],
      feedback: [
        [
          '正确，中心与波动回答不同问题。',
          'Correct: centre and spread answer different questions.',
        ],
        ['中位数没有固定最大最小。', 'A median does not fix the extrema.'],
        ['中位数不是每一条记录。', 'A median is not every observation.'],
      ],
      correct: 0,
    },
    reason: [
      '改动后 A 的极差26大于 B 的10，IQR却3/2小于 B 的7。如何准确比较？',
      'After the change A’s range 26 exceeds B’s 10 but its IQR 3/2 is below B’s 7. Compare accurately.',
    ],
    rubric: [
      '同时指出两组中位数五；按极差A全跨度更大，按IQR A中间分布更集中。保留A的30并说明查来源，不能删到喜欢的答案。用同数轴、同单位和已述分半法；“更稳定”需限定指标，IQR较不受此尾值影响不等于永不受异常影响，更不能推所有未来情况。',
      'Both medians are five. A spans farther by range but has a tighter central spread by IQR. Retain thirty and check its source rather than deleting to favour a claim. Use common units/scale and the stated convention. Define “more consistent” by a measure; resistance to this tail change does not make IQR immune to every unusual value or prove all future behaviour.',
    ],
    misconception: [
      '只比较均值/中位数就判全部一样，或把 IQR 当永不变化。',
      'Declaring distributions equal from their centres, or assuming IQR can never change.',
    ],
    prompts: [
      [
        '你说稳定，依据的是哪一种宽度？',
        'Which width supports your consistency claim?',
      ],
      [
        '三十是抄错还是有效观察，凭什么？',
        'Is thirty a transcription error or a valid observation, and what is the evidence?',
      ],
    ],
  },
  {
    title: ['双变量散点图', 'Bivariate scatter plots'],
    objective: [
      '按同一记录配对作散点，描述方向和形状并保留缺失及推断边界。',
      'Plot paired records and describe direction and shape while retaining missingness and limits.',
    ],
    prerequisites: ['J75-L02', 'J76-L01'],
    keywords: [
      ['双变量', 'bivariate'],
      ['散点图', 'scatter plot'],
      ['关联', 'association'],
    ],
    lab: 'research-scatter',
    hook: [
      '打乱其中一列，还是同一批点吗？',
      'If one column is shuffled, are these still the same paired observations?',
    ],
    items: [
      A(
        [
          '虚构完整数对 (1,2),(2,3),(3,2),(4,5),(5,5)，第六条 y 缺失。图的整体方向是什么？',
          'Complete fictional pairs are (1,2),(2,3),(3,2),(4,5),(5,5), with the sixth y missing. Describe the overall direction.',
        ],
        'positive',
        [
          [
            '整体向右向上，局部下降不取消正向趋势；缺失不画零点。',
            'The overall trend rises rightward despite a local decline; missing does not create a zero point.',
          ],
        ],
        ['negative', 'curved', 'no-clear-linear'],
        scatter(0),
      ),
      C(
        [
          '同一行 P3 的练习轮数 x=3、得分 y=2，写 (x,y)。',
          'Record P3 has practice x=3 and score y=2. Write (x,y).',
        ],
        '(3,2)',
        [
          [
            '同编号同行配对，先x后y；不能取P2的y=3。',
            'Pair the same identified row, x before y; do not borrow P2’s y=3.',
          ],
        ],
        ['(2,3)', '(3,3)'],
      ),
      A(
        [
          '观察这些数对 (1,8),(2,6),(3,7),(4,3),(5,2)，描述整体方向。',
          'Describe the overall direction of (1,8),(2,6),(3,7),(4,3),(5,2).',
        ],
        'negative',
        [
          [
            '整体向右向下，二到三的局部上升不改变总体描述。',
            'The overall pattern falls rightward despite a local rise from x=2 to three.',
          ],
        ],
        ['positive', 'curved'],
        scatter(1),
      ),
      A(
        [
          '图为 (1,2),(1,6),(3,2),(3,6),(5,2),(5,6)。按所见描述线性方向。',
          'For (1,2),(1,6),(3,2),(3,6),(5,2),(5,6), describe the visible linear direction.',
        ],
        'no-clear-linear',
        [
          [
            '上下成对均衡，未见明显向上或向下线性趋势；不是证明绝无关系。',
            'Balanced high/low pairs show no clear rising/falling linear trend; that does not prove no relationship.',
          ],
        ],
        ['positive', 'negative', 'curved'],
        scatter(2),
      ),
      A(
        [
          '图为 (1,9),(2,4),(3,1),(4,0),(5,1),(6,4),(7,9)。描述整体形状。',
          'Describe the overall shape of (1,9),(2,4),(3,1),(4,0),(5,1),(6,4),(7,9).',
        ],
        'curved',
        [
          [
            '先降后升呈U形，有明显非线性关系；不能写没有任何关联。',
            'The U shape falls then rises: a clear nonlinear relationship, not absence of all association.',
          ],
        ],
        ['positive', 'negative', 'no-clear-linear'],
        scatter(3),
      ),
      N(
        [
          '六行记录中仅第六行 y 缺失，能画多少完整数对？',
          'Six rows have only the sixth y missing. How many complete pairs can be plotted?',
        ],
        '5',
        [
          [
            '六减一为五；缺失行仍列在表中。',
            'Six minus one gives five; retain the incomplete row in the table.',
          ],
        ],
        ['6', '0', '1'],
      ),
    ],
    pick: {
      stem: ['哪种散点制作方式正确？', 'Which scatter-plot method is valid?'],
      options: [
        ['两列分别排序后再配对', 'Sort each column independently, then pair'],
        ['按编号先后把点全部连线', 'Join every point in record order'],
        [
          '同一编号配一对，缺失保留且不补零点',
          'Pair within each ID and retain missingness without zero imputation',
        ],
      ],
      feedback: [
        [
          '分别排序会破坏原数对。',
          'Independent sorting destroys the original pairs.',
        ],
        [
          '记录编号不是连续时间，连线会额外暗示路径。',
          'Record IDs are not continuous time; joining suggests an unsupported path.',
        ],
        [
          '正确，配对身份比视觉整齐重要。',
          'Correct: paired identity matters more than visual neatness.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '解释为何不能把两列分别排序再画散点，并区分 U 形关系与没有明显线性趋势。',
      'Explain why columns cannot be sorted separately, and distinguish a U-shaped relationship from no clear linear trend.',
    ],
    rubric: [
      '举同一记录(3,2)保持x先y后，说明分列排序会把不同记录拼一起。每点为完整数对，缺失不补零，编号不连线路径。方向描述整体、允许例外；U形有非线性关系，无明显线性关联不等于完全无关，也不证明因果或总体规律。',
      'Use a same-record pair such as (3,2), keeping x first. Sorting columns separately joins different records. Plot complete pairs only, retain missingness, and do not join ID order. Describe overall direction with exceptions. A U shape is nonlinear; no clear linear association does not mean no relationship, establish causation or prove a population rule.',
    ],
    misconception: [
      '破坏配对，或把无直线趋势等同完全无关。',
      'Destroying pair identity or equating no linear trend with no relationship.',
    ],
    prompts: [
      [
        '这个点的两个数来自同一条吗？',
        'Do both coordinates come from one record?',
      ],
      [
        '向上是否必须每一步都上升？',
        'Must every consecutive point rise for a positive overall pattern?',
      ],
    ],
  },
  {
    title: ['相关不等于因果', 'Correlation is not causation'],
    objective: [
      '识别观察相关不能单独支持因果，提出共同因素、反向关系与改进设计。',
      'Explain why observational association alone does not support causation and propose common factors, reverse direction and better designs.',
    ],
    prerequisites: ['J88-L03', 'J76-L01'],
    keywords: [
      ['因果', 'causation'],
      ['混杂因素', 'confounder'],
      ['随机分配', 'random assignment'],
    ],
    lab: 'research-cause',
    hook: [
      '晴天零食与租车都增加，零食真是租车的原因吗？',
      'If snacks and bike rentals both rise on warmer days, are snacks the cause?',
    ],
    items: [
      M(
        [
          '虚构八天零食与租车散点整体向上，但凉/暖各组内均无同样上升。解释为何不能断言零食导致租车。',
          'Pooled fictional snack/rental data rise, but cool/warm groups lack the same trend. Explain why snacks cannot be declared the cause.',
        ],
        [
          '天气可能同时影响两者；合并趋势可能来自组间差别。观察相关未控制其他差异或排除反向/选择因素，不能只由图推因果；也不能声称已经证明天气唯一致因。',
          'Weather could influence both; the pooled trend may reflect group differences. Observational association has not controlled other differences or excluded reverse/selection explanations. It proves neither snacks cause rentals nor weather is the sole cause.',
        ],
      ),
      V(
        [
          '仅凭这八天观察相关，是否足以证明零食导致租车？',
          'Are these eight observed days alone sufficient to prove snacks cause rentals?',
        ],
        [
          [
            '条件不足；同向是描述，不是干预证据。',
            'Insufficient: a co-trend describes association, not intervention evidence.',
          ],
        ],
      ),
      V(
        [
          '随机抽取更多天观察，未随机安排零食处理，能仅据此证明因果吗？',
          'Randomly sample more observed days without randomly assigning a snack treatment. Is that alone sufficient for causation?',
        ],
        [
          [
            '随机抽样有助覆盖/代表性，不会自动排除共同因素；与随机分配不同。',
            'Random sampling helps coverage/representation but does not automatically remove confounding; it differs from random assignment.',
          ],
        ],
      ),
      M(
        [
          '观察到湿路面与雨伞同时多，有人说伞导致路湿。提出更合理方向及仍需何种证据。',
          'Wet roads and umbrellas appear together. Someone says umbrellas wet the road. Offer a more plausible direction and explain the evidence limit.',
        ],
        [
          '下雨可能造成路湿并促使人用伞，是共同原因/反向解释的候选；仅观察到相关不证明该解释全部正确，也不能把伞→雨写成已证。需时间顺序、天气记录与设计支持。',
          'Rain could wet roads and prompt umbrella use: a candidate common cause/reverse explanation. The correlation alone does not fully prove that story or establish umbrellas cause rain. Seek time order, weather records and an appropriate design.',
        ],
      ),
      M(
        [
          '设计纸片折法 A/B 对距离影响的更强检验。随机分配和随机抽样分别解决什么？',
          'Design stronger evidence for fold A/B effects on card-slide distance. Distinguish random assignment from random sampling.',
        ],
        [
          '在可行条件下随机分配相似纸片到折法，固定桌面/释放位置/测量方法，重复并记录全部结果与缺失，比较差异与随机波动。分配帮助因果辨别，抽样帮助推广范围；有限实验仍有不确定性，选设计不是已经有结论。',
          'Where feasible randomly assign comparable cards to folds, standardise desk/release/measurement, replicate and retain all results/missingness. Compare differences with random variation. Assignment helps causal discrimination; sampling helps scope. Finite experiments retain uncertainty, and proposing one is not obtaining its result.',
        ],
      ),
      M(
        [
          '朋友说“正相关就一定是前者导致后者”，用共同因素与证据设计修正这句话。',
          'Correct “positive correlation always means the first causes the second” using a common factor and evidence design.',
        ],
        [
          '用天气同时影响零食/租车作候选反例，说明相关方向不能确定因果方向。提出可行随机分配/共同条件/重复/时间顺序，保留范围和随机波动；不把条件不足说成已证绝无因果。',
          'Use weather potentially influencing snacks/rentals as a counterexample. Association direction does not identify causal direction. Propose feasible assignment, common conditions, replication and timing, retaining scope/variation; insufficient evidence does not prove no causal effect.',
        ],
      ),
    ],
    pick: {
      stem: ['哪项区别最准确？', 'Which distinction is accurate?'],
      options: [
        [
          '随机抽样自动证明因果',
          'Random sampling automatically proves causation',
        ],
        [
          '随机抽样关乎覆盖，随机分配处理有助因果辨别',
          'Random sampling concerns coverage; random assignment helps causal discrimination',
        ],
        [
          '图越接近直线因果越确定',
          'The straighter the plot, the more certain causation',
        ],
      ],
      feedback: [
        [
          '抽样没有随机改变解释变量。',
          'Sampling does not randomly manipulate the explanatory variable.',
        ],
        [
          '正确，还需设计、结果、不确定性与适用范围。',
          'Correct, alongside design, results, uncertainty and scope.',
        ],
        [
          '强关联也可能有共同因素。',
          'Even strong association can have common causes.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '审查“更多观察点、画更直的线、按天气分组”是否各自足以证明因果。',
      'Audit whether more observational points, a straighter line or weather stratification alone proves causation.',
    ],
    rubric: [
      '更多点可能减少部分波动但不自动消除系统差异；更直仍可能混杂；按天气分组能检共同因素但仍可能有其他未控制因素。不能保证分组后一定出现同样或相反趋势。改进因果设计要区分随机抽样/随机分配、固定条件、重复和记录；不把未证因果说成因果不存在。',
      'More points may reduce some variation without removing systematic differences; a straighter line may remain confounded; stratification checks a candidate factor without controlling everything. It need not always yield matching or reversed trends. Distinguish sampling/assignment, common conditions, replication and records; unproven causation does not mean absent causation.',
    ],
    misconception: [
      '把相关强度或随机抽样误当干预证据。',
      'Treating correlation strength or random sampling as intervention evidence.',
    ],
    prompts: [
      [
        '还有什么可能同时影响这两个量？',
        'What could influence both variables?',
      ],
      [
        '谁被随机分配了什么处理？',
        'Who or what was randomly assigned which treatment?',
      ],
    ],
  },
  {
    title: ['小型数据调查', 'Mini data investigation'],
    objective: [
      '完成有范围、来源核查、双语数值证据与局限说明的 PPDAC 小调查。',
      'Complete a PPDAC investigation with scope, source checks, numerical evidence and explicit limitations.',
    ],
    prerequisites: ['J88-L01', 'J88-L02', 'J88-L03', 'J88-L04'],
    keywords: [
      ['统计调查循环', 'statistical enquiry cycle'],
      ['缺失记录', 'missing record'],
      ['证据结论', 'evidence-based conclusion'],
    ],
    lab: 'research-investigate',
    hook: [
      '原卡七抄成二十七，还能先画图再决定删不删吗？',
      'If seven was transcribed as twenty-seven, should a preferred graph decide whether to remove it?',
    ],
    items: [
      M(
        [
          '为十二张虚构纸片距离卡写可回答的问题与单位；A/B 来自不同桌面、未随机分配。',
          'Write an answerable question and units for twelve fictional distance cards; A/B came from different desks without random assignment.',
        ],
        [
          '可问“在这批记录中，A/B折法的典型下滑距离及波动怎样比较？”说明cm、记录群体与本批范围，不问所有纸片必然最好。先计划同方法记录、编号、缺失和查来源；现有观察不能把桌面差异排除。',
          'Ask how typical recorded slide distances and spread compare between A/B within these records. State cm, units of observation and scope; do not ask which must be best for all cards. Plan common recording, IDs, missingness and source checks. These observations do not remove desk differences.',
        ],
      ),
      N(
        [
          '十二条记录只有 A5 缺失，缺失条数是多少？',
          'Of twelve records only A5 is missing. How many records are missing?',
        ],
        '1',
        [
          [
            '缺失保留一个空值，不补零，也不把总记录数改为十一。',
            'Retain one missing entry; do not replace it by zero or erase its row.',
          ],
        ],
        ['0', '11', '12'],
      ),
      N(
        [
          '按原卡纠正后 A 的已知距离 4,5,5,6,7 cm，A5仍缺失。求已知值中位数，只填数。',
          'After source correction, A has observed distances 4,5,5,6,7 cm and A5 remains missing. Find its observed median, number only.',
        ],
        '5',
        [
          [
            '五个有效值第三个五，不能把缺失计零。',
            'The third of five observed values is five; missing does not count as zero.',
          ],
        ],
        ['9/2', '6', '27'],
      ),
      N(
        [
          'B=3,4,4,5,5,6 cm，求中位数，只填数。',
          'B=3,4,4,5,5,6 cm. Find the median, number only.',
        ],
        '9/2',
        [
          [
            '第三四与第四五平均为9/2；B有效n=6。',
            'Average third value four and fourth five to get 9/2; B has observed n=6.',
          ],
        ],
        ['4', '5', '3'],
      ),
      M(
        [
          'A6 录为27，原卡明确7；A5缺失。说明应如何处理并记录理由。',
          'A6 was entered as 27 while its source card says seven; A5 is missing. Explain the handling and audit record.',
        ],
        [
          '据原卡将A6由27纠正7并记录编号、原值、新值与来源，保留这条观察。A5仍缺失、总行数12、有效A五/B六。不因大就删，不臆造缺失；若原卡确认27就应保留并讨论而非强改7。',
          'Correct A6 from 27 to seven against its source, logging ID, old/new values and evidence while retaining the observation. A5 remains missing; twelve rows, five observed A and six B. Do not delete for size or invent missingness; if a source verified 27, retain and discuss it rather than forcing seven.',
        ],
      ),
      M(
        [
          '纠正后 A：中位数5、IQR2、n5、缺失1；B：中位数9/2、IQR1、n6、缺失0。写一条有范围和局限的结论。',
          'Corrected A: median five, IQR two, n five, one missing; B: median 9/2, IQR one, n six, none missing. Write a scoped conclusion with limitations.',
        ],
        [
          '这批已知值中A典型距离较大但中间分布更散；同时写cm和统计量，A/B有效n=5/6、缺失1/0及A6来源更正。桌面不同、非随机分配，不能只归因折法或推广全部纸片；缺失可能影响比较，提出同条件随机分配和更多记录为后续。',
          'Within these observed records A has a larger typical distance but a wider central spread. Give cm and summaries, n=5/6, missing=1/0 and the A6 source correction. Different desks and no random assignment prevent attributing this solely to fold or generalising to all cards. Missingness may affect comparison; propose common conditions, random assignment and more records.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪个顺序符合统计调查循环？',
        'Which order follows the statistical enquiry cycle?',
      ],
      options: [
        [
          '先选结论，再删除不符数据',
          'Choose the conclusion then delete inconvenient data',
        ],
        [
          '问题→计划→数据→分析→结论，并可返回修正',
          'Problem→Plan→Data→Analysis→Conclusion, revisiting as needed',
        ],
        ['只画一张图便完成调查', 'A single graph completes the investigation'],
      ],
      feedback: [
        [
          '结论应由证据约束，不为结论筛数据。',
          'Evidence constrains the conclusion, not vice versa.',
        ],
        [
          '正确，迭代不等于跳过来源与范围。',
          'Correct: iteration does not skip sources or scope.',
        ],
        [
          '还要问题、计划、来源和局限。',
          'Question, plan, sources and limits remain necessary.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用本批记录解释 PPDAC 各步如何相连，报告至少一个能答与一个不能答的问题。',
      'Connect the PPDAC stages using these records, naming one answerable and one unsupported question.',
    ],
    rubric: [
      '问题限定本批A/B典型距离及波动；计划统一cm/同方法/编号/缺失；数据据原卡纠错不删偏好值；分析用共同轴、已述四分位约定、n5/6、中位数5与9/2、IQR2与1。结论比较本批并保留缺失及桌面混杂，不能回答所有纸片哪种折法必然最好或证明折法因果。草稿导出不等于人工通过。',
      'Scope the question to these A/B centres/spread; plan cm, methods, IDs and missingness; correct data by source rather than preference; analyse with a common axis, stated quartiles, n=5/6, medians 5 and 9/2 and IQRs 2 and 1. Conclude about these records with missingness and desk confounding, not a universal best fold or proven fold causation. Export is not human approval.',
    ],
    misconception: [
      '把缺失当零、无依据删异常、从小样本直接推广或归因。',
      'Treating missing as zero, deleting without evidence, or generalising/attributing directly from a small sample.',
    ],
    prompts: [
      [
        '这句话回答的是原来那个问题吗？',
        'Does the conclusion answer the original question?',
      ],
      ['数据还不能支持哪一种主张？', 'Which claim remains unsupported?'],
    ],
  },
];
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const j88Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J88-L0${i + 1}`;
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
    unit: 'J88',
    order: i + 1,
    nzYearHints: [8, 9, 10],
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
            '用纸笔或调查工作台对十二张虚构卡完成PPDAC；记A6原卡7/录入27的更正、A5缺失、A/B有效条数。用同数轴箱线图与原记录比较，写带中位数、IQR、单位和局限的报告，家长核原数据与结论。可下载本地草稿，不代表自动通过；不要求真实招募、个人资料、购买或上传。',
            'Use paper or the investigation workshop to complete PPDAC on the twelve fictional cards. Record the A6 source-seven/entry-27 correction, missing A5 and observed group counts. Compare common-axis boxes with raw records; write medians, IQRs, units and limits. A parent checks evidence. Downloading a local draft is not automatic approval. No real recruitment, personal data, purchases or uploads are required.',
          ),
        }
      : {}),
  };
});
export function j88ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J88-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J88 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    o = (k % 7) - 3,
    s = (k % 5) + 1;
  let item: Item;
  if (i === 0) {
    const upper = k % 2 === 1;
    item = N(
      [
        `数据${[1, 2, 3, 4, 5, 6, 7].map((n) => n + o).join(',')}，排除中位数，求${upper ? 'Q3' : 'Q1'}。`,
        `For ${[1, 2, 3, 4, 5, 6, 7].map((n) => n + o).join(',')}, exclude the middle and find ${upper ? 'Q3' : 'Q1'}.`,
      ],
      String((upper ? 6 : 2) + o),
      [
        [
          '七个排序值排除第四个，两半各三条，分别取第二条。',
          'Exclude the fourth of seven ordered values; each half has three, whose second is its median.',
        ],
      ],
      [String(o + 4)],
    );
  } else if (i === 1) {
    const range = k % 2 === 0;
    item = N(
      [
        `数据${[1, 2, 3, 4, 5].map((n) => n * s + o).join(',')}，排除中位数，求${range ? '极差' : 'IQR'}。`,
        `For ${[1, 2, 3, 4, 5].map((n) => n * s + o).join(',')}, exclude the middle and find ${range ? 'range' : 'IQR'}.`,
      ],
      String((range ? 4 : 3) * s),
      [
        [
          '极差用最大减最小，IQR用两半中位数之差；整体平移不改二者。',
          'Range uses extrema; IQR uses half medians. Translation changes neither.',
        ],
      ],
      [String(5 * s)],
    );
  } else if (i === 2) {
    const c = pairedCases[k % 4]!,
      records = c.records.map((r) => ({
        ...r,
        x: String(Number(r.x) + (k % 3)),
        y: r.y === null ? null : String(Number(r.y) + (k % 2)),
      }));
    item = A(
      [
        '按本图描述整体方向或形状，不作因果推断。',
        'Describe this plot’s overall direction or shape without causal inference.',
      ],
      c.pattern,
      [
        [
          '每条数对整体平移不改相对方向/形状；仍保配对与缺失。',
          'Translating all pairs preserves relative direction/shape and paired identity/missingness.',
        ],
      ],
      [c.pattern === 'positive' ? 'negative' : 'positive'],
      { kind: 'research-scatter', records },
    );
  } else if (i === 3)
    item = M(
      k % 2 === 0
        ? [
            '用共同因素解释为何观察相关不足以推出因果，再提出更强证据。',
            'Use a common factor to explain why observed association is insufficient for causation, then propose stronger evidence.',
          ]
        : [
            '解释随机抽样与随机分配处理的区别，为什么选择一个实验设计还不是得到结论。',
            'Distinguish random sampling from random treatment assignment, and explain why selecting a design is not obtaining a result.',
          ],
      specs[3]!.rubric,
    );
  else if (k % 4 === 0) item = M(specs[4]!.reason, specs[4]!.rubric);
  else {
    const a = k % 2 === 0,
      values = (a ? [4, 5, 5, 6, 7] : [3, 4, 4, 5, 5, 6]).map((n) => n + o);
    item = N(
      [
        `虚构${a ? 'A' : 'B'}组已知值${values.join(',')}，另有${a ? 1 : 0}条缺失。求已知值中位数，不补零。`,
        `Fictional group ${a ? 'A' : 'B'} has observed values ${values.join(',')} and ${a ? 1 : 0} missing. Find the observed median without imputing zero.`,
      ],
      a ? String(5 + o) : String(4.5 + o),
      [
        [
          '按有效记录排序取中位数，报告缺失不改变为零。',
          'Find the median among observed values and report missingness without making it zero.',
        ],
      ],
      [String(100 + o)],
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const j88CheckQuestions: Question[] = [
  q(
    'J88-CHECK-Q1',
    0,
    N(
      [
        '2,4,6,8,10 排除中位数，求 IQR。',
        'For 2,4,6,8,10, exclude the middle and find IQR.',
      ],
      '6',
      [
        [
          'Q1=3、Q3=9，差六；极差八是另一量。',
          'Q1=3 and Q3=9 give six; range eight is a different measure.',
        ],
      ],
      ['8', '3', '9'],
    ),
  ),
  q(
    'J88-CHECK-Q2',
    1,
    N(
      ['3,3,4,4,20 的极差是多少？', 'Find the range of 3,3,4,4,20.'],
      '17',
      [
        [
          '最大二十减最小三，得十七；保留重复与大值。',
          'Twenty minus three is seventeen; retain duplicates and the large value.',
        ],
      ],
      ['20', '4', '1'],
    ),
  ),
  q(
    'J88-CHECK-Q3',
    2,
    C(
      [
        '同一条 R2 记录 x=4、y=7，写 (x,y)。',
        'Record R2 has x=4 and y=7. Write (x,y).',
      ],
      '(4,7)',
      [['同一行先x后y，不交换坐标。', 'Keep the same row, x before y.']],
      ['(7,4)', '(4,4)'],
    ),
  ),
  q(
    'J88-CHECK-Q4',
    2,
    A(
      [
        '描述图中整体形状；不以一条直线概括 U 形。',
        'Describe the plot’s overall shape; do not force a U shape into a straight-line description.',
      ],
      'curved',
      [
        [
          '先降后升的弯曲关联，不是没有任何关系。',
          'Falling then rising is a curved association, not absence of any relationship.',
        ],
      ],
      ['positive', 'negative', 'no-clear-linear'],
      scatter(3),
    ),
  ),
  q(
    'J88-CHECK-Q5',
    3,
    V(
      [
        '零食与租车八天观察同向，且未控制天气；这些证据是否充分证明零食致租车？',
        'Snacks/rentals co-vary in eight observed days without controlling weather. Is this sufficient to prove snacks cause rentals?',
      ],
      [
        [
          '条件不足；可能共同天气，样本相关不能单独推出干预因果。',
          'Insufficient: shared weather could explain the observational association.',
        ],
      ],
    ),
  ),
  q(
    'J88-CHECK-Q6',
    4,
    M(
      [
        '解释 A5 缺失、A6 原卡7但录为27时应如何保留、纠错和报告有效条数。',
        'Explain retention, correction and observed counts when A5 is missing and A6’s source is seven but its entry 27.',
      ],
      specs[4]!.items[4]!.steps[0]!,
    ),
  ),
  pick('J88-CHECK-Q7', 0, specs[0]!.pick),
  reasoning(
    'J88-CHECK-Q8',
    t(
      '为本批纸片卡写有数值与边界的 PPDAC 报告提纲，区分描述与因果。',
      'Outline a numerically supported, scoped PPDAC report for these card records, distinguishing description from causation.',
    ),
    skills[4]!,
    T(specs[4]!.rubric),
    hints[4]!.map(T),
  ),
];
