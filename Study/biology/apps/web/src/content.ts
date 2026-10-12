import type { LocalizedText } from '@study/shared';
import { t, q, term, type Lesson } from './schema';
import { microLessons } from './content/micro';
import { plantLessons } from './content/plants';
import { bodyLessons } from './content/body';
import { ecologyLessons } from './content/ecology';
import { inquiryLessons } from './content/inquiry';
export { t } from './schema';
export type { Skill, Question, Lesson } from './schema';
const lifeLessons: Lesson[] = [
  {
    id: 'L001',
    title: t('它是活的吗？', 'Living or not?'),
    minutes: 15,
    icon: '◉',
    hook: t(
      '火焰会变大，机器人会走路。一颗不动的种子，却可能有生命。你会怎样判断？',
      'A flame grows. A robot walks. A still seed may be alive. How would you decide?',
    ),
    objectives: [
      t(
        '用多条证据判断生命，不能只看会不会动。',
        'Use several lines of evidence, not just movement.',
      ),
      t(
        '区分看见的现象和根据现象作出的解释。',
        'Separate an observation from an inference.',
      ),
    ],
    prediction: [
      t('会动的就是活的', 'Anything that moves is alive'),
      t('要看细胞和生命活动等证据', 'Look for cells and life processes'),
      t('我还不确定，先调查', 'I am unsure. Let’s investigate'),
    ],
    terms: [
      term(
        '生物',
        'organism',
        '一个生命个体，如一只猫或一株树。',
        'An individual living thing, such as a cat or a tree.',
      ),
      term(
        '细胞',
        'cell',
        '生物结构和功能的基本单位。',
        'A basic unit of structure and function in organisms.',
      ),
      term(
        '证据',
        'evidence',
        '能帮助检验解释的观察或数据。',
        'Observations or data used to test explanations.',
      ),
      term(
        '推测',
        'inference',
        '根据证据作出的解释，可以修正。',
        'An explanation drawn from evidence that can be revised.',
      ),
    ],
    mission: t(
      '观察家里 3 个物体，口述或写下：“我观察到……因此我推测……”。不确定也可以。',
      'Observe 3 things at home. Say or write: “I observe … so I infer …”. Uncertainty is welcome.',
    ),
    questions: [
      q(
        'L001-q1',
        'concept',
        t(
          '机器人会走路，为什么这不能证明它有生命？',
          'A robot walks. Why does this not establish that it is alive?',
        ),
        [
          t('因为机器人走得不够快', 'It does not walk fast enough'),
          t(
            '运动也能由机械装置产生，需要综合生命证据',
            'Machines can move too; we need multiple signs of life',
          ),
          t('所有会走路的物体都有细胞', 'All walking objects have cells'),
        ],
        1,
        t(
          '移动不是生命专属的特征。植物也可以是活的，尽管它们不会像动物那样走动。',
          'Movement is not unique to life. Plants can be alive without walking like animals.',
        ),
        t(
          '回看“机器人”和“植物”的证据卡。',
          'Revisit the robot and plant evidence cards.',
        ),
      ),
      q(
        'L001-q2',
        'concept',
        t(
          '火焰与猫都有能量变化。哪条区别更关键？',
          'Both a flame and a cat use energy. Which difference matters more?',
        ),
        [
          t(
            '猫由细胞组成，火焰没有细胞结构',
            'A cat consists of cells; a flame has no cellular structure',
          ),
          t('猫比较大', 'A cat is larger'),
          t('火焰的颜色不同', 'A flame has a different colour'),
        ],
        0,
        t(
          '要综合细胞结构、代谢和遗传等特征。仅仅“使用能量”也不够。',
          'Use cellular structure, metabolism and heredity together. Energy use alone is insufficient.',
        ),
        t('回看细胞图及火焰卡。', 'Revisit the cell diagram and flame card.'),
      ),
      q(
        'L001-q3',
        'reasoning',
        t(
          '发现一个未知物体。哪一句直接描述观察？',
          'You find an unknown object. Which sentence directly reports an observation?',
        ),
        [
          t('它一定有生命', 'It must be alive'),
          t('它很饿', 'It is hungry'),
          t(
            '放入水中后，第二天出现了白色小根',
            'A small white root appeared the day after water was added',
          ),
        ],
        2,
        t(
          '小根出现是可记录的观察。“有生命”是解释，需要结合更多证据。',
          'The root is a recorded observation. “Alive” is an inference supported by evidence.',
        ),
        t(
          '回看讲解中“观察 → 解释”的例子。',
          'Revisit the observation → inference example.',
        ),
      ),
      q(
        'L001-q4',
        'vocabulary',
        t(
          '哪一个词表示用于检验解释的“证据”？',
          'Which word means observations or data used to test an explanation?',
        ),
        [
          t('细胞 · cell', 'cell'),
          t('证据 · evidence', 'evidence'),
          t('生长 · growth', 'growth'),
        ],
        1,
        t(
          'Evidence 是证据。科学解释应说明它依据哪些观察或数据。',
          'Evidence supports scientific explanations with observations or data.',
        ),
        t('复习 evidence 词卡。', 'Revisit the evidence word card.'),
      ),
    ],
  },
  {
    id: 'L002',
    title: t('生物都会做什么？', 'What do living things do?'),
    minutes: 15,
    icon: '↗',
    hook: t(
      '植物不会追着午饭跑。它们怎样获取能量，又怎样回应周围的世界？',
      'Plants never chase their lunch. How do they obtain energy and respond to their surroundings?',
    ),
    objectives: [
      t(
        '把生长、能量利用和对刺激的反应联系起来。',
        'Connect growth, energy use and responses to stimuli.',
      ),
      t(
        '解释植物转向光源与能量利用的关系。',
        'Explain a plant’s response to light and its energy use.',
      ),
    ],
    prediction: [
      t(
        '植物没有生命活动，只是在变大',
        'Plants only get bigger; they have no life processes',
      ),
      t(
        '植物也获取能量，并回应环境',
        'Plants obtain energy and respond to their environment',
      ),
      t('植物的食物主要来自土壤', 'Plants get most of their food from soil'),
    ],
    terms: [
      term(
        '生长',
        'growth',
        '生物体大小或细胞数量增加。',
        'An increase in an organism’s size or cell number.',
      ),
      term(
        '刺激',
        'stimulus',
        '能引起反应的环境变化，例如光的方向。',
        'A change that can cause a response, such as light direction.',
      ),
      term(
        '光合作用',
        'photosynthesis',
        '利用光能，由水和二氧化碳制造糖的过程。',
        'A process using light energy to make sugars from water and carbon dioxide.',
      ),
      term(
        '细胞呼吸',
        'cellular respiration',
        '细胞从物质中释放可用能量的过程。',
        'Cell processes that release usable energy from substances.',
      ),
    ],
    mission: t(
      '找一株窗边植物，观察新枝朝向。记下光源位置，不要仅凭一张照片断言因果。',
      'Observe a plant near a window. Record the light direction; one photo alone cannot establish a cause.',
    ),
    questions: [
      q(
        'L002-q1',
        'concept',
        t(
          '绿色植物制造糖主要需要什么？',
          'What does a green plant mainly need to make sugars?',
        ),
        [
          t('光、水和二氧化碳', 'Light, water and carbon dioxide'),
          t('土壤中的糖', 'Sugar from soil'),
          t('只需要氧气', 'Only oxygen'),
        ],
        0,
        t(
          '光合作用将光能转为糖中的化学能。土壤提供水和矿质养分，不能简单说成植物“吃土”。',
          'Photosynthesis stores light energy in sugars. Soil supplies water and minerals; plants do not simply eat soil.',
        ),
        t('回看植物能量图。', 'Revisit the plant energy diagram.'),
      ),
      q(
        'L002-q2',
        'concept',
        t(
          '植物在夜间还会进行细胞呼吸吗？',
          'Do plants still carry out cellular respiration at night?',
        ),
        [
          t('不会，植物只做光合作用', 'No, plants only photosynthesise'),
          t('只有动物细胞才会呼吸', 'Only animal cells respire'),
          t(
            '会，植物细胞也需要可用能量',
            'Yes, plant cells need usable energy too',
          ),
        ],
        2,
        t(
          '细胞呼吸昼夜都可发生。光合作用需要光；细胞呼吸不等于吸气呼气。',
          'Cellular respiration can occur day and night. Photosynthesis needs light; respiration is not the same as breathing.',
        ),
        t(
          '回看讲解中的光合作用与细胞呼吸。',
          'Revisit the photosynthesis and respiration explanation.',
        ),
      ),
      q(
        'L002-q3',
        'reasoning',
        t(
          '想检验光的方向是否影响新茎生长方向，哪组比较更公平？',
          'Which comparison best tests how light direction affects a new shoot?',
        ),
        [
          t(
            '两株不同植物，一株浇水一株不浇',
            'Different plants with different watering',
          ),
          t(
            '同种幼苗、相同水量和温度，只改变光的方向',
            'Same kind of seedlings, same water and temperature, different light direction',
          ),
          t('只看一株植物的一张照片', 'One photo of one plant'),
        ],
        1,
        t(
          '尽量保持其他条件相同，只改变目标因素，还需重复观察。模拟展示假设，真实比较才提供实验数据。',
          'Keep other conditions similar, change one target factor and repeat observations. A model illustrates an idea; a real comparison supplies data.',
        ),
        t(
          '重新切换模型中的光源方向。',
          'Switch the light direction in the model again.',
        ),
      ),
      q(
        'L002-q4',
        'vocabulary',
        t(
          '新茎向光弯曲：光在这里是什么？',
          'A shoot bends towards light. What is light in this example?',
        ),
        [
          t('刺激 · stimulus', 'a stimulus'),
          t('细胞 · cell', 'a cell'),
          t('生物 · organism', 'an organism'),
        ],
        0,
        t(
          '光的方向是一种刺激，生长方向改变是反应。',
          'Light direction is a stimulus; a change in growth direction is a response.',
        ),
        t('复习 stimulus 词卡。', 'Revisit the stimulus word card.'),
      ),
    ],
  },
  {
    id: 'L003',
    title: t('沉睡的种子还有生命吗？', 'Is a dormant seed alive?'),
    minutes: 18,
    icon: '❧',
    hook: t(
      '一颗干种子像小石头。给它水，它会醒来吗？水越多越好吗？',
      'A dry seed looks like a tiny stone. Will water wake it up? Is more water always better?',
    ),
    objectives: [
      t(
        '用萌发证据解释休眠种子仍可能有生命。',
        'Use germination as evidence that a dormant seed can be alive.',
      ),
      t(
        '比较水分、氧气和温度对萌发的影响。',
        'Compare how water, oxygen and temperature affect germination.',
      ),
    ],
    prediction: [
      t('只要水多，就一定萌发', 'Enough water guarantees germination'),
      t(
        '需要水分、氧气、适宜温度和有活力的种子',
        'A viable seed needs water, oxygen and a suitable temperature',
      ),
      t('所有种子必须先晒太阳', 'Every seed must first receive sunlight'),
    ],
    terms: [
      term(
        '种子',
        'seed',
        '包含胚、保护结构，通常也含储存养分。',
        'Contains an embryo, protective structures and usually stored nutrients.',
      ),
      term(
        '胚',
        'embryo',
        '能发育成新植物的幼小个体。',
        'The young organism that can develop into a new plant.',
      ),
      term(
        '休眠',
        'dormancy',
        '活种子处于低活动、暂不萌发的状态。',
        'A low-activity state in which a living seed does not germinate.',
      ),
      term(
        '萌发',
        'germination',
        '种子恢复生长、胚开始发育的过程。',
        'The resumption of growth as the embryo develops.',
      ),
      term(
        '氧气',
        'oxygen',
        '许多萌发种子进行有氧呼吸所需的气体。',
        'A gas needed for aerobic respiration in many germinating seeds.',
      ),
    ],
    mission: t(
      '可选：请成人协助，用几粒常见豆种在湿润纸巾上观察萌发。记录日期和变化；不要食用实验种子。',
      'Optional: with adult help, observe familiar bean seeds on moist paper. Record dates and changes; do not eat experimental seeds.',
    ),
    questions: [
      q(
        'L003-q1',
        'concept',
        t(
          '一颗干种子暂时不萌发，最合理的判断是？',
          'A dry seed does not germinate yet. What is the best conclusion?',
        ),
        [
          t('一定已经死了', 'It must be dead'),
          t(
            '它可能仍有生命，需要更多证据',
            'It may still be alive; we need more evidence',
          ),
          t('它没有任何细胞', 'It has no cells'),
        ],
        1,
        t(
          '不萌发不等于死亡。缺水、低温、休眠或失去活力都可能造成不萌发。',
          'Failure to germinate does not establish death. Lack of water, cold, dormancy or lost viability can prevent it.',
        ),
        t(
          '回看种子剖面与静态阶段。',
          'Revisit the seed cutaway and growth stages.',
        ),
      ),
      q(
        'L003-q2',
        'concept',
        t(
          '为什么把许多豆种长期完全浸在水里，反而可能不萌发？',
          'Why might many bean seeds fail to germinate when kept fully submerged?',
        ),
        [
          t('水太重了，挡住根', 'Water is too heavy for roots'),
          t('种子只能在沙漠萌发', 'Seeds germinate only in deserts'),
          t(
            '氧气供应可能不足，影响有氧呼吸',
            'Oxygen may become limited, affecting aerobic respiration',
          ),
        ],
        2,
        t(
          '水分重要，氧气也重要。过多水可能减少氧气供应，不能把“适量水”理解为“越多越好”。',
          'Water and oxygen both matter. Too much water can limit oxygen; more is not always better.',
        ),
        t(
          '将水分改成“浸没”，再运行模型。',
          'Select “submerged” and run the model.',
        ),
      ),
      q(
        'L003-q3',
        'reasoning',
        t(
          '模拟记录：湿润、20°C、有氧组出现根；干燥组没有。这个比较支持什么？',
          'Model record: moist seeds at 20°C with oxygen form roots; dry seeds do not. What does this comparison support?',
        ),
        [
          t(
            '在模型其他条件相同时，水分影响萌发；真实结论还需要重复实验',
            'With other model conditions held equal, water affects germination; real conclusions need repeated experiments',
          ),
          t('所有种子在20°C都必然萌发', 'Every seed must germinate at 20°C'),
          t('干燥的种子全都已经死亡', 'All dry seeds are dead'),
        ],
        0,
        t(
          '这是限定条件下的模型结果，不是所有物种的实验数据。真实试验还要控制种类、活力和样本数量。',
          'This is a model result under stated assumptions, not data for all species. Real tests also consider species, viability and sample size.',
        ),
        t('回看模型限制说明。', 'Revisit the model assumptions.'),
      ),
      q(
        'L003-q4',
        'vocabulary',
        t(
          '哪一个词表示种子开始恢复生长？',
          'Which word describes a seed resuming growth?',
        ),
        [
          t('证据 · evidence', 'evidence'),
          t('萌发 · germination', 'germination'),
          t('刺激 · stimulus', 'stimulus'),
        ],
        1,
        t(
          'Germination 是萌发；dormancy 是休眠。它们描述不同状态。',
          'Germination is resumed growth; dormancy is a different state.',
        ),
        t(
          '复习 germination 和 dormancy。',
          'Revisit germination and dormancy.',
        ),
      ),
    ],
  },
  {
    id: 'L004',
    title: t('病毒算不算生命？', 'Viruses: the edge of life'),
    minutes: 18,
    icon: '⬡',
    hook: t(
      '病毒有遗传信息，却不是细胞。离开合适的宿主，它不能自行复制。生命的边界在哪里？',
      'A virus has genetic information but is not a cell. Without a suitable host it cannot replicate on its own. Where is the boundary of life?',
    ),
    objectives: [
      t(
        '比较细菌细胞与病毒的结构和复制能力。',
        'Compare bacterial cells and viruses in structure and replication.',
      ),
      t(
        '用两方面证据解释生命边界的争论。',
        'Use evidence on both sides to explain the debate about life’s boundary.',
      ),
    ],
    prediction: [
      t(
        '有遗传信息就一定是完整生物',
        'Genetic information alone makes something a complete organism',
      ),
      t('病毒就是很小的细菌', 'Viruses are simply very small bacteria'),
      t(
        '要综合证据，生命的定义有边界问题',
        'We need several criteria; the definition of life has boundary cases',
      ),
    ],
    terms: [
      term(
        '病毒',
        'virus',
        '没有细胞结构、依赖宿主细胞完成复制的感染性实体。',
        'An acellular infectious entity that depends on host cells for replication.',
      ),
      term(
        '宿主',
        'host',
        '被病毒利用来完成复制的生物；复制发生在其细胞内。',
        'An organism whose cells a virus uses for replication.',
      ),
      term(
        '遗传信息',
        'genetic information',
        '参与复制和传递性状的信息，可由DNA或RNA承载。',
        'Information involved in replication and inheritance, carried by DNA or RNA.',
      ),
      term(
        '复制',
        'replication',
        '产生遗传物质或病毒等的新副本。',
        'Production of new copies of genetic material or viruses.',
      ),
      term(
        '衣壳',
        'capsid',
        '包裹病毒遗传物质的蛋白质结构。',
        'A protein structure surrounding viral genetic material.',
      ),
    ],
    mission: t(
      '用两句话解释争议：“病毒像生命，因为……；它又不同于细胞生命，因为……”。不要只背一个是或否。',
      'Explain both sides: “Viruses resemble life because …; they differ from cellular life because …”. Go beyond a yes or no.',
    ),
    questions: [
      q(
        'L004-q1',
        'concept',
        t(
          '病毒和细菌的重要区别是什么？',
          'What is an important difference between a virus and a bacterium?',
        ),
        [
          t(
            '细菌是细胞，病毒没有细胞结构',
            'Bacteria are cells; viruses lack cellular structure',
          ),
          t('细菌没有遗传信息', 'Bacteria have no genetic information'),
          t('病毒都有细胞核', 'All viruses have a nucleus'),
        ],
        0,
        t(
          '细菌是单细胞生物，没有膜包围的细胞核。病毒不是细胞，遗传物质可为DNA或RNA。',
          'Bacteria are unicellular organisms without a membrane-bound nucleus. Viruses are acellular and may carry DNA or RNA.',
        ),
        t('回看病毒与细胞对照图。', 'Revisit the virus and cell comparison.'),
      ),
      q(
        'L004-q2',
        'concept',
        t(
          '模型中，为什么没有合适宿主细胞时不出现更多病毒？',
          'Why does the model produce no new viruses without a suitable host cell?',
        ),
        [
          t('病毒需要土壤', 'Viruses need soil'),
          t('病毒要先长成细菌', 'Viruses must become bacteria'),
          t(
            '它缺乏独立完成复制的细胞系统',
            'It lacks cellular systems for independent replication',
          ),
        ],
        2,
        t(
          '病毒依赖宿主的细胞系统。并不是接触任意细胞就能感染，合适宿主等条件也重要。',
          'Viruses depend on host-cell systems. Not every cell is a suitable host; compatibility and other conditions matter.',
        ),
        t(
          '切换“无合适宿主”，重放过程。',
          'Select “no suitable host” and replay.',
        ),
      ),
      q(
        'L004-q3',
        'reasoning',
        t(
          '讨论“病毒是不是生命”，哪种回答使用了两方面证据？',
          'Which answer uses evidence on both sides of the debate?',
        ),
        [
          t(
            '会让人生病，所以一定是生命',
            'It causes illness, so it must be alive',
          ),
          t(
            '有遗传信息且能演化，但没有细胞结构，也不能独立代谢与复制',
            'It has genetic information and can evolve, but is acellular and cannot metabolise or replicate independently',
          ),
          t('很小，所以没有生命', 'It is tiny, so it is non-living'),
        ],
        1,
        t(
          '争论与生命采用的定义有关。细胞结构和独立代谢等标准下，病毒通常不被视为独立的生物。',
          'The debate depends on criteria for life. Under cellular and independent-metabolism criteria, viruses are usually not treated as independent organisms.',
        ),
        t(
          '回看讲解中的两方面证据。',
          'Revisit both lines of evidence in the explanation.',
        ),
      ),
      q(
        'L004-q4',
        'vocabulary',
        t(
          '包裹病毒遗传物质的蛋白质结构叫什么？',
          'What is the protein structure enclosing viral genetic material called?',
        ),
        [
          t('细胞核 · nucleus', 'nucleus'),
          t('根 · root', 'root'),
          t('衣壳 · capsid', 'capsid'),
        ],
        2,
        t(
          'Capsid 是衣壳。部分病毒还有外部包膜，本图只画无包膜病毒的简化模型。',
          'Capsid is the protein coat. Some viruses also have an envelope; this diagram shows a simplified non-enveloped virus.',
        ),
        t('复习 capsid，并回看图示。', 'Revisit capsid and the diagram.'),
      ),
    ],
  },
];
export const lessons: Lesson[] = [
  ...lifeLessons,
  ...microLessons,
  ...plantLessons,
  ...bodyLessons,
  ...ecologyLessons,
  ...inquiryLessons,
];
export const questions = lessons.flatMap((lesson) => lesson.questions);
const files = import.meta.glob('../../../curriculum/**/l*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
export function section(id: string, name: string): LocalizedText {
  const raw =
    Object.entries(files).find(([path]) =>
      path.endsWith(`/${id.toLowerCase()}.md`),
    )?.[1] ?? '';
  const block = raw.split(`## ${name} /`)[1]?.split('\n## ')[0] ?? '';
  return t(
    block.split('### 中文\n')[1]?.split('### English\n')[0]?.trim() ?? '',
    block.split('### English\n')[1]?.trim() ?? '',
  );
}
