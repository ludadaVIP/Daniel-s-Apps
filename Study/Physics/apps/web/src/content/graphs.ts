import { t, q, type Lesson } from './schema';
type Pair = [string, string];
type Check = [string, string, Pair[], number, string, string];
type Draft = {
  id: string;
  kind: Lesson['kind'];
  minutes: number;
  title: Pair;
  subtitle: Pair;
  hook: Pair;
  prediction: Pair;
  predictions: Pair[];
  explore: Pair;
  concept: Pair;
  example: Pair;
  misconception: Pair;
  realWorld: Pair;
  summary: Pair;
  homeExperiment: Pair;
  vocabulary: Pair[];
  formula: Pair;
  questions: Check[];
  exit: Check;
};
const make = (d: Draft): Lesson => ({
  ...d,
  stage: 4,
  unit: 'graphs',
  title: t(...d.title),
  subtitle: t(...d.subtitle),
  hook: t(...d.hook),
  prediction: t(...d.prediction),
  predictions: d.predictions.map((p) => t(...p)),
  explore: t(...d.explore),
  concept: t(...d.concept),
  example: t(...d.example),
  misconception: t(...d.misconception),
  realWorld: t(...d.realWorld),
  summary: t(...d.summary),
  homeExperiment: t(...d.homeExperiment),
  vocabulary: d.vocabulary.map((p) => t(...p)),
  formula: t(...d.formula),
  questions: d.questions.map((c) => q(...c)),
  exit: q(...d.exit),
});
export const graphLessons: Lesson[] = [
  make({
    id: 'graphs-read-the-axes',
    kind: 'graphs-axes',
    minutes: 18,
    title: [
      '同一机器人，换了坐标单位，运动也变了吗？',
      'One robot, new axis units. Did its motion change?',
    ],
    subtitle: [
      '先读量、单位与刻度，再读图上的一个点。',
      'Read quantities, units and ticks before reading a point.',
    ],
    hook: [
      '机器人从位置2 m出发，以1 m/s向右走。你在图上看到(4,6)，朋友看到(4,600)。你们记录了不同的运动，还是用了不同的尺？',
      'A robot starts at position 2 m and moves right at 1 m/s. Your graph shows (4,6); a friend’s shows (4,600). Different motion, or different rulers?',
    ],
    prediction: [
      '纵轴从m改为cm，同一时刻的位置数值会怎样？',
      'Change the vertical unit from m to cm. What happens to the number for the same position?',
    ],
    predictions: [
      [
        '变为100倍，实际位置不变',
        'It becomes 100 times larger; position is unchanged',
      ],
      ['机器人走快100倍', 'The robot moves 100 times faster'],
      ['数字必须不变', 'The number must stay unchanged'],
    ],
    explore: [
      '完整比较横轴s/纵轴m、横轴s/纵轴cm、横轴min/纵轴m。每次跟踪同一段4 s运动。点的竖向投影读位置，横向投影读时间；自由改变观察到的秒数，看看两个读数如何同时更新。',
      'Compare s/m, s/cm and min/m axes through the same 4 s motion. A point’s projections read position and time. Change the observation duration freely and watch both coordinates update.',
    ],
    concept: [
      '横轴与纵轴是两个量的数值标尺，不一定是房间里的横向和高度。本图横轴是时间t，纵轴是位置x；有时物理量也用x命名，但它并不因此必须放横轴。坐标要按轴的顺序与单位解释。同一运动换单位后数值和刻度会变，物理过程不变。',
      'Axes are numerical scales for two quantities, not necessarily horizontal room distance and height. Here time t is horizontal and position x vertical. A quantity named x need not be on the horizontal axis. Interpret coordinates in axis order with units. Changing units changes values and ticks, not the physical event.',
    ],
    formula: [
      '本模型x = 2 m + (1 m/s)t；1 m = 100 cm；1 min = 60 s',
      'Here x = 2 m + (1 m/s)t; 1 m = 100 cm; 1 min = 60 s',
    ],
    example: [
      't=4 s时x=6 m。以cm为纵轴读600 cm；以min为横轴读4/60≈0.06667 min。起点是2 m，所以走过的路程为4 m，不能把位置6 m直接当路程。',
      'At t=4 s, x=6 m. The centimetre axis reads 600 cm; the minute axis reads 4/60≈0.06667 min. Since the start is 2 m, travelled distance is 4 m; position 6 m is not that distance.',
    ],
    misconception: [
      '图中的线向右上方，不代表机器人正在爬坡。轴标签决定图的含义。别假定一小格永远是1，也别忽略起始位置。',
      'A rising line does not mean the robot climbs a hill. Axis labels define meaning. Do not assume every small tick is one unit or ignore the initial position.',
    ],
    realWorld: [
      '看运动手环、温度记录或设备耗能图时，先问每个轴量什么、用什么单位。图线长得相似，也可能代表完全不同的过程。',
      'For activity, temperature or device-energy charts, first identify each axis quantity and unit. Similar-looking lines can represent very different processes.',
    ],
    summary: [
      '点有两份量与单位；坐标轴是读数工具，不是场景照片。',
      'A point carries two quantities with units; axes are reading tools, not a scene photograph.',
    ],
    homeExperiment: [
      '画机器人在0、2、4 s时的位置2、4、6 m。再用cm标纵轴，保留同样时刻。写一句话解释为什么位置数字变了而运动没变。',
      'Plot positions 2, 4 and 6 m at 0, 2 and 4 s. Relabel the vertical scale in cm with the same times. Explain why position numbers change but motion does not.',
    ],
    vocabulary: [
      ['横轴', 'horizontal axis'],
      ['纵轴', 'vertical axis'],
      ['坐标', 'coordinate'],
      ['刻度', 'scale ticks'],
    ],
    questions: [
      [
        '本图纵轴x量什么？',
        'What does vertical x measure here?',
        [
          ['时间', 'Time'],
          ['相对选定原点的位置', 'Position relative to a chosen origin'],
          ['机器人离地高度', 'Height above the ground'],
        ],
        1,
        '读标签：x是位置，不自动是高度。',
        'Read the label: x is position, not automatically height.',
      ],
      [
        '位置6 m换成cm？',
        'Convert position 6 m to cm.',
        [
          ['600 cm', '600 cm'],
          ['0.06 cm', '0.06 cm'],
          ['6 cm', '6 cm'],
        ],
        0,
        '每米100厘米。',
        'One metre contains one hundred centimetres.',
      ],
      [
        '起点2 m、末点6 m，单向路程？',
        'Start at 2 m and end at 6 m in one direction. Distance?',
        [
          ['6 m', '6 m'],
          ['4 m', '4 m'],
        ],
        1,
        '末位置减起位置。',
        'Subtract starting position from final position.',
      ],
    ],
    exit: [
      '一张图横轴min、另一张s，可以直接比较数字4吗？',
      'One chart uses minutes, another seconds. Can you directly compare two readings of 4?',
      [
        ['先换为同一时间单位，再比较', 'Convert to a common time unit first'],
        ['可以，数字相同就代表同一时刻', 'Yes; equal numbers mean equal times'],
      ],
      0,
      '单位决定4对应的时间量。',
      'The unit determines the duration represented by 4.',
    ],
  }),
  make({
    id: 'graphs-the-returning-walk',
    kind: 'graphs-reading',
    minutes: 19,
    title: [
      '图线停在高处，人是在半空停着吗？',
      'A line rests high on a graph. Is the walker suspended?',
    ],
    subtitle: [
      '让位置、时刻和累积路程讲同一个故事。',
      'Let position, time and accumulated distance tell one story.',
    ],
    hook: [
      '小人在位置1 m出发，2秒后到5 m，停2秒，再返回。位置图中间有一条高高的水平线；最后下降到起点。试着把线翻译成动作。',
      'A walker starts at 1 m, reaches 5 m after 2 s, waits for 2 s, then returns. The position graph has a high horizontal section and later drops to the start. Translate the line into actions.',
    ],
    prediction: [
      '位置–时间图在2到4 s间水平，表示什么？',
      'A position–time graph is horizontal from 2 to 4 s. What does it mean?',
    ],
    predictions: [
      ['在某个高度飞行', 'Flying at a particular height'],
      ['位置不变，停留在那里', 'Position is unchanged; the walker waits there'],
      ['时间停止了', 'Time has stopped'],
    ],
    explore: [
      '完整观察到2、3、5 s三种时刻。共用图线和地面标尺，比较位置、位移与已走路程。自由拖到6 s，检查回到原点附近后，路程是否也变成零。',
      'Observe through 2, 3 and 5 s on one graph and ground ruler. Compare position, displacement and travelled distance. Seek 6 s and check whether returning to the start also makes travelled distance zero.',
    ],
    concept: [
      '读图先选时刻，再沿投影找位置。上升段表示位置增加，水平段表示位置不变，下降段表示位置减少。这里选向右为正，下降就是向左返回。位置是相对原点的坐标；位移是末位置减初位置；路程把每段实际走过的长度相加，不能把返程减掉。',
      'Choose a time, then use its projection to read position. Rising means increasing position, horizontal means unchanged position, falling means decreasing position. Right is positive, so falling means returning left. Position is a coordinate; displacement is final minus initial position; distance adds lengths travelled without subtracting the return leg.',
    ],
    formula: [
      '位移Δx = x末 − x初；路程 = 各段路径长度相加',
      'Displacement Δx = x_final − x_initial; distance = sum of path lengths',
    ],
    example: [
      '3 s时人停在5 m：从1 m出发，位移+4 m，路程4 m。5 s时已返回到3 m：位移+2 m，路程6 m。6 s回到1 m，位移0、路程8 m。',
      'At 3 s the walker waits at 5 m: displacement +4 m and distance 4 m from the 1 m start. At 5 s position is 3 m: displacement +2 m and distance 6 m. At 6 s position is 1 m again: zero displacement and 8 m distance.',
    ],
    misconception: [
      '下降不表示路程被“退还”，水平也不表示人在地面高度为零。若纵轴改为累积路程，它会在返程中继续增加，图像含义随量改变。',
      'A falling position line does not refund distance, and a horizontal line does not imply zero height. A cumulative-distance graph keeps rising during the return. Its meaning depends on the plotted quantity.',
    ],
    realWorld: [
      '等朋友、折返拿书都会在位置记录中留下不同线段。把几段读数画成图，可以解释迟到来自停留还是行进慢；少量点之间仍有未记录过程。',
      'Waiting for a friend or returning for a book leaves different segments in a position record. A graph can distinguish delay from waiting versus slower travel; sparse points still leave unrecorded behavior between them.',
    ],
    summary: [
      '把每段图线译成运动，再区分位置、位移和路程。',
      'Translate each segment into motion and distinguish position, displacement and distance.',
    ],
    homeExperiment: [
      '在纸尺上挪一枚纽扣：1→5格，停两拍，再5→1格。每拍记位置，画位置图和累积路程图。把它标成模型，不假装每拍等于实测1秒。',
      'Move a button on a paper ruler from 1 to 5, wait two beats, then return to 1. Record each position and draw position and distance graphs. Label it a model, not measured one-second timing.',
    ],
    vocabulary: [
      ['位置–时间图', 'position–time graph'],
      ['水平线段', 'horizontal segment'],
      ['位移', 'displacement'],
      ['累积路程', 'accumulated distance'],
    ],
    questions: [
      [
        '3 s时位置？',
        'Position at 3 s?',
        [
          ['0 m', '0 m'],
          ['3 m', '3 m'],
          ['5 m', '5 m'],
        ],
        2,
        '2到4秒一直在位置5 m。',
        'The walker stays at position 5 m from 2 to 4 seconds.',
      ],
      [
        '5 s时已走路程？',
        'Distance travelled by 5 s?',
        [
          ['6 m', '6 m'],
          ['2 m', '2 m'],
          ['3 m', '3 m'],
        ],
        0,
        '去程4 m加返程2 m。',
        'Add 4 m outward and 2 m returning.',
      ],
      [
        '6 s回到起点，哪一项为0？',
        'At 6 s the walker returns. Which is zero?',
        [
          ['路程', 'Distance'],
          ['位移', 'Displacement'],
        ],
        1,
        '位置改变为0，路径长度8 m。',
        'Position change is zero; path length is 8 m.',
      ],
    ],
    exit: [
      '另一张累积路程图下降，首先检查什么？',
      'Another cumulative-distance graph falls. What should you check first?',
      [
        [
          '量名、记录和作图是否有误',
          'Check the quantity label, records and plot',
        ],
        [
          '认为人返回，所以路程必须下降',
          'Assume distance must decrease when returning',
        ],
      ],
      0,
      '累积路程不会因返回而减少。',
      'Accumulated distance does not decrease on a return.',
    ],
  }),
  make({
    id: 'graphs-slope-has-units',
    kind: 'graphs-gradient',
    minutes: 20,
    title: [
      '屏幕上更陡，就一定走得更快吗？',
      'A steeper line on screen: always faster motion?',
    ],
    subtitle: [
      '用纵向变化除以横向变化，而不是量屏幕角度。',
      'Divide vertical change by horizontal change rather than measuring screen angle.',
    ],
    hook: [
      '把同一张位置图拉高，线看起来更陡了。机器人没有更快。怎样算一个不被排版欺骗的“陡”？从两个有单位的点开始。',
      'Stretch a position chart taller and its line looks steeper, but the robot did not speed up. How can steepness be calculated independently of layout? Start with two points carrying units.',
    ],
    prediction: [
      '只把图画高，保留刻度和读数，数值斜率会变吗？',
      'Only stretch the drawing vertically, keeping ticks and readings. Does numerical gradient change?',
    ],
    predictions: [
      ['一定翻倍', 'It must double'],
      ['变成没有单位的角度', 'It becomes a unitless angle'],
      [
        '不变，仍用真实读数求比值',
        'It stays unchanged; use the actual readings',
      ],
    ],
    explore: [
      '比较速度+1、+2、−1 m/s的三条位置线。完整检查1→3 s区间的“横向变化”和“纵向变化”。自由改区间起点，或切换高/扁画面，看看Δx/Δt是否改变。',
      'Compare position lines at +1, +2 and −1 m/s. Inspect rise and run from 1 to 3 s. Change the interval start or tall/flat display and check whether Δx/Δt changes.',
    ],
    concept: [
      '图像斜率是纵轴量的变化除以横轴量的变化，不是图纸上的角度。位置–时间图中斜率=Δx/Δt，单位m/s；直线的斜率表示恒定速度，负号表示沿选定负方向运动。画面长宽比会改变视觉角度，但不会改变有单位的读数比。曲线两点之间算的是区间平均斜率。',
      'Gradient is change in the vertical quantity divided by change in the horizontal quantity, not the paper angle. On a position–time graph, Δx/Δt has units m/s. A straight line means constant velocity; a negative gradient means motion in the chosen negative direction. Aspect ratio changes visual angle without changing the unit-bearing ratio. Between two points on a curve, the result is an interval-average gradient.',
    ],
    formula: [
      '斜率 = Δx/Δt = (x₂−x₁)/(t₂−t₁)，t₂>t₁',
      'Gradient = Δx/Δt = (x₂−x₁)/(t₂−t₁), with t₂>t₁',
    ],
    example: [
      '+2 m/s线在1 s为8 m、3 s为12 m：Δx=4 m、Δt=2 s，斜率2 m/s。−1 m/s线对应5 m与3 m，斜率−2/2=−1 m/s。两点相同时间时不能用除零来求斜率。',
      'At +2 m/s, positions are 8 m at 1 s and 12 m at 3 s: rise 4 m, run 2 s, gradient 2 m/s. At −1 m/s the positions are 5 and 3 m, giving −2/2=−1 m/s. Points at the same time cannot give a gradient by division by zero.',
    ],
    misconception: [
      '纵轴数值大不等于速度大；常量起始位置只会整体抬高线。负速度不是负速率大小，本课−1 m/s对应速率1 m/s、方向向左。',
      'Large vertical position does not mean large velocity. A changed constant start position merely shifts a line. Negative velocity is not negative speed magnitude: −1 m/s here means speed 1 m/s toward the left.',
    ],
    realWorld: [
      '比较不同APP里的活动曲线，别凭线倾斜的外观评判。确认轴量、单位和刻度，再计算对应区间的变化率。',
      'When comparing activity curves from different apps, do not judge by apparent tilt. Check quantities, units and ticks, then calculate the interval rate of change.',
    ],
    summary: [
      '斜率来自读数差的比，单位和方向一起保留。',
      'Gradient comes from a ratio of reading differences; keep its units and direction.',
    ],
    homeExperiment: [
      '把同一组(1 s,8 m)、(3 s,12 m)画在高纸框和扁纸框里。各算4 m/2 s。写清楚视觉角度不同，数值斜率仍相同。',
      'Plot (1 s,8 m) and (3 s,12 m) in tall and flat frames. Calculate 4 m/2 s for both and explain why visual angles differ while gradients match.',
    ],
    vocabulary: [
      ['斜率', 'gradient'],
      ['纵向变化', 'rise'],
      ['横向变化', 'run'],
      ['长宽比', 'aspect ratio'],
    ],
    questions: [
      [
        '纵轴位置m、横轴时间s，斜率单位？',
        'Vertical position in m, horizontal time in s. Gradient unit?',
        [
          ['m²', 'm²'],
          ['m/s', 'm/s'],
          ['s/m', 's/m'],
        ],
        1,
        '纵量单位除以横量单位。',
        'Divide the vertical unit by the horizontal unit.',
      ],
      [
        '两点位置差−4 m、时间差2 s，速度？',
        'Rise −4 m and run 2 s. Velocity?',
        [
          ['−2 m/s', '−2 m/s'],
          ['+2 m/s', '+2 m/s'],
          ['−8 m/s', '−8 m/s'],
        ],
        0,
        '负号保留方向。',
        'The sign retains direction.',
      ],
      [
        '只改变图框形状会改变什么？',
        'Changing only frame shape changes what?',
        [
          ['真实速度', 'Real velocity'],
          [
            '视觉角度，可不改变数值斜率',
            'Visual angle, without changing numerical gradient',
          ],
        ],
        1,
        '刻度与读数决定数值斜率。',
        'Ticks and readings determine numerical gradient.',
      ],
    ],
    exit: [
      '两个位置线平行、起始位置不同，速度关系？',
      'Two position lines are parallel with different start positions. Velocities?',
      [
        [
          '斜率相同，速度相同，位置可不同',
          'Same gradient and velocity; positions may differ',
        ],
        ['高的线一定更快', 'The higher line must be faster'],
      ],
      0,
      '共同轴刻度下，斜率与截距不同含义。',
      'On common axes, gradient and intercept have different meanings.',
    ],
  }),
  make({
    id: 'graphs-area-tells-a-trip',
    kind: 'graphs-area',
    minutes: 22,
    title: [
      '速度图上的一块面积，怎么变成走过的米数？',
      'How does an area on a velocity graph become metres?',
    ],
    subtitle: [
      '正负面积给位移，绝对面积给路程。',
      'Signed area gives displacement; absolute area gives distance.',
    ],
    hook: [
      '以2 m/s走6秒，图下长方形是2×6。若前3秒向右、后3秒向左，两块面积会相消；你真的一步没走吗？让机器人跟着面积账本行动。',
      'Travel at 2 m/s for 6 seconds: the graph rectangle is 2×6. If the first three seconds go right and the last three left, two signed areas cancel. Did you walk no distance? Let a robot follow the area ledger.',
    ],
    prediction: [
      '速度+2 m/s走3 s，再−2 m/s走3 s，位移与路程？',
      'Travel at +2 m/s for 3 s then −2 m/s for 3 s. Displacement and distance?',
    ],
    predictions: [
      ['位移12 m、路程12 m', 'Displacement 12 m, distance 12 m'],
      ['两者都是0', 'Both are zero'],
      ['位移0、路程12 m', 'Displacement zero, distance 12 m'],
    ],
    explore: [
      '完整比较匀速、等时往返和从0线性增至4 m/s的三种6秒运动。看速度图的着色区域与同尺上的机器人。自由改变观察截止时刻，核对部分面积与位置。',
      'Compare three 6 s motions: steady, equal-time return, and velocity rising linearly from 0 to 4 m/s. Connect shaded regions with the robot on one ruler. Change the observation cutoff and check partial area against position.',
    ],
    concept: [
      '速度–时间图的小长方形：速度×时间，单位(m/s)×s=m，表示位移。正方向的面积为正，负方向的为负；相加得到净位移。路程则把正负区域的面积大小都加起来。线性加速图可用三角形面积½底×高；一般曲线需分割成小块近似，后续再学习积分。',
      'A velocity–time rectangle gives velocity×time with units (m/s)×s=m, hence displacement. Above-zero area is positive, below-zero negative; their sum gives net displacement. Distance adds the magnitudes of both. A linear acceleration graph uses triangle area ½ base×height. General curves require smaller-piece approximations; integration comes later.',
    ],
    formula: [
      '位移 = 速度–时间图的带符号面积；路程 = 速率–时间图面积',
      'Displacement = signed velocity–time area; distance = speed–time area',
    ],
    example: [
      '匀速：2×6=12 m。往返：(+2)×3+(−2)×3=0 m，路程6+6=12 m。线性增速：½×6 s×4 m/s=12 m；不能只拿末速度4乘6。',
      'Steady: 2×6=12 m. Return: (+2)×3+(−2)×3=0 m; distance is 6+6=12 m. Linear ramp: ½×6 s×4 m/s=12 m. Multiplying final velocity 4 by 6 overestimates this ramp.',
    ],
    misconception: [
      '图下面积是否有意义，要由两个轴决定。位置–时间面积的单位m·s，不是路程；功率–时间面积的单位W·s=J，才表示能量。图的纸面平方厘米不是物理答案单位。',
      'Area meaning depends on both axes. Position–time area has units m·s, not distance; power–time area has units W·s=J and represents energy. Paper square centimetres are not the physical answer unit.',
    ],
    realWorld: [
      '设备耗能记录中的功率–时间面积，能把不同时间段的电能累加。运动与耗能用到同一个“按轴单位解释面积”的思路，不能混用答案单位。',
      'Power–time area adds energy across device-use segments. Motion and energy share the idea of interpreting area through axis units, while their answer units remain different.',
    ],
    summary: [
      '面积先读轴单位，再判断符号、图形与累加方式。',
      'For area, read axis units first, then signs, shape and the way pieces add.',
    ],
    homeExperiment: [
      '画两块相等速度矩形，一块+2×3，一块−2×3。用不同颜色表示正负，分别算净面积0和面积大小总和12，解释返程为什么不抹掉路程。',
      'Draw equal rectangles +2×3 and −2×3 in different colors. Calculate net area zero and total magnitude twelve; explain why a return does not erase distance.',
    ],
    vocabulary: [
      ['图下面积', 'area under a graph'],
      ['带符号面积', 'signed area'],
      ['速率–时间图', 'speed–time graph'],
      ['三角形面积', 'triangle area'],
    ],
    questions: [
      [
        '匀速2 m/s走6 s的图面积？',
        'Area for constant 2 m/s over 6 s?',
        [
          ['2 m', '2 m'],
          ['6 m', '6 m'],
          ['12 m', '12 m'],
        ],
        2,
        '高度乘时间宽度。',
        'Multiply velocity height by time width.',
      ],
      [
        '6 s内从0线性增至4 m/s，位移？',
        'Velocity rises linearly from 0 to 4 m/s over 6 s. Displacement?',
        [
          ['12 m', '12 m'],
          ['24 m', '24 m'],
          ['4 m', '4 m'],
        ],
        0,
        '三角形面积½×6×4。',
        'Triangle area is ½×6×4.',
      ],
      [
        '往返两块速度面积相消，代表？',
        'Two signed velocity areas cancel during a return. Meaning?',
        [
          ['没有运动', 'No motion occurred'],
          [
            '净位移0，路程仍可非零',
            'Zero net displacement with possibly nonzero distance',
          ],
        ],
        1,
        '净改变与累积路径不同。',
        'Net change and accumulated path are different.',
      ],
    ],
    exit: [
      '恒定3 W设备的功率–时间图持续10 s，面积意义？',
      'A constant 3 W power–time graph spans 10 s. Meaning of its area?',
      [
        ['转移电能30 J', 'Transferred electrical energy 30 J'],
        ['移动路程30 m', 'Travelled distance 30 m'],
      ],
      0,
      'W×s=J，轴量决定意义。',
      'W×s=J; the axis quantities determine meaning.',
    ],
  }),
  make({
    id: 'graphs-lines-and-starts',
    kind: 'graphs-linear',
    minutes: 20,
    title: [
      '两块材料升温线平行，起点为什么可以不同？',
      'Two heating lines are parallel. Why can their starts differ?',
    ],
    subtitle: [
      '分开读截距与斜率，把直线写成一条模型。',
      'Read intercept and gradient separately and express a line as a model.',
    ],
    hook: [
      '教学金属块A从20°C、B从30°C开始，都每秒升1°C。两条线平行，B始终更热。B吸收能量的功率一定更大吗？',
      'Teaching metal blocks A and B start at 20°C and 30°C, both warming by 1°C each second. Their lines are parallel and B stays hotter. Must B receive greater power?',
    ],
    prediction: [
      '热容与输入功率相同，初温不同，温度–时间线怎样？',
      'Same heat capacity and input power, different initial temperatures. Temperature–time lines?',
    ],
    predictions: [
      ['斜率一定不同', 'Their gradients must differ'],
      [
        '斜率相同，纵轴截距不同',
        'Same gradient, different vertical intercepts',
      ],
      ['两条线必须重合', 'They must coincide'],
    ],
    explore: [
      '比较初温20°C/100 W、30°C/100 W、20°C/200 W，热容均100 J/K。完整看6秒线段与变化账本。自由改变功率，观察哪个因素改变截距，哪个改变斜率。',
      'Compare 20°C/100 W, 30°C/100 W and 20°C/200 W at heat capacity 100 J/K. Inspect six-second lines and their ledgers. Change power freely and identify what sets intercept versus gradient.',
    ],
    concept: [
      '线性关系y=b+mx中b是x=0时的纵轴值，m是斜率。它不一定是正比；正比还需要b=0。本课完美隔热、恒定功率、恒定热容且不发生相变：T=T₀+(P/C)t，所以截距T₀、斜率P/C。温差1 K与温差1°C数值相同，但绝对温标零点不同。',
      'A linear relation y=b+mx has intercept b, the vertical value at x=0, and gradient m. It need not be direct proportion, which also requires b=0. Our insulated, constant-power, constant-capacity model without phase change has T=T₀+(P/C)t: intercept T₀ and gradient P/C. A 1 K temperature change equals a 1°C change numerically; absolute zero points differ.',
    ],
    formula: [
      'T = T₀ + (P/C)t；本模型C = 100 J/K',
      'T = T₀ + (P/C)t; here C = 100 J/K',
    ],
    example: [
      '100 W/(100 J/K)=1 K/s。初温20°C，6秒后26°C；初温30°C，6秒后36°C。功率改200 W、初温仍20°C，斜率2 K/s，6秒后32°C。',
      '100 W/(100 J/K)=1 K/s. Starting at 20°C gives 26°C after 6 s; starting at 30°C gives 36°C. At 200 W from 20°C the gradient is 2 K/s and final temperature 32°C.',
    ],
    misconception: [
      '线画得高只说明温度高，不能单独判断输入功率。也别说“20°C翻倍为40°C意味着储能翻倍”；温度刻度零点与能量模型都要考虑。',
      'A higher line indicates higher temperature, not power by itself. Also, doubling the numerical Celsius value from 20 to 40 does not establish doubled stored energy: temperature origin and the energy model matter.',
    ],
    realWorld: [
      '读升温记录时，初温影响达到某个温度所需的时间；变化率还受热容、功率和散热影响。实际曲线可能弯曲，本图先让两种直线参数可见。',
      'In heating records, starting temperature affects time to a target. Rate also depends on capacity, power and losses. Real traces may curve; this model first separates two line parameters.',
    ],
    summary: [
      '截距说明起点，斜率说明变化率；直线不自动等于正比。',
      'Intercept describes the start; gradient describes change rate. Straight does not automatically mean proportional.',
    ],
    homeExperiment: [
      '用纸画T=20+t与T=30+t，时间0到6秒。画第三条T=20+2t。标每条线的起点与每秒增量；无需实际加热或碰触热器具。',
      'On paper plot T=20+t, T=30+t and T=20+2t for 0–6 seconds. Label starts and per-second increments, without heating or touching hot equipment.',
    ],
    vocabulary: [
      ['线性关系', 'linear relation'],
      ['截距', 'intercept'],
      ['初始值', 'initial value'],
      ['变化率', 'rate of change'],
    ],
    questions: [
      [
        '哪一参数决定本图纵轴截距？',
        'Which parameter sets the vertical intercept?',
        [
          ['功率P', 'Power P'],
          ['时间t', 'Time t'],
          ['初温T₀', 'Initial temperature T₀'],
        ],
        2,
        't=0时T=T₀。',
        'At t=0, T=T₀.',
      ],
      [
        '初温20°C，斜率2 K/s，6 s后？',
        'Start 20°C with gradient 2 K/s. After 6 s?',
        [
          ['32°C', '32°C'],
          ['12°C', '12°C'],
          ['40°C', '40°C'],
        ],
        0,
        '20°C + (2 K/s) × 6 s = 32°C。',
        '20°C + (2 K/s) × 6 s = 32°C.',
      ],
      [
        'T=20+t是T与t正比吗？',
        'Is T directly proportional to t in T=20+t?',
        [
          ['是，线是直的', 'Yes; the line is straight'],
          ['不是，有非零截距', 'No; its intercept is nonzero'],
        ],
        1,
        'T/t不恒定，起点不在原点。',
        'T/t is not constant and the line does not pass through the origin.',
      ],
    ],
    exit: [
      '相同功率与热容，把初温调高5°C，温度线怎样？',
      'Same power and capacity, starting temperature raised by 5°C. What changes?',
      [
        [
          '整体上移5°C，斜率不变',
          'It shifts up by 5°C with unchanged gradient',
        ],
        ['斜率增为5倍', 'The gradient becomes five times larger'],
      ],
      0,
      '截距改变，P/C不变。',
      'The intercept changes while P/C stays unchanged.',
    ],
  }),
  make({
    id: 'graphs-curves-change-rate',
    kind: 'graphs-curve',
    minutes: 22,
    title: [
      '同样过一秒，图线为什么越走越陡？',
      'Each interval lasts one second. Why does the curve grow steeper?',
    ],
    subtitle: [
      '比较区间斜率，再换一个横轴寻找规律。',
      'Compare interval gradients, then change the horizontal quantity to find a pattern.',
    ],
    hook: [
      '小车从静止开始，每秒速度增加1 m/s。位置–时间图不是直线。前面一秒和后面一秒走的米数不一样；曲线告诉你什么正在改变？',
      'A cart starts at rest and gains 1 m/s each second. Its position–time graph curves. Early and later one-second intervals cover different distances. What does the changing curve reveal?',
    ],
    prediction: [
      '这个模型中1→2 s与4→5 s，哪一段平均速度更大？',
      'In this model, which interval has greater mean velocity: 1→2 s or 4→5 s?',
    ],
    predictions: [
      ['前一段', 'The earlier interval'],
      ['一样，因为都是1秒', 'Equal because both last one second'],
      ['后一段', 'The later interval'],
    ],
    explore: [
      '比较x–t图的1→2 s、4→5 s，再把相同4→5 s区间放到x–t²图。完整检查两点、变化量和斜率单位；自由改变区间起点，保持宽度1 s。',
      'Compare 1→2 s and 4→5 s on x–t, then the same 4→5 s interval on x–t². Inspect points, differences and gradient units. Change interval start freely while retaining one-second duration.',
    ],
    concept: [
      '本模型初速0、加速度1 m/s²：x=½at²。曲线两点间的Δx/Δt是平均速度，随所选区间改变；曲线某一点的瞬时速度要看局部切线，后面再学。把横轴换成t²，得到x=(½a)t²的一条过原点直线。此时斜率单位m/s²，数值½a；它不再表示速度。',
      'Here initial velocity is zero and acceleration 1 m/s², so x=½at². The two-point Δx/Δt is mean velocity and depends on the interval. Instantaneous velocity uses the local tangent, covered later. Replacing the horizontal quantity by t² makes x=(½a)t² a line through the origin. Its gradient has units m/s² and equals ½a, not velocity.',
    ],
    formula: [
      'x = ½at²；平均速度 = Δx/Δt；x–t²图斜率 = ½a',
      'x = ½at²; mean velocity = Δx/Δt; x–t² gradient = ½a',
    ],
    example: [
      '1→2 s：位置0.5→2 m，平均1.5 m/s。4→5 s：位置8→12.5 m，平均4.5 m/s。在x–t²图，横差25−16=9 s²，纵差4.5 m，斜率0.5 m/s²。',
      'From 1 to 2 s, position goes 0.5→2 m, giving 1.5 m/s mean. From 4 to 5 s, position goes 8→12.5 m, giving 4.5 m/s mean. On x–t², horizontal change is 25−16=9 s²; vertical change 4.5 m gives gradient 0.5 m/s².',
    ],
    misconception: [
      '一条曲线没有一个对所有区间都相同的斜率。换横轴得到直线，也不能把新斜率沿用成旧的物理量；先读新单位。线性化帮助检验模型，并不证明模型对所有范围成立。',
      'A curve does not have one gradient shared by every interval. Making it straight with a new horizontal variable does not preserve the old slope meaning; read the new units. Linearizing helps test a model, not prove its validity over every range.',
    ],
    realWorld: [
      '加速运动和平方关系的数据可以通过换变量来寻找简单规律。直线化的结果要与模型条件、原始数据和残差一起看，不能只求一张漂亮直线。',
      'Acceleration and square-relation data can reveal simpler patterns through transformed variables. Read the result with model conditions, original data and residuals, rather than judging only its straight appearance.',
    ],
    summary: [
      '曲线提示变化率可能在变；变换坐标后要重新解释斜率。',
      'Curvature can indicate a changing rate; transformed axes require a new slope interpretation.',
    ],
    homeExperiment: [
      '列0、1、2、3 s对应0、0.5、2、4.5 m。分别画横轴t与t²的两张图，标单位；解释一个是曲线、一个是直线，而四个运动时刻相同。',
      'Table 0, 1, 2 and 3 s against positions 0, 0.5, 2 and 4.5 m. Plot with horizontal t and t², labeling units. Explain why the shapes differ while the four motion events remain identical.',
    ],
    vocabulary: [
      ['曲线', 'curve'],
      ['区间平均斜率', 'interval-average gradient'],
      ['变量变换', 'variable transformation'],
      ['局部切线', 'local tangent'],
    ],
    questions: [
      [
        '4→5 s平均速度？',
        'Mean velocity from 4 to 5 s?',
        [
          ['0.5 m/s', '0.5 m/s'],
          ['1.5 m/s', '1.5 m/s'],
          ['4.5 m/s', '4.5 m/s'],
        ],
        2,
        '(12.5−8)/(5−4)=4.5。',
        '(12.5−8)/(5−4)=4.5.',
      ],
      [
        'x–t²图斜率单位？',
        'Gradient unit on x–t²?',
        [
          ['m/s²', 'm/s²'],
          ['m/s', 'm/s'],
          ['s²/m', 's²/m'],
        ],
        0,
        '纵轴m除以横轴s²。',
        'Divide vertical metres by horizontal seconds squared.',
      ],
      [
        '两点算出的曲线斜率表示？',
        'A two-point slope on the x–t curve represents…',
        [
          [
            '必定等于所有时刻瞬时速度',
            'The instantaneous velocity at every moment',
          ],
          ['该区间的平均速度', 'Mean velocity over that interval'],
        ],
        1,
        '一个区间比值不能描述所有局部速度。',
        'One interval ratio cannot describe every local velocity.',
      ],
    ],
    exit: [
      '横轴由t换成t²后，斜率0.5能写成速度0.5 m/s吗？',
      'After replacing t with t², can gradient 0.5 be called velocity 0.5 m/s?',
      [
        [
          '不能；新单位m/s²，本模型等于½a',
          'No; the new unit is m/s² and here it equals ½a',
        ],
        ['能，斜率永远都是速度', 'Yes; gradient always means velocity'],
      ],
      0,
      '斜率的物理意义来自两个轴。',
      'The two axes determine gradient’s physical meaning.',
    ],
  }),
  make({
    id: 'graphs-evidence-not-decoration',
    kind: 'graphs-experiment',
    minutes: 23,
    title: [
      '散点不在直线上，怎样留下可信的规律？',
      'Scattered points: how can you retain a trustworthy pattern?',
    ],
    subtitle: [
      '保留重复读数，区分散布、零点与拟合假设。',
      'Retain repeats and distinguish scatter, zero offset and fitting assumptions.',
    ],
    hook: [
      '测力为0时，长度读数却约2 cm；其他读数随力增加。有人把每个点连成锯齿，有人强迫线经过原点。先检查零点，再看重复测量，会得到不同解释。',
      'At zero force the length reading is about 2 cm, then increases with force. One person joins every dot in a zigzag; another forces a line through zero. Check zero and repeated readings before interpreting the pattern.',
    ],
    prediction: [
      '换成更粗的1 cm刻度后，零点偏差会自动消失吗？',
      'Switch to coarser 1 cm divisions. Does the zero offset disappear automatically?',
    ],
    predictions: [
      ['会，读数更整齐就更正确', 'Yes; neater numbers are more correct'],
      [
        '不会；粗刻度可能隐藏散布，但不修正零点',
        'No; coarse resolution can hide scatter without correcting zero',
      ],
      ['任何三次平均都消除零点偏差', 'Any three-read mean removes zero offset'],
    ],
    explore: [
      '检查三组教学读数：细刻度未校零、细刻度减2 cm零点、粗刻度未校零。保留每个力下的三次读数与均值；图中竖线表示读数范围。再自由尝试强制过原点，看线与数据偏离的位置。',
      'Inspect fine uncorrected, fine with 2 cm zero correction and coarse uncorrected teaching readings. Retain three readings and mean at each force; vertical spans show reading ranges. Try forcing the fit through the origin and observe disagreement.',
    ],
    concept: [
      '实验图先标量与单位，把每次读数画成点，再结合条件选模型。重复散布可用最小到最大范围描述，但范围不是完整的不确定度或置信区间。用一条拟合线概括近似线性趋势，比逐点连接更适合找关系；还要检查残差。零点偏差让整组读数平移，平均不会自动去掉。校零要有参考证据，本例零力约2 cm。',
      'Label quantities and units, plot every reading, then choose a model using experimental conditions. Min-to-max spans describe repeat scatter, not full uncertainty or confidence intervals. A fitted line summarizes an approximately linear trend more suitably than joining dots when seeking a relation; inspect residuals too. Zero offset shifts the readings and is not removed by averaging. Correction needs reference evidence: zero-force readings are about 2 cm here.',
    ],
    formula: [
      '校正读数 = 原读数 − 零点偏差；残差 = 读数 − 拟合值',
      'Corrected reading = raw reading − zero offset; residual = reading − fitted value',
    ],
    example: [
      '2 N时三次原读数12.1、11.9、12.2 cm，均值约12.067 cm，范围11.9–12.2 cm。减2 cm后均值约10.067 cm，范围9.9–10.2 cm。散布宽度没变，整组位置改变。',
      'At 2 N, raw readings 12.1, 11.9 and 12.2 cm have mean about 12.067 cm and range 11.9–12.2 cm. Subtracting 2 cm gives mean about 10.067 cm and range 9.9–10.2 cm. Scatter width is unchanged while all values shift.',
    ],
    misconception: [
      '拟合线不是“每个测量都精确正确”，更不是所有弯曲数据都该压成直线。强迫原点只有在模型与零点证据支持时才合理；本例未校正的2 cm偏差不能装作零。粗刻度均值很整齐也不证明没有误差。',
      'A fit does not certify every reading as exact, and curved data should not always be forced into a line. An origin constraint requires model and zero evidence; this uncorrected 2 cm offset cannot be treated as zero. Neat coarse means do not prove absence of error.',
    ],
    realWorld: [
      '家庭调查记录可以保留原始表，再明确写出校零、排除与拟合理由。若异常点存在，先检查过程和单位；不能只因为“不好看”就删除。这里是合成教学数据，不冒充你的实验。',
      'For a home investigation, keep the raw table and document corrections, exclusions and fit choices. Check procedures and units before handling unusual points; appearance alone is not a reason to delete. These are synthetic teaching readings, not your experiment.',
    ],
    summary: [
      '图像是证据的组织方式；原始读数、条件与处理理由都要可追踪。',
      'A graph organizes evidence; raw readings, conditions and processing reasons must remain traceable.',
    ],
    homeExperiment: [
      '用纸上的这组读数重画2 N的三点、均值与范围。另画减2 cm后的三点。写清楚你用了教学数据，并解释平均与校零分别解决什么问题。',
      'Redraw the three 2 N teaching points, their mean and range on paper, then the corrected points. Label the data as supplied examples and explain what averaging and zero correction each address.',
    ],
    vocabulary: [
      ['散点', 'scatter points'],
      ['拟合线', 'fitted line'],
      ['零点偏差', 'zero offset'],
      ['残差', 'residual'],
    ],
    questions: [
      [
        '减去相同2 cm偏差后，重复读数范围宽度？',
        'After subtracting the same 2 cm, repeat-range width?',
        [
          ['变为0', 'It becomes zero'],
          ['不变，整组平移', 'Unchanged; the group shifts'],
          ['翻倍', 'It doubles'],
        ],
        1,
        '校零不消除原有读数散布。',
        'Zero correction does not eliminate repeat scatter.',
      ],
      [
        '未校正数据零力读约2 cm，应该？',
        'Uncorrected zero-force readings are about 2 cm. What should you do?',
        [
          [
            '保留证据、解释零点后再决定处理',
            'Keep evidence and explain zero before choosing processing',
          ],
          [
            '为了漂亮强制所有点过原点',
            'Force the fit through zero for appearance',
          ],
        ],
        0,
        '约束必须由模型和证据支持。',
        'A constraint needs model and evidence support.',
      ],
      [
        '图中最小到最大竖线是什么？',
        'What do min-to-max vertical spans represent?',
        [
          ['完整统计置信区间', 'Full statistical confidence intervals'],
          ['这三次读数的范围', 'The range of these three readings'],
        ],
        1,
        '没有自动推断全部不确定度。',
        'They do not automatically infer all uncertainty.',
      ],
    ],
    exit: [
      '重复读数很一致，但参考点总多2 cm，怎样改进？',
      'Repeats agree closely, but a reference always reads 2 cm too high. Improvement?',
      [
        [
          '查零点与校准，保留原值并写出校正',
          'Check zero/calibration, retain originals and document correction',
        ],
        ['只重复更多次，偏差必消失', 'Repeat more and the bias must disappear'],
      ],
      0,
      '重复性与系统偏差是不同问题。',
      'Repeatability and systematic offset are different issues.',
    ],
  }),
];
