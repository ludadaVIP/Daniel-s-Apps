import {
  t,
  exactRational,
  type Lesson,
  type Question,
  type AnswerSpec,
} from '../model';
import { numeric, choice, reasoning } from './builders';
import { commonFactor } from '../ratioModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
type Item = {
  stem: Pair;
  value: string;
  steps: Pair;
  wrong: string[];
  ratio?: boolean;
  simplest?: boolean;
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
  goal: Pair;
  misconception: Pair;
  prompts: Pair[];
  reason: Pair;
  rubric: Pair;
  exitReason: Pair;
  numbers: [Item, Item, Item, Item, Item, Item];
  pick: Pick;
};
const skills = [
  'ratio-order-and-reference',
  'simplest-integer-ratio',
  'allocate-by-ratio',
  'equivalent-ratio-table',
  'map-scale-units',
  'direct-proportion-evidence',
];
const hints: [Pair, Pair][] = [
  [
    [
      '先说两种量与顺序，确认问的是部分比部分还是部分比总量。',
      'Name both quantities in order and identify part-to-part versus part-to-whole.',
    ],
    [
      '把不同单位先统一；A:B 的比值为 A÷B，不是 A÷(A+B)。',
      'Match units first. A:B has quotient A÷B, not A÷(A+B).',
    ],
  ],
  [
    [
      '先统一实际单位，再把小数或分数两项变为同单位的整数个数。',
      'Match actual units, then express both decimal or fractional terms as integer counts of one common unit.',
    ],
    [
      '两项同除最大公因数，核查两项互质。等值但仍有公因数还不算最简。',
      'Divide both terms by their greatest common factor and check they are coprime. Equivalence alone is not simplest form.',
    ],
  ],
  [
    [
      '总量对应的是两项相加的总份数，不是其中一项。',
      'The total corresponds to the sum of both weights, not either weight alone.',
    ],
    [
      '每份=总量÷总权重，再分别乘两项；两部分相加应恢复总量。',
      'Each part is total÷sum of weights. Multiply by each weight and check the allocations sum to the total.',
    ],
  ],
  [
    [
      '找两列共同的倍数，不要用相同差来代替同比关系。',
      'Look for one multiplier shared by both columns, rather than a matching difference.',
    ],
    [
      '两项同时乘同一个数，或比较交叉乘积。零行不能用 0÷0 证明比值。',
      'Scale both terms by the same factor or compare cross products. Do not use 0÷0 to justify a zero row.',
    ],
  ],
  [
    [
      '比例尺两项要用相同单位；先合计实际走的原图路线。',
      'Use the same units on both sides of a scale. Add the original-map legs actually travelled.',
    ],
    [
      '实际厘米=原图厘米×比例尺后项，再换米或千米；放大显示不改变原坐标。',
      'Ground centimetres equal original-map centimetres times the scale denominator. Convert to metres or kilometres; screen zoom preserves original coordinates.',
    ],
  ],
  [
    [
      '先读给定规则与轴单位，再看正 x 时 y÷x 是否恒定和零点对应。',
      'Read the given rule and axis units, then check constant y÷x for positive x and the value at zero.',
    ],
    [
      '正比例是 y=kx，正 x 时比值固定且零对应零；直线或过原点各自都不够。',
      'Direct proportion has y=kx: constant quotient for positive x and zero mapping to zero. Being straight or passing through the origin alone is insufficient.',
    ],
  ],
];
function q(id: string, index: number, item: Item): Question {
  const accepted = item.ratio
    ? [
        item.value,
        item.value.replace(':', '：'),
        ...(!item.simplest
          ? [
              item.value
                .split(':')
                .map((n) => Number(n) * 2)
                .join(':'),
            ]
          : []),
      ]
    : (() => {
        const [n, d] = exactRational(item.value)!;
        return [
          item.value,
          `${n * 2n}/${d * 2n}`,
          ...(item.unit ? [`${item.value} ${item.unit}`] : []),
        ];
      })();
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
  question.answer = item.ratio
    ? { kind: 'ratio', value: item.value, simplest: item.simplest }
    : {
        kind: 'number',
        value: item.value,
        unit: item.unit,
        formats: ['decimal', 'fraction'],
      };
  question.type = item.ratio
    ? 'ratio'
    : item.unit
      ? 'word_problem'
      : item.diagram
        ? 'visual_select'
        : 'numeric';
  question.misconceptionTags = [
    skills[index]!,
    'ordered-quantities',
    'reference-whole',
    ...(item.unit ? ['reading-units'] : []),
  ];
  return question;
}
const c = (id: string, index: number, p: Pick) =>
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
    title: ['比是两种量的比较', 'Ratio as comparison of quantities'],
    objective: [
      '按指定顺序比较两种量，区分部分比部分、部分比整体与差。',
      'Compare two quantities in a specified order, distinguishing part-to-part, part-to-whole and difference.',
    ],
    prerequisites: ['P61-L06', 'P62-L01'],
    keywords: [
      ['前项与后项', 'first and second terms'],
      ['比值', 'ratio quotient'],
      ['比较顺序', 'comparison order'],
    ],
    hook: [
      'A 有四张、B 有六张。A:B、B:A、A:总量为什么分别不同？“相差两张”能替代这些比吗？',
      'A has four cards and B has six. Why do A:B, B:A and A:total differ? Can “two cards apart” replace these ratios?',
    ],
    lab: 'ratio-compare',
    goal: [
      '先让孩子说出量的名称与顺序，再写冒号和解释比值。',
      'Ask the learner to name the quantities in order before writing a colon and explaining the quotient.',
    ],
    misconception: [
      '调换前后项；把部分比部分的分母误作总量；把差当比。',
      'Reversing terms, using the total as denominator for a part-to-part ratio, or confusing a difference with a ratio.',
    ],
    prompts: [
      ['A:B 的后项是 B 还是 A+B？', 'Is the second term of A:B B or A+B?'],
      [
        '同一长度用米与厘米写时，先做什么？',
        'What must you do before comparing lengths written in metres and centimetres?',
      ],
    ],
    reason: [
      'A 有四张、B 有六张。解释 A:B=2:3，却不是说 A 占全部的 2/3；A 实际占全部几分之几？',
      'A has four cards and B six. Explain why A:B=2:3 does not mean A is two thirds of all cards. What fraction of the total is A?',
    ],
    rubric: [
      'A:B 是四与六的比较，4/6=2/3，因此可写 2:3。总量为十，A 占总量 4/10=2/5；比中两项权重和为五，不是把后项三当整体。B:A 反向为 3:2，差为两张又是另一种比较。家长应核对量名、顺序、参照和实际数量，允许画条形或同样小份说明，不能只看到 2:3 就判解释完整。',
      'A:B compares four with six, so its quotient is 4/6=2/3 and its ratio can be written 2:3. All cards total ten, so A is 4/10=2/5 of the whole; the weight total is five, not the second term three. Reversing the order gives B:A=3:2, while the two-card difference answers another question. Check names, order, reference and counts, accepting a clear diagram or equal-part explanation rather than a correct ratio alone.',
    ],
    exitReason: [
      '读出两项对应的对象与顺序，再区别总量。',
      'Name the object and order of each term, then distinguish the total.',
    ],
    numbers: [
      {
        stem: [
          'A 有四张卡，B 有六张。写 A:B，接受等值比。',
          'A has four cards and B six. Write A:B; equivalent ratios are accepted.',
        ],
        value: '2:3',
        ratio: true,
        steps: [
          'A:B=4:6=2:3；比较对象是 A 与 B，不是 A 与总量。',
          'A:B=4:6=2:3 compares A with B, not with the total.',
        ],
        wrong: ['3:2', '2:5', '2', '2/3'],
        diagram: { kind: 'ratio-counters', a: 4, b: 6 },
      },
      {
        stem: [
          '同样 A 四张、B 六张，写 B:A。',
          'For the same four A cards and six B cards, write B:A.',
        ],
        value: '3:2',
        ratio: true,
        steps: ['顺序反过来：B:A=6:4=3:2。', 'Reverse the order: B:A=6:4=3:2.'],
        wrong: ['2:3', '3:5', '3/2'],
      },
      {
        stem: [
          'A 四张、B 六张，写 A:全部卡片总数。',
          'A has four cards and B six. Write A:total cards.',
        ],
        value: '2:5',
        ratio: true,
        steps: [
          '全部十张，A:总量=4:10=2:5。',
          'There are ten cards in all: A:total=4:10=2:5.',
        ],
        wrong: ['2:3', '4:6', '2/5'],
      },
      {
        stem: [
          'A 长 0.6 m，B 长 90 cm，统一单位后写 A:B。',
          'A is 0.6 m long and B is 90 cm. Match units and write A:B.',
        ],
        value: '2:3',
        ratio: true,
        steps: [
          '0.6 m=60 cm，60:90=2:3；不能直接比 0.6:90。',
          '0.6 m=60 cm, so 60:90=2:3; do not directly compare 0.6:90.',
        ],
        wrong: ['1:150', '3:2', '2/3'],
      },
      {
        stem: [
          'A 有零张，B 有五张，写 A:B。后项保持正数。',
          'A has zero cards and B five. Write A:B, keeping the second term positive.',
        ],
        value: '0:1',
        ratio: true,
        steps: [
          '0:5 与 0:1 都表示比值零；0:0 则不能定义比值。',
          '0:5 and 0:1 both have quotient zero; 0:0 cannot define a quotient.',
        ],
        wrong: ['0:0', '1:0', '0', '5:0'],
      },
      {
        stem: [
          '八张圆点卡与十二张方块卡，按圆点:方块写比。',
          'There are eight dotted cards and twelve square-marked cards. Write dots:squares.',
        ],
        value: '2:3',
        ratio: true,
        steps: [
          '对象顺序给定：8:12=2:3，总量二十不作后项。',
          'Follow the requested order: 8:12=2:3; the total twenty is not the second term.',
        ],
        wrong: ['3:2', '2:5', '2/3'],
      },
    ],
    pick: {
      stem: [
        'A:B=2:3，哪句能正确解释 A 占总量的份额？',
        'Given A:B=2:3, which correctly explains A’s share of the total?',
      ],
      correct: 1,
      options: [
        {
          text: ['A 占总量 2/3', 'A is 2/3 of the total'],
          feedback: [
            '三是 B 的权重，整体需要两项相加。',
            'Three is B’s weight; add both weights for the whole.',
          ],
        },
        {
          text: ['A 占总量 2/(2+3)=2/5', 'A is 2/(2+3)=2/5 of the total'],
          feedback: [
            '先找整体五个同样份，A 取两份。',
            'The whole has five equal weight parts and A receives two.',
          ],
        },
        {
          text: ['A 比 B 少一张', 'A has one fewer card than B'],
          feedback: [
            '权重差一不保证实际差一张，实际可同比放大。',
            'A one-part weight difference does not guarantee a one-card difference; quantities can scale.',
          ],
        },
      ],
      steps: [
        '部分比部分的两项要相加，才得到整体份数。',
        'Add the two part-to-part weights to obtain the whole’s part count.',
      ],
    },
  },
  {
    title: ['最简整数比', 'Simplifying ratios'],
    objective: [
      '统一单位并同倍缩放两项，得到两项互质的最简整数比。',
      'Match units and scale both terms equally to obtain a simplest integer ratio with coprime terms.',
    ],
    prerequisites: ['P63-L01', 'P51-L05', 'P53-L05'],
    keywords: [
      ['同倍缩放', 'equal scaling'],
      ['最大公因数', 'greatest common factor'],
      ['互质', 'coprime'],
    ],
    hook: [
      '6:9 化为 2:3 时，六份与九份是否被拿走了？0.6:0.9 为什么也能用同样的比较单位？',
      'When 6:9 becomes 2:3, are quantities removed? Why can 0.6:0.9 use the same comparison?',
    ],
    lab: 'ratio-simplify',
    goal: [
      '让孩子解释共同计数单位的改变，核对等值与最简两个条件。',
      'Ask the learner to explain a changed common counting unit and check both equivalence and simplest form.',
    ],
    misconception: [
      '两项减同一个数；只变一项；等值但有共同因数就停止。',
      'Subtracting the same amount, changing only one term, or stopping at equivalent terms that still share a factor.',
    ],
    prompts: [
      [
        '两项是同时除同一个非零因数吗？',
        'Did you divide both terms by the same nonzero factor?',
      ],
      [
        '结果两项还有大于一的公因数吗？',
        'Do the resulting terms still share an integer factor greater than one?',
      ],
    ],
    reason: [
      '解释 18:24 化为 9:12 虽等值却未最简，并说明 3:4 为什么完成目标。',
      'Explain why 18:24 becoming 9:12 is equivalent but not simplest, while 3:4 completes the task.',
    ],
    rubric: [
      '两项同除二保留比值，所以 9:12 等值；但九和十二还有公因数三，可继续同除三得 3:4。也可将十八和二十四直接同除最大公因数六。三和四互质，且 3×24=4×18，顺序与比值都保留。不能两项减六得 12:18，那改变了比值。家长应看等值证明、共同非零缩放与互质检查，不以只记住算法为充分依据。',
      'Dividing both terms by two preserves the quotient, so 9:12 is equivalent. Nine and twelve still share factor three, so dividing again gives 3:4. Alternatively divide eighteen and twenty-four by their greatest common factor six. Three and four are coprime, and 3×24=4×18 confirms equivalence in the same order. Subtracting six from both terms would change the quotient. Look for equal nonzero scaling, equivalence and a coprime check, rather than a memorized algorithm alone.',
    ],
    exitReason: [
      '说明共同因数与两项互质，最简和等值都要满足。',
      'Explain the shared factor and coprime result; both equivalence and simplest form are required.',
    ],
    numbers: [
      {
        stem: [
          '把 6:9 化成最简整数比。',
          'Write 6:9 in simplest integer terms.',
        ],
        value: '2:3',
        ratio: true,
        simplest: true,
        steps: [
          '两项同除最大公因数三得 2:3，两项互质。',
          'Divide both terms by their greatest common factor three to get coprime 2:3.',
        ],
        wrong: ['4:6', '6:9', '3:2', '2/3'],
      },
      {
        stem: [
          '把 18:24 化成最简整数比。',
          'Write 18:24 in simplest integer terms.',
        ],
        value: '3:4',
        ratio: true,
        simplest: true,
        steps: [
          '两项同除六得 3:4；9:12 虽等值但未最简。',
          'Divide both terms by six to get 3:4; 9:12 is equivalent but not simplest.',
        ],
        wrong: ['9:12', '6:8', '4:3'],
      },
      {
        stem: [
          '把 0.6:0.9 化成最简整数比，两项单位相同。',
          'Write 0.6:0.9 in simplest integer terms; the units match.',
        ],
        value: '2:3',
        ratio: true,
        simplest: true,
        steps: [
          '两项同乘十得 6:9，再同除三得 2:3。',
          'Multiply both terms by ten for 6:9, then divide both by three for 2:3.',
        ],
        wrong: ['6:9', '0.2:0.3', '3:2'],
      },
      {
        stem: [
          '把 1/2:3/4 化成最简整数比。',
          'Write 1/2:3/4 in simplest integer terms.',
        ],
        value: '2:3',
        ratio: true,
        simplest: true,
        steps: [
          '两项同乘四得 2:3；共同小单位是四分之一。',
          'Multiply both terms by four for 2:3; the common small unit is one quarter.',
        ],
        wrong: ['1:3', '4:6', '1/2:3/4'],
      },
      {
        stem: [
          'A 为 1.5 m，B 为 50 cm，把 A:B 化成最简整数比。',
          'A is 1.5 m and B 50 cm. Write A:B in simplest integer terms.',
        ],
        value: '3:1',
        ratio: true,
        simplest: true,
        steps: [
          '1.5 m=150 cm，所以 150:50=3:1。',
          '1.5 m=150 cm, so 150:50=3:1.',
        ],
        wrong: ['3:100', '150:50', '1:3'],
      },
      {
        stem: [
          '把 14:21 化成最简整数比。',
          'Write 14:21 in simplest integer terms.',
        ],
        value: '2:3',
        ratio: true,
        simplest: true,
        steps: [
          '两项同除七得 2:3，二和三互质。',
          'Divide both terms by seven for 2:3; two and three are coprime.',
        ],
        wrong: ['4:6', '7:14', '3:2'],
      },
    ],
    pick: {
      stem: [
        '哪个操作保持 6:9 的比值并得到最简整数比？',
        'Which operation preserves 6:9 and gives its simplest integer ratio?',
      ],
      correct: 0,
      options: [
        {
          text: ['两项同除三，得 2:3', 'Divide both terms by three to get 2:3'],
          feedback: [
            '共同非零缩放保留比值，二和三互质。',
            'Equal nonzero scaling preserves the quotient, and two and three are coprime.',
          ],
        },
        {
          text: ['两项同减三，得 3:6', 'Subtract three from both to get 3:6'],
          feedback: [
            '3/6=1/2，与 6/9=2/3 不等。',
            '3/6=1/2 differs from 6/9=2/3.',
          ],
        },
        {
          text: ['只把六除三，得 2:9', 'Divide only six by three to get 2:9'],
          feedback: [
            '只改一项改变两量比较关系。',
            'Changing only one term changes the relationship.',
          ],
        },
      ],
      steps: [
        '化简比是同倍缩放，两项还必须为互质整数。',
        'Simplify through equal scaling and require coprime integer terms.',
      ],
    },
  },
  {
    title: ['按比分配', 'Sharing in a given ratio'],
    objective: [
      '把总量对应到两项权重之和，求每份与两部分并核回总量。',
      'Match the total to the sum of both weights, find each part and both allocations, and recover the total.',
    ],
    prerequisites: ['P63-L02', 'P61-L03', 'P61-L04'],
    keywords: [
      ['总份数', 'total weight parts'],
      ['每份量', 'amount per part'],
      ['总量守恒', 'conserved total'],
    ],
    hook: [
      '25 L 按 2:3 分给 A、B，为什么不能用 25÷3 再乘二？图中的整体由几份组成？',
      'Why does sharing 25 L between A and B in ratio 2:3 not start with 25÷3×2? How many parts make up the whole?',
    ],
    lab: 'ratio-share',
    goal: [
      '让孩子先加权重，再求份额，最后核对和与原比。',
      'Ask the learner to add weights first, calculate allocations, then check their sum and original ratio.',
    ],
    misconception: [
      '把后项当总份数；把两项直接当实际升数；截断分数份额。',
      'Treating the second term as the whole, taking weights as actual litres, or truncating fractional allocations.',
    ],
    prompts: [
      [
        '25 L 对应二份、三份，还是五份？',
        'Does 25 L correspond to two, three or five parts?',
      ],
      [
        '两部分相加以及交叉乘积都能核回吗？',
        'Do the allocations recover the total and preserve the cross-product relationship?',
      ],
    ],
    reason: [
      '把 7 L 按 2:3 分配，解释 A 的 14/5 L 与 B 的 21/5 L 为什么不能取整，并核查总量。',
      'Share 7 L in ratio 2:3. Explain why A’s 14/5 L and B’s 21/5 L should not be truncated, and check the total.',
    ],
    rubric: [
      '整体为五等权重份，每份 7/5 L。A 两份得 14/5 L，B 三份得 21/5 L，和为 35/5=7 L；两部分交叉乘原权重也相等，保持 2:3。水可连续分，取整会丢量并可能破坏比。若对象是不可拆卡片，应另说明完整分配限制，而不能静默截断。零总量时两份额都零，但不能据 0:0 定义实际比值。',
      'The total has five equal weight parts, each 7/5 L. A receives 14/5 L and B 21/5 L; their sum is 35/5=7 L. Cross products with the original weights agree, preserving 2:3. Water is continuous, so truncation loses quantity and may change the ratio. Indivisible cards would require a separate feasibility discussion, not silent truncation. A zero total gives zero allocations but does not define an observed 0:0 quotient.',
    ],
    exitReason: [
      '同时核对总量和两部分对应的权重，不只检查一个答案。',
      'Check both the conserved total and the allocation weights, not only one answer.',
    ],
    numbers: [
      {
        stem: [
          '25 L 按 A:B=2:3 分配，A 得多少升？',
          'Share 25 L in ratio A:B=2:3. How many litres does A get?',
        ],
        value: '10',
        unit: 'L',
        steps: [
          '总份数五，每份 25÷5=5 L，A 两份得 10 L。',
          'Five parts give 25÷5=5 L each; A gets two parts, or 10 L.',
        ],
        wrong: ['50/3', '2', '10%'],
        diagram: { kind: 'ratio-shares', total: 25, a: 2, b: 3 },
      },
      {
        stem: [
          '同样 25 L 按 A:B=2:3 分配，B 得多少升？',
          'For the same 25 L shared in ratio A:B=2:3, how many litres does B get?',
        ],
        value: '15',
        unit: 'L',
        steps: [
          '每份五升，B 三份得十五升；10+15=25。',
          'Each part is five litres; B gets fifteen. Check 10+15=25.',
        ],
        wrong: ['25', '3', '15%'],
      },
      {
        stem: [
          '7 L 按 A:B=2:3 分配，A 得多少升？保留精确量。',
          'Share 7 L in ratio A:B=2:3. How many litres does A get? Keep it exact.',
        ],
        value: '14/5',
        unit: 'L',
        steps: [
          '每份 7/5 L，A 得两份，即 14/5 L=2.8 L。',
          'Each part is 7/5 L; A receives two, giving 14/5 L=2.8 L.',
        ],
        wrong: ['2', '14/3', '2.8%'],
      },
      {
        stem: [
          '零升按 A:B=1:4 的计划分配，B 得多少升？',
          'Allocate zero litres using weights A:B=1:4. How many litres does B get?',
        ],
        value: '0',
        unit: 'L',
        steps: [
          '总量零，每份零，B 也得零升；不据此计算 0/0。',
          'A zero total gives zero per part and zero to B; do not calculate 0/0.',
        ],
        wrong: ['4', '5', '0%'],
      },
      {
        stem: [
          '24 g 按 A:B=3:5 分配，A 得多少克？',
          'Share 24 g in ratio A:B=3:5. How many grams does A get?',
        ],
        value: '9',
        unit: 'g',
        steps: [
          '八等份每份三克，A 三份得九克。',
          'Eight equal parts give three grams each; A receives nine grams.',
        ],
        wrong: ['14.4', '3', '9 L'],
      },
      {
        stem: [
          '35 L 按 A:B=3:4 分配，B 得多少升？',
          'Share 35 L in ratio A:B=3:4. How many litres does B get?',
        ],
        value: '20',
        unit: 'L',
        steps: [
          '总七份，每份五升，B 四份得二十升。',
          'Seven parts give five litres each; B receives twenty litres.',
        ],
        wrong: ['15', '4', '20%'],
      },
    ],
    pick: {
      stem: [
        '25 L 按 2:3 分配，哪个关系先找到正确的每份量？',
        'Which first finds the correct amount per part for 25 L shared in ratio 2:3?',
      ],
      correct: 2,
      options: [
        {
          text: ['25÷3', '25÷3'],
          feedback: [
            '三只表示 B 的权重，不是整个总量的份数。',
            'Three is B’s weight, not the whole’s part count.',
          ],
        },
        {
          text: ['25÷2', '25÷2'],
          feedback: ['二只表示 A 的权重。', 'Two is only A’s weight.'],
        },
        {
          text: ['25÷(2+3)', '25÷(2+3)'],
          feedback: [
            '总量由五个同样的权重份组成。',
            'Five equal weight parts make up the whole.',
          ],
        },
      ],
      steps: [
        '先加两项权重找整体份数，再按各自权重取份。',
        'Add both weights for the total part count, then take each allocation’s parts.',
      ],
    },
  },
  {
    title: ['相同关系的比值表', 'Equivalent ratio tables'],
    objective: [
      '用共同倍数与交叉乘积检验比值表，区别同比与同加。',
      'Use a common multiplier and cross products to check a ratio table, distinguishing equal scaling from equal addition.',
    ],
    prerequisites: ['P63-L03', 'P61-L02'],
    keywords: [
      ['共同倍数', 'common multiplier'],
      ['对应行', 'corresponding row'],
      ['交叉乘积', 'cross products'],
    ],
    hook: [
      '配方 A:B=2:3，4:6 与 4:5 哪个还是同配方？二者都比原数大，为什么只看差不行？',
      'A recipe has A:B=2:3. Which of 4:6 and 4:5 preserves it? Both increase the quantities; why is a matching difference insufficient?',
    ],
    lab: 'ratio-table',
    goal: [
      '把每行解释为两列共同缩放，允许分数倍并检查零行。',
      'Explain each row as shared scaling, including fractional multipliers, and interpret the zero row carefully.',
    ],
    misconception: [
      '两项同加保持比例；两列用不同倍数；用零行相除。',
      'Assuming equal addition preserves ratios, using different column multipliers, or dividing the zero row.',
    ],
    prompts: [
      ['这一行两列各乘了几倍？', 'What multiplier was applied to each column?'],
      [
        '共同倍数为一半时，关系是否仍成立？',
        'Does the relationship still hold for a multiplier of one half?',
      ],
    ],
    reason: [
      '说明 2:3→4:6 与 2:3→4:5 的区别，再解释零行 0:0 的限制。',
      'Explain 2:3→4:6 versus 2:3→4:5, then discuss the limitation of the zero row 0:0.',
    ],
    rubric: [
      '4:6 两列都乘二，4×3=6×2=12；4:5 只是两列加二，交叉乘积十二与十不等，所以不是同比。零量可表示没有配制并满足 B=(3/2)A，但 0:0 的比值不可用 0÷0 定义，不能拿零行当比值相同的除法证据。说明共同非零缩放或正行比值，并保留列名、顺序和单位。',
      'For 4:6, both columns multiply by two and 4×3=6×2=12. For 4:5, adding two to both terms gives unequal cross products twelve and ten, so it changes the ratio. A zero row can mean no mixture and satisfy B=(3/2)A, but its 0:0 quotient cannot be defined using 0÷0. Use shared nonzero scaling or positive-row quotients as evidence, retaining column names, order and units.',
    ],
    exitReason: [
      '用共同倍数或乘回关系核查整行，而不是只看某一列。',
      'Check the complete row with one multiplier or an inverse relation, rather than one column alone.',
    ],
    numbers: [
      {
        stem: [
          '配方 A:B=2:3，A 为 8 L 时 B 需多少升？',
          'For recipe A:B=2:3, how many litres of B go with 8 L of A?',
        ],
        value: '12',
        unit: 'L',
        steps: [
          'A 从二到八乘四，B 也乘四：3×4=12 L。',
          'A scales from two to eight by four, so B also scales by four: 3×4=12 L.',
        ],
        wrong: ['9', '16/3', '12%'],
      },
      {
        stem: [
          '配方 A:B=3:5，B 为 20 L 时 A 需多少升？',
          'For recipe A:B=3:5, how many litres of A go with 20 L of B?',
        ],
        value: '12',
        unit: 'L',
        steps: [
          'B 从五到二十乘四，A 为 3×4=12 L。',
          'B scales from five to twenty by four; A is 3×4=12 L.',
        ],
        wrong: ['18', '100/3', '12%'],
      },
      {
        stem: [
          '配方 A:B=4:6，A 为 10 L 时 B 需多少升？',
          'For recipe A:B=4:6, how many litres of B go with 10 L of A?',
        ],
        value: '15',
        unit: 'L',
        steps: [
          '共同倍数 10÷4=2.5，B=6×2.5=15 L。',
          'The shared multiplier is 10÷4=2.5, giving B=6×2.5=15 L.',
        ],
        wrong: ['12', '60', '15%'],
      },
      {
        stem: [
          '配方 A:B=2:3，A 为 1/2 L 时 B 需多少升？',
          'For recipe A:B=2:3, how many litres of B go with 1/2 L of A?',
        ],
        value: '3/4',
        unit: 'L',
        steps: [
          'A 是原二升的四分之一，B 也取原三升的四分之一，得 3/4 L。',
          'A is one quarter of the original two litres; take one quarter of three litres for B: 3/4 L.',
        ],
        wrong: ['1.5', '2/3', '3/4%'],
      },
      {
        stem: [
          '表中 2 L、3 L 同时变成 4 L、6 L，两列的共同倍数是多少？',
          'A table row of 2 L and 3 L becomes 4 L and 6 L. What is the common multiplier?',
        ],
        value: '2',
        steps: [
          '4÷2=2 且 6÷3=2，共同乘二。',
          '4÷2=2 and 6÷3=2: both multiply by two.',
        ],
        wrong: ['3', '4', '2%'],
      },
      {
        stem: [
          '配方 A:B=3:4，A 为 9 L 时 B 需多少升？',
          'For recipe A:B=3:4, how many litres of B go with 9 L of A?',
        ],
        value: '12',
        unit: 'L',
        steps: [
          '两列同乘三，B=4×3=12 L。',
          'Scale both columns by three: B=4×3=12 L.',
        ],
        wrong: ['10', '27/4', '12%'],
      },
    ],
    pick: {
      stem: ['哪一行延续 A:B=2:3？', 'Which row continues A:B=2:3?'],
      correct: 1,
      options: [
        {
          text: ['4 L、5 L', '4 L and 5 L'],
          feedback: [
            '两列加二，差不变但比改变。',
            'Adding two preserves a difference but changes the ratio.',
          ],
        },
        {
          text: ['4 L、6 L', '4 L and 6 L'],
          feedback: [
            '两列同乘二，交叉乘积相等。',
            'Both scale by two and their cross products agree.',
          ],
        },
        {
          text: ['4 L、9 L', '4 L and 9 L'],
          feedback: [
            '两列分别乘二与三，不是共同倍数。',
            'The columns use different multipliers two and three.',
          ],
        },
      ],
      steps: [
        '两列共同缩放才保留原配方关系。',
        'Shared scaling of both columns preserves the recipe.',
      ],
    },
  },
  {
    title: ['比例尺与地图', 'Map scales'],
    objective: [
      '用相同单位解释比例尺，求原图路线的真实距离并区分显示缩放。',
      'Interpret a map scale using matching units, calculate a route’s ground distance, and distinguish display zoom.',
    ],
    prerequisites: ['P63-L04', 'P56-L01', 'B06-L03'],
    keywords: [
      ['图上距离', 'map distance'],
      ['实际距离', 'ground distance'],
      ['线段比例尺', 'graphic scale bar'],
    ],
    hook: [
      '原地图 1:50000，一段三厘米再走两厘米，真实走多远？把屏幕放大两倍，目的地真的远了一倍吗？',
      'At original map scale 1:50000, travel three centimetres and then two. What is the real route distance? Does doubling screen zoom double the ground journey?',
    ],
    lab: 'ratio-map',
    goal: [
      '先统一比例尺单位，再区分路线、直线和放大后的显示尺度。',
      'Match scale units first, then distinguish a route, a straight shortcut and enlarged display coordinates.',
    ],
    misconception: [
      '把后项当米或千米；用直线代两段路；放大屏幕后重复放大真实距离。',
      'Reading the denominator as metres or kilometres, substituting a straight shortcut, or enlarging ground distance after screen zoom.',
    ],
    prompts: [
      [
        '1 cm 对应 50000 cm 还是 50000 m？',
        'Does 1 cm correspond to 50000 cm or 50000 m?',
      ],
      [
        '放大纸图上的厘米还能直接用原数值比例尺吗？',
        'Can centimetres measured on an enlarged print still use the original numerical scale?',
      ],
    ],
    reason: [
      '解释原图 1:50000 的三厘米加两厘米路线为何是 2.5 km，并说明放大显示与放大印图的区别。',
      'Explain why a three-plus-two-centimetre route at original scale 1:50000 is 2.5 km, and distinguish display zoom from an enlarged print.',
    ],
    rubric: [
      '两段原图共五厘米，比例尺同单位给 5×50000=250000 cm=2500 m=2.5 km。只沿指定折线路线相加，不用端点直线替代。屏幕放大仍保留原图坐标，路径和线段比例尺一起变长，真实路程不变；若原纸图线性放大两倍再量厘米，新数值比例尺应为 1:25000。家长核对同单位、原坐标、路线与缩放条件，不能把屏幕像素当真实地图厘米。',
      'The original-map route totals five centimetres. Matching units gives 5×50000=250000 cm=2500 m=2.5 km. Add the specified route legs rather than substituting an endpoint shortcut. Screen zoom preserves original-map coordinates while enlarging the route and graphic scale bar together, so ground distance stays unchanged. If a paper map is printed twice as large and measured in new centimetres, its numerical scale becomes 1:25000. Check units, coordinates, route and zoom conditions; screen pixels are not physical map centimetres.',
    ],
    exitReason: [
      '先合计原图路线，再按同单位比例转换并检查米与厘米进率。',
      'Add original-map route legs, apply a same-unit scale, then check centimetre-to-metre conversion.',
    ],
    numbers: [
      {
        stem: [
          '原图比例 1:50000，路线先 3 cm 再 2 cm，实际路线多少千米？',
          'At original scale 1:50000, a route has legs of 3 cm and 2 cm. How many kilometres is the ground route?',
        ],
        value: '2.5',
        unit: 'km',
        steps: [
          '原图共 5 cm，实际 250000 cm=2500 m=2.5 km。',
          'The map route totals 5 cm: 250000 real cm=2500 m=2.5 km.',
        ],
        wrong: ['250', '25', '2500 km'],
        diagram: {
          kind: 'ratio-map',
          horizontal: 3,
          vertical: 2,
          scale: 50000,
        },
      },
      {
        stem: [
          '原图 1:50000，图上路线 2.4 cm，实际多少千米？',
          'At original scale 1:50000, a map route is 2.4 cm. How many kilometres is it on the ground?',
        ],
        value: '1.2',
        unit: 'km',
        steps: ['2.4×50000=120000 cm=1.2 km。', '2.4×50000=120000 cm=1.2 km.'],
        wrong: ['12', '120', '1.2 m'],
      },
      {
        stem: [
          '原图 1:100000，实际路线 3 km，原图路线多少厘米？',
          'At original scale 1:100000, a ground route is 3 km. How many centimetres is it on the original map?',
        ],
        value: '3',
        unit: 'cm',
        steps: [
          '3 km=300000 cm，除以 100000 得原图 3 cm。',
          '3 km=300000 cm; divide by 100000 for 3 original-map cm.',
        ],
        wrong: ['0.03', '300', '3 km'],
      },
      {
        stem: [
          '原图 1:25000，图上路线 4 cm，实际多少米？',
          'At original scale 1:25000, a map route is 4 cm. How many metres is it on the ground?',
        ],
        value: '1000',
        unit: 'm',
        steps: [
          '4×25000=100000 cm，除以一百得 1000 m。',
          '4×25000=100000 cm; divide by one hundred for 1000 m.',
        ],
        wrong: ['100000', '100', '1000 km'],
      },
      {
        stem: [
          '把原来 1:50000 的纸图线性放大两倍印出，新数值比例尺为 1:N。只写后项 N。',
          'Print a 1:50000 paper map twice as large linearly. Its new numerical scale is 1:N. Enter only N.',
        ],
        value: '25000',
        steps: [
          '同一真实距离占纸上厘米两倍，所以每厘米实际距离减半，N=50000÷2=25000。',
          'The same ground distance spans twice the paper centimetres, so the denominator halves: 50000÷2=25000.',
        ],
        wrong: ['100000', '50000', '1:25000'],
      },
      {
        stem: [
          '原图 1:20000，指定路线两段为 2.5 cm 与 1 cm，实际多少米？',
          'At original scale 1:20000, the specified route legs are 2.5 cm and 1 cm. How many metres is the ground route?',
        ],
        value: '700',
        unit: 'm',
        steps: [
          '原图共 3.5 cm，实际 70000 cm=700 m。',
          'The map route totals 3.5 cm, giving 70000 cm=700 m.',
        ],
        wrong: ['500', '70000', '700 km'],
      },
    ],
    pick: {
      stem: [
        '原图比例 1:50000 的正确含义是哪句？',
        'Which correctly interprets original map scale 1:50000?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '原图 1 cm 对应实际 50000 cm',
            '1 original-map cm represents 50000 ground cm',
          ],
          feedback: [
            '比的两项使用同一种长度单位。',
            'Both sides use the same length unit.',
          ],
        },
        {
          text: [
            '原图 1 cm 对应实际 50000 m',
            '1 original-map cm represents 50000 ground m',
          ],
          feedback: [
            '厘米与米未统一，放大了一百倍。',
            'Mixing centimetres and metres creates a hundredfold error.',
          ],
        },
        {
          text: [
            '屏幕放大两倍，真实路线也变两倍',
            'Double screen zoom doubles the ground route',
          ],
          feedback: [
            '缩放改变显示，不改变给定原图坐标或真实路线。',
            'Zoom changes display, not the original coordinates or ground route.',
          ],
        },
      ],
      steps: [
        '比例尺是同单位的图上长度:实际长度。',
        'A scale compares map length with ground length in matching units.',
      ],
    },
  },
  {
    title: ['正比例的初步图像', 'Introduction to direct proportion graphs'],
    objective: [
      '结合给定规则、正值比值与零点，辨认正比例及图像中的反例。',
      'Use a given rule, positive-input quotients and the zero point to identify direct proportion and graphical counterexamples.',
    ],
    prerequisites: ['P63-L04', 'P55-L03', 'P57-L03'],
    keywords: [
      ['正比例', 'direct proportion'],
      ['原点', 'origin'],
      ['比例常数', 'constant of proportionality'],
    ],
    hook: [
      '假想总价 y=3x 与 y=3x+4 都是直线，为什么只有一个正比例？y=x×x 过原点就够了吗？',
      'Both fictional price rules y=3x and y=3x+4 are straight. Why is only one direct proportion? Is passing through the origin enough for y=x×x?',
    ],
    lab: 'ratio-graph',
    goal: [
      '让孩子同时说明给定规则、恒定比值和零点，而不是只凭外形。',
      'Ask the learner to connect the given rule, constant quotient and zero point rather than appearance alone.',
    ],
    misconception: [
      '任何直线都正比例；过原点就够；用零行算 0/0；几个点证明唯一规律。',
      'Calling every straight line proportional, relying only on the origin, calculating 0/0, or treating a few points as proof of a unique rule.',
    ],
    prompts: [
      [
        '正 x 的 y/x 都相同吗？零对应什么？',
        'Do positive-input y/x values match, and what happens at zero?',
      ],
      [
        '换纵轴显示范围，数值或关系改变了吗？',
        'Does changing the vertical display range change values or the relationship?',
      ],
    ],
    reason: [
      '比较给定规则 y=3x、y=3x+4、y=x×x。分别用正值比值与零点说明哪一个是正比例。',
      'Compare the given rules y=3x, y=3x+4 and y=x×x. Use positive-input quotients and the zero point to identify direct proportion.',
    ],
    rubric: [
      'y=3x 对所有给定范围内的正 x 有 y/x=3，且零对应零，是正比例。y=3x+4 虽直但零对应四，正值比值如七和五不恒定；y=x² 虽过原点，但 x=1、2 时比值为一、二，也不恒定。不能用 0/0，零点看函数对应即可。规则已明确给定，有限几个点只核查，不能唯一证明所有输入；换轴范围不改关系。',
      'For the given rule y=3x, y/x=3 for every positive x in the domain and zero maps to zero, so it is direct proportion. The straight rule y=3x+4 maps zero to four and gives differing quotients such as seven and five. The curve y=x² passes through the origin but its quotients at one and two are one and two. Do not calculate 0/0; inspect the rule’s value at zero. The rules are given, and finite points corroborate them without establishing a unique rule for all inputs. Changing axis range preserves the relationships.',
    ],
    exitReason: [
      '用给定常数计算，同时说明坐标轴单位与正比例依据。',
      'Calculate using the given constant and state the axis units and proportionality evidence.',
    ],
    numbers: [
      {
        stem: [
          '给定假想规则 y=3x，x 为升、y 为新西兰元。4 L 对应多少钱？',
          'Given fictional rule y=3x, with x in litres and y in NZ dollars, what price corresponds to 4 L?',
        ],
        value: '12',
        unit: 'NZD',
        steps: [
          '每升三元，4×3=12 元；规则无固定费用。',
          'Three dollars per litre gives 4×3=12 dollars, with no fixed fee.',
        ],
        wrong: ['7', '3', '12 L'],
        diagram: { kind: 'ratio-graph', curve: 'direct', rate: 3 },
      },
      {
        stem: [
          '给定 y=2x，x 为升、y 为新西兰元，2.5 L 对应多少钱？',
          'Given y=2x, with litres on x and NZ dollars on y, what price corresponds to 2.5 L?',
        ],
        value: '5',
        unit: 'NZD',
        steps: [
          '2×2.5=5 元，连续升数可取非整数。',
          '2×2.5=5 dollars; a continuous volume can be noninteger.',
        ],
        wrong: ['4.5', '2', '5 L'],
      },
      {
        stem: [
          '给定 y=5x，总价 NZ$30 时水量多少升？',
          'Given y=5x, how many litres correspond to NZ$30?',
        ],
        value: '6',
        unit: 'L',
        steps: [
          '30÷5=6 L，乘回 5×6=30 元。',
          '30÷5=6 L; check 5×6=30 dollars.',
        ],
        wrong: ['150', '25', '6 NZD'],
      },
      {
        stem: [
          '给定含固定费用的规则 y=3x+4，零升时总价多少新西兰元？',
          'Given a fixed-fee rule y=3x+4, what is the price in NZ dollars at zero litres?',
        ],
        value: '4',
        unit: 'NZD',
        steps: [
          '代入 x=0，y=0+4=4 元；这条直线不经过原点。',
          'Substitute x=0 to get y=4 dollars; this straight line misses the origin.',
        ],
        wrong: ['0', '3', '4 L'],
      },
      {
        stem: [
          '给定反例规则 y=x×x，x=3 L 时总价多少新西兰元？',
          'Given counterexample rule y=x×x, what is the price in NZ dollars at x=3 L?',
        ],
        value: '9',
        unit: 'NZD',
        steps: [
          '3×3=9 元；此时 y/x=3，而 x=2 时比值为二，不恒定。',
          '3×3=9 dollars; y/x=3 here, while at x=2 it is two, so it is not constant.',
        ],
        wrong: ['6', '3', '9 L'],
      },
      {
        stem: [
          '给定 y=4x，x 为升、y 为新西兰元，1.5 L 对应多少钱？',
          'Given y=4x, with x in litres and y in NZ dollars, what price corresponds to 1.5 L?',
        ],
        value: '6',
        unit: 'NZD',
        steps: [
          '4×1.5=6 元；正 x 的 y/x 固定为四。',
          '4×1.5=6 dollars; y/x is four for every positive input.',
        ],
        wrong: ['5.5', '4', '6 L'],
      },
    ],
    pick: {
      stem: [
        '给定三个规则，哪个表示正比例？',
        'Which of these given rules represents direct proportion?',
      ],
      correct: 1,
      options: [
        {
          text: ['y=3x+4，因为是直线', 'y=3x+4 because it is straight'],
          feedback: [
            '固定四元使零不对应零，比值也不恒定。',
            'The fixed four-dollar fee breaks both the zero correspondence and constant quotient.',
          ],
        },
        {
          text: [
            'y=3x，因为正 x 比值固定且零对应零',
            'y=3x because positive-input quotients are constant and zero maps to zero',
          ],
          feedback: [
            '规则同时满足两个证据，图线为过原点的直线。',
            'The rule satisfies both conditions and graphs as a straight line through the origin.',
          ],
        },
        {
          text: [
            'y=x×x，因为过原点',
            'y=x×x because it passes through the origin',
          ],
          feedback: [
            '过原点还不够，正值比值随 x 改变。',
            'Passing through the origin is insufficient; positive-input quotients change.',
          ],
        },
      ],
      steps: [
        '依据给定规则看恒定比值与零点，不能只看图线外形。',
        'Use the given rule to check a constant quotient and zero point, not appearance alone.',
      ],
    },
  },
];
export const p63Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P63-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i >= 4 ? 22 : 18,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P63',
    order: i + 1,
    nzYearHints: [6, 7],
    cnGradeHints: [6],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.numbers[0]),
    questions: [
      c(`${id}-Q1`, i, s.pick),
      ...s.numbers.slice(1, 5).map((n, j) => q(`${id}-Q${j + 2}`, i, n)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: q(`${id}-X`, i, s.numbers[5]),
    exitReason: T(s.exitReason),
    parent: {
      goal: T(s.goal),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上设计假想饮水站：25 L 按 A:B=2:3 分给两区；原图 1:50000，通往站点的路线先三厘米再两厘米；假想补水价 y=3x，算四升的费用，并解释加四元固定费后为什么不再正比例。核对两区总量、路线单位与零点。无需出行、购物或配制饮料。',
            'Design a fictional water station on paper: allocate 25 L to zones A:B=2:3; find the route distance for original scale 1:50000 with three-centimetre and two-centimetre legs; use fictional price y=3x for four litres, then explain why adding a four-dollar fixed fee breaks direct proportion. Check the conserved total, route units and zero point. No travel, purchase or drink preparation is required.',
          ),
        }
      : {}),
  };
});
export function p63ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const i = p63Lessons.findIndex((l) => l.id === id);
  if (i < 0) throw new RangeError('Unknown P63 lesson');
  const k = round % 80;
  let item: Item;
  if (i === 0) {
    const a = 2 + (k % 5),
      b = 3 + (Math.floor(k / 5) % 5),
      g = commonFactor(a, b);
    item = {
      stem: [
        `A 有 ${a} 张卡，B 有 ${b} 张，写 A:B。`,
        `A has ${a} cards and B ${b}. Write A:B.`,
      ],
      value: `${a / g}:${b / g}`,
      ratio: true,
      steps: [
        `按 A、B 顺序比较 ${a}:${b}，不把总量作后项。`,
        `Compare ${a}:${b} in A,B order; do not use the total as second term.`,
      ],
      wrong: [`${a}:${a + b}`, String(a / b)],
    };
  } else if (i === 1) {
    const a = 2 + (k % 4),
      b = 3 + (Math.floor(k / 4) % 4),
      m = 2 + (Math.floor(k / 16) % 4),
      g = commonFactor(a, b);
    item = {
      stem: [
        `把 ${a * m}:${b * m} 化成最简整数比。`,
        `Write ${a * m}:${b * m} in simplest integer terms.`,
      ],
      value: `${a / g}:${b / g}`,
      ratio: true,
      simplest: true,
      steps: [
        `两项同除 ${m * g} 得 ${a / g}:${b / g}，两项互质。`,
        `Divide both terms by ${m * g} for coprime ${a / g}:${b / g}.`,
      ],
      wrong: [`${a * m}:${b * m}`, String(a / b)],
    };
  } else if (i === 2) {
    const total = 5 + (k % 8) * 5,
      a = 1 + (Math.floor(k / 8) % 3),
      b = 2 + (Math.floor(k / 24) % 3),
      first = k % 2 === 0;
    item = {
      stem: [
        `${total} L 按 A:B=${a}:${b} 分配，${first ? 'A' : 'B'} 得多少升？`,
        `Share ${total} L in ratio A:B=${a}:${b}. How many litres does ${first ? 'A' : 'B'} get?`,
      ],
      value: `${total * (first ? a : b)}/${a + b}`,
      unit: 'L',
      steps: [
        `总权重 ${a + b}，所求量为 ${total}÷${a + b}×${first ? a : b} L。`,
        `The total weight is ${a + b}: ${total}÷${a + b}×${first ? a : b} L.`,
      ],
      wrong: [String(total * (first ? a : b)), `${total}%`],
    };
  } else if (i === 3) {
    const a = 2 + (k % 3),
      b = 3 + (Math.floor(k / 3) % 4),
      m = 1 + (Math.floor(k / 12) % 4),
      first = k % 2 === 1;
    item = {
      stem: [
        `配方 A:B=${a}:${b}，已知 ${first ? 'B' : 'A'} 为 ${(first ? b : a) * m} L，${first ? 'A' : 'B'} 需多少升？`,
        `For A:B=${a}:${b}, ${first ? 'B' : 'A'} is ${(first ? b : a) * m} L. How many litres of ${first ? 'A' : 'B'} are needed?`,
      ],
      value: String((first ? a : b) * m),
      unit: 'L',
      steps: [
        `两列共同倍数 ${m}，目标量 ${(first ? a : b) * m} L。`,
        `The shared multiplier is ${m}, giving ${(first ? a : b) * m} L.`,
      ],
      wrong: [String((first ? a : b) * m + 1), `${(first ? a : b) * m}%`],
    };
  } else if (i === 4) {
    const scale = [10000, 20000, 25000, 50000][Math.floor(k / 5) % 4]!,
      map = (1 + (k % 5)) / 2;
    item = {
      stem: [
        `原图比例 1:${scale}，图上路线 ${map} cm，实际多少米？`,
        `At original map scale 1:${scale}, a route is ${map} cm. How many metres is the ground route?`,
      ],
      value: String((map * scale) / 100),
      unit: 'm',
      steps: [
        `${map}×${scale} cm，再除以一百换成米。`,
        `${map}×${scale} cm, then divide by one hundred for metres.`,
      ],
      wrong: [String(map * scale), `${(map * scale) / 100} km`],
    };
  } else {
    const mode = k % 3,
      x = (1 + (Math.floor(k / 3) % 8)) / 2,
      rate = 1 + (Math.floor(k / 24) % 3),
      formula = mode === 2 ? 'x×x' : `${rate}x${mode === 1 ? '+4' : ''}`,
      cost = mode === 2 ? x * x : rate * x + (mode === 1 ? 4 : 0);
    item = {
      stem: [
        `给定假想规则 y=${formula}，x 为升、y 为新西兰元。${x} L 对应多少钱？`,
        `Given fictional rule y=${formula}, with x in litres and y in NZ dollars, what price corresponds to ${x} L?`,
      ],
      value: String(cost),
      unit: 'NZD',
      steps: [
        `把给定 ${x} 代入原规则，得到 ${cost} 新西兰元；不因图线外形更改规则。`,
        `Substitute ${x} into the given rule to get ${cost} NZ dollars; do not change the rule based on appearance.`,
      ],
      wrong: [String(cost + 1), `${cost} L`],
    };
  }
  return q(`${id}-R${round}`, i, item);
}
export const p63CheckQuestions: Question[] = [
  q('P63-CHECK-Q1', 1, {
    stem: [
      '把 0.8:1.2 化成最简整数比。',
      'Write 0.8:1.2 in simplest integer terms.',
    ],
    value: '2:3',
    ratio: true,
    simplest: true,
    steps: [
      '两项同乘十再同除四，8:12=2:3。',
      'Multiply both terms by ten, then divide both by four: 8:12=2:3.',
    ],
    wrong: ['4:6', '8:12', '3:2'],
  }),
  q('P63-CHECK-Q2', 2, {
    stem: [
      '42 L 按 A:B=2:5 分配，B 得多少升？',
      'Share 42 L in ratio A:B=2:5. How many litres does B get?',
    ],
    value: '30',
    unit: 'L',
    steps: [
      '七份每份六升，B 五份得三十升。',
      'Seven parts give six litres each; B receives thirty litres.',
    ],
    wrong: ['12', '105', '30%'],
  }),
  q('P63-CHECK-Q3', 3, {
    stem: [
      '配方 A:B=5:3，A 为 20 L 时 B 需多少升？',
      'For recipe A:B=5:3, how many litres of B go with 20 L of A?',
    ],
    value: '12',
    unit: 'L',
    steps: [
      '两列同乘四，B=3×4=12 L。',
      'Both columns multiply by four, giving B=3×4=12 L.',
    ],
    wrong: ['18', '100/3', '12%'],
  }),
  q('P63-CHECK-Q4', 4, {
    stem: [
      '原图比例 1:25000，路线长 3.2 cm，实际多少米？',
      'At original map scale 1:25000, a route is 3.2 cm. How many metres is it on the ground?',
    ],
    value: '800',
    unit: 'm',
    steps: ['3.2×25000=80000 cm=800 m。', '3.2×25000=80000 cm=800 m.'],
    wrong: ['80000', '80', '800 km'],
  }),
  q('P63-CHECK-Q5', 5, {
    stem: [
      '给定 y=2.5x，x 为升、y 为新西兰元，4 L 对应多少钱？',
      'Given y=2.5x, with x in litres and y in NZ dollars, what price corresponds to 4 L?',
    ],
    value: '10',
    unit: 'NZD',
    steps: [
      '2.5×4=10 元，比例常数可为小数。',
      '2.5×4=10 dollars; a proportionality constant may be decimal.',
    ],
    wrong: ['6.5', '2.5', '10 L'],
  }),
  c('P63-CHECK-Q6', 3, specs[3]!.pick),
  q('P63-CHECK-Q7', 1, {
    stem: [
      '把 2/3:5/6 化成最简整数比。',
      'Write 2/3:5/6 in simplest integer terms.',
    ],
    value: '4:5',
    ratio: true,
    simplest: true,
    steps: [
      '两项同乘六得 4:5，四与五互质。',
      'Multiply both terms by six for coprime 4:5.',
    ],
    wrong: ['2:5', '8:10', '5:4'],
  }),
  reasoning(
    'P63-CHECK-Q8',
    t(
      'A:B=2:3 时 A 占整体多少？再解释直线 y=3x+4 为什么不正比例，地图屏幕放大为什么不增加真实路程。明确各自参照。',
      'For A:B=2:3, what fraction of the whole is A? Then explain why the straight line y=3x+4 is not direct proportion and why screen map zoom does not increase a ground route. Identify each reference.',
    ),
    skills[5]!,
    t(
      'A 占两项和的 2/5，不是部分比部分的 2/3。给定 y=3x+4 虽为直线，但零对应四且正值 y/x 不恒定，所以不是正比例。地图仍按给定原坐标和同单位比例尺求真实路程；显示放大使路径与线段比例尺同时变长，不改变原坐标。若真的印图放大，要更新数值比例尺。家长按对象、整体、恒定关系与缩放条件核对，不按关键词自动评判。',
      'A is 2/5 of the total weight, rather than the part-to-part quotient 2/3. The given rule y=3x+4 is straight but maps zero to four and has changing positive-input y/x, so it is not direct proportion. Ground route distance uses the stated original coordinates and same-unit scale. Screen zoom enlarges the route and graphic scale bar together without changing those coordinates; an enlarged paper print instead needs an updated numerical scale. Review quantities, wholes, constant relationships and zoom conditions rather than matching keywords.',
    ),
    hints[5]!.map(T),
  ),
];
