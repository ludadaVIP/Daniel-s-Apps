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
const electrolytes = {
  title: t(
    '拓展：电解质与载流粒子',
    'Read more: electrolytes and charge carriers',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes',
};
const reactions = {
  title: t(
    '拓展：沉淀与净离子方程式',
    'Read more: precipitation and net ionic equations',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions',
};
const solubility = {
  title: t(
    '进阶：难溶不等于完全不溶',
    'Extension: sparingly soluble is not completely insoluble',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/15-1-precipitation-and-dissolution',
};

export const ionicReactionLessons: Lesson[] = [
  {
    id: 'ions-carry-current',
    levelId: 'solutions',
    order: 87,
    title: t(
      '盐和糖都不见了，为什么只有盐水明显导电？',
      'Salt and sugar disappear—why does salt water conduct?',
    ),
    eyebrow: t(
      '第 87 课 · 溶液中的离子 1/4：从现象找粒子',
      'Lesson 87 · Ions in solution 1/4: from observations to particles',
    ),
    hook: t(
      '同样透明的盐水和糖水，看起来没有区别。仅凭“溶解了”，能知道水里有哪些粒子吗？',
      'Clear salt water and sugar water can look alike. Does “it dissolved” tell us what particles are in the water?',
    ),
    hookHint: t(
      '先问：分散的是带电离子，还是中性分子？再问：这些粒子能否自由移动？两个条件缺一不可。',
      'Ask what dispersed: charged ions or neutral molecules? Then ask whether those particles can move freely. Both conditions matter.',
    ),
    bigIdea: t(
      '明显的离子导电需要能移动的带电粒子；溶液整体电中性，不妨碍正负离子各自传递电流。',
      'Appreciable ionic conduction needs mobile charged particles. A neutral solution can conduct because positive and negative ions carry current.',
    ),
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🧂',
        title: t('盐晶体与盐水', 'Salt crystals and salt water'),
        body: t(
          'NaCl 晶体里本来就有 Na⁺、Cl⁻。水把离子分散开，不是先把盐变成中性原子再给它们充电。',
          'NaCl crystals already contain Na⁺ and Cl⁻. Water disperses these ions; it does not first create neutral atoms and then charge them.',
        ),
      },
      {
        icon: '🍬',
        title: t('透明不是粒子身份证', 'Clarity is not a particle ID'),
        body: t(
          '蔗糖通常以中性分子分散。盐水和糖水都可透明，但粒子的电荷不同。',
          'Sucrose usually disperses as neutral molecules. Both solutions can be clear while their particles have different charges.',
        ),
      },
      {
        icon: '📋',
        title: t('标签只是线索', 'Labels are clues'),
        body: t(
          '饮料标签中的钠、钾可能提示含有离子，却不能单凭“导电”认出是哪种盐。这里全部使用虚拟模型。',
          'Sodium or potassium on a drink label can suggest ions, but conduction alone cannot identify a salt. This lesson uses virtual models only.',
        ),
      },
    ],
    steps: [
      {
        title: t('先找电荷', 'First find charge'),
        body: t(
          'Na⁺ 与 Cl⁻ 分别带正、负电荷。蔗糖分子 C₁₂H₂₂O₁₁ 整体不带电。分子内部有电荷分布，不等于分子整体带净电荷。',
          'Na⁺ and Cl⁻ carry positive and negative charges. A sucrose molecule, C₁₂H₂₂O₁₁, has no net charge. Internal charge distribution does not make a molecule net charged.',
        ),
      },
      {
        title: t('再看能不能移动', 'Then check mobility'),
        body: t(
          '干燥 NaCl 固体中离子被约束在晶格位置附近，只能振动。溶液中离子能迁移，因此可以传递持续的离子电流。',
          'In dry solid NaCl, ions are constrained near lattice positions and vibrate. In solution they can migrate and carry a sustained ionic current.',
        ),
      },
      {
        title: t('中性不等于没有电荷', 'Neutral does not mean no charges'),
        body: t(
          '4 份 Na⁺ 配 4 份 Cl⁻，总电荷 +4−4=0；但每份仍有电荷。外加电场时两类离子向相反方向迁移，电流贡献并不相互抵消。',
          'Four portions of Na⁺ and four of Cl⁻ give total charge +4−4=0, but each ion remains charged. In an applied field they migrate in opposite directions; their current contributions do not cancel.',
        ),
      },
      {
        title: t(
          '把结论留在证据范围内',
          'Keep conclusions within the evidence',
        ),
        body: t(
          '本模型只判断是否具备明显离子导电的条件，不计算亮度或电流大小。真实纯水有微弱导电；某些共价物质如 HCl 在水中形成离子，不能把“共价”一律当作“不导电”。',
          'This model checks conditions for appreciable ionic conduction, not bulb brightness or current. Pure water conducts very weakly; covalent substances such as HCl can form ions in water, so “covalent” does not always mean nonconducting.',
        ),
      },
    ],
    misconception: t(
      '“总电荷为零，所以盐水不能导电”混淆了整体电荷与载流粒子；“溶解了就导电”又忽略了糖这样的中性分子。',
      '“Zero net charge means no conduction” confuses bulk charge with charge carriers. “Everything dissolved conducts” overlooks neutral solutes such as sugar.',
    ),
    mission: t(
      '不用任何电源或试剂，画两幅示意图：干盐与盐水。用一句话解释为什么两幅图都有离子，导电条件却不同；再画糖水作对照。',
      'Without using a power supply or reagents, draw dry salt and salt water. Explain why both contain ions but have different conduction conditions; add sugar water as a control.',
    ),
    vocabulary: [
      { en: 'electrolyte', zh: '电解质' },
      { en: 'mobile ion', zh: '可移动离子' },
      { en: 'net charge', zh: '净电荷' },
      { en: 'dissociation', zh: '解离' },
    ],
    interactive: 'ionic-conduction-lab',
    resources: [electrolytes],
    learning: {
      prerequisites: [
        'ionic-bonding-lattice',
        'dissolving-is-not-disappearing',
      ],
      objectives: [
        t(
          '用“电荷 + 可移动”解释导电差异。',
          'Explain conduction using charge and mobility.',
        ),
        t(
          '区分整体电中性与没有离子。',
          'Distinguish bulk neutrality from absence of ions.',
        ),
        t(
          '指出导电证据不能唯一鉴定溶质。',
          'Explain why conduction cannot uniquely identify a solute.',
        ),
      ],
      workedExample: {
        prompt: t(
          'A 含 3 mmol Na⁺ 和 3 mmol Cl⁻；B 含同样多的中性糖分子。两杯均为水溶液。哪杯具备明显的离子导电条件？',
          'A contains 3 mmol Na⁺ and 3 mmol Cl⁻; B contains neutral sugar molecules. Both are aqueous. Which has conditions for appreciable ionic conduction?',
        ),
        steps: [
          t(
            'A 的正负电荷相等，总电荷为零，但存在带电离子。',
            'A has equal positive and negative charge: zero net charge, but charged ions exist.',
          ),
          t(
            '溶液让 A 的离子能移动；B 的糖分子虽能移动，却没有净电荷。',
            'A’s ions can move in solution. B’s sugar molecules move too, but carry no net charge.',
          ),
          t(
            '判断载流条件，不用透明度或甜咸作证据。',
            'Judge charge carriers, not clarity or taste.',
          ),
        ],
        answer: t(
          'A。整体电中性与可导电可以同时成立。',
          'A. Bulk neutrality and conduction can coexist.',
        ),
      },
      anotherWay: t(
        '想象两种方向相反的带电传送车：车的总正负电荷能抵消，但车依然能移动并搬运电荷。糖分子像没有净电荷的包裹，移动也不能完成同样的搬运。类比只说明载流条件，不描述电极反应。',
        'Imagine carriers with opposite charges moving in opposite directions. Their total charge can cancel while they still transport charge. Neutral sugar molecules are uncharged parcels. This analogy explains carriers, not electrode chemistry.',
      ),
      explainPrompt: t(
        '向家人解释：“干盐和盐水都含离子，为什么导电表现不同？”必须用到“电荷”和“移动”，不能只说“因为有水”。',
        'Explain to someone: “Dry salt and salt water both contain ions; why do they conduct differently?” Use both charge and mobility, not just “because water is present”.',
      ),
      quickChecks: [
        q(
          'ionic87-check1',
          t('干燥 NaCl 固体里有什么？', 'What is inside dry solid NaCl?'),
          [
            t('Na⁺、Cl⁻ 离子', 'Na⁺ and Cl⁻ ions'),
            t('只有中性 NaCl 小分子', 'Only neutral little NaCl molecules'),
            t('只有自由电子', 'Only free electrons'),
          ],
          0,
          t(
            '离子固体的组成单位不是独立小分子；关键差别在离子能否迁移。',
            'An ionic crystal is not a collection of separate small molecules; the key difference is ion mobility.',
          ),
          ['ionic-lattice'],
          'recall',
        ),
        q(
          'ionic87-check2',
          t(
            '各 2 mmol Na⁺ 与 Cl⁻ 的总电荷如何？',
            'What is the net charge of 2 mmol each of Na⁺ and Cl⁻?',
          ),
          [t('为正', 'Positive'), t('为零', 'Zero'), t('为负', 'Negative')],
          1,
          t(
            '等量一价正负离子电荷抵消，但离子仍各自带电。',
            'Equal amounts of singly charged opposite ions balance; the individual ions remain charged.',
          ),
          ['charge-neutrality'],
        ),
        q(
          'ionic87-check3',
          t(
            '糖分子可以移动，为何糖水仍不明显导电？',
            'Sugar molecules can move; why does sugar water not conduct appreciably?',
          ),
          [
            t('分子太小', 'The molecules are too small'),
            t('糖变成气体', 'Sugar becomes gas'),
            t(
              '缺少足够的可移动带电粒子',
              'It lacks sufficient mobile charged particles',
            ),
          ],
          2,
          t(
            '能移动只是一个条件；糖分子整体不带电。这里忽略水和杂质的微弱贡献。',
            'Mobility is only one condition; sucrose molecules are net neutral. Tiny contributions from water and impurities are omitted.',
          ),
          ['charge-carriers'],
        ),
      ],
    },
    questions: [
      q(
        'ionic87-q1',
        t(
          '为什么盐溶于水后能导电，而干盐通常不能？',
          'Why can salt solution conduct while dry salt normally cannot?',
        ),
        [
          t('水创造了原来没有的 Na⁺', 'Water creates previously absent Na⁺'),
          t('原有离子在溶液中能迁移', 'Existing ions can migrate in solution'),
          t('盐原子全部失去原子核', 'Salt atoms lose all their nuclei'),
        ],
        1,
        t(
          'NaCl 固体已有离子；溶解改变其分散与可移动性。',
          'Solid NaCl already has ions; dissolution changes their dispersion and mobility.',
        ),
        ['ionic-lattice', 'charge-carriers'],
      ),
      q(
        'ionic87-q2',
        t(
          '溶液含 1 mmol Ca²⁺ 和 2 mmol Cl⁻，净电荷是多少？',
          'A solution contains 1 mmol Ca²⁺ and 2 mmol Cl⁻. What is its net charge?',
        ),
        [
          t('零', 'Zero'),
          t('+1 mmol × e', '+1 mmol × e'),
          t('−1 mmol × e', '−1 mmol × e'),
        ],
        0,
        t(
          '正电荷为 1×2，负电荷为 2×(−1)，相加为零。中性不表示没有离子。',
          'Positive charge is 1×2; negative charge is 2×(−1). Their sum is zero without removing the ions.',
        ),
        ['charge-neutrality'],
        'application',
      ),
      q(
        'ionic87-q3',
        t(
          '某未知透明溶液明显导电，最可靠的结论是什么？',
          'An unknown clear solution conducts appreciably. What is the strongest conclusion?',
        ),
        [
          t('它一定是 NaCl', 'It must be NaCl'),
          t('它一定安全', 'It must be safe'),
          t(
            '它含足够的可移动带电粒子',
            'It has sufficient mobile charged particles',
          ),
        ],
        2,
        t(
          '许多不同电解质都能形成导电溶液，不能由导电性唯一鉴定或判断安全。',
          'Many electrolytes form conducting solutions; conduction alone establishes neither identity nor safety.',
        ),
        ['evidence-limits'],
      ),
      q(
        'ionic87-q4',
        t(
          '怎样公平比较本模型中的盐水和糖水？',
          'How should salt and sugar solutions be compared fairly?',
        ),
        [
          t('让盐水加热，糖水冷冻', 'Heat salt water and freeze sugar water'),
          t(
            '保持温度、仪器和比较用的浓度条件一致',
            'Keep temperature, apparatus and comparison concentrations consistent',
          ),
          t('只看哪个更透明', 'Compare clarity alone'),
        ],
        1,
        t(
          '控制条件减少混淆；真实电流还与离子种类、浓度和仪器有关。',
          'Controlled conditions reduce confounding; real current also depends on ion type, concentration and apparatus.',
        ),
        ['fair-comparison'],
        'application',
      ),
      q(
        'ionic87-q5',
        t(
          'HCl 是共价分子，却能在水中形成离子。这否定了哪句话？',
          'Covalent HCl forms ions in water. Which statement does this disprove?',
        ),
        [
          t(
            '所有共价物质的水溶液都不导电',
            'No covalent substance forms a conducting aqueous solution',
          ),
          t('离子可以带电', 'Ions can carry charge'),
          t('溶液可以整体中性', 'A solution can be neutral overall'),
        ],
        0,
        t(
          '必须看溶解后实际存在的粒子，不能只凭溶解前的分类下结论。',
          'Inspect the species present after dissolution, rather than relying only on the original substance category.',
        ),
        ['charge-carriers', 'evidence-limits'],
      ),
      q(
        'ionic87-q6',
        t(
          '盐水中正负离子向相反方向运动，电流会抵消吗？',
          'Oppositely charged ions move in opposite directions. Do their currents cancel?',
        ),
        [
          t('会，因为方向相反', 'Yes, because directions differ'),
          t('只有阳离子传递电流', 'Only positive ions carry current'),
          t('不会，两者都能贡献电流', 'No; both contribute to current'),
        ],
        2,
        t(
          '电流贡献同时取决于电荷符号和运动方向；两者都反向时并不会抵消。',
          'Current depends on both charge sign and motion direction. Reversing both does not cancel the contribution.',
        ),
        ['charge-carriers'],
      ),
    ],
  },
  {
    id: 'precipitation-ion-ledger',
    levelId: 'reactions',
    order: 88,
    title: t(
      '两杯清液混合，白色固体从哪里来？',
      'Two clear solutions mix—where does the white solid come from?',
    ),
    eyebrow: t(
      '第 88 课 · 溶液中的离子 2/4：从粒子到沉淀',
      'Lesson 88 · Ions in solution 2/4: from ions to precipitate',
    ),
    hook: t(
      '没有倒入任何粉末，两杯清液混合却出现白色固体。这是水变成固体，还是水里的某些粒子换了存在方式？',
      'No powder was added, but mixing two clear solutions produces a white solid. Did water turn solid, or did some dissolved species change form?',
    ),
    hookHint: t(
      '把混合前的离子列出来，再找哪些组合在这些条件下难溶。不能只交换符号就断言“发生反应”。',
      'List the ions before mixing, then ask which combinations are sparingly soluble under these conditions. Swapping symbols alone does not establish a reaction.',
    ),
    bigIdea: t(
      '沉淀由原有溶解粒子形成新的固相；要同时解释物质组成、溶解性与剩余溶液，不能把所有离子都画进沉淀。',
      'A precipitate is a new solid phase formed from dissolved species. Account for composition, solubility and the remaining solution—not every ion joins the solid.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🔎',
        title: t('化学侦探的线索', 'A chemistry detective’s clue'),
        body: t(
          '在明确条件下，沉淀可以提供离子存在的线索。不同物质都可能呈白色，颜色不能单独完成鉴定。',
          'Under stated conditions, precipitation can provide evidence for ions. Many substances are white; colour alone cannot identify them.',
        ),
      },
      {
        icon: '🪨',
        title: t('难溶不等于不存在', 'Sparingly soluble is not absent'),
        body: t(
          '碳酸钙可形成固体，但水中仍可能有很少的相关离子。本课先用近似完全沉淀建立账本。',
          'Calcium carbonate can form a solid while tiny amounts of related ions remain in water. Begin with an approximately complete precipitation ledger.',
        ),
      },
      {
        icon: '🧪',
        title: t('清液对照', 'A clear-solution control'),
        body: t(
          'NaCl 与 KNO₃ 溶液混合，本课条件下仍保持离子分散。不是每次混合都生成新固体。',
          'Mixing NaCl and KNO₃ solutions leaves the ions dispersed under these conditions. Mixing does not always create a new solid.',
        ),
      },
    ],
    steps: [
      {
        title: t('列出混合前的真实粒子', 'List the actual starting species'),
        body: t(
          'AgNO₃(aq) 提供 Ag⁺ 与 NO₃⁻；NaCl(aq) 提供 Na⁺ 与 Cl⁻。水溶液中的可溶盐不应都画成紧挨着的中性小分子。',
          'AgNO₃(aq) supplies Ag⁺ and NO₃⁻; NaCl(aq) supplies Na⁺ and Cl⁻. Do not draw dissolved soluble salts only as attached neutral little molecules.',
        ),
      },
      {
        title: t(
          '用已给出的溶解性判断',
          'Use the supplied solubility evidence',
        ),
        body: t(
          '本课浓度条件下 AgCl 难溶，Ag⁺ 与 Cl⁻ 可组成固相；钠盐和硝酸盐保持溶解。方程式为 Ag⁺(aq)+Cl⁻(aq)→AgCl(s)。',
          'AgCl is sparingly soluble and precipitates at the concentrations used here; sodium and nitrate salts remain dissolved. Write Ag⁺(aq)+Cl⁻(aq)→AgCl(s).',
        ),
      },
      {
        title: t('别把旁观离子丢掉', 'Keep spectator ions in the beaker'),
        body: t(
          'Na⁺ 与 NO₃⁻ 没有进入 AgCl 晶格。它们仍在水中，平衡剩余电荷；如果一种反应离子过量，它也留在水中。',
          'Na⁺ and NO₃⁻ do not enter the AgCl lattice. They stay in water and balance the remaining charge; excess reacting ions also stay dissolved.',
        ),
      },
      {
        title: t(
          '用无沉淀案例挑战规则',
          'Challenge the rule with a no-precipitate case',
        ),
        body: t(
          'NaCl 与 KNO₃ 的所涉盐都可溶，不能只因“换搭档”写出沉淀。极稀溶液也可能达不到析出条件；之后用溶度积更精确判断。',
          'The salts involved with NaCl and KNO₃ are soluble. “Changing partners” does not make a precipitate. Extremely dilute solutions may not precipitate either; solubility products give a more precise later test.',
        ),
      },
    ],
    misconception: t(
      '“沉淀把水里的盐全带走了”不成立。沉淀选择性地带走组成它的粒子，其他离子及过量反应离子仍可能留在滤液里。',
      'A precipitate does not remove all dissolved salts. It incorporates its own constituents; other ions and excess reactant ions can remain in the filtrate.',
    ),
    mission: t(
      '在纸上用四种符号代表 Ag⁺、NO₃⁻、Na⁺、Cl⁻。各取两份，把 AgCl 分到固相区，剩余离子留在水相区；用电荷证明没有粒子凭空消失。',
      'On paper use four symbols for Ag⁺, NO₃⁻, Na⁺ and Cl⁻. Start with two of each, move AgCl composition into a solid region, and leave the others in solution. Audit charge so nothing vanishes.',
    ),
    vocabulary: [
      { en: 'precipitate', zh: '沉淀' },
      { en: 'aqueous, (aq)', zh: '水溶液状态' },
      { en: 'solid, (s)', zh: '固态' },
      { en: 'spectator ion', zh: '旁观离子' },
    ],
    interactive: 'precipitation-ledger-lab',
    resources: [reactions, solubility],
    learning: {
      prerequisites: ['ions-carry-current', 'what-is-a-chemical-reaction'],
      objectives: [
        t(
          '用粒子重组解释沉淀来源。',
          'Explain the source of a precipitate using species rearrangement.',
        ),
        t(
          '用溶解性证据区分沉淀与无沉淀案例。',
          'Use solubility evidence to distinguish precipitation from a control.',
        ),
        t(
          '列出反应后固相与水相的组成。',
          'List the solid and aqueous species after reaction.',
        ),
      ],
      workedExample: {
        prompt: t(
          '虚拟模型中各投入 2 mmol AgNO₃ 和 NaCl，近似完全生成 AgCl。最终哪些粒子在哪里？',
          'In a virtual model, 2 mmol each of AgNO₃ and NaCl form AgCl approximately completely. What ends up where?',
        ),
        steps: [
          t(
            '混合前各有 2 mmol Ag⁺、NO₃⁻、Na⁺、Cl⁻。',
            'Initially there are 2 mmol each of Ag⁺, NO₃⁻, Na⁺ and Cl⁻.',
          ),
          t(
            'Ag⁺ 与 Cl⁻ 按 1∶1 组成 2 mmol AgCl 固体。',
            'Ag⁺ and Cl⁻ combine 1:1 into 2 mmol solid AgCl.',
          ),
          t(
            '水相仍含 2 mmol Na⁺ 与 2 mmol NO₃⁻，总电荷为零。',
            'The solution still contains 2 mmol each of Na⁺ and NO₃⁻, with zero net charge.',
          ),
        ],
        answer: t(
          'AgCl 在固相；Na⁺ 与 NO₃⁻ 留在水相。并不是整杯液体凝固了。',
          'AgCl is solid; Na⁺ and NO₃⁻ remain aqueous. The whole liquid did not freeze.',
        ),
      },
      anotherWay: t(
        '把四类离子想成四种卡片。只有有溶解性证据支持的组合才移进“固相盒”；其余卡片必须留在“水相盒”。这是组成账本，不是说每两张卡真的组成一个独立小分子。',
        'Think of four ion card types. Only combinations supported by solubility evidence move into the solid box; other cards remain in the solution box. This tracks composition, not separate two-card molecules.',
      ),
      explainPrompt: t(
        '为什么 NaCl 与 KNO₃ 也混合了，却没有沉淀？回答中必须引用溶解性证据，不能只说“它们不反应”。',
        'Why does mixing NaCl and KNO₃ not precipitate a solid here? Cite solubility evidence instead of merely saying “they do not react”.',
      ),
      quickChecks: [
        q(
          'ionic88-check1',
          t('(aq) 表示什么？', 'What does (aq) mean?'),
          [
            t('水溶液中的物种', 'A species in aqueous solution'),
            t('一定是固体', 'Always solid'),
            t('一种元素符号', 'An element symbol'),
          ],
          0,
          t(
            '(aq) 表示水溶液状态；不是说粒子变成了水。',
            '(aq) denotes aqueous state; it does not mean the species turned into water.',
          ),
          ['phase-symbols'],
          'recall',
        ),
        q(
          'ionic88-check2',
          t(
            'AgCl 的沉淀组成需要哪两种离子？',
            'Which two ions make the composition of AgCl precipitate?',
          ),
          [
            t('Na⁺ 与 NO₃⁻', 'Na⁺ and NO₃⁻'),
            t('Ag⁺ 与 Cl⁻', 'Ag⁺ and Cl⁻'),
            t('Ag⁺ 与 Na⁺', 'Ag⁺ and Na⁺'),
          ],
          1,
          t(
            'AgCl 中有 Ag 和 Cl，不含 Na 或 N；1∶1 同时满足电荷平衡。',
            'AgCl contains Ag and Cl, not Na or N; a 1:1 ratio also balances charge.',
          ),
          ['precipitation-composition'],
        ),
        q(
          'ionic88-check3',
          t(
            '为什么不能把所有混合都写成沉淀反应？',
            'Why is not every mixing event a precipitation reaction?',
          ),
          [
            t('混合时总会失去原子', 'Mixing always loses atoms'),
            t('水阻止一切反应', 'Water prevents all reactions'),
            t(
              '还需要难溶固相与合适的浓度条件',
              'A sparingly soluble solid and suitable concentrations are needed',
            ),
          ],
          2,
          t(
            '符号可以交换，但实际是否析出由物质性质和条件决定。',
            'Symbols can be swapped on paper; actual precipitation depends on properties and conditions.',
          ),
          ['solubility-evidence'],
        ),
      ],
    },
    questions: [
      q(
        'ionic88-q1',
        t(
          '混合 AgNO₃ 和 NaCl 后的 AgCl 固体，原子来自哪里？',
          'Where do the atoms in AgCl precipitate come from after mixing AgNO₃ and NaCl?',
        ),
        [
          t('原有的 Ag⁺ 和 Cl⁻', 'The original Ag⁺ and Cl⁻'),
          t('空气自动创造的原子', 'Atoms created from air'),
          t(
            '水中的 H 与 O 变成了 Ag 与 Cl',
            'H and O in water changed into Ag and Cl',
          ),
        ],
        0,
        t(
          '化学变化重新组织已有原子，不把 H、O 变成 Ag、Cl。',
          'Chemical change reorganises existing atoms; it does not turn H and O into Ag and Cl.',
        ),
        ['atom-conservation', 'precipitation-composition'],
      ),
      q(
        'ionic88-q2',
        t(
          '等量反应后，Na⁺ 与 NO₃⁻ 去哪了？',
          'After equal reactant amounts react, where are Na⁺ and NO₃⁻?',
        ),
        [
          t('一起进入 AgCl', 'Both enter AgCl'),
          t('消失了', 'They disappear'),
          t('仍溶解在水中', 'They stay dissolved'),
        ],
        2,
        t(
          '它们是旁观离子；沉淀的式子中没有 Na、N、O。',
          'They are spectator ions; the precipitate formula contains no Na, N or O.',
        ),
        ['spectator-ions'],
      ),
      q(
        'ionic88-q3',
        t(
          '已知所涉钠盐、钾盐、硝酸盐、这些氯化物均可溶。混合 NaCl 与 KNO₃ 怎样判断？',
          'Given that the sodium, potassium, nitrate and relevant chloride salts are soluble, what happens when NaCl and KNO₃ solutions mix?',
        ),
        [
          t('必定出现 KCl 固体', 'KCl solid must form'),
          t(
            '本条件下没有净沉淀反应',
            'There is no net precipitation reaction here',
          ),
          t('生成中性 Na 原子', 'Neutral Na atoms form'),
        ],
        1,
        t(
          '所有相关离子仍留在水相，写出“换搭档”的分子式并不能证明沉淀。',
          'All relevant ions remain aqueous. Writing swapped formula partners does not prove precipitation.',
        ),
        ['solubility-evidence'],
        'application',
      ),
      q(
        'ionic88-q4',
        t(
          '两种不同案例都产生白色沉淀，能断定固体相同吗？',
          'Two different cases produce white precipitates. Must the solids be the same?',
        ),
        [
          t(
            '不能，还需要成分等证据',
            'No; composition and other evidence are needed',
          ),
          t('能，白色就是 AgCl', 'Yes; white always means AgCl'),
          t('能，固体都一样', 'Yes; all solids are alike'),
        ],
        0,
        t(
          'AgCl 与 CaCO₃ 都可呈白色。共同外观不足以唯一鉴定。',
          'AgCl and CaCO₃ can both be white. A shared appearance cannot establish unique identity.',
        ),
        ['evidence-limits'],
      ),
      q(
        'ionic88-q5',
        t('“难溶”应该怎样理解？', 'What does “sparingly soluble” mean?'),
        [
          t(
            '任何条件下一颗粒子也不溶',
            'Not one particle dissolves under any conditions',
          ),
          t('永远不能形成沉淀', 'It can never precipitate'),
          t(
            '溶解量较小，仍取决于条件',
            'Only a small amount dissolves, depending on conditions',
          ),
        ],
        2,
        t(
          '本课把微量溶解忽略，方便建模；实际仍存在溶解平衡。',
          'Trace dissolution is omitted for this introductory model; real dissolution equilibria still exist.',
        ),
        ['solubility-evidence'],
      ),
      q(
        'ionic88-q6',
        t(
          '模型投入 2 mmol CaCl₂ 与 2 mmol Na₂CO₃，形成 2 mmol CaCO₃ 后，水相有哪些主要离子？',
          'The model mixes 2 mmol each of CaCl₂ and Na₂CO₃ and forms 2 mmol CaCO₃. Which major ions remain aqueous?',
        ),
        [
          t('2 mmol Na⁺ 和 2 mmol Cl⁻', '2 mmol Na⁺ and 2 mmol Cl⁻'),
          t('4 mmol Na⁺ 和 4 mmol Cl⁻', '4 mmol Na⁺ and 4 mmol Cl⁻'),
          t('一个离子都没有', 'No ions'),
        ],
        1,
        t(
          '每份 CaCl₂ 给两份 Cl⁻，每份 Na₂CO₃ 给两份 Na⁺；旁观离子不被消耗。',
          'Each CaCl₂ supplies two Cl⁻ and each Na₂CO₃ supplies two Na⁺; these spectator ions are not consumed.',
        ),
        ['formula-ratios', 'spectator-ions'],
        'application',
      ),
    ],
  },
  {
    id: 'net-ionic-equation-detective',
    levelId: 'reactions',
    order: 89,
    title: t(
      '划掉旁观者，还能把反应说清楚吗？',
      'Can you cancel spectators and still explain the reaction?',
    ),
    eyebrow: t(
      '第 89 课 · 溶液中的离子 3/4：从账本到方程式',
      'Lesson 89 · Ions in solution 3/4: from ledgers to equations',
    ),
    hook: t(
      '一条方程式写了许多离子，真正改变存在方式的却只有两种。怎样简写，又不把有用信息删掉？',
      'An equation lists many ions, but only two change form. How can we shorten it without deleting essential information?',
    ),
    hookHint: t(
      '只消去箭头两边种类、状态、数量都相同的项。Ag⁺(aq) 与 AgCl(s) 含有共同元素，却不是同一个物种。',
      'Cancel only identical species, states and amounts on both sides. Ag⁺(aq) and AgCl(s) share an element but are not the same species.',
    ),
    bigIdea: t(
      '净离子方程式保留实际发生变化的物种；旁观离子从表达中省略，但没有从真实溶液中消失。',
      'A net ionic equation keeps the species that change. Spectator ions are omitted from the expression, not removed from the solution.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🧾',
        title: t(
          '收据可以简写，物品不能丢',
          'Shorten a receipt, not the inventory',
        ),
        body: t(
          '从反应表达式中删去旁观离子，像省略两份记录中完全相同的部分；烧杯里仍保留它们。',
          'Cancelling spectators is like omitting identical entries from two records. The actual beaker still contains them.',
        ),
      },
      {
        icon: '🔤',
        title: t('状态也是身份的一部分', 'State is part of identity'),
        body: t(
          'Cl⁻(aq) 可在水中迁移；AgCl(s) 是固相。共同的 Cl 字样不能作为消去依据。',
          'Cl⁻(aq) can migrate in water; AgCl(s) is solid. A shared Cl symbol is not enough for cancellation.',
        ),
      },
      {
        icon: '⚖️',
        title: t('两本账都要平', 'Balance two ledgers'),
        body: t(
          '反应前后每种元素数目守恒，总电荷也守恒。只检查“看起来像 1∶1”还不够。',
          'Every element and total charge must balance. Merely seeing a 1:1 pattern is not sufficient.',
        ),
      },
    ],
    steps: [
      {
        title: t('写出并配平完整反应', 'Write and balance the full reaction'),
        body: t(
          'CaCl₂(aq) + Na₂CO₃(aq) → CaCO₃(s) + 2NaCl(aq)。右侧的 2 乘整个 NaCl，不能把氯化钠下标改成 Na₂Cl₂ 来假装配平。',
          'CaCl₂(aq) + Na₂CO₃(aq) → CaCO₃(s) + 2NaCl(aq). The 2 multiplies the entire NaCl formula; do not change subscripts to pretend to balance the equation.',
        ),
      },
      {
        title: t(
          '展开可溶强电解质，保留固体',
          'Expand soluble strong electrolytes; keep solids intact',
        ),
        body: t(
          '左边是 Ca²⁺+2Cl⁻+2Na⁺+CO₃²⁻，右边是 CaCO₃(s)+2Na⁺+2Cl⁻，水相离子均标 (aq)。不把 CaCO₃(s) 拆成水溶液离子。',
          'The left has Ca²⁺+2Cl⁻+2Na⁺+CO₃²⁻; the right has CaCO₃(s)+2Na⁺+2Cl⁻. Mark aqueous ions (aq). Do not split CaCO₃(s) into aqueous ions.',
        ),
      },
      {
        title: t(
          '只消去两侧完全相同的项',
          'Cancel only matching entries on both sides',
        ),
        body: t(
          '两边各有 2Na⁺(aq) 与 2Cl⁻(aq)，可同时省略。Ca²⁺(aq) 和 CO₃²⁻(aq) 进入固体，存在方式改变，不能消去。',
          'Both sides have 2Na⁺(aq) and 2Cl⁻(aq), so omit them from both sides. Ca²⁺(aq) and CO₃²⁻(aq) become solid and cannot be cancelled.',
        ),
      },
      {
        title: t(
          '重新核对元素、状态与总电荷',
          'Audit elements, states and total charge',
        ),
        body: t(
          'Ca²⁺(aq)+CO₃²⁻(aq)→CaCO₃(s)。Ca、C、O 数目都守恒；左侧电荷 +2−2=0，右侧为 0。净方程式不是说所有物种都不带电。',
          'Ca²⁺(aq)+CO₃²⁻(aq)→CaCO₃(s). Ca, C and O balance; total charge is +2−2=0 on the left and 0 on the right. A balanced net equation can contain charged species.',
        ),
      },
    ],
    misconception: t(
      '不能因为两边都含 Ag，就把 Ag⁺ 与 AgCl 消去；也不能把固体拆成离子，让真正的变化“消失”。只有同种物种、同一状态、相同数量才能成对省略。',
      'Do not cancel Ag⁺ against AgCl because both contain Ag, or split a solid into ions to erase the change. Cancel matching species in matching states and amounts.',
    ),
    mission: t(
      '在纸上写出完整的 CaCO₃ 沉淀反应，再给旁观离子画圈。把圈住的离子仍画在烧杯中，解释“从方程式省略”和“从溶液除去”的区别。',
      'Write the complete CaCO₃ precipitation reaction and circle spectator ions. Still draw those ions in the beaker, and explain omission from an equation versus removal from a solution.',
    ),
    vocabulary: [
      { en: 'complete ionic equation', zh: '完整离子方程式' },
      { en: 'net ionic equation', zh: '净离子方程式' },
      { en: 'cancel', zh: '两侧同时消去' },
      { en: 'charge conservation', zh: '电荷守恒' },
    ],
    interactive: 'net-ionic-lab',
    resources: [reactions],
    learning: {
      prerequisites: [
        'precipitation-ion-ledger',
        'reading-chemical-equations',
        'balancing-equations',
      ],
      objectives: [
        t(
          '把可溶盐展开为符合组成比例的离子。',
          'Expand soluble salts into ions in the correct ratios.',
        ),
        t(
          '根据状态与数量识别旁观离子。',
          'Identify spectators using states and amounts.',
        ),
        t(
          '检查净离子方程式的元素与电荷守恒。',
          'Audit element and charge conservation in a net ionic equation.',
        ),
      ],
      workedExample: {
        prompt: t(
          '把 AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq) 化简为净离子方程式。',
          'Reduce AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq) to a net ionic equation.',
        ),
        steps: [
          t(
            '展开可溶盐：Ag⁺+NO₃⁻+Na⁺+Cl⁻→AgCl(s)+Na⁺+NO₃⁻；离子均为 (aq)。',
            'Expand soluble salts: Ag⁺+NO₃⁻+Na⁺+Cl⁻→AgCl(s)+Na⁺+NO₃⁻; all ions shown are (aq).',
          ),
          t(
            '两边同时消去等量 Na⁺(aq) 和 NO₃⁻(aq)。',
            'Cancel equal Na⁺(aq) and NO₃⁻(aq) from both sides.',
          ),
          t(
            '核对：Ag、Cl 各一个；左右总电荷均为零，固态标记保留。',
            'Audit one Ag and one Cl on each side, zero total charge on each side, and the retained solid state.',
          ),
        ],
        answer: t(
          'Ag⁺(aq)+Cl⁻(aq)→AgCl(s)。烧杯里仍有 Na⁺ 和 NO₃⁻。',
          'Ag⁺(aq)+Cl⁻(aq)→AgCl(s). Na⁺ and NO₃⁻ remain in the beaker.',
        ),
      },
      anotherWay: t(
        '把完整离子方程式当成两栏库存表。左右完全相同的条目可在“变化摘要”中省略；从水相转入固相的条目不是同一个状态，必须保留。',
        'Treat the complete ionic equation as a two-column inventory. Identical entries can be omitted from the change summary; entries moving from aqueous to solid change state and must remain.',
      ),
      explainPrompt: t(
        '为什么 Ca²⁺ 进入 CaCO₃ 后不能被当作旁观离子消去？请同时提到物种身份、状态与电荷账本。',
        'Why can Ca²⁺ not be cancelled as a spectator when it becomes CaCO₃? Refer to species identity, state and charge.',
      ),
      quickChecks: [
        q(
          'ionic89-check1',
          t(
            '1 份 CaCl₂(aq) 提供几份 Cl⁻？',
            'How many portions of Cl⁻ come from one portion of CaCl₂(aq)?',
          ),
          [t('1', '1'), t('2', '2'), t('3', '3')],
          1,
          t(
            '下标 2 属于 Cl；还同时提供 1 份 Ca²⁺。',
            'The subscript 2 belongs to Cl; one portion of Ca²⁺ is also supplied.',
          ),
          ['formula-ratios'],
          'recall',
        ),
        q(
          'ionic89-check2',
          t(
            'AgCl(s) 在本课完整离子方程式中应怎样写？',
            'How should AgCl(s) be written in the complete ionic equation here?',
          ),
          [
            t('保留 AgCl(s)', 'Keep AgCl(s)'),
            t('拆成 Ag⁺(aq) 与 Cl⁻(aq)', 'Split it into Ag⁺(aq) and Cl⁻(aq)'),
            t('直接删掉', 'Delete it'),
          ],
          0,
          t(
            '沉淀是实际形成的固相，不能套用水溶液强电解质的展开规则。',
            'The precipitate is the actual solid product; the dissociation rule for aqueous strong electrolytes does not apply.',
          ),
          ['phase-symbols'],
        ),
        q(
          'ionic89-check3',
          t(
            'Ca²⁺+CO₃²⁻ 左侧总电荷是多少？',
            'What is the total charge of Ca²⁺+CO₃²⁻?',
          ),
          [t('+4', '+4'), t('−4', '−4'), t('0', '0')],
          2,
          t(
            '+2 与 −2 相加为零；不是把离子上的电荷标签删除。',
            '+2 plus −2 is zero; this does not erase the charges on the ions.',
          ),
          ['charge-conservation'],
        ),
      ],
    },
    questions: [
      q(
        'ionic89-q1',
        t(
          '哪一对可以从方程式两边同时消去？',
          'Which pair can be cancelled from both sides?',
        ),
        [
          t(
            '左 2Na⁺(aq)，右 2Na⁺(aq)',
            '2Na⁺(aq) on the left and 2Na⁺(aq) on the right',
          ),
          t(
            '左 Ag⁺(aq)，右 AgCl(s)',
            'Ag⁺(aq) on the left and AgCl(s) on the right',
          ),
          t(
            '左 Cl⁻(aq)，右 Cl₂(g)',
            'Cl⁻(aq) on the left and Cl₂(g) on the right',
          ),
        ],
        0,
        t(
          '第一对物种、状态、数量均相同；其余两对并不是相同物种。',
          'Only the first pair matches in species, state and amount.',
        ),
        ['spectator-cancellation'],
      ),
      q(
        'ionic89-q2',
        t(
          'CaCl₂ 与 Na₂CO₃ 生成 CaCO₃ 时，旁观离子是什么？',
          'When CaCl₂ and Na₂CO₃ form CaCO₃, which ions are spectators?',
        ),
        [
          t('Ca²⁺ 与 CO₃²⁻', 'Ca²⁺ and CO₃²⁻'),
          t('Na⁺ 与 Cl⁻', 'Na⁺ and Cl⁻'),
          t('只有 Ca²⁺', 'Only Ca²⁺'),
        ],
        1,
        t(
          'Na⁺ 和 Cl⁻ 仍为水相离子；Ca²⁺ 与 CO₃²⁻ 形成固相。',
          'Na⁺ and Cl⁻ stay aqueous; Ca²⁺ and CO₃²⁻ form the solid phase.',
        ),
        ['spectator-ions'],
      ),
      q(
        'ionic89-q3',
        t(
          '旁观离子从净方程式省略后，它们怎样了？',
          'What happens to spectator ions when omitted from the net equation?',
        ),
        [
          t('从烧杯中消失', 'They vanish from the beaker'),
          t('全部失去电荷', 'They all lose charge'),
          t(
            '仍在溶液中，表达式只突出变化',
            'They remain in solution; the expression highlights change',
          ),
        ],
        2,
        t(
          '方程式化简属于表达方式的改变，不是额外的过滤或化学反应。',
          'Simplifying the equation changes the description; it is not an extra filtration or chemical reaction.',
        ),
        ['spectator-ions'],
      ),
      q(
        'ionic89-q4',
        t(
          '有人写 Ca²⁺(aq)+CO₃⁻(aq)→CaCO₃(s)。按此写法，哪个检查直接暴露问题？',
          'Someone writes Ca²⁺(aq)+CO₃⁻(aq)→CaCO₃(s). Which audit directly reveals the error as written?',
        ),
        [
          t(
            '电荷：左侧 +1，右侧 0；碳酸根应为 2−',
            'Charge: +1 on the left, 0 on the right; carbonate should be 2−',
          ),
          t('碳元素完全消失', 'Carbon vanishes'),
          t('Ca 的原子数从 1 变为 2', 'Ca count changes from 1 to 2'),
        ],
        0,
        t(
          '原子数看似对上并不够，离子电荷也必须写对并守恒。',
          'Matching atom counts is insufficient; ionic charges must be correct and balanced too.',
        ),
        ['charge-conservation'],
        'application',
      ),
      q(
        'ionic89-q5',
        t(
          'NaCl 与 KNO₃ 溶液混合，没有沉淀、气体或其他净变化时，怎样写净离子反应？',
          'NaCl and KNO₃ solutions mix with no solid, gas or other net change here. What net ionic reaction should be written?',
        ),
        [
          t('强行写 K⁺+Cl⁻→KCl(s)', 'Force K⁺+Cl⁻→KCl(s)'),
          t(
            '本条件下没有净离子反应',
            'There is no net ionic reaction under these conditions',
          ),
          t(
            '把水删掉，剩下什么都算反应',
            'Delete water and call anything left a reaction',
          ),
        ],
        1,
        t(
          '完整离子记录两边相同，没有发生净物种变化。',
          'Both sides of the complete ionic record match; there is no net species change.',
        ),
        ['solubility-evidence', 'spectator-cancellation'],
      ),
      q(
        'ionic89-q6',
        t(
          'Ag⁺(aq)+Cl⁻(aq)→AgCl(s) 必须保留 (s) 的原因是什么？',
          'Why retain (s) in Ag⁺(aq)+Cl⁻(aq)→AgCl(s)?',
        ),
        [
          t('只是排版装饰', 'It is decoration'),
          t('表示 AgCl 是气体', 'It marks AgCl as gas'),
          t(
            '它说明生成固相，是反应变化的关键信息',
            'It records the solid phase, a key part of the change',
          ),
        ],
        2,
        t(
          '相态决定哪些物种可展开、是否形成沉淀；不是可有可无的信息。',
          'State indicates precipitation and which species can be dissociated; it is essential information.',
        ),
        ['phase-symbols'],
      ),
    ],
  },
  {
    id: 'precipitation-limits-and-filtrate',
    levelId: 'problem-solving',
    order: 90,
    title: t(
      '沉淀最多有多少，清液里还剩什么？',
      'How much solid can form—and what remains in the clear liquid?',
    ),
    eyebrow: t(
      '第 90 课 · 溶液中的离子 4/4：用数量检验解释',
      'Lesson 90 · Ions in solution 4/4: test explanations with quantities',
    ),
    hook: t(
      '一份溶液加得更多，就一定得到更多沉淀吗？滤液重新变清，是不是说明离子也全部消失了？',
      'Does adding more of one solution always make more precipitate? If the filtrate is clear again, have all its ions disappeared?',
    ),
    hookHint: t(
      '先把体积与浓度换成 mmol，用净离子方程式找限制量；再分别记录固相与水相。清澈不能代替组成证据。',
      'Convert volume and concentration to mmol, use the net ionic ratio to find the limit, then keep separate solid and solution ledgers. Clarity is not composition evidence.',
    ),
    bigIdea: t(
      '先用反应比例找限制反应物，再算沉淀与剩余离子；过滤除去的是固体，不是溶解的离子。',
      'Use reaction ratios to find the limiting reagent, then calculate solid and remaining ions. Filtration removes the solid, not dissolved ions.',
    ),
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '🧩',
        title: t(
          '配对受短缺的一方限制',
          'Pairs are limited by the scarce partner',
        ),
        body: t(
          '一对一配方中，2 份 Ag⁺ 遇到 5 份 Cl⁻，最多得到 2 份 AgCl，不是 5 份或 7 份。',
          'In a 1:1 recipe, 2 portions of Ag⁺ and 5 of Cl⁻ can produce at most 2 portions of AgCl, not 5 or 7.',
        ),
      },
      {
        icon: '🧻',
        title: t('过滤不是离子筛选', 'Filtration is not ion removal'),
        body: t(
          '普通过滤可截留较大的固体颗粒；溶解离子随水通过。这里讨论的是虚拟沉淀，不是净水或饮用建议。',
          'Ordinary filtration can retain solid particles while dissolved ions pass with water. This is a virtual precipitation case, not water-treatment or drinking advice.',
        ),
      },
      {
        icon: '📈',
        title: t('产量平台也是证据', 'A yield plateau is evidence'),
        body: t(
          '保持 Ag⁺ 投入不变，持续增加 Cl⁻，沉淀量最终不再增长。平台指向另一个反应物已成为限制量。',
          'Hold Ag⁺ fixed and increase Cl⁻. Eventually solid yield stops increasing: the other reactant has become limiting.',
        ),
      },
    ],
    steps: [
      {
        title: t('先把输入放到同一单位', 'Put inputs in the same units'),
        body: t(
          'n=cV，体积用 L 时得到 mol。100 mL 的 0.020 mol/L AgNO₃ 含 0.0020 mol=2.0 mmol Ag⁺。若用 mol/L×mL，数值直接是 mmol；不要再重复乘 1000。',
          'Use n=cV: volume in L gives mol. 100 mL of 0.020 mol/L AgNO₃ contains 0.0020 mol=2.0 mmol Ag⁺. Numerically mol/L×mL gives mmol directly; do not multiply by 1000 twice.',
        ),
      },
      {
        title: t(
          '按方程式比例比较可用份数',
          'Compare available recipe portions',
        ),
        body: t(
          'Ag⁺+Cl⁻→AgCl 为 1∶1。2 mmol Ag⁺ 与 3 mmol Cl⁻ 只能形成约 2 mmol AgCl，剩余 1 mmol Cl⁻。不是所有反应都可直接取两个数中较小者，必须先看系数。',
          'Ag⁺+Cl⁻→AgCl is 1:1. With 2 mmol Ag⁺ and 3 mmol Cl⁻, about 2 mmol AgCl forms and 1 mmol Cl⁻ remains. Taking the smaller number directly works here because of the coefficients—not for every reaction.',
        ),
      },
      {
        title: t(
          '固体质量与溶液组成分开算',
          'Calculate solid mass and solution composition separately',
        ),
        body: t(
          'AgCl 摩尔质量近似 143.5 g/mol，2 mmol 固体质量为 0.002×143.5=0.287 g。若 AgNO₃ 与 NaCl 投入为 2 与 3 mmol，水相另有 2 mmol NO₃⁻、3 mmol Na⁺。',
          'Using approximate AgCl molar mass 143.5 g/mol, 2 mmol solid has mass 0.002×143.5=0.287 g. Inputs of 2 mmol AgNO₃ and 3 mmol NaCl also leave 2 mmol NO₃⁻ and 3 mmol Na⁺ aqueous.',
        ),
      },
      {
        title: t('用守恒审查最后的清液', 'Audit the final clear liquid'),
        body: t(
          '水相电荷为 +3−2−1=0，不能只写“剩 Cl⁻”而漏掉旁观离子。若混合后总体积为 200 mL，剩余 Cl⁻ 浓度约 1 mmol/200 mL=0.005 mol/L。',
          'Aqueous charge is +3−2−1=0. Do not list only leftover Cl⁻ and omit spectators. At a final volume of 200 mL, remaining Cl⁻ concentration is about 1 mmol/200 mL=0.005 mol/L.',
        ),
      },
    ],
    misconception: t(
      '沉淀量达到平台，不等于所有溶质都用尽；滤液变清，也不等于变成纯水。需要用完整离子账本支持结论。',
      'A yield plateau does not mean all solutes are consumed, and a clear filtrate is not necessarily pure water. Support conclusions with the full ion ledger.',
    ),
    mission: t(
      '固定左侧投入 2 mmol，把右侧从 1 调到 6 mmol，记录每次预测、沉淀量与剩余离子。画出“右侧投入—沉淀量”图，标出平台并用限制量解释；最后在纸上换成 4 mmol 左侧再预测。',
      'Hold the left input at 2 mmol and vary the right from 1 to 6 mmol. Record predictions, solid and leftover ions. Plot right input against solid amount, explain the plateau using the limiting reagent, then predict on paper with 4 mmol on the left.',
    ),
    vocabulary: [
      { en: 'limiting reagent', zh: '限制反应物' },
      { en: 'excess', zh: '过量' },
      { en: 'filtrate', zh: '滤液' },
      { en: 'millimole, mmol', zh: '毫摩尔' },
    ],
    interactive: 'precipitation-quantity-lab',
    resources: [reactions, solubility],
    learning: {
      prerequisites: [
        'net-ionic-equation-detective',
        'molar-concentration-recipe',
        'limiting-reactants-and-leftovers',
      ],
      objectives: [
        t(
          '把浓度与体积转换为反应离子的 mmol 数。',
          'Convert concentration and volume to mmol of reacting ions.',
        ),
        t(
          '根据配平比例求沉淀量与剩余离子。',
          'Use balanced ratios to calculate precipitate and leftover ions.',
        ),
        t(
          '用电荷与元素守恒检验滤液组成。',
          'Audit filtrate composition using charge and element conservation.',
        ),
      ],
      workedExample: {
        prompt: t(
          '各 100 mL 的 0.030 mol/L CaCl₂ 与 0.020 mol/L Na₂CO₃ 混合。近似完全沉淀，忽略体积变化，求固体与主要滤液离子。',
          'Mix 100 mL each of 0.030 mol/L CaCl₂ and 0.020 mol/L Na₂CO₃. Assume approximately complete precipitation and additive volumes. Find the solid and major filtrate ions.',
        ),
        steps: [
          t(
            'Ca²⁺ 为 3 mmol，CO₃²⁻ 为 2 mmol；按 1∶1 反应，碳酸根限制产量。',
            'There are 3 mmol Ca²⁺ and 2 mmol CO₃²⁻. Their 1:1 reaction makes carbonate limiting.',
          ),
          t(
            '生成 2 mmol CaCO₃，按近似 100 g/mol 得 0.200 g；剩 1 mmol Ca²⁺。',
            'Form 2 mmol CaCO₃, or 0.200 g at approximately 100 g/mol; 1 mmol Ca²⁺ remains.',
          ),
          t(
            '旁观离子为 6 mmol Cl⁻、4 mmol Na⁺；总电荷 1×2+4−6=0。',
            'Spectators are 6 mmol Cl⁻ and 4 mmol Na⁺; charge totals 1×2+4−6=0.',
          ),
        ],
        answer: t(
          '约 0.200 g CaCO₃；滤液主要有 Ca²⁺、Na⁺、Cl⁻，并不是纯水。',
          'About 0.200 g CaCO₃; the filtrate mainly contains Ca²⁺, Na⁺ and Cl⁻ and is not pure water.',
        ),
      },
      anotherWay: t(
        '先按方程式组装“反应套装”，套装数量受最短缺的部件限制。再开两张收据：一张记固体，一张记留在水中的离子；两张加起来才是原来的全部元素库存。',
        'Build reaction kits according to the equation; the scarcest component limits the kit count. Then write two receipts: solid and dissolved ions. Only their combined element inventory matches the inputs.',
      ),
      explainPrompt: t(
        '给出一个具体投入量，反驳“过滤后变清就没有离子”的说法；同时说明你的计算采用了哪些近似。',
        'Use specific input amounts to refute “a clear filtrate has no ions”, and state the approximations behind your calculation.',
      ),
      quickChecks: [
        q(
          'ionic90-check1',
          t(
            '100 mL×0.020 mol/L 等于多少 mmol？',
            'How many mmol equal 100 mL×0.020 mol/L?',
          ),
          [
            t('2 mmol', '2 mmol'),
            t('20 mmol', '20 mmol'),
            t('2000 mmol', '2000 mmol'),
          ],
          0,
          t(
            '100 mL=0.100 L；0.100×0.020=0.0020 mol=2.0 mmol。',
            '100 mL=0.100 L; 0.100×0.020=0.0020 mol=2.0 mmol.',
          ),
          ['amount-concentration'],
          'application',
        ),
        q(
          'ionic90-check2',
          t(
            '1∶1 反应中，4 mmol Ag⁺ 与 2 mmol Cl⁻ 最多得到多少 AgCl？',
            'In a 1:1 reaction, what is the maximum AgCl from 4 mmol Ag⁺ and 2 mmol Cl⁻?',
          ),
          [t('6 mmol', '6 mmol'), t('4 mmol', '4 mmol'), t('2 mmol', '2 mmol')],
          2,
          t(
            'Cl⁻ 先用尽；不能仅凭 Ag⁺ 投入量算产量。',
            'Cl⁻ is used up first; the Ag⁺ input alone does not determine yield.',
          ),
          ['limiting-reagent'],
          'application',
        ),
        q(
          'ionic90-check3',
          t(
            '普通过滤能直接除掉溶解的 Na⁺ 吗？',
            'Does ordinary filtration directly remove dissolved Na⁺?',
          ),
          [
            t(
              '能，滤纸拦住所有带电粒子',
              'Yes; filter paper traps every charged particle',
            ),
            t(
              '不能，溶解离子通常随水通过',
              'No; dissolved ions usually pass with water',
            ),
            t('过滤会把 Na⁺ 变成 Na', 'It changes Na⁺ into Na'),
          ],
          1,
          t(
            '过滤按颗粒与介质的分离性质工作，不是把所有离子都筛掉。',
            'Filtration separates solid particles; it is not a screen that removes all ions.',
          ),
          ['filtrate-composition'],
        ),
      ],
    },
    questions: [
      q(
        'ionic90-q1',
        t(
          '3 mmol AgNO₃ 与 5 mmol NaCl 在本模型中生成多少 AgCl？',
          'How much AgCl forms from 3 mmol AgNO₃ and 5 mmol NaCl in this model?',
        ),
        [t('8 mmol', '8 mmol'), t('3 mmol', '3 mmol'), t('5 mmol', '5 mmol')],
        1,
        t(
          'Ag⁺∶Cl⁻ 为 1∶1；3 mmol Ag⁺ 先用尽，剩余 2 mmol Cl⁻。',
          'Ag⁺:Cl⁻ is 1:1. The 3 mmol Ag⁺ is limiting, leaving 2 mmol Cl⁻.',
        ),
        ['limiting-reagent'],
        'application',
      ),
      q(
        'ionic90-q2',
        t(
          '上题中，主要滤液离子账本是哪一项？',
          'For the previous inputs, which major-ion filtrate ledger is correct?',
        ),
        [
          t(
            '5 mmol Na⁺、3 mmol NO₃⁻、2 mmol Cl⁻',
            '5 mmol Na⁺, 3 mmol NO₃⁻, 2 mmol Cl⁻',
          ),
          t('只有 2 mmol Cl⁻', 'Only 2 mmol Cl⁻'),
          t('没有离子', 'No ions'),
        ],
        0,
        t(
          '旁观离子全部保留。电荷 +5−3−2=0；只有 Cl⁻ 的账本不完整。',
          'All spectators remain. Charge +5−3−2=0; a ledger with only Cl⁻ is incomplete.',
        ),
        ['filtrate-composition', 'charge-conservation'],
        'application',
      ),
      q(
        'ionic90-q3',
        t(
          '2 mmol AgCl 的质量是多少？取 M=143.5 g/mol。',
          'What is the mass of 2 mmol AgCl at M=143.5 g/mol?',
        ),
        [t('287 g', '287 g'), t('0.002 g', '0.002 g'), t('0.287 g', '0.287 g')],
        2,
        t(
          '2 mmol=0.002 mol；乘摩尔质量得 0.287 g。',
          '2 mmol=0.002 mol; multiplying by molar mass gives 0.287 g.',
        ),
        ['mole-mass'],
        'application',
      ),
      q(
        'ionic90-q4',
        t(
          '固定 2 mmol Ag⁺，Cl⁻ 从 3 增至 6 mmol，沉淀量如何变化？',
          'With Ag⁺ fixed at 2 mmol, Cl⁻ increases from 3 to 6 mmol. How does precipitate amount change?',
        ),
        [
          t('一定翻倍', 'It must double'),
          t(
            '仍约为 2 mmol，Ag⁺ 限制',
            'It stays about 2 mmol; Ag⁺ is limiting',
          ),
          t('减少到零', 'It falls to zero'),
        ],
        1,
        t(
          '超过配方所需的 Cl⁻ 只能增加剩余量，不能创造更多 Ag 原子。',
          'Excess Cl⁻ increases the leftover amount; it cannot create more Ag atoms.',
        ),
        ['limiting-reagent', 'yield-plateau'],
      ),
      q(
        'ionic90-q5',
        t(
          '3 mmol CaCl₂ 与 2 mmol Na₂CO₃ 混合后，哪个水相账本电荷平衡且组成正确？',
          'Which aqueous ledger is correct and charge balanced after mixing 3 mmol CaCl₂ with 2 mmol Na₂CO₃?',
        ),
        [
          t(
            '1 mmol Ca²⁺、4 mmol Na⁺、6 mmol Cl⁻',
            '1 mmol Ca²⁺, 4 mmol Na⁺, 6 mmol Cl⁻',
          ),
          t(
            '1 mmol Ca²⁺、2 mmol Na⁺、3 mmol Cl⁻',
            '1 mmol Ca²⁺, 2 mmol Na⁺, 3 mmol Cl⁻',
          ),
          t('只有 1 mmol Ca²⁺', 'Only 1 mmol Ca²⁺'),
        ],
        0,
        t(
          'Ca²⁺ 剩 1；旁观 Na⁺ 为 2×2=4，Cl⁻ 为 3×2=6，电荷 +2+4−6=0。',
          'Ca²⁺ left is 1; spectator Na⁺=2×2=4 and Cl⁻=3×2=6; charge is +2+4−6=0.',
        ),
        ['formula-ratios', 'filtrate-composition'],
        'application',
      ),
      q(
        'ionic90-q6',
        t(
          '模型给某反应离子剩余量为 0，能说真实实验中绝对一颗也没有吗？',
          'The model records 0 of a reacting ion remaining. Does this prove absolutely none remain in a real experiment?',
        ),
        [
          t('能，模型永远精确', 'Yes; models are always exact'),
          t(
            '能，难溶就是绝对不溶',
            'Yes; sparingly soluble means completely insoluble',
          ),
          t(
            '不能，这是忽略微量溶解等因素的近似',
            'No; it is an approximation omitting trace dissolution and other factors',
          ),
        ],
        2,
        t(
          '真实溶液有溶解平衡等限制；模型用近似帮助建立数量账本，不能把近似当绝对事实。',
          'Real solutions involve dissolution equilibria and other limits; the approximate ledger is useful without being an absolute account.',
        ),
        ['model-limits'],
      ),
    ],
  },
];
