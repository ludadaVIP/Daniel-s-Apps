import { t, q, type Lesson } from './schema';
export const motionLessons: Lesson[] = [
  {
    id: 'position-and-reference',
    stage: 1,
    unit: 'motion',
    kind: 'reference',
    minutes: 16,
    title: t('你没走，为什么也在移动？', 'Not walking, yet moving?'),
    subtitle: t(
      '先说相对谁，再谈位置与运动。',
      'Name the reference before describing motion.',
    ),
    hook: t(
      '你站在匀速行驶的车厢里。旁边朋友说你没动，站台上的人却说你在向前。谁说得对？',
      'You stand inside a train moving steadily. A friend beside you says you are still; someone on the platform says you move forward. Who is right?',
    ),
    prediction: t(
      '同一时刻，车厢中的你可以相对车厢静止、相对地面运动吗？',
      'Can you be still relative to the train and moving relative to the ground at the same time?',
    ),
    predictions: [
      t('可以，要说明参考物', 'Yes: name the reference'),
      t('不能，运动只有一种说法', 'No: motion has only one description'),
      t('只有站台上的人能判断', 'Only the platform observer can decide'),
    ],
    explore: t(
      '先不走动，分别用地面和车厢参考系播放。再选车厢参考系，让乘客向前或向后走一次。比较人物的位置读数与相对运动；每次播放结束自动记录。',
      'Keep the passenger standing and play once in each frame. Then use the train frame and make the passenger walk forward or backward. Compare position readings and relative motion; each completed playback records a case.',
    ),
    concept: t(
      '位置需要参考点、方向和单位。例如“距站台起点向右5 m”。运动指位置随时间改变，必须说明相对哪个参考物。站在车里的人相对车厢位置不变，却随车相对地面移动。换参考系不会改变真实事件，只改变描述它的坐标与相对运动。',
      'Position needs an origin, direction and units: for example, 5 m to the right of the platform origin. Motion is position changing with time, relative to a stated reference. A standing passenger keeps the same train-relative position but moves with the train relative to the ground. Switching frames changes coordinates and relative-motion descriptions, not the event.',
    ),
    example: t(
      '模型车速为相对地面2 m/s，乘客最初位于车厢左端向右5 m。站立4 s后，相对地面的位置是13 m；相对车厢左端仍为5 m。若相对车厢向后走1 m/s，4 s后车厢内位置是1 m，但相对地面仍向前移动到9 m。',
      'The train moves at 2 m/s relative to the ground. The passenger starts 5 m right of its left end. After standing for 4 s, ground position is 13 m while train-relative position remains 5 m. Walking backward at 1 m/s relative to the train gives a train position of 1 m after 4 s, yet a ground position of 9 m: still moving forward relative to the ground.',
    ),
    misconception: t(
      '“静止”不是绝对标签；“相对车厢向后走”也不一定表示相对地面向后。不要只凭屏幕上的左右移动判断真实速度，要先看画面选择的参考系。这里仅讨论普通日常速度，不涉及相对论。',
      'Stillness is not an absolute label. Walking backward relative to the train need not mean moving backward relative to the ground. Name the chosen frame before interpreting screen motion. This model concerns ordinary everyday speeds, not relativity.',
    ),
    realWorld: t(
      '在旁边的公交车开动时，你有时会短暂觉得自己的车在动。观察地面或建筑物，能帮助确认你使用了哪个参考物。',
      'When a neighbouring bus departs, you may briefly feel your own bus move. Ground or building observations help identify your reference.',
    ),
    summary: t(
      '位置和运动的描述，都要交代参考点、方向与参考物。',
      'Describe the origin, direction and reference when talking about position and motion.',
    ),
    homeExperiment: t(
      '在桌面上缓慢移动一张纸，纸上放一个轻小积木。让家人分别描述积木相对纸和相对桌子的运动，再试着让积木相对纸缓慢向后移动。不需要在真实交通工具中走动。',
      'Slowly slide paper on a table with a light block on it. Describe the block relative to the paper and the table, then move it gently backward relative to the paper. Use the tabletop model rather than walking in a real moving vehicle.',
    ),
    vocabulary: [
      t('位置', 'position'),
      t('参考物', 'reference object'),
      t('参考系', 'reference frame'),
      t('相对运动', 'relative motion'),
    ],
    questions: [
      q(
        '站在匀速车厢中的人，相对车厢怎样？',
        'A standing passenger in a steadily moving train is what relative to the train?',
        [
          ['静止', 'At rest'],
          ['一定向后', 'Always moving backward'],
        ],
        0,
        '乘客与车厢的位置关系保持不变。',
        'The passenger’s position relative to the train is unchanged.',
      ),
      q(
        '“在右边5 m”还缺什么重要信息？',
        'What important detail is missing from “5 m to the right”?',
        [
          ['衣服颜色', 'Clothing colour'],
          ['相对哪个起点', 'The origin being used'],
        ],
        1,
        '坐标读数需要明确起点。',
        'A coordinate needs a stated origin.',
      ),
      q(
        '向前2 m/s的车里，相对车向后走1 m/s，相对地面会怎样？',
        'A train goes forward at 2 m/s; a passenger walks backward at 1 m/s relative to it. What happens relative to the ground?',
        [
          ['仍向前，1 m/s', 'Still forward, at 1 m/s'],
          ['一定向后，1 m/s', 'Always backward, at 1 m/s'],
        ],
        0,
        '日常直线模型中，2−1=1 m/s，方向仍向前。',
        'In this everyday straight-line model, 2−1=1 m/s, still forward.',
      ),
    ],
    exit: q(
      '朋友说“我绝对没动”，只因为他坐在座位上。如何说得更准确？',
      'A friend says “I absolutely did not move” because he stayed seated. What is a better description?',
      [
        [
          '相对座位静止；相对地面的运动要另外看',
          'Still relative to the seat; ground-relative motion needs a separate description',
        ],
        [
          '只要坐着，相对任何物体都静止',
          'Seated means still relative to everything',
        ],
      ],
      0,
      '参考物不同，运动描述可以不同。',
      'Different references can give different descriptions of motion.',
    ),
  },
  {
    id: 'distance-and-displacement',
    stage: 1,
    unit: 'motion',
    kind: 'journey',
    minutes: 16,
    title: t('回到原点，真的没走路吗？', 'Back at the start: no walking?'),
    subtitle: t(
      '把走过的路与位置的改变分开。',
      'Separate the travelled path from a position change.',
    ),
    hook: t(
      '你从书桌走6 m去拿球，再沿原路回来。你离书桌0 m，但脚明明走累了：这两种数字矛盾吗？',
      'You walk 6 m from your desk to collect a ball, then return along the same path. You end 0 m from the desk, but your feet walked. Are the numbers contradictory?',
    ),
    prediction: t(
      '走到6 m处，再回起点，累计路程与位移分别是多少？',
      'After walking 6 m out and back, what are cumulative distance and displacement?',
    ),
    predictions: [
      t('12 m与0 m', '12 m and 0 m'),
      t('都为0 m', 'Both 0 m'),
      t('都为12 m', 'Both 12 m'),
    ],
    explore: t(
      '把时间移到3 s，记录到达球架；再移到6 s，记录回到书桌。也可以播放整个往返。注意回程中哪一个读数减少，哪一个继续增加。',
      'Move time to 3 s and record arrival at the ball shelf, then to 6 s and record the return to the desk. You can also play the whole trip. Which reading decreases on the return, and which keeps growing?',
    ),
    concept: t(
      '路程是沿实际路径走过的总长度，是非负的累计量。位移是从起点指向终点的位置改变，有方向。直线上选向右为正，位移等于终点位置减起点位置。往返的路程会累加，而位移可以回到零；零位移不能说明过程中一直静止。',
      'Distance is the total length travelled along the path, a non-negative accumulated quantity. Displacement is the directed change from initial to final position. On a straight line with right positive, displacement is final minus initial position. Distance accumulates on an out-and-back trip, while displacement can return to zero. Zero displacement does not imply being still throughout.',
    ),
    example: t(
      '模型从0 m出发，以2 m/s走到6 m，再以同样速率返回。3 s时路程6 m、位移+6 m；5 s时位置2 m、路程10 m、位移+2 m；6 s时路程12 m、位移0 m。路程告诉你走了多少，位移告诉你终点相对起点在哪里。',
      'The model starts at 0 m, walks to 6 m at 2 m/s and returns at the same speed. At 3 s: distance 6 m, displacement +6 m. At 5 s: position 2 m, distance 10 m, displacement +2 m. At 6 s: distance 12 m, displacement 0 m. Distance describes how much you travelled; displacement describes the final position relative to the start.',
    ),
    misconception: t(
      '向左走，不会让累计路程变负或减小。正负号表示选定方向，不表示好坏。位置2 m不一定就是位移2 m：只有起点位置是0 m时，本例两者数字才相同。',
      'Walking left does not make accumulated distance negative or reduce it. Signs express a chosen direction, not quality. A position of 2 m is not always a displacement of 2 m; they match here only because the initial position is 0 m.',
    ),
    realWorld: t(
      '跑操场一圈回到原点，计步器仍记录活动量；导航同时关心路线长度和终点位置。路线与两点间的直线改变可以很不同。',
      'A lap returns you to the start while a step counter still records activity. Navigation considers both route length and destination. Path length and the straight-line position change can differ greatly.',
    ),
    summary: t(
      '路程记整条路径；位移比较起点与终点，并带方向。',
      'Distance records the whole path; displacement compares start and finish with direction.',
    ),
    formula: t(
      '直线位移 Δx = x终 − x初；路程把每段长度相加',
      'Straight-line displacement Δx = final x − initial x; distance adds segment lengths',
    ),
    homeExperiment: t(
      '在安全的平坦室内选起点，向前走几步再原路返回，用地面标记比较路程和终点。保持普通步速，别在楼梯或道路上做。可以用积木在纸画的数轴上移动来代替真人走路。',
      'Choose a start in a clear, level indoor space. Walk a few steps out and back, using marks to compare path length and endpoint. Walk normally, avoiding stairs and roads. A block on a paper number line works too.',
    ),
    vocabulary: [
      t('路程', 'distance travelled'),
      t('位移', 'displacement'),
      t('起点与终点', 'start and finish'),
      t('正方向', 'positive direction'),
    ],
    questions: [
      q(
        '从0 m走到4 m，再回到1 m，路程是多少？',
        'You go from 0 m to 4 m, then back to 1 m. What is the distance?',
        [
          ['1 m', '1 m'],
          ['7 m', '7 m'],
          ['5 m', '5 m'],
        ],
        1,
        '去程4 m，回程3 m，共7 m。',
        'The outward path is 4 m and the return 3 m: total 7 m.',
      ),
      q(
        '同一趟路从0 m到4 m再到1 m，位移是多少？',
        'For that same trip from 0 m to 4 m to 1 m, what is displacement?',
        [
          ['+1 m', '+1 m'],
          ['+7 m', '+7 m'],
          ['−7 m', '−7 m'],
        ],
        0,
        '终点减起点：1−0=+1 m。',
        'Final minus initial: 1−0=+1 m.',
      ),
      q(
        '从5 m位置走到2 m位置，位移是什么？',
        'You move from position 5 m to position 2 m. What is displacement?',
        [
          ['+2 m', '+2 m'],
          ['−3 m', '−3 m'],
          ['+7 m', '+7 m'],
        ],
        1,
        '2−5=−3 m，表示沿负方向改变位置。',
        '2−5=−3 m: a position change in the negative direction.',
      ),
    ],
    exit: q(
      '跑了一圈回到起点，能用“位移为零”说明没有运动吗？',
      'After a lap, can zero displacement prove no motion occurred?',
      [
        ['不能，累计路程可以很大', 'No: accumulated distance can be large'],
        [
          '能，零位移一定表示没动',
          'Yes: zero displacement always means no motion',
        ],
      ],
      0,
      '位移只比较端点，不能代替整个过程。',
      'Displacement compares endpoints, not the whole history.',
    ),
  },
  {
    id: 'average-speed',
    stage: 1,
    unit: 'motion',
    kind: 'average',
    minutes: 17,
    title: t(
      '去得快，回来慢，平均怎么算？',
      'Fast out, slow back: what is the average?',
    ),
    subtitle: t(
      '总路程除以总时间，别忘了停留。',
      'Total distance over total time, including stops.',
    ),
    hook: t(
      '去拿球时6 m用3 s，回来6 m用6 s。两段速率是2与1 m/s，平均就是1.5吗？如果还在球架前停了3 s呢？',
      'You cover 6 m in 3 s to collect a ball, then 6 m in 6 s coming back. The segment speeds are 2 and 1 m/s: is the trip average 1.5? What if you pause at the shelf for 3 s?',
    ),
    prediction: t(
      '两段距离相同、用时不同，整趟平均速率应该怎样算？',
      'With equal segment distances but different times, how should you calculate the trip average speed?',
    ),
    predictions: [
      t('总路程÷总时间', 'Total distance ÷ total time'),
      t('把两个速率直接平均', 'Just average the two speeds'),
      t('只看更快的那段', 'Use only the faster segment'),
    ],
    explore: t(
      '分别播放不停留和停留3 s的往返。比较分段数据、总路程与总时间。两种完整播放都记录后，尝试解释为何停留降低全程平均速率。',
      'Play complete trips with no pause and a 3 s pause. Compare segment data, total distance and total time. After recording both playbacks, explain why a pause lowers the whole-trip average.',
    ),
    concept: t(
      '一段时间内的平均速率等于总路程除以总时间。全程时间要包括定义的行程内所有停留。直接把两个速率平均，只有两段持续时间相同等特定条件才成立。平均速度则使用位移与时间；本课主要研究平均速率。中文日常说“速度”，做题时要确认分子是路程还是位移。',
      'Average speed over an interval is total distance divided by total elapsed time, including stops within the defined trip. A simple arithmetic mean of two speeds works under special conditions such as equal segment durations. Average velocity uses displacement instead. This lesson focuses on speed; check whether a problem uses distance or displacement, especially when everyday Chinese calls both “速度”.',
    ),
    example: t(
      '不停留：总路程6+6=12 m，总时间3+6=9 s，平均速率12÷9≈1.33 m/s，而非1.5。停留3 s：总时间12 s，平均速率1.00 m/s。两次都回到起点，所以全程平均速度为0；平均速率仍大于0。',
      'Without a pause: distance 6+6=12 m, time 3+6=9 s, average speed 12÷9≈1.33 m/s, not 1.5. With a 3 s pause: total time 12 s and speed 1.00 m/s. Both finish at the start, so whole-trip average velocity is zero while average speed remains positive.',
    ),
    misconception: t(
      '平均速率不表示每一刻都以这个速率运动。暂停时瞬时速率为零，但全程平均速率仍可不为零。若题目只问“移动时的平均速率”，所选时间区间不同，必须明确自己包含了哪些时间。',
      'An average speed does not mean that speed at every moment. During a pause, instantaneous speed is zero while the whole-trip average can be positive. “Average while moving” uses a different selection of time; state what your interval includes.',
    ),
    realWorld: t(
      '步行上学、配送或等电梯时，预计到达时间要考虑停留。测自己走路时，可以分别报告含停留的行程平均速率与连续步行的平均速率。',
      'Arrival-time estimates for school walks, deliveries or lift waits must consider stops. You can separately report a whole-trip average including stops and an uninterrupted-walking average.',
    ),
    summary: t(
      '先画清行程与时间区间，再用总路程÷总时间。',
      'Define the trip and interval, then divide total distance by total elapsed time.',
    ),
    formula: t(
      '平均速率 = 总路程 ÷ 总时间（包含行程内停留）',
      'Average speed = total distance ÷ total elapsed time (including stops in the trip)',
    ),
    homeExperiment: t(
      '在安全的平坦室内，沿量好的短路线正常步行，再加一次固定停留，用时比较两趟平均速率。距离、停留和总时间分开记录。不需要冲刺；家长可以帮助计时。',
      'Walk a measured short route normally in a clear, level indoor space, then repeat with a planned pause. Record distance, pause and total time separately and compare averages. No sprinting; a parent can help time it.',
    ),
    vocabulary: [
      t('平均速率', 'average speed'),
      t('总时间', 'elapsed time'),
      t('瞬时速率', 'instantaneous speed'),
      t('平均速度', 'average velocity'),
    ],
    questions: [
      q(
        '先走10 m用5 s，再走10 m用10 s，平均速率是多少？',
        'You travel 10 m in 5 s, then 10 m in 10 s. What is average speed?',
        [
          ['20÷15≈1.33 m/s', '20÷15≈1.33 m/s'],
          ['1.5 m/s', '1.5 m/s'],
          ['2 m/s', '2 m/s'],
        ],
        0,
        '合并路程与时间，不直接平均两个速率。',
        'Combine distance and time rather than directly averaging speeds.',
      ),
      q(
        '12 m行程移动用9 s，停留3 s，全程平均速率是多少？',
        'A 12 m trip has 9 s moving and a 3 s pause. What is whole-trip average speed?',
        [
          ['12÷9 m/s', '12÷9 m/s'],
          ['1 m/s', '1 m/s'],
          ['0 m/s', '0 m/s'],
        ],
        1,
        '全程时间9+3=12 s，所以12÷12=1 m/s。',
        'Elapsed time is 9+3=12 s, so 12÷12=1 m/s.',
      ),
      q(
        '往返后平均速度为0，平均速率也必定为0吗？',
        'After an out-and-back trip, average velocity is zero. Must average speed be zero too?',
        [
          ['不，路程仍大于0', 'No: distance is still positive'],
          ['是，它们永远相同', 'Yes: they always match'],
        ],
        0,
        '平均速度用位移，平均速率用路程。',
        'Average velocity uses displacement; average speed uses distance.',
      ),
    ],
    exit: q(
      '两段各走4 s，速率分别为1与3 m/s，能直接平均成2 m/s吗？',
      'Two segments each last 4 s, at 1 and 3 m/s. Can their trip speed be directly averaged to 2 m/s?',
      [
        [
          '可以；总路程16 m，总时间8 s',
          'Yes: total distance 16 m, total time 8 s',
        ],
        ['任何情况都不能', 'Never'],
      ],
      0,
      '等时间时，每段速率对总路程的贡献按同样时间计算，所以算术平均在这里成立。',
      'With equal durations, each speed contributes over the same time, so the arithmetic mean works here.',
    ),
  },
  {
    id: 'reading-motion-graphs',
    stage: 1,
    unit: 'motion',
    kind: 'motion-graph',
    minutes: 17,
    title: t(
      '线往下走，是人往地下走吗？',
      'A line slopes down: walking underground?',
    ),
    subtitle: t(
      '同一趟往返，两张图讲不同的信息。',
      'Two graphs tell different parts of one trip.',
    ),
    hook: t(
      '你去球架、停一下、再回来。位置—时间图最后下降，累计路程—时间图却继续上升。哪张图错了？',
      'You walk to a shelf, pause and return. The position–time graph slopes down at the end, while accumulated distance–time keeps rising. Which graph is wrong?',
    ),
    prediction: t(
      '回程时，位置读数减少，累计路程会怎样？',
      'During the return, position decreases. What happens to accumulated distance?',
    ),
    predictions: [
      t('继续增加', 'Keeps increasing'),
      t('也减少', 'Also decreases'),
      t('必定不变', 'Must stay unchanged'),
    ],
    explore: t(
      '先在4 s停留处记录，再到7 s回程处分别记录位置图与累计路程图。移动时间滑块，看图上的点、位置标记与读数保持对应。',
      'Record the pause at 4 s, then record both graph types during the return at 7 s. Move the time slider and compare the graph point, position marker and readings.',
    ),
    concept: t(
      '先看横纵轴和单位，再解释线。位置—时间图的纵轴是位置；向下的线表示位置随时间减小，在本例是向起点返回。累计路程—时间图记录已经走过的路径长度，所以不会因返回而下降。两图的水平段都表示该时间段内没有移动。直线斜率大小与该段速率有关，但方向信息要看图的种类。',
      'Read axes and units before interpreting a line. A position–time graph plots position: a downward slope means position decreases, here returning toward the start. An accumulated distance–time graph records travelled path length and does not fall when returning. Horizontal segments mean no movement during that interval. The magnitude of a straight segment’s slope relates to speed, but direction information depends on the graph type.',
    ),
    example: t(
      '0–3 s从0走到6 m；3–5 s停留；5–8 s回原点。7 s时位置2 m、累计路程10 m；8 s时位置0 m、累计路程12 m。回程两图一降一升，却描述同一件事。停留2 s时，两图都水平。',
      'From 0–3 s: 0 to 6 m; from 3–5 s: pause; from 5–8 s: return. At 7 s: position 2 m, distance 10 m. At 8 s: position 0 m, distance 12 m. The return gives falling and rising lines for the same event. Both graphs are horizontal during the 2 s pause.',
    ),
    misconception: t(
      '图线不是道路形状，水平线不表示道路平坦，下降线不表示下坡。不要把位置图下降读成“速率负了”：它表示所选正方向的位置变化为负。累计路程图不显示左右方向。',
      'A graph line is not the road’s shape: horizontal does not mean level ground and downward does not mean downhill. A falling position graph indicates change in the negative chosen direction, not negative speed. Accumulated distance does not show left/right direction.',
    ),
    realWorld: t(
      '运动手表的距离图不断累积；追踪机器人位置时则需要方向与起点。看任何图，都先检查它把什么放在纵轴上。',
      'A sports watch accumulates distance, while robot tracking needs position relative to an origin and direction. Check the vertical variable before reading any graph.',
    ),
    summary: t(
      '同一段运动可以有不同图像；先看变量与单位，再用读数解释过程。',
      'One motion can have different graphs: identify variables and units, then explain the story with readings.',
    ),
    homeExperiment: t(
      '把纸面数轴当路线，用积木从0移动到6、暂停、再回0。每隔相同时间记录位置和累计路程，画两张图。可以慢慢做，不必用真人按模型精确行走。',
      'Use a paper number line and move a block from 0 to 6, pause and return. At equal time intervals, record position and accumulated distance, then draw both graphs. Work slowly; no need to walk precisely like the model.',
    ),
    vocabulary: [
      t('位置—时间图', 'position–time graph'),
      t('累计路程', 'accumulated distance'),
      t('水平段', 'horizontal segment'),
      t('斜率', 'slope'),
    ],
    questions: [
      q(
        '位置—时间图从6 m下降到2 m，说明什么？',
        'A position–time graph falls from 6 m to 2 m. What does it show?',
        [
          [
            '沿选定的负方向改变位置',
            'Position changes in the chosen negative direction',
          ],
          ['必定走下坡', 'Definitely walking downhill'],
        ],
        0,
        '纵轴是位置，不是道路高度。',
        'The vertical axis is position, not road height.',
      ),
      q(
        '累计路程—时间图的一段水平线说明什么？',
        'What does a horizontal accumulated distance–time segment show?',
        [
          ['这段时间没有新增路程', 'No extra distance during that interval'],
          ['地面没有坡度', 'The ground has no slope'],
        ],
        0,
        '路程不增加，对应停留；它不表示地形。',
        'No accumulated distance corresponds to a stop, not terrain.',
      ),
      q(
        '从0到6 m再回0，哪张图最后可以回到纵轴0？',
        'For an out-and-back trip from 0 to 6 m to 0, which graph can end at vertical value zero?',
        [
          ['累计路程图', 'Accumulated distance graph'],
          ['位置图', 'Position graph'],
        ],
        1,
        '终点位置回0，但累计路程是12 m。',
        'Final position is 0 while accumulated distance is 12 m.',
      ),
    ],
    exit: q(
      '同学说“线越陡，一定跑得越快”，比较不同图前还需检查什么？',
      'A classmate says “steeper always means faster”. What must be checked before comparing different graphs?',
      [
        ['变量、单位与坐标尺度是否一致', 'Variables, units and axis scales'],
        ['线条颜色', 'Line colour'],
      ],
      0,
      '视觉倾斜受坐标比例影响；相同尺度下再比较相应物理变化率。',
      'Visual steepness depends on scale. Compare the physical rate with matching variables and scales.',
    ),
  },
];
