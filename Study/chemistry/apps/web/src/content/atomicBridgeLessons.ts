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
    '拓展：原子结构、记号与平均质量',
    'Read more: atomic structure, symbols and average mass',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism',
};
export const atomicBridgeLessons: Lesson[] = [
  {
    id: 'isotope-and-ion-two-ledgers',
    levelId: 'atoms',
    order: 105,
    nextLessonId: 'isotope-abundance-and-mean',
    title: t(
      '同位素还是离子，必须二选一吗？',
      'Isotope or ion: must you choose only one?',
    ),
    eyebrow: t(
      '原子衔接 1/2 · 核内账本与电荷账本',
      'Atomic bridge 1/2 · Nuclear and charge ledgers',
    ),
    hook: t(
      '一份氯粒子记录有 17 个质子、20 个中子、18 个电子。它带电吗？与中性的氯-35 比，是不是不同同位素？这两个答案能同时是“是”吗？',
      'A chlorine record has 17 protons, 20 neutrons and 18 electrons. Is it charged? Does it represent a different isotope from neutral chlorine-35? Can both answers be yes?',
    ),
    hookHint: t(
      '先用质子和中子检查核，再用质子与电子核对电荷。不要把两个问题挤成一个分类选择。',
      'Audit the nucleus with protons and neutrons, then charge with protons and electrons. Do not force two questions into one category choice.',
    ),
    bigIdea: t(
      '同位素关系看质子与中子；离子状态看质子与电子的电荷差。不同同位素的粒子也可以同时带电。',
      'Isotopic relationships depend on protons and neutrons; ion status depends on the proton–electron charge difference. Particles of different isotopes can also be ions.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🧂',
        title: t(
          '氯离子的核仍有身份',
          'A chloride nucleus retains its identity',
        ),
        body: t(
          '氯-35 和氯-37 都可对应带 −1 电荷的氯离子。质子数都为 17，中子数不同。',
          'Chlorine-35 and chlorine-37 can both correspond to chloride ions with −1 charge. Both have 17 protons but different neutron counts.',
        ),
      },
      {
        icon: '📋',
        title: t(
          '同一个质量数，不一定中性',
          'One mass number need not mean neutral',
        ),
        body: t(
          'Na 与 Na⁺ 可具有同一个钠-23 核，质量数都为 23，但电子数不同。质量数不计入电子，不表示电子没有质量。',
          'Na and Na⁺ can share a sodium-23 nucleus and mass number 23 while differing in electrons. Excluding electrons from mass number does not make electrons massless.',
        ),
      },
      {
        icon: '🔎',
        title: t(
          '电子数相同也可能不同元素',
          'Equal electrons can belong to different elements',
        ),
        body: t(
          '中性 Ne 与 Na⁺ 都可有 10 个电子，但质子数分别是 10、11，元素身份不同。',
          'Neutral Ne and Na⁺ can both have 10 electrons, but 10 versus 11 protons means different elements.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '用 Z 与 A 还原核内数量',
          'Recover nuclear counts from Z and A',
        ),
        body: t(
          'Z 是原子序数，等于质子数 p；A 是质量数，等于 p+n。因此 n=A−Z。对同一种元素的不同同位素，Z 相同，A 和中子数不同。',
          'Atomic number Z equals proton count p. Mass number A equals p+n, so n=A−Z. Different isotopes of one element share Z but differ in A and neutron count.',
        ),
      },
      {
        title: t(
          '把带正负号的 q 放进电荷式',
          'Keep signed q in the charge equation',
        ),
        body: t(
          '以基本电荷计，q=p−e，所以 e=p−q。q=−1 时，是比质子多一个电子；q=+1 时，是少一个电子。中子不参与这份电荷差。',
          'In elementary-charge units, q=p−e and e=p−q. q=−1 means one more electron than protons; q=+1 means one fewer. Neutrons do not enter this charge difference.',
        ),
      },
      {
        title: t('分别回答两个问题', 'Answer two separate questions'),
        body: t(
          '先问两份记录是否同质子、不同中子，再问每份记录是否 p≠e。氯-35⁻ 与氯-37⁻ 可既是不同同位素记录，又都属于离子；两个判断并不冲突。',
          'First ask whether the records share protons but differ in neutrons, then whether each has p≠e. Chlorine-35⁻ and chlorine-37⁻ can represent different isotopes and both be ions. The judgments do not conflict.',
        ),
      },
      {
        title: t(
          '比较记录，不把核变化当作化学操作',
          'Compare records without treating nuclear change as chemistry',
        ),
        body: t(
          '本课给定两份记录，不是在演示一个原子随意改变核。形成普通离子时变化的是电子；核内质子改变会改变元素身份，不能拿相同电子数代替元素判断。',
          'These are two supplied records, not a nucleus being freely altered. Ordinary ion formation involves electrons; changing nuclear protons changes element identity. Equal electrons cannot substitute for an element check.',
        ),
      },
    ],
    misconception: t(
      '“同位素不能是离子”和“电子数相同就是同一种元素”都不成立。核的身份与整体电荷要分别记录；质量数也不是原子的精确质量。',
      'Isotopic identity does not prohibit ion status, and equal electron counts do not prove the same element. Record nuclear identity and net charge separately; mass number is not exact atomic mass.',
    ),
    mission: t(
      '只用纸笔或虚拟记录，为氯-35⁻ 和氯-37⁻ 各写一张 Z、A、p、n、e、q 表；列出相同与不同各项，再解释为什么两者都带负电。',
      'Using paper or virtual records, make Z/A/p/n/e/q tables for chlorine-35⁻ and chlorine-37⁻. Identify shared features and differences, then explain why both carry negative charge.',
    ),
    vocabulary: [
      { en: 'mass number A', zh: '质量数 A' },
      { en: 'atomic number Z', zh: '原子序数 Z' },
      { en: 'net charge', zh: '净电荷' },
      { en: 'isotope identity', zh: '同位素身份' },
    ],
    interactive: 'isotope-ion-ledger-lab',
    resources: [reading],
    learning: {
      prerequisites: ['mass-number', 'isotopes', 'what-is-an-ion'],
      objectives: [
        t(
          '从 Z、A、q 还原质子、中子和电子数。',
          'Recover proton, neutron and electron counts from Z, A and q.',
        ),
        t(
          '把同位素关系和是否带电分开判断。',
          'Judge isotopic relationships separately from ion status.',
        ),
        t(
          '用反例解释相同电子数为什么不足以判断元素。',
          'Use a counterexample to show why equal electrons do not identify an element.',
        ),
      ],
      workedExample: {
        prompt: t(
          'B 是氯-37⁻，Z=17；A 是中性的氯-35。B 有多少 p、n、e？两者互为不同同位素吗？B 是离子吗？',
          'B is chlorine-37⁻ with Z=17; A is neutral chlorine-35. Find B’s p/n/e, their isotope relationship and B’s ion status.',
        ),
        steps: [
          t('p=Z=17，n=A−Z=37−17=20。', 'p=Z=17 and n=A−Z=37−17=20.'),
          t('q=−1，所以 e=17−(−1)=18。', 'q=−1, so e=17−(−1)=18.'),
          t(
            '同质子、不同中子，代表不同同位素；B 中 p≠e，所以 B 也带电。',
            'Equal protons and different neutrons mean different isotopes; B also has p≠e and is charged.',
          ),
        ],
        answer: t(
          'B 有 17 个质子、20 个中子、18 个电子。两者代表不同氯同位素，B 同时是离子。',
          'B has 17 protons, 20 neutrons and 18 electrons. The records represent different chlorine isotopes, and B is an ion too.',
        ),
      },
      anotherWay: t(
        '像用两栏登记一辆车：一栏记车辆身份，一栏记当前载客情况。两栏能同时描述同一辆车。这里只类比分开记录，不能把电子当乘客来解释真实原子运动或能量。',
        'Think of separate vehicle identity and occupancy columns: both describe one vehicle. This analogy only separates records; electrons are not passengers and it does not model atomic motion or energy.',
      ),
      explainPrompt: t(
        '不用“同位素改中子、离子改电子”这个口号，举出两份既是不同同位素记录、又都带电的例子，并写 p−e 检查电荷。',
        'Without the slogan “isotopes change neutrons, ions change electrons”, give two records that differ isotopically and are both charged, checking p−e for each.',
      ),
      quickChecks: [
        q(
          'atomic105-check1',
          t(
            '氯-37⁻ 的 Z=17，中子数是多少？',
            'Chlorine-37⁻ has Z=17. How many neutrons?',
          ),
          [t('20', '20'), t('18', '18'), t('37', '37')],
          0,
          t(
            'n=A−Z=37−17=20，不由电荷决定。',
            'n=A−Z=37−17=20, independent of charge.',
          ),
          'nuclear-ledger',
        ),
        q(
          'atomic105-check2',
          t(
            'p=17、q=−1 时，电子数是多少？',
            'For p=17 and q=−1, how many electrons?',
          ),
          [t('16', '16'), t('17', '17'), t('18', '18')],
          2,
          t(
            '负电多一份，e=p−q=18。',
            'One extra negative charge means e=p−q=18.',
          ),
          'signed-charge-ledger',
        ),
        q(
          'atomic105-check3',
          t(
            '不同氯同位素的粒子都可带 −1 电荷吗？',
            'Can particles of different chlorine isotopes both carry −1 charge?',
          ),
          [
            t('不行，同位素必须中性', 'No, isotopes must be neutral'),
            t(
              '可以，核内与电荷是两个判断',
              'Yes, nuclear identity and charge are separate judgments',
            ),
            t('只有中子带负电才行', 'Only if neutrons are negative'),
          ],
          1,
          t(
            '同位素关系不排除离子状态，中子也不带负电。',
            'An isotopic relationship does not rule out ion status; neutrons are not negative.',
          ),
          'isotope-and-ion',
        ),
      ],
    },
    questions: [
      q(
        'atomic105-q1',
        t(
          '某 Mg 粒子 Z=12、A=26、q=+2，其 p、n、e 分别为？',
          'For Mg with Z=12, A=26 and q=+2, what are p/n/e?',
        ),
        [
          t('12、14、14', '12, 14, 14'),
          t('12、14、10', '12, 14, 10'),
          t('14、12、10', '14, 12, 10'),
        ],
        1,
        t('p=12，n=26−12=14，e=12−2=10。', 'p=12, n=26−12=14 and e=12−2=10.'),
        'signed-charge-ledger',
        'application',
      ),
      q(
        'atomic105-q2',
        t(
          '钠-23 中性原子与钠-23⁺，哪项不同？',
          'What differs between neutral sodium-23 and sodium-23⁺?',
        ),
        [
          t('质子数', 'Proton count'),
          t('质量数', 'Mass number'),
          t('电子数和电荷', 'Electron count and charge'),
        ],
        2,
        t(
          '核相同，质量数同为 23；电子数与电荷不同。',
          'The nucleus and mass number 23 are shared; electrons and charge differ.',
        ),
        'nuclear-ledger',
      ),
      q(
        'atomic105-q3',
        t(
          '氯-35⁻ 与氯-37⁻ 应怎样描述？',
          'How should chlorine-35⁻ and chlorine-37⁻ be described?',
        ),
        [
          t(
            '不同同位素记录，且两者都是离子',
            'Different isotope records, both ions',
          ),
          t('都带电，所以不是同位素', 'Charged, so they cannot be isotopic'),
          t('中子数相同，只是电子数不同', 'Same neutrons, different electrons'),
        ],
        0,
        t(
          '同质子、不同中子判断同位素；p≠e 判断带电。',
          'Equal protons/different neutrons establish isotope difference; p≠e establishes charge.',
        ),
        'isotope-and-ion',
      ),
      q(
        'atomic105-q4',
        t(
          '中性 Ne 与 Na⁺ 都有 10 个电子，为什么仍是不同元素？',
          'Neutral Ne and Na⁺ both have 10 electrons. Why are they different elements?',
        ),
        [
          t('电子数已经决定了元素相同', 'Electron counts establish sameness'),
          t('质子数分别为 10 与 11', 'Their proton counts are 10 and 11'),
          t('Na⁺ 没有原子核', 'Na⁺ has no nucleus'),
        ],
        1,
        t(
          '元素身份看质子数，不能只看电子数。',
          'Element identity follows protons, not electron count alone.',
        ),
        'element-identity',
        'application',
      ),
      q(
        'atomic105-q5',
        t(
          '失去一个电子却保持同一个核，哪句准确？',
          'If one electron is lost while the nucleus is unchanged, which is accurate?',
        ),
        [
          t('质量数减少 1', 'Mass number decreases by one'),
          t('电子没有质量', 'Electrons are massless'),
          t(
            '质量数不变，但不能说精确质量完全不变',
            'Mass number stays unchanged, without claiming exact mass is unchanged',
          ),
        ],
        2,
        t(
          '质量数只清点质子与中子；电子质量不是零。',
          'Mass number counts protons and neutrons only; electron mass is not zero.',
        ),
        'mass-number-vs-mass',
      ),
      q(
        'atomic105-q6',
        t(
          '有人把氯-35 与氯-37 说成“同一个原子在化学操作中改了两个中子”。应怎样回应？',
          'Someone calls chlorine-35 and chlorine-37 “one atom gaining two neutrons in a chemical operation”. What should you say?',
        ),
        [
          t(
            '这里比较不同记录，不是在描述普通化学操作改变核',
            'These are different records, not ordinary chemical manipulation of a nucleus',
          ),
          t(
            '任何化学操作都会改中子',
            'Every chemical operation changes neutrons',
          ),
          t(
            '中子属于核外电子的一种',
            'Neutrons are a kind of outside electron',
          ),
        ],
        0,
        t(
          '同位素的比较不等于核转变过程，普通离子形成也不改变核。',
          'Comparing isotopes is not a nuclear transformation; ordinary ion formation also leaves the nucleus unchanged.',
        ),
        'comparison-vs-process',
        'application',
      ),
    ],
  },
  {
    id: 'isotope-abundance-and-mean',
    levelId: 'atoms',
    order: 106,
    nextLessonId: 'periodic-table',
    title: t(
      '平均质量有小数，是有半个中子吗？',
      'Does a decimal average mass mean half a neutron?',
    ),
    eyebrow: t(
      '原子衔接 2/2 · 先看配比，再算平均',
      'Atomic bridge 2/2 · Composition before averaging',
    ),
    hook: t(
      '题设样品有 75% 氯-35、25% 氯-37。如果先用 35 和 37 作质量近似，平均是 36，还是 35.5？这个小数属于哪一粒原子？',
      'A given sample is 75% chlorine-35 and 25% chlorine-37. Approximating their masses as 35 and 37, is the mean 36 or 35.5? Which individual atom has that decimal?',
    ),
    hookHint: t(
      '不是两种各一半，不能直接取正中间。平均描述整份样品的配比，不要求某个核含有半个中子。',
      'The two shares are unequal, so a midpoint is inappropriate. The mean describes the sample’s composition, not a nucleus with a fractional neutron.',
    ),
    bigIdea: t(
      '同位素按各自数量占比贡献平均相对质量；平均值可以是小数，不是某个核的质量数。',
      'Each isotope contributes according to its number fraction to a mean relative mass. A decimal mean is not one nucleus’s mass number.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '📊',
        title: t('多数决定靠近哪端', 'The larger share pulls the mean'),
        body: t(
          '较轻同位素多，平均更靠近轻的一端；两种各一半才是正中间。平均不应越过最轻和最重两端。',
          'More light isotope brings the mean nearer the light endpoint; only equal shares give a midpoint. The mean cannot lie beyond the two masses.',
        ),
      },
      {
        icon: '🧮',
        title: t(
          '平均不一定属于某一个体',
          'A mean need not equal one individual',
        ),
        body: t(
          '平均每户 3.4 人，不要求某户真的有 3.4 个人。类似地，小数平均质量不表示有小数个中子。',
          'A mean household size of 3.4 people requires no household with 3.4 people. Similarly, a decimal mean mass does not imply fractional neutrons.',
        ),
      },
      {
        icon: '🗂️',
        title: t(
          '题设配比不等于自然实测',
          'Given proportions are not measured nature',
        ),
        body: t(
          '本课可调的配比是练习条件。真实样品丰度可能不同，标准原子量也可能用区间表示。',
          'Adjustable proportions are task conditions. Real isotopic abundances can vary, and standard atomic weights may be intervals.',
        ),
      },
    ],
    steps: [
      {
        title: t('先数总份数和各自占比', 'Count shares before taking a mean'),
        body: t(
          '20 张配比卡中有 15 张轻、5 张重，表示 75% 与 25%。每张代表题设比例的 5%，不是从自然中测到二十个原子就得到精确丰度。',
          'Fifteen light and five heavy cards out of twenty mean 75% and 25%. Each card represents a 5% task share, not an exact natural abundance measured from twenty atoms.',
        ),
      },
      {
        title: t(
          '每种先贡献，再除以总数',
          'Sum contributions, then divide by total shares',
        ),
        body: t(
          '近似平均=(15×35+5×37)/20=35.5，也可写 0.75×35+0.25×37。不能直接把 35 与 37 相加除以 2，因为那假定各占一半。',
          'The approximate mean is (15×35+5×37)/20=35.5, or 0.75×35+0.25×37. Adding 35 and 37 then dividing by two incorrectly assumes equal shares.',
        ),
      },
      {
        title: t(
          '质量数只是入门近似',
          'Mass numbers are an introductory approximation',
        ),
        body: t(
          '35、37 是整数质量数，不是精确相对同位素质量。换成本课给定的 34.969、36.966，同样配比算出 35.46825，按本题要求保留两位为 35.47。数值不同不表示质子或中子变成小数。',
          'The mass numbers 35 and 37 are not exact relative isotope masses. Using the given 34.969 and 36.966 with the same shares gives 35.46825, or 35.47 to the task’s two decimal places. Fractional results do not make protons or neutrons fractional.',
        ),
      },
      {
        title: t(
          '区分一个核、一个样品和标准表',
          'Distinguish one nucleus, one sample and a standard table',
        ),
        body: t(
          '质量数 A 清点一个核的 p+n，必须为整数。样品相对原子质量是按其同位素配比得到的相对平均，无单位；标准表值还参考自然样品范围与数据精度。这里不计算一粒原子的克数，也不重建标准表。',
          'Mass number A counts p+n in one nucleus and is integral. Sample relative atomic mass is an isotope-weighted relative mean, without a unit. Standard tables also consider natural sample variation and data precision. This model computes neither grams per atom nor a replacement standard table.',
        ),
      },
    ],
    misconception: t(
      '“表上小数就是质量数”“小数说明半个中子”“两种同位素总取简单平均”都不对。需要区分质量数据、数量占比与平均的对象。',
      'A table decimal is not a mass number or a fractional neutron, and two isotopes do not always have an unweighted mean. Distinguish mass data, number fractions and what is being averaged.',
    ),
    mission: t(
      '先用 15 张轻卡、5 张重卡计算，再换成 5 张轻、15 张重。先预测平均向哪端移动，后算数字。再换硼的 10/11 卡作迁移，不查答案先解释方法。',
      'Calculate with fifteen light and five heavy cards, then swap the counts. Predict the mean’s direction before calculating. Transfer the method to boron 10/11 cards and explain it before checking answers.',
    ),
    vocabulary: [
      { en: 'isotopic abundance', zh: '同位素丰度' },
      { en: 'weighted mean', zh: '加权平均' },
      { en: 'relative isotopic mass', zh: '相对同位素质量' },
      { en: 'relative atomic mass', zh: '相对原子质量' },
    ],
    interactive: 'isotope-weighted-mean-lab',
    resources: [
      reading,
      {
        title: t(
          '数据：NIST 氯同位素质量',
          'Data: NIST chlorine isotope masses',
        ),
        url: 'https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=Cl',
      },
      {
        title: t(
          '迁移数据：NIST 硼同位素质量',
          'Transfer data: NIST boron isotope masses',
        ),
        url: 'https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=B',
      },
    ],
    learning: {
      prerequisites: ['isotope-and-ion-two-ledgers', 'mass-number'],
      objectives: [
        t(
          '按数量占比计算两种同位素的平均相对质量。',
          'Calculate a two-isotope mean relative mass using number fractions.',
        ),
        t(
          '先用端点与配比判断计算是否合理。',
          'Check a calculation using endpoints and composition first.',
        ),
        t(
          '区分质量数、近似质量和样品的平均相对质量。',
          'Distinguish mass number, approximate mass data and a sample’s relative mean.',
        ),
      ],
      workedExample: {
        prompt: t(
          '20 张氯配比卡，15 张为 35、5 张为 37，先以质量数作近似。平均是多少，应该更靠近哪端？',
          'Twenty chlorine cards contain fifteen 35 and five 37. Using mass numbers as approximations, find the mean and the nearer endpoint.',
        ),
        steps: [
          t(
            '轻的一种占 15/20=0.75，应更靠近 35。',
            'The light share is 15/20=0.75, so the mean should be nearer 35.',
          ),
          t('贡献合计 15×35+5×37=710。', 'Contributions total 15×35+5×37=710.'),
          t(
            '710/20=35.50，在 35 与 37 之间且靠近 35。',
            '710/20=35.50, between 35 and 37 and nearer 35.',
          ),
        ],
        answer: t(
          '近似平均 35.50，无单位；不是某个核含 35.5 个质子与中子。',
          'The approximate relative mean is 35.50, without a unit; no nucleus needs 35.5 total protons and neutrons.',
        ),
      },
      anotherWay: t(
        '平均像把每种同位素的“票数”算进去：多的一种有更多贡献。这里的“票”只代表数量比例，不能把质量数当作精确质量，也不能从平均值独自判断所有组成。',
        'An average includes each isotope’s “votes”: the more abundant kind contributes more. Votes represent number fractions only; mass numbers are not exact masses, and a mean alone does not generally reveal every component.',
      ),
      explainPrompt: t(
        '向家人解释为什么 75% 与 25% 不能直接取 35 和 37 的中点，再说明为什么换精细质量数据会改变平均，却不改变每个核的整数质量数。',
        'Explain why 75%/25% cannot use the midpoint of 35 and 37, then why refined mass data change the mean without changing each nucleus’s integral mass number.',
      ),
      quickChecks: [
        q(
          'atomic106-check1',
          t(
            '轻的一种占 75%，平均应在哪里？',
            'If the light isotope is 75%, where should the mean lie?',
          ),
          [
            t('必在正中间', 'Always halfway'),
            t('更靠近轻端', 'Nearer the light end'),
            t('超出重端', 'Beyond the heavy end'),
          ],
          1,
          t(
            '每种贡献按数量比例加权，不按种类平分。',
            'Contributions are weighted by number fraction, not split equally by type.',
          ),
          'isotope-weights',
        ),
        q(
          'atomic106-check2',
          t(
            '样品平均有小数，是否要求某个核有半个中子？',
            'Does a decimal sample mean require a nucleus with half a neutron?',
          ),
          [
            t(
              '不要求，平均不是某个核的质量数',
              'No; a mean is not one nucleus’s mass number',
            ),
            t('要求，否则不能平均', 'Yes, otherwise averaging is impossible'),
            t('说明电子变成中子', 'It means electrons became neutrons'),
          ],
          0,
          t(
            '个体的整数清点与样品平均是不同对象。',
            'Integral individual counts and sample averages describe different things.',
          ),
          'mean-vs-mass-number',
        ),
        q(
          'atomic106-check3',
          t(
            '本课题设相对平均应该带什么单位？',
            'What unit belongs to this relative mean?',
          ),
          [t('g', 'g'), t('个中子', 'Neutrons'), t('无单位', 'No unit')],
          2,
          t(
            '相对质量是比值；不能写成某粒原子的克数。',
            'Relative mass is a ratio, not grams for an individual atom.',
          ),
          'relative-mass-scale',
        ),
      ],
    },
    questions: [
      q(
        'atomic106-q1',
        t(
          '75% 的 35 与 25% 的 37，用质量数近似的平均是？',
          'Using mass-number approximations, what is the mean of 75% 35 and 25% 37?',
        ),
        [t('36.00', '36.00'), t('35.25', '35.25'), t('35.50', '35.50')],
        2,
        t('0.75×35+0.25×37=35.50。', '0.75×35+0.25×37=35.50.'),
        'isotope-weights',
      ),
      q(
        'atomic106-q2',
        t(
          '较轻同位素比例增加，其余条件不变，平均怎样移动？',
          'With fixed isotope masses, how does the mean move as the light share increases?',
        ),
        [
          t('向较轻端移动', 'Towards the lighter endpoint'),
          t('一定不变', 'It must stay fixed'),
          t('超过较重端', 'Beyond the heavier endpoint'),
        ],
        0,
        t(
          '较轻项的权重变大，平均随之下降但不低于轻端。',
          'The light contribution gains weight; the mean falls without going below the light endpoint.',
        ),
        'endpoint-check',
        'application',
      ),
      q(
        'atomic106-q3',
        t(
          '某平均相对质量为 35.47，哪句准确？',
          'Which accurately interprets a relative mean of 35.47?',
        ),
        [
          t('每个核有 35.47 个核子', 'Every nucleus has 35.47 nucleons'),
          t(
            '它描述题设样品的相对平均，不是一个核的质量数',
            'It describes a relative sample mean, not one nucleus’s mass number',
          ),
          t('一粒原子必重 35.47 g', 'One atom must weigh 35.47 g'),
        ],
        1,
        t(
          '小数平均属于样品统计与相对尺度，不是核内粒子的分数。',
          'The decimal belongs to sample averaging on a relative scale, not fractional nuclear particles.',
        ),
        'mean-vs-mass-number',
      ),
      q(
        'atomic106-q4',
        t(
          '用给定质量 34.969、36.966 及 75%/25%，结果按两位小数应是？',
          'Using supplied masses 34.969 and 36.966 with 75%/25%, what is the mean to two decimal places?',
        ),
        [t('35.50', '35.50'), t('36.00', '36.00'), t('35.47', '35.47')],
        2,
        t(
          '加权得 35.46825，按本题要求保留两位为 35.47；质量数近似与给定小数数据应分开。',
          'The weighted result is 35.46825, rounded to 35.47 for this task. Distinguish mass-number approximations from the supplied decimal data.',
        ),
        'mass-data-precision',
        'application',
      ),
      q(
        'atomic106-q5',
        t(
          '题设硼样品 20% 为 10、80% 为 11，用质量数近似，平均为？',
          'A given boron sample is 20% 10 and 80% 11. Using mass-number approximations, what is the mean?',
        ),
        [t('10.80', '10.80'), t('10.50', '10.50'), t('11.20', '11.20')],
        0,
        t(
          '0.20×10+0.80×11=10.80，靠近数量更多的 11。',
          '0.20×10+0.80×11=10.80, nearer the more abundant 11.',
        ),
        'isotope-transfer',
        'application',
      ),
      q(
        'atomic106-q6',
        t(
          '可任意调整的练习配比能直接当作自然界精确丰度吗？',
          'Can freely adjustable task proportions be treated as exact natural abundances?',
        ),
        [
          t('能，屏幕上的都等于实测', 'Yes, everything displayed is measured'),
          t(
            '不能，这是题设；标准数据还要考虑真实样品与精度',
            'No; task conditions differ from standard data based on real samples and precision',
          ),
          t('能，因为质量数都是整数', 'Yes, because mass numbers are integers'),
        ],
        1,
        t(
          '模型练方法，不代替自然丰度测量或标准原子量表。',
          'The model teaches a method, not natural abundance measurements or standard atomic-weight tables.',
        ),
        'model-vs-standard',
      ),
    ],
  },
];
