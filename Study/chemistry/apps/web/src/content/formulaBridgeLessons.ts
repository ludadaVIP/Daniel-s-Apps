import type { LocalizedText } from '@study/shared';
import type { Lesson, LessonQuestion } from './lessons';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
function q(
  id: string,
  prompt: LocalizedText,
  options: LocalizedText[],
  answer: number,
  explanation: LocalizedText,
  concept: string,
  kind: LessonQuestion['kind'] = 'reasoning',
): LessonQuestion {
  return {
    id,
    prompt,
    options,
    answer,
    explanation,
    conceptIds: [concept],
    kind,
  };
}
const ionsReading = {
  title: t('拓展：离子组成与化学式', 'Read more: ions and compound formulas'),
  url: 'https://openstax.org/books/chemistry-2e/pages/2-6-ionic-and-molecular-compounds',
};
export const formulaBridgeLessons: Lesson[] = [
  {
    id: 'neutral-batch-simplest-formula',
    levelId: 'formulae',
    order: 111,
    nextLessonId: 'parentheses-groups-and-coefficients',
    title: t(
      '电荷已经归零，为什么还不写 Ca₄O₄？',
      'If charge is already zero, why not write Ca₄O₄?',
    ),
    eyebrow: t(
      '化学式衔接 1/2 · 电中性、最简比与整批数量',
      'Formula bridge 1/2 · Neutrality, simplest ratio and batch size',
    ),
    hook: t(
      '一张清单有 4 个 Ca²⁺ 和 4 个 O²⁻。总电荷明明是 0，为什么氧化钙仍写 CaO？这 8 个离子去了哪里？',
      'An inventory has four Ca²⁺ and four O²⁻ ions. Its total charge is zero, so why is calcium oxide still written CaO? Where did the eight ions go?',
    ),
    hookHint: t(
      '化学式记录最简组成比，整批清单记录实际数了几个。把比约简不等于丢掉清单里的离子。',
      'A formula gives a simplest composition ratio; a batch inventory counts how many ions you listed. Reducing a ratio does not discard ions.',
    ),
    bigIdea: t(
      '对本课指定的单原子离子化合物，先检查总电荷，再约简离子个数比；化学式单位与整批数量分开记录。',
      'For the specified monatomic-ion compounds, check charge, then reduce the ion-count ratio; record formula units separately from whole-batch counts.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🧂',
        title: t(
          '一粒盐不只一对离子',
          'A grain of salt has more than one ion pair',
        ),
        body: t(
          'NaCl 记录 Na⁺:Cl⁻ 为 1:1，不表示整粒盐只有两个离子，也不把晶体切成一个个独立 NaCl 分子。',
          'NaCl gives Na⁺:Cl⁻ as 1:1. It does not say an entire grain contains only two ions or partition a crystal into discrete NaCl molecules.',
        ),
      },
      {
        icon: '📋',
        title: t(
          '清单放大，组成不变',
          'A larger inventory keeps the composition',
        ),
        body: t(
          '2 个 Mg²⁺ 配 4 个 Cl⁻ 与 1 个 Mg²⁺ 配 2 个 Cl⁻，都符合 1:2；前一批数量加倍，化学式仍为 MgCl₂。',
          'Two Mg²⁺ with four Cl⁻ and one Mg²⁺ with two Cl⁻ share the 1:2 ratio. The first batch is twice as large; the formula stays MgCl₂.',
        ),
      },
      {
        icon: '💎',
        title: t('2 与 3 都不能少', 'Both two and three matter'),
        body: t(
          '题设 Al³⁺、O²⁻ 需要 2:3 才给出 +6 与 −6。1:1 虽然已最简，却没有归零；数量小不等于组成正确。',
          'The given Al³⁺ and O²⁻ need 2:3 to give +6 and −6. A 1:1 ratio is simplest but charged; small counts alone do not make the composition correct.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '第一问：这批总电荷是多少？',
          'First: what is the net charge of this batch?',
        ),
        body: t(
          '按“离子个数 × 每个离子的带符号电荷”相加。4 个 Ca²⁺ 和 4 个 O²⁻ 给 4×(+2)+4×(−2)=0。不能只比较正、负离子的个数；电荷大小也要乘进去。',
          'Add count × signed charge for each ion type. Four Ca²⁺ and four O²⁻ give 4×(+2)+4×(−2)=0. Comparing ion counts alone misses the size of each ion’s charge.',
        ),
      },
      {
        title: t(
          '第二问：个数比还能同时约简吗？',
          'Second: can both ion counts still be reduced?',
        ),
        body: t(
          '4:4 同时除以 4，得到 1:1。因此这批有 4 个 CaO 化学式单位的组成，标准最简式是 CaO。化学式单位是一种组成计数单位，不保证存在对应的独立小分子。',
          'Divide 4:4 by four to get 1:1. This batch represents four CaO formula units, and the standard simplest formula is CaO. A formula unit counts composition; it need not be a discrete molecule.',
        ),
      },
      {
        title: t(
          '两问独立，别用一个代替另一个',
          'Keep the two checks independent',
        ),
        body: t(
          '1 Mg²⁺ 配 1 Cl⁻ 是最简比，但总电荷 +1；2 Mg²⁺ 配 4 Cl⁻ 是电中性的批量，但不是最简比。前者需改变候选配比，后者只需把组成比与批量分开记录。',
          'One Mg²⁺ with one Cl⁻ is simplest but has charge +1. Two Mg²⁺ with four Cl⁻ are neutral but not simplest. The first needs a different candidate ratio; the second needs separate composition and batch records.',
        ),
      },
      {
        title: t(
          '先确认化学式的种类，再决定怎样约简',
          'Identify the formula type before reducing anything',
        ),
        body: t(
          '这里约简指定离子的个数比，不是删除原子。分子式 H₂O₂ 要保留一个分子的真实原子数，不能改成 HO。多原子离子的内部组成也不能拆改；下一课会用 Li₂O₂ 检查这个边界。',
          'Here we reduce counts of specified ions, not delete atoms. Molecular H₂O₂ retains actual atoms in one molecule and cannot become HO. Keep polyatomic-ion composition intact too; the next lesson tests that boundary with Li₂O₂.',
        ),
      },
    ],
    misconception: t(
      '“电荷为零”和“个数比最简”是两项检查。约简清单中的比例不减少实际数量；化学式单位不是独立盐分子。规则也不允许把所有化学式的原子下标一概约掉。',
      'Zero charge and a simplest ratio are separate checks. Reducing an inventory ratio does not reduce its actual counts; a formula unit is not a salt molecule. Nor may every formula’s atom subscripts be reduced indiscriminately.',
    ),
    mission: t(
      '画 2 个 Mg²⁺ 与 4 个 Cl⁻ 的清单，先写总电荷，再写最简式与化学式单位数。换成 2 个 Al³⁺ 与 3 个 O²⁻ 重做，最后解释“最简”为什么还不够。',
      'Draw an inventory of two Mg²⁺ and four Cl⁻. State net charge, simplest formula and formula-unit count. Transfer to two Al³⁺ and three O²⁻, then explain why “simplest” alone is insufficient.',
    ),
    vocabulary: [
      { en: 'formula unit', zh: '化学式单位' },
      { en: 'simplest whole-number ratio', zh: '最简整数比' },
      { en: 'electrically neutral', zh: '电中性' },
      { en: 'batch inventory', zh: '整批数量清单' },
    ],
    interactive: 'ionic-ratio-batch-lab',
    resources: [
      ionsReading,
      {
        title: t(
          '拓展：分子式与最简式的区别',
          'Read more: molecular and empirical formulas',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/2-4-chemical-formulas',
      },
    ],
    learning: {
      prerequisites: [
        'ionic-formula-charge-balance',
        'reading-chemical-formulae',
      ],
      objectives: [
        t(
          '计算指定离子清单的带符号总电荷。',
          'Calculate the signed net charge of a specified ion inventory.',
        ),
        t(
          '区分电中性、最简比和整批化学式单位数。',
          'Distinguish neutrality, simplest ratio and formula-unit count.',
        ),
        t(
          '解释为何不能随意约简分子式或改动离子内部组成。',
          'Explain why molecular formulas and internal ion compositions cannot be reduced indiscriminately.',
        ),
      ],
      workedExample: {
        prompt: t(
          '2 个 Mg²⁺、4 个 Cl⁻：是否电中性？最简式与这批化学式单位数分别是什么？',
          'Two Mg²⁺ and four Cl⁻: is the batch neutral, and what are its simplest formula and formula-unit count?',
        ),
        steps: [
          t('电荷是 2×(+2)+4×(−1)=0。', 'Charge is 2×(+2)+4×(−1)=0.'),
          t(
            '离子个数比 2:4 同时除以 2，得到 1:2。',
            'Reduce the ion-count ratio 2:4 by two to obtain 1:2.',
          ),
          t(
            '每个化学式单位按组成含 1 Mg、2 Cl；这批数量是它的两倍。',
            'Each formula unit represents one Mg and two Cl; this batch has twice those counts.',
          ),
        ],
        answer: t(
          '电中性，最简式 MgCl₂，组成相当于 2 个化学式单位；并非两个独立盐分子。',
          'Neutral; simplest formula MgCl₂; composition equivalent to two formula units, not two discrete salt molecules.',
        ),
      },
      quickChecks: [
        q(
          'formula-batch-check-1',
          t(
            '4 个 Ca²⁺ 和 4 个 O²⁻ 该怎样记录？',
            'How should four Ca²⁺ and four O²⁻ be recorded?',
          ),
          [
            t('最简式 Ca₄O₄', 'Simplest formula Ca₄O₄'),
            t(
              '最简式 CaO；这批为 4 个化学式单位',
              'Simplest formula CaO; four formula units in this batch',
            ),
            t(
              '最简式 CaO；这批只剩 2 个离子',
              'Simplest formula CaO; only two ions remain',
            ),
          ],
          1,
          t(
            '1:1 是组成比；约简比不移走清单中的离子。',
            '1:1 is the composition ratio; reducing it removes no ions.',
          ),
          'formula-unit-vs-batch',
        ),
        q(
          'formula-batch-check-2',
          t(
            '1 Mg²⁺、1 Cl⁻：哪项正确？',
            'One Mg²⁺ and one Cl⁻: which statement is correct?',
          ),
          [
            t('比已最简，但总电荷 +1', 'Simplest ratio, but net charge +1'),
            t('比已最简，所以一定电中性', 'Simplest, so necessarily neutral'),
            t('总电荷 −1', 'Net charge −1'),
          ],
          0,
          t(
            '(+2)+(−1)=+1。最简比不保证电中性。',
            '(+2)+(−1)=+1. A simplest ratio need not be neutral.',
          ),
          'independent-charge-ratio',
        ),
        q(
          'formula-batch-check-3',
          t(
            '为什么不能把分子式 H₂O₂ 约成 HO？',
            'Why can molecular H₂O₂ not be reduced to HO?',
          ),
          [
            t(
              '因为分子式都必须有下标 2',
              'Every molecular formula requires subscript two',
            ),
            t('因为 H 没有个数', 'Hydrogen has no count'),
            t(
              '分子式记录每个分子的实际原子数',
              'A molecular formula records actual atom counts per molecule',
            ),
          ],
          2,
          t(
            '最简比与每个分子的组成是不同的信息。',
            'An empirical ratio and a per-molecule inventory carry different information.',
          ),
          'formula-type-scope',
        ),
      ],
      anotherWay: t(
        '把最简式想成按比例写的配方，把整批清单想成做了几份。配方约成一份不表示桌上的东西消失。但晶体不是一袋袋独立小分子，这个类比只帮助区分比与数量。',
        'Think of a simplest formula as a ratio recipe and a batch list as how many portions were counted. Writing one portion does not remove anything. A crystal is not a set of discrete molecular bags; the analogy only separates ratio from amount.',
      ),
      explainPrompt: t(
        '不看选项，解释 2 Mg²⁺ 与 4 Cl⁻ 为什么既电中性、又不是最简比。说出最简式、批量，以及“化学式单位”没有证明什么。',
        'Without options, explain why two Mg²⁺ and four Cl⁻ are neutral but not simplest. Give the formula, batch size and what a formula unit does not establish.',
      ),
    },
    questions: [
      q(
        'formula-batch-q1',
        t(
          '3 个 Ca²⁺ 和 3 个 O²⁻：哪个记录完整？',
          'Three Ca²⁺ and three O²⁻: which record is complete?',
        ),
        [
          t('总电荷 +6，Ca₃O₃', 'Net charge +6, Ca₃O₃'),
          t(
            '总电荷 0，最简式 Ca₃O₃',
            'Net charge zero, simplest formula Ca₃O₃',
          ),
          t(
            '总电荷 0，最简式 CaO，3 个化学式单位',
            'Net charge zero, simplest formula CaO, three formula units',
          ),
        ],
        2,
        t(
          '正负电荷各 6，3:3 化为 1:1；实际清单没有缩小。',
          'Positive and negative charge magnitudes are six; 3:3 reduces to 1:1 without shrinking the inventory.',
        ),
        'formula-unit-vs-batch',
        'application',
      ),
      q(
        'formula-batch-q2',
        t(
          '1 Mg²⁺ 与 3 Cl⁻ 的总电荷是多少？',
          'What is the net charge of one Mg²⁺ and three Cl⁻?',
        ),
        [t('−1', '−1'), t('0', '0'), t('+1', '+1')],
        0,
        t(
          '(+2)+3×(−1)=−1，离子个数相差多少不是总电荷的通用算法。',
          '(+2)+3×(−1)=−1; subtracting raw ion counts is not a general charge calculation.',
        ),
        'signed-ion-charge',
        'application',
      ),
      q(
        'formula-batch-q3',
        t(
          'Al³⁺ 与 O²⁻ 的哪组候选同时电中性且最简？',
          'Which Al³⁺/O²⁻ candidate is both neutral and simplest?',
        ),
        [t('1:1', '1:1'), t('2:3', '2:3'), t('4:6', '4:6')],
        1,
        t(
          '2×(+3)+3×(−2)=0，2:3 已最简。4:6 中性但只是两倍批量。',
          '2×(+3)+3×(−2)=0 and 2:3 is simplest. Neutral 4:6 is a double batch.',
        ),
        'independent-charge-ratio',
        'application',
      ),
      q(
        'formula-batch-q4',
        t(
          '清单有 6 个 Ca²⁺、4 个 N³⁻。最简式是什么？',
          'An inventory has six Ca²⁺ and four N³⁻. What is the simplest formula?',
        ),
        [t('Ca₆N₄', 'Ca₆N₄'), t('Ca₂N₃', 'Ca₂N₃'), t('Ca₃N₂', 'Ca₃N₂')],
        2,
        t(
          '电荷 +12 与 −12 归零；6:4 同除以 2 得 3:2，写 Ca₃N₂。',
          'Charges +12 and −12 cancel; dividing 6:4 by two gives 3:2, hence Ca₃N₂.',
        ),
        'reduce-ion-counts',
        'application',
      ),
      q(
        'formula-batch-q5',
        t(
          '“这批相当于 4 个 NaCl 化学式单位”说明什么？',
          'What does “this batch represents four NaCl formula units” mean?',
        ),
        [
          t(
            '晶体被分成四个独立 NaCl 分子',
            'The crystal is partitioned into four discrete NaCl molecules',
          ),
          t(
            '组成清点为 4 Na⁺ 与 4 Cl⁻，不规定独立分子边界',
            'The composition counts four Na⁺ and four Cl⁻ without defining molecular boundaries',
          ),
          t('每个 Na⁺ 电荷变成 +4', 'Each Na⁺ now has charge +4'),
        ],
        1,
        t(
          '化学式单位是组成计数单位；离子的电荷和晶体结构不会由计数说法改变。',
          'Formula units count composition; the counting statement changes neither ion charges nor crystal structure.',
        ),
        'formula-unit-not-molecule',
      ),
      q(
        'formula-batch-q6',
        t(
          '有人说“所有化学式都应把原子下标约成最简”。哪条反例成立？',
          'Someone says every formula must reduce all atom subscripts. Which counterexample works?',
        ),
        [
          t(
            'H₂O₂ 是分子式，要保留每个分子的 2 H 与 2 O',
            'Molecular H₂O₂ preserves two H and two O per molecule',
          ),
          t('NaCl 应改为 Na₂Cl₂', 'NaCl should become Na₂Cl₂'),
          t('所有离子的电荷都为零', 'Every ion has zero charge'),
        ],
        0,
        t(
          '分子式记录真实的每分子原子数；先识别所表达的信息，再谈约简。',
          'Molecular formulas preserve per-molecule atom counts; identify the information before reducing anything.',
        ),
        'formula-type-scope',
      ),
    ],
  },
  {
    id: 'parentheses-groups-and-coefficients',
    levelId: 'formulae',
    order: 112,
    nextLessonId: 'what-is-a-chemical-reaction',
    title: t(
      '括号外的 3，和最前面的 2，分别乘哪里？',
      'What does the outside 3 multiply, and what does the leading 2 multiply?',
    ),
    eyebrow: t(
      '化学式衔接 2/2 · 整份、离子组与内部原子',
      'Formula bridge 2/2 · Whole units, ion groups and atoms within',
    ),
    hook: t(
      '2Al₂(SO₄)₃ 中，氧该算 2×4、3×4，还是 2×3×4？铝也乘括号外的 3 吗？',
      'In 2Al₂(SO₄)₃, should oxygen be 2×4, 3×4 or 2×3×4? Does the outside 3 multiply aluminium too?',
    ),
    hookHint: t(
      '从外到内分三层：前方系数管整份，括号外下标管整组，离子内部下标只管对应元素。',
      'Read three levels: a leading coefficient covers the whole, an outside subscript covers its group, and an internal subscript covers its element.',
    ),
    bigIdea: t(
      '先按整组离子读组成，再乘化学式单位数，最后合并同种元素；外层数量不能改写离子内部配方。',
      'Read whole-ion composition, multiply by formula-unit count, then add like-element contributions; outer counts do not rewrite an ion’s internal recipe.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '🔎',
        title: t('氢氧化镁的括号', 'Parentheses in magnesium hydroxide'),
        body: t(
          'Mg(OH)₂ 中有两组 OH⁻ 的组成，每组 1 O、1 H，所以一份共 2 O、2 H。MgOH₂ 的写法只把 H 数成 2，含义不同。',
          'Mg(OH)₂ represents two hydroxide groups, each with one O and one H, totalling two of each per unit. MgOH₂ would count only H twice and means something different.',
        ),
      },
      {
        icon: '🧩',
        title: t('两个位置都有氮', 'Nitrogen appears in two places'),
        body: t(
          'NH₄NO₃ 由 NH₄⁺ 与 NO₃⁻ 组成。统计原子时两处 N 相加得 2；统计离子时仍是一个铵离子和一个硝酸根。',
          'NH₄NO₃ contains NH₄⁺ and NO₃⁻. Add their N atoms to obtain two per unit, while ion counts remain one ammonium and one nitrate.',
        ),
      },
      {
        icon: '📌',
        title: t('不能把过氧根约没了', 'Do not reduce peroxide away'),
        body: t(
          '题设 Li⁺ 与 O₂²⁻ 配成 Li₂O₂。2:1 的离子个数比已最简；O₂²⁻ 内部的两个 O 不能约成单原子 O²⁻。',
          'Given Li⁺ and O₂²⁻ form Li₂O₂ with an already simplest 2:1 ion ratio. Its two internal O atoms cannot be reduced to monatomic O²⁻.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先把给定多原子离子作为整组',
          'Start with each supplied polyatomic ion as a whole',
        ),
        body: t(
          '本课直接给出 OH⁻、NO₃⁻、SO₄²⁻、NH₄⁺ 和 O₂²⁻ 的组成与电荷。右上角电荷属于整组，不属于每个 O、H 或 N。先数有几组，再清点组内原子。',
          'This lesson supplies the compositions and charges of OH⁻, NO₃⁻, SO₄²⁻, NH₄⁺ and O₂²⁻. A superscript charge belongs to its whole ion, not each O, H or N. Count ions before counting atoms within them.',
        ),
      },
      {
        title: t(
          '括号外下标只作用于括号内',
          'An outside subscript covers only its parentheses',
        ),
        body: t(
          'Al₂(SO₄)₃ 每化学式单位有 2 Al³⁺、3 SO₄²⁻，所以有 2 Al、3 S、12 O。括号外的 3 不乘左边 Al₂；SO₄ 里的 4 不乘 S。',
          'Al₂(SO₄)₃ represents two Al³⁺ and three SO₄²⁻ per unit, so it contains two Al, three S and twelve O. The outside 3 does not multiply Al₂; the internal 4 does not multiply S.',
        ),
      },
      {
        title: t(
          '前方系数再乘整份组成',
          'Then the leading coefficient multiplies the whole composition',
        ),
        body: t(
          '2Al₂(SO₄)₃ 把整份清单加倍：4 Al³⁺、6 SO₄²⁻；原子为 4 Al、6 S、24 O。离子电荷仍各为 +3 与 −2，不变成 +6 与 −4。',
          '2Al₂(SO₄)₃ doubles the entire inventory: four Al³⁺ and six SO₄²⁻, giving four Al, six S and twenty-four O atoms. Individual ion charges remain +3 and −2, not +6 and −4.',
        ),
      },
      {
        title: t(
          '最后合并元素，但不拆改离子',
          'Add like elements without rewriting the ions',
        ),
        body: t(
          '2NH₄NO₃ 的氮来自两种离子：2×1×1 + 2×1×1 = 4；氢为 8，氧为 6。Li₂O₂ 则保留 O₂²⁻ 内部组成。展开计数清单不表示发生反应、断键或溶解。',
          'Nitrogen in 2NH₄NO₃ comes from both ions: 2×1×1 + 2×1×1 = 4; hydrogen is eight and oxygen six. Li₂O₂ preserves internal peroxide composition. Expanding a counting list is not a reaction, bond breaking or dissolution.',
        ),
      },
    ],
    misconception: t(
      '括号不是装饰，电荷不是原子数，化学式单位不是盐分子。约简离子个数比时必须保留离子身份；即使全部原子数可约，也不能把 Li₂O₂ 改写成 LiO 作为该离子化合物的化学式。',
      'Parentheses are not decoration, charge is not atom count, and a formula unit is not a salt molecule. Preserve ion identities when reducing ion counts; even though its atom totals reduce, Li₂O₂ must not become LiO as the formula of this ionic compound.',
    ),
    mission: t(
      '不看例题，给 3Ca(NO₃)₂ 画三层清单，写出离子与每种原子总数。再换 2NH₄NO₃，指出两处氮各贡献多少。只用纸笔或屏幕，不需要接触这些物质。',
      'Without the worked example, draw a three-level inventory for 3Ca(NO₃)₂ and total ions and each atom type. Transfer to 2NH₄NO₃ and locate both nitrogen contributions. Use paper or screen; no substances are needed.',
    ),
    vocabulary: [
      { en: 'polyatomic ion', zh: '多原子离子' },
      { en: 'parentheses', zh: '括号' },
      { en: 'scope of a subscript', zh: '下标的作用范围' },
      { en: 'internal composition', zh: '内部组成' },
      { en: 'peroxide ion', zh: '过氧根离子' },
    ],
    interactive: 'polyatomic-three-level-lab',
    resources: [ionsReading],
    learning: {
      prerequisites: [
        'neutral-batch-simplest-formula',
        'polyatomic-ions-parentheses',
      ],
      objectives: [
        t(
          '按系数、离子个数和内部组成三层计算。',
          'Calculate using coefficient, ion count and internal composition.',
        ),
        t(
          '合并不同离子中同种元素的原子贡献。',
          'Add contributions of the same element from different ions.',
        ),
        t(
          '解释为何约简离子个数时必须保留离子身份。',
          'Explain why reducing ion counts must preserve ion identities.',
        ),
      ],
      workedExample: {
        prompt: t(
          '2Al₂(SO₄)₃ 有多少个 Al³⁺、SO₄²⁻？Al、S、O 原子各多少？',
          'How many Al³⁺ and SO₄²⁻, and how many Al, S and O atoms, are represented by 2Al₂(SO₄)₃?',
        ),
        steps: [
          t(
            '一份组成：2 Al³⁺、3 SO₄²⁻；每个 SO₄²⁻ 含 1 S、4 O。',
            'One unit represents two Al³⁺ and three SO₄²⁻; each sulfate contains one S and four O.',
          ),
          t(
            '前方系数 2 乘整份，得 4 Al³⁺ 与 6 SO₄²⁻。',
            'The leading two multiplies the whole, giving four Al³⁺ and six sulfate ions.',
          ),
          t(
            'Al = 2×2×1=4；S = 2×3×1=6；O = 2×3×4=24。电荷 4×(+3)+6×(−2)=0。',
            'Al = 2×2×1=4; S = 2×3×1=6; O = 2×3×4=24. Charge is 4×(+3)+6×(−2)=0.',
          ),
        ],
        answer: t(
          '4 个 Al³⁺、6 个 SO₄²⁻；共 4 Al、6 S、24 O。计数展开没有拆开离子。',
          'Four Al³⁺ and six SO₄²⁻; four Al, six S and twenty-four O atoms. Expanding counts did not split ions.',
        ),
      },
      quickChecks: [
        q(
          'formula-groups-check-1',
          t(
            'Mg(OH)₂ 的括号外 2 乘哪里？',
            'What does the outside 2 in Mg(OH)₂ multiply?',
          ),
          [
            t('只乘 H', 'Only H'),
            t('连 Mg 也乘 2', 'Mg as well'),
            t(
              '整组 OH，因此 O 与 H 都乘 2',
              'The whole OH group, multiplying both O and H',
            ),
          ],
          2,
          t(
            '括号明确下标范围；Mg 在括号外，不受这个 2 影响。',
            'Parentheses define scope; Mg is outside this subscript’s group.',
          ),
          'parenthesis-scope',
        ),
        q(
          'formula-groups-check-2',
          t('2Al₂(SO₄)₃ 的氧原子总数？', 'Total O atoms in 2Al₂(SO₄)₃?'),
          [t('24', '24'), t('12', '12'), t('8', '8')],
          0,
          t(
            '2 份 × 每份 3 个硫酸根 × 每根 4 个 O = 24。',
            'Two units × three sulfate ions per unit × four O per sulfate = 24.',
          ),
          'coefficient-group-internal',
          'application',
        ),
        q(
          'formula-groups-check-3',
          t(
            '为什么 Li₂O₂ 不能按此处离子组成改写为 LiO？',
            'Why can Li₂O₂ not become LiO for these specified ions?',
          ),
          [
            t('所有下标 2 都不能约', 'No subscript two may ever reduce'),
            t(
              '2 Li⁺ : 1 O₂²⁻ 已最简，须保留过氧根内部组成',
              '2 Li⁺ : 1 O₂²⁻ is simplest and must preserve internal peroxide composition',
            ),
            t('Li 的电荷是 +2', 'Li has charge +2'),
          ],
          1,
          t(
            '要约简的是离子个数比，不是 O₂²⁻ 的内部两个 O。',
            'Reduce ion counts, not the two O atoms within peroxide.',
          ),
          'preserve-polyatomic-identity',
        ),
      ],
      anotherWay: t(
        '像给有标签的清单加外框：最外框是几份，内框是每份几组，组内再写原子组成。把数字乘开只是在读清单，不是把真实离子拆散；同种元素可合计，但原来的组标签要保留。',
        'Use labelled nested lists: the outer frame counts units, inner frames count ions per unit, and each ion lists its atom composition. Expanding numbers reads an inventory; it does not dismantle real ions. Add like atoms while retaining the original group labels.',
      ),
      explainPrompt: t(
        '不看选项，解释 3Ca(NO₃)₂ 中 Ca、N、O 分别乘了哪些数，再用 NH₄NO₃ 解释为什么 N 不能只看一个位置。',
        'Without options, explain the factors for Ca, N and O in 3Ca(NO₃)₂. Then use NH₄NO₃ to explain why nitrogen must be counted in two places.',
      ),
    },
    questions: [
      q(
        'formula-groups-q1',
        t(
          '3Mg(OH)₂ 中 Mg、O、H 的原子总数依次是？',
          'What are the Mg, O and H totals in 3Mg(OH)₂?',
        ),
        [
          t('3、3、6', '3, 3, 6'),
          t('3、6、6', '3, 6, 6'),
          t('6、6、6', '6, 6, 6'),
        ],
        1,
        t(
          'Mg 为 3×1，O 和 H 各为 3×2×1。',
          'Mg is 3×1; O and H are each 3×2×1.',
        ),
        'coefficient-group-internal',
        'application',
      ),
      q(
        'formula-groups-q2',
        t(
          '2Al₂(SO₄)₃ 中有几个硫酸根离子？',
          'How many sulfate ions are represented by 2Al₂(SO₄)₃?',
        ),
        [t('24', '24'), t('3', '3'), t('6', '6')],
        2,
        t(
          '两份各有三组 SO₄²⁻，共六组。24 是氧原子数，不是硫酸根个数。',
          'Two units with three sulfate ions each give six ions. Twenty-four counts oxygen atoms, not sulfate ions.',
        ),
        'ion-vs-atom-count',
        'application',
      ),
      q(
        'formula-groups-q3',
        t(
          '2NH₄NO₃ 的 N、H、O 原子总数依次是？',
          'What are the N, H and O totals in 2NH₄NO₃?',
        ),
        [
          t('4、8、6', '4, 8, 6'),
          t('2、8、6', '2, 8, 6'),
          t('4、4、3', '4, 4, 3'),
        ],
        0,
        t(
          '每份两个不同离子各含一个 N，故 N=2×(1+1)=4；H=2×4=8，O=2×3=6。',
          'Each unit has one N in each of two ions: N=2×(1+1)=4; H=2×4=8 and O=2×3=6.',
        ),
        'add-like-elements',
        'application',
      ),
      q(
        'formula-groups-q4',
        t(
          'Ca(NO₃)₂ 与 CaNO₃₂ 按通常符号读法有什么不同？',
          'How do Ca(NO₃)₂ and CaNO₃₂ differ under ordinary notation?',
        ),
        [
          t(
            '没有不同，括号可以随便删',
            'No difference; parentheses are optional',
          ),
          t(
            '前者有 2 N、6 O；后者的 32 只接在 O 后',
            'The first has two N and six O; in the latter, 32 follows only O',
          ),
          t('前者有 2 Ca', 'The first has two Ca'),
        ],
        1,
        t(
          '括号外 2 必须乘整个 NO₃；直接删括号会改变下标的作用范围，甚至读成 O 的下标 32。',
          'The outside 2 multiplies all of NO₃; deleting parentheses changes scope and can even create subscript 32 on O.',
        ),
        'parenthesis-scope',
      ),
      q(
        'formula-groups-q5',
        t(
          '题设 Li⁺ 与 O₂²⁻ 的化学式与离子个数比是？',
          'What formula and ion-count ratio follow from given Li⁺ and O₂²⁻?',
        ),
        [
          t('LiO，1:1', 'LiO, 1:1'),
          t('Li₂O，2:1', 'Li₂O, 2:1'),
          t('Li₂O₂，2:1', 'Li₂O₂, 2:1'),
        ],
        2,
        t(
          '2×(+1)+(−2)=0；一个过氧根内部含 2 O，必须保留。Li₂O 对应的单原子氧离子身份不同。',
          '2×(+1)+(−2)=0; one peroxide ion contains two O atoms that must stay. Li₂O uses a different, monatomic oxide identity.',
        ),
        'preserve-polyatomic-identity',
        'application',
      ),
      q(
        'formula-groups-q6',
        t(
          '把 2Al₂(SO₄)₃ 展开为原子总数，说明发生了什么？',
          'What does expanding 2Al₂(SO₄)₃ into atom totals establish?',
        ),
        [
          t(
            '只展开计数清单，未说明反应、断键或溶解',
            'Only a counting expansion, not a reaction, bond breaking or dissolution',
          ),
          t(
            '硫酸根已经被分解为单独原子',
            'Sulfate ions have decomposed into separate atoms',
          ),
          t('每个铝离子的电荷加倍', 'Each aluminium ion’s charge doubled'),
        ],
        0,
        t(
          '表示法中的乘法不构成物理过程，也不改变离子电荷。',
          'Multiplication in a representation is not a physical process and does not change ion charge.',
        ),
        'counting-not-process',
      ),
    ],
  },
];
