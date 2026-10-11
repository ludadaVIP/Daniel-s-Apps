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
  unit: 'newton',
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
export const newtonLessons: Lesson[] = [
  make({
    id: 'newton-motion-needs-no-maintenance',
    kind: 'newton-inertia',
    minutes: 20,
    title: [
      '不再推，小车一定会慢下来吗？',
      'Must a cart slow down when you stop pushing?',
    ],
    subtitle: [
      '在理想轨道上区分保持运动与改变运动。',
      'Separate maintaining motion from changing motion on an ideal track.',
    ],
    hook: [
      '地板上的玩具车松手后会停，朋友说“运动必须一直推”。换到理想光滑轨道，运动的小车却保持原速度。真正需要解释的是地板上什么在改变它，而不是替匀速运动找一股神秘的前推力。',
      'A toy car stops after a push on the floor. A friend says motion needs continuous pushing. On an ideal smooth track, a moving cart keeps its velocity. Explain what changes it on the floor, rather than inventing a mysterious forward force to maintain uniform motion.',
    ],
    prediction: [
      '小车已向右2 m/s，水平合力为0，3秒后怎样？',
      'A cart already moves right at 2 m/s, with zero horizontal net force. After three seconds?',
    ],
    predictions: [
      ['逐渐停下', 'It gradually stops'],
      ['仍向右2 m/s', 'Still rightward at 2 m/s'],
      ['必然更快', 'Necessarily faster'],
    ],
    explore: [
      '比较静止且无水平力、向右且无水平力、向左且受到两股4 N平衡拉力。三种合力都0，速度却由初值决定。自由改变初速度，再观察3秒内相等时间的行程。',
      'Compare rest with no horizontal force, rightward motion with no horizontal force, and leftward motion with two balanced 4 N pulls. Net force is zero in each, but velocity depends on its initial value. Change initial velocity and observe travel over three seconds.',
    ],
    concept: [
      '牛顿第一定律说：在惯性参考系中，物体合外力为0时保持静止或匀速直线运动。静止是v=0的特例；合力0不是所有力都消失。惯性是物体保持原运动状态的性质，不是向前推的额外力。实验轨道固定、忽略水平阻力；竖直重力与支持力平衡。真实地板上摩擦和空气作用改变速度。',
      'Newton’s first law says that in an inertial frame, zero net external force preserves rest or constant straight-line velocity. Rest is the v=0 case; zero net force does not mean every force vanishes. Inertia is a property of retaining motion, not an extra forward force. Our track frame is fixed, horizontal drag omitted, and weight balanced by support. Real floor friction and air effects change velocity.',
    ],
    formula: [
      '合外力0 ⇒ a=0 ⇒ v保持初值；本课x=10+ut（SI）',
      'Zero net external force ⇒ a=0 ⇒ velocity retains its initial value; here x=10+ut (SI)',
    ],
    example: [
      '从x=10 m开始，u=0、+2、−2 m/s，3 s后位置10、16、4 m，速度仍0、+2、−2。向左那辆受到+4与−4 N水平力，合力仍0。不能仅凭“合力0”判断它停在哪或朝哪走。',
      'From x=10 m, initial velocities 0, +2 and −2 m/s give positions 10, 16 and 4 m after 3 s, retaining the same velocities. The leftward cart has +4 and −4 N horizontal forces, still summing to zero. Zero net force alone tells neither location nor motion direction.',
    ],
    misconception: [
      '“惯性是一股前推力。”惯性不画在受力图里；它描述改变运动状态的难易。也别把“合力0”读成“速度0”，两者之间还差初始条件。',
      '“Inertia is a forward push.” Do not draw inertia as a force; it describes resistance to changing motion. Nor does zero net force mean zero velocity: initial conditions still matter.',
    ],
    realWorld: [
      '公交车减速时，乘客原来向前的运动需要被座椅、扶手或安全带改变。不是突然多了一股“惯性力”从背后推人；先在地面惯性系描述实际接触力。',
      'When a bus slows, a passenger’s original forward motion must be changed by seats, handholds or restraints. No new inertia force suddenly pushes from behind; begin with real contact forces in a ground inertial frame.',
    ],
    summary: [
      '力改变速度，匀速运动无需合力维持；先看合力，再看初速度。',
      'Forces change velocity; uniform motion needs no net force to maintain it. Read net force, then initial velocity.',
    ],
    homeExperiment: [
      '在纸上为三辆虚拟车列u、合力、3 s后v和x。画同一条水平轨道，用相等长度的箭头表示每秒位置变化；真实小车停下时，列出可能阻力，不把它当第一定律失效。',
      'On paper list u, net force, final v and x for the three virtual carts. Use equal-length interval arrows on a horizontal track. If a real toy stops, list possible resisting interactions rather than treating this as failure of the first law.',
    ],
    vocabulary: [
      ['惯性', 'Inertia'],
      ['牛顿第一定律', 'Newton’s first law'],
      ['惯性参考系', 'Inertial frame'],
      ['合外力', 'Net external force'],
    ],
    questions: [
      [
        '合力0、初速度+2，末速度？',
        'Zero net force, initial velocity +2. Final velocity?',
        [
          ['0', '0'],
          ['+2 m/s', '+2 m/s'],
          ['越来越大', 'Increasing'],
        ],
        1,
        '加速度0，所以保留初速度。',
        'Acceleration is zero, so initial velocity is retained.',
      ],
      [
        '+4与−4 N作用在同一车上，合力？',
        '+4 and −4 N act on one cart. Net force?',
        [
          ['0 N', '0 N'],
          ['8 N', '8 N'],
          ['−4 N', '−4 N'],
        ],
        0,
        '同一目标上的矢量力相加。',
        'Add vector forces acting on the same target.',
      ],
      [
        '惯性应画成额外力吗？',
        'Should inertia be drawn as an additional force?',
        [
          ['应该，方向向前', 'Yes, forward'],
          ['只在高速时', 'Only at high speed'],
          ['不，它是性质', 'No; it is a property'],
        ],
        2,
        '不能凭运动方向增添一股没有施力者的力。',
        'Do not invent a force without an interacting agent.',
      ],
    ],
    exit: [
      '机器人匀速向左，合力为0，它会自动停下吗？',
      'A robot moves uniformly left with zero net force. Does it stop automatically?',
      [
        ['不会；原速度保持', 'No; its initial velocity persists'],
        ['会；没有向左推力', 'Yes; there is no leftward push'],
      ],
      0,
      '匀速直线运动不需要非零合力维持。',
      'Constant straight-line velocity needs no nonzero net force.',
    ],
  }),
  make({
    id: 'newton-add-forces-on-one-cart',
    kind: 'newton-net',
    minutes: 20,
    title: [
      '两边都在拉，应该把哪个力放进公式？',
      'When both sides pull, which force belongs in the equation?',
    ],
    subtitle: [
      '在同一物体上把带方向的力相加，再连接运动变化。',
      'Add signed forces on one body before predicting its motion change.',
    ],
    hook: [
      '轨道小车左右都绑着绳子。右边拉6 N，左边拉2 N；如果直接拿6 N算加速度，就把另一边忘了。小车只收到一份合计结果，先替它建立完整的力账。',
      'A track cart has a rope on each side. One pulls 6 N right and the other 2 N left. Using 6 N alone for acceleration forgets the other side. The cart responds to their combined result: build a complete force ledger first.',
    ],
    prediction: [
      '右6 N、左2 N，向右为正，合力？',
      'Right 6 N and left 2 N, with right positive. Net force?',
    ],
    predictions: [
      ['+8 N', '+8 N'],
      ['+6 N', '+6 N'],
      ['+4 N', '+4 N'],
    ],
    explore: [
      '保持质量2 kg与初速度+1 m/s，比较4−4、6−2、2−6 N。实线箭头是两股水平作用，虚线合力箭头只是计算结果，不是第三股力。第三种情况先减慢，再反向。',
      'Keep mass 2 kg and initial velocity +1 m/s while comparing 4−4, 6−2 and 2−6 N. Solid arrows show two horizontal interactions; a dashed net arrow is their calculated result, not a third force. The last case slows, then reverses.',
    ],
    concept: [
      '合力是作用在同一目标上的力的矢量和。在一维先约定向右为正：右拉记正、左拉记负。本课竖直支持与重力平衡，水平ΣF决定a。合力方向等于加速度方向，不一定等于当前速度方向；合力向左、车正向右时先变慢，过v=0后可向左变快。',
      'Net force is the vector sum of forces acting on the same target. Choose right positive in one dimension: rightward pulls positive, leftward negative. Vertical support and weight balance here; horizontal ΣF sets a. Net force points with acceleration, not necessarily current velocity. A leftward net force first slows a right-moving cart, then can speed it left after v passes zero.',
    ],
    formula: [
      'ΣFₓ=F右+F左；aₓ=ΣFₓ/m；v=u+at（恒定合力、质量）',
      'ΣFₓ=F_right+F_left; aₓ=ΣFₓ/m; v=u+at (constant net force and mass)',
    ],
    example: [
      '合力0、+4、−4 N对应a=0、+2、−2 m/s²。2 s末速度+1、+5、−3 m/s。第三种在0.5 s转向，位置先增到5.25 m再减到3 m；左合力不是从一开始就向左运动。',
      'Net forces 0, +4 and −4 N give accelerations 0, +2 and −2 m/s². After 2 s, velocities are +1, +5 and −3 m/s. The last turns at 0.5 s: position first rises to 5.25 m, then falls to 3 m. A left net force does not mean leftward motion from the start.',
    ],
    misconception: [
      '“把6和2直接加成8。”方向被丢掉了。也不能把两个实在作用再加上虚线合力，否则重复计算同一件事。',
      '“Add 6 and 2 to get 8.” That loses direction. Nor should the two real interactions be added again to a dashed net force: that double-counts their result.',
    ],
    realWorld: [
      '拔河绳上的某个小结点、两侧拉动的相机车，都需要先选定对象再加力。相互作用力与合力属于不同层次；绳子是否有质量、地面是否有摩擦，都要列在模型条件里。',
      'A tug-of-war rope segment or camera cart pulled from both sides requires a chosen target before force addition. Interaction forces and their resultant play different roles. State whether rope mass and ground friction are included.',
    ],
    summary: [
      '只加同一目标受到的力；合力决定加速度，初速度决定此刻怎样走。',
      'Add only forces on one target. Net force determines acceleration; initial velocity helps determine current motion.',
    ],
    homeExperiment: [
      '用纸箭头做三份左右拉力账，箭头按1 cm代表1 N画。先合成，再写a与2 s末v；用另一种虚线画合力，提醒自己它不是新作用。',
      'Make three force ledgers with paper arrows at 1 cm per newton. Add them first, then calculate a and v after 2 s. Draw the resultant dashed to remind yourself it is not a new interaction.',
    ],
    vocabulary: [
      ['合力', 'Net force'],
      ['矢量和', 'Vector sum'],
      ['方向约定', 'Direction convention'],
      ['反向运动', 'Reversed motion'],
    ],
    questions: [
      [
        '右6、左2 N，ΣF？',
        'Right 6, left 2 N. ΣF?',
        [
          ['+4 N', '+4 N'],
          ['+8 N', '+8 N'],
          ['−4 N', '−4 N'],
        ],
        0,
        '左力记−2，6−2=4。',
        'Leftward is −2, so 6−2=4.',
      ],
      [
        'ΣF向左，v向右，此时速率？',
        'ΣF left, v right. What happens to speed initially?',
        [
          ['增加', 'Increases'],
          ['减小', 'Decreases'],
          ['立刻负速率', 'Immediately negative speed'],
        ],
        1,
        '加速度与速度方向相反，先减速。',
        'Opposite acceleration and velocity initially reduce speed.',
      ],
      [
        '虚线合力应再加一次吗？',
        'Should a dashed resultant be added again?',
        [
          ['要，它是第三股力', 'Yes, a third force'],
          ['要，只加大小', 'Yes, add its magnitude'],
          ['不，它已是两力之和', 'No; it is already their sum'],
        ],
        2,
        '合力是计算结果，不是额外施力。',
        'A resultant is a calculated sum, not another interaction.',
      ],
    ],
    exit: [
      '滑轨右拉3 N、左拉5 N，质量2 kg；能仅用3 N求a吗？',
      'A 2 kg cart has 3 N right and 5 N left pulls. Can you use 3 N alone to find a?',
      [
        ['不能；ΣF=−2 N，a=−1 m/s²', 'No; ΣF=−2 N, a=−1 m/s²'],
        ['能，选较方便的力', 'Yes; choose the convenient force'],
      ],
      0,
      '先选对象和正方向，再合成全部作用。',
      'Choose target and direction, then combine all forces.',
    ],
  }),
  make({
    id: 'newton-force-changes-the-velocity',
    kind: 'newton-force',
    minutes: 20,
    title: [
      '推力加倍，小车的速度一定加倍吗？',
      'Does doubling force necessarily double a cart’s velocity?',
    ],
    subtitle: [
      '用等时速度变化找出F_net=ma，分清速度与加速度。',
      'Discover F_net=ma through equal-time velocity changes, separating velocity from acceleration.',
    ],
    hook: [
      '机器人小车测试两档推进。朋友说“力两倍，速度就两倍”，却没有问初速度和作用多久。先让同一辆车从静止出发，在同样2秒里比较0、2、4 N合力，寻找真正成比例的量。',
      'A robot cart tests two thrust settings. “Twice the force, twice the velocity,” says a friend, ignoring initial motion and duration. Start the same cart from rest and compare 0, 2 and 4 N net force for two seconds to find the quantity truly proportional to force.',
    ],
    prediction: [
      '质量不变，合力从2变4 N，哪个量必定加倍？',
      'At unchanged mass, net force changes 2→4 N. Which quantity necessarily doubles?',
    ],
    predictions: [
      ['每一时刻位置', 'Position at every instant'],
      ['加速度', 'Acceleration'],
      ['任何初速度下的末速度', 'Final velocity for any initial velocity'],
    ],
    explore: [
      '质量固定2 kg，完整比较三种恒定合力。仪表同时显示合力、加速度和速度；自由调合力，看速度怎样随时间累积。这里无水平阻力，竖直力仍平衡。',
      'Fix mass at 2 kg and compare three constant net forces fully. Read net force, acceleration and velocity together; change force freely and watch velocity accumulate over time. Horizontal resistance is absent while vertical forces remain balanced.',
    ],
    concept: [
      '牛顿第二定律把同一物体的合外力与加速度联系：ΣF=ma，适用于本课恒定质量、惯性参考系模型。质量固定时a与ΣF成正比；不是F与v总成正比。加速度描述速度每秒改变多少，速度还取决于初值和时间。1 N=1 kg·m/s²；正负号取决于约定方向。',
      'Newton’s second law connects net external force on one body to acceleration: ΣF=ma, for our constant-mass inertial-frame model. At fixed mass, a is proportional to ΣF; force is not generally proportional to velocity. Acceleration is velocity change per second; velocity also depends on its initial value and duration. 1 N=1 kg·m/s², with signs set by the chosen direction.',
    ],
    formula: [
      'ΣF=ma；a=ΣF/m；恒定a时Δv=aΔt',
      'ΣF=ma; a=ΣF/m; with constant a, Δv=aΔt',
    ],
    example: [
      '2 kg车受0、2、4 N合力，a为0、1、2 m/s²。从静止作用2 s，v为0、2、4 m/s，位移为0、2、4 m。若初速度改为3 m/s，则两档末速度5与7 m/s，比例不再2；加速度仍是1与2。',
      'For 2 kg under 0, 2 and 4 N, a=0, 1 and 2 m/s². From rest over 2 s, v=0, 2 and 4 m/s, with displacements 0, 2 and 4 m. Starting instead at 3 m/s gives final velocities 5 and 7, not a ratio of two, while accelerations remain 1 and 2.',
    ],
    misconception: [
      '“F=mv。”单位就不同：mv是动量，后面另学；力对应速度的变化率。也不能把单独某一股推力直接当合力，除非其他作用已抵消或忽略。',
      '“F=mv.” The units differ: mv is momentum, studied later; force corresponds to velocity’s rate of change. One push can stand for net force only after other interactions cancel or are explicitly omitted.',
    ],
    realWorld: [
      '给机器人设加速档位时，要知道合力和总质量，才能估计速度多久达到目标。真实电机推力与速度可能有关，不能把本课恒定合力条件默认为所有车辆。',
      'Planning a robot’s acceleration setting requires net force and total mass to estimate time to a target velocity. Real motor thrust may depend on speed; our constant-force condition is not universal vehicle behaviour.',
    ],
    summary: [
      '质量固定，合力改变加速度；速度要再加初值与时间。',
      'At fixed mass, net force changes acceleration. Velocity additionally needs initial value and duration.',
    ],
    homeExperiment: [
      '用纸算2 kg车受2与4 N作用1、2、3 s的速度，从静止和从3 m/s两次起算。找出哪些比值保持2，哪些不保持；不用真实加速或刹车实验。',
      'Calculate velocities of a 2 kg cart under 2 and 4 N for 1, 2 and 3 s, first from rest and then from 3 m/s. Identify which ratios stay at two and which do not; use paper rather than real acceleration or braking trials.',
    ],
    vocabulary: [
      ['牛顿第二定律', 'Newton’s second law'],
      ['加速度', 'Acceleration'],
      ['正比关系', 'Direct proportion'],
      ['牛顿单位', 'Newton unit'],
    ],
    questions: [
      [
        '2 kg、合力4 N，a？',
        '2 kg, net force 4 N. a?',
        [
          ['8 m/s²', '8 m/s²'],
          ['4 m/s²', '4 m/s²'],
          ['2 m/s²', '2 m/s²'],
        ],
        2,
        'a=4/2=2 m/s²。',
        'Divide net force by mass: 4/2=2 m/s².',
      ],
      [
        'u=3、a=2、t=2，v？',
        'u=3, a=2, t=2. v?',
        [
          ['7 m/s', '7 m/s'],
          ['4 m/s', '4 m/s'],
          ['6 m/s', '6 m/s'],
        ],
        0,
        '保留初速度，v=3+4。',
        'Keep the initial velocity: v=3+4.',
      ],
      [
        '质量固定，a与什么成正比？',
        'At fixed mass, a is proportional to what?',
        [
          ['当前速度', 'Current velocity'],
          ['合外力', 'Net external force'],
          ['当前位置', 'Current position'],
        ],
        1,
        '第二定律连接合力与加速度。',
        'The second law links net force and acceleration.',
      ],
    ],
    exit: [
      '两台同质量机器人受不同合力，但初速度不同；比较力的效果应先比较？',
      'Same-mass robots have different net forces and initial velocities. Which quantity best compares force effects?',
      [
        ['加速度或等时Δv', 'Acceleration or equal-time Δv'],
        ['只比末速度大小', 'Only final speed'],
      ],
      0,
      '末速度混合了初值；加速度直接对应合力。',
      'Final velocity includes initial conditions; acceleration directly reflects net force.',
    ],
  }),
  make({
    id: 'newton-mass-resists-change',
    kind: 'newton-mass',
    minutes: 20,
    title: [
      '同样的推力，满载小车为什么起步更慢？',
      'Why does the loaded cart gain speed more slowly under the same force?',
    ],
    subtitle: [
      '控制合力，改变质量，检验加速度的反比关系。',
      'Keep net force fixed, change mass, and test inverse acceleration scaling.',
    ],
    hook: [
      '送书机器人空载时轻快，装书后起步更缓。电机同样提供4 N净推进，载荷改变了哪一个量？先做公平比较：同样初速度、同样时间、同样合力，只换质量。',
      'A book-delivery robot starts briskly empty and more slowly when loaded. With the same 4 N net thrust, what changes? Compare fairly: matching initial velocity, duration and net force, changing only mass.',
    ],
    prediction: [
      '合力4 N不变，质量从1变2 kg，a怎样？',
      'Net force stays 4 N while mass changes 1→2 kg. What happens to a?',
    ],
    predictions: [
      ['加倍', 'Doubles'],
      ['不变', 'Unchanged'],
      ['减半', 'Halves'],
    ],
    explore: [
      '比较1、2、4 kg，均从静止受4 N合力2秒。自由调质量，观察a随m反比改变；大小相同的力箭头不应因为车更重就变长。质量改变了惯性，不是自动改变本课合力。',
      'Compare 1, 2 and 4 kg, each starting from rest under 4 N net force for two seconds. Change mass freely and watch inverse acceleration. Equal force arrows should not lengthen merely because a cart is heavier. Mass changes inertia, not this prescribed net force.',
    ],
    concept: [
      '质量衡量惯性；同样合力下，质量越大，速度改变越慢。a=ΣF/m，所以m加倍a减半，但乘积ma保持给定合力。质量单位kg，重量是重力、单位N，两者不能互换。光滑水平轨道上的重力与支持力竖直平衡，不能把mg当水平阻力。',
      'Mass measures inertia: under matching net force, more mass means slower velocity change. a=ΣF/m, so doubling m halves a while ma stays at the imposed force. Mass is in kg; weight is gravitational force in N. Do not interchange them. Weight and support balance vertically on this smooth horizontal track, so mg is not a horizontal resistance.',
    ],
    formula: [
      '合力固定：a∝1/m；ma=ΣF；本课ΣF=4 N',
      'At fixed net force: a∝1/m; ma=ΣF; here ΣF=4 N',
    ],
    example: [
      '1、2、4 kg分别给a=4、2、1 m/s²；2 s末速度8、4、2 m/s，位移8、4、2 m，初位置1 m所以末位置9、5、3。三次ma均4 N。这是匹配条件下的质量比较，不是所有重车都比轻车慢。',
      'Masses 1, 2 and 4 kg give accelerations 4, 2 and 1 m/s². After 2 s, velocities are 8, 4 and 2 m/s with displacements 8, 4 and 2 m; initial x=1 gives final positions 9, 5 and 3. Each ma is 4 N. This matched comparison does not mean every heavy vehicle is slower than every light one.',
    ],
    misconception: [
      '“车重，所以惯性更小，容易保持静止。”更大质量表示改变速度更困难，保持原状态的性质更强；不代表不能运动，也不创造一股反向惯性力。',
      '“A heavier cart has less inertia because it stays still.” Greater mass means harder velocity change and greater inertia; it neither forbids motion nor creates a backward inertia force.',
    ],
    realWorld: [
      '装载改变送货机器人的加速需求。若想满载后保持原加速度，要增加合力；真实路面摩擦、轮胎抓地与电机限制还会影响结果，本课先隔离质量这一因素。',
      'Loading changes a delivery robot’s acceleration requirement. Matching its previous acceleration needs more net force. Real friction, tyre grip and motor limits matter too; here we isolate the mass factor.',
    ],
    summary: [
      '同合力下，质量越大，加速度越小；反比比较先匹配其他条件。',
      'At matching net force, more mass gives less acceleration. Establish matched conditions before comparing the inverse relation.',
    ],
    homeExperiment: [
      '给三辆纸上机器人写1、2、4 kg，在相同4 N箭头下算a，再检查ma。增加一张“目标a=2”的任务卡，算各需2、4、8 N，解释公平比较为何要说明固定了什么。',
      'Label three paper robots 1, 2 and 4 kg, calculate a under matching 4 N arrows and check ma. Add a target a=2 card requiring 2, 4 and 8 N; explain why fair comparisons specify what stayed fixed.',
    ],
    vocabulary: [
      ['惯性质量', 'Inertial mass'],
      ['反比关系', 'Inverse proportion'],
      ['控制变量', 'Controlled variable'],
      ['载荷', 'Payload'],
    ],
    questions: [
      [
        '4 N作用4 kg，a？',
        '4 N on 4 kg. a?',
        [
          ['1 m/s²', '1 m/s²'],
          ['4 m/s²', '4 m/s²'],
          ['16 m/s²', '16 m/s²'],
        ],
        0,
        '加速度是合力除以质量。',
        'Acceleration is net force divided by mass.',
      ],
      [
        '质量加倍，想保持a，合力？',
        'Double mass while keeping a. Required net force?',
        [
          ['减半', 'Halves'],
          ['加倍', 'Doubles'],
          ['不变', 'Unchanged'],
        ],
        1,
        'ΣF=ma，同a需要成比例的合力。',
        'ΣF=ma: matching a needs proportionally more force.',
      ],
      [
        'mg是本课水平阻力吗？',
        'Is mg the horizontal resistance here?',
        [
          ['是', 'Yes'],
          ['只对重车是', 'Only for heavy carts'],
          [
            '不，mg向下且竖直平衡',
            'No; mg is downward and balanced vertically',
          ],
        ],
        2,
        '方向与相互作用不能混用。',
        'Keep interaction directions distinct.',
      ],
    ],
    exit: [
      '比较两车质量对加速的影响，要先匹配什么？',
      'To compare mass effects on acceleration, what should match?',
      [
        [
          '合力、初始条件、观察时间与模型条件',
          'Net force, initial conditions, duration and model conditions',
        ],
        ['只匹配车的颜色', 'Only colour'],
      ],
      0,
      '控制其他条件，才能归因于质量。',
      'Control other conditions before attributing a difference to mass.',
    ],
  }),
  make({
    id: 'newton-choose-the-force-receiver',
    kind: 'newton-diagram',
    minutes: 22,
    title: [
      '画受力图前，先给谁画一个圈？',
      'Whom should you circle before drawing a force diagram?',
    ],
    subtitle: [
      '先选研究对象，再筛选外力；系统内部的力另记。',
      'Choose the target before external forces; keep internal interactions separate.',
    ],
    hook: [
      '小车推着载荷前进。有人把手推车、车推手、车托载荷、载荷压车全画在同一张图上，再奇怪“怎么全抵消了？”画图第一步不是画箭头，而是圈定要研究的小车或整体。',
      'A cart carries a payload. Someone puts hand-on-cart, cart-on-hand, cart-on-load and load-on-cart on one diagram, then wonders why everything cancels. The first step is choosing the cart or combined system, not drawing arrows.',
    ],
    prediction: [
      '只研究小车，应该收下“车推手”的力吗？',
      'When studying only the cart, should its “cart pushes hand” force be included?',
    ],
    predictions: [
      ['应，它与车有关', 'Yes; it involves the cart'],
      ['不，它作用在手上', 'No; it acts on the hand'],
      ['只有车运动时应', 'Only if the cart moves'],
    ],
    explore: [
      '依次研究光滑面小车、粗糙面匀速小车、车与载荷整体。从力卡中筛选目标受到的外力，核对后再完整观察。最后一个系统必须排除车与载荷之间两股内部接触力；“ma”也不作为额外力。',
      'Study a smooth-track cart, a rough-track cruising cart, and cart plus load together. Select external forces acting on the target, check, then observe fully. The combined system excludes both cart/load internal contact forces; “ma” is not an additional force.',
    ],
    concept: [
      '受力图只画选定物体或系统受到的外力，箭头注明施力者、受力者与方向。光滑2 kg车有重力20 N下、支持20 N上、推力6 N右；粗糙匀速车另有6 N左摩擦。车与载荷整体4 kg的外力为重力40 N、支持40 N与推力6 N；内部接触不能重复加入整体外力账。ma是这些外力之和的结果，不是新施力者。',
      'A free-body diagram includes only external forces on the chosen body or system, with agent, receiver and direction. A smooth-track 2 kg cart receives 20 N weight down, 20 N support up and 6 N push right. Rough cruising adds 6 N friction left. The 4 kg cart/load system receives 40 N weight, 40 N support and 6 N push; internal contacts do not belong in its external ledger. ma is the sum’s result, not a new interacting agent.',
    ],
    formula: [
      'ΣFₓ=maₓ；ΣFᵧ=maᵧ；先划系统边界，再合成外力',
      'ΣFₓ=maₓ; ΣFᵧ=maᵧ; choose a system boundary before summing external forces',
    ],
    example: [
      '三张正确受力图给水平合力6、0、6 N，质量2、2、4 kg，加速度3、0、1.5 m/s²。粗糙面车初速度2 m/s，合力0所以仍匀速；整体载荷更重但同推力，改变速度更慢。竖直三例都平衡。',
      'The three diagrams give horizontal net forces 6, 0 and 6 N with masses 2, 2 and 4 kg, so a=3, 0 and 1.5 m/s². The rough cart starts at 2 m/s; zero net force preserves cruising. The combined loaded system changes velocity more slowly under the same push. Vertical forces balance in all three.',
    ],
    misconception: [
      '“凡是与车有关的力都画进去。”看受力者，不只看句子有没有车。“合力箭头+所有作用箭头”会重复计数；“ma力”也不能多加一遍。',
      '“Draw every force involving the cart.” Read the receiver, not merely whether the sentence mentions a cart. Adding a resultant to its constituent forces double-counts, as does inventing an extra “ma force”.',
    ],
    realWorld: [
      '设计机器人载荷时，可先把车与货物视作整体算水平加速度；研究货物会不会滑动时，再单独圈出货物。研究对象不同，内外力分类也不同，不能照搬同一张图。',
      'For a robot’s overall acceleration, group cart and cargo. To study whether cargo slips, isolate the cargo instead. Different targets change the internal/external classification; do not copy one diagram blindly.',
    ],
    summary: [
      '先圈目标，问“谁作用在它上”，再画外力；内部相互作用与计算结果不重复加入。',
      'Circle the target, ask who acts on it, then draw external forces. Do not add internal interactions or calculated resultants again.',
    ],
    homeExperiment: [
      '画小车与书两幅纸上轮廓：先圈“车”，再圈“车与书”。用不同色记录外部重力、轨道支持与手推；在整体圈内标车与书的接触，解释为何整体外力图不再单列它们。',
      'Draw cart and book outlines twice: circle the cart, then the combined system. Colour external weight, track support and hand push. Mark cart/book contacts inside the combined boundary and explain why they are absent from its external diagram.',
    ],
    vocabulary: [
      ['受力图', 'Free-body diagram'],
      ['研究对象', 'Target body'],
      ['系统边界', 'System boundary'],
      ['内部相互作用', 'Internal interaction'],
    ],
    questions: [
      [
        '只研究车，车推手的力作用在哪？',
        'Studying the cart, where does cart-on-hand force act?',
        [
          ['车上', 'On the cart'],
          ['手上，不列入车图', 'On the hand; exclude from cart diagram'],
          ['双方同一位置所以都算', 'Both share a location, so include it'],
        ],
        1,
        '用受力者决定归属。',
        'Assign a force by its receiver.',
      ],
      [
        '整体4 kg，水平外力6 N，a？',
        'A combined 4 kg system has horizontal external force 6 N. a?',
        [
          ['1.5 m/s²', '1.5 m/s²'],
          ['3 m/s²', '3 m/s²'],
          ['0，内部力相消', 'Zero because internal forces cancel'],
        ],
        0,
        '内部力成对消去，不消去外部6 N。',
        'Internal pairs cancel in the sum, not the external 6 N.',
      ],
      [
        'ma应作为额外力吗？',
        'Should ma be an additional force?',
        [
          ['要，加在所有力上', 'Yes, add it to all forces'],
          ['只有加速时要', 'Only while accelerating'],
          ['不，ma等于合力结果', 'No; ma equals the resultant'],
        ],
        2,
        '右边是运动响应，不是另一股作用。',
        'It is the motion response, not another interaction.',
      ],
    ],
    exit: [
      '载荷与车共同加速，先研究整体；货物对车的力应列为整体外力吗？',
      'Cart and cargo accelerate together. Is cargo-on-cart force external to their combined system?',
      [
        [
          '不，它在系统内部；外力另算',
          'No; it is internal, while external forces are summed separately',
        ],
        ['是，因为方向向下', 'Yes, because it points down'],
      ],
      0,
      '边界决定内外，不由方向单独决定。',
      'The boundary sets internal/external status, not direction alone.',
    ],
  }),
  make({
    id: 'newton-equal-forces-different-motions',
    kind: 'newton-pairs',
    minutes: 22,
    title: [
      '两车互相推，为什么轻车改变得更多？',
      'Why does the lighter cart change motion more when two carts push each other?',
    ],
    subtitle: [
      '同一相互作用给等大反向力，不同质量给不同加速度。',
      'One interaction gives equal opposite forces; different masses give different accelerations.',
    ],
    hook: [
      '两辆车间的伸缩推杆向两边撑开。重车好像“不肯走”，轻车退得多；这是不是重车推得更用力？把两个受力账分开，你会发现力相等，响应却不同。',
      'A telescoping actuator pushes two carts apart. The heavy cart moves less while the light cart retreats farther. Did the heavy cart push harder? Separate their force ledgers: forces match, responses differ.',
    ],
    prediction: [
      'A质量2 kg、B质量4 kg互相推，双方力大小与加速度大小？',
      'Carts A=2 kg and B=4 kg push each other. Force and acceleration magnitudes?',
    ],
    predictions: [
      ['力相等，A加速度更大', 'Equal forces; A accelerates more'],
      ['B的力一定更大', 'B’s force must be larger'],
      ['力相等，所以加速度相等', 'Equal forces, therefore equal accelerations'],
    ],
    explore: [
      '比较2/2、2/4、4/2 kg的A/B组合。轻型理想伸缩装置保持4 N相互作用2秒，忽略装置质量与水平外力。切换研究对象A、B、A+B：单车账非零，整体外部水平合力0、质心不动。',
      'Compare A/B masses 2/2, 2/4 and 4/2 kg. An ideal light telescoping device maintains a 4 N interaction for two seconds; device mass and external horizontal forces are omitted. Switch target A, B or A+B: each cart’s ledger is nonzero, while combined external horizontal force is zero and center of mass stays fixed.',
    ],
    concept: [
      '牛顿第三定律的两力来自同一次相互作用，大小相等、方向相反，作用在不同物体：B对A向左，A对B向右。它们不能在单车受力图里抵消，因为另一力作用在别的车上。若选A+B整体，两力属于内部相互作用，可在整体合力求和中相消；不表示每辆车都不加速。aA=−F/mA、aB=+F/mB，较轻车改变更大。',
      'Newton’s third-law pair belongs to one interaction: equal magnitude, opposite direction, acting on different bodies. B-on-A acts left and A-on-B right. They cannot cancel on one cart’s diagram, since the other force acts elsewhere. For A+B, they are internal and cancel in the combined sum; each cart can still accelerate. aA=−F/mA and aB=+F/mB, so the lighter cart changes more.',
    ],
    formula: [
      'F_B→A=−F_A→B；aA=−F/mA；aB=F/mB；整体外力0 ⇒ 质心速度不变',
      'F_B→A=−F_A→B; aA=−F/mA; aB=F/mB; zero external force ⇒ constant center-of-mass velocity',
    ],
    example: [
      'A=2、B=4 kg、F=4 N：aA=−2、aB=+1 m/s²，从静止2 s末vA=−4、vB=+2；A位移−4 m、B位移+2 m。两力仍都是4 N。质量加权质心位置保持25/3 m；两车的变化不等，但整体没有向一边漂移。',
      'With A=2, B=4 kg and F=4 N, aA=−2 and aB=+1 m/s². From rest after 2 s, vA=−4 and vB=+2; displacements are −4 and +2 m. Both forces remain 4 N. The mass-weighted center stays at 25/3 m: unequal individual changes do not make the system drift sideways.',
    ],
    misconception: [
      '“等大反向就都不动。”必须先问力作用在谁身上。同一车的平衡力与两车间第三定律配对不是同一种归属；车的重力与轨道支持力也不是第三定律的一对。',
      '“Equal and opposite means neither moves.” Ask which body receives each force. Balanced forces on one cart differ from a third-law pair across two carts. A cart’s weight and support are not each other’s third-law partners.',
    ],
    realWorld: [
      '两个滑板手轻推彼此，轻的一方通常速度改变更多；真实接触只持续短时间，不会分开后还一直互推。本实验刻意用持续伸缩装置保持作用，不能把模型原样套到短促碰撞。',
      'When two skateboarders gently push each other, the lighter often changes velocity more. Real contact lasts briefly and does not keep pushing after separation. Our sustained telescoping actuator is explicit, so this model should not be copied directly onto a brief collision.',
    ],
    summary: [
      '同一相互作用，力等大反向；先分受力者，再分系统边界，质量决定响应。',
      'One interaction gives equal opposite forces. Separate receivers and system boundaries; mass sets the response.',
    ],
    homeExperiment: [
      '在纸上画A与B两个框，各只放自己受到的一个水平力。再画大框圈住两车，把这一对改标内部作用，保留单车加速度计算。用2/4 kg和4 N检查轻车响应两倍。',
      'Draw separate A and B boxes, each with only its received horizontal force. Add a larger combined box and mark the pair internal while retaining each cart’s acceleration calculation. Check the twice-larger response of the 2 kg cart under a 4 N interaction with a 4 kg cart.',
    ],
    vocabulary: [
      ['牛顿第三定律', 'Newton’s third law'],
      ['相互作用对', 'Interaction pair'],
      ['不同受力者', 'Different receivers'],
      ['质心', 'Center of mass'],
    ],
    questions: [
      [
        '2与4 kg车间作用力大小？',
        'Force magnitudes between 2 and 4 kg carts?',
        [
          ['重车给更大', 'Heavy cart gives more'],
          ['轻车给更大', 'Light cart gives more'],
          ['同一相互作用中相等', 'Equal in the same interaction'],
        ],
        2,
        '第三定律配对不由质量分配大小。',
        'Third-law force magnitudes are not apportioned by mass.',
      ],
      [
        'A=2 kg受−4 N，aA？',
        'A=2 kg receives −4 N. aA?',
        [
          ['−2 m/s²', '−2 m/s²'],
          ['0，因为另一力+4', 'Zero, because the other force is +4'],
          ['+2 m/s²', '+2 m/s²'],
        ],
        0,
        '另一力作用在B，不放进A的合力账。',
        'The other force acts on B, not A’s ledger.',
      ],
      [
        '选A+B整体，内部两力相消，意味着？',
        'Internal forces cancel for A+B. What follows?',
        [
          ['每辆都不加速', 'Neither cart accelerates'],
          [
            '整体质心加速度由外力决定',
            'External force sets center-of-mass acceleration',
          ],
          ['两股作用不存在', 'Neither force exists'],
        ],
        1,
        '整体与单体运动不能混为一谈。',
        'Do not confuse combined-system and individual motion.',
      ],
    ],
    exit: [
      '车的重力与轨道支持力等大反向，是第三定律配对吗？',
      'A cart’s weight and support are equal and opposite. Are they a third-law pair?',
      [
        [
          '不是；都作用在车上，来自不同相互作用',
          'No; both act on the cart, from different interactions',
        ],
        ['是；只要等大反向就行', 'Yes; equal and opposite is enough'],
      ],
      0,
      '第三定律配对需要同一相互作用、不同受力者。',
      'A third-law pair needs one interaction and different receivers.',
    ],
  }),
];
