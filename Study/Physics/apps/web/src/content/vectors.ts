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
  unit: 'vectors',
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
export const vectorLessons: Lesson[] = [
  make({
    id: 'vectors-two-journey-accounts',
    kind: 'vectors-quantities',
    minutes: 20,
    title: [
      '走了7米，为什么离起点只有5米？',
      'Seven metres walked. Why only five metres from the start?',
    ],
    subtitle: [
      '一趟取书路，两本账：路程与位移。',
      'One library trip, two accounts: distance and displacement.',
    ],
    hook: [
      '从书桌向东4 m，再向北3 m拿书。脚步共走7 m，但一根从书桌拉到书架的直绳只有5 m。这两个答案谁错了？',
      'Walk 4 m east from a desk, then 3 m north to collect a book. Your feet travel 7 m, but a straight string from desk to shelf is 5 m. Which answer is wrong?',
    ],
    prediction: [
      '把向东4 m、向北3 m改成直接到同一书架，什么不变？',
      'Replace 4 m east then 3 m north with a direct route to the same shelf. What stays unchanged?',
    ],
    predictions: [
      [
        '位移不变，路程变短',
        'Displacement stays unchanged; distance becomes shorter',
      ],
      ['路程必须仍是7 m', 'Distance must remain 7 m'],
      ['位移必须变为零', 'Displacement must become zero'],
    ],
    explore: [
      '完整比较拐角路、向东再原路返回、直接到书架。动画以1 m/s走过选定路线；同时看累计路程和起点到当前位置的箭头。自由缩放整条路线，再试试零长度路线。',
      'Compare the corner route, an eastward out-and-back trip, and the direct shelf route. Model speed is 1 m/s. Watch accumulated distance and the start-to-current-position arrow together. Scale the whole route freely, including zero length.',
    ],
    concept: [
      '标量只需要数值与单位来描述，例如质量、温度、路程和速率。向量还需要方向，例如位移、速度和力。位移连接初位置与末位置，路径细节不决定它；路程把实际路径长度相加。向量的大小也是标量，但仅写大小会丢掉方向。温度为负也仍是标量：有正负号不等于有空间方向。',
      'A scalar needs a value and unit, such as mass, temperature, distance or speed. A vector also needs direction, such as displacement, velocity or force. Displacement connects initial and final positions; the path does not determine it. Distance adds path lengths. A vector’s magnitude is a scalar, but stating only magnitude loses direction. Negative temperature is still scalar: a sign does not automatically encode a spatial direction.',
    ],
    formula: [
      '二维位移Δr = (Δx, Δy)；大小|Δr| = √(Δx² + Δy²)；路程 = 路径长度之和',
      '2D displacement Δr = (Δx, Δy); magnitude |Δr| = √(Δx² + Δy²); distance = sum of path lengths',
    ],
    example: [
      '拐角路：路程4+3=7 m，位移(4,3) m，大小√(16+9)=5 m，方向为东偏北约36.87°。直接走同样起终点：路程5 m、位移仍(4,3) m。向东4 m再返回：路程8 m、位移零；零向量没有唯一方向。',
      'Corner route: distance 4+3=7 m; displacement (4,3) m, magnitude √(16+9)=5 m, about 36.87° north of east. Same endpoints by a direct route: distance 5 m, displacement still (4,3) m. East 4 m and back: distance 8 m, zero displacement; a zero vector has no unique direction.',
    ],
    misconception: [
      '不能把路程7 m和位移5 m当成同一个量的两次测量。速度包含方向，速率不包含；同样速率的两人可以背向而行。',
      'Distance 7 m and displacement magnitude 5 m are not rival measurements of one quantity. Velocity includes direction; speed does not. Two people at the same speed can move in opposite directions.',
    ],
    realWorld: [
      '导航的步行路线长度用于估计走多久；从出发地到目的地的方向箭头用于定位。快递机器人需要同时知道走过多少和现在相对起点在哪里。',
      'A walking navigation route length helps estimate travel time; a start-to-destination arrow locates the destination. Delivery robots need both distance travelled and current position relative to their start.',
    ],
    summary: [
      '先问“量什么”，再写答案；位移的大小不能代替整份位移。',
      'Identify the quantity before answering; magnitude alone is not a complete displacement.',
    ],
    homeExperiment: [
      '在纸上画4格向东、3格向北和直达线，每格代表1 m。分别标路程与位移箭头，再画原路返回；只做纸上路线，不需要到道路上测量。',
      'On paper, draw four squares east, three north, and the direct line, each square representing 1 m. Label distance and displacement separately, then draw the return. This is a paper route; no road measurements are needed.',
    ],
    vocabulary: [
      ['标量', 'scalar'],
      ['向量', 'vector'],
      ['大小', 'magnitude'],
      ['零向量', 'zero vector'],
    ],
    questions: [
      [
        '拐角路的路程和位移大小？',
        'Corner-route distance and displacement magnitude?',
        [
          ['都为7 m', 'Both 7 m'],
          ['7 m与5 m', '7 m and 5 m'],
          ['5 m与7 m', '5 m and 7 m'],
        ],
        1,
        '路程沿路径相加；位移大小取起终点的直线距离。',
        'Distance follows the path; displacement magnitude uses the straight start-to-end separation.',
      ],
      [
        '向东4 m再向西4 m回起点，位移？',
        'East 4 m then west 4 m to the start. Displacement?',
        [
          ['零向量，方向不唯一', 'Zero vector; direction is undefined'],
          ['8 m向西', '8 m west'],
          ['8 m向东', '8 m east'],
        ],
        0,
        '末位置等于初位置，路程8 m不会消失。',
        'Final and initial positions coincide; the 8 m distance does not disappear.',
      ],
      [
        '下列哪个描述包含完整向量信息？',
        'Which describes a complete vector?',
        [
          ['速率3 m/s', 'Speed 3 m/s'],
          ['速度3 m/s向北', 'Velocity 3 m/s north'],
          ['温度−3°C', 'Temperature −3°C'],
        ],
        1,
        '速度需要大小和方向；温度的符号不是空间方向。',
        'Velocity needs magnitude and direction; a temperature sign is not spatial direction.',
      ],
    ],
    exit: [
      '两条不同路线有相同起点和终点，必然相同的是？',
      'Two different routes have identical starting and finishing positions. What must match?',
      [
        ['位移向量', 'Displacement vector'],
        ['路程与用时', 'Distance and time'],
      ],
      0,
      '位移由起终点决定，路线和用时可不同。',
      'Endpoints determine displacement; path length and duration can differ.',
    ],
  }),
  make({
    id: 'vectors-name-a-direction',
    kind: 'vectors-direction',
    minutes: 19,
    title: [
      '两个机器人都3 m/s，速度相同吗？',
      'Both robots travel at 3 m/s. Do they have the same velocity?',
    ],
    subtitle: [
      '约定参考方向，再解释正负分量。',
      'Choose reference directions before interpreting signed components.',
    ],
    hook: [
      '一个机器人向东3 m/s，另一个向北3 m/s。它们的仪表都显示3。为什么运动控制器不能只收到这个数字？',
      'One robot moves east at 3 m/s; another moves north at 3 m/s. Both speed displays say 3. Why can their controllers not use that number alone?',
    ],
    prediction: [
      '东行与北行机器人，哪项相同？',
      'What is the same for eastward and northward robots?',
    ],
    predictions: [
      ['速度向量', 'Velocity vectors'],
      ['速率', 'Speeds'],
      ['两个轴的分量', 'Both coordinate components'],
    ],
    explore: [
      '完整比较向东、向北、向西的3 m/s箭头。默认+x向东、+y向北。自由旋转坐标轴到90°：实际箭头和东、北基准保持不动，只有分量读数改变。',
      'Compare east, north and west velocity arrows of 3 m/s. Default +x is east and +y north. Rotate the coordinate axes freely to 90°: the physical arrow and east/north references stay fixed while component readings change.',
    ],
    concept: [
      '方向要相对一个约定来写。这里从东向北逆时针量角：东0°、北90°、西180°。+x向东时，西行的x分量为负；负分量表示沿该轴反向，不表示负的速率。换坐标轴是换描述工具，不是让机器人转向。先写轴的正方向，才能读懂(3,0)或(−3,0)。',
      'Direction needs a reference convention. Here angles are measured counterclockwise from east toward north: east 0°, north 90°, west 180°. With +x east, westward x velocity is negative; a negative component means opposite the positive axis, not negative speed. Changing axes changes the description, not the robot’s heading. State positive directions before interpreting (3,0) or (−3,0).',
    ],
    formula: [
      '固定东/北坐标：v = (v东, v北)；速率|v| ≥ 0；角度从东逆时针量',
      'Fixed east/north coordinates: v = (v_east, v_north); speed |v| ≥ 0; angles measured counterclockwise from east',
    ],
    example: [
      '默认轴下东行为(3,0) m/s，北行为(0,3)，西行为(−3,0)，速率都为3。将轴逆时针转90°，+x′指北、+y′指西；同一东行速度变为(0,−3) m/s，实际方向仍是东。',
      'With default axes, east is (3,0) m/s, north (0,3), west (−3,0), all at speed 3. Rotate axes 90° counterclockwise: +x′ points north and +y′ west. The same eastward velocity becomes (0,−3) m/s, still physically eastward.',
    ],
    misconception: [
      '地图旋转不会使真实道路旋转。罗盘方位角常从北顺时针量，与本课从东逆时针量不同，不能把不同约定的数字直接套用。',
      'Rotating a map does not rotate real roads. Compass bearings often start north and increase clockwise, unlike this lesson’s counterclockwise-from-east convention. Do not mix the numerical conventions.',
    ],
    realWorld: [
      '机器人、地图和游戏画面可能选不同坐标轴。交流方向时，说“向北3 m/s”或先写坐标约定，比孤零零的“+3”可靠。',
      'Robots, maps and games can use different axes. Saying “3 m/s north” or stating the coordinate convention is more reliable than an isolated “+3”.',
    ],
    summary: [
      '方向属于运动，分量属于选定坐标；换坐标不等于换运动。',
      'Direction belongs to the motion; components depend on the chosen axes. Changing axes does not change motion.',
    ],
    homeExperiment: [
      '在纸上画东行箭头，在透明纸或另一张纸上画一对直角轴。转轴90°，保留东行箭头的位置，解释为什么分量的符号会变。',
      'Draw an eastward arrow and a perpendicular axis pair on tracing paper or another sheet. Rotate the axes 90° while keeping the arrow fixed; explain why component signs change.',
    ],
    vocabulary: [
      ['参考方向', 'reference direction'],
      ['正方向', 'positive direction'],
      ['有符号分量', 'signed component'],
      ['坐标轴', 'coordinate axes'],
    ],
    questions: [
      [
        '+x向东时，向西3 m/s的x分量？',
        'With +x east, x velocity for 3 m/s west?',
        [
          ['+3 m/s', '+3 m/s'],
          ['0 m/s', '0 m/s'],
          ['−3 m/s', '−3 m/s'],
        ],
        2,
        '向西沿+x的反向，速率仍是3 m/s。',
        'West opposes +x; speed remains 3 m/s.',
      ],
      [
        '旋转坐标轴后，实际速度向量？',
        'After rotating the coordinate axes, the actual velocity vector?',
        [
          [
            '不变，只换分量描述',
            'Unchanged; only its component description changes',
          ],
          ['一定转到新+x方向', 'Must turn to the new +x direction'],
        ],
        0,
        '换描述工具不改变物理运动。',
        'Changing the description does not alter physical motion.',
      ],
      [
        '本课的90°指向哪里？',
        'Where does 90° point under this lesson’s convention?',
        [
          ['东', 'East'],
          ['北', 'North'],
          ['南', 'South'],
        ],
        1,
        '从东向北逆时针量90°。',
        'Measure 90° counterclockwise from east toward north.',
      ],
    ],
    exit: [
      '别人给你(−2,0) m/s，但没说明坐标轴，能判定是向西吗？',
      'Someone reports (−2,0) m/s without defining axes. Can you conclude it points west?',
      [
        [
          '不能，先问轴的正方向',
          'No; first ask for the positive axis directions',
        ],
        ['能，负号永远表示西', 'Yes; a minus sign always means west'],
      ],
      0,
      '符号依赖坐标约定，不自动是罗盘方向。',
      'Signs depend on the coordinate convention, not an automatic compass direction.',
    ],
  }),
  make({
    id: 'vectors-arrows-need-a-scale',
    kind: 'vectors-arrows',
    minutes: 18,
    title: [
      '把风的箭头画长一倍，风就变了吗？',
      'Draw a wind arrow twice as long. Did the wind change?',
    ],
    subtitle: [
      '箭头表达大小和方向，先约定每格代表多少。',
      'Arrows express magnitude and direction; define the scale first.',
    ],
    hook: [
      '天气板上，一支向东的风速箭头长45像素，另一张图长90像素。两张图都写3 m/s。是哪个画错了，还是它们使用了不同的比例？',
      'A weather board has a 45-pixel eastward wind-velocity arrow; another draws it 90 pixels long. Both say 3 m/s. Is one wrong, or do they use different scales?',
    ],
    prediction: [
      '同一3 m/s向东的风，画图比例从15改为30像素/(m/s)，箭头怎样变化？',
      'For the same 3 m/s eastward wind, change scale from 15 to 30 pixels/(m/s). What changes?',
    ],
    predictions: [
      [
        '长度翻倍，风速向量不变',
        'Arrow length doubles; wind velocity is unchanged',
      ],
      ['风速变6 m/s', 'Wind becomes 6 m/s'],
      ['方向反过来', 'Direction reverses'],
    ],
    explore: [
      '完整比较3 m/s、6 m/s和只平移画图位置的6 m/s。默认15像素/(m/s)。自由改变比例，核对箭头的像素长度和仍带单位的风速读数。',
      'Compare 3 m/s, 6 m/s, and the same 6 m/s represented at a shifted drawing location. Default scale is 15 pixels/(m/s). Change the drawing scale freely and compare pixel length with the physical velocity reading.',
    ],
    concept: [
      '箭尾是表示的起点，箭头端显示方向，长度按比例表示向量大小。本课只画同一处的均匀风速信息，所以把表示箭头平移不会改变所表达的速度。绘图位置和真实物体的位置是两回事；比较长短前，必须保证表示同种量且比例相同。',
      'The tail starts the representation; the arrowhead gives direction; length expresses magnitude using a scale. Here arrows represent uniform wind velocity at one location, so translating the drawing leaves the represented velocity unchanged. Drawing location and an object’s real position are different. Compare lengths only for the same quantity under the same scale.',
    ],
    formula: [
      '箭头像素长度 = 绘图比例 × 向量大小；15像素/(m/s) × 6 m/s = 90像素',
      'Arrow pixel length = drawing scale × magnitude; 15 pixels/(m/s) × 6 m/s = 90 pixels',
    ],
    example: [
      '共同比例15像素/(m/s)下，3和6 m/s箭头长45和90像素，方向都向东。把6 m/s箭头的箭尾移到另一处，长度和方向不变，仍表示同一个速度。改变比例到30后，3 m/s箭头也长90像素。',
      'At 15 pixels/(m/s), 3 and 6 m/s arrows are 45 and 90 pixels long, both eastward. Moving the 6 m/s drawing tail leaves length and direction unchanged, representing the same velocity. At scale 30, a 3 m/s arrow is also 90 pixels long.',
    ],
    misconception: [
      '不能只凭屏幕上哪个箭头长就比较大小。本课平移的是速度的表示；对真实物体施加的力，作用点可能影响转动，不能因此随意改变作用点。',
      'Screen length alone cannot compare magnitudes across scales. Here we translate a velocity representation. For a real applied force, its application point can affect turning, so this is not permission to move that application point.',
    ],
    realWorld: [
      '天气图、导航和物理受力图都使用箭头。寻找图例、单位和比例，再判断方向与大小；“箭头更长”要有比例作为证据。',
      'Weather maps, navigation and force diagrams use arrows. Find the legend, unit and scale before judging direction and magnitude. “A longer arrow” needs a shared scale as evidence.',
    ],
    summary: [
      '同种量、同一比例才能用长度比较；移动画图位置不自动改变所表示的向量。',
      'Compare lengths under a common quantity and scale; moving a drawing does not automatically change its represented vector.',
    ],
    homeExperiment: [
      '在纸上用1 cm代表1 m/s画3 m/s和6 m/s向东的箭头；再用1 cm代表2 m/s画同样的风速。把两套比例写在图旁，避免混用。',
      'On paper, use 1 cm for 1 m/s to draw eastward 3 and 6 m/s arrows; redraw them using 1 cm for 2 m/s. Label both scales to prevent mixing them.',
    ],
    vocabulary: [
      ['箭尾', 'tail'],
      ['箭头端', 'arrowhead'],
      ['绘图比例', 'drawing scale'],
      ['平移表示', 'translated representation'],
    ],
    questions: [
      [
        '15像素/(m/s)下，6 m/s箭头多长？',
        'At 15 pixels/(m/s), how long is a 6 m/s arrow?',
        [
          ['90像素', '90 pixels'],
          ['6像素', '6 pixels'],
          ['15像素', '15 pixels'],
        ],
        0,
        '比例乘大小，物理单位约去后得到像素长度。',
        'Multiply scale by magnitude; physical units cancel to give pixel length.',
      ],
      [
        '改变绘图比例，真实风速？',
        'After changing the drawing scale, actual wind velocity?',
        [
          ['同倍变大', 'Increases by the same factor'],
          ['不变', 'Unchanged'],
        ],
        1,
        '只改变表示，不改变风的模型。',
        'Only the representation changes, not the wind model.',
      ],
      [
        '可以把不同图中的箭头长度直接比较吗？',
        'Can arrow lengths in different diagrams be compared directly?',
        [
          ['要先核对量和比例', 'First check quantities and scales'],
          ['永远可以', 'Always'],
        ],
        0,
        '单位与图例决定箭头的含义。',
        'Units and legends determine the arrows’ meanings.',
      ],
    ],
    exit: [
      '同一比例下，两支速度箭头大小方向相同但绘图位置不同，表示的速度？',
      'At one scale, velocity arrows have equal lengths and directions but different drawing positions. Their represented velocities?',
      [
        ['相同', 'Equal'],
        ['一定不同', 'Necessarily different'],
      ],
      0,
      '此处比较的是均匀速度的表示，大小方向都相同。',
      'These uniform-velocity representations have identical magnitudes and directions.',
    ],
  }),
  make({
    id: 'vectors-a-boat-two-velocities',
    kind: 'vectors-addition',
    minutes: 22,
    title: [
      '船头向东，为什么小船却漂向东北？',
      'The bow points east. Why does the boat travel northeast?',
    ],
    subtitle: [
      '先说明相对谁运动，再把同种向量首尾相接。',
      'Name the reference frame, then connect like vectors head to tail.',
    ],
    hook: [
      '小船相对水以3 m/s向东航行，水相对岸以4 m/s向北流动。岸上的朋友看到小船走一条斜线。能把3与4直接加成7 m/s吗？',
      'A boat travels east at 3 m/s relative to water; water flows north at 4 m/s relative to the bank. A friend on the bank sees a diagonal trip. Can you simply add 3 and 4 to get 7 m/s?',
    ],
    prediction: [
      '两个速度互相垂直时，船相对岸的速率？',
      'When the two velocities are perpendicular, what is the boat’s ground speed?',
    ],
    predictions: [
      ['7 m/s', '7 m/s'],
      ['1 m/s', '1 m/s'],
      ['5 m/s', '5 m/s'],
    ],
    explore: [
      '完整比较北流4 m/s、西流4 m/s、西流3 m/s。小船相对水始终向东3 m/s；动画跟踪4 s内的岸上位置。蓝、浅绿两支速度箭头首尾相接，金箭头给合速度。自由转动水流方向，核对岸上轨迹。',
      'Compare 4 m/s north current, 4 m/s west current, and 3 m/s west current. Boat velocity through water stays 3 m/s east. Follow its bank-relative position for 4 s. Blue and teal velocity arrows connect head to tail; gold gives the resultant. Rotate the current direction freely and compare the ground trajectory.',
    ],
    concept: [
      '这里使用同一水平面和固定岸边坐标。小船相对岸的速度等于小船相对水的速度加上水相对岸的速度。把第二支表示箭头的箭尾接到第一支箭头端，初箭尾到末箭头端就是合向量。向量可按分量相加；大小不能忽略方向直接相加。零合速度表示相对岸静止，不表示船相对水停止。',
      'Use one horizontal plane and fixed bank axes. Boat velocity relative to the bank is boat relative to water plus water relative to bank. Place the second representation’s tail at the first head; the first tail to final head gives the resultant. Add components; do not add magnitudes while ignoring directions. Zero ground velocity means stationary relative to the bank, not stopped relative to water.',
    ],
    formula: [
      'v船/岸 = v船/水 + v水/岸；vx合 = vx1 + vx2；vy合 = vy1 + vy2',
      'v_boat/bank = v_boat/water + v_water/bank; resultant vx = vx1 + vx2; resultant vy = vy1 + vy2',
    ],
    example: [
      '北流4：合速度(3,4) m/s，速率5 m/s；4 s后到(12,16) m。西流4：合速度(−1,0)，4 s漂到(−4,0) m。西流3：两支大小相等方向相反，合速度零，船保持在同一岸上位置。',
      'North current 4: ground velocity (3,4) m/s, speed 5 m/s; after 4 s position is (12,16) m. West current 4: velocity (−1,0), drifting to (−4,0) m after 4 s. West current 3: equal opposite velocities cancel; the boat remains at the same bank-relative position.',
    ],
    misconception: [
      '合速度不是多出的一次推动，也不是船头必然转向合速度方向。船头与相对水速度由控制保持向东。不能把水的速度与船的力相加；向量相加需要相容的量和参考关系。',
      'The resultant is not an extra push, and the bow need not turn toward it. Control keeps the bow and through-water velocity eastward. Do not add water velocity to boat force; vector addition needs compatible quantities and reference relationships.',
    ],
    realWorld: [
      '游泳、划船和飞机受风影响，都需要区分相对介质与相对地面的运动。本模型用于理解速度合成，水流均匀、不含真实转向和操纵过程。',
      'Swimming, rowing and aircraft in wind require distinguishing motion relative to the medium from motion relative to ground. This model teaches velocity composition with uniform current; real steering and manoeuvres are omitted.',
    ],
    summary: [
      '首尾接的是表示，合向量保留大小与方向；参考对象必须写清楚。',
      'Connect representations head to tail; the resultant retains magnitude and direction. State every reference frame.',
    ],
    homeExperiment: [
      '在纸上用1 cm代表1 m/s画向东3格、从它的箭头端向北4格，再连合箭头。把第二支换成向西4格和3格，比较终点，不做实际下水实验。',
      'On paper, use 1 cm for 1 m/s: draw three squares east and then four north from its head. Connect the resultant. Replace the second arrow with four west and three west; compare endpoints. No on-water experiment is needed.',
    ],
    vocabulary: [
      ['合向量', 'resultant vector'],
      ['首尾相接', 'head-to-tail addition'],
      ['参考对象', 'reference frame'],
      ['相对速度', 'relative velocity'],
    ],
    questions: [
      [
        '相对水(3,0)、水相对岸(0,4)，船相对岸速度？',
        'Boat/water (3,0), water/bank (0,4). Boat/bank velocity?',
        [
          ['(7,0) m/s', '(7,0) m/s'],
          ['(3,4) m/s', '(3,4) m/s'],
          ['(0,7) m/s', '(0,7) m/s'],
        ],
        1,
        '每个轴分别相加，大小为5 m/s。',
        'Add each axis separately; resultant magnitude is 5 m/s.',
      ],
      [
        '西流4 m/s时，向东3 m/s的小船在岸上看来？',
        'With 4 m/s west current, a boat travelling 3 m/s east through water appears from the bank to move?',
        [
          ['向西1 m/s', 'West at 1 m/s'],
          ['向东7 m/s', 'East at 7 m/s'],
          ['静止', 'Stationary'],
        ],
        0,
        '3+(−4)=−1，负号在本坐标表示西。',
        '3+(−4)=−1; negative x means west here.',
      ],
      [
        '岸上位置不变，证明船相对水停止了吗？',
        'A fixed bank-relative position proves the boat stopped relative to water?',
        [
          ['证明了', 'Yes'],
          [
            '没有，水流与航行速度可相互抵消',
            'No; current and through-water velocity can cancel',
          ],
        ],
        1,
        '静止的判断取决于参考对象。',
        'Whether motion is stationary depends on the reference frame.',
      ],
    ],
    exit: [
      '怎样求两支不同方向的速度的合速率？',
      'How do you find resultant speed for differently directed velocities?',
      [
        [
          '先相加向量或分量，再求合向量大小',
          'Add vectors or components first, then find the resultant magnitude',
        ],
        ['直接相加两个大小', 'Directly add the two magnitudes'],
      ],
      0,
      '方向决定合向量，不能省略。',
      'Directions determine the resultant and cannot be omitted.',
    ],
  }),
  make({
    id: 'vectors-one-rope-two-components',
    kind: 'vectors-components',
    minutes: 23,
    title: [
      '一根斜绳的拉力，怎么同时向右又向上？',
      'One slanted rope. How can its force act rightward and upward?',
    ],
    subtitle: [
      '分量是同一个力的两份描述，从直角三角形读sin与cos。',
      'Components describe one force; read sine and cosine from a right triangle.',
    ],
    hook: [
      '你用10 N的斜绳拉小车。绳子越竖直，水平拉力却越小。10 N没有消失，它怎样分到两个方向？',
      'You pull a cart with a slanted 10 N rope. As the rope becomes more upright, the horizontal pull gets smaller. The 10 N has not vanished; how is it described along two directions?',
    ],
    prediction: [
      '10 N的绳子完全竖直时，水平分量是多少？',
      'For a completely vertical 10 N rope, what is the horizontal component?',
    ],
    predictions: [
      ['10 N', '10 N'],
      ['0 N', '0 N'],
      ['20 N', '20 N'],
    ],
    explore: [
      '完整比较相对水平0°、约36.87°、90°的10 N绳力。蓝箭头是完整绳力，虚线直角边是分量；先描出水平边、再描竖直边，核对闭合三角形。自由改角度，观察cos与sin比例。',
      'Compare 10 N rope forces at 0°, about 36.87°, and 90° from horizontal. Blue is the complete force; dashed perpendicular sides are components. Inspect the horizontal side then the vertical side and check triangle closure. Vary angle freely and watch cosine and sine ratios.',
    ],
    concept: [
      '约定+x向右、+y向上，θ从水平+x量起。直角三角形中，cosθ=邻边/斜边，sinθ=对边/斜边，所以Fx=Fcosθ、Fy=Fsinθ。分量不是另外两根绳子或额外的力，而是同一个力的等效坐标描述。完整箭头和两分量相加代表同一信息，不能在合力账中重复算三份。',
      'Choose +x right, +y up, and θ measured from horizontal +x. In the right triangle, cosθ=adjacent/hypotenuse and sinθ=opposite/hypotenuse, so Fx=Fcosθ and Fy=Fsinθ. Components are not two extra ropes or added forces; they describe the same force in coordinates. The full arrow and the sum of components encode the same information; counting all three double-counts the force.',
    ],
    formula: [
      'Fx = F cosθ；Fy = F sinθ；F = √(Fx² + Fy²)；θ从水平+x量',
      'Fx = F cosθ; Fy = F sinθ; F = √(Fx² + Fy²); θ measured from horizontal +x',
    ],
    example: [
      'θ≈36.87°时是3–4–5比例：cosθ=4/5=0.8，sinθ=3/5=0.6。F=10 N，所以Fx=8 N、Fy=6 N，√(64+36)=10 N。分量大小8+6=14并不是完整力的大小。90°时Fx=0、Fy=10 N。',
      'At θ≈36.87°, the 3–4–5 ratios give cosθ=4/5=0.8 and sinθ=3/5=0.6. With F=10 N, Fx=8 N and Fy=6 N; √(64+36)=10 N. Adding component magnitudes to get 14 does not give the original force magnitude. At 90°, Fx=0 and Fy=10 N.',
    ],
    misconception: [
      '若角度从竖直量，邻边和对边的位置会换，不能死记“x永远cos”。本图小车保持接触水平面，重量20 N，支持力为20−Fy；竖直合力为零，不是把Fy删掉。水平无摩擦，图只检查力，不播放实际加速。',
      'If the angle is measured from vertical, adjacent and opposite sides swap; “x always gets cosine” is not a universal rule. The cart stays on a horizontal surface with weight 20 N and normal force 20−Fy. Net vertical force is zero; Fy is not deleted. Horizontal friction is omitted and this diagram inspects forces, not actual acceleration.',
    ],
    realWorld: [
      '斜拉箱子、风的东西/南北分量、斜坡上的重力都能用分量描述。先画轴和标清角度的起边，再决定哪个分量用sin或cos。',
      'Pulling a case, east/north wind components and gravity on a slope can be described with components. Draw the axes and label the angle’s reference side before choosing sine or cosine.',
    ],
    summary: [
      '先定轴与角度，再分解；两个分量一起还原同一个向量。',
      'Define axes and angle first, then resolve; both components reconstruct one vector.',
    ],
    homeExperiment: [
      '在纸上画边长8、6、10格的直角三角形，把10格边标成10 N拉力，水平/竖直标8/6 N。写出两个比值，再画0°和90°边界来检查公式。',
      'Draw an 8–6–10 right triangle on paper. Label the hypotenuse 10 N and horizontal/vertical sides 8/6 N. Write both ratios, then draw the 0° and 90° limits to check the formulas.',
    ],
    vocabulary: [
      ['分量', 'component'],
      ['邻边', 'adjacent side'],
      ['对边', 'opposite side'],
      ['斜边', 'hypotenuse'],
    ],
    questions: [
      [
        'θ从水平量、F=10 N、cosθ=0.8，Fx？',
        'θ from horizontal, F=10 N, cosθ=0.8. Fx?',
        [
          ['6 N', '6 N'],
          ['8 N', '8 N'],
          ['10 N', '10 N'],
        ],
        1,
        '水平边是该角的邻边，Fx=10×0.8=8 N。',
        'Horizontal is adjacent to this angle; Fx=10×0.8=8 N.',
      ],
      [
        'Fx=8 N、Fy=6 N时，F大小？',
        'For Fx=8 N and Fy=6 N, magnitude F?',
        [
          ['10 N', '10 N'],
          ['14 N', '14 N'],
          ['2 N', '2 N'],
        ],
        0,
        '垂直分量用勾股关系还原：√(8²+6²)=10 N。',
        'Reconstruct perpendicular components using Pythagoras: √(8²+6²)=10 N.',
      ],
      [
        '算合力时同时加F、Fx和Fy，正确吗？',
        'Is it correct to add F, Fx and Fy together in a net-force sum?',
        [
          ['正确，三个不同的力', 'Yes; they are three different forces'],
          ['不正确，分量已表示完整F', 'No; the components already represent F'],
        ],
        1,
        '完整力和它的分量是同一份物理信息，不能重复计入。',
        'The force and its components encode the same physical information and must not be counted twice.',
      ],
    ],
    exit: [
      '题目改为从竖直量角，你的第一步？',
      'A problem measures the angle from vertical instead. Your first step?',
      [
        [
          '重画轴与三角形，识别邻边和对边',
          'Redraw axes and triangle; identify adjacent and opposite sides',
        ],
        ['照搬原来Fx=Fcosθ不检查', 'Reuse Fx=Fcosθ without checking'],
      ],
      0,
      'sin/cos对应哪边取决于角度定义。',
      'Which component uses sine or cosine depends on the angle definition.',
    ],
  }),
];
