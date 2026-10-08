import { t, q, type Lesson } from './schema';
export const thermalLessons: Lesson[] = [
  {
    id: 'thermal-temperature-and-particles',
    stage: 2,
    unit: 'thermal',
    kind: 'thermal-particles',
    minutes: 18,
    title: t(
      '同样20℃，大盒气体的内能一定和小盒一样吗？',
      'Both at 20°C: must a larger gas sample have the same internal energy?',
    ),
    subtitle: t(
      '把温度、粒子运动与物质多少分开看。',
      'Separate temperature, particle motion and amount of matter.',
    ),
    hook: t(
      '一杯水和一桶水可以同温。温度计读的是同一种量，但能量账本也一定一样吗？先用一份简化气体来寻找线索。',
      'A cup and a bucket can have the same temperature. Their thermometers read the same quantity, but must their energy ledgers match? Begin with a simplified gas.',
    ),
    prediction: t(
      '同一种气体，同样20℃，数量加倍。哪个判断更合理？',
      'For the same gas at 20°C, double its amount. Which claim is more reasonable?',
    ),
    predictions: [
      t(
        '温度一样，但这份理想气体的内能更多',
        'Same temperature, more internal energy in this ideal gas',
      ),
      t('温度必定加倍到40℃', 'Temperature must double to 40°C'),
      t('粒子全停止运动', 'Particles stop moving'),
    ],
    explore: t(
      '完整观察三组：小份20℃、小份60℃、两倍份量20℃。点数只示意数量，颜色只区分温度；比较温度、份量和以第一组为1的相对内能。播放是微观示意，不是可用秒表测量的真实粒子轨迹。',
      'Observe three complete cases: small sample 20°C, small sample 60°C, twice the amount at 20°C. Dots illustrate amount and colour distinguishes temperature. Compare temperature, amount and relative internal energy with the first case set to 1. Playback is schematic, not stopwatch-measurable particle trajectories.',
    ),
    concept: t(
      '物质由微小粒子组成；气体粒子不停做不规则运动。温度与平均微观运动的激烈程度有关，不能用粒子总数直接代替。内能包含微观运动能量和相互作用能量，既受温度影响，也与物质数量、种类和状态有关。这里比较同一种理想单原子气体，忽略粒子相互作用，只追踪微观动能，所以同温数量加倍，模型内能加倍。',
      'Matter consists of tiny particles; gas particles move randomly. Temperature relates to the average intensity of microscopic motion, not the total particle count. Internal energy includes microscopic kinetic and interaction energies and depends on temperature, amount, material and state. Here the same ideal monatomic gas omits interactions and tracks microscopic kinetic energy: doubling amount at the same temperature doubles its model internal energy.',
    ),
    formula: t(
      '温度：平均微观运动的线索；内能：整个样品的微观能量账本。',
      'Temperature: a clue to average microscopic motion. Internal energy: the whole sample’s microscopic energy ledger.',
    ),
    example: t(
      '小份20℃的模型内能设为1；两倍份量20℃是2。小份60℃约1.14，不是3：摄氏0℃不是粒子运动能量的零点。模型计算用绝对温度，20℃对应293.15 K，60℃对应333.15 K；K是开尔文。这一换算可先作为说明，不必死背。',
      'Set small-sample 20°C energy to 1; twice the amount at 20°C gives 2. Small-sample 60°C is about 1.14, not 3: zero Celsius is not the zero of microscopic motion energy. The calculation uses absolute temperature: 20°C is 293.15 K and 60°C is 333.15 K; K means kelvin. Use this to understand the comparison, rather than memorising the conversion now.',
    ),
    misconception: t(
      '0℃时粒子仍在运动；“冷”不是没有内能。内能不能只看温度，温度也不是一个物体拥有多少焦耳。真实水、金属和有相互作用的物质不能照抄这份理想气体的1:2:1.14比例。',
      'Particles still move at 0°C; cold does not mean no internal energy. Temperature alone does not determine internal energy, and a temperature is not a number of joules. Real water, metals and interacting materials do not inherit this ideal-gas ratio.',
    ),
    realWorld: t(
      '浴缸水和小杯水可以同温，却在改变温度时需要不同的能量。下一课会用同一种水、同样升温来比较质量的影响。',
      'A bathtub and small cup can share a temperature while needing different energy to change it. Next, compare masses of the same water for the same rise.',
    ),
    summary: t(
      '同温不等于同内能；先说清温度、数量、种类和状态。',
      'Same temperature does not mean same internal energy. Name temperature, amount, material and state.',
    ),
    homeExperiment: t(
      '用两份不同量的室温水，看温度计是否可以读到相近温度。只观察数量与读数，不靠手感估计焦耳，也不加热；把内能判断的条件写在手帐里。',
      'Compare different amounts of room-temperature water with a thermometer. Observe amount and readings without heating or estimating joules by touch. Record the conditions needed for your energy claim.',
    ),
    vocabulary: [
      t('微观粒子', 'microscopic particles'),
      t('温度', 'temperature'),
      t('内能', 'internal energy'),
      t('开尔文K', 'kelvin K'),
    ],
    questions: [
      q(
        '同种理想气体同温、数量加倍，模型内能怎样？',
        'Same ideal gas and temperature, double amount. Model internal energy?',
        [
          ['加倍', 'Doubles'],
          ['温度加倍', 'Temperature doubles'],
        ],
        0,
        '两倍粒子保持相同的平均微观运动，总微观能量加倍。',
        'Twice the particles with the same average microscopic motion doubles the total.',
      ),
      q(
        '0℃气体中的粒子怎样？',
        'What happens to gas particles at 0°C?',
        [
          ['全停止', 'All stop'],
          ['仍做微观运动', 'Still move microscopically'],
        ],
        1,
        '摄氏零点不是绝对温度的零点。',
        'Celsius zero is not absolute zero.',
      ),
      q(
        '比较真实水和金属的内能，只知道温度够吗？',
        'Is temperature alone enough to compare real water and metal internal energy?',
        [
          ['够', 'Yes'],
          [
            '不够，还要数量、种类和状态等',
            'No; amount, material, state and more matter',
          ],
        ],
        1,
        '微观相互作用与物质数量也影响能量账本。',
        'Interactions and amount also affect the ledger.',
      ),
    ],
    exit: q(
      '同温的一杯水和一桶水，能说“温度计一样，所以内能一样”吗？',
      'Same-temperature cup and bucket: can equal thermometer readings prove equal internal energy?',
      [
        ['不能；还缺物质数量等信息', 'No; amount and other information matter'],
        ['能；温度就是总能量', 'Yes; temperature is total energy'],
      ],
      0,
      '温度和总微观能量是不同的量。',
      'Temperature and total microscopic energy are different quantities.',
    ),
  },
  {
    id: 'thermal-heating-water-mass',
    stage: 2,
    unit: 'thermal',
    kind: 'thermal-heating',
    minutes: 18,
    title: t(
      '同样的能量，为什么小杯水升温更多？',
      'Same energy: why does the smaller water sample warm more?',
    ),
    subtitle: t(
      '控制质量、输入能量与初温，把热传递写进账本。',
      'Control mass, input and initial temperature; account for thermal transfer.',
    ),
    hook: t(
      '给100 g和200 g的水同样一份能量，是大杯升温更多，还是小杯？先别用杯子大小猜，固定同一种水和起始温度。',
      'Give 100 g and 200 g of water the same energy. Which temperature rises more? Match material and initial temperature before guessing from cup size.',
    ),
    prediction: t(
      '理想情况下，100 g水吸收840 J升温2℃；200 g水吸收同样840 J，升温多少？',
      'Ideally, 100 g water absorbs 840 J and rises 2°C. With the same 840 J, how much does 200 g rise?',
    ),
    predictions: [
      t('1℃', '1°C'),
      t('4℃', '4°C'),
      t('仍2℃，质量无影响', 'Still 2°C; mass has no effect'),
    ],
    explore: t(
      '记录三组完整加热：100 g/840 J、200 g/840 J、100 g/1680 J，均从20℃开始。看输入能量、温度变化和水的内能增加；比较一次只改一个量。这里的输入已经是水吸收的能量，不是插座的总用电。',
      'Observe and retain 100 g/840 J, 200 g/840 J and 100 g/1680 J, all initially 20°C. Compare input, temperature rise and water internal-energy increase, changing one quantity at a time. Input is energy absorbed by water, not total socket electricity.',
    ),
    concept: t(
      '温差会引起从较热处向较冷处的净能量传递，这种传递叫热传递；Q表示传入的能量，单位J。热不是装在杯里的一种物质。没有相变、没有机械做功、没有向外散失的模型中，吸收的Q增加水的内能。升温还取决于质量与材料的比热容c：同一种水质量越多，同样Q分给整个样品，升温越小。',
      'A temperature difference causes net energy transfer from hotter to colder regions; this is heat transfer. Q denotes transferred energy in joules, not a substance inside the cup. In this model without phase change, mechanical work or outward loss, absorbed Q increases water internal energy. Temperature rise also depends on mass and specific heat capacity c: more of the same water rises less for the same Q.',
    ),
    formula: t(
      'Q=mcΔT；水取c≈4200 J/(kg·℃)，ΔT=末温−初温。',
      'Q=mcΔT; water c≈4200 J/(kg·°C), ΔT=final−initial temperature.',
    ),
    example: t(
      '100 g先换成0.100 kg。840÷(0.100×4200)=2℃，末温22℃。200 g是0.200 kg，840÷840=1℃，末温21℃；100 g吸收1680 J则升4℃，末温24℃。J是能量，℃是温度，不能混用。',
      'Convert 100 g to 0.100 kg: 840/(0.100×4200)=2°C, final 22°C. At 0.200 kg, 840/840=1°C, final 21°C. At 100 g and 1680 J, rise is 4°C, final 24°C. Joules and Celsius degrees measure different quantities.',
    ),
    misconception: t(
      '水升温不是“产生了温度能量”。摄氏温差与摄氏读数也不同。真实加热还会暖杯子、向周围传递、蒸发；不能默认电器用电全被水吸收。不同材料的c不同，质量相同也不一定同样升温。',
      'Water does not create temperature energy. A Celsius difference differs from a Celsius reading. Real heating also warms containers, transfers outward and may evaporate; electrical input is not automatically all absorbed by water. Different materials have different c.',
    ),
    realWorld: t(
      '烧一壶水通常比一小杯需要更多能量。先比较相同初末温与水质量，再谈节能；功率、时间和能量是三个相关但不同的量。',
      'A kettleful usually needs more energy than a small cup. Match initial/final temperatures and mass before discussing savings; power, time and energy are related but different.',
    ),
    summary: t(
      '热描述温差造成的传递；升温多少，要同时看吸收能量、质量和材料。',
      'Heat describes transfer caused by temperature difference. Rise depends on absorbed energy, mass and material.',
    ),
    homeExperiment: t(
      '和家人用两份不同质量的室温水，讨论“让它们都升高同样几度，谁需要更多能量”。可先画账本并估算，不必通电或烧水；若用实际读数，保留杯子和散失等未知条件。',
      'With a helper, compare masses of room-temperature water and ask which needs more energy for the same rise. Draw a ledger and estimate without powered heating or boiling. Retain unknown container/loss conditions if using actual readings.',
    ),
    vocabulary: [
      t('热传递', 'heat transfer'),
      t('比热容', 'specific heat capacity'),
      t('温差ΔT', 'temperature difference ΔT'),
      t('吸收能量Q', 'absorbed energy Q'),
    ],
    questions: [
      q(
        '100 g换成kg是多少？',
        '100 g in kg?',
        [
          ['0.100 kg', '0.100 kg'],
          ['100 kg', '100 kg'],
        ],
        0,
        '1 kg=1000 g。',
        '1 kg=1000 g.',
      ),
      q(
        '同种水、相同Q，质量加倍，理想升温怎样？',
        'Same water and Q, double mass: ideal rise?',
        [
          ['加倍', 'Doubles'],
          ['减半', 'Halves'],
        ],
        1,
        'ΔT=Q/(mc)，分母质量加倍。',
        'ΔT=Q/(mc); the mass in the denominator doubles.',
      ),
      q(
        '水的内能增加840 J，模型输入已经是吸收量。输入与增加应相加为1680 J吗？',
        'Water gains 840 J; input already means absorbed energy. Add input and gain to claim 1680 J?',
        [
          ['要相加', 'Yes'],
          [
            '不能，这是同一份能量的两个描述',
            'No; these describe the same energy',
          ],
        ],
        1,
        '输入和样品的增加分别描述传递与结果，不是两个独立储备。',
        'Input and increase describe transfer and outcome, not independent stores.',
      ),
    ],
    exit: q(
      '真实电器输入1680 J，水的温升小于理想预测，能说能量消失了吗？',
      'A real heater receives 1680 J but water warms less than the ideal prediction. Has energy disappeared?',
      [
        [
          '没有；还要追踪杯子和周围等去向',
          'No; trace the container and surroundings too',
        ],
        [
          '是的，温度不够就证明能量没了',
          'Yes; lower temperature proves disappearance',
        ],
      ],
      0,
      '模型只把被水吸收的能量记入水；真实系统边界更大。',
      'The model counts energy absorbed by water; the real system has other destinations.',
    ),
  },
  {
    id: 'thermal-three-transfer-paths',
    stage: 2,
    unit: 'thermal',
    kind: 'thermal-paths',
    minutes: 19,
    title: t(
      '没有碰到热源，也能变暖吗？',
      'Can you warm without touching the heat source?',
    ),
    subtitle: t(
      '从勺柄、流动的水和真空间隙，分辨三条传递通路。',
      'Trace a spoon, flowing water and a vacuum gap to distinguish three routes.',
    ),
    hook: t(
      '勺子的另一端会变暖，水会带着能量流动，阳光还能穿过太空。能量从较热处来到较冷处，必须用同一种办法吗？',
      'A spoon’s other end warms, water carries energy as it moves and sunlight crosses space. Must hotter-to-colder transfer always use the same route?',
    ),
    prediction: t(
      '真空间隙里没有空气，也没有接触。净能量能从较热物体传到较冷物体吗？',
      'Across a vacuum gap with no air or contact, can net energy pass from hotter to colder objects?',
    ),
    predictions: [
      t('可以，靠热辐射', 'Yes, by thermal radiation'),
      t('不行，所有热传递都要空气', 'No; all heat transfer needs air'),
      t('必须让整块热物体飞过去', 'The whole hot object must move across'),
    ],
    explore: t(
      '完整观察三条通路：固体中的传导、液体受热后整体流动的对流、跨真空间隙的辐射。记录是否有物质整体迁移、通路是否需要物质。箭头表示能量通路，长度不代表功率；这不是三条定量升温曲线。',
      'Observe conduction in a solid, convection carrying energy with flowing liquid and radiation across a vacuum gap. Retain whether matter moves in bulk and whether the route requires matter. Arrows indicate pathways, not power magnitudes; these are not quantitative heating curves.',
    ),
    concept: t(
      '传导通过相邻粒子的相互作用等把能量传过去，不要求物体整体迁移；金属中电子也能传递能量。对流是气体或液体的整体流动携带能量；受热流体密度减小，在重力与合适条件下上升，较冷流体回流。热辐射以电磁波传递能量，可以穿过真空。物体同时辐射也吸收，通常较热物体向较冷物体的净传递更多。',
      'Conduction transfers energy through neighbouring interactions without requiring bulk motion; electrons also carry energy in metals. Convection is bulk gas or liquid flow carrying energy; heated fluid can become less dense and rise under gravity in suitable conditions as cooler fluid returns. Thermal radiation transfers energy by electromagnetic waves across vacuum. Objects both emit and absorb; net transfer normally runs from hotter to colder.',
    ),
    example: t(
      '勺柄变暖：固体不整块移动，传导重要。锅里热水上升、较冷水下沉：对流参与，液体里也会传导。隔真空两物体仍交换辐射：热辐射不需要空气。真实房间的暖气通常同时有多条通路，不能只凭一个箭头给整个系统贴单一标签。',
      'A stationary spoon handle warms: conduction matters. Rising warmer water and returning cooler water involve convection, with conduction in liquid too. Two objects across vacuum still exchange radiation. A room heater normally uses several routes; one arrow does not give the whole system a single label.',
    ),
    misconception: t(
      '热不是只有热空气才能搬走的东西；对流也不是“每个粒子只有向上”。在重力下、加热位置合适才容易形成图示自然环流，从上方加热可能形成较稳定分层。辐射不是只有发红物体才有，普通温度的物体也会发出红外等辐射。',
      'Heat transfer is not limited to hot air; convection does not mean every particle only moves upward. Gravity and heating position matter for natural circulation; heating from above can produce stable layering. Radiation is not restricted to glowing objects; ordinary-temperature objects emit infrared radiation too.',
    ),
    realWorld: t(
      '木柄减少沿柄传导，暖气附近气流会对流，阳光与热表面会辐射。解释保温设计时，逐条问“哪一条通路被减慢了”。',
      'Wooden handles reduce conduction, air near heaters convects and sunlight/hot surfaces radiate. Explain insulation by asking which routes are reduced.',
    ),
    summary: t(
      '看有没有整体流动，再看是否需要介质；真实系统常有多条通路。',
      'Look for bulk flow and whether matter is required; real systems often combine routes.',
    ),
    homeExperiment: t(
      '与家人把金属和木勺的下端放进温暖、可安全接触的水中，观察较远位置的温度变化；不用沸水。对流与辐射先用图解释生活例子，不用明火、热灯或直视太阳。',
      'With a helper, place lower ends of metal and wooden spoons in comfortably warm water and observe temperature farther away, without boiling water. Explain everyday convection/radiation with sketches, without flames, hot lamps or looking at the Sun.',
    ),
    vocabulary: [
      t('热传导', 'conduction'),
      t('对流', 'convection'),
      t('热辐射', 'thermal radiation'),
      t('真空', 'vacuum'),
    ],
    questions: [
      q(
        '流动的水把能量带到另一处，哪条通路参与？',
        'Flowing water carries energy elsewhere. Which route participates?',
        [
          ['对流', 'Convection'],
          ['只有真空辐射', 'Only vacuum radiation'],
        ],
        0,
        '对流强调流体的整体流动携带能量。',
        'Convection concerns energy carried by bulk fluid flow.',
      ),
      q(
        '哪条通路可穿过真空？',
        'Which route can cross vacuum?',
        [
          ['热辐射', 'Thermal radiation'],
          ['空气对流', 'Air convection'],
        ],
        0,
        '电磁波传递能量不需要物质介质。',
        'Electromagnetic energy transfer needs no material medium.',
      ),
      q(
        '静止金属柄变暖，是整块金属迁移了吗？',
        'A stationary metal handle warms. Did the metal move in bulk?',
        [
          ['一定整块迁移', 'It must have moved in bulk'],
          [
            '没有；内部相互作用和电子等可传递能量',
            'No; interactions and electrons can transfer energy',
          ],
        ],
        1,
        '传导不要求物体整体搬动。',
        'Conduction does not require bulk movement.',
      ),
    ],
    exit: q(
      '保温杯抽走夹层空气后，所有热传递都停止了吗？',
      'After removing air between flask walls, has all thermal transfer stopped?',
      [
        [
          '没有；辐射、瓶口等通路仍要考虑',
          'No; radiation, the neck and other routes remain',
        ],
        ['是的，没空气就没有任何传递', 'Yes; no air means no transfer'],
      ],
      0,
      '真空减弱跨夹层的物质传递通路，但不消除辐射与结构连接。',
      'Vacuum reduces material routes across the gap, but not radiation or structural connections.',
    ),
  },
  {
    id: 'thermal-cooling-and-insulation',
    stage: 2,
    unit: 'thermal',
    kind: 'thermal-cups',
    minutes: 19,
    title: t(
      '保温杯会制造温暖，还是减慢变化？',
      'Does an insulated cup create warmth or slow change?',
    ),
    subtitle: t(
      '同样的水与初温，比较冷却曲线；再把冷水放进去。',
      'Match water and initial temperature, compare curves, then try cold water.',
    ),
    hook: t(
      '热水放一会儿会变凉，冷水放一会儿可能变暖。包一层保温材料，两种情况下都只是“让水更热”吗？',
      'Hot water can cool and cold water can warm. Does adding insulation simply make water hotter in both cases?',
    ),
    prediction: t(
      '10℃冷水放在20℃房间，包裹杯和裸杯谁在同样时间更接近原来的10℃？',
      'Water at 10°C in a 20°C room: which stays closer to its original 10°C over the same time?',
    ),
    predictions: [
      t('包裹杯；能量传入也变慢', 'Wrapped cup; inward transfer also slows'),
      t('裸杯；保温材料总会加热', 'Bare cup; insulation always heats'),
      t('两个永远都是10℃', 'Both remain 10°C forever'),
    ],
    explore: t(
      '完整观察三组10 min教学过程：60℃水/20℃房间，60℃水/40℃房间，10℃水/20℃房间。每组同时比较裸杯和包裹杯，均100 g水。记录末温与水内能变化；时间滑块只巡查，不代替完整过程。',
      'Observe three full ten-minute teaching cases: 60°C water/20°C room, 60°C/40°C, and 10°C/20°C. Each compares bare/wrapped cups with the same 100 g water. Retain endpoint temperatures and water internal changes; seeking only inspects, not completes the process.',
    ),
    concept: t(
      '冷却是水把能量净传给较冷周围，内能减少；水比房间冷时，净传入会使它变暖。保温减慢交换，不制造能量，也不让温度永久不变。模型把各种散失通路合成一个规定的传热参数G，并把房间当温度固定的大环境；包裹杯G较小。温差越小，净传递通常越慢，所以曲线逐渐变平。',
      'Cooling transfers net energy from water to cooler surroundings, decreasing internal energy. Colder-than-room water receives net energy and warms. Insulation slows exchange without creating energy or keeping temperature unchanged forever. The model combines pathways in a prescribed conductance G and treats the room as a fixed-temperature bath; wrapped G is smaller. Net transfer slows as the temperature difference decreases, flattening the curves.',
    ),
    formula: t(
      '水内能变化≈mc(末温−初温)；水+周围的能量变化相互补偿。',
      'Water internal change≈mc(final−initial); water and surroundings have compensating energy changes.',
    ),
    example: t(
      '规定模型10 min后：60℃水/20℃房间，裸杯约34.72℃，包裹约52.75℃；若房间40℃，裸杯约47.36℃。10℃水/20℃房间，裸杯约16.32℃，包裹约11.81℃：包裹也减慢升温。这些不是所有真实杯子的测量结果。',
      'After the prescribed ten minutes: 60°C water/20°C room gives about 34.72°C bare and 52.75°C wrapped. With a 40°C room, bare is about 47.36°C. For 10°C water/20°C room, bare is about 16.32°C and wrapped 11.81°C: insulation slows warming too. These are not measured results for all cups.',
    ),
    misconception: t(
      '保温不是永远不交换，也不是无论放什么都升温。温度曲线纵轴20℃起和0℃起都可能，只要标清刻度；本图固定0–60℃。模型忽略杯体热容量、蒸发与相变，规定G并不等于一种材料永远固定的性质。',
      'Insulation is not zero exchange forever and does not always raise temperature. Graphs can use different vertical origins if labelled; this plot stays at 0–60°C. Container capacity, evaporation and phase changes are omitted, and prescribed G is not a universal material constant.',
    ),
    realWorld: t(
      '保温杯、冰袋外包装与冬衣都在改变交换速度。真实比较应相同水质量、初温、环境、杯形、盖子与测量时刻，只改变待比较的保温条件。',
      'Flasks, cooler wraps and clothes alter exchange rates. Real comparisons match mass, initial temperature, environment, cup shape, lid and observation time, changing only the insulation condition.',
    ),
    summary: t(
      '保温减慢变冷，也减慢变暖；方向由物体与周围的温差决定。',
      'Insulation slows cooling and warming; direction follows the temperature difference.',
    ),
    homeExperiment: t(
      '和家人用两个相同杯、等量的温水（不用热水），只给一个加普通保温套。保持盖子与环境相同，在相同时间读温度并保留原读数。若没有温度计，记录方案与未知，不凭手感宣布胜负。',
      'With a helper, use matching cups and equal comfortably warm water, adding an ordinary insulating sleeve to one. Match lids/environment and read temperatures at shared times, keeping originals. Without a thermometer, retain a plan and unknowns instead of declaring a winner by touch.',
    ),
    vocabulary: [
      t('冷却曲线', 'cooling curve'),
      t('保温', 'insulation'),
      t('净能量传递', 'net energy transfer'),
      t('周围环境', 'surroundings'),
    ],
    questions: [
      q(
        '水比房间冷，净能量通常怎样传？',
        'Water is colder than the room. Usual net transfer?',
        [
          ['水→房间', 'Water → room'],
          ['房间→水', 'Room → water'],
        ],
        1,
        '净传递从较热处到较冷处。',
        'Net transfer runs from hotter to colder.',
      ),
      q(
        '公平比较杯套，哪些条件先保持一致？',
        'To compare sleeves fairly, what should match?',
        [
          [
            '质量、初温、环境和时刻等',
            'Mass, initial temperature, environment, time and more',
          ],
          ['只要颜色一样', 'Colour alone'],
        ],
        0,
        '同时改其他条件会混淆保温效果。',
        'Other simultaneous changes confound insulation effects.',
      ),
      q(
        '包裹杯冷却慢，是材料制造能量了吗？',
        'Wrapped water cools slower. Did insulation create energy?',
        [
          ['制造了能量', 'Yes'],
          ['没有，交换变慢', 'No; exchange slowed'],
        ],
        1,
        '减慢损失不是产生能量。',
        'Slower loss is not creation.',
      ),
    ],
    exit: q(
      '冷饮在温暖房间里，杯套应让它升温更快还是更慢？',
      'A cold drink in a warm room: should insulation make warming faster or slower?',
      [
        ['更慢；传入也被减慢', 'Slower; inward transfer is reduced too'],
        [
          '更快；保温只对热水起作用',
          'Faster; insulation only affects hot water',
        ],
      ],
      0,
      '同一减慢交换的作用可以保持热，也可以保持冷。',
      'Slower exchange can preserve warmth or coolness.',
    ),
  },
  {
    id: 'thermal-evaporation-and-cooling',
    stage: 2,
    unit: 'thermal',
    kind: 'thermal-wet',
    minutes: 19,
    title: t(
      '水没有沸腾，湿布为什么也会变凉？',
      'Without boiling, why can a wet cloth cool?',
    ),
    subtitle: t(
      '追踪表面蒸发、剩余水量与能量去向。',
      'Follow surface evaporation, remaining water and energy destinations.',
    ),
    hook: t(
      '晾衣服时水会消失，却没有烧开。湿布比周围凉时，房间又可以向它传入能量：这两件事能同时发生吗？',
      'Laundry dries without boiling. A wet cloth cooler than the room can receive energy from it: can both things happen together?',
    ),
    prediction: t(
      '20℃湿表面处在20℃房间，有持续净蒸发而没有加热器，会一直保持20℃吗？',
      'A 20°C wet surface in a 20°C room evaporates continuously without a heater. Must it stay at 20°C?',
    ),
    predictions: [
      t(
        '不一定；蒸发需要能量，可以使表面变凉',
        'Not necessarily; evaporation requires energy and can cool it',
      ),
      t('一定；只有沸腾才会汽化', 'Yes; only boiling forms vapour'),
      t('蒸发会让能量凭空增加', 'Evaporation creates energy'),
    ],
    explore: t(
      '完整观察三个5 min规定模型：净蒸发率0、0.10 g/min、0.20 g/min。均从20℃与2 g水开始，其余热学参数固定。记录剩余水、表面温度、蒸发所需能量和房间净传入。速率是规定值，不是由真实风速、湿度或人体预测出来的。',
      'Observe three prescribed five-minute cases: net rates 0, 0.10 and 0.20 g/min, starting at 20°C with 2 g water and the same thermal parameters. Retain remaining water, surface temperature, evaporation energy and net room input. Rates are prescribed, not predictions from real wind, humidity or a person.',
    ),
    concept: t(
      '蒸发发生在液体表面，不必到沸点；一些能量较高的粒子逃离表面，留下液体的平均微观运动可能减弱。液体变气体也涉及微观相互作用能量，需要能量传递。若补充不及，湿表面变凉；变凉后较暖房间又能向它传入。较湿空气、气流和温度都会影响真实净蒸发率，本模型只控制这一速率来研究能量账本。',
      'Evaporation occurs at a liquid surface below boiling. Some higher-energy particles escape, and the remaining liquid’s average microscopic motion can decrease. Liquid-to-vapour change also involves interaction energy and requires energy transfer. If replenishment is insufficient, the wet surface cools; then the warmer room transfers energy inward. Humidity, airflow and temperature affect real net rates; this model prescribes the rate to study the ledger.',
    ),
    formula: t(
      '蒸发所需能量≈蒸发质量×每克汽化能；房间传入=蒸发所需能量+表面内能变化。',
      'Evaporation energy≈evaporated mass×vaporisation energy per gram; room input=evaporation energy+surface internal change.',
    ),
    example: t(
      '模型取每克约2400 J。5 min、0.10 g/min蒸发0.50 g，剩1.50 g，所需1200 J；表面约15.78℃。其中表面内能约减少844 J，房间净补充约356 J。0.20 g/min蒸发1.00 g，所需2400 J，表面约11.56℃。0净速率表示已达净平衡的对照，不是“没有单个粒子离开”。',
      'The model uses about 2400 J/g. Over five minutes at 0.10 g/min, 0.50 g evaporates, 1.50 g remains and 1200 J is needed; the surface is about 15.78°C. Surface internal energy falls about 844 J while the room supplies about 356 J. At 0.20 g/min, 1.00 g needs 2400 J and the surface is about 11.56°C. Zero net rate is an equilibrated comparison, not no individual particles leaving.',
    ),
    misconception: t(
      '蒸发不等于沸腾；“水少了”本身不能证明全由蒸发，也要排查洒出、漏水等。真实风同时改变对流传热与蒸发，不能把本模型速率直接当风扇档位。这里把表面热容量固定200 J/℃，忽略少量水损失对它的改变，不模拟干燥后的过程，也不估算人体健康或降温效果。',
      'Evaporation is not boiling. Less water alone does not prove evaporation: check spills and leaks. Real airflow changes convection as well as evaporation; these rates are not fan settings. Surface capacity stays at 200 J/°C, neglecting its change from small water loss; the model does not describe the dry stage or predict personal cooling/health effects.',
    ),
    realWorld: t(
      '晾衣、湿地板变干与汗的蒸发都涉及相变与能量去向。汗留在皮肤上但没有蒸发时，不能直接套用“蒸发了多少克”的能量计算。',
      'Drying laundry, wet floors and evaporating sweat involve phase change and energy destinations. Sweat remaining on skin cannot be counted as mass already evaporated.',
    ),
    summary: t(
      '蒸发可以低于沸点发生；湿表面冷却与房间传入能量可以同时存在。',
      'Evaporation can occur below boiling; surface cooling and energy from the room can occur together.',
    ),
    homeExperiment: t(
      '和家人把两块相同布一块稍微打湿、一块保持干燥，放在同一室温位置，观察水量与温度变化并记录条件。没有温度计只写手感观察，不把它当定量证明；不用加热、不在身上实验。',
      'With a helper, place matching slightly damp and dry cloths together at room temperature and record water/temperature observations and conditions. Without a thermometer, keep touch observations qualitative. Use no heating and no experiment on a person.',
    ),
    vocabulary: [
      t('蒸发', 'evaporation'),
      t('净蒸发率', 'net evaporation rate'),
      t('汽化', 'vaporisation'),
      t('能量补充', 'energy replenishment'),
    ],
    questions: [
      q(
        '室温水可以蒸发吗？',
        'Can room-temperature water evaporate?',
        [
          ['可以，表面粒子能离开', 'Yes; particles can leave the surface'],
          ['不能，必须100℃', 'No; it must reach 100°C'],
        ],
        0,
        '表面蒸发可以低于沸点发生。',
        'Surface evaporation occurs below boiling.',
      ),
      q(
        '模型蒸发0.50 g，每克2400 J，需要多少能量？',
        'Model evaporates 0.50 g at 2400 J/g. Energy needed?',
        [
          ['4800 J', '4800 J'],
          ['1200 J', '1200 J'],
        ],
        1,
        '0.50×2400=1200 J。',
        '0.50×2400=1200 J.',
      ),
      q(
        '湿表面已比房间冷，仍在蒸发。房间可以净传入能量吗？',
        'Wet surface is cooler than the room and still evaporating. Can the room supply net energy?',
        [
          [
            '可以，能补充一部分蒸发所需',
            'Yes; it can replenish part of evaporation energy',
          ],
          [
            '不能，变凉说明没有任何能量传入',
            'No; cooling proves no energy enters',
          ],
        ],
        0,
        '多个能量去向可以同时存在，内能变化看净账本。',
        'Several transfers coexist; internal change follows the net ledger.',
      ),
    ],
    exit: q(
      '用风扇吹湿布后更凉，能把原因全部写成“空气本来更冷”吗？',
      'A fan makes wet cloth cooler. Can the whole explanation be that the air was colder?',
      [
        [
          '不能；要查蒸发、对流、环境与初温等条件',
          'No; examine evaporation, convection, environment and initial conditions',
        ],
        ['能；风一定改变空气温度', 'Yes; wind always changes air temperature'],
      ],
      0,
      '气流可以改变交换与净蒸发，不必先让空气温度降低。',
      'Airflow can change exchange and net evaporation without first reducing air temperature.',
    ),
  },
];
