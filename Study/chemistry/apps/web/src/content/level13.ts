import type { Lesson } from './lessons';

export const level13Lessons: Lesson[] = [
  {
    id: 'energy-in-chemical-change',
    levelId: 'energetics',
    order: 56,
    title: {
      zh: '反应会放热还是吸热？能量去了哪里？',
      en: 'Does a reaction warm or cool? Where does energy go?',
    },
    eyebrow: {
      zh: '第 56 课 · 暖手包、冷敷袋与看不见的能量账本',
      en: 'Lesson 56 · Hand warmers, cold packs & an invisible energy ledger',
    },
    hook: {
      zh: '有的暖手包一摇就变热，有的冷敷袋一按就变冷。它们都没有插电，温度变化的能量从哪里来，又跑到了哪里？',
      en: 'Some hand warmers become hot when activated; some cold packs become cold when snapped. Neither is plugged in—where does the energy for the temperature change come from, and where does it go?',
    },
    hookHint: {
      zh: '化学变化常伴随能量转移。向周围放出能量的叫放热（exothermic），周围会变暖；从周围吸收能量的叫吸热（endothermic），周围会变冷。关键是看“系统”和“周围”之间的能量流向。',
      en: 'Chemical changes often involve energy transfer. A change that releases energy to surroundings is exothermic, making surroundings warmer; one that takes in energy is endothermic, making surroundings cooler. The key is the energy direction between system and surroundings.',
    },
    bigIdea: {
      zh: '放热和吸热描述的是能量流向：放热过程把能量传给周围，吸热过程从周围取得能量。温度是观察线索，但解释要追到微观的旧键断裂与新键形成。',
      en: 'Exothermic and endothermic describe energy direction: exothermic processes transfer energy to surroundings, while endothermic processes take energy from them. Temperature is an observation clue; the microscopic explanation involves breaking old bonds and forming new ones.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🔥',
        title: { zh: '燃烧与暖手包', en: 'Burning and hand warmers' },
        body: {
          zh: '燃料燃烧会把能量传到火焰、空气和周围物体；有些暖手包利用受控的化学或结晶过程放出热。它们都需要按产品说明安全使用。',
          en: 'Fuel combustion transfers energy to flame, air and nearby objects; some hand warmers use controlled chemical or crystallisation processes to release warmth. Both must be used according to product instructions.',
        },
      },
      {
        icon: '🧊',
        title: {
          zh: '冷敷袋为什么会冷？',
          en: 'Why can a cold pack feel cold?',
        },
        body: {
          zh: '某些冷敷袋内部物质混合或溶解时吸收周围能量，手摸起来就变冷。它不是“制造冷”，而是在把热从周围带走。',
          en: 'In some cold packs, materials mix or dissolve while taking energy from their surroundings, so they feel cold. They do not “make cold”; they take thermal energy from nearby material.',
        },
      },
      {
        icon: '🍞',
        title: {
          zh: '食物、身体与能量转化',
          en: 'Food, bodies and energy transformations',
        },
        body: {
          zh: '人体通过一连串受控反应从食物中获得可用能量，其中一部分最终以热的形式传给周围。身体不是小火炉的简单版本，过程受到精密调控。',
          en: 'The body uses controlled reaction pathways to obtain usable energy from food, with some ultimately transferred as heat. A body is not simply a tiny furnace; its processes are precisely regulated.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先画出系统边界', en: 'First draw a system boundary' },
        body: {
          zh: '把正在反应或变化的物质叫“系统”，杯子、手、空气等叫“周围”。同一份能量离开系统时，会进入周围；只要边界说清楚，“放出”和“吸收”就不会混乱。',
          en: 'Call the reacting or changing materials the system, and the cup, hand and air the surroundings. When energy leaves the system, it enters surroundings; once the boundary is clear, “release” and “absorb” do not get mixed up.',
        },
      },
      {
        title: {
          zh: '放热：周围接到能量',
          en: 'Exothermic: surroundings receive energy',
        },
        body: {
          zh: '若系统把能量传给杯壁、空气或你的手，周围温度通常上升。形成的新化学键会释放能量；当释放的能量超过断开旧键所需的能量时，整体表现为放热。',
          en: 'If a system transfers energy to the cup, air or your hand, surroundings usually warm. Forming new chemical bonds releases energy; when that release exceeds the energy needed to break old bonds, the overall change is exothermic.',
        },
      },
      {
        title: {
          zh: '吸热：系统从周围取走能量',
          en: 'Endothermic: the system takes energy from surroundings',
        },
        body: {
          zh: '若系统需要的能量比形成新键释放的更多，就会从周围吸收能量，周围温度可能下降。吸热不代表“没有能量”，而是能量进入了系统。',
          en: 'If a system needs more energy than new bond formation releases, it absorbs energy from surroundings and they may cool. Endothermic does not mean “no energy”; energy is entering the system.',
        },
      },
    ],
    misconception: {
      zh: '“放热就是很热，吸热就是很冷”过于粗糙。它们说的是能量流向，不是一个固定温度；过程可以放热却仍低于你的体温。还有，“冷”不是一种被制造出来的物质，而是周围失去了一部分热能的感受。',
      en: '“Exothermic means very hot and endothermic means very cold” is too crude. They describe energy direction, not one fixed temperature; an exothermic process can still be cooler than your hand. Nor is “cold” a substance made by a process—it is how we experience less thermal energy nearby.',
    },
    mission: {
      zh: '能量侦探：在家中找三个温度变化例子，例如热茶冷却、冰块融化、烤面包机工作。画箭头表示能量从哪里流向哪里；再判断它是不是化学反应。只做观察，不拆开暖手包、冷敷袋或电器。',
      en: 'Energy detective: find three temperature-change examples at home, such as tea cooling, ice melting and a toaster operating. Draw arrows to show where energy travels, then decide whether each is a chemical reaction. Observe only; do not open hand warmers, cold packs or appliances.',
    },
    vocabulary: [
      { en: 'exothermic', zh: '放热的' },
      { en: 'endothermic', zh: '吸热的' },
      { en: 'system', zh: '系统' },
      { en: 'surroundings', zh: '周围环境' },
      { en: 'energy transfer', zh: '能量转移' },
    ],
    interactive: 'energy-flow-lab',
    questions: [
      {
        id: 'energy-q1',
        prompt: {
          zh: '某过程让杯子周围变暖，能量最可能怎样流动？',
          en: 'A process makes the area around a cup warmer. How did energy most likely move?',
        },
        options: [
          { zh: '从系统传到周围', en: 'From the system to the surroundings' },
          { zh: '从周围传到系统', en: 'From the surroundings to the system' },
          { zh: '能量完全消失', en: 'Energy disappeared completely' },
        ],
        answer: 0,
        explanation: {
          zh: '周围变暖说明它得到了能量；若能量来自正在发生变化的物质，方向就是系统 → 周围。',
          en: 'Warmer surroundings received energy; if it came from the changing materials, the direction is system → surroundings.',
        },
      },
      {
        id: 'energy-q2',
        prompt: {
          zh: '吸热过程最准确的描述是什么？',
          en: 'What is the most accurate description of an endothermic process?',
        },
        options: [
          {
            zh: '系统从周围吸收能量',
            en: 'The system absorbs energy from surroundings',
          },
          {
            zh: '系统制造了“冷物质”',
            en: 'The system makes a “cold substance”',
          },
          { zh: '没有发生能量转移', en: 'No energy transfer occurs' },
        ],
        answer: 0,
        explanation: {
          zh: '吸热的“吸”指系统取得能量；周围失去一部分热能，摸起来可能更冷。',
          en: 'The “endo” process takes energy into the system; surroundings lose some thermal energy and may feel cooler.',
        },
      },
      {
        id: 'energy-q3',
        prompt: {
          zh: '为什么要先划定“系统”和“周围”？',
          en: 'Why should you define the system and surroundings first?',
        },
        options: [
          {
            zh: '才能清楚说出能量从哪里流向哪里',
            en: 'So you can clearly state where energy flows from and to',
          },
          {
            zh: '这样反应会自动更快',
            en: 'This automatically makes a reaction faster',
          },
          {
            zh: '这样温度一定不变',
            en: 'This guarantees temperature never changes',
          },
        ],
        answer: 0,
        explanation: {
          zh: '放热和吸热是相对系统说的。边界不清楚，“谁放出、谁吸收”就容易说反。',
          en: 'Exothermic and endothermic are stated relative to the system. Without a clear boundary, it is easy to reverse who releases and who absorbs.',
        },
      },
      {
        id: 'energy-q4',
        prompt: {
          zh: '冰融化时从周围吸收能量，这能说明什么？',
          en: 'Ice melting absorbs energy from surroundings. What does that show?',
        },
        options: [
          {
            zh: '吸热也可以发生在物理变化中，不只在化学反应中',
            en: 'Endothermic energy transfer can occur in physical changes too, not only reactions',
          },
          { zh: '冰变成了一种新元素', en: 'Ice became a new element' },
          { zh: '能量不再守恒', en: 'Energy is no longer conserved' },
        ],
        answer: 0,
        explanation: {
          zh: '吸热/放热描述能量流，不限定是否发生化学反应；冰融化仍是水的状态变化。',
          en: 'Endothermic/exothermic describe energy flow and do not require a chemical reaction; melting ice is still a state change of water.',
        },
      },
    ],
  },
  {
    id: 'activation-energy-and-catalysts',
    levelId: 'energetics',
    order: 57,
    title: {
      zh: '反应为什么需要“起跑能量”？催化剂做了什么？',
      en: 'Why do reactions need a start-up push? What catalysts do',
    },
    eyebrow: {
      zh: '第 57 课 · 翻过能量小山，而不是凭空造能量',
      en: 'Lesson 57 · Cross the energy hill—do not create energy',
    },
    hook: {
      zh: '木头可以燃烧，但放在桌上并不会自己起火；一根火柴却能点燃它。为什么一个会放热的反应，开始前还需要先得到一点能量？',
      en: 'Wood can burn, yet it does not burst into flame on a table; a match can start it. Why does an exothermic reaction still need some energy before it begins?',
    },
    hookHint: {
      zh: '开始反应时，粒子常要先碰撞到足够有力、并让旧键开始断裂的状态。这段起步所需的能量叫活化能。催化剂提供一条“较低的山路”，让更多粒子能成功反应；它不是燃料，也不会改变反应前后总能量差。',
      en: 'To begin reacting, particles often need sufficiently energetic collisions that start breaking old bonds. This start-up requirement is activation energy. A catalyst offers a lower “mountain route,” so more particles react successfully; it is not fuel and does not change the overall energy difference between start and finish.',
    },
    bigIdea: {
      zh: '活化能是反应起步必须跨过的能量门槛；催化剂降低门槛、提高反应速率，但不被永久消耗，也不改变反应是放热还是吸热。',
      en: 'Activation energy is the energy threshold a reaction must cross to start; a catalyst lowers that threshold and increases reaction rate, without being permanently used up or changing whether the reaction is exothermic or endothermic.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🔥',
        title: {
          zh: '火柴只是起点，不是全部燃料',
          en: 'A match starts; it is not all the fuel',
        },
        body: {
          zh: '火柴提供点火所需的起步能量。木头燃烧时释放的能量来自反应物本身的化学能变化；实际火灾风险很高，绝不在家尝试点火实验。',
          en: 'A match provides start-up energy. Energy released as wood burns comes from chemical energy changes in the reactants; real fire risk is serious, so never try ignition experiments at home.',
        },
      },
      {
        icon: '🍎',
        title: {
          zh: '身体里的酶像专属小路',
          en: 'Enzymes in your body are specialised routes',
        },
        body: {
          zh: '酶是生物催化剂，帮助体内反应在温和条件下进行。它们非常专一，不是可以随意替换或当作药物使用的“万能加速器”。',
          en: 'Enzymes are biological catalysts that help body reactions proceed under mild conditions. They are highly specific—not all-purpose accelerators that can be swapped or used as medicine casually.',
        },
      },
      {
        icon: '🚗',
        title: { zh: '汽车尾气净化器', en: 'Car exhaust catalytic converters' },
        body: {
          zh: '汽车上的催化转化器帮助某些有害气体更有效地转化为较少有害的物质。这是材料科学与环境工程合作的例子。',
          en: 'A car’s catalytic converter helps certain harmful gases convert more effectively into less harmful substances. It is an example of materials science and environmental engineering working together.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先认识“能量小山”', en: 'First meet the energy hill' },
        body: {
          zh: '把反应物想作在山谷一侧，生成物在另一侧。即使终点更低、整体会放出能量，也可能先要爬过一段山路，才能让原子重新组合。那段最高点对应活化能门槛。',
          en: 'Imagine reactants in one valley and products in another. Even if the endpoint is lower and energy is released overall, particles may first need to climb a hill before atoms can rearrange. The peak represents the activation-energy threshold.',
        },
      },
      {
        title: {
          zh: '催化剂改变路线，不改起点和终点',
          en: 'A catalyst changes the route, not start and finish',
        },
        body: {
          zh: '催化剂让反应走一条活化能更低的替代路径。图上反应物和生成物的能量位置保持不变，因此总能量变化仍相同；变的是跨过去有多容易。',
          en: 'A catalyst gives a different route with lower activation energy. On a diagram, reactant and product energy levels remain the same, so total energy change stays the same; what changes is how easily the barrier is crossed.',
        },
      },
      {
        title: {
          zh: '更快，不等于更多能量',
          en: 'Faster does not mean more energy',
        },
        body: {
          zh: '催化剂让单位时间内更多碰撞成功，所以反应更快；它不让每次反应额外释放能量，也不会把反应方向“翻转”。反应结束后，催化剂通常可以继续参与下一轮。',
          en: 'A catalyst lets more collisions succeed each second, so the reaction is faster; it does not make each reaction release extra energy or reverse the energy direction. Afterward, the catalyst can usually take part again.',
        },
      },
    ],
    misconception: {
      zh: '“催化剂给反应提供能量”不准确。它降低的是活化能门槛；“催化剂被用完”也不符合典型情况，尽管真实催化剂可能被污染或失效。别把反应更快误当成反应放出更多总能量。',
      en: '“A catalyst gives energy to a reaction” is inaccurate. It lowers the activation-energy threshold; “a catalyst gets used up” is also not typical, though real catalysts can be poisoned or stop working. Do not mistake a faster reaction for one that releases more total energy.',
    },
    mission: {
      zh: '路线设计师：画两条从“反应物山谷”到“生成物山谷”的路线，一条高山、一条低山。给低山标上“催化剂”；再用一句话解释为什么两条路线的起点和终点高度应相同。只做纸上模型，不进行燃烧、药品或清洁剂实验。',
      en: 'Route designer: draw two paths from a “reactant valley” to a “product valley”—one over a high hill, one lower. Label the low hill “catalyst,” then explain in one sentence why both paths should start and end at the same heights. Use a paper model only; do not experiment with fire, medicines or cleaners.',
    },
    vocabulary: [
      { en: 'activation energy', zh: '活化能' },
      { en: 'catalyst', zh: '催化剂' },
      { en: 'enzyme', zh: '酶' },
      { en: 'reaction pathway', zh: '反应路径' },
      { en: 'reaction rate', zh: '反应速率' },
    ],
    interactive: 'reaction-hill-lab',
    questions: [
      {
        id: 'activation-q1',
        prompt: {
          zh: '活化能最接近下面哪种意思？',
          en: 'What is activation energy closest to?',
        },
        options: [
          {
            zh: '让反应开始所需跨过的能量门槛',
            en: 'The energy threshold that must be crossed to start a reaction',
          },
          { zh: '反应产物的颜色', en: 'The colour of a reaction product' },
          { zh: '反应后容器的体积', en: 'The container volume after reaction' },
        ],
        answer: 0,
        explanation: {
          zh: '活化能是起步门槛。它解释了为什么某些总体放热的反应仍需要火花、加热或其他触发。',
          en: 'Activation energy is the start-up threshold. It explains why some overall exothermic reactions still need a spark, warmth or another trigger.',
        },
      },
      {
        id: 'activation-q2',
        prompt: {
          zh: '催化剂最直接改变了什么？',
          en: 'What does a catalyst most directly change?',
        },
        options: [
          {
            zh: '提供一条活化能较低的反应路径',
            en: 'It provides a pathway with lower activation energy',
          },
          {
            zh: '把反应物全部变成新元素',
            en: 'It turns all reactants into new elements',
          },
          { zh: '让能量守恒失效', en: 'It makes energy conservation fail' },
        ],
        answer: 0,
        explanation: {
          zh: '催化剂让更多粒子能越过门槛，因此反应加快；它不改变元素身份或能量守恒。',
          en: 'A catalyst lets more particles cross the threshold, speeding the reaction; it does not change element identity or energy conservation.',
        },
      },
      {
        id: 'activation-q3',
        prompt: {
          zh: '有催化剂时，反应前后总能量差通常怎样？',
          en: 'With a catalyst, what usually happens to the overall energy difference between reactants and products?',
        },
        options: [
          { zh: '保持不变', en: 'It stays the same' },
          { zh: '一定翻倍', en: 'It must double' },
          { zh: '一定变成零', en: 'It must become zero' },
        ],
        answer: 0,
        explanation: {
          zh: '催化剂降低中间门槛，不移动反应物和生成物的能量位置，所以总能量变化不变。',
          en: 'A catalyst lowers the intermediate barrier without moving reactant or product energy levels, so the overall energy change stays the same.',
        },
      },
      {
        id: 'activation-q4',
        prompt: {
          zh: '为什么酶对身体重要？',
          en: 'Why are enzymes important in the body?',
        },
        options: [
          {
            zh: '它们帮助特定反应在温和条件下更快进行',
            en: 'They help specific reactions proceed faster under mild conditions',
          },
          { zh: '它们让人体不需要能量', en: 'They mean bodies need no energy' },
          {
            zh: '它们把所有食物变成同一种物质',
            en: 'They turn all food into one substance',
          },
        ],
        answer: 0,
        explanation: {
          zh: '酶是高度专一的生物催化剂，能降低某些反应的活化能，使生命过程在合适条件下进行。',
          en: 'Enzymes are highly specific biological catalysts that lower activation energy for certain reactions, letting life processes proceed under suitable conditions.',
        },
      },
    ],
  },
];
