import type { Lesson } from './lessons';

export const level5Lessons = [
  {
    id: 'why-atoms-bond',
    levelId: 'bonding',
    order: 26,
    title: { zh: '为什么原子会连接？', en: 'Why atoms make bonds' },
    eyebrow: {
      zh: '第 26 课 · 从“满层”到材料',
      en: 'Lesson 26 · From full shells to materials',
    },
    hook: {
      zh: '厨房里的食盐会结晶，水滴能聚成一团，钻石却硬得能划玻璃。原子原本各自存在，为什么会排成这些完全不同的结构？',
      en: 'Table salt forms crystals, water gathers into drops and diamond can scratch glass. Why do atoms arrange into such different structures instead of always staying alone?',
    },
    hookHint: {
      zh: '原子并不是“想交朋友”。当粒子的排列让整个系统更稳定、能量更低时，原子之间可能形成化学键；最外层电子提供了重要线索。',
      en: 'Atoms do not “want friends”. A chemical bond can form when an arrangement is more stable and lower in energy; outer electrons offer an important clue.',
    },
    bigIdea: {
      zh: '化学键是粒子之间使整体更稳定的吸引或连接；电子转移或共享，能形成不同类型的键和材料。',
      en: 'A chemical bond is an attraction or connection that makes a set of particles more stable; electron transfer or sharing can create different bonds and materials.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: '食盐晶体', en: 'A salt crystal' },
        body: {
          zh: 'Na 原子转移一个电子给 Cl 原子后，Na⁺ 与 Cl⁻ 之间的静电吸引能把大量离子排成晶体。',
          en: 'After a sodium atom transfers one electron to chlorine, electrostatic attraction between Na⁺ and Cl⁻ can arrange huge numbers of ions into a crystal.',
        },
      },
      {
        icon: '💧',
        title: { zh: '水分子', en: 'A water molecule' },
        body: {
          zh: '氢与氧可以共享电子形成共价键；这先让一个 H₂O 分子成立，之后分子间还会彼此吸引。',
          en: 'Hydrogen and oxygen can share electrons in covalent bonds. That first creates one H₂O molecule; molecules can then attract one another too.',
        },
      },
      {
        icon: '💎',
        title: { zh: '钻石与石墨', en: 'Diamond and graphite' },
        body: {
          zh: '它们都主要由碳构成，却因原子连接方式不同而一个很硬、一个可用于铅笔芯。结构会改变性质。',
          en: 'Both are mainly carbon, yet their different atom connections make one very hard and the other useful in pencil cores. Structure changes properties.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先看最外层，而不是背“谁和谁”',
          en: 'Look at the outer layer before memorising pairs',
        },
        body: {
          zh: '第 1 族的钠最外层只有 1 个电子；第 17 族的氯通常还差 1 个。电子从 Na 转到 Cl 后，两者都得到更稳定的外层结构。',
          en: 'Group 1 sodium has one outer electron; Group 17 chlorine is commonly one short. When an electron moves from Na to Cl, both reach a more stable outer arrangement.',
        },
      },
      {
        title: {
          zh: '转移电子：先有离子，再有吸引',
          en: 'Transfer: ions first, then attraction',
        },
        body: {
          zh: '失去电子的 Na 变成带正电的 Na⁺；得到电子的 Cl 变成带负电的 Cl⁻。正负电荷相互吸引，这种吸引是离子键的核心模型。',
          en: 'Sodium losing an electron becomes positive Na⁺; chlorine gaining it becomes negative Cl⁻. Opposite charges attract—this is the core model of ionic bonding.',
        },
      },
      {
        title: {
          zh: '共享电子：不是“送走”，而是一起用',
          en: 'Sharing: not giving away, but using together',
        },
        body: {
          zh: '两个氢原子各贡献一个电子，可以共同使用这一对电子。共享电子把原子核与电子云联系起来，这就是共价键的入门模型。',
          en: 'Two hydrogen atoms can each contribute one electron and use the pair together. Shared electrons connect nuclei and electron clouds—an entry model for a covalent bond.',
        },
      },
    ],
    misconception: {
      zh: '“原子需要八个电子”只是初学时很有用的规律线索，不是放之四海皆准的机械命令。真正更深的原因和整体能量、量子结构有关；现在先用最外层电子来预测常见情况。',
      en: '“Atoms need eight electrons” is a useful beginner pattern, not a mechanical rule for every case. The deeper explanation involves overall energy and quantum structure; for now, use outer electrons to predict common cases.',
    },
    mission: {
      zh: '找三样物品：食盐、透明胶带或塑料瓶、铅笔芯。猜猜它们内部更像“离子排队”“原子共享”还是“很多分子靠在一起”；把你的理由写成一句话，不需要拆开或实验。',
      en: 'Find three items: table salt, clear tape or a plastic bottle, and a pencil. Guess whether each is more like “ions in a pattern”, “atoms sharing”, or “many molecules near each other”. Write one reason—no taking things apart or experimenting needed.',
    },
    vocabulary: [
      { en: 'chemical bond', zh: '化学键' },
      { en: 'ionic bond', zh: '离子键' },
      { en: 'covalent bond', zh: '共价键' },
      { en: 'electron transfer', zh: '电子转移' },
      { en: 'shared pair', zh: '共用电子对' },
    ],
    interactive: 'bond-choice-lab',
    questions: [
      {
        id: 'bond-q1',
        prompt: {
          zh: 'Na 原子把一个电子转移给 Cl 原子后，最直接发生了什么？',
          en: 'After a sodium atom transfers one electron to chlorine, what happens most directly?',
        },
        options: [
          {
            zh: '形成 Na⁺ 和 Cl⁻，它们因异号电荷吸引',
            en: 'Na⁺ and Cl⁻ form and attract because their charges are opposite',
          },
          { zh: '两种原子核消失了', en: 'Both nuclei disappear' },
          { zh: '氯原子变成钠元素', en: 'Chlorine becomes the element sodium' },
        ],
        answer: 0,
        explanation: {
          zh: '电子数改变使离子带电，但质子数没有改变，所以元素身份不变；异号离子之间有静电吸引。',
          en: 'Changing electron number creates charged ions, but proton number stays the same, so element identity does not change. Opposite ions attract electrostatically.',
        },
      },
      {
        id: 'bond-q2',
        prompt: {
          zh: 'H₂ 中两个氢原子形成键时，最贴切的入门描述是什么？',
          en: 'When two hydrogen atoms form H₂, what is the best beginner description?',
        },
        options: [
          { zh: '它们共享一对电子', en: 'They share a pair of electrons' },
          {
            zh: '其中一个原子核送给另一个',
            en: 'One nucleus is given to the other',
          },
          { zh: '两个原子都失去全部电子', en: 'Both atoms lose all electrons' },
        ],
        answer: 0,
        explanation: {
          zh: 'H₂ 是共价键的经典入门例子：两个原子共同使用一对电子。',
          en: 'H₂ is a classic entry example of covalent bonding: the two atoms use one pair of electrons together.',
        },
      },
      {
        id: 'bond-q3',
        prompt: {
          zh: '为什么钻石和石墨能由相同元素碳组成却性质不同？',
          en: 'Why can diamond and graphite have different properties even though both are carbon?',
        },
        options: [
          {
            zh: '碳原子的连接与排列方式不同',
            en: 'Their carbon atoms are connected and arranged differently',
          },
          { zh: '其中一种完全没有原子', en: 'One contains no atoms at all' },
          {
            zh: '碳元素会随机变成别的元素',
            en: 'Carbon randomly changes into another element',
          },
        ],
        answer: 0,
        explanation: {
          zh: '组成相同不代表结构相同；原子连接和排列的方式会强烈影响材料性质。',
          en: 'The same composition does not guarantee the same structure. How atoms connect and arrange strongly affects a material’s properties.',
        },
      },
    ],
  },
  {
    id: 'ionic-bonding-lattice',
    levelId: 'bonding',
    order: 27,
    title: {
      zh: '离子键：盐为什么又硬又脆？',
      en: 'Ionic bonding: why is salt hard yet brittle?',
    },
    eyebrow: {
      zh: '第 27 课 · 推一下晶格看看',
      en: 'Lesson 27 · Give the lattice a push',
    },
    hook: {
      zh: '一粒盐能保持棱角，说明内部连接很牢；可用勺背一压，它又会碎裂。为什么“牢固”和“容易碎”能同时出现？',
      en: 'A salt grain keeps sharp edges, suggesting strong internal forces—yet pressure from a spoon can crush it. How can “strong” and “easy to shatter” both be true?',
    },
    hookHint: {
      zh: '不要只盯着一个 Na⁺ 和一个 Cl⁻。固体食盐内部是大量正、负离子交替排列的三维晶格；推动一层，会改变相邻电荷的位置。',
      en: 'Do not focus on only one Na⁺ and one Cl⁻. Solid salt contains a three-dimensional lattice of alternating positive and negative ions. Shifting a layer changes which charges become neighbours.',
    },
    bigIdea: {
      zh: '离子固体由大量异号离子以强静电吸引组成晶格；晶格牢固，但错位时同号离子相斥，所以材料常常硬而脆。',
      en: 'Ionic solids are lattices held by strong electrostatic attraction between opposite ions; the lattice is strong, but when layers shift, like charges repel—so the material is often hard and brittle.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: '有棱角的盐粒', en: 'Angular salt grains' },
        body: {
          zh: '食盐不是一个个独立 NaCl 小分子堆起来，而是 Na⁺ 与 Cl⁻ 重复排列的巨大晶格；NaCl 表示最简离子比例为 1∶1。',
          en: 'Table salt is not a pile of separate NaCl molecules. It is a giant repeating lattice of Na⁺ and Cl⁻; NaCl gives the simplest ion ratio, 1:1.',
        },
      },
      {
        icon: '💧',
        title: { zh: '盐水能导电', en: 'Salt water conducts' },
        body: {
          zh: '盐溶于水后，离子能在溶液中移动并携带电荷；固态晶格中的离子被固定，不能自由移动。',
          en: 'When salt dissolves, ions can move through the solution and carry charge. In the solid lattice, ions are fixed and cannot move freely.',
        },
      },
      {
        icon: '🪨',
        title: { zh: '矿物与陶瓷', en: 'Minerals and ceramics' },
        body: {
          zh: '许多矿物和陶瓷含有离子结构，因此常有高熔点、耐磨却不容易弯曲的特点；真实材料也可能同时含多种键。',
          en: 'Many minerals and ceramics contain ionic structures, often giving high melting points and wear resistance but little ability to bend. Real materials may contain several bond types.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '一对离子不是整块盐',
          en: 'One ion pair is not the whole crystal',
        },
        body: {
          zh: '在食盐晶体里，每个 Na⁺ 周围会有多个 Cl⁻，每个 Cl⁻ 周围也有多个 Na⁺。吸引向四面八方延伸，形成巨大离子晶格，而不是独立的 NaCl 分子。',
          en: 'In a salt crystal, each Na⁺ is surrounded by several Cl⁻ ions and vice versa. Attraction extends in all directions to form a giant ionic lattice, not separate NaCl molecules.',
        },
      },
      {
        title: {
          zh: '为什么硬、熔点高',
          en: 'Why it is hard and has a high melting point',
        },
        body: {
          zh: '要让晶格中的离子大范围离开原位，需要克服许多强烈的正负电荷吸引。这需要较多能量，所以典型离子固体通常较硬、熔点较高。',
          en: 'Moving ions far from their lattice positions means overcoming many strong attractions between opposite charges. That takes substantial energy, so typical ionic solids are hard and have high melting points.',
        },
      },
      {
        title: { zh: '为什么一推就可能裂', en: 'Why a push can cause a crack' },
        body: {
          zh: '受力让某一层错位后，Na⁺ 可能对着 Na⁺、Cl⁻ 可能对着 Cl⁻。同号电荷强烈相斥，晶格会沿某个面裂开，而不是像金属那样容易弯曲。',
          en: 'If force shifts one layer, Na⁺ may line up with Na⁺ and Cl⁻ with Cl⁻. Strong repulsion between like charges can split the lattice along a plane instead of letting it bend like a metal.',
        },
      },
    ],
    misconception: {
      zh: 'NaCl 里的“1∶1”表示晶格中 Na⁺ 与 Cl⁻ 的最简数量比，不代表固体中藏着许多彼此独立的“NaCl 分子”。描述离子固体时，更准确的说法是“化学式单位”或“离子晶格”。',
      en: 'The “1:1” in NaCl gives the simplest number ratio of Na⁺ to Cl⁻ in the lattice. It does not mean the solid hides many separate “NaCl molecules”. For ionic solids, formula unit or ionic lattice is more accurate.',
    },
    mission: {
      zh: '在明亮处用放大镜观察少量食盐和白糖的晶粒，画下边缘形状并写一句推测。只观察，不品尝未知晶体，也不要自行用插座、电池或裸线测试导电性。',
      en: 'In good light, use a magnifier to observe a little table salt and sugar. Sketch their edges and write one prediction. Observe only—never taste unknown crystals or test conductivity with sockets, batteries or bare wires.',
    },
    vocabulary: [
      { en: 'ionic lattice', zh: '离子晶格' },
      { en: 'electrostatic attraction', zh: '静电吸引' },
      { en: 'brittle', zh: '脆的' },
      { en: 'mobile ion', zh: '可移动离子' },
      { en: 'formula unit', zh: '化学式单位' },
    ],
    interactive: 'ionic-lattice-lab',
    questions: [
      {
        id: 'ionic-lattice-q1',
        prompt: {
          zh: '为什么典型离子固体通常有较高熔点？',
          en: 'Why do typical ionic solids usually have high melting points?',
        },
        options: [
          {
            zh: '离子完全没有相互作用',
            en: 'Their ions do not interact at all',
          },
          {
            zh: '需要大量能量克服晶格中许多强静电吸引',
            en: 'Much energy is needed to overcome many strong electrostatic attractions in the lattice',
          },
          {
            zh: '所有离子都能在固体中自由游动',
            en: 'All ions move freely in the solid',
          },
        ],
        answer: 1,
        explanation: {
          zh: '离子晶格中正负离子的强吸引向各方向延伸，大范围拆开晶格需要较多能量。',
          en: 'Strong attraction between positive and negative ions extends throughout the lattice, so separating it widely requires substantial energy.',
        },
      },
      {
        id: 'ionic-lattice-q2',
        prompt: {
          zh: '推动离子晶格的一层后，材料为什么可能裂开？',
          en: 'Why may an ionic material crack after one lattice layer shifts?',
        },
        options: [
          {
            zh: '同号离子被排到相邻位置并相互排斥',
            en: 'Like-charged ions become neighbours and repel',
          },
          { zh: '质子全部变成电子', en: 'All protons turn into electrons' },
          { zh: '离子突然失去质量', en: 'The ions suddenly lose their mass' },
        ],
        answer: 0,
        explanation: {
          zh: '错位让同号电荷彼此靠近，排斥力会把晶格沿某个面推开，因此表现为脆裂。',
          en: 'A shift brings like charges close together. Their repulsion pushes the lattice apart along a plane, producing brittle fracture.',
        },
      },
      {
        id: 'ionic-lattice-q3',
        prompt: {
          zh: '哪一种情况最容易让食盐中的离子携带电流？',
          en: 'In which situation can the ions in salt most readily carry electric current?',
        },
        options: [
          {
            zh: '干燥固态晶体，离子固定在位置上',
            en: 'A dry solid crystal with ions fixed in place',
          },
          {
            zh: '盐粒放在绝缘盒中',
            en: 'Salt grains sitting in an insulating box',
          },
          {
            zh: '溶于水后，离子能够移动',
            en: 'Dissolved in water, where the ions can move',
          },
        ],
        answer: 2,
        explanation: {
          zh: '电流需要可移动的带电粒子。盐溶液中的离子可以移动；固态晶格中的离子通常被固定。',
          en: 'Electric current needs mobile charged particles. Ions can move in salt solution; in the solid lattice they are normally fixed.',
        },
      },
    ],
  },
  {
    id: 'covalent-bonding-sharing',
    levelId: 'bonding',
    order: 28,
    title: {
      zh: '共价键：共享电子的艺术',
      en: 'Covalent bonding: the art of sharing electrons',
    },
    eyebrow: {
      zh: '第 28 课 · 呼吸与水里的连接',
      en: 'Lesson 28 · Bonds in breathing and water',
    },
    hook: {
      zh: '你每次呼吸都吸入 O₂，每一口水都含 H₂O。氧原子既能和另一个氧连接，也能和氢连接——它们如何用同一套电子规则搭出不同分子？',
      en: 'Every breath brings in O₂ and every sip contains H₂O. Oxygen can connect to another oxygen or to hydrogen—how can one electron idea build such different molecules?',
    },
    hookHint: {
      zh: '非金属原子不一定要把电子彻底交出去。两个原子核可以共同吸引一对或多对电子；“共享区域”把原子连接起来。',
      en: 'Non-metal atoms do not have to give electrons away completely. Two nuclei can attract one or more electron pairs together; that shared region links the atoms.',
    },
    bigIdea: {
      zh: '共价键来自原子对电子对的共同吸引；共享几对电子以及原子的空间排列，共同决定分子的结构和性质。',
      en: 'A covalent bond comes from atoms attracting shared electron pairs; the number of shared pairs and their spatial arrangement help determine molecular structure and properties.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🫁',
        title: { zh: '呼吸中的 O₂', en: 'O₂ in every breath' },
        body: {
          zh: '两个氧原子共享两对电子，可用 O=O 表示双键。空气中的氧气分子会参与细胞释放食物能量的过程。',
          en: 'Two oxygen atoms share two electron pairs, shown as the double bond O=O. Oxygen molecules take part when cells release energy from food.',
        },
      },
      {
        icon: '💧',
        title: { zh: '弯曲的 H₂O', en: 'Bent H₂O' },
        body: {
          zh: '氧分别与两个氢共享一对电子。氧上的非键合电子对也占空间，使水分子不是一条直线；形状会影响水的许多性质。',
          en: 'Oxygen shares one pair with each hydrogen. Non-bonding pairs on oxygen also occupy space, so water is not linear; its shape affects many properties.',
        },
      },
      {
        icon: '🥤',
        title: { zh: '气泡里的 CO₂', en: 'CO₂ in fizzy drinks' },
        body: {
          zh: '一个碳与两个氧形成共价键，得到近似直线形 O=C=O。打开汽水时，溶解的 CO₂ 逸出形成气泡。',
          en: 'One carbon forms covalent bonds with two oxygens, giving approximately linear O=C=O. When a fizzy drink opens, dissolved CO₂ escapes as bubbles.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '共享不是“劈开一半”',
          en: 'Sharing is not cutting an electron in half',
        },
        body: {
          zh: '电子仍然是完整粒子。所谓共享，是电子云分布在两个原子核之间，两边都能吸引这对电子。路易斯点图用两个点或一条线表示一对共享电子。',
          en: 'Electrons remain whole particles. Sharing means electron density lies between two nuclei and both attract the pair. A Lewis diagram uses two dots or one line for a shared pair.',
        },
      },
      {
        title: {
          zh: '一对、两对、三对都可能',
          en: 'One, two or three shared pairs are possible',
        },
        body: {
          zh: 'H—H 是单键，共享 1 对；O=O 是双键，共享 2 对；N≡N 是三键，共享 3 对。键的级数不同，长度和强度通常也会改变。',
          en: 'H—H is a single bond with one shared pair; O=O is a double bond with two; N≡N is a triple bond with three. Different bond orders usually change bond length and strength.',
        },
      },
      {
        title: {
          zh: '没有成键的电子对也很重要',
          en: 'Unshared pairs matter too',
        },
        body: {
          zh: '水分子的氧上还有两对孤电子对。电子区域彼此排斥，最终让 H—O—H 呈弯曲形。化学式告诉我们数量，结构图才进一步告诉我们连接和形状。',
          en: 'Oxygen in water also has two lone pairs. Electron regions repel, making H—O—H bent. A formula tells amounts; a structural picture adds connections and shape.',
        },
      },
    ],
    misconception: {
      zh: '“共享电子”不代表每一种共价键都平均共享。不同原子吸引电子的能力可以不同，电子云可能偏向一侧；这会产生极性，也是水能溶解许多物质的重要线索。',
      en: '“Shared electrons” does not mean every covalent bond shares equally. Different atoms can attract electrons differently, shifting electron density toward one side. This creates polarity—a clue to why water dissolves many substances.',
    },
    mission: {
      zh: '用豆子、纽扣或纸片摆出 H₂、O₂ 与 H₂O：每条键放一对“电子”。再给水分子的氧补上两对孤电子对，拍照或画图说明为什么 H₂O 不是直线。小物件注意防止幼童误吞。',
      en: 'Use beans, buttons or paper pieces to model H₂, O₂ and H₂O, placing one electron pair for each bond. Add two lone pairs to oxygen in water, then photograph or sketch why H₂O is not linear. Keep small pieces away from young children.',
    },
    vocabulary: [
      { en: 'covalent bond', zh: '共价键' },
      { en: 'shared electron pair', zh: '共用电子对' },
      { en: 'single bond', zh: '单键' },
      { en: 'double bond', zh: '双键' },
      { en: 'lone pair', zh: '孤电子对' },
    ],
    interactive: 'covalent-sharing-lab',
    questions: [
      {
        id: 'covalent-q1',
        prompt: {
          zh: '共价键最合适的入门描述是什么？',
          en: 'What is the best beginner description of a covalent bond?',
        },
        options: [
          {
            zh: '两个原子核共同吸引共享电子对',
            en: 'Two nuclei attract a shared pair of electrons',
          },
          { zh: '原子核之间交换质子', en: 'Nuclei swap protons' },
          {
            zh: '所有电子都完全离开原子',
            en: 'All electrons leave the atoms completely',
          },
        ],
        answer: 0,
        explanation: {
          zh: '共享电子对位于两个原子核之间并受到双方吸引，这是共价键的核心模型。',
          en: 'A shared electron pair lies between two nuclei and is attracted by both—the core model of a covalent bond.',
        },
      },
      {
        id: 'covalent-q2',
        prompt: {
          zh: 'O₂ 中的 O=O 为什么称为双键？',
          en: 'Why is O=O in O₂ called a double bond?',
        },
        options: [
          {
            zh: '因为分子里有两个原子核',
            en: 'Because the molecule contains two nuclei',
          },
          {
            zh: '因为两个氧原子共享两对电子',
            en: 'Because the two oxygen atoms share two electron pairs',
          },
          {
            zh: '因为氧气的温度是两倍',
            en: 'Because oxygen has twice the temperature',
          },
        ],
        answer: 1,
        explanation: {
          zh: '一条键线代表一对共享电子；O=O 的两条线代表两对共享电子。',
          en: 'One bond line represents one shared pair; the two lines in O=O represent two shared electron pairs.',
        },
      },
      {
        id: 'covalent-q3',
        prompt: {
          zh: '为什么只看到 H₂O 化学式还不能知道水分子的完整形状？',
          en: 'Why does the formula H₂O alone not reveal the full shape of a water molecule?',
        },
        options: [
          {
            zh: '化学式主要告诉原子种类和数量，没有完整显示连接与电子对的空间排列',
            en: 'A formula mainly gives atom types and counts, not the full spatial arrangement of bonds and electron pairs',
          },
          { zh: 'H₂O 中没有电子', en: 'H₂O contains no electrons' },
          {
            zh: '所有三原子分子都是直线形',
            en: 'Every three-atom molecule is linear',
          },
        ],
        answer: 0,
        explanation: {
          zh: '结构与形状还取决于成键电子对和孤电子对的空间排列；水中的孤电子对使分子弯曲。',
          en: 'Structure and shape also depend on how bonding and lone electron pairs occupy space; lone pairs make water bent.',
        },
      },
    ],
  },
  {
    id: 'metallic-bonding',
    levelId: 'bonding',
    order: 29,
    title: {
      zh: '金属键：电线为什么能弯又能导电？',
      en: 'Metallic bonding: why can wire bend and conduct?',
    },
    eyebrow: {
      zh: '第 29 课 · 会流动的电子线索',
      en: 'Lesson 29 · The clue of mobile electrons',
    },
    hook: {
      zh: '一根细铜线可以弯来弯去，还能把电能送进手机；盐晶体却会碎，塑料线皮又不导电。铜内部有什么特别的连接方式？',
      en: 'A thin copper wire can bend repeatedly and carry electrical energy into a phone; salt crystals shatter and plastic coating does not conduct. What is different inside copper?',
    },
    hookHint: {
      zh: '金属最外层的一些电子不只属于某一对原子，而能在整个结构中离域移动。正金属离子与这些离域电子之间的吸引把金属维系在一起。',
      en: 'Some outer electrons in a metal are not confined to one atom pair; they are delocalised across the structure. Attraction between positive metal ions and these electrons holds the metal together.',
    },
    bigIdea: {
      zh: '金属键是正金属离子与离域电子之间的静电吸引；电子能移动、吸引又没有固定方向，因此金属常能导电、导热并被弯折成形。',
      en: 'Metallic bonding is electrostatic attraction between positive metal ions and delocalised electrons; mobile, non-directional attraction helps metals conduct electricity and heat and change shape without immediately breaking.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🔌',
        title: { zh: '铜芯电线', en: 'Copper-core wire' },
        body: {
          zh: '铜中的离域电子能在电场作用下整体漂移并携带电荷；外面的塑料负责绝缘，减少触电和短路风险。',
          en: 'Delocalised electrons in copper can drift through an electric field and carry charge; plastic outside insulates, reducing shock and short-circuit risks.',
        },
      },
      {
        icon: '🥫',
        title: { zh: '薄薄的铝箔', en: 'Thin aluminium foil' },
        body: {
          zh: '金属离子层滑动时，离域电子仍能维持吸引，因此铝可压成很薄的箔；这叫延展性或可锻性。',
          en: 'When layers of metal ions slide, delocalised electrons keep attracting them, so aluminium can be rolled into thin foil—an example of malleability.',
        },
      },
      {
        icon: '🍳',
        title: { zh: '迅速传热的锅', en: 'A pan that spreads heat' },
        body: {
          zh: '移动电子与晶格振动都能传递能量，让许多金属快速导热；锅柄常用塑料或木材降低热传到手上的速度。',
          en: 'Mobile electrons and lattice vibrations transfer energy, so many metals conduct heat quickly; pan handles often use plastic or wood to slow heat reaching a hand.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先把“原子”改画成金属离子',
          en: 'First redraw atoms as metal ions',
        },
        body: {
          zh: '许多金属原子的外层电子进入整个结构共享的离域电子系统，留下规则排列的正金属离子。整体仍然电中性：正、负电荷总量相等。',
          en: 'Outer electrons from many metal atoms join a delocalised system shared across the structure, leaving regularly arranged positive metal ions. The whole metal remains neutral: total positive and negative charge balance.',
        },
      },
      {
        title: {
          zh: '电子能移动，所以能传递',
          en: 'Mobile electrons can transport',
        },
        body: {
          zh: '接上电路后，电子在电场作用下产生有方向的净漂移，形成电流；它们也能迅速传递碰撞获得的能量，帮助解释金属导热。',
          en: 'In a circuit, an electric field gives electrons a net drift, forming current. They also transfer collision energy quickly, helping explain thermal conduction.',
        },
      },
      {
        title: {
          zh: '层滑动，吸引仍在',
          en: 'Layers slide while attraction remains',
        },
        body: {
          zh: '金属键不像固定的一根根方向性连接。离子层错位后，离域电子仍围绕并吸引新的位置，因此金属往往能弯、拉成丝或压成片，而不是立刻脆裂。',
          en: 'Metallic bonds are not fixed directional sticks. After ion layers shift, delocalised electrons still surround and attract the new positions, so metals can often bend, draw into wire or roll into sheets instead of fracturing at once.',
        },
      },
    ],
    misconception: {
      zh: '“电子海”是帮助想象离域电子的模型，不是金属中真的装着一层液态电子。电子遵循量子规律；模型的价值在于解释它们不固定属于某一个原子，并能穿过结构移动。',
      en: 'The “sea of electrons” is a model for delocalised electrons, not a literal liquid layer inside metal. Electrons follow quantum rules; the model is useful because they are not assigned to one atom and can move through the structure.',
    },
    mission: {
      zh: '找一小片厨房铝箔和一根未连接电源的包胶扎线或纸夹，比较它们怎样弯曲、是否能保持新形状。只研究干净、无尖锐破损的物品；绝不剪开带电电线或把物体插入插座。',
      en: 'Compare a small piece of kitchen foil with an unplugged coated twist tie or paper clip: how do they bend and keep a new shape? Use clean, undamaged items only—never cut live wires or put objects into a socket.',
    },
    vocabulary: [
      { en: 'metallic bond', zh: '金属键' },
      { en: 'delocalised electron', zh: '离域电子' },
      { en: 'electrical conductor', zh: '电导体' },
      { en: 'malleable', zh: '可锻的' },
      { en: 'ductile', zh: '可延展的' },
    ],
    interactive: 'metallic-bonding-lab',
    questions: [
      {
        id: 'metallic-q1',
        prompt: {
          zh: '金属能导电的关键粒子线索是什么？',
          en: 'What particle-level clue is central to electrical conduction in metals?',
        },
        options: [
          {
            zh: '所有正离子在电线中快速跑动',
            en: 'All positive ions race through the wire',
          },
          {
            zh: '离域电子能在金属结构中移动',
            en: 'Delocalised electrons can move through the metal structure',
          },
          { zh: '金属中完全没有电子', en: 'Metals contain no electrons' },
        ],
        answer: 1,
        explanation: {
          zh: '正金属离子主要在晶格位置附近振动；能产生净漂移并携带电荷的是离域电子。',
          en: 'Positive metal ions mainly vibrate around lattice positions; delocalised electrons can undergo net drift and carry charge.',
        },
      },
      {
        id: 'metallic-q2',
        prompt: {
          zh: '为什么许多金属能压成薄片而不立即碎裂？',
          en: 'Why can many metals be rolled into sheets without immediately shattering?',
        },
        options: [
          {
            zh: '离子层移动后，离域电子仍能维持金属键吸引',
            en: 'After ion layers move, delocalised electrons can continue the metallic attraction',
          },
          {
            zh: '金属内部所有粒子都会消失',
            en: 'All particles inside the metal disappear',
          },
          {
            zh: '金属没有任何内部结构',
            en: 'Metals have no internal structure',
          },
        ],
        answer: 0,
        explanation: {
          zh: '金属键没有被限制为固定方向的一对一连接，层滑动后整体吸引仍可维持，因此材料能改变形状。',
          en: 'Metallic bonding is not limited to fixed one-to-one directional links, so overall attraction can remain after layers slide and the material can change shape.',
        },
      },
      {
        id: 'metallic-q3',
        prompt: {
          zh: '关于金属整体电荷，哪项正确？',
          en: 'Which statement about the overall charge of a metal is correct?',
        },
        options: [
          {
            zh: '金属一定带大量正电',
            en: 'A metal must carry a large positive charge',
          },
          {
            zh: '离域电子会让金属永远带负电',
            en: 'Delocalised electrons make metal permanently negative',
          },
          {
            zh: '正常金属整体通常电中性，正负电荷总量平衡',
            en: 'An ordinary metal is usually neutral overall, with positive and negative charge balanced',
          },
        ],
        answer: 2,
        explanation: {
          zh: '“正金属离子 + 离域电子”是同一个中性结构的两部分，不能只数正离子而忘记电子。',
          en: '“Positive metal ions + delocalised electrons” are two parts of one neutral structure; the electrons cannot be left out of the charge count.',
        },
      },
    ],
  },
  {
    id: 'structure-property-detective',
    levelId: 'bonding',
    order: 30,
    title: {
      zh: '结构决定性质：材料侦探',
      en: 'Structure shapes properties: material detective',
    },
    eyebrow: {
      zh: '第 30 课 · 从证据反推微观结构',
      en: 'Lesson 30 · Work backward from evidence',
    },
    hook: {
      zh: '同样摆在桌上的铜线、食盐、蜡烛和钻石，为什么有的导电、有的会熔、有的能弯、有的硬得惊人？只看几条性质，能不能猜出里面的粒子怎样连接？',
      en: 'Copper wire, salt, candle wax and diamond can all sit on a table—yet one conducts, one melts, one bends and one is extraordinarily hard. Can a few properties reveal how their particles connect?',
    },
    hookHint: {
      zh: '把每项性质当成线索：有没有可移动电荷？熔化要克服分子间作用还是整张强键网络？受力时粒子层能滑动，还是会让同号电荷相遇？',
      en: 'Treat each property as evidence: are mobile charges present? Does melting overcome attractions between molecules or a whole strong-bond network? Can layers slide, or does shifting bring like charges together?',
    },
    bigIdea: {
      zh: '材料性质来自“有哪些粒子、怎样排列、怎样连接”；组合多条证据，才能从宏观表现反推出最合理的微观结构。',
      en: 'Material properties come from which particles exist, how they are arranged and how they connect; combining several clues lets us infer the most plausible microscopic structure.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '📱',
        title: {
          zh: '一根充电线里的多种材料',
          en: 'Many materials in one charging cable',
        },
        body: {
          zh: '铜芯需要导电和可弯，塑料外皮需要绝缘和柔韧。工程师不会问“哪种材料最好”，而会问“哪种结构适合这个任务”。',
          en: 'The copper core must conduct and bend; the plastic jacket must insulate and flex. Engineers do not ask which material is simply best—they ask which structure fits the job.',
        },
      },
      {
        icon: '🧂',
        title: { zh: '盐粒与盐水', en: 'Salt grains and salt water' },
        body: {
          zh: '同一种物质，固态时离子固定而不易导电，溶于水后离子可移动而导电。状态改变了粒子的活动方式。',
          en: 'The same substance conducts poorly as a solid because ions are fixed, but conducts in solution when ions can move. State changes what particles can do.',
        },
      },
      {
        icon: '🕯️',
        title: { zh: '容易软化的蜡', en: 'Wax that softens readily' },
        body: {
          zh: '蜡分子内部有共价键，但熔化主要是让分子彼此滑开，不必拆断分子内所有强键，所以熔点远低于钻石。',
          en: 'Wax has covalent bonds inside molecules, but melting mainly lets molecules slide apart without breaking all internal bonds, so its melting point is far below diamond’s.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '第一问：电荷能不能移动？',
          en: 'First ask: can charge move?',
        },
        body: {
          zh: '固态就导电且能弯，常提示金属中的离域电子；固态不导电、熔化或溶解后导电，常提示离子从固定变为可移动。分子物质通常缺少自由移动的带电粒子。',
          en: 'Conducting while solid and bendable often suggests delocalised electrons in a metal. Conducting only when molten or dissolved often suggests ions becoming mobile. Molecular substances usually lack freely moving charged particles.',
        },
      },
      {
        title: {
          zh: '第二问：加热时要拆开什么？',
          en: 'Second ask: what must heating overcome?',
        },
        body: {
          zh: '小分子物质熔化或沸腾时，通常主要克服分子间吸引；离子晶格和巨型共价结构则要克服贯穿整体的强作用，因此往往需要更高温度。',
          en: 'When small-molecule substances melt or boil, heating mainly overcomes intermolecular attractions. Ionic lattices and giant covalent structures involve strong interactions throughout the solid and often need higher temperatures.',
        },
      },
      {
        title: {
          zh: '第三问：不要用一条线索判案',
          en: 'Third ask: do several clues agree?',
        },
        body: {
          zh: '“熔点高”不能单独证明离子结构，因为钻石等巨型共价结构也很耐高温。把导电、硬度、脆性、溶解性与状态变化一起看，结论才更可靠。',
          en: 'A high melting point alone does not prove an ionic structure; giant covalent materials such as diamond also resist heat. Combine conductivity, hardness, brittleness, solubility and state changes for a stronger conclusion.',
        },
      },
    ],
    misconception: {
      zh: '“含共价键”不等于“低熔点”。蜡是独立分子组成的分子物质，钻石却是共价键贯穿全体的巨型网络；真正要问的是强键只在分子内部，还是延伸到整个材料。',
      en: '“Contains covalent bonds” does not automatically mean “low melting point”. Wax consists of separate molecules, while diamond is a giant network of covalent bonds. Ask whether strong bonds stay inside molecules or extend throughout the material.',
    },
    mission: {
      zh: '在家中选择三个安全物品，例如铝箔、食盐、蜡烛或塑料瓶。只根据可见和已知性质填写“会不会弯、是否金属光泽、常温状态、是否怕热”，再提出一个结构猜想；不要加热、通电或品尝材料。',
      en: 'Choose three safe household items such as foil, salt, a candle or a plastic bottle. Record only visible or known properties—bends, metallic shine, room-temperature state, heat sensitivity—then propose a structure. Do not heat, electrify or taste materials.',
    },
    vocabulary: [
      { en: 'structure–property relationship', zh: '结构—性质关系' },
      { en: 'molecular substance', zh: '分子物质' },
      { en: 'giant covalent structure', zh: '巨型共价结构' },
      { en: 'evidence', zh: '证据' },
      { en: 'inference', zh: '推断' },
    ],
    interactive: 'structure-detective-lab',
    questions: [
      {
        id: 'structure-property-q1',
        prompt: {
          zh: '某固体能导电、可以弯曲并有金属光泽，最合理的结构模型是什么？',
          en: 'A solid conducts electricity, bends and has metallic lustre. Which structure model fits best?',
        },
        options: [
          {
            zh: '金属离子与可移动的离域电子',
            en: 'Metal ions with mobile delocalised electrons',
          },
          {
            zh: '彼此独立且没有带电粒子的小分子',
            en: 'Separate small molecules with no charged particles',
          },
          {
            zh: '固定不动的正负离子晶格',
            en: 'A lattice of fixed positive and negative ions',
          },
        ],
        answer: 0,
        explanation: {
          zh: '固态导电指向可移动电子，能弯又提示离子层滑动后金属键仍能维持；多条证据共同支持金属结构。',
          en: 'Solid conductivity points to mobile electrons, while bending suggests bonding survives layer movement. Together the clues support a metallic structure.',
        },
      },
      {
        id: 'structure-property-q2',
        prompt: {
          zh: '哪组证据最支持某物质是典型离子固体？',
          en: 'Which evidence set best supports a typical ionic solid?',
        },
        options: [
          {
            zh: '常温是气体，而且完全不带电',
            en: 'A gas at room temperature with no charge',
          },
          {
            zh: '较硬而脆，固态不导电，熔融或溶解后可导电',
            en: 'Hard and brittle, non-conducting as a solid but conducting when molten or dissolved',
          },
          {
            zh: '柔软、低熔点、固态导电并容易拉成丝',
            en: 'Soft, low-melting, solid-conducting and easily drawn into wire',
          },
        ],
        answer: 1,
        explanation: {
          zh: '这组证据与固定离子的强晶格、错位后的排斥，以及液态或溶液中离子可移动相互吻合。',
          en: 'These clues match a strong lattice of fixed ions, repulsion after layer shifts, and mobile ions in a melt or solution.',
        },
      },
      {
        id: 'structure-property-q3',
        prompt: {
          zh: '蜡和钻石内部都含共价键，为什么熔点差别巨大？',
          en: 'Wax and diamond both contain covalent bonds. Why are their melting behaviours so different?',
        },
        options: [
          { zh: '钻石其实没有碳原子', en: 'Diamond contains no carbon atoms' },
          {
            zh: '蜡里的每个电子都消失了',
            en: 'Every electron in wax has disappeared',
          },
          {
            zh: '蜡由独立分子组成，钻石的强共价键形成贯穿材料的巨型网络',
            en: 'Wax has separate molecules, while strong covalent bonds form a giant network throughout diamond',
          },
        ],
        answer: 2,
        explanation: {
          zh: '熔化蜡主要克服分子间吸引；破坏钻石结构则要处理贯穿整体的大量强共价键。',
          en: 'Melting wax mainly overcomes attractions between molecules; disrupting diamond means confronting many strong covalent bonds throughout the network.',
        },
      },
    ],
  },
] satisfies Lesson[];
