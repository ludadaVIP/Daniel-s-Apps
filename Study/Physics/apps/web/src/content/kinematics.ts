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
export const kinematicsLessons: Lesson[] = [
  make({
    id: 'kinematics-one-track-three-addresses',
    kind: 'kinematics-position',
    minutes: 21,
    title: [
      '同一辆车，为什么有三个位置答案？',
      'One cart. Why can it have three position answers?',
    ],
    subtitle: [
      '先约定原点、正方向和单位，再报告位置。',
      'Choose an origin, positive direction and unit before reporting position.',
    ],
    hook: [
      '学校走廊的机器人从世界轨道3 m处走到15 m处。站在0 m门口的朋友说“15 m”，站在10 m柜旁的朋友说“5 m”，面朝另一边的朋友写“−5 m”。谁弄错了？先看看他们的地址系统。',
      'A hallway robot travels from world-track mark 3 m to 15 m. A friend at the 0 m door reports “15 m”; one by the 10 m cupboard reports “5 m”; another facing the opposite way writes “−5 m”. Who is wrong? Inspect their address systems first.',
    ],
    prediction: [
      '把原点从0 m移到10 m，仍向右为正，同一终点位置会怎样？',
      'Move the origin from 0 m to 10 m, keeping right positive. What changes at the same endpoint?',
    ],
    predictions: [
      [
        '从15 m变为5 m，车没移动',
        'It changes from 15 m to 5 m; the cart does not move',
      ],
      ['车真的后退10 m', 'The cart physically moves back 10 m'],
      ['位置必须仍是15 m', 'Position must remain 15 m'],
    ],
    explore: [
      '完整比较三个坐标约定，跟踪同一段6 s运动。世界轨道固定，小车始终向右；坐标图会重读位置与斜率。自由拖动固定原点，检查起末位置同时改变而位移如何变化。',
      'Fully compare three coordinate conventions through the same 6 s journey. The world track stays fixed and the cart always travels right; coordinate plots relabel position and slope. Move the fixed origin freely and compare changes in both endpoint positions with displacement.',
    ],
    concept: [
      '位置是相对约定原点的坐标，不是从出发以来走过的路程。在一条直轨道上，向右为正时x=X−O；向左为正时x=O−X，其中X是世界轨道读数，O是固定原点。只平移原点，两端同减一个数，Δx不变；反转正方向，x、Δx和v一起反号，实际运动与速率不变。这个实验的原点都固定在轨道上；移动参考系另有相对运动。',
      'Position is a coordinate relative to a chosen origin, not distance travelled since departure. On a straight track, x=X−O for right positive and x=O−X for left positive, where X is the world-track reading and O a fixed origin. Translating the origin subtracts the same amount at both endpoints, preserving Δx. Reversing positive direction reverses x, Δx and v signs, preserving physical motion and speed. These origins are fixed on the track; a moving reference frame introduces relative motion.',
    ],
    formula: [
      '向右为正：x=X−O；位移Δx=x末−x初；本车X=3+2t（SI）',
      'Right positive: x=X−O; displacement Δx=x_end−x_start; here X=3+2t (SI)',
    ],
    example: [
      '按八步先描述向右匀速、画轨道并标原点；已知X初=3 m、v世界=2 m/s、t=6 s，求坐标终点及位移。世界终点15 m。三套坐标起末分别是3→15、−7→5、7→−5 m，位移分别+12、+12、−12 m。每套都对应实际12 m路程，不能把负号解释成负路程。',
      'Use eight steps: describe steady rightward motion and sketch the track with its origin. Given world start 3 m, world velocity 2 m/s and 6 s, find endpoint coordinates and displacement. World endpoint is 15 m. The three coordinate pairs are 3→15, −7→5 and 7→−5 m, yielding displacements +12, +12 and −12 m. All describe 12 m physical distance; a negative sign cannot mean negative distance.',
    ],
    misconception: [
      '“位置为负”不等于“向后走”，也不等于“走了负距离”。位置符号说明在哪边，速度符号说明此刻朝哪边移动，两者取决于已写清的正方向。',
      'Negative position does not imply backward travel or negative distance. Position sign identifies which side; velocity sign identifies present motion direction, both using the stated positive direction.',
    ],
    realWorld: [
      '楼层、道路里程标和视频追踪都需要原点。比较两份定位记录前，先确认是不是同一个坐标约定；数字不同可能只是地址变了。',
      'Floor numbers, road markers and video tracking all need origins. Before comparing location logs, check their coordinate conventions; different numbers may simply use different addresses.',
    ],
    summary: [
      '先给位置一个地址系统；换地址不等于换运动。',
      'Give position an address system first; changing addresses does not change motion.',
    ],
    homeExperiment: [
      '在纸上画世界刻度0–18 m，标3 m和15 m。用另一色标10 m原点，写两端坐标；再反转正方向。逐次算Δx，给家人解释为何实际路程一直12 m。',
      'Draw world marks 0–18 m and label 3 m and 15 m. Mark a 10 m origin in another colour and relabel endpoints; then reverse positive direction. Calculate each Δx and explain why physical distance stays 12 m.',
    ],
    vocabulary: [
      ['坐标约定', 'coordinate convention'],
      ['固定原点', 'fixed origin'],
      ['正方向', 'positive direction'],
      ['位置坐标', 'position coordinate'],
    ],
    questions: [
      [
        '原点10 m、向右为正，世界位置3 m的坐标？',
        'With origin 10 m and right positive, coordinate at world position 3 m?',
        [
          ['−7 m', '−7 m'],
          ['7 m', '7 m'],
          ['13 m', '13 m'],
        ],
        0,
        'x=3−10=−7 m，只说明在原点左边。',
        'x=3−10=−7 m identifies the left side of the origin.',
      ],
      [
        '只把固定原点移动，保持正方向，位移怎样？',
        'Translate only the fixed origin, keeping direction. What happens to displacement?',
        [
          ['必变为0', 'It must become zero'],
          [
            '不变，起末同减一个量',
            'Unchanged; both endpoints subtract the same amount',
          ],
        ],
        1,
        '(x末−O)−(x初−O)=x末−x初。',
        '(x_end−O)−(x_start−O)=x_end−x_start.',
      ],
      [
        '向左为正，小车仍实际向右2 m/s，坐标速度？',
        'Left positive, while the cart physically travels right at 2 m/s. Coordinate velocity?',
        [
          ['+2 m/s', '+2 m/s'],
          ['−2 m/s', '−2 m/s'],
          ['速率−2 m/s', 'Speed −2 m/s'],
        ],
        1,
        '反转轴使速度分量反号，速率仍2 m/s。',
        'Axis reversal changes the velocity component sign; speed remains 2 m/s.',
      ],
    ],
    exit: [
      '两个位置读数不同，比较前先问什么？',
      'Two position readings differ. What should you ask before comparing?',
      [
        [
          '是否共用原点、方向、单位与时刻',
          'Do they share origin, direction, units and time?',
        ],
        ['哪个数字更大就更正确', 'The larger number must be correct'],
      ],
      0,
      '先统一读数的含义，再比较数值。',
      'Establish shared meaning before comparing numbers.',
    ],
  }),
  make({
    id: 'kinematics-a-smooth-return',
    kind: 'kinematics-journey',
    minutes: 22,
    title: [
      '小车平滑返回，里程账为什么没有归零？',
      'The cart returns smoothly. Why does its distance ledger stay nonzero?',
    ],
    subtitle: [
      '用连续转向模型分开位置、位移与累计路程。',
      'Separate position, displacement and distance through a continuous turn.',
    ],
    hook: [
      '相机轨道上的小车先向右、逐渐减慢，然后平滑向左回到出发点。摄像师说“没有位移”，轨道记录却写“走了16 m”。两份账到底记录了什么？',
      'A camera cart travels right, slows, turns smoothly and returns left to its starting point. The operator says “zero displacement”; the track log says “16 m travelled”. What does each ledger record?',
    ],
    prediction: [
      '完成这趟8 s往返，位移0能否说明路程0？',
      'After this 8 s return trip, does zero displacement imply zero distance?',
    ],
    predictions: [
      ['能，它没有离开起点', 'Yes; it never left the start'],
      [
        '不能，路程仍累计去程和回程',
        'No; distance includes outward and return travel',
      ],
      ['路程应是−16 m', 'Distance must be −16 m'],
    ],
    explore: [
      '完整观察到2、4、8 s，保留三行账。注意金色位置变化箭头可以缩短，但累计路程不会倒扣；4 s处速度连续经过0。自由改变观察终点，比较转向前后的小车位置和两份账。',
      'Observe fully to 2, 4 and 8 s and retain all three records. The gold endpoint-change line can shrink while accumulated distance never counts backward; velocity passes continuously through zero at 4 s. Freely change the observation endpoint and compare positions and both ledgers before and after the turn.',
    ],
    concept: [
      '一维位移是末位置减初位置，有方向；路程累计实际路径长度，非负。这里x=3+4t−½t²、v=4−t（SI），4 s时v=0后向左移动，转向是平滑的。求路程时，跨越转向点的区间要分两段，把两段路径长度相加；求位移始终只减两个端点。x–t图是位置历史，不是小车爬过的轨道形状。',
      'One-dimensional displacement is end position minus start position and is signed; distance accumulates nonnegative path length. Here x=3+4t−½t² and v=4−t (SI). Velocity is zero at 4 s before leftward motion; the turn is smooth. To find distance across the turn, split the interval and add both path lengths. Displacement always uses endpoint subtraction. The x–t curve is position history, not the shape of a hill travelled by the cart.',
    ],
    formula: [
      'Δx=x末−x初；跨转向点路程=|x转−x初|+|x末−x转|',
      'Δx=x_end−x_start; distance across a turn=|x_turn−x_start|+|x_end−x_turn|',
    ],
    example: [
      '八步中先画直轨道并标3 m起点、11 m转向点。2 s时x=9 m，位移与路程都是6 m；4 s时x=11 m，两者都是8 m；8 s时x回到3 m，Δx=0，而路程=|11−3|+|3−11|=16 m。检查：路程至少等于位移的大小，16≥0。',
      'In the eight-step sketch, mark start 3 m and turn 11 m on a straight track. At 2 s, x=9 m and both displacement and distance are 6 m. At 4 s, x=11 m and both are 8 m. At 8 s, x returns to 3 m: Δx=0 but distance=|11−3|+|3−11|=16 m. Check: distance must be at least the magnitude of displacement, here 16≥0.',
    ],
    misconception: [
      '“返回后距离变小”通常说的是离出发点有多远，不是已走路程。这里离起点的直线距离会变小，累计路程继续变大。不要给两个不同含义都只写“距离”。',
      '“Distance gets smaller on return” often means separation from the start, not accumulated travel. Here separation decreases while path distance increases. Label these two meanings rather than calling both simply distance.',
    ],
    realWorld: [
      '运动手环里的总里程和地图上的起终点间隔不同。室内移动相机、巡检机器人或绕圈散步，都能回到原位而保留实际行程。',
      'Activity-tracker mileage differs from map separation between endpoints. Camera carts, inspection robots and loop walks can return to their starting place while retaining real travelled distance.',
    ],
    summary: [
      '位移记起末变化，路程记全部路径；返回不抹掉行程。',
      'Displacement records endpoint change; distance records the entire path. Returning does not erase travel.',
    ],
    homeExperiment: [
      '把3、9、11、3 m写在0、2、4、8 s记录卡上。用一根纸条沿直线表示路径，先量去程再量回程；再用另一色只连接起末位置。标明路程与位移的区别。',
      'Make cards for positions 3, 9, 11 and 3 m at 0, 2, 4 and 8 s. Use a paper strip to represent the straight path, counting outward and return legs; in another colour connect only endpoints. Label distance and displacement separately.',
    ],
    vocabulary: [
      ['累计路程', 'accumulated distance'],
      ['带符号位移', 'signed displacement'],
      ['转向点', 'turning point'],
      ['位置历史', 'position history'],
    ],
    questions: [
      [
        '2 s位置9 m、起点3 m，位移？',
        'At 2 s position is 9 m, starting at 3 m. Displacement?',
        [
          ['9 m', '9 m'],
          ['6 m', '6 m'],
          ['12 m', '12 m'],
        ],
        1,
        '末减初，9−3=6 m。',
        'Subtract the start: 9−3=6 m.',
      ],
      [
        '完整往返路程？',
        'Distance for the full return trip?',
        [
          ['0 m', '0 m'],
          ['8 m', '8 m'],
          ['16 m', '16 m'],
        ],
        2,
        '两段各8 m，累计16 m。',
        'Each leg is 8 m, totalling 16 m.',
      ],
      [
        '位置图弯成拱形，实际轨道必须拱起吗？',
        'An arched position-time curve requires an arched physical track?',
        [
          ['不，纵轴记录位置', 'No; the vertical axis records position'],
          ['是，图是轨道照片', 'Yes; the plot is a photograph of the track'],
        ],
        0,
        '先读轴的物理量；本模型实际轨道是直线。',
        'Read axis quantities; this model track is straight.',
      ],
    ],
    exit: [
      '离起点越来越近，但仍在移动，累计路程怎样？',
      'Moving closer to the start while still moving: what happens to accumulated distance?',
      [
        [
          '继续增大，位移大小可减小',
          'It increases while displacement magnitude can decrease',
        ],
        ['一定减少', 'It must decrease'],
      ],
      0,
      '返回路径也属于走过的路。',
      'The return path is still travelled path.',
    ],
  }),
  make({
    id: 'kinematics-speed-has-no-minus',
    kind: 'kinematics-velocity',
    minutes: 22,
    title: [
      '速度经过零以后，速率为什么又变大？',
      'After velocity passes through zero, why does speed grow again?',
    ],
    subtitle: [
      '同一时刻的快慢与方向，分开报告。',
      'Report an instant’s rate of motion separately from its direction.',
    ],
    hook: [
      '小车仪表先写+2，再写0，接着写−2 m/s。朋友说“负2一定比正2更慢”。你看见的是快慢变化，还是方向变化？把速率表和速度箭头并排放。',
      'A cart readout shows +2, then 0, then −2 m/s. A friend says “negative two must be slower than positive two”. Is this a rate change or a direction change? Put a speed readout beside the velocity arrow.',
    ],
    prediction: [
      '向右为正，+2 m/s和−2 m/s哪个速率更大？',
      'With right positive, which has greater speed: +2 or −2 m/s?',
    ],
    predictions: [
      ['+2更快', '+2 is faster'],
      [
        '速率同为2 m/s，方向相反',
        'Both speeds are 2 m/s, in opposite directions',
      ],
      ['−2的速率为负', '−2 has negative speed'],
    ],
    explore: [
      '完整观察到2、4、6 s，读同一小车的速度、速率和方向。4 s时箭头消失，因为瞬时速度为0；随后向左箭头出现，速率再次增大。自由观察到8 s，别用负号替代快慢比较。',
      'Observe fully to 2, 4 and 6 s and compare the same cart’s velocity, speed and direction. At 4 s the direction arrow disappears because instantaneous velocity is zero; a left arrow then appears as speed grows again. Observe freely to 8 s without using the minus sign as a speed ranking.',
    ],
    concept: [
      '速度描述位置变化率和方向，是向量；在本直线模型中用带符号的分量表示。速率是速度的大小，不带方向、不会为负。瞬时速度是此刻的局部变化率，不是整个行程的平均量。在x=3+4t−½t²模型中v=4−t，速率=|4−t|；两条读数共用同一运动，不能给速率再添一个负号。',
      'Velocity describes position-change rate and direction and is a vector; this straight-line model uses a signed component. Speed is velocity magnitude, has no direction and cannot be negative. Instantaneous velocity is the local rate now, not an average for the whole trip. Here x=3+4t−½t² gives v=4−t and speed=|4−t|; both readouts describe the same motion, so do not attach a minus sign to speed.',
    ],
    formula: [
      '一维速率=|v|；本模型v=4−t（m/s，t用s）',
      'One-dimensional speed=|v|; here v=4−t (m/s, with t in s)',
    ],
    example: [
      '八步先约定向右为正、标当前时刻。2 s时v=+2 m/s、速率2 m/s，向右；4 s时v=0，速率0，瞬时没有运动方向；6 s时v=−2 m/s、速率2 m/s，向左。4 s处加速度仍−1 m/s²，所以这不是停住后永远不动，也不是停留2秒。',
      'In eight steps, state right positive and mark the current time. At 2 s, v=+2 m/s and speed=2 m/s, rightward. At 4 s both are zero with no instantaneous motion direction. At 6 s, v=−2 m/s and speed=2 m/s, leftward. Acceleration at 4 s remains −1 m/s², so this is neither permanent rest nor a two-second wait.',
    ],
    misconception: [
      'v=0只说明此刻位置变化率为0，不自动说明加速度0。反过来a=0可以保持非零速度。不要把“此刻不动”和“以后不动”当作同一结论。',
      'v=0 states zero position-change rate now, not automatically zero acceleration. Conversely, a=0 can preserve nonzero velocity. “Not moving at this instant” and “will remain still” are different claims.',
    ],
    realWorld: [
      '车上的速率表常只报快慢；机器人需要另外知道方向才能返回起点。看运动视频时，一个截图可以给位置，却通常不足以给速度：还需要相邻时刻及时间间隔。',
      'A vehicle speedometer commonly reports magnitude; a robot also needs direction to return home. One video frame can show position, but velocity generally needs nearby times and their time separation.',
    ],
    summary: [
      '负号管方向，大小管快慢；瞬时零速度不保证零加速度。',
      'The sign gives direction, magnitude gives rate; zero instantaneous velocity need not mean zero acceleration.',
    ],
    homeExperiment: [
      '在纸上画三条仪表卡：t=2、4、6 s。分别写v、|v|与方向，再给4 s卡补上a=−1 m/s²。用相邻时刻的箭头解释为什么小车会再次移动。',
      'Draw instrument cards for t=2, 4 and 6 s. Write v, |v| and direction, then add a=−1 m/s² to the 4 s card. Use nearby-time arrows to explain why the cart moves again.',
    ],
    vocabulary: [
      ['瞬时速度', 'instantaneous velocity'],
      ['速率', 'speed'],
      ['速度大小', 'velocity magnitude'],
      ['方向分量', 'directional component'],
    ],
    questions: [
      [
        'v=−3 m/s时速率？',
        'Speed when v=−3 m/s?',
        [
          ['−3 m/s', '−3 m/s'],
          ['0 m/s', '0 m/s'],
          ['3 m/s', '3 m/s'],
        ],
        2,
        '速率取速度大小，|−3|=3。',
        'Speed is magnitude: |−3|=3.',
      ],
      [
        '本模型4 s处加速度？',
        'Acceleration at 4 s in this model?',
        [
          ['−1 m/s²', '−1 m/s²'],
          ['必须0', 'It must be zero'],
          ['−1 m/s', '−1 m/s'],
        ],
        0,
        'v=4−t持续每秒减少1 m/s，经过0也没有停止变化。',
        'v=4−t continues decreasing by 1 m/s each second, including when it crosses zero.',
      ],
      [
        '只看一张照片通常缺什么才能估计速度？',
        'What is normally missing from a single photograph for a velocity estimate?',
        [
          ['小车颜色', 'Cart colour'],
          ['相邻位置及时间间隔', 'Nearby position and elapsed time'],
        ],
        1,
        '位置变化需要至少两个时刻，并且要有时间信息。',
        'Position change needs at least two times and timing information.',
      ],
    ],
    exit: [
      '向左5 m/s和向右3 m/s，哪个速率大？',
      'Leftward at 5 m/s or rightward at 3 m/s: which has greater speed?',
      [
        ['向左5 m/s', 'Leftward at 5 m/s'],
        [
          '向右3 m/s，因为正号大',
          'Rightward at 3 m/s because positive is larger',
        ],
      ],
      0,
      '比较速度大小5与3，而不是带符号分量的代数大小。',
      'Compare magnitudes 5 and 3, not algebraic ordering of signed components.',
    ],
  }),
  make({
    id: 'kinematics-choose-your-time-window',
    kind: 'kinematics-average',
    minutes: 23,
    title: [
      '同一趟路，平均速度为什么有三个答案？',
      'One journey. Why are there three average velocities?',
    ],
    subtitle: [
      '先圈定时间区间，再选择位移或路程。',
      'Choose the time interval before choosing displacement or distance.',
    ],
    hook: [
      '小车去程平均+2 m/s，回程平均−2 m/s，全程却平均0 m/s。朋友问“到底多快？”先让他把问题里的时间窗说完整。',
      'A cart’s outward mean velocity is +2 m/s, return mean −2 m/s, and whole-trip mean 0 m/s. A friend asks “How fast was it?” First ask them to state the time window.',
    ],
    prediction: [
      '8 s往返路程16 m、位移0，平均速度与平均速率？',
      'For an 8 s return trip with distance 16 m and displacement 0, what are mean velocity and mean speed?',
    ],
    predictions: [
      ['都是0', 'Both are zero'],
      ['都是2 m/s', 'Both are 2 m/s'],
      ['平均速度0，平均速率2 m/s', 'Mean velocity 0, mean speed 2 m/s'],
    ],
    explore: [
      '完整比较0–4、4–8和0–8 s三种区间。金线从所选区间起点开始，所有分子分母只用这段时间的数据。自由调整区间终点；回到起点观察Δt=0时为何平均量暂未定义。',
      'Fully compare 0–4, 4–8 and 0–8 s windows. Gold begins at the chosen start, and each numerator and denominator uses only that window. Freely adjust its endpoint; return to its start and notice why an average is not yet defined at Δt=0.',
    ],
    concept: [
      '平均速度=某段位移/这段时间，平均速率=这段路程/这段时间。必须先写区间，否则“平均”没有完整含义。平均量概括整个区间，不声称每一时刻都等于它；它也不是一般情况下把几个瞬时速度直接相加再除个数。若把多个时段合并，先加对应位移、路程与时间，或按时长加权。',
      'Mean velocity is interval displacement divided by its duration; mean speed uses interval distance over that same duration. State the interval first or the average is underspecified. An average summarizes a window without claiming equality at every instant. In general it is not the arithmetic mean of a few instantaneous readings. To combine intervals, sum their displacements, distances and durations, or weight by time.',
    ],
    formula: [
      '平均速度=Δx/Δt；平均速率=路程/Δt；Δt必须>0',
      'Mean velocity=Δx/Δt; mean speed=distance/Δt; Δt must be >0',
    ],
    example: [
      '八步先圈出0–4 s：x从3到11 m，Δx=+8 m、路程8 m、Δt=4 s，两种平均都是+2及2 m/s。4–8 s位移−8 m、路程8 m，平均速度−2而平均速率2。全程位移0、路程16、时间8 s，平均速度0、平均速率2；全程平均0没有否认小车移动。',
      'In eight steps, mark 0–4 s: x changes 3→11 m, displacement +8 m, distance 8 m, duration 4 s, giving mean velocity +2 and mean speed 2 m/s. For 4–8 s, displacement is −8 m and distance 8 m, so mean velocity −2 and mean speed 2. Whole-trip displacement 0, distance 16 and duration 8 s give 0 and 2 m/s. Zero whole-trip mean does not deny motion.',
    ],
    misconception: [
      '若向右1 m/s行驶1 s，再向右3 m/s行驶3 s，平均不是(1+3)/2=2，而是(1×1+3×3)/(1+3)=2.5 m/s。两段用时不同，不能当作同样权重。',
      'Travel right at 1 m/s for 1 s, then right at 3 m/s for 3 s. The mean is not (1+3)/2=2, but (1×1+3×3)/(1+3)=2.5 m/s. Unequal durations cannot receive equal weights.',
    ],
    realWorld: [
      '跑步记录中的整次平均、某圈平均和这一秒速度可以同时不同。出门去商店再回家，定位的平均速度可能0，运动手环的平均速率仍非零。',
      'A running session’s mean, lap mean and current speed can all differ. Visiting a shop and returning home can yield zero mean velocity while an activity tracker still shows nonzero mean speed.',
    ],
    summary: [
      '平均量必须带时间窗；位移和路程决定你回答的是哪一个问题。',
      'An average needs its time window; displacement and distance answer different questions.',
    ],
    homeExperiment: [
      '把0、4、8 s的3、11、3 m位置写成表，圈三种区间。每段写位移、路程、时间和两个平均量；最后给“平均速度0”加一句不会让家人误以为没运动的解释。',
      'Tabulate positions 3, 11 and 3 m at 0, 4 and 8 s and circle three windows. For each, list displacement, distance, duration and both means. Add an explanation of zero mean velocity that will not mislead family into thinking there was no motion.',
    ],
    vocabulary: [
      ['时间区间', 'time interval'],
      ['平均速度', 'mean velocity'],
      ['平均速率', 'mean speed'],
      ['按时间加权', 'time weighting'],
    ],
    questions: [
      [
        '全程位移0、时间8 s，平均速度？',
        'Full displacement 0 over 8 s: mean velocity?',
        [
          ['2 m/s', '2 m/s'],
          ['0 m/s', '0 m/s'],
        ],
        1,
        '0/8=0，使用位移而非路程。',
        '0/8=0; use displacement, not distance.',
      ],
      [
        '1 m/s走1 s，再3 m/s走3 s，平均速率？',
        '1 m/s for 1 s, then 3 m/s for 3 s: mean speed?',
        [
          ['2.5 m/s', '2.5 m/s'],
          ['2 m/s', '2 m/s'],
          ['4 m/s', '4 m/s'],
        ],
        0,
        '总路程10 m除总时间4 s。',
        'Total distance 10 m divided by total duration 4 s.',
      ],
      [
        '刚开始区间，Δt=0，应该填平均0吗？',
        'At the interval’s exact start, Δt=0. Should the average be zero?',
        [
          ['应该，没走路就是0', 'Yes; no travel means zero'],
          ['不，除零尚未定义', 'No; division by zero is undefined'],
        ],
        1,
        '没有正时间区间不能定义该区间平均量。',
        'An interval average requires positive elapsed time.',
      ],
    ],
    exit: [
      '两人报告不同平均速度，先核对什么？',
      'Two people report different mean velocities. What should you check first?',
      [
        [
          '区间起末、位移、时间及方向约定',
          'Interval endpoints, displacement, duration and direction convention',
        ],
        ['只看谁报的数字大', 'Only whose number is larger'],
      ],
      0,
      '这些条件决定两人是否回答同一个问题。',
      'These conditions determine whether they answered the same question.',
    ],
  }),
  make({
    id: 'kinematics-negative-does-not-mean-slower',
    kind: 'kinematics-acceleration',
    minutes: 23,
    title: [
      '加速度为负，车一定越来越慢吗？',
      'Does negative acceleration always mean slowing down?',
    ],
    subtitle: [
      '把速度方向与变化方向放在一起看。',
      'Compare velocity direction with the direction of its change.',
    ],
    hook: [
      '两辆模型车的加速度都是−0.5 m/s²。一辆向右，另一辆向左：你看到前者逐渐慢下来，后者越来越快。相同负号为什么能演出相反的快慢故事？',
      'Two model carts both have acceleration −0.5 m/s². One moves right and the other left: the first slows while the second speeds up. How can the same minus sign produce opposite speed stories?',
    ],
    prediction: [
      '向右为正，v=−1 m/s、a=−0.5 m/s²，在接下来短时间内速率如何？',
      'Right positive, with v=−1 m/s and a=−0.5 m/s². What happens to speed over the next short interval?',
    ],
    predictions: [
      ['增大，速度越来越负', 'It increases as velocity becomes more negative'],
      ['减小，因为a为负', 'It decreases because a is negative'],
      ['不变，因为方向没变', 'It is unchanged because direction is unchanged'],
    ],
    explore: [
      '完整比较向右加速、向右减速、向左加速三种6 s运动。读速度线的斜率与当前速率，不只盯加速度符号。自由改a，尝试让第一辆车先减速、转向，再加速；检查转向点的v与a是否都为0。',
      'Fully compare 6 s of rightward speeding up, rightward slowing down and leftward speeding up. Read velocity-line gradient and current speed rather than acceleration sign alone. Change a freely to make the first cart slow, turn and then speed up; check whether both v and a are zero at the turn.',
    ],
    concept: [
      '加速度描述速度改变多快及向哪个方向改变。直线运动里，v和a同号时速率增大，异号时速率减小——判断某个短时间段时要检查是否跨过v=0转向点。a负只说明速度分量在减小，例如从−1到−4，是向左越来越快。v=0时要看后续变化；非零a可让物体从该瞬间重新增加速率。',
      'Acceleration describes how rapidly velocity changes and in what direction. In straight-line motion, matching signs of v and a increase speed; opposite signs decrease it, while a short interval must be checked for crossing a v=0 turn. Negative a only means the velocity component decreases: −1→−4 is leftward speeding up. At v=0, inspect subsequent change; nonzero a can make speed increase again after that instant.',
    ],
    formula: [
      '匀加速模型v=u+at；比较快慢看|v|，不能只看a的正负',
      'Constant-acceleration model v=u+at; judge speed using |v|, not the sign of a alone',
    ],
    example: [
      '按八步给三车写向右为正、初速度和6 s时间。u=+1、a=+0.5：末速度+4，速率1→4；u=+4、a=−0.5：末速度+1，速率4→1；u=−1、a=−0.5：末速度−4，速率1→4（SI）。后两车加速度相同，但速度方向不同。所有图像与位置都由同一个匀加速度模型生成。',
      'In eight steps, state right positive, initial velocity and the 6 s window. With u=+1 and a=+0.5, final v=+4 and speed grows 1→4. With u=+4 and a=−0.5, final v=+1 and speed falls 4→1. With u=−1 and a=−0.5, final v=−4 and speed grows 1→4 (SI). The last two share acceleration but differ in velocity direction. Their graphs and positions come from the same constant-acceleration model.',
    ],
    misconception: [
      '“加速度很大”不等于“此刻速度很大”。车可以从静止开始有加速度，也可以以很大恒定速度行驶而a=0。本课只描述给定运动；要解释为什么这样变化，下一单元需要研究合力。',
      'Large acceleration does not mean large present velocity. A cart can start from rest with acceleration or move at high constant velocity with a=0. This lesson describes prescribed motion; explaining its cause requires net force in the next unit.',
    ],
    realWorld: [
      '坐车时启动和刹车的感觉与速度改变有关，匀速直行时即使快也可能平稳。转弯时即使速率不变，速度方向改变也有加速度；那是下一步二维运动的故事。',
      'Starting and braking sensations relate to changing velocity; fast steady straight travel can feel smooth. Turning can involve acceleration even at constant speed because direction changes; that belongs to the coming two-dimensional story.',
    ],
    summary: [
      '加速度说速度怎样变；是否变快还要同时看速度。',
      'Acceleration describes how velocity changes; deciding whether speed grows also requires velocity.',
    ],
    homeExperiment: [
      '用纸箭头表示三组速度：+1→+4、+4→+1、−1→−4。标右为正、间隔6 s。为每组写变化量与加速度，再只比较箭头长度解释快慢；无需坐车做急刹试验。',
      'Use paper arrows for +1→+4, +4→+1 and −1→−4. Mark right positive and 6 s separation. Write each velocity change and acceleration, then compare arrow lengths for speed; no sudden-braking vehicle trial is needed.',
    ],
    vocabulary: [
      ['加速度', 'acceleration'],
      ['初速度', 'initial velocity'],
      ['同号', 'same sign'],
      ['平滑转向', 'smooth reversal'],
    ],
    questions: [
      [
        'v从−1变到−4 m/s，速率怎样？',
        'Velocity changes −1→−4 m/s. What happens to speed?',
        [
          ['减小', 'It decreases'],
          ['增大1→4 m/s', 'It increases 1→4 m/s'],
        ],
        1,
        '取大小比较1与4；负号是方向。',
        'Compare magnitudes 1 and 4; the minus sign gives direction.',
      ],
      [
        'v=+4、a=−0.5（SI），未到转向点，速率怎样？',
        'v=+4 and a=−0.5 (SI), before any turn. How does speed change?',
        [
          ['减小', 'It decreases'],
          ['增大', 'It increases'],
          ['保持不变', 'It stays unchanged'],
        ],
        0,
        '速度仍为正但数值减小。',
        'Velocity remains positive while its value decreases.',
      ],
      [
        '恒定速度+20 m/s直线运动，加速度？',
        'Straight motion at constant +20 m/s: acceleration?',
        [
          ['20 m/s²', '20 m/s²'],
          ['0 m/s²', '0 m/s²'],
        ],
        1,
        '加速度看变化率，速度没有变化所以为0。',
        'Acceleration measures change rate; unchanged velocity gives zero.',
      ],
    ],
    exit: [
      '只知道a=−0.5 m/s²，能决定此刻是否变慢吗？',
      'Knowing only a=−0.5 m/s², can you decide whether speed is decreasing now?',
      [
        [
          '不能，还需速度方向及转向情况',
          'No; velocity direction and possible turning also matter',
        ],
        [
          '能，负加速度总是刹车',
          'Yes; negative acceleration always means braking',
        ],
      ],
      0,
      '方向约定和当前v决定如何解读速率变化。',
      'The direction convention and current v determine how speed changes.',
    ],
  }),
  make({
    id: 'kinematics-a-change-per-second',
    kind: 'kinematics-rate',
    minutes: 24,
    title: [
      '同样增加4 m/s，用时不同，改变有多急？',
      'The same 4 m/s increase takes different times. How rapid is the change?',
    ],
    subtitle: [
      '从两个速度读数构造Δv/Δt，而不是只除末速度。',
      'Build Δv/Δt from two readings instead of dividing final velocity alone.',
    ],
    hook: [
      '两台移动摄像车都从2 m/s变到6 m/s。一台用2 s，另一台用4 s。终点仪表一样，但谁的速度改变更迅速？你需要的不只是最后那个6。',
      'Two camera carts both change from 2 to 6 m/s. One takes 2 s, the other 4 s. Their final readouts match, but which changes velocity more rapidly? The final six alone is not enough.',
    ],
    prediction: [
      '相同Δv=4 m/s，时间2 s改4 s，平均加速度怎样？',
      'For the same Δv=4 m/s, change duration from 2 to 4 s. What happens to mean acceleration?',
    ],
    predictions: [
      ['变为两倍', 'It doubles'],
      ['不变，末速度相同', 'Unchanged because final velocity matches'],
      ['减半', 'It halves'],
    ],
    explore: [
      '完整比较2→6 m/s用2 s、用4 s，以及6→2 m/s用2 s。三条线共用时间与速度刻度；计算先减初速度，再除时间。自由改时长，注意保留了初末速度，却改变了实际位移。',
      'Fully compare 2→6 m/s over 2 s and 4 s, then 6→2 m/s over 2 s. Shared time/velocity scales support fair gradient comparisons. Subtract initial velocity before dividing by time. Freely change duration and notice that endpoint velocities stay fixed while displacement changes.',
    ],
    concept: [
      '平均加速度=速度变化量/对应时间。Δv=v末−v初，也要保留方向与单位；不能一般地用v末/Δt，除非已知初速度0。本工作台假设每个区间的加速度恒定，因此区间平均值也等于其中每个瞬时值。若真实v–t线是曲线，两个端点只能给这一段平均加速度，不能证明每一秒都一样。',
      'Mean acceleration is velocity change divided by its corresponding duration. Δv=v_end−v_start retains direction and units. Final velocity divided by duration works only if initial velocity is known to be zero. This workbench assumes constant acceleration in each interval, so its mean also equals every instantaneous value within it. If a real v–t curve bends, its endpoints give only that interval’s mean, not proof that every second is the same.',
    ],
    formula: [
      'a平均=Δv/Δt=(v末−v初)/Δt；(m/s)/s=m/s²',
      'Mean a=Δv/Δt=(v_end−v_start)/Δt; (m/s)/s=m/s²',
    ],
    example: [
      '按八步列u=2、v=6 m/s及Δt=2 s，未知为平均a：Δv=4 m/s，a=4/2=2 m/s²。改4 s得到1 m/s²；6→2用2 s得到−2 m/s²。匀加速度时代回v=u+aΔt核验，三种都回到给定末速度。单位m/s²表示每秒速度改变多少m/s，不是位移每秒的平方。',
      'In eight steps list u=2, v=6 m/s and Δt=2 s, with mean a unknown. Δv=4 m/s and a=4/2=2 m/s². A 4 s window gives 1 m/s²; 6→2 over 2 s gives −2 m/s². Under constant acceleration, substitute into v=u+aΔt; each recovers its stated final velocity. m/s² means velocity change in m/s per second, not a distance squared per second.',
    ],
    misconception: [
      '例如另一条曲线v=2+t²（SI）：0–1 s的平均a是1，1–2 s是3，全段0–2 s是2 m/s²。全段平均2不能复制到每个小区间；不同区间读数反而说明不能套用恒定a的假设。',
      'For another curve v=2+t² (SI), mean a over 0–1 s is 1, over 1–2 s is 3, and over 0–2 s is 2 m/s². The whole-window mean cannot be copied into each subinterval; differing subinterval values show that constant a is unsuitable.',
    ],
    realWorld: [
      '比较电梯、机器人和车辆的启动记录时，必须同时报告初末速度及用时。单看末速度相同，既不能断定加速度相同，也不能断定走过距离相同。',
      'Comparing elevator, robot or vehicle start logs requires initial/final velocities and duration. Matching final velocities proves neither matching acceleration nor matching displacement.',
    ],
    summary: [
      '先求带方向的速度差，再除同一段时间；平均值要附模型条件。',
      'Find the signed velocity difference, then divide by the matching duration; attach model conditions to a mean.',
    ],
    homeExperiment: [
      '画三条共用0–6 s、−8至8 m/s刻度的速度线。圈初末读数、标Δv与Δt，算加速度并代回末速度。给一条额外的弯曲线标两个不同区间，说明为何平均不一定恒定。',
      'Draw three velocity lines sharing 0–6 s and −8 to 8 m/s scales. Circle endpoints, label Δv and Δt, calculate acceleration and substitute back. Add a curved line with two different intervals to explain why a mean need not stay constant.',
    ],
    vocabulary: [
      ['速度变化量', 'velocity change'],
      ['平均加速度', 'mean acceleration'],
      ['恒定加速度', 'constant acceleration'],
      ['代回核验', 'substitution check'],
    ],
    questions: [
      [
        '2→6 m/s用2 s，a平均？',
        '2→6 m/s over 2 s: mean a?',
        [
          ['3 m/s²', '3 m/s²'],
          ['2 m/s²', '2 m/s²'],
          ['4 m/s²', '4 m/s²'],
        ],
        1,
        '(6−2)/2=2，先减初速度。',
        '(6−2)/2=2; subtract initial velocity first.',
      ],
      [
        '6→2 m/s用2 s，a平均？',
        '6→2 m/s over 2 s: mean a?',
        [
          ['−2 m/s²', '−2 m/s²'],
          ['+2 m/s²', '+2 m/s²'],
          ['−2 m/s', '−2 m/s'],
        ],
        0,
        '速度差为−4 m/s，除以2 s。',
        'Velocity change is −4 m/s, divided by 2 s.',
      ],
      [
        '曲线两端求出平均a，能认为每一时刻都等于它吗？',
        'An endpoint calculation gives mean a for a curve. Is every instantaneous a equal to it?',
        [
          ['一定相等', 'Always equal'],
          ['不能，需检验恒定模型', 'No; a constant model needs evidence'],
        ],
        1,
        '平均关系不自动证明变化率恒定。',
        'A mean relation does not prove constant change rate.',
      ],
    ],
    exit: [
      '两个启动过程末速度都6 m/s，什么数据还必须保留？',
      'Two starts end at 6 m/s. What else must be retained?',
      [
        [
          '初速度、时间区间及方向约定',
          'Initial velocities, time windows and direction convention',
        ],
        ['只需车的颜色', 'Only cart colour'],
      ],
      0,
      '这些量才足以构造带方向的Δv/Δt。',
      'These quantities are needed to form signed Δv/Δt.',
    ],
  }),
];
