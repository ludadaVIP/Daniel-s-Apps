import { t } from './schema';

export const connectionUnits = [
  {
    id: 'U13',
    stage: 'S03',
    title: t('看不见的生命伙伴', 'Our microscopic partners'),
    question: t(
      '怎样根据结构、作用与情境理解微生物，而不把它们全当敌人？',
      'How do structure, effects and context help us understand microbes without calling them all enemies?',
    ),
    lessonIds: ['L049', 'L050', 'L051', 'L052'],
    missionTitle: t('微生物角色证据展', 'A microbial role evidence exhibit'),
    missionPrompt: t(
      '回看L050四张卡：已知面包酵母、落叶分解真菌、已有致病证据的细菌与未知彩色斑点。分别归入“给定情境有帮助/有危害/证据不足”，引用各卡的作用证据。再选一组活酵母/热灭活或有糖/无糖模型对照，区分模型前提、观察与推断；连接一种身体屏障，写一句英文及一个仍缺证据的问题。可完全用课内资料，不培养或接触未知微生物。',
      'Use the four L050 cards: known baking yeast, leaf-litter decomposer fungus, a bacterium with established disease evidence and an unidentified coloured spot. Classify each as helpful/harmful in this context or insufficient evidence, citing effects. Add one viability or sugar-availability model comparison and distinguish assumptions, observations and inference. Connect a body barrier, add an English sentence and a question needing more evidence. Lesson resources suffice; do not culture or handle unknown microbes.',
    ),
    claimLabel: t(
      '① 四张卡各是什么角色？“微生物全是坏的”应怎样改写？',
      '① What role fits each card? How should “all microbes are bad” be revised?',
    ),
  },
  {
    id: 'U14',
    stage: 'S03',
    title: t('成长与生命延续', 'Growth and continuing life'),
    question: t(
      '生命怎样改变自己，又怎样把遗传信息传给下一代？',
      'How does an individual change, and how is genetic information passed to a next generation?',
    ),
    lessonIds: ['L053', 'L054', 'L055', 'L056'],
    missionTitle: t(
      '两种植物与一种动物的生命路线',
      'Life routes of two plants and one animal',
    ),
    missionPrompt: t(
      '用课内豌豆、草莓匍匐茎与代表蝴蝶，写三条有顺序的路线。标出同一个体发育的箭头、产生下一代的连接，以及有无配子融合。至少用两种证据比较：豌豆胚珠/种子与草莓节上子株；蝴蝶幼虫/蛹/成虫。解释为什么成体资源不保证所有阶段都获支持、为什么形态差异不代表不同物种。补一句英文及一条模型局限；无需采集、培养或输入个人身体数据。',
      'Use lesson pea, strawberry-runner and representative-butterfly cases to write three ordered routes. Mark individual-development arrows, generation links and whether gamete fusion occurs. Compare evidence from pea ovules/seeds, runner-node daughter plants and butterfly larva/pupa/adult stages. Explain why adult resources do not establish support for every stage, and why stage differences need not mean different species. Add an English sentence and a model limit. No collecting, culturing or personal body data are needed.',
    ),
    claimLabel: t(
      '① 三条路线怎样连接发育与下一代？哪些经过配子融合？',
      '① How do the three routes connect development and a next generation? Which involve gamete fusion?',
    ),
  },
];
