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
  unit: 'gravitation',
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
export const gravitationLessons: Lesson[] = [
  make({
    id: 'gravitation-two-masses-one-interaction',
    kind: 'gravitation-pair',
    minutes: 22,
    title: [
      '你吸引地球，地球也吸引你吗？',
      'You attract Earth. Does Earth attract you too?',
    ],
    subtitle: [
      '从两个孤立球体，读懂引力的相互性。',
      'Use an isolated pair to understand mutual gravity.',
    ],
    hook: [
      '站在地上，你感觉地球把你往下拉。你的脚下那颗巨大天体，也被你拉着吗？把大小差距缩小，换成两颗在空旷宇宙里静止的球：哪颗开始动？为什么大球的移动可能更难察觉？',
      'You feel Earth pulling downward. Does the huge body under your feet feel your pull? Reduce the mass contrast to two resting spheres in empty space. Which starts moving, and why might the heavier one move less?',
    ],
    prediction: [
      'A=1000 kg，B=4000 kg；互相引力哪边大？',
      'A=1000 kg, B=4000 kg. Which mutual force is larger?',
    ],
    predictions: [
      ['B拉A更大', 'B pulls A more'],
      ['A拉B更大', 'A pulls B more'],
      ['等大反向', 'Equal and opposite'],
    ],
    explore: [
      '完整观察三种B质量，各2000 s被压缩为2.4秒。比较两力、两加速度与质心CM。拖到0%先读初态，再看间距怎样减少。自由B质量试500与4000 kg；别把播放秒数当成物理用时。',
      'Observe all three B masses; each 2000 s is played in 2.4 seconds. Compare both forces, accelerations and centre CM. Inspect 0% first, then watch separation shrink. Try free B masses 500 and 4000 kg; playback seconds are not physical time.',
    ],
    concept: [
      '引力是两个物体间的一次相互作用。A受到B的力与B受到A的力等大、反向，却作用在不同物体上，不能在A的受力图里抵消。各自加速度由F/m决定；轻球改变运动更多。孤立两球的总动量不变，初始总动量0使质心留在原处。真实G很小，小物体间的吸引通常被其他作用淹没。',
      'Gravity is one interaction between two bodies. The forces are equal and opposite but act on different bodies, so they cannot cancel on A’s force diagram. Each acceleration is F/m; the lighter body changes motion more. An isolated pair preserves total momentum, leaving its initially stationary centre fixed. Real G is small, so other effects often conceal attraction between small objects.',
    ],
    formula: [
      'F_A=−F_B；a_A=F/m_A；a_B=F/m_B',
      'F_A=−F_B; a_A=F/m_A; a_B=F/m_B',
    ],
    example: [
      '初态两球中心距2 m，质量1000与4000 kg：两力大小均6.67×10⁻⁵ N，A加速度6.67×10⁻⁸ m/s²，B为1.6675×10⁻⁸ m/s²、方向相反。A加速度四倍，不表示A受到四倍引力。随后两球靠近，力也随间距变化。',
      'Initially, 1000 and 4000 kg spheres separated by 2 m each feel 6.67×10⁻⁵ N. A accelerates at 6.67×10⁻⁸ m/s²; B at 1.6675×10⁻⁸ m/s² in the opposite direction. Four times the acceleration does not mean four times the force. As the spheres approach, attraction changes with separation.',
    ],
    misconception: [
      '“地球更重，所以它拉我的力更大。”互相力等大；质量悬殊使地球的加速度难察觉。也不能用桌上两个物体不靠近来否定引力：桌面摩擦与支持作用没有消失。',
      '“Earth is heavier, so its pull on me is larger.” Mutual forces match; the mass difference makes Earth’s acceleration hard to notice. Objects remaining apart on a table do not disprove gravity: friction and support remain.',
    ],
    realWorld: [
      '这是读懂月球与地球共同运动、以及双星系统的起点。这里的孤立球对省略其他天体，不能直接预测真实卫星之间的相对漂移。',
      'This is a starting point for Earth–Moon motion and binary stars. Our isolated spheres omit other bodies, so they do not predict actual relative drift between satellites.',
    ],
    summary: [
      '两力等大，不代表两加速度等大；先问力作用在谁上。',
      'Equal forces need not mean equal accelerations. Name each force receiver.',
    ],
    homeExperiment: [
      '画你与地球两张独立受力图，用同样长的箭头表示彼此引力，再写各自质量怎样影响加速度。不要把同桌物体静止误当成“没有引力”的实验结论。',
      'Draw separate force diagrams for you and Earth, using equal arrows for mutual gravity. Explain how each mass changes acceleration. Do not treat resting tabletop objects as evidence of no attraction.',
    ],
    vocabulary: [
      ['万有引力', 'Universal gravitation'],
      ['相互作用', 'Interaction'],
      ['质心', 'Centre of mass'],
      ['孤立系统', 'Isolated system'],
    ],
    questions: [
      [
        '两球的引力为何不在A的力图里抵消？',
        'Why do the two pulls not cancel on A?',
        [
          ['因为方向相同', 'Same direction'],
          ['因为作用对象不同', 'Different receivers'],
          ['因为重球力更大', 'Heavier body has more force'],
        ],
        1,
        '一份力作用在A，另一份作用在B。',
        'One force acts on A; the other on B.',
      ],
      [
        '同一互相力，质量四倍的球加速度？',
        'Under the same mutual force, a four-times heavier ball accelerates at?',
        [
          ['四分之一', 'One quarter'],
          ['四倍', 'Four times'],
          ['相同', 'The same'],
        ],
        0,
        'a=F/m，质量四倍使加速度为四分之一。',
        'a=F/m: four times the mass gives one quarter the acceleration.',
      ],
      [
        '孤立、从静止释放的两球，质心怎样？',
        'An isolated pair released from rest has what centre motion?',
        [
          ['跟着重球走', 'Follows the heavy ball'],
          ['跟着轻球走', 'Follows the light ball'],
          ['保持原处', 'Stays in place'],
        ],
        2,
        '内部引力不改变系统总动量。',
        'Internal gravity does not change total system momentum.',
      ],
    ],
    exit: [
      '解释“我也拉地球，但它不明显靠近我”。',
      'Explain “I also pull Earth, but its approach is not noticeable.”',
      [
        [
          '互相力等大，地球质量巨大，加速度很小',
          'Equal mutual forces; Earth’s enormous mass gives tiny acceleration',
        ],
        ['我完全没有引力', 'I have no gravity'],
        ['地球只施力不受力', 'Earth exerts but receives no force'],
      ],
      0,
      '把相互力和不同质量连接起来。',
      'Connect mutual forces with different masses.',
    ],
  }),
  make({
    id: 'gravitation-distance-has-a-square',
    kind: 'gravitation-inverse',
    minutes: 22,
    title: [
      '离远两倍，引力只剩一半吗？',
      'Twice as far: only half the attraction?',
    ],
    subtitle: [
      '用中心距与质量，建立平方反比的工具。',
      'Build inverse-square reasoning with centre distance and mass.',
    ],
    hook: [
      '把一台探测器慢慢移离一颗小天体，拉住它的引力怎样减弱？“离远两倍”需要先说从哪里量。今天不发射探测器，用外部装置改变距离，把引力读数留在一张图上。',
      'Move a probe away from a small body. How does its attraction weaken? “Twice as far” first needs an origin. Today an apparatus changes distance rather than launching the probe, leaving measured force on a graph.',
    ],
    prediction: [
      '质量不变，中心距由2到4 m，引力变成？',
      'Masses fixed, centre distance 2→4 m. Force becomes?',
    ],
    predictions: [
      ['一半', 'One half'],
      ['不变', 'Unchanged'],
      ['四分之一', 'One quarter'],
    ],
    explore: [
      '比较μ=8,r=2；μ=16,r=2；μ=8,r=4。μ=GM代表源的质量信息，单位m³/s²。装置从r=2取样到选定终点；第一、二例位置不变，第三例距离变化。看F–r曲线，把变化写成比值。',
      'Compare μ=8,r=2; μ=16,r=2; μ=8,r=4. μ=GM packages source mass in m³/s². The apparatus samples from r=2 to the chosen endpoint; the first two positions stay fixed, the third changes. Read the F–r curve and express changes as ratios.',
    ],
    concept: [
      '对质点，或在球形对称天体外部，F=Gm₁m₂/r²。这里r是两质量中心之间的距离，不能用离表面高度替代。只改变一个质量两倍，力两倍；两个质量都两倍，力四倍；只把r两倍，力四分之一。G的单位N·m²/kg²让结果成为N；μ=GM不是另一条引力定律，只是把固定源的G与M放在一起。',
      'For point masses, or outside spherical sources, F=Gm₁m₂/r². r measures centre separation, not height above a surface. Double one mass: double force. Double both masses: quadruple force. Double r alone: one quarter the force. G has units N·m²/kg². μ=GM simply groups G and a fixed source’s mass.',
    ],
    formula: ['F=Gm₁m₂/r²=μm/r²', 'F=Gm₁m₂/r²=μm/r²'],
    example: [
      '虚构源μ=8、探测物1 kg：r=2 m时F=2 N；μ改为16而r不变，F=4 N；回到μ=8，r改为4 m，F=0.5 N。最后一个读数比第一个小四倍。',
      'With fictional μ=8 and a 1 kg probe, r=2 m gives 2 N. At μ=16 with the same r, force is 4 N. Restore μ=8 and use r=4 m: 0.5 N, one quarter the first reading.',
    ],
    misconception: [
      '“离表面高度加倍，引力就四分之一。”应比较R+h的中心距。装置让探测器匀速外移，也不表示引力为0：装置同时施加其他力。',
      '“Double surface height and force quarters.” Compare centre distances R+h. Uniform outward motion under an apparatus also does not mean zero gravity: the apparatus supplies another force.',
    ],
    realWorld: [
      '规划一颗卫星的轨道前，先量清半径、质量与单位。这张曲线也提醒我们：线条在屏幕上下降的角度不是定律，轴和比例才告诉你变化多少。',
      'Before planning an orbit, name radius, mass and units. A curve’s screen angle is not a law; axes and ratios tell you how much changes.',
    ],
    summary: [
      '质量相乘，中心距平方；一次只改一个条件。',
      'Multiply masses, square centre distance, and change one condition at a time.',
    ],
    homeExperiment: [
      '用纸画半径R=1的圆，标出h=1与h=3的探测点。写r=2与4，再计算力的比值。把同样的数字换成厘米后，单位必须一起换。',
      'Draw a radius-1 circle with probes at h=1 and h=3. Label r=2 and 4, then calculate the force ratio. If switching to centimetres, convert units consistently.',
    ],
    vocabulary: [
      ['平方反比', 'Inverse square'],
      ['中心距', 'Centre separation'],
      ['引力常量G', 'Gravitational constant G'],
      ['引力参数μ', 'Gravitational parameter μ'],
    ],
    questions: [
      [
        '两个质量都翻倍，r不变，力？',
        'Both masses double at fixed r. Force?',
        [
          ['两倍', 'Twice'],
          ['不变', 'Unchanged'],
          ['四倍', 'Four times'],
        ],
        2,
        '两个质量的乘积变为四倍。',
        'The mass product becomes four times larger.',
      ],
      [
        '半径1 m，高度3 m，公式中的r？',
        'Radius 1 m, height 3 m. What is r?',
        [
          ['4 m', '4 m'],
          ['3 m', '3 m'],
          ['2 m', '2 m'],
        ],
        0,
        'r=R+h=4 m。',
        'Centre distance includes the radius: r=R+h=4 m.',
      ],
      [
        'r翻三倍，质量不变，力？',
        'Triple r at fixed masses. Force?',
        [
          ['三分之一', 'One third'],
          ['九分之一', 'One ninth'],
          ['九倍', 'Nine times'],
        ],
        1,
        '距离平方变为九倍。',
        'The squared distance grows ninefold.',
      ],
    ],
    exit: [
      '比较两处引力前，最有用的一步？',
      'Most useful first step before comparing attraction?',
      [
        [
          '确认质量与中心距，计算比值',
          'Confirm masses and centre distances, then ratios',
        ],
        ['只比表面高度', 'Compare surface heights only'],
        ['只量屏幕上的箭头长度', 'Measure screen arrows alone'],
      ],
      0,
      '把条件与数量关系接起来。',
      'Connect conditions with quantitative relationships.',
    ],
  }),
  make({
    id: 'gravitation-field-before-test-mass',
    kind: 'gravitation-field',
    minutes: 23,
    title: [
      '换一个更重的探测器，同一地点的g变了吗？',
      'A heavier probe: did g at that location change?',
    ],
    subtitle: [
      '把空间中的场，与物体受到的力分开。',
      'Separate a field in space from force on an object.',
    ],
    hook: [
      '你在地图上标一处地点，再换一个轻探测器和一个重探测器。仪器读到的引力不同，是这个地点的场变了，还是同一个场作用在不同质量上？给每份力除以质量试试看。',
      'Mark one location, then use a light and a heavy probe. Different gravitational forces: did the location’s field change, or did one field act on different masses? Try dividing each force by its mass.',
    ],
    prediction: [
      '同处探测质量翻倍，F翻倍，F/m怎样？',
      'At one location mass and F double. What happens to F/m?',
    ],
    predictions: [
      ['两倍', 'Twice'],
      ['不变', 'Unchanged'],
      ['一半', 'Half'],
    ],
    explore: [
      '完整扫描三组探测条件，半径都2 m：m=1与2 kg、μ=8；再用m=1、μ=16。读场强N/kg与力N，不把单位不同的数字直接相加。扫描轨迹由装置控制，箭头指中心体的引力方向。',
      'Scan three conditions at r=2 m: m=1 and 2 kg with μ=8, then m=1 with μ=16. Read field in N/kg and force in N; do not add numbers with different units. An apparatus controls sampling; arrows show gravity toward the source.',
    ],
    concept: [
      '引力场描述每个位置会给小探测质量怎样的引力：g向量=F向量/m。球形源外部g=GM/r²，方向朝源中心；F=mg把这份场信息转换成某物体的力。探测质量足够小、不改变源时，换它的质量不会改变场。N/kg与m/s²等价，但只有没有其他作用的自由物体，实际加速度才等于g。',
      'A gravitational field describes force per small test mass at each location: vector g=vector F/m. Outside a spherical source, g=GM/r² toward its centre. F=mg turns field information into force on a chosen body. A small probe does not alter the source, so changing probe mass does not change the field. N/kg equals m/s², but actual acceleration equals g only in free fall with no other interactions.',
    ],
    formula: [
      'g向量=F向量/m；g=GM/r²；F=mg',
      'vector g=vector F/m; g=GM/r²; F=mg',
    ],
    example: [
      'μ=8、r=2时g=2 N/kg。1 kg探测器受2 N，2 kg受4 N，两者F/m都是2 N/kg。源μ翻倍后，同处g=4 N/kg。装置扫描时有额外支持作用，不直接按g自由运动。',
      'At μ=8,r=2, g=2 N/kg. A 1 kg probe feels 2 N, a 2 kg probe 4 N; both give F/m=2 N/kg. Doubling source μ gives 4 N/kg there. Extra apparatus support prevents the scan from being free motion under g.',
    ],
    misconception: [
      '“g=2表示每个物体受到2 N。”它是每千克2 N。也不能把画得一样长的方向箭头当成场强处处相同，大小要看带单位的数值。',
      '“g=2 means every object feels 2 N.” It means 2 N per kilogram. Equal-length direction arrows also do not imply equal field magnitudes; read quantities and units.',
    ],
    realWorld: [
      '场的想法让你不用在每个地点重新写所有质量条件。先绘制一张g地图，再预测不同探测器的引力，这也是以后学习电场的桥梁。',
      'A field map separates location information from each probe’s mass. Map g first, then predict forces on different probes; the idea later supports electric fields.',
    ],
    summary: [
      '场给每千克多少力；物体的力还要乘它的质量。',
      'The field gives force per kilogram; multiply by the body’s mass for its force.',
    ],
    homeExperiment: [
      '在纸上画同一个圆周的四个位置，箭头都朝中心。每处写g=2 N/kg，再给1 kg和3 kg探测器写2 N和6 N。向家人解释为什么这不是两份不同的场。',
      'Draw four positions around one source, arrows inward. Write g=2 N/kg at each, then 2 N and 6 N for 1 kg and 3 kg probes. Explain why these are not two different fields.',
    ],
    vocabulary: [
      ['引力场', 'Gravitational field'],
      ['探测质量', 'Test mass'],
      ['场强', 'Field strength'],
      ['力每单位质量', 'Force per unit mass'],
    ],
    questions: [
      [
        'g=3 N/kg，2 kg受到多大引力？',
        'g=3 N/kg. Force on 2 kg?',
        [
          ['6 N', '6 N'],
          ['3 N', '3 N'],
          ['1.5 N', '1.5 N'],
        ],
        0,
        'F=mg=2×3。',
        'Multiply mass by field: F=mg=2×3=6 N.',
      ],
      [
        '同处换更重的小探测质量，哪些量改变？',
        'A heavier small probe at the same point changes which quantity?',
        [
          ['源的G', 'Source G'],
          ['中心距', 'Centre distance'],
          ['引力F，不改变g', 'F changes, g does not'],
        ],
        2,
        '源与位置固定，F随探测质量变化。',
        'Fixed source and position give fixed g; F scales with probe mass.',
      ],
      [
        '装置带探测器扫描，实际加速度一定=g吗？',
        'Does an apparatus-scanned probe necessarily accelerate at g?',
        [
          ['一定', 'Always'],
          ['不一定，还有其他作用', 'No; other interactions act'],
          ['g不存在', 'g does not exist'],
        ],
        1,
        'g是引力每单位质量，不是含装置作用的合力每单位质量。',
        'g is gravity per mass, not the net including apparatus forces.',
      ],
    ],
    exit: [
      '同处两质量的引力不同，怎样比较场？',
      'Different forces on two masses: how compare the field?',
      [
        ['比较带方向的F/m', 'Compare directional F/m'],
        ['只比较F', 'Compare F alone'],
        ['把两个力相加', 'Add the forces'],
      ],
      0,
      '除以探测质量，保留场的方向与单位。',
      'Divide by test mass, keeping field direction and units.',
    ],
  }),
  make({
    id: 'gravitation-height-is-not-radius',
    kind: 'gravitation-g',
    minutes: 22,
    title: [
      '爬高一点，g为什么只变一点？',
      'A little higher: why only a little change in g?',
    ],
    subtitle: [
      '把R+h带进公式，理解近地近似。',
      'Use R+h to understand the near-surface approximation.',
    ],
    hook: [
      '你从地面把书举到桌面，地球引力没有突然减半。可是把探测器移到一颗小天体的一个半径之外，引力就变化明显。关键不是“高了几米”，而是这段高度相对天体半径有多大。',
      'Lifting a book to a desk does not suddenly halve Earth’s gravity. Moving one whole body radius above a small source changes attraction much more. What matters is height compared with the body’s radius.',
    ],
    prediction: [
      '源不变，h从0增到R，g变成表面的？',
      'At fixed source, h rises from 0 to R. g becomes what fraction of surface g?',
    ],
    predictions: [
      ['一半', 'Half'],
      ['相同', 'The same'],
      ['四分之一', 'One quarter'],
    ],
    explore: [
      '比较μ=8,h=0；μ=16,h=0；μ=8,h=1，R固定1 m。读r=R+h与g，再把自由高度调到3 m。曲线的横轴是h，不是r；这次请解释为什么h=0时g有限。',
      'Compare μ=8,h=0; μ=16,h=0; μ=8,h=1 with R=1 m. Read r=R+h and g, then try h=3 m. The horizontal axis is h, not r. Explain why g is finite at h=0.',
    ],
    concept: [
      '球形天体外部g=GM/(R+h)²。表面h=0时仍距离中心R，g不会无穷大。若h远小于R，可把R+h近似为R，得到近地恒定g模型；把它用于大高度就会丢掉重要变化。G是普适常量，g随源质量与位置改变。这里忽略自转与非球形，真实地面测到的g还会受这些条件影响。',
      'Outside a spherical body, g=GM/(R+h)². At h=0, centre distance remains R, so surface g is finite. If h is much smaller than R, approximate R+h by R and use constant near-surface g. Large heights require the variation. G is universal; g depends on source mass and position. This model omits rotation and nonspherical structure, which also affect real surface measurements.',
    ],
    formula: [
      'g=GM/(R+h)²；g(h)/g(0)=[R/(R+h)]²',
      'g=GM/(R+h)²; g(h)/g(0)=[R/(R+h)]²',
    ],
    example: [
      'R=1、μ=8：表面g=8 N/kg；h=1时r=2，g=2；h=3时r=4，g=0.5。若h只有0.01R，比例是1/(1.01)²≈0.9803，变化约2%，而不是减半。',
      'For R=1,μ=8: surface g=8 N/kg; h=1 gives r=2 and g=2; h=3 gives r=4 and g=0.5. At h=0.01R, the ratio is 1/(1.01)²≈0.9803, a change of about 2%, not one half.',
    ],
    misconception: [
      '“高度0，把公式除以0。”公式中的距离是R+h。“把g取10，任何高度都能用。”这只是特定范围与精度下的近似。',
      '“Zero height means divide by zero.” Distance is R+h. “Taking g=10 works at any height.” It is an approximation within a stated range and precision.',
    ],
    realWorld: [
      '这能帮你判断以前的落球模型什么时候合适，也解释低轨卫星附近引力为何仍然存在。到了太空，不是跨过一条边界引力就突然归零。',
      'This helps judge when earlier falling-ball models are suitable and why gravity remains near low-orbit satellites. Crossing into space does not abruptly switch it off.',
    ],
    summary: [
      '先把高度变成中心距，再判断恒定g近似是否够好。',
      'Convert height to centre distance, then judge whether constant g is adequate.',
    ],
    homeExperiment: [
      '做一张三行纸表：h/R为0、0.01、1。算g/g表面分别1、约0.9803、0.25，用自己的话解释为何课堂落球可以用近似，而远距离探测不能。',
      'Make a table for h/R of 0,0.01,1 and g/surface-g of 1,about 0.9803,0.25. Explain why a classroom drop can use an approximation while distant probes cannot.',
    ],
    vocabulary: [
      ['表面高度h', 'Surface height h'],
      ['半径R', 'Body radius R'],
      ['近似', 'Approximation'],
      ['局部g', 'Local g'],
    ],
    questions: [
      [
        '表面h=0，公式分母距离是？',
        'At h=0, denominator distance is?',
        [
          ['0', '0'],
          ['R', 'R'],
          ['2R', '2R'],
        ],
        1,
        '表面到中心仍是R。',
        'Surface-to-centre distance is R.',
      ],
      [
        'h远小于R，哪种处理可用？',
        'For h much smaller than R, what may be useful?',
        [
          ['任意设g=0', 'Set g=0'],
          ['把G改小', 'Reduce G'],
          [
            '按所需精度近似g恒定',
            'Approximate constant g to the needed precision',
          ],
        ],
        2,
        '近似是否好取决于范围和精度。',
        'Its adequacy depends on range and precision.',
      ],
      [
        '源质量翻倍，半径与位置不变，g？',
        'Double source mass at fixed radius and location. g?',
        [
          ['两倍', 'Twice'],
          ['四倍', 'Four times'],
          ['不变', 'Unchanged'],
        ],
        0,
        'g与源质量成正比。',
        'g scales with source mass.',
      ],
    ],
    exit: [
      '一名同学说“h翻倍，g变四分之一”，你先查什么？',
      'A classmate says doubling h quarters g. What do you check first?',
      [
        ['r=R+h的两份中心距', 'The two centre distances R+h'],
        ['探测器颜色', 'Probe colour'],
        ['播放速度', 'Playback speed'],
      ],
      0,
      '定律对r平方，不是h平方。',
      'The law squares r, not h.',
    ],
  }),
  make({
    id: 'gravitation-speed-shapes-an-orbit',
    kind: 'gravitation-orbit',
    minutes: 26,
    title: [
      '卫星初速变了，轨道还会是圆吗？',
      'Different launch speed: still a circular orbit?',
    ],
    subtitle: [
      '用同一个出发点，连接能量、角动量与椭圆。',
      'Connect energy, angular momentum and ellipses from one start.',
    ],
    hook: [
      '在同一点给三个探测器不同的切向初速。它们都受到同一颗天体的引力，可不会都沿同一个圆跑。今天让轨道自己给出答案：哪个靠近天体，哪个先走向更高处，为什么它们的速率在途中变化？',
      'Give three probes different tangent speeds at one point. The same source attracts all three, yet they cannot all follow one circle. Which approaches the body, which first moves higher, and why does speed change along the way?',
    ],
    prediction: [
      '圆轨道初速vc增到1.2vc，之后无推进，轨道？',
      'Increase circular speed vc to 1.2vc, then no thrust. The orbit?',
    ],
    predictions: [
      ['同一个圆，跑更快', 'Same circle, faster'],
      ['一定撞天体', 'Must hit the body'],
      ['在本条件下为椭圆', 'An ellipse under these conditions'],
    ],
    explore: [
      '完整比较0.85vc、vc、1.2vc，vc=2 m/s，都是从(2,0) m沿+y出发，观察4 s。读中心距、速率、近心点和E。用检查进度比较同一秒，别把轨道形状当成匀速运动。',
      'Compare 0.85vc,vc,1.2vc with vc=2 m/s, all from (2,0) m along +y over 4 s. Read radius, speed, periapsis and E. Compare equal physical times; an orbital shape does not imply uniform speed.',
    ],
    concept: [
      '引力方向指向中心，大小随r变化。只有合力需求v²/r恰好等于GM/r²时，初态才能保持圆轨道。此处其他允许的切向初速得到不碰表面的束缚椭圆：速率低于vc时出发点是远心点，高于vc时是近心点。无阻力、推进时，K+U守恒，U=−GMm/r；中心力使角动量守恒，每相等时间扫过相等面积，而不是相等角度。',
      'Gravity points inward and changes with r. A circular start requires v²/r=GM/r². Other allowed tangent speeds here produce bound ellipses outside the surface: below vc starts at apoapsis; above vc at periapsis. Without drag or thrust, K+U is conserved with U=−GMm/r. Central force conserves angular momentum, giving equal swept areas in equal times, not equal angles.',
    ],
    formula: [
      'vc=√(μ/r)；E=½mv²−μm/r；L=mrv切向',
      'vc=√(μ/r); E=½mv²−μm/r; L=mrv(tangent)',
    ],
    example: [
      'μ=8、r₀=2、m=1：初速2 m/s时E=2−4=−2 J，半径保持2 m；初速2.4时E=2.88−4=−1.12 J，先向外走，远心点约5.143 m，随后回返。初速1.7则先向内，近心点约1.131 m，仍在半径1 m的表面之外。',
      'With μ=8,r₀=2,m=1, initial 2 m/s gives E=2−4=−2 J and fixed r=2. At 2.4 m/s, E=2.88−4=−1.12 J: outward first, apoapsis about 5.143 m, then return. At 1.7 m/s, inward first, periapsis about 1.131 m, outside the radius-1 surface.',
    ],
    misconception: [
      '“卫星不撞地，就一定匀速绕圆。”椭圆也可以不撞，速度会变。轨道动画只画4 s的窗口，不能把窗口内向外走当成永远逃离。',
      '“A satellite avoids impact, so it must move uniformly on a circle.” Ellipses can avoid impact while speed changes. A 4 s outward segment does not establish permanent escape.',
    ],
    realWorld: [
      '这解释轨道调整为何要选择位置和推进方向。我们的理想小系统没有空气、其他天体与持续发动机作用，是理解轨道的第一张图，不是发射任务规划。',
      'This explains why orbit changes depend on where and in which direction thrust acts. Our small ideal system omits air, other bodies and continued thrust; it is a first orbital map, not mission planning.',
    ],
    summary: [
      '同一引力源不保证同一轨道；初态和守恒量一起决定运动。',
      'One gravity source does not guarantee one orbit; initial state and conserved quantities determine motion.',
    ],
    homeExperiment: [
      '在纸上画圆和椭圆，给椭圆标近心点、远心点，再在近心点画更长的速度箭头。向家人解释“靠近更快”怎样同时满足能量与角动量账。',
      'Draw a circle and ellipse, label periapsis and apoapsis, and draw a longer velocity arrow at periapsis. Explain how faster motion nearby fits both energy and angular-momentum ledgers.',
    ],
    vocabulary: [
      ['近心点', 'Periapsis'],
      ['远心点', 'Apoapsis'],
      ['角动量', 'Angular momentum'],
      ['开普勒时间', 'Kepler time'],
    ],
    questions: [
      [
        '本实验把初速2改为2.4，哪项也改变？',
        'Changing initial speed 2→2.4 also changes what?',
        [
          ['源的μ', 'Source μ'],
          ['出发位置', 'Starting position'],
          ['初始能量和角动量', 'Initial energy and angular momentum'],
        ],
        2,
        '同一r与μ下，速度改变K和L。',
        'At fixed r and μ, speed changes K and L.',
      ],
      [
        '束缚椭圆上，靠近中心时通常？',
        'On this bound ellipse, nearer the source usually means?',
        [
          ['更快，U更负', 'Faster, more negative U'],
          ['更慢，U更正', 'Slower, more positive U'],
          ['引力消失', 'Gravity disappears'],
        ],
        0,
        '总能量不变，U下降对应K增加。',
        'At constant total energy, decreasing U increases K.',
      ],
      [
        '相等时间里中心连线扫过？',
        'The radius line sweeps what in equal times?',
        [
          ['相等角度', 'Equal angles'],
          ['相等面积', 'Equal areas'],
          ['相等路程', 'Equal distances'],
        ],
        1,
        '中心力保留角动量，面积速率不变。',
        'Central force preserves angular momentum and area rate.',
      ],
    ],
    exit: [
      '评估一次初速改变后的轨道，先保留什么？',
      'What must you keep when assessing a changed-speed orbit?',
      [
        [
          '出发位置、速度方向大小、引力条件',
          'Start position, velocity vector and gravity conditions',
        ],
        ['只保留速度数字', 'Speed number alone'],
        ['只保留圆形画框', 'Circular drawing frame'],
      ],
      0,
      '运动初态与力的条件缺一不可。',
      'Initial state and force conditions are both necessary.',
    ],
  }),
  make({
    id: 'gravitation-stay-over-one-longitude',
    kind: 'gravitation-satellite',
    minutes: 24,
    title: [
      '卫星在天上不动，真的没有运动吗？',
      'A satellite stays in one sky position. Is it motionless?',
    ],
    subtitle: [
      '把绕行和自转放在同一时钟上。',
      'Put orbit and body rotation on one clock.',
    ],
    hook: [
      '有些通信卫星似乎一直待在天空同一个方向。它们不是悬停发动机在不停托着吗？先做一个会转的小天体，在表面贴一个亮点，再让三颗圆轨道卫星与它一起转。',
      'Some communication satellites seem to stay in one direction in the sky. Does an engine keep holding them up? Make a rotating miniature body, mark a bright surface point, and compare three circular satellites with that rotation.',
    ],
    prediction: [
      '在同一个源外，圆轨道半径更大，周期？',
      'Around the same source, a larger circular radius gives what period?',
    ],
    predictions: [
      ['更长', 'Longer'],
      ['更短', 'Shorter'],
      ['相同', 'The same'],
    ],
    explore: [
      '比较r=1.5、2、3 m，μ=8，中心体每2π s转一圈。卫星初速按圆轨道条件自动设定。读两种周期和相对地面转角，注意紫色地面经度线与卫星的位置关系。',
      'Compare r=1.5,2,3 m with μ=8; the body rotates once per 2π s. Initial speeds automatically satisfy circular conditions. Read both periods and relative ground angle, and compare the purple ground-longitude line with satellite position.',
    ],
    concept: [
      '理想圆轨道v=√(μ/r)，T=2π√(r³/μ)：半径更大，速率更低，路程更长，周期也更长。若赤道正向圆轨道与中心体自转周期相同，卫星保持同一地面经度；地面参考系里位置固定，在中心惯性参考系仍在运动。“同周期”只是条件的一部分，方向、轨道平面与圆形条件也重要。',
      'Circular speed is √(μ/r), with T=2π√(r³/μ). Larger radius means lower speed, a longer path and a longer period. An equatorial prograde circle matching body rotation retains ground longitude: stationary relative to the ground, moving in the central inertial frame. Matching period is only one condition; direction, orbital plane and circularity matter too.',
    ],
    formula: [
      'T=2π√(r³/μ)；同步圆轨道r=(μ/ω²)^(1/3)',
      'T=2π√(r³/μ); synchronous circular r=(μ/ω²)^(1/3)',
    ],
    example: [
      'μ=8、ω=1 rad/s时，同步半径2 m，卫星速率2 m/s，周期约6.283 s；r=1.5的周期约4.081 s，会领先地面标记；r=3的周期约11.543 s，会落后。这些是虚构小系统的数值。',
      'For μ=8 and ω=1 rad/s, synchronous radius is 2 m, speed 2 m/s and period about 6.283 s. At r=1.5, period is about 4.081 s, gaining on the marker. At r=3, period is about 11.543 s, falling behind. These numbers belong to a fictional miniature system.',
    ],
    misconception: [
      '“相对地面不动，就没有引力或速度。”它仍有切向速度与朝中心的加速度。把任意倾斜椭圆调成同周期，也不能保证在天空某一点静止。',
      '“Stationary relative to ground means no gravity or velocity.” Tangent velocity and inward acceleration remain. Giving an inclined ellipse the same period does not hold it at one sky position.',
    ],
    realWorld: [
      '通信场景让“相对谁”变成实用问题。真实地球同步任务有更多条件与扰动，本实验只教周期、方向和相对位置，不提供工程高度或控制方案。',
      'Communication makes reference frames practical. Real Earth-synchronous missions involve further conditions and perturbations; this lab teaches period, direction and relative position, not engineering altitude or control.',
    ],
    summary: [
      '固定地面经度是一种相对运动关系，不是没有运动。',
      'Fixed ground longitude is a relative-motion relation, not absence of motion.',
    ],
    homeExperiment: [
      '在纸圆上画一个表面点和外部卫星，分别用箭头注明转向。用同一个计时步画四个位置，检查同周期同方向时两点与中心是否保持一条线。',
      'Draw a surface point and external satellite, mark their directions, then sketch four positions at equal times. Check whether equal period and direction keep them aligned with the centre.',
    ],
    vocabulary: [
      ['卫星周期', 'Satellite period'],
      ['自转', 'Rotation'],
      ['地面经度', 'Ground longitude'],
      ['同步', 'Synchronous'],
    ],
    questions: [
      [
        '半径两倍，同一μ下周期倍数？',
        'Double radius at fixed μ. Period factor?',
        [
          ['2', '2'],
          ['√8', '√8'],
          ['1/2', '1/2'],
        ],
        1,
        'T与r的3/2次方成正比。',
        'T scales with r to the power 3/2.',
      ],
      [
        '相对地面固定的卫星，在中心参考系？',
        'Ground-fixed satellite in the central frame?',
        [
          ['仍在绕行', 'Still orbiting'],
          ['完全静止', 'Completely stationary'],
          ['引力为0', 'Zero gravity'],
        ],
        0,
        '参考系不同，运动描述不同。',
        'Different reference frames give different motion descriptions.',
      ],
      [
        '要固定地面经度，本实验条件还包括？',
        'What else permits fixed ground longitude here?',
        [
          ['任何方向与平面', 'Any direction and plane'],
          ['只有相同质量', 'Equal mass only'],
          ['赤道、正向、圆轨道', 'Equatorial, prograde, circular'],
        ],
        2,
        '周期不是唯一条件。',
        'Period is not the only condition.',
      ],
    ],
    exit: [
      '天空同方向的通信卫星怎样解释？',
      'How explain a communication satellite in one sky direction?',
      [
        [
          '绕行与地面自转匹配，仍受引力',
          'Orbit matches ground rotation while gravity still acts',
        ],
        ['太空无引力，所以悬停', 'No gravity in space allows hovering'],
        ['不用看参考系', 'Reference frame is irrelevant'],
      ],
      0,
      '把周期匹配、几何条件与参考系连起来。',
      'Connect period matching, geometry and reference frame.',
    ],
  }),
  make({
    id: 'gravitation-escape-needs-an-energy-ledger',
    kind: 'gravitation-escape',
    minutes: 27,
    title: [
      '已经向外飞，为什么还可能回来？',
      'Already flying outward: why might it return?',
    ],
    subtitle: [
      '从有限动画走向能量判断的逃逸概念。',
      'Use energy to judge escape beyond a finite animation.',
    ],
    hook: [
      '把球抛上去，刚离手时它向上，并不代表它会永远离开。探测器飞离天体也是同一个问题，只是引力随距离减弱。我们用一张有正负号的能量账，判断动画看不到的遥远将来。',
      'A thrown ball initially rises without leaving forever. A probe departing a body raises the same question, with gravity weakening over distance. A signed energy ledger lets us judge a future beyond the animation window.',
    ],
    prediction: [
      '探测器正在向外走，就能证明它逃逸了吗？',
      'Does outward motion prove a probe escapes?',
    ],
    predictions: [
      ['能，方向就够了', 'Yes; direction is enough'],
      ['不能，还要检查总能量与条件', 'No; check total energy and conditions'],
      ['只要引力减弱就能', 'Yes if gravity weakens'],
    ],
    explore: [
      '从r₀=2 m径向向外，μ=8，比较初速1.5、√8、3.5 m/s。读K、负的U、E和径向速度正负。低速例回到表面前结束；其他例只观察8 s。自由初速试2.75：窗口里仍向外，但它真的逃逸吗？',
      'Launch radially from r₀=2 m with μ=8, comparing 1.5,√8,3.5 m/s. Read K, negative U, E and signed radial velocity. The slow case ends before surface impact; other windows last 8 s. Try 2.75: still outward in the window, but is it escaping?',
    ],
    concept: [
      '把无穷远势能约定为0，U=−GMm/r。无空气与后续推进时，E=½mv²−GMm/r守恒。这个无遮挡径向模型里，E<0意味着有有限最远距离、最终回返；E=0是临界逃逸，速率在遥远处趋近0；E>0到遥远处仍有剩余动能。门槛v逃=√(2GM/r₀)，不依赖小探测器质量。逃逸不是引力突然消失，也不是到8 s就抵达无穷远。',
      'Set U=0 at infinity, giving U=−GMm/r. Without air or later thrust, E=½mv²−GMm/r is conserved. In this unobstructed radial model, E<0 gives a finite furthest distance and eventual return. E=0 is threshold escape with speed tending to zero far away. E>0 retains kinetic energy far away. The threshold √(2GM/r₀) is independent of small probe mass. Gravity does not abruptly vanish, nor does 8 s reach infinity.',
    ],
    formula: ['E=½mv²−μm/r；v逃=√(2μ/r₀)', 'E=½mv²−μm/r; v(escape)=√(2μ/r₀)'],
    example: [
      'r₀=2、μ=8、m=1：初始U=−4 J。v₀=1.5时K=1.125、E=−2.875 J；v₀=√8时K=4、E=0；v₀=3.5时K=6.125、E=2.125 J，遥远处趋近速率√4.25≈2.062 m/s。2.75的E为−0.21875 J，动画虽仍外行，却最终回返。',
      'At r₀=2,μ=8,m=1, initial U=−4 J. For 1.5 m/s, K=1.125 and E=−2.875 J; for √8, K=4 and E=0; for 3.5, K=6.125 and E=2.125 J, with asymptotic speed √4.25≈2.062 m/s. At 2.75, E=−0.21875 J: outward in the window, but eventual return.',
    ],
    misconception: [
      '“远处引力小，所以所有抛出都会逃逸。”减弱的引力仍能累计改变运动。也别把逃逸速度当成发动机任何时刻必须维持的速度：本实验是一次初速给定后无推进的理想模型。',
      '“Weak gravity far away lets every launch escape.” Weakening gravity still changes motion cumulatively. Escape speed is not a speed an engine must continuously maintain; this ideal lab supplies initial speed once, then no thrust.',
    ],
    realWorld: [
      '逃逸把“现在看见什么”与“模型能判断什么”分开。实际航天推进、空气、其他天体、轨道方向及碰撞条件更复杂，这里用径向初态建立能量判断的第一步。',
      'Escape separates current observation from model prediction. Real missions include thrust, air, other bodies, trajectory direction and impacts; radial launch supplies a first energy-based judgement.',
    ],
    summary: [
      '有限向外轨迹不证明逃逸；先声明零点与条件，再查E。',
      'Finite outward motion does not prove escape. State the zero and conditions, then inspect E.',
    ],
    homeExperiment: [
      '画三本初始能量账：K分别1.125、4、6.125 J，U都−4 J。相加后用“回返、临界、仍有剩余速率”解释三种结局。不要实际投掷高速物体来模仿。',
      'Draw three initial ledgers with K=1.125,4,6.125 J and U=−4 J. Add them and explain return, threshold and remaining speed. Use paper rather than throwing high-speed objects.',
    ],
    vocabulary: [
      ['逃逸', 'Escape'],
      ['无穷远零点', 'Zero at infinity'],
      ['束缚', 'Bound'],
      ['趋近速率', 'Asymptotic speed'],
    ],
    questions: [
      [
        '本模型E<0，但探测器此刻向外，最终？',
        'Here E<0 but current motion is outward. Eventually?',
        [
          ['一定逃逸', 'Must escape'],
          ['引力消失', 'Gravity disappears'],
          ['有限最远处后回返', 'Returns after finite furthest distance'],
        ],
        2,
        '负总能量无法到达U=0且K≥0的无穷远状态。',
        'Negative total energy cannot reach infinity with U=0 and nonnegative K.',
      ],
      [
        '初始U=−4 J，K=4 J，属于？',
        'Initial U=−4 J,K=4 J. Which case?',
        [
          ['临界逃逸', 'Threshold escape'],
          ['负能量回返', 'Negative-energy return'],
          ['能量8 J', 'Energy 8 J'],
        ],
        0,
        'E=K+U=0，不是把两个大小相加。',
        'E=K+U=0; do not add absolute magnitudes.',
      ],
      [
        '同处探测质量翻倍，逃逸门槛？',
        'Double small probe mass at the same location. Escape threshold?',
        [
          ['两倍', 'Twice'],
          ['不变', 'Unchanged'],
          ['一半', 'Half'],
        ],
        1,
        '能量条件里的m约去。',
        'Mass cancels in the energy condition.',
      ],
    ],
    exit: [
      '一段8 s向外动画，怎样支持逃逸结论？',
      'How support an escape claim from an 8 s outward animation?',
      [
        [
          '结合无推进、无遮挡径向条件与非负E',
          'Use no-thrust unobstructed radial conditions and nonnegative E',
        ],
        ['只看终点离得更远', 'Only check a more distant endpoint'],
        ['假定远处没有引力', 'Assume no gravity far away'],
      ],
      0,
      '结论依据守恒模型与条件，而不是动画长度。',
      'The conclusion rests on conservation and conditions, not animation length.',
    ],
  }),
  make({
    id: 'gravitation-weightless-still-attracted',
    kind: 'gravitation-weightless',
    minutes: 24,
    title: [
      '航天员浮起来，是引力消失了吗？',
      'An astronaut floats. Did gravity disappear?',
    ],
    subtitle: [
      '把引力、支持力和共同自由落体分开。',
      'Separate gravity, support and shared free fall.',
    ],
    hook: [
      '站在秤上，脚被地板托着。若一间理想小舱和你一起下落，秤还需要托住你吗？再把直线下落换成绕行：舱和乘客都在持续“落”，它们之间却可以没有挤压。',
      'On a scale, the floor supports your feet. If an ideal small cabin falls with you, does its scale need to support you? Replace straight falling by orbiting: cabin and passenger keep falling while neither presses on the other.',
    ],
    prediction: [
      '共同自由下落时，秤读0，乘客受到的引力？',
      'A shared free fall gives zero scale reading. Gravity on the passenger?',
    ],
    predictions: [
      ['仍存在', 'Still present'],
      ['必定为0', 'Must be zero'],
      ['质量也为0', 'Mass is also zero'],
    ],
    explore: [
      '完整比较静止地板、共同下落、共同绕行，先区分Fg与N。前两例g=10，第三例g=2 m/s²；观察时长分别1 s、1 s和四分之一圈。换乘客质量，检查引力改变而自由加速度不变。',
      'Compare stationary support, shared fall and shared orbit; distinguish Fg from N. The first two use g=10, the third g=2 m/s². Durations are 1 s,1 s and a quarter orbit. Change passenger mass: force changes while free acceleration does not.',
    ],
    concept: [
      '秤测的是接触支持力N。静止地板上，N抵消引力，实际加速度0；共同自由落体时，舱与乘客都由引力加速，理想秤不需要额外托住乘客，N=0。轨道是持续改变方向的自由落体，附近仍有引力。“失重”在这里指没有接触支撑的感觉或读数，并不表示质量消失，也不表示引力为0。真实舱内会有小扰动和不同位置的潮汐差别，本图忽略它们。',
      'A scale measures contact normal N. On a stationary floor, support balances gravity and actual acceleration is zero. In shared free fall, cabin and passenger accelerate under gravity together, so the ideal scale need not support the passenger: N=0. Orbiting is free fall with changing direction and nonzero nearby gravity. Weightlessness here means absent contact support, not lost mass or gravity. Real cabins have small disturbances and tidal differences, omitted here.',
    ],
    formula: [
      '静止支撑：N=mg；共同自由落体：N=0，a=g',
      'Stationary support: N=mg; shared free fall: N=0, a=g',
    ],
    example: [
      '2 kg乘客在g=10处：静止时Fg=20 N、N=20 N、a=0；共同下落时Fg仍20 N，但N=0、a向下10 m/s²。r=2、μ=8的共同圆轨道里，Fg=4 N、N=0，向心加速度2 m/s²。三个秤读数不等于三个引力。',
      'A 2 kg passenger at g=10 has Fg=20 N,N=20 N,a=0 when supported. In shared fall, Fg remains 20 N but N=0 and a is 10 m/s² downward. In the shared r=2,μ=8 orbit, Fg=4 N,N=0 and inward acceleration is 2 m/s². Scale readings and gravity are different quantities.',
    ],
    misconception: [
      '“秤为0，所以Fnet为0，航天员不加速。”秤只测一种接触力；引力仍提供合力。“浮着就没有质量。”质量仍影响惯性与受到的引力大小。',
      '“Zero scale means zero net force and no acceleration.” The scale measures one contact interaction; gravity still provides net force. “Floating means no mass.” Mass still governs inertia and gravitational-force magnitude.',
    ],
    realWorld: [
      '这把电梯秤读数课延伸到轨道生活。舱内失重现象能用共同运动解释；若改变舱的推进加速度，乘客接触与读数就可能重新出现。',
      'This extends the elevator-scale lesson to orbital life. Shared motion explains floating; changing cabin thrust acceleration can reintroduce contact and scale readings.',
    ],
    summary: [
      '秤支持力为0，不代表引力、质量或实际加速度为0。',
      'Zero scale normal does not imply zero gravity, mass or actual acceleration.',
    ],
    homeExperiment: [
      '在纸上画三个乘客受力图：静止时上下等大；下落时只画向下引力；绕行时只画向心引力。给每图另写秤读数，别进行跳落、抛人或失重模仿。',
      'Draw three passenger force diagrams: equal upward/downward forces when supported, gravity alone in a fall, inward gravity alone in orbit. Write scale reading separately; use drawings instead of jumps or drop imitations.',
    ],
    vocabulary: [
      ['失重', 'Weightlessness'],
      ['支持力', 'Normal force'],
      ['共同自由落体', 'Shared free fall'],
      ['潮汐差别', 'Tidal differences'],
    ],
    questions: [
      [
        '共同下落的2 kg乘客，g=10，秤与引力？',
        'Shared fall: 2 kg,g=10. Scale and gravity?',
        [
          ['都0', 'Both zero'],
          ['N=0，Fg=20 N', 'N=0,Fg=20 N'],
          ['N=20 N，Fg=0', 'N=20 N,Fg=0'],
        ],
        1,
        '支持作用可为0，引力仍在。',
        'Support can vanish while gravity remains.',
      ],
      [
        '乘客质量翻倍，共同自由落体加速度？',
        'Double passenger mass in shared free fall. Acceleration?',
        [
          ['两倍', 'Twice'],
          ['一半', 'Half'],
          ['在本模型中相同', 'Same in this model'],
        ],
        2,
        '引力与惯性质量同倍增加，F/m不变。',
        'Force and mass scale together, leaving F/m unchanged.',
      ],
      [
        '航天员绕行时N=0，但为什么速度方向改变？',
        'With N=0 in orbit, why does velocity direction change?',
        [
          ['引力提供朝中心的合力', 'Gravity supplies inward net force'],
          ['惯性制造向心力', 'Inertia creates centripetal force'],
          ['其实不改变方向', 'Direction does not change'],
        ],
        0,
        '不用额外支持力，引力即可造成轨道加速度。',
        'Gravity can produce orbital acceleration without extra support.',
      ],
    ],
    exit: [
      '解释航天员浮着的最佳说法？',
      'Best explanation of an astronaut floating?',
      [
        [
          '舱与乘客共同自由落体，没有通常的接触支撑',
          'Cabin and passenger share free fall without usual contact support',
        ],
        ['太空所有地方引力为0', 'Gravity is zero everywhere in space'],
        ['航天员质量消失', 'Astronaut mass disappears'],
      ],
      0,
      '把共同运动、秤测什么和引力是否存在一起说清。',
      'Connect shared motion, what scales measure and continuing gravity.',
    ],
  }),
];
