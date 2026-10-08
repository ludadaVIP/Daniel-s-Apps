import { t, q, type Lesson } from './schema';
export const machineLessons: Lesson[] = [
  {
    id: 'machines-longer-handle',
    stage: 3,
    unit: 'machines',
    kind: 'machine-lever',
    minutes: 18,
    title: t(
      '同一个盒子，长把手为什么更省力？',
      'Same box: why does a longer handle need less force?',
    ),
    subtitle: t(
      '找支点、看两边，让一根杆成为搬运助手。',
      'Find the pivot and compare the two sides of a lifting bar.',
    ),
    hook: t(
      '撬起一个小盒子，先找杆子绕哪里转，再找手和盒子分别压在哪里。光看杆的总长度，会漏掉最有用的信息。',
      'To lift a small box with a bar, find where the bar pivots, then where the hand and box act. Total bar length alone misses the useful geometry.',
    ),
    prediction: t(
      '盒子重30 N，离支点10 cm。手离支点从10 cm改到40 cm，慢慢抬起同一个盒子，所需力怎样变？',
      'A 30 N box acts 10 cm from the pivot. Move the hand from 10 to 40 cm away. What happens to the force for a slow lift?',
    ),
    predictions: [
      t('变为原来的四分之一', 'It becomes one quarter'),
      t('仍是30 N', 'It stays 30 N'),
      t('变为四倍', 'It becomes four times'),
    ],
    explore: t(
      '完成10、20、40 cm三个把手的受控抬升，载荷侧固定10 cm、30 N，杆从水平转到15°。同时比较手的向下距离和盒子的向上距离；之后自由移动两侧作用点。',
      'Complete controlled lifts with 10, 20 and 40 cm effort arms. Keep the load arm 10 cm and load 30 N; turn the bar from horizontal to 15°. Compare hand descent with box rise, then change the two contact positions.',
    ),
    concept: t(
      '杠杆是绕支点转动的刚性杆。重量在一侧向下，手在另一侧向下，两者有相反转动作用。理想缓慢抬升时，较长的动力侧允许较小的力；代价是手走得更远。支点还要向上托住杆，力的平衡不能只看手与盒子。',
      'A lever is a rigid bar rotating about a pivot. Downward effort and downward load on opposite sides give opposite turning effects. In an ideal slow lift, a longer effort side permits less force at the cost of more hand travel. The pivot also supports the bar, so force balance includes its reaction.',
    ),
    example: t(
      '水平时，30 N×0.10 m=3 N·m。手离0.10、0.20、0.40 m时需要30、15、7.5 N。最后盒子升2.59 cm；手分别降2.59、5.18、10.35 cm，输入与输出功都约0.78 J。杆转动后，两支竖直力的垂直力臂同时乘cosθ，力比仍相同。',
      'Initially 30 N×0.10 m=3 N·m. Effort arms 0.10/0.20/0.40 m need 30/15/7.5 N. The box rises 2.59 cm; the hand descends 2.59/5.18/10.35 cm. Both works are about 0.78 J. As the bar tilts, both vertical-force moment arms include the same cosθ, preserving the force ratio.',
    ),
    misconception: t(
      '长杆不一定省力，关键是支点两侧的作用位置。这个模型忽略杆重、摩擦和加速，抬升由人控制；不是把恰好平衡的杆放开后，它会自动抬起。支点、杆和载荷都需要足够的强度。',
      'A long bar does not automatically reduce effort; contact positions relative to the pivot matter. The model omits bar weight, friction and acceleration, with an operator controlling the lift. A balanced bar does not spontaneously lift when released. Real pivots, bars and loads require adequate strength.',
    ),
    realWorld: t(
      '开瓶器、剪刀、手推车都用杠杆，但支点、动力和阻力的位置不同。手推车的轮轴是支点，货物在轮与手之间，不能照搬本图两侧向下力的布局。',
      'Bottle openers, scissors and wheelbarrows use levers with different pivot/effort/load arrangements. A wheelbarrow pivots about its axle, with cargo between axle and hands; its force layout differs from this two-sided bar.',
    ),
    summary: t(
      '把动力作用点移远，可以用更小的力换更长的移动距离。',
      'Move the effort farther from the pivot to trade less force for more travel.',
    ),
    homeExperiment: t(
      '用尺子、橡皮作支点，抬起装几枚小硬币的纸杯。先固定杯的位置，换手的位置，只抬一点点。画支点与两处作用点；不尝试重物，也不把手感当精确N。',
      'Use a ruler, an eraser pivot and a paper cup holding a few coins. Fix the cup position and change hand position, lifting only slightly. Sketch the pivot and contact points; avoid heavy loads and do not report feel as precise newtons.',
    ),
    formula: t(
      '理想竖直力：F×动力侧距离=W×载荷侧距离；手的功=盒子得到的机械能。',
      'Ideal vertical forces: F×effort-side distance=W×load-side distance; hand work equals the box’s mechanical-energy gain.',
    ),
    vocabulary: [
      t('杠杆', 'lever'),
      t('支点', 'pivot'),
      t('动力', 'effort'),
      t('载荷', 'load'),
    ],
    questions: [
      q(
        '哪一处最先要找到？',
        'What should you locate first?',
        [
          ['杆上最漂亮的地方', 'The prettiest part'],
          ['杆的总长度', 'Total bar length'],
          ['杆绕着转的支点', 'The pivot the bar turns about'],
        ],
        2,
        '作用点的位置要相对支点来量。',
        'Contact distances are measured from the pivot.',
      ),
      q(
        '30 N载荷侧10 cm，动力侧20 cm，需要？',
        '30 N load at 10 cm; effort at 20 cm. Required effort?',
        [
          ['15 N', '15 N'],
          ['60 N', '60 N'],
        ],
        0,
        '动力距离加倍，理想力减半。',
        'Doubling effort distance halves ideal effort.',
      ),
      q(
        '较小的手力换来的代价？',
        'What is the trade-off for smaller effort?',
        [
          ['盒子重量消失', 'The box loses its weight'],
          ['手需要移动更远', 'The hand travels farther'],
        ],
        1,
        '同一次受控抬升中，长侧端点移动得更远。',
        'The longer arm endpoint travels farther during the same controlled lift.',
      ),
    ],
    exit: q(
      '把杯子也移到支点更远处，仍能保证省力更多吗？',
      'If the cup is moved farther from the pivot too, is greater force saving guaranteed?',
      [
        ['能，只看手的位置', 'Yes: only hand position matters'],
        ['不能，需要重新比较两侧距离', 'No: compare both distances again'],
      ],
      1,
      '载荷侧距离增加也增大所需转动作用。',
      'A longer load side also increases the required turning effect.',
    ),
  },
  {
    id: 'machines-turning-direction',
    stage: 3,
    unit: 'machines',
    kind: 'machine-turning',
    minutes: 19,
    title: t(
      '同样的力，为什么沿把手拉不动转轴？',
      'Same force: why does pulling along a handle give no turning effect?',
    ),
    subtitle: t(
      '从门把手和扳手，找到真正的力臂。',
      'Find the true moment arm in a door handle or wrench.',
    ),
    hook: t(
      '推门时，靠近铰链和靠近门把手感觉不同；顺着门板推与垂直推也不同。力的大小只是故事的一半，位置和方向同样重要。',
      'Pushing near a door hinge feels different from pushing near the handle. Pushing along the door also differs from pushing perpendicular to it. Force magnitude is only part of the story; position and direction matter too.',
    ),
    prediction: t(
      '在离转轴20 cm处施加50 N力。垂直把手与沿把手方向，哪种转动作用更大？',
      'Apply 50 N at 20 cm from the axis. Which gives more turning effect: perpendicular to the handle or along it?',
    ),
    predictions: [
      t('垂直把手', 'Perpendicular'),
      t('沿把手', 'Along it'),
      t('一样，因为力相同', 'Equal, because force is equal'),
    ],
    explore: t(
      '完整检查20 cm垂直、10 cm垂直、20 cm沿杆的三组50 N作用。虚线表示力的作用线；支点到它的最短距离才是垂直力臂。再把角度改为30°，看读数。',
      'Inspect 50 N at 20 cm perpendicular, 10 cm perpendicular and 20 cm along the handle. The dashed line is the force line of action; its shortest distance from the pivot is the perpendicular moment arm. Then try 30°.',
    ),
    concept: t(
      '力矩描述力绕指定轴的转动作用，有大小与方向。这里用支点到力作用线的垂直距离乘力。若力的作用线穿过支点，力矩为零，即使力并不为零。连接支点和作用点的距离r，只有力垂直于它时才直接等于力臂。',
      'Torque describes turning effect about a specified axis, with magnitude and direction. Multiply force by perpendicular distance from the pivot to its line of action. A line passing through the pivot gives zero torque even with nonzero force. Pivot-to-contact distance r equals the moment arm only when force is perpendicular.',
    ),
    example: t(
      '50 N在20 cm处垂直拉，力矩10 N·m；移到10 cm，变5 N·m；在20 cm处沿杆拉，变0。20 cm、30°时，垂直力臂为10 cm，也得到5 N·m。模型不据此计算转速。',
      '50 N perpendicular at 20 cm gives 10 N·m; at 10 cm it gives 5 N·m; along the handle at 20 cm it gives zero. At 20 cm and 30°, the perpendicular arm is 10 cm, giving 5 N·m. This model does not derive a rotation speed.',
    ),
    misconception: t(
      '把手长度不是任何方向下的力臂。N·m在这里是力矩单位，不把10 N·m直接说成做了10 J功；做功还需要实际角位移。只比较瞬时作用，不演示“零力矩能让正在转的轮立即停下”。',
      'Handle length is not the moment arm for every force direction. N·m here measures torque; 10 N·m does not directly mean 10 J of work, which also needs angular displacement. These are instantaneous comparisons; zero torque does not instantly stop an already rotating wheel.',
    ),
    realWorld: t(
      '门把手设在远离铰链的位置，让较小的手力产生较大转动作用。扳手也利用这个关系；实际维修需按工具要求，不用教学数据指定螺栓拧紧程度。',
      'Door handles are far from hinges so a modest hand force gives useful turning effect. Wrenches use the same relation; actual repairs need the tool’s requirements rather than teaching numbers for bolt tightness.',
    ),
    summary: t(
      '转动作用取决于力、作用位置和方向；真正的力臂是垂直距离。',
      'Turning effect depends on force, position and direction; the true moment arm is a perpendicular distance.',
    ),
    homeExperiment: t(
      '轻轻推一扇可自由活动的门，比较靠近铰链和门把手的位置，不夹手，不推人。画俯视图、支点与力箭头，并标出力作用线。',
      'Gently push a freely moving door near the hinge and near the handle, keeping fingers clear and never pushing a person. Draw a top view, pivot, force arrow and line of action.',
    ),
    formula: t(
      '力矩=F×垂直力臂；大小τ=Fr sinθ，θ是r与F的夹角。',
      'Torque=F×perpendicular moment arm; magnitude τ=Fr sinθ, with θ between r and F.',
    ),
    vocabulary: [
      t('力矩', 'torque'),
      t('力臂', 'moment arm'),
      t('作用线', 'line of action'),
      t('垂直', 'perpendicular'),
    ],
    questions: [
      q(
        '沿杆施加50 N，作用线穿过转轴，力矩？',
        '50 N acts along a handle through its axis. Torque?',
        [
          ['0 N·m', '0 N·m'],
          ['50 N·m', '50 N·m'],
        ],
        0,
        '垂直距离是零，不是力为零。',
        'Perpendicular distance is zero, not the force.',
      ),
      q(
        '20 cm、50 N、30°得到5 N·m，原因？',
        'Why does 20 cm, 50 N at 30° give 5 N·m?',
        [
          ['重量变小了', 'Weight decreased'],
          ['垂直力臂只有10 cm', 'The perpendicular arm is 10 cm'],
        ],
        1,
        '支点到作用线的距离决定转动作用。',
        'The distance from pivot to line of action determines turning effect.',
      ),
      q(
        '10 N·m力矩一定表示做10 J功？',
        'Does 10 N·m torque necessarily mean 10 J work?',
        [
          ['是，数字一样', 'Yes: same number'],
          [
            '不是，还要知道实际转动角度',
            'No: actual angular displacement is needed',
          ],
        ],
        1,
        '单位写法相似，不代替不同物理量的定义。',
        'Similar written dimensions do not replace the different quantity definitions.',
      ),
    ],
    exit: q(
      '门把手离铰链更远，施力方向却指向铰链，能靠这支力开门吗？',
      'A handle is far from the hinge but the force points toward the hinge. Does that force produce door-opening torque?',
      [
        ['不能，作用线穿过铰链', 'No: its line passes through the hinge'],
        ['能，只要把手足够长', 'Yes: a long enough handle is sufficient'],
      ],
      0,
      '远位置不能补救零垂直力臂。',
      'A distant contact does not rescue zero perpendicular moment arm.',
    ),
  },
  {
    id: 'machines-rope-and-pulleys',
    stage: 3,
    unit: 'machines',
    kind: 'machine-pulley',
    minutes: 20,
    title: t(
      '多一个滑轮，就一定省一半力吗？',
      'Does adding a pulley always halve the force?',
    ),
    subtitle: t(
      '数托住活动部分的绳段，而不是数轮子。',
      'Count rope strands supporting the moving assembly, not wheels.',
    ),
    hook: t(
      '升旗时向下拉绳，旗却向上走。一个固定滑轮先帮我们换方向；能不能省力，要进一步看哪些绳段正在托着载荷。',
      'Pull down on a flag rope and the flag rises. A fixed pulley first changes direction. Force saving depends on which rope strands support the load.',
    ),
    prediction: t(
      '理想绳轮抬40 N载荷，1、2、4段绳托住活动部分，哪种手力最小？',
      'An ideal hoist lifts 40 N with 1, 2 or 4 supporting strands. Which needs least effort?',
    ),
    predictions: [
      t('4段', '4 strands'),
      t('1段', '1 strand'),
      t('数所有轮子就能决定', 'Count all wheels to decide'),
    ],
    explore: t(
      '完整拉绳抬升1、2、4段承重绳的三种装置。载荷都升0.25 m；注意固定轮与活动轮，以及自由绳端向下走了多远。四段模型是两个活动轮连成一组，不把额外转向轮当承重加倍。',
      'Run all three hoists with 1, 2 and 4 supporting strands. Each lifts the load 0.25 m. Watch fixed versus moving wheels and free-end descent. In the four-strand block, two moving wheels form one assembly; redirecting wheels do not themselves double support.',
    ),
    concept: t(
      '固定轮的轴不随载荷移动，主要改变拉力方向。活动轮与载荷一起移动，多段绳共同支持它。理想轻绳在无摩擦轻轮上张力相同；n段竖直绳的向上作用合为nT，缓慢抬升时平衡重量。手拉绳的力是T，拉距是抬升高度的n倍。',
      'A fixed pulley’s axis stays in place and mainly redirects effort. A moving pulley travels with the load, supported by several strands. Ideal light rope over frictionless light wheels has equal tension. n vertical strands give nT upward, balancing weight in a slow lift. Effort is T and pull distance is n times lift height.',
    ),
    example: t(
      '40 N载荷升0.25 m：1段需要40 N、拉0.25 m；2段20 N、拉0.50 m；4段10 N、拉1.00 m。每种输入功都是10 J。两个活动轮与载荷组成同一个被托的活动部分。',
      'For a 40 N load rising 0.25 m: 1 strand needs 40 N and 0.25 m pull; 2 need 20 N and 0.50 m; 4 need 10 N and 1.00 m. Each input is 10 J. Both moving wheels and load belong to one supported assembly.',
    ),
    misconception: t(
      '机械优势不等于画面中的轮子总数。绳的固定端若连在活动部分、绳段若倾斜，计数和受力需要重新分析。本模型固定端在天花板，承重绳竖直，忽略轮和绳的重量、摩擦、伸长及加速。',
      'Mechanical advantage is not total visible wheel count. A rope end attached to the moving assembly or angled supporting strands needs a fresh force analysis. Here the rope anchors to the ceiling; supporting strands are vertical, and wheel/rope weight, friction, stretch and acceleration are omitted.',
    ),
    realWorld: t(
      '窗帘绳和升旗绳可以只改变方向；舞台和起吊装置可能用滑轮组分担载荷。真实装置还要考虑活动轮重量、摩擦和固定点承力。',
      'Curtain or flag ropes may simply redirect effort. Stage rigging and lifting systems may use blocks to share load. Real designs must also account for moving-wheel weight, friction and anchor forces.',
    ),
    summary: t(
      '数支持活动部分的绳段：理想情况下越多段，力越小，拉绳越长。',
      'Count strands supporting the moving assembly: ideally more strands mean less force and more rope travel.',
    ),
    homeExperiment: t(
      '在屏幕图上用不同颜色描出每一段承重绳，圈出会随载荷移动的轮和连接杆。不悬吊重物；可用线与纸片模拟路线，不把线勒在手指上。',
      'Trace each supporting strand in a different colour on the screen diagram and circle the moving wheels/connectors. Avoid suspended heavy loads; model the route with thread and paper without wrapping thread tightly around fingers.',
    ),
    formula: t(
      '理想竖直承重绳：F=W/n；拉距s=n×抬高h。',
      'Ideal vertical support strands: F=W/n; pull distance s=n×lift h.',
    ),
    vocabulary: [
      t('定滑轮', 'fixed pulley'),
      t('动滑轮', 'moving pulley'),
      t('张力', 'tension'),
      t('承重绳段', 'supporting strand'),
    ],
    questions: [
      q(
        '一个定滑轮在理想条件下抬40 N，手力？',
        'An ideal single fixed pulley lifts 40 N. Effort?',
        [
          ['20 N', '20 N'],
          ['40 N', '40 N'],
        ],
        1,
        '一段绳托载荷；换方向不自动省力。',
        'One strand supports the load; redirecting does not automatically save force.',
      ),
      q(
        '4段承重绳、载荷40 N，需要？',
        '4 supporting strands lift 40 N. Required effort?',
        [
          ['10 N', '10 N'],
          ['160 N', '160 N'],
        ],
        0,
        '四份相同张力合成40 N。',
        'Four equal tensions total 40 N.',
      ),
      q(
        '2段模型抬高0.25 m，自由端要拉？',
        'A 2-strand hoist lifts 0.25 m. How far is the free end pulled?',
        [
          ['0.125 m', '0.125 m'],
          ['0.50 m', '0.50 m'],
        ],
        1,
        '两段同时缩短，需要自由端多移动。',
        'Two strands shorten together, requiring more free-end travel.',
      ),
    ],
    exit: q(
      '再加一个只改变拉绳方向的固定轮，会自动减半手力吗？',
      'Does adding one fixed wheel solely to redirect effort automatically halve the force?',
      [
        [
          '不会，需要看支持活动部分的绳段是否增加',
          'No: check whether supporting strands increased',
        ],
        ['会，每多一轮都减半', 'Yes: every extra wheel halves it'],
      ],
      0,
      '转向与分担载荷是不同作用。',
      'Redirecting effort and sharing load are different roles.',
    ),
  },
  {
    id: 'machines-gears-trade-speed',
    stage: 3,
    unit: 'machines',
    kind: 'machine-gears',
    minutes: 20,
    title: t(
      '小齿轮带大齿轮，快慢与转动作用怎样交换？',
      'Small gear drives big gear: how do speed and torque trade?',
    ),
    subtitle: t(
      '同一处咬合，数齿、数圈、看方向。',
      'At one mesh, count teeth and turns and watch direction.',
    ),
    hook: t(
      '手摇玩具里，两只齿轮咬合着转。小轮的一颗齿经过接触处，大轮也必须让出一颗齿；这个小约束就能解释快慢交换。',
      'Two gears mesh inside a hand-cranked toy. When one tooth of the small gear passes the contact, the large gear must pass one too. That small constraint explains their speed trade.',
    ),
    prediction: t(
      '12齿输入轮带24齿输出轮，输入转一圈，输出怎样转？',
      'A 12-tooth input drives a 24-tooth output. What happens for one input revolution?',
    ),
    predictions: [
      t('反向半圈', 'Half a turn in the opposite direction'),
      t('同向两圈', 'Two turns in the same direction'),
      t('反向两圈', 'Two turns in the opposite direction'),
    ],
    explore: t(
      '输入轮固定12齿、6转/分、2 N·m，完成12、24、36齿输出轮的各一次演示。点标记帮助数圈；两只外啮合齿轮方向相反。每次演示一输入圈，播放时长不是6转/分的真实计时。',
      'Fix input at 12 teeth, 6 rpm and 2 N·m; run outputs of 12, 24 and 36 teeth. Dot markers help count turns. External gears turn in opposite directions. Each run shows one input revolution; playback duration is not a real 6 rpm clock.',
    ),
    concept: t(
      '同齿距、固定轴且不跳齿时，经过接触处的齿数一致。输出齿越多，每一输入圈对应的输出圈数越少。理想稳定传动中，较慢的输出可提供较大的力矩；输入与输出功率相同，不能同时凭空增加转速和力矩。',
      'With equal tooth pitch, fixed axes and no skipped teeth, both gears pass the same tooth count through the mesh. More output teeth mean fewer output turns per input turn. Ideal steady transmission gives more torque at lower output speed, with equal input/output power; speed and torque cannot both grow freely.',
    ),
    example: t(
      '12齿输入6转/分、2 N·m：输出12齿为反向6转/分、2 N·m；24齿为反向3转/分、4 N·m；36齿为反向2转/分、6 N·m。一输入圈对应反向1、1/2、1/3圈，理想功率都约1.26 W。',
      'Input 12 teeth at 6 rpm and 2 N·m gives outputs: 12 teeth, opposite 6 rpm and 2 N·m; 24 teeth, opposite 3 rpm and 4 N·m; 36 teeth, opposite 2 rpm and 6 N·m. One input turn gives opposite 1, 1/2 or 1/3 turns. Ideal power stays about 1.26 W.',
    ),
    misconception: t(
      '大小轮咬合并非总朝同方向。这里是两只外啮合轮，不是同轴轮或内齿轮；链条传动的方向关系也不同。齿形示意不是制造图，不计算启动加速、摩擦、齿强度或电机控制；输出力矩是理想稳定传动的幅值。',
      'Meshing gears do not always turn together. These are two external gears, not coaxial or internal gears; chain drives have a different direction relation too. Illustrated teeth are not manufacturing geometry. Startup acceleration, friction, tooth strength and motor control are omitted; output torque is an ideal steady-transfer magnitude.',
    ),
    realWorld: t(
      '手摇玩具与减速箱用齿轮交换转速和力矩。自行车的链轮也有齿数比，但由链条连接，不直接外啮合，所以不能套用本图相反方向结论。',
      'Hand-cranked toys and gearboxes exchange speed and torque through gearing. Bicycle sprockets also have tooth ratios but connect through a chain rather than direct external meshing, so the opposite-direction rule here does not apply.',
    ),
    summary: t(
      '同样数齿通过接触处：输出齿越多，转得越慢，理想力矩越大。',
      'The same tooth count passes the mesh: more output teeth give slower turning and greater ideal torque.',
    ),
    homeExperiment: t(
      '观察可见齿轮的安全玩具，先停住，数齿并标输入/输出，再轻轻手摇。没有玩具就用屏幕标记数圈；不拆电动设备、不把手指伸进咬合处。',
      'Observe an accessible safe geared toy. Stop first, count teeth and identify input/output, then crank gently. Without a toy, count the screen markers. Do not dismantle powered devices or put fingers into a mesh.',
    ),
    formula: t(
      '输出转速大小/输入转速=输入齿数/输出齿数；理想力矩比相反。',
      'Output/input speed magnitude=input/output tooth count; the ideal torque ratio is reciprocal.',
    ),
    vocabulary: [
      t('齿轮', 'gear'),
      t('啮合', 'mesh'),
      t('转速', 'rotation rate'),
      t('力矩', 'torque'),
    ],
    questions: [
      q(
        '12齿带36齿，一输入圈对应输出？',
        '12 teeth drive 36 teeth. Output per input turn?',
        [
          ['反向三圈', 'Three opposite turns'],
          ['反向三分之一圈', 'One third of an opposite turn'],
        ],
        1,
        '通过12齿，只占36齿的一圈三分之一。',
        'Passing 12 teeth is one third of a 36-tooth revolution.',
      ),
      q(
        '理想降速后，更大的输出力矩是否免费增加功率？',
        'Does greater torque after ideal speed reduction add power for free?',
        [
          ['不会，转速同时减小', 'No: speed decreases too'],
          ['会，齿越多能量越多', 'Yes: more teeth make more energy'],
        ],
        0,
        '力矩乘角速度的功率保持。',
        'Torque times angular speed remains the same power.',
      ),
      q(
        '能把这两轮反向结论直接用于自行车链轮吗？',
        'Can the opposite-direction rule here be applied directly to bicycle sprockets?',
        [
          ['能，都有齿', 'Yes: both have teeth'],
          ['不能，链传动的连接方式不同', 'No: the chain connection differs'],
        ],
        1,
        '必须看实际连接方式。',
        'Inspect the actual connection.',
      ),
    ],
    exit: q(
      '玩具输出太快，希望更慢且理想力矩更大，选哪个输出轮？',
      'A toy output is too fast. Which output gear slows it and increases ideal torque?',
      [
        [
          '保持12齿输入，改36齿输出',
          'Keep 12-tooth input and use 36-tooth output',
        ],
        [
          '保持12齿输入，改6齿输出',
          'Keep 12-tooth input and use 6-tooth output',
        ],
      ],
      0,
      '大输出轮交换速度与力矩，而非制造能量。',
      'A larger output trades speed for torque rather than creating energy.',
    ),
  },
  {
    id: 'machines-force-distance-bargain',
    stage: 3,
    unit: 'machines',
    kind: 'machine-advantage',
    minutes: 19,
    title: t(
      '省了四分之三的力，为什么没有省功？',
      'Why does saving three quarters of the force not save work?',
    ),
    subtitle: t(
      '把力和距离写进同一张账本。',
      'Put force and distance in the same ledger.',
    ),
    hook: t(
      '帮人把盒子抬上架子，手力小会更容易操作。但若只看力表、不看绳子拉了多远，会误以为机械给我们免费能量。',
      'Smaller effort helps when lifting a box onto a shelf. But watching only force and ignoring rope travel can make the machine seem to provide free energy.',
    ),
    prediction: t(
      '40 N盒子升0.25 m，理想四段绳装置只需10 N。输入功会少于10 J吗？',
      'A 40 N box rises 0.25 m. An ideal four-strand hoist needs only 10 N. Is input work less than 10 J?',
    ),
    predictions: [
      t('不会，因为要拉1 m', 'No: the rope must be pulled 1 m'),
      t('会，只做2.5 J', 'Yes: only 2.5 J'),
      t('盒子升得越高越省功', 'A higher lift saves more work'),
    ],
    explore: t(
      '完整完成机械优势1、2、4的三种理想抬升。每次实际拉距、抬高与能量条同步变化；同一标尺上比较输入功和输出功。自由改变目标高度，必须重新计算功。',
      'Complete ideal lifts with advantages 1, 2 and 4. Pull distance, height and energy bars update together. Compare input and output work on one scale, then change target height and recalculate work.',
    ),
    concept: t(
      '机械优势是输出载荷力与输入动力之比。理想装置中，力的增益来自距离的交换；载荷提高h需要得到Wh机械能，输入F×s也必须相同。低一点的输入力可以匹配我们的身体，但不让同一盒子升到同一高度所需能量消失。',
      'Mechanical advantage is output load force divided by input effort. Ideally force gain comes from a distance trade. Raising the load by h needs Wh mechanical energy, matched by input F×s. Lower effort can fit our abilities without removing energy needed for the same lift.',
    ),
    example: t(
      '机械优势4：40 N/10 N=4；盒子升0.25 m，手拉1.00 m，10 N×1 m=10 J，输出40 N×0.25 m=10 J。机械优势2时20 N×0.50 m同样10 J。若目标高度改0.50 m，两种功都增到20 J。',
      'Advantage 4 means 40 N/10 N=4. A 0.25 m lift needs 1.00 m pull: 10 N×1 m=10 J, matching 40 N×0.25 m=10 J. Advantage 2 gives 20 N×0.50 m=10 J too. At 0.50 m target height, both works increase to 20 J.',
    ),
    misconception: t(
      '机械优势与效率不是同一个数：优势4不是400%效率。优势比较力，效率比较有用输出能量与输入能量。这里的功是沿力方向移动的功，不用任意手的路程代替实际拉绳距离。',
      'Mechanical advantage and efficiency differ: advantage 4 is not 400% efficiency. Advantage compares forces; efficiency compares useful output and input energy. Work here uses movement along the force, not an arbitrary hand path substituted for rope pull.',
    ),
    realWorld: t(
      '坡道、杠杆、滑轮都能把较大的力需求换成长一些的移动过程。轮椅坡道需要空间，长把手需要行程，滑轮组需要更多绳子，都是实际的设计约束。',
      'Ramps, levers and pulleys trade force requirements for longer movement. A wheelchair ramp needs space, a long lever needs stroke room and a pulley block needs more rope: practical design constraints.',
    ),
    summary: t(
      '省力可以帮人完成任务；理想机械用更多距离来换，不能省去任务所需功。',
      'Force saving helps with a task; an ideal machine trades more distance and does not remove the work required.',
    ),
    homeExperiment: t(
      '画三张“把同一盒子抬同一高度”的方案卡，写40×0.25、20×0.50、10×1.00，标N和m再算J。解释哪种适合手力小、哪种需要更多操作空间。',
      'Draw three plans lifting the same box to the same height. Write 40×0.25, 20×0.50 and 10×1.00 with N and m, then calculate J. Explain which suits limited effort and which needs more operating space.',
    ),
    formula: t(
      '机械优势=W/F；理想情况下F×s=W×h，s/h=机械优势。',
      'Mechanical advantage=W/F; ideally F×s=W×h and s/h=mechanical advantage.',
    ),
    vocabulary: [
      t('机械优势', 'mechanical advantage'),
      t('输入功', 'input work'),
      t('输出功', 'output work'),
      t('行程', 'travel'),
    ],
    questions: [
      q(
        '优势4意味着？',
        'What does advantage 4 mean?',
        [
          ['输出力是输入力的四倍', 'Output force is four times input effort'],
          ['效率400%', 'Efficiency is 400%'],
        ],
        0,
        '力比不是能量比。',
        'A force ratio is not an energy ratio.',
      ),
      q(
        '10 N力沿方向拉1 m，输入功？',
        '10 N acts through 1 m along its direction. Input work?',
        [
          ['1 J', '1 J'],
          ['10 J', '10 J'],
        ],
        1,
        '功=力乘沿力方向的距离。',
        'Work is force times travel along its direction.',
      ),
      q(
        '抬同盒到同高度，理想装置中输入功如何？',
        'For the same box and lift height, ideal input work?',
        [
          ['优势越大，功越小', 'Greater advantage means less work'],
          ['相同，力与距离互相补偿', 'The same: force and distance compensate'],
        ],
        1,
        '相同输出机械能需要相同理想输入。',
        'The same mechanical output needs the same ideal input.',
      ),
    ],
    exit: q(
      '只有0.60 m拉绳空间，四段装置能一次把盒子升0.25 m吗？',
      'With only 0.60 m rope-pull space, can a four-strand hoist lift 0.25 m in one stroke?',
      [
        ['能，手力已经变小', 'Yes: effort is smaller'],
        [
          '不能，这个装置一次需要1.00 m拉距',
          'No: this hoist needs 1.00 m pull',
        ],
      ],
      1,
      '省力方案还需要足够行程；换设计或分步操作需重新分析。',
      'Force-saving designs also need travel; another design or staged operation needs fresh analysis.',
    ),
  },
  {
    id: 'machines-friction-energy-ledger',
    stage: 3,
    unit: 'machines',
    kind: 'machine-real',
    minutes: 20,
    title: t(
      '真实滑轮，为什么比理想模型更费力？',
      'Why does a real pulley need more effort than the ideal model?',
    ),
    subtitle: t(
      '把摩擦、输入功与有用输出放进同一本账。',
      'Include friction, input work and useful output in one ledger.',
    ),
    hook: t(
      '同样的滑轮路线，旧轮轴可能更难拉。多花的能量没有让盒子自动变重，也没有凭空消失：要追踪它去了哪里。',
      'The same rope route may be harder to pull with a worn axle. Extra energy does not make the box heavier or vanish; track its destination.',
    ),
    prediction: t(
      '两段承重绳抬40 N盒子0.25 m，效率从100%改80%，实际输入功与手力怎样变？',
      'A two-strand hoist lifts 40 N through 0.25 m. At 80% rather than 100% efficiency, what happens to input work and effort?',
    ),
    predictions: [
      t('都增加', 'Both increase'),
      t('都减少', 'Both decrease'),
      t('输出功自动增加', 'Output work automatically increases'),
    ],
    explore: t(
      '在相同两段绳、40 N、0.25 m任务下，完整比较100%、80%、50%三种规定效率。拉距都0.50 m，能量条分出有用输出与额外转移；再自由改效率，看实际力比。',
      'For the same two strands, 40 N and 0.25 m task, compare assigned efficiencies 100%, 80% and 50%. Pull stays 0.50 m; energy bars separate useful output from other transfers. Then change efficiency and inspect actual force advantage.',
    ),
    concept: t(
      '效率是有用输出能量除以输入能量。这个缓慢抬升模型把轮轴/绳轮损耗合并为规定效率，输入功=输出功/η。差额表示在任务边界下未成为载荷升高机械能的部分，主要转成机器与环境的内能；能量总账仍守恒。',
      'Efficiency is useful output energy divided by input energy. This slow-lift model combines axle/rope-wheel losses into an assigned efficiency: input work=output work/η. The difference is energy not becoming load-rise mechanical energy at the task boundary, mainly transferred to internal energy of machinery and surroundings; the full energy ledger still balances.',
    ),
    example: t(
      '输出都40×0.25=10 J。100%时输入10 J、手力20 N；80%时输入12.5 J、手力25 N、差额2.5 J；50%时输入20 J、手力40 N、差额10 J。几何拉距比仍是2，但实际力优势分别2、1.6、1。',
      'Output is always 40×0.25=10 J. At 100%: 10 J input and 20 N effort. At 80%: 12.5 J input, 25 N effort and 2.5 J difference. At 50%: 20 J input, 40 N effort and 10 J difference. The geometric travel ratio stays 2 while actual force advantages are 2, 1.6 and 1.',
    ),
    misconception: t(
      '两段承重绳不保证真实手力就是重量一半；有摩擦时各段张力未必相同。效率由此模型规定，不是从图中的材料或转速预测的。图只标输入拉力与载荷重量，没有画齐各绳段、轮轴和固定点的受力；不能当完整受力图。',
      'Two supporting strands do not guarantee real effort equals half the load; friction can make strand tensions unequal. Efficiency is assigned, not predicted from pictured materials or speed. The diagram labels effort and load weight but omits individual strand, axle and anchor forces; it is not a complete force diagram.',
    ),
    realWorld: t(
      '保养轮轴、合适的绳轮配合能减少一些损耗，但工具还需要可靠固定与强度。效率高不等于安全载荷高，也不能据教学模型选真实起吊装置。',
      'Axle maintenance and suitable rope/wheel matching can reduce some losses, while reliable anchors and strength remain necessary. High efficiency is not a high safe-load rating, and this model does not select real lifting equipment.',
    ),
    summary: t(
      '真实机械的有用输出少于输入；力优势受几何与损耗共同影响。',
      'Real machines have useful output below input; force advantage depends on geometry and losses together.',
    ),
    homeExperiment: t(
      '先用屏幕三组数据画能量账本：输入=盒子升高所得+其他转移。再观察一个安全手摇玩具是否有明显摩擦，记录现象，不把声音或手感换成未经测量的效率百分比。',
      'Draw ledgers from the three screen cases: input=box-rise gain+other transfers. Observe friction in a safe hand-cranked toy and record what you see; sound or feel alone does not measure efficiency.',
    ),
    formula: t(
      'η=有用输出功/输入功；规定抬升模型F=W/(nη)，实际力优势=nη。',
      'η=useful output work/input work; prescribed lift model F=W/(nη), actual force advantage=nη.',
    ),
    vocabulary: [
      t('效率', 'efficiency'),
      t('摩擦损耗', 'frictional loss'),
      t('任务边界', 'task boundary'),
      t('内能', 'internal energy'),
    ],
    questions: [
      q(
        '效率80%、有用输出10 J，输入？',
        '80% efficiency with 10 J useful output. Input?',
        [
          ['8 J', '8 J'],
          ['12.5 J', '12.5 J'],
        ],
        1,
        '10/0.8=12.5，不能把输出再乘效率。',
        '10/0.8=12.5; do not multiply output by efficiency again.',
      ),
      q(
        '输入12.5 J、输出10 J，差额去了哪里？',
        '12.5 J input and 10 J useful output. Where does the difference go?',
        [
          ['在全系统中消失', 'It vanishes from the full system'],
          [
            '在任务边界外的其他转移，如内能增加',
            'Other transfers beyond useful output, such as internal-energy gain',
          ],
        ],
        1,
        '不是能量消失，是用途与边界不同。',
        'Energy does not vanish; useful purpose and boundary differ.',
      ),
      q(
        '两段绳、效率50%，40 N载荷的实际力优势？',
        'Two strands, 50% efficiency, 40 N load. Actual force advantage?',
        [
          ['1，手力也是40 N', '1: effort is also 40 N'],
          ['2，只数绳段就够了', '2: count strands only'],
        ],
        0,
        'nη=2×0.5=1。',
        'nη=2×0.5=1.',
      ),
    ],
    exit: q(
      '滑轮拉不动，换成更多承重绳就能保证真实装置安全省力吗？',
      'If a hoist is difficult to pull, do more strands guarantee safe force saving?',
      [
        [
          '不能，还要检查损耗、行程、固定与强度',
          'No: also check losses, travel, anchors and strength',
        ],
        ['能，轮子越多任何载荷都能抬', 'Yes: more wheels lift any load'],
      ],
      0,
      '机械优势不是无限强度或安全承诺。',
      'Mechanical advantage is not unlimited strength or a safety guarantee.',
    ),
  },
];
