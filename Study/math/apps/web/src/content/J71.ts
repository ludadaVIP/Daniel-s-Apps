import { t, exactRational, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  diagram?: Question['diagram'];
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
  'rational-opposite-sign',
  'rational-absolute-distance',
  'signed-fraction-addition',
  'subtraction-as-opposite',
  'signed-scaling-and-division',
  'rational-operation-structure',
];
const hints: Pair[][] = [
  [
    [
      '先把数写成整数之比，分母非零；确定它在零的哪边。',
      'Write a ratio of integers with nonzero denominator and locate its side of zero.',
    ],
    [
      '相反数关于零对称，和为零；零仍映到零。不是把分子分母倒过来。',
      'Opposites reflect across zero and sum to zero; zero stays zero. Do not swap numerator and denominator.',
    ],
  ],
  [
    [
      '位置带方向，距离非负。先确定问到零，还是两个点之间。',
      'Position is directed; distance is non-negative. Decide whether the question concerns zero or two points.',
    ],
    [
      '到零用 |a|，两点用 |b−a|。交换起终点不改距离，同侧不要一律把两个绝对值相加。',
      'Use |a| for zero and |b−a| for a pair. Swapping endpoints preserves distance; on the same side, do not simply add magnitudes.',
    ],
  ],
  [
    [
      '先统一分数单位，再保留分子本身的正负号。',
      'Use common-sized fractional units and retain the signed numerators.',
    ],
    [
      '同号合并大小并保留符号；异号比较绝对值，相消后按较大绝对值一方定方向。',
      'Same-sign magnitudes combine with that sign. Opposite signs cancel; the larger magnitude determines the remaining direction.',
    ],
  ],
  [
    [
      '分清减法运算符和减数自己的符号，先写出减数的相反数。',
      'Separate subtraction from the subtrahend’s sign and first find its opposite.',
    ],
    [
      'a−b=a+(−b)，只改减数与运算；用结果加原减数还原被减数。',
      'a−b=a+(−b): change the operation and subtrahend, not the first number. Add the original subtrahend to check the result.',
    ],
  ],
  [
    [
      '先判断零与符号，再算精确分数大小。除数为零时停止。',
      'Check zero and signs before calculating exact magnitudes. Stop at a zero divisor.',
    ],
    [
      '乘负因子反射；除以非零分数等于乘其倒数，不能只倒被除数。用商×原除数反查。',
      'A negative factor reflects. Dividing by a nonzero fraction multiplies by its reciprocal, not the dividend’s. Check quotient × original divisor.',
    ],
  ],
  [
    [
      '先看括号、乘方的底数和每个运算的结构，不把外部负号并入底数。',
      'Inspect brackets, power bases and operation structure; an outside minus is not part of the base.',
    ],
    [
      '括号内先算，再乘方、乘除、加减；同级从左到右，逐步保留完整算式，检查中间除数。',
      'Resolve brackets, then powers, multiplication/division and addition/subtraction. Equal precedence goes left to right; preserve the whole expression and check intermediate divisors.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const r = exactRational(item.value)!;
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    {
      accepted: [item.value, `${r[0] * 2n}/${r[1] * 2n}`],
      rejected: item.wrong,
    },
    item.diagram,
  );
  result.answer = {
    kind: 'number',
    value: item.value,
    formats: ['decimal', 'fraction'],
  };
  result.misconceptionTags = [
    skills[i]!,
    'sign-versus-operation',
    'exact-rational-quantity',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[i]!.map(T),
    [T(p.step)],
  );
const specs: Spec[] = [
  {
    title: ['正负数与相反数', 'Positive, negative and opposite numbers'],
    objective: [
      '把正负整数、有限小数和分数纳入有理数，借同一单位数轴解释相反数与零。',
      'Connect signed integers, terminating decimals and fractions as rational numbers, explaining opposites and zero on one unit scale.',
    ],
    prerequisites: ['P64-L02', 'P64-L03', 'P53-L04'],
    keywords: [
      ['有理数', 'rational number'],
      ['相反数', 'opposite'],
      ['正负号', 'sign'],
    ],
    lab: 'rational-sign',
    hook: [
      '−3/2 不是整数，但能在数轴上找到吗？它的相反数和倒数一样吗？',
      '−3/2 is not an integer, but does it have a number-line position? Is its opposite the same as its reciprocal?',
    ],
    items: [
      {
        stem: ['−3/2 的相反数是多少？', 'What is the opposite of −3/2?'],
        value: '3/2',
        step: [
          '−3/2 在零左侧一点五单位，反射到右侧同距为 3/2，两者和零。',
          '−3/2 is one and a half units left of zero; reflecting gives 3/2, and their sum is zero.',
        ],
        wrong: ['-3/2', '-2/3', '2/3'],
        diagram: {
          kind: 'rational-line',
          points: [{ label: 'A', value: '-3/2' }],
        },
      },
      {
        stem: ['零的相反数是多少？', 'What is the opposite of zero?'],
        value: '0',
        step: [
          '关于零反射仍在原点，零的相反数是零，不另有一个负零位置。',
          'Reflection keeps the origin fixed: zero is its own opposite, with no separate negative-zero position.',
        ],
        wrong: ['1', '-1'],
      },
      {
        stem: [
          '0.75 的相反数是多少？可写精确分数。',
          'Find the opposite of 0.75; an exact fraction is allowed.',
        ],
        value: '-3/4',
        step: [
          '0.75=3/4，在右侧；相反数 −3/4 在左侧同距。',
          '0.75=3/4 lies right of zero; its opposite −3/4 is equally far left.',
        ],
        wrong: ['3/4', '4/3', '-4/3'],
      },
      {
        stem: ['−(−5/3) 等于多少？', 'Evaluate −(−5/3).'],
        value: '5/3',
        step: [
          '−(−5/3) 是求 −5/3 的相反数，关于零反射后为正 5/3。',
          'Taking the opposite of −5/3 gives positive 5/3; reflecting twice returns the original positive value.',
        ],
        wrong: ['-5/3', '3/5'],
      },
      {
        stem: [
          '−2.5 和 −2.05 中较大的数是多少？',
          'Which number is larger: −2.5 or −2.05?',
        ],
        value: '-2.05',
        step: [
          '−2.05 在数轴上更靠右，两个数都保留负号；不是比较无符号数码大小。',
          '−2.05 lies farther right; retain both signs rather than compare unsigned digits.',
        ],
        wrong: ['-2.5', '2.5', '2.05'],
      },
      {
        stem: ['−7/4 的相反数是多少？', 'What is the opposite of −7/4?'],
        value: '7/4',
        step: [
          '反射位置从负 7/4 到正 7/4，相加为零。',
          'Reflect from −7/4 to 7/4; their sum is zero.',
        ],
        wrong: ['-7/4', '4/7', '-4/7'],
      },
    ],
    pick: {
      stem: ['关于零，哪句话正确？', 'Which statement about zero is correct?'],
      correct: 1,
      options: [
        {
          text: ['零是正有理数', 'Zero is positive rational'],
          feedback: [
            '零是有理数，但不属于正数。',
            'Zero is rational but not positive.',
          ],
        },
        {
          text: [
            '零是有理数，既不正也不负，且是自己的相反数',
            'Zero is rational, neither positive nor negative, and its own opposite',
          ],
          feedback: [
            '0=0/1，反射后仍在零。',
            '0=0/1 and reflection keeps it fixed.',
          ],
        },
        {
          text: [
            '零不属于有理数，因为不能作分母',
            'Zero is not rational because it cannot be a denominator',
          ],
          feedback: [
            '不能作分母不妨碍它作分子：0/1。',
            'It may be the numerator in 0/1 even though not a denominator.',
          ],
        },
      ],
      step: [
        '有理数可写为整数 p 与非零整数 q 的比，零满足定义。',
        'A rational number is a ratio of integers p and nonzero q; zero qualifies.',
      ],
    },
    reason: [
      '说明 −3/2、−1.5、−6/4 为什么是同一个数，并区分它的相反数与倒数。',
      'Explain why −3/2, −1.5 and −6/4 represent one number, and distinguish its opposite from its reciprocal.',
    ],
    rubric: [
      '−3/2=−6/4=−1.5 都在零左侧一点五单位，换表示不改变同一数轴单位。它的相反数是 3/2，因为和为零；倒数为 −2/3，因为积为一，不是同一个条件。整数也是有理数，如 −2=−2/1，零=0/1；分母必须非零。只要改变写法就改方向，或把相反数机械写成倒数，都不符合关系。家长要求孩子指出位置、等值表示、和为零与积为一两种核验，并说明零没有倒数但有相反数。',
      'All three forms locate one and a half units left of zero on the same scale. Its opposite is 3/2 because their sum is zero; its reciprocal is −2/3 because their product is one. Integers are rational too, such as −2=−2/1, and zero=0/1; denominators must be nonzero. A new notation does not change direction. Check position, equivalent forms and the distinct sum-zero and product-one conditions. Zero has an opposite but no reciprocal.',
    ],
    misconception: [
      '负分数不算有理数；把相反数当倒数；把零归入正数或负数。',
      'Excluding negative fractions from rationals, confusing opposite with reciprocal, or classifying zero as positive or negative.',
    ],
    prompts: [
      [
        '换成小数会移动数轴位置吗？',
        'Does rewriting as a decimal move the point?',
      ],
      [
        '你核验的是和为零还是积为一？',
        'Are you checking a sum of zero or a product of one?',
      ],
    ],
  },
  {
    title: ['绝对值与距离', 'Absolute value as distance'],
    objective: [
      '用精确有理数表示到零与两点的距离，区分位置、有向变化与非负距离。',
      'Express zero-distance and pairwise distance exactly, distinguishing position, directed change and non-negative distance.',
    ],
    prerequisites: ['J71-L01', 'P64-L05'],
    keywords: [
      ['绝对值', 'absolute value'],
      ['两点距离', 'pairwise distance'],
      ['有向变化', 'directed change'],
    ],
    lab: 'rational-distance',
    hook: [
      '两个点都在零左侧时，距离还能一律把绝对值相加吗？',
      'When both points lie left of zero, can their distance always be found by adding magnitudes?',
    ],
    items: [
      {
        stem: ['|−3/2| 等于多少？', 'Evaluate |−3/2|.'],
        value: '3/2',
        step: [
          '绝对值是到零距离，为非负 3/2，不是原位置 −3/2。',
          'Absolute value is the non-negative distance 3/2 to zero, not position −3/2.',
        ],
        wrong: ['-3/2', '2/3'],
        diagram: {
          kind: 'rational-line',
          points: [
            { label: 'A', value: '-3/2' },
            { label: 'O', value: '0' },
          ],
        },
      },
      {
        stem: [
          '数轴上 −3/2 与 1/2 的距离是多少？',
          'Find the distance between −3/2 and 1/2 on a number line.',
        ],
        value: '2',
        step: [
          '|1/2−(−3/2)|=|2|=2，跨零两段可相加。',
          '|1/2−(−3/2)|=2; the across-zero pieces add.',
        ],
        wrong: ['1', '-2', '3/2'],
      },
      {
        stem: [
          '数轴上 −5/4 与 −1/4 的距离是多少？',
          'Find the distance between −5/4 and −1/4.',
        ],
        value: '1',
        step: [
          '同在左侧，距离 |−1/4−(−5/4)|=1，不是绝对值之和 3/2。',
          'Both lie left: |−1/4−(−5/4)|=1, not the magnitude sum 3/2.',
        ],
        wrong: ['3/2', '-1', '-3/2'],
      },
      {
        stem: ['|0| 等于多少？', 'Evaluate |0|.'],
        value: '0',
        step: [
          '零到自身没有间隔，距离零；绝对值非负而非一定正。',
          'Zero has no separation from itself. Absolute value is non-negative, not always positive.',
        ],
        wrong: ['1', '-1'],
      },
      {
        stem: [
          '1/3 与 5/6 的距离是多少？',
          'Find the distance between 1/3 and 5/6.',
        ],
        value: '1/2',
        step: [
          '1/3=2/6，差 3/6=1/2。',
          '1/3=2/6, so the separation is 3/6=1/2.',
        ],
        wrong: ['7/6', '-1/2', '2/3'],
      },
      {
        stem: [
          '−2/3 与 5/6 的距离是多少？',
          'Find the distance between −2/3 and 5/6.',
        ],
        value: '3/2',
        step: [
          '−2/3=−4/6，差 5/6−(−4/6)=9/6=3/2。',
          '−2/3=−4/6; separation 5/6−(−4/6)=9/6=3/2.',
        ],
        wrong: ['1/6', '-3/2', '7/9'],
      },
    ],
    pick: {
      stem: [
        '任意两个有理数 a、b 的数轴距离是哪一个？',
        'Which formula gives the number-line distance between any rationals a and b?',
      ],
      correct: 2,
      options: [
        {
          text: ['a−b，不需绝对值', 'a−b, without absolute value'],
          feedback: [
            '有向差可能负，距离不能负。',
            'A directed difference may be negative; distance cannot.',
          ],
        },
        {
          text: ['|a|+|b|，无论在何处', '|a|+|b|, wherever they lie'],
          feedback: [
            '同侧时通常是绝对值之差，不是和。',
            'On the same side, separation is generally a difference of magnitudes.',
          ],
        },
        {
          text: ['|b−a|', '|b−a|'],
          feedback: [
            '差取绝对值，交换起终点仍是同一距离。',
            'Taking the absolute difference preserves distance when endpoints swap.',
          ],
        },
      ],
      step: [
        '相对位置的差给变化，其绝对值给距离。',
        'Difference gives directed change; its absolute value gives distance.',
      ],
    },
    reason: [
      '−5/4 到 −1/4 与反向走的有向变化、距离分别是什么？为什么不能一律加绝对值？',
      'Compare directed changes and distances from −5/4 to −1/4 and back. Why not always add absolute values?',
    ],
    rubric: [
      '正向变化 −1/4−(−5/4)=1，反向 −5/4−(−1/4)=−1；距离两次都为一。两点都在左侧，到零距离分别 5/4 与 1/4，重叠部分不能重复计入，所以点间距为 5/4−1/4=1。跨零时才把两侧到零距离相加，含零也成立。绝对值可为零；|a|=|b| 不保证 a=b，如 ±3/2。家长核对差的顺序、符号、非负距离与具体反例，不只听“去负号”口诀。',
      'Forward change is −1/4−(−5/4)=1, reverse change −5/4−(−1/4)=−1; both distances equal one. Distances to zero are 5/4 and 1/4, and their overlapping part must not be counted twice: subtract for separation one. Adding magnitudes works across zero, including a zero endpoint. Absolute value can be zero; equal absolute values do not imply equal positions, as ±3/2 shows. Check subtraction order, signs, distance and a counterexample rather than only a remove-the-minus slogan.',
    ],
    misconception: [
      '所有两点距离都加绝对值；绝对值一定正；同绝对值必同一个数。',
      'Always adding magnitudes, claiming absolute value is strictly positive, or equating numbers with equal magnitudes.',
    ],
    prompts: [
      [
        '交换起终点，哪个量变号？',
        'Which quantity changes sign if endpoints swap?',
      ],
      [
        '哪段路程在相加时被重复算了？',
        'Which segment would be counted twice by adding?',
      ],
    ],
  },
  {
    title: ['有理数加法', 'Adding rational numbers'],
    objective: [
      '用同一单位的分数份数与数轴变化解释正负有理数相加，并精确保留结果。',
      'Explain signed rational addition using common fractional units and number-line changes, retaining exact results.',
    ],
    prerequisites: ['J71-L01', 'P54-L03'],
    keywords: [
      ['共同分数单位', 'common fractional unit'],
      ['相消', 'cancellation'],
      ['加法', 'addition'],
    ],
    lab: 'rational-add',
    hook: [
      '−3/4 加 1/2 是向右移动，但终点一定在零右边吗？',
      'Adding 1/2 to −3/4 moves right. Must the endpoint be right of zero?',
    ],
    items: [
      {
        stem: ['计算 −3/4+1/2。', 'Calculate −3/4+1/2.'],
        value: '-1/4',
        step: [
          '1/2=2/4；−3/4+2/4=−1/4。向右半单位仍停在零左。',
          '1/2=2/4, so −3/4+2/4=−1/4; a rightward half-unit move still ends left of zero.',
        ],
        wrong: ['-2/6', '1/4', '-5/4'],
      },
      {
        stem: ['计算 −2/3+(−1/6)。', 'Calculate −2/3+(−1/6).'],
        value: '-5/6',
        step: [
          '−2/3=−4/6，同号向左合计 −5/6。',
          '−2/3=−4/6; both negative amounts combine to −5/6.',
        ],
        wrong: ['-3/9', '-1/2', '5/6'],
      },
      {
        stem: ['计算 −0.6+1.1。', 'Calculate −0.6+1.1.'],
        value: '1/2',
        step: [
          '同为十分位，−6/10+11/10=5/10=1/2。',
          'Using tenths gives −6/10+11/10=5/10=1/2.',
        ],
        wrong: ['-1.7', '1.7', '-0.5'],
      },
      {
        stem: ['计算 −7/5+7/5。', 'Calculate −7/5+7/5.'],
        value: '0',
        step: [
          '相反数量完全相消，和零。',
          'Opposite amounts cancel completely to zero.',
        ],
        wrong: ['14/5', '-14/5'],
      },
      {
        stem: ['计算 1/3+(−5/6)。', 'Calculate 1/3+(−5/6).'],
        value: '-1/2',
        step: [
          '2/6−5/6=−3/6=−1/2，负项绝对值较大。',
          '2/6−5/6=−3/6=−1/2; the negative term has greater magnitude.',
        ],
        wrong: ['1/2', '-4/9', '7/6'],
      },
      {
        stem: ['计算 −5/4+2/3。', 'Calculate −5/4+2/3.'],
        value: '-7/12',
        step: [
          '−15/12+8/12=−7/12，不能分母直接相加。',
          '−15/12+8/12=−7/12; denominators are not added.',
        ],
        wrong: ['-3/7', '7/12', '-23/12'],
      },
    ],
    pick: {
      stem: [
        '1/2+(−3/4) 的符号与原因正确的是？',
        'Which sign and reason are correct for 1/2+(−3/4)?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '正，因为第一个数为正',
            'Positive, because the first term is positive',
          ],
          feedback: [
            '第一项符号不决定异号和。',
            'The first term’s sign does not determine an opposite-sign sum.',
          ],
        },
        {
          text: [
            '负，因为负项的绝对值较大',
            'Negative, because the negative term has greater magnitude',
          ],
          feedback: ['2/4−3/4 剩下负的 1/4。', '2/4−3/4 leaves negative 1/4.'],
        },
        {
          text: [
            '零，因为一正一负',
            'Zero, because one is positive and one negative',
          ],
          feedback: [
            '只有大小相同的相反数才完全相消。',
            'Complete cancellation also requires equal magnitudes.',
          ],
        },
      ],
      step: [
        '异号相加先比较大小，再说明相消后剩余方向。',
        'For opposite signs, compare magnitudes and describe the remaining direction.',
      ],
    },
    reason: [
      '用单位分数与数轴两种方法解释 −3/4+1/2，为什么向右不代表答案为正？',
      'Explain −3/4+1/2 using common fractional units and a number line. Why does moving right not guarantee a positive answer?',
    ],
    rubric: [
      '把半单位换成两个四分之一，与负三个四分之一相加后剩负一个四分之一。数轴从 −3/4 出发，正 1/2 向右两格，每格 1/4，终点 −1/4 尚未跨零。移动方向描述变化，终点正负描述相对零的位置。可用结果减去 1/2 还原 −3/4，或交换加数核对同一和；不同整体大小不能直接相消。家长核对单位一致、通分、方向与终点分开，不把“向右所以正”当理由。',
      'Convert one half to two quarters; combining with negative three quarters leaves negative one quarter. On the line, start at −3/4 and move two quarter-unit intervals right to −1/4, without crossing zero. Direction describes change, while sign describes endpoint position relative to zero. Subtract 1/2 from the result to recover −3/4, or swap addends to check the same sum. Cancellation needs a common unit. Check equal-sized parts, the common denominator and the distinction between movement and endpoint.',
    ],
    misconception: [
      '分子分母各自相加；一正一负必为零；向右移动结果必正。',
      'Adding denominators, cancelling any opposite signs to zero, or treating a rightward move as a positive endpoint.',
    ],
    prompts: [
      [
        '这两种分数份是同样大小吗？',
        'Are these fractional parts the same size?',
      ],
      [
        '变化是正的，终点为什么仍可能负？',
        'Why can a positive change still have a negative endpoint?',
      ],
    ],
  },
  {
    title: ['有理数减法', 'Subtracting rational numbers'],
    objective: [
      '把减法转为加减数的相反数，精确计算并用加回原减数检查。',
      'Rewrite subtraction as adding the subtrahend’s opposite, calculate exactly and check by adding back the original subtrahend.',
    ],
    prerequisites: ['J71-L03', 'P64-L04'],
    keywords: [
      ['减数', 'subtrahend'],
      ['加相反数', 'adding the opposite'],
      ['加回验算', 'add-back check'],
    ],
    lab: 'rational-subtract',
    hook: [
      '−3/4−(−1/2) 里两个负号作用相同吗？改写时要改第一个数吗？',
      'Do the minus signs in −3/4−(−1/2) have the same role? Does rewriting change the first number?',
    ],
    items: [
      {
        stem: ['计算 −3/4−(−1/2)。', 'Calculate −3/4−(−1/2).'],
        value: '-1/4',
        step: [
          '减数 −1/2 的相反数是 1/2，原式为 −3/4+1/2=−1/4。',
          'The opposite of subtrahend −1/2 is 1/2; rewrite as −3/4+1/2=−1/4.',
        ],
        wrong: ['-5/4', '1/4', '5/4'],
      },
      {
        stem: ['计算 1/3−5/6。', 'Calculate 1/3−5/6.'],
        value: '-1/2',
        step: ['2/6+(−5/6)=−3/6=−1/2。', '2/6+(−5/6)=−3/6=−1/2.'],
        wrong: ['1/2', '-4/3', '2/3'],
      },
      {
        stem: ['计算 −0.4−0.6。', 'Calculate −0.4−0.6.'],
        value: '-1',
        step: [
          '减正 0.6 是加负 0.6，−4/10−6/10=−1。',
          'Subtracting positive 0.6 adds negative 0.6: −4/10−6/10=−1.',
        ],
        wrong: ['0.2', '-0.2', '1'],
      },
      {
        stem: ['计算 −2/3−(−5/6)。', 'Calculate −2/3−(−5/6).'],
        value: '1/6',
        step: [
          '−4/6+5/6=1/6，向右的变化足够跨零。',
          '−4/6+5/6=1/6; this rightward change crosses zero.',
        ],
        wrong: ['-3/2', '-1/6', '-7/9'],
      },
      {
        stem: ['计算 −7/4−0。', 'Calculate −7/4−0.'],
        value: '-7/4',
        step: [
          '零的相反数仍零，不移动位置。',
          'Zero’s opposite is zero, so the position does not change.',
        ],
        wrong: ['7/4', '0'],
      },
      {
        stem: ['计算 −1/2−(−5/4)。', 'Calculate −1/2−(−5/4).'],
        value: '3/4',
        step: [
          '−2/4+5/4=3/4；3/4 加原减数 −5/4 得 −1/2。',
          '−2/4+5/4=3/4; adding back −5/4 recovers −1/2.',
        ],
        wrong: ['-7/4', '-3/4', '7/4'],
      },
    ],
    pick: {
      stem: [
        '把 a−b 改写为加法，哪条关系总成立？',
        'Which addition rewrite always equals a−b?',
      ],
      correct: 0,
      options: [
        {
          text: ['a+(−b)', 'a+(−b)'],
          feedback: [
            '保留 a，改变运算并取 b 的相反数。',
            'Keep a; change the operation and take the opposite of b.',
          ],
        },
        {
          text: ['−a+b', '−a+b'],
          feedback: [
            '这改了第一个数，通常得到相反方向的差。',
            'This changes the first number and usually reverses the difference.',
          ],
        },
        {
          text: ['a+b，不需管 b 的符号', 'a+b, regardless of b’s sign'],
          feedback: [
            '减数的符号决定其相反数，不能直接丢运算符。',
            'The subtrahend’s sign matters; subtraction cannot simply disappear.',
          ],
        },
      ],
      step: [
        '减法是加法的逆关系，只改变需要撤销的项。',
        'Subtraction reverses an additive change; alter the item being undone.',
      ],
    },
    reason: [
      '比较 −3/4−(−1/2) 与 −3/4+(−1/2)，并用加回法核验差。',
      'Compare −3/4−(−1/2) and −3/4+(−1/2), then use an add-back check for the difference.',
    ],
    rubric: [
      '前者撤销负半单位，相当于加正半单位，结果 −1/4；后者再加负半单位，结果 −5/4，方向不同。改写前者时第一个 −3/4 保持不变，减法号改加号、减数换相反数，不能看到相邻负号就把所有数变正。核验 (−1/4)+(−1/2)=−3/4，还原原被减数。减负数使结果比原数大，但仍可能负；减零不变。家长请孩子标记每个符号角色、给出精确通分与加回证据。',
      'The first undoes a negative half-unit, adding positive one half and producing −1/4. The second adds another negative half-unit, producing −5/4. Keep the first number −3/4 unchanged when rewriting; change subtraction to addition and replace only the subtrahend by its opposite. Do not turn all signs positive. Check (−1/4)+(−1/2)=−3/4. Subtracting a negative increases the starting value but may still leave a negative result; subtracting zero changes nothing. Ask for sign roles, exact common units and an add-back check.',
    ],
    misconception: [
      '减负数就把所有负号删掉；减法一定变小；改写时把被减数也取相反数。',
      'Deleting all negative signs, assuming subtraction always decreases, or also negating the minuend.',
    ],
    prompts: [
      [
        '哪个符号是运算，哪个是数的符号？',
        'Which sign is the operation and which belongs to a number?',
      ],
      [
        '结果加回哪个原数能验算？',
        'Which original number should be added back to check?',
      ],
    ],
  },
  {
    title: ['有理数乘除法', 'Multiplying and dividing rational numbers'],
    objective: [
      '用缩放、反射和逆运算解释有理数乘除符号，正确使用非零倒数并检查定义域。',
      'Explain multiplication/division signs through scaling, reflection and inverse operations, using nonzero reciprocals and checking the domain.',
    ],
    prerequisites: ['J71-L04', 'P61-L06'],
    keywords: [
      ['负因子反射', 'negative-factor reflection'],
      ['倒数', 'reciprocal'],
      ['除数非零', 'nonzero divisor'],
    ],
    lab: 'rational-scale',
    hook: [
      '乘 −2/3 会把数变大吗？除以零与零除以非零数是一回事吗？',
      'Does multiplying by −2/3 make a number larger? Is division by zero the same as zero divided by a nonzero number?',
    ],
    items: [
      {
        stem: ['计算 (−3/2)×(−2/3)。', 'Calculate (−3/2)×(−2/3).'],
        value: '1',
        step: [
          '先按大小乘得一，再因负因子反射负位置到正位置，结果一。',
          'The magnitude product is one; the negative factor reflects a negative position to positive one.',
        ],
        wrong: ['-1', '9/4', '-9/4'],
      },
      {
        stem: ['计算 (−5/4)×2/3。', 'Calculate (−5/4)×2/3.'],
        value: '-5/6',
        step: [
          '正因子不反射，大小 10/12=5/6，结果负。',
          'The positive factor does not reflect; magnitude 10/12=5/6 gives a negative result.',
        ],
        wrong: ['5/6', '-15/8', '-10/7'],
      },
      {
        stem: ['计算 (−3/4)÷(−1/2)。', 'Calculate (−3/4)÷(−1/2).'],
        value: '3/2',
        step: [
          '乘除数倒数 −2，得 3/2；商乘回 −1/2 得 −3/4。',
          'Multiply by divisor reciprocal −2 to get 3/2; multiplying the quotient by −1/2 recovers −3/4.',
        ],
        wrong: ['3/8', '-3/2', '-8/3'],
      },
      {
        stem: ['计算 0÷(−2/3)。', 'Calculate 0÷(−2/3).'],
        value: '0',
        step: [
          '除数非零，商零；0×(−2/3)=0 可核验。',
          'The divisor is nonzero, so the quotient is zero; 0×(−2/3)=0 checks it.',
        ],
        wrong: ['-2/3', '1'],
      },
      {
        stem: [
          '计算 (−2/3)×(−2/3)×(−2/3)。',
          'Calculate (−2/3)×(−2/3)×(−2/3).',
        ],
        value: '-8/27',
        step: [
          '前两负因子积正 4/9，再乘负 2/3 得 −8/27。',
          'The first two negatives give 4/9; multiplying by −2/3 gives −8/27.',
        ],
        wrong: ['8/27', '-6/9', '-2/3'],
      },
      {
        stem: ['计算 (−5/6)÷(10/9)。', 'Calculate (−5/6)÷(10/9).'],
        value: '-3/4',
        step: [
          '乘除数的倒数 9/10，−45/60=−3/4。',
          'Multiply by divisor reciprocal 9/10: −45/60=−3/4.',
        ],
        wrong: ['-25/27', '3/4', '-4/3'],
      },
    ],
    pick: {
      stem: [
        '0÷0 为什么不能写成零？',
        'Why is 0÷0 not assigned the value zero?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '任何零参与的运算都不允许',
            'Every operation involving zero is forbidden',
          ],
          feedback: [
            '零加法、乘法及除以非零数都有定义。',
            'Zero may be added, multiplied and divided by a nonzero number.',
          ],
        },
        {
          text: [
            '0×q=0 对任意 q 都成立，不能确定唯一商',
            '0×q=0 holds for every q, so no unique quotient is determined',
          ],
          feedback: [
            '除法要反查唯一商；零没有倒数。',
            'Division needs a uniquely determined quotient; zero has no reciprocal.',
          ],
        },
        {
          text: ['应把 0÷0 规定为一', 'It should be assigned one'],
          feedback: [
            '同一个等式也允许其他 q，不能由逆运算独得一。',
            'The same check allows other q values, so the inverse relationship does not single out one.',
          ],
        },
      ],
      step: [
        '正负有理数除法的前提是除数非零。',
        'Rational division requires a nonzero divisor.',
      ],
    },
    reason: [
      '解释 (−3/4)÷(−1/2) 的商和反查，再区分相反数、倒数与零除数。',
      'Explain the quotient and check for (−3/4)÷(−1/2), distinguishing opposite, reciprocal and zero divisor.',
    ],
    rubric: [
      '商 q 满足 q×(−1/2)=−3/4。乘以除数 −1/2 的倒数 −2，得 q=3/2；反查 (3/2)×(−1/2)=−3/4。倒数保持负号并倒置非零数大小，与相反数 +1/2 的“和为零”条件不同。负因子映射反射位置，大小再按绝对值缩放，不把负份数假装成实物重复相加。零除以非零数等于零；非零除零无解，零除零不唯一，两种都未定义。家长核对原除数、倒数、商与反查，要求解释零的边界。',
      'The quotient q satisfies q×(−1/2)=−3/4. Multiplying by the divisor’s reciprocal −2 gives q=3/2; checking (3/2)×(−1/2) recovers −3/4. A negative reciprocal keeps its sign and inverts magnitude, unlike opposite +1/2, which gives a zero sum. A negative factor reflects and scales a numerical position; do not invent physical negative copies. Zero divided by nonzero is zero. Nonzero divided by zero has no solution, and zero divided by zero is non-unique; both divisions are undefined. Check original divisor, reciprocal, quotient and inverse verification.',
    ],
    misconception: [
      '乘法一定放大；除法一定缩小；倒被除数或去掉倒数负号；零除数给零。',
      'Assuming multiplication always enlarges or division always shrinks, inverting the dividend or dropping a reciprocal sign, or assigning zero to a zero-divisor quotient.',
    ],
    prompts: [
      [
        '商乘回哪个数才是验算？',
        'Which number must multiply the quotient in the check?',
      ],
      [
        '这个因子是在缩放、反射，还是把点映到零？',
        'Does this factor scale, reflect or send the point to zero?',
      ],
    ],
  },
  {
    title: ['有理数混合运算', 'Mixed operations with rational numbers'],
    objective: [
      '按算式结构保留精确中间量，区分负号与乘方底数，同级从左到右并检查除数。',
      'Preserve exact intermediates according to expression structure, distinguish minus signs from power bases, follow equal precedence left to right and check divisors.',
    ],
    prerequisites: ['J71-L03', 'J71-L04', 'J71-L05', 'P51-L01'],
    keywords: [
      ['运算顺序', 'operation order'],
      ['乘方底数', 'power base'],
      ['等值步骤', 'equivalent steps'],
    ],
    lab: 'rational-mixed',
    hook: [
      '−2² 与 (−2)² 哪个底数包含负号？同级乘除可以先把右边两项算完吗？',
      'Which base includes the minus in −2² and (−2)²? May equal-precedence multiplication/division be regrouped on the right?',
    ],
    items: [
      {
        stem: ['计算 (−3/4+1/2)×(−2/3)。', 'Calculate (−3/4+1/2)×(−2/3).'],
        value: '1/6',
        step: [
          '括号先得 −1/4，再乘 −2/3 得 2/12=1/6。',
          'The bracket is −1/4; multiplying by −2/3 gives 2/12=1/6.',
        ],
        wrong: ['-1/6', '-13/12', '1/2'],
      },
      {
        stem: [
          '计算 −2²（负号在平方外）。',
          'Evaluate −2², with the minus outside the square.',
        ],
        value: '-4',
        step: [
          '平方底数是二，先 2²=4，再取相反数 −4。',
          'The base is two: calculate 2²=4, then its opposite −4.',
        ],
        wrong: ['4', '-2', '2'],
      },
      {
        stem: ['计算 (−2)²。', 'Evaluate (−2)².'],
        value: '4',
        step: [
          '底数是负二，(−2)×(−2)=4。',
          'The base is negative two, so (−2)×(−2)=4.',
        ],
        wrong: ['-4', '-2', '2'],
      },
      {
        stem: [
          '计算 (−6)÷2×(−3)，按原式同级顺序。',
          'Evaluate (−6)÷2×(−3) in its original equal-precedence order.',
        ],
        value: '9',
        step: [
          '从左先得 −3，再乘 −3 得九；不能改为 −6÷[2×(−3)]。',
          'From the left, get −3, then multiply by −3 for nine; do not regroup as −6÷[2×(−3)].',
        ],
        wrong: ['1', '-9', '-1'],
      },
      {
        stem: ['计算 1/2−[−3/4−(−1/4)]。', 'Calculate 1/2−[−3/4−(−1/4)].'],
        value: '1',
        step: [
          '内括号 −3/4+1/4=−1/2，再算 1/2−(−1/2)=1。',
          'The inner bracket is −3/4+1/4=−1/2; then 1/2−(−1/2)=1.',
        ],
        wrong: ['0', '-1', '1/2'],
      },
      {
        stem: [
          '计算 (−1/2)²−(3/4)÷(−3/2)。',
          'Calculate (−1/2)²−(3/4)÷(−3/2).',
        ],
        value: '3/4',
        step: [
          '平方为 1/4，除法为 −1/2，最后 1/4−(−1/2)=3/4。',
          'The square is 1/4 and division is −1/2; finally 1/4−(−1/2)=3/4.',
        ],
        wrong: ['-1/4', '-3/4', '1/4'],
      },
    ],
    pick: {
      stem: [
        '给定有理数 a，1÷(a−a) 的值如何？',
        'For a rational a, what is 1÷(a−a)?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '未定义，因为括号内为零',
            'Undefined, because the bracket is zero',
          ],
          feedback: [
            '先算中间分母，不能跳过定义域检查。',
            'Evaluate the intermediate denominator and check the domain.',
          ],
        },
        {
          text: ['零，因为括号是零', 'Zero, because the bracket is zero'],
          feedback: [
            '分母零不使商为零。',
            'A zero denominator does not make the quotient zero.',
          ],
        },
        {
          text: [
            '一，因为同一个 a 可消去',
            'One, because the matching a values cancel',
          ],
          feedback: [
            'a−a=0，不是乘除中的非零共同因子。',
            'a−a=0; this is not cancellation of a nonzero common factor.',
          ],
        },
      ],
      step: [
        '运算顺序也决定何时发现零除数；未定义不能当中间数继续算。',
        'Operation order also exposes zero divisors; undefined is not a number to continue calculating with.',
      ],
    },
    reason: [
      '解释 −2² 与 (−2)² 的区别，再纠正把 (−6)÷2×(−3) 算成一的步骤。',
      'Explain −2² versus (−2)², then correct the steps that turn (−6)÷2×(−3) into one.',
    ],
    rubric: [
      '−2² 是 −(2×2)=−4，平方底数不含外部负号；(−2)² 是 (−2)×(−2)=4，底数含负号。同级乘除按原式从左到右，−6÷2=−3，再乘 −3=9；先合并右边等于给分母加上原本没有的括号，算成的是另一个式子一。每次仅替换一处已算完的子式，保留其余算式与精确分数。中间出现除数零应停下，不能伪造零继续。家长核对底数圈选、结构是否改变、完整等值步骤与定义域，不按最终数值碰巧相等判理由正确。',
      '−2² means −(2×2)=−4; its base excludes the outside minus. (−2)² means (−2)×(−2)=4, whose base includes the sign. Original equal-precedence order gives −6÷2=−3, then ×(−3)=9. Combining the right-hand factors instead inserts denominator brackets absent from the original and evaluates a different expression to one. Replace one completed subtree at a time, retaining the whole expression and exact fractions. Stop at an intermediate zero divisor rather than invent a zero result. Check marked bases, unchanged structure, full equivalent steps and the domain, not just a coincidentally correct number.',
    ],
    misconception: [
      '把外部负号一起平方；乘除总先乘；只写中间子式丢掉其余式子；忽略零除数。',
      'Squaring an outside minus, always multiplying before dividing, dropping the rest of an expression, or ignoring an intermediate zero divisor.',
    ],
    prompts: [
      [
        '这个平方的底数究竟是哪一段？',
        'Exactly which part is the square’s base?',
      ],
      [
        '这一步只是算出子式，还是偷偷加了括号？',
        'Did this step evaluate a subtree or silently insert brackets?',
      ],
    ],
  },
];
export const j71Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J71-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 5 ? 25 : 22,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J07',
    unit: 'J71',
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
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上画同一个单位的数轴，用 −3/2、1/2 与零解释相反数、到零距离和两点距离。自写一对分数加减题，逐步通分并反查；再对比 −2²、(−2)² 和两种乘除括号。挑出一个零除数反例说明为何停下。不需要实物、消费或外出；家长用具体数量和结构核对理由。',
            'Draw one unit scale on paper. Use −3/2, 1/2 and zero to explain opposites and two kinds of distance. Make a pair of signed-fraction sums/differences, show common units and inverse checks, then compare −2², (−2)² and two bracketings of multiplication/division. Include a zero-divisor counterexample and explain why calculation stops. No purchases, equipment or outing are needed; check quantities and structure together.',
          ),
        }
      : {}),
  };
});
export function j71ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J71-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J71 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = k % 9,
    b = 1 + (Math.floor(k / 9) % 5),
    d = [2, 3, 4][k % 3]!;
  let item: Item;
  if (i === 0) {
    const n = k % 2 === 0 ? -a : a;
    item = {
      stem: [`${n}/${d} 的相反数是多少？`, `Find the opposite of ${n}/${d}.`],
      value: `${-n}/${d}`,
      step: [
        `相反数是 ${-n}/${d}，与原数相加零；零保持零。`,
        `The opposite is ${-n}/${d}; the pair sums to zero, and zero stays zero.`,
      ],
      wrong: [String(a + 1)],
    };
  } else if (i === 1) {
    const pair = k % 2 === 1;
    item = {
      stem: pair
        ? [
            `−${a}/${d} 与 ${b}/${d} 的距离？`,
            `Find the distance between −${a}/${d} and ${b}/${d}.`,
          ]
        : [`|−${a}/${d}| 是多少？`, `Evaluate |−${a}/${d}|.`],
      value: `${pair ? a + b : a}/${d}`,
      step: [
        `距离非负，按同样的 1/${d} 单位计数。`,
        `Distance is non-negative, counted in common 1/${d} units.`,
      ],
      wrong: [String(a + b + 10)],
    };
  } else if (i === 2)
    item = {
      stem: [`计算 (−${a}/${d})+${b}/2。`, `Calculate (−${a}/${d})+${b}/2.`],
      value: `${b * d - 2 * a}/${2 * d}`,
      step: [
        `用 1/${2 * d} 单位，分子合并 ${-2 * a}+${b * d}。`,
        `Use 1/${2 * d} units and add signed numerators ${-2 * a}+${b * d}.`,
      ],
      wrong: [String(a + b + 10)],
    };
  else if (i === 3)
    item = {
      stem: [
        `计算 (−${a}/${d})−(−${b}/2)。`,
        `Calculate (−${a}/${d})−(−${b}/2).`,
      ],
      value: `${b * d - 2 * a}/${2 * d}`,
      step: [
        `减负 ${b}/2 改为加正 ${b}/2，再通分。`,
        `Subtracting −${b}/2 adds ${b}/2; then use common units.`,
      ],
      wrong: [`-${2 * a + b * d}/${2 * d}`],
    };
  else if (i === 4) {
    const divide = k % 2 === 1;
    item = {
      stem: [
        `计算 (−${a}/${d})${divide ? '÷' : '×'}(−${b}/2)。`,
        `Calculate (−${a}/${d})${divide ? '÷' : '×'}(−${b}/2).`,
      ],
      value: divide ? `${2 * a}/${d * b}` : `${a * b}/${2 * d}`,
      step: [
        `除数非零；${divide ? '乘原除数的倒数' : '先判断零；无零因子的两负数积为正'}，零被除数仍可得零。`,
        `The divisor is nonzero; ${divide ? 'multiply by its reciprocal' : 'first check zero; two strictly negative factors give a positive product'}, with zero dividend allowed.`,
      ],
      wrong: [String(a * b + 10)],
    };
  } else if (k % 3 === 0)
    item = {
      stem: [
        `计算 [(−${a}/${d})+1/2]×(−2/3)。`,
        `Calculate [(−${a}/${d})+1/2]×(−2/3).`,
      ],
      value: `${2 * a - d}/${3 * d}`,
      step: [
        `先括号，得 (${d - 2 * a})/${2 * d}，再乘负 2/3。`,
        `The bracket is (${d - 2 * a})/${2 * d}; then multiply by −2/3.`,
      ],
      wrong: [String(a + 10)],
    };
  else if (k % 3 === 1) {
    const inside = k % 2 === 0;
    item = {
      stem: [
        `计算 ${inside ? `(−${a + 1})²` : `−${a + 1}²`}。`,
        `Evaluate ${inside ? `(−${a + 1})²` : `−${a + 1}²`}.`,
      ],
      value: String((inside ? 1 : -1) * (a + 1) ** 2),
      step: [
        `平方底数${inside ? '包含' : '不含'}负号，先明确括号。`,
        `The square’s base ${inside ? 'includes' : 'excludes'} the minus; inspect brackets first.`,
      ],
      wrong: [String((inside ? -1 : 1) * (a + 1) ** 2)],
    };
  } else
    item = {
      stem: [
        `计算 (−${a + 1})÷2×(−${b})，不添加括号。`,
        `Evaluate (−${a + 1})÷2×(−${b}) without inserting brackets.`,
      ],
      value: `${(a + 1) * b}/2`,
      step: [
        `先从左除二，再乘负 ${b}，保留精确分数。`,
        `Divide by two from the left, then multiply by −${b}, keeping an exact fraction.`,
      ],
      wrong: [String((a + 1) * b + 10)],
    };
  return q(`${id}-R${round}`, i, item);
}
export const j71CheckQuestions: Question[] = [
  q('J71-CHECK-Q1', 0, {
    stem: ['−0.75 的相反数是多少？', 'Find the opposite of −0.75.'],
    value: '3/4',
    step: ['反射后正 0.75=3/4。', 'Reflection gives positive 0.75=3/4.'],
    wrong: ['-3/4', '4/3'],
  }),
  q('J71-CHECK-Q2', 1, {
    stem: ['−5/6 与 1/3 的距离？', 'Find the distance between −5/6 and 1/3.'],
    value: '7/6',
    step: [
      '差的绝对值为 2/6+5/6=7/6。',
      'The absolute difference is 2/6+5/6=7/6.',
    ],
    wrong: ['1/2', '-7/6'],
  }),
  q('J71-CHECK-Q3', 2, {
    stem: ['计算 −2/3+5/12。', 'Calculate −2/3+5/12.'],
    value: '-1/4',
    step: ['−8/12+5/12=−3/12=−1/4。', '−8/12+5/12=−1/4.'],
    wrong: ['1/4', '-1/3'],
  }),
  q('J71-CHECK-Q4', 3, {
    stem: ['计算 −1/2−(−5/6)。', 'Calculate −1/2−(−5/6).'],
    value: '1/3',
    step: ['−3/6+5/6=2/6=1/3。', '−3/6+5/6=1/3.'],
    wrong: ['-4/3', '-1/3'],
  }),
  q('J71-CHECK-Q5', 4, {
    stem: ['计算 (−4/5)÷(−2/3)。', 'Calculate (−4/5)÷(−2/3).'],
    value: '6/5',
    step: [
      '乘倒数 −3/2，得 12/10=6/5。',
      'Multiply by reciprocal −3/2 to get 6/5.',
    ],
    wrong: ['8/15', '-6/5'],
  }),
  q('J71-CHECK-Q6', 5, {
    stem: ['计算 −3²+(−3)²。', 'Calculate −3²+(−3)².'],
    value: '0',
    step: [
      '−9+9=0，两项底数范围不同。',
      '−9+9=0; the bases have different scopes.',
    ],
    wrong: ['18', '-18'],
  }),
  pick('J71-CHECK-Q7', 4, specs[4]!.pick),
  reasoning(
    'J71-CHECK-Q8',
    t(
      '用 −3/2、1/2 解释两点距离，再说明相反数与倒数、−2² 与 (−2)² 以及除数为零的限制。',
      'Use −3/2 and 1/2 to explain pairwise distance, then distinguish opposite from reciprocal, −2² from (−2)², and the zero-divisor restriction.',
    ),
    skills[5]!,
    t(
      '两点距离 |1/2−(−3/2)|=2，不能带负方向；反向变化可变号而距离不变。−3/2 的相反数 3/2 和为零，倒数 −2/3 积为一。−2²=−4，(−2)²=4，先标出底数。除法只在除数非零时取倒数；零除以非零数为零，非零除零无解、零除零不唯一，均未定义。家长核对精确量、符号角色、反查与边界，不能凭关键词或最终数值代替解释。',
      'Distance is |1/2−(−3/2)|=2, without a negative direction; reversing endpoints changes the directed difference but not distance. Opposite 3/2 gives a zero sum with −3/2; reciprocal −2/3 gives product one. −2²=−4 whereas (−2)²=4: mark the base. Take a reciprocal only for a nonzero divisor. Zero divided by nonzero is zero; nonzero divided by zero has no solution, and zero divided by zero is non-unique, so both are undefined. Check exact quantities, sign roles, inverse checks and boundaries rather than keywords.',
    ),
    hints[5]!.map(T),
  ),
];
