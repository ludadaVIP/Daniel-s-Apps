import { t, q } from './schema';
export type FieldRecord = {
  name: string;
  evidence: string;
  habitat: string;
  question: string;
  source: 'real' | 'virtual';
};
export type ProjectDraft = {
  records: FieldRecord[];
  zh: string;
  en: string;
  answers: Record<string, number>;
  savedAt?: number;
};
export const emptyProject = (): ProjectDraft => ({
  records: Array.from({ length: 5 }, () => ({
    name: '',
    evidence: '',
    habitat: '',
    question: '',
    source: 'virtual',
  })),
  zh: '',
  en: '',
  answers: {},
});
export const fieldClues = [
  {
    name: t('草叶簇', 'A grass tuft'),
    evidence: t(
      '细长绿色叶片成簇，叶尖朝上。',
      'Narrow green blades form a tuft, with tips pointing upward.',
    ),
    habitat: t(
      '土壤中的开阔处，图中有日光。',
      'An open soil patch with sunlight shown.',
    ),
    question: t(
      '不同日子叶片长度会怎样变化？',
      'How might blade length change on different days?',
    ),
  },
  {
    name: t('开白花的植物', 'A white-flowered plant'),
    evidence: t(
      '白色花瓣围着黄色中心，茎上有叶。',
      'White petals surround a yellow centre; leaves are attached to the stem.',
    ),
    habitat: t(
      '草旁的土壤里，图中有日光。',
      'In soil beside the grass, with sunlight shown.',
    ),
    question: t('是否会有昆虫到访花？', 'Will insects visit the flower?'),
  },
  {
    name: t('蜗牛样动物', 'A snail-like animal'),
    evidence: t(
      '有螺旋壳，身体伸出，前端有触角样结构。',
      'A spiral shell, extended body and tentacle-like structures at the front.',
    ),
    habitat: t('落叶旁有遮荫的地面。', 'Shaded ground beside fallen leaves.'),
    question: t(
      '在一天不同时段能否观察到它？',
      'Can it be observed at different times of day?',
    ),
  },
  {
    name: t('有斑点的小甲虫', 'A spotted small beetle'),
    evidence: t(
      '圆形斑点背部，能看见腿，停在叶片上。',
      'A rounded spotted back and visible legs, resting on a leaf.',
    ),
    habitat: t('绿色植物叶片上。', 'On a green plant leaf.'),
    question: t(
      '它实际吃什么，还需要怎样的观察？',
      'What does it eat, and what observations would help?',
    ),
  },
  {
    name: t('停枝的小鸟', 'A bird on a branch'),
    evidence: t(
      '有喙、翅和两条腿，站在枝上。',
      'A beak, wings and two legs, perched on a branch.',
    ),
    habitat: t('植物上方的枝条。', 'A branch above the plants.'),
    question: t('它到哪里寻找食物？', 'Where does it look for food?'),
  },
];
const look = t(
  '回看相关课程，再检查你用了什么证据。',
  'Revisit the related lesson and inspect the evidence used.',
);
export const stageQuestions = [
  q(
    'S01-q1',
    'concept',
    t(
      '火焰也变大。判断种子有生命，哪种证据更合适？',
      'A flame can grow too. Which evidence better supports a seed being alive?',
    ),
    [
      t(
        '有细胞，适宜条件下能萌发并进行生命活动',
        'It has cells and can germinate and carry out living processes under suitable conditions',
      ),
      t('它现在必须不停移动', 'It must keep moving now'),
      t('它外形像一个小石头', 'It looks like a pebble'),
    ],
    0,
    t(
      '需要相联系的生命证据；移动、变大或形状都不能单独决定。',
      'Use connected evidence of life; movement, growth or shape alone does not decide.',
    ),
    look,
  ),
  q(
    'S01-q2',
    'concept',
    t(
      '一个酵母细胞与洋葱表皮的一格有什么差别？',
      'How does one yeast cell differ from one onion epidermal cell?',
    ),
    [
      t('洋葱表皮每格都是完整洋葱', 'Every epidermal cell is a whole onion'),
      t(
        '一个酵母细胞可为完整个体，洋葱的一格为植物的一部分',
        'A yeast cell can be an organism; an onion cell is part of a plant',
      ),
      t('它们大小一样就功能相同', 'Equal size means equal function'),
    ],
    1,
    t(
      '组成层次和功能要结合解释，不能只凭大小或细胞外形判断。',
      'Interpret levels and function together rather than relying only on size or shape.',
    ),
    look,
  ),
  q(
    'S01-q3',
    'concept',
    t(
      '根得到水和矿质营养，叶制糖还需要什么？',
      'Roots supply water and minerals. What else does a leaf need to make sugars by photosynthesis?',
    ),
    [
      t('土壤里的现成糖和动物午饭', 'Ready-made soil sugar and animal lunch'),
      t('只有更多矿质营养', 'Only more minerals'),
      t('合适光照与二氧化碳', 'Suitable light and carbon dioxide'),
    ],
    2,
    t(
      '光提供能量，水与二氧化碳提供参与制糖的物质；矿质营养不是现成糖。',
      'Light supplies energy; water and carbon dioxide supply matter involved in sugar production. Minerals are not ready-made sugar.',
    ),
    look,
  ),
  q(
    'S01-q4',
    'concept',
    t(
      '蚜虫取食植物，食物网箭头应该怎样画？',
      'Aphids feed on a plant. Which food-web arrow is appropriate?',
    ),
    [
      t('植物→蚜虫', 'Plant → aphid'),
      t(
        '蚜虫→植物，因为箭头追着猎物',
        'Aphid → plant, because arrows chase prey',
      ),
      t('两个方向随便选', 'Either direction at random'),
    ],
    0,
    t(
      '食物网箭头从食物指向取食者，表示能量等传递。它不预测种群数量。',
      'Food-web arrows run from food to feeder, indicating transfers including energy. They do not predict population sizes.',
    ),
    look,
  ),
  q(
    'S01-q5',
    'concept',
    t(
      '虚拟弱光组7天平均茎增量较大，可以得出什么？',
      'The fictional weaker-light group has greater mean stem gain over seven days. What follows?',
    ),
    [
      t(
        '所有植物在弱光下都更健康',
        'All plants are healthier under weaker light',
      ),
      t(
        '这个样本的高度指标不同；整体健康还需其他证据',
        'This sample differs in height gain; overall health needs other evidence',
      ),
      t('高度证明产生了更多糖', 'Height proves more sugar production'),
    ],
    1,
    t(
      '限定样本、时间和指标，再说明局限。新证据可能修正解释。',
      'Scope the sample, time and outcome, then state limits. New evidence may revise the interpretation.',
    ),
    look,
  ),
];
export const projectTextReady = (draft: ProjectDraft) =>
  draft.records.length === 5 &&
  draft.records.every((r) =>
    [r.name, r.evidence, r.habitat, r.question].every((v) => v.trim()),
  ) &&
  !!draft.zh.trim() &&
  !!draft.en.trim();
export const projectCheck = (draft: ProjectDraft) => ({
  answered: stageQuestions.filter((q) => draft.answers[q.id] !== undefined)
    .length,
  correct: stageQuestions.filter((q) => draft.answers[q.id] === q.correct)
    .length,
});
