import { t, type Lesson, type Question } from '../model';
import { choice, decimalQuestion as d, p52Lesson, reasoning } from './builders';
import { formatMilli, roundMilli } from '../decimalModels';
const T = t;
const place = 'decimal-place-value',
  compare = 'decimal-comparison',
  add = 'decimal-addition',
  subtract = 'decimal-subtraction',
  multiply = 'decimal-whole-multiplication',
  divide = 'decimal-whole-division',
  application = 'decimal-modelling';
export const p52Lessons: Lesson[] = [
  p52Lesson({
    id: 'P52-L01',
    title: T('小数位值到千分位', 'Decimal place value to thousandths'),
    objective: T(
      '把十分位、百分位、千分位与同一个整体的等份联系起来。',
      'Connect tenths, hundredths and thousandths to equal parts of the same whole.',
    ),
    prerequisites: ['B01-L02', 'B04-L04'],
    keywords: [
      T('千分位', 'thousandths'),
      T('占位零', 'placeholder zero'),
      T('等值', 'equivalence'),
    ],
    minutes: 15,
    lab: 'decimal-place',
    hook: T(
      '0.4、0.04、0.004 都有一个 4。它们一样大吗？先猜，再把一个整体依次分成 10、100、1,000 份。',
      '0.4, 0.04 and 0.004 each contain a 4. Are they equal? Predict, then divide the same whole into 10, 100 and 1,000 parts.',
    ),
    guided: d(
      'P52-L01-G',
      T(
        '3 个十分之一和 7 个千分之一，合起来是多少？用小数表示。',
        'Write three tenths and seven thousandths together as a decimal.',
      ),
      '0.307',
      place,
      [
        T(
          '百分位没有，也要保留位置。',
          'Hundredths is empty, but its place must remain.',
        ),
        T(
          '0.300 + 0.007；把十分之一换成千分之一再合计。',
          'Combine 0.300 and 0.007; express tenths as thousandths first.',
        ),
      ],
      [
        T(
          '三个十分之一为 300 个千分之一。',
          'Three tenths equal 300 thousandths.',
        ),
        T(
          '300 + 7 = 307 个千分之一，所以是 0.307。',
          '300 + 7 = 307 thousandths, giving 0.307.',
        ),
      ],
      {
        accepted: ['0.307', '.307', '0.3070'],
        rejected: ['0.37', '0.0307', '307', '307/1000'],
      },
    ),
    questions: [
      choice(
        'P52-L01-Q1',
        T('5.208 中的 8 表示多少？', 'What is the value of the 8 in 5.208?'),
        2,
        place,
        [
          {
            text: T('8 个一', 'Eight ones'),
            feedback: T(
              '8 在小数点右边第三位，不是个位。',
              'The 8 is third after the decimal point, not in ones.',
            ),
          },
          {
            text: T('8 个百分之一', 'Eight hundredths'),
            feedback: T(
              '百分位是小数点右边第二位，这里为 0。',
              'Hundredths is second after the point; it contains zero here.',
            ),
          },
          {
            text: T('8 个千分之一', 'Eight thousandths'),
            feedback: T(
              '第三位是千分位，8 的值是 0.008。',
              'The third place is thousandths; its value is 0.008.',
            ),
          },
        ],
        [
          T(
            '从小数点向右数位。',
            'Count places to the right of the decimal point.',
          ),
          T(
            '十分、百分、千分，对应第一、二、三位。',
            'Tenths, hundredths and thousandths are places one, two and three.',
          ),
        ],
        [
          T('5.208 = 5 + 0.2 + 0 + 0.008。', '5.208 = 5 + 0.2 + 0 + 0.008.'),
          T('8 表示 8/1,000。', 'The 8 represents 8/1,000.'),
        ],
      ),
      d(
        'P52-L01-Q2',
        T(
          '4 个百分之一是多少个千分之一？',
          'How many thousandths equal four hundredths?',
        ),
        '40',
        place,
        [
          T(
            '一个百分之一可分成十个千分之一。',
            'One hundredth splits into ten thousandths.',
          ),
          T(
            '4 个百分之一，每个含 10 个千分之一。',
            'Each of four hundredths contains ten thousandths.',
          ),
        ],
        [
          T('4 × 10 = 40。', '4 × 10 = 40.'),
          T(
            '0.04 = 0.040，并没有变大。',
            '0.04 = 0.040; the value does not grow.',
          ),
        ],
        { accepted: ['40', '40.0'], rejected: ['4', '400', '.04'] },
      ),
      d(
        'P52-L01-Q3',
        T(
          '看小数位值表，写出这个小数。',
          'Read the decimal place-value chart and write the decimal.',
        ),
        '0.407',
        place,
        [
          T(
            '先看整数部分，再看三位小数。',
            'Read the whole-number part, then the three decimal places.',
          ),
          T(
            '4 个十分之一、0 个百分之一、7 个千分之一。',
            'Four tenths, zero hundredths and seven thousandths.',
          ),
        ],
        [
          T('400 + 7 = 407 个千分之一。', '400 + 7 = 407 thousandths.'),
          T(
            '写成 0.407，百分位的 0 必须保留。',
            'Write 0.407, keeping zero in hundredths.',
          ),
        ],
        {
          accepted: ['0.407', '.407', '0.4070'],
          rejected: ['0.47', '4.07', '.047'],
        },
        undefined,
        { kind: 'decimal-place', milli: 407 },
      ),
      d(
        'P52-L01-Q4',
        T(
          '把 2 + 0.05 + 0.006 合成一个小数。',
          'Combine 2 + 0.05 + 0.006 into one decimal.',
        ),
        '2.056',
        place,
        [
          T(
            '十分位没有，要用 0 占位。',
            'There are no tenths; use a zero placeholder.',
          ),
          T(
            '0.050 与 0.006 共 56 个千分之一。',
            '0.050 and 0.006 total 56 thousandths.',
          ),
        ],
        [
          T('2 + 0.050 + 0.006 = 2.056。', '2 + 0.050 + 0.006 = 2.056.'),
          T(
            '整数是 2，十分位为 0，百分位为 5，千分位为 6。',
            'Ones is 2, tenths 0, hundredths 5 and thousandths 6.',
          ),
        ],
        {
          accepted: ['2.056', '2.0560'],
          rejected: ['2.56', '2.506', '2.0056'],
        },
      ),
      d(
        'P52-L01-Q5',
        T(
          '一段绳子长 1 米又 9 毫米。1 米 = 1,000 毫米。用米为单位写出长度。',
          'A rope is 1 metre and 9 millimetres long. There are 1,000 millimetres in a metre. Write its length in metres.',
        ),
        '1.009',
        place,
        [
          T(
            '9 毫米是 9 个千分之一米。',
            'Nine millimetres are nine thousandths of a metre.',
          ),
          T('1 米加 0.009 米。', 'Add 1 metre and 0.009 metre.'),
        ],
        [
          T('9 ÷ 1,000 = 0.009 米。', '9 ÷ 1,000 = 0.009 metre.'),
          T('长度为 1.009 米。', 'The length is 1.009 metres.'),
        ],
        {
          accepted: ['1.009', '1.009 m', '1.009 metres'],
          rejected: ['1.09', '1.9', '1009', '1.009 cm'],
        },
        'm',
      ),
      reasoning(
        'P52-L01-Q6',
        T(
          '“0.040 比 0.04 大，因为多写了一个数字。”哪里错了？',
          '“0.040 is larger than 0.04 because it has another digit.” Find the mistake.',
        ),
        place,
        T(
          '0.04 是 4 个百分之一，即 40 个千分之一；0.040 也是同样的 40 个千分之一。末尾加零不改变数值，但小数点后开头或中间的零不能随意删。可用同一整体的图或换单位解释。',
          '0.04 is four hundredths, or forty thousandths; 0.040 is the same amount. A trailing zero does not change value, but leading or internal decimal zeros cannot be deleted freely. Accept a model of the same whole or conversion of units.',
        ),
        [
          T(
            '把两者都写成千分之一的个数。',
            'Express both as a count of thousandths.',
          ),
          T(
            '想想新增的千分位上有多少个千分之一。',
            'How many thousandths are added by the final zero?',
          ),
        ],
      ),
    ],
    exit: d(
      'P52-L01-X',
      T(
        '一条 1 米标尺的 1,000 个等长区间中，标出 63 个。标出多少米？用小数表示。',
        'A 1-metre ruler has 1,000 equal intervals; 63 are marked. Write the marked length as a decimal in metres.',
      ),
      '0.063',
      place,
      [
        T('每格是千分之一米。', 'Each interval is one thousandth of a metre.'),
        T('63 格是 63/1,000 米。', '63 intervals represent 63/1,000 metre.'),
      ],
      [
        T(
          '63 个千分之一米 = 0.063 米。',
          '63 thousandths of a metre equal 0.063 metre.',
        ),
        T(
          '0.63 米则有 630 个小区间，数量不同。',
          '0.63 metre would cover 630 intervals, a different amount.',
        ),
      ],
      {
        accepted: ['0.063', '.063', '0.063 m'],
        rejected: ['.63', '.0063', '63', '0.063 cm'],
      },
      'm',
    ),
    exitReason: T(
      '解释：0.063 中的 6 和 3 分别对应多大的单位？',
      'Explain which units the 6 and 3 represent in 0.063.',
    ),
    parent: {
      goal: T(
        '同一整体可以按更细的单位计数，零负责保留数位。',
        'The same whole can be counted with finer units; zero preserves each place.',
      ),
      misconception: T(
        '把 0.4、0.04、0.004 都当成四份，却不说明每份多大。',
        'Calling 0.4, 0.04 and 0.004 four parts without identifying the size of a part.',
      ),
      prompts: [
        T(
          '一个百分之一含几个千分之一？',
          'How many thousandths are in one hundredth?',
        ),
        T(
          '这一位没有数量，为什么仍要写 0？',
          'Why keep zero when this place has no amount?',
        ),
      ],
      bridge: 'B04-L04',
    },
  }),
  p52Lesson({
    id: 'P52-L02',
    title: T('小数比较与估算', 'Comparing and estimating decimals'),
    objective: T(
      '对齐数位比较小数，用指定的精度合理舍入。',
      'Compare decimals by aligned places and round at a stated precision.',
    ),
    prerequisites: ['P52-L01', 'B01-L04'],
    keywords: [
      T('比较', 'compare'),
      T('精度', 'precision'),
      T('近似数', 'approximation'),
    ],
    minutes: 15,
    lab: 'decimal-compare',
    hook: T(
      '跳远成绩 0.8 米与 0.805 米，谁更远？若都写成“约 0.8 米”，是否表示精确距离相等？',
      'Which jump is longer: 0.8 metres or 0.805 metres? If both are reported as about 0.8 metres, are the exact distances equal?',
    ),
    guided: d(
      'P52-L02-G',
      T(
        '0.8、0.75、0.805 中，最大的数是什么？',
        'Which is greatest: 0.8, 0.75 or 0.805?',
      ),
      '0.805',
      compare,
      [
        T('把三者都写到千分位。', 'Express all three to thousandths.'),
        T('比较 0.800、0.750、0.805。', 'Compare 0.800, 0.750 and 0.805.'),
      ],
      [
        T(
          '十分位：0.800 与 0.805 都有 8，0.750 只有 7。',
          'At tenths, 0.800 and 0.805 have 8, while 0.750 has 7.',
        ),
        T(
          '千分位 5 大于 0，所以 0.805 最大。',
          'At thousandths, 5 exceeds 0, so 0.805 is greatest.',
        ),
      ],
      {
        accepted: ['0.805', '.805', '0.8050'],
        rejected: ['0.8', '0.75', '805'],
      },
    ),
    questions: [
      choice(
        'P52-L02-Q1',
        T(
          '比较 0.07 和 0.7，哪个判断正确？',
          'Which comparison of 0.07 and 0.7 is correct?',
        ),
        1,
        compare,
        [
          {
            text: T('0.07 > 0.7', '0.07 > 0.7'),
            feedback: T(
              '位数更多不代表更大；十分位的 0 小于 7。',
              'More digits do not mean a larger value; the tenths digit 0 is less than 7.',
            ),
          },
          {
            text: T('0.07 < 0.7', '0.07 < 0.7'),
            feedback: T(
              '7 个百分之一比 7 个十分之一小。',
              'Seven hundredths are smaller than seven tenths.',
            ),
          },
          {
            text: T('0.07 = 0.7', '0.07 = 0.7'),
            feedback: T(
              '7 的数位不同：0.070 与 0.700 不相等。',
              'The 7s occupy different places: 0.070 and 0.700 are not equal.',
            ),
          },
        ],
        [
          T('把两个小数点对齐。', 'Align the decimal points.'),
          T(
            '从整数部分到十分位依次比较。',
            'Compare the whole-number part, then tenths.',
          ),
        ],
        [
          T(
            '0.07 = 70 个千分之一；0.7 = 700 个千分之一。',
            '0.07 is 70 thousandths; 0.7 is 700 thousandths.',
          ),
          T('因此 0.07 < 0.7。', 'Therefore 0.07 < 0.7.'),
        ],
      ),
      d(
        'P52-L02-Q2',
        T(
          '把 2.348 四舍五入到最近的百分之一。',
          'Round 2.348 to the nearest hundredth.',
        ),
        '2.35',
        compare,
        [
          T(
            '相邻百分之一是 2.34 与 2.35。',
            'The neighbouring hundredths are 2.34 and 2.35.',
          ),
          T('中点是 2.345。', 'Their midpoint is 2.345.'),
        ],
        [
          T('2.348 在中点 2.345 上方。', '2.348 is above midpoint 2.345.'),
          T(
            '更接近 2.35，故近似为 2.35。',
            'It is closer to 2.35, so round to 2.35.',
          ),
        ],
        { accepted: ['2.35', '2.350'], rejected: ['2.34', '2.3', '2.348'] },
      ),
      d(
        'P52-L02-Q3',
        T(
          '把 0.805 四舍五入到最近的百分之一，正好一半时向上。',
          'Round 0.805 to the nearest hundredth, using the upper neighbour for a halfway tie.',
        ),
        '0.81',
        compare,
        [
          T('邻居是 0.80 与 0.81。', 'The neighbours are 0.80 and 0.81.'),
          T('0.805 正好在两者中点。', '0.805 is exactly halfway between them.'),
        ],
        [
          T('两边距离都是 0.005。', 'Each distance is 0.005.'),
          T('按题目约定向上取 0.81。', 'The stated tie rule gives 0.81.'),
        ],
        {
          accepted: ['0.81', '.81', '0.810'],
          rejected: ['0.8', '0.805', '0.85'],
        },
      ),
      d(
        'P52-L02-Q4',
        T(
          '把 1.995 四舍五入到最近的百分之一。正好一半时向上。',
          'Round 1.995 to the nearest hundredth; round halfway ties up.',
        ),
        '2.00',
        compare,
        [
          T(
            '相邻百分之一是 1.99 与 2.00。',
            'The neighbours are 1.99 and 2.00.',
          ),
          T(
            '向上时会越过两个 9，进到整数部分。',
            'Rounding up carries across the two 9s into the whole-number part.',
          ),
        ],
        [
          T(
            '1.995 是中点，取较大的邻居。',
            '1.995 is the midpoint; choose the larger neighbour.',
          ),
          T(
            '结果为 2.00，写 2 或 2.0 数值也相等。',
            'The result is 2.00; 2 or 2.0 have the same numerical value.',
          ),
        ],
        {
          accepted: ['2', '2.0', '2.00', '2.000'],
          rejected: ['1.99', '1.100', '1.9'],
        },
      ),
      d(
        'P52-L02-Q5',
        T(
          '两次跑步分别是 1.24 km 与 2.67 km。先各自估到十分之一，再估合计多少 km？',
          'Two runs are 1.24 km and 2.67 km. Round each to tenths, then estimate the total in km. Write the numerical value.',
        ),
        '3.9',
        compare,
        [
          T('分别估为 1.2 和 2.7。', 'The separate estimates are 1.2 and 2.7.'),
          T(
            '加的是两个近似数，不是精确原数。',
            'Add the approximations, not the original exact values.',
          ),
        ],
        [
          T('1.2 + 2.7 = 3.9。', '1.2 + 2.7 = 3.9.'),
          T(
            '精确合计 3.91 km 接近估计；不要把估计写成精确等式。',
            'The exact total 3.91 km is close; do not call the estimate an exact equality.',
          ),
        ],
        {
          accepted: ['3.9', '3.90', '3.9 km'],
          rejected: ['3.91', '3.8', '39', '3.9 m'],
        },
        'km',
      ),
      reasoning(
        'P52-L02-Q6',
        T(
          '0.804 与 0.806 都估成 0.8，所以它们一定相等吗？解释。',
          '0.804 and 0.806 both round to 0.8. Must they be equal? Explain.',
        ),
        compare,
        T(
          '不相等，精确值相差 0.002；舍入丢失了一些精度，多个不同值可以有同一个近似数。可用位值、数轴或差值说明。不能仅因为舍入相同就认定精确相等。',
          'No. Their exact difference is 0.002. Rounding loses precision, so different values can share one approximation. Accept place value, a number line or the difference; matching rounded values do not prove exact equality.',
        ),
        [
          T('比较两个千分位上的数字。', 'Compare the thousandths digits.'),
          T(
            '近似数是否保留了所有原来的信息？',
            'Does an approximation retain all the original information?',
          ),
        ],
      ),
    ],
    exit: d(
      'P52-L02-X',
      T(
        '记录仪显示 0.496 米。报告要求到最近的百分之一，写多少米？',
        'A recorder shows 0.496 metres. The report asks for the nearest hundredth. What length should it show in metres?',
      ),
      '0.50',
      compare,
      [
        T(
          '相邻百分之一为 0.49 和 0.50。',
          'The neighbouring hundredths are 0.49 and 0.50.',
        ),
        T('中点为 0.495。', 'The midpoint is 0.495.'),
      ],
      [
        T(
          '0.496 比中点大，应取 0.50。',
          '0.496 is above the midpoint, so choose 0.50.',
        ),
        T(
          '这是约 0.50 米，原始精确值仍为 0.496 米。',
          'This is about 0.50 metre; the original exact value remains 0.496 metres.',
        ),
      ],
      { accepted: ['0.5', '0.50', '0.50 m'], rejected: ['.49', '.496', '5'] },
      'm',
    ),
    exitReason: T(
      '解释：为什么报告中的 0.50 不表示原始精确值就是 0.500？',
      'Explain why reporting 0.50 does not mean the original exact value was 0.500.',
    ),
    parent: {
      goal: T(
        '按单位大小逐位比较，舍入时明确精度。',
        'Compare matching units place by place and state the rounding precision.',
      ),
      misconception: T(
        '按小数位数比较大小，或把同一个近似数误当同一个精确数。',
        'Comparing digit counts or treating a shared approximation as equal exact values.',
      ),
      prompts: [
        T(
          '把空位补成零，第一次不同在哪里？',
          'After adding placeholder zeros, where is the first difference?',
        ),
        T(
          '我们保留到哪一位，哪些信息被舍去了？',
          'Which precision are we keeping, and what information is lost?',
        ),
      ],
      bridge: 'P52-L01',
    },
  }),
  p52Lesson({
    id: 'P52-L03',
    title: T('小数加法与减法', 'Adding and subtracting decimals'),
    objective: T(
      '对齐小数点，把同样大小的单位相加减，并解释进位与借位。',
      'Align decimal points, operate on matching units, and explain carrying and borrowing.',
    ),
    prerequisites: ['P52-L01', 'B01-L05'],
    keywords: [
      T('对齐', 'alignment'),
      T('进位', 'carrying'),
      T('借位', 'borrowing'),
    ],
    minutes: 18,
    lab: 'decimal-add',
    hook: T(
      '一段 2.75 米的绳子接上 0.68 米。把末尾数字右对齐，还是把小数点对齐？先猜总长，再看位值列里发生什么。',
      'Join 2.75 metres of rope to another 0.68 metres. Should the last digits or the decimal points align? Estimate the total, then inspect the columns.',
    ),
    guided: d(
      'P52-L03-G',
      T('2.75 + 0.68 = ? 用小数表示。', 'Calculate 2.75 + 0.68 as a decimal.'),
      '3.43',
      add,
      [
        T(
          '写成 2.750 + 0.680，小数点上下对齐。',
          'Write 2.750 + 0.680 with aligned decimal points.',
        ),
        T(
          '百分位 5 + 8 = 13，需要向十分位进 1。',
          'At hundredths, 5 + 8 = 13, so carry one to tenths.',
        ),
      ],
      [
        T(
          '13 个百分之一 = 1 个十分之一和 3 个百分之一。',
          'Thirteen hundredths are one tenth and three hundredths.',
        ),
        T(
          '十分位 7 + 6 + 1 = 14，再向个位进 1；结果 3.430 = 3.43。',
          'At tenths, 7 + 6 + 1 = 14; carry one to ones. The result is 3.430 = 3.43.',
        ),
      ],
      { accepted: ['3.43', '3.430'], rejected: ['2.143', '2.813', '34.3'] },
    ),
    questions: [
      choice(
        'P52-L03-Q1',
        T(
          '算 1.2 + 0.45 时，正确的列对齐是哪一种？',
          'Which alignment is correct for 1.2 + 0.45?',
        ),
        0,
        add,
        [
          {
            text: T(
              '1.20 与 0.45，小数点对齐',
              'Align 1.20 and 0.45 at the decimal point',
            ),
            feedback: T(
              '十分之一加十分之一，百分之一加百分之一。',
              'Tenths combine with tenths and hundredths with hundredths.',
            ),
          },
          {
            text: T(
              '1.2 与 0.45 的最后一位对齐',
              'Align the last digits of 1.2 and 0.45',
            ),
            feedback: T(
              '这会把 2 个十分之一与 5 个百分之一放在同列，单位不同。',
              'This puts two tenths in the same column as five hundredths, mixing units.',
            ),
          },
          {
            text: T(
              '忽略小数点，直接算 12 + 45',
              'Ignore the decimal points and add 12 + 45',
            ),
            feedback: T(
              '12 与 45 不是同一大小单位的计数，必须先统一位值。',
              '12 and 45 do not count the same units; align their place values first.',
            ),
          },
        ],
        [
          T(
            '同一列应该代表同样大小的单位。',
            'A column must contain matching units.',
          ),
          T(
            '末尾添零不会改变小数的值。',
            'Appending a trailing zero does not change the value.',
          ),
        ],
        [
          T(
            '把 1.2 写成 1.20，与 0.45 对齐。',
            'Write 1.2 as 1.20 and align with 0.45.',
          ),
          T(
            '这样才是同单位相加，合计 1.65。',
            'Now matching units add to 1.65.',
          ),
        ],
      ),
      d(
        'P52-L03-Q2',
        T('1.2 + 0.45 = ?', '1.2 + 0.45 = ?'),
        '1.65',
        add,
        [
          T('把 1.2 写成 1.20。', 'Write 1.2 as 1.20.'),
          T(
            '个位 1，十分位 2+4，百分位 0+5。',
            'Ones: 1; tenths: 2+4; hundredths: 0+5.',
          ),
        ],
        [
          T('1.20 + 0.45 = 1.65。', '1.20 + 0.45 = 1.65.'),
          T(
            '估算 1.2 + 0.5 ≈ 1.7，结果大小合理。',
            'An estimate of 1.2 + 0.5 ≈ 1.7 supports the result’s size.',
          ),
        ],
        { accepted: ['1.65', '1.650'], rejected: ['.57', '5.7', '1.245'] },
      ),
      d(
        'P52-L03-Q3',
        T('3.006 − 0.58 = ?', '3.006 − 0.58 = ?'),
        '2.426',
        subtract,
        [
          T('写成 3.006 − 0.580。', 'Write 3.006 − 0.580.'),
          T(
            '空的十分、百分位需要从左侧借位，借出的单位要换成十个下一位单位。',
            'Borrow through the empty decimal places, exchanging one unit for ten of the next smaller unit.',
          ),
        ],
        [
          T(
            '换成千分之一计数：3,006 − 580 = 2,426。',
            'Count thousandths: 3,006 − 580 = 2,426.',
          ),
          T(
            '所以差为 2.426；加回 0.580 得 3.006。',
            'The difference is 2.426; adding back 0.580 gives 3.006.',
          ),
        ],
        {
          accepted: ['2.426', '2.4260'],
          rejected: ['3.574', '2.586', '2.526'],
        },
      ),
      d(
        'P52-L03-Q4',
        T('0.095 + 0.008 = ?', '0.095 + 0.008 = ?'),
        '0.103',
        add,
        [
          T(
            '把两者都看成千分之一的个数。',
            'Count both quantities in thousandths.',
          ),
          T(
            '95 个千分之一加 8 个千分之一。',
            'Ninety-five thousandths plus eight thousandths.',
          ),
        ],
        [
          T('95 + 8 = 103 个千分之一。', '95 + 8 = 103 thousandths.'),
          T(
            '写成 0.103，需要跨越百分位进到十分位。',
            'Write 0.103, carrying through hundredths into tenths.',
          ),
        ],
        { accepted: ['0.103', '.103'], rejected: ['.0103', '.913', '.097'] },
      ),
      d(
        'P52-L03-Q5',
        T(
          '一段绳子 5 米，剪去 1.275 米。还剩多少米？',
          'A 5-metre rope has 1.275 metres cut off. How many metres remain?',
        ),
        '3.725',
        subtract,
        [
          T('把 5 写成 5.000。', 'Write 5 as 5.000.'),
          T(
            '减完后，用剩下长度加剪去长度检查。',
            'Add the remaining and cut lengths to check your subtraction.',
          ),
        ],
        [
          T(
            '5,000 − 1,275 = 3,725 个千分之一米。',
            '5,000 − 1,275 = 3,725 thousandths of a metre.',
          ),
          T(
            '剩 3.725 米；3.725 + 1.275 = 5.000。',
            '3.725 metres remain; 3.725 + 1.275 = 5.000.',
          ),
        ],
        {
          accepted: ['3.725', '3.725 m', '3.725 metres'],
          rejected: ['4.725', '3.275', '6.275', '3.725 cm'],
        },
        'm',
      ),
      reasoning(
        'P52-L03-Q6',
        T(
          '小安算 1.2 + 0.45 = 0.57，理由是“12 + 45 = 57”。错在哪里？',
          'Ari says 1.2 + 0.45 = 0.57 because 12 + 45 = 57. What is wrong?',
        ),
        add,
        T(
          '12 在这里原本计的是十分之一，45 计的是百分之一，不能直接相加。先把 1.2 变成 120 个百分之一，再加 45，得 165 个百分之一，即 1.65。可用位值列或同单位图解释。',
          'Here 12 originally counts tenths and 45 counts hundredths, so they cannot be added directly. Express 1.2 as 120 hundredths, add 45, and get 165 hundredths = 1.65. Accept aligned columns or a matching-unit model.',
        ),
        [
          T(
            '先说明两个整数 12 和 45 各在数什么单位。',
            'State which units 12 and 45 count.',
          ),
          T('1.2 等于多少个百分之一？', 'How many hundredths equal 1.2?'),
        ],
      ),
    ],
    exit: d(
      'P52-L03-X',
      T(
        '一瓶有 2.5 升水，倒出 0.875 升。还剩多少升？',
        'A bottle contains 2.5 litres. You pour out 0.875 litre. How many litres remain?',
      ),
      '1.625',
      subtract,
      [
        T('写成 2.500 − 0.875。', 'Write 2.500 − 0.875.'),
        T(
          '用相同单位计数，再检查能否加回原数。',
          'Count matching units, then check by adding back.',
        ),
      ],
      [
        T(
          '2,500 − 875 = 1,625 个千分之一升。',
          '2,500 − 875 = 1,625 thousandths of a litre.',
        ),
        T(
          '剩下 1.625 升；1.625 + 0.875 = 2.500。',
          '1.625 litres remain; 1.625 + 0.875 = 2.500.',
        ),
      ],
      {
        accepted: ['1.625', '1.625 L', '1.625 litres'],
        rejected: ['2.375', '3.375', '1.725', '1.625 m'],
      },
      'L',
    ),
    exitReason: T(
      '解释：为什么借来的一个十分之一会变成十个百分之一？',
      'Explain why one borrowed tenth becomes ten hundredths.',
    ),
    parent: {
      goal: T(
        '按相同单位操作，用换组解释进位与借位。',
        'Operate on matching units and explain carrying or borrowing through regrouping.',
      ),
      misconception: T(
        '对齐末尾数字，或借位后忘了左边的一列已减少。',
        'Aligning final digits, or forgetting the reduction in the column borrowed from.',
      ),
      prompts: [
        T('这一列是在数什么单位？', 'What unit does this column count?'),
        T(
          '结果加回去，能回到原来的数量吗？',
          'Does adding back recover the original quantity?',
        ),
      ],
      bridge: 'P52-L01',
    },
  }),
  p52Lesson({
    id: 'P52-L04',
    title: T('小数乘整数', 'Multiplying decimals by whole numbers'),
    objective: T(
      '用相同数量的重复组，解释小数乘整数与小数点位置。',
      'Use repeated equal groups to explain decimal multiplication and the product’s place value.',
    ),
    prerequisites: ['P52-L03'],
    keywords: [
      T('等组', 'equal groups'),
      T('乘积', 'product'),
      T('单位计数', 'unit counting'),
    ],
    minutes: 15,
    lab: 'decimal-multiply',
    hook: T(
      '每条丝带长 0.325 米，4 条同样长的丝带总长是多少？先估计，再把相同的组并在一起。',
      'Each ribbon is 0.325 metre long. What is the total length of four identical ribbons? Estimate first, then combine equal groups.',
    ),
    guided: d(
      'P52-L04-G',
      T('0.325 × 4 = ?', '0.325 × 4 = ?'),
      '1.3',
      multiply,
      [
        T('每组是 325 个千分之一。', 'Each group contains 325 thousandths.'),
        T(
          '先算 325 × 4，最后保留千分之一这个单位。',
          'Calculate 325 × 4, then retain the thousandth unit.',
        ),
      ],
      [
        T('325 × 4 = 1,300 个千分之一。', '325 × 4 = 1,300 thousandths.'),
        T('1,300/1,000 = 1.300 = 1.3。', '1,300/1,000 = 1.300 = 1.3.'),
      ],
      { accepted: ['1.3', '1.30', '1.300'], rejected: ['.13', '13', '.3254'] },
    ),
    questions: [
      choice(
        'P52-L04-Q1',
        T(
          '0.12 × 3 的数量意义是什么？',
          'What quantity does 0.12 × 3 represent?',
        ),
        1,
        multiply,
        [
          {
            text: T('0.12 + 3', '0.12 + 3'),
            feedback: T(
              '不是把 3 当成另一种数量相加；它表示组数。',
              'The 3 is a number of groups, not another amount to add.',
            ),
          },
          {
            text: T('三个相同的 0.12 相加', 'Three equal groups of 0.12 added'),
            feedback: T(
              '每组 0.12，共 3 组。',
              'Each group is 0.12; there are three groups.',
            ),
          },
          {
            text: T('把 0.12 分成 3 份', 'Share 0.12 among three groups'),
            feedback: T(
              '平均分是除法，不是这里的重复组乘法。',
              'Equal sharing is division, not repeated-group multiplication.',
            ),
          },
        ],
        [
          T(
            '先说“每组多少”和“有几组”。',
            'Identify the amount per group and the group count.',
          ),
          T(
            '乘整数可以先想成重复加相同数量。',
            'Multiplying by a whole number can be modelled as repeated addition.',
          ),
        ],
        [
          T(
            '0.12 × 3 = 0.12 + 0.12 + 0.12。',
            '0.12 × 3 = 0.12 + 0.12 + 0.12.',
          ),
          T('共 0.36。', 'The total is 0.36.'),
        ],
      ),
      d(
        'P52-L04-Q2',
        T('1.25 × 6 = ?', '1.25 × 6 = ?'),
        '7.5',
        multiply,
        [
          T('1.25 是 125 个百分之一。', '1.25 is 125 hundredths.'),
          T(
            '六组共 125 × 6 个百分之一。',
            'Six groups contain 125 × 6 hundredths.',
          ),
        ],
        [
          T('125 × 6 = 750。', '125 × 6 = 750.'),
          T('750 个百分之一 = 7.50 = 7.5。', '750 hundredths = 7.50 = 7.5.'),
        ],
        {
          accepted: ['7.5', '7.50', '7.500'],
          rejected: ['.75', '75', '1.256'],
        },
      ),
      d(
        'P52-L04-Q3',
        T('0.048 × 5 = ?', '0.048 × 5 = ?'),
        '0.24',
        multiply,
        [
          T('每组 48 个千分之一。', 'Each group contains 48 thousandths.'),
          T('五组为 240 个千分之一。', 'Five groups contain 240 thousandths.'),
        ],
        [
          T('48 × 5 = 240。', '48 × 5 = 240.'),
          T('240/1,000 = 0.240 = 0.24。', '240/1,000 = 0.240 = 0.24.'),
        ],
        {
          accepted: ['.24', '0.24', '0.240'],
          rejected: ['.024', '2.4', '.0485'],
        },
      ),
      d(
        'P52-L04-Q4',
        T('2.306 × 0 = ?', '2.306 × 0 = ?'),
        '0',
        multiply,
        [
          T('零组表示没有任何一组。', 'Zero groups means there are no groups.'),
          T(
            '总量不是原来的一组。',
            'The total is not the amount in one original group.',
          ),
        ],
        [
          T(
            '每组再多，零组的总量仍为 0。',
            'Whatever the amount per group, zero groups total zero.',
          ),
          T('所以 2.306 × 0 = 0。', 'Thus 2.306 × 0 = 0.'),
        ],
        { accepted: ['0', '0.0', '0.000'], rejected: ['2.306', '1', '.2306'] },
      ),
      d(
        'P52-L04-Q5',
        T(
          '每段步道 0.375 km，走 8 段一样长的路，合计多少 km？写数值。',
          'Eight equal trail segments are each 0.375 km long. What is their total in km? Write the numerical value.',
        ),
        '3',
        multiply,
        [
          T(
            '每段 375 个千分之一千米。',
            'Each segment is 375 thousandths of a kilometre.',
          ),
          T(
            '合计 375 × 8 个千分之一千米。',
            'The total is 375 × 8 thousandths of a kilometre.',
          ),
        ],
        [
          T('375 × 8 = 3,000。', '375 × 8 = 3,000.'),
          T(
            '3,000 个千分之一千米 = 3.000 km = 3 km。',
            '3,000 thousandths of a kilometre = 3.000 km = 3 km.',
          ),
        ],
        {
          accepted: ['3', '3.0', '3.000', '3 km'],
          rejected: ['.3', '30', '3.75', '3 m'],
        },
        'km',
      ),
      reasoning(
        'P52-L04-Q6',
        T(
          '“0.6 × 4 = 0.24，因为 6 × 4 = 24，小数点随便放前面。”解释怎么确定位置。',
          '“0.6 × 4 = 0.24 because 6 × 4 = 24, and I put a decimal point in front.” Explain how to determine its place.',
        ),
        multiply,
        T(
          '6 计的是十分之一，四组为 24 个十分之一，即 2.4；不能把单位从十分之一变成百分之一。也可用 0.6 四次相加或估算大于 2 来检查。',
          'The 6 counts tenths; four groups contain 24 tenths = 2.4. The unit cannot change from tenths to hundredths. Repeated addition of 0.6 or an estimate above 2 is also valid.',
        ),
        [
          T('6 在这里表示 6 个什么单位？', 'Which units does the 6 count?'),
          T(
            '四组相加，会比一组更大还是更小？',
            'Would four groups total more or less than one group?',
          ),
        ],
      ),
    ],
    exit: d(
      'P52-L04-X',
      T(
        '一次烘焙要 0.125 升牛奶，做 4 次一样的配方，共要多少升？',
        'One baking batch needs 0.125 litre of milk. How many litres are needed for four identical batches?',
      ),
      '0.5',
      multiply,
      [
        T(
          '每批 125 个千分之一升。',
          'Each batch needs 125 thousandths of a litre.',
        ),
        T('四批的数量是 125 × 4。', 'Four batches need 125 × 4.'),
      ],
      [
        T(
          '125 × 4 = 500 个千分之一升。',
          '125 × 4 = 500 thousandths of a litre.',
        ),
        T('总量 0.500 升 = 0.5 升。', 'The total is 0.500 litre = 0.5 litre.'),
      ],
      {
        accepted: ['.5', '0.50', '0.500 L', '0.5 litre'],
        rejected: ['.05', '5', '.125', '0.5 m'],
      },
      'L',
    ),
    exitReason: T(
      '解释：计算中的 500 是 500 个什么单位，为什么不是 500 升？',
      'Explain which units the 500 counts and why it does not mean 500 litres.',
    ),
    parent: {
      goal: T(
        '整数乘法不改变原来的计数单位，组数和每组量要区分。',
        'Whole-number multiplication preserves the counted unit; distinguish group count from amount per group.',
      ),
      misconception: T(
        '只背小数点移动，忘记乘积的单位与合理大小。',
        'Placing the decimal point by memory without checking units and reasonable magnitude.',
      ),
      prompts: [
        T('相同的量一共有几组？', 'How many equal groups are there?'),
        T(
          '如果写成加法，能检查这个乘积吗？',
          'Can repeated addition check this product?',
        ),
      ],
      bridge: 'P52-L03',
    },
  }),
  p52Lesson({
    id: 'P52-L05',
    title: T('小数除整数', 'Dividing decimals by whole numbers'),
    objective: T(
      '用等份分享解释小数除整数，保留相同的计量单位。',
      'Explain decimal division as equal sharing while retaining the measurement unit.',
    ),
    prerequisites: ['P52-L04'],
    keywords: [
      T('平均分', 'equal sharing'),
      T('每份', 'per share'),
      T('精确值', 'exact value'),
    ],
    minutes: 15,
    lab: 'decimal-divide',
    hook: T(
      '1.5 升果汁分进 4 个同样的杯子，每杯多少？如果改成 3 杯，会不会更少？先猜，再按等份分。',
      'Share 1.5 litres of juice equally among four cups. How much in each? Would sharing among three cups give less per cup? Predict, then share equally.',
    ),
    guided: d(
      'P52-L05-G',
      T('1.5 ÷ 4 = ? 用小数表示。', 'Calculate 1.5 ÷ 4 as a decimal.'),
      '0.375',
      divide,
      [
        T(
          '1.5 = 1.500，也就是 1,500 个千分之一。',
          '1.5 = 1.500, or 1,500 thousandths.',
        ),
        T(
          '把 1,500 个相同小单位分成 4 份。',
          'Share 1,500 matching small units among four groups.',
        ),
      ],
      [
        T('1,500 ÷ 4 = 375。', '1,500 ÷ 4 = 375.'),
        T(
          '每份 375 个千分之一 = 0.375；乘回 4 得 1.500。',
          'Each share is 375 thousandths = 0.375; multiplying by 4 recovers 1.500.',
        ),
      ],
      {
        accepted: ['.375', '0.375', '0.3750'],
        rejected: ['.0375', '3.75', '1.54'],
      },
    ),
    questions: [
      choice(
        'P52-L05-Q1',
        T(
          '把固定的 2.4 升果汁平均分，从 3 人改成 6 人，每人所得的量如何变化？',
          'For a fixed 2.4 litres, change from three equal shares to six. What happens to each share?',
        ),
        1,
        divide,
        [
          {
            text: T('变成原来的两倍', 'It doubles'),
            feedback: T(
              '总量没变，人数多一倍，不是总量多一倍。',
              'The total stays fixed; the number of recipients doubles, not the amount.',
            ),
          },
          {
            text: T('变成原来的一半', 'It halves'),
            feedback: T(
              '份数翻倍，每份只有原来的一半。',
              'Doubling the share count halves each share.',
            ),
          },
          {
            text: T('完全不变', 'It stays unchanged'),
            feedback: T(
              '若每人一样多，总量固定时份数会影响每份量。',
              'With fixed total and equal shares, the share count affects the amount per share.',
            ),
          },
        ],
        [
          T(
            '先区分固定总量和变动份数。',
            'Distinguish the fixed total from the changing share count.',
          ),
          T('用 2.4÷3 与 2.4÷6 比较。', 'Compare 2.4÷3 and 2.4÷6.'),
        ],
        [
          T(
            '原来每人 0.8 升，后来每人 0.4 升。',
            'Initially each gets 0.8 litre; later each gets 0.4 litre.',
          ),
          T('0.4 是 0.8 的一半。', '0.4 is half of 0.8.'),
        ],
      ),
      d(
        'P52-L05-Q2',
        T('0.96 ÷ 3 = ?', '0.96 ÷ 3 = ?'),
        '0.32',
        divide,
        [
          T('0.96 是 96 个百分之一。', '0.96 is 96 hundredths.'),
          T(
            '96 个相同小单位分 3 份。',
            'Share the 96 matching small units three ways.',
          ),
        ],
        [
          T('96 ÷ 3 = 32 个百分之一。', '96 ÷ 3 = 32 hundredths.'),
          T('每份 0.32；0.32×3 = 0.96。', 'Each share is 0.32; 0.32×3 = 0.96.'),
        ],
        {
          accepted: ['.32', '0.32', '0.320'],
          rejected: ['.032', '3.2', '.93'],
        },
      ),
      d(
        'P52-L05-Q3',
        T('1.008 ÷ 4 = ?', '1.008 ÷ 4 = ?'),
        '0.252',
        divide,
        [
          T('用千分之一计数。', 'Count in thousandths.'),
          T('1,008 ÷ 4，而不是 108 ÷ 4。', 'Use 1,008 ÷ 4, not 108 ÷ 4.'),
        ],
        [
          T('1,008 ÷ 4 = 252。', '1,008 ÷ 4 = 252.'),
          T('252 个千分之一 = 0.252。', '252 thousandths = 0.252.'),
        ],
        {
          accepted: ['.252', '0.252', '0.2520'],
          rejected: ['.027', '.0252', '2.52'],
        },
      ),
      d(
        'P52-L05-Q4',
        T('7.2 ÷ 6 = ?', '7.2 ÷ 6 = ?'),
        '1.2',
        divide,
        [
          T('7.2 是 72 个十分之一。', '7.2 is 72 tenths.'),
          T(
            '72÷6 的单位仍是十分之一。',
            'The quotient of 72÷6 still counts tenths.',
          ),
        ],
        [
          T('72 ÷ 6 = 12 个十分之一。', '72 ÷ 6 = 12 tenths.'),
          T('12 个十分之一 = 1.2。', 'Twelve tenths equal 1.2.'),
        ],
        { accepted: ['1.2', '1.20'], rejected: ['.12', '12', '.72'] },
      ),
      d(
        'P52-L05-Q5',
        T(
          '4.5 米丝带平均分成 4 段，每段多少米？',
          'Share 4.5 metres of ribbon into four equal pieces. How many metres is each?',
        ),
        '1.125',
        divide,
        [
          T(
            '写成 4.500，按千分之一米计数。',
            'Write 4.500 and count thousandths of a metre.',
          ),
          T(
            '4,500 个小单位分成 4 份。',
            'Share 4,500 small units among four groups.',
          ),
        ],
        [
          T('4,500 ÷ 4 = 1,125。', '4,500 ÷ 4 = 1,125.'),
          T(
            '每段 1.125 米；1.125×4 = 4.5。',
            'Each piece is 1.125 metres; 1.125×4 = 4.5.',
          ),
        ],
        {
          accepted: ['1.125', '1.125 m', '1.125 metres'],
          rejected: ['.1125', '11.25', '1.25', '1.125 L'],
        },
        'm',
      ),
      reasoning(
        'P52-L05-Q6',
        T(
          '“1 升平均分 3 杯，每杯精确地是 0.333 升。”准确吗？',
          '“One litre shared among three cups gives exactly 0.333 litre per cup.” Is that exact?',
        ),
        divide,
        T(
          '不精确。0.333×3 = 0.999，少 0.001 升。精确每份是 1/3 升；0.333 是显示到千分位的近似值。接受用乘回去、剩余量或分数解释，不要求掌握循环小数记号。',
          'It is not exact: 0.333×3 = 0.999, leaving 0.001 litre. The exact share is 1/3 litre; 0.333 is an approximation to thousandths. Accept multiplication back, the remainder or a fraction; recurring-decimal notation is not required.',
        ),
        [
          T('把声称的每份量乘回 3。', 'Multiply the proposed share by three.'),
          T(
            '得到的合计是不是完整的 1 升？',
            'Does the total recover the whole litre?',
          ),
        ],
      ),
    ],
    exit: d(
      'P52-L05-X',
      T(
        '一盒有 2.016 升饮料，平均装进 8 个杯子。每杯多少升？',
        'Share 2.016 litres equally among eight cups. How many litres per cup?',
      ),
      '0.252',
      divide,
      [
        T(
          '2.016 = 2,016 个千分之一升。',
          '2.016 is 2,016 thousandths of a litre.',
        ),
        T('按等份分给 8 个杯子。', 'Share equally among eight cups.'),
      ],
      [
        T('2,016 ÷ 8 = 252。', '2,016 ÷ 8 = 252.'),
        T(
          '每杯 0.252 升；8 杯合起来正好 2.016 升。',
          'Each cup has 0.252 litre; all eight total exactly 2.016 litres.',
        ),
      ],
      {
        accepted: ['.252', '0.252 L', '0.252 litres'],
        rejected: ['.0252', '2.52', '.28', '0.252 m'],
      },
      'L',
    ),
    exitReason: T(
      '解释：为什么每杯的数量乘杯数，应该能回到总量？',
      'Explain why the amount per cup multiplied by the cup count should recover the total.',
    ),
    parent: {
      goal: T(
        '平均分的是相同单位，能用乘法反向检查。',
        'Share matching units equally and check backwards using multiplication.',
      ),
      misconception: T(
        '把除数当成直接减掉的量，或把截断显示当精确答案。',
        'Subtracting the divisor as an amount, or treating a truncated display as exact.',
      ),
      prompts: [
        T(
          '每份一样多吗？各份合计是否是原总量？',
          'Are shares equal, and do they recover the original total?',
        ),
        T(
          '这个小数是精确值，还是显示到某一位的近似值？',
          'Is this decimal exact or rounded to a display precision?',
        ),
      ],
      bridge: 'P52-L04',
    },
  }),
  p52Lesson({
    id: 'P52-L06',
    title: T(
      '小数应用题：长度与价格',
      'Decimal problems with lengths and prices',
    ),
    objective: T(
      '在长度与价格情境中选对运算，保留单位并检查结果。',
      'Choose operations in length and price contexts, keep units and check results.',
    ),
    prerequisites: ['P52-L03', 'P52-L04', 'P52-L05', 'B04-L05'],
    keywords: [
      T('单位', 'unit'),
      T('数量关系', 'quantity relationship'),
      T('检查', 'check'),
    ],
    minutes: 18,
    lab: 'decimal-application',
    hook: T(
      '家里准备烘焙：每瓶牛奶 NZ$1.25，买 3 瓶，带了 NZ$5。是算 1.25+3，还是 1.25×3？先说每个数代表什么，再判断够不够。',
      'For baking, milk costs NZ$1.25 per bottle. Buy three bottles with NZ$5. Should you use 1.25+3 or 1.25×3? State what each number represents, then check the budget.',
    ),
    guided: d(
      'P52-L06-G',
      T(
        '每瓶 NZ$1.25，买 3 瓶，付款 NZ$5。找回多少元？',
        'Milk is NZ$1.25 per bottle. Buy three bottles and pay NZ$5. What is the change in dollars?',
      ),
      '1.25',
      application,
      [
        T(
          '先求总价，再求找零。',
          'Find the total price first, then the change.',
        ),
        T(
          '总价是 1.25×3，找零是 5 减总价。',
          'Total price is 1.25×3; change is 5 minus that total.',
        ),
      ],
      [
        T('1.25 × 3 = NZ$3.75。', '1.25 × 3 = NZ$3.75.'),
        T(
          '5.00 − 3.75 = NZ$1.25；总价加找零回到 5 元。',
          '5.00 − 3.75 = NZ$1.25; price plus change returns five dollars.',
        ),
      ],
      {
        accepted: ['1.25', 'NZ$1.25', '1.25 NZD'],
        rejected: ['3.75', '4.75', '1.75', '1.25 m'],
      },
      'NZD',
    ),
    questions: [
      choice(
        'P52-L06-Q1',
        T(
          '每条丝带 0.75 米，买 4 条同样长的，总长应怎样列式？',
          'Each ribbon is 0.75 metre. How do you calculate the total length of four equal ribbons?',
        ),
        0,
        application,
        [
          {
            text: T('0.75 × 4', '0.75 × 4'),
            feedback: T(
              '每条长度乘条数，得到总长度。',
              'Length per ribbon times ribbon count gives total length.',
            ),
          },
          {
            text: T('0.75 + 4', '0.75 + 4'),
            feedback: T(
              '4 是条数，不是 4 米，不能直接加到长度。',
              'Four is a count, not four metres; it cannot be added to a length.',
            ),
          },
          {
            text: T('0.75 ÷ 4', '0.75 ÷ 4'),
            feedback: T(
              '这算把一条丝带分成四段的每段长度，情境不同。',
              'This finds a share of one ribbon, a different situation.',
            ),
          },
        ],
        [
          T(
            '先区分“每份量”和“份数”。',
            'Distinguish the amount per item from the item count.',
          ),
          T(
            '总长度是四个相同长度之和。',
            'The total is the sum of four equal lengths.',
          ),
        ],
        [
          T('0.75 × 4 = 3 米。', '0.75 × 4 = 3 metres.'),
          T(
            '条数本身不带米；计算的结果才是长度。',
            'The count is not a length; the product is.',
          ),
        ],
      ),
      d(
        'P52-L06-Q2',
        T(
          '步道长 2.375 km，已走 0.85 km，还剩多少 km？写数值。',
          'A trail is 2.375 km. You have walked 0.85 km. How many kilometres remain? Write the numerical value.',
        ),
        '1.525',
        application,
        [
          T(
            '总长减去已经走的长度。',
            'Subtract the travelled length from the total.',
          ),
          T('写成 2.375 − 0.850。', 'Write 2.375 − 0.850.'),
        ],
        [
          T(
            '2,375 − 850 = 1,525 个千分之一千米。',
            '2,375 − 850 = 1,525 thousandths of a kilometre.',
          ),
          T(
            '剩 1.525 km；1.525 + 0.850 = 2.375。',
            '1.525 km remain; 1.525 + 0.850 = 2.375.',
          ),
        ],
        {
          accepted: ['1.525', '1.5250', '1.525 km'],
          rejected: ['3.225', '1.625', '.1525', '1.525 m'],
        },
        'km',
      ),
      d(
        'P52-L06-Q3',
        T(
          'NZ$4.80 平均买到 4 支同价铅笔，每支多少元？',
          'Four equally priced pencils cost NZ$4.80. What is the price per pencil in dollars?',
        ),
        '1.2',
        application,
        [
          T(
            '已知总价与数量，求每支价用除法。',
            'Divide total price by count to find the price per item.',
          ),
          T(
            '把 480 分平均分成 4 份。',
            'Share 480 cents into four equal amounts.',
          ),
        ],
        [
          T('480 ÷ 4 = 120 分。', '480 ÷ 4 = 120 cents.'),
          T('120 分 = NZ$1.20。', '120 cents = NZ$1.20.'),
        ],
        {
          accepted: ['1.2', '1.20', 'NZ$1.20'],
          rejected: ['.12', '19.2', '4.76', '1.2 L'],
        },
        'NZD',
      ),
      d(
        'P52-L06-Q4',
        T(
          '一块布长 4 米，剪出 3 条各 0.85 米的布条，还剩多少米？',
          'From 4 metres of fabric, cut three strips of 0.85 metre each. How many metres remain?',
        ),
        '1.45',
        application,
        [
          T(
            '先合计三条用了多长。',
            'First total the length of the three strips.',
          ),
          T(
            '0.85×3 = 2.55，再从 4 中减去。',
            '0.85×3 = 2.55; subtract that from four.',
          ),
        ],
        [
          T('3 条共 2.55 米。', 'The three strips total 2.55 metres.'),
          T('4.00 − 2.55 = 1.45 米。', '4.00 − 2.55 = 1.45 metres.'),
        ],
        {
          accepted: ['1.45', '1.450 m', '1.45 metres'],
          rejected: ['3.15', '.45', '2.55', '1.45 cm'],
        },
        'm',
      ),
      d(
        'P52-L06-Q5',
        T(
          '一本本子 NZ$2.35，一支笔 NZ$1.20，付款 NZ$5。找回多少元？',
          'A notebook costs NZ$2.35 and a pen NZ$1.20. You pay NZ$5. How many dollars in change?',
        ),
        '1.45',
        application,
        [
          T(
            '两个不同商品先相加，不是相乘。',
            'Add the prices of the two different items.',
          ),
          T(
            '总价 2.35+1.20；找零用 5 减总价。',
            'Total: 2.35+1.20; subtract that from five for change.',
          ),
        ],
        [
          T('2.35 + 1.20 = NZ$3.55。', '2.35 + 1.20 = NZ$3.55.'),
          T(
            '5.00 − 3.55 = NZ$1.45；3.55+1.45=5.00。',
            '5.00 − 3.55 = NZ$1.45; 3.55+1.45=5.00.',
          ),
        ],
        {
          accepted: ['1.45', 'NZ$1.45', '1.45 dollars'],
          rejected: ['3.55', '2.82', '1.55', '1.45 m'],
        },
        'NZD',
      ),
      reasoning(
        'P52-L06-Q6',
        T(
          '“每瓶 0.5 升，买 3 瓶，因此 0.5+3=3.5 升。”指出单位与数量关系的问题。',
          '“Each bottle holds 0.5 litre. Three bottles mean 0.5+3=3.5 litres.” Explain the unit and relationship error.',
        ),
        application,
        T(
          '3 是瓶数，不是 3 升；总量应是三组 0.5 升，即 0.5×3=1.5 升。可画三瓶或说明数量×每瓶容量。单位不同的量不能直接相加。',
          'Three is a bottle count, not three litres. Total volume is three groups of 0.5 litre: 0.5×3=1.5 litres. Accept a drawing of three bottles or count times volume per bottle. Quantities with different units cannot be added directly.',
        ),
        [
          T('0.5 和 3 的单位分别是什么？', 'What units belong to 0.5 and 3?'),
          T(
            '如果画出三瓶，每瓶装多少？',
            'Draw three bottles: how much is in each?',
          ),
        ],
      ),
    ],
    exit: d(
      'P52-L06-X',
      T(
        '每条丝带 NZ$0.85，买 4 条，付款 NZ$5。找零多少元？',
        'Ribbons cost NZ$0.85 each. Buy four and pay NZ$5. What is the change in dollars?',
      ),
      '1.6',
      application,
      [
        T(
          '先乘得到四条的总价。',
          'Multiply to find the total price of four ribbons.',
        ),
        T(
          '再用付款减总价，并检查能否加回付款。',
          'Subtract from the payment, then check by adding back.',
        ),
      ],
      [
        T('0.85×4 = NZ$3.40。', '0.85×4 = NZ$3.40.'),
        T(
          '5.00−3.40 = NZ$1.60；3.40+1.60=5.00。',
          '5.00−3.40 = NZ$1.60; 3.40+1.60=5.00.',
        ),
      ],
      {
        accepted: ['1.6', '1.60', 'NZ$1.60'],
        rejected: ['3.4', '4.15', '1.4', '1.6 m'],
      },
      'NZD',
    ),
    exitReason: T(
      '解释：为什么先乘后减？每一步的结果各有什么单位？',
      'Explain why you multiply before subtracting and state each result’s unit.',
    ),
    familyChallenge: T(
      '家庭挑战：用三种家里已有物品的价格或自拟价格，在 NZ$10 的假想预算内组合一次采购。先估算再精算，记录每件数量、单价、合计与余额；再用一条绳子做平均分长度检查。不需要真实付款，不计分。',
      'Family challenge: choose prices for three things at home, or invent prices, and plan a purchase within an imaginary NZ$10 budget. Estimate before calculating; record counts, unit prices, total and balance. Also check equal lengths using a piece of string. No purchase needed and no score.',
    ),
    parent: {
      goal: T(
        '先辨认总量、每份量、份数和单位，再选运算并反向检查。',
        'Identify total, amount per item, count and units before choosing operations and checking backwards.',
      ),
      misconception: T(
        '见到数字就随意相加，或把总价当找零、把份数当长度。',
        'Adding numbers without reading their roles, confusing total price with change, or treating a count as a length.',
      ),
      prompts: [
        T(
          '这个数代表总量、每份量还是份数？',
          'Does this number represent a total, amount per item or count?',
        ),
        T(
          '把答案代回情境，单位和大小合理吗？',
          'Do the units and size make sense when the answer is put back into the situation?',
        ),
      ],
      bridge: 'P52-L03',
    },
  }),
];

