import type { Lesson } from './lessons';

export const level19Lessons: Lesson[] = [
  {
    id: 'soda-bubbles-evidence-chain',
    levelId: 'problem-solving',
    order: 68,
    title: {
      zh: '汽水为什么会喷？把线索串成一个解释',
      en: 'Why does soda fizz over? Build one explanation from clues',
    },
    eyebrow: {
      zh: '第 68 课 · 用溶解度、压强和证据一起推理',
      en: 'Lesson 68 · Reason with solubility, pressure and evidence together',
    },
    hook: {
      zh: '一瓶冰镇汽水安静地放着；摇一摇、等它变暖，或猛地打开时，泡沫为什么会突然冲出来？“里面有气”只是开头，真正的解释要把压力、溶解、温度和气泡出现的位置串起来。',
      en: 'A chilled soda bottle sits quietly. Why can shaking it, warming it, or opening it quickly make foam surge out? “It has gas inside” is only the start; a real explanation links pressure, dissolving, temperature and where bubbles begin.',
    },
    hookHint: {
      zh: '密封时，较高压强帮助二氧化碳留在液体中；开盖后压强骤降，更多二氧化碳离开溶液。变暖会降低气体在水中的溶解度，摇晃则制造许多气泡容易开始生长的位置。',
      en: 'When sealed, higher pressure helps carbon dioxide remain dissolved. Opening drops pressure, so more carbon dioxide leaves solution. Warming lowers gas solubility in water, while shaking creates many places where bubbles can start growing.',
    },
    bigIdea: {
      zh: '好的化学解释会区分不同因素各自做了什么：开盖改变压强，升温改变溶解度，摇晃加快气泡形成。它们能一起让喷涌更明显，但不是同一个原因的重复说法。',
      en: 'A good chemistry explanation separates what each factor does: opening changes pressure, warming changes solubility, and shaking speeds bubble formation. Together they can make a bigger fizz, but they are not repeats of one cause.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🧊',
        title: {
          zh: '冰镇并非只为口感',
          en: 'Chilling is not only about taste',
        },
        body: {
          zh: '较冷的液体通常能溶解更多气体，所以冰镇汽水开盖时往往更平静一些。这是趋势而非保证，瓶子状态和打开方式也会影响结果。',
          en: 'Colder liquids can usually dissolve more gas, so chilled soda often opens more calmly. This is a trend, not a guarantee; bottle condition and opening method also matter.',
        },
      },
      {
        icon: '🫧',
        title: {
          zh: '摇晃提供气泡“起跑点”',
          en: 'Shaking provides bubble starting points',
        },
        body: {
          zh: '摇晃不会凭空制造更多二氧化碳，但会在液体中形成和分散许多微小气泡。开盖降压后，它们可更快长大，带着液体形成泡沫。',
          en: 'Shaking does not create carbon dioxide from nowhere, but it forms and spreads tiny bubbles in the liquid. After pressure drops on opening, they can grow faster and carry liquid into foam.',
        },
      },
      {
        icon: '🧠',
        title: {
          zh: '先分开变量，才看得清原因',
          en: 'Separate variables to see causes clearly',
        },
        body: {
          zh: '若想比较温度影响，就尽量保持摇晃、瓶子大小和打开方式相同。一次同时改变所有条件，只能得到一个故事，难以得到清楚证据。',
          en: 'To compare temperature effects, keep shaking, bottle size and opening method as alike as possible. Changing everything at once creates a story, not clear evidence.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '第一层：密封时的平衡',
          en: 'Layer one: balance while sealed',
        },
        body: {
          zh: '瓶中有液体里的二氧化碳，也有上方空间里的二氧化碳。密封和压强让两者达到动态平衡：粒子仍在进出液体，但整体数量看起来稳定。',
          en: 'A bottle has carbon dioxide dissolved in liquid and carbon dioxide above it. Sealing and pressure create dynamic balance: particles still move in and out, but the overall amount looks stable.',
        },
      },
      {
        title: {
          zh: '第二层：开盖改变压强',
          en: 'Layer two: opening changes pressure',
        },
        body: {
          zh: '开盖后上方空间的压强下降，原来的平衡被扰动。更多二氧化碳从液体离开，逐渐形成和长大为可见气泡，这就是听到嘶嘶声的关键原因。',
          en: 'When opened, pressure above the liquid falls and the old balance is disturbed. More carbon dioxide leaves the liquid, forming and growing into visible bubbles—key to the hiss you hear.',
        },
      },
      {
        title: {
          zh: '第三层：温度与摇晃放大现象',
          en: 'Layer three: temperature and shaking amplify it',
        },
        body: {
          zh: '温度更高时气体较难留在水中；摇晃让许多气泡核分散在液体里。它们不会取代“开盖降压”的作用，却能让气体更快以泡沫形式离开。',
          en: 'At higher temperature, gas is less willing to stay dissolved in water; shaking spreads many bubble nuclei. These do not replace the role of pressure drop, but can let gas escape faster as foam.',
        },
      },
    ],
    misconception: {
      zh: '“摇晃后喷出来，是因为摇晃产生了新的气体”不对。主要气体本来就在瓶中；摇晃改变的是气泡形成与增长的条件。开盖后的压强下降才让更多已存在的气体离开液体。',
      en: '“A shaken bottle fizzes because shaking creates new gas” is wrong. Most of the gas was already in the bottle; shaking changes the conditions for bubbles to form and grow. The pressure drop after opening lets more existing gas leave the liquid.',
    },
    mission: {
      zh: '解释编辑：为“汽水喷出”写三句因果链，分别包含压强、温度和摇晃。每句都写清一个变量改变了什么；不要为了验证而故意摇晃或快速打开饮料。',
      en: 'Explanation editor: write a three-sentence causal chain for soda fizzing, including pressure, temperature and shaking. In each sentence state what one variable changes; do not deliberately shake or rapidly open drinks to test it.',
    },
    vocabulary: [
      { en: 'solubility', zh: '溶解度' },
      { en: 'pressure', zh: '压强' },
      { en: 'dynamic equilibrium', zh: '动态平衡' },
      { en: 'bubble nucleus', zh: '气泡核' },
      { en: 'variable', zh: '变量' },
    ],
    interactive: 'soda-evidence-lab',
    questions: [
      {
        id: 'soda-q1',
        prompt: {
          zh: '汽水开盖后，最直接改变的条件是什么？',
          en: 'What condition changes most directly when soda is opened?',
        },
        options: [
          {
            zh: '瓶内上方空间的压强下降',
            en: 'Pressure in the space above the liquid falls',
          },
          {
            zh: '二氧化碳突然被创造出来',
            en: 'Carbon dioxide is suddenly created',
          },
          {
            zh: '液体自动变成固体',
            en: 'The liquid automatically becomes solid',
          },
        ],
        answer: 0,
        explanation: {
          zh: '开盖让密封系统与外界相通，上方气体压强下降，原有溶解平衡被打破。',
          en: 'Opening connects the sealed system to outside air, lowering gas pressure above the liquid and disturbing the old dissolved-gas balance.',
        },
      },
      {
        id: 'soda-q2',
        prompt: {
          zh: '为什么摇晃会让开盖后的泡沫更容易迅速出现？',
          en: 'Why can shaking make foam appear faster after opening?',
        },
        options: [
          {
            zh: '它分散出许多气泡容易开始和长大的位置',
            en: 'It spreads many places where bubbles can start and grow',
          },
          {
            zh: '它把氧气变成二氧化碳',
            en: 'It turns oxygen into carbon dioxide',
          },
          {
            zh: '它使压强永远不变',
            en: 'It makes pressure stay unchanged forever',
          },
        ],
        answer: 0,
        explanation: {
          zh: '摇晃主要影响气泡核和混合状态；降压后这些小气泡更容易长大。',
          en: 'Shaking mainly affects bubble nuclei and mixing; after pressure drops, those small bubbles can grow more readily.',
        },
      },
      {
        id: 'soda-q3',
        prompt: {
          zh: '若只研究温度对喷涌的影响，哪种实验比较更公平？',
          en: 'If studying only temperature’s effect on fizzing, which comparison is fairer?',
        },
        options: [
          {
            zh: '使用相同饮料和瓶子，保持摇晃与打开方式一致，只改变温度',
            en: 'Use the same drink and bottles, keep shaking and opening method alike, and change only temperature',
          },
          {
            zh: '一瓶摇晃一瓶不摇，同时换不同饮料',
            en: 'Shake one, do not shake the other, and change the drink too',
          },
          {
            zh: '只凭一次看到的泡沫高度下结论',
            en: 'Conclude from one foam height observation',
          },
        ],
        answer: 0,
        explanation: {
          zh: '一次只改变一个变量，才能更有把握把观察到的差异联系到温度。',
          en: 'Change one variable at a time to more confidently connect an observed difference to temperature.',
        },
      },
      {
        id: 'soda-q4',
        prompt: {
          zh: '哪一组解释最完整？',
          en: 'Which explanation is most complete?',
        },
        options: [
          {
            zh: '开盖降压使 CO₂ 更易离开；温度和气泡核会影响它离开的速度和泡沫',
            en: 'Opening lowers pressure so CO₂ leaves more easily; temperature and bubble nuclei affect the speed and foam',
          },
          {
            zh: '喷涌只有一个原因：瓶子里有水',
            en: 'There is only one cause: water is in the bottle',
          },
          {
            zh: '摇晃创造所有气体，所以压强无关',
            en: 'Shaking creates all gas, so pressure is irrelevant',
          },
        ],
        answer: 0,
        explanation: {
          zh: '综合解释需要保留每个变量的不同作用，而不是把所有现象归结为单一模糊原因。',
          en: 'An integrated explanation keeps each variable’s different role instead of reducing every observation to one vague cause.',
        },
      },
    ],
  },
  {
    id: 'keep-it-warm-material-design',
    levelId: 'problem-solving',
    order: 69,
    title: {
      zh: '保温杯为什么保温？给热量找三条逃跑路线',
      en: 'Why does a travel mug keep warm? Find heat’s three escape routes',
    },
    eyebrow: {
      zh: '第 69 课 · 用能量模型做一次材料设计',
      en: 'Lesson 69 · Use an energy model to design a material',
    },
    hook: {
      zh: '同样装着热饮的两个杯子，一个很快变凉，另一个几个小时后仍温热。它不是把“热锁住”，而是让热量更难沿不同路线离开。哪些设计真的有用？怎样公平地比较它们？',
      en: 'Two cups hold the same hot drink: one cools quickly, while the other stays warm for hours. It does not “lock heat in”; it makes heat harder to leave by different routes. Which designs help, and how could we compare them fairly?',
    },
    hookHint: {
      zh: '热量可通过传导、对流和辐射转移。盖子能减少上方空气流动和蒸发；真空或泡沫夹层能减弱传导与对流；明亮表面可减少部分热辐射。',
      en: 'Thermal energy transfers by conduction, convection and radiation. A lid reduces air movement and evaporation at the top; vacuum or foam layers reduce conduction and convection; bright surfaces can reduce some thermal radiation.',
    },
    bigIdea: {
      zh: '材料设计不是找到唯一“最好”的杯子，而是识别热量主要走哪条路线，再用针对性的结构减慢它。公平测试要控制杯子大小、起始温度、液体体积和时间。',
      en: 'Material design is not finding one universally “best” cup. It identifies heat’s main routes, then uses targeted structure to slow them. A fair test controls cup size, starting temperature, liquid volume and time.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '☕',
        title: {
          zh: '杯盖不只防洒',
          en: 'A lid does more than prevent spills',
        },
        body: {
          zh: '盖子减少杯口上方暖空气对流，也减少蒸发带走能量。它不会让热量完全消失；杯壁和底部仍会继续传热。',
          en: 'A lid reduces convection of warm air above the cup and reduces energy lost by evaporation. It does not stop all heat loss; walls and base still transfer energy.',
        },
      },
      {
        icon: '🧱',
        title: { zh: '夹层是热量路线的障碍', en: 'A layer blocks heat routes' },
        body: {
          zh: '真空层中粒子很少，能传导或形成对流的材料也少；泡沫里的空气小空间同样能减慢传热。这是结构如何改变性能的例子。',
          en: 'A vacuum layer has very few particles to conduct heat or form convection; small air spaces in foam can also slow transfer. This is structure changing performance.',
        },
      },
      {
        icon: '📊',
        title: {
          zh: '比较“保温”要先定规则',
          en: 'Set rules before comparing warmth',
        },
        body: {
          zh: '若一杯装得更多、起点更热、放在不同风口，温度差不能只归因于杯子材料。好结论来自控制变量与重复读数。',
          en: 'If one cup holds more, starts hotter or sits in a different draft, a temperature difference cannot be blamed only on material. Good conclusions come from controlled variables and repeat readings.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '传导：粒子接力传能量',
          en: 'Conduction: particles pass energy along',
        },
        body: {
          zh: '杯壁中相邻粒子的相互作用会把能量从热的一侧传向冷的一侧。厚一点、导热较慢的材料或夹层，能让这条接力变慢。',
          en: 'Interactions between neighbouring particles in a cup wall pass energy from the hotter side to the cooler side. Thicker, slower-conducting materials or layers can slow this relay.',
        },
      },
      {
        title: {
          zh: '对流与蒸发：上方的热空气也会流走',
          en: 'Convection and evaporation: warm air above can leave too',
        },
        body: {
          zh: '液面上方的暖空气会上升，被更冷空气替代；蒸发的水分子也会带走能量。盖子能显著减慢这些过程，但要按产品说明安全使用。',
          en: 'Warm air above a liquid rises and is replaced by cooler air; evaporating water molecules also carry energy away. A lid can slow these processes, but products must be used safely as instructed.',
        },
      },
      {
        title: {
          zh: '辐射：不需要接触也能传能量',
          en: 'Radiation: energy can travel without contact',
        },
        body: {
          zh: '所有物体都能以电磁波形式辐射能量。某些明亮表面能反射较多红外辐射，帮助减少辐射散热；真实保温效果仍是多条路线共同决定的。',
          en: 'All objects can radiate energy as electromagnetic waves. Some bright surfaces reflect more infrared radiation and can reduce radiative heat loss; real insulation still comes from several routes together.',
        },
      },
    ],
    misconception: {
      zh: '“保温杯会制造热量”不对。它只是在热饮比周围温暖时减慢能量流出；若里面是冷饮，同样的设计也会减慢周围热量流入。',
      en: '“An insulated cup creates heat” is wrong. It only slows energy flowing out when a drink is warmer than surroundings; for a cold drink, the same design slows energy flowing in.',
    },
    mission: {
      zh: '设计审稿人：为比较两只杯子的保温效果，写下四个要保持相同的条件，并说明一个你会测量的结果。不要用沸水自行做测试；可只观察产品结构或使用公开数据。',
      en: 'Design reviewer: to compare the insulation of two cups, list four conditions you would keep the same and one result you would measure. Do not run a boiling-water test yourself; observe product structure or use public data instead.',
    },
    vocabulary: [
      { en: 'conduction', zh: '传导' },
      { en: 'convection', zh: '对流' },
      { en: 'thermal radiation', zh: '热辐射' },
      { en: 'insulation', zh: '隔热 / 保温' },
      { en: 'controlled variable', zh: '控制变量' },
    ],
    interactive: 'heat-loss-design-lab',
    questions: [
      {
        id: 'heat-q1',
        prompt: {
          zh: '给热饮加盖最直接减慢哪两条热量路线？',
          en: 'Which two heat-loss routes does a lid most directly slow for a hot drink?',
        },
        options: [
          {
            zh: '杯口的对流和蒸发',
            en: 'Convection and evaporation at the cup opening',
          },
          { zh: '所有传导立刻停止', en: 'All conduction stops instantly' },
          { zh: '热量被制造出来', en: 'Heat is created' },
        ],
        answer: 0,
        explanation: {
          zh: '盖子限制暖空气交换并减少蒸发，但杯壁和底部仍可传导能量。',
          en: 'A lid limits warm-air exchange and reduces evaporation, though walls and base can still conduct energy.',
        },
      },
      {
        id: 'heat-q2',
        prompt: {
          zh: '真空夹层为什么有助于保温？',
          en: 'Why does a vacuum layer help insulation?',
        },
        options: [
          {
            zh: '粒子很少，传导和对流都更难进行',
            en: 'There are few particles, making conduction and convection harder',
          },
          { zh: '真空会制造新的热量', en: 'A vacuum creates new heat' },
          { zh: '真空让液体变成金属', en: 'A vacuum turns liquid into metal' },
        ],
        answer: 0,
        explanation: {
          zh: '传导与对流都依赖物质粒子；真空中粒子极少，因此这些路线被大幅削弱。',
          en: 'Conduction and convection depend on material particles; a vacuum has very few, greatly weakening both routes.',
        },
      },
      {
        id: 'heat-q3',
        prompt: {
          zh: '比较两只杯子的保温效果时，哪项应控制一致？',
          en: 'What should be kept the same when comparing two cups’ insulation?',
        },
        options: [
          {
            zh: '液体体积、起始温度、测量时间和环境',
            en: 'Liquid volume, starting temperature, measurement time and environment',
          },
          {
            zh: '让一只杯子有盖、另一只无盖，再只比较材料',
            en: 'Give one cup a lid, the other none, then compare only material',
          },
          {
            zh: '每只杯子装不同饮料并只测一次',
            en: 'Use different drinks and measure only once',
          },
        ],
        answer: 0,
        explanation: {
          zh: '控制这些因素能让差异更可能来自你想研究的杯子结构，而不是其他条件。',
          en: 'Controlling these factors makes differences more likely to come from the cup structure you want to study.',
        },
      },
      {
        id: 'heat-q4',
        prompt: {
          zh: '保温杯装冷饮时，最准确的说法是什么？',
          en: 'What is most accurate for an insulated cup holding a cold drink?',
        },
        options: [
          {
            zh: '它会减慢周围热量流入，帮助冷饮变暖得更慢',
            en: 'It slows heat flowing in from surroundings, so the drink warms more slowly',
          },
          {
            zh: '它会让冷饮自动变得更冷',
            en: 'It makes a cold drink automatically colder',
          },
          { zh: '它只对热饮起作用', en: 'It only works for hot drinks' },
        ],
        answer: 0,
        explanation: {
          zh: '保温结构减慢能量转移的方向由温差决定；它不主动制造冷或热。',
          en: 'Insulation slows energy transfer in the direction set by temperature difference; it does not actively create cold or heat.',
        },
      },
    ],
  },
  {
    id: 'sand-salt-water-recovery',
    levelId: 'problem-solving',
    order: 70,
    title: {
      zh: '沙、盐、水：把三样东西分别找回来',
      en: 'Sand, salt and water: recover all three',
    },
    eyebrow: {
      zh: '第 70 课 · 从粒子性质设计分离流程',
      en: 'Lesson 70 · Design a separation using particle properties',
    },
    hook: {
      zh: '你拿到一杯混合物：100 g 水、10 g 已溶解的盐和 5 g 沙。挑战是分别找回三样东西。过滤后水变清了，盐是不是也被留下了？如果把水蒸干，你真的完成任务了吗？',
      en: 'You have a mixture: 100 g water, 10 g dissolved salt and 5 g sand. Your challenge is to recover all three separately. Filtering makes the water clear, but does it keep the salt behind? If you evaporate the water away, have you really finished?',
    },
    hookHint: {
      zh: '先问每种成分有什么不同：沙不溶，盐已经分散成溶液中的离子，水能蒸发再冷凝。分离方法要利用这些差异，也要记住任务要求保留水。',
      en: 'First ask how the components differ: sand is insoluble, salt is dispersed as ions in solution, and water can evaporate and condense. Use these differences while remembering that the task requires keeping the water.',
    },
    bigIdea: {
      zh: '选择分离方法，要把“成分的性质”和“想保留的东西”一起考虑。过滤先留下沙；蒸馏再把盐水中的水收集回来，盐留在原容器中。',
      en: 'Choose a separation by considering both component properties and what you want to keep. Filtering retains sand; distillation then collects water from the salt solution while salt stays in the original vessel.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '☕',
        title: {
          zh: '咖啡滤纸挡住什么？',
          en: 'What does a coffee filter hold back?',
        },
        body: {
          zh: '滤纸留下较大的咖啡渣，但许多溶解的香味和颜色成分随水通过。想一想：咖啡经过过滤后，为什么仍然有颜色？',
          en: 'Filter paper holds larger grounds back, while many dissolved flavour and colour components pass through with water. Why does coffee still have colour after filtering?',
        },
      },
      {
        icon: '🧂',
        title: {
          zh: '晒盐想要的是盐',
          en: 'Salt making aims to keep the salt',
        },
        body: {
          zh: '盐水失去水后，盐能以固体形式留下。如果目标只是收盐，让水蒸发有用；如果还要回收水，就得加上收集和冷凝这一步。',
          en: 'When salt water loses water, salt can remain as a solid. Evaporation is useful if only salt is wanted; recovering water also needs collection and condensation.',
        },
      },
      {
        icon: '🔄',
        title: {
          zh: '回收流程也有能量账本',
          en: 'Recovery has an energy cost too',
        },
        body: {
          zh: '蒸馏利用汽化与冷凝，需要供热和冷却。设计流程时，除了分得开，还要比较能量、用时和材料损失。',
          en: 'Distillation uses vaporisation and condensation, requiring heating and cooling. A design must consider energy, time and material losses as well as separation.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先列性质，不急着选工具',
          en: 'List properties before choosing tools',
        },
        body: {
          zh: '在这个模型中，沙颗粒不溶于水，盐已溶解，且盐在水蒸馏的条件下不易挥发。普通滤纸能留下沙，却不能把溶解的盐离子从水中筛出。',
          en: 'In this model, sand particles do not dissolve, salt is dissolved, and salt is non-volatile under water-distillation conditions. Ordinary filter paper retains sand but cannot sieve dissolved salt ions out of water.',
        },
      },
      {
        title: {
          zh: '过滤后，做一次质量核对',
          en: 'After filtering, check the mass',
        },
        body: {
          zh: '假设没有洒出或残留损失：115 g 混合物 → 5 g 沙 + 110 g 盐水。盐水虽然清澈，但其中仍有 10 g 盐。看不见，不代表没有。',
          en: 'Assume no spills or material left behind: 115 g mixture → 5 g sand + 110 g salt solution. Although the solution is clear, it still contains 10 g salt. Invisible does not mean absent.',
        },
      },
      {
        title: { zh: '目标决定最后一步', en: 'The goal decides the last step' },
        body: {
          zh: '蒸发能留下盐，却让水进入周围空气；蒸馏把水蒸气引到另一处冷凝并收集。本课理想模型的最终核对为 5 g 沙 + 10 g 盐 + 100 g 水 = 115 g；真实实验会有转移损失和残留，要另行测量。',
          en: 'Evaporation leaves salt but sends water into surrounding air. Distillation sends water vapour elsewhere to condense and collect. The ideal final ledger is 5 g sand + 10 g salt + 100 g water = 115 g; real experiments have transfer losses and residues that must be measured.',
        },
      },
    ],
    misconception: {
      zh: '“水变清了，所有杂质就都除去了”不对。清澈只说明没有明显可见的悬浮颗粒；溶解的盐仍可能存在。本课只处理沙、盐、水三种成分，不能据此评价真实水样。',
      en: '“Clear water means every impurity is removed” is wrong. Clear only means no obvious visible suspended particles; dissolved salt may remain. This lesson handles only sand, salt and water, so it cannot evaluate real water samples.',
    },
    mission: {
      zh: '流程设计师：只在模型中先试“过滤 → 蒸发”，再重置试“过滤 → 蒸馏”。为每条流程写下沙、盐、水的最终去向，用一句话解释为什么只有一条满足“分别回收三样东西”。',
      en: 'Process designer: in the model, try “filter → evaporate,” then reset and try “filter → distil.” Record the final location of sand, salt and water for each route, and explain why only one recovers all three separately.',
    },
    vocabulary: [
      { en: 'filtrate', zh: '滤液' },
      { en: 'residue', zh: '残留物' },
      { en: 'distillation', zh: '蒸馏' },
      { en: 'condensation', zh: '冷凝' },
      { en: 'recovery', zh: '回收' },
    ],
    interactive: 'separation-recovery-lab',
    questions: [
      {
        id: 'recovery-q1',
        prompt: {
          zh: '过滤沙和盐水的混合物后，盐主要在哪里？',
          en: 'After filtering sand mixed with salt solution, where is most of the salt?',
        },
        options: [
          { zh: '全部留在滤纸上', en: 'All on the filter paper' },
          { zh: '仍溶解在滤液中', en: 'Still dissolved in the filtrate' },
          { zh: '已经消失', en: 'It has disappeared' },
        ],
        answer: 1,
        explanation: {
          zh: '普通滤纸挡住沙颗粒，盐离子随水通过。因此清澈滤液仍是盐水。',
          en: 'Ordinary filter paper retains sand particles while salt ions pass with water, so the clear filtrate is still salt solution.',
        },
      },
      {
        id: 'recovery-q2',
        prompt: {
          zh: '目标是同时保留盐和水，应选哪一步？',
          en: 'To keep both salt and water, which step should you choose?',
        },
        options: [
          {
            zh: '蒸发到周围空气中',
            en: 'Evaporate water into surrounding air',
          },
          {
            zh: '再用相同滤纸过滤一次',
            en: 'Filter again using the same paper',
          },
          {
            zh: '蒸馏，并冷凝收集水蒸气',
            en: 'Distil, condense and collect the water vapour',
          },
        ],
        answer: 2,
        explanation: {
          zh: '在盐不挥发的模型中，蒸馏让水转移到收集容器，盐留在原处；蒸发若不收集水，就达不到全部回收的目标。',
          en: 'In this non-volatile-salt model, distillation transfers water to a collector while salt stays behind. Evaporation without collecting water does not achieve full recovery.',
        },
      },
      {
        id: 'recovery-q3',
        prompt: {
          zh: '理想模型中，115 g 混合物过滤出 5 g 沙后，剩下多少盐水？',
          en: 'In the ideal model, 5 g sand is filtered from 115 g mixture. How much salt solution remains?',
        },
        options: [
          { zh: '110 g', en: '110 g' },
          { zh: '100 g', en: '100 g' },
          { zh: '10 g', en: '10 g' },
        ],
        answer: 0,
        explanation: {
          zh: '115 − 5 = 110 g，其中包括 100 g 水和 10 g 盐。先明确每个量包含哪些成分，再做计算。',
          en: '115 − 5 = 110 g, including 100 g water and 10 g salt. Identify which components each quantity includes before calculating.',
        },
      },
      {
        id: 'recovery-q4',
        prompt: {
          zh: '蒸发后没有收集到水，质量守恒失效了吗？',
          en: 'If water is not collected after evaporation, has conservation of mass failed?',
        },
        options: [
          {
            zh: '失效，因为水原子被消灭了',
            en: 'Yes, because water atoms were destroyed',
          },
          {
            zh: '没有；水蒸气进入空气，核对时也要算进去',
            en: 'No; water vapour entered the air and must be included in the ledger',
          },
          {
            zh: '失效，因为蒸发变成了化学反应',
            en: 'Yes, because evaporation became a chemical reaction',
          },
        ],
        answer: 1,
        explanation: {
          zh: '水只是改变状态和位置。没有回收到杯子里，不等于不存在；扩大核对范围就能找到去向。',
          en: 'Water changes state and location. Not recovering it in a cup does not mean it vanished; a wider ledger includes where it went.',
        },
      },
    ],
  },
];
