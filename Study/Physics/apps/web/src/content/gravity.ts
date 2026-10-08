import { t, q, type Lesson } from './schema';
export const gravityLessons: Lesson[] = [
  {
    id: 'mass-versus-weight',
    stage: 1,
    unit: 'gravity',
    kind: 'mass-weight',
    minutes: 17,
    title: t(
      '背包的1 kg，和10 N说的是一回事吗？',
      'One backpack: do 1 kg and 10 N mean the same thing?',
    ),
    subtitle: t(
      '天平比较质量，测力计测力。',
      'A balance compares mass; a force meter measures force.',
    ),
    hook: t(
      '同一只背包，一件仪器标kg，另一件标N。背包没换，为什么数字和单位都变了？先看仪器到底在比较什么。',
      'One backpack: one instrument says kg, another N. Why different numbers and units? Find out what each instrument compares.',
    ),
    prediction: t(
      '天平显示1 kg，静止悬挂的测力计显示10 N，谁量错了？',
      'A balance shows 1 kg and a stationary hanging force meter shows 10 N. Which is wrong?',
    ),
    predictions: [
      t(
        '可能都对，测的是不同物理量',
        'Both can be right: different quantities',
      ),
      t('一定是测力计错了', 'The force meter must be wrong'),
      t('背包多出了物质', 'The backpack gained matter'),
    ],
    explore: t(
      '先用1 kg背包，调参考砝码让天平平衡，记录质量与测力计的力；再换2 kg背包，重新平衡并记录。看单位和读数一起怎样变化。',
      'Balance the 1 kg backpack using reference masses and record mass and force. Repeat with the 2 kg backpack. Compare both readings and units.',
    ),
    concept: t(
      '质量描述物体的惯性，也常用于描述有多少物质，单位是kg或g。这里“重量 weight”专指所受的重力，是力，单位N。在静止地球表面模型中，测力计向上的拉力与背包向下的重力平衡，读数等于重力大小。背包没加速，并不表示重力为零。天平则把背包与已知质量的砝码比较。',
      'Mass describes inertia and is also used to describe the amount of matter; its units include kg and g. Here weight means gravitational force, measured in N. In this stationary Earth-surface model, the force meter’s upward pull balances downward gravity, so its reading equals weight. No acceleration does not mean no gravity. The balance compares the backpack with known reference masses.',
    ),
    formula: t(
      'W = mg · 重力大小 = 质量 × 每kg受到的重力；这里g≈10 N/kg',
      'W = mg · weight = mass × gravitational force per kg; here g≈10 N/kg',
    ),
    example: t(
      '模型取g=10 N/kg。1 kg背包：W=1×10=10 N；2 kg背包：W=2×10=20 N。1 kg与10 N不是同一单位的两种写法，而是同一个物体的质量和重力。天平不平衡时，不能直接把参考砝码当作背包质量。',
      'Using g=10 N/kg: a 1 kg backpack has weight 10 N; a 2 kg backpack 20 N. “1 kg” and “10 N” describe different quantities, not two units of the same quantity. Unbalanced reference masses do not give the backpack’s mass.',
    ),
    misconception: t(
      '日常说“体重30公斤”通常在说质量；物理课中的weight用N。N不能直接换算为kg，必须知道当地g，并说明仪器如何标定。测力计读的是拉力，本课只有静止悬挂且其他竖直力忽略时，才与重力大小相等。',
      'Everyday “weight: 30 kilos” usually means mass. Physics weight uses N. Converting a force reading into a mass requires local g and instrument calibration. A force meter reads tension; here it equals weight only for stationary hanging with other vertical forces neglected.',
    ),
    realWorld: t(
      '买面粉看kg，检查绳子承受的拉力看N。理解这两个量，才能说明为什么同一个背包可以“质量相同，提起来的感觉不同”。',
      'Flour is sold by kg; rope loads can be described in N. Distinguishing the quantities helps explain the same backpack having unchanged mass but feeling different to lift.',
    ),
    summary: t(
      '先问测什么，再看单位：质量用kg，重力用N；静止也能受到平衡的力。',
      'Identify the quantity and unit: mass in kg, weight in N. A resting object can have balanced forces.',
    ),
    homeExperiment: t(
      '找一个写着kg或g的食品包装，说出它标的是质量。若家中有合适量程的弹簧测力计，由成人轻挂小物件并读N；没有也可以画出背包静止悬挂的上下两力，不需要购买仪器。',
      'Find a food label in kg or g and name the quantity. If you have a suitable force meter, an adult can hang a small object and read N. Otherwise draw the upward and downward forces on a hanging backpack; no purchase is needed.',
    ),
    vocabulary: [
      t('质量', 'mass'),
      t('重量／重力大小', 'weight'),
      t('测力计', 'force meter'),
      t('每千克的重力', 'gravitational force per kg'),
    ],
    questions: [
      q(
        '包装上500 g描述什么？',
        'What does 500 g on a package describe?',
        [
          ['质量', 'Mass'],
          ['重力', 'Gravitational force'],
        ],
        0,
        'g和kg是质量单位，N是力的单位。',
        'g and kg are mass units; N is a force unit.',
      ),
      q(
        '这里2 kg背包的重力是多少？',
        'What is the 2 kg backpack’s weight here?',
        [
          ['2 N', '2 N'],
          ['20 N', '20 N'],
        ],
        1,
        '用本模型g=10 N/kg，2×10=20 N。',
        'With g=10 N/kg, 2×10=20 N.',
      ),
      q(
        '背包静止挂着，重力为什么没有让它加速？',
        'Why does a hanging stationary backpack not accelerate downward?',
        [
          ['拉力与重力平衡', 'The upward pull balances gravity'],
          ['重力消失了', 'Gravity vanished'],
        ],
        0,
        '静止时合力为零，不是每一个力为零。',
        'Zero net force does not mean every force is zero.',
      ),
    ],
    exit: q(
      '同学说“1 kg就等于10 N，到哪里都能直接换”。你怎样回应？',
      'A friend says “1 kg equals 10 N everywhere”. How do you respond?',
      [
        [
          '它们是不同物理量，关系还取决于当地g',
          'They are different quantities; their relation depends on local g',
        ],
        ['任何地方都对', 'It is true everywhere'],
      ],
      0,
      '质量与重力通过W=mg联系，不能忽略地点和单位。',
      'W=mg relates mass and weight; location and units matter.',
    ),
  },
  {
    id: 'backpack-on-the-moon',
    stage: 1,
    unit: 'gravity',
    kind: 'moon-weight',
    minutes: 18,
    title: t(
      '去月球，背包真的“变少”了吗？',
      'On the Moon, does your backpack contain less?',
    ),
    subtitle: t(
      '同一份物质，比较两处重力。',
      'Same matter; compare gravity in two places.',
    ),
    hook: t(
      '把背包带到月球，提起来容易多了。可是书、本子和水都还在。秤的数字变小，能证明质量变少吗？',
      'Your backpack feels easier to lift on the Moon, but the books and water remain. Does a smaller scale reading prove less mass?',
    ),
    prediction: t(
      '没丢东西的1 kg背包带到月球，哪项改变？',
      'A 1 kg backpack loses nothing on its trip to the Moon. What changes?',
    ),
    predictions: [
      t('质量不变，重力变小', 'Mass stays the same; weight decreases'),
      t('质量和重力都变成零', 'Mass and weight become zero'),
      t('月球没有重力', 'The Moon has no gravity'),
    ],
    explore: t(
      '记录1 kg背包在地球和月球的读数，先保持质量不变。再在月球把质量改成2 kg并记录。右侧另显示“按地球g标定的弹簧秤”示例，比较它的kg示数与真实质量。',
      'Record the same 1 kg backpack on Earth and the Moon. Then record 2 kg on the Moon. Also compare its mass with an example spring scale labelled in kg but calibrated using Earth’s g.',
    ),
    concept: t(
      '重力来自物体之间的引力。地球吸引身边的物体，月球也有重力。在表面附近，“向下”指向天体中心，不是宇宙中统一的朝向。本课地球g取10 N/kg，月球取1.6 N/kg。质量不因换地点而改变；重力大小W=mg随当地g改变。这里g描述每kg受到的重力。',
      'Gravity is an attraction between objects. Earth pulls nearby objects, and the Moon has gravity too. Near a surface, down points toward the body’s centre, not a universal direction in space. We use 10 N/kg on Earth and 1.6 N/kg on the Moon. Changing location alone leaves mass unchanged; W=mg changes with local g, the gravitational force per kg.',
    ),
    formula: t(
      '同样m，W随g改变；同一地点，m翻倍则W翻倍',
      'Same m: W changes with g. Same location: doubling m doubles W.',
    ),
    example: t(
      '1 kg背包在地球重10 N，在月球重1.6 N，质量仍1 kg。月球上的2 kg背包重3.2 N。若弹簧秤固定按地球g=10换算kg，则月球1 kg背包会显示1.6÷10=0.16 kg：这是标定不适用，并非真实质量0.16 kg。',
      'A 1 kg backpack weighs 10 N on Earth and 1.6 N on the Moon, while remaining 1 kg. A 2 kg backpack weighs 3.2 N on the Moon. A spring scale fixed to Earth’s g=10 would label the first Moon reading as 1.6/10=0.16 kg. That calibration is unsuitable there; the actual mass is not 0.16 kg.',
    ),
    misconception: t(
      '月球不是无重力。这里说的是静止支撑或悬挂时的读数；电梯、跳跃或失重中的秤读数还涉及支撑力，不能不加条件地当作重力。天平在同一地点比较两边质量时，非零g同时作用在两边；合适的理想等臂天平仍能比较质量。本课不模拟轨道失重。',
      'The Moon is not gravity-free. These are stationary supported/hanging readings. Scale readings in elevators, jumps or weightlessness also involve support forces, so do not equate them with weight without conditions. An ideal equal-arm balance in one location compares two masses under the same nonzero g. Orbital weightlessness is outside this model.',
    ),
    realWorld: t(
      '“月球背包更轻”说的是承受的重力小了，不是书页消失。选择天平还是按力换算的秤，也会改变你怎样解释仪器结果。',
      '“Lighter on the Moon” means less gravitational force, not missing pages. Whether you use a balance or a force-based scale affects how you interpret the reading.',
    ),
    summary: t(
      '换地点不等于换质量；月球有较弱重力，仪器读数要联系标定条件。',
      'A new location need not mean a new mass. Moon gravity is weaker; interpret readings using calibration conditions.',
    ),
    homeExperiment: t(
      '做一张背包“地球／月球旅行卡”：选一个包装上的质量，分别乘10和1.6，写上kg和N。讲给家人听：如果少拿一本书，与只换地点，改变的是什么？数字是模型计算，不是家庭测量。',
      'Make an Earth/Moon travel card for a labelled package mass: multiply by 10 and 1.6 and include kg and N. Explain how removing a book differs from changing location. These are model calculations, not home measurements.',
    ),
    vocabulary: [
      t('地球', 'Earth'),
      t('月球', 'Moon'),
      t('重力强度', 'gravitational field strength'),
      t('标定', 'calibration'),
    ],
    questions: [
      q(
        '完整的1 kg背包来到月球，质量是多少？',
        'An intact 1 kg backpack reaches the Moon. Its mass?',
        [
          ['1 kg', '1 kg'],
          ['0.16 kg', '0.16 kg'],
        ],
        0,
        '没有增减物质，换地点不改变质量。',
        'Changing location without adding/removing matter leaves mass unchanged.',
      ),
      q(
        '本模型月球2 kg背包受到多大重力？',
        'What is the 2 kg backpack’s Moon weight in this model?',
        [
          ['20 N', '20 N'],
          ['3.2 N', '3.2 N'],
        ],
        1,
        'W=2×1.6=3.2 N，月球不是无重力。',
        'W=2×1.6=3.2 N; Moon gravity is not zero.',
      ),
      q(
        '地球标定弹簧秤在月球显示0.16 kg，怎样解释？',
        'An Earth-calibrated spring scale says 0.16 kg on the Moon. What does it mean?',
        [
          ['背包真实质量减少', 'Its actual mass decreased'],
          ['固定换算不适合月球g', 'Its fixed conversion does not suit Moon g'],
        ],
        1,
        '它按测到的力除以地球g，显示值不等于这里的真实质量。',
        'It divides measured force by Earth’s g; that label is not the actual mass here.',
      ),
    ],
    exit: q(
      '想只比较地点对重力的影响，哪个做法公平？',
      'How can you isolate location’s effect on weight?',
      [
        [
          '同一背包，质量保持不变，在两处静止测量',
          'Keep the same mass and measure at rest in both places',
        ],
        ['地球装满，月球倒空', 'Fill it on Earth and empty it on the Moon'],
      ],
      0,
      '控制质量与测量状态，只换当地g，才能更清楚比较地点影响。',
      'Keep mass and measurement state fixed while changing local g.',
    ),
  },
  {
    id: 'heavy-light-free-fall',
    stage: 1,
    unit: 'gravity',
    kind: 'gravity-fall',
    minutes: 17,
    title: t(
      '重球的重力更大，为什么没先到？',
      'More gravity on the heavy ball: why no head start?',
    ),
    subtitle: t(
      '同高、静止释放，先移除空气这个变量。',
      'Same height, released from rest: first remove air.',
    ),
    hook: t(
      '一颗球的质量是另一颗的十倍，重力也十倍。理想无空气实验里，它们却同时落地。我们是不是只看了力，忘了物体本身？',
      'One ball has ten times the mass and ten times the weight. Yet without air they land together. Did we compare force but forget the objects?',
    ),
    prediction: t(
      '无空气中，0.1 kg和1 kg球从同高静止释放，本模型谁先到？',
      'Without air, 0.1 kg and 1 kg balls start at rest at the same height. Who lands first here?',
    ),
    predictions: [
      t('同时', 'Together'),
      t('1 kg球必定先到', 'The 1 kg ball must arrive first'),
      t('轻球没有重力', 'The light ball has no gravity'),
    ],
    explore: t(
      '在地球和月球各完整释放一次，两颗球都从5 m处静止开始、没有空气。比较相同地点的两球和不同地点的落地时间；播放后用时间滑杆看后半段是否走得更多。',
      'Complete both Earth and Moon releases: two balls at rest, height 5 m, no air. Compare masses within one location and landing times across locations. After playback, use the time slider to inspect later intervals.',
    ),
    concept: t(
      '自由落体在这里指只受重力的运动。质量较大的球受到更大的重力，但也有更大的惯性；在同一地点、忽略空气时，两球的重力加速度相同。g还能描述静止释放后，每秒向下速度增加多少，单位m/s²。10 N/kg与10 m/s²是同一个g的两种表达。静止释放不是匀速：越往后，相等时间内下落越多。',
      'Free fall here means motion under gravity alone. A more massive ball has more gravitational force and more inertia; in one location without air, both have the same gravitational acceleration. g also describes downward velocity gained per second, in m/s². 10 N/kg and 10 m/s² describe the same g in different ways. Falling from rest is not steady motion: later equal time intervals cover more distance.',
    ),
    example: t(
      '模型5 m无空气下落：地球g=10，两球均1.00 s到地面；月球g=1.6，两球均2.50 s。地球上轻球重1 N、重球10 N，但同在0.5 s时已下落1.25 m。时间用理想模型计算，5 m是屏幕高度，家庭只用低处。',
      'From 5 m without air: Earth g=10 gives both 1.00 s; Moon g=1.6 gives both 2.50 s. Earth weights are 1 N and 10 N, yet both have fallen 1.25 m at 0.5 s. Times are ideal model calculations; 5 m is screen-only, with low heights at home.',
    ),
    misconception: t(
      '同时落地需要说明条件：同地点、同高、同初速且空气等影响忽略。真实羽毛和球受空气影响不同，不能由它们的差别推翻无空气结论。初速度、形状、风或释放不同都可能改变结果。月球落得慢也不是质量变小。',
      'State the conditions: same location, height and initial velocity, with air and other effects neglected. Real feathers and balls have different air effects; their different falls do not contradict the no-air result. Initial velocity, shape, wind and release method can change results. A slower Moon fall does not mean less mass.',
    ),
    realWorld: t(
      '接掉落的物品，越迟出手通常越难，因为它在加速；但本课不计算手的碰撞力。雨滴和降落伞受到空气影响，也不能直接套用无空气模型。',
      'A falling object is usually harder to catch later because it speeds up; catching forces are not calculated here. Air affects raindrops and parachutes, so the no-air model does not directly predict them.',
    ),
    summary: t(
      '同条件无空气下，落地先后不由质量单独决定；重力更大还要看惯性。',
      'Under matched no-air conditions, mass alone gives no head start. Consider inertia as well as force.',
    ),
    homeExperiment: t(
      '由成人从桌面附近的低高度同时松开两颗大小相近、质量不同的软球，观察并重复，避免砸人或易碎物。家庭空气和释放差异会影响结果；这只能是近似观察，不能当作真正真空实验。没有合适球就用屏幕对照解释给家人听。',
      'An adult can release two similarly sized, differently massive soft balls together from a low height near a tabletop. Repeat away from people and fragile objects. Air and release differences affect this approximate observation; it is not a vacuum experiment. Use the screen comparison if suitable balls are unavailable.',
    ),
    vocabulary: [
      t('自由落体', 'free fall'),
      t('惯性', 'inertia'),
      t('加速度', 'acceleration'),
      t('初始条件', 'initial conditions'),
    ],
    questions: [
      q(
        '地球模型中1 kg球重10 N，0.1 kg球重多少？',
        'If the Earth-model 1 kg ball weighs 10 N, what about 0.1 kg?',
        [
          ['1 N', '1 N'],
          ['0 N', '0 N'],
        ],
        0,
        'W=0.1×10=1 N；轻球也受重力。',
        'W=0.1×10=1 N; the light ball also has gravity.',
      ),
      q(
        '两球的下落能否只比较重力大小，不考虑质量？',
        'Can you compare the falls using only force and ignoring mass?',
        [
          [
            '可以，力大就一定先到',
            'Yes: more force guarantees earlier landing',
          ],
          ['不可以，惯性也不同', 'No: their inertia differs too'],
        ],
        1,
        '质量增大时，本模型重力和惯性同时增大，重力加速度不变。',
        'Greater mass increases both gravitational force and inertia here, leaving gravitational acceleration unchanged.',
      ),
      q(
        '屏幕中越晚，相等时间内两球的下落距离怎样？',
        'In later equal time intervals, how far do these balls fall?',
        [
          ['更大', 'Farther'],
          ['始终一样', 'Always the same'],
        ],
        0,
        '只受重力、静止释放时不断加速，不是匀速。',
        'From rest under gravity alone, they accelerate rather than move steadily.',
      ),
    ],
    exit: q(
      '同学让重球先松手，看到它先到。能证明质量大导致先到吗？',
      'A friend releases the heavy ball earlier and it lands first. Does that prove greater mass causes earlier landing?',
      [
        ['不能，释放时刻没控制', 'No: release time was not controlled'],
        ['能，先到就是证据', 'Yes: arriving first is enough'],
      ],
      0,
      '先控制起始高度、速度、释放时刻与空气条件，再比较质量。',
      'Control height, initial velocity, release time and air conditions before comparing mass.',
    ),
  },
];
