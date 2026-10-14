import { t, type Lesson, type Question } from './model';
import curriculumData from '../../../content/curriculum.json';
export const curriculum = curriculumData;
const q = (
  id: string,
  zh: string,
  en: string,
  value: string,
  hintZh: string,
  hintEn: string,
  solutionZh: string,
  solutionEn: string,
  skill: string,
  options?: string[],
  unit?: 'NZD' | 'cm²',
): Question => ({
  id,
  stem: t(zh, en),
  answer: options ? { kind: 'choice', value } : { kind: 'number', value, unit },
  options: options?.map((text, i) => ({
    id: String(i),
    text: t(text.split(' / ')[0]!, text.split(' / ')[1] ?? text),
    feedback: t(
      `再检查“${text}”：整体、份数或位值是否对应？`,
      `Check “${text}”: does the whole, number of parts or place value match?`,
    ),
  })),
  hints: [
    t(hintZh, hintEn),
    t(
      '可以画图或回到探索模型，再试一次。',
      'Draw a diagram or return to the explorer, then try again.',
    ),
  ],
  solution: t(solutionZh, solutionEn),
  skill,
});
const explain = (
  id: string,
  zh: string,
  en: string,
  rubricZh: string,
  rubricEn: string,
  skill: string,
): Question => ({
  id,
  stem: t(zh, en),
  answer: { kind: 'explain', rubric: t(rubricZh, rubricEn) },
  hints: [
    t(
      '说说整体、份数或位值怎样帮助你判断。',
      'Explain how the whole, equal parts or place value help you decide.',
    ),
  ],
  solution: t(rubricZh, rubricEn),
  skill,
});
export const lessons: Lesson[] = [
  {
    id: 'B04-L01',
    title: t('整体与等份', 'Wholes and equal parts'),
    objective: t(
      '能找出整体，并用等份解释一个分数。',
      'Identify the whole and explain a fraction using equal parts.',
    ),
    prerequisites: [],
    keywords: [
      t('整体', 'whole'),
      t('等份', 'equal parts'),
      t('分母', 'denominator'),
    ],
    minutes: 12,
    lab: 'parts',
    hook: t(
      '把一块巧克力分给四个人。四块的大小不同，还能叫四等份吗？先猜一猜。',
      'Share one chocolate bar between four people. If the pieces differ in size, are they four equal parts? Make a prediction.',
    ),
    guided: q(
      'L01-G',
      '一块巧克力有 8 个相同方格，选中 3 格。选中了整体的几分之几？',
      'A chocolate bar has 8 equal squares. You select 3. What fraction is selected?',
      '3/8',
      '分母是整体的份数，分子是选中的份数。',
      'The denominator counts all equal parts; the numerator counts selected parts.',
      '整体分成 8 等份，选中 3 份，所以是 3/8。',
      'There are 8 equal parts and 3 are selected: 3/8.',
      'fraction',
    ),
    questions: [
      q(
        'L01-Q1',
        '分数的分母告诉我们什么？',
        'What does the denominator tell us?',
        '1',
        '它描述怎样分这个整体。',
        'It describes how the whole is divided.',
        '分母告诉我们整体被分成多少等份。',
        'The denominator gives the number of equal parts in the whole.',
        'fraction',
        [
          '选中的份数 / Selected parts',
          '整体的等份数 / Equal parts in the whole',
          '人数总数 / Number of people',
        ],
      ),
      q(
        'L01-Q2',
        '一条纸带分成 6 等份，涂色 2 份。写出涂色的分数。',
        'A strip has 6 equal parts; 2 are shaded. Write the shaded fraction.',
        '2/6',
        '先数总份数，再数涂色份数。',
        'Count all parts, then shaded parts.',
        '2 份 / 6 等份 = 2/6；1/3 也是等值答案。',
        '2 out of 6 gives 2/6; 1/3 is equivalent.',
        'fraction',
      ),
      q(
        'L01-Q3',
        '3/7 的分母是多少？',
        'What is the denominator of 3/7?',
        '7',
        '分数线下面的数。',
        'Look below the fraction bar.',
        '分母是 7，表示一个整体的 7 等份。',
        '7 is the denominator: seven equal parts in one whole.',
        'fraction',
      ),
      q(
        'L01-Q4',
        '一块巧克力有 10 个相同方格，吃了 4 格，剩下几分之几？',
        'A chocolate bar has 10 equal squares. You eat 4. What fraction remains?',
        '6/10',
        '先算剩下几格。',
        'Find how many squares remain first.',
        '10 − 4 = 6，剩下 6/10，也就是 3/5。',
        '10 − 4 = 6; 6/10 remains, equivalent to 3/5.',
        'fraction',
      ),
      explain(
        'L01-Q5',
        '小安把蛋糕切成大小不同的四块，说每块都是 1/4。你同意吗？解释原因。',
        'Ari cuts a cake into four unequal pieces and calls each 1/4. Do you agree? Explain.',
        '不同意。只有四块大小相等，每块才是整体的 1/4。',
        'No. Each piece is 1/4 only if all four pieces are equal in size.',
        'equal-parts',
      ),
    ],
    exit: q(
      'L01-X',
      '烤盘里的面包分成 12 个相同小块，拿走 5 块。拿走了整体的几分之几？',
      'Bread in a tray has 12 equal pieces; 5 are taken. What fraction is taken?',
      '5/12',
      '辨认同一个整体。',
      'Identify the whole.',
      '5 个小块 / 12 个相同小块 = 5/12。',
      '5 out of 12 equal pieces is 5/12.',
      'fraction',
    ),
    exitReason: t(
      '解释：为什么分母是 12，而不是 5？',
      'Explain: why is the denominator 12 rather than 5?',
    ),
    parent: {
      goal: t(
        '先指出整体，再解释必须大小相同。',
        'Identify the whole, then explain why parts must be equal.',
      ),
      misconception: t(
        '数了块数，却没检查大小是否相等。',
        'Counting pieces without checking equal size.',
      ),
      prompts: [
        t('我们把什么当作一个整体？', 'What are we calling one whole?'),
        t(
          '四块不一样大，每块还能叫四分之一吗？',
          'Can four unequal pieces each be a quarter?',
        ),
      ],
      bridge: 'B04-L01',
    },
  },
  {
    id: 'B04-L02',
    title: t('一半、三分之一与四分之一', 'Halves, thirds and quarters'),
    objective: t(
      '比较同一整体的单位分数，并解释份数越多每份越小。',
      'Compare unit fractions of the same whole and explain why more parts mean smaller pieces.',
    ),
    prerequisites: ['B04-L01'],
    keywords: [
      t('单位分数', 'unit fraction'),
      t('一半', 'half'),
      t('四分之一', 'quarter'),
    ],
    minutes: 15,
    lab: 'fractions',
    hook: t(
      '同一块巧克力，分给两人还是四人，每人拿得更多？把猜想变成分数条。',
      'Share the same chocolate bar between two people or four. Which gives each person more? Test your prediction with strips.',
    ),
    guided: q(
      'L02-G',
      '同一个整体：1/2 与 1/4，哪个更大？',
      'For the same whole, which is greater: 1/2 or 1/4?',
      '0',
      '两份与四份，每一份的大小会怎样？',
      'How does each piece change between two parts and four?',
      '同一个整体分得越多，每份越小，所以 1/2 > 1/4。',
      'More equal parts make smaller pieces, so 1/2 > 1/4.',
      'unit-fraction',
      ['1/2', '1/4'],
    ),
    questions: [
      q(
        'L02-Q1',
        '一张纸平均分成 3 份，每份是几分之几？',
        'One sheet is split into 3 equal parts. What fraction is one part?',
        '1/3',
        '单位分数的分子是 1。',
        'A unit fraction has numerator 1.',
        '一份 / 三等份 = 1/3。',
        'One of three equal parts is 1/3.',
        'unit-fraction',
      ),
      q(
        'L02-Q2',
        '一块蛋糕平均分给 4 人。两个人合起来得到整体的几分之几？',
        'A cake is shared equally among 4 people. What fraction do two people receive together?',
        '2/4',
        '每人一份，合计两份。',
        'Each person gets one part; together they get two.',
        '两份 / 四等份 = 2/4 = 1/2。',
        'Two of four equal parts is 2/4 = 1/2.',
        'fraction',
      ),
      q(
        'L02-Q3',
        '同一个整体，哪个单位分数最小？',
        'For the same whole, which unit fraction is smallest?',
        '2',
        '整体分得越多，每份越小。',
        'More equal parts make each part smaller.',
        '六等份中的一份最小：1/6。',
        'One of six equal parts is smallest: 1/6.',
        'unit-fraction',
        ['1/2', '1/3', '1/6'],
      ),
      q(
        'L02-Q4',
        '4 个四分之一合起来是多少个整体？',
        'How many wholes do four quarters make?',
        '1',
        '把四份全部合起来。',
        'Put all four parts together.',
        '4 × 1/4 = 4/4 = 1。',
        '4 × 1/4 = 4/4 = 1.',
        'unit-fraction',
      ),
      explain(
        'L02-Q5',
        '“分母 4 比 2 大，所以 1/4 比 1/2 大。”哪里错了？',
        '“4 is larger than 2, so 1/4 is larger than 1/2.” Find the mistake.',
        '同一个整体，分母大代表分成更多等份，每份更小；1/4 < 1/2。',
        'For the same whole, a larger denominator means more equal parts and a smaller piece; 1/4 < 1/2.',
        'unit-fraction',
      ),
    ],
    exit: q(
      'L02-X',
      '一条 1 米长的丝带分成 3 等份。每份是多少米？',
      'A 1-metre ribbon is split into 3 equal parts. How many metres is each piece?',
      '1/3',
      '长度是一个整体的一部分。',
      'Each length is a part of one whole.',
      '每份长 1/3 米。',
      'Each piece is 1/3 metre long.',
      'unit-fraction',
    ),
    exitReason: t(
      '如果改成 6 等份，每份会更长还是更短？为什么？',
      'If split into 6 equal parts, would each piece be longer or shorter? Why?',
    ),
    parent: {
      goal: t(
        '比较分数时说出“同一个整体”。',
        'Say “the same whole” when comparing fractions.',
      ),
      misconception: t(
        '把整数比较规则照搬到分母。',
        'Comparing denominators as if they were whole-number amounts.',
      ),
      prompts: [
        t('整体大小相同吗？', 'Are the wholes the same size?'),
        t(
          '多分一倍，每份怎样变？',
          'What happens when there are twice as many parts?',
        ),
      ],
      bridge: 'B04-L01',
    },
  },
  {
    id: 'B04-L03',
    title: t('分数放在数轴上', 'Fractions on a number line'),
    objective: t(
      '用 0 到 1 的等长区间定位分数。',
      'Locate fractions using equal intervals from 0 to 1.',
    ),
    prerequisites: ['B04-L01', 'B04-L02'],
    keywords: [
      t('数轴', 'number line'),
      t('区间', 'interval'),
      t('位置', 'position'),
    ],
    minutes: 15,
    lab: 'line',
    hook: t(
      '分数不只是蛋糕的一块。沿着一条 1 千米的步道走了 3/4，地图上你在哪里？',
      'Fractions are also numbers. You walk 3/4 of a 1-kilometre trail. Where are you on the map?',
    ),
    guided: q(
      'L03-G',
      '0 到 1 分成 4 个等长区间。从 0 向右走 3 格，到达哪个分数？',
      'From 0 to 1 there are 4 equal intervals. Move 3 intervals right from 0. What fraction is reached?',
      '3/4',
      '数区间，不要把 0 当成第一格。',
      'Count intervals; do not count 0 as the first interval.',
      '每格是 1/4，走 3 格是 3/4。',
      'Each interval is 1/4; three intervals give 3/4.',
      'number-line',
    ),
    questions: [
      q(
        'L03-Q1',
        '0 到 1 分成 5 个等长区间，第二个刻度的值是多少？',
        'Split 0 to 1 into 5 equal intervals. What is the second mark after 0?',
        '2/5',
        '每格长 1/5。',
        'Each interval is 1/5.',
        '走两格，位置为 2/5。',
        'Two intervals give 2/5.',
        'number-line',
      ),
      q(
        'L03-Q2',
        '0 到 1 分成 8 格，1/2 在第几格的终点？',
        'Split 0 to 1 into 8 equal intervals. After how many intervals do you reach 1/2?',
        '4',
        '一半也是 4/8。',
        'One half is 4/8.',
        '8 ÷ 2 = 4，走 4 格到达 1/2。',
        '8 ÷ 2 = 4; four intervals reach 1/2.',
        'number-line',
      ),
      q(
        'L03-Q3',
        '哪个分数在 1/2 的右边？',
        'Which fraction lies to the right of 1/2?',
        '1',
        '向右的数更大。',
        'Numbers increase to the right.',
        '3/4 大于 1/2，在其右边。',
        '3/4 is greater than 1/2, so it lies to the right.',
        'number-line',
        ['1/4', '3/4', '1/3'],
      ),
      q(
        'L03-Q4',
        '从 0 开始每次走 1/6，走 6 次到达哪个数？',
        'Start at 0 and move 1/6 six times. Which number is reached?',
        '1',
        '六个六分之一。',
        'Six sixths.',
        '6/6 = 1。',
        '6/6 = 1.',
        'number-line',
      ),
      explain(
        'L03-Q5',
        '0 到 1 有 5 个刻度（含两端），是不是分成了 5 等份？',
        'There are 5 marks from 0 to 1, including both ends. Are there 5 equal parts?',
        '不是。5 个刻度之间只有 4 个区间；等份应数区间。',
        'No. Five marks have four intervals between them; count the intervals.',
        'number-line',
      ),
    ],
    exit: q(
      'L03-X',
      '一条 1 千米步道分成 8 个等长区间。走过 5 个区间，完成全程的几分之几？',
      'A 1-kilometre trail has 8 equal intervals. You walk 5. What fraction of the trail is completed?',
      '5/8',
      '区间数是分母，走过的区间数是分子。',
      'Use total intervals as denominator and travelled intervals as numerator.',
      '走了 5/8 千米，完成全程的 5/8。',
      'You walked 5/8 kilometre, or 5/8 of the trail.',
      'number-line',
    ),
    exitReason: t(
      '解释你怎样从 0 开始数到这个位置。',
      'Explain how you counted from 0 to this position.',
    ),
    parent: {
      goal: t(
        '把分数理解成数轴上的数。',
        'Understand a fraction as a number on the line.',
      ),
      misconception: t(
        '数刻度点，而不是刻度之间的区间。',
        'Counting marks instead of intervals.',
      ),
      prompts: [
        t(
          '0 和第一个刻度之间算几份？',
          'How many parts lie between 0 and the first mark?',
        ),
        t('1/2 和 4/8 在哪里？', 'Where are 1/2 and 4/8?'),
      ],
      bridge: 'B04-L02',
    },
  },
  {
    id: 'B04-L04',
    title: t('十分位与百分位', 'Tenths and hundredths'),
    objective: t(
      '用百格板连接小数位值与分数。',
      'Connect decimal place value and fractions using a hundred grid.',
    ),
    prerequisites: ['B04-L01', 'B04-L03'],
    keywords: [
      t('十分位', 'tenths'),
      t('百分位', 'hundredths'),
      t('小数', 'decimal'),
    ],
    minutes: 15,
    lab: 'decimal',
    hook: t(
      '0.5 和 0.45，谁更大？小数位数更多不代表数更大。用同一个百格板验证。',
      'Which is greater, 0.5 or 0.45? More decimal digits do not mean a larger number. Test with the same hundred grid.',
    ),
    guided: q(
      'L04-G',
      '百格板涂了 35 格。用小数表示涂色部分。',
      '35 squares of a hundred grid are shaded. Write the shaded part as a decimal.',
      '0.35',
      '35 个百分之一。',
      '35 hundredths.',
      '35/100 = 0.35，3 个十分之一加 5 个百分之一。',
      '35/100 = 0.35: three tenths plus five hundredths.',
      'decimal',
    ),
    questions: [
      q(
        'L04-Q1',
        '7 个十分之一，用小数表示。',
        'Write seven tenths as a decimal.',
        '0.7',
        '十分位在小数点右边第一位。',
        'Tenths are the first place after the decimal point.',
        '7/10 = 0.7。',
        '7/10 = 0.7.',
        'decimal',
      ),
      q(
        'L04-Q2',
        '4 个百分之一，用小数表示。',
        'Write four hundredths as a decimal.',
        '0.04',
        '十分位没有，要用 0 占位。',
        'There are no tenths; use 0 as a placeholder.',
        '4/100 = 0.04。',
        '4/100 = 0.04.',
        'decimal',
      ),
      q(
        'L04-Q3',
        '0.5 和 0.45，哪个更大？',
        'Which is greater: 0.5 or 0.45?',
        '0',
        '把 0.5 写成 0.50。',
        'Write 0.5 as 0.50.',
        '0.50 是 50 个百分之一，大于 45 个百分之一。',
        '0.50 is 50 hundredths, greater than 45 hundredths.',
        'decimal',
        ['0.5', '0.45', '一样大 / Equal'],
      ),
      q(
        'L04-Q4',
        '0.6 等于多少个百分之一？',
        'How many hundredths equal 0.6?',
        '60',
        '一个十分之一等于 10 个百分之一。',
        'One tenth equals ten hundredths.',
        '6 × 10 = 60；0.6 = 0.60。',
        '6 × 10 = 60; 0.6 = 0.60.',
        'decimal',
      ),
      explain(
        'L04-Q5',
        '为什么 0.30 和 0.3 一样大？',
        'Why are 0.30 and 0.3 equal?',
        '30 个百分之一和 3 个十分之一，覆盖同一个整体的相同面积。',
        'Thirty hundredths and three tenths cover the same amount of the same whole.',
        'decimal',
      ),
    ],
    exit: q(
      'L04-X',
      '一米尺的 100 个等长小区间中，标出了 28 个。它占整体多少？用小数表示。',
      'A metre ruler has 100 equal intervals; 28 are marked. What part of the whole is marked? Write a decimal.',
      '0.28',
      '28 个百分之一。',
      '28 hundredths.',
      '28/100 = 0.28。',
      '28/100 = 0.28.',
      'decimal',
    ),
    exitReason: t(
      '解释 0.28 中的 2 和 8 分别代表什么。',
      'Explain what the 2 and the 8 in 0.28 represent.',
    ),
    parent: {
      goal: t(
        '十分位和百分位是不同大小的单位。',
        'Tenths and hundredths are units of different sizes.',
      ),
      misconception: t(
        '小数位越多就越大，或忽略 0 的占位。',
        'Assuming more digits means larger, or ignoring placeholder zeros.',
      ),
      prompts: [
        t('0.5 在百格板上涂几格？', 'How many squares show 0.5?'),
        t('0.04 与 0.4 有什么不同？', 'How do 0.04 and 0.4 differ?'),
      ],
      bridge: 'B04-L03',
    },
  },
  {
    id: 'B04-L05',
    title: t('钱币中的小数', 'Decimals in money'),
    objective: t(
      '将新西兰元和分连接到小数，并解决简单找零问题。',
      'Connect New Zealand dollars and cents to decimals and solve a simple change problem.',
    ),
    prerequisites: ['B04-L04'],
    keywords: [t('元', 'dollar'), t('分', 'cent'), t('找零', 'change')],
    minutes: 15,
    lab: 'money',
    hook: t(
      '在周末市集，果汁标价 NZ$2.50。这里的 .50 是 5 分还是 50 分？先用钱币摆出来。',
      'At a weekend market, juice costs NZ$2.50. Is .50 five cents or fifty cents? Build the amount with coins.',
    ),
    guided: q(
      'L05-G',
      '3 元 40 分，用元为单位写成小数。',
      'Write 3 dollars and 40 cents as a decimal amount in dollars.',
      '3.40',
      '100 分 = 1 元。',
      '100 cents = 1 dollar.',
      '40 分 = 0.40 元，所以是 NZ$3.40。',
      '40 cents is $0.40, so the total is NZ$3.40.',
      'money',
      undefined,
      'NZD',
    ),
    questions: [
      q(
        'L05-Q1',
        '80 分是多少元？',
        'How many dollars is 80 cents?',
        '0.80',
        '把 80 分除以 100。',
        'Divide 80 cents by 100.',
        '80/100 元 = NZ$0.80。',
        '80/100 dollar = NZ$0.80.',
        'money',
        undefined,
        'NZD',
      ),
      q(
        'L05-Q2',
        'NZ$4.05 的小数部分是多少分？',
        'How many cents are in the decimal part of NZ$4.05?',
        '5',
        '0.05 元是 5 个百分之一元。',
        '0.05 dollar is five hundredths of a dollar.',
        'NZ$4.05 = 4 元 5 分。',
        'NZ$4.05 is 4 dollars and 5 cents.',
        'money',
      ),
      q(
        'L05-Q3',
        '哪个金额等于 2 元 50 分？',
        'Which amount equals 2 dollars and 50 cents?',
        '1',
        '50 分是 0.50 元。',
        '50 cents is 0.50 dollar.',
        '2 + 0.50 = NZ$2.50。',
        '2 + 0.50 = NZ$2.50.',
        'money',
        ['NZ$2.05', 'NZ$2.50', 'NZ$2.005'],
      ),
      q(
        'L05-Q4',
        '一支笔 NZ$1.20，一个本子 NZ$2.30，合计多少元？',
        'A pen costs NZ$1.20 and a notebook NZ$2.30. What is the total in dollars?',
        '3.50',
        '元加元，分加分。',
        'Add dollars to dollars and cents to cents.',
        '1.20 + 2.30 = NZ$3.50。',
        '1.20 + 2.30 = NZ$3.50.',
        'money',
        undefined,
        'NZD',
      ),
      explain(
        'L05-Q5',
        '有人说 NZ$2.5 比 NZ$2.50 少，因为少写一个 0。解释哪里错了。',
        'Someone says NZ$2.5 is less than NZ$2.50 because one zero is missing. Explain the mistake.',
        '0.5 元 = 0.50 元 = 50 分，所以金额相同。',
        '0.5 dollar = 0.50 dollar = 50 cents, so the amounts are equal.',
        'money',
      ),
    ],
    exit: q(
      'L05-X',
      '果汁 NZ$2.50，付了 NZ$5.00。找回多少元？',
      'Juice costs NZ$2.50. You pay NZ$5.00. How many dollars in change?',
      '2.50',
      '用付出的钱减去价格。',
      'Subtract the price from the amount paid.',
      '5.00 − 2.50 = NZ$2.50。',
      '5.00 − 2.50 = NZ$2.50.',
      'money',
      undefined,
      'NZD',
    ),
    exitReason: t(
      '解释怎样用元和分检查这个找零合理。',
      'Explain how dollars and cents help you check the change.',
    ),
    parent: {
      goal: t(
        '把两位小数对应到 100 分，保留金额的意义。',
        'Connect two decimal places to 100 cents and keep the meaning of money.',
      ),
      misconception: t('把 0.05 元读成 50 分。', 'Reading $0.05 as 50 cents.'),
      prompts: [
        t('一元有多少个一分？', 'How many cents make a dollar?'),
        t(
          '付款减价格后，结果能检查回来吗？',
          'Can you add the change to the price to check the payment?',
        ),
      ],
      bridge: 'B04-L04',
    },
  },
];
// Decimal questions explicitly request decimals; fractional questions accept exact equivalent forms.
for (const lesson of lessons)
  for (const question of [lesson.guided, ...lesson.questions, lesson.exit]) {
    if (
      question.answer.kind === 'number' &&
      question.stem.zh.includes('用小数')
    )
      question.answer.formats = ['decimal'];
  }
