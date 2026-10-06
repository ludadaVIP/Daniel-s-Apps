import type { Lesson } from './lessons';

export const level10Lessons = [
  {
    id: 'why-chemists-use-moles',
    levelId: 'moles',
    order: 48,
    title: {
      zh: '摩尔：给看不见粒子的一种“打包单位”',
      en: 'The mole: a package unit for invisible particles',
    },
    eyebrow: {
      zh: '第 48 课 · 从“一打”走向极大的粒子数量',
      en: 'Lesson 48 · From a dozen to enormous particle counts',
    },
    hook: {
      zh: '买鸡蛋可以说“一打”，因为一个个数太慢。可是一小口水里就有多到无法逐个数的分子。化学家怎样既不丢掉粒子视角，又能真正称量、计算和配制材料？',
      en: 'You can buy eggs by the dozen because counting one by one is slow. A tiny sip of water contains far too many molecules to count. How do chemists keep the particle view while actually weighing and calculating materials?',
    },
    hookHint: {
      zh: '答案是“摩尔”：像“一打”是 12 个一样，1 mol 是固定数量的粒子——6.022 × 10²³ 个。它不是一种物质，也不是一种质量，而是一种计数单位。',
      en: 'The answer is the mole: just as a dozen means 12, 1 mol is a fixed number of particles—6.022 × 10²³. It is not a substance or a mass; it is a counting unit.',
    },
    bigIdea: {
      zh: '摩尔是化学家的粒子计数单位：1 mol 永远代表 6.022 × 10²³ 个指定粒子，帮助我们把微观数量和宏观称量连接起来。',
      en: 'The mole is chemistry’s particle-counting unit: 1 mol always represents 6.022 × 10²³ specified particles, linking microscopic amounts to macroscopic weighing.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🥚',
        title: {
          zh: '一打鸡蛋：先理解“打包”',
          en: 'A dozen eggs: understand packages first',
        },
        body: {
          zh: '“一打”不告诉你鸡蛋多重，只告诉你有 12 个。摩尔同样先回答“有多少粒子”，质量需要再结合粒子种类来讨论。',
          en: 'A dozen does not tell you egg mass; it tells you there are 12. A mole first answers “how many particles”; mass requires knowing what particle type is counted.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '一小滴水里的巨大世界',
          en: 'A huge world in a drop of water',
        },
        body: {
          zh: '水分子太小，一滴水中就有难以想象的数量。摩尔让化学家能用可称量的克数，间接处理这些看不见的分子。',
          en: 'Water molecules are so small that one drop contains an unimaginable number. The mole lets chemists use weighable grams to work indirectly with invisible molecules.',
        },
      },
      {
        icon: '💊',
        title: {
          zh: '药物与配方的精确份量',
          en: 'Precise amounts in medicines and formulas',
        },
        body: {
          zh: '药品、营养配方和材料制造都需要精确控制粒子比例。摩尔是计算比例的语言，不是自行调整药物剂量的工具。',
          en: 'Medicines, nutrition formulas and materials manufacturing need precise particle ratios. Moles are a language for calculating ratios, not a tool for self-adjusting medicine doses.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先说清楚“数的是什么”',
          en: 'First say what you are counting',
        },
        body: {
          zh: '1 mol H₂O 表示 6.022 × 10²³ 个水分子；1 mol NaCl 表示同样数量的化学式单位；1 mol Fe 表示同样数量的铁原子。单位相同，粒子种类不同。',
          en: '1 mol H₂O means 6.022 × 10²³ water molecules; 1 mol NaCl means the same number of formula units; 1 mol Fe means the same number of iron atoms. Same unit, different particle type.',
        },
      },
      {
        title: {
          zh: '阿伏伽德罗常数像“12”的巨大版本',
          en: 'Avogadro’s constant is a gigantic version of 12',
        },
        body: {
          zh: '6.022 × 10²³ 叫阿伏伽德罗常数。记号中的 10²³ 表示小数点后移动 23 位的数量级；它巨大，是因为原子和分子极小。',
          en: '6.022 × 10²³ is Avogadro’s constant. The 10²³ notation signals a decimal-scale shift of 23 places; it is huge because atoms and molecules are tiny.',
        },
      },
      {
        title: {
          zh: '摩尔是通往质量和方程式比例的桥',
          en: 'Moles bridge mass and equation ratios',
        },
        body: {
          zh: '稍后会学到，每种物质 1 mol 的质量不同，因为粒子本身质量不同；方程式系数也可读成摩尔比例。现在先牢固抓住：摩尔首先是“固定数量的一包”。',
          en: 'Later you will learn that 1 mol of each substance has a different mass because its particles have different masses; equation coefficients can also be read as mole ratios. For now, hold onto this: a mole is first a fixed-size package.',
        },
      },
    ],
    misconception: {
      zh: '“1 mol 一定等于某个固定克数”是错的。1 mol 永远是同样多的粒子，但 1 mol 铁、1 mol 水和 1 mol 二氧化碳的质量不同。就像一打羽毛和一打石头数量相同、质量不同。',
      en: '“1 mol always equals one fixed number of grams” is wrong. 1 mol always has the same number of particles, but 1 mol of iron, water and carbon dioxide have different masses. A dozen feathers and a dozen stones have the same count but different masses.',
    },
    mission: {
      zh: '计数单位侦探：在厨房或商店标签上找一个成组计数单位，如“一打”“一包”“一盒”或“6 个装”。说明它告诉了你什么、没有告诉你什么。再把答案迁移到 1 mol：它固定的是粒子数，不是质量或体积。',
      en: 'Counting-unit detective: find a grouped count on a kitchen or shop label—“dozen,” “pack,” “box,” or “6 count.” Explain what it tells you and what it does not. Transfer this to 1 mol: it fixes particle count, not mass or volume.',
    },
    vocabulary: [
      { en: 'mole (mol)', zh: '摩尔（mol）' },
      { en: 'Avogadro constant', zh: '阿伏伽德罗常数' },
      { en: 'particle', zh: '粒子' },
      { en: 'formula unit', zh: '化学式单位' },
      { en: 'amount of substance', zh: '物质的量' },
    ],
    interactive: 'mole-package-lab',
    questions: [
      {
        id: 'mole-q1',
        prompt: {
          zh: '1 mol H₂O 最准确表示什么？',
          en: 'What does 1 mol H₂O most accurately mean?',
        },
        options: [
          { zh: '6.022 × 10²³ 个水分子', en: '6.022 × 10²³ water molecules' },
          { zh: '1 克水', en: '1 gram of water' },
          { zh: '一滴水', en: 'One drop of water' },
        ],
        answer: 0,
        explanation: {
          zh: '摩尔数的是指定粒子。1 mol H₂O 就是一阿伏伽德罗常数个水分子；它的质量不是 1 g。',
          en: 'A mole counts specified particles. 1 mol H₂O is Avogadro’s constant number of water molecules; its mass is not 1 g.',
        },
      },
      {
        id: 'mole-q2',
        prompt: {
          zh: '1 mol Fe 与 1 mol H₂O 的粒子数量有什么关系？',
          en: 'How do particle counts compare for 1 mol Fe and 1 mol H₂O?',
        },
        options: [
          {
            zh: '相同，都是 6.022 × 10²³ 个指定粒子',
            en: 'They are equal: each has 6.022 × 10²³ specified particles',
          },
          {
            zh: '铁的粒子数更多，因为铁更重',
            en: 'Iron has more particles because it is heavier',
          },
          {
            zh: '水的粒子数更多，因为水是液体',
            en: 'Water has more particles because it is liquid',
          },
        ],
        answer: 0,
        explanation: {
          zh: '“1 mol”固定的是粒子数，与物质的质量、状态无关。Fe 数原子，H₂O 数分子。',
          en: '“1 mol” fixes particle count regardless of mass or state. Fe counts atoms; H₂O counts molecules.',
        },
      },
      {
        id: 'mole-q3',
        prompt: {
          zh: '为什么 1 mol 铁与 1 mol 水的质量不同？',
          en: 'Why do 1 mol iron and 1 mol water have different masses?',
        },
        options: [
          {
            zh: '它们各自的粒子质量不同，虽然粒子数量相同',
            en: 'Their individual particles have different masses even though counts are equal',
          },
          {
            zh: '摩尔的粒子数会随物质改变',
            en: 'The number of particles in a mole changes with substance',
          },
          {
            zh: '水分子会让铁原子消失',
            en: 'Water molecules make iron atoms disappear',
          },
        ],
        answer: 0,
        explanation: {
          zh: '同样数量的不同粒子，可以有不同总质量；这正像一打石头与一打羽毛。',
          en: 'The same number of different particles can have different total masses—like a dozen stones and a dozen feathers.',
        },
      },
      {
        id: 'mole-q4',
        prompt: {
          zh: '化学方程式中的系数在学习摩尔后还能表示什么？',
          en: 'After learning moles, what can equation coefficients also represent?',
        },
        options: [
          {
            zh: '反应物与生成物的摩尔比例',
            en: 'Mole ratios of reactants and products',
          },
          {
            zh: '每种物质固定的颜色',
            en: 'A fixed colour for every substance',
          },
          { zh: '每种元素的原子序数', en: 'Every element’s atomic number' },
        ],
        answer: 0,
        explanation: {
          zh: '例如 2H₂ + O₂ → 2H₂O 可读作 2 mol H₂ 与 1 mol O₂ 按 2:1:2 的比例反应。',
          en: 'For example, 2H₂ + O₂ → 2H₂O can be read as 2 mol H₂ and 1 mol O₂ reacting in a 2:1:2 ratio.',
        },
      },
    ],
  },
  {
    id: 'molar-mass-the-chemistry-scale',
    levelId: 'moles',
    order: 49,
    title: {
      zh: '摩尔质量：天平怎样数到分子？',
      en: 'Molar mass: how a balance counts molecules',
    },
    eyebrow: {
      zh: '第 49 课 · 同样一摩尔，不同的重量',
      en: 'Lesson 49 · Same mole, different weight',
    },
    hook: {
      zh: '一摩尔水、氧气和铁都装着同样多的粒子，可把它们放上天平，读数完全不同。天平到底看见了什么？',
      en: 'One mole of water, oxygen and iron each holds the same number of particles, yet a balance gives very different readings. What is the balance seeing?',
    },
    hookHint: {
      zh: '它看见总质量。每种粒子的质量不同，所以“同一大包粒子”的质量也不同。1 mol 物质的质量叫摩尔质量，单位是 g/mol。',
      en: 'It sees total mass. Different particles have different masses, so equal-size particle packages have different masses. The mass of 1 mol is molar mass, in g/mol.',
    },
    bigIdea: {
      zh: '摩尔质量把粒子计数单位 mol 与可称量的克 g 连接起来；同样 1 mol 的不同物质，质量由它们粒子的相对质量决定。',
      en: 'Molar mass links the particle-count unit mol with weighable grams; different substances have different masses for the same 1 mol because their particles have different relative masses.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '⚖️',
        title: {
          zh: '厨房秤与化学天平',
          en: 'Kitchen scale and chemistry balance',
        },
        body: {
          zh: '秤无法直接看见分子，却能测量它们加起来的总质量。化学家用摩尔质量把“克数”翻译成“多少一包粒子”。',
          en: 'A scale cannot see molecules, but it can measure their combined mass. Chemists use molar mass to translate grams into “how many particle packages.”',
        },
      },
      {
        icon: '🫧',
        title: {
          zh: '看不见的气体也有质量',
          en: 'Invisible gas still has mass',
        },
        body: {
          zh: '1 mol 氧气约 32 g，远大于 1 mol 氢气约 2 g；两者粒子数相同，只是每个分子的质量不同。',
          en: '1 mol oxygen is about 32 g, far more than 1 mol hydrogen at about 2 g. Their particle counts are equal; each molecule simply has different mass.',
        },
      },
      {
        icon: '🧪',
        title: {
          zh: '配方需要质量，也需要比例',
          en: 'Formulas need mass and ratio',
        },
        body: {
          zh: '材料、食品和医药制造会用质量精确投料，但反应是否恰当还要看摩尔比例。称得准不等于比例一定对。',
          en: 'Materials, food and medicine production measure inputs precisely by mass, but correct reactions also require mole ratios. Accurate weighing does not automatically guarantee the right ratio.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '从化学式加出一份的相对质量',
          en: 'Add the relative masses in one formula',
        },
        body: {
          zh: 'H₂O 中有 2 个 H 和 1 个 O：约 2×1 + 16 = 18。因此水的摩尔质量约为 18 g/mol。化学式里的下标告诉我们加几次。',
          en: 'H₂O has two H and one O: about 2×1 + 16 = 18. So water’s molar mass is about 18 g/mol. Formula subscripts tell us how many times to add each mass.',
        },
      },
      {
        title: {
          zh: '同一粒子数，不同总质量',
          en: 'Same particle count, different total mass',
        },
        body: {
          zh: '1 mol H₂O 约 18 g，1 mol O₂ 约 32 g，1 mol Fe 约 56 g。每一份都含 6.022×10²³ 个指定粒子，但每个粒子“单体重”不同。',
          en: '1 mol H₂O is about 18 g, 1 mol O₂ about 32 g and 1 mol Fe about 56 g. Each package has 6.022×10²³ specified particles, but each particle has a different individual mass.',
        },
      },
      {
        title: {
          zh: '用公式翻译两种语言',
          en: 'Use a formula to translate between two languages',
        },
        body: {
          zh: 'n = m ÷ M：物质的量 n（mol）等于质量 m（g）除以摩尔质量 M（g/mol）。先写单位，再代数字；单位会帮助你发现有没有除反。',
          en: 'n = m ÷ M: amount n (mol) equals mass m (g) divided by molar mass M (g/mol). Write units first, then numbers; units help catch a reversed division.',
        },
      },
    ],
    misconception: {
      zh: '“元素周期表上的相对原子质量就是一粒原子的克数”不对。它是相对尺度；巧妙的是，数值上它对应了该元素 1 mol 原子的 g/mol 摩尔质量。',
      en: '“An element’s relative atomic mass is the gram mass of one atom” is wrong. It is a relative scale; usefully, its numerical value corresponds to the g/mol molar mass of 1 mol of that element’s atoms.',
    },
    mission: {
      zh: '质量估计挑战：比较一小盒米和一小盒棉花，猜猜哪盒更重、为什么。把结论迁移到摩尔：数量相同的“包”为什么仍可能有不同质量？不需要称量或打开任何化学品。',
      en: 'Mass-estimate challenge: compare a small box of rice and one of cotton. Guess which is heavier and why. Transfer this to moles: why can equal-size count packages have different masses? No weighing or chemical handling is needed.',
    },
    vocabulary: [
      { en: 'molar mass', zh: '摩尔质量' },
      { en: 'gram per mole (g/mol)', zh: '克每摩尔（g/mol）' },
      { en: 'relative atomic mass', zh: '相对原子质量' },
      { en: 'amount of substance (n)', zh: '物质的量（n）' },
    ],
    interactive: 'molar-mass-lab',
    questions: [
      {
        id: 'molar-mass-q1',
        prompt: {
          zh: 'H₂O 的摩尔质量约为多少？（H≈1，O≈16）',
          en: 'What is the approximate molar mass of H₂O? (H≈1, O≈16)',
        },
        options: [
          { zh: '18 g/mol', en: '18 g/mol' },
          { zh: '16 g/mol', en: '16 g/mol' },
          { zh: '2 g/mol', en: '2 g/mol' },
        ],
        answer: 0,
        explanation: {
          zh: 'H₂O 有两个 H 和一个 O：2×1 + 16 = 18 g/mol。',
          en: 'H₂O has two H and one O: 2×1 + 16 = 18 g/mol.',
        },
      },
      {
        id: 'molar-mass-q2',
        prompt: { zh: '哪一个说法正确？', en: 'Which statement is correct?' },
        options: [
          {
            zh: '1 mol H₂O 与 1 mol Fe 有同样粒子数，但质量不同',
            en: '1 mol H₂O and 1 mol Fe have the same particle count but different masses',
          },
          {
            zh: '更重的物质 1 mol 粒子数更多',
            en: 'A heavier substance has more particles in 1 mol',
          },
          { zh: '摩尔质量不需要单位', en: 'Molar mass needs no unit' },
        ],
        answer: 0,
        explanation: {
          zh: 'mol 固定粒子数；g/mol 表示每一摩尔的质量。不同粒子的质量不同。',
          en: 'mol fixes particle count; g/mol tells mass per mole. Different particles have different masses.',
        },
      },
      {
        id: 'molar-mass-q3',
        prompt: {
          zh: '18 g 水（M=18 g/mol）是多少 mol？',
          en: 'How many mol are 18 g of water (M=18 g/mol)?',
        },
        options: [
          { zh: '1 mol', en: '1 mol' },
          { zh: '18 mol', en: '18 mol' },
          { zh: '0 mol', en: '0 mol' },
        ],
        answer: 0,
        explanation: {
          zh: 'n=m÷M=18 g÷18 g/mol=1 mol。单位 g 会约掉，留下 mol。',
          en: 'n=m÷M=18 g÷18 g/mol=1 mol. The g units cancel, leaving mol.',
        },
      },
      {
        id: 'molar-mass-q4',
        prompt: {
          zh: '为什么写单位能帮助使用 n=m÷M？',
          en: 'Why do units help when using n=m÷M?',
        },
        options: [
          {
            zh: '它们显示 g ÷ (g/mol) 会得到 mol，能检查运算方向',
            en: 'They show g ÷ (g/mol) gives mol, checking the operation direction',
          },
          { zh: '单位会让原子变重', en: 'Units make atoms heavier' },
          { zh: '单位只装饰答案', en: 'Units only decorate an answer' },
        ],
        answer: 0,
        explanation: {
          zh: '单位是计算的一部分。g ÷ (g/mol) 的确留下 mol；若单位不对，计算思路可能也不对。',
          en: 'Units are part of the calculation. g ÷ (g/mol) indeed leaves mol; wrong units can reveal wrong reasoning.',
        },
      },
    ],
  },
  {
    id: 'equations-as-mole-recipes',
    levelId: 'moles',
    order: 50,
    title: {
      zh: '化学计量：方程式是一张摩尔配方',
      en: 'Stoichiometry: an equation is a mole recipe',
    },
    eyebrow: {
      zh: '第 50 课 · 不只配平，还要读懂比例',
      en: 'Lesson 50 · Do not just balance—read the ratio',
    },
    hook: {
      zh: '做松饼时，食谱写 2 杯面粉配 1 杯牛奶，并不是说只能做这一点；它告诉你一种比例。化学方程式的系数也在写“配方”，只是单位变成了摩尔。',
      en: 'A muffin recipe might use 2 cups of flour for 1 cup of milk. It does not limit you to one batch; it gives a ratio. Equation coefficients are also recipes, but the unit is moles.',
    },
    hookHint: {
      zh: '2H₂ + O₂ → 2H₂O 可读成：2 mol 氢气与 1 mol 氧气反应，形成 2 mol 水。系数可以整体放大或缩小，但比例 2:1:2 不变。',
      en: '2H₂ + O₂ → 2H₂O reads: 2 mol hydrogen reacts with 1 mol oxygen to form 2 mol water. Coefficients can scale up or down together, while the 2:1:2 ratio stays fixed.',
    },
    bigIdea: {
      zh: '配平化学方程式的系数给出摩尔比例；化学计量就是用这些固定比例，从已知的一种物质推算另一种。',
      en: 'Coefficients in a balanced equation give mole ratios; stoichiometry uses those fixed ratios to calculate one substance from another.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🧁',
        title: { zh: '食谱按比例放大', en: 'Scaling a recipe' },
        body: {
          zh: '两倍配方把每种原料都乘 2，比例保持不变；只加倍一种原料会留下多余材料。反应物也会有“限制者”和“过量者”。',
          en: 'Doubling a recipe doubles every ingredient while keeping ratios fixed; doubling just one leaves leftovers. Reactions can also have limiting and excess substances.',
        },
      },
      {
        icon: '💧',
        title: { zh: '水的比例故事', en: 'Water’s ratio story' },
        body: {
          zh: '形成水时，氢气和氧气不是随意相遇：摩尔比例是 2:1。若只有 1 mol H₂ 却有 1 mol O₂，氢气会先用完。',
          en: 'When water forms, hydrogen and oxygen do not combine arbitrarily: the mole ratio is 2:1. If there is 1 mol H₂ and 1 mol O₂, hydrogen runs out first.',
        },
      },
      {
        icon: '🏭',
        title: {
          zh: '工厂为什么精算投料',
          en: 'Why factories calculate inputs',
        },
        body: {
          zh: '工业生产会计算比例，减少浪费、降低成本，并让产品更稳定。安全和专业流程依然重要，比例计算并不是家庭实验许可。',
          en: 'Industry calculates ratios to reduce waste, cost and variation. Safety and professional processes still matter; ratio calculations are not permission for home experiments.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先确认方程式已配平',
          en: 'First confirm the equation is balanced',
        },
        body: {
          zh: '只有配平后的系数才能代表正确比例。2H₂ + O₂ → 2H₂O 两边的 H、O 原子都守恒，所以可以安全地读出 2:1:2。',
          en: 'Only balanced coefficients represent the correct ratio. In 2H₂ + O₂ → 2H₂O, H and O atoms are conserved on both sides, so 2:1:2 can be read safely.',
        },
      },
      {
        title: {
          zh: '系数是摩尔比例，不是克数比例',
          en: 'Coefficients are mole ratios, not gram ratios',
        },
        body: {
          zh: '2 mol H₂ 的质量约 4 g，1 mol O₂ 的质量约 32 g；摩尔比是 2:1，但质量不是 2:1。需要摩尔质量才能在 mol 和 g 之间翻译。',
          en: '2 mol H₂ has mass about 4 g and 1 mol O₂ about 32 g; the mole ratio is 2:1, but the mass ratio is not 2:1. Molar mass translates between mol and g.',
        },
      },
      {
        title: {
          zh: '按比例问“需要多少”',
          en: 'Ask “how much is needed?” by ratio',
        },
        body: {
          zh: '若 2 mol H₂ 需要 1 mol O₂，那么 4 mol H₂ 需要 2 mol O₂；若有 3 mol H₂，则完全反应需 1.5 mol O₂。先在 mol 世界处理比例，再考虑质量。',
          en: 'If 2 mol H₂ needs 1 mol O₂, then 4 mol H₂ needs 2 mol O₂; 3 mol H₂ needs 1.5 mol O₂ for complete reaction. Work in mol ratios first, then consider mass.',
        },
      },
    ],
    misconception: {
      zh: '“2H₂ + O₂ 里的 2、1、2 就是克数比例”不对。它们是分子数或摩尔数比例；质量要乘上每种物质不同的摩尔质量。',
      en: '“The 2, 1, 2 in 2H₂ + O₂ are gram ratios” is wrong. They are molecule-count or mole ratios; masses require multiplying by each substance’s different molar mass.',
    },
    mission: {
      zh: '纸上配方挑战：画出 2:1 的果汁浓缩液与水“配方”示意，放大成 4:2、6:3。再对比 2H₂:O₂，解释为什么比例可以放大，但不能只改一边。只做纸笔推理。',
      en: 'Paper recipe challenge: draw a 2:1 juice-concentrate-to-water recipe, then scale it to 4:2 and 6:3. Compare with 2H₂:O₂ and explain why a ratio may scale but not change only one side. Use paper only.',
    },
    vocabulary: [
      { en: 'stoichiometry', zh: '化学计量' },
      { en: 'mole ratio', zh: '摩尔比例' },
      { en: 'limiting reactant', zh: '限制反应物' },
      { en: 'excess reactant', zh: '过量反应物' },
    ],
    interactive: 'equation-balance-lab',
    questions: [
      {
        id: 'stoich-q1',
        prompt: {
          zh: '2H₂ + O₂ → 2H₂O 告诉我们的 H₂:O₂ 摩尔比例是什么？',
          en: 'What H₂:O₂ mole ratio does 2H₂ + O₂ → 2H₂O give?',
        },
        options: [
          { zh: '2:1', en: '2:1' },
          { zh: '1:2', en: '1:2' },
          { zh: '2:2', en: '2:2' },
        ],
        answer: 0,
        explanation: {
          zh: '系数直接给出摩尔比例：2 mol H₂ 配 1 mol O₂。',
          en: 'Coefficients directly give the mole ratio: 2 mol H₂ per 1 mol O₂.',
        },
      },
      {
        id: 'stoich-q2',
        prompt: {
          zh: '4 mol H₂ 完全反应需要多少 mol O₂？',
          en: 'How many mol O₂ are needed to react completely with 4 mol H₂?',
        },
        options: [
          { zh: '2 mol', en: '2 mol' },
          { zh: '4 mol', en: '4 mol' },
          { zh: '8 mol', en: '8 mol' },
        ],
        answer: 0,
        explanation: {
          zh: '比例 H₂:O₂ 是 2:1。把 2 mol H₂ 放大到 4 mol H₂，O₂ 也从 1 mol 放大到 2 mol。',
          en: 'The H₂:O₂ ratio is 2:1. Scaling H₂ from 2 to 4 mol scales O₂ from 1 to 2 mol.',
        },
      },
      {
        id: 'stoich-q3',
        prompt: {
          zh: '为什么方程式系数不能直接当作克数比例？',
          en: 'Why cannot coefficients be used directly as gram ratios?',
        },
        options: [
          {
            zh: '不同物质的摩尔质量不同',
            en: 'Different substances have different molar masses',
          },
          { zh: '克数不能用于化学', en: 'Grams cannot be used in chemistry' },
          { zh: '原子不守恒', en: 'Atoms are not conserved' },
        ],
        answer: 0,
        explanation: {
          zh: '系数先给 mol 比；把 mol 变成 g 时，每种物质要乘自己的 g/mol。',
          en: 'Coefficients give mol ratios first; converting mol to g requires each substance’s own g/mol.',
        },
      },
      {
        id: 'stoich-q4',
        prompt: {
          zh: '若有 1 mol H₂ 和 1 mol O₂，哪一种会先用完？',
          en: 'If you have 1 mol H₂ and 1 mol O₂, which runs out first?',
        },
        options: [
          { zh: 'H₂', en: 'H₂' },
          { zh: 'O₂', en: 'O₂' },
          {
            zh: '两者都一定刚好用完',
            en: 'Both must run out exactly together',
          },
        ],
        answer: 0,
        explanation: {
          zh: '每 1 mol O₂ 需要 2 mol H₂。这里只有 1 mol H₂，所以 H₂ 是限制反应物。',
          en: 'Each 1 mol O₂ needs 2 mol H₂. With only 1 mol H₂, H₂ is the limiting reactant.',
        },
      },
    ],
  },
] satisfies Lesson[];
