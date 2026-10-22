import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
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
    title: ['数学归纳法', 'Mathematical induction'],
    objective: [
      '用基例与任意k的传递步骤，证明所有整数n≥1的奇数和公式。',
      'Prove the odd-number sum for every integer n≥1 using a base case and an arbitrary-k implication.',
    ],
    hook: [
      '验证一百万项之后，第1000001项就一定成立吗？',
      'After a million successful checks, must case 1000001 hold?',
    ],
    prerequisites: ['H01-L03', 'H01-L04', 'H07-L03'],
    keywords: [
      ['基例', 'base case'],
      ['归纳假设', 'induction hypothesis'],
      ['传递步骤', 'inductive step'],
    ],
    lab: 'extension-induction',
    hints: [
      [
        '先写清P(n)与整数范围，再检查最小n。',
        'State P(n) and its integer domain, then check the smallest n.',
      ],
      [
        '暂设P(k)真，加上第k+1项；目标必须是P(k+1)，不是又验证一个数。',
        'Assume P(k), add term k+1 and derive P(k+1), rather than checking another number.',
      ],
    ],
    items: [
      {
        stem: [
          '用归纳证明1+3+…+(2n−1)=n²。从k=4走到k+1时新增哪一个奇数？',
          'In induction for 1+3+…+(2n−1)=n², which odd number is added when k=4 advances to k+1?',
        ],
        answer: {
          kind: 'number',
          value: '9',
        },
        step: [
          '第k+1项为2(k+1)−1=2k+1，代k4得9。',
          'Term k+1 is 2(k+1)−1=2k+1, giving 9 at k=4.',
        ],
        wrong: ['7', '25'],
      },
      {
        stem: [
          '求前6个正奇数之和。',
          'Find the sum of the first six positive odd numbers.',
        ],
        answer: {
          kind: 'number',
          value: '36',
        },
        step: [
          '1+3+5+7+9+11=36=6²；这只是一个核验实例。',
          '1+3+5+7+9+11=36=6²; this is one check, not the general proof.',
        ],
        wrong: ['12', '35'],
      },
      {
        stem: [
          '暂设前k项和为k²，加入第k+1项后得到什么关于k的多项式？只写表达式。',
          'Assuming the first k terms sum to k², give the polynomial in k after adding term k+1. Enter only the expression.',
        ],
        answer: {
          kind: 'polynomial',
          value: 'k^2+2*k+1',
          variables: ['k'],
        },
        step: ['k²+(2k+1)=k²+2k+1=(k+1)²。', 'k²+(2k+1)=k²+2k+1=(k+1)².'],
        wrong: ['k^2+1', 'k^2+2*k'],
      },
      {
        stem: [
          '声称奇数和=n²+1，任意k的传递代数成立，但n=1失败。这个材料证明所有n≥1吗？填true/false。',
          'The claim odd sum=n²+1 propagates algebraically, but fails at n=1. Does this evidence prove every n≥1? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          '基例为1=2不成立；真蕴含不能制造真起点。',
          'The base says 1=2, which is false; a valid implication cannot supply a true starting case.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '错误命题1+3+…+(2n−1)=n在n=1成立。最小失败的正整数n是多少？',
          'The false claim 1+3+…+(2n−1)=n holds at n=1. What is its smallest failing positive integer n?',
        ],
        answer: {
          kind: 'number',
          value: '2',
        },
        step: [
          'n2时左边4，右边2。一个真基例不保证传递。',
          'At n=2 the left side is 4 and the right side 2. One true base does not establish propagation.',
        ],
        wrong: ['1', '3'],
      },
      {
        stem: [
          '完整证明奇数和公式，并解释只有传递、只有基例、有限检查为什么各自不够。',
          'Prove the odd-sum identity and explain why propagation only, a base only and finite checking each fall short.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '定义P(n)为前n正奇数和=n²，范围整数n≥1。n1左1右1。任取k≥1，假设P(k)，第k+1项为2k+1，和=k²+2k+1=(k+1)²，故P(k)⇒P(k+1)。基例与任意k传递共同覆盖全体。n²+1虽可传递却基例假，和=n虽基例真却n2失败；有限检查没有对任意k的推导。',
            en: 'Define P(n) as the first n positive odd numbers summing to n² for integers n≥1. At n=1 both sides are one. For arbitrary k≥1 assume P(k); add 2k+1 to obtain k²+2k+1=(k+1)². Thus P(k) implies P(k+1). Base and propagation together cover all cases. The n²+1 claim propagates but has a false base; sum=n has a true base but fails at two. Finite checks do not establish the arbitrary-k implication.',
          },
        },
        step: [
          '定义P(n)为前n正奇数和=n²，范围整数n≥1。n1左1右1。任取k≥1，假设P(k)，第k+1项为2k+1，和=k²+2k+1=(k+1)²，故P(k)⇒P(k+1)。基例与任意k传递共同覆盖全体。n²+1虽可传递却基例假，和=n虽基例真却n2失败；有限检查没有对任意k的推导。',
          'Define P(n) as the first n positive odd numbers summing to n² for integers n≥1. At n=1 both sides are one. For arbitrary k≥1 assume P(k); add 2k+1 to obtain k²+2k+1=(k+1)². Thus P(k) implies P(k+1). Base and propagation together cover all cases. The n²+1 claim propagates but has a false base; sum=n has a true base but fails at two. Finite checks do not establish the arbitrary-k implication.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '归纳证明中哪一项足以配合真基例？',
        'Which evidence completes an induction with a true base?',
      ],
      correct: 1,
      options: [
        ['再验100项', 'Check 100 more cases'],
        ['任意k≥1时P(k)⇒P(k+1)', 'P(k) implies P(k+1) for arbitrary k≥1'],
        ['画一段上升曲线', 'Draw an increasing curve'],
      ],
      feedback: [
        [
          '有限项不能覆盖所有整数。',
          'Finitely many checks do not cover every integer.',
        ],
        [
          '基例启动，任意k的步骤持续传递。',
          'The base starts the chain and the arbitrary-k step propagates it.',
        ],
        [
          '图形不是任意k的代数论证。',
          'A picture does not supply an arbitrary-k argument.',
        ],
      ],
    },
    reason: [
      '为什么假设P(k)不是循环论证？',
      'Why is assuming P(k) not circular?',
    ],
    rubric: [
      '只在证明条件句时暂设P(k)，目标是推出下一项；没有直接假设对所有n成立。随后由真基例启动，任意k蕴含反复覆盖每个有限整数。若只重写P(k+1)为“显然”，或把要证全称命题作前提，则未完成证明。',
      'P(k) is assumed locally to prove a conditional implication, not the universal statement. A true base then starts the chain, and the arbitrary-k implication reaches every finite integer. Calling P(k+1) obvious or assuming the universal conclusion leaves the proof unfinished.',
    ],
    prompts: [
      [
        '你的第一块骨牌真的倒了吗？',
        'Is the first domino actually established?',
      ],
      ['哪一步对任意k成立？', 'Which step works for arbitrary k?'],
    ],
    misconception: [
      '有限核验不是归纳；步骤要用第k+1项而非第k项。',
      'Finite checking is not induction; add term k+1, not term k.',
    ],
  },
  {
    title: ['简单递推关系', 'Simple recurrence relations'],
    objective: [
      '从明确初值和递推规则唯一生成离散项，并核对从n=0开始的索引。',
      'Generate discrete terms from a stated recurrence and sufficient initial values, checking indexing from n=0.',
    ],
    hook: [
      '同一个递推规则，少一个初值还会只有一条数列吗？',
      'Does the same recurrence still give one sequence when an initial value is missing?',
    ],
    prerequisites: ['H07-L01', 'H07-L04', 'H37-L01'],
    keywords: [
      ['初始条件', 'initial conditions'],
      ['递推阶数', 'recurrence order'],
      ['平移化简', 'shift of sequence'],
    ],
    lab: 'extension-recurrence',
    hints: [
      [
        '先写u(0)和需要的第二个初值；数清更新几次才到u(n)。',
        'Write u(0) and any second seed; count updates needed to reach u(n).',
      ],
      [
        '一次规则逐项代入；二阶相加需要前两项。p=1时直接累加，不能除p−1。',
        'Substitute term by term; a second-order addition rule needs two earlier terms. At p=1 add directly instead of dividing by p−1.',
      ],
    ],
    items: [
      {
        stem: [
          'u(0)=1，u(n+1)=2u(n)+1，求u(4)。',
          'For u(0)=1 and u(n+1)=2u(n)+1, find u(4).',
        ],
        answer: {
          kind: 'number',
          value: '31',
        },
        step: [
          '索引0到4：1,3,7,15,31，共四次更新。',
          'Indices zero to four give 1,3,7,15,31: four updates.',
        ],
        wrong: ['15', '63'],
      },
      {
        stem: [
          '仍取u(0)=1、u(n+1)=2u(n)+1，求u(0)。',
          'With u(0)=1 and u(n+1)=2u(n)+1, find u(0).',
        ],
        answer: {
          kind: 'number',
          value: '1',
        },
        step: [
          '初值直接给出，不应额外做一次更新。',
          'The seed is already given; no update is needed.',
        ],
        wrong: ['3', '0'],
      },
      {
        stem: [
          'u(0)=3，u(n+1)=u(n)+2，求u(5)。',
          'For u(0)=3 and u(n+1)=u(n)+2, find u(5).',
        ],
        answer: {
          kind: 'number',
          value: '13',
        },
        step: [
          'p1为等差：3+5×2=13。',
          'At multiplier one this is arithmetic: 3+5×2=13.',
        ],
        wrong: ['11', '15'],
      },
      {
        stem: [
          'u(0)=0、u(1)=1、u(n+2)=u(n+1)+u(n)，求u(6)。',
          'For u(0)=0, u(1)=1 and u(n+2)=u(n+1)+u(n), find u(6).',
        ],
        answer: {
          kind: 'number',
          value: '8',
        },
        step: [
          '0,1,1,2,3,5,8，两个初值后逐项相加。',
          'The terms are 0,1,1,2,3,5,8, using both seeds.',
        ],
        wrong: ['5', '13'],
      },
      {
        stem: [
          '仅知u(0)=0和u(n+2)=u(n+1)+u(n)，未给u(1)。u(4)能唯一确定吗？不能则填insufficient。',
          'Only u(0)=0 and u(n+2)=u(n+1)+u(n) are given; u(1) is unspecified. Is u(4) unique? If not, enter insufficient.',
        ],
        answer: {
          kind: 'sequence-code',
          value: 'insufficient',
        },
        step: [
          '设u1=t，则u2=t、u3=2t、u4=3t，随t变化。',
          'Writing u(1)=t gives u(2)=t, u(3)=2t and u(4)=3t, which varies with t.',
        ],
        wrong: ['0', '3', 'inconsistent'],
      },
      {
        stem: [
          '给出u(n+1)=2u(n)+1、u(0)=1的通项并归纳核验；用两个不同的第二初值说明二阶递推为何不唯一。',
          'Derive and verify the nth term for u(n+1)=2u(n)+1, u(0)=1; use two different second seeds to show why a second-order recurrence can be non-unique.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '令v(n)=u(n)+1，v(n+1)=2v(n)，v0=2，故u(n)=2^(n+1)−1。n0给1；若u(k)=2^(k+1)−1，则下一项2u(k)+1=2^(k+2)−1。二阶相加若仅给u0=0，u1=1产生0,1,1,2,3，u1=2产生0,2,2,4,6，两者满足同规则但u4不同；不是无解而是资料不足。',
            en: 'Set v(n)=u(n)+1, so v(n+1)=2v(n) and v(0)=2; hence u(n)=2^(n+1)−1. At zero it gives one. Assuming the expression at k, 2u(k)+1=2^(k+2)−1 proves the next case. With only u(0)=0 in the second-order addition rule, seeds u(1)=1 and u(1)=2 give 0,1,1,2,3 and 0,2,2,4,6. Both satisfy the rule but disagree at u(4): insufficient information, not no solution.',
          },
        },
        step: [
          '令v(n)=u(n)+1，v(n+1)=2v(n)，v0=2，故u(n)=2^(n+1)−1。n0给1；若u(k)=2^(k+1)−1，则下一项2u(k)+1=2^(k+2)−1。二阶相加若仅给u0=0，u1=1产生0,1,1,2,3，u1=2产生0,2,2,4,6，两者满足同规则但u4不同；不是无解而是资料不足。',
          'Set v(n)=u(n)+1, so v(n+1)=2v(n) and v(0)=2; hence u(n)=2^(n+1)−1. At zero it gives one. Assuming the expression at k, 2u(k)+1=2^(k+2)−1 proves the next case. With only u(0)=0 in the second-order addition rule, seeds u(1)=1 and u(1)=2 give 0,1,1,2,3 and 0,2,2,4,6. Both satisfy the rule but disagree at u(4): insufficient information, not no solution.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '二阶相加递推只给u(0)，应怎样判断？',
        'For second-order addition with only u(0), what follows?',
      ],
      correct: 2,
      options: [
        ['自动取u(1)=1', 'Automatically take u(1)=1'],
        ['一定无解', 'There is necessarily no solution'],
        [
          '通常有多条数列，要补第二初值',
          'Usually multiple sequences; supply a second seed',
        ],
      ],
      feedback: [
        ['不能擅自补条件。', 'Do not invent a seed.'],
        ['可选不同种子生成解。', 'Different seeds generate valid solutions.'],
        [
          '规则和足够初值共同确定数列。',
          'The rule and sufficient initial data jointly determine the sequence.',
        ],
      ],
    },
    reason: [
      '知道前五项，为什么还需要声明递推规则？',
      'Why state a recurrence when the first five terms are known?',
    ],
    rubric: [
      '有限前缀可以由许多不同规则延伸，不能仅由样本强行推出唯一第六项。声明规则及足够初值后，逐项计算才有唯一依据；通项是候选，要核初值和原递推。零索引与一索引必须保持一致。',
      'Many different rules extend a finite prefix, so the sixth term is not forced by examples alone. A declared rule and sufficient seeds give a unique stepwise construction. Verify a proposed nth term against the initial data and the original recurrence, keeping zero-based and one-based indices distinct.',
    ],
    prompts: [
      ['到u(4)到底更新了几次？', 'How many updates reach u(4)?'],
      [
        '第二个初值换掉，哪一项先变？',
        'Which term first changes when the second seed changes?',
      ],
    ],
    misconception: [
      '递推不是猜样本；初值数量与阶数、索引起点要一致。',
      'A recurrence is not pattern guessing; match the seeds, order and starting index.',
    ],
  },
  {
    title: ['图论与最短路径', 'Graphs and shortest paths'],
    objective: [
      '用非负带权图的暂定距离与松弛，找出并核验一条最短路径。',
      'Find and verify a shortest route by tentative distances and relaxation in a nonnegative weighted graph.',
    ],
    hook: [
      '每一步都选眼前最便宜的边，最终路线一定最便宜吗？',
      'Does choosing the cheapest immediate edge always give the cheapest whole route?',
    ],
    prerequisites: ['H01-L04', 'H01-L02'],
    keywords: [
      ['带权图', 'weighted graph'],
      ['松弛', 'relaxation'],
      ['暂定距离', 'tentative distance'],
    ],
    lab: 'extension-graphs',
    hints: [
      [
        '先核顶点、方向和真实存在的边，再把沿途权重相加。',
        'Check vertices, directions and existing edges, then add their weights.',
      ],
      [
        '选全局未确定距离的最小者，再更新邻点；不可达与并列最优都要保留。',
        'Settle the globally smallest unsettled distance, then relax neighbours; retain unreachable and tied cases.',
      ],
    ],
    items: [
      {
        stem: [
          '无向边AB2、AC5、BC1、BD5、CD1、DE2、CE7。写A到E的一条最短简单路径，用A-B-…格式。',
          'Undirected edges are AB2, AC5, BC1, BD5, CD1, DE2, CE7. Give one shortest simple A-to-E route as A-B-….',
        ],
        answer: {
          kind: 'graph-route',
          value: 'A-B-C-D-E',
          graph: {
            nodes: ['A', 'B', 'C', 'D', 'E'],
            edges: [
              ['A', 'B', 2],
              ['A', 'C', 5],
              ['B', 'C', 1],
              ['B', 'D', 5],
              ['C', 'D', 1],
              ['D', 'E', 2],
              ['C', 'E', 7],
            ],
            directed: false,
            start: 'A',
            goal: 'E',
          },
        },
        step: [
          '2+1+1+2=6；每轮更新暂定距离，而非数边数。',
          '2+1+1+2=6; update tentative distances rather than counting edges.',
        ],
        wrong: ['A-C-E', 'A-B-D-E', 'A-E'],
      },
      {
        stem: [
          '上题同一网络中，A到E的最短总成本是多少？',
          'In the same network, what is the minimum total A-to-E cost?',
        ],
        answer: {
          kind: 'number',
          value: '6',
        },
        step: [
          'A-B-C-D-E成本6，少边的A-C-E反而为12。',
          'A-B-C-D-E costs 6, while the fewer-edge route A-C-E costs 12.',
        ],
        wrong: ['4', '12'],
      },
      {
        stem: [
          '无向边AB1、AC3、BE9、CD1、DE1，写A到E最短简单路径。',
          'With undirected edges AB1, AC3, BE9, CD1, DE1, give a shortest simple A-to-E route.',
        ],
        answer: {
          kind: 'graph-route',
          value: 'A-C-D-E',
          graph: {
            nodes: ['A', 'B', 'C', 'D', 'E'],
            edges: [
              ['A', 'B', 1],
              ['A', 'C', 3],
              ['B', 'E', 9],
              ['C', 'D', 1],
              ['D', 'E', 1],
            ],
            directed: false,
            start: 'A',
            goal: 'E',
          },
        },
        step: [
          '局部选AB1会得到成本10；A-C-D-E为3+1+1=5。',
          'Taking AB1 locally yields cost 10; A-C-D-E costs 3+1+1=5.',
        ],
        wrong: ['A-B-E', 'A-E'],
      },
      {
        stem: [
          '无向边AB2、BE3、AC1、CE4，写A到E任一最短简单路径。',
          'With undirected edges AB2, BE3, AC1, CE4, give any shortest simple A-to-E route.',
        ],
        answer: {
          kind: 'graph-route',
          value: 'A-B-E',
          graph: {
            nodes: ['A', 'B', 'C', 'D', 'E'],
            edges: [
              ['A', 'B', 2],
              ['B', 'E', 3],
              ['A', 'C', 1],
              ['C', 'E', 4],
            ],
            directed: false,
            start: 'A',
            goal: 'E',
          },
        },
        step: [
          'A-B-E与A-C-E均成本5，两条都接受。',
          'Both A-B-E and A-C-E cost five; either route is valid.',
        ],
        wrong: ['A-B-C-E', 'A-E'],
      },
      {
        stem: [
          '无向边只有AB2、BC1、CD1，顶点E孤立。写A到E最短路径；不存在填unreachable。',
          'The only undirected edges are AB2, BC1, CD1; E is isolated. Give a shortest A-to-E route, or unreachable if none exists.',
        ],
        answer: {
          kind: 'graph-route',
          value: 'unreachable',
          graph: {
            nodes: ['A', 'B', 'C', 'D', 'E'],
            edges: [
              ['A', 'B', 2],
              ['B', 'C', 1],
              ['C', 'D', 1],
            ],
            directed: false,
            start: 'A',
            goal: 'E',
          },
        },
        step: [
          'E不可达，不能编造D-E边，也不能把∞作为实际路线。',
          'E is unreachable; do not invent a D-E edge or treat infinity as a route.',
        ],
        wrong: ['A-B-C-D-E', '0', '∞'],
      },
      {
        stem: [
          '说明常规网络最短成本6的计算过程，给出局部贪心反例，并解释并列、不可达与边权前提。',
          'Explain the standard network’s minimum cost six, give a local-greedy counterexample, and discuss ties, reachability and weight assumptions.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '从A开始dA0，其余∞，确定A后B2 C5；确定B后C3 D7；确定C后D4 E10；确定D后E6，最后E6。每轮取全局最小暂定值，非负边权保证经未确定点绕路不会降低已确定值。陷阱图AB1 AC3 BE9 CD1 DE1中A-B-E为10，A-C-D-E为5。菱形两路线都5均可接受；孤立E不可达。算法允许零边但本课不允许负边；箭头要顺向，图上长度不是成本。',
            en: 'From A, set d(A)=0 and other labels infinity. Settle A: B2 C5; settle B: C3 D7; settle C: D4 E10; settle D: E6, then settle E. The globally smallest tentative distance is settled; nonnegative edges prevent a later detour through unsettled vertices improving it. In the trap graph AB1 AC3 BE9 CD1 DE1, A-B-E costs ten while A-C-D-E costs five. Both cost-five diamond routes are valid; an isolated E is unreachable. Zero weights are allowed, negative weights are outside this algorithm’s guarantee. Respect arrow direction and do not read costs from drawn lengths.',
          },
        },
        step: [
          '从A开始dA0，其余∞，确定A后B2 C5；确定B后C3 D7；确定C后D4 E10；确定D后E6，最后E6。每轮取全局最小暂定值，非负边权保证经未确定点绕路不会降低已确定值。陷阱图AB1 AC3 BE9 CD1 DE1中A-B-E为10，A-C-D-E为5。菱形两路线都5均可接受；孤立E不可达。算法允许零边但本课不允许负边；箭头要顺向，图上长度不是成本。',
          'From A, set d(A)=0 and other labels infinity. Settle A: B2 C5; settle B: C3 D7; settle C: D4 E10; settle D: E6, then settle E. The globally smallest tentative distance is settled; nonnegative edges prevent a later detour through unsettled vertices improving it. In the trap graph AB1 AC3 BE9 CD1 DE1, A-B-E costs ten while A-C-D-E costs five. Both cost-five diamond routes are valid; an isolated E is unreachable. Zero weights are allowed, negative weights are outside this algorithm’s guarantee. Respect arrow direction and do not read costs from drawn lengths.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        'Dijkstra每轮应该选择什么？',
        'What does each Dijkstra round choose?',
      ],
      correct: 0,
      options: [
        [
          '全体未确定顶点中暂定距离最小者',
          'Globally smallest unsettled tentative distance',
        ],
        ['当前顶点最便宜的出边', 'Cheapest edge out of the current vertex'],
        ['画得最短的线段', 'Shortest drawn segment'],
      ],
      feedback: [
        [
          '再用该点距离加边权松弛邻点。',
          'Then relax neighbours using that distance plus edge cost.',
        ],
        [
          '局部便宜可能导致全程更贵。',
          'A locally cheap edge can lead to a costly total.',
        ],
        ['绘图长度不代表权重。', 'Drawing length does not encode weight.'],
      ],
    },
    reason: [
      '为什么本课的“确定距离”需要非负边权？',
      'Why does settling distances here require nonnegative weights?',
    ],
    rubric: [
      '设u为未确定点中最小暂定距离。任何经其他未确定点再到u的路径，其前缀距离不小于当前最小值，后续非负边不能降低成本，所以u可确定。若有负边，这个论证失效；不能仅凭小图运行恰好成功就宣称算法适用。并列时可任选一个，但不同等长路线仍是合法最优。',
      'For the smallest unsettled tentative distance at u, a route via another unsettled vertex has a prefix no cheaper than this minimum, and nonnegative remaining edges cannot reduce it. Negative edges break this argument; success on one small graph does not justify general use. Ties may be settled in either order, while different equal-cost routes remain valid optima.',
    ],
    prompts: [
      [
        '你比较的是边还是从起点到这里的总成本？',
        'Are you comparing one edge or total cost from the start?',
      ],
      [
        '另一条同成本路线是否也应接受？',
        'Should another equal-cost route also be accepted?',
      ],
    ],
    misconception: [
      '最短是权重和最小；不是边数最少，也不是局部最便宜。',
      'Shortest means minimum weight sum, not fewest edges or locally cheapest moves.',
    ],
  },
  {
    title: ['矩阵的直观意义', 'Intuition of matrices'],
    objective: [
      '按列向量约定，用两根基向量的像构造二维线性变换并解释复合顺序。',
      'Build a plane linear map from its basis images using column vectors, explaining composition order.',
    ],
    hook: [
      '先旋转后拉伸，与先拉伸后旋转会得到同一个结果吗？',
      'Does rotating then stretching give the same result as stretching then rotating?',
    ],
    prerequisites: ['H05-L01', 'H05-L02'],
    keywords: [
      ['基向量的像', 'basis images'],
      ['矩阵复合', 'matrix composition'],
      ['奇异变换', 'singular map'],
    ],
    lab: 'extension-matrices',
    hints: [
      [
        '第一列是e1=(1,0)的像，第二列是e2=(0,1)的像。',
        'Column one is the image of e1=(1,0); column two is the image of e2=(0,1).',
      ],
      [
        '对列向量(AB)v=A(Bv)，右侧先作用；按两列计算，不逐项乘。',
        'For column vectors (AB)v=A(Bv), so the right map acts first; compute columns, not entrywise products.',
      ],
    ],
    items: [
      {
        stem: [
          'A=[2,0;0,1]、B=[0,-1;1,0]，采用列向量。求AB，按[a,b;c,d]格式。',
          'For A=[2,0;0,1], B=[0,-1;1,0], using column vectors, find AB in [a,b;c,d] form.',
        ],
        answer: {
          kind: 'matrix2',
          value: '[0,-2;1,0]',
        },
        step: [
          '先B旋转再A水平伸长，AB两列为(0,1)和(−2,0)。',
          'Apply rotation B then horizontal stretch A; the columns are (0,1) and (−2,0).',
        ],
        wrong: ['[0,-1;2,0]', '[0,0;0,0]'],
      },
      {
        stem: [
          '同样A、B，列向量v=(1,2)。求ABv的坐标。',
          'For the same A and B and column vector v=(1,2), find ABv.',
        ],
        answer: {
          kind: 'coordinate',
          value: '(-4,1)',
        },
        step: [
          'Bv=(−2,1)，再A得(−4,1)。',
          'Bv=(−2,1); applying A gives (−4,1).',
        ],
        wrong: ['(-2,2)', '(4,1)'],
      },
      {
        stem: [
          '仍取A=[2,0;0,1]、B=[0,-1;1,0]，求BA。',
          'With A=[2,0;0,1] and B=[0,-1;1,0], find BA.',
        ],
        answer: {
          kind: 'matrix2',
          value: '[0,-1;2,0]',
        },
        step: [
          '先A再B，两列为(0,2)、(−1,0)，不同于AB。',
          'Apply A then B; the columns (0,2) and (−1,0) differ from AB.',
        ],
        wrong: ['[0,-2;1,0]'],
      },
      {
        stem: [
          '投影矩阵P=[1,0;0,0]的行列式是多少？',
          'What is the determinant of projection matrix P=[1,0;0,0]?',
        ],
        answer: {
          kind: 'number',
          value: '0',
        },
        step: [
          '1×0−0×0=0，二维区域压成x轴线段。',
          '1×0−0×0=0; a plane region collapses to a segment on the x-axis.',
        ],
        wrong: ['1', '-1'],
      },
      {
        stem: [
          'P=[1,0;0,0]，求P(3,5)的坐标。',
          'For P=[1,0;0,0], find P(3,5).',
        ],
        answer: {
          kind: 'coordinate',
          value: '(3,0)',
        },
        step: [
          '第二坐标丢失；(3,−2)也映到同点。',
          'The second coordinate is lost; (3,−2) has the same image.',
        ],
        wrong: ['(3,5)', '(0,5)'],
      },
      {
        stem: [
          '用基向量的像解释矩阵两列、AB与BA的顺序，并用投影说明逆变换可能不存在。',
          'Explain matrix columns via basis images, the orders of AB and BA, and why a projection may have no inverse.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '任何列向量(x,y)=x e1+y e2，线性变换给xT(e1)+yT(e2)，所以两像按列放。A水平伸长2倍，B逆时针90°；AB先B后A为[0,-2;1,0]，BA先A后B为[0,-1;2,0]，作用(1,2)分别(−4,1)与(−2,2)。投影P=[1,0;0,0]把(3,5)、(3,−2)同映(3,0)，不能唯一逆回；det0反映面积坍缩。',
            en: 'Every column vector (x,y)=x e1+y e2 maps to xT(e1)+yT(e2), so place the two basis images as columns. With horizontal stretch A by two and anticlockwise quarter-turn B, AB means B then A, giving [0,-2;1,0], while BA gives [0,-1;2,0]. They send (1,2) to (−4,1) and (−2,2). Projection P=[1,0;0,0] sends both (3,5) and (3,−2) to (3,0), so no unique inverse exists; determinant zero records area collapse.',
          },
        },
        step: [
          '任何列向量(x,y)=x e1+y e2，线性变换给xT(e1)+yT(e2)，所以两像按列放。A水平伸长2倍，B逆时针90°；AB先B后A为[0,-2;1,0]，BA先A后B为[0,-1;2,0]，作用(1,2)分别(−4,1)与(−2,2)。投影P=[1,0;0,0]把(3,5)、(3,−2)同映(3,0)，不能唯一逆回；det0反映面积坍缩。',
          'Every column vector (x,y)=x e1+y e2 maps to xT(e1)+yT(e2), so place the two basis images as columns. With horizontal stretch A by two and anticlockwise quarter-turn B, AB means B then A, giving [0,-2;1,0], while BA gives [0,-1;2,0]. They send (1,2) to (−4,1) and (−2,2). Projection P=[1,0;0,0] sends both (3,5) and (3,−2) to (3,0), so no unique inverse exists; determinant zero records area collapse.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '列向量约定下，ABv先做哪个变换？',
        'With column vectors, which transformation acts first in ABv?',
      ],
      correct: 1,
      options: [
        ['A', 'A'],
        ['B', 'B'],
        ['A与B逐项相乘', 'Multiply A and B entrywise'],
      ],
      feedback: [
        ['A(Bv)里内层B先作用。', 'B is inside A(Bv), so it acts first.'],
        ['右侧B先作用，再A。', 'The right-hand B acts first, then A.'],
        [
          '复合应按列求像，不是逐项积。',
          'Composition uses column images, not an entrywise product.',
        ],
      ],
    },
    reason: [
      '为何知道两根基向量的像就能确定整个线性变换？',
      'Why do two basis images determine the whole linear map?',
    ],
    rubric: [
      '平面每个向量唯一写成x e1+y e2。线性性同时保加法和数乘，因而像被固定为xT(e1)+yT(e2)。两像放列给矩阵乘法。此理由依赖线性；若加固定平移，原点不再保持，单个二阶矩阵不能在本坐标约定下表示所有仿射变换。',
      'Each plane vector has a unique form x e1+y e2. Linearity preserves sums and scalar multiples, forcing image xT(e1)+yT(e2). Those images become columns. The argument requires linearity: adding a fixed translation may move the origin, so a two-by-two matrix in this convention does not represent every affine map.',
    ],
    prompts: [
      ['第一列是哪一个向量的像？', 'Which vector’s image is the first column?'],
      [
        '这个变换有没有丢失输入信息？',
        'Does this transformation lose input information?',
      ],
    ],
    misconception: [
      '矩阵复合通常不交换；奇异变换不能唯一逆回。',
      'Matrix composition generally does not commute; singular maps cannot be uniquely reversed.',
    ],
  },
  {
    title: ['数值方法与近似', 'Numerical methods and approximation'],
    objective: [
      '在连续且有根包围的区间上执行二分法，给出中点近似及可证明的绝对误差界。',
      'Bisect a certified root interval for a continuous function and report its midpoint with a proved absolute-error bound.',
    ],
    hook: [
      '计算器显示1.414，怎样保证误差确实小于0.001？',
      'If a calculator displays 1.414, how can you certify error below 0.001?',
    ],
    prerequisites: ['H26-L01', 'H35-L05'],
    keywords: [
      ['根的包围', 'root enclosure'],
      ['二分法', 'bisection'],
      ['绝对误差界', 'absolute-error bound'],
    ],
    lab: 'extension-numerical',
    hints: [
      [
        '先核闭区间连续、端点根及异号；不能让不连续点穿过区间。',
        'Check closed-interval continuity, endpoint roots and opposite signs; exclude discontinuities.',
      ],
      [
        '保留异号半区间；中点近似的误差不超过当前宽度的一半。',
        'Keep the sign-changing half; midpoint error is at most half the current interval width.',
      ],
    ],
    items: [
      {
        stem: [
          '用f(x)=x²−2，从[1,2]完成3次二分更新，得到[11/8,3/2]。求这个当前区间的中点近似值，填精确分数。',
          'For f(x)=x²−2, three bisection updates from [1,2] give [11/8,3/2]. Give this current interval’s midpoint approximation as an exact fraction.',
        ],
        answer: {
          kind: 'number',
          value: '23/16',
        },
        step: [
          '(11/8+3/2)/2=23/16；这是√2的近似，不是精确根。',
          '(11/8+3/2)/2=23/16; it approximates √2 but is not the exact root.',
        ],
        wrong: ['11/8', '3/2', '1.414'],
      },
      {
        stem: [
          '同一初始区间[1,2]，完成4次二分更新且未遇精确根，中点绝对误差的通用上界是多少？',
          'From initial interval [1,2], after four updates without an exact root, what is the standard midpoint absolute-error bound?',
        ],
        answer: {
          kind: 'number',
          value: '1/32',
        },
        step: [
          '宽度1/16，中点到任何区间内根的距离≤1/32。',
          'The width is 1/16, so midpoint distance to any enclosed root is at most 1/32.',
        ],
        wrong: ['1/16', '1/8'],
      },
      {
        stem: [
          '初始宽1，更新n次的中点误差保证≤1/2^(n+1)。要保证≤1/100，最少需要多少次更新？',
          'Initial width is one, giving midpoint error at most 1/2^(n+1) after n updates. What is the fewest updates guaranteeing error at most 1/100?',
        ],
        answer: {
          kind: 'number',
          value: '6',
        },
        step: [
          'n5给1/64仍大于1/100，n6给1/128符合。',
          'At n=5 the bound 1/64 is too large; at n=6 the bound 1/128 suffices.',
        ],
        wrong: ['5', '7'],
      },
      {
        stem: [
          'f(x)=x²−4，在[1,3]第一次试中点，恰得到哪个精确根？',
          'For f(x)=x²−4 on [1,3], which exact root is found at the first tested midpoint?',
        ],
        answer: {
          kind: 'number',
          value: '2',
        },
        step: [
          '中点2且f2=0，应停止；不能继续以0分哪侧为负。',
          'The midpoint is two and f(2)=0: stop instead of treating zero as a negative sign.',
        ],
        wrong: ['-2', '0'],
      },
      {
        stem: [
          'f(x)=1/x在[−1,1]两端异号。能据此保证闭区间中有根吗？填true/false。',
          'For f(x)=1/x the endpoint signs on [−1,1] differ. Does this certify a root in that closed interval? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          '0处无定义，闭区间连续性失败，1/x在其定义域没有零点。',
          'It is undefined at zero, so closed-interval continuity fails; 1/x has no zero anywhere in its domain.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '对√2写出前三次二分、当前中点与误差保证；说明异号不连续、同号偶重根、残差与误差的区别。',
          'Show three bisection updates for √2 with the current midpoint and error guarantee; distinguish discontinuous sign changes, same-sign even roots, and residual from error.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: 'x²−2在[1,2]连续且端点异号。试3/2为正保[1,3/2]；试5/4为负保[5/4,3/2]；试11/8为负保[11/8,3/2]。当前中点23/16，区间宽1/8，绝对误差≤1/16。每轮保连续且含根的半区间，宽≤初始宽/2^n。1/x在[−1,1]不连续，异号不保证根；x²在[−1,1]同号却根0，判据不适用不等于无根。|f(m)|是纵向残差，不自动等于横向误差；精确命中或端点根须停止。',
            en: 'x²−2 is continuous on [1,2] with opposite endpoint signs. Test 3/2 positive, retain [1,3/2]; test 5/4 negative, retain [5/4,3/2]; test 11/8 negative, retain [11/8,3/2]. The current midpoint is 23/16 and width 1/8, giving absolute error at most 1/16. Each retained half remains continuous and encloses a root; width is at most initial width/2^n. Discontinuous 1/x on [−1,1] invalidates the sign-change guarantee. Same-sign endpoints of x² still enclose root zero; an inapplicable test does not prove absence. Residual |f(m)| is vertical and not automatically coordinate error. Stop at exact midpoint or endpoint roots.',
          },
        },
        step: [
          'x²−2在[1,2]连续且端点异号。试3/2为正保[1,3/2]；试5/4为负保[5/4,3/2]；试11/8为负保[11/8,3/2]。当前中点23/16，区间宽1/8，绝对误差≤1/16。每轮保连续且含根的半区间，宽≤初始宽/2^n。1/x在[−1,1]不连续，异号不保证根；x²在[−1,1]同号却根0，判据不适用不等于无根。|f(m)|是纵向残差，不自动等于横向误差；精确命中或端点根须停止。',
          'x²−2 is continuous on [1,2] with opposite endpoint signs. Test 3/2 positive, retain [1,3/2]; test 5/4 negative, retain [5/4,3/2]; test 11/8 negative, retain [11/8,3/2]. The current midpoint is 23/16 and width 1/8, giving absolute error at most 1/16. Each retained half remains continuous and encloses a root; width is at most initial width/2^n. Discontinuous 1/x on [−1,1] invalidates the sign-change guarantee. Same-sign endpoints of x² still enclose root zero; an inapplicable test does not prove absence. Residual |f(m)| is vertical and not automatically coordinate error. Stop at exact midpoint or endpoint roots.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '当前包围区间宽w，中点的绝对误差保证是什么？',
        'For current enclosure width w, what midpoint error guarantee holds?',
      ],
      correct: 2,
      options: [
        ['总是等于|f(m)|', 'Always equal to |f(m)|'],
        ['总是等于w', 'Always equal to w'],
        ['不超过w/2', 'At most w/2'],
      ],
      feedback: [
        [
          '残差是函数值偏差，未自动转为坐标误差。',
          'A residual measures function value, not automatically coordinate error.',
        ],
        [
          'w是端点间距离，不是中点最远距离。',
          'w is endpoint distance, not the maximum distance from its midpoint.',
        ],
        [
          '根在区间内，离中点最多半宽。',
          'An enclosed root is at most half a width from the midpoint.',
        ],
      ],
    },
    reason: [
      '包围区间在变窄，为什么还要保留连续性和根的条件？',
      'Why retain continuity and a root enclosure while the interval shrinks?',
    ],
    rubric: [
      '变窄只说明区间长度变小，若原区间没有保证根存在，就可能收缩到无定义点或错误位置。每次要保留端点根或连续异号区间；该不变量才让宽度变成根位置误差界。多个根时二分只保证找到某个被保留的根，不自动给全部根。',
      'Shrinking only controls interval length. Without a certified root it could converge to an undefined point or the wrong location. Preserve an endpoint root or a continuous sign-changing enclosure at each update; this invariant turns width into a root-location error bound. With multiple roots, bisection retains some root and does not automatically find them all.',
    ],
    prompts: [
      [
        '你报告的是近似值还是误差上界？',
        'Are you reporting the approximation or its error bound?',
      ],
      [
        '哪一个条件保证区间里确实有根？',
        'Which condition certifies a root inside the interval?',
      ],
    ],
    misconception: [
      '近似中点不等于精确根；残差不等于坐标误差；同号不自动无根。',
      'An approximate midpoint is not an exact root; residual is not coordinate error; same signs do not imply no root.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `extension-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(id, T(item.stem), skill, item.answer.rubric, hints.map(T));
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    hints.map(T),
    [T(hints[0]!), T(item.step)],
    { accepted: [value], rejected: item.wrong },
  );
  q.answer = item.answer;
  if (
    item.answer.kind === 'graph-route' &&
    item.answer.graph.edges.length === 4 &&
    item.answer.value === 'A-B-E'
  )
    q.answerChecks!.accepted.push('A-C-E');
  return q;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `extension-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h37Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H37-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H12',
    unit: 'H37',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`extension-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `extension-${i + 1}`,
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
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});

