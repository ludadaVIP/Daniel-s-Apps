import { t, type Lesson, type Question } from '../model';
import { b01Lesson, choice, numeric as num, reasoning } from './builders';
const N = t;
const numberSkill = 'whole-number-reading',
  placeSkill = 'place-value',
  lineSkill = 'whole-number-line',
  roundSkill = 'rounding',
  modelSkill = 'base-ten-model';
export const b01Lessons: Lesson[] = [
  b01Lesson({
    id: 'B01-L01',
    title: N('万以内及更大数的读写', 'Reading and writing larger numbers'),
    objective: N(
      '把口头读法和位值联系起来，写出含零的大数。',
      'Connect spoken number names to place value and write larger numbers with zeros.',
    ),
    prerequisites: [],
    keywords: [
      N('数位', 'place'),
      N('占位零', 'placeholder zero'),
      N('读数', 'number names'),
    ],
    minutes: 15,
    lab: 'number-reader',
    hook: N(
      '图书馆有 10,005 本书。是“一千零五”还是“一万零五”？先把每一位放进格子，不要按逗号猜大小。',
      'A library has 10,005 books. Is that one thousand and five, or ten thousand and five? Put each digit in its place before deciding.',
    ),
    guided: num(
      'B01-L01-G',
      N(
        '“六千零四十”写成数字是多少？',
        'Write “six thousand and forty” in digits.',
      ),
      '6040',
      numberSkill,
      [
        N(
          '从千位到个位排出四个格子。',
          'Make four places from thousands to ones.',
        ),
        N(
          '千位是 6，百位没有，十位是 4，个位没有；没有的位用 0。',
          'Use 6 thousands and 4 tens. The hundreds and ones places need zero.',
        ),
      ],
      [
        N(
          '6 个千是 6,000，4 个十是 40。',
          'Six thousands make 6,000; four tens make 40.',
        ),
        N(
          '保留百位和个位的 0：6,000 + 40 = 6,040。',
          'Keep zeros in hundreds and ones: 6,000 + 40 = 6,040.',
        ),
      ],
      { accepted: ['6040', '6,040'], rejected: ['640', '6004', '604'] },
    ),
    questions: [
      choice(
        'B01-L01-Q1',
        N(
          '哪一个数字表示“三万零四十二”？',
          'Which number means “thirty thousand and forty-two”?',
        ),
        1,
        numberSkill,
        [
          {
            text: N('3,042', '3,042'),
            feedback: N(
              '3,042 只有 3 个千；题目有 3 个万。',
              '3,042 has three thousands, but the name says thirty thousand.',
            ),
          },
          {
            text: N('30,042', '30,042'),
            feedback: N(
              '3 个万、0 个千、0 个百、4 个十、2 个一。',
              'Three ten-thousands, zero thousands, zero hundreds, four tens and two ones.',
            ),
          },
          {
            text: N('30,402', '30,402'),
            feedback: N(
              '这个数有 4 个百，读成三万零四百零二。',
              'This has four hundreds: thirty thousand four hundred and two.',
            ),
          },
        ],
        [
          N('先找“三万”在哪一位。', 'Find the ten-thousands place first.'),
          N('四十二放在十位和个位。', 'Forty-two occupies tens and ones.'),
        ],
        [
          N(
            '三万 = 30,000，四十二 = 42。',
            'Thirty thousand is 30,000; forty-two is 42.',
          ),
          N('合起来是 30,042。', 'Together they make 30,042.'),
        ],
      ),
      num(
        'B01-L01-Q2',
        N('“八万零六”写成数字。', 'Write “eighty thousand and six” in digits.'),
        '80006',
        numberSkill,
        [
          N('这需要五个数位。', 'Use five places.'),
          N(
            '从万位到个位：8、0、0、0、6。',
            'From ten-thousands to ones: 8, 0, 0, 0, 6.',
          ),
        ],
        [
          N(
            '八万是 80,000，六是 6。',
            'Eighty thousand is 80,000 and six is 6.',
          ),
          N('80,000 + 6 = 80,006。', '80,000 + 6 = 80,006.'),
        ],
        { accepted: ['80006', '80,006'], rejected: ['8006', '806', '80060'] },
      ),
      num(
        'B01-L01-Q3',
        N(
          '看位值表，写出这个数。',
          'Read the place-value chart and write the number.',
        ),
        '5072',
        numberSkill,
        [
          N('每一列都保留，零也占一位。', 'Keep every column, including zero.'),
          N(
            '5 个千、0 个百、7 个十、2 个一。',
            'Five thousands, zero hundreds, seven tens and two ones.',
          ),
        ],
        [
          N(
            '各位的值为 5,000、0、70、2。',
            'The values are 5,000, 0, 70 and 2.',
          ),
          N('合起来为 5,072。', 'Together they make 5,072.'),
        ],
        { accepted: ['5072', '5,072'], rejected: ['572', '5702', '50720'] },
        { kind: 'place', value: 5072, places: 4 },
      ),
      num(
        'B01-L01-Q4',
        N(
          '一场活动登记了二十万三千零九人。把人数写成数字。',
          'An event recorded two hundred and three thousand and nine people. Write the number in digits.',
        ),
        '203009',
        numberSkill,
        [
          N(
            '先写二十万，再写三千，最后写九。',
            'Separate two hundred thousand, three thousand and nine.',
          ),
          N(
            '200,000 + 3,000 + 9；百位和十位都没有。',
            '200,000 + 3,000 + 9; the hundreds and tens places are empty.',
          ),
        ],
        [
          N(
            '在六个数位填入 2、0、3、0、0、9。',
            'Fill the six places with 2, 0, 3, 0, 0, 9.',
          ),
          N(
            '人数是 203,009；这里的 0 保留了其他数字的位置。',
            'The number is 203,009; zeros hold the other digits in their places.',
          ),
        ],
        {
          accepted: ['203009', '203,009'],
          rejected: ['23009', '2039', '203090'],
        },
      ),
      num(
        'B01-L01-Q5',
        N(
          '“一百万零二十”写成数字。',
          'Write “one million and twenty” in digits.',
        ),
        '1000020',
        numberSkill,
        [
          N('先把百万位和十位找出来。', 'Locate millions and tens first.'),
          N(
            '除了百万位的 1、十位的 2，其他位都是 0。',
            'Only millions has 1 and tens has 2; the other places have zero.',
          ),
        ],
        [
          N('1,000,000 + 20 = 1,000,020。', '1,000,000 + 20 = 1,000,020.'),
          N(
            '逗号按三位分组；每个数字仍按自己的数位读。',
            'Commas group three digits; each digit still belongs to its own place.',
          ),
        ],
        {
          accepted: ['1000020', '1,000,020'],
          rejected: ['100020', '100002', '1000200'],
        },
      ),
      reasoning(
        'B01-L01-Q6',
        N(
          '小安把 10,005 写成 1,005，说“0 不用写那么多”。哪里错了？',
          'Ari writes 10,005 as 1,005 and says the extra zero is unnecessary. What changed?',
        ),
        numberSkill,
        N(
          '应说明 10,005 的 1 在万位，1,005 的 1 在千位；删掉内部占位零改变数值。可用位值表或 10,000 + 5 与 1,000 + 5 解释；不要求背出同一句话。',
          'Explain that the 1 is in ten-thousands in 10,005, but thousands in 1,005. Removing a placeholder changes the value. Accept a chart or 10,000 + 5 versus 1,000 + 5; do not require identical wording.',
        ),
        [
          N('把两个数的个位右对齐。', 'Align both numbers at the ones place.'),
          N(
            '比较两个 1 所在的列。',
            'Compare the columns containing the two 1s.',
          ),
        ],
      ),
    ],
    exit: num(
      'B01-L01-X',
      N(
        '自然观察项目记录了“四十万零六十”次观察。写出这个数。',
        'A nature project recorded “four hundred thousand and sixty” observations. Write the number.',
      ),
      '400060',
      numberSkill,
      [
        N('先找十万位与十位。', 'Locate hundred thousands and tens.'),
        N(
          '只有十万位的 4 和十位的 6 非零。',
          'Only the hundred-thousands digit 4 and tens digit 6 are non-zero.',
        ),
      ],
      [
        N('400,000 + 60 = 400,060。', '400,000 + 60 = 400,060.'),
        N(
          '中间和末尾的零不能随意删去。',
          'The internal and final zeros cannot be removed arbitrarily.',
        ),
      ],
      {
        accepted: ['400060', '400,060'],
        rejected: ['40060', '400006', '400600'],
      },
    ),
    exitReason: N(
      '解释：如果删掉一个中间的零，哪个数字的数位会改变？',
      'Explain: if an internal zero is removed, which digit changes its place?',
    ),
    parent: {
      goal: N(
        '读数时能指出数字所在的列，尤其保留内部零。',
        'Point to each place while reading, especially internal zeros.',
      ),
      misconception: N(
        '把读法中的“零”数量当成要写几个 0；中文与英文的分组方式也不同。',
        'Treating spoken zero words as the exact number of zero digits; Chinese and English group number names differently.',
      ),
      prompts: [
        N(
          '把个位右对齐，这个 1 现在在哪一位？',
          'With ones aligned, which place contains this 1?',
        ),
        N(
          '用几个“万”和几个“一”能表示它？',
          'How many ten-thousands and ones does it contain?',
        ),
      ],
      bridge: 'B01-L01',
    },
  }),
  b01Lesson({
    id: 'B01-L02',
    title: N('位值与展开式', 'Place value and expanded form'),
    objective: N(
      '区分数字与它的值，用各位贡献之和表示一个数。',
      'Distinguish a digit from its value and express a number as the sum of its place values.',
    ),
    prerequisites: ['B01-L01'],
    keywords: [
      N('位值', 'place value'),
      N('展开式', 'expanded form'),
      N('十倍', 'ten times'),
    ],
    minutes: 15,
    lab: 'place-value',
    hook: N(
      '44,444 里的五个 4，都表示同样多吗？猜一猜最左边的 4 是最右边的几倍，再改动位值表。',
      'In 44,444, do all five 4s have the same value? Predict how the first 4 compares with the last, then explore the chart.',
    ),
    guided: num(
      'B01-L02-G',
      N(
        '62,407 中的数字 2 表示多少？',
        'What is the value of the digit 2 in 62,407?',
      ),
      '2000',
      placeSkill,
      [
        N(
          '从个位向左数：个、十、百、千。',
          'Count places left from ones: ones, tens, hundreds, thousands.',
        ),
        N(
          '2 在千位，表示 2 个 1,000。',
          'The 2 is in thousands: two groups of 1,000.',
        ),
      ],
      [
        N('数字是 2，数位是千位。', 'The digit is 2; its place is thousands.'),
        N('位值为 2 × 1,000 = 2,000。', 'Its value is 2 × 1,000 = 2,000.'),
      ],
      { accepted: ['2000', '2,000'], rejected: ['2', '200', '20000'] },
    ),
    questions: [
      choice(
        'B01-L02-Q1',
        N(
          '7,073 中，两个 7 的值分别是什么？',
          'In 7,073, what are the values of the two 7s?',
        ),
        2,
        placeSkill,
        [
          {
            text: N('7 与 7', '7 and 7'),
            feedback: N(
              '数字都叫 7，但所在数位不同。',
              'Both digits are 7, but their places differ.',
            ),
          },
          {
            text: N('700 与 70', '700 and 70'),
            feedback: N(
              '最左边的 7 在千位，百位是 0。',
              'The left 7 is in thousands; hundreds has zero.',
            ),
          },
          {
            text: N('7,000 与 70', '7,000 and 70'),
            feedback: N(
              '第一个是 7 个千，第二个是 7 个十。',
              'The first is seven thousands; the second is seven tens.',
            ),
          },
        ],
        [
          N(
            '先写出千、百、十、个四列。',
            'Write thousands, hundreds, tens and ones.',
          ),
          N(
            '看两个 7 各乘哪一个位值单位。',
            'Identify the unit multiplied by each 7.',
          ),
        ],
        [
          N(
            '千位的 7 是 7 × 1,000 = 7,000。',
            'The 7 in thousands is 7 × 1,000 = 7,000.',
          ),
          N('十位的 7 是 7 × 10 = 70。', 'The 7 in tens is 7 × 10 = 70.'),
        ],
      ),
      num(
        'B01-L02-Q2',
        N(
          '把 40,000 + 600 + 9 合成一个数。',
          'Write 40,000 + 600 + 9 as one number.',
        ),
        '40609',
        placeSkill,
        [
          N(
            '没有千，也没有十，要保留空位。',
            'There are no thousands or tens; keep their places.',
          ),
          N('各位依次为 4、0、6、0、9。', 'The digits are 4, 0, 6, 0 and 9.'),
        ],
        [
          N('40,000 + 600 = 40,600。', '40,000 + 600 = 40,600.'),
          N('再加 9，得到 40,609。', 'Add 9 to get 40,609.'),
        ],
        { accepted: ['40609', '40,609'], rejected: ['469', '46009', '40690'] },
      ),
      num(
        'B01-L02-Q3',
        N(
          '83,205 = 80,000 + 3,000 + __ + 5。空格是多少？',
          '83,205 = 80,000 + 3,000 + __ + 5. Fill the blank.',
        ),
        '200',
        placeSkill,
        [
          N('这里的 2 在百位。', 'The 2 is in hundreds.'),
          N('2 个百，不是 2 个十。', 'It means two hundreds, not two tens.'),
        ],
        [
          N('2 × 100 = 200。', '2 × 100 = 200.'),
          N(
            '80,000 + 3,000 + 200 + 5 = 83,205。',
            '80,000 + 3,000 + 200 + 5 = 83,205.',
          ),
        ],
        { accepted: ['200', '200.0'], rejected: ['2', '20', '2000'] },
      ),
      num(
        'B01-L02-Q4',
        N(
          '把一张位值卡的 6 从百位移到千位，其他位为 0。新数是原数的几倍？',
          'Move a 6 from hundreds to thousands with all other places zero. How many times the original is the new number?',
        ),
        '10',
        placeSkill,
        [
          N(
            '原数是 600，新数是 6,000。',
            'The original is 600 and the new number is 6,000.',
          ),
          N(
            '求“几倍”用新数除以原数。',
            'Divide the new number by the original to find the factor.',
          ),
        ],
        [
          N(
            '千的单位 1,000 是百的单位 100 的 10 倍。',
            'A thousand is ten times a hundred.',
          ),
          N('6,000 ÷ 600 = 10。', '6,000 ÷ 600 = 10.'),
        ],
        { accepted: ['10', '10.0'], rejected: ['6', '100', '5400'] },
      ),
      num(
        'B01-L02-Q5',
        N(
          '物资清单有 9 个千、0 个百、8 个十、4 个一，合计多少件？',
          'A supplies list has 9 thousands, 0 hundreds, 8 tens and 4 ones. How many items in total?',
        ),
        '9084',
        placeSkill,
        [
          N(
            '把每列的数量乘以这列的单位。',
            'Multiply each count by its place-value unit.',
          ),
          N('9,000 + 0 + 80 + 4。', '9,000 + 0 + 80 + 4.'),
        ],
        [
          N(
            '9 个千是 9,000，8 个十是 80。',
            'Nine thousands make 9,000; eight tens make 80.',
          ),
          N('9,000 + 80 + 4 = 9,084。', '9,000 + 80 + 4 = 9,084.'),
        ],
        { accepted: ['9084', '9,084'], rejected: ['984', '9804', '90840'] },
        { kind: 'place', value: 9084, places: 4 },
      ),
      reasoning(
        'B01-L02-Q6',
        N(
          '“4,204 = 4,000 + 20 + 4”。找出漏掉或放错的位值。',
          '“4,204 = 4,000 + 20 + 4.” Find the place-value error.',
        ),
        placeSkill,
        N(
          '2 在百位，所以必须写 200；十位是 0。正确式为 4,000 + 200 + 4，可保留 +0。接受画位值表并说明 4,024 与 4,204 不同。',
          'The 2 is in hundreds, so its contribution is 200; tens is zero. Correct: 4,000 + 200 + 4, optionally +0. Accept a chart showing why 4,024 differs from 4,204.',
        ),
        [
          N('先确定 2 在哪一列。', 'Locate the column containing 2.'),
          N(
            '把错误的展开式合起来，看是不是原数。',
            'Combine the proposed terms and check against the original number.',
          ),
        ],
      ),
    ],
    exit: num(
      'B01-L02-X',
      N(
        '一本手帐写着“5 个万、7 个百、2 个一”。合起来是多少？',
        'A notebook records 5 ten-thousands, 7 hundreds and 2 ones. What number is that?',
      ),
      '50702',
      placeSkill,
      [
        N('万、百、个之外的位为 0。', 'The other places have zero.'),
        N('50,000 + 700 + 2。', '50,000 + 700 + 2.'),
      ],
      [
        N(
          '五个万是 50,000，七个百是 700。',
          'Five ten-thousands make 50,000; seven hundreds make 700.',
        ),
        N('加上 2 得到 50,702。', 'Adding 2 gives 50,702.'),
      ],
      { accepted: ['50702', '50,702'], rejected: ['5702', '50720', '572'] },
    ),
    exitReason: N(
      '解释：为什么这个 7 表示 700，而不是 7 或 70？',
      'Explain: why does the 7 mean 700, rather than 7 or 70?',
    ),
    parent: {
      goal: N(
        '每个数字的值由所在数位决定，展开式必须保存每一列。',
        'A digit’s value depends on its place; expanded form must preserve every column.',
      ),
      misconception: N(
        '只把数字相加，或遇到 0 就把右边数字往左挤。',
        'Adding digits alone, or shifting other digits left when a place has zero.',
      ),
      prompts: [
        N(
          '这个数字乘的是 1、10、100 还是 1,000？',
          'Is this digit multiplied by 1, 10, 100 or 1,000?',
        ),
        N(
          '把展开式合起来，还能得到原数吗？',
          'Does recombining the expanded form give the original?',
        ),
      ],
      bridge: 'B01-L01',
    },
  }),
  b01Lesson({
    id: 'B01-L03',
    title: N(
      '比较、排序与数轴定位',
      'Comparing, ordering and locating numbers',
    ),
    objective: N(
      '从最高的不同数位判断大小，并在等距数轴上核对顺序。',
      'Compare using the highest differing place and check order on an evenly spaced number line.',
    ),
    prerequisites: ['B01-L02'],
    keywords: [N('比较', 'comparison'), N('刻度', 'scale'), N('顺序', 'order')],
    minutes: 15,
    lab: 'whole-line',
    hook: N(
      '步道地图把 500 到 520 米放大了。512 米的位置变了，512 和 516 的大小关系会变吗？先猜，再切换刻度。',
      'A trail map zooms in on 500 to 520 metres. The drawn position of 512 changes. Does its order relative to 516 change? Predict, then switch scales.',
    ),
    guided: num(
      'B01-L03-G',
      N(
        '5,408 和 5,480 中，较大的数是多少？',
        'Which is larger: 5,408 or 5,480?',
      ),
      '5480',
      lineSkill,
      [
        N('先比较千位与百位，它们都相同。', 'Thousands and hundreds match.'),
        N(
          '比较十位：0 个十和 8 个十。',
          'Compare tens: zero tens against eight tens.',
        ),
      ],
      [
        N(
          '两个数都有 5 个千与 4 个百。',
          'Both have five thousands and four hundreds.',
        ),
        N(
          '十位的 8 大于 0，所以 5,480 更大。',
          'Eight tens are greater than zero tens, so 5,480 is larger.',
        ),
      ],
      { accepted: ['5480', '5,480'], rejected: ['5408', '548', '8'] },
    ),
    questions: [
      choice(
        'B01-L03-Q1',
        N(
          '比较 39,999 与 40,001，哪一个判断正确？',
          'Which comparison of 39,999 and 40,001 is correct?',
        ),
        0,
        lineSkill,
        [
          {
            text: N('39,999 < 40,001', '39,999 < 40,001'),
            feedback: N(
              '先比较万位的 3 和 4。',
              'Compare the ten-thousands digits 3 and 4 first.',
            ),
          },
          {
            text: N('39,999 > 40,001', '39,999 > 40,001'),
            feedback: N(
              '后面的 9 不能超过更高数位多出的一个万。',
              'The trailing 9s cannot outweigh an extra ten-thousand.',
            ),
          },
          {
            text: N('两者相等', 'They are equal'),
            feedback: N(
              '两个数的最高数位已经不同。',
              'Their highest places already differ.',
            ),
          },
        ],
        [
          N(
            '两个数都是五位数，从左边开始比较。',
            'Both have five digits; compare from the left.',
          ),
          N(
            '万位不同，就不必用个位来决定。',
            'Once ten-thousands differs, ones cannot decide the order.',
          ),
        ],
        [
          N(
            '39,999 的万位是 3，40,001 的万位是 4。',
            'The ten-thousands digits are 3 and 4.',
          ),
          N('因此 39,999 < 40,001。', 'Therefore 39,999 < 40,001.'),
        ],
      ),
      num(
        'B01-L03-Q2',
        N(
          '从小到大排序 7,306、7,360、7,036，中间的数是什么？',
          'Order 7,306, 7,360 and 7,036 from least to greatest. What is the middle number?',
        ),
        '7306',
        lineSkill,
        [
          N(
            '都在 7,000 多，比较百位。',
            'All are seven-thousand something; compare hundreds.',
          ),
          N(
            '7,036 最小；剩下两个比较十位。',
            '7,036 is smallest; compare tens in the other two.',
          ),
        ],
        [
          N('7,036 < 7,306 < 7,360。', '7,036 < 7,306 < 7,360.'),
          N('中间是 7,306。', 'The middle number is 7,306.'),
        ],
        { accepted: ['7306', '7,306'], rejected: ['7036', '7360', '730'] },
      ),
      num(
        'B01-L03-Q3',
        N(
          '数轴每格是 20，点 P 在 500 右边第 3 格的终点。P 是多少？',
          'Each interval is 20. Point P is three intervals right of 500. What is P?',
        ),
        '560',
        lineSkill,
        [
          N(
            '先求三格表示多少。',
            'Find the distance represented by three intervals.',
          ),
          N('从 500 加上 3 × 20。', 'Add 3 × 20 to 500.'),
        ],
        [
          N('三格为 3 × 20 = 60。', 'Three intervals represent 3 × 20 = 60.'),
          N('500 + 60 = 560。', '500 + 60 = 560.'),
        ],
        { accepted: ['560', '560.0'], rejected: ['503', '540', '580'] },
        {
          kind: 'axis',
          start: 500,
          end: 600,
          divisions: 5,
          point: 560,
          label: 'P',
        },
      ),
      num(
        'B01-L03-Q4',
        N(
          '9,870 和 9,807 的差是多少？可以用数轴检查。',
          'What is the difference between 9,870 and 9,807? Use a number line to check.',
        ),
        '63',
        lineSkill,
        [
          N(
            '都在 9,800 多，只比较剩下的部分。',
            'Both are 9,800 plus something; compare the remaining parts.',
          ),
          N(
            '从 9,807 走到 9,870，距离就是差。',
            'The distance from 9,807 to 9,870 is their difference.',
          ),
        ],
        [
          N(
            '9,807 到 9,810 是 3；9,810 到 9,870 是 60。',
            'From 9,807 to 9,810 is 3, then to 9,870 is 60.',
          ),
          N('3 + 60 = 63。', '3 + 60 = 63.'),
        ],
        { accepted: ['63', '63.0'], rejected: ['27', '73', '9870'] },
      ),
      num(
        'B01-L03-Q5',
        N(
          '两个箱子各标着 9,999 件和 10,002 件。哪个箱子的数量更大？写出较大的数。',
          'Two crates are labelled 9,999 items and 10,002 items. Write the larger number.',
        ),
        '10002',
        lineSkill,
        [
          N(
            '一万个比九千多个大。',
            'Ten-thousand something is greater than nine-thousand something.',
          ),
          N(
            '位数不同，先比较最高数位。',
            'With different lengths, consider the highest place first.',
          ),
        ],
        [
          N(
            '9,999 比 10,000 少 1；10,002 比 10,000 多 2。',
            '9,999 is one below 10,000; 10,002 is two above it.',
          ),
          N('因此较大的数为 10,002。', 'The larger number is 10,002.'),
        ],
        { accepted: ['10002', '10,002'], rejected: ['9999', '1002', '3'] },
      ),
      reasoning(
        'B01-L03-Q6',
        N(
          '一条数轴上 0、10、20 的间距相同，可是 20 到 30 的间距只剩一半。还能用图上的距离比较差值吗？',
          'A number line spaces 0, 10 and 20 equally, but puts 30 only half as far from 20. Can you use drawn distances to compare differences?',
        ),
        lineSkill,
        N(
          '不能。相同的数值差 10 应对应相同长度；这个图不是统一刻度。应重画等距刻度或按数值计算，不能因为最后一段画得短就说 30−20 更小。',
          'No. Equal numerical differences of ten must have equal drawn lengths. The scale is inconsistent. Redraw equal intervals or use the numbers; a shorter drawn last segment does not make 30−20 smaller.',
        ),
        [
          N(
            '比较相邻两个刻度的数值差。',
            'Compare the numerical differences between neighbouring marks.',
          ),
          N(
            '同样增加 10，图上的长度应该怎样？',
            'What drawn length should represent each increase of ten?',
          ),
        ],
      ),
    ],
    exit: num(
      'B01-L03-X',
      N(
        '山道里程数轴每格为 50 米，从 1,000 米向右走 4 格到哪个数？',
        'On a trail-distance number line each interval is 50 metres. Move four intervals right from 1,000. What number do you reach?',
      ),
      '1200',
      lineSkill,
      [
        N('四格共有 4 × 50 米。', 'Four intervals represent 4 × 50 metres.'),
        N('起点不是 0，要加上 1,000。', 'The start is not zero; add 1,000.'),
      ],
      [
        N('4 × 50 = 200。', '4 × 50 = 200.'),
        N('1,000 + 200 = 1,200。', '1,000 + 200 = 1,200.'),
      ],
      { accepted: ['1200', '1,200'], rejected: ['200', '1050', '1250'] },
    ),
    exitReason: N(
      '解释：怎样知道应该数区间，而不是把起点也算成一格？',
      'Explain: why do you count intervals rather than count the starting mark as one interval?',
    ),
    parent: {
      goal: N(
        '从最高不同数位决定大小；刻度间隔与距离必须对应。',
        'Use the highest differing place and match intervals to numerical distances.',
      ),
      misconception: N(
        '只看最后一位，或数刻度点而不是区间。',
        'Using the last digit alone or counting marks rather than intervals.',
      ),
      prompts: [
        N(
          '从左边比较，第一次不同在哪一位？',
          'Which place first differs when comparing from the left?',
        ),
        N(
          '每走一格，数增加多少？',
          'How much does the number increase per interval?',
        ),
      ],
      bridge: 'B01-L02',
    },
  }),
  b01Lesson({
    id: 'B01-L04',
    title: N('四舍五入与合理估算', 'Rounding and reasonable estimation'),
    objective: N(
      '用相邻整十、整百或整千与中点解释四舍五入。',
      'Explain rounding with neighbouring tens, hundreds or thousands and their midpoint.',
    ),
    prerequisites: ['B01-L03'],
    keywords: [
      N('近似数', 'approximation'),
      N('中点', 'midpoint'),
      N('估算', 'estimation'),
    ],
    minutes: 15,
    lab: 'rounding',
    hook: N(
      '徒步距离是 3,465 米。说“大约 3,500 米”和“大约 3,000 米”一定有一个错吗？先看保留到哪一位，再比较两边的距离。',
      'A walk is 3,465 metres. Are “about 3,500” and “about 3,000” necessarily contradictory? Check the place being rounded, then compare distances.',
    ),
    guided: num(
      'B01-L04-G',
      N(
        '把 3,465 四舍五入到最接近的百。',
        'Round 3,465 to the nearest hundred.',
      ),
      '3500',
      roundSkill,
      [
        N(
          '先找两边相邻的整百：3,400 与 3,500。',
          'Find the neighbouring hundreds: 3,400 and 3,500.',
        ),
        N(
          '中点是 3,450；3,465 在中点哪边？',
          'The midpoint is 3,450. Which side contains 3,465?',
        ),
      ],
      [
        N(
          '到 3,400 的距离为 65；到 3,500 的距离为 35。',
          'The distances are 65 to 3,400 and 35 to 3,500.',
        ),
        N(
          '更接近 3,500，所以近似数为 3,500。',
          'It is closer to 3,500, so the rounded value is 3,500.',
        ),
      ],
      { accepted: ['3500', '3,500'], rejected: ['3400', '3000', '3460'] },
    ),
    questions: [
      choice(
        'B01-L04-Q1',
        N(
          '2,750 到最近的百，正好在中点。按本课“四舍五入”规则应取什么？',
          '2,750 is exactly halfway between hundreds. Using this lesson’s half-up rule, what is its rounded value?',
        ),
        1,
        roundSkill,
        [
          {
            text: N('2,700', '2,700'),
            feedback: N(
              '距离相同，但本课正好一半时取较大的相邻整百。',
              'The distances tie, but this lesson rounds a halfway value to the upper hundred.',
            ),
          },
          {
            text: N('2,800', '2,800'),
            feedback: N(
              '中点 2,750 按约定向上取 2,800。',
              'By the half-up convention, the midpoint goes to 2,800.',
            ),
          },
          {
            text: N('3,000', '3,000'),
            feedback: N(
              '3,000 是到最近的千；题目要求最近的百。',
              '3,000 rounds to a thousand; the question asks for a hundred.',
            ),
          },
        ],
        [
          N(
            '先核对要保留到“百”，不是“千”。',
            'Check that the requested unit is hundreds, not thousands.',
          ),
          N(
            '本课中点规则：正好一半，取较大的相邻整数倍。',
            'For a halfway tie, this lesson chooses the larger neighbouring multiple.',
          ),
        ],
        [
          N(
            '相邻整百是 2,700 与 2,800，中点为 2,750。',
            'The neighbouring hundreds are 2,700 and 2,800; their midpoint is 2,750.',
          ),
          N(
            '正好在中点，按约定取 2,800。',
            'At the midpoint, the convention gives 2,800.',
          ),
        ],
      ),
      num(
        'B01-L04-Q2',
        N('把 6,244 四舍五入到最近的十。', 'Round 6,244 to the nearest ten.'),
        '6240',
        roundSkill,
        [
          N(
            '相邻整十是 6,240 与 6,250。',
            'The neighbouring tens are 6,240 and 6,250.',
          ),
          N('中点为 6,245。', 'The midpoint is 6,245.'),
        ],
        [
          N('6,244 小于中点 6,245。', '6,244 is below midpoint 6,245.'),
          N(
            '它离 6,240 更近，近似为 6,240。',
            'It is closer to 6,240, so round to 6,240.',
          ),
        ],
        { accepted: ['6240', '6,240'], rejected: ['6250', '6200', '6000'] },
      ),
      num(
        'B01-L04-Q3',
        N('把 9,995 四舍五入到最近的十。', 'Round 9,995 to the nearest ten.'),
        '10000',
        roundSkill,
        [
          N('两边是 9,990 和 10,000。', 'Its neighbours are 9,990 and 10,000.'),
          N(
            '正好在中点，向上会发生进位。',
            'It is exactly halfway; rounding up carries to a new place.',
          ),
        ],
        [
          N('9,995 距离两边都是 5。', '9,995 is five from either neighbour.'),
          N(
            '正好一半取 10,000；不是写成 9,910。',
            'A halfway tie gives 10,000, not 9,910.',
          ),
        ],
        { accepted: ['10000', '10,000'], rejected: ['9990', '9910', '9995'] },
      ),
      num(
        'B01-L04-Q4',
        N(
          '把 3,465 四舍五入到最近的千。',
          'Round 3,465 to the nearest thousand.',
        ),
        '3000',
        roundSkill,
        [
          N(
            '整千邻居是 3,000 与 4,000。',
            'The neighbouring thousands are 3,000 and 4,000.',
          ),
          N('中点是 3,500，不是 3,450。', 'The midpoint is 3,500, not 3,450.'),
        ],
        [
          N('3,465 小于中点 3,500。', '3,465 is below midpoint 3,500.'),
          N('因此到最近的千为 3,000。', 'So the nearest thousand is 3,000.'),
        ],
        { accepted: ['3000', '3,000'], rejected: ['3500', '4000', '3460'] },
      ),
      num(
        'B01-L04-Q5',
        N(
          '两天步行 1,980 米和 3,040 米。先各自估到最近的百，再估合计是多少米？',
          'You walk 1,980 and 3,040 metres on two days. Round each to the nearest hundred, then estimate the total.',
        ),
        '5000',
        roundSkill,
        [
          N(
            '先分别取近似数，不是先算精确合计。',
            'Round each distance before adding.',
          ),
          N(
            '1,980 约为 2,000；3,040 约为 3,000。',
            '1,980 rounds to 2,000; 3,040 rounds to 3,000.',
          ),
        ],
        [
          N('2,000 + 3,000 = 5,000。', '2,000 + 3,000 = 5,000.'),
          N(
            '精确合计 5,020 与估计接近；5,000 是估计，不是精确值。',
            'The exact total 5,020 is close; 5,000 is an estimate, not an exact value.',
          ),
        ],
        { accepted: ['5000', '5,000'], rejected: ['5020', '5040', '500'] },
      ),
      reasoning(
        'B01-L04-Q6',
        N(
          '“4,499 到最近的千是 5,000，因为我先到百得到 4,500，再到千。”这个方法可靠吗？',
          '“4,499 rounds to 5,000 at the nearest thousand because I first round to 4,500 at hundreds.” Is that method reliable?',
        ),
        roundSkill,
        N(
          '不可靠，会发生双重舍入。直接比较 4,000 与 5,000 的中点 4,500：4,499 在中点下方，正确为 4,000。接受数轴或距离 499 与 501 的解释，不要求术语。',
          'It is unreliable because of double rounding. Compare directly with the midpoint 4,500 between 4,000 and 5,000: 4,499 is below, so round to 4,000. Accept a number line or distances 499 and 501; the term “double rounding” is not required.',
        ),
        [
          N(
            '先直接找整千邻居和中点。',
            'Find the neighbouring thousands and midpoint directly.',
          ),
          N(
            '第一次四舍五入是否已经改变了原数？',
            'Did the first rounding step already change the original value?',
          ),
        ],
      ),
    ],
    exit: num(
      'B01-L04-X',
      N(
        '步道牌记录 7,850 米。用于一份精确到百米的简报，四舍五入后写多少米？',
        'A trail sign records 7,850 metres. A report rounds distances to the nearest hundred metres. What should it show?',
      ),
      '7900',
      roundSkill,
      [
        N(
          '相邻整百是 7,800 与 7,900。',
          'The neighbouring hundreds are 7,800 and 7,900.',
        ),
        N('7,850 正好在中点。', '7,850 is exactly at the midpoint.'),
      ],
      [
        N(
          '正好一半，本课约定向上取整百。',
          'At a halfway tie, this lesson uses the upper hundred.',
        ),
        N(
          '记录约 7,900 米，并保留原始精确值 7,850 米。',
          'Report about 7,900 metres, keeping the exact original value 7,850 metres.',
        ),
      ],
      { accepted: ['7900', '7,900'], rejected: ['7800', '8000', '7850'] },
    ),
    exitReason: N(
      '解释：为什么这里用“约”，以及为什么必须说清楚保留到百位？',
      'Explain: why do we say “about”, and why must the rounding unit be stated?',
    ),
    parent: {
      goal: N(
        '能从邻居和中点解释规则，并区分精确值与估计。',
        'Explain the rule using neighbours and a midpoint, distinguishing exact values from estimates.',
      ),
      misconception: N(
        '没看保留数位、忘记进位，或连续两次舍入改变结果。',
        'Ignoring the rounding unit, missing a carry, or using double rounding.',
      ),
      prompts: [
        N(
          '两边最近的整百（或整千）是哪两个？',
          'Which are the neighbouring hundreds or thousands?',
        ),
        N(
          '离哪边更近？正好一样远时怎么约定？',
          'Which is closer? What is our convention for a tie?',
        ),
      ],
      bridge: 'B01-L03',
    },
  }),
  b01Lesson({
    id: 'B01-L05',
    title: N('用图画解释数的大小', 'Explaining number size with diagrams'),
    objective: N(
      '用百、十、一的积木说明数的大小和换组前后的守恒。',
      'Use hundreds, tens and ones blocks to explain magnitude and preserve value during regrouping.',
    ),
    prerequisites: ['B01-L02', 'B01-L03'],
    keywords: [
      N('十进制积木', 'base-ten blocks'),
      N('换组', 'regrouping'),
      N('同值', 'same value'),
    ],
    minutes: 15,
    lab: 'regroup',
    hook: N(
      '243 可以画成 2 个百、4 个十、3 个一。如果把一个百换成十条“十”，总数真的会变大吗？先猜，再交换积木。',
      '243 can be shown as two hundreds, four tens and three ones. If one hundred is exchanged for ten tens, does the total grow? Predict, then exchange blocks.',
    ),
    guided: num(
      'B01-L05-G',
      N(
        '3 个百、2 个十、5 个一，表示什么数？',
        'What number is represented by 3 hundreds, 2 tens and 5 ones?',
      ),
      '325',
      modelSkill,
      [
        N(
          '块数不能直接相加，因为每种块代表不同数量。',
          'Do not just add the block counts; each kind has a different value.',
        ),
        N('3 × 100 + 2 × 10 + 5 × 1。', '3 × 100 + 2 × 10 + 5 × 1.'),
      ],
      [
        N(
          '3 个百为 300，2 个十为 20，5 个一为 5。',
          'Three hundreds are 300; two tens are 20; five ones are 5.',
        ),
        N('300 + 20 + 5 = 325。', '300 + 20 + 5 = 325.'),
      ],
      { accepted: ['325', '325.0'], rejected: ['10', '352', '3025'] },
    ),
    questions: [
      choice(
        'B01-L05-Q1',
        N(
          '下面哪一组积木与 230 表示同样多？',
          'Which blocks have the same value as 230?',
        ),
        2,
        modelSkill,
        [
          {
            text: N('2 个百、3 个一', '2 hundreds and 3 ones'),
            feedback: N(
              '这是 203，三个一不是三个十。',
              'This is 203; three ones are not three tens.',
            ),
          },
          {
            text: N('23 个百', '23 hundreds'),
            feedback: N(
              '23 × 100 = 2,300，比 230 多十倍。',
              '23 × 100 = 2,300, ten times 230.',
            ),
          },
          {
            text: N('1 个百、13 个十', '1 hundred and 13 tens'),
            feedback: N(
              '100 + 130 = 230，换组后数量不变。',
              '100 + 130 = 230; regrouping preserves the quantity.',
            ),
          },
        ],
        [
          N(
            '每种块都先换成它表示的数量。',
            'Convert each block kind to the amount it represents.',
          ),
          N(
            '十条“十”可换成一个“百”。',
            'Ten tens can be exchanged for one hundred.',
          ),
        ],
        [
          N(
            '1 × 100 + 13 × 10 = 100 + 130。',
            '1 × 100 + 13 × 10 = 100 + 130.',
          ),
          N('合计仍是 230。', 'The total is still 230.'),
        ],
      ),
      num(
        'B01-L05-Q2',
        N(
          '图上有 4 个百、0 个十、6 个一。总数是多少？',
          'A diagram has 4 hundreds, 0 tens and 6 ones. What is the total?',
        ),
        '406',
        modelSkill,
        [
          N(
            '十位没有块，需要写 0。',
            'There are no tens blocks; keep a zero in tens.',
          ),
          N('400 + 0 + 6。', '400 + 0 + 6.'),
        ],
        [
          N(
            '百、十、一的位值不能挤到一起。',
            'Keep hundreds, tens and ones in their places.',
          ),
          N('400 + 6 = 406。', '400 + 6 = 406.'),
        ],
        { accepted: ['406', '406.0'], rejected: ['46', '460', '10'] },
        { kind: 'place', value: 406, places: 3 },
      ),
      num(
        'B01-L05-Q3',
        N(
          '把 1 个百全部换成十条“十”。这十条一共表示多少？',
          'Exchange one hundred for ten tens. What total value do the ten tens represent?',
        ),
        '100',
        modelSkill,
        [
          N('每条“十”都代表 10 个一。', 'Each ten represents ten ones.'),
          N('10 条，每条 10。', 'Ten rods, each worth ten.'),
        ],
        [
          N('10 × 10 = 100。', '10 × 10 = 100.'),
          N(
            '换组改变了形状和块数，却没有改变总数。',
            'Regrouping changes shapes and block counts, but not the total value.',
          ),
        ],
        { accepted: ['100', '100.0'], rejected: ['10', '1000', '11'] },
      ),
      num(
        'B01-L05-Q4',
        N(
          '2 个百、14 个十、3 个一合起来是多少？',
          'What is the total of 2 hundreds, 14 tens and 3 ones?',
        ),
        '343',
        modelSkill,
        [
          N(
            '十四个十表示 140，不是 14。',
            'Fourteen tens represent 140, not 14.',
          ),
          N(
            '可把十个十换成一个百，剩四个十。',
            'Exchange ten tens for a hundred, leaving four tens.',
          ),
        ],
        [
          N('200 + 140 + 3 = 343。', '200 + 140 + 3 = 343.'),
          N(
            '同值标准分组为 3 个百、4 个十、3 个一。',
            'The standard grouping is three hundreds, four tens and three ones.',
          ),
        ],
        { accepted: ['343', '343.0'], rejected: ['217', '2143', '243'] },
      ),
      num(
        'B01-L05-Q5',
        N(
          '甲箱有 2 个百、3 个十；乙箱有 2 个百、3 个一。甲比乙多多少？',
          'Crate A has 2 hundreds and 3 tens; crate B has 2 hundreds and 3 ones. How much more does A have?',
        ),
        '27',
        modelSkill,
        [
          N(
            '两边的两个百相同，可以先不比。',
            'Both have two hundreds, so compare the remaining parts.',
          ),
          N('甲剩 30，乙剩 3。', 'The remaining values are 30 and 3.'),
        ],
        [
          N('甲是 230，乙是 203。', 'A has 230; B has 203.'),
          N('230 − 203 = 30 − 3 = 27。', '230 − 203 = 30 − 3 = 27.'),
        ],
        { accepted: ['27', '27.0'], rejected: ['0', '3', '30'] },
      ),
      reasoning(
        'B01-L05-Q6',
        N(
          '小安说“换成更多小块后，数字一定更大”。用 1 个百换 10 个十的图解释为什么不对。',
          'Ari says “More blocks must mean a larger number.” Use one hundred exchanged for ten tens to explain why that is false.',
        ),
        modelSkill,
        N(
          '应说明必须比较每块代表多少：一个百有 100 个单位，十条十也有 100 个单位。块数从 1 到 10，但总单位数不变。接受等量图、算式 100 = 10×10，或自己的语言。',
          'Compare the value of each block: one hundred contains 100 units and ten tens also contain 100 units. Block count changes from one to ten; the total units stay the same. Accept a diagram, 100 = 10×10, or the learner’s own explanation.',
        ),
        [
          N(
            '先说明每一种块代表多少个一。',
            'State how many ones each block kind represents.',
          ),
          N(
            '数“块”与数“单位数量”有什么不同？',
            'How does counting blocks differ from counting their total units?',
          ),
        ],
      ),
    ],
    exit: num(
      'B01-L05-X',
      N(
        '一份物资原来是 4 个百、3 个十、7 个一。把 1 个百换成 10 个十后，总数是多少？',
        'Supplies are represented by 4 hundreds, 3 tens and 7 ones. After exchanging one hundred for ten tens, what is the total?',
      ),
      '437',
      modelSkill,
      [
        N('换组应该保留总数。', 'An exchange should preserve the total.'),
        N(
          '新表示为 3 个百、13 个十、7 个一。',
          'The new grouping is three hundreds, thirteen tens and seven ones.',
        ),
      ],
      [
        N(
          '3 × 100 + 13 × 10 + 7 = 300 + 130 + 7。',
          '3 × 100 + 13 × 10 + 7 = 300 + 130 + 7.',
        ),
        N('总数仍为 437。', 'The total remains 437.'),
      ],
      { accepted: ['437', '437.0'], rejected: ['447', '337', '4137'] },
    ),
    exitReason: N(
      '解释：为什么块的数量增加了，总单位数却没有增加？',
      'Explain: why did the number of blocks increase without increasing their total value?',
    ),
    familyChallenge: N(
      '家庭挑战：用纸画百方格、十条和一小格，表示家里的一个三位数。至少画出两种等值分组，请家人用不同方法算总数。不计分；把两幅图或一句发现记在便签里。',
      'Family challenge: draw hundred squares, ten rods and single squares to show a three-digit number from home. Create two equivalent groupings and ask a family member to total them differently. No score; record a drawing or a discovery in your note.',
    ),
    parent: {
      goal: N(
        '图的每个单位具有明确含义，换组前后总单位数守恒。',
        'Each visual unit has a clear value, and regrouping conserves the total units.',
      ),
      misconception: N(
        '把不同大小的块都当成一个单位数，或把更多块误当更多数量。',
        'Treating every block as one equal unit, or assuming more blocks always mean a larger amount.',
      ),
      prompts: [
        N(
          '这一块相当于多少个小方格？',
          'How many small unit squares does this block represent?',
        ),
        N(
          '换组前后，全部小方格一样多吗？',
          'Are there the same number of total unit squares before and after exchange?',
        ),
      ],
      bridge: 'B01-L02',
    },
  }),
];
export function b01ReviewQuestion(lessonId: string, round: number): Question {
  const cycle = round % 80,
    id = `${lessonId}-R${round}`;
  switch (lessonId) {
    case 'B01-L01': {
      const thousands = 31 + cycle,
        value = thousands * 1000 + 7;
      return num(
        id,
        N(
          `“${thousands} 个千加 7 个一”写成数字。`,
          `Write ${thousands} thousands plus 7 ones as one number.`,
        ),
        String(value),
        numberSkill,
        [
          N(
            '百位和十位没有，仍要占位。',
            'Keep zero placeholders in hundreds and tens.',
          ),
          N(
            '千的个数乘 1,000，再加 7。',
            'Multiply the thousands count by 1,000, then add 7.',
          ),
        ],
        [
          N(
            `${thousands} × 1,000 + 7 = ${value}。`,
            `${thousands} × 1,000 + 7 = ${value}.`,
          ),
        ],
        {
          accepted: [String(value), value.toLocaleString('en-NZ')],
          rejected: [String(thousands * 100 + 7)],
        },
      );
    }
    case 'B01-L02': {
      const digit = 2 + (cycle % 7),
        value = digit * 1000 + 105;
      return num(
        id,
        N(
          `${value.toLocaleString('en-NZ')} 中最左边的数字表示多少？`,
          `What is the value of the leftmost digit in ${value.toLocaleString('en-NZ')}?`,
        ),
        String(digit * 1000),
        placeSkill,
        [
          N(
            '从右向左定位，最左边在千位。',
            'Count places from the right; the leftmost is in thousands.',
          ),
          N('数字乘 1,000。', 'Multiply the digit by 1,000.'),
        ],
        [
          N(
            `${digit} × 1,000 = ${digit * 1000}。`,
            `${digit} × 1,000 = ${digit * 1000}.`,
          ),
        ],
        {
          accepted: [String(digit * 1000)],
          rejected: [String(digit), String(digit * 100)],
        },
      );
    }
    case 'B01-L03': {
      const start = 200 + cycle * 100,
        answer = start + 60;
      return num(
        id,
        N(
          `数轴从 ${start} 开始，每格 15；向右走 4 格到哪里？`,
          `A number line starts at ${start}; each interval is 15. Move four intervals right. What is reached?`,
        ),
        String(answer),
        lineSkill,
        [
          N('四格的距离为 4 × 15。', 'Four intervals cover 4 × 15.'),
          N('距离要加在起点上。', 'Add that distance to the starting value.'),
        ],
        [
          N(
            `${start} + 4 × 15 = ${answer}。`,
            `${start} + 4 × 15 = ${answer}.`,
          ),
        ],
        { accepted: [String(answer)], rejected: ['60', String(start + 45)] },
      );
    }
    case 'B01-L04': {
      const value = 1245 + cycle * 100,
        answer = 1240 + cycle * 100;
      return num(
        id,
        N(
          `把 ${value.toLocaleString('en-NZ')} 四舍五入到最近的十。`,
          `Round ${value.toLocaleString('en-NZ')} to the nearest ten.`,
        ),
        String(answer + 10),
        roundSkill,
        [
          N(
            '个位是 5，正好在中点。',
            'The ones digit is five, exactly halfway.',
          ),
          N(
            '正好一半取较大的整十。',
            'Take the upper ten for this halfway tie.',
          ),
        ],
        [
          N(
            `相邻整十是 ${answer} 与 ${answer + 10}。`,
            `The neighbouring tens are ${answer} and ${answer + 10}.`,
          ),
          N(
            `按约定取 ${answer + 10}。`,
            `The convention gives ${answer + 10}.`,
          ),
        ],
        {
          accepted: [String(answer + 10)],
          rejected: [String(answer), String(value)],
        },
      );
    }
    case 'B01-L05': {
      const h = 1 + (cycle % 5),
        te = 11 + (cycle % 8),
        one = cycle % 10,
        value = h * 100 + te * 10 + one;
      return num(
        id,
        N(
          `${h} 个百、${te} 个十、${one} 个一，合计多少？`,
          `What is the total of ${h} hundreds, ${te} tens and ${one} ones?`,
        ),
        String(value),
        modelSkill,
        [
          N(
            '十的条数超过 9 也可以，先算它们的值。',
            'More than nine tens are allowed; calculate their value.',
          ),
          N(
            '把每类块的数量乘上 100、10、1。',
            'Multiply each block count by 100, 10 or 1.',
          ),
        ],
        [
          N(
            `${h} × 100 + ${te} × 10 + ${one} = ${value}。`,
            `${h} × 100 + ${te} × 10 + ${one} = ${value}.`,
          ),
        ],
        {
          accepted: [String(value)],
          rejected: [String(h + te + one), String(h * 100 + te + one)],
        },
      );
    }
    default:
      throw new Error(`Unknown B01 lesson: ${lessonId}`);
  }
}

