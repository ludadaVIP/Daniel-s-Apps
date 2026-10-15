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
  'signed-temperature-reference',
  'integer-axis-position',
  'negative-number-order',
  'signed-cross-zero-movement',
  'absolute-value-distance',
];
const hints: [Pair, Pair][] = [
  [
    [
      '先找摄氏零度，确认指示在线上方、下方还是恰好零处。',
      'Locate zero Celsius and decide whether the indicator is above, below or at zero.',
    ],
    [
      '数一度小格，零下用负号；数字标签隔几格写不改变小格大小。',
      'Count one-degree intervals and use a minus sign below zero. Sparse labels do not change the unit size.',
    ],
  ],
  [
    [
      '先找零，向左是负整数，向右是正整数。',
      'Find zero: negative integers lie left and positive integers right.',
    ],
    [
      '数的是单位间隔，不是刻度线条数；零既不正也不负。',
      'Count unit intervals rather than tick marks. Zero is neither positive nor negative.',
    ],
  ],
  [
    [
      '完整保留负号，先在数轴上想象两个位置。',
      'Keep the complete signs and locate both positions on a number line.',
    ],
    [
      '右边更大；两个负数中靠近零的更大，但不能把去掉负号的数码直接比较。',
      'Farther right is larger. Of two negative numbers, the one nearer zero is larger; comparing unsigned digits gives the wrong order.',
    ],
  ],
  [
    [
      '分清起点、运算和带符号的项。加负数向左，减一个变化是撤销它。',
      'Identify the start, operation and signed term. Adding a negative moves left; subtracting a change undoes it.',
    ],
    [
      '跨零时先走到零再完成剩余步数；终点与移动距离分开，并用终点减变化核回起点。',
      'When crossing zero, reach zero then complete the remaining steps. Distinguish endpoint from distance, and subtract the change from the endpoint to check the start.',
    ],
  ],
  [
    [
      '绝对值问到零的距离，不问左或右的位置。',
      'Absolute value asks for distance to zero, not a left or right position.',
    ],
    [
      '距离非负，零的绝对值为零；相反数是对称位置，不等同绝对值。',
      'Distance is nonnegative and zero has absolute value zero. An opposite is a reflected position, which differs from absolute value.',
    ],
  ],
];
function q(id: string, index: number, item: Item): Question {
  const [n, d] = exactRational(item.value)!;
  const question = numeric(
    id,
    T(item.stem),
    item.value,
    skills[index]!,
    hints[index]!.map(T),
    [T(item.steps), T(hints[index]![1])],
    {
      accepted: [
        item.value,
        item.value.replace('-', '−'),
        `${n * 2n}/${d * 2n}`,
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  question.answer = {
    kind: 'number',
    value: item.value,
    unit: item.unit,
    formats: ['decimal', 'fraction'],
  };
  question.type = item.unit
    ? 'word_problem'
    : item.diagram
      ? 'visual_select'
      : 'numeric';
  question.misconceptionTags = [
    skills[index]!,
    'zero-reference',
    'sign-and-distance',
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
const axis = (value: number, label = 'P'): Question['diagram'] => ({
  kind: 'signed-axis',
  points: [{ value, label }],
});
const specs: Spec[] = [
  {
    title: ['温度中的负数', 'Negative numbers in temperatures'],
    objective: [
      '相对摄氏零度读出正、负和零温度，并保留符号与单位。',
      'Read positive, negative and zero temperatures relative to zero Celsius, retaining sign and unit.',
    ],
    prerequisites: ['B05-L01', 'P57-L03'],
    keywords: [
      ['负数', 'negative number'],
      ['零点基准', 'zero reference'],
      ['摄氏度', 'degrees Celsius'],
    ],
    hook: [
      '假想温度指示在零下四个一度小格。为什么要写 −4°C，而不能只写 4°C？零度是最低温吗？',
      'A fictional indicator sits four one-degree intervals below zero. Why write −4°C instead of 4°C? Is zero the lowest temperature?',
    ],
    lab: 'signed-temperature',
    goal: [
      '让孩子先定位零点，再结合小格、方向、负号与摄氏单位读数。',
      'Ask the learner to locate zero before combining interval size, direction, sign and Celsius units.',
    ],
    misconception: [
      '零下漏负号；把零度当没有温度或最低温；只数标注数字不看小格。',
      'Omitting a minus sign below zero, treating zero as no temperature or the minimum, or counting labels rather than intervals.',
    ],
    prompts: [
      [
        '指示线在零的哪一边？每小格多少度？',
        'Which side of zero contains the indicator, and what does one interval represent?',
      ],
      [
        '标签从每度改成每五度，实际读数改变了吗？',
        'Does labeling every fifth degree change the actual reading?',
      ],
    ],
    reason: [
      '解释 −4°C、0°C、+4°C 三个读数的关系。为什么 −4°C 不是没有温度，0°C 也不是最低温？',
      'Explain the relationship between −4°C, 0°C and +4°C. Why is −4°C not an absence of temperature, and why is 0°C not the lowest temperature?',
    ],
    rubric: [
      '摄氏零度是这里的刻度参照，−4°C 表示比零低四度，+4°C 表示比零高四度，零恰在两边之间。小格一度且两边间隔相同，负号不能省。负数仍是有效读数，零不是没有温度或最低限度；例如图中还可有更低的 −5°C。家长看是否说清基准、方向、间隔和单位，不要求孩子记物理定律或真实天气资料。',
      'Zero Celsius is the reference on this scale. −4°C is four degrees below it, while +4°C is four above it and zero lies between them. Equal one-degree intervals apply on both sides, so the minus sign matters. A negative reading is still a temperature, and zero is neither absence of temperature nor a minimum; −5°C is another lower reading. Check reference, direction, interval and units without requiring physical laws or real weather data.',
    ],
    exitReason: [
      '说明零下位置与负号，保留摄氏单位。',
      'Explain the below-zero position and minus sign, keeping the Celsius unit.',
    ],
    numbers: [
      {
        stem: [
          '假想温度指示在零下四个一度小格，读数多少摄氏度？',
          'A fictional indicator is four one-degree intervals below zero. What is its Celsius reading?',
        ],
        value: '-4',
        unit: '°C',
        steps: [
          '零下四度写 −4°C；4°C 则在零上，是另一个位置。',
          'Four degrees below zero is −4°C; 4°C is a different position above zero.',
        ],
        wrong: ['4', '-5', '-4 m'],
        diagram: { kind: 'signed-thermometer', value: -4 },
      },
      {
        stem: [
          '假想指示在零上三个一度小格，读数多少摄氏度？',
          'A fictional indicator is three one-degree intervals above zero. What is its Celsius reading?',
        ],
        value: '3',
        unit: '°C',
        steps: [
          '零上三度为 +3°C，也可写 3°C。',
          'Three degrees above zero is +3°C, also written 3°C.',
        ],
        wrong: ['-3', '0', '3 m'],
      },
      {
        stem: [
          '假想温度指示恰在零刻度，读数多少摄氏度？',
          'A fictional indicator is exactly at the zero mark. What is its Celsius reading?',
        ],
        value: '0',
        unit: '°C',
        steps: [
          '零刻度读 0°C，既不为正也不为负。',
          'The zero mark reads 0°C, neither positive nor negative.',
        ],
        wrong: ['1', '-1', '0%'],
      },
      {
        stem: [
          '假想温度为零下七度，请写带符号的摄氏读数。',
          'A fictional temperature is seven degrees below zero. Write its signed Celsius reading.',
        ],
        value: '-7',
        unit: '°C',
        steps: [
          '“零下”对应负号，读作 −7°C。',
          'Below zero requires a minus sign: −7°C.',
        ],
        wrong: ['7', '-6', '-7 m'],
      },
      {
        stem: [
          '假想指示在 +5°C 上方一个一度小格，读数多少摄氏度？',
          'A fictional indicator is one one-degree interval above +5°C. What is its Celsius reading?',
        ],
        value: '6',
        unit: '°C',
        steps: [
          '从五度再向上一度，读作 +6°C。',
          'One degree above five is +6°C.',
        ],
        wrong: ['4', '-6', '6 m'],
      },
      {
        stem: [
          '假想温度指示在零下九个一度小格，读数多少摄氏度？',
          'A fictional indicator is nine one-degree intervals below zero. What is its Celsius reading?',
        ],
        value: '-9',
        unit: '°C',
        steps: [
          '由零向下数九个一度间隔，得到 −9°C。',
          'Count nine equal one-degree intervals down from zero: −9°C.',
        ],
        wrong: ['9', '-10', '-9 m'],
      },
    ],
    pick: {
      stem: [
        '关于摄氏零刻度，哪句正确？',
        'Which statement about zero on this Celsius scale is correct?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '零度表示没有温度，所以不存在零下',
            'Zero means no temperature, so below-zero readings do not exist',
          ],
          feedback: [
            '零只是参照，负数读数仍有效。',
            'Zero is a reference; negative readings remain valid.',
          ],
        },
        {
          text: [
            '零度是基准，可以有零上、零下与恰好零度',
            'Zero is a reference, with readings above, below and at zero',
          ],
          feedback: [
            '方向、间隔与符号共同表示读数。',
            'Direction, intervals and sign together describe the reading.',
          ],
        },
        {
          text: [
            '−4°C 与 +4°C 相同，只是写法不同',
            '−4°C and +4°C are the same reading in different notation',
          ],
          feedback: [
            '两者到零同样远，但位于零的两侧，读数不同。',
            'They are equally far from zero but on different sides, so the readings differ.',
          ],
        },
      ],
      steps: [
        '摄氏零点是刻度参照，不是读数的最低限度。',
        'Zero Celsius is a scale reference rather than a minimum reading.',
      ],
    },
  },
  {
    title: ['零的两边：整数数轴', 'Integers on both sides of zero'],
    objective: [
      '按同样单位间隔把正整数、负整数和零定位在有方向的数轴上。',
      'Locate positive integers, negative integers and zero using equal unit intervals on an oriented number line.',
    ],
    prerequisites: ['P64-L01', 'B01-L03'],
    keywords: [
      ['整数', 'integer'],
      ['数轴方向', 'axis direction'],
      ['单位间隔', 'unit interval'],
    ],
    hook: [
      '从零向左走五格，为什么到 −5 而不是 +5？把数字标签隔两格写，会改变点的位置吗？',
      'Why does moving five steps left from zero reach −5 rather than +5? Does labeling every second interval change the point’s position?',
    ],
    lab: 'signed-line',
    goal: [
      '确认零、向右增大和等单位间隔，再数移动而不是数刻度条数。',
      'Establish zero, increasing values to the right and equal unit spacing, then count moves rather than tick marks.',
    ],
    misconception: [
      '把负半轴顺序倒画；把零计成第一步；稀疏标签改变单位格；零算正数。',
      'Reversing order on the negative side, counting zero as a first step, changing unit size when labels are sparse, or calling zero positive.',
    ],
    prompts: [
      [
        '从零到 −5 实际跨过几个间隔？',
        'How many intervals separate zero and −5?',
      ],
      [
        '−1 左边、右边紧邻的整数分别是什么？',
        'Which integers immediately border −1 on the left and right?',
      ],
    ],
    reason: [
      '用数轴说明 −5 在哪里，为什么从零走五格不能把起点零算成第一格；并解释零的分类。',
      'Use a number line to locate −5, explain why the starting zero is not the first step, and classify zero.',
    ],
    rubric: [
      '先指定零点、向右为增大方向和每小格一单位。向左依次到 −1、−2、−3、−4、−5，五次移动跨五个间隔；零只是起点，不是已经走过的一格。负整数在零左，正整数在零右，零是整数，但既不是正数，也不是负数。标签隔两格或四格不改变位置与单位。家长核对方向、单位、间隔计数及零的分类，可用口述或走纸条模型。',
      'Specify zero, the increasing direction to the right and one unit per interval. Moving left reaches −1, −2, −3, −4 and −5 in five moves. Zero is the starting position, not an interval already travelled. Negative integers lie left of zero and positive integers right; zero is an integer but neither positive nor negative. Sparse labels do not change unit spacing or position. Check direction, interval counting and zero’s classification through a spoken or drawn explanation.',
    ],
    exitReason: [
      '先找零与方向，再数单位间隔确定符号和数值。',
      'Find zero and direction before counting unit intervals for sign and value.',
    ],
    numbers: [
      {
        stem: [
          '每格一单位，从零向左五格的点 P 表示哪个整数？',
          'With one unit per interval, what integer is point P five steps left of zero?',
        ],
        value: '-5',
        steps: [
          '向左依次到 −1 至 −5，五个单位间隔到 −5。',
          'Five unit moves left pass −1 through −5, reaching −5.',
        ],
        wrong: ['5', '-4', '-5%'],
        diagram: axis(-5),
      },
      {
        stem: [
          '每格一单位，点 A 在零左边七格，A 表示哪个整数？',
          'With one unit per interval, A is seven steps left of zero. What integer is A?',
        ],
        value: '-7',
        steps: [
          '左边使用负整数，七格对应 −7。',
          'Negative integers lie left of zero; seven intervals gives −7.',
        ],
        wrong: ['7', '-6', '-7 m'],
      },
      {
        stem: [
          '每格一单位，点 Q 在零右边三格，Q 表示哪个整数？',
          'With one unit per interval, Q is three steps right of zero. What integer is Q?',
        ],
        value: '3',
        steps: [
          '向右为正，三格对应 +3，也可写三。',
          'Right is positive: three intervals gives +3, also written 3.',
        ],
        wrong: ['-3', '2', '3%'],
      },
      {
        stem: [
          '整数数轴上，零左边紧邻的整数是什么？',
          'Which integer is immediately left of zero?',
        ],
        value: '-1',
        steps: [
          '从零向左一个单位到 −1，不是 +1。',
          'One unit left from zero reaches −1, not +1.',
        ],
        wrong: ['1', '0', '-2'],
      },
      {
        stem: [
          '整数数轴上，−4 与 −2 正中间的整数是什么？',
          'Which integer is halfway between −4 and −2?',
        ],
        value: '-3',
        steps: [
          '按从左到右顺序为 −4、−3、−2，中间是 −3。',
          'The left-to-right order is −4, −3, −2, so the middle integer is −3.',
        ],
        wrong: ['3', '-6', '-1'],
      },
      {
        stem: [
          '每格一单位，从零向左十一格，终点表示哪个整数？',
          'With one unit per interval, what integer is eleven steps left of zero?',
        ],
        value: '-11',
        steps: [
          '十一格在零左边，表示 −11。',
          'Eleven intervals left of zero represents −11.',
        ],
        wrong: ['11', '-10', '-12'],
      },
    ],
    pick: {
      stem: [
        '整数数轴的正确约定是哪句？',
        'Which correctly describes this integer number line?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '向右数值增大，零两边的单位间隔相等',
            'Values increase rightward, with equal unit intervals on both sides of zero',
          ],
          feedback: [
            '方向、零点与同样单位共同确定位置。',
            'Direction, zero and equal units establish position.',
          ],
        },
        {
          text: [
            '−6 比 −5 更靠右，因为六比五大',
            '−6 is right of −5 because six exceeds five',
          ],
          feedback: [
            '负数也沿左小右大的顺序；−6 在 −5 左边。',
            'Signed order still increases rightward; −6 is left of −5.',
          ],
        },
        {
          text: ['零属于正整数', 'Zero is a positive integer'],
          feedback: [
            '零是整数，但既不是正数也不是负数。',
            'Zero is an integer but neither positive nor negative.',
          ],
        },
      ],
      steps: [
        '先固定方向、零和等单位，不把正数数码规则直接套在负半轴。',
        'Fix direction, zero and equal units before interpreting the negative side.',
      ],
    },
  },
  {
    title: ['负数的大小比较', 'Comparing negative numbers'],
    objective: [
      '依据数轴上右边更大的顺序比较含负数的整数，保留符号。',
      'Compare integers including negative numbers using rightward-increasing order while retaining their signs.',
    ],
    prerequisites: ['P64-L02', 'B01-L03'],
    keywords: [
      ['大小关系', 'order relation'],
      ['右边更大', 'larger to the right'],
      ['同一位置', 'same position'],
    ],
    hook: [
      '−8 与 −3，哪个更大？八比三大，为什么不足以回答这道题？',
      'Which is larger, −8 or −3? Why is eight being larger than three insufficient evidence?',
    ],
    lab: 'signed-compare',
    goal: [
      '让孩子先定位完整带符号的数，再用左、右或重合说明关系。',
      'Ask the learner to locate complete signed numbers and explain order using left, right or coincidence.',
    ],
    misconception: [
      '两个负数按去负号的数码比；用离零远代替数值大；把比较符号反写。',
      'Comparing unsigned digits, treating farther from zero as larger, or reversing a comparison symbol.',
    ],
    prompts: [
      ['哪一个点在数轴右边？', 'Which point is farther right?'],
      [
        '两点重合时应该选哪个关系？',
        'Which relation applies when the points coincide?',
      ],
    ],
    reason: [
      '解释 −8<−3，却不能说“八比三大，所以 −8 更大”。再说明 −1 与零的顺序。',
      'Explain −8<−3 without relying on the unsigned digits, and state the order of −1 and zero.',
    ],
    rubric: [
      '按零左边单位格定位，−8 在 −3 左边，所以 −8<−3；从 −8 向右走五格会到 −3。虽然八大于三，但那比较的是正数大小，不是本题完整带符号的位置。负数均在零左边，故 −1<0。两个负数中靠近零的较大，这不是所有数字都“离零近就更大”的通则；正数仍向右增大。重合点才相等。',
      'Locate −8 and −3 using equal intervals left of zero. −8 is left of −3, so −8<−3; five rightward moves connect them. Eight exceeding three compares unsigned positive values, not these complete signed positions. Negative numbers lie left of zero, so −1<0. Among two negatives, the one nearer zero is larger, but “nearer zero is always larger” is not a universal rule for positive values. Coincident points alone represent equality.',
    ],
    exitReason: [
      '用数轴顺序说明选择的是较大还是较小，负号不丢。',
      'Explain whether the target is larger or smaller using axis order, retaining minus signs.',
    ],
    numbers: [
      {
        stem: [
          '−8 与 −3 中，哪个数更大？只写较大的数。',
          'Which is larger, −8 or −3? Enter only the larger number.',
        ],
        value: '-3',
        steps: [
          '−3 在 −8 右边，所以较大的是 −3。',
          '−3 is right of −8, so −3 is larger.',
        ],
        wrong: ['3', '-8', '8'],
        diagram: {
          kind: 'signed-axis',
          points: [
            { value: -8, label: 'A' },
            { value: -3, label: 'B' },
          ],
        },
      },
      {
        stem: ['−12 与 −4 中，哪个数更大？', 'Which is larger, −12 or −4?'],
        value: '-4',
        steps: ['−4 更靠右，因此 −4>−12。', '−4 is farther right, so −4>−12.'],
        wrong: ['-12', '4', '12'],
      },
      {
        stem: ['−2 与 +1 中，哪个数更小？', 'Which is smaller, −2 or +1?'],
        value: '-2',
        steps: [
          '−2 在零左边，+1 在零右边，较小的是 −2。',
          '−2 is left of zero and +1 right, so −2 is smaller.',
        ],
        wrong: ['1', '2', '-1'],
      },
      {
        stem: [
          '假想读数 −6°C 与 −2°C，较暖的读数是多少摄氏度？',
          'Of fictional readings −6°C and −2°C, which Celsius reading is warmer?',
        ],
        value: '-2',
        unit: '°C',
        steps: [
          '−2°C 在较高刻度，比 −6°C 暖，但仍为零下。',
          '−2°C is higher on the scale and warmer than −6°C, while still below zero.',
        ],
        wrong: ['2', '-6', '-2 m'],
      },
      {
        stem: ['−1 与 0 中，哪个数更大？', 'Which is larger, −1 or 0?'],
        value: '0',
        steps: [
          '零在 −1 右边，因此零更大，但零不是正数。',
          'Zero is right of −1 and therefore larger, but it is not positive.',
        ],
        wrong: ['-1', '1', '0%'],
      },
      {
        stem: ['−9 与 −5 中，哪个数更小？', 'Which is smaller, −9 or −5?'],
        value: '-9',
        steps: [
          '−9 在 −5 左边，所以较小的是 −9。',
          '−9 is left of −5, so −9 is smaller.',
        ],
        wrong: ['-5', '9', '5'],
      },
    ],
    pick: {
      stem: ['哪句解释正确？', 'Which explanation is correct?'],
      correct: 2,
      options: [
        {
          text: ['−8>−3，因为八大于三', '−8>−3 because eight exceeds three'],
          feedback: [
            '去掉负号后比较的是另一组数。',
            'Discarding the signs compares different numbers.',
          ],
        },
        {
          text: [
            '−8=−3，因为都在零左边',
            '−8=−3 because both are left of zero',
          ],
          feedback: [
            '同在左边不等于位置重合。',
            'Being on the same side does not make positions coincide.',
          ],
        },
        {
          text: ['−8<−3，因为 −3 在右边', '−8<−3 because −3 is farther right'],
          feedback: [
            '数轴完整带符号的位置支持这个顺序。',
            'The signed axis positions support this order.',
          ],
        },
      ],
      steps: [
        '整数数轴向右数值增大，这个约定也适用于负数。',
        'The rightward-increasing convention applies to negative numbers too.',
      ],
    },
  },
  {
    title: ['跨过零的加减', 'Adding and subtracting across zero'],
    objective: [
      '用有方向的单位移动解释跨零加减，区分终点、带符号变化与距离。',
      'Explain signed addition and subtraction through directed unit moves across zero, distinguishing endpoint, signed change and distance.',
    ],
    prerequisites: ['P64-L03', 'B03-L01'],
    keywords: [
      ['起点与终点', 'start and endpoint'],
      ['带符号变化', 'signed change'],
      ['撤销变化', 'undo a change'],
    ],
    hook: [
      '从 −3 出发加五，先到零再走几步？最后的 2、变化 +5 与走过五格分别表示什么？',
      'Starting at −3, add five. After reaching zero, how many steps remain? What do endpoint 2, change +5 and distance five each describe?',
    ],
    lab: 'signed-move',
    goal: [
      '让孩子在数轴上逐步说明方向与步数，再用撤销变化核回起点。',
      'Ask the learner to explain direction and steps before using an inverse change to check the start.',
    ],
    misconception: [
      '到零就停；把负数相加当相减；减负数仍向左；把终点当移动距离。',
      'Stopping at zero, treating addition of a negative as positive addition, moving left when subtracting a negative, or confusing endpoint with distance.',
    ],
    prompts: [
      [
        '到零已经走几格，还剩几格？',
        'How many steps reach zero, and how many remain?',
      ],
      [
        '减去一个向左的变化，应该怎样撤销？',
        'How do you undo a leftward change when subtracting it?',
      ],
    ],
    reason: [
      '用数轴解释 −3+5=2 与 −3−(−5)=2；分清终点、变化、距离以及到零和跨零。',
      'Explain −3+5=2 and −3−(−5)=2 with a number line. Distinguish endpoint, change, distance, reaching zero and crossing zero.',
    ],
    rubric: [
      '从 −3 向右五格，先三格到零，再两格到 +2，故 −3+5=2。减去 −5 是撤销向左五格的变化，相当于向右五格，终点也为二；这是加减的逆关系，不是直接套乘法口诀。两例带符号变化为 +5，距离五格，终点为二，三个概念不同。用 2−5=−3 核回。若 −5+5=0，只到零未跨到正侧；加减零不产生一步。',
      'From −3, move five units right: three to zero and two more to +2, giving −3+5=2. Subtracting −5 undoes a five-unit leftward change, so it moves five right and also ends at two. This is inverse addition/subtraction reasoning, not a multiplication slogan. The signed change is +5, the travelled distance five and the endpoint two. Check 2−5=−3. In contrast, −5+5 reaches zero without crossing to the positive side, and adding or subtracting zero creates no step.',
    ],
    exitReason: [
      '用温度的起点加上正变化，跨零后继续完成全部步数。',
      'Start from the signed temperature, add the positive change and complete every step beyond zero.',
    ],
    numbers: [
      {
        stem: [
          '从 −3 出发加五，−3+5 等于多少？',
          'Starting at −3 and adding five, what is −3+5?',
        ],
        value: '2',
        steps: [
          '先右走三格到零，再右走两格到二。',
          'Move three steps right to zero, then two more right to two.',
        ],
        wrong: ['-2', '0', '8'],
        diagram: axis(-3, 'A'),
      },
      {
        stem: ['4−7 等于多少？', 'What is 4−7?'],
        value: '-3',
        steps: [
          '从四向左七格，先四格到零，再三格到 −3。',
          'From four, move seven left: four to zero and three more to −3.',
        ],
        wrong: ['3', '11', '0'],
      },
      {
        stem: ['−4+(−3) 等于多少？', 'What is −4+(−3)?'],
        value: '-7',
        steps: [
          '加负三表示向左三格，从 −4 到 −7。',
          'Adding negative three moves three left, from −4 to −7.',
        ],
        wrong: ['-1', '7', '1'],
      },
      {
        stem: [
          '−3−(−5) 等于多少？用撤销变化思考。',
          'What is −3−(−5)? Think of undoing a change.',
        ],
        value: '2',
        steps: [
          '减去向左五格的变化，改为向右五格，从 −3 到二。',
          'Undo a five-step leftward change by moving five right, from −3 to two.',
        ],
        wrong: ['-8', '-2', '8'],
      },
      {
        stem: ['−5+5 等于多少？', 'What is −5+5?'],
        value: '0',
        steps: [
          '五格正好到零，没有剩余步数跨到正侧。',
          'Five rightward steps reach zero exactly, with none remaining to cross to the positive side.',
        ],
        wrong: ['10', '-10', '5'],
      },
      {
        stem: [
          '假想温度从 −2°C 升高 7°C，最后读数多少摄氏度？',
          'A fictional temperature rises by 7°C from −2°C. What is the final Celsius reading?',
        ],
        value: '5',
        unit: '°C',
        steps: [
          '−2+7=5，先升两度到零，再升五度到 +5°C。',
          '−2+7=5: rise two degrees to zero, then five more to +5°C.',
        ],
        wrong: ['-5', '7', '9'],
      },
    ],
    pick: {
      stem: ['−3+5 的正确分步过程是什么？', 'Which correctly stages −3+5?'],
      correct: 0,
      options: [
        {
          text: [
            '向右三格到零，再向右两格到二',
            'Three right to zero, then two more right to two',
          ],
          feedback: [
            '总共五格且方向不变，零不是终点。',
            'That completes all five moves in the same direction; zero is intermediate.',
          ],
        },
        {
          text: ['向右三格到零，立刻停止', 'Three right to zero, then stop'],
          feedback: [
            '还剩两格，不能丢掉。',
            'Two steps remain and cannot be discarded.',
          ],
        },
        {
          text: [
            '把三与五相加，所以到负八',
            'Add the unsigned digits to reach negative eight',
          ],
          feedback: [
            '这相当于向左，和本题加正五的方向不同。',
            'That moves left, unlike adding positive five here.',
          ],
        },
      ],
      steps: [
        '先确定带符号变化的方向，再保留完整步数分段走。',
        'Choose the direction of the signed change, then preserve every step across stages.',
      ],
    },
  },
  {
    title: ['数的绝对值初识', 'Introduction to absolute value'],
    objective: [
      '将绝对值解释为到零的非负距离，区别位置、相反数与两点间距离。',
      'Interpret absolute value as nonnegative distance to zero, distinguishing position, opposite and distance between other points.',
    ],
    prerequisites: ['P64-L04', 'P64-L02'],
    keywords: [
      ['绝对值', 'absolute value'],
      ['到零距离', 'distance to zero'],
      ['相反数', 'opposite number'],
    ],
    hook: [
      '−6 与 +6 位于零的两侧，为什么绝对值都为六？如果点就是零，距离还能说“一定为正”吗？',
      'Why do −6 and +6 both have absolute value six despite different positions? If the point is zero, must its distance be positive?',
    ],
    lab: 'signed-absolute',
    goal: [
      '把非负距离和带符号位置分开，再用零与正数反例区分相反数。',
      'Separate nonnegative distance from signed position, then use zero and a positive point to distinguish an opposite.',
    ],
    misconception: [
      '绝对值一定正；负数绝对值仍负；绝对值就是相反数；任意两点距离等于其中一点绝对值。',
      'Claiming absolute value is always positive, leaving a negative distance, equating absolute value with the opposite, or using it for distance to an arbitrary point.',
    ],
    prompts: [
      [
        '这道距离是从哪里量到哪里？',
        'From which reference to which point is the distance measured?',
      ],
      [
        '+6 的相反数与绝对值分别是什么？零呢？',
        'What are the opposite and absolute value of +6? What about zero?',
      ],
    ],
    reason: [
      '解释 |−6|=|6|=6，却不能推出 −6=6。再区分 +6 的相反数、绝对值与 |0|。',
      'Explain why |−6|=|6|=6 does not imply −6=6. Distinguish +6’s opposite, absolute value and |0|.',
    ],
    rubric: [
      '−6 与 +6 分别位于零左右两侧，都是六个单位间隔到零，故绝对值相同；位置和数值却不同。+6 的相反数是 −6，绝对值是六，两种关系不一样；−6 的相反数与绝对值恰好同为六只是此例重合。零到零没有距离，所以 |0|=0，绝对值非负而非必正。家长要求明确参照零与间隔，不能只接受“去负号”的口诀或关键词。',
      '−6 and +6 lie on opposite sides of zero, each six unit intervals away, so their absolute values match while their positions and values differ. The opposite of +6 is −6, but its absolute value is six; these are different relationships. For −6 they happen to give the same result. Zero has no distance from itself, so |0|=0: absolute value is nonnegative, not necessarily positive. Look for a zero reference and interval explanation, rather than a remove-the-minus slogan or keyword match.',
    ],
    exitReason: [
      '把到零的距离写成非负数，并说明零的特殊情形。',
      'Write distance to zero as a nonnegative number and explain the zero case.',
    ],
    numbers: [
      {
        stem: [
          '点 P 表示 −6，它到零的距离 |−6| 是多少？',
          'Point P represents −6. What is its distance to zero, |−6|?',
        ],
        value: '6',
        steps: [
          '−6 在零左六格，距离是六，不带方向负号。',
          '−6 is six intervals left of zero, so the distance is six without a direction sign.',
        ],
        wrong: ['-6', '0', '12'],
        diagram: {
          kind: 'signed-axis',
          points: [{ value: -6, label: 'P' }],
          segments: [{ from: 0, to: -6, arrow: false }],
        },
      },
      {
        stem: ['|−9| 等于多少？', 'What is |−9|?'],
        value: '9',
        steps: [
          '−9 到零九格，绝对值为九。',
          '−9 is nine intervals from zero, so its absolute value is nine.',
        ],
        wrong: ['-9', '0', '18'],
      },
      {
        stem: ['|+4| 等于多少？', 'What is |+4|?'],
        value: '4',
        steps: [
          '+4 到零四格，绝对值仍为四，不取相反数。',
          '+4 is four intervals from zero; its absolute value is four, not its opposite.',
        ],
        wrong: ['-4', '0', '8'],
      },
      {
        stem: ['|0| 等于多少？', 'What is |0|?'],
        value: '0',
        steps: [
          '零到零没有距离，所以 |0|=0，不是正数。',
          'Zero has no distance from itself, so |0|=0, which is not positive.',
        ],
        wrong: ['1', '-1', '0%'],
      },
      {
        stem: [
          '从 −4 沿数轴走到 +3，总共走几格？这里不是只问 |−4|。',
          'How many intervals connect −4 to +3? This asks more than |−4| alone.',
        ],
        value: '7',
        steps: [
          '先四格到零，再三格到 +3，合计七格；|−4| 单独只有四。',
          'Four intervals to zero and three more to +3 total seven; |−4| alone is only four.',
        ],
        wrong: ['4', '3', '-7'],
      },
      {
        stem: ['|−11| 等于多少？', 'What is |−11|?'],
        value: '11',
        steps: [
          '−11 到零十一格，绝对值为非负的十一。',
          '−11 is eleven intervals from zero, giving nonnegative absolute value eleven.',
        ],
        wrong: ['-11', '0', '22'],
      },
    ],
    pick: {
      stem: ['哪句同时正确？', 'Which statement is fully correct?'],
      correct: 1,
      options: [
        {
          text: [
            '绝对值一定正，零的绝对值也是一',
            'Absolute value is always positive, and |0| is one',
          ],
          feedback: [
            '零到自己距离零，所以应说非负。',
            'Zero is zero units from itself; use nonnegative instead.',
          ],
        },
        {
          text: [
            '|−6|=6，|6|=6，|0|=0，但 −6≠6',
            '|−6|=6, |6|=6 and |0|=0, while −6≠6',
          ],
          feedback: [
            '相同距离不等于相同位置，且零距离有效。',
            'Equal distances do not mean equal positions, and zero distance is valid.',
          ],
        },
        {
          text: [
            '绝对值与相反数永远一样',
            'Absolute value and opposite are always the same',
          ],
          feedback: [
            '+6 的相反数 −6，与绝对值六不同。',
            'The opposite of +6 is −6, unlike its absolute value six.',
          ],
        },
      ],
      steps: [
        '绝对值是到零的非负距离，相反数是对称位置。',
        'Absolute value is nonnegative distance to zero; an opposite is a reflected position.',
      ],
    },
  },
];
export const p64Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P64-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 3 ? 22 : 18,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P64',
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
    ...(i === 4
      ? {
          familyChallenge: t(
            '在纸上画 −12 到 +12 的整数数轴。标 −6、0、+6，比较位置与到零距离；再从 −4 向右七格，写终点、变化与距离。家长改变起点或方向，让孩子说明是否到零、跨零或未到零。另画三条假想摄氏读数，不需要测温、出门或查询真实天气。',
            'Draw an integer line from −12 to +12 on paper. Mark −6, 0 and +6, comparing positions and distances to zero. Move seven right from −4 and report endpoint, signed change and distance. A parent changes a start or direction and asks whether the move reaches, crosses or stays on one side of zero. Add three fictional Celsius readings; no thermometer, outing or real-weather lookup is needed.',
          ),
        }
      : {}),
  };
});
export function p64ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const i = p64Lessons.findIndex((l) => l.id === id);
  if (i < 0) throw new RangeError('Unknown P64 lesson');
  const k = round % 80;
  let item: Item;
  if (i === 0) {
    const v = -12 + (k % 25);
    item = {
      stem: [
        v === 0
          ? '假想指示恰在摄氏零刻度，读数多少？'
          : `假想指示在零${v < 0 ? '下' : '上'} ${Math.abs(v)} 个一度小格，读数多少摄氏度？`,
        v === 0
          ? 'A fictional indicator is at zero Celsius. What is its reading?'
          : `A fictional indicator is ${Math.abs(v)} one-degree intervals ${v < 0 ? 'below' : 'above'} zero. What is its Celsius reading?`,
      ],
      value: String(v),
      unit: '°C',
      steps: [
        `按零点与方向读出 ${v}°C，保留所需负号。`,
        `Read ${v}°C from zero and direction, retaining any required minus sign.`,
      ],
      wrong: [String(v === 0 ? 1 : -v), `${v} m`],
      diagram: {
        kind: 'signed-thermometer',
        value: v,
        interval: k % 2 ? 1 : 5,
      },
    };
  } else if (i === 1) {
    const v = -12 + (k % 25);
    item = {
      stem: [
        '每小格一单位，图中 P 表示哪个整数？',
        'With one unit per interval, what integer is P?',
      ],
      value: String(v),
      steps: [
        `从零按相等间隔定位 P=${v}；标签疏密不改变位置。`,
        `Use equal intervals from zero to locate P=${v}; sparse labels preserve position.`,
      ],
      wrong: [String(v + 1), `${v}%`],
      diagram: {
        kind: 'signed-axis',
        points: [{ value: v, label: 'P' }],
        interval: [1, 2, 4][k % 3]!,
      },
    };
  } else if (i === 2) {
    const a = -1 - (k % 12),
      b = -1 - (Math.floor(k / 12) % 12),
      larger = k % 2 === 0,
      v = larger ? Math.max(a, b) : Math.min(a, b);
    item = {
      stem: [
        `${a} 与 ${b} 中，写${larger ? '较大' : '较小'}的数；相同则写共同值。`,
        `Of ${a} and ${b}, enter the ${larger ? 'larger' : 'smaller'} number; if equal, enter their common value.`,
      ],
      value: String(v),
      steps: [
        `完整保留符号，${larger ? '右边较大' : '左边较小'}；所求为 ${v}。`,
        `Keep the signs: ${larger ? 'right is larger' : 'left is smaller'}, giving ${v}.`,
      ],
      wrong: [String(-v), `${v} m`],
      diagram: {
        kind: 'signed-axis',
        points: [
          { value: a, label: 'A' },
          { value: b, label: 'B' },
        ],
      },
    };
  } else if (i === 3) {
    const start = -10 + ((k * 5) % 21),
      term = -8 + ((k * 7) % 17),
      op = k % 2 === 0 ? '+' : '−',
      end = start + (op === '+' ? term : -term),
      expression = `${start}${op}(${term})`;
    item = {
      stem: [
        `计算 ${expression}，只写终点数。`,
        `Calculate ${expression}; enter only the endpoint.`,
      ],
      value: String(end),
      steps: [
        `从 ${start} 按带符号变化 ${op === '+' ? term : -term} 移动，终点 ${end}；再撤销变化核回。`,
        `Move from ${start} by signed change ${op === '+' ? term : -term}, ending at ${end}; undo the change to check.`,
      ],
      wrong: [String(end + 1), `${end}%`],
      diagram: axis(start, 'A'),
    };
  } else {
    const v = -12 + (k % 25);
    item = {
      stem: [`|${v}| 是多少？`, `What is |${v}|?`],
      value: String(Math.abs(v)),
      steps: [
        `到零 ${Math.abs(v)} 格，绝对值为 ${Math.abs(v)}，不带方向。`,
        `The point is ${Math.abs(v)} intervals from zero, giving absolute value ${Math.abs(v)} without direction.`,
      ],
      wrong: [String(v === 0 ? 1 : -Math.abs(v)), `${Math.abs(v)}%`],
      diagram: {
        kind: 'signed-axis',
        points: [{ value: v, label: 'P' }],
        segments: [{ from: 0, to: v, arrow: false }],
      },
    };
  }
  return q(`${id}-R${round}`, i, item);
}
export const p64CheckQuestions: Question[] = [
  q('P64-CHECK-Q1', 0, {
    stem: [
      '假想摄氏指示在零下六个一度小格，读数多少？',
      'A fictional Celsius indicator is six one-degree intervals below zero. What is its reading?',
    ],
    value: '-6',
    unit: '°C',
    steps: ['零下六度为 −6°C。', 'Six degrees below zero is −6°C.'],
    wrong: ['6', '-5', '-6 m'],
  }),
  q('P64-CHECK-Q2', 1, {
    stem: [
      '从零向左七个单位，终点是哪个整数？',
      'What integer is seven unit moves left of zero?',
    ],
    value: '-7',
    steps: ['向左七个间隔到 −7。', 'Seven intervals left reach −7.'],
    wrong: ['7', '-6', '-8'],
  }),
  q('P64-CHECK-Q3', 2, {
    stem: ['−10 与 −2 中，哪个数更大？', 'Which is larger, −10 or −2?'],
    value: '-2',
    steps: [
      '−2 在 −10 右边，因此较大。',
      '−2 is right of −10 and therefore larger.',
    ],
    wrong: ['-10', '2', '10'],
  }),
  q('P64-CHECK-Q4', 3, {
    stem: ['−6+10 等于多少？', 'What is −6+10?'],
    value: '4',
    steps: [
      '六格右走到零，再四格到四。',
      'Six steps right to zero, then four more to four.',
    ],
    wrong: ['-4', '0', '16'],
  }),
  q('P64-CHECK-Q5', 3, {
    stem: ['3−8 等于多少？', 'What is 3−8?'],
    value: '-5',
    steps: [
      '先左走三格到零，再五格到 −5。',
      'Move three left to zero, then five more to −5.',
    ],
    wrong: ['5', '11', '0'],
  }),
  c('P64-CHECK-Q6', 4, specs[4]!.pick),
  q('P64-CHECK-Q7', 4, {
    stem: ['|−9| 等于多少？', 'What is |−9|?'],
    value: '9',
    steps: [
      '到零距离九，绝对值非负。',
      'The distance to zero is nine; absolute value is nonnegative.',
    ],
    wrong: ['-9', '0', '18'],
  }),
  reasoning(
    'P64-CHECK-Q8',
    t(
      '假想温度从 −4°C 升到 +3°C。解释起点、终点、带符号变化、两点距离与 |−4|，再说明为什么 −4<3。',
      'A fictional temperature rises from −4°C to +3°C. Explain start, endpoint, signed change, distance between the readings and |−4|, then justify −4<3.',
    ),
    skills[3]!,
    t(
      '起点负四、终点正三，先升四度到零再升三度，共有 +7°C 的变化，两读数相隔七度；|−4| 为四，只表示起点到零距离。−4 在三左边，因此 −4<3。不能把终点三当升高三，也不能把 |−4| 当两点距离。允许用单位格、口述或箭头解释，家长按参照、符号、间隔和单位核对，而不按关键词自动评分。',
      'The start is negative four and endpoint positive three. Rise four degrees to zero and three more, giving signed change +7°C and separation seven degrees. |−4| is four, referring only to the start’s distance from zero. −4 lies left of three, hence −4<3. Do not mistake endpoint three for a three-degree rise or |−4| for the distance between both readings. Accept intervals, spoken reasoning or arrows, checking references, signs and units rather than keywords.',
    ),
    hints[3]!.map(T),
  ),
];
