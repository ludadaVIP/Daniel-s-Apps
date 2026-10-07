import { t, q, type Lesson } from './schema';

export const measurementLessons: Lesson[] = [
  {
    id: 'what-can-we-measure',
    stage: 0,
    unit: 'measurement',
    kind: 'quantities',
    minutes: 12,
    title: t('“太重了”有多重？', 'How heavy is “too heavy”?'),
    subtitle: t(
      '给书包、歌曲和铅笔找一个测量办法。',
      'Find ways to measure a bag, a song and a pencil.',
    ),
    hook: t(
      '你说书包很重，朋友说不重。怎样让两个人说的是同一件事？',
      'You say a schoolbag is heavy; a friend disagrees. How can you compare fairly?',
    ),
    prediction: t(
      '哪一种说法，别人最容易重复检查？',
      'Which statement is easiest for someone else to check?',
    ),
    predictions: [
      t('书包很重', 'The bag is heavy'),
      t('书包质量是 3 kg', 'The bag has a mass of 3 kg'),
      t('我不喜欢背它', 'I dislike carrying it'),
    ],
    explore: t(
      '给三个生活任务选择工具：铅笔的长度、歌曲的时长、书包的质量。选对工具后，看看读数告诉了你什么。',
      'Choose tools for three everyday tasks: a pencil’s length, a song’s duration and a bag’s mass. Find what each reading tells you.',
    ),
    concept: t(
      '长度、时间、质量、温度等可以用规定的办法测量，叫物理量。一个完整的测量结果要有数字和单位。感觉很有用，但“很长”“很重”不够精确。',
      'Length, time, mass and temperature can be measured using agreed methods. They are physical quantities. A measurement needs a number and a unit. Feelings are useful, but “long” and “heavy” are not precise.',
    ),
    example: t(
      '同一首歌，甲喜欢，乙不喜欢；这是个人感受。用计时器测出播放时长 180 s，别人可以重复检查。问卷能记录喜好，但它不是在测量歌曲的长度、时间或质量。',
      'Two people may feel differently about a song. A timer can measure its duration as 180 s, which someone else can check. A survey can record preferences, but that is different from measuring a physical property such as duration.',
    ),
    misconception: t(
      '有数字不一定就是物理测量。“我给这首歌打 9 分”表达喜好；“这首歌播放 180 秒”测量时间。先说明究竟测什么。',
      'A number alone does not make a physical measurement. “I rate this song 9” expresses a preference; “the song lasts 180 seconds” measures time. Say what you are measuring.',
    ),
    realWorld: t(
      '整理书包时可以逐样称质量，找出最重的物品。感觉累还受到背包带和背法影响，所以质量不是舒适度的全部。',
      'Weigh schoolbag items one at a time to find the heaviest. Strap design and how you carry the bag also affect comfort, so mass is not the whole story.',
    ),
    summary: t(
      '先确定要测什么，再选工具；把数字和单位一起记下来。',
      'Decide what to measure, choose a tool, and record a number with its unit.',
    ),
    homeExperiment: t(
      '给家里的三样东西各写一个可测的问题，例如“书有多宽？”“歌曲多长时间？”“苹果质量多少？”不用购买仪器；没有工具时先记录计划。',
      'Write a measurable question about three things at home: a book’s width, a song’s duration or an apple’s mass. Use tools you already have; otherwise record a plan.',
    ),
    vocabulary: [
      t('物理量', 'physical quantity'),
      t('测量', 'measurement'),
      t('读数', 'reading'),
    ],
    questions: [
      q(
        '想比较两支铅笔哪支更长，应该测什么？',
        'What should you measure to compare pencil lengths?',
        [
          ['长度', 'Length'],
          ['质量', 'Mass'],
          ['喜好', 'Preference'],
        ],
        0,
        '长度回答“有多长”，质量回答另一个问题。',
        'Length answers “how long”; mass answers a different question.',
      ),
      q(
        '“书包质量 3”少了什么？',
        'What is missing from “the bag’s mass is 3”?',
        [
          ['颜色', 'Colour'],
          ['单位', 'A unit'],
          ['名字', 'A name'],
        ],
        1,
        '3 g 与 3 kg 差别很大，数字必须带单位。',
        '3 g and 3 kg are very different; the number needs a unit.',
      ),
      q(
        '同一首歌的喜好不同，时长却相同，这冲突吗？',
        'People disagree about liking a song, but agree on its duration. Is that a conflict?',
        [
          ['是，所有感受都应一样', 'Yes; everyone must feel the same'],
          [
            '不是，感受与测量是不同的问题',
            'No; feelings and measurements ask different questions',
          ],
        ],
        1,
        '测量可以让我们比较同一个物理量，不会消除个人感受。',
        'A measurement compares the same physical quantity; it does not remove personal feelings.',
      ),
    ],
    exit: q(
      '想研究纸飞机能飞多久，最直接的工具是什么？',
      'Which tool directly measures how long a paper plane flies?',
      [
        ['尺子', 'Ruler'],
        ['计时器', 'Timer'],
        ['天平', 'Balance'],
      ],
      1,
      '飞行时长是时间，用计时器；飞行距离才用尺子。',
      'Flight duration is time, so use a timer. Use a ruler for distance.',
    ),
  },
  {
    id: 'units-make-sense',
    stage: 0,
    unit: 'measurement',
    kind: 'units',
    minutes: 12,
    title: t('数字换了，绳子变了吗？', 'Different numbers, same string?'),
    subtitle: t(
      '24 cm、240 mm 和 0.24 m 的秘密。',
      'The secret of 24 cm, 240 mm and 0.24 m.',
    ),
    hook: t(
      '你的绳子长 24，朋友的长 240。他的绳子一定更长吗？',
      'Your string measures 24; your friend’s measures 240. Must theirs be longer?',
    ),
    prediction: t(
      '把一根 24 cm 的绳子改用毫米记录，会发生什么？',
      'What happens when a 24 cm string is recorded in millimetres?',
    ),
    predictions: [
      t('绳子变长', 'The string gets longer'),
      t('数字变大，绳子不变', 'The number grows; the string stays the same'),
      t('数字变小', 'The number gets smaller'),
    ],
    explore: t(
      '切换米、厘米和毫米。盯住绳子的两端：变的是绳子，还是记录它的单位？至少比较两种单位。',
      'Switch between metres, centimetres and millimetres. Watch the ends of the string: does the object change, or only the unit? Compare at least two units.',
    ),
    concept: t(
      '单位就像测量用的小格子。同样长的绳子，用更小的单位，需要更多格。米、厘米、毫米都描述长度；秒描述时间，千克描述质量。不同种类的物理量不能直接互换。',
      'A unit is like a measuring block. The same string needs more smaller blocks. Metres, centimetres and millimetres describe length; seconds describe time, and kilograms describe mass. Different physical quantities cannot simply be converted into one another.',
    ),
    example: t(
      '1 cm = 10 mm，所以 24 cm = 240 mm。1 m = 100 cm，所以 24 cm = 0.24 m。三个数字记录的是同一根绳子。',
      '1 cm = 10 mm, so 24 cm = 240 mm. 1 m = 100 cm, so 24 cm = 0.24 m. All three numbers describe the same string.',
    ),
    formula: t(
      '1 m = 100 cm = 1,000 mm · 1 kg = 1,000 g · 1 min = 60 s',
      '1 m = 100 cm = 1,000 mm · 1 kg = 1,000 g · 1 min = 60 s',
    ),
    misconception: t(
      '数字大，不代表实际量大。比较之前，先把同一种物理量换成相同单位。厘米也不能换成秒。',
      'A bigger number does not necessarily mean a bigger quantity. Convert the same kind of quantity to a common unit before comparing. Centimetres cannot be converted to seconds.',
    ),
    realWorld: t(
      '模型图纸常用毫米，身高常用厘米，房间长度常用米。换单位能让记录方便，但不会改变物体。',
      'Model plans often use millimetres, height often uses centimetres, and room dimensions use metres. Choosing a convenient unit does not change the object.',
    ),
    summary: t(
      '同一个量可以用不同单位记录；比较前先统一单位。',
      'One quantity can have different unit expressions. Use a common unit before comparing.',
    ),
    homeExperiment: t(
      '选一支铅笔，把测得的长度分别写成厘米和毫米。再找一段视频的时长，把 2 min 写成秒。检查看起来不同的数字是否描述同一个量。',
      'Measure a pencil and record its length in centimetres and millimetres. Find a two-minute video and express that duration in seconds. Check that the different numbers describe the same quantity.',
    ),
    vocabulary: [
      t('单位', 'unit'),
      t('厘米', 'centimetre'),
      t('毫米', 'millimetre'),
    ],
    questions: [
      q(
        '24 cm 与 240 mm 哪个更长？',
        'Which is longer: 24 cm or 240 mm?',
        [
          ['24 cm', '24 cm'],
          ['240 mm', '240 mm'],
          ['一样长', 'Equal length'],
        ],
        2,
        '每厘米包含 10 毫米，所以两个读数相等。',
        'Each centimetre contains 10 millimetres, so the readings are equal.',
      ),
      q(
        '2 min 是多少秒？',
        'How many seconds are in 2 min?',
        [
          ['20 s', '20 s'],
          ['120 s', '120 s'],
          ['200 s', '200 s'],
        ],
        1,
        '分钟不是按 100 进位：2 × 60 = 120 s。',
        'Minutes do not convert by hundreds: 2 × 60 = 120 s.',
      ),
      q(
        '家具宽 0.8 m，门宽 75 cm，家具能直着通过吗？',
        'Furniture is 0.8 m wide; the doorway is 75 cm wide. Will it fit straight through?',
        [
          ['能，0.8 比 75 小', 'Yes; 0.8 is less than 75'],
          ['不能，80 cm 大于 75 cm', 'No; 80 cm exceeds 75 cm'],
        ],
        1,
        '先统一单位：0.8 m = 80 cm。',
        'First convert: 0.8 m = 80 cm.',
      ),
    ],
    exit: q(
      '哪两个读数可以换单位后直接比较？',
      'Which two readings can be directly compared after unit conversion?',
      [
        ['2 kg 与 1,800 g', '2 kg and 1,800 g'],
        ['2 m 与 5 s', '2 m and 5 s'],
      ],
      0,
      '前一对都是质量；后一对是长度和时间，不能作为同一个量比较。',
      'The first pair both measure mass. Length and time are different quantities.',
    ),
  },
  {
    id: 'measure-time',
    stage: 0,
    unit: 'measurement',
    kind: 'time',
    minutes: 15,
    title: t('一秒很短，怎么量准？', 'How can we time a tiny interval?'),
    subtitle: t(
      '数十次摆动，比只数一次更可靠。',
      'Time ten swings instead of just one.',
    ),
    hook: t(
      '手按秒表总慢一点。怎样量出一次摆动的时间，而不全靠手快？',
      'Pressing a stopwatch takes a little time. How can we measure one swing without relying on perfect reflexes?',
    ),
    prediction: t(
      '每次停止计时都慢 0.2 s，量一次还是十次再除以十，误差更小？',
      'If stopping is always 0.2 s late, which gives a smaller error per swing: one swing, or ten divided by ten?',
    ),
    predictions: [
      t('只量一次', 'Time one swing'),
      t('量十次，再除以十', 'Time ten, then divide by ten'),
      t('两者一样', 'Both are the same'),
    ],
    explore: t(
      '用相同的摆，分别测 1 次和 10 次完整摆动。调节结束按键的延迟，比较估算出来的每次用时。一次完整摆动要回到相同位置、相同运动方向。',
      'Use the same pendulum for 1 and 10 full swings. Adjust the stop-button delay and compare the estimated time per swing. A full swing returns to the same position moving in the same direction.',
    ),
    concept: t(
      '时间间隔是事件从开始到结束经历的时间，基本单位是秒（s）。短事件可以测多次重复的总时间，再除以次数。这样，同样的开始或结束计时误差，会分摊到更多次中。',
      'A time interval is the duration between start and finish, measured in seconds (s). For a short repeated event, time many repetitions and divide by the count. The same timing error is then spread across more repetitions.',
    ),
    example: t(
      '模型中每次完整摆动恰好 2.0 s，开始计时准确，结束慢 0.2 s。测一次得到 2.2 s；测十次得到 20.2 s，除以十是 2.02 s，更接近 2.0 s。',
      'In the model each full swing takes exactly 2.0 s, timing starts correctly, and stopping is 0.2 s late. One swing reads 2.2 s. Ten read 20.2 s; dividing by ten gives 2.02 s, closer to 2.0 s.',
    ),
    formula: t(
      '每次平均用时 = 多次事件的总时间 ÷ 次数',
      'Average time per event = total time ÷ repetition count',
    ),
    misconception: t(
      '秒表显示两位小数，不代表手按计时就准确到 0.01 s。多次测量能减小某些误差，但不能自动修好一只走得不准的钟。',
      'Two decimal places do not make hand timing accurate to 0.01 s. Repetition can reduce some errors, but cannot automatically fix a clock that runs at the wrong rate.',
    ),
    realWorld: t(
      '想知道一首歌的节拍间隔，连续数 10 个间隔更容易；数 11 个拍点之间，正好有 10 个间隔。',
      'To estimate the gap between musical beats, time ten consecutive intervals. Eleven beat markers contain ten intervals.',
    ),
    summary: t(
      '计时先说清起点和终点；短的重复事件可以一起量，再除以次数。',
      'Define start and finish clearly. Time several short repeated events together, then divide by the count.',
    ),
    homeExperiment: t(
      '用桌上的节拍器或稳定节拍音轨，从一个拍点到第 11 个拍点计时，得到 10 个间隔。重复三次并记录。不用测自己的心跳，也不用悬挂重物。',
      'Use a metronome or steady beat track. Time from one beat to the eleventh: ten intervals. Repeat three times and record the readings. No hanging weights or pulse measurement is needed.',
    ),
    vocabulary: [
      t('时间间隔', 'time interval'),
      t('重复测量', 'repeated measurement'),
      t('周期', 'period'),
    ],
    questions: [
      q(
        '10 次完整摆动用了 20 s，每次平均多久？',
        'Ten full swings take 20 s. What is the average time per swing?',
        [
          ['0.5 s', '0.5 s'],
          ['2 s', '2 s'],
          ['200 s', '200 s'],
        ],
        1,
        '20 ÷ 10 = 2 s，而不是把时间再乘十。',
        '20 ÷ 10 = 2 s; do not multiply by ten.',
      ),
      q(
        '从第 1 个拍点到第 11 个拍点有几个间隔？',
        'How many intervals are there from beat 1 to beat 11?',
        [
          ['10', '10'],
          ['11', '11'],
          ['12', '12'],
        ],
        0,
        '数点与数间隔不同：相邻两个拍点之间才是一个间隔。',
        'Counting markers differs from counting gaps: an interval lies between two adjacent beats.',
      ),
      q(
        '三次读数略有不同，应该怎么办？',
        'Three readings differ slightly. What should you do?',
        [
          ['只保留最喜欢的结果', 'Keep only your favourite'],
          [
            '全部记录，比较差异和计时方法',
            'Record them all and examine the method',
          ],
        ],
        1,
        '保留真实差异，比挑选一个漂亮的答案更有用。',
        'Keeping real variation is more useful than choosing an attractive result.',
      ),
    ],
    exit: q(
      '计时误差为 0.2 s，分摊到十次后每次受到多大影响？',
      'A total timing error is 0.2 s. How much does it affect each of ten repetitions?',
      [
        ['0.02 s', '0.02 s'],
        ['0.2 s', '0.2 s'],
        ['2 s', '2 s'],
      ],
      0,
      '0.2 ÷ 10 = 0.02 s。这只针对模型里的同样一次计时误差。',
      '0.2 ÷ 10 = 0.02 s, for the same single timing error in this model.',
    ),
  },
  {
    id: 'measure-mass',
    stage: 0,
    unit: 'measurement',
    kind: 'mass',
    minutes: 15,
    title: t(
      '大块海绵比小块金属重吗？',
      'Is a big sponge heavier than small metal?',
    ),
    subtitle: t(
      '让天平来判断，别只看大小。',
      'Let a balance decide, not size alone.',
    ),
    hook: t(
      '一大块海绵和一小块金属，哪一个质量更大？只看体积就能知道吗？',
      'Which has greater mass: a large sponge or a small piece of metal? Can size alone tell you?',
    ),
    prediction: t(
      '比较质量，哪一种方法更可靠？',
      'Which is more reliable for comparing mass?',
    ),
    predictions: [
      t('看谁更大', 'See which is bigger'),
      t('放到天平上比较', 'Compare them on a balance'),
      t('看谁颜色更深', 'See which is darker'),
    ],
    explore: t(
      '把物体放在左盘，在右盘加减已知质量的砝码，直到天平水平。把砝码相加，就得到物体质量。换物体试试。',
      'Place an object on the left pan and add known masses to the right until the balance is level. Add the weights to find the object’s mass. Try another object.',
    ),
    concept: t(
      '质量描述物体的一种物理属性，初学时可以理解为“有多少物质”。它的国际单位是千克（kg），小物体常用克（g）。天平比较两边的质量；在同一地点，两边平衡时质量相等。',
      'Mass is a physical property, introduced here as how much matter an object contains. Its SI unit is the kilogram (kg); grams (g) suit small objects. A balance compares masses: at the same location, balanced sides have equal mass.',
    ),
    example: t(
      '左盘放苹果，右盘放三个 50 g 砝码后平衡。苹果质量是 50 + 50 + 50 = 150 g = 0.150 kg。不是 150 kg。',
      'An apple balances three 50 g weights. Its mass is 50 + 50 + 50 = 150 g = 0.150 kg, not 150 kg.',
    ),
    misconception: t(
      '大，不一定质量大。质量和重量也不是同一个物理量：质量用 kg 或 g，物理中的重量是重力，用牛顿（N）。日常“称重”常读出的是质量。',
      'Bigger does not necessarily mean more mass. Mass and weight are different: mass uses kg or g; weight is gravitational force, measured in newtons (N). Everyday “weighing” often displays mass.',
    ),
    realWorld: t(
      '烘焙配方的“面粉 200 g”指质量。同样满的一杯面粉和一杯水，质量可能不同；用秤比只看杯子更清楚。',
      '“200 g of flour” in a recipe specifies mass. Equal full cups of flour and water can have different masses; a scale is clearer than judging by cup size.',
    ),
    summary: t(
      '质量用天平或秤来测，记清 g 或 kg；物体大小不能代替测量。',
      'Measure mass with a balance or scale and record g or kg. Size cannot replace a measurement.',
    ),
    homeExperiment: t(
      '有厨房秤时，先放空碗并归零，再加入一把干豆记录质量。换成更多豆子再测。没有秤时，画出用已知质量比较物体的天平方案。',
      'With a kitchen scale, put on an empty bowl and tare it, then record a handful of dry beans. Add more beans and measure again. Without a scale, draw a balance plan using known masses.',
    ),
    vocabulary: [
      t('质量', 'mass'),
      t('天平', 'balance'),
      t('砝码', 'known mass'),
    ],
    questions: [
      q(
        '物体平衡 100 g 和 20 g 砝码，质量是多少？',
        'An object balances 100 g and 20 g weights. What is its mass?',
        [
          ['80 g', '80 g'],
          ['120 g', '120 g'],
          ['120 kg', '120 kg'],
        ],
        1,
        '同一边的砝码质量相加：100 + 20 = 120 g。',
        'Add weights on the same side: 100 + 20 = 120 g.',
      ),
      q(
        '500 g 等于多少 kg？',
        'How many kilograms are in 500 g?',
        [
          ['0.5 kg', '0.5 kg'],
          ['5 kg', '5 kg'],
          ['50 kg', '50 kg'],
        ],
        0,
        '1 kg 有 1,000 g，500 g 是半千克。',
        '1 kg contains 1,000 g; 500 g is half a kilogram.',
      ),
      q(
        '秤上碗和豆子共 180 g，空碗 80 g，豆子质量是多少？',
        'A bowl with beans reads 180 g; the empty bowl is 80 g. What is the beans’ mass?',
        [
          ['180 g', '180 g'],
          ['260 g', '260 g'],
          ['100 g', '100 g'],
        ],
        2,
        '总质量减去容器质量：180 − 80 = 100 g。',
        'Subtract container mass: 180 − 80 = 100 g.',
      ),
    ],
    exit: q(
      '大海绵一定比小金属块质量大吗？',
      'Must a big sponge have more mass than a small metal block?',
      [
        ['一定，越大越重', 'Yes; bigger means heavier'],
        ['不一定，需要测量比较', 'Not necessarily; measure and compare'],
      ],
      1,
      '材料不同，大小不能单独决定质量。以后会用密度解释。',
      'Different materials mean size alone cannot decide mass. Density will explain this later.',
    ),
  },
  {
    id: 'measure-temperature',
    stage: 0,
    unit: 'measurement',
    kind: 'temperature',
    minutes: 12,
    title: t(
      '感觉冷，就真的更冷吗？',
      'Does feeling colder mean being colder?',
    ),
    subtitle: t(
      '木头与金属，藏着一个温度谜题。',
      'Wood and metal hide a temperature mystery.',
    ),
    hook: t(
      '同一个房间里的木桌和金属勺，金属摸起来更冷。温度计会同意你的手吗？',
      'A metal spoon feels colder than a wooden table in the same room. Will a thermometer agree with your hand?',
    ),
    prediction: t(
      '木头和金属在 20°C 房间里放很久后，谁温度更低？',
      'Wood and metal have been in a 20°C room for a long time. Which has a lower temperature?',
    ),
    predictions: [
      t('金属', 'Metal'),
      t('木头', 'Wood'),
      t('都接近 20°C', 'Both are close to 20°C'),
    ],
    explore: t(
      '先“摸一摸”模型，再用温度计测两个物体。它们已经在同一个房间里达到稳定温度。比较感觉与读数。',
      'Try the touch model, then measure both objects with a thermometer. Both have reached a steady temperature in the same room. Compare feeling with readings.',
    ),
    concept: t(
      '温度描述冷热程度，日常常用摄氏度（°C）。手的感觉还受热量流动快慢影响。在这个模型里，皮肤比房间暖，金属从手传走热量更快，所以感觉更冷；这不等于它温度更低。',
      'Temperature describes hotness or coldness, commonly measured in degrees Celsius (°C). Your sensation also depends on how quickly heat flows. Here the skin is warmer than the room. Metal transfers heat away from the hand faster, so it feels colder without having a lower temperature.',
    ),
    example: t(
      '木块与金属块在 20°C 房间中充分放置，温度计都读 20°C。摸起来不同，是热传递速度不同。若刚把金属从冰箱拿出，它可能真的更冷，必须检查条件。',
      'After enough time in a 20°C room, both blocks read 20°C. Different sensations come from different heat-transfer rates. Metal just taken from a fridge could truly be colder, so check the conditions.',
    ),
    misconception: t(
      '温度与“含有多少热能”不是一回事。两个物体温度相同，不代表内部能量相同；热是因温度差而发生的能量传递。后面的热学会进一步解释。',
      'Temperature is not “how much thermal energy” an object contains. Equal temperatures do not imply equal internal energies. Heat is energy transferred because of a temperature difference; thermal physics will develop this later.',
    ),
    realWorld: t(
      '厨房里不能靠手去判断锅的温度。温度计能量化读数，但要选适合物体和温度范围的仪器；这课只用室温物品。',
      'Do not judge a cooking pan’s temperature by touching it. A suitable thermometer gives a reading. Instruments have appropriate objects and temperature ranges; this lesson uses only room-temperature items.',
    ),
    summary: t(
      '感觉冷不等于温度低；比较温度要用合适的温度计，并说明条件。',
      'Feeling colder does not always mean a lower temperature. Compare with a suitable thermometer and specify the conditions.',
    ),
    homeExperiment: t(
      '选择在室内放置较久的金属勺和木勺，短暂触摸后记录感觉。如果没有适合表面测量的温度计，只记录感觉和待验证的问题，不把猜想写成实测温度。避开热、冰冷或尖锐物品。',
      'Briefly touch a metal and a wooden spoon that have been indoors for a long time. Record how they feel. Without a suitable surface thermometer, record your sensation and a question, not an invented temperature. Avoid hot, very cold or sharp objects.',
    ),
    vocabulary: [
      t('温度', 'temperature'),
      t('温度计', 'thermometer'),
      t('热传递', 'heat transfer'),
    ],
    questions: [
      q(
        '同温度的金属和木头，金属为什么感觉更冷？',
        'Why can metal feel colder than wood at the same temperature?',
        [
          ['金属把手的热量传走得更快', 'Metal transfers heat away faster'],
          ['温度计总是错误', 'Thermometers are always wrong'],
          ['金属没有温度', 'Metal has no temperature'],
        ],
        0,
        '在皮肤更暖的条件下，热量传走更快会带来更冷的感觉。',
        'When skin is warmer, faster heat transfer away produces a colder sensation.',
      ),
      q(
        '木头 20°C、金属 20°C，谁温度更高？',
        'Wood is 20°C and metal is 20°C. Which has a higher temperature?',
        [
          ['木头', 'Wood'],
          ['金属', 'Metal'],
          ['一样', 'Equal'],
        ],
        2,
        '同一个温标上的相同读数表示相同温度。',
        'Equal readings on the same scale mean equal temperature.',
      ),
      q(
        '金属刚从冰箱拿出，还能直接用“同温度”的结论吗？',
        'Can you assume equal temperatures if the metal just came from the fridge?',
        [
          [
            '能，金属永远和木头同温',
            'Yes; metal is always the same temperature as wood',
          ],
          ['不能，放置条件改变了', 'No; the conditions have changed'],
        ],
        1,
        '这个结论依赖两者在同一房间充分达到稳定温度。',
        'The comparison relies on both objects reaching a steady temperature in the same room.',
      ),
    ],
    exit: q(
      '想比较两个室温物体的温度，最可靠的证据是什么？',
      'What is the most reliable evidence when comparing two room-temperature objects?',
      [
        ['谁摸起来更冷', 'Which feels colder'],
        ['合适的温度计读数', 'Readings from a suitable thermometer'],
      ],
      1,
      '感觉受材料影响；仪器读数才能检验温度是否不同。',
      'Sensation depends on material; suitable readings test whether temperatures differ.',
    ),
  },
  {
    id: 'tables-and-data',
    stage: 0,
    unit: 'patterns',
    kind: 'data',
    minutes: 15,
    title: t('把发现装进一张表。', 'Put discoveries into a table.'),
    subtitle: t(
      '一次结果可能偶然，几次记录才能比较。',
      'Compare repeated records, not one lucky result.',
    ),
    hook: t(
      '朋友说光滑地面滚得远，可他只记住了最好的一次。这样的证据够好吗？',
      'A friend says a smooth surface rolls farther, but remembers only the best trial. Is that good evidence?',
    ),
    prediction: t(
      '比较两个地面，怎样记录更有说服力？',
      'Which record makes a stronger surface comparison?',
    ),
    predictions: [
      t('只记最远的一次', 'Record only the longest roll'),
      t(
        '每种地面都记录三次和单位',
        'Record three trials per surface with units',
      ),
      t('只写“感觉不错”', 'Write only “seems good”'),
    ],
    explore: t(
      '给每种地面各记录三次示例距离。表格会把条件、次数和读数摆在一起。比较每组的范围与平均值。这里的数据用于学习记录方法，不是你家的实测结果。',
      'Record three example distances for each surface. The table groups conditions, trial numbers and readings. Compare ranges and means. These are teaching data, not measurements from your home.',
    ),
    concept: t(
      '表格让人看清“在什么条件下，测到了什么”。列标题写清量和单位，每次测量占一行或一格。保留全部读数，再找共同趋势。多次记录有差异，并不等于实验失败。',
      'A table shows what was measured under which conditions. Label quantities and units, and give each reading a place. Keep all readings, then look for a shared trend. Variation does not automatically mean an experiment failed.',
    ),
    example: t(
      '光滑地面示例：8.8、9.0、9.2 m，平均是 (8.8 + 9.0 + 9.2) ÷ 3 = 9.0 m。粗糙地面：2.8、3.0、3.2 m，平均 3.0 m。这里两个范围没有重叠，结果支持“这组条件下光滑地面滚得更远”。',
      'Smooth-surface examples are 8.8, 9.0 and 9.2 m, averaging (8.8 + 9.0 + 9.2) ÷ 3 = 9.0 m. Rough-surface examples average 3.0 m from 2.8, 3.0 and 3.2 m. The ranges do not overlap here, supporting farther travel on the smooth surface under these conditions.',
    ),
    misconception: t(
      '平均值不能掩盖乱做的实验，也不能证明所有地面都如此。如果换了起始速度，或者两组结果差异很小，还需要检查条件和测量误差。',
      'A mean cannot rescue an unfair test or prove a claim about all surfaces. If starting speed changed, or the groups differ only slightly, examine conditions and measurement uncertainty.',
    ),
    realWorld: t(
      '选保温杯时，可以记录相同初温、相同水量下，5、10、15 分钟后的水温。把条件写清，才知道比较的是什么。这里只设计记录，不处理热水。',
      'To compare insulated cups, plan temperature readings at 5, 10 and 15 minutes using the same starting temperature and amount of water. Record the conditions. This is a record-design task, not a hot-water experiment.',
    ),
    summary: t(
      '记录条件、数字与单位；保留所有重复结果，再寻找趋势。',
      'Record conditions, numbers and units. Keep repeated readings and look for trends.',
    ),
    homeExperiment: t(
      '选上一课的安全测量任务，记录三次。表格标题写“次数”和“测量量（单位）”。差异小也要如实写下，不复制一个数字来凑三次。',
      'Repeat a safe measurement task three times. Label the table “trial” and “quantity (unit)”. Record even small differences honestly; do not copy one number to invent three trials.',
    ),
    vocabulary: [t('数据', 'data'), t('表格', 'table'), t('平均值', 'mean')],
    questions: [
      q(
        '列标题“距离（m）”比“结果”好在哪里？',
        'Why is “distance (m)” a better heading than “result”?',
        [
          ['字更多', 'It has more letters'],
          ['说明测什么和用什么单位', 'It states the quantity and unit'],
        ],
        1,
        '表格要让别人不用猜就知道数字的意义。',
        'A reader should understand what the numbers mean without guessing.',
      ),
      q(
        '3 次测量是 4、5、6 cm，平均值是多少？',
        'The readings are 4, 5 and 6 cm. What is the mean?',
        [
          ['5 cm', '5 cm'],
          ['15 cm', '15 cm'],
          ['6 cm', '6 cm'],
        ],
        0,
        '总和 15 cm 除以 3 次，得到 5 cm。',
        'Divide the sum of 15 cm by three readings to get 5 cm.',
      ),
      q(
        '一次读数与其他两次差很多，最好的第一步是什么？',
        'One reading differs greatly from the other two. What is a good first step?',
        [
          ['悄悄删掉', 'Silently delete it'],
          [
            '保留记录，检查条件和方法，再测',
            'Keep it, check the method and repeat',
          ],
        ],
        1,
        '异常结果值得调查；不能只因为不喜欢就删掉。',
        'An unusual reading deserves investigation, not deletion just because you dislike it.',
      ),
    ],
    exit: q(
      '哪一个结论最符合这课的示例数据？',
      'Which claim fits this lesson’s example data best?',
      [
        ['所有光滑地面永远滚 9 m', 'Every smooth surface always gives 9 m'],
        [
          '在相同起始条件下，这组光滑地面示例滚得更远',
          'For equal starting conditions, this smooth-surface dataset travels farther',
        ],
      ],
      1,
      '结论应与证据范围相称，不把一组例子说成所有情况。',
      'Keep the claim within the evidence; one dataset does not cover every case.',
    ),
  },
  {
    id: 'simple-graphs',
    stage: 0,
    unit: 'patterns',
    kind: 'graph',
    minutes: 15,
    title: t('一条线，讲一个走路故事。', 'A line tells a walking story.'),
    subtitle: t(
      '不是地图，而是时间与路程的关系。',
      'A relationship between time and distance, not a map.',
    ),
    hook: t(
      '一条线先往上走，接着变平，再往上走。机器人是在上山吗？',
      'A line rises, becomes flat, then rises again. Is the robot climbing a hill?',
    ),
    prediction: t(
      '在路程—时间图上，一段水平线表示什么？',
      'What does a horizontal segment on a distance–time graph mean?',
    ),
    predictions: [
      t('地面水平', 'The ground is level'),
      t(
        '这一段时间没有走新的路程',
        'No new distance is travelled during that time',
      ),
      t('时间停止了', 'Time has stopped'),
    ],
    explore: t(
      '选“走走停停”，移动时间滑块。看同一个时间对应表格里的数字、图中的点、跑道上的位置。再与“匀速前进”比较。',
      'Choose “walk and pause”, then move the time slider. Match the table value, plotted point and track position at the same time. Compare with steady walking.',
    ),
    concept: t(
      '图像先看坐标轴：横轴是时间（s），纵轴是已经走过的总路程（m）。每个点把一对数据放在一起。线越往上，累计路程越多；水平线表示时间过去了，但路程没增加。',
      'Read the axes first: time (s) horizontally, total distance travelled (m) vertically. Each point pairs two readings. A rising line means accumulated distance increases; a flat line means time passes without extra distance.',
    ),
    example: t(
      '走走停停的数据：0 s 时 0 m，1 s 时 2 m，2 s 时 2 m，3 s 时 2 m，4 s 时 4 m。从 1 s 到 3 s，时间增加 2 s，路程没有增加，表示停了 2 s。',
      'Walk-and-pause data are 0 m at 0 s, 2 m at 1 s, 2 m at 2 s, 2 m at 3 s, and 4 m at 4 s. From 1 s to 3 s, two seconds pass with no added distance: a two-second stop.',
    ),
    misconception: t(
      '图上的线不是道路形状。它不是在画上坡、平地和下坡，而是在表示两个量的关系。这张累计路程图只示范沿直线向前走；以后会区分位置图与路程图。',
      'The plotted line is not the shape of the road. It shows a relationship between quantities, not hills and flat ground. This cumulative-distance example uses forward straight-line travel; later we will distinguish position from distance graphs.',
    ),
    realWorld: t(
      '同样的方法能画温度—时间图，但纵轴必须改成温度和 °C。看任何图之前，都先问“横轴、纵轴各是什么？”',
      'The same approach can show temperature against time, but the vertical axis must become temperature in °C. Before interpreting any graph, ask what each axis means.',
    ),
    summary: t(
      '先看量与单位；一个点是一对读数；水平路程线表示暂时没走新的路程。',
      'Read quantities and units first. Each point pairs readings. A horizontal distance segment means no extra distance travelled.',
    ),
    homeExperiment: t(
      '在纸上画一段自己的想象路线数据：走 1 秒、停 2 秒、再走 1 秒。先写表格，再画路程—时间图。比较图像与道路地图有什么不同。',
      'Invent data for walking one second, stopping two seconds, then walking one more second. Make a table first, then a distance–time graph. Compare it with a road map.',
    ),
    vocabulary: [
      t('坐标轴', 'axis'),
      t('数据点', 'data point'),
      t('路程—时间图', 'distance–time graph'),
    ],
    questions: [
      q(
        '横轴是时间，纵轴是路程，点 (2 s, 3 m) 说了什么？',
        'On a time–distance graph, what does (2 s, 3 m) mean?',
        [
          ['2 s 时累计走过 3 m', 'By 2 s, 3 m has been travelled'],
          ['走了 2 m 用 3 s', '2 m in 3 s'],
          ['道路高 3 m', 'The road is 3 m high'],
        ],
        0,
        '先按坐标轴认清每个数字对应的量。',
        'Match each number to its axis quantity.',
      ),
      q(
        '从 1 s 到 3 s，路程一直是 2 m，停了多久？',
        'Distance remains at 2 m from 1 s to 3 s. How long is the stop?',
        [
          ['1 s', '1 s'],
          ['2 s', '2 s'],
          ['3 s', '3 s'],
        ],
        1,
        '时间间隔 = 3 − 1 = 2 s。',
        'The interval is 3 − 1 = 2 s.',
      ),
      q(
        '想把温度数据画出来，纵轴应该怎么改？',
        'To plot temperature readings, how should the vertical axis change?',
        [
          ['仍写路程（m）', 'Keep distance (m)'],
          ['写温度（°C）', 'Label temperature (°C)'],
        ],
        1,
        '坐标轴必须与实际数据的量和单位一致。',
        'Axis quantities and units must match the actual data.',
      ),
    ],
    exit: q(
      '路程—时间图的线向上倾斜，能证明道路是上坡吗？',
      'Does a rising distance–time line prove the road goes uphill?',
      [
        ['能，线往上就是上坡', 'Yes; rising means uphill'],
        ['不能，线表示路程随时间增加', 'No; distance increases with time'],
      ],
      1,
      '这不是地形图；它显示运动数据的关系。',
      'This is not a terrain map; it represents motion data.',
    ),
  },
];
