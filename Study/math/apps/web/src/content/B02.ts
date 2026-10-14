import { t as T, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning, b02Lesson } from './builders';
const h = (v: [string, string, string, string]) => [
  T(v[0], v[1]),
  T(v[2], v[3]),
];
function q(
  id: string,
  zh: string,
  en: string,
  value: number,
  skill: string,
  hints: [string, string, string, string],
  steps: ReturnType<typeof T>[],
  accepted: string[],
  rejected: string[],
  unit?: 'm' | 'km' | 'NZD',
  diagram?: Question['diagram'],
) {
  const item = numeric(
    id,
    T(zh, en),
    String(value),
    skill,
    h(hints),
    steps,
    { accepted, rejected },
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
  zh: string,
  en: string,
  correct: number,
  skill: string,
  options: [string, string, string, string][],
  hints: [string, string, string, string],
  steps: ReturnType<typeof T>[],
) {
  return choice(
    id,
    T(zh, en),
    correct,
    skill,
    options.map((v) => ({ text: T(v[0], v[1]), feedback: T(v[2], v[3]) })),
    h(hints),
    steps,
  );
}
function r(
  id: string,
  zh: string,
  en: string,
  skill: string,
  zhRubric: string,
  enRubric: string,
  hints: [string, string, string, string],
) {
  return reasoning(id, T(zh, en), skill, T(zhRubric, enRubric), h(hints));
}
const parts = 'part-whole-operation',
  difference = 'comparison-difference',
  groups = 'equal-groups-array',
  division = 'sharing-grouping',
  inverse = 'inverse-multiplication',
  choose = 'operation-relationship';
export const b02Lessons: Lesson[] = [
  b02Lesson({
    id: 'B02-L01',
    title: T('加减的多种模型', 'Models of addition and subtraction'),
    objective: T(
      '根据整体、部分与差距关系解释加法和减法。',
      'Explain addition and subtraction through whole, part and difference relationships.',
    ),
    prerequisites: ['B01-L01'],
    keywords: [
      T('整体与部分', 'whole and parts'),
      T('合并', 'combining'),
      T('差距', 'difference'),
    ],
    minutes: 15,
    lab: 'operation-parts',
    hook: T(
      '“拿走五个”与“比另一组多五个”，都可能用减法；两种故事里真的都拿走了东西吗？',
      'Taking away five and having five more than another group can both involve subtraction. Do both stories actually remove objects?',
    ),
    guided: q(
      'B02-L01-G',
      '8 个绿球与 5 个蓝球合在一起，一共有几个？',
      'Combine eight green counters and five blue counters. How many altogether?',
      13,
      parts,
      [
        '两个部分都计入整体。',
        'Both parts belong to the whole.',
        '一个小球只数一次，做 8+5。',
        'Count each counter once using 8+5.',
      ],
      [
        T('8+5=13 个。', '8+5=13 counters.'),
        T('13−5=8 可以回到第一部分。', '13−5=8 recovers the first part.'),
      ],
      ['13', '13.0'],
      ['3', '8', '5'],
    ),
    questions: [
      c(
        'B02-L01-Q1',
        '箱里原有 17 个球，取走 6 个，求还剩多少。哪个算式符合？',
        'A box starts with seventeen balls. Remove six. Which expression finds the number left?',
        1,
        parts,
        [
          [
            '17+6',
            '17+6',
            '这里是取走，不是加入六个。',
            'Six are removed rather than added.',
          ],
          [
            '17−6',
            '17−6',
            '从原整体减去拿走的部分。',
            'Subtract the removed part from the original whole.',
          ],
          [
            '6−17',
            '6−17',
            '取走量不是原来的整体；先辨认谁是总量。',
            'The removed amount is not the original whole; identify the total first.',
          ],
        ],
        [
          '谁是原有总量？',
          'Which number is the original total?',
          '拿走的部分从总量中减去。',
          'Subtract the removed part from the total.',
        ],
        [
          T('17−6=11。', '17−6=11.'),
          T(
            '6+11=17，两个部分补回整体。',
            '6+11=17: both parts recover the whole.',
          ),
        ],
      ),
      q(
        'B02-L01-Q2',
        '总共有 19 个球，已知其中 7 个是红球，其余都是蓝球。蓝球有几个？',
        'There are nineteen balls, seven red and all the rest blue. How many are blue?',
        12,
        parts,
        [
          '红球与蓝球合成总量。',
          'Red and blue balls make the total.',
          '用整体 19 减已知部分 7。',
          'Subtract the known part seven from the whole nineteen.',
        ],
        [
          T('19−7=12 个蓝球。', '19−7=12 blue balls.'),
          T(
            '7+12=19 验证没有漏掉部分。',
            '7+12=19 checks that both parts are included.',
          ),
        ],
        ['12'],
        ['26', '7', '19'],
      ),
      q(
        'B02-L01-Q3',
        'A 有 14 个小球，B 有 9 个。A 比 B 多几个？',
        'A has fourteen counters and B has nine. How many more does A have?',
        5,
        difference,
        [
          '先一一配对两组的小球。',
          'Pair counters from the two groups.',
          '未配对的数量就是差距。',
          'The unmatched count is the difference.',
        ],
        [
          T('14−9=5。', '14−9=5.'),
          T(
            '比较没有拿走球，只是在找两组的差距。',
            'No balls are removed; the comparison finds the difference.',
          ),
        ],
        ['5'],
        ['23', '14', '9'],
        undefined,
        { kind: 'operation-counters', a: 14, b: 9, mode: 'compare' },
      ),
      q(
        'B02-L01-Q4',
        '23 个贴纸送出去 8 个，还剩几个？',
        'Give away eight of twenty-three stickers. How many remain?',
        15,
        parts,
        [
          '23 是原总量，8 是送出部分。',
          'Twenty-three is the original total and eight is the given part.',
          '剩下与送出的合起来应是 23。',
          'The remaining and given parts must total twenty-three.',
        ],
        [T('23−8=15。', '23−8=15.'), T('15+8=23。', '15+8=23.')],
        ['15'],
        ['31', '8', '23'],
      ),
      q(
        'B02-L01-Q5',
        '假想步道先走 7 km，再走 8 km，总共走多少 km？',
        'On an imaginary track, walk seven kilometres then eight more. How many kilometres altogether?',
        15,
        parts,
        [
          '两段都属于已走总距离。',
          'Both sections contribute to the total walked.',
          '相同单位的两部分相加。',
          'Add the two parts in matching units.',
        ],
        [
          T('7+8=15 km。', '7+8=15 km.'),
          T(
            '差距 1 km 不是总距离。',
            'The one-kilometre difference is not the total distance.',
          ),
        ],
        ['15', '15 km'],
        ['1', '8', '15 m'],
        'km',
      ),
      r(
        'B02-L01-Q6',
        '总量 19，已知部分 7。同学把缺少部分算成 19+7=26。为什么不对？',
        'The total is nineteen and a known part is seven. A learner calculates the missing part as 19+7=26. Why is this wrong?',
        parts,
        '19 已经包含那 7 个，不能再加一次；缺少部分为 19−7=12。说明“已知部分+缺少部分=整体”，用 7+12=19 检查；这里的缺少部分不应超过总量。',
        'Nineteen already includes the seven, so adding them again double-counts. The missing part is 19−7=12. Explain known part plus missing part equals whole and check 7+12=19. The missing part cannot exceed this total.',
        [
          '19 是一个部分还是整体？',
          'Is nineteen a part or the whole?',
          '写“7+缺少部分=19”。',
          'Write seven plus missing part equals nineteen.',
        ],
      ),
    ],
    exit: q(
      'B02-L01-X',
      '20 米绳子剪去 8 米，剩下多少米？',
      'Cut eight metres from a twenty-metre rope. How many metres remain?',
      12,
      parts,
      [
        '原总量为 20 米。',
        'The original total is twenty metres.',
        '剩下与剪去合起来应回到 20 米。',
        'Remaining and cut lengths must recover twenty metres.',
      ],
      [
        T('20−8=12 米。', '20−8=12 metres.'),
        T('12+8=20 米。', '12+8=20 metres.'),
      ],
      ['12', '12 m', '12 metres'],
      ['28', '8', '12 km'],
      'm',
    ),
    exitReason: T(
      '说明算式中的整体与两部分，再给一个表示差距的减法故事，区分“拿走”与“比较”。',
      'Identify the whole and its two parts, then give a subtraction comparison story that does not remove objects.',
    ),
    parent: {
      goal: T(
        '先解释数量关系，再决定加或减。',
        'Explain the quantity relationship before choosing addition or subtraction.',
      ),
      misconception: T(
        '看到“多”就加，或认为减法只能拿走。',
        'Adding whenever “more” appears or assuming subtraction only describes removal.',
      ),
      prompts: [
        T(
          '哪个数已经包含其他部分？',
          'Which number already contains the other parts?',
        ),
        T(
          '这次减法是在拿走、找缺少部分，还是比较差距？',
          'Is subtraction removing, finding a missing part or comparing a difference?',
        ),
      ],
      bridge: 'B01-L01',
    },
  }),
  b02Lesson({
    id: 'B02-L02',
    title: T('乘法是等组与阵列', 'Multiplication as equal groups and arrays'),
    objective: T(
      '把组数与每组量连接到总量，并用阵列解释整数乘法。',
      'Connect group count and amount per group to the total and explain whole-number multiplication with arrays.',
    ),
    prerequisites: ['B02-L01'],
    keywords: [
      T('等组', 'equal groups'),
      T('每组量', 'amount per group'),
      T('阵列', 'array'),
    ],
    minutes: 15,
    lab: 'operation-array',
    hook: T(
      '三组每组四个，与四组每组三个，总量一样吗？故事的组数与每组量还一样吗？',
      'Do three groups of four and four groups of three have the same total? Do their group counts and amounts per group also match?',
    ),
    guided: q(
      'B02-L02-G',
      '3 组小球，每组 4 个，总共有几个？',
      'Three equal groups have four counters each. How many altogether?',
      12,
      groups,
      [
        '先辨认组数与每组量。',
        'Identify group count and amount per group.',
        '把三个相同的 4 合起来。',
        'Combine three equal amounts of four.',
      ],
      [
        T('4+4+4=12。', '4+4+4=12.'),
        T('也可写 3×4=12。', 'Also write 3×4=12.'),
      ],
      ['12'],
      ['7', '3', '4'],
    ),
    questions: [
      c(
        'B02-L02-Q1',
        '6 组，每组 5 个，哪个式子求总量？',
        'Six groups contain five items each. Which expression finds the total?',
        0,
        groups,
        [
          [
            '6×5',
            '6×5',
            '六个相同的五组成总量。',
            'Six equal fives make the total.',
          ],
          [
            '6+5',
            '6+5',
            '组数不是另一组五个物体，不能直接相加。',
            'The group count is not another quantity of objects to add.',
          ],
          [
            '6−5',
            '6−5',
            '差距不等于六组的合计。',
            'A difference is not the combined amount in six groups.',
          ],
        ],
        [
          '6 在数什么，5 在数什么？',
          'What does six count and what does five count?',
          '每一组都要计入。',
          'Include every group.',
        ],
        [
          T('6×5=30。', '6×5=30.'),
          T(
            '5 连续相加六次，也得到 30。',
            'Adding five six times also gives thirty.',
          ),
        ],
      ),
      q(
        'B02-L02-Q2',
        '4 盒，每盒 7 支笔，一共有几支？',
        'Four boxes each hold seven pens. How many pens altogether?',
        28,
        groups,
        [
          '盒数是 4，每盒量是 7。',
          'There are four boxes and seven pens per box.',
          '重复四个相同的七。',
          'Combine four equal sevens.',
        ],
        [T('4×7=28 支。', '4×7=28 pens.'), T('7+7+7+7=28。', '7+7+7+7=28.')],
        ['28'],
        ['11', '4', '7'],
      ),
      q(
        'B02-L02-Q3',
        '阵列有 3 行，每行 6 个小球，总共有几个？',
        'An array has three rows of six counters. How many counters altogether?',
        18,
        groups,
        [
          '每一行是一个相同的组。',
          'Each row is an equal group.',
          '3 个 6 相加，或算 3×6。',
          'Add three sixes or calculate 3×6.',
        ],
        [
          T('3×6=18。', '3×6=18.'),
          T(
            '改按列计数，可看成 6 组每组 3 个，总量仍为 18。',
            'Counting columns gives six groups of three, still eighteen.',
          ),
        ],
        ['18'],
        ['9', '3', '6'],
        undefined,
        { kind: 'operation-array', groups: 3, perGroup: 6 },
      ),
      q(
        'B02-L02-Q4',
        '每组 8 个，但没有任何一组。总量是多少？',
        'There are eight per group, but zero groups. What is the total?',
        0,
        groups,
        [
          '零组表示没有取任何组。',
          'Zero groups means no group is taken.',
          '不要把每组量当成已经存在的一组。',
          'Do not treat the per-group amount as an existing group.',
        ],
        [
          T('0×8=0。', '0×8=0.'),
          T('没有组就没有添加物体。', 'No group adds any objects.'),
        ],
        ['0', '0.0'],
        ['8', '1'],
      ),
      q(
        'B02-L02-Q5',
        '5 位队员每人准备 3 个训练标志，一共需要几个？',
        'Five players each prepare three training markers. How many markers are needed?',
        15,
        groups,
        [
          '队员数是组数。',
          'Player count is group count.',
          '每人都有相同的三个。',
          'Each player has the same three.',
        ],
        [
          T('5×3=15 个。', '5×3=15 markers.'),
          T(
            '5+3 把人数与每人的物体数混在一起。',
            '5+3 mixes player count with objects per player.',
          ),
        ],
        ['15'],
        ['8', '5', '3'],
      ),
      r(
        'B02-L02-Q6',
        '四组每组三个，同学算 4+3=7。怎样用图说明应求什么？',
        'For four groups of three, a learner calculates 4+3=7. Explain with a diagram what is needed.',
        groups,
        '4 是组数，3 是每组的物体数，不能作为两个物体部分直接相加。画四个相同的三，或四行三列，得到 12；解释 3+3+3+3=4×3，而不只给 12。',
        'Four counts groups and three counts objects per group, so they are not two object parts to add. Draw four equal threes or four rows of three to obtain twelve. Explain 3+3+3+3=4×3, not only the result.',
        [
          '4 与 3 的数量角色相同吗？',
          'Do four and three have the same quantity role?',
          '画出每一组的三个物体。',
          'Draw the three objects in every group.',
        ],
      ),
    ],
    exit: q(
      'B02-L02-X',
      '花园有 4 行，每行 6 棵同样计数的苗，总共有几棵？',
      'A garden has four rows of six seedlings. How many seedlings altogether?',
      24,
      groups,
      [
        '每行看作一个组。',
        'Treat each row as a group.',
        '把每行六棵重复四次。',
        'Repeat six seedlings four times.',
      ],
      [
        T('4×6=24 棵。', '4×6=24 seedlings.'),
        T(
          '6×4 也得到 24，但行与列的计数角色交换。',
          '6×4 also gives twenty-four while exchanging row and column roles.',
        ),
      ],
      ['24'],
      ['10', '4', '6'],
    ),
    exitReason: T(
      '画出或描述阵列，说明两个因数分别在数什么；交换因数后总量与组法各怎样？',
      'Sketch or describe the array and identify each factor’s role. What happens to total and grouping when the factors swap?',
    ),
    parent: {
      goal: T(
        '用等组与阵列解释乘法，而不是只背得数。',
        'Explain multiplication with equal groups and arrays rather than only recall products.',
      ),
      misconception: T(
        '把组数与每组量直接相加；认为交换因数后故事也完全相同。',
        'Adding group count to amount per group or assuming swapped factors mean identical stories.',
      ),
      prompts: [
        T('每组一样多吗？', 'Does every group have the same amount?'),
        T(
          '旋转阵列后，总物体数与行列数怎样变？',
          'After rotating the array, what happens to total objects and row/column counts?',
        ),
      ],
      bridge: 'B02-L01',
    },
  }),
  b02Lesson({
    id: 'B02-L03',
    title: T('除法是平均分与包含', 'Division as sharing and grouping'),
    objective: T(
      '辨认除法中已知份数与已知每份量的两种关系，并解释余量。',
      'Distinguish known share count from known amount per group in division and explain remainders.',
    ),
    prerequisites: ['B02-L02'],
    keywords: [
      T('平均分', 'equal sharing'),
      T('包含分组', 'grouping'),
      T('余量', 'remainder'),
    ],
    minutes: 16,
    lab: 'operation-division',
    hook: T(
      '24 个球“分给 6 人”与“每盒装 6 个”，都可写 24÷6。两个 6 与两个商 4，各在数什么？',
      'Twenty-four counters shared among six people and packed six per box both use 24÷6. What do the sixes and quotients four count?',
    ),
    guided: q(
      'B02-L03-G',
      '24 个球平均分给 6 人，每人几个？',
      'Share twenty-four balls equally among six people. How many per person?',
      4,
      division,
      [
        '6 是接收者人数，不是每人已有的球数。',
        'Six is the recipient count, not balls already received.',
        '每人同样多，六份合计要回到 24。',
        'Six equal shares must recover twenty-four.',
      ],
      [
        T('24÷6=4 个。', '24÷6=4 balls.'),
        T('6×4=24，六人每人四个。', '6×4=24: six people with four each.'),
      ],
      ['4'],
      ['6', '18', '24'],
    ),
    questions: [
      c(
        'B02-L03-Q1',
        '24 个苹果平均分进 6 篮。在这句话里，6 表示什么？',
        'Share twenty-four apples equally among six baskets. What does six mean here?',
        0,
        division,
        [
          [
            '篮数，也就是份数',
            'Basket count, the share count',
            '已知六篮，要求每篮量。',
            'Six baskets are known; amount per basket is sought.',
          ],
          [
            '每篮的苹果数',
            'Apples per basket',
            '每篮量还未知，不能把篮数当它。',
            'The per-basket amount is unknown; basket count is a different role.',
          ],
          [
            '剩余苹果数',
            'Leftover apples',
            '这里六表示篮数，不是余量。',
            'Six counts baskets, not leftovers.',
          ],
        ],
        [
          '问题给出了多少个接收容器？',
          'How many receiving containers are specified?',
          '先区分“几篮”与“每篮几个”。',
          'Distinguish basket count from apples per basket.',
        ],
        [
          T(
            '6 是篮数，每篮量由 24÷6 得到。',
            'Six is basket count; 24÷6 gives apples per basket.',
          ),
          T(
            '若改成每篮装六个，6 的角色就不同。',
            'Saying six per basket gives the six a different role.',
          ),
        ],
      ),
      q(
        'B02-L03-Q2',
        '24 个球，每袋装 3 个，可以装满几袋？',
        'Pack twenty-four balls three per bag. How many full bags?',
        8,
        division,
        [
          '3 是每袋量，求有多少袋。',
          'Three is amount per bag; find bag count.',
          '数 24 里面有几个 3。',
          'Count how many groups of three fit into twenty-four.',
        ],
        [T('24÷3=8 袋。', '24÷3=8 bags.'), T('8×3=24。', '8×3=24.')],
        ['8'],
        ['3', '21', '27'],
      ),
      q(
        'B02-L03-Q3',
        '图中 20 个小球平均分成 4 组，每组几个？',
        'Twenty counters in the diagram are shared equally among four groups. How many per group?',
        5,
        division,
        [
          '每组要一样多。',
          'Each group must receive the same count.',
          '四组的量合计为二十。',
          'Four equal groups must total twenty.',
        ],
        [
          T('20÷4=5。', '20÷4=5.'),
          T('4×5=20，没有余下。', '4×5=20, with no remainder.'),
        ],
        ['5'],
        ['4', '16', '24'],
        undefined,
        { kind: 'operation-sharing', total: 20, divisor: 4, mode: 'share' },
      ),
      q(
        'B02-L03-Q4',
        '23 个球，每盒装 5 个，余下另放。能装满几盒？只数满盒。',
        'Pack twenty-three balls five per box and set leftovers aside. How many completely full boxes?',
        4,
        division,
        [
          '四盒要二十个，五盒要二十五个。',
          'Four boxes need twenty balls; five need twenty-five.',
          '只能数完整组，剩下三颗另放。',
          'Count complete groups only; three balls remain outside.',
        ],
        [
          T('23=5×4+3。', '23=5×4+3.'),
          T(
            '满盒 4 个，余 3 个；若要容纳全部球，另一个未满盒是不同问题。',
            'Four boxes are full and three balls remain. Counting all containers needed is a different question.',
          ),
        ],
        ['4'],
        ['5', '4.6', '18'],
      ),
      q(
        'B02-L03-Q5',
        '没有小球，平均分给 4 人，每人几个？',
        'Share zero counters among four people. How many does each receive?',
        0,
        division,
        [
          '有四位接收者，总量为零。',
          'Four recipients exist, but the total is zero.',
          '每人零个，合计仍为零。',
          'Zero each still totals zero.',
        ],
        [
          T('0÷4=0。', '0÷4=0.'),
          T(
            '这不同于分给零个人；除数这里是 4。',
            'This differs from sharing among zero people; the divisor here is four.',
          ),
        ],
        ['0'],
        ['4', '1'],
      ),
      r(
        'B02-L03-Q6',
        '23 个球每盒装 5 个，装满四盒后，同学只记录 20 个，说全部都装好了。怎样检查？',
        'With twenty-three balls packed five per box, a learner fills four boxes and records twenty as the complete total. How should this be checked?',
        division,
        '四满盒只包含 5×4=20 个，还有 3 个未装入。必须用 23=5×4+3 检查；余量仍是原总量的一部分，不能丢掉。若问需要几个容器装全部，可以再用一个未满容器，但满盒数仍为四。',
        'Four full boxes contain only 5×4=20 balls, leaving three outside. Check 23=5×4+3. The remainder still belongs to the original total. An additional partly filled container can hold all leftovers, but the full-box count remains four.',
        [
          '四盒里实际有多少？',
          'How many are actually in four boxes?',
          '与原来的 23 比较，差在哪里？',
          'Compare with the original twenty-three: what remains?',
        ],
      ),
    ],
    exit: q(
      'B02-L03-X',
      '22 个完整小球分给 5 人，不拆小球。每人先分同样多的完整小球，余下另放；每人最多几个？',
      'Share twenty-two indivisible counters among five people. Give each the same whole count and set leftovers aside. What is the maximum whole count per person?',
      4,
      division,
      [
        '五人各四颗用去二十颗。',
        'Five people with four each use twenty counters.',
        '每人五颗需要二十五颗，不够。',
        'Five each would need twenty-five counters, too many.',
      ],
      [
        T('22=5×4+2。', '22=5×4+2.'),
        T(
          '每人四颗，余下两颗另放。',
          'Each receives four; two remain outside.',
        ),
      ],
      ['4'],
      ['5', '4.4', '17'],
    ),
    exitReason: T(
      '说明剩下两颗在哪里，并用乘法加余量恢复 22；为什么本题不把每人量写成 4.4 个完整小球？',
      'Explain where the two remaining counters are, recover twenty-two with multiplication and remainder, and explain why 4.4 indivisible counters per person does not fit this task.',
    ),
    parent: {
      goal: T(
        '先说除数表示人数还是每组量，再解释商与余量。',
        'Identify whether the divisor counts recipients or amount per group, then explain quotient and remainder.',
      ),
      misconception: T(
        '两种除法故事混为一谈；把余量丢掉；不分满组数与容器总数。',
        'Confusing sharing and grouping, discarding remainders, or mixing full-group count with all-container count.',
      ),
      prompts: [
        T(
          '已知的是几份，还是每份多少？',
          'Is the known quantity share count or amount per share?',
        ),
        T(
          '把完整组和余下的合起来，能回到总量吗？',
          'Do complete groups and leftovers recover the total?',
        ),
      ],
      bridge: 'B02-L02',
    },
  }),
  b02Lesson({
    id: 'B02-L04',
    title: T(
      '乘除法的互逆',
      'Inverse relationship of multiplication and division',
    ),
    objective: T(
      '用总量、组数与每组量的关系解释乘除互逆，并检查除数非零。',
      'Explain inverse multiplication and division through total, group count and amount per group, checking a non-zero divisor.',
    ),
    prerequisites: ['B02-L02', 'B02-L03'],
    keywords: [
      T('互逆', 'inverse operations'),
      T('数量关系', 'quantity relationship'),
      T('反向检查', 'inverse check'),
    ],
    minutes: 15,
    lab: 'operation-inverse',
    hook: T(
      '知道 3×4=12，怎样不用重新数球，就求三组中每组几个，或者每组四个共有几组？',
      'Knowing 3×4=12, how can you find amount per group or group count without recounting?',
    ),
    guided: q(
      'B02-L04-G',
      '3 组总共有 12 个球，每组同样多。每组几个？',
      'Three equal groups total twelve counters. How many per group?',
      4,
      inverse,
      [
        '总量=组数×每组量。',
        'Total equals group count times amount per group.',
        '用 12÷3 找未知的每组量。',
        'Use 12÷3 to find the unknown amount per group.',
      ],
      [
        T('12÷3=4。', '12÷3=4.'),
        T('3×4=12 验证关系。', '3×4=12 verifies the relationship.'),
      ],
      ['4'],
      ['9', '3', '12'],
    ),
    questions: [
      c(
        'B02-L04-Q1',
        '5 组共 30 个，求每组量，哪个逆运算符合？',
        'Five groups total thirty. Which inverse operation finds amount per group?',
        1,
        inverse,
        [
          [
            '30÷6=5',
            '30÷6=5',
            '这给出每组六个时的组数，不是本题所求的每组量。',
            'This finds group count for six per group, a different unknown.',
          ],
          [
            '30÷5=6',
            '30÷5=6',
            '总量除以已知组数，得到每组量。',
            'Divide total by known group count to obtain amount per group.',
          ],
          [
            '30−5=25',
            '30−5=25',
            '组数不是从总物体数拿走的部分。',
            'Group count is not an object part removed from the total.',
          ],
        ],
        [
          '5 的数量角色是什么？',
          'What role does five have?',
          '求满足 5×每组量=30 的数。',
          'Find the number satisfying five times amount per group equals thirty.',
        ],
        [
          T('30÷5=6。', '30÷5=6.'),
          T('5×6=30，乘回去检查。', '5×6=30 checks the answer.'),
        ],
      ),
      q(
        'B02-L04-Q2',
        '7 组同样多，共 42 个。每组几个？',
        'Seven equal groups total forty-two. How many per group?',
        6,
        inverse,
        [
          '42 是总量，7 是组数。',
          'Forty-two is total, seven is group count.',
          '用除法恢复另一因数。',
          'Use division to recover the other factor.',
        ],
        [T('42÷7=6。', '42÷7=6.'), T('7×6=42。', '7×6=42.')],
        ['6'],
        ['35', '7', '49'],
      ),
      q(
        'B02-L04-Q3',
        '图中 4 行共 32 个小球，每行同样多。4×?=32，缺少因数是多少？',
        'Four equal rows contain thirty-two counters. For 4×?=32, find the missing factor.',
        8,
        inverse,
        [
          '行数是 4，不是每行量。',
          'Four counts rows, not counters per row.',
          '总量除以行数。',
          'Divide total by row count.',
        ],
        [T('32÷4=8。', '32÷4=8.'), T('4×8=32。', '4×8=32.')],
        ['8'],
        ['28', '4', '36'],
        undefined,
        { kind: 'operation-array', groups: 4, perGroup: 8 },
      ),
      q(
        'B02-L04-Q4',
        '0 个小球平均分进 5 组，每组几个？用乘回去的方法检查。',
        'Share zero counters among five groups. How many per group? Check by multiplying back.',
        0,
        inverse,
        [
          '除数是五，不是零。',
          'The divisor is five, not zero.',
          '5×什么数=0？',
          'Five times what number equals zero?',
        ],
        [
          T('0÷5=0。', '0÷5=0.'),
          T('5×0=0；这没有做 0÷0。', '5×0=0; no division by zero is used.'),
        ],
        ['0'],
        ['5', '1'],
      ),
      q(
        'B02-L04-Q5',
        '36 棵苗平均种成 4 行，每行几棵？',
        'Plant thirty-six seedlings in four equal rows. How many per row?',
        9,
        inverse,
        [
          '四行是已知组数。',
          'Four rows are the known group count.',
          '求 4×每行量=36。',
          'Find amount per row in four times that amount equals thirty-six.',
        ],
        [
          T('36÷4=9 棵。', '36÷4=9 seedlings.'),
          T('4×9=36 棵。', '4×9=36 seedlings.'),
        ],
        ['9'],
        ['32', '4', '40'],
      ),
      r(
        'B02-L04-Q6',
        '同学从 0×5=0 推出 0÷0=5。为什么不能这样恢复因数？',
        'A learner uses 0×5=0 to claim 0÷0=5. Why is this not a valid inverse step?',
        inverse,
        '乘除互逆恢复因数时，除数必须非零。0×5=0，0×8=0，任何数乘零都得到零，不能用除以零唯一找回 5。0÷5=0 则可以，因为除数五非零。接受用“分给零个人没有每人量”解释，但需区分零总量与零除数。',
        'Recovering a factor by division requires a non-zero divisor. Zero times five, eight or any number is zero, so division by zero cannot uniquely recover five. 0÷5=0 is valid because five is non-zero. A sharing explanation is valid if it distinguishes zero total from zero divisor.',
        [
          '能否也写 0×8=0？',
          'Can you also write 0×8=0?',
          '如果多个因数都符合，能唯一确定 5 吗？',
          'If several factors fit, can five be uniquely recovered?',
        ],
      ),
    ],
    exit: q(
      'B02-L04-X',
      '7 个托盘合计 56 个物体，每盘一样多。每盘几个？',
      'Seven equal trays hold fifty-six objects altogether. How many per tray?',
      8,
      inverse,
      [
        '求未知的每盘量。',
        'Find the unknown amount per tray.',
        '用 56÷7，并乘回去检查。',
        'Use 56÷7 and multiply back to check.',
      ],
      [T('56÷7=8。', '56÷7=8.'), T('7×8=56。', '7×8=56.')],
      ['8'],
      ['49', '7', '63'],
    ),
    exitReason: T(
      '说明 56、7、8 的三个数量角色，再写出求托盘数的另一条除法式，并指出两条除法的除数都非零。',
      'Identify the roles of fifty-six, seven and eight, write another division finding tray count, and note that both divisors are non-zero.',
    ),
    parent: {
      goal: T(
        '同一组三个数量能正向求总量、反向求未知因数。',
        'Use one relationship to find the total forwards or a missing factor backwards.',
      ),
      misconception: T(
        '把组数当减去的部分，或无条件用除以零恢复因数。',
        'Treating group count as a removed part or trying to invert multiplication by dividing by zero.',
      ),
      prompts: [
        T(
          '三个数分别代表什么？',
          'What does each of the three numbers represent?',
        ),
        T(
          '乘回去能否检查？这条除法的除数能为零吗？',
          'Can multiplication check the answer, and may this divisor be zero?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
  b02Lesson({
    id: 'B02-L05',
    title: T('判断该用哪一种运算', 'Choosing the operation in word problems'),
    objective: T(
      '先说明数量角色与关系，再选择运算并检查结果单位。',
      'Identify quantity roles and relationships before choosing operations and checking result units.',
    ),
    prerequisites: ['B02-L01', 'B02-L02', 'B02-L03', 'B02-L04'],
    keywords: [
      T('数量角色', 'quantity roles'),
      T('关系图', 'relationship diagram'),
      T('单位检查', 'unit check'),
    ],
    minutes: 16,
    lab: 'operation-choose',
    hook: T(
      '“每份”“剩下”“多”能代替读题吗？同样出现“多”，既可能求总量，也可能求差距。',
      'Can keywords like each, left or more replace reading the relationship? “More” can occur in total and difference questions.',
    ),
    guided: q(
      'B02-L05-G',
      '假想文具每本 NZ$3，买 4 本，总价多少元？',
      'Imaginary notebooks cost NZ$3 each. Buy four. What is the total price in dollars?',
      12,
      choose,
      [
        '3 是每本价钱，4 是本数。',
        'Three is price per book; four is book count.',
        '总价=每本价钱×本数。',
        'Total price equals unit price times count.',
      ],
      [
        T('3×4=NZ$12。', '3×4=NZ$12.'),
        T(
          '3+4 把元与本数直接相加，关系不符。',
          '3+4 adds dollars and book count directly, which does not model the relationship.',
        ),
      ],
      ['12', 'NZ$12', '12 dollars'],
      ['7', '3', '12 m'],
      'NZD',
    ),
    questions: [
      c(
        'B02-L05-Q1',
        '24 张贴纸，每包 6 张，求可以装几包。该用什么？',
        'Pack twenty-four stickers six per pack. Which operation finds pack count?',
        2,
        choose,
        [
          [
            '24+6',
            '24+6',
            '没有加入六张；六是每包量。',
            'No six stickers are added; six is amount per pack.',
          ],
          [
            '24−6',
            '24−6',
            '减去一包得到剩余，不是包数。',
            'Removing one pack finds a remaining amount, not pack count.',
          ],
          [
            '24÷6',
            '24÷6',
            '数总量里包含几个六。',
            'Count how many groups of six fit in the total.',
          ],
        ],
        [
          '未知的是贴纸总数还是包数？',
          'Is the unknown total stickers or pack count?',
          '已知每包量，用包含分组。',
          'Known amount per pack calls for grouping division.',
        ],
        [
          T('24÷6=4 包。', '24÷6=4 packs.'),
          T('4×6=24 检查。', '4×6=24 checks the relationship.'),
        ],
      ),
      q(
        'B02-L05-Q2',
        '14 个红球与 9 个蓝球一起装箱，共有几个球？',
        'Put fourteen red and nine blue balls in one box. How many balls altogether?',
        23,
        choose,
        [
          '两部分都在总量中。',
          'Both parts belong in the total.',
          '不是求红球比蓝球多几个。',
          'The question is not asking how many more red balls there are.',
        ],
        [
          T('14+9=23。', '14+9=23.'),
          T('5 是差距，不是总量。', 'Five is the difference, not the total.'),
        ],
        ['23'],
        ['5', '14', '9'],
      ),
      q(
        'B02-L05-Q3',
        '30 米绳子用掉 12 米，还剩多少米？',
        'Use twelve metres from thirty metres of rope. How many metres remain?',
        18,
        choose,
        [
          '30 是原整体，12 是已用部分。',
          'Thirty is the original whole and twelve is the used part.',
          '用减法找缺少的另一部分。',
          'Use subtraction for the other part.',
        ],
        [
          T('30−12=18 米。', '30−12=18 metres.'),
          T('12+18=30 米。', '12+18=30 metres.'),
        ],
        ['18', '18 m'],
        ['42', '12', '18 km'],
        'm',
      ),
      q(
        'B02-L05-Q4',
        '5 袋，每袋 7 个橙子，总共有几个？',
        'Five bags each hold seven oranges. How many oranges altogether?',
        35,
        choose,
        [
          '5 是袋数，7 是每袋量。',
          'Five counts bags and seven is amount per bag.',
          '重复五个相同的七。',
          'Combine five equal sevens.',
        ],
        [
          T('5×7=35 个。', '5×7=35 oranges.'),
          T('5+7 不是这个等组关系。', '5+7 does not model these equal groups.'),
        ],
        ['35'],
        ['12', '5', '7'],
      ),
      q(
        'B02-L05-Q5',
        '28 个烤饼，每盒装 4 个，可以装满几盒？',
        'Pack twenty-eight scones four per box. How many full boxes?',
        7,
        choose,
        [
          '已知总量和每盒量，求盒数。',
          'Total and amount per box are known; box count is unknown.',
          '28 包含几个 4？',
          'How many fours fit into twenty-eight?',
        ],
        [
          T('28÷4=7 盒。', '28÷4=7 boxes.'),
          T('7×4=28，没有余下。', '7×4=28, with no remainder.'),
        ],
        ['7'],
        ['24', '4', '32'],
      ),
      r(
        'B02-L05-Q6',
        '有 NZ$20，买 3 本每本 NZ$4 的本子。同学用 20−3−4=13 求余额。哪里错了？',
        'With NZ$20, buy three notebooks at NZ$4 each. A learner finds the balance using 20−3−4=13. What is wrong?',
        choose,
        '3 是本数，不能从元数中直接减去。先求总价 3×4=12 元，再算余额 20−12=8 元；检查成本 12 加余额 8 等于 20。要说明每步的数量角色与单位，而不只是给 8。',
        'Three counts books and cannot be subtracted directly from dollars. First find cost 3×4=12 dollars, then balance 20−12=8 dollars. Check cost twelve plus balance eight equals twenty. Explain roles and units in both steps rather than only state eight.',
        [
          '3 是元数还是本数？',
          'Does three count dollars or books?',
          '要先找三本的什么量？',
          'What quantity must be found for all three books first?',
        ],
      ),
    ],
    exit: q(
      'B02-L05-X',
      '假想预算 NZ$30，每套材料 NZ$6，买 4 套后还剩多少元？',
      'An imaginary budget is NZ$30. Each material kit costs NZ$6. After buying four kits, how many dollars remain?',
      6,
      choose,
      [
        '先用单价与套数求成本。',
        'First use price per kit and kit count to find cost.',
        '再用预算减成本。',
        'Subtract cost from budget.',
      ],
      [
        T('6×4=NZ$24。', '6×4=NZ$24.'),
        T('30−24=NZ$6；24+6=30。', '30−24=NZ$6; 24+6=30.'),
      ],
      ['6', 'NZ$6', '6 NZD'],
      ['24', '26', '6 m'],
      'NZD',
    ),
    exitReason: T(
      '写出或说出两步关系，解释为什么不能直接从 30 元减去 4 套，再用单位与反向关系检查。',
      'Describe both relationships, explain why four kits cannot be subtracted directly from thirty dollars, and check with units and inverse relationships.',
    ),
    familyChallenge: T(
      '家庭挑战：用家里已有纸卡，设计一次假想新西兰文具采购，预算 NZ$30。为两种物品写出整数单价与数量，先画等组图求各自成本，再求合计与余额；还可以把卡片平均装袋，记录每袋量或袋数及余量。保留每一步的单位和检查式，不计分，也不需要购买。',
      'Family challenge: use paper cards to design an imaginary New Zealand stationery purchase with an NZ$30 budget. Choose whole-dollar prices and counts for two items. Draw equal groups for each cost, then find total and balance. Also share the cards into bags, recording amount per bag or bag count and any remainder. Keep units and checking expressions. No score or purchase is needed.',
    ),
    parent: {
      goal: T(
        '根据数量关系选运算，结果的单位回到问题中。',
        'Choose operations from relationships and return the result’s units to the question.',
      ),
      misconception: T(
        '按“多、少、每”猜符号，忽略未知量或把不同单位混算。',
        'Guessing operations from keywords, overlooking the unknown or mixing incompatible units.',
      ),
      prompts: [
        T(
          '每个数在数什么，未知量是谁？',
          'What does each number count, and what is unknown?',
        ),
        T(
          '画图或反向检查后，数量与单位都能对上吗？',
          'Do both quantities and units fit a diagram or an inverse check?',
        ),
      ],
      bridge: 'B02-L03',
    },
  }),
];
export const b02CheckQuestions: Question[] = [
  q(
    'B02-CHECK-Q1',
    '总量 23，已知一个部分是 9，另一部分是多少？',
    'The total is twenty-three and one part is nine. Find the other part.',
    14,
    parts,
    [
      '整体包括两个部分。',
      'The whole contains both parts.',
      '从总量减已知部分。',
      'Subtract the known part from the total.',
    ],
    [T('23−9=14；9+14=23。', '23−9=14; 9+14=23.')],
    ['14'],
    ['32', '9', '23'],
  ),
  c(
    'B02-CHECK-Q2',
    '五组每组四个，求总量应选哪一个？',
    'For five groups of four, which expression finds the total?',
    1,
    groups,
    [
      [
        '5+4',
        '5+4',
        '组数与每组量不是两个物体部分。',
        'Group count and per-group amount are not two object parts.',
      ],
      ['5×4', '5×4', '五个相同的四合起来。', 'Combine five equal fours.'],
      [
        '20÷5',
        '20÷5',
        '这从已知总量恢复每组量，不是正向求总量。',
        'This recovers amount per group from a known total rather than finding the total forwards.',
      ],
    ],
    [
      '已知的是哪两个量？',
      'Which two quantities are known?',
      '重复组用乘法表示。',
      'Multiplication represents repeated equal groups.',
    ],
    [T('5×4=20。', '5×4=20.')],
  ),
  q(
    'B02-CHECK-Q3',
    '阵列四行，每行七个，总共有几个？',
    'An array has four rows of seven. How many counters altogether?',
    28,
    groups,
    [
      '每行是等组。',
      'Each row is an equal group.',
      '四个七合计。',
      'Combine four equal sevens.',
    ],
    [T('4×7=28。', '4×7=28.')],
    ['28'],
    ['11', '4', '7'],
  ),
  q(
    'B02-CHECK-Q4',
    '30 个球平均分给 6 人，每人几个？',
    'Share thirty balls equally among six people. How many per person?',
    5,
    division,
    [
      '6 是人数。',
      'Six counts people.',
      '求每人的量。',
      'Find the amount per person.',
    ],
    [T('30÷6=5；6×5=30。', '30÷6=5; 6×5=30.')],
    ['5'],
    ['24', '6', '36'],
  ),
  q(
    'B02-CHECK-Q5',
    '27 个球，每盒四个，余下另放，可以装满几盒？',
    'Pack twenty-seven balls four per box and set leftovers aside. How many full boxes?',
    6,
    division,
    [
      '六盒要二十四个。',
      'Six boxes need twenty-four balls.',
      '七盒要二十八个，不够。',
      'Seven boxes need twenty-eight, too many.',
    ],
    [
      T(
        '27=4×6+3；满盒数为 6，余 3。',
        '27=4×6+3; six full boxes and three left.',
      ),
    ],
    ['6'],
    ['7', '6.75', '23'],
  ),
  q(
    'B02-CHECK-Q6',
    '9×?=63，缺少的因数是多少？',
    'For 9×?=63, find the missing factor.',
    7,
    inverse,
    [
      '用除法恢复未知因数。',
      'Use division to recover the missing factor.',
      '63÷9。',
      'Calculate 63÷9.',
    ],
    [T('63÷9=7；9×7=63。', '63÷9=7; 9×7=63.')],
    ['7'],
    ['54', '9', '72'],
  ),
  q(
    'B02-CHECK-Q7',
    '假想预算 NZ$28，买三件每件 NZ$6 的物品，还剩多少元？',
    'With an imaginary NZ$28 budget, buy three items at NZ$6 each. How many dollars remain?',
    10,
    choose,
    [
      '先求三件合计价格。',
      'Find the combined cost first.',
      '再从预算中减去。',
      'Subtract it from the budget.',
    ],
    [T('3×6=18；28−18=NZ$10。', '3×6=18; 28−18=NZ$10.')],
    ['10', 'NZ$10'],
    ['18', '22', '10 m'],
    'NZD',
  ),
  r(
    'B02-CHECK-Q8',
    '用 24÷6=4 分别编一个“平均分”与一个“每组固定数量”的故事。两个 6 和两个 4 分别计什么？',
    'Give a sharing story and a fixed-group-size story for 24÷6=4. What do the sixes and fours count?',
    division,
    '例如 24 球分给六人，每人四球，6 是人数，4 是每人量；24 球每盒六球，共四盒，6 是每盒量，4 是盒数。两个故事都用 24÷6，但未知量的角色与单位不同。需要明确同样多或固定每组量，不能只重复数字。',
    'For example, twenty-four balls shared among six people give four each: six counts people and four balls per person. Packing twenty-four balls six per box gives four boxes: six is balls per box and four box count. Both use 24÷6 with different unknown roles and units. State equal shares or fixed group size, not only repeat numbers.',
    [
      '先说已知人数的故事。',
      'Start with a known-recipient-count story.',
      '再说已知每盒量的故事。',
      'Then use a known-amount-per-box story.',
    ],
  ),
];
export function b02ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a non-negative review round');
  const k = round % 80,
    qid = `${id}-R${round}`;
  if (id === 'B02-L01') {
    const a = 7 + (k % 9),
      b = 4 + (Math.floor(k / 9) % 7),
      form = k % 3,
      value = form === 0 ? a + b : form === 1 ? b : Math.abs(a - b);
    return q(
      qid,
      form === 0
        ? `${a} 个与 ${b} 个合起来，共几个？`
        : form === 1
          ? `总量 ${a + b}，已知部分 ${a}，另一部分是多少？`
          : `两组分别 ${a} 与 ${b} 个，较多组多几个？`,
      form === 0
        ? `Combine ${a} and ${b} counters. How many altogether?`
        : form === 1
          ? `The total is ${a + b} and a part is ${a}. Find the other part.`
          : `Two groups have ${a} and ${b} counters. How many more in the larger group?`,
      value,
      form === 2 ? difference : parts,
      [
        '先辨认整体、部分或两个比较量。',
        'Identify whole, parts or comparison quantities.',
        '用关系而不是关键词选加减。',
        'Choose addition or subtraction from the relationship.',
      ],
      [
        T(
          form === 0
            ? `${a}+${b}=${value}。`
            : form === 1
              ? `${a + b}−${a}=${value}。`
              : `${Math.max(a, b)}−${Math.min(a, b)}=${value}。`,
          form === 0
            ? `${a}+${b}=${value}.`
            : form === 1
              ? `${a + b}−${a}=${value}.`
              : `${Math.max(a, b)}−${Math.min(a, b)}=${value}.`,
        ),
      ],
      [String(value)],
      [String(form === 0 ? Math.abs(a - b) : a + b)],
    );
  }
  if (id === 'B02-L02') {
    const count = k % 16 === 15 ? 0 : 1 + (k % 6),
      size = 2 + (Math.floor(k / 6) % 7),
      total = count * size;
    return q(
      qid,
      `${count} 组，每组 ${size} 个，总量多少？`,
      `${count} groups contain ${size} each. What is the total?`,
      total,
      groups,
      [
        '组数与每组量是不同角色。',
        'Group count and amount per group have different roles.',
        '把相同每组量重复指定次数。',
        'Repeat the equal amount the specified number of times.',
      ],
      [T(`${count}×${size}=${total}。`, `${count}×${size}=${total}.`)],
      [String(total)],
      [String(count === 0 ? size : count)],
    );
  }
  if (id === 'B02-L03') {
    const divisor = 2 + (k % 5),
      amount = 1 + (k % 7),
      remainder = k % divisor,
      total = divisor * amount + remainder,
      share = k % 2 === 0;
    return q(
      qid,
      share
        ? `${total} 个完整小球不拆分，分给 ${divisor} 人。每人同样多，余下另放，每人最多几个？`
        : `${total} 个小球每盒 ${divisor} 个，余下另放，满盒有几个？`,
      share
        ? `Share ${total} indivisible counters equally among ${divisor} people, setting leftovers aside. What maximum whole count does each receive?`
        : `Pack ${total} counters ${divisor} per box, with leftovers aside. How many full boxes?`,
      amount,
      division,
      [
        '先区分已知份数与已知每份量。',
        'Distinguish known share count from known amount per share.',
        '完整组与余量要一起恢复总量。',
        'Complete groups and remainder must recover the total.',
      ],
      [
        T(
          `${total}=${divisor}×${amount}+${remainder}；${share ? '每人量' : '满盒数'}为 ${amount}，余 ${remainder}。`,
          `${total}=${divisor}×${amount}+${remainder}; ${share ? 'amount per person' : 'full-box count'} is ${amount}, with ${remainder} left.`,
        ),
      ],
      [String(amount)],
      [String(amount + 1)],
    );
  }
  if (id === 'B02-L04') {
    const count = 2 + (k % 5),
      size = 3 + (Math.floor(k / 5) % 6),
      total = count * size,
      findSize = k % 2 === 0,
      value = findSize ? size : count,
      known = findSize ? count : size;
    return q(
      qid,
      findSize
        ? `${count} 组共 ${total} 个，每组同样多，每组几个？`
        : `共 ${total} 个，每组 ${size} 个，有几组？`,
      findSize
        ? `${count} equal groups total ${total}. How many per group?`
        : `There are ${total} counters and ${size} per group. How many groups?`,
      value,
      inverse,
      [
        '总量=组数×每组量。',
        'Total equals group count times amount per group.',
        '用总量除以已知因数，再乘回检查。',
        'Divide total by the known factor and multiply back.',
      ],
      [
        T(
          `${total}÷${known}=${value}；${known}×${value}=${total}。`,
          `${total}÷${known}=${value}; ${known}×${value}=${total}.`,
        ),
      ],
      [String(value)],
      [String(total - known)],
    );
  }
  if (id === 'B02-L05') {
    const a = 2 + (k % 7),
      b = 2 + (Math.floor(k / 7) % 5),
      form = k % 3;
    if (form === 0) {
      const budget = 60,
        cost = a * b,
        balance = budget - cost;
      return q(
        qid,
        `假想预算 NZ$60，买 ${b} 件每件 NZ$${a} 的物品，剩多少元？`,
        `With an imaginary NZ$60 budget, buy ${b} items at NZ$${a} each. How many dollars remain?`,
        balance,
        choose,
        [
          '先求所有物品的成本。',
          'Find the cost of all items first.',
          '预算减成本，检查同为元的数量。',
          'Subtract cost from budget, checking dollar units.',
        ],
        [
          T(
            `${a}×${b}=${cost}；60−${cost}=NZ$${balance}。`,
            `${a}×${b}=${cost}; 60−${cost}=NZ$${balance}.`,
          ),
        ],
        [String(balance), `NZ$${balance}`],
        [String(budget - a)],
        'NZD',
      );
    }
    if (form === 1)
      return q(
        qid,
        `两盒分别有 ${a} 与 ${b} 个物体，合计多少？`,
        `Two boxes contain ${a} and ${b} objects. What is the combined count?`,
        a + b,
        choose,
        [
          '两个数量是整体的部分。',
          'Both quantities are parts of the whole.',
          '用加法合并。',
          'Combine using addition.',
        ],
        [T(`${a}+${b}=${a + b}。`, `${a}+${b}=${a + b}.`)],
        [String(a + b)],
        [String(Math.abs(a - b))],
      );
    return q(
      qid,
      `${a * b} 张纸卡，每袋 ${a} 张，有几袋？`,
      `Pack ${a * b} paper cards ${a} per bag. How many bags?`,
      b,
      choose,
      [
        '总量与每袋量已知。',
        'Total and amount per bag are known.',
        '包含分组求袋数。',
        'Grouping division finds bag count.',
      ],
      [
        T(
          `${a * b}÷${a}=${b}；${b}×${a}=${a * b}。`,
          `${a * b}÷${a}=${b}; ${b}×${a}=${a * b}.`,
        ),
      ],
      [String(b)],
      [String(a * b)],
    );
  }
  throw new Error(`Unknown B02 lesson ${id}`);
}
