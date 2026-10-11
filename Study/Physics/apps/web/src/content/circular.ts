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
  unit: 'circular',
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
export const circularLessons: Lesson[] = [
  make({
    id: 'circular-one-lap-two-ledgers',
    kind: 'circular-path',
    minutes: 20,
    title: [
      '绕回起点，为什么路程还在增加？',
      'Back at the start: why does distance keep growing?',
    ],
    subtitle: [
      '用一个圆连接路程、位移、周期与频率。',
      'Connect distance, displacement, period and frequency with one circle.',
    ],
    hook: [
      '想象一辆小火车绕着圆形轨道跑。它回到车站，里程表会清零吗？如果把圆扩大一倍，却保持同样的速率，一圈需要多久？今天用同一个时钟看三种圆周运动。',
      'Imagine a toy train on a circular track. Back at the station, does its distance counter reset? Double the circle while keeping speed: how long will a lap take? Watch three circular motions on one clock.',
    ],
    prediction: [
      '速率相同，半径由1变2 m，一圈用时？',
      'Same speed, radius rises from 1 to 2 m. Time per lap?',
    ],
    predictions: [
      ['减半', 'Half'],
      ['不变', 'Unchanged'],
      ['两倍', 'Double'],
    ],
    explore: [
      '完整比较r=1,v=1；r=2,v=1；r=2,v=2，单位m与m/s。每次观察2π s，先数圈，再比路程和位移大小。自由半径试0.75与2.5 m：观察时长不变，但不一定恰好一圈。',
      'Compare r=1,v=1; r=2,v=1; r=2,v=2 in metres and m/s. Each window lasts 2π s. Count laps, then compare distance and displacement. Try free radii 0.75 and 2.5 m: the fixed time need not finish exactly one lap.',
    ],
    concept: [
      '匀速圆周运动指沿圆轨道、速率不变；“匀速”不表示速度方向不变。一圈路程是周长2πr，所以周期T=2πr/v。频率f=1/T表示每秒圈数，单位Hz。路程沿轨迹累计；位移是起点到当前点的向量，它的大小是弦长，回到起点时为0。',
      'Uniform circular motion follows a circle at constant speed, while velocity direction changes. One lap covers circumference 2πr, so period T=2πr/v. Frequency f=1/T counts laps per second in Hz. Distance accumulates along the path; displacement joins start to current position, with magnitude equal to the chord and zero after a full return.',
    ],
    formula: ['T=2πr/v；f=1/T；路程s=vt', 'T=2πr/v; f=1/T; distance s=vt'],
    example: [
      '观察约6.283 s。第一辆走一圈，路程约6.283 m、位移0；第二辆只走半圈，路程仍6.283 m、位移大小4 m；第三辆走一圈，路程约12.566 m、位移0。前后两辆周期相同，中间那辆周期两倍。',
      'Over about 6.283 s, the first completes one lap: distance 6.283 m and zero displacement. The second completes half a lap: the same distance but displacement magnitude 4 m. The third completes one lap: distance 12.566 m and zero displacement. First and third share a period; the second takes twice as long per lap.',
    ],
    misconception: [
      '“回到起点，什么运动量都为0。”位移为0，累计路程不为0；此时车也仍有速度与加速度。不同半径上的车，圈数相同不表示路程相同。',
      '“Back at the start, every motion quantity is zero.” Displacement is zero, but distance is not; velocity and acceleration still exist. Equal lap counts on different radii do not mean equal distances.',
    ],
    realWorld: [
      '操场跑圈、钟表指针和唱片上的标记都能比较周期。唱片内外两点转一圈用时相同，但外侧路程更长、速率更大；这和保持速率不变只改半径是不同条件。',
      'Track laps, clock hands and marks on a record all have periods. Inner and outer marks on one record share the same lap time; the outer mark travels farther and faster. Those conditions differ from changing radius at fixed speed.',
    ],
    summary: [
      '先问固定的是速率还是周期；把绕了多远与离起点多远分开。',
      'Ask whether speed or period is fixed; separate distance travelled from distance away from the start.',
    ],
    homeExperiment: [
      '画半径1格与2格的圆，各画四分之一圈；用线段画从起点到终点的位移。解释同样一圈与同样时间为什么是两种比较。',
      'Draw circles of radii one and two grid squares and trace a quarter lap on each. Draw displacement as a straight chord. Explain why equal laps and equal times are different comparisons.',
    ],
    vocabulary: [
      ['圆周运动', 'Circular motion'],
      ['周期', 'Period'],
      ['频率', 'Frequency'],
      ['弦长', 'Chord length'],
    ],
    questions: [
      [
        '同速，半径翻倍，周期？',
        'Same speed, double radius. Period?',
        [
          ['不变', 'Unchanged'],
          ['翻倍', 'Doubles'],
          ['减半', 'Halves'],
        ],
        1,
        '周长翻倍，同速需要两倍时间。',
        'Twice the circumference at equal speed needs twice the time.',
      ],
      [
        '周期2 s，频率？',
        'Period 2 s. Frequency?',
        [
          ['0.5 Hz', '0.5 Hz'],
          ['2 Hz', '2 Hz'],
          ['4 Hz', '4 Hz'],
        ],
        0,
        'f=1/2，每秒半圈。',
        'f=1/2: half a lap per second.',
      ],
      [
        '绕一整圈回起点，哪个一定为0？',
        'After one full return, which must be zero?',
        [
          ['路程', 'Distance'],
          ['速率', 'Speed'],
          ['位移', 'Displacement'],
        ],
        2,
        '起点与终点相同，但路程是一圈周长。',
        'Same start and finish, but distance equals the circumference.',
      ],
    ],
    exit: [
      '同样时间，两车都回起点，为何路程可以不同？',
      'Why can two carts return to their starts in the same time but travel different distances?',
      [
        [
          '轨道半径不同，周长可不同；回起点只说明位移0',
          'Different radii can mean different circumferences; returning only gives zero displacement',
        ],
        ['圆周长都相同', 'All circles have equal circumference'],
        ['回起点会删除路程', 'Returning deletes distance'],
      ],
      0,
      '比较路程还需要轨道尺度。',
      'Distance comparisons also require track scale.',
    ],
  }),
  make({
    id: 'circular-release-along-tangent',
    kind: 'circular-tangent',
    minutes: 21,
    title: [
      '绳子放开，小球沿半径飞走吗？',
      'Release the string: does the ball leave radially?',
    ],
    subtitle: [
      '沿切线读速度，把撤去的力与保留的运动分开。',
      'Read tangent velocity and separate removed force from retained motion.',
    ],
    hook: [
      '把绕圈的小球想成动画里的一个点。暂停在最上方：它下一瞬间往哪里走？若把绳拉力撤去，小球并不会突然学会一个新的方向，它保留的是那一刻的速度。',
      'Picture a circling ball as an animated point. Pause at the top: where does it move next? Removing tension does not give it a new direction; it retains its velocity at that instant.',
    ],
    prediction: [
      '光滑水平面上，圆的最上方撤去绳拉力，原来逆时针运动，接着朝哪里走？',
      'On a smooth horizontal plane, remove tension at the top during anticlockwise motion. What next?',
    ],
    predictions: [
      ['向上，沿半径', 'Upward, radially'],
      ['立刻停下', 'Stop immediately'],
      ['向左，沿切线', 'Leftward, tangentially'],
    ],
    explore: [
      '比较逆时针、顺时针和四分之一圈时放开。看初始v、当前v和Δv的分量图；第三次在50%前后检查，加速度会从向内变成0，而速度方向连续。自由速率改变后，释放地点仍相同。',
      'Compare anticlockwise, clockwise and quarter-lap release. Read initial v, current v and Δv components. Inspect just before and after 50% in the release case: acceleration changes from inward to zero while velocity stays continuous. Free speed changes preserve the release location.',
    ],
    concept: [
      '速度沿轨迹的切线，不指向圆心。绳拉力不断改变速度方向，让运动沿圆；撤去后，光滑水平模型合力0，保持释放时的速度匀速直线走。地面参考系里不需要再添一个向外力。若释放发生在真实空间而非桌面，重力仍会让后续轨迹弯曲，本课把它用支持力抵消。',
      'Velocity is tangent to the path, not toward the centre. Tension continually changes its direction to keep circular motion. Once removed on a smooth horizontal table, net force is zero and the release velocity continues in a straight line. No extra outward force is needed in the ground frame. Without the table, gravity would still curve the later path; support cancels it here.',
    ],
    formula: [
      'v沿切线；撤去绳拉力后ΣF=0、a=0，v保留',
      'v is tangent; after tension removal ΣF=0 and a=0, with v retained',
    ],
    example: [
      'r=2 m、v=1 m/s，起点在圆最右侧，逆时针初始v=(0,+1)。到顶端v=(−1,0)。放开后走向左，y保持2 m；同样观察时长内位置到约(−3.142,2) m，速率仍1 m/s。',
      'For r=2 m and speed 1 m/s, start at the rightmost point anticlockwise with v=(0,+1). At the top v=(−1,0). Released motion goes left with y=2 m; by the window’s end it reaches about (−3.142,2) m, still at speed 1 m/s.',
    ],
    misconception: [
      '“向内的力消失，就会出现向外的力。”消失的是方向持续改变的原因；速度不是力。图上的Δv也不是第三个真实小球的速度，而是两次速度向量的差。',
      '“Removing inward force creates outward force.” What disappears is the cause of continued direction change. Velocity is not force. Δv in the diagram is the difference between two velocity vectors, not a third ball’s velocity.',
    ],
    realWorld: [
      '磨削或旋转工具甩出的碎屑，最初可用切线方向理解，随后还受重力和空气作用。沿切线离开是运动连续性的结果，不是凭空多了一次推力。',
      'Debris leaving a rotating tool initially follows its tangent, then responds to gravity and air. Tangential departure follows continuity of motion, without a new push.',
    ],
    summary: [
      '暂停时找切线；放开后先保留速度，再检查还有哪些力。',
      'Find the tangent at the pause; retain velocity on release, then check remaining forces.',
    ],
    homeExperiment: [
      '画一个圆，在右、上、左三处画逆时针速度箭头。擦掉顶端的绳线，延长顶端切线；再改为顺时针，说明哪支箭头反向。',
      'Draw a circle with anticlockwise velocity arrows at right, top and left. Erase the string at the top and extend the tangent. Reverse rotation and explain which arrows reverse.',
    ],
    vocabulary: [
      ['切线', 'Tangent'],
      ['速度方向', 'Velocity direction'],
      ['释放瞬间', 'Release instant'],
      ['惯性', 'Inertia'],
    ],
    questions: [
      [
        '圆最右端逆时针运动，速度方向？',
        'Anticlockwise at the rightmost point. Velocity direction?',
        [
          ['向左', 'Left'],
          ['向右', 'Right'],
          ['向上', 'Up'],
        ],
        2,
        '沿切线向上，不沿半径。',
        'Up along the tangent, not radially.',
      ],
      [
        '放开后水平合力0，速度？',
        'After release with zero horizontal net force, velocity?',
        [
          ['保留当时值', 'Keeps its release value'],
          ['必为0', 'Must be zero'],
          ['转成沿半径', 'Becomes radial'],
        ],
        0,
        '牛顿第一定律保持速度向量。',
        'Newton’s first law preserves the velocity vector.',
      ],
      [
        '顺时针与逆时针在同一点同速率，速度向量？',
        'Same point and speed, opposite rotation. Velocity vectors?',
        [
          ['相同', 'Equal'],
          ['方向相反', 'Opposite directions'],
          ['都向圆心', 'Both toward the centre'],
        ],
        1,
        '切线方向反转。',
        'Their tangent directions reverse.',
      ],
    ],
    exit: [
      '撤去绳拉力后，小球为什么沿切线直线走？',
      'Why does the ball move straight along the tangent after tension is removed?',
      [
        [
          '保留切向速度，水平合力0不再改变方向',
          'It retains tangent velocity; zero horizontal net force no longer changes direction',
        ],
        ['新增向外力', 'A new outward force appears'],
        ['切线是拉力方向', 'Tangent is the tension direction'],
      ],
      0,
      '力改变运动，不是速度本身。',
      'Force changes motion; it is not velocity itself.',
    ],
  }),
  make({
    id: 'circular-speed-with-acceleration',
    kind: 'circular-acceleration',
    minutes: 23,
    title: [
      '速率没变，为什么还有加速度？',
      'Speed unchanged: why is there acceleration?',
    ],
    subtitle: [
      '把速度变化画出来，区分瞬时与区间平均。',
      'Draw velocity change and distinguish instantaneous from interval-average acceleration.',
    ],
    hook: [
      '操场转弯时，手表上的速率数字可以一直不变，但你仍得改变方向。加速度只管数字变大吗？把开始和现在的速度箭头移到共同起点，再用一支Δv箭头连接它们。',
      'Your watch can show unchanged speed while you turn on a running track, yet direction changes. Does acceleration only track a growing number? Put initial and current velocity tails together and find their difference Δv.',
    ],
    prediction: [
      '匀速绕圆，速度方向持续改变；加速度？',
      'Circling at constant speed with changing velocity direction. Acceleration?',
    ],
    predictions: [
      ['为0', 'Zero'],
      ['非零，匀速圆周中向内', 'Nonzero, inward in uniform circular motion'],
      ['始终沿速度方向', 'Always along velocity'],
    ],
    explore: [
      '比较r=2,v=1；r=2,v=2；r=1,v=2，每次观察四分之一圈。读瞬时加速度与Δv/Δt；自由速率试0.5与3。把检查时间缩短，看看平均大小怎样靠近瞬时值。',
      'Compare r=2,v=1; r=2,v=2; r=1,v=2 for a quarter lap each. Read instantaneous acceleration and Δv/Δt. Try free speeds 0.5 and 3. Shorten the inspection interval and watch the average magnitude approach the instantaneous value.',
    ],
    concept: [
      '速度是向量，改变方向也属于速度改变。匀速圆周运动的瞬时加速度朝圆心，大小a=v²/r；速率翻倍，a变四倍，同速率半径减半，a变两倍。从起点到当前的平均加速度为Δv/Δt；有限区间中它的方向指向两次位置之间的中间方向，不必与当前向内方向相同。',
      'Velocity is a vector; a direction change is a velocity change. Instantaneous acceleration in uniform circular motion points inward with magnitude a=v²/r. Double speed gives fourfold acceleration; half radius at fixed speed doubles it. Average acceleration from the start is Δv/Δt. Over a finite interval its direction lies between the two inward directions, rather than necessarily matching the current inward direction.',
    ],
    formula: [
      'a向心=v²/r；a平均=Δv/Δt；Δt越小，平均趋近瞬时',
      'acentripetal=v²/r; aaverage=Δv/Δt; shrinking Δt makes the average approach the instantaneous value',
    ],
    example: [
      '三次瞬时加速度大小为0.5、2、4 m/s²。第一辆从向上1 m/s转到向左1 m/s，Δv=(−1,−1)，大小√2；区间π s，平均大小约0.450 m/s²，不是0，也不必等于0.5。',
      'Instantaneous magnitudes are 0.5, 2 and 4 m/s². The first cart turns from upward 1 m/s to leftward 1 m/s: Δv=(−1,−1), magnitude √2. Over π s the average magnitude is about 0.450 m/s², neither zero nor exactly 0.5.',
    ],
    misconception: [
      '“速率相同，所以Δv=0。”不能只减两个箭头的长度，要相减向量。“瞬时向心加速度与整个区间平均加速度完全相同”也错；它们在很短区间才趋近。',
      '“Equal speeds give Δv=0.” Subtract vectors, not just arrow lengths. Instantaneous inward acceleration and finite-interval average acceleration are not identical; they approach each other over short intervals.',
    ],
    realWorld: [
      '旋转平台、风扇叶尖与骑车转弯都可在速率不变时加速。比较急转弯时，同时看速率和半径；只知道走得多快，还不知道方向改变得多急。',
      'Rotating platforms, fan tips and bicycle turns accelerate even at constant speed. Compare speed and radius together to understand how rapidly direction changes.',
    ],
    summary: [
      '加速度追踪速度向量；同速率也能有持续向内的加速度。',
      'Acceleration tracks the velocity vector; constant speed can still mean continuous inward acceleration.',
    ],
    homeExperiment: [
      '用两支等长纸箭头表示向上与向左的1 m/s。尾部放一起，画从第一支尖端到第二支尖端的Δv，再把它平移到起点。',
      'Use equal paper arrows for upward and leftward 1 m/s. Align their tails, draw Δv from the first tip to the second, then translate Δv to the origin.',
    ],
    vocabulary: [
      ['向心加速度', 'Centripetal acceleration'],
      ['向量差', 'Vector difference'],
      ['瞬时加速度', 'Instantaneous acceleration'],
      ['区间平均', 'Interval average'],
    ],
    questions: [
      [
        'v=2 m/s、r=2 m，a？',
        'v=2 m/s, r=2 m. a?',
        [
          ['2 m/s²', '2 m/s²'],
          ['1 m/s²', '1 m/s²'],
          ['0 m/s²', '0 m/s²'],
        ],
        0,
        'a=4/2=2。',
        'a=4/2=2.',
      ],
      [
        '同一圆，速率翻倍，向心加速度？',
        'Same circle, double speed. Centripetal acceleration?',
        [
          ['翻倍', 'Doubles'],
          ['不变', 'Unchanged'],
          ['四倍', 'Quadruples'],
        ],
        2,
        'a正比v²。',
        'a scales with v².',
      ],
      [
        '两个等长但方向不同的速度箭头，Δv一定0？',
        'Equal-length velocity arrows with different directions. Must Δv be zero?',
        [
          ['一定', 'Yes'],
          ['不，向量不同', 'No; the vectors differ'],
          ['只看质量', 'Depends only on mass'],
        ],
        1,
        '方向属于速度向量的一部分。',
        'Direction is part of velocity.',
      ],
    ],
    exit: [
      '匀速转弯为何不能说加速度为0？',
      'Why is acceleration not zero during a constant-speed turn?',
      [
        [
          '速度方向不断改变；瞬时加速度在匀速圆周中向内',
          'Velocity direction changes; instantaneous acceleration in uniform circular motion is inward',
        ],
        ['速率一定增加', 'Speed must increase'],
        ['只有向前的力才产生加速度', 'Only forward force can accelerate'],
      ],
      0,
      '速度不只包含速率。',
      'Velocity includes more than speed.',
    ],
  }),
  make({
    id: 'circular-force-is-a-role',
    kind: 'circular-force',
    minutes: 22,
    title: [
      '有了拉力，还要再加一个向心力吗？',
      'With tension present, do we add another centripetal force?',
    ],
    subtitle: [
      '向心描述合力的作用，先找真实相互作用。',
      'Centripetal describes the net force’s role; identify actual interactions first.',
    ],
    hook: [
      '你给绕圈小球画了重力、支持力和绳拉力，又想加一支“向心力”箭头。它由哪个物体施加？如果找不到新的相互作用，这支箭头很可能把已经算过的力再算一次。',
      'You draw gravity, support and tension for a circling ball, then add an arrow called centripetal force. Which object exerts it? Without another interaction, that arrow may count an existing force twice.',
    ],
    prediction: [
      '水平光滑桌面的小球靠绳拉力转圈，水平向心合力由谁提供？',
      'A ball circles on a smooth horizontal table held by a string. What supplies its inward horizontal net force?',
    ],
    predictions: [
      ['绳拉力', 'Tension'],
      ['另一个独立向心力', 'A separate centripetal interaction'],
      ['小球储存的推动力', 'A stored pushing force'],
    ],
    explore: [
      '速率固定2 m/s，比较1 kg半径2 m、2 kg半径2 m、1 kg半径1 m。读“需要、来源、实际合力”三行，它们是比较不是相加。自由质量增加时，加速度不变，但绳拉力需求增加。',
      'At fixed 2 m/s compare 1 kg/r=2, 2 kg/r=2 and 1 kg/r=1. Read requirement, source and actual net: these rows compare rather than add. Increasing free mass leaves acceleration unchanged but increases needed tension.',
    ],
    concept: [
      '牛顿第二定律在指向圆心的径向上给ΣF径向=mv²/r。匀速圆周中合力完全向内；提供它的可以是拉力、摩擦力、引力或多个力的径向合成。“向心力”是角色，不是另外一种相互作用。水平桌面上支持力与重力竖直相抵，绳拉力就是水平合力；不要再加一次mv²/r。',
      'Newton’s second law in the inward radial direction gives ΣFradial=mv²/r. In uniform circular motion the whole net force points inward. Tension, friction, gravity or a combination of radial components may provide it. Centripetal is a role, not another interaction. On the horizontal table support and gravity cancel vertically; tension is the horizontal net force, not tension plus another mv²/r.',
    ],
    formula: [
      'ΣF径向=mv²/r；本桌面模型T绳=mv²/r',
      'ΣFradial=mv²/r; this table model: Tstring=mv²/r',
    ],
    example: [
      '三个规定比较需要2、4、4 N拉力。质量翻倍需要两倍合力；同质量同速率、半径减半也需要两倍。第一辆已有2 N绳拉力时，水平合力是2 N，不是再加2得到4 N。',
      'The three comparisons need tension 2, 4 and 4 N. Doubling mass doubles net-force demand; halving radius at fixed mass and speed also doubles it. With 2 N tension in the first case, horizontal net force is 2 N, not 2+2=4 N.',
    ],
    misconception: [
      '“只要物体绕圆，就必有一种额外叫向心力的力。”先列施力物体与实际力，再算径向合力。竖直圆环速率改变时还可能有切向合力；mv²/r描述径向分量，不一定是总合力大小。',
      '“Any circular path needs an extra interaction called centripetal force.” List actual agents and forces first, then sum radial components. A vertical loop with changing speed may also have tangential net force; mv²/r describes the radial component, not always the total force magnitude.',
    ],
    realWorld: [
      '绳上小球由拉力转向，水平车辆由轮胎与路面的横向作用转向，卫星由引力转向。同一个公式把不同场景连起来，但每次都要找对真实来源。',
      'A string turns a ball, tyre–road lateral interaction turns a car, and gravity turns a satellite. One equation connects the situations while each needs its actual force source.',
    ],
    summary: [
      '先画真实力，再求径向合力；“向心”给合力一个工作名称。',
      'Draw actual forces first, then find the radial sum; centripetal names the net force’s job.',
    ],
    homeExperiment: [
      '纸上分别画绳球、水平转弯车和卫星，给每个“向内合力”写一个真实施力对象。检查有没有把合力结果又当成一支新力加入。',
      'Sketch a string-held ball, a turning car and a satellite. Name the actual agent supplying inward force in each and check for double-counting the net result.',
    ],
    vocabulary: [
      ['径向合力', 'Radial net force'],
      ['拉力', 'Tension'],
      ['真实相互作用', 'Actual interaction'],
      ['力的重复计数', 'Force double-counting'],
    ],
    questions: [
      [
        'm=1、v=2、r=2，所需径向合力？',
        'm=1, v=2, r=2. Required radial net force?',
        [
          ['4 N', '4 N'],
          ['2 N', '2 N'],
          ['0 N', '0 N'],
        ],
        1,
        'mv²/r=2 N。',
        'mv²/r=2 N.',
      ],
      [
        '已有2 N拉力单独提供水平转向，水平合力？',
        'Tension 2 N alone supplies horizontal turning. Horizontal net force?',
        [
          ['4 N', '4 N'],
          ['6 N', '6 N'],
          ['2 N', '2 N'],
        ],
        2,
        '“向心”是这2 N的作用，不是另一支力。',
        'Centripetal is the role of those 2 N, not another force.',
      ],
      [
        '同r、v，质量翻倍，a与所需F？',
        'Same r and v, double mass. a and required F?',
        [
          ['a不变、F翻倍', 'a unchanged, F doubles'],
          ['a翻倍、F不变', 'a doubles, F unchanged'],
          ['都不变', 'Both unchanged'],
        ],
        0,
        'a=v²/r与质量无关；F=ma。',
        'a=v²/r is mass-independent; F=ma.',
      ],
    ],
    exit: [
      '为什么不能把绳拉力与“所需向心力”相加？',
      'Why should tension not be added to the required centripetal force?',
      [
        [
          '拉力已经提供这份径向合力，再加会重复计数',
          'Tension already supplies that radial net force; adding it again double-counts',
        ],
        ['绳拉力不存在', 'Tension does not exist'],
        ['所有力必须为0', 'All forces must be zero'],
      ],
      0,
      '区分真实力与合力的角色。',
      'Distinguish actual forces from the net force’s role.',
    ],
  }),
  make({
    id: 'circular-turning-grip-limit',
    kind: 'circular-turning',
    minutes: 24,
    title: [
      '快一点，为什么同一个弯转得更宽？',
      'A little faster: why does the same turn become wider?',
    ],
    subtitle: [
      '把需要的横向力与可用上限放在同一张图。',
      'Compare required lateral force and the available limit on one plot.',
    ],
    hook: [
      '想象玩具车沿地面画好的圆弧转弯。把速率提高，保持同样的横向力上限，它还能贴着线走吗？今天让灰色计划轨迹和金色实际轨迹从同一点、同一方向出发。',
      'Imagine a toy cart following a marked bend. Increase speed while keeping the same lateral-force limit: can it still follow the mark? Grey planned and gold actual paths start from the same point and tangent.',
    ],
    prediction: [
      '所需横向力4.5 N，但最多只有4 N；模型实际转弯半径？',
      'Required lateral force 4.5 N, available limit 4 N. Actual model turn radius?',
    ],
    predictions: [
      ['更小', 'Smaller'],
      ['仍完全相同', 'Exactly unchanged'],
      ['更大，转得更宽', 'Larger, a wider turn'],
    ],
    explore: [
      '比较r=2,v=2；r=2,v=3；r=1,v=2。横向力上限都是4 N。看需求曲线何时超过实际曲线；第二次实际路径外移，第三次恰在上限。自由初速试1与3.5 m/s。',
      'Compare r=2,v=2; r=2,v=3; r=1,v=2 with a 4 N limit. Find where demand exceeds actual-force curves. The second path moves outside the planned bend; the third sits exactly at the limit. Try free speeds 1 and 3.5 m/s.',
    ],
    concept: [
      '计划圆弧需要F=mv²/r。若横向力最多μmg，则保持该半径需v≤√(μgr)。本演示把实际力设成“需求与4 N取较小者”，并始终垂直速度，所以速率不变；力不足时r实际=mv²/F实际，比计划更大。它展示转弯的力与曲率条件，不是完整车辆轮胎模型。',
      'The planned arc needs F=mv²/r. If lateral force is limited to μmg, maintaining that radius requires v≤√(μgr). This demonstration applies the smaller of demand and 4 N, always perpendicular to velocity, so speed stays constant. Insufficient force gives ractual=mv²/Factual, larger than planned. It demonstrates force–curvature conditions, not a complete tyre model.',
    ],
    formula: [
      'F需=mv²/r；F上限=μmg；r实际=mv²/F实际',
      'Frequired=mv²/r; Flimit=μmg; ractual=mv²/Factual',
    ],
    example: [
      '1 kg、r=2 m、v=2需要2 N，能沿线走。v=3需要4.5 N，只提供4 N，实际曲率半径2.25 m。r=1、v=2需要4 N，恰在上限。这里速率翻倍，需求变四倍，不是两倍。',
      'At 1 kg, r=2 m and v=2, demand is 2 N and the path is maintained. At v=3, demand is 4.5 N but actual force is 4 N, giving radius 2.25 m. At r=1 and v=2, demand is 4 N, exactly at the limit. Doubling speed quadruples demand.',
    ],
    misconception: [
      '“向外移说明出现额外向外合力。”地面参考系里，是向内的横向力不够维持原来的曲率。也不能拿这组玩具数值当真实道路的限速：轮胎、路况、转向、纵向力与制动都会改变条件。',
      '“Moving outward means a new outward net force appears.” In the ground frame the available inward lateral force cannot maintain the planned curvature. These toy values are not real-road speed limits; tyres, surface, steering, longitudinal force and braking change the conditions.',
    ],
    realWorld: [
      '设计弯道与选择转弯速率，都要把半径和抓地条件一起考虑。相同速率下更大的弯曲半径需要更小横向加速度；这个几何关系也适用于机器人和轨道运输的理想比较。',
      'Bend design and turning speed involve both radius and grip conditions. A larger radius at the same speed needs less lateral acceleration. The same geometry informs ideal comparisons for robots and guided transport.',
    ],
    summary: [
      '先比较需求与上限；速率平方与转弯半径共同决定能否沿计划走。',
      'Compare demand with the limit; speed squared and radius determine whether the planned turn can be maintained.',
    ],
    homeExperiment: [
      '画半径2 m的计划圆与半径2.25 m的实际圆，让它们在同一点相切、起始方向相同。画四分之一计划圈时间后的两条路径；用力需求解释差别。',
      'Draw planned radius 2 m and actual radius 2.25 m circles sharing a tangent and starting point. Trace their paths over the planned quarter-lap time and explain the difference through force demand.',
    ],
    vocabulary: [
      ['横向力', 'Lateral force'],
      ['可用上限', 'Available limit'],
      ['曲率半径', 'Curvature radius'],
      ['抓地条件', 'Grip conditions'],
    ],
    questions: [
      [
        'r=2、m=1、v=3，需要F？',
        'r=2, m=1, v=3. Required F?',
        [
          ['3 N', '3 N'],
          ['2 N', '2 N'],
          ['4.5 N', '4.5 N'],
        ],
        2,
        '9/2=4.5。',
        '9/2=4.5.',
      ],
      [
        '同速率，实际横向力更小，曲率半径？',
        'Same speed, smaller actual lateral force. Curvature radius?',
        [
          ['更小', 'Smaller'],
          ['更大', 'Larger'],
          ['总为0', 'Always zero'],
        ],
        1,
        'r=mv²/F。',
        'r=mv²/F.',
      ],
      [
        '同一计划弯道，速度翻倍，需求？',
        'Same planned bend, double speed. Force demand?',
        [
          ['四倍', 'Quadruple'],
          ['两倍', 'Double'],
          ['减半', 'Half'],
        ],
        0,
        '需求正比v²。',
        'Demand scales with v².',
      ],
    ],
    exit: [
      '需求超过可用横向力时，为什么不能继续画同一个圆？',
      'Why can we not keep drawing the planned circle when lateral demand exceeds available force?',
      [
        [
          '实际加速度不够维持该曲率；同速率会转出更大半径',
          'Actual acceleration cannot maintain that curvature; the same speed gives a larger radius',
        ],
        ['圆周运动不需要力', 'Circular motion needs no force'],
        ['速率与曲率无关', 'Speed is unrelated to curvature'],
      ],
      0,
      '轨迹必须与实际受力一致。',
      'Trajectory must agree with actual force.',
    ],
  }),
  make({
    id: 'circular-satellite-gravity-turns',
    kind: 'circular-orbit',
    minutes: 23,
    title: [
      '卫星一直在落，为什么没落到地面？',
      'Always falling: why does the satellite miss the ground?',
    ],
    subtitle: [
      '把引力与圆轨道条件接在一起，不把任意速率画成圆。',
      'Connect gravity with circular-orbit conditions instead of drawing any speed as a circle.',
    ],
    hook: [
      '卫星没有一根绳子连着地球，但它的速度方向仍不断改变。引力就像一位持续“转弯”的助手：运动向前，同时向中心加速。先在一个虚构小系统中把这两件事连起来。',
      'A satellite has no string to Earth, yet its velocity direction keeps changing. Gravity continuously turns its motion: it moves forward while accelerating toward the centre. Connect those ideas in a fictional small system first.',
    ],
    prediction: [
      '同一圆轨道，把卫星质量翻倍，圆轨道所需速率？',
      'Same circular orbit, double satellite mass. Required circular speed?',
    ],
    predictions: [
      ['不变', 'Unchanged'],
      ['翻倍', 'Double'],
      ['减半', 'Half'],
    ],
    explore: [
      '比较1 kg/r=2、2 kg/r=2、1 kg/r=4。看前两次引力翻倍但加速度与周期不变；第三次引力更小、周期更长。自由半径改变时，模型会一起调整圆轨道初速。',
      'Compare 1 kg/r=2, 2 kg/r=2 and 1 kg/r=4. In the first pair gravity doubles but acceleration and period stay unchanged. The larger orbit has weaker gravity and a longer period. Free radius changes automatically adjust the required circular initial speed.',
    ],
    concept: [
      '无空气与推进力的圆轨道中，引力提供全部合力。写Fg=mμ/r²，同时需要mv²/r；相等后质量m约掉，得到v=√(μ/r)。本课μ=GM=8 m³/s²，是虚构缩尺系统。圆轨道速率、周期与半径是相连的，不能独立随意设定。引力始终垂直瞬时速度，所以速率不变、动能不变，方向却持续改变。',
      'In a circular orbit without air or thrust, gravity supplies the whole net force. Fg=mμ/r² must equal mv²/r. Mass cancels, giving v=√(μ/r). Here μ=GM=8 m³/s² in a fictional small system. Circular speed, period and radius are linked, not arbitrary independent controls. Gravity stays perpendicular to instantaneous velocity, keeping speed and K constant while changing direction.',
    ],
    formula: [
      'mμ/r²=mv²/r；v=√(μ/r)；T=2πr/v',
      'mμ/r²=mv²/r; v=√(μ/r); T=2πr/v',
    ],
    example: [
      'r=2时，v=2 m/s，a=2 m/s²，1 kg引力2 N、2 kg引力4 N，周期都2π s。r=4时，v=√2、a=0.5，引力0.5 N，周期约17.772 s。半径翻倍，速率不是翻倍，而是除以√2。',
      'At r=2, v=2 m/s and a=2 m/s². Gravity is 2 N for 1 kg and 4 N for 2 kg; both periods are 2π s. At r=4, v=√2, a=0.5 and gravity 0.5 N, with period about 17.772 s. Doubling radius divides speed by √2 rather than doubling it.',
    ],
    misconception: [
      '“引力只要存在，任何初速都会变成圆轨道。”只有合适的切向初速满足圆轨道条件；别的初始条件可能产生其他轨道或碰到中心体。“没有继续加油就不能绕行”也不对，本理想轨道引力改变方向而不减少速率。',
      '“With gravity present, any initial speed becomes a circular orbit.” A suitable tangent speed is required; other initial conditions can give different orbits or impact. Continued propulsion is not necessary in this ideal case: gravity changes direction without reducing speed.',
    ],
    realWorld: [
      '通信、天气观测与导航卫星都依赖轨道运动。它们的真实半径、中心体与任务不同，本课用小数值建立关系；下一单元再研究万有引力与轨道能量。',
      'Communications, weather observation and navigation satellites rely on orbital motion. Actual radii, central bodies and tasks differ. Small teaching values establish the relationships; the next unit explores gravitation and orbital energy.',
    ],
    summary: [
      '引力可以只改变方向；圆轨道速度要与半径和引力参数一起决定。',
      'Gravity can change direction without speed; circular speed is determined jointly by radius and gravity parameter.',
    ],
    homeExperiment: [
      '画圆上四个位置，各画切向速度与向内引力箭头。再把卫星质量写成两倍，说明为什么力箭头变长而同半径轨道速率不变。',
      'Sketch four positions around a circle, each with tangent velocity and inward gravity. Double satellite mass and explain why force grows but the same-radius orbital speed does not change.',
    ],
    vocabulary: [
      ['圆轨道', 'Circular orbit'],
      ['引力参数', 'Gravitational parameter'],
      ['轨道速率', 'Orbital speed'],
      ['持续自由落体', 'Continuous free fall'],
    ],
    questions: [
      [
        '同圆轨道卫星质量翻倍，加速度？',
        'Same circular orbit, double satellite mass. Acceleration?',
        [
          ['不变', 'Unchanged'],
          ['翻倍', 'Double'],
          ['减半', 'Half'],
        ],
        0,
        'a=μ/r²，质量约掉。',
        'a=μ/r²; satellite mass cancels.',
      ],
      [
        '圆轨道引力与瞬时速度夹角？',
        'Angle between gravity and instantaneous circular velocity?',
        [
          ['0°', '0°'],
          ['90°', '90°'],
          ['180°', '180°'],
        ],
        1,
        '向内与切向垂直。',
        'Inward and tangent are perpendicular.',
      ],
      [
        '固定中心μ，圆轨道半径更大，速率？',
        'Fixed central μ, larger circular radius. Speed?',
        [
          ['更大', 'Greater'],
          ['不变', 'Unchanged'],
          ['更小', 'Smaller'],
        ],
        2,
        'v=√(μ/r)。',
        'v=√(μ/r).',
      ],
    ],
    exit: [
      '为什么卫星质量翻倍不改变同半径圆轨道的速率？',
      'Why does doubling satellite mass leave same-radius circular speed unchanged?',
      [
        [
          '引力与所需径向合力都正比质量，圆轨道条件里m约掉',
          'Gravity and required radial net force both scale with mass, so m cancels',
        ],
        ['重卫星没有引力', 'Heavy satellites feel no gravity'],
        ['质量变大使半径自动翻倍', 'Mass automatically doubles radius'],
      ],
      0,
      '相互作用更强，但惯性也同比增加。',
      'Force and inertia increase by the same factor.',
    ],
  }),
  make({
    id: 'circular-loop-energy-and-contact',
    kind: 'circular-loop',
    minutes: 26,
    title: [
      '能到环顶，就一定能贴着轨道绕一圈吗？',
      'Enough energy to reach the top: enough to stay on the loop?',
    ],
    subtitle: [
      '把能量条件与“轨道只能推”的接触条件同时检查。',
      'Check energy and the contact condition that the track can only push.',
    ],
    hook: [
      '玩具车冲进竖直圆环。你算出能量刚好够爬到最高点，动画却在到顶前离开轨道。是能量守恒错了吗？还是“有能量”和“轨道能推住”是两道不同的门？',
      'A toy cart enters a vertical loop. Its energy seems just sufficient to reach the top, but it leaves the track earlier. Is conservation wrong, or are enough energy and enough contact two different conditions?',
    ],
    prediction: [
      '未夹持的小车在环内侧，最高点维持接触至少需要什么？',
      'An unrestrained cart inside a loop: what is needed at the top to maintain contact?',
    ],
    predictions: [
      ['到顶速率可为0', 'Zero top speed is enough'],
      ['还需v顶²/r≥g', 'Also vtop²/r≥g'],
      ['必须新增向外力', 'A new outward force is necessary'],
    ],
    explore: [
      '比较底端K=20、25、30 J，m=1 kg、r=1 m、g=10。先看总能量，再看N是否能保持非负。20 J会脱轨并转为只受重力的抛体；25 J恰在顶端N=0，30 J仍有支持力。自由动能试18与36 J。',
      'Compare bottom K=20,25,30 J with m=1 kg, r=1 m and g=10. Watch total energy and whether N can remain nonnegative. At 20 J it leaves and becomes a gravity-only projectile; 25 J just has N=0 at the top; 30 J retains support. Try free energies 18 and 36 J.',
    ],
    concept: [
      '光滑轨道中K+U守恒，但维持圆形轨迹还要求轨道支持力N≥0。顶端向内是向下，N+mg=mv顶²/r，所以最低v顶²=gr；爬升2r还需2mgr势能，最低底端动能为½mgr+2mgr=2.5mgr。本车未夹持，若继续沿圆需负N，轨道不能拉它，便脱离；之后N=0、只受重力，机械能仍守恒。',
      'A smooth track conserves K+U, but circular contact also requires N≥0. At the top inward is downward: N+mg=mvtop²/r. Minimum vtop² is gr. Rising 2r needs 2mgr potential energy, so minimum bottom K is ½mgr+2mgr=2.5mgr. This unrestrained cart leaves if continued circular motion would need negative N. Thereafter N=0 and gravity alone acts, still conserving mechanical energy.',
    ],
    formula: [
      '顶端N+mg=mv顶²/r；N≥0；K底最低=2.5mgr',
      'Top: N+mg=mvtop²/r; N≥0; minimum bottom K=2.5mgr',
    ],
    example: [
      '本模型最低底端动能25 J。20 J只够支付顶端20 J势能，却不能支付接触所需的顶端5 J动能；它约在131.8°时N降到0并离开。25 J在顶端K=5、U=20、N=0；30 J在顶端K=10、U=20、N=10 N。',
      'Minimum bottom K here is 25 J. A 20 J budget could pay the top’s 20 J potential energy but not the 5 J kinetic energy needed for contact; it leaves at about 131.8° when N reaches zero. At 25 J, top K=5,U=20,N=0. At 30 J, top K=10,U=20,N=10 N.',
    ],
    misconception: [
      '“算出负支持力，就画轨道向外拉。”对只能推、不能拉的接触，负值意味着假设的贴轨运动不成立，必须切换运动模型。真实过山车的轮组可以夹持轨道，和本课未绑紧的质点车不同；这里不评估乘员感受或实际设计。',
      '“Negative support means draw the track pulling outward.” For push-only contact, a negative result invalidates assumed track-following motion; switch models. Real coaster wheel assemblies may hold the track, unlike this unrestrained point-cart. This lesson does not assess riders or actual designs.',
    ],
    realWorld: [
      '轨道、绳子、地面都对相互作用有条件：轨道通常只能推，绳通常只能拉。计算之外还要检验模型是否满足这些条件，这会让一个答案从“算得出”变成“物理上能发生”。',
      'Tracks, strings and surfaces impose interaction conditions: ordinary contact pushes; a string pulls. After calculating, check whether those conditions hold to decide whether the assumed motion is physically possible.',
    ],
    summary: [
      '能量决定能有多快，接触条件决定能否沿这条轨迹。',
      'Energy determines possible speed; contact conditions determine whether that path can be followed.',
    ],
    homeExperiment: [
      '画顶端的受力图，只保留重力与轨道向下的支持力。给底端20、25、30 J分别分配顶端势能与动能，并判断是否满足N≥0；用纸解释即可。',
      'Draw the top force diagram with gravity and downward support. Allocate top potential and kinetic energy for bottom budgets 20,25,30 J and check N≥0 on paper.',
    ],
    vocabulary: [
      ['接触条件', 'Contact condition'],
      ['轨道支持力', 'Track normal force'],
      ['脱离轨道', 'Loss of contact'],
      ['非匀速圆周运动', 'Nonuniform circular motion'],
    ],
    questions: [
      [
        'r=1、g=10，顶端维持接触最低v²？',
        'r=1, g=10. Minimum top v² for contact?',
        [
          ['0 m²/s²', '0 m²/s²'],
          ['10 m²/s²', '10 m²/s²'],
          ['20 m²/s²', '20 m²/s²'],
        ],
        1,
        'N=0时mg=mv²/r。',
        'At N=0, mg=mv²/r.',
      ],
      [
        '底端25 J，顶端U=20 J，K？',
        'Bottom 25 J, top U=20 J. K?',
        [
          ['5 J', '5 J'],
          ['25 J', '25 J'],
          ['45 J', '45 J'],
        ],
        0,
        'K+U=25。',
        'K+U=25.',
      ],
      [
        '只能推的轨道，计算贴轨所需N<0，接下来？',
        'Push-only track, calculated support for continued contact is negative. What next?',
        [
          ['继续画负N拉住车', 'Keep negative N pulling the cart'],
          ['把重力删掉', 'Remove gravity'],
          [
            '接触失效，切换到只受重力的运动',
            'Contact fails; switch to gravity-only motion',
          ],
        ],
        2,
        '负N表示贴轨假设不再成立。',
        'Negative N invalidates assumed track-following contact.',
      ],
    ],
    exit: [
      '为什么20 J够支付环顶势能，却不足以维持完整贴轨一圈？',
      'Why can 20 J pay the top’s potential energy yet fail to complete a full contact lap?',
      [
        [
          '还需要顶端至少5 J动能满足向内加速度与N≥0',
          'At least 5 J top K is also needed for inward acceleration with N≥0',
        ],
        ['能量守恒不适用', 'Energy conservation fails'],
        ['轨道能任意拉住车', 'The track can pull arbitrarily'],
      ],
      0,
      '能量条件和接触条件都必须满足。',
      'Both energy and contact conditions must hold.',
    ],
  }),
];