export const diagnosticGroups = [
  {
    id: 'D01',
    title: t('数感与四则', 'Number sense'),
    bridge: t(
      '位值与计算基本功 B01 / B03（后续开放）',
      'Place value and fluency B01 / B03 (planned)',
    ),
    questions: [
      q(
        'D01-1',
        '408 − 179 = ?',
        '408 − 179 = ?',
        '229',
        '按位相减，注意退位。',
        'Subtract by place value, regrouping as needed.',
        '408 − 100 − 79 = 229。',
        '408 − 100 − 79 = 229.',
        'calculation',
      ),
      q(
        'D01-2',
        '24 × 6 = ?',
        '24 × 6 = ?',
        '144',
        '把 24 拆成 20 和 4。',
        'Split 24 into 20 and 4.',
        '20 × 6 + 4 × 6 = 144。',
        '20 × 6 + 4 × 6 = 144.',
        'calculation',
      ),
      q(
        'D01-3',
        '936 ÷ 12 = ?',
        '936 ÷ 12 = ?',
        '78',
        '12 × 多少等于 936？',
        '12 times what gives 936?',
        '12 × 78 = 936。',
        '12 × 78 = 936.',
        'calculation',
      ),
      q(
        'D01-4',
        '6,482 中的 4 代表多少？',
        'What is the value of the 4 in 6,482?',
        '400',
        '4 在百位。',
        '4 is in the hundreds place.',
        '4 × 100 = 400。',
        '4 × 100 = 400.',
        'place-value',
      ),
      q(
        'D01-5',
        '18 + 4 × 3 = ?',
        '18 + 4 × 3 = ?',
        '30',
        '先乘后加。',
        'Multiply before adding.',
        '18 + 12 = 30。',
        '18 + 12 = 30.',
        'calculation',
      ),
      q(
        'D01-6',
        '每袋 12 个苹果，买 3 袋，再送人 5 个，还剩多少个？',
        'You buy 3 bags of 12 apples and give away 5 apples. How many remain?',
        '31',
        '先求总数，再减。',
        'Find the total, then subtract.',
        '12 × 3 − 5 = 31。',
        '12 × 3 − 5 = 31.',
        'calculation',
      ),
    ],
  },
  {
    id: 'D02',
    title: t('分数与小数', 'Fractions & decimals'),
    bridge: t(
      '初识分数和小数 B04（已开放）',
      'First fractions and decimals B04 (open)',
    ),
    questions: [
      q(
        'D02-1',
        '披萨有 8 等份，吃了 3 份。吃了几分之几？',
        'A pizza has 8 equal slices; 3 are eaten. What fraction was eaten?',
        '3/8',
        '整体与选中份数。',
        'Think whole and selected parts.',
        '3 份 / 8 等份 = 3/8。',
        '3 out of 8 equal parts is 3/8.',
        'fraction',
      ),
      q(
        'D02-2',
        '选择最大的数。',
        'Choose the greatest number.',
        '2',
        '对齐小数位比较。',
        'Compare aligned decimal places.',
        '0.805 > 0.800 > 0.750。',
        '0.805 > 0.800 > 0.750.',
        'decimal',
        ['0.8', '0.75', '0.805'],
      ),
      q(
        'D02-3',
        '1/2 + 1/4 = ?',
        '1/2 + 1/4 = ?',
        '3/4',
        '把一半变成两个四分之一。',
        'Write one half as two quarters.',
        '2/4 + 1/4 = 3/4。',
        '2/4 + 1/4 = 3/4.',
        'fraction-add',
      ),
      q(
        'D02-4',
        '0.7 等于多少个百分之一？',
        'How many hundredths equal 0.7?',
        '70',
        '十分之一等于十个百分之一。',
        'A tenth equals ten hundredths.',
        '0.7 = 70/100。',
        '0.7 = 70/100.',
        'decimal',
      ),
      q(
        'D02-5',
        '2/3 = __/12，空格填多少？',
        '2/3 = __/12. Fill the blank.',
        '8',
        '分母乘了 4。',
        'The denominator was multiplied by 4.',
        '分子也乘 4：2 × 4 = 8。',
        'Multiply the numerator by 4 too: 2 × 4 = 8.',
        'equivalence',
      ),
      q(
        'D02-6',
        '20 个球的 25% 是多少个球？',
        'What is 25% of 20 balls?',
        '5',
        '25% 是四分之一。',
        '25% is a quarter.',
        '20 ÷ 4 = 5。',
        '20 ÷ 4 = 5.',
        'percent',
      ),
    ],
  },
  {
    id: 'D03',
    title: t('图形与测量', 'Geometry & measurement'),
    bridge: t(
      '图形、测量与读图 B05（后续开放）',
      'Shapes, measurement and charts B05 (planned)',
    ),
    questions: [
      q(
        'D03-1',
        '正方形每条边 4 cm，周长多少 cm？',
        'A square has sides of 4 cm. What is its perimeter in cm?',
        '16',
        '周长是四条边总长。',
        'Perimeter is the total of four sides.',
        '4 × 4 = 16 cm。',
        '4 × 4 = 16 cm.',
        'perimeter',
      ),
      q(
        'D03-2',
        '长方形长 8 cm、宽 5 cm，面积是多少？（cm²）',
        'A rectangle is 8 cm by 5 cm. What is its area? (cm²)',
        '40',
        '面积是方格数量。',
        'Area counts square units.',
        '8 × 5 = 40 cm²。',
        '8 × 5 = 40 cm².',
        'area',
        undefined,
        'cm²',
      ),
      q(
        'D03-3',
        '2.5 米等于多少厘米？',
        'How many centimetres equal 2.5 metres?',
        '250',
        '1 米 = 100 厘米。',
        '1 metre = 100 centimetres.',
        '2.5 × 100 = 250。',
        '2.5 × 100 = 250.',
        'measurement',
      ),
      q(
        'D03-4',
        '一个直角是多少度？',
        'How many degrees are in a right angle?',
        '90',
        '完整一圈的四分之一。',
        'A quarter of a full turn.',
        '360° ÷ 4 = 90°。',
        '360° ÷ 4 = 90°.',
        'angles',
      ),
      q(
        'D03-5',
        '长 7 cm、宽 3 cm 的长方形，周长多少 cm？',
        'A rectangle is 7 cm by 3 cm. What is its perimeter in cm?',
        '20',
        '两条长边、两条短边。',
        'Two long and two short sides.',
        '2 × (7 + 3) = 20 cm。',
        '2 × (7 + 3) = 20 cm.',
        'perimeter',
      ),
      q(
        'D03-6',
        '五天读书页数为 6、8、10、8、8。平均每天几页？',
        'Pages read on five days: 6, 8, 10, 8, 8. What is the mean?',
        '8',
        '先合计再平分。',
        'Find the total, then share equally.',
        '40 ÷ 5 = 8 页。',
        '40 ÷ 5 = 8 pages.',
        'data',
      ),
    ],
  },
  {
    id: 'D04',
    title: t('关系与推理', 'Relationships & reasoning'),
    bridge: t(
      '问题解决 B06 / 初步方程 P55（后续开放）',
      'Problem solving B06 / early equations P55 (planned)',
    ),
    questions: [
      q(
        'D04-1',
        'x + 17 = 42，x = ?',
        'x + 17 = 42. Find x.',
        '25',
        '找缺少的加数。',
        'Find the missing addend.',
        'x = 42 − 17 = 25。',
        'x = 42 − 17 = 25.',
        'equation',
      ),
      q(
        'D04-2',
        '3、6、9、12，下一个数是多少？',
        '3, 6, 9, 12. What comes next?',
        '15',
        '每次增加多少？',
        'How much is added each time?',
        '每次加 3，下一项是 15。',
        'Add 3 each time; next is 15.',
        'pattern',
      ),
      q(
        'D04-3',
        '3 个同价本子共 NZ$12，每个本子多少元？',
        'Three equally priced notebooks cost NZ$12. How many dollars is each?',
        '4',
        '把总价平均分。',
        'Share the total price equally.',
        '12 ÷ 3 = NZ$4。',
        '12 ÷ 3 = NZ$4.',
        'reasoning',
        undefined,
        'NZD',
      ),
      q(
        'D04-4',
        '公交车上有 18 人，8 人下车，5 人上车，现在有几人？',
        'A bus has 18 people. Eight leave and five board. How many are on the bus now?',
        '15',
        '按发生顺序做两步。',
        'Use two steps in order.',
        '18 − 8 + 5 = 15。',
        '18 − 8 + 5 = 15.',
        'reasoning',
      ),
      q(
        'D04-5',
        '等式两边都减 3，相等关系会怎样？',
        'If 3 is subtracted from both sides of an equation, what happens to equality?',
        '1',
        '想一想天平的两边。',
        'Think of both sides of a balance.',
        '两边减去相同的量，仍相等。',
        'Subtracting the same amount keeps both sides equal.',
        'equation',
        [
          '不再相等 / No longer equal',
          '仍然相等 / Still equal',
          '一定变成 0 / Both become 0',
        ],
      ),
      q(
        'D04-6',
        '规律 2、5、8、11 的第 6 项是多少？',
        'In the pattern 2, 5, 8, 11, what is the sixth term?',
        '17',
        '第 5 项是 14。',
        'The fifth term is 14.',
        '2, 5, 8, 11, 14, 17。',
        '2, 5, 8, 11, 14, 17.',
        'pattern',
      ),
    ],
  },
];
export const reviewQuestions: Record<string, Question> = {
  'B04-L01': q(
    'R01',
    '一块巧克力有 15 个相同小块，拿走 6 块。拿走了几分之几？',
    'A chocolate bar has 15 equal pieces; 6 are taken. What fraction is taken?',
    '6/15',
    '数整体的等份与拿走的份数。',
    'Count total equal parts and parts taken.',
    '6/15 = 2/5。',
    '6/15 = 2/5.',
    'fraction',
  ),
  'B04-L02': q(
    'R02',
    '同一个整体，1/3 与 1/8，哪个更大？',
    'For the same whole, which is greater: 1/3 or 1/8?',
    '0',
    '分成较少等份，每份较大。',
    'Fewer equal parts make larger pieces.',
    '1/3 > 1/8。',
    '1/3 > 1/8.',
    'unit-fraction',
    ['1/3', '1/8'],
  ),
  'B04-L03': q(
    'R03',
    '0 到 1 分成 10 等长区间。走了 7 格到哪里？',
    'Divide 0 to 1 into 10 equal intervals. Where are you after 7 intervals?',
    '7/10',
    '每格为 1/10。',
    'Each interval is 1/10.',
    '7 × 1/10 = 7/10。',
    '7 × 1/10 = 7/10.',
    'number-line',
  ),
  'B04-L04': q(
    'R04',
    '百格板涂 62 格，用小数表示。',
    '62 squares of a hundred grid are shaded. Write a decimal.',
    '0.62',
    '62 个百分之一。',
    '62 hundredths.',
    '62/100 = 0.62。',
    '62/100 = 0.62.',
    'decimal',
  ),
  'B04-L05': q(
    'R05',
    '水果 NZ$3.20，付 NZ$5，找回多少元？',
    'Fruit costs NZ$3.20. You pay NZ$5. How many dollars in change?',
    '1.80',
    '5.00 − 3.20。',
    '5.00 − 3.20.',
    'NZ$1.80。',
    'NZ$1.80.',
    'money',
    undefined,
    'NZD',
  ),
};
export const lessonById = (id?: string) => lessons.find((l) => l.id === id);

