import type { Lesson } from './lessons';

export const level12Lessons: Lesson[] = [
  {
    id: 'gas-pressure-particle-collisions',
    levelId: 'gases',
    order: 54,
    title: {
      zh: '气体压强：看不见的粒子怎样推开气球？',
      en: 'Gas pressure: how invisible particles push a balloon',
    },
    eyebrow: {
      zh: '第 54 课 · 从打气筒到天气预报',
      en: 'Lesson 54 · From bike pumps to weather forecasts',
    },
    hook: {
      zh: '给自行车打气时，越往后推越费力；气球里的空气明明看不见，为什么能把橡胶撑得圆鼓鼓？',
      en: 'Pushing a bike pump gets harder near the end. Air inside a balloon is invisible—so why can it stretch rubber into a round shape?',
    },
    hookHint: {
      zh: '气体粒子一直快速、随机地运动。它们不断撞击容器内壁；每一次微小撞击合在一起，就形成了压强。把同样多粒子挤进更小空间，墙壁被撞得更频繁，压强会升高。',
      en: 'Gas particles move quickly and randomly. They constantly strike a container’s walls; all those tiny collisions together make pressure. Squeeze the same particles into less space and wall strikes become more frequent, so pressure rises.',
    },
    bigIdea: {
      zh: '气体压强来自粒子撞击容器壁。温度不变、粒子数不变时，体积变小会使碰撞更频繁，因此压强升高；体积变大则压强降低。',
      en: 'Gas pressure comes from particle collisions with container walls. If temperature and particle number stay fixed, smaller volume means more frequent collisions and higher pressure; larger volume lowers pressure.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🚲',
        title: {
          zh: '打气筒为什么越来越难推？',
          en: 'Why does a pump get harder to push?',
        },
        body: {
          zh: '活塞下移让空气占的体积变小。相同数量的粒子在更小空间里撞壁更频繁，压强增大，手感也更“顶”。',
          en: 'The piston reduces the air’s volume. The same number of particles collide with walls more often in a smaller space, increasing pressure and push-back.',
        },
      },
      {
        icon: '🎈',
        title: {
          zh: '气球的形状是内外拉锯',
          en: 'A balloon balances inside and outside',
        },
        body: {
          zh: '气球内的气体向外撞，外面的空气向内压，橡胶也会拉回去。气球稳定时，是这些作用大致平衡的结果。',
          en: 'Gas inside pushes outward, outside air pushes inward, and rubber pulls back. A stable balloon is a rough balance of these effects.',
        },
      },
      {
        icon: '🌦️',
        title: {
          zh: '天气图上的高压和低压',
          en: 'High and low pressure on weather maps',
        },
        body: {
          zh: '大气也是气体。天气预报里的气压描述的是空气在更大尺度上的推挤；它和风、云等现象有关，但不是只由一个因素决定。',
          en: 'The atmosphere is gas too. Pressure on a weather map describes air’s push on a larger scale; it relates to wind and clouds, but no single factor tells the whole story.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先看“撞击”，不是“静止重量”',
          en: 'Start with collisions, not static weight',
        },
        body: {
          zh: '气体的压强不是因为粒子贴在墙上，而是因为它们持续撞上墙再弹开。单次撞击极小，可是每秒次数极多，合起来就能产生可测的效果。',
          en: 'Gas pressure is not particles resting on a wall; particles continually hit and rebound. Each strike is tiny, but there are enormously many every second, producing a measurable effect together.',
        },
      },
      {
        title: {
          zh: '只改体积，观察碰撞密度',
          en: 'Change only volume and watch collision density',
        },
        body: {
          zh: '为了公平比较，先假设温度和粒子数量不变。推下活塞后，粒子走到墙的平均距离更短，单位时间撞击次数增多，所以压强升高。',
          en: 'For a fair comparison, first hold temperature and particle number constant. After pushing the piston down, particles travel a shorter average distance to a wall, so strikes per unit time increase and pressure rises.',
        },
      },
      {
        title: {
          zh: '温度也会改变撞击的“劲头”',
          en: 'Temperature also changes collision “punch”',
        },
        body: {
          zh: '如果容器体积不能变，升温会让粒子平均运动更快、撞击更有力，压强往往升高。这就是为什么密封容器不能随意加热。',
          en: 'If a container volume cannot change, heating makes particles move faster on average and hit harder, often raising pressure. That is why sealed containers must not be heated casually.',
        },
      },
    ],
    misconception: {
      zh: '“空气轻，所以没有压强”不对。空气粒子虽小，却数量巨大、持续运动并撞击表面。也不要把所有“压强变大”都归给体积：粒子数和温度改变时，压强也会改变，所以需要先说清哪些条件固定。',
      en: '“Air is light, so it has no pressure” is wrong. Air particles are tiny but vast in number, continuously moving and striking surfaces. Do not attribute every pressure change to volume: particle number and temperature also matter, so state what is held fixed.',
    },
    mission: {
      zh: '生活证据收集：找一个没有针头的塑料注射器或打气筒，只在成人同意和看护下，用手指轻轻封住出口并缓慢推动活塞，感受阻力变化。不要朝人或动物喷射，不要拆卸或加热任何密封容器。若没有工具，就画出活塞前后粒子图并标出更多碰撞。',
      en: 'Everyday evidence: find a needle-free plastic syringe or pump. Only with adult permission and supervision, gently seal the outlet with a finger and slowly push the piston to feel the changing resistance. Never spray people or animals, dismantle, or heat sealed containers. If you do not have a tool, draw particle pictures before and after a piston moves and mark the more frequent collisions.',
    },
    vocabulary: [
      { en: 'gas pressure', zh: '气体压强' },
      { en: 'collision', zh: '碰撞' },
      { en: 'volume', zh: '体积' },
      { en: 'piston', zh: '活塞' },
      { en: 'atmospheric pressure', zh: '大气压强' },
    ],
    interactive: 'gas-piston-lab',
    questions: [
      {
        id: 'gas-pressure-q1',
        prompt: {
          zh: '密闭注射器内的气体压强主要来自什么？',
          en: 'What mainly creates pressure in a sealed syringe?',
        },
        options: [
          {
            zh: '气体粒子不断撞击容器壁',
            en: 'Gas particles continually colliding with walls',
          },
          {
            zh: '空气完全静止在底部',
            en: 'Air sitting completely still at the bottom',
          },
          { zh: '容器壁自己制造空气', en: 'The container wall making air' },
        ],
        answer: 0,
        explanation: {
          zh: '气体粒子不停运动、撞击并反弹；大量撞击累积成压强。',
          en: 'Gas particles continually move, collide and rebound; the huge number of strikes adds up to pressure.',
        },
      },
      {
        id: 'gas-pressure-q2',
        prompt: {
          zh: '温度和粒子数不变时，把气体体积压小，压强通常怎样变化？',
          en: 'With temperature and particle count unchanged, what happens when gas volume is compressed?',
        },
        options: [
          { zh: '压强升高', en: 'Pressure rises' },
          { zh: '压强一定变成零', en: 'Pressure must become zero' },
          { zh: '粒子停止运动', en: 'Particles stop moving' },
        ],
        answer: 0,
        explanation: {
          zh: '同样的粒子在更小空间里更频繁撞壁，所以单位面积受到的推挤更大。',
          en: 'The same particles strike walls more frequently in less space, giving a greater push per area.',
        },
      },
      {
        id: 'gas-pressure-q3',
        prompt: {
          zh: '为什么不应随意加热密封罐或密封容器？',
          en: 'Why should sealed cans or containers not be heated casually?',
        },
        options: [
          {
            zh: '粒子运动加快，内部压强可能上升',
            en: 'Particles move faster and internal pressure may rise',
          },
          { zh: '加热会让空气变成糖', en: 'Heating turns air into sugar' },
          {
            zh: '密封容器里的粒子会消失',
            en: 'Particles in sealed containers vanish',
          },
        ],
        answer: 0,
        explanation: {
          zh: '密封时气体不易逃出，升温会让粒子更快、更有力地撞壁，带来安全风险。',
          en: 'In a sealed container gas cannot easily escape; warming makes particles strike walls faster and harder, creating safety risk.',
        },
      },
      {
        id: 'gas-pressure-q4',
        prompt: {
          zh: '要公平研究“体积对压强”的影响，哪一项最好保持不变？',
          en: 'To fairly study volume’s effect on pressure, what should best remain unchanged?',
        },
        options: [
          {
            zh: '气体的温度和粒子数量',
            en: 'Gas temperature and particle number',
          },
          { zh: '容器的颜色', en: 'The container colour' },
          { zh: '观察者的鞋码', en: 'The observer’s shoe size' },
        ],
        answer: 0,
        explanation: {
          zh: '温度和粒子数也影响压强；固定它们，才能把变化合理归因于体积。',
          en: 'Temperature and particle count also affect pressure; holding them fixed lets us reasonably attribute change to volume.',
        },
      },
    ],
  },
  {
    id: 'gas-temperature-in-a-fixed-container',
    levelId: 'gases',
    order: 55,
    title: {
      zh: '气体升温：为什么密封容器要小心？',
      en: 'Heating a gas: why sealed containers need care',
    },
    eyebrow: {
      zh: '第 55 课 · 同一个空间里，粒子跑得更快',
      en: 'Lesson 55 · Faster particles in the same space',
    },
    hook: {
      zh: '夏天车里的一瓶密封饮料不能长时间暴晒；冬天的篮球摸起来又可能有点软。它们都和“空气变热或变冷”有关吗？',
      en: 'A sealed drink should not sit in a hot car, while a basketball can feel softer in winter. Are both connected to air getting warmer or cooler?',
    },
    hookHint: {
      zh: '在体积几乎固定的密封容器里，加热会让气体粒子平均运动更快。它们不一定变多，却会更频繁、更有力地撞击内壁，压强可以升高；冷却则常使压强降低。',
      en: 'In a sealed container with nearly fixed volume, warming makes gas particles move faster on average. They do not necessarily become more numerous, but strike walls more frequently and forcefully, so pressure can rise; cooling often lowers it.',
    },
    bigIdea: {
      zh: '密封、定容条件下，气体温度升高通常会使压强升高，因为粒子运动更快、撞击更有力。理解条件比背一句“热胀冷缩”更重要。',
      en: 'For a sealed gas at fixed volume, higher temperature usually means higher pressure because particles move faster and hit harder. Understanding the conditions matters more than memorising a slogan.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🚗',
        title: { zh: '车内暴晒的密封物', en: 'Sealed items in a hot car' },
        body: {
          zh: '封闭空间受热时，内部气体压强可能增大。这是安全提示，不是邀请去加热或刺破密封罐。',
          en: 'When a closed space warms, internal gas pressure can rise. This is a safety cue, not an invitation to heat or puncture sealed containers.',
        },
      },
      {
        icon: '🏀',
        title: {
          zh: '冷天的球为什么“软”些？',
          en: 'Why can a ball feel softer on cold days?',
        },
        body: {
          zh: '球内空气变冷后，粒子平均运动较慢，撞壁推挤往往变弱；球的橡胶性质也会参与，因此真实情况不只一个因素。',
          en: 'As air in a ball cools, particles move more slowly on average and may push walls less; the rubber itself also matters, so real behaviour has more than one factor.',
        },
      },
      {
        icon: '🌡️',
        title: {
          zh: '温度计与绝对温标',
          en: 'Thermometers and absolute temperature',
        },
        body: {
          zh: '科学计算气体关系时常用开尔文 K，因为它从绝对零度开始计量。现在先抓住直觉：温度升高，粒子平均运动更快。',
          en: 'Gas calculations often use kelvin (K) because it starts at absolute zero. For now, keep the intuition: higher temperature means faster average particle motion.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先锁住空间和粒子数',
          en: 'First lock the space and particle count',
        },
        body: {
          zh: '研究温度的作用时，假设容器不膨胀、不漏气。这样看到压强变化，就能更有把握地归因于粒子运动速度的变化。',
          en: 'To study temperature’s effect, assume the container does not expand or leak. Then a pressure change can more confidently be linked to changing particle motion.',
        },
      },
      {
        title: {
          zh: '升温：更快、更有力的碰撞',
          en: 'Warm it: faster, harder collisions',
        },
        body: {
          zh: '温度上升不等于每个粒子排队加速，而是表示它们的平均动能增大。更多快速撞击把更大的推力传给容器壁，压强往往升高。',
          en: 'Rising temperature does not mean every particle speeds up identically; it means average kinetic energy increases. More rapid collisions transfer a stronger push to container walls, so pressure often rises.',
        },
      },
      {
        title: {
          zh: '看清系统能不能“让开”',
          en: 'Check whether the system can give way',
        },
        body: {
          zh: '气球、气筒或有弹性盖子的容器可能先变大，因而压强不一定像硬密封罐那样升高得明显。回答气体问题前，先问体积是否固定。',
          en: 'A balloon, pump or flexible lid may expand first, so pressure may not rise as sharply as in a rigid sealed can. Before answering a gas question, ask whether volume is fixed.',
        },
      },
    ],
    misconception: {
      zh: '“温度升高就一定是体积变大”不完整。体积能否变大取决于容器；硬而密封的容器可能主要表现为压强上升。也不要把温度理解成“多了热这种物质”，它描述的是粒子平均运动的状态。',
      en: '“Higher temperature always means larger volume” is incomplete. Whether volume can increase depends on the container; a rigid sealed container may mainly show higher pressure. Do not picture temperature as extra “heat stuff”; it describes a state of average particle motion.',
    },
    mission: {
      zh: '纸上安全推理：画两个同样大小、密封的硬盒子，分别标“冷”“温”。每个盒子中画相同数量的粒子；在“温”盒里用更长的运动箭头，并写出“为什么压强更高”。只做图示推理，不加热任何容器。',
      en: 'Safe paper reasoning: draw two same-size sealed rigid boxes, labelled “cool” and “warm.” Put the same number of particles in each; use longer motion arrows in the warm box and explain why pressure is higher. Use diagrams only—do not heat any container.',
    },
    vocabulary: [
      { en: 'temperature', zh: '温度' },
      { en: 'kinetic energy', zh: '动能' },
      { en: 'rigid container', zh: '刚性容器' },
      { en: 'sealed', zh: '密封的' },
      { en: 'kelvin (K)', zh: '开尔文（K）' },
    ],
    interactive: 'gas-temperature-lab',
    questions: [
      {
        id: 'gas-temperature-q1',
        prompt: {
          zh: '硬而密封的容器内气体升温时，哪项最可能发生？',
          en: 'When gas in a rigid sealed container warms, what is most likely?',
        },
        options: [
          {
            zh: '粒子撞壁更快更有力，压强可能升高',
            en: 'Particles hit walls faster and harder, so pressure may rise',
          },
          { zh: '粒子全部消失', en: 'All particles disappear' },
          { zh: '容器一定变成液体', en: 'The container must become liquid' },
        ],
        answer: 0,
        explanation: {
          zh: '体积和粒子数近似固定时，升温提高粒子平均运动速度，因此撞击会更频繁、更有力。',
          en: 'With volume and particle count approximately fixed, warming raises average particle speed, making collisions more frequent and forceful.',
        },
      },
      {
        id: 'gas-temperature-q2',
        prompt: {
          zh: '为什么气球升温后的压强变化不一定和硬罐一样？',
          en: 'Why might a balloon respond differently from a rigid can when warmed?',
        },
        options: [
          {
            zh: '气球可以改变体积，让一部分变化表现为膨胀',
            en: 'A balloon can change volume, so some change appears as expansion',
          },
          { zh: '气球里没有气体粒子', en: 'A balloon has no gas particles' },
          { zh: '温度只影响金属', en: 'Temperature affects only metals' },
        ],
        answer: 0,
        explanation: {
          zh: '容器是否能扩张是重要条件。弹性容器可以通过变大来重新分配粒子的碰撞密度。',
          en: 'Whether a container can expand is an important condition. A flexible container can grow and redistribute collision density.',
        },
      },
      {
        id: 'gas-temperature-q3',
        prompt: {
          zh: '下列哪项是安全且准确的温度—气体观察方式？',
          en: 'Which is a safe and accurate way to study temperature and gas?',
        },
        options: [
          {
            zh: '画出同体积、同粒子数下冷与温的粒子运动图',
            en: 'Draw cool and warm particle-motion diagrams at the same volume and count',
          },
          {
            zh: '加热密封罐来试试看',
            en: 'Heat a sealed can to see what happens',
          },
          { zh: '刺破加压容器', en: 'Puncture a pressurised container' },
        ],
        answer: 0,
        explanation: {
          zh: '图示能检验模型又没有风险；加热或刺破密封、加压容器会有危险，不是家庭实验。',
          en: 'A diagram tests the model without risk; heating or puncturing sealed pressurised containers is dangerous and not a home experiment.',
        },
      },
      {
        id: 'gas-temperature-q4',
        prompt: {
          zh: '解释气体压强变化前，最先该问什么？',
          en: 'What should you ask first before explaining a gas-pressure change?',
        },
        options: [
          {
            zh: '体积、温度和粒子数量中哪些改变、哪些固定',
            en: 'Which of volume, temperature and particle number changed or stayed fixed',
          },
          { zh: '容器的品牌', en: 'The container brand' },
          { zh: '粒子喜欢什么颜色', en: 'What colour particles prefer' },
        ],
        answer: 0,
        explanation: {
          zh: '压强受多个变量影响。先列出改变和控制的变量，推理才不会把相关当作原因。',
          en: 'Pressure is affected by several variables. List what changed and what was controlled before reasoning, so correlation is not mistaken for cause.',
        },
      },
    ],
  },
];
