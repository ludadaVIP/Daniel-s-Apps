import type { Lesson } from './lessons';

export const level16Lessons: Lesson[] = [
  {
    id: 'chemical-batteries-electron-route',
    levelId: 'electrochemistry',
    order: 60,
    title: {
      zh: '电池里的化学：电子为什么会走一圈？',
      en: 'Chemistry in a battery: why do electrons take a trip?',
    },
    eyebrow: {
      zh: '第 60 课 · 从金属反应到手电筒亮起',
      en: 'Lesson 60 · From metal reactions to a torch lighting up',
    },
    hook: {
      zh: '按下手电筒开关，灯就亮了。电池里没有小小的“电”被储藏着等着跑出来——到底是哪种化学变化让电子能沿着导线前进？',
      en: 'Press a torch switch and its bulb lights. A battery does not hold tiny pieces of “electricity” waiting to escape—what chemical change makes electrons travel through the wire?',
    },
    hookHint: {
      zh: '原电池把自发的氧化还原反应分开安排：一侧的物质失去电子（氧化），电子沿外电路流向另一侧，那里有物质得到电子（还原）。离子在内部移动以保持电荷平衡。',
      en: 'A galvanic cell arranges a spontaneous redox reaction in separated places: material on one side loses electrons (oxidation), electrons flow through the external circuit to the other side, where material gains electrons (reduction). Ions move inside to maintain charge balance.',
    },
    bigIdea: {
      zh: '电池把氧化还原反应的电子转移引导到外电路中，形成可用电流；电子流经导线，离子在电池内部补偿电荷。能量来自化学反应，不来自导线本身。',
      en: 'A battery directs electron transfer from a redox reaction through an external circuit, producing useful current; electrons travel in wires and ions compensate charge inside. Energy comes from chemical reaction, not from the wire itself.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🔦',
        title: { zh: '手电筒与遥控器', en: 'Torches and remotes' },
        body: {
          zh: '电池中的反应在合适的电路接通时推动电子流，给灯泡或遥控器芯片提供能量。不同电池的化学体系不同，不能随意混用、拆开或充电。',
          en: 'When the circuit is connected, reactions in a battery drive electron flow to power a bulb or remote chip. Battery chemistries differ; do not mix, open or recharge batteries casually.',
        },
      },
      {
        icon: '🔋',
        title: {
          zh: '充电电池为什么能反过来工作？',
          en: 'Why rechargeable cells can run in reverse',
        },
        body: {
          zh: '可充电电池能在正确设备中用外部电能推动反向化学变化。不是所有电池都可充电；给一次性电池充电可能漏液、过热或起火。',
          en: 'In the correct device, rechargeable cells use external electrical energy to drive the chemistry in reverse. Not every battery is rechargeable; charging a disposable cell can cause leaks, overheating or fire.',
        },
      },
      {
        icon: '🚗',
        title: {
          zh: '生锈和电池是亲戚',
          en: 'Rust and batteries are relatives',
        },
        body: {
          zh: '生锈也是氧化还原的一种电子转移，只是电子转移没有被好好引导到导线中。电化学尝试把这种转移变成可控制、可利用的电流。',
          en: 'Rusting is also electron transfer in a redox process, but its electron flow is not usefully guided through a wire. Electrochemistry aims to control such transfer and use it as current.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '氧化：电子离开的一侧',
          en: 'Oxidation: the side electrons leave',
        },
        body: {
          zh: '在简单的锌—铜电池中，锌原子可以失去电子成为锌离子。失去电子叫氧化；这也解释了为何“氧化”不总是指和氧气直接结合。',
          en: 'In a simple zinc–copper cell, zinc atoms can lose electrons to become zinc ions. Losing electrons is oxidation; this also explains why oxidation does not always mean directly combining with oxygen gas.',
        },
      },
      {
        title: {
          zh: '导线：给电子一条可用的路',
          en: 'The wire: a useful route for electrons',
        },
        body: {
          zh: '若两处反应直接接触，电子转移会在局部发生，难以做功。把半反应分开并用导线连接，电子就被迫经过外电路，可以点亮小灯或驱动设备。',
          en: 'If both processes touch directly, electron transfer happens locally and is hard to use. Separating half-reactions and connecting them by wire makes electrons pass through the external circuit, where they can light a bulb or power a device.',
        },
      },
      {
        title: {
          zh: '内部离子：让账本不欠账',
          en: 'Internal ions: keep the charge ledger balanced',
        },
        body: {
          zh: '电子离开的一侧会累积正电荷；另一侧得到电子的反应也会改变溶液电荷。盐桥或电解质中的离子移动来补偿这些电荷，电路才能持续工作。',
          en: 'The electron-losing side accumulates positive charge; the electron-gaining side also changes solution charge. Ions in a salt bridge or electrolyte move to compensate, allowing the circuit to keep working.',
        },
      },
    ],
    misconception: {
      zh: '“电流只是在导线里流，电池内部不用管”不对。电子主要在金属导线中移动，电池内部主要靠离子移动；两条路径缺一不可。也不要把电子流方向和传统电流方向混为一谈：传统电流方向定义为与电子流相反。',
      en: '“Current only flows in the wire, so the battery interior does not matter” is wrong. Electrons mainly move through metal wires, while ions mainly move inside the cell; both paths are essential. Do not confuse electron-flow direction with conventional current, which is defined in the opposite direction.',
    },
    mission: {
      zh: '电池安全观察：找一个正在使用或已用完的家用电池，只读标签上的化学类型、正负极和“不可充电/可充电”标识。不要拆开、短接、加热或投入火中；用完后交给合适的回收渠道。',
      en: 'Battery safety observation: find a household battery in use or spent, and only read its chemistry, positive/negative marks, and “rechargeable/non-rechargeable” label. Do not open, short-circuit, heat or burn it; use an appropriate recycling route when spent.',
    },
    vocabulary: [
      { en: 'electrochemistry', zh: '电化学' },
      { en: 'oxidation', zh: '氧化' },
      { en: 'reduction', zh: '还原' },
      { en: 'electrode', zh: '电极' },
      { en: 'electrolyte', zh: '电解质' },
    ],
    interactive: 'battery-route-lab',
    questions: [
      {
        id: 'battery-q1',
        prompt: {
          zh: '在锌—铜原电池中，锌失去电子的过程叫什么？',
          en: 'In a zinc–copper galvanic cell, what is the process in which zinc loses electrons called?',
        },
        options: [
          { zh: '氧化', en: 'Oxidation' },
          { zh: '还原', en: 'Reduction' },
          { zh: '中和', en: 'Neutralisation' },
        ],
        answer: 0,
        explanation: {
          zh: '氧化就是失去电子。锌失去电子后形成带正电的锌离子。',
          en: 'Oxidation means losing electrons. After zinc loses electrons, it forms positively charged zinc ions.',
        },
      },
      {
        id: 'battery-q2',
        prompt: {
          zh: '电子在一个工作的电池外电路中主要沿哪里移动？',
          en: 'Where do electrons mainly move in a working battery’s external circuit?',
        },
        options: [
          { zh: '金属导线', en: 'Metal wire' },
          { zh: '空气中的任意方向', en: 'Any direction through the air' },
          { zh: '只在塑料外壳内', en: 'Only inside the plastic case' },
        ],
        answer: 0,
        explanation: {
          zh: '金属导线提供电子可走的连续路径；电池内部则主要由离子移动来维持电荷平衡。',
          en: 'A metal wire provides a continuous path for electrons; inside the battery, ions mainly maintain charge balance.',
        },
      },
      {
        id: 'battery-q3',
        prompt: {
          zh: '为什么电池内部需要电解质或盐桥中的离子移动？',
          en: 'Why does a battery need ion movement in an electrolyte or salt bridge?',
        },
        options: [
          {
            zh: '补偿两侧累积的电荷，让反应能持续',
            en: 'To compensate accumulating charge so the reaction can continue',
          },
          {
            zh: '让电子在塑料中加速',
            en: 'To accelerate electrons in plastic',
          },
          { zh: '把电池变成磁铁', en: 'To turn the battery into a magnet' },
        ],
        answer: 0,
        explanation: {
          zh: '若电荷不平衡不断累积，进一步电子转移会被阻碍。离子移动让内部“电荷账本”维持平衡。',
          en: 'If charge imbalance kept accumulating, further electron transfer would be blocked. Ion movement keeps the internal charge ledger balanced.',
        },
      },
      {
        id: 'battery-q4',
        prompt: {
          zh: '下列哪种电池做法最安全？',
          en: 'Which battery practice is safest?',
        },
        options: [
          {
            zh: '按标签使用，并通过合适渠道回收用完的电池',
            en: 'Use as labelled and recycle spent batteries through an appropriate route',
          },
          {
            zh: '拆开看看里面的化学物质',
            en: 'Open it to see the chemicals inside',
          },
          {
            zh: '给所有一次性电池充电',
            en: 'Recharge every disposable battery',
          },
        ],
        answer: 0,
        explanation: {
          zh: '电池可能含腐蚀性或易燃材料。遵循标签、避免短接和正确回收才安全。',
          en: 'Batteries may contain corrosive or flammable materials. Follow labels, avoid short circuits and recycle correctly.',
        },
      },
    ],
  },
];
