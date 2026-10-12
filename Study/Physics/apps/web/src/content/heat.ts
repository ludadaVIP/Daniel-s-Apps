import type { Lesson } from './schema';
import { makeWaveLesson } from './waveLessonFactory';
const make = (d: Parameters<typeof makeWaveLesson>[0]) =>
  makeWaveLesson(d, 'heat');
export const heatLessons: Lesson[] = [
  make({
    kind: 'heat-particles',
    id: 'heat-still-air-moving-particles',
    minutes: 24,
    title: [
      '房间里没有风，空气分子就不动了吗？',
      'If there is no wind, do air molecules stop?',
    ],
    subtitle: [
      '把平均速度与平均动能分开。',
      'Separate mean velocity from mean kinetic energy.',
    ],
    hook: [
      '你把窗关上，纸条不再飘动。空气没有整体吹向一边，但其中的微小粒子仍向各个方向运动。朝左与朝右的速度可以抵消，运动的能量却不会因此消失。',
      'Close the window and a paper strip stops fluttering. Air no longer flows one way as a whole, yet its tiny particles keep moving in many directions. Leftward and rightward velocities can cancel; their kinetic energies cannot.',
    ],
    prediction: [
      '盒内平均速度为0，平均动能一定为0吗？',
      'If mean velocity in a box is zero, must mean kinetic energy be zero?',
    ],
    predictions: [
      [
        '是，平均速度就是每粒速度',
        'Yes; mean velocity is every particle’s velocity',
      ],
      [
        '否，相反速度的动能都为正',
        'No; opposite velocities both have positive kinetic energy',
      ],
      ['只有重粒子才有动能', 'Only heavy particles have kinetic energy'],
    ],
    explore: [
      '比较4 u粒子在300 K与600 K，再看40 u粒子在300 K。颜色区分四档速率，图只投影三维位置。检查不同进度：墙壁碰撞改变方向，不改变速率。读均方根速率与平均能量，别只盯着一粒。',
      'Compare 4 u particles at 300 and 600 K, then 40 u at 300 K. Colours mark four speed groups; the view projects 3D positions. Inspect times: elastic walls change direction, not speed. Read RMS speed and mean energy rather than following just one dot.',
    ],
    concept: [
      '速度是矢量，朝向相反可相加为0；平动动能½mv²是标量，按速率的平方相加。对本理想单原子气体，平均平动动能=3kBT/2。绝对温度T用K计，不把摄氏零度当作粒子运动的零点。温度一样，平均平动能量一样；质量较大的粒子有较小的均方根速率。',
      'Velocity is a vector, so opposite directions may add to zero. Translational kinetic energy ½mv² is a scalar based on squared speed. For this monatomic ideal gas, mean translational energy is 3kBT/2. Absolute T is in kelvin; zero Celsius is not zero particle motion. Equal T gives equal mean translational energy, with lower RMS speed for heavier particles.',
    ],
    example: [
      '300 K时平均平动动能约6.213×10⁻²¹ J。把T变为600 K，平均能量加倍，均方根速率只乘√2。质量从4 u变为40 u而T不变，均方根速率乘1/√10；平均平动能量不变。',
      'At 300 K the mean translational energy is about 6.213×10⁻²¹ J. At 600 K it doubles, while RMS speed increases by √2. Increasing mass from 4 to 40 u at fixed T reduces RMS speed by √10, with unchanged mean translational energy.',
    ],
    misconception: [
      '“温度翻倍，所有粒子的速率都翻倍”把平均能量与速率混在一起。真实气体有连续速率分布；本图四档代表点只帮助比较，不是完整分布，也没有画出真实空气各种分子的全部自由度。',
      'Doubling temperature does not double every speed. Real gases have continuous speed distributions. Four representative groups illustrate comparison rather than a full distribution or all degrees of freedom of actual air molecules.',
    ],
    realWorld: [
      '风描述空气的整体流动；温度关联其中的随机运动。气球放在安静房间里，内部粒子仍碰撞球壁。后面的气体压强课程会把这些碰撞与可测的压强连起来。',
      'Wind describes bulk air flow; temperature relates to random motion within it. Particles still strike a balloon’s wall in a quiet room. Later gas-pressure lessons connect those impacts to measurable pressure.',
    ],
    summary: [
      '平均方向可抵消，运动能量不会抵消。',
      'Mean direction can cancel; kinetic energy does not.',
    ],
    homeExperiment: [
      '在纸上给两个相同小球写速度+2与−2 m/s。先求平均速度，再各算½mv²。用同样方法试+3、−3；这是思考模型，不需要看见真实分子。',
      'On paper give two equal balls velocities +2 and −2 m/s. Find mean velocity, then each ½mv². Repeat with +3 and −3. This is a thought model, without needing to see actual molecules.',
    ],
    vocabulary: [
      ['热运动', 'thermal motion'],
      ['平均平动动能', 'mean translational kinetic energy'],
      ['均方根速率', 'root-mean-square speed'],
      ['绝对温度', 'absolute temperature'],
    ],
    formula: [
      '理想单原子气体：⟨K⟩=3kBT/2；v_rms=√(3kBT/m)',
      'Monatomic ideal gas: ⟨K⟩=3kBT/2; v_rms=√(3kBT/m)',
    ],
    questions: [
      [
        '平均速度为0，能说明什么？',
        'What does zero mean velocity establish?',
        [
          ['每粒都静止', 'Every particle is still'],
          ['矢量平均为0', 'The vector mean is zero'],
          ['平均能量为0', 'Mean energy is zero'],
        ],
        1,
        '方向可抵消，速率平方仍为正。',
        'Directions may cancel while squared speeds remain positive.',
      ],
      [
        'T从300 K升到600 K，均方根速率怎样变？',
        'How does RMS speed change from 300 to 600 K?',
        [
          ['乘√2', 'Multiply by √2'],
          ['乘2', 'Multiply by 2'],
          ['不变', 'Unchanged'],
        ],
        0,
        '速率与绝对温度的平方根成正比。',
        'RMS speed is proportional to the square root of absolute T.',
      ],
      [
        '同温的4 u与40 u粒子，平均平动动能如何比较？',
        'At equal T, how do mean translational energies compare for 4 and 40 u?',
        [
          ['40 u更大', 'Larger for 40 u'],
          ['4 u更大', 'Larger for 4 u'],
          ['相同', 'Equal'],
        ],
        2,
        '质量影响速率，同温固定平均平动能量。',
        'Mass changes speed; equal T fixes mean translational energy.',
      ],
    ],
    exit: [
      '要判断安静气体还有没有热运动，应看什么？',
      'To judge thermal motion in still gas, what should you examine?',
      [
        ['只看有没有风', 'Only whether there is wind'],
        ['平均能量或速率统计', 'Mean energy or speed statistics'],
        ['只看盒子是否移动', 'Only whether the box moves'],
      ],
      1,
      '把整体流动和内部随机运动分开。',
      'Separate bulk flow from internal random motion.',
    ],
  }),
  make({
    kind: 'heat-internal',
    id: 'heat-same-temperature-different-total',
    minutes: 24,
    title: [
      '一杯与一桶同温的水，能量一样多吗？',
      'Do a cup and a bucket at the same temperature hold equal energy?',
    ],
    subtitle: [
      '温度关联平均，内能记整个体系。',
      'Temperature relates to a mean; internal energy accounts for a system.',
    ],
    hook: [
      '两份物质都显示相同温度，温度计不会替你数有多少粒子。想把整桶物质升高同样温度，需要处理更多的物质。先从简单的气体盒子学会分清“每粒平均”与“全部总和”。',
      'Two samples show the same temperature, but a thermometer does not count their particles. Warming a whole bucket by the same amount involves more matter. A simple gas box lets us separate a per-particle mean from the total.',
    ],
    prediction: [
      '同种理想单原子气体，同温而粒子数加倍，内能如何变？',
      'For the same monatomic ideal gas, how does U change if particle number doubles at fixed T?',
    ],
    predictions: [
      ['不变，温度一样', 'Unchanged because T is equal'],
      ['变一半', 'Halved'],
      ['加倍', 'Doubled'],
    ],
    explore: [
      '比较1 mmol、300 K与2 mmol、300 K：代表点加倍，平均能量相同，总U加倍。再看1 mmol、600 K：粒子数没变，平均能量加倍。对照三维分量账，确认Ux+Uy+Uz=U。',
      'Compare 1 mmol at 300 K with 2 mmol at 300 K: twice the representative dots, equal mean energy, doubled U. At 1 mmol and 600 K the count is unchanged while the mean doubles. Check that Ux+Uy+Uz=U.',
    ],
    concept: [
      '内能包括体系内部粒子的微观动能与相互作用势能，排除整个物体作为整体的运动动能。本理想单原子气体忽略粒子间势能，只留下三维平动能量，所以U=N⟨K⟩=3nRT/2。真实液体与固体的内能还涉及相互作用，不能直接套这个气体公式。',
      'Internal energy includes microscopic kinetic and interaction potential energy within a system, excluding motion of the body as a whole. This monatomic ideal gas neglects interaction potential, leaving 3D translation: U=N⟨K⟩=3nRT/2. Liquids and solids involve interactions and cannot simply use this gas formula.',
    ],
    example: [
      '1 mmol、300 K给U≈3.742 J；2 mmol、300 K与1 mmol、600 K都约7.483 J。后两份总U相同，但一份粒子多，另一份每粒平均能量高。这里的数值零点按理想气体模型外推定义。',
      '1 mmol at 300 K gives U≈3.742 J. Both 2 mmol at 300 K and 1 mmol at 600 K give about 7.483 J. Equal totals arise from more particles in one sample and higher mean energy in the other. The model uses an extrapolated ideal-gas energy reference.',
    ],
    misconception: [
      '“内能就是装在物体里的热量”不准确。内能是体系的状态量；热量Q记录因温差而跨边界传递的能量。你还可以通过做功改变内能，例如压缩气体。',
      'Internal energy is not stored heat. U describes the system’s state; heat Q records energy transferred across a boundary because of temperature difference. Work, such as gas compression, can also change U.',
    ],
    realWorld: [
      '一杯温水与一大桶同温水对房间的升温能力不同。需要比较物质种类、数量和可降到的终温；一个温度读数不足以决定能释放多少能量。',
      'A cup and a bucket of equally warm water can warm a room by different amounts. Compare material, quantity and final temperature: a single temperature reading does not determine releasable energy.',
    ],
    summary: [
      '同温不等于同内能；总量还要数粒子。',
      'Equal temperature does not mean equal U; totals require particle count.',
    ],
    homeExperiment: [
      '画两袋相同的筹码，每枚写2个能量单位：第一袋10枚、第二袋20枚。平均是多少？总量是多少？再把第一袋每枚改为4单位，解释为什么总量一样而平均不同。',
      'Draw bags of 10 and 20 identical tokens, each marked 2 energy units. Find mean and total. Change each token in the first bag to 4 units: explain equal totals but different means.',
    ],
    vocabulary: [
      ['内能', 'internal energy'],
      ['物质的量', 'amount of substance'],
      ['状态量', 'state quantity'],
      ['热量', 'heat transfer'],
    ],
    formula: [
      '本理想单原子模型：U=N⟨K⟩=3nRT/2',
      'This monatomic ideal model: U=N⟨K⟩=3nRT/2',
    ],
    questions: [
      [
        '同种气体同温，n加倍，U怎样变？',
        'At fixed T for this gas, how does U change if n doubles?',
        [
          ['加倍', 'Doubles'],
          ['不变', 'Unchanged'],
          ['为0', 'Becomes zero'],
        ],
        0,
        '每粒平均相同，粒子数加倍。',
        'Same mean per particle, twice the particles.',
      ],
      [
        '以下哪项不属于内能？',
        'Which is excluded from internal energy?',
        [
          ['内部微观动能', 'Internal microscopic kinetic energy'],
          ['整个盒子的平移动能', 'Bulk kinetic energy of the box'],
          ['内部相互作用势能', 'Internal interaction potential energy'],
        ],
        1,
        '体系整体运动与内部能量分开记。',
        'Account for bulk and internal energy separately.',
      ],
      [
        '3nRT/2能直接用于一块冰吗？',
        'Can 3nRT/2 directly describe a block of ice?',
        [
          ['可以，只需换质量', 'Yes, just change mass'],
          ['可以，只需换颜色', 'Yes, just change colour'],
          [
            '不可以，要考虑其物质模型',
            'No; it requires a different material model',
          ],
        ],
        2,
        '这是理想单原子气体模型。',
        'This formula belongs to a monatomic ideal gas.',
      ],
    ],
    exit: [
      '两份体系总U相同，温度一定相同吗？',
      'If two systems have equal U, must their temperatures match?',
      [
        ['一定', 'Always'],
        [
          '不一定，还要看数量与物质',
          'Not necessarily; quantity and material matter',
        ],
        ['一定都为0 K', 'Both must be 0 K'],
      ],
      1,
      '总量与平均不能互相代替。',
      'A total cannot substitute for a mean.',
    ],
  }),
  make({
    kind: 'heat-temperature',
    id: 'heat-contact-sets-the-direction',
    minutes: 25,
    title: [
      '小杯更烫，大杯能量更多，热往哪边走？',
      'A small cup is hotter, a large cup holds more energy: which way does heat flow?',
    ],
    subtitle: [
      '传热方向看温差，最终温度还看热容量。',
      'Temperature difference sets direction; capacities set the final temperature.',
    ],
    hook: [
      '把一小块热物体和一大块凉物体放在能传热的接触处。凉的大块可能有更大的总内能，但热量仍从高温一侧传向低温一侧。不是“能量多的一方自动给能量少的一方”。',
      'Bring a small hot object into thermal contact with a larger cool one. The cool object may have more total internal energy, yet heat flows from higher to lower temperature. Greater total energy alone does not set direction.',
    ],
    prediction: [
      '两份同温气体的内能不同，接触后会因此自发净传热吗？',
      'Do gases at equal T spontaneously transfer net heat merely because their internal energies differ?',
    ],
    predictions: [
      ['会，从总U大到小', 'Yes, from greater to smaller U'],
      [
        '不会，没有温差驱动净传热',
        'No; there is no temperature difference driving net heat flow',
      ],
      ['一定把U变成一样', 'Their U values must become equal'],
    ],
    explore: [
      '先看400与300 K、热容量10/10 J/K；再看20/10，比较平衡温度。第三次两侧都350 K、热容量不同：读数不随时间变化。自由改变B初温，看热流功率的正负；正号表示能量进入A。',
      'Compare 400 and 300 K with capacities 10/10, then 20/10 J/K and examine equilibrium T. Finally use equal 350 K with unequal capacities: readings stay constant. Change B’s initial T and inspect signed power; positive means energy entering A.',
    ],
    concept: [
      '温度决定热接触时自发净传热的方向。热平衡表示没有温差驱动的净热流，不表示两份物质的内能相等。对外隔热的这两份定容理想气体，CaΔTa+CbΔTb=0，所以最终温度是按热容量加权的平均。过程末端趋近该值，不凭动画结束强行变成完全相等。',
      'Temperature sets spontaneous net heat-flow direction in thermal contact. Thermal equilibrium means no temperature-driven net flow, not equal internal energies. For these insulated fixed-volume gases, CaΔTa+CbΔTb=0; final T is weighted by heat capacities. The process approaches that value rather than snapping to equality when animation ends.',
    ],
    example: [
      '10/10 J/K从400/300 K出发，平衡为350 K；20/10时为366.667 K。两侧同为350 K、Ca/Cb=20/10时，模型Ua/Ub=7000/3500 J，净热流为0。总内能不同仍能热平衡。',
      'Starting at 400/300 K with capacities 10/10 gives 350 K equilibrium; 20/10 gives 366.667 K. Both at 350 K with 20/10 capacities have model U values 7000/3500 J and zero net flow. Unequal U is compatible with thermal equilibrium.',
    ],
    misconception: [
      '“两份物质接触后最后一定取温度的算术平均”只适用于相同热容量且没有其他能量交换的条件。质量、比热容不同，热容量就可能不同；发生相变时还要改能量账。',
      'A simple arithmetic temperature average requires equal heat capacities and no other exchange. Different masses or specific heats can give unequal capacities; phase changes require a different energy account.',
    ],
    realWorld: [
      '金属摸起来比同温木头凉，涉及传热速度和皮肤温度，不能直接说明金属原先温度更低。用温度计比较初温，再讨论接触过程，能把感觉与测量分开。',
      'Metal may feel cooler than wood at the same initial temperature because of transfer rate and skin temperature. Use a thermometer to compare initial T before interpreting the contact process.',
    ],
    summary: [
      '传热方向看温差；平衡不要求内能相同。',
      'Temperature difference sets flow; equilibrium does not require equal U.',
    ],
    homeExperiment: [
      '用纸模拟Ca=20、Cb=10 J/K，初温400与300 K。试350 K：分别算两侧热量，和是否为0？再试366.667 K。用能量守恒挑出合理终温。',
      'On paper use Ca=20, Cb=10 J/K, initially 400/300 K. Test 350 K by calculating both heat transfers and their sum. Then test 366.667 K. Use conservation to select a reasonable final temperature.',
    ],
    vocabulary: [
      ['热平衡', 'thermal equilibrium'],
      ['净热流', 'net heat flow'],
      ['热容量', 'heat capacity'],
      ['温差', 'temperature difference'],
    ],
    formula: [
      '对外隔热、无其他交换：CaΔTa+CbΔTb=0',
      'Insulated, with no other exchange: CaΔTa+CbΔTb=0',
    ],
    questions: [
      [
        '总U大的一方温度更低，热怎样自发传？',
        'If the side with greater U is cooler, which way does heat flow?',
        [
          ['仍从高温到低温', 'From higher to lower T'],
          ['总从U大到U小', 'Always from larger to smaller U'],
          ['无法根据温差判断', 'Temperature difference gives no clue'],
        ],
        0,
        '自发净传热方向由温差决定。',
        'Temperature difference sets spontaneous net flow.',
      ],
      [
        '同温、不同热容量，哪个说法正确？',
        'At equal T but unequal capacities, which is correct?',
        [
          ['总U必须相同', 'Total U must match'],
          ['U可不同，净热流为0', 'U may differ with zero net heat flow'],
          ['一方一定结冰', 'One must freeze'],
        ],
        1,
        '本模型第三个比较直接演示这一点。',
        'The third model comparison demonstrates this.',
      ],
      [
        '本台30 s末端尚有小温差，意味着什么？',
        'A small difference remains after 30 s: what does it mean?',
        [
          ['守恒失效', 'Conservation failed'],
          ['模型应强行补齐', 'The model should forcibly equalize'],
          ['有限时间仍在趋近平衡', 'Finite time still approaches equilibrium'],
        ],
        2,
        '热流随温差减小，指数趋近而不突然跳变。',
        'Flow shrinks with the difference, approaching exponentially.',
      ],
    ],
    exit: [
      '求两份隔热样品接触后的终温，优先写哪条账？',
      'For contacting insulated samples, which account comes first?',
      [
        ['两侧热量代数和为0', 'Their signed heat transfers sum to zero'],
        ['温度总取中间数', 'Always take the midpoint'],
        ['内能最终必须一样', 'Final U must match'],
      ],
      0,
      '按热容量与能量守恒求终温。',
      'Use heat capacities and conservation.',
    ],
  }),
  make({
    kind: 'heat-capacity',
    id: 'heat-the-same-joules-different-warming',
    minutes: 25,
    title: [
      '同样加热，为什么水升温慢，金属升温快？',
      'Why can water warm more slowly than metal under the same heating?',
    ],
    subtitle: [
      '把Q、m、c与ΔT放进一张账。',
      'Connect Q, m, c and ΔT in one account.',
    ],
    hook: [
      '两个样品各吸收42 J每秒。十秒后它们得到的能量一样，却不必升高一样多。还要看样品有多少，以及每千克升高1 K需要多少能量。',
      'Two samples each absorb 42 joules per second. After ten seconds they receive equal energy, yet need not rise by equal temperatures. Quantity and energy required per kilogram per kelvin also matter.',
    ],
    prediction: [
      '相同的水，质量加倍、吸收热量不变，温升怎样变？',
      'For the same water, what happens to the rise if mass doubles at fixed absorbed heat?',
    ],
    predictions: [
      ['加倍', 'Doubles'],
      ['不变', 'Unchanged'],
      ['减半', 'Halves'],
    ],
    explore: [
      '在相同42 W净吸收功率下，比较100 g水、200 g水与100 g指定金属。检查10 s末端Q都为420 J。再把功率调到0，确认没有凭动画进度自动升温。曲线以热量为横轴，坡度由1/(mc)决定。',
      'At equal net absorbed 42 W compare 100 g water, 200 g water and 100 g assigned metal. At 10 s all absorb 420 J. Set power to zero and verify that animation progress alone does not warm anything. The T–Q slope is 1/(mc).',
    ],
    concept: [
      '比热容c表示单位质量升高1 K所需热量，单位J/(kg·K)；热容量C=mc表示整份样品升高1 K所需热量，单位J/K。无相变、c近似恒定时，Q=mcΔT。净吸收功率P告诉我们能量进入样品的速率，Q=Pt；额定电功率不一定全被样品吸收。',
      'Specific heat c is heat per mass for a 1 K rise, in J/(kg·K). Sample heat capacity C=mc is heat per kelvin for the whole sample, in J/K. Without phase change and with approximately constant c, Q=mcΔT. Net absorbed power P gives Q=Pt; not all rated electrical power necessarily reaches a sample.',
    ],
    example: [
      'c水取4200、指定金属取900 J/(kg·K)。420 J使100 g水升1 K、200 g水升0.5 K、100 g金属升约4.667 K。100 g水的C=420 J/K；“升高1 K所需热量”才是420 J。',
      'Using water c=4200 and assigned metal c=900 J/(kg·K), 420 J raises 100 g water by 1 K, 200 g water by 0.5 K, and 100 g metal by about 4.667 K. Water’s capacity is 420 J/K; heat for a 1 K rise is 420 J.',
    ],
    misconception: [
      '“比热容大就是温度高”把材料属性与当前状态混在一起。比热容描述升温的能量需求，不决定当前温度。摄氏温升1°C与开尔文温差1 K相同，但摄氏温度20°C不能当作绝对温度20 K。',
      'A large specific heat does not mean a high temperature. It describes energy needed for warming, not current T. A 1°C rise equals a 1 K difference, but 20°C is not an absolute 20 K.',
    ],
    realWorld: [
      '水常被用来运送热量：每千克改变相同温度能交换较多能量。烹饪中的锅、水和食物则都要入账，实际还会向环境散热，因此不能把本台理想升温直接当作厨房计时器。',
      'Water carries heat effectively because each kilogram exchanges considerable energy for a given temperature change. Cooking also involves the pot, food and environmental losses; this ideal bench is not a kitchen timer.',
    ],
    summary: [
      '相同热量的温升，取决于整份样品的mc。',
      'For equal heat, the rise depends on the sample’s mc.',
    ],
    homeExperiment: [
      '不用加热：在纸上安排“420 J能量预算”。分别给100 g水、200 g水，算温升。再算让两份都升1 K所需热量，确认数量加倍时预算也加倍。',
      'Without heating anything, allocate a 420 J paper budget to 100 and 200 g of water. Calculate their rises, then heat needed to raise both by 1 K. Check that doubling quantity doubles the required budget.',
    ],
    vocabulary: [
      ['比热容', 'specific heat capacity'],
      ['热容量', 'heat capacity'],
      ['净吸收功率', 'net absorbed power'],
      ['温升', 'temperature rise'],
    ],
    formula: [
      '无相变、c恒定：Q=Pt=mcΔT；C=mc',
      'No phase change, constant c: Q=Pt=mcΔT; C=mc',
    ],
    questions: [
      [
        '质量加倍，Q与c不变，ΔT怎样变？',
        'Double m at fixed Q and c: what happens to ΔT?',
        [
          ['加倍', 'Doubles'],
          ['减半', 'Halves'],
          ['不变', 'Unchanged'],
        ],
        1,
        '能量分给两倍的物质。',
        'The same energy is shared by twice the matter.',
      ],
      [
        '100 g水的热容量单位是什么？',
        'What is the unit of the sample heat capacity of 100 g water?',
        [
          ['J', 'J'],
          ['J/(kg K)', 'J/(kg K)'],
          ['J/K', 'J/K'],
        ],
        2,
        '热容量针对整份样品，不是每千克。',
        'Sample heat capacity is per kelvin, not per kilogram.',
      ],
      [
        '本台P=0、t=10 s，吸收热量与温升是多少？',
        'At P=0 and t=10 s, what are heat and rise?',
        [
          ['都为0', 'Both zero'],
          ['Q为420 J', 'Q is 420 J'],
          ['温升必为1 K', 'Rise must be 1 K'],
        ],
        0,
        'Q=Pt，动画进度不是热源。',
        'Q=Pt; animation progress is not a heat source.',
      ],
    ],
    exit: [
      '相同Q使A升温更少，能直接推断A的c更大吗？',
      'If equal Q warms A less, can you directly infer a larger c?',
      [
        ['可以，质量不用管', 'Yes, mass is irrelevant'],
        ['不可以，先比较质量，判断mc', 'No; compare masses and the product mc'],
        ['温升与材料无关', 'Rise does not depend on material'],
      ],
      1,
      '先控制质量，才能比较材料比热容。',
      'Control mass before comparing specific heats.',
    ],
  }),
  make({
    kind: 'heat-phase',
    id: 'heat-energy-enters-temperature-pauses',
    minutes: 26,
    title: [
      '一直吸热，温度为什么停在0°C？',
      'Why can temperature stay at 0°C while heat keeps entering?',
    ],
    subtitle: [
      '平台不是没变化：冰正在变成水。',
      'A plateau is not inactivity: ice is becoming water.',
    ],
    hook: [
      '想象一盒−10°C冰缓慢吸收能量：先变暖，再逐渐融化，最后水才继续升温。温度计在中间停住，不代表热源关掉。换一个观察对象——冰与水的质量——你会看见变化。',
      'Imagine ice at −10°C slowly receiving energy. It warms, melts gradually, then the water warms further. A paused thermometer does not mean the source switched off. Watch ice and water masses and the change becomes visible.',
    ],
    prediction: [
      '纯冰在本模型0°C融化时继续吸热，最先增加什么？',
      'While pure ice melts at 0°C in this model, what increases as heat enters?',
    ],
    predictions: [
      ['水的质量', 'Liquid-water mass'],
      ['温度立即越过0°C', 'Temperature immediately passes 0°C'],
      ['总质量', 'Total mass'],
    ],
    explore: [
      '同样100 g、−10°C冰，分别吸收1、18.8、42 kJ。看温度、冰质量、水质量和三部分Q账。自由设2.1 kJ与35.5 kJ，检查刚到融点和刚融完的边界；再检查平台中间，温度不变而质量转换。',
      'For 100 g ice at −10°C compare 1, 18.8 and 42 kJ. Track T, both masses and the three Q components. Set 2.1 and 35.5 kJ to inspect arrival at melting and completion; inside the plateau mass changes at fixed T.',
    ],
    concept: [
      '在给定压强下，纯物质的平衡相变可在近似固定温度进行。吸收的能量用于整个相变过程，不能全拿去算mcΔT。分段记账：冰升到融点、冰融化、水再升温。微观排列与相互作用改变；对指定压强过程，也要允许相关体积功，不能一概把全部潜热称作势能增加。',
      'At a specified pressure, an equilibrium transition of a pure substance can occur near fixed T. Incoming energy supports the full transition rather than all becoming mcΔT. Account separately for warming ice, melting it and warming water. Microscopic arrangement and interactions change; a specified-pressure process can also involve volume work, so latent heat is not universally just potential-energy gain.',
    ],
    example: [
      '100 g冰从−10到0°C需2.1 kJ，全部融化还需33.4 kJ。18.8 kJ中，2.1 kJ用于升温、16.7 kJ融化50 g冰：温度0°C，冰/水各50 g。42 kJ时融完后剩6.5 kJ，使100 g水升到约15.476°C。',
      '100 g ice needs 2.1 kJ to reach 0°C and another 33.4 kJ to melt fully. At 18.8 kJ, 2.1 warms and 16.7 melts 50 g: T=0°C with 50 g each phase. At 42 kJ, 6.5 kJ remains after melting, raising the water to about 15.476°C.',
    ],
    misconception: [
      '“平坦曲线说明什么都没发生”只看了温度；“0°C一定是冰”也忽略了相共存。压强、纯度和非平衡过冷等会影响实际过程，本台只研究名义1 atm的纯水准平衡过程。',
      'A flat T curve does not mean nothing happens; 0°C need not mean all ice. Pressure, purity and nonequilibrium effects such as supercooling affect actual behaviour. This bench models pure water in quasi-equilibrium at nominal 1 atm.',
    ],
    realWorld: [
      '冰袋能在融化过程中吸收能量，帮周围保持接近融点。冰已经全部融完后，继续吸收能量就会使水升温；“冰袋永远同温”不是合理外推。',
      'An ice pack absorbs energy while melting and helps keep its surroundings near the melting point. Once fully melted, additional energy warms the water; the pack does not stay at one temperature forever.',
    ],
    summary: [
      '相变平台有质量变化；吸热不必立刻升温。',
      'A transition plateau changes phase mass; heat need not immediately raise T.',
    ],
    homeExperiment: [
      '在纸上画−10°C冰到温水的T–Q曲线，标2.1与35.5 kJ。把18.8 kJ落在图上，写冰/水各多少。再用模型核对，避免画成一条一直向上的直线。',
      'Draw a T–Q curve from ice at −10°C to warm water, marking 2.1 and 35.5 kJ. Place 18.8 kJ and write each phase’s mass. Check with the model rather than drawing one continuously rising line.',
    ],
    vocabulary: [
      ['相变', 'phase change'],
      ['融化平台', 'melting plateau'],
      ['相共存', 'phase coexistence'],
      ['分段热量账', 'piecewise heat account'],
    ],
    formula: [
      'Q总=Q冰升温+Q融化+Q水升温',
      'Q_total=Q_ice_warming+Q_melting+Q_water_warming',
    ],
    questions: [
      [
        '18.8 kJ时，100 g初始冰是什么状态？',
        'At 18.8 kJ, what is the state of the initial 100 g ice?',
        [
          ['全水，18.8°C', 'All water at 18.8°C'],
          ['冰水各50 g，0°C', '50 g each ice and water at 0°C'],
          ['全冰，0°C', 'All ice at 0°C'],
        ],
        1,
        '扣去2.1 kJ升温，剩16.7 kJ融化一半。',
        'Subtract 2.1 kJ warming; 16.7 kJ melts half.',
      ],
      [
        '融化平台上什么持续改变？',
        'What keeps changing on the melting plateau?',
        [
          ['各相质量', 'Mass in each phase'],
          ['总质量增加', 'Total mass increases'],
          ['温度不断升高', 'Temperature rises continuously'],
        ],
        0,
        '闭合系统的总质量保持不变。',
        'Total mass remains constant in this closed system.',
      ],
      [
        '全部融化后继续吸热，怎样记账？',
        'How is further heat accounted for after all ice melts?',
        [
          ['仍全部记作融化', 'Still all melting'],
          ['让冰质量变负', 'Make ice mass negative'],
          ['转入液态水升温', 'Warming liquid water'],
        ],
        2,
        '达到相变终点就切换能量用途。',
        'At completion, switch to liquid warming.',
      ],
    ],
    exit: [
      '看到T–Q曲线平台，下一步检查什么？',
      'On seeing a T–Q plateau, what should you check next?',
      [
        ['相态与各相质量', 'Phase and mass in each phase'],
        ['断定没有吸热', 'Conclude no heat entered'],
        ['删去这段数据', 'Delete those readings'],
      ],
      0,
      '用另一个状态量识别相变。',
      'Use another state quantity to identify the transition.',
    ],
  }),
  make({
    kind: 'heat-latent',
    id: 'heat-changing-phase-has-a-heat-budget',
    minutes: 26,
    title: [
      '同样20 kJ，能融化多少冰、汽化多少水？',
      'With the same 20 kJ, how much ice melts or water vaporizes?',
    ],
    subtitle: [
      '相变热量看L与转变质量，凝固还要记负号。',
      'Transition heat depends on L and converted mass; freezing requires a sign.',
    ],
    hook: [
      '把20 kJ分给已经到相变温度的两份物质：一份冰融化，一份水汽化。它们温度都可以暂时不变，但转变的质量很不同。能量账里需要一个新材料参数——比潜热。',
      'Give 20 kJ to samples already at their transition temperatures: ice melts, water vaporizes. Their temperatures can pause while very different masses transform. The account needs a new parameter: specific latent heat.',
    ],
    prediction: [
      '同样吸收20 kJ，本模型融化的冰与汽化的水，谁转变质量更多？',
      'With equal absorbed 20 kJ here, which converts more mass: melting ice or vaporizing water?',
    ],
    predictions: [
      ['一样，因为热量一样', 'Equal, because heat is equal'],
      ['汽化的水更多', 'More water vaporizes'],
      ['融化的冰更多', 'More ice melts'],
    ],
    explore: [
      '比较100 g冰融化、100 g水汽化、100 g水凝固。读Q的正负与转变质量。再把融化或凝固的总质量调到50 g：只需16.7 kJ，热源就在转变完成时停，不会把20 kJ全塞进仍不升温的平台。',
      'Compare 100 g melting, vaporizing and freezing samples. Read signed Q and converted mass. Set melting or freezing mass to 50 g: only 16.7 kJ is needed, and the source stops at completion rather than forcing all 20 kJ into a fixed-T plateau.',
    ],
    concept: [
      '比潜热L是指定条件下每千克物质完成指定相变所需的热量，单位J/kg。本台从相边界开始：吸热融化或汽化Q=+m转变L，放热凝固Q=−m转变L。公式中的质量是已转变质量，不一定是总质量。汽化在恒压下还涉及膨胀功；L描述整个过程的热量，本台不另算ΔU。',
      'Specific latent heat L is heat per kilogram for a specified transition under specified conditions, in J/kg. Starting at a phase boundary here, melting or vaporizing uses Q=+m_converted L; freezing gives Q=−m_converted L. The mass is converted mass, not necessarily total mass. Constant-pressure vaporization involves expansion work; L describes process heat, and this bench does not separately compute ΔU.',
    ],
    example: [
      'L融取334 kJ/kg、L汽取2260 kJ/kg。20 kJ融化约59.880 g冰，汽化约8.850 g水；移出20 kJ可凝固约59.880 g水。100 g总质量都保持不变，凝固时Q为负，已转变质量仍为正。',
      'Using L_f=334 and L_v=2260 kJ/kg, 20 kJ melts about 59.880 g ice or vaporizes 8.850 g water. Removing 20 kJ freezes about 59.880 g. Total mass remains 100 g; during freezing Q is negative while converted mass stays positive.',
    ],
    misconception: [
      '“沸腾的水都已经变成蒸气”把开始相变与完成混淆了；“放热所以质量为负”混淆了能量流向与质量。只要仍有原相可转变，平台可以持续；原相用完以后就不能继续用同一个相变公式。',
      'Boiling does not mean all water is already vapor. Negative heat transfer does not mean negative mass. A plateau can continue while original-phase matter remains; once it is exhausted, the same transition-only formula no longer applies.',
    ],
    realWorld: [
      '晾干衣服也需要汽化能量，能量来自周围和衣服。蒸发可在沸点以下发生；本台100°C恒压汽化是一个特定比较，不能推出“低于100°C水不会变成水蒸气”。',
      'Drying clothes requires vaporization energy supplied by the surroundings and clothes. Evaporation can occur below boiling. This 100°C constant-pressure comparison does not mean water cannot become vapor below 100°C.',
    ],
    summary: [
      '看相变种类、L、转变质量，再记Q的流向。',
      'Identify transition, L and converted mass, then sign Q by energy flow.',
    ],
    homeExperiment: [
      '纸上预算：要在0°C融完50 g冰需多少kJ？从0°C水凝固50 g呢？先把g换kg，给两种过程写相反的Q符号，再在模型自由质量50 g处核对停止点。',
      'On paper budget heat to melt 50 g ice at 0°C, then to freeze 50 g water at 0°C. Convert grams to kilograms, assign opposite Q signs, and check the stopping point at free mass 50 g in the model.',
    ],
    vocabulary: [
      ['比潜热', 'specific latent heat'],
      ['转变质量', 'converted mass'],
      ['汽化', 'vaporization'],
      ['凝固放热', 'heat release on freezing'],
    ],
    formula: [
      '相边界起步：|Q|=m转变L；吸热正、放热负',
      'Starting at a phase boundary: |Q|=m_converted L; in positive, out negative',
    ],
    questions: [
      [
        'L更大，同样|Q|能转变多少质量？',
        'At larger L, how much mass converts for equal |Q|?',
        [
          ['更多', 'More'],
          ['更少', 'Less'],
          ['无关', 'Unrelated'],
        ],
        1,
        'm转变=|Q|/L。',
        'm_converted=|Q|/L.',
      ],
      [
        '凝固放出热量，Q与转变质量的符号怎样？',
        'During freezing, what are the signs of Q and converted mass?',
        [
          ['Q负，质量正', 'Negative Q, positive mass'],
          ['都负', 'Both negative'],
          ['都正', 'Both positive'],
        ],
        0,
        '符号描述热量流向，不让质量变负。',
        'The sign describes heat flow, not negative mass.',
      ],
      [
        '50 g冰全部融完后，本台热源怎样处理？',
        'After all 50 g ice melts, what does this bench do?',
        [
          ['继续相变到质量负值', 'Continue until mass is negative'],
          ['继续恒温吸收到20 kJ', 'Keep absorbing to 20 kJ at fixed T'],
          ['在16.7 kJ处停止', 'Stop at 16.7 kJ'],
        ],
        2,
        '未模拟融完后的升温，故热源在终点停。',
        'Post-transition warming is outside this bench, so the source stops.',
      ],
    ],
    exit: [
      '从−10°C冰开始，能直接用Q=mL算整个融化过程吗？',
      'Starting with ice at −10°C, does Q=mL cover the whole melting process?',
      [
        ['能，初温无关', 'Yes; initial T is irrelevant'],
        ['不能，还需先升到融点的热量', 'No; include warming to melting first'],
        ['不能，冰不吸热', 'No; ice cannot absorb heat'],
      ],
      1,
      '潜热公式针对相变段；初始升温要另记。',
      'Latent heat covers the transition segment; account for initial warming separately.',
    ],
  }),
];
