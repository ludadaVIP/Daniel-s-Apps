import type { Lesson } from './lessons';

export const organicStructureLessons = [
  {
    id: 'same-formula-different-connections',
    levelId: 'organic',
    order: 81,
    title: {
      zh: '同一张原料单，为什么不是同一种分子？',
      en: 'Same atom inventory, different molecules?',
    },
    eyebrow: {
      zh: '第 81 课 · 从碳的邻居认识构造异构体',
      en: 'Lesson 81 · Structural isomers through carbon neighbours',
    },
    hook: {
      zh: '给你同样四块积木，既能排成一条链，也能搭成一个分叉。四个碳和十个氢也能有不同连接：分子式都写 C₄H₁₀，为什么沸点却不同？难道分子式只是“原料清单”？',
      en: 'The same four blocks can form a chain or a branch. Four carbons and ten hydrogens can also connect differently: both formulas are C₄H₁₀, yet their boiling points differ. Is a molecular formula only an atom inventory?',
    },
    hookHint: {
      zh: '分子式告诉你原子种类和数量，却不完整说明谁连着谁。同分子式、不同连接方式的分子叫构造异构体；只把同一种分子画弯或转个方向，不会自动变成新异构体。',
      en: 'A molecular formula gives atom types and counts, not a complete neighbour map. Molecules with the same formula but different connections are structural isomers. Bending or turning a drawing alone does not create a new one.',
    },
    bigIdea: {
      zh: '判断构造异构体要检查两件事：分子式相同，连接关系不同；外形画得不同不是充分证据。',
      en: 'Structural isomers need the same molecular formula and different connectivity; a different-looking drawing is not enough.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧩',
        title: {
          zh: '积木：清单与搭法是两件事',
          en: 'Blocks: inventory and assembly differ',
        },
        body: {
          zh: '同样数量的积木，可以搭成不同结构。化学还要遵守连接规则：本课中每个中性碳的键级总和是 4，不能为了“画得像”随意多接一个氢。',
          en: 'The same number of blocks can make different structures. Chemistry also has bonding rules: each neutral carbon here has total bond order four. You cannot add an extra hydrogen just to improve the picture.',
        },
      },
      {
        icon: '🏷️',
        title: {
          zh: '燃料名称：丁烷与异丁烷',
          en: 'Fuel names: butane and isobutane',
        },
        body: {
          zh: '一些燃料标签会出现 butane 或 isobutane。丁烷与异丁烷（2-甲基丙烷）都是 C₄H₁₀，却不是同一物质。实际产品常为加压混合物，不能仅凭纯物质沸点判断罐内状态，也不要拆罐验证。',
          en: 'Some fuel labels mention butane or isobutane. Butane and isobutane (2-methylpropane) are both C₄H₁₀ but are different substances. Real products are often pressurised mixtures; pure-substance boiling points do not determine their contents’ state. Do not open a canister to test this.',
        },
      },
      {
        icon: '🌡️',
        title: {
          zh: '性质：同质量不保证同沸点',
          en: 'Properties: equal mass does not mean equal boiling point',
        },
        body: {
          zh: '约 1 atm 时，丁烷沸点约 −0.5 °C，异丁烷约 −11.7 °C。分子形状会影响分子间相互作用。这是“结构影响性质”的实证，不是靠数原子就能猜出的完整答案。',
          en: 'Near 1 atm, butane boils at about −0.5 °C and isobutane at about −11.7 °C. Shape influences intermolecular interactions: evidence that structure affects properties, beyond simply counting atoms.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先数原子：分子式是否相同？',
          en: 'Count atoms first: do the formulas match?',
        },
        body: {
          zh: '丁烷 CH₃—CH₂—CH₂—CH₃：C 共 4 个，H 是 3+2+2+3=10。异丁烷 CH(CH₃)₃：中心 CH 加三个 CH₃，C 是 1+3=4，H 是 1+9=10。两者都满足 C₄H₁₀。',
          en: 'Butane, CH₃–CH₂–CH₂–CH₃, has four C atoms and 3+2+2+3=10 H atoms. Isobutane, CH(CH₃)₃, has a central CH and three CH₃ groups: 1+3=4 C atoms and 1+9=10 H atoms. Both are C₄H₁₀.',
        },
      },
      {
        title: {
          zh: '例题：追踪每个碳的邻居',
          en: 'Worked example: trace each carbon’s neighbours',
        },
        body: {
          zh: '丁烷里每个碳最多连两个碳邻居；异丁烷有一个碳连三个碳邻居。只旋转或重画丁烷，不能让它多出这样的中心碳。因此它们是构造异构体，而丁烷的直线画法与折线画法不是两个构造异构体。',
          en: 'Each carbon in butane has at most two carbon neighbours; one carbon in isobutane has three. Rotating or redrawing butane cannot create that central connection. They are structural isomers, whereas straight and bent drawings of butane are not two structural isomers.',
        },
      },
      {
        title: {
          zh: '再检查碳的四个连接',
          en: 'Then check carbon’s four bond-order units',
        },
        body: {
          zh: '链端碳有一个 C—C 单键，所以配三个 H；链中间碳有两个 C—C 单键，所以配两个 H；支链中心有三个 C—C 单键，所以只能配一个 H。沸腾改变的是分子间距离与运动，不会把这些分子内的连接改成另一种异构体。',
          en: 'A chain-end carbon has one C–C single bond and three H atoms. An inner-chain carbon has two C–C single bonds and two H atoms. The branch centre has three C–C single bonds and only one H. Boiling changes molecular spacing and motion, not these internal connections into another isomer.',
        },
      },
    ],
    misconception: {
      zh: '“画面看起来弯了，所以是支链”不对，支链要看连接，不能看画纸上的弯曲。“分子式相同就完全一样”也不对。本课专门讨论连接方式不同的构造异构；相同连接下的三维立体异构属于后续内容，不能仅凭一张二维图随便判断。',
      en: 'A bent drawing is not necessarily a branched molecule: branching depends on connectivity. A matching formula does not make every property identical either. This lesson focuses on structural isomerism; 3D stereoisomerism with the same connectivity is a later topic and should not be guessed from a simple 2D drawing.',
    },
    mission: {
      zh: '纸上分子侦探：画出 CH₃—CH₂—CH₂—CH₃ 的两种摆法，给碳编号并列出相邻碳；再画 CH(CH₃)₃。用“同原子清单、不同邻居表”解释哪两个才是构造异构体。只画图，不接触燃料。',
      en: 'Paper molecule detective: draw CH₃–CH₂–CH₂–CH₃ two ways, number the carbons and list their neighbours. Then draw CH(CH₃)₃. Use matching inventories and different neighbour maps to identify structural isomers. Draw only; do not handle fuels.',
    },
    vocabulary: [
      { en: 'structural isomer', zh: '构造异构体' },
      { en: 'molecular formula', zh: '分子式' },
      { en: 'connectivity', zh: '连接关系' },
      { en: 'branched chain', zh: '支链' },
      { en: '2-methylpropane (isobutane)', zh: '2-甲基丙烷（异丁烷）' },
    ],
    resources: [
      {
        title: {
          zh: 'NIST：丁烷普通沸点记录（英文，可选）',
          en: 'NIST: butane normal boiling-point records (optional)',
        },
        url: 'https://webbook.nist.gov/cgi/cbook.cgi?ID=C106978&Type=TBOIL',
      },
      {
        title: {
          zh: 'NIST：异丁烷普通沸点记录（英文，可选）',
          en: 'NIST: isobutane normal boiling-point records (optional)',
        },
        url: 'https://webbook.nist.gov/cgi/cbook.cgi?ID=C75285&Type=TBOIL',
      },
    ],
    interactive: 'isomer-detective-lab',
    questions: [
      {
        id: 'isomer-q1',
        prompt: {
          zh: '丁烷与异丁烷互为构造异构体，关键证据是什么？',
          en: 'What establishes butane and isobutane as structural isomers?',
        },
        options: [
          {
            zh: '分子式相同，连接关系不同',
            en: 'Same molecular formula, different connectivity',
          },
          { zh: '照片颜色不同', en: 'Different colours in a photograph' },
          {
            zh: '一个画在左边，一个画在右边',
            en: 'One is drawn left and the other right',
          },
        ],
        answer: 0,
        explanation: {
          zh: '两者都是 C₄H₁₀，但碳骨架一个是链，一个有中心碳连着三个碳邻居；这才是不同连接的证据。',
          en: 'Both are C₄H₁₀, but one has a chain and the other a carbon with three carbon neighbours. That establishes different connectivity.',
        },
      },
      {
        id: 'isomer-q2',
        prompt: {
          zh: '把 CH₃—CH₂—CH₂—CH₃ 从直线画成折线，所有连接不变，会得到什么？',
          en: 'Redraw CH₃–CH₂–CH₂–CH₃ as a zigzag without changing any connection. What results?',
        },
        options: [
          { zh: '新的构造异构体', en: 'A new structural isomer' },
          {
            zh: '同一种分子的另一种画法',
            en: 'Another drawing of the same molecule',
          },
          { zh: '自动变成 C₃H₈', en: 'It automatically becomes C₃H₈' },
        ],
        answer: 1,
        explanation: {
          zh: '构造异构关注谁连着谁，不是画面的朝向或弯曲。原子数和邻居表不变，就没有制造新的构造异构体。',
          en: 'Structural isomerism concerns which atoms are connected, not drawing direction or bends. Unchanged atom counts and neighbour maps do not create a new structural isomer.',
        },
      },
      {
        id: 'isomer-q3',
        prompt: {
          zh: '异丁烷中，中心碳连三个碳单键，还应连几个 H？',
          en: 'The central carbon in isobutane has three C–C single bonds. How many H atoms should it carry?',
        },
        options: [
          { zh: '3 个', en: '3' },
          { zh: '2 个', en: '2' },
          { zh: '1 个', en: '1' },
        ],
        answer: 2,
        explanation: {
          zh: '每个碳在本课中总键级为 4。已有三个 C—C 单键，只剩一个连接给 H。再加更多 H 会超过 4。',
          en: 'Each carbon here has total bond order four. Three C–C single bonds leave one bond for H; more H atoms would exceed four.',
        },
      },
      {
        id: 'isomer-q4',
        prompt: {
          zh: 'C₄H₁₀ 与 C₃H₈ 能否互称同分异构体？',
          en: 'Can C₄H₁₀ and C₃H₈ be isomers of each other?',
        },
        options: [
          {
            zh: '不能，因为分子式不同',
            en: 'No, because their molecular formulas differ',
          },
          {
            zh: '能，因为都有 C 和 H',
            en: 'Yes, because both contain C and H',
          },
          {
            zh: '能，因为都是气体就够了',
            en: 'Yes, because being gases is enough',
          },
        ],
        answer: 0,
        explanation: {
          zh: '同分异构必须先满足同分子式；原子种类相同但数量不同不够。',
          en: 'Isomerism requires the same molecular formula first. Matching atom types with different counts is not enough.',
        },
      },
      {
        id: 'isomer-q5',
        prompt: {
          zh: '丁烷与异丁烷的沸点不同，沸腾时主要改变哪种相互作用？',
          en: 'Butane and isobutane have different boiling points. Which interactions mainly change during boiling?',
        },
        options: [
          { zh: '把 C 原子变成 O 原子', en: 'C atoms turn into O atoms' },
          {
            zh: '分子之间的相互作用，不是拆掉碳骨架',
            en: 'Intermolecular interactions, not dismantling the carbon skeleton',
          },
          { zh: '所有 C—C 键都断开', en: 'All C–C bonds break' },
        ],
        answer: 1,
        explanation: {
          zh: '沸腾是物态变化，分子本身仍保持连接。结构会影响分子间作用，所以同分子式也可能有不同沸点。',
          en: 'Boiling is a state change: molecules retain their connectivity. Structure affects intermolecular interactions, so identical formulas can have different boiling points.',
        },
      },
      {
        id: 'isomer-q6',
        prompt: {
          zh: '图中 CH(CH₃)₃ 一共有多少 C 和 H？',
          en: 'How many C and H atoms are in CH(CH₃)₃?',
        },
        options: [
          { zh: '3 个 C，9 个 H', en: '3 C and 9 H' },
          { zh: '4 个 C，12 个 H', en: '4 C and 12 H' },
          { zh: '4 个 C，10 个 H', en: '4 C and 10 H' },
        ],
        answer: 2,
        explanation: {
          zh: '中心 CH 贡献 1 个 C、1 个 H；括号内 CH₃ 有三组，贡献 3 个 C、9 个 H，合计 C₄H₁₀。',
          en: 'The central CH contributes 1 C and 1 H; three CH₃ groups contribute 3 C and 9 H. Total: C₄H₁₀.',
        },
      },
    ],
  },
  {
    id: 'alkenes-addition-and-polyethene',
    levelId: 'organic',
    order: 82,
    title: {
      zh: '双键怎样接新邻居？从乙烯到塑料',
      en: 'How a double bond gains new neighbours',
    },
    eyebrow: {
      zh: '第 82 课 · 烷烃、烯烃、加成与加聚',
      en: 'Lesson 82 · Alkanes, alkenes, addition and addition polymerisation',
    },
    hook: {
      zh: '乙烯 C₂H₄ 是小分子，聚乙烯却能做成袋子、薄膜和容器。它们的原子从哪里来？为什么乙烯的 C=C 双键既能参与加氢，也能把许多小分子连接成长链？',
      en: 'Ethene, C₂H₄, is a small molecule; polyethene can form bags, films and containers. Where do the atoms come from? How can ethene’s C=C bond participate in adding hydrogen or joining many small molecules into a chain?',
    },
    hookHint: {
      zh: '先盯住每个碳的四个连接：C=C 算两个，两个 C—H 单键再算两个。反应后两碳之间仍保留一个单键，新的连接可以接 H，也可以接相邻单元的碳。',
      en: 'Track each carbon’s four bond-order units: C=C contributes two, and two C–H bonds contribute two more. After reaction, one C–C bond remains; new connections can attach H atoms or carbons in neighbouring units.',
    },
    bigIdea: {
      zh: '加成与加聚改变的是连接方式；乙烯的双键可变成单键并形成新键，但原子必须守恒，每个碳的连接也不能超额。',
      en: 'Addition and addition polymerisation change connectivity: ethene’s double bond becomes a single bond as new bonds form, while atoms are conserved and carbon valence is not exceeded.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '📦',
        title: {
          zh: '包装材料：小分子连成大分子',
          en: 'Packaging: small molecules become large ones',
        },
        body: {
          zh: '聚乙烯（PE）常用于袋、膜和其他包装。长链中能找到重复的 —CH₂—CH₂— 单元；实际材料性质还取决于链长、支化和加工条件，不是“重复次数多就一定最好”。',
          en: 'Polyethene (PE) is used in bags, films and other packaging. Its chains contain repeating –CH₂–CH₂– units. Real properties also depend on chain length, branching and processing, not simply having the most repeats.',
        },
      },
      {
        icon: '🏭',
        title: {
          zh: '加氢：工业改变双键的一种办法',
          en: 'Hydrogenation: an industrial way to change double bonds',
        },
        body: {
          zh: '一些工业过程用氢气在合适催化条件下参与加成。这里用最简单的乙烯到乙烷模型学规则，不用它判断食品、营养或真实工艺，也不在家混合可燃气体。',
          en: 'Some industrial processes add hydrogen under suitable catalytic conditions. This lesson uses ethene to ethane to learn the simplest rule, not to assess food, nutrition or real processes. Do not mix flammable gases at home.',
        },
      },
      {
        icon: '♻️',
        title: {
          zh: '使用与回收：理解材料从哪里来',
          en: 'Use and recovery: understand a material’s origin',
        },
        body: {
          zh: '聚合产生新化学连接；机械回收中的分类、清洗和熔融加工不等于自动把 PE 变回乙烯。能否处理某个包装仍要看材料组合、污染和当地系统。',
          en: 'Polymerisation makes new chemical connections. Sorting, washing and melt-processing in mechanical recycling do not automatically turn PE back into ethene. Handling an item depends on material combinations, contamination and local systems.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '烷烃与烯烃：先看碳之间的键',
          en: 'Alkanes and alkenes: inspect carbon–carbon bonds',
        },
        body: {
          zh: '本课的乙烷 CH₃—CH₃ 是烷烃，只有单键；乙烯 CH₂=CH₂ 是烯烃，有 C=C。乙烯“不饱和”表示它能在双键处参与加成，不是缺少碳原子，也不是一个碳可以无限加东西。',
          en: 'Ethane, CH₃–CH₃, is an alkane with single bonds only. Ethene, CH₂=CH₂, is an alkene with C=C. Unsaturated means it can undergo addition at the double bond, not that it lacks carbon or can add unlimited atoms.',
        },
      },
      {
        title: {
          zh: '例题一：加一份 H₂，生成乙烷',
          en: 'Worked example 1: add one H₂ to form ethane',
        },
        body: {
          zh: 'CH₂=CH₂ + H₂ → CH₃—CH₃，需要合适催化剂和条件。双键变单键，每个碳各接一个 H，C 是 2→2，H 是 4+2→6。新分子是 C₂H₆，不是把两碳拆成两份 CH₄，也不能保留双键同时接三个 H。',
          en: 'CH₂=CH₂ + H₂ → CH₃–CH₃ requires suitable catalysts and conditions. The double bond becomes single and each carbon gains one H: C is 2→2 and H is 4+2→6. The product is C₂H₆, not two CH₄ molecules; a carbon cannot keep the double bond and also carry three H.',
        },
      },
      {
        title: {
          zh: '例题二：新邻居换成相邻单元的碳',
          en: 'Worked example 2: new neighbours are carbons in other units',
        },
        body: {
          zh: '乙烯加聚的重复单元是 —CH₂—CH₂—。链内每个碳连接两个 H 和两个碳单键，仍是 4。显示 3 个重复单元时，内部链段含 6 个 C 和 12 个 H；两端的键继续通向画面外，不能把它误读成完整的 C₆H₁₂ 分子。乙烯加聚不排出水等小分子，实际端基另计。',
          en: 'Ethene addition polymerisation gives –CH₂–CH₂– repeats. Each interior carbon has two H atoms and two C–C single bonds, still totalling four. Three repeats show 6 C and 12 H in an interior segment whose end bonds continue outside the view—not a complete C₆H₁₂ molecule. No small molecule such as water is expelled; real end groups are counted separately.',
        },
      },
    ],
    misconception: {
      zh: '“双键断开后，两碳各自跑掉”不对：这里双键变单键，两碳仍相连。“重复单元就是原单体不变地粘在一起”也不对：乙烯的 C=C 已参与反应，PE 链里相应连接是单键。屏幕上的省略号表示更长的链，不是已经封口的完整分子。',
      en: 'The two carbons do not separate when the double bond participates: a single bond remains. Nor are unchanged ethene molecules simply glued together: C=C has reacted, leaving single bonds in PE. Dots indicate a longer chain, not a complete capped molecule.',
    },
    mission: {
      zh: '连接审查员：在模型里先加 H₂，再切换到连接许多乙烯，分别数 C、H 和每个碳的键级总和。把 —CH₃—CH₃— 当重复单元试画一下，指出它为什么会让链内碳多出一个连接。只用纸笔或 APP。',
      en: 'Connection inspector: add H₂ in the model, then switch to joining many ethenes. Count C, H and the bond-order total at each carbon. Try drawing –CH₃–CH₃– as an interior repeat and explain why it overfills carbon. Use paper or the app only.',
    },
    vocabulary: [
      { en: 'alkane', zh: '烷烃' },
      { en: 'alkene', zh: '烯烃' },
      { en: 'unsaturated', zh: '不饱和的' },
      { en: 'addition reaction', zh: '加成反应' },
      { en: 'addition polymerisation', zh: '加聚反应' },
      { en: 'polyethene / polyethylene (PE)', zh: '聚乙烯（PE）' },
    ],
    resources: [
      {
        title: {
          zh: 'OpenStax：烃与聚乙烯（英文，可选）',
          en: 'OpenStax: hydrocarbons and polyethene (optional)',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons',
      },
    ],
    interactive: 'alkene-addition-lab',
    questions: [
      {
        id: 'alkene-addition-q1',
        prompt: {
          zh: '为什么乙烯 C₂H₄ 属于烯烃？',
          en: 'Why is ethene, C₂H₄, an alkene?',
        },
        options: [
          {
            zh: '因为所有含碳物质都是烯烃',
            en: 'Because every carbon substance is an alkene',
          },
          {
            zh: '因为有碳碳双键 C=C',
            en: 'Because it has a carbon–carbon double bond',
          },
          { zh: '因为它没有氢', en: 'Because it has no hydrogen' },
        ],
        answer: 1,
        explanation: {
          zh: '烯烃的重要结构线索是 C=C。乙烯是 CH₂=CH₂；乙烷 CH₃—CH₃ 只有单键，是烷烃。',
          en: 'C=C is the key alkene feature. Ethene is CH₂=CH₂; ethane, CH₃–CH₃, has only single bonds and is an alkane.',
        },
      },
      {
        id: 'alkene-addition-q2',
        prompt: {
          zh: '一份乙烯在合适条件下加成一份 H₂，得到什么？',
          en: 'What forms when one ethene adds one H₂ under suitable conditions?',
        },
        options: [
          { zh: 'C₂H₄，H₂ 没有参与', en: 'C₂H₄, with H₂ unused' },
          { zh: '两份 CH₄', en: 'Two CH₄ molecules' },
          {
            zh: 'C₂H₆，两个碳仍相连',
            en: 'C₂H₆, with the carbons still joined',
          },
        ],
        answer: 2,
        explanation: {
          zh: 'C=C 变 C—C，两个碳各接一个 H。碳仍为 2，氢由 4+2 变成 6，产物是乙烷。',
          en: 'C=C becomes C–C and each carbon gains one H. There are still 2 C atoms and 4+2=6 H atoms: ethane.',
        },
      },
      {
        id: 'alkene-addition-q3',
        prompt: {
          zh: '乙烯加聚的正确重复单元是哪一个？',
          en: 'Which is the correct repeat unit for ethene addition polymerisation?',
        },
        options: [
          { zh: '—CH₂—CH₂—', en: '–CH₂–CH₂–' },
          { zh: '—CH₃—CH₃—', en: '–CH₃–CH₃–' },
          { zh: '—CH=CH—', en: '–CH=CH–' },
        ],
        answer: 0,
        explanation: {
          zh: '链内每个碳带两个 H，再接两个碳单键，总连接为 4。CH₃ 若还接两个碳就会达到 5；CH=CH 则保留了本反应已参与的双键并少了 H。',
          en: 'Each interior carbon has two H atoms and two C–C single bonds, totalling four. CH₃ plus two carbon bonds would total five; CH=CH retains the reacted double bond and has too few H atoms.',
        },
      },
      {
        id: 'alkene-addition-q4',
        prompt: {
          zh: '乙烯加聚时，是否每连接一个单体都要排出一份水？',
          en: 'Does joining each ethene monomer in addition polymerisation expel a water molecule?',
        },
        options: [
          {
            zh: '是，所有聚合都必须排水',
            en: 'Yes; all polymerisation must expel water',
          },
          {
            zh: '否，乙烯加聚不产生这种小分子副产物',
            en: 'No; ethene addition polymerisation does not produce that small-molecule byproduct',
          },
          { zh: '是，水提供碳', en: 'Yes; water supplies carbon' },
        ],
        answer: 1,
        explanation: {
          zh: '乙烯的 C 和 H 保留在聚合物重复单元中，不排出水。不要把加聚与某些会放出小分子的缩聚混为一谈；引发剂与端基另行考虑。',
          en: 'Ethene’s C and H remain in polymer repeats; water is not expelled. Do not confuse addition polymerisation with some condensation processes that release small molecules; initiation and end groups are considered separately.',
        },
      },
      {
        id: 'alkene-addition-q5',
        prompt: {
          zh: '图中显示 3 个 —CH₂—CH₂— 重复单元，两端还有省略号。怎样读它？',
          en: 'A drawing shows three –CH₂–CH₂– repeats with dots at both ends. How should it be read?',
        },
        options: [
          {
            zh: '完整分子一定是 C₆H₁₂，已经封口',
            en: 'It must be a complete capped C₆H₁₂ molecule',
          },
          {
            zh: '完整分子一定只有三个碳',
            en: 'The whole molecule must have only three carbons',
          },
          {
            zh: '显示内部链段的 6 个 C、12 个 H，链还在画面外延伸',
            en: 'It shows 6 C and 12 H in an interior segment; the chain continues outside the view',
          },
        ],
        answer: 2,
        explanation: {
          zh: '省略号与向外的键很重要：显示的是链的一段，不包含完整端基。不能把链段中的原子清单当成整个聚合物的分子式。',
          en: 'Dots and outward bonds matter: the drawing is a segment without full end groups. Its atom inventory is not the molecular formula of the entire polymer.',
        },
      },
      {
        id: 'alkene-addition-q6',
        prompt: {
          zh: '乙烯加氢后，碳碳连接发生了什么？',
          en: 'What happens to the carbon–carbon connection after ethene hydrogenation?',
        },
        options: [
          {
            zh: '双键变单键，两碳仍相连',
            en: 'The double bond becomes single; the carbons stay joined',
          },
          { zh: '两碳完全分离', en: 'The carbons separate completely' },
          {
            zh: '保留双键，并让每个碳接三个 H',
            en: 'The double bond stays and each carbon gains three H atoms',
          },
        ],
        answer: 0,
        explanation: {
          zh: '乙烷 CH₃—CH₃ 中，每个碳有三个 C—H 单键和一个 C—C 单键，总键级 4。如果保留双键还带三个 H，就会超过 4。',
          en: 'In CH₃–CH₃, each carbon has three C–H single bonds and one C–C single bond, total bond order four. Keeping a double bond with three H atoms would exceed four.',
        },
      },
    ],
  },
] satisfies Lesson[];
