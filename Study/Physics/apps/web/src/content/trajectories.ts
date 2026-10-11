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
  stage: 5,
  unit: 'kinematics',
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
export const trajectoryLessons: Lesson[] = [
  make({
    id: 'trajectory-read-the-slope',
    kind: 'trajectory-position',
    minutes: 20,
    title: [
      '小车在曲线最高处，为什么反而不动？',
      'Why is the cart motionless at the highest point of its curve?',
    ],
    subtitle: [
      '用位置图的斜率读速度，分开割线平均与切线瞬时。',
      'Read velocity from a position graph, separating secant averages from tangent instants.',
    ],
    hook: [
      '摄像机小车的定位图是一座小山。朋友指着山顶说“这里跑得最快！”可是小车正好停一瞬再返回。图上高，是位置大；图上陡，才表示位置改变得快。试着把曲线和车轮对上。',
      'A camera cart’s position graph looks like a hill. A friend points at its summit: “Fastest here!” Yet the cart pauses for an instant before returning. Height means position; steepness means how rapidly position changes. Match the curve to the wheels.',
    ],
    prediction: [
      '位置图最高点的切线水平，小车此刻的速度怎样？',
      'The tangent at the highest point is horizontal. What is the cart’s velocity at that instant?',
    ],
    predictions: [
      [
        '位置最大，所以速度最大',
        'Largest position, therefore largest velocity',
      ],
      ['速度为0，但加速度未必0', 'Velocity is zero; acceleration need not be'],
      ['一定停留4秒', 'It must wait for four seconds'],
    ],
    explore: [
      '比较0→4、2→6、4→8 s，金线追踪选定运动，蓝色割线连接区间两端，金色短切线表示当前速度。拖动检查进度，先看到切线变平，再变成向下倾斜；轨道不是山坡，而是水平直轨。',
      'Compare 0→4, 2→6 and 4→8 s. Gold traces the selected motion; a blue secant joins its endpoints, and a short gold tangent represents current velocity. Seek through the turn: the tangent flattens and then slopes downward. The physical track is horizontal, not a hill.',
    ],
    concept: [
      'x–t图的横轴是时间，纵轴是位置。两端割线斜率Δx/Δt给区间平均速度；一个时刻的切线斜率给瞬时速度。向上倾斜为正速度，向下为负；越陡表示速率越大。曲线最高点切线水平，只说明那一瞬v=0，不说明a=0。曲线的弯曲描述速度变化，不能把图形当空间轨迹。',
      'An x–t graph uses time horizontally and position vertically. Secant slope Δx/Δt gives interval mean velocity; tangent slope at an instant gives instantaneous velocity. Upward slope means positive velocity, downward negative; steeper means greater speed. A horizontal tangent at the peak means v=0 at that instant, not a=0. Curvature describes velocity change; the graph is not a path through space.',
    ],
    formula: [
      '割线：平均v=Δx/Δt；切线：瞬时v；本车x=3+4t−½t²、v=4−t（SI）',
      'Secant: mean v=Δx/Δt; tangent: instantaneous v; here x=3+4t−½t², v=4−t (SI)',
    ],
    example: [
      '0→4 s：x从3变11 m，割线斜率(11−3)/4=2 m/s；末端切线斜率0。2→6 s两端都9 m，割线0，但车先向右再向左，6 s速度−2 m/s。4→8 s割线−2 m/s，末端速度−4 m/s。区间平均不等于每一瞬间。',
      'Over 0→4 s, x goes from 3 to 11 m: secant slope (11−3)/4=2 m/s; endpoint tangent slope is zero. Over 2→6 s both endpoints are 9 m: secant slope zero, but the cart goes right then left and ends at −2 m/s. Over 4→8 s the secant is −2 m/s and endpoint velocity −4 m/s. An interval average is not every instant’s velocity.',
    ],
    misconception: [
      '“位置图画得高，所以跑得快。”先读纵轴量，再读斜率；山顶只是位置最大。水平的一段表示停留，单个水平切线只表示瞬时静止。',
      '“A high position curve means fast motion.” Read the vertical quantity before slope: the summit is maximum position. A horizontal segment means a waiting interval; one horizontal tangent means an instant of rest.',
    ],
    realWorld: [
      '自动摄像轨道和升降机的定位记录都可以画成位置图。工程师关心靠近端点时斜率怎样变小，才能平滑转向；这里先描述运动，不从图线直接推断电机的力。',
      'Camera tracks and lifts can log position against time. Engineers watch slope decrease near an endpoint to plan a smooth turn. Here we describe the motion without inferring motor forces directly from a curve.',
    ],
    summary: [
      '先看轴，再看斜率：割线读区间，切线读瞬间。高度是位置，斜率才是速度。',
      'Read axes before slopes: secants describe intervals, tangents instants. Height is position; slope is velocity.',
    ],
    homeExperiment: [
      '在纸上列0、2、4、6、8 s的位置3、9、11、9、3 m，画点并平滑连线。圈出最高点，再用两个端点算平均速度；用手指沿水平尺模拟往返，不沿“山形图”爬坡。',
      'On paper plot positions 3, 9, 11, 9 and 3 m at 0, 2, 4, 6 and 8 s. Join smoothly, circle the summit and compute interval means from endpoints. Move a finger along a horizontal ruler to mimic the return trip, rather than climbing the graph’s hill.',
    ],
    vocabulary: [
      ['位置时间图', 'Position–time graph'],
      ['割线', 'Secant'],
      ['切线', 'Tangent'],
      ['瞬时速度', 'Instantaneous velocity'],
    ],
    questions: [
      [
        '0→4 s的位置3→11 m，平均速度？',
        'Positions change 3→11 m over 0→4 s. Mean velocity?',
        [
          ['2 m/s', '2 m/s'],
          ['0 m/s', '0 m/s'],
          ['11 m/s', '11 m/s'],
        ],
        0,
        '用位置差除以时间差，8/4=2。',
        'Divide position change by time change: 8/4=2.',
      ],
      [
        '4 s切线水平，a=−1。正确判断？',
        'At 4 s the tangent is horizontal and a=−1. Which is correct?',
        [
          ['a也必须0', 'a must also be zero'],
          ['v=0，随后开始回程', 'v=0; return motion follows'],
          ['小车在爬山', 'The cart is climbing a hill'],
        ],
        1,
        '瞬时速度0不等于加速度0。',
        'Zero instantaneous velocity does not imply zero acceleration.',
      ],
      [
        '2→6 s割线水平，说明？',
        'A horizontal secant over 2→6 s means what?',
        [
          ['一直没动', 'No motion throughout'],
          ['速率一直0', 'Speed always zero'],
          [
            '区间位移0，仍可运动',
            'Zero interval displacement, with motion still possible',
          ],
        ],
        2,
        '两端相同不取消中途的往返。',
        'Matching endpoints do not erase travel between them.',
      ],
    ],
    exit: [
      '机器人位置图越来越陡，纵轴为x、横轴为t，什么量在变大？',
      'A robot’s x–t curve becomes increasingly steep. Which quantity grows?',
      [
        ['速率，即斜率的绝对值', 'Speed, the magnitude of slope'],
        ['一定是质量', 'Necessarily mass'],
      ],
      0,
      '先确认坐标轴，再把倾斜对应到速度。',
      'Identify axes first, then connect slope to velocity.',
    ],
  }),
  make({
    id: 'trajectory-area-has-a-sign',
    kind: 'trajectory-velocity',
    minutes: 20,
    title: [
      '速度图里，回程的面积为什么要扣掉？',
      'Why subtract the return area under a velocity graph?',
    ],
    subtitle: [
      '让带符号面积给位移，让绝对面积给路程。',
      'Use signed area for displacement and absolute area for distance.',
    ],
    hook: [
      '送货机器人先去教室再回充电点。软件的位移账说0 m，轮子里程账却说16 m。速度图一半在时间轴上方、一半在下方；两本账对同一图的面积有不同记法。',
      'A delivery robot visits a classroom then returns to charge. Its displacement ledger says 0 m, its wheel-distance ledger 16 m. Half its velocity graph is above the time axis, half below: two ledgers account for the same areas differently.',
    ],
    prediction: [
      'v–t图上下各有8 m面积，整趟位移和路程？',
      'A v–t graph has 8 m of area above and 8 m below its axis. Net displacement and distance?',
    ],
    predictions: [
      ['位移16 m，路程0', 'Displacement 16 m, distance 0'],
      ['两者都是0', 'Both zero'],
      ['位移0，路程16 m', 'Displacement 0, distance 16 m'],
    ],
    explore: [
      '完整播放前半、后半和整段8 s。上方金色区域按正数记，下方紫色区域按负数记；两种颜色的几何大小都计入路程。检查进度会移动面积边界，并同时更新车的位置。',
      'Play the first half, second half and whole 8 s. Gold area above counts positively; purple below negatively. Both geometric sizes contribute positively to distance. Seeking moves the area boundary and updates the cart’s position.',
    ],
    concept: [
      'v–t图的高度是带方向速度，斜率是加速度，曲线与时间轴围出的带符号面积是位移。矩形面积vΔt的单位(m/s)×s=m；变化速度可用很多小条累加，本课直线能精确算三角形。回程负面积减去位置增量；路程则累计面积的绝对值。速度图不是位置图。',
      'Height on a v–t graph is signed velocity, slope is acceleration, and signed area between curve and time axis is displacement. A rectangle vΔt has units (m/s)×s=m. Changing velocity can be accumulated with narrow strips; this straight line allows exact triangles. Negative return area subtracts from position change; distance adds magnitudes of all areas. A velocity graph is not a position graph.',
    ],
    formula: [
      '位移s=速度图带符号面积；路程=绝对面积之和；v=4−t（SI）',
      'Displacement s=signed area under v–t; distance=sum of absolute areas; v=4−t (SI)',
    ],
    example: [
      '0→4 s的三角形底4 s、高4 m/s，面积+½×4×4=+8 m。4→8 s面积−8 m。整趟s=8−8=0，路程8+8=16 m。图线斜率始终−1 m/s²，经过v=0时并未改变加速度。',
      'The 0→4 s triangle has base 4 s and height 4 m/s: area +½×4×4=+8 m. The 4→8 s area is −8 m. Whole-trip s=8−8=0; distance=8+8=16 m. Slope remains −1 m/s² even as velocity passes through zero.',
    ],
    misconception: [
      '“负面积是不真实的路程。”负号只标位移方向，几何面积仍有大小；负速度也不是负速率。一定先检查纵轴写v还是速率。',
      '“Negative area is unreal travel.” Its sign indicates displacement direction while geometric area still has a magnitude. Negative velocity is not negative speed. Check whether the vertical axis is velocity or speed.',
    ],
    realWorld: [
      '机器人返回起点，定位变化抵消了，但轮胎磨损和电量消耗不会因回程自动抵消。两类数据帮助你分别回答“现在离起点多远”和“总共走了多远”。',
      'Returning to the start cancels a robot’s coordinate change, but wheel wear and energy use do not automatically cancel. Separate ledgers answer “How far from the start?” and “How much travel in total?”',
    ],
    summary: [
      '速度图面积要带符号算位移；把每块大小相加才算路程。斜率仍是加速度。',
      'Signed velocity-graph area gives displacement; adding each area’s magnitude gives distance. Slope still gives acceleration.',
    ],
    homeExperiment: [
      '在方格纸画v=4−t的0–8 s图，剪影般给上下两块着不同颜色，分别写+8和−8 m。把有符号和绝对值两种总和写在旁边，再用箭头画真实的水平往返。',
      'Draw v=4−t over 0–8 s on squared paper, colouring the two triangular regions differently. Label +8 and −8 m, calculate signed and absolute sums, then draw arrows for the actual horizontal return trip.',
    ],
    vocabulary: [
      ['速度时间图', 'Velocity–time graph'],
      ['带符号面积', 'Signed area'],
      ['绝对面积', 'Absolute area'],
      ['位移账', 'Displacement ledger'],
    ],
    questions: [
      [
        '前半三角形4 s×4 m/s，位移？',
        'First-half triangle: base 4 s, height 4 m/s. Displacement?',
        [
          ['16 m', '16 m'],
          ['8 m', '8 m'],
          ['4 m', '4 m'],
        ],
        1,
        '三角形面积需要乘½。',
        'A triangle needs the factor ½.',
      ],
      [
        '回程速度在轴下方，位移如何记？',
        'Return velocity is below the axis. How is displacement recorded?',
        [
          ['负号，表示反方向', 'Negative, indicating opposite direction'],
          ['负路程', 'Negative distance'],
          ['全部忽略', 'Ignore it entirely'],
        ],
        0,
        '位移有方向，路程非负。',
        'Displacement is signed; distance is nonnegative.',
      ],
      [
        '水平v–t线在+3 m/s处，说明？',
        'A horizontal v–t line at +3 m/s means what?',
        [
          ['停着', 'At rest'],
          ['a=3 m/s²', 'a=3 m/s²'],
          ['匀速向正方向，a=0', 'Constant positive velocity, a=0'],
        ],
        2,
        '高度是v，斜率才是a。',
        'Height is v; slope is a.',
      ],
    ],
    exit: [
      '配送车的速度图正面积12 m、负面积−5 m，位移与路程？',
      'A delivery cart has velocity areas +12 and −5 m. Displacement and distance?',
      [
        ['7 m和17 m', '7 m and 17 m'],
        ['17 m和7 m', '17 m and 7 m'],
      ],
      0,
      '位移12−5，路程12+5。',
      'Displacement is 12−5; distance is 12+5.',
    ],
  }),
  make({
    id: 'trajectory-acceleration-adds-velocity',
    kind: 'trajectory-acceleration',
    minutes: 20,
    title: [
      '加速度图变成零，小车为什么还在走？',
      'Why does the cart keep moving when its acceleration graph becomes zero?',
    ],
    subtitle: [
      '把加速度图面积接到速度账，保留初速度。',
      'Add acceleration-graph area to the velocity ledger, keeping initial velocity.',
    ],
    hook: [
      '小车的控制程序写着：前2秒a=+1，接着2秒a=0，最后2秒a=−1。朋友以为中间停了。其实小车以1 m/s出发；加速度为零时，已经积累的速度还在。',
      'A cart’s program says +1 acceleration for two seconds, then zero for two, then −1 for two. A friend expects a stop in the middle. But the cart starts at 1 m/s: zero acceleration preserves the velocity already gained.',
    ],
    prediction: [
      '2 s时速度3 m/s，之后2 s加速度0，4 s速度？',
      'Velocity at 2 s is 3 m/s, with zero acceleration for the next two seconds. Velocity at 4 s?',
    ],
    predictions: [
      ['0 m/s', '0 m/s'],
      ['3 m/s', '3 m/s'],
      ['6 m/s', '6 m/s'],
    ],
    explore: [
      '完整比较三个2秒区间。加速度图高低决定每秒改变多少速度；金色或紫色面积累计Δv，仪表把它加回区间初速度。中间区间面积0，但轨道上小车继续向右。',
      'Compare the three two-second intervals fully. Acceleration-graph height sets velocity change per second; gold or purple area accumulates Δv, which the readout adds to interval initial velocity. Middle area is zero while the cart continues right.',
    ],
    concept: [
      'a–t图面积的单位(m/s²)×s=m/s，因此得到速度变化Δv，不是位移，也不是完整末速度。v末=v初+Δv。正面积增加带方向速度，负面积减少它；a=0保持速度。此教学程序在2、4 s突然切换加速度，速度和位置仍连续；真实电机通常平滑过渡。边界读数采用下一段设置，前一区间面积不因此改变。',
      'Area under a–t has units (m/s²)×s=m/s: it gives velocity change Δv, not displacement or full final velocity. Final v=initial v+Δv. Positive area increases signed velocity; negative decreases it; zero acceleration preserves velocity. This teaching program switches acceleration abruptly at 2 and 4 s while position and velocity remain continuous. Real motors usually transition smoothly. Boundary readouts use the next stage; the preceding interval area is unchanged.',
    ],
    formula: [
      'Δv=a图带符号面积；v末=v初+Δv；恒定段Δv=aΔt',
      'Δv=signed area under a–t; final v=initial v+Δv; constant segment Δv=aΔt',
    ],
    example: [
      '0→2 s：Δv=1×2=+2 m/s，v从1到3。2→4 s：Δv=0，v仍3。4→6 s：Δv=−2，v从3回到1。整趟Δv=0，末速度等于初速度；车却向右走了4+6+4=14 m。',
      'Over 0→2 s: Δv=1×2=+2 m/s, taking v from 1 to 3. Over 2→4 s: Δv=0, so v stays 3. Over 4→6 s: Δv=−2, taking v from 3 back to 1. Net Δv is zero and final equals initial velocity, but the cart travels right by 4+6+4=14 m.',
    ],
    misconception: [
      '“a图下面的面积就是路程。”单位已告诉你不是米；它改变的是速度。总面积0表示速度回到初值，不表示位置回到起点。',
      '“Area under acceleration is distance.” Units already show it is not metres: it changes velocity. Zero total area returns velocity to its initial value, not position to the start.',
    ],
    realWorld: [
      '电梯平稳运行时可能保持非零速度而加速度接近0。启动和减速阶段改变速度；真正停止需要末速度达到0，不能只说“关闭加速”。',
      'A smoothly cruising lift can have nonzero velocity and near-zero acceleration. Starting and braking change velocity; stopping requires final velocity zero, not merely “turning acceleration off”.',
    ],
    summary: [
      'a图面积改速度，v图面积改位置；两本账都要带上区间初值。',
      'Acceleration area changes velocity; velocity area changes position. Both ledgers need the interval’s initial value.',
    ],
    homeExperiment: [
      '在纸上画三段a图，每段2 s，高度+1、0、−1。用1 m/s作为开账速度，逐段写3、3、1 m/s，再画连续v图。只模拟计算，无需突然加速真实小车。',
      'Draw three two-second acceleration segments at +1, 0 and −1. Open the velocity ledger at 1 m/s, write 3, 3 and 1 after each stage, then draw a continuous v graph. Use paper calculations rather than abruptly accelerating a real cart.',
    ],
    vocabulary: [
      ['加速度时间图', 'Acceleration–time graph'],
      ['速度变化', 'Velocity change'],
      ['初速度', 'Initial velocity'],
      ['分段模型', 'Piecewise model'],
    ],
    questions: [
      [
        'a=−1 m/s²持续2 s，Δv？',
        'a=−1 m/s² for 2 s. Δv?',
        [
          ['−2 m/s', '−2 m/s'],
          ['−2 m', '−2 m'],
          ['+2 m/s', '+2 m/s'],
        ],
        0,
        'a乘时间得到带符号速度变化。',
        'Acceleration times duration gives signed velocity change.',
      ],
      [
        '初速度3，a面积−2，末速度？',
        'Initial velocity 3, acceleration area −2. Final velocity?',
        [
          ['−2 m/s', '−2 m/s'],
          ['1 m/s', '1 m/s'],
          ['5 m/s', '5 m/s'],
        ],
        1,
        'v末=3−2=1，不丢掉初值。',
        'Final v=3−2=1; keep the initial value.',
      ],
      [
        '整趟a面积0，能断定？',
        'Zero whole-trip acceleration area proves what?',
        [
          ['位移0', 'Zero displacement'],
          ['路程0', 'Zero distance'],
          ['末速度等于初速度', 'Final velocity equals initial velocity'],
        ],
        2,
        'a面积只累计Δv。',
        'Acceleration area accumulates only Δv.',
      ],
    ],
    exit: [
      '升降机以2 m/s向上匀速，a–t图贴着0轴，它停着吗？',
      'A lift cruises upward at 2 m/s with its a–t graph on zero. Is it at rest?',
      [
        ['没有，速度保持2 m/s', 'No; velocity stays 2 m/s'],
        ['是，a=0就是停', 'Yes; a=0 means stopped'],
      ],
      0,
      '速度与速度变化是不同量。',
      'Velocity differs from its rate of change.',
    ],
  }),
  make({
    id: 'trajectory-equal-time-equal-change',
    kind: 'trajectory-uniform',
    minutes: 20,
    title: [
      '每秒都在变快，就一定是匀加速吗？',
      'Does speeding up every second guarantee uniform acceleration?',
    ],
    subtitle: [
      '用相等时间的速度增量检验恒定加速度。',
      'Test constant acceleration with velocity gains over equal times.',
    ],
    hook: [
      '两台小车都越来越快。一台每秒多1 m/s，另一台每秒多得越来越多。“都变快”还不够描述它们：你能用每秒的小账找到真正的匀加速吗？',
      'Two carts both speed up. One gains 1 m/s every second; the other gains progressively more. “Both get faster” is incomplete: can one-second ledgers reveal which has uniform acceleration?',
    ],
    prediction: [
      '逐秒Δv=0.25、0.75、1.25、1.75 m/s，能用一个恒定a描述吗？',
      'Per-second gains are 0.25, 0.75, 1.25 and 1.75 m/s. Can one constant a describe them?',
    ],
    predictions: [
      ['能，因为都为正', 'Yes, because all are positive'],
      ['能，因为都在运动', 'Yes, because the cart moves'],
      ['不能，等时增量不同', 'No; equal-time gains differ'],
    ],
    explore: [
      '比较恒定a=1、恒定a=0与a=t/2三种教学程序。播放时观察每到整秒才出现的新读数；同时检查速度线是直线还是弯线。自由缩短区间，不改变程序规则。',
      'Compare constant a=1, constant a=0 and changing a=t/2. During playback, each whole-second checkpoint reveals a new reading. Check whether velocity is a straight or curved line. Freely shorten the interval without changing the program rule.',
    ],
    concept: [
      '一维匀变速运动要求加速度恒定，所以相等时间内带方向速度的增量相同。非零常量a给直线v–t与抛物线x–t；a=0是保持匀速的极限情况，并非真的在“加快”。本课反例a=t/2，速度v=1+t²/4：Δv随时刻增大，不能给整趟套同一个a。只看初末平均a不足以证明中间恒定。',
      'One-dimensional constant-acceleration motion requires equal signed velocity gains over equal times. Nonzero constant a produces straight v–t and parabolic x–t; a=0 is the constant-velocity limiting case, not actual speeding up. Our counterexample uses a=t/2 and v=1+t²/4: gains increase with time, so one constant a cannot describe the whole trip. Endpoint mean acceleration alone does not prove constancy between them.',
    ],
    formula: [
      '恒定a：v=u+at；相等Δt给相等Δv；变a反例：v=1+t²/4（SI）',
      'Constant a: v=u+at; equal Δt gives equal Δv; varying-a counterexample: v=1+t²/4 (SI)',
    ],
    example: [
      'u=1、a=1时，0–4 s的v为1、2、3、4、5 m/s，每秒增量1。变a反例的v为1、1.25、2、3.25、5，同样初末速度，却走9.3333 m，恒定a小车走12 m。初末相同并不决定全部过程。',
      'For u=1 and a=1, velocities at 0–4 s are 1, 2, 3, 4 and 5 m/s, gaining 1 each second. The varying-a case gives 1, 1.25, 2, 3.25 and 5: same endpoint velocities, but 9.3333 m travelled versus 12 m for constant a. Matching endpoints do not determine the whole process.',
    ],
    misconception: [
      '“初末平均加速度1，就证明一直a=1。”反例初末也给(5−1)/4=1，但中途a从0变2。要用中间读数检验模型。',
      '“Mean endpoint acceleration 1 proves a=1 throughout.” The counterexample also gives (5−1)/4=1, while a rises from 0 to 2. Intermediate readings test the model.',
    ],
    realWorld: [
      '真实车辆起步常有变化的加速度，乘客舒适性也与变化过程有关。匀加速是有条件的短时近似；数据不支持时，应换模型，而不是强迫每一辆车符合公式。',
      'Real vehicles often change acceleration during starts, and comfort depends on that process. Constant acceleration is a conditional short-time approximation. When data disagree, change the model instead of forcing every vehicle into one formula.',
    ],
    summary: [
      '匀加速的证据是等时、等Δv；同样初末速度不能替代中间证据。',
      'Evidence for constant acceleration is equal Δv over equal times; matching endpoints cannot replace intermediate evidence.',
    ],
    homeExperiment: [
      '把三种程序的逐秒速度写成表，先算每个相邻差，再比较。用两种颜色画相同起终速度的直线与曲线，解释为何面积、位移不同。',
      'Tabulate each program’s velocities, calculate consecutive differences and compare them. Use two colours for a straight and curved velocity line sharing endpoints; explain why their areas and displacements differ.',
    ],
    vocabulary: [
      ['匀变速运动', 'Constant-acceleration motion'],
      ['等时间隔', 'Equal time intervals'],
      ['速度增量', 'Velocity increment'],
      ['模型检验', 'Model test'],
    ],
    questions: [
      [
        '速度1、2、3、4，每秒一次，a？',
        'Velocities 1, 2, 3, 4, one second apart. a?',
        [
          ['0 m/s²', '0 m/s²'],
          ['1 m/s²', '1 m/s²'],
          ['4 m/s²', '4 m/s²'],
        ],
        1,
        '每秒增加1 m/s。',
        'Velocity increases by 1 m/s each second.',
      ],
      [
        '初末相同，两条v图中间不同，位移？',
        'Same endpoint velocities, different intermediate v curves. Displacements?',
        [
          ['一定相同', 'Necessarily equal'],
          ['必为0', 'Must be zero'],
          ['不一定，面积可不同', 'May differ because areas differ'],
        ],
        2,
        '位移取决于整个v图面积。',
        'Displacement depends on the full velocity-graph area.',
      ],
      [
        '怎样检验恒定a？',
        'How should you test constant a?',
        [
          [
            '比较等时的带方向速度增量',
            'Compare signed velocity gains over equal times',
          ],
          ['只看末速度', 'Look only at final velocity'],
          ['只看运动很顺', 'Look only for smooth-looking motion'],
        ],
        0,
        '中间读数是模型的证据。',
        'Intermediate readings provide model evidence.',
      ],
    ],
    exit: [
      '四个等时区间Δv分别1、1、2、3，可以全程套恒定a公式吗？',
      'Four equal-time gains are 1, 1, 2 and 3. Can constant-a equations describe the whole journey?',
      [
        ['不能，先分段或改模型', 'No; segment the motion or change model'],
        ['能，只取平均a就完全正确', 'Yes; mean a is exact throughout'],
      ],
      0,
      '平均变化率不能替代恒定条件。',
      'A mean rate cannot replace the constancy condition.',
    ],
  }),
  make({
    id: 'trajectory-choose-the-missing-quantity',
    kind: 'trajectory-equations',
    minutes: 22,
    title: [
      '三个运动公式，怎样挑一个有用的？',
      'How do you choose one useful motion equation from three?',
    ],
    subtitle: [
      '先列已知与未知，从图形推导SUVAT，再计算核对。',
      'List knowns and unknowns, derive SUVAT from graphs, then calculate and check.',
    ],
    hook: [
      '摄影小车要在4秒里平稳改变速度。桌上有三张公式卡，哪张直接回答你的问题？先看看条件是否允许恒定a，再找缺少的量；公式是节省推理的工具，不是抽签。',
      'A camera cart must change velocity smoothly over four seconds. Three equation cards lie on the desk. Which answers your question directly? First verify constant a, then identify the missing quantity: equations save reasoning, rather than being picked at random.',
    ],
    prediction: [
      '已知u、v、a，没给t，要找s，哪条最直接？',
      'Given u, v and a, without t, which equation finds s most directly?',
    ],
    predictions: [
      ['v=u+at', 'v=u+at'],
      ['s=ut+½at²', 's=ut+½at²'],
      ['v²=u²+2as', 'v²=u²+2as'],
    ],
    explore: [
      '三个工作单分别找v、找s、在没有t时找s。选择只含所需量的直接公式，填入计算结果并核对，然后完整播放作图检验。答错会解释条件与单位；正确数字仍需三次完整观察才能完成。',
      'Three worksheets ask for v, s, and s without a given t. Select the direct equation containing the needed quantities, enter your result and check, then play fully to verify graphically. Wrong entries prompt checks of conditions and units; correct calculations still require three full observations.',
    ],
    concept: [
      'SUVAT把s位移、u初速度、v末速度、a恒定加速度、t时间联系起来。v=u+at来自v图斜率；s=ut+½at²来自矩形ut加三角形½(at)t；s=(u+v)t/2来自梯形面积；用u=v−at代回，也得s=vt−½at²。把t=(v−u)/a消去得到v²=u²+2as（消去过程a≠0，结果也与a=0情况相容）。所有量要采用同一正方向和SI单位；s不是发生转向后的总路程。',
      'SUVAT connects displacement s, initial velocity u, final velocity v, constant acceleration a and time t. v=u+at comes from v-graph slope; s=ut+½at² from a rectangle plus triangle; s=(u+v)t/2 from a trapezium. Substituting u=v−at also gives s=vt−½at². Eliminating t=(v−u)/a yields v²=u²+2as (that elimination uses a≠0; the resulting identity also accommodates a=0). Use one positive direction and SI units. s is not total distance after a turn.',
    ],
    formula: [
      'v=u+at；s=ut+½at²；s=(u+v)t/2；s=vt−½at²；v²=u²+2as（恒定a）',
      'v=u+at; s=ut+½at²; s=(u+v)t/2; s=vt−½at²; v²=u²+2as (constant a)',
    ],
    example: [
      '工作单一：u=2、a=1、t=4，v=2+1×4=6 m/s。二：u=6、a=−1、t=4，s=6×4−½×16=16 m。三：u=2、v=6、a=1，s=(36−4)/2=16 m。前两种末速度不同、位移相同；用图形面积交叉核对。',
      'Worksheet one: u=2, a=1, t=4 gives v=2+1×4=6 m/s. Two: u=6, a=−1, t=4 gives s=6×4−½×16=16 m. Three: u=2, v=6, a=1 gives s=(36−4)/2=16 m. The first two have different final velocities but equal displacement; cross-check with graph area.',
    ],
    misconception: [
      '“平方公式算出v²，开平方一定取正。”平方丢掉方向；要结合运动阶段选择符号。“随便用平均a”也不行，本组要求全区间a恒定。',
      '“The squared equation gives v², so take positive v.” Squaring loses direction; choose a sign using the motion stage. Arbitrary mean acceleration is insufficient: these equations require constant a throughout the interval.',
    ],
    realWorld: [
      '设计相机滑轨的位移与时间，或估算恒定减速度下的停止距离，都先声明简化条件。真实刹车还有反应时间、路面与变加速度，本课公式不自动给出安全驾驶距离。',
      'Planning camera-track travel or estimating stopping distance under constant deceleration starts with model conditions. Real braking also includes reaction time, road conditions and changing acceleration; these equations alone do not define a safe driving distance.',
    ],
    summary: [
      '先检查恒定a，列已知和未知，选直接公式，计算单位，再用图形与方向核对。',
      'Verify constant a, list knowns and unknowns, choose a direct equation, calculate units, then check graphs and direction.',
    ],
    homeExperiment: [
      '做三张公式卡，分别写上包含的变量。用本课三个工作单划掉未知t，尝试从梯形面积推出平均速度公式；每次算完补一个单位和一句合理性检查。',
      'Make three equation cards and list their variables. Use the worksheets to avoid an unknown t; derive mean velocity from trapezium area. Add a unit and one reasonableness check to every result.',
    ],
    vocabulary: [
      ['匀变速公式', 'SUVAT equations'],
      ['已知条件', 'Known quantities'],
      ['未知量', 'Unknown quantity'],
      ['消去变量', 'Eliminate a variable'],
    ],
    questions: [
      [
        'u=2、a=1、t=4，v？',
        'u=2, a=1, t=4. v?',
        [
          ['6 m/s', '6 m/s'],
          ['16 m/s', '16 m/s'],
          ['4 m/s', '4 m/s'],
        ],
        0,
        'v=2+1×4=6。',
        'Keep the initial velocity: v=2+1×4=6 m/s.',
      ],
      [
        'u=6、a=−1、t=4，s？',
        'u=6, a=−1, t=4. s?',
        [
          ['24 m', '24 m'],
          ['16 m', '16 m'],
          ['−8 m', '−8 m'],
        ],
        1,
        '保留ut，s=24−8。',
        'Keep ut: s=24−8.',
      ],
      [
        's=ut+½at²的必要条件？',
        'What condition is required for s=ut+½at²?',
        [
          ['速度一直恒定', 'Velocity always constant'],
          ['质量为1 kg', 'Mass is 1 kg'],
          [
            '全区间a恒定，方向约定一致',
            'Constant a throughout; one direction convention',
          ],
        ],
        2,
        '该式来自直线v图面积。',
        'It comes from area under a straight velocity graph.',
      ],
    ],
    exit: [
      '升降机加速度不断改变，能直接用平均a代入SUVAT求准确位移吗？',
      'A lift’s acceleration continually changes. Can mean a inserted in SUVAT give exact displacement?',
      [
        [
          '不能，需过程数据或分段模型',
          'No; use process data or a segmented model',
        ],
        ['能，平均a总是等效', 'Yes; mean a is always equivalent'],
      ],
      0,
      '位移取决于完整速度过程。',
      'Displacement depends on the complete velocity history.',
    ],
  }),
  make({
    id: 'trajectory-falling-with-a-clock',
    kind: 'trajectory-fall',
    minutes: 20,
    title: [
      '自由下落2秒，比1秒只多落一倍吗？',
      'Does two seconds of free fall mean only twice the drop?',
    ],
    subtitle: [
      '从静止释放，用重力匀加速模型预测时间与距离。',
      'Release from rest and predict time and distance with constant gravity.',
    ],
    hook: [
      '慢动作里，球刚松手时下落很慢，后来相同一秒走得更多。把高20 m的虚拟实验台交给时钟：1秒落5 m，2秒就能到地面。质量换五倍会改变这个理想时间吗？',
      'In slow motion, a released ball begins slowly and covers more in each later second. On a virtual 20 m platform, it falls 5 m in one second and reaches the ground in two. Does multiplying mass by five change that ideal time?',
    ],
    prediction: [
      '同处20 m，从静止同时释放0.1与0.5 kg小球，忽略空气，谁先到？',
      'At the same 20 m height, release 0.1 and 0.5 kg balls from rest, ignoring air. Which arrives first?',
    ],
    predictions: [
      ['0.5 kg先到', '0.5 kg first'],
      ['同一时刻到', 'At the same time'],
      ['0.1 kg先到', '0.1 kg first'],
    ],
    explore: [
      '比较同一g=10下两种质量，再保持质量改变为g=1.6。自由调高度5–20 m，查看相等时间的落点越来越疏。所有读数停在接触地面之前的一瞬，模型不模拟碰撞或反弹。',
      'Compare two masses at g=10, then keep mass and use g=1.6. Change height from 5 to 20 m and watch equally timed marks spread farther apart. Readings stop at the instant just before ground contact; collisions and bounces are excluded.',
    ],
    concept: [
      '本课取释放点y=0、向下为正，u=0，理想自由落体只有重力影响且g在这段高度近似恒定。于是v=gt、y=½gt²，落地前时间√(2h/g)、速率√(2gh)。质量不出现在这些运动学结果中。地球近地面课堂近似用g=10 m/s²，较精细计算常取约9.8；g=1.6是月面近似。纸与石头在空气中的差别不能用这套无阻力模型全部解释。',
      'Use release point y=0, downward positive and u=0. Ideal free fall includes gravity alone with approximately constant g over the height. Then v=gt, y=½gt², contact time √(2h/g), and incoming speed √(2gh). Mass does not appear in these kinematic results. We use the near-Earth classroom approximation g=10 m/s²; finer calculations often use about 9.8. g=1.6 approximates lunar surface gravity. Paper-versus-stone differences in air need drag beyond this model.',
    ],
    formula: [
      'u=0、向下为正：v=gt；y=½gt²；t落=√(2h/g)',
      'u=0, downward positive: v=gt; y=½gt²; contact t=√(2h/g)',
    ],
    example: [
      'h=20、g=10：1 s时y=5 m、v=10 m/s；2 s时y=20 m、v=20 m/s，两个1秒区间分别5与15 m。高度只改为5 m时t=1 s：高度四倍，时间两倍。g=1.6、h=20时t=5 s，落地前v=8 m/s。',
      'With h=20 and g=10, at 1 s y=5 m and v=10 m/s; at 2 s y=20 m and v=20 m/s. Consecutive one-second distances are 5 and 15 m. At h=5, contact t=1 s: quadrupling height doubles time. For g=1.6 and h=20, t=5 s and incoming v=8 m/s.',
    ],
    misconception: [
      '“每秒增加10 m/s，所以每秒落10 m。”g控制速度变化，不是每秒固定路程。初速度0也不意味着初始加速度0；落地后受接触力影响，不再继续自由落体公式。',
      '“Gaining 10 m/s each second means dropping 10 m every second.” g controls velocity change, not fixed distance per second. Zero initial velocity does not mean zero initial acceleration. Contact introduces other forces, so free-fall equations do not continue after landing.',
    ],
    realWorld: [
      '慢动作视频可用相等帧间隔检验落点间距是否增大。真实空气阻力、初始推力和比例尺误差会偏离理想图；这里用虚拟高台，不需要从高处投物。',
      'Slow-motion video can compare spacings over equal frame intervals. Drag, an initial push and scale errors can cause departures from the ideal plot. Our high platform is virtual; no objects need to be dropped from a height.',
    ],
    summary: [
      '静止释放且恒定g时，速度随t线性增加，落距随t²增长；同条件质量不改变理想落地时间。',
      'From rest with constant g, velocity grows linearly with t and drop grows with t²; mass does not change ideal contact time under matching conditions.',
    ],
    homeExperiment: [
      '用纸算0、0.5、1、1.5、2 s对应落距0、1.25、5、11.25、20 m，画点看越来越疏。若看已有落球视频，先标明帧间隔与比例尺；不用爬高或制造高空下落实验。',
      'Calculate drops 0, 1.25, 5, 11.25 and 20 m at 0, 0.5, 1, 1.5 and 2 s, then plot the spreading marks. If using an existing drop video, label frame interval and scale; do not climb or arrange a high drop.',
    ],
    vocabulary: [
      ['自由落体', 'Free fall'],
      ['重力加速度', 'Gravitational acceleration'],
      ['从静止释放', 'Release from rest'],
      ['接触前速度', 'Incoming velocity'],
    ],
    questions: [
      [
        'g=10、u=0，1 s落距？',
        'g=10, u=0. Drop in 1 s?',
        [
          ['10 m', '10 m'],
          ['20 m', '20 m'],
          ['5 m', '5 m'],
        ],
        2,
        'y=½×10×1²=5。',
        'y=½×10×1²=5.',
      ],
      [
        'h从5变20 m、g不变，时间变几倍？',
        'Height changes 5→20 m, same g. Time multiplier?',
        [
          ['2倍', '2 times'],
          ['4倍', '4 times'],
          ['不变', 'Unchanged'],
        ],
        0,
        '时间与高度平方根成正比。',
        'Time scales with the square root of height.',
      ],
      [
        '接触地面后，继续用v=gt吗？',
        'After ground contact, keep using v=gt?',
        [
          ['继续，g没变', 'Yes; g is unchanged'],
          ['不能，接触力改变运动', 'No; contact changes the motion'],
          ['质量突然变0', 'Mass suddenly becomes zero'],
        ],
        1,
        '模型只到接触前，之后要换条件。',
        'This model ends just before contact; conditions then change.',
      ],
    ],
    exit: [
      '两颗同高静止释放小球在真空中，质量不同；比较落地时间先检查什么？',
      'Two balls with different masses are released from rest in vacuum. What should you check when comparing arrival times?',
      [
        [
          '释放时刻、高度、初速度和g是否相同',
          'Matching release time, height, initial velocity and g',
        ],
        ['只看哪个更重', 'Only which is heavier'],
      ],
      0,
      '匹配条件后，理想时间不由质量决定。',
      'With conditions matched, ideal time does not depend on mass.',
    ],
  }),
  make({
    id: 'trajectory-two-directions-one-clock',
    kind: 'trajectory-projectile',
    minutes: 22,
    title: [
      '球向前飞得更快，为什么不多待在空中？',
      'Why doesn’t faster horizontal flight keep a ball airborne longer?',
    ],
    subtitle: [
      '同一时钟连接水平匀速与竖直自由落体。',
      'Use one clock for horizontal constant velocity and vertical free fall.',
    ],
    hook: [
      '虚拟台边，一颗球直接松手，另一颗水平发射。飞得更远的球会不会晚落地？把两颗球放在同一个时钟里，你会看见它们一直在同一高度，直到一起到地面。',
      'At a virtual platform edge, one ball is released and another launched horizontally. Does the farther-travelling ball land later? Put both on one clock: they remain at matching heights until reaching the ground together.',
    ],
    prediction: [
      '同高、同刻、初始竖直速度0，忽略空气，水平速度0与8 m/s的球怎样落地？',
      'Same height and release time, zero initial vertical velocity, no air. How do balls with horizontal speeds 0 and 8 m/s land?',
    ],
    predictions: [
      [
        '同一时刻，水平落点不同',
        'Same time, different horizontal landing positions',
      ],
      ['8 m/s的晚落', '8 m/s lands later'],
      ['0 m/s的不受重力', '0 m/s feels no gravity'],
    ],
    explore: [
      '完整比较水平初速度0、4、8 m/s，白色空心球始终是直接释放的参照。每次从20 m处出发，y向下为正，两个方向共用t；自由调水平速度，检查两球同高而落点不同。',
      'Compare horizontal launch velocities 0, 4 and 8 m/s. The white outlined ball is always a directly released reference. Start at height 20 m, with y downward positive and a shared t for both directions. Change horizontal velocity to see equal heights but different landing positions.',
    ],
    concept: [
      '忽略空气、近地面恒定g、水平发射且uᵧ=0：水平aₓ=0，所以x=uₓt；竖直aᵧ=g，所以y=½gt²、vᵧ=gt。两方向方程分开，时间相同；落地时间由h与竖直初始条件决定，射程R=uₓ√(2h/g)。横向速度不提供向上的“支撑”。斜向抛射有非零uᵧ，飞行时间会不同；本课只做水平发射。',
      'With no air, constant near-surface g, horizontal launch and uᵧ=0: horizontal aₓ=0, giving x=uₓt; vertical aᵧ=g, giving y=½gt² and vᵧ=gt. Solve directions separately with a shared time. Contact time depends on height and vertical initial conditions; range R=uₓ√(2h/g). Horizontal velocity supplies no upward support. Oblique launch has nonzero uᵧ and can change flight time; this lesson treats horizontal launches only.',
    ],
    formula: [
      'x=uₓt；y=½gt²；t落=√(2h/g)；R=uₓt落（水平发射）',
      'x=uₓt; y=½gt²; contact t=√(2h/g); R=uₓ×contact t (horizontal launch)',
    ],
    example: [
      'h=20、g=10，三种水平速度都在2 s前一瞬到地面。uₓ=0、4、8给射程0、8、16 m；1 s时高度都离地15 m，水平位置分别0、4、8 m。8 m/s那颗落地前vₓ=8、vᵧ=20 m/s，合速率√(8²+20²)≈21.54 m/s。',
      'With h=20 and g=10, all three reach the ground at 2 s. uₓ=0, 4 and 8 gives ranges 0, 8 and 16 m. At 1 s all are 15 m above ground while x=0, 4 and 8 m. For the 8 m/s launch, incoming vₓ=8 and vᵧ=20 m/s; total speed √(8²+20²)≈21.54 m/s.',
    ],
    misconception: [
      '“水平越快，重力越难拉下来。”两方向不是争抢同一份速度。理想重力改变竖直分量，水平分量保持；真实球的空气阻力与旋转升力另需模型。',
      '“Faster sideways motion makes gravity struggle to pull down.” Directions do not compete for one share of velocity. Ideal gravity changes the vertical component while the horizontal component stays constant. Real drag and spin-induced lift require additional models.',
    ],
    realWorld: [
      '喷泉出水后的弧线、球离开桌边后的轨迹，都能启发两个方向共用时钟的思考。现实喷流和球有空气影响；先检查水平发射条件，再用理想模型做第一步估算。',
      'A fountain’s arc and a ball leaving a table suggest two directions sharing one clock. Real jets and balls experience air effects. Check the horizontal-launch conditions before using this ideal model as a first estimate.',
    ],
    summary: [
      '水平匀速、竖直匀加速，共用一个t；同样竖直初始条件给同样飞行时间，水平速度决定射程。',
      'Horizontal constant velocity and vertical constant acceleration share one t. Matching vertical initial conditions give matching flight times; horizontal velocity sets range.',
    ],
    homeExperiment: [
      '在纸上画20 m虚拟高台，用0、0.5、1、1.5、2 s生成x=8t、y=5t²的五个点，再在x=0处画同一y的直接下落点。连横线检验同高；不需要真实投掷或高台。',
      'Draw a virtual 20 m platform. Generate five points x=8t, y=5t² at t=0, 0.5, 1, 1.5 and 2 s, then draw directly dropped points at x=0 with the same y. Join matching heights horizontally; no real throwing or high platform is needed.',
    ],
    vocabulary: [
      ['水平抛射', 'Horizontal projectile'],
      ['速度分量', 'Velocity component'],
      ['水平射程', 'Horizontal range'],
      ['共同时间', 'Shared time'],
    ],
    questions: [
      [
        'h=20、g=10、uᵧ=0，飞行时间？',
        'h=20, g=10, uᵧ=0. Flight time?',
        [
          ['4 s', '4 s'],
          ['2 s', '2 s'],
          ['由uₓ单独决定', 'Set by uₓ alone'],
        ],
        1,
        't=√(40/10)=2。',
        't=√(40/10)=2.',
      ],
      [
        'uₓ=8、飞行2 s，射程？',
        'uₓ=8, flight 2 s. Range?',
        [
          ['16 m', '16 m'],
          ['8 m', '8 m'],
          ['20 m', '20 m'],
        ],
        0,
        '水平匀速，R=uₓt。',
        'Horizontal velocity is constant: R=uₓt.',
      ],
      [
        '同高水平发射，横向速度加倍，理想时间？',
        'Double horizontal speed for the same-height horizontal launch. Ideal flight time?',
        [
          ['加倍', 'Doubles'],
          ['减半', 'Halves'],
          ['不变，竖直条件没改', 'Unchanged; vertical conditions match'],
        ],
        2,
        '共用时钟不等于两方向互相改变规则。',
        'Sharing time does not change either direction’s rule.',
      ],
    ],
    exit: [
      '水平射出的球与同高松手球同时开始，想判断能否同刻落地，先检查？',
      'A horizontally launched and directly released ball start together at the same height. What should you check for simultaneous arrival?',
      [
        [
          '竖直初速度、g与空气条件是否匹配',
          'Matching vertical initial velocity, g and air conditions',
        ],
        ['只比较水平飞得远不远', 'Only compare horizontal range'],
      ],
      0,
      '飞行时间由竖直运动决定；条件不可省略。',
      'Flight time follows vertical motion; conditions matter.',
    ],
  }),
];
