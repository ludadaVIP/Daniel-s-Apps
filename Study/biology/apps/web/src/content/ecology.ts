import type { Lesson } from '../schema';
export const ecologyLessons: Lesson[] = [
  {
    id: 'L017',
    title: {
      zh: '什么是栖息地？',
      en: 'What is a habitat?',
    },
    icon: '⌂',
    minutes: 15,
    summary: {
      zh: '同一个后院，为什么蜗牛常出现在不同的小角落？',
      en: 'Why can a snail favour one corner of the same garden?',
    },
    hook: {
      zh: '树荫下有落叶，旁边是晒热的铺路。两处只隔几步，却可能给蜗牛很不同的生活条件。栖息地只是一个地址吗？',
      en: 'A shady leaf patch sits beside sun-warmed paving. A few steps can mean different conditions for a snail. Is a habitat just an address?',
    },
    objectives: [
      {
        zh: '把栖息地与水分、温度、食物和遮蔽联系起来。',
        en: 'Connect habitat with moisture, temperature, food and cover.',
      },
      {
        zh: '区分生物因素与非生物因素，并说明它们的联系。',
        en: 'Distinguish biotic and abiotic factors and explain a connection.',
      },
    ],
    prediction: [
      {
        zh: '同一后院的条件完全一样',
        en: 'Every corner of one garden has identical conditions',
      },
      {
        zh: '小范围的水分、光照和生物关系也有差别',
        en: 'Moisture, light and living interactions can vary over small distances',
      },
      {
        zh: '只要有遮蔽，所有生物都一定适合',
        en: 'Cover alone makes a place suitable for every organism',
      },
    ],
    terms: [
      {
        word: {
          zh: '栖息地',
          en: 'habitat',
        },
        meaning: {
          zh: '一种生物生活的地方，包含它面对的条件与资源。',
          en: 'The place an organism lives, including its conditions and resources.',
        },
      },
      {
        word: {
          zh: '生物因素',
          en: 'biotic factor',
        },
        meaning: {
          zh: '环境中生物及其相互作用的影响。',
          en: 'Influences of living organisms and their interactions.',
        },
      },
      {
        word: {
          zh: '非生物因素',
          en: 'abiotic factor',
        },
        meaning: {
          zh: '水分、温度和光等非生命条件的影响。',
          en: 'Influences of nonliving conditions such as moisture, temperature and light.',
        },
      },
      {
        word: {
          zh: '生态系统',
          en: 'ecosystem',
        },
        meaning: {
          zh: '一个范围内的生物与非生物环境及它们的相互作用。',
          en: 'Organisms, their nonliving environment and interactions within an area.',
        },
      },
    ],
    mission: {
      zh: '从窗边或熟悉安全的地方观察两个小角落，记一条环境差异和一个待查问题。只观察，不移动动物或翻找栖身处。',
      en: 'Observe two corners from a window or familiar safe spot. Record one difference and a question, without moving animals or disturbing shelter.',
    },
    questions: [
      {
        id: 'L017-q1',
        skill: 'concept',
        prompt: {
          zh: '哪条描述的是非生物因素？',
          en: 'Which describes an abiotic factor?',
        },
        options: [
          {
            zh: '地面得到的光照',
            en: 'Light reaching the ground',
          },
          {
            zh: '蜗牛取食植物',
            en: 'A snail feeding on a plant',
          },
          {
            zh: '小鸟捕食昆虫',
            en: 'A bird eating insects',
          },
        ],
        correct: 0,
        feedback: {
          zh: '光照是非生命条件；取食与捕食涉及生物相互作用。它们可以同时影响同一个地方。',
          en: 'Light is a nonliving condition; feeding and predation involve living interactions. Both can influence the same place.',
        },
        revisit: {
          zh: '回看水分、光照与生物三类线索。',
          en: 'Compare moisture, light and living clues.',
        },
      },
      {
        id: 'L017-q2',
        skill: 'concept',
        prompt: {
          zh: '为什么“后院”两个字不能说明全部栖息条件？',
          en: 'Why does “garden” not describe every habitat condition?',
        },
        options: [
          {
            zh: '生物只需要一个地名',
            en: 'Organisms only need a place name',
          },
          {
            zh: '不同小角落的资源、遮蔽和物理条件可不同',
            en: 'Resources, cover and physical conditions can differ between corners',
          },
          {
            zh: '植物不会影响周围条件',
            en: 'Plants cannot affect nearby conditions',
          },
        ],
        correct: 1,
        feedback: {
          zh: '同一地点内也有微小差异；植物的遮荫能改变非生物条件。要联系具体生物的需要。',
          en: 'Small-scale differences matter within a site. Plant shade can alter nonliving conditions; consider the needs of a particular organism.',
        },
        revisit: {
          zh: '切换落叶处与铺路的四帧观察。',
          en: 'Compare the four leaf-patch and paving frames.',
        },
      },
      {
        id: 'L017-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一次在阴湿处看到蜗牛，能支持哪种说法？',
          en: 'A snail is seen once in a damp shaded spot. Which claim is supported?',
        },
        options: [
          {
            zh: '所有蜗牛永远只在这里',
            en: 'All snails always live only here',
          },
          {
            zh: '已经证明遮荫是唯一原因',
            en: 'Shade has been proved the only cause',
          },
          {
            zh: '这是一个可记录线索，还需重复观察与其他条件证据',
            en: 'It is a recorded clue; repeat observations and other condition evidence would help',
          },
        ],
        correct: 2,
        feedback: {
          zh: '一次出现不等于原因已经确定。时间、天气、食物和其他生物也值得记录。观察不到也不证明没有。',
          en: 'One sighting does not establish a cause. Time, weather, food and other organisms matter. Not seeing something does not prove absence.',
        },
        revisit: {
          zh: '回看第4帧的观察与解释。',
          en: 'Revisit observation and explanation in frame 4.',
        },
      },
      {
        id: 'L017-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '哪个词强调“生物生活的地方及其条件”？',
          en: 'Which word names the place an organism lives and its conditions?',
        },
        options: [
          {
            zh: 'population · 种群',
            en: 'population',
          },
          {
            zh: 'habitat · 栖息地',
            en: 'habitat',
          },
          {
            zh: 'digestion · 消化',
            en: 'digestion',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Habitat 是栖息地。Ecosystem 还强调范围内生物与非生物环境的相互作用。',
          en: 'Habitat names a living place; ecosystem emphasises interactions among living and nonliving components.',
        },
        revisit: {
          zh: '比较 habitat 与 ecosystem 词卡。',
          en: 'Compare habitat and ecosystem cards.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · the scope of ecology',
      url: 'https://openstax.org/books/biology-2e/pages/44-1-the-scope-of-ecology',
    },
  },
  {
    id: 'L018',
    title: {
      zh: '谁吃谁？',
      en: 'Who eats whom?',
    },
    icon: '↗',
    minutes: 20,
    summary: {
      zh: '瓢虫吃蚜虫，箭头为什么从蚜虫指向瓢虫？',
      en: 'If a ladybird eats an aphid, why does the arrow start at the aphid?',
    },
    hook: {
      zh: '后院的叶、蚜虫、毛虫和小鸟，好像各忙各的。把“谁吃谁”的观察连起来，为什么会出现一张网，而不只是一条链？',
      en: 'Leaves, aphids, caterpillars and birds seem busy on their own. Why do feeding observations form a web rather than one chain?',
    },
    objectives: [
      {
        zh: '按食物到取食者的方向画箭头，说明能量传递。',
        en: 'Draw arrows from food to feeder and explain energy transfer.',
      },
      {
        zh: '用多条取食关系区分食物链与食物网。',
        en: 'Distinguish a food chain from a web using several feeding links.',
      },
    ],
    prediction: [
      {
        zh: '箭头应该追着捕食者指向猎物',
        en: 'Arrows should follow the predator towards prey',
      },
      {
        zh: '箭头从食物指向取食者，表示能量传递',
        en: 'Arrows run from food to feeder, showing energy transfer',
      },
      {
        zh: '每种动物永远只能吃一种食物',
        en: 'Every animal can only ever eat one kind of food',
      },
    ],
    terms: [
      {
        word: {
          zh: '生产者',
          en: 'producer',
        },
        meaning: {
          zh: '能制造有机物的生物；这里以绿色植物为例。',
          en: 'An organism making organic substances; green plants are the example here.',
        },
      },
      {
        word: {
          zh: '消费者',
          en: 'consumer',
        },
        meaning: {
          zh: '通过取食其他生物或其产物获得有机物的生物。',
          en: 'An organism obtaining organic substances by feeding on organisms or their products.',
        },
      },
      {
        word: {
          zh: '食物链',
          en: 'food chain',
        },
        meaning: {
          zh: '按取食联系排列的一条能量传递路线。',
          en: 'One energy-transfer route organised by feeding relationships.',
        },
      },
      {
        word: {
          zh: '食物网',
          en: 'food web',
        },
        meaning: {
          zh: '多条相互连接的取食路线。',
          en: 'A network of connected feeding routes.',
        },
      },
    ],
    mission: {
      zh: '用课程证据卡画一张虚拟后院食物网。每个箭头旁写“食物→取食者”；若画真实后院，未知关系标为待查。',
      en: 'Use lesson evidence cards to draw a virtual garden food web. Label arrows food → feeder; mark unknown real-garden links as needing evidence.',
    },
    questions: [
      {
        id: 'L018-q1',
        skill: 'concept',
        prompt: {
          zh: '瓢虫吃蚜虫，课中箭头怎样画？',
          en: 'A ladybird eats aphids. Which arrow fits this lesson?',
        },
        options: [
          {
            zh: '瓢虫→蚜虫，因为追捕方向如此',
            en: 'Ladybird → aphid, following pursuit',
          },
          {
            zh: '蚜虫→瓢虫，因为食物中的能量传给取食者',
            en: 'Aphid → ladybird, following food energy',
          },
          {
            zh: '瓢虫→植物，绕开蚜虫',
            en: 'Ladybird → plant, skipping aphids',
          },
        ],
        correct: 1,
        feedback: {
          zh: '图例规定箭头从食物指向消费者，表示能量等的传递。它不表示动物追逐方向。',
          en: 'The legend defines food-to-consumer arrows for transfers including energy, not pursuit direction.',
        },
        revisit: {
          zh: '回看箭头图例和初始食物链。',
          en: 'Revisit the arrow legend and starting chain.',
        },
      },
      {
        id: 'L018-q2',
        skill: 'concept',
        prompt: {
          zh: '小鸟在课中吃毛虫也吃蚜虫，说明什么？',
          en: 'The model bird eats caterpillars and aphids. What does this show?',
        },
        options: [
          {
            zh: '多条链可以连成食物网',
            en: 'Several chains can form a food web',
          },
          {
            zh: '一条箭头代表所有真实鸟的食谱',
            en: 'One arrow defines the diet of every real bird',
          },
          {
            zh: '所有食物的能量全部传到小鸟',
            en: 'All food energy reaches the bird',
          },
        ],
        correct: 0,
        feedback: {
          zh: '多个食物来源使路线连接成网。此图只列选定关系，不含所有物种；能量在使用和传递中也会散为热。',
          en: 'Several food sources connect routes into a web. Selected links do not include every species; energy also disperses as heat during use and transfer.',
        },
        revisit: {
          zh: '加入鸟吃毛虫与鸟吃蚜虫两张证据卡。',
          en: 'Add the bird–caterpillar and bird–aphid evidence cards.',
        },
      },
      {
        id: 'L018-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只在照片里看到鸟和毛虫靠近，能立刻加取食箭头吗？',
          en: 'A photo shows a bird near a caterpillar. Can you immediately add a feeding arrow?',
        },
        options: [
          {
            zh: '可以，靠近就证明取食',
            en: 'Yes: proximity proves feeding',
          },
          {
            zh: '不能用任何观察研究取食',
            en: 'No observation can inform feeding',
          },
          {
            zh: '不够；还需取食观察或可靠食性资料',
            en: 'Not yet: feeding observations or reliable diet information are needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '共同出现是一条线索，不是取食已经发生的证据。课中证据卡是设定的虚拟取食观察；真实后院需要独立证据。',
          en: 'Co-occurrence is a clue, not evidence that feeding occurred. Lesson cards specify virtual observations; your garden needs separate evidence.',
        },
        revisit: {
          zh: '回看每张卡写的是“出现”还是“取食”。',
          en: 'Check whether cards state presence or feeding.',
        },
      },
      {
        id: 'L018-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '多条相连的取食路线叫什么？',
          en: 'What is a network of feeding routes called?',
        },
        options: [
          {
            zh: 'food chain · 食物链',
            en: 'food chain',
          },
          {
            zh: 'food web · 食物网',
            en: 'food web',
          },
          {
            zh: 'joint · 关节',
            en: 'joint',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Food web 是食物网；food chain 是其中一条简化路线。',
          en: 'A food web is the network; a food chain is one simplified route through it.',
        },
        revisit: {
          zh: '比较两张路线词卡。',
          en: 'Compare the two route cards.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · energy flow through ecosystems',
      url: 'https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems',
    },
  },
  {
    id: 'L019',
    title: {
      zh: '分解者的工作',
      en: 'Nature’s recyclers',
    },
    icon: '♻',
    minutes: 20,
    summary: {
      zh: '落叶变少了，里面的物质和能量都去了哪里？',
      en: 'As litter breaks down, where do its matter and energy go?',
    },
    hook: {
      zh: '树下不断掉叶子，落叶却不会永远原样堆着。“消失”了的叶子，变成了什么？跟踪物质和能量的两条不同旅程。',
      en: 'Leaves keep falling but do not stay intact forever. What does disappearing litter become? Follow two different journeys for matter and energy.',
    },
    objectives: [
      {
        zh: '解释部分真菌与细菌如何参与分解和物质循环。',
        en: 'Explain how some fungi and bacteria support decomposition and matter cycling.',
      },
      {
        zh: '区分矿质元素回到植物与能量逐渐散为热。',
        en: 'Distinguish mineral-element return from energy dispersal as heat.',
      },
    ],
    prediction: [
      {
        zh: '物质和能量都凭空消失',
        en: 'Matter and energy vanish',
      },
      {
        zh: '落叶里的能量也像矿质元素一样原路循环',
        en: 'Leaf energy cycles back just like mineral elements',
      },
      {
        zh: '部分物质可再被利用，能量转化并散为热',
        en: 'Some matter can be reused; energy transforms and disperses as heat',
      },
    ],
    terms: [
      {
        word: {
          zh: '分解者',
          en: 'decomposer',
        },
        meaning: {
          zh: '从有机残体取得物质与能量、参与分解的生物，如部分真菌和细菌。',
          en: 'An organism obtaining matter and energy from organic remains and helping break them down, such as some fungi and bacteria.',
        },
      },
      {
        word: {
          zh: '矿质营养',
          en: 'mineral nutrient',
        },
        meaning: {
          zh: '植物需要的无机营养；不是现成糖或光能。',
          en: 'An inorganic nutrient needed by plants, not ready-made sugar or light energy.',
        },
      },
      {
        word: {
          zh: '物质',
          en: 'matter',
        },
        meaning: {
          zh: '由原子等构成、能在不同物质形式间转移的东西。',
          en: 'Substances made of atoms that can transfer between different material forms.',
        },
      },
      {
        word: {
          zh: '能量',
          en: 'energy',
        },
        meaning: {
          zh: '可在过程里转移与转化，不能当作原料原子。',
          en: 'Something transferred and transformed in processes, not material atoms.',
        },
      },
    ],
    mission: {
      zh: '只看地面现有落叶或照片，记下完整叶和碎叶的差别。解释可能的过程，并指出只凭外观不能鉴定微生物或证明分解速度。',
      en: 'Observe existing litter or photos without handling it. Compare intact and fragmented leaves; explain a possible process and what appearance alone cannot establish.',
    },
    questions: [
      {
        id: 'L019-q1',
        skill: 'concept',
        prompt: {
          zh: '谁可以作为本课分解者的例子？',
          en: 'Which can be decomposer examples here?',
        },
        options: [
          {
            zh: '所有细菌与真菌，不论生活方式',
            en: 'Every bacterium and fungus, whatever its lifestyle',
          },
          {
            zh: '从落叶有机物获取物质和能量的部分真菌与细菌',
            en: 'Some fungi and bacteria obtaining matter and energy from litter',
          },
          {
            zh: '把阳光吸收进石头的过程',
            en: 'Sunlight entering stones',
          },
        ],
        correct: 1,
        feedback: {
          zh: '角色由生活方式决定，不是整个类群永远只有一种角色。分解者自己也是活的，需要物质与能量。',
          en: 'Roles depend on lifestyles rather than an entire group having one role. Decomposers are living organisms needing matter and energy.',
        },
        revisit: {
          zh: '回看落叶→分解者这一步。',
          en: 'Revisit litter → decomposers.',
        },
      },
      {
        id: 'L019-q2',
        skill: 'concept',
        prompt: {
          zh: '哪一句正确区分物质与能量？',
          en: 'Which distinguishes matter from energy?',
        },
        options: [
          {
            zh: '矿质元素可被植物再利用；部分能量散为热',
            en: 'Plants can reuse mineral elements; some energy disperses as heat',
          },
          {
            zh: '能量变成矿质元素，直接制造叶子的全部碳',
            en: 'Energy turns into minerals supplying all leaf carbon',
          },
          {
            zh: '热会自动变回同一片叶里的化学能',
            en: 'Heat automatically returns as chemical energy in the same leaf',
          },
        ],
        correct: 0,
        feedback: {
          zh: '元素在不同形式间转移；能量转移和转化。植物制造糖的碳主要来自二氧化碳，不是土壤矿质营养。',
          en: 'Elements transfer between forms while energy transfers and transforms. Carbon for plant sugars mainly comes from carbon dioxide, not soil minerals.',
        },
        revisit: {
          zh: '切换矿质元素与能量两条路线。',
          en: 'Compare mineral-element and energy routes.',
        },
      },
      {
        id: 'L019-q3',
        skill: 'reasoning',
        prompt: {
          zh: '看到落叶碎了，最有根据的记录是哪句？',
          en: 'Which record is best supported by fragmented leaves?',
        },
        options: [
          {
            zh: '已经证明是哪一种细菌分解的',
            en: 'The exact bacterial species has been proved',
          },
          {
            zh: '所有碎裂一定只由真菌造成',
            en: 'Fungi must cause every fragment',
          },
          {
            zh: '叶子变碎是观察；分解、踩踏或其他作用都需进一步辨别',
            en: 'Fragmentation is observed; decomposition, trampling and other processes need investigation',
          },
        ],
        correct: 2,
        feedback: {
          zh: '外观能提供线索，但机械破碎也会改变叶子。鉴定分解者与速率需要另外的证据。',
          en: 'Appearance offers clues, but mechanical breakage also changes litter. Identifying decomposers and rates requires additional evidence.',
        },
        revisit: {
          zh: '回看误区中的碎叶例子。',
          en: 'Revisit the fragmented-leaf example.',
        },
      },
      {
        id: 'L019-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '哪个词表示参与分解有机残体的生物？',
          en: 'Which word names an organism helping break down organic remains?',
        },
        options: [
          {
            zh: 'producer · 生产者',
            en: 'producer',
          },
          {
            zh: 'decomposer · 分解者',
            en: 'decomposer',
          },
          {
            zh: 'alveolus · 肺泡',
            en: 'alveolus',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Decomposer 是分解者。生产者可以制造有机物；这两个生态角色描述不同的物质与能量取得方式。',
          en: 'Decomposer names this role. Producers make organic substances; these roles describe different ways of obtaining matter and energy.',
        },
        revisit: {
          zh: '复习 decomposer 词卡。',
          en: 'Revisit decomposer.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · biogeochemical cycles',
      url: 'https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles',
    },
  },
  {
    id: 'L020',
    title: {
      zh: '如果少了一种生物？',
      en: 'What if a species disappears?',
    },
    icon: '⋯',
    minutes: 20,
    summary: {
      zh: '少了瓢虫，为什么植物也可能受影响？',
      en: 'Why might fewer ladybirds affect plants too?',
    },
    hook: {
      zh: '虚拟后院的一种食蚜瓢虫不见了。蚜虫一定暴增，植物一定死掉吗？试着沿关系找影响，再检查其他取食路线和未知条件。',
      en: 'An aphid-eating ladybird species disappears locally in a virtual garden. Must aphids boom and plants die? Trace links, then check other feeding routes and unknown conditions.',
    },
    objectives: [
      {
        zh: '从直接取食关系推理可能的间接影响。',
        en: 'Infer possible indirect effects from direct feeding links.',
      },
      {
        zh: '说明其他捕食者与环境为何使预测有条件。',
        en: 'Explain why other predators and conditions make predictions conditional.',
      },
    ],
    prediction: [
      {
        zh: '瓢虫少了，植物必然马上全部死去',
        en: 'Fewer ladybirds make all plants die immediately',
      },
      {
        zh: '可能发生连锁影响，但还要看其他关系与条件',
        en: 'Cascade effects are possible but depend on other links and conditions',
      },
      {
        zh: '没有植物→瓢虫箭头，植物就绝不会受影响',
        en: 'Without plant → ladybird, plants can never be affected',
      },
    ],
    terms: [
      {
        word: {
          zh: '种群',
          en: 'population',
        },
        meaning: {
          zh: '同一时间、同一区域内同种生物的个体集合。',
          en: 'Individuals of one species in one area at the same time.',
        },
      },
      {
        word: {
          zh: '捕食',
          en: 'predation',
        },
        meaning: {
          zh: '一种生物取食另一种生物的关系。',
          en: 'A relationship in which an organism feeds on another.',
        },
      },
      {
        word: {
          zh: '间接影响',
          en: 'indirect effect',
        },
        meaning: {
          zh: '经其他生物或条件传递的影响。',
          en: 'An effect transmitted through other organisms or conditions.',
        },
      },
      {
        word: {
          zh: '不确定性',
          en: 'uncertainty',
        },
        meaning: {
          zh: '证据或模型不足以唯一确定结果的状态。',
          en: 'When evidence or a model cannot uniquely determine an outcome.',
        },
      },
    ],
    mission: {
      zh: '为真实或虚拟后院画食物网，挑一条变化路线，用“可能…因为…还需…”写解释；真实关系未知就标待查，不改变真实生物数量。',
      en: 'Draw a real or virtual garden web. Explain a change with “might … because … we still need …”. Mark unknown links and leave real populations unchanged.',
    },
    questions: [
      {
        id: 'L020-q1',
        skill: 'concept',
        prompt: {
          zh: '一种食蚜瓢虫本地消失，最直接改变哪条联系？',
          en: 'Which link changes most directly when the aphid-eating ladybird disappears locally?',
        },
        options: [
          {
            zh: '蚜虫被这种瓢虫捕食的联系',
            en: 'Aphids being eaten by that ladybird',
          },
          {
            zh: '植物接收阳光的所有过程',
            en: 'Every process of plants receiving light',
          },
          {
            zh: '所有其他动物的全部食物来源',
            en: 'Every other animal’s entire food supply',
          },
        ],
        correct: 0,
        feedback: {
          zh: '先从直接取食联系开始。影响可能再沿其他联系传播，但不能把所有变化都当成直接结果。',
          en: 'Start with the direct feeding link. Effects may spread through other connections without making every change a direct result.',
        },
        revisit: {
          zh: '看瓢虫不在时失去的箭头。',
          en: 'Look at the lost arrow when ladybirds are absent.',
        },
      },
      {
        id: 'L020-q2',
        skill: 'concept',
        prompt: {
          zh: '还保留鸟吃蚜虫的路线，意味着什么？',
          en: 'What does retaining the bird–aphid link mean?',
        },
        options: [
          {
            zh: '已经保证蚜虫数量完全不变',
            en: 'Aphid numbers are guaranteed unchanged',
          },
          {
            zh: '蚜虫仍有另一种捕食联系，影响可能不同',
            en: 'Another predation link remains, so the effect may differ',
          },
          {
            zh: '鸟必然立刻补上全部瓢虫的捕食量',
            en: 'Birds immediately replace all ladybird predation',
          },
        ],
        correct: 1,
        feedback: {
          zh: '另一条路线可能缓冲变化，但效果取决于鸟数量、取食选择和环境。箭头本身没有给出捕食量。',
          en: 'Another route may buffer change, depending on bird numbers, diet choices and conditions. An arrow does not specify predation amount.',
        },
        revisit: {
          zh: '切换鸟吃蚜虫这条关系。',
          en: 'Toggle the bird–aphid relationship.',
        },
      },
      {
        id: 'L020-q3',
        skill: 'reasoning',
        prompt: {
          zh: '“瓢虫不吃植物，所以它消失不可能影响植物。”怎样修正？',
          en: 'Revise “Ladybirds do not eat plants, so their disappearance cannot affect plants”.',
        },
        options: [
          {
            zh: '瓢虫消失只会影响吃瓢虫的生物',
            en: 'Ladybird loss affects only organisms eating ladybirds',
          },
          {
            zh: '没有直接箭头，就不会有间接影响',
            en: 'Without a direct arrow, there can be no indirect effect',
          },
          {
            zh: '瓢虫影响蚜虫，蚜虫取食植物，可能传递间接影响',
            en: 'Ladybirds affect aphids that feed on plants, so indirect effects are possible',
          },
        ],
        correct: 2,
        feedback: {
          zh: '通过蚜虫可连接到植物。方向合理不代表结论必然；还需数量、取食强度、天气与植物状态等证据。',
          en: 'Aphids connect the change to plants. A reasonable direction is not a guaranteed result; counts, feeding strength, weather and plant condition provide further evidence.',
        },
        revisit: {
          zh: '走完第2到第4帧，并写一个需要的证据。',
          en: 'Follow frames 2–4 and name one needed piece of evidence.',
        },
      },
      {
        id: 'L020-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '同一时地的一种生物个体集合，叫什么？',
          en: 'What is a group of one species in one area at one time?',
        },
        options: [
          {
            zh: 'ecosystem · 生态系统',
            en: 'ecosystem',
          },
          {
            zh: 'habitat · 栖息地',
            en: 'habitat',
          },
          {
            zh: 'population · 种群',
            en: 'population',
          },
        ],
        correct: 2,
        feedback: {
          zh: 'Population 是种群，不是所有物种混在一起的集合。图中的瓢虫节点代表课中选定的一种食蚜瓢虫。',
          en: 'Population refers to one species, not all species combined. The ladybird node represents the selected aphid-eating species.',
        },
        revisit: {
          zh: '复习 population 词卡。',
          en: 'Revisit population.',
        },
      },
    ],
    reference: {
      title: 'OpenStax Biology 2e · community ecology',
      url: 'https://openstax.org/books/biology-2e/pages/45-6-community-ecology',
    },
  },
];
