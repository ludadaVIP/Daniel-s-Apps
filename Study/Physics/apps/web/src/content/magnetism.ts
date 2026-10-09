import { t, q, type Lesson } from './schema';

export const magnetismLessons: Lesson[] = [
  {
    id: 'magnetic-material-clues',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-materials',
    minutes: 17,
    title: t(
      '冰箱磁贴，为什么不粘住所有金属？',
      'Why does a fridge magnet not stick to every metal?',
    ),
    subtitle: t(
      '同一磁铁、同一距离，让材料来回答。',
      'Keep magnet and distance fixed; let the material answer.',
    ),
    hook: t(
      '磁贴能留在钢门上，却不能留在铝片上。两者都是金属，也都能导电。究竟是哪一种性质不同？',
      'A magnet stays on a steel door but not an aluminium sheet. Both are metals and conduct electricity. Which property differs?',
    ),
    prediction: t(
      '换成同样大小的普通钢片、铝片、木片，哪些会被明显吸引？',
      'Which equal-size sample will be noticeably attracted: plain steel, aluminium or wood?',
    ),
    predictions: [
      t('只有这块普通钢片', 'Only this plain-steel sample'),
      t('所有金属', 'Every metal'),
      t('所有固体', 'Every solid'),
    ],
    explore: t(
      '完整检查三块规定材料。磁铁和距离保持相同；先记看到的吸引，再谈材料。图中的样品被支架固定，箭头只表示作用，不是飞行轨迹。',
      'Inspect all three prescribed samples with the same magnet and separation. Record attraction before explaining material. Samples are held; arrows indicate interaction, not a flight trajectory.',
    ),
    concept: t(
      '磁铁能对某些材料产生明显磁性作用。铁、许多普通钢材等是熟悉的例子；铝虽然导电，在这个日常测试中不会像钢片那样被明显吸住。“金属”“导体”“明显被磁铁吸引”是三个不同判断。材料组成、处理和形状也会影响真实观察。',
      'Magnets have noticeable magnetic interactions with certain materials, including iron and many plain steels. Aluminium conducts electricity but is not noticeably held like steel in this everyday test. Metal, conductor and noticeably attracted are different judgments. Composition, treatment and shape also affect real observations.',
    ),
    example: t(
      '两块都是金属：钢片导电且明显被吸引，铝片导电却不明显被吸引。因此“能导电”不能单独推出“能被磁贴吸住”。',
      'Both samples are metals: steel conducts and is noticeably attracted; aluminium conducts without noticeable attraction here. Conductivity alone does not predict a magnet sticking.',
    ),
    misconception: t(
      '吸住了就断言“纯铁”，或没吸住就断言“不是金属”，都超出了证据。不同不锈钢也不一定给相同结果。',
      'Attraction does not prove pure iron; lack of sticking does not prove a non-metal. Different stainless steels need not behave alike.',
    ),
    realWorld: t(
      '回收分选可以先用磁性筛出一部分含铁物料，再用其他方法区分铝、铜等。一步测试提供线索，不包办全部识别。',
      'Recycling can separate some iron-containing material magnetically, then use other methods for aluminium or copper. One test provides a clue rather than a complete identification.',
    ),
    summary: t(
      '磁性与导电性是不同性质；公平比较材料，别把“金属”当成统一答案。',
      'Magnetic attraction and conductivity differ. Compare materials fairly instead of treating all metals alike.',
    ),
    homeExperiment: t(
      '和成人用一块普通、完整、较大的包覆冰箱磁贴，试已知的普通钢表面、铝箔和木板。保持接近距离，不让物品被提起掉落。写“明显吸引/没有明显吸引”；不要用小强磁珠，也别靠近电子设备或医疗植入设备。',
      'With an adult, use an ordinary intact large covered fridge magnet near known plain steel, aluminium foil and wood. Keep the approach distance alike and do not lift objects. Record noticeable/no noticeable attraction. Avoid small powerful magnetic beads and keep away from electronics or implanted medical devices.',
    ),
    vocabulary: [
      t('磁铁', 'magnet'),
      t('磁性材料', 'magnetic material'),
      t('导体', 'conductor'),
      t('材料线索', 'material clue'),
    ],
    questions: [
      q(
        '铝片能导电，但磁贴不明显吸住它。说明什么？',
        'Conducting aluminium is not noticeably held. What follows?',
        [
          ['所有导体都被吸住', 'All conductors are held'],
          ['导电性和磁性不是同一性质', 'Conductivity and magnetism differ'],
          ['铝一定是木头', 'Aluminium must be wood'],
        ],
        1,
        '两种性质要分别用证据判断。',
        'Judge the two properties with separate evidence.',
      ),
      q(
        '要比较材料，哪项保持相同？',
        'For a material comparison, keep what unchanged?',
        [
          ['磁铁和接近距离', 'Magnet and approach distance'],
          ['每次换更强磁铁', 'Use a stronger magnet each time'],
        ],
        0,
        '同时换磁铁就无法把差异只归给材料。',
        'Changing the magnet adds another possible cause.',
      ),
      q(
        '某物被吸引，能直接认定纯铁吗？',
        'Does attraction identify pure iron?',
        [
          ['能，只有纯铁会这样', 'Yes; only pure iron behaves so'],
          [
            '不能，许多材料可能有类似表现',
            'No; several materials can behave similarly',
          ],
        ],
        1,
        '磁性测试是线索，不是成分检测。',
        'A magnetic test is a clue, not a composition analysis.',
      ),
    ],
    exit: q(
      '一把金属勺子没被磁贴吸住，合理结论是？',
      'A metal spoon is not held. A justified conclusion?',
      [
        ['它肯定不导电', 'It certainly does not conduct'],
        [
          '这次条件下没有明显吸引',
          'No noticeable attraction under these conditions',
        ],
      ],
      1,
      '保留实际观察，别添加未测试的性质。',
      'Keep the observed result without adding untested properties.',
    ),
  },
  {
    id: 'magnetic-pole-pairs',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-poles',
    minutes: 18,
    title: t(
      '翻个方向，磁铁怎么从拉变成推？',
      'Turn a magnet around: why does pulling become pushing?',
    ),
    subtitle: t(
      '看相对的磁极，也看分段后留下什么。',
      'Compare facing poles and what remains after an imagined split.',
    ),
    hook: t(
      '两块条形磁铁靠近时，有时想合在一起，有时好像互相躲开。材料没换，只翻转了一块。',
      'Two bar magnets sometimes pull together and sometimes push apart. Their material is unchanged; only one was turned around.',
    ),
    prediction: t(
      '把相对的N/S换成N/N，作用会怎样？',
      'What happens when facing N/S is changed to N/N?',
    ),
    predictions: [
      t('仍吸引', 'Still attraction'),
      t('必定没有作用', 'No interaction'),
      t('变成排斥', 'Repulsion'),
    ],
    explore: t(
      '检查异极相对、同极相对，以及一块磁铁想象分成两段。磁铁被固定，不根据箭头估计速度。分段只是图示；不要实际敲碎、锯切磁铁。',
      'Inspect opposite poles, like poles and an imagined split into two pieces. Magnets are held; arrows do not predict speed. Splitting is a diagram only; do not break or saw magnets.',
    ),
    concept: t(
      '条形磁铁有北极N和南极S；N指自由转动时的寻北端。同极排斥，异极吸引。把一块常见磁铁分成两段，每段仍有N与S，新截面也形成磁极；并不是一段只剩N、另一段只剩S。',
      'A bar magnet has north-seeking N and south-seeking S poles. Like poles repel; opposite poles attract. Each piece of a split ordinary magnet still has both poles, including new poles at the cut faces. Splitting does not isolate N from S.',
    ),
    example: t(
      '左磁铁从左到右是S→N，右磁铁也是S→N：空隙两侧是N和S，会吸引。翻转右磁铁后变成N→S，空隙两侧变成N和N，会排斥。',
      'With both bars arranged S→N from left to right, N and S face across the gap and attract. Reversing the right bar makes N face N, producing repulsion.',
    ),
    misconception: t(
      '磁铁吸引普通钢片，不说明钢片原来就是一个固定S极。磁铁可以诱导钢中的磁性；“被吸引”不足以判断对象的磁极。',
      'Attraction to plain steel does not mean it was originally a fixed S pole. A magnet can induce magnetism in steel; attraction alone cannot identify a pole.',
    ),
    realWorld: t(
      '磁吸门扣利用吸引；磁性拼搭玩具要考虑端面朝向。薄片冰箱磁贴可能有多条交替磁极，不能把每片都当成简单的两端条形磁铁。',
      'Magnetic catches use attraction, and magnetic construction pieces depend on facing orientation. Thin fridge magnets may have alternating pole strips rather than the simple end-pole pattern of a bar.',
    ),
    summary: t(
      '先找空隙两侧的磁极：同极推开、异极拉近；分段仍成对。',
      'Identify the facing poles: alike repel, opposite attract; pieces retain pairs.',
    ),
    homeExperiment: t(
      '用纸画两块S/N条形磁铁，保持左块不动，翻转右块并画作用方向。再把一块纸磁铁分成两张，各自补齐S与N。真实磁铁不需要切割。',
      'Draw two paper S/N bars. Keep the left one fixed, reverse the right and draw interaction arrows. Divide one paper bar into two pieces and add both poles to each. Real magnets need no cutting.',
    ),
    vocabulary: [
      t('北极', 'north pole'),
      t('南极', 'south pole'),
      t('排斥', 'repulsion'),
      t('成对', 'paired poles'),
    ],
    questions: [
      q(
        '空隙两侧是N与N，作用是？',
        'Facing N and N gives?',
        [
          ['吸引', 'Attraction'],
          ['无作用', 'No interaction'],
          ['排斥', 'Repulsion'],
        ],
        2,
        '同极排斥；不看颜色猜，要看磁极标签。',
        'Like poles repel; inspect pole labels rather than guessing by colour.',
      ),
      q(
        '一块普通磁铁分两段，每段有什么？',
        'Each piece of a split ordinary magnet has?',
        [
          ['只有一个极', 'One pole only'],
          ['都有N和S', 'Both N and S'],
        ],
        1,
        '新截面产生新的相对磁极。',
        'New opposite poles form at the cut faces.',
      ),
      q(
        '磁铁吸住钢片，能确定钢片原本是S极吗？',
        'Attracted steel: was it certainly an existing S pole?',
        [
          ['不能，可能是诱导磁性', 'No; induced magnetism is possible'],
          ['能，吸引足以判断', 'Yes; attraction is enough'],
        ],
        0,
        '要把磁铁间极性判断与材料吸引分开。',
        'Separate pole tests between magnets from attraction to materials.',
      ),
    ],
    exit: q(
      '两块条形磁铁从吸引变排斥，最先检查？',
      'Attraction changes to repulsion. Check first?',
      [
        ['相对端的磁极朝向', 'Facing-pole orientation'],
        ['一定有一块变成木头', 'One certainly became wood'],
      ],
      0,
      '翻转方向就能改变相对磁极。',
      'Turning a bar changes which poles face.',
    ),
  },
  {
    id: 'magnetic-field-map',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-field',
    minutes: 20,
    title: t(
      '没有碰到磁铁，指南针怎么知道朝哪边？',
      'Without touching a magnet, how does a compass find its direction?',
    ),
    subtitle: t(
      '用小磁针做地图，磁感线只是画法。',
      'Map with a small needle; field lines are a drawing tool.',
    ),
    hook: t(
      '把小指南针放到磁铁上方、右侧、斜上方，它的N端不指向同一个方向。周围的“方向地图”是什么？',
      'A small compass above, beside and diagonally from a magnet points in different directions. What kind of direction map surrounds the magnet?',
    ),
    prediction: t(
      '小磁针的N端会永远朝磁铁的N端吗？',
      'Will the small needle’s N end always aim at the magnet’s N end?',
    ),
    predictions: [
      t('会，N只找N', 'Yes; N seeks N'),
      t(
        '不会，要看所在处的磁场方向',
        'No; it follows the field at its location',
      ),
      t('磁场只能在磁铁里面', 'Fields exist only inside magnets'),
    ],
    explore: t(
      '检查三个相同半径的位置，再自由移动探针或翻转磁铁。N端与该点方向一致。画面保留外部远场近似，灰区内只提示内部返回方向；金点是在巡查地图，不是粒子沿线飞行。',
      'Inspect three equal-radius locations, then move the probe or reverse the magnet. Its N end follows the local field. The exterior uses a far-field approximation; the shaded interior only indicates return direction. The gold marker inspects the map, not a particle flight.',
    ),
    concept: t(
      '磁场描述空间各处的磁性作用。小而自由转动的试探磁针可标出方向，规定它的N端指向磁场方向。磁感线把这些局部方向连成图：外部从N到S，内部从S回N，构成闭合线；线不是实体细绳，也不是电荷运动轨迹。线不相交，因为同一点的磁场方向不能同时有两个。',
      'A magnetic field describes magnetic interactions throughout space. A small freely turning test needle marks direction, defined by its N end. Field-line drawings connect local directions: outside N→S, inside S→N, forming closed lines. They are neither physical strings nor charge trajectories, and do not cross because the field at one point has one direction.',
    ),
    example: t(
      '本图磁铁右端为N、左端为S。正上方的N端朝左，右侧的N端朝右；它们都符合各自位置的外部磁场，不是互相矛盾。',
      'Here N is on the right and S on the left. The needle above points left; the needle to the right points right. Both follow their local external field rather than contradicting each other.',
    ),
    misconception: t(
      '铁屑或磁针显示线索，却没有把看不见的磁场“做成线”。画得更密通常用于表示较强场，但随意多画几根线不会让真实磁铁变强。',
      'Filings and needles reveal clues without turning the field into physical lines. Denser drawings conventionally indicate stronger fields; adding drawn lines does not strengthen a real magnet.',
    ),
    realWorld: t(
      '指南针、磁场传感器和磁性工具都依赖所在位置的场。工具工程师关心的不只是“有没有磁铁”，还关心位置和方向。',
      'Compasses, magnetic sensors and tools depend on the field at their location. Engineers care about position and direction as well as the presence of a magnet.',
    ),
    summary: t(
      '小磁针标出局部方向；磁感线是方向与强弱的地图，不是实体。',
      'A small needle marks local direction; field lines map direction and strength rather than physical objects.',
    ),
    homeExperiment: t(
      '把实验三个位置和N端方向画到纸上，用小箭头拼出地图。若家里有普通指南针，由成人帮助，在远离电器和强磁铁的桌面先观察；没有器材也可用模型数据完成方向图。',
      'Draw the three model locations and N-tip directions on paper. If an ordinary compass is available, observe it with an adult on a table away from appliances and powerful magnets. Model directions also support the paper map without equipment.',
    ),
    vocabulary: [
      t('磁场', 'magnetic field'),
      t('磁感线', 'field line'),
      t('试探磁针', 'test needle'),
      t('局部方向', 'local direction'),
    ],
    questions: [
      q(
        '磁场方向由小磁针哪端指示？',
        'Which end defines field direction?',
        [
          ['N端', 'N end'],
          ['S端', 'S end'],
        ],
        0,
        '使用N端作为统一约定，便于比较地图。',
        'The N end provides a consistent mapping convention.',
      ),
      q(
        '磁感线是什么？',
        'What are field lines?',
        [
          ['看不见的实体绳子', 'Invisible physical strings'],
          ['电荷一定经过的路', 'Mandatory charge paths'],
          ['磁场的表示方法', 'A representation of a field'],
        ],
        2,
        '绘图能帮助理解，却不是空间中的实体。',
        'A useful drawing is not a physical object in space.',
      ),
      q(
        '同一磁铁旁两支磁针朝向不同，可能吗？',
        'Can two needles near one magnet point differently?',
        [
          ['不可能，所有点方向相同', 'No; every location is identical'],
          ['可能，所在位置不同', 'Yes; their locations differ'],
        ],
        1,
        '磁场是每个位置都有值的地图。',
        'A field assigns a value to each location.',
      ),
    ],
    exit: q(
      '把图上磁感线数量翻倍，真实磁场会翻倍吗？',
      'Double the drawn lines. Does the real field double?',
      [
        ['会，图控制磁铁', 'Yes; drawings control magnets'],
        ['不会，要改变真实源的条件', 'No; the physical source must change'],
      ],
      1,
      '模型的表示方式与被表示的真实现象要分开。',
      'Distinguish representation from the phenomenon it represents.',
    ),
  },
  {
    id: 'magnetic-earth-compass',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-earth',
    minutes: 18,
    title: t(
      '地图没转，指南针为什么偏了？',
      'The map stayed still. Why did the compass turn?',
    ),
    subtitle: t(
      '地磁背景与附近磁源共同决定朝向。',
      'Earth’s background and nearby sources together set direction.',
    ),
    hook: t(
      '同一张纸地图，旁边放近一个磁性物品，指南针偏了。把它移远，又接近原来的朝向。地球有没有突然转向？',
      'A nearby magnetic object turns the compass on an unchanged paper map. Moving it away restores nearly the old direction. Did Earth suddenly change direction?',
    ),
    prediction: t(
      '附近磁源移远后，指南针更接近哪种结果？',
      'Moving the nearby source farther makes the compass closer to which result?',
    ),
    predictions: [
      t('被干扰时的朝向', 'The disturbed heading'),
      t('只有背景场时的朝向', 'The background-only heading'),
      t('必定停止转动、没有方向', 'No direction at all'),
    ],
    explore: t(
      '比较只有背景、干扰源在1倍距离、移到3倍距离。这里规定背景水平场朝地图北，干扰场朝东；这是观察矢量相加的局部模型，不是真实地点的导航读数。',
      'Compare background only, an interfering source at one relative distance and at three distances. The assigned horizontal background points map-north and the disturbance east. This local vector-addition model is not a real navigation reading.',
    ),
    concept: t(
      '地球有磁场，自由磁针会沿当地合成磁场转向。地图的地理北与当地磁北通常有偏差，称磁偏角。附近磁铁、钢件或电流还会增加干扰。地理北附近呈磁南极性质，因此吸引指南针的寻北端；地理名称与条形磁铁的极性名称不能混为一谈。',
      'Earth has a magnetic field, and a free needle aligns with the local total field. Geographic map-north generally differs from local magnetic north by declination. Nearby magnets, steel or currents can add interference. The region near geographic north has south-pole magnetic character, attracting the north-seeking end; geographic names and bar-magnet polarity are different conventions.',
    ),
    example: t(
      '本模型背景北向为1，近处东向干扰为2，合成朝向偏东约63.4°。移到3倍距离时，规定偶极干扰降到2/27，偏转约4.2°。这些相对场数只说明比较，不能用来校准真实指南针。',
      'The assigned northward background is 1 and nearby eastward disturbance 2, giving about 63.4° east of north. At three distances the assigned dipole disturbance becomes 2/27 and the heading about 4.2°. These relative values illustrate a comparison rather than calibrating a real compass.',
    ),
    misconception: t(
      '指南针不是总指向纸上印的N，也不是一直朝某一个远处物体。它响应所在处的场；先排查附近磁源，再谈路线。',
      'A compass does not automatically follow a printed N or simply aim at one distant object. It responds to the local field; check nearby sources before using a heading.',
    ),
    realWorld: t(
      '徒步时远离磁扣、扬声器和带磁物品再读指南针，使用当地地图资料理解磁偏角。手机指南针也可能受附近磁源影响。',
      'A hiking compass is read away from magnetic catches, speakers and magnetic objects, with local map information for declination. Phone compasses can also suffer nearby interference.',
    ),
    summary: t(
      '指南针看的是当地合成磁场；地图北、磁北和干扰要分清。',
      'A compass follows the local total field; distinguish map-north, magnetic north and interference.',
    ),
    homeExperiment: t(
      '在纸地图上画一根向北的背景箭头，再加一根向东的干扰箭头，连接成合成方向。比较较长与较短干扰。不要用课堂模型替代实际户外导航。',
      'Draw a northward background arrow and an eastward disturbance on a paper map, then construct their combined direction. Compare a longer and shorter disturbance. This classroom model does not replace actual outdoor navigation.',
    ),
    vocabulary: [
      t('地磁场', 'Earth’s magnetic field'),
      t('地理北', 'geographic north'),
      t('磁偏角', 'declination'),
      t('干扰', 'interference'),
    ],
    questions: [
      q(
        '指南针在附近磁源作用下偏转，说明地理北改变了吗？',
        'Does nearby interference change geographic north?',
        [
          ['没有，合成磁场变了', 'No; the total field changed'],
          ['改变了，地图必须转', 'Yes; the map must turn'],
        ],
        0,
        '区分地图参考方向与磁针读数。',
        'Distinguish the map reference from a magnetic reading.',
      ),
      q(
        '模型干扰源移远，哪个量减小？',
        'Which decreases as the model source moves away?',
        [
          ['规定的背景北向分量', 'The assigned northward background'],
          ['干扰场的东向分量', 'The eastward disturbance'],
        ],
        1,
        '背景保持相同，才能把偏转变化归给干扰。',
        'The fixed background isolates the effect of interference.',
      ),
      q(
        '真实地图北与当地磁北关系如何？',
        'How do real map-north and local magnetic north compare?',
        [
          ['永远重合', 'Always identical'],
          ['都不存在', 'Neither exists'],
          ['可能有磁偏角', 'There can be declination'],
        ],
        2,
        '地图与磁针使用不同的参考，需当地资料。',
        'Map and compass references differ; local information matters.',
      ),
    ],
    exit: q(
      '指南针读数突然变了，合理的先行检查？',
      'A compass reading suddenly changes. Check first?',
      [
        [
          '附近磁扣、钢件和电器',
          'Nearby magnetic catches, steel and appliances',
        ],
        ['宣布地球磁场消失', 'Declare Earth’s field gone'],
      ],
      0,
      '先检查近处条件，避免跳到没有证据的大解释。',
      'Check nearby conditions before adopting an unsupported large explanation.',
    ),
  },
  {
    id: 'magnetic-current-around-wire',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-wire',
    minutes: 19,
    title: t(
      '没有新增磁铁，通电怎么让磁针转向？',
      'No extra magnet: how can current turn a needle?',
    ),
    subtitle: t(
      '同一导线，比较断电、正向、反向。',
      'Compare no current, forward current and reversed current in one wire.',
    ),
    hook: t(
      '磁针放在导线旁，电流一改变，它的朝向也改变。电与磁原来能连接起来。',
      'A needle beside a wire changes direction when current changes. Electricity and magnetism are connected.',
    ),
    prediction: t(
      '把同一导线电流反向，导线磁场方向会怎样？',
      'Reverse current in the same wire. What happens to its field direction?',
    ),
    predictions: [
      t('保持完全相同', 'Entirely unchanged'),
      t('方向反转', 'Direction reverses'),
      t('只改变导线颜色', 'Only the wire colour changes'),
    ],
    explore: t(
      '完整检查无电流、出纸面、入纸面三种情况。圆圈显示导线自己的磁场；磁针看的是加上固定背景后的总场。自由改变距离，保持电流方向不变。',
      'Inspect no current, out-of-page and into-page current. Circles show the wire’s own field; the needle follows that field plus a fixed background. Change distance freely while keeping current direction fixed.',
    ),
    concept: t(
      '电流会产生磁场。长直导线周围的场沿绕线的圆方向；用右手拇指指传统电流，弯曲四指指绕线场方向。⊙表示朝你出纸面，⊗表示远离你入纸面。电流反向，导线场反向；距离增大时场减弱。断电消去导线场，不会消去原来的地磁等背景。',
      'Current creates a magnetic field. Around a long straight wire, its direction follows circles: right thumb along conventional current, curled fingers along the field. ⊙ means out of the page toward you; ⊗ means into it. Reversing current reverses the wire field, and increasing distance weakens it. Removing current removes its field, not the existing background.',
    ),
    example: t(
      '本图磁针在导线正上方：出纸面电流给向左的导线场，加上向北背景，N端偏左约45°。反向后导线场向右，N端偏右约45°。没有导线电流时，仍沿背景向北。',
      'The model needle is above the wire. Out-of-page current gives a leftward wire field, added to a northward background, deflecting about 45° left. Reversed current deflects about 45° right. Without wire current it still follows the northward background.',
    ),
    misconception: t(
      '圆形磁感线不是电子绕导线外面跑。电荷在导体内运动，而场存在导线周围的空间。右手规则采用传统电流方向。',
      'Circular field lines are not electrons orbiting outside the wire. Charges move within the conductor while the field exists around it. The right-hand rule uses conventional current.',
    ),
    realWorld: t(
      '电流检测可以利用导线附近的磁场，某些仪器不用断开主通路就能感知电流。后续电磁铁把这种效果集中到许多线圈中。',
      'Current can be detected through the nearby magnetic field; some instruments sense it without opening the main path. Electromagnets concentrate the effect using many turns.',
    ),
    summary: t(
      '电流生磁；方向随电流反向；磁针响应合成场。',
      'Current creates a field whose direction reverses with current; a needle follows the total field.',
    ),
    homeExperiment: t(
      '画⊙与⊗两种导线截面，用右手比出环绕方向，再画同一上方位置的小磁针。只做手势和纸图，不把电池直接接到裸导线，也不测试家用电线。',
      'Draw ⊙ and ⊗ wire cross-sections, use your right hand to show the circular directions, then draw needles at the same upper location. Use gestures and paper rather than shorting a battery with bare wire or testing household cables.',
    ),
    vocabulary: [
      t('传统电流', 'conventional current'),
      t('右手规则', 'right-hand rule'),
      t('长直导线', 'long straight wire'),
      t('合成场', 'total field'),
    ],
    questions: [
      q(
        '右手拇指沿什么方向？',
        'The right thumb follows which direction?',
        [
          ['电子漂移方向', 'Electron drift'],
          ['纸上的北方', 'North on the page'],
          ['传统电流方向', 'Conventional current'],
        ],
        2,
        '先明确电流约定，才能一致判断磁场。',
        'Use the current convention to determine field consistently.',
      ),
      q(
        '电流反向、位置不变，导线场怎样变？',
        'Same location, reversed current. The wire field?',
        [
          ['方向反转', 'Reverses direction'],
          ['永远不变', 'Never changes'],
        ],
        0,
        '改变方向，不是把原有背景也反向。',
        'The wire direction changes without reversing the background.',
      ),
      q(
        '断掉导线电流，磁针是否一定没有朝向？',
        'With no wire current, must the needle lose all direction?',
        [
          ['一定没有', 'Always'],
          ['不一定，背景场还在', 'No; background fields remain'],
        ],
        1,
        '观察所有场源，不能只盯着一根导线。',
        'Consider all sources rather than only one wire.',
      ),
    ],
    exit: q(
      '移远后磁针偏转较小，能说明电流一定变小吗？',
      'Less deflection farther away: must current be smaller?',
      [
        ['不能，距离也影响场', 'No; distance affects the field'],
        ['能，距离无关', 'Yes; distance is irrelevant'],
      ],
      0,
      '先控制位置，再用偏转比较电流。',
      'Control location before comparing currents by deflection.',
    ),
  },
  {
    id: 'magnetic-controlled-coil',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-coil',
    minutes: 20,
    title: t(
      '电磁铁能开关，怎样公平比较它的强弱？',
      'A switchable magnet: how can we compare its strength fairly?',
    ),
    subtitle: t(
      '把电流、匝数、铁芯分开改变。',
      'Change current, turns and core separately.',
    ),
    hook: t(
      '电磁起重设备通电时抓住钢件。线圈匝数多一点、加铁芯、增大电流，这些是不是同一个改变？',
      'An electromagnetic crane grips steel when powered. Extra turns, an iron core and more current are different changes—how can they be compared?',
    ),
    prediction: t(
      '相同匝数与电流，模型加软铁芯后怎样？',
      'With matching turns and current, adding the model soft-iron core does what?',
    ),
    predictions: [
      t('一定消除磁场', 'Always removes the field'),
      t('只影响颜色', 'Only changes colour'),
      t('增强规定的磁场指标', 'Increases the assigned field indicator'),
    ],
    explore: t(
      '比较断电铁芯、通电空芯、相同电流的铁芯。再用自由控制单独改匝数或电流。这里用理想受控电流源维持电流；不能把“匝数增加”自动当作真实固定电池下同样的比较。',
      'Compare unpowered iron core, powered air core and iron core at matching current. Then vary turns or current separately. An ideal regulated source maintains current; adding turns on a real fixed battery is not automatically the same controlled comparison.',
    ),
    concept: t(
      '多匝线圈的磁场相互叠加。相同结构、受控电流下，增加匝数或电流通常增强场；适合的铁芯还能增强。线圈绕向与电流方向共同决定N/S，反向电流会交换磁极。理想软铁模型断电后不计剩磁；真实材料可能留有磁性并出现饱和。',
      'Fields from multiple turns add. At controlled current and matching geometry, more turns or current generally strengthens the field; a suitable core can enhance it. Winding and current direction determine N/S, so reversal exchanges poles. The ideal soft-iron model omits remanence after switch-off; real materials can retain magnetism and saturate.',
    ),
    example: t(
      '模型20匝、0.2 A空芯定为相对指标1；同样条件加规定增强系数3的铁芯为3。空芯20匝、0.4 A为2。数字是规定的线性比较，不是“能提起几枚回形针”的预测。',
      'The assigned 20-turn, 0.2 A air-core indicator is 1; the matched core with assigned factor 3 gives 3. An air core at 20 turns and 0.4 A gives 2. These linear comparison values do not predict how many paper clips can be lifted.',
    ),
    misconception: t(
      '接同一电池而增加导线长度，电阻也可能增大、电流可能减小。要研究匝数本身，需要控制或记录电流，不能同时变了两件事还只归给匝数。',
      'More wire on the same battery can increase resistance and reduce current. Investigating turns requires controlled or recorded current rather than attributing two changing factors to turns alone.',
    ),
    realWorld: t(
      '电磁继电器和电铃把可控制的磁性作用变成开合或敲击；设备设计还要考虑温升、铁芯和机械回位。手机扬声器也使用电流与磁场相互作用。',
      'Relays and bells turn controlled magnetic interaction into switching or striking. Their design also considers heating, cores and mechanical return. Speakers use interactions between current and magnetic fields too.',
    ),
    summary: t(
      '电磁铁可控制；比较匝数、铁芯或电流时，先固定另外的条件。',
      'Electromagnets can be controlled; fix other conditions when comparing turns, core or current.',
    ),
    homeExperiment: t(
      '用纸卷画一个线圈，标匝数、电流箭头与两端N/S，再反向电流交换标签。记录哪一项改变、哪些不变。不要照图把电池直接接上自制线圈；实际装置需要限流和成人指导。',
      'Draw a coil on a paper tube, label turns, current direction and N/S ends, then swap the pole labels when current reverses. Record changed and fixed conditions. Do not connect a battery directly to a homemade coil; real apparatus needs current limiting and adult guidance.',
    ),
    vocabulary: [
      t('电磁铁', 'electromagnet'),
      t('匝数', 'turn count'),
      t('铁芯', 'iron core'),
      t('受控电流', 'regulated current'),
    ],
    questions: [
      q(
        '研究铁芯作用，应该保持什么？',
        'To investigate the core, keep what alike?',
        [
          ['匝数与电流', 'Turns and current'],
          ['同时把匝数翻倍', 'Double turns too'],
        ],
        0,
        '匹配其他条件才能归因于铁芯。',
        'Matching other conditions isolates the core effect.',
      ),
      q(
        '同一电池增加匝数，为什么不能直接断言更强？',
        'Why not guarantee stronger magnetism by adding turns on one battery?',
        [
          ['电流永远不会变', 'Current never changes'],
          [
            '线长、电阻、电流也可能改变',
            'Wire length, resistance and current can change',
          ],
        ],
        1,
        '实际电路条件与受控电流模型不同。',
        'A real circuit need not match a regulated-current model.',
      ),
      q(
        '同样绕向反转电流，磁极怎样？',
        'Same winding, reversed current. The poles?',
        [
          ['消失且没有任何场', 'Disappear permanently'],
          ['保持原标签', 'Keep their labels'],
          ['N/S交换', 'N/S exchange'],
        ],
        2,
        '场方向改变，所以两端极性交换。',
        'Reversing the field exchanges end polarity.',
      ),
    ],
    exit: q(
      '模型相对场指标3，能认定提起3枚回形针吗？',
      'Indicator 3: can it certify lifting three paper clips?',
      [
        ['能，指标就是枚数', 'Yes; the indicator counts clips'],
        [
          '不能，还需真实几何、材料和力的证据',
          'No; actual geometry, material and force evidence are needed',
        ],
      ],
      1,
      '相对场指标不是载荷测量。',
      'A relative field indicator is not a load measurement.',
    ),
  },
  {
    id: 'magnetic-motor-turning',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-motor',
    minutes: 21,
    title: t(
      '电池没转，小风扇为什么能转？',
      'The battery does not spin. How does a small fan turn?',
    ),
    subtitle: t(
      '看两侧相反的力，追踪换向与能量。',
      'Inspect opposite side forces, commutation and energy.',
    ),
    hook: t(
      '电流经过磁场中的线圈，两侧受力不同，形成转动作用。怎样让它跨过半圈后继续转，而不是只停在一个角度？',
      'A current-carrying coil in a field experiences opposite forces that produce torque. How can it continue after half a turn rather than settle at one angle?',
    ),
    prediction: t(
      '磁场不变，反转供电极性，理想电动机驱动方向怎样？',
      'Same field, reversed supply polarity: the ideal drive direction?',
    ),
    predictions: [
      t('仍保持原方向', 'Unchanged'),
      t('驱动方向反转', 'Reversed'),
      t('电池开始机械转动', 'The battery rotates mechanically'),
    ],
    explore: t(
      '比较正向供电、无供电、反向供电。俯视图中⊙/⊗是两侧导线电流，竖直箭头是受力，背景场向右。完整播放巡查一圈规定位置；角度由模型控制，不求真实转速或加速度。',
      'Compare forward supply, no supply and reverse supply. In the top view, ⊙/⊗ show active-wire currents; vertical arrows show forces and the background field points right. A full run inspects one controlled turn, not a solved RPM or acceleration.',
    ),
    concept: t(
      '磁场对通电导线可有力。在线圈两侧，这些力形成转动作用；电动机把电源提供的能量转成机械输出，也有热等其他去向。这个简单直流模型用换向器每半圈改变线圈电流，使驱动转矩保持同一方向。死点的瞬时驱动转矩为零，持续转动还依赖惯性或多线圈等设计。',
      'A field can exert force on current-carrying wires. Opposite forces on a coil produce torque. A motor transfers electrical input into mechanical output plus other transfers such as heating. The simple DC model commutates coil current each half-turn to maintain torque direction. Instantaneous torque is zero at dead points; inertia or multiple coils help real motors continue.',
    ),
    example: t(
      '同一磁场、同一角度，正向供电给一个方向的转动作用，反向供电给相反方向；两侧力也反向。无供电表示没有本模型的电磁驱动，不表示原来正在转的风扇会瞬间停止。',
      'At matching field and angle, reversing the supply reverses torque and both side forces. No supply means no electromagnetic drive in this model, not that an already spinning fan stops instantly.',
    ),
    misconception: t(
      '电动机不是靠“磁场吃掉电流”转动。电荷仍沿回路通过，能量转移到机械运动和热。线圈电流换向与电池整体极性反转也不是同一件事。',
      'A motor does not turn by consuming current. Charge continues around the circuit while energy transfers to motion and heating. Commutation inside the coil differs from reversing the whole battery supply.',
    ),
    realWorld: t(
      '玩具车、风扇和水泵需要机械输出。不同电动机可能用电子控制而不是图中的机械换向器；带保护电子电路的真实设备也不能靠随意反接试方向。',
      'Toy cars, fans and pumps need mechanical output. Other motors can use electronic control instead of the drawn mechanical commutator. Real devices with protective electronics should not be arbitrarily rewired to test reversal.',
    ),
    summary: t(
      '磁场中的通电线圈受到转动作用；换向维持驱动，输入电能有机械与热等去向。',
      'A current-carrying coil in a field experiences torque; commutation maintains drive and electrical energy transfers to motion and heat.',
    ),
    homeExperiment: t(
      '观察现成小风扇正常开关前后，记录“供电状态”和“正在怎样运动”两栏，注意断电后是否仍短暂转动。按产品正常方式操作，不拆外壳、不反接电池，也不把手伸入叶片。',
      'Observe a ready-made small fan using its normal switch. Keep supply state and observed motion in separate columns, including brief coasting after switch-off. Do not open it, reverse its battery or touch blades.',
    ),
    vocabulary: [
      t('电动机', 'motor'),
      t('转矩', 'torque'),
      t('换向器', 'commutator'),
      t('机械输出', 'mechanical output'),
    ],
    questions: [
      q(
        '这个电动机的主要能量方向是？',
        'The motor’s main energy direction?',
        [
          ['机械输入到电输出', 'Mechanical to electrical'],
          ['无需输入产生能量', 'Energy without input'],
          ['电输入到机械输出', 'Electrical to mechanical'],
        ],
        2,
        '机械运动来自电源能量，不是磁场凭空供能。',
        'Motion uses source energy rather than energy created by the field.',
      ),
      q(
        '简单直流电动机的换向器做什么？',
        'What does the simple DC commutator do?',
        [
          [
            '每半圈调整线圈电流方向',
            'Changes coil-current direction each half-turn',
          ],
          ['消耗掉全部电荷', 'Consumes every charge'],
        ],
        0,
        '驱动作用要在转过半圈后保持目标方向。',
        'Drive must retain its intended direction after half a turn.',
      ),
      q(
        '断电就一定立即静止吗？',
        'Does switch-off guarantee immediate rest?',
        [
          ['一定，惯性消失', 'Yes; inertia vanishes'],
          ['不一定，可能继续滑转', 'No; it may coast'],
        ],
        1,
        '去掉驱动与把已有运动瞬间清零不同。',
        'Removing drive differs from instantaneously removing motion.',
      ),
    ],
    exit: q(
      '模型一圈用2.4秒播放，能当成真实电动机转速吗？',
      'A displayed turn takes 2.4 s. Is it a real motor speed?',
      [
        ['不能，这是规定角度的巡查', 'No; it inspects prescribed angles'],
        ['能，播放时长就是实测', 'Yes; playback is measurement'],
      ],
      0,
      '真实运动还需电源、负载、惯性和损耗模型或测量。',
      'Real motion needs source, load, inertia and loss modelling or measurement.',
    ),
  },
  {
    id: 'magnetic-generator-energy',
    stage: 3,
    unit: 'magnetism',
    kind: 'magnetic-generator',
    minutes: 21,
    title: t(
      '手摇灯没装电池，能量从哪里来？',
      'A hand-powered light: where does the energy come from?',
    ),
    subtitle: t(
      '改变磁通情况，再区分电压与闭合电流。',
      'Change flux conditions, then distinguish voltage from closed-circuit current.',
    ),
    hook: t(
      '磁铁静静放着不会一直供电；转动线圈却能出现电压。转动的手、磁场与灯，谁提供能量，谁帮助转移？',
      'A stationary magnet does not continuously supply electricity. Rotating a coil can create voltage. What roles do the hand, field and light play in the energy transfer?',
    ),
    prediction: t(
      '旋转线圈产生电压时，断开负载回路会怎样？',
      'A rotating coil creates voltage. What happens if its load circuit is open?',
    ),
    predictions: [
      t('电压必定消失', 'Voltage necessarily vanishes'),
      t('有电压一定有负载电流', 'Voltage always means load current'),
      t(
        '可有电压，但理想负载电流为零',
        'Voltage can remain with zero ideal load current',
      ),
    ],
    explore: t(
      '比较静止闭合、旋转闭合、旋转开路。完整检查规定1.25圈：波形使用规定的物理时间，播放压缩为2.4秒。滑环保留交流输出；它不是上一课维持单向驱动的换向器。',
      'Compare stationary/closed, rotating/closed and rotating/open. Inspect an assigned 1.25-turn window with physical-time waveforms compressed into 2.4 s. Slip rings retain AC output, unlike the previous commutator used for one-direction drive.',
    ),
    concept: t(
      '当穿过线圈的磁通情况改变时，可以产生感应电压。旋转使线圈相对磁场的方向不断变化；闭合通路中便可有电流。静止在不变场中不持续产生感应电压；开路可有电压而没有理想负载电流。简单滑环发电机输出方向随半圈改变，属于交流。电输出来自机械输入；真实设备还存在摩擦、线圈发热等损耗。',
      'Changing magnetic flux through a coil can induce voltage. Rotation changes coil orientation relative to the field; a closed path can then carry current. A stationary coil in an unchanging field has no sustained induced voltage; an open circuit can have voltage without ideal load current. Simple slip-ring generators produce alternating output. Electrical output comes from mechanical input, with friction and coil heating in real devices.',
    ),
    example: t(
      '本模型每秒转1圈，电压峰值约0.503 V。接10 Ω理想负载，电流峰值约0.050 A；开路后电压峰值相同，负载电流为0。规定窗口内负载能量约0.0158 J，由同等机械输入提供；真实手摇灯含整流与储能，不能照此当作产品性能。',
      'At one turn per second the model peak voltage is about 0.503 V. A 10 Ω ideal load gives about 0.050 A peak current; an open path retains voltage but carries no load current. About 0.0158 J reaches the load during the assigned window from equal ideal mechanical input. Real hand-powered lights include rectification and storage, so these are not product-performance predictions.',
    ),
    misconception: t(
      '“有磁铁就有免费电”不成立。需要磁通变化，还需要机械等能量输入。停止手摇后灯仍亮，也可能是储能在继续释放，不说明发电机停止后仍凭空发电。',
      'A magnet does not provide free electricity. Flux must change and energy must enter mechanically or otherwise. A light remaining on after cranking may use stored energy rather than continued generation without input.',
    ),
    realWorld: t(
      '自行车发电装置、风机和水轮发电机，把运动来源连接到电输出。风或流水提供机械能，磁场与线圈帮助完成转换；能量账仍需平衡。',
      'Bicycle generators, wind turbines and hydroelectric machines connect motion to electrical output. Wind or water supplies mechanical energy while fields and coils enable conversion; the energy ledger still balances.',
    ),
    summary: t(
      '磁通变化可产生电压；闭合才有理想负载电流；发电的能量来自输入。',
      'Changing flux can create voltage; a closed path allows ideal load current; generation requires energy input.',
    ),
    homeExperiment: t(
      '若有现成手摇灯，与成人按说明正常观察“摇动/暂停”及灯的表现，不拆开。若没有，画风机、水轮与电灯之间的能量箭头，标出输入和可能的热损耗。不要用课堂数值给真实产品定性能。',
      'If a ready-made hand-powered light is available, observe cranking and pauses with an adult following its instructions, without opening it. Otherwise draw energy arrows from wind or water through a generator to a light, including possible heating. Classroom numbers do not rate real products.',
    ),
    vocabulary: [
      t('发电机', 'generator'),
      t('感应电压', 'induced voltage'),
      t('交流', 'alternating current'),
      t('滑环', 'slip ring'),
    ],
    questions: [
      q(
        '静止线圈在不变磁场中，持续感应电压如何？',
        'Stationary coil in an unchanged field: sustained induced voltage?',
        [
          ['没有', 'None'],
          ['永远有', 'Always present'],
        ],
        0,
        '关键是磁通变化，不是仅有磁铁。',
        'Flux change matters, not merely a magnet’s presence.',
      ),
      q(
        '开路旋转时，模型的电压和负载电流是？',
        'Rotating/open model: voltage and load current?',
        [
          ['都必定为零', 'Both necessarily zero'],
          ['电压可有，负载电流为零', 'Voltage can exist; load current is zero'],
          ['电流不变但没有电压', 'Unchanged current without voltage'],
        ],
        1,
        '电压与通路中的电流要分别判断。',
        'Judge voltage and current in a path separately.',
      ),
      q(
        '发电机给负载的能量主要从哪里来？',
        'Where does the generator’s load energy come from?',
        [
          ['磁铁被消耗掉', 'The magnet being consumed'],
          ['没有任何输入', 'No input'],
          ['机械输入', 'Mechanical input'],
        ],
        2,
        '发电不是创造能量，是转移和转换。',
        'Generation transfers and converts energy rather than creating it.',
      ),
    ],
    exit: q(
      '暂停手摇后灯还亮，首先考虑？',
      'A light stays on after cranking stops. Consider first?',
      [
        ['储能部件可能仍在释放能量', 'Stored energy may still be released'],
        ['永动已经成功', 'Perpetual motion has succeeded'],
      ],
      0,
      '检查完整装置的能量储备，不跳到凭空产生能量。',
      'Check the complete device’s stores rather than assuming energy without input.',
    ),
  },
];
