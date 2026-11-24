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
const protonReading = {
  title: t(
    '拓展：质子给出者与接受者',
    'Read more: proton donors and acceptors',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/14-1-bronsted-lowry-acids-and-bases',
};
const reactionReading = {
  title: t(
    '拓展：中和与产气反应',
    'Read more: neutralisation and gas-forming reactions',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions',
};

export const protonReactionLessons: Lesson[] = [
  {
    id: 'proton-donor-and-acceptor',
    levelId: 'acids',
    order: 91,
    title: t(
      '水有时当酸，有时当碱？追踪一个质子',
      'Water can be an acid or a base? Follow one proton',
    ),
    eyebrow: t(
      '第 91 课 · 酸碱粒子 1/3：先看谁给谁收',
      'Lesson 91 · Acid–base particles 1/3: who gives and who accepts?',
    ),
    hook: t(
      '水遇到 HCl 时接受一个 H⁺，遇到 NH₃ 时却能给出一个 H⁺。同一种水，为什么在两条反应中角色不同？',
      'Water accepts H⁺ from HCl but can donate H⁺ to NH₃. Why does the same water have different roles in two reactions?',
    ),
    hookHint: t(
      '别先给物质贴上永远不变的标签。沿着所示反应方向，看哪一方少了一个 H⁺，哪一方多了一个 H⁺。',
      'Do not start with a permanent label. Follow the shown reaction direction: who loses H⁺ and who gains it?',
    ),
    bigIdea: t(
      '在质子转移模型中，酸给出 H⁺，碱接受 H⁺；角色由具体反应决定，原子与总电荷仍守恒。',
      'In the proton-transfer model, an acid donates H⁺ and a base accepts it. Roles depend on the reaction, while atoms and total charge are conserved.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '💧',
        title: t('水不是被动背景', 'Water is not just background'),
        body: t(
          '许多水溶液反应中，水参与质子转移。画图时不一定要画出所有水，但不能因此忘记它的角色。',
          'Water participates in many aqueous proton transfers. A diagram may omit most water molecules without making water chemically irrelevant.',
        ),
      },
      {
        icon: '🧩',
        title: t(
          '接受 H⁺，不必自带 OH',
          'Accepting H⁺ does not require OH in the formula',
        ),
        body: t(
          'NH₃ 没有 OH 字样，却能接受 H⁺ 形成 NH₄⁺。不能只靠化学式里有没有 OH 判断是否能作碱。',
          'NH₃ contains no OH group but can accept H⁺ to form NH₄⁺. An OH substring is not a universal test for a base.',
        ),
      },
      {
        icon: '🔁',
        title: t('反向过程，角色对调', 'Reverse the process, change the roles'),
        body: t(
          'NH₃ 与水的反应可逆；正向生成的 NH₄⁺ 可在逆向给出 H⁺。双向箭头不表示两边数量相等。',
          'The ammonia–water reaction is reversible. Product NH₄⁺ can donate H⁺ in the reverse direction. A double arrow does not mean equal amounts on both sides.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '把“质子”与氢原子分清',
          'Distinguish a proton from a hydrogen atom',
        ),
        body: t(
          '本课的 H⁺ 指普通氢失去电子后对应的质子转移记号。中性 H 原子还含一个电子，不能与 H⁺ 混用。真实水中质子被水合，常用 H₃O⁺ 表示，不是裸质子独自漂浮。',
          'Here H⁺ denotes proton transfer associated with ordinary hydrogen without its electron. Neutral H still has an electron and is not interchangeable with H⁺. In water protons are hydrated, often represented by H₃O⁺, not isolated bare protons.',
        ),
      },
      {
        title: t('认出给出者与接受者', 'Identify donor and acceptor'),
        body: t(
          'HCl + H₂O → Cl⁻ + H₃O⁺：HCl 给出 H⁺，是酸；水接受 H⁺，是碱。HCl/Cl⁻ 相差一个 H⁺，称为共轭酸碱对；H₃O⁺/H₂O 也是一对。组成与电荷均可核对。',
          'HCl + H₂O → Cl⁻ + H₃O⁺: HCl donates H⁺ as the acid, and water accepts it as the base. HCl/Cl⁻ differ by one H⁺ and form a conjugate acid–base pair; H₃O⁺/H₂O form another. Audit composition and charge.',
        ),
      },
      {
        title: t('换搭档后重新判断角色', 'Reassess roles with a new partner'),
        body: t(
          'H₂O + NH₃ ⇌ OH⁻ + NH₄⁺：正向是水给出 H⁺，NH₃ 接受 H⁺。水可在不同反应中给出或接受质子，但这不等于纯水是强酸或强碱。',
          'H₂O + NH₃ ⇌ OH⁻ + NH₄⁺: in the forward direction water donates H⁺ and NH₃ accepts it. Water can donate or accept protons in different reactions without pure water being a strong acid or strong base.',
        ),
      },
      {
        title: t(
          '一次事件不代表全部转化',
          'One event does not mean complete conversion',
        ),
        body: t(
          '图只表示一次允许的转移。氨是弱碱，整杯溶液中仍有许多 NH₃；不能从一个 NH₃ 变成 NH₄⁺ 的图推断所有氨都变了，也不能直接读出 pH。',
          'A diagram shows one allowed transfer. Ammonia is a weak base and much NH₃ remains in bulk solution. One NH₃ becoming NH₄⁺ does not imply total conversion or determine pH.',
        ),
      },
    ],
    misconception: t(
      '“碱必须含 OH”不适用于质子接受者定义；“水在这里作酸”也不意味着纯水突然变成强酸。先说清具体反应与方向，再分配角色。',
      '“A base must contain OH” fails for the proton-acceptor definition. Water acting as an acid here does not make pure water a strong acid. Specify the reaction and direction before assigning roles.',
    ),
    mission: t(
      '在纸上画 HCl/水和 NH₃/水两组卡片，标出 H⁺ 的去向，并逐个数 H、O、N、Cl。请家人换一个箭头方向，让你重新判断给出者。无需任何试剂。',
      'Draw HCl/water and NH₃/water cards on paper. Mark the H⁺ route and count H, O, N and Cl. Ask someone to reverse a reaction arrow and reassess the donor. No reagents are needed.',
    ),
    vocabulary: [
      { en: 'proton donor', zh: '质子给出者' },
      { en: 'proton acceptor', zh: '质子接受者' },
      { en: 'hydronium', zh: '水合氢离子' },
      { en: 'conjugate pair', zh: '共轭酸碱对' },
    ],
    interactive: 'proton-transfer-lab',
    resources: [protonReading],
    learning: {
      prerequisites: [
        'acids-bases-and-ph',
        'ions-carry-current',
        'net-ionic-equation-detective',
      ],
      objectives: [
        t(
          '在给定方向识别 H⁺ 给出者和接受者。',
          'Identify H⁺ donor and acceptor in a stated direction.',
        ),
        t(
          '解释水在不同反应中的不同角色。',
          'Explain water’s different roles with different partners.',
        ),
        t(
          '用原子、电荷与平衡边界检查解释。',
          'Audit explanations using atoms, charge and equilibrium limits.',
        ),
      ],
      workedExample: {
        prompt: t(
          'H₂O + NH₃ ⇌ OH⁻ + NH₄⁺ 的正向，谁是酸，谁是碱？',
          'In the forward direction of H₂O + NH₃ ⇌ OH⁻ + NH₄⁺, which species is acid and which is base?',
        ),
        steps: [
          t(
            '水从两个 H 变为一个 H 的 OH⁻，给出一个 H⁺。',
            'Water changes from two H to one H in OH⁻, donating H⁺.',
          ),
          t(
            'NH₃ 从三个 H 变为四个 H 的 NH₄⁺，接受 H⁺。',
            'NH₃ gains an H to form NH₄⁺, accepting H⁺.',
          ),
          t(
            '左侧 H 共 5 个，右侧也为 5 个；左右总电荷都为零。',
            'There are five H on each side and zero total charge on each side.',
          ),
        ],
        answer: t(
          '正向中水是酸，NH₃ 是碱；逆向中 NH₄⁺ 是给出者。',
          'Forward: water is the acid and NH₃ the base. In reverse, NH₄⁺ is the donor.',
        ),
      },
      anotherWay: t(
        '给出者与接受者像传球中的角色，同一个人换一组搭档就可能从接球改为传球。类比只追踪 H⁺，不表示质子像小球一样在水中裸露飞行。',
        'Donor and acceptor are roles like passing and receiving: one participant may change roles with a new partner. The analogy tracks H⁺; it does not depict a bare proton flying through water.',
      ),
      explainPrompt: t(
        '不用“因为定义就是这样”，解释为什么水在 HCl 反应中是碱，在 NH₃ 反应正向中是酸；再说明这为何不决定纯水的 pH。',
        'Explain water’s base role with HCl and acid role in the forward NH₃ reaction without merely repeating definitions. Why does that not determine pure water’s pH?',
      ),
      quickChecks: [
        q(
          'proton91-check1',
          t('H⁺ 与中性 H 原子相同吗？', 'Is H⁺ identical to a neutral H atom?'),
          [
            t(
              '不相同，电子数与电荷不同',
              'No; electron count and charge differ',
            ),
            t('相同，只是字体不同', 'Yes; it is just typography'),
            t('H⁺ 是电子', 'H⁺ is an electron'),
          ],
          0,
          t(
            '普通氢的 H⁺ 对应质子；中性 H 还带电子。',
            'H⁺ of ordinary hydrogen corresponds to a proton; neutral H also has an electron.',
          ),
          ['proton-identity'],
          'recall',
        ),
        q(
          'proton91-check2',
          t('NH₃ → NH₄⁺ 对应什么变化？', 'What happens in NH₃ → NH₄⁺?'),
          [
            t('失去 H⁺', 'Loss of H⁺'),
            t('接受 H⁺', 'Acceptance of H⁺'),
            t('N 原子变为 O', 'N changes into O'),
          ],
          1,
          t(
            '组成多一个 H，电荷从 0 变为 +1，符合接受一个 H⁺。',
            'One H is added and charge changes from 0 to +1, matching H⁺ acceptance.',
          ),
          ['proton-transfer'],
        ),
        q(
          'proton91-check3',
          t(
            '可逆箭头是否表示反应两边数量相等？',
            'Does a reversible arrow imply equal amounts on both sides?',
          ),
          [
            t('是，总是各一半', 'Yes; always half on each side'),
            t('是，所有分子相同', 'Yes; all molecules are identical'),
            t(
              '否，它允许正逆过程',
              'No; it permits forward and reverse processes',
            ),
          ],
          2,
          t(
            '图中的一次事件不提供整杯浓度或平衡比例。',
            'A single event diagram does not supply bulk concentrations or equilibrium fractions.',
          ),
          ['equilibrium-evidence'],
        ),
      ],
    },
    questions: [
      q(
        'proton91-q1',
        t(
          'HCl + H₂O → Cl⁻ + H₃O⁺ 中谁接受 H⁺？',
          'Who accepts H⁺ in HCl + H₂O → Cl⁻ + H₃O⁺?',
        ),
        [t('Cl⁻', 'Cl⁻'), t('HCl', 'HCl'), t('H₂O', 'H₂O')],
        2,
        t(
          '水多了一个 H 并成为 H₃O⁺，在这里作碱。',
          'Water gains H to become H₃O⁺ and acts as the base here.',
        ),
        ['proton-transfer'],
      ),
      q(
        'proton91-q2',
        t(
          '为什么 NH₃ 不含 OH，仍能作碱？',
          'Why can NH₃ be a base without containing OH?',
        ),
        [
          t('它能接受 H⁺', 'It can accept H⁺'),
          t(
            '所有含 N 的物质都是强碱',
            'Everything containing N is a strong base',
          ),
          t('它会创造 O 原子', 'It creates O atoms'),
        ],
        0,
        t(
          '在此定义下，碱是质子接受者；不能用有无 OH 字样替代反应证据。',
          'A base in this definition accepts a proton; an OH substring is not the criterion.',
        ),
        ['acid-base-roles'],
      ),
      q(
        'proton91-q3',
        t(
          'NH₄⁺ + OH⁻ → NH₃ + H₂O 中，质子给出者是谁？',
          'Who donates a proton in NH₄⁺ + OH⁻ → NH₃ + H₂O?',
        ),
        [t('OH⁻', 'OH⁻'), t('NH₄⁺', 'NH₄⁺'), t('NH₃', 'NH₃')],
        1,
        t(
          'NH₄⁺ 失去一个 H⁺ 成为 NH₃；这是原氨水反应的逆向。',
          'NH₄⁺ loses H⁺ to become NH₃; this reverses the original ammonia–water event.',
        ),
        ['acid-base-roles'],
        'application',
      ),
      q(
        'proton91-q4',
        t(
          'H₃O⁺ + OH⁻ 反应，哪个式子同时守恒？',
          'Which equation conserves atoms and charge for H₃O⁺ reacting with OH⁻?',
        ),
        [
          t('H₃O⁺ + OH⁻ → H₂O', 'H₃O⁺ + OH⁻ → H₂O'),
          t('H₃O⁺ + OH⁻ → H₂', 'H₃O⁺ + OH⁻ → H₂'),
          t('H₃O⁺ + OH⁻ → 2H₂O', 'H₃O⁺ + OH⁻ → 2H₂O'),
        ],
        2,
        t(
          '左边有 4 个 H、2 个 O，总电荷 0；两份水才全部保留。',
          'The left has four H, two O and net charge zero; two waters preserve them all.',
        ),
        ['atom-conservation', 'charge-conservation'],
        'application',
      ),
      q(
        'proton91-q5',
        t(
          '一个 NH₃ 接受 H⁺ 的示意图，能证明什么？',
          'What does one diagram of NH₃ accepting H⁺ establish?',
        ),
        [
          t(
            '这种转移的组成变化可以解释',
            'The species change in such a transfer can be explained',
          ),
          t('所有 NH₃ 已转化', 'All NH₃ is converted'),
          t('溶液 pH 恰好为 14', 'The solution has pH exactly 14'),
        ],
        0,
        t(
          '氨是弱碱；单次事件不等于整杯的平衡组成，也没有给出浓度。',
          'Ammonia is a weak base; one event neither gives the bulk equilibrium composition nor supplies concentrations.',
        ),
        ['equilibrium-evidence'],
      ),
      q(
        'proton91-q6',
        t(
          '水在 NH₃ 反应正向中作酸，能推出纯水是强酸吗？',
          'Water acts as acid in the forward NH₃ reaction. Does that make pure water a strong acid?',
        ),
        [
          t('能，酸的角色永远固定', 'Yes; roles are permanent'),
          t(
            '不能，角色与具体搭档和方向有关',
            'No; roles depend on the partner and direction',
          ),
          t('能，因为水没有离子', 'Yes; because water has no ions'),
        ],
        1,
        t(
          '给出或接受 H⁺ 是反应角色；酸强弱与平衡转化程度是另一个问题。',
          'Donating or accepting H⁺ describes a reaction role; strength and extent of equilibrium conversion are separate questions.',
        ),
        ['acid-base-roles', 'model-limits'],
      ),
    ],
  },
  {
    id: 'neutralisation-ion-accounting',
    levelId: 'acids',
    order: 92,
    title: t(
      '中和不是一杯配一杯：数清 H⁺ 和 OH⁻',
      'Neutralisation is not cup-for-cup: count H⁺ and OH⁻',
    ),
    eyebrow: t(
      '第 92 课 · 酸碱粒子 2/3：先展开，再算比例',
      'Lesson 92 · Acid–base particles 2/3: expand before comparing ratios',
    ),
    hook: t(
      '同样是 2 mmol 碱，NaOH 和 Ca(OH)₂ 会消耗同样多的盐酸吗？如果只看杯子大小或化学式的个数，会漏掉什么？',
      'Do 2 mmol of NaOH and Ca(OH)₂ consume the same amount of HCl? What goes missing if we only count cups or formula units?',
    ),
    hookHint: t(
      '先展开每份已溶解的碱有几份 OH⁻，再用 H⁺∶OH⁻=1∶1 比较；体积还需结合浓度，不能直接配对。',
      'Expand how many OH⁻ each dissolved base unit supplies, then compare H⁺:OH⁻ at 1:1. Volumes also need concentrations; they cannot be paired directly.',
    ),
    bigIdea: t(
      '中和按反应离子的当量发生；一份 Ca(OH)₂ 提供两份 OH⁻，旁观离子则继续留在水中。',
      'Neutralisation follows reacting-ion equivalents. One Ca(OH)₂ unit supplies two OH⁻, while spectator ions remain in water.',
    ),
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🥤',
        title: t('杯子大小不是粒子数', 'Cup size is not particle count'),
        body: t(
          '同体积溶液可以含不同 mmol。必须先用浓度与体积求物质的量，再检查每份物质给出的反应离子数。',
          'Equal solution volumes can contain different mmol. Use concentration and volume first, then count reacting ions per formula unit.',
        ),
      },
      {
        icon: '🧾',
        title: t('括号是乘法提示', 'Parentheses indicate multiplication'),
        body: t(
          'Ca(OH)₂ 中的 2 乘整个 OH，表示每份含两个 OH；它不是 Ca²⁺ 的电荷数字，也不能在反应时随意改掉。',
          'The 2 in Ca(OH)₂ multiplies the whole OH group. It is not the charge number on Ca²⁺ and cannot be changed arbitrarily to balance a reaction.',
        ),
      },
      {
        icon: '💡',
        title: t('相抵后仍有离子', 'Ions remain after matching'),
        body: t(
          '恰好中和的 HCl 与 NaOH 溶液仍含 Na⁺ 和 Cl⁻，因此不能把它画成只有纯水，也不能仅凭“中和过”判断安全。',
          'A matched HCl/NaOH mixture still has Na⁺ and Cl⁻. It is not just pure water, and “neutralised” alone does not establish safety.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '把化学式份数换成反应离子份数',
          'Convert formula amounts to reacting-ion amounts',
        ),
        body: t(
          'HCl 每 mmol 提供约 1 mmol 可反应 H⁺；已溶解的 NaOH 每 mmol 提供 1 mmol OH⁻，Ca(OH)₂ 则提供 2 mmol OH⁻。这里给定的是已溶解的量，不是投入固体的量。',
          'Each mmol HCl supplies about 1 mmol reactive H⁺. Dissolved NaOH supplies 1 mmol OH⁻ per mmol, whereas Ca(OH)₂ supplies 2. These are specified dissolved amounts, not masses of solid added.',
        ),
      },
      {
        title: t(
          '按 1∶1 消耗，不改下标',
          'Consume 1:1 without changing subscripts',
        ),
        body: t(
          'H⁺(aq) + OH⁻(aq) → H₂O(l)。H⁺ 是水合质子的简写。若写完整的 H₃O⁺，对应 H₃O⁺ + OH⁻ → 2H₂O；两种表示中对溶剂水的记录不同。',
          'H⁺(aq) + OH⁻(aq) → H₂O(l), with H⁺ abbreviating hydrated protons. Explicit H₃O⁺ gives H₃O⁺ + OH⁻ → 2H₂O; the two representations account for solvent water differently.',
        ),
      },
      {
        title: t(
          '限制量决定消耗与剩余',
          'The limiting amount determines consumption and leftovers',
        ),
        body: t(
          '3 mmol HCl 与 2 mmol Ca(OH)₂，对应 3 mmol H⁺ 和 4 mmol OH⁻。反应消耗各 3 mmol，剩 1 mmol OH⁻；不能因为“碱只有 2 mmol”就断言酸过量。',
          '3 mmol HCl and 2 mmol Ca(OH)₂ give 3 mmol H⁺ and 4 mmol OH⁻. Each loses 3 mmol, leaving 1 mmol OH⁻; the base’s 2 mmol formula amount alone does not make acid excessive.',
        ),
      },
      {
        title: t(
          '最后把旁观离子加回账本',
          'Include spectator ions in the final ledger',
        ),
        body: t(
          '上例水相还含 2 mmol Ca²⁺ 与 3 mmol Cl⁻，连同 1 mmol OH⁻，电荷为 +4−3−1=0。生成水的量不是水的总量；本模型也不从当量差直接给出 pH。',
          'The example retains 2 mmol Ca²⁺ and 3 mmol Cl⁻. With 1 mmol OH⁻ the charge is +4−3−1=0. Produced water is not total solvent water, and this model does not turn an equivalent difference directly into pH.',
        ),
      },
    ],
    misconception: t(
      '“中和一定等体积”忽略浓度与组成系数；“中和后没有离子”忽略旁观离子；“任意酸和碱恰好反应都得到 pH 7”又忽略弱酸弱碱及温度等条件。',
      '“Neutralisation needs equal volumes” ignores concentration and formula ratios. “No ions remain” ignores spectators. “Every matched acid/base pair gives pH 7” also ignores weak equilibria and temperature.',
    ),
    mission: t(
      '用纸卡准备 4 份 H⁺ 和 2 份 Ca(OH)₂，先拆出 OH⁻ 再配对。记录 Ca²⁺ 与 Cl⁻，然后拿走一份 H⁺，预测哪种反应离子剩余。无需混合真实材料。',
      'Use paper cards for four H⁺ portions and two Ca(OH)₂ units. Expand OH⁻ before matching. Record Ca²⁺ and Cl⁻, then remove one H⁺ and predict the leftover reacting ion. No real mixing is needed.',
    ),
    vocabulary: [
      { en: 'neutralisation', zh: '中和' },
      { en: 'reaction equivalent', zh: '反应当量' },
      { en: 'hydroxide', zh: '氢氧根' },
      { en: 'spectator ion', zh: '旁观离子' },
    ],
    interactive: 'neutralisation-ledger-lab',
    resources: [protonReading, reactionReading],
    learning: {
      prerequisites: [
        'proton-donor-and-acceptor',
        'neutralisation-the-right-amount',
        'precipitation-limits-and-filtrate',
      ],
      objectives: [
        t(
          '展开 NaOH、Ca(OH)₂ 的 OH⁻ 数量。',
          'Expand OH⁻ amounts from NaOH and Ca(OH)₂.',
        ),
        t(
          '找出强酸强碱近似中的限制量和剩余量。',
          'Find limiting and leftover amounts in the strong-acid/base approximation.',
        ),
        t(
          '记录全部主要离子并检查电荷。',
          'Record all major ions and check charge.',
        ),
      ],
      workedExample: {
        prompt: t(
          '2 mmol Ca(OH)₂ 与 4 mmol HCl 均已溶解，近似完全中和后剩什么？',
          'For dissolved 2 mmol Ca(OH)₂ and 4 mmol HCl, what remains after approximately complete neutralisation?',
        ),
        steps: [
          t(
            '碱提供 2×2=4 mmol OH⁻，酸提供 4 mmol H⁺。',
            'The base supplies 2×2=4 mmol OH⁻ and the acid supplies 4 mmol H⁺.',
          ),
          t(
            '两种反应离子各消耗 4 mmol，按 H⁺ 简写净生成 4 mmol 水。',
            'Both reacting ions lose 4 mmol, giving net 4 mmol water in H⁺ shorthand.',
          ),
          t(
            '水相仍有 2 mmol Ca²⁺ 和 4 mmol Cl⁻，电荷 +4−4=0。',
            'The solution retains 2 mmol Ca²⁺ and 4 mmol Cl⁻, with charge +4−4=0.',
          ),
        ],
        answer: t(
          '当量恰好相抵，但不是纯水；Ca²⁺ 与 Cl⁻ 仍在溶液中。',
          'Reaction equivalents match, but the mixture is not pure water: Ca²⁺ and Cl⁻ remain dissolved.',
        ),
      },
      anotherWay: t(
        '把每份碱看成一包 OH⁻ 卡片：NaOH 每包一张，Ca(OH)₂ 每包两张。先拆包再与 H⁺ 配对；包数少，不一定代表卡片少。',
        'Treat each base formula unit as a pack of OH⁻ cards: NaOH has one per pack and Ca(OH)₂ has two. Open the packs before matching H⁺; fewer packs need not mean fewer cards.',
      ),
      explainPrompt: t(
        '向家人解释：为什么同样 2 mmol 的 NaOH 与 Ca(OH)₂，中和需要的 HCl 不同？再给出一个等体积但不恰好中和的例子。',
        'Explain why 2 mmol NaOH and 2 mmol Ca(OH)₂ need different HCl amounts, then construct equal volumes that do not neutralise exactly.',
      ),
      quickChecks: [
        q(
          'proton92-check1',
          t(
            '2 mmol Ca(OH)₂ 完全解离给多少 OH⁻？',
            'How much OH⁻ comes from fully dissociated 2 mmol Ca(OH)₂?',
          ),
          [t('2 mmol', '2 mmol'), t('4 mmol', '4 mmol'), t('1 mmol', '1 mmol')],
          1,
          t(
            '每份有两份 OH⁻，所以是 2×2=4。',
            'Each formula unit supplies two OH⁻, so 2×2=4.',
          ),
          ['hydroxide-ratios'],
          'application',
        ),
        q(
          'proton92-check2',
          t(
            '净离子简写 H⁺ + OH⁻ 生成什么？',
            'What is formed in the net ionic shorthand H⁺ + OH⁻?',
          ),
          [t('H₂O', 'H₂O'), t('H₂', 'H₂'), t('NaCl 固体', 'Solid NaCl')],
          0,
          t(
            '反应离子组成水；本案例的旁观离子不生成沉淀。',
            'The reacting ions form water; the spectators here do not precipitate.',
          ),
          ['neutralisation-ratio'],
          'recall',
        ),
        q(
          'proton92-check3',
          t(
            'Na⁺ 与 Cl⁻ 是旁观离子，是否从水中消失？',
            'Do spectator Na⁺ and Cl⁻ disappear from the water?',
          ),
          [
            t('消失', 'They disappear'),
            t('变成光', 'They become light'),
            t('仍留在水中', 'They remain in water'),
          ],
          2,
          t(
            '从净方程式省略不等于从溶液移除。',
            'Omission from a net equation is not removal from solution.',
          ),
          ['spectator-ions'],
        ),
      ],
    },
    questions: [
      q(
        'proton92-q1',
        t(
          '3 mmol HCl 与 2 mmol Ca(OH)₂ 近似反应后哪项正确？',
          'After approximate reaction of 3 mmol HCl with 2 mmol Ca(OH)₂, which is correct?',
        ),
        [
          t('剩 1 mmol H⁺', '1 mmol H⁺ remains'),
          t('两者恰好用尽', 'They are exactly matched'),
          t('剩 1 mmol OH⁻', '1 mmol OH⁻ remains'),
        ],
        2,
        t(
          '碱给 4 mmol OH⁻，酸给 3 mmol H⁺；剩 1 mmol OH⁻。',
          'The base supplies 4 mmol OH⁻ versus 3 mmol H⁺, leaving 1 mmol OH⁻.',
        ),
        ['hydroxide-ratios', 'limiting-reagent'],
        'application',
      ),
      q(
        'proton92-q2',
        t(
          '100 mL 0.10 mol/L HCl 与 100 mL 0.20 mol/L NaOH 是恰好中和吗？',
          'Do 100 mL 0.10 mol/L HCl and 100 mL 0.20 mol/L NaOH exactly neutralise?',
        ),
        [
          t(
            '不是，分别为 10 与 20 mmol，碱过量',
            'No; 10 and 20 mmol respectively, so base is excessive',
          ),
          t('是，因为体积相同', 'Yes; volumes match'),
          t('不是，因为一定酸过量', 'No; acid must be excessive'),
        ],
        0,
        t(
          '必须用浓度乘体积求 mmol；等体积不能替代粒子数比较。',
          'Use concentration times volume to get mmol; equal volume does not establish equal reacting amounts.',
        ),
        ['amount-concentration'],
        'application',
      ),
      q(
        'proton92-q3',
        t(
          '上一例 Ca(OH)₂ 与 HCl 反应后，主要离子账本应包括什么？',
          'For the 2 mmol Ca(OH)₂ / 3 mmol HCl example, what is the major-ion ledger?',
        ),
        [
          t('只有 1 mmol OH⁻', 'Only 1 mmol OH⁻'),
          t(
            '2 mmol Ca²⁺、3 mmol Cl⁻、1 mmol OH⁻',
            '2 mmol Ca²⁺, 3 mmol Cl⁻, 1 mmol OH⁻',
          ),
          t('只有纯水', 'Only pure water'),
        ],
        1,
        t(
          '完整账本电荷 +4−3−1=0，漏掉旁观离子就不完整。',
          'The complete ledger has charge +4−3−1=0; omitting spectators makes it incomplete.',
        ),
        ['charge-conservation', 'spectator-ions'],
        'application',
      ),
      q(
        'proton92-q4',
        t(
          'H₃O⁺ + OH⁻ → 2H₂O 与 H⁺ + OH⁻ → H₂O 是否相互矛盾？',
          'Do H₃O⁺ + OH⁻ → 2H₂O and H⁺ + OH⁻ → H₂O contradict each other?',
        ),
        [
          t(
            '不矛盾，H⁺ 简写省去了所带的溶剂水记录',
            'No; H⁺ shorthand omits the associated solvent-water bookkeeping',
          ),
          t('矛盾，原子可以不守恒', 'Yes; atoms need not balance'),
          t('矛盾，H₃O⁺ 是氢气', 'Yes; H₃O⁺ is hydrogen gas'),
        ],
        0,
        t(
          'H₃O⁺ 的表示把一份参与的水显式写入；两式均按自身的记法守恒。',
          'The H₃O⁺ representation explicitly includes a participating water; both balance within their notation.',
        ),
        ['hydrated-proton-notation'],
      ),
      q(
        'proton92-q5',
        t(
          '模型记剩余 H⁺ 与 OH⁻ 都为 0，哪项结论合适？',
          'The model records zero remaining H⁺ and OH⁻. Which conclusion fits?',
        ),
        [
          t('真实水里绝对没有离子', 'Real water contains absolutely no ions'),
          t('所有酸碱组合都 pH 7', 'Every acid/base pair gives pH 7'),
          t(
            '给定强反应物当量相抵，水自身微量离子未计',
            'The specified strong-reactant equivalents match; water’s trace ions are omitted',
          ),
        ],
        2,
        t(
          '0 是计量近似，不是取消水的自电离；本模型不处理弱酸弱碱或计算 pH。',
          'Zero is a stoichiometric approximation, not cancellation of water autoionisation; weak equilibria and pH are outside the model.',
        ),
        ['model-limits'],
      ),
      q(
        'proton92-q6',
        t(
          '已溶解的 Ca(OH)₂ 从 1 增至 2 mmol，要恰好中和所需 HCl 如何变化？',
          'Dissolved Ca(OH)₂ increases from 1 to 2 mmol. How does the HCl requirement for matching change?',
        ),
        [
          t('始终 1 mmol', 'It stays at 1 mmol'),
          t('从 2 增至 4 mmol', 'It rises from 2 to 4 mmol'),
          t('从 1 减至 0 mmol', 'It falls from 1 to 0 mmol'),
        ],
        1,
        t(
          '每份 Ca(OH)₂ 有两份 OH⁻，对应两份 HCl。',
          'Each Ca(OH)₂ unit gives two OH⁻ and needs two HCl units.',
        ),
        ['hydroxide-ratios'],
        'application',
      ),
    ],
  },
  {
    id: 'carbonate-bicarbonate-acid-budget',
    levelId: 'acids',
    order: 93,
    title: t(
      '一样多的碳，为什么耗酸量不同？',
      'The same carbon amount—why a different acid requirement?',
    ),
    eyebrow: t(
      '第 93 课 · 酸碱粒子 3/3：追踪气体与系统边界',
      'Lesson 93 · Acid–base particles 3/3: track gas and system boundaries',
    ),
    hook: t(
      'Na₂CO₃ 与 NaHCO₃ 都能与足量酸生成 CO₂。如果各取 2 mmol，所需酸一样多吗？气泡离开容器后，质量守恒还成立吗？',
      'Na₂CO₃ and NaHCO₃ both form CO₂ with sufficient acid. For 2 mmol of each, is the acid requirement equal? Does mass conservation still hold when gas leaves the vessel?',
    ),
    hookHint: t(
      '两种含碳离子的组成与电荷不同；先把方程式的 H、O、C 和电荷数清，再决定系数。',
      'The carbon-containing ions differ in composition and charge. Count H, O, C and charge before choosing coefficients.',
    ),
    bigIdea: t(
      '全部转为 CO₂ 时，CO₃²⁻ 每份需 2 份 H⁺，HCO₃⁻ 每份需 1 份；足量酸下等 mol 的碳给等 mol 的 CO₂，总账必须包括气体。',
      'For full conversion to CO₂, CO₃²⁻ needs two H⁺ per unit and HCO₃⁻ needs one. With sufficient acid, equal mol of carbon gives equal mol CO₂; include the gas in the total ledger.',
    ),
    estimatedMinutes: 21,
    everydayExamples: [
      {
        icon: '🍞',
        title: t('烘焙中的气体线索', 'A gas clue in baking'),
        body: t(
          '碳酸氢盐与合适的酸反应可产生 CO₂。真实配方还涉及温度、水分与其他成分，不能从本课比例直接推出食谱。',
          'Hydrogen carbonate with a suitable acid can generate CO₂. Real baking also depends on temperature, water and other ingredients; this model is not a recipe.',
        ),
      },
      {
        icon: '🧾',
        title: t(
          '同为 2 mmol，不是同为 2 g',
          'Equal mmol does not mean equal grams',
        ),
        body: t(
          'Na₂CO₃ 与 NaHCO₃ 的摩尔质量不同。本课控制的是含碳粒子的 mol 数，不是两种粉末质量或产气速度。',
          'Na₂CO₃ and NaHCO₃ have different molar masses. The controlled quantity is mol of carbon-containing ions, not powder mass or gas-release speed.',
        ),
      },
      {
        icon: '⚖️',
        title: t('称量范围决定读数', 'The weighing boundary matters'),
        body: t(
          '气体离开容器可使“容器和内容物”的读数下降；把离开的气体也计入系统，总质量并未凭空减少。',
          'Gas leaving a vessel can reduce its vessel-and-contents reading. Include that departed gas and total mass has not vanished.',
        ),
      },
    ],
    steps: [
      {
        title: t('先平衡碳酸根的账', 'Balance the carbonate ledger'),
        body: t(
          'CO₃²⁻ + 2H⁺ → CO₂ + H₂O。左侧电荷 −2+2=0，C、O、H 数目均守恒。若只给一个 H⁺，就不能用这条完整产气方程式表示全部转化。',
          'CO₃²⁻ + 2H⁺ → CO₂ + H₂O. Charge −2+2=0 and C, O, H balance. One H⁺ is insufficient to represent full conversion using this overall gas-forming equation.',
        ),
      },
      {
        title: t(
          '再看已经带一个 H 的离子',
          'Now consider the ion already containing H',
        ),
        body: t(
          'HCO₃⁻ + H⁺ → CO₂ + H₂O。HCO₃⁻ 本来已有一个 H，因此只再需一个 H⁺。碳仍各一个，不会因为耗酸少就必然少产一半 CO₂。',
          'HCO₃⁻ + H⁺ → CO₂ + H₂O. HCO₃⁻ already contains one H and needs only one more H⁺. Each ion still contains one C; using less acid does not necessarily halve CO₂ yield.',
        ),
      },
      {
        title: t('在足量酸条件下比较', 'Compare under sufficient acid'),
        body: t(
          '各 2 mmol 的盐，理论上分别需 4 或 2 mmol H⁺，均生成 2 mmol CO₂，近似质量为 0.002×44=0.088 g。额外过量酸留在水相；Na⁺ 和 Cl⁻ 仍要完整记录。',
          'For 2 mmol of each salt, theoretical H⁺ requirements are 4 and 2 mmol, but both give 2 mmol CO₂, about 0.002×44=0.088 g. Extra acid remains aqueous, alongside the full Na⁺ and Cl⁻ inventory.',
        ),
      },
      {
        title: t(
          '别把总产量当现场读数',
          'Distinguish total yield from an observed reading',
        ),
        body: t(
          '模型把全部生成的 CO₂ 计入收集区，不模拟留溶、泄漏或水蒸气，也不计算速度。酸不足时还涉及 CO₃²⁻、HCO₃⁻ 等平衡，不能把 H⁺ 数直接除以 2 当作任何情况下的实际气体产量。',
          'The model counts all formed CO₂ in a collection region, omitting dissolved gas, leaks and water vapour, and does not calculate rate. Acid-shortage mixtures involve carbonate/bicarbonate equilibria; H⁺/2 is not a universal actual gas yield.',
        ),
      },
    ],
    misconception: t(
      '“耗酸翻倍，产气也必翻倍”忽略碳原子数量；“气泡跑了所以质量不守恒”忽略系统边界；“所有酸不足案例都直接取最小值”又可能漏掉碳酸氢根中间组成与平衡。',
      '“Twice the acid consumed means twice the gas” ignores carbon inventory. “Escaping bubbles violate conservation” ignores the system boundary. A universal minimum rule in acid-shortage cases can miss bicarbonate speciation and equilibria.',
    ),
    mission: t(
      '用纸上账本比较各 2 mmol 的两种盐，先预测耗酸与 CO₂，再操作虚拟模型。最后把碳量改为 3 mmol 重算，并解释为什么不应仅凭气泡断定气体身份。',
      'Compare 2 mmol of each salt on paper: predict acid use and CO₂ before the virtual model. Repeat at 3 mmol and explain why bubbles alone do not identify the gas.',
    ),
    vocabulary: [
      { en: 'carbonate', zh: '碳酸根' },
      { en: 'hydrogen carbonate / bicarbonate', zh: '碳酸氢根' },
      { en: 'acid excess', zh: '酸过量' },
      { en: 'system boundary', zh: '系统边界' },
    ],
    interactive: 'carbonate-acid-ledger-lab',
    resources: [reactionReading],
    learning: {
      prerequisites: [
        'neutralisation-ion-accounting',
        'acids-and-carbonates',
        'molar-concentration-recipe',
      ],
      objectives: [
        t(
          '解释两种含碳离子的不同耗酸比例。',
          'Explain the different acid ratios for the two carbon-containing ions.',
        ),
        t(
          '按守恒计算足量酸下的 CO₂ 理论量。',
          'Use conservation to calculate theoretical CO₂ with sufficient acid.',
        ),
        t(
          '识别气体收集边界与酸不足时的模型局限。',
          'Identify gas-boundary and acid-shortage limitations.',
        ),
      ],
      workedExample: {
        prompt: t(
          '各 2 mmol 的 Na₂CO₃ 与 NaHCO₃，分别额外留 1 mmol HCl 过量，需投入多少酸，生成多少 CO₂？',
          'For 2 mmol each of Na₂CO₃ and NaHCO₃, keep an extra 1 mmol HCl in excess. What acid inputs and CO₂ yields follow?',
        ),
        steps: [
          t(
            '碳酸盐需 2×2=4 mmol H⁺，加过量 1，投入 5 mmol HCl。',
            'Carbonate needs 2×2=4 mmol H⁺; with 1 extra, supply 5 mmol HCl.',
          ),
          t(
            '碳酸氢盐需 2×1=2 mmol H⁺，加过量 1，投入 3 mmol HCl。',
            'Hydrogen carbonate needs 2×1=2 mmol H⁺; with 1 extra, supply 3 mmol HCl.',
          ),
          t(
            '两者各含 2 mmol 碳，都给 2 mmol CO₂，即约 0.088 g。',
            'Each contains 2 mmol carbon and gives 2 mmol CO₂, about 0.088 g.',
          ),
        ],
        answer: t(
          '酸投入分别为 5 与 3 mmol；CO₂ 都为 2 mmol。过量与消耗量要分开。',
          'Supply 5 and 3 mmol acid respectively; both yield 2 mmol CO₂. Separate excess from consumed acid.',
        ),
      },
      anotherWay: t(
        '把 CO₂ 的每个碳看成一张不能复制的“碳票”：一张票最多给一个 CO₂。H⁺ 是把原有氧和氢配成水所需的份数，不会凭空增加碳票。类比不能预测酸不足时的真实平衡。',
        'Treat each carbon as a noncopyable ticket for one CO₂. H⁺ supplies what is needed to account for hydrogen and oxygen in water; it cannot create carbon tickets. This analogy does not predict real acid-shortage equilibria.',
      ),
      explainPrompt: t(
        '给家人解释：两种盐等 mol 时，为什么可以耗酸不同却产等 mol 气体？若只称容器，读数减少又为何不违背守恒？',
        'Explain why equal mol of the salts can consume different acid amounts but yield equal mol gas. Why can the vessel’s reading fall without violating conservation?',
      ),
      quickChecks: [
        q(
          'proton93-check1',
          t(
            '1 mmol CO₃²⁻ 完全转为 CO₂ 需多少 H⁺？',
            'How much H⁺ fully converts 1 mmol CO₃²⁻ to CO₂?',
          ),
          [t('1 mmol', '1 mmol'), t('0 mmol', '0 mmol'), t('2 mmol', '2 mmol')],
          2,
          t(
            'CO₃²⁻ + 2H⁺ → CO₂ + H₂O，电荷与原子同时平衡。',
            'CO₃²⁻ + 2H⁺ → CO₂ + H₂O balances both charge and atoms.',
          ),
          ['carbonate-acid-ratio'],
          'application',
        ),
        q(
          'proton93-check2',
          t(
            '足量酸中 2 mmol HCO₃⁻ 含几 mmol 碳？',
            'How many mmol of carbon are in 2 mmol HCO₃⁻ with sufficient acid?',
          ),
          [t('2 mmol', '2 mmol'), t('4 mmol', '4 mmol'), t('1 mmol', '1 mmol')],
          0,
          t(
            '每个 HCO₃⁻ 含一个 C，碳量不因 H 的数目改变。',
            'Each HCO₃⁻ contains one C; its H count does not change the carbon amount.',
          ),
          ['carbon-conservation'],
        ),
        q(
          'proton93-check3',
          t(
            '称量范围外跑出了 CO₂，要核对总质量还需记录什么？',
            'CO₂ leaves the weighing boundary. What must be included to audit total mass?',
          ),
          [
            t('忽略所有气体', 'Ignore all gas'),
            t('离开的 CO₂', 'The departed CO₂'),
            t('只看液体颜色', 'Only liquid colour'),
          ],
          1,
          t(
            '边界外的物质没有消失，必须把其库存计回总系统。',
            'Matter beyond the vessel boundary has not vanished; include it in the overall inventory.',
          ),
          ['system-boundary'],
        ),
      ],
    },
    questions: [
      q(
        'proton93-q1',
        t(
          '3 mmol CO₃²⁻ 在足量酸中完全转化，消耗多少 mmol H⁺？',
          'How many mmol H⁺ are consumed by full conversion of 3 mmol CO₃²⁻ with sufficient acid?',
        ),
        [t('3', '3'), t('6', '6'), t('1.5', '1.5')],
        1,
        t(
          '每份碳酸根需两份 H⁺，3×2=6 mmol。',
          'Each carbonate needs two H⁺; 3×2=6 mmol.',
        ),
        ['carbonate-acid-ratio'],
        'application',
      ),
      q(
        'proton93-q2',
        t(
          '足量酸下，各 3 mmol Na₂CO₃ 与 NaHCO₃ 的 CO₂ 理论量怎样比较？',
          'With sufficient acid, compare CO₂ yields from 3 mmol each of Na₂CO₃ and NaHCO₃.',
        ),
        [
          t('都是 3 mmol', 'Both give 3 mmol'),
          t('碳酸盐一定翻倍', 'Carbonate must give twice as much'),
          t('碳酸氢盐不能产气', 'Hydrogen carbonate gives no gas'),
        ],
        0,
        t(
          '两者每份都含一个 C；耗酸比例不同，不改变足量酸下的碳总数。',
          'Each formula unit contains one C; different acid ratios do not change total carbon with sufficient acid.',
        ),
        ['carbon-conservation'],
        'application',
      ),
      q(
        'proton93-q3',
        t(
          '2 mmol NaHCO₃ 反应并留 1 mmol HCl 过量，投入 HCl 多少？',
          'How much HCl is supplied for 2 mmol NaHCO₃ while retaining 1 mmol HCl excess?',
        ),
        [t('1 mmol', '1 mmol'), t('2 mmol', '2 mmol'), t('3 mmol', '3 mmol')],
        2,
        t(
          '反应需要 2 mmol，再加 1 mmol 过量，总投入 3。',
          'Reaction needs 2 mmol, plus 1 mmol excess: total input 3.',
        ),
        ['acid-budget'],
        'application',
      ),
      q(
        'proton93-q4',
        t(
          '2 mmol CO₂ 的质量约为多少？取 M=44 g/mol。',
          'What is the approximate mass of 2 mmol CO₂ at M=44 g/mol?',
        ),
        [t('88 g', '88 g'), t('0.088 g', '0.088 g'), t('0.002 g', '0.002 g')],
        1,
        t(
          '2 mmol=0.002 mol，乘 44 g/mol 得 0.088 g。',
          '2 mmol=0.002 mol; multiplying by 44 g/mol gives 0.088 g.',
        ),
        ['mole-mass'],
        'application',
      ),
      q(
        'proton93-q5',
        t(
          '只看到气泡，能直接证明是 CO₂ 吗？',
          'Do bubbles alone prove the gas is CO₂?',
        ),
        [
          t(
            '不能，还需反应组成等证据',
            'No; reaction composition and other evidence are needed',
          ),
          t('能，所有气泡都是 CO₂', 'Yes; every bubble is CO₂'),
          t('能，所有酸都只产 CO₂', 'Yes; acids only form CO₂'),
        ],
        0,
        t(
          '本模型的身份来自已知反应物与守恒账本；气泡外观本身不是唯一鉴定。',
          'The model identifies the gas from known reactants and conservation; bubble appearance alone is not unique identification.',
        ),
        ['evidence-limits'],
      ),
      q(
        'proton93-q6',
        t(
          '酸明显不足时，能把本课“全部碳转为 CO₂”的结果直接套用吗？',
          'Can this lesson’s full carbon-to-CO₂ result be applied directly when acid is clearly insufficient?',
        ),
        [
          t(
            '能，模型对所有条件都精确',
            'Yes; the model is exact for every condition',
          ),
          t('能，酸的多少无关紧要', 'Yes; acid amount is irrelevant'),
          t(
            '不能，需要考虑剩余含碳物种与平衡',
            'No; remaining carbon species and equilibria matter',
          ),
        ],
        2,
        t(
          '本活动只开放酸过量；酸不足可留下 CO₃²⁻/HCO₃⁻，实际气体还受气液平衡影响。',
          'The activity only permits acid excess. Acid shortage can leave CO₃²⁻/HCO₃⁻, and actual gas also depends on gas–liquid equilibrium.',
        ),
        ['model-limits'],
      ),
    ],
  },
];
