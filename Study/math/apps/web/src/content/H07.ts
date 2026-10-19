import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
import {
  sequenceAt,
  arithmeticTerm,
  arithmeticSum,
  geometricTerm,
  geometricSum,
  geometricDefinition,
  adjacentRatio,
  savingsLedger,
  type SequenceCode,
  type SavingsConfig,
} from '../sequenceModels';
import { readRational } from '../rationalModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: 'NZD',
) => I(stem, { kind: 'number', value, unit }, step, wrong);
const C = (stem: Pair, value: SequenceCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'sequence-code', value }, step, wrong);
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  skill: string;
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['序列、递推与通项', 'Sequences, recurrence and nth term'],
    objective: [
      '区分序号、项值与规则，用完整规则求项而不把有限观测当唯一通项。',
      'Separate indices, terms and rules, using a complete rule without treating a finite prefix as a unique formula.',
    ],
    hook: [
      '只看到2、4、6，下一项一定是8吗？如果规则是另一个多项式，会发生什么？',
      'After observing 2,4,6, must the next term be 8? What if a different polynomial rule fits all three observations?',
    ],
    prerequisites: ['H02-L01', 'H03-L01', 'P55-L05'],
    keywords: [
      ['序号', 'index'],
      ['递推', 'recurrence'],
      ['通项', 'nth term'],
    ],
    lab: 'sequence-rules',
    skill: 'sequence-index-rule-evidence',
    hints: [
      [
        '本题数列从n=1开始，a₁是第一项；递推还要给首项，通项须说明定义域。',
        'These sequences start at n=1. A recurrence needs its initial term and an nth-term rule needs its domain.',
      ],
      [
        '完整规则可代入或逐步计算；若只给有限观测，检验多个延伸，不自动补出唯一规则。',
        'Substitute into a complete rule or iterate it. With only finite observations, test different extensions instead of inventing a unique rule.',
      ],
    ],
    items: [
      N(
        [
          '给定a₁=2、aₙ₊₁=aₙ+2（n为正整数），求a₄。',
          'Given a₁=2 and aₙ₊₁=aₙ+2 for positive integer n, find a₄.',
        ],
        '8',
        [
          '从第一项到第四项走3步：2→4→6→8，不能多加一步。',
          'Three transitions take term one to term four:2→4→6→8. Do not add a fourth transition.',
        ],
        ['10', '6'],
      ),
      C(
        [
          '数列明确只在正整数n上定义。要求a₀时，应写outside-domain还是直接代公式？',
          'A sequence is explicitly defined only for positive integer n. For a₀, use outside-domain or substitute automatically?',
        ],
        'outside-domain',
        [
          '0不在本题的序号域；公式能算出一个数不自动扩展原定义域。',
          'Zero is outside the stated index domain. A numerical expression does not automatically extend that domain.',
        ],
        ['0', 'insufficient'],
      ),
      C(
        [
          '只观测a₁=2、a₂=4、a₃=6，没有给后续规则。a₄能唯一确定吗？用insufficient表示条件不足。',
          'Only a₁=2,a₂=4,a₃=6 are observed, with no continuation rule. Is a₄ uniquely determined? Use insufficient when not.',
        ],
        'insufficient',
        [
          '2n和2n+(n−1)(n−2)(n−3)都符合前三项，但第四项分别8与14。',
          'Both 2n and 2n+(n−1)(n−2)(n−3) fit the prefix, but give fourth terms 8 and 14.',
        ],
        ['8', '14'],
      ),
      N(
        [
          '给定aₙ=n²+1，n为正整数，求a₅。',
          'Given aₙ=n²+1 for positive integer n, find a₅.',
        ],
        '26',
        [
          '序号5代入n，不把项值5再代进去：5²+1=26。',
          'Substitute index five for n:5²+1=26. Do not confuse index with term value.',
        ],
        ['10', '25'],
      ),
      I(
        [
          '给定a₁=2、aₙ₊₁=aₙ+2（所有正整数n），用n写通项。',
          'Given a₁=2 and aₙ₊₁=aₙ+2 for every positive integer n, express the nth term using n.',
        ],
        { kind: 'polynomial', value: '2n', variables: ['n'] },
        [
          'aₙ=2+2(n−1)=2n；它来自完整递推，不只是看三项猜出来。',
          'aₙ=2+2(n−1)=2n, derived from the complete recurrence rather than guessing from three terms.',
        ],
        ['2n+2', 'n+2'],
      ),
      E(
        [
          '给定a₁=1、aₙ₊₁=aₙ+2n+1（正整数n）。说明为什么通项aₙ=n²适合完整规则，而不只是前四项碰巧相同。',
          'Given a₁=1 and aₙ₊₁=aₙ+2n+1 for positive integer n, explain why aₙ=n² fits the complete rule rather than just four sample terms.',
        ],
        [
          '首项1=1²；对任意正整数n，(n+1)²−n²=2n+1，正好是递推增量。由同首项、同一步规则可逐项确定所有后续项；只验1、4、9、16本身不能替代一般关系。',
          'The initial term is 1². For every positive integer n, (n+1)²−n²=2n+1 matches the recurrence increment. The same initial term and step rule determine each later term; merely checking 1,4,9,16 does not supply the general argument.',
        ],
      ),
    ],
    pick: {
      stem: [
        '只给有限前三项，什么能支持唯一求出后续项？',
        'What additional information can justify a unique continuation from three observed terms?',
      ],
      options: [
        ['图看起来平滑', 'A smooth-looking graph'],
        ['先选自己最喜欢的规律', 'Choosing a favourite pattern'],
        [
          '给出完整规则及必要初始条件',
          'A complete rule with required initial conditions',
        ],
      ],
      feedback: [
        [
          '数列只在整数序号取值，图形外观不指定全部规则。',
          'Discrete observations and graphical appearance do not specify a complete rule.',
        ],
        [
          '多个规律可能都符合有限数据，偏好不是数学条件。',
          'Different rules can fit the same finite data; preference is not a mathematical condition.',
        ],
        [
          '正确；先明确规则、初值和序号域，再计算。',
          'Correct: specify the rule, initial conditions and index domain before calculating.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '用两个不同完整公式说明，前三项2、4、6不足以唯一决定第四项。',
      'Give two complete formulas showing why prefix 2,4,6 does not determine the fourth term uniquely.',
    ],
    rubric: [
      '取aₙ=2n与bₙ=2n+(n−1)(n−2)(n−3)，n为正整数。n=1、2、3时附加乘积为0；n=4时为6，故a₄=8、b₄=14。不是说8错，而是原条件不足以唯一选8。',
      'Take aₙ=2n and bₙ=2n+(n−1)(n−2)(n−3) on positive integers. The added product vanishes at 1,2,3 but equals six at 4, giving 8 versus 14. Eight is a possible continuation; it is not uniquely forced by the given evidence.',
    ],
    prompts: [
      [
        'a₄的4是序号还是项值？从a₁走了几步？',
        'Is the 4 in a₄ an index or a value, and how many steps from a₁?',
      ],
      [
        '你在使用明确规则，还是仅描述观测到的几项？',
        'Are you using a complete rule or only describing a few observations?',
      ],
    ],
    misconception: [
      '混淆n与aₙ、多走一步、漏首项或把有限样本当唯一规律。',
      'Confusing n with aₙ, taking one extra step, omitting the initial term or treating a finite prefix as a unique rule.',
    ],
  },
  {
    title: ['等差数列', 'Arithmetic sequences'],
    objective: [
      '以固定差值和序号间隔恢复等差数列并求第n项。',
      'Recover an arithmetic sequence from constant differences and index gaps, then find its nth term.',
    ],
    hook: [
      '已知等差数列a₂=8、a₅=17，公差是9、3，还是别的数？两个序号之间有几步？',
      'In an arithmetic sequence with a₂=8 and a₅=17, is the common difference 9,3 or something else? How many transitions separate the indices?',
    ],
    prerequisites: ['H07-L01', 'J73-L01'],
    keywords: [
      ['公差', 'common difference'],
      ['项间隔', 'index gap'],
      ['等差通项', 'arithmetic nth term'],
    ],
    lab: 'sequence-arithmetic',
    skill: 'arithmetic-index-gaps',
    hints: [
      [
        '等差指所有相邻项都满足aₙ₊₁−aₙ=d，d可正、负、零或分数。',
        'Arithmetic means every adjacent difference is d, which may be positive, negative, zero or fractional.',
      ],
      [
        'aₙ=a₁+(n−1)d；两个不同序号p、r之间有r−p个增量，不是r−p+1个。',
        'Use aₙ=a₁+(n−1)d. Distinct indices p,r are r−p transitions apart, not r−p+1.',
      ],
    ],
    items: [
      N(
        [
          '已知等差数列a₁=5、公差d=3，求a₆。',
          'An arithmetic sequence has a₁=5 and d=3. Find a₆.',
        ],
        '20',
        [
          'a₆=5+(6−1)×3=20，从第一项走5次增量。',
          'a₆=5+(6−1)×3=20, using five transitions from the first term.',
        ],
        ['23', '18'],
      ),
      N(
        [
          '已知完整数列为等差数列，a₂=8、a₅=17，求d。',
          'The complete sequence is known to be arithmetic, with a₂=8 and a₅=17. Find d.',
        ],
        '3',
        ['a₅−a₂=(5−2)d=9，所以d=3。', 'a₅−a₂=(5−2)d=9, hence d=3.'],
        ['9', '9/4'],
      ),
      N(
        [
          '已知等差数列a₂=8、a₅=17，求a₁。',
          'For an arithmetic sequence with a₂=8,a₅=17, find a₁.',
        ],
        '5',
        [
          '先得d=3，a₂只比a₁多一步，a₁=8−3=5。',
          'First d=3; a₂ is one step beyond a₁, so a₁=8−3=5.',
        ],
        ['8', '2'],
      ),
      N(
        [
          '等差数列a₁=6、d=−2，求a₅。',
          'For a₁=6,d=−2 in an arithmetic sequence, find a₅.',
        ],
        '-2',
        [
          'a₅=6+4×(−2)=−2，公差为负可以跨过0。',
          'a₅=6+4×(−2)=−2; a negative difference can cross zero.',
        ],
        ['2', '-4'],
      ),
      N(
        [
          '等差数列a₁=−3、d=0，求a₈。',
          'For an arithmetic sequence a₁=−3,d=0, find a₈.',
        ],
        '-3',
        [
          '每一步加0，所有项都是−3；公差0不等于项值0。',
          'Adding zero preserves every term at−3; zero difference does not mean zero term values.',
        ],
        ['0', '-24'],
      ),
      E(
        [
          '已知完整数列等差，a₄=11、a₉=26。求d、a₁和a₁₂，并说明为何序号差是5步。',
          'A complete arithmetic sequence has a₄=11,a₉=26. Find d,a₁,a₁₂ and explain the five-step index gap.',
        ],
        [
          '从第4到第9项有9−4=5个增量，d=(26−11)/5=3；a₁=11−3d=2；a₁₂=2+11×3=35。包含第4、第9两项共6个位置，不等于6次转移。',
          'There are 9−4=5 increments, so d=(26−11)/5=3. Then a₁=11−3d=2 and a₁₂=2+11×3=35. Six included positions do not mean six transitions.',
        ],
      ),
    ],
    pick: {
      stem: [
        '通项aₙ=a₁+(n−1)d中的n−1为什么不是n？',
        'Why is the multiplier n−1 rather than n in aₙ=a₁+(n−1)d?',
      ],
      options: [
        [
          'a₁已经是第1项，还没走任何增量',
          'a₁ is already term one, before any transitions',
        ],
        ['只是为了避免出现负数', 'It merely avoids negative numbers'],
        ['因为d必须为正数', 'Because d must be positive'],
      ],
      feedback: [
        ['正确；代n=1应还原a₁。', 'Correct: substituting n=1 must recover a₁.'],
        [
          '等差项和公差都可以为负，不能靠避负数解释。',
          'Terms and differences may be negative; avoiding them is not the reason.',
        ],
        [
          '公差可正、负、零或分数。',
          'A common difference may be positive, negative, zero or fractional.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '把a₃=7写了两遍，能唯一恢复等差公差d吗？给两个不同等差数列。',
      'Does repeating a₃=7 twice uniquely recover d? Give two different arithmetic sequences.',
    ],
    rubric: [
      '不能。aₙ=7有d=0，bₙ=n+4有d=1，两者第3项都7。重复同一个条件没有提供新序号间隔，不能计算0/0或据此假定d=0。',
      'No. aₙ=7 has d=0, while bₙ=n+4 has d=1, and both have third term seven. Repeating one condition supplies no new index gap; do not calculate 0/0 or assume zero difference.',
    ],
    prompts: [
      [
        '两个序号之间有几个位置、几次转移？',
        'How many positions and how many transitions lie between the indices?',
      ],
      [
        'd=0时保持不变的是项值，还是序号？',
        'When d=0, is it the value or the index that stays fixed?',
      ],
    ],
    misconception: [
      '把项数当步数、默认公差正数、重复条件除0，或把公差0当所有项0。',
      'Counting positions as transitions, assuming a positive difference, dividing by zero on repeated indices, or confusing zero difference with zero terms.',
    ],
  },
  {
    title: ['等差数列求和', 'Sums of arithmetic series'],
    objective: [
      '用正序与倒序的两份和推导有限等差和，并区分末项、和与平均数。',
      'Derive a finite arithmetic sum using two reversed copies, separating the last term, sum and mean.',
    ],
    hook: [
      '2、5、8、11、14共有5项，中间8没有伙伴，倒序配对公式还成立吗？',
      'For the five terms 2,5,8,11,14, does reverse pairing still work when the middle eight seems unpaired?',
    ],
    prerequisites: ['H07-L02', 'J72-L03'],
    keywords: [
      ['部分和', 'partial sum'],
      ['倒序配对', 'reverse pairing'],
      ['两份和', 'two copies'],
    ],
    lab: 'sequence-arithmetic-sum',
    skill: 'arithmetic-sum-two-copies',
    hints: [
      [
        '先求末项aₙ=a₁+(n−1)d，再区分aₙ与Sₙ=a₁+…+aₙ。',
        'Find aₙ=a₁+(n−1)d first, then distinguish it from Sₙ=a₁+…+aₙ.',
      ],
      [
        '将完整一份倒序，与另一完整一份逐列相加：2Sₙ=n(a₁+aₙ)，最后整体除2。',
        'Reverse one complete copy and add it columnwise to another:2Sₙ=n(a₁+aₙ), then halve the total.',
      ],
    ],
    items: [
      N(
        [
          '等差数列a₁=2、d=3，求前5项和S₅。',
          'For arithmetic a₁=2,d=3, find S₅.',
        ],
        '40',
        [
          'a₅=14；2S₅=5(2+14)=80，所以S₅=40。',
          'a₅=14;2S₅=5(2+14)=80, so S₅=40.',
        ],
        ['14', '80'],
      ),
      N(
        [
          '同样a₁=2、d=3，求a₅，而不是S₅。',
          'For a₁=2,d=3, find a₅ rather than S₅.',
        ],
        '14',
        [
          'a₅=2+4×3=14，末项与前5项和40不同。',
          'a₅=2+4×3=14, distinct from the five-term sum forty.',
        ],
        ['40', '17'],
      ),
      N(
        [
          '把2、5、8、11、14和其完整倒序排成两行。每一列相加是多少？',
          'Place 2,5,8,11,14 above its complete reverse. What is each column total?',
        ],
        '16',
        [
          '2+14=5+11=8+8=16，每列来自两份数列。',
          '2+14=5+11=8+8=16; each column takes one term from each copy.',
        ],
        ['8', '40'],
      ),
      N(
        [
          '上述两行各有5项，每列和16。两份和2S₅是多少？',
          'Each of those two rows has five terms and every column totals 16. Find 2S₅.',
        ],
        '80',
        [
          '共5列，每列16，合计80；这是两份和，不是一份。',
          'Five columns of sixteen total eighty, representing two copies of the sum.',
        ],
        ['40', '16'],
      ),
      N(
        [
          '等差数列5、3、1、−1、−3、−5，求前6项和。',
          'Find the sum of the six arithmetic terms 5,3,1,−1,−3,−5.',
        ],
        '0',
        [
          '6(5+(−5))/2=0，正负项抵消；绝对值和18是另一个量。',
          '6(5+(−5))/2=0; signed terms cancel. The absolute-value total eighteen is a different quantity.',
        ],
        ['18', '6'],
      ),
      E(
        [
          '用两份完整数列解释2、5、8、11、14的和。为什么不需要先删除中间8或把它单独减半？',
          'Use two complete copies to sum 2,5,8,11,14. Why is there no need to remove the middle eight or halve it separately?',
        ],
        [
          '一行正序、一行倒序，五列分别(2+14)、(5+11)、(8+8)、(11+5)、(14+2)，各16。两行就是2S₅=80，所以一份40；中间8在两份中各出现一次，整体除2已恢复一份。',
          'Forward and reversed copies give five columns:(2+14),(5+11),(8+8),(11+5),(14+2), each sixteen. Thus 2S₅=80 and one sum is forty. The middle eight appears once in each complete copy; halving the overall total already restores one copy.',
        ],
      ),
    ],
    pick: {
      stem: [
        '倒序配对解释中，为什么奇数项数也可用n(a₁+aₙ)/2？',
        'Why does n(a₁+aₙ)/2 also work for an odd number of terms?',
      ],
      options: [
        ['奇数n可以直接四舍五入成偶数', 'Round odd n to an even number'],
        [
          '使用两份完整数列，中间项也有另一份的伙伴',
          'Two complete copies give the middle term a partner in the other copy',
        ],
        ['必须先去掉中间项才可用公式', 'The middle term must first be removed'],
      ],
      feedback: [
        [
          '改项数就改变了原问题。',
          'Changing the term count changes the problem.',
        ],
        [
          '正确；整体两份和最后除2，不对中间项另做调整。',
          'Correct: halve the combined total without separately adjusting the middle term.',
        ],
        [
          '两份完整数列中，中间项已按同一规则配对。',
          'In two full copies the middle term is paired by the same rule.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '对于部分和Sₙ，如何恢复aₙ？用S₅=40、S₄=26说明，且交代n=1的边界。',
      'How does a partial-sum sequence recover aₙ? Use S₅=40,S₄=26 and state the n=1 boundary.',
    ],
    rubric: [
      'aₙ=Sₙ−Sₙ₋₁，因前n−1项抵消，故a₅=40−26=14；Sₙ/n是平均数而非一般末项。定义空和S₀=0后，a₁=S₁−S₀=S₁，边界一致。',
      'aₙ=Sₙ−Sₙ₋₁ because the first n−1 terms cancel, giving a₅=40−26=14. Sₙ/n is a mean, not generally the last term. With empty sum S₀=0, a₁=S₁−S₀=S₁ as required.',
    ],
    prompts: [
      [
        '每一行是一份完整数列，还是半份？',
        'Is each row a whole copy or half a copy?',
      ],
      [
        '你算的是末项、前n项和，还是平均数？',
        'Are you finding the last term, a partial sum or a mean?',
      ],
    ],
    misconception: [
      '把aₙ当Sₙ、奇数中间项重复处理、忽略负号，或把平均数当末项。',
      'Confusing aₙ and Sₙ, adjusting the odd middle term twice, dropping signs or treating a mean as the last term.',
    ],
  },
  {
    title: ['等比数列', 'Geometric sequences'],
    objective: [
      '用固定非零比值理解等比数列，区分倍率符号、幅度与零递推。',
      'Understand geometric sequences through a fixed nonzero ratio, separating sign, magnitude and zero recurrences.',
    ],
    hook: [
      '首项3、每次乘−2，得到3、−6、12、−24。它在“越来越大”吗？',
      'Starting at 3 and multiplying by−2 gives 3,−6,12,−24. Is the sequence simply “getting larger”?',
    ],
    prerequisites: ['H07-L01', 'H03-L01', 'H03-L02'],
    keywords: [
      ['公比', 'common ratio'],
      ['指数偏移', 'exponent offset'],
      ['非零条件', 'nonzero condition'],
    ],
    lab: 'sequence-geometric',
    skill: 'geometric-ratio-sign-zero',
    hints: [
      [
        '本单元等比定义为各项非零、相邻比值aₙ₊₁/aₙ=q固定且非零。零倍递推可算，不等于满足该定义。',
        'This unit defines geometric sequences by nonzero terms and one fixed nonzero adjacent ratio q. A zero multiplier recurrence can be computed without meeting that definition.',
      ],
      [
        'aₙ=a₁qⁿ⁻¹，从第一项乘n−1次；负q交替变号，幅度由|q|控制，项值还受首项符号影响。',
        'Use aₙ=a₁q^(n−1), with n−1 multiplications. Negative q alternates signs; |q| controls magnitude and the initial sign also affects values.',
      ],
    ],
    items: [
      N(
        ['乘法递推a₁=3、aₙ₊₁=−2aₙ，求a₄。', 'For a₁=3,aₙ₊₁=−2aₙ, find a₄.'],
        '-24',
        [
          '3×(−2)³=−24；三次负倍率，不能只取绝对值。',
          '3×(−2)³=−24, retaining the sign of three negative multiplications.',
        ],
        ['24', '-48'],
      ),
      N(
        [
          '等比数列a₁=4、q=1/2，求a₅。',
          'For a geometric sequence a₁=4,q=1/2, find a₅.',
        ],
        '1/4',
        ['4×(1/2)⁴=4/16=1/4。', '4×(1/2)⁴=4/16=1/4.'],
        ['1/8', '2'],
      ),
      N(
        [
          '等比数列a₁=−2、q=2，求a₄。',
          'For a geometric sequence a₁=−2,q=2, find a₄.',
        ],
        '-16',
        [
          '−2×2³=−16，正倍率2使负数离0更远，项值更小。',
          '−2×2³=−16. Positive multiplier two moves negative terms farther below zero.',
        ],
        ['16', '-32'],
      ),
      C(
        [
          '完整数列aₙ=5（所有正整数n）。按本单元定义，它是等差、等比、两者都是还是两者都不是？用both表示两者都是。',
          'For the complete sequence aₙ=5 on positive integers, is it arithmetic, geometric, both or neither?',
        ],
        'both',
        [
          '相邻差0、相邻比1且各项非零，因此既等差又等比。',
          'Adjacent differences are zero and ratios one, with nonzero terms, so both definitions hold.',
        ],
        ['arithmetic', 'geometric'],
      ),
      C(
        [
          '乘法递推a₁=3、aₙ₊₁=0aₙ，a₂=a₃=0。比值a₃/a₂是多少？无定义写undefined。',
          'For a₁=3,aₙ₊₁=0aₙ, terms a₂=a₃=0. Find a₃/a₂, using undefined when needed.',
        ],
        'undefined',
        [
          '0/0无定义，给定递推倍率0也不能让这个除法成立。',
          'Zero divided by zero is undefined even though the multiplicative rule uses zero.',
        ],
        ['0', '1'],
      ),
      E(
        [
          '完整递推a₁=3、aₙ₊₁=−aₙ。写通项并说明项值和绝对值如何变化，不能只说“公比负所以递减”。',
          'For a₁=3,aₙ₊₁=−aₙ, give the nth term and describe values and magnitudes, without claiming negative ratio means decreasing.',
        ],
        [
          'aₙ=3(−1)ⁿ⁻¹，3、−3交替，各项非零，相邻比−1；绝对值始终3，项值既非严格递增也非严格递减。负q改变符号，|q|=1保持幅度。',
          'aₙ=3(−1)^(n−1) alternates 3 and−3, with nonzero terms and common ratio−1. Magnitudes remain three, while values are neither strictly increasing nor decreasing. Negative q changes sign and |q|=1 preserves magnitude.',
        ],
      ),
    ],
    pick: {
      stem: [
        '若a₁<0且q>1，关于等比项值的哪项正确？',
        'For a₁<0 and q>1, which statement is correct about the terms?',
      ],
      options: [
        ['q>1就必定递增', 'q>1 always means increasing'],
        ['所有项变成正数', 'All terms become positive'],
        [
          '各项保持负，绝对值增大，项值递减',
          'Terms stay negative, magnitudes grow and values decrease',
        ],
      ],
      feedback: [
        [
          '还要核首项符号，例如−2、−4、−8。',
          'The initial sign matters: consider−2,−4,−8.',
        ],
        [
          '正倍率不改变首项的负号。',
          'A positive multiplier retains the initial negative sign.',
        ],
        [
          '正确；区分项值大小和绝对值。',
          'Correct: distinguish signed order from magnitude.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '为什么a₁=3、每次乘0的完整递推虽然可算，却不满足本单元等比定义？',
      'Why is the complete recurrence starting at 3 and multiplying by zero computable but not geometric under this unit’s definition?',
    ],
    rubric: [
      '递推唯一给3、0、0、…，但后续相邻比0/0无定义；本单元要求各项非零、非零固定公比。不能因为能写aₙ₊₁=0aₙ就假装每个相邻商都成立；全零数列也不能靠0/0得到公比1。',
      'The recurrence uniquely yields 3,0,0,…, but later adjacent quotients are 0/0. This unit requires nonzero terms and a nonzero fixed ratio. Writing a multiplicative recurrence does not make every quotient defined; an all-zero sequence also cannot obtain ratio one from 0/0.',
    ],
    prompts: [
      [
        '倍率的符号和绝对值分别控制什么？',
        'What do the sign and magnitude of the multiplier control?',
      ],
      [
        '取相邻比之前，分母是哪一项，是否为0？',
        'Which term is the denominator, and is it zero before taking a ratio?',
      ],
    ],
    misconception: [
      '指数多乘一次、只看|q|忽略首项符号、负q当递减，或把0/0当公比。',
      'Using one extra exponent, ignoring initial sign, calling negative-q sequences decreasing or assigning a ratio to 0/0.',
    ],
  },
  {
    title: ['等比数列求和', 'Sums of geometric series'],
    objective: [
      '用有限错位相减保留尾项求和，并单独处理q=1。',
      'Use finite shifted subtraction while retaining the tail, treating q=1 separately.',
    ],
    hook: [
      '3+6+12+24乘2后，多出来的是24还是48？错位相减会留下哪两项？',
      'After multiplying 3+6+12+24 by two, is the new tail 24 or 48? Which two terms survive subtraction?',
    ],
    prerequisites: ['H07-L04', 'J72-L03'],
    keywords: [
      ['错位相减', 'shifted subtraction'],
      ['有限尾项', 'finite tail'],
      ['特殊公比', 'special ratio'],
    ],
    lab: 'sequence-geometric-sum',
    skill: 'finite-geometric-tail-and-unit-ratio',
    hints: [
      [
        '先写Sₙ=a₁+…+a₁qⁿ⁻¹，再写qSₙ=a₁q+…+a₁qⁿ，按相同幂次对齐。',
        'Write Sₙ=a₁+…+a₁q^(n−1) and qSₙ=a₁q+…+a₁q^n, aligning equal powers.',
      ],
      [
        '相减得(1−q)Sₙ=a₁(1−qⁿ)；仅q≠1时可除1−q。q=1直接数n个a₁。',
        'Subtract to get(1−q)Sₙ=a₁(1−q^n). Divide by 1−q only if q≠1; at q=1 count n copies of a₁ directly.',
      ],
    ],
    items: [
      N(
        [
          '等比数列a₁=3、q=2，求前4项和S₄。',
          'For geometric a₁=3,q=2, find S₄.',
        ],
        '45',
        [
          '3+6+12+24=45，也可3(2⁴−1)/(2−1)=45。',
          '3+6+12+24=45, also 3(2⁴−1)/(2−1)=45.',
        ],
        ['24', '48'],
      ),
      N(
        ['等比数列a₁=5、q=1，求S₆。', 'For geometric a₁=5,q=1, find S₆.'],
        '30',
        [
          '每项5，共6项，S₆=6×5=30；不用0/0。',
          'Six terms of five give 30, without evaluating 0/0.',
        ],
        ['0', '5'],
      ),
      N(
        [
          '等比数列a₁=4、q=1/2，求前4项和。',
          'For geometric a₁=4,q=1/2, find the first four-term sum.',
        ],
        '15/2',
        [
          '4+2+1+1/2=15/2，有限和不是8。',
          '4+2+1+1/2=15/2; this finite sum is not eight.',
        ],
        ['8', '15/4'],
      ),
      N(
        ['等比数列a₁=3、q=−1，求S₆。', 'For geometric a₁=3,q=−1, find S₆.'],
        '0',
        [
          '3−3+3−3+3−3=0；交替符号完整保留。',
          '3−3+3−3+3−3=0, retaining alternating signs.',
        ],
        ['3', '18'],
      ),
      N(
        ['同样a₁=3、q=−1，改求S₅。', 'For a₁=3,q=−1, now find S₅.'],
        '3',
        [
          '前四项抵消，剩第五项3；项数奇偶改变有限和。',
          'The first four cancel, leaving three. Parity changes this finite sum.',
        ],
        ['0', '15'],
      ),
      E(
        [
          '给定非零常数等比数列a₁=5、q=1。为什么(1−q)S₆=5(1−q⁶)变成0=0后，不能说S₆=0？给正确和。',
          'For a₁=5,q=1, why does(1−q)S₆=5(1−q⁶), now 0=0, not imply S₆=0? Give the correct sum.',
        ],
        [
          'q=1使S₆的系数为0，等式对任何S₆都成立，不能除0恢复它。原和有6项每项5，S₆=30。0=0是恒等约束消失，不是未知量等于0。',
          'At q=1 the coefficient of S₆ vanishes and the identity holds for any S₆; division by zero cannot recover it. The original six terms are each five, so S₆=30. The identity 0=0 removes a constraint rather than forcing the unknown to zero.',
        ],
      ),
    ],
    pick: {
      stem: [
        '使用等比求和公式时，哪种处理正确？',
        'Which treatment of geometric summation is valid?',
      ],
      options: [
        ['先查q=1；若是，Sₙ=na₁', 'Check q=1 first; then Sₙ=na₁'],
        ['q=1时将0/0规定为1', 'Declare 0/0 to be one when q=1'],
        ['有限和可直接丢掉尾项qⁿ', 'Drop the tail q^n from any finite sum'],
      ],
      feedback: [
        [
          '正确；这也保留常数等比数列。',
          'Correct: constant nonzero geometric sequences remain valid.',
        ],
        [
          '0/0无定义，不能为配公式随意赋值。',
          'Zero divided by zero is undefined, not a value chosen to fit a formula.',
        ],
        [
          '有限和保留尾项，讨论无穷和还需额外条件与极限。',
          'Finite sums retain the tail. Infinite sums require separate conditions and a limit argument.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '对有限和S₃=1+1/2+1/4，有人说“公比1/2，所以和就是2”。指出漏了什么，给精确和。',
      'For the finite sum S₃=1+1/2+1/4, someone claims the sum is two because the ratio is one half. Identify the omission and give the exact sum.',
    ],
    rubric: [
      '有限3项和为7/4；(1−1/2)S₃=1−(1/2)³=7/8，所以S₃=7/4。2与它差1/4，不能忽略有限尾项1/8后再除1/2；无穷和需另外定义与论证，不能替代本题。',
      'The three-term sum is 7/4. Since(1−1/2)S₃=1−(1/2)³=7/8, S₃=7/4. Two exceeds it by 1/4. Retain the finite tail 1/8 before dividing by 1/2; an infinite sum requires a separate definition and argument.',
    ],
    prompts: [
      [
        '原和末项和乘q后的尾项，各是哪一个幂次？',
        'Which powers occur in the original last term and in the shifted tail?',
      ],
      [
        '你要除的1−q可能为0吗？原和还能直接数吗？',
        'Can 1−q be zero, and can you still count the original terms directly?',
      ],
    ],
    misconception: [
      '漏尾项、末项指数错位、q=1除0，或把有限和当无穷和。',
      'Dropping the tail, shifting its exponent incorrectly, dividing by zero at q=1 or replacing a finite sum by an infinite sum.',
    ],
  },
  {
    title: ['储蓄增长与数列模型', 'Sequences in savings growth'],
    objective: [
      '按存入时点与舍入规则建立离散余额递推，并核对累计投入和首次整期达标。',
      'Model discrete balances using deposit timing and posting rules, checking contributions and first whole-period targets.',
    ],
    hook: [
      '同样起存100、每期存10，先存再增长与先增长再存，第二期期末会相同吗？',
      'With initial 100 and deposits of 10 per period, does depositing before rather than after growth give the same second closing balance?',
    ],
    prerequisites: ['H07-L02', 'H07-L05', 'H03-L06'],
    keywords: [
      ['存入时点', 'deposit timing'],
      ['入账舍入', 'posting rounding'],
      ['首次整期', 'first whole period'],
    ],
    lab: 'sequence-savings',
    skill: 'savings-affine-recurrence-and-timing',
    hints: [
      [
        'B₀是第一期所有操作之前的余额。期末存用Bₖ=qBₖ₋₁+c；期初存用Bₖ=q(Bₖ₋₁+c)，每期只存一次。',
        'B₀ is the balance before all first-period actions. Use Bₖ=qBₖ₋₁+c for end deposits, or q(Bₖ₋₁+c) for start deposits, with one deposit per period.',
      ],
      [
        '先声明理想模型还是逐期按分入账；累计投入B₀+nc，首次达标核本期≥目标与前一期未达，不在期数之间插值。',
        'State ideal versus per-period cent posting. Contributions are B₀+nc; check the first target period and its predecessor without interpolating fractional periods.',
      ],
    ],
    items: [
      N(
        [
          '虚构理想模型：B₀=100 NZD，每期倍率q=1.1，每期期末存10 NZD，不逐期舍入。求B₂。',
          'In a fictional ideal model, B₀=100 NZD, q=1.1 per period and 10 NZD is deposited at each period end, without per-period rounding. Find B₂.',
        ],
        '142',
        [
          'B₁=100×1.1+10=120；B₂=120×1.1+10=142 NZD。',
          'B₁=100×1.1+10=120; B₂=120×1.1+10=142 NZD.',
        ],
        ['144.1', '121'],
        'NZD',
      ),
      N(
        [
          '改为每期期初存10 NZD，其余保持B₀=100、q=1.1、理想模型不逐期舍入。求B₂。',
          'Now deposit 10 NZD at each period start, retaining B₀=100,q=1.1 and no per-period rounding. Find B₂.',
        ],
        '144.1',
        [
          'B₁=(100+10)×1.1=121；B₂=(121+10)×1.1=144.1 NZD。',
          'B₁=(100+10)×1.1=121; B₂=(121+10)×1.1=144.1 NZD.',
        ],
        ['142', '144'],
        'NZD',
      ),
      N(
        [
          'B₀=100 NZD表示第一期所有操作之前。还未经过任何期，经过期数n=0时余额是多少？',
          'B₀=100 NZD is measured before all first-period actions. With n=0 completed periods, what is the balance?',
        ],
        '100',
        [
          '尚未发生定期存入或增长，余额仍B₀=100 NZD。',
          'No recurring deposit or growth has occurred, so the balance remains 100 NZD.',
        ],
        ['110', '120'],
        'NZD',
      ),
      N(
        [
          '理想期末存模型B₀=100、q=1.1、c=10 NZD，只查0至6整期。首次余额至少200 NZD在第几期？',
          'For ideal end deposits with B₀=100,q=1.1,c=10 NZD, search whole periods 0–6. At which period does the balance first reach at least 200 NZD?',
        ],
        '5',
        [
          'B₄=192.82<200，B₅=222.102≥200，首次第5期，不填4与5之间的插值。',
          'B₄=192.82<200 and B₅=222.102≥200, so the first whole period is five, not an interpolation between four and five.',
        ],
        ['4', '4.5'],
      ),
      N(
        [
          '虚构逐期入账模型：起存0.05 NZD、不加存、每期乘1.1，每期增长后的余额立即按分四舍五入。两期后余额多少NZD？',
          'In a fictional posting model, start with 0.05 NZD, no deposits, and multiply by 1.1 each period. Round the grown balance to cents immediately each period. Find the balance after two periods.',
        ],
        '0.07',
        [
          '第一期0.055入账0.06；第二期0.066入账0.07。理想值0.0605只在最后舍入会是0.06，属于另一模型。',
          'Period one posts 0.055 as 0.06; period two posts 0.066 as 0.07. The unrounded ideal 0.0605 would round finally to 0.06, which is a different model.',
        ],
        ['0.06', '0.0605'],
        'NZD',
      ),
      E(
        [
          '纸上比较两种虚构理想模型：B₀=100 NZD，每期q=1.1、存10 NZD，不逐期舍入；方案E期末存、方案S期初存。分别求B₃、3期累计投入与增长所得，并核对0至6期内首次至少200 NZD的整期。说明时点和假设。',
          'Compare two fictional ideal models on paper: B₀=100 NZD,q=1.1 and one 10 NZD deposit each period, without per-period rounding. Plan E deposits at the end, plan S at the start. Find B₃, three-period contributions and gains, and the first whole period reaching at least 200 NZD within 0–6. State timing and assumptions.',
        ],
        [
          'E依次120、142、166.2；S依次121、144.1、169.51 NZD。累计投入两者均100+3×10=130，增长所得分别36.2与39.51。E第4/5期192.82/222.102，S为197.461/228.2071，所以均首次第5期。期初较高不保证本目标早一个整期；假想倍率、无税费、不逐期舍入及B₀在第一期操作前都须说明。',
          'E closes at 120,142,166.2; S at 121,144.1,169.51 NZD. Both contributions total 100+3×10=130, with gains 36.2 and 39.51. E periods 4/5 are 192.82/222.102; S gives 197.461/228.2071, so both first reach this target at period five. Higher start-deposit balances need not change the first whole target period. State fictional multipliers, no fees/taxes, no per-period rounding and B₀ before first-period actions.',
        ],
      ),
    ],
    pick: {
      stem: [
        'Bₖ为第k期期末余额、B₀为第一期操作前，倍率q、每期期初存c。正确递推是哪项？',
        'Let Bₖ be the closing balance, B₀ precede first-period actions, multiplier q and a deposit c occur at each period start. Which recurrence is correct?',
      ],
      options: [
        ['Bₖ=qBₖ₋₁+c', 'Bₖ=qBₖ₋₁+c'],
        ['Bₖ=q(Bₖ₋₁+c)', 'Bₖ=q(Bₖ₋₁+c)'],
        ['Bₖ=q(Bₖ₋₁+c)+c', 'Bₖ=q(Bₖ₋₁+c)+c'],
      ],
      feedback: [
        [
          '这是期末存入的次序，本期存款未乘q。',
          'That is the end-deposit order; the current deposit has not grown.',
        ],
        [
          '正确：先把c加入增长基数，再乘q。',
          'Correct: include c in the growth base before multiplying by q.',
        ],
        [
          '把每期一次存款加了两次。',
          'This counts two deposits instead of one per period.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '理想期末存模型B₀=100、q=1.1、每期c=10 NZD，B₁=120、B₂=142。余额数列是等比数列吗？用比值说明并写正确递推。',
      'For ideal end deposits B₀=100,q=1.1,c=10 NZD, balances are B₁=120,B₂=142. Are the balances geometric? Compare ratios and give the correct recurrence.',
    ],
    rubric: [
      'B₁/B₀=6/5，B₂/B₁=71/60，二者不同，不能把余额直接当公比1.1的等比数列。正确是Bₖ=1.1Bₖ₋₁+10；其中初始100增长成100qⁿ，每次存款按剩余期数增长，存款贡献才组合成有限等比和。',
      'B₁/B₀=6/5 and B₂/B₁=71/60 differ, so balances are not simply geometric with ratio 1.1. The correct recurrence is Bₖ=1.1Bₖ₋₁+10. The initial amount contributes 100q^n and separate deposits grow for different remaining periods, forming a finite geometric sum of contributions.',
    ],
    prompts: [
      [
        '这一期存入的10参加了本期增长吗？',
        'Does this period’s deposit participate in its growth?',
      ],
      [
        '≈显示到分与真的逐期入账舍入，是同一条规则吗？',
        'Is a displayed rounded amount the same rule as actual per-period cent posting?',
      ],
    ],
    misconception: [
      '重复计存款、混淆B₀和a₁、把加存余额当等比，或只在最后舍入冒充逐期入账。',
      'Counting deposits twice, confusing B₀ with a₁, treating balances with deposits as geometric, or replacing per-period posting by final-only rounding.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  const s = specs[i]!;
  if (v.answer.kind === 'explain')
    return reasoning(id, T(v.stem), s.skill, v.answer.rubric, s.hints.map(T));
  const value = 'value' in v.answer ? String(v.answer.value) : '';
  const result = numeric(
    id,
    T(v.stem),
    value,
    s.skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(v.step)],
    { accepted: [value], rejected: v.wrong },
  );
  result.answer = v.answer;
  return result;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h07Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H07-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H10',
    unit: 'H07',
    order: i + 1,
    nzYearHints: [10, 11, 12],
    cnGradeHints: [10],
    contentStatus: 'ready',
    skillTags: [s.skill],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(`${id}-Q6`, T(s.reason), s.skill, T(s.rubric), s.hints.map(T)),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h07ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H07-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H07 retrieval');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24;
  let item: Item;
  if (i === 0) {
    const kind = (['add', 'square', 'double', 'observed'] as const)[
        Math.floor(k / 6)
      ]!,
      n = (k % 6) + 1,
      rule: Record<typeof kind, Pair> = {
        add: ['a₁=2、aₙ₊₁=aₙ+2', 'a₁=2,aₙ₊₁=aₙ+2'],
        square: ['aₙ=n²+1', 'aₙ=n²+1'],
        double: ['a₁=2、aₙ₊₁=2aₙ', 'a₁=2,aₙ₊₁=2aₙ'],
        observed: [
          '仅观测a₁=2、a₂=4、a₃=6，无后续规则',
          'only a₁=2,a₂=4,a₃=6 observed, without a continuation rule',
        ],
      },
      value = sequenceAt(kind, n),
      stem: Pair = [
        `正整数序号，${rule[kind][0]}。求a${n}，信息不足写insufficient。`,
        `Positive integer indices; ${rule[kind][1]}. Find a${n}, using insufficient if needed.`,
      ];
    item =
      typeof value === 'string'
        ? C(
            stem,
            value,
            [
              '有限观测只保证给出的项；完整规则可代入。',
              'Only supplied observations are guaranteed without a rule; a complete rule permits substitution.',
            ],
            ['999', 'undefined'],
          )
        : N(
            stem,
            textR(value),
            [
              '用给定规则与序号，先查指数或增量次数。',
              'Use the given rule and index, checking the number of transitions or multiplications.',
            ],
            ['999', '-999'],
          );
  } else if (i === 1) {
    const a = rational(BigInt(-2 + (k % 6))),
      d = rational(BigInt(Math.floor(k / 6) - 1)),
      n = 3 + (k % 4);
    item =
      k % 2 === 0
        ? N(
            [
              `等差数列a₁=${textR(a)}、d=${textR(d)}，求a${n}。`,
              `For arithmetic a₁=${textR(a)},d=${textR(d)}, find a${n}.`,
            ],
            textR(arithmeticTerm(a, d, n)),
            [
              '从首项走n−1次公差。',
              'Take n−1 differences from the first term.',
            ],
            ['999', '-999'],
          )
        : N(
            [
              `已知完整数列等差，a₂=${textR(arithmeticTerm(a, d, 2))}、a₅=${textR(arithmeticTerm(a, d, 5))}，求d。`,
              `A complete arithmetic sequence has a₂=${textR(arithmeticTerm(a, d, 2))},a₅=${textR(arithmeticTerm(a, d, 5))}. Find d.`,
            ],
            textR(d),
            [
              '序号2到5有三步，不是四步。',
              'Indices two to five are three steps apart, not four.',
            ],
            ['999', '-999'],
          );
  } else if (i === 2) {
    const a = rational(BigInt(1 + (k % 4))),
      d = rational(BigInt((Math.floor(k / 4) % 3) - 1)),
      n = 3 + Math.floor(k / 12) * 2;
    item = N(
      [
        `等差数列a₁=${textR(a)}、d=${textR(d)}，求S${n}。`,
        `For arithmetic a₁=${textR(a)},d=${textR(d)}, find S${n}.`,
      ],
      textR(arithmeticSum(a, d, n)),
      [
        '先算末项，再用两份和整体除2，保留负项。',
        'Find the last term, pair two copies and halve the total, retaining signs.',
      ],
      ['999', '-999'],
    );
  } else if (i === 3) {
    const a = readRational(['-2', '0', '3'][Math.floor(k / 8)]!),
      ratio = readRational(['-2', '-1', '0', '1/2'][k % 4]!),
      n = 2 + (Math.floor(k / 4) % 2),
      stem: Pair = [
        `完整乘法递推a₁=${textR(a)}、aₙ₊₁=(${textR(ratio)})aₙ，${k % 3 === 0 ? `求a${n + 1}/a${n}（零分母undefined）` : k % 3 === 1 ? `求a${n}` : '判断geometric/not-geometric（各项非零定义）'}。`,
        `For a₁=${textR(a)},aₙ₊₁=(${textR(ratio)})aₙ, ${k % 3 === 0 ? `find a${n + 1}/a${n} (zero denominator: undefined)` : k % 3 === 1 ? `find a${n}` : 'classify geometric/not-geometric under the nonzero-term definition'}.`,
      ];
    if (k % 3 === 0) {
      const r = adjacentRatio(a, ratio, n);
      item =
        r === null
          ? C(
              stem,
              'undefined',
              ['分母为0，不能取商。', 'A zero denominator has no quotient.'],
              ['0', '1'],
            )
          : N(
              stem,
              textR(r),
              [
                '非零项相邻比等于给定倍率。',
                'For nonzero terms the adjacent ratio is the given multiplier.',
              ],
              ['999', '-999'],
            );
    } else if (k % 3 === 1)
      item = N(
        stem,
        textR(geometricTerm(a, ratio, n)),
        [
          '从首项乘n−1次倍率。',
          'Multiply the first term by the multiplier n−1 times.',
        ],
        ['999', '-999'],
      );
    else
      item = C(
        stem,
        geometricDefinition(a, ratio) ? 'geometric' : 'not-geometric',
        [
          '完整乘法规则仍需各项与倍率非零，才符合本单元等比定义。',
          'A multiplicative rule also needs nonzero terms and multiplier to meet this unit’s geometric definition.',
        ],
        ['both', 'insufficient'],
      );
  } else if (i === 4) {
    const a = rational(BigInt(1 + (k % 3))),
      ratio = readRational(['-1', '1/2', '1', '2'][Math.floor(k / 3) % 4]!),
      n = 3 + Math.floor(k / 12);
    item = N(
      [
        `等比数列a₁=${textR(a)}、q=${textR(ratio)}，求S${n}。`,
        `For geometric a₁=${textR(a)},q=${textR(ratio)}, find S${n}.`,
      ],
      textR(geometricSum(a, ratio, n)),
      [
        '先查q=1，其余情况保留有限尾项。',
        'Check q=1 first; otherwise retain the finite tail.',
      ],
      ['999', '-999'],
    );
  } else {
    const initial = rational(BigInt(50 + 10 * (k % 3))),
      deposit = rational(BigInt(5 + 5 * (Math.floor(k / 3) % 2))),
      n = 1 + (Math.floor(k / 6) % 2),
      timing = k < 12 ? 'end' : 'start',
      config: SavingsConfig = {
        initial,
        deposit,
        multiplier: readRational('11/10'),
        timing,
        policy: 'ideal',
      };
    item = N(
      [
        `虚构理想模型B₀=${textR(initial)} NZD、每期存${textR(deposit)} NZD、q=1.1，${timing === 'end' ? '期末' : '期初'}存，不逐期舍入。求B${n}。`,
        `Fictional ideal model: B₀=${textR(initial)} NZD, deposit ${textR(deposit)} NZD each period, q=1.1, ${timing === 'end' ? 'end' : 'start'} deposits with no per-period rounding. Find B${n}.`,
      ],
      textR(savingsLedger(config, n).balance),
      [
        '先按时点写增长与加存的次序，B₀不算已经完成一期。',
        'Order growth and deposits by timing; B₀ does not count as one completed period.',
      ],
      ['999', '-999'],
      'NZD',
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h07CheckQuestions: Question[] = [
  q('H07-CHECK-Q1', 0, specs[0]!.items[2]!),
  q('H07-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('H07-CHECK-Q3', 2, specs[2]!.items[0]!),
  q('H07-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('H07-CHECK-Q5', 4, specs[4]!.items[0]!),
  pick('H07-CHECK-Q6', 5),
  reasoning(
    'H07-CHECK-Q7',
    T(specs[4]!.reason),
    specs[4]!.skill,
    T(specs[4]!.rubric),
    specs[4]!.hints.map(T),
  ),
  q('H07-CHECK-Q8', 5, specs[5]!.items[5]!),
];
