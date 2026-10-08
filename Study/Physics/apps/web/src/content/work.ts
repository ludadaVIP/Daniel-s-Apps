import { t, q, type Lesson } from './schema';

export const workLessons: Lesson[] = [
  {
    id: 'work-force-displacement',
    stage: 2,
    unit: 'work',
    kind: 'work-direction',
    minutes: 18,
    title: t(
      '提着书包很累，提力一定对它做功了吗？',
      'Holding a bag is tiring. Does the lifting force do work on it?',
    ),
    subtitle: t(
      '先指明物体、力，再看它怎样移动。',
      'Name the object and force, then follow its displacement.',
    ),
    hook: t(
      '原地提书包、平着搬书包、把它抬上桌，手都用了力。三件事对书包的机械功一样吗？',
      'Holding a bag still, carrying it level and lifting it onto a table all involve force. Is the mechanical work on the bag the same?',
    ),
    prediction: t(
      '理想情况下，书包被水平匀速搬2 m，手的提力竖直向上。这个提力对书包做多少功？',
      'A bag moves steadily 2 m horizontally while the hand’s support force points straight up. How much work does this support force do on the bag?',
    ),
    predictions: [
      t(
        '零；移动没有沿提力方向的分量',
        'Zero; displacement has no component along the support force',
      ),
      t('只要累就一定是正功', 'Positive whenever the person feels tired'),
      t('距离乘书包质量就是功', 'Distance times bag mass gives work'),
    ],
    explore: t(
      '完整观察“推着走、原地提、水平搬、往上抬”四个情景。紫色箭头是指定力，金色箭头是物体位移，别把手的动作和物体位移混在一起。还可试慢慢放下。',
      'Watch all four cases: push, hold, carry level and lift. Purple marks the specified force; gold marks the object’s displacement. Distinguish hand activity from object displacement. Try slow lowering too.',
    ),
    concept: t(
      '物理里的“功”描述力通过物体沿力方向的位移传递能量。一定先说“哪个力对哪个物体”。恒力与位移同向时做正功；物体没位移或位移与力垂直时，这个力做零功。反向时可做负功，表示这个力从物体的机械能中取走能量。这里都以地面为参考。',
      'Mechanical work describes energy transferred by a force through an object’s displacement along that force. First specify which force and which object. A constant force does positive work along displacement, zero work with no displacement or perpendicular displacement, and negative work when opposing displacement. We use the ground frame.',
    ),
    formula: t(
      '同向恒力：W=Fs；垂直或无位移：W=0；反向恒力：W=−Fs。',
      'Constant force: same direction W=Fs; perpendicular or no displacement W=0; opposite direction W=−Fs.',
    ),
    example: t(
      '6 N水平推力，向右移动2 m：W=12 J。20 N提力，向上抬1 m：W=20 J。相同提力原地提住或水平搬2 m：都是0 J。慢慢向下放1 m时，向上的提力做−20 J；重力同时做正功。',
      'A 6 N push over 2 m right does 12 J. A 20 N upward force lifting 1 m does 20 J. That support force does 0 J when holding still or carrying level for 2 m. When lowering 1 m, the upward force does −20 J while gravity does positive work.',
    ),
    misconception: t(
      '“这个力对书包做零功”不等于“人没有消耗能量”。肌肉维持姿势会使用体内化学能，也会产生内能变化。现实行走时书包可能上下晃动；那要按实际位移和力重新分析。不能仅凭感觉累或路程长判断功。',
      'Zero work by this force on the bag does not mean zero energy used by the person. Muscles use chemical energy to maintain posture, with internal-energy changes. A real walking bag may bob up and down, requiring analysis of actual forces and displacements. Tiredness or path length alone does not establish work.',
    ),
    realWorld: t(
      '把箱子推过地板，抬书上架，慢慢放下杯子：都可以先画物体位移和某一个力的箭头，再判断这个力的功。',
      'Pushing a box, shelving a book and gently lowering a cup: draw the object’s displacement and one force before judging that force’s work.',
    ),
    summary: t(
      '不是“有没有努力”，而是“这个力对这个物体，沿力方向移动了多少”。',
      'For this force on this object, how much displacement lies along the force?',
    ),
    homeExperiment: t(
      '用轻书比较原地托住、平着移动、慢慢抬高。画地面参考下的提力和位移，不需长时间举着，更不要用累的程度充当功的测量。',
      'Use a light book to compare a brief hold, level carry and slow lift. Draw support force and displacement in the ground frame. Do not hold it for a long time or use tiredness as a work measurement.',
    ),
    vocabulary: [
      t('功', 'work'),
      t('位移', 'displacement'),
      t('指定力', 'specified force'),
      t('机械功', 'mechanical work'),
    ],
    questions: [
      q(
        '手向上提书，书没移动。这个提力对书的机械功？',
        'A hand supports a stationary book. Its mechanical work on the book?',
        [
          ['0 J', '0 J'],
          ['只要有力就大于零', 'Positive whenever there is force'],
        ],
        0,
        '位移为零，所以这个力的机械功为零。人仍可能消耗体内能量。',
        'Displacement is zero, so this force does zero mechanical work. The person can still use internal chemical energy.',
      ),
      q(
        '6 N恒力与2 m位移同向，做功多少？',
        'A constant 6 N force acts along 2 m displacement. Its work?',
        [
          ['3 J', '3 J'],
          ['12 J', '12 J'],
          ['12 N', '12 N'],
        ],
        1,
        'W=6×2=12 J，N·m等于J。',
        'W=6×2=12 J; a newton-metre equals a joule.',
      ),
      q(
        '书包水平匀速移动，竖直提力为什么做零功？',
        'Why does vertical support do zero work during steady level carrying?',
        [
          ['因为书包没重力', 'Because the bag has no gravity'],
          ['位移与指定力垂直', 'Displacement is perpendicular to that force'],
        ],
        1,
        '书包仍有重力和提力；指定力与位移的关系决定这里的功。',
        'Gravity and support still act. The relation of the specified force to displacement determines this work.',
      ),
    ],
    exit: q(
      '向上提力20 N，书包慢慢下降1 m。提力的功是？',
      'An upward 20 N support force accompanies slow lowering by 1 m. Its work?',
      [
        ['−20 J', '−20 J'],
        ['+20 J，因为力向上', '+20 J because force points up'],
        ['零，因为速度不快', 'Zero because it is slow'],
      ],
      0,
      '力与位移相反，提力做负功；慢不等于没有位移。',
      'Force opposes displacement, so support does negative work. Slow does not mean no displacement.',
    ),
  },
  {
    id: 'work-force-distance-area',
    stage: 2,
    unit: 'work',
    kind: 'work-area',
    minutes: 18,
    title: t(
      '推力翻倍，还是距离加长：功怎样比较？',
      'Double the force or extend the distance: how does work change?',
    ),
    subtitle: t(
      '把力和距离的乘积，变成看得见的面积。',
      'Make force times distance visible as an area.',
    ),
    hook: t(
      '搬运工用4 N推力把箱子匀速推2 m。另一趟用8 N推力走同样距离；第三趟保留4 N但走3 m。怎样公平比较推力做的功？',
      'A mover steadily pushes a box 2 m with 4 N. A second task uses 8 N over the same distance; a third uses 4 N over 3 m. How can we fairly compare work by the applied force?',
    ),
    prediction: t(
      '同向恒力从4 N变8 N，位移仍2 m。推力做功变成几倍？',
      'An aligned constant force changes from 4 to 8 N over the same 2 m. How many times the work?',
    ),
    predictions: [
      t('2倍', '2 times'),
      t('4倍', '4 times'),
      t('匀速，所以推力没做功', 'Zero because motion is steady'),
    ],
    explore: t(
      '记录4 N、2 m基线；只改力到8 N；再回4 N，只把距离改3 m。看力—位移图的长方形面积和能量账本。横轴是位移，不是时间。',
      'Record 4 N over 2 m; change only force to 8 N; return to 4 N and change only distance to 3 m. Compare force–displacement rectangle areas and energy ledgers. The horizontal axis is displacement, not time.',
    ),
    concept: t(
      '恒力与直线位移同向时W=Fs，F用N，s用m，W用J。固定力，距离翻倍功翻倍；固定距离，力翻倍功翻倍。力—位移图中恒力下方的长方形面积就是这个力的功。本模型让摩擦力恰好平衡推力，因此箱子匀速：推力做正功，摩擦力做等量负功，合力做零功。',
      'For an aligned constant force, W=Fs, using N, m and J. Double distance at fixed force, or force at fixed distance, and work doubles. The rectangle under a constant force on a force–displacement plot is its work. Friction balances the applied force here: applied work is positive, frictional work equally negative and net work zero during steady motion.',
    ),
    formula: t(
      '推力功W=F×s；合力功=推力功+摩擦功=0；动能不变。',
      'Applied work W=F×s; net work=applied+frictional work=0; kinetic energy unchanged.',
    ),
    example: t(
      '4 N×2 m=8 J；8 N×2 m=16 J；4 N×3 m=12 J。8 J基线中，推力输入8 J，摩擦功−8 J，箱子动能变化0 J；箱子和地板内能合计增加8 J（忽略其他去向）。',
      '4 N×2 m=8 J; 8 N×2 m=16 J; 4 N×3 m=12 J. In the baseline, applied work is 8 J, frictional work −8 J and kinetic-energy change 0 J. Box-plus-floor internal energy increases by 8 J, with other destinations omitted.',
    ),
    misconception: t(
      '“合力做零功”不能替换成“每个力都没做功”。匀速推箱子仍需输入能量。把力换大而仍然匀速，是同时规定更大的平衡阻力，不是说相同地板会自动产生任意摩擦力。这个教学台比较指定力的功，不测量真实摩擦系数。',
      'Zero net work does not mean every force does zero work. Steady pushing still transfers energy. A larger applied force at steady speed here prescribes a larger balancing resistance; the same real floor does not automatically produce arbitrary friction. This bench compares specified work, not measured friction coefficients.',
    ),
    realWorld: t(
      '推购物车或拖行李时，除了移动距离还要考虑持续施加的力。坡度、地面和轮子会改变阻力；相同距离不保证相同功。',
      'For a shopping cart or luggage, consider the sustained force as well as travel distance. Slopes, surfaces and wheels change resistance; equal distance does not guarantee equal work.',
    ),
    summary: t(
      '恒力功看F×s；匀速只说明合力功为零，不能漏掉输入与去向。',
      'Aligned constant-force work is F×s. Steady motion gives zero net work, with input and destinations still present.',
    ),
    homeExperiment: t(
      '用画图比较：2 N推1 m、2 N推2 m、4 N推1 m。保持相同比例画长方形，先预测再算面积。不用给真实手推的力编一个未经测量的数字。',
      'Draw equal-scale rectangles for 2 N over 1 m, 2 N over 2 m and 4 N over 1 m. Predict before calculating area. Do not invent an unmeasured force for a real hand push.',
    ),
    vocabulary: [
      t('力—位移图', 'force–displacement graph'),
      t('长方形面积', 'rectangle area'),
      t('合力功', 'net work'),
      t('内能增加', 'internal-energy increase'),
    ],
    questions: [
      q(
        '4 N沿运动方向作用3 m，做功？',
        'A 4 N force acts along 3 m displacement. Work?',
        [
          ['12 J', '12 J'],
          ['7 J', '7 J'],
          ['1.33 J', '1.33 J'],
        ],
        0,
        '4×3=12 J。',
        '4×3=12 J.',
      ),
      q(
        '图横轴从0到2 m，力保持8 N。面积表示什么？',
        'A plot spans 0–2 m at a constant 8 N. What does its area represent?',
        [
          ['16秒', '16 seconds'],
          ['指定力做16 J功', '16 J work by the specified force'],
        ],
        1,
        '横轴位移m，纵轴力N，面积单位N·m=J。',
        'Displacement in m times force in N gives N·m=J.',
      ),
      q(
        '箱子匀速，推力做8 J，摩擦功−8 J。动能变化？',
        'A steady box receives 8 J applied work and −8 J frictional work. Kinetic-energy change?',
        [
          ['8 J', '8 J'],
          ['0 J', '0 J'],
          ['−8 J', '−8 J'],
        ],
        1,
        '合力功相加为0；输入能量转入箱子和地板等去向。',
        'Net work sums to zero; input energy transfers into the box and floor and other destinations.',
      ),
    ],
    exit: q(
      '同样做12 J正功，哪组同向恒力和位移也可以？',
      'Which aligned constant-force pair also does 12 J positive work?',
      [
        ['6 N、2 m', '6 N over 2 m'],
        ['6 N、6 m', '6 N over 6 m'],
        ['12 kg、1 m就足够计算', '12 kg and 1 m alone suffice'],
      ],
      0,
      '6×2=12 J。质量不是力，kg不能直接代入F。',
      '6×2=12 J. Mass is not force; kg cannot be substituted for F.',
    ),
  },
  {
    id: 'power-same-job-time',
    stage: 2,
    unit: 'work',
    kind: 'work-power',
    minutes: 18,
    title: t(
      '两台升降机做同样的功，谁的功率更大？',
      'Two hoists do the same work. Which has greater power?',
    ),
    subtitle: t(
      '功回答多少，功率回答每秒多少。',
      'Work asks how much; power asks how much each second.',
    ),
    hook: t(
      '把同一个箱子送上同一层架子，一台用8 s，一台用4 s。终点一样，能量增加一样，为什么电机的任务功率不同？',
      'The same box reaches the same shelf in 8 s on one hoist and 4 s on another. Same endpoint and energy increase: why do their task powers differ?',
    ),
    prediction: t(
      '做同样20 J功，从8 s缩短到4 s，平均机械功率怎样变化？',
      'The same 20 J of work takes 4 s instead of 8 s. How does average mechanical power change?',
    ),
    predictions: [
      t('翻倍', 'Doubles'),
      t('功不变，功率也不变', 'Unchanged because work is unchanged'),
      t('变成一半', 'Halves'),
    ],
    explore: t(
      '完整比较A固定2 kg、1 m、8 s，B先2 kg、1 m、4 s，再B用8 s，最后B用4 kg、1 m、4 s。共三次对照，比较同一时钟上的抬升进度、累计功和每台自己的任务时长。',
      'Finish three comparisons. A always lifts 2 kg by 1 m in 8 s. B first does the same in 4 s, then uses 8 s, then lifts 4 kg in 4 s. Follow the shared clock, accumulated work and each hoist’s own task duration.',
    ),
    concept: t(
      '平均功率P=W/t，是完成这项任务的功除以用时。1 W（瓦特）=1 J/s。两台都把2 kg抬高1 m，取g=10 N/kg，做功20 J；8 s是2.5 W，4 s是5 W。更大功率可能来自更短用时，也可能来自同样时间做更多功。功率不是总能量，也不是“总是移动更快”的同义词。',
      'Average power P=W/t is task work divided by its duration. One watt is one joule per second. At g=10 N/kg, lifting 2 kg by 1 m requires 20 J: 2.5 W over 8 s or 5 W over 4 s. Greater power can mean less time or more work in the same time. Power is neither total energy nor simply speed.',
    ),
    formula: t(
      'P=W/t；1 W=1 J/s；功W的符号与瓦特W的单位要看上下文。',
      'P=W/t; 1 W=1 J/s. Distinguish the work symbol W from the watt unit W by context.',
    ),
    example: t(
      'A：20 J/8 s=2.5 W。B：20 J/4 s=5 W。4 s时A做10 J，B已做20 J；B之后等待，不能用A的8 s替换B实际任务的4 s。B改抬4 kg，4 s做40 J，功率10 W，即使抬升速度仍一样。',
      'A: 20 J/8 s=2.5 W. B: 20 J/4 s=5 W. At 4 s, A has done 10 J and B 20 J. B then waits; A’s 8 s does not replace B’s 4 s task duration. With 4 kg, B does 40 J in 4 s, giving 10 W at the same lifting speed.',
    ),
    misconception: t(
      '教学台显示的是货物机械功率，不是电机从插座取电的功率。真实电机会发热，还需考虑启动、停止与效率。画面在完工后停住，不意味着完工那一瞬间仍在输出所标平均功率。',
      'The bench shows mechanical power delivered to the load, not electrical input power. Real motors warm and need acceleration, stopping and efficiency analysis. A frozen completed frame does not imply that the displayed task-average power is still being delivered at that instant.',
    ),
    realWorld: t(
      '电梯、起重机和搬运带都要考虑每秒能做多少功。家电上的W和一天用掉的能量不同；电学课会继续解释输入功率与用电量。',
      'Lifts, cranes and conveyors must deliver work at a rate. An appliance’s watts differ from energy used over a day; later electricity lessons explain input power and energy use.',
    ),
    summary: t(
      '同功比时间，同时间比功；平均功率用每台自己的完整任务W/t。',
      'Compare time for equal work, or work for equal time. Use each task’s own W/t for average power.',
    ),
    homeExperiment: t(
      '同一本轻书从同一桌面移到同一架子，分别用较短和较长时间缓慢完成，不抢速度。终点能量变化一样，任务平均功率不同；没有测质量和高度时只作定性比较。',
      'Slowly move the same light book from the same table to the same shelf over shorter and longer durations. Do not race. Equal endpoint energy changes can have different average powers; without mass and height measurements keep the comparison qualitative.',
    ),
    vocabulary: [
      t('平均功率', 'average power'),
      t('瓦特', 'watt'),
      t('任务用时', 'task duration'),
      t('累计功', 'accumulated work'),
    ],
    questions: [
      q(
        '20 J功在4 s内完成，平均功率？',
        '20 J of work in 4 s gives what average power?',
        [
          ['5 W', '5 W'],
          ['80 W', '80 W'],
          ['5 J', '5 J'],
        ],
        0,
        '20/4=5 J/s=5 W。',
        '20/4=5 J/s=5 W.',
      ),
      q(
        '两台都用4 s，把4 kg和2 kg抬到同一高度，功率谁大？',
        'Both take 4 s to lift 4 kg and 2 kg to the same height. Which has greater power?',
        [
          ['一样，只要速度一样', 'Equal whenever speed matches'],
          ['4 kg那台是另一台的2倍', 'The 4 kg task has twice the power'],
        ],
        1,
        '抬升速度一样，但较重物体做功2倍，同时间功率2倍。',
        'Lifting speed matches, but double mass requires double work and double power in the same time.',
      ),
      q(
        '1 W表示什么？',
        'What does 1 W mean?',
        [
          ['每秒1 J的能量转移率', 'A rate of 1 J each second'],
          ['总共只用1 J', 'Only 1 J total'],
          ['1 N的力', 'A force of 1 N'],
        ],
        0,
        '瓦特是功率单位；要乘用时才得到能量。',
        'A watt measures power; multiply by duration to get energy.',
      ),
    ],
    exit: q(
      'B用4 s完成20 J后等待4 s。它这次抬升的平均功率用哪个时间？',
      'B finishes a 20 J lift in 4 s, then waits 4 s. Which time defines its lift-task average power?',
      [
        ['抬升任务的4 s：5 W', 'The 4 s lift task: 5 W'],
        ['必须用另一台完工的8 s', 'Always the other hoist’s 8 s'],
      ],
      0,
      '题目定义的任务是抬升，不含之后等待；若改成8 s整段观察区间，平均率会是2.5 W，需说清区间。',
      'The defined task is lifting, excluding later waiting. An average over the whole 8 s observation would be 2.5 W; state the interval.',
    ),
  },
  {
    id: 'human-power-vertical-rise',
    stage: 2,
    unit: 'work',
    kind: 'work-human',
    minutes: 19,
    title: t(
      '上楼的你，怎样估算机械功率？',
      'How can you estimate your mechanical power on stairs?',
    ),
    subtitle: t(
      '量竖直高度、质量和时间，不做速度排行榜。',
      'Measure vertical rise, mass and time, without a race.',
    ),
    hook: t(
      '背着自己上楼也是抬高物体。楼梯有斜着的路程，也有竖直升高；哪一个决定身体重力势能的增加？',
      'Climbing stairs raises your own body. Stairs have a sloping path and a vertical rise. Which determines the body–Earth gravitational energy increase?',
    ),
    prediction: t(
      '同一个人上同一层楼，用时翻倍，估算的上升平均机械功率怎样变化？',
      'The same person climbs the same flight in twice the time. What happens to estimated average mechanical power for the rise?',
    ),
    predictions: [
      t('减半；势能增加一样', 'Halves; energy increase stays the same'),
      t('翻倍；时间更长', 'Doubles because it takes longer'),
      t('竖直高度不重要', 'Vertical rise does not matter'),
    ],
    explore: t(
      '教学人物先50 kg、升高3 m、10 s；只改用时20 s；返回10 s，只改质量60 kg；再回50 kg，只改高度2 m。记录四组，把mgh的能量与除以时间的功率分开看。这里是预设数据，不是你的记录。',
      'Use prescribed cases: 50 kg, 3 m rise, 10 s; change only time to 20 s; return to 10 s and change only mass to 60 kg; return to 50 kg and change only rise to 2 m. Record four cases, separating mgh energy from power after dividing by time. These are teaching values, not your records.',
    ),
    concept: t(
      '身体—地球体系的重力势能增加约为mgh，用这份能量除以上楼用时，得到平均上升机械功率P≈mgh/t。m是人及携带物的总质量kg，h是起终点的竖直高度差m，t是同一次上升的时间s。这里取g=10 N/kg；人体实际消耗的化学能还有别的去向，不能用这个公式直接算食物热量。',
      'The body–Earth system gains approximately mgh of gravitational energy. Divide by ascent time to estimate average vertical-rise mechanical power: P≈mgh/t. Mass includes the person and carried items in kg; h is vertical endpoint difference in m; t times that ascent in s. We use g=10 N/kg. Chemical energy used by the body has other destinations, so this formula does not calculate food calories.',
    ),
    formula: t(
      '竖直势能增加ΔEg≈mgh；上升平均机械功率P≈mgh/t。',
      'Vertical energy increase ΔEg≈mgh; average vertical-rise mechanical power P≈mgh/t.',
    ),
    example: t(
      '教学人物50 kg，竖直升高3 m，用10 s：ΔEg=50×10×3=1500 J，P≈150 W。若用20 s，仍1500 J，但75 W。60 kg、3 m、10 s是180 W；50 kg、2 m、10 s是100 W。功率值不能单独作为健康或体能评价。',
      'For a prescribed 50 kg person rising 3 m in 10 s, ΔEg=50×10×3=1500 J and P≈150 W. Over 20 s it is still 1500 J but 75 W. A 60 kg, 3 m, 10 s case gives 180 W; 50 kg, 2 m, 10 s gives 100 W. These powers alone are not health or fitness assessments.',
    ),
    misconception: t(
      '不要把楼梯斜长代入h，也不要把kg当成重力N。这个估算忽略起终点动能差，描述上升机械能，不包括身体全部能量消耗。开始结束位置、计时规则和携带物必须一致；次数不同、质量不同的数字不能直接排名。',
      'Do not use sloping stair length for h or treat kg as weight in N. This estimate omits endpoint kinetic-energy differences and describes rising mechanical energy, not all energy consumed by the body. Keep endpoints, timing rules and carried items consistent; unmatched cases cannot be ranked directly.',
    ),
    realWorld: t(
      '台阶、山路与抬货物都能比较竖直升高和用时。换条更长但同样升高的路径，mgh一样，摩擦、步态和身体消耗却未必一样。',
      'Steps, hills and lifting loads connect vertical rise with time. A longer route with the same rise gives the same mgh, while friction, gait and bodily energy use can differ.',
    ),
    summary: t(
      '看同一次上升的总质量、竖直高度和时间；算的是机械估计，不是人的分数。',
      'Match mass, vertical rise and time for one ascent. The result is a mechanical estimate, not a score for a person.',
    ),
    homeExperiment: t(
      '与家长在熟悉、干燥的楼梯正常步行观察，不跑不竞赛。先记录共同起终点、总质量与台阶竖直高度合计；自愿计时，休息后再试，保留每次原始用时。没有条件可以先画楼梯、标出h，或在手帐写预测。',
      'With a parent, observe normal walking on familiar dry stairs, without running or competing. Record shared endpoints, total mass and the sum of vertical step heights. Timing is optional; rest between trials and retain original times. Without suitable conditions, draw and label h or record a prediction in the notebook.',
    ),
    vocabulary: [
      t('竖直高度差', 'vertical rise'),
      t('总质量', 'total mass'),
      t('机械功率估算', 'mechanical-power estimate'),
      t('计时区间', 'timed interval'),
    ],
    questions: [
      q(
        '50 kg、g=10 N/kg、竖直升高3 m，势能增加？',
        '50 kg, g=10 N/kg, 3 m vertical rise. Energy increase?',
        [
          ['150 J', '150 J'],
          ['1500 J', '1500 J'],
          ['1500 W', '1500 W'],
        ],
        1,
        '50×10×3=1500 J，是能量，不是功率。',
        '50×10×3=1500 J, an energy rather than power.',
      ),
      q(
        '同一次上升1500 J，用20 s，平均机械功率？',
        'A 1500 J rise takes 20 s. Average mechanical power?',
        [
          ['75 W', '75 W'],
          ['150 W', '150 W'],
          ['30000 W', '30000 W'],
        ],
        0,
        '1500/20=75 J/s。',
        '1500/20=75 J/s.',
      ),
      q(
        '楼梯斜长5 m，竖直升高3 m。mgh中h是多少？',
        'Stair path is 5 m, vertical rise 3 m. Which h belongs in mgh?',
        [
          ['5 m', '5 m'],
          ['3 m', '3 m'],
        ],
        1,
        '重力势能变化看竖直高度差，不是沿楼梯走的路程。',
        'Gravitational energy change uses vertical rise, not path length.',
      ),
    ],
    exit: q(
      '算出150 W，能说“身体消耗的化学能每秒正好150 J”吗？',
      'An estimate gives 150 W. Does the body use exactly 150 J of chemical energy per second?',
      [
        [
          '不能；这是上升机械估算，还有其他能量去向',
          'No; this is a rise-mechanical estimate with other energy destinations',
        ],
        ['能；人体全部能量都成了mgh', 'Yes; all bodily energy becomes mgh'],
      ],
      0,
      '身体还有内能变化、动作等能量去向；机械输出与化学能消耗不同。',
      'Internal-energy changes and movements have other destinations; mechanical output differs from chemical-energy consumption.',
    ),
  },
  {
    id: 'machines-ramp-force-distance',
    stage: 2,
    unit: 'work',
    kind: 'work-ramp',
    minutes: 19,
    title: t(
      '斜坡让搬货省力，也会省功吗？',
      'A ramp needs less force. Does it also need less work?',
    ),
    subtitle: t(
      '同一货物、同一高度，交换力和距离。',
      'Same load and height: trade force for distance.',
    ),
    hook: t(
      '直接抬上架、沿短斜坡拉、沿长斜坡拉，都把同一个箱子升高1 m。长斜坡让力变小，能量也凭空省下来了吗？',
      'A direct lift, short ramp and long ramp raise the same load by 1 m. A longer ramp reduces force. Does it also reduce the energy needed?',
    ),
    prediction: t(
      '理想无摩擦，把2 kg货物升高1 m。斜坡长度从2 m增到4 m，所需拉力和做功怎样变？',
      'Without friction, raise 2 kg by 1 m. Doubling ramp length from 2 to 4 m does what to pulling force and work?',
    ),
    predictions: [
      t('拉力减半，功相同', 'Half the force, same work'),
      t('拉力和功都减半', 'Half the force and half the work'),
      t('越长越不需要能量', 'A longer path eventually needs no energy'),
    ],
    explore: t(
      '完整观察理想直提1 m、无摩擦斜坡2 m、无摩擦斜坡4 m，再给4 m斜坡加规定2 N摩擦。保留四组拉力、路程、输入功、势能增加和内能增加。动画展示过程，不预测用时。',
      'Watch four complete cases: ideal direct 1 m lift, frictionless 2 m ramp, frictionless 4 m ramp, then a 4 m ramp with prescribed 2 N friction. Retain force, travel distance, input work, gravitational increase and internal increase. Playback illustrates the process, not task timing.',
    ),
    concept: t(
      '简单机械可以把所需力和施力点移动距离互相交换。本斜坡上货物匀速向上、拉力沿坡：无摩擦时F×L=mgh。相同m与h，坡长L增加，F减少，但输入功相同。加入摩擦后还要克服阻力，输入功=mgh+摩擦力×L；多出来的能量去往货物和斜坡内能等。',
      'Simple machines trade required force against movement distance at the force’s point of application. The load moves steadily upward and pulling is along this ramp. Without friction, F×L=mgh. At fixed m and h, a longer ramp reduces F but preserves input work. Friction adds work: input=mgh+friction×L, with extra energy entering internal stores in load and ramp.',
    ),
    formula: t(
      '理想斜坡：F=mgh/L；输入功FL=mgh。规定摩擦f时：F=mgh/L+f。',
      'Ideal ramp: F=mgh/L and input FL=mgh. With prescribed friction f: F=mgh/L+f.',
    ),
    example: t(
      '2 kg、g=10 N/kg、升高1 m：直提20 N×1 m=20 J；2 m斜坡10 N×2 m=20 J；4 m斜坡5 N×4 m=20 J。4 m坡加2 N摩擦后拉力7 N，输入28 J=20 J势能+8 J内能增加，升高任务效率20/28≈71.4%。',
      'For 2 kg, g=10 N/kg and 1 m rise: 20 N×1 m=20 J direct; 10 N×2 m=20 J on a 2 m ramp; 5 N×4 m=20 J on a 4 m ramp. Adding 2 N friction to the 4 m ramp requires 7 N and 28 J=20 J gravitational increase+8 J internal increase. Rise-task efficiency is about 71.4%.',
    ),
    misconception: t(
      '“省力”不保证“省功”，更不自动代表“省时间”。现实摩擦不是固定2 N，轮子、材料和坡度都可能影响结果。这个模型不含滚动或转动，不是轮椅或车辆所需推力的预测。滑轮、杠杆也是交换力与距离的机械，后续单元再深入。',
      'Less force does not guarantee less work or less time. Real friction is not a universal 2 N; wheels, materials and slope affect it. Rotation and rolling are omitted, so this is not a push-force prediction for a wheelchair or vehicle. Pulleys and levers also trade force and distance and will be explored later.',
    ),
    realWorld: t(
      '搬货斜坡和轮椅坡道都用更长路径减小坡向重力分量。空间、摩擦、稳定性和操作方式同样重要。机械的用处可以是更方便施力，不必创造免费能量。',
      'Loading ramps and accessible ramps reduce the gravitational component along a longer path. Space, friction, stability and handling also matter. A machine can make applying force easier without creating free energy.',
    ),
    summary: t(
      '同一高度，理想机械交换力与距离；有摩擦就把额外能量去向也记上。',
      'At equal rise, ideal machines trade force and distance. Include extra energy destinations when friction is present.',
    ),
    homeExperiment: t(
      '用硬纸板搭低矮斜坡，在桌面轻轻拉同一块小橡皮到同样高度，比较短坡和长坡的路径。没有测力工具就只作定性观察，别写“证明省功”；不让人站上纸板。',
      'Make low cardboard ramps on a table and gently pull the same small eraser to the same height. Compare short and long paths. Without measuring force, keep observations qualitative and do not claim to prove work savings. Do not stand on cardboard.',
    ),
    vocabulary: [
      t('简单机械', 'simple machine'),
      t('斜坡长度', 'ramp length'),
      t('理想无摩擦', 'ideal frictionless'),
      t('力与距离交换', 'force–distance trade-off'),
    ],
    questions: [
      q(
        '理想4 m斜坡，把2 kg抬高1 m，g=10。沿坡拉力？',
        'An ideal 4 m ramp raises 2 kg by 1 m at g=10. Required along-ramp force?',
        [
          ['20 N', '20 N'],
          ['5 N', '5 N'],
          ['2 kg', '2 kg'],
        ],
        1,
        'mgh=20 J，F=20/4=5 N。',
        'mgh=20 J; F=20/4=5 N.',
      ),
      q(
        '同高度的理想短坡和长坡，哪项相同？',
        'For ideal short and long ramps with the same load and rise, which matches?',
        [
          ['输入功', 'Input work'],
          ['拉力和距离都相同', 'Both force and distance'],
        ],
        0,
        '理想输入功等于mgh，长坡拉力更小但距离更长。',
        'Ideal input work equals mgh; longer travel needs less force.',
      ),
      q(
        '4 m坡有2 N摩擦，这部分功8 J去哪里？',
        'A 4 m ramp has 2 N friction. Where does the associated 8 J go?',
        [
          ['消失', 'It vanishes'],
          [
            '货物与斜坡内能增加等去向',
            'Internal-energy increase in load and ramp and other destinations',
          ],
        ],
        1,
        '有用势能20 J之外，额外输入仍有去向。',
        'Extra input beyond the useful 20 J has energy destinations.',
      ),
    ],
    exit: q(
      '有人看拉力从20 N变5 N，便说“只用了四分之一的功”。还缺什么证据？',
      'Someone sees force fall from 20 to 5 N and claims one-quarter of the work. What is missing?',
      [
        [
          '施力点移动距离与条件；要比较F×L',
          'Travel distance and conditions; compare F×L',
        ],
        ['箱子的颜色', 'Box colour'],
      ],
      0,
      '理想例子距离从1 m到4 m，20×1和5×4都是20 J。',
      'In the ideal comparison travel changes from 1 to 4 m: 20×1 and 5×4 both give 20 J.',
    ),
  },
];
