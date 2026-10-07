import type { Lesson } from './lessons';

export const level8Lessons = [
  {
    id: 'acids-bases-and-ph',
    levelId: 'acids',
    order: 40,
    title: {
      zh: '酸、碱与 pH：给水溶液的一把颜色尺',
      en: 'Acids, bases and pH: a colour ruler for water solutions',
    },
    eyebrow: {
      zh: '第 40 课 · 从柠檬、肥皂到花园土壤',
      en: 'Lesson 40 · From lemons and soap to garden soil',
    },
    hook: {
      zh: '柠檬汁尝起来酸，肥皂水摸起来滑，游泳池和花园土壤却不能靠尝或摸来判断。化学家怎么安全地给这些水溶液“量性格”？',
      en: 'Lemon juice tastes sour and soapy water feels slippery, but you must not taste or touch-test pool water or garden products. How can chemists safely measure a water solution’s “personality”?',
    },
    hookHint: {
      zh: '答案是 pH 和指示剂。它们让我们用数字与颜色描述水溶液偏酸、接近中性，还是偏碱；它们是线索，不是让人徒手实验的邀请。',
      en: 'The answer is pH and indicators. They use numbers and colour to describe whether a water solution is acidic, near neutral or basic; they are clues, not an invitation to test liquids by hand.',
    },
    bigIdea: {
      zh: 'pH 用来描述水溶液的酸碱性：在 25 °C 时，小于 7 为酸性，7 为中性，大于 7 为碱性；指示剂可用颜色提供线索。',
      en: 'pH describes acidity or basicity in water solutions: at 25 °C, below 7 is acidic, 7 is neutral and above 7 is basic; indicators can provide colour clues.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🍋',
        title: { zh: '柠檬汁与食物风味', en: 'Lemon juice and food flavour' },
        body: {
          zh: '柠檬汁是酸性水溶液，酸味来自其中的酸。食物的酸味可以提示“可能偏酸”，但味觉绝不是未知液体的检测工具。',
          en: 'Lemon juice is an acidic water solution and its sourness comes from acids. Taste can hint that a known food is acidic, but it is never a test for an unknown liquid.',
        },
      },
      {
        icon: '🧼',
        title: {
          zh: '清洁用品为什么要讲 pH',
          en: 'Why cleaners care about pH',
        },
        body: {
          zh: '有些清洁产品偏碱，能帮助处理油污；有些偏酸，用在特定水垢上。不同表面和产品需要不同方法，所以绝不混合清洁剂。',
          en: 'Some cleaners are basic and help with greasy dirt; some are acidic for specific mineral scale. Surfaces and products need different methods, so never mix cleaners.',
        },
      },
      {
        icon: '🌱',
        title: { zh: '土壤和植物', en: 'Soil and plants' },
        body: {
          zh: '植物从土壤中吸收养分的能力会受 pH 影响。园艺工作者会用合适的测试工具了解土壤，而不是凭颜色或气味猜测。',
          en: 'Soil pH can affect how readily plants take up nutrients. Gardeners use suitable tests rather than guessing from colour or smell.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: 'pH 是给“水溶液”用的刻度',
          en: 'pH is a scale for water solutions',
        },
        body: {
          zh: '当物质溶在水里，pH 能帮助描述其中与酸碱有关的粒子状况。初学阶段可以把它看作 0 到 14 的颜色尺：越靠左通常越酸，越靠右通常越碱。',
          en: 'When substances dissolve in water, pH helps describe acid-base-related particles. For now, picture a 0–14 colour ruler: farther left is usually more acidic and farther right more basic.',
        },
      },
      {
        title: {
          zh: '中性不等于“什么都没有”',
          en: 'Neutral does not mean “nothing is there”',
        },
        body: {
          zh: '接近 pH 7 的纯水在常温下通常称为中性。中性只是酸性和碱性的影响平衡，不代表这杯水没有粒子、没有用途或永远安全饮用。',
          en: 'Pure water near pH 7 at room temperature is usually called neutral. Neutral means acidic and basic effects balance; it does not mean no particles, no use, or automatically safe to drink.',
        },
      },
      {
        title: {
          zh: '指示剂会“变色说话”',
          en: 'Indicators “speak” by changing colour',
        },
        body: {
          zh: '石蕊、通用指示剂或 pH 试纸会随溶液的酸碱性呈现不同颜色。颜色要对照该工具自己的色卡阅读；单看“红色”或“蓝色”并不能猜出准确 pH。',
          en: 'Litmus, universal indicator and pH paper show different colours with acidity or basicity. Always compare with that tool’s own chart; red or blue alone does not reveal an exact pH.',
        },
      },
    ],
    misconception: {
      zh: '“酸一定危险、碱一定安全”是错的；反过来也错。醋和柠檬汁是熟悉的食物酸，某些碱性产品却会灼伤皮肤。危险性还和浓度、用量及具体物质有关，因此未知液体一律不碰、不闻、不尝、不混合。',
      en: '“Acids are always dangerous and bases are always safe” is wrong—and so is the reverse. Vinegar and lemon juice are familiar food acids, while some basic products can burn skin. Hazard also depends on concentration, amount and substance, so never touch, smell, taste or mix unknown liquids.',
    },
    mission: {
      zh: 'pH 侦探（只观察标签）：在家里找两样带有 pH、酸性、碱性或“勿混用”提示的原装产品。不要打开、倒出、测试或混合它们；读完标签后，说出为什么“知道 pH”不能替代安全规则。',
      en: 'pH detective (labels only): find two sealed household products that mention pH, acid, base or “do not mix.” Do not open, pour, test or combine them. After reading, explain why knowing pH never replaces safety rules.',
    },
    vocabulary: [
      { en: 'acidic', zh: '酸性' },
      { en: 'basic / alkaline', zh: '碱性' },
      { en: 'neutral', zh: '中性' },
      { en: 'pH', zh: '酸碱度（pH）' },
      { en: 'indicator', zh: '指示剂' },
    ],
    interactive: 'ph-scale-lab',
    questions: [
      {
        id: 'ph-q1',
        prompt: {
          zh: '一杯水溶液的 pH 为 3，最合适的描述是什么？',
          en: 'A water solution has pH 3. What is the best description?',
        },
        options: [
          { zh: '酸性', en: 'Acidic' },
          { zh: '中性', en: 'Neutral' },
          { zh: '碱性', en: 'Basic / alkaline' },
        ],
        answer: 0,
        explanation: {
          zh: '在常用 pH 标尺上，小于 7 表示酸性。pH 3 在 7 的左侧，所以它是酸性水溶液。',
          en: 'On the usual pH scale, values below 7 are acidic. pH 3 lies left of 7, so it is an acidic water solution.',
        },
      },
      {
        id: 'ph-q2',
        prompt: {
          zh: '通用指示剂变色后，为什么仍应对照该产品的色卡？',
          en: 'Why should you still compare universal indicator colour with that product’s chart?',
        },
        options: [
          {
            zh: '每种颜色都只会对应一个固定 pH',
            en: 'Every colour always means one fixed pH',
          },
          {
            zh: '色卡把该工具的颜色与 pH 范围对应起来',
            en: 'The chart connects that tool’s colours to pH ranges',
          },
          {
            zh: '颜色能告诉你未知液体一定安全',
            en: 'A colour proves an unknown liquid is safe',
          },
        ],
        answer: 1,
        explanation: {
          zh: '指示剂的颜色是线索，色卡帮助把线索读成 pH 范围；它并不等于安全许可。',
          en: 'Indicator colour is a clue, and its chart helps read that clue as a pH range. It is never a safety permission slip.',
        },
      },
      {
        id: 'ph-q3',
        prompt: {
          zh: '发现一瓶没有标签的液体，哪一种做法最安全？',
          en: 'You find an unlabelled liquid. What is the safest action?',
        },
        options: [
          {
            zh: '闻一闻或尝一小口来判断酸碱',
            en: 'Smell or taste a little to identify it',
          },
          {
            zh: '倒进另一种清洁剂，看会不会冒泡',
            en: 'Pour it into another cleaner and see whether it bubbles',
          },
          {
            zh: '不触碰、不测试，告诉负责的大人处理',
            en: 'Do not touch or test it; tell a responsible adult',
          },
        ],
        answer: 2,
        explanation: {
          zh: '未知液体可能有害，不能靠感官或混合来“做实验”。保持距离并交给能安全处理的成人。',
          en: 'An unknown liquid may be harmful. Never use your senses or mixing as a “test”; keep away and let a responsible adult handle it safely.',
        },
      },
      {
        id: 'ph-q4',
        prompt: {
          zh: '哪句话最准确地说明“中性”？',
          en: 'Which statement describes “neutral” most accurately?',
        },
        options: [
          { zh: '一定可以直接饮用', en: 'It is always safe to drink' },
          {
            zh: '在常温下纯水接近 pH 7，是酸性和碱性影响平衡的状态',
            en: 'Pure water near pH 7 at room temperature has balanced acidic and basic effects',
          },
          {
            zh: '里面完全没有粒子或溶解物',
            en: 'It contains absolutely no particles or dissolved substances',
          },
        ],
        answer: 1,
        explanation: {
          zh: '中性描述的是酸碱性平衡，不是安全等级，也不是“空无一物”。',
          en: 'Neutral describes acid-base balance, not a safety level or an absence of matter.',
        },
      },
    ],
  },
  {
    id: 'neutralisation-the-right-amount',
    levelId: 'acids',
    order: 41,
    title: {
      zh: '中和：不是消失，而是恰好抵消',
      en: 'Neutralisation: not vanishing, but balancing just right',
    },
    eyebrow: {
      zh: '第 41 课 · 找到“刚刚好”的化学平衡',
      en: 'Lesson 41 · Finding chemistry’s “just right” balance',
    },
    hook: {
      zh: '酸性土壤、胃药和游泳池维护常会提到“中和”。但把两种液体放在一起，真的会立刻变成毫无影响的水吗？关键其实是：加入了多少、发生了什么变化。',
      en: 'Acidic soil, antacids and pool care often mention “neutralisation.” But does putting two liquids together instantly make harmless water? The key is how much is added and what changes.',
    },
    hookHint: {
      zh: '中和是一种酸碱反应。合适份量的酸和碱会互相削弱对方的酸碱影响，常形成盐和水；如果任一方过量，最终溶液仍会偏酸或偏碱。',
      en: 'Neutralisation is an acid-base reaction. Suitable amounts can weaken each other’s acidic or basic effect, often forming salt and water; if either is extra, the final solution remains acidic or basic.',
    },
    bigIdea: {
      zh: '中和不是把物质“消灭”，而是酸和碱中的粒子重新组合；只有恰当份量时，溶液才可能接近中性。',
      en: 'Neutralisation does not destroy matter: particles from acids and bases rearrange. A solution can approach neutral only when the amounts are suitable.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🌱',
        title: {
          zh: '土壤管理是“测量后再行动”',
          en: 'Soil care means measure before acting',
        },
        body: {
          zh: '有些土壤偏酸，会影响养分供应。园艺人员会先测试土壤，再按建议调节；“多加一点”并不等于更好，过度调节也会带来问题。',
          en: 'Some soils are acidic, which can affect nutrient supply. Gardeners test first and adjust as advised; “more” is not automatically better, and over-correction can cause problems.',
        },
      },
      {
        icon: '💊',
        title: {
          zh: '药物说明里的酸碱知识',
          en: 'Acid-base knowledge in medicine labels',
        },
        body: {
          zh: '某些抗酸药利用碱性成分减弱胃酸影响。这是有剂量与健康限制的医疗产品，必须按标签或医生、药师建议使用，不能把化学课堂当作治疗建议。',
          en: 'Some antacids use basic ingredients to reduce stomach-acid effects. These are medical products with dose and health limits; follow labels or clinician/pharmacist advice, never treat a chemistry lesson as medical advice.',
        },
      },
      {
        icon: '🧽',
        title: {
          zh: '清洁不是中和游戏',
          en: 'Cleaning is not a neutralisation game',
        },
        body: {
          zh: '不同清洁品可能呈酸性或碱性，但混合它们可能产生危险。专业人员依靠明确配方、通风和安全程序；家庭里只按标签使用一种产品。',
          en: 'Cleaners can be acidic or basic, but mixing them can be dangerous. Professionals rely on known formulas, ventilation and safety procedures; at home, use one product exactly as labelled.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '酸和碱会发生粒子层面的反应',
          en: 'Acids and bases react at particle level',
        },
        body: {
          zh: '在最常见的入门模型中，酸提供 H⁺，碱提供 OH⁻。它们相遇时可形成水：H⁺ + OH⁻ → H₂O；其余离子留在溶液中，常构成盐。',
          en: 'In the usual beginner model, acids provide H⁺ and bases provide OH⁻. When they meet, they can form water: H⁺ + OH⁻ → H₂O; other ions remain in solution and often make a salt.',
        },
      },
      {
        title: {
          zh: '“接近中性”需要恰当份量',
          en: '“Near neutral” needs suitable amounts',
        },
        body: {
          zh: '若酸过量，反应后仍有酸性影响；若碱过量，仍有碱性影响。用指示剂或 pH 计观察，能帮助判断是否已经接近目标范围。',
          en: 'If acid is extra, acidic effects remain; if base is extra, basic effects remain. Indicators or a pH meter can help show whether the target range has been approached.',
        },
      },
      {
        title: {
          zh: '方程式提醒：原子没有消失',
          en: 'Equations remind us: atoms did not disappear',
        },
        body: {
          zh: '例如 HCl + NaOH → NaCl + H₂O。左边的 H、Cl、Na、O 都能在右边找到，只是重新组合成盐和水。这正是你在反应与配平课学过的原子守恒。',
          en: 'For example, HCl + NaOH → NaCl + H₂O. Every H, Cl, Na and O on the left can be found on the right, regrouped as salt and water. This is the atom conservation learned in reaction lessons.',
        },
      },
    ],
    misconception: {
      zh: '“酸加碱一定等于 pH 7”并不准确。只有恰当物质、浓度和份量时才可能接近中性；有一方过量就会偏向那一方。更重要的是，不能通过私自混合家用产品来尝试中和。',
      en: '“Acid plus base always equals pH 7” is inaccurate. Near-neutral conditions require suitable substances, concentrations and amounts; any excess pulls the result toward that side. Most importantly, never try neutralisation by mixing household products.',
    },
    mission: {
      zh: '“刚刚好”思考题：选一个需要精确份量的生活例子，例如煮饭加水、调一杯饮料或给植物浇水。说明“太少、刚好、太多”各会怎样。把这种思维迁移到中和：为什么化学里也不能靠猜或越多越好？不进行任何液体混合实验。',
      en: 'Try a “just right” thinking challenge: choose a life example needing an exact amount—water for rice, a drink mix or watering a plant. Explain too little, just right and too much. Transfer that reasoning to neutralisation: why chemistry cannot rely on guessing or “more is better.” Do not mix any liquids.',
    },
    vocabulary: [
      { en: 'neutralisation', zh: '中和反应' },
      { en: 'excess', zh: '过量' },
      { en: 'salt', zh: '盐' },
      { en: 'target range', zh: '目标范围' },
      { en: 'hydrogen ion (H⁺)', zh: '氢离子（H⁺）' },
      { en: 'hydroxide ion (OH⁻)', zh: '氢氧根离子（OH⁻）' },
    ],
    interactive: 'neutralisation-lab',
    questions: [
      {
        id: 'neutralisation-q1',
        prompt: {
          zh: '向酸性水溶液逐步加入适量碱性溶液，pH 最可能怎样变化？',
          en: 'As a suitable basic solution is gradually added to an acidic water solution, how will pH most likely change?',
        },
        options: [
          {
            zh: '逐渐升高，可能接近 7；若继续过量加入则会偏碱',
            en: 'It rises, may approach 7, and becomes basic if excess base is added',
          },
          { zh: '永远保持不变', en: 'It always stays unchanged' },
          { zh: '一定先降到 0', en: 'It must first fall to 0' },
        ],
        answer: 0,
        explanation: {
          zh: '碱能减弱酸性影响，所以 pH 会向上移动；恰当份量时可接近中性，碱继续过量时会转为碱性。',
          en: 'A base reduces acidic effects, so pH moves upward. Suitable amounts can approach neutral, while excess base makes the result basic.',
        },
      },
      {
        id: 'neutralisation-q2',
        prompt: {
          zh: 'HCl + NaOH → NaCl + H₂O 最能说明中和中的哪一点？',
          en: 'What does HCl + NaOH → NaCl + H₂O best show about neutralisation?',
        },
        options: [
          {
            zh: '原子消失了，只留下水',
            en: 'Atoms disappear and only water remains',
          },
          {
            zh: '原子重新组合，形成盐和水',
            en: 'Atoms rearrange to form a salt and water',
          },
          {
            zh: 'HCl 和 NaOH 是同一种物质',
            en: 'HCl and NaOH are the same substance',
          },
        ],
        answer: 1,
        explanation: {
          zh: '方程式两边都能数到 H、Cl、Na、O；它们没有消失，而是重新排列为氯化钠和水。',
          en: 'H, Cl, Na and O can all be counted on both sides. They do not vanish; they rearrange into sodium chloride and water.',
        },
      },
      {
        id: 'neutralisation-q3',
        prompt: {
          zh: '为什么不能把家用清洁剂混在一起尝试“中和”？',
          en: 'Why must you not mix household cleaners to try to “neutralise” them?',
        },
        options: [
          {
            zh: '因为任何酸碱反应都不会发生',
            en: 'Because acid-base reactions never occur',
          },
          {
            zh: '未知配方可能发生危险反应或产生有害物质，应只按标签使用',
            en: 'Unknown formulas can react dangerously or make harmful substances; use only as labelled',
          },
          {
            zh: '因为 pH 只能在学校里使用',
            en: 'Because pH can be used only at school',
          },
        ],
        answer: 1,
        explanation: {
          zh: '产品成分、浓度和副反应并不透明。化学知识告诉我们尊重风险：不混合、看标签、交给受训人员处理。',
          en: 'Ingredients, concentrations and side reactions are not transparent. Chemistry teaches respect for risk: do not mix, read labels and leave handling to trained people.',
        },
      },
      {
        id: 'neutralisation-q4',
        prompt: {
          zh: '酸和碱反应后仍测得 pH 4，最合理的推断是什么？',
          en: 'After an acid-base reaction, the solution still measures pH 4. What is the most reasonable inference?',
        },
        options: [
          {
            zh: '可能仍有酸性影响，酸相对过量或尚未达到中性目标',
            en: 'Acidic effects likely remain because acid is relatively excess or the neutral target was not reached',
          },
          { zh: '反应一定没有发生', en: 'No reaction could have happened' },
          { zh: 'pH 4 等同于中性', en: 'pH 4 is the same as neutral' },
        ],
        answer: 0,
        explanation: {
          zh: 'pH 4 小于 7，说明结果仍偏酸。它不能单独告诉你全部反应细节，但能说明“还没有接近中性”。',
          en: 'pH 4 is below 7, so the result remains acidic. It does not reveal every reaction detail alone, but it shows the solution is not near neutral.',
        },
      },
    ],
  },
  {
    id: 'acids-and-carbonates',
    levelId: 'acids',
    order: 42,
    title: {
      zh: '酸遇到碳酸盐：气泡从哪里来？',
      en: 'Acids meet carbonates: where do the bubbles come from?',
    },
    eyebrow: {
      zh: '第 42 课 · 气泡是线索，要会追问',
      en: 'Lesson 42 · Bubbles are clues—ask what caused them',
    },
    hook: {
      zh: '贝壳、粉笔和许多石灰岩里都有碳酸盐。酸性雨水长期接触石灰岩，会让洞穴慢慢出现新形状；在实验室里，酸遇碳酸盐还会产生一串气泡。那些气泡究竟是什么？',
      en: 'Shells, chalk and many limestones contain carbonates. Acidic rainwater slowly reshapes limestone caves; in a lab, acid meeting a carbonate can also make bubbles. What exactly are those bubbles?',
    },
    hookHint: {
      zh: '酸与碳酸盐反应常会形成盐、水和二氧化碳。气泡能提示有气体生成，但“看到气泡”本身仍只是证据的一部分：汽水开盖的气泡则多是原本溶解的气体逸出。',
      en: 'Acids reacting with carbonates often form a salt, water and carbon dioxide. Bubbles can suggest a gas formed, but bubbles alone are still only one clue: fizzy-drink bubbles are mostly gas that was already dissolved.',
    },
    bigIdea: {
      zh: '酸和碳酸盐反应时，原子重新组合，常生成盐、水和二氧化碳；必须结合反应物与其他证据，才能说明气泡来自化学反应。',
      en: 'When an acid reacts with a carbonate, atoms rearrange to often form a salt, water and carbon dioxide; identify reactants and other evidence before concluding that bubbles came from a reaction.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🪨',
        title: {
          zh: '石灰岩洞穴的慢速雕刻',
          en: 'Slow sculpture in limestone caves',
        },
        body: {
          zh: '含有微量酸的雨水和地下水会缓慢溶解部分石灰岩，带走物质；在不同条件下又可能形成钟乳石。它把“反应”拉长到了许多年。',
          en: 'Rainwater and groundwater with small amounts of acid slowly dissolve some limestone and carry material away; under other conditions, deposits such as stalactites can form. It stretches “reaction” across many years.',
        },
      },
      {
        icon: '🦷',
        title: { zh: '牙齿保护与酸', en: 'Teeth and acids' },
        body: {
          zh: '牙齿表层含有矿物质，频繁接触酸性饮食会影响它。日常保护依靠正确刷牙、均衡饮食和牙科建议，而不是自己用化学品“中和”口腔。',
          en: 'Tooth surfaces contain minerals, and frequent acidic food or drink exposure can affect them. Protection relies on correct brushing, balanced eating and dental advice—not self-mixing chemicals to “neutralise” your mouth.',
        },
      },
      {
        icon: '🥤',
        title: {
          zh: '汽水也会冒泡，但原因不同',
          en: 'Fizzy drinks bubble for a different reason',
        },
        body: {
          zh: '打开汽水时压力变小，原先溶在饮料里的二氧化碳逸出。它提醒我们：相同现象可能有不同原因，判断需要问“气体从哪里来”。',
          en: 'When a fizzy drink opens, pressure drops and carbon dioxide already dissolved in it escapes. The same observation can have different causes, so ask, “Where did the gas come from?”',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先认出碳酸盐这一类材料',
          en: 'First recognise the carbonate family',
        },
        body: {
          zh: '碳酸盐含有碳酸根离子 CO₃²⁻。碳酸钙 CaCO₃ 是石灰岩、粉笔和许多贝壳的重要成分。它们外观不同，却在微观上共享同一类离子“积木”。',
          en: 'Carbonates contain the carbonate ion CO₃²⁻. Calcium carbonate, CaCO₃, is important in limestone, chalk and many shells. They look different but share this microscopic ionic building block.',
        },
      },
      {
        title: {
          zh: '酸 + 碳酸盐常形成三种产物',
          en: 'Acid + carbonate often gives three products',
        },
        body: {
          zh: '入门规律可以记作：酸 + 碳酸盐 → 盐 + 水 + 二氧化碳。以 CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ 为例，方程式两边每种原子数相等。',
          en: 'A useful beginner pattern is: acid + carbonate → salt + water + carbon dioxide. In CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂, every atom total matches on both sides.',
        },
      },
      {
        title: {
          zh: '气泡先是“值得调查”，不是自动答案',
          en: 'Bubbles mean “investigate,” not automatic proof',
        },
        body: {
          zh: '若已知反应物是酸和碳酸盐，且反应后检测到二氧化碳，气泡就支持“发生反应”的结论。若只是加热水或开汽水，气泡则可能来自状态或压力变化。',
          en: 'If known reactants are an acid and a carbonate and carbon dioxide is detected afterward, bubbles support a reaction conclusion. Heating water or opening fizzy drinks can bubble because of state or pressure changes instead.',
        },
      },
    ],
    misconception: {
      zh: '“所有气泡都是氧气”“所有气泡都表示反应”都不对。酸与碳酸盐产生的常是二氧化碳；沸腾的水蒸气、汽水逸出的 CO₂ 也会形成气泡。科学判断要看来源与证据链。',
      en: '“All bubbles are oxygen” and “all bubbles prove a reaction” are both wrong. Acid-carbonate reactions commonly make carbon dioxide; boiling water vapour and CO₂ escaping fizzy drinks can also bubble. Scientific judgment examines origin and an evidence chain.',
    },
    mission: {
      zh: '气泡观察笔记：选择一个安全、日常且已知的例子（例如开一瓶汽水），只观察并记录气泡在什么时候变多、什么时候变少。不要把任何液体、清洁剂或粉末混在一起。写下你认为气体原本在哪里，以及还需要什么证据才能断定发生了化学反应。',
      en: 'Bubble observation notes: choose one safe, everyday known example such as opening a fizzy drink. Only observe and note when bubbles increase or decrease. Do not mix any liquids, cleaners or powders. Write where you think the gas began and what extra evidence would be needed to conclude a chemical reaction occurred.',
    },
    vocabulary: [
      { en: 'carbonate', zh: '碳酸盐' },
      { en: 'carbon dioxide', zh: '二氧化碳' },
      { en: 'gas evolution', zh: '气体生成 / 放气' },
      { en: 'evidence chain', zh: '证据链' },
      { en: 'calcium carbonate', zh: '碳酸钙' },
    ],
    interactive: 'acid-carbonate-lab',
    questions: [
      {
        id: 'carbonate-q1',
        prompt: {
          zh: '酸与碳酸盐反应的常见产物组合是什么？',
          en: 'What is the usual product combination for an acid-carbonate reaction?',
        },
        options: [
          { zh: '盐、水和二氧化碳', en: 'A salt, water and carbon dioxide' },
          { zh: '只有氧气', en: 'Only oxygen gas' },
          { zh: '只有同一种酸', en: 'Only the same acid' },
        ],
        answer: 0,
        explanation: {
          zh: '入门规律为：酸 + 碳酸盐 → 盐 + 水 + 二氧化碳。二氧化碳常以气泡形式离开液体。',
          en: 'The beginner pattern is acid + carbonate → salt + water + carbon dioxide. The carbon dioxide can leave the liquid as bubbles.',
        },
      },
      {
        id: 'carbonate-q2',
        prompt: {
          zh: '打开一瓶已知的汽水时出现气泡，最合理的起点解释是什么？',
          en: 'A known fizzy drink bubbles when opened. What is the most reasonable starting explanation?',
        },
        options: [
          { zh: '一定产生了新的氧气', en: 'It definitely made new oxygen gas' },
          {
            zh: '压力改变让原本溶解的气体逸出，需要更多证据才能说发生反应',
            en: 'A pressure change releases gas already dissolved; more evidence is needed to claim a reaction',
          },
          {
            zh: '任何气泡都会使原子消失',
            en: 'Any bubbles make atoms disappear',
          },
        ],
        answer: 1,
        explanation: {
          zh: '开盖会降低压力，溶解的 CO₂ 能逸出形成气泡。气泡是观察到的现象，不自动证明有新物质生成。',
          en: 'Opening lowers pressure, so dissolved CO₂ can escape as bubbles. Bubbles are an observation, not automatic proof that a new substance formed.',
        },
      },
      {
        id: 'carbonate-q3',
        prompt: {
          zh: '在 CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ 中，碳元素最后在哪里？',
          en: 'In CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂, where does the carbon end up?',
        },
        options: [
          { zh: '消失了', en: 'It disappears' },
          { zh: '在 CO₂ 中', en: 'In CO₂' },
          { zh: '变成了钙', en: 'It turns into calcium' },
        ],
        answer: 1,
        explanation: {
          zh: '左边 CaCO₃ 中的 1 个 C，在右边 CO₂ 中仍然是 1 个 C。原子重新组合，不会凭空消失或变成另一种元素。',
          en: 'The one C in CaCO₃ on the left is still the one C in CO₂ on the right. Atoms regroup; they do not vanish or turn into a different element.',
        },
      },
      {
        id: 'carbonate-q4',
        prompt: {
          zh: '哪个做法最符合安全地学习酸与碳酸盐？',
          en: 'Which action best fits learning safely about acids and carbonates?',
        },
        options: [
          {
            zh: '混合家里的清洁剂和粉末看看会不会起泡',
            en: 'Mix household cleaners and powders to see whether they bubble',
          },
          {
            zh: '在屏幕模型中追踪产物，并只观察安全的已知日常例子',
            en: 'Track products in a screen model and only observe safe, known everyday examples',
          },
          {
            zh: '闻未知气体来辨认它',
            en: 'Smell an unknown gas to identify it',
          },
        ],
        answer: 1,
        explanation: {
          zh: '学习化学要建立证据和安全习惯：模型可以探索粒子变化，真实生活只观察安全且已知的情境，不混合、不闻未知物质。',
          en: 'Chemistry learning should build evidence and safety habits: use models to explore particle changes, observe only safe known situations, and never mix or smell unknown substances.',
        },
      },
    ],
  },
  {
    id: 'salts-are-more-than-table-salt',
    levelId: 'acids',
    order: 43,
    title: {
      zh: '盐：不只是厨房里的食盐',
      en: 'Salts: more than the salt on your table',
    },
    eyebrow: {
      zh: '第 43 课 · 一整个由离子组成的大家族',
      en: 'Lesson 43 · A whole family built from ions',
    },
    hook: {
      zh: '“盐”这个字会让人想到薯条上的白色颗粒，但花园肥料、石膏、运动饮料里的电解质和路面融冰材料里，也常有不同种类的盐。它们为什么都叫盐，却一点也不像？',
      en: '“Salt” may bring to mind white crystals on chips, yet garden fertilisers, plaster, sports-drink electrolytes and road de-icers can also contain different salts. Why share one name while seeming so unlike?',
    },
    hookHint: {
      zh: '化学里的盐是一大类离子化合物：由正离子和负离子按电荷平衡组合而成。食盐 NaCl 只是其中一个成员，并不能代表整家族的安全性、颜色或用途。',
      en: 'In chemistry, salts are a large class of ionic compounds: positive and negative ions combine in charge-balanced ratios. Table salt, NaCl, is only one member and does not represent the family’s safety, colour or use.',
    },
    bigIdea: {
      zh: '化学中的盐是电荷平衡的离子化合物；中和反应常会形成盐，但不同离子组合会带来不同名称、性质和用途。',
      en: 'A chemical salt is a charge-balanced ionic compound. Neutralisation often forms salts, but different ion combinations give different names, properties and uses.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧂',
        title: {
          zh: '氯化钠：熟悉但不是全部',
          en: 'Sodium chloride: familiar, not the whole story',
        },
        body: {
          zh: 'NaCl 是我们常说的食盐，在调味和保存食物中常见。但“某物是盐”绝不代表它能吃；化学名称先描述组成，安全性要看具体物质和标签。',
          en: 'NaCl is familiar table salt, used for flavour and food preservation. But calling something a salt never means it is edible; a chemical name describes composition, while safety depends on the exact substance and label.',
        },
      },
      {
        icon: '🌾',
        title: { zh: '植物需要的离子', en: 'Ions plants need' },
        body: {
          zh: '一些肥料含有硝酸盐、钾盐或铵盐，帮助提供养分。浓度和用量很重要：植物需要营养，不意味着越多越好。',
          en: 'Some fertilisers contain nitrate, potassium or ammonium salts to supply nutrients. Concentration and amount matter: plants need nutrients, but more is not automatically better.',
        },
      },
      {
        icon: '🏗️',
        title: { zh: '石膏与建筑', en: 'Gypsum and buildings' },
        body: {
          zh: '石膏含有钙、硫酸根和结晶水，是建筑板材和石膏绷带中的重要材料。它展示了盐可以是坚固的固体材料，而不是小瓶调料。',
          en: 'Gypsum contains calcium, sulfate and water of crystallisation, and is important in boards and plaster casts. It shows that a salt can be a solid building material, not a seasoning bottle.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '盐由正负离子“配对”',
          en: 'A salt pairs positive and negative ions',
        },
        body: {
          zh: '盐中的离子要整体电中性：Na⁺ 与 Cl⁻ 用 1:1 配成 NaCl；Ca²⁺ 与两个 Cl⁻ 配成 CaCl₂。这里的下标来自电荷平衡，不是任意装饰。',
          en: 'Ions in a salt must be overall neutral: Na⁺ and Cl⁻ pair 1:1 as NaCl; Ca²⁺ pairs with two Cl⁻ as CaCl₂. The subscripts come from charge balance, not decoration.',
        },
      },
      {
        title: {
          zh: '中和会留下“其余离子”组成盐',
          en: 'Neutralisation leaves other ions to make a salt',
        },
        body: {
          zh: '在 HCl + NaOH → NaCl + H₂O 中，H⁺ 与 OH⁻ 形成水，而 Na⁺ 与 Cl⁻ 形成氯化钠。这个“其余离子配对”的视角，能把中和和盐连接起来。',
          en: 'In HCl + NaOH → NaCl + H₂O, H⁺ and OH⁻ form water, while Na⁺ and Cl⁻ form sodium chloride. This “leftover ions pair up” view connects neutralisation to salts.',
        },
      },
      {
        title: {
          zh: '名字告诉你离子，不替你判断安全',
          en: 'A name tells ions; it does not decide safety',
        },
        body: {
          zh: '“氯化钙”表示 Ca²⁺ 和 Cl⁻，“硝酸钾”表示 K⁺ 和 NO₃⁻。名字能帮助追踪组成，但是否能触碰、食用或用于植物，要严格看该产品的用途与说明。',
          en: '“Calcium chloride” signals Ca²⁺ and Cl⁻; “potassium nitrate” signals K⁺ and NO₃⁻. Names help track composition, but whether something may be handled, eaten or used on plants depends strictly on the product’s intended use and directions.',
        },
      },
    ],
    misconception: {
      zh: '“盐就是咸的、白的、可以吃”是错误的。化学盐的外观、溶解性和危险性差别很大；有些是食品成分，有些只能由专业人员或按特定说明处理。不要因为名字里有“盐”就触碰或品尝。',
      en: '“A salt is salty, white and edible” is wrong. Chemical salts vary greatly in appearance, solubility and hazard; some are food ingredients, while others require professionals or specific directions. Never touch or taste something just because its name includes “salt.”',
    },
    mission: {
      zh: '“盐家族”标签侦探：只阅读家中已密封产品的成分或用途标签，找一个提到 sodium、calcium、potassium、chloride、nitrate 或 sulfate 的例子。不要打开、取样或接触；记录它的用途，并说明为什么用途标签比“名字里有盐”更能决定安全做法。',
      en: 'Salt-family label detective: only read the ingredient or use label on a sealed product at home and find one mentioning sodium, calcium, potassium, chloride, nitrate or sulfate. Do not open, sample or touch it; record its intended use and explain why a use label matters more for safety than the word “salt.”',
    },
    vocabulary: [
      { en: 'salt (ionic compound)', zh: '盐（离子化合物）' },
      { en: 'cation', zh: '阳离子' },
      { en: 'anion', zh: '阴离子' },
      { en: 'charge balance', zh: '电荷平衡' },
      { en: 'formula unit', zh: '化学式单位' },
    ],
    interactive: 'salt-family-lab',
    questions: [
      {
        id: 'salt-q1',
        prompt: {
          zh: '为什么 Ca²⁺ 与 Cl⁻ 形成 CaCl₂ 而不是 CaCl？',
          en: 'Why do Ca²⁺ and Cl⁻ form CaCl₂ rather than CaCl?',
        },
        options: [
          {
            zh: '一个 Ca²⁺ 需要两个 Cl⁻ 才能让总电荷为零',
            en: 'One Ca²⁺ needs two Cl⁻ ions to make total charge zero',
          },
          {
            zh: '因为所有盐都必须有两个氯',
            en: 'Because every salt must contain two chlorines',
          },
          { zh: '因为 Cl⁻ 会改变成 Ca²⁺', en: 'Because Cl⁻ turns into Ca²⁺' },
        ],
        answer: 0,
        explanation: {
          zh: 'Ca²⁺ 是 +2；每个 Cl⁻ 是 −1。两个 Cl⁻ 合起来是 −2，正好与一个 Ca²⁺ 平衡。',
          en: 'Ca²⁺ has +2 charge and each Cl⁻ has −1. Two Cl⁻ together make −2, exactly balancing one Ca²⁺.',
        },
      },
      {
        id: 'salt-q2',
        prompt: {
          zh: '在 HCl + NaOH → NaCl + H₂O 中，NaCl 从哪里来？',
          en: 'In HCl + NaOH → NaCl + H₂O, where does NaCl come from?',
        },
        options: [
          {
            zh: 'Na⁺ 与 Cl⁻ 在 H⁺ 和 OH⁻ 形成水后配对',
            en: 'Na⁺ and Cl⁻ pair after H⁺ and OH⁻ form water',
          },
          { zh: '水变成了 Na 和 Cl', en: 'Water turns into Na and Cl' },
          {
            zh: 'NaCl 一直不存在，只是写在箭头右边',
            en: 'NaCl never exists; it is only written on the right side',
          },
        ],
        answer: 0,
        explanation: {
          zh: 'H⁺ 与 OH⁻ 生成水后，Na⁺ 与 Cl⁻ 仍在体系中，并按电荷平衡组成氯化钠。',
          en: 'After H⁺ and OH⁻ make water, Na⁺ and Cl⁻ remain in the system and pair in a charge-balanced sodium chloride formula.',
        },
      },
      {
        id: 'salt-q3',
        prompt: {
          zh: '“某物是盐”最能告诉你什么？',
          en: 'What does “this substance is a salt” tell you most directly?',
        },
        options: [
          { zh: '它一定能吃', en: 'It is definitely edible' },
          { zh: '它一定是白色颗粒', en: 'It is definitely white granules' },
          {
            zh: '它是由正负离子按电荷平衡组成的一类离子化合物',
            en: 'It is an ionic compound class built from charge-balanced positive and negative ions',
          },
        ],
        answer: 2,
        explanation: {
          zh: '“盐”描述的是化学组成类别，不是食用许可、颜色承诺或安全等级。',
          en: '“Salt” names a chemical composition class, not an edible permission, colour promise or safety rating.',
        },
      },
      {
        id: 'salt-q4',
        prompt: {
          zh: '遇到名称里有 “salt/盐” 的陌生产品，最可靠的安全依据是什么？',
          en: 'For an unfamiliar product with “salt” in its name, what is the most reliable safety guide?',
        },
        options: [
          { zh: '先尝一点判断', en: 'Taste a little first' },
          {
            zh: '看产品用途、安全标签并按说明处理',
            en: 'Read its intended-use and safety label, then follow directions',
          },
          {
            zh: '只要是白色就当作食盐',
            en: 'Treat it as table salt if it is white',
          },
        ],
        answer: 1,
        explanation: {
          zh: '化学名称不等于使用方法。可靠依据是完整标签、用途与安全说明；不确定时不接触并询问负责成人。',
          en: 'A chemical name is not a use instruction. The reliable guide is the full label, intended use and safety directions; if unsure, do not handle it and ask a responsible adult.',
        },
      },
    ],
  },
  {
    id: 'acids-and-metals',
    levelId: 'acids',
    order: 44,
    title: {
      zh: '酸与金属：谁会放出氢气？',
      en: 'Acids and metals: who releases hydrogen?',
    },
    eyebrow: {
      zh: '第 44 课 · 用反应性解释不同金属的表现',
      en: 'Lesson 44 · Use reactivity to explain different metals',
    },
    hook: {
      zh: '为什么有些金属遇酸会产生气泡，有些看起来却几乎没反应？这不是“金属都有同一种性格”，而是它们失去电子的难易不同。',
      en: 'Why do some metals bubble with acid while others seem to barely react? Metals do not all have the same “personality”: they differ in how readily they lose electrons.',
    },
    hookHint: {
      zh: '在安全、受控的实验室模型中，较活泼的金属可与酸反应，形成一种盐并放出氢气。不同金属的反应速度不同；铜和稀盐酸的入门模型中通常不发生这种反应。',
      en: 'In a safe, controlled lab model, a more reactive metal can react with acid to form a salt and release hydrogen gas. Metals differ in speed; copper and dilute hydrochloric acid usually do not show this beginner-model reaction.',
    },
    bigIdea: {
      zh: '较活泼的金属能与酸反应，形成盐和氢气；反应性差异来自金属失去电子的难易，绝不能靠家庭混合来测试。',
      en: 'More reactive metals can react with acids to form a salt and hydrogen gas; reactivity differences reflect how readily metals lose electrons, and must never be tested by mixing things at home.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🚲',
        title: {
          zh: '金属并不总是“越亮越耐用”',
          en: 'Shiny is not always durable',
        },
        body: {
          zh: '自行车、桥梁和厨房工具会选择不同金属或涂层来平衡强度、质量、成本和耐腐蚀性。材料选择来自性质的权衡，而不只看外观。',
          en: 'Bicycles, bridges and kitchen tools use different metals or coatings to balance strength, mass, cost and corrosion resistance. Materials are chosen by trade-offs, not appearance alone.',
        },
      },
      {
        icon: '🔋',
        title: {
          zh: '电子转移藏在电池里',
          en: 'Electron transfer hides in batteries',
        },
        body: {
          zh: '金属较容易失去电子这一倾向，是许多电池和防腐设计背后的核心想法。下一单元会更深入研究氧化还原与电化学。',
          en: 'A metal’s tendency to lose electrons is central to many batteries and corrosion-control designs. The next unit explores redox and electrochemistry more deeply.',
        },
      },
      {
        icon: '🛑',
        title: {
          zh: '家用清洁剂不是金属实验器材',
          en: 'Household cleaners are not metal-lab tools',
        },
        body: {
          zh: '酸性产品可能伤害某些金属表面，也可能与其他成分发生危险反应。清洁时看用途标签；学习反应性时使用动画、数据和受监督实验。',
          en: 'Acidic products can damage some metal surfaces and react dangerously with other ingredients. Clean by reading use labels; learn reactivity through animations, data and supervised experiments.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '一个入门反应：金属 + 酸',
          en: 'A beginner reaction: metal + acid',
        },
        body: {
          zh: '常见入门规律是：金属 + 酸 → 盐 + 氢气。例如 Mg + 2HCl → MgCl₂ + H₂。镁原子进入溶液成为 Mg²⁺，氢离子结合成 H₂ 气体。',
          en: 'A useful beginner pattern is metal + acid → salt + hydrogen. For example, Mg + 2HCl → MgCl₂ + H₂. Magnesium atoms enter solution as Mg²⁺ while hydrogen ions pair into H₂ gas.',
        },
      },
      {
        title: {
          zh: '同是金属，反应性并不相同',
          en: 'Metals do not share one reactivity level',
        },
        body: {
          zh: '镁通常比铁反应更快；铜在这个入门条件下通常不与稀盐酸产生氢气。我们会用“反应性系列”整理这些比较，避免只背零散例子。',
          en: 'Magnesium usually reacts faster than iron; copper in this beginner condition usually does not release hydrogen with dilute hydrochloric acid. A reactivity series organises these comparisons instead of memorising isolated facts.',
        },
      },
      {
        title: {
          zh: '气泡里的氢来自酸里的氢',
          en: 'Hydrogen bubbles come from the acid’s hydrogen',
        },
        body: {
          zh: '在 Mg + 2HCl → MgCl₂ + H₂ 中，H₂ 里的 H 来自 HCl，金属镁没有“变成气体”。追踪元素的去向，能把观察到的气泡和方程式连接起来。',
          en: 'In Mg + 2HCl → MgCl₂ + H₂, the H in H₂ comes from HCl; magnesium does not “turn into gas.” Tracking where elements go connects the observed bubbles to the equation.',
        },
      },
    ],
    misconception: {
      zh: '“看到气泡就能靠近闻或点火确认氢气”是危险且错误的学习方式。氢气易燃，真实气体鉴定只在适当设备、通风与教师监督的实验室中进行；屏幕模型足够帮助我们先理解粒子变化。',
      en: '“When I see bubbles, I can go close, smell them or use a flame to confirm hydrogen” is dangerous and wrong. Hydrogen is flammable; real gas identification belongs only in properly equipped, ventilated and supervised labs. A screen model is enough to first understand particle changes.',
    },
    mission: {
      zh: '材料选择观察：找一个家中已知金属物品（例如不锈钢勺、铝罐或铜色电线外皮），只观察其用途、形状和是否有保护层。不要滴任何液体、刮擦或加热。猜想设计者为什么选这种材料，再查阅产品标签或向大人询问。',
      en: 'Materials-choice observation: choose a known metal object at home, such as a stainless-steel spoon, aluminium can or copper-coloured wire coating. Only observe its use, shape and any protective layer. Do not add liquid, scratch or heat it. Guess why the designer chose that material, then read the label or ask an adult.',
    },
    vocabulary: [
      { en: 'reactivity', zh: '反应性' },
      { en: 'reactivity series', zh: '金属活动性顺序' },
      { en: 'hydrogen gas', zh: '氢气' },
      { en: 'corrosion', zh: '腐蚀' },
      { en: 'electron transfer', zh: '电子转移' },
    ],
    interactive: 'acid-metal-lab',
    questions: [
      {
        id: 'acid-metal-q1',
        prompt: {
          zh: '在 Mg + 2HCl → MgCl₂ + H₂ 中，氢气里的 H 最初来自哪里？',
          en: 'In Mg + 2HCl → MgCl₂ + H₂, where did the H in hydrogen gas begin?',
        },
        options: [
          { zh: '盐酸 HCl', en: 'Hydrochloric acid, HCl' },
          { zh: '金属镁 Mg', en: 'Magnesium metal, Mg' },
          { zh: '凭空出现', en: 'It appears from nowhere' },
        ],
        answer: 0,
        explanation: {
          zh: '方程式左边 HCl 含有 H，右边 H₂ 含有同样的 H 原子；镁最终以 Mg²⁺ 形式进入 MgCl₂。',
          en: 'HCl on the left contains H, and H₂ on the right contains those same H atoms. Magnesium ends up as Mg²⁺ in MgCl₂.',
        },
      },
      {
        id: 'acid-metal-q2',
        prompt: {
          zh: '为什么镁与铁在相同酸中可能冒泡速度不同？',
          en: 'Why might magnesium and iron bubble at different speeds in the same acid?',
        },
        options: [
          {
            zh: '所有金属的反应性相同，只是颜色不同',
            en: 'All metals have identical reactivity; only their colours differ',
          },
          {
            zh: '它们失去电子的难易不同，反应性不同',
            en: 'They differ in how readily they lose electrons, so their reactivity differs',
          },
          {
            zh: '气泡速度决定原子会不会守恒',
            en: 'Bubble speed decides whether atoms are conserved',
          },
        ],
        answer: 1,
        explanation: {
          zh: '金属反应性与其失去电子形成正离子的难易有关。镁通常比铁更活泼，因此在相同条件下常更快。',
          en: 'Metal reactivity relates to how readily it loses electrons to form positive ions. Magnesium is usually more reactive than iron, so it often reacts faster under the same conditions.',
        },
      },
      {
        id: 'acid-metal-q3',
        prompt: {
          zh: '哪个做法适合安全学习“金属与酸反应”？',
          en: 'Which action is suitable for learning safely about metal-acid reactions?',
        },
        options: [
          {
            zh: '用家用清洁剂在金属上试一试',
            en: 'Try a household cleaner on metal',
          },
          {
            zh: '在虚拟模型中比较反应性，并在受监督实验室中才做真实实验',
            en: 'Compare reactivity in a virtual model and do real experiments only in a supervised lab',
          },
          {
            zh: '对未知气体靠近闻一闻',
            en: 'Move close to smell an unknown gas',
          },
        ],
        answer: 1,
        explanation: {
          zh: '酸、金属与气体都有安全风险。先用模型建立因果关系，真实操作则需要设备、通风和受训监督。',
          en: 'Acids, metals and gases all have safety risks. Use models first to build cause and effect; real work needs equipment, ventilation and trained supervision.',
        },
      },
      {
        id: 'acid-metal-q4',
        prompt: {
          zh: '铜与稀盐酸在这个入门模型中通常没有明显氢气气泡，最好的解释是什么？',
          en: 'Copper usually shows no obvious hydrogen bubbles with dilute hydrochloric acid in this beginner model. What is the best explanation?',
        },
        options: [
          { zh: '铜原子消失了', en: 'Copper atoms disappeared' },
          {
            zh: '铜在该条件下反应性不足，不能像镁那样置换出氢',
            en: 'Copper is not reactive enough in this condition to displace hydrogen like magnesium',
          },
          {
            zh: '所有无气泡现象都是中性',
            en: 'Every non-bubbling situation is neutral',
          },
        ],
        answer: 1,
        explanation: {
          zh: '不同金属有不同反应性；铜在这里不像镁那样容易失电子并驱动氢离子形成 H₂。',
          en: 'Metals have different reactivities. Here copper does not lose electrons as readily as magnesium to drive hydrogen ions into H₂.',
        },
      },
    ],
  },
  {
    id: 'ph-tenfold-staircase',
    levelId: 'acids',
    order: 73,
    title: {
      zh: 'pH 的十倍台阶：差 1，不只是差一点',
      en: 'The tenfold pH staircase: one step matters',
    },
    eyebrow: {
      zh: '第 73 课 · 用稀释读懂 pH',
      en: 'Lesson 73 · Read pH through dilution',
    },
    hook: {
      zh: '两份水样的 pH 分别是 3 和 5。数字只差 2，参与酸性的关键离子浓度却差了 100 倍！为什么这把尺子不像厘米尺？',
      en: 'Two water samples have pH 3 and 5. Just two units apart, yet their hydronium concentrations differ a hundredfold! Why is this ruler unlike a ruler in centimetres?',
    },
    hookHint: {
      zh: '接上第 40 课的酸碱分类和第 71 课的 mol/L。这里先学十倍台阶，不需要先会对数运算。',
      en: 'Connect the acid/base classification in Lesson 40 with mol/L in Lesson 71. Start with tenfold steps; you do not need logarithm skills yet.',
    },
    bigIdea: {
      zh: '在稀水溶液的入门模型中，pH 每降低 1，H₃O⁺ 的浓度就增大 10 倍。',
      en: 'In the introductory dilute-solution model, lowering pH by one multiplies hydronium concentration by ten.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🌧️',
        title: { zh: '环境水样的小数字', en: 'Small numbers on water reports' },
        body: {
          zh: '比较 pH 4 与 pH 5 的水样时，不能说“只是多 1”。要比较 H₃O⁺ 浓度，它们相差 10 倍；生态影响还需要其他证据，不能只凭这个数字判断。',
          en: 'Comparing water at pH 4 and 5 is not “just one more.” Their hydronium concentrations differ tenfold; environmental effects still need more evidence than this number alone.',
        },
      },
      {
        icon: '🧃',
        title: {
          zh: '饮料数字不是甜度尺',
          en: 'Drink pH is not a sweetness scale',
        },
        body: {
          zh: 'pH 描述酸碱相关离子，不直接测糖含量，也不告诉你一杯饮料含有的全部酸。两杯相同 pH 的饮料，配方仍可能很不同。',
          en: 'pH describes acid/base-related ions, not sugar content or the total acid in a drink. Two drinks at the same pH can still have very different recipes.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '加水会一路变成碱吗？',
          en: 'Will adding water eventually make a base?',
        },
        body: {
          zh: '理想酸溶液只用纯水稀释，会接近中性，不会凭空变成碱。越接近中性，水本身产生的离子越不能忽略。',
          en: 'Diluting an ideal acid with pure water approaches neutrality; it does not create a base. Near neutrality, ions from water itself can no longer be ignored.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先看三个十倍台阶', en: 'Start with three tenfold steps' },
        body: {
          zh: '在入门浓度模型中：pH 2 对应 [H₃O⁺] = 0.010 mol/L；pH 3 对应 0.0010 mol/L；pH 4 对应 0.00010 mol/L。方括号表示该粒子的物质的量浓度，不是整瓶酸的总量。',
          en: 'In the introductory concentration model: pH 2 corresponds to [H₃O⁺] = 0.010 mol/L, pH 3 to 0.0010 mol/L, and pH 4 to 0.00010 mol/L. Brackets mean the ion’s molar concentration, not the total acid in a bottle.',
        },
      },
      {
        title: {
          zh: '例题：从 pH 3 到 pH 5',
          en: 'Worked example: pH 3 versus pH 5',
        },
        body: {
          zh: '问题：哪份水样的 H₃O⁺ 更多？先把浓度写成 0.0010 与 0.000010 mol/L，再相除：0.0010 ÷ 0.000010 = 100。答案：pH 3 那份的 H₃O⁺ 浓度是 pH 5 那份的 100 倍，不是 2 倍。',
          en: 'Which sample has more hydronium? Write 0.0010 and 0.000010 mol/L, then divide: 0.0010 ÷ 0.000010 = 100. The pH 3 sample has a hundred times the hydronium concentration of the pH 5 sample, not twice as much.',
        },
      },
      {
        title: {
          zh: '把十倍台阶接到稀释',
          en: 'Connect the staircase to dilution',
        },
        body: {
          zh: '例题：理想稀盐酸 pH 2，加纯水至原体积的 10 倍，酸的配制浓度变为十分之一，[H₃O⁺] 也近似减为十分之一，所以 pH 约为 3。这个简便规律只适用于这里的稀强酸模型、且离中性足够远；不能机械套给果汁或缓冲液。',
          en: 'Example: dilute ideal HCl at pH 2 to ten times its volume with pure water. Acid concentration becomes one tenth, hydronium approximately does too, so pH is about 3. This shortcut applies to this dilute strong-acid model away from neutrality, not automatically to juice or buffers.',
        },
      },
    ],
    misconception: {
      zh: 'pH 不是线性刻度，也不是“酸有多少克”。25 °C 时中性对应 pH 7；其他温度下中性 pH 会变化。极度稀释时不能继续把“十倍加 1”外推到 pH 8：水本身也参与离子平衡。',
      en: 'pH is not a linear scale or grams of acid. Neutral pH is 7 at 25 °C and changes with temperature. At extreme dilution, do not extend “tenfold adds one” to pH 8: water also contributes to the ion balance.',
    },
    mission: {
      zh: '在虚拟稀释台上，先预测 pH 约为 2 的盐酸稀释 10 倍与 100 倍后的结果。再试 100 万倍，观察结果为什么接近 7 而没有越过 7。用“浓度”和“水的贡献”解释，别只念数字。',
      en: 'On the virtual bench, predict the results of diluting HCl near pH 2 tenfold and a hundredfold. Then try a millionfold dilution. Explain why it approaches 7 without crossing it, using concentration and water’s contribution rather than just reading numbers.',
    },
    vocabulary: [
      { en: 'hydronium ion', zh: '水合氢离子 H₃O⁺' },
      { en: 'logarithmic scale', zh: '对数刻度' },
      { en: 'tenfold dilution', zh: '十倍稀释' },
      { en: 'neutrality', zh: '中性' },
    ],
    resources: [
      {
        title: {
          zh: '高中拓展（英文）：pH、离子浓度与温度 · OpenStax',
          en: 'Optional advanced reading: pH, ion concentration and temperature · OpenStax',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh',
      },
    ],
    interactive: 'ph-dilution-lab',
    questions: [
      {
        id: 'ph-staircase-q1',
        prompt: {
          zh: '在本课模型中，pH 3 与 pH 4 的水样，谁的 H₃O⁺ 浓度更高？',
          en: 'In this model, which has more hydronium: pH 3 or pH 4?',
        },
        options: [
          { zh: 'pH 3，是另一份的 10 倍', en: 'pH 3: ten times as much' },
          { zh: 'pH 4，是另一份的 10 倍', en: 'pH 4: ten times as much' },
          {
            zh: '相同，因为只差 1',
            en: 'Equal because they differ by only one',
          },
        ],
        answer: 0,
        explanation: {
          zh: 'pH 数字更小，H₃O⁺ 浓度更高。差 1 个台阶就是 10 倍关系，不是小小的加减差。',
          en: 'Lower pH means greater hydronium concentration. A one-step difference is a tenfold ratio, not a small additive change.',
        },
      },
      {
        id: 'ph-staircase-q2',
        prompt: {
          zh: 'pH 2 的 H₃O⁺ 浓度是 pH 5 的多少倍？',
          en: 'How many times greater is hydronium concentration at pH 2 than at pH 5?',
        },
        options: [
          { zh: '3 倍', en: '3 times' },
          { zh: '100 倍', en: '100 times' },
          { zh: '1000 倍', en: '1000 times' },
        ],
        answer: 2,
        explanation: {
          zh: '差 3 个十倍台阶：10 × 10 × 10 = 1000。也可用 10⁻² ÷ 10⁻⁵ = 10³ 检查。',
          en: 'Three tenfold steps give 10 × 10 × 10 = 1000. Check with 10⁻² ÷ 10⁻⁵ = 10³.',
        },
      },
      {
        id: 'ph-staircase-q3',
        prompt: {
          zh: '理想稀盐酸 pH 2，用纯水稀释到 10 倍体积且远离中性，pH 约变成多少？',
          en: 'Ideal dilute HCl at pH 2 is diluted to ten times its volume with pure water, away from neutrality. Its new pH is approximately?',
        },
        options: [
          { zh: '20', en: '20' },
          { zh: '3', en: '3' },
          { zh: '1', en: '1' },
        ],
        answer: 1,
        explanation: {
          zh: '浓度变成十分之一，对应 pH 增加约 1：2 → 3。不是把 pH 乘 10，也不是让酸性更强。',
          en: 'One tenth the concentration means pH increases by about one: 2 → 3. Do not multiply pH by ten or make the solution more acidic.',
        },
      },
      {
        id: 'ph-staircase-q4',
        prompt: {
          zh: '25 °C 下，只用纯水极度稀释理想酸溶液，正确预测是什么？',
          en: 'At 25 °C, what happens when an ideal acid is extremely diluted with pure water only?',
        },
        options: [
          {
            zh: '从酸性一侧接近 pH 7',
            en: 'It approaches pH 7 from the acidic side',
          },
          { zh: '一定变成 pH 8 的碱', en: 'It must become a pH 8 base' },
          { zh: 'pH 完全不变', en: 'Its pH never changes' },
        ],
        answer: 0,
        explanation: {
          zh: '越稀越要考虑水的离子贡献。只加纯水没有加入碱；这个理想模型从酸性一侧趋近中性。',
          en: 'At very low acid concentration, water’s ions matter. Pure water adds no base; this ideal model approaches neutrality from the acidic side.',
        },
      },
      {
        id: 'ph-staircase-q5',
        prompt: {
          zh: '两瓶饮料 pH 相同，能直接推出什么？',
          en: 'Two drinks have the same pH. What can you directly conclude?',
        },
        options: [
          { zh: '糖含量相同', en: 'They contain equal sugar' },
          { zh: '总酸量相同', en: 'They contain equal total acid' },
          {
            zh: '同条件下的酸碱度相同，但糖和总酸量未必相同',
            en: 'Their pH matches under the same conditions, but sugar and total acid need not',
          },
        ],
        answer: 2,
        explanation: {
          zh: 'pH 描述特定离子的状况，不是配方总账。糖、其他成分和酸的种类都可能不同。',
          en: 'pH describes particular ions, not the whole recipe. Sugar, other ingredients and acid types may differ.',
        },
      },
      {
        id: 'ph-staircase-q6',
        prompt: {
          zh: '关于中性，哪句话更准确？',
          en: 'Which statement about neutrality is more accurate?',
        },
        options: [
          {
            zh: '所有温度下中性都必须是 pH 7',
            en: 'Neutral must mean pH 7 at every temperature',
          },
          {
            zh: '中性时 H₃O⁺ 与 OH⁻ 浓度相等；25 °C 时对应 pH 7',
            en: 'Neutral means equal H₃O⁺ and OH⁻ concentrations; at 25 °C this is pH 7',
          },
          { zh: '中性时水里没有任何离子', en: 'Neutral water has no ions' },
        ],
        answer: 1,
        explanation: {
          zh: '相等的是两类离子的浓度，不是离子完全不存在。温度会影响水的离子平衡，所以 pH 7 的中性标尺要带上 25 °C 条件。',
          en: 'The two ion concentrations are equal, not absent. Temperature changes water’s ion balance, so the neutral pH 7 reference needs the 25 °C condition.',
        },
      },
    ],
  },
  {
    id: 'strong-acid-is-not-concentrated-acid',
    levelId: 'acids',
    order: 74,
    title: {
      zh: '强酸不等于浓酸：数量与性格分开看',
      en: 'Strong is not concentrated: amount versus behaviour',
    },
    eyebrow: {
      zh: '第 74 课 · 两个容易混淆的标签',
      en: 'Lesson 74 · Two easily confused labels',
    },
    hook: {
      zh: '食醋中的乙酸是弱酸，盐酸是强酸。可如果盐酸稀得非常厉害，一份更浓的乙酸溶液反而可能 pH 更低。“强”到底在说什么？',
      en: 'Ethanoic acid in vinegar is a weak acid; HCl is strong. Yet a more concentrated ethanoic-acid solution can have lower pH than very dilute HCl. What does “strong” actually mean?',
    },
    hookHint: {
      zh: '把第 71 课的配制浓度和第 73 课的 H₃O⁺ 浓度分开：放进了多少酸，不等于此刻有多少酸转化出了离子。第 59 课的双向平衡会帮上忙。',
      en: 'Separate recipe concentration from Lesson 71 and hydronium concentration from Lesson 73: acid added is not identical to acid ionised. The reversible balance in Lesson 59 will help.',
    },
    bigIdea: {
      zh: '浓或稀描述每升放了多少酸；强或弱描述酸在水中转移质子、形成离子的程度。',
      en: 'Concentrated or dilute describes acid added per litre; strong or weak describes how it transfers protons and forms ions in water.',
    },
    estimatedMinutes: 22,
    everydayExamples: [
      {
        icon: '🍶',
        title: {
          zh: '醋：有酸，却不全变成离子',
          en: 'Vinegar: acid is not all ionised',
        },
        body: {
          zh: '醋中的乙酸在水里只有部分分子转移质子。未转化的酸分子仍在溶液中，并没有“失效”或消失；食醋也不是本课模型的纯乙酸溶液。',
          en: 'Only some ethanoic-acid molecules transfer protons in water. The others remain in solution, not inactive or vanished; real vinegar is not our pure ethanoic-acid model.',
        },
      },
      {
        icon: '🏷️',
        title: { zh: '标签里的两个问题', en: 'Two questions on a label' },
        body: {
          zh: '“0.010 mol/L”回答放进了多少酸；“强酸”回答它在水中的行为。只知道其中一条，还不足以公平比较两份不同酸溶液的 pH。',
          en: '“0.010 mol/L” tells how much acid was added; “strong acid” describes behaviour in water. One label alone is not enough to compare the pH of two different acid solutions fairly.',
        },
      },
      {
        icon: '⚖️',
        title: {
          zh: '为什么要同条件比较？',
          en: 'Why compare under matching conditions?',
        },
        body: {
          zh: '想看酸的强弱，先把配制浓度、温度等条件设成相同。否则浓度差异可能掩盖酸本身的性质，就像不能靠一锅汤与一小口汤的总盐量比较咸淡。',
          en: 'To compare acid strength, first match recipe concentration, temperature and other conditions. Otherwise concentration differences can hide the acid’s behaviour, like comparing total salt in a pot and a sip to judge saltiness.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '看酸如何把质子交给水',
          en: 'Watch an acid pass a proton to water',
        },
        body: {
          zh: 'HCl + H₂O → H₃O⁺ + Cl⁻：稀盐酸中的 HCl 几乎完全转化。乙酸则是 CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻，到平衡时仍有大量乙酸分子未转化。这里的 H⁺ 是常用简写；水里用 H₃O⁺ 表达更直观。',
          en: 'HCl + H₂O → H₃O⁺ + Cl⁻: dilute HCl is almost fully ionised. Ethanoic acid follows CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻, leaving many acid molecules at equilibrium. H⁺ is a common shorthand; H₃O⁺ makes the water’s role clearer.',
        },
      },
      {
        title: {
          zh: '例题：同浓度，谁的 pH 更低？',
          en: 'Worked example: equal concentration, whose pH is lower?',
        },
        body: {
          zh: '25 °C 的理想模型：都配成 0.010 mol/L。盐酸的 [H₃O⁺] 约 0.010 mol/L，pH 约 2；乙酸约 0.00042 mol/L，pH 约 3.38。因为乙酸只部分电离，所以在相同配制浓度下，盐酸 pH 更低。先理解原因，不要求现在解乙酸平衡方程。',
          en: 'Ideal model at 25 °C: both are made to 0.010 mol/L. HCl gives about 0.010 mol/L hydronium, pH about 2; ethanoic acid gives about 0.00042 mol/L, pH about 3.38. Partial ionisation explains why HCl has lower pH at equal recipe concentration. You need not solve the weak-acid equation yet.',
        },
      },
      {
        title: {
          zh: '换浓度，排名可能倒过来',
          en: 'Change concentration and the ranking can reverse',
        },
        body: {
          zh: '把盐酸改成 0.00010 mol/L，pH 约 4；乙酸配成 0.100 mol/L，pH 约 2.88。弱酸那杯反而 pH 更低！这没有把乙酸变成强酸：只说明比较 pH 时，酸的性质和配制浓度都要看。',
          en: 'Use 0.00010 mol/L HCl, pH about 4, and 0.100 mol/L ethanoic acid, pH about 2.88. The weak-acid sample now has lower pH! Ethanoic acid did not become strong; pH depends on both acid behaviour and recipe concentration.',
        },
      },
    ],
    misconception: {
      zh: '弱酸不等于无害，稀释强酸也不会把它变成弱酸。弱酸的电离百分比会随浓度变化，不是永久固定的“只有 1%”。本课是虚拟比较，不是尝味、触摸或混合酸的实验。',
      en: 'Weak does not mean harmless, and diluting a strong acid does not turn it into a weak acid. A weak acid’s ionisation percentage changes with concentration; it is not permanently “only 1%.” This is a virtual comparison, not an experiment involving tasting, touching or mixing acids.',
    },
    mission: {
      zh: '先让盐酸与乙酸都为 0.010 mol/L，预测哪杯 pH 更低。再选“稀强酸 vs 浓弱酸”，找出排名反转的证据。最后只稀释乙酸，观察电离百分比增加却不代表 H₃O⁺ 浓度也增加。',
      en: 'Start with both acids at 0.010 mol/L and predict the lower pH. Then choose “dilute strong vs concentrated weak” and find evidence of the reversal. Finally dilute only ethanoic acid: notice that a rising ionisation percentage does not mean rising hydronium concentration.',
    },
    vocabulary: [
      { en: 'strong acid', zh: '强酸' },
      { en: 'weak acid', zh: '弱酸' },
      { en: 'concentrated / dilute', zh: '浓 / 稀' },
      { en: 'ionisation', zh: '电离' },
      { en: 'proton transfer', zh: '质子转移' },
    ],
    resources: [
      {
        title: {
          zh: '高中拓展（英文）：酸的强弱与电离平衡 · OpenStax',
          en: 'Optional advanced reading: acid strength and ionisation equilibrium · OpenStax',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases',
      },
    ],
    interactive: 'acid-strength-lab',
    questions: [
      {
        id: 'acid-strength-q1',
        prompt: {
          zh: '“强酸”最直接描述什么？',
          en: 'What does “strong acid” describe most directly?',
        },
        options: [
          {
            zh: '一定放入很多克酸',
            en: 'Many grams of acid must have been added',
          },
          {
            zh: '在水中几乎完全电离的行为',
            en: 'Almost complete ionisation in water',
          },
          { zh: '瓶子一定很大', en: 'The bottle must be large' },
        ],
        answer: 1,
        explanation: {
          zh: '强弱讲的是酸与水的质子转移行为。每升放进多少酸才是浓度问题，不能把两个标签混为一谈。',
          en: 'Strength describes proton-transfer behaviour with water. Acid added per litre is concentration; the two labels answer different questions.',
        },
      },
      {
        id: 'acid-strength-q2',
        prompt: {
          zh: '同温度、同配制浓度的稀盐酸与乙酸，谁通常有更高的 H₃O⁺ 浓度？',
          en: 'At equal temperature and recipe concentration, which usually has greater hydronium concentration: dilute HCl or ethanoic acid?',
        },
        options: [
          {
            zh: '盐酸，因为几乎完全电离',
            en: 'HCl, because it is almost fully ionised',
          },
          {
            zh: '乙酸，因为弱酸分子更大',
            en: 'Ethanoic acid, because its molecules are larger',
          },
          {
            zh: '一定相同，因为配制浓度相同',
            en: 'Always equal because recipe concentrations match',
          },
        ],
        answer: 0,
        explanation: {
          zh: '同样放入的酸份数，不代表形成同样多的 H₃O⁺。乙酸仍有大量分子未转移质子。',
          en: 'Equal acid portions added need not create equal hydronium. Many ethanoic-acid molecules remain without transferring a proton.',
        },
      },
      {
        id: 'acid-strength-q3',
        prompt: {
          zh: '强酸溶液加纯水变稀，酸的类别怎样变化？',
          en: 'A strong-acid solution is diluted with pure water. What happens to its acid classification?',
        },
        options: [
          { zh: '立刻变成弱酸', en: 'It immediately becomes a weak acid' },
          { zh: '变成碱', en: 'It becomes a base' },
          {
            zh: '仍是强酸的溶液，只是浓度更低',
            en: 'It remains a strong-acid solution, at lower concentration',
          },
        ],
        answer: 2,
        explanation: {
          zh: '稀释改变每升的酸份数，没有把 HCl 的身份或基本电离行为改成乙酸。强弱与浓稀是两条轴。',
          en: 'Dilution changes acid portions per litre; it does not change HCl’s identity or ionisation behaviour into that of ethanoic acid. Strength and concentration are separate axes.',
        },
      },
      {
        id: 'acid-strength-q4',
        prompt: {
          zh: '弱酸那杯 pH 比强酸那杯更低，这可能吗？',
          en: 'Can a weak-acid sample have lower pH than a strong-acid sample?',
        },
        options: [
          {
            zh: '不可能，强酸标签已经决定一切',
            en: 'Impossible: the strength label decides everything',
          },
          {
            zh: '可能，要同时考虑两杯的浓度',
            en: 'Possible: consider both sample concentrations',
          },
          {
            zh: '可能，因为 pH 与离子没有关系',
            en: 'Possible because pH has nothing to do with ions',
          },
        ],
        answer: 1,
        explanation: {
          zh: '很稀的强酸与较浓的弱酸可以出现这样的比较。酸本身的强弱没有反转，只是两份溶液的 H₃O⁺ 浓度排名变了。',
          en: 'Very dilute strong acid and more concentrated weak acid can show this. Acid strength has not reversed; the samples’ hydronium ranking has.',
        },
      },
      {
        id: 'acid-strength-q5',
        prompt: {
          zh: '乙酸从 0.100 稀释到 0.010 mol/L，模型显示电离百分比上升，但 H₃O⁺ 浓度下降。矛盾吗？',
          en: 'Diluting ethanoic acid from 0.100 to 0.010 mol/L raises its ionisation percentage but lowers hydronium concentration. Is that a contradiction?',
        },
        options: [
          {
            zh: '不矛盾：比例升高，但每升的酸总份数减少了',
            en: 'No: the fraction rises while total acid portions per litre fall',
          },
          {
            zh: '矛盾：百分比与浓度永远是同一个量',
            en: 'Yes: percentage and concentration are always the same quantity',
          },
          {
            zh: '不矛盾：水把所有离子变成空气',
            en: 'No: water turns all ions into air',
          },
        ],
        answer: 0,
        explanation: {
          zh: '要分清“占多少比例”与“每升实际有多少”。较小总量中的较大比例，仍可能给出更少的 H₃O⁺。',
          en: 'Distinguish fraction ionised from amount per litre. A larger fraction of a smaller total can still give less hydronium.',
        },
      },
      {
        id: 'acid-strength-q6',
        prompt: {
          zh: '关于弱酸，哪条判断可靠？',
          en: 'Which judgment about weak acids is reliable?',
        },
        options: [
          {
            zh: '凡是弱酸都能直接触摸',
            en: 'Every weak acid can be touched directly',
          },
          {
            zh: '弱酸永远只能电离 1%',
            en: 'Weak acids always ionise exactly 1%',
          },
          {
            zh: '弱酸只部分电离，但危险性还需看物质与浓度等条件',
            en: 'Weak acids ionise partly, but hazards also depend on substance and concentration',
          },
        ],
        answer: 2,
        explanation: {
          zh: '电离程度不是安全许可证，也不是固定百分比。不能只凭“弱酸”两个字决定操作方法。',
          en: 'Ionisation is neither a safety licence nor a fixed percentage. The words “weak acid” alone do not determine how it should be handled.',
        },
      },
    ],
  },
] satisfies Lesson[];
