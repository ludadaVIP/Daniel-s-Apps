import { t } from './schema';
export const immunityEvidenceUnits = [
  {
    id: 'U29',
    stage: 'S05',
    title: t('免疫与公共卫生科学', 'Immunity and public-health science'),
    question: t(
      '机制与数据如何共同限定健康宣传的结论？',
      'How do mechanisms and data constrain a health claim?',
    ),
    lessonIds: ['L113', 'L114', 'L115', 'L116'],
    missionTitle: t('审查一则虚构健康宣传', 'Audit a fictional health advert'),
    missionPrompt: t(
      '青禾饮品是虚构材料。完整随访情景A10/200、B20/200，均按同一期间每人是否至少出现一次事件计数。写风险5%/10%、绝对差5个百分点及相对B降低50%；再比较A10/50。另一个缺失情景从A200名分配者起，170有结局、10有事件、30失访，给完整病例10/170约5.88%和全组极端5%至20%边界，不能混用分母。用主张+证据+推理说明自选分组/睡眠混杂为何不能证明饮品因果效应，提出随机对照、同结局、尽可能盲法与追踪失访的改进。再引用免疫记忆或耐药一例说明机制合理不等于本材料已证明。写一条局限、一项新证据；可用中文完成生物推理，英语另练“The evidence supports … under …, but does not establish …”。',
      'Qinghe drink is fictional. In the complete-follow-up scenario A has 10/200 and B 20/200 people with a defined event during the same period. Report 5%/10%, a 5-percentage-point absolute difference and 50% reduction relative to B; compare A at 10/50. A separate missing-outcome scenario begins with 200 assigned to A: 170 observed, 10 events, 30 missing. Report complete-case 10/170≈5.88% and extreme full-group bounds 5%–20%, without mixing denominators. Write a claim, evidence and reasoning explaining why self-selection/sleep confounding prevents this proving a drink effect. Propose random allocation, controls, the same outcome, feasible blinding and missing-outcome follow-up. Cite memory or resistance to distinguish plausible mechanism from proof in these data. Add a limitation and new evidence. Chinese reasoning is accepted; practise separately: “The evidence supports … under …, but does not establish …”.',
    ),
    claimLabel: t(
      '① 我的有条件主张与分母',
      '① My qualified claim and denominators',
    ),
  },
  {
    id: 'U30',
    stage: 'S05',
    title: t('生物实验与数据分析', 'Biological experiments and data analysis'),
    question: t(
      '怎样修复坏实验，让结论真正回答问题？',
      'How can a faulty experiment be repaired to answer its question?',
    ),
    lessonIds: ['L117', 'L118', 'L119', 'L120'],
    missionTitle: t(
      '修复豆苗试验并写证据报告',
      'Repair a seedling trial and write an evidence report',
    ),
    missionPrompt: t(
      '坏设计：4 h远窗10 mL水，8 h近窗20 mL水，把同株12读数当n12。修复为同水/土/品种、位置分块且块内随机、独立盆栽处理，并明确7天株高增量cm。虚构修复数据4 h为8,9,10,9 cm，8 h为11,12,12,13 cm，各4独立植株，均值9/12 cm，min–max8–10/11–13 cm，范围均2 cm。给原始点、英文图题与双语轴；范围不是CI。再将10替为未核实28，报告第一组均值13.5 cm及比较方向改变，查原表不能随意删。写CER：本条件差3 cm、可行光合作用机制但未直接测糖、一次品种/批次限制；提新独立批次及多品种比较。英语练句框可选，生物解释可中文；不用做实际实验或培养微生物。',
      'Faulty design: 4 h far from the window with 10 mL water, 8 h near with 20 mL; twelve readings of one plant counted as n12. Match water/soil/variety, block by position, randomise within blocks and use independently treated pots; define seven-day height change in cm. Fictional repaired data: 4 h 8,9,10,9 cm; 8 h 11,12,12,13 cm, four independent plants/group. Means are 9/12 cm, min–max 8–10/11–13 cm, ranges both 2 cm. Plot raw points with an English title and bilingual axes; range is not a CI. Replace 10 by an unverified 28 and report mean 13.5 cm and reversal, investigating rather than deleting. Write CER using the conditional 3 cm difference, plausible photosynthesis without measured sugar, and limits of one batch/variety. Propose independent batches and more varieties. English frames are optional; Chinese biological reasoning is accepted. Entirely on-screen; no live experiment or microbial culture required.',
    ),
    claimLabel: t(
      '① 我的修复设计与有边界结论',
      '① My repaired design and bounded conclusion',
    ),
  },
];
