import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning, b06Lesson } from './builders';
type Pair = [string, string];
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
const K = 'known-unknown-units',
  B = 'bar-relationships',
  S = 'two-step-plan',
  R = 'relevant-information',
  E = 'explain-and-check';
const T = (p: Pair) => t(...p);
function q(
  id: string,
  stem: Pair,
  value: number,
  skill: string,
  hints: [Pair, Pair],
  steps: Pair[],
  wrong: string[],
  unit: Unit = 'cards',
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
  item.type = 'word_problem';
  item.misconceptionTags = [
    skill,
    'reading',
    'representation',
    ...(unit ? ['reading-units'] : []),
  ];
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
  return choice(
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
}
function r(
  id: string,
  stem: Pair,
  skill: string,
  rubric: Pair,
  hints: [Pair, Pair],
) {
  return reasoning(id, T(stem), skill, T(rubric), hints.map(T));
}
const diagram = (
  relation: 'parts' | 'comparison' | 'groups',
  a: number,
  b: number,
  unknown: 'result' | 'component',
  unit: Pair = ['米', 'metres'],
): Question['diagram'] => ({
  kind: 'problem-bars',
  relation,
  a,
  b,
  unknown,
  unit: T(unit),
});
export const b06Lessons: Lesson[] = [
  b06Lesson({
    id: 'B06-L01',
    title: t('找出已知、未知和单位', 'Identifying knowns, unknowns and units'),
    objective: t(
      '先说明有关已知量、要找的量及单位，再建立数量关系。',
      'Identify relevant knowns, the unknown and units before forming a quantitative relationship.',
    ),
    prerequisites: ['B02-L01', 'B05-L01'],
    keywords: [t('已知量', 'known'), t('未知量', 'unknown'), t('单位', 'unit')],
    minutes: 15,
    lab: 'problem-information',
    hook: t(
      '步道长 18 m，已走 7 m，草地上有 4 只鸟。要找剩余长度，三个数字都要用吗？',
      'A track is 18 m long, with 7 m walked and 4 birds on the grass. Must all three numbers be used to find remaining length?',
    ),
    guided: q(
      'B06-L01-G',
      [
        '步道全长 18 m，已走 7 m，剩余多少 m？',
        'A track is 18 m long and 7 m have been walked. How many m remain?',
      ],
      11,
      K,
      [
        [
          '要找的是剩余长度，不是鸟数。',
          'The unknown is remaining length, not bird count.',
        ],
        ['已走+剩余=全长。', 'Walked + remaining = full length.'],
      ],
      [
        ['18−7=11 m。', '18−7=11 m.'],
        [
          '7+11=18，核查两部分恢复全长。',
          '7+11=18 checks that the two parts recover the full length.',
        ],
      ],
      ['18', '25', '11 cm'],
      'm',
    ),
    questions: [
      c(
        'B06-L01-Q1',
        [
          '盒里原有 24 张卡，拿走 9 张。问还剩几张。哪个量是未知？',
          'A box held 24 cards and 9 were removed. Which quantity is unknown when asking how many remain?',
        ],
        1,
        K,
        [
          [
            ['原有 24 张', 'Original 24 cards'],
            ['这是已经给出的量。', 'This quantity is already given.'],
          ],
          [
            ['剩余张数', 'Remaining card count'],
            [
              '它是问题要找的量，单位为张。',
              'This is the requested unknown, measured in cards.',
            ],
          ],
          [
            ['拿走 9 张', '9 cards removed'],
            [
              '拿走量已知，不是本题未知。',
              'Removed count is known, not the requested unknown.',
            ],
          ],
        ],
        [
          ['先读最后的问题句。', 'Read the question sentence first.'],
          [
            '区分已发生的数量与要找的结果。',
            'Distinguish given quantities from the requested result.',
          ],
        ],
        [
          [
            '已知 24 与 9，未知剩余；24=9+剩余。',
            'Known 24 and 9, unknown remaining; 24 = 9 + remaining.',
          ],
        ],
      ),
      q(
        'B06-L01-Q2',
        [
          '纸条总长 18 cm，剪去 7 cm。题目给出的总长是多少 cm？只写这个已知量。',
          'A strip is 18 cm long and 7 cm is cut off. What full length in cm is given? Write only that known quantity.',
        ],
        18,
        K,
        [
          ['本题没有问剩余。', 'This question does not ask for the remainder.'],
          ['把“总长”与 18 cm 配对。', 'Match “full length” with 18 cm.'],
        ],
        [
          [
            '总长已知为 18 cm，不需要计算差。',
            'Full length is given as 18 cm; no difference calculation is needed.',
          ],
        ],
        ['11', '25', '18 m'],
        'cm',
      ),
      q(
        'B06-L01-Q3',
        [
          '步道全长 27 m，剩下 12 m 未走。已经走了多少 m？',
          'A 27 m track has 12 m left unwalked. How many m have been walked?',
        ],
        15,
        K,
        [
          [
            '这次未知是已走，不是剩余。',
            'The unknown is walked length this time.',
          ],
          ['已走+12=27。', 'Walked + 12 = 27.'],
        ],
        [
          ['27−12=15 m。', '27−12=15 m.'],
          ['15+12=27，单位都是米。', '15+12=27, all measured in metres.'],
        ],
        ['12', '39', '15 cm'],
        'm',
      ),
      q(
        'B06-L01-Q4',
        [
          '长度资料写 3 m 40 cm。整理成同一已知量，是多少 cm？',
          'A length is recorded as 3 m 40 cm. Express this known quantity in cm.',
        ],
        340,
        K,
        [
          [
            '不能把 3 与 40 当同单位相加。',
            'Do not add 3 and 40 as if their units match.',
          ],
          ['1 m=100 cm。', '1 m=100 cm.'],
        ],
        [
          ['3 m=300 cm，300+40=340 cm。', '3 m=300 cm, so 300+40=340 cm.'],
          [
            '340 cm 包含三个完整的百厘米与 40 cm。',
            '340 cm contains three full hundreds of centimetres and 40 cm.',
          ],
        ],
        ['43', '3040', '340 m'],
        'cm',
      ),
      q(
        'B06-L01-Q5',
        [
          '两段纸带长 8 cm 和 7 cm，连接时不重叠。要找连接后的长度，是多少 cm？',
          'Two strips are 8 cm and 7 cm long and join without overlap. What is the joined length in cm?',
        ],
        15,
        K,
        [
          [
            '未知是两部分组成的整体。',
            'The unknown is the whole formed from two parts.',
          ],
          [
            '相同长度单位，首尾相接。',
            'They share a length unit and join end to end.',
          ],
        ],
        [
          ['8+7=15 cm。', '8+7=15 cm.'],
          [
            '不是两段相差多少，不能用 8−7。',
            'The question is not their difference, so do not use 8−7.',
          ],
        ],
        ['1', '56', '15 cm²'],
        'cm',
      ),
      r(
        'B06-L01-Q6',
        [
          '步道题里有人算 18+7+4=29。解释三个数各计什么，哪个量要找，为什么不能全加。',
          'Someone computes 18+7+4=29 in the track story. Explain what each number counts, the unknown, and why they cannot all be added.',
        ],
        K,
        [
          '18 m 是全长，7 m 是已走，4 是鸟数；未知是剩余米数。鸟数不参与长度关系；18=7+剩余，剩余 11 m，可加回核查。',
          '18 m is full length, 7 m is walked length, and 4 counts birds. Remaining metres are unknown. Birds do not enter the length relationship: 18 = 7 + remaining, giving 11 m, checked by adding back.',
        ],
        [
          ['给每个数写对象与单位。', 'Name each quantity and unit.'],
          ['已走是全长的一部分。', 'Walked length is part of the full length.'],
        ],
      ),
    ],
    exit: q(
      'B06-L01-X',
      [
        '纸带总长 31 cm，剪下一段后还剩 13 cm。剪下了多少 cm？',
        'A 31 cm strip has 13 cm remaining after a piece is cut off. How many cm were cut off?',
      ],
      18,
      K,
      [
        ['未知改成了剪下的部分。', 'The unknown is now the removed part.'],
        ['剪下+13=31。', 'Removed + 13 = 31.'],
      ],
      [
        ['31−13=18 cm。', '31−13=18 cm.'],
        [
          '18+13=31，回到原有总长。',
          '18+13=31 recovers the original full length.',
        ],
      ],
      ['13', '44', '18 m'],
      'cm',
    ),
    exitReason: t(
      '写出已知、未知、单位与一个能核查的关系。',
      'State knowns, unknown, units and a relationship that can be checked.',
    ),
    parent: {
      goal: t(
        '先听孩子解释问题要找哪个量，再听算式。',
        'Listen for the requested quantity before the expression.',
      ),
      misconception: t(
        '见到所有数字就算，或把不同单位直接合并。',
        'Using every number or combining quantities with different units.',
      ),
      prompts: [
        t(
          '哪个数已经给了，哪个量还不知道？',
          'Which quantities are given and which is unknown?',
        ),
        t(
          '这个数在计长度、个数还是钱？',
          'Does this number measure length, count or money?',
        ),
      ],
      bridge: 'B05-L01',
    },
  }),
  b06Lesson({
    id: 'B06-L02',
    title: t(
      '画条形图表达数量关系',
      'Representing relationships with bar models',
    ),
    objective: t(
      '用整体/部分、对齐比较和相等组条形图放置未知量，再据关系列式。',
      'Place the unknown in part-whole, aligned-comparison and equal-group bar models before choosing an expression.',
    ),
    prerequisites: ['B06-L01', 'B02-L02', 'B02-L04'],
    keywords: [
      t('条形模型', 'bar model'),
      t('整体与部分', 'whole and parts'),
      t('差距', 'difference'),
    ],
    minutes: 17,
    lab: 'problem-represent',
    hook: t(
      '“多四张”一定要加四吗？Mina 有九张，比 Noah 多四张；问 Noah 的张数，问号该放在哪里？',
      'Does “four more” always mean add four? Mina has nine cards, four more than Noah. Where should the unknown for Noah be placed?',
    ),
    guided: q(
      'B06-L02-G',
      [
        '两段步道 9 m 与 6 m 首尾相接，整体长度是多少 m？',
        'Tracks of 9 m and 6 m join end to end. What is the whole length in m?',
      ],
      15,
      B,
      [
        ['两条是整体的两个部分。', 'The two bars are parts of one whole.'],
        [
          '问号在整体上，不在差距上。',
          'The question mark is on the whole, not the difference.',
        ],
      ],
      [
        ['9+6=15 m。', '9+6=15 m.'],
        ['首尾相接的两部分组成整体。', 'The end-to-end parts form the whole.'],
      ],
      ['3', '54', '15 cm²'],
      'm',
      diagram('parts', 9, 6, 'result'),
    ),
    questions: [
      c(
        'B06-L02-Q1',
        [
          '要比较两段步道 17 m 与 9 m 相差多少，哪种图合适？',
          'Which model fits the difference between 17 m and 9 m tracks?',
        ],
        0,
        B,
        [
          [
            [
              '起点对齐，两条末端的差距放问号',
              'Align starts; put the question mark on the gap',
            ],
            [
              '同一比例对齐，差距表示较大量减较小量。',
              'Alignment at one scale shows larger minus smaller.',
            ],
          ],
          [
            [
              '两条首尾相接，整体放问号',
              'Join bars end to end; ask for the whole',
            ],
            [
              '这表示合计，不表示差距。',
              'This represents a total, not a difference.',
            ],
          ],
          [
            ['把所有条画一样长', 'Draw all bars the same length'],
            [
              '17 与 9 不相等，不能把量画成相同。',
              '17 and 9 differ, so their bars should not be equal.',
            ],
          ],
        ],
        [
          [
            '问题是合计还是差距？',
            'Is the question about total or difference?',
          ],
          ['比较条起点对齐。', 'Align comparison bars at their starts.'],
        ],
        [['对齐后差距是 17−9=8 m。', 'The aligned gap is 17−9=8 m.']],
      ),
      q(
        'B06-L02-Q2',
        [
          '整体为 24 m，第一部分 9 m，第二部分多少 m？',
          'The whole is 24 m and the first part 9 m. How many m are in the second part?',
        ],
        15,
        B,
        [
          ['未知部分与 9 合成 24。', 'The unknown part joins 9 to make 24.'],
          ['整体减已知部分。', 'Subtract the known part from the whole.'],
        ],
        [['24−9=15 m；9+15=24。', '24−9=15 m; 9+15=24.']],
        ['33', '9', '15 m²'],
        'm',
        diagram('parts', 9, 15, 'component'),
      ),
      q(
        'B06-L02-Q3',
        [
          '较长步道 17 m，较短 9 m，相差多少 m？',
          'One track is 17 m and the shorter 9 m. What is their difference in m?',
        ],
        8,
        B,
        [
          [
            '差距不包含共同的九米。',
            'The gap excludes their shared nine metres.',
          ],
          ['较大量减较小量。', 'Subtract smaller from larger.'],
        ],
        [['17−9=8 m，9+8=17。', '17−9=8 m, with 9+8=17.']],
        ['26', '9', '8 km'],
        'm',
        diagram('comparison', 17, 9, 'result'),
      ),
      q(
        'B06-L02-Q4',
        [
          '4 袋，每袋 6 张卡，一共有几张？',
          '4 bags hold 6 cards each. How many cards altogether?',
        ],
        24,
        B,
        [
          [
            '四段都代表六张，不是四加六。',
            'Each of four segments represents six cards, not four plus six.',
          ],
          ['组数×每组张数。', 'Group count × cards per group.'],
        ],
        [['4×6=24 张，6+6+6+6=24。', '4×6=24 cards, also 6+6+6+6=24.']],
        ['10', '2', '24%'],
        undefined,
        diagram('groups', 4, 6, 'result', ['张卡', 'cards']),
      ),
      q(
        'B06-L02-Q5',
        [
          'Mina 有 9 张卡，比 Noah 多 4 张。Noah 有几张？',
          'Mina has 9 cards, which is 4 more than Noah. How many does Noah have?',
        ],
        5,
        B,
        [
          [
            'Mina 是较大量，未知是 Noah。',
            'Mina has the larger quantity; Noah is unknown.',
          ],
          ['Noah+4=9。', 'Noah + 4 = 9.'],
        ],
        [
          ['9−4=5 张；5+4=9。', '9−4=5 cards; 5+4=9.'],
          [
            '“多”描述关系，并不总叫你做加法。',
            '“More” describes the relationship rather than always instructing addition.',
          ],
        ],
        ['13', '4', '36'],
      ),
      r(
        'B06-L02-Q6',
        [
          '同一整体是 24，已知部分是 9。解释为何求整体用加，求另一部分却用减，图里的关系有没有改变？',
          'The same whole is 24 with known part 9. Explain why finding a whole uses addition but finding the other part uses subtraction. Did the pictured relationship change?',
        ],
        B,
        [
          '关系始终是 9+另一部分=24；问号位置改变。求整体合并两部分；求未知部分用 24−9=15，并以 9+15=24 核查。',
          'The relationship remains 9 + other part = 24, but the unknown changes position. Add parts to find a whole; use 24−9=15 to find the missing part, checked by 9+15=24.',
        ],
        [
          [
            '先用语言说整体与两部分。',
            'State the whole and two parts in words.',
          ],
          [
            '把问号放到不同位置。',
            'Place the question mark in different positions.',
          ],
        ],
      ),
    ],
    exit: q(
      'B06-L02-X',
      [
        '两段步道共 22 m，其中一段 8 m。另一段多少 m？',
        'Two track sections total 22 m. One is 8 m. How many m is the other?',
      ],
      14,
      B,
      [
        [
          '先画整体，再标八米部分。',
          'Draw the whole, then the eight-metre part.',
        ],
        ['8+未知=22。', '8 + unknown = 22.'],
      ],
      [['22−8=14 m；8+14=22。', '22−8=14 m; 8+14=22.']],
      ['30', '8', '14 cm'],
      'm',
      diagram('parts', 8, 14, 'component'),
    ),
    exitReason: t(
      '说明图中每段代表什么，问号在哪里，以及怎样核查。',
      'Explain what each bar represents, where the unknown is, and how to check.',
    ),
    parent: {
      goal: t(
        '让条形图承担关系表达，而不是只装饰答案。',
        'Use bars to express the relationship rather than decorate the answer.',
      ),
      misconception: t(
        '凭“多”“一共”等单词机械选运算。',
        'Choosing operations mechanically from words such as “more” or “altogether”.',
      ),
      prompts: [
        t(
          '首尾相接还是起点对齐？为什么？',
          'Should bars join end to end or align their starts? Why?',
        ),
        t(
          '把问号移到另一段，关系还成立吗？',
          'Does the relationship remain when the unknown moves?',
        ),
      ],
      bridge: 'B02-L01',
    },
  }),
  b06Lesson({
    id: 'B06-L03',
    title: t('分两步解决问题', 'Solving two-step problems'),
    objective: t(
      '为两步问题先求必要的中间量，标明单位，再完成目标并核查。',
      'Find and name the necessary intermediate quantity and unit before completing and checking a two-step problem.',
    ),
    prerequisites: ['B06-L02', 'B02-L04', 'B03-L02'],
    keywords: [
      t('中间量', 'intermediate quantity'),
      t('两步计划', 'two-step plan'),
      t('核查', 'check'),
    ],
    minutes: 17,
    lab: 'problem-two-step',
    hook: t(
      '四盒每盒六张，送出五张。为什么 4+6−5 不是这件事的正确记录？',
      'Four boxes hold six cards each and five cards are given away. Why does 4+6−5 fail to record the story?',
    ),
    guided: q(
      'B06-L03-G',
      [
        '4 盒每盒 6 张卡，送出 5 张后剩几张？',
        '4 boxes hold 6 cards each. How many remain after giving away 5 cards?',
      ],
      19,
      S,
      [
        [
          '先求原有张数，不是盒数加每盒张数。',
          'Find original cards rather than add boxes to cards per box.',
        ],
        ['原有=4×6，剩余=原有−5。', 'Original = 4×6; remaining = original−5.'],
      ],
      [
        ['原有 4×6=24 张。', 'Originally 4×6=24 cards.'],
        [
          '剩余 24−5=19 张，19+5=24 核查。',
          'Remaining 24−5=19 cards, checked by 19+5=24.',
        ],
      ],
      ['5', '29', '24'],
    ),
    questions: [
      c(
        'B06-L03-Q1',
        [
          '要算 4 盒每盒 6 张、送 5 张后的剩余，先求哪个量？',
          'For 4 boxes of 6 cards and 5 given away, which quantity is needed first?',
        ],
        2,
        S,
        [
          [
            ['4+6 的和', 'The sum 4+6'],
            [
              '盒数和每盒张数角色不同，不能这样求张数。',
              'Boxes and cards per box play different roles; their sum does not give cards.',
            ],
          ],
          [
            ['6−5 的差', 'The difference 6−5'],
            [
              '五张从全部卡片中送出，不是只从一盒。',
              'Five cards are given from all cards, not just one box.',
            ],
          ],
          [
            ['4×6 的原有张数', 'The original card count 4×6'],
            [
              '先得到二十四张，再扣五张。',
              'Find twenty-four original cards, then subtract five.',
            ],
          ],
        ],
        [
          [
            '第一步输出要能进入第二步。',
            'The first output must feed the second step.',
          ],
          [
            '第二步要从张数中扣五张。',
            'The second step subtracts five from a card count.',
          ],
        ],
        [['4×6=24 张，24−5=19 张。', '4×6=24 cards, then 24−5=19 cards.']],
      ),
      q(
        'B06-L03-Q2',
        [
          '第一组 5 人、第二组 3 人，每人发 4 张卡，共需几张？',
          'Groups of 5 and 3 people each receive 4 cards per person. How many cards are needed?',
        ],
        32,
        S,
        [
          ['先合并人数。', 'Combine people counts first.'],
          ['(5+3) 人，每人四张。', '(5+3) people, four cards each.'],
        ],
        [
          ['5+3=8 人；8×4=32 张。', '5+3=8 people; 8×4=32 cards.'],
          [
            '括号记录先求人数，不是 5+3×4。',
            'Parentheses record finding people first, rather than 5+3×4.',
          ],
        ],
        ['17', '12', '8'],
      ),
      q(
        'B06-L03-Q3',
        [
          '30 张卡先留 6 张，余下每袋 4 张，正好装几袋？',
          'Set aside 6 of 30 cards. Pack the remaining cards in bags of 4. How many full bags, with no cards left over?',
        ],
        6,
        S,
        [
          ['先找可装袋张数。', 'Find cards available for packing first.'],
          ['(30−6)÷4。', '(30−6)÷4.'],
        ],
        [
          ['30−6=24 张；24÷4=6 袋。', '30−6=24 cards; 24÷4=6 bags.'],
          [
            '6×4+6=30，袋与张不是同单位。',
            '6×4+6=30 checks the story; bags and cards are different units.',
          ],
        ],
        ['24', '9', '7.5'],
        'bags',
      ),
      q(
        'B06-L03-Q4',
        [
          '3 包每包 8 张卡，另有散卡 4 张，共几张？',
          '3 packs hold 8 cards each, with 4 loose cards. How many cards altogether?',
        ],
        28,
        S,
        [
          ['先求三包的张数。', 'Find cards in three packs first.'],
          ['相乘后加入散卡。', 'Multiply, then add loose cards.'],
        ],
        [['3×8=24 张；24+4=28 张。', '3×8=24 cards; 24+4=28 cards.']],
        ['15', '36', '24'],
      ),
      q(
        'B06-L03-Q5',
        [
          '3 盒每盒 4 张卡，全部 12 张送出，剩几张？',
          '3 boxes hold 4 cards each. All 12 cards are given away. How many remain?',
        ],
        0,
        S,
        [
          ['先算原有十二张。', 'Find twelve original cards.'],
          ['剩余可以为零。', 'A remaining count can be zero.'],
        ],
        [
          ['3×4=12，12−12=0 张。', '3×4=12, then 12−12=0 cards.'],
          [
            '零张不是“不知道”，是全部送完。',
            'Zero is a determined count, not “unknown”: all were given away.',
          ],
        ],
        ['12', '24', '1'],
      ),
      r(
        'B06-L03-Q6',
        [
          '有人把 4 盒每盒 6 张、送 5 张写成 4×(6−5)=4。解释括号为何改变了故事，给正确两步与中间量。',
          'Someone writes 4×(6−5)=4 for 4 boxes of 6 cards with 5 given away. Explain how the parentheses change the story, giving the correct two steps and intermediate quantity.',
        ],
        S,
        [
          '4×(6−5) 表示每盒都送五张，共送二十张；原题只送五张。先求 4×6=24 张，再 24−5=19 张；19+5=24 核查。',
          '4×(6−5) removes five from every box, giving away twenty in total. The story gives away only five. First 4×6=24 cards, then 24−5=19 cards; 19+5=24 checks it.',
        ],
        [
          [
            '五张是每盒送还是总共送？',
            'Are five given from each box or in total?',
          ],
          [
            '给第一步的结果写“原有张数”。',
            'Label the first result “original cards”.',
          ],
        ],
      ),
    ],
    exit: q(
      'B06-L03-X',
      [
        '预算 NZ$40，买 3 本每本 NZ$7 的笔记本，剩多少 NZ$？',
        'A budget is NZ$40. Buy 3 notebooks at NZ$7 each. How many NZ$ remain?',
      ],
      19,
      S,
      [
        [
          '先求总价，不用预算减本数。',
          'Find total cost rather than subtract notebook count from budget.',
        ],
        ['总价=3×7，余钱=40−总价。', 'Cost = 3×7; money remaining = 40−cost.'],
      ],
      [
        ['3×7=NZ$21，40−21=NZ$19。', '3×7=NZ$21; 40−21=NZ$19.'],
        ['19+21=40 核查预算。', '19+21=40 checks the budget.'],
      ],
      ['21', '37', '19 m'],
      'NZD',
    ),
    exitReason: t(
      '命名第一步得到的量，解释它如何成为第二步的已知。',
      'Name the first result and explain how it becomes a known quantity for step two.',
    ),
    parent: {
      goal: t(
        '孩子能说明步骤的依赖，而不只背乘法先做。',
        'Explain the dependency between steps rather than memorise “multiply first”.',
      ),
      misconception: t(
        '没有看中间量，或把总共送出误写成每组送出。',
        'Ignoring intermediate quantities or confusing total removal with removal from every group.',
      ),
      prompts: [
        t(
          '第二步需要哪个第一步结果？',
          'Which first result does step two need?',
        ),
        t('每步输出的单位是什么？', 'What unit does each step produce?'),
      ],
      bridge: 'B06-L02',
    },
  }),
  b06Lesson({
    id: 'B06-L04',
    title: t('识别不需要的数据', 'Spotting irrelevant information'),
    objective: t(
      '根据要找的量选择必要数据，并区分多余信息与缺少信息。',
      'Select necessary data for the requested quantity and distinguish extra information from missing information.',
    ),
    prerequisites: ['B06-L01', 'B06-L03'],
    keywords: [
      t('相关信息', 'relevant information'),
      t('多余信息', 'extra information'),
      t('信息不足', 'insufficient information'),
    ],
    minutes: 16,
    lab: 'problem-relevance',
    hook: t(
      '笔记本四本、每本五元，铅笔每包三元。只买笔记本时，铅笔价格还要算吗？这些资料能算总质量吗？',
      'Four notebooks cost five dollars each, while pencils cost three dollars per pack. If only notebooks are bought, is pencil price needed? Can these facts determine total mass?',
    ),
    guided: q(
      'B06-L04-G',
      [
        '预算 NZ$30，买 4 本每本 NZ$5 的笔记本，不买每包 NZ$3 的铅笔。余钱多少 NZ$？',
        'Budget NZ$30; buy 4 notebooks at NZ$5 each and no pencil packs priced NZ$3. How many NZ$ remain?',
      ],
      10,
      R,
      [
        [
          '问余钱，需要预算、本数、笔记本单价。',
          'Remaining money needs budget, notebook count and notebook unit price.',
        ],
        ['未买的铅笔价格不用。', 'Unused pencil price is unnecessary.'],
      ],
      [
        ['4×5=NZ$20，30−20=NZ$10。', '4×5=NZ$20, then 30−20=NZ$10.'],
        [
          '不是 30−20−3；没有购买铅笔。',
          'Not 30−20−3: no pencils were purchased.',
        ],
      ],
      ['7', '20', '10 m'],
      'NZD',
    ),
    questions: [
      c(
        'B06-L04-Q1',
        [
          '只知道买 4 本笔记本、每本 NZ$5，能确定四本总质量吗？',
          'Given 4 notebooks at NZ$5 each, can their total mass be determined?',
        ],
        1,
        R,
        [
          [
            ['能，20 kg', 'Yes, 20 kg'],
            ['4×5 得到钱数，不是质量。', '4×5 gives money rather than mass.'],
          ],
          [
            [
              '不能，缺每本或合计质量',
              'No; mass per notebook or total mass is missing',
            ],
            [
              '数量与价格足够求总价，却不足以求质量。',
              'Count and price determine cost but not mass.',
            ],
          ],
          [
            ['能，4 kg', 'Yes, 4 kg'],
            [
              '本数不能替代质量资料。',
              'Notebook count cannot replace mass information.',
            ],
          ],
        ],
        [
          [
            '先看问的是钱还是质量。',
            'Identify whether the unknown is money or mass.',
          ],
          ['题中没有提供质量关系。', 'No mass relationship is supplied.'],
        ],
        [
          [
            '不能编造质量；应指出缺少信息。',
            'Do not invent a mass; identify the missing information.',
          ],
        ],
      ),
      q(
        'B06-L04-Q2',
        [
          '地图印于 2018 年，办公室 9 点开门。买 2 张每张 NZ$6 的地图，总价多少 NZ$？',
          'Maps were printed in 2018 and the office opens at 9. Buy 2 maps at NZ$6 each. What total cost in NZ$?',
        ],
        12,
        R,
        [
          ['总价取决于数量和单价。', 'Cost depends on count and unit price.'],
          [
            '印刷年与开门时间不参与这次总价。',
            'Print year and opening time do not enter this cost.',
          ],
        ],
        [
          ['2×6=NZ$12。', '2×6=NZ$12.'],
          [
            '无需把 2018 或 9 与钱数合并。',
            'Do not combine 2018 or 9 with the money amount.',
          ],
        ],
        ['17', '21', '12 m'],
        'NZD',
      ),
      q(
        'B06-L04-Q3',
        [
          '铅笔每包 6 支，单价 NZ$3，买 4 包。问支数，一共几支？',
          'Pencils come in packs of 6 at NZ$3 per pack. Buy 4 packs. How many pencils?',
        ],
        24,
        R,
        [
          [
            '问支数，价格不是每包支数。',
            'The unknown is pencil count, not cost per pack.',
          ],
          ['包数×每包支数。', 'Packs × pencils per pack.'],
        ],
        [
          [
            '4×6=24 支；NZ$3 用于求价钱，不用于支数。',
            '4×6=24 pencils; NZ$3 determines cost, not pencil count.',
          ],
        ],
        ['12', '27', '10'],
        'pencils',
      ),
      q(
        'B06-L04-Q4',
        [
          '公园有 12 棵树。步道全长 18 m，已走 7 m，还剩多少 m？',
          'A park has 12 trees. Its track is 18 m long and 7 m have been walked. How many m remain?',
        ],
        11,
        R,
        [
          ['目标仍是剩余长度。', 'The goal remains track length left.'],
          [
            '18 与 7 参与长度关系，树数不参与。',
            '18 and 7 enter the length relationship; tree count does not.',
          ],
        ],
        [
          [
            '18−7=11 m；树数换了不改这个剩余量。',
            '18−7=11 m; changing tree count does not change this remainder.',
          ],
        ],
        ['23', '30', '11 people'],
        'm',
      ),
      q(
        'B06-L04-Q5',
        [
          '预算 NZ$50，买 3 本每本 NZ$8 的书。只问书的总价，多少 NZ$？',
          'Budget NZ$50; buy 3 books at NZ$8 each. Asking only for book cost, how many NZ$?',
        ],
        24,
        R,
        [
          ['这次不问余钱。', 'This question does not ask for money remaining.'],
          [
            '预算不改变三本书的总价。',
            'Budget does not change the cost of three books.',
          ],
        ],
        [
          [
            '3×8=NZ$24；50−24=26 回答另一个问题。',
            '3×8=NZ$24; 50−24=26 answers a different question.',
          ],
        ],
        ['26', '50', '11'],
        'NZD',
      ),
      r(
        'B06-L04-Q6',
        [
          '“预算 NZ$30，四本每本 NZ$5，另有铅笔价格”为什么能求笔记本余钱，却不能求笔记本总质量？区分不用的数据和缺少的数据。',
          'Why can a NZ$30 budget, four notebooks at NZ$5 each and extra pencil prices determine remaining money but not total notebook mass? Distinguish unused from missing data.',
        ],
        R,
        [
          '余钱需要预算、本数、单价，可算 30−4×5=NZ$10；未买铅笔价格是多余信息。质量需要每本质量或合计质量，目前缺少，不可把价格当质量。',
          'Remaining money uses budget, count and unit price: 30−4×5=NZ$10. Unbought pencil price is extra. Mass requires mass per notebook or total mass, which is missing; price is not mass.',
        ],
        [
          [
            '同一资料可能足够回答一个问题，不够回答另一个。',
            'The same facts can suffice for one question but not another.',
          ],
          ['给所求量写单位。', 'Name the unit of the requested quantity.'],
        ],
      ),
    ],
    exit: q(
      'B06-L04-X',
      [
        '假想活动早上 10 点开始。预算 NZ$40，买 2 张每张 NZ$9 的票，不买 NZ$4 的明信片。余钱多少 NZ$？',
        'An imaginary activity starts at 10. Budget NZ$40; buy 2 tickets at NZ$9 each and no NZ$4 postcards. How many NZ$ remain?',
      ],
      22,
      R,
      [
        ['只计实际买的票。', 'Count only tickets actually bought.'],
        [
          '40−2×9；时间和未买商品不进入费用。',
          '40−2×9; time and unbought goods do not enter the cost.',
        ],
      ],
      [['2×9=NZ$18，40−18=NZ$22。', '2×9=NZ$18; 40−18=NZ$22.']],
      ['18', '12', '22 m'],
      'NZD',
    ),
    exitReason: t(
      '指出用了哪些资料、不用哪些；若问题改成总质量，缺什么？',
      'State used and unused facts; if the question changed to total mass, what would be missing?',
    ),
    parent: {
      goal: t(
        '选择数据以问题为依据，也允许得出信息不足。',
        'Select data by the question and allow an insufficient-information conclusion.',
      ),
      misconception: t(
        '所有数字都要用，或无关数据与信息不足混为一谈。',
        'Using every number or confusing irrelevant data with insufficient information.',
      ),
      prompts: [
        t(
          '删掉这个数，答案还能确定吗？',
          'If this number were removed, could the answer still be determined?',
        ),
        t(
          '换个问题，哪些资料会变得有用？',
          'Which facts become relevant if the question changes?',
        ),
      ],
      bridge: 'B06-L01',
    },
  }),
  b06Lesson({
    id: 'B06-L05',
    title: t('用自己的话解释答案', 'Explaining an answer in your own words'),
    objective: t(
      '把数量关系、计算、单位与情境回答连起来，再用独立核查支持解释。',
      'Connect relationships, calculations, units and a contextual answer, supported by an independent check.',
    ),
    prerequisites: ['B06-L02', 'B06-L03', 'B06-L04'],
    keywords: [
      t('解释关系', 'explain the relationship'),
      t('情境回答', 'contextual answer'),
      t('反向核查', 'inverse check'),
    ],
    minutes: 17,
    lab: 'problem-explain',
    hook: t(
      '两份回答都写“17 张”，一份算式却是 5+4−3。相同最后数字，能证明两份解释都对吗？',
      'Two answers both say “17 cards”, but one expression is 5+4−3. Does the same final number prove both explanations are sound?',
    ),
    guided: q(
      'B06-L05-G',
      [
        '5 袋每袋 4 张卡，送出 3 张，剩几张？先用结果准备解释。',
        '5 bags hold 4 cards each; 3 are given away. How many remain? Find the result to prepare an explanation.',
      ],
      17,
      E,
      [
        [
          '用组数×每组张数求原有量。',
          'Use groups × cards per group for the original count.',
        ],
        [
          '扣去送出，再用加回核查。',
          'Subtract given cards, then check by adding back.',
        ],
      ],
      [
        ['5×4=20 张；20−3=17 张。', '5×4=20 cards; 20−3=17 cards.'],
        [
          '17+3=20，确认剩余与送出合成原有。',
          '17+3=20 confirms remaining plus given equals original.',
        ],
      ],
      ['6', '23', '20'],
    ),
    questions: [
      c(
        'B06-L05-Q1',
        [
          '哪种说明把四盒每盒五张、送两张后的剩余解释清楚？',
          'Which explanation justifies remaining cards from four boxes of five with two given away?',
        ],
        2,
        E,
        [
          [
            ['18。', '18.'],
            [
              '只有数，没有单位、关系与核查。',
              'Only a number; unit, relationship and check are missing.',
            ],
          ],
          [
            ['4+5−2=18 张。', '4+5−2=18 cards.'],
            [
              '组与每组应相乘；这条算式实际是 7。',
              'Groups and quantity per group multiply; this expression actually gives 7.',
            ],
          ],
          [
            [
              '4×5=20 张，20−2=18 张；18+2=20 核查。',
              '4×5=20 cards, 20−2=18 cards; check 18+2=20.',
            ],
            [
              '说明原有、剩余、单位与加回关系。',
              'Names original, remaining, units and an add-back relationship.',
            ],
          ],
        ],
        [
          [
            '先看算式是否记录情境。',
            'Check whether the expression records the story.',
          ],
          [
            '结果要有单位，并能核查原有量。',
            'The result needs a unit and a check against the original.',
          ],
        ],
        [
          [
            '关系与每步意义正确才支持最终数字。',
            'Correct relationships and step meanings support the final number.',
          ],
        ],
      ),
      q(
        'B06-L05-Q2',
        [
          '5 袋每袋 4 张、送出 3 张后剩 17 张。加回送出的三张，核查原有几张？',
          '5 bags of 4 cards leave 17 after 3 are given away. Add the 3 back: how many original cards does this check recover?',
        ],
        20,
        E,
        [
          [
            '核查应恢复原有量。',
            'The check should recover the original count.',
          ],
          ['17+3。', '17+3.'],
        ],
        [['17+3=20，与 5×4=20 相符。', '17+3=20 agrees with 5×4=20.']],
        ['14', '17', '23'],
      ),
      q(
        'B06-L05-Q3',
        [
          '4 盒每盒 5 张，送 2 张后剩几张？在解释里把这个数命名为剩余张数。',
          '4 boxes hold 5 cards each. How many remain after giving away 2? Name this result “remaining cards” in your explanation.',
        ],
        18,
        E,
        [
          ['先求原有二十张。', 'Find twenty original cards first.'],
          ['20−2，核查时加回二。', '20−2; add two back when checking.'],
        ],
        [
          ['4×5=20，20−2=18 张。', '4×5=20; 20−2=18 cards.'],
          [
            '18+2=20，回答的是剩余。',
            '18+2=20; the answer refers to remaining cards.',
          ],
        ],
        ['7', '22', '20'],
      ),
      q(
        'B06-L05-Q4',
        [
          '长方形 4 cm×3 cm，铺满 1 cm² 方格。解释中应写面积多少 cm²？',
          'A 4 cm by 3 cm rectangle is covered by 1 cm² squares. What area in cm² should an explanation state?',
        ],
        12,
        E,
        [
          [
            '数覆盖方格，不是围边界。',
            'Count covered squares rather than boundary length.',
          ],
          ['每行四格，共三行。', 'Four cells per row, three rows.'],
        ],
        [
          ['4×3=12 cm²。', '4×3=12 cm².'],
          [
            '四格+四格+四格=十二格；面积用平方单位。',
            'Four + four + four cells = twelve; area uses square units.',
          ],
        ],
        ['14', '7', '12 cm'],
        'cm²',
      ),
      q(
        'B06-L05-Q5',
        [
          '预算 NZ$20，买 3 本每本 NZ$4 的本子，剩多少 NZ$？核查时把总价加回。',
          'Budget NZ$20; buy 3 notebooks at NZ$4 each. How many NZ$ remain? Add total cost back when checking.',
        ],
        8,
        E,
        [
          ['三本总价为 3×4。', 'Three notebooks cost 3×4.'],
          [
            '余钱+总价应恢复预算。',
            'Remaining money + total cost should recover budget.',
          ],
        ],
        [
          ['3×4=NZ$12，20−12=NZ$8。', '3×4=NZ$12; 20−12=NZ$8.'],
          [
            '8+12=20，单位与预算情境一致。',
            '8+12=20, consistent with units and budget context.',
          ],
        ],
        ['12', '17', '8 m'],
        'NZD',
      ),
      r(
        'B06-L05-Q6',
        [
          '“5 袋每袋 4 张，送 3 张”的答案有人写 5+4−3=17 张。即使最后数字正确，理由有什么问题？用自己的话修好。',
          'Someone writes 5+4−3=17 cards for 5 bags of 4 cards with 3 given away. Even though the final number is correct, what is wrong with the reasoning? Repair it in your own words.',
        ],
        E,
        [
          '袋数与每袋张数应相乘；5+4−3 实际是 6，不能支持 17。说明原有 5×4=20 张，送三张后 20−3=17 张，再核查 17+3=20；接受合理的图或语言解释。',
          'Bags and cards per bag multiply; 5+4−3 actually equals 6 and does not support 17. Explain 5×4=20 original cards, then 20−3=17 remaining, checked by 17+3=20. Accept sound diagrams or verbal explanations.',
        ],
        [
          ['每个数的角色不同。', 'The numbers have different roles.'],
          [
            '理由要使关系与算式一致。',
            'Make the relationship and expression agree.',
          ],
        ],
      ),
    ],
    exit: q(
      'B06-L05-X',
      [
        '2 包每包 9 张卡，加上 5 张散卡，共几张？',
        '2 packs hold 9 cards each, with 5 loose cards. How many cards altogether?',
      ],
      23,
      E,
      [
        ['先求包中张数。', 'Find cards inside packs first.'],
        [
          '再加散卡，不是送出。',
          'Then add loose cards; these are not given away.',
        ],
      ],
      [
        ['2×9=18 张，18+5=23 张。', '2×9=18 cards; 18+5=23 cards.'],
        [
          '23−5=18，再 18÷2=9，恢复每包张数。',
          '23−5=18 and 18÷2=9 recover cards per pack.',
        ],
      ],
      ['16', '13', '18'],
    ),
    exitReason: t(
      '用自己的话说明关系、每步数量、单位与核查；不要只复制算式。',
      'Explain relationships, quantities at each step, units and verification in your own words rather than copy an expression.',
    ),
    parent: {
      goal: t(
        '按理由与情境评分，不按固定关键词或句子。',
        'Assess reasoning in context rather than fixed keywords or sentences.',
      ),
      misconception: t(
        '最后数字正确就忽略无效算式，或把抄解析当独立解释。',
        'Ignoring invalid reasoning when the final number is correct, or treating copied solutions as independent explanation.',
      ),
      prompts: [
        t(
          '这个数回答了原问题的哪句话？',
          'Which part of the original question does this number answer?',
        ),
        t(
          '你能不用重复原算式的方式核查吗？',
          'Can you check without merely repeating the original calculation?',
        ),
      ],
      bridge: 'B06-L03',
    },
    familyChallenge: t(
      '假想卡片小铺：预算 NZ$40，四包每包六张、每包 NZ$5，另有 NZ$3 的笔但不买。列必要信息、画图，求买后余钱与送三张后的剩余卡。用自己的话解释并加回核查；若问卡片总质量，指出缺质量资料。用纸卡完成，无实际购买、计时或得分。',
      'Imaginary card shop: budget NZ$40, four packs of six cards at NZ$5 per pack, plus NZ$3 pens that are not bought. Select facts, draw a model, find money remaining and cards left after giving three away. Explain and check by adding back. If total card mass is requested, identify missing mass data. Use paper cards; no real purchase, timer or score.',
    ),
  }),
];
export const b06CheckQuestions: Question[] = [
  q(
    'B06-CHECK-Q1',
    [
      '全长 26 m，已走 9 m，剩余多少 m？',
      'A track is 26 m long with 9 m walked. How many m remain?',
    ],
    17,
    K,
    [
      ['问剩余长度。', 'Find remaining length.'],
      ['已走+剩余=26。', 'Walked + remaining = 26.'],
    ],
    [['26−9=17 m，9+17=26。', '26−9=17 m; 9+17=26.']],
    ['35', '26', '17 cm'],
    'm',
  ),
  q(
    'B06-CHECK-Q2',
    [
      '条形整体为 24 cm，一部分 8 cm，另一部分多少 cm？',
      'A bar-model whole is 24 cm and one part 8 cm. How many cm is the other part?',
    ],
    16,
    B,
    [
      ['问号是另一部分。', 'The unknown is the other part.'],
      ['整体减八。', 'Subtract eight from the whole.'],
    ],
    [['24−8=16 cm，8+16=24。', '24−8=16 cm; 8+16=24.']],
    ['32', '8', '16 cm²'],
    'cm',
    diagram('parts', 8, 16, 'component', ['厘米', 'centimetres']),
  ),
  q(
    'B06-CHECK-Q3',
    [
      '对齐比较 21 张卡与 13 张，相差几张？',
      'Aligned bars compare 21 cards and 13 cards. What is the difference?',
    ],
    8,
    B,
    [
      ['比较差距，不合计。', 'Find the gap, not a total.'],
      ['较大量减较小量。', 'Subtract smaller from larger.'],
    ],
    [['21−13=8 张；13+8=21。', '21−13=8 cards; 13+8=21.']],
    ['34', '13', '8%'],
    undefined,
    diagram('comparison', 21, 13, 'result', ['张卡', 'cards']),
  ),
  q(
    'B06-CHECK-Q4',
    [
      '5 包每包 6 张，送 4 张后剩几张？',
      '5 packs of 6 cards: how many remain after giving away 4?',
    ],
    26,
    S,
    [
      ['先求全部三十张。', 'First find thirty original cards.'],
      [
        '总共送四张，不是每包四张。',
        'Four are given in total, not from every pack.',
      ],
    ],
    [['5×6=30 张，30−4=26 张。', '5×6=30 cards; 30−4=26 cards.']],
    ['7', '10', '34'],
  ),
  c(
    'B06-CHECK-Q5',
    [
      '预算 NZ$40，买 3 本每本 NZ$7 的书，柜台高 1 m。求余钱时哪项不用？',
      'Budget NZ$40; buy 3 books at NZ$7 each; the counter is 1 m high. Which fact is unused when finding money remaining?',
    ],
    0,
    R,
    [
      [
        ['柜台高度', 'Counter height'],
        [
          '高度不参与费用关系。',
          'Height does not enter the cost relationship.',
        ],
      ],
      [
        ['每本 NZ$7', 'NZ$7 per book'],
        [
          '它和本数决定总价，需要保留。',
          'It determines cost with book count and is needed.',
        ],
      ],
      [
        ['预算 NZ$40', 'Budget NZ$40'],
        ['余钱需要预算，不能删掉。', 'Remaining money requires the budget.'],
      ],
    ],
    [
      ['先看目标量的单位。', 'Identify the requested unit.'],
      ['余钱=预算−总价。', 'Remaining money = budget−total cost.'],
    ],
    [
      [
        '用预算、本数、单价，不用柜台高。',
        'Use budget, count and unit price, not counter height.',
      ],
    ],
  ),
  q(
    'B06-CHECK-Q6',
    [
      '3 本每本 NZ$7 的书，第一步总价多少 NZ$？',
      '3 books cost NZ$7 each. What total cost in NZ$ does step one produce?',
    ],
    21,
    S,
    [
      ['本数×单价。', 'Count × unit price.'],
      ['第一步输出是钱数。', 'Step one produces a money amount.'],
    ],
    [['3×7=NZ$21。', '3×7=NZ$21.']],
    ['10', '7', '21 m'],
    'NZD',
  ),
  q(
    'B06-CHECK-Q7',
    [
      '预算 NZ$40，已知总价 NZ$21，余钱多少 NZ$？',
      'Budget NZ$40, known total cost NZ$21. How many NZ$ remain?',
    ],
    19,
    E,
    [
      ['结果需要回答剩余钱数。', 'The result must answer remaining money.'],
      ['加回总价应恢复四十。', 'Adding cost back should recover forty.'],
    ],
    [['40−21=NZ$19；19+21=40 核查。', '40−21=NZ$19; 19+21=40 checks it.']],
    ['61', '21', '19 cm'],
    'NZD',
  ),
  r(
    'B06-CHECK-Q8',
    [
      '两人分别要 3 张票与 2 张票，预算 NZ$20，却没给每张票价。有人说“5 张票，所以余 NZ$15”。解释能确定什么、不能确定什么。',
      'Two people need 3 and 2 tickets with budget NZ$20, but no ticket price is given. Someone says “5 tickets, so NZ$15 remains.” Explain what can and cannot be determined.',
    ],
    R,
    [
      '能确定共需 3+2=5 张票；缺每张票价或总价，无法求余钱，也无法确认预算是否够。不能把五张当五元；给出所缺资料，不猜单价。',
      '3+2=5 tickets are needed. Without unit price or total cost, remaining money and budget sufficiency cannot be determined. Five tickets are not five dollars. Identify missing data without assuming a price.',
    ],
    [
      ['张数与钱数单位不同。', 'Ticket count and money have different units.'],
      ['总价需要怎样的信息？', 'What information determines total cost?'],
    ],
  ),
];
export function b06ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0)
    throw new RangeError('Use a nonnegative whole review round');
  const k = round % 80,
    suffix = `${id}-R${round}`;
  if (id === 'B06-L01') {
    const whole = 20 + (k % 20),
      part = 3 + (k % 12),
      askKnown = k % 3 === 0,
      askRemaining = k % 3 === 1,
      value = askKnown ? whole : askRemaining ? whole - part : part;
    return q(
      suffix,
      [
        `全长 ${whole} m，已走 ${part} m，路边 ${2 + (k % 9)} 只鸟。${askKnown ? '只读给出的全长是多少 m？' : askRemaining ? '还剩多少 m？' : '题目已经给出的已走长度是多少 m？'}`,
        `Full track ${whole} m, walked ${part} m, with ${2 + (k % 9)} roadside birds. ${askKnown ? 'Read only the given full length in m.' : askRemaining ? 'How many m remain?' : 'Read only the given walked length in m.'}`,
      ],
      value,
      K,
      [
        [
          '先识别这次问的是哪一个量。',
          'Identify which quantity is asked this time.',
        ],
        [
          '全长、已走与剩余同用米；鸟数不用。',
          'Full, walked and remaining use metres; birds are unused.',
        ],
      ],
      [
        askKnown
          ? [
              `给出的全长为 ${whole} m，不需计算。`,
              `The full length is given as ${whole} m; no calculation needed.`,
            ]
          : askRemaining
            ? [
                `${whole}−${part}=${value} m，${part}+${value}=${whole} 核查。`,
                `${whole}−${part}=${value} m, checked by ${part}+${value}=${whole}.`,
              ]
            : [
                `已走长度给出为 ${part} m。`,
                `Walked length is given as ${part} m.`,
              ],
      ],
      [String(value + 1), `${value} people`],
      'm',
    );
  }
  if (id === 'B06-L02') {
    const a = 4 + (k % 10),
      b = 2 + (k % 8);
    if (k % 3 === 0)
      return q(
        suffix,
        [
          `整体 ${a + b} cm，第一部分 ${a} cm。另一部分多少 cm？`,
          `Whole ${a + b} cm, first part ${a} cm. How many cm is the other part?`,
        ],
        b,
        B,
        [
          ['未知是部分。', 'The unknown is a part.'],
          ['整体减已知部分。', 'Whole minus known part.'],
        ],
        [
          [
            `${a + b}−${a}=${b} cm；${a}+${b}=${a + b}。`,
            `${a + b}−${a}=${b} cm; ${a}+${b}=${a + b}.`,
          ],
        ],
        [String(a + 2 * b), `${b} cm²`],
        'cm',
        diagram('parts', a, b, 'component', ['厘米', 'centimetres']),
      );
    if (k % 3 === 1)
      return q(
        suffix,
        [
          `两条纸带分别 ${a + b} cm 与 ${a} cm，相差多少 cm？`,
          `Two strips are ${a + b} cm and ${a} cm. What difference in cm?`,
        ],
        b,
        B,
        [
          ['对齐起点比较。', 'Align the starts.'],
          ['差距=较大−较小。', 'Gap = larger−smaller.'],
        ],
        [[`${a + b}−${a}=${b} cm。`, `${a + b}−${a}=${b} cm.`]],
        [String(2 * a + b), `${b} m`],
        'cm',
        diagram('comparison', a + b, a, 'result', ['厘米', 'centimetres']),
      );
    const groups = 2 + (k % 5);
    return q(
      suffix,
      [
        `${groups} 袋每袋 ${b} 张卡，共几张？`,
        `${groups} bags hold ${b} cards each. How many cards altogether?`,
      ],
      groups * b,
      B,
      [
        ['用相等组表示。', 'Represent equal groups.'],
        ['袋数×每袋张数。', 'Bags × cards per bag.'],
      ],
      [
        [
          `${groups}×${b}=${groups * b} 张。`,
          `${groups}×${b}=${groups * b} cards.`,
        ],
      ],
      [String(groups + b), String(groups * b + 1)],
      undefined,
      diagram('groups', groups, b, 'result', ['张卡', 'cards']),
    );
  }
  if (id === 'B06-L03') {
    const a = 2 + (k % 5),
      b = 3 + (Math.floor(k / 4) % 7),
      c = 1 + (k % 4),
      value = k % 2 ? (a + c) * b : a * b - c;
    return q(
      suffix,
      k % 2
        ? [
            `${a} 人与 ${c} 人合组，每人 ${b} 张卡，共需几张？`,
            `${a} and ${c} people join, each needing ${b} cards. How many cards?`,
          ]
        : [
            `${a} 盒每盒 ${b} 张卡，总共送 ${c} 张后剩几张？`,
            `${a} boxes of ${b} cards, with ${c} given away in total. How many remain?`,
          ],
      value,
      S,
      [
        ['先命名第一步中间量。', 'Name the intermediate quantity first.'],
        k % 2
          ? [
              '先合并人数再乘每人张数。',
              'Combine people first, then multiply by cards per person.',
            ]
          : [
              '先求原有张数再减送出。',
              'Find original cards, then subtract given cards.',
            ],
      ],
      [
        k % 2
          ? [
              `${a}+${c}=${a + c} 人，${a + c}×${b}=${value} 张。`,
              `${a}+${c}=${a + c} people; ${a + c}×${b}=${value} cards.`,
            ]
          : [
              `${a}×${b}=${a * b} 张，${a * b}−${c}=${value} 张。`,
              `${a}×${b}=${a * b} cards; ${a * b}−${c}=${value} cards.`,
            ],
      ],
      [String(value + 1), String(k % 2 ? a + c * b : a * (b - c))],
    );
  }
  if (id === 'B06-L04') {
    const count = 2 + (k % 4),
      price = 3 + (Math.floor(k / 4) % 6),
      cost = count * price,
      budget = cost + 5 + (k % 13),
      askCost = k % 2 === 0,
      value = askCost ? cost : budget - cost;
    return q(
      suffix,
      [
        `预算 NZ$${budget}，买 ${count} 本每本 NZ$${price} 的本子，不买 NZ$${2 + (k % 5)} 的笔。${askCost ? '只问本子总价' : '问余钱'}，多少 NZ$？`,
        `Budget NZ$${budget}; buy ${count} notebooks at NZ$${price} each, with NZ$${2 + (k % 5)} pens not bought. ${askCost ? 'Find only notebook cost' : 'Find remaining money'} in NZ$.`,
      ],
      value,
      R,
      [
        ['先看问的是总价还是余钱。', 'Identify cost versus remaining money.'],
        ['未买的商品价格不用。', 'Unbought goods’ prices are unused.'],
      ],
      [
        askCost
          ? [
              `${count}×${price}=NZ$${cost}，预算不用。`,
              `${count}×${price}=NZ$${cost}; budget is unused.`,
            ]
          : [
              `${count}×${price}=NZ$${cost}，${budget}−${cost}=NZ$${value}。`,
              `${count}×${price}=NZ$${cost}; ${budget}−${cost}=NZ$${value}.`,
            ],
      ],
      [String(value + 1), `${value} m`],
      'NZD',
    );
  }
  if (id === 'B06-L05') {
    const groups = 2 + (k % 5),
      each = 3 + (Math.floor(k / 5) % 7),
      removed = 1 + (k % 4),
      total = groups * each,
      remaining = total - removed,
      askOriginal = k % 2 === 1,
      value = askOriginal ? total : remaining;
    return q(
      suffix,
      askOriginal
        ? [
            `剩 ${remaining} 张，已送 ${removed} 张。加回核查原有几张，是否符合 ${groups} 袋每袋 ${each} 张？先写原有张数。`,
            `${remaining} remain and ${removed} were given away. Add back to check the original count against ${groups} bags of ${each}. Write the original count.`,
          ]
        : [
            `${groups} 袋每袋 ${each} 张，送 ${removed} 张后剩几张？准备说明并加回核查。`,
            `${groups} bags of ${each} cards, with ${removed} given away. How many remain? Prepare an explanation and an add-back check.`,
          ],
      value,
      E,
      [
        [
          '核查要恢复情境里的量。',
          'Verification should recover a quantity in the story.',
        ],
        ['剩余+送出=原有。', 'Remaining + given = original.'],
      ],
      [
        [
          `原有 ${groups}×${each}=${total}，剩余 ${total}−${removed}=${remaining}；${remaining}+${removed}=${total} 核查。`,
          `Original ${groups}×${each}=${total}; remaining ${total}−${removed}=${remaining}; check ${remaining}+${removed}=${total}.`,
        ],
      ],
      [String(value + 1), String(value + 2)],
    );
  }
  throw new Error(`Unknown B06 lesson ${id}`);
}
