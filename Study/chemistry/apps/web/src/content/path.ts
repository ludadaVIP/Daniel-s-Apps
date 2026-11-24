import type { LocalizedText } from '@study/shared';

export type PathLevel = {
  id: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonCount: number;
  topics: LocalizedText[];
};

// Curriculum modules; lesson numbers stay stable when introductory modules are added.
export const pathLevels: PathLevel[] = [
  {
    id: 'science-basics',
    number: '00',
    title: { zh: '科学思维与实验基础', en: 'Scientific thinking & lab basics' },
    description: {
      zh: '先学会记录、比较、测量与检查证据，再把这些方法带进化学。适合刚开始学习的孩子。',
      en: 'Begin with records, comparisons, measurements and evidence before taking these methods into chemistry.',
    },
    lessonCount: 4,
    topics: [
      { zh: '观察与推断', en: 'Observation and inference' },
      { zh: '公平比较与控制变量', en: 'Fair comparisons and controls' },
      {
        zh: '重复读数、参考值与分辨率',
        en: 'Repeats, references and resolution',
      },
      {
        zh: '称量范围与质量守恒',
        en: 'Weighing boundaries and mass conservation',
      },
    ],
  },
  {
    id: 'matter',
    number: '01',
    title: { zh: '物质与粒子', en: 'Matter & particles' },
    description: {
      zh: '从身边看得见的东西，走进看不见的微观世界。',
      en: 'Start with everyday materials, then explore the invisible world.',
    },
    lessonCount: 7,
    topics: [
      { zh: '什么是物质？', en: 'What is matter?' },
      { zh: '一切由粒子构成', en: 'Everything is made of particles' },
      { zh: '固体、液体和气体', en: 'Solids, liquids and gases' },
      {
        zh: '检查状态变化的粒子图',
        en: 'Audit phase-change particle pictures',
      },
      {
        zh: '溶解、熔化与分离的粒子账本',
        en: 'Particle ledgers for dissolving, melting and separation',
      },
    ],
  },
  {
    id: 'substances',
    number: '02',
    title: { zh: '元素、化合物与混合物', en: 'Elements, compounds & mixtures' },
    description: {
      zh: '学会用更清楚的方式给物质分类。',
      en: 'Learn to classify materials more precisely.',
    },
    lessonCount: 6,
    topics: [
      { zh: '纯净物与混合物', en: 'Pure substances and mixtures' },
      { zh: '什么是元素？', en: 'What is an element?' },
      { zh: '什么是化合物？', en: 'What is a compound?' },
      {
        zh: '原子、分子与物质种类',
        en: 'Atoms, molecules and substance types',
      },
      { zh: '分子式的系数与下标', en: 'Molecular coefficients and subscripts' },
    ],
  },
  {
    id: 'atoms',
    number: '03',
    title: { zh: '原子结构', en: 'Atomic structure' },
    description: {
      zh: '认识质子、中子、电子，理解元素的身份。',
      en: 'Meet protons, neutrons and electrons—and what identifies an element.',
    },
    lessonCount: 10,
    topics: [
      { zh: '什么是原子？', en: 'What is an atom?' },
      { zh: '质子、中子、电子', en: 'Protons, neutrons and electrons' },
      { zh: '原子序数与质量数', en: 'Atomic and mass numbers' },
      { zh: '同位素与离子的两份账本', en: 'Separate isotope and ion ledgers' },
      {
        zh: '同位素配比与平均相对质量',
        en: 'Isotope composition and mean relative mass',
      },
    ],
  },
  {
    id: 'table',
    number: '04',
    title: { zh: '元素周期表', en: 'The periodic table' },
    description: {
      zh: '找到周期表里的规律，不再靠死记硬背。',
      en: 'Discover its patterns instead of memorizing a chart.',
    },
    lessonCount: 10,
    topics: [
      { zh: '周期表、族与周期', en: 'The table, groups and periods' },
      { zh: '金属与非金属', en: 'Metals and non-metals' },
      { zh: '第 1、17、18 族', en: 'Groups 1, 17 and 18' },
      {
        zh: '中性排布与元素位置',
        en: 'Neutral arrangements and element positions',
      },
      {
        zh: '电子提供、需求与整体电荷',
        en: 'Electron supply, demand and overall charge',
      },
    ],
  },
  {
    id: 'bonding',
    number: '05',
    title: { zh: '离子与化学键', en: 'Ions & chemical bonding' },
    description: {
      zh: '从“最外层电子”走到盐、水和材料为什么能形成。',
      en: 'Move from outer electrons to why salt, water and materials can form.',
    },
    lessonCount: 7,
    topics: [
      { zh: '原子为什么连接？', en: 'Why atoms connect' },
      { zh: '离子键与共价键', en: 'Ionic and covalent bonds' },
      { zh: '结构怎样影响性质？', en: 'How structure affects properties' },
      {
        zh: '整体价电子与局部清点',
        en: 'Whole valence inventories and local checks',
      },
      { zh: 'Lewis 预算与多重键', en: 'Lewis budgets and multiple bonds' },
    ],
  },
  {
    id: 'formulae',
    number: '06',
    title: { zh: '化学式与命名', en: 'Chemical formulae & naming' },
    description: {
      zh: '读懂元素符号、下标和系数，让化学语言真正有意义。',
      en: 'Decode symbols, subscripts and coefficients so chemical language makes sense.',
    },
    lessonCount: 8,
    topics: [
      { zh: '化学式告诉我们什么？', en: 'What does a formula tell us?' },
      { zh: '下标与原子比例', en: 'Subscripts and atom ratios' },
      { zh: '离子电荷与最简比', en: 'Ion charges and simplest ratios' },
      { zh: '二元离子化合物命名', en: 'Naming binary ionic compounds' },
      { zh: '可变电荷与罗马数字', en: 'Variable charges and Roman numerals' },
      { zh: '多原子离子与括号', en: 'Polyatomic ions and parentheses' },
      { zh: '分子化合物与数字前缀', en: 'Molecular compounds and prefixes' },
      {
        zh: '电中性批量与最简化学式',
        en: 'Neutral batches and simplest formulas',
      },
      {
        zh: '系数、离子组与内部组成',
        en: 'Coefficients, ion groups and internal composition',
      },
    ],
  },
  {
    id: 'reactions',
    number: '07',
    title: { zh: '化学反应与方程式', en: 'Chemical reactions & equations' },
    description: {
      zh: '看见原子如何重新组合，再用方程式把过程准确记录下来。',
      en: 'Watch atoms rearrange, then record the process precisely with equations.',
    },
    lessonCount: 7,
    topics: [
      { zh: '反应物怎样变成生成物？', en: 'How do reactants become products?' },
      { zh: '反应现象与证据', en: 'Reaction observations and evidence' },
      { zh: '原子与质量守恒', en: 'Conservation of atoms and mass' },
      {
        zh: '读懂方程式的箭头、系数和下标',
        en: 'Read arrows, coefficients and subscripts',
      },
      { zh: '配平与原子守恒', en: 'Balancing and atom conservation' },
      {
        zh: '外观线索与物质身份证据',
        en: 'Appearance clues and substance identities',
      },
      { zh: '原子守恒与分子个数', en: 'Atom conservation and molecule counts' },
      {
        zh: '沉淀、旁观离子与净离子方程式',
        en: 'Precipitation, spectator ions and net ionic equations',
      },
    ],
  },
  {
    id: 'acids',
    number: '08',
    title: { zh: '酸、碱与盐', en: 'Acids, bases & salts' },
    description: {
      zh: '从舌尖的酸味走到 pH 颜色尺，理解清洁、土壤和中和背后的规律。',
      en: 'Travel from sour taste to the pH colour scale, then explore the patterns behind cleaning, soil and neutralisation.',
    },
    lessonCount: 12,
    topics: [
      { zh: '酸、碱与 pH', en: 'Acids, bases and pH' },
      { zh: '指示剂的颜色线索', en: 'Indicator colour clues' },
      { zh: '色卡范围与交集', en: 'Chart ranges and their overlap' },
      { zh: '酸碱性与全部电荷', en: 'Acid/base class and whole charge' },
      { zh: 'pH 的十倍台阶与稀释', en: 'Tenfold pH steps and dilution' },
      { zh: '强弱与浓稀的区别', en: 'Strength versus concentration' },
      {
        zh: '安全观察与正确判断',
        en: 'Safe observations and sound conclusions',
      },
      { zh: '中和与恰当份量', en: 'Neutralisation and the right amount' },
      {
        zh: '质子转移与水的不同角色',
        en: 'Proton transfer and water’s different roles',
      },
      {
        zh: '中和当量与完整离子账本',
        en: 'Neutralisation equivalents and complete ion ledgers',
      },
      {
        zh: '碳酸盐、碳酸氢盐与耗酸比例',
        en: 'Carbonate, hydrogen carbonate and acid ratios',
      },
      { zh: '酸和碳酸盐产生气体', en: 'Acids and carbonates make a gas' },
      { zh: '盐：不只是厨房食盐', en: 'Salts: more than table salt' },
      {
        zh: '酸与金属：谁会放出氢气？',
        en: 'Acids and metals: who releases hydrogen?',
      },
    ],
  },
  {
    id: 'metals',
    number: '09',
    title: { zh: '金属与氧化还原', en: 'Metals & redox' },
    description: {
      zh: '从铁锈、电池到金属保护，追踪电子怎样转移并改变材料。',
      en: 'From rust and batteries to metal protection, trace how electron transfer changes materials.',
    },
    lessonCount: 6,
    topics: [
      { zh: '铁为什么生锈？', en: 'Why does iron rust?' },
      { zh: '氧化与电子转移', en: 'Oxidation and electron transfer' },
      { zh: '保护金属的设计', en: 'Designing metal protection' },
      { zh: '金属置换与电子去向', en: 'Metal displacement and electron flow' },
      { zh: '镀锌与牺牲保护', en: 'Galvanising and sacrificial protection' },
      { zh: '氧化数与整体电荷', en: 'Oxidation numbers and overall charge' },
      {
        zh: '半反应、电子守恒与最简比',
        en: 'Half-reactions, electron conservation and simplest ratios',
      },
      {
        zh: '置换反应的限制量与剩余物',
        en: 'Limiting amounts and leftovers in displacement',
      },
    ],
  },
  {
    id: 'moles',
    number: '10',
    title: { zh: '摩尔与化学计量', en: 'Moles & stoichiometry' },
    description: {
      zh: '学会用“化学家的计数单位”把看不见的粒子、质量和反应比例连起来。',
      en: 'Use chemistry’s counting unit to connect invisible particles, mass and reaction ratios.',
    },
    lessonCount: 6,
    topics: [
      { zh: '为什么化学家要用摩尔？', en: 'Why do chemists use moles?' },
      { zh: '阿伏伽德罗常数', en: 'Avogadro’s constant' },
      { zh: '粒子数、质量与比例', en: 'Particles, mass and ratios' },
      { zh: '摩尔质量与天平', en: 'Molar mass and the balance' },
      { zh: '方程式中的摩尔配方', en: 'Mole recipes in equations' },
      { zh: '限制反应物与剩余物', en: 'Limiting reactants and leftovers' },
      { zh: '理论产量与实际产率', en: 'Theoretical yield and percent yield' },
      {
        zh: '由元素质量推最简式与分子式',
        en: 'Empirical and molecular formulas from element masses',
      },
    ],
  },
  {
    id: 'solutions',
    number: '11',
    title: { zh: '溶液与浓度', en: 'Solutions & concentration' },
    description: {
      zh: '从一杯糖水看见溶质怎样分散，再学会用“浓淡”描述配方。',
      en: 'Start with sugar water, then learn how solutes spread and how recipes become more or less concentrated.',
    },
    lessonCount: 5,
    topics: [
      { zh: '溶解不是消失', en: 'Dissolving is not disappearing' },
      { zh: '溶质、溶剂与溶液', en: 'Solute, solvent and solution' },
      { zh: '饱和与溶解度', en: 'Saturation and solubility' },
      { zh: '浓度与稀释', en: 'Concentration and dilution' },
      { zh: '物质的量浓度 mol/L', en: 'Molar concentration: mol/L' },
      { zh: '离子、溶解与导电', en: 'Ions, dissolution and conduction' },
    ],
  },
  {
    id: 'gases',
    number: '12',
    title: { zh: '气体', en: 'Gases' },
    description: {
      zh: '从打气筒、气球到天气图，追踪看不见的粒子怎样形成压强。',
      en: 'From pumps and balloons to weather maps, trace how invisible particles make pressure.',
    },
    lessonCount: 2,
    topics: [
      { zh: '气体压强与粒子碰撞', en: 'Gas pressure and particle collisions' },
      { zh: '体积、温度与压强', en: 'Volume, temperature and pressure' },
      { zh: '空气与大气压强', en: 'Air and atmospheric pressure' },
      { zh: '气体定律的生活应用', en: 'Gas laws in everyday life' },
    ],
  },
  {
    id: 'energetics',
    number: '13',
    title: { zh: '能量与热化学', en: 'Energetics & thermochemistry' },
    description: {
      zh: '从暖手包、冷敷袋到燃料，追踪反应中的能量怎样流动。',
      en: 'From hand warmers and cold packs to fuels, follow how energy travels in chemical change.',
    },
    lessonCount: 4,
    topics: [
      { zh: '放热与吸热', en: 'Exothermic and endothermic change' },
      { zh: '系统、周围与能量流', en: 'System, surroundings and energy flow' },
      { zh: '化学键与能量账本', en: 'Chemical bonds and energy accounting' },
      { zh: '燃料与能量密度', en: 'Fuels and energy density' },
      { zh: '量热法与 q = mcΔT', en: 'Calorimetry and q = mcΔT' },
      { zh: '赫斯定律与反应路线', en: 'Hess’s law and reaction routes' },
    ],
  },
  {
    id: 'rates',
    number: '14',
    title: { zh: '反应速率', en: 'Reaction rates' },
    description: {
      zh: '像侦探一样观察反应的快慢，找出温度、浓度、表面积和催化剂怎样改变碰撞机会。',
      en: 'Observe reaction speed like a detective, then see how temperature, concentration, surface area and catalysts change collision chances.',
    },
    lessonCount: 2,
    topics: [
      { zh: '什么是反应速率？', en: 'What is reaction rate?' },
      {
        zh: '温度、浓度与表面积',
        en: 'Temperature, concentration and surface area',
      },
      { zh: '催化剂如何加快反应', en: 'How catalysts speed reactions' },
      { zh: '公平实验与证据', en: 'Fair tests and evidence' },
    ],
  },
  {
    id: 'equilibrium',
    number: '15',
    title: { zh: '化学平衡', en: 'Chemical equilibrium' },
    description: {
      zh: '从密封汽水和双向人流理解“看似不变、其实在动”的平衡。',
      en: 'Use sealed soda and two-way traffic to understand balance that looks still but keeps moving.',
    },
    lessonCount: 2,
    topics: [
      { zh: '动态平衡的条件', en: 'Conditions for dynamic equilibrium' },
      { zh: '正向与逆向速率', en: 'Forward and reverse rates' },
      { zh: '平衡如何被扰动', en: 'How equilibrium is disturbed' },
      { zh: '勒夏特列原理的直觉', en: 'Le Châtelier intuition' },
    ],
  },
  {
    id: 'electrochemistry',
    number: '16',
    title: { zh: '电化学', en: 'Electrochemistry' },
    description: {
      zh: '从电池、电子转移到金属保护，看化学反应怎样驱动或消耗电流。',
      en: 'From batteries and electron transfer to metal protection, see how chemical changes drive or consume current.',
    },
    lessonCount: 3,
    topics: [
      { zh: '原电池与电子路线', en: 'Galvanic cells and electron routes' },
      { zh: '氧化、还原与电极', en: 'Oxidation, reduction and electrodes' },
      { zh: '盐桥与电荷平衡', en: 'Salt bridges and charge balance' },
      {
        zh: '电镀中的物质与电荷账本',
        en: 'Material and charge ledgers in plating',
      },
      {
        zh: '电解与外加电能',
        en: 'Electrolysis and external electrical energy',
      },
      { zh: '电池安全与回收', en: 'Battery safety and recycling' },
    ],
  },
  {
    id: 'organic',
    number: '17',
    title: { zh: '有机化学', en: 'Organic chemistry' },
    description: {
      zh: '从碳的四个连接位走进燃料、食物香味、材料与可持续选择。',
      en: 'Start with carbon’s four connections, then explore fuels, aromas, materials and sustainable choices.',
    },
    lessonCount: 6,
    topics: [
      { zh: '碳的四个共价键', en: 'Carbon’s four covalent bonds' },
      { zh: '碳链、分支与环', en: 'Chains, branches and rings' },
      { zh: '同分异构与连接关系', en: 'Isomerism and connectivity' },
      { zh: '烯烃的加成与加聚', en: 'Alkene addition and polymerisation' },
      {
        zh: '烃、官能团与性质',
        en: 'Hydrocarbons, functional groups and properties',
      },
      { zh: '聚合物与材料选择', en: 'Polymers and material choices' },
    ],
  },
  {
    id: 'analysis',
    number: '18',
    title: { zh: '分析化学基础', en: 'Intro analytical chemistry' },
    description: {
      zh: '像化学侦探一样分离、比较和判断证据：先看清“里面有什么”。',
      en: 'Separate, compare and judge evidence like a chemistry detective: first find out what is inside.',
    },
    lessonCount: 5,
    topics: [
      { zh: '分离与鉴定的区别', en: 'Separating versus identifying' },
      { zh: '纸色谱法与图样', en: 'Paper chromatography and patterns' },
      {
        zh: '对照样品与公平比较',
        en: 'Reference samples and fair comparisons',
      },
      { zh: '证据的强弱与局限', en: 'Strengths and limits of evidence' },
      {
        zh: '结晶水、恒重与数据审计',
        en: 'Water of crystallisation, constant mass and evidence auditing',
      },
      {
        zh: '滴定终点与浓度计算',
        en: 'Titration endpoints and concentration calculations',
      },
    ],
  },
  {
    id: 'problem-solving',
    number: '19',
    title: { zh: '综合问题解决', en: 'Integrated problem solving' },
    description: {
      zh: '把粒子、反应、能量和测量串成可检验的解释，像真正的化学家一样处理生活问题。',
      en: 'Link particles, reactions, energy and measurement into testable explanations for everyday problems.',
    },
    lessonCount: 4,
    topics: [
      {
        zh: '从现象提出可检验问题',
        en: 'From observation to testable question',
      },
      { zh: '变量、证据与因果链', en: 'Variables, evidence and causal chains' },
      {
        zh: '多个化学概念一起工作',
        en: 'Multiple chemistry ideas working together',
      },
      { zh: '用模型表达局限', en: 'State model limitations' },
      {
        zh: '沉淀量、限制反应物与滤液证据',
        en: 'Precipitate yield, limiting reagents and filtrate evidence',
      },
    ],
  },
];

