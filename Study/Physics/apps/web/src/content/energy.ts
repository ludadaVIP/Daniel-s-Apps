import { t, q, type Lesson } from './schema';

export const energyLessons: Lesson[] = [
  {
    id: 'energy-lights-and-stores',
    stage: 2,
    unit: 'energy',
    kind: 'energy-lamp',
    minutes: 17,
    title: t(
      '灯亮起来，电池里的能量去哪了？',
      'The lamp lights up. Where does battery energy go?',
    ),
    subtitle: t(
      '从变化找能量，从账本找去向。',
      'Look for changes, then follow an energy ledger.',
    ),
    hook: t(
      '手电筒亮了，电池能量减少了。光跑出去了，灯也可能变暖：哪一部分才算能量？',
      'A torch shines while its battery loses energy. Light leaves and the lamp may warm. Which parts belong in the energy story?',
    ),
    prediction: t(
      '教学灯把12 J全部转移出去，其中3 J随光向外传递。其余9 J可能去了哪里？',
      'A teaching lamp transfers all 12 J, including 3 J carried outward by light. Where might the other 9 J go?',
    ),
    predictions: [
      t(
        '增加灯与周围的内能',
        'Increase internal energy in the lamp and surroundings',
      ),
      t('因为没用，直接消失', 'Disappear because they are not useful'),
      t('变成被灯吃掉的电荷', 'Become charge consumed by the lamp'),
    ],
    explore: t(
      '先完整观察关灯状态，再完整观察开灯状态。看电池剩余、累计向外的光与内能增加三条能量条。开灯时可拖动进度看中间账本；拖动不代替完整观察。',
      'Observe a complete lights-off and lights-on sequence. Compare battery energy remaining, cumulative light carried out and internal-energy increase. Inspect intermediate ledgers with the progress slider; seeking does not replace full observation.',
    ),
    concept: t(
      '能量是我们用来描述物体或系统能够引起变化、以及变化怎样相互联系的量，单位是焦耳J。电池化学体系有能量储备，通过电路转移到灯。灯让能量随光传出，也增加灯与周围的内能。内能与微观粒子的运动和相互作用有关；“热”描述因温差而发生的能量传递，不是物体里存着一种叫热的东西。',
      'Energy is a quantity used to describe a system’s capacity to cause changes and how changes are connected. Its unit is the joule, J. Energy stored in a battery’s chemical system transfers through a circuit to the lamp. The lamp carries energy outward as light and increases internal energy in itself and its surroundings. Internal energy relates to particles’ motion and interactions; heat describes transfer caused by a temperature difference, not a substance stored inside an object.',
    ),
    formula: t(
      '原有12 J = 电池剩余 + 累计光向外传出 + 灯与周围内能增加',
      'Initial 12 J = battery remaining + cumulative light carried out + internal-energy increase',
    ),
    example: t(
      '教学进度到一半：剩余6 J，光向外传出1.5 J，内能增加4.5 J，合计仍12 J。末尾：0+3+9=12 J。这里把剩余储备与累计传出量放在同一账本中；光这一栏不是“灯里存着的光”。',
      'Halfway through the teaching sequence: 6 J remain, 1.5 J have left as light and internal energy has increased by 4.5 J: still 12 J. At the end, 0+3+9=12 J. This ledger combines remaining stores with cumulative transfers; its light column is not light stored in the lamp.',
    ),
    misconception: t(
      '电池不会“制造”能量，电荷也没有被灯消耗掉。我们追踪电池原有的储备怎样减少、能量怎样传出。能量与力不同：J和N不能互换。',
      'A battery does not create energy, and charge is not consumed by the lamp. Track how its initial store decreases and energy transfers out. Energy and force differ: J and N are not interchangeable.',
    ),
    realWorld: t(
      '手电筒、手机与电动玩具都能画出类似账本：能量从哪里来，转移到哪里，哪些变化是我们想要的？实际比例需要测量，不能照抄教学灯。',
      'Torches, phones and electric toys have similar stories: where does energy come from, where does it go and which changes do we want? Actual proportions require measurements; do not copy this teaching lamp’s values.',
    ),
    summary: t(
      '先寻找变化，再写清能量储备与传递；看不见的部分也要有位置。',
      'Find changes, then identify stores and transfers. Invisible parts belong in the ledger too.',
    ),
    homeExperiment: t(
      '和家人观察一支正常使用的LED手电筒：开关前后，哪里出现变化？画“电池→灯→光与周围”的箭头，不用拆电池或触碰热灯泡；把未测出的数量留作未知。',
      'With a helper, observe a normally used LED torch. What changes when switched on? Draw battery → lamp → light and surroundings. Keep the battery intact, avoid hot bulbs, and leave unmeasured quantities unknown.',
    ),
    vocabulary: [
      t('能量', 'energy'),
      t('焦耳J', 'joule J'),
      t('化学能储备', 'chemical energy store'),
      t('内能', 'internal energy'),
      t('能量传递', 'energy transfer'),
    ],
    questions: [
      q(
        '这支手电筒最初的能量来自哪里？',
        'Where does this torch’s initial energy come from?',
        [
          ['电池化学体系', 'The battery’s chemical system'],
          ['灯凭空制造', 'The lamp creates it from nothing'],
          ['光制造了电池能量', 'Light creates battery energy'],
        ],
        0,
        '电池的化学体系提供储备，电路把能量转移到灯。',
        'The battery’s chemical system provides the store; the circuit transfers energy to the lamp.',
      ),
      q(
        '账本中6 J剩余、1.5 J光向外、4.5 J内能增加，共多少？',
        'What is 6 J remaining + 1.5 J light out + 4.5 J internal-energy increase?',
        [
          ['12 J', '12 J'],
          ['只有1.5 J算能量', 'Only 1.5 J counts'],
          ['9 N', '9 N'],
        ],
        0,
        '三栏一起追踪原有12 J；N是力的单位。',
        'All three columns track the initial 12 J; N is a force unit.',
      ),
      q(
        '为什么不能把这盏教学灯的3:9比例直接用于家里所有灯？',
        'Why cannot the teaching lamp’s 3:9 split describe every lamp at home?',
        [
          [
            '灯的材料、设计与条件不同，需要测量',
            'Materials, designs and conditions differ; measurements are needed',
          ],
          ['真实灯没有能量', 'Real lamps have no energy'],
        ],
        0,
        '规定比例帮助学习记账，不是所有灯的实测结果。',
        'The prescribed split teaches accounting; it is not measured data for every lamp.',
      ),
    ],
    exit: q(
      '灯熄灭后，没有光了。先前增加的内能就消失了吗？',
      'After the lamp goes out, has its earlier internal-energy increase vanished?',
      [
        [
          '没有；还会向较冷的周围转移，需继续追踪',
          'No; energy can continue transferring to cooler surroundings',
        ],
        ['是，光不见就全消失', 'Yes; no light means all energy disappears'],
      ],
      0,
      '观察范围和时间改变时，还要继续追踪传递；没有光不等于没有能量。',
      'Continue tracking transfers as the time and boundary change. No light does not mean no energy.',
    ),
  },
  {
    id: 'kinetic-energy-speed-squared',
    stage: 2,
    unit: 'energy',
    kind: 'energy-kinetic',
    minutes: 18,
    title: t(
      '小车速度翻倍，动能也只翻倍吗？',
      'Double the cart’s speed. Only double its energy?',
    ),
    subtitle: t(
      '保持一个量不变，比较质量与速率。',
      'Hold one quantity fixed; compare mass and speed.',
    ),
    hook: t(
      '同一辆车跑快一点，停下来要处理的运动能量会增加。它与速度是“一倍对一倍”吗？',
      'A faster cart has more motion energy to deal with when stopping. Does energy grow one-for-one with speed?',
    ),
    prediction: t(
      '同一0.5 kg小车从2 m/s变成4 m/s，动能变成原来的几倍？',
      'The same 0.5 kg cart changes from 2 to 4 m/s. How many times its original kinetic energy?',
    ),
    predictions: [
      t('2倍', '2 times'),
      t('4倍', '4 times'),
      t('不变', 'Unchanged'),
    ],
    explore: t(
      '记录0.5 kg、2 m/s作为基线；只把质量换成1 kg再记录；回到0.5 kg，只把速率换成4 m/s再记录。可播放匀速取样，也试试0 m/s。能量条始终用同一8 J标尺。',
      'Record 0.5 kg at 2 m/s as a baseline. Change only mass to 1 kg, then return to 0.5 kg and change only speed to 4 m/s. Play a constant-speed sample and try 0 m/s. Every energy bar uses the same 8 J scale.',
    ),
    concept: t(
      '动能是物体由于运动具有的能量。对这辆只做平移的小车，Ek=½mv²。质量m用kg，速率v用m/s，动能用J。相同速率时质量翻倍，动能翻倍；相同质量时速率翻倍，平方项让动能变成4倍。这里都相对地面描述运动，换参考系时动能也可能改变。',
      'Kinetic energy is energy associated with motion. For this translating cart, Ek=½mv². Use mass m in kg, speed v in m/s and energy in J. At fixed speed, doubling mass doubles energy. At fixed mass, doubling speed makes the squared term four times as large. All readings use the ground frame; changing reference frame can change kinetic energy.',
    ),
    formula: t(
      'Ek = ½mv² · v²表示v×v，不是v×2',
      'Ek = ½mv² · v² means v×v, not v×2',
    ),
    example: t(
      '0.5 kg、2 m/s：Ek=½×0.5×2×2=1 J。质量变1 kg而速率不变：2 J。质量仍0.5 kg但速率4 m/s：4 J。三次比较一次只改一个量。',
      '0.5 kg at 2 m/s gives ½×0.5×2×2=1 J. With mass 1 kg and the same speed, it is 2 J. With mass still 0.5 kg but speed 4 m/s, it is 4 J. Change one quantity at a time.',
    ),
    misconception: t(
      '动能没有“向左的负值”：在同一参考系中，向左与向右的相同速率给出相同动能。速度方向与能量是不同信息。动画取样结束后画面冻结，不表示小车真的停下或能量消失。',
      'Kinetic energy is not negative for leftward motion: equal left/right speeds in one frame give equal kinetic energies. Direction and energy are different information. Freezing at the end of the animation sample does not mean the cart physically stopped or lost its energy.',
    ),
    realWorld: t(
      '快一些的自行车需要处理更多动能才能停车。现实停车距离还受刹车、路面和反应时间影响；不能把这组理想小车数字当成道路停车预测。',
      'A faster bicycle has more kinetic energy to remove when stopping. Actual stopping distance also depends on brakes, surfaces and reaction time; these ideal-cart numbers are not road stopping predictions.',
    ),
    summary: t(
      '同质量，比速率的平方；同速率，比质量。公平比较才看得到关系。',
      'At fixed mass compare speed squared; at fixed speed compare mass. Fair comparisons reveal the relationship.',
    ),
    homeExperiment: t(
      '在平坦、无边缘跌落风险的地方轻推同一玩具车，比较较慢与稍快的运动。写下控制了什么，以及推力和摩擦哪些尚未量出；不用真实车或高速实验。',
      'Gently push the same toy cart slowly and a little faster on a clear flat area. Record controlled conditions and unmeasured pushes/friction. Use a toy rather than a vehicle or high-speed test.',
    ),
    vocabulary: [
      t('动能', 'kinetic energy'),
      t('平方', 'square'),
      t('参考系', 'reference frame'),
      t('平移', 'translation'),
    ],
    questions: [
      q(
        '同为2 m/s，1 kg车与0.5 kg车动能比是多少？',
        'At 2 m/s, compare the energies of 1 kg and 0.5 kg carts.',
        [
          ['2:1', '2:1'],
          ['4:1', '4:1'],
          ['1:1', '1:1'],
        ],
        0,
        '固定速率时，动能随质量成正比。',
        'At fixed speed, kinetic energy is proportional to mass.',
      ),
      q(
        '0.5 kg、4 m/s的小车动能是多少？',
        'What is the energy of a 0.5 kg cart at 4 m/s?',
        [
          ['2 J', '2 J'],
          ['4 J', '4 J'],
          ['8 N', '8 N'],
        ],
        1,
        '½×0.5×4²=4 J；先算平方。',
        '½×0.5×4²=4 J; square the speed first.',
      ),
      q(
        '要检验速率的影响，怎样选对照？',
        'Which comparison tests the effect of speed?',
        [
          [
            '相同小车、相同参考系，改变速率',
            'Same cart and frame, different speeds',
          ],
          ['质量和速率同时改变', 'Change both mass and speed'],
        ],
        0,
        '保留质量与参考系，才能把变化与速率联系。',
        'Keep mass and frame fixed to relate the difference to speed.',
      ),
    ],
    exit: q(
      '同一参考系中，车从向右2 m/s换成向左2 m/s，动能怎样？',
      'In the same frame, a cart changes from 2 m/s right to 2 m/s left. What happens to its kinetic energy?',
      [
        [
          '相同；速率相同，但方向改变',
          'Same; speed matches although direction changes',
        ],
        ['变成负动能', 'It becomes negative'],
      ],
      0,
      '平方使相反速度的动能相同；这不意味着改变方向不需要力。',
      'Squaring gives equal energies for opposite velocities; changing direction can still require a force.',
    ),
  },
  {
    id: 'gravitational-energy-reference',
    stage: 2,
    unit: 'energy',
    kind: 'energy-height',
    minutes: 18,
    title: t(
      '书在架子上没动，为什么也有能量线索？',
      'A book rests on a shelf. Where is its energy clue?',
    ),
    subtitle: t(
      '看物体与地球，看高度差和约定的零点。',
      'Look at the object–Earth pair, height changes and the chosen zero.',
    ),
    hook: t(
      '地上的书和架子上的同一本书，都可以静止。可是往下移动时，它们能带来的变化一样吗？',
      'The same book can rest on the floor or a shelf. Could it cause the same changes when moving down?',
    ),
    prediction: t(
      '只把“零高度”从地板改成半米架子，实际向地板下降能转出的能量会变吗？',
      'If the zero-height label moves from the floor to a half-metre shelf, does the energy available in the same descent change?',
    ),
    predictions: [
      t('会，标签制造了能量', 'Yes; the label creates energy'),
      t('不会，实际高度差相同', 'No; the physical height change is the same'),
      t('静止的物体没有任何能量', 'A resting object has no energy'),
    ],
    explore: t(
      '记录0.5 kg在1 m、地板零点；再只改质量到1 kg；回到0.5 kg，把高度改0.5 m；最后0.5 kg、1 m改用架子零点。比较起点Eg、地板Eg与两者之差。',
      'Record 0.5 kg at 1 m with floor zero; change only mass to 1 kg; return to 0.5 kg and change height to 0.5 m; finally use shelf zero for 0.5 kg at 1 m. Compare starting Eg, floor Eg and their difference.',
    ),
    concept: t(
      '重力势能属于物体与地球的相互作用体系，取决于相对位置，不要求正在运动。近地面g近似不变时，Eg=mg(h−h₀)，h₀是选定的零高度。换零点会改每个Eg数字，却不改同一物体下降相同高度差时的能量变化。Eg负值可表示低于约定零点，不是“欠能量”。',
      'Gravitational potential energy belongs to the interacting object–Earth system and depends on relative position, not on current motion. Near Earth’s surface with approximately constant g, Eg=mg(h−h₀), where h₀ is the chosen zero height. Moving the zero changes each Eg number but not the energy change for the same descent. A negative Eg can mean below the chosen zero, not an energy debt.',
    ),
    formula: t(
      'Eg = mg(h−h₀)；下降可转出量 = mg(起点高度−终点高度)',
      'Eg = mg(h−h₀); decrease available = mg(start height−end height)',
    ),
    example: t(
      'g取10 N/kg，0.5 kg书从1 m降到地板。地板零点：5 J→0 J，减少5 J。半米架子零点：2.5 J→−2.5 J，仍减少5 J。换一个标签没有移动书。',
      'With g=10 N/kg, a 0.5 kg book descends from 1 m to the floor. Floor zero: 5 J→0 J, a 5 J decrease. Half-metre shelf zero: 2.5 J→−2.5 J, still a 5 J decrease. Relabelling did not move the book.',
    ),
    misconception: t(
      '“静止”只告诉我们这个参考系中的动能为零，不会删除重力势能。能量变化由高度差决定，不是走过的总路程。这里没有计算落地碰撞；拿在手中慢慢降低时，能量也不必全变成动能。',
      'Rest implies zero kinetic energy in that frame, not zero gravitational potential energy. Its change depends on height difference, not total path length. This board omits impact; when lowering slowly by hand, the decrease need not all become kinetic energy.',
    ),
    realWorld: t(
      '水库、举起的玩具和上楼后的身体，都有与高度相关的能量故事。高度要有共同参照；下一单元会把抬升与做功联系起来。',
      'Reservoirs, raised toys and a person after climbing stairs have height-related energy stories. Heights need a common reference; the next unit connects lifting with work.',
    ),
    summary: t(
      '实际下降看高度差；零点改变数字，不改变同一次下降。',
      'Use the physical height change. A new zero changes labels, not the same descent.',
    ),
    homeExperiment: t(
      '拿同一本轻书，从桌面慢慢降低到较低的位置，再抬回；不自由落下。画起终点，选两个零点，比较高度差是否改变。没有秤也能先完成图与预测。',
      'Slowly lower the same light book from a table height, then lift it back; do not drop it. Draw endpoints and try two zero labels. Does the height difference change? A drawing and prediction are useful without a scale.',
    ),
    vocabulary: [
      t('重力势能', 'gravitational potential energy'),
      t('体系', 'system'),
      t('零高度', 'zero height'),
      t('高度差', 'height difference'),
    ],
    questions: [
      q(
        '地板零点、g=10 N/kg，1 kg物体在1 m的Eg是多少？',
        'With floor zero and g=10 N/kg, what is Eg for 1 kg at 1 m?',
        [
          ['10 J', '10 J'],
          ['1 N', '1 N'],
          ['因为没动，所以0 J', '0 J because it is not moving'],
        ],
        0,
        'mg(h−h₀)=1×10×1=10 J。',
        'mg(h−h₀)=1×10×1=10 J.',
      ),
      q(
        '0.5 kg物体从1 m降到0.5 m，势能减少多少？',
        'How much does Eg decrease for 0.5 kg descending from 1 to 0.5 m?',
        [
          ['5 J', '5 J'],
          ['2.5 J', '2.5 J'],
          [
            '由零点决定，无法比较',
            'It depends on the zero, so cannot be compared',
          ],
        ],
        1,
        '0.5×10×(1−0.5)=2.5 J；同一高度差不受零点影响。',
        '0.5×10×(1−0.5)=2.5 J; shifting zero leaves the difference unchanged.',
      ),
      q(
        '什么体系拥有这里讨论的重力势能？',
        'Which system has the gravitational potential energy discussed here?',
        [
          ['书与地球的相互作用体系', 'The interacting book–Earth system'],
          ['只有印在书上的标签', 'Only the label printed on the book'],
        ],
        0,
        '它与相互作用和相对位置有关，不是书内的一种物质。',
        'It relates to interaction and relative position, not a substance inside the book.',
      ),
    ],
    exit: q(
      '同一幅起终点图，换零点后Eg数字变了，应先比较什么？',
      'Eg labels change after shifting zero on the same endpoint drawing. What should you compare?',
      [
        [
          '起终点的差；它保持相同',
          'The endpoint difference; it stays the same',
        ],
        [
          '只看起点变大，就说能量被制造',
          'A larger starting label proves energy was created',
        ],
      ],
      0,
      '同时调整两个端点的参照，差值保持不变。',
      'Both endpoints use the new reference, so the difference stays unchanged.',
    ),
  },
  {
    id: 'elastic-energy-release',
    stage: 2,
    unit: 'energy',
    kind: 'energy-spring',
    minutes: 19,
    title: t(
      '弹簧回到原长，小车为什么还在动？',
      'The spring reaches its natural length. Why is the cart moving?',
    ),
    subtitle: t(
      '形变的储备，变成运动的线索。',
      'Energy associated with deformation becomes motion.',
    ),
    hook: t(
      '拉住弹簧的小车还没动。松手以后，弹簧变短、小车动起来；恢复原长是不是意味着“一切归零”？',
      'A stretched spring holds a stationary cart. On release, the spring shortens and the cart moves. Does natural length mean everything becomes zero?',
    ),
    prediction: t(
      '同一理想弹簧，拉伸20 cm与10 cm的初始弹性能量相比是多少？',
      'For the same ideal spring, compare initial elastic energies at 20 cm and 10 cm stretch.',
    ),
    predictions: [
      t('2倍', '2 times'),
      t('4倍', '4 times'),
      t('相同', 'The same'),
    ],
    explore: t(
      '完整释放100 N/m弹簧的10 cm拉伸、20 cm拉伸、10 cm压缩，再比较200 N/m的10 cm拉伸。观察蓝紫弹性能量减少、金色动能增加；动画到第一次原长就停，不模拟后续振荡。',
      'Complete four releases: 100 N/m spring stretched 10 cm, stretched 20 cm, compressed 10 cm, then 200 N/m spring stretched 10 cm. Watch elastic energy decrease as kinetic energy grows. Playback ends at the first natural-length crossing, omitting later oscillations.',
    ),
    concept: t(
      '弹簧与小车组成的体系可以把形变相关的弹性势能转成动能。理想线性弹簧Ee=½kx²，k越大通常越难拉开，x是相对原长的形变量，用m。相同k下，拉伸或压缩相同距离储能相同，但释放方向不同。形变翻倍，平方项让储能变4倍。',
      'The spring–cart system can convert elastic potential energy associated with deformation into kinetic energy. For an ideal linear spring Ee=½kx². A larger k means a stiffer spring; x is the change from natural length, in m. Equal stretching/compression magnitudes at the same k store equal energies but release in opposite directions. Doubling deformation quadruples energy.',
    ),
    formula: t(
      'Ee = ½kx²；本理想水平模型中，Ee + Ek保持相同',
      'Ee = ½kx²; Ee + Ek stays constant in this ideal horizontal model',
    ),
    example: t(
      'k=100 N/m，10 cm=0.10 m：Ee=½×100×0.10²=0.50 J。20 cm储2.00 J。0.5 kg车第一次到原长时，弹性能量0、动能0.50 J；它仍有约1.41 m/s速率，不是停了。',
      'At k=100 N/m and 10 cm=0.10 m, Ee=0.50 J. At 20 cm it is 2.00 J. When the 0.5 kg cart first reaches natural length, elastic energy is zero but kinetic energy is 0.50 J; its speed is about 1.41 m/s, not zero.',
    ),
    misconception: t(
      '恢复原长时弹簧力为零，不等于小车速度为零；没有合力也不要求静止。现实弹簧可能有摩擦、声音、材料损耗或非线性，不能把理想100%转换当成实际测量。厘米代入前要换成米。',
      'Zero spring force at natural length does not imply zero cart velocity; zero net force does not require rest. Real springs may have friction, sound, material losses or nonlinear behavior, so ideal 100% conversion is not a measurement. Convert cm to m before substitution.',
    ),
    realWorld: t(
      '发条玩具、弓与蹦床都利用形变相关的储能。它们的材料与受力关系不同，线性弹簧公式不能不加检查地套用。',
      'Wind-up toys, bows and trampolines use deformation-related energy stores. Their materials and force relations differ; the linear-spring formula needs checking before use.',
    ),
    summary: t(
      '原长处，形变储备可变成运动；看整个体系，别只看弹簧。',
      'At natural length, deformation energy can become motion. Follow the whole system, not only the spring.',
    ),
    homeExperiment: t(
      '和家人轻轻拉伸一根软橡皮筋，感受较小与稍大形变的区别，再慢慢放回；不弹射物件，也不朝人释放。只作定性观察，不把橡皮筋当作已知k的线性弹簧。',
      'With a helper, gently stretch a soft elastic band a little and slightly more, then return it slowly. Do not launch objects or release toward people. Make qualitative observations rather than assigning the band a known linear spring constant.',
    ),
    vocabulary: [
      t('弹性势能', 'elastic potential energy'),
      t('形变量', 'extension/compression'),
      t('原长', 'natural length'),
      t('弹簧劲度k', 'spring stiffness k'),
    ],
    questions: [
      q(
        '同k下，10 cm拉伸与10 cm压缩，初始弹性能量怎样？',
        'At the same k, compare energy in 10 cm stretching and compression.',
        [
          ['相同，但释放方向不同', 'Equal, but release directions differ'],
          ['压缩是负能量', 'Compression gives negative energy'],
        ],
        0,
        '能量用x²，方向另外描述。',
        'Energy uses x²; direction is separate information.',
      ),
      q(
        'k=100 N/m，x=0.20 m，Ee是多少？',
        'For k=100 N/m and x=0.20 m, what is Ee?',
        [
          ['1 J', '1 J'],
          ['2 J', '2 J'],
          ['20000 J', '20000 J'],
        ],
        1,
        '½×100×0.20²=2 J，不把20 cm误作20 m。',
        '½×100×0.20²=2 J; do not treat 20 cm as 20 m.',
      ),
      q(
        '保持形变10 cm，只把k从100换200 N/m，储能怎样？',
        'Keep deformation 10 cm but change k from 100 to 200 N/m. What changes?',
        [
          ['翻倍', 'It doubles'],
          ['变4倍', 'It quadruples'],
          ['不变', 'Unchanged'],
        ],
        0,
        '相同x下能量与k成正比；变4倍是x翻倍时的关系。',
        'At fixed x, energy is proportional to k; the fourfold rule applies when x doubles.',
      ),
    ],
    exit: q(
      '原长处Ee为0、Ek为0.5 J，能说“能量没了，车应该停住”吗？',
      'At natural length Ee=0 and Ek=0.5 J. Has energy vanished, so the cart must stop?',
      [
        [
          '不能；能量转成动能，车仍在动',
          'No; energy became kinetic and the cart is moving',
        ],
        ['可以，只要弹簧力为零就静止', 'Yes; zero spring force means rest'],
      ],
      0,
      '区分弹簧形变、合力与小车速度；动画停帧不是物理停车。',
      'Distinguish spring deformation, net force and cart velocity; freezing playback is not physical stopping.',
    ),
  },
  {
    id: 'energy-conservation-track',
    stage: 2,
    unit: 'energy',
    kind: 'energy-track',
    minutes: 18,
    title: t(
      '滑到最低处，少掉的高度变成了什么？',
      'At the bottom, what has the lost height become?',
    ),
    subtitle: t(
      '用同一份能量，读出下滑和回升。',
      'Follow one energy budget downhill and back up.',
    ),
    hook: t(
      '小车从坡顶下滑，越低越快。到另一边又变慢、升高：它是不是走到哪里就制造哪里需要的能量？',
      'A cart slides faster downhill, then slows as it climbs the other side. Is it creating energy wherever needed?',
    ),
    prediction: t(
      '理想无阻力轨道，小车从静止、1 m高出发，另一侧最高能到哪里？',
      'On an ideal resistance-free track, a cart starts at rest from 1 m. How high can it return on the other side?',
    ),
    predictions: [
      t('同样1 m高', 'The same 1 m'),
      t('永远更高', 'Ever higher'),
      t('到谷底能量就消失', 'Energy disappears at the bottom'),
    ],
    explore: t(
      '用位置探针查看出发、最低点和最高返回点，分别记录能量条。拖动探针可以查看中间位置；“巡查”只是扫过账本，不预测小车的真实用时。',
      'Inspect and record departure, bottom and highest return point with the position probe. Drag to inspect intermediate positions; the scan sweeps the ledger and does not predict actual cart travel time.',
    ),
    concept: t(
      '在这个理想小车—地球体系中，没有向外转移能量或外界输入，动能与重力势能可以互相转化，总和保持10 J。下降时Eg减少、Ek增加；回升时相反。能量守恒是对完整账本的约束，不能只看一个物体的一种能量。机械能常包括动能、重力势能与弹性势能；这里没有弹簧。',
      'In this ideal cart–Earth system, no energy transfers out and none is supplied from outside. Kinetic and gravitational potential energy exchange while their sum stays 10 J. Eg decreases as Ek grows downhill; the exchange reverses uphill. Conservation constrains the whole ledger, not one energy type in one object. Mechanical energy commonly includes kinetic, gravitational and elastic potential energy; this track has no spring.',
    ),
    formula: t(
      '本模型：Eg + Ek = 10 J；地板为零点，g = 10 N/kg',
      'This model: Eg + Ek = 10 J; floor zero, g = 10 N/kg',
    ),
    example: t(
      '1 kg小车从1 m出发：Eg=10 J、Ek=0。最低点：Eg=0、Ek=10 J，速率约4.47 m/s。返回1 m：Eg=10 J、Ek=0。0.25 m的两个位置都Eg=2.5 J、Ek=7.5 J，但运动方向相反。',
      'A 1 kg cart starts at 1 m: Eg=10 J and Ek=0. At the bottom Eg=0 and Ek=10 J, speed about 4.47 m/s. At the 1 m return point Eg=10 J and Ek=0. Both 0.25 m positions have Eg=2.5 J and Ek=7.5 J but opposite motion directions.',
    ),
    misconception: t(
      '到最低点Eg为0不等于总能量为0。守恒也不保证任何现实物体都能回到原高度：需要检查摩擦、声音、形变与体系边界。现实小车轮子还有转动动能；本图把车简化为不转动的滑块。',
      'Zero Eg at the bottom is not zero total energy. Conservation does not guarantee a real object returns to its starting height: check friction, sound, deformation and the boundary. Real wheels also have rotational kinetic energy; this drawing idealizes the cart as a non-rotating slider.',
    ),
    realWorld: t(
      '滑道、荡秋千与坡上骑行都能用能量账本思考。观察速度与高度的交换，再寻找现实中多出来的去向，能帮助解释“越来越低”。',
      'Slides, swings and cycling over hills can be understood with energy ledgers. Observe the exchange of speed and height, then identify extra real-world destinations to explain lower returns.',
    ),
    summary: t(
      '高度与速度可以交换；完整账本不凭空增加，也不凭空减少。',
      'Height and speed can exchange. The complete ledger neither creates nor destroys energy.',
    ),
    homeExperiment: t(
      '和家人把小摆球轻轻拉开一点再释放，观察回升高度，保持原悬挂位置。记录它是否每次回到相同高度，寻找空气、摩擦等可能原因；不假装做了无阻力实验。',
      'With a helper, release a small pendulum from a modest displacement and observe return heights with the same suspension. Does it return equally high? Consider air and friction; do not call the home observation resistance-free.',
    ),
    vocabulary: [
      t('能量守恒', 'energy conservation'),
      t('机械能', 'mechanical energy'),
      t('体系边界', 'system boundary'),
      t('能量转化', 'energy conversion'),
    ],
    questions: [
      q(
        '理想轨道最低点Eg=0，总能量10 J。Ek多少？',
        'At the ideal bottom Eg=0 and total energy=10 J. What is Ek?',
        [
          ['0 J', '0 J'],
          ['10 J', '10 J'],
          ['凭空制造20 J', '20 J created from nothing'],
        ],
        1,
        'Eg减少的10 J转成Ek。',
        'The 10 J decrease in Eg becomes Ek.',
      ),
      q(
        '在0.25 m处，1 kg、g=10，总10 J，Ek是多少？',
        'At 0.25 m with 1 kg, g=10 and total 10 J, what is Ek?',
        [
          ['2.5 J', '2.5 J'],
          ['7.5 J', '7.5 J'],
          ['12.5 J', '12.5 J'],
        ],
        1,
        'Eg=2.5 J，Ek=10−2.5=7.5 J。',
        'Eg=2.5 J, so Ek=10−2.5=7.5 J.',
      ),
      q(
        '要判断“能量没了”，首先该做什么？',
        'Before concluding that energy vanished, what should you do?',
        [
          [
            '检查其他储备、传递和体系边界',
            'Check other stores, transfers and the system boundary',
          ],
          ['只看车速变慢就下结论', 'Conclude from slowing alone'],
        ],
        0,
        '一种能量减少可能对应别处增加或向外传递。',
        'A decrease in one type can correspond to an increase elsewhere or an outward transfer.',
      ),
    ],
    exit: q(
      '同一高度的下降与上升位置，动能相同，运动也完全相同吗？',
      'Downhill and uphill positions at the same height have equal kinetic energy. Is their motion identical?',
      [
        [
          '不是，方向不同；能量不告诉全部运动信息',
          'No; directions differ and energy does not specify all motion',
        ],
        ['是，动能相同就同方向', 'Yes; equal energy means equal direction'],
      ],
      0,
      '相同动能可对应相反方向，需要位置和方向信息。',
      'Equal kinetic energies can accompany opposite directions; position and direction still matter.',
    ),
  },
  {
    id: 'energy-dissipation-efficiency',
    stage: 2,
    unit: 'energy',
    kind: 'energy-dissipation',
    minutes: 19,
    title: t(
      '加了粗糙垫，没回到原高的能量去哪了？',
      'A rough patch lowers the return. Where did the energy go?',
    ),
    subtitle: t(
      '守恒不等于全部有用；有用由任务决定。',
      'Conserved does not mean all useful. The task decides useful.',
    ),
    hook: t(
      '同样从1 m出发，铺上粗糙垫后小车只回到较低处。是不是把能量守恒打破了？',
      'Starting from the same 1 m, a rough patch makes the cart return lower. Has conservation been broken?',
    ),
    prediction: t(
      '返回点重力势能6.4 J、动能0，最初10 J，账本还应寻找多少J？',
      'At return Eg=6.4 J and Ek=0, from initial 10 J. How many joules need another destination?',
    ),
    predictions: [
      t('3.6 J', '3.6 J'),
      t('6.4 J', '6.4 J'),
      t('没有，需要删除原来数字', 'None; delete the original numbers'),
    ],
    explore: t(
      '记录光滑轨道的最高返回点；再记录粗糙轨道最低点与最高返回点。比较机械能、内能增加及总账本；看清这里把“重新抬高小车”定义为任务，而不是把所有发热都叫没用。',
      'Record the smooth track’s highest return point, then the rough track’s bottom and highest return. Compare mechanical energy, internal-energy increase and the total ledger. The task here is raising the cart again; warming is not always useless.',
    ),
    concept: t(
      '阻力能使小车与地球的机械能减少，同时轨道、车和周围的内能等增加。这叫能量耗散：能量更分散、更难全部回到原来的任务，不是能量被销毁。扩大到包含这些去向的账本，仍有10 J。效率η=有用输出能量/输入能量；必须先说清任务、边界和数量。',
      'Resistance can reduce the cart–Earth mechanical energy while internal energy and other destinations in the track, cart and surroundings increase. Dissipation makes energy more spread out and harder to return entirely to the original task; it does not destroy energy. Include these destinations and the ledger still contains 10 J. Efficiency η=useful output energy/input energy; specify the task, boundary and quantities first.',
    ),
    formula: t(
      'η = 有用输出 / 输入 × 100%；本任务的输出是最高返回点的Eg',
      'η = useful output / input ×100%; this task’s output is Eg at the highest return',
    ),
    example: t(
      '教学粗糙轨道最低点：Ek=8 J、Eg=0、内能增加2 J。返回0.64 m：Eg=6.4 J、Ek=0、内能增加3.6 J，合计10 J。对重新抬高任务，η=6.4/10=64%。理想无阻力对照100%，不是现实装置保证。',
      'At the teaching rough-track bottom: Ek=8 J, Eg=0 and internal-energy increase=2 J. At the 0.64 m return: Eg=6.4 J, Ek=0 and internal-energy increase=3.6 J, total 10 J. For raising the cart again, η=6.4/10=64%. The ideal resistance-free control is 100%, not a promise for real devices.',
    ),
    misconception: t(
      '“耗散”不是“消失”，机械能不守恒也不否定总能量守恒。先说清楚任务再谈效率：暖手任务需要内能增加，照明任务需要光。相同的能量去向，对不同任务可能有不同用处。',
      'Dissipated does not mean vanished. Non-conservation of mechanical energy does not negate total conservation. State the task before discussing efficiency: warming hands needs an internal-energy increase, whereas lighting needs light. The same destination can be useful in different ways for different tasks.',
    ),
    realWorld: t(
      '刹车让运动能量转移到刹车片与周围；照明和保温也要先问“我想得到什么变化”。真实设计既关注效率，也关注完成任务、成本与条件。',
      'Brakes transfer motion energy into brake parts and surroundings. For lighting or insulation, first ask which change is wanted. Real designs consider the task, efficiency, cost and conditions.',
    ),
    summary: t(
      '能量仍有去向，但不一定都能完成原来的任务；先定义有用，再算效率。',
      'Energy still has destinations, but not all serves the original task. Define useful, then calculate efficiency.',
    ),
    homeExperiment: t(
      '在低矮玩具滑道上比较光滑和铺一小块布的回升，保持起点相同；不要用人体或高处滑落。把较低返回与可能的发热、声音联系起来，但不凭摸不出温差就说没有内能增加。',
      'Compare returns on a low toy track with and without a small cloth patch, keeping the start fixed. Use a toy, not a person or high drop. Relate a lower return to possible warming/sound; an undetectable temperature change does not prove no internal-energy increase.',
    ),
    vocabulary: [
      t('耗散', 'dissipation'),
      t('有用输出', 'useful output'),
      t('效率η', 'efficiency η'),
      t('内能增加', 'internal-energy increase'),
    ],
    questions: [
      q(
        '粗糙轨道返回点6.4 J机械能与3.6 J内能增加，说明什么？',
        'At rough-track return, 6.4 J mechanical energy plus 3.6 J internal-energy increase shows what?',
        [
          [
            '总账仍10 J，机械能减少',
            'Total remains 10 J while mechanical energy decreases',
          ],
          ['总能量只剩6.4 J', 'Only 6.4 J total remains'],
        ],
        0,
        '要把耗散的去向放回完整账本。',
        'Include the dissipated destinations in the complete ledger.',
      ),
      q(
        '本任务输入10 J，有用输出6.4 J，效率是多少？',
        'For input 10 J and useful output 6.4 J, what is efficiency?',
        [
          ['36%', '36%'],
          ['64%', '64%'],
          ['156%', '156%'],
        ],
        1,
        '6.4÷10×100%=64%。',
        '6.4/10×100%=64%.',
      ),
      q(
        '做暖手装置时，内能增加必然是非目标输出吗？',
        'In a hand-warming device, is internal-energy increase necessarily unwanted?',
        [
          ['不是；有用输出由任务决定', 'No; usefulness depends on the task'],
          ['是，发热永远没有用', 'Yes; warming is always useless'],
        ],
        0,
        '同一种去向在不同任务中可能有不同价值。',
        'The same destination can serve different purposes in different tasks.',
      ),
    ],
    exit: q(
      '手摸不出粗糙垫温度改变，能断言小车减少的机械能消失了吗？',
      'You cannot feel a temperature change in the patch. Has the cart’s reduced mechanical energy vanished?',
      [
        [
          '不能；小的分散变化未必能被感觉或工具检出',
          'No; small spread-out changes may evade touch or instruments',
        ],
        ['能，感觉是全部能量的测量', 'Yes; touch measures all energy'],
      ],
      0,
      '检查边界与测量灵敏度，并寻找其他去向；不把没检出当不存在。',
      'Check boundaries and measurement sensitivity and consider other destinations; undetected is not nonexistent.',
    ),
  },
];
