import type { Lesson } from '../schema';
export const energyLessons: Lesson[] = [
  {
    id: 'L033',
    title: {
      zh: '能量从哪里来？',
      en: 'Where does energy come from?',
    },
    minutes: 20,
    icon: '☀',
    summary: {
      zh: '一片吐司，怎样支持细胞的工作？',
      en: 'How can toast support cellular work?',
    },
    hook: {
      zh: '你坐着读书，细胞也在维持边界、更新材料。追踪一片吐司或一片叶子，把阳光、食物、ATP与活动连起来；再换成碳路线，看看哪些东西不同。',
      en: 'Even while you read quietly, cells maintain boundaries and renew materials. Trace toast or a leaf from sunlight through food and ATP to activity, then switch to carbon to compare.',
    },
    objectives: [
      {
        zh: '解释光能、食物中的化学能、ATP与细胞工作之间的关系。',
        en: 'Connect light, food chemical energy, ATP and cellular work.',
      },
      {
        zh: '区分物质的碳路线与能量转移，不把光当作糖的原料。',
        en: 'Separate carbon matter from energy transfer; light is not sugar material.',
      },
    ],
    prediction: [
      {
        zh: '阳光直接变成糖里的碳',
        en: 'Sunlight becomes the carbon in sugar',
      },
      {
        zh: '光提供能量，碳来自物质，细胞再转移化学能',
        en: 'Light supplies energy; carbon comes from matter; cells transfer chemical energy',
      },
      {
        zh: '不运动的细胞不需要能量',
        en: 'Still cells need no energy',
      },
    ],
    terms: [
      {
        word: {
          zh: '能量',
          en: 'energy',
        },
        meaning: {
          zh: '使变化发生的能力；本课追踪转移，不把它当作一种原子。',
          en: 'Capacity to bring about change; tracked as transfers, not a kind of atom.',
        },
      },
      {
        word: {
          zh: '化学能',
          en: 'chemical energy',
        },
        meaning: {
          zh: '与物质化学组成有关，可在反应中转移的能量。',
          en: 'Energy associated with chemical composition that can transfer through reactions.',
        },
      },
      {
        word: {
          zh: 'ATP',
          en: 'ATP',
        },
        meaning: {
          zh: '细胞内耦联供能反应与工作的重要分子，不是凭空造能量。',
          en: 'A molecule coupling energy-supplying reactions to cellular work; it does not create energy.',
        },
      },
      {
        word: {
          zh: '物质',
          en: 'matter',
        },
        meaning: {
          zh: '具有质量并占空间的东西，如水、糖和二氧化碳。',
          en: 'Something with mass and occupying space, such as water, sugar and carbon dioxide.',
        },
      },
      {
        word: {
          zh: '热',
          en: 'heat',
        },
        meaning: {
          zh: '能量以热的形式转移到周围后，不再是同一条食物能量路线。',
          en: 'Energy transfers to surroundings as heat rather than continuing as the same food-energy route.',
        },
      },
    ],
    mission: {
      zh: '为一片吐司或一片叶子画光→化学能→ATP支持的工作→散热。另写碳来自哪里，别把两个箭头混为一谈。',
      en: 'Sketch light → chemical energy → ATP-supported work → heat for toast or a leaf. Separately state where carbon comes from.',
    },
    questions: [
      {
        id: 'L033-q1',
        skill: 'concept',
        prompt: {
          zh: '一片吐司中的化学能，怎样支持肌肉细胞？',
          en: 'How can chemical energy in toast support a muscle cell?',
        },
        options: [
          {
            zh: '阳光直接穿进肌肉做所有工作',
            en: 'Sunlight enters muscle and does all work',
          },
          {
            zh: '消化吸收提供材料，细胞反应转移能量并通过ATP支持工作',
            en: 'Digestion and absorption supply material; cellular reactions transfer energy through ATP to work',
          },
          {
            zh: '食物只让胃变重，不与细胞相关',
            en: 'Food only adds stomach weight',
          },
        ],
        correct: 1,
        feedback: {
          zh: '消化把淀粉等转成可吸收材料，循环把材料送到细胞；细胞反应与ATP把食物能量和工作连接。',
          en: 'Digestion produces absorbable materials, circulation delivers them, and cellular reactions with ATP connect food energy to work.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L033-q2',
        skill: 'concept',
        prompt: {
          zh: '一格不运动的根细胞，需要能量吗？',
          en: 'Does an unmoving root cell need energy?',
        },
        options: [
          {
            zh: '需要，维持、运输与制造材料也要供能',
            en: 'Yes; maintenance, transport and material assembly need energy',
          },
          {
            zh: '不需要，只有跑步才需要',
            en: 'No; only running needs energy',
          },
          {
            zh: '不需要，根细胞不是活细胞',
            en: 'No; root cells are not living',
          },
        ],
        correct: 0,
        feedback: {
          zh: '生命活动不只有移动。维持边界、调节物质和更新结构都与能量转移有关。',
          en: 'Life involves more than movement. Maintaining boundaries, regulating substances and renewing structures involve energy transfer.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L033-q3',
        skill: 'reasoning',
        prompt: {
          zh: '“光变成糖里的碳，所以不用二氧化碳。”哪里有问题？',
          en: '“Light becomes sugar carbon, so CO₂ is unnecessary.” What is wrong?',
        },
        options: [
          {
            zh: '只有光的颜色错了',
            en: 'Only the light colour is wrong',
          },
          {
            zh: '光的速度不够快',
            en: 'Light is too slow',
          },
          {
            zh: '混淆能量与物质；植物制糖的碳主要来自CO₂',
            en: 'It confuses energy with matter; sugar carbon in plants comes mainly from CO₂',
          },
        ],
        correct: 2,
        feedback: {
          zh: '光供能，CO₂等供原子。能量箭头与碳原子的路线不能互换。',
          en: 'Light supplies energy; CO₂ and other substances supply atoms. An energy arrow is not a carbon-atom route.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L033-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'ATP在本课最接近什么角色？',
          en: 'What is ATP’s role here?',
        },
        options: [
          {
            zh: '长期储存所有食物的胃',
            en: 'A stomach storing all food',
          },
          {
            zh: '细胞内耦联供能与工作的分子',
            en: 'A molecule coupling energy supply to cellular work',
          },
          {
            zh: '一种从阳光来的碳原子',
            en: 'A carbon atom from sunlight',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'ATP不是器官，也不是能量本身。它的反应可与细胞工作耦联，需要不断再生成。',
          en: 'ATP is neither an organ nor energy itself. Its reactions can couple to cellular work and it must be regenerated.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · Energy in living systems',
      url: 'https://openstax.org/books/biology-2e/pages/7-1-energy-in-living-systems',
    },
  },
  {
    id: 'L034',
    title: {
      zh: '叶片怎样制造糖？',
      en: 'Photosynthesis basics',
    },
    minutes: 20,
    icon: '❧',
    summary: {
      zh: '糖里的碳，是从土里挖出来的吗？',
      en: 'Does sugar carbon come from digging in soil?',
    },
    hook: {
      zh: '叶片长在土上，却从空气取得制造糖的碳。追踪六个碳点，改变光和原料条件，看看光提供了什么、CO₂提供了什么。',
      en: 'A leaf grows above soil but gets sugar carbon from the air. Follow six carbon tracers and change light and material conditions to separate their roles.',
    },
    objectives: [
      {
        zh: '追踪CO₂中的碳进入糖，区分光能与原料。',
        en: 'Trace carbon from CO₂ into sugar, distinguishing light energy from materials.',
      },
      {
        zh: '改变光、水与CO₂条件，说明模型不预测真实速率。',
        en: 'Change light, water and CO₂ conditions without treating the model as a rate prediction.',
      },
    ],
    prediction: [
      {
        zh: '糖的碳主要从土壤直接来',
        en: 'Sugar carbon mainly comes directly from soil',
      },
      {
        zh: 'CO₂提供碳，光提供能量，还需水与合适条件',
        en: 'CO₂ supplies carbon, light supplies energy, with water and suitable conditions',
      },
      {
        zh: '更亮的光永远使制糖更快',
        en: 'Brighter light always makes sugar faster',
      },
    ],
    terms: [
      {
        word: {
          zh: '光合作用',
          en: 'photosynthesis',
        },
        meaning: {
          zh: '生物利用光能制造有机物的过程，本课代表绿色叶肉。',
          en: 'Light-powered organic-matter production, represented by green mesophyll here.',
        },
      },
      {
        word: {
          zh: '二氧化碳',
          en: 'carbon dioxide',
        },
        meaning: {
          zh: '含碳的气体，叶片制糖的主要碳来源。',
          en: 'A carbon-containing gas and main carbon source for leaf sugar-making.',
        },
      },
      {
        word: {
          zh: '叶绿素',
          en: 'chlorophyll',
        },
        meaning: {
          zh: '参与吸收光的色素；不是糖的碳来源。',
          en: 'A pigment involved in light absorption, not the carbon source of sugar.',
        },
      },
      {
        word: {
          zh: '葡萄糖',
          en: 'glucose',
        },
        meaning: {
          zh: '含六个碳的糖；本课用它表示总体制糖产物。',
          en: 'A six-carbon sugar used here as an overall product representation.',
        },
      },
      {
        word: {
          zh: '原料',
          en: 'reactant',
        },
        meaning: {
          zh: '反应开始使用的物质，如本课水与CO₂。',
          en: 'A substance used as a reaction input, such as water and CO₂ here.',
        },
      },
    ],
    mission: {
      zh: '写一句光供能、CO₂供碳、水参与反应；比较有光与无光。注明可用原料与适宜温度等假设。',
      en: 'State that light supplies energy, CO₂ supplies carbon and water participates. Compare light versus darkness and state available-material and suitable-temperature assumptions.',
    },
    questions: [
      {
        id: 'L034-q1',
        skill: 'concept',
        prompt: {
          zh: '模型中进入糖的六个碳，来自哪里？',
          en: 'Where do the six sugar carbon tracers originate?',
        },
        options: [
          {
            zh: 'CO₂',
            en: 'CO₂',
          },
          {
            zh: '光线里的金色原子',
            en: 'Gold atoms in light',
          },
          {
            zh: '叶片有意识地产生新原子',
            en: 'Atoms consciously created by the leaf',
          },
        ],
        correct: 0,
        feedback: {
          zh: '光供能，CO₂供碳。本模型保留同样六个碳点，不凭空制造碳。',
          en: 'Light supplies energy and CO₂ supplies carbon. The same six carbon tracers are retained.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L034-q2',
        skill: 'concept',
        prompt: {
          zh: '假定没有可用储备支持这条制糖路线，去掉可用水会怎样？',
          en: 'With no usable reserve sustaining this sugar-making route, what follows if usable water is absent?',
        },
        options: [
          {
            zh: '光能代替所有水原子',
            en: 'Light replaces all water atoms',
          },
          {
            zh: '这条示范路线缺原料，不能据此计算真实叶片的停工时间',
            en: 'The route lacks a material; this does not calculate when a real leaf stops',
          },
          {
            zh: '细胞壁立刻消失',
            en: 'The wall vanishes immediately',
          },
        ],
        correct: 1,
        feedback: {
          zh: '水是参与反应的物质。选择模型条件不等于真实植物一停浇水就立刻停止光合作用。',
          en: 'Water participates as material. A model condition does not imply photosynthesis stops instantly when watering stops.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L034-q3',
        skill: 'reasoning',
        prompt: {
          zh: '把光从较弱改成较亮，模型都显示可制糖。能判断真实速率翻倍吗？',
          en: 'Both dimmer and brighter settings allow sugar-making. Can we infer the real rate doubles?',
        },
        options: [
          {
            zh: '能，按钮名字已经测出了速率',
            en: 'Yes; the label measures rate',
          },
          {
            zh: '能，水和CO₂永远不限制',
            en: 'Yes; water and CO₂ never limit',
          },
          {
            zh: '不能，这只判断条件，真实速率还受其他因素影响',
            en: 'No; this checks conditions, while real rates depend on other factors',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型没有速率公式。温度、CO₂、可用水、酶和光等都可能影响实际过程。',
          en: 'There is no rate equation here. Temperature, CO₂, water availability, enzymes and light can affect real processes.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L034-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'photosynthesis在本课是哪条路线？',
          en: 'Which route is photosynthesis here?',
        },
        options: [
          {
            zh: '呼吸空气进入肺',
            en: 'Air entering lungs',
          },
          {
            zh: '利用光、水与CO₂制造有机物',
            en: 'Using light, water and CO₂ to make organic matter',
          },
          {
            zh: '食物进入胃',
            en: 'Food entering a stomach',
          },
        ],
        correct: 1,
        feedback: {
          zh: '光合作用不是肺的吸气，也不是动物进食；本课用叶肉中的总体制糖路线表达。',
          en: 'Photosynthesis is not inhalation or animal feeding; the model represents an overall sugar-making route in mesophyll.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · Photosynthesis overview',
      url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis',
    },
  },
  {
    id: 'L035',
    title: {
      zh: '细胞怎样释放可用能量？',
      en: 'Cellular respiration basics',
    },
    minutes: 20,
    icon: '↻',
    summary: {
      zh: '叶片到了夜晚，还能用糖做事吗？',
      en: 'Can leaf cells use sugar at night?',
    },
    hook: {
      zh: '白天叶片制糖，到了夜晚没有光，它仍要维持细胞。比较叶肉、根和肌肉三类细胞，把吸气与细胞呼吸分开。',
      en: 'A leaf makes sugar by day but still needs cellular maintenance at night. Compare mesophyll, root and muscle cells, separating breathing from cellular respiration.',
    },
    objectives: [
      {
        zh: '解释有氧细胞呼吸把有机物中的能量转移，与ATP和散热联系。',
        en: 'Explain aerobic respiration as energy transfer linked to ATP and heat.',
      },
      {
        zh: '说明植物也呼吸，缺氧只使本课有氧路线不成立。',
        en: 'Explain plant respiration and why missing oxygen removes only the depicted aerobic route.',
      },
    ],
    prediction: [
      {
        zh: '植物白天只光合作用，夜晚才呼吸',
        en: 'Plants photosynthesise by day and only respire at night',
      },
      {
        zh: '植物和动物细胞都可用已有糖呼吸，昼夜都可能',
        en: 'Plant and animal cells can respire using existing sugar by day and night',
      },
      {
        zh: '没有氧就不存在任何供ATP的路线',
        en: 'Without oxygen, no ATP-supplying route exists',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞呼吸',
          en: 'cellular respiration',
        },
        meaning: {
          zh: '细胞通过反应转移有机物中的能量，不等于肺通气。',
          en: 'Cellular reactions transferring energy from organic compounds, not lung ventilation.',
        },
      },
      {
        word: {
          zh: '有氧',
          en: 'aerobic',
        },
        meaning: {
          zh: '本课需要氧来支持完整的有氧呼吸路线。',
          en: 'Requiring oxygen for the complete aerobic route represented here.',
        },
      },
      {
        word: {
          zh: '细胞质',
          en: 'cytoplasm',
        },
        meaning: {
          zh: '糖分解开始的一些步骤发生的区域。',
          en: 'The region where initial sugar-breakdown steps occur.',
        },
      },
      {
        word: {
          zh: '线粒体',
          en: 'mitochondrion',
        },
        meaning: {
          zh: '真核细胞有氧呼吸许多步骤发生的细胞器。',
          en: 'An organelle hosting many aerobic-respiration steps in eukaryotic cells.',
        },
      },
      {
        word: {
          zh: 'ATP',
          en: 'ATP',
        },
        meaning: {
          zh: '其反应可与细胞工作耦联，需要不断再生成。',
          en: 'Its reactions can couple to cellular work and it needs continual regeneration.',
        },
      },
    ],
    mission: {
      zh: '比较夜晚有氧的叶肉和根：谁可光合作用，谁可呼吸？写已有糖与适宜条件的假设，再解释肺只是氧路线的一部分。',
      en: 'Compare mesophyll and root at night with oxygen: which can photosynthesise or respire? State sugar/condition assumptions and explain lungs as one part of oxygen delivery.',
    },
    questions: [
      {
        id: 'L035-q1',
        skill: 'concept',
        prompt: {
          zh: '夜晚有氧且有可用糖，哪类代表细胞可有氧呼吸？',
          en: 'At night with oxygen and usable sugar, which profiles can respire aerobically?',
        },
        options: [
          {
            zh: '只有肌肉细胞',
            en: 'Only muscle',
          },
          {
            zh: '只有有叶绿体的细胞',
            en: 'Only cells with chloroplasts',
          },
          {
            zh: '叶肉、根和肌肉都可以',
            en: 'Mesophyll, root and muscle',
          },
        ],
        correct: 2,
        feedback: {
          zh: '呼吸不是动物专属，也不要求光或叶绿体。植物细胞也需要ATP支持活动。',
          en: 'Respiration is not animal-only and does not require light or chloroplasts. Plant cells also need ATP-supported activity.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L035-q2',
        skill: 'concept',
        prompt: {
          zh: '糖的碳在完整有氧呼吸后，可出现在什么物质中？',
          en: 'Where can glucose carbon appear after complete aerobic respiration?',
        },
        options: [
          {
            zh: 'CO₂',
            en: 'CO₂',
          },
          {
            zh: '变成光线里的碳',
            en: 'Carbon in light',
          },
          {
            zh: '凭空消失',
            en: 'Nowhere; it vanishes',
          },
        ],
        correct: 0,
        feedback: {
          zh: '碳原子进入CO₂等产物，化学组合改变。能量转移不表示碳消失。',
          en: 'Carbon appears in CO₂ and other products through changed chemical arrangement; energy transfer does not erase carbon.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L035-q3',
        skill: 'reasoning',
        prompt: {
          zh: '选“夜晚缺氧”，模型有氧路线关闭。可以断言所有细胞立刻没ATP吗？',
          en: 'Selecting night without oxygen disables the aerobic route. Does every cell instantly have no ATP?',
        },
        options: [
          {
            zh: '能，任何途径都必须有氧',
            en: 'Yes; every route needs oxygen',
          },
          {
            zh: '不能，储备和其他途径因细胞而异，本模型不计算',
            en: 'No; reserves and other pathways vary and are not calculated',
          },
          {
            zh: '能，夜晚本身破坏ATP',
            en: 'Yes; night destroys ATP',
          },
        ],
        correct: 1,
        feedback: {
          zh: '本课只展示有氧路线。某些细胞可经糖酵解/发酵相关途径少量供ATP；现实能力与持续时间不能由这个开关判断。',
          en: 'Only the aerobic route is depicted. Some cells can supply ATP through glycolysis/fermentation-related pathways; this switch does not predict real capacity or duration.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L035-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'cellular respiration与breathing的关系是什么？',
          en: 'How do cellular respiration and breathing relate?',
        },
        options: [
          {
            zh: '完全相同，都只发生在肺',
            en: 'Identical and only in lungs',
          },
          {
            zh: '互不相关，肺不运氧',
            en: 'Unrelated; lungs do not supply oxygen',
          },
          {
            zh: '不同过程；通气和运输可给细胞呼吸提供氧',
            en: 'Distinct processes; ventilation and transport can supply oxygen for cellular respiration',
          },
        ],
        correct: 2,
        feedback: {
          zh: '通气让空气进入/离开肺，气体交换与循环连接细胞；细胞呼吸是细胞内反应。',
          en: 'Ventilation moves air into and out of lungs; gas exchange and circulation connect to cells, where cellular respiration occurs.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · Energy in living systems',
      url: 'https://openstax.org/books/biology-2e/pages/7-1-energy-in-living-systems',
    },
  },
  {
    id: 'L036',
    title: {
      zh: '食物链中的能量',
      en: 'Energy through food chains',
    },
    minutes: 20,
    icon: '⇢',
    summary: {
      zh: '没有传给下一层的能量，全都消失了吗？',
      en: 'Does all energy not transferred to the next level disappear?',
    },
    hook: {
      zh: '后院叶片被毛虫吃，毛虫又可能被鸟吃。追踪能量到活动、热和枯落物，再换成碳路线，看看为什么分解者也不能把热变回阳光。',
      en: 'A garden caterpillar eats leaves and may be eaten by a bird. Trace energy through activity, heat and detritus, then switch to carbon to compare cycling with flow.',
    },
    objectives: [
      {
        zh: '区分传给下一层、进入枯落物与散为热的能量。',
        en: 'Separate energy transferred onward, entering detritus and dissipating as heat.',
      },
      {
        zh: '比较假设比例并区分碳循环与能量流。',
        en: 'Compare assumed transfer fractions and distinguish carbon cycling from energy flow.',
      },
    ],
    prediction: [
      {
        zh: '每层一定传递10%，其他能量凭空消失',
        en: 'Exactly 10% always transfers; all the rest disappears',
      },
      {
        zh: '比例会不同，剩余能量有不同去向；碳与能量路线不同',
        en: 'Fractions vary and remaining energy has different fates; carbon and energy routes differ',
      },
      {
        zh: '分解者把热变回阳光',
        en: 'Decomposers turn heat back into sunlight',
      },
    ],
    terms: [
      {
        word: {
          zh: '营养级',
          en: 'trophic level',
        },
        meaning: {
          zh: '在取食能量路线中的位置，如生产者、植食者与捕食者。',
          en: 'A position along feeding-energy routes, such as producer, herbivore and predator.',
        },
      },
      {
        word: {
          zh: '能量转移',
          en: 'energy transfer',
        },
        meaning: {
          zh: '能量从一种形式或位置转到另一处，不是凭空创造。',
          en: 'Movement of energy between forms or locations, not creation from nothing.',
        },
      },
      {
        word: {
          zh: '枯落物',
          en: 'detritus',
        },
        meaning: {
          zh: '死亡有机物与废物，可包含分解者能利用的化学能。',
          en: 'Dead organic matter and waste containing chemical energy available to decomposers.',
        },
      },
      {
        word: {
          zh: '分解者',
          en: 'decomposer',
        },
        meaning: {
          zh: '分解有机物的生物，也有呼吸与散热。',
          en: 'An organism breaking down organic matter, with its own respiration and heat release.',
        },
      },
      {
        word: {
          zh: '碳循环',
          en: 'carbon cycle',
        },
        meaning: {
          zh: '碳在空气与有机物等库之间变化，可被再次利用。',
          en: 'Carbon moving among atmospheric and organic pools, potentially reused.',
        },
      },
    ],
    mission: {
      zh: '画阳光→叶片有机物→毛虫→鸟的能量路线，补热与枯落物支路；另画碳回CO₂。标假设比例，不把模型数当实测。',
      en: 'Sketch sunlight → leaf organic matter → caterpillar → bird, adding heat and detritus branches. Separately show carbon returning to CO₂. Label assumed fractions, not measurements.',
    },
    questions: [
      {
        id: 'L036-q1',
        skill: 'concept',
        prompt: {
          zh: '示例植物能量1000E，传给毛虫100E，枯落物200E。其余700E的模型去向？',
          en: 'Plants start with 1000E; 100E transfers to caterpillars and 200E enters detritus. Where is the remaining 700E assigned?',
        },
        options: [
          {
            zh: '凭空消失',
            en: 'It disappears',
          },
          {
            zh: '呼吸/活动后散为热',
            en: 'Heat after respiration/work',
          },
          {
            zh: '又变成原来的阳光',
            en: 'It becomes the original sunlight',
          },
        ],
        correct: 1,
        feedback: {
          zh: '100+200+700=1000。这是假设闭合账本，剩余不是全部传给鸟，也不是能量消失。',
          en: '100+200+700=1000 in a fictional closed account. The remainder neither all reaches birds nor vanishes.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L036-q2',
        skill: 'concept',
        prompt: {
          zh: '枯落物支路为什么重要？',
          en: 'Why does the detritus branch matter?',
        },
        options: [
          {
            zh: '有机物还有化学能，分解者可利用并最终散热',
            en: 'Organic matter retains chemical energy usable by decomposers, eventually dissipating as heat',
          },
          {
            zh: '枯落物没有任何物质',
            en: 'Detritus contains no matter',
          },
          {
            zh: '分解者不需要能量',
            en: 'Decomposers need no energy',
          },
        ],
        correct: 0,
        feedback: {
          zh: '未传给下一取食层的部分能量还在有机物中。分解者也呼吸；不能把所有余量都叫热。',
          en: 'Some energy not transferred to the next feeding level remains in organic matter. Decomposers respire too; not all remaining energy is already heat.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L036-q3',
        skill: 'reasoning',
        prompt: {
          zh: '把示例比例10%改成20%，鸟层收到的数变了。能由此证明真实后院总是20%吗？',
          en: 'Changing 10% to 20% changes the bird-level value. Does this establish 20% for real gardens?',
        },
        options: [
          {
            zh: '能，模型就是实测',
            en: 'Yes; a model is a measurement',
          },
          {
            zh: '能，所有物种与环境都一样',
            en: 'Yes; species and environments are identical',
          },
          {
            zh: '不能，这是假设情境；现实需观测且不同环节可不同',
            en: 'No; this is an assumed scenario; real links require evidence and can differ',
          },
        ],
        correct: 2,
        feedback: {
          zh: '固定比例是为比较而设，10%不是普遍精确常数。本模型不测量真实效率、数量或种群变化。',
          en: 'Fractions are comparison assumptions, not universal exact constants. The model measures neither real efficiency nor population change.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
      {
        id: 'L036-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '哪项最接近energy flow与carbon cycle的区别？',
          en: 'Which distinguishes energy flow from carbon cycle?',
        },
        options: [
          {
            zh: '能量和碳都无限按同一圈回到阳光',
            en: 'Both loop back to sunlight forever',
          },
          {
            zh: '能量转移并散热，碳可回到CO₂再利用',
            en: 'Energy transfers and dissipates as heat; carbon can return to CO₂ and be reused',
          },
          {
            zh: '碳没有原子，只有颜色',
            en: 'Carbon has no atoms, only colour',
          },
        ],
        correct: 1,
        feedback: {
          zh: '碳是物质，可在不同库之间循环；分散的热不是植物再次制造糖所用的光。',
          en: 'Carbon is matter that can cycle among pools. Dispersed heat is not the light used again to make plant sugars.',
        },
        revisit: {
          zh: '回看物质/能量路线与模型条件。',
          en: 'Revisit matter/energy routes and model conditions.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · Ecosystem energy flow',
      url: 'https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems',
    },
  },
];
