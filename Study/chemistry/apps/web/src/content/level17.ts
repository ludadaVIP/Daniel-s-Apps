import type { Lesson } from './lessons';

export const level17Lessons: Lesson[] = [
  {
    id: 'carbon-the-connection-builder',
    levelId: 'organic',
    order: 61,
    title: {
      zh: '碳：四个连接位，搭出无数分子',
      en: 'Carbon: four connections, countless molecules',
    },
    eyebrow: {
      zh: '第 61 课 · 从甲烷到塑料的搭建规则',
      en: 'Lesson 61 · The building rule from methane to plastics',
    },
    hook: {
      zh: '食物的香味、蜡烛的燃料、衣服里的纤维和手机壳里的塑料，看上去毫无关系；为什么化学家常把它们放进同一张“有机化学”地图？',
      en: 'Food aromas, candle fuel, clothing fibres and a phone case look unrelated. Why do chemists often place them on one map called organic chemistry?',
    },
    hookHint: {
      zh: '核心线索是碳。一个碳原子通常能形成四个共价键，既能连氢，也能彼此连接成链、分支和环。骨架稍有不同，分子性质就可能很不同。',
      en: 'The key clue is carbon. One carbon atom can usually form four covalent bonds, connecting to hydrogen and to other carbon atoms in chains, branches and rings. A small change in the skeleton can greatly change properties.',
    },
    bigIdea: {
      zh: '碳能形成四个共价键，并能与自己反复连接；这种“可延伸的骨架”让有机分子拥有巨大多样性。结构会影响燃烧、气味、溶解性和材料性质。',
      en: 'Carbon can form four covalent bonds and repeatedly connect with itself. This extendable skeleton gives organic molecules huge diversity. Structure influences burning, smell, solubility and material properties.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🍌',
        title: {
          zh: '食物香味来自分子结构',
          en: 'Food aromas come from molecular structure',
        },
        body: {
          zh: '许多香味物质是含碳分子。鼻子并不是在闻“碳”本身，而是在感受特定分子形状与相互作用带来的信号。',
          en: 'Many aroma molecules contain carbon. Your nose is not smelling “carbon itself”; it detects signals from particular molecular shapes and interactions.',
        },
      },
      {
        icon: '🕯️',
        title: {
          zh: '燃料里的碳氢骨架',
          en: 'Carbon–hydrogen skeletons in fuels',
        },
        body: {
          zh: '天然气、汽油和蜡含有不同大小的含碳分子。燃烧会释放能量，也会产生排放；燃料选择与环境影响需要一起考虑。',
          en: 'Natural gas, petrol and wax contain carbon molecules of different sizes. Burning releases energy and creates emissions, so fuel choices must be considered with environmental impact.',
        },
      },
      {
        icon: '♻️',
        title: {
          zh: '塑料是长链分子的材料',
          en: 'Plastics are materials of long-chain molecules',
        },
        body: {
          zh: '很多塑料由重复的小单元连接成长链。它们轻、耐用又方便，但也带来回收和污染挑战；了解结构有助于理解材料的取舍。',
          en: 'Many plastics are long chains built from repeating units. They are light, durable and useful, yet create recycling and pollution challenges; structure helps explain these trade-offs.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '碳的“四个握手位”', en: 'Carbon’s four handshake slots' },
        body: {
          zh: '中性碳原子的最外层有四个可用于共享的电子位置，因此常形成四个共价键。甲烷 CH₄ 中，一个碳恰好与四个氢共享电子。',
          en: 'A neutral carbon atom has four outer-electron positions available for sharing, so it commonly forms four covalent bonds. In methane, CH₄, one carbon shares electrons with four hydrogens.',
        },
      },
      {
        title: {
          zh: '碳还能牵着碳继续搭',
          en: 'Carbon can hold carbon and keep building',
        },
        body: {
          zh: '两个碳可以共用一个或多个键，再由剩余连接位接上氢或其他原子。这样可形成乙烷、长链、支链和环；不需要把每种都背下来，先看骨架怎么连。',
          en: 'Two carbon atoms can share one or more bonds, then use their remaining connections for hydrogen or other atoms. This makes ethane, long chains, branches and rings; do not memorise every case—first inspect the skeleton connection.',
        },
      },
      {
        title: {
          zh: '同样的原子，连法不同也会不同',
          en: 'Same atoms, different connections can differ',
        },
        body: {
          zh: '分子的原子种类和数量相同，不保证性质相同；连接方式和三维排列也重要。有机化学像搭积木，但每一块怎样接都会改变成品。',
          en: 'Having the same atom types and counts does not guarantee the same properties; connection pattern and 3D arrangement matter too. Organic chemistry is like building blocks, but how each block joins changes the result.',
        },
      },
    ],
    misconception: {
      zh: '“有机物就是天然、一定安全”不对。有机只是在化学分类中常指含碳化合物的一大类；天然物也可能有毒，人工合成物也可能有用和安全。安全性取决于具体物质、剂量和使用方式。',
      en: '“Organic means natural and automatically safe” is wrong. In chemistry, organic usually names a broad class of carbon compounds; natural substances can be toxic, and synthetic ones can be useful and safe. Safety depends on the specific substance, dose and use.',
    },
    mission: {
      zh: '碳侦探：找三个生活物品的标签或成分表，分别可能属于食物、清洁品或塑料。标出你认识的含碳线索，如 sugar、oil、poly- 或 plastic；不要据此判断安全性，只练习发现碳化学在身边。',
      en: 'Carbon detective: find labels or ingredient lists from three everyday items—perhaps food, a cleaning product or plastic. Mark carbon clues you recognise, such as sugar, oil, poly- or plastic; do not use this to judge safety, only to notice carbon chemistry nearby.',
    },
    vocabulary: [
      { en: 'organic chemistry', zh: '有机化学' },
      { en: 'covalent bond', zh: '共价键' },
      { en: 'carbon skeleton', zh: '碳骨架' },
      { en: 'hydrocarbon', zh: '碳氢化合物' },
      { en: 'polymer', zh: '聚合物' },
    ],
    interactive: 'carbon-builder-lab',
    questions: [
      {
        id: 'organic-q1',
        prompt: {
          zh: '中性碳原子在许多简单分子中通常形成多少个共价键？',
          en: 'How many covalent bonds does a neutral carbon atom commonly form in many simple molecules?',
        },
        options: [
          { zh: '4 个', en: '4' },
          { zh: '1 个', en: '1' },
          { zh: '8 个', en: '8' },
        ],
        answer: 0,
        explanation: {
          zh: '碳常有四个连接位可以共享电子，因此能形成四个共价键，例如 CH₄。',
          en: 'Carbon commonly has four connection positions for sharing electrons, so it can form four covalent bonds, as in CH₄.',
        },
      },
      {
        id: 'organic-q2',
        prompt: {
          zh: '为什么碳能形成如此多样的分子骨架？',
          en: 'Why can carbon form such a diverse range of molecular skeletons?',
        },
        options: [
          {
            zh: '它能与自身反复连接，并保留其他连接位',
            en: 'It can repeatedly connect to itself while keeping other connections',
          },
          { zh: '它从不与氢结合', en: 'It never bonds to hydrogen' },
          { zh: '它只存在于塑料中', en: 'It exists only in plastic' },
        ],
        answer: 0,
        explanation: {
          zh: '碳—碳键可延伸成链、分支和环，剩余键位还能连氢、氧等原子，因此组合极多。',
          en: 'Carbon–carbon bonds extend into chains, branches and rings, while remaining bonds can attach hydrogen, oxygen and more, creating many combinations.',
        },
      },
      {
        id: 'organic-q3',
        prompt: {
          zh: '“有机”一词最可靠地告诉你什么？',
          en: 'What does “organic” most reliably tell you?',
        },
        options: [
          {
            zh: '它属于常以含碳化合物为核心的一类化学物质',
            en: 'It belongs to a class of chemistry centred on carbon compounds',
          },
          {
            zh: '它一定天然且无毒',
            en: 'It is certainly natural and non-toxic',
          },
          { zh: '它一定可以食用', en: 'It is certainly edible' },
        ],
        answer: 0,
        explanation: {
          zh: '有机是化学分类线索，不是安全、天然或可食用的保证。判断安全要看具体物质和使用情境。',
          en: 'Organic is a chemistry classification clue, not a guarantee of safety, natural origin or edibility. Safety depends on the specific substance and context.',
        },
      },
      {
        id: 'organic-q4',
        prompt: {
          zh: '原子种类和数目相同的两个分子，性质一定相同吗？',
          en: 'Must two molecules with the same atom types and counts have the same properties?',
        },
        options: [
          {
            zh: '不一定，连接方式和三维排列也重要',
            en: 'Not necessarily; connection pattern and 3D arrangement also matter',
          },
          { zh: '一定相同', en: 'They must be identical' },
          {
            zh: '只要有碳就没有性质',
            en: 'With carbon they have no properties',
          },
        ],
        answer: 0,
        explanation: {
          zh: '结构影响分子怎样相互作用，因此同样的原子“积木”用不同方式连接，可能呈现不同性质。',
          en: 'Structure affects how molecules interact, so the same atomic “blocks” connected differently can have different properties.',
        },
      },
    ],
  },
  {
    id: 'fuel-burning-needs-oxygen',
    levelId: 'organic',
    order: 62,
    title: {
      zh: '燃烧：氧气够不够，产物会不同',
      en: 'Burning: oxygen changes the products',
    },
    eyebrow: {
      zh: '第 62 课 · 看懂火焰背后的粒子账本',
      en: 'Lesson 62 · Read the particle ledger behind a flame',
    },
    hook: {
      zh: '一根蜡烛在空气中明亮燃烧，为什么放进缺氧空间时，火焰会变黄、变暗，玻璃上还可能留下黑色痕迹？这不是“火变脏了”，而是原子正在走不同的化学路线。',
      en: 'Why can a candle burn brightly in air, yet turn yellow, dim, and leave black marks in an oxygen-poor space? The flame is not simply “dirty”; its atoms are taking a different chemical route.',
    },
    hookHint: {
      zh: '燃烧是燃料与氧气的快速反应。氧气充足时，碳和氢更容易完全变成二氧化碳和水；氧气不足时，可能出现一氧化碳或碳颗粒（烟炱）。',
      en: 'Burning is a fast reaction between fuel and oxygen. With enough oxygen, carbon and hydrogen more completely become carbon dioxide and water; with too little, carbon monoxide or carbon particles (soot) can form.',
    },
    bigIdea: {
      zh: '燃烧不是只有“着火/不着火”两种结果。氧气供应会改变产物；完全燃烧和不完全燃烧的差别，连着能量、空气质量和安全。',
      en: 'Burning is not just “on or off.” Oxygen supply changes the products; complete and incomplete combustion connect to energy, air quality and safety.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🕯️',
        title: { zh: '蜡烛的黑色痕迹', en: 'Black marks from a candle' },
        body: {
          zh: '火焰上方若出现黑色沉积，常是细小碳颗粒。它提示局部氧气供应可能不足，但不是让你去用容器盖住火焰做实验的邀请。',
          en: 'A black deposit above a flame can be tiny carbon particles. It suggests locally limited oxygen; it is not an invitation to cover a flame with containers and experiment.',
        },
      },
      {
        icon: '🏠',
        title: {
          zh: '家用燃气设备要通风与维护',
          en: 'Fuel appliances need ventilation and maintenance',
        },
        body: {
          zh: '燃气设备应按说明使用并由合格人员维护。一氧化碳无色无味，不能靠“闻起来正常”判断安全；住宅应遵循当地的一氧化碳报警器建议。',
          en: 'Fuel appliances should be used as instructed and maintained by qualified people. Carbon monoxide is colourless and odourless, so normal smell is not a safety test; homes should follow local carbon-monoxide alarm guidance.',
        },
      },
      {
        icon: '🌍',
        title: {
          zh: '燃料选择也有环境账本',
          en: 'Fuel choices have an environmental ledger',
        },
        body: {
          zh: '完全燃烧仍会产生二氧化碳。化学能让我们看清：比较燃料不能只问“火有多旺”，还要问效率、排放和替代方案。',
          en: 'Even complete combustion produces carbon dioxide. Chemistry helps us ask more than “how strong is the flame?”—we also compare efficiency, emissions and alternatives.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先认出燃料和氧气', en: 'First identify fuel and oxygen' },
        body: {
          zh: '许多常见燃料是碳氢化合物，只含碳和氢。燃烧时，氧气不是背景角色，而是反应物；没有足够氧气，原子就无法都走向同一组产物。',
          en: 'Many common fuels are hydrocarbons, made only of carbon and hydrogen. In burning, oxygen is a reactant, not background; without enough of it, atoms cannot all reach the same products.',
        },
      },
      {
        title: {
          zh: '氧气充足：完成原子账本',
          en: 'Enough oxygen: complete the atom ledger',
        },
        body: {
          zh: '以甲烷为例：CH₄ + 2O₂ → CO₂ + 2H₂O。左边的 1 个碳、4 个氢、4 个氧，在右边仍一个不少；只是重新组合成了二氧化碳和水，并释放能量。',
          en: 'For methane: CH₄ + 2O₂ → CO₂ + 2H₂O. The one carbon, four hydrogens and four oxygens are all still present on the right; they have rearranged into carbon dioxide and water while releasing energy.',
        },
      },
      {
        title: {
          zh: '氧气不足：不是所有碳都“走到底”',
          en: 'Too little oxygen: not all carbon reaches the end',
        },
        body: {
          zh: '氧气不足时，燃烧可能不完全，形成一氧化碳和/或碳颗粒（烟炱），同时也会有水。真实火焰很复杂，产物可混合；关键判断是：氧气供应改变了反应路线。',
          en: 'With too little oxygen, burning can be incomplete, forming carbon monoxide and/or carbon particles (soot), as well as water. Real flames are complex and products can mix; the key judgement is that oxygen supply changes the reaction route.',
        },
      },
    ],
    misconception: {
      zh: '“黄色火焰一定更热，黑烟只是难看”不对。火焰颜色受多种因素影响；烟炱意味着有碳颗粒，一氧化碳更看不见也更危险。不要用颜色或气味判断家中燃气设备是否安全。',
      en: '“A yellow flame is always hotter, and soot is only ugly” is wrong. Flame colour has several causes; soot means carbon particles, while carbon monoxide is less visible and more dangerous. Never use colour or smell to judge whether a home fuel appliance is safe.',
    },
    mission: {
      zh: '能源侦探：选一个你见过的“燃料→用途”组合，例如公交车、家里热水或露营炉。只查公开标签或可靠资料，不操作设备；写下它需要氧气、会产生什么主要产物，以及一个安全或环境问题。',
      en: 'Energy detective: choose a fuel-to-use pair you have seen, such as a bus, home hot water or a camping stove. Use only public labels or reliable information—do not operate equipment. Note that it needs oxygen, its main products, and one safety or environmental question.',
    },
    vocabulary: [
      { en: 'combustion', zh: '燃烧' },
      { en: 'complete combustion', zh: '完全燃烧' },
      { en: 'incomplete combustion', zh: '不完全燃烧' },
      { en: 'carbon monoxide', zh: '一氧化碳' },
      { en: 'soot', zh: '烟炱（碳颗粒）' },
    ],
    interactive: 'combustion-route-lab',
    questions: [
      {
        id: 'combustion-q1',
        prompt: {
          zh: '甲烷完全燃烧时，主要生成哪两种物质？',
          en: 'What two substances are the main products of complete methane combustion?',
        },
        options: [
          { zh: '二氧化碳和水', en: 'Carbon dioxide and water' },
          { zh: '氧气和氢气', en: 'Oxygen and hydrogen' },
          { zh: '只有碳颗粒', en: 'Only carbon particles' },
        ],
        answer: 0,
        explanation: {
          zh: '氧气充足时，甲烷中的碳和氢重新组合，主要形成 CO₂ 和 H₂O。',
          en: 'With enough oxygen, carbon and hydrogen from methane rearrange mainly into CO₂ and H₂O.',
        },
      },
      {
        id: 'combustion-q2',
        prompt: {
          zh: '氧气不足时，为什么不能只把产物写成二氧化碳和水？',
          en: 'Why can’t we write only carbon dioxide and water when oxygen is limited?',
        },
        options: [
          {
            zh: '部分碳可能形成一氧化碳或碳颗粒，燃烧变得不完全',
            en: 'Some carbon can form carbon monoxide or particles, so burning is incomplete',
          },
          { zh: '原子会在反应中消失', en: 'Atoms disappear in the reaction' },
          { zh: '氧气会变成燃料', en: 'Oxygen turns into fuel' },
        ],
        answer: 0,
        explanation: {
          zh: '原子不会消失；缺少氧气会让部分碳走向 CO 或烟炱等不同产物。',
          en: 'Atoms do not disappear; limited oxygen sends some carbon toward different products such as CO or soot.',
        },
      },
      {
        id: 'combustion-q3',
        prompt: {
          zh: '关于家用燃气设备，哪种做法最可靠？',
          en: 'Which practice is most reliable for home fuel appliances?',
        },
        options: [
          {
            zh: '按说明通风，并由合格人员维护；按当地建议安装一氧化碳报警器',
            en: 'Use ventilation as instructed, have qualified maintenance, and follow local CO-alarm guidance',
          },
          { zh: '闻起来没有味道就说明安全', en: 'No smell means it is safe' },
          {
            zh: '用火焰颜色自己判断是否需要修理',
            en: 'Judge servicing needs by flame colour yourself',
          },
        ],
        answer: 0,
        explanation: {
          zh: '一氧化碳无色无味，不能凭感觉判断。设备安全应依靠说明、合格维护和当地安全建议。',
          en: 'Carbon monoxide is colourless and odourless, so it cannot be judged by feeling. Appliance safety relies on instructions, qualified maintenance and local safety guidance.',
        },
      },
      {
        id: 'combustion-q4',
        prompt: {
          zh: '方程式 CH₄ + 2O₂ → CO₂ + 2H₂O 为什么体现质量守恒？',
          en: 'Why does CH₄ + 2O₂ → CO₂ + 2H₂O show conservation of mass?',
        },
        options: [
          {
            zh: '两边都有 1 个 C、4 个 H 和 4 个 O 原子',
            en: 'Both sides have 1 C, 4 H and 4 O atoms',
          },
          {
            zh: '右边原子更多，因为产生了能量',
            en: 'The right has more atoms because energy is produced',
          },
          {
            zh: '燃烧会让氧原子消失',
            en: 'Burning makes oxygen atoms disappear',
          },
        ],
        answer: 0,
        explanation: {
          zh: '化学反应改变原子的连接方式，不创造也不消灭原子；逐种数原子即可核对。',
          en: 'Chemical reactions change atomic connections, not create or destroy atoms; count each kind to check.',
        },
      },
    ],
  },
  {
    id: 'functional-groups-molecular-postcards',
    levelId: 'organic',
    order: 63,
    title: {
      zh: '官能团：分子身上的“功能贴纸”',
      en: 'Functional groups: a molecule’s feature labels',
    },
    eyebrow: {
      zh: '第 63 课 · 从骨架猜出一些性质',
      en: 'Lesson 63 · Predict some properties from a skeleton',
    },
    hook: {
      zh: '乙烷、乙醇和乙酸的名字只差一点，为什么一个是气体，一个能和水相混，一个有明显酸性？化学家不会只盯着整条碳链，而会先找分子里最“爱出主意”的一小段。',
      en: 'Ethane, ethanol and ethanoic acid have similar-sounding names. Why is one a gas, one mixes with water, and one has acidic behaviour? Chemists first look for the small part that does the most “decision-making.”',
    },
    hookHint: {
      zh: '那一小段叫官能团。它像分子上的功能贴纸：碳骨架决定大小和形状，官能团常显著影响与水的相处方式、气味和反应倾向。',
      en: 'That small part is a functional group. Think of it as a molecule’s feature label: the carbon skeleton shapes size and form, while a functional group often strongly affects water interactions, smell and reaction tendencies.',
    },
    bigIdea: {
      zh: '观察有机分子时，先看碳骨架，再圈出官能团。相同或相近的官能团常带来相似的化学行为，但完整结构和用量仍然重要。',
      en: 'When reading an organic molecule, first see the carbon skeleton, then circle the functional group. Similar groups often bring similar chemical behaviour, but the full structure and amount still matter.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🧴',
        title: {
          zh: '标签上的 alcohol 不是“都一样”',
          en: '“Alcohol” on a label is not one thing',
        },
        body: {
          zh: '乙醇含有 —OH（羟基），所以能与水很好地混合；但“含 alcohol”不能替代阅读完整标签，更不能说明能否饮用或怎样使用。',
          en: 'Ethanol contains —OH (a hydroxyl group), so it mixes well with water. But “contains alcohol” never replaces reading the full label or tells you how to use it.',
        },
      },
      {
        icon: '🥗',
        title: {
          zh: '食醋的酸味有结构线索',
          en: 'Vinegar acidity has a structure clue',
        },
        body: {
          zh: '食醋中的乙酸带有 —COOH（羧基）。它帮助解释酸性，但家中酸性液体的浓度和配方不同，不能随意拿来混合或实验。',
          en: 'Ethanoic acid in vinegar contains —COOH (a carboxyl group). It helps explain acidity, but household acidic liquids differ in concentration and recipe and are not for casual mixing.',
        },
      },
      {
        icon: '🍐',
        title: {
          zh: '有些香味分子有酯基',
          en: 'Some aroma molecules contain ester groups',
        },
        body: {
          zh: '许多酯类分子带有 —COO— 结构，一些会有水果般气味。气味是分子与鼻子受体互动的结果，不是“闻起来甜就能吃”。',
          en: 'Many ester molecules contain a —COO— pattern, and some have fruit-like odours. Smell comes from molecules interacting with nose receptors, not proof that something is edible.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先读骨架，再找特别的一段',
          en: 'Read the skeleton, then spot the special part',
        },
        body: {
          zh: '碳和氢组成的链是骨架。若看到氧、氮、卤素等出现在特定排列中，常值得圈出来：它们可能就是影响性质的官能团。',
          en: 'A carbon-and-hydrogen chain is the skeleton. When oxygen, nitrogen or halogens appear in particular patterns, circle them: they may be functional groups that affect properties.',
        },
      },
      {
        title: {
          zh: '—OH：和水互动更明显',
          en: '—OH: stronger interaction with water',
        },
        body: {
          zh: '乙醇 C₂H₅OH 的 —OH 部分能与水分子形成较强相互作用，所以乙醇和水能互相混合。并非所有带氧分子都同样易溶，碳链大小也会影响结果。',
          en: 'The —OH part of ethanol, C₂H₅OH, interacts strongly with water molecules, so ethanol and water can mix. Not every oxygen-containing molecule behaves equally; carbon-chain size matters too.',
        },
      },
      {
        title: { zh: '—COOH：给出酸性线索', en: '—COOH: an acidity clue' },
        body: {
          zh: '乙酸 CH₃COOH 的 —COOH 是羧基。它能让分子表现酸性；这是一条结构线索，不是让你凭结构自行判断任何产品安全性的通行证。',
          en: 'The —COOH in ethanoic acid, CH₃COOH, is a carboxyl group. It can give the molecule acidic behaviour; this is a structure clue, not a safety judgement for products.',
        },
      },
    ],
    misconception: {
      zh: '“只要有同一个官能团，所有性质就完全一样”不对。官能团很重要，但分子大小、碳链形状、浓度和环境也会一起影响性质。它是预测的起点，不是万能答案。',
      en: '“The same functional group makes every property identical” is wrong. Functional groups matter, but molecular size, carbon-chain shape, concentration and environment also affect properties. They are a starting point for prediction, not an all-purpose answer.',
    },
    mission: {
      zh: '标签翻译员：从食品或日用品包装上找一个成分名称（不打开、不混合）。查可靠资料后，用一句话说明它可能属于哪类分子或含有什么元素；再写一句“这不足以告诉我的事”，例如浓度或安全用法。',
      en: 'Label translator: find one ingredient name on a food or household-product package (do not open or mix it). After checking a reliable source, write one sentence about its molecule class or elements, then one thing this does not tell you, such as concentration or safe use.',
    },
    vocabulary: [
      { en: 'functional group', zh: '官能团' },
      { en: 'hydroxyl group', zh: '羟基（—OH）' },
      { en: 'carboxyl group', zh: '羧基（—COOH）' },
      { en: 'ester group', zh: '酯基（—COO—）' },
      { en: 'solubility', zh: '溶解性' },
    ],
    interactive: 'functional-group-lab',
    questions: [
      {
        id: 'functional-q1',
        prompt: {
          zh: '读一个有机分子时，官能团最像什么？',
          en: 'When reading an organic molecule, what is a functional group most like?',
        },
        options: [
          {
            zh: '一段能强烈影响性质与反应倾向的特定原子排列',
            en: 'A specific atom pattern that strongly affects properties and reaction tendencies',
          },
          { zh: '分子中所有的碳原子', en: 'Every carbon atom in the molecule' },
          { zh: '只表示分子颜色的符号', en: 'A symbol only for colour' },
        ],
        answer: 0,
        explanation: {
          zh: '官能团是有辨识度的局部原子排列，常让分子表现出特定的化学行为。',
          en: 'A functional group is a recognisable local atom pattern that often gives a molecule particular chemical behaviour.',
        },
      },
      {
        id: 'functional-q2',
        prompt: {
          zh: '乙醇 C₂H₅OH 中，哪一段是羟基？',
          en: 'Which part of ethanol, C₂H₅OH, is the hydroxyl group?',
        },
        options: [
          { zh: '—OH', en: '—OH' },
          { zh: 'C₂', en: 'C₂' },
          { zh: '所有 H 原子加起来', en: 'All H atoms together' },
        ],
        answer: 0,
        explanation: {
          zh: '羟基写作 —OH；它是乙醇能与水很好互动的重要原因之一。',
          en: 'A hydroxyl group is written —OH; it is one important reason ethanol interacts well with water.',
        },
      },
      {
        id: 'functional-q3',
        prompt: {
          zh: '下列哪句话最准确？',
          en: 'Which statement is most accurate?',
        },
        options: [
          {
            zh: '官能团能提供性质线索，但完整结构和浓度也重要',
            en: 'Functional groups give property clues, but full structure and concentration also matter',
          },
          {
            zh: '看到 —COOH 就能判断产品绝对安全',
            en: 'Seeing —COOH proves a product is absolutely safe',
          },
          {
            zh: '只要分子含氧，就一定与水完全混合',
            en: 'Any molecule with oxygen must fully mix with water',
          },
        ],
        answer: 0,
        explanation: {
          zh: '官能团帮助预测，但不是全部证据；分子其他部分和实际条件也会改变表现。',
          en: 'Functional groups help prediction but are not all the evidence; the rest of the molecule and real conditions also change behaviour.',
        },
      },
      {
        id: 'functional-q4',
        prompt: {
          zh: '乙酸 CH₃COOH 的酸性线索是哪一个官能团？',
          en: 'Which functional group is the acidity clue in ethanoic acid, CH₃COOH?',
        },
        options: [
          { zh: '羧基 —COOH', en: 'Carboxyl group —COOH' },
          {
            zh: '羟基 —OH（作为乙醇中的官能团）',
            en: 'Hydroxyl group —OH as in ethanol',
          },
          { zh: '没有官能团', en: 'No functional group' },
        ],
        answer: 0,
        explanation: {
          zh: '乙酸中的 —COOH 是羧基，它给出酸性行为的结构线索。',
          en: 'The —COOH in ethanoic acid is a carboxyl group, a structural clue for acidic behaviour.',
        },
      },
    ],
  },
  {
    id: 'polymers-from-repeating-links',
    levelId: 'organic',
    order: 64,
    title: {
      zh: '聚合物：小积木连成一条材料长链',
      en: 'Polymers: small units become a material chain',
    },
    eyebrow: {
      zh: '第 64 课 · 看见塑料、纤维和橡胶的共同结构',
      en: 'Lesson 64 · Find a shared structure in plastics, fibres and rubber',
    },
    hook: {
      zh: '一个饮料瓶、运动衣、橡皮筋摸起来差别很大，为什么化学家会把它们放进“聚合物”这个词里？秘密不在于它们看起来像不像，而在于很多小单元怎样反复接成长链。',
      en: 'A bottle, sports shirt and rubber band feel very different. Why do chemists place them under “polymers”? The secret is not how alike they look, but how many small units connect again and again into long chains.',
    },
    hookHint: {
      zh: '重复小单元叫单体，连接起来的长分子叫聚合物。链的长度、分支、彼此缠绕和连接方式，会让材料呈现柔软、坚硬、拉伸或防水等不同表现。',
      en: 'A repeating small unit is a monomer; the long connected molecule is a polymer. Chain length, branching, tangling and linking help materials become soft, stiff, stretchy or water-resistant.',
    },
    bigIdea: {
      zh: '聚合物的性质来自“许多单元怎样连在一起”，而不只是来自单个单元。材料选择也要同时考虑用途、耐用性、重复使用和回收条件。',
      en: 'A polymer’s properties come from how many units are connected, not only from one unit. Material choices also consider use, durability, reuse and recycling conditions.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🥤',
        title: {
          zh: '瓶子：轻不等于没有代价',
          en: 'Bottles: light does not mean consequence-free',
        },
        body: {
          zh: '塑料瓶轻、耐摔、运输方便；但如果一次使用后随意丢弃，长久耐用反而会成为环境难题。材料优点要和使用方式一起看。',
          en: 'Plastic bottles are light, tough and easy to transport. If discarded after one use, that same long-lasting quality becomes an environmental problem. Judge a material together with how it is used.',
        },
      },
      {
        icon: '👕',
        title: {
          zh: '纤维：链能排成不同形状',
          en: 'Fibres: chains can line up differently',
        },
        body: {
          zh: '某些聚合物链能拉成细纤维；链之间的作用和排列会影响衣物的强度、弹性与吸水性。不是每种纤维都有同一种“最好”的用途。',
          en: 'Some polymer chains can be drawn into fine fibres. Forces and alignment between chains affect strength, stretch and water behaviour. No fibre is best for every use.',
        },
      },
      {
        icon: '♻️',
        title: {
          zh: '回收：先分清材料与规则',
          en: 'Recycling: identify material and local rules first',
        },
        body: {
          zh: '回收是否可行取决于材料种类、清洁程度和当地设施。回收标志不是“随便丢进同一个桶”的魔法；优先减少不必要使用和重复使用也很重要。',
          en: 'Whether recycling works depends on material type, cleanliness and local facilities. A recycling symbol is not magic permission to put everything in one bin; reducing unnecessary use and reusing matter too.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '单体：可重复的小单元',
          en: 'Monomers: repeatable small units',
        },
        body: {
          zh: '把一个单体想成带连接扣的小积木。它不是“塑料小颗粒”的同义词，而是一种能在反应中与许多同类或其他单元连接的分子。',
          en: 'Think of a monomer as a small building block with connection clips. It is not simply another word for a plastic pellet; it is a molecule that can react and connect with many similar or other units.',
        },
      },
      {
        title: {
          zh: '聚合物：重复但不单调的长链',
          en: 'Polymers: repeating yet varied long chains',
        },
        body: {
          zh: '很多单体接成长链，就形成聚合物。链可以很长、可以弯曲、可以有分支，也可能彼此缠绕；这些结构变化会改变材料在拉扯、加热或接触水时的表现。',
          en: 'Many monomers connected into a long chain make a polymer. Chains can be long, bendable, branched or tangled; these variations change how a material responds to stretching, heating or water.',
        },
      },
      {
        title: {
          zh: '材料选择是一道多因素题',
          en: 'Choosing materials is a multi-factor question',
        },
        body: {
          zh: '“塑料好还是不好”问得太粗。更好的问题是：它在这里解决了什么？能否多次使用？寿命结束后本地怎样处理？有没有更合适的替代方案？',
          en: '“Is plastic good or bad?” is too broad. Better questions are: what problem does it solve here, can it be reused, how is it handled locally at end of life, and is another material better for this use?',
        },
      },
    ],
    misconception: {
      zh: '“所有塑料都能以同样方式回收”不对。聚合物种类、添加物、颜色、污染程度和当地回收系统都会影响结果。标志是分类线索，实际处理请遵循当地规则。',
      en: '“All plastics can be recycled in the same way” is wrong. Polymer type, additives, colour, contamination and local systems all affect outcomes. A symbol is a classification clue; follow local handling rules.',
    },
    mission: {
      zh: '材料侦探：选择家里一个可重复使用的物品，例如水瓶、午餐盒或衣物。描述它需要具备的一种性质（轻、韧、弹、耐水等），再想出一个能让它使用更久的做法；不需要拆开或加热它。',
      en: 'Material detective: choose one reusable item at home, such as a bottle, lunch box or clothing. Describe one property it needs—lightness, toughness, stretch or water resistance—then one way to help it last longer. Do not take it apart or heat it.',
    },
    vocabulary: [
      { en: 'monomer', zh: '单体' },
      { en: 'polymer', zh: '聚合物' },
      { en: 'repeating unit', zh: '重复单元' },
      { en: 'material property', zh: '材料性质' },
      { en: 'reuse', zh: '重复使用' },
    ],
    interactive: 'polymer-chain-lab',
    questions: [
      {
        id: 'polymer-q1',
        prompt: {
          zh: '单体和聚合物的关系最像什么？',
          en: 'What is the best analogy for monomers and a polymer?',
        },
        options: [
          {
            zh: '许多可连接的小积木接成长链',
            en: 'Many connectable small blocks joining into a long chain',
          },
          {
            zh: '一块积木切成更小碎片',
            en: 'One block being cut into smaller pieces',
          },
          {
            zh: '同一种材料永远不改变形状',
            en: 'One material that can never change shape',
          },
        ],
        answer: 0,
        explanation: {
          zh: '单体能连接，许多重复单元组成长分子聚合物。',
          en: 'Monomers can connect; many repeating units make a long polymer molecule.',
        },
      },
      {
        id: 'polymer-q2',
        prompt: {
          zh: '为什么两种聚合物材料可能摸起来很不同？',
          en: 'Why can two polymer materials feel very different?',
        },
        options: [
          {
            zh: '链长、分支、缠绕和连接方式都可能不同',
            en: 'Their chain length, branching, tangling and linking can differ',
          },
          { zh: '聚合物都只能是硬的', en: 'All polymers can only be hard' },
          {
            zh: '聚合物没有分子结构',
            en: 'Polymers have no molecular structure',
          },
        ],
        answer: 0,
        explanation: {
          zh: '材料性质来自大量链怎样排列、移动和相互作用，而不是只看“是不是塑料”。',
          en: 'Material properties depend on how many chains arrange, move and interact, not simply on whether something is “plastic.”',
        },
      },
      {
        id: 'polymer-q3',
        prompt: {
          zh: '对一个用过的塑料物品，哪种判断最负责任？',
          en: 'What is the most responsible judgement for a used plastic item?',
        },
        options: [
          {
            zh: '先看材料和当地规则，再决定清洁、重复使用或回收方式',
            en: 'Check the material and local rules before deciding how to clean, reuse or recycle it',
          },
          {
            zh: '所有带回收标志的东西都放进同一个桶',
            en: 'Put anything with a recycling symbol into the same bin',
          },
          {
            zh: '材料耐用，所以随意丢弃没有关系',
            en: 'Because it is durable, careless disposal does not matter',
          },
        ],
        answer: 0,
        explanation: {
          zh: '真实回收取决于当地系统与物品状态；先分类和遵循规则，才更有机会让材料被妥善处理。',
          en: 'Real recycling depends on local systems and item condition; sorting and following rules first gives material a better chance of proper handling.',
        },
      },
      {
        id: 'polymer-q4',
        prompt: {
          zh: '下列哪句话最能概括聚合物材料选择？',
          en: 'Which statement best sums up choosing polymer materials?',
        },
        options: [
          {
            zh: '同时比较用途、性能、重复使用与寿命结束后的处理',
            en: 'Compare use, performance, reuse and end-of-life handling together',
          },
          {
            zh: '只要很便宜就是最佳材料',
            en: 'The cheapest material is always best',
          },
          {
            zh: '聚合物都应在所有用途里被禁止',
            en: 'Polymers should be banned from every use',
          },
        ],
        answer: 0,
        explanation: {
          zh: '化学帮助我们看见取舍：某种材料可在一个场景很合适，在另一个场景却未必。',
          en: 'Chemistry helps us see trade-offs: a material can be suitable in one situation but not another.',
        },
      },
    ],
  },
];
