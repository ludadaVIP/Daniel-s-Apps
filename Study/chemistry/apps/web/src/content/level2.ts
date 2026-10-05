import type { Lesson } from './lessons';

export const level2Lessons = [
  {
    id: 'pure-substances-and-mixtures',
    levelId: 'substances',
    order: 6,
    title: { zh: '纯净物与混合物', en: 'Pure substances and mixtures' },
    eyebrow: {
      zh: '第 6 课 · 一杯看似普通的水',
      en: 'Lesson 6 · A not-so-simple glass of water',
    },
    hook: {
      zh: '海水看起来清澈，为什么晒干后却留下一层盐？',
      en: 'Seawater looks clear, so why does it leave salt behind when it dries?',
    },
    hookHint: {
      zh: '“看起来只有一种”不等于“只含一种物质”。盐粒子均匀分散在水中，肉眼分不开，但它们仍然存在。',
      en: 'Looking like one material does not mean containing one substance. Salt particles are spread through the water, invisible but still present.',
    },
    bigIdea: {
      zh: '纯净物只有一种物质；混合物含有两种或更多物质，并可利用性质差异把它们分开。',
      en: 'A pure substance contains one substance; a mixture contains two or more, separable by differences in properties.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🌊',
        title: { zh: '海水', en: 'Seawater' },
        body: {
          zh: '水、盐和许多微量物质组成的混合物。',
          en: 'A mixture of water, salts and many trace substances.',
        },
      },
      {
        icon: '🥇',
        title: { zh: '24K 金', en: '24-carat gold' },
        body: {
          zh: '接近纯金；珠宝常混入其他金属增加硬度。',
          en: 'Nearly pure gold; jewellery often mixes in metals for strength.',
        },
      },
      {
        icon: '🌬️',
        title: { zh: '空气', en: 'Air' },
        body: {
          zh: '氮气、氧气等均匀混合，看起来仍像一种。',
          en: 'Nitrogen, oxygen and more mixed evenly, yet looking uniform.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先数“物质身份”', en: 'Count substance identities' },
        body: {
          zh: '蒸馏水中只有水这一种物质；糖水中同时有糖和水。是否均匀、是否透明，都不能单独决定它是不是混合物。',
          en: 'Distilled water contains only water; sugar solution contains sugar and water. Uniformity or transparency alone cannot decide whether something is a mixture.',
        },
      },
      {
        title: {
          zh: '混合没有制造新物质',
          en: 'Mixing does not create new substances',
        },
        body: {
          zh: '把铁粉和沙混在一起，铁仍会被磁铁吸引，沙仍不会。各成分保留自己的性质，比例也可以改变。',
          en: 'Mix iron filings with sand: iron remains magnetic and sand does not. Each component keeps its properties, and their proportions can vary.',
        },
      },
      {
        title: {
          zh: '分离方法要匹配性质差异',
          en: 'Match separation to a property difference',
        },
        body: {
          zh: '颗粒大小不同可过滤；沸点不同可蒸馏；溶解度不同可结晶；是否有磁性可用磁铁。没有一种方法能解决所有混合物。',
          en: 'Different particle sizes allow filtration; boiling points allow distillation; solubility allows crystallisation; magnetism allows magnetic separation. No method fits every mixture.',
        },
      },
    ],
    misconception: {
      zh: '“纯”在化学里不等于“天然、健康或安全”。纯净物是成分概念；纯氯气是纯净物，却有毒。',
      en: 'In chemistry, pure does not mean natural, healthy or safe. It describes composition; pure chlorine gas is pure but toxic.',
    },
    mission: {
      zh: '查看家中一瓶饮料的配料表：列出至少三种物质，再设计一种能取回水或糖的分离思路。不要自行加热密封容器。',
      en: 'Read a drink label, list at least three substances, then design a way to recover water or sugar. Never heat a sealed container.',
    },
    vocabulary: [
      { en: 'pure substance', zh: '纯净物' },
      { en: 'mixture', zh: '混合物' },
      { en: 'component', zh: '成分' },
      { en: 'separation', zh: '分离' },
    ],
    interactive: 'separation-lab',
    questions: [
      {
        id: 'mixture-q1',
        prompt: {
          zh: '一杯完全透明的盐水属于什么？',
          en: 'What is a completely clear salt solution?',
        },
        options: [
          {
            zh: '纯净物，因为看起来均匀',
            en: 'Pure, because it looks uniform',
          },
          {
            zh: '混合物，因为含有盐和水',
            en: 'A mixture, because it contains salt and water',
          },
          {
            zh: '元素，因为没有沉淀',
            en: 'An element, because there is no sediment',
          },
        ],
        answer: 1,
        explanation: {
          zh: '透明只说明盐分散得很均匀；两种物质仍然同时存在。',
          en: 'Clarity only shows that salt is evenly spread; two substances are still present.',
        },
      },
      {
        id: 'mixture-q2',
        prompt: {
          zh: '要从泥水中先除去不溶的泥沙，最合适的方法是什么？',
          en: 'What is the best first method to remove insoluble mud from water?',
        },
        options: [
          { zh: '过滤', en: 'Filtration' },
          { zh: '用磁铁', en: 'Using a magnet' },
          { zh: '熔化', en: 'Melting' },
        ],
        answer: 0,
        explanation: {
          zh: '滤纸孔允许水通过，却拦住较大的不溶泥沙颗粒。',
          en: 'Filter pores let water through while trapping larger insoluble mud particles.',
        },
      },
      {
        id: 'mixture-q3',
        prompt: {
          zh: '为什么可以用蒸馏从盐水中取得较纯的水？',
          en: 'Why can distillation recover purer water from salt solution?',
        },
        options: [
          { zh: '盐会被磁铁吸住', en: 'Salt is attracted to a magnet' },
          {
            zh: '水先汽化，再被冷凝收集',
            en: 'Water vaporises, then is condensed and collected',
          },
          {
            zh: '盐粒子会穿过滤纸',
            en: 'Salt particles pass through filter paper',
          },
        ],
        answer: 1,
        explanation: {
          zh: '利用挥发性和沸点差异，水进入蒸气后在另一处冷凝，盐留在原容器中。',
          en: 'A difference in volatility lets water become vapour and condense elsewhere while salt remains behind.',
        },
      },
    ],
  },
  {
    id: 'what-is-an-element',
    levelId: 'substances',
    order: 7,
    title: { zh: '什么是元素？', en: 'What is an element?' },
    eyebrow: {
      zh: '第 7 课 · 自然界的基础字母',
      en: 'Lesson 7 · Nature’s alphabet',
    },
    hook: {
      zh: '铅笔芯不是铅，钻石也不是玻璃——它们竟然都与碳元素有关？',
      en: 'Pencil “lead” is not lead, and diamond is not glass—yet both involve carbon?',
    },
    hookHint: {
      zh: '同一种元素的原子可以用不同方式排列，于是表现出完全不同的样子和性质。身份相同，结构可以不同。',
      en: 'Atoms of one element can be arranged differently, producing dramatically different appearances and properties. Same identity, different structure.',
    },
    bigIdea: {
      zh: '元素是只由一种原子组成的纯净物；每种元素都有独特名称和化学符号。',
      en: 'An element is a pure substance made from one kind of atom; each has a unique name and symbol.',
    },
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '✏️',
        title: { zh: '石墨中的碳', en: 'Carbon in graphite' },
        body: {
          zh: '碳原子层容易滑动，所以能留下笔迹。',
          en: 'Layers of carbon atoms slide, leaving a mark.',
        },
      },
      {
        icon: '🎈',
        title: { zh: '气球里的氦', en: 'Helium in balloons' },
        body: {
          zh: 'He 很轻且不易反应，适合填充气球。',
          en: 'He is light and unreactive, useful for balloons.',
        },
      },
      {
        icon: '🔌',
        title: { zh: '电线里的铜', en: 'Copper in wires' },
        body: {
          zh: 'Cu 容易导电，也能拉成细线。',
          en: 'Cu conducts electricity and can be drawn into wire.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '一种原子，一种元素', en: 'One atom type, one element' },
        body: {
          zh: '一块纯铜里只有铜原子。氧气通常由两个氧原子组成 O₂，但因为只有氧这一种原子，它仍然是元素，不是化合物。',
          en: 'Pure copper contains only copper atoms. Oxygen gas usually has pairs, O₂, but with only oxygen atoms it remains an element, not a compound.',
        },
      },
      {
        title: {
          zh: '符号是全球通用的速记',
          en: 'Symbols are global shorthand',
        },
        body: {
          zh: 'C 表示碳、O 表示氧、Fe 表示铁。首字母必须大写，若有第二个字母则小写，因此 Co 是钴，CO 则表示含碳和氧的物质。',
          en: 'C means carbon, O oxygen and Fe iron. The first letter is uppercase and a second is lowercase: Co is cobalt, while CO contains carbon and oxygen.',
        },
      },
      {
        title: {
          zh: '元素不能用化学方法再拆成更简单物质',
          en: 'Chemical methods cannot split an element into simpler substances',
        },
        body: {
          zh: '加热、通电或加入其他物质，可以改变元素的形态或让它参与反应，却不能把铜变成“更简单的铜成分”。',
          en: 'Heating, electricity or reactions may change an element’s form or combine it with others, but cannot split copper into simpler chemical substances.',
        },
      },
    ],
    misconception: {
      zh: '元素不是“一个原子”。元素是一类拥有相同身份的原子的总称，也可以指只含这种原子的纯净物。',
      en: 'An element is not “one atom”. It is a type of atom, and also a pure substance containing only that atom type.',
    },
    mission: {
      zh: '在食品标签或家用品上寻找三个元素符号，例如 Fe、Ca、Al。查清它们表示元素本身，还是某个化合物的一部分。',
      en: 'Find three element symbols such as Fe, Ca or Al on labels. Decide whether each names the element itself or part of a compound.',
    },
    vocabulary: [
      { en: 'element', zh: '元素' },
      { en: 'atom', zh: '原子' },
      { en: 'chemical symbol', zh: '化学符号' },
      { en: 'atom type', zh: '原子种类' },
    ],
    interactive: 'element-gallery',
    questions: [
      {
        id: 'element-q1',
        prompt: {
          zh: 'O₂ 只含氧原子，它属于什么？',
          en: 'O₂ contains only oxygen atoms. What is it?',
        },
        options: [
          { zh: '元素', en: 'An element' },
          { zh: '化合物', en: 'A compound' },
          { zh: '混合物', en: 'A mixture' },
        ],
        answer: 0,
        explanation: {
          zh: '判断元素看原子种类，不看一个粒子里有几个原子；O₂ 只有一种原子。',
          en: 'Element status depends on atom types, not atom count per particle; O₂ has only one type.',
        },
      },
      {
        id: 'element-q2',
        prompt: {
          zh: '下列哪一个元素符号书写正确？',
          en: 'Which element symbol is written correctly?',
        },
        options: [
          { zh: 'fe', en: 'fe' },
          { zh: 'FE', en: 'FE' },
          { zh: 'Fe', en: 'Fe' },
        ],
        answer: 2,
        explanation: {
          zh: '元素符号首字母大写，第二个字母小写；Fe 表示铁。',
          en: 'The first letter is uppercase and the second lowercase; Fe represents iron.',
        },
      },
      {
        id: 'element-q3',
        prompt: {
          zh: '石墨和钻石性质差别巨大，却都属于碳元素，原因是什么？',
          en: 'Graphite and diamond differ greatly yet are both carbon. Why?',
        },
        options: [
          {
            zh: '它们的碳原子排列方式不同',
            en: 'Their carbon atoms are arranged differently',
          },
          { zh: '钻石不含原子', en: 'Diamond contains no atoms' },
          { zh: '石墨是混合物', en: 'Graphite is a mixture' },
        ],
        answer: 0,
        explanation: {
          zh: '原子身份相同但连接和排列不同，会产生不同结构与宏观性质。',
          en: 'The atom identity is the same, but different bonding and arrangement produce different structures and properties.',
        },
      },
    ],
  },
  {
    id: 'what-is-a-compound',
    levelId: 'substances',
    order: 8,
    title: { zh: '什么是化合物？', en: 'What is a compound?' },
    eyebrow: {
      zh: '第 8 课 · 原子组合出的新世界',
      en: 'Lesson 8 · New worlds built from atoms',
    },
    hook: {
      zh: '钠遇水会猛烈反应，氯气有毒；为什么它们组成的氯化钠却能调味？',
      en: 'Sodium reacts violently with water and chlorine gas is toxic. Why can their compound season food?',
    },
    hookHint: {
      zh: '化合物不是把原有性质简单叠加。原子以固定方式化学结合后，形成了拥有全新性质的物质。',
      en: 'A compound is not a simple blend of old properties. Atoms chemically joined in fixed ways create a substance with new properties.',
    },
    bigIdea: {
      zh: '化合物是两种或更多元素以固定比例化学结合形成的纯净物。',
      en: 'A compound is a pure substance formed when two or more elements chemically join in fixed proportions.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '💧',
        title: { zh: '水 H₂O', en: 'Water H₂O' },
        body: {
          zh: '氢和氧按 2:1 的原子比例结合。',
          en: 'Hydrogen and oxygen join in a 2:1 atom ratio.',
        },
      },
      {
        icon: '🧂',
        title: { zh: '氯化钠 NaCl', en: 'Sodium chloride NaCl' },
        body: {
          zh: '钠和氯形成性质全新的食盐晶体。',
          en: 'Sodium and chlorine form salt crystals with new properties.',
        },
      },
      {
        icon: '🥤',
        title: { zh: '二氧化碳 CO₂', en: 'Carbon dioxide CO₂' },
        body: {
          zh: '每个粒子中碳与氧原子数之比为 1:2。',
          en: 'Each particle has carbon and oxygen atoms in a 1:2 ratio.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '必须包含不同元素',
          en: 'Different elements are required',
        },
        body: {
          zh: 'O₂ 有两个原子但只有氧元素，所以不是化合物；H₂O 同时含氢和氧，是化合物。数原子种类比数原子个数更关键。',
          en: 'O₂ has two atoms but only oxygen, so it is not a compound. H₂O contains hydrogen and oxygen, so it is. Count atom types, not just atoms.',
        },
      },
      {
        title: {
          zh: '比例固定，化学式像配方',
          en: 'Fixed ratios make a chemical recipe',
        },
        body: {
          zh: '水的每个粒子都是两个氢原子对应一个氧原子。若比例随意变化，它就是混合物，不是同一种纯净化合物。',
          en: 'Every water particle has two hydrogen atoms for one oxygen. If proportions vary freely, it is a mixture, not one pure compound.',
        },
      },
      {
        title: {
          zh: '只能通过化学变化拆分',
          en: 'Only chemical change can separate it',
        },
        body: {
          zh: '过滤无法把水分成氢和氧，因为原子已化学结合。电解水则能通过化学变化生成氢气和氧气。',
          en: 'Filtering cannot split water into hydrogen and oxygen because its atoms are chemically joined. Electrolysis can do so through chemical change.',
        },
      },
    ],
    misconception: {
      zh: '化合物不等于混合物。盐水中的盐与水只是混在一起，比例可变；纯水中的氢和氧化学结合，比例固定。',
      en: 'A compound is not a mixture. Salt and water merely mix in variable amounts; hydrogen and oxygen are chemically joined in pure water at a fixed ratio.',
    },
    mission: {
      zh: '在家中寻找含 H₂O、NaCl、CO₂ 或 CaCO₃ 的物品。用化学式圈出每种元素符号，并读出原子数比例。',
      en: 'Find products mentioning H₂O, NaCl, CO₂ or CaCO₃. Circle each element symbol and read the atom-number ratio.',
    },
    vocabulary: [
      { en: 'compound', zh: '化合物' },
      { en: 'chemical formula', zh: '化学式' },
      { en: 'fixed ratio', zh: '固定比例' },
      { en: 'chemically joined', zh: '化学结合' },
    ],
    interactive: 'compound-builder',
    questions: [
      {
        id: 'compound-q1',
        prompt: { zh: '下列哪一种是化合物？', en: 'Which one is a compound?' },
        options: [
          { zh: 'O₂', en: 'O₂' },
          { zh: 'H₂O', en: 'H₂O' },
          { zh: '一杯空气', en: 'A sample of air' },
        ],
        answer: 1,
        explanation: {
          zh: 'H₂O 含氢、氧两种元素，按固定比例化学结合。',
          en: 'H₂O contains hydrogen and oxygen chemically joined in a fixed proportion.',
        },
      },
      {
        id: 'compound-q2',
        prompt: {
          zh: '为什么水不能用过滤拆成氢和氧？',
          en: 'Why can filtration not split water into hydrogen and oxygen?',
        },
        options: [
          { zh: '它们已化学结合', en: 'They are chemically joined' },
          { zh: '水不是物质', en: 'Water is not matter' },
          { zh: '过滤只能在晚上进行', en: 'Filtration only works at night' },
        ],
        answer: 0,
        explanation: {
          zh: '过滤只按颗粒大小分开混合物，不能破坏化合物内部的化学结合。',
          en: 'Filtration separates mixture particles by size; it cannot break chemical bonds within a compound.',
        },
      },
      {
        id: 'compound-q3',
        prompt: {
          zh: '同一种纯净化合物中的元素比例有什么特点？',
          en: 'What is true of element proportions in one pure compound?',
        },
        options: [
          { zh: '可以任意改变', en: 'They can vary freely' },
          { zh: '总是固定', en: 'They are fixed' },
          { zh: '只在固体中固定', en: 'They are fixed only in solids' },
        ],
        answer: 1,
        explanation: {
          zh: '固定比例是化合物的重要特征，也是化学式能够表达组成的原因。',
          en: 'Fixed proportions are a defining feature and allow formulas to represent composition.',
        },
      },
    ],
  },
  {
    id: 'elements-vs-compounds',
    levelId: 'substances',
    order: 9,
    title: { zh: '元素与化合物', en: 'Elements vs compounds' },
    eyebrow: {
      zh: '第 9 课 · 粒子图里的身份线索',
      en: 'Lesson 9 · Identity clues in particle diagrams',
    },
    hook: {
      zh: '只看一张由圆点组成的粒子图，你能判断瓶中装的是元素、化合物还是混合物吗？',
      en: 'From a diagram of coloured circles alone, can you tell whether a bottle holds an element, compound or mixture?',
    },
    hookHint: {
      zh: '颜色代表原子种类，连在一起代表同一个粒子。先看有几种粒子，再看每种粒子含几种原子。',
      en: 'Colours represent atom types; joined circles form one particle. First count particle types, then atom types inside each.',
    },
    bigIdea: {
      zh: '一种粒子且只含一种原子是元素；一种粒子含不同原子是化合物；多种粒子同时存在是混合物。',
      en: 'One particle type with one atom type is an element; one particle type with different atoms is a compound; multiple particle types make a mixture.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🫁',
        title: { zh: '氧气 O₂', en: 'Oxygen O₂' },
        body: {
          zh: '粒子含两个相同原子：元素。',
          en: 'Particles contain two identical atoms: element.',
        },
      },
      {
        icon: '💧',
        title: { zh: '纯水 H₂O', en: 'Pure water H₂O' },
        body: {
          zh: '所有粒子相同且含两种原子：化合物。',
          en: 'Identical particles with two atom types: compound.',
        },
      },
      {
        icon: '🥛',
        title: { zh: '牛奶', en: 'Milk' },
        body: {
          zh: '水、脂肪、蛋白质等共同存在：混合物。',
          en: 'Water, fats, proteins and more together: mixture.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '第一问：有几种粒子？',
          en: 'Question one: how many particle types?',
        },
        body: {
          zh: '若图中所有粒子完全相同，它可能是纯净物；若出现不同粒子，就是混合物，无论它们分布得多均匀。',
          en: 'If every particle is identical, it may be pure. Different particles mean a mixture, however evenly they are spread.',
        },
      },
      {
        title: {
          zh: '第二问：一种粒子里有几种原子？',
          en: 'Question two: how many atom types per particle?',
        },
        body: {
          zh: '纯净物中若只有一种颜色，是元素；若每个粒子内稳定出现不同颜色，是化合物。',
          en: 'A pure sample with one colour is an element; identical particles containing different colours form a compound.',
        },
      },
      {
        title: {
          zh: '分类会告诉你怎样分离',
          en: 'Classification predicts separation',
        },
        body: {
          zh: '混合物可用物理方法分开；化合物必须通过化学变化拆分；元素不能用化学方法拆成更简单物质。',
          en: 'Mixtures separate physically; compounds require chemical change; elements cannot be chemically split into simpler substances.',
        },
      },
    ],
    misconception: {
      zh: '两种颜色挨在一起不一定是化合物。只有它们以固定组合连接成相同粒子时才是化合物；各自散开则是混合物。',
      en: 'Two colours near each other are not necessarily a compound. They must be joined in identical fixed groups; separate particles make a mixture.',
    },
    mission: {
      zh: '用两色纽扣或纸片画出四幅图：单原子元素、双原子元素、纯化合物、元素与化合物的混合物。请家人猜分类并说明理由。',
      en: 'Use two colours of buttons or paper to model a monatomic element, diatomic element, pure compound, and an element–compound mixture. Ask someone to classify and explain.',
    },
    vocabulary: [
      { en: 'particle diagram', zh: '粒子图' },
      { en: 'atom type', zh: '原子种类' },
      { en: 'pure sample', zh: '纯净样品' },
      { en: 'classification', zh: '分类' },
    ],
    interactive: 'particle-classifier',
    questions: [
      {
        id: 'compare-q1',
        prompt: {
          zh: '某样品只有完全相同的 AB 粒子，其中 A、B 是不同原子。它是什么？',
          en: 'A sample contains only identical AB particles, where A and B are different atoms. What is it?',
        },
        options: [
          { zh: '元素', en: 'Element' },
          { zh: '化合物', en: 'Compound' },
          { zh: '混合物', en: 'Mixture' },
        ],
        answer: 1,
        explanation: {
          zh: '样品只有一种粒子，所以是纯净物；粒子含不同原子，所以是化合物。',
          en: 'There is one particle type, so it is pure; each particle contains different atoms, so it is a compound.',
        },
      },
      {
        id: 'compare-q2',
        prompt: {
          zh: '图中同时存在 A₂ 粒子和 AB 粒子，应怎样分类？',
          en: 'A diagram contains both A₂ and AB particles. How should it be classified?',
        },
        options: [
          { zh: '纯元素', en: 'Pure element' },
          { zh: '纯化合物', en: 'Pure compound' },
          { zh: '混合物', en: 'Mixture' },
        ],
        answer: 2,
        explanation: {
          zh: 'A₂ 和 AB 是两种不同粒子，共同存在就构成混合物。',
          en: 'A₂ and AB are different particle types; together they form a mixture.',
        },
      },
      {
        id: 'compare-q3',
        prompt: {
          zh: '哪种方法能把化合物拆成组成它的元素？',
          en: 'What can separate a compound into its elements?',
        },
        options: [
          { zh: '合适的化学变化', en: 'A suitable chemical change' },
          { zh: '普通过滤', en: 'Ordinary filtration' },
          { zh: '用筛子筛', en: 'Sieving' },
        ],
        answer: 0,
        explanation: {
          zh: '化合物内部是化学结合，必须用化学变化重新组合原子。',
          en: 'Atoms in a compound are chemically joined, so a chemical change must rearrange them.',
        },
      },
    ],
  },
] satisfies Lesson[];
