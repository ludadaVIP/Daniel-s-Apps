import type { Lesson } from './lessons';

export const level15Lessons: Lesson[] = [
  {
    id: 'dynamic-equilibrium-not-stillness',
    levelId: 'equilibrium',
    order: 59,
    title: {
      zh: '化学平衡：看起来不变，里面仍在忙',
      en: 'Chemical equilibrium: unchanged outside, busy inside',
    },
    eyebrow: {
      zh: '第 59 课 · 密封世界里的双向交通',
      en: 'Lesson 59 · Two-way traffic in a sealed world',
    },
    hook: {
      zh: '一瓶没打开的气泡水里，二氧化碳不断溶进水、也不断从水里跑出来；为什么一段时间后看起来却没什么变化？',
      en: 'In an unopened fizzy drink, carbon dioxide continually dissolves into water and also leaves it. Why can the bottle look unchanged after a while?',
    },
    hookHint: {
      zh: '在密闭系统中，正向过程和逆向过程可以同时发生。当两边速率相等时，宏观数量不再改变，这就是动态平衡：不是停了，而是两边刚好一样快。',
      en: 'In a closed system, forward and reverse processes can occur together. When their rates become equal, macroscopic amounts stop changing. That is dynamic equilibrium: not stopped, but equally fast in both directions.',
    },
    bigIdea: {
      zh: '动态平衡要求密闭、可逆，并且正逆反应速率相等；平衡时反应物和生成物的量保持恒定，但通常不相等，粒子层面的变化仍在发生。',
      en: 'Dynamic equilibrium requires a closed, reversible system with equal forward and reverse rates. At equilibrium, reactant and product amounts stay constant but are not usually equal, and particle-level change continues.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🫧',
        title: { zh: '未开封汽水与气泡', en: 'Unopened soda and fizz' },
        body: {
          zh: '密封时，二氧化碳在液体和上方空间之间双向移动，最后达到动态平衡。打开瓶盖后系统不再密闭，气体逸出，平衡被打破。',
          en: 'When sealed, carbon dioxide moves both ways between liquid and headspace, eventually reaching dynamic equilibrium. Opening the cap removes the closed system; gas escapes and the balance is disturbed.',
        },
      },
      {
        icon: '🚪',
        title: { zh: '两扇门间的人流', en: 'People moving between two rooms' },
        body: {
          zh: '每分钟从 A 房进 B 房的人数若等于从 B 房进 A 房的人数，两边人数保持不变，但人并没有停止走动。这是理解动态平衡的好比喻。',
          en: 'If people moving A→B each minute equal people moving B→A, room populations stay constant though nobody has stopped moving. It is a useful analogy for dynamic equilibrium.',
        },
      },
      {
        icon: '💧',
        title: { zh: '密闭盒里的水蒸气', en: 'Water vapour in a sealed box' },
        body: {
          zh: '密闭容器中的水会蒸发，水蒸气也会凝结。达到平衡后，液面高度和蒸气量看似稳定，但两种变化仍同时发生。',
          en: 'Water in a sealed container evaporates, while vapour condenses. At equilibrium, liquid level and vapour amount look steady, but both changes still occur.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先确认它能双向走',
          en: 'First confirm it can go both ways',
        },
        body: {
          zh: '可逆过程既能朝生成物方向进行，也能从生成物回到反应物。刚开始通常正向更快；随着生成物增多，逆向机会也增加。',
          en: 'A reversible process can go toward products and also from products back to reactants. At first the forward direction is often faster; as products build up, reverse opportunities increase.',
        },
      },
      {
        title: {
          zh: '比较速率，不是比较存量',
          en: 'Compare rates, not stock amounts',
        },
        body: {
          zh: '平衡条件是“正向速率 = 逆向速率”，不是“反应物数量 = 生成物数量”。两边存量可以很不相同，只要每秒双向转换数目相同，宏观量就保持稳定。',
          en: 'The equilibrium condition is “forward rate = reverse rate,” not “reactant amount = product amount.” Amounts may differ greatly; if the same number convert both ways each second, macroscopic amounts stay steady.',
        },
      },
      {
        title: { zh: '密闭是为什么重要', en: 'Why closed matters' },
        body: {
          zh: '若生成物不断跑掉，逆向反应缺少材料，系统很难建立同样的双向平衡。研究平衡时，要先问物质能否进出系统。',
          en: 'If products continually escape, the reverse process lacks material, making the same two-way balance hard to establish. When studying equilibrium, first ask whether matter can enter or leave.',
        },
      },
    ],
    misconception: {
      zh: '“平衡就是静止”是最常见误解。动态平衡中粒子一直在反应，只是正反两个方向的速率相等。另一个误区是“平衡时两边一样多”；相等的是速率，不是数量。',
      en: '“Equilibrium means stopped” is the most common misconception. In dynamic equilibrium, particles keep reacting; only the forward and reverse rates are equal. Another mistake is “both sides have equal amounts”; rates are equal, not necessarily quantities.',
    },
    mission: {
      zh: '纸上人流模型：画 A、B 两个房间。第一分钟画 5 人 A→B、1 人 B→A；随后调整到每分钟 3 人双向移动。记录每个时刻两边人数与“是否仍有人移动”，再解释哪个时刻是动态平衡。',
      en: 'Paper people-flow model: draw rooms A and B. In minute one, move 5 people A→B and 1 B→A; later adjust to 3 people moving each way per minute. Track populations and whether anyone still moves, then explain which moment is dynamic equilibrium.',
    },
    vocabulary: [
      { en: 'dynamic equilibrium', zh: '动态平衡' },
      { en: 'reversible', zh: '可逆的' },
      { en: 'forward reaction', zh: '正向反应' },
      { en: 'reverse reaction', zh: '逆向反应' },
      { en: 'closed system', zh: '密闭系统' },
    ],
    interactive: 'equilibrium-shuttle-lab',
    questions: [
      {
        id: 'equilibrium-q1',
        prompt: {
          zh: '动态平衡时，正向和逆向反应最关键的关系是什么？',
          en: 'At dynamic equilibrium, what is the key relationship between forward and reverse reactions?',
        },
        options: [
          { zh: '它们的速率相等', en: 'Their rates are equal' },
          { zh: '它们完全停止', en: 'They both stop completely' },
          { zh: '它们的物质量一定相等', en: 'Their amounts must be equal' },
        ],
        answer: 0,
        explanation: {
          zh: '动态平衡的“平衡”指双向变化一样快；因此宏观数量不再改变，但微观反应继续。',
          en: 'The “balance” of dynamic equilibrium means the two directions are equally fast; macroscopic amounts stop changing while microscopic reaction continues.',
        },
      },
      {
        id: 'equilibrium-q2',
        prompt: {
          zh: '为什么打开汽水盖后气泡会不断逸出？',
          en: 'Why do bubbles keep escaping after a soda cap is opened?',
        },
        options: [
          {
            zh: '系统不再密闭，气体可以离开，原有平衡被破坏',
            en: 'The system is no longer closed; gas can leave and the prior balance is disturbed',
          },
          {
            zh: '二氧化碳变成了元素周期表',
            en: 'Carbon dioxide becomes the periodic table',
          },
          { zh: '水分子不再运动', en: 'Water molecules stop moving' },
        ],
        answer: 0,
        explanation: {
          zh: '打开后，气体可逃到外界，逆向过程不再能以同样方式补回，因此密封瓶内的平衡条件消失。',
          en: 'After opening, gas can escape outside; the reverse process cannot replenish it in the same way, so the sealed-bottle equilibrium conditions disappear.',
        },
      },
      {
        id: 'equilibrium-q3',
        prompt: {
          zh: '两边人数不同，但每分钟 A→B 与 B→A 都是 3 人。这说明什么？',
          en: 'Room populations differ, but 3 people per minute move A→B and B→A. What does this show?',
        },
        options: [
          {
            zh: '这是动态平衡的类比：存量可不同，双向速率相等',
            en: 'It models dynamic equilibrium: amounts may differ while rates are equal',
          },
          { zh: '所有人已经停止移动', en: 'Everyone has stopped moving' },
          {
            zh: '两边人数必须立刻一样',
            en: 'Both rooms must immediately have equal people',
          },
        ],
        answer: 0,
        explanation: {
          zh: '每分钟双向流量相等，所以各房间人数不再改变；人数可以不同，移动仍在继续。',
          en: 'Equal two-way flow each minute keeps each room population unchanged; populations can differ and movement continues.',
        },
      },
      {
        id: 'equilibrium-q4',
        prompt: {
          zh: '建立化学动态平衡通常需要什么系统条件？',
          en: 'What system condition is usually needed to establish chemical dynamic equilibrium?',
        },
        options: [
          {
            zh: '物质不随意进出的密闭系统',
            en: 'A closed system where matter does not freely enter or leave',
          },
          {
            zh: '所有物质都必须是同一种颜色',
            en: 'All substances must be the same colour',
          },
          {
            zh: '反应必须立刻完成',
            en: 'The reaction must finish immediately',
          },
        ],
        answer: 0,
        explanation: {
          zh: '密闭帮助反应物和生成物都留在系统中，使双向过程都有机会持续发生并达到相等速率。',
          en: 'Being closed keeps reactants and products in the system, allowing both directions to continue and potentially reach equal rates.',
        },
      },
    ],
  },
];
