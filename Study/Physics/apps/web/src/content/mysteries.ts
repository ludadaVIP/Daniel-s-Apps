import { t, q, type Lesson } from './schema';
export const mysteryLessons: Lesson[] = [
  {
    id: 'why-ice-floats',
    stage: 0,
    unit: 'mysteries',
    kind: 'floating',
    minutes: 15,
    title: t('冰山藏起了多少？', 'How much of an iceberg is hidden?'),
    subtitle: t(
      '水面上的小尖尖，不是冰山的全部。',
      'The visible tip is only part of the story.',
    ),
    hook: t(
      '冰块放进水杯会浮起来。可它为什么没有像小船一样整块露在水上？',
      'An ice cube floats in a glass. Why does most of it stay underwater?',
    ),
    prediction: t(
      '一块普通冰在淡水中稳定漂浮时，大约多少体积在水下？',
      'About how much of ordinary ice is underwater when floating steadily in fresh water?',
    ),
    predictions: [
      t('很少，不到一半', 'Very little, less than half'),
      t('大部分，约九成', 'Most of it, about nine tenths'),
      t('浮着就完全不碰水', 'Floating means staying completely out of water'),
    ],
    explore: t(
      '先释放冰块，再换成同样体积（占据空间的大小）的石块。比较物体质量与它排开水的质量。最后试试木块，或把淡水换成海水。',
      'Release the ice, then a rock of the same volume—the amount of space it occupies. Compare each object’s mass with the mass of water it displaces. Try wood or switch to seawater.',
    ),
    concept: t(
      '体积描述占据空间的大小。1 cm³ 可以想成边长 1 cm 的小方块。物体进入水里，会挤开一些水，水对它产生向上的浮力。静止漂浮时，向上的浮力和向下的重力平衡：排开水的质量等于物体质量。相同体积下，普通冰比液态水质量小，也就是密度较小，所以还没全部浸没，就能达到平衡。',
      'Volume describes occupied space. One cm³ is a cube with sides 1 cm long. An object in water displaces some water and experiences an upward buoyant force. In steady floating, buoyancy balances weight: the displaced water has the same mass as the object. Ordinary ice has less mass than liquid water for the same volume—a lower density—so balance is possible before all the ice is submerged.',
    ),
    example: t(
      '模型里的 100 cm³ 冰质量为 91.7 g。淡水每 1 cm³ 质量为 1 g，所以冰需要排开 91.7 cm³ 水：约 92% 在水下，约 8% 在水上。这个百分比说的是体积，不是所有形状的高度。',
      'The model’s 100 cm³ ice has a mass of 91.7 g. Fresh water has 1 g per cm³, so it displaces 91.7 cm³: about 92% of its volume is below water and 8% above. These are volume fractions, not height fractions for every shape.',
    ),
    misconception: t(
      '“浮着”不等于没有重力，也不等于浮力一直大于重力。静止浮着时，两者平衡。石块完全浸没后也有浮力，只是这里的浮力不足以平衡它的重力。',
      'Floating does not remove gravity or mean buoyancy keeps exceeding weight. The forces balance in steady floating. A submerged rock also experiences buoyancy; here it is too small to balance the rock’s weight.',
    ),
    realWorld: t(
      '船员不能只根据水面上的尖顶判断冰山有多大。冰的形状和水的密度会影响露出部分，但“下面还有很多”是关键。以后学密度时，你会用质量与体积把这件事讲得更精确。',
      'An iceberg’s tip does not reveal its full size to a ship’s crew. Shape and water density affect what is visible, but much remains underneath. Later, density will let you describe this with mass and volume.',
    ),
    summary: t(
      '漂浮是一种平衡。冰的密度比水小，但大部分体积仍要在水下排开水。',
      'Floating is a balance. Ice is less dense than water, yet most of its volume is submerged to displace enough water.',
    ),
    homeExperiment: t(
      '在透明杯里放淡水和一块冰，从侧面画出水面与冰的位置。不要只从上面看。冰会逐渐融化，记录刚放入并稳定时的观察；不要把不规则冰块的高度当作精确体积百分比。',
      'Put fresh water and an ice cube in a clear cup. Sketch the waterline and ice from the side. Record soon after it settles because ice melts. Do not treat the height of an irregular cube as an exact volume fraction.',
    ),
    vocabulary: [
      t('体积', 'volume'),
      t('浮力', 'buoyancy'),
      t('排开水', 'displace water'),
      t('密度', 'density'),
      t('平衡', 'balance'),
    ],
    questions: [
      q(
        '冰静止漂浮时，向上的浮力与重力有什么关系？',
        'How do buoyancy and weight compare for steadily floating ice?',
        [
          [
            '浮力更大，所以一直向上飞',
            'Buoyancy is greater, so it keeps rising',
          ],
          ['两者平衡', 'They balance'],
          ['没有重力', 'There is no gravity'],
        ],
        1,
        '静止漂浮时，向上和向下的作用平衡，物体不会持续加速。',
        'The upward and downward forces balance; the object does not keep accelerating.',
      ),
      q(
        '100 cm³ 木块质量为 60 g，在模型淡水中需要排开多少水？',
        'A 100 cm³ wooden block has a mass of 60 g. How much model fresh water must it displace?',
        [
          ['60 cm³', '60 cm³'],
          ['100 cm³', '100 cm³'],
          ['160 cm³', '160 cm³'],
        ],
        0,
        '淡水模型为 1 g/cm³，60 cm³ 水质量是 60 g，能平衡木块。',
        'At 1 g/cm³, 60 cm³ of water has a mass of 60 g, balancing the block.',
      ),
      q(
        '两块同样体积的物体，一块质量 60 g，一块 260 g，哪句推理更好？',
        'Two objects have equal volume but masses of 60 g and 260 g. Which reasoning is better?',
        [
          [
            '一样大就一定同样浮沉',
            'Equal size guarantees equal floating behavior',
          ],
          [
            '还要比较质量与能排开水的质量',
            'Compare their masses with the water they can displace',
          ],
        ],
        1,
        '体积相同，质量可以不同。浮沉取决于质量与排水能力的比较，而不是只看大小。',
        'Equal volumes can have different masses. Floating depends on mass relative to water displacement, not size alone.',
      ),
    ],
    exit: q(
      '完全浸在水里的石块正在下沉。它有没有浮力？',
      'A fully submerged rock is sinking. Does it experience buoyancy?',
      [
        ['有，但不足以平衡重力', 'Yes, but not enough to balance weight'],
        ['没有，只有浮着的物体才有', 'No; only floating objects experience it'],
      ],
      0,
      '水仍向上托着石块，但作用不够大。落到槽底后，还会受到槽底的支持。',
      'Water still pushes upward, but not enough. At the tank floor, the floor also provides support.',
    ),
  },
  {
    id: 'why-ships-float',
    stage: 0,
    unit: 'mysteries',
    kind: 'boats',
    minutes: 18,
    title: t('同一团泥，能变成船吗？', 'Can the same clay become a boat?'),
    subtitle: t(
      '质量没变，形状却改变了能排开的水。',
      'Same mass, different water displacement.',
    ),
    hook: t(
      '小铁块会沉，巨大的钢铁轮船却能浮。你能用同一团橡皮泥重现这个反差吗？',
      'A small metal block sinks, yet a huge steel ship floats. Can the same piece of clay recreate that contrast?',
    ),
    prediction: t(
      '同一团 100 g 的泥，实心团会沉。把它捏成不漏水的空心小碗，会怎样？',
      'A solid 100 g clay lump sinks. What might happen if you reshape it into a watertight hollow bowl?',
    ),
    predictions: [
      t('质量没变，所以一定还沉', 'Same mass, so it must still sink'),
      t('可能浮起来', 'It may float'),
      t('空气把它变轻到 0 g', 'Air makes it weigh 0 g'),
    ],
    explore: t(
      '释放实心团，再换空心船。船浮起来后，加 150 g 货物，再加到 250 g。每次释放后观察水线、总质量和进水提示。用同一团泥比较形状，保持泥的质量不变。',
      'Release the solid lump, then the hollow boat. Add 150 g of cargo, then increase it to 250 g. Release each setup and compare waterline, total mass and flooding. The clay mass stays fixed when reshaped.',
    ),
    concept: t(
      '船不是靠“重不重”单独决定浮沉。空心船在进水前占据一大块空间，能把更多水挤开。静止漂浮时，排开水的质量等于船与货物的总质量。货物越多，船需要浸得越深；船舷太低或有孔进水后，原来空着的空间不再挡住水，船就可能沉。',
      'Floating depends on more than being heavy. Before flooding, a hollow hull excludes a large volume of water. In steady floating, the displaced water has the same mass as the boat and cargo together. More cargo means a deeper waterline. If water enters over the rim or through a hole, the empty space no longer excludes water, and the boat may sink.',
    ),
    example: t(
      '模型泥团质量 100 g，体积 50 cm³；完全浸没也只排开 50 g 淡水，所以会沉。改成船后，干燥船舱到船舷最多能排开 300 g 水。加 150 g 货物，总质量 250 g，还能浮；加 250 g，总质量 350 g，超过船舷能力，进水后下沉。',
      'The model lump has a mass of 100 g and volume of 50 cm³. Even submerged, it displaces only 50 g of fresh water, so it sinks. As a boat, its dry hull can displace up to 300 g before the rim reaches water. With 150 g cargo, the 250 g total can float. With 250 g cargo, the 350 g total exceeds rim capacity, causing flooding and sinking.',
    ),
    misconception: t(
      '船浮着，不是泥或钢的材料密度突然变小，也不是重力消失。变化的是整体形状和进水前能排开的水。模型里总质量 300 g 恰好到船舷，只是理想临界状态；真实船还必须留出余量，应对浪和倾斜。',
      'Floating does not change the density of clay or steel or remove gravity. Shape changes how much water the whole dry hull can exclude. A 300 g total reaches the model rim exactly: an ideal limit. Real boats need spare capacity for waves and tilting.',
    ),
    realWorld: t(
      '运输船装货后吃水更深，船侧的载重标志帮助控制装载。设计船要同时考虑船体质量、货物和水是否会进入船舱，不能只看船够不够大。',
      'A cargo ship sits deeper when loaded. Load markings help control loading. Boat design must consider hull mass, cargo and water entry, rather than size alone.',
    ),
    summary: t(
      '保持质量不变，改变形状也能改变浮沉。船要排开足够的水，并且守住干燥船舱。',
      'Reshaping the same mass can change floating behavior. A boat must displace enough water and keep its hull from flooding.',
    ),
    homeExperiment: t(
      '用会下沉且不溶于水的普通橡皮泥，在浅水盆里先试实心团，再捏成无裂缝的小碗。轻轻放入，逐个加小垫圈，记录什么时候水碰到船舷。某些轻质橡皮泥本来就会浮，先检查材料；不要用这项实验测试人乘坐的船。',
      'Use ordinary water-resistant clay whose solid lump sinks. In a shallow basin, compare that lump with a crack-free bowl made from the same clay. Add small washers one at a time and record when water reaches the rim. Some lightweight clays already float; check the material first. This is a small model experiment.',
    ),
    vocabulary: [
      t('船体', 'hull'),
      t('船舷', 'rim'),
      t('吃水', 'draft'),
      t('装载', 'load'),
    ],
    questions: [
      q(
        '同一团泥改成空心船，什么保持不变？',
        'What stays the same when reshaping the same clay into a hollow boat?',
        [
          ['泥的质量', 'Clay mass'],
          ['进水前可排开的水量', 'Water excluded before flooding'],
          ['船的形状', 'Hull shape'],
        ],
        0,
        '没有添加或丢掉泥，泥的质量不变；形状和整体排水能力改变。',
        'Without adding or removing clay, its mass stays fixed. Shape and overall water exclusion change.',
      ),
      q(
        '100 g 船加 150 g 货物，漂浮时排开水的质量是多少？',
        'A 100 g boat carries 150 g cargo. What mass of water does it displace when floating?',
        [
          ['100 g', '100 g'],
          ['150 g', '150 g'],
          ['250 g', '250 g'],
        ],
        2,
        '船与货物总质量为 250 g，漂浮平衡时排开水的质量也为 250 g。',
        'The total mass is 250 g, so steady floating requires 250 g of displaced water.',
      ),
      q(
        '模型里总质量 300 g 刚到船舷，能直接把它当作真实船的安全装载吗？',
        'The model reaches the rim at 300 g total. Is this directly a safe loading limit for a real boat?',
        [
          ['能，只要理论上没沉', 'Yes, if it has not theoretically sunk'],
          [
            '不能，需要给浪、倾斜和进水留余量',
            'No; leave margin for waves, tilt and water entry',
          ],
        ],
        1,
        '理想临界状态没有余量，真实条件会变化。',
        'An ideal limit leaves no margin; real conditions vary.',
      ),
    ],
    exit: q(
      '空心船进水后为什么可能沉？',
      'Why might a hollow boat sink after flooding?',
      [
        [
          '水进入原本挡住水的空舱，整体排水能力改变',
          'Water fills the empty hull, changing water exclusion',
        ],
        ['水把重力关掉了', 'Water switches gravity off'],
        ['船里的空气变成了石头', 'The air turns into stone'],
      ],
      0,
      '空舱保持干燥时能排开更多水；进水后这项优势减小。',
      'A dry empty hull excludes more water. Flooding reduces that advantage.',
    ),
  },
  {
    id: 'why-balls-bounce',
    stage: 0,
    unit: 'mysteries',
    kind: 'bounce',
    minutes: 15,
    title: t('球怎么又回来了？', 'How does the ball come back up?'),
    subtitle: t(
      '落下、变形、回弹，能量走了一条什么路？',
      'Fall, deform, rebound: follow the energy.',
    ),
    hook: t(
      '篮球落地会弹起，橡皮泥团通常留在地上。地板都是同一块，它们为什么表现不同？',
      'A basketball rebounds; a clay lump usually stays down. Why do they behave differently on the same floor?',
    ),
    prediction: t(
      '不额外推球，从 1 m 静止释放，模型橡胶球第一次回弹会到哪里？',
      'Released from rest at 1 m without an extra push, how high will the model rubber ball rebound?',
    ),
    predictions: [
      t('比 1 m 更高', 'Above 1 m'),
      t('低于 1 m', 'Below 1 m'),
      t('一定永远停在 1 m', 'Always exactly 1 m'),
    ],
    explore: t(
      '从同一高度分别释放橡胶球和泥团，比较第一次回弹高度。然后改释放高度再试橡胶球。观察落地瞬间后能回到多高，而不是只看谁落地更快。',
      'Release the rubber ball and clay from the same height. Compare their first rebound heights. Then try another release height with rubber. Focus on how high each returns, not who arrives first.',
    ),
    concept: t(
      '落下时，重力势能转成动能。撞地时，球和地面会短暂变形，一部分能量可以储存为弹性势能，再推动球回弹。普通碰撞也把部分机械能转成内能、声音和难以恢复的变形。泥团形变后不容易恢复，所以回弹很小。',
      'During the fall, gravitational potential energy becomes kinetic energy. At impact, the ball and floor briefly deform. Some energy can be stored elastically and returned to the ball. Ordinary collisions also transfer mechanical energy into internal energy, sound and lasting deformation. Clay does not readily regain its shape, so it rebounds very little.',
    ),
    example: t(
      '模型橡胶球第一次碰撞后保留原机械能的 64%。从 1 m 释放，回弹最高到 0.64 m；从 2 m 释放，回弹到 1.28 m。相同球、相同地面的这个模型里，高度比例不变。真实球会受温度、材质和碰撞条件影响。',
      'The model rubber ball retains 64% of its original mechanical energy after the first impact. A 1 m release gives a 0.64 m rebound; a 2 m release gives 1.28 m. The ratio stays fixed for this ball-and-floor model. Real behavior depends on temperature, materials and collision conditions.',
    ),
    misconception: t(
      '回弹不是凭空产生能量。“机械能减少”也不等于总能量消失，它转到其他形式或周围环境。不额外加能量时，普通球不能靠一次次回弹越弹越高。',
      'A rebound does not create energy. Less mechanical energy does not mean total energy has vanished; it goes into other forms or the surroundings. Without added energy, an ordinary ball cannot keep bouncing higher.',
    ),
    realWorld: t(
      '球类运动需要材料能恢复形状；接球时让手向后移动，可以延长减速过程。包装泡沫则希望吸收更多碰撞能量，减少回弹——同样的物理，不同的设计目标。',
      'Sports balls need materials that recover their shape. Moving your hands backward when catching extends the slowing process. Packaging foam aims to absorb more impact energy and reduce rebound: the same physics, different design goals.',
    ),
    summary: t(
      '回弹依靠短暂变形后释放能量；回弹高度让我们看见机械能保留了多少。',
      'Rebounding returns energy stored during deformation. Rebound height reveals how much mechanical energy remains.',
    ),
    homeExperiment: t(
      '在空旷地面旁贴好纸质高度标记，从较低的固定高度松手释放软球。侧面录一段慢动作，找第一次回弹最高点。保持同一个球、地面和释放方式；不要朝脸、窗户或易碎物抛球。',
      'Place paper height markers beside a clear floor space. Release a soft ball from a fixed low height without throwing it. Film from the side in slow motion and find the first rebound peak. Keep the ball, surface and release method the same; use a clear space away from fragile objects.',
    ),
    vocabulary: [
      t('回弹', 'rebound'),
      t('形变', 'deformation'),
      t('机械能', 'mechanical energy'),
      t('弹性', 'elasticity'),
    ],
    questions: [
      q(
        '泥团回弹很小，最合理的解释是什么？',
        'Why does the clay rebound very little?',
        [
          ['撞地时能量全部消失', 'All energy vanishes at impact'],
          [
            '更多机械能转到形变和内能等形式',
            'More mechanical energy becomes deformation and internal energy',
          ],
          ['泥团落地后没有质量', 'Clay loses its mass after landing'],
        ],
        1,
        '能量没有消失；泥团不容易恢复形状，少量能量返回回弹运动。',
        'Energy is not destroyed. Clay does not readily recover its shape, so little returns to rebound motion.',
      ),
      q(
        '这个模型从 2 m 释放，回弹高度是原来的 64%，有多高？',
        'This model rebounds to 64% of a 2 m release height. How high is that?',
        [
          ['1.28 m', '1.28 m'],
          ['2.64 m', '2.64 m'],
          ['0.64 m', '0.64 m'],
        ],
        0,
        '2 × 0.64 = 1.28 m。比例比较的是回弹高度与释放高度。',
        '2 × 0.64 = 1.28 m. The ratio compares rebound height with release height.',
      ),
      q(
        '研究地面对回弹的影响，怎样做公平比较？',
        'How can you fairly test the effect of the floor on rebound?',
        [
          [
            '地面、球、释放高度都一起改变',
            'Change floor, ball and height together',
          ],
          [
            '只换地面，保持球和释放高度相同',
            'Change the floor; keep ball and release height the same',
          ],
        ],
        1,
        '一次改变一个主要条件，才能更清楚地判断变化来自哪里。',
        'Changing one main condition helps identify what caused the difference.',
      ),
    ],
    exit: q(
      '有人声称普通球没有额外能量输入，却每次弹得更高。先检查什么？',
      'Someone says an ordinary ball rebounds higher each time with no added energy. What should you check first?',
      [
        [
          '是否有额外推动、活动地面或测量错误',
          'Extra pushes, a moving floor or measurement error',
        ],
        ['相信回弹能凭空创造能量', 'Assume bouncing creates energy'],
      ],
      0,
      '先检查能量是否从别处进入，或观察是否可靠，再修改解释。',
      'Check for energy entering from elsewhere or unreliable observations before changing the explanation.',
    ),
  },
  {
    id: 'why-echoes-return',
    stage: 0,
    unit: 'mysteries',
    kind: 'echo',
    minutes: 15,
    title: t('声音走了多远才回来？', 'How far does an echo travel?'),
    subtitle: t(
      '一声呼喊，藏着一趟往返旅行。',
      'One call makes a return journey.',
    ),
    hook: t(
      '空房间里拍一下手，声音有时拖长；对着远处的大墙呼喊，却可能听见第二声。声音去了哪里？',
      'A clap in an empty room can sound stretched out. Calling toward a distant wall may give a separate second sound. Where did the sound go?',
    ),
    prediction: t(
      '人站在墙前 50 m，反射声回到人这里，总共走了多远？',
      'A person stands 50 m from a wall. How far does the reflected sound travel before returning?',
    ),
    predictions: [t('25 m', '25 m'), t('50 m', '50 m'), t('100 m', '100 m')],
    explore: t(
      '发出一个声脉冲，先试 5 m，再试 20 m 或更远。跟随标记到墙再返回，比较模型秒表的时间。标记表示声音传播，不是一块空气在来回跑。',
      'Send a sound pulse at 5 m, then 20 m or farther. Follow its marker to the wall and back, comparing model timer readings. The marker represents sound propagation, not a chunk of air moving back and forth.',
    ),
    concept: t(
      '声音是一种传播的振动。到达墙时，一部分声音能被反射回来。回声要等声音先去墙那里，再回来，所以总路程是墙距的两倍。距离近时，返回声可能与原声混在一起；反射多且密集时可形成混响。距离足够远时，更容易听出独立回声。',
      'Sound is a traveling vibration. A wall can reflect some sound back. An echo travels to the wall and returns, so its path is twice the wall distance. Nearby reflections may merge with the original sound; many closely spaced reflections can create reverberation. Larger distances make a separate echo easier to hear.',
    ),
    formula: t(
      '往返路程 = 2 × 墙距；返回时间 = 往返路程 ÷ 声速',
      'Return path = 2 × wall distance; return time = return path ÷ sound speed',
    ),
    example: t(
      '在约 20°C 的干燥空气模型里，声速为 343 m/s。墙距 50 m，往返路程 100 m，返回时间约 100 ÷ 343 = 0.29 s。若只算 50 ÷ 343，就漏掉了回程。',
      'In the dry-air model near 20°C, sound speed is 343 m/s. A wall 50 m away gives a 100 m path and a return time of about 100 ÷ 343 = 0.29 s. Calculating only 50 ÷ 343 misses the return trip.',
    ),
    misconception: t(
      '墙不是重新读出了你的话，它反射了到达的声波。屏幕的慢动作也不表示真实声音这么慢。约 0.1 s 的间隔只是区分独立回声的教学近似，实际还取决于声音长度、响度、背景和环境。',
      'The wall does not read your words anew; it reflects arriving sound waves. Slow animation does not mean real sound is that slow. About 0.1 s is a teaching estimate for separating echoes; the actual result depends on sound duration, level, background and surroundings.',
    ),
    realWorld: t(
      '剧场控制反射，让观众听清语言；软材料常能吸收部分声音。声呐也测量声音往返时间寻找物体，但水中声速不同，不能直接套用这里的空气数值。',
      'Theaters control reflections so speech remains clear; soft materials often absorb some sound. Sonar also measures sound’s return time to locate objects, but water has a different sound speed, so this air value cannot be used directly.',
    ),
    summary: t(
      '回声走的是往返路。根据总路程和声速，才能估计它什么时候返回。',
      'An echo makes a return journey. Use the full path and the sound speed to estimate when it returns.',
    ),
    homeExperiment: t(
      '先比较家里有窗帘与较空的房间里一次轻拍手的余音，只记录听感，不用制造大声噪音。若没有清楚的第二声，就写“没有分辨出独立回声”。可以画往返路径，不必为这项实验寻找远处墙面或离开安全区域。',
      'Compare the tail of one gentle clap in a curtained room and a more empty room. Record what you hear without making loud noise. If there is no clear second sound, write “no separate echo identified.” Sketch the return path; no need to seek a distant wall or leave a safe area.',
    ),
    vocabulary: [
      t('反射', 'reflection'),
      t('回声', 'echo'),
      t('混响', 'reverberation'),
      t('声速', 'sound speed'),
    ],
    questions: [
      q(
        '墙距 20 m，声音返回的总路程是多少？',
        'A wall is 20 m away. What is the sound’s full return path?',
        [
          ['10 m', '10 m'],
          ['20 m', '20 m'],
          ['40 m', '40 m'],
        ],
        2,
        '去 20 m，加回 20 m，共 40 m。',
        '20 m outward plus 20 m back gives 40 m.',
      ),
      q(
        '保持空气条件不变，墙距从 20 m 变成 40 m，返回时间怎样变？',
        'With the same air conditions, what happens to return time when wall distance doubles from 20 m to 40 m?',
        [
          ['约变成两倍', 'It approximately doubles'],
          ['变成一半', 'It halves'],
          ['不变', 'It stays the same'],
        ],
        0,
        '声速保持不变，往返路程加倍，时间也加倍。',
        'At the same sound speed, doubling the return path doubles the time.',
      ),
      q(
        '在水里用声呐测距，能直接用 343 m/s 吗？',
        'Can underwater sonar directly use 343 m/s?',
        [
          [
            '能，声音在任何材料里都一样快',
            'Yes; sound has the same speed in every material',
          ],
          ['不能，要用水中的声速', 'No; use sound speed in water'],
        ],
        1,
        '声音传播速度与介质及条件有关，模型的数值有适用范围。',
        'Sound speed depends on the medium and conditions; model values have a scope.',
      ),
    ],
    exit: q(
      '已测出返回时间，想求墙距，先用声速乘时间得到什么？',
      'Multiplying sound speed by return time gives what?',
      [
        ['人与墙的单程距离', 'The one-way wall distance'],
        [
          '声音往返的总路程，还要除以 2',
          'The full return path; divide it by 2 for wall distance',
        ],
      ],
      1,
      '测到的是出去再回来的时间，所以乘积是往返路程。',
      'The timer includes travel out and back, so the product is the return path.',
    ),
  },
];
