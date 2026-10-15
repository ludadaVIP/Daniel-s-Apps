import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
type Item = {
  stem: Pair;
  value: string;
  steps: Pair;
  wrong: string[];
  set?: string[];
  unit?: Unit;
  diagram?: Question['diagram'];
};
type Pick = {
  stem: Pair;
  correct: number;
  options: { text: Pair; feedback: Pair }[];
  steps: Pair;
};
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  lab: Lesson['lab'];
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'median-and-all-modes',
  'summary-purpose',
  'likelihood-assumptions',
  'finite-event-probability',
  'frequency-versus-probability',
];
const hints: Pair[][] = [
  [
    [
      '中位数先保留全部记录并排序，众数另查每个值的出现次数。',
      'Retain every observation and order them for the median; count repetitions separately for mode.',
    ],
    [
      '偶数条取中间两数平均。并列最高且重复的众数全部写；所有值只出现一次时本课记无众数，不写零。',
      'For an even count average the middle two. Report every tied highest repeated mode; all-singleton data have no mode here, not mode zero.',
    ],
  ],
  [
    [
      '先问要描述中间位置、分摊总量，还是最常见类别。',
      'Decide whether the question asks for a middle position, a share of the total or the common category.',
    ],
    [
      '平均数=完整总量÷记录数，中位数按排序位置，众数按最高频数。较大观察值不能无故删除。',
      'Mean is full total divided by count; median uses ordered positions and mode uses highest frequency. Do not silently delete a large observation.',
    ],
  ],
  [
    [
      '先说明理想随机机制，检查扇区大小及事件包含哪些结果。',
      'State the ideal random mechanism, inspect sector sizes and identify the outcomes in the event.',
    ],
    [
      '等扇区不一定等字母；重复字母合并。空事件概率零，覆盖全部结果概率一，其余可能但不必然。',
      'Equal sectors do not necessarily give equally likely letters; combine repeats. Empty events have probability zero, all outcomes probability one, and other events are possible but uncertain.',
    ],
  ],
  [
    [
      '数所有等可能对象，再数符合事件的对象；条件是每个对象等可能。',
      'Count all equally likely objects, then the favourable ones. The equal-likelihood condition applies to individual objects.',
    ],
    [
      'P=有利对象数÷全部对象数。复合事件合并不重叠类别；概率是无单位比例，不是次数。',
      'P is favourable objects divided by all objects. Combine disjoint event categories; probability is a unitless proportion, not a count.',
    ],
  ],
  [
    [
      '实验频率用这批符合次数除以这批总次数，不直接抄理论概率。',
      'Experimental frequency is this batch’s hits divided by its trials, not a copy of theoretical probability.',
    ],
    [
      '零次试验频率未定义。有限频率可上下波动；过去结果不要求下一次补偿。',
      'With no trials frequency is undefined. Finite frequencies fluctuate; earlier results do not force compensation on the next trial.',
    ],
  ],
];
function q(id: string, index: number, item: Item): Question {
  const r = item.set === undefined ? exactRational(item.value) : null;
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[index]!,
    hints[index]!.map(T),
    [T(item.steps), T(hints[index]![1]!)],
    {
      accepted: [
        item.value,
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
        ...(r ? [`${r[0] * 2n}/${r[1] * 2n}`] : []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  result.answer =
    item.set !== undefined
      ? { kind: 'number-set', values: item.set, value: item.value }
      : {
          kind: 'number',
          value: item.value,
          unit: item.unit,
          formats:
            index >= 2
              ? ['decimal', 'fraction', 'percent']
              : ['decimal', 'fraction'],
        };
  result.type = item.unit
    ? 'word_problem'
    : item.diagram
      ? 'visual_select'
      : 'numeric';
  result.misconceptionTags = [
    skills[index]!,
    'record-versus-summary',
    'conditions-and-evidence',
  ];
  return result;
}
const pick = (id: string, index: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[index]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[index]!.map(T),
    [T(p.steps)],
  );
const specs: Spec[] = [
  {
    title: ['中位数与众数', 'Median and mode'],
    objective: [
      '保留并排序全部记录求中位数，按频数报告全部并列众数并区分无众数与零。',
      'Order all observations for median, report all tied highest repeated modes and distinguish no mode from zero.',
    ],
    prerequisites: ['P57-L01', 'P57-L02'],
    keywords: [
      ['中位数', 'median'],
      ['众数', 'mode'],
      ['排序位置', 'ordered position'],
    ],
    lab: 'chance-order',
    hook: [
      '9、1、3、3、4 的中间记录是什么？若两个数并列最常见，能只报告一个吗？',
      'What is central in 9,1,3,3,4? If two values tie for most frequent, may just one be reported?',
    ],
    items: [
      {
        stem: [
          '记录 9、1、3、3、4 的中位数是多少？',
          'Find the median of 9,1,3,3,4.',
        ],
        value: '3',
        steps: [
          '排序为 1、3、3、4、9，第三个是三；重复三保留两条记录。',
          'Order 1,3,3,4,9. The third is three; keep both observations of three.',
        ],
        wrong: ['9', '4', '1'],
        diagram: { kind: 'stats-order', values: [9, 1, 3, 3, 4] },
      },
      {
        stem: ['8、2、6、4 的中位数是多少？', 'Find the median of 8,2,6,4.'],
        value: '5',
        steps: [
          '排序 2、4、6、8，中间四和六平均为五。',
          'Order 2,4,6,8; average the middle four and six to obtain five.',
        ],
        wrong: ['4', '6', '8'],
      },
      {
        stem: [
          '1、1、2、2、3 的全部众数是什么？多个用逗号分隔。',
          'Give all modes of 1,1,2,2,3, separated by commas.',
        ],
        value: '1,2',
        set: ['1', '2'],
        steps: [
          '一和二各出现两次，三一次，全部最高重复值为一、二。',
          'One and two each occur twice, three once: report both one and two.',
        ],
        wrong: ['1', '2', '3', '1,1,2'],
      },
      {
        stem: [
          '2、4、6、8 的众数是什么？本课约定只出现一次时无众数。',
          'Find the mode of 2,4,6,8. Under this lesson’s convention, all-singleton data have no mode.',
        ],
        value: 'no mode',
        set: [],
        steps: [
          '每个值各一次，没有重复最高值，写无众数而不是零。',
          'Every value occurs once: no mode, rather than zero.',
        ],
        wrong: ['0', '2', '2,4,6,8'],
      },
      {
        stem: ['0、0、0 的众数是什么？', 'Find the mode of 0,0,0.'],
        value: '0',
        set: ['0'],
        steps: [
          '零出现三次，众数为零，与无众数不同。',
          'Zero occurs three times, so mode is zero, distinct from no mode.',
        ],
        wrong: ['no mode', '3', '0,0'],
      },
      {
        stem: ['1、2、8、9 的中位数是多少？', 'Find the median of 1,2,8,9.'],
        value: '5',
        steps: [
          '中间二和八的平均为五，中位数不必出现在原记录中。',
          'The middle two and eight average to five, which need not appear in the data.',
        ],
        wrong: ['2', '8', '4'],
      },
    ],
    pick: {
      stem: [
        '关于 1、1、2、2、3，哪句话正确？',
        'Which statement about 1,1,2,2,3 is correct?',
      ],
      correct: 1,
      options: [
        {
          text: ['只取较小的一为众数', 'Only the smaller value one is a mode'],
          feedback: [
            '二也同频，不能丢掉并列最高。',
            'Two has the same highest count; retain the tie.',
          ],
        },
        {
          text: ['中位数二，众数一和二', 'Median two; modes one and two'],
          feedback: [
            '位置和频数是两种不同判断。',
            'Ordered position and frequency are different checks.',
          ],
        },
        {
          text: ['众数就是最大的三', 'Mode is the maximum, three'],
          feedback: [
            '最大值只出现一次，不是最高频数。',
            'The maximum occurs once, not most often.',
          ],
        },
      ],
      steps: [
        '五条记录第三位为二；一和二同为最高频数二。',
        'The third of five is two; one and two both have highest frequency two.',
      ],
    },
    reason: [
      '解释偶数条的中位数为何不必是原记录之一；再区分无众数和众数为零。',
      'Explain why an even-count median may be absent from the data, then distinguish no mode from mode zero.',
    ],
    rubric: [
      '偶数条取排序后中间两数的平均，如 2、4、6、8 的中位数五，原记录没有五也合法。众数看频数，本课全值只出现一次记无众数；0、0、0 则零出现三次，众数为零。并列最高的重复值需全部保留，不能去重以后求中位数。家长核对全部记录、排序位置、平均中间两数及频数证据。',
      'For even counts, average the two ordered middle values: 2,4,6,8 has median five, although five was not observed. Mode depends on frequency. Here all-singleton data have no mode, while 0,0,0 has mode zero. Retain every tied highest repeated value and do not remove duplicate observations before finding the median. Check complete records, ordering, the two middle positions and frequency evidence.',
    ],
    misconception: [
      '不排序就取中间，删除重复记录，只报一个并列众数，或把无众数写成零。',
      'Using an unsorted middle, discarding duplicates, reporting only one tied mode or replacing no mode with zero.',
    ],
    prompts: [
      [
        '排序后有几条，中间是哪两个位置？',
        'How many ordered observations are there, and which positions are central?',
      ],
      [
        '哪些值同为最高频？零是记录还是缺失？',
        'Which values tie for highest frequency, and is zero an observation or missing?',
      ],
    ],
  },
  {
    title: ['平均数、众数与中位数的选择', 'Choosing mean, mode or median'],
    objective: [
      '按问题选择总量均分、中间位置或最常见类别，保留较大观察值和样本范围。',
      'Choose a summary for equal sharing, middle position or common category, retaining large observations and the sample scope.',
    ],
    prerequisites: ['P67-L01', 'P57-L02'],
    keywords: [
      ['平均数', 'mean'],
      ['问题目的', 'question purpose'],
      ['较大观察值的影响', 'effect of a large observation'],
    ],
    lab: 'chance-summary',
    hook: [
      '等待 2、3、3、4、28 分钟，怎样描述中间位置？若问题改为总量均分，还是同一个统计量吗？',
      'For waits 2,3,3,4,28 minutes, how do you describe the middle? If the question instead asks to share the total, does the same summary apply?',
    ],
    items: [
      {
        stem: [
          '五次等待 2、3、3、4、28 分钟，总分钟数等分五份，每份是多少？',
          'Waits are 2,3,3,4,28 minutes. Share their total equally into five parts; how much per part?',
        ],
        value: '8',
        unit: 'min',
        steps: [
          '总量四十除五为八；保留二十八，不因较大就删除。',
          'The total forty divided by five is eight; retain the large observation twenty-eight.',
        ],
        wrong: ['3', '7', '40'],
      },
      {
        stem: [
          '同一组 2、3、3、4、28 分钟，按排序中间位置描述，中位数多少？',
          'For 2,3,3,4,28 minutes, find the ordered middle-position summary.',
        ],
        value: '3',
        unit: 'min',
        steps: [
          '五条第三位为三，和均分总量的八不同。',
          'The third of five is three, distinct from the equal-share mean eight.',
        ],
        wrong: ['8', '28', '4'],
      },
      {
        stem: [
          '2、3、3、4、28 的全部众数是什么？',
          'Give all modes of 2,3,3,4,28.',
        ],
        value: '3',
        set: ['3'],
        steps: [
          '三出现两次，其余各一次。',
          'Three occurs twice; every other value occurs once.',
        ],
        wrong: ['8', '28', 'no mode'],
      },
      {
        stem: [
          '三次等待 1、2、2 分钟，平均数是多少？保留精确值。',
          'Waits are 1,2,2 minutes. Find the exact mean.',
        ],
        value: '5/3',
        unit: 'min',
        steps: [
          '总量五除三为 5/3 分钟，不截成一或近似成 1.67。',
          'Total five divided by three gives 5/3 minutes, not a truncated one or rounded 1.67.',
        ],
        wrong: ['2', '1.67', '1'],
      },
      {
        stem: [
          '1、2、3、4、90 分钟，按中间位置描述的中位数多少？',
          'For 1,2,3,4,90 minutes, find the middle-position median.',
        ],
        value: '3',
        unit: 'min',
        steps: [
          '五条第三位三；较大末值不改变中间排序位置。',
          'The third of five is three; the large final value leaves the middle position unchanged.',
        ],
        wrong: ['20', '90', '4'],
      },
      {
        stem: [
          '0、2、4、6 分钟的完整总量均分四份，每份多少？',
          'Share the complete total of 0,2,4,6 minutes equally into four parts.',
        ],
        value: '3',
        unit: 'min',
        steps: [
          '总量十二，零也占一条记录，12÷4=3。',
          'Total twelve, with zero retained as an observation: 12÷4=3.',
        ],
        wrong: ['4', '0', '12'],
      },
    ],
    pick: {
      stem: [
        '纸卡颜色类别 A、A、B、C，要知道最常见类别，应怎样做？',
        'For card categories A,A,B,C, how should you identify the most common category?',
      ],
      correct: 2,
      options: [
        {
          text: ['把字母相加求平均', 'Add the letters and take a mean'],
          feedback: [
            '这些是无数值含义的类别，不能这样平均。',
            'These are categories without numerical values to average.',
          ],
        },
        {
          text: [
            '按字母表找数值中位数',
            'Find a numerical median using alphabetical order',
          ],
          feedback: [
            '任意类别顺序不是题目的数值尺度。',
            'An arbitrary category order is not a numerical scale for this question.',
          ],
        },
        {
          text: ['数频数，众数类别 A', 'Count frequencies: modal category A'],
          feedback: [
            '问题问最常见，用类别频数回答。',
            'The question asks for the most common category, answered by frequency.',
          ],
        },
      ],
      steps: [
        'A 两次，B/C 各一次，众数类别 A；统计量选择取决于问题。',
        'A occurs twice and B/C once; modal category A answers the stated question.',
      ],
    },
    reason: [
      '同一等待记录为什么可有平均数八、中位数三？何时各自回答了问题，能删掉二十八吗？',
      'Why can one set of waits have mean eight and median three? Which questions do they answer, and may twenty-eight be discarded?',
    ],
    rubric: [
      '平均数八来自完整总量四十均分五份，中位数三来自排序第三位，两者在描述不同特征而非互相判错。若问均分总量选平均数，若明确问稳健的中间位置选中位数；最常见类别另用众数。二十八是题目保留的真实观察，不能为了结果好看删除。样本五次不自动代表所有等待或下一次。家长核对问题目的、保留数据、量名和样本边界。',
      'Mean eight divides the full total forty into five equal shares; median three locates the third ordered value. They describe different features rather than contradicting each other. Use mean for equal sharing, median for the specified resistant middle position, and mode for common categories. Twenty-eight is a retained observation, not something to delete to make results attractive. Five waits do not automatically describe all waits or predict the next. Check purpose, retained data, quantity and sample boundaries.',
    ],
    misconception: [
      '认为平均数永远最好；无故删掉较大值；给类别算无意义的数值平均；把样本当所有人。',
      'Assuming mean is always best, deleting a large observation, averaging nominal categories or generalizing a sample to everyone.',
    ],
    prompts: [
      [
        '问题要总量分摊，还是中间位置？',
        'Does the question ask for a share of the total or a middle position?',
      ],
      [
        '较大记录影响哪种量，能无理由删吗？',
        'Which summary changes with the large value, and is deletion justified?',
      ],
    ],
  },
  {
    title: ['可能、不可能和等可能', 'Impossible, certain and equally likely'],
    objective: [
      '在明确的有限理想模型中区分不可能、可能但不必然、必然及不同结果是否等可能。',
      'In explicit finite ideal models, distinguish impossible, possible but uncertain, certain and equal likelihood.',
    ],
    prerequisites: ['P62-L03', 'P63-L01'],
    keywords: [
      ['必然与不可能', 'certain and impossible'],
      ['等可能条件', 'equal-likelihood condition'],
      ['事件', 'event'],
    ],
    lab: 'chance-equal',
    hook: [
      '转盘有 A、B、C 三个字母，就一定各有三分之一机会吗？四个等扇区标 A、A、B、C 又怎样？',
      'Do three letter names A,B,C force equal one-third chances? What about four equal sectors labelled A,A,B,C?',
    ],
    items: [
      {
        stem: [
          '理想均匀角度转盘 A 占半圆，B/C 各四分之一。P(A) 多少？',
          'An ideal uniform-angle spinner gives A half the circle and B/C one quarter each. Find P(A).',
        ],
        value: '1/2',
        steps: [
          '机会按角度，A 占总角度一半，P(A)=1/2。',
          'Chance follows angle; A occupies half the whole, so P(A)=1/2.',
        ],
        wrong: ['1/3', '1', '2'],
        diagram: {
          kind: 'chance-spinner',
          labels: ['A', 'B', 'C'],
          weights: [2, 1, 1],
        },
      },
      {
        stem: [
          '理想转盘把 A/B/C 等分三份。P(B) 多少？',
          'An ideal spinner has equal thirds A,B,C. Find P(B).',
        ],
        value: '1/3',
        steps: [
          '三个等角扇区，B 一份，占 1/3。',
          'B is one of three equal-angle sectors, giving 1/3.',
        ],
        wrong: ['1/2', '0.33', '1'],
      },
      {
        stem: [
          '转盘只含 A/B/C 三个正面积扇区，抽到 D 的概率多少？',
          'A spinner has only positive-area sectors A,B,C. What is P(D)?',
        ],
        value: '0',
        steps: [
          '没有 D 结果，事件不可能，概率零。',
          'No outcome is D: impossible, probability zero.',
        ],
        wrong: ['1', '1/4', '1/3'],
      },
      {
        stem: [
          '同一转盘每次结果必为 A、B 或 C。P(A 或 B 或 C) 多少？',
          'Every outcome is A, B or C. Find P(A or B or C).',
        ],
        value: '1',
        steps: [
          '事件覆盖全部结果，必然，概率一。',
          'The event includes every outcome: certain, probability one.',
        ],
        wrong: ['0', '1/3', '3'],
      },
      {
        stem: [
          '四个等角扇区标 A、A、B、C。理想抽角时 P(B) 多少？',
          'Four equal-angle sectors are labelled A,A,B,C. Find P(B) under ideal angle sampling.',
        ],
        value: '1/4',
        steps: [
          'B 只占四个等扇区之一，不是按三个字母除三。',
          'B occupies one of four equal sectors, not one third based on letter names.',
        ],
        wrong: ['1/3', '1/2', '1'],
        diagram: {
          kind: 'chance-spinner',
          labels: ['A', 'A', 'B', 'C'],
          weights: [1, 1, 1, 1],
        },
      },
      {
        stem: [
          '四个等角扇区标 A、A、B、C。P(A) 多少？',
          'Four equal-angle sectors are labelled A,A,B,C. Find P(A).',
        ],
        value: '1/2',
        steps: [
          'A 含两个等扇区，2/4=1/2，字母并不等可能。',
          'A includes two equal sectors: 2/4=1/2. Letter events are not equally likely.',
        ],
        wrong: ['1/4', '1/3', '1'],
      },
    ],
    pick: {
      stem: [
        '四个等扇区 A、A、B、C，哪句话正确？',
        'For equal sectors A,A,B,C, which statement is correct?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '扇区等可能，字母事件不等可能',
            'Sectors are equally likely; letter events are not',
          ],
          feedback: [
            'A 合并两份，B/C 各一份。',
            'A combines two sectors; B and C each contain one.',
          ],
        },
        {
          text: [
            '有三个字母，所以各三分之一',
            'There are three letters, so each has probability one third',
          ],
          feedback: [
            '忽略了重复字母的两份面积。',
            'That ignores the two sectors carrying A.',
          ],
        },
        {
          text: [
            'A 概率一半，所以两次中一定一次 A',
            'Half probability guarantees one A in every two trials',
          ],
          feedback: [
            '理论比例不安排短期结果配额。',
            'Theoretical proportions do not impose quotas on short runs.',
          ],
        },
      ],
      steps: [
        '先选等可能基本结果，再把事件包含的份数合并。',
        'Identify equally likely elementary outcomes, then combine those belonging to the event.',
      ],
    },
    reason: [
      '解释“有三种字母”与“三种字母等可能”为何不同，并区分概率一半与下一次必然。',
      'Explain why three letter names do not imply equal letter chances, and why one-half probability does not mean certainty on the next trial.',
    ],
    rubric: [
      '等可能需要机制和大小条件，理想均匀角度按扇区角度分配机会。四等扇区 A、A、B、C 中，基本扇区各四分之一，A 合两份为一半，B/C 各四分之一。概率一半表示该模型的比例，不指定下一次，也不保证每两次恰好一次。没有 D 事件为零、覆盖全部为一，这些判断限于给定有限模型。家长核对条件、基本结果和事件合并。',
      'Equal likelihood requires a mechanism and size assumptions. Uniform angles allocate chance by sector angle. In four equal sectors A,A,B,C, each sector has probability one quarter, while A combines two and has one half; B/C each have one quarter. One half does not specify the next result or guarantee exactly one success per pair. D is impossible and all outcomes together certain within the given finite model. Check assumptions, elementary outcomes and event aggregation.',
    ],
    misconception: [
      '按名称种类平均分概率；把可能当必然；把理论比例当每两次的固定配额。',
      'Dividing chance equally by label names, confusing possibility with certainty, or treating probability as a fixed short-run quota.',
    ],
    prompts: [
      [
        '哪些基本结果才等可能，依据是什么？',
        'Which elementary outcomes are equally likely, and why?',
      ],
      [
        '一个事件含几个扇区，下一次被指定了吗？',
        'How many sectors belong to the event, and is the next result predetermined?',
      ],
    ],
  },
  {
    title: ['简单事件的概率', 'Probability of simple events'],
    objective: [
      '在等可能对象的非空有限模型中，用有利数除总数求事件概率并保留精确比例。',
      'For nonempty finite equally likely objects, calculate favourable over total and retain exact proportions.',
    ],
    prerequisites: ['P67-L03', 'P61-L06'],
    keywords: [
      ['有利结果', 'favourable outcomes'],
      ['全部结果', 'all outcomes'],
      ['概率比例', 'probability proportion'],
    ],
    lab: 'chance-event',
    hook: [
      '三枚 A、两枚 B、一枚 C，抽到 A 的概率是三分之一还是三除六？合并 A 或 B 时总数会变吗？',
      'With three A tokens, two B and one C, is P(A) one third or three sixths? Does the total change for A or B?',
    ],
    items: [
      {
        stem: [
          '同样大小混匀圆片 A 三枚、B 两枚、C 一枚，每枚等可能。P(A) 多少？',
          'Same-sized mixed tokens: three A, two B and one C, each equally likely. Find P(A).',
        ],
        value: '1/2',
        steps: [
          '总数六，有利三，3/6=1/2。',
          'Three favourable among six gives 3/6=1/2.',
        ],
        wrong: ['1/3', '3', '3/5'],
        diagram: { kind: 'chance-tokens', counts: [3, 2, 1], selected: [0] },
      },
      {
        stem: [
          '等可能圆片 A 三枚、B 两枚、C 三枚。P(A 或 C) 多少？',
          'Equally likely tokens: three A, two B, three C. Find P(A or C).',
        ],
        value: '3/4',
        steps: [
          '不重叠的 A/C 共六枚，总数八，6/8=3/4。',
          'Disjoint A/C contain six of eight tokens: 6/8=3/4.',
        ],
        wrong: ['1/2', '6', '2/3'],
      },
      {
        stem: [
          '非空袋只有五枚 A、三枚 B，每枚等可能。P(D) 多少？',
          'A nonempty bag contains five A and three B tokens, each equally likely. Find P(D).',
        ],
        value: '0',
        steps: [
          '没有 D，有利数零，总数八，0/8=0。',
          'No D tokens: 0 favourable among 8, giving zero.',
        ],
        wrong: ['1', '1/8', '1/3'],
      },
      {
        stem: [
          '非空袋三枚 A、两枚 B、一枚 C，每枚等可能。P(A 或 B 或 C) 多少？',
          'A nonempty equally likely bag contains three A, two B, one C. Find P(A or B or C).',
        ],
        value: '1',
        steps: ['全部六枚符合，6/6=1。', 'All six qualify: 6/6=1.'],
        wrong: ['3', '1/3', '0'],
      },
      {
        stem: [
          '等可能圆片一枚 A、两枚 B。P(A) 多少？保留精确值。',
          'Equally likely tokens: one A, two B. Find P(A) exactly.',
        ],
        value: '1/3',
        steps: [
          '一枚符合，共三枚，1/3；0.33 只是近似。',
          'One favourable among three gives 1/3; 0.33 is only approximate.',
        ],
        wrong: ['1/2', '0.33', '1'],
      },
      {
        stem: [
          '等可能圆片两枚 A、一枚 B。P(A) 多少？',
          'Equally likely tokens: two A and one B. Find P(A).',
        ],
        value: '2/3',
        steps: [
          '有利二，总数三，P=2/3；不能按两种字母给一半。',
          'Two favourable out of three gives 2/3, not one half from two label names.',
        ],
        wrong: ['1/2', '2', '1/3'],
      },
    ],
    pick: {
      stem: [
        '何时可直接用有利对象数除以全部对象数？',
        'When may favourable object count be divided directly by total object count?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '只要对象有不同颜色',
            'Whenever objects have different colours',
          ],
          feedback: [
            '颜色不保证各对象机会相同。',
            'Colour differences do not establish equal likelihood.',
          ],
        },
        {
          text: [
            '非空有限模型中每个对象等可能',
            'In a nonempty finite model where each object is equally likely',
          ],
          feedback: [
            '先有等可能条件，计数比例才对应机会。',
            'The equal-likelihood assumption makes the count ratio represent chance.',
          ],
        },
        {
          text: [
            '空袋也可写零除零等于零',
            'An empty bag gives zero divided by zero, equal to zero',
          ],
          feedback: [
            '空袋没有这项抽取模型，零除零未定义。',
            'The empty bag supplies no draw outcome; zero divided by zero is undefined.',
          ],
        },
      ],
      steps: [
        '非空总数和等可能基本对象是计数概率的必要前提。',
        'A nonempty total and equally likely elementary objects are the counting model’s prerequisites.',
      ],
    },
    reason: [
      '比较没有 D 的非空袋与空袋，为什么前者 P(D)=0，而后者不能写 0/0=0？',
      'Compare a nonempty bag lacking D with an empty bag. Why is P(D)=0 in the first, but 0/0=0 invalid in the second?',
    ],
    rubric: [
      '非空袋有明确全部对象，假定每个等可能，D 有利数零，因此零除正总数为零，表示该事件没有符合结果。空袋没有可抽对象，不能定义这次抽取的样本空间和计数比，0/0 无定义，不能标成“不可能概率零”的同一种情形。合并事件时只加符合对象，不把分母改成类别数。家长核对非空、等可能、分子分母和事件。',
      'A nonempty bag has a defined set of equally likely objects. With no D, zero divided by its positive total gives probability zero. An empty bag has no draw outcome for this model; 0/0 is undefined, not another way to describe the same impossible event. Combining event categories adds favourable objects without replacing the denominator by a count of categories. Check nonemptiness, equal likelihood, numerator, denominator and the event.',
    ],
    misconception: [
      '按类别数当总数；把概率写成个数；忽略等可能条件或把空袋的零除零当零。',
      'Using category count as denominator, reporting a count instead of probability, ignoring equal likelihood or assigning zero to an empty bag.',
    ],
    prompts: [
      [
        '每一枚是否等可能，总共有几枚？',
        'Is every individual token equally likely, and how many are there?',
      ],
      [
        '事件合并时，分母还是整个袋吗？',
        'When combining categories, is the denominator still the whole bag?',
      ],
    ],
  },
  {
    title: ['转盘模拟与实验频率', 'Spinners and experimental frequency'],
    objective: [
      '按本批符合次数与总次数求实验频率，区别理想概率与下一次机会，识别模拟来源。',
      'Calculate batch frequency from hits and trials, distinguishing ideal probability, the next trial and simulation provenance.',
    ],
    prerequisites: ['P67-L03', 'P67-L04', 'P57-L03'],
    keywords: [
      ['实验频率', 'experimental frequency'],
      ['理论概率', 'theoretical probability'],
      ['模拟记录', 'simulation record'],
    ],
    lab: 'chance-frequency',
    hook: [
      '理论 P(A)=1/2，十次里出现六次 A，能把记录改成五次吗？下一次是否必须不是 A？',
      'If P(A)=1/2 but ten trials contain six A outcomes, may the record be changed to five? Must the next outcome be non-A?',
    ],
    items: [
      {
        stem: [
          '给定模拟记录十次中 A 六次，实验频率多少？',
          'A supplied simulated record has six A outcomes in ten trials. Find the experimental frequency.',
        ],
        value: '3/5',
        steps: [
          '6/10=3/5，描述记录而非强改为理论一半。',
          '6/10=3/5 describes the record, not a forced theoretical one half.',
        ],
        wrong: ['1/2', '6', '10'],
      },
      {
        stem: [
          '五次模拟中 A 零次，实验频率多少？',
          'Five simulated trials have no A outcomes. Find the experimental frequency.',
        ],
        value: '0',
        steps: [
          '0/5=0；这不证明理想 P(A)=0。',
          '0/5=0; this does not prove ideal P(A)=0.',
        ],
        wrong: ['1/2', '5', '1'],
      },
      {
        stem: [
          '八次模拟中 A 四次，实验频率多少？',
          'Eight simulated trials contain four A outcomes. Find the frequency.',
        ],
        value: '1/2',
        steps: [
          '4/8=1/2；本批相同不表示每批都须如此。',
          '4/8=1/2; one matching batch does not require all batches to match.',
        ],
        wrong: ['4', '1/4', '2'],
      },
      {
        stem: [
          '二十次模拟中 A 十三次，实验频率多少？',
          'Twenty simulated trials contain thirteen A outcomes. Find the frequency.',
        ],
        value: '13/20',
        steps: [
          '符合十三除总数二十，13/20=0.65。',
          'Thirteen hits divided by twenty trials gives 13/20=0.65.',
        ],
        wrong: ['1/2', '13', '7/20'],
      },
      {
        stem: [
          '五十次记录中 A 十七次，实验频率多少？',
          'A record of fifty trials has seventeen A outcomes. Find the frequency.',
        ],
        value: '17/50',
        steps: [
          '17/50=0.34，不直接写成理论 1/3。',
          '17/50=0.34; do not substitute a theoretical 1/3.',
        ],
        wrong: ['1/3', '17', '0.17'],
      },
      {
        stem: [
          '四十次记录中 A 二十三次，实验频率多少？',
          'Forty recorded trials contain twenty-three A outcomes. Find the frequency.',
        ],
        value: '23/40',
        steps: [
          '23/40=0.575，仍按本批分子分母。',
          '23/40=0.575, retaining this batch’s numerator and denominator.',
        ],
        wrong: ['1/2', '23', '17/40'],
      },
    ],
    pick: {
      stem: [
        '理想 P(A)=1/2，前五次均不是 A。哪句话正确？',
        'Ideal P(A)=1/2 and the first five results are non-A. Which statement is correct?',
      ],
      correct: 2,
      options: [
        {
          text: ['下一次必为 A，补回来', 'The next must be A to compensate'],
          feedback: [
            '独立理想试验不按过去补偿。',
            'Independent ideal trials do not compensate for the past.',
          ],
        },
        {
          text: [
            '观察频率零证明 P(A)=0',
            'Observed frequency zero proves P(A)=0',
          ],
          feedback: [
            '有限记录不能替代理想机制概率。',
            'A finite record does not replace the ideal model probability.',
          ],
        },
        {
          text: [
            '本批频率零，下一次理想机会仍一半',
            'This batch frequency is zero; the next ideal chance remains one half',
          ],
          feedback: [
            '区分历史记录与不变机制下的新试验。',
            'This separates past records from a fresh trial under the unchanged mechanism.',
          ],
        },
      ],
      steps: [
        '有限频率可偏离；零次试验则频率未定义，不能先记零。',
        'Finite frequency may differ; with no trials it is undefined rather than initialized to zero.',
      ],
    },
    reason: [
      '解释十次六个 A 的频率与理论一半；为什么再做一次不保证更接近，也不需“补偿”？',
      'Explain six A outcomes in ten trials versus theoretical one half. Why need another trial neither improve agreement nor compensate?',
    ],
    rubric: [
      '本批频率 6/10=3/5，理论概率一半来自理想均匀角度与扇区条件，两个量来源不同。若下一次 A，频率变 7/11，离一半更远；若不是 A，变 6/11，可能更近。前面记录不强制下一结果，独立理想模型机会不变。种子可重放的伪随机演示不是实测，也不能证明所有长序列性质；换转盘结构要另开批次。家长核对记录、条件、反例和来源。',
      'Batch frequency is 6/10=3/5; theoretical one half comes from the ideal angle and sector assumptions. If the next result is A, frequency becomes 7/11, farther from one half; a non-A gives 6/11, closer. Earlier records do not force the next result, and ideal independent chances stay unchanged. Reproducible pseudorandom demonstrations are not observations or universal proofs; changing spinner structure starts a separate batch. Check records, assumptions, counterexamples and provenance.',
    ],
    misconception: [
      '把频率强改为理论值；声称次数增加每次都更接近；认为过去连续结果迫使下一次补偿。',
      'Forcing frequency to theory, claiming every added trial improves agreement, or expecting a run to force compensation next.',
    ],
    prompts: [
      [
        '这个分子分母来自哪一批记录？',
        'Which batch supplies this numerator and denominator?',
      ],
      [
        '下一次若仍是 A，频率会更近还是更远？',
        'If the next is A again, does frequency move closer or farther?',
      ],
    ],
  },
];
export const p67Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P67-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 4 ? 24 : 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P67',
    order: i + 1,
    nzYearHints: [6, 7],
    cnGradeHints: [6],
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
            '在纸上写五条假想等待数据，保留重复值与较大值，比较三种统计量回答什么问题。画 A 半圆、B/C 各四分之一的转盘，先写理论事件比例；可用工作台同一结构与种子记录二十次模拟，再按真实生成记录算频率，明确标“模拟”。比较两批不必一样，不改记录凑比例；用零次试验和空袋说明未定义，只需纸笔即可完成。',
            'Write five fictional waits on paper, retaining duplicates and a large value; explain which question each summary answers. Draw an A-half, B/C-quarter spinner and state theoretical proportions. Optionally use one workshop structure and seed for twenty simulated outcomes, calculate their recorded frequency and label them simulated. Batches need not match; do not edit results to fit theory. Discuss no trials and an empty bag as undefined models. Paper and a pencil are sufficient.',
          ),
        }
      : {}),
  };
});
export function p67ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const i = p67Lessons.findIndex((l) => l.id === id);
  if (i < 0) throw new RangeError('Unknown P67 lesson');
  const k = round % 80,
    a = k % 10,
    b = 1 + (Math.floor(k / 10) % 5);
  let item: Item;
  if (i === 0) {
    if (k % 2 === 0) {
      const values = [a + 8, a, a + 2, a + 6];
      item = {
        stem: [
          `记录 ${values.join('、')} 的中位数多少？`,
          `Find the median of ${values.join(', ')}.`,
        ],
        value: String(a + 4),
        steps: [
          `排序 ${a},${a + 2},${a + 6},${a + 8}，中间平均为 ${a + 4}。`,
          `Order ${a},${a + 2},${a + 6},${a + 8}; average the middle pair to get ${a + 4}.`,
        ],
        wrong: [String(a + 2)],
      };
    } else
      item = {
        stem: [
          `${a},${a},${a + 1},${a + 1},${a + 3} 的全部众数？`,
          `Give all modes of ${a},${a},${a + 1},${a + 1},${a + 3}.`,
        ],
        value: `${a},${a + 1}`,
        set: [String(a), String(a + 1)],
        steps: [
          `${a} 与 ${a + 1} 各两次，全部报告。`,
          `${a} and ${a + 1} occur twice each; report both.`,
        ],
        wrong: [String(a), String(a + 1), 'no mode'],
      };
  } else if (i === 1) {
    const values = [a, a + 1, a + 1, a + 2, a + 12];
    item = {
      stem: [
        `假想等待 ${values.join('、')} 分钟，完整总量均分五份，每份多少？`,
        `Fictional waits ${values.join(', ')} minutes: share the full total into five equal parts.`,
      ],
      value: `${5 * a + 16}/5`,
      unit: 'min',
      steps: [
        `总量 ${5 * a + 16} 除五，保留较大末值。`,
        `Divide total ${5 * a + 16} by five, retaining the large last value.`,
      ],
      wrong: [String(a + 1)],
    };
  } else if (i === 2)
    item = {
      stem: [
        `理想均匀角度转盘 A 占 ${b} 份，B/C 各一份，每份等角。P(A)？`,
        `An ideal uniform-angle spinner has ${b} equal-angle parts labelled A and one each B/C. Find P(A).`,
      ],
      value: `${b}/${b + 2}`,
      steps: [
        `共 ${b + 2} 份，A 占 ${b} 份，P=${b}/${b + 2}。`,
        `A occupies ${b} of ${b + 2} equal parts: P=${b}/${b + 2}.`,
      ],
      wrong: [`${b + 1}/${b + 2}`],
    };
  else if (i === 3) {
    const total = a + b + 1;
    item = {
      stem: [
        `等可能圆片 A ${a} 枚、B ${b} 枚、C 一枚。P(A 或 C)？`,
        `Equally likely tokens: ${a} A, ${b} B and one C. Find P(A or C).`,
      ],
      value: `${a + 1}/${total}`,
      steps: [
        `有利 ${a + 1}，总数 ${total}，取比 ${a + 1}/${total}。`,
        `${a + 1} favourable among ${total}: ${a + 1}/${total}.`,
      ],
      wrong: [`${a}/${total}`],
    };
  } else {
    const trials = 10 + k,
      hits = (k * 7 + 3) % (trials + 1);
    item = {
      stem: [
        `给定模拟记录 ${trials} 次，其中 A ${hits} 次。实验频率多少？`,
        `A supplied simulated record has ${hits} A outcomes in ${trials} trials. Find experimental frequency.`,
      ],
      value: `${hits}/${trials}`,
      steps: [
        `本批符合次数除总次数，${hits}/${trials}，不替换成理论值。`,
        `This batch frequency is hits divided by trials, ${hits}/${trials}, without substituting theory.`,
      ],
      wrong: [`${hits + 1}/${trials}`],
    };
  }
  return q(`${id}-R${round}`, i, item);
}
export const p67CheckQuestions: Question[] = [
  q('P67-CHECK-Q1', 0, {
    stem: ['1、3、5、9 的中位数多少？', 'Find the median of 1,3,5,9.'],
    value: '4',
    steps: ['中间三和五平均四。', 'The middle three and five average to four.'],
    wrong: ['3', '5', '5.5'],
  }),
  q('P67-CHECK-Q2', 0, {
    stem: ['2、2、4、4、7 的全部众数是什么？', 'Give all modes of 2,2,4,4,7.'],
    value: '2,4',
    set: ['2', '4'],
    steps: [
      '二、四各两次，全报。',
      'Two and four occur twice each; report both.',
    ],
    wrong: ['2', '4', '7'],
  }),
  q('P67-CHECK-Q3', 2, {
    stem: [
      '理想均匀角度转盘 A 半圆，B/C 各四分之一。P(B) 多少？',
      'An ideal uniform-angle spinner has A half and B/C one quarter each. Find P(B).',
    ],
    value: '1/4',
    steps: [
      'B 占总角度四分之一。',
      'B occupies one quarter of the total angle.',
    ],
    wrong: ['1/3', '1/2'],
  }),
  q('P67-CHECK-Q4', 3, {
    stem: [
      '等可能圆片 A 四枚、B 一枚、C 一枚。P(A) 多少？',
      'Equally likely tokens: four A, one B, one C. Find P(A).',
    ],
    value: '2/3',
    steps: ['4/6=2/3。', '4/6=2/3.'],
    wrong: ['1/3', '4', '1/2'],
  }),
  q('P67-CHECK-Q5', 4, {
    stem: [
      '二十次模拟中七次 A，实验频率多少？',
      'Twenty simulated trials contain seven A outcomes. Find the frequency.',
    ],
    value: '7/20',
    steps: [
      '7/20=0.35，是这批记录的比例。',
      '7/20=0.35 is the proportion in this batch.',
    ],
    wrong: ['1/2', '7', '13/20'],
  }),
  pick('P67-CHECK-Q6', 4, specs[4]!.pick),
  q('P67-CHECK-Q7', 1, {
    stem: [
      '1、1、2、8 的总量均分四份，每份多少？',
      'Share the total of 1,1,2,8 into four equal parts.',
    ],
    value: '3',
    steps: [
      '总量十二除四得三，重复一保留两次。',
      'Total twelve divided by four gives three, retaining both ones.',
    ],
    wrong: ['1.5', '4', '12'],
  }),
  reasoning(
    'P67-CHECK-Q8',
    t(
      '比较 2、3、3、4、28 的平均数与中位数；再解释理想 P(A)=1/2 而十次六个 A 的记录频率及下一次机会。',
      'Compare mean and median of 2,3,3,4,28, then explain ideal P(A)=1/2 versus six A outcomes in ten trials and the next-trial chance.',
    ),
    skills[4]!,
    t(
      '平均数八描述完整总量均分，中位数三描述排序中间位置，问题目的不同而非互相矛盾，二十八不无故删除。模拟频率 6/10=3/5 描述记录，理想概率一半来自均匀角度和面积条件；不改记录成五次，不要求下一次补偿，再多一次也可能更远。家长核对记录保留、统计量目的、等可能条件、频率分母和模拟来源，不能按关键词自动判理解。',
      'Mean eight describes equal sharing of the full total, while median three describes the ordered middle; retain twenty-eight and match the question purpose. Simulated frequency 6/10=3/5 describes the record; ideal one half comes from uniform angles and sector conditions. Do not edit the record to five, force compensation next or claim each added trial improves agreement. Check retained data, summary purpose, equal-likelihood assumptions, frequency denominator and simulation provenance rather than keywords.',
    ),
    hints[4]!.map(T),
  ),
];
