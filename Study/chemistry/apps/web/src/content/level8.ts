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
] satisfies Lesson[];