const distractors: Record<string, Record<string, ReturnType<typeof t>>> = {
  'L01-Q1': {
    '0': t(
      '选中的份数由分子表示；分母描述整体的等份数。',
      'The numerator counts selected parts; the denominator counts all equal parts.',
    ),
    '2': t(
      '人数只有对应到等份时才有关，分母本身表示整体的等份数。',
      'People matter only when they correspond to equal parts; the denominator counts equal parts.',
    ),
  },
  'L02-G': {
    '1': t(
      '四等份比两等份分得更细。同一个整体的一份会更小。',
      'Four equal parts divide the same whole more finely; each piece is smaller.',
    ),
  },
  'L02-Q3': {
    '0': t(
      '两等份的每份较大；比较同一个整体的单位分数时，分母越大每份越小。',
      'Halves are larger pieces. For unit fractions of the same whole, more parts mean smaller pieces.',
    ),
    '1': t(
      '三等份的一份比六等份的一份大；可用相同长度的分数条检验。',
      'A third is larger than a sixth. Check with equally long strips.',
    ),
  },
  'L03-Q3': {
    '0': t(
      '1/4 小于 1/2，在它左边。',
      '1/4 is less than 1/2 and lies to its left.',
    ),
    '2': t(
      '1/3 小于 1/2，在它左边。',
      '1/3 is less than 1/2 and lies to its left.',
    ),
  },
  'L04-Q3': {
    '1': t(
      '不能只数小数位数。把 0.5 写成 0.50，再比较 50 和 45 个百分之一。',
      'Do not just count decimal digits. Write 0.5 as 0.50 and compare 50 and 45 hundredths.',
    ),
    '2': t(
      '0.50 与 0.45 相差 5 个百分之一，并不相等。',
      '0.50 and 0.45 differ by five hundredths; they are not equal.',
    ),
  },
  'L05-Q3': {
    '0': t(
      'NZ$2.05 是 2 元 5 分，不是 50 分。',
      'NZ$2.05 is two dollars and five cents, not fifty cents.',
    ),
    '2': t(
      '50 分是 50/100 元，不是 5/1000 元。',
      'Fifty cents is 50/100 of a dollar, not 5/1000.',
    ),
  },
};
for (const lesson of lessons)
  for (const question of [lesson.guided, ...lesson.questions]) {
    if (question.id === 'L01-G') question.visual = { n: 3, d: 8 };
    if (question.id === 'L01-Q2') question.visual = { n: 2, d: 6 };
    for (const option of question.options ?? [])
      option.feedback =
        distractors[question.id]?.[option.id] ?? option.feedback;
  }

