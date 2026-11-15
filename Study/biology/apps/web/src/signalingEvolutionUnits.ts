export const signalingEvolutionUnits = [
  {
    id: 'U33',
    stage: 'S06',
    title: {
      zh: '信号、调节与协作',
      en: 'Signalling, regulation and cooperation',
    },
    question: {
      zh: '细胞信号如何在条件与反馈中形成系统响应？',
      en: 'How do conditions and feedback turn cellular signals into system responses?',
    },
    lessonIds: ['L129', 'L130', 'L131', 'L132'],
    missionTitle: {
      zh: '修复一张反馈控制图',
      en: 'Repair a feedback control diagram',
    },
    missionPrompt: {
      zh: '以胰岛素或ADH为真实机制例，标出刺激、感受/控制、信号、受体、效应与返回箭头。再用虚构偏差模型初值10任意单位、k0.3无延迟给10→7→4.9；改为k0.6且延迟1步给10→4→−2。预测改变受体或效应器条件后的响应，说明负偏差不是负激素浓度。写CER：有条件主张、至少两数值及单位、逐箭头机制、一个未测步骤和一条模型局限；画图区分轴突电活动与突触释放，或说明免疫两分支何以不能互相替代。英语另练“The response would … if … because …; the model does not establish …”。生物推理可中文完成，不以英语准确度锁定。',
      en: 'Use insulin or ADH as a real mechanism example and label stimulus, sensing/control, signal, receptor, effector and return arrow. In the fictional deviation model use x0=10 arbitrary units and k0.3 without lag:10→7→4.9; compare k0.6 with one-step lag:10→4→−2. Predict the consequence of changing a receptor or effector condition; negative deviation is not negative hormone concentration. Write CER with a conditional claim, two values and units, arrow-by-arrow mechanism, an unmeasured step and a limitation. Distinguish axonal electrical activity from synaptic release, or explain why immune branches are not interchangeable. Practise separately: “The response would … if … because …; the model does not establish …”. Chinese reasoning is accepted; English accuracy does not lock biology progress.',
    },
    claimLabel: {
      zh: '① 我的有条件反馈主张',
      en: '① My conditional feedback claim',
    },
  },
  {
    id: 'U34',
    stage: 'S06',
    title: {
      zh: '进化、群体与证据',
      en: 'Evolution, populations and evidence',
    },
    question: {
      zh: '相同的频率变化可能来自哪些过程，如何用证据区分？',
      en: 'Which processes can produce similar frequency changes, and how can evidence distinguish them?',
    },
    lessonIds: ['L133', 'L134', 'L135', 'L136'],
    missionTitle: {
      zh: '给两条频率轨迹做机制鉴别',
      en: 'Compare mechanisms behind two frequency trajectories',
    },
    missionPrompt: {
      zh: '比较两情景，起点pA=.4、N20、10代：A仅选择，AA/Aa/aa适合度1.4/1.2/1；B仅漂变，种子17，再改种子29并比较N200。记录每条起终频率与重复条件；频率是拷贝比例，不是植株数。解释选择的繁殖权重与漂变随机取样，不能仅凭一条上升路径定因；提出多群体重复、繁殖成功或迁入记录。另算20株p.4混合10株p.8得.533，注明子代恢复N的模型假设。用CER给两种机制、有数值条件证据和一条局限；可补树旋转不改clade或品系×环境对照，避免把适合度等同努力、遗传率等同命运。英语另练“Under …, the frequency changed from … to …; this is consistent with … but does not distinguish …”。中文科学解释完整可达标。',
      en: 'Compare two scenarios starting pA=.4,N20,10 generations: A selection only, AA/Aa/aa fitness1.4/1.2/1; B drift only,seed17,then seed29 and N200. Record starting/ending frequencies and replication conditions; frequency is an allele-copy fraction, not plant count. Explain reproductive weights versus random sampling; a single increase does not establish cause. Propose replicated populations,reproductive-success or migration records. Also calculate pooling20 plants at.4 with10 at.8=.533 and state the fixed-N offspring assumption. Write CER with both mechanisms,conditional numerical evidence and a limitation. Optionally add invariant clades under tree rotation or a lineage×environment comparison. Fitness is not effort and heritability is not destiny. Practise separately: “Under …, the frequency changed from … to …; this is consistent with … but does not distinguish …”. Complete Chinese scientific reasoning can meet the biology goal.',
    },
    claimLabel: {
      zh: '① 我的两情景有边界比较',
      en: '① My qualified two-scenario comparison',
    },
  },
];