export const guidedSequences: Array<{
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonIds: string[];
}> = [
  {
    id: 'science-evidence-foundations',
    title: {
      zh: '初学入口：科学观察与实验基础',
      en: 'Start here: scientific observation and lab basics',
    },
    description: {
      zh: '不用先会化学。四次小学习，依次练记录、设计比较、读懂测量与检查质量账本，再进入“什么是物质？”。',
      en: 'No chemistry background needed. Four short sessions practise records, comparisons, measurements and mass ledgers, then lead into “What is matter?”.',
    },
    lessonIds: [
      'observation-before-explanation',
      'fair-comparisons-and-variables',
      'repeated-measurements-and-bias',
      'mass-conservation-and-boundaries',
    ],
  },
  {
    id: 'particle-evidence-bridge',
    title: {
      zh: '初学衔接：读懂变化背后的粒子图',
      en: 'Beginner bridge: read particle evidence behind changes',
    },
    description: {
      zh: '先完成“物质与粒子”原有五课，再分两次学习：检查水的状态变化图，追踪糖溶解与回收。用图例与账本解释，而不是只选术语。',
      en: 'After the original five Matter & particles lessons, take two sessions to audit water phase diagrams and follow dissolved sugar through recovery. Explain with keys and inventories, beyond naming terms.',
    },
    lessonIds: ['state-change-particle-evidence', 'dissolving-is-not-melting'],
  },
  {
    id: 'molecule-language-bridge',
    title: {
      zh: '初学衔接：从原子图到分子式',
      en: 'Beginner bridge: from atom pictures to molecular formulas',
    },
    description: {
      zh: '学完“什么是原子？”后，用两次学习分别清点原子、分子和物质种类，再把整份分子复制成系数。自己填数字，说明为什么这样数。',
      en: 'After “What is an atom?”, use two sessions to separate atom, molecule and substance counts, then copy whole molecules with coefficients. Enter your own numbers and explain the counting.',
    },
    lessonIds: [
      'atoms-molecules-and-substance-types',
      'coefficients-and-molecular-subscripts',
    ],
  },
  {
    id: 'atomic-inventory-bridge',
    title: {
      zh: '初学衔接：原子身份与平均质量',
      en: 'Beginner bridge: atomic identity and mean mass',
    },
    description: {
      zh: '学完“什么是离子？”后分两次练习：由 Z、A、q 还原粒子，再按同位素配比计算平均。把核内、电子与样品统计分开解释，之后进入周期表。',
      en: 'After “What is an ion?”, reconstruct particles from Z, A and q, then calculate isotope-weighted means in a second session. Separate nuclei, electrons and sample statistics before continuing to the periodic table.',
    },
    lessonIds: ['isotope-and-ion-two-ledgers', 'isotope-abundance-and-mean'],
  },
  {
    id: 'periodic-to-bonding-bridge',
    title: {
      zh: '初学衔接：从周期表到电子账本',
      en: 'Beginner bridge: from the periodic table to electron ledgers',
    },
    description: {
      zh: '学完第 18 族后，先检查中性排布与离子排布的区别，再核对电子提供与需求。两次学习后进入“为什么原子会连接？”。',
      en: 'After Group 18, distinguish neutral from ionic arrangements, then audit electron supply and demand. Two sessions lead into “Why atoms make bonds”.',
    },
    lessonIds: [
      'neutral-atoms-before-table-position',
      'electron-transfer-needs-both-sides',
    ],
  },
  {
    id: 'covalent-electron-bridge',
    title: {
      zh: '初学衔接：共享电子与 Lewis 账本',
      en: 'Beginner bridge: shared electrons and Lewis ledgers',
    },
    description: {
      zh: '学完成键单元原有五课后，用两次学习检查共享、孤对和局部数法，再诊断双键、三键的候选草图。之后进入化学式。',
      en: 'After the original five bonding lessons, audit shared pairs, lone pairs and local counts, then diagnose double- and triple-bond drafts. Two sessions lead into chemical formulas.',
    },
    lessonIds: ['shared-electrons-count-once', 'lewis-budget-before-octets'],
  },
  {
    id: 'formula-composition-bridge',
    title: {
      zh: '初学衔接：化学式、批量与括号',
      en: 'Beginner bridge: formulas, batches and parentheses',
    },
    description: {
      zh: '学完化学式与命名单元原有六课后，先分清电中性批量与最简离子比，再按三层展开括号和系数。两次学习后进入化学反应。',
      en: 'After the original six formula and naming lessons, separate neutral batches from simplest ion ratios, then expand parentheses and coefficients in three levels. Two sessions lead into chemical reactions.',
    },
    lessonIds: [
      'neutral-batch-simplest-formula',
      'parentheses-groups-and-coefficients',
    ],
  },
  {
    id: 'reaction-evidence-bridge',
    title: {
      zh: '初学衔接：反应证据与原子清单',
      en: 'Beginner bridge: reaction evidence and atom inventories',
    },
    description: {
      zh: '学完反应与方程式原有三课后，比较相似现象下的不同身份证据，再区分原子守恒与分子个数。两次学习后进入酸、碱与 pH。',
      en: 'After the original three reaction/equation lessons, compare identity evidence behind similar appearances, then separate atom conservation from molecule totals. Two sessions lead into acids, bases and pH.',
    },
    lessonIds: [
      'clues-before-reaction-verdict',
      'atoms-conserved-molecules-change',
    ],
  },
  {
    id: 'ph-evidence-bridge',
    title: {
      zh: '初学衔接：pH 范围与完整离子清单',
      en: 'Beginner bridge: pH ranges and complete ion inventories',
    },
    description: {
      zh: '学完“酸、碱与 pH”后，先用两张色卡找共同范围，再把酸碱性、全部电荷和取样体积分别核对。两次学习后进入中和。',
      en: 'After “Acids, bases and pH”, combine two colour charts, then audit acid/base class, whole charge and sampling volume separately. Two sessions lead into neutralisation.',
    },
    lessonIds: [
      'indicator-colours-give-ranges',
      'acidic-is-not-positively-charged',
    ],
  },
  {
    id: 'ions-in-water',
    title: {
      zh: '衔接单元一：追踪水里的离子',
      en: 'Guided sequence 1: follow ions in water',
    },
    description: {
      zh: '先会解释，再学表示，最后用数量检验。共四课；每课先回顾列出的基础，建议分四次学习。',
      en: 'Explain first, represent next, then test with quantities. Four lessons for four sessions; revisit each lesson’s listed foundations first.',
    },
    lessonIds: [
      'ions-carry-current',
      'precipitation-ion-ledger',
      'net-ionic-equation-detective',
      'precipitation-limits-and-filtrate',
    ],
  },
  {
    id: 'acid-base-particles',
    title: {
      zh: '衔接单元二：酸碱反应中的粒子去向',
      en: 'Guided sequence 2: follow particles through acid–base reactions',
    },
    description: {
      zh: '接着离子账本，追踪 H⁺ 的去向，再核对中和与产气的数量。共三课，建议分三次学习；前置概念不熟悉就先回看。',
      en: 'Build on ion ledgers: follow H⁺, then audit neutralisation and gas quantities. Three lessons for three sessions; revisit unfamiliar prerequisites first.',
    },
    lessonIds: [
      'proton-donor-and-acceptor',
      'neutralisation-ion-accounting',
      'carbonate-bicarbonate-acid-budget',
    ],
  },
  {
    id: 'electron-ledgers',
    title: {
      zh: '衔接单元三：用电子账本理解氧化还原',
      en: 'Guided sequence 3: understand redox with electron ledgers',
    },
    description: {
      zh: '从酸碱课的电荷变化出发，分清氧化数，再配平电子并计算产量。共三课；先预测、核对守恒，再换一组条件解释。',
      en: 'Start with charge changes from acid–base lessons, distinguish oxidation numbers, balance electrons and calculate yield. Three sessions: predict, audit conservation, then explain a changed case.',
    },
    lessonIds: [
      'oxidation-number-and-charge',
      'half-reactions-electron-balance',
      'redox-limits-and-leftovers',
    ],
  },
];

export const pathGroups: Array<{
  id: string;
  title: LocalizedText;
  levelIds: string[];
}> = [
  {
    id: 'chem-science-basics',
    title: {
      zh: '科学观察与实验',
      en: 'Scientific observation & investigation',
    },
    levelIds: ['science-basics'],
  },
  {
    id: 'chem-foundations',
    title: { zh: '物质与结构', en: 'Matter & structure' },
    levelIds: ['matter', 'substances', 'atoms', 'table', 'bonding', 'formulae'],
  },
  {
    id: 'chem-reactions',
    title: { zh: '反应与变化', en: 'Reactions & changes' },
    levelIds: ['reactions', 'acids', 'metals'],
  },
  {
    id: 'chem-quantitative',
    title: { zh: '定量与规律', en: 'Quantity & patterns' },
    levelIds: [
      'moles',
      'solutions',
      'gases',
      'energetics',
      'rates',
      'equilibrium',
    ],
  },
  {
    id: 'chem-applications',
    title: { zh: '应用与综合', en: 'Applications & synthesis' },
    levelIds: ['electrochemistry', 'organic', 'analysis', 'problem-solving'],
  },
];
