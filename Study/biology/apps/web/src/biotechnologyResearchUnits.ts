import { t } from './schema';
export const biotechnologyResearchUnits = [
  {
    id: 'U35',
    stage: 'S06',
    title: t('生物技术与伦理', 'Biotechnology and ethics'),
    question: t(
      'DNA技术提供什么证据，哪些决定还需要价值判断？',
      'What can DNA technology establish, and which decisions also require values?',
    ),
    lessonIds: ['L137', 'L138', 'L139', 'L140'],
    missionTitle: t('虚拟DNA证据听证会', 'A virtual DNA evidence hearing'),
    missionPrompt: t(
      '仅使用L137–L140屏幕材料，提交CER：对照有效时样本约400 bp条带支持片段大小相近，不足以读出序列或唯一身份；空白有信号或阳性失败时改判。引用20个虚构植物样本中12个预期产物、5个其他修复、3个未改变，说明60%分母仅20、其余80未测，不能宣称全部编辑成功或无脱靶。选择继续封闭研究或暂缓扩大研究之一，区分事实、不确定与公平/生态价值，写出受影响者、信息同意、停止条件及能改变决定的新证据。两种政策都可有合理理由；评价证据与论证，不按立场给分。无需任何实际PCR、电泳或编辑。',
      'Use only the L137–L140 virtual material for CER: with valid controls, an approximately 400 bp band supports similar fragment size, not a sequence or unique identity; revise if the blank signals or positive control fails. Of 20 fictional plant samples, 12 have the intended product, five other repairs and three no change: 60% applies only to 20 tested samples; 80 remain unassessed. Do not claim universal success or absence of off-target changes. Support either continued contained research or a pause before expansion, separating facts, uncertainty and fairness/ecological values. Name stakeholders, informed agreement, a stopping rule and evidence that could change the decision. Evaluate reasoning, not policy allegiance. No real PCR, electrophoresis or editing.',
    ),
    claimLabel: t(
      '① 我的有限证据主张与可辩护决定',
      '① My bounded evidence claim and defensible decision',
    ),
  },
  {
    id: 'U36',
    stage: 'S06',
    title: t('毕业研究工作坊', 'Graduation research workshop'),
    question: t(
      '怎样把值得问的问题变成可核查的双语研究？',
      'How does a worthwhile question become a checkable bilingual investigation?',
    ),
    lessonIds: ['L141', 'L142', 'L143', 'L144'],
    missionTitle: t(
      '研究方案、图表与双语结论',
      'A research plan, chart and bilingual conclusion',
    ),
    missionPrompt: t(
      '练习用虚构鸟类观察表修问题、努力与缺失，再把方法迁移到自己的官方公开生态数据或安全家庭观察。说明来源URL/机构/获取日期或自录条件、研究对象地点时期、取样单位、描述/比较问题、配对或独立、努力及混杂；保留原始数据、单位、缺失和真实0。给可读图表、英文摘要及双语图注，用数据→推理→局限回答问题并列参考来源。准备3–5分钟讲稿或分镜，按自己语速排练；解释可用任选语言，报告成品须有实际双语内容。不可把课堂虚构表冒充真实调查，也不强迫操纵生物以获得因果。',
      'Practise repairing questions, effort and missingness with the fictional bird table, then transfer to official public ecological data or safe home observations. Record a source URL/institution/access date or your own recording conditions, organisms/place/period, sampling unit, descriptive/comparative question, paired or independent design, effort and confounding. Retain raw values, units, missingness and real zero. Produce a readable chart, English abstract and bilingual caption; answer with data → reasoning → limitation and references. Prepare a 3–5 minute script or storyboard and rehearse at your own pace. Explain biology in either language; the finished report needs actual bilingual content. Never present the classroom fictional table as a real survey, or manipulate organisms merely to force a causal question.',
    ),
    claimLabel: t(
      '① 我的研究问题、单位与有边界结论',
      '① My research question, units and bounded conclusion',
    ),
  },
];
