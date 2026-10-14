import { t as T, type Lesson, type Question } from '../model';
import { b03Lesson, numeric, choice, reasoning } from './builders';
const regroup = 'whole-regroup',
  split = 'multiplication-decompose',
  area = 'two-digit-area',
  division = 'long-division-place',
  estimate = 'estimate-check';
type Pair = [string, string];
const text = (p: Pair) => T(...p);
function q(
  id: string,
  stem: Pair,
  value: number,
  skill: string,
  hints: [Pair, Pair],
  steps: Pair[],
  wrong: string[],
  unit?: 'm' | 'cm²' | 'NZD',
  diagram?: Question['diagram'],
) {
  const item = numeric(
    id,
    text(stem),
    String(value),
    skill,
    hints.map(text),
    steps.map(text),
    {
      accepted: [
        String(value),
        `${value}.0`,
        ...(unit ? [`${value} ${unit}`] : []),
      ],
      rejected: wrong,
    },
    diagram,
  );
  if (unit) {
    item.answer = { kind: 'number', value: String(value), unit };
    item.type = 'word_problem';
    item.difficulty = 'transfer';
  }
  return item;
}
function c(
  id: string,
  stem: Pair,
  correct: number,
  skill: string,
  options: { label: Pair; feedback: Pair }[],
  hints: [Pair, Pair],
  steps: Pair[],
) {
  return choice(
    id,
    text(stem),
    correct,
    skill,
    options.map((o) => ({ text: text(o.label), feedback: text(o.feedback) })),
    hints.map(text),
    steps.map(text),
  );
}
function r(
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) {
  return reasoning(id, text(stem), skill, text(rubric), hints.map(text));
}
export const b03Lessons: Lesson[] = [
  b03Lesson({
    id: 'B03-L01',
    title: T('进位加法与退位减法', 'Regrouping in addition and subtraction'),
    objective: T(
      '用位值换组解释进位与退位，并在零占位时保留数量。',
      'Explain carrying and borrowing through place-value exchanges, retaining quantity across zero placeholders.',
    ),
    prerequisites: ['B01-L05', 'B02-L01'],
    keywords: [
      T('同位对齐', 'place alignment'),
      T('换组', 'regrouping'),
      T('零占位', 'zero placeholders'),
    ],
    minutes: 18,
    lab: 'calculation-regroup',
    hook: T(
      '408 的十位是零，要减去 179。没有十就无法减了吗？一次换组怎样穿过零？',
      'The tens digit in 408 is zero. Can you still subtract 179? How does an exchange cross the zero place?',
    ),
    guided: q(
      'B03-L01-G',
      [
        '268+157 等于多少？先按个位、十位、百位计算。',
        'Find 268+157, working through ones, tens and hundreds.',
      ],
      425,
      regroup,
      [
        ['8+7 有多少个一？', 'How many ones are 8+7?'],
        [
          '十个一换成一个十；十位还要计入这一个十。',
          'Exchange ten ones for one ten; include it in the tens column.',
        ],
      ],
      [
        [
          '8+7=15，写 5 个一、进 1 个十。',
          '8+7=15: write five ones and carry one ten.',
        ],
        [
          '6+5+1=12 个十；2+1+1=4 个百，合计 425。',
          '6+5+1=12 tens; 2+1+1=4 hundreds, giving 425.',
        ],
      ],
      ['415', '315', '325'],
    ),
    questions: [
      c(
        'B03-L01-Q1',
        [
          '个位 8+7=15，向十位进的“1”表示什么？',
          'When 8+7=15 in the ones column, what does the carried 1 mean?',
        ],
        1,
        regroup,
        [
          {
            label: ['一个一', 'One one'],
            feedback: [
              '换到十位的记号计十，不再计一。',
              'A mark in the tens column counts tens, not ones.',
            ],
          },
          {
            label: ['一个十', 'One ten'],
            feedback: [
              '十五个一换成一个十与五个一。',
              'Fifteen ones become one ten and five ones.',
            ],
          },
          {
            label: ['一个百', 'One hundred'],
            feedback: [
              '当前只换出了十个一，不是一百个一。',
              'The exchange uses ten ones, not a hundred.',
            ],
          },
        ],
        [
          ['记号写在哪一列？', 'Which column receives the mark?'],
          ['十个一等于什么更大单位？', 'What larger unit equals ten ones?'],
        ],
        [['15 个一=1 个十+5 个一。', '15 ones=1 ten+5 ones.']],
      ),
      q(
        'B03-L01-Q2',
        ['408−179 等于多少？', 'Find 408−179.'],
        229,
        regroup,
        [
          [
            '个位八个不够减九个。',
            'Eight ones are not enough to subtract nine.',
          ],
          [
            '从四个百中换一个百，再从十个十中换一个十。',
            'Exchange one of four hundreds into tens, then one ten into ones.',
          ],
        ],
        [
          ['408=3 个百+9 个十+18 个一。', '408=3 hundreds+9 tens+18 ones.'],
          [
            '18−9=9；9−7=2；3−1=2，得到 229。',
            '18−9=9; 9−7=2; 3−1=2, giving 229.',
          ],
        ],
        ['371', '329', '239'],
      ),
      q(
        'B03-L01-Q3',
        ['1000−1 等于多少？', 'Find 1000−1.'],
        999,
        regroup,
        [
          [
            '一次换组会经过百位与十位的零。',
            'The exchange passes through zero hundreds and tens.',
          ],
          [
            '换组后可写 9 个百、9 个十与 10 个一。',
            'After exchanging, use nine hundreds, nine tens and ten ones.',
          ],
        ],
        [
          [
            '1000=900+90+10，减一个一得到 999。',
            '1000=900+90+10; removing one one gives 999.',
          ],
          ['999+1=1000 检查。', 'Check 999+1=1000.'],
        ],
        ['1001', '909', '990'],
      ),
      q(
        'B03-L01-Q4',
        ['999+1 等于多少？', 'Find 999+1.'],
        1000,
        regroup,
        [
          ['个位十个一需要换组。', 'Ten ones need regrouping.'],
          [
            '这个进位也会继续穿过十位与百位。',
            'The carry continues through tens and hundreds.',
          ],
        ],
        [
          [
            '十个一换一个十，十个十换一个百，十个百换一个千。',
            'Ten ones become a ten, ten tens a hundred, and ten hundreds a thousand.',
          ],
          ['保留最左边的进位，结果 1000。', 'Keep the leftmost carry: 1000.'],
        ],
        ['990', '0', '100'],
      ),
      q(
        'B03-L01-Q5',
        [
          '书架原有 126 本书，新放入 287 本，共有几本？',
          'A shelf has 126 books and receives 287 more. How many altogether?',
        ],
        413,
        regroup,
        [
          ['两个部分合成总量。', 'The two parts combine into a total.'],
          [
            '个位与十位都要计入换组。',
            'Both ones and tens require regrouping.',
          ],
        ],
        [
          [
            '126+287=413 本；413−287=126 检查。',
            '126+287=413 books; check 413−287=126.',
          ],
        ],
        ['403', '303', '161'],
      ),
      r(
        'B03-L01-Q6',
        [
          '同学把 408−179 算成 371：每列都用大数字减小数字。为什么不成立？',
          'A learner gets 371 for 408−179 by subtracting the smaller digit from the larger in every column. Why is this invalid?',
        ],
        regroup,
        [
          '减法有固定的被减数与减数，不能逐列倒转关系。408 换成 3 百、9 十、18 一，减 1 百、7 十、9 一，得 229。用 229+179=408 检查；371+179 不恢复原量。',
          'The minuend and subtrahend cannot be reversed column by column. Exchange 408 into 3 hundreds, 9 tens and 18 ones, then subtract 1 hundred, 7 tens and 9 ones to obtain 229. Check 229+179=408; 371+179 fails to recover the original.',
        ],
        [
          ['哪一整数量在被减去？', 'Which whole amount is being subtracted?'],
          [
            '先换单位，再在同一列里相减。',
            'Exchange units before subtracting within each column.',
          ],
        ],
      ),
    ],
    exit: q(
      'B03-L01-X',
      ['502−268 等于多少？', 'Find 502−268.'],
      234,
      regroup,
      [
        ['先把一个百换成十个十。', 'First exchange one hundred for ten tens.'],
        [
          '再换一个十给个位，顶行为 4 百、9 十、12 一。',
          'Then exchange one ten to ones: 4 hundreds, 9 tens and 12 ones.',
        ],
      ],
      [
        [
          '12−8=4；9−6=3；4−2=2，结果 234。',
          '12−8=4; 9−6=3; 4−2=2, giving 234.',
        ],
        ['234+268=502。', '234+268=502.'],
      ],
      ['366', '244', '334'],
    ),
    exitReason: T(
      '说明经过零位时的换组如何保留 502，再用加法检查。',
      'Explain how exchanges across the zero preserve 502, then check by addition.',
    ),
    parent: {
      goal: T(
        '把进退位解释为同一数量的单位交换。',
        'Explain regrouping as exchanging units of the same quantity.',
      ),
      misconception: T(
        '忘记进位的单位，或跨零退位时把经过的十位留成十个。',
        'Forgetting the carried unit or leaving ten in an intervening place after passing one onward.',
      ),
      prompts: [
        T(
          '换组后顶行还表示原数吗？',
          'Does the exchanged top row still represent the original number?',
        ),
        T(
          '反向运算能回到哪个原量？',
          'Which original amount should the inverse check recover?',
        ),
      ],
      bridge: 'B01-L05',
    },
  }),
  b03Lesson({
    id: 'B03-L02',
    title: T('乘法事实与拆分策略', 'Multiplication facts and decomposition'),
    objective: T(
      '把一个因数拆成易算的两部分，并让另一因数作用于两部分。',
      'Decompose one factor into easier parts and apply the other factor to both.',
    ),
    prerequisites: ['B02-L02'],
    keywords: [
      T('拆分', 'decomposition'),
      T('分配', 'distribution'),
      T('补偿', 'compensation'),
    ],
    minutes: 15,
    lab: 'calculation-split',
    hook: T(
      '6×8 忘了，但 6×5 会。剩下三个八，还是每行剩三个？',
      'You forgot 6×8 but know 6×5. Are there three eights left, or three objects left in every row?',
    ),
    guided: q(
      'B03-L02-G',
      ['用 8=5+3 求 6×8 的总量。', 'Use 8=5+3 to find 6×8.'],
      48,
      split,
      [
        ['两块都各有六行。', 'Both parts have six rows.'],
        ['6×5 与 6×3 都要计入。', 'Include both 6×5 and 6×3.'],
      ],
      [['6×8=6×5+6×3=30+18=48。', '6×8=6×5+6×3=30+18=48.']],
      ['33', '30', '18'],
    ),
    questions: [
      c(
        'B03-L02-Q1',
        [
          '用 9=10−1 求 7×9，哪一种正确？',
          'Using 9=10−1, which correctly calculates 7×9?',
        ],
        0,
        split,
        [
          {
            label: ['7×10−7×1', '7×10−7×1'],
            feedback: [
              '每一行都少一个，所以减七个一。',
              'Each row has one fewer, so subtract seven ones.',
            ],
          },
          {
            label: ['7×10−1', '7×10−1'],
            feedback: [
              '只有少一个总物体，未从每一行少一个。',
              'This removes only one object rather than one from every row.',
            ],
          },
          {
            label: ['7+10−1', '7+10−1'],
            feedback: [
              '组数与每组量要相乘，不能替成相加。',
              'Group count and per-group amount need multiplication, not addition.',
            ],
          },
        ],
        [
          [
            '七个十变成七个九，少了几个一？',
            'How many ones are removed from seven tens to get seven nines?',
          ],
          ['每行少一个，共七行。', 'One fewer per row, across seven rows.'],
        ],
        [['7×9=70−7=63。', '7×9=70−7=63.']],
      ),
      q(
        'B03-L02-Q2',
        ['把 7 拆成 5+2，求 8×7。', 'Split 7 into 5+2 and find 8×7.'],
        56,
        split,
        [
          ['先求八个五。', 'Find eight fives first.'],
          ['再求八个二，把两块合并。', 'Then find eight twos and combine.'],
        ],
        [['8×5+8×2=40+16=56。', '8×5+8×2=40+16=56.']],
        ['42', '40', '16'],
      ),
      q(
        'B03-L02-Q3',
        [
          '4×13=4×10+4×3。第二块 4×3 有多少？',
          'For 4×13=4×10+4×3, what is the second partial product 4×3?',
        ],
        12,
        split,
        [
          [
            '题目问第二块，不是两块总量。',
            'The question asks for the second region, not the total.',
          ],
          ['四行，每行三个。', 'Four rows of three.'],
        ],
        [
          [
            '第二块 4×3=12；总量为 40+12=52。',
            'The second region is 4×3=12; total is 40+12=52.',
          ],
        ],
        ['52', '43', '3'],
      ),
      q(
        'B03-L02-Q4',
        [
          '已知 9×3=27，把三加倍成六，9×6 是多少？',
          'Given 9×3=27, double three to six. What is 9×6?',
        ],
        54,
        split,
        [
          [
            '每行量加倍，行数不变。',
            'Double the amount per row, retaining row count.',
          ],
          ['把两个相同的 27 合起来。', 'Combine two equal totals of 27.'],
        ],
        [['9×6=9×3+9×3=27+27=54。', '9×6=9×3+9×3=27+27=54.']],
        ['30', '27', '162'],
      ),
      q(
        'B03-L02-Q5',
        [
          '五队每队十二个标记，共多少个？可把十二拆成十与二。',
          'Five teams each have twelve markers. How many altogether? Split twelve into ten and two.',
        ],
        60,
        split,
        [
          ['两个部分都属于每一队。', 'Both parts belong to every team.'],
          ['求五个十与五个二。', 'Find five tens and five twos.'],
        ],
        [['5×12=50+10=60 个。', '5×12=50+10=60 markers.']],
        ['52', '17', '50'],
      ),
      r(
        'B03-L02-Q6',
        [
          '同学写 6×(5+3)=6×5+3=33。哪一部分没有被完整计入？',
          'A learner writes 6×(5+3)=6×5+3=33. Which part has not been counted fully?',
        ],
        split,
        [
          '每行余下三个，六行余下十八个，不是总共三个。两部分都乘六，6×5+6×3=30+18=48。可用同一六行八列阵列的分界线解释，图中的物体不增不减。',
          'Three remain in each row, making eighteen across six rows, not three in total. Multiply both parts by six: 6×5+6×3=30+18=48. Explain with a cut in the same six-by-eight array; no objects are added or lost.',
        ],
        [
          ['右块有几行？', 'How many rows are in the right region?'],
          [
            '每行三个应重复几次？',
            'How often should the three per row repeat?',
          ],
        ],
      ),
    ],
    exit: q(
      'B03-L02-X',
      ['用十减一的策略求 8×9。', 'Use the ten-minus-one strategy to find 8×9.'],
      72,
      split,
      [
        ['九是十少一。', 'Nine is one less than ten.'],
        ['每行少一个，共八行。', 'Remove one per row across eight rows.'],
      ],
      [['8×9=8×10−8×1=80−8=72。', '8×9=8×10−8×1=80−8=72.']],
      ['79', '80', '17'],
    ),
    exitReason: T(
      '解释为什么减八而不是减一，再给出另一个拆分检查。',
      'Explain why subtract eight rather than one, then check with another decomposition.',
    ),
    parent: {
      goal: T(
        '每个局部仍按全部行数重复。',
        'Repeat every partial amount in all rows.',
      ),
      misconception: T(
        '拆分后只乘第一部分，或补偿时只减一个总物体。',
        'Multiplying only the first part or subtracting just one object during compensation.',
      ),
      prompts: [
        T(
          '分界线改变了物体总数吗？',
          'Did moving the cut change the object total?',
        ),
        T(
          '两块各有几行、每行几个？',
          'How many rows and objects per row does each region have?',
        ),
      ],
      bridge: 'B02-L02',
    },
  }),
  b03Lesson({
    id: 'B03-L03',
    title: T(
      '两位数乘法的面积模型',
      'Area models for two-digit multiplication',
    ),
    objective: T(
      '把两位数乘法表示为四块矩形面积，并与十位部分积联系。',
      'Represent two-digit multiplication with four rectangular regions and connect them to tens partial products.',
    ),
    prerequisites: ['B03-L02', 'B01-L02'],
    keywords: [
      T('部分积', 'partial products'),
      T('面积', 'area'),
      T('十位', 'tens place'),
    ],
    minutes: 18,
    lab: 'calculation-area',
    hook: T(
      '23×14 的竖式第二行为什么是 230 而不是 23？长方形里哪里表示那个十？',
      'Why is the second partial-product row for 23×14 equal to 230 rather than 23? Where is that ten in a rectangle?',
    ),
    guided: q(
      'B03-L03-G',
      [
        '把 23=20+3、14=10+4，求 23×14。',
        'Split 23=20+3 and 14=10+4 to find 23×14.',
      ],
      322,
      area,
      [
        [
          '两条边各拆一次，会有四块。',
          'Splitting both sides creates four regions.',
        ],
        [
          '分别算 20×10、3×10、20×4、3×4。',
          'Calculate 20×10, 3×10, 20×4 and 3×4.',
        ],
      ],
      [
        ['200+30+80+12=322。', '200+30+80+12=322.'],
        [
          '也可合成 23×10+23×4=230+92。',
          'Equivalently combine 23×10+23×4=230+92.',
        ],
      ],
      ['115', '292', '242'],
    ),
    questions: [
      c(
        'B03-L03-Q1',
        [
          '一块矩形宽 20、高 4 个相同长度单位，面积怎样算？',
          'A region is 20 units wide and 4 units high, using matching length units. How do you find its area?',
        ],
        1,
        area,
        [
          {
            label: ['20+4=24', '20+4=24'],
            feedback: [
              '相加没有数完每一行的单位方格。',
              'Adding does not count every row of unit squares.',
            ],
          },
          {
            label: ['20×4=80', '20×4=80'],
            feedback: [
              '四行，每行二十个单位方格。',
              'Four rows of twenty unit squares.',
            ],
          },
          {
            label: ['20×14=280', '20×14=280'],
            feedback: [
              '这块高只有四，不是整个十四。',
              'This region is four high, not the full fourteen.',
            ],
          },
        ],
        [
          ['面积在计多少单位方格。', 'Area counts unit squares.'],
          ['每行二十，有四行。', 'Twenty in each of four rows.'],
        ],
        [['20×4=80 个面积单位。', '20×4=80 square units.']],
      ),
      q(
        'B03-L03-Q2',
        ['用面积拆分求 32×21。', 'Use area decomposition to calculate 32×21.'],
        672,
        area,
        [
          ['32=30+2，21=20+1。', '32=30+2 and 21=20+1.'],
          ['四块为 600、40、30、2。', 'The four areas are 600, 40, 30 and 2.'],
        ],
        [
          [
            '600+40+30+2=672；32×20+32=640+32。',
            '600+40+30+2=672; also 32×20+32=640+32.',
          ],
        ],
        ['96', '642', '632'],
      ),
      q(
        'B03-L03-Q3',
        [
          '图中两边 24 与 13，长方形包含多少面积单位？',
          'The diagram has side lengths 24 and 13. How many square units does it contain?',
        ],
        312,
        area,
        [
          [
            '二十四拆成二十与四，十三拆成十与三。',
            'Split twenty-four into twenty and four, thirteen into ten and three.',
          ],
          ['四块面积都必须加入。', 'Include all four regions.'],
        ],
        [['200+40+60+12=312。', '200+40+60+12=312.']],
        ['112', '272', '37'],
        undefined,
        { kind: 'calculation-area', a: 24, b: 13 },
      ),
      q(
        'B03-L03-Q4',
        [
          '40×12 等于多少？个位为零的区域该怎样处理？',
          'Find 40×12. How do you handle a zero-width ones region?',
        ],
        480,
        area,
        [
          [
            '40=40+0，零宽区域面积为零。',
            '40=40+0; a zero-width region has zero area.',
          ],
          ['仍需计 40×10 与 40×2。', 'Include 40×10 and 40×2.'],
        ],
        [['400+0+80+0=480。', '400+0+80+0=480.']],
        ['120', '408', '400'],
      ),
      q(
        'B03-L03-Q5',
        [
          '长方形纸板两边 18 cm 与 25 cm，面积多少 cm²？',
          'A rectangular card is 18 cm by 25 cm. What is its area in cm²?',
        ],
        450,
        area,
        [
          [
            '两边长度相乘，结果是平方厘米。',
            'Multiply the side lengths; the result is square centimetres.',
          ],
          [
            '(10+8)×(20+5) 的四块都要算。',
            'Calculate all four regions of (10+8)×(20+5).',
          ],
        ],
        [['200+160+50+40=450 cm²。', '200+160+50+40=450 cm².']],
        ['43', '86', '450 cm'],
        'cm²',
      ),
      r(
        'B03-L03-Q6',
        [
          '同学算 23×14，写 23×4=92，再写 23×1=23，合计 115。第二行漏掉了什么？',
          'For 23×14, a learner adds 23×4=92 and 23×1=23 to obtain 115. What is missing in the second row?',
        ],
        area,
        [
          '14 的 1 在十位，表示十，不是一个一。第二行是 23×10=230；92+230=322。面积图十单位高的两块为 200 与 30，共 230，不能只把竖式当数字排列。',
          'The 1 in 14 is in the tens place and represents ten, not one. The second row is 23×10=230; 92+230=322. The ten-unit-high regions have areas 200 and 30, totalling 230. The written layout must retain place value.',
        ],
        [
          ['14 中的 1 计什么单位？', 'What unit does the 1 in 14 count?'],
          [
            '十单位高的两块合计多少？',
            'What is the combined area of the ten-unit-high regions?',
          ],
        ],
      ),
    ],
    exit: q(
      'B03-L03-X',
      ['31×12 等于多少？', 'Find 31×12.'],
      372,
      area,
      [
        ['31=30+1，12=10+2。', '31=30+1 and 12=10+2.'],
        [
          '四块面积为 300、10、60、2。',
          'The four regions have areas 300, 10, 60 and 2.',
        ],
      ],
      [['300+10+60+2=372；310+62=372。', '300+10+60+2=372; 310+62=372.']],
      ['93', '362', '312'],
    ),
    exitReason: T(
      '指出 31×10 的两块，说明十位部分积的单位。',
      'Identify the two regions for 31×10 and explain the tens partial product.',
    ),
    parent: {
      goal: T(
        '每块面积与竖式部分积都有位值意义。',
        'Connect each region and written partial product to place value.',
      ),
      misconception: T(
        '只算两块或把十位的 1 当作一个一；把面积写成长单位。',
        'Omitting regions, treating a tens 1 as one, or labelling area with a length unit.',
      ),
      prompts: [
        T(
          '两边都拆分后有哪四块？',
          'Which four regions result when both sides are split?',
        ),
        T(
          '竖式第二行为什么向左一位？',
          'Why does the second written partial product shift left?',
        ),
      ],
      bridge: 'B03-L02',
    },
  }),
  b03Lesson({
    id: 'B03-L04',
    title: T('长除法的步骤与意义', 'Long division with understanding'),
    objective: T(
      '按位值解释长除法的商、乘回、相减与余量换组。',
      'Explain long-division quotient digits, multiplication checks, subtraction and remainder exchanges through place value.',
    ),
    prerequisites: ['B03-L01', 'B02-L04'],
    keywords: [
      T('商的位值', 'quotient place value'),
      T('余量换组', 'remainder exchange'),
      T('乘回检查', 'multiplication check'),
    ],
    minutes: 20,
    lab: 'calculation-division',
    hook: T(
      '1005÷5 的答案是 201，为什么不能把中间的零省掉成 21？',
      'Why must the middle zero in 1005÷5=201 stay, rather than turning the quotient into 21?',
    ),
    guided: q(
      'B03-L04-G',
      [
        '936÷12 的整数商是多少？这里没有余数。',
        'What is the whole quotient of 936÷12? There is no remainder here.',
      ],
      78,
      division,
      [
        [
          '九个百不足以给十二组各一个百，先换到十。',
          'Nine hundreds cannot give twelve groups a hundred each; exchange to tens.',
        ],
        [
          '93 个十可分出七个十，余九个十换成九十个一。',
          '93 tens give seven tens per group, with nine tens exchanged to ninety ones.',
        ],
      ],
      [
        [
          '93=12×7+9；96=12×8+0，所以商 78。',
          '93=12×7+9; 96=12×8+0, giving quotient 78.',
        ],
        ['12×78=936。', '12×78=936.'],
      ],
      ['708', '87', '924'],
    ),
    questions: [
      c(
        'B03-L04-Q1',
        [
          '1005÷5 的商应写哪一个？',
          'Which quotient should be written for 1005÷5?',
        ],
        1,
        division,
        [
          {
            label: ['21', '21'],
            feedback: [
              '21×5=105，漏掉了商的十位零，不能恢复 1005。',
              '21×5=105: dropping the tens zero fails to recover 1005.',
            ],
          },
          {
            label: ['201', '201'],
            feedback: [
              '两百个、零个十与一个一，共 201。',
              'Two hundreds, zero tens and one one total 201.',
            ],
          },
          {
            label: ['2001', '2001'],
            feedback: [
              '多写一个数位改变了商的位值。',
              'Adding a place changes the quotient value.',
            ],
          },
        ],
        [
          [
            '每次商的数字必须放在对应数位。',
            'Place each quotient digit in the matching place.',
          ],
          [
            '乘回五，哪一个恢复原总量？',
            'Which value multiplied by five recovers the total?',
          ],
        ],
        [['1005=5×201，没有余量。', '1005=5×201, with no remainder.']],
      ),
      q(
        'B03-L04-Q2',
        ['408÷4 等于多少？', 'Find 408÷4.'],
        102,
        division,
        [
          ['百位可分出一个百。', 'The hundreds give one hundred per group.'],
          [
            '十位零个十也要在商里占位。',
            'The zero tens still need a quotient placeholder.',
          ],
        ],
        [
          [
            '4 百÷4=1 百，0 十÷4=0 十，8 一÷4=2 一，共 102。',
            '4 hundreds divided by 4 give 1 hundred; 0 tens give 0 tens; 8 ones give 2 ones: 102.',
          ],
        ],
        ['12', '120', '104'],
      ),
      q(
        'B03-L04-Q3',
        [
          '235 张纸卡，每包 6 张，余下另放。可以装满几包？',
          'Pack 235 cards six per pack, setting leftovers aside. How many full packs?',
        ],
        39,
        division,
        [
          ['先用二十三个十除以六。', 'First divide twenty-three tens by six.'],
          [
            '余五个十换成五十个一，再加五个一。',
            'Exchange the five leftover tens into fifty ones and add five ones.',
          ],
        ],
        [
          [
            '23=6×3+5；55=6×9+1，整数商 39。',
            '23=6×3+5; 55=6×9+1, giving whole quotient 39.',
          ],
          [
            '235=6×39+1，满包 39，余一张。',
            '235=6×39+1: 39 full packs and one card left.',
          ],
        ],
        ['40', '229', '39.1666667'],
      ),
      q(
        'B03-L04-Q4',
        [
          '235÷6 的整数商是 39，余数是多少？',
          'The whole quotient of 235÷6 is 39. What is the remainder?',
        ],
        1,
        division,
        [
          [
            '先求三十九组六个的总量。',
            'Find the amount in thirty-nine groups of six.',
          ],
          [
            '余量是原总量减已分走量。',
            'Subtract the assigned amount from the original total.',
          ],
        ],
        [['235−6×39=235−234=1；1<6。', '235−6×39=235−234=1; 1<6.']],
        ['39', '6', '5'],
      ),
      q(
        'B03-L04-Q5',
        ['0÷6 等于多少？', 'Find 0÷6.'],
        0,
        division,
        [
          [
            '总量为零，但除数是六。',
            'The total is zero, but the divisor is six.',
          ],
          [
            '六组每组零个，恢复零总量。',
            'Six groups of zero recover the zero total.',
          ],
        ],
        [['0=6×0+0，因此 0÷6=0。', '0=6×0+0, so 0÷6=0.']],
        ['6', '1'],
      ),
      r(
        'B03-L04-Q6',
        [
          '同学认为商中有零就可以删掉，把 1005÷5=201 写成 21。如何检查并解释？',
          'A learner deletes the zero in 1005÷5=201, writing 21. How can you check and explain the error?',
        ],
        division,
        [
          '商的百位、十位、个位分别为 2、0、1；十位没有整十可分也必须占位。201×5=1005，而 21×5=105。只有商开头不改变数值的零可省，中间零不能删除。',
          'The quotient has 2 hundreds, 0 tens and 1 one. The empty tens place still needs a placeholder. 201×5=1005, while 21×5=105. Leading zeros may be omitted without changing value, but internal zeros cannot.',
        ],
        [
          [
            '删零后百位变成了哪一位？',
            'Which place does the hundreds digit move to when zero is deleted?',
          ],
          ['比较 201×5 与 21×5。', 'Compare 201×5 with 21×5.'],
        ],
      ),
    ],
    exit: q(
      'B03-L04-X',
      [
        '574÷7 的整数商是多少？这里没有余量。',
        'Find the whole quotient of 574÷7. There is no remainder.',
      ],
      82,
      division,
      [
        ['五十七个十除以七。', 'Divide fifty-seven tens by seven.'],
        [
          '余一个十换成十个一，再加四个一。',
          'Exchange the remaining ten into ten ones, then add four.',
        ],
      ],
      [
        ['57=7×8+1；14=7×2+0，商 82。', '57=7×8+1; 14=7×2+0, giving 82.'],
        ['7×82=574。', '7×82=574.'],
      ],
      ['802', '81', '567'],
    ),
    exitReason: T(
      '说明余下一个十如何变成十四个一，并用乘法恢复原量。',
      'Explain how a leftover ten becomes fourteen ones, then recover the original quantity by multiplication.',
    ),
    parent: {
      goal: T(
        '每次“落下一位”都能说清交换的单位。',
        'Explain the unit exchange behind bringing down each digit.',
      ),
      misconception: T(
        '跳过商里的零、余数不小于除数、把完整组数误写成精确商。',
        'Skipping quotient zeros, leaving a remainder at least as large as the divisor, or treating full-group count as an exact numerical quotient.',
      ),
      prompts: [
        T(
          '上行余数计什么单位，下行又计什么单位？',
          'What unit is the previous remainder, and what unit comes next?',
        ),
        T(
          '除数×整数商+余数能恢复总量吗？',
          'Does divisor times whole quotient plus remainder recover the total?',
        ),
      ],
      bridge: 'B02-L04',
    },
  }),
  b03Lesson({
    id: 'B03-L05',
    title: T('估算检查计算结果', 'Checking calculations with estimation'),
    objective: T(
      '用明确的舍入与可靠范围检查计算量级，并区分合理与已证正确。',
      'Check magnitude using explicit rounding and reliable bounds, distinguishing plausible from proven correct.',
    ),
    prerequisites: ['B01-L04', 'B03-L01', 'B03-L03'],
    keywords: [
      T('近似', 'approximation'),
      T('界限', 'bounds'),
      T('精算检查', 'exact checking'),
    ],
    minutes: 17,
    lab: 'calculation-estimate',
    hook: T(
      '23×19 的结果 437 与 438 都接近 400。估算能告诉你哪一个一定正确吗？',
      'Both 437 and 438 for 23×19 are near 400. Can estimation tell you which must be correct?',
    ),
    guided: q(
      'B03-L05-G',
      [
        '把 298 与 403 分别四舍五入到十，再相加，估算结果是多少？',
        'Round 298 and 403 separately to the nearest ten, then add. What is the estimate?',
      ],
      700,
      estimate,
      [
        [
          '先分别处理两个数，不是先精算总和。',
          'Round the two operands first rather than their exact sum.',
        ],
        ['298 约 300，403 约 400。', '298 rounds to 300 and 403 to 400.'],
      ],
      [
        ['300+400=700，所以 298+403≈700。', '300+400=700, so 298+403≈700.'],
        [
          '精确值为 701，不能用等号把它写成 700。',
          'The exact sum is 701; do not write it equal to 700.',
        ],
      ],
      ['701', '7000', '690'],
    ),
    questions: [
      c(
        'B03-L05-Q1',
        [
          '23×19≈400，候选 438 很接近。现在能判定 438 正确吗？',
          '23×19 is approximately 400, and candidate 438 is nearby. Can it now be marked correct?',
        ],
        1,
        estimate,
        [
          {
            label: ['可以，接近就相等', 'Yes; close means equal'],
            feedback: [
              '接近只检查量级，不能代替精确相等。',
              'Closeness checks magnitude rather than exact equality.',
            ],
          },
          {
            label: [
              '还不能，需要精算或反向检查',
              'Not yet; calculate exactly or check inversely',
            ],
            feedback: [
              '437 与 438 都接近 400，精算才能区分。',
              '437 and 438 are both near 400; exact work distinguishes them.',
            ],
          },
          {
            label: [
              '一定错误，估算只有 400',
              'It must be wrong because the estimate is 400',
            ],
            feedback: [
              '估算值不是精确答案，不能据此要求每个候选等于 400。',
              'An estimate is not an exact answer, so candidates need not equal 400.',
            ],
          },
        ],
        [
          [
            '估算值允许偏离精确值。',
            'An estimate may differ from the exact value.',
          ],
          ['附近可能有很多整数。', 'Many integers may be nearby.'],
        ],
        [
          [
            '23×19=23×20−23=460−23=437；438 不正确，但要靠精算来判断。',
            '23×19=23×20−23=460−23=437. Exact calculation, not mere closeness, rejects 438.',
          ],
        ],
      ),
      q(
        'B03-L05-Q2',
        [
          '802 与 397 分别四舍五入到百，再相减，估算结果是多少？',
          'Round 802 and 397 separately to the nearest hundred, then subtract. What is the estimate?',
        ],
        400,
        estimate,
        [
          ['802 约八百。', '802 rounds to eight hundred.'],
          [
            '397 约四百，相减得估计差。',
            '397 rounds to four hundred; subtract for an estimated difference.',
          ],
        ],
        [
          [
            '800−400=400，精确差为 405。',
            '800−400=400; the exact difference is 405.',
          ],
        ],
        ['405', '500', '1200'],
      ),
      q(
        'B03-L05-Q3',
        [
          '23 与 19 分别四舍五入到十，再相乘，估算结果是多少？',
          'Round 23 and 19 separately to the nearest ten, then multiply. What is the estimate?',
        ],
        400,
        estimate,
        [
          ['二十三约二十。', 'Twenty-three rounds to twenty.'],
          ['十九也约二十。', 'Nineteen also rounds to twenty.'],
        ],
        [
          [
            '20×20=400；原积 437 只是接近 400。',
            '20×20=400; the exact product 437 is merely near 400.',
          ],
        ],
        ['437', '43', '40'],
      ),
      q(
        'B03-L05-Q4',
        [
          '已知 30≤32≤40、20≤21≤30。用两个下界求 32×21 的可靠下界，是多少？',
          'Given 30≤32≤40 and 20≤21≤30, multiply the lower endpoints to find a reliable lower bound for 32×21. What is it?',
        ],
        600,
        estimate,
        [
          [
            '两数非负，增大因数不会使乘积变小。',
            'Both operands are non-negative, so increasing them cannot reduce the product.',
          ],
          ['下界用三十与二十。', 'Use thirty and twenty for the lower bound.'],
        ],
        [
          [
            '30×20=600≤32×21；上界 40×30=1200，精确值 672 在区间内。',
            '30×20=600≤32×21; the upper bound is 40×30=1200, and exact value 672 is inside.',
          ],
        ],
        ['672', '1200', '50'],
      ),
      q(
        'B03-L05-Q5',
        [
          '步道两段为 199 m 与 302 m，各自四舍五入到百米再相加，估计总长度多少米？',
          'Two track sections are 199 m and 302 m. Round each to the nearest hundred metres and add. Estimate the total in metres.',
        ],
        500,
        estimate,
        [
          [
            '两个近似量仍用米。',
            'Both approximate quantities still use metres.',
          ],
          [
            '分别约二百米与三百米。',
            'Round them to two hundred and three hundred metres.',
          ],
        ],
        [
          [
            '200+300=500 m；精确总长 501 m。',
            '200+300=500 m; the exact total is 501 m.',
          ],
        ],
        ['501', '500 km', '100'],
        'm',
      ),
      r(
        'B03-L05-Q6',
        [
          '同学写“298+403=700，因为四舍五入后 300+400=700”。怎样修正符号与结论？',
          'A learner writes “298+403=700 because rounding gives 300+400=700”. How should the symbol and conclusion change?',
        ],
        estimate,
        [
          '应写 298+403≈700；精确计算为 701。近似量可以帮助检查数量级，但不能用等号取代精确值。701 看起来合理还需精算或 701−403=298 的反向检查，不能说接近就已证明。',
          'Write 298+403≈700; the exact sum is 701. Approximations check magnitude but cannot replace exact values with an equality. A plausible 701 still needs exact work or the inverse check 701−403=298. Closeness alone is not proof.',
        ],
        [
          [
            '两个原数真的等于舍入后的数吗？',
            'Do the original operands equal their rounded values?',
          ],
          [
            '近似关系与精确关系用同一个符号吗？',
            'Do approximate and exact relationships use the same symbol?',
          ],
        ],
      ),
    ],
    exit: q(
      'B03-L05-X',
      [
        '把 49 与 21 分别四舍五入到十，再相乘，估算多少？',
        'Round 49 and 21 separately to the nearest ten, then multiply. What is the estimate?',
      ],
      1000,
      estimate,
      [
        ['49 约 50，21 约 20。', '49 rounds to 50, and 21 to 20.'],
        ['用舍入后的两个因数相乘。', 'Multiply the two rounded factors.'],
      ],
      [
        [
          '50×20=1000；精确积为 1029。',
          '50×20=1000; the exact product is 1029.',
        ],
      ],
      ['1029', '100', '70'],
    ),
    exitReason: T(
      '说明近似检查能排除什么，又不能证明什么；用拆分写出精确积作对照。',
      'Explain what approximate checking can rule out and what it cannot prove; calculate the exact product by decomposition for comparison.',
    ),
    familyChallenge: T(
      '家庭挑战：纸上设计假想 NZ$50 采购。自定整数价格和数量，先估成本是否可能在预算内，再用拆分精算；超出就调整方案。比较估计余额与精确余额，并保留“约”等标记。不实际购买、不计分。',
      'Family challenge: design an imaginary NZ$50 purchase on paper. Choose whole-dollar prices and counts, estimate whether costs might fit, then calculate exactly by decomposition; adjust the plan if it exceeds the budget. Compare estimated and exact balances, keeping approximation labels. No purchase or score is needed.',
    ),
    parent: {
      goal: T(
        '估算作筛查，精算或反向关系作最终核查。',
        'Use estimates for screening and exact or inverse work for final checking.',
      ),
      misconception: T(
        '把约等号换成等号，或把在范围内当作已证正确。',
        'Replacing approximate equality with equality, or treating being inside bounds as proof.',
      ),
      prompts: [
        T(
          '这里是要估计值，还是精确值？',
          'Does this task ask for an estimate or an exact value?',
        ),
        T(
          '两个接近的候选怎样进一步区分？',
          'How could two nearby candidates be distinguished?',
        ),
      ],
      bridge: 'B01-L04',
    },
  }),
];
export const b03CheckQuestions: Question[] = [
  q(
    'B03-CHECK-Q1',
    ['298+403 的精确值是多少？', 'What is the exact value of 298+403?'],
    701,
    regroup,
    [
      ['本题不是舍入估算。', 'This task asks for exact work, not rounding.'],
      [
        '个位进到十位，十位再计入。',
        'Carry from ones into tens, including it there.',
      ],
    ],
    [['298+403=701；701−403=298。', '298+403=701; 701−403=298.']],
    ['700', '601'],
  ),
  q(
    'B03-CHECK-Q2',
    ['502−268 等于多少？', 'Find 502−268.'],
    234,
    regroup,
    [
      [
        '个位不够减，十位又是零。',
        'The ones are insufficient and tens is zero.',
      ],
      [
        '换成 4 百、9 十与 12 一再减。',
        'Exchange into 4 hundreds, 9 tens and 12 ones.',
      ],
    ],
    [['502−268=234；234+268=502。', '502−268=234; 234+268=502.']],
    ['244', '366'],
  ),
  c(
    'B03-CHECK-Q3',
    ['6×(5+3) 的拆分式是哪一个？', 'Which expression decomposes 6×(5+3)?'],
    1,
    split,
    [
      {
        label: ['6×5+3', '6×5+3'],
        feedback: [
          '每行的后三个也重复六行。',
          'The final three also repeat across six rows.',
        ],
      },
      {
        label: ['6×5+6×3', '6×5+6×3'],
        feedback: [
          '两部分都按相同行数重复。',
          'Both parts repeat across the same row count.',
        ],
      },
      {
        label: ['6+5+3', '6+5+3'],
        feedback: [
          '组数与每行量是乘法关系。',
          'Row count and amount per row have a multiplication relationship.',
        ],
      },
    ],
    [
      ['两块各有几行？', 'How many rows are in each part?'],
      ['两个局部都乘六。', 'Multiply both partial amounts by six.'],
    ],
    [['30+18=48。', '30+18=48.']],
  ),
  q(
    'B03-CHECK-Q4',
    ['31×12 等于多少？', 'Find 31×12.'],
    372,
    area,
    [
      ['把两边都拆成十与一。', 'Split both sides into tens and ones.'],
      ['算四块或 31×10+31×2。', 'Use four regions or 31×10+31×2.'],
    ],
    [['310+62=372。', '310+62=372.']],
    ['93', '362'],
  ),
  q(
    'B03-CHECK-Q5',
    ['408÷4 等于多少？', 'Find 408÷4.'],
    102,
    division,
    [
      ['商的十位必须占位。', 'Keep the quotient tens placeholder.'],
      ['一个百、零个十、两个一。', 'One hundred, zero tens and two ones.'],
    ],
    [['408=4×102。', '408=4×102.']],
    ['12', '120'],
  ),
  q(
    'B03-CHECK-Q6',
    [
      '317÷8 的整数商为 39，余数多少？',
      'The whole quotient of 317÷8 is 39. What is the remainder?',
    ],
    5,
    division,
    [
      ['乘回求已分配量。', 'Multiply back to find the assigned amount.'],
      ['用 317 减去 8×39。', 'Subtract 8×39 from 317.'],
    ],
    [['317−312=5，小于除数 8。', '317−312=5, less than divisor 8.']],
    ['39', '8', '312'],
  ),
  q(
    'B03-CHECK-Q7',
    [
      '把 398 与 201 各四舍五入到百再相加，估算多少？',
      'Round 398 and 201 separately to the nearest hundred, then add. What is the estimate?',
    ],
    600,
    estimate,
    [
      ['分别约四百与二百。', 'They round to four hundred and two hundred.'],
      ['合并两个近似量。', 'Combine the two approximate amounts.'],
    ],
    [['400+200=600；精确值 599。', '400+200=600; exact sum is 599.']],
    ['599', '500', '6000'],
  ),
  r(
    'B03-CHECK-Q8',
    [
      '23×19 在 200 到 600 之间。同学说 438 在里面，所以一定正确。怎样回应？',
      '23×19 lies between 200 and 600. A learner says 438 is inside, so it must be correct. How do you respond?',
    ],
    estimate,
    [
      '范围只能排除范围外的数，不能证明每个范围内的数都相等。437 与 438 都在里面。精算 23×20−23=437，再用 437+23=460 或面积拆分检查，因此 438 不正确；不是因它在范围外。',
      'Bounds rule out outside values; they do not make all inside values equal to the product. Both 437 and 438 are inside. Calculate 23×20−23=437, then check 437+23=460 or use area decomposition. Thus 438 is incorrect by exact work, not because it lies outside the interval.',
    ],
    [
      ['区间里只有一个整数吗？', 'Does the interval contain only one integer?'],
      ['找精确积或反向关系。', 'Find the exact product or an inverse check.'],
    ],
  ),
];
export function b03ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative review round');
  const k = round % 80,
    qid = `${id}-R${round}`;
  if (id === 'B03-L01') {
    const add = k % 2 === 0,
      a = add ? 208 + 17 * k : 1000 + 10 * k,
      b = add ? 157 + 9 * (k % 8) : 1 + 13 * (k % 19),
      value = add ? a + b : a - b;
    return q(
      qid,
      [`${a}${add ? '+' : '−'}${b}=?`, `Find ${a}${add ? '+' : '−'}${b}.`],
      value,
      regroup,
      [
        ['先同位对齐，从个位开始。', 'Align places and start with ones.'],
        ['换组不改变原有数量。', 'Regrouping preserves quantity.'],
      ],
      [
        [
          `${a}${add ? '+' : '−'}${b}=${value}；用反向运算检查。`,
          `${a}${add ? '+' : '−'}${b}=${value}; check by the inverse operation.`,
        ],
      ],
      [String(value + 10)],
    );
  }
  if (id === 'B03-L02') {
    const a = 2 + (k % 8),
      b = 3 + (Math.floor(k / 8) % 8),
      left = Math.floor(b / 2),
      right = b - left,
      value = a * b;
    return q(
      qid,
      [
        `把 ${b} 拆成 ${left}+${right}，求 ${a}×${b}。`,
        `Split ${b} into ${left}+${right} and find ${a}×${b}.`,
      ],
      value,
      split,
      [
        ['两块都有相同行数。', 'Both parts have the same row count.'],
        ['两部分都要乘行数。', 'Multiply both parts by the row count.'],
      ],
      [
        [
          `${a}×${left}+${a}×${right}=${a * left}+${a * right}=${value}。`,
          `${a}×${left}+${a}×${right}=${a * left}+${a * right}=${value}.`,
        ],
      ],
      [String(a * left + right)],
    );
  }
  if (id === 'B03-L03') {
    const a = 12 + (k % 28),
      b = 11 + (Math.floor(k / 7) % 19),
      value = a * b;
    return q(
      qid,
      [
        `用两位数拆分求 ${a}×${b}。`,
        `Use two-digit decomposition to find ${a}×${b}.`,
      ],
      value,
      area,
      [
        ['两条边都拆成整十与个位。', 'Split both sides into tens and ones.'],
        [
          '保留四块，十位要按十计。',
          'Include four regions and retain tens place value.',
        ],
      ],
      [
        [
          `${a}×${b}=${a * Math.floor(b / 10) * 10}+${a * (b % 10)}=${value}。`,
          `${a}×${b}=${a * Math.floor(b / 10) * 10}+${a * (b % 10)}=${value}.`,
        ],
      ],
      [String(value + 10)],
    );
  }
  if (id === 'B03-L04') {
    const d = 2 + (k % 11),
      whole = 20 + k,
      remainder = k % d,
      total = d * whole + remainder,
      findR = k % 2 === 1,
      value = findR ? remainder : whole;
    return q(
      qid,
      [
        findR
          ? `${total}÷${d} 的整数商是 ${whole}，余数多少？`
          : `${total} 张卡每包 ${d} 张，余下另放，能装满几包？`,
        findR
          ? `For ${total}÷${d}, the whole quotient is ${whole}. What is the remainder?`
          : `Pack ${total} cards ${d} per pack and set leftovers aside. How many full packs?`,
      ],
      value,
      division,
      [
        [
          '先辨认问整数商还是余数。',
          'Identify whether the question asks for whole quotient or remainder.',
        ],
        [
          '用除数×整数商+余数恢复原量。',
          'Recover the total with divisor times whole quotient plus remainder.',
        ],
      ],
      [
        [
          `${total}=${d}×${whole}+${remainder}。`,
          `${total}=${d}×${whole}+${remainder}.`,
        ],
      ],
      [String(value + d)],
    );
  }
  if (id === 'B03-L05') {
    const form = k % 3,
      a =
        form === 0 ? 198 + 11 * k : form === 1 ? 12 + (k % 20) : 21 + (k % 28),
      b =
        form === 0
          ? 302 + 9 * k
          : form === 1
            ? 19 + (k % 11)
            : 11 + (Math.floor(k / 5) % 22),
      ra = Math.round(a / 10) * 10,
      rb = Math.round(b / 10) * 10,
      value =
        form === 0
          ? ra + rb
          : form === 1
            ? ra * rb
            : Math.floor(a / 10) * 10 * Math.floor(b / 10) * 10;
    return q(
      qid,
      [
        form === 2
          ? `用两个数到十的下界，求 ${a}×${b} 的可靠下界。`
          : `把 ${a} 与 ${b} 各四舍五入到十再${form === 0 ? '相加' : '相乘'}，估算多少？`,
        form === 2
          ? `Use the lower tens endpoints to give a reliable lower bound for ${a}×${b}.`
          : `Round ${a} and ${b} separately to the nearest ten, then ${form === 0 ? 'add' : 'multiply'}. What is the estimate?`,
      ],
      value,
      estimate,
      [
        [
          '先确认是在四舍五入还是找下界。',
          'Check whether the task asks for nearest rounding or lower bounds.',
        ],
        [
          '舍入后的数或下界要按题目运算，不代替精确值。',
          'Apply the operation to the rounded values or lower endpoints, without treating them as exact operands.',
        ],
      ],
      [
        [
          form === 2
            ? `${Math.floor(a / 10) * 10}×${Math.floor(b / 10) * 10}=${value}≤${a}×${b}。`
            : `${a}${form === 0 ? '+' : '×'}${b}≈${ra}${form === 0 ? '+' : '×'}${rb}=${value}。`,
          form === 2
            ? `${Math.floor(a / 10) * 10}×${Math.floor(b / 10) * 10}=${value}≤${a}×${b}.`
            : `${a}${form === 0 ? '+' : '×'}${b}≈${ra}${form === 0 ? '+' : '×'}${rb}=${value}.`,
        ],
      ],
      [String(value + 10)],
    );
  }
  throw new Error(`Unknown B03 lesson ${id}`);
}
