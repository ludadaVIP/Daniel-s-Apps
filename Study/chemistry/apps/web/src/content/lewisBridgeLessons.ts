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
const reading = {
  title: t(
    '拓展：Lewis 电子符号与结构',
    'Read more: Lewis symbols and structures',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/7-3-lewis-symbols-and-structures',
};
export const lewisBridgeLessons: Lesson[] = [
  {
    id: 'shared-electrons-count-once',
    levelId: 'bonding',
    order: 109,
    nextLessonId: 'lewis-budget-before-octets',
    title: t(
      '共享电子两边都能数，整体就多了一对吗？',
      'If both atoms count a shared pair, does the whole gain another pair?',
    ),
    eyebrow: t(
      '共价键衔接 1/2 · 整体库存与局部检查',
      'Covalent bridge 1/2 · Whole inventory and local checks',
    ),
    hook: t(
      '水分子的氧在局部检查中数到 8，每个氢数到 2。8+2+2=12，为什么给定价电子预算却只有 8？电子被变多了吗？',
      'In water, oxygen’s local check counts eight and each hydrogen counts two. Why does 8+2+2=12 while the supplied valence budget is only eight? Were electrons created?',
    ),
    hookHint: t(
      '两边局部清单可以包含同一对共享电子。清点整个分子时，不能把同一批电子重复加入库存。',
      'Both local lists can include the same shared pair. Do not add the same electrons twice to the whole molecule’s inventory.',
    ),
    bigIdea: t(
      '共享电子在整体价电子库存中只计一次，在两个相连原子的局部检查中可各计一次；两种数法不能混用。',
      'Shared electrons count once in the whole valence inventory but can appear in both bonded atoms’ local checks. Keep these two counts separate.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '💧',
        title: t('水的 8 与 12', 'Water’s eight and twelve'),
        body: t(
          '一个 O 贡献 6 个价电子，两个 H 各贡献 1，共 8。局部的 8+2+2 重复包含共享电子，并不是库存变成 12。',
          'One O supplies six valence electrons and two H one each, totalling eight. The local sum 8+2+2 overlaps shared electrons; it is not a twelve-electron inventory.',
        ),
      },
      {
        icon: '✏️',
        title: t(
          '两点和一条线是两种写法',
          'Two dots and one line are alternative notations',
        ),
        body: t(
          '一条单键线表示一对、也就是两个共享电子。把两点改画为一条线不增加或删掉电子。',
          'A single bond line represents one pair: two shared electrons. Replacing two dots with a line neither adds nor removes electrons.',
        ),
      },
      {
        icon: '📦',
        title: t(
          '价电子不是全部电子',
          'Valence electrons are not all electrons',
        ),
        body: t(
          'HCl 的给定价电子预算是 8，但中性 HCl 全部电子有 18。内层电子未画出，不表示不存在。',
          'The supplied HCl valence budget is eight, while neutral HCl has eighteen electrons in total. Omitted core electrons still exist.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先确定正在清点的范围',
          'Define which inventory you are counting',
        ),
        body: t(
          '本课只画指定中性分子的最外层价电子。每个 H 贡献 1，C 贡献 4，N 贡献 5，O 贡献 6，Cl 贡献 7；按原子个数相加，不把内层电子混进这张图。',
          'These diagrams show valence electrons of specified neutral molecules. Each H contributes one, C four, N five, O six and Cl seven. Sum by atom count without adding core electrons to this drawing.',
        ),
      },
      {
        title: t(
          '在整体里，键和孤对都要清点',
          'Count both bonds and lone pairs globally',
        ),
        body: t(
          '共享的一对算 2 个电子，孤对也每对算 2 个。水中两条单键共 4 个共享电子，氧上的两对孤对共 4 个，整体 4+4=8。',
          'A shared pair counts as two electrons; so does each lone pair. Water’s two single bonds give four shared electrons and oxygen’s two lone pairs four more: 4+4=8 globally.',
        ),
      },
      {
        title: t(
          '局部检查允许重叠，不产生新电子',
          'Local checks overlap without creating electrons',
        ),
        body: t(
          '对水的氧作局部检查时，两条 O—H 共享对和两对孤对合计 8；对每个 H 检查时，同一条共享对又计入它的局部 2。局部清单重叠，所以不能把它们相加当整体。',
          'Oxygen’s local check includes both O—H pairs plus two lone pairs, giving eight. Each H includes its same shared pair in a local count of two. Local lists overlap and cannot be added as a whole inventory.',
        ),
      },
      {
        title: t(
          '两电子与八电子目标有范围',
          'Two- and eight-electron targets have a scope',
        ),
        body: t(
          '在本课所选入门 Lewis 图中，H 的局部目标是 2，C/N/O/Cl 是 8。它们是这里的记账条件，不是所有元素、离子与分子的万能命令，也不是电子真实位置的照片。',
          'For these selected elementary Lewis diagrams, H’s local target is two and C/N/O/Cl use eight. These are accounting conditions here, not universal commands for every element, ion or molecule or photographs of electron locations.',
        ),
      },
    ],
    misconception: t(
      '“共享就是多生成一对”“一条线只代表一个电子”“局部数相加就是整体总数”都不成立。还要分清价电子总数与全部电子数。',
      'Sharing does not create another pair; one line is not one electron; overlapping local counts do not sum to the whole inventory. Also distinguish valence from all-electron totals.',
    ),
    mission: t(
      '只用纸笔或虚拟图。画给定 HCl 的一条键和 Cl 上三对孤对，分别写共享电子、孤对电子、整体价电子数；再列 H 与 Cl 的局部数，解释为什么不能把局部之和当整体。',
      'Use paper or the virtual diagram. Draw the supplied HCl bond and three lone pairs on Cl. State shared, lone-pair and whole valence counts, then H/Cl local counts and why their sum is not the whole inventory.',
    ),
    vocabulary: [
      { en: 'valence-electron inventory', zh: '价电子库存' },
      { en: 'shared pair', zh: '共享电子对' },
      { en: 'lone pair', zh: '孤电子对' },
      { en: 'overlapping local count', zh: '有重叠的局部清点' },
    ],
    interactive: 'shared-electron-inventory-lab',
    resources: [reading],
    learning: {
      prerequisites: [
        'covalent-bonding-sharing',
        'coefficients-and-molecular-subscripts',
        'neutral-atoms-before-table-position',
      ],
      objectives: [
        t(
          '分别清点共享电子、孤对电子和整体价电子。',
          'Count shared, lone-pair and whole valence electrons separately.',
        ),
        t(
          '解释局部清点为什么不能直接相加作整体。',
          'Explain why overlapping local checks cannot be summed as a whole inventory.',
        ),
        t(
          '区分价电子图与全部电子、真实几何模型。',
          'Distinguish a valence diagram from all-electron and real-geometry models.',
        ),
      ],
      workedExample: {
        prompt: t(
          '给定 H₂O 图有两条 O—H 单键，O 上有两对孤对。整体价电子多少？局部检查又怎样？',
          'A supplied H₂O diagram has two O—H single bonds and two lone pairs on O. Find its whole valence total and local checks.',
        ),
        steps: [
          t(
            '中性价电子预算：O 的 6 加两个 H 各 1，共 8。',
            'Neutral valence budget: O contributes six and two H one each, totalling eight.',
          ),
          t(
            '两条键提供 4 个共享电子，两对孤对提供 4 个，整体 8。',
            'Two bonds give four shared electrons and two lone pairs four nonbonding electrons: eight globally.',
          ),
          t(
            'O 局部 8，每个 H 局部 2；局部之和 12 包含共享电子的重复清点。',
            'O’s local count is eight and each H two; the local sum twelve includes overlapping shared-electron counts.',
          ),
        ],
        answer: t(
          '整体价电子 8；局部为 O:8、H:2、H:2。没有因为共享而多出电子。',
          'Eight valence electrons globally; local counts O:8, H:2, H:2. Sharing has created no additional electrons.',
        ),
      },
      anotherWay: t(
        '同一份资料可以被两位同学各列进“我能使用的资料”清单，但图书馆总库存不能因此增加一份。这个比喻只解释重叠清点，不解释成键力或电子运动。',
        'The same resource can appear in two students’ available-resource lists without doubling the library’s inventory. This analogy explains overlapping lists, not bonding forces or electron motion.',
      ),
      explainPrompt: t(
        '不用选项，解释水的局部 8+2+2 为什么不是 12 个价电子；再说明本图没画内层电子是否表示它们不存在。',
        'Without options, explain why water’s local 8+2+2 does not mean twelve valence electrons, and whether omitted core electrons are absent.',
      ),
      quickChecks: [
        q(
          'lewis109-check1',
          t(
            '一条单键线表示几个共享电子？',
            'How many shared electrons does a single bond line represent?',
          ),
          [t('1', '1'), t('2', '2'), t('4', '4')],
          1,
          t(
            '一条线代表一对，共两个电子。',
            'One line represents one pair: two electrons.',
          ),
          'line-vs-pair',
        ),
        q(
          'lewis109-check2',
          t(
            '两对孤对中共有几个电子？',
            'How many electrons are in two lone pairs?',
          ),
          [t('4', '4'), t('2', '2'), t('0', '0')],
          0,
          t('每对两个，2×2=4。', 'Two per pair gives 2×2=4.'),
          'lone-pair-count',
        ),
        q(
          'lewis109-check3',
          t(
            '把水的三个原子局部数 8、2、2 相加，能当整体价电子库存吗？',
            'Can water’s local 8, 2 and 2 be summed as its whole valence inventory?',
          ),
          [
            t('能，共享使电子加倍', 'Yes, sharing doubles electrons'),
            t('能，局部总是互不重叠', 'Yes, local lists never overlap'),
            t(
              '不能，局部清单含同一批共享电子',
              'No, local lists include the same shared electrons',
            ),
          ],
          2,
          t(
            '整体只计一次；局部检查可重叠。',
            'Count once globally; local checks can overlap.',
          ),
          'local-vs-global',
        ),
      ],
    },
    questions: [
      q(
        'lewis109-q1',
        t(
          '中性 H₂O 的价电子预算是多少？（H 各 1，O 为 6）',
          'What is neutral H₂O’s valence budget (H:1 each, O:6)?',
        ),
        [t('10', '10'), t('12', '12'), t('8', '8')],
        2,
        t(
          '2×1+6=8；10 是全部电子数，12 是此图重叠的局部之和。',
          '2×1+6=8; ten is the all-electron total and twelve this diagram’s overlapping local sum.',
        ),
        'valence-vs-all',
      ),
      q(
        'lewis109-q2',
        t(
          '从两个共享点切换成一条键线，应怎样改变电子库存？',
          'When two shared dots become one bond line, how does the inventory change?',
        ),
        [
          t('不改变，只换表示法', 'It does not change; only notation changes'),
          t('少一个电子', 'It loses one electron'),
          t('多两个电子', 'It gains two electrons'),
        ],
        0,
        t(
          '两个点与一条线都表示同一对电子。',
          'Two dots and one line represent the same pair.',
        ),
        'line-vs-pair',
      ),
      q(
        'lewis109-q3',
        t(
          'H₂ 的两个 H 局部都数到 2，整体价电子应是多少？',
          'Both H atoms in H₂ locally count two. What is the whole valence total?',
        ),
        [t('4', '4'), t('2', '2'), t('8', '8')],
        1,
        t(
          '两个局部都使用同一对共享电子，整体仍为 2。',
          'Both local checks use the same shared pair; the whole still contains two electrons.',
        ),
        'local-vs-global',
      ),
      q(
        'lewis109-q4',
        t(
          'HCl 有一条单键、Cl 上三对孤对，整体价电子多少？',
          'HCl has one single bond and three lone pairs on Cl. How many valence electrons globally?',
        ),
        [t('4', '4'), t('18', '18'), t('8', '8')],
        2,
        t(
          '共享 2，加孤对 3×2=6，共 8；不能混入未画的内层电子。',
          'Two shared plus 3×2=6 lone-pair electrons gives eight; do not mix in omitted core electrons.',
        ),
        'lone-pair-count',
        'application',
      ),
      q(
        'lewis109-q5',
        t(
          '给定 CH₄ 图有四条单键、无孤对，哪组清点正确？',
          'A supplied CH₄ diagram has four single bonds and no lone pairs. Which count is correct?',
        ),
        [
          t('共享 4，孤对 4，整体 8', '4 shared, 4 lone-pair, 8 total'),
          t('共享 8，孤对 0，整体 8', '8 shared, 0 lone-pair, 8 total'),
          t('共享 16，孤对 0，整体 16', '16 shared, 0 lone-pair, 16 total'),
        ],
        1,
        t(
          '四条线各两个电子；没有孤对也要明确填 0。',
          'Each of four lines represents two electrons; explicitly record zero lone-pair electrons.',
        ),
        'shared-count',
        'application',
      ),
      q(
        'lewis109-q6',
        t(
          '图中只画 H₂O 的 8 个价电子，是否说明整个中性分子只有 8 个电子？',
          'Does drawing only H₂O’s eight valence electrons mean the neutral molecule has only eight electrons in all?',
        ),
        [
          t(
            '不，氧的内层两个未画；全部是 10',
            'No, oxygen’s two core electrons are omitted; all-electron total is ten',
          ),
          t('是，没画的都不存在', 'Yes, anything omitted is absent'),
          t('是，共享会消灭内层电子', 'Yes, sharing destroys core electrons'),
        ],
        0,
        t(
          '模型省略不等于物理不存在。',
          'Omission from a model does not imply physical absence.',
        ),
        'valence-vs-all',
        'application',
      ),
    ],
  },
  {
    id: 'lewis-budget-before-octets',
    levelId: 'bonding',
    order: 110,
    nextLessonId: 'reading-chemical-formulae',
    title: t(
      '都凑够八个，电子总数就一定对吗？',
      'If every atom reaches eight, must the electron total be right?',
    ),
    eyebrow: t(
      '共价键衔接 2/2 · 预算与局部条件同时检查',
      'Covalent bridge 2/2 · Check budget and local conditions together',
    ),
    hook: t(
      '有人给 O₂ 画一条单键，再给每个 O 画三对孤对：两边都数到八个，看起来“满层”了。可中性 O₂ 总共只提供 12 个价电子，草图用了几个？',
      'Someone draws one bond in O₂ and three lone pairs on each O. Both local counts reach eight. But neutral O₂ supplies only twelve valence electrons. How many does this draft use?',
    ),
    hookHint: t(
      '把共享电子只计一次，再加全部孤对。达到每个原子的局部目标，不代表没有多画电子。',
      'Count shared electrons once, then add every lone pair. Meeting local targets does not prove that extra electrons were not drawn.',
    ),
    bigIdea: t(
      '在本课中性 H₂、O₂、N₂ 的 Lewis 练习中，草图必须同时满足整体价电子预算与每个原子的局部目标；任一项都不能代替另一项。',
      'For this lesson’s neutral H₂, O₂ and N₂ Lewis exercises, a draft must satisfy both the whole valence budget and every local target. Neither replaces the other.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🔎',
        title: t('O₂ 的单键陷阱', 'O₂’s single-bond trap'),
        body: t(
          '单键加每边三对孤对，局部各 8，但整体 2+6+6=14，超过给定预算 12。',
          'One bond plus three lone pairs per side gives local eights but 2+6+6=14 globally, exceeding the supplied budget twelve.',
        ),
      },
      {
        icon: '🌬️',
        title: t('N₂ 的三条线', 'N₂’s three lines'),
        body: t(
          'N₂ 预算 10；三对共享电子共 6，两边各一对孤对共 4，整体 10，每边局部 8。',
          'N₂’s budget is ten: three shared pairs give six electrons, one lone pair per side four more, with local counts eight.',
        ),
      },
      {
        icon: '🧩',
        title: t('H 不需要八个', 'H does not need eight'),
        body: t(
          'H₂ 在本课用两电子局部目标。一条单键已经让两个 H 各检查到 2，不能为了“八个”再凭空补点。',
          'H₂ uses a local target of two here. A single bond gives each H a local count of two; do not invent dots to force an octet.',
        ),
      },
    ],
    steps: [
      {
        title: t('先列固定的中性预算', 'State the fixed neutral budget first'),
        body: t(
          '本题给中性原子的价电子：H 各 1，O 各 6，N 各 5。因此 H₂、O₂、N₂ 的预算分别为 2、12、10；不能因为草图缺点，就随意增加预算。',
          'Supplied neutral contributions are H one, O six and N five each. H₂, O₂ and N₂ therefore have budgets two, twelve and ten. A drawing’s shortfall does not authorise changing the budget.',
        ),
      },
      {
        title: t(
          '数共享电子与全部孤对',
          'Count shared electrons and all lone pairs',
        ),
        body: t(
          '一、二、三条键线分别代表一、二、三对共享电子，也就是 2、4、6 个。每一对孤对再贡献 2 个；同一个共享对在整体里不可数两次。',
          'One, two and three bond lines represent one, two and three shared pairs: two, four and six electrons. Each lone pair adds two; no shared pair is counted twice globally.',
        ),
      },
      {
        title: t('再分别检查每个原子', 'Check each atom locally as well'),
        body: t(
          '本范围 H 要检查到 2，O/N 要到 8。O₂ 的单键加三对孤对陷阱说明局部都对，整体仍可超支；只满足总预算，也可能有某原子局部未达到。',
          'Here H’s local target is two and O/N use eight. O₂’s single-bond/three-lone-pair trap meets both local targets yet overspends globally. A matching total can also leave one local target unmet.',
        ),
      },
      {
        title: t(
          '把诊断正确与草图正确分开',
          'Separate a correct diagnosis from a valid draft',
        ),
        body: t(
          '你可以正确指出一张草图不合规则；答对这个判断并不会让草图成为真实分子。即使通过本课的 Lewis 条件，也没给出完整轨道、自旋、磁性、能量或反应信息。',
          'You can correctly identify an invalid draft; a correct judgment does not make it a real molecule. Even passing these Lewis conditions supplies no complete orbital, spin, magnetic, energetic or reaction model.',
        ),
      },
    ],
    misconception: t(
      '“每边满八个就完成”“总数对上就不用看局部”“正确判断一张图就是图本身正确”都混淆了不同检查。两项都核对，且保留模型范围。',
      'Local octets alone, a total alone, and a correct diagnosis alone do not validate a drawing. Audit both conditions and retain the model’s scope.',
    ),
    mission: t(
      '用虚拟候选器先保留 O₂ 的单键、每边三对孤对，写出它局部为何都对、整体为何超支。再找本课同时通过的 O₂ 与 N₂ 记账图，并各算共享与孤对电子。',
      'Keep the virtual O₂ candidate with one bond and three lone pairs per side. Explain its local success and global overspend. Then find O₂ and N₂ ledgers passing both checks and count shared and lone-pair electrons.',
    ),
    vocabulary: [
      { en: 'valence budget', zh: '价电子预算' },
      { en: 'local target', zh: '局部目标' },
      { en: 'double / triple bond', zh: '双键／三键' },
      { en: 'candidate diagnosis', zh: '候选草图诊断' },
    ],
    interactive: 'lewis-double-triple-lab',
    resources: [
      reading,
      {
        title: t(
          '模型边界：Lewis 图与更深的电子理论',
          'Model limits: Lewis pictures and deeper electron theory',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/8-4-molecular-orbital-theory',
      },
    ],
    learning: {
      prerequisites: ['shared-electrons-count-once', 'group-18'],
      objectives: [
        t(
          '按线数与孤对数核对候选价电子总数。',
          'Audit candidate valence totals from bond lines and lone pairs.',
        ),
        t(
          '独立判断整体预算与每个原子的局部目标。',
          'Judge the whole budget separately from every local target.',
        ),
        t(
          '解释本课单、双、三键例子及 Lewis 图的限制。',
          'Explain these single-, double- and triple-bond examples and Lewis-model limits.',
        ),
      ],
      workedExample: {
        prompt: t(
          'O₂：一条单键、每个 O 三对孤对。局部与整体各怎样？若改为双键、每边两对孤对呢？',
          'For O₂ with one bond and three lone pairs per O, audit local and global counts. What changes with a double bond and two lone pairs per O?',
        ),
        steps: [
          t(
            '初稿每边局部 2+6=8，但整体为 2+6+6=14，超过 12。',
            'The first draft has local 2+6=8 at each atom but global 2+6+6=14, exceeding twelve.',
          ),
          t(
            '改图双键共有 4 个共享电子；每边两对孤对共 8 个非键合电子。',
            'The revised double bond gives four shared electrons; two lone pairs per side give eight nonbonding electrons.',
          ),
          t(
            '整体 4+8=12，每边局部 4+4=8，同时满足本课两项条件。',
            'Global 4+8=12 and each local 4+4=8 satisfy both conditions in this lesson.',
          ),
        ],
        answer: t(
          '第一张局部达到、整体超支；第二张符合本课中性 O₂ 的 Lewis 记账规则，但仍不是完整真实电子模型。',
          'The first passes local targets but overspends globally; the second fits this neutral-O₂ Lewis exercise, without becoming a complete real-electron model.',
        ),
      },
      anotherWay: t(
        '像既要核对总预算，也要检查每个项目的条件：单个项目看起来都合格，不代表总账没有多算。这里只比喻多条件检查，不能替代电子的物理理论。',
        'Like checking a total budget as well as each item’s conditions, individually acceptable items can still overspend overall. This analogy explains multiple checks, not electron physics.',
      ),
      explainPrompt: t(
        '合上选项，反驳“每边八个就一定正确”，用 O₂ 的 14 对 12 举例；再解释为什么 N₂ 的三条线代表六个共享电子，而不是三个。',
        'Without options, refute “local eights guarantee correctness” using O₂’s fourteen versus twelve, then explain why N₂’s three lines represent six shared electrons, not three.',
      ),
      quickChecks: [
        q(
          'lewis110-check1',
          t(
            'O₂ 单键加每边三对孤对，整体画了几个价电子？',
            'How many valence electrons are drawn with one O₂ bond and three lone pairs per side?',
          ),
          [t('14', '14'), t('12', '12'), t('8', '8')],
          0,
          t(
            '2+6+6=14，局部各八个不能修复全局超支。',
            '2+6+6=14; local eights do not repair the global overspend.',
          ),
          'global-before-octet',
        ),
        q(
          'lewis110-check2',
          t(
            '三条键线共有几个共享电子？',
            'How many shared electrons do three bond lines represent?',
          ),
          [t('3', '3'), t('9', '9'), t('6', '6')],
          2,
          t('三对，每对两个，共六个。', 'Three pairs with two each give six.'),
          'multiple-bond-count',
        ),
        q(
          'lewis110-check3',
          t(
            '你正确判断草图不合规则，是否表示草图本身已正确？',
            'If you correctly diagnose an invalid draft, is the draft now valid?',
          ),
          [
            t(
              '是，判断正确会改变分子',
              'Yes, the judgment changes the molecule',
            ),
            t(
              '否，诊断与被诊断的草图是两回事',
              'No, the diagnosis and the draft are separate',
            ),
            t('是，只要能得分', 'Yes, if it earns a score'),
          ],
          1,
          t(
            '正确识别错误不等于错误已变成真实结构。',
            'Correctly identifying an error does not turn it into a real structure.',
          ),
          'diagnosis-vs-model',
        ),
      ],
    },
    questions: [
      q(
        'lewis110-q1',
        t(
          '只看 O₂ 两个局部都为 8，为什么还不够？',
          'Why are two local counts of eight insufficient for O₂?',
        ),
        [
          t('因为 O 永远不能成键', 'O can never bond'),
          t(
            '还要检查整体是否只用了预算 12 个价电子',
            'The whole drawing must also use its budget of twelve valence electrons',
          ),
          t('因为每边应该是 12', 'Each local count should be twelve'),
        ],
        1,
        t(
          '整体库存与局部目标是两个独立条件。',
          'Global inventory and local targets are separate conditions.',
        ),
        'global-before-octet',
      ),
      q(
        'lewis110-q2',
        t(
          '本课 O₂ 双键、每边两对孤对，哪组正确？',
          'For this O₂ double bond with two lone pairs per side, which count is correct?',
        ),
        [
          t('共享 2，孤对 8，整体 10', '2 shared, 8 lone-pair, 10 total'),
          t('共享 8，孤对 8，整体 16', '8 shared, 8 lone-pair, 16 total'),
          t('共享 4，孤对 8，整体 12', '4 shared, 8 lone-pair, 12 total'),
        ],
        2,
        t(
          '双键两对为 4，四对孤对为 8。',
          'Two shared pairs give four; four lone pairs give eight.',
        ),
        'multiple-bond-count',
      ),
      q(
        'lewis110-q3',
        t(
          'N₂ 的给定预算为 10；三键、每边一对孤对，整体是多少？',
          'N₂ has budget ten. With a triple bond and one lone pair per side, what is the whole total?',
        ),
        [
          t('6+2+2=10', '6+2+2=10'),
          t('3+2+2=7', '3+2+2=7'),
          t('8+8=16', '8+8=16'),
        ],
        0,
        t(
          '共享六个，孤对四个，总计十个；局部的八不能直接相加。',
          'Six shared and four nonbonding electrons give ten; local eights cannot simply be summed.',
        ),
        'nitrogen-ledger',
        'application',
      ),
      q(
        'lewis110-q4',
        t(
          '有人给 N₂ 画双键、每边两对孤对，局部各 8。应怎样诊断？',
          'A N₂ draft has a double bond and two lone pairs per side, locally eight each. Diagnose it.',
        ),
        [
          t('局部都八个，所以完全成立', 'Local eights make it fully valid'),
          t(
            '整体画了 12，超过中性预算 10',
            'It draws twelve globally, exceeding the neutral budget ten',
          ),
          t('只要把预算改成 12 就好', 'Simply change the budget to twelve'),
        ],
        1,
        t(
          '预算由给定中性原子贡献决定，不由想画几对决定。',
          'The supplied neutral atoms determine the budget, not the desired number of drawn pairs.',
        ),
        'global-before-octet',
        'application',
      ),
      q(
        'lewis110-q5',
        t(
          '本课 H₂ 单键、无孤对是否要再补到每边八个？',
          'Should a single-bond H₂ diagram with no lone pairs be filled to eight at each H?',
        ),
        [
          t('要，所有元素都必须八个', 'Yes, every element must reach eight'),
          t('要，每边还缺六个', 'Yes, each side lacks six'),
          t(
            '不要，H 的局部目标是 2，整体预算也是 2',
            'No, H’s local target is two and the whole budget is two',
          ),
        ],
        2,
        t(
          '不能把八电子规则无条件套到氢。',
          'Do not apply an unconditional octet rule to hydrogen.',
        ),
        'hydrogen-duet',
        'application',
      ),
      q(
        'lewis110-q6',
        t(
          '草图通过本课所有 Lewis 条件，是否已经给出真实氧气磁性的完整解释？',
          'Does passing these Lewis checks fully explain real oxygen’s magnetic behaviour?',
        ),
        [
          t(
            '没有，Lewis 图仍有范围，需要更深模型',
            'No, Lewis diagrams have limits and deeper models are needed',
          ),
          t('是，所有电子事实都已包含', 'Yes, every electron fact is included'),
          t(
            '是，图上的点就是测到的自旋',
            'Yes, drawn dots are measured spin states',
          ),
        ],
        0,
        t(
          '本图练价电子记账，不描述真实轨道、自旋和完整磁性。',
          'This diagram practices valence accounting, not real orbitals, spin or complete magnetic behaviour.',
        ),
        'lewis-model-limits',
      ),
    ],
  },
];
