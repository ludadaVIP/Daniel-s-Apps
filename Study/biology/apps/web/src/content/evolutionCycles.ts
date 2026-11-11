import type { Lesson } from '../schema';
/** Original bilingual pilot; conditional datasets are not real observations. */
export const evolutionCycleLessons: Lesson[] = [
  {
    id: 'L089',
    title: {
      zh: '变异从哪里来？',
      en: 'Sources of variation',
    },
    hook: {
      zh: '一群虚构甲虫只有A与a。重新配对能凭空产生第三种等位基因吗？皮肤细胞出现变化又意味着什么？',
      en: 'Fictional beetles carry only A and a. Can reshuffling create a third allele? What if a change occurs in a skin cell?',
    },
    prediction: [
      {
        zh: '重组能改变组合，但不必创造新等位基因',
        en: 'Recombination changes combinations without necessarily creating new alleles',
      },
      {
        zh: '有需要时才会发生有利突变',
        en: 'Useful mutations occur only when needed',
      },
      {
        zh: '任何细胞突变都会传给后代',
        en: 'Every cell mutation reaches offspring',
      },
    ],
    objectives: [
      {
        zh: '区分突变产生新等位基因与重组重新排列已有等位基因。',
        en: 'Distinguish new alleles from reshuffled existing alleles.',
      },
      {
        zh: '联系生殖细胞谱系与后代，限定可遗传变异。',
        en: 'Connect reproductive lineages to offspring and qualify heritability.',
      },
      {
        zh: '解释变异不按生物的需要定向发生。',
        en: 'Explain why variation is not directed by an organism’s needs.',
      },
    ],
    terms: [
      {
        word: {
          zh: '突变',
          en: 'mutation',
        },
        meaning: {
          zh: 'DNA序列的改变。',
          en: 'A change in DNA sequence.',
        },
      },
      {
        word: {
          zh: '等位基因',
          en: 'allele',
        },
        meaning: {
          zh: '同一基因位置的不同版本。',
          en: 'A version at a gene locus.',
        },
      },
      {
        word: {
          zh: '重组',
          en: 'recombination',
        },
        meaning: {
          zh: '已有遗传信息形成新的组合。',
          en: 'Existing genetic information forms new combinations.',
        },
      },
      {
        word: {
          zh: '可遗传',
          en: 'heritable',
        },
        meaning: {
          zh: '可通过繁殖传给后代。',
          en: 'Capable of transmission through reproduction.',
        },
      },
      {
        word: {
          zh: '生殖细胞系',
          en: 'germline',
        },
        meaning: {
          zh: '通向配子及后代的细胞谱系。',
          en: 'Cell lineage leading to gametes and offspring.',
        },
      },
      {
        word: {
          zh: '体细胞',
          en: 'somatic cell',
        },
        meaning: {
          zh: '动物体内通常不形成配子的细胞。',
          en: 'Animal body cell not ordinarily forming gametes.',
        },
      },
    ],
    mission: {
      zh: '用AB/ab卡片各画一条突变和重组路径，再标出动物生殖细胞与皮肤细胞的遗传边界。',
      en: 'Draw mutation and recombination routes from AB/ab cards, then mark inheritance boundaries for animal reproductive and skin cells.',
    },
    questions: [
      {
        id: 'L089-q1',
        skill: 'concept',
        prompt: {
          zh: '只把AB/ab重组为Ab/aB，增加了什么？',
          en: 'What increases when AB/ab becomes Ab/aB?',
        },
        options: [
          {
            zh: '新等位基因',
            en: 'New alleles',
          },
          {
            zh: '已有等位基因的组合',
            en: 'Combinations of existing alleles',
          },
          {
            zh: '每个位置的版本数一定翻倍',
            en: 'Versions at each locus necessarily double',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'A/a、B/b仍是原有版本；改变组合不等于创造序列。',
          en: 'A/a and B/b remain the existing versions; changing combinations does not create sequence.',
        },
        revisit: {
          zh: '回看重组路径的四组字母。',
          en: 'Revisit the four letter combinations on the recombination route.',
        },
      },
      {
        id: 'L089-q2',
        skill: 'concept',
        prompt: {
          zh: '本课动物皮肤细胞发生突变，通常怎样？',
          en: 'What ordinarily follows a mutation confined to an animal skin cell?',
        },
        options: [
          {
            zh: '必传给所有后代',
            en: 'It reaches all offspring',
          },
          {
            zh: '必定没有任何影响',
            en: 'It cannot affect anything',
          },
          {
            zh: '可影响个体，通常不经配子遗传',
            en: 'It may affect the individual but ordinarily is not inherited through gametes',
          },
        ],
        correct: 2,
        feedback: {
          zh: '细胞的位置和传递谱系决定遗传可能性；突变也可能影响个体。',
          en: 'Cell lineage determines transmission possibilities; a somatic change can still affect the individual.',
        },
        revisit: {
          zh: '回看皮肤与生殖细胞路径。',
          en: 'Revisit skin versus reproductive lineages.',
        },
      },
      {
        id: 'L089-q3',
        skill: 'reasoning',
        prompt: {
          zh: '干旱前已有耐旱版本，干旱后其比例升高，支持什么？',
          en: 'A drought-tolerant variant exists before drought and rises afterwards. What follows?',
        },
        options: [
          {
            zh: '环境按需要制造了该版本',
            en: 'The environment created the version on demand',
          },
          {
            zh: '已有变异可被筛选；仅此不能判断新突变率',
            en: 'Existing variation can be selected; this alone does not determine mutation rate',
          },
          {
            zh: '所有差异都不能遗传',
            en: 'No differences can be inherited',
          },
        ],
        correct: 1,
        feedback: {
          zh: '先存在的版本无需由干旱定向创造，比例变化与新序列来源应分开。',
          en: 'A pre-existing version need not be created on demand; frequency change and sequence origins are separate questions.',
        },
        revisit: {
          zh: '重读Explain首段的“发生率”与“指定结果”。',
          en: 'Revisit mutation rate versus specified outcome in Explain.',
        },
      },
      {
        id: 'L089-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'heritable最准确表示什么？',
          en: 'What does heritable mean?',
        },
        options: [
          {
            zh: '能通过繁殖传给后代',
            en: 'Can pass through reproduction to offspring',
          },
          {
            zh: '一定有利',
            en: 'Always beneficial',
          },
          {
            zh: '出生后永不变化',
            en: 'Never changes after birth',
          },
        ],
        correct: 0,
        feedback: {
          zh: '可遗传描述传递能力，不保证有利，也不保证每个后代都得到。',
          en: 'Heritable concerns transmission, not benefit or guaranteed receipt by every offspring.',
        },
        revisit: {
          zh: '回看词汇“可遗传”。',
          en: 'Revisit heritable in Vocabulary.',
        },
      },
    ],
    minutes: 30,
    icon: '⑂',
    summary: {
      zh: '一群虚构甲虫只有A与a。重新配对能凭空产生第三种等位基因吗？皮肤细胞出现变化又意味着什么？',
      en: 'Fictional beetles carry only A and a. Can reshuffling create a third allele? What if a change occurs in a skin cell?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/19-1-population-evolution',
    },
  },
  {
    id: 'L090',
    title: {
      zh: '自然选择怎样发生？',
      en: 'Natural selection',
    },
    hook: {
      zh: '虚构微生物A、B各占一半。A每代贡献的后代是B的两倍，三代后比例还是一半吗？',
      en: 'Fictional microbes A and B start equally common. A contributes twice as many offspring per generation. Will the proportions remain equal?',
    },
    prediction: [
      {
        zh: '三代后A比例8/9，条件反转可改变方向',
        en: 'A reaches 8/9 after three generations; reversing conditions can reverse the direction',
      },
      {
        zh: '每个B努力变成A',
        en: 'Each B tries to become A',
      },
      {
        zh: '更强壮的个体在所有环境都最适合',
        en: 'The strongest individual is best in every environment',
      },
    ],
    objectives: [
      {
        zh: '用可遗传差异与后代贡献解释跨代比例变化。',
        en: 'Explain generational frequency change using inherited differences and offspring contributions.',
      },
      {
        zh: '计算归一化后代比例并比较环境反转。',
        en: 'Normalize offspring contributions and compare reversed conditions.',
      },
      {
        zh: '限定适合度与简化模型的适用范围。',
        en: 'Qualify fitness and the scope of a simplified model.',
      },
    ],
    terms: [
      {
        word: {
          zh: '自然选择',
          en: 'natural selection',
        },
        meaning: {
          zh: '可遗传差异导致不同繁殖贡献的过程。',
          en: 'Differential reproductive contributions associated with heritable differences.',
        },
      },
      {
        word: {
          zh: '适合度',
          en: 'fitness',
        },
        meaning: {
          zh: '特定环境中相对繁殖成功。',
          en: 'Relative reproductive success in a specified environment.',
        },
      },
      {
        word: {
          zh: '频率',
          en: 'frequency',
        },
        meaning: {
          zh: '某类型占总数的比例。',
          en: 'Proportion belonging to a type.',
        },
      },
      {
        word: {
          zh: '世代',
          en: 'generation',
        },
        meaning: {
          zh: '亲代到后代的一轮。',
          en: 'One parent-to-offspring round.',
        },
      },
      {
        word: {
          zh: '选择压力',
          en: 'selection pressure',
        },
        meaning: {
          zh: '影响相对存活繁殖的环境因素。',
          en: 'Environmental influence on relative survival and reproduction.',
        },
      },
      {
        word: {
          zh: '权衡',
          en: 'trade-off',
        },
        meaning: {
          zh: '一种条件下的益处可能伴随其他代价。',
          en: 'A benefit can carry costs under other conditions.',
        },
      },
    ],
    mission: {
      zh: '保留三代A/B比例、初始条件和贡献规则，再反转环境；写出证据支持的主张及模型缺失的一个因素。',
      en: 'Record three generations, initial proportions and contribution rules, then reverse conditions. State a supported claim and one omitted factor.',
    },
    questions: [
      {
        id: 'L090-q1',
        skill: 'concept',
        prompt: {
          zh: '自然选择改变的核心是什么？',
          en: 'What is central to natural selection?',
        },
        options: [
          {
            zh: '个体按需要改变遗传版本',
            en: 'Individuals rewrite variants on demand',
          },
          {
            zh: '有遗传差异的类型对后代贡献不同',
            en: 'Inherited variants contribute different amounts to offspring',
          },
          {
            zh: '所有存活个体繁殖相同',
            en: 'All survivors reproduce equally',
          },
        ],
        correct: 1,
        feedback: {
          zh: '差异必须联系遗传与后代贡献；仅努力或仅存活不够。',
          en: 'Variation must connect to inheritance and offspring contributions; effort or survival alone is insufficient.',
        },
        revisit: {
          zh: '回看选择三代图的亲代与后代。',
          en: 'Revisit parents and offspring across three rounds.',
        },
      },
      {
        id: 'L090-q2',
        skill: 'concept',
        prompt: {
          zh: '若A初始为0且没有突变迁入，A更有利会怎样？',
          en: 'If A is absent and mutation and immigration are excluded, what does an A advantage do?',
        },
        options: [
          {
            zh: 'A仍为0',
            en: 'A remains absent',
          },
          {
            zh: '一代产生50%A',
            en: 'It creates 50% A in one round',
          },
          {
            zh: '所有B自动成为A',
            en: 'Every B automatically becomes A',
          },
        ],
        correct: 0,
        feedback: {
          zh: '选择只能改变已有类型的相对贡献；本模型没有产生A的路径。',
          en: 'Selection changes existing contributions; this model contains no route introducing A.',
        },
        revisit: {
          zh: '把初始A切到0并重播。',
          en: 'Set initial A to zero and replay.',
        },
      },
      {
        id: 'L090-q3',
        skill: 'reasoning',
        prompt: {
          zh: 'A、B各50，贡献率A2/B1，下一代A比例？',
          en: 'A and B start at 50 each; rates are A2/B1. Next A frequency?',
        },
        options: [
          {
            zh: '50%',
            en: '50%',
          },
          {
            zh: '100%',
            en: '100%',
          },
          {
            zh: '100/150≈66.7%',
            en: '100/150≈66.7%',
          },
        ],
        correct: 2,
        feedback: {
          zh: '100份A加50份B共150份，必须以总贡献作分母。',
          en: '100 A plus 50 B make 150; divide by the total contribution.',
        },
        revisit: {
          zh: '回看Explain的归一化算例。',
          en: 'Revisit the normalization calculation in Explain.',
        },
      },
      {
        id: 'L090-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'fitness在本课指什么？',
          en: 'What does fitness mean here?',
        },
        options: [
          {
            zh: '任何环境中的强壮程度',
            en: 'Strength in every environment',
          },
          {
            zh: '特定条件下相对繁殖成功',
            en: 'Relative reproductive success under specified conditions',
          },
          {
            zh: '个体努力学习的程度',
            en: 'How hard an individual learns',
          },
        ],
        correct: 1,
        feedback: {
          zh: '适合度是环境依赖的繁殖比较，不是体格排名。',
          en: 'Fitness compares reproduction in an environment, rather than ranking strength.',
        },
        revisit: {
          zh: '回看权衡与环境反转。',
          en: 'Revisit trade-offs and environment reversal.',
        },
      },
    ],
    minutes: 30,
    icon: '⑂',
    summary: {
      zh: '虚构微生物A、B各占一半。A每代贡献的后代是B的两倍，三代后比例还是一半吗？',
      en: 'Fictional microbes A and B start equally common. A contributes twice as many offspring per generation. Will the proportions remain equal?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/19-1-population-evolution',
    },
  },
  {
    id: 'L091',
    title: {
      zh: '化石与其他演化证据',
      en: 'Evidence for evolution',
    },
    hook: {
      zh: '两种动物都有翅膀，是否就一定是最近的亲属？怎样把岩层、骨骼和DNA放到同一张证据桌？',
      en: 'Two animals have wings. Must they be closest relatives? How can rocks, bones and DNA inform one explanation?',
    },
    prediction: [
      {
        zh: '共同功能一项就能证明最近亲缘',
        en: 'One shared function proves closest ancestry',
      },
      {
        zh: '独立证据一致时更有力，仍须检查限制',
        en: 'Agreement among independent evidence is stronger, with limitations checked',
      },
      {
        zh: '有化石缺口就不能研究历史',
        en: 'A fossil gap makes historical research impossible',
      },
    ],
    objectives: [
      {
        zh: '比较化石、同源结构与分子证据的推理链。',
        en: 'Compare fossil, homologous-structure and molecular reasoning.',
      },
      {
        zh: '区分共同祖先与趋同的解释。',
        en: 'Distinguish shared ancestry from convergence.',
      },
      {
        zh: '用不完整证据表达有边界的结论。',
        en: 'Express bounded conclusions from incomplete evidence.',
      },
    ],
    terms: [
      {
        word: {
          zh: '化石',
          en: 'fossil',
        },
        meaning: {
          zh: '保存下来的古代生物遗存或活动痕迹。',
          en: 'Preserved remains or traces of past organisms.',
        },
      },
      {
        word: {
          zh: '地层',
          en: 'stratum',
        },
        meaning: {
          zh: '沉积形成的岩层。',
          en: 'A sedimentary rock layer.',
        },
      },
      {
        word: {
          zh: '同源结构',
          en: 'homologous structure',
        },
        meaning: {
          zh: '因共同祖先而对应的结构。',
          en: 'Corresponding structures inherited from common ancestry.',
        },
      },
      {
        word: {
          zh: '趋同',
          en: 'convergence',
        },
        meaning: {
          zh: '不同谱系独立形成相似特征。',
          en: 'Independent evolution of similar features.',
        },
      },
      {
        word: {
          zh: '共同祖先',
          en: 'common ancestor',
        },
        meaning: {
          zh: '两个或多个谱系共享的祖先。',
          en: 'An ancestor shared by lineages.',
        },
      },
      {
        word: {
          zh: '分子证据',
          en: 'molecular evidence',
        },
        meaning: {
          zh: '比较DNA或蛋白质等获得的证据。',
          en: 'Evidence from comparisons such as DNA or proteins.',
        },
      },
    ],
    mission: {
      zh: '写三栏证据档案：观察、可支持的解释、不能据此断言的事；至少比较化石与DNA两栏。',
      en: 'Build an evidence file with observation, supported explanation and unsupported claim, including fossils and DNA.',
    },
    questions: [
      {
        id: 'L091-q1',
        skill: 'concept',
        prompt: {
          zh: '无扰动岩层中，通常哪层较早？',
          en: 'In undisturbed sedimentary layers, which is generally older?',
        },
        options: [
          {
            zh: '下层',
            en: 'Lower',
          },
          {
            zh: '上层',
            en: 'Upper',
          },
          {
            zh: '看化石大小决定',
            en: 'Whichever has larger fossils',
          },
        ],
        correct: 0,
        feedback: {
          zh: '沉积先后支持相对顺序，前提是未翻转扰动；大小不是年代尺。',
          en: 'Deposition supports relative order if layers remain undisturbed; size is not a clock.',
        },
        revisit: {
          zh: '回看岩层图的下至上顺序与前提。',
          en: 'Revisit the lower-to-upper ordering and its assumptions.',
        },
      },
      {
        id: 'L091-q2',
        skill: 'concept',
        prompt: {
          zh: '共同具有翅膀能单独证明最近亲缘吗？',
          en: 'Can wings alone prove the closest relationship?',
        },
        options: [
          {
            zh: '能，功能完全决定亲缘',
            en: 'Yes, function determines ancestry',
          },
          {
            zh: '不能，需排查趋同并比较更多特征',
            en: 'No; consider convergence and further characters',
          },
          {
            zh: '不能，因为结构证据完全无用',
            en: 'No, because anatomy is useless',
          },
        ],
        correct: 1,
        feedback: {
          zh: '功能相似可能独立形成；详细同源结构仍有证据价值。',
          en: 'Similar function can evolve independently; detailed homology still provides evidence.',
        },
        revisit: {
          zh: '回看骨骼与趋同解释。',
          en: 'Revisit anatomy and convergence.',
        },
      },
      {
        id: 'L091-q3',
        skill: 'reasoning',
        prompt: {
          zh: '100位点差异AB4、AC18、BC17，最合理结论？',
          en: 'For 100 sites, differences are AB4, AC18, BC17. Best conclusion?',
        },
        options: [
          {
            zh: 'A与B必在四年前分开',
            en: 'A and B split exactly four years ago',
          },
          {
            zh: 'A与C一定无共同祖先',
            en: 'A and C have no common ancestor',
          },
          {
            zh: '在可比速率等假设下支持A/B较近，需更多位点检验',
            en: 'Subject to comparability and rates, A/B appear closer; test further loci',
          },
        ],
        correct: 2,
        feedback: {
          zh: '差异数提供条件性亲缘证据，没有时间校准不能当年数。',
          en: 'Differences support a conditional relationship; without calibration they are not years.',
        },
        revisit: {
          zh: '重读Explain的100位点算例。',
          en: 'Revisit the 100-site worked example.',
        },
      },
      {
        id: 'L091-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'convergence指什么？',
          en: 'What is convergence?',
        },
        options: [
          {
            zh: '相同外形必来自最近祖先',
            en: 'Similar appearance necessarily comes from a recent ancestor',
          },
          {
            zh: '不同谱系独立形成相似特征',
            en: 'Independent acquisition of similar features',
          },
          {
            zh: '所有DNA序列逐渐完全相同',
            en: 'All DNA becomes identical',
          },
        ],
        correct: 1,
        feedback: {
          zh: '趋同涉及独立起源，不能仅凭功能相似推最近亲缘。',
          en: 'Convergence concerns independent origins; shared function alone does not establish closest ancestry.',
        },
        revisit: {
          zh: '回看词汇“趋同”。',
          en: 'Revisit convergence in Vocabulary.',
        },
      },
    ],
    minutes: 30,
    icon: '⑂',
    summary: {
      zh: '两种动物都有翅膀，是否就一定是最近的亲属？怎样把岩层、骨骼和DNA放到同一张证据桌？',
      en: 'Two animals have wings. Must they be closest relatives? How can rocks, bones and DNA inform one explanation?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution',
    },
  },
  {
    id: 'L092',
    title: {
      zh: '物种分化与演化树',
      en: 'Speciation and trees',
    },
    hook: {
      zh: '虚构Amber与Birch的分支交换上下位置，亲缘关系会改变吗？一条河又是否保证形成两个物种？',
      en: 'If fictional Amber and Birch exchange positions on a tree, do relationships change? Does a river guarantee two species?',
    },
    prediction: [
      {
        zh: '旋转分支会改变谁是共同祖先',
        en: 'Rotating branches changes common ancestors',
      },
      {
        zh: '分支连接决定亲缘，隔开不保证物种形成',
        en: 'Connections determine relationships; separation does not guarantee speciation',
      },
      {
        zh: '树顶端越靠右越高级',
        en: 'Tips farther right are more advanced',
      },
    ],
    objectives: [
      {
        zh: '联系基因流减少、分化与生殖隔离。',
        en: 'Connect reduced gene flow, divergence and reproductive isolation.',
      },
      {
        zh: '按共同祖先解读分支而非顶端顺序。',
        en: 'Read branching by common ancestors rather than tip order.',
      },
      {
        zh: '识别生物学物种概念的边界。',
        en: 'Recognize limits of the biological species concept.',
      },
    ],
    terms: [
      {
        word: {
          zh: '物种形成',
          en: 'speciation',
        },
        meaning: {
          zh: '谱系分化形成不同物种。',
          en: 'Divergence of lineages into distinct species.',
        },
      },
      {
        word: {
          zh: '生殖隔离',
          en: 'reproductive isolation',
        },
        meaning: {
          zh: '阻碍谱系间有效基因交流的屏障。',
          en: 'Barriers to effective gene exchange between lineages.',
        },
      },
      {
        word: {
          zh: '基因流',
          en: 'gene flow',
        },
        meaning: {
          zh: '遗传信息通过繁殖或迁移在种群间流动。',
          en: 'Movement of genetic information between populations.',
        },
      },
      {
        word: {
          zh: '演化树',
          en: 'phylogenetic tree',
        },
        meaning: {
          zh: '描述共同祖先关系的分支假说。',
          en: 'A branching hypothesis of common ancestry.',
        },
      },
      {
        word: {
          zh: '节点',
          en: 'node',
        },
        meaning: {
          zh: '树中代表分歧或共同祖先的连接点。',
          en: 'A point representing divergence or common ancestry.',
        },
      },
      {
        word: {
          zh: '姐妹群',
          en: 'sister groups',
        },
        meaning: {
          zh: '共享最近分支祖先的两个谱系。',
          en: 'Lineages sharing an immediate common branch ancestor.',
        },
      },
    ],
    mission: {
      zh: '画树((Amber,Birch),Cobalt)，旋转后再画；圈出同一姐妹群，另列一项还需收集的生殖隔离证据。',
      en: 'Draw ((Amber,Birch),Cobalt), rotate branches and circle the unchanged sister group. Identify further evidence needed for reproductive isolation.',
    },
    questions: [
      {
        id: 'L092-q1',
        skill: 'concept',
        prompt: {
          zh: '树中谁共享较近祖先？',
          en: 'Which pair shares the more recent common ancestor?',
        },
        options: [
          {
            zh: 'Amber和Birch',
            en: 'Amber and Birch',
          },
          {
            zh: '看哪个名字在旁边就算',
            en: 'Any adjacent names',
          },
          {
            zh: '最右端和最左端一定最近',
            en: 'The outermost tips are always closest',
          },
        ],
        correct: 0,
        feedback: {
          zh: '沿连接追到节点，Amber/Birch先相遇；相邻排版不是规则。',
          en: 'Trace connections: Amber/Birch meet first; adjacency is not the rule.',
        },
        revisit: {
          zh: '沿树枝追踪Amber与Birch到共同节点。',
          en: 'Trace Amber and Birch back to their shared node.',
        },
      },
      {
        id: 'L092-q2',
        skill: 'concept',
        prompt: {
          zh: '地理隔开为何不保证物种形成？',
          en: 'Why does geographic separation not guarantee speciation?',
        },
        options: [
          {
            zh: '距离再短也必定永远不繁殖',
            en: 'Any distance permanently stops reproduction',
          },
          {
            zh: '还需分化与维持有效基因交流屏障的证据',
            en: 'Evidence of divergence and maintained reproductive barriers is needed',
          },
          {
            zh: '物种形成只看身体大小',
            en: 'Speciation depends only on body size',
          },
        ],
        correct: 1,
        feedback: {
          zh: '隔开能减少基因流，但接触后是否仍有屏障需要检验。',
          en: 'Separation may reduce gene flow; whether barriers persist after contact needs evidence.',
        },
        revisit: {
          zh: '回看屏障、分化与接触三个步骤。',
          en: 'Revisit separation, divergence and renewed contact.',
        },
      },
      {
        id: 'L092-q3',
        skill: 'reasoning',
        prompt: {
          zh: '旋转树的Amber/Birch分支后怎样？',
          en: 'What follows rotating the Amber/Birch branch?',
        },
        options: [
          {
            zh: 'Birch成为更高级生物',
            en: 'Birch becomes more advanced',
          },
          {
            zh: 'Amber成为Birch的现代祖先',
            en: 'Modern Amber becomes Birch’s ancestor',
          },
          {
            zh: '共同祖先关系不变',
            en: 'Common-ancestor relationships remain unchanged',
          },
        ],
        correct: 2,
        feedback: {
          zh: '拓扑由连接确定，旋转保留连接，既不排名也不创造祖先。',
          en: 'Topology is determined by connections, which rotation preserves; rotation does not rank tips or create ancestors.',
        },
        revisit: {
          zh: '切换旋转并比较节点。',
          en: 'Toggle rotation and compare nodes.',
        },
      },
      {
        id: 'L092-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'reproductive isolation是？',
          en: 'What is reproductive isolation?',
        },
        options: [
          {
            zh: '阻碍有效基因交流的生殖屏障',
            en: 'Reproductive barriers to effective gene exchange',
          },
          {
            zh: '只要住得远',
            en: 'Simply living far apart',
          },
          {
            zh: '身体看起来不一样',
            en: 'Simply looking different',
          },
        ],
        correct: 0,
        feedback: {
          zh: '隔离关注有效繁殖与基因流，距离和外观只能提供部分线索。',
          en: 'Isolation concerns reproduction and gene flow; distance and appearance provide only partial clues.',
        },
        revisit: {
          zh: '回看生殖隔离定义。',
          en: 'Revisit reproductive isolation.',
        },
      },
    ],
    minutes: 30,
    icon: '⑂',
    summary: {
      zh: '虚构Amber与Birch的分支交换上下位置，亲缘关系会改变吗？一条河又是否保证形成两个物种？',
      en: 'If fictional Amber and Birch exchange positions on a tree, do relationships change? Does a river guarantee two species?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/20-1-organizing-life-on-earth',
    },
  },
  {
    id: 'L093',
    title: {
      zh: '碳怎样循环？',
      en: 'The carbon cycle',
    },
    hook: {
      zh: '一棵树长大增加的碳主要来自泥土还是空气？若燃烧燃料，碳会消失吗？',
      en: 'Does a growing tree get most of its carbon from soil or air? Does fuel carbon disappear when burned?',
    },
    prediction: [
      {
        zh: '植物有机碳主要来自吸收空气中的CO₂',
        en: 'Plant organic carbon comes mainly from atmospheric CO₂',
      },
      {
        zh: '燃烧使碳原子消失',
        en: 'Combustion destroys carbon atoms',
      },
      {
        zh: '能量和碳一起无损循环',
        en: 'Energy cycles without loss along with carbon',
      },
    ],
    objectives: [
      {
        zh: '区分碳库与碳通量，逐步核对守恒。',
        en: 'Distinguish carbon reservoirs from fluxes and check conservation.',
      },
      {
        zh: '用光合、呼吸、凋落、分解与燃烧追踪碳。',
        en: 'Trace carbon through photosynthesis, respiration, litter, decomposition and combustion.',
      },
      {
        zh: '区分物质循环与能量散失。',
        en: 'Distinguish matter cycling from energy dissipation.',
      },
    ],
    terms: [
      {
        word: {
          zh: '碳库',
          en: 'carbon reservoir',
        },
        meaning: {
          zh: '在某边界内储存碳的部分。',
          en: 'A store of carbon within a defined boundary.',
        },
      },
      {
        word: {
          zh: '通量',
          en: 'flux',
        },
        meaning: {
          zh: '一定时间内在库之间转移的量。',
          en: 'Amount transferred between stores over a time interval.',
        },
      },
      {
        word: {
          zh: '光合作用',
          en: 'photosynthesis',
        },
        meaning: {
          zh: '利用光能将无机碳固定进有机物。',
          en: 'Use of light energy to fix inorganic carbon into organic matter.',
        },
      },
      {
        word: {
          zh: '呼吸作用',
          en: 'respiration',
        },
        meaning: {
          zh: '分解有机物释放可利用能量的过程。',
          en: 'Breakdown of organic molecules to release usable energy.',
        },
      },
      {
        word: {
          zh: '分解',
          en: 'decomposition',
        },
        meaning: {
          zh: '死亡有机物被分解的过程。',
          en: 'Breakdown of dead organic matter.',
        },
      },
      {
        word: {
          zh: '燃烧',
          en: 'combustion',
        },
        meaning: {
          zh: '燃料与氧化剂反应并释放能量。',
          en: 'Reaction of fuel with an oxidant, releasing energy.',
        },
      },
      {
        word: {
          zh: '守恒',
          en: 'conservation',
        },
        meaning: {
          zh: '封闭边界内总量保持不变。',
          en: 'Constancy of a total within a closed boundary.',
        },
      },
    ],
    mission: {
      zh: '画出四库碳账本，逐步记录100份守恒；并排画能源输入及热输出，标明碳与能量不能共用循环箭头。',
      en: 'Draw the four-store carbon account and verify 100 units at every step. Beside it show energy input and heat output without a cyclic energy arrow.',
    },
    questions: [
      {
        id: 'L093-q1',
        skill: 'concept',
        prompt: {
          zh: '植物有机碳主要从哪里进入？',
          en: 'Where does most plant organic carbon enter from?',
        },
        options: [
          {
            zh: '根直接吸入土壤糖',
            en: 'Roots mainly take up soil sugar',
          },
          {
            zh: '光合作用固定CO₂',
            en: 'Photosynthetic fixation of CO₂',
          },
          {
            zh: '光直接变成碳原子',
            en: 'Light becomes carbon atoms',
          },
        ],
        correct: 1,
        feedback: {
          zh: '光提供能量，CO₂提供碳；水和矿质供应不能替代碳来源。',
          en: 'Light supplies energy and CO₂ supplies carbon; water and minerals do not replace that carbon source.',
        },
        revisit: {
          zh: '回看空气到植物的8份箭头。',
          en: 'Revisit the eight-unit air-to-plant arrow.',
        },
      },
      {
        id: 'L093-q2',
        skill: 'concept',
        prompt: {
          zh: '分解箭头把碎屑碳转为空气CO₂，能量怎样？',
          en: 'When decomposition releases detrital carbon as CO₂, what happens to energy?',
        },
        options: [
          {
            zh: '伴随转换与热散失，不能无损循环',
            en: 'It is transformed and dissipated as heat rather than cycling without loss',
          },
          {
            zh: '全部返回太阳',
            en: 'All returns to the Sun',
          },
          {
            zh: '因碳守恒所以可利用能量也不减少',
            en: 'Carbon conservation keeps all energy usable',
          },
        ],
        correct: 0,
        feedback: {
          zh: '原子守恒不表示可利用能量无损；微生物也会呼吸。',
          en: 'Atom conservation does not imply lossless useful energy; microbes respire too.',
        },
        revisit: {
          zh: '比较Explain的碳账本与能量方向。',
          en: 'Compare the carbon account and energy direction in Explain.',
        },
      },
      {
        id: 'L093-q3',
        skill: 'reasoning',
        prompt: {
          zh: '燃烧前空气37、燃料10，转移5后是多少？',
          en: 'Air is 37 and fuel 10 before burning five units. Afterward?',
        },
        options: [
          {
            zh: '空气42、燃料10',
            en: 'Air42, fuel10',
          },
          {
            zh: '空气37、燃料5',
            en: 'Air37, fuel5',
          },
          {
            zh: '空气42、燃料5',
            en: 'Air42, fuel5',
          },
        ],
        correct: 2,
        feedback: {
          zh: '转出库减5、转入库加5，四库合计仍100。',
          en: 'Subtract five from the source and add five to the destination; total remains 100.',
        },
        revisit: {
          zh: '切换燃烧并核对最后一步四库表。',
          en: 'Toggle combustion and check the final four-store table.',
        },
      },
      {
        id: 'L093-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'flux指什么？',
          en: 'What is a flux?',
        },
        options: [
          {
            zh: '库中全部存量',
            en: 'The complete stock in a reservoir',
          },
          {
            zh: '指定时间内在库间的转移量',
            en: 'A transfer amount between stores over a specified interval',
          },
          {
            zh: '碳原子的年龄',
            en: 'The age of a carbon atom',
          },
        ],
        correct: 1,
        feedback: {
          zh: '通量有方向和时间边界，不同于某时点存量。',
          en: 'Flux has direction and a time boundary, unlike an instantaneous stock.',
        },
        revisit: {
          zh: '回看碳库与通量定义。',
          en: 'Revisit reservoir and flux definitions.',
        },
      },
    ],
    minutes: 30,
    icon: '↻',
    summary: {
      zh: '一棵树长大增加的碳主要来自泥土还是空气？若燃烧燃料，碳会消失吗？',
      en: 'Does a growing tree get most of its carbon from soil or air? Does fuel carbon disappear when burned?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles',
    },
  },
  {
    id: 'L094',
    title: {
      zh: '氮与其他养分循环',
      en: 'Nutrient cycles',
    },
    hook: {
      zh: '空气富含N₂，大多数植物为何仍需要根吸收含氮离子？一个氮原子能走哪些回路？',
      en: 'Air contains abundant N₂. Why do most plants still take up nitrogen ions through roots? Which routes can one nitrogen atom follow?',
    },
    prediction: [
      {
        zh: '植物通常直接把N₂当成氮肥',
        en: 'Plants generally use N₂ directly as fertilizer',
      },
      {
        zh: '微生物把N₂转为可利用形式，路径可分支',
        en: 'Microbes convert N₂ to usable forms, with branching pathways',
      },
      {
        zh: '硝化把硝酸盐变成N₂',
        en: 'Nitrification converts nitrate into N₂',
      },
    ],
    objectives: [
      {
        zh: '准确标明固氮、氨化、硝化与反硝化方向。',
        en: 'Label fixation, ammonification, nitrification and denitrification directions accurately.',
      },
      {
        zh: '追踪原子而非混淆分子数，比较分支路径。',
        en: 'Track atoms rather than confusing molecule counts and compare branches.',
      },
      {
        zh: '联系微生物、植物吸收与其他矿质循环。',
        en: 'Connect microbes, plant uptake and other mineral cycles.',
      },
    ],
    terms: [
      {
        word: {
          zh: '固氮',
          en: 'nitrogen fixation',
        },
        meaning: {
          zh: '把N₂转为氨或铵等可利用形式。',
          en: 'Conversion of N₂ into ammonia/ammonium forms.',
        },
      },
      {
        word: {
          zh: '氨化',
          en: 'ammonification',
        },
        meaning: {
          zh: '有机氮分解成为氨或铵。',
          en: 'Conversion of organic nitrogen to ammonia/ammonium.',
        },
      },
      {
        word: {
          zh: '硝化',
          en: 'nitrification',
        },
        meaning: {
          zh: '铵经亚硝酸盐转为硝酸盐。',
          en: 'Oxidation of ammonium through nitrite to nitrate.',
        },
      },
      {
        word: {
          zh: '反硝化',
          en: 'denitrification',
        },
        meaning: {
          zh: '硝酸盐等最终转为N₂等气态产物。',
          en: 'Reduction of nitrate towards gaseous products including N₂.',
        },
      },
      {
        word: {
          zh: '同化',
          en: 'assimilation',
        },
        meaning: {
          zh: '把吸收的无机氮纳入有机分子。',
          en: 'Incorporation of acquired inorganic nitrogen into organic molecules.',
        },
      },
      {
        word: {
          zh: '铵',
          en: 'ammonium',
        },
        meaning: {
          zh: 'NH₄⁺，植物可利用的含氮离子。',
          en: 'NH₄⁺, a nitrogen ion usable by plants.',
        },
      },
      {
        word: {
          zh: '硝酸盐',
          en: 'nitrate',
        },
        meaning: {
          zh: 'NO₃⁻，植物可吸收的含氮离子。',
          en: 'NO₃⁻, a nitrogen ion plants can take up.',
        },
      },
    ],
    mission: {
      zh: '分别画植物吸收和返回大气两条氮路径，标出负责的过程；另写一句为何磷循环不能直接复制氮图。',
      en: 'Draw uptake and atmospheric-return nitrogen routes with process names. Explain why a phosphorus cycle cannot simply copy the nitrogen diagram.',
    },
    questions: [
      {
        id: 'L094-q1',
        skill: 'concept',
        prompt: {
          zh: '大多数植物一般怎样获得氮？',
          en: 'How do most plants generally acquire nitrogen?',
        },
        options: [
          {
            zh: '根吸收NH₄⁺或NO₃⁻',
            en: 'Root uptake of NH₄⁺ or NO₃⁻',
          },
          {
            zh: '直接吸收N₂再自行固氮',
            en: 'Direct N₂ uptake and fixation by the plant',
          },
          {
            zh: '把碳原子改成氮',
            en: 'Convert carbon atoms into nitrogen',
          },
        ],
        correct: 0,
        feedback: {
          zh: '微生物固氮与植物离子吸收不同；元素不会这样互变。',
          en: 'Microbial fixation differs from plant ion uptake; elements are not interconverted this way.',
        },
        revisit: {
          zh: '回看固氮与吸收的分工。',
          en: 'Revisit the distinction between fixation and uptake.',
        },
      },
      {
        id: 'L094-q2',
        skill: 'concept',
        prompt: {
          zh: '硝化的方向是哪条？',
          en: 'Which direction is nitrification?',
        },
        options: [
          {
            zh: 'NO₃⁻→N₂',
            en: 'NO₃⁻→N₂',
          },
          {
            zh: '有机氮→NH₄⁺',
            en: 'Organic nitrogen→NH₄⁺',
          },
          {
            zh: 'NH₄⁺→NO₂⁻→NO₃⁻',
            en: 'NH₄⁺→NO₂⁻→NO₃⁻',
          },
        ],
        correct: 2,
        feedback: {
          zh: '硝化是铵经亚硝酸盐到硝酸盐；另两条分别关联反硝化与氨化。',
          en: 'Nitrification runs ammonium through nitrite to nitrate; the other routes concern denitrification and ammonification.',
        },
        revisit: {
          zh: '回看路线第2、3步。',
          en: 'Revisit route steps two and three.',
        },
      },
      {
        id: 'L094-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一个标记氮原子从NO₃⁻进入有机氮，原子数怎样？',
          en: 'One marked nitrogen atom moves from NO₃⁻ into organic nitrogen. Its atom count?',
        },
        options: [
          {
            zh: '变为零，因为失去硝酸根',
            en: 'Zero, because nitrate disappears',
          },
          {
            zh: '仍为一，化学形式改变',
            en: 'Still one; chemical form changes',
          },
          {
            zh: '因有机物更大变为两个',
            en: 'Two, because organic molecules are larger',
          },
        ],
        correct: 1,
        feedback: {
          zh: '追踪的是氮原子而非整个分子数，换形式不增减该原子。',
          en: 'We track an atom rather than molecule counts; a change of form does not add or remove it.',
        },
        revisit: {
          zh: '回看N₂中一个标记原子的说明。',
          en: 'Revisit the marked atom within N₂.',
        },
      },
      {
        id: 'L094-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'ammonification是什么意思？',
          en: 'What does ammonification mean?',
        },
        options: [
          {
            zh: '有机氮转为氨或铵',
            en: 'Organic nitrogen becomes ammonia/ammonium',
          },
          {
            zh: 'N₂转为硝酸盐的总称',
            en: 'Any N₂-to-nitrate process',
          },
          {
            zh: '植物用光能制造氮原子',
            en: 'Plants create nitrogen atoms using light',
          },
        ],
        correct: 0,
        feedback: {
          zh: '氨化从有机氮释放铵，不是固氮或硝化的另一个名字。',
          en: 'Ammonification releases ammonium from organic nitrogen; it is distinct from fixation and nitrification.',
        },
        revisit: {
          zh: '回看最后的有机氮→铵支路。',
          en: 'Revisit organic nitrogen→ammonium.',
        },
      },
    ],
    minutes: 30,
    icon: '↻',
    summary: {
      zh: '空气富含N₂，大多数植物为何仍需要根吸收含氮离子？一个氮原子能走哪些回路？',
      en: 'Air contains abundant N₂. Why do most plants still take up nitrogen ions through roots? Which routes can one nitrogen atom follow?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles',
    },
  },
  {
    id: 'L095',
    title: {
      zh: '能量金字塔',
      en: 'Energy pyramids',
    },
    hook: {
      zh: '生产者储存1000 kJ，下一营养级能得到多少？10%是自然界每次都精确执行的规则吗？',
      en: 'Producers store 1000 kJ. How much reaches the next trophic level? Is ten percent an exact rule everywhere?',
    },
    prediction: [
      {
        zh: '每级都严格传递10%',
        en: 'Every level always transfers exactly ten percent',
      },
      {
        zh: '转移比例可变；需把下一层、碎屑与热一起记账',
        en: 'Transfer varies; account for the next level, detritus and heat',
      },
      {
        zh: '分解者把能量送回太阳',
        en: 'Decomposers return energy to the Sun',
      },
    ],
    objectives: [
      {
        zh: '核算下一营养级、碎屑与热的能量收支。',
        en: 'Account for energy to the next level, detritus and heat.',
      },
      {
        zh: '比较5%、10%、20%条件下的金字塔。',
        en: 'Compare pyramids at 5%, 10% and 20% transfer.',
      },
      {
        zh: '解释分解者跨营养级获得碎屑能量与持续能量输入。',
        en: 'Explain detrital energy from multiple levels and continuing energy input.',
      },
    ],
    terms: [
      {
        word: {
          zh: '营养级',
          en: 'trophic level',
        },
        meaning: {
          zh: '食物关系中取得能量的位置。',
          en: 'A feeding position in energy transfer.',
        },
      },
      {
        word: {
          zh: '生产量',
          en: 'production',
        },
        meaning: {
          zh: '一定时间面积内形成的新生物量或其能量。',
          en: 'New biomass or its energy formed over a specified interval and area.',
        },
      },
      {
        word: {
          zh: '传递效率',
          en: 'transfer efficiency',
        },
        meaning: {
          zh: '下一营养级生产量与前级生产量的比。',
          en: 'Ratio of next-level production to previous-level production.',
        },
      },
      {
        word: {
          zh: '碎屑',
          en: 'detritus',
        },
        meaning: {
          zh: '死亡物质和排泄物等有机材料。',
          en: 'Dead material and organic wastes.',
        },
      },
      {
        word: {
          zh: '分解者',
          en: 'decomposer',
        },
        meaning: {
          zh: '从分解有机物取得物质和能量的生物。',
          en: 'An organism obtaining matter and energy from decomposing organic material.',
        },
      },
      {
        word: {
          zh: '热散失',
          en: 'heat dissipation',
        },
        meaning: {
          zh: '能量分散为难以继续驱动生物工作的热。',
          en: 'Energy dispersal as heat less available for biological work.',
        },
      },
    ],
    mission: {
      zh: '保留三种效率的两级账本，逐行核对输入＝下一层＋碎屑＋热；并排放碳循环，禁止画热返回生产者的箭头。',
      en: 'Keep two-level accounts for three efficiencies and check input = next level + detritus + heat. Place beside the carbon cycle without an arrow recycling heat to producers.',
    },
    questions: [
      {
        id: 'L095-q1',
        skill: 'concept',
        prompt: {
          zh: '能量传递效率必为10%吗？',
          en: 'Must transfer efficiency be ten percent?',
        },
        options: [
          {
            zh: '是，所有生态系统都精确如此',
            en: 'Yes, exactly everywhere',
          },
          {
            zh: '否，随生物和条件变化',
            en: 'No, it varies with organisms and conditions',
          },
          {
            zh: '否，因为能量不会散热',
            en: 'No, because energy never becomes heat',
          },
        ],
        correct: 1,
        feedback: {
          zh: '10%是近似示例，真实比例可变，呼吸和散热仍存在。',
          en: 'Ten percent is an illustrative approximation; actual efficiencies vary and heat dissipation remains.',
        },
        revisit: {
          zh: '切换5%、10%、20%比较金字塔。',
          en: 'Compare the 5%, 10% and 20% pyramids.',
        },
      },
      {
        id: 'L095-q2',
        skill: 'concept',
        prompt: {
          zh: '分解者从哪里得到能量？',
          en: 'Where do decomposers obtain energy?',
        },
        options: [
          {
            zh: '只从最高营养级',
            en: 'Only from the highest level',
          },
          {
            zh: '直接从热变回可用光',
            en: 'By converting heat back to usable light',
          },
          {
            zh: '来自多个营养级的死亡有机物等',
            en: 'Dead organic material and wastes from multiple levels',
          },
        ],
        correct: 2,
        feedback: {
          zh: '碎屑有多个来源，分解者也呼吸，不能使能量无损回流。',
          en: 'Detritus has multiple sources; decomposers respire and do not recycle energy losslessly.',
        },
        revisit: {
          zh: '回看各层通往碎屑的箭头。',
          en: 'Revisit arrows from multiple levels to detritus.',
        },
      },
      {
        id: 'L095-q3',
        skill: 'reasoning',
        prompt: {
          zh: '输入1000 kJ、传递20%、碎屑30%，热是多少？',
          en: 'Input1000 kJ, next-level transfer20%, detritus30%. Heat?',
        },
        options: [
          {
            zh: '500 kJ',
            en: '500 kJ',
          },
          {
            zh: '800 kJ',
            en: '800 kJ',
          },
          {
            zh: '1000 kJ',
            en: '1000 kJ',
          },
        ],
        correct: 0,
        feedback: {
          zh: '1000−200−300＝500；把碎屑忘掉会重复或漏记能量。',
          en: '1000−200−300=500; omitting detritus leaves the account incorrect.',
        },
        revisit: {
          zh: '重读20%账本，核对三项总和。',
          en: 'Revisit the twenty-percent account and sum all three outputs.',
        },
      },
      {
        id: 'L095-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'transfer efficiency表示什么？',
          en: 'What is transfer efficiency?',
        },
        options: [
          {
            zh: '个体体重之比',
            en: 'Ratio of individual weights',
          },
          {
            zh: '下一营养级与前级生产量之比',
            en: 'Ratio of next-level to preceding-level production',
          },
          {
            zh: '物质循环次数',
            en: 'Number of matter cycles',
          },
        ],
        correct: 1,
        feedback: {
          zh: '效率比较同边界时期的生产量，不是个体体重或循环次数。',
          en: 'Efficiency compares production with matched boundaries and interval, not individual weights or cycle counts.',
        },
        revisit: {
          zh: '回看生产量和传递效率定义。',
          en: 'Revisit production and transfer efficiency.',
        },
      },
    ],
    minutes: 30,
    icon: '↻',
    summary: {
      zh: '生产者储存1000 kJ，下一营养级能得到多少？10%是自然界每次都精确执行的规则吗？',
      en: 'Producers store 1000 kJ. How much reaches the next trophic level? Is ten percent an exact rule everywhere?',
    },
    reference: {
      title: 'OpenStax Biology 2e: supporting science',
      url: 'https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems',
    },
  },
  {
    id: 'L096',
    title: {
      zh: '生物多样性和系统稳定',
      en: 'Biodiversity and resilience',
    },
    hook: {
      zh: '同样分解落叶的四种微生物一定比一种更耐旱吗？若四种都怕干燥，会发生什么？',
      en: 'Must four litter decomposers withstand drought better than one? What if all four are drought sensitive?',
    },
    prediction: [
      {
        zh: '只要物种多，所有扰动下必更稳定',
        en: 'More species always guarantee stability under every disturbance',
      },
      {
        zh: '功能替代与不同响应可能缓冲扰动，仍需比较',
        en: 'Functional substitutes with different responses may buffer disturbance; compare evidence',
      },
      {
        zh: '恢复快就表示从未受到影响',
        en: 'Rapid recovery means no initial effect',
      },
    ],
    objectives: [
      {
        zh: '区分抵抗能力与扰动后的恢复。',
        en: 'Distinguish resistance from recovery after disturbance.',
      },
      {
        zh: '联系功能冗余与响应差异，不把物种数当万能原因。',
        en: 'Connect functional redundancy and response differences without treating richness as a universal cause.',
      },
      {
        zh: '用虚拟重复条件的数据边界提出待检验预测。',
        en: 'Use the limits of conditional virtual data to propose testable predictions.',
      },
    ],
    terms: [
      {
        word: {
          zh: '生物多样性',
          en: 'biodiversity',
        },
        meaning: {
          zh: '生命在遗传、物种和生态系统等层面的差异。',
          en: 'Variation at genetic, species and ecosystem levels.',
        },
      },
      {
        word: {
          zh: '物种丰富度',
          en: 'species richness',
        },
        meaning: {
          zh: '指定范围内的物种数。',
          en: 'Number of species in a defined area.',
        },
      },
      {
        word: {
          zh: '抵抗能力',
          en: 'resistance',
        },
        meaning: {
          zh: '扰动期间维持所测功能的程度。',
          en: 'Extent to which a measured function is maintained during disturbance.',
        },
      },
      {
        word: {
          zh: '恢复能力',
          en: 'resilience',
        },
        meaning: {
          zh: '扰动后恢复功能的能力，需定义时间与指标。',
          en: 'Capacity for recovery after disturbance, requiring explicit timing and measures.',
        },
      },
      {
        word: {
          zh: '功能冗余',
          en: 'functional redundancy',
        },
        meaning: {
          zh: '多个物种能承担相似功能。',
          en: 'Multiple species can perform similar functions.',
        },
      },
      {
        word: {
          zh: '响应多样性',
          en: 'response diversity',
        },
        meaning: {
          zh: '执行相似功能的物种对扰动反应不同。',
          en: 'Different disturbance responses among species sharing functions.',
        },
      },
      {
        word: {
          zh: '扰动',
          en: 'disturbance',
        },
        meaning: {
          zh: '改变生态系统条件或结构的事件。',
          en: 'An event altering ecosystem conditions or structure.',
        },
      },
    ],
    mission: {
      zh: '保留干旱与水淹两组0、1、30天分解指数、假设和两种指标；写出一种反例与一项现实研究需要的证据。',
      en: 'Keep day0,1,30 decomposition indices, assumptions and both indicators for drought and flooding. State a counterexample and evidence needed in a real study.',
    },
    questions: [
      {
        id: 'L096-q1',
        skill: 'concept',
        prompt: {
          zh: '抵抗能力与恢复能力怎样区分？',
          en: 'How do resistance and resilience differ?',
        },
        options: [
          {
            zh: '前者看冲击保留，后者看之后恢复',
            en: 'The first concerns retained function; the second concerns recovery',
          },
          {
            zh: '都只数物种',
            en: 'Both only count species',
          },
          {
            zh: '恢复越快就表示冲击为零',
            en: 'Faster recovery means zero impact',
          },
        ],
        correct: 0,
        feedback: {
          zh: '冲击大小与随后恢复是两个观察问题，需要分别记录。',
          en: 'Impact and subsequent recovery are separate observations requiring separate records.',
        },
        revisit: {
          zh: '比较第1天与第30天的图点。',
          en: 'Compare day-one and day-thirty points.',
        },
      },
      {
        id: 'L096-q2',
        skill: 'concept',
        prompt: {
          zh: '功能冗余何时较可能缓冲干旱？',
          en: 'When is functional redundancy more likely to buffer drought?',
        },
        options: [
          {
            zh: '成员功能相同且全部同样敏感就必定足够',
            en: 'Shared function and identical sensitivity always suffice',
          },
          {
            zh: '有存活替代者且成员响应存在差异',
            en: 'Surviving substitutes have differing responses',
          },
          {
            zh: '丰富度增加就无需研究性状',
            en: 'Richness makes trait evidence unnecessary',
          },
        ],
        correct: 1,
        feedback: {
          zh: '相似功能允许替代，响应差异使替代者更可能存活；仍是有条件机制。',
          en: 'Shared function permits substitution and response differences can leave survivors; this is conditional.',
        },
        revisit: {
          zh: '回看分解者的湿度响应与补位假设。',
          en: 'Revisit moisture responses and compensation assumptions.',
        },
      },
      {
        id: 'L096-q3',
        skill: 'reasoning',
        prompt: {
          zh: '100→70→90，30天损失恢复比例是多少？',
          en: 'For 100→70→90, what fraction of lost function is recovered by day30?',
        },
        options: [
          {
            zh: '90%',
            en: '90%',
          },
          {
            zh: '20%',
            en: '20%',
          },
          {
            zh: '(90−70)/(100−70)≈66.7%',
            en: '(90−70)/(100−70)≈66.7%',
          },
        ],
        correct: 2,
        feedback: {
          zh: '损失30、补回20，所以20/30；90%是最后值相对起点，含义不同。',
          en: 'The loss is30 and regain20, giving20/30;90% compares the last value with baseline and means something different.',
        },
        revisit: {
          zh: '回看Explain的两个分母。',
          en: 'Revisit the two different denominators in Explain.',
        },
      },
      {
        id: 'L096-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'response diversity表示什么？',
          en: 'What is response diversity?',
        },
        options: [
          {
            zh: '执行相似功能的成员对扰动反应不同',
            en: 'Members sharing a function respond differently to disturbance',
          },
          {
            zh: '所有物种做完全不同的功能',
            en: 'Every species performs a completely different function',
          },
          {
            zh: '不同群落物种数一定不同',
            en: 'Communities necessarily have different species counts',
          },
        ],
        correct: 0,
        feedback: {
          zh: '响应多样性关注面对扰动的差异，不等于只增加物种数或功能种类。',
          en: 'Response diversity concerns responses to disturbance rather than simply species counts or function counts.',
        },
        revisit: {
          zh: '回看响应多样性与功能冗余的区别。',
          en: 'Revisit response diversity versus functional redundancy.',
        },
      },
    ],
    minutes: 30,
    icon: '↻',
    summary: {
      zh: '同样分解落叶的四种微生物一定比一种更耐旱吗？若四种都怕干燥，会发生什么？',
      en: 'Must four litter decomposers withstand drought better than one? What if all four are drought sensitive?',
    },
    reference: {
      title: 'Elmqvist et al.: response diversity and resilience',
      url: 'https://esajournals.onlinelibrary.wiley.com/doi/abs/10.1890/1540-9295%282003%29001%5B0488%3ARDECAR%5D2.0.CO%3B2',
    },
  },
];
