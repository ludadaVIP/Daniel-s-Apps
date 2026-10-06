import type { LocalizedText } from '@study/shared';

export type PathLevel = {
  id: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonCount: number;
  topics: LocalizedText[];
};

// A Phase 0 roadmap preview. Phase 1 will load this from validated content files.
export const pathLevels: PathLevel[] = [
  {
    id: 'matter',
    number: '01',
    title: { zh: '物质与粒子', en: 'Matter & particles' },
    description: {
      zh: '从身边看得见的东西，走进看不见的微观世界。',
      en: 'Start with everyday materials, then explore the invisible world.',
    },
    lessonCount: 5,
    topics: [
      { zh: '什么是物质？', en: 'What is matter?' },
      { zh: '一切由粒子构成', en: 'Everything is made of particles' },
      { zh: '固体、液体和气体', en: 'Solids, liquids and gases' },
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
    lessonCount: 3,
    topics: [
      { zh: '纯净物与混合物', en: 'Pure substances and mixtures' },
      { zh: '什么是元素？', en: 'What is an element?' },
      { zh: '什么是化合物？', en: 'What is a compound?' },
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
    lessonCount: 8,
    topics: [
      { zh: '什么是原子？', en: 'What is an atom?' },
      { zh: '质子、中子、电子', en: 'Protons, neutrons and electrons' },
      { zh: '原子序数与质量数', en: 'Atomic and mass numbers' },
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
    lessonCount: 8,
    topics: [
      { zh: '周期表、族与周期', en: 'The table, groups and periods' },
      { zh: '金属与非金属', en: 'Metals and non-metals' },
      { zh: '第 1、17、18 族', en: 'Groups 1, 17 and 18' },
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
    lessonCount: 5,
    topics: [
      { zh: '原子为什么连接？', en: 'Why atoms connect' },
      { zh: '离子键与共价键', en: 'Ionic and covalent bonds' },
      { zh: '结构怎样影响性质？', en: 'How structure affects properties' },
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
    lessonCount: 6,
    topics: [
      { zh: '化学式告诉我们什么？', en: 'What does a formula tell us?' },
      { zh: '下标与原子比例', en: 'Subscripts and atom ratios' },
      { zh: '离子电荷与最简比', en: 'Ion charges and simplest ratios' },
      { zh: '二元离子化合物命名', en: 'Naming binary ionic compounds' },
      { zh: '可变电荷与罗马数字', en: 'Variable charges and Roman numerals' },
      { zh: '多原子离子与括号', en: 'Polyatomic ions and parentheses' },
      { zh: '分子化合物与数字前缀', en: 'Molecular compounds and prefixes' },
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
    lessonCount: 3,
    topics: [
      { zh: '反应物怎样变成生成物？', en: 'How do reactants become products?' },
      { zh: '反应现象与证据', en: 'Reaction observations and evidence' },
      { zh: '原子与质量守恒', en: 'Conservation of atoms and mass' },
      {
        zh: '读懂方程式的箭头、系数和下标',
        en: 'Read arrows, coefficients and subscripts',
      },
      { zh: '配平与原子守恒', en: 'Balancing and atom conservation' },
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
    lessonCount: 5,
    topics: [
      { zh: '酸、碱与 pH', en: 'Acids, bases and pH' },
      { zh: '指示剂的颜色线索', en: 'Indicator colour clues' },
      {
        zh: '安全观察与正确判断',
        en: 'Safe observations and sound conclusions',
      },
      { zh: '中和与恰当份量', en: 'Neutralisation and the right amount' },
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
    lessonCount: 3,
    topics: [
      { zh: '铁为什么生锈？', en: 'Why does iron rust?' },
      { zh: '氧化与电子转移', en: 'Oxidation and electron transfer' },
      { zh: '保护金属的设计', en: 'Designing metal protection' },
      { zh: '金属置换与电子去向', en: 'Metal displacement and electron flow' },
      { zh: '镀锌与牺牲保护', en: 'Galvanising and sacrificial protection' },
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
    lessonCount: 3,
    topics: [
      { zh: '为什么化学家要用摩尔？', en: 'Why do chemists use moles?' },
      { zh: '阿伏伽德罗常数', en: 'Avogadro’s constant' },
      { zh: '粒子数、质量与比例', en: 'Particles, mass and ratios' },
      { zh: '摩尔质量与天平', en: 'Molar mass and the balance' },
      { zh: '方程式中的摩尔配方', en: 'Mole recipes in equations' },
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
    lessonCount: 3,
    topics: [
      { zh: '溶解不是消失', en: 'Dissolving is not disappearing' },
      { zh: '溶质、溶剂与溶液', en: 'Solute, solvent and solution' },
      { zh: '饱和与溶解度', en: 'Saturation and solubility' },
      { zh: '浓度与稀释', en: 'Concentration and dilution' },
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
    lessonCount: 2,
    topics: [
      { zh: '放热与吸热', en: 'Exothermic and endothermic change' },
      { zh: '系统、周围与能量流', en: 'System, surroundings and energy flow' },
      { zh: '化学键与能量账本', en: 'Chemical bonds and energy accounting' },
      { zh: '燃料与能量密度', en: 'Fuels and energy density' },
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
    lessonCount: 1,
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
    lessonCount: 1,
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
    lessonCount: 1,
    topics: [
      { zh: '原电池与电子路线', en: 'Galvanic cells and electron routes' },
      { zh: '氧化、还原与电极', en: 'Oxidation, reduction and electrodes' },
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
    lessonCount: 4,
    topics: [
      { zh: '碳的四个共价键', en: 'Carbon’s four covalent bonds' },
      { zh: '碳链、分支与环', en: 'Chains, branches and rings' },
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
    lessonCount: 3,
    topics: [
      { zh: '分离与鉴定的区别', en: 'Separating versus identifying' },
      { zh: '纸色谱法与图样', en: 'Paper chromatography and patterns' },
      {
        zh: '对照样品与公平比较',
        en: 'Reference samples and fair comparisons',
      },
      { zh: '证据的强弱与局限', en: 'Strengths and limits of evidence' },
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
    lessonCount: 2,
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
    ],
  },
];
