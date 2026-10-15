import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  unit: Unit;
  step: Pair;
  wrong: string[];
};
type Pick = {
  stem: Pair;
  options: { text: Pair; feedback: Pair }[];
  correct: number;
  step: Pair;
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
  'journey-time-scope',
  'constant-work-rates',
  'budget-reference-whole',
  'chart-multistep-evidence',
  'trip-joint-constraints',
];
const hints: Pair[][] = [
  [
    [
      '先写所求量与单位：时间是只计移动，还是包含停留的全程？',
      'Name the requested quantity and unit: moving time only, or the whole trip including stops?',
    ],
    [
      '统一为小时或分钟，再用路程=速度×时间；平均速度用总路程除以总时间。',
      'Use consistent hours or minutes, then distance = speed × time. Average speed uses total distance divided by total time.',
    ],
  ],
  [
    [
      '工作量、每单位时间工作量和时间分别是什么？速率是否恒定且可相加？',
      'Identify work, work per unit time and time. Are the rates constant and additive?',
    ],
    [
      '同一时间的工作量才可合并；共同速率相加，用总工作量除以它。零速率不作除数。',
      'Combine work over the same time; add compatible rates and divide total work by that rate. Never divide by zero.',
    ],
  ],
  [
    [
      '给每个百分比标出自己的 100%：原票价，还是完整预算？',
      'Label each percentage base: original tickets, or the full budget?',
    ],
    [
      '先算折后可折扣项，再加不可折扣项；可用金额=预算−预留金，支出须不超过可用金额。',
      'Discount eligible items first, then add ineligible items. Available money is budget minus reserve; spending must not exceed it.',
    ],
  ],
  [
    [
      '先读标题、单位、零点与原始数值，标出缺失项；不要用柱高直接代替数量。',
      'Read the title, unit, zero and numeric records; mark missing values. Bar height is not itself the quantity.',
    ],
    [
      '把问题分成有单位的小步：人数×单价，再加一次组费；缺测时说明尚不能确定什么。',
      'Use steps with units: people × price, then one group fee. If data are missing, state what cannot yet be determined.',
    ],
  ],
  [
    [
      '列全往返、活动、午餐与机动时间；区分每组、每人和折扣范围。',
      'Include return travel, activity, lunch and buffer. Distinguish group, per-person and discount scope.',
    ],
    [
      '同时核对结束时刻不晚于截止，且支出+预留金≤预算；修改一个选项后两项都重算。',
      'Check both finish time against the deadline and spending + reserve ≤ budget. Recheck both after a change.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
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
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
      ],
      rejected: item.wrong,
    },
  );
  result.answer = {
    kind: 'number',
    value: item.value,
    unit: item.unit,
    formats: ['decimal', 'fraction'],
  };
  result.type = 'word_problem';
  result.misconceptionTags = [
    skills[i]!,
    'quantity-and-unit',
    'conditions-before-calculation',
  ];
  return result;
}
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[i]!.map(T),
    [T(p.step)],
  );
}
const specs: Spec[] = [
  {
    title: ['速度、时间和路程', 'Speed, time and distance'],
    objective: [
      '在统一单位后求速度、时间或路程，区分移动速度与含停留的全程平均速度。',
      'Find speed, time or distance in consistent units; distinguish moving speed from whole-trip average including stops.',
    ],
    prerequisites: ['P52-L03', 'P63-L06'],
    keywords: [
      ['速度', 'speed'],
      ['总时间', 'elapsed time'],
      ['单位换算', 'unit conversion'],
    ],
    lab: 'applied-travel',
    hook: [
      '六千米走一小时，再停三十分钟，全程平均速度还是六千米每小时吗？',
      'Travel six kilometres in an hour, then stop for thirty minutes. Is the whole-trip average still six kilometres per hour?',
    ],
    items: [
      {
        stem: [
          '假想行程移动 6 km 用 60 min，另停留 30 min。含停留的全程平均速度是多少 km/h？',
          'A fictional trip covers 6 km in 60 moving minutes plus a 30-minute stop. Find whole-trip average speed in km/h.',
        ],
        value: '4',
        unit: 'km/h',
        step: [
          '总时间 90 min=3/2 h；6÷(3/2)=4 km/h。',
          'Elapsed time 90 min = 3/2 h; 6 ÷ (3/2) = 4 km/h.',
        ],
        wrong: ['6', '1/15', '9', '4 min'],
      },
      {
        stem: [
          '恒速 12 km/h 行进 45 min，走多远？',
          'Travel at constant 12 km/h for 45 minutes. Find the distance.',
        ],
        value: '9',
        unit: 'km',
        step: [
          '45 min=3/4 h，12×3/4=9 km。',
          '45 min = 3/4 h; 12 × 3/4 = 9 km.',
        ],
        wrong: ['540', '16', '9 h'],
      },
      {
        stem: [
          '匀速 5 km/h 走 7.5 km，移动时间多少小时？',
          'At constant 5 km/h, how many moving hours cover 7.5 km?',
        ],
        value: '3/2',
        unit: 'h',
        step: ['t=d÷v=7.5÷5=1.5 h。', 't = d ÷ v = 7.5 ÷ 5 = 1.5 h.'],
        wrong: ['37.5', '2/3', '90'],
      },
      {
        stem: [
          '前三十分钟走 3 km，后六十分钟走 3 km，全程不停。平均速度多少 km/h？',
          'Cover 3 km in the first thirty minutes and 3 km in the next sixty, with no stops. Find average speed in km/h.',
        ],
        value: '4',
        unit: 'km/h',
        step: [
          '总路程六、总时间 1.5 h，平均四；不能把六与三直接平均成 4.5。',
          'Total distance six and time 1.5 h give four, not the unweighted mean 4.5 of six and three.',
        ],
        wrong: ['4.5', '3', '6'],
      },
      {
        stem: [
          '按 8 km/h 移动 6 km，另停十五分钟。全程共多少分钟？',
          'Move 6 km at 8 km/h, then include a fifteen-minute stop. Find total elapsed minutes.',
        ],
        value: '60',
        unit: 'min',
        step: [
          '移动 6/8 h=45 min，加十五得六十分钟。',
          'Moving time 6/8 h = 45 min; add fifteen for sixty minutes.',
        ],
        wrong: ['45', '0.75', '75'],
      },
      {
        stem: [
          '走 10 km 共用两小时，其中休息三十分钟。只计移动时的平均速度多少 km/h？',
          'A 10 km trip takes two elapsed hours, including a thirty-minute rest. Find the average over moving time only in km/h.',
        ],
        value: '20/3',
        unit: 'km/h',
        step: [
          '移动 2−1/2=3/2 h，10÷(3/2)=20/3 km/h，保留精确分数。',
          'Moving time is 2 − 1/2 = 3/2 h, so 10 ÷ (3/2) = 20/3 km/h exactly.',
        ],
        wrong: ['5', '6.67', '15'],
      },
    ],
    pick: {
      stem: [
        '同一路程两段用时不同，求全程平均速度该用哪条关系？',
        'Two legs take different times. Which relationship gives the whole-trip average speed?',
      ],
      correct: 1,
      options: [
        {
          text: ['两段速度直接平均', 'Mean of the two speeds'],
          feedback: [
            '只有某些特殊等时条件才成立，不能一概套用。',
            'That needs special conditions such as equal times; it is not general.',
          ],
        },
        {
          text: ['总路程÷总时间', 'Total distance ÷ total time'],
          feedback: [
            '含停留时把停留也计入时间，单位保持一致。',
            'Include stops when elapsed time is requested, with compatible units.',
          ],
        },
        {
          text: ['总时间÷总路程', 'Total time ÷ total distance'],
          feedback: [
            '得到每千米用时，不是每小时路程。',
            'That gives time per kilometre, not kilometres per hour.',
          ],
        },
      ],
      step: [
        '量名决定分子分母：速度是每单位时间的路程。',
        'The quantity determines the ratio: speed is distance per unit time.',
      ],
    },
    reason: [
      '比较总路程六千米、移动六十分钟、停留三十分钟的两种平均速度，并说明假设。',
      'Compare the two average speeds for six kilometres, sixty moving minutes and a thirty-minute stop; state the assumptions.',
    ],
    rubric: [
      '移动平均为 6÷1=6 km/h，全程为 6÷1.5=4 km/h，两者时间范围不同，并不矛盾。先把分钟换小时，停留期间路程不增加；如果移动本身速度变化，移动平均也不等于每一刻的速度。模型只按给定路程和时间计算，不预测真实路况。家长应让孩子标出分子分母、单位和计时范围，并用速度×相应时间反查六千米；只写公式名称不算说明。',
      'Moving average is 6 ÷ 1 = 6 km/h; whole-trip average is 6 ÷ 1.5 = 4 km/h. Their time scopes differ. Convert minutes to hours; distance does not increase during a stop. A moving average need not equal every instantaneous speed. This uses supplied data without predicting real conditions. Ask the learner to label numerator, denominator, units and time scope, then multiply each rate by its matching time to recover six kilometres. A formula name alone is insufficient.',
    ],
    misconception: [
      '直接平均不同用时的速度，或漏掉停留、把分钟当小时。',
      'Averaging speeds over unequal durations, omitting stops or treating minutes as hours.',
    ],
    prompts: [
      [
        '你现在算的是哪段时间的速度？',
        'Which time interval does this speed describe?',
      ],
      ['乘回去能得到原路程吗？', 'Does multiplying back recover the distance?'],
    ],
  },
  {
    title: ['工作量的直观理解', 'Work-rate intuition'],
    objective: [
      '用每单位时间的工作量建立模型，在恒定且互不干扰条件下相加速率，区分总量、完成量和余量。',
      'Model work per unit time, add constant non-interfering rates, and distinguish total, completed and remaining work.',
    ],
    prerequisites: ['P68-L01', 'P61-L05'],
    keywords: [
      ['工作量', 'work'],
      ['效率', 'rate'],
      ['共同完成', 'combined work'],
    ],
    lab: 'applied-work',
    hook: [
      '两泵每分钟注三升和二升，六十升任务能把各自所需时间相加吗？',
      'Two pumps deliver three and two litres per minute. For sixty litres, should their individual times be added?',
    ],
    items: [
      {
        stem: [
          '两台理想水泵每分钟分别注 3 L 和 2 L，同时恒速且互不干扰，注满 60 L 用多少分钟？',
          'Two ideal pumps deliver 3 L/min and 2 L/min together at constant, non-interfering rates. How many minutes fill 60 L?',
        ],
        value: '12',
        unit: 'min',
        step: [
          '共同每分钟五升，60÷5=12 min，不能相加二十与三十分钟。',
          'Combined rate is five L/min; 60 ÷ 5 = 12 min, not twenty plus thirty.',
        ],
        wrong: ['50', '30', '5'],
      },
      {
        stem: [
          '两泵恒定各 4 L/min 和 2 L/min，同时运行七分钟，未触及容量上限。共注多少升？',
          'Pumps at constant 4 and 2 L/min run together for seven minutes without reaching capacity. How many litres are filled?',
        ],
        value: '42',
        unit: 'L',
        step: [
          '每分钟 4+2=6 L，七分钟 6×7=42 L。',
          'Each minute gives 4 + 2 = 6 L; seven minutes give 42 L.',
        ],
        wrong: ['6', '28', '14'],
      },
      {
        stem: [
          '任务 60 L，两泵各 3 和 2 L/min，同时运行四分钟后，还剩多少升？',
          'A 60 L task uses pumps at 3 and 2 L/min. After four minutes together, how many litres remain?',
        ],
        value: '40',
        unit: 'L',
        step: [
          '先完成 (3+2)×4=20 L，再算 60−20=40 L。',
          'Completed work is (3 + 2) × 4 = 20 L; remaining work is 60 − 20 = 40 L.',
        ],
        wrong: ['20', '55', '48'],
      },
      {
        stem: [
          '理想任务 12 L，A 单独恒速完成需六分钟，B 单独需四分钟。共同完成需多少分钟？',
          'For an ideal 12 L task, A alone takes six minutes and B alone four. At their constant independent rates, how many minutes together?',
        ],
        value: '12/5',
        unit: 'min',
        step: [
          'A 每分钟二升，B 三升；共同 12÷5=12/5 min，不把六与四相加。',
          'A delivers two L/min and B three; together they need 12/5 min, not six plus four.',
        ],
        wrong: ['10', '5', '2.4 L'],
      },
      {
        stem: [
          '同样恒速的两泵各每分钟五升，同时运行三分钟，容量足够。工作量多少升？',
          'Two identical constant-rate pumps each deliver five L/min for three minutes together, with enough capacity. Find the work in litres.',
        ],
        value: '30',
        unit: 'L',
        step: [
          '共同速率十升每分钟，乘三得三十升。',
          'Combined rate ten L/min times three gives thirty litres.',
        ],
        wrong: ['15', '10', '60'],
      },
      {
        stem: [
          '任务 45 L，A 每分钟四升、B 每分钟一升，同时恒速且互不干扰。需多少分钟？',
          'For 45 L, A delivers four L/min and B one L/min simultaneously without interference. Find completion time in minutes.',
        ],
        value: '9',
        unit: 'min',
        step: [
          '共同五升每分钟，45÷5=9 min；九分钟核验三十六加九升。',
          'Together five L/min gives 45 ÷ 5 = 9 min; check thirty-six plus nine litres.',
        ],
        wrong: ['45', '225', '11.25'],
      },
    ],
    pick: {
      stem: [
        '两泵都停机，尚有六十升任务，完成时间怎样判断？',
        'Both pumps are stopped and sixty litres remain. What is the completion time?',
      ],
      correct: 2,
      options: [
        {
          text: ['零分钟', 'Zero minutes'],
          feedback: [
            '零速率表示没有完成工作，不表示瞬间完成。',
            'Zero rate means no work is done, not instant completion.',
          ],
        },
        {
          text: [
            '六十除零得六十分钟',
            'Sixty divided by zero gives sixty minutes',
          ],
          feedback: [
            '除以零没有这个数值结果。',
            'Division by zero has no such numeric result.',
          ],
        },
        {
          text: [
            '在此状态下无法完成，不能除零',
            'It cannot finish in this state; do not divide by zero',
          ],
          feedback: [
            '必须改变速率或条件才能继续任务。',
            'The rate or conditions must change for completion.',
          ],
        },
      ],
      step: [
        '没有每分钟完成量，正工作量就无法在此状态下完成。',
        'With no work per minute, positive remaining work cannot finish in that state.',
      ],
    },
    reason: [
      '为什么两泵各单独二十分钟和三十分钟能合做十二分钟？何时不能用这个模型？',
      'Why can pumps taking twenty and thirty minutes alone finish together in twelve? When would this model fail?',
    ],
    rubric: [
      '先明确是同一个六十升任务。单独速率为三与二升每分钟，共同每分钟五升，十二分钟分别三十六与二十四升，共六十。不能把用时相加，也不能未看速率就一律除二。速率需恒定、同时运行、无干扰、无漏水且有足够容积；共享管道限流或速度变化需新模型。满后停止，不把持续时间乘积画成超过容积的水。家长核对每分钟量和反查总量，不凭出现“合作”就判通过。',
      'Both alone times refer to the same sixty-litre task. Rates are three and two L/min, so together they deliver five. In twelve minutes the contributions are thirty-six and twenty-four litres, totalling sixty. Do not add times or halve a time without checking rates. Constant rates, simultaneous operation, no interference, no leaks and sufficient capacity are required; shared-pipe restrictions need a different model. Stop at capacity. Check rate units and reconstruct total work rather than awarding understanding for the word cooperation.',
    ],
    misconception: [
      '相加完成用时；把不同效率当相同；将零效率解释为零用时。',
      'Adding completion times, assuming unequal rates are equal, or interpreting zero rate as zero completion time.',
    ],
    prompts: [
      ['每一分钟各完成多少？', 'How much does each complete in one minute?'],
      [
        '共同用时乘各自速率，合起来是总任务吗？',
        'Do the separate contributions over the common time reconstruct the task?',
      ],
    ],
  },
  {
    title: ['百分比与预算', 'Percentages and budgets'],
    objective: [
      '识别折扣和预留金的不同基数，计算全部支出并用预算约束核验可行性。',
      'Identify different bases for discounts and reserves, calculate total spending and check budget feasibility.',
    ],
    prerequisites: ['P62-L06', 'P57-L05'],
    keywords: [
      ['折扣范围', 'discount scope'],
      ['预留金', 'reserve'],
      ['预算约束', 'budget constraint'],
    ],
    lab: 'applied-budget',
    hook: [
      '门票减价 25%，交通也能一起打折吗？预算里留着不用的钱是否属于支出？',
      'Tickets are 25% off. Does transport receive the discount too? Is protected budget money already spent?',
    ],
    items: [
      {
        stem: [
          '虚构门票 NZ$80 减价 25%，另付不可折扣交通 NZ$20。全部支出多少 NZD？',
          'Fictional tickets NZ$80 are 25% off; add non-discountable transport NZ$20. Find total spending in NZD.',
        ],
        value: '80',
        unit: 'NZD',
        step: [
          '门票 80×75%=60，交通二十，总支出八十，不是整单打折。',
          'Tickets cost 80 × 75% = 60; add twenty for total eighty. Do not discount the whole bill.',
        ],
        wrong: ['75', '60', '20', '80%'],
      },
      {
        stem: [
          '预算 NZ$150，预留完整预算的 20%。可用来支出的金额多少 NZD？',
          'Budget NZ$150; reserve 20% of the full budget. How many NZD are available to spend?',
        ],
        value: '120',
        unit: 'NZD',
        step: [
          '预留 150×20%=30，可用 150−30=120。',
          'Reserve is 150 × 20% = 30; available money is 120.',
        ],
        wrong: ['30', '150', '180'],
      },
      {
        stem: [
          '票价合计 NZ$120 减 15%，其余费用 NZ$18 不打折。总支出多少 NZD？',
          'Tickets total NZ$120 with 15% off, plus NZ$18 of ineligible expenses. Find total spending in NZD.',
        ],
        value: '120',
        unit: 'NZD',
        step: [
          '票价 120×85%=102，加十八等于一百二十。',
          'Tickets are 120 × 85% = 102; add eighteen for 120.',
        ],
        wrong: ['117.3', '102', '138'],
      },
      {
        stem: [
          '预算 NZ$100，保护 NZ$10 预留金，方案支出 NZ$94。要保护预留金，还缺多少 NZD？',
          'Budget NZ$100, protected reserve NZ$10, planned spending NZ$94. How many NZD short is the plan while protecting reserve?',
        ],
        value: '4',
        unit: 'NZD',
        step: [
          '可用九十，94−90=4；账户余六不代表保护十元后可行。',
          'Available money is ninety; shortfall is 94 − 90 = 4. Six unspent dollars do not protect a ten-dollar reserve.',
        ],
        wrong: ['6', '10', '-4'],
      },
      {
        stem: [
          '原价 NZ$80 先减 20%，再按折后价加 20%。最终多少 NZD？',
          'An NZ$80 price falls 20%, then rises 20% of the new price. Find the final NZD price.',
        ],
        value: '76.8',
        unit: 'NZD',
        step: [
          '80×0.8=64，64×1.2=76.80；第二次基数是六十四。',
          '80 × 0.8 = 64, then 64 × 1.2 = 76.80. The second base is sixty-four.',
        ],
        wrong: ['80', '64', '96'],
      },
      {
        stem: [
          '预算 NZ$200，预留完整预算的 15%，总支出 NZ$146。保护预留后还可用多少 NZD？',
          'Budget NZ$200 with 15% reserved; total spending NZ$146. Find remaining spendable NZD after protecting reserve.',
        ],
        value: '24',
        unit: 'NZD',
        step: [
          '预留三十、可用一百七十，再减一百四十六得二十四。',
          'Reserve thirty, leaving 170 available; subtract 146 for twenty-four.',
        ],
        wrong: ['54', '30', '170'],
      },
    ],
    pick: {
      stem: [
        '只门票能打折，预留金按预算算。哪条计划正确？',
        'Only tickets are discounted; reserve is based on the budget. Which plan is correct?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '折后票价+其他费用≤预算−预留金',
            'Discounted tickets + other costs ≤ budget − reserve',
          ],
          feedback: [
            '费用范围、基数和约束都明确。',
            'This specifies cost scope, bases and the constraint.',
          ],
        },
        {
          text: [
            '整单乘折扣率后再看预算',
            'Multiply the whole bill by the discount percentage',
          ],
          feedback: [
            '减价 25% 是付 75%，且不能折扣不符合条件的项。',
            '25% off means paying 75%, and ineligible items must not be discounted.',
          ],
        },
        {
          text: [
            '剩钱非负就一定可行',
            'Any non-negative leftover guarantees feasibility',
          ],
          feedback: [
            '剩钱还需足够覆盖必须保护的预留金。',
            'The leftover must also cover the protected reserve.',
          ],
        },
      ],
      step: [
        '先逐项列账，再核验预留约束。',
        'Build an itemised ledger before checking the reserve constraint.',
      ],
    },
    reason: [
      '解释预算一百、预留十、支出九十四为什么仍不足，并说明打折的参照量。',
      'Explain why a budget of one hundred, reserve ten and spending ninety-four is insufficient; identify the discount base.',
    ],
    rubric: [
      '预算中的十元需要保留，所以可用九十；支出九十四超出四元，虽然账户还有六元，仍未满足预留约束。预留不是已消费项目，不能把它算入票价折扣基数。折扣按题目指定的原门票金额，其他费用照加；先减百分之二十再按新价增百分之二十不会回原价。金额需明确是否精确到分，出现分以下金额应先声明舍入规则。本课题值不需舍入。家长核对各个百分比的基数、所有支出和不等式，要求指出具体短缺。',
      'Ten dollars are protected, so only ninety are available. Spending ninety-four exceeds that by four. Although six dollars remain in the account, the reserve condition fails. Reserve is not a purchase and is not part of the ticket discount base. Discount only the specified original tickets, then add other costs. A twenty-percent decrease and increase use different bases. Specify a rounding rule if fractional cents arise; supplied tasks need none. Check every percentage base, all spending and the feasibility inequality, including the precise shortfall.',
    ],
    misconception: [
      '折扣率当付款率；把整单或预留金错当折扣基数；只有正余额就判可行。',
      'Confusing discount with payment rate, discounting the whole bill or reserve, or treating any positive balance as feasible.',
    ],
    prompts: [
      [
        '这里的百分之一百是哪笔钱？',
        'Which amount is one hundred percent here?',
      ],
      [
        '支出以后还保护了多少预留金？',
        'How much reserve remains protected after spending?',
      ],
    ],
  },
  {
    title: ['图表中的多步推理', 'Multi-step reasoning with charts'],
    objective: [
      '从有标尺与缺测说明的图表提取证据，写出多步数量关系并区分结论与尚缺的信息。',
      'Extract evidence from labelled charts with missing data, build multistep relationships and distinguish conclusions from missing information.',
    ],
    prerequisites: ['P57-L03', 'P57-L04'],
    keywords: [
      ['图表证据', 'chart evidence'],
      ['多步关系', 'multistep relationship'],
      ['缺失数据', 'missing data'],
    ],
    lab: 'applied-chart',
    hook: [
      '柱子变矮可能只是纵轴放大。图上周三没有记录，能当零人来算票费吗？',
      'A bar may shrink because the axis expanded. If Wednesday has no record, may its ticket cost be calculated as zero visitors?',
    ],
    items: [
      {
        stem: [
          '给定图表：周一 12 人，周二 18 人，周三缺测，周四 24 人。周二每人票 NZ$4，另加一次组费 NZ$10。总费多少 NZD？',
          'Supplied chart: Monday 12 people, Tuesday 18, Wednesday missing, Thursday 24. Tuesday tickets are NZ$4 per person plus one NZ$10 group fee. Find total NZD.',
        ],
        value: '82',
        unit: 'NZD',
        step: [
          '周二有十八人，18×4=72，再加一次十元得八十二。',
          'Tuesday has eighteen people; 18 × 4 = 72, plus one ten-dollar fee gives eighty-two.',
        ],
        wrong: ['72', '252', '58'],
      },
      {
        stem: [
          '同表周一十二人、周四二十四人，这两天共多少人次？不求四天合计。',
          'In the same chart, Monday has twelve and Thursday twenty-four visits. Find the combined visits for these two days only, not all four.',
        ],
        value: '36',
        unit: 'visits',
        step: [
          '只合并指定两天，12+24=36 人次；不声称是三十六个不同的人。',
          'Add only the requested days, 12 + 24 = 36 visits; this need not mean thirty-six distinct people.',
        ],
        wrong: ['54', '12', '48'],
      },
      {
        stem: [
          '同表周四二十四人，四张票一整包，每包 NZ$12，只卖整包。买够所需票共多少 NZD？',
          'Thursday has twenty-four people. Tickets are sold only in packs of four for NZ$12 each. Find the purchase cost in NZD.',
        ],
        value: '72',
        unit: 'NZD',
        step: [
          '24÷4=6 包，每包十二元，6×12=72。',
          '24 ÷ 4 = 6 packs; 6 × 12 = 72.',
        ],
        wrong: ['288', '6', '48'],
      },
      {
        stem: [
          '另一给定组十八人，票每四张一包、NZ$12，只卖整包。买够票共多少 NZD？',
          'Another supplied group has eighteen people. Tickets come only in four-ticket NZ$12 packs. Find the cost of enough tickets in NZD.',
        ],
        value: '60',
        unit: 'NZD',
        step: [
          '需五整包二十张，5×12=60；4.5 包不是可购买方案。',
          'Five whole packs supply twenty tickets and cost sixty; 4.5 packs cannot be purchased.',
        ],
        wrong: ['54', '48', '216'],
      },
      {
        stem: [
          '周二 18 人，周四 24 人，增加人数是周二人数的百分之几？请写精确比例，不带百分号。',
          'Tuesday has 18 visitors and Thursday 24. What fraction of Tuesday’s count is the increase? Give an exact proportion without a percent sign.',
        ],
        value: '1/3',
        unit: undefined,
        step: [
          '增加六，以周二的十八为基数，6/18=1/3；不是六除二十四。',
          'Increase six over the base eighteen gives 6/18 = 1/3, not six over twenty-four.',
        ],
        wrong: ['1/4', '6', '0.33', '33.33%'],
      },
      {
        stem: [
          '某日图表明确记录 0 人，费用规则仍是每人 NZ$4 加一次必收组费 NZ$10。这次登记组的费用多少 NZD？',
          'A day explicitly records zero visitors. The rule still charges NZ$4 per person plus one mandatory NZ$10 group fee for this registered group. Find the NZD fee.',
        ],
        value: '10',
        unit: 'NZD',
        step: [
          '零人不等于缺测；给定必收组费下 0×4+10=10。',
          'Zero is not missing. With the stated mandatory group fee, 0 × 4 + 10 = 10.',
        ],
        wrong: ['0', '4', '14'],
      },
    ],
    pick: {
      stem: [
        '周三缺测，图能支持哪个结论？',
        'Wednesday is missing. Which conclusion does the chart support?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '周三零人，四天共五十四',
            'Wednesday had zero visitors, so four days total fifty-four',
          ],
          feedback: [
            '缺测不是零，五十四只是已记录三天的合计。',
            'Missing is not zero; fifty-four totals the three observed days only.',
          ],
        },
        {
          text: [
            '已记录三天合计五十四人次；四天合计未知',
            'The three recorded days total fifty-four visits; the four-day total is unknown',
          ],
          feedback: [
            '保留数据边界，没有补造缺失值。',
            'This respects the evidence without inventing the missing value.',
          ],
        },
        {
          text: [
            '周四人多证明天气更好',
            'Thursday attendance proves better weather',
          ],
          feedback: [
            '没有天气或因果证据，不能这样推出。',
            'There is no weather or causal evidence for that claim.',
          ],
        },
      ],
      step: [
        '先问图实际给了什么，再判断所求是否有足够信息。',
        'Separate what the chart supplies from what the question requires.',
      ],
    },
    reason: [
      '把纵轴上限三十改六十后柱高减半，人数变了吗？周三缺测会限制哪些结论？',
      'If the axis maximum changes from thirty to sixty and bars halve in height, have counts changed? What does missing Wednesday prevent us from concluding?',
    ],
    rubric: [
      '原人数十二、十八、缺测、二十四没有改变，只是每人占的图上高度减半。三条已知记录合计五十四人次，不是四天完整总量，也不一定五十四个不同个体。周三不能当零或相邻日平均；缺人数时按人收费总额不能确定，仍可说明每人单价和固定费规则。对已知人数分步求费用，整包销售需向上补到整包，不靠金额估算替代可买数量。图只显示关联或记录，不能独自证明天气导致人数变化。家长要求孩子指认单位、原值、未知项和每步理由。',
      'The records twelve, eighteen, missing and twenty-four are unchanged; each person occupies half as much plotted height. The three known days total fifty-four visits, not a complete four-day total or necessarily distinct individuals. Do not replace missing Wednesday with zero or a neighbouring average. Without its count, a per-person total remains unknown, though the tariff is known. Calculate costs step by step and round pack counts upward when only whole packs are sold. A chart alone cannot establish weather as a cause. Ask for units, records, unknowns and reasons for every step.',
    ],
    misconception: [
      '把缺测当零；把柱高当人数；忽略固定费或整包限制；凭图编造原因。',
      'Treating missing as zero or bar height as count, omitting fixed fees or whole-pack constraints, or inventing a cause.',
    ],
    prompts: [
      [
        '这条信息来自图哪里？',
        'Where does this information appear in the chart?',
      ],
      [
        '少了哪条记录，哪一步就不能算？',
        'Which missing record prevents which calculation?',
      ],
    ],
  },
  {
    title: ['综合项目：规划一次短途旅行', 'Capstone: plan a short trip'],
    objective: [
      '整合行程、图表和百分比预算，给出同时满足时间与费用约束并说明取舍的虚构方案。',
      'Combine schedules, tables and percentage budgets into a fictional itinerary that meets both time and money constraints and explains trade-offs.',
    ],
    prerequisites: ['P68-L01', 'P68-L02', 'P68-L03', 'P68-L04'],
    keywords: [
      ['可行方案', 'feasible plan'],
      ['双重约束', 'joint constraints'],
      ['取舍与核验', 'trade-offs and verification'],
    ],
    lab: 'applied-trip',
    hook: [
      '最便宜方案也可能来不及；最快方案也可能超预算。你能同时守住两条线吗？',
      'The cheapest plan may finish too late, and the fastest may exceed the budget. Can you satisfy both limits?',
    ],
    items: [
      {
        stem: [
          '四人虚构旅行：整组往返车费 NZ$40；票每人 NZ$12，门票总额减 25%；午餐每人 NZ$6。全部支出多少 NZD？',
          'Fictional trip for four: group return transport NZ$40, tickets NZ$12 each with 25% off their total, lunch NZ$6 each. Find total spending in NZD.',
        ],
        value: '100',
        unit: 'NZD',
        step: [
          '门票 4×12×75%=36，午餐二十四，加组车费四十，共一百。',
          'Tickets 4 × 12 × 75% = 36, lunch twenty-four, group fare forty: total one hundred.',
        ],
        wrong: ['88', '76', '220', '93'],
      },
      {
        stem: [
          '09:00 出发：去程四十分钟、参观九十、午餐三十、返程四十，最后机动三十。总时长多少分钟？',
          'Leave 09:00: outbound forty minutes, visit ninety, lunch thirty, return forty, then thirty buffer. Find total duration in minutes.',
        ],
        value: '230',
        unit: 'min',
        step: [
          '40+90+30+40+30=230 min，含机动结束 12:50。',
          '40 + 90 + 30 + 40 + 30 = 230 min; finish including buffer at 12:50.',
        ],
        wrong: ['190', '200', '140'],
      },
      {
        stem: [
          '预算 NZ$160，保护完整预算的 10%，上述总支出 NZ$100。保护预留后还有多少可用 NZD？',
          'Budget NZ$160, reserve 10% of the full budget, spending NZ$100. Find remaining spendable NZD after protecting reserve.',
        ],
        value: '44',
        unit: 'NZD',
        step: [
          '预留十六，可用一百四十四，减支出一百余四十四。',
          'Reserve sixteen; available 144 minus spending 100 leaves forty-four.',
        ],
        wrong: ['60', '16', '144'],
      },
      {
        stem: [
          '四人同样餐费与折扣，改整组往返交通 NZ$24、门票每人 NZ$8。总支出多少 NZD？',
          'For four with the same lunch and discount, change group return fare to NZ$24 and tickets to NZ$8 each. Find total spending in NZD.',
        ],
        value: '72',
        unit: 'NZD',
        step: [
          '票 4×8×75%=24，午餐二十四，交通二十四，共七十二。',
          'Tickets 4 × 8 × 75% = 24, lunch twenty-four and transport twenty-four: total seventy-two.',
        ],
        wrong: ['80', '64', '48'],
      },
      {
        stem: [
          '另一方案去返各六十分钟、活动六十、午餐三十、机动三十。允许时长二百一十分钟，时间还差多少分钟？',
          'Another plan has sixty minutes each way, a sixty-minute activity, thirty lunch and thirty buffer. Allowed duration is 210 minutes. Find the time shortfall in minutes.',
        ],
        value: '30',
        unit: 'min',
        step: [
          '总时长 240 min，超出 240−210=30 min，钱够仍不能判可行。',
          'Total duration 240 min exceeds 210 by thirty; enough money does not make it feasible.',
        ],
        wrong: ['0', '60', '240'],
      },
      {
        stem: [
          '四人绕行花园方案支出 NZ$72，预算 NZ$80，保护 10% 预算。保护预留后剩余可用金额多少 NZD？',
          'Four-person scenic garden plan spends NZ$72. Budget is NZ$80 with 10% reserved. Find remaining spendable NZD after reserve.',
        ],
        value: '0',
        unit: 'NZD',
        step: [
          '预留八，可用七十二，恰好用完；等于上限仍满足费用约束，时间另查。',
          'Reserve eight leaves seventy-two; spending exactly equals that limit. Money fits, but time must be checked separately.',
        ],
        wrong: ['8', '-8', '72'],
      },
    ],
    pick: {
      stem: [
        '两方案都合预算，A 超时三十分钟，B 按时结束。哪个结论成立？',
        'Two plans fit the budget. A exceeds the deadline by thirty minutes; B finishes in time. Which conclusion follows?',
      ],
      correct: 2,
      options: [
        {
          text: [
            'A 便宜就可以忽略超时',
            'If A is cheap, its delay can be ignored',
          ],
          feedback: [
            '截止时间也是必须满足的条件。',
            'The deadline is also a required constraint.',
          ],
        },
        {
          text: [
            '合预算就都可行',
            'Both are feasible because they fit the budget',
          ],
          feedback: [
            '可行要求时间与费用同时满足。',
            'Feasibility requires both time and money conditions.',
          ],
        },
        {
          text: [
            'B 满足两项约束，A 要修改再核验',
            'B meets both constraints; A needs revision and another check',
          ],
          feedback: [
            '判断具体约束，不把便宜等同唯一最优。',
            'Check the actual constraints; cheap does not mean uniquely best.',
          ],
        },
      ],
      step: [
        '两个条件用“并且”连接，不能只验证一个。',
        'The two conditions are joined by AND, so check both.',
      ],
    },
    reason: [
      '给四人、预算八十、预留百分之十、允许四小时的虚构计划选择路线和活动，说明折扣、时间和一个取舍。',
      'For four people, budget eighty, ten-percent reserve and four allowed hours, choose a fictional route and activity. Explain discount, time and a trade-off.',
    ],
    rubric: [
      '一份可行证据是绕行花园：整组往返二十四，门票四乘八再付百分之七十五得二十四，午餐二十四，总支出七十二；预算八十预留八，可用七十二，恰好满足。去返各六十、花园六十、午餐三十、机动三十，共二百四十分钟，09:00 至 13:00 恰好满足。直达花园八十八超可用十六；绕行展馆八十四也超预算且需二百七十分钟。绕行步道虽更便宜但时间二百七十分钟，不满足四小时。允许其他满足给定两项约束并有完整证据的方案；不能因出现“可行”自动掌握。家长核对人数、每组与每人、折扣基数、往返午餐机动、两条不等式和取舍。',
      'One feasible plan is scenic garden: group return fare twenty-four, tickets 4 × 8 × 75% = twenty-four, lunch twenty-four, total seventy-two. Budget eighty minus reserve eight leaves exactly seventy-two. Travel sixty each way, garden sixty, lunch thirty and buffer thirty total 240 minutes, 09:00 to 13:00. Direct garden costs eighty-eight, sixteen above the spendable limit; scenic museum costs eighty-four and needs 270 minutes. Scenic trail is cheaper but also needs 270 minutes, failing four hours. Accept another fully evidenced plan if it meets both stated constraints. Check people, group versus per-person charges, discount base, return/lunch/buffer time, both inequalities and a trade-off; the word feasible alone is insufficient.',
    ],
    misconception: [
      '漏算返程或午餐；重复乘整组车费；折扣整单；只检验钱或时间之一。',
      'Omitting return travel or lunch, multiplying a group fare per person, discounting the whole bill, or checking only one constraint.',
    ],
    prompts: [
      [
        '哪笔费用按组，哪笔按人？',
        'Which costs are per group and which per person?',
      ],
      [
        '把允许时长缩短三十分钟，原方案还行吗？',
        'If allowed time shrinks by thirty minutes, does the plan still work?',
      ],
    ],
  },
];
export const p68Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P68-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 4 ? 30 : 22,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P68',
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
            '用纸笔规划一次完全虚构的四人短途旅行，引用工作台给定表格。写两份方案，逐项列票价折扣、整组往返、每人餐费、预算预留和分钟时间表；用两条约束筛选，再把预算或截止时间改一次检验稳定性。说明这是课堂模型，真实计划还需核实开放时间、路线与其他条件。只需纸笔，不必出行或购买。',
            'Use paper to design a fully fictional four-person trip from the workshop tables. Compare two plans with itemised ticket discounts, group return transport, per-person lunches, reserve and minute schedules. Check both constraints, then change budget or deadline once. Explain that a classroom model does not verify opening times, routes or other real conditions. Paper is sufficient; no outing or purchase is needed.',
          ),
        }
      : {}),
  };
});
export function p68ReviewQuestion(id: string, round: number): Question {
  if (
    !/^P68-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid P68 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = 1 + (k % 8),
    b = 1 + (Math.floor(k / 8) % 5);
  let item: Item;
  if (i === 0) {
    const moving = 30 + 15 * b,
      stop = 15 * (k % 3),
      d = 2 * a;
    item = {
      stem: [
        `移动 ${d} km 用 ${moving} min，另停 ${stop} min。全程平均速度多少 km/h？`,
        `Cover ${d} km in ${moving} moving minutes plus ${stop} stopped minutes. Find whole-trip average km/h.`,
      ],
      value: `${d * 60}/${moving + stop}`,
      unit: 'km/h',
      step: [
        `总时间 ${moving + stop} min，${d}×60÷${moving + stop} km/h。`,
        `Elapsed ${moving + stop} minutes gives ${d} × 60 ÷ ${moving + stop} km/h.`,
      ],
      wrong: [String((d * 60) / (moving + stop) + 1)],
    };
  } else if (i === 1) {
    const amount = (a + b) * (b + 2);
    item = {
      stem: [
        `任务 ${amount} L，两泵每分钟 ${a} L 与 ${b} L，恒速同时无干扰。用多少分钟？`,
        `For ${amount} L, pumps run together at constant non-interfering ${a} and ${b} L/min. How many minutes?`,
      ],
      value: String(b + 2),
      unit: 'min',
      step: [
        `共同 ${a + b} L/min；${amount}÷${a + b}=${b + 2} min。`,
        `Combined ${a + b} L/min; ${amount} ÷ ${a + b} = ${b + 2} min.`,
      ],
      wrong: [String(amount), String(b + 3)],
    };
  } else if (i === 2) {
    const tickets = 20 * a,
      discount = 5 * b,
      other = 10 * b;
    item = {
      stem: [
        `假想门票 NZ$${tickets} 减 ${discount}%，另加不可折扣费用 NZ$${other}。总支出 NZD？`,
        `Fictional tickets NZ$${tickets} are ${discount}% off, plus ineligible costs NZ$${other}. Find total NZD.`,
      ],
      value: String((tickets * (100 - discount)) / 100 + other),
      unit: 'NZD',
      step: [
        `只有票价乘 ${100 - discount}%，再加 ${other}。`,
        `Multiply only tickets by ${100 - discount}%, then add ${other}.`,
      ],
      wrong: [String(tickets + other)],
    };
  } else if (i === 3) {
    const people = 4 * a + b,
      packs = Math.ceil(people / 4);
    item = {
      stem: [
        `给定图表某组 ${people} 人，票四张一包，每包 NZ$${4 * b}，只卖整包。买够票花多少 NZD？`,
        `A supplied chart records ${people} people. Tickets come only in packs of four at NZ$${4 * b}. Find the cost of enough tickets in NZD.`,
      ],
      value: String(packs * 4 * b),
      unit: 'NZD',
      step: [
        `至少 ${packs} 整包，费用 ${packs}×${4 * b}。`,
        `Buy at least ${packs} whole packs; cost ${packs} × ${4 * b}.`,
      ],
      wrong: [String((packs + 1) * 4 * b)],
    };
  } else if (k % 2 === 1) {
    const leg = 20 + 5 * a,
      visit = 30 + 10 * b;
    const duration = 2 * leg + visit + 30 + 30;
    item = {
      stem: [
        `允许三百分钟，去返各 ${leg} 分钟，活动 ${visit}，午餐三十，机动三十。时间还余多少分钟？`,
        `Allow three hundred minutes, with ${leg} each way, a ${visit}-minute visit, thirty for lunch and thirty buffer. Find remaining time in minutes.`,
      ],
      value: String(300 - duration),
      unit: 'min',
      step: [
        `完整时长 ${duration}，三百减它得 ${300 - duration} min；钱须另查。`,
        `Full duration ${duration}; subtract from three hundred for ${300 - duration} min. Money needs a separate check.`,
      ],
      wrong: [String(300 - duration + leg)],
    };
  } else {
    const budget = 100 + 20 * a,
      spend = 40 + 10 * b;
    item = {
      stem: [
        `虚构计划预算 NZ$${budget}、保护其 10%、支出 NZ$${spend}。保护预留后还可用多少 NZD？`,
        `A fictional plan has budget NZ$${budget}, 10% protected and spending NZ$${spend}. Find spendable NZD remaining after reserve.`,
      ],
      value: String((budget * 9) / 10 - spend),
      unit: 'NZD',
      step: [
        `可用 ${budget}×90%，再减 ${spend}；时间须另查。`,
        `Available money is ${budget} × 90% minus ${spend}; time still needs a separate check.`,
      ],
      wrong: [String(budget - spend)],
    };
  }
  return q(`${id}-R${round}`, i, item);
}
export const p68CheckQuestions: Question[] = [
  q('P68-CHECK-Q1', 0, {
    stem: [
      '12 km 移动九十分钟，另停三十分钟，全程平均速度多少 km/h？',
      'Cover 12 km in ninety moving minutes with thirty stopped minutes. Find whole-trip average km/h.',
    ],
    value: '6',
    unit: 'km/h',
    step: [
      '总时间两小时，12÷2=6。',
      'Elapsed time two hours gives 12 ÷ 2 = 6.',
    ],
    wrong: ['8', '24'],
  }),
  q('P68-CHECK-Q2', 1, {
    stem: [
      '任务 42 L，两泵恒速各 4 和 3 L/min，同时无干扰。用多少分钟？',
      'Fill 42 L using constant independent pumps at 4 and 3 L/min together. How many minutes?',
    ],
    value: '6',
    unit: 'min',
    step: [
      '共同七升每分钟，42÷7=6。',
      'Combined seven L/min gives 42 ÷ 7 = 6.',
    ],
    wrong: ['7', '10.5'],
  }),
  q('P68-CHECK-Q3', 2, {
    stem: [
      '门票 NZ$60 减 20%，另付不可折扣交通 NZ$12。总支出 NZD？',
      'Tickets NZ$60 are 20% off; add ineligible transport NZ$12. Find total NZD.',
    ],
    value: '60',
    unit: 'NZD',
    step: ['48+12=60。', '48 + 12 = 60.'],
    wrong: ['57.6', '48'],
  }),
  q('P68-CHECK-Q4', 2, {
    stem: [
      '预算 NZ$120 保护 10%，支出 NZ$99。保护预留后可用余额 NZD？',
      'Budget NZ$120 with 10% reserved; spending NZ$99. Find remaining spendable NZD.',
    ],
    value: '9',
    unit: 'NZD',
    step: ['120−12−99=9。', '120 − 12 − 99 = 9.'],
    wrong: ['21', '12'],
  }),
  q('P68-CHECK-Q5', 3, {
    stem: [
      '图表给某组十七人，票四张一包，NZ$12 每包，只卖整包。买够票费用 NZD？',
      'A supplied chart records seventeen people. Tickets are sold only in four-ticket NZ$12 packs. Find the purchase cost in NZD.',
    ],
    value: '60',
    unit: 'NZD',
    step: ['五包二十张共六十元。', 'Five packs give twenty tickets for sixty.'],
    wrong: ['51', '48'],
  }),
  pick('P68-CHECK-Q6', 3, specs[3]!.pick),
  q('P68-CHECK-Q7', 4, {
    stem: [
      '往返各四十分钟，活动六十，午餐三十，机动三十。总时长 min？',
      'Travel forty minutes each way, activity sixty, lunch thirty and buffer thirty. Find total minutes.',
    ],
    value: '200',
    unit: 'min',
    step: ['40×2+60+30+30=200。', '40 × 2 + 60 + 30 + 30 = 200.'],
    wrong: ['160', '170'],
  }),
  reasoning(
    'P68-CHECK-Q8',
    T(specs[4]!.reason),
    skills[4]!,
    T(specs[4]!.rubric),
    hints[4]!.map(T),
  ),
];
