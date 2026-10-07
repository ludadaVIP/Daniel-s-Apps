import type { LocalizedText } from '@study/shared';
import type { Lesson } from './lessons';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const thermochemistryLessons = [
  {
    id: 'coffee-cup-heat-ledger',
    levelId: 'energetics',
    order: 83,
    title: t(
      '杯子变暖了：能算出反应放了多少热吗？',
      'A warmer cup: how much heat did the reaction release?',
    ),
    eyebrow: t(
      '第 83 课 · 从温度记录到量热账本',
      'Lesson 83 · From temperature records to calorimetry',
    ),
    hook: t(
      '一小杯汤和一大锅汤，都从 25 °C 升到 32 °C。它们吸收的热量一样吗？温度计只告诉你“有多热”，没有直接告诉你“这一整份吸收了多少热”。化学家也要给反应的热量记一本账。',
      'A mug of soup and a large pot both warm from 25 °C to 32 °C. Did they gain equal amounts of heat? A thermometer reports temperature, not the energy gained by the whole batch. Chemists need an energy ledger too.',
    ),
    hookHint: t(
      '材料相同、比热容近似不变时，质量越大，同样升温需要的热量越多。本课先看虚拟记录，再把质量、升温和反应份量接起来；不需要在家配酸碱。',
      'For the same material with roughly constant specific heat, a larger mass needs more heat for the same warming. Connect mass, temperature rise and reaction amount using virtual records—not by mixing acids and bases at home.',
    ),
    bigIdea: t(
      '先用 q溶液 = mcΔT 算周围吸收的热，再在保温近似下反号得到反应热；比较不同份量的反应，还需除以反应的摩尔数。',
      'Calculate the solution’s heat with q = mcΔT, then reverse its sign under the insulated-cup approximation. Divide by reacted moles to compare batch sizes.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🥣',
        title: t(
          '一杯与一锅：同温度，不同热量',
          'Mug versus pot: equal temperature, different heat',
        ),
        body: t(
          '同种汤、相同升温，大锅通常需要更多热量。比较加热所需能量，不能只盯着温度计，还得问“加热了多少汤？”汤的材料组成也会影响比热容，所以本课先控制材料相同。',
          'For the same soup and temperature rise, a larger pot needs more heat. Ask how much soup was heated, not just what the thermometer reads. Composition also affects specific heat, so hold the material constant first.',
        ),
      },
      {
        icon: '🧤',
        title: t(
          '暖手包：反应失去，周围得到',
          'Hand warmer: reaction loses, surroundings gain',
        ),
        body: t(
          '放热反应把能量传给周围。若把化学变化记为系统，把溶液记为接收方，溶液的 q 为正，反应的 q 为负。不要因为周围变暖，就把反应热也写成正数。',
          'An exothermic reaction transfers energy to its surroundings. With chemical change as the system and solution as the receiver, solution q is positive and reaction q negative. A warmer receiver does not make reaction heat positive.',
        ),
      },
      {
        icon: '🧊',
        title: t(
          '保温杯：漏出去的热也得入账',
          'Insulation: escaped heat still belongs in the ledger',
        ),
        body: t(
          '量热杯减少向外传热，却不能消除所有误差。杯子自身也可能吸热。如果只数溶液吸收的热，会漏掉其他接收方；模型中的 C 记录专门展示这个问题。',
          'A calorimeter reduces outside heat transfer, not every error. The cup can absorb heat too. Counting only the solution may miss other receivers; virtual record C demonstrates this issue.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '第一步：把温度与份量放在一起',
          'Step 1: pair warming with batch size',
        ),
        body: t(
          'q = mcΔT。m 用 g，c 用 J/(g °C)，ΔT = 结束温度 − 开始温度，用 °C，得到 q 的单位 J。比热容 c 表示让 1 g 材料升温 1 °C 所需的热量；稀水溶液在本课近似为 4.18。两份各 50 mL 溶液混合，密度近似 1.00 g/mL，总质量是 100 g，不是 50 g。',
          'In q = mcΔT, use m in g, c in J/(g °C), and ΔT = final minus initial temperature in °C, giving q in J. Specific heat is the heat needed to warm 1 g by 1 °C; here dilute aqueous solution uses 4.18. Two 50 mL portions at density 1.00 g/mL give 100 g, not 50 g.',
        ),
      },
      {
        title: t('例题：给 A 记录记账', 'Worked example: record A’s ledger'),
        body: t(
          'A 从 25.0 升到 31.8 °C，ΔT = 6.8 °C。q溶液 = 100 × 4.18 × 6.8 = +2842.4 J，约 +2.842 kJ。忽略杯子吸热与外界传热时，q反应 ≈ −2.842 kJ。两份溶液均为 1.00 mol/L，HCl 与 NaOH 按 1∶1 反应，n = 1.00 × 0.0500 = 0.0500 mol。每摩尔约 −2.842÷0.0500 = −56.8 kJ/mol。这是模型记录的估计，不是所有反应的通用值。',
          'A warms from 25.0 to 31.8 °C, so ΔT = 6.8 °C. The solution gains 100 × 4.18 × 6.8 = +2842.4 J, about +2.842 kJ. Neglect cup heating and outside transfer: qreaction ≈ −2.842 kJ. Both solutions are 1.00 mol/L and react 1:1: n = 1.00 × 0.0500 = 0.0500 mol. Per mole, −2.842÷0.0500 ≈ −56.8 kJ/mol—an estimate from this model, not a universal value.',
        ),
      },
      {
        title: t(
          '第三步：比较 B 与 C，检查账本边界',
          'Step 3: compare B and C, then check the boundary',
        ),
        body: t(
          'B 的质量和反应摩尔数都翻倍，升温仍为 6.8 °C，因此总热量翻倍，每摩尔的估计相同。C 与 A 份量相同，却设定向外散热，升温只有 5.6 °C；若仍假装全部热量只进溶液，会得到偏小的放热量。恒压且只有体积功时，反应热可对应这一份反应的焓变 ΔH；测量近似与单位都要写清楚。',
          'B doubles mass and reacted moles but keeps a 6.8 °C rise: total heat doubles, not heat per mole. C has A’s batch size but modelled outside heat loss and only a 5.6 °C rise. Counting only solution heat underestimates the release magnitude. At constant pressure with only pressure–volume work, reaction heat corresponds to the batch’s enthalpy change ΔH; state approximations and units.',
        ),
      },
    ],
    misconception: t(
      '“温度升得一样，放热就一样”漏掉了质量；“放热越多，ΔH 的数值越大”忽略了负号，应比较绝对值。较小升温也不直接证明反应变弱：还需排查反应份量、比热容、杯子吸热、向外散热和温度测量。',
      'Equal warming does not mean equal heat: mass matters. More heat released means a larger magnitude, not a more positive ΔH. A small rise alone does not prove a weaker reaction; investigate amount, specific heat, cup heating, heat loss and temperature measurement.',
    ),
    mission: t(
      '记录侦探：先看 A，再比较 B 和 C。分别解释“为什么 B 的升温没翻倍”“为什么 C 不能直接代表真实反应焓变”。写下 A 的三步账本，圈出 J→kJ 换算和两份溶液的总质量。只处理虚拟数据，不做酸碱混合实验。',
      'Record detective: compare A with B and C. Explain why B’s warming does not double and why C cannot directly give the true reaction enthalpy. Write A’s three-step ledger; circle the J-to-kJ conversion and combined mass. Use virtual data only; do not mix acids and bases.',
    ),
    vocabulary: [
      { en: 'calorimetry', zh: '量热法' },
      { en: 'specific heat capacity', zh: '比热容' },
      { en: 'temperature change, ΔT', zh: '温度变化' },
      { en: 'heat, q', zh: '热量' },
      { en: 'enthalpy change, ΔH', zh: '焓变' },
      { en: 'heat loss', zh: '散热' },
    ],
    resources: [
      {
        title: t(
          'OpenStax：量热法与测量近似（英文，可选）',
          'OpenStax: calorimetry and assumptions (optional)',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/5-2-calorimetry',
      },
    ],
    interactive: 'calorimetry-ledger-lab',
    questions: [
      {
        id: 'calorimetry-q1',
        prompt: t(
          '同种溶液，质量翻倍、升温和比热容相同。溶液吸收的热量怎样变？',
          'For the same solution, mass doubles while specific heat and temperature rise stay the same. What happens to heat gained?',
        ),
        options: [
          t('翻倍', 'It doubles'),
          t('不变', 'It stays the same'),
          t('减半', 'It halves'),
        ],
        answer: 0,
        explanation: t(
          'q = mcΔT。c 和 ΔT 不变，m 翻倍，q 就翻倍。温度不是整份样品热量的直接读数。',
          'In q = mcΔT, c and ΔT stay fixed while m doubles, so q doubles. Temperature is not a direct reading of the whole batch’s heat.',
        ),
      },
      {
        id: 'calorimetry-q2',
        prompt: t(
          'A 的两份溶液各 50 mL，密度近似 1.00 g/mL，体积可相加。应取多少总质量？',
          'A combines two 50 mL portions at density 1.00 g/mL with additive volumes. Which total mass belongs in q?',
        ),
        options: [
          t('50 g，只算盐酸', '50 g: only HCl solution'),
          t('100 g，算全部混合溶液', '100 g: all the mixed solution'),
          t('1 g，因为密度是 1', '1 g: density is one'),
        ],
        answer: 1,
        explanation: t(
          '总体积是 50+50=100 mL，总质量约 100 g。温度计读的是混合溶液的温度，要给整个接收热量的溶液记账。',
          'The total is 50+50=100 mL and approximately 100 g. The thermometer reads the mixture, so count the whole heat-receiving solution.',
        ),
      },
      {
        id: 'calorimetry-q3',
        prompt: t(
          '理想保温近似下，溶液吸收 +2.842 kJ。对应的反应热是多少？',
          'Under the insulated-cup approximation, the solution gains +2.842 kJ. What is the reaction heat?',
        ),
        options: [
          t('+2.842 kJ', '+2.842 kJ'),
          t('0 kJ', '0 kJ'),
          t('−2.842 kJ', '−2.842 kJ'),
        ],
        answer: 2,
        explanation: t(
          '忽略杯子与外界时，q反应 + q溶液 = 0。溶液得到能量，反应失去能量，所以反应热为负，表示放热。',
          'Neglecting the cup and outside transfer, qreaction + qsolution = 0. The solution gains energy as the reaction loses it; negative reaction heat indicates exothermic change.',
        ),
      },
      {
        id: 'calorimetry-q4',
        prompt: t(
          'A 放热约 2.842 kJ，反应份量为 0.0500 mol。每摩尔的焓变估计约是多少？',
          'A releases about 2.842 kJ for 0.0500 mol reacted. What is the estimated enthalpy change per mole?',
        ),
        options: [
          t('−56.8 kJ/mol', '−56.8 kJ/mol'),
          t('−0.142 kJ/mol', '−0.142 kJ/mol'),
          t('+56.8 kJ/mol', '+56.8 kJ/mol'),
        ],
        answer: 0,
        explanation: t(
          '保留反应热的负号，再除以摩尔数：−2.842÷0.0500≈−56.8 kJ/mol。乘以 0.0500 不能把这一份热量换成每摩尔。',
          'Keep the negative reaction sign, then divide by reacted moles: −2.842÷0.0500≈−56.8 kJ/mol. Multiplying by 0.0500 does not convert batch heat to heat per mole.',
        ),
      },
      {
        id: 'calorimetry-q5',
        prompt: t(
          'C 明确设定一部分热传到外界。如果只用溶液升温计算放热量，有什么问题？',
          'C explicitly loses some heat to the outside. What happens if you count only solution warming?',
        ),
        options: [
          t(
            '自动得到准确的反应热',
            'You automatically get exact reaction heat',
          ),
          t(
            '漏掉其他接收方，放热量绝对值偏小',
            'You miss other receivers and underestimate release magnitude',
          ),
          t('能量不再守恒', 'Energy stops being conserved'),
        ],
        answer: 1,
        explanation: t(
          '能量仍守恒，只是账本不完整。溶液不是唯一接收方；需要考虑外界以及可能的杯子吸热，不能把表观估计当作已校正的真实值。',
          'Energy is conserved; the ledger is incomplete. Account for outside transfer and possible cup heating, rather than treating the apparent estimate as corrected truth.',
        ),
      },
      {
        id: 'calorimetry-q6',
        prompt: t(
          '100 g 溶液，c = 4.18 J/(g °C)，从 30.0 降到 25.0 °C。q溶液是多少？',
          'A 100 g solution with c = 4.18 J/(g °C) cools from 30.0 to 25.0 °C. What is qsolution?',
        ),
        options: [
          t('+2090 J', '+2090 J'),
          t('−20.9 J', '−20.9 J'),
          t('−2090 J', '−2090 J'),
        ],
        answer: 2,
        explanation: t(
          'ΔT = 25.0−30.0 = −5.0 °C，q = 100×4.18×(−5.0) = −2090 J。负号表示这份溶液失去热量，不是负的温度。',
          'ΔT = 25.0−30.0 = −5.0 °C, so q = 100×4.18×(−5.0) = −2090 J. The negative sign means the solution loses heat, not that its temperature is negative.',
        ),
      },
    ],
  },
  {
    id: 'hess-law-energy-routes',
    levelId: 'energetics',
    order: 84,
    title: t(
      '能量也有路线图：绕路会改变终点差吗？',
      'Energy routes: does a detour change the endpoint difference?',
    ),
    eyebrow: t(
      '第 84 课 · 用方程式拼出赫斯定律',
      'Lesson 84 · Build Hess’s law with equation puzzles',
    ),
    hook: t(
      '从山脚到山顶，走直路或绕小径，最后的海拔差一样，但走路耗力未必一样。化学也有一种只看起点与终点的“高度差”：焓变。能不能借两段已知路线，算出一段难直接测量的反应？',
      'From valley to summit, direct and winding paths have the same elevation difference, though walking effort may differ. Chemistry has an endpoint-only “height difference”: enthalpy change. Can two known routes reveal a reaction difficult to measure directly?',
    ),
    hookHint: t(
      '这个类比只对应“海拔差”，不对应行走耗能。赫斯定律要求起点和终点的物质、份量及状态相同；把反应方程式正确相加，就能把对应的焓变相加。',
      'The analogy is elevation difference, not walking effort. Hess’s law requires matching substances, amounts and states at the endpoints; add properly combined equations and their corresponding enthalpy changes.',
    ),
    bigIdea: t(
      '相同起点与终点的总 ΔH 不依赖路线。方程式反向，ΔH 变号；方程式倍乘，ΔH 同样倍乘；相加时只消去两边相同的物质与份量。',
      'Total ΔH between identical endpoints does not depend on the route. Reverse an equation and reverse ΔH’s sign; multiply both together; cancel only matching quantities on opposite sides.',
    ),
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🗺️',
        title: t('地图：差值与路程不同', 'Maps: difference is not distance'),
        body: t(
          '海拔差可以把每段升降相加，绕路不改变最终高度差。但步数、时间、摩擦耗能可能随路线改变。化学里的焓变不是反应时间，也不是活化能；这三件事必须分开。',
          'Add each ascent and descent to find elevation difference; detours do not change the endpoints. Steps, time and friction losses can differ. Enthalpy change is neither reaction time nor activation energy.',
        ),
      },
      {
        icon: '🧾',
        title: t(
          '收据：中间转账不能重复记',
          'Receipts: avoid double-counting transfers',
        ),
        body: t(
          '一步生成 CO，下一步恰好消耗同量 CO，总反应没有净生成 CO。它像在两张收据间转手的项目：消去的是账面上的中间物质，不代表它从未存在过。CO 有毒，这里只用虚拟方程式。',
          'If one step forms CO and another consumes the same amount, the net reaction does not produce CO. Like an item transferred between receipts, cancellation does not mean it never existed. CO is toxic; use virtual equations only.',
        ),
      },
      {
        icon: '💧',
        title: t(
          '水的物态：终点也要核对',
          'Water’s phase: check the endpoint too',
        ),
        body: t(
          '液态水和水蒸气并不是同一个能量终点。若一个反应生成液态水，另一个生成水蒸气，就不能说“都是水，焓变一样”；需要把相变那一段也加入账本。',
          'Liquid water and water vapour are different energy endpoints. Do not assume reactions yielding different phases have identical enthalpy changes; include the phase-change contribution.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '第一步：把端点和条件写完整',
          'Step 1: write complete endpoints and conditions',
        ),
        body: t(
          '模型使用 25 °C 标准态取整数据，C 为石墨。目标是 C(s) + O₂(g) → CO₂(g)。旁边的 kJ 对应按这条方程式所写份量反应的焓变；系数 1 对应 1 mol，不是一个粒子。不同温度、压强、物态或碳的结构，不能随便当作同一端点。',
          'Use rounded standard-state data at 25 °C, with carbon as graphite. The target is C(s) + O₂(g) → CO₂(g). Its kJ value refers to the molar amounts in the whole equation: coefficient one means 1 mol, not one particle. Do not substitute different temperatures, pressures, phases or carbon structures.',
        ),
      },
      {
        title: t(
          '例题：两张反应收据拼成一张',
          'Worked example: combine two reaction receipts',
        ),
        body: t(
          '第一步：C(s) + ½O₂(g) → CO(g)，ΔH° = −111 kJ。第二步：CO(g) + ½O₂(g) → CO₂(g)，ΔH° = −283 kJ。一边生成、一边消耗的 1 mol CO 抵消；两份 ½O₂ 合成 O₂，得到目标。因此 ΔH° = −111+(−283) = −394 kJ。负号表示总过程放热；这是取整值。',
          'Step 1: C(s) + ½O₂(g) → CO(g), ΔH° = −111 kJ. Step 2: CO(g) + ½O₂(g) → CO₂(g), ΔH° = −283 kJ. Cancel the 1 mol CO formed and consumed; combine the two halves of O₂. The target has ΔH° = −111+(−283) = −394 kJ, a rounded exothermic value.',
        ),
      },
      {
        title: t(
          '第三步：反向与倍乘，两本账一起改',
          'Step 3: reverse or scale both ledgers together',
        ),
        body: t(
          '目标若是 CO₂(g) → C(s) + O₂(g)，两步都反向，总 ΔH° = +394 kJ。目标若是 2C(s)+2O₂(g) → 2CO₂(g)，两步都乘 2，总 ΔH° = −788 kJ。只改数字、不改方程式，或只翻转一步就宣布得到目标，都不正确。假想计算路线不保证是反应的真实机理。',
          'For CO₂(g) → C(s) + O₂(g), reverse both steps: +394 kJ. For 2C(s)+2O₂(g) → 2CO₂(g), double both: −788 kJ. Changing heat numbers without equations, or reversing only one step and declaring a target match, is invalid. A calculation route need not be the actual mechanism.',
        ),
      },
    ],
    misconception: t(
      '“CO 出现两次，就能删掉”不对：它们必须在两边，且只能抵消相等份量。催化剂改变活化能和速率，不改变同样端点之间的焓变。赫斯定律也不能保证反向反应会自动发生。',
      'CO cannot be deleted just because it appears twice: cancel only equal amounts on opposite sides. Catalysts change barriers and rates, not ΔH between unchanged endpoints. Hess’s law does not guarantee spontaneous reversal.',
    ),
    mission: t(
      '路线拼图：把默认错误路线修成“正向一份”，再拼“反向一份”和“正向两份”。每次先核对 C、O₂、CO、CO₂ 的净份量，再核对焓变。在纸上写出反向方程式，解释为什么 +394 kJ 不能说明 CO₂ 会自行分解。只计算，不做燃烧或制气实验。',
      'Route puzzle: repair the initial incorrect route for one forward batch, then build one reverse batch and two forward batches. Check net species amounts before ΔH. Write the reverse equation and explain why +394 kJ does not imply spontaneous CO₂ decomposition. Calculate only; no combustion or gas preparation.',
    ),
    vocabulary: [
      { en: 'Hess’s law', zh: '赫斯定律' },
      { en: 'state function', zh: '状态函数' },
      { en: 'intermediate', zh: '中间物质' },
      { en: 'reverse an equation', zh: '将方程式反向' },
      { en: 'standard state', zh: '标准态' },
      { en: 'graphite', zh: '石墨' },
    ],
    resources: [
      {
        title: t(
          'OpenStax：焓与赫斯定律（英文，可选）',
          'OpenStax: enthalpy and Hess’s law (optional)',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/5-3-enthalpy',
      },
    ],
    interactive: 'hess-route-lab',
    questions: [
      {
        id: 'hess-q1',
        prompt: t(
          '同温度、压强下，两端的物质、份量、物态均相同。总焓变取决于计算路线吗？',
          'With matching substances, amounts and phases at the same temperature and pressure, does total ΔH depend on the calculation route?',
        ),
        options: [
          t('不取决于路线', 'No'),
          t('步骤越多，ΔH 一定越大', 'More steps always mean a larger ΔH'),
          t('只取决于催化剂颜色', 'Only on the catalyst’s colour'),
        ],
        answer: 0,
        explanation: t(
          '焓是状态函数，每段焓变相加得到同一端点差值。这不意味着每条路线的速度、机理或活化能也相同。',
          'Enthalpy is a state function: step changes sum to the same endpoint difference. Rates, mechanisms and activation barriers can still differ.',
        ),
      },
      {
        id: 'hess-q2',
        prompt: t(
          '匹配的两步焓变为 −111 与 −283 kJ。总 ΔH 是多少？',
          'Two matching steps have ΔH values −111 and −283 kJ. What is the total?',
        ),
        options: [
          t('+394 kJ', '+394 kJ'),
          t('−394 kJ', '−394 kJ'),
          t('−172 kJ', '−172 kJ'),
        ],
        answer: 1,
        explanation: t(
          '按符号相加：−111+(−283)=−394 kJ。两步都放热，总过程放热，不是把两个绝对值相减。',
          'Add signed values: −111+(−283)=−394 kJ. Both steps release heat; do not subtract their magnitudes.',
        ),
      },
      {
        id: 'hess-q3',
        prompt: t(
          'C(s)+O₂(g)→CO₂(g) 的 ΔH° 为 −394 kJ。整条方程式反向后是多少？',
          'C(s)+O₂(g)→CO₂(g) has ΔH° = −394 kJ. What is ΔH° for the entire reverse equation?',
        ),
        options: [
          t('−394 kJ', '−394 kJ'),
          t('0 kJ', '0 kJ'),
          t('+394 kJ', '+394 kJ'),
        ],
        answer: 2,
        explanation: t(
          '反向交换起点和终点，差值变号。正向失去 394 kJ，反向相应增加 394 kJ；这不判断反应能否自行发生。',
          'Reversal swaps endpoints and changes the sign. The forward change loses 394 kJ; the reverse gains it. This does not decide spontaneity.',
        ),
      },
      {
        id: 'hess-q4',
        prompt: t(
          '把目标方程式所有系数乘 2，原 ΔH° = −394 kJ 怎样改？',
          'Double all coefficients in the target equation. What happens to its original ΔH° = −394 kJ?',
        ),
        options: [
          t('−788 kJ', '−788 kJ'),
          t('仍为 −394 kJ', 'Still −394 kJ'),
          t('+788 kJ', '+788 kJ'),
        ],
        answer: 0,
        explanation: t(
          '反应份量翻倍，总焓变也翻倍：2×(−394)=−788 kJ。倍乘不反转放热方向；每摩尔的对应值不因此翻倍。',
          'Doubling amounts doubles total enthalpy: 2×(−394)=−788 kJ. Scaling does not reverse heat flow; the corresponding per-mole value does not double.',
        ),
      },
      {
        id: 'hess-q5',
        prompt: t(
          '一步生成 1 mol CO，另一步消耗 2 mol CO。相加后如何处理 CO？',
          'One step produces 1 mol CO; another consumes 2 mol CO. What remains in the net equation?',
        ),
        options: [
          t('全部 CO 消失', 'All CO disappears'),
          t(
            '抵消 1 mol，反应物侧剩 1 mol CO',
            'Cancel 1 mol; 1 mol CO remains as a reactant',
          ),
          t('产物侧剩 3 mol CO', '3 mol CO remain as a product'),
        ],
        answer: 1,
        explanation: t(
          '只能抵消相等份量。生成的 1 mol 与消耗的 1 mol 配对后，还需消耗 1 mol CO。删掉所有 CO 会改变反应，不能得到声称的目标。',
          'Only equal amounts cancel. Pair the 1 mol produced with 1 mol consumed; the remaining 1 mol is still consumed. Deleting all CO would change the reaction and falsely claim a target match.',
        ),
      },
      {
        id: 'hess-q6',
        prompt: t(
          '催化剂加快同一反应，端点状态不变。哪项判断正确？',
          'A catalyst speeds up the same reaction without changing endpoint states. Which claim is correct?',
        ),
        options: [
          t('ΔH 一定变为 0', 'ΔH must become zero'),
          t('放热必变吸热', 'Exothermic must become endothermic'),
          t(
            '活化能可改变，ΔH 不变',
            'The activation barrier can change; ΔH does not',
          ),
        ],
        answer: 2,
        explanation: t(
          '催化剂提供另一条反应途径，改变能垒和速率。端点相同，焓差不变；“跨过山坡的难度”不同于“起终点高度差”。',
          'A catalyst offers another pathway with a different barrier and rate. Unchanged endpoints mean unchanged enthalpy difference; crossing difficulty is not elevation difference.',
        ),
      },
    ],
  },
] satisfies Lesson[];
