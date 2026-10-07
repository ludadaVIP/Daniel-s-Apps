import type { Lesson } from './lessons';

export const electrochemistryLessons = [
  {
    id: 'salt-bridge-and-electrode-names',
    levelId: 'electrochemistry',
    order: 79,
    title: {
      zh: '盐桥不是电子桥：电池的两条路',
      en: 'A salt bridge is not an electron bridge',
    },
    eyebrow: {
      zh: '第 79 课 · 半反应、电极名称与电荷平衡',
      en: 'Lesson 79 · Half-reactions, electrode names and charge balance',
    },
    hook: {
      zh: '锌、铜和导线都在，为什么移走两杯之间的盐桥，电池仍不能持续工作？把电子接回去还不够吗？像一条需要两段接力的运输线，电池内部也有一段不能缺的路线。',
      en: 'Zinc, copper and the wire are still there. Why can the cell not keep working after the salt bridge between its cups is removed? Like a relay with two stages, a battery needs an internal route as well as an external one.',
    },
    hookHint: {
      zh: '导线负责电子路线，盐桥负责离子路线。锌变成 Zn²⁺ 会增加锌侧溶液的正电荷；Cu²⁺ 变成铜会减少铜侧溶液的正电荷。盐桥中的阴、阳离子分别补偿两边，防止阻碍反应的电荷分离持续累积。',
      en: 'The wire carries electrons; the salt bridge carries ions. Forming Zn²⁺ adds positive charge to the zinc solution; turning Cu²⁺ into copper removes positive charge from the copper solution. Oppositely charged bridge ions compensate the two sides.',
    },
    bigIdea: {
      zh: '阳极发生氧化，阴极发生还原；锌—铜原电池由电子走外电路、离子走内部路线共同维持持续的电荷传递。',
      en: 'Oxidation occurs at the anode and reduction at the cathode; a zinc–copper galvanic cell needs external electron flow and internal ion flow to sustain charge transfer.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🔦',
        title: { zh: '手电筒：外面的路', en: 'Torch: the outside route' },
        body: {
          zh: '开关断开，电子就没有完整的外部路径。即使电池内部还有反应物，手电筒也不能持续获得电流。本课把开关简化成“导线接通或断开”。',
          en: 'An open switch breaks the external path. Even with reactants inside the battery, the torch cannot receive sustained current. This lesson represents the switch as a connected or open wire.',
        },
      },
      {
        icon: '🌉',
        title: { zh: '盐桥：内部的接力', en: 'Salt bridge: the inside relay' },
        body: {
          zh: '两杯式教学电池常用盐桥；家用电池可能用电解质和隔膜实现内部离子传递，不一定有一根看得见的 U 形管。两种设计都需要内部带电粒子的路径。',
          en: 'Two-cup teaching cells often use a salt bridge. Household batteries may use electrolyte and separators instead of a visible U-shaped tube. Both designs need an internal route for charged particles.',
        },
      },
      {
        icon: '⚖️',
        title: {
          zh: '账本：不让一边越欠越多',
          en: 'Ledger: avoid a growing imbalance',
        },
        body: {
          zh: '一边形成正离子，另一边消耗正离子，像两个账户的余额在相反方向变化。盐桥不是提供“额外电子”，而是让离子移动，保持溶液整体近似电中性。',
          en: 'One side forms positive ions while the other consumes them, like two balances changing in opposite directions. The bridge does not supply extra electrons: moving ions keeps bulk solutions approximately neutral.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先用电子判断氧化与还原',
          en: 'Identify oxidation and reduction from electrons',
        },
        body: {
          zh: '锌侧：Zn → Zn²⁺ + 2e⁻，电子在右边，表示失电子，是氧化。铜侧：Cu²⁺ + 2e⁻ → Cu，电子在左边，表示得电子，是还原。相加消去电子：Zn + Cu²⁺ → Zn²⁺ + Cu，元素和总电荷都守恒。',
          en: 'Zinc side: Zn → Zn²⁺ + 2e⁻. Electrons on the right mean loss: oxidation. Copper side: Cu²⁺ + 2e⁻ → Cu. Electrons on the left mean gain: reduction. Adding cancels electrons to give Zn + Cu²⁺ → Zn²⁺ + Cu, conserving elements and total charge.',
        },
      },
      {
        title: {
          zh: '电极名称看反应，不看记忆口诀',
          en: 'Name electrodes by their reactions',
        },
        body: {
          zh: '阳极＝氧化发生的电极；阴极＝还原发生的电极。这只正在放电的锌—铜原电池里，锌是负极阳极，铜是正极阴极。“阳”不代表永远带正号；下一课的电解槽会显示正负号改变，反应定义不变。',
          en: 'Anode means the electrode where oxidation occurs; cathode means where reduction occurs. In this discharging zinc–copper galvanic cell, zinc is the negative anode and copper the positive cathode. Anode does not mean always positive; electrolysis changes the signs, not the reaction definitions.',
        },
      },
      {
        title: {
          zh: '例题：为一份反应补上离子账',
          en: 'Worked example: balance one reaction portion',
        },
        body: {
          zh: '本模型用 Zn(NO₃)₂、Cu(NO₃)₂ 溶液和 KNO₃ 盐桥。形成一份 Zn²⁺，锌侧多 +2，要两份 NO₃⁻ 补偿；消耗一份 Cu²⁺，铜侧少 +2，要两份 K⁺ 补回。为什么不是一份？因为这些盐桥离子每份只带一个单位电荷。',
          en: 'The model uses Zn(NO₃)₂ and Cu(NO₃)₂ solutions with a KNO₃ bridge. Forming one Zn²⁺ portion adds +2 on the zinc side, balanced by two NO₃⁻ portions. Consuming one Cu²⁺ portion removes +2 on the copper side, replaced by two K⁺ portions. Why two? Each bridge-ion portion carries one charge unit.',
        },
      },
    ],
    misconception: {
      zh: '“电子经过盐桥到另一杯”不对：电子走金属外电路，盐桥主要由离子传递电荷。“移走盐桥就能让电荷无限累积”也不对：短暂电荷分离会阻碍进一步反应，无法维持电流；模型只展示可持续步骤，不模拟最初的瞬态。',
      en: 'Electrons do not cross the salt bridge: they use the external metal circuit, while ions carry charge through the bridge. Removing the bridge does not let charge accumulate indefinitely; initial separation impedes further reaction. The model shows sustainable steps, not the brief transient.',
    },
    mission: {
      zh: '虚拟电池排障：先推进一份反应，查看两边净电荷为什么仍为零；分别断开导线、移走盐桥，解释哪条路径失去。最后复原并检查锌金属减少、铜金属增加，而锌与铜的总份数各自不变。不要制作电池或接触溶液。',
      en: 'Virtual cell troubleshooting: advance one reaction portion and explain why both bulk charges remain zero. Open the wire and remove the bridge separately; identify the missing route. Restore them and check that zinc metal decreases and copper metal increases while each element’s total inventory stays constant. Do not build a cell or handle solutions.',
    },
    vocabulary: [
      { en: 'anode', zh: '阳极：氧化发生处' },
      { en: 'cathode', zh: '阴极：还原发生处' },
      { en: 'salt bridge', zh: '盐桥' },
      { en: 'half-reaction', zh: '半反应' },
      { en: 'charge balance', zh: '电荷平衡' },
    ],
    resources: [
      {
        title: {
          zh: 'OpenStax：原电池与盐桥（英文，可选）',
          en: 'OpenStax: galvanic cells and salt bridges (optional)',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells',
      },
    ],
    interactive: 'salt-bridge-ledger-lab',
    questions: [
      {
        id: 'salt-bridge-q1',
        prompt: {
          zh: 'Zn → Zn²⁺ + 2e⁻ 发生在哪种电极？',
          en: 'At which electrode does Zn → Zn²⁺ + 2e⁻ occur?',
        },
        options: [
          {
            zh: '阴极，因为电子带负电',
            en: 'Cathode, because electrons are negative',
          },
          { zh: '阳极，因为发生氧化', en: 'Anode, because oxidation occurs' },
          { zh: '盐桥，因为盐会反应', en: 'Salt bridge, because salt reacts' },
        ],
        answer: 1,
        explanation: {
          zh: '半反应中锌失去电子，是氧化。阳极按“发生氧化”定义，不是按电子正负或中文名称猜测。',
          en: 'Zinc loses electrons, so it is oxidised. Anode is defined by oxidation, not by the electron sign or a guessed name.',
        },
      },
      {
        id: 'salt-bridge-q2',
        prompt: {
          zh: '正在放电的锌—铜原电池，电子沿外导线往哪走？',
          en: 'In a discharging zinc–copper galvanic cell, which way do electrons travel through the external wire?',
        },
        options: [
          { zh: '从 Cu 到 Zn', en: 'From Cu to Zn' },
          { zh: '从盐桥流向两边', en: 'From the salt bridge to both sides' },
          { zh: '从 Zn 到 Cu', en: 'From Zn to Cu' },
        ],
        answer: 2,
        explanation: {
          zh: '锌侧氧化提供电子，铜侧 Cu²⁺ 还原消耗电子，所以电子流从锌到铜；传统电流方向相反。',
          en: 'Zinc oxidation supplies electrons; Cu²⁺ reduction consumes them. Electron flow is from zinc to copper; conventional current is opposite.',
        },
      },
      {
        id: 'salt-bridge-q3',
        prompt: {
          zh: '锌侧溶液因形成一份 Zn²⁺ 多了 +2，用 KNO₃ 盐桥应怎样补偿？',
          en: 'Forming one Zn²⁺ portion adds +2 to the zinc solution. How should a KNO₃ bridge compensate?',
        },
        options: [
          {
            zh: '两份 NO₃⁻ 移入锌侧',
            en: 'Two NO₃⁻ portions enter the zinc side',
          },
          { zh: '两份 K⁺ 移入锌侧', en: 'Two K⁺ portions enter the zinc side' },
          { zh: '一份 NO₃⁻ 就足够', en: 'One NO₃⁻ portion is enough' },
        ],
        answer: 0,
        explanation: {
          zh: '每份 NO₃⁻ 带 −1，要两份才能抵消 +2。K⁺ 带正电，会增加而不是补偿这里的正电荷。',
          en: 'Each NO₃⁻ portion carries −1, so two compensate +2. K⁺ would add positive charge instead of compensating it here.',
        },
      },
      {
        id: 'salt-bridge-q4',
        prompt: {
          zh: '消耗一份 Cu²⁺ 后，铜侧溶液需要怎样的盐桥离子补偿？',
          en: 'After one Cu²⁺ portion is consumed, which salt-bridge compensation does the copper solution need?',
        },
        options: [
          { zh: '两份 NO₃⁻', en: 'Two NO₃⁻ portions' },
          { zh: '两份 K⁺', en: 'Two K⁺ portions' },
          {
            zh: '两份电子留在溶液里',
            en: 'Two electron portions stored in solution',
          },
        ],
        answer: 1,
        explanation: {
          zh: 'Cu²⁺ 消耗使溶液少了 +2；两份 +1 的 K⁺ 补回这部分正电荷。电子在电极参与还原，不作为溶液里的库存。',
          en: 'Consuming Cu²⁺ removes +2 from the solution; two +1 K⁺ portions replace it. Electrons take part in reduction at the electrode, not as a solution inventory.',
        },
      },
      {
        id: 'salt-bridge-q5',
        prompt: {
          zh: '移走盐桥但保留导线，为什么不能持续供电？',
          en: 'Why can the cell not sustain power after the salt bridge is removed, even with the wire connected?',
        },
        options: [
          {
            zh: '盐桥本来是电子导线',
            en: 'The salt bridge was the electron wire',
          },
          { zh: '所有反应物立刻消失', en: 'All reactants vanish instantly' },
          {
            zh: '内部离子补偿中断，电荷分离阻碍反应',
            en: 'Internal ion compensation stops; charge separation impedes reaction',
          },
        ],
        answer: 2,
        explanation: {
          zh: '外部电子路线完整还不够。内部离子传递也必须持续，才能避免阻碍继续电子转移的电荷分离。',
          en: 'A complete external electron route is not enough. Internal ion transfer must also continue to prevent charge separation that impedes further electron transfer.',
        },
      },
      {
        id: 'salt-bridge-q6',
        prompt: {
          zh: '两半反应相加后，正确的总反应是什么？',
          en: 'What is the correct overall reaction after adding the two half-reactions?',
        },
        options: [
          { zh: 'Zn + Cu²⁺ → Zn²⁺ + Cu', en: 'Zn + Cu²⁺ → Zn²⁺ + Cu' },
          { zh: 'Zn + Cu → 2e⁻', en: 'Zn + Cu → 2e⁻' },
          {
            zh: 'Zn²⁺ + Cu²⁺ → Zn + Cu，无需电子',
            en: 'Zn²⁺ + Cu²⁺ → Zn + Cu, without electrons',
          },
        ],
        answer: 0,
        explanation: {
          zh: '氧化放出的 2e⁻ 与还原消耗的 2e⁻ 消去。两边都是一份 Zn、一份 Cu，总电荷都是 +2。',
          en: 'The two electrons released by oxidation cancel those consumed by reduction. Both sides contain one Zn and one Cu portion with total charge +2.',
        },
      },
    ],
  },
  {
    id: 'electrolysis-and-copper-coating',
    levelId: 'electrochemistry',
    order: 80,
    title: {
      zh: '让电流做化学：一层铜怎样长出来？',
      en: 'Electricity doing chemistry: how a copper layer grows',
    },
    eyebrow: {
      zh: '第 80 课 · 电解、电镀与电极正负号',
      en: 'Lesson 80 · Electrolysis, electroplating and electrode signs',
    },
    hook: {
      zh: '电池用化学变化供电；工厂却能反过来，用外部电能让物件表面长出一层金属。铜层不是把铜粉粘上去，也不是把电流变成铜——原来的铜到底在哪儿，电子帮它做了什么？',
      en: 'A battery uses chemical change to supply power. A factory can use external power to grow a metal layer on an object instead. It is not glued-on copper powder, and current does not turn into copper. Where was the copper, and what do electrons help it do?',
    },
    hookHint: {
      zh: '溶液中的 Cu²⁺ 在阴极得到电子，变成金属 Cu；铜阳极则失去电子，形成 Cu²⁺ 补入溶液。外部电源让两个半反应按需要持续进行，把铜从一处转移到另一处。',
      en: 'Cu²⁺ in solution gains electrons at the cathode and becomes copper metal. A copper anode loses electrons, forming Cu²⁺ to replenish the solution. External power sustains the half-reactions, transferring copper from one place to another.',
    },
    bigIdea: {
      zh: '电解用外部电能驱动化学变化；阴极仍发生还原、阳极仍发生氧化，但电解槽的阴极接负极、阳极接正极。',
      en: 'Electrolysis uses external electrical energy to drive chemical change; reduction still occurs at the cathode and oxidation at the anode, but the electrolytic cathode connects to negative and the anode to positive.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '✨',
        title: {
          zh: '表面镀层：不是整块换材料',
          en: 'Surface coatings: not a whole new object',
        },
        body: {
          zh: '电镀能在物件表面形成薄金属层，改变外观或某些表面性质。不同金属、基底和镀液的条件不同；本课只研究铜阳极、铜制阴极物件与 CuSO₄ 溶液这一套虚拟模型。',
          en: 'Electroplating adds a thin metal surface layer, changing appearance or some surface properties. Conditions depend on metal, substrate and bath. This virtual model uses a copper anode, a copper object as cathode and CuSO₄ solution only.',
        },
      },
      {
        icon: '🔋',
        title: {
          zh: '充电：从供电改为用电',
          en: 'Charging: consuming instead of supplying power',
        },
        body: {
          zh: '可充电电池充电时，也要由外部电源推动化学变化。不是给任何电池接电都能安全“反转”；只有设计允许、配合正确充电器的电池才可充电。镀铜模型不用于说明锂电池具体反应。',
          en: 'Charging a rechargeable battery also requires external power to drive chemical change. Not every battery can safely be reversed; use only designed rechargeable cells and the correct charger. The copper model does not describe lithium-battery chemistry.',
        },
      },
      {
        icon: '🏭',
        title: {
          zh: '生产管理：通电时间有含义',
          en: 'Production planning: time matters',
        },
        body: {
          zh: '在电流恒定、铜离子充足且无副反应的理想条件下，通电更久会转移更多铜。但真实镀层还要控制均匀性、附着力和能耗，不能只把电流越开越大。',
          en: 'At constant current, with enough copper ions and no side reactions, a longer interval transfers more copper. Real coatings also need uniformity, adhesion and energy control; simply increasing current is not enough.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '外部电源安排电子路线',
          en: 'External power sets the electron routes',
        },
        body: {
          zh: '电源负端向阴极提供电子，Cu²⁺ + 2e⁻ → Cu；电源正端从铜阳极抽走电子，Cu → Cu²⁺ + 2e⁻。溶液主要靠离子移动传递电荷，电子走导线与电极，不是从一块铜穿过镀液游到另一块。',
          en: 'The negative power terminal supplies electrons to the cathode: Cu²⁺ + 2e⁻ → Cu. The positive terminal removes electrons from the copper anode: Cu → Cu²⁺ + 2e⁻. Ions carry charge through the solution; electrons use wires and electrodes, not a swim across the bath.',
        },
      },
      {
        title: {
          zh: '名称不变，正负号会变',
          en: 'Names stay fixed; signs can change',
        },
        body: {
          zh: '上一课原电池：阳极负、阴极正；这一课电解槽：阳极正、阴极负。两者共同不变的是“阳极氧化、阴极还原”。判断时先看失电子还是得电子，再根据电池类型判断正负号。',
          en: 'The previous galvanic cell has a negative anode and positive cathode. This electrolytic cell has a positive anode and negative cathode. What stays fixed is oxidation at the anode and reduction at the cathode. Identify electron loss or gain first, then use the cell type to determine signs.',
        },
      },
      {
        title: {
          zh: '例题：跟着铜和电子记账',
          en: 'Worked example: follow copper and electrons',
        },
        body: {
          zh: '每生成 1 mol 铜镀层，需要 2 mol 电子；理想铜阳极同时失去 1 mol 铜，溶液 Cu²⁺ 的总量不变。进阶：1 A 通电 600 s，通过 600 C。用 F≈96485 C/mol，n(Cu)=600÷(2F)≈0.00311 mol；乘 M(Cu)=63.5 g/mol，转移约 0.197 g 铜。界面可展开查看，不需要先背公式。',
          en: 'Each 1 mol copper coating requires 2 mol electrons. Ideally the copper anode loses 1 mol copper at the same time, leaving total solution Cu²⁺ unchanged. Extension: 1 A for 600 s passes 600 C. With F≈96485 C/mol, n(Cu)=600÷(2F)≈0.00311 mol. Multiplying by M(Cu)=63.5 g/mol gives about 0.197 g copper transferred. Expand the calculation when ready; memorising it is not required first.',
        },
      },
    ],
    misconception: {
      zh: '“电流变成了铜”“阳极永远是正极”都不对。铜来自原有铜原子或铜离子，电子改变它的电荷状态；电极名称由氧化、还原定义，正负号则要看原电池还是电解槽。真实电解产物还受溶液、电极与条件影响，不能把这里的铜配方套到盐水等其他液体。',
      en: 'Current does not become copper, and anode does not always mean positive. Copper comes from existing copper atoms or ions; electrons change its charge state. Electrode names follow oxidation and reduction, while signs depend on cell type. Real electrolysis products depend on electrolyte, electrodes and conditions; do not apply this copper recipe to salt water or other liquids.',
    },
    mission: {
      zh: '虚拟镀层设计：选 1 A、600 s，预测哪块铜增重；分别把时间和电流加倍，再关闭电源，解释结果。最后回答：电极的总铜质量变了吗？溶液 Cu²⁺ 总量为何在这个理想模型中不变？只操作 APP，不做家庭电解或电镀。',
      en: 'Virtual coating design: select 1 A and 600 s and predict which copper electrode gains mass. Double time and current separately, then switch the power plan off and explain the results. Does total electrode copper mass change? Why is total solution Cu²⁺ unchanged in this ideal model? Use the app only; no home electrolysis or plating.',
    },
    vocabulary: [
      { en: 'electrolysis', zh: '电解' },
      { en: 'electroplating', zh: '电镀' },
      { en: 'power supply', zh: '电源' },
      { en: 'current efficiency', zh: '电流效率' },
      { en: 'Faraday constant', zh: '法拉第常数' },
    ],
    resources: [
      {
        title: {
          zh: 'OpenStax：电解与电镀（英文，可选）',
          en: 'OpenStax: electrolysis and electroplating (optional)',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis',
      },
    ],
    interactive: 'copper-plating-lab',
    questions: [
      {
        id: 'plating-q1',
        prompt: {
          zh: '这套虚拟镀铜装置中，铜镀层在哪里形成？',
          en: 'Where does the copper coating form in this virtual plating setup?',
        },
        options: [
          { zh: '正极相连的阳极', en: 'Anode connected to positive' },
          { zh: '负极相连的阴极', en: 'Cathode connected to negative' },
          { zh: '电源内部', en: 'Inside the power supply' },
        ],
        answer: 1,
        explanation: {
          zh: 'Cu²⁺ 在阴极得到电子成为 Cu(s)，镀层在那里形成。阳极发生 Cu 的氧化，失去铜，而不是增加铜。',
          en: 'Cu²⁺ gains electrons at the cathode to become Cu(s), forming the coating. The copper anode is oxidised and loses copper instead.',
        },
      },
      {
        id: 'plating-q2',
        prompt: {
          zh: '在这套铜阳极、CuSO₄ 溶液的模型中，正确的阳极反应是什么？',
          en: 'What is the correct anode reaction for this copper-anode, CuSO₄ model?',
        },
        options: [
          { zh: 'Cu²⁺ + 2e⁻ → Cu', en: 'Cu²⁺ + 2e⁻ → Cu' },
          {
            zh: 'Cu → Cu²⁺，不涉及电子',
            en: 'Cu → Cu²⁺, with no electrons involved',
          },
          { zh: 'Cu → Cu²⁺ + 2e⁻', en: 'Cu → Cu²⁺ + 2e⁻' },
        ],
        answer: 2,
        explanation: {
          zh: '阳极发生氧化，铜原子失去两个电子成为 Cu²⁺。右边 +2 与两个 −1 相抵，总电荷仍为零。',
          en: 'At the anode, copper loses two electrons to become Cu²⁺. On the right, +2 and two −1 charges cancel, keeping total charge zero.',
        },
      },
      {
        id: 'plating-q3',
        prompt: {
          zh: '比较原电池与电解槽，哪项定义始终不变？',
          en: 'Which definition stays the same in galvanic and electrolytic cells?',
        },
        options: [
          {
            zh: '阳极氧化，阴极还原',
            en: 'Oxidation at the anode; reduction at the cathode',
          },
          { zh: '阳极永远是正极', en: 'The anode is always positive' },
          { zh: '阴极永远是正极', en: 'The cathode is always positive' },
        ],
        answer: 0,
        explanation: {
          zh: '电极名称由反应类型定义。原电池阳极负、阴极正；电解槽阳极正、阴极负，所以不能把名称与固定正负号绑定。',
          en: 'Electrode names are defined by reaction type. Galvanic anode is negative and cathode positive; electrolytic signs are reversed. A name is not tied to one fixed sign.',
        },
      },
      {
        id: 'plating-q4',
        prompt: {
          zh: '生成 1 mol Cu 镀层，按 Cu²⁺ + 2e⁻ → Cu 需要多少 mol 电子？',
          en: 'How many moles of electrons are required for 1 mol Cu coating in Cu²⁺ + 2e⁻ → Cu?',
        },
        options: [
          { zh: '1 mol', en: '1 mol' },
          { zh: '2 mol', en: '2 mol' },
          { zh: '0 mol', en: '0 mol' },
        ],
        answer: 1,
        explanation: {
          zh: '半反应配方是 Cu²⁺:e⁻:Cu=1:2:1。每份铜离子要两个电子，所以每 mol 铜需要 2 mol 电子。',
          en: 'The half-reaction ratio is Cu²⁺:e⁻:Cu=1:2:1. Each copper ion needs two electrons, so 1 mol copper requires 2 mol electrons.',
        },
      },
      {
        id: 'plating-q5',
        prompt: {
          zh: '恒定 1 A、铜离子充足、无副反应时，把时间从 600 s 改为 1200 s，理想镀铜质量怎样变？',
          en: 'At constant 1 A, with enough Cu²⁺ and no side reactions, how does ideal coating mass change from 600 s to 1200 s?',
        },
        options: [
          { zh: '减半', en: 'It halves' },
          {
            zh: '不变，电流相同就够了',
            en: 'Unchanged because current is the same',
          },
          {
            zh: '加倍，因为通过的电荷加倍',
            en: 'It doubles because passed charge doubles',
          },
        ],
        answer: 2,
        explanation: {
          zh: 'Q=It，时间加倍且电流相同，Q 加倍；同一半反应中铜的 mol 数和质量随电荷加倍。真实设备还要检查电流效率和镀层质量。',
          en: 'Q=It, so doubling time at the same current doubles charge. For the same half-reaction, copper amount and mass double. Real equipment also needs checks of current efficiency and coating quality.',
        },
      },
      {
        id: 'plating-q6',
        prompt: {
          zh: '理想模型中，阴极增加 0.197 g 铜、铜阳极减少同样质量，哪项正确？',
          en: 'In the ideal model, the cathode gains 0.197 g copper and the copper anode loses the same mass. Which statement is correct?',
        },
        options: [
          {
            zh: '铜被转移，两电极总铜质量不变',
            en: 'Copper is transferred; total electrode copper mass is unchanged',
          },
          {
            zh: '电能变成了新铜元素',
            en: 'Electrical energy became a new copper element',
          },
          {
            zh: '溶液 Cu²⁺ 一定越来越少，阳极无法补充',
            en: 'Solution Cu²⁺ must keep falling; the anode cannot replenish it',
          },
        ],
        answer: 0,
        explanation: {
          zh: '铜阳极形成 Cu²⁺，阴极消耗相同数量的 Cu²⁺。铜从一块电极转移到另一块；理想条件下溶液 Cu²⁺ 总量和两电极总铜质量都不变。',
          en: 'The copper anode forms Cu²⁺ and the cathode consumes the same amount. Copper transfers between electrodes; ideally total solution Cu²⁺ and total electrode copper mass remain unchanged.',
        },
      },
    ],
  },
] satisfies Lesson[];
