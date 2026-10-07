import type { LocalizedText } from '@study/shared';
import type { Lesson } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const compositionLessons = [
  {
    id: 'mass-clues-to-empirical-formula',
    levelId: 'moles',
    order: 85,
    title: t(
      '糖和醋的共同密码：从质量找化学式',
      'A shared code in sugar and vinegar: mass clues to formulas',
    ),
    eyebrow: t(
      '第 85 课 · 最简式、分子式与证据边界',
      'Lesson 85 · Empirical formulas, molecular formulas and evidence limits',
    ),
    hook: t(
      '葡萄糖分子式是 C₆H₁₂O₆，醋中的乙酸是 C₂H₄O₂。一个与甜味有关，一个与酸味有关，为什么原子比例都能约成 1∶2∶1？只知道元素比例，真的能认出一种物质吗？',
      'Glucose has formula C₆H₁₂O₆, while acetic acid in vinegar is C₂H₄O₂. One is associated with sweetness, the other acidity—yet both reduce to a 1:2:1 atom ratio. Can an element ratio alone identify a substance?',
    ),
    hookHint: t(
      '最简式像缩小后的比例密码，不一定是一整个分子的原子数。先把质量换成摩尔数才能找到它；确定分子式还需独立的分子摩尔质量。食物是混合物，不能把营养标签直接当纯物质组成表。',
      'An empirical formula is a reduced ratio code, not necessarily the atom count of a whole molecule. Convert masses to moles first; independent molecular molar mass is needed for the molecular formula. Food mixtures’ nutrition labels are not pure-compound composition tables.',
    ),
    bigIdea: t(
      '元素质量 → 摩尔数 → 最简单整数比，得到最简式；分子式还要用独立摩尔质量确定整体倍数，结构与身份仍需更多证据。',
      'Element masses → moles → simplest whole-number ratio gives the empirical formula. Independent molar mass sets the molecular multiplier; structure and identity still need more evidence.',
    ),
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🍬',
        title: t(
          '甜与酸：相同比例，不同物质',
          'Sweet and sour: matching ratios, different substances',
        ),
        body: t(
          '葡萄糖与乙酸的最简式都为 CH₂O，却不是同一种分子。最简式只压缩比例，不给出大小或连接方式；不能从 CH₂O 猜味道，更不能用尝试试剂来鉴定。',
          'Glucose and acetic acid share empirical formula CH₂O, but are different molecules. A reduced ratio gives neither size nor connectivity. Do not predict taste from CH₂O or identify chemicals by tasting.',
        ),
      },
      {
        icon: '⚖️',
        title: t(
          '不同积木：同质量不等于同块数',
          'Different blocks: equal mass does not mean equal count',
        ),
        body: t(
          '若大积木比小积木重，同样一克装下的块数就不同。原子也有不同质量；C、H、O 分别近似用 12、1、16 g/mol，必须各自换算，不能把克数直接抄作下标。',
          'Heavier blocks give fewer pieces in one gram. Atoms also have different masses: use approximately 12, 1 and 16 g/mol for C, H and O. Convert each separately; grams are not formula subscripts.',
        ),
      },
      {
        icon: '🧱',
        title: t(
          '固体配比：不必存在小分子',
          'Solid ratios: no little molecule required',
        ),
        body: t(
          'Fe₂O₃ 表示铁氧化物中 Fe∶O 为 2∶3。离子固体可用式子描述整体组成，并不意味着有独立的 Fe₂O₃ 小分子。真实铁锈也常含水并混有其他成分，不能直接套用纯样品模型。',
          'Fe₂O₃ gives a 2:3 Fe:O ratio in an iron oxide. An ionic solid’s formula describes composition, not isolated Fe₂O₃ molecules. Real rust often contains water and other components; do not automatically treat it as the model’s pure sample.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '第一步：把每种质量换成 mol',
          'Step 1: convert each mass to moles',
        ),
        body: t(
          'A 含 C 12 g、H 2 g、O 16 g。分别用 n=m/M：C 为 12÷12=1 mol，H 为 2÷1=2 mol，O 为 16÷16=1 mol。克数比 12∶2∶16 不等于原子数量比；若给质量百分数，可先假设一份 100 g 样品。',
          'A contains 12 g C, 2 g H and 16 g O. Use n=m/M separately: C gives 12÷12=1 mol, H 2÷1=2 mol, O 16÷16=1 mol. The mass ratio 12:2:16 is not the atom ratio. For mass percentages, begin with an imagined 100 g sample.',
        ),
      },
      {
        title: t(
          '例题：最小值与半个比例',
          'Worked example: the smallest amount and half ratios',
        ),
        body: t(
          'A 的 1∶2∶1 已是最简整数比，得 CH₂O。C 含 Fe 11.2 g、O 4.8 g，换算为 0.200∶0.300 mol。都除以 0.200，得 1∶1.5；两项一起乘 2，得 2∶3，即 Fe₂O₃。不能把 1.5 随意舍成 1 或 2。',
          'A’s 1:2:1 ratio is already simplest, giving CH₂O. C has 11.2 g Fe and 4.8 g O: 0.200:0.300 mol. Divide both by 0.200 to get 1:1.5, then multiply both by two: 2:3, or Fe₂O₃. Do not round 1.5 arbitrarily to one or two.',
        ),
      },
      {
        title: t(
          '第三步：分子式需要新证据',
          'Step 3: molecular formulas need another clue',
        ),
        body: t(
          'CH₂O 的质量基准为 12+2×1+16=30 g/mol。若独立测得分子摩尔质量 180 g/mol，倍数为 180÷30=6，所有下标乘 6，得 C₆H₁₂O₆。若是 60 g/mol，就得 C₂H₄O₂。即使确定分子式，也不能唯一确定结构或物质身份。',
          'CH₂O has mass basis 12+2×1+16=30 g/mol. Independent molecular molar mass 180 g/mol gives multiplier 180÷30=6, hence C₆H₁₂O₆. At 60 g/mol it gives C₂H₄O₂. Even a molecular formula does not uniquely determine structure or identity.',
        ),
      },
    ],
    misconception: t(
      '同样的最简式不等于同一种物质，最简式也不一定是一整个分子。小数要区分合理测量误差与真实分数比：1.5 要整体倍乘，远离小整数的数据要检查，不能为了漂亮答案强行凑整。',
      'A shared empirical formula does not imply the same substance, and an empirical formula need not be a whole molecule. Distinguish small measurement rounding from true fractional ratios: scale a 1.5 ratio together; investigate data far from small whole numbers.',
    ),
    mission: t(
      '换尺侦探：先用克数看 A，再换成 mol，解释哪种标尺能比较原子数量。把 C 的 1∶1.5 修成整数比。展开 A、B 的独立摩尔质量线索，说明为何同样 CH₂O 会得到不同分子式。只读模型、做纸笔推理。',
      'Ruler detective: switch A from grams to moles and explain which scale compares atom counts. Turn C’s 1:1.5 into a whole-number ratio. Open A and B’s molar-mass clues and explain why CH₂O leads to different molecular formulas. Use the model and paper only.',
    ),
    vocabulary: [
      { en: 'empirical formula', zh: '最简式（实验式）' },
      { en: 'molecular formula', zh: '分子式' },
      { en: 'mass percentage', zh: '质量百分数' },
      { en: 'whole-number ratio', zh: '整数比' },
      { en: 'independent evidence', zh: '独立证据' },
    ],
    resources: [
      {
        title: t(
          'OpenStax：从组成数据确定化学式（英文，可选）',
          'OpenStax: formulas from composition data (optional)',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/3-2-determining-empirical-and-molecular-formulas',
      },
      {
        title: t(
          'OpenStax：最简式不等于分子式（英文，可选）',
          'OpenStax: empirical versus molecular formulas (optional)',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/2-4-chemical-formulas',
      },
    ],
    interactive: 'empirical-formula-lab',
    questions: [
      {
        id: 'empirical-q1',
        prompt: t(
          '纯样品含 C 12 g、H 2 g、O 16 g。原子数量比应怎样求？',
          'A pure sample contains 12 g C, 2 g H and 16 g O. How should you find its atom ratio?',
        ),
        options: [
          t(
            '各自除以摩尔质量，再比较 mol',
            'Divide each by its molar mass, then compare moles',
          ),
          t('直接用 12∶2∶16 当原子比', 'Use 12:2:16 directly as atom counts'),
          t('只看最重的元素', 'Look only at the heaviest element'),
        ],
        answer: 0,
        explanation: t(
          '不同元素的原子质量不同。C、H、O 换成 mol 后是 1∶2∶1，最简式为 CH₂O；质量比不能直接当原子比。',
          'Different atoms have different masses. C, H and O give 1:2:1 in moles, hence CH₂O. A mass ratio is not directly an atom ratio.',
        ),
      },
      {
        id: 'empirical-q2',
        prompt: t(
          '某分子含 6 个 C、12 个 H、6 个 O。最简式是什么？',
          'A molecule contains 6 C, 12 H and 6 O atoms. What is its empirical formula?',
        ),
        options: [t('C₆H₁₂O₆', 'C₆H₁₂O₆'), t('CH₂O', 'CH₂O'), t('CHO', 'CHO')],
        answer: 1,
        explanation: t(
          '把 6∶12∶6 所有项都除以 6，得 1∶2∶1。C₆H₁₂O₆ 是分子式；CH₂O 是约简后的最简式。',
          'Divide every term of 6:12:6 by six to get 1:2:1. C₆H₁₂O₆ is the molecular formula; CH₂O is the reduced empirical formula.',
        ),
      },
      {
        id: 'empirical-q3',
        prompt: t(
          'Fe∶O 的摩尔比归一化后为 1∶1.5。下一步是什么？',
          'A normalised Fe:O mole ratio is 1:1.5. What is the next step?',
        ),
        options: [
          t('只把 1.5 改成 2，写 FeO₂', 'Change only 1.5 to two: FeO₂'),
          t('把 1.5 舍成 1，写 FeO', 'Round 1.5 down to one: FeO'),
          t(
            '所有项乘 2，得 2∶3，写 Fe₂O₃',
            'Multiply all terms by two: 2:3, Fe₂O₃',
          ),
        ],
        answer: 2,
        explanation: t(
          '整体倍乘保持比例。1∶1.5 = 2∶3；只改一个数会改变组成，这不是小测量误差的修正。',
          'Scaling every term preserves composition: 1:1.5 = 2:3. Changing one term changes the ratio; this is not correction of a small measurement error.',
        ),
      },
      {
        id: 'empirical-q4',
        prompt: t(
          '某纯物质含碳 40.0%（质量百分数）。假设取 100 g 样品，碳质量是多少？',
          'A pure compound is 40.0% carbon by mass. In an imagined 100 g sample, what is the carbon mass?',
        ),
        options: [
          t('40.0 g', '40.0 g'),
          t('0.400 mol', '0.400 mol'),
          t('40 个原子', '40 atoms'),
        ],
        answer: 0,
        explanation: t(
          '40.0% 表示每 100 g 样品含 40.0 g 碳。若再求 mol，还需除以碳的摩尔质量；百分数不直接给粒子个数。',
          '40.0% means 40.0 g carbon per 100 g sample. Divide by carbon’s molar mass for moles; the percentage does not directly count particles.',
        ),
      },
      {
        id: 'empirical-q5',
        prompt: t(
          '只知道某分子物质的最简式为 CH₂O，能唯一确定分子式吗？',
          'Knowing only that a molecular substance has empirical formula CH₂O, can you uniquely determine its molecular formula?',
        ),
        options: [
          t('能，一定就是 CH₂O', 'Yes: it must be CH₂O'),
          t(
            '不能，还需独立的分子摩尔质量',
            'No: independent molecular molar mass is needed',
          ),
          t('能，只要知道样品颜色', 'Yes: just observe its colour'),
        ],
        answer: 1,
        explanation: t(
          'CH₂O、C₂H₄O₂、C₆H₁₂O₆ 等可共享最简比例。独立摩尔质量用来确定倍数；分子式确定后，结构仍可能有多种。',
          'CH₂O, C₂H₄O₂ and C₆H₁₂O₆ can share that reduced ratio. Independent molar mass sets the multiplier; several structures may still fit a molecular formula.',
        ),
      },
      {
        id: 'empirical-q6',
        prompt: t(
          '最简式 CH₂O 的质量基准为 30 g/mol，独立测得分子摩尔质量为 60 g/mol。分子式是什么？',
          'CH₂O has mass basis 30 g/mol; independent molecular molar mass is 60 g/mol. What is the molecular formula?',
        ),
        options: [
          t('CH₄O', 'CH₄O'),
          t('C₆H₁₂O₆', 'C₆H₁₂O₆'),
          t('C₂H₄O₂', 'C₂H₄O₂'),
        ],
        answer: 2,
        explanation: t(
          '倍数为 60÷30=2，所有下标一起乘 2，得到 C₂H₄O₂。不能只倍乘氢，也不能据此直接认定是乙酸。',
          'The multiplier is 60÷30=2. Multiply every subscript to obtain C₂H₄O₂. Do not double only H or uniquely identify acetic acid from this alone.',
        ),
      },
    ],
  },
  {
    id: 'water-hidden-in-crystals',
    levelId: 'analysis',
    order: 86,
    title: t(
      '干燥的晶体里，也能藏着水？',
      'Can a dry-looking crystal contain water?',
    ),
    eyebrow: t(
      '第 86 课 · 用重复称量寻找结晶水比例',
      'Lesson 86 · Use repeated weighing to find water of crystallisation',
    ),
    hook: t(
      '一份看起来干燥的晶体，移出其中的水后竟变轻了。水没有在外面形成水滴，为什么仍能算进晶体的组成？如果天平还称着容器，或途中洒掉一点固体，会不会得到一张假的配方？',
      'A dry-looking crystal becomes lighter after its water is removed. Why can water belong to its composition without visible surface droplets? Could weighing the container too, or spilling some solid, create a false recipe?',
    ),
    hookHint: t(
      '一些晶体含固定比例的结晶水，常写成“盐 · xH₂O”。找 x 不只是前后质量相减：还要扣皮重、确认残留身份、检查重复称量与其他损失。这里只读虚拟记录，不在家加热铜盐。',
      'Some crystals contain fixed proportions of water, written salt·xH₂O. Finding x needs tare, residue identity, repeated readings and other losses—not just subtraction. Read virtual records only; do not heat copper salts at home.',
    ),
    bigIdea: t(
      '水完全移出、残留盐已知且无其他损失时，用水与剩余无水盐各自的 mol 数求比例；恒重是证据之一，不是万能证明。',
      'With complete water removal, known anhydrous residue and no other losses, compare moles of water lost and salt remaining. Constant mass is evidence, not proof of every assumption.',
    ),
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '💎',
        title: t('看起来干燥，不等于不含水', 'Dry-looking is not water-free'),
        body: t(
          '结晶水属于晶体组成，不是外面的一滩溶剂。CuSO₄·5H₂O 的点号表示组成关联；5 作用于完整 H₂O，不是只给氧的下标加 5。它也不是独立盐分子的形状图。',
          'Water of crystallisation belongs to crystal composition, not a surface puddle. In CuSO₄·5H₂O, the dot expresses composition and five applies to whole H₂O units, not just oxygen. It is not a drawing of isolated salt molecules.',
        ),
      },
      {
        icon: '🥣',
        title: t('厨房秤：先扣掉碗', 'Kitchen scales: subtract the bowl'),
        body: t(
          '称面粉不能把碗也算进去。称晶体同理：总质量减空容器质量才是样品质量。前后差值能抵消同一个容器，却不能让残留盐的质量自动变正确。',
          'Flour mass is not flour-plus-bowl mass. Subtract the empty container to find crystal sample mass. A before/after difference cancels the same container, but residue mass still needs its own tare subtraction.',
        ),
      },
      {
        icon: '🧾',
        title: t('稳定不等于完整', 'Stable is not intact'),
        body: t(
          '包裹丢掉一件物品后，剩下重量也可能稳定。两次实验读数一致，同样不能找回洒失的固体。要同时看数字和现场记录，不能只寻找漂亮整数。',
          'A parcel’s weight can be stable after an item is lost. Equal experimental readings cannot recover spilled solid either. Interpret numbers with incident notes, not merely by searching for a neat integer.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '第一步：容器与样品分开',
          'Step 1: separate container and sample',
        ),
        body: t(
          'A 的空容器 14.00 g，脱水前总质量 18.99 g，原样品 4.99 g。最后两次冷却后总质量都为 17.19 g，剩余样品 17.19−14.00=3.19 g。题目另给定最终残留为无水 CuSO₄，未分解、未洒失。',
          'A’s tare is 14.00 g and initial total 18.99 g: 4.99 g sample. The final two cooled totals are 17.19 g, leaving 3.19 g sample. This record also stipulates anhydrous CuSO₄ residue with no decomposition or solid loss.',
        ),
      },
      {
        title: t(
          '例题：各换成 mol，再求水∶盐',
          'Worked example: convert both parts to moles',
        ),
        body: t(
          '水质量 = 4.99−3.19=1.80 g。用 M(H₂O)=18、M(CuSO₄)=159.5 g/mol：水 0.100 mol，盐 0.0200 mol。水∶盐 = 5∶1，得到 CuSO₄·5H₂O。1.80∶3.19 的克数比不是结晶水数。',
          'Water mass = 4.99−3.19=1.80 g. With M(H₂O)=18 and M(CuSO₄)=159.5 g/mol, water is 0.100 mol and salt 0.0200 mol. Their 5:1 ratio gives CuSO₄·5H₂O. The gram ratio 1.80:3.19 is not the hydration number.',
        ),
      },
      {
        title: t(
          '第三步：评估证据，再接受公式',
          'Step 3: judge evidence before accepting a formula',
        ),
        body: t(
          '早期读数还在下降，不能假装已经得到无水盐。B 有固体洒失，即使最后恒重，减少的质量也不全是水，不能可靠求 x。真实恒重还要结合仪器精度；本模型用两次相同的冷却读数作为检查点，不模拟加热过程。',
          'Falling early readings do not establish anhydrous salt. B has recorded solid loss; even constant final mass cannot make all lost mass water. Real constant-mass decisions also consider instrument precision. This model uses equal cooled readings as a checkpoint, not a heating simulation.',
        ),
      },
    ],
    misconception: t(
      '变轻的部分只有在无其他损失等条件下才全是水。恒重也不证明一切：样品可能洒失或分解，残留身份需要另有证据。结晶水比例是摩尔比，不是水与盐的克数比。',
      'Lost mass is all water only when other losses are excluded. Constant mass does not prove everything: spillage or decomposition may occur; residue identity needs separate evidence. Hydration number is a mole ratio, not a gram ratio.',
    ),
    mission: t(
      '记录审计员：逐次读取 A，说明何时证据足够；读 B，解释恒重为何救不了洒失记录。再把方法迁移到 C 的硫酸镁，计算 x，别默认所有盐都是五水合物。写出“扣皮重→分出水和盐→各换 mol→求比例”。只做虚拟审计。',
      'Record auditor: decide when A has enough evidence, then explain why constant mass cannot rescue B’s spillage. Transfer the method to C’s magnesium sulfate: calculate x rather than assuming every hydrate has five waters. Write: tare → water and salt masses → moles → ratio. Audit virtually only.',
    ),
    vocabulary: [
      { en: 'water of crystallisation', zh: '结晶水' },
      { en: 'hydrate', zh: '水合物' },
      { en: 'anhydrous', zh: '无水的' },
      { en: 'tare mass', zh: '皮重（空容器质量）' },
      { en: 'constant mass', zh: '恒重' },
      { en: 'residue', zh: '残留物' },
    ],
    resources: [
      {
        title: t(
          'OpenStax：水合物化学式与名称（英文，可选）',
          'OpenStax: hydrate formulas and names (optional)',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/2-7-chemical-nomenclature',
      },
      {
        title: t(
          'PubChem：七水硫酸镁组成记录（英文，可选）',
          'PubChem: magnesium sulfate heptahydrate composition (optional)',
        ),
        url: 'https://pubchem.ncbi.nlm.nih.gov/compound/24843',
      },
    ],
    interactive: 'hydrate-evidence-lab',
    questions: [
      {
        id: 'hydrate-q1',
        prompt: t(
          '空容器 14.00 g，容器加原样品 18.99 g。原样品质量是多少？',
          'Tare is 14.00 g and container plus initial sample is 18.99 g. What is the sample mass?',
        ),
        options: [
          t('4.99 g', '4.99 g'),
          t('18.99 g', '18.99 g'),
          t('32.99 g', '32.99 g'),
        ],
        answer: 0,
        explanation: t(
          '样品质量 = 总质量−皮重 = 18.99−14.00=4.99 g。把容器也算进样品，会影响后面的 mol 数。',
          'Sample mass = total minus tare: 18.99−14.00=4.99 g. Including the container would distort mole calculations.',
        ),
      },
      {
        id: 'hydrate-q2',
        prompt: t(
          '完整 A 记录原样品 4.99 g、无水残留盐 3.19 g，且只有水移出。水质量是多少？',
          'Intact A starts with 4.99 g hydrate and leaves 3.19 g anhydrous salt, with only water removed. What is water mass?',
        ),
        options: [
          t('3.19 g', '3.19 g'),
          t('1.80 g', '1.80 g'),
          t('8.18 g', '8.18 g'),
        ],
        answer: 1,
        explanation: t(
          '题设无其他损失，水质量为 4.99−3.19=1.80 g。若有固体洒失或分解，就不能全部当水。',
          'With no other losses, water mass = 4.99−3.19=1.80 g. Spillage or decomposition would invalidate counting the entire difference as water.',
        ),
      },
      {
        id: 'hydrate-q3',
        prompt: t(
          'CuSO₄·5H₂O 中的 5 表示什么？',
          'What does five mean in CuSO₄·5H₂O?',
        ),
        options: [
          t('每克盐含 5 g 水', '5 g water per gram of salt'),
          t('只有氧原子数量乘 5', 'Multiply only oxygen by five'),
          t(
            '每份 CuSO₄ 的组成比例对应 5 份 H₂O',
            'Five H₂O units per CuSO₄ formula-unit ratio',
          ),
        ],
        answer: 2,
        explanation: t(
          '5 作用于完整 H₂O，表示水∶盐为 5∶1 的粒子／摩尔组成比，不是克数比或独立盐分子的结构图。',
          'Five applies to whole H₂O units, giving a 5:1 particle/mole composition ratio—not a mass ratio or isolated salt molecule structure.',
        ),
      },
      {
        id: 'hydrate-q4',
        prompt: t(
          '第一次移水后读数降低，但还没有重复称量。最合理判断是什么？',
          'The first post-removal reading is lower, with no repeated weighing yet. What is the best judgement?',
        ),
        options: [
          t(
            '证据不够，检查后续冷却称量与其他损失',
            'More evidence is needed: later cooled readings and other losses',
          ),
          t('已经证明水都移出了', 'All water is proven removed'),
          t('降低就说明晶体是假的', 'Any decrease proves a fake crystal'),
        ],
        answer: 0,
        explanation: t(
          '单次变轻只说明质量变化，不证明完全脱水。还需后续恒重、残留身份与无其他损失等证据。',
          'One decrease shows mass change, not complete dehydration. Later constant mass, residue identity and exclusion of other losses are needed.',
        ),
      },
      {
        id: 'hydrate-q5',
        prompt: t(
          'B 已记录固体洒失，但最后两次质量相同。还能直接把减少的质量都当结晶水吗？',
          'B has recorded solid spillage, but final masses match. Can all lost mass still be counted as water?',
        ),
        options: [
          t('能，恒重消除任何误差', 'Yes: constant mass fixes every error'),
          t('不能，还包含固体损失', 'No: it also includes spilled solid'),
          t('能，只需四舍五入', 'Yes: just round the answer'),
        ],
        answer: 1,
        explanation: t(
          '恒重不能补回固体。全部差值当水会夸大水质量，残留盐的数量也已改变，这组数据不能直接可靠求 x。',
          'Constant mass cannot recover solid. Counting the whole difference as water overstates its mass, while salt amount has also changed. The records cannot directly determine x reliably.',
        ),
      },
      {
        id: 'hydrate-q6',
        prompt: t(
          '可靠记录得到水 0.100 mol、无水 CuSO₄ 0.0200 mol。CuSO₄·xH₂O 中 x 是多少？',
          'Reliable records give 0.100 mol water and 0.0200 mol anhydrous CuSO₄. What is x?',
        ),
        options: [t('0.2', '0.2'), t('2', '2'), t('5', '5')],
        answer: 2,
        explanation: t(
          'n水÷n盐 = 0.100÷0.0200=5，写 CuSO₄·5H₂O。倒过来除得 0.2，不是这里的 x。',
          'nwater/nsalt = 0.100/0.0200=5, giving CuSO₄·5H₂O. Reversing the division gives 0.2, not this x.',
        ),
      },
    ],
  },
] satisfies Lesson[];
