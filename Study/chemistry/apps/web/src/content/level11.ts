import type { Lesson } from './lessons';

export const level11Lessons: Lesson[] = [
  {
    id: 'dissolving-is-not-disappearing',
    levelId: 'solutions',
    order: 51,
    title: {
      zh: '溶解：不是消失，而是分散',
      en: 'Dissolving: not disappearing, but spreading',
    },
    eyebrow: {
      zh: '第 51 课 · 一杯糖水里的隐身旅行',
      en: 'Lesson 51 · An invisible journey in sugar water',
    },
    hook: {
      zh: '把一勺糖搅进水里，糖粒很快看不见了；喝一口却还是甜的。糖真的“消失”了吗？如果没有，它躲到了哪里？',
      en: 'Stir sugar into water and the crystals soon vanish from sight, yet a sip is still sweet. Did the sugar really disappear? If not, where did it go?',
    },
    hookHint: {
      zh: '糖没有消失，也没有变成空无。水分子把糖粒子从晶体表面拉开，让它们均匀分散在水分子之间；这叫溶解。',
      en: 'Sugar has not vanished into nothing. Water molecules pull sugar particles away from the crystal surface and spread them between water particles; that is dissolving.',
    },
    bigIdea: {
      zh: '溶液是均匀的混合物：溶质粒子分散在溶剂中，肉眼看不见不代表它们不在。溶解通常不是生成了新物质。',
      en: 'A solution is a uniform mixture: solute particles are dispersed in a solvent. Invisible does not mean absent, and dissolving usually does not make a new substance.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🍵',
        title: {
          zh: '甜茶为什么每一口都甜？',
          en: 'Why is every sip of sweet tea sweet?',
        },
        body: {
          zh: '糖粒子扩散到整杯液体中，形成均匀的糖水；如果只沉在杯底，上层就不会一样甜。',
          en: 'Sugar particles spread through the drink to make a uniform solution. If they stayed only at the bottom, the top would not taste equally sweet.',
        },
      },
      {
        icon: '🌊',
        title: { zh: '海水里的盐', en: 'Salt in seawater' },
        body: {
          zh: '海水含有溶解的盐。水蒸发后盐可以留下，说明盐并没有凭空消失。',
          en: 'Seawater contains dissolved salts. When water evaporates, salt can remain—evidence that it never vanished.',
        },
      },
      {
        icon: '🧼',
        title: { zh: '洗手液和饮料标签', en: 'Handwash and drink labels' },
        body: {
          zh: '许多透明液体都是溶液。标签上的“溶于水”“每 100 mL 含……”都在描述溶质和溶剂的关系。',
          en: 'Many clear liquids are solutions. “Soluble in water” and “per 100 mL” on labels describe the relationship between solute and solvent.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '认出两种角色', en: 'Spot the two roles' },
        body: {
          zh: '被溶解、数量通常较少的叫溶质，例如糖或盐；负责把它分散开的液体叫溶剂，例如水。一杯糖水中，糖是溶质，水是溶剂。',
          en: 'The material being dissolved, usually in the smaller amount, is the solute—such as sugar or salt. The liquid spreading it out is the solvent—such as water. In sugar water, sugar is solute and water is solvent.',
        },
      },
      {
        title: {
          zh: '从晶体表面，一颗颗离开',
          en: 'Leave the crystal surface, particle by particle',
        },
        body: {
          zh: '水分子不断碰撞并吸引晶体表面的粒子。粒子脱离后在液体中随机运动，逐渐从局部扩散到整杯。搅拌和升温常能加快这个过程。',
          en: 'Water molecules collide with and attract particles at a crystal surface. Released particles move randomly through the liquid, spreading from one region into the whole cup. Stirring and warming often speed this up.',
        },
      },
      {
        title: {
          zh: '均匀，不等于无限',
          en: 'Uniform does not mean unlimited',
        },
        body: {
          zh: '同温度下，水能溶解的量有限。继续加盐，出现不再消失的固体时，液体已接近或达到饱和；这不是“搅得不够用力”。',
          en: 'At a given temperature, water can dissolve only a limited amount. If added salt no longer disappears, the liquid is near or at saturation; it is not simply a failure to stir hard enough.',
        },
      },
    ],
    misconception: {
      zh: '“看不见的糖已经没有了”不对。看不见只是粒子小而分散；蒸发水、尝到甜味，或用合适的实验测量，都能显示糖仍在。也别把“溶解”当成“熔化”：冰融化是状态变化，糖溶于水是形成混合物。',
      en: '“Invisible sugar is gone” is wrong. It is simply tiny and dispersed; evaporating water, tasting sweetness or proper measurement can show it remains. Do not confuse dissolving with melting: melting ice is a change of state, while sugar in water is a mixture.',
    },
    mission: {
      zh: '安全厨房观察：在成人同意和看护下，将少量食糖分别加入两杯同量冷水；一杯轻轻搅拌，另一杯不搅拌。只观察糖粒从哪里先变少、甜味是否最终接近。不要品尝任何非食品溶液，也不要混合清洁剂。',
      en: 'Safe kitchen observation: with adult permission and supervision, add a small amount of food sugar to two equal cups of cold water. Stir one gently and leave one alone. Observe where crystals shrink first and whether sweetness eventually becomes similar. Never taste non-food solutions or mix cleaners.',
    },
    vocabulary: [
      { en: 'solution', zh: '溶液' },
      { en: 'solute', zh: '溶质' },
      { en: 'solvent', zh: '溶剂' },
      { en: 'dissolve', zh: '溶解' },
      { en: 'saturated', zh: '饱和的' },
    ],
    interactive: 'solution-mixing-lab',
    questions: [
      {
        id: 'solution-q1',
        prompt: {
          zh: '一杯糖水中，糖最合适的角色是什么？',
          en: 'In sugar water, what is sugar’s best role?',
        },
        options: [
          { zh: '溶质', en: 'Solute' },
          { zh: '溶剂', en: 'Solvent' },
          { zh: '新生成的气体', en: 'A newly formed gas' },
        ],
        answer: 0,
        explanation: {
          zh: '糖是被水分散开的物质，所以是溶质；水是溶剂。',
          en: 'Sugar is the material dispersed by water, so it is the solute; water is the solvent.',
        },
      },
      {
        id: 'solution-q2',
        prompt: {
          zh: '糖粒看不见后，哪项最能支持“糖还在水里”？',
          en: 'After crystals cannot be seen, what best supports that sugar is still in the water?',
        },
        options: [
          { zh: '水尝起来仍有甜味', en: 'The water still tastes sweet' },
          { zh: '杯子看起来透明', en: 'The cup looks transparent' },
          { zh: '糖一定变成了空气', en: 'The sugar must have become air' },
        ],
        answer: 0,
        explanation: {
          zh: '甜味来自仍分散在水中的糖粒子；透明并不等于里面没有溶质。',
          en: 'Sweetness comes from sugar particles still dispersed in water; clear does not mean solute-free.',
        },
      },
      {
        id: 'solution-q3',
        prompt: {
          zh: '搅拌糖水最直接改变了什么？',
          en: 'What does stirring sugar water most directly change?',
        },
        options: [
          {
            zh: '让液体不断接触糖粒，加快分散',
            en: 'It brings liquid into contact with crystals and speeds spreading',
          },
          {
            zh: '把糖变成另一种元素',
            en: 'It changes sugar into another element',
          },
          { zh: '让水不再是溶剂', en: 'It makes water stop being a solvent' },
        ],
        answer: 0,
        explanation: {
          zh: '搅拌更新糖粒周围的液体，帮助粒子更快离开表面并扩散；它不制造新元素。',
          en: 'Stirring refreshes liquid around crystals, helping particles leave and spread faster; it does not create new elements.',
        },
      },
      {
        id: 'solution-q4',
        prompt: {
          zh: '继续加盐后底部一直有盐粒，最合理的推断是什么？',
          en: 'If salt remains at the bottom after more is added, what is the best inference?',
        },
        options: [
          {
            zh: '该温度下溶液已接近或达到饱和',
            en: 'At this temperature the solution is near or at saturation',
          },
          { zh: '盐已经完全消失', en: 'The salt has completely disappeared' },
          { zh: '水变成了固体', en: 'The water became a solid' },
        ],
        answer: 0,
        explanation: {
          zh: '可溶解的量有限。剩余固体说明此时水已难以再容纳更多同种溶质。',
          en: 'Solubility is limited. Remaining solid shows that the water cannot take much more of that solute at that moment.',
        },
      },
    ],
  },
  {
    id: 'concentration-and-dilution',
    levelId: 'solutions',
    order: 52,
    title: {
      zh: '浓度与稀释：同一杯里有多“挤”？',
      en: 'Concentration & dilution: how crowded is a solution?',
    },
    eyebrow: {
      zh: '第 52 课 · 把“浓一点”变成可比较的语言',
      en: 'Lesson 52 · Turn “stronger” into comparable language',
    },
    hook: {
      zh: '两杯柠檬水看起来一样多：一杯酸得皱眉，一杯很淡。只说“有柠檬”为什么不够？怎样公平地说出哪一杯更浓？',
      en: 'Two cups of lemonade look equally full: one makes you pucker, one tastes faint. Why is saying “they contain lemon” not enough? How can we fairly say which is more concentrated?',
    },
    hookHint: {
      zh: '浓度不是只看溶质多不多，而是看相同体积里装了多少溶质。常见单位 g/L 的意思是：每 1 L 溶液里有多少克溶质。',
      en: 'Concentration is not only about how much solute there is; it is how much solute is in the same volume. A common unit, g/L, means grams of solute in each litre of solution.',
    },
    bigIdea: {
      zh: '浓度把“溶质的量”和“溶液体积”绑在一起比较：相同体积中溶质更多，浓度更高；只加水会稀释，溶质总量不变而浓度降低。',
      en: 'Concentration compares solute amount with solution volume: more solute in the same volume means higher concentration. Adding only water dilutes—the solute amount stays the same while concentration falls.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🍋',
        title: { zh: '果汁要按比例兑水', en: 'Juice needs the right dilution' },
        body: {
          zh: '浓缩果汁加水后仍有同样的果汁成分，但分布在更大体积里，味道更淡。这是稀释，不是果汁消失。',
          en: 'After adding water to juice concentrate, the same juice material is spread through a larger volume, so it tastes lighter. That is dilution, not disappearance.',
        },
      },
      {
        icon: '🏊',
        title: { zh: '游泳池的消毒指标', en: 'Pool treatment readings' },
        body: {
          zh: '专业人员会测量池水中物质的浓度，既不能凭气味猜，也不能随意添加化学品。数字帮助他们安全地控制水质。',
          en: 'Professionals measure concentrations in pool water; they do not guess by smell or add chemicals freely. Numbers help them control water quality safely.',
        },
      },
      {
        icon: '🧴',
        title: {
          zh: '清洁产品的“稀释比例”',
          en: 'Dilution directions on cleaners',
        },
        body: {
          zh: '有些清洁产品要求按标签稀释，是为了在合适浓度下使用。绝不混合清洁剂，也不把“更浓”误当成“更安全或更有效”。',
          en: 'Some cleaners must be diluted as their label directs to reach an appropriate working concentration. Never mix cleaners, and do not assume “stronger” means safer or better.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先固定一个比较尺：每升有多少克',
          en: 'First fix a comparison ruler: grams per litre',
        },
        body: {
          zh: '浓度（g/L）= 溶质质量（g）÷ 溶液体积（L）。例如 10 g 糖在 0.5 L 溶液中，浓度是 10 ÷ 0.5 = 20 g/L。先把 mL 换成 L，才不会把单位弄乱。',
          en: 'Concentration (g/L) = solute mass (g) ÷ solution volume (L). For example, 10 g sugar in 0.5 L of solution has concentration 10 ÷ 0.5 = 20 g/L. Convert mL to L first so units stay sensible.',
        },
      },
      {
        title: {
          zh: '同体积里粒子更挤，浓度更高',
          en: 'More crowded particles in the same volume means higher concentration',
        },
        body: {
          zh: '两杯都是 200 mL 时，含 8 g 糖的一杯比含 4 g 糖的一杯浓。反过来，溶质相同而体积更大时，粒子更分散，浓度更低。',
          en: 'When both cups hold 200 mL, the one with 8 g sugar is more concentrated than the one with 4 g. Conversely, the same solute in a larger volume is more spread out and less concentrated.',
        },
      },
      {
        title: {
          zh: '稀释时，先追踪什么没变',
          en: 'When diluting, track what did not change first',
        },
        body: {
          zh: '只加水时，糖或盐的总质量没有改变；改变的是总体积。因此浓度降低。若又加了溶质，才会同时改变“分子”和“分母”。',
          en: 'When only water is added, the total mass of sugar or salt does not change; the total volume does. Therefore concentration falls. Adding solute changes both the amount and the comparison.',
        },
      },
    ],
    misconception: {
      zh: '“加水后溶质变少了”不准确。若没有倒掉液体或发生反应，溶质总量仍在；只是它分摊到了更多水中。还有一个常见坑：比较浓度要比较同一体积，不能只看杯子里总共放了几克。',
      en: '“Adding water makes there be less solute” is inaccurate. If nothing is poured away or reacts, the total solute remains; it is simply shared through more water. Another trap: compare the same volume, not merely total grams placed in a cup.',
    },
    mission: {
      zh: '标签翻译员：找一瓶饮料或食品的营养标签，比较“每 100 mL”或“每 100 g”的糖含量。它们已经帮你固定了比较尺，所以可以公平比较。只读标签，不需要制作或品尝额外饮料。',
      en: 'Label translator: find a drink or food nutrition label and compare sugar “per 100 mL” or “per 100 g.” Those labels have already fixed the comparison ruler, so they can be compared fairly. Read labels only; no need to make or taste extra drinks.',
    },
    vocabulary: [
      { en: 'concentration', zh: '浓度' },
      { en: 'dilute', zh: '稀释' },
      { en: 'grams per litre (g/L)', zh: '克每升（g/L）' },
      { en: 'volume', zh: '体积' },
      { en: 'solution', zh: '溶液' },
    ],
    interactive: 'concentration-lab',
    questions: [
      {
        id: 'concentration-q1',
        prompt: {
          zh: '下列哪杯糖水浓度更高？',
          en: 'Which sugar solution has the higher concentration?',
        },
        options: [
          { zh: '8 g 糖配成 200 mL 溶液', en: '8 g sugar in 200 mL solution' },
          { zh: '8 g 糖配成 400 mL 溶液', en: '8 g sugar in 400 mL solution' },
          { zh: '两杯一定相同', en: 'They must be equal' },
        ],
        answer: 0,
        explanation: {
          zh: '两杯糖的质量相同，但第一杯体积更小，同样的糖粒子更“挤”，所以浓度更高。',
          en: 'Both cups have the same sugar mass, but the first has a smaller volume. Its particles are more crowded, so it is more concentrated.',
        },
      },
      {
        id: 'concentration-q2',
        prompt: {
          zh: '向 100 mL 糖水只加 100 mL 水，什么一定不变？',
          en: 'If 100 mL water is added to sugar water, what definitely stays unchanged?',
        },
        options: [
          { zh: '糖的总质量', en: 'The total mass of sugar' },
          { zh: '糖水的浓度', en: 'The solution concentration' },
          {
            zh: '糖粒子之间的平均距离',
            en: 'The average distance between sugar particles',
          },
        ],
        answer: 0,
        explanation: {
          zh: '只加水没有加入或拿走糖，所以糖的总量不变；总体积变大，浓度会降低。',
          en: 'Adding only water neither adds nor removes sugar, so sugar amount stays unchanged; the larger volume lowers concentration.',
        },
      },
      {
        id: 'concentration-q3',
        prompt: {
          zh: '10 g 溶质配成 0.5 L 溶液，浓度是多少？',
          en: 'What is the concentration of 10 g solute in 0.5 L solution?',
        },
        options: [
          { zh: '20 g/L', en: '20 g/L' },
          { zh: '5 g/L', en: '5 g/L' },
          { zh: '10.5 g/L', en: '10.5 g/L' },
        ],
        answer: 0,
        explanation: {
          zh: '使用 c = m ÷ V：10 g ÷ 0.5 L = 20 g/L。这里的 0.5 是半升，而不是 500 L。',
          en: 'Use c = m ÷ V: 10 g ÷ 0.5 L = 20 g/L. Here 0.5 means half a litre, not 500 L.',
        },
      },
      {
        id: 'concentration-q4',
        prompt: {
          zh: '为什么产品标签常写“每 100 mL 含糖量”？',
          en: 'Why do product labels often state sugar per 100 mL?',
        },
        options: [
          {
            zh: '固定体积，方便公平比较浓度',
            en: 'It fixes a volume for a fair concentration comparison',
          },
          {
            zh: '因为所有饮料都必须是 100 mL',
            en: 'Because every drink must be 100 mL',
          },
          {
            zh: '因为糖只会在 100 mL 中溶解',
            en: 'Because sugar only dissolves in 100 mL',
          },
        ],
        answer: 0,
        explanation: {
          zh: '固定“每多少体积”就像给所有饮料用同一把尺，能看出哪一杯单位体积里糖更多。',
          en: 'Fixing “per volume” gives every drink the same ruler, revealing which has more sugar in each unit of volume.',
        },
      },
    ],
  },
  {
    id: 'solubility-temperature-and-gases',
    levelId: 'solutions',
    order: 53,
    title: {
      zh: '溶解度：热水、冷饮和“装得下多少”',
      en: 'Solubility: hot water, cold drinks & how much fits',
    },
    eyebrow: {
      zh: '第 53 课 · “溶得快”与“能溶多”不是一回事',
      en: 'Lesson 53 · “Dissolves fast” and “fits more” differ',
    },
    hook: {
      zh: '热可可里糖似乎一下就没了；一瓶冰镇汽水打开却比温汽水更有气泡。温度究竟改变了什么？',
      en: 'Sugar seems to vanish quickly in hot cocoa, while chilled fizzy water often seems bubblier than warm. What is temperature actually changing?',
    },
    hookHint: {
      zh: '这里藏着两个问题：溶解速度和溶解度。搅拌或加热常让固体溶得更快；而“溶解度”问的是在一定温度下，溶剂最多能装下多少。多数固体随温度升高能溶更多，气体通常相反。',
      en: 'Two questions are hiding here: dissolving speed and solubility. Stirring or warming often makes a solid dissolve faster; solubility asks how much a solvent can hold at a given temperature. Most solids can dissolve more when warmed, while gases usually do the opposite.',
    },
    bigIdea: {
      zh: '溶解度是“在指定条件下最多能溶多少”的上限，不是溶解速度。温度影响不同物质的方式不完全相同：许多固体在热水中更易大量溶解，而气体在冷水中通常更容易留住。',
      en: 'Solubility is the maximum that can dissolve under stated conditions, not dissolving speed. Temperature affects substances differently: many solids dissolve in larger amounts in hot water, whereas gases are generally retained better in cold water.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '☕',
        title: { zh: '热饮和糖', en: 'Hot drinks and sugar' },
        body: {
          zh: '热水里糖往往既溶得更快，也能溶进更多。这两个现象刚好可能同时出现，但概念不同：一个谈时间，一个谈上限。',
          en: 'Sugar in hot water often dissolves both faster and in a larger amount. These may happen together, yet the ideas differ: one is about time and one is about a limit.',
        },
      },
      {
        icon: '🫧',
        title: { zh: '冰镇气泡水', en: 'Chilled sparkling water' },
        body: {
          zh: '二氧化碳是气体。水变暖后，更多气体愿意离开液体形成气泡，所以冷藏常有助于保留气泡感。不要摇晃密封饮料做实验。',
          en: 'Carbon dioxide is a gas. As water warms, more gas tends to leave the liquid as bubbles, so chilling helps retain fizz. Do not shake sealed drinks as an experiment.',
        },
      },
      {
        icon: '❄️',
        title: { zh: '结晶为什么会出现？', en: 'Why crystals can appear' },
        body: {
          zh: '若热的浓溶液冷却后“装不下”原来的那么多溶质，多余部分可能重新形成晶体。这是条件改变后，溶解度上限改变的线索。',
          en: 'If a hot concentrated solution cools and can no longer “hold” as much solute, excess may form crystals again. This hints that the solubility limit changed with conditions.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '把两个问题分开问', en: 'Ask two separate questions' },
        body: {
          zh: '“多久能看不见颗粒？”是在问速度；“最后最多能看不见多少克？”是在问溶解度。搅拌会改变接触机会，通常主要影响速度；温度可能影响速度，也可能改变上限。',
          en: '“How long until particles are no longer visible?” asks about rate; “how many grams can ultimately disappear?” asks about solubility. Stirring changes contact opportunities and usually affects rate; temperature can affect rate and may also change the limit.',
        },
      },
      {
        title: {
          zh: '注明条件，才是完整的科学回答',
          en: 'Name the conditions for a complete scientific answer',
        },
        body: {
          zh: '说“盐能溶于水”还不够完整。温度、溶质种类、溶剂种类都会影响可溶解的量。图表或数据必须说明温度与单位，才值得比较。',
          en: 'Saying “salt dissolves in water” is incomplete. Temperature, solute type and solvent type can all affect how much dissolves. A graph or value needs temperature and units before it can be compared fairly.',
        },
      },
      {
        title: {
          zh: '固体与气体的常见趋势不同',
          en: 'Solids and gases often follow different trends',
        },
        body: {
          zh: '许多固体在较高温度下有更高的溶解度，但并非每种物质都完全一样；对气体来说，较低温度通常有利于留在水中。别把“通常”背成“永远”。',
          en: 'Many solids have greater solubility at higher temperatures, though no substance behaves identically; for gases, lower temperature usually helps them remain in water. Do not memorise “usually” as “always.”',
        },
      },
    ],
    misconception: {
      zh: '“搅拌能让无限多的糖溶掉”不对。搅拌主要加快到达上限的过程，不能取消饱和上限。另一个误区是“所有东西遇热都更易溶”：这对很多固体有用，却不能套用到气体。',
      en: '“Stirring makes unlimited sugar dissolve” is wrong. Stirring mainly speeds the journey to the limit; it does not remove saturation. Another trap is “everything dissolves better when hot”: useful for many solids, but not for gases.',
    },
    mission: {
      zh: '安全观察任务：在成人同意和看护下，观察两杯同量水中少量食糖的变化，一杯常温、一杯温热但不烫手。记录“看不见糖粒所需时间”，不要把这个观察直接当成“能溶多少”的结论。不要加热密封容器，也不进行气泡饮料摇晃实验。',
      en: 'Safe observation: with adult permission and supervision, observe a small amount of food sugar in two equal cups of water—one room temperature, one warm but not hot. Record time until crystals are no longer visible, but do not treat this alone as the answer to how much can dissolve. Do not heat sealed containers or shake fizzy drinks.',
    },
    vocabulary: [
      { en: 'solubility', zh: '溶解度' },
      { en: 'saturated solution', zh: '饱和溶液' },
      { en: 'dissolving rate', zh: '溶解速率' },
      { en: 'crystallise', zh: '结晶' },
      { en: 'condition', zh: '条件' },
    ],
    interactive: 'solubility-temperature-lab',
    questions: [
      {
        id: 'solubility-q1',
        prompt: {
          zh: '“把糖搅到看不见用了多久”主要在研究什么？',
          en: '“How long did sugar take to disappear when stirred?” mainly studies what?',
        },
        options: [
          { zh: '溶解速率', en: 'Dissolving rate' },
          { zh: '糖的元素符号', en: 'Sugar’s element symbol' },
          { zh: '水是否有质量', en: 'Whether water has mass' },
        ],
        answer: 0,
        explanation: {
          zh: '题目问的是时间，关注的是过程有多快；溶解度则问在指定条件下最多能溶多少。',
          en: 'The question asks about time, so it focuses on process speed; solubility asks the maximum that can dissolve under stated conditions.',
        },
      },
      {
        id: 'solubility-q2',
        prompt: {
          zh: '为什么搅拌饱和糖水不能保证再溶进更多糖？',
          en: 'Why can stirring a saturated sugar solution not guarantee more sugar will dissolve?',
        },
        options: [
          {
            zh: '搅拌加快过程，却不一定改变此条件下的溶解度上限',
            en: 'It speeds the process but may not change the solubility limit under those conditions',
          },
          { zh: '糖会变成水', en: 'Sugar becomes water' },
          { zh: '搅拌会让水消失', en: 'Stirring makes water disappear' },
        ],
        answer: 0,
        explanation: {
          zh: '饱和表示此时已接近能容纳的上限。搅拌可以帮助已有颗粒接触水，却不能自动创造更多“位置”。',
          en: 'Saturated means the solution is near the amount it can hold then. Stirring helps particles contact water but does not automatically create more “space.”',
        },
      },
      {
        id: 'solubility-q3',
        prompt: {
          zh: '冰镇气泡水通常比温气泡水更能保持气泡，最合适的解释是？',
          en: 'Why does chilled sparkling water usually retain fizz better than warm sparkling water?',
        },
        options: [
          {
            zh: '气体通常在较低温度下更容易留在水中',
            en: 'Gases are usually retained in water more easily at lower temperatures',
          },
          { zh: '冷水没有分子', en: 'Cold water has no molecules' },
          {
            zh: '二氧化碳变成了固体糖',
            en: 'Carbon dioxide becomes solid sugar',
          },
        ],
        answer: 0,
        explanation: {
          zh: '二氧化碳是溶在水里的气体；温度升高时，它通常更容易离开液体形成气泡。',
          en: 'Carbon dioxide is a gas dissolved in water; as temperature rises, it generally leaves the liquid as bubbles more readily.',
        },
      },
      {
        id: 'solubility-q4',
        prompt: {
          zh: '比较两条溶解度数据前，最重要先确认什么？',
          en: 'Before comparing two solubility values, what is most important to check first?',
        },
        options: [
          {
            zh: '温度与单位是否相同或已说明',
            en: 'Whether temperature and units match or are stated',
          },
          { zh: '杯子颜色是否相同', en: 'Whether cup colours match' },
          { zh: '谁先写下数据', en: 'Who wrote the values first' },
        ],
        answer: 0,
        explanation: {
          zh: '溶解度依赖条件；没有温度和单位，数字无法公平比较。',
          en: 'Solubility depends on conditions; without temperature and units, values cannot be compared fairly.',
        },
      },
    ],
  },
  {
    id: 'molar-concentration-recipe',
    levelId: 'solutions',
    order: 71,
    title: {
      zh: '每升有多少 mol？把配方变成粒子账本',
      en: 'How many moles per litre? A particle recipe',
    },
    eyebrow: {
      zh: '第 71 课 · 从 g/L 走到 mol/L',
      en: 'Lesson 71 · From g/L to mol/L',
    },
    hook: {
      zh: '同样是 18 g，葡萄糖和食盐含有的化学“份数”一样多吗？调饮料常看克数；要让反应恰好配对，却需要知道每升溶液里有多少 mol。',
      en: 'Do 18 g of glucose and 18 g of salt contain the same number of chemical portions? Drink recipes use grams; matching reactants needs moles per litre of solution.',
    },
    hookHint: {
      zh: '先回想第 48–50 课的 mol 与摩尔质量，再接上第 52 课的浓度。不同物质每 mol 的质量不同，所以不能直接拿克数比较粒子份数。',
      en: 'Recall moles and molar mass from Lessons 48–50, then concentration from Lesson 52. Different substances have different masses per mole, so grams alone cannot compare particle amounts.',
    },
    bigIdea: {
      zh: '物质的量浓度 c = n/V：用溶质的 mol 数，除以最终溶液的升数。',
      en: 'Molar concentration c = n/V: moles of solute divided by final solution volume in litres.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🥤',
        title: { zh: '配方的两种语言', en: 'Two ways to describe a recipe' },
        body: {
          zh: 'g/L 方便称量；mol/L 方便把溶液配方接到反应方程式。它们描述同一杯溶液，却回答不同的问题。',
          en: 'g/L is handy for weighing; mol/L connects a solution recipe to a reaction equation. They describe the same solution but answer different questions.',
        },
      },
      {
        icon: '🧪',
        title: { zh: '实验室为什么写 mol/L？', en: 'Why lab labels use mol/L' },
        body: {
          zh: '标签上的 0.100 mol/L 告诉我们：取 1.00 L 溶液，就含有 0.100 mol 指定溶质。取 0.100 L，只取到十分之一的份数。',
          en: 'A 0.100 mol/L label means 1.00 L contains 0.100 mol of the named solute. A 0.100 L portion contains one tenth as many moles.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '加水不是加溶质',
          en: 'Adding water is not adding solute',
        },
        body: {
          zh: '同一杯溶液加水到两倍体积，溶质并没有凭空减少，但每升分到的份数变少了。这就是稀释，不是“糖消失了”。',
          en: 'Dilute a solution to twice its volume: no solute vanishes, but each litre contains fewer moles. Dilution is not disappearing sugar.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先把克数换成 mol', en: 'First turn grams into moles' },
        body: {
          zh: '例题：18.0 g 葡萄糖，摩尔质量取 180 g/mol。n = m/M = 18.0 ÷ 180 = 0.100 mol。不是 18 mol；克是质量，mol 是化学份数。',
          en: 'Worked example: 18.0 g glucose, using M = 180 g/mol. n = m/M = 18.0 ÷ 180 = 0.100 mol. Not 18 mol: grams measure mass; moles count chemical portions.',
        },
      },
      {
        title: {
          zh: '再除以最终溶液体积',
          en: 'Then divide by final solution volume',
        },
        body: {
          zh: '把这份葡萄糖配成 500 mL 溶液：先把 500 mL 换成 0.500 L。c = 0.100 ÷ 0.500 = 0.200 mol/L。为什么除？因为我们要问“平均每 1 L 有多少 mol”。',
          en: 'Make a final solution volume of 500 mL: convert it to 0.500 L. c = 0.100 ÷ 0.500 = 0.200 mol/L. Why divide? We are finding moles in each litre.',
        },
      },
      {
        title: {
          zh: '稀释时追踪不变的量',
          en: 'Track what stays fixed during dilution',
        },
        body: {
          zh: '只加水，把上面的整份溶液稀释至 1.00 L。n 仍是 0.100 mol，因此 c = 0.100 mol/L，减半。c₁V₁ = c₂V₂ 只是两边都等于同一份 n；适用于没有反应、没有溶质损失的稀释。',
          en: 'Add only water to bring the whole solution to 1.00 L. n stays 0.100 mol, so c becomes 0.100 mol/L: half as much. c₁V₁ = c₂V₂ means both sides equal the same n, for dilution without reaction or solute loss.',
        },
      },
    ],
    misconception: {
      zh: '500 mL 水不等于最终得到 500 mL 溶液。溶解后的体积不能简单把水和固体体积相加；公式里的 V 必须是最终溶液体积。mol/L 也不是甜度或饮用安全指标。',
      en: '500 mL of water is not necessarily 500 mL of final solution. Volumes do not simply add when a solid dissolves; V must be the final solution volume. mol/L is not a measure of sweetness or drinking safety.',
    },
    mission: {
      zh: '在虚拟配方台里，把 18 g 葡萄糖配成 500 mL 溶液。先预测加水到 1000 mL 后浓度怎样变，再揭晓。然后把配方的最终体积设为 1000 mL，试着仅增加溶质质量，让浓度回到稀释前的值，并解释为什么。',
      en: 'On the virtual recipe bench, make 500 mL of solution with 18 g glucose. Predict the change when diluted to 1000 mL, then reveal it. Next set the recipe volume to 1000 mL and increase only the solute mass to restore the pre-dilution concentration. Explain why.',
    },
    vocabulary: [
      { en: 'molar concentration', zh: '物质的量浓度' },
      { en: 'final solution volume', zh: '最终溶液体积' },
      { en: 'molar mass', zh: '摩尔质量' },
      { en: 'dilution', zh: '稀释' },
    ],
    interactive: 'molar-concentration-lab',
    questions: [
      {
        id: 'molar-concentration-q1',
        prompt: {
          zh: '0.200 mol/L 葡萄糖溶液：这个标签最直接告诉你什么？',
          en: 'What does a 0.200 mol/L glucose label tell you directly?',
        },
        options: [
          {
            zh: '每升溶液含 0.200 g 葡萄糖',
            en: 'Each litre contains 0.200 g glucose',
          },
          {
            zh: '每升溶液含 0.200 mol 葡萄糖',
            en: 'Each litre contains 0.200 mol glucose',
          },
          {
            zh: '整瓶一定只有 0.200 mol 葡萄糖',
            en: 'The whole bottle must contain exactly 0.200 mol glucose',
          },
        ],
        answer: 1,
        explanation: {
          zh: '“每升”是比较浓度的共同基准。整瓶的 mol 数还取决于瓶中有多少升；单位是 mol/L，不是 g/L。',
          en: '“Per litre” is the shared basis for concentration. Total moles also depend on bottle volume; the unit is mol/L, not g/L.',
        },
      },
      {
        id: 'molar-concentration-q2',
        prompt: {
          zh: '0.0500 mol 溶质配成 250 mL 溶液，浓度是多少？',
          en: '0.0500 mol solute makes 250 mL solution. What is its concentration?',
        },
        options: [
          { zh: '0.200 mol/L', en: '0.200 mol/L' },
          { zh: '0.000200 mol/L', en: '0.000200 mol/L' },
          { zh: '5.00 mol/L', en: '5.00 mol/L' },
        ],
        answer: 0,
        explanation: {
          zh: '250 mL = 0.250 L。c = 0.0500 ÷ 0.250 = 0.200 mol/L。不换成 L 就除以 250，会小 1000 倍。',
          en: '250 mL = 0.250 L. c = 0.0500 ÷ 0.250 = 0.200 mol/L. Dividing by 250 without converting to litres makes the answer 1000 times too small.',
        },
      },
      {
        id: 'molar-concentration-q3',
        prompt: {
          zh: '36.0 g 葡萄糖（M = 180 g/mol）配成 1.00 L 溶液，哪条计算正确？',
          en: '36.0 g glucose (M = 180 g/mol) makes 1.00 L solution. Which calculation is correct?',
        },
        options: [
          {
            zh: 'c = 36.0 ÷ 1.00 = 36.0 mol/L',
            en: 'c = 36.0 ÷ 1.00 = 36.0 mol/L',
          },
          {
            zh: 'c = 180 ÷ 36.0 = 5.00 mol/L',
            en: 'c = 180 ÷ 36.0 = 5.00 mol/L',
          },
          {
            zh: 'n = 36.0 ÷ 180 = 0.200 mol，再算 c = 0.200 mol/L',
            en: 'n = 36.0 ÷ 180 = 0.200 mol, then c = 0.200 mol/L',
          },
        ],
        answer: 2,
        explanation: {
          zh: '先用摩尔质量把 g 换成 mol，再除以 L。第一条得到的是 g/L，不是 mol/L；第二条把 m/M 倒过来了。',
          en: 'Convert grams to moles using molar mass, then divide by litres. The first line gives g/L, not mol/L; the second reverses m/M.',
        },
      },
      {
        id: 'molar-concentration-q4',
        prompt: {
          zh: '不损失溶质，只加水把整份溶液体积变成两倍，什么保持不变？',
          en: 'Without losing solute, dilute a whole solution to twice its volume. What stays unchanged?',
        },
        options: [
          { zh: '物质的量浓度 c', en: 'Molar concentration c' },
          { zh: '溶质的物质的量 n', en: 'Amount of solute n' },
          { zh: '溶液体积 V', en: 'Solution volume V' },
        ],
        answer: 1,
        explanation: {
          zh: '水增加了，但溶质的 mol 数没有变。V 加倍时，n/V 减半；n 不变并不意味着 c 不变。',
          en: 'Water is added, but solute moles stay fixed. Doubling V halves n/V; unchanged n does not mean unchanged c.',
        },
      },
      {
        id: 'molar-concentration-q5',
        prompt: {
          zh: '小林把溶质加入 500 mL 水，就用 0.500 L 算浓度。缺少哪条信息？',
          en: 'Lin adds solute to 500 mL water and uses 0.500 L to calculate concentration. What information is missing?',
        },
        options: [
          { zh: '溶解后最终溶液体积', en: 'Final volume after dissolving' },
          { zh: '杯子的颜色', en: 'Colour of the cup' },
          { zh: '搅拌了几圈', en: 'Number of stirs' },
        ],
        answer: 0,
        explanation: {
          zh: '分母是溶液体积，不是加入前的水体积。应先溶解，再确认或调节最终溶液体积。',
          en: 'The denominator is solution volume, not the starting water volume. Dissolve first, then measure or adjust the final solution volume.',
        },
      },
      {
        id: 'molar-concentration-q6',
        prompt: {
          zh: 'A：0.100 mol / 0.500 L；B：0.200 mol / 1.00 L。两杯浓度怎么比较？',
          en: 'A: 0.100 mol / 0.500 L; B: 0.200 mol / 1.00 L. Compare their concentrations.',
        },
        options: [
          {
            zh: 'B 的溶质多，所以浓度一定高',
            en: 'B has more solute, so it must be more concentrated',
          },
          {
            zh: 'A 的体积小，所以浓度一定高',
            en: 'A has less volume, so it must be more concentrated',
          },
          { zh: '相同，都是 0.200 mol/L', en: 'Equal: both are 0.200 mol/L' },
        ],
        answer: 2,
        explanation: {
          zh: '浓度比较的是比值，不是单独比总量或体积。B 的 n 和 V 都是 A 的两倍，所以比值相同。',
          en: 'Concentration compares a ratio, not total amount or volume alone. B doubles both n and V, leaving the ratio unchanged.',
        },
      },
    ],
  },
];