export function h37ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H37-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H37 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let stem: Pair, step: Pair, answer: AnswerSpec;
  if (i === 0) {
    stem = [
      `S(n)为前n个正奇数和的${b}倍。归纳从n=${a}走到n=${a + 1}应新增多少？`,
      `S(n) is ${b} times the first n positive odd numbers. What is added from n=${a} to n=${a + 1}?`,
    ];
    answer = { kind: 'number', value: String(b * (2 * a + 1)) };
    step = ['新增b[2(n+1)−1]，不是bn²。', 'Add b[2(n+1)−1], not bn².'];
  } else if (i === 1) {
    stem = [
      `u(0)=${a}，u(n+1)=2u(n)+${b}，求u(3)。`,
      `Given u(0)=${a} and u(n+1)=2u(n)+${b}, find u(3).`,
    ];
    answer = { kind: 'number', value: String(8 * a + 7 * b) };
    step = [
      '从初值作三次更新，得到8u(0)+7b。',
      'Three updates from the seed give 8u(0)+7b.',
    ];
  } else if (i === 2) {
    stem = [
      `无向菱形边AB=${a}、BE=${b + 1}、AC=${b}、CE=${a + 2}，求A到E最短总成本。`,
      `In an undirected diamond, AB=${a}, BE=${b + 1}, AC=${b}, CE=${a + 2}. Find the minimum A-to-E total cost.`,
    ];
    answer = { kind: 'number', value: String(a + b + 1) };
    step = [
      '分别加两条路线成本，取较小者。',
      'Add the costs of each route and take the minimum.',
    ];
  } else if (i === 3) {
    stem = [
      `A=[${a},0;0,1]，B=[0,-1;1,0]，列向量v=(1,${b})。求ABv。`,
      `A=[${a},0;0,1], B=[0,-1;1,0], column vector v=(1,${b}). Find ABv.`,
    ];
    answer = { kind: 'coordinate', value: `(${-a * b},1)` };
    step = [
      '先B给(−b,1)，再A给(−ab,1)。',
      'Apply B to get (−b,1), then A to get (−ab,1).',
    ];
  } else {
    stem = [
      `连续函数已有宽${a}的异号包围区间，完成${b}次二分更新且未命中根。中点的通用绝对误差上界是多少？`,
      `A continuous function has a sign-changing enclosure of width ${a}. After ${b} bisection updates without an exact root, what is the standard midpoint absolute-error bound?`,
    ];
    answer = { kind: 'number', value: `${a}/${2 ** (b + 1)}` };
    step = [
      '当前宽为原宽/2^n，中点误差上界再除2。',
      'Current width is original width/2^n; halve it again for midpoint error.',
    ];
  }
  return question(`${id}-R${round}`, i, { stem, answer, step, wrong: ['999'] });
}
export const h37CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H37-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H37-CHECK-Q6', 0, specs[0]!.items[5]!),
  question('H37-CHECK-Q7', 2, specs[2]!.items[5]!),
  question('H37-CHECK-Q8', 4, specs[4]!.items[5]!),
];
