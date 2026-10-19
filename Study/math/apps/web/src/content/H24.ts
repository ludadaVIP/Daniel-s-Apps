import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  permutations,
  combinations,
  binomialCoefficient,
  contingency,
  sourceFlagModel,
} from '../countingModels';
import { textR } from '../algebraModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'number', value }, step, wrong);
const U = (stem: Pair, step: Pair) =>
  I(stem, { kind: 'vector-code', value: 'undefined' }, step, ['0', '1']);
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; correct: number; options: Pair[]; feedback: Pair[] };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: [
      '分类计数与分步计数',
      'Addition and multiplication counting principles',
    ],
    objective: [
      '按完整结果是否互斥或分步，建立不重不漏的计数。',
      'Count complete outcomes without omission or duplication by distinguishing disjoint alternatives from stages.',
    ],
    hook: [
      'ABC与CD两类卡任选一张，为什么3+2多算了？',
      'Why does 3+2 overcount when choosing a card from categories ABC and CD?',
    ],
    prerequisites: ['J76-L04', 'J97-L02', 'H01-L02'],
    keywords: [
      ['互斥分类', 'disjoint alternatives'],
      ['完整结果', 'complete outcome'],
      ['分支选择', 'branch choices'],
    ],
    lab: 'counting-principles',
    hints: [
      [
        '先写一个完整结果，再看两种方法是否会产生同一个结果。',
        'Write one complete outcome, then check whether two routes produce that same outcome.',
      ],
      [
        '互斥类别相加；分步逐支相乘再相加。重叠要去重，限制会改变分支。',
        'Add disjoint categories; multiply along stages and sum branches. Remove overlaps and update choices under restrictions.',
      ],
    ],
    items: [
      N(
        [
          '从互不重复的卡A,B,C或D,E中任选一张，共几种？',
          'Choose one card from disjoint categories A,B,C or D,E. How many outcomes?',
        ],
        '5',
        ['每张卡只出现一次，3+2=5。', 'Each card appears once: 3+2=5.'],
        ['6', '3', '2'],
      ),
      N(
        [
          '先从3种封面选一种，再从2种内页选一种，所有搭配都允许，几种完整作品？',
          'Choose one of three covers and one of two inserts; all pairs are allowed. How many complete designs?',
        ],
        '6',
        [
          '每个封面配2种内页，共3×2=6。',
          'Each cover has two inserts, giving 3×2=6.',
        ],
        ['5', '3', '2'],
      ),
      N(
        [
          '类别一A,B,C；类别二C,D。按卡的身份任选一张，共几张不同卡？',
          'Categories are A,B,C and C,D. How many distinct card identities can be chosen?',
        ],
        '4',
        [
          'C重复，3+2−1=4，合并为A,B,C,D。',
          'C is shared: 3+2−1=4, namely A,B,C,D.',
        ],
        ['5', '6', '3'],
      ),
      N(
        [
          '第一步选1,2,3，第二步选1,2，禁止两步编号相同。有几对？',
          'Choose first from 1,2,3 and second from 1,2, forbidding equal numbers. How many ordered pairs?',
        ],
        '4',
        [
          '分支分别剩1、1、2项，合计4：(1,2),(2,1),(3,1),(3,2)。',
          'The branches have 1,1,2 choices: four pairs (1,2),(2,1),(3,1),(3,2).',
        ],
        ['6', '3', '2'],
      ),
      N(
        [
          '三个首步选项各自允许2、1、3个次步选项，完整两步结果共多少？',
          'Three first-stage options allow respectively 2,1,3 second-stage choices. How many complete outcomes?',
        ],
        '6',
        [
          '按不同首步分类，相加2+1+3=6，不能假定分支等长。',
          'Partition by first choice: 2+1+3=6. Branches need not have equal sizes.',
        ],
        ['18', '9', '3'],
      ),
      E(
        [
          '为“ABC与CD任选一张”和“两步各选一种”各列完整结果，并解释何时能加、何时能乘。',
          'List complete outcomes for choosing one card from ABC or CD, and for choosing one option at each of two stages. Explain when addition and multiplication apply.',
        ],
        [
          '并集为A,B,C,D，共4；C不能重复。若两步选1,2和X,Y，则完整结果为1X,1Y,2X,2Y，共4。类别相加要求结果不重叠；相乘要求每步都完成且每个首步均有所声明的后续选择，分支不同则逐支求和。',
          'The union A,B,C,D has four identities; C is not counted twice. Stages 1,2 then X,Y give 1X,1Y,2X,2Y. Addition requires disjoint complete outcomes; a product requires all stages and the stated number of continuations on each branch. Unequal branches must be summed.',
        ],
      ),
    ],
    pick: {
      stem: ['哪种说法足以使用3×2？', 'Which statement justifies 3×2?'],
      correct: 1,
      options: [
        ['看见两个数字就相乘', 'Multiply whenever two numbers appear'],
        [
          '每个首步选项都恰有2个合法后续',
          'Every first-stage option has exactly two legal continuations',
        ],
        [
          '两个类别分别有3项和2项',
          'Two categories contain three and two items',
        ],
      ],
      feedback: [
        [
          '必须先确定完整结果和合法搭配。',
          'First define complete outcomes and legal pairings.',
        ],
        [
          '三个不重叠首步分支各有2项。',
          'Three disjoint first-stage branches each contain two outcomes.',
        ],
        [
          '任选一个类别的结果通常用加法，还需检查重叠。',
          'Alternative categories usually require addition, with overlaps checked.',
        ],
      ],
    },
    reason: [
      '有人把有重叠类别相加，又把受限两步结果直接相乘。分别给反例并修复。',
      'Give a counterexample and repair for adding overlapping categories and blindly multiplying restricted stages.',
    ],
    rubric: [
      'ABC与CD的C重复，3+2须减1得4。第一步1,2,3和第二步1,2若禁止同号，6对中删(1,1),(2,2)得4。两错误分别是身份重复与非法结果；列举或按分支计数可修复。',
      'ABC and CD share C, so subtract one from 3+2. For first 1,2,3 then 1,2 with equal numbers forbidden, remove (1,1),(2,2) from six pairs. The errors are duplicate identities and illegal outcomes; listing or branch counts repairs them.',
    ],
    prompts: [
      [
        '请指出一个完整结果，而不是只说选了第一步。',
        'Point to a complete outcome, not just a first-stage choice.',
      ],
      [
        '被重复或被禁止的结果具体是哪几个？',
        'Which exact outcomes are duplicated or forbidden?',
      ],
    ],
    misconception: [
      '加乘取决于结果结构，不能靠“或/和”单字或数字个数套公式。',
      'Addition and multiplication depend on outcome structure, not isolated words or the number of given numbers.',
    ],
  },
  {
    title: ['排列与阶乘', 'Permutations and factorials'],
    objective: [
      '用有标签位置的逐步选择解释排列，并区分能否重复。',
      'Explain permutations through choices for labelled positions and distinguish repetition rules.',
    ],
    hook: [
      'AB和BA什么时候必须算两种？',
      'When must AB and BA count as two outcomes?',
    ],
    prerequisites: ['H24-L01', 'J97-L03'],
    keywords: [
      ['排列', 'permutation'],
      ['阶乘', 'factorial'],
      ['有标签位置', 'labelled positions'],
    ],
    lab: 'counting-permutations',
    hints: [
      [
        '不同对象、位置有别、不重复：每放一个，剩余数减1。',
        'For distinct objects in labelled positions without repetition, each placement reduces available choices by one.',
      ],
      [
        'P(n,r)=n(n−1)…(n−r+1)；可重复改为n^r。0!=1对应一个空排列。',
        'P(n,r)=n(n−1)…(n−r+1); repetition gives n^r. The convention 0!=1 counts one empty arrangement.',
      ],
    ],
    items: [
      N(
        [
          '5位不同成员选队长和记录员，每人最多任一职，有几种？',
          'Assign captain and recorder from five distinct members, with no one holding both roles. How many assignments?',
        ],
        '20',
        [
          '队长5种，记录员剩4种，5×4=20。',
          'Five choices for captain leave four for recorder: 20.',
        ],
        ['10', '25', '7'],
      ),
      N(
        [
          '4张不同卡全排成一行，有几种？',
          'How many linear orders of four distinct cards?',
        ],
        '24',
        ['4!=4×3×2×1=24。', '4!=4×3×2×1=24.'],
        ['16', '4', '12'],
      ),
      N(
        [
          '空集合排进0个位置，有几个空排列？即0!是多少？',
          'How many empty arrangements place no objects into zero positions; what is 0!?',
        ],
        '1',
        [
          '唯一的空列表算1个，保持P(n,0)=1。',
          'There is one empty list, consistently giving P(n,0)=1.',
        ],
        ['0', '-1', '2'],
      ),
      N(
        [
          '4种符号填3个有标签位置，允许重复，有多少串？',
          'Fill three labelled positions from four symbols, allowing repetition. How many strings?',
        ],
        '64',
        [
          '每步均有4种，4³=64，不用4×3×2。',
          'All stages retain four choices: 4³=64, not 4×3×2.',
        ],
        ['24', '12', '4'],
      ),
      N(
        [
          '只有3张不同卡，要求无重复填满4个位置，有几种？',
          'Only three distinct cards are available. How many ways fill four positions without repetition?',
        ],
        '0',
        [
          '对象不足，没有合法完整排列；不使用负数阶乘。',
          'There are too few objects: zero legal complete arrangements, without negative factorials.',
        ],
        ['1', '12', '24'],
      ),
      E(
        [
          '用A,B,C填两个位置，分别列不重复和允许重复的所有串；解释0个位置的边界。',
          'List all two-position strings from A,B,C with and without repetition; explain the zero-position boundary.',
        ],
        [
          '不重复为AB,AC,BA,BC,CA,CB共6；允许重复再加AA,BB,CC共9。前者3×2，后者3²。0个位置只有一个空列表，故P(3,0)=1；0!=1不是没有对象就有0种。',
          'Without repetition: AB,AC,BA,BC,CA,CB, six. Allow repetition and add AA,BB,CC, nine. These are 3×2 versus 3². Zero positions have one empty list, so P(3,0)=1 and 0!=1, rather than zero ways.',
        ],
      ),
    ],
    pick: {
      stem: ['什么时候P(n,r)适用？', 'When does P(n,r) apply?'],
      correct: 2,
      options: [
        ['同组成员没有不同职位', 'Group members have identical roles'],
        ['同一个对象可以反复使用', 'An object can be reused freely'],
        [
          'n个不同对象填r个有区别位置，每个最多一次',
          'n distinct objects fill r distinguished positions, each used at most once',
        ],
      ],
      feedback: [
        [
          '忽略顺序会把多个排列合并为组合。',
          'Ignoring order merges permutations into combinations.',
        ],
        [
          '可重复用n^r，选择数不逐步减少。',
          'Repetition gives n^r; choices do not decrease.',
        ],
        [
          '逐位置剩n,n−1,…，适用无重复排列。',
          'Choices decrease n,n−1,… across positions.',
        ],
      ],
    },
    reason: [
      '为什么“5人选2人”还不足以判断是20还是10？补足两种不同规则。',
      'Why is “choose two from five people” insufficient to decide between 20 and 10? Supply two different rules.',
    ],
    rubric: [
      '若队长与记录员有别，AB与BA是不同分配，5×4=20。若两人同权成组，AB与BA是同组，20/2!=10。必须声明职位、是否重复、完整结果身份，单凭“选2人”不能定公式。',
      'Captain and recorder are distinct roles: AB and BA differ, so 5×4=20. An equal-role pair identifies AB with BA, giving 20/2!=10. Roles, repetition and outcome identity must be specified before choosing a formula.',
    ],
    prompts: [
      [
        '交换两个位置，作品或职责真的改变了吗？',
        'Does exchanging positions change the design or responsibilities?',
      ],
      [
        '已经用过的对象，下一步还允许再选吗？',
        'May an object already used be chosen again?',
      ],
    ],
    misconception: [
      '阶乘公式以不同对象和无重复有序位置为前提；重复规则改变整个结果空间。',
      'Factorials assume distinct objects and ordered positions without reuse; repetition changes the outcome space.',
    ],
  },
  {
    title: ['组合的意义', 'Combinations'],
    objective: [
      '把无重复排列按同一成员集合归组，推导组合数。',
      'Group nonrepeating permutations by membership to derive combination counts.',
    ],
    hook: [
      '同一小组在名单上换顺序，为什么不变成新小组？',
      'Why does reordering a team list not create a new team?',
    ],
    prerequisites: ['H24-L02', 'J97-L03'],
    keywords: [
      ['组合', 'combination'],
      ['成员集合', 'membership set'],
      ['重复倍数', 'multiplicity'],
    ],
    lab: 'counting-combinations',
    hints: [
      [
        '先问交换位置是否形成新结果；每个成员只能选一次。',
        'Ask whether swapping positions creates a new outcome; select each member at most once.',
      ],
      [
        '同一r人集合有r!个排列，所以C(n,r)=P(n,r)/r!；先核等可能才能拿计数比求概率。',
        'Each r-member set has r! orders, so C(n,r)=P(n,r)/r!. Count ratios are probabilities only for equally likely outcomes.',
      ],
    ],
    items: [
      N(
        [
          '从5位不同成员选同权2人小组，有几组？',
          'Choose a two-person equal-role team from five distinct members. How many teams?',
        ],
        '10',
        [
          'P(5,2)=20，每组2!=2次，20/2=10。',
          'P(5,2)=20 and each team has 2!=2 orders, giving ten.',
        ],
        ['20', '25', '5'],
      ),
      N(
        [
          '5位成员选同权3人组，有几组？',
          'How many equal-role three-person teams from five members?',
        ],
        '10',
        [
          'C(5,3)=5×4×3/(3×2×1)=10，也可选未入组的2人。',
          'C(5,3)=5×4×3/3!=10; equivalently choose the two excluded members.',
        ],
        ['60', '15', '5'],
      ),
      N(
        [
          '6张不同卡选0张，空子集有几个？',
          'Choose zero of six distinct cards. How many empty subsets?',
        ],
        '1',
        [
          '只有空集，C(6,0)=1，0!=1。',
          'Only the empty set: C(6,0)=1 with 0!=1.',
        ],
        ['0', '6', '-1'],
      ),
      N(
        [
          '2红3蓝共5个编号球，均匀无放回抽2个且不计顺序。恰好1红的概率？',
          'Uniformly select an unordered pair without replacement from two red and three blue numbered balls. Probability of exactly one red?',
        ],
        '3/5',
        [
          '等可能球对共C(5,2)=10，有利2×3=6，6/10=3/5。',
          'There are C(5,2)=10 equally likely pairs, six red-blue pairs: 6/10=3/5.',
        ],
        ['1/2', '2/5', '6'],
      ),
      N(
        [
          '从A,B,C,D选2人同权组，要求包含A，共几组？',
          'Choose an equal-role pair from A,B,C,D that must include A. How many teams?',
        ],
        '3',
        [
          '固定A后从其余3人选1人：AB,AC,AD。',
          'Fix A and choose one of three others: AB,AC,AD.',
        ],
        ['6', '4', '2'],
      ),
      E(
        [
          '列A,B,C,D中全部2人同权组，并解释为什么排列数恰好是组合数的2倍。',
          'List every equal-role pair from A,B,C,D and explain why the permutation count is exactly twice the combination count.',
        ],
        [
          '六组AB,AC,AD,BC,BD,CD；每组有两个不同次序，如AB与BA，所以12=6×2!。每个人不同且不重复，这才保证每组相同倍数。没有职位的结果不把顺序当身份。',
          'The six teams are AB,AC,AD,BC,BD,CD. Each has two orders, such as AB and BA, so 12=6×2!. Distinct nonrepeated members guarantee the same multiplicity for every team. Without roles, order does not define a new identity.',
        ],
      ),
    ],
    pick: {
      stem: [
        '用“有利组数/全部组数”求概率还缺哪个条件？',
        'What additional condition is needed for favourable teams divided by all teams to be a probability?',
      ],
      correct: 0,
      options: [
        ['所有所数结果等可能', 'All counted outcomes are equally likely'],
        ['每组人数相同就够了', 'Equal group size alone suffices'],
        ['有利组数必须大于1', 'There must be more than one favourable team'],
      ],
      feedback: [
        [
          '均匀抽样前提使各组权重一致。',
          'Uniform sampling gives the counted outcomes equal weight.',
        ],
        [
          '组大小相同不保证抽到各组的概率相同。',
          'Equal size does not guarantee equal selection probability.',
        ],
        [
          '单个有利结果也可以求概率。',
          'A single favourable outcome is allowed.',
        ],
      ],
    },
    reason: [
      '为什么AB和BA合并后除2!有效，而“三张中有两张同字母”不能直接照搬？',
      'Why can AB and BA be merged by dividing by 2!, while cards with repeated letters need more care?',
    ],
    rubric: [
      '对不同且不重复的r个成员，每一集合恰好有r!个有序表示，所以统一除法合法。若按相同字母而非物理卡身份区分，AA交换不产生新字串，AB交换却会，倍数不一致；需重新定义结果与重复次数，不能盲除。',
      'For r distinct nonrepeated members every set has exactly r! ordered representations. If identical letters rather than physical card identities define outcomes, swapping AA produces no new string while swapping AB does. Multiplicities differ, so redefine outcomes and count repetition rather than blindly dividing.',
    ],
    prompts: [
      [
        '同一组在有序表里能找到几次？',
        'How many times does one team appear in the ordered table?',
      ],
      [
        '你数的是编号球、颜色串，还是同权成员组？',
        'Are you counting numbered balls, colour strings or equal-role teams?',
      ],
    ],
    misconception: [
      '不计顺序不等于能重复选；统一除r!需要不同对象且每组同样的排列倍数。',
      'Ignoring order does not allow reuse; division by r! requires distinct objects and uniform multiplicity.',
    ],
  },
  {
    title: [
      '二项式系数与杨辉三角',
      "Binomial coefficients and Pascal's triangle",
    ],
    objective: [
      '以选择因子的位置解释二项式系数和杨辉递推。',
      'Explain binomial coefficients and Pascal recurrence by choosing factor positions.',
    ],
    hook: [
      '(x+b)^4的x²b²为何恰出现6次？',
      'Why does x²b² appear exactly six times in (x+b)^4?',
    ],
    prerequisites: ['H24-L03', 'J81-L03'],
    keywords: [
      ['二项式系数', 'binomial coefficient'],
      ['杨辉递推', 'Pascal recurrence'],
      ['位置子集', 'position subset'],
    ],
    lab: 'counting-binomial',
    hints: [
      [
        '把因子标成1到n，选k个位置取b，其余取x。',
        'Label factors 1 through n, choose k positions for b and x from the rest.',
      ],
      [
        '系数为C(n,k)b^k；按是否选第n个位置分类得递推。负常数保留幂的奇偶。',
        'The coefficient is C(n,k)b^k; partition by whether the last position is chosen to obtain recurrence. Preserve parity for negative constants.',
      ],
    ],
    items: [
      N(
        [
          '(x+y)^4展开，x²y²的系数？',
          'What is the coefficient of x²y² in (x+y)^4?',
        ],
        '6',
        [
          '四个位置选两个取y，C(4,2)=6。',
          'Choose two of four positions for y: C(4,2)=6.',
        ],
        ['4', '8', '12'],
      ),
      N(
        ['(x+2)^4中x²的系数？', 'What is the coefficient of x² in (x+2)^4?'],
        '24',
        ['C(4,2)×2²=6×4=24。', 'C(4,2)×2²=6×4=24.'],
        ['6', '12', '16'],
      ),
      N(
        ['(x−2)^3中x²的系数？', 'What is the coefficient of x² in (x−2)^3?'],
        '-6',
        ['取一次−2，C(3,1)(−2)=−6。', 'Choose −2 once: C(3,1)(−2)=−6.'],
        ['6', '12', '-12'],
      ),
      N(
        [
          '杨辉三角第n=5行的系数和？行号从0起。',
          'Sum row n=5 of Pascal’s triangle, with rows numbered from zero.',
        ],
        '32',
        [
          '令x=y=1，系数和(1+1)^5=32。',
          'Set x=y=1: the coefficient sum is 2^5=32.',
        ],
        ['16', '5', '25'],
      ),
      N(
        [
          '每轮独立抛4枚公平硬币，恰2枚正面的理论概率？',
          'Independently flip four fair coins per trial. Theoretical probability of exactly two heads?',
        ],
        '3/8',
        [
          '16个等可能有序结果中，选正面位置C(4,2)=6，6/16=3/8。',
          'Of 16 equally likely ordered outcomes, six choose two head positions: 6/16=3/8.',
        ],
        ['1/2', '6', '1/4'],
      ),
      E(
        [
          '不用背三角，按“选/不选最后一个位置”证明C(5,2)=C(4,1)+C(4,2)，再说明模拟频率为何不必恰等理论概率。',
          'Prove C(5,2)=C(4,1)+C(4,2) by choosing or excluding the last position; explain why simulated frequency need not equal theory exactly.',
        ],
        [
          '含第5位置时其余4中选1有4种；不含时4中选2有6种，互斥且穷尽，共10。模拟是有限随机记录，频率围绕理论波动，不强制等于理论或逐步单调靠近；所有位置独立公平才有2^n等可能串。',
          'Including position five leaves four choices for one other; excluding it leaves C(4,2)=6. The disjoint exhaustive cases total ten. A finite simulated record fluctuates around theory without forced equality or monotonic convergence. The 2^n strings are equally likely only under independent fair flips.',
        ],
      ),
    ],
    pick: {
      stem: [
        '(x−2)^3的系数为何不是直接照抄1,3,3,1？',
        'Why can we not simply copy 1,3,3,1 as the coefficients of (x−2)^3?',
      ],
      correct: 1,
      options: [
        [
          '杨辉三角不适用于负数',
          'Pascal’s triangle never applies to negative numbers',
        ],
        ['还要乘每项的(−2)^k', 'Each term also includes (−2)^k'],
        ['所有系数都应变成负数', 'Every coefficient becomes negative'],
      ],
      feedback: [
        [
          '组合数仍适用；代入常数时处理符号。',
          'The combination counts still apply; substitution supplies signs.',
        ],
        [
          '选位置的倍数与常数的幂共同给系数。',
          'Position multiplicity and constant powers together give coefficients.',
        ],
        [
          '偶次常数幂为正，奇次为负。',
          'Even powers are positive and odd powers negative.',
        ],
      ],
    },
    reason: [
      '有人说抛4枚硬币只有0,1,2,3,4共5种正面数，所以恰2正概率1/5。哪里错？',
      'Someone says four coins have five head counts, 0 through 4, so two heads has probability 1/5. What is wrong?',
    ],
    rubric: [
      '五种计数并非等可能；0与4各1串，2有C(4,2)=6串。独立公平硬币的16个有序串等可能，按正面数归组为1,4,6,4,1，所以恰2正为6/16。不能因图有五根柱就均分概率。',
      'The five counts are not equally likely: zero and four have one string each, while two has six. Independent fair flips yield 16 equally likely strings grouped as 1,4,6,4,1. Thus two heads has probability 6/16; five bars do not imply equal probabilities.',
    ],
    prompts: [
      [
        '某一项是哪些因子位置贡献的？',
        'Which factor positions contribute to this term?',
      ],
      [
        '表里显示的是理论概率，还是有限次频率？',
        'Does the table show theory or finite observed frequency?',
      ],
    ],
    misconception: [
      '二项式系数不含代入常数的幂；正面个数不等可能，模拟也不被强制贴合理论。',
      'Binomial coefficients omit substituted constant powers; head counts are not equally likely, and simulation is not forced to match theory.',
    ],
  },
  {
    title: ['条件概率', 'Conditional probability'],
    objective: [
      '把条件作为新的结果空间，用交集占条件的比例求概率。',
      'Restrict the outcome space to the condition and compute the intersection’s share within it.',
    ],
    hook: [
      '知道B发生后，为什么分母从10变成5？',
      'Why does the denominator change from ten to five after learning B occurred?',
    ],
    prerequisites: ['H24-L03', 'J97-L02', 'H01-L02'],
    keywords: [
      ['条件结果空间', 'conditioned outcome space'],
      ['交集', 'intersection'],
      ['条件方向', 'direction of conditioning'],
    ],
    lab: 'counting-conditional',
    hints: [
      [
        'P(A|B)读作“已知B，求A”；先圈B，再在B里找A。',
        'Read P(A|B) as A given B: circle B, then find A within B.',
      ],
      [
        'P(A|B)=P(A∩B)/P(B)只在P(B)>0定义；乘法法则是P(A∩B)=P(B)P(A|B)。',
        'P(A|B)=P(A∩B)/P(B) requires P(B)>0; the product rule is P(A∩B)=P(B)P(A|B).',
      ],
    ],
    items: [
      N(
        [
          '10个等可能编号中，AB=3、A独有=1、B独有=2、皆非=4。求P(A|B)。',
          'Ten equally likely IDs have AB=3, A-only=1, B-only=2, neither=4. Find P(A|B).',
        ],
        '3/5',
        [
          'B含3+2=5个，其中3个在A，故3/5。',
          'B contains five outcomes, three in A: 3/5.',
        ],
        ['3/10', '3/4', '1/2'],
      ),
      N(
        [
          '同一四格3,1,2,4，反向求P(B|A)。',
          'For the same four cells 3,1,2,4, find the reverse P(B|A).',
        ],
        '3/4',
        [
          'A含3+1=4个，交集仍3，故3/4。',
          'A contains four outcomes and the intersection remains three: 3/4.',
        ],
        ['3/5', '3/10', '1/4'],
      ),
      N(
        [
          'P(B)=1/2，P(A|B)=3/5，求P(A∩B)。',
          'P(B)=1/2 and P(A|B)=3/5. Find P(A∩B).',
        ],
        '3/10',
        [
          '乘首步与条件概率：(1/2)(3/5)=3/10。',
          'Multiply condition probability by its conditional branch: (1/2)(3/5)=3/10.',
        ],
        ['3/5', '6/5', '1/10'],
      ),
      U(
        [
          '一个有限等可能模型中B为空，P(A|B)是多少？输入undefined表示未定义。',
          'B is empty in a finite equally likely model. Give P(A|B), entering undefined if undefined.',
        ],
        [
          'P(B)=0，不能除以0；不是概率0。',
          'P(B)=0, so division by zero is undefined, not probability zero.',
        ],
      ),
      N(
        [
          '3红2蓝编号球无放回抽两次，已知第一次红，第二次红的概率？',
          'Draw twice without replacement from three red and two blue numbered balls. Given first red, probability second red?',
        ],
        '1/2',
        [
          '第一红后剩2红2蓝，条件概率2/4=1/2。',
          'After a red first draw, two red and two blue remain: 2/4=1/2.',
        ],
        ['3/5', '3/10', '2/5'],
      ),
      E(
        [
          '用四格3,1,2,4分别说明P(A)、P(A∩B)、P(A|B)、P(B|A)，并说明B为空时为何不能填0。',
          'Using cells 3,1,2,4, distinguish P(A), P(A∩B), P(A|B), P(B|A), and explain why an empty B does not give zero.',
        ],
        [
          '总数10，A有4，B有5，交集3；四者为2/5、3/10、3/5、3/4。条件方向选择分母，不改变交集分子。空B导致0/0而非0：条件空间没有结果，常规定义不能分配条件比例。',
          'Total ten, A four, B five and intersection three give respectively 2/5,3/10,3/5,3/4. Direction chooses the denominator without changing the intersection. Empty B yields 0/0, not zero; no conditional outcome space is available for this ratio.',
        ],
      ),
    ],
    pick: {
      stem: [
        'P(A|B)中竖线右侧表示什么？',
        'What does the right side of the bar in P(A|B) represent?',
      ],
      correct: 2,
      options: [
        ['要预测的事件A', 'The target event A'],
        ['必须与A独立的事件', 'An event that must be independent of A'],
        [
          '已知发生、用来限制分母的事件B',
          'The known event B that restricts the denominator',
        ],
      ],
      feedback: [
        ['A在竖线左边，B是条件。', 'A is on the left; B is the condition.'],
        [
          '条件概率对相依事件也适用。',
          'Conditional probability also applies to dependent events.',
        ],
        [
          '先限制到B，再算其中满足A的份额。',
          'Restrict to B, then find the share satisfying A.',
        ],
      ],
    },
    reason: [
      '“P(A|B)=P(B|A)，因为交集相同”为什么不成立？给明确数值反例。',
      'Why does a shared intersection not imply P(A|B)=P(B|A)? Give a numerical counterexample.',
    ],
    rubric: [
      '在3,1,2,4模型中交集3但B有5、A有4；P(A|B)=3/5，P(B|A)=3/4。交集相同只保证分子相同，条件方向改变分母。两条件均正概率；不能把交集概率3/10当作任一个条件概率。',
      'In cells 3,1,2,4 the intersection is three but B has five and A four. The conditional probabilities are 3/5 and 3/4. A shared intersection gives the same numerator, not the same denominator. Both conditions have positive probability; 3/10 is instead the intersection probability.',
    ],
    prompts: [
      [
        '现在所有可能结果被限制在哪个圈里？',
        'Which event now contains all possible conditional outcomes?',
      ],
      [
        '能把交集概率写成“先条件，再条件内份额”吗？',
        'Can you factor the intersection into the condition and a share within it?',
      ],
    ],
    misconception: [
      '条件概率不是交集概率，也不能随意交换竖线左右；空条件不伪造零概率。',
      'Conditional probability differs from intersection probability and is not freely reversible; an empty condition does not give zero.',
    ],
  },
  {
    title: ['独立性与贝叶斯直觉', 'Independence and Bayes intuition'],
    objective: [
      '用基础占比和正向分流重建反向条件概率，并用乘积判据核独立性。',
      'Reconstruct reverse conditional probability from base rates and forward branches, and check independence with the product criterion.',
    ],
    hook: [
      'A厂更容易被标记，看到标记就一定主要来自A厂吗？',
      'If source A is flagged more often, must most flagged packages originate there?',
    ],
    prerequisites: ['H24-L05', 'J97-L01'],
    keywords: [
      ['基础占比', 'base rate'],
      ['反向条件', 'reverse conditioning'],
      ['独立性', 'independence'],
    ],
    lab: 'counting-bayes',
    hints: [
      [
        '先按来源分，再算各来源被标记的质量；不要把P(F|A)倒读。',
        'Split by source, then count flagged mass from each source; do not read P(F|A) backwards.',
      ],
      [
        'P(A|F)=P(A)P(F|A)/[P(A)P(F|A)+P(Aᶜ)P(F|Aᶜ)]，要求P(F)>0。独立用P(A∩F)=P(A)P(F)。',
        'For P(F)>0, P(A|F)=P(A)P(F|A)/[P(A)P(F|A)+P(Aᶜ)P(F|Aᶜ)]. Independence means P(A∩F)=P(A)P(F).',
      ],
    ],
    items: [
      N(
        [
          '虚构包装模型：A占5%，P(F|A)=80%，P(F|Aᶜ)=10%。求P(A|F)。',
          'Fictional package model: A has base rate 5%, P(F|A)=80%, P(F|Aᶜ)=10%. Find P(A|F).',
        ],
        '8/27',
        [
          '按1000份模型质量：A有50份，其中40标记；其余950中95标记，故40/(40+95)=8/27。',
          'Per 1,000 model units, 50 are A and 40 flagged; of 950 others, 95 flagged. Thus 40/135=8/27.',
        ],
        ['4/5', '1/20', '8/9'],
      ),
      N(
        [
          '保持两标记率80%、10%，只把A基础占比改成50%。求P(A|F)。',
          'Keep flag rates 80%,10%, but change A’s base rate to 50%. Find P(A|F).',
        ],
        '8/9',
        [
          'A的500中400标记，其他500中50标记，400/450=8/9。',
          'Of 500 A units 400 are flagged; of 500 others 50 are flagged: 400/450=8/9.',
        ],
        ['8/27', '4/5', '1/2'],
      ),
      I(
        [
          'A占5%，两来源标记率都20%，A与F独立吗？输入independent或dependent。',
          'A has base rate 5% and both sources flag 20%. Are A and F independent? Enter independent or dependent.',
        ],
        { kind: 'independence', value: 'independent' },
        [
          'P(F)=1/5，P(A∩F)=1/100=P(A)P(F)，且P(A|F)=1/20。',
          'P(F)=1/5 and P(A∩F)=1/100=P(A)P(F); P(A|F)=1/20.',
        ],
        ['dependent', 'disjoint'],
      ),
      U(
        [
          '两来源都从不被标记，P(F)=0。求P(A|F)，未定义输入undefined。',
          'Neither source is ever flagged, so P(F)=0. Give P(A|F), entering undefined if undefined.',
        ],
        [
          '没有标记条件质量，反向条件概率分母为0。独立乘积判据仍可成立。',
          'The flagged condition has zero mass, so reverse conditioning has a zero denominator. The independence product criterion may still hold.',
        ],
      ),
      N(
        [
          'A占5%，A的标记率80%，其他标记率10%。求正向P(F|A)。',
          'A has base rate 5%, flag rate 80%, versus 10% for others. Find the forward P(F|A).',
        ],
        '4/5',
        [
          '正向率是题设80%=4/5，与反向8/27不同。',
          'The forward rate is the given 80%=4/5, distinct from reverse 8/27.',
        ],
        ['8/27', '1/20', '27/200'],
      ),
      E(
        [
          '自拟1000份虚构包装模型，比较A基础占比5%和50%但同样80%/10%标记率。给两个反向概率，再解释何时标记不提供来源信息。',
          'Compare 1,000-unit fictional package models with A base rates 5% and 50%, using the same flag rates 80%/10%. Give both reverse probabilities and explain when the flag conveys no source information.',
        ],
        [
          '5%时A标记40、其他95，反向8/27；50%时400和50，反向8/9。基础占比决定标记群体构成。若两来源标记率都20%，反向仍等原占比，乘积判据成立。零标记时反向未定义，不能用它判断；这些是模型质量而非实际观测。',
          'At 5%, flagged masses are 40 and 95, posterior 8/27; at 50%, 400 and 50 give 8/9. Base rates change the flagged population’s composition. If both flag 20%, the posterior equals the prior and the product criterion holds. With no flags, reverse conditioning is undefined; use the product test. These are model masses, not observations.',
        ],
      ),
    ],
    pick: {
      stem: [
        '非零概率的互斥事件一定独立吗？',
        'Are disjoint events of positive probability necessarily independent?',
      ],
      correct: 0,
      options: [
        [
          '不独立，交集0但概率乘积正',
          'No: the intersection is zero but the product is positive',
        ],
        ['独立，因为不会同时发生', 'Yes, because they never occur together'],
        ['只要名称不同就独立', 'Different event names imply independence'],
      ],
      feedback: [
        [
          '独立要求交集等于乘积；这里不相等。',
          'Independence requires intersection equal to product; here they differ.',
        ],
        [
          '互斥意味着发生一个会排除另一个。',
          'Disjointness means one event occurring excludes the other.',
        ],
        [
          '名字不能决定概率关系。',
          'Names do not determine probability relationships.',
        ],
      ],
    },
    reason: [
      'A不可能发生时，A与F可独立吗？P(F|A)又能否用普通条件比定义？',
      'If A is impossible, can A and F be independent, and can P(F|A) be defined by the ordinary conditional ratio?',
    ],
    rubric: [
      'P(A)=0时P(A∩F)=0=P(A)P(F)，所以按乘积定义独立。但P(F|A)的分母P(A)=0，普通比值未定义。独立的乘积定义覆盖退化事件；“P(F|A)=P(F)”这种条件形式需先有P(A)>0。',
      'If P(A)=0, then P(A∩F)=0=P(A)P(F), so the product definition gives independence. But P(F|A) divides by P(A)=0 and is undefined by the ordinary ratio. The product definition handles degenerate events; the conditional equality requires positive P(A).',
    ],
    prompts: [
      [
        '被标记的模型质量来自两个来源各多少？',
        'How much flagged model mass comes from each source?',
      ],
      [
        '若两来源标记率一样，看到标记还会改变来源占比吗？',
        'If both sources flag at the same rate, does seeing a flag change source proportions?',
      ],
    ],
    misconception: [
      '正向率不能直接倒读；基础占比参与更新，互斥与独立不同，零条件仍未定义。',
      'Forward rates cannot be reversed directly; base rates matter, disjointness differs from independence, and zero conditions remain undefined.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `counting-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(
      id,
      T(item.stem),
      skill,
      item.answer.rubric,
      s.hints.map(T),
    );
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(item.step)],
    { accepted: [value], rejected: item.wrong },
  );
  q.answer = item.answer;
  return q;
}
function pick(id: string, i: number): Question {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `counting-${i + 1}`,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h24Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H24-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H11',
    unit: 'H24',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`counting-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `counting-${i + 1}`,
        T(s.rubric),
        s.hints.map(T),
      ),
    ],
    exit: question(`${id}-X`, i, s.items[5]!),
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
export function h24ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H24-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H24 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 2 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = N(
      k % 2 === 0
        ? [
            `互不重叠两类各${a}和${b}个独特结果，任选一个，共多少？`,
            `Two disjoint categories have ${a} and ${b} distinct outcomes. Choose one outcome: how many?`,
          ]
        : [
            `第一步${a}种，每一种都有${b}个合法后续，完整结果数？`,
            `There are ${a} first choices, each with ${b} legal continuations. How many complete outcomes?`,
          ],
      String(k % 2 === 0 ? a + b : a * b),
      [
        '先核分类还是分步，再按条件计数。',
        'Check alternatives versus stages, then count under the stated rules.',
      ],
      ['-1'],
    );
  else if (i === 1) {
    const n = 4 + (k % 6),
      r = 1 + Math.floor(k / 6);
    item = N(
      [
        `${n}个不同对象无重复填${r}个有区别位置，有几种？`,
        `Fill ${r} labelled positions from ${n} distinct objects without repetition. How many?`,
      ],
      String(permutations(n, r)),
      [
        '逐位置减少一个可用对象。',
        'Reduce the available count by one per position.',
      ],
      ['-1'],
    );
  } else if (i === 2) {
    const n = 5 + (k % 6),
      r = Math.floor(k / 6);
    item = N(
      [
        `${n}位不同成员选${r}人同权组，有几组？`,
        `Choose an equal-role team of ${r} from ${n} distinct members. How many teams?`,
      ],
      String(combinations(n, r)),
      [
        '把有序选法按每组r!个顺序归并。',
        'Merge the r! orders representing each team.',
      ],
      ['-1'],
    );
  } else if (i === 3) {
    const n = 3 + (k % 6),
      j = Math.floor(k / 6);
    item = N(
      [
        `(x−2)^${n}中x^${n - j}的系数？`,
        `Find the coefficient of x^${n - j} in (x−2)^${n}.`,
      ],
      String(binomialCoefficient(n, j, -2)),
      [
        '选j个因子取−2，乘C(n,j)(−2)^j。',
        'Choose j factors for −2, multiplying C(n,j)(−2)^j.',
      ],
      ['-999999'],
    );
  } else if (i === 4) {
    const m = contingency([a, b, 2, 3]);
    item = N(
      [
        `等可能四格AB,A独有,B独有,皆非为${a},${b},2,3。求P(B|A)。`,
        `Equally likely cells AB,A-only,B-only,neither contain ${a},${b},2,3. Find P(B|A).`,
      ],
      textR(m.bGivenA!),
      [
        '在A内，交集数除以A总数。',
        'Within A, divide the intersection count by the A count.',
      ],
      ['-1'],
    );
  } else {
    const prior = 5 * (1 + (k % 6)),
      rate = 20 + 20 * Math.floor(k / 6),
      m = sourceFlagModel(prior, rate, 10);
    item = N(
      [
        `虚构模型A占${prior}%，A标记${rate}%，其他标记10%。求P(A|F)。`,
        `A fictional model has A base rate ${prior}%, flag rate ${rate}% for A and 10% for others. Find P(A|F).`,
      ],
      textR(m.posterior!),
      [
        '分别算两来源标记质量，以全部标记质量为分母。',
        'Compute flagged mass from both sources and divide A’s flagged mass by the total.',
      ],
      ['-1'],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h24CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H24-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H24-CHECK-Q7', 2, specs[2]!.items[5]!),
  question('H24-CHECK-Q8', 5, specs[5]!.items[5]!),
];
