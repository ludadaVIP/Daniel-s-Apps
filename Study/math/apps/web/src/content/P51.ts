import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning, p51Lesson } from './builders';
import { commonNumbers, positiveFactors } from '../integerModels';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const M = 'whole-mixed-calculation',
  O = 'operation-order',
  F = 'factor-multiple',
  P = 'prime-composite',
  C = 'common-factors-multiples';
const T = (p: Pair) => t(...p);
function q(
  id: string,
  stem: Pair,
  value: number,
  skill: string,
  hints: [Pair, Pair],
  steps: Pair[],
  wrong: string[],
  unit?: Unit,
  diagram?: Question['diagram'],
) {
  const item = numeric(
    id,
    T(stem),
    String(value),
    skill,
    hints.map(T),
    steps.map(T),
    {
      accepted: [
        String(value),
        `${value}.0`,
        `${value * 2}/2`,
        ...(unit ? [`${value} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram,
  );
  item.answer = {
    kind: 'number',
    value: String(value),
    unit,
    formats: ['decimal', 'fraction'],
  };
  item.misconceptionTags = [
    skill,
    'calculation',
    'representation',
    ...(unit ? ['reading-units'] : []),
  ];
  if (unit) item.type = 'word_problem';
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  skill: string,
  options: [Pair, Pair][],
  hints: [Pair, Pair],
  steps: Pair[],
) {
  const item = choice(
    id,
    T(stem),
    correct,
    skill,
    options.map(([label, feedback]) => ({
      text: T(label),
      feedback: T(feedback),
    })),
    hints.map(T),
    steps.map(T),
  );
  item.misconceptionTags = [skill, 'concept', 'representation'];
  return item;
}
const r = (
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) => reasoning(id, T(stem), skill, T(rubric), hints.map(T));
const array = (n: number, rows: number): Question['diagram'] => ({
  kind: 'integer-array',
  n,
  rows,
  hideColumns: true,
});
const common = (
  a: number,
  b: number,
  mode: 'factors' | 'multiples',
): Question['diagram'] => ({ kind: 'integer-common', a, b, mode });
export const p51Lessons: Lesson[] = [
  p51Lesson({
    id: 'P51-L01',
    title: t('大数的四则混合运算', 'Mixed operations with whole numbers'),
    objective: t(
      '按正确层级分步计算大数混合式，保持每一行与原式等值并核查位值。',
      'Calculate whole-number mixed expressions by valid levels, preserving equivalence and checking place values.',
    ),
    prerequisites: ['B03-L01', 'B03-L03', 'B03-L04', 'B06-L03'],
    keywords: [
      t('混合运算', 'mixed operations'),
      t('等值步骤', 'equivalent steps'),
      t('位值', 'place value'),
    ],
    minutes: 17,
    lab: 'integer-mixed',
    hook: t(
      '1200+36×25−480÷6，能从 1200+36 开始一路算下去吗？每次替换一段，整行的值有没有保留？',
      'For 1200+36×25−480÷6, can you start with 1200+36 and calculate straight across? Does each replacement retain the whole expression’s value?',
    ),
    guided: q(
      'P51-L01-G',
      ['计算 1200+36×25−480÷6。', 'Calculate 1200+36×25−480÷6.'],
      2020,
      M,
      [
        [
          '同一层先乘除，再加减。',
          'Within one level, multiplication/division precede addition/subtraction.',
        ],
        [
          '先求 36×25 与 480÷6，保留原加减关系。',
          'Find 36×25 and 480÷6 while retaining the original addition/subtraction.',
        ],
      ],
      [
        ['36×25=900，480÷6=80。', '36×25=900 and 480÷6=80.'],
        ['1200+900−80=2100−80=2020。', '1200+900−80=2100−80=2020.'],
      ],
      ['1236', '2100', '2180'],
    ),
    questions: [
      c(
        'P51-L01-Q1',
        [
          '在 1200+36×25 中，为什么先求 36×25？',
          'Why calculate 36×25 first in 1200+36×25?',
        ],
        1,
        M,
        [
          [
            [
              '所有运算都从最左数字一路算',
              'Calculate every operation straight across',
            ],
            [
              '乘法层级先于加法，不能先合并 1200 与 36。',
              'Multiplication precedes addition; do not combine 1200 and 36 first.',
            ],
          ],
          [
            [
              '乘除层级先于加减',
              'Multiplication/division precede addition/subtraction',
            ],
            [
              '先求乘积，再加入 1200，保留原式含义。',
              'Find the product, then add 1200, retaining the expression.',
            ],
          ],
          [
            ['数字大的总要先算', 'Larger numbers always go first'],
            [
              '数值大小不决定运算顺序。',
              'Number size does not determine operation order.',
            ],
          ],
        ],
        [
          [
            '找运算层级，不比较数字大小。',
            'Look for operation levels rather than number sizes.',
          ],
          [
            '36×25 是加到 1200 上的一整个乘积。',
            '36×25 is one whole product added to 1200.',
          ],
        ],
        [['1200+(36×25)=1200+900=2100。', '1200+(36×25)=1200+900=2100.']],
      ),
      q(
        'P51-L01-Q2',
        ['计算 3600÷9×4+275。', 'Calculate 3600÷9×4+275.'],
        1875,
        M,
        [
          [
            '除与乘同级，按从左往右。',
            'Division and multiplication share a level; go left to right.',
          ],
          [
            '先 3600÷9，再乘四。',
            'First divide 3600 by 9, then multiply by four.',
          ],
        ],
        [
          ['3600÷9=400，400×4=1600。', '3600÷9=400; 400×4=1600.'],
          [
            '1600+275=1875，9×400=3600 核查除法。',
            '1600+275=1875; 9×400=3600 checks the division.',
          ],
        ],
        ['375', '675', '1600'],
      ),
      q(
        'P51-L01-Q3',
        ['计算 5000−18×125+840÷7。', 'Calculate 5000−18×125+840÷7.'],
        2870,
        M,
        [
          ['先分别求乘积与商。', 'Find product and quotient first.'],
          ['18×125=2250，840÷7=120。', '18×125=2250 and 840÷7=120.'],
        ],
        [
          ['5000−2250+120=2750+120。', '5000−2250+120=2750+120.'],
          [
            '结果 2870；减去总费用再加另一部分，不能改原符号。',
            'The result is 2870; retain the original subtraction and addition signs.',
          ],
        ],
        ['2630', '2750', '2250'],
      ),
      q(
        'P51-L01-Q4',
        ['计算 0×875+2400÷6。', 'Calculate 0×875+2400÷6.'],
        400,
        M,
        [
          ['零乘任何数仍为零。', 'Zero multiplied by any number is zero.'],
          ['2400÷6=400，不丢百位。', '2400÷6=400; retain the hundreds place.'],
        ],
        [
          [
            '0×875=0，2400÷6=400，0+400=400。',
            '0×875=0; 2400÷6=400; 0+400=400.',
          ],
        ],
        ['1275', '40', '0'],
      ),
      q(
        'P51-L01-Q5',
        [
          '假想预算 NZ$3000，买 18 套每套 NZ$125 的工具，余钱多少 NZ$？',
          'A fictional budget is NZ$3000. Buy 18 tool sets at NZ$125 each. How many NZ$ remain?',
        ],
        750,
        M,
        [
          ['先求十八套总价。', 'Find the total cost of eighteen sets.'],
          [
            '总价=18×125，再从预算扣除。',
            'Cost = 18×125, then subtract from budget.',
          ],
        ],
        [
          [
            '18×125=NZ$2250，3000−2250=NZ$750。',
            '18×125=NZ$2250; 3000−2250=NZ$750.',
          ],
          ['750+2250=3000，恢复预算。', '750+2250=3000 recovers the budget.'],
        ],
        ['2250', '2982', '750 m'],
        'NZD',
      ),
      r(
        'P51-L01-Q6',
        [
          '有人把 5000−18×125 写成 (5000−18)×125。说明这一步是否保留原式，给出正确值。',
          'Someone replaces 5000−18×125 with (5000−18)×125. Does this retain the original expression? Give the correct value.',
        ],
        M,
        [
          '不等值：原式扣除 18×125=2250，结果 2750；改式把先减出的 4982 再乘 125，改变乘法作用的量。先算乘积再减，用 2750+2250=5000 核查。',
          'Not equivalent: the original subtracts 18×125=2250 to give 2750. The changed expression multiplies 4982 after subtraction, changing what is multiplied. Calculate the product first; check 2750+2250=5000.',
        ],
        [
          [
            '乘 125 原来作用于哪个量？',
            'Which quantity did multiplication by 125 originally apply to?',
          ],
          [
            '核对每一行是否与原式等值。',
            'Check whether each line is equivalent to the original.',
          ],
        ],
      ),
    ],
    exit: q(
      'P51-L01-X',
      ['计算 2400+48×25−630÷7。', 'Calculate 2400+48×25−630÷7.'],
      3510,
      M,
      [
        [
          '保留原加减关系，先算乘除。',
          'Retain addition/subtraction while calculating multiplication/division.',
        ],
        ['48×25=1200，630÷7=90。', '48×25=1200 and 630÷7=90.'],
      ],
      [['2400+1200−90=3600−90=3510。', '2400+1200−90=3600−90=3510.']],
      ['3690', '3600', '2490'],
    ),
    exitReason: t(
      '说明先算的两段及理由，给出可核查的等值行。',
      'Identify the first two parts and their reason, with equivalent lines that can be checked.',
    ),
    parent: {
      goal: t(
        '孩子保留原式关系与位值，不靠看着相近的数字判对。',
        'Retain relationships and place values rather than judge by nearby-looking numbers.',
      ),
      misconception: t(
        '把所有运算从左一路算，或丢掉商的零位。',
        'Calculating every operation straight across or dropping zero places in a quotient.',
      ),
      prompts: [
        t(
          '下一段为什么可以替换成这个数？',
          'Why can the next part be replaced by this number?',
        ),
        t(
          '怎样乘回或加回核查？',
          'How can multiplication or addition back check it?',
        ),
      ],
      bridge: 'B03-L04',
    },
  }),
  p51Lesson({
    id: 'P51-L02',
    title: t('括号与运算顺序', 'Brackets and order of operations'),
    objective: t(
      '用括号、乘除优先与同级从左往右解释运算顺序，区分不同表达式。',
      'Explain operation order using brackets, multiplication/division precedence and left-to-right order at equal levels.',
    ),
    prerequisites: ['P51-L01', 'B06-L03'],
    keywords: [
      t('括号', 'brackets'),
      t('运算层级', 'precedence'),
      t('同级顺序', 'equal-level order'),
    ],
    minutes: 16,
    lab: 'integer-order',
    hook: t(
      '24÷6×2 与 24÷(6×2) 是同一件事吗？“先乘后除”会把哪个结果改变？',
      'Are 24÷6×2 and 24÷(6×2) the same? Which result would the rule “multiply before divide” change?',
    ),
    guided: q(
      'P51-L02-G',
      ['计算 24+36÷6。', 'Calculate 24+36÷6.'],
      30,
      O,
      [
        [
          '没有括号，先除法再加法。',
          'With no brackets, division precedes addition.',
        ],
        ['先用 36÷6 替换成六。', 'Replace 36÷6 by six first.'],
      ],
      [['36÷6=6，24+6=30。', '36÷6=6; 24+6=30.']],
      ['10', '60', '6'],
    ),
    questions: [
      c(
        'P51-L02-Q1',
        [
          '24÷6×2 的正确值与依据是哪项？',
          'Which value and reason are correct for 24÷6×2?',
        ],
        0,
        O,
        [
          [
            [
              '8；乘除同级，先 24÷6 再乘 2',
              '8; division/multiplication share a level, so divide 24 by 6, then multiply by 2',
            ],
            [
              '4×2=8；同级从左往右。',
              '4×2=8; go left to right at the same level.',
            ],
          ],
          [
            ['2；先乘 6×2 再除', '2; multiply 6×2 before dividing'],
            [
              '这相当于加了原式没有的括号。',
              'This introduces brackets absent from the original.',
            ],
          ],
          [
            ['4；只做一次除法', '4; do only the division'],
            [
              '还有乘二，不能漏掉。',
              'Multiplication by two remains; do not omit it.',
            ],
          ],
        ],
        [
          [
            '乘与除没有高低之分。',
            'Multiplication and division have equal precedence.',
          ],
          [
            '同级按原式从左往右。',
            'Follow the original left-to-right order at equal levels.',
          ],
        ],
        [['24÷6=4，4×2=8。', '24÷6=4; 4×2=8.']],
      ),
      q(
        'P51-L02-Q2',
        ['计算 (24+36)÷6。', 'Calculate (24+36)÷6.'],
        10,
        O,
        [
          [
            '括号中的和是一整个被除量。',
            'The bracketed sum is the whole quantity being divided.',
          ],
          ['先求 24+36。', 'First find 24+36.'],
        ],
        [
          [
            '(24+36)÷6=60÷6=10；10×6=60 核查。',
            '(24+36)÷6=60÷6=10; 10×6=60 checks it.',
          ],
        ],
        ['30', '60', '6'],
      ),
      q(
        'P51-L02-Q3',
        ['计算 20−6+4。', 'Calculate 20−6+4.'],
        18,
        O,
        [
          ['加与减同级。', 'Addition and subtraction share a level.'],
          ['先 20−6，再加四。', 'First 20−6, then add four.'],
        ],
        [['20−6+4=14+4=18，不是 20−(6+4)。', '20−6+4=14+4=18, not 20−(6+4).']],
        ['10', '14', '30'],
      ),
      q(
        'P51-L02-Q4',
        ['计算 60−(8+4)×3。', 'Calculate 60−(8+4)×3.'],
        24,
        O,
        [
          [
            '先括号，再乘法，最后减。',
            'Brackets first, then multiplication, then subtraction.',
          ],
          ['8+4=12，12×3=36。', '8+4=12; 12×3=36.'],
        ],
        [['60−(8+4)×3=60−12×3=60−36=24。', '60−(8+4)×3=60−12×3=60−36=24.']],
        ['144', '36', '156'],
      ),
      q(
        'P51-L02-Q5',
        ['计算 2×3+(4+5)。', 'Calculate 2×3+(4+5).'],
        15,
        O,
        [
          [
            '本课步骤先把右侧括号算好。',
            'In this workshop, resolve the right-side brackets first.',
          ],
          [
            '括号九，左侧乘积六，最后合并。',
            'Brackets give nine, the left product six, then combine.',
          ],
        ],
        [
          ['4+5=9；2×3=6；6+9=15。', '4+5=9; 2×3=6; 6+9=15.'],
          [
            '独立部分最终合并时仍须保留原关系。',
            'Retain the original relationship when combining independent parts.',
          ],
        ],
        ['19', '11', '9'],
      ),
      r(
        'P51-L02-Q6',
        [
          '解释 24÷6×2 与 24÷(6×2) 为什么不同，并纠正“任何时候先乘后除”。',
          'Explain why 24÷6×2 differs from 24÷(6×2), correcting “always multiply before divide”.',
        ],
        O,
        [
          '无括号乘除同级从左到右，24÷6×2=4×2=8；有括号先求 6×2=12，再 24÷12=2。括号改变除数的分组关系，不能擅自加入；乘除同级，不是乘永远优先于除。',
          'Without brackets, equal-level division/multiplication go left to right: 24÷6×2=4×2=8. With brackets, 6×2=12 and 24÷12=2. Brackets change grouping and cannot be introduced arbitrarily; multiplication does not always precede division.',
        ],
        [
          [
            '比较两式的除数与分组。',
            'Compare the division grouping in both expressions.',
          ],
          [
            '各写两条等值步骤。',
            'Write two equivalent steps for each expression.',
          ],
        ],
      ),
    ],
    exit: q(
      'P51-L02-X',
      ['计算 (240−60)÷9+12×3。', 'Calculate (240−60)÷9+12×3.'],
      56,
      O,
      [
        [
          '先括号，再同层的除与乘。',
          'Brackets first, then division and multiplication at that level.',
        ],
        ['180÷9=20，12×3=36。', '180÷9=20 and 12×3=36.'],
      ],
      [
        [
          '(240−60)÷9+12×3=180÷9+12×3=20+36=56。',
          '(240−60)÷9+12×3=180÷9+12×3=20+36=56.',
        ],
      ],
      ['96', '540', '20'],
    ),
    exitReason: t(
      '给每一步写顺序依据，并说明括号是否可随便删。',
      'Give the order reason for each step and explain whether brackets may be removed freely.',
    ),
    parent: {
      goal: t(
        '用结构解释顺序，不把口诀理解成乘总先于除。',
        'Explain order from structure rather than infer that multiplication always precedes division.',
      ),
      misconception: t(
        '忽略括号，或把加先于减、乘先于除。',
        'Ignoring brackets or placing addition before subtraction and multiplication before division.',
      ),
      prompts: [
        t('哪两个运算是同级？', 'Which operations share a level?'),
        t(
          '若加上这对括号，什么量被改变了？',
          'What grouping changes if these brackets are added?',
        ),
      ],
      bridge: 'B06-L03',
    },
  }),
  p51Lesson({
    id: 'P51-L03',
    title: t('倍数与因数', 'Multiples and factors'),
    objective: t(
      '用整除与相等组区分正因数和正倍数，并完整列出因数而不漏或重计。',
      'Distinguish positive factors from positive multiples using exact division and equal groups, listing factors without omissions or duplicates.',
    ),
    prerequisites: ['B02-L03', 'B02-L04', 'P51-L02'],
    keywords: [
      t('正因数', 'positive factor'),
      t('正倍数', 'positive multiple'),
      t('整除', 'exact divisibility'),
    ],
    minutes: 17,
    lab: 'integer-factors',
    hook: t(
      '24 个计数格能排成几种完整相等行？36 排成 6×6 时，六是不是要在因数列表写两次？',
      'How can 24 counters form complete equal rows? If 36 forms 6×6, should six appear twice in its factor list?',
    ),
    guided: q(
      'P51-L03-G',
      [
        '24 张卡分成 4 个相等行，每行几张？',
        '24 cards form 4 equal rows. How many cards per row?',
      ],
      6,
      F,
      [
        [
          '四乘每行张数等于二十四。',
          'Four times cards per row equals twenty-four.',
        ],
        ['24÷4。', '24÷4.'],
      ],
      [
        [
          '24÷4=6 张；4 与 6 都是 24 的正因数。',
          '24÷4=6 cards; both 4 and 6 are positive factors of 24.',
        ],
      ],
      ['4', '20', '6 bags'],
      'cards',
      array(24, 4),
    ),
    questions: [
      c(
        'P51-L03-Q1',
        [
          '哪一列完整列出了 12 的正因数？',
          'Which list gives all positive factors of 12?',
        ],
        0,
        F,
        [
          [
            ['1、2、3、4、6、12', '1, 2, 3, 4, 6, 12'],
            ['分别来自 1×12、2×6、3×4。', 'These come from 1×12, 2×6 and 3×4.'],
          ],
          [
            ['12、24、36', '12, 24, 36'],
            [
              '这列是开始的正倍数，不是因数列表。',
              'These are initial positive multiples rather than factors.',
            ],
          ],
          [
            ['1、2、3、6、12', '1, 2, 3, 6, 12'],
            ['漏了 4；3×4=12。', 'Four is missing: 3×4=12.'],
          ],
        ],
        [
          ['每个因数都能整除十二。', 'Each factor divides twelve exactly.'],
          ['从因数对成对列出。', 'List both members of each factor pair.'],
        ],
        [
          [
            '三个因数对共有六个不同正因数。',
            'Three factor pairs give six distinct positive factors.',
          ],
        ],
      ),
      q(
        'P51-L03-Q2',
        [
          '36 个计数格排成 6 个相等行，每行几个？',
          '36 counters form 6 equal rows. How many per row?',
        ],
        6,
        F,
        [
          [
            '是完整相等行，不能留下余量。',
            'Rows are complete and equal, without leftovers.',
          ],
          ['36÷6。', '36÷6.'],
        ],
        [['36÷6=6；6×6=36。', '36÷6=6; 6×6=36.']],
        ['30', '12', '1'],
        undefined,
        array(36, 6),
      ),
      q(
        'P51-L03-Q3',
        [
          '7 的第 5 个正倍数是多少？从 7 开始数，不把 0 算作第一个正倍数。',
          'What is the fifth positive multiple of 7? Start at 7; zero is not the first positive multiple.',
        ],
        35,
        F,
        [
          ['依次是 7、14、21、28……', 'The sequence starts 7, 14, 21, 28…'],
          ['第 k 个正倍数为 7×k。', 'Positive multiple number k is 7×k.'],
        ],
        [
          [
            '7×5=35；零是零倍，但不是正倍数。',
            '7×5=35; zero is the zero multiple but not a positive multiple.',
          ],
        ],
        ['28', '12', '0'],
      ),
      q(
        'P51-L03-Q4',
        [
          '36 有几个不同的正因数？把 6×6 中的六只计一次。',
          'How many distinct positive factors does 36 have? Count six once in the pair 6×6.',
        ],
        9,
        F,
        [
          [
            '因数对 1×36、2×18、3×12、4×9、6×6。',
            'Pairs are 1×36, 2×18, 3×12, 4×9 and 6×6.',
          ],
          [
            '相同的中间因数不重计。',
            'Do not duplicate the equal middle factor.',
          ],
        ],
        [
          [
            '因数 1、2、3、4、6、9、12、18、36，共九个。',
            'Factors 1, 2, 3, 4, 6, 9, 12, 18 and 36: nine in total.',
          ],
        ],
        ['10', '5', '8'],
      ),
      q(
        'P51-L03-Q5',
        [
          '25 张卡，每袋 6 张，装满 4 袋后余几张？据此判断 6 是否整除 25。',
          '25 cards, 6 per bag: after 4 full bags, how many remain? Use this to decide whether 6 divides 25 exactly.',
        ],
        1,
        F,
        [
          ['四满袋用了二十四张。', 'Four full bags use twenty-four cards.'],
          ['原有−已装入=余量。', 'Original−packed = remainder.'],
        ],
        [
          [
            '25−4×6=1 张；25=6×4+1，六不整除二十五。',
            '25−4×6=1 card; 25=6×4+1, so six does not divide twenty-five exactly.',
          ],
        ],
        ['4', '6', '0'],
        'cards',
      ),
      r(
        'P51-L03-Q6',
        [
          '有人说 24 和 36 都是 12 的因数，因为它们在 12 的倍数列表里。解释因数与倍数方向，并说明 0 是哪一类。',
          'Someone calls 24 and 36 factors of 12 because they appear in its multiple list. Explain the direction of factors and multiples, including zero.',
        ],
        F,
        [
          '12×2=24、12×3=36，说明 24、36 是 12 的倍数，12 是它们的因数；24 与 36 不能整除 12。0=12×0 是零倍，不是 12 的正因数，也不是正倍数。正因数表针对正整数，不能把除以零作为测试。',
          '12×2=24 and 12×3=36 make 24 and 36 multiples of 12, and 12 a factor of those numbers. They do not divide 12 exactly. 0=12×0 is the zero multiple, neither a positive factor of 12 nor a positive multiple. Positive-factor lists here concern positive integers; do not test by dividing by zero.',
        ],
        [
          [
            '把乘法关系的方向写清楚。',
            'Write the direction of the multiplication relationship.',
          ],
          [
            '本课列的是正因数与正倍数。',
            'The lists here concern positive factors and positive multiples.',
          ],
        ],
      ),
    ],
    exit: q(
      'P51-L03-X',
      [
        '42 张卡排成 7 个相等行，每行几张？',
        '42 cards form 7 equal rows. How many cards per row?',
      ],
      6,
      F,
      [
        [
          '七乘每行张数等于四十二。',
          'Seven times cards per row equals forty-two.',
        ],
        ['42÷7。', '42÷7.'],
      ],
      [
        [
          '42÷7=6 张，所以七与六都是四十二的正因数。',
          '42÷7=6 cards, so seven and six are positive factors of forty-two.',
        ],
      ],
      ['7', '35', '6 min'],
      'cards',
      array(42, 7),
    ),
    exitReason: t(
      '用乘回核查，并说明 42 与 7 谁是因数、谁是倍数。',
      'Check by multiplying back, and identify which of 42 and 7 is the factor or multiple.',
    ),
    parent: {
      goal: t(
        '用整除关系确认，不把两个列表方向混淆。',
        'Confirm exact divisibility without reversing factor and multiple relationships.',
      ),
      misconception: t(
        '漏成对因数，重计平方根，或把零放进正倍数序号。',
        'Omitting paired factors, duplicating a square root, or counting zero in positive-multiple positions.',
      ),
      prompts: [
        t(
          '这个数能不留余量地分完吗？',
          'Does this number divide without a remainder?',
        ),
        t(
          '这个列表有限，还是可以一直延长？',
          'Is this list finite or can it keep extending?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
  p51Lesson({
    id: 'P51-L04',
    title: t('质数与合数', 'Prime and composite numbers'),
    objective: t(
      '按大于 1 与不同正因数个数分类，利用非平凡因数证明合数。',
      'Classify using greater-than-one and distinct positive-factor counts, using a nontrivial factor to establish compositeness.',
    ),
    prerequisites: ['P51-L03'],
    keywords: [
      t('质数', 'prime'),
      t('合数', 'composite'),
      t('非平凡因数', 'nontrivial factor'),
    ],
    minutes: 16,
    lab: 'integer-prime',
    hook: t(
      '九是奇数，也会是质数吗？四十九试除二有余数，能立刻判它是质数吗？',
      'Nine is odd: is it prime? Forty-nine leaves a remainder when divided by two. Does that alone prove it prime?',
    ),
    guided: q(
      'P51-L04-G',
      [
        '29 的不同正因数只有 1 与 29。它有几个不同正因数？随后解释分类。',
        '29 has only positive factors 1 and 29. How many distinct positive factors? Then explain its classification.',
      ],
      2,
      P,
      [
        ['1 与 29 是两个不同的数。', '1 and 29 are distinct numbers.'],
        [
          '质数需要大于一且恰有两个正因数。',
          'A prime is greater than one with exactly two positive factors.',
        ],
      ],
      [
        [
          '两个正因数，且 29>1，所以为质数。',
          'Two positive factors and 29>1 make it prime.',
        ],
      ],
      ['1', '29', '0'],
    ),
    questions: [
      c(
        'P51-L04-Q1',
        ['1 应如何分类？', 'How should 1 be classified?'],
        2,
        P,
        [
          [
            ['质数', 'Prime'],
            [
              '它只有一个不同正因数，不满足两个且大于一。',
              'It has one distinct positive factor, not two, and is not greater than one.',
            ],
          ],
          [
            ['合数', 'Composite'],
            [
              '合数也必须大于一且有其他正因数。',
              'A composite must also exceed one and have other positive factors.',
            ],
          ],
          [
            ['既不是质数，也不是合数', 'Neither prime nor composite'],
            [
              '定义的大于一条件排除一。',
              'The greater-than-one condition excludes one.',
            ],
          ],
        ],
        [
          [
            '不要把 1 与“自己”当两个不同数。',
            'Do not count one and “itself” as two distinct numbers.',
          ],
          [
            '分类定义从大于一开始。',
            'The classification definitions begin above one.',
          ],
        ],
        [
          [
            '1 的正因数仅 1，因此两类都不属于。',
            'One has only positive factor one and belongs to neither class.',
          ],
        ],
      ),
      q(
        'P51-L04-Q2',
        [
          '9 的不同正因数为 1、3、9，共几个？据此判断分类。',
          '9 has positive factors 1, 3 and 9. How many distinct factors? Use this for classification.',
        ],
        3,
        P,
        [
          [
            '数不同的因数，不只数因数对。',
            'Count distinct factors rather than pairs only.',
          ],
          [
            '三是除了 1 和自己以外的因数。',
            'Three is a factor other than one and the number itself.',
          ],
        ],
        [
          [
            '共三个，9=3×3，九是奇合数。',
            'Three factors; 9=3×3 makes nine an odd composite.',
          ],
        ],
        ['2', '1', '9'],
      ),
      q(
        'P51-L04-Q3',
        [
          '21=3×?，问号是多少？这个关系证明 21 是合数。',
          '21=3×?. What is the missing factor? This relationship proves 21 composite.',
        ],
        7,
        P,
        [
          ['三是非平凡因数。', 'Three is a nontrivial factor.'],
          ['21÷3。', '21÷3.'],
        ],
        [
          [
            '21÷3=7，21=3×7，两因数都大于一。',
            '21÷3=7; 21=3×7, with both factors greater than one.',
          ],
        ],
        ['18', '3', '1'],
        undefined,
        array(21, 3),
      ),
      q(
        'P51-L04-Q4',
        [
          '从 1 到 10（含端点）共有几个质数？',
          'How many primes lie from 1 through 10, inclusive?',
        ],
        4,
        P,
        [
          ['一不属于质数，二属于。', 'One is not prime; two is prime.'],
          ['逐一列 2、3、5、7。', 'List 2, 3, 5 and 7.'],
        ],
        [
          [
            '共四个；二是唯一偶质数，九虽奇但合。',
            'Four primes; two is the only even prime, while odd nine is composite.',
          ],
        ],
        ['5', '3', '6'],
      ),
      q(
        'P51-L04-Q5',
        [
          '49 的不同正因数为 1、7、49，共几个？',
          '49 has positive factors 1, 7 and 49. How many distinct factors?',
        ],
        3,
        P,
        [
          [
            '7×7=49，中间因数只计一次。',
            '7×7=49; count the middle factor once.',
          ],
          [
            '有非平凡因数七，不能是质数。',
            'Nontrivial factor seven excludes primality.',
          ],
        ],
        [
          [
            '三个正因数；49=7×7 为合数。',
            'Three positive factors; 49=7×7 makes it composite.',
          ],
        ],
        ['2', '4', '7'],
      ),
      r(
        'P51-L04-Q6',
        [
          '解释“奇数一定是质数，偶数一定是合数”哪里错，并正确分类 0、1、2、9。',
          'Explain the errors in “all odd numbers are prime and all even numbers composite”, classifying 0, 1, 2 and 9.',
        ],
        P,
        [
          '0 与 1 不大于一，两类都不是；2 的不同正因数为 1、2，是偶质数；9 的正因数为 1、3、9，是奇合数。分类靠定义与因数，不靠奇偶；一次试除失败不能证明质数。',
          'Zero and one do not exceed one and belong to neither class. Two has distinct factors one and two and is an even prime. Nine has factors one, three and nine and is an odd composite. Classification uses the definition and factors, not parity; one failed trial does not prove primality.',
        ],
        [
          [
            '找一个偶质数和一个奇合数反例。',
            'Find an even prime and an odd composite as counterexamples.',
          ],
          [
            '先检验大于一的条件。',
            'Check the greater-than-one condition first.',
          ],
        ],
      ),
    ],
    exit: q(
      'P51-L04-X',
      [
        '31 的不同正因数只有 1 与 31。它有几个不同正因数？再解释是质数还是合数。',
        '31 has only positive factors 1 and 31. How many distinct factors? Then explain prime or composite.',
      ],
      2,
      P,
      [
        ['两个因数不同。', 'The two factors are distinct.'],
        ['结合 31>1 的条件。', 'Combine this with 31>1.'],
      ],
      [
        [
          '共两个且 31>1，所以三十一是质数。',
          'Two factors and 31>1 make thirty-one prime.',
        ],
      ],
      ['1', '31', '3'],
    ),
    exitReason: t(
      '给出分类依据；为什么不能只说“它是奇数”？',
      'Give the classification reason; why is “it is odd” insufficient?',
    ),
    parent: {
      goal: t(
        '听定义与因数证据，不以奇偶或一次试除代替证明。',
        'Listen for definitions and factor evidence rather than parity or one trial.',
      ),
      misconception: t(
        '把一当质数，把奇数都当质数，或把所有偶数当合数。',
        'Calling one prime, all odds prime or all evens composite.',
      ),
      prompts: [
        t(
          '有几个不同正因数？',
          'How many distinct positive factors are there?',
        ),
        t(
          '你找到的是非平凡因数，还是只有它自己？',
          'Did you find a nontrivial factor or only the number itself?',
        ),
      ],
      bridge: 'P51-L03',
    },
  }),
  p51Lesson({
    id: 'P51-L05',
    title: t('最大公因数与最小公倍数初步', 'Intro to GCF and LCM'),
    objective: t(
      '按共同整除或共同正倍数识别目标，用列表验证最大公因数与最小正公倍数。',
      'Identify common-divisor versus positive-common-multiple goals and verify greatest common factors and least positive common multiples using lists.',
    ),
    prerequisites: ['P51-L03', 'P51-L04', 'B06-L04'],
    keywords: [
      t('最大公因数', 'greatest common factor'),
      t('最小正公倍数', 'least positive common multiple'),
      t('共同条件', 'shared condition'),
    ],
    minutes: 18,
    lab: 'integer-common',
    hook: t(
      '18 红卡与 24 蓝卡都平均分进相同数量袋，最多几袋？每八分钟与每十二分钟的纸上节奏，下次同现也求这个“最大数”吗？',
      'Distribute 18 red and 24 blue cards evenly among the same bags: what maximum bag count? Do paper rhythms every eight and twelve minutes also ask for this “greatest number” at their next coincidence?',
    ),
    guided: q(
      'P51-L05-G',
      [
        '18 红卡与 24 蓝卡平均分进相同数量袋，两批都不剩，最多几袋？',
        'Distribute 18 red and 24 blue cards evenly among the same bags, with no remainder in either. What is the greatest bag count?',
      ],
      6,
      C,
      [
        [
          '袋数必须同时整除十八与二十四。',
          'Bag count must divide both eighteen and twenty-four.',
        ],
        [
          '共同正因数为 1、2、3、6。',
          'Common positive factors are 1, 2, 3 and 6.',
        ],
      ],
      [
        [
          '最大为六袋，每袋三红、四蓝。',
          'The greatest is six bags, with three red and four blue per bag.',
        ],
        [
          '6×3=18，6×4=24，同时满足两批。',
          '6×3=18 and 6×4=24 meet both batch conditions.',
        ],
      ],
      ['2', '12', '6 cards'],
      'bags',
      common(18, 24, 'factors'),
    ),
    questions: [
      c(
        'P51-L05-Q1',
        [
          '假想节奏从零同起，每 8 分钟与每 12 分钟出现，下次同现应该找什么？',
          'Imaginary rhythms start together at zero, recurring every 8 and 12 minutes. What should be found for the next coincidence?',
        ],
        1,
        C,
        [
          [
            ['最大公因数', 'Greatest common factor'],
            [
              '它用于共同整除或分组，不是下一共同时点。',
              'It addresses shared divisibility/grouping, not the next common time.',
            ],
          ],
          [
            ['最小正公倍数', 'Least positive common multiple'],
            [
              '下一时点必须是两个间隔的正倍数，选最早。',
              'The next time is a positive multiple of both intervals, choosing the earliest.',
            ],
          ],
          [
            ['两个数的差', 'Difference of the two numbers'],
            [
              '差四分钟不是两种节奏都出现的时点。',
              'A four-minute difference is not a shared recurrence time.',
            ],
          ],
        ],
        [
          [
            '下次时点是间隔的倍数。',
            'The next time is a multiple of the intervals.',
          ],
          [
            '起点零不算下一次。',
            'The initial zero is not the next occurrence.',
          ],
        ],
        [
          [
            '8、16、24 与 12、24，首个正共同点二十四分钟。',
            '8, 16, 24 and 12, 24 first coincide positively at twenty-four minutes.',
          ],
        ],
      ),
      q(
        'P51-L05-Q2',
        [
          '24 与 36 的最大公因数是多少？',
          'What is the greatest common factor of 24 and 36?',
        ],
        12,
        C,
        [
          ['先找两边都能整除的数。', 'Find numbers dividing both exactly.'],
          [
            '共同正因数 1、2、3、4、6、12。',
            'Common positive factors are 1, 2, 3, 4, 6 and 12.',
          ],
        ],
        [
          [
            '最大十二；24÷12=2、36÷12=3，且没有更大共同因数。',
            'Greatest twelve: 24÷12=2 and 36÷12=3, with no larger shared factor.',
          ],
        ],
        ['6', '72', '24'],
        undefined,
        common(24, 36, 'factors'),
      ),
      q(
        'P51-L05-Q3',
        [
          '两种纸上节奏从零开始，每 8 与每 12 分钟出现，下次同现是在多少分钟后？',
          'Two paper rhythms start at zero and recur every 8 and 12 minutes. After how many minutes is their next coincidence?',
        ],
        24,
        C,
        [
          [
            '只找起点后的正共同时点。',
            'Find a positive shared time after the start.',
          ],
          [
            '8 的正倍数 8、16、24；12 的为 12、24。',
            'Positive multiples begin 8,16,24 and 12,24.',
          ],
        ],
        [
          [
            '最小正共同点为 24 min；24=8×3=12×2。',
            'The least positive common time is 24 min; 24=8×3=12×2.',
          ],
        ],
        ['0', '4', '24 m'],
        'min',
        common(8, 12, 'multiples'),
      ),
      q(
        'P51-L05-Q4',
        [
          '8 与 9 的最大公因数是多少？',
          'What is the greatest common factor of 8 and 9?',
        ],
        1,
        C,
        [
          ['两者至少都能被一整除。', 'Both are at least divisible by one.'],
          [
            '8 的正因数 1、2、4、8；9 的为 1、3、9。',
            'Positive factors are 1,2,4,8 and 1,3,9.',
          ],
        ],
        [
          [
            '只有共同正因数一，所以最大为一，不是零。',
            'One is the only common positive factor and therefore the greatest, not zero.',
          ],
        ],
        ['0', '8', '72'],
      ),
      q(
        'P51-L05-Q5',
        [
          '两种节奏都每 6 分钟出现，从零同起。下次同现是在多少分钟后？',
          'Both rhythms recur every 6 minutes from a shared zero start. How many minutes until the next coincidence?',
        ],
        6,
        C,
        [
          [
            '相同间隔的下一次是第一个正倍数。',
            'Equal intervals next coincide at their first positive multiple.',
          ],
          ['6 同时是两边的正倍数。', 'Six is a positive multiple of both.'],
        ],
        [
          [
            '最小正公倍数为 6 min，不是零也不是三十六。',
            'The least positive common multiple is 6 min, neither zero nor thirty-six.',
          ],
        ],
        ['0', '36', '6 cards'],
        'min',
      ),
      r(
        'P51-L05-Q6',
        [
          '有人说 8 与 12 的最小公倍数是 0，因为零是两者的倍数。解释本课为什么找最小正公倍数，并给出下一时点。',
          'Someone says the least common multiple of 8 and 12 is zero because zero is a multiple of both. Explain why this lesson finds the least positive common multiple and give the next time.',
        ],
        C,
        [
          '0 是共同零倍，但本课最小公倍数约定为最小正公倍数，下一时点不能是起点。8、16、24 与 12、24 首个正共同点 24 min；24=8×3=12×2。最大公因数四回答的是共同整除，不是共同复现。',
          'Zero is a shared zero multiple, but least common multiple here means least positive common multiple; the next occurrence is not the starting instant. 8,16,24 and 12,24 first share 24 min, with 24=8×3=12×2. GCF four answers shared divisibility, not shared recurrence.',
        ],
        [
          ['“下一次”排除了开始时点。', '“Next” excludes the starting instant.'],
          [
            '正倍数列表从自身开始。',
            'Positive-multiple lists start at the number itself.',
          ],
        ],
      ),
    ],
    exit: q(
      'P51-L05-X',
      [
        '20 红卡与 30 蓝卡平均分进相同数量袋，两批都不剩，最多几袋？',
        '20 red and 30 blue cards are distributed evenly among the same bags without remainders. What greatest bag count?',
      ],
      10,
      C,
      [
        [
          '袋数是两批张数的共同因数。',
          'Bag count is a common factor of both batch counts.',
        ],
        [
          '共同正因数 1、2、5、10。',
          'Common positive factors are 1, 2, 5 and 10.',
        ],
      ],
      [
        [
          '最大十袋，每袋二红三蓝；10×2=20、10×3=30。',
          'Greatest ten bags, with two red and three blue each; 10×2=20 and 10×3=30.',
        ],
      ],
      ['5', '60', '10 min'],
      'bags',
    ),
    exitReason: t(
      '说明为什么求公因数而不是公倍数，并核查两批数量。',
      'Explain why the goal uses common factors rather than multiples, checking both batch quantities.',
    ),
    parent: {
      goal: t(
        '先判断目标关系，再比较共同集合中的最大或最小正值。',
        'Identify the relationship before choosing greatest or least positive in the common set.',
      ),
      misconception: t(
        '看到两数就相乘；只找到一个公因数就当最大；把零当下一时点。',
        'Multiplying every pair, treating one common factor as the greatest, or using zero as the next time.',
      ),
      prompts: [
        t(
          '这个答案要整除两批，还是被两个间隔整除？',
          'Must the answer divide both batches or be divisible by both intervals?',
        ),
        t(
          '你怎样证明没有更大因数或更早正共同点？',
          'How do you show no larger factor or earlier positive common value?',
        ),
      ],
      bridge: 'P51-L03',
    },
    familyChallenge: t(
      '纸卡与纸上节奏：用 24 张红卡、36 张蓝卡，找最多的相同袋数，且每袋两色各自一样多、没有余卡；比较六袋与十二袋。再列每八分钟、每十二分钟的假想节奏，找起点后的首个共同点。用乘回核查，并说明两问为何用不同关系。不实际采购或等待计时，不计分。',
      'Paper cards and paper rhythms: use 24 red and 36 blue cards to find the greatest identical bag count, with equal counts of each colour per bag and no leftovers; compare six and twelve bags. List imaginary eight-minute and twelve-minute rhythms to find the first common time after the start. Check by multiplying back and explain why the two questions use different relationships. No real purchase or timed waiting; no score.',
    ),
  }),
];
export const p51CheckQuestions: Question[] = [
  q(
    'P51-CHECK-Q1',
    ['计算 1500+24×25−360÷6。', 'Calculate 1500+24×25−360÷6.'],
    2040,
    M,
    [
      ['先算乘积与商。', 'Find product and quotient first.'],
      ['24×25=600，360÷6=60。', '24×25=600 and 360÷6=60.'],
    ],
    [['1500+600−60=2040。', '1500+600−60=2040.']],
    ['2160', '2100', '1440'],
  ),
  q(
    'P51-CHECK-Q2',
    ['计算 (180+60)÷8。', 'Calculate (180+60)÷8.'],
    30,
    O,
    [
      ['括号是整个被除量。', 'The bracketed sum is the whole dividend.'],
      ['先求二百四十。', 'First find two hundred and forty.'],
    ],
    [['(180+60)÷8=240÷8=30。', '(180+60)÷8=240÷8=30.']],
    ['187.5', '240', '22.5'],
  ),
  q(
    'P51-CHECK-Q3',
    [
      '48 张卡排成 6 个相等行，每行几张？',
      '48 cards form 6 equal rows. How many cards per row?',
    ],
    8,
    F,
    [
      [
        '六乘每行张数等于四十八。',
        'Six times cards per row equals forty-eight.',
      ],
      ['48÷6。', '48÷6.'],
    ],
    [
      [
        '48÷6=8，6×8=48，均为正因数。',
        '48÷6=8 and 6×8=48; both are positive factors.',
      ],
    ],
    ['6', '42', '8 bags'],
    'cards',
    array(48, 6),
  ),
  q(
    'P51-CHECK-Q4',
    [
      '25 的不同正因数为 1、5、25，共几个？',
      '25 has positive factors 1,5,25. How many distinct factors?',
    ],
    3,
    P,
    [
      ['五乘五的五不计两次。', 'Do not count five twice in five times five.'],
      ['数三个不同数。', 'Count three distinct numbers.'],
    ],
    [['共三个；二十五是合数。', 'Three factors; twenty-five is composite.']],
    ['2', '4', '5'],
  ),
  c(
    'P51-CHECK-Q5',
    ['哪一个是质数？', 'Which number is prime?'],
    2,
    P,
    [
      [
        ['1', '1'],
        [
          '只有一个不同正因数，且不大于一。',
          'Only one distinct positive factor and not greater than one.',
        ],
      ],
      [
        ['9', '9'],
        [
          '九有非平凡因数三，是奇合数。',
          'Nine has nontrivial factor three and is an odd composite.',
        ],
      ],
      [
        ['2', '2'],
        [
          '不同正因数只有一和二，是偶质数。',
          'Distinct factors are one and two, making it an even prime.',
        ],
      ],
    ],
    [
      [
        '用定义，不用奇偶猜。',
        'Use the definition rather than guess from parity.',
      ],
      [
        '恰有两个不同正因数且大于一。',
        'Exactly two distinct positive factors and greater than one.',
      ],
    ],
    [['二满足质数定义。', 'Two meets the prime definition.']],
  ),
  q(
    'P51-CHECK-Q6',
    [
      '16 红卡与 24 蓝卡分进相同数量袋，均无余量，最多几袋？',
      'Distribute 16 red and 24 blue cards among the same bags without remainders. What greatest bag count?',
    ],
    8,
    C,
    [
      ['找共同正因数。', 'Find common positive factors.'],
      ['1、2、4、8 两边都整除。', '1,2,4,8 divide both exactly.'],
    ],
    [
      [
        '最大八袋，每袋二红三蓝。',
        'Greatest eight bags, with two red and three blue each.',
      ],
    ],
    ['4', '48', '8 cards'],
    'bags',
    common(16, 24, 'factors'),
  ),
  q(
    'P51-CHECK-Q7',
    [
      '两种假想节奏从零同起，分别每 6 与每 10 分钟出现，下次同现多少分钟后？',
      'Imaginary rhythms start together at zero and recur every 6 and 10 minutes. How many minutes until their next coincidence?',
    ],
    30,
    C,
    [
      [
        '下一时点必须是两边的正倍数。',
        'The next time must be a positive multiple of both.',
      ],
      ['6、12、18、24、30 与 10、20、30。', '6,12,18,24,30 and 10,20,30.'],
    ],
    [
      [
        '首个正共同点 30 min，30=6×5=10×3。',
        'First positive common time 30 min, with 30=6×5=10×3.',
      ],
    ],
    ['0', '2', '30 m'],
    'min',
  ),
  r(
    'P51-CHECK-Q8',
    [
      '2 能同时整除 18 与 24，有人就说最大公因数是 2。解释“共同”与“最大”两个条件怎样分别核查。',
      'Two divides both 18 and 24, so someone calls two their greatest common factor. Explain how “common” and “greatest” must be checked separately.',
    ],
    C,
    [
      '2 是公因数，但完整共同正因数为 1、2、3、6，最大六。先用余数零确认共同，再列共同集合比较最大；六袋每袋三红四蓝恢复 18 与 24。',
      'Two is common, but all common positive factors are 1,2,3,6, with greatest six. Zero remainders confirm common; compare the full common set for greatest. Six bags of three red and four blue recover 18 and 24.',
    ],
    [
      [
        '能整除不代表已经最大。',
        'Exact divisibility does not establish greatest.',
      ],
      ['两边因数列表找共有，再比较。', 'Intersect factor lists, then compare.'],
    ],
  ),
];
export function p51ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a nonnegative whole review round');
  const k = round % 80,
    suffix = `${id}-R${round}`;
  if (id === 'P51-L01') {
    const a = 1000 + 100 * (k % 20),
      b = 12 + (k % 25),
      c = 5 * (1 + (Math.floor(k / 4) % 5)),
      divisor = 2 + (k % 7),
      quotient = 10 + (k % 19),
      d = divisor * quotient,
      value = a + b * c - quotient;
    return q(
      suffix,
      [
        `计算 ${a}+${b}×${c}−${d}÷${divisor}。`,
        `Calculate ${a}+${b}×${c}−${d}÷${divisor}.`,
      ],
      value,
      M,
      [
        [
          '同一层先求乘积与商。',
          'Find product and quotient first at this level.',
        ],
        [
          '保留原加减关系与位值。',
          'Retain the original addition/subtraction and place values.',
        ],
      ],
      [
        [
          `${b}×${c}=${b * c}，${d}÷${divisor}=${quotient}，${a}+${b * c}−${quotient}=${value}。`,
          `${b}×${c}=${b * c}; ${d}÷${divisor}=${quotient}; ${a}+${b * c}−${quotient}=${value}.`,
        ],
      ],
      [String(a + b * c + quotient), String(a + b * c)],
    );
  }
  if (id === 'P51-L02') {
    const a = 20 + (k % 16),
      b = 2 + (k % 7),
      c = 2 + (Math.floor(k / 3) % 5),
      value = k % 2 ? (a + b) * c : a + b * c;
    return q(
      suffix,
      k % 2
        ? [`计算 (${a}+${b})×${c}。`, `Calculate (${a}+${b})×${c}.`]
        : [`计算 ${a}+${b}×${c}。`, `Calculate ${a}+${b}×${c}.`],
      value,
      O,
      [
        ['先确认括号有没有包含和。', 'Check whether brackets contain the sum.'],
        k % 2
          ? ['先括号中的和，再乘。', 'Bracketed sum first, then multiply.']
          : ['先乘积，再加。', 'Product first, then add.'],
      ],
      [
        k % 2
          ? [
              `(${a}+${b})×${c}=${a + b}×${c}=${value}。`,
              `(${a}+${b})×${c}=${a + b}×${c}=${value}.`,
            ]
          : [
              `${a}+${b}×${c}=${a}+${b * c}=${value}。`,
              `${a}+${b}×${c}=${a}+${b * c}=${value}.`,
            ],
      ],
      [String(value + 1), String(value - 1)],
    );
  }
  if (id === 'P51-L03') {
    const rows = 2 + (k % 5),
      each = 3 + (Math.floor(k / 8) % 6),
      n = rows * each;
    if (k % 2)
      return q(
        suffix,
        [
          `${rows} 的第 ${each} 个正倍数是多少？从自身开始。`,
          `What is positive multiple number ${each} of ${rows}, starting at the number itself?`,
        ],
        n,
        F,
        [
          [
            '不把零计为第一个正倍数。',
            'Do not count zero as the first positive multiple.',
          ],
          ['这个数乘序号。', 'Multiply the number by the position.'],
        ],
        [[`${rows}×${each}=${n}。`, `${rows}×${each}=${n}.`]],
        [String(rows * (each - 1)), String(n + 1)],
      );
    return q(
      suffix,
      [
        `${n} 张卡排成 ${rows} 个相等行，每行几张？`,
        `${n} cards form ${rows} equal rows. How many cards per row?`,
      ],
      each,
      F,
      [
        ['完整行，没有余量。', 'Complete rows with no leftovers.'],
        ['总张数除行数。', 'Divide total cards by row count.'],
      ],
      [
        [
          `${n}÷${rows}=${each} 张，乘回 ${rows}×${each}=${n}。`,
          `${n}÷${rows}=${each} cards; check ${rows}×${each}=${n}.`,
        ],
      ],
      [String(each + 1), `${each} bags`],
      'cards',
      array(n, rows),
    );
  }
  if (id === 'P51-L04') {
    const n = [1, 2, 9, 13, 15, 21, 25, 49][k % 8]!,
      factors = positiveFactors(n),
      value = factors.length;
    return q(
      suffix,
      [
        `${n} 有几个不同正因数？用定义解释分类。`,
        `How many distinct positive factors does ${n} have? Use the definition to explain its classification.`,
      ],
      value,
      P,
      [
        ['相同因数不重计。', 'Do not duplicate equal factors.'],
        [
          '大于一且恰有两个不同正因数才是质数。',
          'A prime exceeds one with exactly two distinct positive factors.',
        ],
      ],
      [
        [
          `正因数 ${factors.join('、')}，共 ${value} 个；${n === 1 ? '一两类都不是。' : value === 2 ? '满足质数定义。' : '有非平凡因数，为合数。'}`,
          `Positive factors ${factors.join(', ')}: ${value} in total; ${n === 1 ? 'one belongs to neither class.' : value === 2 ? 'the prime definition applies.' : 'a nontrivial factor makes it composite.'}`,
        ],
      ],
      [String(value + 1), String(value - 1)],
    );
  }
  if (id === 'P51-L05') {
    const a = 1 + (k % 12),
      b = 1 + (Math.floor(k / 3) % 12),
      m = commonNumbers(a, b),
      value = k % 2 ? m.lcm : m.gcf;
    return q(
      suffix,
      k % 2
        ? [
            `从零同起，每 ${a} 与每 ${b} 分钟的假想节奏，下次同现多少分钟后？`,
            `Imaginary rhythms start together at zero, recurring every ${a} and ${b} minutes. How many minutes until the next coincidence?`,
          ]
        : [
            `${a} 与 ${b} 的最大公因数是多少？`,
            `What is the greatest common factor of ${a} and ${b}?`,
          ],
      value,
      C,
      [
        k % 2
          ? [
              '找正倍数中的首个共同点。',
              'Find the first shared positive multiple.',
            ]
          : [
              '找能同时整除的最大正整数。',
              'Find the greatest positive integer dividing both.',
            ],
        [
          '不把公因数与公倍数混淆，起点零不是下一次。',
          'Distinguish factors from multiples; zero at the start is not next.',
        ],
      ],
      [
        k % 2
          ? [
              `${value}=${a}×${value / a}=${b}×${value / b}，为首个正共同点。`,
              `${value}=${a}×${value / a}=${b}×${value / b}, the first shared positive value.`,
            ]
          : [
              `共同正因数 ${m.commonFactors.join('、')}，最大 ${value}。`,
              `Common positive factors ${m.commonFactors.join(', ')}; greatest ${value}.`,
            ],
      ],
      [String(value + 1), k % 2 ? '0' : String(value + 2)],
      k % 2 ? 'min' : undefined,
      common(a, b, k % 2 ? 'multiples' : 'factors'),
    );
  }
  throw new Error(`Unknown P51 lesson ${id}`);
}
