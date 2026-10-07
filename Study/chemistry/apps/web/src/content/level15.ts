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
  {
    id: 'equilibrium-after-a-disturbance',
    levelId: 'equilibrium',
    order: 76,
    title: {
      zh: '平衡被打扰以后：调整，不是倒带',
      en: 'After disturbing equilibrium: adjust, not rewind',
    },
    eyebrow: {
      zh: '第 76 课 · 先看瞬间，再看重新反应',
      en: 'Lesson 76 · First the instant, then the reaction',
    },
    hook: {
      zh: '把气体容器压小，粒子会立刻变少吗？向平衡体系加入一些生成物，它会把加入的全部“退回去”吗？平衡的调整有方向，却不等于回到原来的照片。',
      en: 'Compress a gas container: do particles vanish immediately? Add some product to an equilibrium: does it undo the whole addition? An adjustment has a direction, but need not restore the original snapshot.',
    },
    hookHint: {
      zh: '接上第 59 课：相等的是正逆速率，不是两边数量。扰动可能先改变浓度或速率，再让净反应朝某个方向进行，直到速率重新相等。',
      en: 'Recall Lesson 59: forward and reverse rates match, not necessarily amounts. A disturbance first changes concentration or rates, then a net reaction proceeds until the rates match again.',
    },
    bigIdea: {
      zh: '平衡体系会朝抵抗扰动的方向调整；新的平衡仍在双向反应，但不必恢复原来的组成。',
      en: 'An equilibrium adjusts in a direction opposing a disturbance; both directions continue at the new equilibrium, without necessarily restoring the original composition.',
    },
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '🫧',
        title: {
          zh: '汽水开盖：少了上方的气体',
          en: 'Opening soda removes gas above the liquid',
        },
        body: {
          zh: '开盖让上方二氧化碳逸出，液体中更多二氧化碳会释放出来。持续敞开的瓶子已不是原来的密闭系统，不能把冒泡误称为始终保持原平衡。',
          en: 'Opening the cap lets CO₂ escape from the headspace, so more can leave the liquid. A bottle left open is no longer the original closed system; fizzing does not mean its old equilibrium remains intact.',
        },
      },
      {
        icon: '🌾',
        title: {
          zh: '制造氨：快慢与产量一起考虑',
          en: 'Making ammonia: consider speed and yield',
        },
        body: {
          zh: 'N₂ + 3H₂ ⇌ 2NH₃ 的正向过程放热。较高压强有利于气体份数较少的氨一侧；升温虽常加快速率，却不利于该放热方向的平衡产率。工业会权衡，而不是追求“越热越好”。',
          en: 'The forward reaction N₂ + 3H₂ ⇌ 2NH₃ releases heat. Higher pressure favours the ammonia side with fewer gas moles. Heating often speeds reaction but lowers the equilibrium yield for this exothermic direction, so industry balances the trade-offs.',
        },
      },
      {
        icon: '🛤️',
        title: {
          zh: '催化剂：让路更好走',
          en: 'Catalysts make the route easier',
        },
        body: {
          zh: '催化剂让正、逆过程更快，却不把同条件下的平衡位置推到另一边。它帮助更快达到平衡，不是保证多出一份最终产物的“魔法按钮”。',
          en: 'A catalyst speeds both directions without pushing the equilibrium position to a new side under the same conditions. It helps equilibrium be reached sooner, not magically guaranteeing more final product.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '分开“刚发生”和“反应之后”',
          en: 'Separate the instant from the later reaction',
        },
        body: {
          zh: '用虚构气体 A₂ ⇌ 2A 学规律，正向设为吸热。压小体积的瞬间，A₂ 与 A 的份数都没改变，只是空间更小、浓度更高。随后净反应可朝气体份数较少的 A₂ 一侧进行。不是压一下就把粒子删掉。',
          en: 'Use fictional gases A₂ ⇌ 2A with an endothermic forward direction. At the instant of compression, neither amount changes; smaller space raises concentration. Afterwards the net reaction can favour A₂, the side with fewer gas portions. Compression does not delete particles.',
        },
      },
      {
        title: {
          zh: '例题：增加生成物后会全退回吗？',
          en: 'Worked example: is added product completely undone?',
        },
        body: {
          zh: '原来有 2 份 A₂ 与 2 份 A，A 原子账本是 2×2+2 = 6。只加 2 份 A，瞬间变为 2 与 4，账本变为 8。模型重新平衡后约为 2.81 份 A₂ 与 2.37 份 A：消耗了一部分新加的 A，却没回到原来的 2 份 A。',
          en: 'Start with 2 portions A₂ and 2 portions A: atomic inventory is 2×2+2 = 6. Add 2 portions A: immediately amounts are 2 and 4, with inventory 8. The model re-equilibrates to about 2.81 A₂ and 2.37 A: some added A is consumed, but A does not return to its original 2 portions.',
        },
      },
      {
        title: {
          zh: '每种扰动，都问同一个问题',
          en: 'Ask the same question for each disturbance',
        },
        body: {
          zh: '压缩：哪边气体份数更少？升温：哪边方向吸热？加入 A：哪边能消耗一部分 A？催化剂：有没有改变两边的相对平衡关系？最终检查正逆速率是否重新相等、原子账本是否对得上。',
          en: 'Compression: which side has fewer gas portions? Heating: which direction absorbs heat? Adding A: which direction consumes some A? Catalyst: did the relative equilibrium relationship change? Finally check matching forward/reverse rates and the atomic inventory.',
        },
      },
    ],
    misconception: {
      zh: '“抵抗扰动”不是“完全取消扰动”。压缩后 A 的份数可能减少，但因为体积也缩小了，A 的浓度仍可能比原来高。讨论压强影响要看气体反应系数；两边气体份数相同的理想反应不会仅因压缩而偏向一边。',
      en: 'Opposing a disturbance does not cancel it completely. After compression, A amount may fall while its concentration remains higher than before because volume also shrank. Pressure effects depend on gas coefficients; equal gas-mole counts on both sides do not favour a side merely through ideal compression.',
    },
    mission: {
      zh: '在虚拟体系里分别试压缩、升温、催化剂和加入 A。先预测“从扰动刚发生到重新平衡”A 的份数怎样变，再看三段账本。选加入 A 时，解释为什么最终原子总量是 8 而不是 6；催化剂时，找出“仍在反应”的证据。',
      en: 'Try compression, heating, catalyst and adding A in the virtual system. Predict how A amount changes from the disturbed instant to the new equilibrium, then inspect the three-stage ledger. For added A, explain inventory 8 rather than 6; for catalyst, find evidence that reaction continues.',
    },
    vocabulary: [
      { en: 'Le Châtelier’s principle', zh: '勒夏特列原理' },
      { en: 'disturbance', zh: '扰动' },
      { en: 'equilibrium position', zh: '平衡位置' },
      { en: 'net reaction', zh: '净反应' },
      { en: 'catalyst', zh: '催化剂' },
    ],
    resources: [
      {
        title: {
          zh: '高中拓展（英文）：平衡扰动与工业制氨 · OpenStax',
          en: 'Optional advanced reading: shifting equilibria and ammonia production · OpenStax',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle',
      },
    ],
    interactive: 'equilibrium-shift-lab',
    questions: [
      {
        id: 'equilibrium-shift-q1',
        prompt: {
          zh: '恒温压缩气体 A₂ ⇌ 2A 的密闭体系，重新反应时倾向哪边？',
          en: 'At constant temperature, a closed gas system A₂ ⇌ 2A is compressed. Which side is favoured as it reacts again?',
        },
        options: [
          { zh: '气体份数更多的 2A 一侧', en: '2A, with more gas portions' },
          {
            zh: '一定不变，因为元素没有变',
            en: 'Always unchanged because elements are unchanged',
          },
          { zh: '气体份数较少的 A₂ 一侧', en: 'A₂, with fewer gas portions' },
        ],
        answer: 2,
        explanation: {
          zh: '一份 A₂ 与两份 A 相比，A₂ 方向让气体份数减少，符合对压缩扰动的调整。原子种类不变不代表组成不变。',
          en: 'One A₂ portion versus two A portions: the A₂ direction reduces gas portions and opposes compression. Unchanged elements do not imply unchanged composition.',
        },
      },
      {
        id: 'equilibrium-shift-q2',
        prompt: {
          zh: '压缩刚发生、还没来得及重新反应，A 的份数怎样？',
          en: 'Immediately after compression, before further reaction, what happens to the amount of A?',
        },
        options: [
          {
            zh: '不变，先变的是体积和浓度',
            en: 'Unchanged; volume and concentration change first',
          },
          { zh: '立即减半', en: 'Immediately halved' },
          { zh: '立即变成零', en: 'Immediately becomes zero' },
        ],
        answer: 0,
        explanation: {
          zh: '机械压缩先让相同粒子占据更小空间。之后的化学反应才改变 A 与 A₂ 的份数，要分清两段过程。',
          en: 'Mechanical compression puts the same particles in less space first. Later reaction changes A and A₂ amounts; distinguish the two stages.',
        },
      },
      {
        id: 'equilibrium-shift-q3',
        prompt: {
          zh: '本课 A₂ → 2A 设为吸热，升温后的平衡倾向哪边？',
          en: 'Here A₂ → 2A is endothermic. Which direction does heating favour at equilibrium?',
        },
        options: [
          {
            zh: 'A₂ 一侧，因为升温总是减少所有气体',
            en: 'A₂, because heating always reduces all gases',
          },
          {
            zh: '2A 一侧，吸热方向更有利',
            en: '2A: the endothermic direction is favoured',
          },
          { zh: '一定没有变化', en: 'No change is possible' },
        ],
        answer: 1,
        explanation: {
          zh: '必须先知道哪边吸热，才能判断温度影响。不要把本课方向直接照搬给正向放热的制氨反应。',
          en: 'Find the endothermic direction before predicting temperature effects. Do not copy this direction into ammonia synthesis, whose forward reaction is exothermic.',
        },
      },
      {
        id: 'equilibrium-shift-q4',
        prompt: {
          zh: '在已平衡体系中加入理想催化剂、其他条件不变，会怎样？',
          en: 'Add an ideal catalyst to an equilibrated system, with other conditions unchanged. What happens?',
        },
        options: [
          {
            zh: '最终一定多生成物',
            en: 'There must be more product at equilibrium',
          },
          { zh: '正向加快，逆向停止', en: 'Forward speeds up; reverse stops' },
          {
            zh: '平衡组成不变，两个方向仍反应且都加快',
            en: 'Equilibrium composition stays fixed; both directions continue faster',
          },
        ],
        answer: 2,
        explanation: {
          zh: '催化剂改变达到平衡的速率，不改变同条件下的平衡位置。已平衡时，两边继续以相等的速率转化。',
          en: 'A catalyst changes how quickly equilibrium is reached, not its position under the same conditions. At equilibrium, both directions still convert at matching rates.',
        },
      },
      {
        id: 'equilibrium-shift-q5',
        prompt: {
          zh: '加入 A 后，体系消耗了部分 A。最终一定恢复原来的 A 份数吗？',
          en: 'After adding A, the system consumes some A. Must its final amount equal the original amount?',
        },
        options: [
          {
            zh: '不一定；调整只抵抗部分影响，新的总原子量也变了',
            en: 'Not necessarily: adjustment opposes the change, and total inventory has changed',
          },
          { zh: '一定，否则就不叫平衡', en: 'Yes, or it is not equilibrium' },
          {
            zh: '一定，因为新增原子会消失',
            en: 'Yes, because new atoms vanish',
          },
        ],
        answer: 0,
        explanation: {
          zh: '本课原子账本从 6 增到 8，不会自动退回 6。新平衡要求速率相等，而不是复制旧照片。',
          en: 'The model’s atomic inventory grows from 6 to 8 and does not revert automatically. New equilibrium needs equal rates, not an identical old snapshot.',
        },
      },
      {
        id: 'equilibrium-shift-q6',
        prompt: {
          zh: '压缩后 A 从 2 份降到 1.5 份，体积从 1 降到 0.5，A 的浓度怎样比较？',
          en: 'After compression and adjustment, A falls from 2 to 1.5 portions while volume falls from 1 to 0.5. Compare A concentrations.',
        },
        options: [
          { zh: '下降，因为份数下降', en: 'Lower because amount fell' },
          {
            zh: '升高：2/1 = 2，而 1.5/0.5 = 3',
            en: 'Higher: 2/1 = 2, while 1.5/0.5 = 3',
          },
          { zh: '一定为零', en: 'It must be zero' },
        ],
        answer: 1,
        explanation: {
          zh: '浓度是份数除以体积。只看分子数量而忽略分母，会把“份数减少”误读为“浓度一定减少”。',
          en: 'Concentration is amount divided by volume. Ignoring the denominator mistakes falling amount for necessarily falling concentration.',
        },
      },
    ],
  },
];
