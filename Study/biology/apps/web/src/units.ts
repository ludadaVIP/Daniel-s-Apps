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
  {
    id: 'U07',
    stage: 'S02',
    title: t('细胞内部大冒险', 'An adventure inside cells'),
    question: t(
      '看见一个细胞，怎样理解整个生命的合作？',
      'How does one cell help explain cooperation in a whole organism?',
    ),
    lessonIds: ['L025', 'L026', 'L027', 'L028'],
    missionTitle: t('两格细胞的比较地图。', 'A two-cell comparison map.'),
    missionPrompt: t(
      '从典型动物、绿色叶肉、地下洋葱鳞叶表皮模型中选两格。标至少三种共有结构、一个差异和两种工作；写一个英文比较句。区分模型线索与直接观察，解释壁不代替膜、叶绿体不是植物细胞通用特征。纸上图或文字都可以，无需采样或设备。',
      'Choose two typical animal, green mesophyll or underground onion bulb epidermal models. Mark three shared parts, one difference and two jobs, adding one simple English comparison. Distinguish model clues from direct observations; explain why walls do not replace membranes and chloroplasts are not universal. Sketch or describe without sampling or equipment.',
    ),
    claimLabel: t(
      '① 我的比较：哪两格细胞，有什么共性与差异？',
      '① Comparison: which two cells, and what is shared or different?',
    ),
  },
  {
    id: 'U08',
    stage: 'S02',
    title: t('细胞怎样交换物质', 'How cells exchange substances'),
    question: t(
      '一粒随机移动，为什么整群有方向？',
      'Why can random individuals produce a collective direction?',
    ),
    lessonIds: ['L029', 'L030', 'L031', 'L032'],
    missionTitle: t(
      '给扩散写一份数据解释。',
      'Explain diffusion with records.',
    ),
    missionPrompt: t(
      '打开L030记录表，选两帧，记模型步、左右数量和两个方向的穿越次数。用相减解释净变化，写一句英文，并换一段轨迹检查波动。明确等体积和模型记录，生活果汁观察另列；不把模型当作真实时间或速率。无需实验或设备。',
      'Open the L030 record table and choose two snapshots. Record model steps, left/right counts and crossing events in both directions. Subtract to explain net change, add an English sentence and compare another trace for fluctuations. State equal volumes and model data; separate real juice observations. No real time/rate or experiment is implied.',
    ),
    claimLabel: t(
      '① 我的主张：哪种起始条件、哪一段，整体怎样变？',
      '① Claim: which starting conditions and interval, and what changed?',
    ),
  },
  {
    id: 'U09',
    stage: 'S02',
    title: t('生命需要能量', 'Life needs energy'),
    question: t(
      '早餐与阳光，怎样联系细胞工作？',
      'How do breakfast and sunlight connect to cellular work?',
    ),
    lessonIds: ['L033', 'L034', 'L035', 'L036'],
    missionTitle: t(
      '追踪阳光到动物活动。',
      'Trace sunlight to animal activity.',
    ),
    missionPrompt: t(
      '画或描述阳光→叶片制糖→食物→细胞呼吸/ATP→动物活动与热，再加枯落物→分解者支路。另画CO₂的碳进入糖、又可经呼吸返回空气的物质路线。写一句英文比较，标明模型条件/假设比例与直接生活观察，不把光当碳、不把热变回阳光。无需实验或设备。',
      'Sketch or describe sunlight → leaf sugar-making → food → respiration/ATP → animal activity and heat, with detritus → decomposers. Separately trace CO₂ carbon into sugar and potentially back to air through respiration. Add an English comparison and separate model assumptions from everyday observations. Light is not carbon and heat does not return as sunlight. No experiment needed.',
    ),
    claimLabel: t(
      '① 我的路线：从哪种食物到哪些活动？物质与能量如何分开？',
      '① Route: which food and activities? How are matter and energy separated?',
    ),
  },
  {
    id: 'U10',
    stage: 'S02',
    title: t('人体是合作系统', 'Body systems cooperate'),
    question: t(
      '食物与空气，怎样会合在身体细胞？',
      'How do food and air meet at body cells?',
    ),
    lessonIds: ['L037', 'L038', 'L039', 'L040'],
    missionTitle: t(
      '氧分子从肺泡到细胞的旅程。',
      'An oxygen journey from alveolus to cell.',
    ),
    missionPrompt: t(
      '画或描述肺泡空气→肺毛细血管→肺静脉→左心→体动脉→肌肉毛细血管→组织间液→细胞，标两次跨边界与血红蛋白运输。加葡萄糖的肠与肝来源、CO₂碳经右心到肺的回程。写一句英文合作解释与一个模型缺省，区分模型和直接观察。不需实验、运动或身体测量。',
      'Sketch or describe alveolar air → lung capillary → pulmonary vein → left heart → systemic artery → muscle capillary → tissue fluid → cell. Mark two boundary crossings and haemoglobin carriage. Add gut/liver glucose supply and carbon return via right heart to lung. Explain cooperation in one English sentence and state an omission, distinguishing model clues from observation. No experiment, exercise or body measurements needed.',
    ),
    claimLabel: t(
      '① 我的路线：氧怎样从肺泡到细胞？哪些环节各做什么？',
      '① Route: how does oxygen reach a cell, and what does each link do?',
    ),
  },
  {
    id: 'U11',
    stage: 'S02',
    title: t('植物的内部交通', 'Transport inside plants'),
    question: t(
      '一片叶子怎样连起土壤、空气和新生长？',
      'How does one leaf connect soil, air and new growth?',
    ),
    lessonIds: ['L041', 'L042', 'L043', 'L044'],
    missionTitle: t(
      '解释一片叶子的三条路线。',
      'Explain three routes for a leaf.',
    ),
    missionPrompt: t(
      '选已有叶片或课程模型，画土壤→根→木质部/茎→叶的水路线，补上蒸发与气孔失水。加空气CO₂进叶、光供能制造有机物、韧皮部糖从源到库。解释较窄孔的取舍，写一句英文与一个模型条件。直接观察和机制解释分开；不需实验或改变照料。',
      'Choose an existing leaf or lesson model. Trace soil → root → xylem/stem → leaf water, then evaporation and stomatal vapour loss. Add air CO₂ entry, light supporting organic-material production, and phloem sugars from source to sink. Explain a narrow-pore trade-off, adding an English sentence and one model condition. Separate observation and mechanism; no experiment or changed care needed.',
    ),
    claimLabel: t(
      '① 我的路线：叶片需要什么，从哪来、往哪去？',
      '① Routes: what does the leaf need, where from, and where to?',
    ),
  },
  {
    id: 'U12',
    stage: 'S02',
    title: t('分类与环境', 'Classification and environment'),
    question: t(
      '从一个名字，怎样走到它在环境中的生活？',
      'How does a name connect to life in its environment?',
    ),
    lessonIds: ['L045', 'L046', 'L047', 'L048'],
    missionTitle: t(
      '设计六种本地生物的检索表。',
      'Design a key for six local organisms.',
    ),
    missionPrompt: t(
      '用课程六张图：卷心菜树、银蕨、tūī、kererū、惠灵顿树wētā与成年雌katipō。设计每步两个可检查特征的文字或纸上检索表，测试两条样本路线，保留“看不清/表外”的未知出口。写一句英文，说明仅辨认这六幅已标定图；检索顺序不是演化树，不需采样。',
      'Use six lesson illustrations: cabbage tree, silver fern, tūī, kererū, Wellington tree wētā and adult-female katipō. Write or sketch paired checkable choices, test two sample routes and include an unclear/out-of-scope exit. Add an English sentence explaining the six-picture scope; key order is not an evolutionary tree. No collecting needed.',
    ),
    claimLabel: t(
      '① 我的检索表：哪些成对特征，把谁分开？',
      '① My key: which paired traits separate which samples?',
    ),
  },
];
export function unitForLesson(id: string) {
  return units.find((unit) => unit.lessonIds.includes(id))!;
}
