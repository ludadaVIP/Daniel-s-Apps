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
export const dynamicsLessons: Lesson[] = [
  make({
    id: 'dynamics-friction-waits-then-slides',
    kind: 'dynamics-friction',
    minutes: 22,
    title: [
      '推了一下没动，摩擦力已经到最大了吗？',
      'A push did not move it. Is friction already at its maximum?',
    ],
    subtitle: [
      '把保持静止、开始滑动和停稳分成不同阶段。',
      'Separate holding at rest, starting to slide and coming to rest.',
    ],
    hook: [
      '抽屉轻推不动，重推才滑开。为什么小推力没有让它向后滑？摩擦不是一直输出“最大阻力”的机器，它会在静止时匹配需要，滑动后换一条规则。',
      'A drawer stays still under a light push and slides under a stronger one. Why does the light push not send it backwards? Friction does not always deliver its maximum force: it adapts at rest, then follows a different rule while sliding.',
    ],
    prediction: [
      '静止块受6 N向右推力，最大静摩擦12 N，实际摩擦？',
      'A resting block is pushed right by 6 N; maximum static friction is 12 N. Actual friction?',
    ],
    predictions: [
      ['向左12 N', '12 N left'],
      ['向左6 N', '6 N left'],
      ['没有摩擦', 'No friction'],
    ],
    explore: [
      '同一2 kg块、水平面N=20 N、μs=0.6、μk=0.4。先推6 N，再从静止推14 N，最后把已向右3 m/s滑动的块松手。检查零速前后：阻力不会把块倒着推。自由改变推力，找保持静止的边界。',
      'Use one 2 kg block on a horizontal surface: N=20 N, μs=0.6, μk=0.4. Push by 6 N, push from rest by 14 N, then release a block already sliding right at 3 m/s. Inspect before and after zero speed: resistance does not drive it backwards. Adjust the push to find the rest boundary.',
    ],
    concept: [
      '静摩擦阻止接触面的相对滑动趋势，大小在0到μsN之间按需要变化。只有即将滑动才取上限；本理想模型推力恰好12 N仍可静止。开始滑动后，摩擦大小μkN=8 N，方向反向于相对滑动。推14 N时合力6 N，a=3 m/s²。松手滑行时合力−8 N，a=−4；停下后摩擦重新按静止需要判断。',
      'Static friction prevents a tendency for relative slipping at the contact, adjusting from zero to μsN. The maximum applies only at impending slip; this ideal model can still hold at exactly 12 N. While sliding, friction magnitude is μkN=8 N, opposite relative slip. A 14 N push leaves 6 N net, giving a=3 m/s². Released sliding has −8 N net and a=−4; once stopped, reassess static friction.',
    ],
    formula: [
      '静止：|fs|≤μsN；滑动：|fk|=μkN；合力=P+f=ma',
      'At rest: |fs|≤μsN; sliding: |fk|=μkN; net=P+f=ma',
    ],
    example: [
      '6 N推力与−6 N静摩擦平衡。14 N推力与−8 N滑动摩擦相加，2 s后v=6 m/s、位移6 m。松手初速3，0.75 s停稳，位移1.125 m；之后保持这个位置，不能继续套v=3−4t得到倒退。',
      'A 6 N push is balanced by −6 N static friction. A 14 N push plus −8 N sliding friction gives v=6 m/s and displacement 6 m after 2 s. Released from 3 m/s, the block stops in 0.75 s after 1.125 m; it then stays there. Extending v=3−4t beyond the stop would falsely predict reverse motion.',
    ],
    misconception: [
      '“有摩擦就总是μN，而且一定反向于物体运动。”静摩擦不是固定最大值；方向看接触面的滑动趋势。走路时地面可向前推鞋底，帮助人前进。',
      '“Friction is always μN and always opposite the object’s motion.” Static friction is not fixed at its maximum; direction follows relative slip or its tendency at contact. Ground can push a shoe forward while you walk.',
    ],
    realWorld: [
      '拧瓶盖、鞋底抓地、推家具都先问接触面是否滑动，再选摩擦规则。换材料和表面会改变系数；本课数字只属于规定的教学表面。',
      'Opening lids, shoe grip and pushing furniture all begin by asking whether the contact slips. Materials and surface condition change coefficients; our numbers belong only to this teaching surface.',
    ],
    summary: [
      '先判静止还是滑动，再定摩擦大小；到零速必须重新判阶段。',
      'Decide rest or sliding before choosing friction. Reassess the stage at zero speed.',
    ],
    homeExperiment: [
      '在水平桌上轻推一个空纸盒，记录“不动”和“滑动”的观察，不猜μ的数值。画盒子的受力图，用“实际静摩擦”和“上限”两个标签解释小推力。',
      'Gently push an empty paper box on a level table and record rest versus sliding without guessing μ. Draw its forces and use separate labels for actual static friction and its upper limit.',
    ],
    vocabulary: [
      ['静摩擦', 'Static friction'],
      ['滑动摩擦', 'Kinetic friction'],
      ['摩擦系数', 'Friction coefficient'],
      ['相对滑动趋势', 'Tendency for relative slip'],
    ],
    questions: [
      [
        '静止块受10 N推力，静摩擦上限12 N，实际摩擦大小？',
        'Resting block, push 10 N, static limit 12 N. Actual friction magnitude?',
        [
          ['12 N', '12 N'],
          ['10 N', '10 N'],
          ['8 N', '8 N'],
        ],
        1,
        '按平衡需要匹配10 N，没有达到上限。',
        'It adapts to 10 N for balance, below the limit.',
      ],
      [
        '已向右滑动，P=14 N、fk=8 N、m=2 kg，加速度？',
        'Sliding right, P=14 N, fk=8 N, m=2 kg. Acceleration?',
        [
          ['3 m/s²', '3 m/s²'],
          ['7 m/s²', '7 m/s²'],
          ['−4 m/s²', '−4 m/s²'],
        ],
        0,
        '合力14−8=6 N，再除以质量。',
        'Net force is 14−8=6 N, divided by mass.',
      ],
      [
        '松手块到零速后，应该？',
        'Once the released block reaches zero speed, what next?',
        [
          ['仍用−4加速度倒退', 'Keep −4 acceleration and reverse'],
          ['摩擦翻转再弹走', 'Flip friction and bounce'],
          ['重新判断静止条件', 'Reassess conditions for rest'],
        ],
        2,
        '已无水平推力，静摩擦可为0，保持静止。',
        'With no horizontal push, static friction can be zero and the block remains at rest.',
      ],
    ],
    exit: [
      '朋友把小推力下摩擦写成12 N。如何改？',
      'A friend writes 12 N friction for a small push. How do you correct it?',
      [
        [
          '先判未滑动，按平衡取实际值，再检查未超上限',
          'Check no slip, use the value needed for balance, then check the limit',
        ],
        ['所有情况都改成8 N', 'Change every case to 8 N'],
        ['删除摩擦，因为没有移动', 'Delete friction because nothing moved'],
      ],
      0,
      '静止也能有摩擦，上限不是自动实际值。',
      'Rest can involve friction; the maximum is not automatically the actual value.',
    ],
  }),
  make({
    id: 'dynamics-air-shape-changes-the-fall',
    kind: 'dynamics-drag',
    minutes: 22,
    title: [
      '同样重，为什么更“兜风”的形状掉得慢？',
      'Same weight: why does a shape that catches more air fall more slowly?',
    ],
    subtitle: [
      '把空气作用与重力分开，跟随随速度变化的阻力。',
      'Separate air effects from gravity and follow speed-dependent drag.',
    ],
    hook: [
      '纸张展开或团起，质量几乎没变，落法却变了。不是重力忘记了展开的纸，而是与空气的相互作用不同。我们先用可控模型排除质量变化，再看速度怎样改变阻力。',
      'A flat sheet and the same crumpled sheet have nearly the same mass but fall differently. Gravity has not forgotten the flat sheet; its interaction with air differs. Control mass in a model, then watch how speed changes drag.',
    ],
    prediction: [
      '同一空气与形状，速度加倍，平方阻力模型D=kv²给出？',
      'Same air and shape: double speed. In D=kv², drag becomes?',
    ],
    predictions: [
      ['2倍', '2 times'],
      ['不变', 'Unchanged'],
      ['4倍', '4 times'],
    ],
    explore: [
      '同一1 kg物体从静止释放，比较k=0、0.1、0.4 kg/m，观察2 s。重力都10 N；空气阻力从0开始，随速度增长。自由调k，看同一时刻的落距、速度、合力如何一起变化。k=0代表无空气作用的比较，不是形状能消除所有阻力。',
      'Release the same 1 kg body from rest, comparing k=0, 0.1 and 0.4 kg/m over 2 s. Weight remains 10 N; drag starts at zero and grows with speed. Adjust k and compare drop distance, velocity and net force at one instant. k=0 is the no-air comparison, not a shape that removes all drag.',
    ],
    concept: [
      '空气阻力来自物体与空气相互作用，方向反向于相对空气的运动。在固定密度、形状和适用流动条件下，D=½ρCdAv²=kv²；迎风面积A或阻力系数Cd改变k。向下为正时合力mg−kv²，a=g−kv²/m。它一般不是恒定减速或恒定加速度：从静止下落时先加速，阻力增长后加速度变小。',
      'Air drag arises from interaction with air and opposes motion relative to it. With fixed density, shape and suitable flow conditions, D=½ρCdAv²=kv²; frontal area A and drag coefficient Cd affect k. Downward positive gives net mg−kv² and a=g−kv²/m. Acceleration is generally not constant: a released body first speeds up; growing drag reduces acceleration.',
    ],
    formula: [
      'D=kv²；向下：合力=mg−D=ma；k单位kg/m',
      'D=kv²; downward: net=mg−D=ma; k has unit kg/m',
    ],
    example: [
      '取k=0.4、m=1、g=10，在v=0时D=0、a=10；v=3时D=3.6 N、a=6.4；v=5时D=10 N、a=0。无空气的2 s落距20 m是对照；不能把有空气的整段也套成½gt²。',
      'For k=0.4, m=1 and g=10: at v=0, D=0 and a=10; at v=3, D=3.6 N and a=6.4; at v=5, D=10 N and a=0. The no-air drop of 20 m in 2 s is the comparison. Do not apply ½gt² to the entire air-drag case.',
    ],
    misconception: [
      '“空气阻力固定等于重力。”刚释放时速度0，模型阻力也是0；只有平衡的终端速度才相等。模型忽略浮力、风和空气密度变化；真实薄纸还会翻转，不能把它的运动当固定k的精确演示。',
      '“Air resistance always equals weight.” At release, speed and model drag are zero; equality occurs at terminal balance. We omit buoyancy, wind and changing density. Real thin paper can tumble, so its motion is not an exact fixed-k demonstration.',
    ],
    realWorld: [
      '骑车迎风、雨滴、降落伞都受空气作用。迎风面积、相对风速和姿态需要分别控制。真实高速和微小颗粒的模型条件可能不同，先检查条件再使用公式。',
      'Cycling into wind, raindrops and parachutes all involve air effects. Control frontal area, relative air speed and orientation separately. Very high speeds or tiny particles can require different conditions and models.',
    ],
    summary: [
      '重力保持，阻力随相对空气速度和形状改变；合力才决定加速度。',
      'Weight remains while drag changes with relative air speed and shape. Net force determines acceleration.',
    ],
    homeExperiment: [
      '从自己腰高处放开同一张干纸的展开与团起形态，记录谁先到地、是否翻转。保留同一张纸和释放高度，解释这不是改变质量的实验，也不是精确测k。',
      'Release the same dry sheet flat and crumpled from your waist height. Record arrival order and tumbling. Keep the same paper and height; explain why this does not change mass or precisely measure k.',
    ],
    vocabulary: [
      ['空气阻力', 'Air drag'],
      ['迎风面积', 'Frontal area'],
      ['相对空气速度', 'Velocity relative to air'],
      ['阻力系数', 'Drag coefficient'],
    ],
    questions: [
      [
        'k=0.4、v=3 m/s，D？',
        'k=0.4, v=3 m/s. D?',
        [
          ['1.2 N', '1.2 N'],
          ['3.6 N', '3.6 N'],
          ['10 N', '10 N'],
        ],
        1,
        '平方速度：0.4×9=3.6。',
        'Square the speed: 0.4×9=3.6.',
      ],
      [
        'm=1、mg=10、D=3.6 N，加速度向下多少？',
        'm=1, weight 10 N, drag 3.6 N. Downward acceleration?',
        [
          ['6.4 m/s²', '6.4 m/s²'],
          ['13.6 m/s²', '13.6 m/s²'],
          ['3.6 m/s²', '3.6 m/s²'],
        ],
        0,
        '两股相反力相减。',
        'Subtract the opposite forces.',
      ],
      [
        '比较形状的空气作用，优先保持？',
        'For a fair comparison of shape-dependent air effects, hold what fixed?',
        [
          ['所有形状的k', 'k for all shapes'],
          ['每时刻阻力', 'Drag at every instant'],
          ['质量、空气条件和初始条件', 'Mass, air and initial conditions'],
        ],
        2,
        '允许形状改变k，其余条件配对。',
        'Allow shape to change k while matching the other conditions.',
      ],
    ],
    exit: [
      '朋友说纸团先到地证明“重力更大”。最好的下一步？',
      'A friend says earlier arrival proves the crumpled paper has more gravity. Best next step?',
      [
        [
          '确认同张纸同质量，比较空气作用，并用无空气模型作对照',
          'Check same sheet/mass, compare air effects and use the no-air model',
        ],
        ['仅换成更重纸团', 'Only use a heavier paper ball'],
        ['把所有落体都设a=0', 'Set a=0 for all falls'],
      ],
      0,
      '公平比较把形状作用和质量作用分开。',
      'A fair comparison separates shape and mass effects.',
    ],
  }),
  make({
    id: 'dynamics-terminal-is-balance-not-rest',
    kind: 'dynamics-terminal',
    minutes: 22,
    title: [
      '下落不再变快，是重力消失了吗？',
      'A fall stops getting faster. Has gravity disappeared?',
    ],
    subtitle: [
      '从慢于、等于和快于终端速度的两侧检查平衡。',
      'Inspect balance from below, exactly at and above terminal speed.',
    ],
    hook: [
      '降落伞稳定下降时并不悬停。它还向下走，却几乎不再加速。更奇妙的是：如果一开始下落得比平衡速度更快，向上的阻力会让它变慢，而不是越掉越快。',
      'A steadily descending parachute is not hovering: it still travels downward while its acceleration is near zero. More surprisingly, starting faster than the balance speed gives an upward net force that slows the downward fall.',
    ],
    prediction: [
      '重量10 N、向上阻力10 N、物体向下5 m/s，接下来？',
      'Weight 10 N, upward drag 10 N, body moving downward at 5 m/s. What next?',
    ],
    predictions: [
      ['立即停下', 'Immediately stops'],
      ['继续向下5 m/s', 'Keeps moving down at 5 m/s'],
      ['必然加速', 'Necessarily accelerates'],
    ],
    explore: [
      '同一m=1 kg、g=10、k=0.4 kg/m，计算vt=5 m/s。三组初速0、5、8 m/s，观察1.5 s。读出速度线在虚线下方、重合或上方，检查相同位置时刻的合力符号。拖动只检查，不代替三组完整观察。',
      'Keep m=1 kg, g=10 and k=0.4 kg/m, giving vt=5 m/s. Start at 0, 5 and 8 m/s over 1.5 s. Read the velocity trace below, on or above the dashed balance line and inspect net-force signs at the same instant. Seeking inspects; it does not replace full observations.',
    ],
    concept: [
      '终端速度是给定条件下重力与阻力平衡的持续速度，不是速度归零。mg=kv²给vt=√(mg/k)。低于vt时重力较大，向下加速；高于vt时阻力较大，加速度向上，但仍可向下运动。本连续模型从不等于vt的初速逐渐接近它，有限时间没有精确抵达。',
      'Terminal speed is sustained speed when weight and drag balance under specified conditions, not zero speed. mg=kv² gives vt=√(mg/k). Below vt, weight dominates and acceleration is downward. Above vt, drag dominates and acceleration is upward while motion can remain downward. From a different starting speed, this continuous model approaches vt without exact finite-time arrival.',
    ],
    formula: [
      'vt=√(mg/k)；v=vt时合力0、a=0，但v≠0',
      'vt=√(mg/k); at v=vt, net=0 and a=0, while v is not zero',
    ],
    example: [
      'v=8时D=0.4×64=25.6 N，合力10−25.6=−15.6 N，a=−15.6 m/s²；负号表示向上改变速度，不表示立刻向上飞。初速5的组全程a=0，1.5 s下落7.5 m。',
      'At v=8, D=0.4×64=25.6 N and net=10−25.6=−15.6 N, so a=−15.6 m/s². Negative means upward velocity change, not immediate upward flight. The initial-5 group has a=0 throughout and falls 7.5 m in 1.5 s.',
    ],
    misconception: [
      '“终端速度是所有物体统一的最高速度。”它取决于质量、空气、形状和面积；物体能从更高初速向它减速。开伞改变了条件和平衡速度，真实过程包含展开时间，不能当瞬间切换且立即到达。',
      '“Terminal speed is one universal maximum for every object.” It depends on mass, air, shape and area; a body can slow toward it from a higher initial speed. Opening a parachute changes conditions and balance speed, with a real deployment interval rather than instant arrival.',
    ],
    realWorld: [
      '雨滴、降落伞和羽毛的稳定速度不同。把k加到4倍，在本模型同质量下vt减半；不能说速度随面积成简单反比，也不能忽略重力仍在。',
      'Raindrops, parachutes and feathers can have different steady speeds. Quadrupling k halves vt at fixed mass in this model. Speed is not simply inverse area, and gravity remains present.',
    ],
    summary: [
      '不变速不等于不运动；终端速度是特定条件下的力平衡。',
      'Unchanging speed is not no motion. Terminal speed is force balance under specified conditions.',
    ],
    homeExperiment: [
      '在纸上画v=0、5、8三张重力/阻力图，用向下正方向标合力。为5 m/s组画等时间、等间距的位置点；为8 m/s组保留向下箭头，缩短后续间距。',
      'Draw force diagrams for v=0, 5 and 8 on paper with downward positive. For 5 m/s, draw equal-time equally spaced positions. For 8 m/s, retain downward motion while shortening later gaps.',
    ],
    vocabulary: [
      ['终端速度', 'Terminal velocity'],
      ['力平衡', 'Force balance'],
      ['渐近接近', 'Asymptotic approach'],
      ['条件改变', 'Changed conditions'],
    ],
    questions: [
      [
        'v=5 m/s时D=10 N、mg=10 N，a？',
        'At v=5 m/s, D=10 N and weight=10 N. a?',
        [
          ['10 m/s²', '10 m/s²'],
          ['5 m/s²', '5 m/s²'],
          ['0 m/s²', '0 m/s²'],
        ],
        2,
        '平衡给零加速度，不给零速度。',
        'Balance gives zero acceleration, not zero velocity.',
      ],
      [
        'v=8 m/s向下，阻力25.6 N，合力方向？',
        'Moving down at 8 m/s, drag 25.6 N. Net direction?',
        [
          ['向上', 'Upward'],
          ['向下', 'Downward'],
          ['零', 'Zero'],
        ],
        0,
        '25.6 N向上超过10 N向下。',
        '25.6 N upward exceeds 10 N downward.',
      ],
      [
        '同质量，把k增到4倍，vt变为？',
        'Same mass, quadruple k. Terminal speed becomes?',
        [
          ['4倍', '4 times'],
          ['一半', 'Half'],
          ['四分之一', 'Quarter'],
        ],
        1,
        '平方根的反比：√(1/4)=1/2。',
        'Inverse square root: √(1/4)=1/2.',
      ],
    ],
    exit: [
      '如何解释“速度线平了，但物体仍落下”？',
      'How do you explain a flat velocity trace while the body keeps falling?',
      [
        [
          '阻力与重量平衡，合力0，原非零速度保持',
          'Drag balances weight; zero net force preserves nonzero velocity',
        ],
        ['重力被关掉', 'Gravity was switched off'],
        ['静止物体有下落速度', 'A resting body has fall velocity'],
      ],
      0,
      '区分速度的值与速度变化率。',
      'Separate velocity value from its rate of change.',
    ],
  }),
  make({
    id: 'dynamics-elevator-scale-follows-acceleration',
    kind: 'dynamics-elevator',
    minutes: 24,
    title: [
      '电梯还向上，为什么秤的读数反而变小？',
      'The elevator is still going up. Why can the scale reading get smaller?',
    ],
    subtitle: [
      '用同一趟起步、匀速、刹车解释“变重”和“变轻”。',
      'Explain heavier and lighter readings through one start, cruise and brake trip.',
    ],
    hook: [
      '电梯刚向上起步，脚底感觉更用力；接近楼层还在向上，却感觉变轻。质量没有变，运动方向也没立刻变。决定秤读数的是加速度方向，不是“上行或下行”两个标签。',
      'Starting upward can make your feet feel more pressed into the floor. Near the floor destination you are still moving up but feel lighter. Mass and direction have not suddenly changed. Scale reading follows acceleration, not simply the labels up and down.',
    ],
    prediction: [
      '向上运动但正在刹车，加速度向下，秤的支持力？',
      'Moving upward but braking with downward acceleration. Scale support force?',
    ],
    predictions: [
      ['大于重量', 'Greater than weight'],
      ['等于重量', 'Equal to weight'],
      ['小于重量', 'Less than weight'],
    ],
    explore: [
      '先完整观察向上起停、向下起停、向上匀速片段。用关键时刻按钮检查0.5、2、3.5、4 s，把速度符号与加速度符号分开。再自由改变乘客质量：电梯路径不变，秤的牛顿读数改变。教学质量2 kg只为算术方便，不是实际乘客质量。',
      'Observe an upward start/stop, downward start/stop and upward steady segment. Inspect 0.5, 2, 3.5 and 4 s, separating velocity and acceleration signs. Change passenger mass: the elevator path stays fixed while the scale’s newton reading changes. The teaching mass of 2 kg simplifies arithmetic, not a real passenger mass.',
    ],
    concept: [
      '选乘客为对象、地面惯性系、向上为正。支持力N向上，重量mg向下，N−mg=ma，所以N=m(g+a)。向上起步a=+2时N较大；向上刹车a=−2时N较小。向下起步与刹车反过来；匀速无论方向都a=0，N=mg。秤显示的是接触支持力；若用地面标定的kg刻度，应另外说明标定，不能把它当质量真变。',
      'Target the passenger in a ground inertial frame, upward positive. Support N acts up and weight mg down: N−mg=ma, so N=m(g+a). Upward start with a=+2 increases N; upward braking with a=−2 reduces it. Downward start and braking reverse these signs. Steady motion in either direction has a=0 and N=mg. A scale senses support force; a calibrated kg display requires its calibration, not changing true mass.',
    ],
    formula: [
      'N−mg=ma ⇒ N=m(g+a)，a向上为正',
      'N−mg=ma ⇒ N=m(g+a), with upward-positive acceleration',
    ],
    example: [
      'm=2、g=10，重量20 N。向上起步/匀速/刹车读24/20/16 N；向下读16/20/24 N。向上那趟3.5 s仍v=+1 m/s，却a=−2、N=16。两趟4 s后v=0，N又20；匀速片段结束仍v=+2，不能误画成到站。',
      'For m=2, g=10, weight is 20 N. Upward start/cruise/braking reads 24/20/16 N; downward reads 16/20/24 N. At 3.5 s upward travel still has v=+1 m/s, but a=−2 and N=16. Both trips finish with v=0 and N=20 at 4 s; the steady segment still ends at v=+2, not at an arrival.',
    ],
    misconception: [
      '“上行就超重，下行就失重。”方向不是判据，加速度才是。完全失重要求N=0，例如自由落体理想a=−g；正常电梯本课a=±2，仍有支持力。不要把电梯当改变当地g的机器。',
      '“Upward travel always means heavier, downward lighter.” Acceleration is the criterion. Complete apparent weightlessness requires N=0, such as ideal free fall with a=−g. Our ordinary ±2 cases retain support; the elevator does not change local g.',
    ],
    realWorld: [
      '电梯、过山车和汽车转向都能让身体感到接触力变化。先选身体、列实际外力，再看加速度；感觉更重不证明质量增加。',
      'Elevators, roller coasters and car turns can change felt contact forces. Choose the body, list actual external forces and examine acceleration. Feeling heavier does not prove increased mass.',
    ],
    summary: [
      '秤读支持力；速度方向和加速度方向要分别判断。',
      'A scale reads support force. Judge velocity and acceleration directions separately.',
    ],
    homeExperiment: [
      '先画三格向上电梯故事：起步、匀速、刹车，标v与a，再画N和mg。若与家人正常乘坐电梯，可描述脚底感觉并与故事对照，不在电梯里安排测试或放器材。',
      'Draw three upward-trip panels: start, cruise and brake. Mark v and a, then N and mg. During an ordinary family elevator ride, describe the feeling at your feet and compare; no staged tests or equipment in the elevator.',
    ],
    vocabulary: [
      ['支持力', 'Support force'],
      ['视重', 'Apparent weight'],
      ['惯性参考系', 'Inertial frame'],
      ['减速与方向', 'Slowing and direction'],
    ],
    questions: [
      [
        '向上刹车：m=2、a=−2、g=10，N？',
        'Upward braking: m=2, a=−2, g=10. N?',
        [
          ['24 N', '24 N'],
          ['16 N', '16 N'],
          ['20 N', '20 N'],
        ],
        1,
        'N=2×(10−2)=16。',
        'N=2×(10−2)=16.',
      ],
      [
        '向下匀速时，N与mg？',
        'During steady downward motion, N compared with mg?',
        [
          ['相等', 'Equal'],
          ['N更小', 'N is smaller'],
          ['N为0', 'N is zero'],
        ],
        0,
        'a=0，外力平衡；v可以非零。',
        'a=0 gives balance; velocity can be nonzero.',
      ],
      [
        '同一电梯路径、乘客质量加倍，秤读数？',
        'Same elevator path, double passenger mass. Scale reading?',
        [
          ['不变', 'Unchanged'],
          ['减半', 'Halves'],
          ['加倍', 'Doubles'],
        ],
        2,
        '给定a和g，N=m(g+a)随m成正比。',
        'For fixed a and g, N=m(g+a) is proportional to m.',
      ],
    ],
    exit: [
      '朋友说“向上所以N一定大于mg”，你用哪段反例？',
      'A friend says upward motion always makes N exceed mg. Which counterexample?',
      [
        [
          '向上刹车：v向上、a向下、N小于mg',
          'Upward braking: v up, a down, N below mg',
        ],
        ['向上起步：a向上', 'Upward start with a up'],
        ['只看楼层编号', 'Only read floor numbers'],
      ],
      0,
      '运动方向不单独决定支持力。',
      'Motion direction alone does not determine support.',
    ],
  }),
  make({
    id: 'dynamics-car-road-force-and-stopping',
    kind: 'dynamics-cars',
    minutes: 24,
    title: [
      '发动机在车内，谁给整辆车向前的外力？',
      'The engine is inside the car. Who supplies the external forward force?',
    ],
    subtitle: [
      '研究整车、轮胎抓地和刹车后的阶段边界。',
      'Study the whole vehicle, tyre grip and the stopping boundary.',
    ],
    hook: [
      '发动机可以让轮子转，但离开地面空转不代表整车能照样向前加速。轮胎向后作用于地面，地面可向前作用于轮胎。刹车又把这股接触外力换方向；它不是让同一负加速度永远延续。',
      'An engine can turn wheels, but spinning them off the road does not accelerate the whole car forward in the same way. Tyres act backward on the road, which can act forward on tyres. Braking reverses this contact force; it does not impose negative acceleration forever.',
    ],
    prediction: [
      '研究整辆车时，驱动阶段的直接向前外力来自？',
      'For the whole car, the direct forward external force during driving comes from?',
    ],
    predictions: [
      ['发动机对车内零件的力', 'Engine force on parts inside'],
      ['空气总向前推', 'Air always pushing forward'],
      ['地面对轮胎的力', 'Road force on tyres'],
    ],
    explore: [
      '2 kg教学小车，比较请求驱动6 N、驱动2 N、制动6 N，抓地上限6 N，运动阻力2 N。驱动组初速2，另外两组4 m/s。观察2 s，最后一组1 s停稳；检查停稳后的力，不允许数学延长线产生倒车。自由降低抓地上限，比较同一制动组的行程。',
      'A 2 kg teaching car requests 6 N drive, 2 N drive or 6 N brake, with grip cap 6 N and moving resistance 2 N. The first starts at 2 m/s, the others at 4 m/s. Observe 2 s; the braking group stops at 1 s. Inspect forces after stopping instead of extending a line into reverse travel. Lower the grip cap and compare the same braking group.',
    ],
    concept: [
      '研究整车时发动机与车内部件之间的作用是内部力；地面与轮胎的作用是外力。驱动与制动通过接触传递，并受可用抓地限制；理想不打滑时轮胎接触可涉及静摩擦。运动阶段a=(Froad−R)/m，不能只取发动机标签。到零速后，制动不把车推向后，重新判断力与阶段。本低速模型用固定2 N运动阻力和规定抓地上限，不模拟锁轮滑动或真实车辆安全性能。',
      'Engine interactions with onboard parts are internal to the whole vehicle; road–tyre interactions are external. Driving and braking transmit contact forces limited by grip; ideal rolling without slip can involve static friction. During motion a=(Froad−R)/m, not simply an engine label. At zero speed brakes do not push the car backwards: reassess forces and stage. Our low-speed model uses fixed 2 N moving resistance and a prescribed grip cap, omitting locked-wheel sliding and real vehicle safety performance.',
    ],
    formula: [
      '运动阶段：ΣFx=Froad−R=ma；抓地限制实际驱动/制动力',
      'During motion: ΣFx=Froad−R=ma; grip limits actual drive/brake force',
    ],
    example: [
      '驱动6 N、阻力2 N，合力4 N、a=2，初速2在2 s后变6。驱动2 N时合力0，初速4保持4。制动−6与阻力−2合成−8 N、a=−4，初速4在1 s停稳，位移2 m；2 s时仍在2 m，没有倒车。',
      'Drive 6 N against resistance 2 N gives net 4 N and a=2; initial 2 becomes 6 m/s at 2 s. Drive 2 N balances resistance, preserving initial 4. Brake −6 plus resistance −2 gives −8 N and a=−4; initial 4 stops after 1 s and 2 m, remaining at 2 m at 2 s without reversing.',
    ],
    misconception: [
      '“摩擦总拖后腿，所以车越滑越好。”轮胎需要合适抓地传递驱动和制动力，地面作用可向前。也别混用两种不同初速的驱动/匀速组推断纯驱动力比例；公平的抓地比较应固定同一制动组，只改上限。',
      '“Friction only holds cars back, so less grip is always better.” Tyres need grip to transmit drive and brake forces; road force can point forward. Do not use the different starting speeds of drive/cruise groups as a pure force-ratio test. For a fair grip comparison, keep the same braking group and change only the cap.',
    ],
    realWorld: [
      '自行车起步靠地面作用；湿滑条件会限制可传递的力。模型解释抓地为什么重要，真实停车距离还受速度、反应时间、坡度、轮胎和控制系统影响。',
      'A bicycle accelerates through road interaction; slippery conditions can limit transmitted force. The model explains why grip matters. Real stopping distance also depends on speed, reaction time, slope, tyres and control systems.',
    ],
    summary: [
      '整车加速要找外部相互作用；制动模型要在停稳处换阶段。',
      'For whole-car acceleration, identify external interactions. Switch braking stages at rest.',
    ],
    homeExperiment: [
      '在纸上画“车”“地面”两个边界，为驱动与制动各画一对作用力。把作用在车上的力放进车的账，另一股放进地面的账。使用虚拟滑块比较抓地，不做道路制动实验。',
      'Draw separate car and road boundaries on paper and an interaction pair for driving and braking. Put the force on the car in its ledger and the partner in the road ledger. Compare grip with the virtual slider, without road braking tests.',
    ],
    vocabulary: [
      ['抓地上限', 'Grip limit'],
      ['驱动力', 'Driving force'],
      ['制动力', 'Braking force'],
      ['整车系统', 'Whole-vehicle system'],
    ],
    questions: [
      [
        '驱动6 N、阻力2 N、m=2，a？',
        'Drive 6 N, resistance 2 N, m=2. a?',
        [
          ['2 m/s²', '2 m/s²'],
          ['3 m/s²', '3 m/s²'],
          ['4 m/s²', '4 m/s²'],
        ],
        0,
        '先合力6−2=4，再除2。',
        'Net is 6−2=4, then divide by 2.',
      ],
      [
        '初速4、a=−4制动，1 s后应怎样处理？',
        'Initial 4, braking a=−4. What should happen after 1 s?',
        [
          ['一直延长到负速度', 'Extend forever into negative velocity'],
          ['停稳后重新判断力', 'Reassess forces after stopping'],
          ['取消所有竖直力', 'Remove all vertical forces'],
        ],
        1,
        '零速是运动规则的阶段边界。',
        'Zero speed marks a stage boundary.',
      ],
      [
        '请求6 N制动，抓地上限2 N，实际制动大小？',
        'Request 6 N braking, grip cap 2 N. Actual braking magnitude?',
        [
          ['6 N', '6 N'],
          ['8 N', '8 N'],
          ['2 N', '2 N'],
        ],
        2,
        '接触最多传递本模型规定的2 N；另有运动阻力另列。',
        'Contact transmits at most the prescribed 2 N; moving resistance is listed separately.',
      ],
    ],
    exit: [
      '为什么“发动机推车”不是完整的整车受力图？',
      'Why is “the engine pushes the car” not a complete whole-car force diagram?',
      [
        [
          '发动机内部作用不能代替地面对轮胎的外力，还要列阻力',
          'Internal engine interactions do not replace external road force; include resistance',
        ],
        ['发动机完全没有作用', 'The engine does nothing'],
        ['必须画一股向前惯性力', 'Add a forward inertia force'],
      ],
      0,
      '系统边界决定内部/外部作用的归属。',
      'The system boundary determines internal versus external interactions.',
    ],
  }),
  make({
    id: 'dynamics-rocket-does-not-push-air',
    kind: 'dynamics-rockets',
    minutes: 24,
    title: [
      '周围没有空气，喷气飞行器还能前进吗？',
      'With no surrounding air, can a thruster still move a craft?',
    ],
    subtitle: [
      '把排气、机上质量与瞬时加速度放在同一张账上。',
      'Connect expelled gas, onboard mass and instantaneous acceleration.',
    ],
    hook: [
      '有人以为喷气必须向后推空气才能向前。小气瓶在太空喷出自己带的气体，不靠外部空气。气体被向后加速，飞行器受到向前作用；排出去的质量还会改变下一时刻的加速度。',
      'It is tempting to think propulsion must push surrounding air backward. A small cold-gas thruster in space ejects gas carried onboard. Gas is accelerated backward and the craft experiences a forward interaction. Expelled mass also changes the next instant’s acceleration.',
    ],
    prediction: [
      '理想真空、无重力，持续向后喷出自带气体，会？',
      'Ideal vacuum, no gravity, continuously eject onboard gas backward. What happens?',
    ],
    predictions: [
      ['飞行器可向前加速', 'The craft can accelerate forward'],
      ['没有空气所以无推力', 'No air means no thrust'],
      ['质量减少所以必然向后', 'Less mass forces backward motion'],
    ],
    explore: [
      '初质量10 kg、干质量6 kg，比较喷气关闭、q=1 kg/s且相对喷速20 m/s、同q且喷速40 m/s，观察2 s。逐时看机上质量10→8 kg和推力；自由改排气流率。图中的喷气尖角只示意排气方向，不是已排出气体的运动轨迹。',
      'Start with 10 kg and dry mass 6 kg. Compare thruster off, q=1 kg/s with relative exhaust speed 20 m/s, and the same q at 40 m/s over 2 s. Watch onboard mass fall 10→8 kg alongside thrust. Adjust mass flow. The exhaust chevron indicates ejection direction, not a trajectory of gas already released.',
    ],
    concept: [
      '真空不妨碍排出自带质量。忽略喷口压力项时，推力T=qve，其中q是每秒排出质量，ve是相对飞行器的喷速。剩余机上质量m(t)=m0−qt，瞬时a=T/m(t)：相同推力下越轻越容易改变速度。这是开放系统，不可把m的变化忽略后把整段当匀加速。图使用理想无外力火箭关系v=ve ln(m0/m)，作为随质量变化的曲线，不要求先背对数公式。',
      'Vacuum does not prevent ejection of onboard mass. Omitting the nozzle pressure term gives thrust T=qve, where q is expelled mass per second and ve is exhaust speed relative to the craft. Remaining mass is m(t)=m0−qt and instantaneous a=T/m(t): fixed thrust changes velocity faster as mass falls. This is an open system; do not ignore changing mass and assume uniform acceleration. The ideal no-external-force relation v=ve ln(m0/m) generates the curve; first understand its mass dependence rather than memorising logarithms.',
    ],
    formula: [
      'T=qve；m=m0−qt；瞬时a=T/m（本课无重力、无空气阻力）',
      'T=qve; m=m0−qt; instantaneous a=T/m (no gravity or air drag here)',
    ],
    example: [
      'q=1、ve=20给T=20 N。开始m=10、a=2；2 s后m=8、a=2.5，末速度约4.4629 m/s，不是套恒定a=2得到4。同q把ve加到40，推力40 N，质量仍8，末加速度5。关闭喷气的本课初速0组保持静止；若已有速度，关闭后会匀速而非自动停下。',
      'q=1 and ve=20 give T=20 N. Initially m=10 and a=2; at 2 s m=8 and a=2.5, with velocity about 4.4629 m/s rather than 4 from a constant-a assumption. At the same q, ve=40 gives thrust 40 N, the same remaining 8 kg and final a=5. The off group starts at rest and stays there; a craft already moving would coast after shutdown instead of automatically stopping.',
    ],
    misconception: [
      '“推力来自向后推外面的空气”“排气后质量变小，但加速度不变”。自带排出质量即可提供相互作用，质量变化要进入瞬时受力模型。地面火箭还须减去重量和空气作用；本课太空模型不代表发射升空条件。',
      '“Thrust needs surrounding air” and “expelling mass changes nothing about acceleration.” Ejected onboard mass supplies the interaction, and changing mass enters the instantaneous model. A ground launch must also account for weight and air effects; our space model does not give launch conditions.',
    ],
    realWorld: [
      '卫星姿态控制可以用自带冷气，燃烧火箭另携推进剂，不能混同依赖外部进气的普通喷气发动机。燃烧、喷口压强和飞行环境使真实推力更复杂。NASA延伸链接可查看推力与排气的关系。',
      'Satellite control can use stored cold gas; chemical rockets carry propellants. Distinguish these from ordinary air-breathing jet engines. Combustion, nozzle pressure and flight environment make real thrust more complex; the NASA extension explains the exhaust–thrust relation.',
    ],
    summary: [
      '先问排出什么质量，再记剩余质量；真空不等于没有相互作用。',
      'Ask what mass is expelled, then track remaining mass. Vacuum does not mean no interaction.',
    ],
    homeExperiment: [
      '只用纸画飞行器与排气两个对象，标出相反作用；算q=1时0、1、2 s的机上质量、推力和加速度。解释这不是向空气借一个支点，不制作燃烧或加压推进装置。',
      'Use paper to draw craft and gas with opposite interactions. For q=1, calculate onboard mass, thrust and acceleration at 0, 1 and 2 s. Explain why no surrounding-air support is required; use the model instead of building combustion or pressure devices.',
    ],
    vocabulary: [
      ['质量流率', 'Mass flow rate'],
      ['相对喷速', 'Relative exhaust speed'],
      ['推力', 'Thrust'],
      ['开放系统', 'Open system'],
    ],
    questions: [
      [
        'q=1 kg/s、ve=20 m/s，推力？',
        'q=1 kg/s, ve=20 m/s. Thrust?',
        [
          ['1 N', '1 N'],
          ['20 N', '20 N'],
          ['21 N', '21 N'],
        ],
        1,
        '流率乘相对喷速给20 N，单位kg·m/s²。',
        'Mass flow times relative exhaust speed gives 20 N, in kg·m/s².',
      ],
      [
        '初质量10、q=1，2 s后机上质量？',
        'Initial mass 10, q=1. Onboard mass at 2 s?',
        [
          ['8 kg', '8 kg'],
          ['10 kg', '10 kg'],
          ['12 kg', '12 kg'],
        ],
        0,
        '已排出2 kg，仍在机上的8 kg。',
        '2 kg was expelled; 8 kg remains onboard.',
      ],
      [
        '推力20 N、机上质量8 kg，瞬时a？',
        'Thrust 20 N, onboard mass 8 kg. Instantaneous a?',
        [
          ['2 m/s²', '2 m/s²'],
          ['0 m/s²', '0 m/s²'],
          ['2.5 m/s²', '2.5 m/s²'],
        ],
        2,
        '除以当前质量，不是只用初质量。',
        'Divide by current mass, not only initial mass.',
      ],
    ],
    exit: [
      '同推力下速度曲线越来越陡，应先检查什么？',
      'At fixed thrust the velocity curve gets steeper. What do you check first?',
      [
        [
          '机上质量减少，使T/m随时间增大',
          'Onboard mass falls, so T/m increases with time',
        ],
        ['周围空气越推越强', 'Surrounding air pushes harder'],
        [
          '推力与加速度永远相同',
          'Thrust and acceleration are always identical',
        ],
      ],
      0,
      '曲线斜率是加速度，保持单位和瞬时质量。',
      'The curve gradient is acceleration; retain units and instantaneous mass.',
    ],
  }),
];
