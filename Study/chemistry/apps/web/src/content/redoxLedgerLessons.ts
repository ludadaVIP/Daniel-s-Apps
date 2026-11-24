import type { LocalizedText } from '@study/shared';
import type { Lesson, LessonQuestion } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
function q(
  id: string,
  prompt: LocalizedText,
  options: LocalizedText[],
  answer: number,
  explanation: LocalizedText,
  conceptIds: string[],
  kind: LessonQuestion['kind'] = 'reasoning',
): LessonQuestion {
  return { id, prompt, options, answer, explanation, conceptIds, kind };
}
const numbersReading = {
  title: t(
    '拓展：氧化数及其规则',
    'Read more: oxidation numbers and their rules',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions',
};
const halfReading = {
  title: t('拓展：氧化还原与半反应', 'Read more: redox and half-reactions'),
  url: 'https://openstax.org/books/chemistry-2e/pages/17-1-review-of-redox-chemistry',
};

export const redoxLedgerLessons: Lesson[] = [
  {
    id: 'oxidation-number-and-charge',
    levelId: 'metals',
    order: 94,
    title: t(
      '电荷变了就是氧化还原吗？分清两本账',
      'Does a charge change mean redox? Separate two ledgers',
    ),
    eyebrow: t(
      '第 94 课 · 电子账本 1/3：实际电荷与氧化数',
      'Lesson 94 · Electron ledgers 1/3: charge and oxidation number',
    ),
    hook: t(
      '中性 NH₃ 接受 H⁺ 后成为 NH₄⁺，电荷从 0 变成 +1；这是否说明 N 失去了一个电子？要回答，必须分清整个粒子的电荷和元素的氧化数。',
      'Neutral NH₃ accepts H⁺ to become NH₄⁺, changing charge from 0 to +1. Does that mean N lost an electron? Separate whole-species charge from an element’s oxidation number.',
    ),
    hookHint: t(
      '把每个元素的氧化数乘原子个数，所有贡献相加，应等于整个物种的电荷数；再比较同一个元素反应前后的数值。',
      'Multiply each oxidation number by its atom count and sum to the whole-species charge. Then compare the same element before and after reaction.',
    ),
    bigIdea: t(
      '氧化数是按约定分配电子的形式账本，不等于共价分子中原子的实测净电荷；判断氧化还原要追踪元素的氧化数变化。',
      'Oxidation numbers are formal electron-assignment bookkeeping, not measured atomic net charges in covalent molecules. Identify redox by tracking changes for the elements.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🧾',
        title: t('总账与分项账', 'Total and itemised accounts'),
        body: t(
          'CO₃²⁻ 整体电荷为 −2，但 C 的氧化数不是 −2。三个 O 各为 −2 时，C 必须为 +4，贡献之和才是 −2。',
          'CO₃²⁻ has total charge −2, but C is not assigned −2. With three O each at −2, C must be +4 so the total is −2.',
        ),
      },
      {
        icon: '💧',
        title: t('接回质子转移课', 'Reconnect to proton transfer'),
        body: t(
          'NH₃ 与 NH₄⁺ 的 N 都为 −3。多一个 H⁺ 使整体电荷改变，并不自动意味着 N 的氧化数改变。',
          'N is −3 in both NH₃ and NH₄⁺. Adding H⁺ changes the total charge without automatically changing N’s oxidation number.',
        ),
      },
      {
        icon: '🔎',
        title: t('用反例检查口诀', 'Test a rule with a counterexample'),
        body: t(
          'O₂ 单质中 O 为 0，H₂O₂ 中 O 为 −1。氧通常为 −2 是常用规则，不是无条件的常数。这里只做符号比较，不操作过氧化物。',
          'O is 0 in elemental O₂ and −1 in H₂O₂. The usual −2 rule is not an unconditional constant. These are symbolic comparisons, not peroxide activities.',
        ),
      },
    ],
    steps: [
      {
        title: t('先认清整体电荷', 'Start with overall charge'),
        body: t(
          'HCl、NH₃ 是中性分子，电荷总数为 0；Cl⁻、NH₄⁺ 则分别为 −1、+1。这个数属于整个物种，不应不加判断地抄给其中某个原子。',
          'HCl and NH₃ are neutral with total charge 0; Cl⁻ and NH₄⁺ have −1 and +1. That number belongs to the whole species and cannot be copied indiscriminately onto one atom.',
        ),
      },
      {
        title: t(
          '按原子个数建立氧化数总账',
          'Weight oxidation numbers by atom counts',
        ),
        body: t(
          '本课含非金属的示例中 H 取 +1。NH₃ 中 x+3×(+1)=0，所以 N 为 −3；NH₄⁺ 中 x+4×(+1)=+1，所以 N 仍为 −3。氧化数是形式分配，不是把 N 画成游离 N³⁻。',
          'For these nonmetal-containing examples H is +1. In NH₃, x+3×(+1)=0 gives N=−3; in NH₄⁺, x+4×(+1)=+1 still gives −3. This is a formal assignment, not a claim of free N³⁻ ions.',
        ),
      },
      {
        title: t(
          '把同一元素前后对上',
          'Match the same element before and after',
        ),
        body: t(
          'HCl 中 H 为 +1、Cl 为 −1；转为 H₃O⁺ 和 Cl⁻ 后对应氧化数不变。相比之下 Zn(s) 的 Zn 为 0，形成 Zn²⁺ 后为 +2，才出现氧化数上升。',
          'H is +1 and Cl is −1 in HCl; their corresponding values remain unchanged in H₃O⁺ and Cl⁻. By contrast, Zn goes from 0 in Zn(s) to +2 in Zn²⁺, an oxidation-number increase.',
        ),
      },
      {
        title: t(
          '用适用条件约束规则',
          'Keep the rules within their conditions',
        ),
        body: t(
          '单质中元素为 0；单原子离子与电荷数相同。化合物中的常用 H、O 赋值有例外。本课每张卡都给已知值，再由总账求未知值，不靠“氧永远 −2”硬套。',
          'An element in elemental form is 0; a monatomic ion matches its charge number. Common H and O assignments in compounds have exceptions. Each card supplies known values and asks you to solve the remaining entry instead of forcing “O is always −2”.',
        ),
      },
    ],
    misconception: t(
      '整体电荷、单原子离子电荷、氧化数是相关但不同的概念。电荷改变不一定是氧化还原；对共价物种写氧化数，也不等于每个原子真的带那个整数净电荷。',
      'Overall charge, monatomic-ion charge and oxidation number are related but distinct. A charge change need not be redox, and a formal integer oxidation number is not necessarily an actual atomic net charge.',
    ),
    mission: t(
      '把 NH₃/NH₄⁺、HCl/Cl⁻ 各画成一组，分别写“整体电荷”和“指定元素氧化数”两栏。先预测哪些变、哪些不变，再核对；只需纸笔。',
      'Draw NH₃/NH₄⁺ and HCl/Cl⁻ pairs with separate overall-charge and element-oxidation-number columns. Predict which entries change before checking; use paper only.',
    ),
    vocabulary: [
      { en: 'oxidation number', zh: '氧化数' },
      { en: 'overall charge', zh: '整体电荷' },
      { en: 'formal assignment', zh: '形式赋值' },
      { en: 'elemental form', zh: '单质形式' },
    ],
    interactive: 'oxidation-number-ledger-lab',
    resources: [numbersReading, halfReading],
    learning: {
      prerequisites: [
        'proton-donor-and-acceptor',
        'metal-displacement-electron-story',
        'net-ionic-equation-detective',
      ],
      objectives: [
        t(
          '用加权总和求简单物种的氧化数。',
          'Use weighted sums to find simple oxidation numbers.',
        ),
        t(
          '区分整体电荷改变与元素氧化数改变。',
          'Distinguish overall-charge changes from oxidation-number changes.',
        ),
        t(
          '用单质与过氧化物反例限制口诀。',
          'Use elemental and peroxide counterexamples to qualify rules.',
        ),
      ],
      workedExample: {
        prompt: t(
          'CO₃²⁻ 中已知 O 为 −2，C 的氧化数是多少？',
          'In CO₃²⁻, O is given as −2. What is C’s oxidation number?',
        ),
        steps: [
          t('共有三个 O，贡献为 3×(−2)=−6。', 'Three O contribute 3×(−2)=−6.'),
          t(
            '整体电荷为 −2，所以 x−6=−2。',
            'The overall charge is −2, so x−6=−2.',
          ),
          t('解得 x=+4；核对 +4−6=−2。', 'Thus x=+4; check +4−6=−2.'),
        ],
        answer: t(
          'C 为 +4，整个离子为 −2；两者不矛盾，也不表示存在一个独立 C⁴⁺。',
          'C is +4 while the ion is −2. There is no contradiction or claim of an isolated C⁴⁺.',
        ),
      },
      anotherWay: t(
        '整体电荷像一张账单的总额，氧化数贡献像按约定分配的分项。总额为 −2 不代表每个分项都为 −2；还要乘该元素的原子个数。',
        'Overall charge is the bill total; oxidation-number contributions are conventionally assigned line items. A total of −2 does not make every line item −2, and each must include its atom count.',
      ),
      explainPrompt: t(
        '不用“有正负号就是氧化还原”，解释 NH₃ 接受 H⁺ 成为 NH₄⁺ 为什么不使 N 被氧化；请列出两条加权等式。',
        'Explain why accepting H⁺ to form NH₄⁺ does not oxidise N. Give both weighted equations instead of relying on the appearance of a charge sign.',
      ),
      quickChecks: [
        q(
          'redox94-check1',
          t(
            'Cl⁻ 是单原子离子，Cl 的氧化数是多少？',
            'What is the oxidation number of Cl in monatomic Cl⁻?',
          ),
          [t('−1', '−1'), t('0', '0'), t('+1', '+1')],
          0,
          t(
            '单原子离子与其电荷数相同。',
            'A monatomic ion’s oxidation number equals its charge number.',
          ),
          ['oxidation-number'],
          'recall',
        ),
        q(
          'redox94-check2',
          t(
            'NH₄⁺ 中四个 H 各为 +1，N 是多少？',
            'Four H in NH₄⁺ are each +1. What is N?',
          ),
          [t('+1', '+1'), t('−3', '−3'), t('−4', '−4')],
          1,
          t(
            'x+4=+1，故 x=−3，不能把离子整体的 +1 抄给 N。',
            'x+4=+1 gives x=−3; the overall +1 cannot simply be assigned to N.',
          ),
          ['weighted-charge-sum'],
          'application',
        ),
        q(
          'redox94-check3',
          t(
            'O₂ 单质中氧的氧化数是多少？',
            'What is O’s oxidation number in elemental O₂?',
          ),
          [t('−2', '−2'), t('+2', '+2'), t('0', '0')],
          2,
          t(
            '单质的氧化数为 0，两个原子不会把它改成 −2。',
            'An element in elemental form is assigned 0; having two atoms does not make it −2.',
          ),
          ['oxidation-number-exceptions'],
        ),
      ],
    },
    questions: [
      q(
        'redox94-q1',
        t('CO₃²⁻ 中 O 为 −2，C 应为多少？', 'In CO₃²⁻, O is −2. What is C?'),
        [t('−2', '−2'), t('−6', '−6'), t('+4', '+4')],
        2,
        t('x+3×(−2)=−2，所以 x=+4。', 'x+3×(−2)=−2 gives x=+4.'),
        ['weighted-charge-sum'],
        'application',
      ),
      q(
        'redox94-q2',
        t(
          'NH₃ 变为 NH₄⁺，N 从 −3 变成什么？',
          'NH₃ becomes NH₄⁺. N changes from −3 to what?',
        ),
        [t('仍是 −3', 'It remains −3'), t('+1', '+1'), t('0', '0')],
        0,
        t(
          '两个加权总账分别为 x+3=0、x+4=+1，解都为 −3。',
          'The equations x+3=0 and x+4=+1 both give −3.',
        ),
        ['proton-transfer-versus-redox'],
      ),
      q(
        'redox94-q3',
        t(
          'HCl 中 Cl 为 −1，形成 Cl⁻ 后仍为 −1，这说明什么？',
          'Cl is −1 in HCl and remains −1 in Cl⁻. What does this show?',
        ),
        [
          t('Cl 一定失去电子', 'Cl must have lost electrons'),
          t(
            '这个变化没有使 Cl 氧化数改变',
            'This change does not alter Cl’s oxidation number',
          ),
          t('Cl 原子核变成了 H', 'Cl nuclei changed into H'),
        ],
        1,
        t(
          '物种身份与整体电荷改变，不自动等于相关元素氧化数改变。',
          'Species identity and total charge can change without changing the element’s oxidation number.',
        ),
        ['proton-transfer-versus-redox'],
      ),
      q(
        'redox94-q4',
        t(
          'H₂O₂ 中 H 为 +1，两个 O 各为多少？',
          'In H₂O₂, H is +1. What is each O?',
        ),
        [t('−1', '−1'), t('−2', '−2'), t('0', '0')],
        0,
        t('2×(+1)+2x=0，解得 x=−1。', '2×(+1)+2x=0 gives x=−1.'),
        ['oxidation-number-exceptions'],
        'application',
      ),
      q(
        'redox94-q5',
        t(
          '对共价分子中的氧化数，哪句话准确？',
          'Which statement about oxidation numbers in covalent molecules is accurate?',
        ),
        [
          t(
            '就是每个原子的实测整数净电荷',
            'They are measured integer net atomic charges',
          ),
          t('与整体电荷没有关系', 'They have no relation to overall charge'),
          t(
            '是形式赋值，其加权和等于整体电荷',
            'They are formal assignments whose weighted sum equals overall charge',
          ),
        ],
        2,
        t(
          '这是电子分配约定，不能把它直接画成真实独立离子；总账仍须相符。',
          'These follow an electron-assignment convention, not a claim of isolated real ions; the total must still match.',
        ),
        ['formal-versus-actual-charge'],
      ),
      q(
        'redox94-q6',
        t(
          'Zn(s) 变为 Zn²⁺(aq)，Zn 的氧化数怎样变？',
          'How does Zn’s oxidation number change in Zn(s) → Zn²⁺(aq)?',
        ),
        [
          t('+2 到 0', '+2 to 0'),
          t('0 到 +2', '0 to +2'),
          t('始终 −2', 'It stays −2'),
        ],
        1,
        t(
          '单质为 0，单原子 Zn²⁺ 为 +2；数值上升对应氧化。',
          'Elemental Zn is 0 and monatomic Zn²⁺ is +2; an increase corresponds to oxidation.',
        ),
        ['oxidation-direction'],
        'application',
      ),
    ],
  },
  {
    id: 'half-reactions-electron-balance',
    levelId: 'metals',
    order: 95,
    title: t(
      '电子不能多给少收：把两个半反应接起来',
      'Match the electrons: connect two half-reactions',
    ),
    eyebrow: t(
      '第 95 课 · 电子账本 2/3：失去多少，接受多少',
      'Lesson 95 · Electron ledgers 2/3: match losses and gains',
    ),
    hook: t(
      '一个 Al 变为 Al³⁺ 给出 3e⁻，一个 Cu²⁺ 变为 Cu 接受 2e⁻。如果只各取一份，多出的那个电子怎么办？',
      'One Al becoming Al³⁺ gives 3e⁻; one Cu²⁺ becoming Cu accepts 2e⁻. If we use one of each, what accounts for the extra electron?',
    ),
    hookHint: t(
      '不改物种的下标与电荷，改整个半反应的份数。寻找能让失电子总数与得电子总数相同的整数倍。',
      'Keep species subscripts and charges unchanged. Multiply entire half-reactions to make total electrons lost equal total electrons gained.',
    ),
    bigIdea: t(
      '完整氧化还原反应中，给出与接受的电子数必须相等；半反应整体倍乘后相加，电子从总方程式中消去。',
      'In a complete redox reaction, electrons lost and gained must match. Scale entire half-reactions and add them so electrons cancel from the net equation.',
    ),
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🧮',
        title: t('三张一包，对两张一包', 'Packs of three and packs of two'),
        body: t(
          '3 与 2 的最小共同总数是 6，需要 2 包给出者和 3 包接受者。这个比来自电子账本，不是任意交换系数。',
          'The smallest common total for 3 and 2 is 6, requiring two donor packs and three acceptor packs. The ratio comes from electron accounting, not arbitrary coefficients.',
        ),
      },
      {
        icon: '🔋',
        title: t('接回电池的电子路线', 'Reconnect to battery electron routes'),
        body: t(
          '电池中失电子与得电子在不同位置发生，仍必须相互配合。半反应分开书写，是为了看清这两部分。',
          'Electron loss and gain occur at different locations in a battery but must still match. Separate half-reactions make the two parts visible.',
        ),
      },
      {
        icon: '🧾',
        title: t('还原剂自身被氧化', 'The reducing agent is itself oxidised'),
        body: t(
          'Zn 给出电子，使 Cu²⁺ 被还原，所以 Zn 是还原剂。名字描述它帮助另一方发生什么，而不是自己最后的状态。',
          'Zn gives electrons and causes Cu²⁺ to be reduced, making Zn the reducing agent. The name describes what it does to the other participant, not its own final change.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先配平单个半反应的电荷',
          'Balance each half-reaction’s charge',
        ),
        body: t(
          'Al → Al³⁺ + 3e⁻，右侧 +3−3=0，与左侧相同。Cu²⁺ + 2e⁻ → Cu，左侧 +2−2=0。电子应放在哪边，由物种电荷变化决定。',
          'Al → Al³⁺ + 3e⁻ has right charge +3−3=0, matching the left. Cu²⁺ + 2e⁻ → Cu has left charge +2−2=0. Charge changes determine which side contains electrons.',
        ),
      },
      {
        title: t('找共同电子总数', 'Find a common electron total'),
        body: t(
          '给出每份 3、接受每份 2；最小共同总数为 6。氧化半反应乘 2，还原半反应乘 3，使两边各记 6e⁻。',
          'The donor gives 3 and the acceptor takes 2 per unit. Their least common total is 6: multiply oxidation by 2 and reduction by 3 to record 6e⁻ on each side.',
        ),
      },
      {
        title: t('倍数乘整条式子', 'Scale every term in each half-reaction'),
        body: t(
          '乘 2 后是 2Al → 2Al³⁺ + 6e⁻；乘 3 后是 3Cu²⁺ + 6e⁻ → 3Cu。不能只乘电子，也不能把 Al³⁺ 的电荷改掉。',
          'Scaling gives 2Al → 2Al³⁺ + 6e⁻ and 3Cu²⁺ + 6e⁻ → 3Cu. Do not multiply only electrons or change the charge on Al³⁺.',
        ),
      },
      {
        title: t('相加后复核原子与电荷', 'Add and audit atoms and charge'),
        body: t(
          '相加得到 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu。Al、Cu 数目各守恒，左右总电荷均为 +6。守恒要求两边相等，不要求都为零。配平只说明账本一致，不单独证明实际反应方向、速率或产率。',
          'Adding gives 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu. Al and Cu counts match, and each side has charge +6. Conservation requires equal charges, not necessarily zero. A balanced ledger alone does not establish real direction, rate or yield.',
        ),
      },
    ],
    misconception: t(
      '半反应倍乘必须乘每一项。4Al 与 6Cu²⁺ 也可配平，但能约成 2∶3；不能因为不是最简比就说完全不守恒。电子记在半反应中，也不表示自由电子在水里堆积。',
      'Scale every term in a half-reaction. 4Al with 6Cu²⁺ also balances but reduces to 2:3; nonminimal does not mean nonconserving. Electron entries in half-reactions do not depict free electrons accumulating in water.',
    ),
    mission: t(
      '用每包三张与每包两张的纸卡模拟电子数，先找最小配对，再故意把两边同时翻倍。解释为什么两次都守恒，但只有一次是最简整数比。',
      'Use paper packs of three and two to model electron counts. Find the smallest match, then double both sides. Explain why both conserve electrons but only one is the simplest whole-number ratio.',
    ),
    vocabulary: [
      { en: 'half-reaction', zh: '半反应' },
      { en: 'oxidation / reduction', zh: '氧化／还原' },
      { en: 'reducing agent', zh: '还原剂' },
      { en: 'oxidising agent', zh: '氧化剂' },
    ],
    interactive: 'electron-balance-ledger-lab',
    resources: [halfReading],
    learning: {
      prerequisites: [
        'oxidation-number-and-charge',
        'balancing-equations',
        'metal-displacement-electron-story',
      ],
      objectives: [
        t(
          '按电荷守恒确定半反应中的电子数。',
          'Determine half-reaction electron counts from charge conservation.',
        ),
        t(
          '用整体倍乘配平电子并写净反应。',
          'Scale whole half-reactions to match electrons and write the net reaction.',
        ),
        t(
          '区分配平、最简比与实际发生的证据。',
          'Distinguish balancing, simplest ratios and evidence of actual reaction.',
        ),
      ],
      workedExample: {
        prompt: t(
          '把 Zn → Zn²⁺ + 2e⁻ 与 Ag⁺ + e⁻ → Ag 合并成最简整数式。',
          'Combine Zn → Zn²⁺ + 2e⁻ and Ag⁺ + e⁻ → Ag in the simplest whole-number ratio.',
        ),
        steps: [
          t(
            '每份 Zn 给出 2e⁻，每份 Ag⁺ 接受 1e⁻。',
            'Each Zn gives 2e⁻ and each Ag⁺ accepts 1e⁻.',
          ),
          t(
            '保留一份氧化，取两份还原；整条还原式乘 2。',
            'Keep one oxidation unit and take two reduction units, scaling the entire reduction equation by 2.',
          ),
          t(
            '相加消去 2e⁻；核对 Zn、Ag 数目和左右 +2 电荷。',
            'Add and cancel 2e⁻; audit Zn and Ag counts and +2 charge on both sides.',
          ),
        ],
        answer: t(
          'Zn + 2Ag⁺ → Zn²⁺ + 2Ag；Zn 是还原剂，Ag⁺ 是氧化剂。',
          'Zn + 2Ag⁺ → Zn²⁺ + 2Ag; Zn is the reducing agent and Ag⁺ the oxidising agent.',
        ),
      },
      anotherWay: t(
        '电子账本像两个必须结清的收支栏：一边登记给出，另一边登记接受。每种物种的单份数固定，能调整的是整套反应的份数，不是偷偷改每份电子数。',
        'Think of two accounts that must settle: electrons given and electrons accepted. Each species has a fixed per-unit amount; adjust whole reaction units instead of quietly changing the amount per unit.',
      ),
      explainPrompt: t(
        '不用死记系数，解释 Al/Cu²⁺ 为什么需要 2∶3；再解释 4∶6 哪里正确、哪里仍可简化。',
        'Explain the 2:3 Al/Cu²⁺ ratio without memorising coefficients, then explain what is valid and reducible about 4:6.',
      ),
      quickChecks: [
        q(
          'redox95-check1',
          t(
            'Zn → Zn²⁺ 时，电子应记在哪边？',
            'In Zn → Zn²⁺, on which side should electrons appear?',
          ),
          [
            t('左边加 2e⁻', 'Add 2e⁻ on the left'),
            t('右边加 2e⁻', 'Add 2e⁻ on the right'),
            t('两边各加 1e⁻ 即可', 'Add 1e⁻ to each side'),
          ],
          1,
          t(
            '右侧 +2 加 −2 才与左侧的 0 一致。',
            'Right-side +2 plus −2 matches the left-side zero.',
          ),
          ['half-reaction-charge'],
        ),
        q(
          'redox95-check2',
          t(
            'Al 每份给 3e⁻、Cu²⁺ 每份收 2e⁻，最小共同数是多少？',
            'Al gives 3e⁻ per unit and Cu²⁺ takes 2e⁻. What is the least common total?',
          ),
          [t('6e⁻', '6e⁻'), t('5e⁻', '5e⁻'), t('1e⁻', '1e⁻')],
          0,
          t(
            '2×3=3×2=6，故份数比为 2∶3。',
            '2×3=3×2=6, so the reaction-unit ratio is 2:3.',
          ),
          ['electron-matching'],
          'application',
        ),
        q(
          'redox95-check3',
          t(
            '把 Ag⁺ + e⁻ → Ag 乘 2，哪项正确？',
            'Which is twice Ag⁺ + e⁻ → Ag?',
          ),
          [
            t('Ag⁺ + 2e⁻ → Ag', 'Ag⁺ + 2e⁻ → Ag'),
            t('Ag²⁺ + 2e⁻ → Ag', 'Ag²⁺ + 2e⁻ → Ag'),
            t('2Ag⁺ + 2e⁻ → 2Ag', '2Ag⁺ + 2e⁻ → 2Ag'),
          ],
          2,
          t(
            '每项都乘 2，物种身份与电荷不变。',
            'Every term is doubled; species identity and charge remain unchanged.',
          ),
          ['whole-half-reaction-scaling'],
        ),
      ],
    },
    questions: [
      q(
        'redox95-q1',
        t(
          'Cu²⁺ 变成 Cu，需要多少电子？',
          'How many electrons are needed for Cu²⁺ → Cu?',
        ),
        [
          t('失去 2e⁻', 'Lose 2e⁻'),
          t('得到 2e⁻', 'Gain 2e⁻'),
          t('得到 1e⁻', 'Gain 1e⁻'),
        ],
        1,
        t(
          '+2 的物种接受两个负电荷单位后总电荷成为 0。',
          'A +2 species accepts two negative charge units to reach zero.',
        ),
        ['half-reaction-charge'],
      ),
      q(
        'redox95-q2',
        t(
          'Al/Cu²⁺ 半反应的最简份数比是什么？',
          'What is the simplest Al/Cu²⁺ half-reaction ratio?',
        ),
        [t('2∶3', '2:3'), t('3∶2', '3:2'), t('1∶1', '1:1')],
        0,
        t(
          '每份给 3 与收 2，2×3=3×2=6。',
          'With 3 given and 2 accepted per unit, 2×3=3×2=6.',
        ),
        ['electron-matching'],
        'application',
      ),
      q(
        'redox95-q3',
        t(
          '4Al + 6Cu²⁺ → 4Al³⁺ + 6Cu 应怎样评价？',
          'How should 4Al + 6Cu²⁺ → 4Al³⁺ + 6Cu be assessed?',
        ),
        [
          t('完全不守恒', 'It does not conserve anything'),
          t('已经是最简比', 'It is already simplest'),
          t(
            '守恒，但所有系数可除以 2',
            'It conserves, but all coefficients can be divided by 2',
          ),
        ],
        2,
        t(
          '左右原子、电荷及电子账本均一致，只是可约为 2∶3。',
          'Atoms, charge and electron accounting match; the ratio reduces to 2:3.',
        ),
        ['balanced-versus-simplest'],
      ),
      q(
        'redox95-q4',
        t(
          'Zn 把电子给 Cu²⁺，Zn 是什么角色？',
          'Zn gives electrons to Cu²⁺. What is Zn’s role?',
        ),
        [
          t('还原剂，自身被氧化', 'Reducing agent, itself oxidised'),
          t('氧化剂，自身被还原', 'Oxidising agent, itself reduced'),
          t('完全不参与反应', 'It does not participate'),
        ],
        0,
        t(
          '它使另一方得到电子而还原，自己失去电子而氧化。',
          'It causes the other species to gain electrons and be reduced while itself losing electrons and being oxidised.',
        ),
        ['redox-agents'],
      ),
      q(
        'redox95-q5',
        t(
          '一条式子配平后，能单独证明什么？',
          'What does balancing an equation alone establish?',
        ),
        [
          t('一定很快发生', 'It must happen rapidly'),
          t('一定达到 100% 产率', 'It must give 100% yield'),
          t(
            '指定物种的组成与电荷账本相容',
            'The specified compositions and charges are consistent',
          ),
        ],
        2,
        t(
          '方向、速率、表面膜与产率需要其他条件或证据。',
          'Direction, rate, surface films and yield need additional conditions or evidence.',
        ),
        ['model-limits'],
      ),
      q(
        'redox95-q6',
        t(
          'Zn 给 2e⁻、Ag⁺ 收 1e⁻，合并式中 Ag⁺ 系数应为多少？',
          'Zn gives 2e⁻ and Ag⁺ takes 1e⁻. What is the Ag⁺ coefficient in the simplest combined equation?',
        ),
        [t('1', '1'), t('2', '2'), t('3', '3')],
        1,
        t(
          '一份 Zn 对两份 Ag⁺，同时给出与接受 2e⁻。',
          'One Zn matches two Ag⁺, giving and accepting 2e⁻.',
        ),
        ['electron-matching'],
        'application',
      ),
    ],
  },
  {
    id: 'redox-limits-and-leftovers',
    levelId: 'metals',
    order: 96,
    title: t(
      '铜从哪里来，反应后还剩什么？',
      'Where does the copper come from—and what remains?',
    ),
    eyebrow: t(
      '第 96 课 · 电子账本 3/3：把电子比接到产量',
      'Lesson 96 · Electron ledgers 3/3: connect electron ratios to yield',
    ),
    hook: t(
      '2 mmol Zn 遇到含 5 mmol Cu²⁺ 的溶液，能得到 5 mmol 铜吗？如果最后收集到的固体还夹着原金属，能直接把它全算成铜吗？',
      'Can 2 mmol Zn produce 5 mmol copper from a solution containing 5 mmol Cu²⁺? If collected solids include original metal, can their entire mass be counted as copper?',
    ),
    hookHint: t(
      '先配平电子，再找限制量。把水相、剩余原金属和新生成铜分开记录，最后才计算铜的理论质量。',
      'Balance electrons before finding the limiting amount. Keep solution, leftover original metal and newly formed copper separate before calculating theoretical copper mass.',
    ),
    bigIdea: t(
      '产量受配平反应比例与限制反应物控制；完整守恒账本同时包括剩余固体、生成固体和水相离子，电子只在内部转移。',
      'Yield depends on the balanced ratio and limiting reagent. A complete ledger includes leftover solids, new solids and aqueous ions; electrons transfer internally.',
    ),
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '⚖️',
        title: t(
          '收集的固体未必只有产物',
          'Collected solid need not be pure product',
        ),
        body: t(
          '若原金属过量，最后的固体可同时含未反应金属和新生成铜。称总质量不能直接得到纯铜产量。',
          'If the original metal is excessive, solids can contain both unreacted metal and new copper. Total solid mass is not automatically pure copper yield.',
        ),
      },
      {
        icon: '🔗',
        title: t('电子限制配方', 'Electron accounting sets the recipe'),
        body: t(
          '本课 Zn、Mg 每份各给 2e⁻，Cu²⁺ 每份收 2e⁻，所以为 1∶1。这个结论不能不经核对地套给 Al/Cu²⁺ 的 2∶3。',
          'Here Zn and Mg each give 2e⁻ per unit while Cu²⁺ takes 2e⁻, giving 1:1. Do not reuse that ratio for Al/Cu²⁺, which is 2:3.',
        ),
      },
      {
        icon: '🧾',
        title: t('旁观离子仍要记账', 'Spectators remain in the inventory'),
        body: t(
          '本模型用 Cu(NO₃)₂ 水溶液，每份 Cu²⁺ 对应两份 NO₃⁻。硝酸根在这里不参与净反应，但必须保留以核对整体电荷。',
          'The model uses aqueous Cu(NO₃)₂, with two NO₃⁻ per Cu²⁺. Nitrate is a spectator here but remains necessary in the charge ledger.',
        ),
      },
    ],
    steps: [
      {
        title: t('先把半反应合成净反应', 'Combine half-reactions first'),
        body: t(
          'Zn → Zn²⁺ + 2e⁻ 与 Cu²⁺ + 2e⁻ → Cu 合并为 Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)。一份 Zn 与一份 Cu²⁺ 配对，电子两边相抵。',
          'Combine Zn → Zn²⁺ + 2e⁻ and Cu²⁺ + 2e⁻ → Cu to get Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). One Zn matches one Cu²⁺, with electrons cancelling.',
        ),
      },
      {
        title: t(
          '限制量决定新生成铜',
          'The limiting amount determines new copper',
        ),
        body: t(
          '2 mmol Zn 与 5 mmol Cu²⁺，按 1∶1 最多反应 2 mmol：得到 2 mmol Cu 与 2 mmol Zn²⁺，剩 3 mmol Cu²⁺。不能只看铜离子的投入量。',
          'With 2 mmol Zn and 5 mmol Cu²⁺, at most 2 mmol react in the 1:1 ratio: form 2 mmol Cu and Zn²⁺, leaving 3 mmol Cu²⁺. Copper-ion input alone is insufficient.',
        ),
      },
      {
        title: t('所有相态与电荷一起审查', 'Audit phases and charge together'),
        body: t(
          '水相还有 10 mmol NO₃⁻，电荷为 2×2+3×2−10=0。若改为 5 mmol Zn 与 2 mmol Cu²⁺，将剩 3 mmol Zn 固体，不能把它误当新铜。',
          'The solution also has 10 mmol NO₃⁻, giving charge 2×2+3×2−10=0. Switching to 5 mmol Zn and 2 mmol Cu²⁺ leaves 3 mmol Zn solid, which must not be counted as new copper.',
        ),
      },
      {
        title: t(
          '分清理论产量与回收结果',
          'Separate theoretical yield from recovery',
        ),
        body: t(
          '2 mmol Cu 按近似 63.5 g/mol 得 0.127 g。理想模型不含表面膜、副反应或损失；若实测回收量不同，需要检查条件与纯度，不能仅凭一个差值断定原因。',
          '2 mmol Cu at approximately 63.5 g/mol is 0.127 g. The ideal model omits surface films, side reactions and losses. A different recovered amount requires checking conditions and purity; one discrepancy does not identify the cause.',
        ),
      },
    ],
    misconception: t(
      '“投入多少 Cu²⁺ 就得到多少铜”忽略供电子物种的限制；“固体总质量就是铜质量”忽略未反应金属；“电子很多，所以溶液储着电子”则误把内部转移量当成剩余物。',
      'Copper-ion input alone ignores the electron donor’s limit. Total solid mass ignores unreacted metal. An electron-transfer total is not a stockpile of free electrons remaining in solution.',
    ),
    mission: t(
      '先固定金属 2 mmol，把 Cu²⁺ 从 1 改到 6 mmol，预测铜产量何时不再增加。再交换投入量，分别列固相与水相，并指出哪些固体不是产物。所有操作使用虚拟模型。',
      'Hold metal at 2 mmol and vary Cu²⁺ from 1 to 6 mmol. Predict where copper yield stops increasing. Then exchange inputs, list solid and aqueous inventories, and identify solids that are not products. Use the virtual model only.',
    ),
    vocabulary: [
      { en: 'electron donor', zh: '电子给出者' },
      { en: 'limiting reagent', zh: '限制反应物' },
      { en: 'theoretical yield', zh: '理论产量' },
      { en: 'unreacted metal', zh: '未反应金属' },
    ],
    interactive: 'displacement-amount-ledger-lab',
    resources: [numbersReading, halfReading],
    learning: {
      prerequisites: [
        'half-reactions-electron-balance',
        'limiting-reactants-and-leftovers',
        'precipitation-limits-and-filtrate',
      ],
      objectives: [
        t(
          '从电子配比确定指定置换的反应比例。',
          'Derive the specified displacement ratio from electron matching.',
        ),
        t(
          '求理论铜产量并分开剩余金属与新产物。',
          'Calculate theoretical copper yield and distinguish leftover metal from product.',
        ),
        t(
          '用全部元素与电荷审查水相和固相。',
          'Audit aqueous and solid inventories using every element and charge.',
        ),
      ],
      workedExample: {
        prompt: t(
          '理想模型中 5 mmol Mg 与含 2 mmol Cu²⁺ 的硝酸铜溶液反应，最终是什么组成？',
          'In the ideal model, 5 mmol Mg reacts with copper nitrate solution containing 2 mmol Cu²⁺. What remains?',
        ),
        steps: [
          t(
            'Mg 每份给 2e⁻，Cu²⁺ 每份收 2e⁻，所以是 1∶1。',
            'Mg gives 2e⁻ per unit and Cu²⁺ takes 2e⁻, so the ratio is 1:1.',
          ),
          t(
            'Cu²⁺ 限制反应，得到 2 mmol Cu，剩 3 mmol Mg 固体。',
            'Cu²⁺ is limiting: form 2 mmol Cu and leave 3 mmol Mg solid.',
          ),
          t(
            '水相为 2 mmol Mg²⁺ 与 4 mmol NO₃⁻，电荷 +4−4=0。',
            'The solution contains 2 mmol Mg²⁺ and 4 mmol NO₃⁻, with charge +4−4=0.',
          ),
        ],
        answer: t(
          '新铜理论质量 0.127 g；固体还含 3 mmol 未反应 Mg，水相仍有旁观离子。',
          'New copper theoretically has mass 0.127 g; solids also contain 3 mmol unreacted Mg, and spectators remain aqueous.',
        ),
      },
      anotherWay: t(
        '把电子配对当成反应套装的连接条件：套装配好后，还需把所有未用材料与成品分别放回库存。只数成品或只数一种投入，都不能完成总账。',
        'Electron matching defines a reaction kit. After assembly, put both unused materials and products into their own inventories. Counting products alone or only one input cannot complete the ledger.',
      ),
      explainPrompt: t(
        '不用“因为取最小值”，解释 2 mmol Zn 为什么不能从 5 mmol Cu²⁺ 生成 5 mmol Cu；再说明反过来投料时，为什么固体不一定是纯铜。',
        'Explain, without merely saying “take the minimum”, why 2 mmol Zn cannot turn 5 mmol Cu²⁺ into 5 mmol Cu. Then explain why reversing the inputs need not leave pure copper solids.',
      ),
      quickChecks: [
        q(
          'redox96-check1',
          t(
            'Zn 与 Cu²⁺ 每份各对应 2e⁻，净反应比例是什么？',
            'Zn and Cu²⁺ each correspond to 2e⁻ per unit. What is their net ratio?',
          ),
          [t('1∶2', '1:2'), t('2∶3', '2:3'), t('1∶1', '1:1')],
          2,
          t(
            '一份 Zn 给出的电子恰够一份 Cu²⁺ 接受。',
            'One Zn supplies exactly the electrons needed by one Cu²⁺.',
          ),
          ['electron-stoichiometry'],
        ),
        q(
          'redox96-check2',
          t(
            '2 mmol Cu²⁺ 来自 Cu(NO₃)₂ 溶液，旁观 NO₃⁻ 有多少？',
            'A Cu(NO₃)₂ solution supplies 2 mmol Cu²⁺. How much spectator NO₃⁻ is present?',
          ),
          [t('4 mmol', '4 mmol'), t('2 mmol', '2 mmol'), t('0 mmol', '0 mmol')],
          0,
          t(
            '每份硝酸铜含两份硝酸根，2×2=4。',
            'Each copper nitrate unit supplies two nitrate ions: 2×2=4.',
          ),
          ['spectator-ion-ratios'],
          'application',
        ),
        q(
          'redox96-check3',
          t(
            '新铜与过量原金属一起收集，称得的是什么？',
            'New copper and excess original metal are collected together. What does their weighing give?',
          ),
          [
            t('自动得到纯铜质量', 'Automatically the mass of pure copper'),
            t('混合固体的质量', 'The mass of mixed solids'),
            t('自由电子的质量', 'The mass of free electrons'),
          ],
          1,
          t(
            '必须区分剩余原金属与新铜，否则产物质量会被高估。',
            'Separate leftover metal from new copper to avoid overestimating product mass.',
          ),
          ['product-purity'],
        ),
      ],
    },
    questions: [
      q(
        'redox96-q1',
        t(
          '理想模型中 2 mmol Zn 与 5 mmol Cu²⁺，最多生成多少 Cu？',
          'In the ideal model, how much Cu forms from 2 mmol Zn and 5 mmol Cu²⁺?',
        ),
        [t('5 mmol', '5 mmol'), t('2 mmol', '2 mmol'), t('7 mmol', '7 mmol')],
        1,
        t(
          '1∶1 的电子配方下 Zn 限制反应，最多形成 2 mmol Cu。',
          'The 1:1 electron-based recipe makes Zn limiting, so at most 2 mmol Cu forms.',
        ),
        ['limiting-reagent'],
        'application',
      ),
      q(
        'redox96-q2',
        t(
          '上题反应后的主要水相离子是哪一组？',
          'Which major aqueous-ion ledger follows those inputs?',
        ),
        [
          t(
            '2 mmol Zn²⁺、3 mmol Cu²⁺、10 mmol NO₃⁻',
            '2 mmol Zn²⁺, 3 mmol Cu²⁺, 10 mmol NO₃⁻',
          ),
          t('只有 3 mmol Cu²⁺', 'Only 3 mmol Cu²⁺'),
          t('没有任何离子', 'No ions'),
        ],
        0,
        t(
          '原有 10 mmol 硝酸根不被消耗；正电荷 4+6 与负电荷 −10 相抵。',
          'The original 10 mmol nitrate remains; positive charges 4+6 balance −10.',
        ),
        ['charge-conservation', 'spectator-ion-ratios'],
        'application',
      ),
      q(
        'redox96-q3',
        t(
          '5 mmol Mg 与 2 mmol Cu²⁺ 后，固体应包括什么？',
          'After 5 mmol Mg reacts with 2 mmol Cu²⁺, what solids remain?',
        ),
        [
          t('只有 5 mmol 铜', 'Only 5 mmol copper'),
          t('只有 3 mmol Mg', 'Only 3 mmol Mg'),
          t('3 mmol Mg 与 2 mmol 铜', '3 mmol Mg and 2 mmol copper'),
        ],
        2,
        t(
          'Cu²⁺ 限制，只消耗 2 mmol Mg；剩余 Mg 与新铜要分开记录。',
          'Cu²⁺ limits consumption to 2 mmol Mg; keep leftover Mg separate from new copper.',
        ),
        ['solid-inventory'],
        'application',
      ),
      q(
        'redox96-q4',
        t(
          '2 mmol 铜按 63.5 g/mol 计，理论质量是多少？',
          'What is the theoretical mass of 2 mmol copper at 63.5 g/mol?',
        ),
        [t('0.127 g', '0.127 g'), t('127 g', '127 g'), t('0.002 g', '0.002 g')],
        0,
        t('0.002 mol×63.5 g/mol=0.127 g。', '0.002 mol×63.5 g/mol=0.127 g.'),
        ['mole-mass'],
        'application',
      ),
      q(
        'redox96-q5',
        t(
          '模型记录共转移 4 mmol e⁻，是什么意思？',
          'The model records 4 mmol e⁻ transferred. What does this mean?',
        ),
        [
          t(
            '水中还剩 4 mmol 自由电子',
            '4 mmol free electrons remain in water',
          ),
          t('Cu²⁺ 完全没有改变', 'Cu²⁺ did not change'),
          t(
            '给出与接受双方内部转移总数相同，不另列剩余电子',
            'Donor and acceptor totals match internally; no separate electron leftovers are listed',
          ),
        ],
        2,
        t(
          '完整反应中电子两边消去，转移量不是溶液中储存的独立物种数量。',
          'Electrons cancel in the complete reaction; transfer amount is not a separately stored solution species.',
        ),
        ['electron-conservation'],
      ),
      q(
        'redox96-q6',
        t(
          '实际回收铜少于理论值，能仅凭这个差值断定是哪种原因吗？',
          'Recovered copper is below the theoretical amount. Does the difference alone identify its cause?',
        ),
        [
          t('能，一定是原子消失', 'Yes; atoms must have vanished'),
          t(
            '不能，还需检查表面膜、副反应、收集损失等证据',
            'No; investigate films, side reactions, recovery losses and other evidence',
          ),
          t('能，一定是摩尔质量改变', 'Yes; molar mass must have changed'),
        ],
        1,
        t(
          '模型有明确近似条件；同一差值可能有多种解释，需要独立证据。',
          'The model has stated approximations; several causes can produce the same discrepancy and need independent evidence.',
        ),
        ['evidence-limits', 'model-limits'],
      ),
    ],
  },
];
