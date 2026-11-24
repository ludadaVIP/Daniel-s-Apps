import type { LocalizedText } from '@study/shared';
import type { Lesson, LessonQuestion } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
function q(
  id: string,
  prompt: LocalizedText,
  options: LocalizedText[],
  answer: number,
  explanation: LocalizedText,
  concept: string,
  kind: LessonQuestion['kind'] = 'reasoning',
): LessonQuestion {
  return {
    id,
    prompt,
    options,
    answer,
    explanation,
    conceptIds: [concept],
    kind,
  };
}
const configurations = {
  title: t(
    '拓展：基态电子排布与周期表',
    'Read more: ground-state configurations and the periodic table',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations',
};
const ions = {
  title: t('拓展：离子与元素身份', 'Read more: ions and element identity'),
  url: 'https://openstax.org/books/chemistry-2e/pages/2-6-ionic-and-molecular-compounds',
};
export const periodicBridgeLessons: Lesson[] = [
  {
    id: 'neutral-atoms-before-table-position',
    levelId: 'table',
    order: 107,
    nextLessonId: 'electron-transfer-needs-both-sides',
    title: t(
      '电子排布像氖，元素就变成氖了吗？',
      'If the electrons look like neon, has the element become neon?',
    ),
    eyebrow: t(
      '周期表衔接 1/2 · 读位置前先确认中性',
      'Periodic bridge 1/2 · Check neutrality before reading position',
    ),
    hook: t(
      'Na⁺ 与中性 Ne 都可写成 2、8。能因此把 Na⁺ 放到第 2 周期、第 18 族，并说钠变成了氖吗？',
      'Na⁺ and neutral Ne can both be written 2, 8. Does that place Na⁺ in Period 2, Group 18 and turn sodium into neon?',
    ),
    hookHint: t(
      '用 Z 保留元素身份。电子可以失、得，周期表不会因此把该元素搬到另一个格子。',
      'Keep element identity with Z. Electrons can be lost or gained without moving that element to another periodic-table cell.',
    ),
    bigIdea: t(
      '周期表位置属于元素；用电子层与最外层数作读表线索前，先还原中性基态原子的排布，并记住 He 的特例。',
      'Periodic-table position belongs to an element. Before using shell and outer-electron counts as clues, restore the neutral ground-state arrangement and retain the He exception.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🧂',
        title: t('Na⁺ 仍是钠', 'Na⁺ is still sodium'),
        body: t(
          '失去一个电子后可留下 2、8，但 Z 仍为 11。钠仍在第 3 周期、第 1 族。',
          'Losing one electron can leave 2, 8, but Z remains 11. Sodium remains in Period 3, Group 1.',
        ),
      },
      {
        icon: '🦴',
        title: t(
          'Ca²⁺ 少了一层，不搬家',
          'Ca²⁺ loses an occupied shell, not its table position',
        ),
        body: t(
          'Ca²⁺ 的给定排布为 2、8、8；中性 Ca 是 2、8、8、2。钙元素仍在第 4 周期。',
          'The supplied Ca²⁺ arrangement is 2, 8, 8; neutral Ca is 2, 8, 8, 2. Calcium remains a Period 4 element.',
        ),
      },
      {
        icon: '🎈',
        title: t(
          'He 有两个电子，却不在第 2 族',
          'He has two electrons but is not Group 2',
        ),
        body: t(
          'He 的第一层已有两个电子，归在第 18 族。不能把族号直接等同于最外层电子数。',
          'He has two electrons in its first shell and belongs to Group 18. Group number is not identical to outer-electron count.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先分清元素身份和粒子电荷',
          'Separate element identity from particle charge',
        ),
        body: t(
          'Z 是质子数，决定元素；q=Z−e 核对这份记录是否带电。相同电子总数或排布，不足以判断元素相同。',
          'Z counts protons and identifies the element; q=Z−e checks the charge of this record. Equal electron counts or arrangements do not establish equal element identity.',
        ),
      },
      {
        title: t('把读表条件补完整', 'State the reading conditions'),
        body: t(
          '本课只用前 20 号指定基态原子与离子。对中性基态原子，占据的电子层数可作周期线索；遇到离子，先按 Z 找到该元素的中性排布。',
          'This lesson uses specified ground-state atoms and ions among the first 20 elements. Occupied-shell count is a period clue for neutral ground-state atoms. For an ion, first use Z to recover its element’s neutral arrangement.',
        ),
      },
      {
        title: t(
          '族号不是最外层数的原样照抄',
          'Group numbers are not copied outer-electron counts',
        ),
        body: t(
          '本范围中性主族原子，最外层 1、2 个常对应第 1、2 族；3–8 个对应第 13–18 族。He 只有 2 个却在第 18 族，需单独记清这个特例。',
          'For these neutral main-group atoms, one or two outer electrons usually correspond to Groups 1 or 2; three to eight to Groups 13–18. He has two but belongs to Group 18: retain this exception.',
        ),
      },
      {
        title: t(
          '相似排布不是所有性质相同',
          'Similar arrangements do not imply identical properties',
        ),
        body: t(
          'Na⁺ 与 Ne、Cl⁻ 与 Ar 可有相同的层内电子个数，但核电荷不同，不能直接推断半径或性质一样。图也不表示真实轨道、尺寸或所有元素的层容量。',
          'Na⁺/Ne and Cl⁻/Ar can share shell populations but differ in nuclear charge. Do not infer equal radii or properties. The drawing gives no real paths, sizes or universal shell capacities.',
        ),
      },
    ],
    misconception: t(
      '“离子有两层，所以元素在第 2 周期”“最外层八个，所以一定第 18 族”“2、8、8 是所有电子层的容量上限”都省略了适用条件。',
      '“Two ion shells means Period 2”, “eight outer electrons means Group 18”, and “2, 8, 8 are universal shell capacities” all omit necessary conditions.',
    ),
    mission: t(
      '只用纸笔，分别写 Na⁺/Ne 与 Ca²⁺/Ca 的 Z、电子数、给定排布、中性排布、元素周期和族号。用一句话解释哪些相同、哪些不能由相同排布推出。',
      'On paper, compare Na⁺/Ne and Ca²⁺/Ca using Z, electron totals, supplied and neutral arrangements, periods and groups. Explain which features match and what cannot be inferred from matching arrangements.',
    ),
    vocabulary: [
      { en: 'neutral ground state', zh: '中性基态' },
      { en: 'shell population', zh: '层内电子个数' },
      { en: 'outer electrons', zh: '最外层电子' },
      { en: 'element position', zh: '元素位置' },
    ],
    interactive: 'neutral-shell-position-lab',
    resources: [configurations, ions],
    learning: {
      prerequisites: [
        'groups',
        'periods',
        'group-18',
        'isotope-and-ion-two-ledgers',
      ],
      objectives: [
        t(
          '用 Z 和电子总数区分中性记录与离子记录。',
          'Use Z and electron totals to distinguish neutral and ionic records.',
        ),
        t(
          '还原中性排布后读取该元素的周期与族。',
          'Read an element’s period and group using its neutral arrangement.',
        ),
        t(
          '用 He 与 Ca²⁺ 说明读表规律的条件与例外。',
          'Use He and Ca²⁺ to explain conditions and exceptions to reading rules.',
        ),
      ],
      workedExample: {
        prompt: t(
          'Na⁺：Z=11，排布 2、8。图中有几个电子？钠元素在几周期、几族？',
          'Na⁺ has Z=11 and arrangement 2, 8. How many electrons are pictured, and what are sodium’s period and group?',
        ),
        steps: [
          t(
            '电子总数 2+8=10，q=11−10=+1，是离子。',
            'Electron total is 2+8=10; q=11−10=+1, so it is an ion.',
          ),
          t(
            '质子数仍为 11；该元素的中性排布为 2、8、1。',
            'Proton count stays 11; the neutral element’s arrangement is 2, 8, 1.',
          ),
          t(
            '按中性排布和元素位置，钠在第 3 周期、第 1 族，不是氖。',
            'Using the neutral arrangement and element identity gives Period 3, Group 1, not neon.',
          ),
        ],
        answer: t(
          '图中 10 个电子；元素为 Na，位置是第 3 周期、第 1 族。',
          'Ten electrons are pictured; the element is Na in Period 3, Group 1.',
        ),
      },
      anotherWay: t(
        '像住户暂时少了一位成员，门牌号并不会自动变成隔壁家的号码。这个比喻只提醒“身份”和“当前数量”分开，不表示电子住在真实楼层上。',
        'A temporarily smaller household does not automatically take its neighbour’s address. This analogy separates identity from current counts; electrons do not live on literal floors.',
      ),
      explainPrompt: t(
        '不看选项，解释 Ca²⁺ 为什么只有三层给定电子记录，却仍属于第 4 周期元素；再说明为什么 He 不在第 2 族。',
        'Without options, explain why Ca²⁺ has three supplied occupied shells but calcium remains Period 4, then explain why He is not Group 2.',
      ),
      quickChecks: [
        q(
          'periodic107-check1',
          t(
            'Na⁺ 与 Ne 都有 10 个电子，元素是否相同？',
            'Na⁺ and Ne both have 10 electrons. Are they the same element?',
          ),
          [
            t('相同，只看电子数', 'Yes, count electrons only'),
            t('不同，还要看 Z', 'No, compare Z'),
            t(
              '无法区分，因为都是中性',
              'No distinction is possible because both are neutral',
            ),
          ],
          1,
          t(
            'Z 分别是 11 与 10；Na⁺ 也不是中性。',
            'Their Z values are 11 and 10; Na⁺ is not neutral.',
          ),
          'neutral-reference',
        ),
        q(
          'periodic107-check2',
          t(
            '中性 He 的两个电子意味着第 2 族吗？',
            'Do neutral He’s two electrons mean Group 2?',
          ),
          [
            t('不，He 在第 18 族', 'No, He is Group 18'),
            t(
              '是，族号必等于电子数',
              'Yes, group always equals electron count',
            ),
            t('He 不属于周期表', 'He is outside the periodic table'),
          ],
          0,
          t(
            'He 是本入门读法需要保留的特例。',
            'He is an exception that this introductory reading rule must retain.',
          ),
          'helium-exception',
        ),
        q(
          'periodic107-check3',
          t(
            'Ca²⁺ 记录是 2、8、8，钙元素周期是多少？',
            'Ca²⁺ is shown as 2, 8, 8. What is calcium’s period?',
          ),
          [t('2', '2'), t('3', '3'), t('4', '4')],
          2,
          t(
            '中性 Ca 为 2、8、8、2；失电子不改变其周期表位置。',
            'Neutral Ca is 2, 8, 8, 2; losing electrons does not change its periodic-table position.',
          ),
          'ion-period-check',
        ),
      ],
    },
    questions: [
      q(
        'periodic107-q1',
        t(
          'Na⁺ 给定 2、8，哪个回答同时正确？',
          'For Na⁺ shown as 2, 8, which answer is fully correct?',
        ),
        [
          t('10 电子，第 2 周期第 18 族', '10 electrons, Period 2 Group 18'),
          t('11 电子，第 3 周期第 1 族', '11 electrons, Period 3 Group 1'),
          t(
            '10 电子，钠元素在第 3 周期第 1 族',
            '10 electrons; sodium is Period 3 Group 1',
          ),
        ],
        2,
        t(
          '离子的电子数和元素位置是不同信息。',
          'Ion electron count and element position are different pieces of information.',
        ),
        'neutral-reference',
      ),
      q(
        'periodic107-q2',
        t(
          'Ca²⁺ 的给定层数少于中性 Ca，哪句成立？',
          'Ca²⁺ has fewer occupied shells than neutral Ca. Which follows?',
        ),
        [
          t(
            '元素仍是第 4 周期、第 2 族的钙',
            'The element remains calcium, Period 4 Group 2',
          ),
          t('元素已变成第 3 周期氩', 'It became Period 3 argon'),
          t('质子数也减少了两个', 'Its proton count fell by two'),
        ],
        0,
        t(
          '失去两个电子不改变 Z=20。',
          'Losing two electrons leaves Z=20 unchanged.',
        ),
        'ion-period-check',
        'application',
      ),
      q(
        'periodic107-q3',
        t('He 的位置应如何读？', 'How should He’s position be read?'),
        [
          t('1 周期、2 族', 'Period 1, Group 2'),
          t('1 周期、18 族', 'Period 1, Group 18'),
          t('2 周期、18 族', 'Period 2, Group 18'),
        ],
        1,
        t(
          '第一层两个电子的 He 属于第 18 族。',
          'He has two first-shell electrons and belongs to Group 18.',
        ),
        'helium-exception',
      ),
      q(
        'periodic107-q4',
        t(
          'Cl⁻ 与 Ar 都可写 2、8、8，能把氯放在第 18 族吗？',
          'Cl⁻ and Ar can both be 2, 8, 8. Does chlorine move to Group 18?',
        ),
        [
          t('能，最外层八个就足够', 'Yes, eight outer electrons suffice'),
          t('能，因为两者半径必相等', 'Yes, their radii must match'),
          t(
            '不能，Cl 的 Z=17，仍属第 17 族',
            'No, Cl retains Z=17 and Group 17',
          ),
        ],
        2,
        t(
          '等电子排布不改变元素身份，也不保证半径相同。',
          'Matching electron arrangements change neither element identity nor guarantee equal radii.',
        ),
        'neutral-reference',
        'application',
      ),
      q(
        'periodic107-q5',
        t(
          '本范围中性基态 K 为 2、8、8、1，其位置是？',
          'Neutral ground-state K is 2, 8, 8, 1. What is its position?',
        ),
        [
          t('1 周期、4 族', 'Period 1, Group 4'),
          t('4 周期、1 族', 'Period 4, Group 1'),
          t('3 周期、18 族', 'Period 3, Group 18'),
        ],
        1,
        t(
          '四层且最外层一个，对应第 4 周期、第 1 族。',
          'Four occupied shells and one outer electron correspond to Period 4, Group 1.',
        ),
        'main-group-position',
        'application',
      ),
      q(
        'periodic107-q6',
        t(
          '本课前 20 号排布能推出所有第三电子层最多只能有 8 个吗？',
          'Do these first-twenty arrangements prove every third shell can hold at most eight electrons?',
        ),
        [
          t(
            '不能，这是有限范围的给定排布，不是通用容量规则',
            'No, these are supplied arrangements within a limited scope',
          ),
          t(
            '能，后面所有元素都重复 2、8、8',
            'Yes, every later element repeats 2, 8, 8',
          ),
          t('能，因为离子会改变族号', 'Yes, ions change group numbers'),
        ],
        0,
        t(
          '电子层、亚层及更重元素的排布需更深模型，不能外推这个简表。',
          'Shells, subshells and heavier elements require a deeper model; do not extrapolate this small table.',
        ),
        'configuration-scope',
      ),
    ],
  },
  {
    id: 'electron-transfer-needs-both-sides',
    levelId: 'table',
    order: 108,
    nextLessonId: 'why-atoms-bond',
    title: t(
      '一个镁、一个氯，电子账本对得上吗？',
      'One magnesium, one chlorine: does the electron ledger close?',
    ),
    eyebrow: t(
      '周期表衔接 2/2 · 同一批电子有来有去',
      'Periodic bridge 2/2 · The same electrons need a source and destination',
    ),
    hook: t(
      '若每个 Mg 要失两个电子成为 Mg²⁺，每个 Cl 要得一个成为 Cl⁻，一对 Mg/Cl 就能只留下这两种指定离子并保持整体中性吗？',
      'If each Mg loses two electrons to become Mg²⁺ and each Cl gains one to become Cl⁻, can one Mg/Cl pair leave only these specified ions while preserving overall neutrality?',
    ),
    hookHint: t(
      '先算两端要转移的电子总数，不只看“正负会吸引”。同一批电子不能凭空少掉或多出。',
      'Total the electron transfer required on each side before relying on opposite-charge attraction. The same inventory cannot silently lose or create electrons.',
    ),
    bigIdea: t(
      '从中性库存假设末态只有指定正负离子时，总失电子数必须等于总得电子数；配平账本只是必要条件，不等于反应一定发生。',
      'If a neutral inventory is hypothesised to end with only specified cations and anions, total electron loss must match gain. Closing the ledger is necessary, not proof of reaction.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧂',
        title: t('Na⁺ / Cl⁻ 的一对一', 'One-to-one Na⁺ / Cl⁻'),
        body: t(
          '一 Na 各失一电子，一 Cl 各得一电子，这份数量账本可闭合；不是在画一个独立 NaCl 分子。',
          'One Na loses one electron and one Cl gains one, closing this count ledger. It is not a drawing of one discrete NaCl molecule.',
        ),
      },
      {
        icon: '🧮',
        title: t('Mg²⁺ 需要两个 Cl⁻ 对应', 'Mg²⁺ needs two Cl⁻ counterparts'),
        body: t(
          '一 Mg 提供两份电子，两 Cl 各需要一份；只配一 Cl 时，候选离子库存有未计清的电荷差。',
          'One Mg supplies two electron shares; two Cl each need one. With only one Cl, the candidate ion inventory leaves an unaccounted charge difference.',
        ),
      },
      {
        icon: '📦',
        title: t(
          '配比相等不代表最小的一批',
          'A balanced ratio need not be the smallest batch',
        ),
        body: t(
          '1 Mg 配 2 Cl 与 2 Mg 配 4 Cl 都可核对电子。批量变大不会让同一个离子的电荷自动变大。',
          'One Mg with two Cl and two Mg with four Cl both balance electrons. A larger batch does not change each ion’s charge.',
        ),
      },
    ],
    steps: [
      {
        title: t('把“每个”与“总共”分开', 'Separate per-atom and total counts'),
        body: t(
          '题目给定目标离子电荷：Mg²⁺ 每个需失 2，Cl⁻ 每个需得 1。两个 Mg 总失 2×2=4；不能只按一个 Mg 的需求算整批。',
          'Target charges are given: each Mg²⁺ requires loss of two electrons and each Cl⁻ gain of one. Two Mg require 2×2=4 lost electrons; do not use one atom’s requirement for the whole batch.',
        ),
      },
      {
        title: t(
          '同一批电子两端必须对应',
          'Match both ends of the same inventory',
        ),
        body: t(
          '若末态只计这些指定离子，又无外部电子进出，金属总失必须等于非金属总得。少于需要表示缺来源，多于需要表示缺去向；都不能把差额从账本里抹掉。',
          'If only these specified ions are counted at the end and no external electrons move in or out, total loss must equal total gain. Shortage lacks a source; surplus lacks a destination. Neither difference can be erased.',
        ),
      },
      {
        title: t('用整体电荷再检查一次', 'Audit overall charge too'),
        body: t(
          '1 Mg²⁺ 与 1 Cl⁻ 的候选总电荷为 +2−1=+1；原来的中性库存却为 0。不能把候选 +1 当成已发生的封闭系统结果；需改配比，或把遗漏的粒子及电荷也计入。',
          'A candidate of one Mg²⁺ and one Cl⁻ has charge +2−1=+1, while the starting neutral inventory has zero charge. Do not call the candidate +1 a completed closed-system outcome. Change proportions or account for omitted particles and charge.',
        ),
      },
      {
        title: t(
          '守恒检查不等于反应预测',
          'Conservation checks do not predict a reaction',
        ),
        body: t(
          '电子与电荷都对上，只说明这份候选库存没有这类矛盾。是否反应、实际产物、是否完全，还涉及能量、结构与条件。真实给料不按比例也可能有原料剩余；本图不预测这些过程。',
          'Matching electrons and charge only removes these inventory contradictions. Reaction, actual products and completion depend on energy, structure and conditions. Nonmatching real feed amounts can leave reactants over; this model predicts none of those processes.',
        ),
      },
    ],
    misconception: t(
      '“一正一负必定一对一”“配比不合就完全不会开始反应”“账本相等就一定生成晶体”都越过了证据。先说明你检查的是候选末态还是实际过程。',
      'Opposite signs do not imply one-to-one counts; unmatched feed does not prove no reaction can begin; a closed ledger does not prove crystal formation. State whether you are checking a candidate end inventory or an actual process.',
    ),
    mission: t(
      '只用虚拟模型。先找 Mg/Cl 的 1:1 为什么不闭合，再改到 1:2；换 Li/O 独立找一组能闭合的数。每次写“每个要求 × 原子个数”，并说一句模型没有证明什么。',
      'Use the virtual model only. Explain why Mg/Cl 1:1 fails to close, change to 1:2, then independently find a closing Li/O inventory. Write each per-atom requirement times count and state one thing the model has not proved.',
    ),
    vocabulary: [
      { en: 'electron inventory', zh: '电子库存' },
      { en: 'electron supply and demand', zh: '电子提供与需求' },
      { en: 'candidate ion inventory', zh: '候选离子库存' },
      { en: 'charge conservation', zh: '电荷守恒' },
    ],
    interactive: 'electron-transfer-budget-lab',
    resources: [
      ions,
      {
        title: t(
          '拓展：离子键与总电荷',
          'Read more: ionic bonding and total charge',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/7-1-ionic-bonding',
      },
    ],
    learning: {
      prerequisites: [
        'neutral-atoms-before-table-position',
        'coefficients-and-molecular-subscripts',
      ],
      objectives: [
        t(
          '由给定离子电荷算每批总失、总得电子数。',
          'Calculate total electron loss and gain from supplied ion charges.',
        ),
        t(
          '用电荷与电子总账识别不完整的候选库存。',
          'Use charge and electron totals to identify incomplete candidate inventories.',
        ),
        t(
          '区分守恒的必要条件与反应是否发生的判断。',
          'Distinguish necessary conservation checks from whether a reaction occurs.',
        ),
      ],
      workedExample: {
        prompt: t(
          '题设只计 Mg²⁺ 与 Cl⁻，从中性库存开始。1 Mg 配 1 Cl 为何不闭合，怎样改一项可核对？',
          'Only Mg²⁺ and Cl⁻ are counted in a candidate starting from neutral atoms. Why does 1 Mg with 1 Cl fail, and how can one count be changed?',
        ),
        steps: [
          t(
            '1 Mg 需失 2 个电子，1 Cl 需得 1 个，失与得不相等。',
            'One Mg must lose two electrons; one Cl must gain one. The counts differ.',
          ),
          t(
            '若只写这两个离子，总电荷是 +2−1=+1，没有保留原来的零总电荷。',
            'Those two ions alone total +2−1=+1, not the initial zero charge.',
          ),
          t(
            '保留 1 Mg，把 Cl 改为 2 个，总得与总失都为 2，总电荷 +2−2=0。',
            'Keep one Mg and use two Cl: both loss and gain are two, and charge is +2−2=0.',
          ),
        ],
        answer: t(
          '候选改为 1 Mg²⁺ 与 2 Cl⁻，电子和电荷账本均闭合；仍未证明实际反应条件或产率。',
          'One Mg²⁺ with two Cl⁻ closes both ledgers, without proving actual reaction conditions or yield.',
        ),
      },
      anotherWay: t(
        '像同一批包裹要有寄出数和签收数：两端不相等，账本还没解释完。包裹比喻不解释化学能量，也不意味着电子沿图中箭头按固定路线运动。',
        'Like one shipment needing matching dispatch and receipt counts, unequal totals leave the ledger incomplete. This analogy explains neither chemical energy nor literal fixed electron paths along an arrow.',
      ),
      explainPrompt: t(
        '不看选项，解释 Mg/Cl 的 1:1 与 1:2 候选有何区别，再说为什么“电子对上了”仍不能证明必然发生反应。',
        'Without options, compare Mg/Cl 1:1 and 1:2 candidates, then explain why matched electrons still do not prove a reaction must occur.',
      ),
      quickChecks: [
        q(
          'periodic108-check1',
          t(
            '两个 Mg 各失 2 个，总失电子数为？',
            'Two Mg each lose two electrons. What is the total?',
          ),
          [t('2', '2'), t('3', '3'), t('4', '4')],
          2,
          t(
            '每个要求乘个数，2×2=4。',
            'Multiply per-atom requirement by count: 2×2=4.',
          ),
          'per-atom-vs-total',
        ),
        q(
          'periodic108-check2',
          t(
            '1 Mg²⁺ 与 2 Cl⁻ 的候选总电荷为？',
            'What is the candidate charge of one Mg²⁺ and two Cl⁻?',
          ),
          [t('0', '0'), t('+1', '+1'), t('−1', '−1')],
          0,
          t('+2+2×(−1)=0。', '+2+2×(−1)=0.'),
          'candidate-charge',
        ),
        q(
          'periodic108-check3',
          t(
            '电子供需相等就能证明生成晶体吗？',
            'Do matching electron counts prove crystal formation?',
          ),
          [
            t('能，不再需要其他条件', 'Yes, no other conditions matter'),
            t(
              '不能，这只是必要库存检查',
              'No, this is a necessary inventory check',
            ),
            t('能，因为电子没有质量', 'Yes, because electrons are massless'),
          ],
          1,
          t(
            '还需考虑实际能量、结构与条件。',
            'Actual energy, structure and conditions still matter.',
          ),
          'necessary-not-sufficient',
        ),
      ],
    },
    questions: [
      q(
        'periodic108-q1',
        t(
          '1 Mg 与 1 Cl 假设全成为 Mg²⁺、Cl⁻，电子供需为？',
          'If one Mg and one Cl are all specified as Mg²⁺ and Cl⁻, what are electron supply and demand?',
        ),
        [
          t('1 和 2，完全对应', '1 and 2, matching'),
          t('2 和 1，尚有差额', '2 and 1, leaving a difference'),
          t('2 和 2，完全对应', '2 and 2, matching'),
        ],
        1,
        t(
          '每个 Mg 失 2，每个 Cl 得 1；候选还缺完整去向记录。',
          'Each Mg loses two and each Cl gains one; the candidate lacks a complete destination record.',
        ),
        'electron-matching',
      ),
      q(
        'periodic108-q2',
        t(
          '两 Mg 各变成 Mg²⁺，需要几个 Cl 各变成 Cl⁻ 才能只由这些离子闭合？',
          'For two Mg²⁺, how many Cl⁻ close a ledger containing only these ions?',
        ),
        [t('1', '1'), t('2', '2'), t('4', '4')],
        2,
        t(
          '两 Mg 共失 4，需四 Cl 各得 1。',
          'Two Mg lose four electrons, requiring four Cl to gain one each.',
        ),
        'per-atom-vs-total',
        'application',
      ),
      q(
        'periodic108-q3',
        t(
          '指定 Li⁺ 和 O²⁻，哪组原子数的电子账本相等？',
          'For specified Li⁺ and O²⁻, which atom counts match electron transfer?',
        ),
        [
          t('2 Li、1 O', '2 Li, 1 O'),
          t('1 Li、1 O', '1 Li, 1 O'),
          t('1 Li、2 O', '1 Li, 2 O'),
        ],
        0,
        t(
          '两个 Li 各失 1，一个 O 得 2。',
          'Two Li each lose one; one O gains two.',
        ),
        'electron-transfer',
        'application',
      ),
      q(
        'periodic108-q4',
        t(
          '候选 1 Mg²⁺ 加 1 Cl⁻ 的 +1 总电荷，应该怎样理解？',
          'How should the +1 charge of a candidate Mg²⁺/Cl⁻ pair be interpreted?',
        ),
        [
          t(
            '已证明中性封闭系统凭空带了正电',
            'A neutral closed system has gained charge from nowhere',
          ),
          t(
            '说明这个末态库存还不完整，不能当作已实现的封闭结果',
            'The candidate end inventory is incomplete, not a realised closed-system result',
          ),
          t('说明中子被变成电子', 'Neutrons became electrons'),
        ],
        1,
        t(
          '从中性出发要核对完整电荷；改变配比或补入遗漏物种才能继续解释。',
          'Audit total charge from neutrality; change proportions or account for omitted species.',
        ),
        'candidate-charge',
      ),
      q(
        'periodic108-q5',
        t(
          '1 Mg 配 2 Cl 与 2 Mg 配 4 Cl 都可对账，哪句正确？',
          'Both 1 Mg/2 Cl and 2 Mg/4 Cl balance. Which is correct?',
        ),
        [
          t(
            '第二组的每个 Mg 离子应变成 +4',
            'Each Mg ion in the second batch becomes +4',
          ),
          t('只有较小一组能守恒', 'Only the smaller batch conserves charge'),
          t(
            '批量变大，每个离子电荷不变，总转移电子数成倍增加',
            'Ion charges stay fixed while the larger batch transfers more electrons',
          ),
        ],
        2,
        t(
          '区分每个离子的电荷与整批电子总数。',
          'Distinguish each ion’s charge from total electrons in the batch.',
        ),
        'batch-scaling',
        'application',
      ),
      q(
        'periodic108-q6',
        t(
          '模型电子账本闭合后，还不能推出什么？',
          'What cannot yet be concluded after this electron ledger closes?',
        ),
        [
          t(
            '实际反应一定发生并完全生成晶体',
            'An actual reaction must occur and completely form a crystal',
          ),
          t('此候选中总失等于总得', 'Candidate loss equals gain'),
          t('此候选的离子总电荷可为零', 'Candidate ion charge can total zero'),
        ],
        0,
        t(
          '数量守恒是必要检查，不是完整的反应、能量和动力学模型。',
          'Conservation is necessary, not a complete model of reaction, energetics or kinetics.',
        ),
        'necessary-not-sufficient',
      ),
    ],
  },
];