export const p52CheckQuestions: Question[] = [
  d(
    'P52-CHECK-Q1',
    T(
      '5 个十分之一、2 个千分之一，合起来用小数表示。',
      'Write five tenths and two thousandths together as a decimal.',
    ),
    '0.502',
    place,
    [
      T('百分位为 0。', 'Hundredths is zero.'),
      T('500 + 2 个千分之一。', '500 plus two thousandths.'),
    ],
    [T('502 个千分之一 = 0.502。', '502 thousandths = 0.502.')],
    { accepted: ['.502', '0.502'], rejected: ['.52', '.052', '502'] },
  ),
  d(
    'P52-CHECK-Q2',
    T(
      '0.6、0.606、0.66 中哪个最大？',
      'Which is greatest: 0.6, 0.606 or 0.66?',
    ),
    '0.66',
    compare,
    [
      T(
        '统一写成 0.600、0.606、0.660。',
        'Write them as 0.600, 0.606 and 0.660.',
      ),
      T('十分位相同，比较百分位。', 'Tenths match; compare hundredths.'),
    ],
    [
      T(
        '0.660 的百分位最大，所以最大是 0.66。',
        '0.660 has the greatest hundredths digit, so 0.66 is greatest.',
      ),
    ],
    { accepted: ['.66', '.660', '0.66'], rejected: ['.606', '.6', '66'] },
  ),
  d(
    'P52-CHECK-Q3',
    T(
      '把 2.995 四舍五入到最近的百分之一，正好一半向上。',
      'Round 2.995 to the nearest hundredth, taking the upper neighbour for a halfway tie.',
    ),
    '3',
    compare,
    [
      T('相邻值是 2.99 和 3.00。', 'The neighbours are 2.99 and 3.00.'),
      T('连续进位到整数部分。', 'Carrying crosses into the whole-number part.'),
    ],
    [
      T(
        '正好中点，按约定取 3.00。',
        'At the midpoint, the convention gives 3.00.',
      ),
    ],
    { accepted: ['3', '3.0', '3.00'], rejected: ['2.99', '2.100', '2.9'] },
  ),
  d(
    'P52-CHECK-Q4',
    T('4.008 − 1.25 = ?', '4.008 − 1.25 = ?'),
    '2.758',
    subtract,
    [
      T('写成 4.008 − 1.250。', 'Write 4.008 − 1.250.'),
      T(
        '按千分之一计数，注意连续借位。',
        'Count in thousandths and track successive borrowing.',
      ),
    ],
    [
      T(
        '4,008 − 1,250 = 2,758 个千分之一，即 2.758。',
        '4,008 − 1,250 = 2,758 thousandths, or 2.758.',
      ),
    ],
    { accepted: ['2.758', '2.7580'], rejected: ['3.758', '2.858', '5.258'] },
  ),
  d(
    'P52-CHECK-Q5',
    T('0.075 × 8 = ?', '0.075 × 8 = ?'),
    '0.6',
    multiply,
    [
      T('每组 75 个千分之一。', 'Each group is 75 thousandths.'),
      T('75×8 = 600 个千分之一。', '75×8 is 600 thousandths.'),
    ],
    [T('600 个千分之一 = 0.600 = 0.6。', '600 thousandths = 0.600 = 0.6.')],
    { accepted: ['.6', '.600', '0.6'], rejected: ['.06', '6', '.0758'] },
  ),
  d(
    'P52-CHECK-Q6',
    T(
      '3.6 升平均分进 8 杯，每杯多少升？',
      'Share 3.6 litres equally among eight cups. How many litres per cup?',
    ),
    '0.45',
    divide,
    [
      T('可把 3.6 看成 360 个百分之一。', 'Use 360 hundredths for 3.6.'),
      T('360÷8 = 45 个百分之一。', '360÷8 is 45 hundredths.'),
    ],
    [T('每杯 0.45 升；0.45×8=3.6。', 'Each cup gets 0.45 litre; 0.45×8=3.6.')],
    {
      accepted: ['.45', '0.45 L', '0.450 litres'],
      rejected: ['.045', '4.5', '2.8', '0.45 m'],
    },
    'L',
  ),
  d(
    'P52-CHECK-Q7',
    T(
      '每支笔 NZ$1.35，买 4 支，付款 NZ$10，找回多少元？',
      'Pens cost NZ$1.35 each. Buy four and pay NZ$10. How many dollars in change?',
    ),
    '4.6',
    application,
    [
      T('总价是 1.35×4。', 'Total price is 1.35×4.'),
      T(
        '付款减总价，不是减单价。',
        'Subtract the total from the payment, not just one unit price.',
      ),
    ],
    [T('1.35×4=5.40；10−5.40=NZ$4.60。', '1.35×4=5.40; 10−5.40=NZ$4.60.')],
    {
      accepted: ['4.6', '4.60', 'NZ$4.60'],
      rejected: ['5.4', '8.65', '4.4', '4.6 m'],
    },
    'NZD',
  ),
  reasoning(
    'P52-CHECK-Q8',
    T(
      '同学把 0.25×4=1 与 1÷3≈0.333 都写成“精确等于”。用检查方法指出哪一个需要改。',
      'A learner calls both 0.25×4=1 and 1÷3≈0.333 exact equalities. Use a check to identify which needs changing.',
    ),
    divide,
    T(
      '第一式精确：四个四分之一合成 1，或 0.25×4=1.00。第二式显示值不精确，0.333×3=0.999；应保留约等号，精确值为 1/3。要指出近似不是错误计算，但不能冒充精确相等。',
      'The first is exact: four quarters make one, or 0.25×4=1.00. The second display is approximate: 0.333×3=0.999. Keep the approximate sign; the exact share is 1/3. An approximation is useful, but must not be presented as exact equality.',
    ),
    [
      T(
        '把两个结果分别乘回或加回去。',
        'Check each result by multiplication or addition back.',
      ),
      T(
        '哪一个能精确恢复原来的总量？',
        'Which exactly recovers its original total?',
      ),
    ],
  ),
];
export function p52ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Review round must be a non-negative integer');
  const k = round % 80,
    qid = `${id}-R${round}`;
  const question = (
    stem: ReturnType<typeof T>,
    milli: number,
    skill: string,
    hint: ReturnType<typeof T>,
    steps: ReturnType<typeof T>[],
    wrong: number,
    unit?: 'NZD' | 'm' | 'L',
  ) =>
    d(
      qid,
      stem,
      formatMilli(milli, true),
      skill,
      [
        hint,
        T(
          '先辨认单位与数量关系，再反向检查。',
          'Identify units and relationships, then check backwards.',
        ),
      ],
      steps,
      {
        accepted: [formatMilli(milli), formatMilli(milli, true)],
        rejected: [formatMilli(wrong)],
      },
      unit,
    );
  if (id === 'P52-L01') {
    const tenths = 1 + (k % 8),
      thousandths = 1 + (Math.floor(k / 8) % 9),
      result = tenths * 100 + thousandths;
    return question(
      T(
        `${tenths} 个十分之一和 ${thousandths} 个千分之一，用小数表示。`,
        `Write ${tenths} tenths and ${thousandths} thousandths as a decimal.`,
      ),
      result,
      place,
      T('百分位仍为 0。', 'Hundredths is still zero.'),
      [
        T(
          `${tenths * 100}+${thousandths}=${result} 个千分之一。`,
          `${tenths * 100}+${thousandths}=${result} thousandths.`,
        ),
      ],
      tenths * 100 + thousandths * 10,
    );
  }
  if (id === 'P52-L02') {
    if (k % 2) {
      const a = 500 + 5 * k,
        b = a + 40,
        c = a + 7;
      return question(
        T(
          `找出最大的数：${formatMilli(a, true)}、${formatMilli(b, true)}、${formatMilli(c)}。`,
          `Find the greatest value: ${formatMilli(a, true)}, ${formatMilli(b, true)}, ${formatMilli(c)}.`,
        ),
        b,
        compare,
        T(
          '小数点对齐，从第一次不同的高位判断。',
          'Align decimal points and inspect the first differing higher place.',
        ),
        [
          T(
            `换成千分之一，${a} < ${c} < ${b}；位数长短不是大小依据。`,
            `In thousandths, ${a} < ${c} < ${b}; digit length does not decide size.`,
          ),
        ],
        c,
      );
    }
    const raw = 1055 + 10 * k,
      result = roundMilli(raw, 2);
    return question(
      T(
        `把 ${formatMilli(raw)} 四舍五入到最近的百分之一，中点向上。`,
        `Round ${formatMilli(raw)} to the nearest hundredth, taking halfway ties up.`,
      ),
      result,
      compare,
      T(
        '千分位为 5，正好在中点。',
        'The thousandths digit is five: a halfway tie.',
      ),
      [
        T(
          `相邻值 ${formatMilli(result - 10)} 与 ${formatMilli(result)}，应取上边。`,
          `Choose the upper of neighbours ${formatMilli(result - 10)} and ${formatMilli(result)}.`,
        ),
      ],
      result - 10,
    );
  }
  if (id === 'P52-L03') {
    const a = 2306 + 10 * k,
      b = 580,
      addition = k % 2 === 1,
      sign = addition ? '+' : '−',
      result = addition ? a + b : a - b;
    return question(
      T(
        `${formatMilli(a)} ${sign} ${formatMilli(b)} = ?`,
        `${formatMilli(a)} ${sign} ${formatMilli(b)} = ?`,
      ),
      result,
      addition ? add : subtract,
      T('两者都按千分之一计数。', 'Count both in thousandths.'),
      [
        T(
          `${a}${sign}${b}=${result} 个千分之一。`,
          `${a}${sign}${b}=${result} thousandths.`,
        ),
      ],
      addition ? a - b : a + b,
    );
  }
  if (id === 'P52-L04') {
    const amount = 125 + 5 * k,
      count = 2 + (k % 5),
      result = amount * count;
    return question(
      T(
        `${formatMilli(amount)} × ${count} = ?`,
        `${formatMilli(amount)} × ${count} = ?`,
      ),
      result,
      multiply,
      T(
        '每组的千分之一数乘组数。',
        'Multiply thousandths per group by the group count.',
      ),
      [
        T(
          `${amount}×${count}=${result} 个千分之一。`,
          `${amount}×${count}=${result} thousandths.`,
        ),
      ],
      Math.floor(result / 10),
    );
  }
  if (id === 'P52-L05') {
    const share = 125 + 5 * k,
      groups = 2 + (k % 5),
      total = share * groups;
    return question(
      T(
        `${formatMilli(total)} ÷ ${groups} = ?`,
        `${formatMilli(total)} ÷ ${groups} = ?`,
      ),
      share,
      divide,
      T('把总量的千分之一数平均分。', 'Share the total thousandths equally.'),
      [
        T(
          `${total}÷${groups}=${share} 个千分之一。`,
          `${total}÷${groups}=${share} thousandths.`,
        ),
      ],
      share * 10,
    );
  }
  if (id === 'P52-L06') {
    if (k % 2) {
      const amount = 125 + 5 * k,
        count = 2 + (k % 3),
        used = amount * count;
      return question(
        T(
          `有 4 米布，剪出 ${count} 条各 ${formatMilli(amount)} 米的布条，剩多少米？`,
          `Start with four metres of fabric and cut ${count} strips of ${formatMilli(amount)} metre. How many metres remain?`,
        ),
        4000 - used,
        application,
        T(
          '先算用去的总长，再从 4 米中减去。',
          'Calculate total used length, then subtract it from four metres.',
        ),
        [
          T(
            `${amount}×${count}=${used} 个千分之一米；4,000−${used}=${4000 - used} 个千分之一米。`,
            `${amount}×${count}=${used} thousandths of a metre; 4,000−${used}=${4000 - used} thousandths of a metre.`,
          ),
        ],
        used,
        'm',
      );
    }
    const cents = 85 + 5 * k,
      count = 2 + (k % 3),
      budget = 2000,
      total = cents * count,
      change = budget - total;
    return question(
      T(
        `每本 NZ$${(cents / 100).toFixed(2)}，买 ${count} 本，付 NZ$20，找零多少元？`,
        `Each notebook costs NZ$${(cents / 100).toFixed(2)}. Buy ${count}, pay NZ$20. What is the change in dollars?`,
      ),
      change * 10,
      application,
      T(
        '先乘总价，再从付款中减去。',
        'Multiply for the total, then subtract it from the payment.',
      ),
      [
        T(
          `总价 ${total} 分，找零 ${budget}−${total}=${change} 分。`,
          `Total price is ${total} cents; change is ${budget}−${total}=${change} cents.`,
        ),
      ],
      total * 10,
      'NZD',
    );
  }
  throw new Error(`Unknown P52 lesson ${id}`);
}
