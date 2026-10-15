import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
import { percentText, ratio, decimalText } from '../percentModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
type Form = 'percent' | 'quantity' | 'decimal';
type Item = {
  stem: Pair;
  value: string;
  steps: Pair;
  wrong: string[];
  form?: Form;
  unit?: Unit;
  diagram?: Question['diagram'];
};
type Pick = {
  stem: Pair;
  options: { text: Pair; feedback: Pair }[];
  correct: number;
  steps: Pair;
};
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  lab: Lesson['lab'];
  parentGoal: Pair;
  misconception: Pair;
  prompts: Pair[];
  reason: Pair;
  rubric: Pair;
  exitReason: Pair;
  numbers: [Item, Item, Item, Item, Item, Item];
  pick: Pick;
};
const skills = [
  'per-hundred-reference',
  'decimal-percent-equivalence',
  'fraction-percent-exact',
  'percent-of-amount',
  'recover-percent-whole',
  'percent-change-base',
];
const hints: [Pair, Pair][] = [
  [
    [
      '先说实际整体多少，标记部分多少；卡片张数与每百份比例是不同问题。',
      'Name the actual whole and marked part; card counts and proportions per hundred answer different questions.',
    ],
    [
      '用部分÷整体，再改写成每百份。实际一张卡不一定占 1%。',
      'Divide part by whole, then express the same ratio per hundred. One source card need not be 1%.',
    ],
  ],
  [
    [
      '小数与百分数必须表示同一个数，先想百分号表示什么。',
      'The decimal and percentage must represent the same number. Recall what the percent sign means.',
    ],
    [
      '百分号表示除以一百；百分数前面的数为原小数的一百倍。反向转换则除以一百。',
      'The percent sign divides by one hundred, so its coefficient is one hundred times the decimal. Reverse by dividing the coefficient by one hundred.',
    ],
  ],
  [
    [
      '先找与原分数等值的每百份形式；不要只改分母。',
      'Find an equivalent per-hundred representation; never change only the denominator.',
    ],
    [
      '用分子÷分母×100 得百分数前面的数。循环结果保留带分数百分数，不把四舍五入当精确等值。',
      'Use numerator÷denominator×100 for the coefficient. Keep recurring results as mixed-number percentages, rather than treating rounding as exact.',
    ],
  ],
  [
    [
      '哪一个实际量是 100%？答案问的是比例，还是有单位的量？',
      'Which measured quantity is 100%? Does the question ask a proportion or an amount with units?',
    ],
    [
      '整体×百分率，或先求 1% 再乘份数。乘后保留实际量单位。',
      'Multiply the whole by the rate, or find 1% then scale. Keep the unit of the measured amount.',
    ],
  ],
  [
    [
      '已知部分对应给定百分数，不要把它误当 100%。',
      'The known part corresponds to the given percentage; do not mistake it for 100%.',
    ],
    [
      '先用已知量÷百分数前面的数求 1%，再乘一百；用整体乘原百分率核回。零百分率不能这样除。',
      'Divide the known amount by the percent coefficient to find 1%, then multiply by one hundred. Multiply back to check; a zero rate cannot be inverted.',
    ],
  ],
  [
    [
      '先圈出每一步的 100%，分清变化的钱与变化后价格。',
      'Circle the 100% base at each step; distinguish the change in money from the final price.',
    ],
    [
      '降 p% 保留 (100−p)%；涨 p% 得 (100+p)%。连续变化要为第二步更换参照整体。',
      'A p% discount retains (100−p)%; a p% increase gives (100+p)%. A second change uses a new base.',
    ],
  ],
];
function number(id: string, index: number, item: Item): Question {
  const r = exactRational(item.value)!;
  const form = item.form ?? 'percent';
  const equivalent = `${r[0] * 2n}/${r[1] * 2n}`;
  const canonical =
    form === 'percent'
      ? percentText(ratio(Number(r[0]), Number(r[1])))
      : item.value;
  const accepted =
    form === 'percent'
      ? [canonical, canonical.replace('%', '％')]
      : form === 'decimal'
        ? [decimalText(ratio(Number(r[0]), Number(r[1])))!]
        : [
            item.value,
            equivalent,
            ...(item.unit ? [`${item.value} ${item.unit}`] : []),
          ];
  const question = numeric(
    id,
    T(item.stem),
    item.value,
    skills[index]!,
    hints[index]!.map(T),
    [T(item.steps), T(hints[index]![1])],
    { accepted, rejected: item.wrong },
    item.diagram,
  );
  question.answer = {
    kind: 'number',
    value: canonical,
    unit: item.unit,
    formats:
      form === 'quantity'
        ? ['decimal', 'fraction']
        : form === 'percent'
          ? ['percent']
          : ['decimal'],
  };
  question.type = item.unit
    ? 'word_problem'
    : item.diagram
      ? 'visual_select'
      : 'numeric';
  question.misconceptionTags = [
    skills[index]!,
    'reference-whole',
    'representation',
    ...(item.unit ? ['reading-units'] : []),
  ];
  return question;
}
function pick(id: string, index: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[index]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[index]!.map(T),
    [T(p.steps)],
  );
}
const specs: Spec[] = [
  {
    title: ['百分数就是每一百份', 'Percentage means per hundred'],
    objective: [
      '把百分数解释为以同一整体作一百份的比例，区分比例与实际个数。',
      'Explain percentages as proportions per hundred of the same whole, distinguishing proportions from actual counts.',
    ],
    prerequisites: ['P53-L04', 'B04-L04', 'P61-L03'],
    keywords: [
      ['百分数', 'percentage'],
      ['参照整体', 'reference whole'],
      ['每百份', 'per hundred'],
    ],
    hook: [
      '四十张卡中十张有圆点，为什么是 25%，不是 10%？百格图上二十五格是否表示凭空多了十五张卡？',
      'Ten of forty cards are marked. Why is that 25%, rather than 10%? Do twenty-five shaded cells create fifteen extra cards?',
    ],
    lab: 'percent-hundred',
    parentGoal: [
      '让孩子把实际张数、部分/整体和每百份三种描述对应起来。',
      'Ask the learner to connect actual counts, part/whole and a per-hundred representation.',
    ],
    misconception: [
      '把部分个数直接加百分号；把百格标准图误认为原样本有一百张。',
      'Adding a percent sign to the part count, or assuming the original sample contains one hundred cards.',
    ],
    prompts: [
      ['哪一组才是本题完整的整体？', 'Which collection is the actual whole?'],
      [
        '同样 25% 在四十张与八十张里分别是多少张？',
        'How many marked cards does 25% mean in forty cards and in eighty?',
      ],
    ],
    reason: [
      '解释四十张中十张与八十张中二十张为什么都是 25%，而实际标记张数不同。',
      'Explain why ten of forty and twenty of eighty are both 25%, despite different marked counts.',
    ],
    rubric: [
      '先确认两个整体分别是四十张和八十张。10/40 与 20/80 都约为 1/4，换成每百份均为 25/100。25% 描述比例，不保证部分个数相同；两组分别十张、二十张，不能把百格图的涂色格数直接当实际张数。家长可接受同长条、等值分数或比例说明，但必须说清各自整体。',
      'Identify the two wholes as forty cards and eighty cards. Both 10/40 and 20/80 equal one quarter, or 25/100. The percentage describes a proportion, so actual marked counts can differ: ten versus twenty. Do not interpret standardized shaded cells as actual cards. Accept equivalent fractions, equal-length bars or a clear proportional explanation, provided the learner identifies both reference wholes.',
    ],
    exitReason: [
      '说明每百份的数与实际圆点数为什么可以不同。',
      'Explain why a per-hundred coefficient can differ from the actual marked count.',
    ],
    numbers: [
      {
        stem: [
          '四十张卡中十张有标记，占整体百分之几？包含 %。',
          'Ten of forty cards are marked. What percentage is marked? Include %.',
        ],
        value: '1/4',
        steps: [
          '10/40=1/4=25/100=25%，实际仍只有十张标记卡。',
          '10/40=1/4=25/100=25%; the actual marked count remains ten.',
        ],
        wrong: ['10%', '40%', '25', '0.25'],
        diagram: { kind: 'percent-source', selected: 10, total: 40 },
      },
      {
        stem: [
          '二十张卡中六张有标记，占百分之几？',
          'Six of twenty cards are marked. What percentage is marked?',
        ],
        value: '3/10',
        steps: [
          '6/20=30/100=30%。一张卡在这个整体里占 5%。',
          '6/20=30/100=30%. One card in this collection represents 5%.',
        ],
        wrong: ['6%', '20%', '30'],
      },
      {
        stem: [
          '八十张卡中一张有标记，占百分之几？保留精确值。',
          'One of eighty cards is marked. What exact percentage is marked?',
        ],
        value: '1/80',
        steps: [
          '1/80=1.25/100=1.25%，每百份的数不必是整数。',
          '1/80=1.25/100=1.25%; a per-hundred coefficient need not be an integer.',
        ],
        wrong: ['1%', '80%', '1.25', '0.0125%'],
      },
      {
        stem: [
          '五十张卡没有一张有标记，占百分之几？',
          'None of fifty cards is marked. What percentage is marked?',
        ],
        value: '0',
        steps: [
          '0/50=0，换成百分数为 0%；整体仍是五十张。',
          '0/50=0=0%; the whole still contains fifty cards.',
        ],
        wrong: ['50%', '100%', '0'],
      },
      {
        stem: [
          '四十张卡全部有标记，占百分之几？',
          'All forty cards are marked. What percentage is marked?',
        ],
        value: '1',
        steps: [
          '40/40=1=100%，完整整体对应百分之一百。',
          '40/40=1=100%; the complete reference whole corresponds to one hundred percent.',
        ],
        wrong: ['40%', '1%', '100'],
      },
      {
        stem: [
          '六十张假想票卡中十八张有星号，占百分之几？',
          'Eighteen of sixty fictional tickets have stars. What percentage have stars?',
        ],
        value: '3/10',
        steps: [
          '18/60=3/10=30/100=30%，参照整体是六十张。',
          '18/60=3/10=30/100=30%; the reference whole is sixty tickets.',
        ],
        wrong: ['18%', '60%', '30'],
      },
    ],
    pick: {
      stem: [
        '哪个解释正确表示四十张卡中十张有标记？',
        'Which correctly interprets ten marked cards out of forty?',
      ],
      correct: 1,
      options: [
        {
          text: ['10%，因为有十张标记卡', '10%, because ten cards are marked'],
          feedback: [
            '十是部分个数；需要与整体四十比较。',
            'Ten is a count; compare it with the whole of forty.',
          ],
        },
        {
          text: [
            '25%，因为部分占整体的四分之一',
            '25%, because the part is one quarter of the whole',
          ],
          feedback: [
            '10/40=1/4=25/100，整体与比例都清楚。',
            '10/40=1/4=25/100 identifies both the whole and proportion.',
          ],
        },
        {
          text: [
            '百格涂二十五格，所以实际有二十五张标记卡',
            'Twenty-five shaded cells mean twenty-five actual marked cards',
          ],
          feedback: [
            '百格标准图显示比例，实际样本仍是四十张中的十张。',
            'The standardized grid shows a proportion; the actual sample still has ten marked cards out of forty.',
          ],
        },
      ],
      steps: [
        '用部分除整体得到 10/40，再换成每百份 25/100。',
        'Divide part by whole: 10/40, equivalent to 25/100.',
      ],
    },
  },
  {
    title: ['小数变百分数', 'Converting decimals to percentages'],
    objective: [
      '用百分号的每百份意义解释小数与百分数互化，保持数值不变。',
      'Use the per-hundred meaning of the percent sign to convert decimals and percentages while preserving value.',
    ],
    prerequisites: ['P62-L01', 'P52-L01'],
    keywords: [
      ['同一个数', 'same value'],
      ['百分号', 'percent sign'],
      ['千分位', 'thousandths'],
    ],
    hook: [
      '0.375 和 37.5% 的数字看起来不同，为什么表示同样多？0.375% 又表示多少？',
      'Why do 0.375 and 37.5% represent the same amount despite their different digits? What does 0.375% represent?',
    ],
    lab: 'percent-decimal',
    parentGoal: [
      '用“百分号表示除以一百”解释互化，不只背移小数点。',
      'Explain conversion through division by one hundred, beyond memorizing decimal-point shifts.',
    ],
    misconception: [
      '只添百分号或认为互化真的把原数量放大一百倍。',
      'Appending a percent sign without changing the coefficient, or claiming conversion enlarges the quantity one hundredfold.',
    ],
    prompts: [
      ['37.5% 写成除法是什么？', 'How do you write 37.5% as a division?'],
      [
        '为什么 1.25 可以超过 100%？',
        'Why can 1.25 correspond to more than 100%?',
      ],
    ],
    reason: [
      '解释 0.375=37.5%，但 0.375≠0.375%。百分号起了什么作用？',
      'Explain why 0.375=37.5% but 0.375≠0.375%. What does the percent sign do?',
    ],
    rubric: [
      '37.5% 定义为 37.5÷100，等于 0.375。互化时百分数前面的数放大一百倍，但百分号同时表示除以一百，所以原数值保持不变。只添百分号会得到 0.00375，比原数小一百倍。可用 375/1000 与 37.5/100 的等值关系或同一百格图说明；必须区分数字系数改变和数量不变。',
      '37.5% means 37.5 divided by one hundred, which equals 0.375. Conversion makes the coefficient one hundred times as large while the percent sign divides it by one hundred, preserving the represented value. Simply appending % gives 0.00375 instead. Equivalent fractions or an unchanged hundred grid can support the explanation; distinguish a changed coefficient from an unchanged quantity.',
    ],
    exitReason: [
      '用除以一百反向检验百分数是否等于原小数。',
      'Divide the percent coefficient by one hundred to check the original decimal.',
    ],
    numbers: [
      {
        stem: [
          '把 0.375 写成百分数，包含 %。',
          'Write 0.375 as a percentage, including %.',
        ],
        value: '0.375',
        steps: [
          '0.375=37.5/100=37.5%；不是 0.375%。',
          '0.375=37.5/100=37.5%, not 0.375%.',
        ],
        wrong: ['0.375%', '375%', '37.5', '0.375'],
      },
      {
        stem: ['把 0.035 写成百分数。', 'Write 0.035 as a percentage.'],
        value: '0.035',
        steps: [
          '0.035×100=3.5，故 0.035=3.5%。',
          '0.035×100=3.5, so 0.035=3.5%.',
        ],
        wrong: ['35%', '0.035%', '3.5'],
      },
      {
        stem: ['把 1.25 写成百分数。', 'Write 1.25 as a percentage.'],
        value: '1.25',
        steps: [
          '1.25=125/100=125%，比一个整体多四分之一。',
          '1.25=125/100=125%, one quarter beyond a reference whole.',
        ],
        wrong: ['12.5%', '1.25%', '125'],
      },
      {
        stem: ['把 0.5 写成百分数。', 'Write 0.5 as a percentage.'],
        value: '0.5',
        steps: [
          '0.5=50/100=50%，正好一个整体的一半。',
          '0.5=50/100=50%, exactly half of the reference whole.',
        ],
        wrong: ['5%', '0.5%', '50'],
      },
      {
        stem: [
          '反向检查：37.5% 等于哪个小数？请不加百分号。',
          'Reverse check: what decimal equals 37.5%? Do not include %.',
        ],
        value: '0.375',
        form: 'decimal',
        steps: ['37.5% 意为 37.5÷100=0.375。', '37.5% means 37.5÷100=0.375.'],
        wrong: ['37.5', '0.0375', '37.5%', '3/8'],
      },
      {
        stem: ['把 0.008 写成百分数。', 'Write 0.008 as a percentage.'],
        value: '0.008',
        steps: [
          '0.008=0.8/100=0.8%，小于 1%。',
          '0.008=0.8/100=0.8%, less than 1%.',
        ],
        wrong: ['8%', '0.008%', '0.8'],
      },
    ],
    pick: {
      stem: [
        '把 0.6 写成百分数，哪个理由正确？',
        'Which correctly explains writing 0.6 as a percentage?',
      ],
      correct: 2,
      options: [
        {
          text: ['0.6%，只要添 %', '0.6%; just append %'],
          feedback: [
            '0.6% 表示 0.006，数值改变。',
            '0.6% means 0.006, so the value changes.',
          ],
        },
        {
          text: [
            '60%，因为原数量变大一百倍',
            '60%, because the quantity becomes one hundred times larger',
          ],
          feedback: [
            '60% 的结果正确，但数量未放大：60÷100=0.6。',
            '60% is correct, but the quantity stays unchanged: 60÷100=0.6.',
          ],
        },
        {
          text: [
            '60%，因为 60/100 与 0.6 等值',
            '60%, because 60/100 equals 0.6',
          ],
          feedback: [
            '系数和百分号要一起解释；这个理由保持原量。',
            'Interpret the coefficient and percent sign together to preserve value.',
          ],
        },
      ],
      steps: [
        '0.6=60/100=60%，每百份表示改变，原数不变。',
        '0.6=60/100=60%; the representation changes while the number stays the same.',
      ],
    },
  },
  {
    title: ['分数变百分数', 'Converting fractions to percentages'],
    objective: [
      '把分数写成等值百分数，区分精确的循环结果与四舍五入近似。',
      'Express fractions as equivalent percentages and distinguish exact recurring results from rounded approximations.',
    ],
    prerequisites: ['P62-L02', 'P53-L04', 'P61-L02'],
    keywords: [
      ['等值', 'equivalence'],
      ['精确值', 'exact value'],
      ['近似值', 'approximation'],
    ],
    hook: [
      '3/8 能写成 37.5%。1/3 能否精确写成 33.3%？百格图不足一格的面积应该怎么办？',
      'Three eighths is 37.5%. Is one third exactly 33.3%? What should happen to a partial cell on a hundred grid?',
    ],
    lab: 'percent-fraction',
    parentGoal: [
      '认可带分数百分数的精确表达，要求近似另标约等号。',
      'Accept exact mixed-number percentages and require an approximation sign for rounded results.',
    ],
    misconception: [
      '只把分母改成一百；把 33.3% 当成 1/3 的精确值。',
      'Changing only the denominator, or treating 33.3% as exactly one third.',
    ],
    prompts: [
      [
        '这个百分数乘回分母能恢复分子吗？',
        'Does multiplying this rate by the denominator recover the numerator?',
      ],
      [
        '等号与约等号分别在什么地方？',
        'Where should you use equality and approximation signs?',
      ],
    ],
    reason: [
      '解释 1/3=33 1/3%，但按一位小数只能写 1/3≈33.3%。',
      'Explain why 1/3=33 1/3%, while rounding to one decimal place gives only 1/3≈33.3%.',
    ],
    rubric: [
      '百分数前面的系数为 (1/3)×100=100/3=33又1/3，所以 33 1/3% 除以一百恢复 1/3，精确成立。33.3% 等于 333/1000，不等于 1/3；乘三得 0.999 而不是一，只是取一位小数的近似。家长应看到对百分号、精确参照与约等号的说明，不要求记住特定句子。',
      'The percent coefficient is (1/3)×100=100/3, or thirty-three and one third. Dividing that coefficient by one hundred restores one third exactly. In contrast, 33.3%=333/1000; multiplying by three gives 0.999 rather than one. It is a rounded approximation to one decimal place. Look for an explanation of the percent sign, exact equivalence and approximation rather than a memorized phrase.',
    ],
    exitReason: [
      '说明精确百分数与可能的近似显示，不混用等号。',
      'Distinguish the exact percentage from a possible rounded display.',
    ],
    numbers: [
      {
        stem: ['把 3/8 写成精确百分数。', 'Write 3/8 as an exact percentage.'],
        value: '3/8',
        steps: ['3÷8=0.375，因此 3/8=37.5%。', '3÷8=0.375, so 3/8=37.5%.'],
        wrong: ['3.8%', '38%', '37.5', '3/8'],
        diagram: { kind: 'percent-grid', value: { n: 3, d: 8 } },
      },
      {
        stem: [
          '把 7/20 写成精确百分数。',
          'Write 7/20 as an exact percentage.',
        ],
        value: '7/20',
        steps: [
          '分子分母同乘五：7/20=35/100=35%。',
          'Multiply numerator and denominator by five: 7/20=35/100=35%.',
        ],
        wrong: ['7%', '20%', '35'],
      },
      {
        stem: [
          '把 1/3 写成精确百分数，可用 33 1/3% 的格式。',
          'Write 1/3 as an exact percentage; mixed-number notation such as 33 1/3% is allowed.',
        ],
        value: '1/3',
        steps: [
          '1/3×100=100/3=33又1/3，故精确为 33 1/3%。33.3% 只是近似。',
          '1/3×100=100/3=33 1/3, giving exactly 33 1/3%. The decimal 33.3% is only approximate.',
        ],
        wrong: ['33.3%', '33.33%', '1/3', '100/3'],
      },
      {
        stem: ['把 5/4 写成精确百分数。', 'Write 5/4 as an exact percentage.'],
        value: '5/4',
        steps: [
          '5/4=1.25=125%；假分数可以大于一个整体。',
          '5/4=1.25=125%; an improper fraction can exceed one reference whole.',
        ],
        wrong: ['5%', '54%', '125'],
      },
      {
        stem: [
          '把 2/3 写成精确百分数，可用带分数百分数。',
          'Write 2/3 as an exact percentage; a mixed-number percentage is allowed.',
        ],
        value: '2/3',
        steps: [
          '2/3×100=200/3=66又2/3，所以精确为 66 2/3%。',
          '2/3×100=200/3=66 2/3, so the exact rate is 66 2/3%.',
        ],
        wrong: ['66.7%', '66.6%', '2/3'],
      },
      {
        stem: ['把 3/5 写成精确百分数。', 'Write 3/5 as an exact percentage.'],
        value: '3/5',
        steps: [
          '分子分母同乘二十：3/5=60/100=60%。',
          'Multiply numerator and denominator by twenty: 3/5=60/100=60%.',
        ],
        wrong: ['35%', '3%', '60'],
      },
    ],
    pick: {
      stem: [
        '关于 1/3 的百分数，哪句正确？',
        'Which statement about one third as a percentage is correct?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '精确为 33 1/3%，约为 33.3%',
            'Exactly 33 1/3%, approximately 33.3%',
          ],
          feedback: [
            '精确的带分数百分数与近似小数已区分。',
            'This separates the exact mixed-number percentage from the rounded decimal.',
          ],
        },
        {
          text: [
            '精确为 33.3%，两者完全相等',
            'Exactly 33.3%; they are identical',
          ],
          feedback: [
            '33.3%×3=99.9%，没有恢复 100%。',
            '33.3%×3=99.9%, which does not restore 100%.',
          ],
        },
        {
          text: [
            '不能把分母变成一百，所以没有百分数',
            'No percentage exists because the denominator cannot become one hundred',
          ],
          feedback: [
            '百分数前面的数不一定是整数；仍可用 100/3。',
            'The percent coefficient need not be an integer; it can be 100/3.',
          ],
        },
      ],
      steps: [
        '百分数系数为 100/3，精确保留；取一位小数时另写约等号。',
        'Keep the coefficient 100/3 exact, and use an approximation sign when rounding to one decimal place.',
      ],
    },
  },
  {
    title: ['求一个数的百分之几', 'Finding a percentage of an amount'],
    objective: [
      '先确认 100% 的实际量，用乘法求给定百分比对应的量并保留单位。',
      'Identify the actual 100% reference and multiply to find the amount for a given percentage, retaining units.',
    ],
    prerequisites: ['P62-L03', 'P61-L03'],
    keywords: [
      ['整体量', 'whole amount'],
      ['百分率', 'percentage rate'],
      ['实际份额', 'measured share'],
    ],
    hook: [
      '八十升的 35% 是三十五升吗？若把整体改成四十升，同样的 35% 会怎样？',
      'Is 35% of eighty litres thirty-five litres? What changes if the whole becomes forty litres while the rate stays 35%?',
    ],
    lab: 'percent-amount',
    parentGoal: [
      '让孩子先指认整体与量的单位，再求部分并检查量级。',
      'Ask the learner to identify the whole and units before calculating the part and checking its size.',
    ],
    misconception: [
      '把百分数前面的数直接当升数；把百分号漏掉导致放大一百倍。',
      'Treating a percent coefficient as litres, or omitting the percent sign and enlarging the result one hundredfold.',
    ],
    prompts: [
      ['哪一个量对应 100%？', 'Which amount corresponds to 100%?'],
      [
        '35% 比一半小，答案应比整体的一半怎样？',
        'Since 35% is less than half, how should the result compare with half the whole?',
      ],
    ],
    reason: [
      '同样 35%，八十升得到二十八升，四十升得到十四升。解释为什么百分率相同，实际量却不同。',
      'At the same 35% rate, eighty litres gives twenty-eight litres while forty litres gives fourteen. Explain the different amounts.',
    ],
    rubric: [
      '百分率 35%=35/100=7/20 描述所取比例，必须作用在指定整体上。80×35/100=28 L，而 40×35/100=14 L；第二个整体减半，所得量也减半。两者都小于各自的一半，且各自部分÷整体都为 35%。家长核对比例、整体、实际单位与量级检查，不能仅凭数值正确认可解释。',
      'The rate 35%=35/100=7/20 describes a proportion applied to a specified whole. Multiplying eighty by the rate gives 28 L, while forty gives 14 L. Halving the whole halves the selected amount. Each result is below half of its own whole, and each part divided by its whole gives 35%. Review the stated bases, measured units and size check rather than accepting numbers alone.',
    ],
    exitReason: [
      '用部分除整体核回百分率，并保留质量单位。',
      'Divide the part by the whole to check the rate and retain the mass unit.',
    ],
    numbers: [
      {
        stem: ['80 L 的 35% 是多少升？', 'How many litres are 35% of 80 L?'],
        value: '28',
        form: 'quantity',
        unit: 'L',
        steps: [
          '80×35/100=28 L；1% 是 0.8 L。',
          '80×35/100=28 L; 1% is 0.8 L.',
        ],
        wrong: ['35', '2800', '28%'],
        diagram: {
          kind: 'percent-axis',
          rate: 35,
          wholeLabel: '80 L',
          partLabel: '? L',
        },
      },
      {
        stem: [
          '240 g 的 12.5% 是多少克？',
          'How many grams are 12.5% of 240 g?',
        ],
        value: '30',
        form: 'quantity',
        unit: 'g',
        steps: ['12.5%=1/8，240÷8=30 g。', '12.5%=1/8, so 240÷8=30 g.'],
        wrong: ['12.5', '3000', '30 L'],
      },
      {
        stem: [
          '需求为参考量 12 L 的 125%，需要多少升？',
          'A requirement is 125% of a 12 L reference amount. How many litres are needed?',
        ],
        value: '15',
        form: 'quantity',
        unit: 'L',
        steps: [
          '125%=5/4，12×5/4=15 L，比参考量多四分之一。',
          '125%=5/4, so 12×5/4=15 L, one quarter beyond the reference.',
        ],
        wrong: ['12.5', '125', '15%'],
      },
      {
        stem: ['6 L 的 0% 是多少升？', 'How many litres are 0% of 6 L?'],
        value: '0',
        form: 'quantity',
        unit: 'L',
        steps: [
          '6×0/100=0 L，参考整体仍是六升。',
          '6×0/100=0 L; the reference whole remains six litres.',
        ],
        wrong: ['6', '100', '0%'],
      },
      {
        stem: [
          '5 L 的 30% 是多少升？保留精确量。',
          'How many litres are 30% of 5 L? Keep the amount exact.',
        ],
        value: '1.5',
        form: 'quantity',
        unit: 'L',
        steps: [
          '5×30/100=150/100=1.5 L，不截成整数升。',
          '5×30/100=1.5 L; do not truncate to whole litres.',
        ],
        wrong: ['1', '30', '1.5%'],
      },
      {
        stem: ['200 g 的 2.5% 是多少克？', 'How many grams are 2.5% of 200 g?'],
        value: '5',
        form: 'quantity',
        unit: 'g',
        steps: [
          '200×2.5/100=5 g，2.5% 是四十分之一。',
          '200×2.5/100=5 g; 2.5% is one fortieth.',
        ],
        wrong: ['2.5', '50', '5 L'],
      },
    ],
    pick: {
      stem: [
        '要求 80 L 的 35%，哪个关系正确？',
        'Which relationship finds 35% of 80 L?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '35 L，因为是百分之三十五',
            '35 L because the rate is thirty-five percent',
          ],
          feedback: [
            '三十五是每百份系数，不是实际升数。',
            'Thirty-five is a per-hundred coefficient, not a measured litre amount.',
          ],
        },
        {
          text: ['80×35/100 L', '80×35/100 L'],
          feedback: [
            '先把整体八十升对应 100%，再乘所取比例。',
            'Match eighty litres with 100%, then multiply by the selected proportion.',
          ],
        },
        {
          text: ['80÷35/100 L', '80÷35/100 L'],
          feedback: [
            '这会反求整体或错误改变运算顺序；本题整体已经知道。',
            'Division would reverse the relationship; this question already gives the whole.',
          ],
        },
      ],
      steps: [
        '整体量乘无单位的比例，所得部分保留整体量的单位。',
        'Multiply the whole amount by the dimensionless proportion; the part keeps the measurement unit.',
      ],
    },
  },
  {
    title: ['已知部分求整体', 'Finding the whole from a percentage'],
    objective: [
      '把已知部分对应到给定百分数，反求 100% 并用乘回关系核查。',
      'Match the known part to its given percentage, recover 100%, and verify by multiplication.',
    ],
    prerequisites: ['P62-L04', 'P61-L06'],
    keywords: [
      ['已知部分', 'known part'],
      ['反求整体', 'recover the whole'],
      ['乘回核查', 'multiply back'],
    ],
    hook: [
      '18 L 是整桶的 30%。18 L 应放在双数轴的 30% 还是 100%？直接算 18×30% 会求到什么？',
      'Eighteen litres is 30% of a container. Does 18 L belong at 30% or 100%? What would multiplying 18 by 30% find instead?',
    ],
    lab: 'percent-whole',
    parentGoal: [
      '要求孩子先标出对应关系，再解释为什么用除法并核回原部分。',
      'Require the learner to mark the correspondence, explain division, and recover the known part by checking.',
    ],
    misconception: [
      '用已知部分再乘百分率；在 0% 条件下照样除零。',
      'Multiplying the known part by the rate, or dividing by zero for a 0% condition.',
    ],
    prompts: [
      [
        '已知的十八升标在百分数轴哪里？',
        'Where does the known eighteen litres sit on the percent scale?',
      ],
      [
        '你找的整体乘 30% 会回到十八升吗？',
        'Does your recovered whole multiplied by 30% give eighteen litres?',
      ],
    ],
    reason: [
      '为什么“18 L 是整体的 30%”要算 18÷30%，而不是 18×30%？用对应与乘回说明。',
      'Why does “18 L is 30% of the whole” require 18÷30%, rather than 18×30%? Explain the correspondence and check.',
    ],
    rubric: [
      '十八升对应 30%，不是 100%。可以先求 1%=18÷30=0.6 L，再乘一百得六十升；也可列整体×0.3=18，所以整体=18÷0.3=60 L。核回 60×0.3=18 L。18×0.3=5.4 L 求的是十八升本身的 30%，换错了整体。应明确正百分率才能反求；零百分率不能求唯一正整体。',
      'Eighteen litres corresponds to 30%, not 100%. Find 1% as 18÷30=0.6 L, then scale to sixty litres, or solve whole×0.3=18 by dividing eighteen by 0.3. Multiplying back sixty by 0.3 restores eighteen litres. In contrast, 18×0.3 finds 30% of eighteen litres itself, changing the base. A positive rate is needed for this inverse calculation; a zero rate cannot identify a unique positive whole.',
    ],
    exitReason: [
      '明确给定部分的百分率，反求后再乘回原量。',
      'State the known part’s percentage, recover the whole, and multiply back.',
    ],
    numbers: [
      {
        stem: [
          '18 L 是总量的 30%，总量多少升？',
          '18 L is 30% of the total. How many litres are in the total?',
        ],
        value: '60',
        form: 'quantity',
        unit: 'L',
        steps: [
          '1%=18÷30=0.6 L，100%=60 L；60×30%=18 L。',
          '1%=18÷30=0.6 L, so 100%=60 L. Check 60×30%=18 L.',
        ],
        wrong: ['5.4', '54', '60%'],
        diagram: {
          kind: 'percent-axis',
          rate: 30,
          wholeLabel: '? L',
          partLabel: '18 L',
        },
      },
      {
        stem: [
          '12 L 是整体的 25%，整体多少升？',
          '12 L is 25% of the whole. How many litres is the whole?',
        ],
        value: '48',
        form: 'quantity',
        unit: 'L',
        steps: [
          '25%=1/4，整体是十二升的四倍，即 48 L。',
          '25%=1/4, so the whole is four times twelve litres: 48 L.',
        ],
        wrong: ['3', '25', '48%'],
      },
      {
        stem: [
          '15 g 是总质量的 12.5%，总质量多少克？',
          '15 g is 12.5% of the total mass. What is the total in grams?',
        ],
        value: '120',
        form: 'quantity',
        unit: 'g',
        steps: [
          '12.5%=1/8，整体=15×8=120 g。',
          '12.5%=1/8, so the whole is 15×8=120 g.',
        ],
        wrong: ['1.875', '125', '120 L'],
      },
      {
        stem: [
          '30 L 的需求相当于参考量的 125%，参考量多少升？',
          'A 30 L requirement is 125% of a reference amount. How many litres is the reference?',
        ],
        value: '24',
        form: 'quantity',
        unit: 'L',
        steps: [
          '125%=5/4，参考量=30÷(5/4)=24 L；24×1.25=30。',
          '125%=5/4, so the reference is 30÷(5/4)=24 L. Check 24×1.25=30.',
        ],
        wrong: ['37.5', '125', '24%'],
      },
      {
        stem: [
          '7 L 是整体的 40%，整体多少升？保留精确值。',
          '7 L is 40% of the whole. How many litres is the whole? Keep it exact.',
        ],
        value: '17.5',
        form: 'quantity',
        unit: 'L',
        steps: [
          '整体=7÷0.4=17.5 L；17.5×0.4=7 L。',
          'The whole is 7÷0.4=17.5 L. Check 17.5×0.4=7 L.',
        ],
        wrong: ['2.8', '17', '17.5%'],
      },
      {
        stem: [
          '9 g 是总质量的 15%，总质量多少克？',
          '9 g is 15% of the total mass. What is the total mass in grams?',
        ],
        value: '60',
        form: 'quantity',
        unit: 'g',
        steps: [
          '1%=9÷15=0.6 g，所以总质量 60 g；60×15%=9。',
          '1%=9÷15=0.6 g, so the total is 60 g. Check 60×15%=9.',
        ],
        wrong: ['1.35', '15', '60 L'],
      },
    ],
    pick: {
      stem: [
        '已知零升是整体的 0%，能确定唯一的正整体吗？',
        'Zero litres is 0% of the whole. Does this determine a unique positive whole?',
      ],
      correct: 2,
      options: [
        {
          text: ['可以，整体一定零升', 'Yes; the whole must be zero litres'],
          feedback: [
            '任意正整体的 0% 都是零，不只零整体。',
            'Every positive whole has zero as its 0%, so no unique whole follows.',
          ],
        },
        {
          text: ['可以，直接 0÷0 得一升', 'Yes; 0÷0 directly gives one litre'],
          feedback: [
            '0÷0 没有唯一商，不能这样反求。',
            '0÷0 has no unique quotient and cannot recover the whole.',
          ],
        },
        {
          text: ['不能，许多正整体都符合条件', 'No; many positive wholes fit'],
          feedback: [
            '例如一升与十升的 0% 都是零升，条件不足。',
            'For example, both one litre and ten litres have zero litres as 0%; the information is insufficient.',
          ],
        },
      ],
      steps: [
        '零百分率不能唯一反求整体；若已知部分为正数却标 0%，条件则矛盾。',
        'A zero rate cannot identify a unique whole. A positive part labeled 0% would instead be inconsistent.',
      ],
    },
  },
  {
    title: [
      '折扣、涨价与百分比变化',
      'Discounts, increases and percentage change',
    ],
    objective: [
      '以每一步原量作 100%，区分变化量与新量，并解释连续变化及百分点。',
      'Use each step’s starting quantity as 100%, distinguish change from final amount, and explain successive changes and percentage points.',
    ],
    prerequisites: ['P62-L05', 'P52-L06'],
    keywords: [
      ['原价', 'original price'],
      ['变化率', 'relative change'],
      ['百分点', 'percentage points'],
    ],
    hook: [
      '假想价格 NZ$80 降 20% 后，再按新价涨 20%，会回到 NZ$80 吗？第二步的 100% 还是八十元吗？',
      'A fictional NZ$80 price falls by 20% and then rises by 20% of its new price. Does it return to NZ$80? Is the second 100% still eighty dollars?',
    ],
    lab: 'percent-change',
    parentGoal: [
      '逐步标参照价格，检查节省额、新价、相对变化率与百分点的不同问题。',
      'Mark the price base at each step and distinguish savings, final price, relative change and percentage points.',
    ],
    misconception: [
      '八折误作减八成；同率降涨相互抵消；百分率差直接等同相对增长率。',
      'Treating “pay 80%” as 80% off, canceling equal up/down rates, or confusing percentage-point difference with relative growth.',
    ],
    prompts: [
      [
        '这一步百分率乘的是哪个价格？',
        'Which price is this step’s rate applied to?',
      ],
      [
        '从 20% 到 30% 相差多少百分点，相对原来的 20% 又增长多少？',
        'From 20% to 30%, what is the percentage-point difference and what is the relative increase from 20%?',
      ],
    ],
    reason: [
      '解释 NZ$80 降 20% 后再涨 20% 为什么是 NZ$76.80。再区分比例从 20% 到 30% 的十个百分点与 50% 相对增长。',
      'Explain why NZ$80 reduced by 20% and then increased by 20% gives NZ$76.80. Distinguish a rise from 20% to 30% of ten percentage points from a 50% relative increase.',
    ],
    rubric: [
      '第一次以八十元为 100%，减十六得六十四；第二次以六十四为 100%，加十二元八角得七十六元八角。相同百分率作用在不同基数上，变化金额不同，不抵消。两个比例 30%−20%=10 个百分点；相对增长用差 10% 除原比例 20%，得 50%。家长应核对每次参照、单位和分母，不能只看到结果或术语就通过。',
      'The first base is eighty dollars: subtract sixteen to get sixty-four. The second base is sixty-four: add twelve dollars eighty to get seventy-six dollars eighty. Equal rates on different bases change different amounts and do not cancel. Separately, 30% minus 20% is ten percentage points; the relative increase divides that difference by the original 20%, giving 50%. Check the base, units and denominator at each stage rather than accepting a final number or terminology alone.',
    ],
    exitReason: [
      '分别说明降价率、保留原价比例和新价格。',
      'Distinguish the discount rate, retained proportion and final price.',
    ],
    numbers: [
      {
        stem: [
          '假想原价 NZ$80，降价 20%，新价多少新西兰元？无其他费用。',
          'A fictional NZ$80 price is reduced by 20%. What is the new price in NZ dollars, with no extra charges?',
        ],
        value: '64',
        form: 'quantity',
        unit: 'NZD',
        steps: [
          '降价 80×20%=16 元，新价 80−16=64 元，即原价的 80%。',
          'The reduction is 80×20%=16 dollars; the new price is 80−16=64 dollars, or 80% of the original.',
        ],
        wrong: ['16', '20', '64%'],
      },
      {
        stem: [
          '同样 NZ$80 降 20%，节省多少新西兰元？',
          'For the same NZ$80 price reduced by 20%, how many NZ dollars are saved?',
        ],
        value: '16',
        form: 'quantity',
        unit: 'NZD',
        steps: [
          '问的是变化的钱：80×20%=16 元，不是新价六十四元。',
          'The question asks for the change: 80×20%=16 dollars, not the final sixty-four dollars.',
        ],
        wrong: ['64', '20', '16%'],
      },
      {
        stem: [
          '假想价格 NZ$64 涨 25%，新价多少新西兰元？',
          'A fictional NZ$64 price rises by 25%. What is the new price in NZ dollars?',
        ],
        value: '80',
        form: 'quantity',
        unit: 'NZD',
        steps: [
          '64×25%=16，涨后 64+16=80 元。',
          '64×25%=16, so the increased price is 64+16=80 dollars.',
        ],
        wrong: ['16', '89', '80%'],
      },
      {
        stem: [
          '假想价格由 NZ$50 涨到 NZ$65，以原价为整体，涨了百分之几？',
          'A fictional price rises from NZ$50 to NZ$65. What is the percentage increase relative to the original price?',
        ],
        value: '0.3',
        steps: [
          '增加十五元，15÷50=0.3=30%；分母是原价五十。',
          'The increase is fifteen dollars: 15÷50=0.3=30%, using the original fifty as denominator.',
        ],
        wrong: ['15%', '130%', '30', '300/13%'],
      },
      {
        stem: [
          'NZ$80 先降 20%，再按新价涨 20%，最后多少新西兰元？',
          'NZ$80 falls by 20% and then rises by 20% of the new price. What is the final price in NZ dollars?',
        ],
        value: '76.8',
        form: 'quantity',
        unit: 'NZD',
        steps: [
          '第一步 80×0.8=64，第二步 64×1.2=76.80；第二步参照已变。',
          'First 80×0.8=64, then 64×1.2=76.80; the second step uses a different base.',
        ],
        wrong: ['80', '64', '96', '76.8%'],
      },
      {
        stem: [
          '假想原价 NZ$120，降价 25%，新价多少新西兰元？',
          'A fictional NZ$120 price is reduced by 25%. What is the new price in NZ dollars?',
        ],
        value: '90',
        form: 'quantity',
        unit: 'NZD',
        steps: [
          '降价三十元，保留原价的 75%：120×0.75=90 元。',
          'The reduction is thirty dollars; retain 75% of the original: 120×0.75=90 dollars.',
        ],
        wrong: ['30', '25', '90%'],
      },
    ],
    pick: {
      stem: [
        '一个比例从 20% 变到 30%，哪句同时正确？',
        'A rate changes from 20% to 30%. Which pair of statements is correct?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '增加十个百分点，相对增长 10%',
            'Up ten percentage points; relative increase 10%',
          ],
          feedback: [
            '十个百分点是直接差；相对增长还要除原比例 20%。',
            'Ten percentage points is the direct difference; relative increase must divide by the original 20%.',
          ],
        },
        {
          text: [
            '增加十个百分点，相对增长 50%',
            'Up ten percentage points; relative increase 50%',
          ],
          feedback: [
            '(30−20)÷20=0.5，差与相对增长已区分。',
            '(30−20)÷20=0.5 distinguishes the difference from relative growth.',
          ],
        },
        {
          text: [
            '增加五十个百分点，相对增长 10%',
            'Up fifty percentage points; relative increase 10%',
          ],
          feedback: [
            '两个量交换了；直接差为三十减二十。',
            'The concepts are swapped; the direct difference is thirty minus twenty.',
          ],
        },
      ],
      steps: [
        '直接百分率差为十个百分点；相对增长率为 10%÷20%=50%。',
        'The direct rate difference is ten percentage points; relative growth is 10%÷20%=50%.',
      ],
    },
  },
];
export const p62Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P62-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 5 ? 22 : 18,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P62',
    order: i + 1,
    nzYearHints: [6, 7],
    cnGradeHints: [6],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: number(`${id}-G`, i, s.numbers[0]),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.numbers.slice(1, 5).map((n, j) => number(`${id}-Q${j + 2}`, i, n)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: number(`${id}-X`, i, s.numbers[5]),
    exitReason: T(s.exitReason),
    parent: {
      goal: T(s.parentGoal),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上为假想 NZ$80 标签设计两张优惠卡：降 20% 与降 25%；分别求节省、新价，再给降 20% 的新价涨 20%。标出两次的 100%，向家长解释为何未回原价。无需购物、询价或真实付款。',
            'On paper, design 20% and 25% discount cards for a fictional NZ$80 label. Find savings and final prices, then increase the 20%-off price by 20%. Label both 100% bases and explain why the original price is not restored. No purchase, price inquiry or actual payment is needed.',
          ),
        }
      : {}),
  };
});
export function p62ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const index = p62Lessons.findIndex((l) => l.id === id);
  if (index < 0) throw new RangeError('Unknown P62 lesson');
  const k = round % 80;
  let item: Item;
  if (index === 0) {
    const total = 20 + 10 * (Math.floor(k / 5) % 5),
      part = 1 + (k % 5);
    item = {
      stem: [
        `${total} 张卡中 ${part} 张有标记，占百分之几？`,
        `Marked cards: ${part} out of ${total}. What percentage is marked?`,
      ],
      value: `${part}/${total}`,
      steps: [
        `部分÷整体=${part}/${total}，改为每百份但不改实际张数。`,
        `Part÷whole=${part}/${total}; convert to per hundred without changing the actual count.`,
      ],
      wrong: [`${part}%`, String(part)],
      diagram: { kind: 'percent-source', selected: part, total },
    };
  } else if (index === 1) {
    const milli = 1 + ((k * 37) % 2000);
    const raw = decimalText(ratio(milli, 1000))!;
    item = {
      stem: [`把 ${raw} 写成百分数。`, `Write ${raw} as a percentage.`],
      value: raw,
      steps: [
        `${raw}=${percentText(ratio(milli, 1000))}，百分号表示除以一百。`,
        `${raw}=${percentText(ratio(milli, 1000))}; the percent sign divides by one hundred.`,
      ],
      wrong: [`${raw}%`, String(milli)],
    };
  } else if (index === 2) {
    const d = [3, 4, 6, 8, 12][Math.floor(k / 5) % 5]!,
      n = 1 + (k % 5);
    item = {
      stem: [
        `把 ${n}/${d} 写成精确百分数，循环结果可用带分数百分数。`,
        `Write ${n}/${d} as an exact percentage; use a mixed-number percentage for a recurring result.`,
      ],
      value: `${n}/${d}`,
      steps: [
        `${n}/${d}×100 得百分数系数，精确为 ${percentText(ratio(n, d))}。`,
        `${n}/${d}×100 gives the coefficient: exactly ${percentText(ratio(n, d))}.`,
      ],
      wrong: [`${n}%`, `${n}/${d}`],
    };
  } else if (index === 3) {
    const whole = 20 + (k % 10) * 5,
      rate = 5 + Math.floor(k / 10) * 5;
    item = {
      stem: [
        `${whole} L 的 ${rate}% 是多少升？`,
        `How many litres are ${rate}% of ${whole} L?`,
      ],
      value: `${whole * rate}/100`,
      form: 'quantity',
      unit: 'L',
      steps: [
        `${whole}×${rate}/100 L，乘无单位比例后保留升。`,
        `${whole}×${rate}/100 L; keep litres after multiplying by the dimensionless rate.`,
      ],
      wrong: [String(whole * rate), `${whole * rate}%`],
    };
  } else if (index === 4) {
    const whole = 20 + (k % 10) * 4,
      rate = 10 + Math.floor(k / 10) * 5,
      part = decimalText(ratio(whole * rate, 100))!;
    item = {
      stem: [
        `${part} L 是整体的 ${rate}%，整体多少升？`,
        `${part} L is ${rate}% of the whole. How many litres is the whole?`,
      ],
      value: String(whole),
      form: 'quantity',
      unit: 'L',
      steps: [
        `已知量对应 ${rate}%，整体=${part}÷(${rate}/100)=${whole} L，乘回恢复 ${part} L。`,
        `The known amount corresponds to ${rate}%: ${part}÷(${rate}/100)=${whole} L; multiplying back restores ${part} L.`,
      ],
      wrong: [String(whole * 100), `${whole}%`],
    };
  } else {
    const price = 20 + (k % 8) * 10,
      rate = [10, 15, 20, 25, 30][Math.floor(k / 8) % 5]!,
      up = k % 2 === 1;
    item = {
      stem: [
        `假想原价 NZ$${price}，${up ? '涨' : '降'} ${rate}%，新价多少新西兰元？无其他费用。`,
        `A fictional NZ$${price} price ${up ? 'increases' : 'decreases'} by ${rate}%, with no other charges. What is the new price in NZ dollars?`,
      ],
      value: `${price * (100 + (up ? rate : -rate))}/100`,
      form: 'quantity',
      unit: 'NZD',
      steps: [
        `以 ${price} 元为 100%，新价=${price}×${100 + (up ? rate : -rate)}/100 元。`,
        `Use ${price} dollars as 100%: the new price is ${price}×${100 + (up ? rate : -rate)}/100 dollars.`,
      ],
      wrong: [String(price * rate), `${price}%`],
    };
  }
  return number(`${id}-R${round}`, index, item);
}
export const p62CheckQuestions: Question[] = [
  number('P62-CHECK-Q1', 1, {
    stem: ['把 0.063 写成百分数。', 'Write 0.063 as a percentage.'],
    value: '0.063',
    steps: ['0.063=6.3/100=6.3%。', '0.063=6.3/100=6.3%.'],
    wrong: ['63%', '0.063%', '6.3'],
  }),
  number('P62-CHECK-Q2', 2, {
    stem: ['把 7/8 写成精确百分数。', 'Write 7/8 as an exact percentage.'],
    value: '7/8',
    steps: ['7/8=0.875=87.5%。', '7/8=0.875=87.5%.'],
    wrong: ['78%', '87.5', '7/8'],
  }),
  number('P62-CHECK-Q3', 3, {
    stem: ['160 g 的 15% 是多少克？', 'How many grams are 15% of 160 g?'],
    value: '24',
    form: 'quantity',
    unit: 'g',
    steps: ['160×15/100=24 g。', '160×15/100=24 g.'],
    wrong: ['15', '2400', '24 L'],
  }),
  number('P62-CHECK-Q4', 4, {
    stem: [
      '24 L 是整体的 40%，整体多少升？',
      '24 L is 40% of the whole. How many litres is the whole?',
    ],
    value: '60',
    form: 'quantity',
    unit: 'L',
    steps: ['24÷0.4=60 L；60×40%=24 L。', '24÷0.4=60 L; check 60×40%=24 L.'],
    wrong: ['9.6', '40', '60%'],
  }),
  number('P62-CHECK-Q5', 5, {
    stem: [
      '假想原价 NZ$60 降价 15%，新价多少新西兰元？',
      'A fictional NZ$60 price falls by 15%. What is the new price in NZ dollars?',
    ],
    value: '51',
    form: 'quantity',
    unit: 'NZD',
    steps: [
      '节省九元，60−9=51 元。',
      'Save nine dollars, giving 60−9=51 dollars.',
    ],
    wrong: ['9', '15', '51%'],
  }),
  pick('P62-CHECK-Q6', 5, specs[5]!.pick),
  number('P62-CHECK-Q7', 2, {
    stem: [
      '把 1/6 写成精确百分数，可用带分数百分数。',
      'Write 1/6 as an exact percentage; a mixed-number percentage is allowed.',
    ],
    value: '1/6',
    steps: [
      '1/6×100=50/3=16又2/3，所以精确为 16 2/3%。',
      '1/6×100=50/3=16 2/3, so the exact percentage is 16 2/3%.',
    ],
    wrong: ['16.7%', '16.67%', '1/6'],
  }),
  reasoning(
    'P62-CHECK-Q8',
    t(
      '比较“80 L 的 20%”与“16 L 是整体的 20%”。再解释 NZ$80 降 20% 后涨 20% 为何不是原价。请标整体、单位与每一步参照。',
      'Compare “20% of 80 L” with “16 L is 20% of the whole”. Then explain why a 20% discount followed by a 20% increase on NZ$80 does not restore the price. Identify the wholes, units and each step’s base.',
    ),
    skills[5]!,
    t(
      '第一问整体八十升已知，乘 0.2 得十六升；第二问十六升是部分，除 0.2 得八十升，可乘回。价格第一步以八十元为整体得六十四；第二步以六十四为整体得七十六元八角。应说明百分率无量纲、实际结果有升或钱单位，不能把相同的百分率跨不同整体直接抵消。',
      'In the first question, eighty litres is the given whole, so multiply by 0.2 to get sixteen litres. In the second, sixteen litres is the known part, so divide by 0.2 to recover eighty and multiply back to check. The price first uses eighty dollars as its base, giving sixty-four; the second step uses sixty-four, giving seventy-six dollars eighty. Percentages are dimensionless while the measured results have litre or money units; equal rates on different bases cannot simply cancel.',
    ),
    hints[5]!.map(T),
  ),
];
