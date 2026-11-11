import type { Lesson } from '../schema';
export const divisionEnzymeLessons: Lesson[] = [
  {
    id: 'L073',
    title: {
      zh: '为什么细胞不能一直长大？',
      en: 'Limits to cell size',
    },
    hook: {
      zh: '把一个细胞的每条边放大两倍，它交换物质的表面与需要供应的内部，会一起增加两倍吗？',
      en: 'If every edge of a cell doubles, do its exchanging surface and the interior needing supplies both merely double?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '为什么细胞不能一直长大？',
      en: 'Limits to cell size',
    },
    objectives: [
      {
        zh: '计算立方体面积、体积与面积/体积比并正确标单位。',
        en: 'Calculate cube area, volume and area-to-volume ratio with correct units.',
      },
      {
        zh: '用相同体积的形状对照解释交换表面的作用。',
        en: 'Use equal-volume shapes to explain the role of exchange surfaces.',
      },
      {
        zh: '说明几何模型为何不能单独预测真实细胞大小或交换速率。',
        en: 'Explain why geometry alone cannot predict actual cell size or exchange rate.',
      },
    ],
    prediction: [
      {
        zh: '边长加倍，面积与体积都加倍',
        en: 'Doubling length doubles both area and volume',
      },
      {
        zh: '边长加倍，体积增长比面积更快',
        en: 'Doubling length increases volume faster than area',
      },
      {
        zh: '只要体积相同，任何形状的面积就相同',
        en: 'Equal-volume shapes always have equal surface areas',
      },
    ],
    terms: [
      {
        word: {
          zh: '表面积',
          en: 'surface area',
        },
        meaning: {
          zh: '物体与外界接触的表面总面积。',
          en: 'Total area of the surface exposed to the surroundings.',
        },
      },
      {
        word: {
          zh: '体积',
          en: 'volume',
        },
        meaning: {
          zh: '物体占据的三维空间大小。',
          en: 'Amount of three-dimensional space occupied.',
        },
      },
      {
        word: {
          zh: '面积/体积比',
          en: 'surface-area-to-volume ratio',
        },
        meaning: {
          zh: '表面积除以体积，单位为长度的倒数。',
          en: 'Surface area divided by volume, with inverse-length units.',
        },
      },
      {
        word: {
          zh: '扩散距离',
          en: 'diffusion distance',
        },
        meaning: {
          zh: '物质由一处扩散到另一处需要跨越的距离。',
          en: 'Distance a substance must cross by diffusion.',
        },
      },
      {
        word: {
          zh: '浓度梯度',
          en: 'concentration gradient',
        },
        meaning: {
          zh: '不同位置间的浓度差异。',
          en: 'Difference in concentration across positions.',
        },
      },
      {
        word: {
          zh: '代谢需求',
          en: 'metabolic demand',
        },
        meaning: {
          zh: '细胞活动对物质和能量的需求。',
          en: 'Requirement for matter and energy supporting cellular activity.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '边长l的立方体，面积/体积比是多少？',
          en: 'What is the area-to-volume ratio of a cube of edge l?',
        },
        options: [
          {
            zh: '6/l，单位为长度⁻¹',
            en: '6/l, with units of length⁻¹',
          },
          {
            zh: '6l，单位为长度',
            en: '6l, with units of length',
          },
          {
            zh: 'l³，单位为体积',
            en: 'l³, with volume units',
          },
        ],
        correct: 0,
        feedback: {
          zh: '六个面的面积6l²除以l³得6/l；比例不是无单位的数。',
          en: 'Six faces give 6l²; dividing by l³ gives 6/l. This ratio has units.',
        },
        revisit: {
          zh: '回看Explain第一段，把µm²除以µm³。',
          en: 'Revisit Explain paragraph one and divide µm² by µm³.',
        },
        id: 'L073-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '为什么扁平细胞在相同体积下可能更利于交换？',
          en: 'Why may flattening favour exchange at the same volume?',
        },
        options: [
          {
            zh: '体积不变时所有几何量都相同',
            en: 'Every geometric quantity stays equal when volume is equal',
          },
          {
            zh: '表面积可增加，内部到表面距离可缩短',
            en: 'Area can increase and internal distances to the surface can shorten',
          },
          {
            zh: '扁平形不再需要运输蛋白',
            en: 'Flattened cells no longer need transport proteins',
          },
        ],
        correct: 1,
        feedback: {
          zh: '相同体积并不保证相同面积；实际交换仍受膜性质和梯度等影响。',
          en: 'Equal volume does not imply equal area; membrane properties and gradients still matter.',
        },
        revisit: {
          zh: '比较Explore表中的两行边长、体积与面积。',
          en: 'Compare both rows of edges, volumes and areas in Explore.',
        },
        id: 'L073-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '立方体边长由2 µm变为4 µm，哪组结果正确？',
          en: 'A cube grows from 2 µm to 4 µm per edge. Which result is correct?',
        },
        options: [
          {
            zh: '面积24→48；体积8→16',
            en: 'Area 24→48; volume 8→16',
          },
          {
            zh: '面积24→96；体积8→64；比例3→1.5 µm⁻¹',
            en: 'Area 24→96; volume 8→64; ratio 3→1.5 µm⁻¹',
          },
          {
            zh: '面积24→96；体积8→32；比例不变',
            en: 'Area 24→96; volume 8→32; ratio unchanged',
          },
        ],
        correct: 1,
        feedback: {
          zh: '边长×2，面积×4、体积×8，因此比例减半；这不是交换速率减半的测量。',
          en: 'Doubling length multiplies area by four and volume by eight, halving the ratio; this does not measure a halving of exchange rate.',
        },
        revisit: {
          zh: '把滑块先放2再放4，记录三列数值。',
          en: 'Set the slider to 2 then 4 and record all three quantities.',
        },
        id: 'L073-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'diffusion distance最准确的含义是什么？',
          en: 'What does diffusion distance mean?',
        },
        options: [
          {
            zh: '扩散需要跨越的路程',
            en: 'The distance crossed by diffusion',
          },
          {
            zh: '每秒通过膜的分子数',
            en: 'Number of molecules crossing a membrane per second',
          },
          {
            zh: '细胞表面与体积的比值',
            en: 'Ratio of cellular surface area to volume',
          },
        ],
        correct: 0,
        feedback: {
          zh: '距离、速率与几何比值是不同量；较长扩散距离通常使扩散运输更费时。',
          en: 'Distance, rate and geometric ratio are different quantities; longer diffusion paths generally take more time.',
        },
        revisit: {
          zh: '回看Vocabulary的扩散距离，指认图中的内外位置。',
          en: 'Revisit diffusion distance in Vocabulary and identify inner and outer positions.',
        },
        id: 'L073-q4',
      },
    ],
    mission: {
      zh: '在屏幕模型中比较l=2与l=4，再在l=2时比较两种形状。写主张、两组带单位证据与机制，并列出一个未测因素。',
      en: 'Compare l=2 and l=4, then compare shapes at l=2. Write a claim, two comparisons with units, a mechanism and one unmeasured factor.',
    },
    reference: {
      title: 'OpenStax — Cell cycle and mitosis',
      url: 'https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle',
    },
  },
  {
    id: 'L074',
    title: {
      zh: '细胞周期是什么？',
      en: 'The cell cycle',
    },
    hook: {
      zh: '复印四本书后有八本纸张副本，是否等于书的种类也翻倍？细胞复制DNA时，染色体套数发生什么？',
      en: 'After copying four books, does the doubled amount of paper double the kinds of books? What happens to chromosome sets when DNA replicates?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '细胞周期是什么？',
      en: 'The cell cycle',
    },
    objectives: [
      {
        zh: '按G1、S、G2、M解释准备、复制和分配。',
        en: 'Explain preparation, replication and distribution through G1, S, G2 and M.',
      },
      {
        zh: '在2n=4例子中区分DNA量、染色体数与倍性。',
        en: 'Distinguish DNA amount, chromosome count and ploidy in a 2n=4 example.',
      },
      {
        zh: '解释检查点为何降低风险却不保证零错误。',
        en: 'Explain why checkpoints reduce risk without guaranteeing zero errors.',
      },
    ],
    prediction: [
      {
        zh: 'S期DNA加倍，所以细胞变成4n',
        en: 'DNA doubles in S, so the cell becomes 4n',
      },
      {
        zh: 'S期DNA加倍，但复制后的姐妹尚未分开，倍性仍为2n',
        en: 'DNA doubles in S; sisters remain joined and ploidy stays 2n',
      },
      {
        zh: '直到M期结束才第一次复制DNA',
        en: 'DNA first replicates only after M ends',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞周期',
          en: 'cell cycle',
        },
        meaning: {
          zh: '细胞生长、复制DNA并完成分裂的有序过程。',
          en: 'Ordered growth, DNA replication and division.',
        },
      },
      {
        word: {
          zh: '间期',
          en: 'interphase',
        },
        meaning: {
          zh: '包括G1、S、G2的活跃准备阶段。',
          en: 'Active preparation comprising G1, S and G2.',
        },
      },
      {
        word: {
          zh: 'DNA复制',
          en: 'DNA replication',
        },
        meaning: {
          zh: '以已有DNA为模板合成DNA副本。',
          en: 'Production of DNA copies using existing DNA as templates.',
        },
      },
      {
        word: {
          zh: '姐妹染色单体',
          en: 'sister chromatids',
        },
        meaning: {
          zh: '一条染色体复制后相连的两份副本。',
          en: 'The connected copies of one replicated chromosome.',
        },
      },
      {
        word: {
          zh: '倍性',
          en: 'ploidy',
        },
        meaning: {
          zh: '细胞具有的同源染色体组数。',
          en: 'Number of homologous chromosome sets in a cell.',
        },
      },
      {
        word: {
          zh: '检查点',
          en: 'checkpoint',
        },
        meaning: {
          zh: '评估条件并可延缓周期进程的调控环节。',
          en: 'A regulatory control that assesses conditions and can delay progression.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: 'DNA复制主要发生在哪一期？',
          en: 'During which phase does DNA replication mainly occur?',
        },
        options: [
          {
            zh: 'G1期',
            en: 'G1',
          },
          {
            zh: 'S期',
            en: 'S phase',
          },
          {
            zh: '有丝分裂后期',
            en: 'Anaphase',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'S期进行DNA合成；M期主要处理复制后遗传信息的分配。',
          en: 'S is DNA synthesis; M primarily distributes previously copied genetic information.',
        },
        revisit: {
          zh: '回看周期图S与M的不同任务。',
          en: 'Revisit the different tasks of S and M in the cycle figure.',
        },
        id: 'L074-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '一个原先2n=4的细胞在G2期，哪个描述正确？',
          en: 'Which description fits a G2 cell originally 2n=4?',
        },
        options: [
          {
            zh: '4n=8，只有4条染色单体',
            en: '4n=8, with only 4 chromatids',
          },
          {
            zh: '2n=4，4条染色体由8条染色单体组成',
            en: '2n=4, with 4 chromosomes comprising 8 chromatids',
          },
          {
            zh: '2n=4，DNA量与G1完全相同',
            en: '2n=4, with exactly the G1 DNA amount',
          },
        ],
        correct: 1,
        feedback: {
          zh: '复制增加DNA量和姐妹数，不增加同源染色体组数；相连姐妹仍按一条复制染色体计。',
          en: 'Replication increases DNA and sister copies, not homologous sets; connected sisters count as one replicated chromosome.',
        },
        revisit: {
          zh: '比较Explore的G1与G2库存；M计数限定中期。',
          en: 'Compare G1 and G2 inventories; the M count is specifically metaphase.',
        },
        id: 'L074-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: 'G2仍有DNA损伤时暂停进入M，对后续有什么作用？',
          en: 'How can delaying M entry when DNA damage remains in G2 help?',
        },
        options: [
          {
            zh: '给修复留下机会，降低把损伤传给子细胞的风险',
            en: 'Allow repair and reduce the risk of passing damage to daughters',
          },
          {
            zh: '证明每个错误已被完全纠正',
            en: 'Prove every error has been fully corrected',
          },
          {
            zh: '代替S期，不再需要复制',
            en: 'Replace S so replication becomes unnecessary',
          },
        ],
        correct: 0,
        feedback: {
          zh: '暂停提供修复与调控机会，既不等于修复完成，也不能证明检查点绝不失效。',
          en: 'Delay allows repair and regulation; it neither proves repair is complete nor guarantees checkpoint success.',
        },
        revisit: {
          zh: '开启G2损伤条件，读暂停说明，再关闭作对照。',
          en: 'Enable G2 damage, read the hold explanation, then compare without it.',
        },
        id: 'L074-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'interphase包含什么？',
          en: 'What does interphase include?',
        },
        options: [
          {
            zh: '只有细胞完全休眠的时期',
            en: 'Only complete cellular dormancy',
          },
          {
            zh: '前期、中期、后期、末期',
            en: 'Prophase, metaphase, anaphase and telophase',
          },
          {
            zh: 'G1、S、G2，细胞持续进行多种活动',
            en: 'G1, S and G2, with continuing cellular activity',
          },
        ],
        correct: 2,
        feedback: {
          zh: '间期不是“没有事情发生”；生长、代谢、复制与准备都很活跃。',
          en: 'Interphase is not inactivity: growth, metabolism, replication and preparation are active.',
        },
        revisit: {
          zh: '回看Explain第一段及Vocabulary的间期。',
          en: 'Revisit Explain paragraph one and interphase in Vocabulary.',
        },
        id: 'L074-q4',
      },
    ],
    mission: {
      zh: '制作G1、S结束、G2、中期和子细胞的库存表，分别写染色体数、DNA量、倍性，再解释检查点暂停能支持和不能支持的结论。',
      en: 'Make an inventory for G1, end of S, G2, metaphase and each daughter, separating chromosome count, DNA amount and ploidy. Explain what a checkpoint hold does and does not establish.',
    },
    reference: {
      title: 'OpenStax — Cell cycle and mitosis',
      url: 'https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle',
    },
  },
  {
    id: 'L075',
    title: {
      zh: '有丝分裂怎样进行？',
      en: 'Mitosis',
    },
    hook: {
      zh: '如果四条染色体都复制过，怎样才能让两个子细胞各拿到每一条的一个副本，而不是只保证总数平均？',
      en: 'Once four chromosomes are copied, how can each daughter receive one copy of every chromosome rather than merely half the total?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '有丝分裂怎样进行？',
      en: 'Mitosis',
    },
    objectives: [
      {
        zh: '将有丝分裂阶段按机制排序并说明相邻步骤的因果关系。',
        en: 'Order mitotic stages and explain causal links between them.',
      },
      {
        zh: '区分同源染色体与姐妹染色单体，追踪每端信息。',
        en: 'Distinguish homologues from sisters and trace information at each pole.',
      },
      {
        zh: '比较正常与错误分离，说明“相同信息”的理想条件。',
        en: 'Compare normal and faulty segregation and state assumptions behind identical information.',
      },
    ],
    prediction: [
      {
        zh: '只需把总DNA平均分，具体是哪条无所谓',
        en: 'Only the total amount matters, not chromosome identity',
      },
      {
        zh: '有丝分裂将A与a分到相反子细胞',
        en: 'Mitosis sends homologues A and a to opposite daughters',
      },
      {
        zh: '先复制，再把每条染色体的姐妹分别送往两端',
        en: 'Copy first, then send each chromosome’s sisters to opposite poles',
      },
    ],
    terms: [
      {
        word: {
          zh: '有丝分裂',
          en: 'mitosis',
        },
        meaning: {
          zh: '将复制后的核遗传信息分配到两个子核的过程。',
          en: 'Distribution of replicated nuclear genetic information into two daughter nuclei.',
        },
      },
      {
        word: {
          zh: '同源染色体',
          en: 'homologous chromosomes',
        },
        meaning: {
          zh: '含有相应基因位置、可有不同等位基因的一对染色体。',
          en: 'A pair with corresponding gene loci that may carry different alleles.',
        },
      },
      {
        word: {
          zh: '姐妹染色单体',
          en: 'sister chromatids',
        },
        meaning: {
          zh: '同一染色体复制形成的相连副本。',
          en: 'Connected copies produced by replication of one chromosome.',
        },
      },
      {
        word: {
          zh: '纺锤体',
          en: 'spindle',
        },
        meaning: {
          zh: '帮助染色体定位并分离的微管系统。',
          en: 'A microtubule system positioning and separating chromosomes.',
        },
      },
      {
        word: {
          zh: '着丝粒',
          en: 'centromere',
        },
        meaning: {
          zh: '姐妹相连且形成动粒连接区域的染色体区域。',
          en: 'Chromosomal region associated with sister cohesion and kinetochore formation.',
        },
      },
      {
        word: {
          zh: '胞质分裂',
          en: 'cytokinesis',
        },
        meaning: {
          zh: '将细胞质及细胞边界分开的过程。',
          en: 'Division of the cytoplasm and cellular boundary.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '哪项是有丝分裂的合理顺序？',
          en: 'Which sequence describes mitosis correctly?',
        },
        options: [
          {
            zh: '姐妹分离→排列→凝缩→核重建',
            en: 'Sister separation → alignment → condensation → nuclear reformation',
          },
          {
            zh: '凝缩→排列→姐妹分离→核重建',
            en: 'Condensation → alignment → sister separation → nuclear reformation',
          },
          {
            zh: '凝缩→同源配对→同源分离→再复制',
            en: 'Condensation → homologue pairing → homologue separation → replication',
          },
        ],
        correct: 1,
        feedback: {
          zh: '复制在此前S期完成；有丝分裂的关键是把姐妹副本分往两端，不是减数第一次分裂的同源分离。',
          en: 'Replication occurred in the preceding S phase; mitosis separates sister copies rather than homologues as in meiosis I.',
        },
        revisit: {
          zh: '用阶段卡把前期、中期、后期、末期排好，再接胞质分裂。',
          en: 'Order prophase, metaphase, anaphase and telophase cards, then add cytokinesis.',
        },
        id: 'L075-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: 'A、a是一对同源染色体，A1、A2是A的姐妹。正常分裂时怎样分？',
          en: 'A/a are homologues and A1/A2 are sisters. What normally happens?',
        },
        options: [
          {
            zh: 'A1与A2各去一端，每端仍有A与a来源的染色体',
            en: 'A1 and A2 go to opposite poles; each pole retains A and a origins',
          },
          {
            zh: 'A与a必定各去一端，因此每端只留一条同源',
            en: 'A and a must go to opposite poles, leaving one homologue per pole',
          },
          {
            zh: 'A1与A2一起去同一端，a去另一端',
            en: 'A1 and A2 travel together to one pole, and a to the other',
          },
        ],
        correct: 0,
        feedback: {
          zh: '子细胞保留两对同源；分开的是每条复制染色体的姐妹。',
          en: 'Daughters retain both homologous pairs; sisters of each replicated chromosome separate.',
        },
        revisit: {
          zh: '在后期静帧逐个读左端和右端的A1/a1/B1/b1及A2/a2/B2/b2。',
          en: 'Read all labels at both poles in the anaphase snapshot.',
        },
        id: 'L075-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '错误对照中出现5条对3条，为什么不能说信息正确分配？',
          en: 'Why does the faulty 5-to-3 comparison fail to show correct information distribution?',
        },
        options: [
          {
            zh: '只要总数为8，两边都完整',
            en: 'A total of eight ensures both sides are complete',
          },
          {
            zh: '两边拥有的染色体身份和数目不同',
            en: 'The poles differ in chromosome identity and number',
          },
          {
            zh: '因为正常有丝分裂应产生4个细胞',
            en: 'Because normal mitosis should produce four cells',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'A2错误进入左端，右端缺少A来源；总量守恒与每个子细胞信息完整是两件事。',
          en: 'A2 wrongly enters the left pole and the right lacks its A-origin copy; conservation differs from completeness per daughter.',
        },
        revisit: {
          zh: '开启错误分离，比较每端身份而不只看8的总数。',
          en: 'Enable faulty segregation and compare identities, not only the total eight.',
        },
        id: 'L075-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'cytokinesis与mitosis的区别是什么？',
          en: 'How does cytokinesis differ from mitosis?',
        },
        options: [
          {
            zh: '胞质分裂分开细胞质，有丝分裂分配核遗传信息',
            en: 'Cytokinesis divides cytoplasm; mitosis distributes nuclear genetic information',
          },
          {
            zh: '两词都专指S期DNA复制',
            en: 'Both mean DNA replication in S',
          },
          {
            zh: '胞质分裂专指同源染色体配对',
            en: 'Cytokinesis means homologue pairing',
          },
        ],
        correct: 0,
        feedback: {
          zh: '核分裂与胞质分裂通常协调，但概念不同，有时可发生核分裂而未完成胞质分裂。',
          en: 'Nuclear and cytoplasmic division are usually coordinated but distinct; nuclear division can occur without completed cytokinesis.',
        },
        revisit: {
          zh: '回看末期与胞质分裂两张卡。',
          en: 'Revisit the telophase and cytokinesis cards.',
        },
        id: 'L075-q4',
      },
    ],
    mission: {
      zh: '完成阶段排序，记录一次修正及依据。追踪A/a/B/b到两端，再用错误分离写出“总数守恒不等于分配正确”的证据。',
      en: 'Order the stages and record one correction with its reason. Trace A/a/B/b to both poles, then use faulty segregation as evidence that conservation does not ensure correct distribution.',
    },
    reference: {
      title: 'OpenStax — Cell cycle and mitosis',
      url: 'https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle',
    },
  },
  {
    id: 'L076',
    title: {
      zh: '细胞分化与修复',
      en: 'Differentiation and repair',
    },
    hook: {
      zh: '表皮细胞、肌肉细胞与神经元大多保留相同的DNA，为什么形状、蛋白质与修复能力却不同？',
      en: 'Epidermal cells, muscle cells and neurons largely retain the same DNA. Why do their shapes, proteins and repair capacities differ?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '细胞分化与修复',
      en: 'Differentiation and repair',
    },
    objectives: [
      {
        zh: '用基因表达→蛋白质→功能解释分化。',
        en: 'Explain differentiation through gene expression → proteins → function.',
      },
      {
        zh: '区分成熟细胞功能与组织中干/祖细胞的补充作用。',
        en: 'Distinguish mature cell function from stem/progenitor replacement.',
      },
      {
        zh: '说明修复能力的组织限制，避免所有细胞皆全能的推论。',
        en: 'Explain tissue limits on repair without assuming every cell is totipotent.',
      },
    ],
    prediction: [
      {
        zh: '分化通常要把不需要的基因全部删掉',
        en: 'Differentiation usually deletes every unneeded gene',
      },
      {
        zh: '相同基因组可因表达不同而形成不同功能',
        en: 'A shared genome can support different functions through expression',
      },
      {
        zh: '任何成熟细胞都能自行分裂并变成任何细胞',
        en: 'Any mature cell can divide and become any cell type',
      },
    ],
    terms: [
      {
        word: {
          zh: '分化',
          en: 'differentiation',
        },
        meaning: {
          zh: '细胞形成较专门结构与功能的过程。',
          en: 'Development of more specialised cellular structures and functions.',
        },
      },
      {
        word: {
          zh: '基因表达',
          en: 'gene expression',
        },
        meaning: {
          zh: '利用基因信息产生功能产物的过程。',
          en: 'Use of gene information to produce functional products.',
        },
      },
      {
        word: {
          zh: '蛋白质',
          en: 'protein',
        },
        meaning: {
          zh: '承担结构、催化和调控等功能的大分子。',
          en: 'A macromolecule with structural, catalytic and regulatory roles.',
        },
      },
      {
        word: {
          zh: '干细胞',
          en: 'stem cell',
        },
        meaning: {
          zh: '能自我更新并产生一定类型后代的细胞。',
          en: 'A cell able to self-renew and generate a specified range of descendants.',
        },
      },
      {
        word: {
          zh: '祖细胞',
          en: 'progenitor cell',
        },
        meaning: {
          zh: '具有一定分化方向且增殖潜力受限制的前体细胞。',
          en: 'A precursor with a more restricted fate and proliferative capacity.',
        },
      },
      {
        word: {
          zh: '组织修复',
          en: 'tissue repair',
        },
        meaning: {
          zh: '恢复受影响组织完整性或功能的多过程反应。',
          en: 'Coordinated processes restoring tissue integrity or function.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '为什么具有相似DNA的细胞能有不同功能？',
          en: 'Why can cells with similar DNA perform different functions?',
        },
        options: [
          {
            zh: '它们表达的基因组合与水平不同',
            en: 'They differ in combinations and levels of gene expression',
          },
          {
            zh: '每次分化都必须更换整套DNA',
            en: 'Every differentiation event must replace the entire genome',
          },
          {
            zh: '蛋白质不影响细胞功能',
            en: 'Proteins do not affect cellular function',
          },
        ],
        correct: 0,
        feedback: {
          zh: '不同信号和调控产生不同蛋白组合，支持结构和功能差异；不需要把共同基因组整体替换。',
          en: 'Signals and regulation produce different protein combinations, supporting structural and functional differences without replacing the genome.',
        },
        revisit: {
          zh: '对照K/M/N/H图：基因列表相同，ON/low不同。',
          en: 'Compare the K/M/N/H diagram: shared gene list, different ON/low pattern.',
        },
        id: 'L076-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '哪项正确描述组织中细胞的分裂？',
          en: 'Which statement about division in tissues is correct?',
        },
        options: [
          {
            zh: '所有成熟细胞以相同速度分裂',
            en: 'All mature cells divide at the same rate',
          },
          {
            zh: '成熟表面角质细胞不断自行分裂',
            en: 'Fully mature surface keratinocytes continually divide themselves',
          },
          {
            zh: '某些干/祖细胞可分裂补充细胞，许多成熟细胞不分裂',
            en: 'Some stem/progenitor cells divide to replace cells; many mature cells do not',
          },
        ],
        correct: 2,
        feedback: {
          zh: '表皮补充依赖基底层增殖细胞；终末分化表面细胞不因此获得分裂能力。',
          en: 'Epidermal replacement depends on proliferating basal cells; terminal surface cells do not gain division ability.',
        },
        revisit: {
          zh: '回看Explain第二段的基底细胞与表面细胞。',
          en: 'Revisit basal versus surface cells in Explain paragraph two.',
        },
        id: 'L076-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '模型保留相同DNA，只关闭合适祖细胞来源后补充受限，支持什么？',
          en: 'The model retains DNA but limits replacement when suitable progenitors are absent. What does this support?',
        },
        options: [
          {
            zh: '有DNA就足以保证组织完全再生',
            en: 'Having DNA guarantees complete tissue regeneration',
          },
          {
            zh: '细胞来源也是修复的条件，DNA存在本身不足够',
            en: 'Cell supply is one repair condition; DNA presence alone is insufficient',
          },
          {
            zh: '所有组织添加任意干细胞都能完全修复',
            en: 'Any stem cell added to any tissue ensures complete repair',
          },
        ],
        correct: 1,
        feedback: {
          zh: '补充需要合适来源、信号与环境；模型不是普遍治疗证据，也不表明成体神经元通常可再生。',
          en: 'Replacement needs suitable sources, signals and environment. This is neither treatment evidence nor a claim of general adult neuronal regeneration.',
        },
        revisit: {
          zh: '保持细胞类型不变，比较有/无合适祖细胞，再读模型边界。',
          en: 'Hold cell type constant, compare progenitor availability and read the limits.',
        },
        id: 'L076-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'gene expression指什么？',
          en: 'What does gene expression mean?',
        },
        options: [
          {
            zh: '把所有基因平均分给两个子细胞',
            en: 'Dividing all genes equally between daughters',
          },
          {
            zh: '利用基因信息产生功能产物',
            en: 'Using gene information to make functional products',
          },
          {
            zh: '把不表达的基因从DNA中全部剪去',
            en: 'Cutting every unexpressed gene out of DNA',
          },
        ],
        correct: 1,
        feedback: {
          zh: '表达是信息的使用，不是遗传信息的分配或普遍删除。',
          en: 'Expression is use of information, not its distribution or general deletion.',
        },
        revisit: {
          zh: '回看Vocabulary与信号→表达→蛋白质箭头。',
          en: 'Revisit Vocabulary and the signals → expression → proteins arrows.',
        },
        id: 'L076-q4',
      },
    ],
    mission: {
      zh: '用同一组K/M/N/H画两种细胞的表达与蛋白功能图，再列出修复需要的三个条件与一项模型不能证明的结论。只用屏幕和纸笔。',
      en: 'Use the same K/M/N/H genes to map expression and protein functions in two cell types. List three repair conditions and one conclusion the model cannot establish. Use screen or paper only.',
    },
    reference: {
      title: 'OpenStax — Cell cycle and mitosis',
      url: 'https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle',
    },
  },
  {
    id: 'L077',
    title: {
      zh: '化学反应为什么需要酶？',
      en: 'Why enzymes matter',
    },
    hook: {
      zh: '同样的反应物和产物，加入少量酶后反应更快，难道酶向反应“灌进”了额外能量？',
      en: 'The same reactants become the same products faster after adding a little enzyme. Has the enzyme poured extra energy into the reaction?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '化学反应为什么需要酶？',
      en: 'Why enzymes matter',
    },
    objectives: [
      {
        zh: '用活化能解释酶如何改变反应速度。',
        en: 'Explain enzyme action through activation energy.',
      },
      {
        zh: '在能量图上区分能垒与反应物、产物能量差。',
        en: 'Distinguish the barrier from the reactant–product energy difference.',
      },
      {
        zh: '说明酶不改变平衡位置，且净反应不消耗酶。',
        en: 'Explain unchanged equilibrium position and catalyst reuse.',
      },
    ],
    prediction: [
      {
        zh: '酶降低能垒，但不改变反应物与产物的能量差',
        en: 'An enzyme lowers the barrier without changing the energy difference',
      },
      {
        zh: '酶把产物能量降得更低，所以平衡移动',
        en: 'An enzyme lowers product energy and shifts equilibrium',
      },
      {
        zh: '每生成一份产物就永久消耗一份酶',
        en: 'Each product permanently consumes one enzyme',
      },
    ],
    terms: [
      {
        word: {
          zh: '酶',
          en: 'enzyme',
        },
        meaning: {
          zh: '催化特定生化反应、总体不被消耗的分子。',
          en: 'A molecule catalysing particular biochemical reactions without overall consumption.',
        },
      },
      {
        word: {
          zh: '催化剂',
          en: 'catalyst',
        },
        meaning: {
          zh: '改变反应路径、加快反应而总体被再生的物质。',
          en: 'A substance that provides a faster reaction pathway and is regenerated overall.',
        },
      },
      {
        word: {
          zh: '活化能',
          en: 'activation energy',
        },
        meaning: {
          zh: '反应达到过渡态所需克服的能量障碍。',
          en: 'Energy barrier to reaching the transition state.',
        },
      },
      {
        word: {
          zh: '过渡态',
          en: 'transition state',
        },
        meaning: {
          zh: '反应路径上能量较高的短暂构型。',
          en: 'A short-lived high-energy configuration along a reaction pathway.',
        },
      },
      {
        word: {
          zh: '自由能变化',
          en: 'free-energy change',
        },
        meaning: {
          zh: '产物与反应物的自由能差，记作ΔG。',
          en: 'Difference in free energy between products and reactants, written ΔG.',
        },
      },
      {
        word: {
          zh: '动态平衡',
          en: 'dynamic equilibrium',
        },
        meaning: {
          zh: '正逆过程速率相等、宏观组成稳定的状态。',
          en: 'A state of equal forward and reverse rates with stable overall composition.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '酶主要怎样加快反应？',
          en: 'How does an enzyme principally accelerate a reaction?',
        },
        options: [
          {
            zh: '让反应物最终变成不同产物以避开原反应',
            en: 'Replace the original products with different ones',
          },
          {
            zh: '提供活化能较低的反应路径',
            en: 'Provide a pathway with lower activation energy',
          },
          {
            zh: '使产物与反应物的能量差总变为零',
            en: 'Make the reactant–product energy difference always zero',
          },
        ],
        correct: 1,
        feedback: {
          zh: '酶可稳定过渡态并安排适合的化学环境，降低能垒；不是改写同一反应的端点。',
          en: 'Enzymes can stabilise transition states and arrange suitable chemistry, lowering a barrier without rewriting the reaction endpoints.',
        },
        revisit: {
          zh: '对照Explore的蓝色低峰与红色高峰。',
          en: 'Compare the lower blue and higher red peaks in Explore.',
        },
        id: 'L077-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '对同一可逆反应加入酶，哪项正确？',
          en: 'What is correct when an enzyme is added to the same reversible reaction?',
        },
        options: [
          {
            zh: '平衡位置不因催化而改变，但可更快接近平衡',
            en: 'Catalysis leaves equilibrium position unchanged but can speed its approach',
          },
          {
            zh: '平衡必定完全移向产物',
            en: 'Equilibrium must shift completely towards products',
          },
          {
            zh: '酶是产物的永久组成部分',
            en: 'The enzyme is a permanent product component',
          },
        ],
        correct: 0,
        feedback: {
          zh: '酶促进正逆反应接近平衡，不改变平衡常数；净反应中酶被再生。',
          en: 'An enzyme accelerates approach to equilibrium without changing its equilibrium constant and is regenerated overall.',
        },
        revisit: {
          zh: '回看Explain第三段，分清速度与最终比例。',
          en: 'Revisit Explain paragraph three: speed versus final proportions.',
        },
        id: 'L077-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '无酶与有酶图中反应物20、产物5，峰分别90、45，哪组计算正确？',
          en: 'Reactants are 20 and products 5; peaks are 90 without and 45 with enzyme. Which calculation is correct?',
        },
        options: [
          {
            zh: '活化能90→45，ΔG=+15',
            en: 'Activation energy 90→45, ΔG=+15',
          },
          {
            zh: '活化能70→25，ΔG均为−15',
            en: 'Activation energy 70→25, ΔG remains −15',
          },
          {
            zh: '活化能70→25，ΔG由−15变−40',
            en: 'Activation energy 70→25, ΔG changes from −15 to −40',
          },
        ],
        correct: 1,
        feedback: {
          zh: '能垒从反应物水平起算：90−20=70，45−20=25；ΔG=5−20=−15。',
          en: 'Barriers are measured from reactants: 90−20=70 and 45−20=25; ΔG=5−20=−15.',
        },
        revisit: {
          zh: '在图上分别找起点、峰和终点，再做两种减法。',
          en: 'Locate start, peak and endpoint, then perform the two different subtractions.',
        },
        id: 'L077-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'activation energy是哪一个量？',
          en: 'Which quantity is activation energy?',
        },
        options: [
          {
            zh: '反应物到过渡态的能量障碍',
            en: 'The barrier from reactants to the transition state',
          },
          {
            zh: '细胞储存的全部能量',
            en: 'All energy stored by a cell',
          },
          {
            zh: '产物与反应物的最终数量比',
            en: 'The final product-to-reactant amount ratio',
          },
        ],
        correct: 0,
        feedback: {
          zh: '活化能是路径上的能垒，不是储能总量或平衡比例。',
          en: 'Activation energy is a pathway barrier, not total stored energy or equilibrium proportion.',
        },
        revisit: {
          zh: '回看Vocabulary与能量图的峰相对起点高度。',
          en: 'Revisit Vocabulary and the peak height relative to reactants.',
        },
        id: 'L077-q4',
      },
    ],
    mission: {
      zh: '画有酶/无酶共用起终点的能量图，标两种活化能与相同ΔG，用一句英文区分反应速度与平衡位置。',
      en: 'Draw catalysed and uncatalysed paths with shared endpoints. Label both activation energies and the unchanged ΔG, then distinguish rate from equilibrium position in English.',
    },
    reference: {
      title: 'OpenStax — Enzyme mechanisms',
      url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
    },
  },
  {
    id: 'L078',
    title: {
      zh: '酶与底物如何配合？',
      en: 'Enzyme and substrate',
    },
    hook: {
      zh: '如果酶只是完全不动的一把锁，为什么底物结合后活性部位的形状还会调整？',
      en: 'If an enzyme were a completely rigid lock, why could its active site change shape after a substrate binds?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '酶与底物如何配合？',
      en: 'Enzyme and substrate',
    },
    objectives: [
      {
        zh: '用形状与化学性质解释特异性和诱导契合。',
        en: 'Explain specificity and induced fit using shape and chemistry.',
      },
      {
        zh: '追踪结合、催化、释放，区分底物转换与酶再生。',
        en: 'Trace binding, catalysis and release while distinguishing substrate conversion from enzyme regeneration.',
      },
      {
        zh: '用底物不足与酶饱和限制“加更多就永远更快”的推论。',
        en: 'Use substrate limitation and enzyme saturation to limit claims of unlimited rate increases.',
      },
    ],
    prediction: [
      {
        zh: '只要分子大小相同，任何酶都能催化它',
        en: 'Any enzyme catalyses any same-sized molecule',
      },
      {
        zh: '底物可与合适活性部位相互作用，引起适当调整',
        en: 'A suitable substrate interacts with an active site and promotes adjustment',
      },
      {
        zh: '底物越多，每个酶每秒就必定无限加快',
        en: 'More substrate makes each enzyme work infinitely faster',
      },
    ],
    terms: [
      {
        word: {
          zh: '底物',
          en: 'substrate',
        },
        meaning: {
          zh: '由酶作用并转变的反应物。',
          en: 'A reactant acted on and converted by an enzyme.',
        },
      },
      {
        word: {
          zh: '活性部位',
          en: 'active site',
        },
        meaning: {
          zh: '酶中参与底物结合与催化的区域。',
          en: 'Enzyme region involved in substrate binding and catalysis.',
        },
      },
      {
        word: {
          zh: '特异性',
          en: 'specificity',
        },
        meaning: {
          zh: '酶对一定底物与反应的选择性。',
          en: 'Selectivity for particular substrates and reactions.',
        },
      },
      {
        word: {
          zh: '诱导契合',
          en: 'induced fit',
        },
        meaning: {
          zh: '结合引起酶与底物适合催化的构象调整。',
          en: 'Binding-associated conformational adjustment favouring catalysis.',
        },
      },
      {
        word: {
          zh: '酶—底物复合物',
          en: 'enzyme–substrate complex',
        },
        meaning: {
          zh: '酶与底物暂时结合形成的状态。',
          en: 'Temporary association between enzyme and substrate.',
        },
      },
      {
        word: {
          zh: '饱和',
          en: 'saturation',
        },
        meaning: {
          zh: '多数活性部位持续被占用，增加底物收益趋小。',
          en: 'Most sites remain occupied, limiting further gains from extra substrate.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '诱导契合强调什么？',
          en: 'What does induced fit emphasise?',
        },
        options: [
          {
            zh: '酶完全刚性，任何结合都不改变形状',
            en: 'Enzymes are perfectly rigid and binding changes no shape',
          },
          {
            zh: '适当结合伴随构象调整，有助催化',
            en: 'Suitable binding is accompanied by conformational adjustment supporting catalysis',
          },
          {
            zh: '酶一旦结合就永久失去活性',
            en: 'Binding permanently destroys enzyme activity',
          },
        ],
        correct: 1,
        feedback: {
          zh: '结合可调整活性部位与底物的位置和化学环境；不是永久消耗酶。',
          en: 'Binding can adjust active-site geometry and chemistry without consuming the enzyme permanently.',
        },
        revisit: {
          zh: '逐步比较相遇与结合两帧的活性部位。',
          en: 'Compare encounter and binding frames at the active site.',
        },
        id: 'L078-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '酶E不能催化模型底物B，最合理的解释是什么？',
          en: 'Why does enzyme E fail to catalyse model substrate B?',
        },
        options: [
          {
            zh: 'E与B的结合或化学条件不适合这个反应',
            en: 'E and B lack suitable binding or chemistry for this reaction',
          },
          {
            zh: 'B不可能被任何其他酶作用',
            en: 'No other enzyme could ever act on B',
          },
          {
            zh: '只要把B加足够多，E必定催化它',
            en: 'Enough B must make E catalyse it',
          },
        ],
        correct: 0,
        feedback: {
          zh: '特异性针对选定酶和反应；不能由E不作用推出所有酶都不作用。',
          en: 'Specificity concerns the selected enzyme and reaction; E’s failure does not exclude every other enzyme.',
        },
        revisit: {
          zh: '保持E不变，比较A与B，再读图后说明。',
          en: 'Keep E fixed, compare A with B and read the caption.',
        },
        id: 'L078-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '固定1个酶、初始4单位底物，完成一次模型催化循环后是什么？',
          en: 'With 1 enzyme and 4 substrate units, what remains after one model turnover?',
        },
        options: [
          {
            zh: '3底物、1产物、1酶',
            en: '3 substrate, 1 product, 1 enzyme',
          },
          {
            zh: '3底物、1产物、0酶',
            en: '3 substrate, 1 product, 0 enzyme',
          },
          {
            zh: '4底物、1产物、1酶',
            en: '4 substrate, 1 product, 1 enzyme',
          },
        ],
        correct: 0,
        feedback: {
          zh: '一单位底物转换，酶再生；底物与产物的单位总数守恒。单位是转换记账，不表示真实反应一定1分子变1分子。',
          en: 'One substrate unit converts and enzyme is regenerated. Units conserve conversion accounting, not a universal one-molecule-to-one-molecule stoichiometry.',
        },
        revisit: {
          zh: '将底物设4并到释放帧，读下方库存。',
          en: 'Set substrate to 4 and step to release; read the inventory.',
        },
        id: 'L078-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'substrate是指什么？',
          en: 'What is a substrate?',
        },
        options: [
          {
            zh: '催化后总体再生的酶',
            en: 'The enzyme regenerated after catalysis',
          },
          {
            zh: '由酶作用的反应物',
            en: 'A reactant acted on by the enzyme',
          },
          {
            zh: '任何反应的最终产物',
            en: 'The final product of every reaction',
          },
        ],
        correct: 1,
        feedback: {
          zh: '底物是本次酶促反应的反应物；产物在其他反应中也可能成为底物。',
          en: 'A substrate is a reactant in the selected enzyme reaction; a product may become a substrate in another reaction.',
        },
        revisit: {
          zh: '回看Vocabulary并沿底物→产物箭头指认。',
          en: 'Revisit Vocabulary and identify the substrate → product arrow.',
        },
        id: 'L078-q4',
      },
    ],
    mission: {
      zh: '比较A、B和零底物三种情况，逐步记录酶是否保留、产物是否出现，再写诱导契合的一句机制和一条简化边界。',
      en: 'Compare A, B and zero substrate, recording enzyme retention and product appearance at each step. Explain induced fit and one model limitation.',
    },
    reference: {
      title: 'OpenStax — Enzyme mechanisms',
      url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
    },
  },
  {
    id: 'L079',
    title: {
      zh: '温度与pH影响',
      en: 'Temperature and pH',
    },
    hook: {
      zh: '两份酶最后都在40°C检测，一份曾冷藏，一份曾充分加热，为什么活性仍可能不同？',
      en: 'Two enzyme samples are both assayed at 40°C after one was chilled and the other strongly heated. Why might their activities still differ?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '温度与pH影响',
      en: 'Temperature and pH',
    },
    objectives: [
      {
        zh: '控制其他条件读出温度与pH曲线的趋势。',
        en: 'Interpret temperature and pH trends with other conditions controlled.',
      },
      {
        zh: '区分低温减慢与变性，并用回到同温检测作证据。',
        en: 'Distinguish cold slowdown from denaturation using return-to-same-temperature evidence.',
      },
      {
        zh: '说明虚构最适点、任意单位、样品历史与真实数据的边界。',
        en: 'Explain fictional optima, arbitrary units, treatment history and limits of the data.',
      },
    ],
    prediction: [
      {
        zh: '只要最后温度相同，所有处理历史都会被抹去',
        en: 'The same final temperature erases every treatment history',
      },
      {
        zh: '低温减慢与高温损伤可能不同，需要比较恢复',
        en: 'Cold slowdown and heat damage may differ; recovery is evidence',
      },
      {
        zh: '所有酶的最适温度都必定是37°C',
        en: 'Every enzyme must have an optimum of 37°C',
      },
    ],
    terms: [
      {
        word: {
          zh: '初始速率',
          en: 'initial rate',
        },
        meaning: {
          zh: '反应开始不久、底物尚未明显耗尽时的转换速率。',
          en: 'Conversion rate near the start before substantial substrate depletion.',
        },
      },
      {
        word: {
          zh: '最适条件',
          en: 'optimum conditions',
        },
        meaning: {
          zh: '在指定测量方案下产生较高活性的条件。',
          en: 'Conditions giving high activity under a specified assay.',
        },
      },
      {
        word: {
          zh: '变性',
          en: 'denaturation',
        },
        meaning: {
          zh: '分子结构改变，可能导致功能受损。',
          en: 'Structural alteration that may impair molecular function.',
        },
      },
      {
        word: {
          zh: 'pH',
          en: 'pH',
        },
        meaning: {
          zh: '表示溶液酸碱性的对数尺度。',
          en: 'A logarithmic measure of acidity and alkalinity.',
        },
      },
      {
        word: {
          zh: '控制变量',
          en: 'controlled variable',
        },
        meaning: {
          zh: '比较时保持相同以排除其他解释的因素。',
          en: 'A factor held constant to reduce alternative explanations.',
        },
      },
      {
        word: {
          zh: '处理历史',
          en: 'treatment history',
        },
        meaning: {
          zh: '检测之前样品经历过的条件与时长。',
          en: 'Conditions and durations experienced before an assay.',
        },
      },
      {
        word: {
          zh: '可逆性',
          en: 'reversibility',
        },
        meaning: {
          zh: '恢复条件后某种变化能够恢复的性质。',
          en: 'Capacity for a change to reverse when conditions are restored.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '本虚构酶E在40°C附近较快，能推出什么？',
          en: 'What follows from fictional enzyme E being faster near 40°C?',
        },
        options: [
          {
            zh: '所有生物的酶都最适于40°C',
            en: 'All enzymes in all organisms work best at 40°C',
          },
          {
            zh: '仅说明E在本模型与检测条件下的趋势',
            en: 'Only E’s trend under this model and assay conditions',
          },
          {
            zh: '任何温度高于40°C都会使所有酶立即全失活',
            en: 'Every enzyme instantly loses all activity above 40°C',
          },
        ],
        correct: 1,
        feedback: {
          zh: '最适点依赖酶种类、条件和测量方案；模型40°C不是通用生物常数。',
          en: 'Optima depend on enzyme, conditions and assay; model 40°C is not a universal constant.',
        },
        revisit: {
          zh: '回看曲线标题、固定条件与model optimum说明。',
          en: 'Revisit the graph title, fixed conditions and model-optimum caption.',
        },
        id: 'L079-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '为什么冷藏后回温可以恢复本模型活性？',
          en: 'Why does rewarming restore this model’s chilled enzyme activity?',
        },
        options: [
          {
            zh: '模型假设冷藏主要减慢分子过程，结构仍保持',
            en: 'Chilling is assumed mainly to slow molecular processes while preserving structure',
          },
          {
            zh: '冷藏已把所有酶分子完全水解',
            en: 'Chilling completely hydrolysed every enzyme molecule',
          },
          {
            zh: '回温会自动重新合成任意损伤的酶',
            en: 'Rewarming automatically synthesises any damaged enzyme',
          },
        ],
        correct: 0,
        feedback: {
          zh: '冷减慢与结构损伤不同；此处特意假设冷藏样品结构完好，不能泛化所有冻融过程。',
          en: 'Cold slowdown differs from structural damage; intact chilled samples are an explicit assumption, not a claim about every freeze–thaw process.',
        },
        revisit: {
          zh: '读冷藏→40°C对照行，并与热处理行比较。',
          en: 'Read the chilled →40°C row and compare the heat-treated row.',
        },
        id: 'L079-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '冷藏与热处理样品都回到40°C、pH7检测，速率约80和6.4，支持什么？',
          en: 'Chilled and heat-treated samples are assayed at 40°C,pH7 with rates about80 and6.4. What is supported?',
        },
        options: [
          {
            zh: '当前温度差解释全部差异',
            en: 'A current temperature difference explains everything',
          },
          {
            zh: '这个热处理历史留下持续失活；应控制酶量、底物和检测时长',
            en: 'This heat history leaves persistent inactivation; control enzyme amount, substrate and assay duration',
          },
          {
            zh: '低速证明热样品完全没有任何酶分子',
            en: 'The low rate proves the heated sample has no enzyme molecules',
          },
        ],
        correct: 1,
        feedback: {
          zh: '检测温度相同排除了该温差解释；残余6.4而非0，符合模型92%失活假设，并非全部分子消失。',
          en: 'Equal assay temperatures remove that temperature difference; residual6.4 rather than0 fits assumed92% inactivation, not disappearance of all molecules.',
        },
        revisit: {
          zh: '在表中读两行40°C结果，核对相同pH、酶量和底物。',
          en: 'Read both40°C results and check matched pH, enzyme amount and substrate.',
        },
        id: 'L079-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'controlled variable是哪一项？',
          en: 'Which is a controlled variable?',
        },
        options: [
          {
            zh: '温度曲线中固定为7的pH',
            en: 'pH fixed at7 in the temperature comparison',
          },
          {
            zh: '每次刻意改变的温度',
            en: 'The temperature deliberately varied each time',
          },
          {
            zh: '图中得到的速率结果',
            en: 'The resulting rate measured on the graph',
          },
        ],
        correct: 0,
        feedback: {
          zh: '控制变量是保持不变的条件；主动改变的是自变量，得到的速率是因变量。',
          en: 'A controlled variable stays constant; deliberately varied temperature is independent and resulting rate is dependent.',
        },
        revisit: {
          zh: '回看Explore固定条件与Vocabulary。',
          en: 'Revisit fixed conditions in Explore and Vocabulary.',
        },
        id: 'L079-q4',
      },
    ],
    mission: {
      zh: '记录5、40、75°C新鲜样品速率，再比较冷藏/热处理后同在40°C的恢复。写轴单位、控制变量、机制、反例与一个未模拟因素。',
      en: 'Record fresh-sample rates at5,40,75°C, then compare recovery after chilling versus heating, both assayed at40°C. State axis units, controls, mechanism, a counterexample and an omitted factor.',
    },
    reference: {
      title: 'OpenStax — Enzyme mechanisms',
      url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
    },
  },
  {
    id: 'L080',
    title: {
      zh: '消化中的酶',
      en: 'Enzymes in digestion',
    },
    hook: {
      zh: '胆汁能把一大滴脂肪分成许多小滴，为什么还需要脂肪酶？淀粉酶是否一步就把淀粉全变成葡萄糖？',
      en: 'Bile can disperse a large fat droplet into small droplets. Why is lipase still needed, and does amylase turn starch directly and completely into glucose?',
    },
    minutes: 30,
    icon: '◈',
    summary: {
      zh: '消化中的酶',
      en: 'Enzymes in digestion',
    },
    objectives: [
      {
        zh: '将淀粉、蛋白质与脂肪匹配到酶及准确产物路线。',
        en: 'Match starch, proteins and fats to enzymes and accurate product routes.',
      },
      {
        zh: '区分胆汁乳化、酶水解与吸收。',
        en: 'Distinguish bile emulsification, enzymatic hydrolysis and absorption.',
      },
      {
        zh: '用匹配与不匹配对照解释消化为何需要多种作用。',
        en: 'Use matching and mismatching controls to explain the need for multiple digestive processes.',
      },
    ],
    prediction: [
      {
        zh: '胆汁像脂肪酶一样直接水解甘油三酯',
        en: 'Bile hydrolyses triglycerides like lipase',
      },
      {
        zh: '淀粉酶可独自完成所有淀粉到葡萄糖步骤',
        en: 'Amylase alone completes every starch-to-glucose step',
      },
      {
        zh: '乳化增加界面，化学消化仍需要合适酶',
        en: 'Emulsification increases interface; chemical digestion still needs suitable enzymes',
      },
    ],
    terms: [
      {
        word: {
          zh: '消化',
          en: 'digestion',
        },
        meaning: {
          zh: '将食物机械处理并化学分解为较小组分。',
          en: 'Mechanical processing and chemical breakdown of food into smaller components.',
        },
      },
      {
        word: {
          zh: '水解',
          en: 'hydrolysis',
        },
        meaning: {
          zh: '借助水参与断开化学键的反应。',
          en: 'Bond cleavage involving water.',
        },
      },
      {
        word: {
          zh: '淀粉酶',
          en: 'amylase',
        },
        meaning: {
          zh: '催化淀粉形成麦芽糖与较短寡糖的酶。',
          en: 'An enzyme converting starch into maltose and shorter oligosaccharides.',
        },
      },
      {
        word: {
          zh: '蛋白酶',
          en: 'protease',
        },
        meaning: {
          zh: '催化蛋白质或肽中肽键水解的酶。',
          en: 'An enzyme hydrolysing peptide bonds in proteins or peptides.',
        },
      },
      {
        word: {
          zh: '脂肪酶',
          en: 'lipase',
        },
        meaning: {
          zh: '催化脂质水解的酶，此处指小肠胰脂肪酶路线。',
          en: 'An enzyme catalysing lipid hydrolysis; here the intestinal pancreatic route.',
        },
      },
      {
        word: {
          zh: '乳化',
          en: 'emulsification',
        },
        meaning: {
          zh: '把脂肪分散成较小液滴而非断开分子化学键。',
          en: 'Dispersion into smaller fat droplets without breaking molecular bonds.',
        },
      },
      {
        word: {
          zh: '吸收',
          en: 'absorption',
        },
        meaning: {
          zh: '消化产物等跨消化道上皮进入体内运输系统。',
          en: 'Transfer of digested nutrients and other substances across gut epithelium into internal transport.',
        },
      },
    ],
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '本课淀粉消化路线哪项准确？',
          en: 'Which starch-digestion route is accurate here?',
        },
        options: [
          {
            zh: '淀粉→淀粉酶→麦芽糖/较短寡糖→其他酶→葡萄糖',
            en: 'Starch→amylase→maltose/shorter oligosaccharides→other enzymes→glucose',
          },
          {
            zh: '淀粉→淀粉酶→直接只有氨基酸',
            en: 'Starch→amylase→only amino acids directly',
          },
          {
            zh: '淀粉→胆汁→直接只有葡萄糖',
            en: 'Starch→bile→only glucose directly',
          },
        ],
        correct: 0,
        feedback: {
          zh: '淀粉酶开始特定糖苷键水解，还需小肠其他酶完成单糖形成；氨基酸来自蛋白路线。',
          en: 'Amylase begins selected glycosidic-bond hydrolysis; other intestinal enzymes complete monosaccharide formation. Amino acids belong to the protein route.',
        },
        revisit: {
          zh: '在Explore选择淀粉+淀粉酶，读后续产物图注。',
          en: 'Choose starch+amylase and read the later-product caption.',
        },
        id: 'L080-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '胆汁乳化与脂肪酶作用有什么区别？',
          en: 'How does bile emulsification differ from lipase action?',
        },
        options: [
          {
            zh: '胆汁和脂肪酶都是同一种酶',
            en: 'Bile and lipase are the same enzyme',
          },
          {
            zh: '胆汁改变液滴分散状态，脂肪酶催化化学键水解',
            en: 'Bile changes droplet dispersion; lipase catalyses bond hydrolysis',
          },
          {
            zh: '脂肪酶只把大液滴物理打散',
            en: 'Lipase only physically disperses large droplets',
          },
        ],
        correct: 1,
        feedback: {
          zh: '小液滴增加酶可接触界面，但分子仍是甘油三酯；胰脂肪酶主要产生脂肪酸与单甘油酯。',
          en: 'Smaller droplets increase accessible interface while molecules remain triglycerides; pancreatic lipase mainly yields fatty acids and monoglycerides.',
        },
        revisit: {
          zh: '保持甘油三酯，比较胆汁与脂肪酶两种条件。',
          en: 'Keep triglyceride fixed and compare bile with lipase.',
        },
        id: 'L080-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '蛋白质+淀粉酶在本路线不转换，换蛋白酶后形成肽，支持什么？',
          en: 'Protein+amylase shows no conversion, while protease yields peptides. What does this support?',
        },
        options: [
          {
            zh: '只要液体混合，所有食物就会产生同样产物',
            en: 'Mixing liquids makes every food yield identical products',
          },
          {
            zh: '所选酶和底物的特异性重要，还需后续肽酶等',
            en: 'Enzyme–substrate specificity matters, with further peptidases needed',
          },
          {
            zh: '这证明任何蛋白质都不能消化',
            en: 'This proves no protein can ever be digested',
          },
        ],
        correct: 1,
        feedback: {
          zh: '保持底物只换酶，是针对特异性的对照；蛋白酶所得肽仍可能需进一步水解为氨基酸。',
          en: 'Changing only enzyme for a fixed substrate tests specificity; resulting peptides may still need further hydrolysis to amino acids.',
        },
        revisit: {
          zh: '比较蛋白质下淀粉酶与蛋白酶，并读进一步路线。',
          en: 'Compare amylase and protease with protein, then read the onward route.',
        },
        id: 'L080-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'absorption与digestion的区别是什么？',
          en: 'How does absorption differ from digestion?',
        },
        options: [
          {
            zh: '吸收指跨上皮进入体内运输，消化指食物处理与分解',
            en: 'Absorption crosses epithelium into internal transport; digestion processes and breaks down food',
          },
          {
            zh: '吸收专指牙齿咀嚼',
            en: 'Absorption means only chewing',
          },
          {
            zh: '两者都只指将脂肪打成液滴',
            en: 'Both mean only dispersing fat into droplets',
          },
        ],
        correct: 0,
        feedback: {
          zh: '生成较小产物不等于已经进入血液或淋巴；还需要跨上皮运输等过程。',
          en: 'Making smaller products does not mean they have entered blood or lymph; epithelial transfer is another process.',
        },
        revisit: {
          zh: '回看Explain最后一段和Vocabulary的吸收。',
          en: 'Revisit Explain’s final paragraph and absorption in Vocabulary.',
        },
        id: 'L080-q4',
      },
    ],
    mission: {
      zh: '画三条底物→酶→中间产物→后续产物路线，把胆汁用不同箭头连接脂肪界面。用一次不匹配对照写证据，并说明消化与吸收不同。',
      en: 'Draw three substrate→enzyme→intermediate→later-product routes, adding a distinct bile arrow to fat interface. Cite a mismatch comparison and distinguish digestion from absorption.',
    },
    reference: {
      title: 'OpenStax — Enzyme mechanisms',
      url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
    },
  },
];
