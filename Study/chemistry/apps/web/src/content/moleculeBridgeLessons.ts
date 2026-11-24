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
const formulaReading = {
  title: t(
    '拓展：原子、分子与化学式',
    'Read more: atoms, molecules and formulas',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/2-4-chemical-formulas',
};
export const moleculeBridgeLessons: Lesson[] = [
  {
    id: 'atoms-molecules-and-substance-types',
    levelId: 'substances',
    order: 103,
    nextLessonId: 'coefficients-and-molecular-subscripts',
    title: t(
      '原子、分子、物质：到底在数什么？',
      'Atoms, molecules, substances: what are you counting?',
    ),
    eyebrow: t(
      '分子衔接 1/2 · 三种清点别混用',
      'Molecule bridge 1/2 · Keep three counts separate',
    ),
    hook: t(
      '三对连在一起的 O，算三个原子、六个分子，还是一种物质？一张图可以有好几种正确的“数法”，关键是说清单位。',
      'Three paired groups of O: three atoms, six molecules, or one substance? A picture has several valid counts, if you name what you count.',
    ),
    hookHint: t(
      '先认元素符号，再看哪些原子归在同一个分子里，最后比较整份样品有哪些物质。',
      'Identify element symbols, inspect which atoms belong to one molecule, then compare the substances in the entire sample.',
    ),
    bigIdea: t(
      '原子数、分子数、元素种类和物质种类是不同问题；原子怎样组合，同样决定样品是什么。',
      'Atom count, molecule count, element types and substance types are different questions; how atoms group also determines what the sample contains.',
    ),
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '🎈',
        title: t('He 不是两个原子', 'He is not two atoms'),
        body: t(
          'He 是氦的一个元素符号。独立 He 原子不因为写了两个字母就成为双原子分子。',
          'He is one element symbol for helium. Two letters do not make a separate helium atom a diatomic molecule.',
        ),
      },
      {
        icon: '🌬️',
        title: t(
          'O₂ 有分子，却不是化合物',
          'O₂ has molecules but is not a compound',
        ),
        body: t(
          '一个氧气分子含两个氧原子，仍只有一种元素。分子可以来自单质，也可以来自化合物。',
          'An oxygen molecule contains two oxygen atoms, still one element. Molecules can belong to elemental substances or compounds.',
        ),
      },
      {
        icon: '💧',
        title: t(
          '水的一份与水的种类',
          'A water copy versus water as a substance',
        ),
        body: t(
          '两个水分子共有六个原子，但这两个相同分子没有把水变成两种物质。',
          'Two water molecules contain six atoms, but two identical molecules do not make two substances.',
        ),
      },
    ],
    steps: [
      {
        title: t('先读符号，不数英文字母', 'Read symbols, not letter counts'),
        body: t(
          'H 表示氢原子，O 表示氧原子，He 整体表示氦原子。图中每个小圆圈标一个原子；一个分子的小框里可以有多个圆圈。',
          'H labels hydrogen, O oxygen, and the whole symbol He helium. Each circle labels one atom; a molecular frame may contain several circles.',
        ),
      },
      {
        title: t(
          '分子数和原子数分别清点',
          'Count molecules separately from atoms',
        ),
        body: t(
          '三个 O₂ 分子：分子数是 3，每个含 2 个原子，所以原子总数 6。四个独立 He 原子：原子数 4，分子数 0。这里不把单个 He 原子叫单原子分子。',
          'Three O₂ molecules give a molecule count of 3 and an atom count of 6. Four separate He atoms give 4 atoms and 0 molecules. We do not call separate He atoms monatomic molecules here.',
        ),
      },
      {
        title: t(
          '先判断有几种物质，再看元素',
          'Count substance types before element types',
        ),
        body: t(
          '只有一种物质才讨论它是单质还是化合物：纯 O₂ 只有氧一种元素，是单质；纯 H₂O 含氢、氧两种元素，是化合物。H₂ 和 O₂ 共存则有两种物质，是混合物，不能凭两种颜色就说成化合物。',
          'For one substance, ask whether it is elemental or a compound: pure O₂ has only oxygen; pure H₂O contains hydrogen and oxygen. Coexisting H₂ and O₂ are two substances, a mixture; two colours alone do not establish a compound.',
        ),
      },
      {
        title: t(
          '同一种元素也可能形成不同物质',
          'One element can form different substances',
        ),
        body: t(
          'O₂ 与 O₃ 分别是氧气和臭氧，都是只含氧的单质，但不是同一种物质。给定它们共存的图就是混合物。这说明元素种类少，不等于物质种类少；本模型不预测反应或稳定时间。',
          'O₂ and O₃ are oxygen and ozone: both elemental substances containing only oxygen, but different substances. Their given coexistence is a mixture. Few element types do not imply few substance types. This model predicts no reaction or lifetime.',
        ),
      },
    ],
    misconception: t(
      '“有两个原子的分子一定是化合物”“一种颜色一定是纯净物”“几个分子就是几种物质”都不成立。元素说原子种类，单质说纯净物类别；还要核对原子怎样组合。',
      'Two atoms per molecule need not make a compound; one colour need not prove purity; several molecules need not mean several substances. Element type and elemental substance are related but distinct; inspect how atoms group.',
    ),
    mission: t(
      '用纸画三个 O₂ 小框和两个 H₂O 小框，分别写原子总数、分子数和物质种类。不要把两幅图混在一起作一份样品，除非明确说它们共存。',
      'Draw one sample with three O₂ frames and another with two H₂O frames. Label atom totals, molecule counts and substance types separately. Do not combine the samples unless you explicitly mean coexistence.',
    ),
    vocabulary: [
      { en: 'atom count', zh: '原子数' },
      { en: 'molecule count', zh: '分子数' },
      { en: 'elemental substance', zh: '单质' },
      { en: 'substance type', zh: '物质种类' },
    ],
    interactive: 'molecule-sample-evidence-lab',
    resources: [formulaReading],
    learning: {
      prerequisites: [
        'what-is-an-atom',
        'elements-vs-compounds',
        'pure-substances-and-mixtures',
      ],
      objectives: [
        t(
          '分别清点原子和分子，正确处理 He 与 O₂。',
          'Count atoms and molecules separately, including He and O₂.',
        ),
        t(
          '区分元素种类和物质种类。',
          'Distinguish element types from substance types.',
        ),
        t(
          '用组成与组合方式解释纯单质、纯化合物和混合物。',
          'Explain elemental substances, compounds and mixtures using composition and grouping.',
        ),
      ],
      workedExample: {
        prompt: t(
          '模型中有三个 O₂ 分子：有几个原子、几个分子、几种元素、几种物质？',
          'A model has three O₂ molecules. How many atoms, molecules, element types and substances?',
        ),
        steps: [
          t(
            '每个分子有两个 O 原子，所以 3 × 2 = 6 个原子。',
            'Each molecule has two O atoms: 3 × 2 = 6 atoms.',
          ),
          t(
            '分子框有三个，分子数就是 3。',
            'Three molecular frames give three molecules.',
          ),
          t(
            '所有原子是 O，所有分子都是 O₂；元素种类和物质种类各是 1。',
            'Every atom is O and every molecule O₂: one element type and one substance.',
          ),
        ],
        answer: t(
          '6 个原子、3 个分子、1 种元素、1 种物质；它是纯单质。',
          'Six atoms, three molecules, one element type and one substance: a pure elemental substance.',
        ),
      },
      anotherWay: t(
        '像数一盒回形针链：可以数每个环，也可以数整条链，还可以比较有哪些链型。但原子不是回形针，分子的结合和真实形状不能靠这个比喻解释。',
        'Think of counting individual links, complete chains and chain types in a box. Atoms are not paperclips; this analogy cannot explain chemical bonding or molecular shape.',
      ),
      explainPrompt: t(
        '不用选项，解释为什么 O₂ 可以有分子却不是化合物，再说明 O₂ 与 O₃ 共存时为什么不是纯净物。',
        'Without options, explain why O₂ has molecules but is not a compound, and why coexisting O₂ and O₃ do not form a pure substance.',
      ),
      quickChecks: [
        q(
          'molecule103-check1',
          t(
            '四个独立 He 原子有几个分子？',
            'How many molecules are four separate He atoms?',
          ),
          [t('4', '4'), t('0', '0'), t('8', '8')],
          1,
          t(
            '独立 He 是原子，不是由多个原子结合的分子。',
            'Separate He entities are atoms, not bonded multiatom molecules.',
          ),
          'atom-vs-molecule',
        ),
        q(
          'molecule103-check2',
          t(
            '两个 H₂O 分子有几种物质？',
            'How many substances do two H₂O molecules represent?',
          ),
          [t('1', '1'), t('2', '2'), t('6', '6')],
          0,
          t(
            '重复同一种分子不增加物质种类。',
            'Repeating the same molecular species does not add substance types.',
          ),
          'substance-types',
        ),
        q(
          'molecule103-check3',
          t(
            'O₂ 与 O₃ 共存的图应判断为？',
            'How should a given O₂/O₃ sample be classified?',
          ),
          [
            t('纯化合物', 'Pure compound'),
            t('纯氧气', 'Pure O₂'),
            t('两种单质的混合物', 'Mixture of two elemental substances'),
          ],
          2,
          t(
            '元素相同不等于物质相同，分子组合也要检查。',
            'The same element need not mean the same substance; check molecular grouping.',
          ),
          'allotrope-mixture',
        ),
      ],
    },
    questions: [
      q(
        'molecule103-q1',
        t(
          '三个 O₂ 分子共含多少原子？',
          'How many atoms are in three O₂ molecules?',
        ),
        [t('3', '3'), t('9', '9'), t('6', '6')],
        2,
        t(
          '每个分子两个原子，3 × 2 = 6。',
          'Two atoms per molecule gives 3 × 2 = 6.',
        ),
        'atom-vs-molecule',
      ),
      q(
        'molecule103-q2',
        t('He 的两个字母说明什么？', 'What do the two letters in He mean?'),
        [
          t('合在一起是一个元素符号', 'Together they form one element symbol'),
          t('必有两个不同原子', 'There must be two different atoms'),
          t('是 H 与电子的混合物', 'It is H mixed with electrons'),
        ],
        0,
        t(
          '元素符号首字母大写，后面的字母小写；不能按字母数原子。',
          'An element symbol starts uppercase and may continue lowercase; letter counts are not atom counts.',
        ),
        'element-symbol',
        'recall',
      ),
      q(
        'molecule103-q3',
        t('为什么纯 O₂ 不是化合物？', 'Why is pure O₂ not a compound?'),
        [
          t('因为它没有分子', 'It has no molecules'),
          t('因为只含氧一种元素', 'It contains only one element, oxygen'),
          t('因为气体不能是化合物', 'Gases cannot be compounds'),
        ],
        1,
        t(
          '判断化合物需要不同元素化合，不是只看分子里原子多不多。',
          'A compound combines different elements; multiple atoms alone are insufficient.',
        ),
        'element-vs-compound',
      ),
      q(
        'molecule103-q4',
        t(
          '两个 H₂ 和一个 O₂ 画在同一份样品中，未发生反应，应叫什么？',
          'Two H₂ and one O₂ coexist without reaction. What is the sample?',
        ),
        [
          t('三个水分子', 'Three water molecules'),
          t('一种纯化合物', 'One pure compound'),
          t('两种单质的混合物', 'A mixture of two elemental substances'),
        ],
        2,
        t(
          '共存不是已经化合，H₂ 和 O₂ 仍是不同物质。',
          'Coexistence is not chemical combination; H₂ and O₂ remain different substances.',
        ),
        'substance-types',
        'application',
      ),
      q(
        'molecule103-q5',
        t(
          '一个 O₂ 与一个 O₃ 共存：元素种类和物质种类分别是？',
          'One O₂ and one O₃ coexist. How many element and substance types?',
        ),
        [
          t('2 和 1', '2 and 1'),
          t('1 和 2', '1 and 2'),
          t('5 和 5', '5 and 5'),
        ],
        1,
        t(
          '原子都属氧元素，但 O₂ 与 O₃ 是不同物质。',
          'All atoms are oxygen, but O₂ and O₃ are different substances.',
        ),
        'allotrope-mixture',
        'application',
      ),
      q(
        'molecule103-q6',
        t(
          '一幅原子、分子图的两组样品原子总账相同，能直接说物质相同吗？',
          'Can two atom/molecule samples with equal atom inventories be assumed to contain the same substances?',
        ),
        [
          t('不能，还要检查分子组合', 'No; inspect molecular grouping too'),
          t('能，只要颜色总数相同', 'Yes, matching colour totals suffice'),
          t('能，不必再看图例', 'Yes, the key no longer matters'),
        ],
        0,
        t(
          '两个水分子与 2H₂ + O₂ 可有同一原子总账，但分子组合和物质种类不同。',
          'Two water molecules and 2H₂ + O₂ can have the same atom inventory but different grouping and substance types.',
        ),
        'grouping-vs-inventory',
        'application',
      ),
    ],
  },
  {
    id: 'coefficients-and-molecular-subscripts',
    levelId: 'substances',
    order: 104,
    nextLessonId: 'protons',
    title: t(
      '2H₂O：前面的 2 和右下角的 ₂ 一样吗？',
      '2H₂O: do the front 2 and subscript ₂ mean the same thing?',
    ),
    eyebrow: t(
      '分子衔接 2/2 · 从图到一份一份的配方',
      'Molecule bridge 2/2 · From pictures to whole-copy recipes',
    ),
    hook: t(
      '你想画两个水分子，却把 H₂O 改成了 H₂O₂。这是“多画一份”，还是把每一份的组成改了？',
      'You want two water molecules but change H₂O to H₂O₂. Have you added a copy, or changed what each copy contains?',
    ),
    hookHint: t(
      '先固定一个分子的配方，再复制整份。不能用改下标来表示增加分子数。',
      'Fix one molecule’s composition, then copy the whole molecule. Do not change a subscript to mean more molecules.',
    ),
    bigIdea: t(
      '分子式的下标数一份内的原子；前面的系数数整份，并乘到这份中每一种原子。',
      'A molecular formula’s subscripts count atoms within one copy; its front coefficient counts whole copies and multiplies every atom type.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '💧',
        title: t('H₂O 中没写出的 1', 'The unwritten 1 in H₂O'),
        body: t(
          'O 后没有下标，代表一个氧原子，不是零个。一个水分子合计三个原子。',
          'No subscript after O means one oxygen atom, not zero. A water molecule contains three atoms in total.',
        ),
      },
      {
        icon: '📋',
        title: t('三份同样的配方', 'Three identical copies'),
        body: t(
          '3CO₂ 表示三个二氧化碳分子：C 是 3 × 1，O 是 3 × 2。不能只把 C 乘三。',
          '3CO₂ means three carbon dioxide molecules: C is 3 × 1 and O is 3 × 2. Do not multiply only C.',
        ),
      },
      {
        icon: '🧴',
        title: t('H₂O₂ 的另一个组成', 'The different composition of H₂O₂'),
        body: t(
          'H₂O₂ 是过氧化氢的分子式，不是“两个水”。共享元素不表示性质或用途相同。',
          'H₂O₂ is hydrogen peroxide, not two waters. Sharing elements does not imply matching properties or uses.',
        ),
      },
    ],
    steps: [
      {
        title: t('先把一个分子读完整', 'Read one complete molecule first'),
        body: t(
          'H₂O 一份有 H 两个、O 一个；CO₂ 一份有 C 一个、O 两个；NH₃ 一份有 N 一个、H 三个。下标只作用于紧邻左侧的元素符号；本课暂不含括号。',
          'One H₂O has two H and one O; one CO₂ has one C and two O; one NH₃ has one N and three H. A subscript applies to the immediately preceding element symbol; parentheses are outside this lesson.',
        ),
      },
      {
        title: t(
          '把整份复制，不改配方',
          'Copy the whole, without changing the recipe',
        ),
        body: t(
          '2H₂O 是两份 H₂O。每种原子都乘 2：H 为 4，O 为 2；分子数为 2，原子总数为 6。这里按分子个数读系数，之后还会学习宏观的摩尔比例。',
          '2H₂O is two whole H₂O copies. Multiply every atom type by 2: four H and two O, two molecules and six atoms. Here coefficients count individual molecules; bulk mole ratios come later.',
        ),
      },
      {
        title: t('数字位置改变了问题', 'Number position changes the question'),
        body: t(
          '2H₂O 改的是份数；H₂O₂ 改的是每份组成。二者氧原子总数虽都可以是 2，但氢原子总数不同、分子数不同，物质也不同。',
          '2H₂O changes the copy count; H₂O₂ changes composition within a copy. Both can total two O atoms, but their H totals, molecule counts and substances differ.',
        ),
      },
      {
        title: t(
          '总账与身份分开检查',
          'Check inventory separately from identity',
        ),
        body: t(
          '2H₂O 和 2H₂ + O₂ 都共有 H 四个、O 两个。前者是水，后者是两种单质的混合物；原子总账相同不是物质相同，也不意味着过程会自行发生。',
          'Both 2H₂O and 2H₂ + O₂ total four H and two O atoms. One is water; the other a mixture of elemental substances. Matching atom inventories proves neither matching identity nor a spontaneous process.',
        ),
      },
    ],
    misconception: t(
      '“没有下标就是零”“系数只乘第一个元素”“原子总数相同就是同一种物质”都会读错。先核对一份组成，再复制，最后检查组合方式。',
      'No subscript does not mean zero; coefficients do not multiply only the first element; equal atom totals do not prove identical substances. Read one copy, multiply, then inspect grouping.',
    ),
    mission: t(
      '自己画 3CO₂ 和 2NH₃；先写一份中的各元素原子数，再写份数，最后逐项乘。请家人故意只乘第一个元素，让你指出遗漏。',
      'Draw 3CO₂ and 2NH₃. Write atoms per element in one copy, the copy count, then each multiplication. Ask someone to multiply only the first element so you can identify what was omitted.',
    ),
    vocabulary: [
      { en: 'molecular formula', zh: '分子式' },
      { en: 'subscript', zh: '下标' },
      { en: 'coefficient', zh: '系数' },
      { en: 'whole copy', zh: '整份' },
    ],
    interactive: 'molecular-formula-count-lab',
    resources: [formulaReading],
    learning: {
      prerequisites: [
        'atoms-molecules-and-substance-types',
        'what-is-an-element',
      ],
      objectives: [
        t(
          '读出一个简单分子式中每种原子的数量。',
          'Read each atom count in a simple molecular formula.',
        ),
        t(
          '把系数乘到每种原子并写出总数。',
          'Apply a coefficient to every atom type and state the totals.',
        ),
        t(
          '用例子说明下标、系数与物质身份的区别。',
          'Use examples to distinguish subscripts, coefficients and substance identity.',
        ),
      ],
      workedExample: {
        prompt: t(
          '3CO₂ 是几个分子？各有多少 C、O 原子？',
          'How many molecules does 3CO₂ represent, and how many C and O atoms?',
        ),
        steps: [
          t('一份 CO₂：C 为 1，O 为 2。', 'One CO₂ copy has one C and two O.'),
          t(
            '前面的 3 表示三份，C 为 3 × 1，O 为 3 × 2。',
            'The front 3 means three copies: C is 3 × 1 and O is 3 × 2.',
          ),
          t(
            '三份共有 3 + 6 = 9 个原子，但分子数仍是 3。',
            'Three copies have 3 + 6 = 9 atoms, but still three molecules.',
          ),
        ],
        answer: t(
          '3 个分子，3 个 C 原子、6 个 O 原子，共 9 个原子。',
          'Three molecules, three C atoms and six O atoms: nine atoms in total.',
        ),
      },
      anotherWay: t(
        '把分子式看作装好的一小盒：下标记盒内装什么，系数记拿几盒。这个比喻只能帮助清点，不能把原子当作可以随便换装而不改物质的积木。',
        'Treat a formula like a packed small box: subscripts describe its contents and the coefficient counts boxes. This analogy aids counting; atoms cannot be arbitrarily repacked without changing substances.',
      ),
      explainPrompt: t(
        '不看图，解释 2H₂O 和 H₂O₂ 为什么不同；再说明为什么两个水分子与 2H₂ + O₂ 原子总账相同也不是同一份物质。',
        'Without a diagram, explain why 2H₂O differs from H₂O₂, then why two water molecules and 2H₂ + O₂ are different despite matching atom inventories.',
      ),
      quickChecks: [
        q(
          'molecule104-check1',
          t(
            'H₂O 中 O 没有下标，表示几个 O？',
            'No subscript follows O in H₂O. How many O atoms?',
          ),
          [t('1', '1'), t('0', '0'), t('2', '2')],
          0,
          t(
            '省略的下标按 1 读，不按 0。',
            'An omitted subscript means one, not zero.',
          ),
          'molecular-subscript',
        ),
        q(
          'molecule104-check2',
          t('2NH₃ 中 H 原子总数是？', 'How many H atoms are in 2NH₃?'),
          [t('3', '3'), t('5', '5'), t('6', '6')],
          2,
          t(
            '两份各三个 H，2 × 3 = 6。',
            'Two copies each have three H: 2 × 3 = 6.',
          ),
          'whole-copy-coefficient',
        ),
        q(
          'molecule104-check3',
          t(
            '怎样表示两个水分子？',
            'How do you represent two water molecules?',
          ),
          [t('H₂O₂', 'H₂O₂'), t('2H₂O', '2H₂O'), t('H₄O', 'H₄O')],
          1,
          t(
            '复制整份 H₂O，用系数 2，不能改变每份组成。',
            'Copy the whole H₂O with coefficient 2, keeping each copy’s composition.',
          ),
          'coefficient-vs-subscript',
        ),
      ],
    },
    questions: [
      q(
        'molecule104-q1',
        t(
          '2H₂O 中 H、O 原子总数分别是？',
          'What are the H and O totals in 2H₂O?',
        ),
        [
          t('2 和 1', '2 and 1'),
          t('4 和 2', '4 and 2'),
          t('4 和 1', '4 and 1'),
        ],
        1,
        t(
          '系数乘每种原子：H 2×2，O 2×1。',
          'The coefficient multiplies both atom types: H 2×2 and O 2×1.',
        ),
        'whole-copy-coefficient',
      ),
      q(
        'molecule104-q2',
        t(
          '3CO₂ 中有几个分子、几个原子？',
          'How many molecules and atoms are in 3CO₂?',
        ),
        [
          t('3 个分子、3 个原子', '3 molecules, 3 atoms'),
          t('9 个分子、3 个原子', '9 molecules, 3 atoms'),
          t('3 个分子、9 个原子', '3 molecules, 9 atoms'),
        ],
        2,
        t(
          '每个分子有三个原子，三份共九个。',
          'Each molecule has three atoms, giving nine in three copies.',
        ),
        'atom-vs-molecule',
      ),
      q(
        'molecule104-q3',
        t(
          '2NH₃ 中 N 没有下标，应该怎样算？',
          'How should N be counted in 2NH₃, with no N subscript?',
        ),
        [
          t('每份 1 个，共 2 个', 'One per copy, two in total'),
          t('每份 0 个，共 0 个', 'Zero per copy, zero in total'),
          t('只按前面 2 加后面 3 得 5', 'Add 2 and 3 to get five'),
        ],
        0,
        t(
          '省略下标 1；份数乘一份内的数量。',
          'The omitted subscript is one; multiply the per-copy count by the coefficient.',
        ),
        'molecular-subscript',
      ),
      q(
        'molecule104-q4',
        t(
          '把 H₂O 写成 H₂O₂ 来表示两份水，错在哪里？',
          'Why is changing H₂O to H₂O₂ wrong for two copies of water?',
        ),
        [
          t('没有错，只是更详细', 'It is merely more detailed'),
          t(
            '改了每份组成，而不是增加水分子份数',
            'It changes each copy’s composition rather than the copy count',
          ),
          t('只能用英文写两个水', 'Two waters must be written in English'),
        ],
        1,
        t(
          'H₂O₂ 是不同分子的组成，两个水应写 2H₂O。',
          'H₂O₂ specifies a different molecule; two waters are 2H₂O.',
        ),
        'coefficient-vs-subscript',
      ),
      q(
        'molecule104-q5',
        t(
          '4CO₂ 的 O 总数被写成 2，应该怎样纠正？',
          'Someone gives an O total of 2 for 4CO₂. How should it be corrected?',
        ),
        [
          t('把化学式改成 CO₈', 'Change the molecular formula to CO₈'),
          t('只数四个 C 就够了', 'Only count the four C atoms'),
          t(
            '保留 CO₂ 配方，四份各有两个 O，共 8 个',
            'Keep CO₂; four copies each have two O, totalling eight',
          ),
        ],
        2,
        t(
          '不改每个分子身份，用整份乘法计算总数。',
          'Keep each molecular identity and use whole-copy multiplication.',
        ),
        'whole-copy-coefficient',
        'application',
      ),
      q(
        'molecule104-q6',
        t(
          '2H₂O 与 2H₂ + O₂ 原子总账相同，哪句成立？',
          '2H₂O and 2H₂ + O₂ have matching atom inventories. Which follows?',
        ),
        [
          t(
            '原子总账相同，但分子组合和物质种类不同',
            'Atom totals match, but molecular grouping and substance types differ',
          ),
          t('因此是同一种纯净物', 'They must be the same pure substance'),
          t(
            '因此无须条件就会相互转变',
            'They must interconvert without any conditions',
          ),
        ],
        0,
        t(
          '守恒账本不是身份判据，也不能单独预测反应条件。',
          'A conservation ledger does not establish identity or reaction conditions.',
        ),
        'grouping-vs-inventory',
        'application',
      ),
    ],
  },
];
