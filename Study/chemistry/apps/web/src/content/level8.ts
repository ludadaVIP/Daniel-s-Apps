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
      zh: 'pH 用来描述水溶液的酸碱性：小于 7 通常为酸性，7 为中性，大于 7 通常为碱性；指示剂可用颜色提供安全线索。',
      en: 'pH describes acidity or basicity in water solutions: below 7 is usually acidic, 7 is neutral, and above 7 is usually basic; indicators can provide colour clues safely.',
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
] satisfies Lesson[];
