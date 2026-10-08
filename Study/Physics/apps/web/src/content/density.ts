import { t, q, type Lesson } from './schema';
export const densityLessons: Lesson[] = [
  {
    id: 'same-volume-different-mass',
    stage: 1,
    unit: 'density',
    kind: 'density-compare',
    minutes: 16,
    title: t(
      '一样大，为什么拿起来不一样？',
      'Same size: why do they feel different?',
    ),
    subtitle: t(
      '先把大小控制住，再比较质量。',
      'Keep volume fixed before comparing mass.',
    ),
    hook: t(
      '两块积木看起来一样大，一块木头、一块金属。放到天平上，质量却不同。材料内部的“每一份空间”藏了什么线索？',
      'Two matching-size blocks, wood and metal, have different masses. What clue hides in each equal amount of space?',
    ),
    prediction: t(
      '比较两种材料，怎样更容易看出“每份空间的质量”？',
      'How can you compare mass in equal amounts of space for two materials?',
    ),
    predictions: [
      t('控制体积相同，再看质量', 'Keep volumes equal and compare mass'),
      t('只挑大块的', 'Just choose the larger piece'),
      t('只看颜色', 'Use colour alone'),
    ],
    explore: t(
      '先记录20 cm³木块与20 cm³铝块，比较同体积质量。再记录40 cm³铝块，看看同材料变大后，质量与“每cm³的质量”怎样变化。',
      'Record 20 cm³ wood and aluminium samples. Then record 40 cm³ aluminium. Compare total mass with mass per cm³ when the same material gets larger.',
    ),
    concept: t(
      '体积描述占了多少空间，质量描述物体的惯性和物质多少。同样体积的不同材料，质量可能不同；同材料、均匀且无空洞的块变大，体积和质量会一起增加。把质量除以体积，能比较每份空间的质量，这就是密度。不能只凭拿起来重就判断密度大。',
      'Volume describes occupied space; mass describes inertia and amount of matter. Equal volumes of different materials can have different masses. For a uniform material without cavities, increasing the piece increases mass and volume together. Mass divided by volume compares mass per amount of space: density. Feeling heavier alone does not establish greater density.',
    ),
    example: t(
      '教学样品木头密度取0.6 g/cm³、铝取2.7 g/cm³：20 cm³木块12 g，铝块54 g。40 cm³铝块108 g，质量虽翻倍，每cm³仍2.7 g。这些数值是规定的样品模型，不代表所有木材或实际样品。',
      'Teaching samples use wood 0.6 g/cm³ and aluminium 2.7 g/cm³. At 20 cm³ their masses are 12 and 54 g. Aluminium at 40 cm³ is 108 g; each cm³ still has 2.7 g. These are prescribed sample values, not all woods or measured specimens.',
    ),
    misconception: t(
      '质量大不一定密度大：一个很大的木块可以比小金属块质量大。孔洞、混合材料、吸水和温度也会影响物体的平均密度与测量结果；本实验先用均匀、干燥实心块。',
      'Greater mass need not mean greater density: a large wood block can outweigh a small metal block. Cavities, mixtures, absorbed water and temperature affect average density or measurements. Here we begin with uniform, dry solid blocks.',
    ),
    realWorld: t(
      '同样大小的把手用木头或金属，质量可能不同。设计便于携带的物品时，要同时看材料密度与用了多少体积。',
      'Matching-size wooden and metal handles can have different masses. Portable designs need both material density and the volume used.',
    ),
    summary: t(
      '公平比较材料，先控制体积；同材料变大，质量变大但密度可以不变。',
      'Match volume to compare materials fairly. A larger piece can have more mass without a new density.',
    ),
    homeExperiment: t(
      '找大小相近的实心木块和金属小物件，比较拿起来的感觉，再问“体积真的一样吗？”只有感觉不能当作密度测量。没有合适物件，可画一大一小两块同材料，解释为什么质量会变而密度不必变。',
      'Compare similarly sized solid wood and metal objects, then ask if their volumes really match. Feeling is not a density measurement. Alternatively draw two sizes of one material and explain changing mass with unchanged density.',
    ),
    vocabulary: [
      t('体积', 'volume'),
      t('密度', 'density'),
      t('均匀材料', 'uniform material'),
      t('公平比较', 'fair comparison'),
    ],
    questions: [
      q(
        '同体积木块12 g、铝块54 g，哪块密度大？',
        'Equal volumes: wood 12 g, aluminium 54 g. Which has greater density?',
        [
          ['铝块', 'Aluminium'],
          ['无法比较', 'Cannot compare'],
        ],
        0,
        '体积相同，质量较大者每份空间的质量较大。',
        'With equal volume, greater mass means more mass per amount of space.',
      ),
      q(
        '同材料实心块体积翻倍，质量也翻倍，密度怎样？',
        'A uniform solid’s volume and mass both double. Its density?',
        [
          ['翻倍', 'Doubles'],
          ['不变', 'Unchanged'],
        ],
        1,
        '质量/体积的比值没变。',
        'The mass/volume ratio stays unchanged.',
      ),
      q(
        '大木块比小金属块重，能直接断定木头密度大吗？',
        'A large wood block outweighs a small metal block. Is wood necessarily denser?',
        [
          ['不能，还要比较体积', 'No: volume also matters'],
          ['能', 'Yes'],
        ],
        0,
        '不同体积时，只看总质量不够。',
        'Different volumes make total mass alone insufficient.',
      ),
    ],
    exit: q(
      '想比较两种材料的密度，哪个实验更公平？',
      'Which is a fairer density comparison?',
      [
        [
          '同体积、同条件的实心样品，分别量质量',
          'Equal-volume solid samples under matched conditions; measure mass',
        ],
        ['一个大一个小，只看谁重', 'Different sizes; compare only mass'],
      ],
      0,
      '控制体积与样品条件，或同时测量质量和体积再算比值。',
      'Control volume and specimen conditions, or measure both mass and volume and compare ratios.',
    ),
  },
  {
    id: 'density-mass-over-volume',
    stage: 1,
    unit: 'density',
    kind: 'density-block',
    minutes: 18,
    title: t(
      '54 g的积木，怎样变成一个材料线索？',
      'How does a 54 g block become a material clue?',
    ),
    subtitle: t(
      '量三条边，用质量除以体积。',
      'Measure three edges; divide mass by volume.',
    ),
    hook: t(
      '你拿到一块5×2×2 cm的积木，天平显示54 g。单看54 g认不出材料；把它分成每cm³来比较呢？',
      'A block is 5×2×2 cm and 54 g. Mass alone gives little clue. What if you compare the mass for each cm³?',
    ),
    prediction: t(
      '5×2×2 cm块的体积是多少？',
      'What volume does a 5×2×2 cm block occupy?',
    ),
    predictions: [
      t('20 cm³', '20 cm³'),
      t('9 cm³', '9 cm³'),
      t('只看最长边5 cm', 'Use only the 5 cm edge'),
    ],
    explore: t(
      '记录短块的质量、三边、体积和密度；再记录同材料长块。最后切到kg/m³单位并记录，对照换算后每个量的单位。',
      'Record the short block’s mass, edges, volume and density; repeat for the longer block of the same material. Switch to kg/m³ and record again, checking all converted units.',
    ),
    concept: t(
      '规则长方体体积V=长×宽×高，三条边必须用同一长度单位。密度ρ=m/V，希腊字母ρ读作rho，表示质量和体积的比值。g除以cm³得到g/cm³；kg除以m³得到kg/m³。这个比值可以用来比较材料，但只测密度通常不能唯一认出成分。',
      'A rectangular block has V=length×width×height, using consistent length units. Density ρ=m/V; the Greek letter ρ (rho) represents the mass/volume ratio. g divided by cm³ gives g/cm³; kg divided by m³ gives kg/m³. Density helps compare materials, but usually cannot uniquely identify composition.',
    ),
    formula: t(
      'ρ = m / V · 密度 = 质量 ÷ 体积；长方体V = a×b×c',
      'ρ = m / V · density = mass / volume; rectangular volume V = a×b×c',
    ),
    example: t(
      '短块V=5×2×2=20 cm³，ρ=54÷20=2.7 g/cm³。长块V=10×2×2=40 cm³，ρ=108÷40仍2.7。1 g/cm³=1000 kg/m³，所以2.7 g/cm³=2700 kg/m³；54 g=0.054 kg、20 cm³=0.000020 m³，不能把g与m³混用后仍标kg/m³。',
      'Short block: V=20 cm³, ρ=54/20=2.7 g/cm³. Longer block: V=40 cm³ and ρ=108/40=2.7 again. 1 g/cm³=1000 kg/m³, so 2.7 becomes 2700 kg/m³. 54 g=0.054 kg and 20 cm³=0.000020 m³; do not mix unconverted g with m³ and label the result kg/m³.',
    ),
    misconception: t(
      '密度不是“质量×体积”，也不是体积/质量。体积不能只把三条边相加。换单位时数字变了，不代表材料变了；比较参考值要用相同单位。测量误差、温度或空洞也会改变得到的平均密度。',
      'Density is neither mass×volume nor volume/mass. Adding the three edges does not give volume. Changing unit numbers does not change the material; compare references using matching units. Measurement errors, temperature or cavities affect the average density obtained.',
    ),
    realWorld: t(
      '同样外形的零件可以选不同材料。质量和尺寸记录得清楚，才知道“轻”来自材料还是减少了体积。',
      'Matching-shape parts can use different materials. Clear mass and dimension records distinguish a less dense material from simply less volume.',
    ),
    summary: t(
      '先把质量、体积与单位量对，再算m/V；材料线索来自比值。',
      'Measure mass and volume with consistent units, then use m/V for a material clue.',
    ),
    homeExperiment: t(
      '找规则实心小块，用尺量三边，先只算体积；有合适量程的秤再量质量并计算密度。保留原始尺寸和质量，不拿圆角、空心或多材料物品假装规则实心块。工具不够可记录哪些量仍未知。',
      'Measure three edges of a small regular solid and calculate volume first. With a suitable scale, add mass and density. Keep raw readings; rounded, hollow or mixed objects need another model. Record what remains unknown if tools are unavailable.',
    ),
    vocabulary: [
      t('ρ（rho）', 'ρ (rho)'),
      t('长方体', 'rectangular solid'),
      t('比值', 'ratio'),
      t('单位换算', 'unit conversion'),
    ],
    questions: [
      q(
        '54 g÷20 cm³得到什么？',
        'What is 54 g / 20 cm³?',
        [
          ['2.7 g/cm³', '2.7 g/cm³'],
          ['1080 g·cm³', '1080 g·cm³'],
        ],
        0,
        '密度是质量除以体积，不是相乘。',
        'Density divides mass by volume, not multiplication.',
      ),
      q(
        '5、2、2 cm三条边，怎样算体积？',
        'How do 5, 2 and 2 cm edges give volume?',
        [
          ['相加得9 cm³', 'Add to obtain 9 cm³'],
          ['相乘得20 cm³', 'Multiply to obtain 20 cm³'],
        ],
        1,
        '三维空间用三条互相垂直的边相乘。',
        'Multiply the three perpendicular lengths for this rectangular volume.',
      ),
      q(
        '2.7 g/cm³换成2700 kg/m³，材料密度真的增大了吗？',
        'Does converting 2.7 g/cm³ to 2700 kg/m³ increase actual density?',
        [
          ['没有，只换了单位', 'No: only units changed'],
          ['增大1000倍', 'Yes, by 1000'],
        ],
        0,
        '同一个比值的不同单位表达，物理量没变。',
        'Different units express the same physical quantity.',
      ),
    ],
    exit: q(
      '同学把0.054 kg除以20 cm³，结果直接标kg/m³。问题在哪？',
      'A friend divides 0.054 kg by 20 cm³ and labels the result kg/m³. What is wrong?',
      [
        ['分母没换成m³，单位不匹配', 'The denominator was not converted to m³'],
        ['必须把质量加上体积', 'They should add mass and volume'],
      ],
      0,
      '必须转换体积，或把结果保留为kg/cm³，再正确换算。',
      'Convert the volume, or retain kg/cm³ and convert that ratio correctly.',
    ),
  },
  {
    id: 'irregular-object-density',
    stage: 1,
    unit: 'density',
    kind: 'density-displacement',
    minutes: 18,
    title: t(
      '形状不规则，材料线索还能量出来吗？',
      'An irregular shape: can you still find its material clue?',
    ),
    subtitle: t(
      '排开的水，要代表整个物体。',
      'Displacement must represent the whole object.',
    ),
    hook: t(
      '一块54 g的不规则物体，尺子量不出完整体积。量筒水位上升12 mL，就能直接说它有12 cm³吗？先看看它真的浸没了吗。',
      'An irregular object weighs 54 g. The cylinder rises 12 mL. Is its full volume necessarily 12 cm³? Check whether it is fully immersed.',
    ),
    prediction: t(
      '只浸没一部分物体，水位变化代表什么？',
      'If only part of an object is underwater, what does displacement describe?',
    ),
    predictions: [
      t('浸入水中的部分体积', 'The immersed portion’s volume'),
      t('一定是完整体积', 'Always the full volume'),
      t('物体质量', 'Its mass'),
    ],
    explore: t(
      '记录部分浸没、完全浸没无气泡、完全浸没但带气泡三种情况。质量保持54 g、初始水位40 mL，比较水位差和算出的表观密度。找出本模型可用于完整物体的读数。',
      'Record partial immersion, full immersion without bubbles, and full immersion with an attached bubble. Keep mass 54 g and initial water 40 mL. Compare displacement and apparent density; identify the usable reading for the whole object.',
    ),
    concept: t(
      '不规则且不溶解、不吸水的实心物体，可以先量干燥质量，再用排水测完整体积。完全浸没、没有附着气泡时，V物=末水位−初水位；1 mL=1 cm³。读弯月面时视线水平。浮着的物体只排开部分体积，要用合适的浸没方法并扣除辅助物的排水。本课用细线悬挂，忽略细线体积。',
      'For a solid that neither dissolves nor absorbs water, measure dry mass, then full volume by displacement. Fully immersed without attached bubbles, object volume is final minus initial water reading; 1 mL=1 cm³. Read the meniscus at eye level. A floating object displaces only part of its volume; immersion methods must account for helpers’ displacement. This model uses a negligible-volume thread.',
    ),
    formula: t(
      'V物 = V末 − V初；ρ = m / V物（满足完整浸没条件时）',
      'Vobject = Vfinal − Vinitial; ρ = m / Vobject (with valid full immersion)',
    ),
    example: t(
      '完全浸没无气泡：60−40=20 mL=20 cm³，54÷20=2.7 g/cm³。部分浸没：52−40=12，除得4.5，但不是全物体密度。带4 cm³附着气泡时：64−40=24，除得2.25；水位包含气泡排水，估算偏低。气泡体积为教学规定值。',
      'Full, bubble-free immersion: 60−40=20 mL=20 cm³; 54/20=2.7 g/cm³. Partial immersion gives 12 mL and 4.5, not whole-object density. A prescribed 4 cm³ attached bubble gives 24 mL and 2.25: extra bubble displacement makes the estimate low.',
    ),
    misconception: t(
      '算出一个数字不代表测量条件成立。未浸没、气泡、溶解、吸水、溅水或量筒量程不足，都可能破坏结果。异常读数要保留并解释，不要只留下符合猜想的数字。',
      'A calculated number does not establish valid measurement conditions. Partial immersion, bubbles, dissolution, absorption, splashes or an unsuitable cylinder can invalidate the result. Keep and explain problematic readings rather than only those matching a prediction.',
    ),
    realWorld: t(
      '材料侦探拿到不规则样品，也可以组合“质量”和“排开的水”取得线索；比较材料之前，先检查工具和操作有没有改变结论。',
      'A material detective can combine mass and displaced water for an irregular specimen. Check instruments and procedure before interpreting a material clue.',
    ),
    summary: t(
      '先检查浸没和气泡，再用水位差作体积；表观密度不一定是真密度。',
      'Check immersion and bubbles before using displacement; apparent density may be misleading.',
    ),
    homeExperiment: t(
      '由成人选不溶解、不吸水的小石子或金属件，有秤和合适量筒时量干燥质量、初末水位，保持完全浸没并检查气泡。不把电子设备或尖锐物泡水。工具不足时画三种条件，说明哪种水位差可代表完整体积。',
      'With an adult, choose a small non-absorbing, insoluble stone or metal object. Use suitable tools for dry mass and water readings; ensure full immersion without bubbles. Avoid electronics and sharp objects. Without tools, draw the three conditions and explain valid whole-volume displacement.',
    ),
    vocabulary: [
      t('排水法', 'displacement method'),
      t('浸没', 'immersion'),
      t('附着气泡', 'attached bubble'),
      t('表观密度', 'apparent density'),
    ],
    questions: [
      q(
        '无气泡完全浸没，水位40→60 mL，物体体积？',
        'Full bubble-free immersion: water 40→60 mL. Object volume?',
        [
          ['20 cm³', '20 cm³'],
          ['60 cm³', '60 cm³'],
        ],
        0,
        '只取水位变化，1 mL=1 cm³。',
        'Use the change; 1 mL=1 cm³.',
      ),
      q(
        '物体只浸入部分，能直接用水位差算完整密度吗？',
        'Can partial immersion directly give whole-object density?',
        [
          ['能', 'Yes'],
          ['不能，体积不完整', 'No: the volume is incomplete'],
        ],
        1,
        '完整质量除以部分体积，不能代表全物体。',
        'Whole mass divided by partial volume does not represent the whole object.',
      ),
      q(
        '同样质量，附着气泡让排水量偏大，算出的密度怎样？',
        'With unchanged mass, an attached bubble increases displacement. The calculated density?',
        [
          ['偏低', 'Too low'],
          ['偏高', 'Too high'],
        ],
        0,
        '分母偏大，质量/体积比值偏小。',
        'A larger denominator gives a smaller mass/volume ratio.',
      ),
    ],
    exit: q(
      '你的排水密度与参考值差很多，首先该做什么？',
      'Your displacement density differs greatly from a reference. What first?',
      [
        [
          '保留读数，检查单位、浸没和气泡，再重复',
          'Keep readings; check units, immersion and bubbles, then repeat',
        ],
        ['改成参考值，才算成功', 'Replace it with the reference to succeed'],
      ],
      0,
      '参考值不能替代证据；先调查操作与样品条件。',
      'A reference is not a replacement for evidence; inspect procedure and specimen conditions.',
    ),
  },
  {
    id: 'density-floating-comparison',
    stage: 1,
    unit: 'density',
    kind: 'density-float',
    minutes: 17,
    title: t(
      '同一块材料，换水就不沉了？',
      'Same solid: new water, new outcome?',
    ),
    subtitle: t('比较物体与液体的密度。', 'Compare solid and liquid density.'),
    hook: t(
      '一个塑料样品在淡水中沉，在规定盐水模型里却浮。没有换材料，也没有加壳，改变的线索在哪里？',
      'A plastic sample sinks in fresh water but floats in our salt-water model. Same material, no new shell. Which condition changed?',
    ),
    prediction: t(
      '实心块能否浮起来，只看它的质量大小就够吗？',
      'Is total mass alone enough to predict whether a solid floats?',
    ),
    predictions: [
      t('不够，要比较物体与液体密度', 'No: compare solid and liquid densities'),
      t('够，小物体永远浮', 'Yes: small objects always float'),
      t('只看名字是不是塑料', 'Use only the word plastic'),
    ],
    explore: t(
      '在淡水中记录0.6、1.00、1.02 g/cm³三种实心样品，再把同一1.02样品换到1.05 g/cm³盐水模型。体积固定20 cm³，比较浮、悬浮和沉的条件。',
      'Record solids of density 0.6, 1.00 and 1.02 g/cm³ in fresh water. Then move the same 1.02 sample into salt water of density 1.05. Hold solid volume at 20 cm³ and compare floating, neutral suspension and sinking.',
    ),
    concept: t(
      '本模型均匀实心块不吸水、不溶解，液体均匀、忽略表面张力。物体密度小于液体，可部分浸入时达到浮力与重力平衡；相等时，完全浸没后可悬浮；大于液体时，完全浸没的浮力仍不足，会下沉。更大体积带来更大质量，也能排开更多水，所以不是“大就一定沉”。',
      'For uniform non-absorbing, insoluble solids in uniform liquid, neglecting surface tension: density below the liquid allows balance with partial immersion; equal density permits fully submerged neutral suspension; greater density means full-submersion buoyancy is insufficient and the solid sinks. Larger volume means more mass and more displaced liquid, so size alone does not determine sinking.',
    ),
    example: t(
      '淡水取1.00 g/cm³。20 cm³、ρ=0.6木块质量12 g，浮时排开12 cm³水。1.00样品全浸没可悬浮。1.02塑料样品20.4 g，淡水最多排开20 g水，会沉；换成1.05盐水，完全浸没可排开21 g盐水，能在略少于全浸没时浮。盐水密度是规定模型值。',
      'Fresh water is prescribed as 1.00 g/cm³. A 20 cm³ wood sample at 0.6 has mass 12 g and floats displacing 12 cm³ water. A 1.00 sample can remain neutrally submerged. The 1.02 plastic sample is 20.4 g, but full fresh-water displacement is only 20 g, so it sinks. In 1.05 salt water, full displacement is 21 g, allowing floating just short of full immersion. Salt-water density is prescribed.',
    ),
    misconception: t(
      '不是所有塑料都浮，也不是所有木头都浮。船是空心结构，要比较含封闭空间的整体平均密度；本课不把实心钢块与钢船当作同一个体积模型。悬浮不是飘在水面，沉到底后还有底部支持，本演示不计算它。',
      'Not all plastics or woods float. A hollow boat requires an overall average density including its excluded space; a solid steel block and a steel ship are different volume models. Neutral suspension is not floating at the surface. A sunken block also has bottom support, not calculated here.',
    ),
    realWorld: t(
      '材料、内部空腔和液体条件都影响浮沉；回想泥船实验，形状改变了整体排水条件。想验证密度比较，先说明物体是实心还是空心。',
      'Material, cavities and liquid conditions affect flotation. Recall the clay boat: shape changed excluded volume. State whether an object is solid or hollow before applying a density comparison.',
    ),
    summary: t(
      '在本模型中，浮沉看物体密度与液体密度的比较；同一物体换液体，结果可以改变。',
      'In this model, compare solid and liquid density. The same object can behave differently in another liquid.',
    ),
    homeExperiment: t(
      '成人协助用浅水杯观察几件干燥小物件，预测后记录浮沉，并注明实心、空心或不确定。只用桌面浅水杯，不品尝实验液体。若比较盐水与淡水，要保留同一物体和实际配方；普通样品不保证会改变浮沉，没变化也记录。',
      'With an adult, observe dry small objects in a shallow cup: predict, record, and note solid, hollow or uncertain. Use a tabletop cup rather than deep water. For salt/fresh comparisons, keep the same object and record the recipe. An ordinary sample may not change outcome; record no change too.',
    ),
    vocabulary: [
      t('悬浮', 'neutral suspension'),
      t('液体密度', 'liquid density'),
      t('平均密度', 'average density'),
      t('浸入比例', 'submerged fraction'),
    ],
    questions: [
      q(
        'ρ物0.6、ρ水1.00，实心模型怎样？',
        'Solid density 0.6, liquid 1.00. Outcome?',
        [
          ['浮在水面，部分浸入', 'Floats with partial immersion'],
          ['一定沉到底', 'Must sink'],
        ],
        0,
        '物体密度小于液体，部分浸入就能平衡。',
        'Lower density allows balance with partial immersion.',
      ),
      q(
        'ρ物=ρ液，完全浸没后可怎样？',
        'Equal solid/liquid densities permit what when fully submerged?',
        [
          ['必须露出一半', 'Exactly half exposed'],
          ['悬浮', 'Neutral suspension'],
        ],
        1,
        '悬浮是完全浸没状态，不等于水面漂浮。',
        'Neutral suspension is fully submerged, not floating at the surface.',
      ),
      q(
        '同样1.02样品，水从1.00变成1.05，样品质量变了吗？',
        'Same 1.02 solid: liquid changes 1.00→1.05. Did solid mass change?',
        [
          ['没有，变的是液体密度', 'No: liquid density changed'],
          ['样品自动变轻', 'It automatically lost mass'],
        ],
        0,
        '本模型没有吸水溶解，质量不变；可排开液体的质量改变。',
        'Without absorption/dissolution, mass stays fixed; displaced liquid mass changes.',
      ),
    ],
    exit: q(
      '同学说“钢船能浮，所以实心钢块密度小于水”。问题在哪？',
      '“Steel ships float, so solid steel is less dense than water.” What is wrong?',
      [
        [
          '把空心船整体与实心材料混为一谈',
          'Confuses a hollow ship’s overall structure with solid material',
        ],
        ['船一定不是钢', 'The ship cannot contain steel'],
      ],
      0,
      '空心结构可排开更大体积；比较的整体质量与排水体积不同。',
      'A hollow structure excludes more volume; whole mass and excluded volume differ from a solid block.',
    ),
  },
];
