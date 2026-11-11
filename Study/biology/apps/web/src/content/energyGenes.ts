import type { Lesson } from '../schema';

export const energyGeneLessons: Lesson[] = [
  {
    id: 'L081',
    title: {
      zh: '光合作用的总体反应',
      en: 'The Photosynthesis Equation',
    },
    hook: {
      zh: '一棵树增加了许多干物质。糖中的碳来自土壤还是空气？叶片放出的氧，能从净反应式直接看出来自哪种物质吗？',
      en: 'A tree gains dry matter. Does sugar carbon come from soil or air? Can the net equation alone tell you where released oxygen comes from?',
    },
    minutes: 30,
    icon: '☀',
    objectives: [
      {
        zh: '配平净反应并核对C、H、O三种原子总数。',
        en: 'Balance the net equation and check C, H and O totals.',
      },
      {
        zh: '分别追踪糖中碳与释放氧气的来源。',
        en: 'Trace sugar carbon and released oxygen to their different sources.',
      },
      {
        zh: '用一句话区分净反应、反应机制与能量转移。',
        en: 'Distinguish a net reaction, its mechanism and energy transfer.',
      },
    ],
    prediction: [
      {
        zh: '糖中的碳主要来自CO₂；释放的O₂来自水。',
        en: 'Sugar carbon comes from CO₂; released O₂ comes from water.',
      },
      {
        zh: '糖中的碳主要来自根吸收的矿物盐。',
        en: 'Sugar carbon comes mainly from mineral salts absorbed by roots.',
      },
      {
        zh: '净反应式已经逐步展示O₂如何形成。',
        en: 'The net equation already shows each step forming O₂.',
      },
    ],
    terms: [
      {
        word: {
          zh: '光合作用',
          en: 'photosynthesis',
        },
        meaning: {
          zh: '利用光能把无机碳转化为有机物的过程。',
          en: 'Processes using light energy to incorporate inorganic carbon into organic molecules.',
        },
      },
      {
        word: {
          zh: '净反应',
          en: 'net reaction',
        },
        meaning: {
          zh: '抵消两侧相同物质后得到的总体收支。',
          en: 'Overall accounting after cancelling substances appearing on both sides.',
        },
      },
      {
        word: {
          zh: '反应物',
          en: 'reactant',
        },
        meaning: {
          zh: '在所写反应中被消耗的物质。',
          en: 'A substance consumed in the reaction as written.',
        },
      },
      {
        word: {
          zh: '产物',
          en: 'product',
        },
        meaning: {
          zh: '在所写反应中形成的物质。',
          en: 'A substance formed in the reaction as written.',
        },
      },
      {
        word: {
          zh: '碳固定',
          en: 'carbon fixation',
        },
        meaning: {
          zh: '把无机碳并入有机分子的过程。',
          en: 'Incorporation of inorganic carbon into organic molecules.',
        },
      },
      {
        word: {
          zh: '同位素示踪',
          en: 'isotope tracing',
        },
        meaning: {
          zh: '利用可识别的同元素原子追踪物质来源。',
          en: 'Following identifiable atoms of an element to investigate material origins.',
        },
      },
    ],
    summary: {
      zh: '净反应核对原子总数；另一幅来源追踪展示糖碳来自CO₂、放出的氧来自水。来源图不等于全部反应步骤。',
      en: 'The net equation checks atom totals; a separate provenance trace shows sugar carbon from CO₂ and released oxygen from water. Provenance is not the complete reaction mechanism.',
    },
    mission: {
      zh: '画一张双账本：净式逐元素计数，来源图分别标CO₂→糖碳、水→O₂。写一句英文说明光是能量输入。',
      en: 'Make two accounts: count elements in the net equation, then label CO₂ → sugar carbon and water → O₂ in a source diagram. Add one English sentence identifying light as energy input.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis',
    },
    questions: [
      {
        id: 'L081-Q1',
        skill: 'concept',
        prompt: {
          zh: '糖的碳骨架主要来自哪里？',
          en: 'What mainly supplies the carbon skeleton of sugar?',
        },
        options: [
          {
            zh: '土壤中的矿物盐',
            en: 'Mineral salts in soil',
          },
          {
            zh: '二氧化碳',
            en: 'Carbon dioxide',
          },
          {
            zh: '根吸收的水',
            en: 'Water absorbed by roots',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'CO₂的碳被固定进有机物；水和矿物质也必要，但光子不提供碳原子。',
          en: 'Carbon from CO₂ is fixed into organic matter; water and minerals also matter, but photons supply no carbon atoms.',
        },
        revisit: {
          zh: '回看来源追踪：碳模式第3步。',
          en: 'Revisit the carbon-source trace, step 3.',
        },
      },
      {
        id: 'L081-Q2',
        skill: 'concept',
        prompt: {
          zh: '哪句话准确比较光合作用与呼吸？',
          en: 'Which comparison of photosynthesis and respiration is accurate?',
        },
        options: [
          {
            zh: '同一组酶反应完全倒放',
            en: 'Exactly the same enzyme reactions reversed',
          },
          {
            zh: '植物只做光合作用',
            en: 'Plants only photosynthesize',
          },
          {
            zh: '总体式相关，但机制和能量转移方向不同',
            en: 'Related overall equations, different mechanisms and energy transfers',
          },
        ],
        correct: 2,
        feedback: {
          zh: '光合作用需光能输入；植物也呼吸。总体收支不能替代中间机制。',
          en: 'Photosynthesis needs light-energy input; plants also respire. Overall accounting does not specify intermediate mechanisms.',
        },
        revisit: {
          zh: '回看Explain第三段与图第4步。',
          en: 'Revisit Explain paragraph 3 and figure step 4.',
        },
      },
      {
        id: 'L081-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '净式6CO₂＋6H₂O中共有多少氧原子？',
          en: 'How many oxygen atoms occur in 6CO₂ + 6H₂O?',
        },
        options: [
          {
            zh: '18',
            en: '18',
          },
          {
            zh: '12',
            en: '12',
          },
          {
            zh: '6',
            en: '6',
          },
        ],
        correct: 0,
        feedback: {
          zh: '6×2＋6×1＝18；右侧糖含6个，6O₂含12个。这个计数不证明氧气的来源。',
          en: '6×2 + 6×1 = 18; sugar contains six and 6O₂ contains twelve. This count does not establish oxygen provenance.',
        },
        revisit: {
          zh: '回看净方程第1步，逐项计数。',
          en: 'Revisit net-equation step 1 and count each term.',
        },
      },
      {
        id: 'L081-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'net reaction最准确的意思是什么？',
          en: 'What does net reaction mean?',
        },
        options: [
          {
            zh: '每一步分子运动的录像',
            en: 'A recording of every molecular movement',
          },
          {
            zh: '约去重复物质后的总体物质收支',
            en: 'Overall matter balance after cancellation',
          },
          {
            zh: '一定没有水作为产物的反应',
            en: 'A reaction that cannot produce water',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Net表示总体账目，不保证展示中间产物、水的完整参与或原子来源。',
          en: 'Net means overall accounting; it does not guarantee intermediate products, complete water participation or atom provenance.',
        },
        revisit: {
          zh: '回看Vocabulary的net reaction及Explain第二段。',
          en: 'Revisit net reaction in Vocabulary and Explain paragraph 2.',
        },
      },
    ],
  },
  {
    id: 'L082',
    title: {
      zh: '影响光合作用的因素',
      en: 'Limiting Factors',
    },
    hook: {
      zh: '虚拟叶片在光照指数50时速率40；把光加到100，速率仍40。灯坏了吗，还是另一条件卡住了过程？',
      en: 'A virtual leaf has rate 40 at light index 50. Raising light to 100 leaves rate at 40. Has the lamp failed, or is another condition limiting?',
    },
    minutes: 30,
    icon: '☀',
    objectives: [
      {
        zh: '控制两个条件，画出第三个因素的虚构速率曲线。',
        en: 'Hold two conditions fixed and plot a fictional response to the third.',
      },
      {
        zh: '用一组配对数据识别限制因素及共同限制。',
        en: 'Use paired data to identify limiting or jointly limiting factors.',
      },
      {
        zh: '区分相对光合速率、真实测量与生长预测。',
        en: 'Distinguish relative photosynthesis rate, measurements and growth predictions.',
      },
    ],
    prediction: [
      {
        zh: '光照50→100无效时，提高CO₂可能有效。',
        en: 'If light 50→100 has no effect, raising CO₂ may help.',
      },
      {
        zh: '加光总能把速率翻倍。',
        en: 'More light must always double the rate.',
      },
      {
        zh: '曲线平台证明该叶片不再需要光。',
        en: 'A plateau proves that the leaf no longer needs light.',
      },
    ],
    terms: [
      {
        word: {
          zh: '限制因素',
          en: 'limiting factor',
        },
        meaning: {
          zh: '在给定条件下约束速率的因素。',
          en: 'A factor constraining rate under specified conditions.',
        },
      },
      {
        word: {
          zh: '饱和',
          en: 'saturation',
        },
        meaning: {
          zh: '继续增加某因素不再显著提高速率。',
          en: 'Further increase in a factor no longer substantially raises rate.',
        },
      },
      {
        word: {
          zh: '控制变量',
          en: 'controlled variable',
        },
        meaning: {
          zh: '比较中保持不变的条件。',
          en: 'A condition held constant in a comparison.',
        },
      },
      {
        word: {
          zh: '相对速率',
          en: 'relative rate',
        },
        meaning: {
          zh: '用约定刻度表达的快慢，不一定有实际单位。',
          en: 'Rate expressed on a defined scale, not necessarily with physical units.',
        },
      },
      {
        word: {
          zh: '最适温度',
          en: 'optimum temperature',
        },
        meaning: {
          zh: '特定条件下速率最高的温度，不是所有物种的常数。',
          en: 'Temperature giving highest rate under specified conditions, not a universal constant.',
        },
      },
      {
        word: {
          zh: '共同限制',
          en: 'co-limitation',
        },
        meaning: {
          zh: '多个因素同时约束当前过程的情况。',
          en: 'A situation in which several factors constrain the current process.',
        },
      },
    ],
    summary: {
      zh: '曲线横轴可选光照、CO₂或温度；纵轴为虚构的0–100相对光合速率。红点表示当前设置，平台与下降均有条件。',
      en: 'Choose light, CO₂ or temperature on the x-axis. The y-axis is fictional relative photosynthesis rate from 0–100. The red point shows current settings; plateaus and declines depend on conditions.',
    },
    mission: {
      zh: '保留至少4组带设置的记录；用主张—数据—机制写出限制因素的改变，再注明虚构速率不能预测实际植物生长。',
      en: 'Keep at least four records with settings. Use claim–data–mechanism to explain a changing limiting factor, then state why fictional rate cannot predict actual plant growth.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules',
    },
    questions: [
      {
        id: 'L082-Q1',
        skill: 'concept',
        prompt: {
          zh: '光50、CO₂20、25°C时，把光提高到100为何仍为40？',
          en: 'Why does light 50→100 leave rate at 40 when CO₂=20 and temperature=25°C?',
        },
        options: [
          {
            zh: '光不再是植物的需要',
            en: 'Light is no longer required',
          },
          {
            zh: 'CO₂能力仍为40',
            en: 'CO₂ capacity remains 40',
          },
          {
            zh: '温度能力自动降为40',
            en: 'Temperature capacity automatically falls to 40',
          },
        ],
        correct: 1,
        feedback: {
          zh: '光能力已达100，CO₂能力只有40；只加光不能改变最小值。',
          en: 'Light capacity is already 100 while CO₂ capacity is 40; extra light cannot change the minimum.',
        },
        revisit: {
          zh: '回看Explore的40、40、100配对记录。',
          en: 'Revisit the 40, 40, 100 paired records in Explore.',
        },
      },
      {
        id: 'L082-Q2',
        skill: 'concept',
        prompt: {
          zh: '怎样解释模型在50°C为零？',
          en: 'How should the zero modeled rate at 50°C be interpreted?',
        },
        options: [
          {
            zh: '所有植物都在50°C精确停止',
            en: 'All plants stop at exactly 50°C',
          },
          {
            zh: '证明CO₂已经用完',
            en: 'It proves CO₂ has been exhausted',
          },
          {
            zh: '教学曲线选定的边界，不能普遍外推',
            en: 'A chosen teaching-curve boundary, not a universal threshold',
          },
        ],
        correct: 2,
        feedback: {
          zh: '最适25°C及两端零值均是虚构设定；真实反应受物种、时间和其他条件影响。',
          en: 'The 25°C optimum and zero endpoints are invented assumptions; real responses depend on species, duration and other conditions.',
        },
        revisit: {
          zh: '回看Explain第三段的温度边界。',
          en: 'Revisit the temperature boundary in Explain paragraph 3.',
        },
      },
      {
        id: 'L082-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '光20、CO₂20、25°C时，分别只把光或CO₂增至50仍为40，怎样达到100？',
          en: 'At light20, CO₂20 and25°C, increasing either index alone to50 leaves40. How can the model reach100?',
        },
        options: [
          {
            zh: '两指数都改为50，温度固定25°C',
            en: 'Set both indices to50, keeping25°C',
          },
          {
            zh: '只把光改为100',
            en: 'Set only light to100',
          },
          {
            zh: '只把温度提高到50°C',
            en: 'Raise only temperature to50°C',
          },
        ],
        correct: 0,
        feedback: {
          zh: '两个能力起初同为40；两者均提高到100才解除共同限制，温度能力也须保持100。',
          en: 'Both capacities start at40; both must reach100 to remove the joint bottleneck, with temperature capacity also100.',
        },
        revisit: {
          zh: '回看Apply的四组共同限制记录。',
          en: 'Revisit the four co-limitation records in Apply.',
        },
      },
      {
        id: 'L082-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'limiting factor指什么？',
          en: 'What is a limiting factor?',
        },
        options: [
          {
            zh: '永远最稀少的物质，不看条件',
            en: 'The permanently rarest substance regardless of conditions',
          },
          {
            zh: '给定条件下约束速率的因素',
            en: 'A factor constraining rate under specified conditions',
          },
          {
            zh: '实验者任意改变的全部变量',
            en: 'Every variable the experimenter changes',
          },
        ],
        correct: 1,
        feedback: {
          zh: '限制因素随条件而变；须比较能力和响应，不能只找名称或绝对数量最小者。',
          en: 'The limiting factor can change with conditions; compare capacities and responses rather than names or unrelated absolute amounts.',
        },
        revisit: {
          zh: '回看Vocabulary与当前三个能力值。',
          en: 'Revisit Vocabulary and the three current capacities.',
        },
      },
    ],
  },
  {
    id: 'L083',
    title: {
      zh: '有氧与无氧呼吸',
      en: 'Aerobic and Anaerobic Respiration',
    },
    hook: {
      zh: '酵母让面团出现气泡，人的肌肉却不会因为缺氧而制造酒精。相同的糖，为什么能走不同路线？',
      en: 'Yeast makes bubbles in dough, but human muscle does not make ethanol when oxygen is limited. How can the same sugar follow different routes?',
    },
    minutes: 30,
    icon: '☀',
    objectives: [
      {
        zh: '比较有氧分解、人细胞乳酸发酵和酵母酒精发酵的产物。',
        en: 'Compare products of aerobic breakdown, human lactate fermentation and yeast ethanol fermentation.',
      },
      {
        zh: '解释缺氧时糖酵解仍能提供少量ATP的条件。',
        en: 'Explain how glycolysis can continue providing some ATP under oxygen limitation.',
      },
      {
        zh: '区分发酵与严格意义的微生物无氧呼吸。',
        en: 'Distinguish fermentation from microbial anaerobic respiration in its stricter sense.',
      },
    ],
    prediction: [
      {
        zh: '人乳酸路线与酵母酒精路线的产物不同。',
        en: 'Human lactate and yeast ethanol routes have different products.',
      },
      {
        zh: '所有细胞缺氧都会产生酒精和CO₂。',
        en: 'Every oxygen-limited cell produces ethanol and CO₂.',
      },
      {
        zh: '没有氧就绝不可能形成ATP。',
        en: 'Without oxygen, ATP production is impossible.',
      },
    ],
    terms: [
      {
        word: {
          zh: '糖酵解',
          en: 'glycolysis',
        },
        meaning: {
          zh: '把葡萄糖转为丙酮酸并净获得少量ATP的途径。',
          en: 'A pathway converting glucose to pyruvate with a small net ATP yield.',
        },
      },
      {
        word: {
          zh: '有氧呼吸',
          en: 'aerobic respiration',
        },
        meaning: {
          zh: '以氧为末端电子受体的细胞呼吸。',
          en: 'Cellular respiration with oxygen as the final electron acceptor.',
        },
      },
      {
        word: {
          zh: '发酵',
          en: 'fermentation',
        },
        meaning: {
          zh: '再生NAD⁺以支持糖酵解的途径，不使用呼吸电子传递链。',
          en: 'Routes regenerating NAD⁺ to sustain glycolysis without a respiratory electron-transport chain.',
        },
      },
      {
        word: {
          zh: '乳酸',
          en: 'lactate',
        },
        meaning: {
          zh: '人细胞乳酸发酵途径的主要有机产物。',
          en: 'The major organic product of the human lactate fermentation route.',
        },
      },
      {
        word: {
          zh: '乙醇',
          en: 'ethanol',
        },
        meaning: {
          zh: '酵母酒精发酵的一种有机产物。',
          en: 'An organic product of yeast alcoholic fermentation.',
        },
      },
      {
        word: {
          zh: '电子受体',
          en: 'electron acceptor',
        },
        meaning: {
          zh: '在电子转移过程中接收电子的物质。',
          en: 'A substance receiving electrons during electron transfer.',
        },
      },
    ],
    summary: {
      zh: '图中三条路线共用糖酵解，随后产物和电子处理方式分开。动画比较典型路线，不声称细胞只会运行一种途径。',
      en: 'The three routes share glycolysis, then differ in products and electron handling. The animation compares representative routes; it does not claim a cell operates only one pathway.',
    },
    mission: {
      zh: '用三条箭头解释面团、典型缺氧人细胞、有氧细胞各自的能量路线；为“无氧呼吸”写一条术语范围说明。',
      en: 'Use three arrows to explain energy routes in dough, a representative oxygen-limited human cell and an aerobic cell. Add a note defining the scope of anaerobic respiration.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/7-5-metabolism-without-oxygen',
    },
    questions: [
      {
        id: 'L083-Q1',
        skill: 'concept',
        prompt: {
          zh: '典型酵母酒精发酵的产物是什么？',
          en: 'What are products of typical yeast alcoholic fermentation?',
        },
        options: [
          {
            zh: '只有乳酸',
            en: 'Lactate only',
          },
          {
            zh: '乙醇和CO₂',
            en: 'Ethanol and CO₂',
          },
          {
            zh: '氧气和葡萄糖',
            en: 'Oxygen and glucose',
          },
        ],
        correct: 1,
        feedback: {
          zh: '酒精发酵与乳酸发酵产物不同，不能把一条路线推广到所有细胞。',
          en: 'Alcoholic and lactate fermentation have different products; one route cannot be generalized to all cells.',
        },
        revisit: {
          zh: '回看酵母模式第3步。',
          en: 'Revisit yeast mode, step 3.',
        },
      },
      {
        id: 'L083-Q2',
        skill: 'concept',
        prompt: {
          zh: '严格意义上，发酵与微生物无氧呼吸的区别是什么？',
          en: 'What distinguishes fermentation from microbial anaerobic respiration in stricter usage?',
        },
        options: [
          {
            zh: '发酵必需氧',
            en: 'Fermentation requires oxygen',
          },
          {
            zh: '两者都不能获得ATP',
            en: 'Neither can support ATP production',
          },
          {
            zh: '后者使用呼吸电子传递链及非氧末端受体',
            en: 'The latter uses a respiratory electron chain and a non-oxygen terminal acceptor',
          },
        ],
        correct: 2,
        feedback: {
          zh: '发酵通过再生NAD⁺支持糖酵解；微生物无氧呼吸则可用电子传递链和其他受体。',
          en: 'Fermentation regenerates NAD⁺ to sustain glycolysis; microbial anaerobic respiration can use an electron chain and alternative acceptors.',
        },
        revisit: {
          zh: '回看Explain术语范围段。',
          en: 'Revisit the terminology paragraph in Explain.',
        },
      },
      {
        id: 'L083-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '在糖酵解可持续、底物足够的简化条件下，3个葡萄糖通过糖酵解净得多少ATP？',
          en: 'With sustained glycolysis and adequate substrate, how many net ATP arise through glycolysis from3 glucose?',
        },
        options: [
          {
            zh: '6',
            en: '6',
          },
          {
            zh: '0，因为无氧',
            en: '0 because oxygen is absent',
          },
          {
            zh: '114，所有细胞都一样',
            en: '114 in every cell',
          },
        ],
        correct: 0,
        feedback: {
          zh: '每葡萄糖糖酵解净2，故3×2＝6；这是该途径的净收支，不能当成所有呼吸的固定总产量。',
          en: 'Glycolysis nets2 per glucose, so3×2=6; this is pathway accounting, not a fixed total for all respiration.',
        },
        revisit: {
          zh: '回看Explain第一段的净收益。',
          en: 'Revisit net yield in Explain paragraph1.',
        },
      },
      {
        id: 'L083-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'electron acceptor是什么意思？',
          en: 'What does electron acceptor mean?',
        },
        options: [
          {
            zh: '制造电子的能量来源',
            en: 'An energy source that creates electrons',
          },
          {
            zh: '电子转移中接收电子的物质',
            en: 'A substance receiving electrons in a transfer',
          },
          {
            zh: '只出现在肺里的氧气',
            en: 'Oxygen found only in lungs',
          },
        ],
        correct: 1,
        feedback: {
          zh: '受体接收电子；有氧呼吸用氧，但并非所有电子受体都是氧。',
          en: 'An acceptor receives electrons; aerobic respiration uses oxygen, but electron acceptors are not all oxygen.',
        },
        revisit: {
          zh: '回看Vocabulary的electron acceptor。',
          en: 'Revisit electron acceptor in Vocabulary.',
        },
      },
    ],
  },
  {
    id: 'L084',
    title: {
      zh: '能量、ATP与细胞活动',
      en: 'ATP and Cellular Work',
    },
    hook: {
      zh: '一台泵需要5次ATP耦联活动，细胞眼下只有3个ATP模型代币。多说一句“释放能量”，能自动补足缺口吗？',
      en: 'A pump needs5 ATP-coupled actions, but the cell currently has3 model ATP tokens. Can saying “release energy” make up the shortage?',
    },
    minutes: 30,
    icon: '☀',
    objectives: [
      {
        zh: '用ATP＋水→ADP＋Pi解释能量耦联。',
        en: 'Explain energy coupling using ATP + water → ADP + Pi.',
      },
      {
        zh: '核对初始、再生、消耗和剩余的ATP代币账目。',
        en: 'Balance starting, regenerated, used and remaining ATP tokens.',
      },
      {
        zh: '说明再生ATP需要能量输入，并纠正断键释放能量的误解。',
        en: 'Explain energy input for ATP regeneration and correct the bond-breaking misconception.',
      },
    ],
    prediction: [
      {
        zh: '没有再生时只能完成3次；输入能量再生ATP可支持更多次。',
        en: 'Without regeneration only3 actions finish; energy-driven ATP regeneration can support more.',
      },
      {
        zh: 'ATP用过后永远不能再生。',
        en: 'ATP cannot be regenerated once used.',
      },
      {
        zh: '只需断开一个键，就能凭空增加全部所需能量。',
        en: 'Breaking one bond alone creates all required energy.',
      },
    ],
    terms: [
      {
        word: {
          zh: 'ATP',
          en: 'ATP',
        },
        meaning: {
          zh: '腺苷三磷酸，常见的细胞短期能量转移载体。',
          en: 'Adenosine triphosphate, a common short-term cellular energy-transfer carrier.',
        },
      },
      {
        word: {
          zh: 'ADP',
          en: 'ADP',
        },
        meaning: {
          zh: '腺苷二磷酸，可在输入能量后与Pi形成ATP。',
          en: 'Adenosine diphosphate, which can form ATP with Pi when energy is supplied.',
        },
      },
      {
        word: {
          zh: '无机磷酸',
          en: 'inorganic phosphate (Pi)',
        },
        meaning: {
          zh: 'ATP水解产生并可在再生时利用的磷酸组分。',
          en: 'Phosphate released in ATP hydrolysis and used in ATP regeneration.',
        },
      },
      {
        word: {
          zh: '水解',
          en: 'hydrolysis',
        },
        meaning: {
          zh: '水参与使化学键断裂的反应。',
          en: 'A reaction involving water in the cleavage of a chemical bond.',
        },
      },
      {
        word: {
          zh: '能量耦联',
          en: 'energy coupling',
        },
        meaning: {
          zh: '把净有利过程与需要能量的过程联系起来。',
          en: 'Linking a net favorable process with one requiring energy.',
        },
      },
      {
        word: {
          zh: '磷酸化',
          en: 'phosphorylation',
        },
        meaning: {
          zh: '把磷酸基团加入分子的过程。',
          en: 'Addition of a phosphate group to a molecule.',
        },
      },
    ],
    summary: {
      zh: 'ATP到ADP＋Pi的箭头连接做功；回程箭头需输入能量。模型代币只统计可支持的活动数，不代表实际细胞的分子数量。',
      en: 'ATP → ADP + Pi is linked to work; the return arrow requires energy input. Tokens count supported model actions, not actual molecular quantities in a cell.',
    },
    mission: {
      zh: '画ATP/ADP循环，分别标做功、能量输入与散失；写出模型3＋4＝5＋2，并说明代币模型的一项限制。',
      en: 'Draw the ATP/ADP cycle with work, energy input and dissipation. Write the model balance3+4=5+2 and one limitation of token accounting.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/6-4-atp-adenosine-triphosphate',
    },
    questions: [
      {
        id: 'L084-Q1',
        skill: 'concept',
        prompt: {
          zh: 'ATP更适合被描述成什么？',
          en: 'Which description best fits ATP?',
        },
        options: [
          {
            zh: '主要的多年能量仓库',
            en: 'The main energy store for many years',
          },
          {
            zh: '可周转的短期能量转移载体',
            en: 'A cycling short-term energy-transfer carrier',
          },
          {
            zh: '制造新能量的来源',
            en: 'A source creating new energy',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'ATP快速周转并需再生；它帮助转移能量，不创造能量，也不是主要长期仓库。',
          en: 'ATP cycles rapidly and must be regenerated; it transfers energy rather than creating it or serving as the main long-term store.',
        },
        revisit: {
          zh: '回看Explain第三段与循环回程。',
          en: 'Revisit Explain paragraph3 and the return arrow.',
        },
      },
      {
        id: 'L084-Q2',
        skill: 'concept',
        prompt: {
          zh: '关于ATP水解，哪句话准确？',
          en: 'Which statement about ATP hydrolysis is accurate?',
        },
        options: [
          {
            zh: '断键本身总放能',
            en: 'Bond breaking itself always releases energy',
          },
          {
            zh: 'ADP自行免费变ATP',
            en: 'ADP becomes ATP for free',
          },
          {
            zh: '整体反应可净有利，断键本身仍需能量',
            en: 'The overall reaction can be favorable while bond breaking itself costs energy',
          },
        ],
        correct: 2,
        feedback: {
          zh: '必须比较整个反应的反应物与产物；形成新键与其他相互作用也进入能量账目。',
          en: 'Compare reactants and products of the whole reaction; new bonds and other interactions enter the energy balance.',
        },
        revisit: {
          zh: '回看Explain第二段及第2步。',
          en: 'Revisit Explain paragraph2 and step2.',
        },
      },
      {
        id: 'L084-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '初始3、再生4、需求5时，完成与剩余各多少？',
          en: 'With3 starting,4 regenerated and5 requested, how many finish and remain?',
        },
        options: [
          {
            zh: '完成5，余2',
            en: '5 finish,2 remain',
          },
          {
            zh: '完成7，余0',
            en: '7 finish,0 remain',
          },
          {
            zh: '完成5，余4',
            en: '5 finish,4 remain',
          },
        ],
        correct: 0,
        feedback: {
          zh: '可用3＋4＝7；完成需求5后余2，且再生4需要外部过程提供能量。',
          en: 'Available3+4=7; after5 actions2 remain, and regenerating4 requires energy from another process.',
        },
        revisit: {
          zh: '回看Explore第4步的代币账目。',
          en: 'Revisit the token account in Explore step4.',
        },
      },
      {
        id: 'L084-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'energy coupling最准确的意思是什么？',
          en: 'What best defines energy coupling?',
        },
        options: [
          {
            zh: '把所有细胞能量永久储存在ATP中',
            en: 'Storing all cellular energy permanently in ATP',
          },
          {
            zh: '把净有利反应与需能过程联系起来',
            en: 'Linking a favorable reaction to an energy-requiring process',
          },
          {
            zh: '用断键从无中制造能量',
            en: 'Creating energy from nothing by breaking bonds',
          },
        ],
        correct: 1,
        feedback: {
          zh: '耦联需要实际机制联系两个过程，例如磷酸转移，才能支持原本需能的活动。',
          en: 'Coupling physically links processes, for example by phosphate transfer, to support work requiring energy.',
        },
        revisit: {
          zh: '回看Vocabulary的energy coupling。',
          en: 'Revisit energy coupling in Vocabulary.',
        },
      },
    ],
  },
  {
    id: 'L085',
    title: {
      zh: '基因、等位基因与染色体',
      en: 'Genes and Alleles',
    },
    hook: {
      zh: '同一对染色体分别带A和a，复制后画成两个X。现在是四个版本的基因，还是原有版本各复制了一份？',
      en: 'One homologous pair carries A and a. After replication it is drawn as two Xs. Are there four allele versions, or copied instances of the original versions?',
    },
    minutes: 30,
    icon: '🧬',
    objectives: [
      {
        zh: '在同源染色体相同位置标出基因与不同等位基因。',
        en: 'Locate a gene and its alleles at matching positions on homologues.',
      },
      {
        zh: '区分同源染色体与姐妹染色单体的来源。',
        en: 'Distinguish the origins of homologues and sister chromatids.',
      },
      {
        zh: '核对2n=4细胞复制前后的染色体与DNA分子数量。',
        en: 'Count chromosomes and DNA molecules before and after replication in a2n=4 cell.',
      },
    ],
    prediction: [
      {
        zh: '复制后染色体仍4条，DNA分子从4变8。',
        en: 'After replication chromosomes remain4 while DNA molecules change4→8.',
      },
      {
        zh: '复制后变成8条染色体，且倍性翻倍。',
        en: 'Replication produces8 chromosomes and doubles ploidy.',
      },
      {
        zh: 'A和a是同一条DNA上的两条姐妹。',
        en: 'A and a are sister copies of the same DNA molecule.',
      },
    ],
    terms: [
      {
        word: {
          zh: '基因',
          en: 'gene',
        },
        meaning: {
          zh: 'DNA中有功能的区段，可影响RNA或蛋白质等产物。',
          en: 'A functional DNA region contributing to products such as RNA or protein.',
        },
      },
      {
        word: {
          zh: '等位基因',
          en: 'allele',
        },
        meaning: {
          zh: '同一基因在相应位置的不同版本。',
          en: 'An alternative version of a gene at the corresponding locus.',
        },
      },
      {
        word: {
          zh: '基因座',
          en: 'locus',
        },
        meaning: {
          zh: '某基因或标记在染色体上的位置。',
          en: 'The position of a gene or marker on a chromosome.',
        },
      },
      {
        word: {
          zh: '同源染色体',
          en: 'homologous chromosomes',
        },
        meaning: {
          zh: '具有相应基因位置的一对染色体，版本可不同。',
          en: 'A chromosome pair with corresponding gene loci, possibly carrying different alleles.',
        },
      },
      {
        word: {
          zh: '姐妹染色单体',
          en: 'sister chromatids',
        },
        meaning: {
          zh: '同一条染色体复制产生、分离前连接的两份。',
          en: 'The two connected copies produced by replication of one chromosome.',
        },
      },
      {
        word: {
          zh: '着丝粒',
          en: 'centromere',
        },
        meaning: {
          zh: '与染色单体连接及分离相关的染色体区域。',
          en: 'A chromosome region involved in chromatid attachment and segregation.',
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
    ],
    summary: {
      zh: '两种颜色区分同源来源，A/a与B/b标记两处基因座。X是复制后的单条染色体示意；金圈标位置，颜色不是显性强弱。',
      en: 'Two colors distinguish homologous origins; A/a and B/b mark two loci. An X represents one replicated chromosome; gold circles mark loci, and colors do not indicate dominance strength.',
    },
    mission: {
      zh: '画复制前后同源对，用括号分别圈出一对同源与一对姐妹；标基因座和等位基因，不使用真实家庭信息。',
      en: 'Draw a homologous pair before and after S, using separate brackets for homologues and sisters. Label a locus and its alleles without using real family information.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits',
    },
    questions: [
      {
        id: 'L085-Q1',
        skill: 'concept',
        prompt: {
          zh: 'A与a在此模型中是什么关系？',
          en: 'How are A and a related in this model?',
        },
        options: [
          {
            zh: '不同染色体上的任意两个基因',
            en: 'Any two unrelated genes',
          },
          {
            zh: '同一基因的不同版本',
            en: 'Alternative versions of one gene',
          },
          {
            zh: '同一复制染色体的两条姐妹',
            en: 'Two sisters of one replicated chromosome',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'A与a位于同源染色体对应基因座，属于同一基因的等位版本。',
          en: 'A and a occupy corresponding loci on homologues and are alternative versions of one gene.',
        },
        revisit: {
          zh: '回看金色基因座标记第2步。',
          en: 'Revisit the gold locus markers in step2.',
        },
      },
      {
        id: 'L085-Q2',
        skill: 'concept',
        prompt: {
          zh: '一个复制后的X中的两条姐妹来自哪里？',
          en: 'Where do the two sisters in a replicated X come from?',
        },
        options: [
          {
            zh: '分别来自两个亲代',
            en: 'One from each parent',
          },
          {
            zh: '两个不相关基因拼接',
            en: 'Joining two unrelated genes',
          },
          {
            zh: '同一条染色体在S期复制',
            en: 'Replication of one chromosome during S',
          },
        ],
        correct: 2,
        feedback: {
          zh: '姐妹是同一条染色体的复制产物；同源对则包含对应的两条染色体。',
          en: 'Sisters are copies of one chromosome; a homologous pair contains two corresponding chromosomes.',
        },
        revisit: {
          zh: '回看复制开关及Explain第二段。',
          en: 'Revisit the replication toggle and Explain paragraph2.',
        },
      },
      {
        id: 'L085-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '2n=4细胞完成S期、尚未分裂，有多少染色体和DNA分子？',
          en: 'After S but before division, how many chromosomes and DNA molecules are in a2n=4 cell?',
        },
        options: [
          {
            zh: '4条染色体，8个DNA分子',
            en: '4 chromosomes,8 DNA molecules',
          },
          {
            zh: '8条染色体，8个DNA分子',
            en: '8 chromosomes,8 DNA molecules',
          },
          {
            zh: '4条染色体，4个DNA分子',
            en: '4 chromosomes,4 DNA molecules',
          },
        ],
        correct: 0,
        feedback: {
          zh: '每条染色体现在由两条相连姐妹组成，所以染色体仍4，DNA分子8，套数仍2n。',
          en: 'Each chromosome now has two connected sisters, so chromosomes remain4, DNA molecules are8 and ploidy remains2n.',
        },
        revisit: {
          zh: '回看第4步的每细胞计数。',
          en: 'Revisit per-cell counts in step4.',
        },
      },
      {
        id: 'L085-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'locus指什么？',
          en: 'What does locus mean?',
        },
        options: [
          {
            zh: '所有基因的总数量',
            en: 'The total number of all genes',
          },
          {
            zh: '基因或标记在染色体上的位置',
            en: 'A gene or marker position on a chromosome',
          },
          {
            zh: '该基因的一种等位版本',
            en: 'One allele version of the gene',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Locus是位置；allele是该位置相应基因的版本，两词回答不同问题。',
          en: 'Locus means position; allele means a version of the gene there. They answer different questions.',
        },
        revisit: {
          zh: '回看Vocabulary的locus与allele。',
          en: 'Revisit locus and allele in Vocabulary.',
        },
      },
    ],
  },
  {
    id: 'L086',
    title: {
      zh: '减数分裂与配子',
      en: 'Meiosis and Gametes',
    },
    hook: {
      zh: '受精把两份染色体合在一起。若配子从不减少套数，下一代会怎样？为什么需要一次复制后连续分裂两次？',
      en: 'Fertilization joins two chromosome contributions. What if gametes never reduced chromosome-set number? Why does meiosis use one replication followed by two divisions?',
    },
    minutes: 30,
    icon: '🧬',
    objectives: [
      {
        zh: '排列同源配对、同源分离、姐妹分离三个关键过程。',
        en: 'Sequence homologous pairing, homologous separation and sister separation.',
      },
      {
        zh: '逐步核对2n=4模型的染色体、DNA分子和n/C。',
        en: 'Track chromosomes, DNA molecules and n/C in a2n=4 model.',
      },
      {
        zh: '用交叉互换和配对方向解释配子组合的来源。',
        en: 'Explain gamete combinations using crossing over and pair orientation.',
      },
    ],
    prediction: [
      {
        zh: '分裂I先分开同源，分裂II再分开姐妹。',
        en: 'Meiosis I separates homologues; meiosis II separates sisters.',
      },
      {
        zh: '每次分裂前都复制一次DNA。',
        en: 'DNA replicates before each division.',
      },
      {
        zh: '完成分裂I后，姐妹已经全部分开。',
        en: 'All sisters have separated by the end of meiosis I.',
      },
    ],
    terms: [
      {
        word: {
          zh: '减数分裂',
          en: 'meiosis',
        },
        meaning: {
          zh: '一次DNA复制后两次分裂，使染色体套数减少的过程。',
          en: 'Two divisions following one DNA replication, reducing chromosome-set number.',
        },
      },
      {
        word: {
          zh: '配子',
          en: 'gamete',
        },
        meaning: {
          zh: '参与受精的单倍体生殖细胞。',
          en: 'A haploid reproductive cell participating in fertilization.',
        },
      },
      {
        word: {
          zh: '单倍体',
          en: 'haploid',
        },
        meaning: {
          zh: '具有一套染色体，不等于只有一条染色体。',
          en: 'Having one chromosome set, not necessarily one chromosome.',
        },
      },
      {
        word: {
          zh: '交叉互换',
          en: 'crossing over',
        },
        meaning: {
          zh: '同源染色体非姐妹染色单体交换对应DNA片段。',
          en: 'Exchange of corresponding DNA segments between non-sister chromatids of homologues.',
        },
      },
      {
        word: {
          zh: '分离',
          en: 'segregation',
        },
        meaning: {
          zh: '染色体或等位基因副本分配到不同细胞。',
          en: 'Distribution of chromosome or allele copies into different cells.',
        },
      },
      {
        word: {
          zh: '独立分配',
          en: 'independent assortment',
        },
        meaning: {
          zh: '不同同源对的方向与分离可形成不同组合。',
          en: 'Different homologous-pair orientations and segregation generate combinations.',
        },
      },
      {
        word: {
          zh: '受精',
          en: 'fertilization',
        },
        meaning: {
          zh: '配子融合恢复两套等遗传贡献的过程。',
          en: 'Fusion of gametes restoring genetic contributions including two chromosome sets in the model.',
        },
      },
    ],
    summary: {
      zh: '蓝红表示同源来源，长短表示两种染色体。小段换色表示一次对应交换；细胞外的计数始终指每细胞，非所有产物合计。',
      en: 'Blue and red mark homologous origin; long and short forms represent two chromosome types. Swapped segments show one corresponding crossover. Counts refer to each cell, not the combined products.',
    },
    mission: {
      zh: '制作三格计数卡：复制后2n4C→I后n2C→II后n1C；为每格补染色体与DNA数，并用两色线展示非姐妹交换。',
      en: 'Make three count cards: after S2n4C → after In2C → after IIn1C. Add chromosome and DNA counts, and use two colors to show a non-sister exchange.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis',
    },
    questions: [
      {
        id: 'L086-Q1',
        skill: 'concept',
        prompt: {
          zh: '分裂I分开的主要对象是什么？',
          en: 'What mainly separates in meiosis I?',
        },
        options: [
          {
            zh: '同一X的姐妹先完全分开',
            en: 'Sisters in each X separate first',
          },
          {
            zh: '成对的同源染色体',
            en: 'The paired homologous chromosomes',
          },
          {
            zh: '不同类型的非同源染色体',
            en: 'Non-homologous chromosomes of different types',
          },
        ],
        correct: 1,
        feedback: {
          zh: '分裂I分同源，姐妹仍连接；分裂II才分姐妹。',
          en: 'Meiosis I separates homologues while sisters remain connected; meiosis II separates sisters.',
        },
        revisit: {
          zh: '回看第3步的两个细胞与X形。',
          en: 'Revisit the two cells and Xs in step3.',
        },
      },
      {
        id: 'L086-Q2',
        skill: 'concept',
        prompt: {
          zh: '交叉互换的准确对象是什么？',
          en: 'Which structures exchange in crossing over?',
        },
        options: [
          {
            zh: '任意两种不同染色体',
            en: 'Any two unrelated chromosome types',
          },
          {
            zh: '同一复制染色体的两条姐妹',
            en: 'Two sisters of the same replicated chromosome',
          },
          {
            zh: '同源染色体的非姐妹染色单体对应片段',
            en: 'Corresponding segments of non-sister chromatids of homologues',
          },
        ],
        correct: 2,
        feedback: {
          zh: '对应片段互换能重组等位基因组合，通常不改变正常模型的套数和DNA总量。',
          en: 'Corresponding exchanges recombine allele combinations without changing normal-model ploidy or total DNA amount.',
        },
        revisit: {
          zh: '回看第2步的同源配对与双色末段。',
          en: 'Revisit paired homologues and exchanged segments in step2.',
        },
      },
      {
        id: 'L086-Q3',
        skill: 'reasoning',
        prompt: {
          zh: '2n=4模型在分裂I后每细胞的数据是哪组？',
          en: 'Which counts apply per cell after meiosis I in the2n=4 model?',
        },
        options: [
          {
            zh: 'n、2C；2条染色体、4个DNA分子',
            en: 'n,2C;2 chromosomes,4 DNA molecules',
          },
          {
            zh: '2n、4C；4条染色体、8个DNA分子',
            en: '2n,4C;4 chromosomes,8 DNA molecules',
          },
          {
            zh: 'n、1C；2条染色体、2个DNA分子',
            en: 'n,1C;2 chromosomes,2 DNA molecules',
          },
        ],
        correct: 0,
        feedback: {
          zh: '同源已分开使套数减半；姐妹未分开，所以每条染色体仍有两个DNA分子。',
          en: 'Homologues have separated, halving set number; connected sisters mean two DNA molecules remain per chromosome.',
        },
        revisit: {
          zh: '回看分裂I第3步的每细胞计数。',
          en: 'Revisit per-cell counts after I in step3.',
        },
      },
      {
        id: 'L086-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'haploid表示什么？',
          en: 'What does haploid mean?',
        },
        options: [
          {
            zh: '只能有一条染色体',
            en: 'Having only one chromosome',
          },
          {
            zh: '具有一套染色体',
            en: 'Having one chromosome set',
          },
          {
            zh: '保持两套染色体但DNA量减半',
            en: 'Keeping two chromosome sets but halving DNA amount',
          },
        ],
        correct: 1,
        feedback: {
          zh: '本模型配子是单倍体，但每个含两条不同类型的染色体。',
          en: 'Gametes in this model are haploid but each contains two chromosomes of different types.',
        },
        revisit: {
          zh: '回看Vocabulary及第4步n=2。',
          en: 'Revisit Vocabulary and n=2 in step4.',
        },
      },
    ],
  },
  {
    id: 'L087',
    title: {
      zh: '用遗传方格作预测',
      en: 'Punnett Squares',
    },
    hook: {
      zh: '虚构灯豆的两株亲代都是Aa。四个格子能告诉我们“下一粒种子一定是什么”，还是每一种组合出现的机会？',
      en: 'Two fictional glowbean parents are Aa. Do four grid cells reveal exactly what the next seed must be, or the chances of possible combinations?',
    },
    minutes: 30,
    icon: '🧬',
    objectives: [
      {
        zh: '按每方一个等位基因构建四格并标来源。',
        en: 'Build four cells using one allele from each parent and label origins.',
      },
      {
        zh: '计算AA、Aa、aa概率并检验总和为1。',
        en: 'Calculate AA,Aa,aa probabilities and check their sum is1.',
      },
      {
        zh: '明确完全显性等假设后，把基因型概率转换为表型概率。',
        en: 'Under stated assumptions including complete dominance, convert genotype into phenotype probabilities.',
      },
    ],
    prediction: [
      {
        zh: 'Aa×Aa可得1/4AA、1/2Aa、1/4aa，但不保证四子代比例。',
        en: 'Aa×Aa gives¼AA,½Aa,¼aa, without guaranteeing the ratio among four offspring.',
      },
      {
        zh: 'Aa亲代的每个配子都同时携带A和a。',
        en: 'Every gamete from Aa carries both A and a.',
      },
      {
        zh: '格子里的Aa和aA必须算不同基因型。',
        en: 'Aa and aA must count as different genotypes.',
      },
    ],
    terms: [
      {
        word: {
          zh: '遗传方格',
          en: 'Punnett square',
        },
        meaning: {
          zh: '用亲代配子组合列出可能子代与概率的表。',
          en: 'A table combining parental gametes to show possible offspring and probabilities.',
        },
      },
      {
        word: {
          zh: '基因型',
          en: 'genotype',
        },
        meaning: {
          zh: '指定基因座的等位基因组合，或更广义的遗传组成。',
          en: 'The allele combination at a specified locus, or genetic makeup more broadly.',
        },
      },
      {
        word: {
          zh: '表型',
          en: 'phenotype',
        },
        meaning: {
          zh: '可观察或测量的特征，受基因型及环境等影响。',
          en: 'An observable or measurable feature influenced by genotype and environment.',
        },
      },
      {
        word: {
          zh: '纯合',
          en: 'homozygous',
        },
        meaning: {
          zh: '某基因座两个等位基因相同。',
          en: 'Having the same two alleles at a locus.',
        },
      },
      {
        word: {
          zh: '杂合',
          en: 'heterozygous',
        },
        meaning: {
          zh: '某基因座两个等位基因不同。',
          en: 'Having two different alleles at a locus.',
        },
      },
      {
        word: {
          zh: '完全显性',
          en: 'complete dominance',
        },
        meaning: {
          zh: '在指定性状中，杂合子与一种纯合子表型相同。',
          en: 'For a specified trait, the heterozygote has the same phenotype as one homozygote.',
        },
      },
      {
        word: {
          zh: '概率',
          en: 'probability',
        },
        meaning: {
          zh: '在给定假设下事件发生机会的数值。',
          en: 'A numerical chance of an event under specified assumptions.',
        },
      },
    ],
    summary: {
      zh: '行代表亲代A的配子槽，列代表亲代B的配子槽；每格下方标各方贡献。颜色分AA/Aa与aa只适用于虚构完全显性表型。',
      en: 'Rows represent parent A gamete slots and columns parent B slots; contributions appear below each genotype. Grouping AA/Aa versus aa by color applies only to the fictional complete-dominance phenotype.',
    },
    mission: {
      zh: '为虚构灯豆制作Aa×Aa与Aa×aa两张方格；标每个等位基因来源，写出概率之和与完全显性前提，禁止套用真实家庭性状。',
      en: 'Build Aa×Aa and Aa×aa glowbean squares, label each allele’s origin, check probability sums and state complete dominance. Keep the example fictional rather than testing family traits.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits',
    },
    questions: [
      {
        id: 'L087-Q1',
        skill: 'concept',
        prompt: {
          zh: 'Aa亲代在该基因座形成的正常配子带什么？',
          en: 'What does a normal gamete from an Aa parent carry at this locus?',
        },
        options: [
          {
            zh: '同时带A与a',
            en: 'Both A and a',
          },
          {
            zh: 'A或a中的一个',
            en: 'Either A or a',
          },
          {
            zh: '必定带A，因为大写',
            en: 'Always A because it is uppercase',
          },
        ],
        correct: 1,
        feedback: {
          zh: '减数分裂使该同源位置的两版本分离，正常配子只带一个。',
          en: 'Meiosis segregates the two allele versions at this homologous locus; a normal gamete carries one.',
        },
        revisit: {
          zh: '回看配子槽与第1步。',
          en: 'Revisit the gamete slots and step1.',
        },
      },
      {
        id: 'L087-Q2',
        skill: 'concept',
        prompt: {
          zh: 'Aa×Aa的3∶1表型概率需要哪项前提？',
          en: 'Which assumption is needed for a3:1 phenotype probability in Aa×Aa?',
        },
        options: [
          {
            zh: '每四个子代必须恰好三显一隐',
            en: 'Every four offspring must contain exactly three dominant and one recessive',
          },
          {
            zh: 'A在人群里一定更常见',
            en: 'A must be more common in a population',
          },
          {
            zh: 'A对指定性状完全显性，且配子等概率等假设成立',
            en: 'Complete dominance for this trait and assumptions such as equal gamete probabilities',
          },
        ],
        correct: 2,
        feedback: {
          zh: '3∶1来自把AA与Aa合并；不完全显性时该表型合并可能不成立。',
          en: 'The3:1 result groups AA and Aa together; that phenotype grouping may fail under incomplete dominance.',
        },
        revisit: {
          zh: '回看Explain第二段和第4步。',
          en: 'Revisit Explain paragraph2 and step4.',
        },
      },
      {
        id: 'L087-Q3',
        skill: 'reasoning',
        prompt: {
          zh: 'Aa×aa时，Aa子代的概率是多少？',
          en: 'What is the probability of an Aa offspring from Aa×aa?',
        },
        options: [
          {
            zh: '1/2',
            en: '1/2',
          },
          {
            zh: '3/4',
            en: '3/4',
          },
          {
            zh: '1，因为aa不会贡献',
            en: '1 because aa contributes nothing',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Aa亲代一半配子带A，aa总提供a，所以一半组合为Aa、一半为aa。',
          en: 'Half of the Aa parent’s gametes carry A and the aa parent always contributes a, giving half Aa and half aa.',
        },
        revisit: {
          zh: '切换Aa×aa并回看四格汇总。',
          en: 'Switch to Aa×aa and revisit the four-cell summary.',
        },
      },
      {
        id: 'L087-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'heterozygous指哪种情况？',
          en: 'Which case is heterozygous?',
        },
        options: [
          {
            zh: 'AA或aa，两个版本相同',
            en: 'AA or aa with matching alleles',
          },
          {
            zh: 'Aa，某基因座两个版本不同',
            en: 'Aa with two different alleles at a locus',
          },
          {
            zh: '只有一个A的配子',
            en: 'A gamete with just one A',
          },
        ],
        correct: 1,
        feedback: {
          zh: '杂合说明同一基因座两个等位基因不同；单个配子不因此称杂合。',
          en: 'Heterozygous means two different alleles at the same locus; one gamete allele does not make a heterozygote.',
        },
        revisit: {
          zh: '回看Vocabulary的homozygous与heterozygous。',
          en: 'Revisit homozygous and heterozygous in Vocabulary.',
        },
      },
    ],
  },
  {
    id: 'L088',
    title: {
      zh: '遗传概率并非命运',
      en: 'Probability and Real Traits',
    },
    hook: {
      zh: '前3粒虚构灯豆都发光，第4粒是不是“欠着”一个不发光？把样本从4增加到40，能让概率变成保证吗？',
      en: 'The first3 fictional glowbeans all glow. Is the fourth “owed” a non-glowing outcome? Does increasing a sample from4 to40 turn probability into a guarantee?',
    },
    minutes: 30,
    icon: '🧬',
    objectives: [
      {
        zh: '用概率乘样本数计算期望数量并与观察值比较。',
        en: 'Calculate expected count as probability×sample size and compare observations.',
      },
      {
        zh: '用种子重现样本并比较不同批次的随机波动。',
        en: 'Reproduce a seeded sample and compare random variation among batches.',
      },
      {
        zh: '解释独立事件、显性含义及真实多基因性状的边界。',
        en: 'Explain independent events, dominance and limits for real polygenic traits.',
      },
    ],
    prediction: [
      {
        zh: '每粒仍有1/4为aa，前面结果不制造“欠账”。',
        en: 'Each seed still has¼ chance of aa; earlier outcomes create no debt.',
      },
      {
        zh: '前三粒非aa后，第四粒必须aa。',
        en: 'After three non-aa seeds, the fourth must be aa.',
      },
      {
        zh: '样本恰好4粒时，遗传方格规定必须1AA、2Aa、1aa。',
        en: 'A square requires exactly1AA,2Aa,1aa whenever a sample has4 seeds.',
      },
    ],
    terms: [
      {
        word: {
          zh: '期望值',
          en: 'expected value',
        },
        meaning: {
          zh: '按概率计算的长期平均或加权平均，不保证单次取到。',
          en: 'A probability-weighted average, not a guaranteed single realization.',
        },
      },
      {
        word: {
          zh: '观察值',
          en: 'observed value',
        },
        meaning: {
          zh: '某次样本中实际记录的结果。',
          en: 'The result actually recorded in a particular sample.',
        },
      },
      {
        word: {
          zh: '独立事件',
          en: 'independent events',
        },
        meaning: {
          zh: '一个事件的结果不改变另一个事件的概率。',
          en: 'Events for which one outcome does not change the probability of another.',
        },
      },
      {
        word: {
          zh: '样本波动',
          en: 'sampling variation',
        },
        meaning: {
          zh: '相同概率机制下不同样本产生的差异。',
          en: 'Differences among samples generated by the same probability mechanism.',
        },
      },
      {
        word: {
          zh: '随机种子',
          en: 'random seed',
        },
        meaning: {
          zh: '使伪随机计算可复现的起始设定。',
          en: 'An initial setting making pseudorandom computation reproducible.',
        },
      },
      {
        word: {
          zh: '多基因性状',
          en: 'polygenic trait',
        },
        meaning: {
          zh: '受到多个基因座影响的性状。',
          en: 'A trait influenced by multiple gene loci.',
        },
      },
      {
        word: {
          zh: '显性',
          en: 'dominance',
        },
        meaning: {
          zh: '指定条件下杂合子的表型关系，不代表更强或更常见。',
          en: 'A heterozygote phenotype relationship under stated conditions, not strength or frequency.',
        },
      },
    ],
    summary: {
      zh: '蓝点是aa，金点是AA或Aa。表格列同一整批样本的理论概率、期望数量与观察数量；动画逐步揭示该批，种子相同可复现。',
      en: 'Blue dots are aa; gold dots are AA or Aa. The table shows theoretical probabilities, expected counts and observed counts for the same full batch. Animation progressively reveals that batch; the same seed reproduces it.',
    },
    mission: {
      zh: '提交三批虚构种子样本，保留亲代、样本数、种子、期望与观察。用英文写独立性结论，再说明多基因与环境为何限制外推。',
      en: 'Submit three fictional batches with parents, count, seed, expectations and observations. State independence in English and explain how multiple genes and environment limit extrapolation.',
    },
    reference: {
      title: 'OpenStax Biology 2e — scientific reference',
      url: 'https://openstax.org/books/biology-2e/pages/12-1-mendels-experiments-and-the-laws-of-probability',
    },
    questions: [
      {
        id: 'L088-Q1',
        skill: 'concept',
        prompt: {
          zh: '前3个子代都非aa，独立模型中下一个aa概率是多少？',
          en: 'After3 non-aa offspring, what is the next aa probability in the independent model?',
        },
        options: [
          {
            zh: '1，必须补齐',
            en: '1 because a deficit must be repaid',
          },
          {
            zh: '1/4，与之前相同',
            en: '1/4, unchanged',
          },
          {
            zh: '0，aa已经消失',
            en: '0 because aa has disappeared',
          },
        ],
        correct: 1,
        feedback: {
          zh: '固定亲代与抽样假设下，前面结果不改变下一次配子选择机会。',
          en: 'With fixed parents and drawing assumptions, earlier outcomes do not change the next gamete probabilities.',
        },
        revisit: {
          zh: '回看逐步揭示样本与Explain第二段。',
          en: 'Revisit sample revelation and Explain paragraph2.',
        },
      },
      {
        id: 'L088-Q2',
        skill: 'concept',
        prompt: {
          zh: '“显性A”能推出什么？',
          en: 'What follows from “A is dominant” here?',
        },
        options: [
          {
            zh: 'A在人群一定更常见',
            en: 'A must be more common',
          },
          {
            zh: 'A总使个体更强',
            en: 'A always makes individuals stronger',
          },
          {
            zh: '在指定模型中Aa与AA属于同一表型',
            en: 'In the specified model Aa and AA share a phenotype',
          },
        ],
        correct: 2,
        feedback: {
          zh: '显性描述特定条件下表型关系，不能推断频率、强弱或价值。',
          en: 'Dominance describes a phenotype relationship under specified conditions, not frequency, strength or value.',
        },
        revisit: {
          zh: '回看Explain第三段的显性限制。',
          en: 'Revisit dominance limits in Explain paragraph3.',
        },
      },
      {
        id: 'L088-Q3',
        skill: 'reasoning',
        prompt: {
          zh: 'Aa×Aa、40子代、aa概率1/4：观察到7个aa，应怎样解释？',
          en: 'With Aa×Aa,40 offspring and aa probability¼, how should7 observed aa be interpreted?',
        },
        options: [
          {
            zh: '期望10；7可能是样本波动，需要结合证据评估',
            en: 'Expectation10;7 may reflect sampling variation, assessed with evidence',
          },
          {
            zh: '期望必须7，因为观察是7',
            en: 'Expectation must be7 because7 were observed',
          },
          {
            zh: '差3证明下一批必有13',
            en: 'A deficit of3 proves the next batch must have13',
          },
        ],
        correct: 0,
        feedback: {
          zh: '40×1/4＝10是期望；观察7不是逻辑矛盾，也不给下一批形成欠账。',
          en: '40×¼=10 is the expectation; observing7 is not a logical contradiction and creates no debt for the next batch.',
        },
        revisit: {
          zh: '回看期望/观察表与Apply。',
          en: 'Revisit the expectation/observation table and Apply.',
        },
      },
      {
        id: 'L088-Q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'sampling variation指什么？',
          en: 'What is sampling variation?',
        },
        options: [
          {
            zh: '概率必须随每次结果改变',
            en: 'Probabilities must change after every outcome',
          },
          {
            zh: '同一概率机制产生的样本间差异',
            en: 'Differences among samples from the same probability mechanism',
          },
          {
            zh: '只指科学家抄错数据',
            en: 'Only a transcription mistake',
          },
        ],
        correct: 1,
        feedback: {
          zh: '模型假设相同，随机抽样仍可产生不同计数；它与记录错误是不同来源。',
          en: 'The same model assumptions can yield different counts through random sampling; that differs from recording errors.',
        },
        revisit: {
          zh: '回看Vocabulary与不同种子的样本。',
          en: 'Revisit Vocabulary and batches from different seeds.',
        },
      },
    ],
  },
];
