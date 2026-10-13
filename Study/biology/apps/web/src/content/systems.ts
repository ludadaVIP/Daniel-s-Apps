import type { Lesson } from '../schema';
export const systemsLessons: Lesson[] = [
  {
    id: 'L037',
    title: {
      zh: '食物在身体里去哪儿？',
      en: 'The digestive journey',
    },
    minutes: 20,
    icon: '↝',
    summary: {
      zh: '一口米饭，会整粒跑进血管吗？',
      en: 'Does a grain of rice enter a blood vessel whole?',
    },
    hook: {
      zh: '早餐米饭先经过一条食物通道。血管在通道外面，细胞却需要材料。选一种分子，看看“变小”和“穿过去”是否同一件事。',
      en: 'Breakfast travels through a food passage with vessels outside it. Cells need materials. Choose a molecule and compare becoming smaller with crossing into the body.',
    },
    objectives: [
      {
        zh: '区分食物通道中的消化与跨肠壁的吸收。',
        en: 'Distinguish digestion inside the gut from absorption across its wall.',
      },
      {
        zh: '追踪淀粉、蛋白质与代表性膳食纤维的不同去向。',
        en: 'Compare routes for starch, protein and a representative dietary fibre.',
      },
    ],
    prediction: [
      {
        zh: '胃把所有食物直接变成血液',
        en: 'The stomach turns all food directly into blood',
      },
      {
        zh: '先分解部分大分子，再经肠壁吸收相应材料',
        en: 'Some large molecules are broken down and their products absorbed across the gut wall',
      },
      {
        zh: '吞下的每一种物质最终都进入肌肉',
        en: 'Every swallowed substance ends up in muscle',
      },
    ],
    terms: [
      {
        word: {
          zh: '消化',
          en: 'digestion',
        },
        meaning: {
          zh: '机械处理与化学分解食物，部分大分子变成较小分子。',
          en: 'Mechanical processing and chemical breakdown, including large molecules into smaller ones.',
        },
      },
      {
        word: {
          zh: '吸收',
          en: 'absorption',
        },
        meaning: {
          zh: '物质跨过消化道上皮进入血液或淋巴。',
          en: 'Movement across gut epithelium into blood or lymph.',
        },
      },
      {
        word: {
          zh: '葡萄糖',
          en: 'glucose',
        },
        meaning: {
          zh: '淀粉消化的可吸收产物之一，可随血液运输。',
          en: 'An absorbable product of starch digestion that can travel in blood.',
        },
      },
      {
        word: {
          zh: '氨基酸',
          en: 'amino acid',
        },
        meaning: {
          zh: '可由蛋白质消化提供，供细胞组装蛋白质等用途。',
          en: 'Provided by protein digestion and used in cellular protein assembly and other processes.',
        },
      },
      {
        word: {
          zh: '绒毛',
          en: 'villus',
        },
        meaning: {
          zh: '小肠壁的突起，增加吸收表面；表面细胞还有微绒毛。',
          en: 'A projection of the small-intestinal lining increasing absorption surface; its cells also have microvilli.',
        },
      },
    ],
    questions: [
      {
        id: 'L037-q1',
        skill: 'concept',
        prompt: {
          zh: '淀粉示例中，哪一步是吸收？',
          en: 'Which step is absorption in the starch example?',
        },
        options: [
          {
            zh: '牙齿把饭咬碎',
            en: 'Teeth break up rice',
          },
          {
            zh: '葡萄糖跨肠上皮进入血液',
            en: 'Glucose crosses gut epithelium into blood',
          },
          {
            zh: '食团经食管移动',
            en: 'A bolus moves through the oesophagus',
          },
        ],
        correct: 1,
        feedback: {
          zh: '拆分分子与跨越边界是不同过程。淀粉不是整条穿进血管。',
          en: 'Molecular breakdown and crossing a boundary are different processes; starch does not enter a vessel as an intact chain.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L037-q2',
        skill: 'concept',
        prompt: {
          zh: '蛋白质主要提供哪类可吸收组装材料？',
          en: 'Which absorbable building materials does protein supply?',
        },
        options: [
          {
            zh: '氨基酸',
            en: 'Amino acids',
          },
          {
            zh: '完整肌肉',
            en: 'Whole muscles',
          },
          {
            zh: '氧分子',
            en: 'Oxygen molecules',
          },
        ],
        correct: 0,
        feedback: {
          zh: '胃与小肠的酶参与分解，氨基酸可进入血液；不是吃下蛋白质就直接长成肌肉。',
          en: 'Enzymes in the stomach and intestine support breakdown; amino acids can enter blood rather than becoming muscle directly.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L037-q3',
        skill: 'reasoning',
        prompt: {
          zh: '看到米饭被咬碎，能证明淀粉已经全变成葡萄糖吗？',
          en: 'Does seeing chewed rice establish that all starch has become glucose?',
        },
        options: [
          {
            zh: '能，大小就是分子组成',
            en: 'Yes; visible size is molecular composition',
          },
          {
            zh: '能，牙齿就是所有消化酶',
            en: 'Yes; teeth are all digestive enzymes',
          },
          {
            zh: '不能，机械碎片不是分子变化的完整证据',
            en: 'No; physical fragments do not fully reveal molecular changes',
          },
        ],
        correct: 2,
        feedback: {
          zh: '外观变化说明机械处理；化学消化需另外的机制与证据。模型压缩多步过程，不代表实际时间。',
          en: 'Appearance shows mechanical processing; chemical digestion requires separate mechanisms and evidence. The model compresses multiple steps, not real time.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L037-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'absorption最接近哪种描述？',
          en: 'What best describes absorption?',
        },
        options: [
          {
            zh: '材料跨肠壁进入运输系统',
            en: 'Materials cross the gut wall into transport systems',
          },
          {
            zh: '只把食物咬小',
            en: 'Only chewing food smaller',
          },
          {
            zh: '把氧造出来',
            en: 'Creating oxygen',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Digestion分解；absorption跨边界。不要用一个词代替整个旅程。',
          en: 'Digestion breaks down; absorption crosses a boundary. Neither word replaces the whole journey.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
    ],
    mission: {
      zh: '画淀粉→葡萄糖→肠壁→血液→肝→身体细胞。标出一次分解和一次吸收。',
      en: 'Sketch starch → glucose → gut wall → blood → liver → body cells. Mark breakdown and absorption.',
    },
  },
  {
    id: 'L038',
    title: {
      zh: '肺为什么有很多气囊？',
      en: 'Gas exchange in the lungs',
    },
    minutes: 20,
    icon: '↝',
    summary: {
      zh: '同样多空气，一个大球还是很多小球表面更多？',
      en: 'For the same air volume, does one large sphere or many small spheres have more surface?',
    },
    hook: {
      zh: '肺像树枝通向很多微小气囊。先做同体积球模型，再看氧和CO₂为什么能沿不同方向跨过同一片薄壁。',
      en: 'Lung branches lead to many tiny sacs. Compare equal-volume spheres, then see why oxygen and CO₂ can cross one thin wall in different directions.',
    },
    objectives: [
      {
        zh: '联系较大表面、薄屏障与血流，解释肺泡的交换作用。',
        en: 'Connect large surface, thin barriers and blood flow to alveolar exchange.',
      },
      {
        zh: '用分压差判断氧与CO₂的净交换方向，区别通气。',
        en: 'Use partial-pressure differences for net gas direction and distinguish ventilation.',
      },
    ],
    prediction: [
      {
        zh: '肺泡把氧变成营养物质',
        en: 'Alveoli turn oxygen into nutrients',
      },
      {
        zh: '薄的交换表面和气体差异帮助交换',
        en: 'Thin exchange surfaces and gas differences support exchange',
      },
      {
        zh: '气囊越大越少，表面必然越多',
        en: 'Fewer larger sacs must provide more surface',
      },
    ],
    terms: [
      {
        word: {
          zh: '肺泡',
          en: 'alveolus',
        },
        meaning: {
          zh: '与毛细血管相邻的肺部小气囊，提供交换表面。',
          en: 'A small lung air sac adjoining capillaries, providing exchange surface.',
        },
      },
      {
        word: {
          zh: '通气',
          en: 'ventilation',
        },
        meaning: {
          zh: '空气进出肺；与气体跨屏障不同。',
          en: 'Air moving into and out of lungs, distinct from crossing the barrier.',
        },
      },
      {
        word: {
          zh: '气体交换',
          en: 'gas exchange',
        },
        meaning: {
          zh: '气体跨肺泡与血液之间的薄屏障。',
          en: 'Gases crossing the thin barrier between alveolar air and blood.',
        },
      },
      {
        word: {
          zh: '分压',
          en: 'partial pressure',
        },
        meaning: {
          zh: '混合气体中某种气体的压力贡献；差异可驱动净扩散。',
          en: 'A gas’s pressure contribution in a mixture; differences can drive net diffusion.',
        },
      },
      {
        word: {
          zh: '毛细血管',
          en: 'capillary',
        },
        meaning: {
          zh: '薄壁微小血管，在器官中参与物质交换。',
          en: 'A small thin-walled vessel involved in exchange within organs.',
        },
      },
    ],
    questions: [
      {
        id: 'L038-q1',
        skill: 'concept',
        prompt: {
          zh: '肺泡空气氧分压较高、进入的血较低，净方向？',
          en: 'With higher oxygen partial pressure in alveolar air than incoming blood, what is the net direction?',
        },
        options: [
          {
            zh: '空气→血液',
            en: 'Air → blood',
          },
          {
            zh: '血液→空气',
            en: 'Blood → air',
          },
          {
            zh: '氧被凭空制造',
            en: 'Oxygen is created',
          },
        ],
        correct: 0,
        feedback: {
          zh: '判断同一种气体的两侧分压，而不是看箭头颜色或肺主动选择。',
          en: 'Compare the same gas’s partial pressures on both sides rather than colour or a lung making a choice.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L038-q2',
        skill: 'concept',
        prompt: {
          zh: '哪组结构适合肺泡交换？',
          en: 'Which features suit alveolar exchange?',
        },
        options: [
          {
            zh: '厚实墙壁、无血流',
            en: 'Thick walls and no blood flow',
          },
          {
            zh: '较大总表面、薄屏障、邻近毛细血管',
            en: 'Large total surface, thin barrier and adjoining capillaries',
          },
          {
            zh: '只有一个与血隔离的大空腔',
            en: 'One large cavity isolated from blood',
          },
        ],
        correct: 1,
        feedback: {
          zh: '通气更新空气，血流更新交换侧的血；薄屏障减少扩散距离。',
          en: 'Ventilation renews air and blood flow renews the blood side; a thin barrier shortens diffusion distance.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L038-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型8个半径一半的小球总表面为2倍，能证明氧转移也精确2倍吗？',
          en: 'Eight half-radius spheres have twice the surface. Does that prove exactly twice the oxygen transfer?',
        },
        options: [
          {
            zh: '能，面积等于全部生理条件',
            en: 'Yes; area equals all physiological conditions',
          },
          {
            zh: '能，动画速度就是实测',
            en: 'Yes; animation speed is a measurement',
          },
          {
            zh: '不能，还取决于分压差、厚度、血流等',
            en: 'No; pressure difference, thickness and blood flow also matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '几何比例是精确的示例；真实肺泡不是完整独立球，模型不计算转移速率。',
          en: 'The example’s geometric ratio is exact; real alveoli are not separate complete spheres and the model calculates no transfer rate.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L038-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'ventilation与gas exchange有什么区别？',
          en: 'How do ventilation and gas exchange differ?',
        },
        options: [
          {
            zh: '都只表示细胞反应',
            en: 'Both only mean cellular reactions',
          },
          {
            zh: '前者空气进出，后者跨交换屏障',
            en: 'The first moves air; the second crosses an exchange barrier',
          },
          {
            zh: '前者生产氧，后者生产血',
            en: 'The first creates oxygen; the second creates blood',
          },
        ],
        correct: 1,
        feedback: {
          zh: '吸气把空气带进来，不把空气整团送到肌肉；氧还需跨屏障和血液运输。',
          en: 'Inhalation brings air in, rather than sending a whole air pocket to muscle; oxygen still needs exchange and transport.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
    ],
    mission: {
      zh: '为氧画空气→肺泡→薄屏障→血液箭头，为CO₂画反方向。写出表面为何有帮助但不能单独预测速率。',
      en: 'Draw oxygen from air through alveolus and barrier into blood, and CO₂ in reverse. Explain why surface helps without predicting rate alone.',
    },
  },
  {
    id: 'L039',
    title: {
      zh: '血液如何运送物质？',
      en: 'Transport in blood',
    },
    minutes: 20,
    icon: '↝',
    summary: {
      zh: '氧、葡萄糖和CO₂，搭的是同一辆“车”吗？',
      en: 'Do oxygen, glucose and CO₂ use the same carrier?',
    },
    hook: {
      zh: '想象一辆随血流移动的小观察车。选氧、葡萄糖或CO₂的碳，在每站看它在哪里、怎样被携带。你会经过心脏两侧，却不会从右侧直接穿墙到左侧。',
      en: 'Imagine a small observer travelling with blood. Choose oxygen, glucose or CO₂ carbon and inspect each stop and carrier. The route connects both heart sides without passing directly through the dividing wall.',
    },
    objectives: [
      {
        zh: '追踪肺与身体双循环，按离心/回心辨认血管。',
        en: 'Trace pulmonary and systemic circuits; classify vessels by away/toward the heart.',
      },
      {
        zh: '比较红细胞携氧、血浆运输葡萄糖和CO₂碳的不同形式。',
        en: 'Compare red-cell oxygen, plasma glucose and forms carrying CO₂ carbon.',
      },
    ],
    prediction: [
      {
        zh: '动脉总是含氧多，静脉总是含氧少',
        en: 'Arteries always have more oxygen and veins less',
      },
      {
        zh: '按离开心脏或回到心脏命名，再判断其中物质',
        en: 'Names describe away from or toward the heart; contents are judged separately',
      },
      {
        zh: '血只有一种成分，所有物质相同形式运输',
        en: 'Blood has one component and carries everything the same way',
      },
    ],
    terms: [
      {
        word: {
          zh: '血浆',
          en: 'plasma',
        },
        meaning: {
          zh: '血液的液体部分，运输多种溶解物质。',
          en: 'The liquid part of blood carrying many dissolved substances.',
        },
      },
      {
        word: {
          zh: '红细胞',
          en: 'red blood cell',
        },
        meaning: {
          zh: '含血红蛋白，承担血液大部分氧运输。',
          en: 'Contains haemoglobin and carries most oxygen in blood.',
        },
      },
      {
        word: {
          zh: '血红蛋白',
          en: 'haemoglobin',
        },
        meaning: {
          zh: '红细胞内可逆结合氧的蛋白质。',
          en: 'A red-cell protein that binds oxygen reversibly.',
        },
      },
      {
        word: {
          zh: '动脉',
          en: 'artery',
        },
        meaning: {
          zh: '把血带离心脏的血管。',
          en: 'A vessel carrying blood away from the heart.',
        },
      },
      {
        word: {
          zh: '静脉',
          en: 'vein',
        },
        meaning: {
          zh: '把血带向心脏的血管。',
          en: 'A vessel carrying blood toward the heart.',
        },
      },
      {
        word: {
          zh: '碳酸氢根',
          en: 'bicarbonate',
        },
        meaning: {
          zh: 'CO₂的碳在血中常以这种离子形式运输。',
          en: 'An ion carrying much of the carbon from CO₂ in blood.',
        },
      },
    ],
    questions: [
      {
        id: 'L039-q1',
        skill: 'concept',
        prompt: {
          zh: '血液中的大部分氧由什么携带？',
          en: 'What carries most oxygen in blood?',
        },
        options: [
          {
            zh: '完整饭粒',
            en: 'Whole rice grains',
          },
          {
            zh: '红细胞内血红蛋白',
            en: 'Haemoglobin in red cells',
          },
          {
            zh: '肺泡整团空气',
            en: 'Whole pockets of alveolar air',
          },
        ],
        correct: 1,
        feedback: {
          zh: '氧可逆结合血红蛋白；少部分溶解。红细胞通常留在血管内，氧在组织处释放并跨入细胞。',
          en: 'Oxygen binds haemoglobin reversibly with a smaller dissolved portion. Red cells normally remain in vessels while oxygen is released into tissues.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L039-q2',
        skill: 'concept',
        prompt: {
          zh: '肺动脉与肺静脉说明什么？',
          en: 'What do pulmonary artery and vein illustrate?',
        },
        options: [
          {
            zh: '命名按血流与心脏关系，不能只按氧多寡',
            en: 'Names follow direction relative to the heart, not oxygen content alone',
          },
          {
            zh: '两者都只运空气',
            en: 'Both carry only air',
          },
          {
            zh: '静脉都不运输氧',
            en: 'Veins never carry oxygen',
          },
        ],
        correct: 0,
        feedback: {
          zh: '肺动脉离右心，通常氧较少；肺静脉回左心，通常氧较多。',
          en: 'Pulmonary arteries leave the right heart with less oxygen; pulmonary veins return to the left heart with more.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L039-q3',
        skill: 'reasoning',
        prompt: {
          zh: '葡萄糖随血经过肺毛细血管，就一定进入肺泡空气吗？',
          en: 'Must glucose enter alveolar air because blood passes lung capillaries?',
        },
        options: [
          {
            zh: '一定，所有毛细血管交换完全相同',
            en: 'Yes; every capillary exchanges identically',
          },
          {
            zh: '一定，血里所有东西都呼出去',
            en: 'Yes; everything in blood is exhaled',
          },
          {
            zh: '不一定，物质与边界特性不同；本路线保留在血中运输',
            en: 'No; substance and barrier properties differ; this route keeps it in blood for transport',
          },
        ],
        correct: 2,
        feedback: {
          zh: '路径相邻不等于所有物质都跨过去。葡萄糖路线经肝和双循环到组织，本图没有葡萄糖入空气支路。',
          en: 'Being adjacent does not mean every substance crosses. This glucose route passes the liver and double circulation to tissue, with no glucose-to-air branch.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L039-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'artery最可靠的含义是？',
          en: 'What is the most reliable meaning of artery?',
        },
        options: [
          {
            zh: '永远只有鲜红色血',
            en: 'Always only bright-red blood',
          },
          {
            zh: '带离心脏的血管',
            en: 'A vessel carrying blood away from the heart',
          },
          {
            zh: '只有毛细血管',
            en: 'Only a capillary',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Away from the heart是命名依据，氧含量另看循环位置。蓝线只是图示编码，血液不会变成蓝色。',
          en: 'Away from the heart is the naming rule; oxygen content depends on circuit position. Blue lines are a code: blood does not become blue.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
    ],
    mission: {
      zh: '选氧或CO₂碳，画肺与身体之间的一条路线。标两侧心脏、动静脉方向、毛细血管与运输形式。',
      en: 'Choose oxygen or CO₂ carbon and map a route between lung and body, labelling heart sides, vessel directions, capillaries and carrier forms.',
    },
  },
  {
    id: 'L040',
    title: {
      zh: '三个系统怎样协作？',
      en: 'Systems working together',
    },
    minutes: 20,
    icon: '↝',
    summary: {
      zh: '肺里有氧，就等于脚上的细胞已经收到氧吗？',
      en: 'Does oxygen in the lungs mean foot cells have received it?',
    },
    hook: {
      zh: '想象拿起一本书：肌肉细胞利用材料和能量，但肺不会直接把一口空气送进手臂。追踪氧、葡萄糖和CO₂碳，检查少了哪条连接会改变新递送。',
      en: 'Imagine lifting a book. Muscle cells use materials and energy, yet lungs do not send a pocket of air into an arm. Trace oxygen, glucose and CO₂ carbon; inspect how one missing link changes new delivery.',
    },
    objectives: [
      {
        zh: '连接消化吸收、肺交换、循环与细胞反应。',
        en: 'Connect digestion/absorption, lung exchange, circulation and cellular reactions.',
      },
      {
        zh: '用单个连接变化解释新递送路线，保留模型结论范围。',
        en: 'Reason about a single link change in new delivery without exceeding the model.',
      },
    ],
    prediction: [
      {
        zh: '肺完成所有能量工作',
        en: 'Lungs do all energy work',
      },
      {
        zh: '来源、交换和运输合作，再由细胞利用材料',
        en: 'Sources, exchange and transport cooperate before cells use materials',
      },
      {
        zh: '没有刚吃饭就没有任何可用养分',
        en: 'Without just eating there are no available nutrients',
      },
    ],
    terms: [
      {
        word: {
          zh: '系统',
          en: 'system',
        },
        meaning: {
          zh: '多个部件共同完成相关工作的组织。',
          en: 'Parts cooperating in related tasks.',
        },
      },
      {
        word: {
          zh: '循环',
          en: 'circulation',
        },
        meaning: {
          zh: '血液由心脏推动，经血管流动的过程。',
          en: 'Blood flow through vessels driven by the heart.',
        },
      },
      {
        word: {
          zh: '组织间液',
          en: 'tissue fluid',
        },
        meaning: {
          zh: '细胞周围的液体，连接血与细胞交换。',
          en: 'Fluid around cells linking blood and cellular exchange.',
        },
      },
      {
        word: {
          zh: '细胞呼吸',
          en: 'cellular respiration',
        },
        meaning: {
          zh: '细胞反应转移有机物能量，支持ATP再生成。',
          en: 'Cellular reactions transferring organic-compound energy to support ATP regeneration.',
        },
      },
      {
        word: {
          zh: '模型假设',
          en: 'model assumption',
        },
        meaning: {
          zh: '为解释问题而固定或简化的条件。',
          en: 'A condition fixed or simplified to explain a question.',
        },
      },
    ],
    questions: [
      {
        id: 'L040-q1',
        skill: 'concept',
        prompt: {
          zh: '哪条氧路线完整？',
          en: 'Which oxygen route is complete?',
        },
        options: [
          {
            zh: '空气→胃→完整饭粒→肌肉',
            en: 'Air → stomach → whole rice → muscle',
          },
          {
            zh: '空气→肺泡交换→血液经心脏与血管→组织→细胞',
            en: 'Air → alveolar exchange → blood through heart/vessels → tissue → cell',
          },
          {
            zh: '肺里有氧，肌肉无需循环',
            en: 'Lung oxygen makes circulation unnecessary',
          },
        ],
        correct: 1,
        feedback: {
          zh: '交换把氧带入血，循环送到组织，氧还需跨到细胞；通气本身不足以完成递送。',
          en: 'Exchange brings oxygen into blood, circulation delivers it to tissue and it must enter cells; ventilation alone does not complete delivery.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L040-q2',
        skill: 'concept',
        prompt: {
          zh: '氧与葡萄糖在本课哪里参与有氧供能反应？',
          en: 'Where do oxygen and glucose participate in aerobic energy-supplying reactions?',
        },
        options: [
          {
            zh: '细胞内',
            en: 'Inside cells',
          },
          {
            zh: '饭粒还在盘里时',
            en: 'While rice is on the plate',
          },
          {
            zh: '只有肺泡空气里',
            en: 'Only in alveolar air',
          },
        ],
        correct: 0,
        feedback: {
          zh: '氧是有氧路线条件，葡萄糖提供有机物材料；ATP再生成和工作是细胞内耦联过程，不是肺生产能量包。',
          en: 'Oxygen supports the aerobic route and glucose supplies organic material. ATP regeneration and work involve cellular coupling, not energy parcels manufactured by lungs.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L040-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型隐藏新吸收支路，能推出细胞立刻没有能量吗？',
          en: 'If the model hides the new-absorption link, do cells immediately have no energy?',
        },
        options: [
          {
            zh: '能，所有储备同时消失',
            en: 'Yes; all reserves vanish',
          },
          {
            zh: '能，图里少一条线就全部归零',
            en: 'Yes; one missing line zeros everything',
          },
          {
            zh: '不能，已有材料、储备与调节没有计算',
            en: 'No; existing materials, reserves and regulation are not calculated',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型只说明这一条新材料来源路线受限。真实身体有已有养分、储备及其他供能途径，不能由图推断时间或健康结果。',
          en: 'The model limits this new material-source route only. Existing nutrients, stores and other energy pathways prevent inferring timing or health outcomes from the diagram.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
      {
        id: 'L040-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '哪句英文能正确连接三个环节？',
          en: 'Which sentence correctly connects the three links?',
        },
        options: [
          {
            zh: '消化造氧，肺造葡萄糖',
            en: 'Digestion makes oxygen; lungs make glucose.',
          },
          {
            zh: '交换把氧带入血；循环递送材料到细胞',
            en: 'Exchange supplies oxygen to blood; circulation delivers materials to cells.',
          },
          {
            zh: '血液变成完整肌肉',
            en: 'Blood changes into whole muscle.',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Supply与deliver连接来源及运输；use发生在细胞。本句没有声称肺造氧或血液变成器官。',
          en: 'Supply and deliver connect sources and transport; use occurs in cells. Lungs do not create oxygen and blood does not turn into organs.',
        },
        revisit: {
          zh: '回看路线的来源、边界与运输环节。',
          en: 'Revisit sources, boundaries and transport links.',
        },
      },
    ],
    mission: {
      zh: '为氧绘从肺泡到肌肉细胞的旅程，并加葡萄糖另一条来源及CO₂回程。标一个模型缺省与一句英文解释。',
      en: 'Map oxygen from alveolus to muscle cell, adding glucose’s different source and CO₂’s return. State an omission and one English explanation.',
    },
  },
];
