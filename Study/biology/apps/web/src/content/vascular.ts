import type { Lesson } from '../schema';
export const vascularLessons: Lesson[] = [
  {
    id: 'L041',
    reference: {
      title: 'OpenStax Biology 2e · Root water transport',
      url: 'https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    },
    title: {
      zh: '根怎样吸收水？',
      en: 'Water uptake by roots',
    },
    summary: {
      zh: '根毛是小吸管，还是细胞的一部分？',
      en: 'Is a root hair a tiny straw or part of a cell?',
    },
    hook: {
      zh: '窗台植物的叶在土壤上方，水却常从地下进入。把视线缩到一根根毛：没有嘴，也没有水泵，水为什么会跨进来？',
      en: 'Leaves stand above the soil, yet water often enters underground. Zoom into a root hair: without a mouth or pump, why does water cross into it?',
    },
    minutes: 20,
    icon: '❧',
    objectives: [
      {
        zh: '把根毛的接触表面与水跨膜的条件分开。',
        en: 'Separate root-hair contact surface from conditions for water crossing a membrane.',
      },
      {
        zh: '追踪土壤→根表皮→皮层→内皮层→木质部。',
        en: 'Trace soil → epidermis → cortex → endodermis → xylem.',
      },
    ],
    prediction: [
      {
        zh: '根毛越多，任何条件都净吸水',
        en: 'More hairs guarantee inward flow in every condition',
      },
      {
        zh: '接触表面和两侧条件都需要考虑',
        en: 'Consider contact surface and conditions on both sides',
      },
      { zh: '水全部变成土壤中的糖', en: 'All water becomes soil sugar' },
    ],
    terms: [
      {
        word: {
          zh: '根毛',
          en: 'root hair',
        },
        meaning: {
          zh: '根表皮细胞的细长突起，增加与土壤的接触表面。',
          en: 'A thin extension of a root epidermal cell, increasing soil contact.',
        },
      },
      {
        word: {
          zh: '渗透',
          en: 'osmosis',
        },
        meaning: {
          zh: '水跨选择透过膜的净移动，与两侧水势差有关。',
          en: 'Net water movement across a selectively permeable membrane, related to a water-potential difference.',
        },
      },
      {
        word: {
          zh: '水势',
          en: 'water potential',
        },
        meaning: {
          zh: '描述水移动倾向的量；水净移向较低总水势处。',
          en: 'A quantity describing water’s tendency to move; net movement is toward lower total water potential.',
        },
      },
      {
        word: {
          zh: '内皮层',
          en: 'endodermis',
        },
        meaning: {
          zh: '根内围绕运输组织的细胞层，参与控制进入路线。',
          en: 'A root cell layer surrounding transport tissues, influencing entry routes.',
        },
      },
      {
        word: {
          zh: '木质部',
          en: 'xylem',
        },
        meaning: {
          zh: '主要运输水和矿质元素，也提供支持的组织。',
          en: 'Tissue transporting water and minerals and providing support.',
        },
      },
    ],
    questions: [
      {
        id: 'L041-q1',
        skill: 'concept',
        prompt: {
          zh: '哪句话最准确地描述根毛？',
          en: 'Which best describes a root hair?',
        },
        options: [
          {
            zh: '一根空心吸管，没有膜',
            en: 'A hollow straw without a membrane',
          },
          {
            zh: '一个表皮细胞的突起，外有壁、内有膜',
            en: 'An epidermal-cell extension with a wall and membrane',
          },
          {
            zh: '一根缩小的整条根',
            en: 'A miniature whole root',
          },
        ],
        correct: 1,
        feedback: {
          zh: '根毛不是一整条根；壁不替代膜。增加接触表面不意味着任何条件都能吸水。',
          en: 'A root hair is not a whole root. Its wall does not replace the membrane; more contact does not guarantee uptake.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L041-q2',
        skill: 'concept',
        prompt: {
          zh: '本例土壤总水势高于根细胞，水可透膜，净方向？',
          en: 'Here soil has higher total water potential than the root cell, with a water-permeable membrane. Net direction?',
        },
        options: [
          {
            zh: '土壤→根细胞',
            en: 'Soil → root cell',
          },
          {
            zh: '根细胞→土壤',
            en: 'Root cell → soil',
          },
          {
            zh: '水变成糖',
            en: 'Water becomes sugar',
          },
        ],
        correct: 0,
        feedback: {
          zh: '比较的是总水势；不是根主动选择每一粒水。两侧仍都有分子运动。',
          en: 'Compare total water potential, rather than a root choosing each molecule. Motion still occurs on both sides.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L041-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只看到土壤表面湿，就能断言根一定吸到足量水吗？',
          en: 'Does a visibly wet soil surface establish sufficient root water uptake?',
        },
        options: [
          {
            zh: '能，湿度就是所有条件',
            en: 'Yes; visible moisture includes every condition',
          },
          {
            zh: '能，根毛保证无限水量',
            en: 'Yes; hairs guarantee unlimited water',
          },
          {
            zh: '不能，还要看根区、水势、根状态等',
            en: 'No; root-zone conditions, water potential and root function also matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '表面外观不是根区完整测量。模型的外侧较低水势情境可出现净流出，不是浇水建议。',
          en: 'Surface appearance is not a complete root-zone measurement. A lower outside water potential can give net outward flow; this is not watering advice.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L041-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'osmosis描述什么？',
          en: 'What does osmosis describe?',
        },
        options: [
          {
            zh: '花粉到柱头',
            en: 'Pollen reaching a stigma',
          },
          {
            zh: '水跨选择透过膜的净移动',
            en: 'Net water movement across a selectively permeable membrane',
          },
          {
            zh: '糖在韧皮部的全部运输',
            en: 'All sugar transport in phloem',
          },
        ],
        correct: 1,
        feedback: {
          zh: '根吸水包含渗透，但整条根到叶路线还有组织内的流动。',
          en: 'Osmosis contributes to root uptake; the full root-to-leaf journey also includes flow through tissues.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
    ],
    mission: {
      zh: '画土壤水→根毛细胞→皮层→内皮层→木质部，标一道膜与一个条件。',
      en: 'Sketch soil water → root-hair cell → cortex → endodermis → xylem, marking a membrane and one condition.',
    },
  },
  {
    id: 'L042',
    reference: {
      title: 'OpenStax Biology 2e · Water and sugar transport',
      url: 'https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    },
    title: {
      zh: '茎怎样运送物质？',
      en: 'Transport in stems',
    },
    summary: {
      zh: '一条向上的蓝路线，能解释所有材料吗？',
      en: 'Can one upward blue route explain every material?',
    },
    hook: {
      zh: '树没有心脏，叶子却能收到根来的水。叶子造出的糖还能去地下；春天，地下储备也能支持新芽。选一种货物，找它的来源和目的地。',
      en: 'A tree has no heart, yet leaves receive root water. Leaf-made sugars can reach underground parts; stored materials can later support buds. Choose a cargo and find its source and destination.',
    },
    minutes: 20,
    icon: '❧',
    objectives: [
      {
        zh: '区分木质部的水路线与韧皮部的源–库糖路线。',
        en: 'Distinguish xylem water from source-to-sink sugar routes in phloem.',
      },
      {
        zh: '定性解释叶片蒸发、连续水柱与向上的运输。',
        en: 'Explain evaporation, a connected water column and upward transport qualitatively.',
      },
    ],
    prediction: [
      {
        zh: '水和糖永远共用同一条向上路线',
        en: 'Water and sugar always share one upward route',
      },
      {
        zh: '不同货物有不同组织，糖看源与库',
        en: 'Tissues differ by cargo; sugars follow source to sink',
      },
      { zh: '糖只能从叶向下走', en: 'Sugar can only go downward from leaves' },
    ],
    terms: [
      {
        word: {
          zh: '木质部',
          en: 'xylem',
        },
        meaning: {
          zh: '输送水和溶解矿质元素的组织。',
          en: 'Tissue carrying water and dissolved minerals.',
        },
      },
      {
        word: {
          zh: '韧皮部',
          en: 'phloem',
        },
        meaning: {
          zh: '把蔗糖等有机物从源运到库的组织。',
          en: 'Tissue transporting sucrose and other organic materials from sources to sinks.',
        },
      },
      {
        word: {
          zh: '源',
          en: 'source',
        },
        meaning: {
          zh: '在当前条件下向运输路线输出糖的部位。',
          en: 'A region exporting sugars into a route under current conditions.',
        },
      },
      {
        word: {
          zh: '库',
          en: 'sink',
        },
        meaning: {
          zh: '在当前条件下接收糖，用于生长、使用或储存的部位。',
          en: 'A region receiving sugars for growth, use or storage under current conditions.',
        },
      },
      {
        word: {
          zh: '蒸腾',
          en: 'transpiration',
        },
        meaning: {
          zh: '植物以水蒸气形式向空气失水。',
          en: 'Loss of water from plants as vapour to the air.',
        },
      },
    ],
    questions: [
      {
        id: 'L042-q1',
        skill: 'concept',
        prompt: {
          zh: '根到叶的水和矿质元素主要沿哪类组织？',
          en: 'Which tissue mainly carries root water and minerals to leaves?',
        },
        options: [
          {
            zh: '木质部',
            en: 'Xylem',
          },
          {
            zh: '花粉管',
            en: 'Pollen tube',
          },
          {
            zh: '只有韧皮部',
            en: 'Only phloem',
          },
        ],
        correct: 0,
        feedback: {
          zh: '木质部连接根、茎和叶脉；水可在叶片细胞壁表面蒸发，再经气孔等途径离开。',
          en: 'Xylem connects roots, stems and leaf veins. Water can evaporate at leaf-cell walls and leave via stomata and other routes.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L042-q2',
        skill: 'concept',
        prompt: {
          zh: '地下储存器官供糖给新芽时，哪项正确？',
          en: 'When an underground store supplies a bud, which is correct?',
        },
        options: [
          {
            zh: '糖一定仍向下',
            en: 'Sugar must still move downward',
          },
          {
            zh: '库是输出处，源是接收处',
            en: 'Sinks export and sources receive',
          },
          {
            zh: '储存器官可成为源，新芽是库',
            en: 'The store can become a source; the bud is a sink',
          },
        ],
        correct: 2,
        feedback: {
          zh: '源与库是当前功能，不是固定等于叶与根。韧皮部单一路线的主流从源到库。',
          en: 'Source and sink describe current functions, not permanent leaf/root identities. Bulk flow along a particular phloem route is source to sink.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L042-q3',
        skill: 'reasoning',
        prompt: {
          zh: '厨房芹菜的有色水出现在细线中，能直接证明糖也走这些线吗？',
          en: 'If coloured water appears in thin celery lines, does that directly establish the sugar route?',
        },
        options: [
          {
            zh: '能，所有货物同路',
            en: 'Yes; every cargo uses one route',
          },
          {
            zh: '不能，示踪水不等于示踪糖',
            en: 'No; tracing water is not tracing sugar',
          },
          {
            zh: '能，颜色证明活细胞数量',
            en: 'Yes; colour proves living-cell counts',
          },
        ],
        correct: 1,
        feedback: {
          zh: '一种示踪只支持相应材料的路线，需不同证据检验糖运输。本课不要求做染色实验。',
          en: 'A tracer supports a route for the traced material; sugar requires other evidence. No staining experiment is required.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L042-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'source → sink表示什么关系？',
          en: 'What does source → sink describe?',
        },
        options: [
          {
            zh: '输出糖的部位→接收糖的部位',
            en: 'Sugar-exporting region → sugar-receiving region',
          },
          {
            zh: '永远叶→根',
            en: 'Always leaf → root',
          },
          {
            zh: '地面→空气',
            en: 'Ground → air',
          },
        ],
        correct: 0,
        feedback: {
          zh: '源–库随发育和条件变化；颜色只帮助区分路线，不是实际管道颜色。',
          en: 'Source–sink roles change with development and conditions. Colours distinguish routes rather than actual tissue colour.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
    ],
    mission: {
      zh: '画水的根→茎→叶路线；再画叶→根或储存根→新芽的糖路线，写明组织、源与库。',
      en: 'Draw root → stem → leaf water, then leaf → root or storage root → bud sugar. Name tissue, source and sink.',
    },
  },
  {
    id: 'L043',
    reference: {
      title: 'OpenStax Biology 2e · Leaves and stomata',
      url: 'https://openstax.org/books/biology-2e/pages/30-4-leaves',
    },
    title: {
      zh: '叶片与气孔',
      en: 'Leaves and stomata',
    },
    summary: {
      zh: '给CO₂开门，会顺便让水离开吗？',
      en: 'Does opening a door for CO₂ also let water escape?',
    },
    hook: {
      zh: '窗边一片叶子在用光制造有机物，CO₂得从空气进来。叶片里却也有水蒸气往外走。一个小孔，为什么会带来两种相反方向的旅程？',
      en: 'A sunlit leaf uses light to make organic materials, requiring air CO₂. Meanwhile water vapour leaves it. Why can one small pore support two opposite net journeys?',
    },
    minutes: 20,
    icon: '❧',
    objectives: [
      {
        zh: '连接液态水蒸发、叶内气隙与气孔失水。',
        en: 'Connect evaporation, internal leaf air spaces and stomatal vapour loss.',
      },
      {
        zh: '解释气孔调节带来的CO₂进入与水分保留取舍。',
        en: 'Explain the trade-off between CO₂ access and water retention.',
      },
    ],
    prediction: [
      {
        zh: '小孔只让CO₂进入，绝不让水出去',
        en: 'The pore admits CO₂ but never lets water out',
      },
      {
        zh: '气体通路同时带来失水的取舍',
        en: 'Gas access brings a water-loss trade-off',
      },
      {
        zh: '孔越开，植物一定越健康',
        en: 'A wider pore always means a healthier plant',
      },
    ],
    terms: [
      {
        word: {
          zh: '气孔',
          en: 'stoma',
        },
        meaning: {
          zh: '表皮中的微小开口，周围保卫细胞调节孔隙。',
          en: 'A small epidermal opening regulated by surrounding guard cells.',
        },
      },
      {
        word: {
          zh: '保卫细胞',
          en: 'guard cell',
        },
        meaning: {
          zh: '成对围绕气孔，通过状态变化调节开度。',
          en: 'One of paired cells regulating the stomatal opening.',
        },
      },
      {
        word: {
          zh: '蒸发',
          en: 'evaporation',
        },
        meaning: {
          zh: '液态水转为气态水。',
          en: 'Change of liquid water to water vapour.',
        },
      },
      {
        word: {
          zh: '蒸腾',
          en: 'transpiration',
        },
        meaning: {
          zh: '植物向空气失去水蒸气的过程。',
          en: 'Plant water loss to the air as vapour.',
        },
      },
      {
        word: {
          zh: '角质层',
          en: 'cuticle',
        },
        meaning: {
          zh: '表皮外的保护层，帮助限制失水。',
          en: 'A protective outer epidermal layer helping limit water loss.',
        },
      },
    ],
    questions: [
      {
        id: 'L043-q1',
        skill: 'concept',
        prompt: {
          zh: '本例光合叶的两条净路线是什么？',
          en: 'What are the two net routes in this actively photosynthesising example?',
        },
        options: [
          {
            zh: 'CO₂出、水蒸气进',
            en: 'CO₂ out, vapour in',
          },
          {
            zh: 'CO₂进、水蒸气出',
            en: 'CO₂ in, vapour out',
          },
          {
            zh: '液态土壤水从孔直接进入',
            en: 'Liquid soil water directly enters the pore',
          },
        ],
        correct: 1,
        feedback: {
          zh: '比较的是各自的内外条件，不是孔指定所有粒子同向。光合叶同时也呼吸。',
          en: 'Each substance has its own inside/outside conditions; the pore does not give every particle one direction. The leaf also respires.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L043-q2',
        skill: 'concept',
        prompt: {
          zh: '气孔开度主要由什么调节？',
          en: 'What regulates stomatal opening?',
        },
        options: [
          {
            zh: '成对保卫细胞的状态',
            en: 'State of paired guard cells',
          },
          {
            zh: '叶脉变成心脏',
            en: 'Veins becoming hearts',
          },
          {
            zh: '花粉颗粒堵住每个孔',
            en: 'Pollen blocking every pore',
          },
        ],
        correct: 0,
        feedback: {
          zh: '保卫细胞水分与离子状态改变形状；真实调节还受光、水状态、CO₂等影响。',
          en: 'Guard-cell water and ion conditions affect shape; real regulation also depends on light, water status and CO₂.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L043-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型缩小孔隙后，能说实际叶片不再失去任何水吗？',
          en: 'After the model pore narrows, can you say a real leaf loses no water at all?',
        },
        options: [
          {
            zh: '能，孔宽决定所有过程',
            en: 'Yes; pore width determines everything',
          },
          {
            zh: '能，植物停止所有代谢',
            en: 'Yes; the plant stops all metabolism',
          },
          {
            zh: '不能，通路受限不等于零，还有角质层等',
            en: 'No; restriction is not zero and other routes include the cuticle',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型不算速率或完整封闭；环境湿度、温度、风及其他路线都需考虑。',
          en: 'The model calculates no rates or complete seal; humidity, temperature, wind and other routes also matter.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L043-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'transpiration最接近哪句话？',
          en: 'Which best describes transpiration?',
        },
        options: [
          {
            zh: '花粉与卵融合',
            en: 'Pollen fuses with an egg',
          },
          {
            zh: '植物以水蒸气形式向空气失水',
            en: 'A plant loses water as vapour to air',
          },
          {
            zh: '糖永远向下移动',
            en: 'Sugar always moves downward',
          },
        ],
        correct: 1,
        feedback: {
          zh: '先有蒸发及气体移动，再以蒸腾描述植物的水蒸气损失；不是整滴水挤过孔。',
          en: 'Evaporation and gas movement contribute to plant vapour loss, called transpiration; whole droplets do not squeeze through the pore.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
    ],
    mission: {
      zh: '为一片叶画水从叶脉到细胞壁、蒸发、气孔到空气的路线，加CO₂进叶的箭头与一个取舍句。',
      en: 'Draw water from veins to cell walls, evaporation and stomatal vapour loss, plus CO₂ entering and one trade-off sentence.',
    },
  },
  {
    id: 'L044',
    reference: {
      title: 'OpenStax Biology 2e · Pollination and fertilisation',
      url: 'https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization',
    },
    title: {
      zh: '开花、传粉和种子',
      en: 'Pollination and seeds',
    },
    summary: {
      zh: '花粉落到了花上，故事就结束了吗？',
      en: 'Does the story end when pollen lands on a flower?',
    },
    hook: {
      zh: '豌豆花最后能长出果荚，里面有新植物的起点。但蜜蜂来过不等于已经成功。跟着一颗花粉到柱头，再把镜头交给花粉管和精细胞。',
      en: 'A pea flower can develop a pod containing beginnings of new plants, yet a bee visit does not guarantee success. Follow a pollen grain to the stigma, then pass the camera to its tube and sperm cells.',
    },
    minutes: 20,
    icon: '❧',
    objectives: [
      {
        zh: '区分传粉、花粉管生长、受精与种子发育。',
        en: 'Separate pollination, pollen-tube growth, fertilisation and seed development.',
      },
      {
        zh: '解释胚珠→种子、子房→果实，辨别不成功情境。',
        en: 'Explain ovule → seed and ovary → fruit, including an unsuccessful case.',
      },
    ],
    prediction: [
      {
        zh: '花粉停在柱头，就已经长出种子',
        en: 'Pollen on a stigma means a seed has formed',
      },
      {
        zh: '到达之后还要相容、受精与发育',
        en: 'Landing still needs compatibility, fertilisation and development',
      },
      {
        zh: '花粉粒就是缩小的整颗种子',
        en: 'A pollen grain is a tiny whole seed',
      },
    ],
    terms: [
      {
        word: {
          zh: '花药',
          en: 'anther',
        },
        meaning: {
          zh: '花中产生花粉的结构。',
          en: 'A floral structure producing pollen.',
        },
      },
      {
        word: {
          zh: '柱头',
          en: 'stigma',
        },
        meaning: {
          zh: '雌蕊顶部接收花粉的部位。',
          en: 'A pollen-receiving part at the top of a carpel.',
        },
      },
      {
        word: {
          zh: '传粉',
          en: 'pollination',
        },
        meaning: {
          zh: '花粉从花药到达柱头的过程。',
          en: 'Transfer of pollen from anther to stigma.',
        },
      },
      {
        word: {
          zh: '花粉管',
          en: 'pollen tube',
        },
        meaning: {
          zh: '相容花粉萌发后长出的管，输送精细胞。',
          en: 'A tube growing from compatible pollen and delivering sperm cells.',
        },
      },
      {
        word: {
          zh: '胚珠',
          en: 'ovule',
        },
        meaning: {
          zh: '含雌性生殖结构，成功发育后形成种子。',
          en: 'Contains female reproductive structures and develops into a seed after successful development.',
        },
      },
      {
        word: {
          zh: '受精',
          en: 'fertilisation',
        },
        meaning: {
          zh: '精细胞与卵等生殖细胞融合的过程。',
          en: 'Fusion involving sperm and female reproductive cells.',
        },
      },
    ],
    questions: [
      {
        id: 'L044-q1',
        skill: 'concept',
        prompt: {
          zh: '把花粉从花药带到柱头，叫什么？',
          en: 'What is transfer from anther to stigma called?',
        },
        options: [
          {
            zh: '传粉',
            en: 'Pollination',
          },
          {
            zh: '萌发成幼苗',
            en: 'Seedling germination',
          },
          {
            zh: '已经完成受精',
            en: 'Already completed fertilisation',
          },
        ],
        correct: 0,
        feedback: {
          zh: '到达柱头是传粉；接下来还需相容、管生长和精细胞递送等条件。',
          en: 'Landing is pollination; compatibility, tube growth and sperm delivery are further requirements.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L044-q2',
        skill: 'concept',
        prompt: {
          zh: '成功发育后，哪组对应正确？',
          en: 'After successful development, which pairing is correct?',
        },
        options: [
          {
            zh: '花粉→整个种子；花药→果荚',
            en: 'Pollen → whole seed; anther → pod',
          },
          {
            zh: '胚珠→种子；子房→果实',
            en: 'Ovule → seed; ovary → fruit',
          },
          {
            zh: '柱头→根；花瓣→卵',
            en: 'Stigma → root; petal → egg',
          },
        ],
        correct: 1,
        feedback: {
          zh: '豌豆荚是果实。胚珠内受精卵发育为胚；花粉粒不整体变成一颗种子。',
          en: 'A pea pod is a fruit. The fertilised egg develops into an embryo within the ovule; a whole pollen grain does not become a seed.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L044-q3',
        skill: 'reasoning',
        prompt: {
          zh: '看到蜜蜂停在花上，能直接断言已经形成有活力种子吗？',
          en: 'Does seeing a bee on a flower directly establish viable seeds?',
        },
        options: [
          {
            zh: '能，访问等于发芽',
            en: 'Yes; a visit equals germination',
          },
          {
            zh: '能，任何花粉都相容',
            en: 'Yes; all pollen is compatible',
          },
          {
            zh: '不能，需要花粉递送、相容、受精及发育证据',
            en: 'No; delivery, compatibility, fertilisation and development need evidence',
          },
        ],
        correct: 2,
        feedback: {
          zh: '访问是可见行为，但花粉是否到达合适柱头、后续是否成功，仍未确认。也有植物可自花传粉。',
          en: 'A visit is visible behaviour, not proof of appropriate delivery or later success. Some plants can also self-pollinate.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
      {
        id: 'L044-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'pollen tube的作用最接近哪项？',
          en: 'What best describes a pollen tube?',
        },
        options: [
          {
            zh: '把土壤水送上树',
            en: 'Carries soil water up a tree',
          },
          {
            zh: '直接成为整颗种子',
            en: 'Directly becomes a whole seed',
          },
          {
            zh: '从花粉长出并递送精细胞',
            en: 'Grows from pollen and delivers sperm cells',
          },
        ],
        correct: 2,
        feedback: {
          zh: '精细胞沿管递送到胚珠；图追踪精与卵融合，第二次融合在进阶说明中。',
          en: 'Sperm cells are delivered along the tube to the ovule. The diagram tracks egg fusion, with the second fusion explained in Depth.',
        },
        revisit: {
          zh: '回看模型中的边界、条件与箭头。',
          en: 'Revisit boundaries, conditions and arrows in the model.',
        },
      },
    ],
    mission: {
      zh: '写花药→柱头→花粉管→精与卵融合→种子；把“到达”与“成功发育”圈成不同阶段。',
      en: 'Write anther → stigma → pollen tube → sperm–egg fusion → seed, marking arrival and successful development separately.',
    },
  },
];
