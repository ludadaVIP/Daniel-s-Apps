import { t, q, type Lesson } from './schema';
export const buoyancyLessons: Lesson[] = [
  {
    id: 'buoyancy-more-than-floating',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-release',
    minutes: 17,
    title: t(
      '有浮力，为什么还会下沉？',
      'With buoyancy, why can an object still sink?',
    ),
    subtitle: t(
      '把水的托力、物体重量与合力分开。',
      'Separate water’s support, weight and net force.',
    ),
    hook: t(
      '石头在水里仍会下沉，但用线提着时可能感觉更轻。水没有停止托它：只是向上的力不一定赢过向下的重量。',
      'A stone sinks in water but may feel easier to hold on a string. Water still supports it; that upward force need not exceed its downward weight.',
    ),
    prediction: t(
      '三个物体都排开200 mL淡水，重量分别1.2、2、3 N。刚静止释放时，哪个向下的合力最大？',
      'Three bodies each displace 200 mL of fresh water and weigh 1.2, 2 and 3 N. Just released from rest, which has the greatest downward net force?',
    ),
    predictions: [
      t('3 N物体', 'The 3 N body'),
      t('三者都没有浮力', 'None has buoyancy'),
      t('1.2 N物体', 'The 1.2 N body'),
    ],
    explore: t(
      '完整比较120、200、300 g三个密封刚体：总体积200 cm³，开始都完全浸没、不碰底。浮力都是2 N；比较重量与有方向的合力。再自由改质量，找接近悬浮的条件。',
      'Inspect 120, 200 and 300 g sealed rigid bodies, all initially fully submerged, volume 200 cm³ and clear of the bottom. Buoyancy stays 2 N. Compare weight and directed net force, then adjust mass freely to find neutral support.',
    ),
    concept: t(
      '浮力是流体对物体的净向上压力作用。刚释放时若浮力大于重量，合力向上；较小则向下；相等且初始静止，在这个理想模型中可以悬浮。三者都有浮力。轻物体升到水面后，浸水体积减小，最后漂浮时浮力与重量相等。',
      'Buoyancy is the net upward pressure force from a fluid. On release, buoyancy greater than weight gives an upward net force; less gives a downward one. Equal forces and an initially stationary body allow neutral suspension in this model. All three have buoyancy. As a light body reaches the surface, less volume is submerged; at floating equilibrium buoyancy equals weight.',
    ),
    example: t(
      '取g≈10 N/kg，120 g重1.2 N，完全浸水浮力2 N，初始合力向上0.8 N；200 g两力都是2 N；300 g重3 N，合力向下1 N。120 g物体最终只需排开120 mL水，不会一直保持2 N浮力。',
      'With g≈10 N/kg, 120 g weighs 1.2 N: fully submerged buoyancy 2 N gives 0.8 N net upward. At 200 g both forces are 2 N. At 300 g, weight 3 N gives 1 N net downward. The 120 g body eventually needs only 120 mL displacement, rather than keeping 2 N buoyancy forever.',
    ),
    misconception: t(
      '“下沉就没有浮力”不对；“浮着时浮力一直大于重量”也不对。本图显示静止释放的初始受力，不计算速度、下沉时间、碰底支持力或水面波动。零合力也不能让已经运动的物体立即停下。',
      'Sinking does not mean no buoyancy; steady floating does not require buoyancy always greater than weight. This shows initial forces on release, not speed, sinking time, bottom support or waves. Zero net force also does not instantly stop a moving body.',
    ),
    realWorld: t(
      '救生浮具靠增加能排水的密封体积提供支持；石头和船都受到水的浮力。是否能支撑整个系统，要比较包含载荷在内的总重量，不能用教学图判断真实浮具性能。',
      'Buoyancy aids provide support through added water-excluding volume. Stones and ships both receive buoyancy. Supporting a whole system requires comparing total weight including its load; a teaching diagram is not a rating of real equipment.',
    ),
    summary: t(
      '是否上升或下沉，要比较浮力与重量，而不是只问有没有浮力。',
      'Compare buoyancy with weight to explain rising or sinking; merely having buoyancy is not enough.',
    ),
    homeExperiment: t(
      '在浅水盆观察一块木片与一颗小石头，不用身体下水。画两者向上、向下的力；把“看到下沉”与“推断浮力小于重量”分开写。',
      'Observe a small wood piece and stone in a shallow basin, without entering the water. Draw upward and downward forces. Separate seeing the stone sink from inferring that buoyancy is smaller than weight.',
    ),
    formula: t(
      '初始向上合力=浮力−重量；漂浮平衡时浮力=重量。',
      'Initial net upward force = buoyancy − weight; at floating equilibrium buoyancy = weight.',
    ),
    vocabulary: [
      t('浮力', 'buoyancy'),
      t('悬浮', 'neutral suspension'),
      t('重量', 'weight'),
      t('合力', 'net force'),
    ],
    questions: [
      q(
        '物体在水中下沉，说明？',
        'A body sinks in water. What follows?',
        [
          [
            '浮力可能小于重量，但仍存在',
            'Buoyancy may be less than weight, while still present',
          ],
          ['浮力一定为零', 'Buoyancy must be zero'],
        ],
        0,
        '向下合力不要求向上作用消失。',
        'A downward net force does not require the upward force to vanish.',
      ),
      q(
        '浮力2 N、重量3 N，初始合力？',
        'Buoyancy 2 N, weight 3 N: initial net force?',
        [
          ['向下1 N', '1 N downward'],
          ['向上5 N', '5 N upward'],
        ],
        0,
        '相反方向要相减，并标方向。',
        'Subtract opposing forces and state the direction.',
      ),
      q(
        '120 g物体已经稳定漂浮，浮力？',
        'The 120 g body is now steadily floating. Its buoyancy?',
        [
          ['1.2 N', '1.2 N'],
          ['仍是完全浸水时的2 N', 'Still the fully submerged 2 N'],
        ],
        0,
        '浸水体积改变，最终浮力平衡1.2 N重量。',
        'Submerged volume changes until buoyancy balances the 1.2 N weight.',
      ),
    ],
    exit: q(
      '稳定漂浮的木块受到哪些竖直力？',
      'Which vertical forces act on a steadily floating block?',
      [
        ['只有向上的浮力', 'Only upward buoyancy'],
        ['向上浮力与向下重量平衡', 'Upward buoyancy balances downward weight'],
      ],
      1,
      '忽略其他小作用时，两力平衡，不是重量消失。',
      'Ignoring other small effects, the forces balance; weight has not vanished.',
    ),
  },
  {
    id: 'buoyancy-pressure-from-below',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-pressure',
    minutes: 19,
    title: t(
      '水为什么从下面托得更多？',
      'Why does water push more from below?',
    ),
    subtitle: t(
      '把上一单元的压强差，变成一个向上的力。',
      'Turn a pressure difference into an upward force.',
    ),
    hook: t(
      '水会从上、下、侧面推物体。若每一面都在推，为什么还会出现净向上的浮力？关键藏在上下表面的深度差里。',
      'Water pushes on the top, bottom and sides. If every face is pushed, why is there a net upward force? Look at the depth difference between top and bottom.',
    ),
    prediction: t(
      '同种静止水中，上下水平面面积相等，下表面更深。哪面的压力作用更大？',
      'In the same stationary water, equal horizontal top and bottom faces are at different depths. Which pressure force is greater?',
    ),
    predictions: [
      t('下表面向上的力', 'Upward force on the bottom'),
      t('上表面向下的力', 'Downward force on the top'),
      t('只有物体上浮时才有压力', 'Pressure exists only while rising'),
    ],
    explore: t(
      '完整检查上表面水深0.10、0.30 m的两组水，以及0.10 m处较密液体。两面面积都10 cm²，高差0.10 m。对比向下与向上压力作用的差，再改深度。',
      'Inspect water with top depth 0.10 and 0.30 m, then a denser liquid with top depth 0.10 m. Both faces are 10 cm² and their height difference is 0.10 m. Compare the opposing pressure forces, then change top depth.',
    ),
    concept: t(
      '液体压强随深度增加。上下同面积时，下表面向上的压力作用更大；侧面同深度的相反压力作用成对抵消。上下差值就是这个刚体所受浮力。把同一个刚体完全浸在均匀液体更深处，上下压力都增大，但深度差没变，浮力不随整体深度增大。',
      'Pressure increases with depth. With equal top and bottom areas, the bottom pressure force is greater. Opposite side forces at matched depths cancel. The top–bottom difference gives buoyancy here. Lowering the same fully submerged rigid body in a uniform liquid raises both face pressures, while the unchanged height difference keeps buoyancy unchanged.',
    ),
    example: t(
      '水面101 kPa，取ρ=1000、g=10。深度0.10/0.20 m总压强102/103 kPa，10 cm²上得到102 N向下、103 N向上，浮力1 N。改为0.30/0.40 m，是104/105 N，仍差1 N；ρ=1200时差1.2 N。',
      'With surface 101 kPa, water density 1000 and g=10, depths 0.10/0.20 m have absolute pressures 102/103 kPa. Over 10 cm² that is 102 N down and 103 N up, leaving 1 N buoyancy. At 0.30/0.40 m, 104/105 N still differ by 1 N. At density 1200, the difference is 1.2 N.',
    ),
    misconception: t(
      '这里“浮力不随整体深度变”需要完全浸没、刚体体积与液体密度不变。可压缩气球或部分浸水物体不满足这个比较。图中净压力作用不包含重量、提线或碰底力，不能直接当作物体总合力。',
      'Depth independence here requires full immersion, rigid unchanged volume and uniform liquid density. A compressible balloon or partly submerged body is a different comparison. The net pressure force shown excludes weight, a holding string and bottom contact; it is not the total force on the body.',
    ),
    realWorld: t(
      '把排水体积近似不变的金属物浸得更深，不会仅因深度变大就自动获得更大的浮力。潜水时空气囊会压缩，变化的是体积，下一步要重新比较排水。',
      'A metal object with unchanged displacement does not automatically gain buoyancy just from being deeper. An air pocket can compress during a dive; its changed volume requires a new displacement comparison.',
    ),
    summary: t(
      '下方压强更大，上下压力作用之差给出浮力；浮力不是额外添加的第三股水力。',
      'Greater bottom pressure gives buoyancy from the force difference; buoyancy is not an extra third water force.',
    ),
    homeExperiment: t(
      '在纸上画水面和一个完全浸水长方体，标出上下深度与两支相反箭头。把整个长方体下移，再看哪些量一起增加、哪个差值保持。',
      'Draw a surface and a fully submerged rectangular body, label both depths and opposing arrows. Move the entire body lower on paper and identify what increases together and which difference stays fixed.',
    ),
    formula: t(
      '浮力=(p下−p上)A=ρgΔhA；这里ΔhA是排水体积。',
      'Buoyancy=(p_bottom−p_top)A=ρgΔhA; here ΔhA is displaced volume.',
    ),
    vocabulary: [
      t('下表面', 'bottom face'),
      t('压力作用', 'pressure force'),
      t('完全浸没', 'fully submerged'),
      t('刚体', 'rigid body'),
    ],
    questions: [
      q(
        '上下压力作用103 N向上、102 N向下，水的净作用？',
        'Water pushes 103 N up and 102 N down. Its net force?',
        [
          ['1 N向上', '1 N upward'],
          ['205 N向上', '205 N upward'],
        ],
        0,
        '两支相反力的差是浮力。',
        'Their opposing-force difference is buoyancy.',
      ),
      q(
        '同一完全浸没刚体下移，均匀水中浮力？',
        'Lower the same fully submerged rigid body in uniform water. Buoyancy?',
        [
          ['不变', 'Unchanged'],
          ['每下移一点就必定加倍', 'Must double with every downward move'],
        ],
        0,
        '上下深度差、面积和密度都不变。',
        'Height difference, area and density stay fixed.',
      ),
      q(
        '图中1 N浮力就是物体总合力吗？',
        'Is the plotted 1 N buoyancy the body’s total net force?',
        [
          [
            '不是，还要计重量与其他外力',
            'No: include weight and other external forces',
          ],
          ['是，重量可以忽略不计', 'Yes: weight can always be omitted'],
        ],
        0,
        '先明确正在合成的是水的压力作用。',
        'We are combining water pressure forces here.',
      ),
    ],
    exit: q(
      '柔软气囊变深时被压小，能套用“深度变化浮力不变”吗？',
      'A soft air pocket shrinks at greater depth. Can the unchanged-buoyancy claim be applied?',
      [
        ['不能，排水体积也变了', 'No: displaced volume changes too'],
        ['可以，只要都在水里', 'Yes: being underwater is enough'],
      ],
      0,
      '模型条件包括刚性与固定体积。',
      'The comparison requires rigid, fixed volume.',
    ),
  },
  {
    id: 'buoyancy-displaced-water',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-displacement',
    minutes: 17,
    title: t(
      '水位升高，究竟量到哪一部分？',
      'Which part does a rising water level measure?',
    ),
    subtitle: t(
      '同一个物体，露在水外的部分不算排水。',
      'The part above water does not displace water.',
    ),
    hook: t(
      '把积木慢慢放入带刻度的水容器，水位升高。读数变化不是看到物体“很大”就自动出现，而是水中的空间被占走了多少。',
      'Lower a block slowly into a graduated vessel and the reading rises. The change measures occupied underwater space, rather than simply how large the object looks.',
    ),
    prediction: t(
      '一个100 cm³物体只有一半体积浸水，排开的水体积是多少？',
      'Half the volume of a 100 cm³ body is immersed. How much water does it displace?',
    ),
    predictions: [
      t('50 mL', '50 mL'),
      t('100 mL', '100 mL'),
      t('只有漂浮才会排水', 'Only floating objects displace water'),
    ],
    explore: t(
      '对比0%、50%、100%体积浸入。容器原读数150 mL，物体体积100 cm³。完整播放外力缓慢放入的过程，保留终点读数；再用浸水比例滑杆自由检查中间状态。',
      'Compare 0%, 50% and 100% volume immersion. The vessel starts at 150 mL; body volume is 100 cm³. Play each controlled lowering completely and retain its endpoint, then explore intermediate immersion fractions with the slider.',
    ),
    concept: t(
      '没有漏水、溢出或额外气泡时，液面读数增加量等于物体浸在水中的排水体积。完全浸没才等于整个物体体积。这里用外力控制刚体位置，不能从位置图直接断言它自然会浮还是沉。体积变化读mL，浮力另用排水质量与重力估算。',
      'Without leaks, spills or extra bubbles, the reading increase equals underwater displaced volume. It equals whole-body volume only at full immersion. An external force controls this rigid body’s position; the position alone does not establish its free floating or sinking behaviour. Volume is read in mL; buoyancy follows from displaced mass and gravity.',
    ),
    example: t(
      '0%、50%、100%浸入时，读数150、200、250 mL，增加0、50、100 mL。1 mL=1 cm³。淡水密度1000 kg/m³、g≈10时，对应浮力0、0.5、1 N，未把100 mL直接写成100 N。',
      'At 0%, 50% and 100% immersion, readings are 150, 200 and 250 mL: increases 0, 50 and 100 mL. 1 mL=1 cm³. With fresh water density 1000 kg/m³ and g≈10, buoyancy is 0, 0.5 and 1 N; 100 mL is not 100 N.',
    ),
    misconception: t(
      '漂浮物也排水，但露出水面的体积不计。手、夹子或气泡一起浸入也会影响水位；溢出的水不能仍当作留在量杯里。本模型无波浪、不碰底，动画时长不代表真实放入时间。',
      'Floating bodies displace water too, while their above-water volume does not count. A hand, clamp or bubbles can affect the reading. Spilled water is not still in the measuring vessel. This model omits waves and bottom contact; playback duration is not a real lowering time.',
    ),
    realWorld: t(
      '为不规则小物找体积时，排水很有用；研究船时却要看实际浸水体积，不能把整艘船的外形体积都算作已经排开的水。',
      'Displacement helps measure irregular small objects. For a ship, use its actual underwater volume rather than assuming its entire outer volume is already displacing water.',
    ),
    summary: t(
      '排水体积看浸在水中的部分；完全浸没才等于总体积。',
      'Displaced volume is the underwater part; it equals total volume only at full immersion.',
    ),
    homeExperiment: t(
      '用带刻度透明容器和一件密封小物，记录前后读数。用细线控制位置，避免手一起入水；记下气泡、碰壁与读数限制。没有刻度时只观察并画图，不编造精确mL。',
      'Use a clear graduated vessel and a small sealed object to record before/after readings. Control position with a thin string rather than putting a hand in too. Note bubbles, wall contact and reading limits. Without graduations, observe and sketch instead of inventing precise mL.',
    ),
    vocabulary: [
      t('排水体积', 'displaced volume'),
      t('浸水比例', 'immersed fraction'),
      t('液面读数', 'level reading'),
      t('溢出', 'spill'),
    ],
    formula: t(
      '排水体积=放入后读数−原读数；1 mL=1 cm³。',
      'Displaced volume=after reading−before reading; 1 mL=1 cm³.',
    ),
    questions: [
      q(
        '150 mL变成200 mL，排水多少？',
        '150 mL becomes 200 mL. Displacement?',
        [
          ['50 mL', '50 mL'],
          ['350 mL', '350 mL'],
        ],
        0,
        '比较前后差值。',
        'Use the difference, not the sum.',
      ),
      q(
        '物体一半在水外，排水等于整个体积吗？',
        'Half the body is above water. Does displacement equal its entire volume?',
        [
          ['不等于，只算浸水部分', 'No: only the immersed part'],
          ['总是等于', 'Always'],
        ],
        0,
        '物体上方那一部分没有占走水中的空间。',
        'The above-water part has not occupied underwater space.',
      ),
      q(
        '想只量物体排水，哪个做法更好？',
        'To measure only the object’s displacement, which is better?',
        [
          ['避免手和气泡一起入水', 'Keep hands and extra bubbles out'],
          ['把手也一起浸进去', 'Immerse a hand too'],
        ],
        0,
        '额外占据的体积会混入读数。',
        'Extra occupied volume would be mixed into the reading.',
      ),
    ],
    exit: q(
      '100 cm³物体排开60 mL水，能确定什么？',
      'A 100 cm³ body displaces 60 mL water. What can we establish?',
      [
        [
          '在规定无额外体积条件下，约60%体积浸水',
          'With no extra displaced volume, about 60% is immersed',
        ],
        ['它的总质量必定是60 kg', 'Its total mass must be 60 kg'],
      ],
      0,
      '先读体积关系；是否自由漂浮还需要其他条件。',
      'Read the volume relation first; free floating requires further conditions.',
    ),
  },
  {
    id: 'buoyancy-weight-of-displaced-fluid',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-archimedes',
    minutes: 20,
    title: t(
      '排开的水，能告诉我们托力吗？',
      'Can displaced water tell us the supporting force?',
    ),
    subtitle: t(
      '一杯排开的水，连接体积、质量与重量。',
      'Connect displaced volume, mass and weight.',
    ),
    hook: t(
      '用测力计提着物体慢慢浸水，示数会减小。失去的是物体质量吗？把排开的水当成另一份证据，能算出水帮忙承担了多少力。',
      'Hold a body on a force meter and immerse it slowly. The reading decreases. Has the body lost mass? Displaced water provides another way to account for the support supplied by the liquid.',
    ),
    prediction: t(
      '排开100 mL淡水，水的质量约100 g。取g≈10 N/kg，浮力是多少？',
      'Displace 100 mL fresh water, about 100 g. With g≈10 N/kg, what is buoyancy?',
    ),
    predictions: [
      t('1 N', '1 N'),
      t('100 N', '100 N'),
      t('只能凭手感，不能估算', 'It can only be felt, never estimated'),
    ],
    explore: t(
      '比较300 g物体排开100、200 mL淡水，以及100 mL较密液体。都由竖直提线保持、完全浸没且不碰底；100/200 mL是两个不同外部体积的同质量规定物体。保留排水质量、浮力与测力计示数。',
      'Compare prescribed 300 g bodies displacing 100 or 200 mL fresh water, then 100 mL denser liquid. A vertical string holds each fully submerged and clear of the bottom. The 100/200 mL cases are equal-mass bodies with different external volumes. Retain displaced mass, buoyancy and force-meter readings.',
    ),
    concept: t(
      '阿基米德原理：流体的浮力等于排开流体的重量，不是物体自身重量，也不是排开流体的体积数字。先用流体密度乘排水体积得到排水质量，再乘g得到力。竖直静止提着时，测力计拉力加浮力共同平衡物体重量。',
      'Archimedes’ principle equates buoyancy to displaced fluid’s weight, rather than automatically to the body’s own weight or its volume number. Density times displaced volume gives displaced mass; multiply by g for force. At rest on a vertical string, tension plus buoyancy balances body weight.',
    ),
    example: t(
      '300 g物体重量3 N。100 mL淡水重1 N，测力计2 N；200 mL淡水重2 N，示数1 N；密度1200 kg/m³的100 mL液体质量120 g、重量1.2 N，示数1.8 N。物体质量始终300 g。',
      'The 300 g body weighs 3 N. 100 mL fresh water weighs 1 N, leaving a 2 N meter reading. 200 mL weighs 2 N, leaving 1 N. At density 1200 kg/m³, 100 mL liquid has mass 120 g and weight 1.2 N, leaving 1.8 N. Body mass stays 300 g.',
    ),
    misconception: t(
      '“在水里变轻”常指提线所需力变小，不表示质量消失。浮力等于排水重量，需要按同一流体、实际浸水体积算；不能把空气密度或物体密度代入水的ρ。提线斜着、有运动或碰底时，示数关系还要重新分析。',
      '“Lighter in water” often means less holding force, not disappearing mass. Use the actual displaced volume and density of that fluid, rather than object density or air density for water. An angled string, motion or bottom contact changes the force-meter analysis.',
    ),
    realWorld: t(
      '测力计在空气与水中的示数差，可以帮助探查排水量。先记录是否完全浸没、气泡和接触条件，才把公式用到自己的测量上。',
      'The difference between air and water force-meter readings can reveal displacement. Record full immersion, bubbles and contact conditions before applying the equation to your measurements.',
    ),
    summary: t(
      '浮力=排开流体的重量；测力计少读的力，由流体承担。',
      'Buoyancy equals displaced fluid’s weight; the fluid supplies the reduction in the holding-force reading.',
    ),
    homeExperiment: t(
      '若家里有小测力计，用同一密封小物比较空气与水中示数，保持竖直静止、不碰底。没有仪器就给模型的三组数据画“拉力+浮力=重量”账本，不把手感写成精确N。',
      'If a small force meter is available, compare the same sealed object in air and water, held vertically at rest and clear of the bottom. Otherwise draw the three model force ledgers; do not turn feel into precise newtons.',
    ),
    formula: t(
      'F浮=ρ流体gV排；静止竖直提线：T+F浮=mg。',
      'F_b=ρ_fluid g V_displaced; at rest on a vertical string: T+F_b=mg.',
    ),
    vocabulary: [
      t('阿基米德原理', 'Archimedes’ principle'),
      t('排水重量', 'displaced-fluid weight'),
      t('拉力', 'tension'),
      t('测力计', 'force meter'),
    ],
    questions: [
      q(
        '公式中的密度是？',
        'Which density is used in buoyancy?',
        [
          ['被排开的流体密度', 'The displaced fluid’s density'],
          ['物体材料密度', 'The object material’s density'],
        ],
        0,
        '浮力由排开哪种流体、排开多少决定。',
        'It depends on which fluid and how much is displaced.',
      ),
      q(
        '3 N物体静止悬挂，浮力1 N，提线拉力？',
        'A 3 N body hangs at rest, with 1 N buoyancy. Tension?',
        [
          ['2 N', '2 N'],
          ['4 N', '4 N'],
        ],
        0,
        'T+1=3，因此T=2 N。',
        'T+1=3, so T=2 N.',
      ),
      q(
        '入水后示数减小，300 g物体质量？',
        'The reading falls on immersion. Mass of the 300 g body?',
        [
          ['仍是300 g', 'Still 300 g'],
          ['自动减少到200 g', 'Automatically falls to 200 g'],
        ],
        0,
        '支持力分配变了，不是物质消失。',
        'The support is shared differently; matter has not vanished.',
      ),
    ],
    exit: q(
      '同样排开100 mL，较密液体的浮力为什么较大？',
      'At the same 100 mL displacement, why does a denser liquid give greater buoyancy?',
      [
        [
          '这份流体质量、重量更大',
          'That displaced fluid has more mass and weight',
        ],
        ['物体自己突然变大了', 'The body suddenly grew'],
      ],
      0,
      '体积一样，但ρV不同。',
      'The volume is matched, while ρV changes.',
    ),
  },
  {
    id: 'buoyancy-sealed-hull-and-cargo',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-ship',
    minutes: 19,
    title: t(
      '同样300 g，为什么盒形船体能浮？',
      'Same 300 g: why can a box-shaped hull float?',
    ),
    subtitle: t(
      '增加能排水的体积，再看载荷怎样改变吃水。',
      'Increase water-excluding volume, then follow cargo and draft.',
    ),
    hook: t(
      '一块紧凑材料会沉，做成密封盒形外壳却能装东西浮在水上。不是材料突然没了重量，而是整个系统能排开的水改变了。',
      'A compact object can sink while a sealed box-shaped hull of the same mass can carry things afloat. Weight has not vanished; the whole system can exclude more water.',
    ),
    prediction: t(
      '总质量同为300 g，紧凑物体最大排水120 mL，密封船体最大排水500 mL。哪一个有足够排水能力保持漂浮？',
      'Both weigh 300 g. A compact body can displace at most 120 mL; a sealed hull 500 mL. Which can displace enough water to float?',
    ),
    predictions: [
      t('密封500 mL船体', 'The sealed 500 mL hull'),
      t('两者都因材料重而不能浮', 'Neither: the material is heavy'),
      t('紧凑物体，因为更小', 'The compact body because it is smaller'),
    ],
    explore: t(
      '检查300 g紧凑体、300 g密封盒船与增加350 g货物的同一船体。第一、第三组显示完全浸水刚释放时；轻船显示最终漂浮平衡。再自由改货物，比较实际浮力、重量与最大排水能力。',
      'Inspect the 300 g compact body, 300 g sealed box hull and that hull with 350 g cargo. The compact and overloaded cases show fully submerged release; the light hull shows final floating balance. Adjust cargo and compare actual buoyancy, weight and maximum displacement.',
    ),
    concept: t(
      '漂浮时排水重量等于系统总重量。封闭空腔让同样总质量的物体拥有更大外部排水体积，平均密度可以低于水；材料本身的密度不必变。加货物会需要更多排水，使盒形船体浸得更深。若最大排水重量仍小于总重量，它即使完全浸没也不能保持漂浮。',
      'At floating equilibrium, displaced-water weight matches total system weight. An enclosed cavity gives more external water-excluding volume at the same total mass, allowing lower average density without changing material density. Cargo requires more displacement and deeper draft. If maximum displaced-water weight is too small, even full immersion cannot support the load.',
    ),
    example: t(
      '淡水中120 mL最大浮力1.2 N，小于300 g的3 N。密封500 mL船体最大浮力5 N，漂浮300 g时实际只排300 mL、浮力3 N。加350 g货物，总重量6.5 N，超过5 N上限；完全浸水时仍有5 N浮力，但合力向下1.5 N。',
      'In fresh water, 120 mL gives at most 1.2 N, less than the 300 g body’s 3 N. A sealed 500 mL hull can supply up to 5 N but actually displaces only 300 mL and supplies 3 N when floating at 300 g. Adding 350 g gives 6.5 N total weight, beyond 5 N capacity. Fully submerged it still has 5 N buoyancy, with 1.5 N net downward.',
    ),
    misconception: t(
      '最大浮力不是漂浮时一直受到的浮力。本模型是刚性密封盒，沉下去也保留排水体积；开口船进水、倾覆或空腔压缩是不同条件。500 g达到完全浸没的理想中性临界，不代表真实安全载荷。',
      'Maximum buoyancy is not the actual force throughout floating. This is a rigid sealed box; sinking retains its excluded volume. Flooding an open hull, capsizing and cavity compression are different cases. A 500 g fully submerged neutral boundary is not a real safe-load rating.',
    ),
    realWorld: t(
      '货船的吃水线提醒我们考虑船体、货物与环境。水密封、稳定性和波浪都重要；能算平衡不等于真实船只安全。',
      'Cargo-ship draft markings invite us to consider hull, load and environment together. Watertightness, stability and waves also matter; a balance calculation is not a real vessel safety assessment.',
    ),
    summary: t(
      '船靠排水支撑整个系统；货物增加时，要比较实际排水与能力上限。',
      'A hull supports the whole system by displacement; added cargo changes actual displacement and its capacity margin.',
    ),
    homeExperiment: t(
      '在浅水盆轻放一个密封小盒，每次加一颗小垫圈或硬币，画水线变化并保留每次载荷记录。记录是否漏水或倾斜，不把自己的小盒与规定500 mL模型混为一谈。',
      'Float a small sealed box in a shallow basin, adding one small washer or coin at a time. Sketch waterlines and retain each load record. Note leaks or tilt, and distinguish your box from the prescribed 500 mL model.',
    ),
    formula: t(
      '漂浮：ρ水V排=总质量；最大浮力=ρ水gV最大排水。',
      'Floating: ρ_water V_displaced=total mass; maximum buoyancy=ρ_water g V_max.',
    ),
    vocabulary: [
      t('船体', 'hull'),
      t('载荷', 'cargo'),
      t('吃水', 'draft'),
      t('平均密度', 'average density'),
    ],
    questions: [
      q(
        '300 g船漂浮时，模型实际浮力？',
        'The 300 g hull floats. Actual model buoyancy?',
        [
          ['3 N', '3 N'],
          ['一直是最大5 N', 'Always its maximum 5 N'],
        ],
        0,
        '漂浮平衡时实际浮力与3 N重量匹配。',
        'Actual buoyancy matches its 3 N weight at floating equilibrium.',
      ),
      q(
        '密封船增加货物但仍漂浮，排水体积？',
        'Add cargo to the sealed hull while it still floats. Displacement?',
        [
          ['增加', 'Increases'],
          ['自动减小', 'Automatically decreases'],
        ],
        0,
        '更多总质量需要更重的排水。',
        'More total mass requires heavier displaced water.',
      ),
      q(
        '650 g密封船最大排水500 mL，完全浸水时？',
        'A 650 g sealed hull excludes at most 500 mL. Fully submerged?',
        [
          [
            '仍有5 N浮力，但小于6.5 N重量',
            'Still 5 N buoyancy, below 6.5 N weight',
          ],
          ['没有任何浮力', 'No buoyancy'],
        ],
        0,
        '刚性密封体保留排水空间，下沉不让浮力消失。',
        'A sealed rigid body retains excluded volume; sinking does not eliminate buoyancy.',
      ),
    ],
    exit: q(
      '500 g的模型临界就等于真实安全载荷吗？',
      'Is the model’s 500 g boundary a real safe-load rating?',
      [
        [
          '不是，还要看稳定、密封与环境',
          'No: stability, sealing and environment also matter',
        ],
        ['是，任何形状和波浪都一样', 'Yes: shape and waves never matter'],
      ],
      0,
      '这个模型只算规定条件下的浮力与重量。',
      'This model compares buoyancy and weight under prescribed conditions.',
    ),
  },
  {
    id: 'buoyancy-submarine-ballast',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-submarine',
    minutes: 18,
    title: t(
      '潜水艇不变大，怎样上浮或下潜？',
      'How can a submarine rise or dive without growing?',
    ),
    subtitle: t(
      '外部体积不变，改变压载水的质量。',
      'Keep external volume fixed and change ballast-water mass.',
    ),
    hook: t(
      '船通常留在水面，潜水艇却能改变状态。先看一个密封刚性模型：水进入压载舱时，变的是总质量，还是外部排水体积？',
      'A submarine can change its underwater tendency. Start with a rigid sealed model: as ballast water enters, does total mass change, or does the external displaced volume change?',
    ),
    prediction: t(
      '同样完全浸水的2 L外形，装入更多压载水，淡水密度不变。模型浮力与重量怎样变？',
      'A fully submerged 2 L exterior takes in more ballast water at unchanged freshwater density. What changes?',
    ),
    predictions: [
      t('浮力不变，重量增大', 'Buoyancy stays fixed; weight increases'),
      t('浮力与重量都归零', 'Both become zero'),
      t('重量不变，浮力增大', 'Weight stays fixed; buoyancy increases'),
    ],
    explore: t(
      '比较0、400、800 g压载水。固定外部排水2 L，空模型质量1.6 kg；每组都先完全浸水、静止释放、不碰底。再自由调整压载量，看向上合力怎样跨过0。',
      'Compare 0, 400 and 800 g ballast water. External displacement stays 2 L and base mass 1.6 kg. Each starts fully submerged, released from rest and clear of the bottom. Adjust ballast freely and find where net upward force crosses zero.',
    ),
    concept: t(
      '在固定排水体积、同一种水的模型中，浮力固定为排水重量。进压载水增加总质量和重量，可能由向上合力变成平衡再变成向下。排出压载水会逆转这个变化。悬浮条件是两力平衡，不是浮力消失；实际潜艇还有推进、舵、压力与不同结构。',
      'At fixed submerged volume in the same water, buoyancy stays at the displaced-water weight. Ballast adds mass and weight, changing upward net force through balance to downward net force. Expelling ballast reverses the change. Neutral suspension balances forces rather than removing buoyancy. Real submarines also have propulsion, control surfaces, pressure effects and varied designs.',
    ),
    example: t(
      '2 L淡水质量2 kg，g≈10时浮力20 N。模型总质量1.6、2.0、2.4 kg，重量16、20、24 N；初始合力向上4 N、0 N、向下4 N。内舱水量变了，外部2 L体积没有扩大。',
      '2 L freshwater has mass 2 kg, giving 20 N buoyancy at g≈10. Total masses 1.6, 2.0 and 2.4 kg weigh 16, 20 and 24 N: initial net forces 4 N up, zero and 4 N down. Internal ballast changes, while the external 2 L volume does not grow.',
    ),
    misconception: t(
      '进水不是让水的浮力神秘消失。这里忽略排出空气的少量质量、船体压缩与水阻，只比较静止释放的力；图中的艇没有按动画时间真实航行。中性也不保证实际系统一直停在同一深度。',
      'Taking in water does not mysteriously remove water’s buoyancy. This ignores small displaced-air mass, hull compression and drag, and compares forces on release; the drawn vessel is not travelling on a real clock. Neutral buoyancy does not guarantee a real system stays at one depth indefinitely.',
    ),
    realWorld: t(
      '水下设备和潜水艇通过改变压载或其他浮力控制条件工作。学习时先固定外部体积，再改变质量，才知道哪个因素造成变化。',
      'Underwater equipment and submarines use ballast or other buoyancy controls. Hold external volume fixed before changing mass to identify the cause in this comparison.',
    ),
    summary: t(
      '固定排水时，压载水改变重量，让同样浮力对应不同合力。',
      'At fixed displacement, ballast changes weight so the same buoyancy gives different net forces.',
    ),
    homeExperiment: t(
      '不用制作加压装置。用纸画一个外部2 L模型，在艇内写0、400、800 g压载，分别画浮力20 N与重量16、20、24 N。解释“水装进去”与“外部排水变大”为什么不是同一件事。',
      'Use paper rather than making a pressurised device. Draw the same 2 L model with 0, 400 and 800 g ballast, label 20 N buoyancy and 16, 20 and 24 N weights. Explain why taking water inside is different from increasing external displacement.',
    ),
    formula: t(
      '完全浸没刚体：F浮=ρ水gV外部；总重量=(基础质量+压载水质量)g。',
      'Fully submerged rigid body: F_b=ρ_water g V_external; total weight=(base mass+ballast mass)g.',
    ),
    vocabulary: [
      t('压载舱', 'ballast tank'),
      t('压载水', 'ballast water'),
      t('外部体积', 'external volume'),
      t('中性浮力', 'neutral buoyancy'),
    ],
    questions: [
      q(
        '三组模型完全浸水，浮力各是多少？',
        'All three model cases are fully submerged. Buoyancy in each?',
        [
          ['20 N', '20 N'],
          ['0、20、40 N', '0, 20, 40 N'],
        ],
        0,
        '外部排水体积与水密度保持不变。',
        'External displacement and water density remain fixed.',
      ),
      q(
        '基础1.6 kg，装400 g水，总重量？',
        'Base 1.6 kg plus 400 g water. Total weight?',
        [
          ['20 N', '20 N'],
          ['1604 N', '1604 N'],
        ],
        0,
        '400 g=0.4 kg，合计2 kg，乘g≈10。',
        '400 g=0.4 kg; total 2 kg times g≈10.',
      ),
      q(
        '中性模型两力怎样？',
        'What happens to the neutral model’s forces?',
        [
          ['浮力与重量都是20 N', 'Buoyancy and weight are both 20 N'],
          ['两力都不存在', 'Neither exists'],
        ],
        0,
        '零合力不代表零作用。',
        'Zero net force does not mean no forces.',
      ),
    ],
    exit: q(
      '完全浸水、刚性外形不变时排出部分压载水，会怎样？',
      'Expel some ballast with full immersion and unchanged rigid exterior. What changes?',
      [
        ['重量减小，向上合力增加', 'Weight falls; net upward force increases'],
        ['水的浮力一定加倍', 'Water buoyancy must double'],
      ],
      0,
      '比较改变的是质量，不是固定排水体积。',
      'The changed quantity is mass, rather than fixed displacement.',
    ),
  },
  {
    id: 'buoyancy-hot-air-balloon',
    stage: 3,
    unit: 'buoyancy',
    kind: 'buoyancy-balloon',
    minutes: 20,
    title: t('空气也能托起一个气球吗？', 'Can air support a balloon too?'),
    subtitle: t(
      '别漏算气球里的空气，也别漏算吊篮与载荷。',
      'Count enclosed air as well as equipment and payload.',
    ),
    hook: t(
      '热气球不是靠火焰直接向上推。空气也是流体；一个充满的气球排开外部空气，同时自己携带内部空气、外皮和载荷。要算清这两边。',
      'A hot-air balloon is not pushed upward directly by a flame. Air is a fluid. An inflated balloon displaces outside air while carrying inside air, an envelope and a load. Account for both sides.',
    ),
    prediction: t(
      '外部空气密度与气球体积固定，内部空气变稀薄但没有把外皮载荷变轻。哪个量会减小？',
      'Outside air density and balloon volume stay fixed. Inside air becomes less dense without changing equipment mass. Which quantity decreases?',
    ),
    predictions: [
      t('内部空气质量与总重量', 'Inside-air mass and total weight'),
      t('重力消失', 'Gravity vanishes'),
      t('外部空气一定更密', 'Outside air must get denser'),
    ],
    explore: t(
      '比较内部密度1.20、1.05、0.90 kg/m³。外部1.20 kg/m³、充满体积10 m³、外皮吊篮与载荷合计2.5 kg。完整检查三组，再自由调整内部密度寻找两力接近平衡的位置。',
      'Compare inside densities 1.20, 1.05 and 0.90 kg/m³. Outside density is 1.20, inflated volume 10 m³ and equipment/payload mass 2.5 kg. Inspect all cases, then adjust inside density to find near balance.',
    ),
    concept: t(
      '排开外部空气的重量给出浮力。已经充满、开口且近似同压的气球加热后，部分空气可排出，内部密度与空气质量减小；不能沿用封口注射器“同一份气体”的条件。外部密度和体积不变时，浮力不变；总重量包含内部空气与所有设备。浮力超过总重量，才有向上的初始合力。',
      'Displaced outside-air weight gives buoyancy. Heating a fully inflated, vented balloon near outside pressure can let some air leave, reducing inside density and air mass. This differs from the fixed gas amount in a sealed syringe. Fixed outside density and volume keep buoyancy fixed. Weight includes inside air and all equipment; upward net force requires buoyancy to exceed that total.',
    ),
    example: t(
      '10 m³外部空气质量12 kg，g≈10时浮力120 N。内部空气质量12、10.5、9 kg，加2.5 kg设备后总重量145、130、115 N，初始合力向下25、向下10、向上5 N。更热可能仍不够托起载荷，不能只比较两种空气的密度。',
      '10 m³ of outside air has mass 12 kg, giving 120 N buoyancy at g≈10. Inside air masses 12, 10.5 and 9 kg, plus 2.5 kg equipment, give weights 145, 130 and 115 N: net 25 N down, 10 N down and 5 N up. A less-dense interior may still be insufficient for the load; comparing air densities alone is not enough.',
    ),
    misconception: t(
      '内部空气不是没有质量；热也没有取消重力。本模型规定密度而不计算温度，假设体积固定、内外近似同压，忽略风、水汽、绳索和吊篮的小体积排气作用，不计算真实起升时间或飞行高度。',
      'Inside air has mass, and heating does not cancel gravity. Density is prescribed rather than computed from temperature. Volume is fixed and pressures nearly match. Wind, moisture, tethers and small equipment-displacement effects are omitted; real lift-off time or altitude is not predicted.',
    ),
    realWorld: t(
      '热气球设计需要同时考虑外界空气、内部空气和载荷。想多带东西，不只是“把空气弄热”一句话；实际材料与天气也限制使用条件。',
      'Balloon design must account for outside air, inside air and load together. Carrying more is not simply a matter of heating; real materials and weather constrain conditions too.',
    ),
    summary: t(
      '空气能提供浮力；能否上升，要比较外部排气重量与整个系统重量。',
      'Air supplies buoyancy; rising depends on displaced outside-air weight versus the whole system’s weight.',
    ),
    homeExperiment: t(
      '只做屏幕与纸上比较，不点火或自制加热气球。给三组空气密度画质量账本：内部空气+设备，旁边写排开外部空气。用自己的话解释为什么较稀薄的一组仍可能下落。',
      'Use the screen and paper without flames or homemade heated balloons. Draw mass ledgers for the three densities: inside air plus equipment alongside displaced outside air. Explain why one less-dense case can still fall.',
    ),
    formula: t(
      'F浮=ρ外空气gV；总重量=(ρ内空气V+设备载荷质量)g。',
      'F_b=ρ_outside g V; total weight=(ρ_inside V+equipment/payload mass)g.',
    ),
    vocabulary: [
      t('热气球', 'hot-air balloon'),
      t('外部空气', 'outside air'),
      t('内部空气质量', 'inside-air mass'),
      t('载荷', 'payload'),
    ],
    questions: [
      q(
        '模型三组浮力为什么都是120 N？',
        'Why is model buoyancy 120 N in all three cases?',
        [
          [
            '外部空气密度与排气体积固定',
            'Outside density and displaced volume stay fixed',
          ],
          ['加热永远让浮力加倍', 'Heating always doubles buoyancy'],
        ],
        0,
        '排开的是相同体积的同密度外部空气。',
        'Each displaces the same volume of the same outside air.',
      ),
      q(
        '内部密度1.05时，总重量包含？',
        'At inside density 1.05, what goes into total weight?',
        [
          [
            '10.5 kg空气与2.5 kg设备载荷',
            '10.5 kg air plus 2.5 kg equipment/load',
          ],
          ['只算2.5 kg设备', 'Only 2.5 kg equipment'],
        ],
        0,
        '内部空气也是系统携带的质量。',
        'Inside air is carried mass too.',
      ),
      q(
        '浮力120 N、总重量130 N，初始合力？',
        'Buoyancy 120 N and weight 130 N: initial net force?',
        [
          ['向下10 N', '10 N downward'],
          ['向上250 N', '250 N upward'],
        ],
        0,
        '比较相反方向的两个力，不能相加当向上。',
        'Compare opposing forces rather than adding them upward.',
      ),
    ],
    exit: q(
      '开口热气球与封口注射器能默认气体量都不变吗？',
      'Can a vented hot-air balloon and sealed syringe both be assumed to keep the same gas amount?',
      [
        [
          '不能，开口气球可让空气进出',
          'No: air can enter or leave the vented balloon',
        ],
        ['可以，只要都有空气', 'Yes: both contain air'],
      ],
      0,
      '模型是否适用，要看气体量、体积、温度与气压条件。',
      'Model conditions include gas amount, volume, temperature and pressure.',
    ),
  },
];
