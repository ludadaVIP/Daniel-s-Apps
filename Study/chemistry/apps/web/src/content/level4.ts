import type { Lesson } from './lessons';

export const level4Lessons = [
  {
    id: 'periodic-table',
    levelId: 'table',
    order: 18,
    title: {
      zh: '元素周期表：不是一张背诵表',
      en: 'The periodic table: not a list to memorise',
    },
    eyebrow: {
      zh: '第 18 课 · 元素的地图',
      en: 'Lesson 18 · A map of elements',
    },
    hook: {
      zh: '为什么厨房里的钠、呼吸的氧、手机里的硅，会被放进同一张巨大表格？',
      en: 'Why do kitchen sodium, breathing oxygen and phone silicon share one enormous chart?',
    },
    hookHint: {
      zh: '周期表不是元素的“通讯录”，而是一张按原子序数排列的规律地图。位置会暗示元素的性质和它容易形成的离子。',
      en: 'The periodic table is not an address book. It is a pattern map ordered by atomic number, and position hints at properties and likely ions.',
    },
    bigIdea: {
      zh: '周期表按原子序数排列；同一列的元素有相似的最外层电子结构，因此常有相似性质。',
      en: 'The periodic table is ordered by atomic number; elements in one column have similar outer electrons and often similar properties.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '📱',
        title: { zh: '芯片里的硅', en: 'Silicon in chips' },
        body: {
          zh: '硅的位置帮助科学家预测它能成为很有用的半导体材料。',
          en: 'Silicon’s position helps scientists predict its useful semiconductor behaviour.',
        },
      },
      {
        icon: '💡',
        title: { zh: '霓虹灯', en: 'Neon signs' },
        body: {
          zh: '氖在最右侧一列，极不活泼；通电时却能发出独特的光。',
          en: 'Neon sits in the far-right column, rarely reacts, yet glows distinctively when energized.',
        },
      },
      {
        icon: '🧂',
        title: { zh: '盐里的钠和氯', en: 'Sodium and chlorine in salt' },
        body: {
          zh: '相隔很远的两种元素，结合后能构成每餐都可能见到的食盐。',
          en: 'Two far-apart elements can join to make table salt on your dinner table.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '从 1 号开始排队', en: 'It starts with number 1' },
        body: {
          zh: '每向右或向下，原子序数会增加。你已经知道原子序数就是质子数，所以周期表的顺序来自原子核，而不是名字或颜色。',
          en: 'Moving across or down increases atomic number. Since atomic number is proton count, the order comes from nuclei—not names or colours.',
        },
      },
      {
        title: {
          zh: '横行叫周期，竖列叫族',
          en: 'Rows are periods; columns are groups',
        },
        body: {
          zh: '横向的“周期”反映电子层逐步增加；竖向的“族”中，最外层电子数量相近。初学时，不必记住整张表，先学会读位置。',
          en: 'Horizontal periods reflect additional electron shells; vertical groups have similar outer-electron counts. Do not memorise the whole chart—learn to read position first.',
        },
      },
      {
        title: {
          zh: '位置能给你线索，不是魔法预言',
          en: 'Position gives clues, not magic predictions',
        },
        body: {
          zh: '左侧多为金属，右侧多为非金属，最右列的稀有气体通常很稳定。周期表能帮助你提出靠谱猜想，具体性质仍要用实验验证。',
          en: 'The left side is mostly metals, the right mostly non-metals, and far-right noble gases are usually stable. The table supports good predictions, which experiments still test.',
        },
      },
    ],
    misconception: {
      zh: '“周期”不是重复的元素，也不是时间周期；它指周期表的一横行。相似的元素通常在同一“族”（竖列）中。',
      en: 'A period does not mean repeated elements or time; it is a horizontal row. Similar elements are usually found in one group, a vertical column.',
    },
    mission: {
      zh: '找一张真实周期表，任选一种你在生活中见过的元素。记录它的原子序数、所在族和周期，再猜猜它更像金属还是非金属。',
      en: 'Find a real periodic table and choose an element you meet in life. Record atomic number, group and period, then predict whether it is more metal-like or non-metal-like.',
    },
    vocabulary: [
      { en: 'periodic table', zh: '元素周期表' },
      { en: 'group', zh: '族（竖列）' },
      { en: 'period', zh: '周期（横行）' },
      { en: 'noble gas', zh: '稀有气体' },
    ],
    interactive: 'periodic-table-explorer',
    questions: [
      {
        id: 'table-q1',
        prompt: {
          zh: '周期表最基本的排列顺序是什么？',
          en: 'What is the fundamental ordering of the periodic table?',
        },
        options: [
          { zh: '原子序数从小到大', en: 'Increasing atomic number' },
          { zh: '元素中文名称的笔画', en: 'Element-name stroke count' },
          { zh: '颜色从浅到深', en: 'Colour from light to dark' },
        ],
        answer: 0,
        explanation: {
          zh: '原子序数就是质子数，周期表按它递增排列。',
          en: 'Atomic number is proton count, and the table increases by it.',
        },
      },
      {
        id: 'table-q2',
        prompt: {
          zh: '周期表中的“族”是哪一个方向？',
          en: 'Which direction is a group in the periodic table?',
        },
        options: [
          { zh: '竖直的一列', en: 'A vertical column' },
          { zh: '水平的一行', en: 'A horizontal row' },
          { zh: '斜对角线', en: 'A diagonal' },
        ],
        answer: 0,
        explanation: {
          zh: '族是竖列；周期才是横行。',
          en: 'A group is a vertical column; a period is a horizontal row.',
        },
      },
      {
        id: 'table-q3',
        prompt: {
          zh: '为什么同一族的元素常有相似性质？',
          en: 'Why do elements in one group often behave similarly?',
        },
        options: [
          {
            zh: '最外层电子结构相近',
            en: 'Their outer-electron structures are similar',
          },
          {
            zh: '它们原子序数完全相同',
            en: 'They have identical atomic numbers',
          },
          { zh: '它们都没有电子', en: 'They have no electrons' },
        ],
        answer: 0,
        explanation: {
          zh: '化学反应特别受最外层电子影响，而同族元素在这方面相近。',
          en: 'Chemical reactions are strongly influenced by outer electrons, which are similar within a group.',
        },
      },
    ],
  },
  {
    id: 'groups',
    levelId: 'table',
    order: 19,
    title: { zh: '族：元素的性格家族', en: 'Groups: element families' },
    eyebrow: {
      zh: '第 19 课 · 同一列的共同点',
      en: 'Lesson 19 · What a column has in common',
    },
    hook: {
      zh: '锂、钠、钾看起来并不像一家人：一个在电池里，一个在盐里，一个在香蕉里。为什么化学家却把它们放在同一列？',
      en: 'Lithium, sodium and potassium appear in batteries, salt and bananas. Why do chemists place them in one column?',
    },
    hookHint: {
      zh: '它们的原子大小不同，但最外层都有 1 个电子。这个共同点让它们常以相似方式反应、形成相似的离子。',
      en: 'Their atoms are different sizes, but each has one outer electron. That shared feature makes them often react and form ions in similar ways.',
    },
    bigIdea: {
      zh: '同一族元素的最外层电子结构相近，所以它们的化学性质常常相似；向下仍会出现有意义的差别。',
      en: 'Elements in one group have similar outer-electron structures, so their chemistry is often alike—while meaningful differences still appear down the group.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🍌',
        title: { zh: '香蕉里的钾', en: 'Potassium in bananas' },
        body: {
          zh: '钾与钠同属第 1 族，身体需要它参与神经和肌肉的正常工作。',
          en: 'Potassium shares Group 1 with sodium; your body needs it for normal nerve and muscle work.',
        },
      },
      {
        icon: '🧂',
        title: { zh: '食盐里的钠', en: 'Sodium in table salt' },
        body: {
          zh: '钠常形成 Na⁺，再与 Cl⁻ 排成食盐晶体。',
          en: 'Sodium commonly forms Na⁺, which arranges with Cl⁻ in salt crystals.',
        },
      },
      {
        icon: '💡',
        title: { zh: '灯泡里的氩', en: 'Argon in light bulbs' },
        body: {
          zh: '氩在第 18 族，通常很不活泼，适合用来保护灯丝。',
          en: 'Argon is in Group 18 and usually unreactive, useful for protecting a bulb filament.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '把同一列当作“家族”', en: 'Treat a column as a family' },
        body: {
          zh: '第 1 族从 Li、Na 到 K；第 17 族有 F、Cl、Br；第 18 族有 He、Ne、Ar。它们不是完全相同，却有一个重要的电子结构共性。',
          en: 'Group 1 includes Li, Na and K; Group 17 has F, Cl and Br; Group 18 includes He, Ne and Ar. They are not identical, but share an important electron-structure feature.',
        },
      },
      {
        title: {
          zh: '最外层电子是反应的“握手位”',
          en: 'Outer electrons are reaction handshakes',
        },
        body: {
          zh: '化学反应首先常涉及最外层电子。第 1 族容易失去 1 个电子，常形成 +1 离子；第 17 族容易得到 1 个电子，常形成 −1 离子。',
          en: 'Chemical reactions often involve outer electrons first. Group 1 tends to lose one, making +1 ions; Group 17 tends to gain one, making −1 ions.',
        },
      },
      {
        title: {
          zh: '相似不等于一模一样',
          en: 'Similar does not mean identical',
        },
        body: {
          zh: '同族元素的反应强弱、熔点和外观仍可能不同。周期表给你一个合理的起点；真正的数值和结论来自实验。',
          en: 'Reactivity, melting point and appearance can still differ within a group. The table gives a sensible starting prediction; experiments provide the actual values and conclusions.',
        },
      },
    ],
    misconception: {
      zh: '同一族不是“所有性质都相同”。它表示有相似的反应模式，而不是每一种物理性质都相等。',
      en: 'Being in one group does not mean every property matches. It signals similar reaction patterns, not identical physical properties.',
    },
    mission: {
      zh: '在饮料、食物或矿泉水标签上找 Na、K、Ca、Cl。挑两种元素，查它们是否在同一族，并用“最外层电子”解释你的猜想。',
      en: 'Find Na, K, Ca or Cl on a drink, food or mineral-water label. Pick two, check whether they share a group, then explain your prediction using outer electrons.',
    },
    vocabulary: [
      { en: 'group', zh: '族' },
      { en: 'outer electron', zh: '最外层电子' },
      { en: 'alkali metal', zh: '碱金属' },
      { en: 'halogen', zh: '卤素' },
    ],
    interactive: 'group-family-match',
    questions: [
      {
        id: 'group-q1',
        prompt: {
          zh: '同一族元素相似性的一个重要原因是什么？',
          en: 'What is one important reason elements in a group are similar?',
        },
        options: [
          { zh: '最外层电子结构相近', en: 'Similar outer-electron structures' },
          { zh: '原子序数相同', en: 'Identical atomic numbers' },
          {
            zh: '它们的原子完全一样大',
            en: 'Their atoms are exactly the same size',
          },
        ],
        answer: 0,
        explanation: {
          zh: '最外层电子会强烈影响反应方式，因此相近的最外层电子带来相似的化学行为。',
          en: 'Outer electrons strongly influence reactions, so similar outer electrons lead to similar chemical behaviour.',
        },
      },
      {
        id: 'group-q2',
        prompt: {
          zh: '哪两个元素最可能在同一族？',
          en: 'Which two elements are most likely in the same group?',
        },
        options: [
          { zh: 'Na 和 K', en: 'Na and K' },
          { zh: 'Na 和 Cl', en: 'Na and Cl' },
          { zh: 'He 和 O', en: 'He and O' },
        ],
        answer: 0,
        explanation: {
          zh: 'Na 与 K 都在第 1 族，常形成 +1 离子。',
          en: 'Na and K are both in Group 1 and commonly form +1 ions.',
        },
      },
      {
        id: 'group-q3',
        prompt: {
          zh: '第 17 族元素常形成什么电荷的简单离子？',
          en: 'What charge do Group 17 elements often form as simple ions?',
        },
        options: [
          { zh: '−1', en: '−1' },
          { zh: '+1', en: '+1' },
          { zh: '+4', en: '+4' },
        ],
        answer: 0,
        explanation: {
          zh: '它们常得到 1 个电子来形成带 −1 电荷的离子，例如 Cl⁻。',
          en: 'They often gain one electron to form −1 ions, such as Cl⁻.',
        },
      },
    ],
  },
  {
    id: 'periods',
    levelId: 'table',
    order: 20,
    title: {
      zh: '周期：电子层的楼层',
      en: 'Periods: floors for electron shells',
    },
    eyebrow: {
      zh: '第 20 课 · 为什么元素排成横行？',
      en: 'Lesson 20 · Why elements form rows',
    },
    hook: {
      zh: '锂、钠、钾都在第 1 族；为什么它们却不在同一横行？',
      en: 'Lithium, sodium and potassium are all in Group 1. Why are they not in the same row?',
    },
    hookHint: {
      zh: '它们都有 1 个最外层电子，却分别有 2、3、4 层电子活动区域。横行告诉我们“用了几层”，竖列提示“最外层像不像”。',
      en: 'They each have one outer electron but use 2, 3 and 4 electron-shell regions. Rows tell us how many layers; columns hint whether the outer layer is alike.',
    },
    bigIdea: {
      zh: '周期表的一横行叫周期；对前 20 号元素来说，周期数对应原子中电子层的数量。',
      en: 'A horizontal row is a period; for the first 20 elements, the period number matches the number of electron shells in the atom.',
    },
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '🔋',
        title: { zh: '锂电池与钾元素', en: 'Lithium batteries and potassium' },
        body: {
          zh: '锂与钾同族却在不同周期，原子大小和反应细节因此并不完全一样。',
          en: 'Lithium and potassium share a group but occupy different periods, so their sizes and reaction details differ.',
        },
      },
      {
        icon: '🌱',
        title: { zh: '植物需要的镁', en: 'Magnesium for plants' },
        body: {
          zh: '镁在第 3 周期；它的电子结构让它常形成 Mg²⁺，也成为叶绿素中心的重要元素。',
          en: 'Magnesium is in Period 3; its electron structure helps it form Mg²⁺ and makes it important in chlorophyll.',
        },
      },
      {
        icon: '🪟',
        title: { zh: '玻璃里的硅', en: 'Silicon in glass' },
        body: {
          zh: '硅也在第 3 周期，能与氧形成稳定的网络结构，出现在玻璃和芯片材料中。',
          en: 'Silicon is also in Period 3 and forms stable networks with oxygen, appearing in glass and chip materials.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '向右走：同一层内增加电子',
          en: 'Move right: add electrons in one layer',
        },
        body: {
          zh: '从一个周期的左边到右边，原子序数逐个增加。早期元素中，电子依次填进同一最外层，直到这一层达到较稳定的状态。',
          en: 'Across a period, atomic number rises one by one. In early elements, electrons fill the same outer shell until it reaches a more stable state.',
        },
      },
      {
        title: {
          zh: '换行：开启一层新的电子区域',
          en: 'New row: begin a new electron region',
        },
        body: {
          zh: '到下一周期时，电子开始进入更外面的一层。第 2 周期元素有 2 层，第 3 周期元素有 3 层。把它想成建筑多开了一层，而不是元素被复制。',
          en: 'At the next period, electrons begin a farther-out layer. Period 2 elements have two shells; Period 3 elements have three. Think of a building opening another floor, not elements being copied.',
        },
      },
      {
        title: {
          zh: '周期与族一起读，线索才完整',
          en: 'Read period and group together',
        },
        body: {
          zh: '族提示最外层电子和常见反应模式；周期提示电子层数与原子大小的大致趋势。两个位置一起看，才能作出更好的化学预测。',
          en: 'Group hints at outer electrons and common reaction patterns; period hints at shell count and broad size trends. Read both positions for a better chemical prediction.',
        },
      },
    ],
    misconception: {
      zh: '第 3 周期不表示“有 3 个电子”或“原子序数是 3”。它表示电子分布到了 3 层活动区域。',
      en: 'Period 3 does not mean three electrons or atomic number 3. It means electrons occupy three shell regions.',
    },
    mission: {
      zh: '选 Li、Na、K 三个元素，在周期表上圈出它们。它们同属第 1 族，却在第 2、3、4 周期；用“最外层电子”和“电子层数”各说一句解释。',
      en: 'Circle Li, Na and K on a periodic table. They share Group 1 but sit in Periods 2, 3 and 4; write one explanation using outer electrons and one using shell count.',
    },
    vocabulary: [
      { en: 'period', zh: '周期（横行）' },
      { en: 'electron shell', zh: '电子层' },
      { en: 'outer shell', zh: '最外层电子层' },
      { en: 'atomic size', zh: '原子大小' },
    ],
    interactive: 'period-shell-viewer',
    questions: [
      {
        id: 'period-q1',
        prompt: {
          zh: '对前 20 号元素来说，第 3 周期通常告诉你什么？',
          en: 'For the first 20 elements, what does Period 3 usually tell you?',
        },
        options: [
          {
            zh: '有 3 层电子活动区域',
            en: 'There are 3 electron-shell regions',
          },
          { zh: '有 3 个质子', en: 'There are 3 protons' },
          {
            zh: '最外层一定有 3 个电子',
            en: 'There must be 3 outer electrons',
          },
        ],
        answer: 0,
        explanation: {
          zh: '周期数对应电子层数；最外层电子数要看元素在这一行的具体位置。',
          en: 'Period number matches shell count; outer-electron count depends on where the element sits in that row.',
        },
      },
      {
        id: 'period-q2',
        prompt: {
          zh: 'Na 与 K 同族却不同周期，哪句话正确？',
          en: 'Na and K share a group but differ in period. Which statement is correct?',
        },
        options: [
          {
            zh: '它们最外层电子规律相近，但电子层数不同',
            en: 'Their outer-electron pattern is similar, but shell count differs',
          },
          { zh: '它们有相同数量的质子', en: 'They have the same proton count' },
          {
            zh: '它们必定所有性质完全相同',
            en: 'Every property must be identical',
          },
        ],
        answer: 0,
        explanation: {
          zh: '同族带来相似的最外层电子，周期不同意味着层数不同，因此并不完全相同。',
          en: 'Same group gives similar outer electrons; different periods mean different shell counts, so they are not identical.',
        },
      },
      {
        id: 'period-q3',
        prompt: {
          zh: '周期表中的“周期”是哪一个方向？',
          en: 'Which direction is a period in the periodic table?',
        },
        options: [
          { zh: '水平的一行', en: 'A horizontal row' },
          { zh: '竖直的一列', en: 'A vertical column' },
          { zh: '任意斜线', en: 'Any diagonal line' },
        ],
        answer: 0,
        explanation: {
          zh: '周期就是横行；竖列叫作族。',
          en: 'A period is a horizontal row; a vertical column is a group.',
        },
      },
    ],
  },
  {
    id: 'metals',
    levelId: 'table',
    order: 21,
    title: {
      zh: '金属：为什么能做锅和电线？',
      en: 'Metals: why pots and wires?',
    },
    eyebrow: {
      zh: '第 21 课 · 材料选择的线索',
      en: 'Lesson 21 · Clues for choosing materials',
    },
    hook: {
      zh: '一根铜线能弯、能导电；一口铝锅轻又能传热。它们为什么恰好适合这些工作？',
      en: 'A copper wire bends and conducts; an aluminium pan is light and transfers heat. Why do these materials fit their jobs so well?',
    },
    hookHint: {
      zh: '金属原子常以紧密、有规则的方式排列，部分电子能在整个结构中活动。这会带来导电、导热、有光泽和可塑形等常见性质。',
      en: 'Metal atoms often pack in an orderly structure with some electrons able to move through it. That leads to common properties such as conduction, heat transfer, shine and shapeability.',
    },
    bigIdea: {
      zh: '金属的原子结构与排列方式，使它们常能导电、导热、有光泽，并能被压成薄片或拉成细丝。',
      en: 'Metal atoms and their arrangement often let metals conduct electricity and heat, shine, flatten into sheets and draw into wires.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🔌',
        title: { zh: '铜电线', en: 'Copper wiring' },
        body: {
          zh: '铜能让电荷容易通过，也能被拉成细长、柔韧的导线。',
          en: 'Copper lets charge move easily and can be drawn into long, flexible wires.',
        },
      },
      {
        icon: '🍳',
        title: { zh: '铝锅', en: 'An aluminium pan' },
        body: {
          zh: '铝较轻、导热良好，因此能把炉火的能量较快传给食物。',
          en: 'Aluminium is relatively light and conducts heat well, moving stove energy to food.',
        },
      },
      {
        icon: '🪙',
        title: { zh: '硬币与合金', en: 'Coins and alloys' },
        body: {
          zh: '很多硬币是合金：把金属混合，能调整硬度、耐腐蚀性和颜色。',
          en: 'Many coins are alloys: mixing metals tunes hardness, corrosion resistance and colour.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '从用途倒推性质', en: 'Work backward from the job' },
        body: {
          zh: '电线需要导电又不易折断；锅底需要传热；自行车车架需要结实但别太重。材料工程师会先问“它必须做什么”，再选性质合适的材料。',
          en: 'Wires need to conduct without snapping; pan bases transfer heat; bike frames need strength without too much weight. Materials engineers first ask what a job needs, then choose fitting properties.',
        },
      },
      {
        title: {
          zh: '“可移动电子”是一个有用模型',
          en: 'Mobile electrons are a useful model',
        },
        body: {
          zh: '在金属中，部分最外层电子不像只属于一个原子。它们能在排列整齐的正离子之间活动，帮助传递电荷和能量。模型不等于照片，却能解释很多现象。',
          en: 'In metals, some outer electrons are not tied to one atom. They can move among an orderly array of positive ions, helping transfer charge and energy. It is a model, not a photograph, but explains much.',
        },
      },
      {
        title: {
          zh: '金属也各有脾气',
          en: 'Metals still have different personalities',
        },
        body: {
          zh: '铁很强却会生锈；金很不活泼却昂贵；汞在室温下是液体。说“金属通常如何”是起点，不是忽略每种金属的独特例外。',
          en: 'Iron is strong but rusts; gold is unreactive but costly; mercury is liquid at room temperature. “Metals usually” is a start, not permission to ignore each metal’s exceptions.',
        },
      },
    ],
    misconception: {
      zh: '“有光泽”或“灰色”都不足以单独判断金属。要看多条性质和材料结构；石墨能导电，却是碳的一种非金属形式。',
      en: 'Shine or grey colour alone cannot prove a material is metal. Use multiple properties and structure; graphite conducts but is a non-metal form of carbon.',
    },
    mission: {
      zh: '在家中找三件金属制品，例如钥匙、勺子、充电线插头。猜测每件物品最需要的两项性质，并说明为什么没有选木头或塑料。',
      en: 'Find three metal objects at home—perhaps a key, spoon and charger plug. Predict the two most important properties for each, and explain why wood or plastic was not chosen.',
    },
    vocabulary: [
      { en: 'metal', zh: '金属' },
      { en: 'conduct', zh: '传导' },
      { en: 'malleable', zh: '可压成薄片的' },
      { en: 'alloy', zh: '合金' },
    ],
    interactive: 'metal-property-lab',
    questions: [
      {
        id: 'metal-q1',
        prompt: {
          zh: '为什么铜常被用作电线材料？',
          en: 'Why is copper commonly used for wiring?',
        },
        options: [
          {
            zh: '它导电且能拉成细丝',
            en: 'It conducts and can be drawn into thin wires',
          },
          { zh: '它完全不导热', en: 'It cannot conduct heat at all' },
          { zh: '它永远不会弯曲', en: 'It can never bend' },
        ],
        answer: 0,
        explanation: {
          zh: '铜的导电性和延展性都适合电线的工作。',
          en: 'Copper’s electrical conductivity and ductility both suit wiring.',
        },
      },
      {
        id: 'metal-q2',
        prompt: {
          zh: '铝锅传热快，最直接有用的性质是什么？',
          en: 'An aluminium pan transfers heat quickly. Which property is directly useful?',
        },
        options: [
          { zh: '良好的导热性', en: 'Good heat conductivity' },
          { zh: '透明性', en: 'Transparency' },
          { zh: '没有任何电子', en: 'Having no electrons' },
        ],
        answer: 0,
        explanation: {
          zh: '导热性让炉火提供的能量较快传到食物。',
          en: 'Thermal conductivity moves energy from the stove to food efficiently.',
        },
      },
      {
        id: 'metal-q3',
        prompt: { zh: '合金是什么？', en: 'What is an alloy?' },
        options: [
          {
            zh: '混合的金属，或金属与少量其他元素的材料',
            en: 'A material mixing metals, or a metal with small amounts of other elements',
          },
          { zh: '任何透明液体', en: 'Any transparent liquid' },
          { zh: '单独的一种纯元素', en: 'A single pure element only' },
        ],
        answer: 0,
        explanation: {
          zh: '合金常通过混合元素来获得更适合实际用途的性质。',
          en: 'Alloys commonly mix elements to gain properties better suited to a real job.',
        },
      },
    ],
  },
  {
    id: 'non-metals',
    levelId: 'table',
    order: 22,
    title: { zh: '非金属：空气、屏幕与生命', en: 'Non-metals: air, screens and life' },
    eyebrow: { zh: '第 22 课 · 不是“没有用的金属”', en: 'Lesson 22 · Far more than not-metals' },
    hook: { zh: '氧气让我们呼吸，碳构成生命分子，硅帮助制造芯片。它们不像铜或铁，却为什么同样重要？', en: 'Oxygen lets us breathe, carbon builds life molecules and silicon helps make chips. They do not resemble copper or iron—so why are they just as important?' },
    hookHint: { zh: '“非金属”不是低配版的金属，而是一大类性质多样的元素。很多位于周期表右侧，常共享或得到电子，并能形成分子、玻璃、药物和生命物质。', en: 'Non-metals are not lower-grade metals; they are a diverse family. Many sit on the right side of the table, often share or gain electrons, and build molecules, glass, medicines and living matter.' },
    bigIdea: { zh: '非金属的性质变化很大，但许多不易导电、没有金属光泽，且在化合物中倾向得到或共享电子。', en: 'Non-metals vary widely, but many conduct poorly, lack metallic shine, and tend to gain or share electrons in compounds.' },
    estimatedMinutes: 17,
    everydayExamples: [
      { icon: '🫁', title: { zh: '空气中的氧和氮', en: 'Oxygen and nitrogen in air' }, body: { zh: '两者都是非金属气体；氧支持呼吸，氮是空气中含量最多的气体。', en: 'Both are non-metal gases; oxygen supports breathing while nitrogen is the most abundant gas in air.' } },
      { icon: '✏️', title: { zh: '铅笔芯里的石墨', en: 'Graphite in a pencil' }, body: { zh: '石墨是碳的一种形式。它是少见的例外：虽然是非金属，却能导电。', en: 'Graphite is a form of carbon. It is an unusual exception: a non-metal that can conduct.' } },
      { icon: '🧴', title: { zh: '泳池里的氯', en: 'Chlorine in a pool' }, body: { zh: '经过严格控制的含氯化合物可帮助消毒；它提醒我们元素性质与安全使用必须一起学习。', en: 'Carefully controlled chlorine compounds can help disinfect; they remind us to learn properties alongside safe use.' } },
    ],
    steps: [
      { title: { zh: '位置给出第一条线索', en: 'Position gives a first clue' }, body: { zh: '周期表右上方主要是非金属，左下方主要是金属，中间有一条“阶梯线”附近的类金属。位置方便预测，却不能替代观察和实验。', en: 'The upper right of the periodic table is mainly non-metal, the lower left mainly metal, with metalloids near a staircase boundary. Position helps predict but cannot replace observations and experiments.' } },
      { title: { zh: '非金属并不是一种样子', en: 'Non-metals do not have one look' }, body: { zh: '氧是气体，溴是液体，碳可以是柔软的石墨或坚硬的钻石。它们没有统一外观，因此不能只凭颜色、状态或“看起来不像金属”就下结论。', en: 'Oxygen is a gas, bromine a liquid, and carbon can be soft graphite or hard diamond. There is no single appearance, so colour, state or a first impression cannot settle classification.' } },
      { title: { zh: '反应时常得到或共享电子', en: 'They often gain or share electrons' }, body: { zh: '氯常得到一个电子成为 Cl⁻；氧、氢和碳也常通过共享电子形成分子。这个“电子策略”能解释盐、水、二氧化碳等物质怎样连接。', en: 'Chlorine often gains one electron to become Cl⁻; oxygen, hydrogen and carbon also often share electrons to form molecules. This electron strategy helps explain salt, water and carbon dioxide.' } },
    ],
    misconception: { zh: '“不导电”不是非金属的绝对定义。石墨是重要反例；分类要综合原子结构、位置和多种性质。', en: '“Does not conduct” is not an absolute definition of non-metal. Graphite is an important counterexample; classification combines structure, position and multiple properties.' },
    mission: { zh: '找三样含非金属元素的日常物品：一瓶水、一张纸、一支铅笔或一包食盐都可以。指出其中至少一种非金属元素，并说出它在物品中可能扮演的角色。', en: 'Find three everyday items containing non-metal elements: water, paper, a pencil or table salt all work. Name at least one non-metal in each and its likely role.' },
    vocabulary: [{ en: 'non-metal', zh: '非金属' }, { en: 'molecule', zh: '分子' }, { en: 'shared electron', zh: '共享电子' }, { en: 'metalloid', zh: '类金属' }],
    interactive: 'nonmetal-evidence-sort',
    questions: [
      { id: 'nonmetal-q1', prompt: { zh: '哪一种物质是“非金属也能导电”的有名例外？', en: 'Which material is a well-known conducting non-metal exception?' }, options: [{ zh: '石墨', en: 'Graphite' }, { zh: '橡胶', en: 'Rubber' }, { zh: '玻璃杯', en: 'A glass cup' }], answer: 0, explanation: { zh: '石墨中的碳层结构允许部分电子移动，所以它能导电。', en: 'Graphite’s layered carbon structure allows some electrons to move, so it conducts.' } },
      { id: 'nonmetal-q2', prompt: { zh: '氯原子形成 Cl⁻ 时发生了什么？', en: 'What happens when a chlorine atom forms Cl⁻?' }, options: [{ zh: '得到一个电子', en: 'It gains one electron' }, { zh: '失去一个质子', en: 'It loses one proton' }, { zh: '变成完全不同的元素', en: 'It becomes a completely different element' }], answer: 0, explanation: { zh: '得到一个电子让负电比正电多一份；质子数不变，因此仍是氯。', en: 'Gaining one electron adds one extra negative charge; proton count remains, so it is still chlorine.' } },
      { id: 'nonmetal-q3', prompt: { zh: '为什么不能只凭“它不导电”判断一种元素是非金属？', en: 'Why can you not classify an element as non-metal using only “it does not conduct”?' }, options: [{ zh: '单一性质不足，且存在石墨等反例', en: 'One property is insufficient, and exceptions such as graphite exist' }, { zh: '所有金属都不导电', en: 'All metals do not conduct' }, { zh: '元素没有任何性质', en: 'Elements have no properties' }], answer: 0, explanation: { zh: '科学分类依赖多条证据；反例能提醒我们不要把“通常”误当成“永远”。', en: 'Scientific classification uses multiple lines of evidence; exceptions stop us mistaking “usually” for “always.”' } },
    ],
  },
] satisfies Lesson[];
