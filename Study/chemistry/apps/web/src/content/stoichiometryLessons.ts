import type { Lesson } from './lessons';

export const stoichiometryLessons = [
  {
    id: 'limiting-reactants-and-leftovers',
    levelId: 'moles',
    order: 77,
    title: {
      zh: '谁先用完？配方里的瓶颈',
      en: 'Who runs out first? The recipe bottleneck',
    },
    eyebrow: {
      zh: '第 77 课 · 限制反应物、剩余物与质量账本',
      en: 'Lesson 77 · Limiting reactants, leftovers and a mass ledger',
    },
    hook: {
      zh: '组装一辆自行车需要两个轮子和一个车架。仓库有 6 个轮子、4 个车架：轮子更多，为什么反而是轮子先用完？化学反应也会遇到这种“看数量会猜错”的瓶颈。',
      en: 'A bicycle needs two wheels and one frame. With six wheels and four frames, why do the wheels run out even though there are more of them? Chemical recipes have the same kind of bottleneck.',
    },
    hookHint: {
      zh: '轮子只够 3 辆，车架够 4 辆。不要直接比较库存，要比较“库存 ÷ 每份配方需要的数量”。反应里先耗尽的那种物质，限制了最多能生成多少产物。',
      en: 'The wheels support three bicycles; the frames support four. Compare stock divided by the amount needed per recipe, not stock alone. The reactant exhausted first limits the maximum product.',
    },
    bigIdea: {
      zh: '先把反应物换成 mol，再比较 n ÷ 方程式系数；较小值决定理论产量，没用完的反应物也必须记入质量账本。',
      en: 'Convert reactants to moles and compare n divided by equation coefficient; the smaller value sets theoretical yield, and unused reactants stay in the mass ledger.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🚲',
        title: {
          zh: '车间：别只看库存大小',
          en: 'Workshop: stock size is not enough',
        },
        body: {
          zh: '6 个轮子与 4 个车架能配成 3 辆车，剩下 1 个车架。这个类比只说明比例；化学中要按配平方程式比较 mol，不按不同物质的克数直接比较。',
          en: 'Six wheels and four frames make three bicycles and leave one frame. This analogy explains ratios; chemistry compares moles using a balanced equation, not raw masses of different substances.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '燃料电池：用量需要配对',
          en: 'Fuel cells: amounts must match',
        },
        body: {
          zh: '氢氧燃料电池的总反应也生成水，总配方是 2H₂ + O₂ → 2H₂O。设备还要管理供气与能量；本课只用虚拟配方理解“最多生成多少”，不模拟真实设备效率。',
          en: 'The overall hydrogen–oxygen fuel-cell reaction forms water: 2H₂ + O₂ → 2H₂O. Real devices also manage gas supply and energy; this virtual recipe calculates a maximum, not real device efficiency.',
        },
      },
      {
        icon: '📦',
        title: {
          zh: '采购：多买不等于多产出',
          en: 'Purchasing: more stock need not mean more output',
        },
        body: {
          zh: '氧气已用完时，只再加氢气不能继续生成水。找到真正短缺的原料，才能避免把资金和空间花在越来越多的剩余物上。',
          en: 'Once oxygen is exhausted, adding hydrogen alone cannot make more water. Finding the actual shortage helps avoid spending money and space on growing leftovers.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '读配方，再把克数换成 mol',
          en: 'Read the recipe, then convert grams to moles',
        },
        body: {
          zh: '配平式 2H₂ + O₂ → 2H₂O 的比例是 2:1:2。若给质量，先用 n=m/M。本课取 M(H₂)=2、M(O₂)=32、M(H₂O)=18 g/mol；8 g H₂ 是 4 mol，32 g O₂ 是 1 mol。',
          en: 'The balanced equation 2H₂ + O₂ → 2H₂O has a 2:1:2 ratio. For masses, start with n=m/M. Using M(H₂)=2, M(O₂)=32 and M(H₂O)=18 g/mol, 8 g H₂ is 4 mol and 32 g O₂ is 1 mol.',
        },
      },
      {
        title: {
          zh: '例题：比较完整配方的份数',
          en: 'Worked example: compare complete recipe batches',
        },
        body: {
          zh: '4 mol H₂ 能支持 4÷2=2 份；1 mol O₂ 只支持 1÷1=1 份。所以 O₂ 限制反应。每份生成 2 mol 水，最多得到 2 mol×18 g/mol=36 g 水。为什么不用 4 mol H₂ 全部来算？因为氧气不够配对。',
          en: '4 mol H₂ supports 4÷2=2 batches; 1 mol O₂ supports only 1÷1=1 batch. Oxygen limits the reaction. Each batch makes 2 mol water, so the maximum is 2 mol×18 g/mol=36 g. Why not use all 4 mol H₂? There is not enough oxygen to match it.',
        },
      },
      {
        title: {
          zh: '回查剩余物与守恒',
          en: 'Check leftovers and conservation',
        },
        body: {
          zh: '生成 2 mol 水只消耗 2 mol H₂，剩下 2 mol H₂，也就是 4 g。总账是 8+32=36+4 g，质量没有消失。两边 n÷系数恰好相等时，会按这个理想配方一起用完，没有过量反应物。',
          en: 'Making 2 mol water consumes only 2 mol H₂, leaving 2 mol H₂, or 4 g. The ledger is 8+32=36+4 g: mass has not vanished. Equal n/coefficient values mean both stocks are used together in this ideal recipe, with no excess reactant.',
        },
      },
    ],
    misconception: {
      zh: '“克数少的先用完”“mol 少的先用完”都不可靠，要先看配方需要几份。限制反应物给出的是目标反应的理论上限；实际反应还可能不完全、有副反应或收集损失，下一课再检查这些差距。',
      en: 'Neither fewer grams nor fewer moles reliably identifies the limiting reactant: account for the recipe ratio first. The limiting reactant sets a theoretical maximum for the target reaction; incomplete reaction, side reactions or collection losses can lower actual yield.',
    },
    mission: {
      zh: '虚拟采购挑战：先选 6 mol H₂ 与 4 mol O₂，找出剩余物；再只增加已经过量的那种原料，预测水会不会变多。最后换成恰好 2:1 的库存。用“能支持几份配方”解释三次结果，不要实际混合气体。',
      en: 'Virtual purchasing challenge: select 6 mol H₂ and 4 mol O₂ and identify leftovers. Increase only the excess stock and predict whether more water forms. Then set an exact 2:1 stock ratio. Explain all three results using recipe batches; do not mix real gases.',
    },
    vocabulary: [
      { en: 'limiting reactant', zh: '限制反应物' },
      { en: 'excess reactant', zh: '过量反应物' },
      { en: 'stoichiometric ratio', zh: '化学计量比' },
      { en: 'theoretical yield', zh: '理论产量' },
    ],
    resources: [
      {
        title: {
          zh: 'OpenStax：限制反应物与产率（英文，可选）',
          en: 'OpenStax: limiting reactants and yields (optional)',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/4-4-reaction-yields',
      },
    ],
    interactive: 'limiting-reactant-lab',
    questions: [
      {
        id: 'limiting-q1',
        prompt: {
          zh: '2H₂ + O₂ → 2H₂O；6 mol H₂ 与 4 mol O₂，谁限制反应？',
          en: 'For 2H₂ + O₂ → 2H₂O, which limits a mixture of 6 mol H₂ and 4 mol O₂?',
        },
        options: [
          {
            zh: 'O₂，因为它的 mol 数更少',
            en: 'O₂ because it has fewer moles',
          },
          {
            zh: 'H₂，因为只能支持 3 份配方',
            en: 'H₂ because it supports only three recipe batches',
          },
          { zh: '两者一定一起用完', en: 'Both must run out together' },
        ],
        answer: 1,
        explanation: {
          zh: 'H₂ 支持 6÷2=3 份，O₂ 支持 4÷1=4 份。H₂ 限制反应，虽然它的 mol 数更多。',
          en: 'H₂ supports 6÷2=3 batches; O₂ supports 4÷1=4. Hydrogen limits the reaction despite having more moles.',
        },
      },
      {
        id: 'limiting-q2',
        prompt: {
          zh: '8 g H₂ 与 32 g O₂ 理想完全反应，最多生成多少水？取 M=2、32、18 g/mol。',
          en: 'What is the maximum water mass from 8 g H₂ and 32 g O₂? Use M=2, 32 and 18 g/mol and ideal complete reaction.',
        },
        options: [
          { zh: '40 g', en: '40 g' },
          { zh: '72 g', en: '72 g' },
          { zh: '36 g', en: '36 g' },
        ],
        answer: 2,
        explanation: {
          zh: '先换算为 4 mol H₂、1 mol O₂；O₂ 只够生成 2 mol 水。2×18=36 g，另有 4 g H₂ 剩余，不能把全部原料质量都当成水。',
          en: 'Convert to 4 mol H₂ and 1 mol O₂. Oxygen supports 2 mol water: 2×18=36 g. Another 4 g H₂ remains; not all feed mass becomes water.',
        },
      },
      {
        id: 'limiting-q3',
        prompt: {
          zh: '6 mol H₂ 与 4 mol O₂ 完全反应后，剩下什么？',
          en: 'After complete reaction of 6 mol H₂ and 4 mol O₂, what remains?',
        },
        options: [
          { zh: '1 mol O₂', en: '1 mol O₂' },
          { zh: '2 mol H₂', en: '2 mol H₂' },
          { zh: '4 mol O₂', en: '4 mol O₂' },
        ],
        answer: 0,
        explanation: {
          zh: '6 mol H₂ 消耗 3 mol O₂，生成 6 mol 水。氧气剩 4−3=1 mol，氢气用完。',
          en: '6 mol H₂ consumes 3 mol O₂ and forms 6 mol water. Oxygen remaining is 4−3=1 mol; hydrogen is exhausted.',
        },
      },
      {
        id: 'limiting-q4',
        prompt: {
          zh: '4 mol H₂ 与 1 mol O₂ 的库存中，只再加 2 mol H₂，水的理论产量怎样变？',
          en: 'Starting with 4 mol H₂ and 1 mol O₂, add only 2 mol H₂. How does theoretical water yield change?',
        },
        options: [
          { zh: '加倍', en: 'It doubles' },
          {
            zh: '不变，O₂ 仍只够 1 份配方',
            en: 'Unchanged: O₂ still supports only one batch',
          },
          { zh: '水会变成氧气', en: 'Water becomes oxygen' },
        ],
        answer: 1,
        explanation: {
          zh: '增加过量的氢气不能解决缺氧。O₂ 仍是 1 mol，所以最多仍是 2 mol 水，只是剩余 H₂ 更多。',
          en: 'More excess hydrogen does not solve the oxygen shortage. With 1 mol O₂, the maximum remains 2 mol water; more hydrogen is left over.',
        },
      },
      {
        id: 'limiting-q5',
        prompt: {
          zh: '4 mol H₂ 与 2 mol O₂ 按理想配方完全反应，哪项正确？',
          en: 'For ideal complete reaction of 4 mol H₂ and 2 mol O₂, which statement is correct?',
        },
        options: [
          { zh: 'H₂ 一定有剩余', en: 'Some H₂ must remain' },
          { zh: 'O₂ 一定有剩余', en: 'Some O₂ must remain' },
          {
            zh: '两者恰好一起用完，生成 4 mol 水',
            en: 'Both are used up together, forming 4 mol water',
          },
        ],
        answer: 2,
        explanation: {
          zh: '4÷2=2 与 2÷1=2 相等，都够 2 份完整配方，所以无过量反应物，生成 2×2=4 mol 水。',
          en: '4÷2=2 and 2÷1=2 are equal. Both support two full batches, giving 2×2=4 mol water with no excess reactant.',
        },
      },
      {
        id: 'limiting-q6',
        prompt: {
          zh: '某题算出 40 g 原料变成 36 g 水和 4 g 剩余 H₂。哪种解释正确？',
          en: 'A calculation gives 36 g water and 4 g leftover H₂ from 40 g feed. Which interpretation is correct?',
        },
        options: [
          {
            zh: '产物加剩余物仍是 40 g，质量守恒',
            en: 'Products plus leftovers still total 40 g: mass is conserved',
          },
          { zh: '4 g 质量消失了', en: '4 g of mass disappeared' },
          {
            zh: '每个反应必须把所有原料都变成同一种产物',
            en: 'Every reaction must turn all feed into one product',
          },
        ],
        answer: 0,
        explanation: {
          zh: '账本要覆盖所有物质，不只盯着目标产物。剩余反应物仍存在，36+4=40 g。',
          en: 'The ledger must include all substances, not only the desired product. Leftover reactant still exists, and 36+4=40 g.',
        },
      },
    ],
  },
  {
    id: 'theoretical-and-actual-yield',
    levelId: 'moles',
    order: 78,
    title: {
      zh: '理论能做多少，实际拿到多少？',
      en: 'How much is possible—and how much did we collect?',
    },
    eyebrow: {
      zh: '第 78 课 · 理论产量、实际产量与产率',
      en: 'Lesson 78 · Theoretical yield, actual yield and percent yield',
    },
    hook: {
      zh: '食谱说能做 10 块饼干，装盒时却只有 8 块：可能有面团留在碗里，也可能烤坏了。化学工厂也会比较“配方允许的最多产量”和“最后真正拿到的目标产物”。差距到底告诉了我们什么？',
      en: 'A recipe promises ten cookies, but only eight reach the box: dough may stay in the bowl, or some cookies may burn. A chemical factory also compares the recipe maximum with the target product actually collected. What does the gap tell us?',
    },
    hookHint: {
      zh: '先算理论上限，再用实际产量÷理论产量×100%。但这个百分数只说明拿到了多少，不能单凭它断定损失原因；更不能把杂质也算成目标产物。',
      en: 'Calculate the theoretical maximum, then actual yield÷theoretical yield×100%. This percentage tells how much was obtained, not the cause of a shortfall. Impurities must not count as target product.',
    },
    bigIdea: {
      zh: '产率比较同一种目标产物的实际产量与理论产量；少收集不等于质量消失，杂质造成的“超额”也不是真正高产。',
      en: 'Percent yield compares actual and theoretical amounts of the same target product; a collection shortfall is not disappearing mass, and impurity is not extra product.',
    },
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🍪',
        title: {
          zh: '装盒：生成与收集不是一回事',
          en: 'Packing: making and collecting differ',
        },
        body: {
          zh: '饼干可能做出来却没进盒子；化学产物也可能留在设备、滤纸或溶液里。收集到的实际产量不能自动代表反应到底进行了多少。',
          en: 'A cookie may be made but never enter the box. Chemical product can remain in equipment, on filter paper or in solution. Collected yield alone does not reveal how far the reaction proceeded.',
        },
      },
      {
        icon: '🏭',
        title: {
          zh: '石灰制造：石头分解成两种产物',
          en: 'Lime manufacture: stone gives two products',
        },
        body: {
          zh: '碳酸钙是石灰石的重要成分。加热分解 CaCO₃ → CaO + CO₂ 可制得生石灰。固体变轻还有气体离开的原因，不能直接把原料的 10 g 都当成 CaO 的理论产量。',
          en: 'Calcium carbonate is a major limestone component. Heating CaCO₃ → CaO + CO₂ produces quicklime. Gas leaves, so a 10 g feed does not imply a 10 g theoretical CaO yield.',
        },
      },
      {
        icon: '🔎',
        title: {
          zh: '验收：称重还要检查纯度',
          en: 'Quality check: mass needs purity evidence',
        },
        body: {
          zh: '目标产物里混进沙粒，会让样品更重，却没有增加目标分子的数量。工厂要同时关心产量、纯度、能耗与废物，不是只追一个漂亮百分数。',
          en: 'Sand mixed with product makes a sample heavier without adding target particles. Factories care about yield, purity, energy use and waste—not just an attractive percentage.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '理论产量：从正确配方出发',
          en: 'Theoretical yield: start with the right recipe',
        },
        body: {
          zh: '例题：10.00 g 纯 CaCO₃ 完全分解，最多得到多少 CaO？取 M(CaCO₃)=100、M(CaO)=56 g/mol。先算 10.00÷100=0.100 mol；配方 1:1，所以最多 0.100 mol CaO，质量是 0.100×56=5.60 g。',
          en: 'Worked example: what is the maximum CaO from complete decomposition of 10.00 g pure CaCO₃? Use M(CaCO₃)=100 and M(CaO)=56 g/mol. 10.00÷100=0.100 mol; the 1:1 recipe allows 0.100 mol CaO, or 0.100×56=5.60 g.',
        },
      },
      {
        title: {
          zh: '实际产量：按同一种纯产物比较',
          en: 'Actual yield: compare the same pure product',
        },
        body: {
          zh: '如果收集到干燥纯 CaO 4.48 g，产率＝4.48÷5.60×100%=80%。这里两边都是 CaO 的克数，不是拿 CaO 的质量除以原料的质量。4.48÷10.00 算的是另一个质量比，不是反应产率。',
          en: 'Collecting 4.48 g dry pure CaO gives 4.48÷5.60×100%=80% yield. Both amounts are grams of CaO; do not divide CaO mass by feed mass. 4.48÷10.00 is a different mass ratio, not reaction yield.',
        },
      },
      {
        title: {
          zh: '差距：找证据，不编原因',
          en: 'The gap: investigate instead of guessing',
        },
        body: {
          zh: '80% 可能来自反应不完全、副反应或收集损失，单看产率分不清。理想完全分解时，10.00 g＝5.60 g CaO＋4.40 g CO₂；没装进收集瓶的物质仍可能在别处。若表观产率超过 100%，先查样品纯度、干燥、称量与计算条件。',
          en: 'An 80% yield may reflect incomplete reaction, side reactions or collection loss; yield alone cannot distinguish them. Ideal complete decomposition gives 10.00 g=5.60 g CaO+4.40 g CO₂. Material outside the collection vessel may still exist elsewhere. An apparent yield above 100% calls for checking purity, drying, weighing and calculation assumptions.',
        },
      },
    ],
    misconception: {
      zh: '“产率 80% 就是 20% 原子消失了”是错的。“表观 105% 证明配方上限被突破”也不对：例如 4.48 g CaO 混入 1.40 g 沙粒，样品共 5.88 g；误算是 105%，但 CaO 的真实产率仍是 80%。',
      en: 'An 80% yield does not mean 20% of atoms disappeared. An apparent 105% yield does not beat the recipe maximum either: 4.48 g CaO plus 1.40 g sand weighs 5.88 g. Counting the entire sample gives 105%, while the CaO yield remains 80%.',
    },
    mission: {
      zh: '虚拟验收员：依次检查 A、B、C 三份收集记录，写下理论 CaO、纯 CaO 与样品总质量。找出哪个“看着更重”的样品反而没有提高真实产率，再提出一项能帮助判断损失原因的证据。只操作模型，不制取或接触生石灰。',
      en: 'Virtual quality inspector: inspect records A, B and C. Note theoretical CaO, pure CaO and total sample mass. Identify a heavier sample that does not improve true yield, then suggest evidence to investigate a shortfall. Use the model only; do not make or handle quicklime.',
    },
    vocabulary: [
      { en: 'theoretical yield', zh: '理论产量' },
      { en: 'actual yield', zh: '实际产量' },
      { en: 'percent yield', zh: '产率' },
      { en: 'purity', zh: '纯度' },
      { en: 'collection loss', zh: '收集损失' },
    ],
    resources: [
      {
        title: {
          zh: 'OpenStax：理论产量与产率（英文，可选）',
          en: 'OpenStax: theoretical and percent yields (optional)',
        },
        url: 'https://openstax.org/books/chemistry-2e/pages/4-4-reaction-yields',
      },
    ],
    interactive: 'percent-yield-lab',
    questions: [
      {
        id: 'yield-q1',
        prompt: {
          zh: '10.00 g 纯 CaCO₃ 完全分解，CaO 的理论产量是多少？M 分别是 100 与 56 g/mol。',
          en: 'What is the theoretical CaO yield from complete decomposition of 10.00 g pure CaCO₃? M values are 100 and 56 g/mol.',
        },
        options: [
          { zh: '10.00 g', en: '10.00 g' },
          { zh: '4.40 g', en: '4.40 g' },
          { zh: '5.60 g', en: '5.60 g' },
        ],
        answer: 2,
        explanation: {
          zh: '10.00÷100=0.100 mol CaCO₃，按 1:1 得 0.100 mol CaO，再乘 56 得 5.60 g。另有 CO₂，不能把全部原料质量都算作 CaO。',
          en: '10.00÷100=0.100 mol CaCO₃ gives 0.100 mol CaO at 1:1. Multiplying by 56 gives 5.60 g. CO₂ also forms, so not all feed mass becomes CaO.',
        },
      },
      {
        id: 'yield-q2',
        prompt: {
          zh: '理论 CaO 5.60 g，实际收集干燥纯 CaO 4.48 g，产率是多少？',
          en: 'Theoretical CaO is 5.60 g; collected dry pure CaO is 4.48 g. What is percent yield?',
        },
        options: [
          { zh: '80%', en: '80%' },
          { zh: '44.8%', en: '44.8%' },
          { zh: '125%', en: '125%' },
        ],
        answer: 0,
        explanation: {
          zh: '实际÷理论×100%=4.48÷5.60×100%=80%。顺序不能倒，也不能改用原料质量作分母。',
          en: 'Actual÷theoretical×100%=4.48÷5.60×100%=80%. Do not reverse the ratio or use feed mass as the denominator.',
        },
      },
      {
        id: 'yield-q3',
        prompt: {
          zh: '目标产物产率 80%，仅凭这个数据能断定什么？',
          en: 'With an 80% target-product yield, what can this number alone establish?',
        },
        options: [
          {
            zh: '一定是转移时掉了 20%',
            en: 'Exactly 20% was lost during transfer',
          },
          {
            zh: '收集到理论产量的 80%，原因还需证据',
            en: '80% of theoretical product was collected; the cause needs evidence',
          },
          { zh: '20% 原子消失了', en: '20% of atoms disappeared' },
        ],
        answer: 1,
        explanation: {
          zh: '产率描述结果，不唯一确定原因。反应不完全、副反应、留在设备里的产物都可能造成差距，要进一步分析。',
          en: 'Yield describes an outcome, not a unique cause. Incomplete reaction, side reactions or product remaining in equipment can cause a shortfall; investigate further.',
        },
      },
      {
        id: 'yield-q4',
        prompt: {
          zh: '理论 CaO 5.60 g；样品含 4.48 g CaO 与 1.40 g 惰性沙粒。CaO 产率是多少？',
          en: 'Theoretical CaO is 5.60 g; a sample contains 4.48 g CaO and 1.40 g inert sand. What is CaO yield?',
        },
        options: [
          { zh: '105%，沙粒也算产物', en: '105%; sand counts as product' },
          {
            zh: '100%，因为样品更重',
            en: '100% because the sample is heavier',
          },
          { zh: '80%，只计算 CaO', en: '80%; count only CaO' },
        ],
        answer: 2,
        explanation: {
          zh: '沙粒不是目标产物。4.48÷5.60=0.80；把总质量 5.88 g 代入会得表观 105%，恰好提醒我们检查纯度。',
          en: 'Sand is not the target product. 4.48÷5.60=0.80. Using the full 5.88 g gives an apparent 105%, signalling a purity problem.',
        },
      },
      {
        id: 'yield-q5',
        prompt: {
          zh: '同样原料、同样理论上限，两次纯 CaO 分别收集 4.48 g 和 5.04 g。哪次产率更高？',
          en: 'With the same feed and theoretical maximum, two runs collect 4.48 g and 5.04 g pure CaO. Which has higher yield?',
        },
        options: [
          {
            zh: '5.04 g 那次，90% 比 80% 高',
            en: 'The 5.04 g run: 90% is higher than 80%',
          },
          {
            zh: '4.48 g 那次，少就是高效',
            en: 'The 4.48 g run: less always means efficient',
          },
          {
            zh: '一定相同，因为理论上限相同',
            en: 'They must match because the maximum is the same',
          },
        ],
        answer: 0,
        explanation: {
          zh: '分母都是 5.60 g，实际收集的纯产物越多，产率越高。但是否更环保还要比较能耗、废物等，不能只凭产率。',
          en: 'Both denominators are 5.60 g, so more collected pure product means higher yield. Environmental performance also depends on energy use and waste, not yield alone.',
        },
      },
      {
        id: 'yield-q6',
        prompt: {
          zh: '完全分解 10.00 g CaCO₃，得到 5.60 g CaO。其余 4.40 g 在理想配方中是什么？',
          en: 'Complete decomposition of 10.00 g CaCO₃ gives 5.60 g CaO. What is the other 4.40 g in the ideal recipe?',
        },
        options: [
          { zh: '消失的质量', en: 'Disappeared mass' },
          { zh: '生成的 CO₂', en: 'CO₂ produced' },
          { zh: '一定是仪器错误', en: 'It must be instrument error' },
        ],
        answer: 1,
        explanation: {
          zh: 'CaCO₃ → CaO + CO₂，两种产物都要记账。0.100 mol CO₂×44 g/mol=4.40 g，5.60+4.40=10.00 g。',
          en: 'CaCO₃ → CaO + CO₂ requires counting both products. 0.100 mol CO₂×44 g/mol=4.40 g, and 5.60+4.40=10.00 g.',
        },
      },
    ],
  },
] satisfies Lesson[];
