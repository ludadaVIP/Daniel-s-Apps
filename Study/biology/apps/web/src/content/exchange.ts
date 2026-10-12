import type { Lesson } from '../schema';
export const exchangeLessons: Lesson[] = [
  {
    id: 'L029',
    title: {
      zh: '细胞膜是一道怎样的门？',
      en: 'The cell membrane',
    },
    minutes: 20,
    icon: '⇥',
    summary: {
      zh: '氧气能过去，钠离子为什么要找通道？',
      en: 'Oxygen gets through. Why does sodium need a channel?',
    },
    hook: {
      zh: '你的一格细胞既不能完全封闭，也不能什么都放进来。换三种物质，试着打开一种特定通道，找出“门”的比喻哪里有用、哪里会误导。',
      en: 'A cell cannot be sealed shut or let everything in. Compare three substances and open one specific channel. Discover where the door analogy helps—and where it misleads.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Membranes and passive transport',
      url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
    },
    objectives: [
      {
        zh: '把磷脂双层、运输蛋白与选择性通透联系起来。',
        en: 'Connect the phospholipid bilayer and transport proteins to selective permeability.',
      },
      {
        zh: '用性质和路线解释通过能力，避免只按大小判断。',
        en: 'Explain passage using properties and routes, rather than size alone.',
      },
    ],
    prediction: [
      {
        zh: '所有小粒子都能直接穿过',
        en: 'All small particles cross directly',
      },
      {
        zh: '物质性质和特定运输蛋白都会影响通过',
        en: 'Properties and specific transport proteins affect passage',
      },
      {
        zh: '壁把膜代替掉了',
        en: 'The wall replaces the membrane',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞膜',
          en: 'cell membrane',
        },
        meaning: {
          zh: '细胞内外的边界，调节物质交换。',
          en: 'The cell boundary regulating exchange.',
        },
      },
      {
        word: {
          zh: '磷脂双层',
          en: 'phospholipid bilayer',
        },
        meaning: {
          zh: '两层磷脂构成膜的基本结构，疏水部分朝向内部。',
          en: 'Two phospholipid layers form the basic membrane structure, with hydrophobic regions facing inward.',
        },
      },
      {
        word: {
          zh: '运输蛋白',
          en: 'transport protein',
        },
        meaning: {
          zh: '为特定物质提供跨膜路线的蛋白质。',
          en: 'A protein providing a route across a membrane for particular substances.',
        },
      },
      {
        word: {
          zh: '选择性通透',
          en: 'selective permeability',
        },
        meaning: {
          zh: '不同物质的通过能力不同，受结构与条件影响。',
          en: 'Different substances pass differently depending on structure and conditions.',
        },
      },
      {
        word: {
          zh: '离子',
          en: 'ion',
        },
        meaning: {
          zh: '带电的原子或原子团，本课用钠离子作例子。',
          en: 'A charged atom or group of atoms; sodium is our example.',
        },
      },
    ],
    questions: [
      {
        id: 'L029-q1',
        skill: 'concept',
        prompt: {
          zh: '氧气分子怎样通过本课膜模型？',
          en: 'How does oxygen cross this membrane model?',
        },
        options: [
          {
            zh: '直接经过脂质内部',
            en: 'Through the lipid core',
          },
          {
            zh: '只能通过钠通道',
            en: 'Only through a sodium channel',
          },
          {
            zh: '必须先把膜打破',
            en: 'By breaking the membrane',
          },
        ],
        correct: 0,
        feedback: {
          zh: '氧气较小且不带电，可以经过脂质内部；本课展示被动路线，不是膜破洞。',
          en: 'Small, uncharged oxygen can cross the lipid core. This is a passive route, not a torn membrane.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L029-q2',
        skill: 'concept',
        prompt: {
          zh: '打开钠通道，哪项判断合理？',
          en: 'What follows from opening the sodium channel?',
        },
        options: [
          {
            zh: '所有大小的分子都能通过',
            en: 'Molecules of any size can cross',
          },
          {
            zh: '钠离子有适合的路线，蛋白质并不会因此穿过',
            en: 'Sodium gains a suitable route; a protein does not thereby cross',
          },
          {
            zh: '细胞不再需要膜',
            en: 'The cell no longer needs its membrane',
          },
        ],
        correct: 1,
        feedback: {
          zh: '通道具有选择性。这里的钠通道不是任何物质都通行的隧道。',
          en: 'Channels are selective. This sodium channel is not an all-purpose tunnel.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L029-q3',
        skill: 'reasoning',
        prompt: {
          zh: '“钠离子小，所以一定能直接穿过脂质层。”这个解释缺什么？',
          en: '“Sodium is small, so it must cross the lipid layer directly.” What is missing?',
        },
        options: [
          {
            zh: '只需知道颜色',
            en: 'Only its colour matters',
          },
          {
            zh: '只需把动画播放更快',
            en: 'Only faster playback matters',
          },
          {
            zh: '还要考虑带电性质及适合的运输蛋白',
            en: 'Charge and suitable transport proteins also matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '大小不是唯一条件。带电离子难以直接经过疏水的脂质内部；动画颜色与播放速度不是机制。',
          en: 'Size is only one factor. Charged ions do not readily cross the hydrophobic lipid core; display colour and playback speed are not mechanisms.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L029-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'selective permeability最接近哪句？',
          en: 'What best describes selective permeability?',
        },
        options: [
          {
            zh: '绝对不允许任何东西通过',
            en: 'Nothing ever passes',
          },
          {
            zh: '不同物质的通过能力不同',
            en: 'Substances differ in their ability to pass',
          },
          {
            zh: '细胞膜会思考并挑选',
            en: 'The membrane thinks and chooses',
          },
        ],
        correct: 1,
        feedback: {
          zh: '选择性通透描述结构造成的不同通过能力，不是细胞膜有意识地选择。',
          en: 'Selective permeability describes different passage abilities arising from structure, not conscious choice.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
    ],
    mission: {
      zh: '画两条路线：氧气经过脂质，钠离子经过打开的特定通道。再写一句，为什么膜不像只按尺寸筛选的筛子？',
      en: 'Sketch oxygen through lipids and sodium through its open channel. Explain why a membrane is not simply a sieve sorting by size.',
    },
  },
  {
    id: 'L030',
    title: {
      zh: '分子为什么会扩散？',
      en: 'Diffusion',
    },
    minutes: 20,
    icon: '∴',
    summary: {
      zh: '果汁颜色散开，是每个分子都认路吗？',
      en: 'Does a spreading colour mean every molecule knows the way?',
    },
    hook: {
      zh: '水中的颜色逐渐散开，我们容易画一个单向箭头。但一粒分子真的只往淡的地方走吗？跟踪一粒，再数整群，看看这两种观察为什么不同。',
      en: 'Colour spreads through water, so we often draw one arrow. Does each molecule travel only towards a paler region? Track one particle, then count the group to compare these views.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Diffusion',
      url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
    },
    objectives: [
      {
        zh: '区分随机运动、双向穿越与净扩散。',
        en: 'Distinguish random motion, two-way crossings and net diffusion.',
      },
      {
        zh: '用等体积数量与穿越记录支持有限结论。',
        en: 'Use equal-volume counts and crossing records to support a limited claim.',
      },
    ],
    prediction: [
      {
        zh: '每粒都只走向粒子少的一边',
        en: 'Each particle moves only towards fewer particles',
      },
      {
        zh: '单粒随机，许多粒子的整体可有净变化',
        en: 'Individuals move randomly; a group can show net change',
      },
      {
        zh: '一样多就不再运动',
        en: 'Equal counts stop all motion',
      },
    ],
    terms: [
      {
        word: {
          zh: '扩散',
          en: 'diffusion',
        },
        meaning: {
          zh: '随机运动造成的整体散布；有浓度差时通常呈从高到低的净趋势。',
          en: 'Spreading from random motion, with a usual high-to-low net tendency when concentrations differ.',
        },
      },
      {
        word: {
          zh: '浓度',
          en: 'concentration',
        },
        meaning: {
          zh: '单位体积中某种物质的量；本模型两侧体积相同。',
          en: 'Amount of a substance per volume; our two halves have equal volume.',
        },
      },
      {
        word: {
          zh: '浓度梯度',
          en: 'concentration gradient',
        },
        meaning: {
          zh: '空间中浓度有差别。',
          en: 'A difference in concentration across space.',
        },
      },
      {
        word: {
          zh: '净移动',
          en: 'net movement',
        },
        meaning: {
          zh: '一个方向的总移动减去反方向移动。',
          en: 'Movement in one direction minus movement in the opposite direction.',
        },
      },
      {
        word: {
          zh: '动态平衡',
          en: 'dynamic equilibrium',
        },
        meaning: {
          zh: '仍然运动，整体没有持续单向的净变化。',
          en: 'Continued motion without sustained overall one-way net change.',
        },
      },
    ],
    questions: [
      {
        id: 'L030-q1',
        skill: 'concept',
        prompt: {
          zh: '看一粒金色粒子，哪句描述准确？',
          en: 'Which describes the gold particle?',
        },
        options: [
          {
            zh: '它总知道哪边粒子少',
            en: 'It always knows which side has fewer particles',
          },
          {
            zh: '它随机改变方向，不按浓度选择下一步',
            en: 'It changes direction randomly, not by consulting concentration',
          },
          {
            zh: '它只向右走',
            en: 'It moves only right',
          },
        ],
        correct: 1,
        feedback: {
          zh: '每一步按随机方向提议，浓度不参与选方向。总体的趋势来自许多粒子，而不是一粒认路。',
          en: 'Step directions are randomly proposed without consulting concentration. Collective trends emerge from many particles, not route-finding.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L030-q2',
        skill: 'concept',
        prompt: {
          zh: '开始左12、右4，左右体积相同。多次轨迹平均最可能怎样？',
          en: 'Starting with left 12 and right 4 in equal volumes, what is likely across many runs?',
        },
        options: [
          {
            zh: '平均倾向从左到右净扩散，但每段可波动',
            en: 'An average net tendency left to right, with interval fluctuations',
          },
          {
            zh: '每一步必定左到右',
            en: 'Every step must go left to right',
          },
          {
            zh: '粒子在浓度相同时立刻停止',
            en: 'Particles stop as soon as concentrations match',
          },
        ],
        correct: 0,
        feedback: {
          zh: '等体积使数量可比较浓度。高浓度一侧较多粒子随机离开，平均产生净变化；一段短记录不必严格单调。',
          en: 'Equal volumes make counts comparable as concentrations. More particles can randomly leave the concentrated side, producing an average net change; a short trace need not be monotonic.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L030-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一段记录左→右10次，右→左8次，左侧从11变9。这支持什么？',
          en: 'A record has 10 left-to-right and 8 right-to-left crossings; left count falls from 11 to 9. What follows?',
        },
        options: [
          {
            zh: '没有任何粒子向左',
            en: 'No particle went left',
          },
          {
            zh: '左边每个粒子都只走一次',
            en: 'Every left particle crossed once',
          },
          {
            zh: '两方向都运动，净减少2；穿越次数可能含往返',
            en: 'Both directions occurred, with a net decrease of 2; crossings may include returns',
          },
        ],
        correct: 2,
        feedback: {
          zh: '10−8=2，对应左侧11−9=2。穿越事件数不是不同粒子的数量，同一粒可往返。',
          en: '10−8=2 matches the left decrease 11−9=2. Crossing events are not distinct-particle counts; one particle can cross repeatedly.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L030-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'dynamic equilibrium表达什么？',
          en: 'What does dynamic equilibrium express?',
        },
        options: [
          {
            zh: '所有粒子冻结',
            en: 'All particles freeze',
          },
          {
            zh: '仍有运动，整体不呈持续单向净变化',
            en: 'Motion continues without a sustained overall one-way net change',
          },
          {
            zh: '浓度越高越不动',
            en: 'Higher concentration means no motion',
          },
        ],
        correct: 1,
        feedback: {
          zh: '动态平衡中运动继续。小模型的瞬时数量可以波动，不能把8:8那一帧当作永久停止。',
          en: 'Motion continues at dynamic equilibrium. Instantaneous counts in a small model fluctuate; an 8:8 snapshot is not a permanent stop.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
    ],
    mission: {
      zh: '从表格抄相邻两帧的左右数量和两方向穿越次数。计算净变化，写一个英文句，并说明这是模型记录。',
      en: 'Copy adjacent snapshots and both crossing counts. Calculate net change, write one English sentence and label the record as model data.',
    },
  },
  {
    id: 'L031',
    title: {
      zh: '水为什么会移动？',
      en: 'Osmosis',
    },
    minutes: 20,
    icon: '◊',
    summary: {
      zh: '黄瓜碰到盐，为什么可能变软、出水？',
      en: 'Why can salted cucumber become softer and release water?',
    },
    hook: {
      zh: '一片熟悉的黄瓜碰到盐，后来外面有水，手感也可能改变。先不用切菜：把一格植物细胞放进三种模型溶液，分清水的路线和溶质的路线。',
      en: 'Salted cucumber may become wet and softer. No cutting is needed: compare a plant cell in three model solutions and separate water routes from solute routes.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Osmosis',
      url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
    },
    objectives: [
      {
        zh: '在明确起始条件下比较水的净移动方向。',
        en: 'Compare initial net water tendencies under stated conditions.',
      },
      {
        zh: '区分细胞壁、膜和内容物变化，避免无限膨大推断。',
        en: 'Distinguish wall, membrane and contents, avoiding unlimited-expansion claims.',
      },
    ],
    prediction: [
      {
        zh: '盐穿膜，把水带出去',
        en: 'Salt crosses and carries water out',
      },
      {
        zh: '膜能让水通过时，溶质差与压力条件影响净移动',
        en: 'Solute differences and pressure conditions affect net water movement across a water-permeable membrane',
      },
      {
        zh: '任何植物细胞碰到水都无限变大',
        en: 'Plant cells expand without limit in water',
      },
    ],
    terms: [
      {
        word: {
          zh: '渗透',
          en: 'osmosis',
        },
        meaning: {
          zh: '水通过选择性通透膜的净移动。',
          en: 'Net water movement through a selectively permeable membrane.',
        },
      },
      {
        word: {
          zh: '溶质',
          en: 'solute',
        },
        meaning: {
          zh: '溶在液体中的物质，本模型假定其不穿膜。',
          en: 'A dissolved substance, assumed not to cross this membrane.',
        },
      },
      {
        word: {
          zh: '选择性通透膜',
          en: 'selectively permeable membrane',
        },
        meaning: {
          zh: '允许不同物质以不同能力通过的边界。',
          en: 'A boundary across which substances have differing passage abilities.',
        },
      },
      {
        word: {
          zh: '膨压',
          en: 'turgor pressure',
        },
        meaning: {
          zh: '植物细胞内容物对壁产生的压力，能支持组织。',
          en: 'Pressure of plant cell contents against the wall, helping support tissue.',
        },
      },
      {
        word: {
          zh: '净移动',
          en: 'net movement',
        },
        meaning: {
          zh: '双向运动相减后的整体改变。',
          en: 'The collective change after subtracting opposite-direction movements.',
        },
      },
    ],
    questions: [
      {
        id: 'L031-q1',
        skill: 'concept',
        prompt: {
          zh: '本课渗透模型中，跨膜被追踪的是什么？',
          en: 'What crosses the membrane in this osmosis model?',
        },
        options: [
          {
            zh: '只能是盐',
            en: 'Only salt',
          },
          {
            zh: '细胞壁',
            en: 'The cell wall',
          },
          {
            zh: '水，溶质被限制在原侧',
            en: 'Water, with solute retained on its original side',
          },
        ],
        correct: 2,
        feedback: {
          zh: '渗透讨论水通过选择性通透膜的净移动。本模型溶质不穿膜；不是盐把膜拖出去。',
          en: 'Osmosis concerns net water movement through a selectively permeable membrane. Solute stays on its original side in this model.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L031-q2',
        skill: 'concept',
        prompt: {
          zh: '起始压力相同，细胞内溶质相对浓度4，外侧8，水能通过。起始净趋势？',
          en: 'Equal initial pressure, inside relative solute concentration 4, outside 8, water-permeable membrane. Initial net tendency?',
        },
        options: [
          {
            zh: '净向细胞外，细胞内容物可能收缩',
            en: 'Net outward; the cell contents may shrink',
          },
          {
            zh: '净向细胞内，因为数字大',
            en: 'Net inward because the number is larger',
          },
          {
            zh: '细胞壁立即消失',
            en: 'The cell wall disappears',
          },
        ],
        correct: 0,
        feedback: {
          zh: '在这些起始条件下，较浓外液对应水净外移趋势，壁不必收缩。之后压力变化会影响水移动。',
          en: 'Under these starting conditions, concentrated outside solution gives an outward net water tendency; the wall need not shrink. Later pressure changes affect movement.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L031-q3',
        skill: 'reasoning',
        prompt: {
          zh: '外侧稀液时模型内容物变大，能说水永远继续进去吗？',
          en: 'The contents expand in dilute outside solution. Can water keep entering forever?',
        },
        options: [
          {
            zh: '能，动画箭头保证无限进入',
            en: 'Yes; an arrow guarantees endless entry',
          },
          {
            zh: '不能，壁的支持与压力变化可限制进一步净入水',
            en: 'No; wall support and pressure changes can limit further net entry',
          },
          {
            zh: '能，因为渗透不受任何条件影响',
            en: 'Yes; osmosis depends on no conditions',
          },
        ],
        correct: 1,
        feedback: {
          zh: '模型显示起始趋势，不计算终点。细胞壁支持和膨压改变可平衡净趋势，不能外推无限膨大。',
          en: 'The model shows an initial tendency, not a calculated endpoint. Wall support and turgor changes can balance the net tendency; expansion is not unlimited.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L031-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'osmosis指哪种现象？',
          en: 'Which phenomenon is osmosis?',
        },
        options: [
          {
            zh: '器官一起合作',
            en: 'Organs cooperating',
          },
          {
            zh: '任何粒子在无膜空间散开',
            en: 'Any particle spreading without a membrane',
          },
          {
            zh: '水通过选择性通透膜的净移动',
            en: 'Net water movement through a selectively permeable membrane',
          },
        ],
        correct: 2,
        feedback: {
          zh: 'Osmosis是渗透，关注水与选择性通透膜；diffusion是扩散，更广泛。',
          en: 'Osmosis concerns water and a selectively permeable membrane. Diffusion is a broader process.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
    ],
    mission: {
      zh: '选浓外液与稀外液，对照起始水净趋势和细胞壁/膜的位置。用英文写Water moves both ways，并补充一个模型限制。',
      en: 'Compare dilute and concentrated outside solutions, initial water tendencies and wall/membrane positions. Write “Water moves both ways” and add one model limit.',
    },
  },
  {
    id: 'L032',
    title: {
      zh: '形状与交换效率',
      en: 'Shape and exchange',
    },
    minutes: 20,
    icon: '▤',
    summary: {
      zh: '一样多的材料，变小或变薄为什么有帮助？',
      en: 'Why might smaller or thinner pieces help at the same volume?',
    },
    hook: {
      zh: '同样一块材料，分成八块或者压成薄盒，总量没变，外表面和到中心的距离会怎样？用三种几何形状理解细胞尺寸，而不是比谁的动画跑得快。',
      en: 'The same material can form one block, eight pieces or a thin box. How do exposed area and centre distance change? Compare three geometries to understand cell size.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Cell size',
      url: 'https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells',
    },
    objectives: [
      {
        zh: '在相同体积下比较总外表面积及中心到最近表面的距离。',
        en: 'Compare exposed area and centre-to-nearest-face distance at equal volume.',
      },
      {
        zh: '把几何优势与真实交换条件区分开。',
        en: 'Separate geometric advantages from real exchange conditions.',
      },
    ],
    prediction: [
      {
        zh: '体积相同，外表面积必定相同',
        en: 'Equal volume guarantees equal exposed area',
      },
      {
        zh: '形状和分块会改变面积及距离',
        en: 'Shape and subdivision change area and distance',
      },
      {
        zh: '小块一定能保证细胞健康',
        en: 'Smaller blocks guarantee cell health',
      },
    ],
    terms: [
      {
        word: {
          zh: '表面积',
          en: 'surface area',
        },
        meaning: {
          zh: '本课指与外界接触的全部六面面积。',
          en: 'Area of all six exposed faces in this model.',
        },
      },
      {
        word: {
          zh: '体积',
          en: 'volume',
        },
        meaning: {
          zh: '物体占据空间的大小，本课三种配置都为8。',
          en: 'Space occupied; each configuration totals 8 here.',
        },
      },
      {
        word: {
          zh: '表面积与体积比',
          en: 'surface-area-to-volume ratio',
        },
        meaning: {
          zh: '总外表面积除以总体积，单位是长度的倒数。',
          en: 'Total exposed area divided by total volume, with inverse-length units.',
        },
      },
      {
        word: {
          zh: '交换表面',
          en: 'exchange surface',
        },
        meaning: {
          zh: '物质与环境之间交换所经过的表面。',
          en: 'A surface across which substances exchange with the environment.',
        },
      },
      {
        word: {
          zh: '扩散距离',
          en: 'diffusion distance',
        },
        meaning: {
          zh: '粒子需经过的距离；几何中心距离只是其中一个线索。',
          en: 'Distance particles must travel; geometric centre distance is one clue.',
        },
      },
    ],
    questions: [
      {
        id: 'L032-q1',
        skill: 'concept',
        prompt: {
          zh: '相同总体积8，八个分开放置的小立方体与一个大立方体相比？',
          en: 'At total volume 8, how do eight separate small cubes compare with one large cube?',
        },
        options: [
          {
            zh: '总外表面积更小',
            en: 'Less total exposed area',
          },
          {
            zh: '总外表面积更大，48而非24',
            en: 'More total exposed area: 48 rather than 24',
          },
          {
            zh: '体积变成64',
            en: 'Volume becomes 64',
          },
        ],
        correct: 1,
        feedback: {
          zh: '小块每个六面都暴露，总面积8×6=48；总体积仍8。若紧贴成团，接触面不能算外露面积。',
          en: 'All six faces of each separate cube are exposed: 8×6=48 total area, with volume 8. Touching faces in a cluster are not exposed area.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L032-q2',
        skill: 'concept',
        prompt: {
          zh: '4×2×1的薄盒中心到最近表面距离是多少？',
          en: 'What is the centre-to-nearest-face distance in a 4×2×1 box?',
        },
        options: [
          {
            zh: '0.5个长度单位',
            en: '0.5 length units',
          },
          {
            zh: '4个长度单位',
            en: '4 length units',
          },
          {
            zh: '28个长度单位',
            en: '28 length units',
          },
        ],
        correct: 0,
        feedback: {
          zh: '最近表面沿最薄的1单位方向，中心距离为1÷2=0.5。面积28不是长度。',
          en: 'The nearest face is along the thinnest dimension, 1, so centre distance is 1÷2=0.5. Area 28 is not a length.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L032-q3',
        skill: 'reasoning',
        prompt: {
          zh: '薄盒与大立方体体积一样，能仅凭图断言真实细胞交换速度吗？',
          en: 'A thin box and big cube have equal volumes. Can the drawing alone predict real cell exchange speed?',
        },
        options: [
          {
            zh: '能，所有细胞只由形状决定',
            en: 'Yes; shape alone determines every cell',
          },
          {
            zh: '能，播放速度就是实际交换速度',
            en: 'Yes; playback speed measures exchange',
          },
          {
            zh: '不能；面积、距离有帮助，还需膜通透性、驱动力等条件',
            en: 'No; area and distance help, but permeability, driving conditions and more matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '几何模型只给面积、体积与距离。真实交换还受膜性质、运输蛋白、环境和需求影响，不能由图算存活率。',
          en: 'The geometric model gives area, volume and distance, not exchange rates. Membranes, proteins, environment and demand also matter; survival is not calculated.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
      {
        id: 'L032-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'surface-area-to-volume ratio对应哪一项？',
          en: 'Which quantity is surface-area-to-volume ratio?',
        },
        options: [
          {
            zh: '表面积 ÷ 体积',
            en: 'Surface area divided by volume',
          },
          {
            zh: '总粒子数',
            en: 'Total particle count',
          },
          {
            zh: '温度 ÷ 时间',
            en: 'Temperature divided by time',
          },
        ],
        correct: 0,
        feedback: {
          zh: '表面积/体积是每单位体积对应多少外表面积，有长度的倒数单位，不是没有单位的百分数。',
          en: 'Area/volume gives exposed area per volume, with inverse-length units. It is not a unitless percentage.',
        },
        revisit: {
          zh: '回看模型、讲解和证据。',
          en: 'Revisit the model, explanation and evidence.',
        },
      },
    ],
    mission: {
      zh: '对比大立方体与八个分离小块，记录相同体积、不同面积和距离。写为什么有帮助，以及为什么不能据此保证真实细胞交换速度。',
      en: 'Compare the large cube with eight separate cubes, recording equal volume, area and distance. Explain the advantage and why real exchange speed is not guaranteed.',
    },
  },
];
