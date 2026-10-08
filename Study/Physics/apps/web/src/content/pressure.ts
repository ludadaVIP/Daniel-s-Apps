import { t, q, type Lesson } from './schema';
export const pressureLessons: Lesson[] = [
  {
    id: 'pressure-force-over-area',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-contact',
    minutes: 17,
    title: t(
      '同一个书包，为什么宽带更舒服？',
      'Same backpack. Why might a wider strap help?',
    ),
    subtitle: t(
      '先把力分给小方格，再认识压强。',
      'Share the force across little squares, then meet pressure.',
    ),
    hook: t(
      '书包没有变轻，肩带换宽后却可能没那么勒。变的不是书包的重量，而是同样的力分布在哪一块接触面上。',
      'A wider strap may feel less sharp even when the backpack is unchanged. The load has not become lighter; the contact area carrying it has changed.',
    ),
    prediction: t(
      '总压力60 N不变，接触面积从30变成60 cm²，平均压强怎样变？',
      'Keep the total normal force at 60 N. Double contact area from 30 to 60 cm². What happens to average pressure?',
    ),
    predictions: [
      t('减半', 'Halves'),
      t('不变', 'Unchanged'),
      t('加倍', 'Doubles'),
    ],
    explore: t(
      '完整检查60 N/30 cm²、60 N/60 cm²、120 N/30 cm²三组。每格代表1 cm²，格子均分总力；比较格内箭头和保留表。再自由调整力与面积，先预测再读数。',
      'Inspect 60 N/30 cm², 60 N/60 cm² and 120 N/30 cm² completely. Each square is 1 cm² and shares the load equally. Compare arrows and the retained table. Then predict before changing force or area freely.',
    ),
    concept: t(
      '压强描述单位面积受到的垂直压力。接触面上分布不均时，F/A给的是平均压强；F是对这块接触面的总垂直力，A是实际承受它的面积。相同力分到更大面积，平均压强更小；面积相同，力更大则压强更大。压强不是另一种力。',
      'Pressure describes normal force per area. If contact loading is uneven, F/A is an average. F is the total normal force on this contact patch; A is the area carrying it. Spreading the same force over more area lowers the average. More force on the same area raises it. Pressure is not another force.',
    ),
    example: t(
      '30 cm²=0.003 m²，所以60÷0.003=20000 Pa=20 kPa。面积变成0.006 m²，压强是10 kPa；原面积上力变成120 N，则是40 kPa。1 Pa=1 N/m²；1 m²=10000 cm²。',
      '30 cm² = 0.003 m², so 60/0.003 = 20000 Pa = 20 kPa. With 0.006 m² the pressure is 10 kPa. With 120 N on the original area it is 40 kPa. 1 Pa = 1 N/m²; 1 m² = 10000 cm².',
    ),
    misconception: t(
      '不能把60÷30=2直接写成2 Pa：那是2 N/cm²，等于20000 Pa。图中箭头表示每格分到的力，不表示压入皮肤或材料的深度。真实肩带还有弯曲、垫层和不均匀接触。',
      '60/30 = 2 is not 2 Pa: it is 2 N/cm², equal to 20000 Pa. Arrows show each square’s share of force, not indentation into skin or material. Real straps also bend, have padding and contact unevenly.',
    ),
    realWorld: t(
      '搬重物的宽提手、书包肩带和椅垫都在改变接触分布。舒适程度还受材质与姿势影响，不能只用平均压强给身体感受评分。',
      'Wide handles, backpack straps and seat cushions change contact loading. Material and posture also affect comfort; average pressure alone is not a rating of bodily sensation.',
    ),
    summary: t(
      '同样的垂直力，分到更大面积，平均压强更小。',
      'The same normal force spread over more area gives less average pressure.',
    ),
    homeExperiment: t(
      '把一本书平放在柔软海绵上，再轻轻换成较小接触面，保持同一本书且不额外用手压。观察形变，写下材料和接触方式；形变不是直接的压强计。不做尖物压皮肤的比较。',
      'Place a book on soft foam, then gently use a smaller contact face with the same book and no extra hand push. Note deformation, material and contact. Deformation is not a direct pressure meter; do not compare sharp objects on skin.',
    ),
    formula: t(
      '平均压强 p=F/A；F用N，A用m²，p用Pa。',
      'Average pressure p=F/A; F in N, A in m², p in Pa.',
    ),
    vocabulary: [
      t('压强', 'pressure'),
      t('垂直压力', 'normal force'),
      t('接触面积', 'contact area'),
      t('帕斯卡', 'pascal'),
    ],
    questions: [
      q(
        '力不变，面积加倍，平均压强？',
        'Same force, twice the area: average pressure?',
        [
          ['减半', 'Halved'],
          ['加倍', 'Doubled'],
        ],
        0,
        'p=F/A，分母加倍。',
        'p=F/A; doubling the denominator halves it.',
      ),
      q(
        '30 cm²等于多少m²？',
        '30 cm² in m²?',
        [
          ['0.3 m²', '0.3 m²'],
          ['0.003 m²', '0.003 m²'],
        ],
        1,
        '面积换算要除以10000。',
        'Divide a square-centimetre area by 10000.',
      ),
      q(
        '120 N作用于30 cm²，平均压强？',
        '120 N over 30 cm²: average pressure?',
        [
          ['40 kPa', '40 kPa'],
          ['4 Pa', '4 Pa'],
        ],
        0,
        '120÷0.003=40000 Pa。',
        '120/0.003 = 40000 Pa.',
      ),
    ],
    exit: q(
      '同样的提包换宽把手，能确定什么？',
      'The same bag gets a wider handle. What can we establish?',
      [
        ['总重量消失了', 'Its total weight vanished'],
        [
          '若承力面积增大，同样力的平均压强减小',
          'If load-bearing area grows, average pressure from the same force falls',
        ],
      ],
      1,
      '比较的是接触分布，不是把包变轻。',
      'It changes contact loading rather than making the bag lighter.',
    ),
  },
  {
    id: 'pressure-shoes-contact',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-shoes',
    minutes: 16,
    title: t('雪鞋为什么做得那么大？', 'Why are snowshoes so large?'),
    subtitle: t(
      '站着不动的人，同样重量，三种接触面积。',
      'Same stationary person and load. Three contact areas.',
    ),
    hook: t(
      '细小的鞋跟可能让软地面留下深印，宽大的雪鞋却帮助分散重量。谁“更重”不是只看印痕就能回答的。先固定人和地面，再比较接触。',
      'A narrow heel may mark soft ground while broad snowshoes spread a load. Marks alone do not tell us who is heavier. Keep the person and surface fixed, then compare contact.',
    ),
    prediction: t(
      '同一个人静止站立，总垂直力600 N，雪鞋接触面积1000 cm²与窄小接触20 cm²相比？',
      'For the same stationary person, total normal force is 600 N. Compare 1000 cm² snowshoe contact with 20 cm² narrow contact.',
    ),
    predictions: [
      t('雪鞋平均压强更小', 'Snowshoe average pressure is lower'),
      t('雪鞋让重量归零', 'Snowshoes remove weight'),
      t('面积越大压强越大', 'More area means more pressure'),
    ],
    explore: t(
      '完整比较总接触面积200、20、1000 cm²。图中两块等效长方形合起来就是总面积，各承受300 N；尺寸共用比例。压强条共用0–300 kPa，不是陷入深度。',
      'Compare total contact areas 200, 20 and 1000 cm² completely. Two equivalent rectangular patches together make the total area, each carrying 300 N, at one length scale. Pressure bars share 0–300 kPa, not an indentation scale.',
    ),
    concept: t(
      '静止在水平地面上，忽略其他竖直力，地面总支持力与重量平衡。改变鞋的接触面积不会自动改变人的质量或重量。平均压强用两脚总垂直力除以两脚总接触面积；不能把总力除以一只脚的面积，却说是两脚平均。',
      'For a stationary person on level ground with no other vertical forces, total support balances weight. Changing shoe contact area does not automatically change mass or weight. Divide the total normal force on both feet by their total contact area, keeping force and area matched.',
    ),
    example: t(
      '600 N÷0.02 m²=30 kPa；窄小接触0.002 m²得到300 kPa；雪鞋0.10 m²得到6 kPa。三组总力相同，雪鞋组是窄小接触组压强的1/50。',
      '600 N/0.02 m² = 30 kPa. Narrow 0.002 m² contact gives 300 kPa; 0.10 m² snowshoe contact gives 6 kPa. All carry the same load. The snowshoe average is 1/50 of the narrow-contact average.',
    ),
    misconception: t(
      '“面积大就一定不会陷下去”说得太绝对。地面强度、雪的结构、接触是否均匀、行走时的动态力都会影响结果。这里是静止、均匀承力的规定模型，不是任何真实鞋款的数据。',
      '“Large area guarantees no sinking” goes too far. Ground strength, snow structure, uneven contact and changing forces during walking matter. These are prescribed stationary, uniformly loaded patches, not measurements of particular shoes.',
    ),
    realWorld: t(
      '雪鞋、滑雪板、拖拉机宽轮胎和支撑重物的大垫板都可以增大承力面积。设计还要考虑抓地、重量和材料，不能只追求无限大。',
      'Snowshoes, skis, wide tyres and large support pads can spread a load. Design also needs grip, manageable mass and suitable materials; bigger is not the only goal.',
    ),
    summary: t(
      '人没有变轻；接触面积变大，让平均压强下降。',
      'The person is not lighter; larger contact area lowers average pressure.',
    ),
    homeExperiment: t(
      '在纸上画两种等面积或不同面积的脚印，估算总接触面积并标明“两脚”。不要只画鞋的外轮廓就当作真实接触；写下估计的限制，再预测哪种更适合软地面。',
      'Draw two footprint designs, estimate total contact area and label “both feet”. An outer shoe outline is not necessarily actual contact. State the limits of your estimate, then predict which spreads a load better on soft ground.',
    ),
    vocabulary: [
      t('支持力', 'support force'),
      t('总接触面积', 'total contact area'),
      t('平均压强', 'average pressure'),
      t('雪鞋', 'snowshoe'),
    ],
    formula: t(
      '两脚平均压强=两脚总垂直力÷两脚总接触面积。',
      'Both-feet average pressure = total normal force / total contact area.',
    ),
    questions: [
      q(
        '模型中哪组平均压强最高？',
        'Which model case has the greatest average pressure?',
        [
          ['20 cm²窄小接触', '20 cm² narrow contact'],
          ['1000 cm²雪鞋接触', '1000 cm² snowshoe contact'],
        ],
        0,
        '同样600 N，面积最小的一组压强最大。',
        'At the same 600 N, the smallest area gives the largest pressure.',
      ),
      q(
        '换雪鞋后600 N总支持力怎样变？',
        'What happens to the 600 N total support when changing to snowshoes?',
        [
          ['变为0 N', 'Becomes 0 N'],
          ['仍为600 N', 'Stays 600 N'],
        ],
        1,
        '静止模型中的重量和总支持力未变。',
        'Weight and total support stay unchanged in this stationary model.',
      ),
      q(
        '两脚各100 cm²，总力600 N，平均压强？',
        'Two feet, each 100 cm²; total force 600 N. Average pressure?',
        [
          ['30 kPa', '30 kPa'],
          ['60 kPa', '60 kPa'],
        ],
        0,
        '总面积200 cm²=0.02 m²。',
        'Total area is 200 cm² = 0.02 m².',
      ),
    ],
    exit: q(
      '同一个人留下更深脚印，是否证明变重了？',
      'Does a deeper footprint from the same person prove greater weight?',
      [
        ['是，印深只由重量决定', 'Yes: depth depends only on weight'],
        [
          '不，面积和地面条件也会影响',
          'No: contact and ground conditions also matter',
        ],
      ],
      1,
      '控制条件后才有公平比较；压强不能直接给出陷入深度。',
      'Compare controlled conditions; pressure alone does not predict indentation depth.',
    ),
  },
  {
    id: 'pressure-liquid-depth',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-liquid',
    minutes: 19,
    title: t(
      '水瓶低处的小孔，为什么更有劲？',
      'Why does a lower bottle hole have more push?',
    ),
    subtitle: t(
      '从水面量深度，再转动同一点的小探头。',
      'Measure depth from the surface, then turn a tiny probe at one point.',
    ),
    hook: t(
      '装水的瓶子侧面有高低两个小孔，下面的水流常常更快。这次先不猜飞多远，而是追问：小孔处的水比外面多出多少压强？',
      'Water often exits a lower bottle hole faster. Instead of guessing jet distance, ask how much greater the water pressure is there than outside.',
    ),
    prediction: t(
      '同种静止水、相同水面气压，深度从0.10 m变为0.30 m，水带来的压强增量怎样变？',
      'Same stationary water and surface air pressure: depth changes from 0.10 to 0.30 m. What happens to the liquid pressure increment?',
    ),
    predictions: [
      t('变为3倍', 'Triples'),
      t('变为1/3', 'Becomes one third'),
      t('只看瓶子有多宽', 'Depends only on bottle width'),
    ],
    explore: t(
      '检查水0.10 m、水0.30 m、较密液体0.30 m三组。再改瓶宽、转探头：同一点读数不会因探头朝向而改变。深度从水面量，不从瓶底量；图中探头视为很小，不是跨越多个深度的大物体。',
      'Inspect water at 0.10 m, water at 0.30 m and a denser liquid at 0.30 m. Change vessel width and probe orientation: pressure at the same point stays the same. Depth is measured from the surface. The tiny probe represents one point, not a body spanning several depths.',
    ),
    concept: t(
      '静止、密度近似不变的液体，深度h带来的压强增量是ρgh。同种液体中越深，增量越大；同深度液体更密，增量更大。压强是标量，压力的方向则垂直于探头受力面。液体不仅向下压，也对侧面产生压力。',
      'In a stationary liquid of approximately constant density, the pressure increment at depth h is ρgh. Greater depth increases it; a denser liquid gives more at the same depth. Pressure is a scalar, while a pressure force is normal to its surface. Liquid pushes sideways as well as downward.',
    ),
    example: t(
      '取g=10 N/kg，水ρ=1000 kg/m³：0.10 m增量1 kPa，0.30 m增量3 kPa。若水面气压101 kPa，两处总压强是102和104 kPa。规定较密液体ρ=1200，在0.30 m增量3.6 kPa，总压104.6 kPa。',
      'Use g=10 N/kg and water density 1000 kg/m³. At 0.10 m the increment is 1 kPa; at 0.30 m it is 3 kPa. With 101 kPa surface air pressure, totals are 102 and 104 kPa. The prescribed denser liquid, 1200 kg/m³, gives 3.6 kPa extra and 104.6 kPa total at 0.30 m.',
    ),
    misconception: t(
      '深度加倍，不表示含大气压的总压强也加倍。瓶宽改变且水面、探头深度相同时，ρgh不变。射流轨迹还受孔高、出流与水位变化影响，本模型不计算飞行距离。',
      'Doubling depth does not double total pressure including atmospheric pressure. Width alone does not change ρgh at matched depth and surface pressure. Jet paths also depend on hole height, flow and changing water level; this model does not predict range.',
    ),
    realWorld: t(
      '水坝下部要承受更大的局部水压，所以结构需要考虑深度。给水瓶小孔实验补充水保持水位，才能公平比较；不能把水快没了时的读数与满瓶混在一起。',
      'A dam must account for greater local water pressure lower down. In a bottle-hole comparison, maintain the water level to compare fairly rather than mixing full and nearly empty bottle conditions.',
    ),
    summary: t(
      '同种静止液体，水面以下越深，液体压强增量越大。',
      'In the same stationary liquid, deeper below the surface means a larger pressure increment.',
    ),
    homeExperiment: t(
      '请家人预先在塑料水瓶侧面做两个小孔，把瓶放在水槽里、瓶口敞开，比较出水；不用自己拿尖工具。观察水位降低怎样影响两股水，记录限制。没有材料时画水面与两孔，标出各自深度即可。',
      'Ask a helper to prepare two holes in a plastic bottle. Over a sink with the top open, compare flow and how falling water level affects it. Do not handle sharp tools yourself. Without materials, draw the surface and holes and label their depths.',
    ),
    vocabulary: [
      t('深度', 'depth'),
      t('液体压强增量', 'liquid pressure increment'),
      t('密度', 'density'),
      t('总压强', 'total pressure'),
    ],
    formula: t(
      '液体增量Δp=ρgh；总压强p=p水面+ρgh。',
      'Liquid increment Δp=ρgh; total p=p_surface+ρgh.',
    ),
    questions: [
      q(
        'h从哪里量？',
        'Where is h measured from?',
        [
          ['液面向下到探测点', 'From the liquid surface down to the point'],
          ['瓶底向上到探测点', 'From the bottom upward'],
        ],
        0,
        'ρgh中的h是液面以下深度。',
        'h in ρgh is depth below the liquid surface.',
      ),
      q(
        '水深0.30 m，取ρ=1000、g=10，液体增量？',
        'Water at 0.30 m, ρ=1000 and g=10: liquid increment?',
        [
          ['3 kPa', '3 kPa'],
          ['104 kPa', '104 kPa'],
        ],
        0,
        '增量3000 Pa；104 kPa是再加101 kPa水面气压后的总值。',
        'The increment is 3000 Pa. 104 kPa includes the 101 kPa surface pressure.',
      ),
      q(
        '同液体、同深度、同水面气压，瓶子变宽？',
        'Same liquid, depth and surface pressure, but a wider vessel?',
        [
          ['这一点压强不变', 'Pressure at this point stays the same'],
          ['必定加倍', 'Pressure must double'],
        ],
        0,
        '深度和密度保持时，宽度不出现在ρgh中。',
        'At matched depth and density, width does not enter ρgh.',
      ),
    ],
    exit: q(
      '水深加倍，哪句话准确？',
      'When water depth doubles, which statement is accurate?',
      [
        [
          '液体增量加倍，总压强不一定加倍',
          'Liquid increment doubles; total pressure need not',
        ],
        ['水面气压也自动加倍', 'Surface air pressure automatically doubles'],
      ],
      0,
      '总压强包含不随这次深度变化的水面气压。',
      'Total pressure includes surface air pressure, unchanged in this comparison.',
    ),
  },
  {
    id: 'pressure-atmosphere-difference',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-air',
    minutes: 18,
    title: t('看不见的空气，为什么能推？', 'How can invisible air push?'),
    subtitle: t(
      '同时看外面与里面，不把“吸住”当作新力量。',
      'Look outside and inside together; “suction” is not an extra force.',
    ),
    hook: t(
      '吸盘贴在平滑表面上，看起来像自己“吸”着。空气压强往往两边都存在；挤出一些空气并形成密封后，两边的推力可能不同。',
      'A suction cup seems to “pull” itself onto a smooth surface. Air pressure usually acts on both sides. Removing some air and forming a seal can leave unequal pushes.',
    ),
    prediction: t(
      '两侧都101 kPa、面积10 cm²的理想平面活塞，空气产生的向内合力？',
      'An ideal flat piston has 101 kPa on both sides and area 10 cm². What is the net inward air force?',
    ),
    predictions: [
      t('0 N，两侧推力相抵', '0 N: opposing pushes balance'),
      t('101 N，只看外侧', '101 N: count only outside'),
      t('空气没有任何作用力', 'Air exerts no force at all'),
    ],
    explore: t(
      '外压固定101 kPa，内压依次101、81、61 kPa，面积10 cm²。完整检查三组，比较两支相反箭头和合力。再调整面积：相同压差下，面积更大为何合力更大？',
      'Keep outside at 101 kPa and area at 10 cm². Inspect inside pressures 101, 81 and 61 kPa. Compare opposing arrows and net force. Then change area: why does the same pressure difference give a larger net force over more area?',
    ),
    concept: t(
      '大气是有重量的气体；这里用近海平面的101 kPa作为规定外压，实际会随高度、天气改变。气体向各方向产生压力。平面两侧受到相反方向的压力作用，净效果由压差乘面积决定；内部低压不是神秘拉力，而是向外的推力较小。',
      'The atmosphere is a gas with weight. We prescribe 101 kPa outside, a near-sea-level approximation; actual pressure varies with height and weather. Gas pushes in all directions. Opposing pressure forces on a flat face give net force from pressure difference times area. Low pressure inside is a smaller outward push, not a mysterious extra pull.',
    ),
    example: t(
      '10 cm²=0.001 m²。外侧101000×0.001=101 N；内侧81 kPa时是81 N向外，所以向内合力20 N。内侧61 kPa时向内合力40 N；同压时两侧各101 N，合力为0。',
      '10 cm² = 0.001 m². Outside gives 101000×0.001 = 101 N inward. At 81 kPa inside, 81 N pushes outward, leaving 20 N inward. At 61 kPa, the net is 40 N. Equal pressures give 101 N each and zero net.',
    ),
    misconception: t(
      '合力为0不代表两边都没有力。也不能用101 kPa乘整个身体面积就声称人必定被压扁：身体内外有压力和组织支持。本图是无摩擦平面活塞，不预测吸盘能挂多重。',
      'Zero net force does not mean no forces. Nor does multiplying atmospheric pressure by body area prove we must be crushed: internal pressures and tissues also support us. This is a frictionless flat-piston model, not a suction-cup load rating.',
    ),
    realWorld: t(
      '吸盘、密封包装和气压变化都能提醒我们比较两侧。吸盘漏气后内外趋于同压，固定效果就可能变差；表面和密封情况同样重要。',
      'Suction cups, sealed packaging and pressure changes invite a two-sided comparison. Leaks can bring pressures closer and weaken attachment; surface condition and sealing matter too.',
    ),
    summary: t(
      '空气两侧都在推，净效果要看压差与面积。',
      'Air pushes on both sides; the net effect depends on pressure difference and area.',
    ),
    homeExperiment: t(
      '用普通小吸盘在平滑干净表面轻贴，再轻抬边缘让空气进入，比较感受。不挂重物、不靠近易碎物；写“观察”和“压差解释”，不要当作精确测力。',
      'Gently attach a small ordinary suction cup to a clean smooth surface, then lift its edge slightly to let air enter. Compare and separate observation from a pressure explanation. Use no heavy loads or fragile objects; this is not a calibrated force measurement.',
    ),
    vocabulary: [
      t('大气压', 'atmospheric pressure'),
      t('压差', 'pressure difference'),
      t('密封', 'seal'),
      t('合力', 'net force'),
    ],
    formula: t(
      '理想平面向内合力=(p外−p内)A。',
      'Ideal net inward force = (p_out−p_in)A.',
    ),
    questions: [
      q(
        '外压101、内压81 kPa，面积10 cm²，向内合力？',
        'Outside 101, inside 81 kPa; area 10 cm². Net inward force?',
        [
          ['101 N', '101 N'],
          ['20 N', '20 N'],
        ],
        1,
        '(101000−81000)×0.001=20 N。',
        '(101000−81000)×0.001 = 20 N.',
      ),
      q(
        '同压两侧，正确描述？',
        'Equal pressure on both sides: which description?',
        [
          ['两侧可能都有力，互相抵消', 'Both may exert forces that balance'],
          ['空气不再碰壁', 'Air stops interacting with walls'],
        ],
        0,
        '这里各有101 N相反推力。',
        'Here each side exerts 101 N in opposite directions.',
      ),
      q(
        '同一压差下，面积加倍？',
        'Same pressure difference, twice the area?',
        [
          ['合力加倍', 'Net force doubles'],
          ['合力减半', 'Net force halves'],
        ],
        0,
        '合力=压差×面积，不是压差÷面积。',
        'Net force is difference times area, not difference divided by area.',
      ),
    ],
    exit: q(
      '吸盘边缘漏气，内外压强逐渐接近，怎样解释？',
      'Air leaks through a suction-cup edge and the pressures approach equality. Explain.',
      [
        ['神秘吸力更强', 'A mysterious suction force grows'],
        [
          '压差减小，理想压强贡献的合力减小',
          'The pressure difference and its ideal net-force contribution decrease',
        ],
      ],
      1,
      '固定效果还有材料、摩擦和密封因素。',
      'Material, friction and the seal also affect attachment.',
    ),
  },
  {
    id: 'pressure-drinking-straw',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-straw',
    minutes: 18,
    title: t('吸管里，是谁把水送上来？', 'Who pushes water up a straw?'),
    subtitle: t(
      '嘴让管口压强降低，杯面上的空气还在推。',
      'Lower pressure at the top; air still pushes on the cup surface.',
    ),
    hook: t(
      '吸管没有小水泵，水却能向上。试着想象一杯水上方的空气与吸管上方的空气各在做什么：不是“吸”这个字本身把水抬起来。',
      'A straw has no little water pump, yet water rises. Think about air over the cup and at the straw top. The word “suck” is not itself a lifting mechanism.',
    ),
    prediction: t(
      '杯面与吸管上方同为101 kPa，静止理想水柱能靠这次压差升到杯面以上吗？',
      'Cup surface and straw top are both 101 kPa. Can this pressure difference support a stationary ideal water column above the cup surface?',
    ),
    predictions: [
      t('不能，压差为0', 'No: the difference is zero'),
      t('能，吸管越细一定越高', 'Yes: thinner always makes it rise'),
      t('能，杯子自动拉水', 'Yes: the cup pulls it up'),
    ],
    explore: t(
      '比较通气杯101/99 kPa、没有降低管口101/101、密封杯后续99/99三组。记录理想水柱相对杯面高度。第三组是密封后杯面气压已经降低的状态，不是说密封杯第一瞬间绝对不出水。',
      'Compare vented 101/99 kPa, unchanged-top 101/101 and later sealed-cup 99/99 cases. Record ideal height above the cup surface. The third is a later state after headspace pressure has fallen, not a claim that a sealed cup can never initially release water.',
    ),
    concept: t(
      '降低管口气压后，杯面上较高的气压推动水，水柱上升。静止理想柱满足p杯面−p管口=ρgh；h从杯面量到管内液面。通气杯能补进空气。密封杯出水后，剩余空气的体积可增大、压强降低，使驱动压差变小。',
      'Lowering the top pressure lets higher pressure over the cup push water up. A stationary ideal column satisfies p_surface−p_top=ρgh, with h above the cup surface. A vent allows replacement air. In a sealed cup, departing water can expand the trapped headspace and lower its pressure, reducing the driving difference.',
    ),
    example: t(
      '规定杯面101 kPa、管口99 kPa，压差2000 Pa，水ρ=1000、g=10，理想平衡高度2000÷10000=0.20 m=20 cm。同压两组的高度均为0。真实饮水时水在流，还要考虑阻力，这不是人的吸力能力测试。',
      'With prescribed surface 101 kPa and top 99 kPa, the difference is 2000 Pa. For water density 1000 and g=10, ideal equilibrium height is 0.20 m = 20 cm. Equal-pressure cases give zero. Drinking involves flow and resistance; this is not a test of personal suction ability.',
    ),
    misconception: t(
      '“嘴直接用一只看不见的手拉水”忽略杯面压强。模型不算毛细作用、流速或实际最大饮水高度。水柱为静止平衡比较，绿色点只依次检查两端和结果，不是水粒子的运动。',
      'An invisible hand at the mouth is not the mechanism; surface pressure matters. The model omits capillarity, flow rate and real drinking limits. Columns represent stationary balances. The green marker checks pressures and the result in order; it is not a water particle.',
    ),
    realWorld: t(
      '许多饮料杯盖留有小通气孔；孔堵住时出水可能不顺。请先看杯盖设计，不把所有杯子的现象归为同一个原因。',
      'Many drink lids have a small vent; a blocked vent can hinder outflow. Inspect the actual design rather than assuming every cup behaves identically.',
    ),
    summary: t(
      '降低管口气压，让杯面较高的气压推动水上升。',
      'Lowering pressure at the straw top lets higher surface pressure push water upward.',
    ),
    homeExperiment: t(
      '在杯中放干净吸管，正常轻轻喝一小口；观察杯盖有没有通气孔。只做普通饮水，不用长管挑战高度，也不吸非饮用液体。画杯面、管口和水柱，标出两端压强谁大。',
      'Use a clean straw for an ordinary gentle sip of drinking water and inspect any lid vent. Use no long-tube height challenge or non-drinking liquids. Sketch surface, top and column, identifying the higher-pressure side.',
    ),
    vocabulary: [
      t('水柱', 'water column'),
      t('通气孔', 'vent'),
      t('杯面压强', 'surface pressure'),
      t('静止平衡', 'static equilibrium'),
    ],
    formula: t(
      '理想静止水柱：p杯面−p管口=ρgh。',
      'Ideal stationary column: p_surface−p_top=ρgh.',
    ),
    questions: [
      q(
        '让水上升的关键比较？',
        'Which comparison helps explain rising water?',
        [
          ['杯面与管口的压强', 'Surface versus top pressure'],
          ['吸管颜色', 'Straw colour'],
        ],
        0,
        '两端压差能支持水柱。',
        'The pressure difference can support a column.',
      ),
      q(
        '模型压差2 kPa支持水柱多高？',
        'How high a model water column does 2 kPa support?',
        [
          ['20 cm', '20 cm'],
          ['2 cm', '2 cm'],
        ],
        0,
        '2000÷(1000×10)=0.20 m。',
        '2000/(1000×10) = 0.20 m.',
      ),
      q(
        '密封杯为什么可能越喝越难出水？',
        'Why can outflow become harder in a sealed cup?',
        [
          ['剩余空气压强可能下降', 'Headspace pressure can fall'],
          ['空气重量完全消失', 'All air weight disappears'],
        ],
        0,
        '若不能补气，出水可让头部空气膨胀，驱动压差减小。',
        'Without replacement air, headspace can expand and the driving difference can decrease.',
      ),
    ],
    exit: q(
      '管口保持99 kPa，杯面也降到99 kPa，理想柱怎样？',
      'Top stays 99 kPa while surface falls to 99 kPa. What happens to the ideal column?',
      [
        ['仍靠这次压差保持20 cm', 'This difference still supports 20 cm'],
        [
          '这次压差不能支持杯面以上的水柱',
          'This difference cannot support a column above the surface',
        ],
      ],
      1,
      '两端同压，ρgh=0；真实系统还可能有其他作用。',
      'Equal pressures give ρgh=0; a real system may have other effects.',
    ),
  },
  {
    id: 'pressure-syringe-trapped-air',
    stage: 3,
    unit: 'pressure',
    kind: 'pressure-syringe',
    minutes: 19,
    title: t(
      '封住管口，活塞为什么更难推？',
      'Why is a sealed syringe harder to push?',
    ),
    subtitle: t(
      '一小团空气没走，体积变了，压力怎样变？',
      'The trapped air stays. How does its pressure change with volume?',
    ),
    hook: t(
      '一支没有针的空塑料注射器，管口敞开时活塞能排出空气；管口密封后，轻推会感到抵抗。关键是空气能不能离开，以及内外压强怎样不同。',
      'A needle-free empty plastic syringe can expel air when open. Seal it and a gentle push meets resistance. Ask whether air can leave and how inside and outside pressures differ.',
    ),
    prediction: t(
      '同一团空气缓慢压缩、温度不变，20 mL变成10 mL，绝对压强怎样变？',
      'Compress the same trapped air slowly at constant temperature from 20 to 10 mL. What happens to absolute pressure?',
    ),
    predictions: [
      t('加倍', 'Doubles'),
      t('减半', 'Halves'),
      t('因为有活塞，所以一直不变', 'Stays fixed because a piston exists'),
    ],
    explore: t(
      '完整检查密封20、10、5 mL三组，温度与气体量固定。再打开通气：同样体积下内压接近外压，理想保压推力如何改变？自由体积和通气状态只供探索，不替代三组密封比较。',
      'Inspect sealed 20, 10 and 5 mL at fixed temperature and gas amount. Then open the vent: at the same volume, inside approaches outside pressure. How does ideal holding force change? Free volumes and vented cases do not replace the three sealed comparisons.',
    ),
    concept: t(
      '气体可以压缩。对固定气体量、近似理想且温度不变的缓慢压缩，体积减小时绝对压强升高，pV保持不变。活塞一面受内部气体向外推，另一面受外部大气向内推；保持位置的额外推力只需平衡压差乘活塞面积。',
      'Gas is compressible. For fixed gas amount in a slow, approximately ideal, constant-temperature compression, reducing volume raises absolute pressure and keeps pV constant. Inside gas pushes the piston outward; outside air pushes inward. The extra holding force balances the pressure difference times piston area.',
    ),
    example: t(
      '初始20 mL、101 kPa，10 mL时202 kPa，5 mL时404 kPa。活塞面积2 cm²=0.0002 m²；10 mL时需要理想额外推力(202000−101000)×0.0002=20.2 N，5 mL时60.6 N。模型不计密封摩擦。',
      'Starting at 20 mL and 101 kPa, 10 mL gives 202 kPa and 5 mL gives 404 kPa. Piston area is 2 cm² = 0.0002 m². At 10 mL the ideal extra holding force is (202000−101000)×0.0002 = 20.2 N; at 5 mL it is 60.6 N. Seal friction is omitted.',
    ),
    misconception: t(
      'pV关系用绝对压强，不能拿相对大气的压差去代替p。快速压缩还会改变温度，真实活塞有摩擦；液体通常比气体难压缩，不能把这条气体模型直接套到装满水的注射器。',
      'pV uses absolute pressure, not pressure relative to the atmosphere. Fast compression can change temperature and real pistons have friction. Liquids are much less compressible; this gas model cannot simply be applied to a water-filled syringe.',
    ),
    realWorld: t(
      '打气筒先压缩空气，气压足够时再通过阀门送入轮胎；真实阀门、漏气、摩擦与温度都影响推力。本模型是一段密封或通气的空气，不是整个打气筒流程。',
      'A pump compresses air before a valve lets it enter a tyre. Valves, leaks, friction and temperature affect the real force. This models trapped or vented air, not a complete pump cycle.',
    ),
    summary: t(
      '同一团空气在恒温下体积更小，绝对压强更大；保压推力看内外压差。',
      'The same air at constant temperature has higher absolute pressure in less volume; holding force depends on the pressure difference.',
    ),
    homeExperiment: t(
      '可以只观察动画。若有家人陪同，用无针、空的塑料注射器，先敞开管口轻推，再轻封管口只推一点，有阻力就停。不要装液体或用针，不对着人；比较感觉不能当作精确测力。',
      'The animation is sufficient. With a helper and an empty needle-free plastic syringe, gently push with the outlet open, then lightly seal it and push only a little, stopping at resistance. Use no needles or liquid, and point away from people. Feel is not a calibrated force measurement.',
    ),
    vocabulary: [
      t('可压缩', 'compressible'),
      t('活塞', 'piston'),
      t('绝对压强', 'absolute pressure'),
      t('恒温', 'constant temperature'),
    ],
    formula: t(
      '固定气体量、恒温：p₁V₁=p₂V₂；保压推力=(p内−p外)A。',
      'Fixed gas amount, constant temperature: p₁V₁=p₂V₂; holding force=(p_in−p_out)A.',
    ),
    questions: [
      q(
        '密封20 mL、101 kPa，恒温压到10 mL，绝对压强？',
        'Sealed 20 mL at 101 kPa, compressed isothermally to 10 mL: absolute pressure?',
        [
          ['202 kPa', '202 kPa'],
          ['50.5 kPa', '50.5 kPa'],
        ],
        0,
        '体积减半，同一气体的恒温绝对压强加倍。',
        'Half the volume doubles absolute pressure for the same gas at constant temperature.',
      ),
      q(
        'pV中的p是哪一个？',
        'Which pressure goes into pV?',
        [
          ['绝对压强', 'Absolute pressure'],
          ['内外压差', 'Inside–outside difference'],
        ],
        0,
        '初始相对大气的压差为0，但绝对压强不是0。',
        'The initial difference is zero but absolute pressure is not.',
      ),
      q(
        '通气、内外同压，模型额外保压推力？',
        'Vented, equal inside/outside pressure: ideal extra holding force?',
        [
          ['0 N', '0 N'],
          ['仍必定20.2 N', 'Always 20.2 N'],
        ],
        0,
        '理想压差项为0；真实摩擦可能仍需要推力。',
        'The ideal pressure-difference term is zero; real friction can still require force.',
      ),
    ],
    exit: q(
      '把同样pV关系直接用于装满水的注射器，合适吗？',
      'Can the same pV gas relation be used directly for a water-filled syringe?',
      [
        [
          '不，液体的压缩性质不同',
          'No: liquids have different compressibility',
        ],
        ['合适，只要名字也叫注射器', 'Yes: the name syringe is enough'],
      ],
      0,
      '模型条件看物质与过程，不只看器材外形。',
      'A model depends on the material and process, not just the apparatus name.',
    ),
  },
];
