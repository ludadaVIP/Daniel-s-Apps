import { t } from './schema';
export const units = [
  {
    id: 'U01',
    stage: 'S01',
    title: t('生命是什么？', 'What is life?'),
    question: t(
      '怎样用证据判断生命？',
      'How can evidence help us recognise life?',
    ),
    lessonIds: ['L001', 'L002', 'L003', 'L004'],
    missionTitle: t(
      '给身边的物体，写一份生命证据。',
      'Build a case for something nearby.',
    ),
    missionPrompt: t(
      '在家里选一个物体。把观察和解释分开：我认为……，因为我观察到……，这说明……。可以记录“不确定”，并说还需要什么证据。',
      'Choose something at home. Separate observation and explanation: I claim …, I observed …, this suggests … . You can be unsure and explain what evidence is missing.',
    ),
    claimLabel: t(
      '① 我的主张：哪个物体？活的、不活的，还是不确定？',
      '① Claim: what object? Living, non-living, or unsure?',
    ),
  },
  {
    id: 'U02',
    stage: 'S01',
    title: t('进入微观世界', 'Into the microscopic world'),
    question: t(
      '一个小小的细胞，怎样与整个生命联系起来？',
      'How does a tiny cell connect to a whole living thing?',
    ),
    lessonIds: ['L005', 'L006', 'L007', 'L008'],
    missionTitle: t(
      '厨房里的细胞侦探：酵母与洋葱。',
      'Kitchen cell detective: yeast and onion.',
    ),
    missionPrompt: t(
      '回看 L008 的双语示意图。一个酵母细胞可以是一个完整个体；洋葱表皮的一格细胞是植物的一部分。写下你的主张、图中能观察到的证据，以及图示不能单独证明的事。可用厨房里的洋葱和有标签的面包酵母作生活对照，无需培养或购买显微镜。',
      'Revisit the L008 diagrams. One yeast cell can be an organism; an onion epidermal cell is part of a plant. State your claim, visible evidence and what the diagrams alone cannot establish. Compare with a kitchen onion and labelled baking yeast; no culturing or microscope purchase is needed.',
    ),
    claimLabel: t(
      '① 我的主张：酵母的一格与洋葱的一格，哪个是完整个体？',
      '① Claim: which single cell represents a whole organism—yeast or onion?',
    ),
  },
  {
    id: 'U03',
    stage: 'S01',
    title: t('植物与它们的秘密', 'Plants and their secrets'),
    question: t(
      '不跑不跳的植物，怎样把生活安排好？',
      'How does a plant organise life without running around?',
    ),
    lessonIds: ['L009', 'L010', 'L011', 'L012'],
    missionTitle: t(
      '窗台植物的双向路线图。',
      'A windowsill plant’s two-way route map.',
    ),
    missionPrompt: t(
      '选一株熟悉的现有植物或照片，观察叶、茎及环境。写一个有关水或糖路线的主张，指出直接看见的部分与借助课程推测的部分，再解释根、茎、叶为何相互依赖。用蓝箭头画水、金箭头画糖；可在纸上画，不需拔根或改变照料。',
      'Choose a familiar plant or photo and observe leaves, stems and surroundings. State a claim about a water or sugar route, distinguish visible evidence from lesson-based inference, and explain organ interdependence. Draw blue water arrows and gold sugar arrows on paper if helpful; no uprooting or changed care is needed.',
    ),
    claimLabel: t(
      '① 我的主张：这株植物的水或糖，怎样从来源到需要的地方？',
      '① Claim: how does water or sugar travel from a source to a destination?',
    ),
  },
  {
    id: 'U04',
    stage: 'S01',
    title: t('动物与我们的身体', 'Animals and our bodies'),
    question: t(
      '吃饭、走路、听声音，身体怎样接力？',
      'How does your body cooperate to eat, move and listen?',
    ),
    lessonIds: ['L013', 'L014', 'L015', 'L016'],
    missionTitle: t(
      '为跑步者画一张身体接力图。',
      'Draw a body relay map for a runner.',
    ),
    missionPrompt: t(
      '画一个想象中的跑步者，把氧从空气经肺和循环到肌肉、养分从食物经消化吸收到细胞的路线连起来。再画二氧化碳回到右心、肺和外界的路线。说明图中哪些是课程模型线索，哪些是你能直接观察到的现象，以及模型省略了什么。无需实际跑步或测身体指标。',
      'Sketch an imagined runner. Connect oxygen from air through lungs and circulation to muscle, and nutrients from food through digestion and absorption to cells. Add carbon dioxide’s return via the right heart, lungs and outside air. Separate lesson-model clues from directly observable evidence and state what the model omits. No actual running or body measurements needed.',
    ),
    claimLabel: t(
      '① 我的主张：为什么跑步需要多个器官合作？',
      '① Claim: why does running need several organs working together?',
    ),
  },
  {
    id: 'U05',
    stage: 'S01',
    title: t('家门口的生态系统', 'An ecosystem at your doorstep'),
    question: t(
      '一片叶子、一只小虫，怎样连起整个后院？',
      'How can a leaf and an insect connect a whole garden?',
    ),
    lessonIds: ['L017', 'L018', 'L019', 'L020'],
    missionTitle: t(
      '画一张有证据的后院食物网。',
      'Draw an evidence-based garden food web.',
    ),
    missionPrompt: t(
      '选课中虚拟后院或安全熟悉的真实地方。至少画植物、一个植食者和一个捕食者，再按证据加一条相连路线。箭头写清食物→取食者。挑一种生物减少的情境，用“可能…因为…还需…”解释；区分直接观察、虚拟证据卡与资料，未知关系标为待查。不捕捉、喂食、移除或引入生物。',
      'Choose the virtual garden or a safe familiar real site. Draw a plant, plant-feeding animal and predator, then add a connected route if evidence supports it. Label arrows food → feeder. Explain a decline with “might … because … we still need …”. Separate direct observations, virtual cards and sources; mark unknown links. No catching, feeding, removal or introduction.',
    ),
    claimLabel: t(
      '① 我的主张：哪条取食关系改变，可能影响谁？',
      '① Claim: which feeding link changes and who might be affected?',
    ),
  },
  {
    id: 'U06',
    stage: 'S01',
    title: t('做一个小科学家', 'Be a young scientist'),
    question: t(
      '怎样让一个好奇心，变成别人能检查的解释？',
      'How can curiosity become an explanation others can check?',
    ),
    lessonIds: ['L021', 'L022', 'L023', 'L024'],
    missionTitle: t(
      '设计光照与幼苗的公平比较。',
      'Design a fair light–seedling comparison.',
    ),
    missionPrompt: t(
      '只设计即可：问两种光照强度是否影响7天茎高度增量。写明改变什么、测量起终点与单位、保持什么尽量一致、每组多株与随机分组。照射时长要一致，核对水分与温度等实际条件。引用课中虚拟数据时标清来源，不当作自己的实测。无需改变真实植物照料。',
      'A plan is enough: ask whether two light intensities affect seven-day stem-height gain. State what changes, measurement endpoints and units, what stays similar, multiple seedlings per group and random assignment. Keep exposure duration similar and check actual moisture and temperature. Label lesson data as fictional rather than your own measurements. No changed care is needed.',
    ),
    claimLabel: t(
      '① 我的问题与预测：改变什么，会怎样？',
      '① Question and prediction: what changes, and what might happen?',
    ),
  },
];
export function unitForLesson(id: string) {
  return units.find((unit) => unit.lessonIds.includes(id))!;
}
