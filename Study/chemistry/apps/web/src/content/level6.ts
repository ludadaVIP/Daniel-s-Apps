import type { Lesson } from './lessons';

export const level6Lessons = [
  {
    id: 'reading-chemical-formulae',
    levelId: 'formulae',
    order: 31,
    title: {
      zh: '化学式：不是暗号，是粒子配方',
      en: 'Chemical formulae: particle recipes, not secret codes',
    },
    eyebrow: {
      zh: '第 31 课 · 看懂右下角的小数字',
      en: 'Lesson 31 · Decode the tiny numbers',
    },
    hook: {
      zh: 'H₂O 和 H₂O₂ 只差一个小小的“₂”，前者是每天喝的水，后者却是需要按说明使用的过氧化氢。一个右下角数字，为什么能改变整种物质？',
      en: 'H₂O and H₂O₂ differ by one tiny “₂”. One is everyday water; the other is hydrogen peroxide that must be used as directed. How can a subscript change the substance?',
    },
    hookHint: {
      zh: '化学式像精确配方：元素符号说明用了哪些原子，下标说明一个粒子或最简比例中各有多少；写在前面的系数则说明有多少整份配方。',
      en: 'A chemical formula is a precise recipe: symbols name the atoms, subscripts count them within one particle or simplest ratio, and a coefficient in front counts whole copies of the recipe.',
    },
    bigIdea: {
      zh: '元素符号确定种类，下标确定一份化学式中的原子数或比例，系数把整份化学式全部乘上；位置不同，意义完全不同。',
      en: 'Element symbols identify types, subscripts set atom counts or ratios within one formula unit, and coefficients multiply the entire formula; position changes meaning.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '💧',
        title: { zh: '水的 H₂O', en: 'H₂O in water' },
        body: {
          zh: '一个水分子含 2 个氢原子和 1 个氧原子。O 后没有下标，默认就是 1；数字 1 通常不写。',
          en: 'One water molecule contains two hydrogen atoms and one oxygen atom. No subscript after O means one; the number 1 is normally omitted.',
        },
      },
      {
        icon: '🥤',
        title: { zh: '汽水中的 CO₂', en: 'CO₂ in fizzy drinks' },
        body: {
          zh: '一个二氧化碳分子含 1 个碳和 2 个氧。打开瓶盖后，溶解的 CO₂ 形成气泡逸出。',
          en: 'One carbon dioxide molecule contains one carbon and two oxygen atoms. After opening a bottle, dissolved CO₂ escapes as bubbles.',
        },
      },
      {
        icon: '🧴',
        title: { zh: 'H₂O₂ 不是“另一种水”', en: 'H₂O₂ is not “another water”' },
        body: {
          zh: '过氧化氢的原子比例与水不同，因此性质也不同。家用产品也必须看浓度、标签和用途，绝不能因为“都含 H 和 O”就当作水。',
          en: 'Hydrogen peroxide has a different atom ratio and therefore different properties. Household products still require label and concentration care; sharing H and O does not make it water.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先按正确大小写读元素符号',
          en: 'First read element symbols with exact capitalisation',
        },
        body: {
          zh: '每个元素符号以大写字母开始，可能跟一个小写字母。Co 是钴，CO 是碳和氧；Na 是钠，不能写成 NA。大小写是化学语言的一部分。',
          en: 'Every element symbol begins with a capital and may have a lowercase letter. Co is cobalt, while CO contains carbon and oxygen; Na is sodium, not NA. Capitalisation is part of the language.',
        },
      },
      {
        title: {
          zh: '下标只管它左边的元素',
          en: 'A subscript counts the element immediately before it',
        },
        body: {
          zh: 'CO₂ 中的 ₂ 只把 O 数成 2，C 仍是 1。H₂O₂ 中 H 和 O 都各有下标 2。没有下标就按 1 计算。',
          en: 'In CO₂, the ₂ counts only O, while C remains one. In H₂O₂, both H and O have a subscript of two. No subscript means a count of one.',
        },
      },
      {
        title: {
          zh: '系数乘整份配方',
          en: 'A coefficient multiplies the whole recipe',
        },
        body: {
          zh: '2H₂O 表示两份水分子：氢原子共 2×2=4 个，氧原子共 2×1=2 个。改变系数只改变数量；改变下标通常会改变物质身份。',
          en: '2H₂O means two water molecules: 2×2=4 hydrogen atoms and 2×1=2 oxygen atoms in total. Changing a coefficient changes amount; changing a subscript usually changes substance identity.',
        },
      },
    ],
    misconception: {
      zh: '不能为了“配平”或让数字好看而随意改下标。H₂O 改成 H₂O₂ 就不再是水；配平反应时只能调整化学式前的系数，不能篡改物质的配方。',
      en: 'Never change subscripts just to make numbers balance. Turning H₂O into H₂O₂ changes water into another substance. When balancing reactions, adjust coefficients in front—not the substance recipe.',
    },
    mission: {
      zh: '做一次安全的“标签寻式”：在矿泉水、汽水、食盐或清洁用品标签上寻找三个化学式，逐个圈出元素符号和下标，并说出一份配方的原子数或最简比例。只阅读标签，不打开、混合或闻清洁用品。',
      en: 'Do a safe formula hunt on labels from mineral water, fizzy drinks, salt or cleaning products. Find three formulae, circle symbols and subscripts, then state atom counts or simplest ratios. Read only—do not open, mix or smell cleaners.',
    },
    vocabulary: [
      { en: 'chemical formula', zh: '化学式' },
      { en: 'element symbol', zh: '元素符号' },
      { en: 'subscript', zh: '下标' },
      { en: 'coefficient', zh: '系数' },
      { en: 'formula unit', zh: '化学式单位' },
    ],
    interactive: 'formula-decoder-lab',
    questions: [
      {
        id: 'formula-q1',
        prompt: {
          zh: '一个 H₂O 分子中共有多少个原子？',
          en: 'How many atoms are in one H₂O molecule altogether?',
        },
        options: [
          { zh: '2 个', en: '2' },
          { zh: '3 个', en: '3' },
          { zh: '4 个', en: '4' },
        ],
        answer: 1,
        explanation: {
          zh: 'H₂O 含 2 个 H 和 1 个 O，总数是 3；没有下标的 O 按 1 计算。',
          en: 'H₂O contains two H atoms and one O atom, making three in total; O without a subscript counts as one.',
        },
      },
      {
        id: 'formula-q2',
        prompt: {
          zh: '2CO₂ 一共表示多少个碳原子和氧原子？',
          en: 'How many carbon and oxygen atoms are represented by 2CO₂?',
        },
        options: [
          { zh: 'C：1，O：2', en: 'C: 1, O: 2' },
          { zh: 'C：2，O：2', en: 'C: 2, O: 2' },
          { zh: 'C：2，O：4', en: 'C: 2, O: 4' },
        ],
        answer: 2,
        explanation: {
          zh: '前面的 2 乘整份 CO₂：碳是 2×1=2，氧是 2×2=4。',
          en: 'The coefficient 2 multiplies the whole CO₂ formula: carbon is 2×1=2 and oxygen is 2×2=4.',
        },
      },
      {
        id: 'formula-q3',
        prompt: {
          zh: '为什么 H₂O 与 H₂O₂ 不是同一种物质？',
          en: 'Why are H₂O and H₂O₂ not the same substance?',
        },
        options: [
          {
            zh: '它们写在不同颜色的瓶子上',
            en: 'They are written on different coloured bottles',
          },
          {
            zh: '氧原子下标不同，粒子组成比例不同',
            en: 'The oxygen subscript differs, so the particle composition ratio differs',
          },
          {
            zh: '所有含氧物质都互不相同',
            en: 'Every oxygen-containing substance is different for that reason alone',
          },
        ],
        answer: 1,
        explanation: {
          zh: 'H₂O 的 H∶O 是 2∶1，H₂O₂ 是 2∶2（最简为 1∶1）；组成不同会形成不同粒子和性质。',
          en: 'H₂O has H:O = 2:1, while H₂O₂ has 2:2 (simplest 1:1). Different composition creates different particles and properties.',
        },
      },
      {
        id: 'formula-q4',
        prompt: {
          zh: 'NaCl 中没有下标，最合理的意思是什么？',
          en: 'NaCl has no written subscripts. What does that mean?',
        },
        options: [
          {
            zh: 'Na⁺ 与 Cl⁻ 的最简比例是 1∶1',
            en: 'The simplest Na⁺:Cl⁻ ratio is 1:1',
          },
          { zh: '其中没有钠或氯', en: 'It contains no sodium or chlorine' },
          {
            zh: '每种元素都有无限多个且无法比较',
            en: 'Each element has infinitely many with no ratio',
          },
        ],
        answer: 0,
        explanation: {
          zh: '没有下标就按 1；对离子固体 NaCl，这表示晶格中 Na⁺ 与 Cl⁻ 的最简数量比为 1∶1。',
          en: 'No subscript means one. For ionic NaCl, it gives the simplest number ratio of Na⁺ to Cl⁻ in the lattice: 1:1.',
        },
      },
    ],
  },
  {
    id: 'ionic-formula-charge-balance',
    levelId: 'formulae',
    order: 32,
    title: {
      zh: '离子化合物的化学式：让电荷刚好归零',
      en: 'Ionic formulae: make the charge add to zero',
    },
    eyebrow: {
      zh: '第 32 课 · 用电荷推理，不背交叉口诀',
      en: 'Lesson 32 · Reason with charge, not a crossing trick',
    },
    hook: {
      zh: '食盐是 NaCl，氯化镁却是 MgCl₂。它们都有氯离子，为什么镁旁边会“带来”两个氯？',
      en: 'Table salt is NaCl, but magnesium chloride is MgCl₂. Both contain chloride ions—so why does magnesium need two of them?',
    },
    hookHint: {
      zh: '把正负电荷想成一笔必须结清的账：一份 Mg²⁺ 带 +2，需要两份各带 −1 的 Cl⁻，总电荷才会回到 0。',
      en: 'Treat charge like an account that must balance: one Mg²⁺ brings +2, so it needs two Cl⁻ ions at −1 each to return the total to zero.',
    },
    bigIdea: {
      zh: '离子化合物整体不带电；化学式写出能让总正电荷与总负电荷抵消的最简整数比。',
      en: 'An ionic compound is neutral overall; its formula shows the smallest whole-number ratio that cancels total positive and negative charge.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: '餐桌上的 NaCl', en: 'NaCl on the table' },
        body: {
          zh: 'Na⁺ 带 +1，Cl⁻ 带 −1，一对就能归零，所以最简比例是 1∶1，写成 NaCl。',
          en: 'Na⁺ is +1 and Cl⁻ is −1. One of each balances, so the simplest 1:1 ratio is written NaCl.',
        },
      },
      {
        icon: '🌊',
        title: { zh: '海水里的 MgCl₂', en: 'MgCl₂ in seawater' },
        body: {
          zh: '海水中含有镁离子和氯离子。Mg²⁺ 的 +2 需要两个 Cl⁻ 的 −2 来抵消，因此比例是 1∶2。',
          en: 'Seawater contains magnesium and chloride ions. The +2 on Mg²⁺ needs −2 from two Cl⁻ ions, giving a 1:2 ratio.',
        },
      },
      {
        icon: '🥫',
        title: { zh: '铝表面的 Al₂O₃', en: 'Al₂O₃ on aluminium' },
        body: {
          zh: '铝表面会形成很薄的氧化铝保护层。2 个 Al³⁺ 给出 +6，3 个 O²⁻ 给出 −6，刚好抵消。',
          en: 'Aluminium forms a thin protective aluminium oxide layer. Two Al³⁺ ions give +6 and three O²⁻ ions give −6—an exact balance.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先写清楚每种离子的电荷',
          en: 'Start by writing each ion charge',
        },
        body: {
          zh: '先认离子，再写化学式。例如镁离子是 Mg²⁺，氯离子是 Cl⁻。右上角的电荷决定需要多少个离子，不能和右下角的数量下标混为一谈。',
          en: 'Identify the ions before writing the formula. Magnesium is Mg²⁺ and chloride is Cl⁻. Superscript charges determine the needed ratio; they are not subscript counts.',
        },
      },
      {
        title: {
          zh: '寻找能让总电荷等于 0 的数量',
          en: 'Find counts that make total charge zero',
        },
        body: {
          zh: '把“离子个数 × 每个离子的电荷”分别算出。Mg²⁺ 与两个 Cl⁻ 的总和是 (+2)+2×(−1)=0，所以写 MgCl₂。',
          en: 'Calculate ion count × charge for each type. Mg²⁺ with two Cl⁻ gives (+2)+2×(−1)=0, so the formula is MgCl₂.',
        },
      },
      {
        title: {
          zh: '最后化成最简整数比',
          en: 'Finish with the simplest whole-number ratio',
        },
        body: {
          zh: 'Ca²⁺ 与 O²⁻ 一对已经归零，所以写 CaO，而不是 Ca₂O₂。化学式中的下标 1 不写；如果所有数量还能同时约分，就继续约分。',
          en: 'One Ca²⁺ and one O²⁻ already balance, so write CaO—not Ca₂O₂. Subscript 1 is omitted, and any common factor must be reduced.',
        },
      },
    ],
    misconception: {
      zh: '“把电荷数字交叉写到右下角”只能当作快速记录法，不能代替理解，而且结果仍要约分。真正可靠的检查只有两项：总电荷是否为 0？离子数量比是否已经最简？',
      en: '“Crossing the charge numbers down” is only shorthand, not an explanation, and the result may still need reducing. The reliable checks are: does total charge equal zero, and is the ion ratio simplest?',
    },
    mission: {
      zh: '做一次安全的“配方验算”：在食盐、矿泉水或食品包装上找 NaCl、CaCl₂、MgCl₂ 等离子化合物；查出离子电荷，用“个数×电荷”验证总和为 0。只读标签，不品尝或混合未知物质。',
      en: 'Try a safe formula audit: find ionic formulae such as NaCl, CaCl₂ or MgCl₂ on salt, mineral-water or food labels. Look up the ion charges and verify count × charge totals zero. Read only; never taste or mix unknown materials.',
    },
    vocabulary: [
      { en: 'cation', zh: '阳离子' },
      { en: 'anion', zh: '阴离子' },
      { en: 'charge balance', zh: '电荷平衡' },
      { en: 'electrically neutral', zh: '电中性' },
      { en: 'simplest ratio', zh: '最简整数比' },
    ],
    interactive: 'ionic-formula-balance-lab',
    questions: [
      {
        id: 'ionic-formula-q1',
        prompt: {
          zh: 'Mg²⁺ 与 Cl⁻ 形成的化学式是什么？',
          en: 'What formula is formed from Mg²⁺ and Cl⁻?',
        },
        options: [
          { zh: 'MgCl', en: 'MgCl' },
          { zh: 'MgCl₂', en: 'MgCl₂' },
          { zh: 'Mg₂Cl', en: 'Mg₂Cl' },
        ],
        answer: 1,
        explanation: {
          zh: '1 个 Mg²⁺ 是 +2，需要 2 个 Cl⁻ 共 −2 才能归零；最简比例为 1∶2，所以写 MgCl₂。',
          en: 'One Mg²⁺ contributes +2 and needs two Cl⁻ ions totalling −2. The simplest 1:2 ratio gives MgCl₂.',
        },
      },
      {
        id: 'ionic-formula-q2',
        prompt: {
          zh: 'Al³⁺ 与 O²⁻ 至少各需要几个才能电荷平衡？',
          en: 'What is the smallest balanced count of Al³⁺ and O²⁻ ions?',
        },
        options: [
          { zh: '1 个 Al³⁺，1 个 O²⁻', en: '1 Al³⁺ and 1 O²⁻' },
          { zh: '2 个 Al³⁺，3 个 O²⁻', en: '2 Al³⁺ and 3 O²⁻' },
          { zh: '3 个 Al³⁺，2 个 O²⁻', en: '3 Al³⁺ and 2 O²⁻' },
        ],
        answer: 1,
        explanation: {
          zh: '2×(+3)=+6，3×(−2)=−6；相加为 0，因此化学式是 Al₂O₃。',
          en: '2×(+3)=+6 and 3×(−2)=−6. They sum to zero, giving Al₂O₃.',
        },
      },
      {
        id: 'ionic-formula-q3',
        prompt: {
          zh: '为什么 Ca²⁺ 与 O²⁻ 写成 CaO，而不是 Ca₂O₂？',
          en: 'Why are Ca²⁺ and O²⁻ written CaO rather than Ca₂O₂?',
        },
        options: [
          {
            zh: '一对离子已经归零，而且 1∶1 是最简比',
            en: 'One pair already balances and 1:1 is the simplest ratio',
          },
          { zh: '氧离子没有电荷', en: 'The oxide ion has no charge' },
          {
            zh: '化学式不能出现数字 2',
            en: 'A formula cannot contain the number 2',
          },
        ],
        answer: 0,
        explanation: {
          zh: '(+2)+(−2)=0，数量比 1∶1 已经最简；下标 1 省略，所以是 CaO。',
          en: '(+2)+(−2)=0 and 1:1 is already simplest. Subscript 1 is omitted, so the formula is CaO.',
        },
      },
      {
        id: 'ionic-formula-q4',
        prompt: {
          zh: '检查一个离子化合物化学式时，最重要的两件事是什么？',
          en: 'What two checks matter most for an ionic formula?',
        },
        options: [
          {
            zh: '字母是否好看、数字是否一样大',
            en: 'Whether the letters look neat and the numbers match',
          },
          {
            zh: '总电荷是否为 0、数量比是否最简',
            en: 'Whether total charge is zero and the ratio is simplest',
          },
          {
            zh: '是否把所有电荷都写进最终化学式',
            en: 'Whether every charge is written in the final formula',
          },
        ],
        answer: 1,
        explanation: {
          zh: '离子化合物整体必须电中性，并用最简整数比表示。离子电荷用于推理，最终化学式通常写元素符号与下标。',
          en: 'An ionic compound must be neutral overall and use the simplest whole-number ratio. Ion charges guide the reasoning; the final formula normally shows symbols and subscripts.',
        },
      },
    ],
  },
  {
    id: 'naming-binary-ionic-compounds',
    levelId: 'formulae',
    order: 33,
    title: {
      zh: '给离子化合物命名：把配方翻译成名字',
      en: 'Naming ionic compounds: translate a formula into words',
    },
    eyebrow: {
      zh: '第 33 课 · 看懂 NaCl 为什么叫氯化钠',
      en: 'Lesson 33 · Why NaCl is called sodium chloride',
    },
    hook: {
      zh: 'NaCl 的化学式先写 Na，中文却读“氯化钠”；英语又读 sodium chloride。两种语言顺序不同，背起来会乱，能不能用一套逻辑看懂？',
      en: 'Na comes first in NaCl, Chinese says “氯化钠”, and English says “sodium chloride”. The word orders differ—can one clear idea make both predictable?',
    },
    hookHint: {
      zh: '先把化学式拆成阳离子与阴离子：英语按“阳离子 + 改词尾的阴离子”来读；中文通常按“阴离子对应的某化 + 阳离子”来读。',
      en: 'Split the formula into cation and anion. English reads “cation + anion with an -ide ending”; Chinese usually reads the anion as “某化” before the cation.',
    },
    bigIdea: {
      zh: '二元离子化合物由阳离子和单原子阴离子组成；认出两种离子，再按语言规则排列，就能从化学式推出名称。',
      en: 'A binary ionic compound contains a cation and a monatomic anion; identify both ions, then apply the language’s naming order.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: 'NaCl：氯化钠', en: 'NaCl: sodium chloride' },
        body: {
          zh: '食盐包装上常见 NaCl。Na⁺ 是钠离子，Cl⁻ 是氯离子；英语把 chlorine 变成 chloride，中文组合成“氯化钠”。',
          en: 'NaCl appears on salt labels. Na⁺ is sodium and Cl⁻ is chloride; English changes chlorine to chloride, while Chinese combines them as 氯化钠.',
        },
      },
      {
        icon: '🔥',
        title: { zh: 'MgO：氧化镁', en: 'MgO: magnesium oxide' },
        body: {
          zh: '氧化镁耐高温，可用于耐火材料。O²⁻ 对应 oxide / 氧化，Mg²⁺ 对应 magnesium / 镁。',
          en: 'Magnesium oxide withstands high temperatures and is used in refractory materials. O²⁻ gives oxide and Mg²⁺ gives magnesium.',
        },
      },
      {
        icon: '💧',
        title: { zh: 'CaCl₂：氯化钙', en: 'CaCl₂: calcium chloride' },
        body: {
          zh: '一些吸湿盒和道路除冰剂含氯化钙。下标 2 保证电荷平衡，但名称仍是 calcium chloride，不读成 calcium dichloride。',
          en: 'Some moisture absorbers and road de-icers contain calcium chloride. The subscript 2 balances charge, but the name remains calcium chloride—not calcium dichloride.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先确认它是“金属 + 非金属”的离子化合物',
          en: 'First recognise a metal + non-metal ionic compound',
        },
        body: {
          zh: '在这一课的二元化合物里，化学式左边通常是形成阳离子的金属，右边是形成阴离子的非金属。例如 MgO 拆成 Mg²⁺ 与 O²⁻。',
          en: 'For the binary compounds in this lesson, the left symbol is usually a metal cation and the right symbol a non-metal anion. MgO splits into Mg²⁺ and O²⁻.',
        },
      },
      {
        title: {
          zh: '英语：金属原名 + 非金属改成 -ide',
          en: 'English: metal name + non-metal ending in -ide',
        },
        body: {
          zh: 'NaCl 是 sodium chloride，MgO 是 magnesium oxide。常见变化包括 chlorine→chloride、oxygen→oxide、sulfur→sulfide；它们是离子名称，不是随意缩写。',
          en: 'NaCl is sodium chloride and MgO is magnesium oxide. Common changes include chlorine→chloride, oxygen→oxide and sulfur→sulfide; these are ion names, not random abbreviations.',
        },
      },
      {
        title: {
          zh: '中文：先读阴离子对应的“某化”，再读金属',
          en: 'Chinese: read the anion’s “某化” form before the metal',
        },
        body: {
          zh: 'NaCl 写 Na 在前，中文名称却是“氯化钠”；Al₂O₃ 是“氧化铝”。化学式顺序没有改变，只是中文命名习惯与英语不同。',
          en: 'Na appears first in NaCl, but Chinese names it 氯化钠; Al₂O₃ is 氧化铝. The formula order stays the same—the Chinese naming convention differs from English.',
        },
      },
    ],
    misconception: {
      zh: '不要根据下标给简单离子化合物加“一、二、三”的前缀。CaCl₂ 不是 calcium dichloride，Al₂O₃ 也不是 dialuminium trioxide；这些下标来自电荷平衡，名称仍是 calcium chloride 和 aluminium oxide。',
      en: 'Do not turn ionic subscripts into mono-, di- or tri- prefixes. CaCl₂ is not calcium dichloride and Al₂O₃ is not dialuminium trioxide; the subscripts come from charge balance.',
    },
    mission: {
      zh: '做一次“家庭标签翻译”：在食盐、矿泉水、吸湿盒或防晒产品标签上找一个“金属 + 非金属”的二元化学式，圈出两种元素，再尝试写出中英文名称。吸湿剂和清洁产品只看标签，不触摸内容物。',
      en: 'Try a household label translation: find one binary metal + non-metal formula on salt, mineral water, a moisture absorber or sunscreen. Circle both elements and write its Chinese and English names. Read product labels only; do not touch moisture-absorber or cleaner contents.',
    },
    vocabulary: [
      { en: 'binary compound', zh: '二元化合物' },
      { en: 'chloride', zh: '氯化物 / 氯离子' },
      { en: 'oxide', zh: '氧化物 / 氧离子' },
      { en: 'sulfide', zh: '硫化物 / 硫离子' },
      { en: 'naming convention', zh: '命名规则' },
    ],
    interactive: 'ionic-naming-lab',
    questions: [
      {
        id: 'ionic-name-q1',
        prompt: {
          zh: 'MgO 的正确中英文名称是哪一组？',
          en: 'Which pair correctly names MgO?',
        },
        options: [
          { zh: '氧化镁 / magnesium oxide', en: 'magnesium oxide / 氧化镁' },
          { zh: '镁氧 / magnesium oxygen', en: 'magnesium oxygen / 镁氧' },
          {
            zh: '一氧化一镁 / monomagnesium oxide',
            en: 'monomagnesium oxide / 一氧化一镁',
          },
        ],
        answer: 0,
        explanation: {
          zh: 'Mg 是镁阳离子，名称保留 magnesium / 镁；O²⁻ 使用 oxide / 氧化，因此是 magnesium oxide / 氧化镁。',
          en: 'Mg is the magnesium cation and keeps its name; O²⁻ uses oxide. The result is magnesium oxide / 氧化镁.',
        },
      },
      {
        id: 'ionic-name-q2',
        prompt: {
          zh: '为什么 CaCl₂ 叫 calcium chloride，而不是 calcium dichloride？',
          en: 'Why is CaCl₂ called calcium chloride rather than calcium dichloride?',
        },
        options: [
          {
            zh: '离子化合物的下标由电荷平衡决定，简单命名不使用 di- 前缀',
            en: 'Its subscript follows charge balance; simple ionic naming does not use the di- prefix',
          },
          {
            zh: '因为下标 2 没有意义',
            en: 'Because the subscript 2 has no meaning',
          },
          { zh: '因为钙不是元素', en: 'Because calcium is not an element' },
        ],
        answer: 0,
        explanation: {
          zh: '两个 Cl⁻ 用来平衡一个 Ca²⁺。离子名称已经说明离子种类，比例由化学式和电荷决定，不靠 di- 表示。',
          en: 'Two Cl⁻ ions balance one Ca²⁺. The ionic name identifies the ions; charge and the formula give the ratio, not a di- prefix.',
        },
      },
      {
        id: 'ionic-name-q3',
        prompt: {
          zh: 'Al₂O₃ 的中文名称是什么？',
          en: 'What is the Chinese name of Al₂O₃?',
        },
        options: [
          { zh: '铝化氧', en: '铝化氧' },
          { zh: '氧化铝', en: '氧化铝' },
          { zh: '二铝三氧', en: '二铝三氧' },
        ],
        answer: 1,
        explanation: {
          zh: '中文先读氧离子对应的“氧化”，再读金属“铝”，所以是氧化铝；下标不直接读进名称。',
          en: 'Chinese places 氧化, the oxide form, before the metal 铝. Subscripts are not read directly into this ionic name.',
        },
      },
      {
        id: 'ionic-name-q4',
        prompt: {
          zh: '把元素 chlorine 变成二元离子化合物名称时，英语通常使用哪个词？',
          en: 'Which English word is normally used for chlorine in a binary ionic compound name?',
        },
        options: [
          { zh: 'chlorine', en: 'chlorine' },
          { zh: 'chloride', en: 'chloride' },
          { zh: 'chlorination', en: 'chlorination' },
        ],
        answer: 1,
        explanation: {
          zh: '单原子阴离子 Cl⁻ 叫 chloride；在 sodium chloride、calcium chloride 等名称中都使用这个词。',
          en: 'The monatomic anion Cl⁻ is chloride, as in sodium chloride and calcium chloride.',
        },
      },
    ],
  },
  {
    id: 'variable-charge-metal-names',
    levelId: 'formulae',
    order: 34,
    title: {
      zh: '会变电荷的金属：名字里的罗马数字',
      en: 'Metals with changing charges: Roman numerals in names',
    },
    eyebrow: {
      zh: '第 34 课 · 从配方反推金属离子的电荷',
      en: 'Lesson 34 · Work backwards to the metal-ion charge',
    },
    hook: {
      zh: 'FeCl₂ 和 FeCl₃ 都由铁与氯组成，却是两种不同物质。英语名称为什么一个写 iron(II)，另一个写 iron(III)？括号里的数字在数什么？',
      en: 'FeCl₂ and FeCl₃ both contain iron and chlorine, yet they are different substances. Why is one iron(II) and the other iron(III)—what does the numeral count?',
    },
    hookHint: {
      zh: '罗马数字不是在数铁原子，而是在记录每个金属离子的电荷。利用“化合物总电荷为 0”，就能从阴离子反推出来。',
      en: 'The Roman numeral does not count iron atoms; it records the charge on each metal ion. Use the compound’s zero total charge to work it out from the anions.',
    },
    bigIdea: {
      zh: '当一种金属能形成不同电荷的离子时，英语名称用罗马数字标明金属离子的电荷；这个数字必须由电荷平衡推导。',
      en: 'When a metal can form ions with different charges, its English name uses a Roman numeral for the metal-ion charge, derived from charge balance.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🔩',
        title: { zh: '铁锈不只是“Fe₂O₃”', en: 'Rust is more than “Fe₂O₃”' },
        body: {
          zh: '红棕色氧化铁(III)与铁锈密切相关，但真实铁锈常是含水氧化物的混合物。Fe₂O₃ 中铁离子为 +3，因此叫 iron(III) oxide。',
          en: 'Red-brown iron(III) oxide is closely related to rust, although real rust is often a mixture of hydrated oxides. Iron is +3 in Fe₂O₃.',
        },
      },
      {
        icon: '💊',
        title: {
          zh: '补铁标签上的 iron(II)',
          en: 'Iron(II) on supplement labels',
        },
        body: {
          zh: '一些补铁产品含 iron(II) salts，也会写 ferrous salts。名称中的 (II) 说明铁离子是 Fe²⁺，不是说明一份里有两个铁。药品只能按医嘱或标签使用。',
          en: 'Some iron supplements contain iron(II), or ferrous, salts. (II) means Fe²⁺—not two iron atoms. Medicines must only be used as directed.',
        },
      },
      {
        icon: '🎨',
        title: { zh: '铜的两种氧化物', en: 'Two copper oxides' },
        body: {
          zh: 'Cu₂O 常呈红色，CuO 常呈黑色。同样是铜和氧，铜离子电荷不同，粒子比例、颜色和性质也会改变。',
          en: 'Cu₂O is commonly red, while CuO is commonly black. Different copper-ion charges change the particle ratio, colour and properties.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先算所有阴离子的总负电荷',
          en: 'First total the negative charge',
        },
        body: {
          zh: 'FeCl₃ 中每个 Cl⁻ 是 −1，三个合计 −3。整个化合物必须电中性，所以所有铁离子合计必须提供 +3。',
          en: 'In FeCl₃, each Cl⁻ is −1, so three total −3. The neutral compound therefore needs +3 from all its iron ions.',
        },
      },
      {
        title: {
          zh: '再除以金属离子的个数',
          en: 'Then divide by the number of metal ions',
        },
        body: {
          zh: 'FeCl₃ 只有一个 Fe，所以每个 Fe 是 +3。Cu₂O 的一个 O²⁻ 给出 −2，由两个 Cu 平分 +2，因此每个 Cu 是 +1。',
          en: 'FeCl₃ has one Fe, so that Fe is +3. In Cu₂O, one O²⁻ gives −2; two Cu ions share the needed +2, so each Cu is +1.',
        },
      },
      {
        title: {
          zh: '把电荷写成罗马数字，不把下标照搬过去',
          en: 'Write the charge as a Roman numeral—not the subscript',
        },
        body: {
          zh: 'FeCl₂ 是 iron(II) chloride，FeCl₃ 是 iron(III) chloride。中文常用“氯化亚铁”表示 Fe²⁺，用“氯化铁”表示 Fe³⁺。',
          en: 'FeCl₂ is iron(II) chloride and FeCl₃ is iron(III) chloride. Chinese commonly uses 氯化亚铁 for Fe²⁺ and 氯化铁 for Fe³⁺.',
        },
      },
    ],
    misconception: {
      zh: 'iron(III) 中的 III 不表示“三个铁”，也不是直接抄化学式下标。Cu₂O 有两个 Cu，但名称是 copper(I) oxide，因为每个 Cu 离子只带 +1；一定要先算总电荷再平均。',
      en: 'III in iron(III) does not mean “three iron atoms”, nor is it copied from a subscript. Cu₂O has two Cu atoms but is copper(I) oxide because each Cu ion is +1.',
    },
    mission: {
      zh: '做一次“罗马数字侦探”：在补铁产品、陶瓷颜料或矿物资料的标签上寻找 iron(II)、iron(III)、copper(I) 或 copper(II)。只记录名称与化学式，再用电荷平衡验证括号里的数字；药品和化学品只看标签，不打开或服用。',
      en: 'Be a Roman-numeral detective: look for iron(II), iron(III), copper(I) or copper(II) on supplement, ceramic-pigment or mineral information. Record the name and formula, then verify the numeral by charge balance. Read labels only; do not open or take products.',
    },
    vocabulary: [
      { en: 'variable charge', zh: '可变电荷' },
      { en: 'Roman numeral', zh: '罗马数字' },
      { en: 'iron(II) / ferrous', zh: '亚铁 / 铁(II)' },
      { en: 'iron(III) / ferric', zh: '铁(III)' },
      { en: 'charge per ion', zh: '每个离子的电荷' },
    ],
    interactive: 'roman-charge-detective-lab',
    questions: [
      {
        id: 'roman-charge-q1',
        prompt: {
          zh: 'FeCl₃ 中每个铁离子的电荷是多少？',
          en: 'What is the charge on each iron ion in FeCl₃?',
        },
        options: [
          { zh: '+1', en: '+1' },
          { zh: '+2', en: '+2' },
          { zh: '+3', en: '+3' },
        ],
        answer: 2,
        explanation: {
          zh: '三个 Cl⁻ 合计 −3；一个 Fe 必须提供 +3 才能归零，所以名称是 iron(III) chloride。',
          en: 'Three Cl⁻ ions total −3, so one Fe must supply +3. The name is iron(III) chloride.',
        },
      },
      {
        id: 'roman-charge-q2',
        prompt: {
          zh: 'Cu₂O 中每个铜离子的电荷是多少？',
          en: 'What is the charge on each copper ion in Cu₂O?',
        },
        options: [
          { zh: '+1', en: '+1' },
          { zh: '+2', en: '+2' },
          { zh: '+3', en: '+3' },
        ],
        answer: 0,
        explanation: {
          zh: '一个 O²⁻ 是 −2，两个 Cu 合计必须为 +2；平均到每个 Cu 是 +1，因此是 copper(I) oxide。',
          en: 'One O²⁻ is −2, so two Cu ions must total +2. Each Cu is +1, making copper(I) oxide.',
        },
      },
      {
        id: 'roman-charge-q3',
        prompt: {
          zh: '名称 iron(III) oxide 中的 III 表示什么？',
          en: 'What does III mean in iron(III) oxide?',
        },
        options: [
          { zh: '每个铁离子带 +3 电荷', en: 'Each iron ion has a +3 charge' },
          { zh: '有三个铁原子', en: 'There are three iron atoms' },
          { zh: '氧离子带 −3 电荷', en: 'The oxide ion has a −3 charge' },
        ],
        answer: 0,
        explanation: {
          zh: '罗马数字写的是每个金属离子的正电荷。原子或离子数量要看化学式下标，不能看名称中的括号数字。',
          en: 'The Roman numeral gives the positive charge on each metal ion. Ion counts come from formula subscripts, not the numeral in the name.',
        },
      },
      {
        id: 'roman-charge-q4',
        prompt: {
          zh: 'FeO 的正确英语名称是什么？',
          en: 'What is the correct English name for FeO?',
        },
        options: [
          { zh: 'iron(I) oxide', en: 'iron(I) oxide' },
          { zh: 'iron(II) oxide', en: 'iron(II) oxide' },
          { zh: 'iron(III) oxide', en: 'iron(III) oxide' },
        ],
        answer: 1,
        explanation: {
          zh: 'O²⁻ 是 −2，所以一个 Fe 必须是 +2；因此名称写 iron(II) oxide，中文常称氧化亚铁。',
          en: 'O²⁻ is −2, so one Fe must be +2. The name is iron(II) oxide, commonly 氧化亚铁 in Chinese.',
        },
      },
    ],
  },
  {
    id: 'polyatomic-ions-parentheses',
    levelId: 'formulae',
    order: 35,
    title: {
      zh: '多原子离子：括号保护一整组原子',
      en: 'Polyatomic ions: parentheses protect the whole group',
    },
    eyebrow: {
      zh: '第 35 课 · 看懂 CaCO₃ 与 Mg(OH)₂',
      en: 'Lesson 35 · Decode CaCO₃ and Mg(OH)₂',
    },
    hook: {
      zh: 'MgO 里 O 是一个离子，但 Mg(OH)₂ 里的 OH 为什么要被括号“抱住”？括号外的小 2 到底乘了谁？',
      en: 'O is one ion in MgO, but why is OH “hugged” by parentheses in Mg(OH)₂? What exactly does the outside 2 multiply?',
    },
    hookHint: {
      zh: 'OH⁻、CO₃²⁻、SO₄²⁻、NH₄⁺ 都是由多个原子组成、却作为一个带电整体行动的离子。括号就像保护套，提醒下标要乘整组。',
      en: 'OH⁻, CO₃²⁻, SO₄²⁻ and NH₄⁺ contain several atoms but act as one charged unit. Parentheses are a wrapper showing that an outside subscript multiplies the whole group.',
    },
    bigIdea: {
      zh: '多原子离子在化学式中要保持完整；需要两组或更多时，用括号围住整组，再把组数写在括号外。',
      en: 'A polyatomic ion stays intact in a formula; when more than one group is needed, wrap it in parentheses and put the group count outside.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🥚',
        title: { zh: '蛋壳与粉笔的 CaCO₃', en: 'CaCO₃ in eggshells and chalk' },
        body: {
          zh: '碳酸钙由 Ca²⁺ 与 CO₃²⁻ 以 1∶1 配对。只有一组 CO₃，所以不写括号，直接写 CaCO₃。',
          en: 'Calcium carbonate pairs Ca²⁺ with CO₃²⁻ in a 1:1 ratio. Only one carbonate group is needed, so CaCO₃ needs no parentheses.',
        },
      },
      {
        icon: '🧴',
        title: { zh: '抗酸剂中的 Mg(OH)₂', en: 'Mg(OH)₂ in antacids' },
        body: {
          zh: '一些抗酸剂含氢氧化镁。Mg²⁺ 需要两组 OH⁻，所以写 Mg(OH)₂；药品只能按标签或医嘱使用。',
          en: 'Some antacids contain magnesium hydroxide. Mg²⁺ needs two OH⁻ groups, giving Mg(OH)₂. Medicines must only be used as directed.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '净水过程中的 Al₂(SO₄)₃',
          en: 'Al₂(SO₄)₃ in water treatment',
        },
        body: {
          zh: '硫酸铝可帮助细小杂质聚集，便于后续去除。三组 SO₄²⁻ 必须整体计数，因此括号外写 3。',
          en: 'Aluminium sulfate can help tiny impurities clump together for removal. Three SO₄²⁻ groups are counted as whole units, so 3 sits outside the parentheses.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先把熟悉的原子团当作一个离子',
          en: 'First treat a familiar atom group as one ion',
        },
        body: {
          zh: 'OH⁻ 是 hydroxide / 氢氧根，CO₃²⁻ 是 carbonate / 碳酸根，SO₄²⁻ 是 sulfate / 硫酸根，NH₄⁺ 是 ammonium / 铵根。每一组都有固定组成和总电荷。',
          en: 'OH⁻ is hydroxide, CO₃²⁻ carbonate, SO₄²⁻ sulfate and NH₄⁺ ammonium. Each group has a fixed composition and one overall charge.',
        },
      },
      {
        title: {
          zh: '按“整组电荷”完成电荷平衡',
          en: 'Balance using the charge of the whole group',
        },
        body: {
          zh: 'Mg²⁺ 需要两组各为 −1 的 OH⁻。不要拆成单独的 O 和 H 去平衡；先得到“2 组 OH”，再考虑怎样写化学式。',
          en: 'Mg²⁺ needs two OH⁻ groups at −1 each. Do not split O from H while balancing; first find “two OH groups”, then write the formula.',
        },
      },
      {
        title: {
          zh: '一组不加括号，多组才加括号与下标',
          en: 'One group needs no parentheses; multiple groups do',
        },
        body: {
          zh: 'CaCO₃ 只有一组 CO₃，不写 Ca(CO₃)。Mg(OH)₂ 有两组 OH，必须写括号；括号外的 2 同时乘 O 和 H，所以共有 2 个 O 与 2 个 H。',
          en: 'CaCO₃ has one CO₃ group, so do not write Ca(CO₃). Mg(OH)₂ has two OH groups; the outside 2 multiplies both O and H, giving two O and two H atoms.',
        },
      },
    ],
    misconception: {
      zh: 'Mg(OH)₂ 不能写成 MgOH₂：后者的下标 2 只作用于 H，看起来只有一个 O，会破坏 OH 作为整体的含义。括号不是装饰，它明确规定下标的“作用范围”。',
      en: 'Mg(OH)₂ cannot be written MgOH₂: there, the 2 would apply only to H and show just one O. Parentheses are not decoration—they define the subscript’s scope.',
    },
    mission: {
      zh: '做一次“括号寻踪”：查看粉笔、抗酸剂、矿物补充剂或园艺用品标签，寻找 CO₃、OH、SO₄、NO₃、NH₄。记录它有没有括号，并解释是“一组”还是“多组”。药品与园艺用品只读标签，不打开、品尝或混合。',
      en: 'Try a parentheses hunt on chalk, antacid, mineral-supplement or garden-product labels. Look for CO₃, OH, SO₄, NO₃ or NH₄, note any parentheses, and explain whether there is one group or several. Read labels only; do not open, taste or mix products.',
    },
    vocabulary: [
      { en: 'polyatomic ion', zh: '多原子离子 / 原子团离子' },
      { en: 'hydroxide', zh: '氢氧根' },
      { en: 'carbonate', zh: '碳酸根' },
      { en: 'sulfate', zh: '硫酸根' },
      { en: 'parentheses', zh: '括号' },
    ],
    interactive: 'polyatomic-package-lab',
    questions: [
      {
        id: 'polyatomic-q1',
        prompt: {
          zh: 'Mg(OH)₂ 中一共有多少个 O 原子和 H 原子？',
          en: 'How many O and H atoms are in Mg(OH)₂?',
        },
        options: [
          { zh: 'O：1，H：2', en: 'O: 1, H: 2' },
          { zh: 'O：2，H：2', en: 'O: 2, H: 2' },
          { zh: 'O：2，H：1', en: 'O: 2, H: 1' },
        ],
        answer: 1,
        explanation: {
          zh: '括号外的 2 乘整组 OH，所以 O 与 H 都各有 2 个；Mg 没有下标，数量为 1。',
          en: 'The outside 2 multiplies the whole OH group, so there are two O and two H atoms. Mg without a subscript counts as one.',
        },
      },
      {
        id: 'polyatomic-q2',
        prompt: {
          zh: 'Al³⁺ 与 SO₄²⁻ 形成的正确化学式是什么？',
          en: 'What is the correct formula formed by Al³⁺ and SO₄²⁻?',
        },
        options: [
          { zh: 'AlSO₄', en: 'AlSO₄' },
          { zh: 'Al₂SO₄₃', en: 'Al₂SO₄₃' },
          { zh: 'Al₂(SO₄)₃', en: 'Al₂(SO₄)₃' },
        ],
        answer: 2,
        explanation: {
          zh: '2 个 Al³⁺ 共 +6，3 组 SO₄²⁻ 共 −6。因为有三组硫酸根，必须用括号写成 Al₂(SO₄)₃。',
          en: 'Two Al³⁺ ions total +6 and three SO₄²⁻ groups total −6. Three sulfate groups require parentheses: Al₂(SO₄)₃.',
        },
      },
      {
        id: 'polyatomic-q3',
        prompt: {
          zh: '什么时候需要在多原子离子外加括号？',
          en: 'When are parentheses needed around a polyatomic ion?',
        },
        options: [
          {
            zh: '化学式中需要两组或更多相同的多原子离子时',
            en: 'When the formula needs two or more copies of that polyatomic ion',
          },
          { zh: '每次出现氧原子时', en: 'Whenever oxygen appears' },
          {
            zh: '只要化学式超过两个字母',
            en: 'Whenever a formula has more than two letters',
          },
        ],
        answer: 0,
        explanation: {
          zh: '括号把多原子离子标成一个整体，让外部下标乘整组；只有一组时通常不用括号。',
          en: 'Parentheses mark the polyatomic ion as one unit for an outside subscript. A single group normally needs no parentheses.',
        },
      },
      {
        id: 'polyatomic-q4',
        prompt: {
          zh: 'Na₂CO₃ 中有几组 CO₃²⁻？为什么没有括号？',
          en: 'How many CO₃²⁻ groups are in Na₂CO₃, and why are there no parentheses?',
        },
        options: [
          {
            zh: '一组；只有一组时不需要括号',
            en: 'One group; a single group needs no parentheses',
          },
          {
            zh: '两组；括号永远可以省略',
            en: 'Two groups; parentheses are always optional',
          },
          {
            zh: '三组；下标 3 表示组数',
            en: 'Three groups; subscript 3 is the group count',
          },
        ],
        answer: 0,
        explanation: {
          zh: 'CO₃ 中的 3 只表示一组碳酸根内有 3 个 O；整组 CO₃ 没有外部下标，因此只有一组。',
          en: 'The 3 in CO₃ counts O atoms inside one carbonate group. CO₃ has no outside group subscript, so there is one group.',
        },
      },
    ],
  },
  {
    id: 'naming-molecular-compounds',
    levelId: 'formulae',
    order: 36,
    title: {
      zh: '分子化合物命名：前缀真的在数原子',
      en: 'Naming molecular compounds: prefixes really count atoms',
    },
    eyebrow: {
      zh: '第 36 课 · CO 与 CO₂ 不能叫成同一个名字',
      en: 'Lesson 36 · CO and CO₂ cannot share a name',
    },
    hook: {
      zh: 'CO 是危险的一氧化碳，CO₂ 是呼吸和汽水里常见的二氧化碳。它们都只有碳和氧，名称怎样把“一”和“二”的差别准确说出来？',
      en: 'CO is dangerous carbon monoxide; CO₂ is carbon dioxide from breathing and fizzy drinks. Both contain carbon and oxygen—how do their names preserve the difference between one and two?',
    },
    hookHint: {
      zh: '对由两种非金属形成的分子化合物，下标就是每个分子里的真实原子数，所以 mono-、di-、tri- 等前缀会直接参与命名。',
      en: 'For a molecular compound made from two non-metals, subscripts are actual atom counts in each molecule, so prefixes such as mono-, di- and tri- belong in the name.',
    },
    bigIdea: {
      zh: '二元分子化合物用数字前缀说明每种原子的数量；它与离子化合物靠电荷确定比例的命名规则不同。',
      en: 'Binary molecular compounds use number prefixes to state atom counts—a different system from ionic compounds whose ratios follow charge balance.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🚨',
        title: {
          zh: 'CO：一氧化碳警报器',
          en: 'CO: the carbon-monoxide alarm',
        },
        body: {
          zh: '燃料不完全燃烧可能产生无色无味、却有毒的 CO。名称中的 monoxide 表示每个分子只有 1 个氧；家中燃烧设备附近应按规定安装并维护 CO 警报器。',
          en: 'Incomplete combustion can produce colourless, odourless and poisonous CO. Monoxide means one oxygen atom per molecule. Fuel-burning homes should maintain CO alarms as directed.',
        },
      },
      {
        icon: '🥤',
        title: { zh: 'CO₂：汽水里的气泡', en: 'CO₂: bubbles in fizzy drinks' },
        body: {
          zh: 'carbon dioxide 的 di- 表示 2 个氧。开瓶后压强降低，溶解的 CO₂ 形成气泡逸出。',
          en: 'The di- in carbon dioxide means two oxygen atoms. When a bottle opens and pressure falls, dissolved CO₂ escapes as bubbles.',
        },
      },
      {
        icon: '🏙️',
        title: {
          zh: 'NO₂：交通污染的一部分',
          en: 'NO₂: part of traffic pollution',
        },
        body: {
          zh: 'nitrogen dioxide 是刺激性污染气体之一，可由高温燃烧过程产生。di- 说明每个分子含 2 个氧，而不是 2 个氮。',
          en: 'Nitrogen dioxide is an irritating pollutant that can form during high-temperature combustion. Di- counts two oxygen atoms, not two nitrogen atoms.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先确认两边通常都是非金属',
          en: 'First check that both elements are usually non-metals',
        },
        body: {
          zh: 'CO₂、NO₂、N₂O 都由非金属原子通过共价键组成分子。看到“金属 + 非金属”时，通常应回到离子化合物的命名法，不要急着套前缀。',
          en: 'CO₂, NO₂ and N₂O are molecules made from non-metal atoms with covalent bonds. A metal + non-metal formula normally uses ionic naming instead, without these prefixes.',
        },
      },
      {
        title: {
          zh: '按下标选择 mono-、di-、tri-、tetra-',
          en: 'Match subscripts to mono-, di-, tri- and tetra-',
        },
        body: {
          zh: '1、2、3、4 分别对应 mono-、di-、tri-、tetra-。第一个元素只有 1 个时通常省略 mono-；第二个元素即使只有 1 个，也保留 mono-，如 carbon monoxide。',
          en: 'Counts 1, 2, 3 and 4 map to mono-, di-, tri- and tetra-. Mono- is usually omitted for the first element but kept for the second, as in carbon monoxide.',
        },
      },
      {
        title: {
          zh: '第二个元素改成 -ide，并留意常见拼写',
          en: 'Change the second element to -ide and mind common spelling',
        },
        body: {
          zh: 'oxygen 变成 oxide，chlorine 变成 chloride。前缀与 oxide 相接时常缩写：mono + oxide 写 monoxide；中文则常按“一氧化碳、二氧化碳、二氧化氮”表达数量。',
          en: 'Oxygen becomes oxide and chlorine becomes chloride. Prefix spelling may contract: mono + oxide becomes monoxide. Chinese commonly counts directly, as in 一氧化碳 and 二氧化碳.',
        },
      },
    ],
    misconception: {
      zh: '不要把“分子命名前缀”套到离子化合物上。CO₂ 叫 carbon dioxide，因为一个分子确有 2 个 O；CaCl₂ 仍叫 calcium chloride，因为它的 1∶2 比例由电荷平衡决定，不叫 calcium dichloride。',
      en: 'Do not carry molecular prefixes into ionic names. CO₂ is carbon dioxide because each molecule has two O atoms; CaCl₂ remains calcium chloride because its 1:2 ratio comes from charge balance.',
    },
    mission: {
      zh: '做一次“空气名称巡查”：找到家里的 CO 警报器标签与汽水上的 CO₂ 标识，分别说出一氧化碳和二氧化碳的原子数差别。不要用点火、汽车尾气或密闭燃烧来测试；警报器只按说明书测试。',
      en: 'Try an air-name audit: find a CO-alarm label and a CO₂ mark on a fizzy drink, then explain their different atom counts. Never test with flames, exhaust or enclosed burning; test alarms only as instructed.',
    },
    vocabulary: [
      { en: 'molecular compound', zh: '分子化合物' },
      { en: 'prefix', zh: '前缀' },
      { en: 'mono-', zh: '一 / 单' },
      { en: 'di-', zh: '二' },
      { en: 'tri-', zh: '三' },
    ],
    interactive: 'molecular-prefix-lab',
    questions: [
      {
        id: 'molecular-name-q1',
        prompt: {
          zh: 'CO₂ 的正确英语名称是什么？',
          en: 'What is the correct English name for CO₂?',
        },
        options: [
          { zh: 'carbon monoxide', en: 'carbon monoxide' },
          { zh: 'carbon dioxide', en: 'carbon dioxide' },
          { zh: 'dicarbon oxide', en: 'dicarbon oxide' },
        ],
        answer: 1,
        explanation: {
          zh: '第一个元素 C 只有 1 个，省略 mono-；第二个元素有 2 个 O，使用 di- + oxide，得到 carbon dioxide。',
          en: 'One C omits mono- on the first element; two O atoms use di- + oxide, giving carbon dioxide.',
        },
      },
      {
        id: 'molecular-name-q2',
        prompt: {
          zh: 'N₂O 的名称 dinitrogen monoxide 告诉我们什么？',
          en: 'What does the name dinitrogen monoxide tell us about N₂O?',
        },
        options: [
          { zh: '2 个 N、1 个 O', en: '2 N atoms and 1 O atom' },
          { zh: '1 个 N、2 个 O', en: '1 N atom and 2 O atoms' },
          { zh: '2 个 N、没有 O', en: '2 N atoms and no O atoms' },
        ],
        answer: 0,
        explanation: {
          zh: 'di-nitrogen 表示 2 个 N；mono-oxide 表示 1 个 O，所以化学式是 N₂O。',
          en: 'Di-nitrogen means two N atoms and mono-oxide means one O atom, so the formula is N₂O.',
        },
      },
      {
        id: 'molecular-name-q3',
        prompt: {
          zh: '为什么 CO 叫 carbon monoxide，而不是 monocarbon monoxide？',
          en: 'Why is CO carbon monoxide rather than monocarbon monoxide?',
        },
        options: [
          {
            zh: '第一个元素只有一个时通常省略 mono-，第二个元素保留',
            en: 'Mono- is usually omitted for one atom of the first element but kept for the second',
          },
          { zh: 'C 没有原子数量', en: 'C has no atom count' },
          { zh: 'CO 是离子化合物', en: 'CO is an ionic compound' },
        ],
        answer: 0,
        explanation: {
          zh: 'CO 中 C 与 O 都各有 1 个；规则只是省略第一个元素的 mono-，并保留第二个元素的 monoxide。',
          en: 'CO has one C and one O. The convention omits mono- on the first element but keeps monoxide for the second.',
        },
      },
      {
        id: 'molecular-name-q4',
        prompt: {
          zh: '下面哪个名称正确使用了分子化合物前缀？',
          en: 'Which name correctly uses a molecular-compound prefix?',
        },
        options: [
          { zh: 'NaCl：sodium monochloride', en: 'NaCl: sodium monochloride' },
          { zh: 'CaCl₂：calcium dichloride', en: 'CaCl₂: calcium dichloride' },
          { zh: 'NO₂：nitrogen dioxide', en: 'NO₂: nitrogen dioxide' },
        ],
        answer: 2,
        explanation: {
          zh: 'N 与 O 都是非金属，NO₂ 是分子化合物，两个 O 用 dioxide。NaCl 与 CaCl₂ 是离子化合物，不使用这些前缀。',
          en: 'N and O are non-metals, so molecular NO₂ uses dioxide for two O atoms. Ionic NaCl and CaCl₂ do not use these prefixes.',
        },
      },
    ],
  },
] satisfies Lesson[];
