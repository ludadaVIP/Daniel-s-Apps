export const plantInformationUnits = [
  {
    id: 'U27',
    stage: 'S05',
    title: {
      zh: '植物生理深度学习',
      en: 'Plant Physiology in Depth',
    },
    question: {
      zh: '运输、蒸腾、光合与繁殖怎样受条件限制？',
      en: 'How do conditions constrain transport, transpiration, photosynthesis and reproduction?',
    },
    lessonIds: ['L105', 'L106', 'L107', 'L108'],
    missionTitle: {
      zh: '温室叶片证据报告',
      en: 'Greenhouse leaf evidence report',
    },
    missionPrompt: {
      zh: '原创模型：20°C、光100、风0，湿度50%时蒸腾5、湿度80%时2相对单位/时；湿度50%把风0→3则5→10。写带条件主张，引用两组数值，解释梯度与边界层，并讨论气孔关闭及吸水计代理局限。联系木质水流、光合CO₂条件和结籽需要后续成功。中文即可，可选英文图题和一句限制。',
      en: 'Original model: at 20°C,light 100,wind 0,loss is 5 at humidity 50% and 2 at 80% relative units/time; at 50% humidity,wind 0→3 changes 5→10. Make a conditional claim with two numerical comparisons, explain gradients/boundary layers, and discuss stomatal closure and the uptake-proxy limit. Link xylem flow, photosynthetic carbon conditions and later seed-set stages. Chinese is sufficient; English titles or a limitation sentence are optional.',
    },
    claimLabel: {
      zh: '① 条件、主张和数值证据',
      en: '① Conditions, claim and numerical evidence',
    },
  },
  {
    id: 'U28',
    stage: 'S05',
    title: {
      zh: '遗传信息与遗传变异',
      en: 'Genetic Information and Variation',
    },
    question: {
      zh: '结构、表达、分配和环境怎样共同影响表现？',
      en: 'How do structure, expression, division and environment influence phenotype?',
    },
    lessonIds: ['L109', 'L110', 'L111', 'L112'],
    missionTitle: {
      zh: '从DNA到表现型的分层因果图',
      en: 'A layered causal map from DNA to phenotype',
    },
    missionPrompt: {
      zh: '画DNA→RNA→蛋白→细胞功能→表现型，另加功能RNA路径和环境箭头，标转录/翻译位置。用2n=4减数账本解释信息如何分配。引用L112 G=3时环境0→2、性状16→28，及G=0/6环境增量6/18单位，支持条件化交互主张。写结构证据和不能一基因一性状/不能外推人类的局限；英文标签与限制句可选，不作为生物通关条件。',
      en: 'Map DNA→RNA→protein→cell function→phenotype, with functional RNA and environmental arrows; locate transcription/translation. Use the 2n=4 meiotic budget to explain information distribution. Cite L112:G=3,E0→2 gives 16→28, while G=0/6 environmental increments are 6/18 units, supporting a conditional interaction claim. Include structural evidence and limits on one-gene/one-trait and human extrapolation. English labels and limitation sentences are optional, never a biology gate.',
    },
    claimLabel: {
      zh: '① 信息层级、证据与适用条件',
      en: '① Information levels, evidence and scope',
    },
  },
];
