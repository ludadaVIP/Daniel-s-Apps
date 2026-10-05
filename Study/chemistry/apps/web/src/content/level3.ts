import type { Lesson } from './lessons';

export const level3Lessons = [
  {
    id: 'what-is-an-atom',
    levelId: 'atoms',
    order: 10,
    title: { zh: '什么是原子？', en: 'What is an atom?' },
    eyebrow: {
      zh: '第 10 课 · 不是迷你太阳系',
      en: 'Lesson 10 · Not a tiny solar system',
    },
    hook: {
      zh: '如果把一滴水不断分成更小的份，它会在什么时候不再像“水”？',
      en: 'If you keep dividing a drop of water, when does it stop behaving like water?',
    },
    hookHint: {
      zh: '化学用原子来解释物质身份。它不是能用肉眼或普通显微镜看到的小球，而是帮助我们理解反应与性质的微观尺度。',
      en: 'Chemistry uses atoms to explain substance identity. They are not little balls seen by eyes or ordinary microscopes, but a microscopic scale that explains reactions and properties.',
    },
    bigIdea: {
      zh: '原子是构成元素、并保持该元素化学身份的最小基本单位。',
      en: 'An atom is the smallest basic unit that makes up an element and keeps that element’s chemical identity.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🪨',
        title: { zh: '石头', en: 'A stone' },
        body: {
          zh: '坚硬的岩石由大量原子组合、排列而成。',
          en: 'A hard rock is built from vast numbers of combined, arranged atoms.',
        },
      },
      {
        icon: '📱',
        title: { zh: '手机屏幕', en: 'A phone screen' },
        body: {
          zh: '硅、氧等原子的精确组合让材料能显示图像。',
          en: 'Precise combinations of silicon, oxygen and more make display materials work.',
        },
      },
      {
        icon: '🌳',
        title: { zh: '树叶', en: 'A leaf' },
        body: {
          zh: '碳、氢、氧等原子组成分子，帮助植物捕捉光。',
          en: 'Atoms such as carbon, hydrogen and oxygen form molecules that help plants capture light.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '原子很小，但不是“没有内部”',
          en: 'Atoms are tiny, not featureless',
        },
        body: {
          zh: '原子中心有很小而很重的原子核，周围存在电子活动的区域。课本图是模型：它能说明组成与关系，却不是一张缩小照片。',
          en: 'An atom has a tiny, massive nucleus and regions where electrons are active. Textbook diagrams are models: useful for relationships, not shrunken photographs.',
        },
      },
      {
        title: { zh: '原子大部分是空间', en: 'Atoms are mostly space' },
        body: {
          zh: '若把原子核放大到一颗葡萄大小，电子区域会在很远处。这并不让桌子变得容易穿过，因为大量原子间的电作用会阻止彼此重叠。',
          en: 'If a nucleus were grape-sized, electron regions would be far away. Tables are still solid because electrical interactions between huge numbers of atoms prevent overlap.',
        },
      },
      {
        title: {
          zh: '“最小”是化学语境里的最小',
          en: 'Smallest has a chemistry meaning',
        },
        body: {
          zh: '原子内部还有更小的成分。但把一个氧原子拆开，就不再拥有“氧元素原子”的化学身份了。',
          en: 'Atoms contain smaller parts. But split an oxygen atom apart and it no longer has the chemical identity of an oxygen atom.',
        },
      },
    ],
    misconception: {
      zh: '原子图里的电子轨道不是行星沿固定圆圈运行的录像。它是一个方便的初学模型，用来表示电子离原子核大致有多远。',
      en: 'Electron rings in atom diagrams are not footage of planets on fixed tracks. They are a beginner-friendly model of approximate electron distance from the nucleus.',
    },
    mission: {
      zh: '选择木头、玻璃和铝箔各一小样。预测哪一种最硬、最能导电；然后把你的预测连到“原子怎样排列和结合”这个想法。',
      en: 'Choose small examples of wood, glass and aluminium foil. Predict which is hardest and most conductive; connect your prediction to how atoms are arranged and joined.',
    },
    vocabulary: [
      { en: 'atom', zh: '原子' },
      { en: 'nucleus', zh: '原子核' },
      { en: 'electron region', zh: '电子活动区域' },
      { en: 'model', zh: '模型' },
    ],
    interactive: 'atom-zoom',
    questions: [
      {
        id: 'atom-q1',
        prompt: {
          zh: '原子图最重要的用途是什么？',
          en: 'What is the main use of an atom diagram?',
        },
        options: [
          {
            zh: '提供原子的真实照片',
            en: 'To provide a real photograph of an atom',
          },
          {
            zh: '帮助解释原子内部成分及关系',
            en: 'To explain atomic parts and their relationships',
          },
          { zh: '显示原子真正的颜色', en: 'To show an atom’s true colour' },
        ],
        answer: 1,
        explanation: {
          zh: '科学模型突出对理解有用的关系，不必长得和真实对象一模一样。',
          en: 'Scientific models highlight useful relationships; they need not look exactly like what they represent.',
        },
      },
      {
        id: 'atom-q2',
        prompt: {
          zh: '为什么把一个氧原子拆开后，不再是氧原子？',
          en: 'Why is a split oxygen atom no longer an oxygen atom?',
        },
        options: [
          {
            zh: '它的化学身份所需的完整原子结构被破坏',
            en: 'The complete atomic structure needed for its identity is broken',
          },
          { zh: '氧突然变得看不见', en: 'Oxygen suddenly becomes invisible' },
          {
            zh: '所有原子都只能有一个部分',
            en: 'All atoms have only one part',
          },
        ],
        answer: 0,
        explanation: {
          zh: '原子有内部结构；拆开后留下的是更小的粒子，而不是原来的元素原子。',
          en: 'Atoms have internal structure; after splitting, smaller particles remain rather than the original element atom.',
        },
      },
      {
        id: 'atom-q3',
        prompt: {
          zh: '原子大部分是空间，桌子为什么依然坚硬？',
          en: 'If atoms are mostly space, why is a desk solid?',
        },
        options: [
          {
            zh: '原子之间的电作用阻止它们轻易重叠',
            en: 'Electrical interactions prevent atoms from easily overlapping',
          },
          { zh: '桌子里没有原子', en: 'Desks contain no atoms' },
          {
            zh: '空间会自动变成木头',
            en: 'Space automatically turns into wood',
          },
        ],
        answer: 0,
        explanation: {
          zh: '“空”并不表示没有作用；电子相关的电作用让原子团表现出坚硬与支撑力。',
          en: 'Empty does not mean inactive; electron-related electrical interactions give groups of atoms solidity and support.',
        },
      },
    ],
  },
  {
    id: 'protons',
    levelId: 'atoms',
    order: 11,
    title: { zh: '质子：元素的身份证', en: 'Protons: an element’s ID' },
    eyebrow: {
      zh: '第 11 课 · 谁决定你是谁？',
      en: 'Lesson 11 · Who decides who you are?',
    },
    hook: {
      zh: '给一个碳原子多加一个质子，它还是碳吗？',
      en: 'If you add one proton to a carbon atom, is it still carbon?',
    },
    hookHint: {
      zh: '只差一个质子，身份就会完全改变：6 个质子是碳，7 个质子是氮。原子核中的质子数像元素的身份证号码。',
      en: 'One proton changes identity completely: 6 protons means carbon, 7 means nitrogen. Proton count is like an element’s ID number.',
    },
    bigIdea: {
      zh: '质子带正电、位于原子核中；质子数量唯一决定一种元素的身份。',
      en: 'Protons are positively charged, sit in the nucleus, and their number uniquely determines an element’s identity.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🧬',
        title: { zh: '身体里的碳', en: 'Carbon in your body' },
        body: {
          zh: '每个碳原子都有 6 个质子。',
          en: 'Every carbon atom has 6 protons.',
        },
      },
      {
        icon: '🫁',
        title: { zh: '呼吸的氧', en: 'Oxygen you breathe' },
        body: {
          zh: '每个氧原子都有 8 个质子。',
          en: 'Every oxygen atom has 8 protons.',
        },
      },
      {
        icon: '💡',
        title: { zh: '霓虹灯', en: 'Neon lights' },
        body: {
          zh: '氖原子有 10 个质子，能发出标志性的红橙光。',
          en: 'Neon has 10 protons and produces its distinctive red-orange glow.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '质子住在原子核', en: 'Protons live in the nucleus' },
        body: {
          zh: '原子核位于原子中心，很小却集中了几乎全部质量。质子带一个正电荷，用 +1 来表示。',
          en: 'The nucleus sits at the centre, tiny but holding almost all atomic mass. Each proton carries one positive charge, written +1.',
        },
      },
      {
        title: {
          zh: '质子数就是原子序数',
          en: 'Proton count is atomic number',
        },
        body: {
          zh: '周期表按质子数从小到大排列。氢是 1，碳是 6，氧是 8。原子序数不是随机编号，而是核内真正的质子数。',
          en: 'The periodic table orders elements by proton count: hydrogen 1, carbon 6, oxygen 8. Atomic number is not a random label—it is the actual number of nuclear protons.',
        },
      },
      {
        title: { zh: '改质子就是换元素', en: 'Change protons, change element' },
        body: {
          zh: '在普通化学反应中，质子数不改变，所以元素身份稳定。只有核反应才能改变质子数，这就是为什么把一种元素变成另一种元素很难。',
          en: 'Ordinary chemical reactions do not change proton count, so element identity stays stable. Only nuclear reactions can change it, which is why changing one element into another is difficult.',
        },
      },
    ],
    misconception: {
      zh: '元素身份不由“总粒子数”或电子数决定。电子数可以改变，原子会变成离子；但只要质子数仍是 8，它仍属于氧元素。',
      en: 'Element identity is not set by total particle count or electron count. Electrons can change to make an ion; with 8 protons, it is still oxygen.',
    },
    mission: {
      zh: '在周期表上找到 H、C、O、Na、Cl。把每个格子里的原子序数写成“核内有 __ 个质子”的句子。',
      en: 'Find H, C, O, Na and Cl on a periodic table. Turn each atomic number into the sentence “Its nucleus has __ protons.”',
    },
    vocabulary: [
      { en: 'proton', zh: '质子' },
      { en: 'positive charge', zh: '正电荷' },
      { en: 'atomic number', zh: '原子序数' },
      { en: 'nucleus', zh: '原子核' },
    ],
    interactive: 'proton-id',
    questions: [
      {
        id: 'proton-q1',
        prompt: {
          zh: '一个原子有 8 个质子，它一定是什么元素？',
          en: 'An atom has 8 protons. What element must it be?',
        },
        options: [
          { zh: '氧', en: 'Oxygen' },
          { zh: '碳', en: 'Carbon' },
          { zh: '氮', en: 'Nitrogen' },
        ],
        answer: 0,
        explanation: {
          zh: '氧的原子序数为 8，这正是每个氧原子的质子数。',
          en: 'Oxygen’s atomic number is 8, which is the proton count of every oxygen atom.',
        },
      },
      {
        id: 'proton-q2',
        prompt: {
          zh: '为什么普通化学反应不会把氧变成氮？',
          en: 'Why do ordinary chemical reactions not turn oxygen into nitrogen?',
        },
        options: [
          {
            zh: '它们不会改变原子核中的质子数',
            en: 'They do not change the proton count in the nucleus',
          },
          { zh: '氧没有电子', en: 'Oxygen has no electrons' },
          { zh: '氮不是元素', en: 'Nitrogen is not an element' },
        ],
        answer: 0,
        explanation: {
          zh: '化学反应主要重新安排电子和原子间的结合，元素身份所需的质子数保持不变。',
          en: 'Chemical reactions mainly rearrange electrons and bonds; the identity-setting proton count remains unchanged.',
        },
      },
      {
        id: 'proton-q3',
        prompt: {
          zh: '哪句话正确描述了质子？',
          en: 'Which statement correctly describes protons?',
        },
        options: [
          {
            zh: '带正电，位于原子核',
            en: 'Positively charged and in the nucleus',
          },
          {
            zh: '带负电，绕核运行',
            en: 'Negatively charged and orbiting the nucleus',
          },
          {
            zh: '没有质量，只在空气中存在',
            en: 'Massless and found only in air',
          },
        ],
        answer: 0,
        explanation: {
          zh: '质子在原子核中，带正电，质量约为一个原子质量单位。',
          en: 'Protons are in the nucleus, positively charged, and have about one atomic mass unit of mass.',
        },
      },
    ],
  },
  {
    id: 'neutrons',
    levelId: 'atoms',
    order: 12,
    title: { zh: '中子：核内的稳定伙伴', en: 'Neutrons: nuclear stabilisers' },
    eyebrow: {
      zh: '第 12 课 · 同一种元素，也能不完全一样',
      en: 'Lesson 12 · Same element, not identical',
    },
    hook: {
      zh: '两个碳原子都有 6 个质子，为什么一个可以多出两个中子？',
      en: 'Two carbon atoms each have 6 protons. How can one have two more neutrons?',
    },
    hookHint: {
      zh: '质子数决定元素身份；中子数可以不同。这样的同元素原子叫同位素，它们质量不同，却仍然是同一种元素。',
      en: 'Proton count sets identity; neutron count can differ. Such same-element atoms are isotopes: different masses, same element.',
    },
    bigIdea: {
      zh: '中子位于原子核、不带电；它们与质子一起贡献原子的大部分质量，而改变中子数不会改变元素身份。',
      en: 'Neutrons are uncharged and in the nucleus; with protons they provide most atomic mass, but changing neutron count does not change element identity.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🦴',
        title: { zh: '骨骼检查', en: 'Bone scans' },
        body: {
          zh: '某些同位素可帮助医生追踪身体中的物质。',
          en: 'Some isotopes help doctors trace substances in the body.',
        },
      },
      {
        icon: '🏺',
        title: { zh: '古物年龄', en: 'Dating ancient objects' },
        body: {
          zh: '碳-14 的衰变能帮助估计曾经活过的材料年代。',
          en: 'Carbon-14 decay can help estimate the age of once-living materials.',
        },
      },
      {
        icon: '⚛️',
        title: { zh: '原子质量', en: 'Atomic mass' },
        body: {
          zh: '质子和中子像原子核的“重量担当”。',
          en: 'Protons and neutrons carry almost all nuclear weight.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '中子不带电', en: 'Neutrons carry no charge' },
        body: {
          zh: '中子电荷为 0，位于原子核中。它们不会改变原子整体的电荷平衡，却会增加质量。',
          en: 'A neutron has charge 0 and sits in the nucleus. It does not change overall charge balance, but adds mass.',
        },
      },
      {
        title: {
          zh: '质量数 = 质子 + 中子',
          en: 'Mass number = protons + neutrons',
        },
        body: {
          zh: '质量数数的是核内粒子：6 个质子和 6 个中子的碳原子，质量数为 12。电子质量很小，初步计算通常不计入。',
          en: 'Mass number counts nuclear particles: carbon with 6 protons and 6 neutrons has mass number 12. Electron mass is tiny and omitted in early calculations.',
        },
      },
      {
        title: {
          zh: '同位素：身份相同，质量不同',
          en: 'Isotopes: same identity, different mass',
        },
        body: {
          zh: '碳-12、碳-13、碳-14 都有 6 个质子，所以全是碳；它们分别有 6、7、8 个中子。',
          en: 'Carbon-12, carbon-13 and carbon-14 all have 6 protons, so all are carbon; they have 6, 7 and 8 neutrons respectively.',
        },
      },
    ],
    misconception: {
      zh: '中子数不同不是另一种元素。只要质子数仍是 6，不管中子有 6、7 还是 8 个，元素身份都是碳。',
      en: 'Different neutron count does not mean a different element. With 6 protons, it remains carbon whether it has 6, 7 or 8 neutrons.',
    },
    mission: {
      zh: '把“C-12、C-13、C-14”当成三位同姓但体重不同的同学：为每位写出质子数、中子数和质量数。',
      en: 'Treat C-12, C-13 and C-14 as three classmates with the same surname but different masses. Write each proton, neutron and mass number.',
    },
    vocabulary: [
      { en: 'neutron', zh: '中子' },
      { en: 'mass number', zh: '质量数' },
      { en: 'isotope', zh: '同位素' },
      { en: 'uncharged', zh: '不带电' },
    ],
    interactive: 'neutron-mass',
    questions: [
      {
        id: 'neutron-q1',
        prompt: {
          zh: '一个碳原子有 6 个质子和 8 个中子，质量数是多少？',
          en: 'A carbon atom has 6 protons and 8 neutrons. What is its mass number?',
        },
        options: [
          { zh: '6', en: '6' },
          { zh: '8', en: '8' },
          { zh: '14', en: '14' },
        ],
        answer: 2,
        explanation: {
          zh: '质量数 = 质子数 + 中子数 = 6 + 8 = 14。',
          en: 'Mass number = protons + neutrons = 6 + 8 = 14.',
        },
      },
      {
        id: 'neutron-q2',
        prompt: {
          zh: '碳-12 与碳-14 最关键的共同点是什么？',
          en: 'What is the key similarity between carbon-12 and carbon-14?',
        },
        options: [
          { zh: '中子数相同', en: 'Same neutron count' },
          { zh: '质子数相同', en: 'Same proton count' },
          { zh: '质量数相同', en: 'Same mass number' },
        ],
        answer: 1,
        explanation: {
          zh: '两者都有 6 个质子，因此都属于碳元素；差别在中子数。',
          en: 'Both contain 6 protons, so both are carbon; their neutron counts differ.',
        },
      },
      {
        id: 'neutron-q3',
        prompt: {
          zh: '中子数改变时，原子哪项通常保持不变？',
          en: 'When neutron count changes, what usually stays the same?',
        },
        options: [
          { zh: '元素身份', en: 'Element identity' },
          { zh: '质量数', en: 'Mass number' },
          { zh: '中子质量', en: 'Neutron mass' },
        ],
        answer: 0,
        explanation: {
          zh: '元素身份由质子数决定；中子数变化使质量数变化。',
          en: 'Element identity depends on proton count; different neutron count changes mass number.',
        },
      },
    ],
  },
  {
    id: 'electrons',
    levelId: 'atoms',
    order: 13,
    title: {
      zh: '电子：电荷与化学反应的主角',
      en: 'Electrons: charge and chemical change',
    },
    eyebrow: {
      zh: '第 13 课 · 为什么摩擦气球会吸住头发？',
      en: 'Lesson 13 · Why does a rubbed balloon stick to hair?',
    },
    hook: {
      zh: '气球在头发上摩擦后能贴在墙上：原子里究竟发生了什么？',
      en: 'A balloon rubbed on hair sticks to a wall. What happened inside atoms?',
    },
    hookHint: {
      zh: '有些电子从头发转移到气球。电子的多少改变了物体的电荷，也解释了静电、导电和许多化学反应。',
      en: 'Some electrons transfer from hair to the balloon. Electron number changes charge, helping explain static electricity, conduction and many reactions.',
    },
    bigIdea: {
      zh: '电子带负电、在原子核外活动；中性原子中电子数等于质子数，得失电子会形成离子。',
      en: 'Electrons are negatively charged and active outside the nucleus; in a neutral atom, electron count equals proton count, and gaining or losing them forms ions.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🎈',
        title: { zh: '静电气球', en: 'Static balloon' },
        body: {
          zh: '摩擦后得到额外电子的气球带负电。',
          en: 'A balloon gaining extra electrons through rubbing becomes negatively charged.',
        },
      },
      {
        icon: '⚡',
        title: { zh: '金属电线', en: 'Metal wires' },
        body: {
          zh: '部分电子能在金属中移动，形成电流。',
          en: 'Some electrons move through metals, creating electric current.',
        },
      },
      {
        icon: '🔋',
        title: { zh: '电池', en: 'A battery' },
        body: {
          zh: '化学反应推动电子定向移动，给设备供能。',
          en: 'Chemical reactions drive directed electron movement to power devices.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '电子带负电，质量很小',
          en: 'Electrons are negative and very light',
        },
        body: {
          zh: '一个电子带 −1 电荷，质量远小于质子或中子。电子在核外的活动区域出现，不是附着在固定圆轨道上的小珠。',
          en: 'An electron carries −1 charge and has far less mass than protons or neutrons. It occupies regions outside the nucleus, not fixed bead-like circular tracks.',
        },
      },
      {
        title: {
          zh: '中性原子：正负恰好抵消',
          en: 'Neutral atoms: positives and negatives cancel',
        },
        body: {
          zh: '氧原子有 8 个质子时，若也有 8 个电子，整体电荷为 0。正电与负电数量相等，叫作中性。',
          en: 'With 8 protons, an oxygen atom with 8 electrons has total charge 0. Equal positive and negative charges make it neutral.',
        },
      },
      {
        title: {
          zh: '得失电子形成离子',
          en: 'Gaining or losing electrons makes ions',
        },
        body: {
          zh: '质子不变、电子变少，原子带正电；电子变多，原子带负电。元素身份没有改变，只是电荷状态改变。',
          en: 'Protons stay fixed: fewer electrons gives positive charge, more electrons gives negative charge. Element identity stays the same; charge state changes.',
        },
      },
    ],
    misconception: {
      zh: '电子得失不是“元素变身”。氧原子失去或得到电子后仍是氧，因为原子核中依旧有 8 个质子。',
      en: 'Electron gain or loss does not transform one element into another. Oxygen remains oxygen because its nucleus still has 8 protons.',
    },
    mission: {
      zh: '天气干燥时，把气球或塑料梳子在头发上轻轻摩擦，然后靠近碎纸片。观察现象；不要靠近电子设备、插座或火源。',
      en: 'On a dry day, gently rub a balloon or plastic comb on hair, then bring it near tiny paper pieces. Observe safely away from electronics, outlets and flames.',
    },
    vocabulary: [
      { en: 'electron', zh: '电子' },
      { en: 'negative charge', zh: '负电荷' },
      { en: 'neutral atom', zh: '中性原子' },
      { en: 'ion', zh: '离子' },
    ],
    interactive: 'electron-charge',
    questions: [
      {
        id: 'electron-q1',
        prompt: {
          zh: '一个有 8 个质子、10 个电子的原子整体带什么电？',
          en: 'An atom has 8 protons and 10 electrons. What overall charge does it have?',
        },
        options: [
          { zh: '2−', en: '2−' },
          { zh: '中性', en: 'Neutral' },
          { zh: '2+', en: '2+' },
        ],
        answer: 0,
        explanation: {
          zh: '8 个正电与 10 个负电相抵后，剩下 2 个负电，即 2−。',
          en: '8 positive and 10 negative charges leave 2 negatives overall: 2−.',
        },
      },
      {
        id: 'electron-q2',
        prompt: {
          zh: '钠原子失去一个电子后，哪项不变？',
          en: 'After a sodium atom loses one electron, what stays unchanged?',
        },
        options: [
          { zh: '质子数与元素身份', en: 'Proton count and element identity' },
          { zh: '总电荷为零', en: 'Total charge is zero' },
          { zh: '电子数', en: 'Electron count' },
        ],
        answer: 0,
        explanation: {
          zh: '失电子改变电荷，但核内质子数仍是 11，因此仍是钠。',
          en: 'Losing an electron changes charge, but its nucleus still has 11 protons, so it remains sodium.',
        },
      },
      {
        id: 'electron-q3',
        prompt: {
          zh: '中性氧原子的质子数和电子数有什么关系？',
          en: 'How are proton and electron counts related in neutral oxygen?',
        },
        options: [
          { zh: '质子比电子多 8 个', en: 'There are 8 more protons' },
          { zh: '两者相等，都是 8 个', en: 'They are equal: 8 each' },
          { zh: '电子数为 0', en: 'Electron count is 0' },
        ],
        answer: 1,
        explanation: {
          zh: '中性表示总正电与总负电相等；氧有 8 个质子，所以中性氧也有 8 个电子。',
          en: 'Neutral means total positives equal negatives; oxygen has 8 protons, so neutral oxygen has 8 electrons.',
        },
      },
    ],
  },
  {
    id: 'atomic-number',
    levelId: 'atoms',
    order: 14,
    title: {
      zh: '原子序数：周期表的门牌号',
      en: 'Atomic number: the periodic-table address',
    },
    eyebrow: {
      zh: '第 14 课 · 数字不是编号而是身份',
      en: 'Lesson 14 · A number that is an identity',
    },
    hook: {
      zh: '周期表上氧旁边的 8，只是它排在第八位吗？',
      en: 'Is the 8 beside oxygen on the periodic table merely its place in line?',
    },
    hookHint: {
      zh: '不是。这个小数字直接告诉你：每个氧原子核内都有 8 个质子。它像元素不可重复的门牌号。',
      en: 'No. It directly says every oxygen nucleus has 8 protons—an unrepeatable address for the element.',
    },
    bigIdea: {
      zh: '原子序数 = 质子数；它唯一确定元素，并让周期表成为一张有规律的身份地图。',
      en: 'Atomic number = proton count; it uniquely identifies an element and turns the periodic table into an identity map.',
    },
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: '食盐 NaCl', en: 'Table salt NaCl' },
        body: {
          zh: 'Na 的原子序数 11，Cl 的原子序数 17。',
          en: 'Na has atomic number 11; Cl has 17.',
        },
      },
      {
        icon: '💨',
        title: { zh: '空气中的氮', en: 'Nitrogen in air' },
        body: {
          zh: 'N 的原子序数是 7：每个氮原子有 7 个质子。',
          en: 'N has atomic number 7: every nitrogen atom has 7 protons.',
        },
      },
      {
        icon: '🦴',
        title: { zh: '骨骼中的钙', en: 'Calcium in bones' },
        body: {
          zh: 'Ca 的原子序数是 20，身份稳定地指向钙元素。',
          en: 'Ca has atomic number 20, a stable identity for calcium.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '每种元素只占一个原子序数',
          en: 'Each element owns one atomic number',
        },
        body: {
          zh: '没有两种元素共享同一个质子数。1 个质子必定是氢，6 个必定是碳，8 个必定是氧。',
          en: 'No two elements share a proton count. 1 proton is always hydrogen, 6 always carbon, 8 always oxygen.',
        },
      },
      {
        title: {
          zh: '中性原子还能读出电子数',
          en: 'For neutral atoms, it also reveals electrons',
        },
        body: {
          zh: '中性原子中正、负电荷抵消，所以电子数 = 质子数 = 原子序数。氧的原子序数为 8，中性氧就有 8 个电子。',
          en: 'In a neutral atom, positive and negative charges cancel, so electrons = protons = atomic number. Neutral oxygen has 8 electrons.',
        },
      },
      {
        title: {
          zh: '周期表按原子序数前进',
          en: 'The periodic table advances by atomic number',
        },
        body: {
          zh: '从左到右、从上到下，原子序数增加。它不是按质量或字母顺序，而是按核内质子数排队。',
          en: 'Across and down the table, atomic number increases. It is ordered by nuclear protons, not mass or alphabet.',
        },
      },
    ],
    misconception: {
      zh: '原子序数不是质量数，也不是中子数。氧的原子序数总是 8；氧的质量数可以因同位素而不同。',
      en: 'Atomic number is not mass number or neutron count. Oxygen’s atomic number is always 8, while its mass number can differ by isotope.',
    },
    mission: {
      zh: '选择周期表上的 5 个元素。遮住名称，只看原子序数与符号，再说出“它的原子核有多少个质子”。',
      en: 'Choose five periodic-table elements. Cover their names, use only atomic number and symbol, then state their nuclear proton counts.',
    },
    vocabulary: [
      { en: 'atomic number', zh: '原子序数' },
      { en: 'periodic table', zh: '元素周期表' },
      { en: 'identity', zh: '身份' },
      { en: 'neutral atom', zh: '中性原子' },
    ],
    interactive: 'atomic-number-map',
    questions: [
      {
        id: 'number-q1',
        prompt: {
          zh: '原子序数 11 表示什么？',
          en: 'What does atomic number 11 tell you?',
        },
        options: [
          { zh: '核内有 11 个质子', en: 'The nucleus has 11 protons' },
          { zh: '有 11 个中子', en: 'There are 11 neutrons' },
          { zh: '质量数必定为 11', en: 'Mass number must be 11' },
        ],
        answer: 0,
        explanation: {
          zh: '原子序数按定义就是原子核内的质子数。',
          en: 'By definition, atomic number is the count of nuclear protons.',
        },
      },
      {
        id: 'number-q2',
        prompt: {
          zh: '一个中性原子原子序数为 7，它有多少电子？',
          en: 'A neutral atom has atomic number 7. How many electrons does it have?',
        },
        options: [
          { zh: '7', en: '7' },
          { zh: '14', en: '14' },
          { zh: '0', en: '0' },
        ],
        answer: 0,
        explanation: {
          zh: '中性原子中电子数与质子数相等，二者都等于原子序数。',
          en: 'In a neutral atom, electron count equals proton count, both equal to atomic number.',
        },
      },
      {
        id: 'number-q3',
        prompt: {
          zh: '原子序数相同的两个原子，一定有什么相同？',
          en: 'Two atoms have the same atomic number. What must they share?',
        },
        options: [
          { zh: '元素身份', en: 'Element identity' },
          { zh: '中子数', en: 'Neutron count' },
          { zh: '质量数', en: 'Mass number' },
        ],
        answer: 0,
        explanation: {
          zh: '相同原子序数意味着相同质子数，因此属于同一种元素。',
          en: 'Same atomic number means same proton count, hence the same element.',
        },
      },
    ],
  },
  {
    id: 'mass-number',
    levelId: 'atoms',
    order: 15,
    title: {
      zh: '质量数：原子核的计数法',
      en: 'Mass number: counting the nucleus',
    },
    eyebrow: {
      zh: '第 15 课 · 谁让原子变重？',
      en: 'Lesson 15 · What makes an atom heavy?',
    },
    hook: {
      zh: '电子在原子外不停活动，为什么原子的质量几乎都集中在一个小小原子核里？',
      en: 'Electrons move outside the atom, so why is almost all atomic mass packed into a tiny nucleus?',
    },
    hookHint: {
      zh: '因为质子和中子都很重，电子却极轻。质量数只需把核内的质子与中子相加。',
      en: 'Protons and neutrons are heavy while electrons are extremely light. Mass number just adds the nucleus’s protons and neutrons.',
    },
    bigIdea: {
      zh: '质量数 = 质子数 + 中子数；它描述一个特定原子核中“重粒子”的总数。',
      en: 'Mass number = protons + neutrons; it describes the total number of heavy particles in one particular nucleus.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🧪',
        title: { zh: '医学示踪', en: 'Medical tracing' },
        body: {
          zh: '不同质量数的同位素能作为身体内物质移动的标记。',
          en: 'Isotopes with different mass numbers can trace substances moving through the body.',
        },
      },
      {
        icon: '🌌',
        title: { zh: '星星的元素', en: 'Elements in stars' },
        body: {
          zh: '恒星中核反应会产生不同质量的原子核。',
          en: 'Nuclear reactions in stars produce nuclei of different masses.',
        },
      },
      {
        icon: '🔢',
        title: { zh: '核内总人数', en: 'A nucleus headcount' },
        body: {
          zh: '质量数像只统计质子和中子的点名表。',
          en: 'Mass number is like a register counting only protons and neutrons.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先辨别两个数字', en: 'Tell the two numbers apart' },
        body: {
          zh: '原子序数告诉你质子数与元素身份；质量数告诉你质子加中子的总数。它们回答的是不同问题。',
          en: 'Atomic number gives proton count and identity; mass number gives total protons plus neutrons. They answer different questions.',
        },
      },
      {
        title: {
          zh: '用减法找到中子数',
          en: 'Use subtraction to find neutrons',
        },
        body: {
          zh: '中子数 = 质量数 − 原子序数。例如质量数 23、原子序数 11 的钠，有 12 个中子。',
          en: 'Neutrons = mass number − atomic number. Sodium with mass number 23 and atomic number 11 has 12 neutrons.',
        },
      },
      {
        title: {
          zh: '质量数是整数，表上的相对原子质量常不是',
          en: 'Mass number is whole; table mass often is not',
        },
        body: {
          zh: '质量数属于一个具体原子，永远是整数。周期表常显示小数的相对原子质量，是自然界各种同位素的加权平均。',
          en: 'Mass number belongs to one atom and is always whole. The decimal relative atomic mass on a table is a weighted average of natural isotopes.',
        },
      },
    ],
    misconception: {
      zh: '不要把周期表上的小数直接当作质量数。比如氯的相对原子质量约 35.45，并不是某一个氯原子的质量数。',
      en: 'Do not use a periodic-table decimal directly as a mass number. Chlorine’s relative atomic mass near 35.45 is not the mass number of one chlorine atom.',
    },
    mission: {
      zh: '制作三张小卡片：写上“质子数”“中子数”“质量数”。任意抽两张数，计算第三张；最后验证质量数是否为整数。',
      en: 'Make cards for proton count, neutron count and mass number. Choose any two, calculate the third, then check that mass number is whole.',
    },
    vocabulary: [
      { en: 'mass number', zh: '质量数' },
      { en: 'nucleon', zh: '核子' },
      { en: 'relative atomic mass', zh: '相对原子质量' },
      { en: 'subtraction', zh: '减法' },
    ],
    interactive: 'mass-number-calc',
    questions: [
      {
        id: 'mass-q1',
        prompt: {
          zh: '质量数为 27、原子序数为 13 的原子，有多少中子？',
          en: 'An atom has mass number 27 and atomic number 13. How many neutrons?',
        },
        options: [
          { zh: '14', en: '14' },
          { zh: '27', en: '27' },
          { zh: '13', en: '13' },
        ],
        answer: 0,
        explanation: {
          zh: '中子数 = 27 − 13 = 14。',
          en: 'Neutrons = 27 − 13 = 14.',
        },
      },
      {
        id: 'mass-q2',
        prompt: {
          zh: '质量数计算时通常为什么不计电子？',
          en: 'Why are electrons usually omitted from mass-number calculations?',
        },
        options: [
          {
            zh: '电子质量远小于质子和中子',
            en: 'Their mass is far smaller than protons and neutrons',
          },
          { zh: '电子不属于原子', en: 'Electrons are not part of atoms' },
          { zh: '电子没有电荷', en: 'Electrons have no charge' },
        ],
        answer: 0,
        explanation: {
          zh: '原子绝大部分质量集中在原子核，电子质量在初步计数中可忽略。',
          en: 'Almost all atomic mass lies in the nucleus, so electron mass is negligible in early counting.',
        },
      },
      {
        id: 'mass-q3',
        prompt: {
          zh: '下列哪个最可能是“一个具体原子的质量数”？',
          en: 'Which can most likely be a mass number for one specific atom?',
        },
        options: [
          { zh: '35.45', en: '35.45' },
          { zh: '23', en: '23' },
          { zh: '6.022', en: '6.022' },
        ],
        answer: 1,
        explanation: {
          zh: '质量数是质子和中子的整数和，因此必须是整数。',
          en: 'Mass number is an integer sum of protons and neutrons.',
        },
      },
    ],
  },
  {
    id: 'isotopes',
    levelId: 'atoms',
    order: 16,
    title: {
      zh: '同位素：同一元素的不同版本',
      en: 'Isotopes: versions of one element',
    },
    eyebrow: {
      zh: '第 16 课 · 同姓不同体重',
      en: 'Lesson 16 · Same name, different weight',
    },
    hook: {
      zh: '碳-12、碳-13、碳-14 都叫“碳”，它们究竟哪里不同？',
      en: 'Carbon-12, carbon-13 and carbon-14 are all carbon. What differs between them?',
    },
    hookHint: {
      zh: '三者的质子数相同，身份相同；中子数不同，所以质量数不同。有些同位素稳定，有些会放射性衰变。',
      en: 'Their proton counts match, so their identity matches; neutron counts differ, so mass number differs. Some isotopes are stable, others decay radioactively.',
    },
    bigIdea: {
      zh: '同位素是质子数相同、中子数不同的同一种元素原子。',
      en: 'Isotopes are atoms of one element with the same proton count but different neutron counts.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🦕',
        title: { zh: '碳-14 测年', en: 'Carbon-14 dating' },
        body: {
          zh: '利用碳-14 的衰变，研究者可估算古老有机材料的年龄。',
          en: 'Carbon-14 decay helps estimate the age of old organic materials.',
        },
      },
      {
        icon: '🏥',
        title: { zh: '诊断成像', en: 'Diagnostic imaging' },
        body: {
          zh: '医生会使用经过严格控制的同位素追踪生理过程。',
          en: 'Doctors use carefully controlled isotopes to trace body processes.',
        },
      },
      {
        icon: '☀️',
        title: { zh: '元素平均质量', en: 'Average element mass' },
        body: {
          zh: '自然界同位素比例解释了周期表中常见的小数质量。',
          en: 'Natural isotope proportions explain common decimal masses on the periodic table.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '同位素先看质子数',
          en: 'Start isotopes with proton count',
        },
        body: {
          zh: '有 6 个质子的就是碳，不论它有 6、7 或 8 个中子。不同质子数一定是不同元素，不叫同位素。',
          en: 'Six protons means carbon whether there are 6, 7 or 8 neutrons. Different proton counts mean different elements, not isotopes.',
        },
      },
      {
        title: {
          zh: '化学性质很接近，质量相关性质可不同',
          en: 'Chemical behaviour is close; mass effects can differ',
        },
        body: {
          zh: '电子结构相近，因此同位素的日常化学性质通常很像；不同质量会影响某些物理过程与核稳定性。',
          en: 'Similar electron structure means everyday chemical behaviour is usually alike; different mass affects some physical processes and nuclear stability.',
        },
      },
      {
        title: {
          zh: '稳定与放射性是核的问题',
          en: 'Stability and radioactivity are nuclear questions',
        },
        body: {
          zh: '有些原子核能长期稳定存在；不稳定的核会自发改变并释放能量。放射性材料只应在专业环境下学习和使用。',
          en: 'Some nuclei remain stable for a long time; unstable nuclei change spontaneously and release energy. Radioactive materials belong only in professional settings.',
        },
      },
    ],
    misconception: {
      zh: '同位素不是离子。离子是电子数改变；同位素是中子数改变。两者都不改变元素身份，因为质子数不变。',
      en: 'Isotopes are not ions. Ions change electron count; isotopes change neutron count. Neither changes element identity because proton count stays the same.',
    },
    mission: {
      zh: '给 C-12、C-13、C-14 画三张“原子身份证”：每张都填质子数、中子数、质量数，并圈出相同的一项。',
      en: 'Make three “atom ID cards” for C-12, C-13 and C-14: fill protons, neutrons and mass number, then circle what stays the same.',
    },
    vocabulary: [
      { en: 'isotope', zh: '同位素' },
      { en: 'stable', zh: '稳定的' },
      { en: 'radioactive decay', zh: '放射性衰变' },
      { en: 'average', zh: '平均值' },
    ],
    interactive: 'isotope-detective',
    questions: [
      {
        id: 'isotope-q1',
        prompt: {
          zh: '下列哪对原子最可能互为同位素？',
          en: 'Which pair is most likely isotopes?',
        },
        options: [
          { zh: '6 质子、6 中子；6 质子、8 中子', en: '6p 6n; 6p 8n' },
          { zh: '6 质子、6 中子；7 质子、6 中子', en: '6p 6n; 7p 6n' },
          { zh: '6 质子、6 中子；6 质子、6 中子', en: '6p 6n; 6p 6n' },
        ],
        answer: 0,
        explanation: {
          zh: '同位素要求质子数相同、中子数不同；第一对正好符合。',
          en: 'Isotopes require equal protons and different neutrons; only the first pair fits.',
        },
      },
      {
        id: 'isotope-q2',
        prompt: {
          zh: '同位素与离子的关键差别是什么？',
          en: 'What is the key difference between an isotope and an ion?',
        },
        options: [
          {
            zh: '同位素改中子，离子改电子',
            en: 'Isotopes change neutrons; ions change electrons',
          },
          {
            zh: '同位素改质子，离子改元素',
            en: 'Isotopes change protons; ions change elements',
          },
          { zh: '两者完全相同', en: 'They are exactly the same' },
        ],
        answer: 0,
        explanation: {
          zh: '两者都保留质子数；一个改变核内中子，一个改变核外电子。',
          en: 'Both keep proton count; one changes nuclear neutrons, the other outside electrons.',
        },
      },
      {
        id: 'isotope-q3',
        prompt: {
          zh: '为什么 C-12 与 C-14 都属于碳？',
          en: 'Why are both C-12 and C-14 carbon?',
        },
        options: [
          { zh: '它们都有 6 个质子', en: 'They both have 6 protons' },
          { zh: '它们都有 12 个中子', en: 'They both have 12 neutrons' },
          {
            zh: '它们电子数一定不同',
            en: 'They must have different electron counts',
          },
        ],
        answer: 0,
        explanation: {
          zh: '元素身份由质子数定义；两者中子数不同，质量数才不同。',
          en: 'Element identity is defined by protons; different neutrons give different mass numbers.',
        },
      },
    ],
  },
  {
    id: 'what-is-an-ion',
    levelId: 'atoms',
    order: 17,
    title: { zh: '什么是离子？', en: 'What is an ion?' },
    eyebrow: {
      zh: '第 17 课 · 原子也会带电',
      en: 'Lesson 17 · Atoms can carry charge',
    },
    hook: {
      zh: '食盐晶体中，钠原子和氯原子为什么会紧紧排成有规律的队伍？',
      en: 'Why do sodium and chlorine arrange in a neat, tightly held pattern in table salt?',
    },
    hookHint: {
      zh: '一个电子从钠转移到氯后，两者就不再中性：Na 变成正离子，Cl 变成负离子。相反电荷会彼此吸引。',
      en: 'When one electron transfers from sodium to chlorine, neither stays neutral: Na becomes positive and Cl becomes negative. Opposite charges attract.',
    },
    bigIdea: {
      zh: '离子是因失去或得到电子而带净电荷的原子或原子团；质子数没有改变。',
      en: 'An ion is an atom or group with a net charge because it lost or gained electrons; its proton count has not changed.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🧂',
        title: { zh: '一粒食盐', en: 'A grain of salt' },
        body: {
          zh: '固体食盐由 Na⁺ 和 Cl⁻ 的有规律排列构成。',
          en: 'Solid salt is an ordered arrangement of Na⁺ and Cl⁻.',
        },
      },
      {
        icon: '🔋',
        title: { zh: '手机电池', en: 'A phone battery' },
        body: {
          zh: '电池中离子的移动帮助在不同材料间传递电荷。',
          en: 'Ion movement inside a battery helps carry charge between materials.',
        },
      },
      {
        icon: '🏊',
        title: { zh: '泳池水', en: 'Pool water' },
        body: {
          zh: '水中溶解的离子会影响导电性，也需要被安全地监测。',
          en: 'Dissolved ions affect conductivity and need safe monitoring.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '先算总电荷', en: 'First, total the charge' },
        body: {
          zh: '每个质子带 +1，每个电子带 −1。中性原子中两者数量相等；少一个电子，就比负电少一份，整体带 +1。',
          en: 'Each proton contributes +1 and each electron −1. In a neutral atom they match; lose one electron and there is one less negative charge, giving +1 overall.',
        },
      },
      {
        title: {
          zh: '失电子变正，得电子变负',
          en: 'Lose to become positive; gain to become negative',
        },
        body: {
          zh: '钠常失去一个最外层电子，成为 Na⁺；氯常得到一个电子，成为 Cl⁻。请记住：电子离开，并不是质子离开。',
          en: 'Sodium often loses one outer electron to become Na⁺; chlorine often gains one to become Cl⁻. The electron moves—not a proton.',
        },
      },
      {
        title: { zh: '离子之间会吸引', en: 'Ions attract one another' },
        body: {
          zh: '正、负离子的静电吸引能把大量离子固定成晶格。这解释了食盐晶体的硬和整齐，但盐溶进水后，离子能分散移动。',
          en: 'Electrostatic attraction between positive and negative ions holds many ions in a lattice. It helps explain hard, orderly salt crystals; in water, ions can spread and move.',
        },
      },
    ],
    misconception: {
      zh: 'Na⁺ 不是“多了一个质子”的钠；它是少了一个电子的钠。质子数仍然是 11，所以元素身份仍然是钠。',
      en: 'Na⁺ is not sodium with an extra proton; it is sodium with one fewer electron. It still has 11 protons, so it is still sodium.',
    },
    mission: {
      zh: '读一读家中矿泉水或运动饮料的成分表，找 Na⁺、K⁺、Ca²⁺、Cl⁻ 之类的符号。它们不是陌生密码，而是带电粒子的简写。',
      en: 'Read a mineral-water or sports-drink label at home. Look for symbols such as Na⁺, K⁺, Ca²⁺ or Cl⁻. They are shorthand for charged particles, not secret code.',
    },
    vocabulary: [
      { en: 'ion', zh: '离子' },
      { en: 'positive ion / cation', zh: '阳离子' },
      { en: 'negative ion / anion', zh: '阴离子' },
      { en: 'electron transfer', zh: '电子转移' },
    ],
    interactive: 'ion-transfer',
    questions: [
      {
        id: 'ion-q1',
        prompt: {
          zh: '中性钠原子失去一个电子后，整体电荷是多少？',
          en: 'A neutral sodium atom loses one electron. What is its overall charge?',
        },
        options: [
          { zh: '+1', en: '+1' },
          { zh: '−1', en: '−1' },
          { zh: '0', en: '0' },
        ],
        answer: 0,
        explanation: {
          zh: '少了一个负电荷，正电荷就多出一份，因此为 +1。',
          en: 'One negative charge is missing, leaving one extra positive charge: +1.',
        },
      },
      {
        id: 'ion-q2',
        prompt: {
          zh: 'Na⁺ 为什么仍属于钠元素？',
          en: 'Why is Na⁺ still the element sodium?',
        },
        options: [
          { zh: '它仍有 11 个质子', en: 'It still has 11 protons' },
          { zh: '它仍有 11 个电子', en: 'It still has 11 electrons' },
          { zh: '它的电荷为零', en: 'Its charge is zero' },
        ],
        answer: 0,
        explanation: {
          zh: '元素身份由质子数决定；形成离子只改变电子数。',
          en: 'Element identity comes from proton count; ion formation changes electron count only.',
        },
      },
      {
        id: 'ion-q3',
        prompt: {
          zh: 'Na⁺ 与 Cl⁻ 为什么会彼此吸引？',
          en: 'Why do Na⁺ and Cl⁻ attract each other?',
        },
        options: [
          {
            zh: '异号电荷之间有静电吸引',
            en: 'Opposite charges attract electrostatically',
          },
          { zh: '两者都有相同电荷', en: 'They have identical charges' },
          { zh: '氯离子没有电子', en: 'Chloride has no electrons' },
        ],
        answer: 0,
        explanation: {
          zh: '正电与负电之间的静电吸引是离子化合物的重要连接力量。',
          en: 'Electrostatic attraction between positive and negative charge is a key force in ionic compounds.',
        },
      },
    ],
  },
] satisfies Lesson[];