export function reviewQuestionFor(lessonId: string, round: number): Question {
  const original = reviewQuestions[lessonId]!;
  if (round === 0) return original;
  const copy = { ...original, answer: { ...original.answer } };
  if (lessonId === 'B04-L01') {
    const n = 6 + round,
      d = 15 + 3 * round;
    copy.stem = t(
      `巧克力有 ${d} 个相同小块，拿走 ${n} 块。拿走了整体的几分之几？`,
      `A chocolate bar has ${d} equal pieces; ${n} are taken. What fraction is taken?`,
    );
    copy.answer = { kind: 'number', value: `${n}/${d}` };
    copy.solution = t(
      `${n} 份 / ${d} 等份 = ${n}/${d}。`,
      `${n} out of ${d} equal parts gives ${n}/${d}.`,
    );
  }
  if (lessonId === 'B04-L02') {
    const d = 8 + round;
    copy.stem = t(
      `同一个整体，1/3 与 1/${d}，哪个更大？`,
      `For the same whole, which is greater: 1/3 or 1/${d}?`,
    );
    copy.options = original.options!.map((o, i) => ({
      ...o,
      text: t(i === 0 ? '1/3' : `1/${d}`, i === 0 ? '1/3' : `1/${d}`),
    }));
    copy.solution = t(
      `同一个整体，三等份的一份比 ${d} 等份的一份大。`,
      `For the same whole, a third is larger than one of ${d} equal parts.`,
    );
  }
  if (lessonId === 'B04-L03') {
    const d = 10 + round,
      n = 7 + round;
    copy.stem = t(
      `0 到 1 分成 ${d} 个等长区间。从 0 向右走 ${n} 格，到哪里？`,
      `Divide 0 to 1 into ${d} equal intervals. Move ${n} intervals right from 0. Where are you?`,
    );
    copy.answer = { kind: 'number', value: `${n}/${d}` };
    copy.hints = [t(`每格是 1/${d}。`, `Each interval is 1/${d}.`)];
    copy.solution = t(
      `${n} × 1/${d} = ${n}/${d}。`,
      `${n} × 1/${d} = ${n}/${d}.`,
    );
  }
  if (lessonId === 'B04-L04') {
    const n = ((62 + 17 * round) % 90) + 5;
    copy.stem = t(
      `百格板涂 ${n} 格，用小数表示。`,
      `${n} squares of a hundred grid are shaded. Write a decimal.`,
    );
    copy.answer = {
      kind: 'number',
      value: (n / 100).toFixed(2),
      formats: ['decimal'],
    };
    copy.hints = [t(`${n} 个百分之一。`, `${n} hundredths.`)];
    copy.solution = t(
      `${n}/100 = ${(n / 100).toFixed(2)}。`,
      `${n}/100 = ${(n / 100).toFixed(2)}.`,
    );
  }
  if (lessonId === 'B04-L05') {
    const price = 110 + ((21 + 7 * round) % 35) * 10,
      change = 500 - price;
    copy.stem = t(
      `水果 NZ$${(price / 100).toFixed(2)}，付 NZ$5，找回多少元？`,
      `Fruit costs NZ$${(price / 100).toFixed(2)}. You pay NZ$5. How many dollars in change?`,
    );
    copy.answer = {
      kind: 'number',
      value: (change / 100).toFixed(2),
      unit: 'NZD',
    };
    copy.hints = [
      t(
        `5.00 − ${(price / 100).toFixed(2)}。`,
        `5.00 − ${(price / 100).toFixed(2)}.`,
      ),
    ];
    copy.solution = t(
      `NZ$${(change / 100).toFixed(2)}。`,
      `NZ$${(change / 100).toFixed(2)}.`,
    );
  }
  return copy;
}
