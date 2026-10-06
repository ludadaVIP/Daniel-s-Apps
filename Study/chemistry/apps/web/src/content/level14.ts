import type { Lesson } from './lessons';

export const level14Lessons: Lesson[] = [
  {
    id: 'what-makes-reactions-faster',
    levelId: 'rates',
    order: 58,
    title: {
      zh: '反应为什么有快有慢？',
      en: 'Why do reactions run at different speeds?',
    },
    eyebrow: {
      zh: '第 58 课 · 粒子碰撞的成功机会',
      en: 'Lesson 58 · Chances for successful collisions',
    },
    hook: {
      zh: '切开的苹果慢慢变褐，泡腾片在水中很快冒泡，铁钉却要很多天才生锈。反应的“快慢”由什么决定？',
      en: 'A cut apple browns slowly, an effervescent tablet bubbles quickly in water, while a nail rusts over days. What decides a reaction’s speed?',
    },
    hookHint: {
      zh: '反应需要有效碰撞：粒子要相遇、方向合适，还要有足够能量。升温、增加浓度、增大接触表面积或使用催化剂，都会让单位时间的成功碰撞变多，因此常让反应更快。',
      en: 'Reactions need successful collisions: particles must meet with suitable orientation and enough energy. Higher temperature, concentration, contact area or a catalyst can create more successful collisions per time, often speeding the reaction.',
    },
    bigIdea: {
      zh: '反应速率是“单位时间里反应进行得多快”。改变条件时，要追问它怎样改变了有效碰撞的次数或成功概率，而不是只背“温度高就快”。',
      en: 'Reaction rate means how much reaction happens per unit time. When conditions change, ask how they change the number or chance of successful collisions—not merely memorise “hotter is faster.”',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🍎',
        title: { zh: '冰箱减慢褐变', en: 'A fridge slows browning' },
        body: {
          zh: '低温让参与反应的粒子平均运动较慢，较少碰撞达到足够能量，所以许多变质过程会变慢；冰箱不会让食物永久不变。',
          en: 'Lower temperature makes average particle motion slower, so fewer collisions have enough energy. Many spoilage processes slow down, though a fridge does not stop time permanently.',
        },
      },
      {
        icon: '💊',
        title: {
          zh: '泡腾片与表面积',
          en: 'Effervescent tablets and surface area',
        },
        body: {
          zh: '同样质量的固体若磨碎，露出的表面积更大，液体能接触的地方更多，反应常更快。药物必须按说明使用，不能为了“更快”自行碾碎。',
          en: 'If the same mass of solid is crushed, more surface is exposed for liquid contact, often speeding a reaction. Medicines must be used as directed—never crush them just to make them “faster.”',
        },
      },
      {
        icon: '🥫',
        title: {
          zh: '食品保存的组合策略',
          en: 'Food preservation uses combined strategies',
        },
        body: {
          zh: '冷藏、密封、干燥或改变酸度都可能减少某些反应或微生物过程。真实食品安全很复杂，保存食品应遵守标签和卫生建议。',
          en: 'Chilling, sealing, drying or changing acidity can reduce certain reactions or microbial processes. Real food safety is complex, so follow labels and hygiene guidance.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先定义“速率”是在看时间',
          en: 'First define rate as a time story',
        },
        body: {
          zh: '观察气泡出现、颜色褪去、质量减少或某种产物增加时，都可以比较同一段时间内改变了多少。只说“反应发生了”不够；速率还要问“多快”。',
          en: 'When observing bubbles, colour fade, mass decrease or product increase, compare how much changes in the same time. “A reaction happened” is not enough; rate also asks “how fast?”',
        },
      },
      {
        title: {
          zh: '让粒子更常遇到、更有劲',
          en: 'Make particles meet more often and with more energy',
        },
        body: {
          zh: '浓度更高意味着同体积里可碰撞的粒子更多；温度更高意味着粒子更快，更多碰撞越过活化能门槛。两者都不是魔法，而是在改变碰撞统计。',
          en: 'Higher concentration means more particles able to collide in the same volume; higher temperature means faster particles, so more collisions cross the activation-energy threshold. Neither is magic—they change collision statistics.',
        },
      },
      {
        title: {
          zh: '只改一个条件，才看得懂原因',
          en: 'Change one condition to see a cause',
        },
        body: {
          zh: '若同时把水加热、搅拌又换成粉末，就很难知道谁让反应变快。公平实验应固定其他条件，只改变一个变量，并用相同方式记录时间或现象。',
          en: 'If you heat, stir and switch to powder all at once, you cannot know what sped the reaction. A fair experiment holds other conditions fixed, changes one variable, and records time or observations consistently.',
        },
      },
    ],
    misconception: {
      zh: '“任何条件变大，反应都更快”不对。关键是条件是否让有效碰撞增加；例如把固体块变大反而可能减少表面积。也别把“更快”理解为“会产生更多最终产物”——如果反应物量不变，速率只改变达到终点的时间。',
      en: '“Making any condition bigger always makes a reaction faster” is wrong. The key is whether successful collisions increase; making a solid block bigger may reduce surface area. Nor does faster mean more final product—if amounts are fixed, rate changes the time to reach the end.',
    },
    mission: {
      zh: '公平实验侦探：选“把糖搅进水里”这个安全例子，设计两次比较：一次只改水温，一次只改是否搅拌。写出每次要保持相同的三项条件。注意这观察的是溶解速度，不是化学反应；它能训练公平比较的方法。',
      en: 'Fair-test detective: use the safe example “dissolving sugar in water.” Design two comparisons: change only water temperature once, and only stirring once. List three conditions to keep equal each time. This observes dissolving speed, not a chemical reaction, but it trains fair comparison.',
    },
    vocabulary: [
      { en: 'reaction rate', zh: '反应速率' },
      { en: 'successful collision', zh: '有效碰撞' },
      { en: 'concentration', zh: '浓度' },
      { en: 'surface area', zh: '表面积' },
      { en: 'controlled variable', zh: '控制变量' },
    ],
    interactive: 'reaction-rate-lab',
    questions: [
      {
        id: 'rate-q1',
        prompt: {
          zh: '升高温度常让反应加快的最佳粒子解释是什么？',
          en: 'What is the best particle explanation for higher temperature often speeding a reaction?',
        },
        options: [
          {
            zh: '粒子平均运动更快，更多碰撞有足够能量',
            en: 'Particles move faster on average, so more collisions have enough energy',
          },
          { zh: '温度制造了更多元素', en: 'Temperature creates more elements' },
          { zh: '所有粒子都会停止运动', en: 'All particles stop moving' },
        ],
        answer: 0,
        explanation: {
          zh: '升温会改变粒子的运动和碰撞能量；更多碰撞能越过活化能门槛，成功反应的机会变大。',
          en: 'Warming changes particle motion and collision energy; more collisions can cross activation energy, increasing chances of successful reaction.',
        },
      },
      {
        id: 'rate-q2',
        prompt: {
          zh: '同质量固体磨成粉后常反应更快，主要因为？',
          en: 'Why can the same mass of solid react faster after being powdered?',
        },
        options: [
          {
            zh: '暴露的表面积更大，接触机会更多',
            en: 'More surface area is exposed, creating more contact opportunities',
          },
          { zh: '粉末变成了新元素', en: 'Powder becomes a new element' },
          { zh: '质量自动增加了', en: 'Its mass automatically increases' },
        ],
        answer: 0,
        explanation: {
          zh: '磨碎没有改变物质身份或总质量，却暴露更多表面，可让更多粒子同时接触并碰撞。',
          en: 'Grinding does not change identity or total mass, but exposes more surface so more particles can contact and collide at once.',
        },
      },
      {
        id: 'rate-q3',
        prompt: {
          zh: '研究浓度对反应速率的影响时，哪种设计更公平？',
          en: 'Which design is fairest for studying concentration’s effect on rate?',
        },
        options: [
          {
            zh: '只改变浓度，保持温度、体积和固体形状等条件相同',
            en: 'Change only concentration; keep temperature, volume and solid shape alike',
          },
          {
            zh: '同时改变浓度、温度和固体质量',
            en: 'Change concentration, temperature and solid mass together',
          },
          {
            zh: '每次都使用不同的计时方法',
            en: 'Use a different timing method each time',
          },
        ],
        answer: 0,
        explanation: {
          zh: '只改一个变量，才可合理把速率差异归因于这个变量；其余条件是控制变量。',
          en: 'Changing one variable allows a rate difference to be reasonably attributed to it; the others are controlled variables.',
        },
      },
      {
        id: 'rate-q4',
        prompt: {
          zh: '如果反应物总量相同，让反应更快通常直接改变什么？',
          en: 'If total reactant amounts are the same, what does making a reaction faster directly change?',
        },
        options: [
          {
            zh: '到达终点所需的时间',
            en: 'The time needed to reach the endpoint',
          },
          { zh: '元素的原子序数', en: 'The atomic number of elements' },
          { zh: '能量守恒定律', en: 'The law of energy conservation' },
        ],
        answer: 0,
        explanation: {
          zh: '速率改变单位时间完成多少反应。材料总量固定时，最终能得到多少受限于反应物，主要变化是完成得多快。',
          en: 'Rate changes how much reaction completes per time. With fixed materials, final amount is limited by reactants; the main change is how quickly it completes.',
        },
      },
    ],
  },
];
