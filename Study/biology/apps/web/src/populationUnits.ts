import { t } from './schema';
export const populationUnits = [
  {
    id: 'U17',
    stage: 'S03',
    title: t('生态系统会变化', 'Ecosystems change'),
    question: t(
      '数量、样本与环境变化之间，证据能连到哪一步？',
      'How far can evidence connect abundance, samples and environmental change?',
    ),
    lessonIds: ['L065', 'L066', 'L067', 'L068'],
    missionTitle: t(
      '虚拟样方研究：估计而不假装知道。',
      'Virtual quadrat study: estimate without pretending certainty.',
    ),
    missionPrompt: t(
      '打开L067，先用种子42抽6格，再换到43，保留每套位置、逐格计数、样本面积、密度与36平方米估计。比较路边方案，再揭示普查96。说明为何便利抽样可能偏低、挑密集格可能偏高，以及随机结果为何波动。最后用L068两次访问的原始数据写一句英文结论和一项仍需收集的证据。全部数据为原创虚构记录，不外推真实地点。',
      'In L067 draw six cells with seed 42, then 43. Retain positions, raw counts, sampled area, density and estimate for 36 m². Compare roadside sampling, then reveal census 96. Explain low roadside bias, possible high dense-cell bias and random variation. Use two L068 visits to add one English conclusion and needed evidence. All records are invented, not a real-site forecast.',
    ),
    claimLabel: t(
      '① 我的主张与计算：哪些位置、密度、估计，能推断到什么范围？',
      '① Claim and calculation: which positions, density and estimate, with what scope?',
    ),
  },
  {
    id: 'U18',
    stage: 'S03',
    title: t(
      '为什么家人既相似又不同',
      'Why relatives are similar and different',
    ),
    question: t(
      '遗传信息、环境与观察到的差异，怎样分开又联系？',
      'How can hereditary information, environments and observed differences be separated and connected?',
    ),
    lessonIds: ['L069', 'L070', 'L071', 'L072'],
    missionTitle: t(
      '虚构物种证据档案。',
      'An evidence file for a fictional species.',
    ),
    missionPrompt: t(
      '给虚构物种命名，记录L069同基因型换环境、同环境换基因型的两组数。用L070说明DNA、基因与染色体关系，再为L071的一种性状列不重叠分组。选L072一对亲代，追踪每方贡献与可能组合。写一句英文，指出单位置模型不能预测复杂人类性状，概率不能保证四个子代的比例。可文字描述，不需家庭遗传或个人身体资料。',
      'Name a fictional species. Record L069 comparisons of one genotype across environments and genotypes in one environment. Explain DNA/gene/chromosome relationships using L070, and group one L071 trait without overlap. Choose L072 parents and trace their contributions and possible combinations. Add an English sentence explaining that one locus cannot predict complex human traits and probabilities do not guarantee four-offspring ratios. Text is enough; no personal or family genetic information is needed.',
    ),
    claimLabel: t(
      '① 我的虚构物种：哪种性状，哪些遗传与环境比较？',
      '① My fictional species: which trait and genetic/environmental comparisons?',
    ),
  },
];
