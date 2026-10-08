import { t, q, type Lesson } from './schema';
export const electricityLessons: Lesson[] = [
  {
    id: 'electric-charge-transfer',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-charge',
    minutes: 16,
    title: t(
      '衣服粘在一起，电荷是新造出来的吗？',
      'Clinging clothes: was new charge created?',
    ),
    subtitle: t(
      '追踪一小部分电子，给两个物体一起记账。',
      'Follow a few electrons and account for both objects.',
    ),
    hook: t(
      '脱下毛衣时的小噼啪、塑料梳子吸纸片，看起来像突然出现了某种东西。先别叫它“电流”：我们要找的是电荷怎样分开。',
      'A crackle from a sweater or a comb attracting paper seems to appear suddenly. Before calling it current, investigate how charge separates.',
    ),
    prediction: t(
      '两个原本中性的物体，B给A转移4个示意电子。两个物体加上途中电子的总电荷会怎样？',
      'Two initially neutral objects: four schematic electrons transfer from B to A. What happens to total charge, including electrons in transit?',
    ),
    predictions: [
      t('总量仍为0', 'The total stays zero'),
      t('总量变为−4e', 'The total becomes −4e'),
      t('所有正电荷也一起搬走', 'All positive charge moves too'),
    ],
    explore: t(
      '比较不转移、B→A和A→B三种情况。看谁多了电子、谁少了电子；动画中把正在两物体之间的电子也算进去。',
      'Compare no transfer, B→A and A→B. Check which object gains or loses electrons, including any electron between the objects during playback.',
    ),
    concept: t(
      '普通物体本来就有正、负电荷，中性表示净电荷为0，不表示里面没有电荷。在本固体接触模型中，转移的是少量电子；获得电子的一方净带负电，失去的一方净带正电。电荷被重新分配，没有凭空制造。',
      'Ordinary objects already contain positive and negative charges. Neutral means zero net charge, not no charges. In this solid-contact model a few electrons transfer: the receiver becomes net negative and the donor net positive. Charge is redistributed, not created.',
    ),
    example: t(
      'A、B各有8个正单位和8个电子。B给A四个电子后，A有12个电子，净−4e；B剩4个电子，净+4e。两者净电荷相加仍为0。图中的数量只是示意，真实衣服含有巨量电荷。',
      'A and B each start with eight positive units and eight electrons. After B gives four electrons to A, A has twelve and net −4e; B has four and net +4e. Together the net charge stays zero. These are schematic counts; real clothes contain enormous numbers of charges.',
    ),
    misconception: t(
      '摩擦不是“造电荷的机器”，也不是把物体里所有电子搬走。转移方向与材料和条件有关；本图规定转移方向，不预测你的梳子一定带哪种电。',
      'Rubbing does not manufacture charge or move every electron out of an object. Direction depends on materials and conditions; this diagram assigns a transfer, rather than predicting your comb’s sign.',
    ),
    realWorld: t(
      '干燥时衣物更容易留下电荷不平衡；潮湿、接触其他物体等会改变电荷保留情况。一次没吸到纸片，不足以推翻电荷守恒。',
      'Dry clothes can retain a charge imbalance more easily; moisture and contact with other objects affect retention. One failed paper attraction does not overturn charge conservation.',
    ),
    summary: t(
      '静电现象常来自电荷重新分配；把所有相关物体一起算，总电荷守恒。',
      'Static effects often involve charge redistribution; total charge is conserved across the whole system.',
    ),
    homeExperiment: t(
      '用干燥塑料梳子梳几下头发，靠近少量小纸片，不必接触。记录梳前、梳后与等待一会儿后的区别。只写观察，不用吸引结果猜电荷正负。',
      'Comb dry hair with a plastic comb, then approach a few small paper pieces without needing contact. Compare before combing, after combing and after waiting. Record observations; attraction alone cannot tell the sign.',
    ),
    formula: t(
      '净电荷=正电荷总量＋负电荷总量；电子电荷为−e。',
      'Net charge = total positive charge + total negative charge; an electron has charge −e.',
    ),
    vocabulary: [
      t('静电', 'static electricity'),
      t('电荷', 'charge'),
      t('电子', 'electron'),
      t('中性', 'neutral'),
    ],
    questions: [
      q(
        '“中性”意味着什么？',
        'What does neutral mean?',
        [
          ['没有电子', 'No electrons'],
          [
            '正负电荷抵消，净电荷为0',
            'Positive and negative charges balance to zero net charge',
          ],
          ['不能受任何电作用', 'No electrical interaction is possible'],
        ],
        1,
        '物体可以包含许多电荷，同时净电荷为0。',
        'An object can contain many charges and still have zero net charge.',
      ),
      q(
        'A多了4个电子，B少了4个。A和B的净电荷分别是？',
        'A gains four electrons and B loses four. Their net charges?',
        [
          ['+4e、−4e', '+4e, −4e'],
          ['−4e、−4e', '−4e, −4e'],
          ['−4e、+4e', '−4e, +4e'],
        ],
        2,
        '电子为负；得到电子净负，失去电子净正。',
        'Electrons are negative: gaining them makes net negative, losing them net positive.',
      ),
      q(
        '电子正在途中时，守恒账本应包括？',
        'While an electron is in transit, the conservation account includes?',
        [
          ['A、B和途中电子', 'A, B and the electron in transit'],
          ['只看A', 'Only A'],
        ],
        0,
        '途中电子没有消失，仍属于这个封闭模型的总账。',
        'The moving electron still belongs in the whole closed-model account.',
      ),
    ],
    exit: q(
      '梳子吸纸片，哪句话最稳妥？',
      'A comb attracts paper. Which claim is justified?',
      [
        ['已经证明梳子带正电', 'The comb is proved positive'],
        [
          '观察到吸引，但单凭吸引不能确定正负',
          'Attraction was observed, but it alone does not establish the sign',
        ],
      ],
      1,
      '吸引还可能包含中性物体的极化，下一课继续查。',
      'Attraction can also involve a neutral object’s polarization; investigate next.',
    ),
  },
  {
    id: 'electric-attract-repel-neutral',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-interaction',
    minutes: 16,
    title: t(
      '吸过来，就一定带相反电荷吗？',
      'Attraction: must the charges be opposite?',
    ),
    subtitle: t(
      '同号、异号与中性物体，三种情况分开看。',
      'Distinguish like signs, unlike signs and a neutral object.',
    ),
    hook: t(
      '气球能吸纸片，也能让另一个气球躲开。纸片原来并没有被摩擦过，为什么它也可能被吸引？',
      'A balloon can attract paper or push another balloon away. Why might paper be attracted even when it was not rubbed?',
    ),
    prediction: t(
      '左边固定为负电物体。右边分别为负电、正电与可极化的中性物体，哪种情况会排斥？',
      'The left object is negative. The partner is negative, positive or a polarizable neutral object. Which repels?',
    ),
    predictions: [
      t('负电与负电', 'Negative with negative'),
      t('负电与正电', 'Negative with positive'),
      t('中性的一定排斥', 'Neutral always repels'),
    ],
    explore: t(
      '完成三种符号检查。物体保持固定，箭头表示作用方向，不是已经发生的运动。中性物体里，正负分布可偏移，但净电荷仍为0。',
      'Complete three sign checks. Objects stay held; arrows indicate interaction directions, not observed motion. In the neutral partner, charge distribution shifts while net charge remains zero.',
    ),
    concept: t(
      '同号电荷相斥，异号相吸。带电物体也可能吸引中性物体：它使中性物体内部的电荷分布偏移，较近一侧与带电物体有相反电性，这叫极化。本图定性说明，不计算力大小。',
      'Like charges repel and unlike charges attract. A charged object can also attract a neutral one by shifting its internal charge distribution; the nearer side becomes relatively opposite. This is polarization. The diagram is qualitative and does not calculate force.',
    ),
    example: t(
      '左边−4e：右边−4e时两者相斥；右边+4e时相吸；右边净0时，可极化后仍相吸。最后一种没有把整张纸片变成正电物体。',
      'With −4e on the left, a −4e partner repels, a +4e partner attracts, and a net-zero polarizable partner can attract too. The last case does not turn the whole paper piece into a positive object.',
    ),
    misconception: t(
      '“吸引=异号”少了一种重要可能。极化也不等于有电荷跨过空气转移；不接触时，可以先出现内部重新分布。',
      '“Attraction means opposite net charges” misses an important possibility. Polarization does not require charge to cross the air gap; internal redistribution can happen without contact.',
    ),
    realWorld: t(
      '塑料包装贴住物品、梳子吸纸片，都可以用电荷与极化寻找解释。但黏胶、潮湿和气流也可能影响你的观察，要保留其他解释。',
      'Clinging plastic wrap and a comb attracting paper invite charge and polarization explanations. Adhesive, moisture and airflow may also matter in your observation; keep alternatives in mind.',
    ),
    summary: t(
      '排斥可帮助识别同号带电；吸引本身不能证明两个物体净电荷异号。',
      'Repulsion can reveal like net charges; attraction alone does not prove opposite net charges.',
    ),
    homeExperiment: t(
      '把两只轻气球用线悬挂，用同一块干布分别摩擦后慢慢靠近，再把一只气球靠近未摩擦的纸片。比较吸引与排斥，记录没有明显效果的情况。',
      'Hang two light balloons on strings, rub each with the same dry cloth and bring them close. Then approach unrubbed paper with one balloon. Compare attraction and repulsion, retaining unclear outcomes.',
    ),
    vocabulary: [
      t('正电荷', 'positive charge'),
      t('负电荷', 'negative charge'),
      t('排斥', 'repulsion'),
      t('极化', 'polarization'),
    ],
    questions: [
      q(
        '两个净带负电的物体，一般会？',
        'Two net-negative objects generally?',
        [
          ['相吸', 'Attract'],
          ['相斥', 'Repel'],
          ['电荷自动消失', 'Lose their charge automatically'],
        ],
        1,
        '同号相斥，不需要先接触。',
        'Like signs repel without requiring contact.',
      ),
      q(
        '中性纸片极化后，净电荷一定变正吗？',
        'Must polarized neutral paper become net positive?',
        [
          [
            '不一定；分布变了，净电荷可仍为0',
            'No; distribution changes while net charge can stay zero',
          ],
          ['一定，所有电子都走了', 'Yes; all electrons leave'],
        ],
        0,
        '分布偏移与净电荷转移不同。',
        'Redistributing charge differs from changing total net charge.',
      ),
      q(
        '图中的固定物体有相吸箭头，意味着？',
        'Attraction arrows on held objects mean?',
        [
          ['我们算出了加速度', 'Acceleration was calculated'],
          ['我们测出了真实力', 'Real force was measured'],
          [
            '箭头说明作用方向，未预测运动',
            'The arrows show interaction direction, not a motion prediction',
          ],
        ],
        2,
        '固定姿态的定性检查不提供力或运动数值。',
        'A held qualitative check gives no force or motion value.',
      ),
    ],
    exit: q(
      '包装膜吸住中性物体，下一步应？',
      'Plastic wrap attracts a neutral object. What next?',
      [
        [
          '先考虑极化等解释，别单凭吸引断言异号',
          'Consider polarization and alternatives; do not infer opposite net signs from attraction alone',
        ],
        ['宣布电荷守恒失效', 'Declare charge conservation broken'],
      ],
      0,
      '物体可以整体中性，同时内部电荷分布改变。',
      'An object can remain net neutral while its internal charge distribution changes.',
    ),
  },
  {
    id: 'electric-current-counts-charge',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-current',
    minutes: 18,
    title: t(
      '同样的电荷，慢慢通过和快速通过一样吗？',
      'Same charge: does passing slowly or quickly matter?',
    ),
    subtitle: t(
      '在导线的一处数电荷，把“多少”和“多快”分开。',
      'Count charge at one wire section: how much versus how quickly.',
    ),
    hook: t(
      '走廊里一共走过20个人，不能说明每秒多拥挤。导线里的电流也需要一个观察时间窗口。',
      'Twenty people passing a doorway does not tell you how busy each second was. Current in a wire also needs a time window.',
    ),
    prediction: t(
      '2 C电荷分别在2 s与4 s内通过同一截面，哪个窗口的平均电流较大？',
      'Two coulombs pass one section in either 2 s or 4 s. Which window has greater average current?',
    ),
    predictions: [
      t('2 s窗口较大', 'The 2 s window'),
      t('4 s窗口较大', 'The 4 s window'),
      t('电荷相同，电流一定相同', 'Same charge must mean same current'),
    ],
    explore: t(
      '比较1 C/2 s、2 C/2 s、2 C/4 s。示意包每包代表0.25 C的许多电荷；计数线记录已通过的包。2.4秒播放压缩了规定的物理窗口。',
      'Compare 1 C/2 s, 2 C/2 s and 2 C/4 s. Each schematic packet stands for 0.25 C of many charges; the section counts passed packets. A 2.4 s playback compresses the assigned physical window.',
    ),
    concept: t(
      '电流描述单位时间通过导线某截面的电荷量，单位安培A。1 A表示每秒通过1 C。约定电流方向是正电荷运动方向；金属导线的电子带负电，定向漂移方向与约定电流相反。',
      'Current describes charge passing a wire section per unit time, in amperes (A). One ampere means one coulomb per second. Conventional current follows positive-charge motion; negatively charged electrons in a metal drift in the opposite direction.',
    ),
    example: t(
      '1 C÷2 s=0.5 A；2 C÷2 s=1 A；2 C÷4 s=0.5 A。最后一对电荷量不同、时间也不同，却可以有相同的平均电流。',
      '1 C/2 s = 0.5 A; 2 C/2 s = 1 A; 2 C/4 s = 0.5 A. Different total charges and times can give the same average current.',
    ),
    misconception: t(
      '电流不是一共积累的电荷，也不是单个电子跑得多快。这里画的正向示意包不是金属里的正电子；真实电子数量与微观速度不按图画比例。',
      'Current is not total accumulated charge or the speed of one electron. Positive-direction packets are a convention, not positrons moving in a metal; real charge counts and microscopic speeds are not drawn to scale.',
    ),
    realWorld: t(
      '充电器标注的A与电流有关，不是“电荷用完的数量”。实际充电电流可能变化；若变化，Q/Δt给出这段时间的平均值。',
      'An ampere label on a charger concerns current, not a quantity of charge being used up. Charging current can vary; Q/Δt gives an average over the chosen interval.',
    ),
    summary: t(
      '看电流，要把通过的电荷量与经过的时间一起看。',
      'To understand current, consider passed charge and elapsed time together.',
    ),
    homeExperiment: t(
      '观察一个充电器或电池玩具的外部标签，找A、mA与V，把不同单位分列记录。只看标签和已有设备的正常操作，不打开充电器或接市电实验。',
      'Read the outside label of a charger or battery toy. List A, mA and V separately. Observe labels and normal operation only; do not open a charger or experiment with mains electricity.',
    ),
    formula: t(
      '平均电流 I=Q/Δt；1 A=1 C/s。',
      'Average current I=Q/Δt; 1 A=1 C/s.',
    ),
    vocabulary: [
      t('电流', 'current'),
      t('电荷量', 'charge quantity'),
      t('库仑', 'coulomb'),
      t('安培', 'ampere'),
    ],
    questions: [
      q(
        '2 C在4 s通过，平均电流？',
        '2 C passes in 4 s. Average current?',
        [
          ['8 A', '8 A'],
          ['2 A', '2 A'],
          ['0.5 A', '0.5 A'],
        ],
        2,
        '除以时间，2/4=0.5 C/s。',
        'Divide charge by time: 2/4 = 0.5 C/s.',
      ),
      q(
        '要比较两个电流，哪些数据要同时知道？',
        'Which data are needed to compare currents?',
        [
          ['电荷量和时间', 'Charge and time'],
          ['只看电荷量', 'Only charge'],
        ],
        0,
        '同样多的电荷可以在不同时间内通过。',
        'The same charge can pass in different time intervals.',
      ),
      q(
        '金属中的电子漂移方向与约定电流？',
        'Electron drift in metal versus conventional current?',
        [
          ['永远相同', 'Always the same'],
          ['相反', 'Opposite'],
        ],
        1,
        '约定方向按正电荷；电子为负电荷。',
        'The convention follows positive charge; electrons are negative.',
      ),
    ],
    exit: q(
      '同样2 C通过，窗口从2 s变4 s，应怎样解释？',
      'The same 2 C passes; the window changes from 2 s to 4 s. Explain?',
      [
        ['电荷量减半', 'Charge halves'],
        [
          '电流平均值减半，电荷量没变',
          'Average current halves while total charge stays the same',
        ],
      ],
      1,
      '由1 A变0.5 A，不能把电荷量与电流混为一谈。',
      'It changes from 1 A to 0.5 A; charge quantity and current are different.',
    ),
  },
  {
    id: 'electric-complete-loop',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-circuit',
    minutes: 16,
    title: t(
      '灯泡接到电池，为什么还不亮？',
      'Connected to a battery: why is the lamp still off?',
    ),
    subtitle: t(
      '别只找一根线，沿整个回路走一圈。',
      'Trace the whole loop, not just one wire.',
    ),
    hook: t(
      '一根线把电池接到灯泡，看起来已经“送到了”。可电路需要一个完整的去路和回路。',
      'One wire reaches from a battery to a lamp, so it seems connected. A circuit needs a complete outward and return path.',
    ),
    prediction: t(
      '闭合回路、开关断开、少一段回线，哪种能保持灯泡发光？',
      'A closed loop, an open switch or a missing return wire: which can keep the lamp lit?',
    ),
    predictions: [
      t('只要一根线接到灯泡就行', 'One wire reaching the lamp is enough'),
      t('只有完整闭合的回路', 'Only the complete closed loop'),
      t('只要电池标有V就行', 'A voltage label alone is enough'),
    ],
    explore: t(
      '沿三种线路逐段检查。导线里原本已有电荷；示意点表达约定电流方向。断路时稳定电流为0，电池两端仍可能有电压。',
      'Inspect each of three paths. Wires already contain charges; moving markers show conventional current. An open circuit has zero steady current even though a battery can still have terminal voltage.',
    ),
    concept: t(
      '简单直流电路需要电源、用电元件和导电的闭合通路。完整通路允许电荷持续定向转移；电池提供电势差，灯把电能转成光和热。用电元件改变能量去向，不消耗电荷。',
      'A simple DC circuit needs a source, a load and a closed conducting path. A complete path allows sustained directed charge transfer. The battery supplies potential difference and the lamp transfers electrical energy to light and heat; it does not consume charge.',
    ),
    example: t(
      '本模型用3 V理想电源和10 Ω恒定电阻灯。闭合时电流0.3 A；开关断开或回线缺失时，稳定电流为0。下一部分会解释这些电流值怎样计算。',
      'This model has a 3 V ideal source and a constant 10 Ω resistive lamp. Closed current is 0.3 A; an open switch or missing return gives zero steady current. The next quantitative section will explain the calculation.',
    ),
    misconception: t(
      '“电池把一批电荷发出去，灯把它吃掉”会把电荷与能量混淆。金属里的电荷原本就存在；真实接通瞬间有短暂变化，本图只讨论接通后的稳定状态。',
      'A battery sending out charges for the lamp to eat confuses charge with energy. Charges already exist in the metal. Real switching has a transient; this diagram considers the later steady state.',
    ),
    realWorld: t(
      '手电筒可能因为接触不良而熄灭，即使电池还有能量。排查时可以先追踪正常接触路径，而不是把每次不亮都叫“没电”。',
      'A torch can go dark because of poor contact even when its battery has energy remaining. Trace the normal contact path before assuming every failure is a flat battery.',
    ),
    summary: t(
      '闭合且导电的回路，让电荷持续流动；灯转移能量，电荷不被吃掉。',
      'A closed conducting loop supports sustained current; a lamp transfers energy without eating charge.',
    ),
    homeExperiment: t(
      '观察封闭的电池手电筒，开、关各一次，画电池—开关—灯—回线的路径。只看正常开关操作，不拆装灯具，也不把电池两端直接相连。',
      'Observe a closed battery torch, switching it on and off once. Sketch battery, switch, lamp and return path. Use normal controls only; do not dismantle it or directly join battery terminals.',
    ),
    vocabulary: [
      t('电路', 'circuit'),
      t('闭合回路', 'closed loop'),
      t('断路', 'open circuit'),
      t('用电元件', 'load'),
    ],
    questions: [
      q(
        '只用一根线连电池和灯，关键缺少？',
        'One wire joins a battery and lamp. What is missing?',
        [
          ['漂亮外壳', 'An attractive case'],
          [
            '完整返回另一电池端的通路',
            'A complete return to the other battery terminal',
          ],
          ['更多灯泡', 'More lamps'],
        ],
        1,
        '去路与回路共同组成闭合电路。',
        'Outward and return paths together form the closed circuit.',
      ),
      q(
        '开关断开后的稳定电流？',
        'Steady current with an open switch?',
        [
          ['0 A', '0 A'],
          ['一定仍是0.3 A', 'It must remain 0.3 A'],
        ],
        0,
        '简单直流通路被断开，不能保持持续电流。',
        'The simple DC path is interrupted, preventing sustained current.',
      ),
      q(
        '灯发光时，哪项被转移？',
        'When the lamp lights, what is transferred?',
        [
          ['电荷被消灭', 'Charge is destroyed'],
          ['正负电荷变没了', 'Positive and negative charges disappear'],
          ['能量转成光和热', 'Energy transfers to light and heat'],
        ],
        2,
        '电荷守恒和能量转移是不同的账本。',
        'Charge conservation and energy transfers are separate accounts.',
      ),
    ],
    exit: q(
      '电池仍有电压，但灯不亮，可能吗？',
      'The battery has voltage but the lamp is off. Possible?',
      [
        ['可能，例如回线断开', 'Yes, for example a broken return path'],
        ['不可能，电压就是电流', 'No; voltage is current'],
      ],
      0,
      '有电势差不等于存在完整导电回路。',
      'A potential difference does not guarantee a complete conducting loop.',
    ),
  },
  {
    id: 'electric-battery-energy-push',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-battery',
    minutes: 18,
    title: t(
      '电池换个方向，电荷还是原来的那些吗？',
      'Reverse a cell: are the charges still there?',
    ),
    subtitle: t(
      '电池改变驱动方向和能量转移，不制造导线里的电荷。',
      'A cell changes driving direction and energy transfer, not the wire’s charge supply.',
    ),
    hook: t(
      '遥控器电池仓里的“＋、−”是重要线索。它们说明接法与方向，不表示正端里面“全是正电荷”、负端里面“全是负电荷”。',
      'The + and − marks in a remote’s battery compartment matter. They indicate connections and polarity, not terminals containing only one kind of charge.',
    ),
    prediction: t(
      '同一个恒定电阻灯，单节1.5 V电池反接。稳定电流方向与灯的耗电功率怎样变？',
      'Reverse one 1.5 V cell feeding the same resistive lamp. What happens to current direction and electrical power?',
    ),
    predictions: [
      t('方向反转，耗电功率相同', 'Direction reverses; power stays the same'),
      t('电荷全部消失', 'All charge disappears'),
      t('任何元件反接都不会变', 'Every component is unaffected by reversal'),
    ],
    explore: t(
      '比较单节正接、两节同向串接和单节反接。正负号按图中的参考方向记电流；灯的电功率仍非负。示意点不是电子，金属电子与约定电流反向。',
      'Compare one forward cell, two aligned series cells and one reversed cell. Current signs follow the diagram’s reference direction; lamp power stays nonnegative. Markers are not electrons; metal electrons drift opposite conventional current.',
    ),
    concept: t(
      '电池的化学作用维持两端电势差，把化学储备通过电路转移给用电元件。这里1.5 V意味着每库仑电荷对应1.5 J的能量转移差，不是每秒产生1.5个电荷。电池内部的载流过程也不等于金属导线中的电子漂移。',
      'Chemical action maintains a cell’s potential difference and transfers its chemical store through the circuit. Here 1.5 V corresponds to 1.5 J per coulomb, not 1.5 charges created per second. Charge transport inside a battery differs from electron drift in metal wires.',
    ),
    example: t(
      '恒定10 Ω灯：+1.5 V时+0.15 A，2 s输入0.45 J；两节同向共3 V时0.3 A，输入1.8 J；−1.5 V时−0.15 A，输入仍0.45 J。两节不是普遍让功率只翻倍。',
      'For a constant 10 Ω lamp, +1.5 V gives +0.15 A and 0.45 J in 2 s; two aligned cells give 3 V, 0.3 A and 1.8 J. At −1.5 V current is −0.15 A while energy remains 0.45 J. Two cells do not universally just double power.',
    ),
    misconception: t(
      '电池不是电荷仓库向空导线倒电荷。反接对这种电阻灯不改变功率，但LED、电子玩具等可能不能工作或损坏，不能把本模型推广给所有设备。真实电池有内阻、容量和供电限制。',
      'A cell does not pour charge into empty wires. Reversal leaves this resistive lamp’s power unchanged, but LEDs and electronic toys may fail or be damaged. Real cells have internal resistance, capacity and supply limits.',
    ),
    realWorld: t(
      '遥控器常要求两节电池按指定方向装入，正确接法取决于电池仓内部连接。伏特V与容量mAh是不同信息：前者谈每单位电荷的能量，后者与可转移电荷总量有关。',
      'A remote specifies how two cells fit because its internal connections matter. Volts and mAh describe different information: energy per charge versus a capacity related to total transferable charge.',
    ),
    summary: t(
      '电池提供电势差和能量；反接改变驱动方向，设备反应取决于元件。',
      'A battery supplies potential difference and energy; reversal changes driving direction, with behavior depending on the device.',
    ),
    homeExperiment: t(
      '观察遥控器或玩具的电池仓外部标记、说明书与正常安装方向，画出＋、−。不实际反接设备、不把新旧电池混用，也不短接电池；实验台上的反接只在模型里。',
      'Observe a remote or toy’s polarity marks, instructions and normal installation. Sketch + and −. Do not reverse an actual device, mix old and new cells or short a battery; reversal stays virtual here.',
    ),
    formula: t(
      '1 V=1 J/C；本图的电流正负表示参考方向。',
      '1 V=1 J/C; current signs in this diagram indicate the chosen reference direction.',
    ),
    vocabulary: [
      t('电池', 'battery'),
      t('电势差', 'potential difference'),
      t('极性', 'polarity'),
      t('伏特', 'volt'),
    ],
    questions: [
      q(
        '电池在这个闭合电路中主要提供？',
        'What does the cell mainly provide in this closed circuit?',
        [
          ['电势差与能量转移', 'Potential difference and energy transfer'],
          ['从无到有的电荷', 'Newly created charge'],
          ['被灯吃掉的电子', 'Electrons for the lamp to eat'],
        ],
        0,
        '导线已有电荷，电池化学作用维持驱动条件。',
        'The wire already has charges; chemical action maintains the driving conditions.',
      ),
      q(
        '图里−0.15 A意味着？',
        'What does −0.15 A mean here?',
        [
          ['电流不存在', 'No current exists'],
          [
            '电流方向与选定参考方向相反',
            'Current is opposite the chosen reference direction',
          ],
        ],
        1,
        '负号表示方向，不是负数量的电荷被消灭。',
        'The sign indicates direction, not charge disappearing.',
      ),
      q(
        '电阻灯反接功率相同，可以据此反接遥控器吗？',
        'The resistive lamp has equal reversed power. May we reverse a remote?',
        [
          ['可以，所有元件都一样', 'Yes; all components are alike'],
          ['可以，用来检查电池', 'Yes; it tests the battery'],
          [
            '不可以，电子设备可能需要指定极性',
            'No; electronics may require specified polarity',
          ],
        ],
        2,
        '模型元件的对称性不能推广给实际电子设备。',
        'This model’s symmetry does not apply to all electronic devices.',
      ),
    ],
    exit: q(
      '两节电池同向串接，为什么灯得到更多能量？',
      'Why does the lamp receive more energy with two aligned cells?',
      [
        [
          '电池把灯中的电荷变多了两倍',
          'They double the charge inside the lamp',
        ],
        [
          '电势差改变，稳定电流和能量转移率随电路改变',
          'Potential difference changes, changing steady current and energy-transfer rate',
        ],
      ],
      1,
      '同一个恒定电阻负载的响应由整个电路决定。',
      'The response of a fixed resistive load depends on the whole circuit.',
    ),
  },
  {
    id: 'electric-lamp-keeps-charge',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-lamp',
    minutes: 18,
    title: t(
      '灯泡吃掉的是电流，还是转移能量？',
      'Does a lamp eat current, or transfer energy?',
    ),
    subtitle: t(
      '进出电荷相同，光与热的账本可以不同。',
      'Equal charge in and out; different light and heat accounts.',
    ),
    hook: t(
      '灯发光，还会变热。假如它把电荷吃掉，导线另一边岂不是越来越空？先把电荷账本和能量账本放到不同位置。',
      'A lamp gives light and gets warm. If it ate charges, would the wire after it become empty? Keep charge and energy in separate accounts.',
    ),
    prediction: t(
      '同样3 V电源、10 Ω模型灯，规定光能占比改变。灯前、灯后的稳定电流怎样？',
      'Same 3 V source and 10 Ω model lamp, with different assigned light-energy shares. What happens to steady current before and after it?',
    ),
    predictions: [
      t('灯后的电流更小', 'Current after the lamp is smaller'),
      t('灯后的电流为0', 'Current after the lamp is zero'),
      t('灯前、灯后都保持0.3 A', 'Both remain 0.3 A'),
    ],
    explore: t(
      '比较10%、30%、60%三个规定光能占比。沿回路看电流示意点不消失，再看同一2 s窗口的光能与热能如何分配。占比是教学条件，不是测出的灯种效率。',
      'Compare assigned light shares of 10%, 30% and 60%. Current markers do not vanish at the lamp; inspect light and thermal energy in the same 2 s window. Shares are teaching conditions, not measured lamp-type efficiencies.',
    ),
    concept: t(
      '稳定的单回路里，同一时间进入灯与离开灯的电荷量相同。电池维持电势差，电路通过电场转移能量；灯把输入能量转成光与热。不是每个电子携带一包光、随后被用掉。',
      'In a steady single loop, equal charge enters and leaves the lamp in equal time. The cell maintains potential difference and energy transfers through the circuit’s electric field; the lamp converts input to light and thermal energy. Electrons are not packets of light that get used up.',
    ),
    example: t(
      '2 s内灯前、灯后均通过0.6 C，平均电流0.3 A。灯输入1.8 J：光占30%时，光0.54 J、热1.26 J；光占60%时，光1.08 J、热0.72 J。两种情况没有少掉电荷。',
      'In 2 s, 0.6 C passes both sides of the lamp, averaging 0.3 A. Input is 1.8 J: at 30% light, 0.54 J goes to light and 1.26 J to heat; at 60%, 1.08 J goes to light and 0.72 J to heat. No charge is lost.',
    ),
    misconception: t(
      '“耗电”在日常语言里通常是说能量储备减少，不是电荷消失。本图把灯当恒定电阻和规定能量分配器；真实灯丝电阻随温度变，LED也不是简单恒定电阻。',
      'Everyday “using electricity” usually means reducing an energy store, not destroying charge. This lamp is a constant resistor with assigned energy shares. A real filament changes resistance with temperature, and an LED is not a simple constant resistor.',
    ),
    realWorld: t(
      '灯的设计能改变多少输入能量成为有用光。比较“亮不亮”还要看光的方向、颜色和环境，不能把画面黄色深浅当成真实照度读数。',
      'Lamp design affects how much input becomes useful light. Perceived brightness also depends on direction, colour and surroundings; a yellow drawing is not a measured illuminance.',
    ),
    summary: t(
      '灯转移能量，电荷通过它继续参与回路。',
      'A lamp transfers energy while charge continues through the circuit.',
    ),
    homeExperiment: t(
      '正常使用电池手电筒，观察照在纸上的光斑，画能量从电池储备到光与周围的去向。不要摸热灯泡，也不把看起来亮的程度记作焦耳。',
      'Use a battery torch normally and observe its spot on paper. Sketch energy from the battery store to light and surroundings. Do not touch hot bulbs or record apparent brightness as joules.',
    ),
    formula: t(
      '灯前电流=灯后电流（稳定单回路）；输入能量=光能＋热能（本模型）。',
      'Current before = current after (steady single loop); input energy = light + thermal energy (this model).',
    ),
    vocabulary: [
      t('灯泡', 'lamp'),
      t('能量转移', 'energy transfer'),
      t('稳定电流', 'steady current'),
      t('光能占比', 'light-energy share'),
    ],
    questions: [
      q(
        '灯前通过0.6 C，稳定单回路中灯后通过？',
        '0.6 C passes before the lamp. What passes after it in a steady single loop?',
        [
          ['0 C', '0 C'],
          ['同样0.6 C', 'The same 0.6 C'],
          ['一定只有0.3 C', 'Only 0.3 C'],
        ],
        1,
        '没有电荷持续堆积或消失，进入与离开相等。',
        'No sustained charge buildup or loss: entering equals leaving.',
      ),
      q(
        '1.8 J输入，光0.54 J，本模型热能为？',
        'Input 1.8 J and light 0.54 J. Thermal energy in this model?',
        [
          ['1.26 J', '1.26 J'],
          ['2.34 J', '2.34 J'],
        ],
        0,
        '能量账本相减，1.8−0.54=1.26。',
        'Subtract in the energy account: 1.8−0.54 = 1.26.',
      ),
      q(
        '同样耗电功率，却产生更多有用光，可以说明？',
        'Same electrical power but more useful light means?',
        [
          ['电荷被用掉更多', 'More charge is consumed'],
          ['电荷没有负号了', 'Charge loses its negative sign'],
          [
            '输入能量的分配更有利于照明',
            'The energy share is more useful for lighting',
          ],
        ],
        2,
        '改的是能量去向，不是电荷是否守恒。',
        'The energy destination changes, not charge conservation.',
      ),
    ],
    exit: q(
      '家人说灯“用了电”，你会怎样补充？',
      'Someone says a lamp “used electricity.” How would you clarify?',
      [
        [
          '灯把能量转成光和热，电荷并未被吃掉',
          'The lamp transfers energy to light and heat without eating charge',
        ],
        ['灯后导线变空了', 'The wire after it becomes empty'],
      ],
      0,
      '把日常表达译成能量账本，会更准确。',
      'Translate the everyday phrase into an energy account for accuracy.',
    ),
  },
  {
    id: 'electric-switch-breaks-loop',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-switch',
    minutes: 15,
    title: t(
      '开关在灯前或灯后，真的有区别吗？',
      'A switch before or after the lamp: does it matter?',
    ),
    subtitle: t(
      '一个小缺口，改变的是整个闭合路径。',
      'One small gap changes the whole closed path.',
    ),
    hook: t(
      '有些人觉得开关必须放在灯前，才能挡住“送到灯的电”。在电池单回路模型里，先沿线路完整走一圈再判断。',
      'It is tempting to put a switch “before” a lamp to block electricity reaching it. In a battery single-loop model, trace the whole path before deciding.',
    ),
    prediction: t(
      '开关改放到灯后的回线上，再断开，灯会继续亮吗？',
      'Move the switch to the return after the lamp and open it. Does the lamp keep shining?',
    ),
    predictions: [
      t('会，因为电已经到灯了', 'Yes; electricity has already reached it'),
      t('不会，单回路仍被断开', 'No; the single loop is still interrupted'),
      t('必须先搬走所有电子才会灭', 'All electrons must leave first'),
    ],
    explore: t(
      '检查闭合、供电侧断开、回线侧断开。两个缺口位置不同，但整个稳定单回路都不再导通。画出的电池开关实验不是家用市电开关接线教程。',
      'Inspect closed, supply-side open and return-side open states. The gaps differ in location, but both interrupt the steady single loop. This battery model is not a mains switch-wiring tutorial.',
    ),
    concept: t(
      '开关闭合时提供导电接触，断开时留下不导通的间隙。在简单电池单回路里，任一处断开都会停止稳定电流。停止不意味着电荷离开了导线，导线里仍有电荷。',
      'A closed switch provides conducting contact; an open one creates a nonconducting gap. In a simple battery single loop, a break anywhere stops steady current. Charges remain in the wire rather than leaving it.',
    ),
    example: t(
      '闭合时模型灯0.3 A、0.9 W。无论在供电侧还是回线侧断开，稳定电流和灯功率都为0。本图不模拟接通与断开瞬间的电场传播或火花。',
      'Closed, the model lamp has 0.3 A and 0.9 W. Opening either supply or return makes steady current and lamp power zero. Switching transients, field propagation and sparks are not simulated.',
    ),
    misconception: t(
      '约定电流的“先后”不表示能量按一个电子从电池出发走到灯的旅程才传来。真实家庭线路还涉及保护与带电端隔离，本电池模型的等效断路不能当安装规则。',
      'Conventional-current order does not mean energy waits for an electron’s journey from battery to lamp. Household wiring also involves protection and isolating live conductors; equivalent breaks in this battery model are not installation rules.',
    ),
    realWorld: t(
      '按钮、拨动开关、磁控开关都可以改变通路的导通状态。接触氧化、松动也可能形成断路，外观“按下去”不一定代表接触良好。',
      'Push buttons, toggle switches and magnetic switches can change whether a path conducts. Oxidation or loose contacts can interrupt a path; an apparently pressed button need not make good contact.',
    ),
    summary: t(
      '电池单回路里，任意一处断开都会停止稳定电流；电荷仍在。',
      'A break anywhere in a battery single loop stops steady current; charges remain.',
    ),
    homeExperiment: t(
      '观察一个封闭电池玩具的正常开关，画“接触”和“缺口”两幅图。可以在APP里换位置；不拆家用开关，不操作插座内部。',
      'Observe the normal switch on a closed battery toy. Draw contact and gap states. Move the switch virtually in the app; do not dismantle household switches or sockets.',
    ),
    vocabulary: [
      t('开关', 'switch'),
      t('导电接触', 'conducting contact'),
      t('缺口', 'gap'),
      t('回线', 'return wire'),
    ],
    questions: [
      q(
        '在简单电池单回路的回线上断开，灯会？',
        'Open the return in a simple battery single loop. The lamp?',
        [
          ['继续亮', 'Stays lit'],
          ['变成电池', 'Becomes a battery'],
          ['稳定状态下熄灭', 'Goes off in the steady state'],
        ],
        2,
        '回路必须完整，不是只把一端接到灯。',
        'The loop must be complete, not just one end connected to the lamp.',
      ),
      q(
        '断开后导线里的电荷？',
        'Charges in the wire after opening?',
        [
          ['全部消失', 'All disappear'],
          [
            '仍存在，只是不再保持这个稳定电流',
            'Remain, but this steady current is no longer maintained',
          ],
        ],
        1,
        '电流是定向流动状态，不是电荷有没有的判断。',
        'Current describes directed flow, not whether charges exist.',
      ),
      q(
        '能否按本图在家接市电开关？',
        'Can this diagram guide home mains switch installation?',
        [
          [
            '不能，本图只讨论简单电池回路',
            'No; it concerns only a simple battery loop',
          ],
          ['能，开关在哪都一样', 'Yes; position is always equivalent'],
        ],
        0,
        '市电安装还有带电端隔离和保护等要求，应交给专业人员。',
        'Mains installation has live isolation and protection requirements and belongs to qualified professionals.',
      ),
    ],
    exit: q(
      '玩具按钮按下但不亮，哪项值得继续观察？',
      'A toy button is pressed but it stays dark. What is worth checking?',
      [
        [
          '按钮外观不保证导电通路完整',
          'Button appearance does not guarantee a complete conducting path',
        ],
        ['证明电荷已经消失', 'It proves charges disappeared'],
      ],
      0,
      '接触问题与电池储备问题都是可能解释，不拆设备就能先看正常状态与说明。',
      'Contacts and battery state are possible explanations; begin with normal operation and instructions rather than dismantling.',
    ),
  },
  {
    id: 'electric-material-and-contact',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-materials',
    minutes: 17,
    title: t(
      '有一根“桥”，为什么电流还是过不去？',
      'A bridge is there: why can current still not pass?',
    ),
    subtitle: t(
      '材料能不能导电，接触有没有连好，分别检查。',
      'Check material conduction and contact separately.',
    ),
    hook: t(
      '导线外面常包一层塑料，里面却用金属。它们不是为了颜色好看而选的：材料承担不同任务。',
      'A wire often has plastic outside and metal inside. These are not just colour choices; the materials have different jobs.',
    ),
    prediction: t(
      '金属桥接好、干塑料桥接好、金属桥但一端没接上，哪种保持本模型的电流？',
      'A connected metal bridge, a connected dry-plastic bridge, or metal with a gap at one end: which maintains current here?',
    ),
    predictions: [
      t('只要看起来有桥就行', 'Any visible bridge'),
      t('只要是金属就行，接触无关', 'Any metal, regardless of contact'),
      t(
        '导电材料并且两端接好',
        'A conducting material with both ends connected',
      ),
    ],
    explore: t(
      '比较三种桥接状态。金属在本低压模型中当理想连接，干塑料当不导通，未接好的一端留下空气缺口；它们不是三个真实电阻测量值。',
      'Compare three bridge states. Metal is an ideal connection in this low-voltage model, dry plastic is nonconducting, and a loose end leaves an air gap. These are not three measured resistance values.',
    ),
    concept: t(
      '导体让电荷容易通过；金属有可在材料内移动的电子。绝缘体在普通低压条件下难以导通，但也含有电荷。完整电路既需要合适材料，也需要两端接触；一根导体悬在旁边不构成回路。',
      'Conductors allow charge to move readily; metals have electrons able to move within them. Insulators resist conduction in ordinary low-voltage conditions but still contain charges. A complete circuit needs suitable material and both contacts; a conductor nearby is not a connection.',
    ),
    example: t(
      '同一3 V、10 Ω模型灯：理想金属桥接好时0.3 A；干塑料桥与金属一端缺口都给0 A的稳定结果。相同的“不亮”可以有不同原因。',
      'With the same 3 V source and 10 Ω model lamp, a connected ideal metal bridge gives 0.3 A. Dry plastic and a gap at one metal end both give zero steady current. The same dark lamp can have different causes.',
    ),
    misconception: t(
      '绝缘不表示“没有电子”，也不表示所有电压、温度、湿度下都绝对安全。潮湿、损坏或高电压可改变情况；不能用摸材料来判断电是否安全。',
      'Insulating does not mean no electrons, nor absolute safety at every voltage, temperature or humidity. Moisture, damage or high voltage can change conditions; touch is not an electrical safety test.',
    ),
    realWorld: t(
      '金属芯负责正常导通，完好的绝缘外层帮助限制电流走错路径。充电线接头松动与外皮破损是不同问题，都不适合靠反复折弯“修好”。',
      'A metal core conducts normally while intact insulation helps prevent unintended paths. A loose connector and damaged insulation are different problems; repeatedly bending a cable is not a repair.',
    ),
    summary: t(
      '导通需要材料与接触共同满足；绝缘体里面也有电荷。',
      'Conduction needs both material and contact; insulators contain charges too.',
    ),
    homeExperiment: t(
      '观察一根未接电源、外皮完好的线缆外观，画金属接头与塑料外层分别做什么。不要剥线或测市电；发现破损就交给成年人处理。',
      'Inspect the outside of an intact cable disconnected from power. Sketch the jobs of the metal connector and plastic covering. Do not strip wires or test mains; give damaged items to an adult.',
    ),
    vocabulary: [
      t('导体', 'conductor'),
      t('绝缘体', 'insulator'),
      t('接触', 'contact'),
      t('低压模型', 'low-voltage model'),
    ],
    questions: [
      q(
        '金属一端没接好，为什么不亮？',
        'Metal has one loose end. Why is the lamp off?',
        [
          ['金属突然没有电子', 'Metal suddenly has no electrons'],
          [
            '空气缺口使导电通路不完整',
            'The air gap interrupts the conducting path',
          ],
          ['灯把电流吃完了', 'The lamp consumed all current'],
        ],
        1,
        '导电材料仍需要形成完整接触路径。',
        'A conducting material still needs a complete contact path.',
      ),
      q(
        '干塑料不容易导电，表示？',
        'Dry plastic conducts poorly. This means?',
        [
          [
            '电荷难以穿过材料形成普通稳定电流',
            'Charges do not readily move through it as ordinary steady current',
          ],
          ['内部完全没有电荷', 'It contains no charge'],
        ],
        0,
        '绝缘体仍由含电荷的物质构成。',
        'Insulators are still made of matter containing charges.',
      ),
      q(
        '灯不亮，能否直接断言材料是绝缘体？',
        'A lamp is dark. Can we conclude the sample is an insulator?',
        [
          ['一定可以', 'Definitely'],
          ['只要电池新就可以', 'Yes, if the battery is new'],
          [
            '不能，接触、其他断路与元件也可能有问题',
            'No; contacts, other gaps or components could be at fault',
          ],
        ],
        2,
        '一次结果有多种可能原因，要分别检查条件。',
        'One result can have several causes; check conditions separately.',
      ),
    ],
    exit: q(
      '线缆外层有裂口，最合适的做法？',
      'A cable’s covering is cracked. The appropriate action?',
      [
        [
          '别使用破损线，把它交给成年人处理',
          'Do not use the damaged cable; give it to an adult',
        ],
        ['摸摸有没有电', 'Touch it to test for electricity'],
      ],
      0,
      '观察材料任务也包括理解完好绝缘的重要性，不能用身体测试。',
      'Understanding insulation includes keeping it intact; the body is not a tester.',
    ),
  },
  {
    id: 'electric-series-one-path',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-series',
    minutes: 19,
    title: t(
      '两盏灯排成一条路，谁拿走了电流？',
      'Two lamps in one path: who takes the current?',
    ),
    subtitle: t(
      '串联只有一条通路，电流相同，能量按元件分配。',
      'Series has one path: same current, energy shared by the loads.',
    ),
    hook: t(
      '给同一电池回路再接一盏灯，两盏模型灯都变暗了。原因不是第一盏先把电流吃掉。',
      'Add a second lamp to the same battery loop and both model lamps dim. The first lamp did not eat the current first.',
    ),
    prediction: t(
      '两只相同灯串联，靠近电池的第一只与后面的第二只，稳定电流谁较大？',
      'Two identical lamps in series: which has more steady current, the first near the source or the second?',
    ),
    predictions: [
      t('第一只更大', 'The first'),
      t('第二只更大', 'The second'),
      t('两只相同', 'Both have the same current'),
    ],
    explore: t(
      '比较一只灯、两只串联、第二只内部断开的三种线路。跟踪同一通路与电流读数；断开任意一处都影响整个串联回路。',
      'Compare one lamp, two in series and an internal break in the second. Trace the single path and current readings; a break anywhere affects the entire series loop.',
    ),
    concept: t(
      '串联元件依次连在同一条不分叉的通路中。稳定时每处电流相同；增加恒定电阻负载使总电阻变大，在相同电源电压下电流减小。电池提供的电势差在元件之间分配，不是把电流分成两份。',
      'Series components lie along one unbranched path. Steady current is the same at every point. Adding a fixed resistive load increases total resistance and reduces current at the same source voltage. Potential difference is shared, not current split into portions.',
    ),
    example: t(
      '理想3 V电源：一只10 Ω灯有0.3 A、0.9 W；两只相同灯串联总20 Ω，每只0.15 A、1.5 V、0.225 W。两只功率都降为单灯的四分之一；实际灯丝不一定按恒定电阻数值变化。',
      'With an ideal 3 V source, one 10 Ω lamp has 0.3 A and 0.9 W. Two identical series lamps total 20 Ω; each has 0.15 A, 1.5 V and 0.225 W, one quarter the single-lamp power. Real filaments need not follow the fixed-resistance values.',
    ),
    misconception: t(
      '相同电流不等于相同能量转移率。不同电阻串联时仍同电流，但各自的电势差与功率可能不同。图中串联的第二只灯断开时，第一只也没有稳定电流。',
      'Equal current need not mean equal energy-transfer rate. Different series resistances still carry the same current but can have different potential differences and powers. Opening the second lamp removes steady current from the first too.',
    ),
    realWorld: t(
      '有些小装饰灯把若干灯连成串，也可能带旁路等附加结构，所以一个坏灯是否使全串熄灭，要看真实线路，不能只看灯排成一列。',
      'Some decorative lights connect groups in series, sometimes with bypasses or other extra parts. Whether one failed lamp darkens the whole set depends on actual wiring, not a row-like appearance.',
    ),
    summary: t(
      '串联看通路是否不分叉；电流相同，电势差与能量转移可分配。',
      'Identify series by its unbranched path: same current, with potential difference and energy transfers shared.',
    ),
    homeExperiment: t(
      '画一个电池、两只灯和完整回线，沿线路用笔走一圈。给某处画缺口，再用另一颜色标出哪些地方失去稳定电流。只在纸和APP里断开，不拆装实际灯串。',
      'Draw a battery, two lamps and return wire; trace the path with a pencil. Draw a gap, then mark where steady current stops. Make breaks on paper or virtually, rather than dismantling a light string.',
    ),
    formula: t(
      '串联：I₁=I₂；恒定电阻R总=R₁＋R₂。',
      'Series: I₁=I₂; fixed resistances add, Rtotal=R₁+R₂.',
    ),
    vocabulary: [
      t('串联', 'series'),
      t('不分叉通路', 'unbranched path'),
      t('总电阻', 'total resistance'),
      t('电势差分配', 'shared potential difference'),
    ],
    questions: [
      q(
        '两盏串联灯的稳定电流？',
        'Steady currents in two series lamps?',
        [
          ['前面比后面大', 'Larger in the first'],
          ['相同', 'Equal'],
          ['按灯数量分一半后就消失', 'Split and then disappear'],
        ],
        1,
        '单一通路不能持续积累或消灭电荷。',
        'One path cannot sustain charge accumulation or loss.',
      ),
      q(
        '两只10 Ω恒定电阻串联，总电阻？',
        'Two fixed 10 Ω resistances in series total?',
        [
          ['20 Ω', '20 Ω'],
          ['5 Ω', '5 Ω'],
        ],
        0,
        '串联电阻直接相加。',
        'Series resistances add.',
      ),
      q(
        '第二只灯内部断开，第一只在本回路中？',
        'The second lamp opens internally. What about the first here?',
        [
          ['仍有0.3 A', 'Still 0.3 A'],
          ['电流更大', 'Larger current'],
          ['也失去稳定电流', 'It also loses steady current'],
        ],
        2,
        '任意一处断开都打断这条唯一回路。',
        'Any break interrupts the only loop.',
      ),
    ],
    exit: q(
      '两盏灯画在同一排，就能确定串联吗？',
      'Two lamps drawn in a row: must they be series?',
      [
        ['能，位置决定接法', 'Yes; position decides wiring'],
        [
          '不能，要追踪实际连接是否只有一条通路',
          'No; trace whether the connections give one unbranched path',
        ],
      ],
      1,
      '电路接法由连接关系决定，不由画面上的排列决定。',
      'Connections determine circuit topology, not positions on the page.',
    ),
  },
  {
    id: 'electric-parallel-branch-choice',
    stage: 3,
    unit: 'electricity',
    kind: 'electric-parallel',
    minutes: 20,
    title: t(
      '关掉一盏灯，另一盏为什么还亮？',
      'Switch one lamp off: why can the other stay on?',
    ),
    subtitle: t(
      '沿分叉追踪电流，先找共同的两个节点。',
      'Follow currents through a fork and find the two shared nodes.',
    ),
    hook: t(
      '关掉卧室灯，客厅灯通常还亮。画在旁边不等于并联；关键是每一支路怎样接到共同电源。',
      'Switching a bedroom light off usually leaves a living-room light on. Being drawn side by side does not define parallel; the branch connections matter.',
    ),
    prediction: t(
      '理想3 V电源下，两只10 Ω灯各有自己的支路。只断开B支路，A电流怎样？',
      'Two 10 Ω lamps have separate branches across an ideal 3 V source. Open only B. What happens to A’s current?',
    ),
    predictions: [
      t('A仍为0.3 A', 'A stays at 0.3 A'),
      t('A也为0', 'A also becomes zero'),
      t('A一定翻倍', 'A must double'),
    ],
    explore: t(
      '比较两支路闭合、B支路断开、B换成20 Ω负载。每次检查A、B与总电流，尤其看分叉处：流入总量=两支路之和。',
      'Compare both branches closed, B open and B changed to 20 Ω. Check A, B and total current each time: at the junction the incoming total equals the sum of branches.',
    ),
    concept: t(
      '并联支路连接在同一对节点之间，闭合支路承受同一电势差。电流在节点分流、汇合，电荷不凭空产生或堆积。某一支路断开，不一定切断另一支路；公共电源或主线断开则可能全部停止。',
      'Parallel branches connect across the same two nodes, so closed branches share potential difference. Current divides and recombines at junctions without creating or accumulating charge. One open branch need not interrupt another, but a broken shared source or main path can stop all.',
    ),
    example: t(
      '两只10 Ω灯：A=0.3 A、B=0.3 A、总=0.6 A。断开B：A仍0.3 A，总降0.3 A。B改20 Ω：A=0.3 A、B=0.15 A、总=0.45 A。理想电源保持3 V，真实电源有供电限制。',
      'Two 10 Ω lamps give A=0.3 A, B=0.3 A and total=0.6 A. Open B: A stays 0.3 A and total falls to 0.3 A. At B=20 Ω, A=0.3 A, B=0.15 A and total=0.45 A. The ideal source holds 3 V; real sources have limits.',
    ),
    misconception: t(
      '分流不意味着永远平均分。支路电阻不同，电流可不同；同电压也不等于同功率。支路互不直接切断，不等于能无限增加设备而不影响电源与线路。',
      'Current does not always split equally. Different branch resistances can give different currents; equal voltage need not mean equal power. Separate branches do not permit unlimited devices without affecting sources or wiring.',
    ),
    realWorld: t(
      '房间照明常用并联方式独立控制，但它们可能共用保护装置和主电源。一次跳闸让多盏灯都灭，与某支路开关正常关灯是不同情况。',
      'Room lighting commonly uses parallel connections for independent control, while sharing protection and supply paths. A trip that darkens several lights differs from normally switching one branch off.',
    ),
    summary: t(
      '并联找共同两节点；同电势差，电流在分叉处守恒。',
      'Find the two shared nodes in parallel: common potential difference, conserved current at junctions.',
    ),
    homeExperiment: t(
      '正常观察家里两个房间的照明开关，记录关掉一盏后另一盏是否仍亮。用模型画出一种可能的支路连接，不把观察当成完整的家庭接线图，也不打开开关或配电箱。',
      'Observe normal light switches in two rooms and record whether one remains on when the other is off. Sketch a possible branch arrangement, not a complete home wiring map; do not open switches or switchboards.',
    ),
    formula: t(
      '并联节点：I总=I_A＋I_B；闭合支路连接同一对节点。',
      'Parallel junction: Itotal=IA+IB; closed branches connect the same two nodes.',
    ),
    vocabulary: [
      t('并联', 'parallel'),
      t('支路', 'branch'),
      t('节点', 'junction'),
      t('总电流', 'total current'),
    ],
    questions: [
      q(
        'B断开、理想电源仍3 V，A怎样？',
        'B opens but the ideal source stays 3 V. What happens to A?',
        [
          ['继续0.3 A', 'It continues at 0.3 A'],
          ['必定熄灭', 'It must go off'],
          ['电荷翻倍', 'Its charge doubles'],
        ],
        0,
        'A有自己完整的回路，电源条件在本模型中未变。',
        'A retains its own complete loop; source conditions are unchanged here.',
      ),
      q(
        'A为0.3 A、B为0.15 A，总电流？',
        'A=0.3 A and B=0.15 A. Total current?',
        [
          ['0.15 A', '0.15 A'],
          ['0.45 A', '0.45 A'],
          ['0.3 A', '0.3 A'],
        ],
        1,
        '分叉处电流相加，不把电荷丢在节点上。',
        'Branch currents add without losing charge at the junction.',
      ),
      q(
        '不同电阻的并联支路，电流必须相同吗？',
        'Must parallel branches with different resistances have equal current?',
        [
          ['必须', 'Yes'],
          ['图上画得一样长就必须', 'Yes, if drawn equally long'],
          [
            '不必须；同电势差，电流由支路条件决定',
            'No; they share potential difference but current depends on branch conditions',
          ],
        ],
        2,
        '相同节点条件不等于相同电流。',
        'Common node conditions do not imply equal currents.',
      ),
    ],
    exit: q(
      '主电源断开，两盏并联灯可能都灭吗？',
      'Can two parallel lamps both go off if the shared source opens?',
      [
        ['不能，并联永远独立', 'No; parallel means permanently independent'],
        [
          '可以，两支路仍依赖共同电源',
          'Yes; both still depend on the shared source',
        ],
      ],
      1,
      '区分支路自身断开与公共供电路径故障。',
      'Distinguish opening one branch from losing the common supply path.',
    ),
  },
];