export const b01CheckQuestions: Question[] = [
  num(
    'B01-CHECK-Q1',
    N(
      '“九万零三百二十”写成数字。',
      'Write “ninety thousand three hundred and twenty” in digits.',
    ),
    '90320',
    numberSkill,
    [
      N(
        '万位为 9，百位为 3，十位为 2。',
        'Ten-thousands has 9, hundreds 3 and tens 2.',
      ),
      N('千位和个位要保留 0。', 'Keep zeros in thousands and ones.'),
    ],
    [N('90,000 + 300 + 20 = 90,320。', '90,000 + 300 + 20 = 90,320.')],
    { accepted: ['90320', '90,320'], rejected: ['9320', '9032', '93020'] },
  ),
  num(
    'B01-CHECK-Q2',
    N('70,806 中的 8 表示多少？', 'What is the value of the 8 in 70,806?'),
    '800',
    placeSkill,
    [
      N('从个位向左定位 8。', 'Locate 8 by counting places from ones.'),
      N('8 在百位。', '8 is in hundreds.'),
    ],
    [N('8 × 100 = 800。', '8 × 100 = 800.')],
    { accepted: ['800', '800.0'], rejected: ['8', '80', '8000'] },
  ),
  num(
    'B01-CHECK-Q3',
    N(
      '6,090 与 6,900 中，较小的数是多少？',
      'Which is smaller: 6,090 or 6,900?',
    ),
    '6090',
    lineSkill,
    [
      N('千位相同，比较百位。', 'Thousands match; compare hundreds.'),
      N('0 个百小于 9 个百。', 'Zero hundreds are fewer than nine hundreds.'),
    ],
    [
      N(
        '6,090 的百位为 0，6,900 的百位为 9。',
        'The hundreds digits are 0 and 9.',
      ),
      N('较小的是 6,090。', 'The smaller number is 6,090.'),
    ],
    { accepted: ['6090', '6,090'], rejected: ['6900', '609', '90'] },
  ),
  num(
    'B01-CHECK-Q4',
    N(
      '看数轴，点 P 的值是多少？',
      'Read the number line. What is the value of P?',
    ),
    '450',
    lineSkill,
    [
      N('300 到 500 分成四格。', '300 to 500 is divided into four intervals.'),
      N(
        '每格 50，P 在起点之后第三格的终点。',
        'Each interval is 50; P is three intervals after the start.',
      ),
    ],
    [
      N(
        '每格 = (500 − 300) ÷ 4 = 50。',
        'Each interval is (500 − 300) ÷ 4 = 50.',
      ),
      N('300 + 3 × 50 = 450。', '300 + 3 × 50 = 450.'),
    ],
    { accepted: ['450', '450.0'], rejected: ['350', '400', '150'] },
    {
      kind: 'axis',
      start: 300,
      end: 500,
      divisions: 4,
      point: 450,
      label: 'P',
    },
  ),
  num(
    'B01-CHECK-Q5',
    N('把 8,467 四舍五入到最近的百。', 'Round 8,467 to the nearest hundred.'),
    '8500',
    roundSkill,
    [
      N(
        '相邻整百是 8,400 与 8,500。',
        'The neighbouring hundreds are 8,400 and 8,500.',
      ),
      N('中点为 8,450。', 'The midpoint is 8,450.'),
    ],
    [
      N(
        '8,467 在中点上方，离 8,500 更近。',
        '8,467 is above the midpoint and closer to 8,500.',
      ),
      N('近似为 8,500。', 'Round to 8,500.'),
    ],
    { accepted: ['8500', '8,500'], rejected: ['8400', '8000', '8470'] },
  ),
  num(
    'B01-CHECK-Q6',
    N(
      '2 个百、13 个十、6 个一，总数是多少？',
      'What is the total of two hundreds, thirteen tens and six ones?',
    ),
    '336',
    modelSkill,
    [
      N('十三个十的值是 130。', 'Thirteen tens have value 130.'),
      N('一个百可由十个十组成。', 'Ten tens can form one hundred.'),
    ],
    [N('200 + 130 + 6 = 336。', '200 + 130 + 6 = 336.')],
    { accepted: ['336', '336.0'], rejected: ['219', '2136', '236'] },
  ),
  reasoning(
    'B01-CHECK-Q7',
    N(
      '用位值表或积木解释：7,005 和 7,050 是不是同一个数？',
      'Use a place-value chart or blocks to explain whether 7,005 and 7,050 are the same number.',
    ),
    placeSkill,
    N(
      '不是。两者都有七个千，但剩下分别是五个一与五个十，差 45。解释必须提到 5 所在的不同数位；允许图、自己的语言或 7,000+5 与 7,000+50。仅写“不一样”还需追问。',
      'No. Both have seven thousands, but the remainder is five ones versus five tens, a difference of 45. The reasoning must identify the different places of 5. Accept a diagram, the learner’s words, or 7,000+5 versus 7,000+50. “Not equal” alone needs a follow-up.',
    ),
    [
      N('把个位右对齐，找两个 5 的位置。', 'Align ones and locate the two 5s.'),
      N(
        '相同的七个千以外，各剩下多少？',
        'After the matching seven thousands, what remains?',
      ),
    ],
  ),
];
