import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  absoluteSolution,
  unionText,
  conditionCases,
  conditionClass,
  operateSets,
  setText,
} from '../logicModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  step: Pair;
  wrong: string[];
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ stem, answer, step, wrong, diagram });
const N = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'number', value }, step, wrong);
const S = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
) => I(stem, { kind: 'finite-set', value }, step, wrong, diagram);
const C = (
  stem: Pair,
  value: Extract<AnswerSpec, { kind: 'logic-code' }>['value'],
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'logic-code', value }, step, wrong);
const R = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
) => I(stem, { kind: 'real-union', value }, step, wrong, diagram);
const E = (stem: Pair, step: Pair) =>
  I(stem, { kind: 'explain', rubric: T(step) }, step, []);
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  objective: Pair;
  lab: Lesson['lab'];
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const skills = [
  'set-elements-boundaries',
  'set-boolean-operations',
  'logic-domain-counterexample',
  'logic-two-directions',
  'absolute-complete-real-set',
];
const hints: Pair[][] = [
  [
    [
      '先分清左边是一个数还是一个集合，再按定义逐个核对。',
      'First decide whether the left object is a number or a set; then check the definition.',
    ],
    [
      '元素不计重复与顺序；∅没有元素，{0}有一个元素；∈连接元素与集合，⊆连接两个集合。',
      'Order and repetition do not change a set. ∅ has no elements; {0} has one. ∈ relates an element to a set; ⊆ relates two sets.',
    ],
  ],
  [
    [
      '先写全集U，判断每个元素在A、B中的身份。',
      'State U and check each element against A and B.',
    ],
    [
      '交集要同时在两者，并集至少在一个；补集只从U中找不在A的元素，差集A∖B只留A中不在B的。',
      'Intersection requires both, union at least one. Complement uses elements of U outside A; A∖B keeps elements of A outside B.',
    ],
  ],
  [
    [
      '先读范围和量词。语句能否有确定真假，与现在是否知道真假不同。',
      'Read the domain and quantifier. Having a definite truth value differs from knowing that value now.',
    ],
    [
      '反例必须在范围内且违反结论；一个反例推翻全称命题。全称的否定用“存在…不满足”。',
      'A counterexample must be admissible and violate the claim. One refutes a universal statement; its negation says there exists a case that fails.',
    ],
  ],
  [
    [
      '问题是“P是Q的什么条件”，先分别查P⇒Q和Q⇒P。',
      'For “what condition is P for Q?”, audit P⇒Q and Q⇒P separately.',
    ],
    [
      'P真Q假反驳充分；P假Q真反驳必要。P的真值集合包含于Q时充分，反向包含时必要。',
      'P true/Q false refutes sufficiency; P false/Q true refutes necessity. P’s truth set inside Q gives sufficiency; reverse containment gives necessity.',
    ],
  ],
  [
    [
      '先核a=0与阈值c的符号；再把距离翻译成内侧或外侧。',
      'Check a=0 and the sign of threshold c; then translate distance into inside or outside.',
    ],
    [
      'c>0时|u|<c等于−c<u<c；|u|>c等于u<−c或u>c。严格端点空心，非严格含端点。',
      'For c>0, |u|<c means −c<u<c; |u|>c means u<−c or u>c. Strict endpoints are open; non-strict ones are included.',
    ],
  ],
];
const specs: Spec[] = [
  {
    title: ['集合与元素', 'Sets and elements'],
    objective: [
      '按明确规则列出集合，区分元素关系、子集关系与空集。',
      'List a set by a definite rule and distinguish membership, subset and the empty set.',
    ],
    lab: 'logic-elements',
    prerequisites: ['J98-L04', 'J73-L01'],
    keywords: [
      ['元素', 'element'],
      ['属于', 'membership'],
      ['空集', 'empty set'],
    ],
    hook: [
      '抽屉记录0、1、1、2，集合里究竟有几个元素？空抽屉与装着0的抽屉一样吗？',
      'A drawer records 0,1,1,2. How many distinct elements are in the set? Is an empty drawer the same as one containing zero?',
    ],
    items: [
      N(
        [
          '原始清单0,1,1,2组成集合A，A有几个不同元素？',
          'The raw list 0,1,1,2 forms set A. How many distinct elements?',
        ],
        '3',
        [
          '去掉重复的1，A={0,1,2}，共3个。',
          'Remove repeated 1: A={0,1,2}, with three elements.',
        ],
        ['4', '2'],
      ),
      S(
        [
          '列出小于7的正偶整数集合。',
          'List the positive even integers below seven.',
        ],
        '{2,4,6}',
        [
          '正、偶、整数、小于7须同时满足；0不是正数。',
          'Positive, even, integer and below seven must all hold; zero is not positive.',
        ],
        ['{0,2,4,6}', '{2,4,6,8}'],
      ),
      C(
        [
          '0与∅：写in/out（属于/不属于）。',
          'For 0 and ∅, enter in/out (membership).',
        ],
        'out',
        ['∅没有任何元素，故0∉∅。', '∅ has no elements, so 0∉∅.'],
        ['in', 'subset'],
      ),
      C(
        [
          '∅与{0,1}：按子集关系写subset/not-subset。',
          'Compare ∅ with {0,1} as sets: subset/not-subset.',
        ],
        'subset',
        [
          '空集没有元素违反包含要求，故∅⊆{0,1}。',
          'No element of ∅ violates containment; hence ∅⊆{0,1}.',
        ],
        ['not-subset', 'in'],
      ),
      N(
        ['集合{0}有几个元素？', 'How many elements does {0} contain?'],
        '1',
        [
          '0是一个数，{0}是含这个数的单元素集合。',
          'Zero is a number; {0} is the singleton containing it.',
        ],
        ['0', '2'],
      ),
      E(
        [
          '纠正“0=∅={0}”，并各写一个∈与⊆的正确例子。',
          'Correct “0=∅={0}” and give one correct membership and one subset example.',
        ],
        [
          '分清数0、无元素集合∅、一个元素集合{0}；例如0∈{0}，∅⊆{0}。此处不混用∈与⊆，理由人工审核。',
          'Distinguish the number 0, the empty set ∅ and singleton {0}; for example 0∈{0} and ∅⊆{0}. Do not interchange ∈ and ⊆; a parent reviews the argument.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪条集合规则明确，不依赖个人喜好？',
        'Which set rule is definite, independent of personal taste?',
      ],
      options: [
        ['好看的数字', 'Beautiful numbers'],
        ['小于6的正整数', 'Positive integers below six'],
        ['很大的数字', 'Very large numbers'],
      ],
      feedback: [
        [
          '“好看”没有给客观标准。',
          '“Beautiful” has no objective criterion here.',
        ],
        [
          '规则可逐一判定，得到{1,2,3,4,5}。',
          'The rule is decidable and gives {1,2,3,4,5}.',
        ],
        ['“很大”没有给数值边界。', '“Very large” has no numerical boundary.'],
      ],
      correct: 1,
    },
    reason: [
      '为什么{1,2,2}与{2,1}表示同一个集合？清单中重复记录会不会改变集合？',
      'Why do {1,2,2} and {2,1} denote the same set? Does repeating a record change it?',
    ],
    rubric: [
      '两者恰好有1与2两个不同元素；顺序和重复不改变集合，但原始数据清单仍可有不同记录次数。',
      'Both contain exactly the distinct elements 1 and 2. Order and repetition do not change a set, though data lists can have different record counts.',
    ],
    misconception: [
      '把无序不重复的集合当作计频清单，或把0当作“没有元素”。',
      'Treating a set as a frequency list, or zero as “no element”.',
    ],
  },
  {
    title: ['交集、并集和补集', 'Intersection, union and complement'],
    objective: [
      '用逐元素身份建立交并补与差集，并明确补集依赖全集。',
      'Construct intersections, unions, complements and differences element by element, stating the universe for complement.',
    ],
    lab: 'logic-operations',
    prerequisites: ['H01-L01', 'J97-L02'],
    keywords: [
      ['交集', 'intersection'],
      ['并集', 'union'],
      ['补集', 'complement'],
    ],
    hook: [
      '音乐组与运动组有重叠。“至少参加一个”会把参加两个的人删掉吗？',
      'Music and sport groups overlap. Does “at least one” exclude people in both?',
    ],
    items: [
      S(
        [
          'U={1,2,3,4,5,6}，A={1,2,4}，B={2,3,4}。求A∩B。',
          'U={1,2,3,4,5,6}, A={1,2,4}, B={2,3,4}. Find A∩B.',
        ],
        '{2,4}',
        [
          '2、4同时属于两集合，交集只留这两个。',
          'Two and four belong to both; intersection keeps exactly these.',
        ],
        ['{1,2,3,4}', '{1,3}'],
        {
          kind: 'logic-sets',
          u: ['1', '2', '3', '4', '5', '6'],
          a: ['1', '2', '4'],
          b: ['2', '3', '4'],
        },
      ),
      S(
        ['A={1,2,4}，B={2,3,4}。求A∪B。', 'A={1,2,4}, B={2,3,4}. Find A∪B.'],
        '{1,2,3,4}',
        [
          '并集含至少在一个集合内的元素，交叠不删也不重复计入。',
          'Union includes elements in at least one set, retaining overlap once.',
        ],
        ['{2,4}', '{1,3}'],
      ),
      S(
        [
          'U={1,2,3,4,5,6}，A={1,2,4}。求U内A的补集。',
          'U={1,2,3,4,5,6}, A={1,2,4}. Find the complement of A in U.',
        ],
        '{3,5,6}',
        ['在U中删去A的1、2、4。', 'Remove A’s 1,2,4 from U.'],
        ['{1,2,4}', '{3,5,6,7}'],
      ),
      S(
        ['A={1,2,4}，B={2,3,4}。求A∖B。', 'A={1,2,4}, B={2,3,4}. Find A∖B.'],
        '{1}',
        [
          '只在A中找不在B的数，保留1。',
          'Look only inside A and retain what is not in B: one.',
        ],
        ['{3}', '{1,3}'],
      ),
      S(
        ['A={1,3}，B={2,4}。求A∩B。', 'A={1,3}, B={2,4}. Find A∩B.'],
        '∅',
        ['无共同元素，写∅，不是{0}。', 'No common element: ∅, not {0}.'],
        ['{0}', '{1,2,3,4}'],
      ),
      S(
        [
          '全集改为U={1,2,3,4,5,6,7,8}，A仍为{1,2,4}。求新的补集。',
          'Change U to {1,2,3,4,5,6,7,8}, keeping A={1,2,4}. Find the new complement.',
        ],
        '{3,5,6,7,8}',
        [
          'A不变但全集扩大，新加入且不在A的7、8进入补集。',
          'A stays fixed but U grows; new elements seven and eight enter the complement.',
        ],
        ['{3,5,6}', '{1,2,4}'],
      ),
    ],
    pick: {
      stem: [
        '集合语句中的“A或B”默认什么意思？',
        'What does “A or B” mean in set language by default?',
      ],
      options: [
        ['只属于一个，不可同时', 'Exactly one, never both'],
        ['同时属于两个', 'Both simultaneously'],
        ['至少属于一个，允许同时', 'At least one, including both'],
      ],
      feedback: [
        [
          '这是“恰好一个”，不是默认并集。',
          'That means exactly one, not the default union.',
        ],
        ['这是交集的“且”。', 'That is intersection: and.'],
        [
          '并集用包含性的或，重叠也保留。',
          'Union uses inclusive or and retains overlap.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '用U={1,…,6}、A={1,2,4}说明为什么“补集不需要全集”不成立。再检验A∩Aᶜ与A∪Aᶜ。',
      'Using U={1,…,6}, A={1,2,4}, explain why complement needs a universe. Check A∩Aᶜ and A∪Aᶜ.',
    ],
    rubric: [
      '补集为{3,5,6}，扩大U到8会加入7、8；同一U下交集∅、并集U。理由须逐元素或分区说明。',
      'Complement is {3,5,6}; expanding U to eight adds seven and eight. With the same U, the intersection is ∅ and union U. Explain by elements or regions.',
    ],
    misconception: [
      '把或误读为不能同时，或把补集当作全体实数中所有剩余数。',
      'Reading or exclusively, or assuming a complement always uses all real numbers.',
    ],
  },
  {
    title: ['命题与反例', 'Statements and counterexamples'],
    objective: [
      '按范围与量词判断命题，用合域反例反驳全称结论，并正确写否定。',
      'Read domains and quantifiers, refute universal claims with admissible counterexamples, and state their negations.',
    ],
    lab: 'logic-statements',
    prerequisites: ['H01-L01', 'J98-L04'],
    keywords: [
      ['命题', 'statement'],
      ['量词', 'quantifier'],
      ['反例', 'counterexample'],
    ],
    hook: [
      '“所有数的平方不小于它自己”试了−2、0、1、2都对，就能宣布证明了吗？',
      '“Every number has square at least itself” works for −2,0,1,2. Have we proved it?',
    ],
    items: [
      C(
        [
          '判断命题“所有实数x都有x²>0”：写true/false。',
          'Classify “For every real x, x²>0”: true/false.',
        ],
        'false',
        [
          'x=0在实数域内，平方0不大于0，是有效反例。',
          'The admissible x=0 has square zero, not greater than zero: a counterexample.',
        ],
        ['true', 'not-statement'],
      ),
      N(
        [
          '考察实数命题x²≥x，候选x=1/2的平方是多少？',
          'For the real claim x²≥x, what is the square of candidate x=1/2?',
        ],
        '1/4',
        [
          '(1/2)²=1/4<1/2，所以它反驳实数全称命题。',
          '(1/2)²=1/4<1/2, so it refutes the real universal claim.',
        ],
        ['1/2', '1'],
      ),
      C(
        [
          '“请画一个圆”是真命题、假命题还是非命题？写true/false/not-statement。',
          'Is “Please draw a circle” true, false or not-statement?',
        ],
        'not-statement',
        [
          '这是请求，没有真假值；与“不知道一个陈述的真假”不同。',
          'It is a request with no truth value; this differs from not knowing a statement’s truth.',
        ],
        ['true', 'false'],
      ),
      C(
        [
          '判断“所有整数n都有n²≥n”：true/false。',
          'Classify “For every integer n, n²≥n”: true/false.',
        ],
        'true',
        [
          '整数n≤0或n≥1，n(n−1)≥0；1/2不在整数域，不能反驳。',
          'An integer n has n≤0 or n≥1, giving n(n−1)≥0. Half is outside the integer domain.',
        ],
        ['false', 'not-statement'],
      ),
      C(
        [
          '判断“存在整数n使n²=2”：true/false。',
          'Classify “There exists an integer n with n²=2”: true/false.',
        ],
        'false',
        [
          '|n|≤1给平方≤1；|n|≥2给平方≥4，因此没有整数平方为2。',
          'If |n|≤1 its square is at most one; if |n|≥2 its square is at least four. None equals two.',
        ],
        ['true', 'not-statement'],
      ),
      E(
        [
          '写“所有整数都是偶数”的否定，并给一个见证。为什么不是“所有整数都是奇数”？',
          'Negate “Every integer is even” and give a witness. Why is “Every integer is odd” not its negation?',
        ],
        [
          '否定为“存在一个整数不是偶数”，如1。只需一个失败，不要求全部失败；0为偶数还反驳“所有都奇”。',
          'Negation: there exists an integer that is not even, for example one. One failure suffices; not every case must fail. Zero also refutes “all are odd”.',
        ],
      ),
    ],
    pick: {
      stem: [
        '怎样推翻“每个实数x都满足x²≥x”？',
        'How can “Every real x satisfies x²≥x” be refuted?',
      ],
      options: [
        ['取x=1/2，平方1/4<1/2', 'Use x=1/2, whose square 1/4<1/2'],
        ['列100个符合例', 'List 100 confirming cases'],
        ['说“我还没证明”', 'Say “I have not proved it”'],
      ],
      feedback: [
        [
          '一个合域且违反结论的反例就足够。',
          'One admissible counterexample suffices.',
        ],
        [
          '有限符合例不证明或推翻无限全称命题。',
          'Finitely many confirmations do not prove or refute this infinite universal claim.',
        ],
        [
          '未证明不等于假，仍需反例或论证。',
          'Unproved does not mean false; evidence is required.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '同一句“x²≥x对所有x成立”，把范围从整数改成实数后真假为什么改变？同时说明怎样否定“存在整数n使n²=2”。',
      'Why does “x²≥x for every x” change truth when integers become reals? Also negate “There exists an integer n with n²=2”.',
    ],
    rubric: [
      '整数用n(n−1)与无整数在(0,1)证明；实数1/2反例。存在命题的否定是“所有整数n都有n²≠2”，不是“存在n使不等于2”。',
      'For integers use n(n−1) and the absence of integers in (0,1); for reals use half. Negating existence gives “Every integer n has n²≠2”, not merely one unequal case.',
    ],
    misconception: [
      '把几个成功例当证明、域外数当反例，或将“所有都”否定成“所有都不”。',
      'Treating examples as proof, using inadmissible counterexamples, or negating all as all-not.',
    ],
  },
  {
    title: ['充分条件与必要条件', 'Sufficient and necessary conditions'],
    objective: [
      '用两个方向和真值集合包含关系判断充分、必要、充要或两者皆非。',
      'Classify sufficient, necessary, both or neither using two implications and containment of truth sets.',
    ],
    lab: 'logic-conditions',
    prerequisites: ['H01-L02', 'H01-L03'],
    keywords: [
      ['充分条件', 'sufficient condition'],
      ['必要条件', 'necessary condition'],
      ['充要条件', 'necessary and sufficient'],
    ],
    hook: [
      'x=2就有x²=4；反过来一定吗？箭头倒过来，条件名字会怎样变？',
      'x=2 gives x²=4. Does the reverse always hold? How does reversing the arrow change the condition?',
    ],
    items: [
      C(
        [
          '实数x，P:x=2，Q:x²=4。P是Q的什么条件？写sufficient-only/necessary-only/both/neither。',
          'Real x, P:x=2, Q:x²=4. What condition is P for Q? Enter sufficient-only/necessary-only/both/neither.',
        ],
        'sufficient-only',
        [
          'P⇒Q成立；Q⇒P被x=−2反驳，故充分不必要。',
          'P⇒Q holds; x=−2 refutes Q⇒P. Sufficient but not necessary.',
        ],
        ['necessary-only', 'both'],
      ),
      C(
        [
          '实数x，P:x²=4，Q:x=2。P是Q的什么条件？',
          'Real x, P:x²=4, Q:x=2. What condition is P for Q?',
        ],
        'necessary-only',
        [
          'Q⇒P成立，但P⇒Q被−2反驳；P对Q必要不充分。',
          'Q⇒P holds, but −2 refutes P⇒Q. P is necessary but not sufficient for Q.',
        ],
        ['sufficient-only', 'both'],
      ),
      C(
        [
          '实数x，P:|x|=2，Q:x²=4。P是Q的什么条件？',
          'Real x, P:|x|=2, Q:x²=4. What condition is P for Q?',
        ],
        'both',
        [
          '两者真值集合都是{−2,2}，双向都成立。',
          'Both truth sets are {−2,2}; both directions hold.',
        ],
        ['sufficient-only', 'neither'],
      ),
      C(
        [
          '实数x，P:x∈{1,2}，Q:x∈{2,3}。P是Q的什么条件？',
          'Real x, P:x∈{1,2}, Q:x∈{2,3}. What condition is P for Q?',
        ],
        'neither',
        [
          'x=1反驳P⇒Q；x=3反驳Q⇒P。交叠2不等于双向包含。',
          'One refutes P⇒Q; three refutes Q⇒P. Overlap at two is not mutual containment.',
        ],
        ['both', 'sufficient-only'],
      ),
      N(
        [
          '实数x，用一个数反驳“x²=4必有x=2”。',
          'Give a number refuting “x²=4 implies x=2” over the reals.',
        ],
        '-2',
        [
          '(−2)²=4，前提真，但−2≠2，结论假。',
          '(−2)²=4 makes the premise true while −2≠2 makes the conclusion false.',
        ],
        ['2', '0'],
      ),
      E(
        [
          '实数范围P:x²=−1，Q:x=0。解释为什么P⇒Q没有反例，却不能说Q⇒P。',
          'Over the reals P:x²=−1, Q:x=0. Explain why P⇒Q has no counterexample but Q⇒P fails.',
        ],
        [
          'P真值集合为空，包含于Q的{0}；不存在P真Q假的数，因此P⇒Q为真。x=0使Q真P假，反向假；这是充分不必要，不表示x²=−1有实根。',
          'P has empty truth set, contained in Q’s {0}. No real makes P true and Q false, so P⇒Q is true. Zero makes Q true/P false, refuting the reverse. This is sufficient-only, not evidence of a real root of x²=−1.',
        ],
      ),
    ],
    pick: {
      stem: [
        '若P⇒Q成立，“P是Q的充分条件”对应哪种集合关系？',
        'If P⇒Q, “P is sufficient for Q” corresponds to which relation?',
      ],
      options: [
        ['P真值集合⊆Q真值集合', 'Truth set of P ⊆ truth set of Q'],
        ['Q真值集合⊆P真值集合', 'Truth set of Q ⊆ truth set of P'],
        ['两个集合有交叠就够', 'Any overlap suffices'],
      ],
      feedback: [
        [
          'P成立的每个对象都必须使Q成立。',
          'Every object satisfying P must satisfy Q.',
        ],
        ['这是Q⇒P，表示P对Q必要。', 'That is Q⇒P, making P necessary for Q.'],
        [
          '交叠只证明有共同真例，不能保证推出。',
          'Overlap supplies a shared true case, not an implication.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '用P:x=2、Q:x²=4说明“充分条件”与“必要条件”为什么不能凭中文词感猜，给两个方向及反例。',
      'Using P:x=2 and Q:x²=4, explain sufficiency and necessity with both arrows and a counterexample.',
    ],
    rubric: [
      'P⇒Q真，Q⇒P在−2失败；P对Q充分不必要，Q对P必要不充分；必须明确“谁对谁”。',
      'P⇒Q is true; Q⇒P fails at −2. P is sufficient-only for Q, whereas Q is necessary-only for P. State the orientation explicitly.',
    ],
    misconception: [
      '只检查一个箭头，或有共同例就误判充要。',
      'Checking only one arrow, or mistaking a shared example for equivalence.',
    ],
  },
  {
    title: ['绝对值不等式', 'Absolute-value inequalities'],
    objective: [
      '把绝对值解释为距离，写出含正确端点的完整实数解集，并处理退化情况。',
      'Interpret absolute value as distance and give complete real solution sets with correct endpoints and degenerate cases.',
    ],
    lab: 'logic-absolute',
    prerequisites: ['H01-L02', 'J84-L05', 'J73-L01'],
    keywords: [
      ['距离', 'distance'],
      ['区间', 'interval'],
      ['并集解', 'union of solutions'],
    ],
    hook: [
      '距2不到3的点挤在中间；距2超过3的点为什么分成两边？',
      'Points less than three units from two lie inside. Why do points farther than three units split into two sides?',
    ],
    items: [
      R(
        ['实数x，解|x−2|<3。', 'For real x, solve |x−2|<3.'],
        '-1<x<5',
        [
          '−3<x−2<3，两端同时加2，得−1<x<5，端点不含。',
          '−3<x−2<3; add two to all three parts: −1<x<5, excluding endpoints.',
        ],
        ['-1<=x<=5', 'x<-1 or x>5'],
        { kind: 'logic-absolute', a: '1', b: '-2', c: '3', sign: '<' },
      ),
      R(
        ['实数x，解|x−2|≥3。', 'For real x, solve |x−2|≥3.'],
        'x<=-1 or x>=5',
        [
          'x−2≤−3或x−2≥3，得两条含端点射线。',
          'x−2≤−3 or x−2≥3 gives two rays including endpoints.',
        ],
        ['-1<=x<=5', 'x<-1 or x>5'],
      ),
      R(
        ['实数x，解|2x−1|≤3。', 'For real x, solve |2x−1|≤3.'],
        '-1<=x<=2',
        [
          '−3≤2x−1≤3，加1再除正数2，得−1≤x≤2。',
          '−3≤2x−1≤3; add one then divide by positive two: −1≤x≤2.',
        ],
        ['-2<=x<=4', '-1<x<2'],
      ),
      R(
        ['实数x，解|x+1|<−2。', 'For real x, solve |x+1|<−2.'],
        '∅',
        [
          '绝对值≥0，不能小于负数，解集为空。',
          'Absolute value is nonnegative and cannot be below a negative number: empty set.',
        ],
        ['ℝ', 'x<-3'],
      ),
      R(
        ['实数x，解|0x+2|≤2。', 'For real x, solve |0x+2|≤2.'],
        'ℝ',
        [
          '原式恒为2≤2，所有实数都满足；不可除以零系数。',
          'The original is always 2≤2, so every real works. Never divide by the zero coefficient.',
        ],
        ['∅', '{0}'],
      ),
      R(
        ['实数x，解|x+1|>0。', 'For real x, solve |x+1|>0.'],
        'x<-1 or x>-1',
        [
          '绝对值仅在x=−1时为0，其余实数满足；两侧开端点，不可漏负侧。',
          'Absolute value is zero only at x=−1; every other real works. Both rays exclude that point.',
        ],
        ['ℝ', 'x>-1'],
      ),
    ],
    pick: {
      stem: [
        '当c>0时，|u|>c应译为哪句？',
        'For c>0, how should |u|>c be translated?',
      ],
      options: [
        ['−c<u<c', '−c<u<c'],
        ['u<−c或u>c', 'u<−c or u>c'],
        ['u<−c且u>c', 'u<−c and u>c'],
      ],
      feedback: [
        [
          '这是距离小于c的内侧。',
          'That is the inner region for distance less than c.',
        ],
        [
          '外侧分两段，使用或与并集。',
          'The outside has two parts, using or and union.',
        ],
        [
          '两条件不能同时成立，会误得空集。',
          'These cannot both hold; and would incorrectly give no solutions.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较|x−2|<3与|x−2|≥3，用交集/并集解释，代回−1、2、5核验，说明c=0或c<0时不能只背口诀。',
      'Compare |x−2|<3 with |x−2|≥3 using intersection/union. Audit −1,2,5 and explain why c=0 or c<0 needs separate thought.',
    ],
    rubric: [
      '内侧−1<x<5是且，外侧x≤−1或x≥5是或；−1与5距离3，2距离0。非负性处理负c；c=0时≤只留零点，≥为全体，>排除零点，<为空。',
      'The inside −1<x<5 uses and; the outside x≤−1 or x≥5 uses or. Endpoints have distance three and center two distance zero. Use nonnegativity for negative c. At c=0, ≤ keeps the zero set, ≥ is all reals, > excludes zeroes and < is empty.',
    ],
    misconception: [
      '把大于翻成且、漏一侧、漏端点，或在a=0时仍除以a。',
      'Using and for the outside, losing a side or endpoint, or dividing by a when a=0.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  if (v.answer.kind === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      v.answer.rubric,
      hints[i]!.map(T),
    );
  const value = 'value' in v.answer ? String(v.answer.value) : '';
  const result = numeric(
    id,
    T(v.stem),
    value,
    skills[i]!,
    hints[i]!.map(T),
    [T(v.step)],
    { accepted: [value], rejected: v.wrong },
    v.diagram,
  );
  result.answer = v.answer;
  return result;
}
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h01Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H01-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'H10',
    unit: 'H01',
    order: i + 1,
    nzYearHints: [10, 11, 12],
    cnGradeHints: [10],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
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
      prompts: [
        t(
          '左边是什么对象？范围、全集和量词分别是什么？',
          'What kind of object is on the left? What are the domain, universe and quantifier?',
        ),
        t(
          '两个方向都核过吗？端点或一个反例能改变结论吗？',
          'Have you checked both directions? Could an endpoint or counterexample change the conclusion?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
  };
});
export function h01ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H01-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H01 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let v: Item;
  if (i === 0) {
    const n = 1 + (k % 8);
    v = S(
      [
        `列出0到${n}（含两端）中的偶整数。`,
        `List even integers from zero through ${n}, inclusive.`,
      ],
      setText(
        Array.from({ length: Math.floor(n / 2) + 1 }, (_, j) => String(2 * j)),
      ),
      [
        '含0，逐个检查偶数与上界。',
        'Include zero; audit parity and the upper bound.',
      ],
      ['∅', '{99}'],
    );
  } else if (i === 1) {
    const u = Array.from({ length: 5 + (k % 4) }, (_, j) => String(j)),
      a = u.filter((x) => Number(x) % 2 === 0),
      b = u.filter((x) => Number(x) % 3 === 0),
      op = (['intersection', 'union', 'complement', 'difference'] as const)[
        k % 4
      ]!;
    v = S(
      [
        `U=${setText(u)}，A=${setText(a)}，B=${setText(b)}。求${['A∩B', 'A∪B', 'U内A补集', 'A∖B'][k % 4]}。`,
        `U=${setText(u)}, A=${setText(a)}, B=${setText(b)}. Find ${['A∩B', 'A∪B', 'complement of A in U', 'A∖B'][k % 4]}.`,
      ],
      setText(operateSets(u, a, b, op)),
      [
        '按每个元素的身份与所求运算筛选。',
        'Filter each element by membership and the requested operation.',
      ],
      ['{99}', '{100}'],
    );
  } else if (i === 2) {
    const integer = k % 2 === 0;
    v = C(
      [
        `判断“所有${integer ? '整数' : '实数'}x都有x²≥x”：true/false。`,
        `Classify “Every ${integer ? 'integer' : 'real'} x satisfies x²≥x”: true/false.`,
      ],
      integer ? 'true' : 'false',
      integer
        ? [
            '整数没有在(0,1)中的值，x(x−1)≥0。',
            'No integer is in (0,1), so x(x−1)≥0.',
          ]
        : [
            '实数1/2给平方1/4<1/2，反例成立。',
            'The real half gives square one quarter, less than half.',
          ],
      [integer ? 'false' : 'true', 'not-statement'],
    );
  } else if (i === 3) {
    const c = conditionCases[k % conditionCases.length]!;
    v = C(
      [`${c.zh}。P是Q的什么条件？`, `${c.en}. What condition is P for Q?`],
      conditionClass(c.p, c.q),
      [
        '分别检查P真值集合⊆Q及Q⊆P，不能只看交叠。',
        'Check containment in each direction, not overlap alone.',
      ],
      ['true', 'false'],
    );
  } else {
    const a = String((k % 7) - 3),
      b = String((Math.floor(k / 7) % 7) - 3),
      c = String((Math.floor(k / 11) % 6) - 1),
      sign = (['<', '<=', '>', '>='] as const)[k % 4]!;
    v = R(
      [
        `实数x，解|(${a})x+(${b})|${sign}${c}。`,
        `For real x, solve |(${a})x+(${b})|${sign}${c}.`,
      ],
      unionText(absoluteSolution(a, b, c, sign)),
      [
        '先查零系数与阈值，再按且/或解精确边界；合并真正相接的区间。',
        'Check zero coefficient and threshold; solve exact bounds with and/or, merging intervals only when their union has no gap.',
      ],
      ['x=99', 'x=100'],
    );
  }
  return q(`${id}-R${round}`, i, v);
}
export const h01CheckQuestions: Question[] = [
  q('H01-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('H01-CHECK-Q2', 1, specs[1]!.items[0]!),
  q('H01-CHECK-Q3', 2, specs[2]!.items[0]!),
  q('H01-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('H01-CHECK-Q5', 4, specs[4]!.items[2]!),
  reasoning(
    'H01-CHECK-Q6',
    T(specs[2]!.reason),
    skills[2]!,
    T(specs[2]!.rubric),
    hints[2]!.map(T),
  ),
  pick('H01-CHECK-Q7', 4, specs[4]!.pick),
  q('H01-CHECK-Q8', 3, specs[3]!.items[5]!),
];
