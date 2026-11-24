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
const phases = {
  title: t('拓展：物质状态与分子', 'Read more: phases and molecules'),
  url: 'https://openstax.org/books/chemistry-2e/pages/1-2-phases-and-classification-of-matter',
};
const changes = {
  title: t(
    '拓展：物理变化与化学变化',
    'Read more: physical and chemical changes',
  ),
  url: 'https://openstax.org/books/chemistry-2e/pages/1-3-physical-and-chemical-properties',
};
export const particleBridgeLessons: Lesson[] = [
  {
    id: 'state-change-particle-evidence',
    nextLessonId: 'dissolving-is-not-melting',
    levelId: 'matter',
    order: 101,
    title: t(
      '水变成气体，分子也变大了吗？',
      'When water becomes gas, do its molecules grow?',
    ),
    eyebrow: t(
      '粒子衔接 1/2 · 检查一张微观图',
      'Particle bridge 1/2 · Audit a microscopic picture',
    ),
    hook: t(
      '同一份水变成水蒸气，有人把分子画得更大，有人少画几个，还有人只改变间距。哪张图能和“同一份水”对上账？',
      'For the same water becoming vapour, one drawing enlarges molecules, another removes some, and a third changes spacing. Which fits the same sample?',
    ),
    hookHint: t(
      '先看图例，再追踪数量、身份、符号大小与间距。这次规定物质没有进出，也没有化学反应。',
      'Read the key, then follow number, identity, symbol size and spacing. Here no matter enters or leaves and no chemical reaction occurs.',
    ),
    bigIdea: t(
      '水的状态变化主要改变分子的排列、运动和间距；水分子的身份不会因此变成别的物质。',
      'A state change of water changes molecular arrangement, motion and spacing; it does not turn water molecules into another substance.',
    ),
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '🧊',
        title: t('冰仍是水', 'Ice is still water'),
        body: t(
          '结冰不是把水变成新元素。分子受到的位置约束改变，但并非完全停止运动。',
          'Freezing does not create a new element. Positional constraints change, but molecules do not stop all motion.',
        ),
      },
      {
        icon: '💧',
        title: t('看不见的水蒸气', 'Invisible water vapour'),
        body: t(
          '水蒸气是气态水；看得见的白雾通常包含小液滴。不要把一团白雾当作一个水分子。',
          'Water vapour is gaseous water; visible mist usually contains tiny liquid droplets. A patch of mist is not one water molecule.',
        ),
      },
      {
        icon: '📦',
        title: t('先划定范围', 'Define the boundary'),
        body: t(
          '开放杯中，水分子可以离开杯子；“同一范围数量不变”必须有封闭且无反应等条件。',
          'Water molecules can leave an open cup. An unchanged count in one region needs conditions such as a closed boundary and no reaction.',
        ),
      },
    ],
    steps: [
      {
        title: t('图例决定符号的含义', 'The key defines a symbol'),
        body: t(
          '本课 W 圆圈代表一个水分子的示意，不是水滴、气泡或一克水。真实样品远不止 12 个分子；12 只是为了数得清。',
          'A W circle represents one schematic water molecule, not a droplet, bubble or gram. A real sample contains far more than 12 molecules; twelve makes this drawing countable.',
        ),
      },
      {
        title: t('分别核对四件事', 'Check four separate features'),
        body: t(
          '数一数 W 是否保留，检查 W 是否换成其他身份，比较符号大小，再看排列与间距。不能把容器变大、分子变大和间距变大混为一谈。',
          'Count W, check whether its identity changes, compare symbol size, then inspect arrangement and spacing. Container size, molecular size and separation are different ideas.',
        ),
      },
      {
        title: t('静态图没有画出全部运动', 'A still diagram omits motion'),
        body: t(
          '固体分子围绕受约束的位置振动；液体分子可重新排列；气体分子不断运动。单张截图只表示一个示意状态，不给出速度或温度。',
          'Solid molecules vibrate about constrained positions; liquid molecules rearrange; gas molecules move continually. One schematic snapshot does not supply speed or temperature.',
        ),
      },
      {
        title: t(
          '把结论限定在条件内',
          'Keep the conclusion within its conditions',
        ),
        body: t(
          '本题是封闭范围内同一份水、没有化学反应，所以 W 的数量保留。冰的密度小于液态水，不能把“固体”一概画成更密；图中位置也不用于计算体积或密度。',
          'This is the same water in a closed boundary without reaction, so W counts stay unchanged. Ice is less dense than liquid water; solids are not universally denser. These schematic positions cannot calculate volume or density.',
        ),
      },
    ],
    misconception: t(
      '“气体占的空间大，所以每个分子变大了”混淆了分子大小与分子之间的空间。汽化也不会把水分子拆成氢气和氧气。',
      '“Gas occupies more space, so each molecule grew” confuses molecular size with intermolecular space. Vaporisation also does not split water into hydrogen and oxygen.',
    ),
    mission: t(
      '用 12 个相同的 W 小圆圈，画液态和气态两张图。让家人只看图例、数量和间距，说出你想表达的变化；再写一句这两张图没有表达的信息。',
      'Draw liquid and gas pictures with 12 identical W circles. Ask someone to interpret the key, counts and spacing, then state one thing your drawings do not show.',
    ),
    vocabulary: [
      { en: 'particle diagram', zh: '粒子图' },
      { en: 'intermolecular spacing', zh: '分子间距' },
      { en: 'molecular identity', zh: '分子身份' },
      { en: 'closed boundary', zh: '封闭范围' },
    ],
    interactive: 'phase-particle-evidence-lab',
    resources: [phases, changes],
    learning: {
      prerequisites: [
        'particles-everywhere',
        'states-of-matter',
        'changes-of-state',
      ],
      objectives: [
        t(
          '用图例区分分子、液滴与宏观样品。',
          'Use a key to distinguish molecules, droplets and bulk samples.',
        ),
        t(
          '检查状态变化图的身份、数量、符号大小与间距。',
          'Audit identity, number, symbol size and spacing in phase diagrams.',
        ),
        t(
          '说明封闭条件和静态图的限制。',
          'Explain the closed-boundary condition and limits of a still image.',
        ),
      ],
      workedExample: {
        prompt: t(
          '封闭模型原有 12 个 W。汽化后候选图有 8 个更大的 W；应怎样修改？',
          'A closed model starts with 12 W. A candidate after vaporisation has 8 enlarged W. How should it change?',
        ),
        steps: [
          t(
            '封闭且没有反应，不应丢失 4 个水分子符号。',
            'Closed and nonreacting means four water symbols must not disappear.',
          ),
          t(
            '水仍是水，W 的身份与示意大小应保留。',
            'Water remains water, so keep W identity and schematic size.',
          ),
          t(
            '以更大的分子间距表示气态；不从图计算真实密度。',
            'Represent gas by wider spacing, without calculating real density from the drawing.',
          ),
        ],
        answer: t(
          '改为 12 个同样大小的 W，主要拉开间距，并保留图例与条件。',
          'Use 12 W of the original size, mainly increase spacing, and retain the key and conditions.',
        ),
      },
      anotherWay: t(
        '把符号当作清点卡：移动卡片的位置不会让卡片变成另一种身份，也不需要撕掉几张。这个比喻只帮助清点，不能代替分子间作用或运动模型。',
        'Treat symbols like inventory cards: moving them neither changes their identity nor requires discarding cards. This analogy helps counting; it does not model molecular forces or motion.',
      ),
      explainPrompt: t(
        '不用“因为课本说”，向家人解释水蒸气为什么仍是水，再说明为什么开放杯内的水分子数可能减少。',
        'Without saying “the textbook says so”, explain why water vapour remains water and why the water-molecule count inside an open cup can decrease.',
      ),
      quickChecks: [
        q(
          'particle101-check1',
          t('W 的含义首先由什么决定？', 'What first determines what W means?'),
          [
            t('图例', 'The key'),
            t('圆圈必须是水滴', 'Circles must be droplets'),
            t('颜色就是实际颜色', 'Its colour must be real'),
          ],
          0,
          t(
            '符号的含义来自图例，不能凭外观猜实际尺度。',
            'A symbol gets its meaning from the key, not a guessed physical scale.',
          ),
          'diagram-key',
        ),
        q(
          'particle101-check2',
          t(
            '封闭、无反应的汽化图应保留什么？',
            'What stays in a closed, nonreacting vaporisation diagram?',
          ),
          [
            t('原来的排列', 'The original arrangement'),
            t('水分子身份和数量', 'Water-molecule identity and count'),
            t('固定分子位置', 'Fixed molecular positions'),
          ],
          1,
          t(
            '排列与间距会变，水分子没有因此变成别的物质。',
            'Arrangement and spacing change without creating another molecular identity.',
          ),
          'phase-identity',
        ),
        q(
          'particle101-check3',
          t(
            '静止的冰粒子图是否说明分子不动？',
            'Does a still ice diagram prove molecules are motionless?',
          ),
          [
            t('是，固体绝不动', 'Yes, solids never move'),
            t('是，只要画成直线', 'Yes, if arranged in lines'),
            t('否，固体分子仍会振动', 'No, solid molecules still vibrate'),
          ],
          2,
          t(
            '截图省略了运动，不是运动不存在。',
            'A snapshot omits motion rather than disproving it.',
          ),
          'diagram-limits',
        ),
      ],
    },
    questions: [
      q(
        'particle101-q1',
        t(
          '哪句话正确区分符号和样品？',
          'Which correctly separates a symbol from a sample?',
        ),
        [
          t('12 个 W 就是 12 克水', '12 W means 12 grams'),
          t('一个 W 不是一滴水', 'One W is not one droplet'),
          t('蓝色 W 证明水分子实际蓝色', 'Blue W proves molecules are blue'),
        ],
        1,
        t(
          '本图 W 表示一个分子的示意；数量与质量没有这样的对应。',
          'Here W is a schematic molecule, with no such mapping to grams.',
        ),
        'diagram-key',
        'recall',
      ),
      q(
        'particle101-q2',
        t(
          '封闭模型从 12 个 W 变成 8 个 W 来表示汽化，问题是什么？',
          'A closed model uses 8 W after starting with 12 W to show vaporisation. What is wrong?',
        ),
        [
          t(
            '没有去向的分子被少画了',
            'Molecules disappeared without an accounted destination',
          ),
          t('气体本来就需要更少分子', 'Gas inherently needs fewer molecules'),
          t('应该全部改成 S', 'They should all become S'),
        ],
        0,
        t(
          '同一份无反应的封闭样品不能靠少画分子表示气态。',
          'Fewer molecules cannot represent this nonreacting closed sample’s gas state.',
        ),
        'particle-conservation',
      ),
      q(
        'particle101-q3',
        t(
          '气态水中间距增加，能推出什么？',
          'What follows from wider spacing in gaseous water?',
        ),
        [
          t('每个水分子膨胀成气泡', 'Each molecule inflates into a bubble'),
          t('水已经分解', 'Water has decomposed'),
          t(
            '分子间的空间增大，水仍是水',
            'Intermolecular space increases; water remains water',
          ),
        ],
        2,
        t(
          '分子之间的空间与单个分子的大小不同。',
          'Space between molecules differs from each molecule’s size.',
        ),
        'molecular-spacing',
      ),
      q(
        'particle101-q4',
        t(
          '冰的静态示意图规则排列，哪种补充必要？',
          'What caveat belongs with an ordered still ice diagram?',
        ),
        [
          t(
            '分子仍振动，图不是真实结构和密度的比例图',
            'Molecules still vibrate; this is not a scaled structure or density map',
          ),
          t('冰一定比水更密', 'Ice must be denser than water'),
          t('每个圆圈就是一粒冰块', 'Each circle is an ice cube'),
        ],
        0,
        t(
          '有序示意不能代替真实冰结构，冰的密度也小于液态水。',
          'An ordered sketch is not ice’s real structure; ice is also less dense than liquid water.',
        ),
        'diagram-limits',
      ),
      q(
        'particle101-q5',
        t(
          '开放杯中水慢慢减少，怎样延用本课账本？',
          'How can this lesson’s ledger explain water decreasing in an open cup?',
        ),
        [
          t('断言分子被消灭', 'Declare molecules destroyed'),
          t(
            '只算杯内，直接说不守恒',
            'Count only inside and declare nonconservation',
          ),
          t(
            '同时记录离开杯子的水分子',
            'Also account for water molecules leaving the cup',
          ),
        ],
        2,
        t(
          '开放范围可以失去物质；把外部也计入才能核对完整库存。',
          'An open region can lose matter; include the outside to audit the complete inventory.',
        ),
        'boundary-transfer',
        'application',
      ),
      q(
        'particle101-q6',
        t(
          '朋友把 W 改成 H 和 O 的两类气体符号来表示水沸腾，你怎样回应？',
          'A friend replaces W with two gas species H and O to show boiling water. What should you say?',
        ),
        [
          t('沸腾总会分解水', 'Boiling always decomposes water'),
          t(
            '沸腾是状态变化，这幅图错误改变了化学身份',
            'Boiling changes state; this picture wrongly changes chemical identity',
          ),
          t('只要数量一样就对', 'Equal symbol counts make it correct'),
        ],
        1,
        t(
          '水蒸气仍由水分子构成；状态变化和化学分解是不同问题。',
          'Water vapour consists of water molecules; state change differs from chemical decomposition.',
        ),
        'phase-identity',
        'application',
      ),
    ],
  },
  {
    id: 'dissolving-is-not-melting',
    nextLessonId: 'pure-substances-and-mixtures',
    levelId: 'matter',
    order: 102,
    title: t(
      '糖溶解了，是融化还是消失了？',
      'When sugar dissolves, has it melted or vanished?',
    ),
    eyebrow: t(
      '粒子衔接 2/2 · 从糖堆追到滤液',
      'Particle bridge 2/2 · From crystal to filtrate',
    ),
    hook: t(
      '糖粒搅进水里后看不见了。它变成液态糖了吗？普通滤纸能把它拦回来吗？用同一份粒子账本检查两个猜测。',
      'Sugar grains become invisible after stirring into water. Have they become liquid sugar? Can ordinary filter paper catch them? Test both ideas with one particle ledger.',
    ),
    hookHint: t(
      '熔化是物质自身从固态到液态；这里的糖分子进入另一种物质——水——并分散在其中。',
      'Melting changes a substance itself from solid to liquid. Here sugar molecules disperse within another substance: water.',
    ),
    bigIdea: t(
      '在本课无反应的糖水模型中，溶解改变糖分子的分布；糖没有被消灭，也不等于糖自身熔化。',
      'In this nonreacting sugar–water model, dissolution changes sugar’s molecular distribution; sugar is neither destroyed nor simply melted.',
    ),
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🍬',
        title: t('一堆糖含许多分子', 'A sugar pile contains many molecules'),
        body: t(
          '肉眼看见的糖粒是宏观晶体，不是一个糖分子。看不见糖粒不等于没有糖。',
          'A visible grain is a bulk crystal, not one sugar molecule. Invisible grains do not mean absent sugar.',
        ),
      },
      {
        icon: '🧻',
        title: t('滤纸有分离范围', 'Paper has separation limits'),
        body: t(
          '普通滤纸可截留适当大小的悬浮固体；清澈糖水中的已溶解糖通常随水通过。',
          'Ordinary paper can retain suitably sized suspended solids; dissolved sugar in a clear solution generally passes with the water.',
        ),
      },
      {
        icon: '💨',
        title: t('水离开，糖留下', 'Water leaves; sugar remains'),
        body: t(
          '在不挥发、不分解等理想条件下，水离开后可留下糖。水在外部仍存在，没有被消灭。',
          'Under ideal nonvolatile, nondecomposing conditions, sugar can remain after water leaves. The outside water still exists.',
        ),
      },
    ],
    steps: [
      {
        title: t('先认清两种粒子', 'Identify the two species'),
        body: t(
          'W 代表水分子，S 代表糖分子；一堆糖由许多 S 组成。这里只画 16 个 W 和 8 个 S 帮助清点，不表示真实组成比例、溶解度或分子大小比例。',
          'W means water molecules and S sugar molecules; one sugar pile contains many S. Sixteen W and eight S aid counting, without representing real composition, solubility or relative molecular sizes.',
        ),
      },
      {
        title: t('对照溶解和熔化', 'Contrast dissolution and melting'),
        body: t(
          '糖在水中溶解时，糖分子分散在水分子之间，得到糖和水的溶液。熔化则是物质自身固态变液态，不需要把另一种物质作为溶剂。这里不研究糖受热分解。',
          'Dissolving sugar disperses sugar molecules among water molecules, forming a sugar–water solution. Melting is a substance’s own solid-to-liquid transition, without requiring another substance as solvent. Sugar’s thermal decomposition is outside this model.',
        ),
      },
      {
        title: t('按粒子状态选分离方法', 'Choose separation by particle state'),
        body: t(
          '本课全部糖都已溶解，普通滤纸不能将其从水中滤出。若另有不溶固体颗粒，是否被截留还取决于颗粒和孔隙等条件；不能说所有过滤技术都无效。',
          'All sugar here is dissolved, so ordinary paper cannot separate it from water. Retention of other insoluble particles depends on particle and pore properties; not every filtration technology behaves the same way.',
        ),
      },
      {
        title: t('回收还要记录范围外', 'Recovery includes the outside ledger'),
        body: t(
          '虚拟记录让水逐步离开，同时保留糖身份与数量；部分阶段假定糖仍全部溶解，最终理想阶段留下固态糖。实际回收可能有析晶、附着、分解或损失，不能把模型数量当作实验产率。',
          'Virtual records move water outside while retaining sugar identity and count. Partial stages assume all sugar remains dissolved; the ideal final stage leaves solid sugar. Real recovery can involve crystallisation, adhesion, decomposition or loss; model counts are not experimental yields.',
        ),
      },
    ],
    misconception: t(
      '“溶解就是熔化”“透明就是纯水”“滤纸能拦住一切固体来源的物质”都不成立。应追踪溶质的粒子状态，而不是只看原来是不是固体。',
      'Dissolving is not melting, clear does not mean pure water, and paper does not catch everything that started as a solid. Track the solute’s particle state, not just its original bulk state.',
    ),
    mission: t(
      '不做加热实验。给虚拟记录画两列账本：容器内和范围外。依次追踪 16 个 W、8 个 S，并用一句话说明普通滤纸为何不能把已溶解的糖全部取出。',
      'Use the virtual records without heating. Draw inside/outside ledger columns, follow 16 W and 8 S, and explain why ordinary paper cannot recover all dissolved sugar.',
    ),
    vocabulary: [
      { en: 'dissolving', zh: '溶解' },
      { en: 'melting', zh: '熔化' },
      { en: 'solute', zh: '溶质' },
      { en: 'solvent', zh: '溶剂' },
      { en: 'filtrate', zh: '滤液' },
    ],
    interactive: 'dissolving-particle-evidence-lab',
    resources: [
      changes,
      {
        title: t('拓展：溶解过程', 'Read more: the dissolution process'),
        url: 'https://openstax.org/books/chemistry-2e/pages/11-1-the-dissolution-process',
      },
    ],
    learning: {
      prerequisites: [
        'state-change-particle-evidence',
        'physical-vs-chemical-change',
      ],
      objectives: [
        t(
          '用两种粒子图解释糖溶解与熔化的区别。',
          'Use two-species pictures to distinguish dissolution from melting.',
        ),
        t(
          '解释普通滤纸为什么不能分离本课的糖水。',
          'Explain why ordinary paper cannot separate this sugar solution.',
        ),
        t(
          '在回收过程中核对容器内外的水和糖。',
          'Audit sugar and water inside and outside during recovery.',
        ),
      ],
      workedExample: {
        prompt: t(
          '初始有 16 个 W 和 8 个 S。充分溶解并普通过滤后，8 个 S 会全留在滤纸上吗？',
          'Start with 16 W and 8 S. After dissolution and ordinary filtration, do all 8 S stay on the paper?',
        ),
        steps: [
          t(
            '先确定糖已分子尺度分散，不是悬浮糖粒。',
            'Establish that sugar is molecularly dispersed, not suspended grains.',
          ),
          t(
            '普通滤纸不是把这种分子从水中筛出的工具。',
            'Ordinary paper does not sieve these molecules out of water.',
          ),
          t(
            '在忽略附着损失的模型中，W 和 S 一起进入滤液。',
            'Ignoring adhesion losses, W and S enter the filtrate together.',
          ),
        ],
        answer: t(
          '不会。滤液仍有 16 个 W 和 8 个 S；“原来是固体”不足以判断会被滤纸拦住。',
          'No. The filtrate still has 16 W and 8 S. Starting as a solid does not imply paper retention.',
        ),
      },
      anotherWay: t(
        '把“整堆糖不见了”和“糖分子不在了”分成两个问题。像一队人散入人群：原来的一队不再成团，不表示每个人消失。人群比喻只解释分布，不解释分子作用或过滤孔径。',
        'Separate “the sugar pile is gone” from “the sugar molecules are gone”. A group dispersing into a crowd no longer looks like a group, but its members remain. This analogy explains distribution, not molecular forces or filter pore sizes.',
      ),
      explainPrompt: t(
        '向家人解释：为什么糖水可以清澈，却不是纯水？再说明溶解、普通过滤和水离开时，哪些粒子去了哪里。',
        'Explain why a clear sugar solution is not pure water, then track the particles through dissolution, ordinary filtration and water leaving.',
      ),
      quickChecks: [
        q(
          'particle102-check1',
          t(
            '本课糖溶解主要改变什么？',
            'What mainly changes when sugar dissolves here?',
          ),
          [
            t('糖变成水', 'Sugar becomes water'),
            t('糖分子的分布', 'Sugar-molecule distribution'),
            t('每个糖分子变成液滴', 'Each sugar molecule becomes a droplet'),
          ],
          1,
          t(
            '糖分子分散进水中，不是转变成水分子。',
            'Sugar molecules disperse in water without becoming water molecules.',
          ),
          'dissolving-vs-melting',
        ),
        q(
          'particle102-check2',
          t(
            '普通过滤后，已溶解的糖主要在哪里？',
            'After ordinary filtration, where is the dissolved sugar?',
          ),
          [
            t('滤液中', 'In the filtrate'),
            t('全部在滤纸上', 'All on the paper'),
            t('已被消灭', 'Destroyed'),
          ],
          0,
          t(
            '在本模型中，已溶解糖随水通过滤纸。',
            'In this model dissolved sugar passes through with water.',
          ),
          'filtration-limits',
        ),
        q(
          'particle102-check3',
          t(
            '16 个 W 中有 6 个离开，容器内外合计多少 W？',
            'Six of 16 W leave. How many W exist inside plus outside?',
          ),
          [t('10', '10'), t('6', '6'), t('16', '16')],
          2,
          t(
            '内有 10，外有 6，合计仍为 16。',
            'Ten inside plus six outside still totals sixteen.',
          ),
          'boundary-transfer',
        ),
      ],
    },
    questions: [
      q(
        'particle102-q1',
        t(
          '哪句准确描述本课的溶解？',
          'Which accurately describes dissolution here?',
        ),
        [
          t(
            '糖分子分散在水分子之间',
            'Sugar molecules disperse among water molecules',
          ),
          t('糖分子变成水分子', 'Sugar molecules become water molecules'),
          t(
            '固态糖直接变成纯液态糖',
            'Solid sugar simply becomes pure liquid sugar',
          ),
        ],
        0,
        t(
          '这里有两种物质，形成溶液，不是糖自身的熔化。',
          'Two substances form a solution; this is not sugar’s own melting.',
        ),
        'dissolving-vs-melting',
      ),
      q(
        'particle102-q2',
        t(
          '糖水看起来清澈，可以直接说它是纯水吗？',
          'Does a clear sugar solution have to be pure water?',
        ),
        [
          t(
            '可以，透明只可能有一种物质',
            'Yes, clarity requires one substance',
          ),
          t('可以，只要看不见糖粒', 'Yes, if no sugar grains are visible'),
          t('不可以，仍含分散的糖分子', 'No, dispersed sugar molecules remain'),
        ],
        2,
        t(
          '肉眼的透明度不足以排除已溶解物质。',
          'Visible clarity cannot rule out dissolved substances.',
        ),
        'mixture-evidence',
      ),
      q(
        'particle102-q3',
        t(
          '普通滤纸为何不能把已溶解的糖全部滤出？',
          'Why can ordinary paper not remove all dissolved sugar?',
        ),
        [
          t('糖不是物质', 'Sugar is not matter'),
          t(
            '糖已经在分子尺度分散，会随水通过',
            'Sugar is molecularly dispersed and passes with water',
          ),
          t('所有固体都必然穿过滤纸', 'Every solid must pass through'),
        ],
        1,
        t(
          '要区分溶解分子与可截留的不溶颗粒，不能只看原来的固态身份。',
          'Distinguish dissolved molecules from retainable insoluble particles, rather than using the original bulk state.',
        ),
        'filtration-limits',
      ),
      q(
        'particle102-q4',
        t(
          '部分水离开后，模型内有 10 W、8 S，外有 6 W。哪句正确？',
          'There are 10 W and 8 S inside, with 6 W outside. Which is correct?',
        ),
        [
          t('糖也必须损失 6 个 S', 'Six S must also have been lost'),
          t('只能保留一半 S', 'Only half the S may remain'),
          t('内外 W 合计 16，S 合计 8', 'Total W is 16 and total S is 8'),
        ],
        2,
        t(
          '两种粒子分别清点；水离开不意味着糖按同一比例离开。',
          'Audit each species separately; water loss does not imply proportional sugar loss.',
        ),
        'particle-conservation',
        'application',
      ),
      q(
        'particle102-q5',
        t(
          '虚拟最终记录显示容器内只剩糖，水去了哪里？',
          'The ideal final record shows only sugar inside. Where is the water?',
        ),
        [
          t(
            '在范围外仍存在，可能已扩散进周围空气',
            'It still exists outside and may have dispersed into the air',
          ),
          t('已从宇宙中消失', 'It vanished from the universe'),
          t('全部变成糖', 'It all became sugar'),
        ],
        0,
        t(
          '记录范围外的去向，才能保留完整水库存。',
          'Account for the outside destination to retain a complete water inventory.',
        ),
        'boundary-transfer',
        'application',
      ),
      q(
        'particle102-q6',
        t(
          '能把糖的 S 图直接套用到所有溶质吗？',
          'Can the sugar S picture be applied unchanged to every solute?',
        ),
        [
          t('能，所有溶解完全相同', 'Yes, all dissolution is identical'),
          t(
            '不能，有些溶质涉及离子分散或其他变化，需要不同模型',
            'No, some involve dispersed ions or other changes and need different models',
          ),
          t('能，所有溶质都变成水', 'Yes, all solutes become water'),
        ],
        1,
        t(
          '本课只研究指定无反应条件下的糖水，不把糖分子模型推广到所有材料。',
          'This lesson concerns sugar in water under specified nonreacting conditions; it does not generalise sugar molecules to all materials.',
        ),
        'model-scope',
        'application',
      ),
    ],
  },
];
