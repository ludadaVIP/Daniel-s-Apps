import { t, q, type Lesson } from './schema';
import { measurementSkillsLessons } from './measurementSkills';
import { measurementLessons } from './measurement';
import { mysteryLessons } from './mysteries';
import { causeLesson, discoveryLessons } from './discoveries';
export { t, q } from './schema';
export type { Lesson, Question } from './schema';
const originalLessons: Lesson[] = [
  {
    id: 'physics-everywhere',
    stage: 0,
    unit: 'curiosity',
    title: t('物理无处不在', 'Physics is everywhere'),
    subtitle: t(
      '从一颗滚动的球，发现世界的规律。',
      'Discover a pattern in a rolling ball.',
    ),
    minutes: 12,
    kind: 'friction',
    hook: t(
      '踢出去的足球，为什么最后会停下来？',
      'Why does a football eventually stop after a kick?',
    ),
    prediction: t(
      '同一颗球以相同速度出发，在哪里滚得更远？',
      'The same ball starts at the same speed. Where will it roll farther?',
    ),
    predictions: [
      t('光滑地板', 'Smooth floor'),
      t('粗糙地毯', 'Rough carpet'),
      t('一样远', 'The same distance'),
    ],
    explore: t(
      '保持起始速度相同，只改变地面阻力。先观察光滑地面，再比较粗糙地面。',
      'Keep the starting speed the same. Change only the resistance and compare the two surfaces.',
    ),
    concept: t(
      '物理研究运动、力、能量等自然规律。球慢下来，是因为地面摩擦和空气阻力在影响运动。阻力更小，球通常滚得更远。',
      'Physics explores patterns in motion, forces and energy. Friction and air resistance slow the ball. With less resistance, it usually travels farther.',
    ),
    example: t(
      '同一颗球、同样的起始速度：光滑地面上滚得更远，粗糙地面上更早停下。我们改变了地面，观察停止距离的变化。',
      'Same ball, same starting speed: it rolls farther on a smooth surface and stops sooner on a rough one. We changed the surface and observed the stopping distance.',
    ),
    misconception: t(
      '运动不一定需要向前的力来维持。假如没有阻力，也没有其他合力，球会一直做匀速直线运动。',
      'Motion does not always need a forward force. Without resistance or any other net force, the ball would keep moving in a straight line at constant speed.',
    ),
    realWorld: t(
      '自行车刹车利用摩擦减速。运动鞋的纹路也帮助鞋底抓住地面。',
      'Bicycle brakes use friction to slow you down. Shoe treads help your feet grip the ground.',
    ),
    summary: t(
      '从生活现象出发，找出影响它的因素；用观察和实验寻找规律。',
      'Start with an everyday event, identify what affects it, and look for patterns through observation and experiments.',
    ),
    homeExperiment: t(
      '在平桌面和一块毛巾上，轻轻推同一颗球。尽量保持起始速度相同，比较距离。不要在楼梯或道路上实验。',
      'Gently roll the same ball on a flat table and on a towel. Try to keep its starting speed the same and compare distances. Use a clear, flat space.',
    ),
    vocabulary: [
      t('运动', 'motion'),
      t('摩擦', 'friction'),
      t('规律', 'pattern'),
    ],
    questions: [
      q(
        '球在地毯上更早停下来，最合理的解释是什么？',
        'Why does the ball stop sooner on the carpet?',
        [
          ['阻力更大', 'More resistance'],
          ['球忘记怎么运动', 'It forgets how to move'],
          ['运动会自动用完', 'Motion automatically runs out'],
        ],
        0,
        '地面阻力改变了球的运动，运动不会自动“用完”。',
        'Resistance changes the ball’s motion; motion does not simply run out.',
      ),
      q(
        '比较地面时，哪一个条件应该保持相同？',
        'Which condition should stay the same when comparing surfaces?',
        [
          ['地面的材质', 'Surface material'],
          ['球的起始速度', 'Starting speed'],
          ['停止距离', 'Stopping distance'],
        ],
        1,
        '同样的起始速度让比较更公平；停止距离是我们观察的结果。',
        'Equal starting speeds make a fair comparison. Stopping distance is the result we observe.',
      ),
    ],
    exit: q(
      '假设没有阻力，也没有其他合力，运动中的球会怎样？',
      'With no resistance and no other net force, what would a moving ball do?',
      [
        ['立刻停下', 'Stop at once'],
        ['越滚越快', 'Speed up'],
        ['沿直线保持原来的速度', 'Keep its velocity in a straight line'],
      ],
      2,
      '没有合力时，物体保持静止或匀速直线运动。',
      'With no net force, an object stays at rest or keeps moving at constant velocity.',
    ),
  },
  {
    id: 'ask-a-physicist',
    stage: 0,
    unit: 'curiosity',
    title: t('像物理学家一样提问', 'Ask like a physicist'),
    subtitle: t(
      '好问题，是一场实验的开始。',
      'A good question starts an experiment.',
    ),
    minutes: 12,
    kind: 'variables',
    hook: t(
      '朋友说：“我的球滚得更远，因为它是红色的。”怎么验证？',
      'A friend says, “My ball rolls farther because it is red.” How could you test that?',
    ),
    prediction: t(
      '要研究地面是否影响滚动距离，应该怎么做？',
      'How should we test whether the surface affects rolling distance?',
    ),
    predictions: [
      t('换地面，其他条件不变', 'Change the surface, keep other conditions'),
      t('同时换球和地面', 'Change ball and surface together'),
      t('只看一次结果', 'Look at one result'),
    ],
    explore: t(
      '切换地面阻力，记录距离。球和起始速度保持不变，每种条件试三次。',
      'Change the surface resistance and record the distance. Keep the ball and starting speed unchanged. Try each condition three times.',
    ),
    concept: t(
      '一个可研究的问题，需要能观察或测量结果。公平实验一次只改变一个关键因素，保持其他相关条件相同，并重复观察。',
      'A testable question has a result we can observe or measure. A fair test changes one key factor, keeps other relevant conditions the same, and repeats observations.',
    ),
    example: t(
      '问题：粗糙地面会让球更早停下吗？改变：地面。保持：同一颗球、起始速度。测量：停止距离。重复：每种地面三次。',
      'Question: Does a rough surface stop a ball sooner? Change: surface. Keep: ball and starting speed. Measure: stopping distance. Repeat: three trials per surface.',
    ),
    misconception: t(
      '两件事一起发生，不代表其中一件一定导致另一件。球的颜色与距离一起变化，也可能是推球的速度不同。',
      'Two things happening together do not prove cause and effect. If colour and distance change together, different starting speeds could be the reason.',
    ),
    realWorld: t(
      '比较两种保温杯时，用同样多、同样起始温度的水，在同一个房间里等待同样的时间。',
      'To compare insulated cups, use equal amounts of water at the same starting temperature in the same room, and wait the same amount of time.',
    ),
    summary: t(
      '先问能测量的问题，再一次改变一个因素，并重复验证。',
      'Ask a measurable question, change one factor at a time, and repeat the test.',
    ),
    homeExperiment: t(
      '重复上一课的滚球实验三次。写下每次的距离。真实实验有小差异很正常；模拟则会在同一设置下给出相同结果。',
      'Repeat the rolling-ball experiment three times and write down the distances. Small differences are normal in real experiments; this simulation gives the same result for identical settings.',
    ),
    vocabulary: [
      t('变量', 'variable'),
      t('公平实验', 'fair test'),
      t('证据', 'evidence'),
    ],
    questions: [
      q(
        '想知道起始速度对距离的影响，应该改变什么？',
        'To test how starting speed affects distance, what should you change?',
        [
          ['地面和球', 'Surface and ball'],
          ['只改变起始速度', 'Only starting speed'],
          ['每次都换所有条件', 'Every condition'],
        ],
        1,
        '一次改变一个因素，才能判断它的作用。',
        'Changing one factor helps identify its effect.',
      ),
      q(
        '为什么要重复真实实验？',
        'Why repeat a real experiment?',
        [
          ['看看结果是否稳定', 'Check whether results are consistent'],
          ['让答案更漂亮', 'Make the answer prettier'],
          ['保证结果完全一样', 'Guarantee identical results'],
        ],
        0,
        '重复能帮助发现偶然差异，真实测量不保证完全一样。',
        'Repeating helps reveal variation; real measurements need not be identical.',
      ),
    ],
    exit: q(
      '比较纸飞机设计时，哪种方法更公平？',
      'Which is a fairer way to compare paper-plane designs?',
      [
        ['不同纸张、不同人、不同地点', 'Different paper, throwers and places'],
        ['相同纸张、同一个人、同一个地点', 'Same paper, thrower and place'],
      ],
      1,
      '除了设计，尽量保持其他相关条件相同。',
      'Keep relevant conditions the same apart from the design.',
    ),
  },
  {
    id: 'observe-explain',
    stage: 0,
    unit: 'curiosity',
    title: t('观察，还是解释？', 'Observation or explanation?'),
    subtitle: t(
      '先说发生了什么，再追问为什么。',
      'Describe what happened, then ask why.',
    ),
    minutes: 12,
    kind: 'observation',
    hook: t(
      '“球落到了地上”和“重力让球下落”，这两句话有什么不同？',
      'How do “the ball reached the ground” and “gravity made it fall” differ?',
    ),
    prediction: t(
      '哪一句是你可以直接看到的观察？',
      'Which statement is a direct observation?',
    ),
    predictions: [
      t('球的位置越来越低', 'The ball’s position gets lower'),
      t('重力向下拉球', 'Gravity pulls it down'),
      t('球想回到地面', 'The ball wants to return'),
    ],
    explore: t(
      '释放球，观察位置如何变化。把看到的事情与解释它的模型分开。',
      'Release the ball and watch its position change. Separate what you see from the model that explains it.',
    ),
    concept: t(
      '观察是看到或测量到的现象；解释用概念和模型说明原因。“球向下运动”是观察，“地球的引力使它加速”是解释。',
      'An observation is something you see or measure. An explanation uses ideas and models to describe why. “The ball moves down” is an observation; “Earth’s gravity accelerates it” is an explanation.',
    ),
    example: t(
      '观察：释放后，球每一段相同时间内下落的距离越来越大。解释：在忽略空气阻力时，重力使球向下加速。',
      'Observation: the ball travels farther in each equal time interval. Explanation: neglecting air resistance, gravity accelerates it downward.',
    ),
    misconception: t(
      '物体没有“想要下落”的意愿。科学解释需要能检验的原因；一个解释也不能只凭一次观察就被证明。',
      'Objects do not “want” to fall. Scientific explanations need testable causes, and one observation alone does not prove an explanation.',
    ),
    realWorld: t(
      '听到回声是观察；声音被远处的墙反射回来是解释。以后学习声音时，我们会检验这个模型。',
      'Hearing an echo is an observation. Sound reflecting from a distant wall is an explanation. We will test that model when studying sound.',
    ),
    summary: t(
      '观察告诉我们发生了什么；解释提出为什么。用证据检验解释。',
      'Observations tell us what happened; explanations propose why. Use evidence to test explanations.',
    ),
    homeExperiment: t(
      '在软垫上方松开一个软球，写一句观察和一句解释。保持低高度，不向人投掷。',
      'Release a soft ball from a low height above a cushion. Write one observation and one explanation. Do not throw it at anyone.',
    ),
    vocabulary: [
      t('观察', 'observation'),
      t('解释', 'explanation'),
      t('重力', 'gravity'),
    ],
    questions: [
      q(
        '“冰块变小了”属于什么？',
        'What kind of statement is “the ice cube got smaller”?',
        [
          ['观察', 'Observation'],
          ['解释', 'Explanation'],
        ],
        0,
        '这是可以直接看到或测量的变化。',
        'This change can be directly seen or measured.',
      ),
      q(
        '“冰从周围吸收了热量，所以熔化了”属于什么？',
        'What is “the ice melted because it received heat from its surroundings”?',
        [
          ['观察', 'Observation'],
          ['解释', 'Explanation'],
        ],
        1,
        '这句话用热量转移解释熔化的原因。',
        'It uses heat transfer to explain why melting occurred.',
      ),
    ],
    exit: q(
      '下列哪一句是观察？',
      'Which statement is an observation?',
      [
        ['摩擦让自行车减速', 'Friction slows the bicycle'],
        ['自行车用了 4 秒停下来', 'The bicycle stopped in 4 seconds'],
      ],
      1,
      '4 秒是可以测量的结果，摩擦是对原因的解释。',
      'Four seconds is a measured result; friction is an explanation of the cause.',
    ),
  },
  {
    id: 'measure-length',
    stage: 0,
    unit: 'measurement',
    title: t('给世界一把尺', 'A ruler for the world'),
    subtitle: t(
      '从“差不多”，走向有单位的测量。',
      'From “about this much” to a measurement.',
    ),
    minutes: 15,
    kind: 'length',
    hook: t(
      '同一本书，用你的手和爸爸的手去量，为什么数字不同？',
      'Why do you and a parent get different numbers when measuring a book with your hands?',
    ),
    prediction: t(
      '用尺测量时，物体的左端应该对齐哪里？',
      'Where should the object’s left end line up on a ruler?',
    ),
    predictions: [
      t('0 刻度', 'The zero mark'),
      t('尺子的塑料边缘', 'The plastic edge'),
      t('随便哪里，读右端就行', 'Anywhere; just read the right end'),
    ],
    explore: t(
      '移动尺子上的起点和终点，看看两个读数的差。注意：起点不在零刻度时，也可以正确测量。',
      'Move the start and end positions and find the difference between the readings. You can measure correctly even when the start is not at zero.',
    ),
    concept: t(
      '测量需要统一的单位。长度的国际单位是米（m）；厘米（cm）和毫米（mm）适合小物体。长度等于终点读数减去起点读数。',
      'Measurements need agreed units. The SI unit of length is the metre (m). Centimetres (cm) and millimetres (mm) suit small objects. Length equals the end reading minus the start reading.',
    ),
    example: t(
      '铅笔左端在 2 cm，右端在 8 cm。长度 = 8 − 2 = 6 cm，而不是 8 cm。1 m = 100 cm；1 cm = 10 mm。',
      'A pencil starts at 2 cm and ends at 8 cm. Its length is 8 − 2 = 6 cm, not 8 cm. 1 m = 100 cm; 1 cm = 10 mm.',
    ),
    formula: t(
      '长度 = 终点读数 − 起点读数',
      'Length = end reading − start reading',
    ),
    misconception: t(
      '尺子的边缘不一定是零刻度。读数时，眼睛应正对刻度，避免斜着看产生偏差。',
      'The edge of a ruler is not always its zero mark. Look straight at the marks to avoid a viewing-angle error.',
    ),
    realWorld: t(
      '买家具、做模型、缝衣服，都需要数字和单位。“桌子长 120”不够清楚，“120 cm”才有意义。',
      'Furniture, models and clothing need numbers with units. “The desk is 120 long” is unclear; “120 cm” has meaning.',
    ),
    summary: t(
      '数字要带单位；看零刻度；起点不在零时，用终点减起点。',
      'Include a unit, locate the zero mark, and subtract the start reading from the end reading.',
    ),
    homeExperiment: t(
      '测量一本书的宽度三次，记录到尺子允许的精度。然后把书的起点移到 2 cm 再测，比较结果。',
      'Measure a book’s width three times to the precision your ruler allows. Then start it at 2 cm and measure again. Compare your results.',
    ),
    vocabulary: [t('长度', 'length'), t('米', 'metre'), t('单位', 'unit')],
    questions: [
      q(
        '橡皮从 3 cm 到 7 cm，它有多长？',
        'An eraser runs from 3 cm to 7 cm. How long is it?',
        [
          ['7 cm', '7 cm'],
          ['4 cm', '4 cm'],
          ['10 cm', '10 cm'],
        ],
        1,
        '7 − 3 = 4 cm。测量的是两端之间的距离。',
        '7 − 3 = 4 cm. We measure the distance between the ends.',
      ),
      q(
        '2 m 等于多少厘米？',
        'How many centimetres are in 2 m?',
        [
          ['20 cm', '20 cm'],
          ['200 cm', '200 cm'],
          ['2,000 cm', '2,000 cm'],
        ],
        1,
        '每米有 100 厘米，因此 2 × 100 = 200 cm。',
        'There are 100 centimetres per metre, so 2 × 100 = 200 cm.',
      ),
    ],
    exit: q(
      '尺子的零刻度坏了，怎么办？',
      'The ruler’s zero mark is damaged. What can you do?',
      [
        [
          '从完整刻度开始，终点减起点',
          'Start at another mark and subtract the start',
        ],
        ['只读终点', 'Read only the end'],
      ],
      0,
      '长度是两个位置读数的差，不必一定从零开始。',
      'Length is the difference between two position readings, so starting at zero is not essential.',
    ),
  },
  {
    id: 'what-is-speed',
    stage: 1,
    unit: 'motion',
    title: t('谁跑得更快？', 'Who is faster?'),
    subtitle: t(
      '用路程和时间，把“快”说清楚。',
      'Describe “fast” with distance and time.',
    ),
    minutes: 15,
    kind: 'speed',
    hook: t(
      '机器人 A 走 6 米用 3 秒，B 走 6 米用 6 秒。谁更快？',
      'Robot A travels 6 metres in 3 seconds; B travels 6 metres in 6 seconds. Who is faster?',
    ),
    prediction: t(
      '走过相同路程，用时更短意味着什么？',
      'For the same distance, what does a shorter time mean?',
    ),
    predictions: [
      t('速率更大', 'Greater speed'),
      t('速率更小', 'Lower speed'),
      t('无法比较', 'Cannot compare'),
    ],
    explore: t(
      '调节机器人 A 的速率，让两个机器人跑同样的 12 米。比较时间，再看看每秒走了多少米。',
      'Adjust robot A’s speed and race both robots over 12 metres. Compare their times and their distance per second.',
    ),
    concept: t(
      '速率描述运动的快慢，是单位时间走过的路程。这里日常说的“速度”指速率 speed；它没有方向。带方向的速度 velocity 会在后面的课中学习。',
      'Speed describes how fast something moves: distance travelled per unit time. It has no direction. We will study velocity, which includes direction, in later lessons.',
    ),
    example: t(
      '机器人走 6 m 用了 3 s。平均速率 = 6 ÷ 3 = 2 m/s，也就是平均每秒走 2 米。若全程匀速，12 米需要 12 ÷ 2 = 6 秒。',
      'A robot travels 6 m in 3 s. Its average speed is 6 ÷ 3 = 2 m/s: on average, 2 metres per second. At constant speed, 12 metres takes 12 ÷ 2 = 6 seconds.',
    ),
    formula: t(
      'v = s / t · 速率 = 路程 ÷ 时间（m/s）',
      'v = s / t · speed = distance ÷ time (m/s)',
    ),
    misconception: t(
      '走得更远不一定更快，还要看时间。整个过程的总路程除以总时间，得到的是平均速率。',
      'Travelling farther does not necessarily mean being faster; time matters too. Total distance divided by total time gives average speed.',
    ),
    realWorld: t(
      '汽车仪表盘显示此刻的速率；一次步行的总路程除以总时间，得到整段步行的平均速率。',
      'A car’s speedometer shows its speed at that moment. A walk’s total distance divided by total time gives its average speed.',
    ),
    summary: t(
      '比较快慢要同时看路程和时间；平均速率 = 总路程 ÷ 总时间。',
      'Compare distance and time together. Average speed = total distance ÷ total time.',
    ),
    homeExperiment: t(
      '在安全的平地量出 5 米，正常走过，用秒表计时。用 5 米除以秒数，求平均速率。不要在道路上做实验。',
      'Measure 5 metres in a safe, flat space. Walk normally and time it. Divide 5 metres by the time in seconds to find your average speed. Stay away from roads.',
    ),
    vocabulary: [t('速率', 'speed'), t('路程', 'distance'), t('秒', 'second')],
    questions: [
      q(
        '走 10 m 用 5 s，平均速率是多少？',
        'What is the average speed for 10 m in 5 s?',
        [
          ['2 m/s', '2 m/s'],
          ['5 m/s', '5 m/s'],
          ['50 m/s', '50 m/s'],
        ],
        0,
        '10 ÷ 5 = 2 m/s。单位表示每秒走的米数。',
        '10 ÷ 5 = 2 m/s. The unit tells us metres travelled per second.',
      ),
      q(
        'A 走 12 m 用 6 s，B 走 8 m 用 2 s。谁平均速率更大？',
        'A travels 12 m in 6 s; B travels 8 m in 2 s. Who has greater average speed?',
        [
          ['A', 'A'],
          ['B', 'B'],
          ['一样', 'The same'],
        ],
        1,
        'A 是 2 m/s，B 是 4 m/s。B 路程较短，但平均速率更大。',
        'A averages 2 m/s; B averages 4 m/s. B travels less distance but has greater average speed.',
      ),
    ],
    exit: q(
      '以 3 m/s 匀速走 12 m，需要多久？',
      'How long does 12 m take at a constant 3 m/s?',
      [
        ['4 s', '4 s'],
        ['9 s', '9 s'],
        ['36 s', '36 s'],
      ],
      0,
      '时间 = 路程 ÷ 速率 = 12 ÷ 3 = 4 s。',
      'Time = distance ÷ speed = 12 ÷ 3 = 4 s.',
    ),
  },
];
export const lessons: Lesson[] = [
  ...originalLessons.slice(0, 3),
  ...measurementLessons.slice(0, 2),
  originalLessons[3]!,
  ...measurementLessons.slice(2),
  causeLesson,
  ...mysteryLessons,
  ...discoveryLessons,
  ...measurementSkillsLessons,
  originalLessons[4]!,
];
export const units = {
  curiosity: t('从好奇开始', 'Start with curiosity'),
  measurement: t(
    '测量，把感觉变成证据',
    'Measurement: from feelings to evidence',
  ),
  patterns: t('数据里藏着规律', 'Find patterns in data'),
  mysteries: t('解开生活的小谜题', 'Everyday physics mysteries'),
  motion: t('运动：把快慢说清楚', 'Motion: describe fast and slow'),
};
export const stages = [
  {
    title: t('物理启蒙', 'Physics foundations'),
    age: '10+',
    topics: t(
      '观察 · 提问 · 测量 · 生活中的物理',
      'Observe · Question · Measure · Everyday physics',
    ),
  },
  {
    title: t('初中物理 I', 'Junior physics I'),
    age: '10–12',
    topics: t('测量 · 运动 · 力 · 重力 · 密度', 'Measurement · Motion · Force · Gravity · Density'),
  },
  {
    title: t('初中物理 II', 'Junior physics II'),
    age: '11–13',
    topics: t('能量 · 热 · 声音 · 光', 'Energy · Heat · Sound · Light'),
  },
  {
    title: t('初中物理 III', 'Junior physics III'),
    age: '12–14',
    topics: t(
      '电路 · 磁 · 压强 · 浮力',
      'Circuits · Magnetism · Pressure · Buoyancy',
    ),
  },
  {
    title: t('高中桥梁', 'Physics bridge'),
    age: '13–15',
    topics: t(
      '图像 · 代数 · 向量 · 建模',
      'Graphs · Algebra · Vectors · Models',
    ),
  },
  {
    title: t('高中力学', 'High school mechanics'),
    age: '14+',
    topics: t(
      '运动学 · 牛顿定律 · 动量 · 引力',
      'Kinematics · Newton’s laws · Momentum · Gravitation',
    ),
  },
  {
    title: t('波动与热学', 'Waves & thermal physics'),
    age: '14+',
    topics: t('波 · 光学 · 热力学', 'Waves · Optics · Thermodynamics'),
  },
  {
    title: t('电磁学', 'Electricity & magnetism'),
    age: '15+',
    topics: t(
      '电场 · 电路 · 磁场 · 电磁感应',
      'Fields · Circuits · Magnetism · Induction',
    ),
  },
  {
    title: t('现代物理', 'Modern physics'),
    age: '15+',
    topics: t(
      '原子 · 量子 · 核 · 相对论入门',
      'Atoms · Quantum ideas · Nuclei · Relativity',
    ),
  },
];
