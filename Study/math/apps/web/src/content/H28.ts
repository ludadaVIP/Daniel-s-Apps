import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[] = ['999']) =>
  I(stem, { kind: 'number', value }, step, wrong);
const V = (stem: Pair, value: 'valid' | 'invalid', step: Pair) =>
  I(stem, { kind: 'integration-verdict', value }, step, [
    value === 'valid' ? 'invalid' : 'valid',
  ]);
const W = (
  stem: Pair,
  claim: Extract<AnswerSpec, { kind: 'problem-witness' }>['claim'],
  value: string,
  step: Pair,
  wrong: string[],
  shift?: number,
  spacing?: number,
) =>
  I(
    stem,
    { kind: 'problem-witness', claim, value, shift, spacing },
    step,
    wrong,
  );
const E = (stem: Pair, step: Pair) =>
  I(stem, { kind: 'explain', rubric: T(step) }, step);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const rules: Pair = [
  '虚构纸模活动：每人3张、另备5张，库存4张，每包8张且整包购买。A收7筹码加每包6筹码；预算50、容量20人。n是非负整数；n=0取消且需求、费用均0。',
  'Fictional workshop: three cards each plus five spare, four in stock, eight per whole packet. A charges seven toy credits plus six per packet; budget 50, capacity 20. Attendance n is a nonnegative integer; n=0 cancels with zero demand and cost.',
];
const specs: Spec[] = [
  {
    title: ['分解复杂问题', 'Breaking down complex problems'],
    objective: [
      '把材料、采购、费用与容量拆成有依赖关系的小任务，核验最大可行人数。',
      'Break materials, purchasing, cost and capacity into dependent tasks and verify maximum feasible attendance.',
    ],
    hook: [
      '18人需要几包材料？先算什么，哪些检查能同时进行？',
      'How many packets serve eighteen people? Which tasks depend on others?',
    ],
    prerequisites: ['J98-L03', 'H02-L06'],
    keywords: [
      ['依赖关系', 'dependency'],
      ['整包取整', 'whole-packet rounding'],
      ['可行性', 'feasibility'],
    ],
    lab: 'problem-decompose',
    hints: [
      [
        '先算总需求3n+5，再扣库存；人数为0先用取消规则。容量可以独立检查。',
        'Compute demand 3n+5, then subtract stock; apply cancellation first at zero. Capacity can be checked independently.',
      ],
      [
        '缺口除8后向上取整，费用7+6k。预算与容量必须同时通过；找到候选最大人数后再试下一人。',
        'Round the shortage divided by eight upward. Cost is 7+6k. Check both budget and capacity, then test one person beyond the proposed maximum.',
      ],
    ],
    items: [
      N(
        [
          `${rules[0]} n=18，求最少购买包数。`,
          `${rules[1]} For n=18, find the minimum packets to buy.`,
        ],
        '7',
        [
          '需求59，缺55；6包只有48张不够，7包56张足够。',
          'Demand is 59, shortage 55. Six packets supply only 48; seven supply 56.',
        ],
        ['6', '6.875', '8'],
      ),
      N(
        [
          '同一活动18人，总需求多少张（含备用）？',
          'For eighteen people in the same workshop, how many cards are needed including spares?',
        ],
        '59',
        [
          '3×18+5=59张，不能先扣库存。',
          'Demand is 3×18+5=59 cards, before subtracting stock.',
        ],
        ['54', '55'],
      ),
      N(
        [
          '同一活动18人，方案A费用多少筹码？',
          'For eighteen people, find plan A cost in toy credits.',
        ],
        '49',
        ['7+6×7=49筹码。', '7+6×7=49 toy credits.'],
        ['42', '55'],
      ),
      N(
        [
          '同一活动18人，采购后满足含备用需求，还多多少张？',
          'After meeting the demand including spares for eighteen people, how many cards remain?',
        ],
        '1',
        [
          '库存4+采购56−需求59=1张；备用已计入需求。',
          'Four in stock plus 56 bought minus demand 59 leaves one; spares are already in demand.',
        ],
        ['5', '6'],
      ),
      N(
        [
          '按本活动默认规则、方案A和预算50，最多可服务多少人？',
          'Under the default workshop rules, plan A and budget 50, what is maximum feasible attendance?',
        ],
        '18',
        [
          '最多7包：3n+5≤4+56，所以n≤18；18人成本49，19人成本55，容量20不再限制。',
          'At most seven packets: 3n+5≤60, so n≤18. Eighteen cost 49; nineteen cost 55. Capacity twenty adds no tighter bound.',
        ],
        ['19', '20'],
      ),
      E(
        [
          '若库存改60张，18人仍举行，能否说费用是0？画出任务依赖并说明取消情况。',
          'With stock changed to sixty cards, can an eighteen-person event cost zero? Describe task dependencies and cancellation.',
        ],
        [
          '18人需求59、缺口0、采购0包，但活动仍举行，A仍收固定7筹码。需求→缺口→包数→费用，容量独立进入最终可行性判断。不能把库存覆盖与取消混同；n=0才按题设需求和费用均0。全部量须对应张、包、人、筹码，库存变化不改变每人用量和总需求。',
          'Eighteen need 59, leaving no shortage or purchase, but the event still costs the fixed seven credits. Demand leads to shortage, packets and cost; capacity independently enters the final decision. Stock coverage differs from cancellation: only n=0 activates the stated zero-demand, zero-cost rule. Keep cards, packets, people and credits distinct; changing stock does not change total demand.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪项检查不必等待材料包数？',
        'Which check can be made before packet count is known?',
      ],
      options: [
        ['预算是否足够', 'Whether the budget suffices'],
        ['人数是否超过容量', 'Whether attendance exceeds capacity'],
        ['采购费用', 'Purchase cost'],
      ],
      feedback: [
        ['费用依赖包数。', 'Cost depends on packets.'],
        [
          '比较n≤20即可，之后与预算合并。',
          'Compare n≤20 independently, then combine with budget.',
        ],
        ['采购费用依赖包数。', 'Purchase cost depends on packets.'],
      ],
      correct: 1,
    },
    reason: [
      '为何缺55张不能按6.875包计价？说明最少性，并用19人检查最大人数结论。',
      'Why cannot a shortage of 55 be priced as 6.875 packets? Establish minimality and test nineteen people.',
    ],
    rubric: [
      '题设只售整包，6包48张不足55、7包56张足够，所以向上取整得到最少7包。18人费用49且未超容量；19人缺58张需8包、费用55超预算50。需求与最少费用随正整数人数不减，因此更大人数也不行，得到最大18，而不只是一个可行方案。',
      'Only whole packets are sold: six give 48<55 and seven give 56≥55, proving the minimum. Eighteen cost 49 and fit capacity; nineteen need eight packets and cost 55>50. Demand and minimum cost are nondecreasing for positive integer attendance, so larger attendances also fail. Thus eighteen is maximal, not merely feasible.',
    ],
    prompts: [
      [
        '哪一项改变会影响需求，哪一项只影响缺口？',
        'Which changes affect demand, and which affect only shortage?',
      ],
      [
        '你怎样证明少一包不够、多一人不行？',
        'How do you prove one fewer packet and one more person fail?',
      ],
    ],
    misconception: [
      '先扣库存得到的是采购缺口，不是总需求；预算通过也要检查容量。',
      'Subtracting stock gives shortage, not demand; affordability also needs a capacity check.',
    ],
  },
  {
    title: ['换一种表示方式', 'Switching representations'],
    objective: [
      '把同一离散费用问题在语言、表格、图形与代数之间转换，保留定义域。',
      'Translate one discrete cost problem among words, tables, graphs and algebra while preserving its domain.',
    ],
    hook: [
      '两条计价线的交点，为什么可能对应两个整数人数？',
      'Why can one packet-price intersection correspond to two whole attendances?',
    ],
    prerequisites: ['H28-L01', 'H02-L02'],
    keywords: [
      ['表示转换', 'representation'],
      ['离散定义域', 'discrete domain'],
      ['相等条件', 'equality condition'],
    ],
    lab: 'problem-represent',
    hints: [
      [
        '正人数时k=⌈(3n+1)/8⌉，A=7+6k、B=19+4k。n=0另用取消规则。',
        'For positive attendance k=⌈(3n+1)/8⌉, A=7+6k and B=19+4k. Apply cancellation separately at n=0.',
      ],
      [
        '相等先解12−2k=0，再把k=6换回整数人数：40<3n+1≤48；不要漏取消时的相等。',
        'Solve 12−2k=0, then translate k=6 into whole attendance using 40<3n+1≤48. Include equality at cancellation.',
      ],
    ],
    items: [
      N(
        [
          `${rules[0]} B收19筹码加每包4筹码。正人数时两方案相等对应多少包？`,
          `${rules[1]} B charges nineteen plus four per packet. At positive attendance, how many packets make costs equal?`,
        ],
        '6',
        ['7+6k=19+4k，所以2k=12、k=6。', '7+6k=19+4k gives 2k=12, so k=6.'],
        ['0', '12'],
      ),
      N(
        [
          '默认活动14人时两方案费用相同，各多少筹码？',
          'At fourteen people, find each equal plan cost in toy credits.',
        ],
        '43',
        [
          '需求47、缺43、6包，A=43，B=43。',
          'Demand 47, shortage 43, six packets; both cost 43.',
        ],
        ['37', '49'],
      ),
      I(
        [
          '在默认整数人数0≤n≤20内，写出A、B费用相等的完整人数集合，用{…}。',
          'For whole attendance 0≤n≤20, give the complete set of attendances where A and B cost the same, as {…}.',
        ],
        { kind: 'finite-set', value: '{0,14,15}' },
        [
          'k=6对应n=14、15；n=0两者取消均0，所以集合{0,14,15}。',
          'Six packets correspond to n=14,15; at n=0 both cancel for zero. The full set is {0,14,15}.',
        ],
        ['{14,15}', '{6}', '{0,14}'],
      ),
      N(
        [
          '默认活动16人，方案B费用多少筹码？',
          'For sixteen people in the default workshop, find B cost.',
        ],
        '47',
        [
          '缺49张需7包，B=19+4×7=47。',
          'Shortage 49 needs seven packets; B=19+4×7=47.',
        ],
        ['43', '49'],
      ),
      N(
        [
          '将预算改51，其余默认，方案B最多服务多少人？',
          'Change budget to 51, otherwise keep defaults. Find maximum attendance under B.',
        ],
        '20',
        [
          'B最多8包，20人缺61张需8包、费用51且达到容量；A在同预算仍最多18。',
          'B permits eight packets; twenty need eight, cost 51 and reach capacity. A still permits only eighteen.',
        ],
        ['18', '21'],
      ),
      E(
        [
          '解释为什么不能把人数图上的整数点随意连线后读出14.5人的实际活动；同时说明包数图的交点与取消点。',
          'Explain why joining attendance dots does not authorise an actual 14.5-person event. Relate the packet intersection and cancellation point.',
        ],
        [
          '人数是非负整数，费用随向上取整呈台阶；小数人数不是本题可实施输入。正活动费用对包数k是两条仿射关系，k=6相等，再由取整不等式转回n=14、15。n=0使用单独取消分支，两费用为0；不能把正活动仿射截距7、19当成取消费用。图、表、文字和代数须保持同一变量与定义域。',
          'Attendance is a nonnegative integer and rounding creates steps; fractional people are not admissible events. Positive-event costs are affine in packet count, equal at six; the ceiling inequality maps this back to n=14,15. Cancellation at zero is a separate branch with both costs zero, not the affine intercepts seven and nineteen. Words, tables, plots and algebra must refer to the same variable and domain.',
        ],
      ),
    ],
    pick: {
      stem: [
        '“两方案在k=6相等”还没有直接说明什么？',
        'What is not yet determined by equality at k=6?',
      ],
      options: [
        ['相等时的正活动费用', 'Equal positive-event cost'],
        ['是否必须恰好6人', 'Whether exactly six people must attend'],
        ['该包数下费用差为0', 'Zero cost difference at that packet count'],
      ],
      feedback: [
        ['代入得43筹码。', 'Substitution gives 43 credits.'],
        [
          'k数包，n数人，必须用取整关系转换。',
          'k counts packets, n counts people; use the ceiling relationship.',
        ],
        ['相等定义就是差0。', 'Equality means zero difference.'],
      ],
      correct: 1,
    },
    reason: [
      '说明默认表中13、14、15、16人费用变化，并判断哪种表示更便于找交点、哪种便于直接决策人数。',
      'Explain cost changes at n=13,14,15,16. Which representation helps find an intersection, and which directly supports attendance decisions?',
    ],
    rubric: [
      '四个人数对应包数5、6、6、7，A费用37、43、43、49，B为39、43、43、47。包数图或方程清楚给出相等点k=6和差12−2k；人数表保留整人数与台阶，直接查容量和预算。两种表示互补，换表示不许把包数当人数，也不能漏掉n=0取消分支。',
      'Packet counts are 5,6,6,7. A costs 37,43,43,49; B costs 39,43,43,47. Packet equations expose intersection k=6 and difference 12−2k. Attendance tables retain whole people and steps for budget and capacity decisions. The representations complement each other; never equate packets with people or omit the n=0 cancellation branch.',
    ],
    prompts: [
      [
        '横轴数的是人还是包？',
        'Does this horizontal axis count people or packets?',
      ],
      [
        '你的相等集合漏掉哪条分支了吗？',
        'Does your equality set include every branch?',
      ],
    ],
    misconception: [
      '交点的横坐标须先辨单位；仿射计价只适用正活动，取消另计。',
      'Identify the intersection variable and units; affine prices apply to positive events, with cancellation separate.',
    ],
  },
  {
    title: ['验证极端情况', 'Checking extreme cases'],
    objective: [
      '用零值、取整跳点、预算边界与容量边界反驳错误规则，并说明有限测试的限度。',
      'Use zero, rounding thresholds, budget and capacity boundaries to challenge rules and state the limits of finite tests.',
    ],
    hook: [
      '一个公式在5人时对了，为什么在4人或0人时可能失败？',
      'Why might a rule pass at five people yet fail at four or zero?',
    ],
    prerequisites: ['H28-L01', 'H01-L03'],
    keywords: [
      ['边界', 'boundary'],
      ['压力测试', 'stress test'],
      ['证明范围', 'scope of proof'],
    ],
    lab: 'problem-boundaries',
    hints: [
      [
        '先写完整规则与输入范围。检查0、刚好够一包及多一张、预算差一筹码和容量多一人。',
        'State the full rule and domain. Test zero, exact packet capacity and one card beyond, a one-credit deficit and one person beyond capacity.',
      ],
      [
        '测试通过只说明该输入通过；一个有效失败足以否定“总成立”。全域成立仍需推导或穷尽给定有限域。',
        'Passing establishes only that input; one valid failure refutes a universal rule. A full claim needs derivation or exhaustive checking of its stated finite domain.',
      ],
    ],
    items: [
      N(
        [`${rules[0]} n=0费用多少筹码？`, `${rules[1]} Find cost at n=0.`],
        '0',
        [
          '取消规则优先，不能继续收固定7。',
          'Cancellation takes priority; do not retain the fee of seven.',
        ],
        ['7', '13'],
      ),
      N(
        [
          '默认活动2人，方案A费用多少筹码？',
          'For two people in the default workshop, find A cost.',
        ],
        '13',
        [
          '需求11、缺7，1包；7+6=13。',
          'Demand 11, shortage seven, one packet; cost 13.',
        ],
        ['7', '19'],
      ),
      N(
        [
          '默认活动3人，方案A费用多少筹码？',
          'For three people in the default workshop, find A cost.',
        ],
        '19',
        [
          '需求14、缺10，2包；7+12=19。',
          'Demand 14, shortage ten, two packets; cost 19.',
        ],
        ['13', '17.5'],
      ),
      V(
        [
          '默认活动1人、方案A，预算仅12。计划可行吗？成立填valid，不成立填invalid。',
          'One person, plan A, budget twelve with other defaults. Is it feasible? Enter valid or invalid.',
        ],
        'invalid',
        [
          '1人仍需1包，费用13>12。',
          'One person still needs one packet and costs 13>12.',
        ],
      ),
      V(
        [
          '默认活动21人、方案A、预算200，容量仍20。计划可行吗？填valid或invalid。',
          'Twenty-one people, A, budget 200, capacity still twenty. Feasible? Enter valid or invalid.',
        ],
        'invalid',
        [
          '费用55虽可承担，但21>20，容量失败。',
          'Cost 55 is affordable, but 21>20 violates capacity.',
        ],
      ),
      E(
        [
          '“包数用向下取整，因为5人时算对了。”用4人与5人检验，并说明这类检验能证明什么。',
          '“Round packets downward because it worked for five people.” Test four and five and explain what the tests establish.',
        ],
        [
          '4人需求17、扣库存4后缺13张，向下1包只供8张，少5张；正确为2包。5人缺16张，向下与向上均2包，偶然通过不代表规则总对。4人是满足题设且结论失败的反例，足以推翻全称规则。正确向上取整来自最小整数k满足8k≥缺口；有限抽查本身不能证明所有非负整数输入。',
          'Four people need seventeen cards, leaving a shortage of thirteen. Flooring gives one packet of eight, five cards short; two are needed. Five people have shortage sixteen, so floor and ceiling both give two. That pass does not validate the general rule. Four is an admissible counterexample that refutes it. Ceiling follows from the least integer k with 8k≥shortage; selected tests alone do not prove all nonnegative integer inputs.',
        ],
      ),
    ],
    pick: {
      stem: [
        '一条全称规则在三个输入通过，可得什么？',
        'A universal rule passes three inputs. What follows?',
      ],
      options: [
        ['已证明对所有输入成立', 'It is proved for all inputs'],
        ['只确认这三个输入通过', 'Only those three inputs have passed'],
        ['其他输入必定失败', 'Every other input must fail'],
      ],
      feedback: [
        [
          '除非这已穷尽所声称的全部域。',
          'Only if these exhaust its entire claimed domain.',
        ],
        [
          '继续找边界，并用推导解释完整规则。',
          'Probe boundaries and derive the complete rule.',
        ],
        ['尚未测试不表示失败。', 'Untested does not mean failing.'],
      ],
      correct: 1,
    },
    reason: [
      '给出一个“只检查费用就宣布可行”的反例。解释整数定义域、容量约束与预算约束有什么不同。',
      'Refute “affordable implies feasible”. Distinguish the integer input domain from capacity and budget constraints.',
    ],
    rubric: [
      'n=21是非负整数，属于数学输入范围；默认A费用55，在预算200内，却超过20人的容量，因此不可行。小数人数不属于输入域，不能拿它充当本题有效反例；21属于域但违反约束，正好可检验错误决策规则。预算和容量必须同时满足，扩大预算不会扩大房间容量。',
      'n=21 is a nonnegative integer and an admissible mathematical input. Default A costs 55, within budget 200, but exceeds capacity twenty and is infeasible. Fractional attendance lies outside the input domain and cannot supply this counterexample. Twenty-one lies inside the domain while violating a feasibility constraint. Both budget and capacity must hold; a larger budget does not enlarge the room.',
    ],
    prompts: [
      ['你的测试恰好卡在哪个边界？', 'Which boundary does your test probe?'],
      [
        '通过几个例子，与推导全部输入差在哪里？',
        'How do several passes differ from an all-input argument?',
      ],
    ],
    misconception: [
      '通过样例不是普遍证明；域内违反约束是有效测试，域外输入不是反例。',
      'Passing examples do not prove a universal rule; violating a constraint within the domain differs from an out-of-domain input.',
    ],
  },
  {
    title: ['构造反例', 'Constructing counterexamples'],
    objective: [
      '主动构造满足前提却使结论为假的数值反例，区分反驳、支持与不适用。',
      'Construct a numerical case with a true premise and false conclusion, distinguishing refutation, agreement and inapplicability.',
    ],
    hook: [
      '给出一个自己的例子，就能推翻“永远如此”吗？需要满足什么条件？',
      'Can one example of your own refute “always”? What must it satisfy?',
    ],
    prerequisites: ['H01-L03', 'J98-L04'],
    keywords: [
      ['全称命题', 'universal claim'],
      ['前提', 'premise'],
      ['反例', 'counterexample'],
    ],
    lab: 'problem-counterexample',
    hints: [
      [
        '先核输入和前提，再分别算结论两边。符合结论的例子只算通过，不算反例。',
        'Check input and premise first, then evaluate both sides. Agreement passes that example but does not refute the claim.',
      ],
      [
        '平方和检查交叉项；消去x前检查x=0；有限表外找新输入；同周长矩形可比较a(6−a)。',
        'Inspect cross terms, check x=0 before cancellation, look beyond sampled inputs, and compare rectangle areas a(6−a) at fixed perimeter.',
      ],
    ],
    items: [
      W(
        [
          '反驳“对所有有理数a,b，(a+b)²=a²+b²”。输入你自己的(a,b)，每个数绝对值≤20、约分后分母≤100。',
          'Refute “(a+b)²=a²+b² for all rational a,b”. Enter your own (a,b), each of magnitude at most twenty and reduced denominator at most one hundred.',
        ],
        'square-sum',
        '(1,1)',
        [
          '如(1,1)：左4右2，前提满足、结论失败。所有非零a,b都产生差2ab≠0。',
          'For example (1,1) gives four versus two. Both inputs are admissible and the conclusion fails. Any nonzero a,b give difference 2ab≠0.',
        ],
        ['(0,1)', '(1,0)', '(21,1)', '1'],
      ),
      W(
        [
          '反驳“对所有有理数x，若x²=x，则x=1”。输入x（绝对值≤20、分母≤100）。',
          'Refute “For rational x, if x²=x then x=1”. Enter x, magnitude ≤20 and reduced denominator ≤100.',
        ],
        'cancel-factor',
        '0',
        [
          '0²=0满足前提，但0≠1。x=2不满足前提，不是反例。',
          'Zero satisfies x²=x but is not one. Two fails the premise and is not a counterexample.',
        ],
        ['1', '2', '-1', 'x=0'],
      ),
      W(
        [
          'f(x)=x+x(x−1)(x−2)在0、1、2与x相等。反驳“所有有理数x都有f(x)=x”。输入x（绝对值≤20、分母≤100）。',
          'f(x)=x+x(x−1)(x−2) agrees with x at 0,1,2. Refute equality for every rational x. Enter x of magnitude ≤20 and reduced denominator ≤100.',
        ],
        'finite-table',
        '3',
        [
          'x=3时f=9而x=3；三个通过的表格行不是恒等证明。',
          'At x=3, f=9 rather than three. Three passing table rows do not prove identity.',
        ],
        ['0', '1', '2', '21'],
      ),
      W(
        [
          '两矩形边长分别(a,6−a)、(b,6−b)，0<a,b<6，周长均12。反驳“面积必相同”。输入(a,b)，同上述有理数界。',
          'Rectangles have sides (a,6−a) and (b,6−b), with 0<a,b<6 and perimeter twelve. Refute equal area. Enter (a,b) within the same rational bounds.',
        ],
        'equal-perimeter',
        '(1,2)',
        [
          '(1,2)给面积5和8，周长同12；(1,5)面积同5不能反驳。',
          '(1,2) gives areas five and eight at perimeter twelve; (1,5) gives equal areas and cannot refute.',
        ],
        ['(1,5)', '(2,2)', '(0,2)', '(6,2)'],
      ),
      W(
        [
          '再反驳平方和命题，这次可使用分数。输入任意有效(a,b)，仍须在有理数界内。',
          'Refute the square-sum claim again; fractions are welcome. Enter any valid (a,b) within the rational bounds.',
        ],
        'square-sum',
        '(1/2,2)',
        [
          '如(1/2,2)：左25/4，右17/4，相差2；不必匹配这组示范数。',
          'For (1/2,2), the sides are 25/4 and 17/4, differing by two. Other valid witnesses also count.',
        ],
        ['(0,2)', '(1/2,0)', '(1/101,2)'],
      ),
      E(
        [
          '解释一个你自己构造的反例，明确命题量词、输入域、前提真和结论假。一个符合结论的例子能证明全称命题吗？',
          'Explain a counterexample of your own, naming the quantifier, domain, true premise and false conclusion. Does one agreeing example prove a universal claim?',
        ],
        [
          '例如平方和命题声称对所有有理数成立，取a=1、b=1满足输入要求，左4右2，因此全称命题为假。反例必须同时在域内、前提真、结论假。x²=x⇒x=1中x=2不满足前提所以不适用；x=1两边通过却不能覆盖所有输入。反驳一个全称命题只需一个有效失败，证明它通常需要覆盖整个域的论证。',
          'For the universal rational square-sum claim, a=b=1 is admissible, but four differs from two, so the universal claim is false. A counterexample must lie in the domain, satisfy the premise and falsify the conclusion. In x²=x⇒x=1, two fails the premise and is inapplicable; one passes but does not cover every input. One valid failure refutes a universal claim; proving it requires an argument covering its whole domain.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对“若x²=x，则x=1”，x=2是什么？',
        'For “if x²=x then x=1”, what does x=2 provide?',
      ],
      options: [
        ['有效反例', 'A valid counterexample'],
        ['不满足前提，不能反驳', 'A failed premise, so no refutation'],
        ['全称命题的证明', 'A proof of the universal claim'],
      ],
      feedback: [
        ['2²≠2，前提不成立。', '2²≠2; the premise fails.'],
        [
          '先检查前提，再谈结论真假。',
          'Check the premise before testing the conclusion.',
        ],
        [
          '一次输入不能证明全称结论。',
          'One input cannot prove a universal statement.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '同周长矩形取(a,b)=(1,5)为何不是反例？怎样修改后成为反例？说明为什么软件仍需人工复核论证。',
      'Why is (1,5) not a counterexample for fixed-perimeter rectangles? Modify it, and explain why the full argument still needs human review.',
    ],
    rubric: [
      '(1,5)给边长1、5与5、1，周长均12、面积均5，结论相同所以不是反例。改成(1,2)，两矩形边长均正、周长均12，面积5与8不同，构成有效反例。数值核验能核输入、前提和两面积；量词、命题范围、为何一次失败能反驳及文字解释仍由家长核验，不能靠输入几个关键词自动通过。',
      '(1,5) gives sides one by five and five by one, equal perimeters and equal areas five, so no refutation. Change to (1,2): positive sides, equal perimeter twelve, areas five and eight. Numerical checks establish those premises and unequal areas; a parent still reviews the quantifier, scope and explanation of why one failure refutes the claim. Keywords alone do not establish an argument.',
    ],
    prompts: [
      ['前提在哪一步被核验？', 'Where did you verify the premise?'],
      [
        '这一次失败推翻的是哪句“所有”？',
        'Which exact “for all” claim does this failure refute?',
      ],
    ],
    misconception: [
      '结论假而前提也假的输入不是反例；同意的例子不能证明无限域全称命题。',
      'A false conclusion with a failed premise is not a counterexample; agreeing examples do not prove an infinite-domain universal claim.',
    ],
  },
  {
    title: ['解释假设与结果', 'Communicating assumptions and results'],
    objective: [
      '报告基准结果、明确假设与枚举压力情景的范围，区分条件性可行与真实世界保证。',
      'Report baseline results, explicit assumptions and enumerated stress scenarios, separating conditional feasibility from a real-world guarantee.',
    ],
    hook: [
      '18人的49筹码方案，能保证18–20人、每人3或4张都够吗？',
      'Does a 49-credit baseline cover eighteen through twenty people using three or four cards each?',
    ],
    prerequisites: ['H28-L02', 'H28-L03', 'H27-L05'],
    keywords: [
      ['假设', 'assumption'],
      ['敏感性', 'sensitivity'],
      ['条件性结论', 'conditional conclusion'],
    ],
    lab: 'problem-report',
    hints: [
      [
        '列清人数整数范围、每人用量、库存、备用、整包、费用、取消、预算与容量；基准只是一种情景。',
        'State whole attendance range, cards per person, stock, spares, whole packets, prices, cancellation, budget and capacity. The baseline is one scenario.',
      ],
      [
        '枚举每个允许的(n,q)，再求最高费用并逐项查容量。情景没有概率，最坏费用不是置信上限。',
        'Enumerate every allowed (n,q), find maximum cost and check capacity in each. Scenarios have no probabilities; maximum cost is not a confidence bound.',
      ],
    ],
    items: [
      N(
        [
          `${rules[0]} 现在n∈{18,19,20}、每人q∈{3,4}，其他规则不变。方案A最高费用多少筹码？`,
          `${rules[1]} Now n∈{18,19,20} and cards each q∈{3,4}. With other rules unchanged, find maximum A cost.`,
        ],
        '73',
        [
          '20人每人4张，需求85、缺81、11包，7+6×11=73。',
          'Twenty using four each need 85, shortage 81, eleven packets; 7+6×11=73.',
        ],
        ['49', '67', '70'],
      ),
      N(
        [
          '同一六情景中，方案A基准n=18、q=3费用多少筹码？',
          'Within those six scenarios, find A baseline cost at n=18,q=3.',
        ],
        '49',
        [
          '基准7包费用49，不覆盖全部情景。',
          'The baseline needs seven packets and costs 49; it does not cover every scenario.',
        ],
        ['73', '47'],
      ),
      N(
        [
          '同一六情景，B收19加每包4筹码，最高费用多少？',
          'For the same six scenarios, B charges nineteen plus four per packet. Find its maximum cost.',
        ],
        '63',
        [
          '最高仍11包，19+4×11=63。',
          'The maximum remains eleven packets; 19+4×11=63.',
        ],
        ['47', '59', '73'],
      ),
      V(
        [
          '同一六情景，方案B、预算70、容量20，在全部所列情景下可行吗？填valid或invalid。',
          'For all six stated scenarios, B, budget seventy and capacity twenty: feasible throughout? Enter valid or invalid.',
        ],
        'valid',
        [
          '最高63≤70，所有人数≤20，六情景均通过；这不覆盖每人5张。',
          'Maximum 63≤70 and all attendances ≤20. All six pass; this says nothing about using five each.',
        ],
      ),
      V(
        [
          '改为整数n∈{18,19,20,21,22}、q∈{3,4}，B、预算200、容量20，是否全部可行？填valid或invalid。',
          'Change to n∈{18,19,20,21,22}, q∈{3,4}, B, budget 200 and capacity twenty. Are all feasible? Enter valid or invalid.',
        ],
        'invalid',
        [
          '21、22人违反容量，即使钱足也不是全部可行。',
          'Twenty-one and twenty-two exceed capacity even with ample money.',
        ],
      ),
      E(
        [
          '写一份给活动组织者的条件性报告：比较A与B在18–20人、每人3或4张、预算70下的结果，并说明未知和下一步。',
          'Write a conditional report comparing A and B for eighteen through twenty people, three or four cards each and budget seventy. Include unknowns and next steps.',
        ],
        [
          '库存4、备用5、每包8、正活动计固定费、取消0、容量20均为题设规则；假设n是18–20整数且q为3或4，无额外损耗费用。基准18人q3时A49、B47；六情景最高A73、B63。预算70下A不保证六情景均可行，B在全部六情景同时满足预算与容量。此为给定假设内枚举结论，没有概率或真实供应保证；若用量5张、损耗、价格或人数变化须重新建模。开放报告的完整推理由人核验。',
          'Rules include stock four, five spares, eight per packet, a fee for positive events, cancellation at zero and capacity twenty. Assume whole attendance eighteen through twenty, q three or four and no other losses or charges. Baseline costs are A49 and B47; maxima across six scenarios are A73 and B63. Budget seventy does not cover every A scenario, whereas B meets both constraints in all six. This exhausts the stated assumptions, not real-world possibilities, and assigns no probabilities. Recalculate if usage five, losses, prices or attendance change. Human review assesses the full report.',
        ],
      ),
    ],
    pick: {
      stem: [
        '“B在六个所列情景都通过”支持什么？',
        'What follows from B passing all six stated scenarios?',
      ],
      options: [
        [
          '任何真实情况都保证可行',
          'Every real situation is guaranteed feasible',
        ],
        [
          '在明确假设与范围内均可行',
          'Feasible throughout the explicit assumptions and range',
        ],
        ['有95%把握可行', '95% confidence of feasibility'],
      ],
      feedback: [
        ['仍有范围外的未知。', 'Unknown situations remain outside the scope.'],
        [
          '条件性结论应同时报告假设。',
          'Report the conditions alongside the conclusion.',
        ],
        [
          '没有概率设计，不能编造95%。',
          'No probability model supports that percentage.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '只说“18人费用49，所以预算70够了”遗漏什么？比较方案时为何还要报告容量与未建模因素？',
      'What is omitted by “eighteen cost 49, so seventy is enough”? Why report capacity and unmodelled factors when comparing plans?',
    ],
    rubric: [
      '49只对应A、n18、q3的基准，不含q4或人数20。完整六情景中最高73，预算70不足覆盖A；B最高63且人数全≤20才支持该范围内可行。容量与钱是独立限制，若人数扩到22则两方案仍违反容量。损耗、用量5、价格和额外收费未建模，不能宣称绝对保证或概率；应给结果、单位、假设、范围及需重算条件。',
      'Forty-nine is only A at n18,q3, excluding q4 or attendance twenty. Across all six cases A reaches 73, beyond seventy. B reaches 63 and all attendances fit twenty, establishing feasibility within that range. Capacity is independent of money: extending attendance to twenty-two violates it under either plan. Losses, usage five, new prices and extra charges are unmodelled, so no absolute or probabilistic guarantee follows. Report results, units, assumptions, scope and recalculation triggers.',
    ],
    prompts: [
      [
        '你报告的是基准，还是假设内全部情景？',
        'Are you reporting the baseline or every allowed scenario?',
      ],
      [
        '哪项未知一旦改变就要重新计算？',
        'Which changed unknown would require recalculation?',
      ],
    ],
    misconception: [
      '最坏情景是明确有限假设内的最大值，不是概率、置信界或真实世界保证。',
      'A worst scenario is a maximum within explicit finite assumptions, not a probability, confidence bound or real-world guarantee.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `problem-solving-${i + 1}`;
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
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `problem-solving-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h28Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H28-L0${i + 1}`;
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
    unit: 'H28',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`problem-solving-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `problem-solving-${i + 1}`,
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
export function h28ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H28-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H28 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0) {
    const n = 13 + a,
      stock = b;
    item = N(
      [
        `每人3张、备用5张，${n}人、库存${stock}张，每整包8张。最少买几包？`,
        `At three cards each plus five spares, ${n} people and ${stock} cards in stock, how many whole packets of eight must be bought?`,
      ],
      String(Math.ceil((3 * n + 5 - stock) / 8)),
      [
        '先扣库存，再将正缺口除8向上取整。',
        'Subtract stock, then round the positive shortage divided by eight upward.',
      ],
    );
  } else if (i === 1) {
    const value = a % b === 0 ? `{${a / b}}` : '{}';
    item = I(
      [
        `独立的正活动计价：P=7+${b + 4}k，Q=${7 + a}+4k；k∈{1,…,10}。求两费用相等的完整包数集合，无解填∅。`,
        `Separate positive-event prices: P=7+${b + 4}k, Q=${7 + a}+4k, for k∈{1,…,10}. Give the full set of equal-cost packet counts; use ∅ for none.`,
      ],
      { kind: 'finite-set', value },
      [
        '整理得bk=a；只保留域内整数解。',
        'Rearrange to bk=a; retain only integer solutions in the domain.',
      ],
      ['{999}'],
    );
  } else if (i === 2) {
    const size = 4 + b,
      need = size * a + (k % 2);
    item = N(
      [
        `整包每包${size}张，净缺口${need}张。最少买多少包才能不短缺？`,
        `Packets hold ${size} cards; the net shortage is ${need}. What is the minimum whole packet count without shortage?`,
      ],
      String(a + (k % 2)),
      [
        '恰好整除不加包；超出整包容量一张就要再加一包。',
        'Exact divisibility needs no extra packet; one card beyond capacity needs another.',
      ],
    );
  } else if (i === 3)
    item = W(
      [
        `f(x)=x+(x−${a})(x−${a + b})(x−${a + 2 * b})与x在${a}、${a + b}、${a + 2 * b}相等。给出“对所有有理数均相等”的反例x；|x|≤20、分母≤100。`,
        `f(x)=x+(x−${a})(x−${a + b})(x−${a + 2 * b}) agrees with x at ${a},${a + b},${a + 2 * b}. Enter a counterexample to equality for all rationals, with |x|≤20 and reduced denominator≤100.`,
      ],
      'finite-table',
      String(a - 1),
      [
        '任选不等于三个根的域内有理数，乘积非零，故两式不同。',
        'Choose an admissible rational unequal to all three roots; the product is nonzero.',
      ],
      [String(a), String(a + b), String(a + 2 * b)],
      a,
      b,
    );
  else {
    const high = 13 + a,
      q = 3 + b;
    item = N(
      [
        `沿用库存4、备用5、每包8、A固定7加每包6。n∈{${high - 1},${high}}，每人张数为3至${q}的整数。求全部情景中的最高费用筹码数。`,
        `Use stock four, five spares, packets of eight and A prices seven plus six per packet. n∈{${high - 1},${high}} and cards each are integers from three to ${q}. Find the maximum cost in toy credits.`,
      ],
      String(7 + 6 * Math.ceil((high * q + 1) / 8)),
      [
        '需求与包数随正人数和每人用量不减，检查两者上界并向上取整。',
        'Demand and packet count are nondecreasing in positive attendance and usage; use both upper bounds and round upward.',
      ],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h28CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H28-CHECK-Q${i + 1}`, i, s.items[0]!)),
  pick('H28-CHECK-Q6', 4),
  question('H28-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H28-CHECK-Q8', 4, specs[4]!.items[5]!),
];
