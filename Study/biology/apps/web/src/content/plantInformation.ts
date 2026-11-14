import type { Lesson } from '../schema';

export const plantInformationLessons: Lesson[] = [
  {
    id: 'L105',
    title: {
      zh: '木质部与韧皮部',
      en: 'Xylem and Phloem',
    },
    hook: {
      zh: '同一株植物，糖能同时往根和新梢走吗？春天萌芽时，尚未展开的叶靠谁供糖？',
      en: 'Can sugar travel towards roots and a shoot at the same time? What supplies a spring shoot before its leaves expand?',
    },
    minutes: 30,
    icon: '❧',
    objectives: [
      {
        zh: '用成熟组织结构区别木质导管与筛管。',
        en: 'Distinguish mature xylem vessels and sieve tubes by structure.',
      },
      {
        zh: '用源–库角色预测两条筛管中的方向。',
        en: 'Predict flow in two sieve tubes using source–sink roles.',
      },
      {
        zh: '解释主动装载、渗透与压力流的联系。',
        en: 'Connect loading, osmosis and pressure-driven bulk flow.',
      },
    ],
    prediction: [
      {
        zh: '成熟叶可通过不同筛管向上和向下供糖。',
        en: 'A mature leaf can export up and down through different tubes.',
      },
      {
        zh: '韧皮部在所有季节都只能向下流。',
        en: 'Phloem can flow only downwards in every season.',
      },
      {
        zh: '萌芽时根中储藏的糖只能留在根中。',
        en: 'Stored root sugar must remain in the root during sprouting.',
      },
    ],
    terms: [
      {
        word: {
          zh: '木质部',
          en: 'xylem',
        },
        meaning: {
          zh: '主要运输水和矿质并支持植物的组织。',
          en: 'Tissue mainly transporting water and minerals and supporting plants.',
        },
      },
      {
        word: {
          zh: '韧皮部',
          en: 'phloem',
        },
        meaning: {
          zh: '运输糖等有机溶质的活组织系统。',
          en: 'Living tissue system transporting sugars and other solutes.',
        },
      },
      {
        word: {
          zh: '导管',
          en: 'vessel',
        },
        meaning: {
          zh: '成熟时由死的、木质化细胞形成的运输通道。',
          en: 'A conduit formed from dead, lignified cells at maturity.',
        },
      },
      {
        word: {
          zh: '筛管',
          en: 'sieve tube',
        },
        meaning: {
          zh: '筛管分子相连形成的活运输通路。',
          en: 'A living transport route formed from connected sieve elements.',
        },
      },
      {
        word: {
          zh: '源',
          en: 'source',
        },
        meaning: {
          zh: '在所考察时段净输出糖的部位。',
          en: 'A region exporting sugar during the period considered.',
        },
      },
      {
        word: {
          zh: '库',
          en: 'sink',
        },
        meaning: {
          zh: '净接受糖以利用或储存的部位。',
          en: 'A region receiving sugar for use or storage.',
        },
      },
      {
        word: {
          zh: '压力流',
          en: 'pressure flow',
        },
        meaning: {
          zh: '压力差驱动溶液整体流动。',
          en: 'Bulk solution movement driven by a pressure difference.',
        },
      },
    ],
    questions: [
      {
        id: 'L105-q1',
        skill: 'concept',
        prompt: {
          zh: '哪种结构最适合常见木质导管的功能？',
          en: 'Which structure fits a typical mature xylem vessel?',
        },
        options: [
          {
            zh: '活细胞的完整横隔不断泵糖',
            en: 'Living complete end walls repeatedly pumping sugar',
          },
          {
            zh: '死的木质化细胞相连，形成水通道',
            en: 'Connected dead lignified cells forming a water conduit',
          },
          {
            zh: '只有一层脂质膜，没有细胞壁',
            en: 'Only a lipid membrane, with no cell wall',
          },
        ],
        correct: 1,
        feedback: {
          zh: '木质化壁支持负压下的通道；死的是成熟导管分子，不是整棵植物或全部木质部细胞。',
          en: 'Lignified walls support conduits under tension. Mature vessel elements are dead, not the whole plant or every xylem cell.',
        },
        revisit: {
          zh: '看图左侧蓝色木质部与运输物。',
          en: 'Inspect the blue xylem route and its cargo.',
        },
      },
      {
        id: 'L105-q2',
        skill: 'concept',
        prompt: {
          zh: '芽未能光合而储藏器官输出糖时，谁是源？',
          en: 'When a non-photosynthetic shoot receives sugar from a store, which is the source?',
        },
        options: [
          {
            zh: '新芽',
            en: 'The shoot',
          },
          {
            zh: '总是成熟叶',
            en: 'Always a mature leaf',
          },
          {
            zh: '正在输出糖的储藏器官',
            en: 'The exporting storage organ',
          },
        ],
        correct: 2,
        feedback: {
          zh: '源表示净输出角色；储藏器官从库变源，不必变成叶。',
          en: 'Source means net exporter. A storage organ can change from sink to source without becoming a leaf.',
        },
        revisit: {
          zh: '切换到储藏器官动员，追踪筛管A。',
          en: 'Select reserve mobilisation and trace tube A.',
        },
      },
      {
        id: 'L105-q3',
        skill: 'reasoning',
        prompt: {
          zh: '示踪糖6小时后，新梢有8相对单位、根有12；能得出什么？',
          en: 'Six hours after sugar labelling, a shoot contains 8 relative units and roots 12. What follows?',
        },
        options: [
          {
            zh: '与不同筛管向两个库供糖相容，不能据此证明同管双向流',
            en: 'Consistent with different tubes supplying two sinks; not proof of opposing flow in one tube',
          },
          {
            zh: '证明每条筛管同时上下流',
            en: 'Every tube must flow both ways simultaneously',
          },
          {
            zh: '证明糖只由木质部运输',
            en: 'Sugar must travel only through xylem',
          },
        ],
        correct: 0,
        feedback: {
          zh: '8和12显示两个位置都收到标记，但终点数量不能单独标出所有通道或测得瞬时流速。',
          en: 'Both destinations received label, but endpoint amounts alone do not map every route or measure instantaneous flow.',
        },
        revisit: {
          zh: '比较筛管A和B的两条独立箭头。',
          en: 'Compare the separate arrows in tubes A and B.',
        },
      },
      {
        id: 'L105-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'source在植物运输题中最接近哪一解释？',
          en: 'What does source mean in a plant-transport question?',
        },
        options: [
          {
            zh: '任何地下器官',
            en: 'Any underground organ',
          },
          {
            zh: '净输出糖的部位',
            en: 'A net sugar-exporting region',
          },
          {
            zh: '水分丢失的唯一部位',
            en: 'The only place losing water',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'source描述糖收支而非上下位置；sink是净接受部位。',
          en: 'Source describes sugar balance rather than vertical position; a sink is a net recipient.',
        },
        revisit: {
          zh: '读两种源–库条件的端点标签。',
          en: 'Read endpoint labels under both source–sink conditions.',
        },
      },
    ],
    mission: {
      zh: '画三条运输箭头，给每条写物质、起点、终点及条件；用一句话解释为何同一器官可换角色。',
      en: 'Draw three transport arrows with cargo, start, destination and conditions; explain how an organ can change roles.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Plant transport',
      url: 'https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    },
  },
  {
    id: 'L106',
    title: {
      zh: '蒸腾与环境',
      en: 'Transpiration and Environment',
    },
    hook: {
      zh: '有风通常加快失水，为什么炎热干燥时植物关气孔却可能失水更慢？吸水计真的在量蒸腾吗？',
      en: 'Wind often increases water loss. Why might a hot, dry plant lose less after closing stomata? Does a potometer directly measure transpiration?',
    },
    minutes: 30,
    icon: '❧',
    objectives: [
      {
        zh: '连接细胞壁蒸发、气孔扩散和水势梯度。',
        en: 'Connect wall evaporation, stomatal diffusion and gradients.',
      },
      {
        zh: '控制其他条件，比较湿度、风、温度与光。',
        en: 'Compare humidity, wind, temperature and light with other conditions controlled.',
      },
      {
        zh: '辨认吸水计读数的代理性质及局限。',
        en: 'Identify potometer readings as a proxy with limitations.',
      },
    ],
    prediction: [
      {
        zh: '固定气孔时，湿度更高通常减小失水梯度。',
        en: 'With aperture fixed, higher humidity usually reduces the loss gradient.',
      },
      {
        zh: '风的作用不受气孔关闭影响。',
        en: 'Wind effects are unaffected by stomatal closure.',
      },
      {
        zh: '吸水计每一单位吸水都等于同刻蒸腾。',
        en: 'Every unit of uptake equals simultaneous transpiration.',
      },
    ],
    terms: [
      {
        word: {
          zh: '蒸腾',
          en: 'transpiration',
        },
        meaning: {
          zh: '植物表面向外散失水蒸气的过程。',
          en: 'Loss of water vapour from plant surfaces.',
        },
      },
      {
        word: {
          zh: '蒸发',
          en: 'evaporation',
        },
        meaning: {
          zh: '液态水进入气态的过程。',
          en: 'Liquid water entering the vapour phase.',
        },
      },
      {
        word: {
          zh: '气孔',
          en: 'stoma',
        },
        meaning: {
          zh: '保卫细胞调节的表皮孔隙。',
          en: 'An epidermal pore regulated by guard cells.',
        },
      },
      {
        word: {
          zh: '湿度',
          en: 'humidity',
        },
        meaning: {
          zh: '空气含水蒸气的程度。',
          en: 'The amount of water vapour in air.',
        },
      },
      {
        word: {
          zh: '边界层',
          en: 'boundary layer',
        },
        meaning: {
          zh: '贴近叶面的较静止空气层。',
          en: 'Relatively still air next to the leaf surface.',
        },
      },
      {
        word: {
          zh: '代理指标',
          en: 'proxy',
        },
        meaning: {
          zh: '与目标过程有关但不等同的测量。',
          en: 'A related measurement that is not identical to the target process.',
        },
      },
      {
        word: {
          zh: '吸水计',
          en: 'potometer',
        },
        meaning: {
          zh: '估计枝条吸水速率的装置。',
          en: 'An apparatus estimating shoot water uptake rate.',
        },
      },
    ],
    questions: [
      {
        id: 'L106-q1',
        skill: 'concept',
        prompt: {
          zh: '蒸腾主要包含哪条先后关系？',
          en: 'Which sequence describes the main transpiration route?',
        },
        options: [
          {
            zh: '细胞壁水蒸发，再经气孔扩散',
            en: 'Wall water evaporates, then vapour diffuses through stomata',
          },
          {
            zh: '液态水全部直接由筛管喷出',
            en: 'All liquid water sprays directly from sieve tubes',
          },
          {
            zh: '根把水转为水蒸气后送到叶',
            en: 'Roots turn all water into vapour before transport',
          },
        ],
        correct: 0,
        feedback: {
          zh: '图中蓝点所在细胞壁先发生蒸发，孔口附近的扩散由水蒸气梯度驱动。',
          en: 'Evaporation occurs at the cell walls; vapour diffusion near the pore follows a vapour gradient.',
        },
        revisit: {
          zh: '回看叶内水到孔外的折线路线。',
          en: 'Trace the route from leaf wall water to outside the pore.',
        },
      },
      {
        id: 'L106-q2',
        skill: 'concept',
        prompt: {
          zh: '为什么强光下干旱关闭气孔仍可降低失水？',
          en: 'Why can drought closure reduce loss even in bright light?',
        },
        options: [
          {
            zh: '关闭把叶内所有水变为糖',
            en: 'Closure converts all leaf water into sugar',
          },
          {
            zh: '孔口通路受限，环境效应受气孔状态调节',
            en: 'The pore pathway becomes restricted, modifying environmental effects',
          },
          {
            zh: '强光不再有任何能量',
            en: 'Bright light has no remaining energy',
          },
        ],
        correct: 1,
        feedback: {
          zh: '气孔限制扩散通路；有少量其他表面失水，所以关闭不等于完全零蒸腾。',
          en: 'Closure restricts diffusion. Other surface losses remain, so closure does not guarantee zero transpiration.',
        },
        revisit: {
          zh: '用相同湿度、风温比较关闭与开启的输出。',
          en: 'Compare open and closed at the same humidity, wind and temperature.',
        },
      },
      {
        id: 'L106-q3',
        skill: 'reasoning',
        prompt: {
          zh: '20°C、光100、风0：湿度50%时失水5，80%时2（相对单位/时）。哪种解释受支持？',
          en: 'At 20°C, light 100 and wind 0, loss is 5 at 50% humidity and 2 at 80% (relative units/time). Which explanation is supported?',
        },
        options: [
          {
            zh: '湿度升高使失水增加150%',
            en: 'Higher humidity increases loss 150%',
          },
          {
            zh: '升温导致失水降低',
            en: 'Warming caused the reduction',
          },
          {
            zh: '湿度升高使叶内外梯度变小，失水降低60%',
            en: 'Higher humidity reduces the gradient and loss falls 60%',
          },
        ],
        correct: 2,
        feedback: {
          zh: '下降为(5−2)/5=60%；温度未改变，不能归因升温。只在所控制的气孔与叶片条件下比较。',
          en: 'The reduction is(5−2)/5=60%. Temperature did not change. The comparison applies to these controlled leaf and aperture conditions.',
        },
        revisit: {
          zh: '恢复默认后只把湿度50改80，读相对输出。',
          en: 'Reset mentally to defaults, change only humidity 50→80 and read outputs.',
        },
      },
      {
        id: 'L106-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'potometer直接追踪什么？',
          en: 'What does a potometer directly track?',
        },
        options: [
          {
            zh: '单个气孔的数量',
            en: 'The number of individual stomata',
          },
          {
            zh: '枝条吸水量或吸水速率',
            en: 'Shoot water uptake or its rate',
          },
          {
            zh: '叶片精确光合速率',
            en: 'Exact photosynthetic rate',
          },
        ],
        correct: 1,
        feedback: {
          zh: '吸水往往与蒸腾有关，但储水、生长和漏气使两者不完全相等。',
          en: 'Uptake is often related to transpiration, but storage, growth and leaks prevent exact equality.',
        },
        revisit: {
          zh: '看右侧吸水计与左侧失水两个不同读数。',
          en: 'Compare the distinct uptake and loss readings.',
        },
      },
    ],
    mission: {
      zh: '保留三组公平比较，写湿度或风的条件化主张和数值证据，再指出吸水计读数为何不是精确失水。',
      en: 'Keep three fair comparisons, state a conditional humidity or wind claim with numerical evidence, and explain the uptake-proxy limitation.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Water transport and stomatal regulation',
      url: 'https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    },
  },
  {
    id: 'L107',
    title: {
      zh: '光合作用的限制因素',
      en: 'Photosynthesis and Limiting Factors',
    },
    hook: {
      zh: '给植物更亮的灯，速率曲线却停在平台。平台证明“光没用”，还是提示该改变另一个条件？',
      en: 'A brighter lamp leaves the photosynthesis curve on a plateau. Is light useless, or should another condition be tested?',
    },
    minutes: 30,
    icon: '❧',
    objectives: [
      {
        zh: '准确读出坐标、曲线条件和平台。',
        en: 'Read axes, curve conditions and plateaus.',
      },
      {
        zh: '用单变量比较确定当时的限制因素。',
        en: 'Use one-variable comparisons to investigate current limitation.',
      },
      {
        zh: '区分相对模型速率与气泡代理测量。',
        en: 'Distinguish relative model rate from bubble-count proxies.',
      },
    ],
    prediction: [
      {
        zh: '光强平台上增加CO₂可能有效，取决于其他条件。',
        en: 'Extra CO₂ may help on a light plateau, depending on other conditions.',
      },
      {
        zh: '任何光强平台都证明温度太低。',
        en: 'Every light plateau proves temperature is too low.',
      },
      {
        zh: '每个气泡都是等体积纯氧，能精确测总光合。',
        en: 'Every bubble is equal-volume pure oxygen, giving exact gross photosynthesis.',
      },
    ],
    terms: [
      {
        word: {
          zh: '限制因素',
          en: 'limiting factor',
        },
        meaning: {
          zh: '当前条件下限制过程速率的因素。',
          en: 'A factor restricting process rate under current conditions.',
        },
      },
      {
        word: {
          zh: '平台',
          en: 'plateau',
        },
        meaning: {
          zh: '横轴继续增大而纵轴变化很小的区段。',
          en: 'A region where increasing x produces little change in y.',
        },
      },
      {
        word: {
          zh: '光强',
          en: 'light intensity',
        },
        meaning: {
          zh: '单位面积接收光的强弱。',
          en: 'The strength of light received per area.',
        },
      },
      {
        word: {
          zh: '碳固定',
          en: 'carbon fixation',
        },
        meaning: {
          zh: '把无机碳并入有机分子的过程。',
          en: 'Incorporating inorganic carbon into organic molecules.',
        },
      },
      {
        word: {
          zh: '控制变量',
          en: 'controlled variable',
        },
        meaning: {
          zh: '公平比较时保持相同的因素。',
          en: 'A factor kept constant in a fair comparison.',
        },
      },
      {
        word: {
          zh: '净速率',
          en: 'net rate',
        },
        meaning: {
          zh: '同时发生的相反过程相减后的速率。',
          en: 'Rate remaining after opposing processes are accounted for.',
        },
      },
      {
        word: {
          zh: '相对单位',
          en: 'relative unit',
        },
        meaning: {
          zh: '在规定参照尺度上表达的量。',
          en: 'A quantity expressed on a stated reference scale.',
        },
      },
    ],
    questions: [
      {
        id: 'L107-q1',
        skill: 'concept',
        prompt: {
          zh: '曲线平台直接说明什么？',
          en: 'What does the plateau directly show?',
        },
        options: [
          {
            zh: '光合作用完全停止',
            en: 'Photosynthesis has stopped completely',
          },
          {
            zh: '当前条件下继续加光未明显提高速率',
            en: 'Extra light does not increase rate under these conditions',
          },
          {
            zh: '所有植物都不需要光',
            en: 'All plants have no need for light',
          },
        ],
        correct: 1,
        feedback: {
          zh: '平台仍可有正速率；它只描述横轴改变的效果，不能单凭平台识别所有限制。',
          en: 'A plateau may have a positive rate. It describes the effect of the x-variable, not every possible limitation.',
        },
        revisit: {
          zh: '读光60→90的两点和平台纵坐标40。',
          en: 'Read light 60→90 and the plateau rate 40.',
        },
      },
      {
        id: 'L107-q2',
        skill: 'concept',
        prompt: {
          zh: '研究CO₂作用时哪项设计最公平？',
          en: 'Which design fairly investigates CO₂?',
        },
        options: [
          {
            zh: '只改变CO₂，固定光、温度、水和叶面积',
            en: 'Change only CO₂; hold light, temperature, water and leaf area constant',
          },
          {
            zh: '同时换灯、换植物和增CO₂',
            en: 'Change lamp and plant while increasing CO₂',
          },
          {
            zh: '只记最终气泡数，不记时间',
            en: 'Record final bubble count without time',
          },
        ],
        correct: 0,
        feedback: {
          zh: '单变量比较才能把速率变化与CO₂联系；实际还需重复和适应时间。',
          en: 'A one-variable comparison links a change to CO₂; real experiments also need repeats and equilibration time.',
        },
        revisit: {
          zh: '比较同一横坐标的两条曲线。',
          en: 'Compare the two curves at the same x-coordinate.',
        },
      },
      {
        id: 'L107-q3',
        skill: 'reasoning',
        prompt: {
          zh: '光20时CO₂40→70，速率20→20；光90时同改动，40→70。哪项解释最好？',
          en: 'At light 20, CO₂40→70 gives rate 20→20; at light 90 it gives 40→70. Best explanation?',
        },
        options: [
          {
            zh: 'CO₂在所有光强都无影响',
            en: 'CO₂ never matters at any light level',
          },
          {
            zh: '高光时CO₂增加使速率提高75%，低光时仍受光限制',
            en: 'At high light CO₂ raises rate 75%; low light remains limiting',
          },
          {
            zh: '低光时速率提高150%',
            en: 'At low light the rate rises 150%',
          },
        ],
        correct: 1,
        feedback: {
          zh: '高光增幅(70−40)/40=75%；低光输出不变说明这时增加CO₂不足以提速。',
          en: 'The high-light increase is(70−40)/40=75%; at low light, extra CO₂ alone does not raise the output.',
        },
        revisit: {
          zh: '将光分别设20和90，各比较CO₂40/70。',
          en: 'At light 20 and 90 separately, compare CO₂40/70.',
        },
      },
      {
        id: 'L107-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'limiting factor中的limiting最接近？',
          en: 'What does limiting mean in limiting factor?',
        },
        options: [
          {
            zh: '总是完全消失',
            en: 'Always completely absent',
          },
          {
            zh: '只在夜间起作用',
            en: 'Acting only at night',
          },
          {
            zh: '当前条件下限制速率',
            en: 'Restricting rate under present conditions',
          },
        ],
        correct: 2,
        feedback: {
          zh: '限制因素随条件改变，不是给某个变量永久贴标签。',
          en: 'Limitation changes with conditions; it is not a permanent label attached to one variable.',
        },
        revisit: {
          zh: '对照低光区与高光平台。',
          en: 'Compare the low-light region with the high-light plateau.',
        },
      },
    ],
    mission: {
      zh: '写两条带条件的限制因素结论，分别引用低光与高光数据，并说明不能用相对速率直接算真实收获量。',
      en: 'Write two conditional limitation claims using low- and high-light data, and explain why relative rate cannot directly predict harvest yield.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Carbon fixation and conditions',
      url: 'https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules',
    },
  },
  {
    id: 'L108',
    title: {
      zh: '植物繁殖与矿物营养',
      en: 'Reproduction and Mineral Nutrition',
    },
    hook: {
      zh: '花粉已经落到柱头，为什么不一定结种子？如果补矿物肥料，植物能在没有CO₂时靠土壤造糖吗？',
      en: 'Pollen has reached a stigma: why might no seed form? Can mineral fertiliser let a plant make sugar without CO₂?',
    },
    minutes: 30,
    icon: '❧',
    objectives: [
      {
        zh: '区分授粉、受精及种子形成。',
        en: 'Distinguish pollination, fertilisation and seed formation.',
      },
      {
        zh: '联系氮和镁的生物功能，避免把矿质当糖的碳源。',
        en: 'Connect N and Mg functions without treating minerals as sugar carbon.',
      },
      {
        zh: '用对照证据区分营养限制和繁殖失败。',
        en: 'Use controls to distinguish nutritional limitation from reproductive failure.',
      },
    ],
    prediction: [
      {
        zh: '授粉只是前一步，花粉管和受精也需成功。',
        en: 'Pollination is an earlier step; tube growth and fertilisation must also succeed.',
      },
      {
        zh: '一粒花粉就是一颗微小种子。',
        en: 'A pollen grain is a tiny seed.',
      },
      {
        zh: '矿物盐能够直接代替CO₂提供糖中碳。',
        en: 'Mineral salts directly replace CO₂ as sugar carbon.',
      },
    ],
    terms: [
      {
        word: {
          zh: '授粉',
          en: 'pollination',
        },
        meaning: {
          zh: '花粉从花药转移到柱头，不要求后续相容或受精成功。',
          en: 'Transfer of pollen from anther to stigma, without requiring subsequent compatibility or fertilisation.',
        },
      },
      {
        word: {
          zh: '受精',
          en: 'fertilisation',
        },
        meaning: {
          zh: '雄雌配子核结合。',
          en: 'Union of male and female gamete nuclei.',
        },
      },
      {
        word: {
          zh: '胚珠',
          en: 'ovule',
        },
        meaning: {
          zh: '含雌性生殖结构并可发育为种子的结构。',
          en: 'A structure containing female reproductive tissues that may develop into a seed.',
        },
      },
      {
        word: {
          zh: '花粉管',
          en: 'pollen tube',
        },
        meaning: {
          zh: '向胚珠输送雄配子的生长通路。',
          en: 'A growing route delivering male gametes towards an ovule.',
        },
      },
      {
        word: {
          zh: '矿质元素',
          en: 'mineral nutrient',
        },
        meaning: {
          zh: '植物从无机来源获得的必需元素。',
          en: 'An essential element obtained from inorganic sources.',
        },
      },
      {
        word: {
          zh: '氮',
          en: 'nitrogen',
        },
        meaning: {
          zh: '参与氨基酸、核酸等组成的元素。',
          en: 'An element in amino acids, nucleic acids and other molecules.',
        },
      },
      {
        word: {
          zh: '镁',
          en: 'magnesium',
        },
        meaning: {
          zh: '叶绿素组成元素，并参与其他细胞作用。',
          en: 'An element in chlorophyll with additional cellular roles.',
        },
      },
    ],
    questions: [
      {
        id: 'L108-q1',
        skill: 'concept',
        prompt: {
          zh: '花粉落到柱头后尚未出现配子核结合，完成的是？',
          en: 'Pollen reaches a stigma without gamete-nucleus fusion. What has occurred?',
        },
        options: [
          {
            zh: '受精',
            en: 'Fertilisation',
          },
          {
            zh: '授粉',
            en: 'Pollination',
          },
          {
            zh: '种子萌发',
            en: 'Seed germination',
          },
        ],
        correct: 1,
        feedback: {
          zh: '图步骤1只表示花粉转移；步骤3才表示受精。授粉不保证后续成功。',
          en: 'Step 1 is pollen transfer; step 3 is fertilisation. Pollination does not guarantee later success.',
        },
        revisit: {
          zh: '对照步骤1与3的结构。',
          en: 'Compare structures in steps 1 and 3.',
        },
      },
      {
        id: 'L108-q2',
        skill: 'concept',
        prompt: {
          zh: '补镁最直接关联什么功能？',
          en: 'Which function is most directly linked to magnesium supply?',
        },
        options: [
          {
            zh: '作为叶绿素组成元素',
            en: 'Being a component of chlorophyll',
          },
          {
            zh: '代替CO₂组成所有糖碳骨架',
            en: 'Replacing CO₂ in all sugar carbon skeletons',
          },
          {
            zh: '直接变成花粉内的整颗种子',
            en: 'Directly becoming a whole seed inside pollen',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Mg参与叶绿素组成；糖碳主要由CO₂贡献，矿质有功能而非现成碳水食物。',
          en: 'Mg is part of chlorophyll; sugar carbon comes mainly from CO₂. Minerals support functions rather than supplying ready-made carbohydrate food.',
        },
        revisit: {
          zh: '看矿质图的Mg→叶绿素标签。',
          en: 'Read the Mg→chlorophyll label.',
        },
      },
      {
        id: 'L108-q3',
        skill: 'reasoning',
        prompt: {
          zh: '同种植物各20朵花：充分授粉组形成14颗种子，未人工授粉组6颗。最佳结论？',
          en: 'Same-species plants:20 flowers each produce 14 seeds with added pollination and 6 without. Best conclusion?',
        },
        options: [
          {
            zh: '充分授粉必使每朵花都形成一颗种子',
            en: 'Added pollination guarantees one seed per flower',
          },
          {
            zh: '6颗种子证明未授粉也能全部受精',
            en: 'Six seeds prove all unfertilised flowers become fertilised',
          },
          {
            zh: '支持授粉处理提高本条件结籽，但自然授粉、胚珠数和重复仍需考虑',
            en: 'Supports increased seed set here; natural pollination, ovule number and repeats still matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '14与6差8颗；不是20颗，且一花可能多胚珠。未人工授粉不等于无花粉到达。',
          en: 'The difference is 8 seeds, not 20; a flower may contain several ovules. No added pollination does not mean no pollen arrived.',
        },
        revisit: {
          zh: '回看授粉到种子间还有哪些步骤。',
          en: 'Review steps between pollination and seed formation.',
        },
      },
      {
        id: 'L108-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'ovule与seed的关系最准确的是？',
          en: 'Which best relates ovule and seed?',
        },
        options: [
          {
            zh: '胚珠在合适受精及发育后可形成种子',
            en: 'An ovule may become a seed after suitable fertilisation and development',
          },
          {
            zh: '胚珠就是落到柱头的花粉',
            en: 'An ovule is pollen landing on the stigma',
          },
          {
            zh: '每个胚珠都是已经萌发的种子',
            en: 'Every ovule is an already germinated seed',
          },
        ],
        correct: 0,
        feedback: {
          zh: '结构可以发育转变，但不能把受精前胚珠与成熟种子当同一个阶段。',
          en: 'Structures develop, but a pre-fertilisation ovule and mature seed are not the same stage.',
        },
        revisit: {
          zh: '查看图中胚珠的位置及最后一步。',
          en: 'Locate the ovule and inspect the final step.',
        },
      },
    ],
    mission: {
      zh: '画授粉到胚的路线，旁注N与Mg功能；写一条“有花粉仍不保证结籽”的条件化解释。',
      en: 'Draw the route from pollination to embryo, annotate N and Mg functions, and explain conditionally why pollen does not guarantee seed set.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Pollination and fertilization',
      url: 'https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization',
    },
  },
  {
    id: 'L109',
    title: {
      zh: 'DNA的结构与信息',
      en: 'DNA Structure and Information',
    },
    hook: {
      zh: '两段DNA使用同样四种字母，为什么仍可携带不同信息？把互补链写出来时，为什么还得标5′和3′？',
      en: 'Two DNA fragments use the same four letters: how can their information differ? Why must a complementary strand also show 5′ and 3′?',
    },
    minutes: 30,
    icon: '⌘',
    objectives: [
      {
        zh: '识别核苷酸、骨架和互补配对。',
        en: 'Identify nucleotides, backbones and complementary pairing.',
      },
      {
        zh: '读出反平行链方向并正确书写互补片段。',
        en: 'Read antiparallel orientation and write a complementary fragment.',
      },
      {
        zh: '说明序列信息不等于颜色或碱基总量。',
        en: 'Explain why sequence information differs from colours or base totals.',
      },
    ],
    prediction: [
      {
        zh: '相同碱基总量也可以有不同次序和信息。',
        en: 'Equal base totals can still give different order and information.',
      },
      {
        zh: '只要颜色一样，两片段的信息就相同。',
        en: 'Matching colours always mean identical information.',
      },
      {
        zh: '两条配对链都必须从图左边5′开始。',
        en: 'Both paired strands must start 5′ on the left.',
      },
    ],
    terms: [
      {
        word: {
          zh: 'DNA',
          en: 'DNA',
        },
        meaning: {
          zh: '常见细胞遗传信息载体，双链脱氧核糖核酸。',
          en: 'The usual cellular genetic-information molecule, deoxyribonucleic acid.',
        },
      },
      {
        word: {
          zh: '核苷酸',
          en: 'nucleotide',
        },
        meaning: {
          zh: '包含糖、磷酸和碱基的基本单位。',
          en: 'A building unit containing sugar, phosphate and a base.',
        },
      },
      {
        word: {
          zh: '碱基',
          en: 'base',
        },
        meaning: {
          zh: 'A、T、G、C所代表的含氮部分。',
          en: 'The nitrogen-containing component represented by A,T,G,C.',
        },
      },
      {
        word: {
          zh: '互补',
          en: 'complementary',
        },
        meaning: {
          zh: '特定配对关系，如A–T、G–C。',
          en: 'Specific pairing relationships, such as A–T and G–C.',
        },
      },
      {
        word: {
          zh: '反平行',
          en: 'antiparallel',
        },
        meaning: {
          zh: '配对链的化学方向相反。',
          en: 'Paired strands having opposite chemical orientations.',
        },
      },
      {
        word: {
          zh: '序列',
          en: 'sequence',
        },
        meaning: {
          zh: '核苷酸或碱基沿链的排列次序。',
          en: 'The order of nucleotides or bases along a strand.',
        },
      },
      {
        word: {
          zh: '基因组',
          en: 'genome',
        },
        meaning: {
          zh: '生物一套遗传信息的整体。',
          en: 'An organism’s complete set of genetic information.',
        },
      },
    ],
    questions: [
      {
        id: 'L109-q1',
        skill: 'concept',
        prompt: {
          zh: 'DNA核苷酸包含哪组结构？',
          en: 'Which components make a DNA nucleotide?',
        },
        options: [
          {
            zh: '只有一种碱基',
            en: 'A base alone',
          },
          {
            zh: '脂肪酸、甘油和蛋白质',
            en: 'Fatty acids, glycerol and protein',
          },
          {
            zh: '脱氧核糖、磷酸和碱基',
            en: 'Deoxyribose, phosphate and a base',
          },
        ],
        correct: 2,
        feedback: {
          zh: '图把骨架和内侧字母分开；字母只是核苷酸的一部分。',
          en: 'The diagram separates backbone and internal letters; a base is only part of a nucleotide.',
        },
        revisit: {
          zh: '读糖–磷酸骨架与内侧碱基说明。',
          en: 'Read the backbone and internal-base labels.',
        },
      },
      {
        id: 'L109-q2',
        skill: 'concept',
        prompt: {
          zh: '上链5′–AGTC–3′，下链按同一左→右顺序应写？',
          en: 'For upper 5′–AGTC–3′, how is the lower strand written left→right?',
        },
        options: [
          {
            zh: '3′–TCAG–5′',
            en: '3′–TCAG–5′',
          },
          {
            zh: '5′–TCAG–3′',
            en: '5′–TCAG–3′',
          },
          {
            zh: '3′–AGTC–5′',
            en: '3′–AGTC–5′',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'A配T、G配C，且化学方向相反；若下链也要求5′→3′，应写5′–GACT–3′。',
          en: 'Use A–T and G–C with opposite orientation. Reporting the lower strand 5′→3′ instead gives 5′–GACT–3′.',
        },
        revisit: {
          zh: '观察四个端点，按位置配对再检查方向。',
          en: 'Inspect all four ends; pair positions before checking orientation.',
        },
      },
      {
        id: 'L109-q3',
        skill: 'reasoning',
        prompt: {
          zh: '双链片段共100个核苷酸，其中A有30个。哪组总量可成立？',
          en: 'A double-stranded fragment has 100 nucleotides, including 30 A. Which totals fit?',
        },
        options: [
          {
            zh: 'T20、G25、C25',
            en: 'T20,G25,C25',
          },
          {
            zh: 'T30、G20、C20',
            en: 'T30,G20,C20',
          },
          {
            zh: 'T30、G30、C10',
            en: 'T30,G30,C10',
          },
        ],
        correct: 1,
        feedback: {
          zh: '完整配对双链中A=T=30；剩40分给G=C，各20。此规则不必对孤立单链成立。',
          en: 'For a fully paired double strand,A=T=30; the remaining 40 areG=C=20 each. An isolated single strand need not satisfy these totals.',
        },
        revisit: {
          zh: '用A–T、G–C规则核对配对和总和100。',
          en: 'Use pairing and the total 100 together.',
        },
      },
      {
        id: 'L109-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'antiparallel指什么？',
          en: 'What does antiparallel mean?',
        },
        options: [
          {
            zh: '两链颜色必须相反',
            en: 'The strands must have opposite colours',
          },
          {
            zh: '两链一个是蛋白质',
            en: 'One strand is protein',
          },
          {
            zh: '一链5′→3′方向对应另一链3′→5′',
            en: 'One 5′→3′ direction aligns with the other 3′→5′',
          },
        ],
        correct: 2,
        feedback: {
          zh: '反平行是分子方向，不是上下位置或示意色。',
          en: 'Antiparallel describes molecular orientation, not vertical position or display colour.',
        },
        revisit: {
          zh: '看上链与下链左端不同的端点。',
          en: 'Compare the different left endpoints.',
        },
      },
    ],
    mission: {
      zh: '写一段非回文6碱基片段及配对链，标四个端点，再解释同样碱基组成为何不保证相同序列。',
      en: 'Write a non-palindromic six-base fragment and its complement, mark all four ends, and explain why equal composition does not ensure equal sequence.',
    },
    reference: {
      title: 'OpenStax Biology 2e · DNA structure',
      url: 'https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing',
    },
  },
  {
    id: 'L110',
    title: {
      zh: '基因与蛋白质入门',
      en: 'From Genes to Proteins',
    },
    hook: {
      zh: 'DNA留在细胞核，核外却能制造蛋白质。信息怎样跨过去？每个基因都必须经过蛋白质这一步吗？',
      en: 'DNA remains in the nucleus while proteins are made outside it. How does information travel? Must every gene produce a protein?',
    },
    minutes: 30,
    icon: '⌘',
    objectives: [
      {
        zh: '连接DNA、RNA和蛋白质的信息层级。',
        en: 'Connect the information levels of DNA,RNA and protein.',
      },
      {
        zh: '定位真核转录与核糖体翻译。',
        en: 'Locate eukaryotic transcription and ribosomal translation.',
      },
      {
        zh: '区分蛋白编码基因、功能RNA基因与复杂性状。',
        en: 'Distinguish protein-coding genes, functional-RNA genes and complex traits.',
      },
    ],
    prediction: [
      {
        zh: 'RNA可传递信息，有些RNA本身就是功能产物。',
        en: 'RNA can carry information; some RNA is itself functional.',
      },
      {
        zh: 'DNA直接离核并变成氨基酸。',
        en: 'DNA leaves the nucleus and turns into amino acids.',
      },
      {
        zh: '所有基因都只对应一个可见性状。',
        en: 'Every gene corresponds to exactly one visible trait.',
      },
    ],
    terms: [
      {
        word: {
          zh: '基因',
          en: 'gene',
        },
        meaning: {
          zh: '产生功能RNA或蛋白产物所需信息的DNA区域。',
          en: 'A DNA region supplying information for functional RNA or protein products.',
        },
      },
      {
        word: {
          zh: '转录',
          en: 'transcription',
        },
        meaning: {
          zh: '以DNA信息形成RNA的过程。',
          en: 'Production of RNA using DNA information.',
        },
      },
      {
        word: {
          zh: 'RNA',
          en: 'RNA',
        },
        meaning: {
          zh: '参与信息传递、结构或其他细胞功能的核酸。',
          en: 'A nucleic acid involved in information transfer, structure and other functions.',
        },
      },
      {
        word: {
          zh: '信使RNA',
          en: 'messenger RNA',
        },
        meaning: {
          zh: '可供核糖体读取蛋白序列信息的RNA。',
          en: 'RNA read by ribosomes for protein-sequence information.',
        },
      },
      {
        word: {
          zh: '翻译',
          en: 'translation',
        },
        meaning: {
          zh: '核糖体依据信使RNA连接氨基酸的过程。',
          en: 'Ribosomal assembly of amino acids using mRNA information.',
        },
      },
      {
        word: {
          zh: '核糖体',
          en: 'ribosome',
        },
        meaning: {
          zh: '由RNA和蛋白组成、进行翻译的结构。',
          en: 'An RNA–protein structure performing translation.',
        },
      },
      {
        word: {
          zh: '氨基酸',
          en: 'amino acid',
        },
        meaning: {
          zh: '构成蛋白质链的基本单位。',
          en: 'A building unit of protein chains.',
        },
      },
    ],
    questions: [
      {
        id: 'L110-q1',
        skill: 'concept',
        prompt: {
          zh: '蛋白编码基因的主要信息路线是？',
          en: 'What is the main information route for a protein-coding gene?',
        },
        options: [
          {
            zh: '蛋白质→RNA→DNA，每次都逆向',
            en: 'Protein→RNA→DNA in every case',
          },
          {
            zh: 'DNA→RNA→蛋白质',
            en: 'DNA→RNA→protein',
          },
          {
            zh: 'DNA直接变成完整蛋白质',
            en: 'DNA directly becomes a complete protein',
          },
        ],
        correct: 1,
        feedback: {
          zh: '转录形成RNA，核糖体再翻译；DNA没有作为材料变成蛋白质。',
          en: 'Transcription makes RNA, then ribosomes translate it; DNA is not consumed as protein material.',
        },
        revisit: {
          zh: '对照核内DNA与核外核糖体。',
          en: 'Compare nuclear DNA with cytoplasmic ribosomes.',
        },
      },
      {
        id: 'L110-q2',
        skill: 'concept',
        prompt: {
          zh: '功能RNA基因和蛋白编码基因的共同点是？',
          en: 'What do functional-RNA and protein-coding genes share?',
        },
        options: [
          {
            zh: '都需要把DNA信息转录为RNA',
            en: 'Both involve transcription of DNA information into RNA',
          },
          {
            zh: '都必须翻译为同一个蛋白质',
            en: 'Both must translate into the same protein',
          },
          {
            zh: '都只决定一个性状',
            en: 'Both determine exactly one trait',
          },
        ],
        correct: 0,
        feedback: {
          zh: '功能RNA可不翻译；共同层是RNA生成，而不是所有基因产物都为蛋白。',
          en: 'Functional RNA need not be translated; the shared level is RNA production, not necessarily protein production.',
        },
        revisit: {
          zh: '切换两个产物路线，比较前两步。',
          en: 'Compare the first two steps of both product routes.',
        },
      },
      {
        id: 'L110-q3',
        skill: 'reasoning',
        prompt: {
          zh: '细胞A/B同样有基因X；A检测到X的RNA和蛋白，B两者均低。哪项解释最合理？',
          en: 'Cells A/B both contain gene X; A has its RNA and protein, B has little of either. Best interpretation?',
        },
        options: [
          {
            zh: 'B肯定完全没有DNA',
            en: 'B certainly has no DNA',
          },
          {
            zh: '有同一基因不保证同等表达，需查表达条件与测量',
            en: 'Having the gene does not ensure equal expression; investigate conditions and measurements',
          },
          {
            zh: 'A的全部DNA已变成蛋白质',
            en: 'All A DNA has turned into protein',
          },
        ],
        correct: 1,
        feedback: {
          zh: '区分拥有信息和使用信息；低检测值也有测量阈值，不足以证明基因消失。',
          en: 'Distinguish possessing information from using it. Low detection also involves thresholds; it does not establish loss of the gene.',
        },
        revisit: {
          zh: '查看DNA仍留核内和RNA产物逐步出现。',
          en: 'Observe DNA remaining in the nucleus while RNA products appear.',
        },
      },
      {
        id: 'L110-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'translation在本课指什么？',
          en: 'What does translation mean here?',
        },
        options: [
          {
            zh: '把中文科学术语改成英文',
            en: 'Changing Chinese science terms to English',
          },
          {
            zh: '复制整套DNA',
            en: 'Copying the whole genome',
          },
          {
            zh: '核糖体读取mRNA信息并连接氨基酸',
            en: 'A ribosome reading mRNA information and joining amino acids',
          },
        ],
        correct: 2,
        feedback: {
          zh: '这是生物分子过程专名，不是语言翻译，也不是DNA复制。',
          en: 'This is a molecular process, not language translation or DNA replication.',
        },
        revisit: {
          zh: '看最后一步核糖体与氨基酸链。',
          en: 'Inspect the ribosome and amino-acid chain in the final step.',
        },
      },
    ],
    mission: {
      zh: '画两条基因产物路线：蛋白编码与功能RNA；给箭头写过程和位置，并附一条不等于一基因一性状的解释。',
      en: 'Draw protein-coding and functional-RNA routes, label processes and locations, and explain why the map does not imply one gene per trait.',
    },
    reference: {
      title: 'NHGRI · Gene definitions and functional RNA',
      url: 'https://www.genome.gov/genetics-glossary/Gene',
    },
  },
  {
    id: 'L111',
    title: {
      zh: '有丝分裂、减数分裂对比',
      en: 'Mitosis vs Meiosis',
    },
    hook: {
      zh: 'DNA复制使含量加倍，染色体套数也加倍吗？同样复制一次，为什么有丝给两个细胞，减数给四个？',
      en: 'Does doubling DNA double chromosome sets? After one replication, why does mitosis produce two cells and meiosis four?',
    },
    minutes: 30,
    icon: '⌘',
    objectives: [
      {
        zh: '区分套数、染色体、染色单体与DNA含量。',
        en: 'Distinguish sets, chromosomes, chromatids and DNA amount.',
      },
      {
        zh: '追踪有丝、减I与减II所分离的结构。',
        en: 'Track what separates in mitosis, meiosisI and meiosisII.',
      },
      {
        zh: '用每细胞账本验证一次复制和总DNA守恒。',
        en: 'Use per-cell accounting to verify one replication and DNA conservation.',
      },
    ],
    prediction: [
      {
        zh: '复制后染色单体与DNA加倍，套数未加倍。',
        en: 'Replication doubles chromatids and DNA, not chromosome sets.',
      },
      {
        zh: '减I和减II前都必须再次复制DNA。',
        en: 'DNA must replicate again before both meiosisI andII.',
      },
      {
        zh: '每个X必是两条独立染色体。',
        en: 'Every X must be two independent chromosomes.',
      },
    ],
    terms: [
      {
        word: {
          zh: '有丝分裂',
          en: 'mitosis',
        },
        meaning: {
          zh: '通常保持套数、分离姐妹染色单体的核分裂。',
          en: 'Nuclear division generally maintaining ploidy while separating sister chromatids.',
        },
      },
      {
        word: {
          zh: '减数分裂',
          en: 'meiosis',
        },
        meaning: {
          zh: '一次复制、两次分裂，使套数减少的过程。',
          en: 'One replication and two divisions reducing chromosome sets.',
        },
      },
      {
        word: {
          zh: '同源染色体',
          en: 'homologous chromosomes',
        },
        meaning: {
          zh: '有对应基因位置的一对染色体。',
          en: 'A pair with corresponding gene positions.',
        },
      },
      {
        word: {
          zh: '姐妹染色单体',
          en: 'sister chromatids',
        },
        meaning: {
          zh: '一条染色体复制后相连的两份。',
          en: 'The connected copies of one replicated chromosome.',
        },
      },
      {
        word: {
          zh: '单倍体',
          en: 'haploid',
        },
        meaning: {
          zh: '具有一套染色体。',
          en: 'Having one chromosome set.',
        },
      },
      {
        word: {
          zh: '二倍体',
          en: 'diploid',
        },
        meaning: {
          zh: '具有两套染色体。',
          en: 'Having two chromosome sets.',
        },
      },
      {
        word: {
          zh: 'DNA含量',
          en: 'DNA content',
        },
        meaning: {
          zh: '细胞含DNA的量，可用C作相对单位。',
          en: 'Amount of cellular DNA, expressible in relative C units.',
        },
      },
    ],
    questions: [
      {
        id: 'L111-q1',
        skill: 'concept',
        prompt: {
          zh: '2n=4细胞复制后、分裂前的正确账本？',
          en: 'What is correct after replication but before division in a 2n=4 cell?',
        },
        options: [
          {
            zh: '4套、8条染色体、2C',
            en: '4 sets,8 chromosomes,2C',
          },
          {
            zh: '2套、4条染色体、8条染色单体、4C',
            en: '2 sets,4 chromosomes,8 chromatids,4C',
          },
          {
            zh: '1套、2条染色体、1C',
            en: '1 set,2 chromosomes,1C',
          },
        ],
        correct: 1,
        feedback: {
          zh: '复制让每条染色体有两条姐妹，但同源组数仍是两套。X按连接的着丝粒单位计一条。',
          en: 'Replication makes two sisters per chromosome while retaining two homologous sets. A joined X counts as one chromosome unit.',
        },
        revisit: {
          zh: '看步骤2复制检查点的4个X和4C。',
          en: 'Inspect the four X units and 4C at checkpoint 2.',
        },
      },
      {
        id: 'L111-q2',
        skill: 'concept',
        prompt: {
          zh: '减数第一次分裂主要分离什么？',
          en: 'What separates during meiosisI?',
        },
        options: [
          {
            zh: '同源染色体，姐妹通常仍相连',
            en: 'Homologous chromosomes; sisters generally remain joined',
          },
          {
            zh: '全部DNA都降解',
            en: 'All DNA is degraded',
          },
          {
            zh: '姐妹染色单体，且同源都去同一细胞',
            en: 'Sisters, with all homologues entering one cell',
          },
        ],
        correct: 0,
        feedback: {
          zh: '减I降低套数，减II再分姐妹；两次分裂之间不再复制。',
          en: 'MeiosisI reduces sets; meiosisII separates sisters, without intervening replication.',
        },
        revisit: {
          zh: '看减数路线步骤3：每细胞两个X但只有一套。',
          en: 'Inspect meiotic checkpoint 3: two X chromosomes but one set per cell.',
        },
      },
      {
        id: 'L111-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一个4C细胞完成减数分裂得4个各1C细胞，这说明？',
          en: 'One 4C cell completes meiosis to yield four 1C cells. What follows?',
        },
        options: [
          {
            zh: '分裂之间必复制两次',
            en: 'Two more replications must have occurred',
          },
          {
            zh: 'DNA总量由4C变1C，丢了四分之三',
            en: 'Total DNA fell 4C→1C, losing three quarters',
          },
          {
            zh: '总量4×1C=4C，分配到更多细胞而非再复制',
            en: 'Total 4×1C=4C: distribution into more cells, not another replication',
          },
        ],
        correct: 2,
        feedback: {
          zh: '每细胞与全部细胞总和不同；四个1C保留复制后的4C总量，模型忽略损失和错误。',
          en: 'Per-cell amount differs from the total. Four 1C cells preserve the replicated 4C total in this idealised error-free model.',
        },
        revisit: {
          zh: '把每步细胞数乘以每细胞C值。',
          en: 'Multiply cell count by per-cell C at each checkpoint.',
        },
      },
      {
        id: 'L111-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'haploid最准确是？',
          en: 'What best defines haploid?',
        },
        options: [
          {
            zh: 'DNA含量永远只能1C',
            en: 'DNA amount must always be 1C',
          },
          {
            zh: '具有一套染色体',
            en: 'Having one chromosome set',
          },
          {
            zh: '一条染色体都没有',
            en: 'Having no chromosomes',
          },
        ],
        correct: 1,
        feedback: {
          zh: '减I后每细胞已是单倍体，但染色体仍已复制，DNA为2C。单倍体描述套数。',
          en: 'After meiosisI the cell is haploid but chromosomes remain replicated, with 2C DNA. Haploid describes sets.',
        },
        revisit: {
          zh: '比较减I后1套/2C与减II后1套/1C。',
          en: 'Compare one set/2C afterI with one set/1C afterII.',
        },
      },
    ],
    mission: {
      zh: '画两条分裂路线，每个检查点标细胞数和每细胞染色体数、染色单体数、C值；检查总DNA并写不再复制的位置。',
      en: 'Draw both division routes and label cells and per-cell chromosome, chromatid and C counts. Check total DNA and mark where replication does not recur.',
    },
    reference: {
      title: 'OpenStax Biology 2e · The process of meiosis',
      url: 'https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis',
    },
  },
  {
    id: 'L112',
    title: {
      zh: '遗传变异与复杂性状',
      en: 'Variation and Complex Traits',
    },
    hook: {
      zh: '同一品种在不同环境长得不同，是否说明基因没有作用？连续的株高分布能证明“完全由遗传决定”吗？',
      en: 'If one variety grows differently in two environments, are genes irrelevant? Does continuous plant height prove complete genetic control?',
    },
    minutes: 30,
    icon: '⌘',
    objectives: [
      {
        zh: '区别基因型、表现型和环境影响。',
        en: 'Distinguish genotype, phenotype and environmental influence.',
      },
      {
        zh: '用同基因型/同环境比较识别交互。',
        en: 'Use matched-genotype and matched-environment comparisons to identify interaction.',
      },
      {
        zh: '解释分布形状不能单独证明遗传机制。',
        en: 'Explain why distribution shape alone cannot establish inheritance mechanisms.',
      },
    ],
    prediction: [
      {
        zh: '同基因型在不同环境可有不同表现。',
        en: 'The same genotype can produce different phenotypes across environments.',
      },
      {
        zh: '连续变化一定没有环境作用。',
        en: 'Continuous variation always excludes environmental effects.',
      },
      {
        zh: '离散类别足以证明只有一个基因。',
        en: 'Discrete categories prove a single gene is involved.',
      },
    ],
    terms: [
      {
        word: {
          zh: '变异',
          en: 'variation',
        },
        meaning: {
          zh: '个体之间的差异。',
          en: 'Differences among individuals.',
        },
      },
      {
        word: {
          zh: '基因型',
          en: 'genotype',
        },
        meaning: {
          zh: '所考察个体的遗传组成。',
          en: 'The genetic constitution being considered.',
        },
      },
      {
        word: {
          zh: '表现型',
          en: 'phenotype',
        },
        meaning: {
          zh: '基因和环境共同影响的可观察特征。',
          en: 'Observable characteristics influenced by genes and environment.',
        },
      },
      {
        word: {
          zh: '多基因',
          en: 'polygenic',
        },
        meaning: {
          zh: '受多个基因影响。',
          en: 'Influenced by multiple genes.',
        },
      },
      {
        word: {
          zh: '环境',
          en: 'environment',
        },
        meaning: {
          zh: '影响生物的外部条件。',
          en: 'External conditions affecting organisms.',
        },
      },
      {
        word: {
          zh: '交互作用',
          en: 'interaction',
        },
        meaning: {
          zh: '一个因素的效果随另一个因素而变化。',
          en: 'An effect of one factor that changes with another factor.',
        },
      },
      {
        word: {
          zh: '连续变异',
          en: 'continuous variation',
        },
        meaning: {
          zh: '某特征在一定范围呈许多中间值。',
          en: 'Variation with many intermediate values across a range.',
        },
      },
    ],
    questions: [
      {
        id: 'L112-q1',
        skill: 'concept',
        prompt: {
          zh: '同基因型环境改变后株高改变，说明？',
          en: 'If the same genotype changes height across environments, what follows?',
        },
        options: [
          {
            zh: '基因必定没有作用',
            en: 'Genes must have no effect',
          },
          {
            zh: '环境必定改变了全部DNA序列',
            en: 'Environment must have changed the entire DNA sequence',
          },
          {
            zh: '表现型可受环境影响，不能据此排除遗传作用',
            en: 'Phenotype can respond to environment without excluding genetic influence',
          },
        ],
        correct: 2,
        feedback: {
          zh: '控制基因型可比较环境效应；环境有作用不等于基因无作用。',
          en: 'Matching genotype helps investigate environmental effects; environmental influence does not imply genetic irrelevance.',
        },
        revisit: {
          zh: '固定G=3，比较环境0与2的16和28。',
          en: 'Hold G=3 and compare 16 versus 28 at environment 0 and 2.',
        },
      },
      {
        id: 'L112-q2',
        skill: 'concept',
        prompt: {
          zh: '离散的两类表现一定由一个基因决定吗？',
          en: 'Must a two-category phenotype be controlled by one gene?',
        },
        options: [
          {
            zh: '不一定，多个因素或阈值也能产生类别',
            en: 'No; multiple factors or thresholds can produce categories',
          },
          {
            zh: '一定，只能是显性和隐性',
            en: 'Yes, it must be dominant/recessive',
          },
          {
            zh: '一定，环境不能产生类别',
            en: 'Yes, environments cannot produce categories',
          },
        ],
        correct: 0,
        feedback: {
          zh: '分布是结果形状，机制需遗传与环境证据；类别化测量还可能把连续量切分。',
          en: 'Distribution is an outcome shape. Mechanism needs genetic and environmental evidence; thresholds can divide a continuous measure into categories.',
        },
        revisit: {
          zh: '读静态步骤关于连续与离散的边界。',
          en: 'Read the static explanation of continuous/discrete limits.',
        },
      },
      {
        id: 'L112-q3',
        skill: 'reasoning',
        prompt: {
          zh: '环境0→2时G=0株高10→16，G=6为22→40。哪项最准确？',
          en: 'From environment 0→2,G=0 height 10→16 andG=6 height 22→40. Best interpretation?',
        },
        options: [
          {
            zh: '环境效果对所有G都相同',
            en: 'Environmental effects are equal for every G',
          },
          {
            zh: '两种G分别增加6和18单位，符合基因×环境交互',
            en: 'The increases 6 and 18 units fit gene×environment interaction',
          },
          {
            zh: '基因型高的个体没有环境响应',
            en: 'The higher-G plants do not respond to environment',
          },
        ],
        correct: 1,
        feedback: {
          zh: '同一环境改变产生不同增量，不只是整体平移；这是本虚构公式中的交互，不能外推人类。',
          en: 'The same environmental change produces different increments, not merely a common shift. This is interaction in a fictional formula, not a human prediction.',
        },
        revisit: {
          zh: '选择G=0和6，分别读环境0→2数值。',
          en: 'Select G=0 and 6 and read each environment 0→2 comparison.',
        },
      },
      {
        id: 'L112-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'polygenic中的poly表示？',
          en: 'What does poly mean in polygenic?',
        },
        options: [
          {
            zh: '只受环境影响',
            en: 'Environmental influence only',
          },
          {
            zh: '完全相同',
            en: 'Completely identical',
          },
          {
            zh: '多个，表示多个基因参与',
            en: 'Many, indicating multiple genes contribute',
          },
        ],
        correct: 2,
        feedback: {
          zh: '多基因不等于没有环境，也不意味着每个基因贡献完全相同。',
          en: 'Polygenic does not exclude environment or imply identical effects for every gene.',
        },
        revisit: {
          zh: '看三个基因座贡献合并为G的说明。',
          en: 'Read how three loci combine into G.',
        },
      },
    ],
    mission: {
      zh: '写一条遗传影响、一条环境影响和一条交互证据；引用固定条件及增量，并说明图不能估计真实遗传率。',
      en: 'State genetic, environmental and interaction evidence with fixed conditions and increments; explain why the plot cannot estimate real heritability.',
    },
    reference: {
      title: 'NHGRI · Gene–environment interaction',
      url: 'https://www.genome.gov/genetics-glossary/Gene-Environment-Interaction',
    },
  },
];
