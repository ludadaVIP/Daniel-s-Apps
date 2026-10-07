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
      zh: '“任何条件变大，反应都更快”不对，关键是有效碰撞有没有增加。“更快”也不等于“最终更多”：同样的限制反应物完全反应、且没有改变其他产量条件时，速率主要改变完成时间。可逆反应若改变温度等平衡条件，最终组成也可能改变，不能一概而论。',
      en: '“Making any condition bigger always makes a reaction faster” is wrong: ask about successful collisions. Faster is not automatically more product. With the same limiting reactant fully consumed and other yield conditions unchanged, rate mainly changes completion time. Changing equilibrium conditions such as temperature in a reversible reaction may also change final composition.',
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
          zh: '同样的限制反应物完全反应，其他产量条件不变，若只让反应更快，最直接改变什么？',
          en: 'With the same limiting reactant fully consumed and other yield conditions unchanged, what does increasing rate directly change?',
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
          zh: '在题目给定的完全反应条件下，限制反应物决定最终产量；提高速率改变达到该产量所需的时间。不要把这个结论外推到温度改变平衡组成的情形。',
          en: 'Under the stated complete-reaction conditions, the limiting reactant determines final yield; increasing rate changes the time to reach it. Do not extend this conclusion to temperature changes that alter equilibrium composition.',
        },
      },
    ],
  },
  {
    id: 'fair-tests-and-rate-curves',
    levelId: 'rates',
    order: 75,
    title: {
      zh: '曲线侦探：谁让反应变快了？',
      en: 'Curve detective: what made the reaction faster?',
    },
    eyebrow: {
      zh: '第 75 课 · 先选对照，再读证据',
      en: 'Lesson 75 · Choose controls, then read evidence',
    },
    hook: {
      zh: '一组石灰石碎块与酸冒泡较慢，另一组又加热、又磨成粉，冒泡很快。我们能宣布“全是升温的功劳”吗？曲线看起来漂亮，也可能回答不了原来的问题。',
      en: 'Limestone chips fizz slowly with acid. Another trial is heated and powdered, and fizzes quickly. Can we give temperature all the credit? An impressive graph may still fail to answer the original question.',
    },
    hookHint: {
      zh: '接上第 58 课的碰撞模型。先决定要研究哪个条件，再找只改变它的两组记录；最后用同一段时间内的气体增量比较速率。',
      en: 'Build on collision theory in Lesson 58. Pick the condition to study, find two trials changing only that condition, then compare gas gained over the same time interval.',
    },
    bigIdea: {
      zh: '公平比较先控制变量，再用曲线的斜率看快慢；终点高度回答的是最终产量。',
      en: 'Control variables first, then use curve slope for speed; endpoint height describes final yield.',
    },
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '🥤',
        title: { zh: '气泡不是一把秒表', en: 'Bubbles are not a stopwatch' },
        body: {
          zh: '泡泡的大小与数量会受装置影响。比较反应快慢时，记录同一方式收集的气体体积随时间怎样变化，比只说“看上去很多泡”更有依据。',
          en: 'Bubble size and count depend on the setup. Measuring collected gas volume against time in the same way is stronger evidence than “it looks very bubbly.”',
        },
      },
      {
        icon: '🍎',
        title: {
          zh: '苹果褐变也要公平比较',
          en: 'Browning apples need fair comparisons too',
        },
        body: {
          zh: '想比较温度，就要尽量固定苹果品种、切片厚度、放置时间和拍照光线。把多项条件同时改掉，最后无法把差异归给某一项。',
          en: 'To compare temperature, match apple type, slice thickness, observation time and lighting as far as possible. Changing many conditions prevents attributing a difference to just one.',
        },
      },
      {
        icon: '📈',
        title: {
          zh: '先到不等于得到更多',
          en: 'Arriving first is not getting more',
        },
        body: {
          zh: '同质量碳酸钙完全反应，盐酸都足量，气体读数换算到相同温度与压强：更快的那组可以更早达到同一终点，而不是制造更多碳原子。',
          en: 'With the same mass of calcium carbonate fully reacted, excess HCl and gas readings at a common temperature and pressure, the faster trial can reach the same endpoint sooner. It does not create extra carbon atoms.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先找到只差一个条件的两组',
          en: 'Find two trials differing in one condition',
        },
        body: {
          zh: '虚拟记录 A 与 B 的固体大小、温度、固体质量和液体体积相同，只有盐酸浓度不同，所以能研究浓度的影响。A 与 C 同时改变温度和表面积，不能单独证明是哪一项造成差异。',
          en: 'Virtual trials A and B match solid size, temperature, solid mass and liquid volume; only HCl concentration differs. They can test concentration. A and C change temperature and surface area together, so cannot isolate either cause.',
        },
      },
      {
        title: {
          zh: '例题：20 秒里增加了多少？',
          en: 'Worked example: how much in 20 seconds?',
        },
        body: {
          zh: '教学记录中，A 在 0–20 s 收集 15 mL，B 收集 25 mL。平均气体产生速率：A = 15 ÷ 20 = 0.75 mL/s；B = 25 ÷ 20 = 1.25 mL/s。这段时间 B 更快。看的是体积变化除以时间变化，不是只看一个最后读数。',
          en: 'In the teaching records, A collects 15 mL and B 25 mL in 0–20 s. Average gas production rates: A = 15 ÷ 20 = 0.75 mL/s; B = 25 ÷ 20 = 1.25 mL/s. B is faster over this interval. Use volume change divided by time change, not a final reading alone.',
        },
      },
      {
        title: { zh: '把斜率与终点分开', en: 'Separate slope from endpoint' },
        body: {
          zh: 'B 的前段曲线更陡，却和 A 一样最终停在 40 mL。斜率说明单位时间变化多少；平台高度说明累计得到多少。本课假设碳酸钙是限制反应物、两组都完全反应，并忽略漏气等损失。真实实验还需重复读数和检查误差。',
          en: 'B has a steeper early curve yet ends at the same 40 mL as A. Slope tells change per time; plateau height tells cumulative yield. Here calcium carbonate is limiting, both trials finish and gas losses are ignored. Real experiments also need repeats and error checks.',
        },
      },
    ],
    misconception: {
      zh: '曲线最高不一定代表反应最快，曲线最陡也不代表最终产量最多。平均速率要指定时间段；同时改变两项条件的记录，不能只凭更快就给其中一项“定罪”。',
      en: 'The highest curve is not necessarily the fastest, and the steepest curve need not yield the most product. Average rate needs a stated interval. A faster trial changing two conditions cannot prove which one caused the change.',
    },
    mission: {
      zh: '在虚拟记录台上，分别研究浓度、温度和表面积，挑出合适的对照组。故意试一次 A+C，读懂为什么不能单独归因。再把计算区间从 0–20 s 改成 10–30 s，解释为什么平均速率改变。不要在家用酸与石灰石复现实验。',
      en: 'On the virtual bench, select controls for concentration, temperature and surface area. Try A+C deliberately and explain why it cannot isolate a cause. Change the calculation interval from 0–20 s to 10–30 s and explain the new average rate. Do not recreate the acid–limestone experiment at home.',
    },
    vocabulary: [
      { en: 'independent variable', zh: '自变量' },
      { en: 'controlled variable', zh: '控制变量' },
      { en: 'average rate', zh: '平均速率' },
      { en: 'gradient / slope', zh: '斜率' },
      { en: 'plateau', zh: '平台' },
    ],
    resources: [
      {
        title: {
          zh: '拓展（英文，14–16岁）：怎样读反应速率图 · RSC',
          en: 'Optional reading (ages 14–16): interpreting reaction-rate graphs · RSC',
        },
        url: 'https://edu.rsc.org/lesson-plans/interpreting-rate-of-reaction-graphs-14-16-years/95.article',
      },
    ],
    interactive: 'rate-evidence-lab',
    questions: [
      {
        id: 'rate-evidence-q1',
        prompt: {
          zh: '研究温度影响时，哪一组比较更有说服力？',
          en: 'Which comparison gives stronger evidence about temperature?',
        },
        options: [
          {
            zh: '温度与固体大小都不同',
            en: 'Temperature and solid size both differ',
          },
          {
            zh: '只改温度，其他关键条件相同',
            en: 'Only temperature changes; other key conditions match',
          },
          {
            zh: '温度相同，浓度不同',
            en: 'Temperature matches; concentration differs',
          },
        ],
        answer: 1,
        explanation: {
          zh: '先固定其他关键变量，差异才可以与温度联系起来。第三项适合研究浓度，却不是温度。',
          en: 'Hold other key variables fixed before linking differences to temperature. The third choice tests concentration, not temperature.',
        },
      },
      {
        id: 'rate-evidence-q2',
        prompt: {
          zh: '10 s 时 8 mL，30 s 时 21 mL，这段平均气体产生速率是多少？',
          en: 'Gas volume is 8 mL at 10 s and 21 mL at 30 s. What is the average rate over this interval?',
        },
        options: [
          { zh: '0.65 mL/s', en: '0.65 mL/s' },
          { zh: '0.70 mL/s', en: '0.70 mL/s' },
          { zh: '13 mL/s', en: '13 mL/s' },
        ],
        answer: 0,
        explanation: {
          zh: '体积增量 21−8 = 13 mL，时间增量 30−10 = 20 s，所以 13÷20 = 0.65 mL/s。21÷30 把起点以前的时间与气体也算进去了。',
          en: 'Volume gain is 21−8 = 13 mL over 30−10 = 20 s, giving 13÷20 = 0.65 mL/s. Using 21÷30 includes time and gas before this interval.',
        },
      },
      {
        id: 'rate-evidence-q3',
        prompt: {
          zh: 'B 比 A 更早停在同样的 40 mL，最合理的解释是什么？',
          en: 'B reaches the same 40 mL plateau sooner than A. What is the best interpretation?',
        },
        options: [
          { zh: 'B 制造了更多碳原子', en: 'B created more carbon atoms' },
          { zh: 'A 没有发生反应', en: 'A never reacted' },
          {
            zh: 'B 更快，但本次最终气体产量相同',
            en: 'B is faster, but final gas yield is the same here',
          },
        ],
        answer: 2,
        explanation: {
          zh: '在本课完整反应、相同限制反应物和相同气体测量条件下，终点相同；到达终点的时间不同说明速率不同。',
          en: 'Under this lesson’s complete-reaction, equal-limiting-reactant and common gas-measurement conditions, endpoints match. Different completion times show different rates.',
        },
      },
      {
        id: 'rate-evidence-q4',
        prompt: {
          zh: '累计气体体积曲线在某段变平，说明什么？',
          en: 'What does a flattening cumulative gas-volume curve indicate?',
        },
        options: [
          {
            zh: '单位时间内增加的气体越来越少',
            en: 'Less gas is gained per unit time',
          },
          { zh: '原来产生的气体都消失了', en: 'All earlier gas vanished' },
          { zh: '元素种类不断增加', en: 'More kinds of element are created' },
        ],
        answer: 0,
        explanation: {
          zh: '斜率变小意味着体积增长更慢，不是累计体积减少。平台表示在这段记录中几乎不再增加。',
          en: 'Smaller slope means slower volume growth, not falling cumulative volume. A plateau means almost no further gain in this record.',
        },
      },
      {
        id: 'rate-evidence-q5',
        prompt: {
          zh: 'A 是冷的碎块，C 是热的粉末，C 更快。能独立证明什么？',
          en: 'A uses cool chips; C uses warm powder and is faster. What can this prove independently?',
        },
        options: [
          {
            zh: '必定全是温度造成的',
            en: 'Temperature alone must be responsible',
          },
          {
            zh: '无法分清温度与表面积各自的贡献',
            en: 'It cannot separate temperature and surface-area contributions',
          },
          {
            zh: '必定全是表面积造成的',
            en: 'Surface area alone must be responsible',
          },
        ],
        answer: 1,
        explanation: {
          zh: '两个变量一起改变了。应另找只改温度或只改表面积的记录，才能单独比较各自影响。',
          en: 'Two variables changed together. Find records changing temperature alone or surface area alone to isolate their effects.',
        },
      },
      {
        id: 'rate-evidence-q6',
        prompt: {
          zh: '真实实验两次结果差异较大，下一步更合理的是？',
          en: 'Two real trials disagree substantially. What is the more reasonable next step?',
        },
        options: [
          { zh: '只留下更喜欢的一次', en: 'Keep only the result you prefer' },
          { zh: '立刻说所有理论都错了', en: 'Immediately reject all theory' },
          {
            zh: '检查装置、读数与条件，再重复比较',
            en: 'Check setup, readings and conditions, then repeat',
          },
        ],
        answer: 2,
        explanation: {
          zh: '漏气、开始计时延迟或固体大小差异都可能影响记录。重复与检查能判断结果是否稳定，不能靠挑数据获得结论。',
          en: 'Leaks, delayed timing or different solid sizes can affect records. Checks and repeats test consistency; cherry-picking does not establish a conclusion.',
        },
      },
    ],
  },
];
