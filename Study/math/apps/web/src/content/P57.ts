import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
const skills = [
  'frequency-and-sample',
  'mean-as-fair-share',
  'time-series-reading',
  'chart-evidence',
  'recipe-and-pack-budget',
];
const hints: [Pair, Pair][] = [
  [
    [
      '每人只记录一次，先区分类别、无回应和仍未录入。',
      'Count each person once; distinguish a category, no response and an unentered record.',
    ],
    [
      '把所有类别频数相加，再加无回应，核对邀请人数；零频数不等于缺测。',
      'Sum category frequencies and then missing responses to check invitations. Zero frequency is not missing.',
    ],
  ],
  [
    [
      '先求完整总量，再数有几个观察值，零也是一个值。',
      'Find the complete total and count observations; zero is an observation too.',
    ],
    [
      '公平分配用总量除以份数；保留精确分数，不假定每人实际都一样。',
      'Divide the total by the number of shares. Keep exact fractions; actual individuals need not equal the mean.',
    ],
  ],
  [
    [
      '先读横轴时刻与纵轴单位，确认比较的是哪两点。',
      'Read horizontal times and vertical units; identify the two observations being compared.',
    ],
    [
      '变化用后值减前值；缺测不填零，线段不证明未观察时刻。',
      'Change is later minus earlier. Missing is not zero; a line does not prove unobserved readings.',
    ],
  ],
  [
    [
      '先核对标题、单位、坐标起点与原数值。',
      'Check the title, units, axis origin and original values.',
    ],
    [
      '柱高只代表从纵轴起点往上的差；结论还要受样本范围限制。',
      'Displayed height measures above the axis origin; claims must also stay within the sample scope.',
    ],
  ],
  [
    [
      '先按份数改实际用量，再看每包容量，不能直接按用掉的份额付费。',
      'Scale ingredient quantities first, then check pack sizes. Whole-pack purchases are not proportional ingredient charges.',
    ],
    [
      '整包数向上取足；所有价格用整数分相加，最后与预算比较。',
      'Buy enough whole packs; add integer cents and then compare with the budget.',
    ],
  ],
];
function q(
  id: string,
  stem: Pair,
  value: string | number,
  index: number,
  steps: Pair[],
  wrong: string[],
  unit?: Unit,
  diagram?: Question['diagram'],
): Question {
  const raw = String(value),
    [n, d] = exactRational(raw)!;
  const item = numeric(
    id,
    T(stem),
    raw,
    skills[index]!,
    hints[index]!.map(T),
    steps.map(T),
    {
      accepted: [
        raw,
        `${n * 2n}/${d * 2n}`,
        ...(unit ? [`${raw} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram,
  );
  item.answer = {
    kind: 'number',
    value: raw,
    unit,
    formats: ['decimal', 'fraction'],
  };
  item.type = diagram ? 'visual_select' : unit ? 'word_problem' : 'numeric';
  item.misconceptionTags = [
    skills[index]!,
    'reading',
    'representation',
    ...(unit ? ['reading-units'] : []),
  ];
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  index: number,
  options: [Pair, Pair][],
  steps: Pair[],
): Question {
  return choice(
    id,
    T(stem),
    correct,
    skills[index]!,
    options.map(([label, feedback]) => ({
      text: T(label),
      feedback: T(feedback),
    })),
    hints[index]!.map(T),
    steps.map(T),
  );
}
const r = (id: string, stem: Pair, index: number, rubric: Pair) =>
  reasoning(id, T(stem), skills[index]!, T(rubric), hints[index]!.map(T));
const piles = (values: number[]): Question['diagram'] => ({
  kind: 'data-mean',
  values,
});
const line = (
  values: (number | null)[] = [12, 16, 14, 20],
): Question['diagram'] => ({
  kind: 'data-line',
  points: [0, 1, 3, 6].map((time, i) => ({ time, value: values[i]! })),
  maxY: 24,
});
const lesson = (l: Lesson): Lesson => ({
  ...l,
  stage: 'P05',
  unit: 'P57',
  order: Number(l.id.slice(-2)),
  skillTags: [...new Set(l.questions.map((q) => q.skill))],
  nzYearHints: [5, 6],
  cnGradeHints: [5],
  contentStatus: 'ready',
});
export const p57Lessons: Lesson[] = [
  lesson({
    id: 'P57-L01',
    title: t('数据收集与频数表', 'Collecting data and frequency tables'),
    objective: t(
      '把每个回应准确分类并核对频数与缺失记录，限定结论描述的群体。',
      'Classify each response, reconcile frequency and missing records, and identify the group the findings describe.',
    ),
    prerequisites: ['B05-L05', 'B06-L01'],
    keywords: [
      t('观察记录', 'observation'),
      t('频数', 'frequency'),
      t('样本', 'sample'),
    ],
    minutes: 18,
    lab: 'data-frequency',
    hook: t(
      '七个人收到邀请，只有六人回答。频数表加起来是六，另一个人应该消失、算零，还是单独记录？',
      'Seven people are invited and six answer. Should the missing person disappear, count as zero, or be recorded separately?',
    ),
    guided: q(
      'P57-L01-G',
      [
        '原始回应：步行、公交、步行、骑车、公交、步行、无回应。步行频数是多少人？',
        'Raw responses: walk, bus, walk, bike, bus, walk, no response. How many walked?',
      ],
      3,
      0,
      [
        [
          '逐条找到三次步行；每人一次，无回应不归进交通类别。',
          'Walk appears three times. Count each person once; no response is not a transport category.',
        ],
      ],
      ['6', '7', '2'],
      'people',
    ),
    questions: [
      c(
        'P57-L01-Q1',
        [
          '一个人没有回答，怎样记录才准确？',
          'How should a person who did not answer be recorded?',
        ],
        1,
        0,
        [
          [
            ['算入“其他交通”', 'Count as Other transport'],
            [
              '其他表示回答了另一种方式，无回应没有提供方式。',
              'Other means a different stated method; no response gives no method.',
            ],
          ],
          [
            [
              '单列无回应，保留邀请总人数',
              'Keep no response separately and retain invitations',
            ],
            [
              '类别回答与缺失相加，才能核对邀请人数。',
              'Answered categories plus missing reconcile invitations.',
            ],
          ],
          [
            ['当作没有邀请过', 'Pretend they were not invited'],
            [
              '这会改变调查对象和回应记录。',
              'That changes the invited group and hides missing data.',
            ],
          ],
        ],
        [
          [
            '无回应是资料缺失，不是某交通方式的零次记录。',
            'No response is missing information, not zero occurrences of a transport method.',
          ],
        ],
      ),
      q(
        'P57-L01-Q2',
        [
          '十人被邀请：步行四、骑车三、公交二、无回应一。有多少人实际回答？',
          'Ten invited: four walk, three bike, two bus and one no response. How many answered?',
        ],
        9,
        0,
        [
          [
            '4+3+2=9；9 个回答与 1 个无回应合计十个邀请。',
            '4+3+2=9 answered; nine plus one missing equals ten invited.',
          ],
        ],
        ['10', '8', '1'],
        'people',
      ),
      q(
        'P57-L01-Q3',
        [
          '频数表：步行四、骑车零、公交三、其他一，无缺失。回答总人数多少？',
          'Frequencies: walk four, bike zero, bus three, other one, with no missing. Find the response total.',
        ],
        8,
        0,
        [
          [
            '4+0+3+1=8；零频数表示这一组无人选择骑车。',
            '4+0+3+1=8; zero bike frequency means no one in this group chose it.',
          ],
        ],
        ['7', '4', '9'],
        'people',
      ),
      q(
        'P57-L01-Q4',
        [
          '邀请十二人、无回应二；回答者中步行四、公交三、其他一，其余骑车。骑车多少人？',
          'Twelve invited, two missing; among respondents four walk, three bus, one other, and the rest bike. How many bike?',
        ],
        2,
        0,
        [
          [
            '回答 12−2=10 人；已列方式 4+3+1=8，骑车 10−8=2 人。',
            '12−2=10 answered. Listed categories total eight; 10−8=2 bike.',
          ],
        ],
        ['4', '10', '8'],
        'people',
      ),
      q(
        'P57-L01-Q5',
        [
          '原有步行三人、骑车二人。新增两名未记录过的步行者，步行频数变成多少？',
          'There were three walkers and two cyclists. Add two new, previously unrecorded walkers. What is the walk frequency now?',
        ],
        5,
        0,
        [
          [
            '步行只加新步行者：3+2=5；原骑车人数不并入此类别。',
            'Add new walkers only: 3+2=5. Existing cyclists stay in their category.',
          ],
        ],
        ['7', '3', '2'],
        'people',
      ),
      r(
        'P57-L01-Q6',
        [
          '访问门口七名自愿回答者，能断言全校最喜欢步行吗？说明小组、问题与缺失如何影响结论。',
          'Can seven volunteers near a gate prove that walking is the whole school’s favourite? Explain the group, question and missing responses.',
        ],
        0,
        [
          '不能。小组规模与选择方式不能保证代表全校；“今天主要怎样来”也不同于“最喜欢怎样来”。先报告邀请、回答与缺失，再仅描述观察到的小组，若要全校结论需要适合的问题和有代表性的收集方法。',
          'No. A small volunteer group need not represent the school. Today’s main travel method is different from a favourite method. Report invitations, responses and missing records; describe this group only. A school-wide claim needs an appropriate question and representative collection.',
        ],
      ),
    ],
    exit: q(
      'P57-L01-X',
      [
        '邀请八人，其中两人无回应；其余步行二、骑车一、公交三。有效回答共多少人？',
        'Eight invited; two did not answer. The others are two walkers, one cyclist and three bus users. How many answered?',
      ],
      6,
      0,
      [
        [
          '2+1+3=6，6+2=8 核对邀请总数。',
          '2+1+3=6 answered, and 6+2=8 reconciles invitations.',
        ],
      ],
      ['8', '2', '5'],
      'people',
    ),
    exitReason: t(
      '说明有效回答与缺失为何分开，并核对所有邀请。',
      'Explain why responses and missing are separate, and reconcile invitations.',
    ),
    parent: {
      goal: t(
        '孩子逐条分类，区分零、缺失与未录入。',
        'The learner classifies each record and distinguishes zero, missing and unentered.',
      ),
      misconception: t(
        '重复计人、把无回应当其他、把小组结果推广所有人。',
        'Double counting, treating missing as Other, or generalising a small group to everyone.',
      ),
      prompts: [
        t(
          '邀请、回答、缺失怎样核对？',
          'How do invitations, answered and missing reconcile?',
        ),
        t(
          '今天的出行方式等于最喜欢的方式吗？',
          'Is today’s travel method the same as a favourite method?',
        ),
      ],
      bridge: 'B05-L05',
    },
  }),
  lesson({
    id: 'P57-L02',
    title: t('平均数的意义', 'Meaning of the mean'),
    objective: t(
      '用保留总量的公平分配解释平均数，并识别零、分数结果和极端值。',
      'Explain the mean as fair sharing of a fixed total, including zero, fractional means and an extreme value.',
    ),
    prerequisites: ['B02-L03', 'P53-L02', 'P57-L01'],
    keywords: [
      t('平均数', 'mean'),
      t('总量', 'total'),
      t('公平分配', 'fair share'),
    ],
    minutes: 18,
    lab: 'data-mean',
    hook: t(
      '四堆卡有一、三、六、六张。不增加一张卡，怎样重新分让每堆相同？原来真的有一堆就是平均数吗？',
      'Four piles contain one, three, six and six cards. Without adding cards, how can they share equally? Did any original pile have to equal the mean?',
    ),
    guided: q(
      'P57-L02-G',
      [
        '四堆各有 1、3、6、6 张卡，平均每堆多少张？',
        'Four piles have 1, 3, 6 and 6 cards. Find the mean per pile.',
      ],
      4,
      1,
      [
        [
          '总数 1+3+6+6=16 张，四堆公平分配：16÷4=4 张。',
          'Total 1+3+6+6=16 cards; four equal shares give 16÷4=4.',
        ],
      ],
      ['16', '6', '3'],
      'cards',
      piles([1, 3, 6, 6]),
    ),
    questions: [
      c(
        'P57-L02-Q1',
        [
          '求 2、4、6 的平均数，为什么总数除以三？',
          'Why divide the total of 2, 4 and 6 by three for the mean?',
        ],
        0,
        1,
        [
          [
            [
              '有三个观察值，要分成三份',
              'Three observations require three shares',
            ],
            [
              '总量十二由三个相同份额组成。',
              'The total twelve is shared into three equal amounts.',
            ],
          ],
          [
            [
              '最大值是六，所以除六',
              'The largest value is six, so divide by six',
            ],
            [
              '除数数观察个数，不是最大观测值。',
              'The divisor counts observations, not the largest value.',
            ],
          ],
          [
            [
              '去掉小的，只保留大的',
              'Discard small values and keep large ones',
            ],
            [
              '所有观察值都要进入总量。',
              'Include every observation in the total.',
            ],
          ],
        ],
        [
          [
            '平均数=总量÷观察值个数；这里 12÷3=4。',
            'Mean=total÷number of observations; here 12÷3=4.',
          ],
        ],
      ),
      q(
        'P57-L02-Q2',
        [
          '三天收集卡片 0、4、8 张，平均每天几张？',
          'Cards collected on three days: 0, 4, 8. What is the daily mean?',
        ],
        4,
        1,
        [
          [
            '零也是一天的观测：总数十二除三天得四。',
            'Zero is an observed day too: twelve divided by three gives four.',
          ],
        ],
        ['6', '12', '0'],
        'cards',
        piles([0, 4, 8]),
      ),
      q(
        'P57-L02-Q3',
        [
          '三堆 1、2、2 张卡，平均几张？用精确分数，不四舍五入。',
          'Piles have 1, 2 and 2 cards. Find the exact fractional mean without rounding.',
        ],
        '5/3',
        1,
        [
          [
            '总数五、三堆：5÷3=5/3。整张卡无法完全等分不影响平均数存在。',
            'Five cards over three piles gives 5/3. An exact mean exists even without equal whole-card piles.',
          ],
        ],
        ['1', '2', '1.67'],
        'cards',
        piles([1, 2, 2]),
      ),
      q(
        'P57-L02-Q4',
        [
          '四人的平均卡数为六张，四人总共多少张？',
          'Four people have a mean of six cards. How many cards altogether?',
        ],
        24,
        1,
        [
          [
            '四份公平份额各六张，总量 4×6=24；不表示原来每个人都有六张。',
            'Four fair shares of six total 4×6=24; actual people need not each hold six.',
          ],
        ],
        ['6', '10', '1.5'],
        'cards',
      ),
      q(
        'P57-L02-Q5',
        [
          '四次步行用时为 10、12、14、20 分钟，平均用时多少分钟？',
          'Four walks took 10, 12, 14 and 20 minutes. Find the mean time in minutes.',
        ],
        14,
        1,
        [
          [
            '总用时 56 分钟，观察四次，56÷4=14 min。',
            'Total time 56 minutes across four walks gives 56÷4=14 min.',
          ],
        ],
        ['56', '15', '20'],
        'min',
      ),
      r(
        'P57-L02-Q6',
        [
          '2、2、2、18 的平均数是六，为什么不能说每个人实际都有六张，或六最能描述多数人？',
          'The mean of 2, 2, 2 and 18 is six. Why does this not mean everyone actually has six, or that six describes most people well?',
        ],
        1,
        [
          '总量二十四除四得六，只描述公平分配后的份额。原来三人各二、一人十八，没有人实际六张。十八把平均数拉高；需要同时看原数据与分布。不能删除十八只为了得到喜欢的结果，但可以说明极端值的影响。',
          'Twenty-four divided by four is six, the hypothetical fair share. The actual data contain three twos and one eighteen, with no six. Eighteen raises the mean, so examine the original distribution as well. Do not delete a genuine value just to obtain a preferred mean; explain its influence.',
        ],
      ),
    ],
    exit: q(
      'P57-L02-X',
      [
        '三天收集 2、5、5 张卡，平均每天多少张？',
        'Cards collected on three days: 2, 5, 5. Find the daily mean.',
      ],
      4,
      1,
      [['总数 2+5+5=12，12÷3=4 张。', 'Total 2+5+5=12; 12÷3=4 cards.']],
      ['12', '5', '3'],
      'cards',
    ),
    exitReason: t(
      '说明除数来自哪几个观察值，以及平均数与实际值的区别。',
      'Explain the observation count used as divisor and how the mean differs from actual values.',
    ),
    parent: {
      goal: t(
        '孩子先说总量与份数，再解释平均而非只背公式。',
        'The learner names total and number of shares before explaining the mean.',
      ),
      misconception: t(
        '漏算零、平均取整、把平均说成每个人实际相同。',
        'Omitting zero, rounding an exact mean, or claiming everyone actually has the mean.',
      ),
      prompts: [
        t(
          '移动一张卡后总数改变了吗？',
          'Does moving one card change the total?',
        ),
        t(
          '平均数能是原数据没有的数吗？',
          'Can a mean be absent from the original observations?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
  lesson({
    id: 'P57-L03',
    title: t('折线图看变化', 'Line charts and change over time'),
    objective: t(
      '按时间与单位读出折线图的观察值和变化，保留不等间隔与缺测。',
      'Read observations and changes from a time series, respecting units, unequal time intervals and missing readings.',
    ),
    prerequisites: ['B05-L05', 'P52-L03', 'P57-L01'],
    keywords: [
      t('时间间隔', 'time interval'),
      t('变化量', 'change'),
      t('缺测', 'missing reading'),
    ],
    minutes: 18,
    lab: 'data-line',
    hook: t(
      '记录在开始后一、三、六小时，能把四个时刻画成等间距吗？第 3 小时没测，能顺手填成零度吗？',
      'If readings occur at elapsed hours zero, one, three and six, should points be equally spaced? If hour three was not measured, may it be filled as zero?',
    ),
    guided: q(
      'P57-L03-G',
      [
        '图中第 3 小时 14 °C，第 6 小时 20 °C。这一段升高多少摄氏度？',
        'The chart reads 14 °C at hour 3 and 20 °C at hour 6. How many degrees Celsius did it rise?',
      ],
      6,
      2,
      [
        [
          '后值减前值：20−14=6 °C；经过时间是三小时，不是温度变化。',
          'Later minus earlier: 20−14=6 °C. Three elapsed hours measure time, not temperature change.',
        ],
      ],
      ['3', '20', '34'],
      '°C',
      line(),
    ),
    questions: [
      c(
        'P57-L03-Q1',
        [
          '横轴时刻 0、1、3、6 小时，正确的横向间距怎样？',
          'For times 0, 1, 3 and 6 hours, how should horizontal gaps compare?',
        ],
        1,
        2,
        [
          [
            ['三段都相同', 'All three gaps equal'],
            [
              '相等的画面距离会把不同的经过时间误画相同。',
              'Equal gaps would misrepresent unequal elapsed times.',
            ],
          ],
          [
            ['按 1、2、3 小时成比例', 'Proportional to 1, 2 and 3 hours'],
            [
              '同一小时始终对应同样横向长度。',
              'One hour must always have the same horizontal length.',
            ],
          ],
          [
            ['按温度高低决定间距', 'Choose gaps from temperatures'],
            [
              '温度读纵轴，横轴间距表示时间。',
              'Temperature belongs on the vertical axis; horizontal spacing represents time.',
            ],
          ],
        ],
        [
          [
            '横轴使用统一时间标尺，不能只按数据出现次序等距摆点。',
            'Use a consistent time scale rather than spacing observations by list position.',
          ],
        ],
      ),
      q(
        'P57-L03-Q2',
        [
          '同图开始 12 °C、最后 20 °C。最后比开始高多少摄氏度？',
          'The same chart begins at 12 °C and ends at 20 °C. How much higher is the final reading?',
        ],
        8,
        2,
        [
          [
            '20−12=8 °C；中途先升后降不改变首尾差。',
            '20−12=8 °C; intervening rises and falls do not change the endpoint difference.',
          ],
        ],
        ['20', '32', '6'],
        '°C',
        line(),
      ),
      q(
        'P57-L03-Q3',
        [
          '同图第 1 小时 16 °C，第 3 小时 14 °C。温度降低了多少摄氏度？填降低量的正数。',
          'At hour 1 the reading is 16 °C; at hour 3 it is 14 °C. How many degrees did it fall? Enter the positive fall amount.',
        ],
        2,
        2,
        [
          [
            '降低量为前值减后值：16−14=2 °C；有符号变化则为 −2 °C。',
            'The fall amount is 16−14=2 °C; the signed change would be −2 °C.',
          ],
        ],
        ['-2', '30', '14'],
        '°C',
        line(),
      ),
      q(
        'P57-L03-Q4',
        [
          '观察时刻为开始后 0、1、3、6 小时。从第 1 到第 3 小时经过几小时？只填小时数量。',
          'Observations occur at elapsed hours 0, 1, 3 and 6. How many hours pass from hour 1 to hour 3? Enter the hour quantity only.',
        ],
        2,
        2,
        [
          [
            '3−1=2 小时；不是把两个时刻当两条温度记录相加。',
            '3−1=2 hours; subtract times rather than adding temperatures.',
          ],
        ],
        ['3', '4', '1'],
      ),
      q(
        'P57-L03-Q5',
        [
          '同一图的纵轴上限从 24 改为 40 °C，数据不变。第 1 小时仍是多少摄氏度？',
          'The vertical maximum changes from 24 to 40 °C without changing data. What is the hour-1 reading still?',
        ],
        16,
        2,
        [
          [
            '换显示范围只改变图上的位置，观察值仍是 16 °C。',
            'Changing the displayed range changes position, not the recorded 16 °C value.',
          ],
        ],
        ['24', '40', '10'],
        '°C',
        line(),
      ),
      r(
        'P57-L03-Q6',
        [
          '第 3 小时缺测时，能连直线后说它一定是零或某个精确值吗？最后一段上升保证以后继续升温吗？',
          'If hour 3 is missing, may a straight line establish that its value was zero or another exact number? Does a final rise guarantee continued warming?',
        ],
        2,
        [
          '不能。缺测表示未获得观察值，不是零。保留断开与缺测标签；两端观察值不能决定中间真实过程，插值最多是额外假设下的估计。已观察到最后上升也不能证明未来一定上升，需要新观测或合适模型。',
          'No. Missing means unobserved, not zero. Retain the gap and missing label. Endpoints do not determine the actual intervening process; interpolation is at most an estimate under extra assumptions. A final observed rise does not prove future warming; more observations or a justified model are needed.',
        ],
      ),
    ],
    exit: q(
      'P57-L03-X',
      [
        '另一天开始 9 °C，四小时后 15 °C。升高多少摄氏度？',
        'On another day the reading starts at 9 °C and reaches 15 °C four hours later. How many degrees did it rise?',
      ],
      6,
      2,
      [
        [
          '15−9=6 °C；四小时是时间，不是温度差。',
          '15−9=6 °C; four hours is elapsed time rather than temperature difference.',
        ],
      ],
      ['4', '24', '15'],
      '°C',
    ),
    exitReason: t(
      '说出比较的两个时刻、两个观察值，以及变化量的单位。',
      'Name the two times, their readings and the unit of change.',
    ),
    parent: {
      goal: t(
        '孩子用标尺读值，说明连接线与实际观测的区别。',
        'The learner reads labelled scales and distinguishes connecting lines from observed values.',
      ),
      misconception: t(
        '等距摆不等时刻、缺测填零、换标尺改数据、无依据预测未来。',
        'Equally spacing unequal times, filling missing as zero, changing data with scale, or asserting an unsupported future.',
      ),
      prompts: [
        t(
          '一小时在横轴上总是同样长吗？',
          'Does an hour always have the same horizontal length?',
        ),
        t(
          '这条线中哪些点真正测过？',
          'Which points on this line were actually measured?',
        ),
      ],
      bridge: 'B05-L05',
    },
  }),
  lesson({
    id: 'P57-L04',
    title: t('读图时不能被误导', 'Avoiding misleading charts'),
    objective: t(
      '用原数值、完整标尺与样本范围核对图表结论。',
      'Check a chart claim against original values, the full scale and the sample scope.',
    ),
    prerequisites: ['P57-L01', 'P57-L03', 'B06-L04'],
    keywords: [
      t('零基线', 'zero baseline'),
      t('截断纵轴', 'truncated axis'),
      t('证据', 'evidence'),
    ],
    minutes: 18,
    lab: 'data-chart',
    hook: t(
      '四十人和四十四人，为什么有的图看着像差三倍？只换纵轴起点，人数会跟着变吗？',
      'Why can forty and forty-four people look threefold apart in a chart? Can changing an axis origin change the counts?',
    ),
    guided: q(
      'P57-L04-G',
      [
        '同次记录 A 组 40 人、B 组 44 人，B 比 A 多多少人？',
        'In one record, A has 40 people and B has 44. How many more are in B?',
      ],
      4,
      3,
      [
        [
          '44−40=4 人；不管图从零还是三十八开始，原人数不变。',
          '44−40=4 people. A baseline at zero or thirty-eight does not change original counts.',
        ],
      ],
      ['3', '44', '84'],
      'people',
    ),
    questions: [
      c(
        'P57-L04-Q1',
        [
          '纵轴从 38 开始，40 的柱高为二、44 的柱高为六。哪句话正确？',
          'With baseline 38, bars for 40 and 44 extend two and six units. Which claim is correct?',
        ],
        2,
        3,
        [
          [
            ['44 人是 40 人的三倍', 'Forty-four people is triple forty'],
            [
              '三倍比较的是截断后的六与二，不是原人数。',
              'Triple compares the truncated six and two, not original counts.',
            ],
          ],
          [
            ['换回零基线会改变人数', 'A zero baseline changes the counts'],
            [
              '换标尺不改变同一次观察的原数值。',
              'Changing the scale does not change observations.',
            ],
          ],
          [
            [
              '柱高三倍不代表人数三倍',
              'Triple bar height does not mean triple people',
            ],
            [
              '原数值 44 与 40 相差四，保留单位和起点。',
              'Original values differ by four; retain units and the axis origin.',
            ],
          ],
        ],
        [
          [
            '应读数值与标尺，再判断图形印象是否支持结论。',
            'Read values and scale before trusting the visual impression.',
          ],
        ],
      ),
      q(
        'P57-L04-Q2',
        [
          '另一组记录为 18 人和 21 人。无论纵轴怎样画，两组相差多少人？',
          'Another record has 18 and 21 people. Whatever the display scale, what is their difference?',
        ],
        3,
        3,
        [
          [
            '21−18=3 人；截断不改变差值本身。',
            '21−18=3 people; truncation does not change the difference itself.',
          ],
        ],
        ['39', '21', '18'],
        'people',
      ),
      q(
        'P57-L04-Q3',
        [
          '人数 40 的柱子从 38 起画，显示高度对应多少个“人”的刻度单位？不是问原人数。',
          'A bar for 40 people starts at 38. How many person-scale units does the displayed height span? This asks height above baseline, not the original count.',
        ],
        2,
        3,
        [
          [
            '40−38=2 个刻度单位；原人数仍是四十。',
            '40−38=2 scale units, while the original count remains forty.',
          ],
        ],
        ['40', '38', '78'],
      ),
      q(
        'P57-L04-Q4',
        [
          '人数 44 的柱子从 38 起画，显示高度对应多少个刻度单位？',
          'A bar for 44 people starts at 38. How many scale units does its height span?',
        ],
        6,
        3,
        [
          [
            '44−38=6；六是从三十八往上的高度，不是人数变成六。',
            '44−38=6; this is height above thirty-eight, not a count changed to six.',
          ],
        ],
        ['44', '38', '82'],
      ),
      q(
        'P57-L04-Q5',
        [
          '邀请 50 人，只有 30 人回答。若图只展示回答者，无回应应补记多少人？',
          'Fifty invited, thirty answered. If a chart displays respondents only, how many no responses must also be reported?',
        ],
        20,
        3,
        [
          [
            '50−30=20 人无回应；不能把三十回答者说成全部五十人的意见。',
            '50−30=20 missing; thirty respondents do not establish every invitee’s view.',
          ],
        ],
        ['30', '50', '80'],
        'people',
      ),
      r(
        'P57-L04-Q6',
        [
          '海报只画最后两天从 40 到 44，标题说“全年人数暴增三倍”。需要核对哪些证据？',
          'A poster shows only the final two days, from 40 to 44, titled “Tripled across the year”. What evidence must be checked?',
        ],
        3,
        [
          '核对纵轴起点、单位、原数值、完整时间范围及统计对象是否一致。四十到四十四不是三倍，只画两天不足以描述全年；还需要缺失时段和收集方式，不能把图示高度比当人数比或把局部变化推广全年。',
          'Check the axis origin, units, original values, full time window and consistent populations. Forty to forty-four is not triple, and two days cannot establish a yearly pattern. Seek omitted periods and collection methods; displayed height ratios are not automatically count ratios or evidence about an entire year.',
        ],
      ),
    ],
    exit: q(
      'P57-L04-X',
      [
        '图上的两组原数值为 28 人与 35 人，纵轴从 25 开始。两组实际相差多少人？',
        'Original counts are 28 and 35 people, on an axis starting at 25. What is the actual difference?',
      ],
      7,
      3,
      [
        [
          '35−28=7 人。柱高三与十不是原人数。',
          '35−28=7 people. Displayed heights three and ten are not the original counts.',
        ],
      ],
      ['3', '10', '25'],
      'people',
    ),
    exitReason: t(
      '用原数值给出证据，说明纵轴起点如何影响视觉印象。',
      'Use original values as evidence and explain how the axis origin affects appearance.',
    ),
    parent: {
      goal: t(
        '孩子先查数值和标尺，再评价结论的范围。',
        'The learner checks values and scale before evaluating the claim’s scope.',
      ),
      misconception: t(
        '按柱高猜倍数；只看选取时段；缺失不报告。',
        'Guessing ratios from bar height, ignoring selected time windows, or hiding missing data.',
      ),
      prompts: [
        t(
          '柱子是从零还是别的数开始？',
          'Do bars start at zero or another value?',
        ),
        t(
          '图里的人能代表标题说的所有人吗？',
          'Do the people shown represent everyone named in the title?',
        ),
      ],
      bridge: 'P57-L01',
    },
  }),
  lesson({
    id: 'P57-L05',
    title: t('购物与食谱综合任务', 'Shopping and recipe challenge'),
    objective: t(
      '把食谱用量、整包购买和预算连接成可核查的两阶段计划。',
      'Connect recipe quantities, whole-pack purchases and budget in a checkable two-stage plan.',
    ),
    prerequisites: ['P52-L06', 'P55-L05', 'P57-L01'],
    keywords: [
      t('每份用量', 'quantity per serving'),
      t('整包装', 'whole pack'),
      t('预算', 'budget'),
    ],
    minutes: 20,
    lab: 'data-recipe',
    hook: t(
      '四份需要二百克面粉，十份够用一包五百克。但牛奶按用掉的毫升付款，还是必须买整盒？',
      'Four servings use two hundred grams of flour; ten use one five-hundred-gram pack. Is milk charged by the millilitres used, or must a whole carton be bought?',
    ),
    guided: q(
      'P57-L05-G',
      [
        '四份用面粉 200 g。相同配方做十份，需要多少克面粉？',
        'Four servings use 200 g flour. With the same recipe, how many grams are needed for ten servings?',
      ],
      500,
      4,
      [
        [
          '每份 200÷4=50 g；十份 50×10=500 g。',
          'Per serving: 200÷4=50 g. Ten servings need 50×10=500 g.',
        ],
      ],
      ['200', '800', '20'],
      'g',
    ),
    questions: [
      c(
        'P57-L05-Q1',
        [
          '商店只卖整包面粉，所需 600 g，每包 500 g。从零库存买，哪种计划够用？',
          'You need 600 g flour and have none. The shop sells whole 500 g packs only. Which plan is sufficient?',
        ],
        1,
        4,
        [
          [
            [
              '买一包，因为六百接近五百',
              'Buy one because six hundred is close to five hundred',
            ],
            [
              '一包少一百克，接近不能代替够用。',
              'One pack is one hundred grams short; close is not enough.',
            ],
          ],
          [
            ['买两包，剩四百克', 'Buy two packs, leaving four hundred grams'],
            [
              '两包一千克，使用六百、剩四百。',
              'Two packs contain one thousand grams; use six hundred and retain four hundred.',
            ],
          ],
          [
            ['按一又五分之一包付款', 'Pay for one and one fifth packs'],
            [
              '题目只卖整包，不能假设拆零销售。',
              'The stated shop sells whole packs, with no fractional-pack purchase.',
            ],
          ],
        ],
        [
          [
            '购买量与使用量不同，先保证整包总量不少于所需。',
            'Purchased and consumed quantities differ; whole packs must cover the requirement.',
          ],
        ],
      ),
      q(
        'P57-L05-Q2',
        [
          '四份用牛奶 300 mL，同配方做六份需多少毫升？',
          'Four servings use 300 mL milk. How many millilitres for six servings of the same recipe?',
        ],
        450,
        4,
        [
          [
            '每份 300÷4=75 mL，六份 75×6=450 mL。',
            'Each needs 300÷4=75 mL; six need 75×6=450 mL.',
          ],
        ],
        ['300', '1800', '400'],
        'mL',
      ),
      q(
        'P57-L05-Q3',
        [
          '买整包面粉一包 NZ$2.40、整盒牛奶一盒 NZ$3.00。预算 NZ$6，剩多少新西兰元？',
          'Buy one flour pack for NZ$2.40 and one milk carton for NZ$3.00. From NZ$6, how many dollars remain?',
        ],
        '0.60',
        4,
        [
          [
            '用整数分：240+300=540；600−540=60c=NZ$0.60。',
            'In cents: 240+300=540; 600−540=60c=NZ$0.60.',
          ],
        ],
        ['5.40', '60', '3.60'],
        'NZD',
      ),
      q(
        'P57-L05-Q4',
        [
          '十二份需面粉 600 g，每包 500 g。买两包后，用完所需量，还剩多少克？',
          'Twelve servings need 600 g flour. Packs contain 500 g each. After buying two and using the required amount, how many grams remain?',
        ],
        400,
        4,
        [
          [
            '两包共一千克，1000−600=400 g。',
            'Two packs contain one thousand grams; 1000−600=400 g.',
          ],
        ],
        ['100', '600', '1000'],
        'g',
      ),
      q(
        'P57-L05-Q5',
        [
          '两包面粉各 NZ$2.40，加一盒奶 NZ$3。预算 NZ$7，还差多少新西兰元？填短缺的正数。',
          'Two flour packs cost NZ$2.40 each, plus NZ$3 milk. With a NZ$7 budget, what is the positive dollar shortfall?',
        ],
        '0.80',
        4,
        [
          [
            '总价 240×2+300=780 分，780−700=80 分，短缺 NZ$0.80。',
            'Cost 240×2+300=780 cents; 780−700=80 cents, a NZ$0.80 shortfall.',
          ],
        ],
        ['-0.8', '7.80', '80'],
        'NZD',
      ),
      r(
        'P57-L05-Q6',
        [
          '做十份需面粉 500 g、奶 750 mL。面粉 500 g/NZ$2.40，奶 1000 mL/NZ$3，从零库存买整包。为什么不能把奶价乘 3/4 后当实际付款？还要确认哪些条件？',
          'Ten servings need 500 g flour and 750 mL milk. Whole packs are 500 g/NZ$2.40 flour and 1000 mL/NZ$3 milk, starting with no stock. Why is three quarters of the milk price not the actual payment? What conditions matter?',
        ],
        4,
        [
          '奶必须买整盒，付款三元而非只付用掉份额对应的二元二角五分；总付款五元四角，奶余二百五十毫升。先确认库存、整包容量、单价、是否允许拆零及有无额外费用。假想题按给定价格且无其他费用，余料不自动退钱。',
          'Milk is bought as a whole carton, so payment is three dollars rather than the proportional two dollars twenty-five. Total payment is five dollars forty, with 250 mL milk left. Check existing stock, pack sizes, prices, fractional sales and any extra charges. Here prices are fictional, no extra charges apply and leftovers do not automatically receive refunds.',
        ],
      ),
    ],
    exit: q(
      'P57-L05-X',
      [
        '同食谱做八份，四份用 200 g 面粉。从零库存买 500 g 整包；买一包后剩多少克？',
        'The same recipe uses 200 g flour for four servings. Make eight servings from zero stock, buying whole 500 g packs. How many grams remain after buying one?',
      ],
      100,
      4,
      [
        [
          '八份需 200÷4×8=400 g；一包 500−400=100 g 剩余。',
          'Eight need 200÷4×8=400 g; one pack leaves 500−400=100 g.',
        ],
      ],
      ['400', '300', '500'],
      'g',
    ),
    exitReason: t(
      '说明每份、总用量与整包购买量，并用单位核查剩余。',
      'Explain per-serving, total required and whole-pack quantities, and check leftover units.',
    ),
    parent: {
      goal: t(
        '孩子先计算所需量，再按整包条件核算费用。',
        'The learner calculates requirements before applying whole-pack costs.',
      ),
      misconception: t(
        '食谱份数直接加、整包四舍五入不足、按用掉份额付款、把短缺写剩余。',
        'Adding servings to ingredients, rounding packs down, paying only for consumed fractions, or calling a shortfall change.',
      ),
      prompts: [
        t(
          '用掉的量就是买到的量吗？',
          'Is quantity used always quantity purchased?',
        ),
        t(
          '预算不足时这笔差额叫什么？',
          'What do we call the difference when the budget is insufficient?',
        ),
      ],
      bridge: 'P52-L06',
    },
    familyChallenge: t(
      '纸笔规划即可：比较四份、十份和十二份的面粉/奶用量、整包数、NZ$8 预算余额与余料。四份和十份都需一包面粉、一盒奶，付款均 NZ$5.40；十二份需两包面粉、一盒奶，付款 NZ$7.80。解释为何用量增加时，整包付款不总按比例连续增加。价格完全假想，无需购买或制作食物。',
      'Plan on paper: compare four, ten and twelve servings, ingredient requirements, whole packs, remaining NZ$8 budget and leftovers. Four and ten both buy one flour pack and one milk carton for NZ$5.40; twelve buy two flour packs and one milk carton for NZ$7.80. Explain why increasing consumption does not make whole-pack cost increase continuously in proportion. Prices are fictional; no purchase or food preparation is required.',
    ),
  }),
];
export const p57CheckQuestions: Question[] = [
  q(
    'P57-CHECK-Q1',
    [
      '邀请十二人，步行五、骑车二、公交三，其余未回答。无回应多少人？',
      'Twelve invited: five walk, two bike, three bus and the rest do not answer. How many missing?',
    ],
    2,
    0,
    [
      [
        '12−(5+2+3)=2；保留十二个邀请记录。',
        '12−(5+2+3)=2; retain all twelve invitations.',
      ],
    ],
    ['10', '12', '3'],
    'people',
  ),
  q(
    'P57-CHECK-Q2',
    [
      '三堆 0、3、9 张卡，平均几张？',
      'Piles contain 0, 3 and 9 cards. Find the mean.',
    ],
    4,
    1,
    [['(0+3+9)÷3=4，零也算一堆。', '(0+3+9)÷3=4; the zero pile counts too.']],
    ['6', '12', '3'],
    'cards',
    piles([0, 3, 9]),
  ),
  q(
    'P57-CHECK-Q3',
    [
      '图中开始 12 °C、最后 20 °C，首尾升高多少摄氏度？',
      'The chart starts at 12 °C and ends at 20 °C. How many degrees is the endpoint rise?',
    ],
    8,
    2,
    [['20−12=8 °C。', '20−12=8 °C.']],
    ['6', '32', '20'],
    '°C',
    line(),
  ),
  c(
    'P57-CHECK-Q4',
    [
      '折线图中“缺测”应该怎样处理？',
      'How should a missing time-series reading be handled?',
    ],
    1,
    2,
    [
      [
        ['填零再连线', 'Insert zero and join'],
        [
          '零是一个实际数值，缺测没有获得这个值。',
          'Zero is an actual value, not an absent reading.',
        ],
      ],
      [
        ['保留缺测标签和断开', 'Retain a missing label and a gap'],
        [
          '不要把连接线或猜测冒充观察值。',
          'Do not present connecting lines or guesses as observations.',
        ],
      ],
      [
        ['延续最后一个值当确定结果', 'Carry forward the last value as certain'],
        [
          '这种估计需要明确假设，不能当实际测量。',
          'Such an estimate needs assumptions and is not an observed fact.',
        ],
      ],
    ],
    [
      [
        '先保持观察与未知的区别，再讨论额外假设下的估计。',
        'Distinguish observed and unknown before considering assumption-based estimates.',
      ],
    ],
  ),
  q(
    'P57-CHECK-Q5',
    [
      '图表原人数 36 与 42，纵轴从 30 开始，两组实际相差多少人？',
      'Original counts are 36 and 42 on an axis starting at 30. Find the actual difference.',
    ],
    6,
    3,
    [
      [
        '42−36=6 人；柱高六与十二不能说明人数二倍。',
        '42−36=6 people; heights six and twelve do not imply doubled counts.',
      ],
    ],
    ['12', '2', '30'],
    'people',
  ),
  q(
    'P57-CHECK-Q6',
    [
      '四份用面粉 200 g；做六份需多少克？',
      'Four servings use 200 g flour. How many grams for six?',
    ],
    300,
    4,
    [['每份五十，六份 50×6=300 g。', 'Fifty per serving; 50×6=300 g.']],
    ['1200', '200', '600'],
    'g',
  ),
  q(
    'P57-CHECK-Q7',
    [
      '需面粉 600 g，整包 500 g/NZ$2.40；另买一盒奶 NZ$3。从零库存买够，付款多少新西兰元？',
      'You need 600 g flour in whole 500 g/NZ$2.40 packs, plus one NZ$3 milk carton, starting with no stock. What is the total dollar payment?',
    ],
    '7.80',
    4,
    [
      [
        '面粉两包 2×240=480 分，加奶三百分，共七百八十分，即 NZ$7.80。',
        'Two flour packs cost 480 cents; milk adds 300, totalling 780 cents or NZ$7.80.',
      ],
    ],
    ['5.40', '3.00', '780'],
    'NZD',
  ),
  r(
    'P57-CHECK-Q8',
    [
      '写一句数据或购物结论，并说明它依赖哪些条件：可以选“平均数是公平分配”“小组结果不代表全校”或“用量不等于付款”。给具体例子。',
      'Write a data or shopping conclusion and its conditions. Choose fair-share mean, sample scope or quantity used versus money paid, and give a concrete example.',
    ],
    3,
    [
      '任选其一，必须有相应证据：例如一三六六总十六、四份平均四，不等于每人实际四；或七名自愿者只能描述受访组，问题须与结论一致；或十份用奶七百五十毫升却必须买一千毫升整盒付三元。核对对象、单位与条件，不以选了哪句话或固定措辞评分。',
      'Any one is valid with evidence: 1,3,6,6 total sixteen and have mean four, without each actual pile being four; seven volunteers describe only their sampled group with a matching question; or using 750 mL still requires a whole 1000 mL carton costing three dollars. Review objects, units and assumptions, rather than the chosen sentence or exact wording.',
    ],
  ),
];
export function p57ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative safe-integer round');
  const index = p57Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new Error(`Unknown P57 lesson ${id}`);
  const k = round % 80,
    n = 2 + (k % 8),
    block = Math.floor(k / 8),
    qid = `${id}-R${round}`;
  if (index === 0) {
    const walk = n,
      bike = 1 + (block % 4),
      bus = 2,
      missing = 1 + (block % 3),
      total = walk + bike + bus + missing;
    return q(
      qid,
      [
        `邀请 ${total} 人，步行 ${walk}、骑车 ${bike}、公交 ${bus}，其余无回应。${k % 2 ? '有效回答' : '无回应'}多少人？`,
        `Of ${total} invitations, ${walk} walk, ${bike} bike and ${bus} use a bus; the rest do not answer. How many ${k % 2 ? 'answered' : 'did not answer'}?`,
      ],
      k % 2 ? walk + bike + bus : missing,
      0,
      [
        [
          `${walk}+${bike}+${bus}=${total - missing} 个回答，${total}−${total - missing}=${missing} 个无回应。`,
          `${walk}+${bike}+${bus}=${total - missing} answered; ${total}−${total - missing}=${missing} missing.`,
        ],
      ],
      ['0/0', String(total)],
      'people',
    );
  }
  if (index === 1) {
    const values = k % 2 ? [0, n, n + 1] : [n, n + 2, n + 4];
    const sum = values.reduce((s, v) => s + v, 0);
    return q(
      qid,
      [
        `卡堆 ${values.join('、')} 张，精确平均每堆多少张？`,
        `Piles contain ${values.join(', ')} cards. Find the exact mean per pile.`,
      ],
      `${sum}/3`,
      1,
      [
        [
          `总数 ${sum}，三个观察值，平均 ${sum}/3 张。`,
          `Total ${sum} over three observations gives ${sum}/3 cards.`,
        ],
      ],
      ['0/0', String(sum)],
      'cards',
      piles(values),
    );
  }
  if (index === 2) {
    const a = 8 + n,
      b = k % 2 ? a + block + 1 : a + 2 * n,
      delta = b - a;
    return q(
      qid,
      [
        `温度从 ${a} °C 升至 ${b} °C，升高多少摄氏度？`,
        `Temperature rises from ${a} °C to ${b} °C. How many degrees is the rise?`,
      ],
      delta,
      2,
      [[`${b}−${a}=${delta} °C。`, `${b}−${a}=${delta} °C.`]],
      ['0/0', String(a + b)],
      '°C',
    );
  }
  if (index === 3) {
    const base = 10 + block,
      a = base + n,
      b = a + 2 + block;
    return q(
      qid,
      [
        `图中原人数 ${a} 与 ${b}，纵轴从 ${base} 开始。两组实际相差多少人？`,
        `Counts ${a} and ${b} use an axis starting at ${base}. What is their actual difference?`,
      ],
      b - a,
      3,
      [
        [
          `${b}−${a}=${b - a} 人，与纵轴起点无关。`,
          `${b}−${a}=${b - a} people, independent of the axis origin.`,
        ],
      ],
      ['0/0', String(a + b)],
      'people',
    );
  }
  const servings = 2 + (k % 11),
    grams = servings * 50,
    packs = Math.ceil(grams / 500);
  return k % 2
    ? q(
        qid,
        [
          `四份用 200 g 面粉，做 ${servings} 份需多少克？`,
          `Four servings use 200 g flour. How many grams for ${servings} servings?`,
        ],
        grams,
        4,
        [[`200÷4×${servings}=${grams} g。`, `200÷4×${servings}=${grams} g.`]],
        ['0/0', String(grams + 1)],
        'g',
      )
    : q(
        qid,
        [
          `需面粉 ${grams} g，整包 500 g/NZ$2.40，从零库存买够面粉，付款多少新西兰元？`,
          `You need ${grams} g flour, sold as whole 500 g/NZ$2.40 packs, with no stock. What is the flour payment in dollars?`,
        ],
        ((packs * 240) / 100).toFixed(2),
        4,
        [
          [
            `买 ${packs} 包，${packs}×240=${packs * 240} 分。`,
            `Buy ${packs} packs: ${packs}×240=${packs * 240} cents.`,
          ],
        ],
        ['0/0', '0'],
        'NZD',
      );
}
