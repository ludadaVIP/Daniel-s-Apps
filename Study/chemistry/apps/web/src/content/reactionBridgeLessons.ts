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
export const reactionBridgeLessons: Lesson[] = [
  {
    id: 'clues-before-reaction-verdict',
    levelId: 'reactions',
    order: 113,
    nextLessonId: 'atoms-conserved-molecules-change',
    title: t(
      '冒泡、变色、出现固体，就一定反应了吗？',
      'Do bubbles, colour or solids always mean a reaction?',
    ),
    eyebrow: t(
      '反应衔接 1/2 · 现象、身份与证据范围',
      'Reaction bridge 1/2 · Appearance, identity and evidence scope',
    ),
    hook: t(
      '一杯水沸腾会冒泡，某些酸与碳酸氢盐接触也会冒泡。外观看起来相似，为什么不能作同一个判断？',
      'Boiling water bubbles, and some acids meeting hydrogen carbonates also bubble. Why can similar appearances support different judgments?',
    ),
    hookHint: t(
      '先把看到的现象与对新物质的判断分开。物质身份的前后对照，能补上外观没有给出的信息。',
      'Separate what was observed from the claim that new substances formed. Before/after identities can supply information that appearance lacks.',
    ),
    bigIdea: t(
      '现象提供线索；是否形成新物质要看身份与组成证据，证据不足时可以保留判断。',
      'Appearance gives clues; new-substance claims need identity and composition evidence, and a judgment can remain unresolved.',
    ),
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🫧',
        title: t('同样是气泡', 'Bubbles can have different meanings'),
        body: t(
          '纯水沸腾的蒸气仍是 H₂O；指定酸与碳酸氢盐的教学记录则确认形成新的 CO₂。不能只按“有气泡”分类。',
          'Pure-water vapour remains H₂O, whereas a specified acid–hydrogen carbonate teaching record confirms newly formed CO₂. Bubbles alone do not classify the process.',
        ),
      },
      {
        icon: '🧂',
        title: t(
          '同样出现白色固体',
          'White solids can have different meanings',
        ),
        body: t(
          '食盐从水中结晶，与题设确认形成新 AgCl 的记录不同。颜色和出现固体都不能单独告诉我们物质身份。',
          'Salt crystallising from water differs from a record confirming new AgCl. Neither white colour nor solid appearance alone identifies the substance.',
        ),
      },
      {
        icon: '🧊',
        title: t('温度也会给出相似线索', 'Temperature can give similar clues'),
        body: t(
          '冰在纯水中融化可使水降温，而物质仍是 H₂O。未知材料降温时，若没有身份信息，仍不能断言它属于哪类变化。',
          'Ice melting in pure water can cool it while H₂O remains H₂O. Cooling unknown materials without identity information does not establish the change type.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先只写观察，不偷偷加原因',
          'Record the observation without adding a cause',
        ),
        body: t(
          '“有气泡”“表面变黑”“温度下降”描述现象。“生成新气体”“形成氧化物”已经涉及物质身份。没有额外证据时，不把后者当作亲眼看见的事实。',
          '“Bubbles appeared”, “the surface blackened” and “temperature fell” describe observations. “A new gas formed” and “an oxide formed” add identity claims that need more evidence.',
        ),
      },
      {
        title: t(
          '再比较前后的物质身份',
          'Then compare before/after substance identities',
        ),
        body: t(
          '本课给定的完整身份清单若保持不变，支持这里的物理变化；若身份记录确认形成新物质，支持化学变化。清单是题设条件，不是仅凭颜色猜出来的。',
          'An unchanged complete identity list supports physical change in this lesson. Supplied confirmation of a new substance supports chemical change. These identities are given conditions, not colour guesses.',
        ),
      },
      {
        title: t(
          '相同外观，要允许不同解释',
          'Allow different explanations for similar appearances',
        ),
        body: t(
          '气泡可来自液体沸腾，也可来自新气体形成；白色固体可来自原有盐结晶，也可来自新物质生成。判断依据是本次记录，不是把见过的一个例子套到所有情况。',
          'Bubbles can come from boiling or newly formed gas; white solids from crystallising existing salt or forming a new substance. Judge the current record rather than copying one example onto every case.',
        ),
      },
      {
        title: t(
          '证据不足不等于没有变化',
          'Insufficient evidence is not evidence of no reaction',
        ),
        body: t(
          '如果补充记录只是“又观察到一次降温”，仍没有前后身份对照，就继续保留判断。重复提高我们对现象出现的信心，却不自动补上它为什么发生、是否形成新物质的信息。',
          'If the added record only repeats cooling without before/after identities, keep the judgment unresolved. Repetition can strengthen confidence in an observation without supplying its cause or showing whether new substances formed.',
        ),
      },
    ],
    misconception: t(
      '气泡、变色、固体、温度变化都是线索，不是万能判决；可逆与不可逆也不是唯一标准。没有看到明显现象，或暂时缺少身份信息，都不等于已证明没有反应。',
      'Bubbles, colour, solids and temperature are clues, not universal verdicts; reversibility is not the sole test either. No obvious sign or missing identity information does not prove no reaction.',
    ),
    mission: t(
      '选两张外观相似的记录卡，先写现象，再打开身份记录。用自己的话解释判断是否改变、是哪条证据使它改变；再找一张补充后仍不能确定的卡。只读给定记录，不接触试剂。',
      'Choose two cards with similar appearances. State the observations, then open identity records. Explain whether your judgment changed and which evidence changed it; find a card that remains inconclusive. Read the supplied records without handling reagents.',
    ),
    vocabulary: [
      { en: 'observation', zh: '观察记录' },
      { en: 'substance identity', zh: '物质身份' },
      { en: 'evidence', zh: '证据' },
      { en: 'insufficient evidence', zh: '证据不足' },
      { en: 'crystallisation', zh: '结晶' },
    ],
    interactive: 'change-evidence-record-lab',
    resources: [
      {
        title: t(
          '拓展：物理变化与化学变化',
          'Read more: physical and chemical changes',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/1-3-physical-and-chemical-properties',
      },
    ],
    learning: {
      prerequisites: [
        'what-is-a-chemical-reaction',
        'physical-vs-chemical-change',
        'observation-before-explanation',
      ],
      objectives: [
        t(
          '区分外观记录与新物质形成的推断。',
          'Separate an appearance record from an inference of new substances.',
        ),
        t(
          '根据给定身份信息修正判断并说明理由。',
          'Revise a judgment using supplied identity evidence and explain why.',
        ),
        t(
          '识别补充后仍不足的证据，不把未知当作否定。',
          'Recognise evidence that remains insufficient without treating uncertainty as a negative result.',
        ),
      ],
      workedExample: {
        prompt: t(
          'A 与 B 都只给出“液体冒泡”。之后 A 确认是纯水沸腾，B 的给定身份记录确认新 CO₂ 形成。如何分别判断？',
          'A and B initially report only bubbles. Later A is identified as pure-water boiling and B’s supplied identities confirm new CO₂. How should each be judged?',
        ),
        steps: [
          t(
            '仅凭气泡，两次都先保留判断，因为缺少物质身份对照。',
            'With bubbles alone, both remain unresolved because identity comparisons are missing.',
          ),
          t(
            'A 的完整记录确认 H₂O 身份保持，只变状态，支持物理变化。',
            'A’s complete record keeps H₂O identity and changes state, supporting physical change.',
          ),
          t(
            'B 的记录确认新物质形成，支持化学变化；不是气泡本身完成了鉴定。',
            'B confirms a new substance, supporting chemical change; the bubbles did not themselves identify it.',
          ),
        ],
        answer: t(
          '外观相似，补充身份记录不同，所以判断可以不同。',
          'Similar appearances can lead to different judgments when identity evidence differs.',
        ),
      },
      quickChecks: [
        q(
          'reaction-evidence-check-1',
          t(
            '只知道一杯未知液体冒泡，能判断什么？',
            'What follows from bubbles in an unknown liquid alone?',
          ),
          [
            t('一定反应了', 'Definitely reacted'),
            t('一定没有反应', 'Definitely did not react'),
            t(
              '身份信息不足，暂不能确定',
              'Identity information is insufficient',
            ),
          ],
          2,
          t(
            '气泡也可能来自状态变化或原先气体逸出。',
            'Bubbles can also reflect phase change or release of pre-existing gas.',
          ),
          'appearance-vs-identity',
        ),
        q(
          'reaction-evidence-check-2',
          t(
            '哪条最直接支持本题的化学变化？',
            'Which most directly supports chemical change here?',
          ),
          [
            t(
              '题设确认形成原先没有的新物质',
              'The supplied identities confirm a newly formed substance',
            ),
            t('白色看起来很明显', 'The white colour is obvious'),
            t('记录写了两遍', 'The record is repeated twice'),
          ],
          0,
          t(
            '新物质的身份是关键，外观与重复次数不能代替它。',
            'New-substance identity matters; appearance and repetition cannot substitute for it.',
          ),
          'new-substance-evidence',
        ),
        q(
          'reaction-evidence-check-3',
          t(
            '未知材料两次都降温，但仍无身份对照。该怎样说？',
            'Unknown materials cool twice but still have no identity comparison. What should be said?',
          ),
          [
            t('重复两次就必定是反应', 'Two repeats prove reaction'),
            t(
              '降温现象得到重复，变化类型仍不能确定',
              'Cooling was repeated, but the change type remains unresolved',
            ),
            t(
              '证据不足，所以已证明没有反应',
              'Insufficient evidence proves no reaction',
            ),
          ],
          1,
          t(
            '重复观察与补上缺失身份信息，是不同的事。',
            'Repeating an observation differs from supplying missing identity information.',
          ),
          'uncertainty-not-negative',
        ),
      ],
      anotherWay: t(
        '把现象当成侦探线索，把物质身份当成核对对象。线索帮助提出问题，但同一线索可对应多个过程。这里“暂不能确定”是保留证据边界，不是随意猜一个答案。',
        'Treat appearance as a detective clue and substance identity as something to check. One clue can fit several processes. “Not established yet” respects the evidence boundary instead of guessing.',
      ),
      explainPrompt: t(
        '不看选项，用“我观察到……；补充证据说明……；所以当前支持……；还不能说明……”解释一张记录卡。',
        'Without options, explain a card using “I observed …; the added evidence says …; this supports …; it does not yet establish …”.',
      ),
    },
    questions: [
      q(
        'reaction-evidence-q1',
        t(
          '给定完整记录确认液态水变成蒸气，前后都是 H₂O。哪项合理？',
          'A complete record identifies liquid water becoming vapour, both H₂O. Which is reasonable?',
        ),
        [
          t('有气泡，所以一定形成新物质', 'Bubbles prove a new substance'),
          t(
            '身份保持，支持物理状态变化',
            'Unchanged identity supports a physical phase change',
          ),
          t('H₂O 变成 H₂ 与 O₂', 'H₂O became H₂ and O₂'),
        ],
        1,
        t(
          '状态改变不等于分子身份改变。',
          'A state change does not itself change molecular identity.',
        ),
        'appearance-vs-identity',
        'application',
      ),
      q(
        'reaction-evidence-q2',
        t(
          'C 与 D 都有白色固体，为什么本题判断不同？',
          'C and D both show white solids. Why do their judgments differ?',
        ),
        [
          t('固体数量不同就一定不同', 'Different amounts decide the type'),
          t('C 的字母排在前面', 'C comes first alphabetically'),
          t(
            'C 记录原有盐结晶，D 确认新 AgCl 形成',
            'C records original salt crystallising; D confirms newly formed AgCl',
          ),
        ],
        2,
        t(
          '身份对照提供区别，白色外观本身不能鉴定或分类。',
          'Identity evidence makes the distinction; white appearance alone cannot identify or classify.',
        ),
        'new-substance-evidence',
        'application',
      ),
      q(
        'reaction-evidence-q3',
        t(
          '蓝、黄色素混合变绿；题设完整清单确认分子种类不变。支持什么？',
          'Blue/yellow dyes look green; the complete supplied inventory preserves their molecule identities. What is supported?',
        ),
        [
          t(
            '物理混合，不能仅凭绿色推断新物质',
            'Physical mixing; green alone does not establish a new substance',
          ),
          t('只要变色一定反应', 'Every colour change is reaction'),
          t(
            '所有色素在任何条件下都不反应',
            'All dyes never react under any conditions',
          ),
        ],
        0,
        t(
          '结论限题设的不反应混合，不能推广到未知材料。',
          'The conclusion is limited to the specified non-reacting mixture, not arbitrary materials.',
        ),
        'evidence-scope',
        'application',
      ),
      q(
        'reaction-evidence-q4',
        t(
          '一张表只重复记录了降温，没有组成信息。哪条解释合适？',
          'A table only repeats cooling without composition information. Which explanation fits?',
        ),
        [
          t('一定是吸热反应', 'Definitely an endothermic reaction'),
          t(
            '降温可确认，但是否反应仍缺证据',
            'Cooling is recorded, but reaction still lacks evidence',
          ),
          t('一定是冰融化', 'Definitely melting ice'),
        ],
        1,
        t(
          '不同过程都可能降温，重复同一读数没有给出物质身份。',
          'Several processes can cool; repetition does not provide identities.',
        ),
        'uncertainty-not-negative',
      ),
      q(
        'reaction-evidence-q5',
        t(
          '给定铜/氧体系记录确认新 CuO。哪句话没有越过证据？',
          'A specified copper/oxygen record confirms new CuO. Which claim stays within the evidence?',
        ),
        [
          t('任意黑色固体都是 CuO', 'Every black solid is CuO'),
          t(
            '任何表面变黑都是同一种反应',
            'Every blackened surface underwent this reaction',
          ),
          t(
            '本题新物质身份支持化学变化，不能只凭黑色鉴定未知物',
            'The supplied new identity supports chemical change, without identifying unknown solids by black colour',
          ),
        ],
        2,
        t(
          '把特定身份记录和普遍颜色判断分开。',
          'Keep a specific identity record separate from a universal colour rule.',
        ),
        'evidence-scope',
        'application',
      ),
      q(
        'reaction-evidence-q6',
        t(
          '“目前证据不足以确定反应”是什么意思？',
          'What does “a reaction is not established by current evidence” mean?',
        ),
        [
          t(
            '还需相关证据，不等于已证明没有反应',
            'Relevant evidence is still needed; no reaction has not been proved',
          ),
          t('确定完全没有反应', 'Definitely no reaction at all'),
          t('原子已经消失', 'Atoms have disappeared'),
        ],
        0,
        t(
          '不确定与否定是不同判断。',
          'An unresolved judgment differs from a negative conclusion.',
        ),
        'uncertainty-not-negative',
      ),
    ],
  },
  {
    id: 'atoms-conserved-molecules-change',
    levelId: 'reactions',
    order: 114,
    nextLessonId: 'acids-bases-and-ph',
    title: t(
      '反应前 3 个分子，反应后 2 个，少了东西吗？',
      'Three molecules before and two after: did matter go missing?',
    ),
    eyebrow: t(
      '反应衔接 2/2 · 逐元素守恒，不守分子总个数',
      'Reaction bridge 2/2 · Conserve each element, not molecule totals',
    ),
    hook: t(
      '2H₂ + O₂ → 2H₂O 左边 3 个分子，右边只有 2 个。若说“数量必须一样”，究竟要数原子还是分子？',
      '2H₂ + O₂ → 2H₂O has three molecules on the left and two on the right. When counts must match, are we counting atoms or molecules?',
    ),
    hookHint: t(
      '先拆成每种元素的原子清单：左右各有 4 H、2 O。组合成几个分子是另一种数法。',
      'List each element’s atoms first: both sides have four H and two O. How many molecules contain them is a different count.',
    ),
    bigIdea: t(
      '配平逐种核对原子数；分子可以重新组合，所以分子总个数不必相等。',
      'Balancing audits every element’s atom count; molecules can regroup, so total molecule counts need not be equal.',
    ),
    estimatedMinutes: 19,
    everydayExamples: [
      {
        icon: '💧',
        title: t(
          '3 个变 2 个，原子没少',
          'Three become two without losing atoms',
        ),
        body: t(
          '两份 H₂ 与一份 O₂ 的组成，对应两份 H₂O；原子各自对应，分子清单从 3 个变 2 个。这里只作指定组成记账，不是操作实验。',
          'Two H₂ and one O₂ correspond compositionally to two H₂O. Each atom type matches while molecule totals change from three to two. This is accounting, not an experiment.',
        ),
      },
      {
        icon: '🫧',
        title: t('2 个也可以对应 3 个', 'Two can correspond to three'),
        body: t(
          '2H₂O₂ → 2H₂O + O₂ 左右各有 4 H、4 O，但分子总个数由 2 变 3。氧要把右边两种分子的贡献相加。',
          '2H₂O₂ → 2H₂O + O₂ has four H and four O on each side, while molecules change from two to three. Add oxygen from both product species.',
        ),
      },
      {
        icon: '🧩',
        title: t('相等也可能错', 'Equal totals can still fail'),
        body: t(
          'H₂ + O₂ → 2H₂O 两边都写了 2 个分子，却把 H 从 2 数成 4。分子总个数相等并不能替代逐元素核对。',
          'H₂ + O₂ → 2H₂O has two molecules on each side but changes H from two to four. Equal molecule totals cannot replace an element-by-element audit.',
        ),
      },
    ],
    steps: [
      {
        title: t(
          '先认分子的身份和内部组成',
          'Identify molecules and their internal composition',
        ),
        body: t(
          '本课给定 H₂、O₂、H₂O、N₂、NH₃、CO、CO₂、H₂O₂、Cl₂、HCl 的组成。一个小框表示一个指定分子，框内圆点只清点原子，不表示真实形状、化学键或轨道。',
          'This lesson supplies H₂, O₂, H₂O, N₂, NH₃, CO, CO₂, H₂O₂, Cl₂ and HCl compositions. Each box is one specified molecule; dots count atoms, not actual geometry, bonds or orbitals.',
        ),
      },
      {
        title: t(
          '每种原子分别算左右总数',
          'Total each element separately on each side',
        ),
        body: t(
          '把每个分子内该元素的个数乘系数，再把同侧不同物质的贡献相加。不能用“原子总数一样”代替“每种元素都一样”，也不能用分子数相等代替原子守恒。',
          'Multiply atoms per molecule by its coefficient and add all same-side contributions. Equal total atoms cannot replace equal counts for every element, nor can equal molecule totals replace atom conservation.',
        ),
      },
      {
        title: t(
          '把分子总个数当作另一条记录',
          'Keep molecule totals as a separate record',
        ),
        body: t(
          '2H₂+O₂→2H₂O 的分子数是 3 与 2，但 H 为 4 与 4、O 为 2 与 2。H₂+Cl₂→2HCl 则原子对应、分子数也相等。分子个数可以改变，也不是每个反应都必须改变。',
          'For 2H₂+O₂→2H₂O, molecules total three and two, but H is four/four and O two/two. H₂+Cl₂→2HCl balances atoms with equal molecule totals too. Molecule counts can change, but need not change in every reaction.',
        ),
      },
      {
        title: t(
          '配平检查不替代真实反应证据',
          'A balance check does not replace real reaction evidence',
        ),
        body: t(
          '可以只调整系数核对指定方程式，不能把 H₂O 改成 H₂O₂ 来凑数。闭合的原子账本也不证明反应已经发生、能够按某条件开始或完全；氨的真实合成还涉及可逆性和条件。',
          'Adjust coefficients to audit the specified equation; do not turn H₂O into H₂O₂ to force a match. Atom balance does not prove occurrence, feasibility under conditions or completion; real ammonia synthesis also involves reversibility and conditions.',
        ),
      },
    ],
    misconception: t(
      '守恒的是每种元素的原子，不是分子总个数，也不是把所有原子混在一起的一个总数。正确识别未配平候选，是答题正确，不会自动把候选变成配平式。',
      'Conserve each element’s atoms, not molecule totals or one mixed total of all atoms. Correctly diagnosing an unbalanced candidate is a correct answer, not a balanced equation.',
    ),
    mission: t(
      '先给 H₂+O₂→2H₂O 写逐元素清单，指出为什么分子数相等仍错误。再改系数到 2:1:2，解释分子数不同而原子对应。换到过氧化氢分解，自己合计右边的氧。',
      'Audit H₂+O₂→2H₂O element by element and explain why equal molecules still fail. Change coefficients to 2:1:2 and explain unequal molecule totals with conserved atoms. Transfer to peroxide decomposition and add oxygen from both products.',
    ),
    vocabulary: [
      { en: 'atom inventory', zh: '原子清单' },
      { en: 'molecule count', zh: '分子个数' },
      { en: 'coefficient', zh: '系数' },
      { en: 'balanced equation', zh: '配平的方程式' },
      { en: 'specified reaction', zh: '指定反应' },
    ],
    interactive: 'atom-molecule-conservation-lab',
    resources: [
      {
        title: t(
          '拓展：书写与配平方程式',
          'Read more: writing and balancing equations',
        ),
        url: 'https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations',
      },
    ],
    learning: {
      prerequisites: [
        'clues-before-reaction-verdict',
        'balancing-equations',
        'coefficients-and-molecular-subscripts',
      ],
      objectives: [
        t(
          '从指定分子清单计算每种元素的左右原子总数。',
          'Calculate left/right totals for each element from supplied molecule inventories.',
        ),
        t(
          '用反例区分分子个数相等与原子守恒。',
          'Use counterexamples to separate equal molecule totals from atom conservation.',
        ),
        t(
          '说明配平检查没有证明反应发生、条件或完成程度。',
          'Explain why a balance check does not prove occurrence, conditions or completion.',
        ),
      ],
      workedExample: {
        prompt: t(
          'H₂ + O₂ → 2H₂O 两边分子总个数相等。这个候选配平了吗？怎样改？',
          'H₂ + O₂ → 2H₂O has equal molecule totals. Is it balanced, and how should it change?',
        ),
        steps: [
          t(
            '左边两个分子，右边两个分子；但这不是配平条件。',
            'Both sides show two molecules, but this is not the balance requirement.',
          ),
          t(
            '左 H=2、O=2；右 H=4、O=2。氢不对应。',
            'Left H=2 and O=2; right H=4 and O=2. Hydrogen does not match.',
          ),
          t(
            '只把 H₂ 系数改为 2：左右 H=4、O=2；分子数变成 3 与 2。',
            'Change only the H₂ coefficient to two: both sides have H=4 and O=2; molecule totals become three and two.',
          ),
        ],
        answer: t(
          '原候选未配平；2H₂ + O₂ → 2H₂O 的原子账本闭合，不要求分子数相等。',
          'The original candidate fails. 2H₂ + O₂ → 2H₂O closes the atom ledger without equal molecule totals.',
        ),
      },
      quickChecks: [
        q(
          'reaction-atoms-check-1',
          t('配平必须核对哪项？', 'What must balancing audit?'),
          [
            t(
              '每种元素的原子分别对应',
              'Each element’s atom count matches separately',
            ),
            t('两边分子总个数相等', 'Equal molecule totals'),
            t('两边物质种类数相等', 'Equal numbers of substance types'),
          ],
          0,
          t(
            '分子和物质种类可重新组合，逐种原子必须保留。',
            'Molecules and substance types can regroup; each atom type must remain.',
          ),
          'each-element-conserved',
        ),
        q(
          'reaction-atoms-check-2',
          t(
            '2H₂+O₂→2H₂O 的分子总个数是？',
            'What are molecule totals in 2H₂+O₂→2H₂O?',
          ),
          [
            t('2 与 2', 'Two and two'),
            t('6 与 6', 'Six and six'),
            t(
              '3 与 2，仍可逐元素配平',
              'Three and two, with each element still balanced',
            ),
          ],
          2,
          t(
            '左边 2+1 个分子，右边 2；原子为两边各 4 H、2 O。',
            'Left molecules are 2+1, right two; both sides have four H and two O.',
          ),
          'molecules-not-conserved',
        ),
        q(
          'reaction-atoms-check-3',
          t(
            '配平后能否仅凭这张式子断言真实反应完全？',
            'Does a balanced equation alone establish complete real reaction?',
          ),
          [
            t(
              '能，所有系数是整数就完成了',
              'Yes, integer coefficients guarantee completion',
            ),
            t(
              '不能，条件与实际程度还需证据',
              'No, conditions and actual extent still need evidence',
            ),
            t('不能，因为原子一定少了', 'No, because atoms must be missing'),
          ],
          1,
          t(
            '组成对应是必要核对，不是条件或产率模型。',
            'Composition balance is a necessary audit, not a model of conditions or yield.',
          ),
          'balance-not-occurrence',
        ),
      ],
      anotherWay: t(
        '把原子想成有字母标签的积木，把分子想成给定的成组结构。积木可换组，组数可以变；每种标签各有多少仍要核对。框内圆点只是组成清单，不模拟真实断键、运动或碰撞过程。',
        'Think of atoms as letter-labelled blocks and molecules as specified groups. Blocks can regroup and group totals can change; count every label separately. Dots are composition records, not simulated bond breaking, motion or collisions.',
      ),
      explainPrompt: t(
        '不看选项，用一个“分子数相同却未配平”的例子和一个“分子数不同却配平”的例子，解释两种数法为什么不能混用。',
        'Without options, give one equal-molecule but unbalanced example and one unequal-molecule but balanced example, and explain why these counts cannot be interchanged.',
      ),
    },
    questions: [
      q(
        'reaction-atoms-q1',
        t(
          '2H₂+O₂→2H₂O 的哪份记录正确？',
          'Which record is correct for 2H₂+O₂→2H₂O?',
        ),
        [
          t('H 从 2 变成 4', 'H changes from two to four'),
          t('分子数必须 3 与 3', 'Molecule totals must be three and three'),
          t(
            'H 各 4、O 各 2；分子数 3 与 2',
            'Four H and two O on each side; molecule totals three and two',
          ),
        ],
        2,
        t(
          '系数乘内部组成；分子数不是被要求守恒的数量。',
          'Multiply coefficients by internal compositions; molecule count is not the conserved requirement.',
        ),
        'each-element-conserved',
        'application',
      ),
      q(
        'reaction-atoms-q2',
        t('H₂+O₂→2H₂O 为什么未配平？', 'Why is H₂+O₂→2H₂O unbalanced?'),
        [
          t(
            '左 H=2、右 H=4，即使分子数相同也不行',
            'Left H=2, right H=4, despite equal molecules',
          ),
          t('因为两边分子数不同', 'Because molecule counts differ'),
          t('因为 O 不对应', 'Because oxygen does not match'),
        ],
        0,
        t(
          '这里氧是 2 与 2；错误在氢，不能用分子数抵消。',
          'Oxygen is two/two; hydrogen fails and molecule totals cannot repair it.',
        ),
        'molecule-equality-not-balance',
        'application',
      ),
      q(
        'reaction-atoms-q3',
        t(
          '2H₂O₂→2H₂O+O₂ 右边有几个 O 原子？',
          'How many O atoms are on the right of 2H₂O₂→2H₂O+O₂?',
        ),
        [
          t('2', '2'),
          t('4：水中 2，氧分子中 2', 'Four: two in water and two in oxygen'),
          t('3：物质个数相加', 'Three: adding species counts'),
        ],
        1,
        t(
          '同侧同种元素的贡献要相加，不能漏掉另一种产物。',
          'Add contributions of the same element from both product species.',
        ),
        'add-same-side-elements',
        'application',
      ),
      q(
        'reaction-atoms-q4',
        t(
          'H₂+Cl₂→2HCl 这份分子清单说明什么？',
          'What does the molecular inventory H₂+Cl₂→2HCl show?',
        ),
        [
          t(
            '所有反应的分子总个数都必须相等',
            'All reactions must have equal molecule totals',
          ),
          t(
            '分子总个数相同就不可能形成新物质',
            'Equal molecule totals make new substances impossible',
          ),
          t(
            '每种原子数对应时，分子总个数也可以相等；不要求它一定改变',
            'Each element can balance with equal molecule totals; those totals need not always change',
          ),
        ],
        2,
        t(
          '两边各有 2 H、2 Cl，分子总数各为 2。配平要求原子对应，允许分子总数相同或不同。',
          'Both sides have two H and two Cl, with two molecules on each side. Atom balance allows equal or unequal molecule totals.',
        ),
        'each-element-conserved',
        'application',
      ),
      q(
        'reaction-atoms-q5',
        t(
          '有人为凑原子数，把指定反应中的 H₂O 改成 H₂O₂。问题在哪里？',
          'Someone changes specified H₂O to H₂O₂ to force atom counts. What is wrong?',
        ),
        [
          t('所有系数都不能改', 'No coefficient may change'),
          t(
            '改了分子身份，不是配平原指定反应',
            'It changes molecule identity instead of balancing the specified reaction',
          ),
          t('H₂O₂ 中没有氧', 'H₂O₂ has no oxygen'),
        ],
        1,
        t(
          '配平只调整系数，分子内部组成属于已指定物质。',
          'Balance changes coefficients; internal composition belongs to the specified substance.',
        ),
        'fixed-substance-identity',
      ),
      q(
        'reaction-atoms-q6',
        t(
          '原子账本闭合后，哪条结论仍不能仅凭此获得？',
          'Which conclusion is still not established by a closed atom ledger alone?',
        ),
        [
          t(
            '真实反应已经发生并完全完成',
            'The real reaction occurred and went to completion',
          ),
          t('两边每种元素的原子数对应', 'Each element’s counts match'),
          t(
            '这份候选通过了原子数检查',
            'The candidate passes an atom-count audit',
          ),
        ],
        0,
        t(
          '实际发生、条件、速率与程度需要别的证据或模型。',
          'Occurrence, conditions, rate and extent require other evidence or models.',
        ),
        'balance-not-occurrence',
      ),
    ],
  },
];
