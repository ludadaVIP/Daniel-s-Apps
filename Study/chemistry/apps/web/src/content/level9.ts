import type { Lesson } from './lessons';

export const level9Lessons = [
  {
    id: 'why-metals-rust',
    levelId: 'metals',
    order: 45,
    title: {
      zh: '铁为什么会生锈？一场慢慢发生的电子转移',
      en: 'Why does iron rust? A slow electron-transfer story',
    },
    eyebrow: {
      zh: '第 45 课 · 自行车、海边和一层看不见的变化',
      en: 'Lesson 45 · Bikes, coasts and an invisible change',
    },
    hook: {
      zh: '一辆新自行车的链条很亮，几个月后却可能出现橙褐色斑点。铁并没有“变脏”这么简单：它的原子正和空气、水一起发生一场缓慢的化学变化。',
      en: 'A new bicycle chain shines, yet months later it can show orange-brown spots. Iron has not simply become dirty: its atoms are taking part in a slow chemical change with air and water.',
    },
    hookHint: {
      zh: '铁锈是铁在水和氧气参与下形成的新物质，常描述为水合氧化铁。这个过程叫腐蚀，也是氧化还原反应的生活入口。',
      en: 'Rust is a new material formed as iron reacts with water and oxygen, often described as hydrated iron oxide. The process is corrosion—and an everyday doorway into redox reactions.',
    },
    bigIdea: {
      zh: '铁锈是铁在氧气和水参与下被氧化形成的新物质；防锈的核心是阻断水、氧气，或用更活泼的金属帮助保护铁。',
      en: 'Rust is a new material formed as iron is oxidised with oxygen and water involved; preventing rust means blocking water and oxygen or using a more reactive metal to help protect iron.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🚲',
        title: { zh: '自行车链条和雨天', en: 'Bike chains and rainy days' },
        body: {
          zh: '雨水停留在铁制零件上，加上空气中的氧气，会给锈蚀创造条件。擦干、正确润滑和涂层不是为了“好看”，而是在改变反应条件。',
          en: 'Water left on iron parts, together with oxygen in air, creates conditions for rusting. Drying, proper lubrication and coatings are not only cosmetic—they change reaction conditions.',
        },
      },
      {
        icon: '🌊',
        title: {
          zh: '海边金属为什么更难保护',
          en: 'Why coastal metal needs more protection',
        },
        body: {
          zh: '含盐水能帮助电荷移动，常让腐蚀更快。海边栏杆、船只和桥梁会采用更耐腐蚀的材料、涂层或定期维护。',
          en: 'Salt water can help charge move and often speeds corrosion. Coastal railings, boats and bridges use more resistant materials, coatings or regular maintenance.',
        },
      },
      {
        icon: '🥫',
        title: { zh: '罐头表面的保护层', en: 'Protective layers on cans' },
        body: {
          zh: '金属罐常有涂层或镀层，把金属与食物、水和氧气隔开。材料工程常常是“预先设计一层屏障”，而不是等问题出现再修补。',
          en: 'Metal cans often have coatings or plating that separate metal from food, water and oxygen. Materials engineering often designs a barrier in advance rather than waiting to repair a problem.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '生锈是生成新物质，不只是变色',
          en: 'Rusting forms a new substance, not just a colour change',
        },
        body: {
          zh: '铁锈的颜色、质地和保护能力都与原来的铁不同。它常疏松、容易剥落，露出新的铁表面，因此锈蚀能继续向内发展。',
          en: 'Rust differs from iron in colour, texture and protection. It is often loose and flaky, exposing fresh iron underneath so corrosion can continue inward.',
        },
      },
      {
        title: {
          zh: '水和氧气让熟悉的铁锈更容易发生',
          en: 'Water and oxygen enable familiar rusting',
        },
        body: {
          zh: '在初学模型中，铁锈形成需要氧气和水同时参与。只有干燥空气或只有水的条件下，常见铁锈会慢得多；这解释了为什么保持干燥有用。',
          en: 'In the beginner model, familiar rusting needs both oxygen and water. In dry air alone or water without much oxygen, common rusting is much slower—explaining why keeping iron dry helps.',
        },
      },
      {
        title: {
          zh: '氧化意味着失去电子',
          en: 'Oxidation means losing electrons',
        },
        body: {
          zh: '铁原子在腐蚀过程中失去电子，形成铁离子；其他物质接收电子。把“失电子”叫氧化，是理解电池、镀锌和氧化还原反应的关键语言。',
          en: 'Iron atoms lose electrons during corrosion and form iron ions; other substances receive those electrons. Calling electron loss oxidation is key language for batteries, galvanising and redox reactions.',
        },
      },
    ],
    misconception: {
      zh: '“铁锈会像油漆一样保护铁”通常不对。铁锈往往疏松多孔，水和氧气仍能穿过或从裂缝进入；铝表面的致密氧化层则是另一个不同的故事。',
      en: '“Rust protects iron like paint” is usually wrong. Rust is often loose and porous, so water and oxygen can still pass through or enter cracks; aluminium’s compact oxide layer is a different story.',
    },
    mission: {
      zh: '防锈设计侦探：选一个熟悉的金属物品，如门把手、自行车、罐头或户外栏杆，只观察它有没有油漆、塑料包覆、镀层或不锈钢表面。不要刮擦、拆开或人为弄湿它。说出这层设计试图阻断什么，以及为什么它会延长使用寿命。',
      en: 'Rust-protection detective: choose a familiar metal object—door handle, bicycle, can or outdoor railing—and only observe whether it has paint, plastic covering, plating or a stainless surface. Do not scratch, dismantle or wet it. Explain what the design tries to block and why that extends its life.',
    },
    vocabulary: [
      { en: 'corrosion', zh: '腐蚀' },
      { en: 'rust', zh: '铁锈' },
      { en: 'oxidation', zh: '氧化' },
      { en: 'electron transfer', zh: '电子转移' },
      { en: 'protective coating', zh: '保护涂层' },
    ],
    interactive: 'rusting-lab',
    questions: [
      {
        id: 'rust-q1',
        prompt: {
          zh: '在初学模型中，铁锈形成最需要哪两个条件同时存在？',
          en: 'In the beginner model, which two conditions are most needed for familiar rusting?',
        },
        options: [
          { zh: '水和氧气', en: 'Water and oxygen' },
          { zh: '阳光和糖', en: 'Sunlight and sugar' },
          { zh: '只有氮气', en: 'Nitrogen only' },
        ],
        answer: 0,
        explanation: {
          zh: '铁的常见锈蚀需要水和氧气参与；阻断其中任意一个，通常能显著减慢过程。',
          en: 'Common rusting of iron involves both water and oxygen. Blocking either one usually slows the process greatly.',
        },
      },
      {
        id: 'rust-q2',
        prompt: {
          zh: '为什么油漆、油或塑料涂层能帮助铁防锈？',
          en: 'Why can paint, oil or plastic coating help iron resist rusting?',
        },
        options: [
          {
            zh: '它们把水和氧气与铁隔开',
            en: 'They keep water and oxygen away from the iron',
          },
          {
            zh: '它们把铁原子变成金原子',
            en: 'They turn iron atoms into gold atoms',
          },
          {
            zh: '它们使铁完全没有电子',
            en: 'They remove all electrons from iron',
          },
        ],
        answer: 0,
        explanation: {
          zh: '涂层是物理屏障，减少水和氧气接触铁表面的机会，因此减慢锈蚀反应。',
          en: 'A coating is a physical barrier that reduces water and oxygen reaching the iron surface, slowing the rusting reaction.',
        },
      },
      {
        id: 'rust-q3',
        prompt: {
          zh: '在氧化还原语言中，铁原子失去电子时发生了什么？',
          en: 'In redox language, what happens when an iron atom loses electrons?',
        },
        options: [
          { zh: '它被氧化', en: 'It is oxidised' },
          { zh: '它被还原', en: 'It is reduced' },
          { zh: '它停止作为元素存在', en: 'It stops existing as an element' },
        ],
        answer: 0,
        explanation: {
          zh: '氧化的核心定义是失去电子；得到电子才叫还原。原子不会消失，而是转变成带电的离子或参与新物质。',
          en: 'Oxidation is defined as losing electrons; gaining electrons is reduction. Atoms do not disappear—they become charged ions or join new substances.',
        },
      },
      {
        id: 'rust-q4',
        prompt: {
          zh: '为什么海边铁制物品常需要更频繁维护？',
          en: 'Why do iron objects near the sea often need more frequent maintenance?',
        },
        options: [
          {
            zh: '盐水能帮助电荷移动，常加快腐蚀',
            en: 'Salt water can help charge move and often speeds corrosion',
          },
          { zh: '海边没有氧气', en: 'There is no oxygen near the sea' },
          {
            zh: '铁在海边自动变成塑料',
            en: 'Iron automatically turns into plastic at the coast',
          },
        ],
        answer: 0,
        explanation: {
          zh: '潮湿和盐分会让腐蚀更容易进行，所以海边结构常需要合适涂层、材料选择与定期维护。',
          en: 'Moisture and salt make corrosion easier, so coastal structures often need suitable coatings, material choices and regular maintenance.',
        },
      },
    ],
  },
  {
    id: 'metal-displacement-electron-story',
    levelId: 'metals',
    order: 46,
    title: {
      zh: '金属置换：电子把铜“请”到表面',
      en: 'Metal displacement: electrons invite copper to the surface',
    },
    eyebrow: {
      zh: '第 46 课 · 谁更愿意交出电子？',
      en: 'Lesson 46 · Who gives up electrons more readily?',
    },
    hook: {
      zh: '把一块锌放入含铜离子的蓝色溶液，在受控实验室中，锌表面可能渐渐出现红棕色铜，同时蓝色变淡。好像铜从水里“长”到了锌上——它到底从哪里来？',
      en: 'Place zinc in a blue solution containing copper ions in a controlled lab, and reddish-brown copper can gradually appear on the zinc while the blue fades. It looks as if copper “grows” from water onto zinc—where does it come from?',
    },
    hookHint: {
      zh: '锌比铜更容易失去电子。锌原子把电子交给 Cu²⁺，自己进入溶液成为 Zn²⁺；Cu²⁺ 得到电子，重新成为铜原子并沉积在表面。这叫置换反应，也是氧化还原。',
      en: 'Zinc gives up electrons more readily than copper. Zinc atoms hand electrons to Cu²⁺ and enter solution as Zn²⁺; Cu²⁺ gains electrons, becomes copper atoms again and deposits on the surface. This is a displacement reaction and also redox.',
    },
    bigIdea: {
      zh: '在金属置换反应中，较活泼的金属失去电子形成离子，较不活泼金属的离子得到电子形成金属原子；电子转移同时发生。',
      en: 'In metal displacement, a more reactive metal loses electrons to form ions while ions of a less reactive metal gain electrons to form metal atoms; electron transfer happens together.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🔋',
        title: {
          zh: '电池不是凭空制造电流',
          en: 'Batteries do not make current from nowhere',
        },
        body: {
          zh: '电池利用不同材料“交出或接收电子”的倾向，把化学变化组织成可利用的电流。置换反应像一个没有导线的微型版本。',
          en: 'Batteries organise different materials’ tendencies to give or receive electrons into useful current. A displacement reaction is like a tiny version without an external wire.',
        },
      },
      {
        icon: '🎨',
        title: {
          zh: '颜色是线索，不是魔法',
          en: 'Colour is a clue, not magic',
        },
        body: {
          zh: '某些铜离子溶液显蓝色；当 Cu²⁺ 数量减少时，颜色可能变淡，同时固体铜出现。两个线索一起支持“离子变成金属”的解释。',
          en: 'Some copper-ion solutions are blue. When Cu²⁺ decreases, colour can fade while solid copper appears. Together, the clues support ions becoming metal.',
        },
      },
      {
        icon: '🛠️',
        title: {
          zh: '材料工程看的是相对关系',
          en: 'Engineering uses relative relationships',
        },
        body: {
          zh: '保护金属、选择连接件或设计电池时，工程师关心“哪一种更容易失电子”，而不只记住单个金属的名字。活动性顺序提供这种比较地图。',
          en: 'When protecting metals, choosing fasteners or designing batteries, engineers care which material gives up electrons more readily—not only its name. A reactivity series is a comparison map.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先读完整的粒子故事',
          en: 'Read the full particle story first',
        },
        body: {
          zh: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)。Zn 是固态金属，Cu²⁺ 是溶液里的铜离子；反应后 Zn²⁺ 进入溶液，Cu 成为固态金属。',
          en: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). Zn is solid metal and Cu²⁺ is a copper ion in solution; afterward Zn²⁺ enters solution and Cu becomes solid metal.',
        },
      },
      {
        title: {
          zh: '电子从锌流向铜离子',
          en: 'Electrons move from zinc to copper ions',
        },
        body: {
          zh: 'Zn → Zn²⁺ + 2e⁻ 是锌失电子，因此被氧化；Cu²⁺ + 2e⁻ → Cu 是铜离子得电子，因此被还原。两个半过程必须配套，电子不会凭空堆积。',
          en: 'Zn → Zn²⁺ + 2e⁻ shows zinc losing electrons, so it is oxidised; Cu²⁺ + 2e⁻ → Cu shows copper ions gaining electrons, so they are reduced. The two half-processes pair up—electrons do not pile up from nowhere.',
        },
      },
      {
        title: {
          zh: '用活动性预测能否发生置换',
          en: 'Use reactivity to predict displacement',
        },
        body: {
          zh: '较活泼金属通常能置换出较不活泼金属的离子。锌能置换 Cu²⁺；反过来，把铜放入含 Zn²⁺ 的溶液，入门模型预测不会发生同样的置换。',
          en: 'A more reactive metal can usually displace ions of a less reactive metal. Zinc can displace Cu²⁺; in reverse, copper in a Zn²⁺ solution is predicted not to make the same displacement in the beginner model.',
        },
      },
    ],
    misconception: {
      zh: '“铜从无到有长出来”不对。铜离子本来就在溶液中；得到电子后，它们变成中性铜原子并聚在固体表面。颜色变淡与表面铜出现要一起解读，单一现象不够。',
      en: '“Copper grows from nothing” is wrong. Copper ions were already in the solution; after gaining electrons, they become neutral copper atoms and collect on the solid surface. Read fading colour and surface copper together—one observation alone is not enough.',
    },
    mission: {
      zh: '电子去向口述挑战：对着 Zn + Cu²⁺ → Zn²⁺ + Cu，用手势表示“锌交出两颗电子，铜离子接住两颗电子”。然后说明为什么铜出现在表面并不违反原子守恒。只做手势和纸笔，不混合任何材料。',
      en: 'Try an electron-destination explanation: for Zn + Cu²⁺ → Zn²⁺ + Cu, gesture “zinc gives two electrons, copper ions catch two.” Then explain why copper appearing on a surface does not break atom conservation. Use only gestures and paper—do not mix materials.',
    },
    vocabulary: [
      { en: 'displacement reaction', zh: '置换反应' },
      { en: 'oxidation', zh: '氧化（失电子）' },
      { en: 'reduction', zh: '还原（得电子）' },
      { en: 'copper(II) ion', zh: '铜离子（Cu²⁺）' },
      { en: 'half-equation', zh: '半反应式' },
    ],
    interactive: 'metal-displacement-lab',
    questions: [
      {
        id: 'displacement-q1',
        prompt: {
          zh: '在 Zn + Cu²⁺ → Zn²⁺ + Cu 中，哪一种粒子得到电子？',
          en: 'In Zn + Cu²⁺ → Zn²⁺ + Cu, which particle gains electrons?',
        },
        options: [
          { zh: 'Cu²⁺', en: 'Cu²⁺' },
          { zh: 'Zn', en: 'Zn' },
          { zh: '电子本身', en: 'The electrons themselves' },
        ],
        answer: 0,
        explanation: {
          zh: 'Cu²⁺ 得到 2 个电子后成为中性的 Cu 原子；得电子称为还原。锌则失电子成为 Zn²⁺。',
          en: 'Cu²⁺ gains two electrons to become neutral Cu atoms; gaining electrons is reduction. Zinc loses electrons to become Zn²⁺.',
        },
      },
      {
        id: 'displacement-q2',
        prompt: {
          zh: '为什么反应后锌表面可能出现铜？',
          en: 'Why can copper appear on zinc’s surface after the reaction?',
        },
        options: [
          {
            zh: 'Cu²⁺ 从溶液中得到电子，成为固态铜原子',
            en: 'Cu²⁺ gains electrons from the solution process and becomes solid copper atoms',
          },
          { zh: '锌原子变成了铜原子', en: 'Zinc atoms turn into copper atoms' },
          {
            zh: '铜原子凭空被创造',
            en: 'Copper atoms are created from nothing',
          },
        ],
        answer: 0,
        explanation: {
          zh: '铜元素一开始以 Cu²⁺ 形式存在于溶液。得电子后它转变为 Cu 原子，沉积在附近金属表面。',
          en: 'Copper began in solution as Cu²⁺. After gaining electrons it becomes Cu atoms, which deposit on a nearby metal surface.',
        },
      },
      {
        id: 'displacement-q3',
        prompt: {
          zh: '锌失去电子形成 Zn²⁺，这在氧化还原语言中叫什么？',
          en: 'Zinc loses electrons to form Zn²⁺. What is this called in redox language?',
        },
        options: [
          { zh: '氧化', en: 'Oxidation' },
          { zh: '还原', en: 'Reduction' },
          { zh: '中性化', en: 'Neutralisation' },
        ],
        answer: 0,
        explanation: {
          zh: '氧化就是失电子。与它配对的是 Cu²⁺ 的得电子还原；两件事一起完成。',
          en: 'Oxidation is electron loss. It pairs with Cu²⁺ gaining electrons by reduction; both happen together.',
        },
      },
      {
        id: 'displacement-q4',
        prompt: {
          zh: '为什么不应该在家中混合金属、溶液或清洁产品来“看置换”？',
          en: 'Why should you not mix metals, solutions or cleaners at home to “watch displacement”?',
        },
        options: [
          {
            zh: '真实体系可能有未知成分、腐蚀性或有害副反应，应使用虚拟模型或受监督实验室',
            en: 'Real systems can have unknown ingredients, corrosiveness or harmful side reactions; use models or supervised labs',
          },
          {
            zh: '因为电子只存在于动画中',
            en: 'Because electrons exist only in animations',
          },
          { zh: '因为金属永远不会反应', en: 'Because metals never react' },
        ],
        answer: 0,
        explanation: {
          zh: '置换反应需要明确的试剂、浓度、器材和处置方案。安全的学习先用模型解释因果关系。',
          en: 'Displacement reactions require known reagents, concentrations, equipment and disposal. Safe learning uses models first to explain cause and effect.',
        },
      },
    ],
  },
  {
    id: 'galvanising-sacrificial-protection',
    levelId: 'metals',
    order: 47,
    title: {
      zh: '镀锌：为什么划痕旁的钢铁仍能被保护？',
      en: 'Galvanising: why can steel stay protected near a scratch?',
    },
    eyebrow: {
      zh: '第 47 课 · 一层涂层，也是一位“电子保镖”',
      en: 'Lesson 47 · A coating and an electron bodyguard',
    },
    hook: {
      zh: '油漆被划破后，下面的铁容易接触水和氧气；可镀锌钢即使出现小划痕，常仍能在一段范围内保护钢铁。锌到底做了什么，比“挡住空气”更进一步？',
      en: 'When paint is scratched, the iron beneath can meet water and oxygen. Galvanised steel can often still protect steel around a small scratch. What does zinc do beyond simply blocking air?',
    },
    hookHint: {
      zh: '锌比铁更活泼，更愿意失去电子。当锌与铁相连且有潮湿环境时，锌会优先被氧化，给铁提供电子保护；这叫牺牲保护。',
      en: 'Zinc is more reactive than iron and more willing to lose electrons. When zinc and iron are connected in damp conditions, zinc can oxidise first and provide electron protection to iron. This is sacrificial protection.',
    },
    bigIdea: {
      zh: '镀锌既能形成物理屏障，也能让更活泼的锌优先氧化；锌“牺牲”自己，帮助铁避免失电子而生锈。',
      en: 'Galvanising forms a physical barrier and lets more reactive zinc oxidise first; zinc “sacrifices” itself, helping iron avoid electron loss and rusting.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🚧',
        title: { zh: '护栏和户外螺丝', en: 'Railings and outdoor bolts' },
        body: {
          zh: '许多户外钢结构会使用镀锌层，抵御雨水和空气。维护人员仍需检查损伤，因为任何保护层都有寿命和适用条件。',
          en: 'Many outdoor steel structures use galvanised coatings against rain and air. Maintenance teams still inspect damage because every protection system has a lifetime and limits.',
        },
      },
      {
        icon: '⛵',
        title: { zh: '船体上的“牺牲阳极”', en: 'Sacrificial anodes on boats' },
        body: {
          zh: '船只和码头设备有时安装锌或其他更活泼金属块，让它们优先腐蚀。这是把相对反应性变成工程设计。',
          en: 'Boats and dock equipment sometimes attach zinc or other more reactive metal blocks so they corrode first. This turns relative reactivity into engineering design.',
        },
      },
      {
        icon: '🔩',
        title: {
          zh: '划痕让比较更有价值',
          en: 'A scratch makes the comparison more meaningful',
        },
        body: {
          zh: '只有屏障时，划痕会暴露铁；镀锌的特别之处在于锌和铁的电子关系还能提供额外帮助。',
          en: 'With a barrier alone, a scratch exposes iron. Galvanising is special because the zinc–iron electron relationship can offer extra help.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '第一层：把水和氧气挡在外面',
          en: 'Layer one: keep water and oxygen out',
        },
        body: {
          zh: '完整的锌层像涂层一样，减少水和氧气接触钢铁表面的机会。这已经能大幅减慢锈蚀。',
          en: 'An intact zinc layer acts like a coating, reducing water and oxygen reaching steel. This alone can greatly slow rusting.',
        },
      },
      {
        title: {
          zh: '第二层：锌优先失去电子',
          en: 'Layer two: zinc loses electrons first',
        },
        body: {
          zh: '若有小划痕并出现潮湿电解质，锌比铁更容易氧化。锌失电子形成 Zn²⁺；电子流向铁，减少铁失电子形成 Fe²⁺ 的倾向。',
          en: 'If a small scratch and damp electrolyte are present, zinc oxidises more readily than iron. Zinc loses electrons to form Zn²⁺; electrons flow toward iron, reducing iron’s tendency to lose electrons and form Fe²⁺.',
        },
      },
      {
        title: {
          zh: '牺牲不等于永远有效',
          en: 'Sacrifice does not mean forever',
        },
        body: {
          zh: '锌会逐渐被消耗。工程师需要选择足够的镀层厚度、定期检查，并在严苛环境使用多种保护方法。',
          en: 'Zinc is gradually consumed. Engineers choose enough coating thickness, inspect regularly and use multiple protection methods in harsh environments.',
        },
      },
    ],
    misconception: {
      zh: '“锌永远不会腐蚀，所以它保护铁”是错的。恰恰相反，锌会优先被氧化；正是这种可预测的牺牲，才让铁在一定条件下更安全。',
      en: '“Zinc never corrodes, so it protects iron” is wrong. Zinc is oxidised first; this predictable sacrifice is what can make iron safer under suitable conditions.',
    },
    mission: {
      zh: '保护层观察：找一个带有“galvanized/镀锌”或户外金属保护说明的商品标签、图片或说明书，只阅读和观察。指出它同时利用了哪两种保护想法：屏障，还是更活泼金属的优先氧化？不要刮擦或浸湿任何物品。',
      en: 'Protection-layer observation: find a product label, image or guide mentioning “galvanized.” Only read and observe. Identify the two protection ideas: barrier and/or a more reactive metal oxidising first. Do not scratch or wet any object.',
    },
    vocabulary: [
      { en: 'galvanising', zh: '镀锌' },
      { en: 'sacrificial protection', zh: '牺牲保护' },
      { en: 'anode', zh: '阳极（牺牲端）' },
      { en: 'electrolyte', zh: '电解质溶液' },
      { en: 'coating', zh: '镀层 / 涂层' },
    ],
    interactive: 'galvanising-lab',
    questions: [
      {
        id: 'galvanising-q1',
        prompt: {
          zh: '镀锌层完整时，最直接的第一道防锈作用是什么？',
          en: 'When a zinc coating is intact, what is its most direct first anti-rust role?',
        },
        options: [
          {
            zh: '隔开水、氧气与铁表面',
            en: 'Separate water and oxygen from the iron surface',
          },
          { zh: '把铁变成铜', en: 'Turn iron into copper' },
          { zh: '让铁失去所有电子', en: 'Make iron lose all electrons' },
        ],
        answer: 0,
        explanation: {
          zh: '完整镀层先作为物理屏障，减少水和氧气接触铁。',
          en: 'An intact coating first acts as a physical barrier, reducing water and oxygen contacting iron.',
        },
      },
      {
        id: 'galvanising-q2',
        prompt: {
          zh: '小划痕附近，为什么锌仍能帮助保护铁？',
          en: 'Near a small scratch, why can zinc still help protect iron?',
        },
        options: [
          {
            zh: '锌比铁更活泼，倾向优先失电子并被氧化',
            en: 'Zinc is more reactive than iron and tends to lose electrons and oxidise first',
          },
          { zh: '锌把铁原子变没', en: 'Zinc makes iron atoms disappear' },
          {
            zh: '划痕会自动补上油漆',
            en: 'A scratch automatically repaints itself',
          },
        ],
        answer: 0,
        explanation: {
          zh: '锌优先氧化，电子可流向铁，减弱铁失电子的趋势。这是牺牲保护。',
          en: 'Zinc oxidises first and electrons can flow toward iron, reducing iron’s tendency to lose electrons. This is sacrificial protection.',
        },
      },
      {
        id: 'galvanising-q3',
        prompt: {
          zh: '为什么镀锌结构仍需要检查和维护？',
          en: 'Why do galvanised structures still need inspection and maintenance?',
        },
        options: [
          {
            zh: '锌层会逐渐消耗，损伤和环境也会改变保护效果',
            en: 'Zinc is gradually consumed, and damage and environment affect protection',
          },
          { zh: '因为锌从不发生反应', en: 'Because zinc never reacts' },
          {
            zh: '因为任何涂层都会让铁更快生锈',
            en: 'Because every coating makes iron rust faster',
          },
        ],
        answer: 0,
        explanation: {
          zh: '牺牲保护依赖锌逐步氧化，镀层厚度、划痕和环境条件都会影响寿命。',
          en: 'Sacrificial protection relies on zinc gradually oxidising; coating thickness, scratches and environment all affect its lifetime.',
        },
      },
      {
        id: 'galvanising-q4',
        prompt: {
          zh: '哪一种做法最适合学习镀锌保护？',
          en: 'Which is most suitable for learning about galvanising?',
        },
        options: [
          {
            zh: '用屏幕模型追踪电子和涂层作用，并观察标签或图片',
            en: 'Trace electrons and coating effects in a screen model, and observe labels or pictures',
          },
          {
            zh: '把家用金属泡进未知液体',
            en: 'Soak household metal in an unknown liquid',
          },
          {
            zh: '刮掉物品涂层看看',
            en: 'Scratch away an object’s coating to see',
          },
        ],
        answer: 0,
        explanation: {
          zh: '模型和观察能安全建立因果关系；真实腐蚀实验需要受控条件、器材和处置方案。',
          en: 'Models and observation safely build cause and effect; real corrosion experiments need controlled conditions, equipment and disposal.',
        },
      },
    ],
  },
] satisfies Lesson[];
