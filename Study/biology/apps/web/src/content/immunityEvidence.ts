import type { Lesson } from '../schema';
/** Original bilingual pilot. All numerical datasets are fictional teaching records. */
export const immunityEvidenceLessons: Lesson[] = [
  {
    id: 'L113',
    title: {
      zh: '先天与适应性免疫',
      en: 'Innate and adaptive immunity',
    },
    hook: {
      zh: '屏障、吞噬细胞和抗体都能帮助防御，它们做的是同一份工作吗？',
      en: 'Barriers, phagocytes and antibodies help defence. Are they doing the same job?',
    },
    objectives: [
      {
        zh: '把屏障、模式识别和特异性克隆反应连接成协作路线。',
        en: 'Connect barriers, pattern recognition and specific clonal responses.',
      },
      {
        zh: '区分B细胞、辅助T细胞与细胞毒性T细胞的基本角色。',
        en: 'Distinguish the basic roles of B, helper T and cytotoxic T cells.',
      },
      {
        zh: '用分类计数支持有边界的机制解释。',
        en: 'Use classified counts to support a qualified mechanism explanation.',
      },
    ],
    prediction: [
      {
        zh: '先天完全不能识别任何特征',
        en: 'Innate defence cannot recognise any features',
      },
      {
        zh: '先天识别共有特征，适应性有特异克隆与记忆',
        en: 'Innate recognition detects shared features; adaptive responses involve specific clones and memory',
      },
      {
        zh: '抗体自己吞掉所有微生物',
        en: 'Antibodies themselves engulf every microbe',
      },
    ],
    terms: [
      {
        word: {
          zh: '先天免疫',
          en: 'innate immunity',
        },
        meaning: {
          zh: '屏障及快速识别共有特征的防御。',
          en: 'Barriers and rapid defences recognising shared features.',
        },
      },
      {
        word: {
          zh: '适应性免疫',
          en: 'adaptive immunity',
        },
        meaning: {
          zh: '涉及抗原特异性淋巴细胞克隆及记忆的防御。',
          en: 'Defence involving antigen-specific lymphocyte clones and memory.',
        },
      },
      {
        word: {
          zh: '抗原',
          en: 'antigen',
        },
        meaning: {
          zh: '能被适应性免疫受体识别的分子结构。',
          en: 'A molecular structure recognised by adaptive immune receptors.',
        },
      },
      {
        word: {
          zh: '吞噬作用',
          en: 'phagocytosis',
        },
        meaning: {
          zh: '细胞包围并摄入颗粒的过程。',
          en: 'Cellular engulfment of particles.',
        },
      },
      {
        word: {
          zh: '抗体',
          en: 'antibody',
        },
        meaning: {
          zh: '由浆细胞分泌、结合特定抗原的蛋白质。',
          en: 'A protein secreted by plasma cells that binds a particular antigen.',
        },
      },
      {
        word: {
          zh: '克隆',
          en: 'clone',
        },
        meaning: {
          zh: '从同一细胞增殖而来的细胞群。',
          en: 'Cells descended by division from one cell.',
        },
      },
      {
        word: {
          zh: 'T细胞',
          en: 'T cell',
        },
        meaning: {
          zh: '参与协调或杀伤感染细胞的淋巴细胞。',
          en: 'A lymphocyte involved in coordination or killing infected cells.',
        },
      },
    ],
    mission: {
      zh: '画两条协作箭头，用85/100和15/100描述本课记录，再写一句不能由计数推出的结论。',
      en: 'Draw two cooperating branches, describe the records using 85/100 and 15/100, then state one conclusion the counts cannot establish.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '先天识别与适应性识别怎样区分？',
          en: 'How do innate and adaptive recognition differ?',
        },
        options: [
          {
            zh: '先天识别共有特征；适应性涉及特异克隆',
            en: 'Innate receptors detect shared features; adaptive responses involve specific clones',
          },
          {
            zh: '先天没有受体',
            en: 'Innate cells have no receptors',
          },
          {
            zh: '所有细胞只认一种相同抗原',
            en: 'Every cell recognises one identical antigen',
          },
        ],
        correct: 0,
        feedback: {
          zh: '先天也有识别；克隆选择及抗原特异性记忆是这里的关键区别。',
          en: 'Innate defence recognises features too; clonal selection and antigen-specific memory are the key contrast here.',
        },
        revisit: {
          zh: '回看图中模式识别与B/T分支。',
          en: 'Revisit pattern recognition and the B/T branches.',
        },
        id: 'L113-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '抗体的基本作用是什么？',
          en: 'What is a basic antibody action?',
        },
        options: [
          {
            zh: '自己吞掉所有病原体',
            en: 'Engulf all pathogens itself',
          },
          {
            zh: '结合抗原并可帮助中和或标记目标',
            en: 'Bind an antigen and help neutralise or tag a target',
          },
          {
            zh: '代替全部T细胞工作',
            en: 'Replace all T-cell functions',
          },
        ],
        correct: 1,
        feedback: {
          zh: '抗体是蛋白质；吞噬细胞才完成摄入。T细胞还有协调和杀伤感染细胞的角色。',
          en: 'An antibody is a protein; a phagocyte engulfs. T cells also coordinate and kill infected cells.',
        },
        revisit: {
          zh: '回看图中Y形蛋白与细胞圆圈。',
          en: 'Compare the Y-shaped protein with the phagocyte circle.',
        },
        id: 'L113-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '60屏障、25吞噬、15克隆记录支持什么？',
          en: 'What do 60 barrier, 25 phagocytosis and 15 clone records support?',
        },
        options: [
          {
            zh: '先天贡献人体全部保护的85%',
            en: 'Innate immunity supplies 85% of all human protection',
          },
          {
            zh: '适应性没有价值',
            en: 'Adaptive immunity has no value',
          },
          {
            zh: '本样本85/100条归先天，不能当保护贡献率',
            en: '85/100 sampled events are innate; this is not a protection contribution rate',
          },
        ],
        correct: 2,
        feedback: {
          zh: '事件比例的分母是100条观察，不是所有感染结局；先给数据再限定适用范围。',
          en: 'The denominator is 100 observations, not all infection outcomes. Quote the data and limit the scope.',
        },
        revisit: {
          zh: '核对三张卡的计数和记录单位。',
          en: 'Check the card counts and observation unit.',
        },
        id: 'L113-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'phagocytosis指什么？',
          en: 'What does phagocytosis mean?',
        },
        options: [
          {
            zh: '细胞包围并摄入颗粒',
            en: 'A cell engulfs particles',
          },
          {
            zh: '抗体在血中扩增分裂',
            en: 'Antibodies divide in blood',
          },
          {
            zh: '病原体记住抗原',
            en: 'Pathogens remember antigens',
          },
        ],
        correct: 0,
        feedback: {
          zh: '词指细胞摄入过程，不是抗体增殖。',
          en: 'The term names cellular engulfment, not antibody division.',
        },
        revisit: {
          zh: '回看吞噬细胞的包围箭头。',
          en: 'Revisit the phagocyte engulfment arrow.',
        },
        id: 'L113-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '先天与适应性免疫',
      en: 'Innate and adaptive immunity',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://openstax.org/books/biology-2e/pages/42-1-innate-immune-response',
    },
  },
  {
    id: 'L114',
    title: {
      zh: '免疫记忆与疫苗原理',
      en: 'Immune memory and vaccines',
    },
    hook: {
      zh: '两次遇到相同抗原，为什么第二次曲线更早升高？这能保证不感染吗？',
      en: 'Why can a response to the same antigen rise earlier the second time? Does that guarantee no infection?',
    },
    objectives: [
      {
        zh: '把记忆细胞与第二次反应联系。',
        en: 'Link memory cells to a secondary response.',
      },
      {
        zh: '比较相同模型时点的曲线并正确标单位。',
        en: 'Compare curves at matched model times with units.',
      },
      {
        zh: '区分疫苗呈递抗原的方式与保护的局限。',
        en: 'Distinguish antigen delivery from the limits of protection.',
      },
    ],
    prediction: [
      {
        zh: '抗体一低，记忆一定消失',
        en: 'Low antibody levels mean memory has vanished',
      },
      {
        zh: '相同抗原再暴露可能更快激活记忆细胞',
        en: 'Re-exposure to the same antigen may activate memory cells faster',
      },
      {
        zh: '所有疫苗都含活病原体且保证不感染',
        en: 'Every vaccine contains live pathogens and guarantees no infection',
      },
    ],
    terms: [
      {
        word: {
          zh: '免疫记忆',
          en: 'immune memory',
        },
        meaning: {
          zh: '再次接触相关抗原时改变反应的能力。',
          en: 'Capacity for an altered response on re-exposure to a relevant antigen.',
        },
      },
      {
        word: {
          zh: '记忆细胞',
          en: 'memory cell',
        },
        meaning: {
          zh: '反应后保留、可再被激活的特异性细胞。',
          en: 'A persisting specific cell that can be reactivated.',
        },
      },
      {
        word: {
          zh: '初次反应',
          en: 'primary response',
        },
        meaning: {
          zh: '首次遇到某抗原引发的适应性反应。',
          en: 'Adaptive response to a first encounter with an antigen.',
        },
      },
      {
        word: {
          zh: '再次反应',
          en: 'secondary response',
        },
        meaning: {
          zh: '再次遇到相关抗原的适应性反应。',
          en: 'Adaptive response to a later encounter with a relevant antigen.',
        },
      },
      {
        word: {
          zh: '疫苗',
          en: 'vaccine',
        },
        meaning: {
          zh: '使免疫系统学习识别目标的制剂。',
          en: 'A preparation that helps immunity learn to recognise a target.',
        },
      },
      {
        word: {
          zh: '中和',
          en: 'neutralisation',
        },
        meaning: {
          zh: '阻止目标与宿主结构相互作用等作用。',
          en: 'An action such as preventing a target from interacting with host structures.',
        },
      },
    ],
    mission: {
      zh: '保留第1与第2点的两条指数，写一条有13任意单位的比较和一条图表不能回答的问题。',
      en: 'Keep both curves at points 1 and 2. Write a comparison including 13 arbitrary units and one question the graph cannot answer.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '哪项可解释再次反应更快？',
          en: 'What can explain a faster secondary response?',
        },
        options: [
          {
            zh: '抗体自己分裂',
            en: 'Antibodies divide',
          },
          {
            zh: '保留的相关记忆细胞更快参与反应',
            en: 'Persisting relevant memory cells respond faster',
          },
          {
            zh: '皮肤记住所有分子形状',
            en: 'Skin remembers every molecular shape',
          },
        ],
        correct: 1,
        feedback: {
          zh: '抗体是蛋白质，增殖的是细胞；记忆必须与目标相关。',
          en: 'Antibodies are proteins; cells proliferate. Memory must be relevant to the target.',
        },
        revisit: {
          zh: '回看曲线旁记忆细胞→效应的箭头。',
          en: 'Revisit the memory-cell-to-effector arrow.',
        },
        id: 'L114-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '哪项疫苗说明最准确？',
          en: 'Which vaccine statement is most accurate?',
        },
        options: [
          {
            zh: '都含活病原体',
            en: 'All contain live pathogens',
          },
          {
            zh: '有记忆就保证不感染',
            en: 'Memory guarantees no infection',
          },
          {
            zh: '不同类型呈递抗原或相关指令，保护有边界',
            en: 'Different types deliver antigens or instructions; protection has limits',
          },
        ],
        correct: 2,
        feedback: {
          zh: '疫苗类型不同；降低疾病风险不能自动等同完全阻断感染。',
          en: 'Vaccine types differ; reduced disease risk is not automatically complete infection prevention.',
        },
        revisit: {
          zh: '回看Explain疫苗类型和结局区别。',
          en: 'Revisit vaccine types and the outcome distinction.',
        },
        id: 'L114-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '第2点3与16，正确比较是？',
          en: 'At point 2 the indices are 3 and 16. Which comparison is valid?',
        },
        options: [
          {
            zh: '相差13任意指数单位，不能换算个人保护率',
            en: 'Difference: 13 arbitrary index units; not a personal protection rate',
          },
          {
            zh: '差13天',
            en: 'A difference of 13 days',
          },
          {
            zh: '保证提高13%保护',
            en: 'Guaranteed 13% more protection',
          },
        ],
        correct: 0,
        feedback: {
          zh: '读纵轴单位；模型时点不是临床时间，指数差不是风险差。',
          en: 'Read the y-axis unit: index differences are not time or risk differences.',
        },
        revisit: {
          zh: '核对共同轴和完整静态表第2行。',
          en: 'Check the shared axes and static table at point 2.',
        },
        id: 'L114-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'secondary response表示什么？',
          en: 'What does secondary response mean?',
        },
        options: [
          {
            zh: '第二种先天屏障',
            en: 'A second innate barrier',
          },
          {
            zh: '对再次相关抗原接触的适应性反应',
            en: 'Adaptive response to a later relevant antigen encounter',
          },
          {
            zh: '只有第二种疫苗才产生抗体',
            en: 'Antibodies occur only with a second vaccine type',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'secondary指再次接触相关抗原，不是第二种病原体。',
          en: 'Secondary refers to a later relevant encounter, not the second type of pathogen.',
        },
        revisit: {
          zh: '对照primary与secondary曲线标签。',
          en: 'Compare the primary and secondary curve labels.',
        },
        id: 'L114-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '免疫记忆与疫苗原理',
      en: 'Immune memory and vaccines',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://www.cdc.gov/vaccines/basics/explaining-how-vaccines-work.html',
    },
  },
  {
    id: 'L115',
    title: {
      zh: '抗生素耐药性',
      en: 'Antibiotic resistance',
    },
    hook: {
      zh: '20个细菌中原有2个耐药，选择后为什么耐药比例升高，却不一定有更多耐药菌？',
      en: 'Two of 20 bacteria are initially resistant. Why can their proportion rise without an initial increase in their number?',
    },
    objectives: [
      {
        zh: '区分已有变异、差异存活与繁殖。',
        en: 'Distinguish existing variation, differential survival and reproduction.',
      },
      {
        zh: '分别计算耐药数量与比例。',
        en: 'Calculate resistant counts and fractions separately.',
      },
      {
        zh: '区别突变与水平基因转移，避免目的性解释。',
        en: 'Distinguish mutation and horizontal gene transfer without purposeful explanations.',
      },
    ],
    prediction: [
      {
        zh: '每个细菌因需要而学会耐药',
        en: 'Every bacterium learns resistance because it needs it',
      },
      {
        zh: '选择可使已有耐药菌在存活者中占比升高',
        en: 'Selection can raise the fraction of existing resistant bacteria among survivors',
      },
      {
        zh: '变耐药的是人的身体',
        en: 'The person becomes antibiotic-resistant',
      },
    ],
    terms: [
      {
        word: {
          zh: '抗生素',
          en: 'antibiotic',
        },
        meaning: {
          zh: '杀死细菌或限制其生长的物质。',
          en: 'A substance that kills bacteria or restricts their growth.',
        },
      },
      {
        word: {
          zh: '耐药性',
          en: 'resistance',
        },
        meaning: {
          zh: '微生物在相应药物作用下仍能存活繁殖的能力。',
          en: 'Microbial ability to survive and multiply despite a relevant drug.',
        },
      },
      {
        word: {
          zh: '选择压力',
          en: 'selection pressure',
        },
        meaning: {
          zh: '使不同性状具有不同存活或繁殖结果的条件。',
          en: 'A condition causing different survival or reproduction among traits.',
        },
      },
      {
        word: {
          zh: '突变',
          en: 'mutation',
        },
        meaning: {
          zh: 'DNA序列发生改变。',
          en: 'A change in DNA sequence.',
        },
      },
      {
        word: {
          zh: '水平基因转移',
          en: 'horizontal gene transfer',
        },
        meaning: {
          zh: '不是亲子繁殖而在细胞间传递遗传物质。',
          en: 'Genetic transfer between cells outside parent-offspring reproduction.',
        },
      },
      {
        word: {
          zh: '频率',
          en: 'frequency',
        },
        meaning: {
          zh: '某类在明确总体中的比例。',
          en: 'A fraction of a type in a defined total.',
        },
      },
      {
        word: {
          zh: '后代',
          en: 'offspring',
        },
        meaning: {
          zh: '由繁殖产生的新个体或细胞。',
          en: 'New individuals or cells produced by reproduction.',
        },
      },
    ],
    mission: {
      zh: '用三栏记录2、2、8个耐药菌，分别标清总数20、2、8，写出选择与繁殖各改变什么。',
      en: 'Record resistant counts 2, 2 and 8 with totals 20, 2 and 8. Explain separately what selection and reproduction change.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '耐药性首先是谁的性状？',
          en: 'Whose trait is antibiotic resistance?',
        },
        options: [
          {
            zh: '人的肌肉',
            en: 'Human muscle',
          },
          {
            zh: '药物的记忆',
            en: 'A medicine’s memory',
          },
          {
            zh: '细菌等相关微生物',
            en: 'Relevant microbes such as bacteria',
          },
        ],
        correct: 2,
        feedback: {
          zh: '耐药是微生物在药物作用下存活繁殖的能力，不是人变耐药。',
          en: 'Resistance concerns microbial survival and reproduction, not a person becoming resistant.',
        },
        revisit: {
          zh: '回看S/R细胞标记。',
          en: 'Revisit the S/R cell labels.',
        },
        id: 'L115-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '初始无R且模型不含变异，选择后会怎样？',
          en: 'With no initial R and no variation-generating process, what follows pressure?',
        },
        options: [
          {
            zh: '自动产生R',
            en: 'R appears automatically',
          },
          {
            zh: '没有存活者；比例未定义',
            en: 'No survivors; fraction undefined',
          },
          {
            zh: '每个S都变成R',
            en: 'Every S becomes R',
          },
        ],
        correct: 1,
        feedback: {
          zh: '选择不能创造本模型中不存在的变异；零分母不能计算比例。',
          en: 'Selection cannot create absent variation in this model; a zero denominator gives no fraction.',
        },
        revisit: {
          zh: '把初始耐药设0，检查存活栏。',
          en: 'Set initial resistance to 0 and inspect survivors.',
        },
        id: 'L115-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '18S+2R变为0S+2R支持什么？',
          en: 'What follows from 18S+2R becoming 0S+2R?',
        },
        options: [
          {
            zh: '耐药比例10%到100%，耐药数仍为2',
            en: 'Resistant fraction rises 10% to 100%; resistant count stays 2',
          },
          {
            zh: 'R增加了90个',
            en: 'R rises by 90 cells',
          },
          {
            zh: '药物创造了18个突变',
            en: 'The drug creates 18 mutations',
          },
        ],
        correct: 0,
        feedback: {
          zh: '分母从20变2；数量与频率是不同问题。后代步骤才让R变8。',
          en: 'The denominator falls from 20 to 2. Count and frequency differ; only the descendant step changes R to 8.',
        },
        revisit: {
          zh: '比较表的起点和存活两行。',
          en: 'Compare start and survivor rows.',
        },
        id: 'L115-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'horizontal gene transfer强调什么？',
          en: 'What does horizontal gene transfer emphasise?',
        },
        options: [
          {
            zh: '从亲代分裂得到后代',
            en: 'Parent-to-descendant division',
          },
          {
            zh: '药物主动选择突变位置',
            en: 'A drug choosing mutation sites',
          },
          {
            zh: '非亲子途径的细胞间遗传物质传递',
            en: 'Genetic transfer between cells outside parent-offspring routes',
          },
        ],
        correct: 2,
        feedback: {
          zh: '水平转移区别于垂直遗传，也区别于DNA中新发生的突变。',
          en: 'Horizontal transfer differs from vertical inheritance and from new sequence mutation.',
        },
        revisit: {
          zh: '回看Depth的性状来源。',
          en: 'Revisit trait origins in Depth.',
        },
        id: 'L115-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '抗生素耐药性',
      en: 'Antibiotic resistance',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://www.cdc.gov/antimicrobial-resistance/about/index.html',
    },
  },
  {
    id: 'L116',
    title: {
      zh: '如何阅读健康证据？',
      en: 'Evaluating health claims',
    },
    hook: {
      zh: '虚构宣传“青禾饮品让事件风险减半”，10对20个事件就够了吗？',
      en: 'A fictional “Qinghe drink” advert says event risk is halved. Are 10 versus 20 events enough?',
    },
    objectives: [
      {
        zh: '用分子分母区分绝对与相对风险差。',
        en: 'Use numerators and denominators to distinguish absolute and relative differences.',
      },
      {
        zh: '检查随机分配、对照、盲法与失访。',
        en: 'Inspect random allocation, controls, blinding and loss to follow-up.',
      },
      {
        zh: '用研究设计限定相关与因果结论。',
        en: 'Limit association and causal claims using study design.',
      },
    ],
    prediction: [
      {
        zh: '事件少就足以证明产品有效',
        en: 'Fewer events prove that a product works',
      },
      {
        zh: '必须先核对分母、分组和未完成随访者',
        en: 'Check denominators, allocation and missing follow-up first',
      },
      {
        zh: '观察性证据永远没用',
        en: 'Observational evidence is always useless',
      },
    ],
    terms: [
      {
        word: {
          zh: '风险',
          en: 'risk',
        },
        meaning: {
          zh: '指定期间指定结局的发生比例。',
          en: 'The proportion with a specified outcome over a specified period.',
        },
      },
      {
        word: {
          zh: '绝对风险差',
          en: 'absolute risk difference',
        },
        meaning: {
          zh: '两组风险直接相减。',
          en: 'Direct subtraction of two risks.',
        },
      },
      {
        word: {
          zh: '相对降低',
          en: 'relative reduction',
        },
        meaning: {
          zh: '风险差除以明确参考组风险。',
          en: 'Risk difference divided by a stated reference risk.',
        },
      },
      {
        word: {
          zh: '随机分配',
          en: 'random allocation',
        },
        meaning: {
          zh: '用机会机制分配处理以减少组间系统差异。',
          en: 'Assigning treatments by chance to reduce systematic group differences.',
        },
      },
      {
        word: {
          zh: '混杂因素',
          en: 'confounder',
        },
        meaning: {
          zh: '同时关联分组和结局、可提供替代解释的因素。',
          en: 'A factor associated with exposure and outcome that offers another explanation.',
        },
      },
      {
        word: {
          zh: '盲法',
          en: 'blinding',
        },
        meaning: {
          zh: '在可行时不让相关人员知道分组。',
          en: 'Keeping allocation unknown to relevant people when feasible.',
        },
      },
      {
        word: {
          zh: '失访',
          en: 'loss to follow-up',
        },
        meaning: {
          zh: '分组后未获得预定结局记录。',
          en: 'Missing planned outcome records after allocation.',
        },
      },
    ],
    mission: {
      zh: '改写“风险减半”：保留5%、10%、5个百分点和50%，加分组、失访和结局定义的三项审查。',
      en: 'Rewrite “risk halved” using 5%, 10%, 5 percentage points and 50%; add checks for allocation, missing outcomes and outcome definition.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '10/200对20/200，哪项表达正确？',
          en: 'For 10/200 versus 20/200, which statement is correct?',
        },
        options: [
          {
            zh: '绝对降低50个百分点',
            en: 'Absolute reduction is 50 percentage points',
          },
          {
            zh: '绝对降低5个百分点，相对B降低50%',
            en: 'Absolute reduction is 5 percentage points; relative to B it is 50%',
          },
          {
            zh: 'A风险10%',
            en: 'A risk is 10%',
          },
        ],
        correct: 1,
        feedback: {
          zh: '5%与10%相差5个百分点；除以B的10%才得到50%。',
          en: '5% and 10% differ by 5 percentage points; dividing by B’s 10% gives 50%.',
        },
        revisit: {
          zh: '回看两组分母和风险栏。',
          en: 'Revisit denominators and risks.',
        },
        id: 'L116-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '自选分组的观察图为什么仍可有价值？',
          en: 'Why can a self-selected observational graph still be useful?',
        },
        options: [
          {
            zh: '能显示关联和产生假设，但替代解释未排除',
            en: 'It can reveal associations and hypotheses while alternatives remain',
          },
          {
            zh: '它一定证明因果',
            en: 'It necessarily proves causation',
          },
          {
            zh: '它不可能提供任何证据',
            en: 'It cannot provide evidence',
          },
        ],
        correct: 0,
        feedback: {
          zh: '证据价值不是全有全无；结论强度须匹配混杂等局限。',
          en: 'Evidence is not all-or-nothing; claim strength must match confounding and other limits.',
        },
        revisit: {
          zh: '回看睡眠混杂例。',
          en: 'Revisit the sleep confounder.',
        },
        id: 'L116-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: 'A原200人，10事件且30失访；哪项最稳妥？',
          en: 'A originally has 200 people, 10 events and 30 missing outcomes. What is justified?',
        },
        options: [
          {
            zh: '30人都无事件',
            en: 'All 30 had no events',
          },
          {
            zh: '随机分组保证结果不变',
            en: 'Random allocation guarantees no effect on results',
          },
          {
            zh: '全体风险极端可为5%至20%，要查失访',
            en: 'Extreme full-group bounds are 5%–20%; investigate missingness',
          },
        ],
        correct: 2,
        feedback: {
          zh: '未观察不等于零；若失访者全有事件则40/200=20%。这是边界，不是置信区间。',
          en: 'Unobserved is not zero. If all missing participants had events, 40/200=20%. This is a bound, not a confidence interval.',
        },
        revisit: {
          zh: '回看失访提示和完整/缺失切换。',
          en: 'Revisit the missing-outcome switch.',
        },
        id: 'L116-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'confounder最接近哪项？',
          en: 'Which best describes a confounder?',
        },
        options: [
          {
            zh: '任何拼写错误',
            en: 'Any spelling error',
          },
          {
            zh: '关联分组与结局、提供替代解释的因素',
            en: 'A factor linked to group and outcome that offers an alternative explanation',
          },
          {
            zh: '两组的样本量',
            en: 'The sample size alone',
          },
        ],
        correct: 1,
        feedback: {
          zh: '睡眠可能同时影响饮品选择和结局；它不是单纯的随机波动。',
          en: 'Sleep may affect both drink choice and outcomes; it is not merely random fluctuation.',
        },
        revisit: {
          zh: '回看饮品←睡眠→结局的分叉。',
          en: 'Revisit drink ← sleep → outcome.',
        },
        id: 'L116-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '如何阅读健康证据？',
      en: 'Evaluating health claims',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://www.nhlbi.nih.gov/research/clinical-trials/how-studies-work',
    },
  },
  {
    id: 'L117',
    title: {
      zh: '提出可检验的假设',
      en: 'Testable hypotheses',
    },
    hook: {
      zh: '“光让豆苗更健康”如何改成别人能重复检验的句子？',
      en: 'How can “light makes seedlings healthier” become a statement others can test?',
    },
    objectives: [
      {
        zh: '将含糊用语改成可测量的变量、时间与单位。',
        en: 'Replace vague words with measurable variables, time and units.',
      },
      {
        zh: '区分问题、解释性假设和可观察预测。',
        en: 'Distinguish a question, explanatory hypothesis and observable prediction.',
      },
      {
        zh: '设计一个可能反驳原假设的结果。',
        en: 'Describe a result that could challenge the hypothesis.',
      },
    ],
    prediction: [
      {
        zh: '健康由研究者感觉即可',
        en: 'The researcher’s impression defines health',
      },
      {
        zh: '先写指标、处理与固定条件再预测',
        en: 'Specify measures, treatment and fixed conditions before predicting',
      },
      {
        zh: '只有一定正确的句子才叫假设',
        en: 'A hypothesis must be certainly correct',
      },
    ],
    terms: [
      {
        word: {
          zh: '假设',
          en: 'hypothesis',
        },
        meaning: {
          zh: '可用证据检验的暂定解释。',
          en: 'A tentative explanation testable with evidence.',
        },
      },
      {
        word: {
          zh: '预测',
          en: 'prediction',
        },
        meaning: {
          zh: '在指定条件下预期观察到的结果。',
          en: 'An expected observation under specified conditions.',
        },
      },
      {
        word: {
          zh: '操作性定义',
          en: 'operational definition',
        },
        meaning: {
          zh: '说明怎样施加条件或测量变量。',
          en: 'A description of how a condition is applied or a variable measured.',
        },
      },
      {
        word: {
          zh: '自变量',
          en: 'independent variable',
        },
        meaning: {
          zh: '研究者安排改变的条件。',
          en: 'The condition deliberately varied.',
        },
      },
      {
        word: {
          zh: '因变量',
          en: 'dependent variable',
        },
        meaning: {
          zh: '随处理测量的响应。',
          en: 'The measured response.',
        },
      },
      {
        word: {
          zh: '可反驳',
          en: 'falsifiable',
        },
        meaning: {
          zh: '可能有证据与该解释不符。',
          en: 'Capable of conflicting with possible evidence.',
        },
      },
    ],
    mission: {
      zh: '重写一个模糊句，包含比较值、7天、cm、固定条件及可能反驳结果，再口述一个替代解释。',
      en: 'Rewrite a vague claim with comparison values, seven days, cm, matched conditions and a challenging result; state one alternative explanation.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '哪句最可直接检验？',
          en: 'Which statement is most directly testable?',
        },
        options: [
          {
            zh: '豆苗更快乐',
            en: 'Seedlings are happier',
          },
          {
            zh: '光是最好的',
            en: 'Light is best',
          },
          {
            zh: '同水温下比较4/8 h光照的7天株高增量cm',
            en: 'Compare seven-day height changes in cm at 4/8 h light with matched water and temperature',
          },
        ],
        correct: 2,
        feedback: {
          zh: '量值、时间、响应和固定条件使别人能重复；快乐和最好未定义。',
          en: 'Values, timing, response and controls enable replication; happier and best are undefined.',
        },
        revisit: {
          zh: '回看假设修复卡的三个空位。',
          en: 'Revisit the three hypothesis-repair fields.',
        },
        id: 'L117-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '哪项是预测而非机制解释？',
          en: 'Which is a prediction rather than a mechanism explanation?',
        },
        options: [
          {
            zh: '8 h组平均增量将高于4 h组',
            en: 'The 8 h group will have a higher mean increase than the 4 h group',
          },
          {
            zh: '光可为光合作用提供能量',
            en: 'Light can supply photosynthetic energy',
          },
          {
            zh: '叶片含叶绿体',
            en: 'Leaves contain chloroplasts',
          },
        ],
        correct: 0,
        feedback: {
          zh: '预测描述指定条件下预期读数；机制说明为什么可能这样。',
          en: 'A prediction states expected readings under specified conditions; a mechanism explains why.',
        },
        revisit: {
          zh: '对照Explain的假设和预测句。',
          en: 'Compare the hypothesis and prediction sentences.',
        },
        id: 'L117-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '12 cm对9 cm，但两组水量也不同，怎样修复？',
          en: 'Means are 12 versus 9 cm, but water differs too. How should the study be repaired?',
        },
        options: [
          {
            zh: '删除较矮株',
            en: 'Remove shorter seedlings',
          },
          {
            zh: '固定水量再比较光照，不能单归因于光',
            en: 'Match water and compare light again; the current result cannot isolate light',
          },
          {
            zh: '差3 cm就足够证明',
            en: 'A 3 cm difference proves it',
          },
        ],
        correct: 1,
        feedback: {
          zh: '水是同时改变的替代原因；增加测量精度不能解除这个混杂。',
          en: 'Water is an alternative cause varied with light; precision alone cannot remove this confounding.',
        },
        revisit: {
          zh: '回看固定条件开关。',
          en: 'Revisit the matched-conditions switch.',
        },
        id: 'L117-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'operational definition是什么？',
          en: 'What is an operational definition?',
        },
        options: [
          {
            zh: '写出肯定正确的结论',
            en: 'A certainly correct conclusion',
          },
          {
            zh: '给研究取漂亮名字',
            en: 'An attractive study name',
          },
          {
            zh: '说明实际怎样施加或测量变量',
            en: 'A description of how a variable is applied or measured',
          },
        ],
        correct: 2,
        feedback: {
          zh: '它让模糊词落到动作、时间、单位和仪器上。',
          en: 'It turns vague words into actions, timing, units and measurement methods.',
        },
        revisit: {
          zh: '回看4/8 h、7 d、cm标签。',
          en: 'Revisit the 4/8 h, 7 d and cm labels.',
        },
        id: 'L117-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '提出可检验的假设',
      en: 'Testable hypotheses',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://openstax.org/books/biology-2e/pages/1-1-the-science-of-biology',
    },
  },
  {
    id: 'L118',
    title: {
      zh: '变量、对照与重复',
      en: 'Variables, controls and replicates',
    },
    hook: {
      zh: '一株豆苗量12次，能代替12株各量一次吗？窗边都放8小时组公平吗？',
      en: 'Can twelve readings of one seedling replace twelve seedlings? Is it fair to place every eight-hour seedling by the window?',
    },
    objectives: [
      {
        zh: '修复光照与水量、位置同时变化的混杂。',
        en: 'Repair confounding between illumination, water and position.',
      },
      {
        zh: '区分独立生物重复与同一样本的重复读数。',
        en: 'Distinguish independent biological replicates from repeated readings.',
      },
      {
        zh: '使用分块及块内随机分配提高可比性。',
        en: 'Use blocks and within-block random allocation to improve comparability.',
      },
    ],
    prediction: [
      {
        zh: '量同一株越多次，生物样本就越大',
        en: 'More readings of one seedling increase biological sample size',
      },
      {
        zh: '要有独立植株，并在每个位置块内分配处理',
        en: 'Use independent seedlings and assign treatments within each position block',
      },
      {
        zh: '只给处理组更多水也算公平',
        en: 'Giving only the treatment group more water is fair',
      },
    ],
    terms: [
      {
        word: {
          zh: '对照',
          en: 'control',
        },
        meaning: {
          zh: '用于比较的参考条件或处理。',
          en: 'A reference condition or treatment for comparison.',
        },
      },
      {
        word: {
          zh: '控制变量',
          en: 'controlled variable',
        },
        meaning: {
          zh: '保持相同或按设计平衡的条件。',
          en: 'A condition held equal or balanced by design.',
        },
      },
      {
        word: {
          zh: '生物重复',
          en: 'biological replicate',
        },
        meaning: {
          zh: '独立生物单位的重复观察。',
          en: 'An observation from an independent biological unit.',
        },
      },
      {
        word: {
          zh: '重复读数',
          en: 'repeated reading',
        },
        meaning: {
          zh: '对同一样本多次测量。',
          en: 'Multiple measurements of the same sample.',
        },
      },
      {
        word: {
          zh: '伪重复',
          en: 'pseudoreplication',
        },
        meaning: {
          zh: '把非独立读数当成独立样本。',
          en: 'Treating non-independent readings as independent samples.',
        },
      },
      {
        word: {
          zh: '分块',
          en: 'blocking',
        },
        meaning: {
          zh: '按已知干扰因素分组，块内包含各处理。',
          en: 'Grouping by a known nuisance factor with treatments within blocks.',
        },
      },
      {
        word: {
          zh: '随机化',
          en: 'randomisation',
        },
        meaning: {
          zh: '用机会机制决定安排。',
          en: 'Using chance to determine allocation.',
        },
      },
    ],
    mission: {
      zh: '画一个2位置×2光照设计，写水量固定为同值；列12条读数对应的4个植株ID，解释为什么n生物=4。',
      en: 'Draw a two-position × two-duration design with matched water. Link twelve readings to four plant IDs and explain why biological n=4.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '同一株量12次，独立生物样本数是多少？',
          en: 'What is biological n for twelve readings of one seedling?',
        },
        options: [
          {
            zh: '12',
            en: '12',
          },
          {
            zh: '1',
            en: '1',
          },
          {
            zh: '测得准就是无限',
            en: 'Infinite if precise',
          },
        ],
        correct: 1,
        feedback: {
          zh: '读数和生物单位不同。多次测同株可改善读数，却未增加植株差异信息。',
          en: 'Readings differ from biological units. Re-measuring improves readings but adds no between-plant variation.',
        },
        revisit: {
          zh: '回看样本ID连线。',
          en: 'Revisit sample-ID links.',
        },
        id: 'L118-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '分块的正确安排是什么？',
          en: 'Which is a correct blocked design?',
        },
        options: [
          {
            zh: '每个位置块都有两种处理，并块内随机分配',
            en: 'Both treatments in each position block, allocated randomly within it',
          },
          {
            zh: '近窗全8小时、远窗全4小时',
            en: 'Only 8 h near and 4 h far',
          },
          {
            zh: '只把同一株换名字',
            en: 'Rename the same plant',
          },
        ],
        correct: 0,
        feedback: {
          zh: '块内比较让位置不再与处理完全重合；换名字不会造出独立样本。',
          en: 'Within-block comparison separates position from treatment; renaming creates no independent units.',
        },
        revisit: {
          zh: '回看近/远窗两个块。',
          en: 'Revisit near/far blocks.',
        },
        id: 'L118-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '近窗10/13 cm，远窗8/11 cm，合理比较是？',
          en: 'Near-window values are 10/13 cm and far-window 8/11 cm. Which comparison is appropriate?',
        },
        options: [
          {
            zh: '只比13−8=5 cm证明光效应',
            en: 'Use only 13−8=5 cm as the light effect',
          },
          {
            zh: '平均所有数后不分处理',
            en: 'Average everything without treatment labels',
          },
          {
            zh: '各块8 h减4 h都是3 cm，仍需重复',
            en: 'Within each block 8 h minus 4 h is 3 cm; replication remains needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '13与8跨位置，混入位置差；两个3 cm来自共同位置的比较。',
          en: '13 versus 8 mixes positions; both 3 cm differences compare treatments under shared positions.',
        },
        revisit: {
          zh: '核对分块图的每一行。',
          en: 'Check each row of the blocked diagram.',
        },
        id: 'L118-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'pseudoreplication是什么？',
          en: 'What is pseudoreplication?',
        },
        options: [
          {
            zh: '重复实验的正常英文',
            en: 'A synonym for a repeated experiment',
          },
          {
            zh: '把非独立读数当独立样本',
            en: 'Treating non-independent readings as independent samples',
          },
          {
            zh: '随机安排处理',
            en: 'Random treatment allocation',
          },
        ],
        correct: 1,
        feedback: {
          zh: '关键不是读数多，而是把它们错误当成独立证据。',
          en: 'The problem is not many readings but incorrectly treating them as independent evidence.',
        },
        revisit: {
          zh: '回看同株12读数案例。',
          en: 'Revisit twelve readings of one plant.',
        },
        id: 'L118-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '变量、对照与重复',
      en: 'Variables, controls and replicates',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://openstax.org/books/biology-2e/pages/1-1-the-science-of-biology',
    },
  },
  {
    id: 'L119',
    title: {
      zh: '误差、图表与解释',
      en: 'Uncertainty and graphs',
    },
    hook: {
      zh: '两组平均值不同，是否每株都不同？一个28 cm读数不顺眼就能删吗？',
      en: 'If means differ, must every plant differ? Can an inconvenient 28 cm reading simply be deleted?',
    },
    objectives: [
      {
        zh: '从原始数据计算均值、最小最大与范围。',
        en: 'Calculate mean, minimum, maximum and range from raw data.',
      },
      {
        zh: '补齐图轴单位，区分范围、测量误差和置信区间。',
        en: 'Repair axis units and distinguish range, measurement error and confidence intervals.',
      },
      {
        zh: '追查异常值并透明比较保留与更正的结果。',
        en: 'Investigate an unusual value and compare retained versus documented-corrected results.',
      },
    ],
    prediction: [
      {
        zh: '只要均值不同就无须看原始数据',
        en: 'Different means make raw data unnecessary',
      },
      {
        zh: '范围是样本散布，不能自动当置信区间',
        en: 'Range describes sample spread, not automatically a confidence interval',
      },
      {
        zh: '异常值都删掉最科学',
        en: 'Deleting every unusual value is best',
      },
    ],
    terms: [
      {
        word: {
          zh: '均值',
          en: 'mean',
        },
        meaning: {
          zh: '数据总和除以个数。',
          en: 'The sum divided by the number of values.',
        },
      },
      {
        word: {
          zh: '范围',
          en: 'range',
        },
        meaning: {
          zh: '最大值减最小值。',
          en: 'The maximum minus the minimum.',
        },
      },
      {
        word: {
          zh: '随机误差',
          en: 'random error',
        },
        meaning: {
          zh: '重复测量中方向不固定的波动。',
          en: 'Measurement variation without a fixed direction.',
        },
      },
      {
        word: {
          zh: '系统误差',
          en: 'systematic error',
        },
        meaning: {
          zh: '使结果持续偏向同一方向的偏差。',
          en: 'A consistent directional measurement bias.',
        },
      },
      {
        word: {
          zh: '异常值',
          en: 'outlier',
        },
        meaning: {
          zh: '与其余观察明显不同、需要追查的数据。',
          en: 'An unusually different observation requiring investigation.',
        },
      },
      {
        word: {
          zh: '置信区间',
          en: 'confidence interval',
        },
        meaning: {
          zh: '基于抽样方法与统计假设对参数不确定性的区间。',
          en: 'An interval for parameter uncertainty based on sampling methods and statistical assumptions.',
        },
      },
      {
        word: {
          zh: '单位',
          en: 'unit',
        },
        meaning: {
          zh: '说明数值测量尺度的标准。',
          en: 'A standard specifying a measurement scale.',
        },
      },
    ],
    mission: {
      zh: '画有cm单位的点图，写出两组mean与min–max；再解释28 cm为何改变方向和还需查什么记录。',
      en: 'Draw a dot plot with cm units and both means/min–max intervals; explain how 28 cm reverses the direction and which record needs checking.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '8、9、10、9 cm的范围是多少？',
          en: 'What is the range of 8, 9, 10, 9 cm?',
        },
        options: [
          {
            zh: '2 cm',
            en: '2 cm',
          },
          {
            zh: '9 cm',
            en: '9 cm',
          },
          {
            zh: '8–10是95% CI',
            en: '8–10 is a 95% CI',
          },
        ],
        correct: 0,
        feedback: {
          zh: '范围10−8=2 cm；9 cm是均值；没有统计方法不能把端点叫CI。',
          en: 'Range is 10−8=2 cm; 9 cm is the mean. No CI follows without a statistical method.',
        },
        revisit: {
          zh: '回看散点图的8与10端点。',
          en: 'Revisit endpoints 8 and 10.',
        },
        id: 'L119-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '对可疑28 cm读数首先怎样处理？',
          en: 'What should happen first to a suspicious 28 cm reading?',
        },
        options: [
          {
            zh: '不合预测就删',
            en: 'Delete it if it disagrees with the prediction',
          },
          {
            zh: '查原始记录、单位与方法，再透明报告',
            en: 'Check original records, units and method, then report transparently',
          },
          {
            zh: '改成均值而不说明',
            en: 'Replace it with the mean silently',
          },
        ],
        correct: 1,
        feedback: {
          zh: '真实生物变异也可能异常；只在证实错误后有理由更正。',
          en: 'Real variation can be unusual; documented error provides a reason for correction.',
        },
        revisit: {
          zh: '回看待查值开关及均值变化。',
          en: 'Revisit the unverified-value switch and mean changes.',
        },
        id: 'L119-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '8、9、28、9 cm均值13.5，对照组12 cm，应如何写？',
          en: 'Averages are 13.5 cm for 8,9,28,9 and 12 cm for the other group. What should be written?',
        },
        options: [
          {
            zh: '删除28后一定证实原假设',
            en: 'Deleting 28 proves the hypothesis',
          },
          {
            zh: '范围大说明尺子一定坏',
            en: 'A wide range proves the ruler is broken',
          },
          {
            zh: '未核实值改变比较方向，报告敏感性并追查',
            en: 'The unverified value reverses the comparison; report sensitivity and investigate',
          },
        ],
        correct: 2,
        feedback: {
          zh: '13.5大于12，而原9小于12；这种敏感性需透明说明，不能自动归因或删点。',
          en: '13.5 exceeds 12 while the original 9 is below 12; report this sensitivity without automatic attribution or deletion.',
        },
        revisit: {
          zh: '比较原始与28 cm状态的数据表。',
          en: 'Compare original and 28 cm tables.',
        },
        id: 'L119-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'systematic error是哪一种？',
          en: 'Which is systematic error?',
        },
        options: [
          {
            zh: '同株读数时高时低',
            en: 'Readings randomly high and low',
          },
          {
            zh: '尺子零点使读数持续偏高',
            en: 'A ruler-zero offset consistently raises readings',
          },
          {
            zh: '样本范围为2 cm',
            en: 'A sample range of 2 cm',
          },
        ],
        correct: 1,
        feedback: {
          zh: '同方向偏移是系统误差；重复不能简单消除它。',
          en: 'A consistent directional offset is systematic; repetition alone does not remove it.',
        },
        revisit: {
          zh: '回看随机与系统误差对比。',
          en: 'Revisit random versus systematic errors.',
        },
        id: 'L119-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '误差、图表与解释',
      en: 'Uncertainty and graphs',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm',
    },
  },
  {
    id: 'L120',
    title: {
      zh: '科学结论与局限',
      en: 'Claims, evidence and limitations',
    },
    hook: {
      zh: '“8小时光照让所有植物长高三分之一”这句话哪里超出了9与12 cm的数据？',
      en: 'How does “eight hours of light makes all plants grow one-third taller” exceed the 9 and 12 cm data?',
    },
    objectives: [
      {
        zh: '写出主张、含单位数据、机制和限定语。',
        en: 'Write a claim, data with units, mechanism and qualification.',
      },
      {
        zh: '让结论强度匹配设计，不把支持写成证明。',
        en: 'Match claim strength to design without equating support with proof.',
      },
      {
        zh: '把具体局限连接到下一项可行检验。',
        en: 'Connect each specific limitation to a feasible next test.',
      },
    ],
    prediction: [
      {
        zh: '一次差异能推广到所有植物',
        en: 'One difference generalises to all plants',
      },
      {
        zh: '结论应写对象、条件、数据与尚缺证据',
        en: 'A conclusion needs organisms, conditions, data and missing evidence',
      },
      {
        zh: '写有局限表示实验没价值',
        en: 'Stating limitations makes a study worthless',
      },
    ],
    terms: [
      {
        word: {
          zh: '主张',
          en: 'claim',
        },
        meaning: {
          zh: '证据试图支持的回答。',
          en: 'The answer evidence is used to support.',
        },
      },
      {
        word: {
          zh: '证据',
          en: 'evidence',
        },
        meaning: {
          zh: '与问题相关的观察或数据。',
          en: 'Observations or data relevant to a question.',
        },
      },
      {
        word: {
          zh: '推理',
          en: 'reasoning',
        },
        meaning: {
          zh: '把证据与主张连接的逻辑和机制。',
          en: 'Logic and mechanism linking evidence to a claim.',
        },
      },
      {
        word: {
          zh: '局限',
          en: 'limitation',
        },
        meaning: {
          zh: '限制结论强度或适用范围的条件。',
          en: 'A condition restricting claim strength or scope.',
        },
      },
      {
        word: {
          zh: '因果',
          en: 'causation',
        },
        meaning: {
          zh: '改变一个因素导致响应改变的关系。',
          en: 'A relationship in which changing a factor changes a response.',
        },
      },
      {
        word: {
          zh: '推广',
          en: 'generalisation',
        },
        meaning: {
          zh: '把样本结论扩展到其他对象或条件。',
          en: 'Extending a conclusion to other organisms or conditions.',
        },
      },
      {
        word: {
          zh: '重复研究',
          en: 'replication',
        },
        meaning: {
          zh: '用新独立材料检验结果能否再出现。',
          en: 'Testing whether findings recur with new independent material.',
        },
      },
    ],
    mission: {
      zh: '用修复豆苗数据写四句CER+局限，再为局限写一项新独立重复研究；英文可用句框，生物解释可用中文。',
      en: 'Write four CER-plus-limitation sentences for the repaired seedlings and one new independent replication. English sentence frames are optional; explain biology in Chinese if needed.',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '结论中的机制句应怎样限定？',
          en: 'How should a mechanism sentence be qualified?',
        },
        options: [
          {
            zh: '株高图证明了糖的全部变化',
            en: 'The height graph proves every sugar change',
          },
          {
            zh: '光合作用机会增加是可行解释，但糖未直接测',
            en: 'Greater photosynthetic opportunity is plausible, but sugar was not measured',
          },
          {
            zh: '机制完全不需要知识',
            en: 'Mechanisms require no biological knowledge',
          },
        ],
        correct: 1,
        feedback: {
          zh: '数据测株高，不测糖；机制连接证据，但不能伪装成直接观察。',
          en: 'Height, not sugar, was measured. A mechanism connects evidence without pretending to be a direct observation.',
        },
        revisit: {
          zh: '回看机制框与测量框的区别。',
          en: 'Revisit mechanism versus measurement boxes.',
        },
        id: 'L120-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '哪项局限与下一步最匹配？',
          en: 'Which limitation matches its next study?',
        },
        options: [
          {
            zh: '一个品种→多品种独立重复',
            en: 'One variety → independent repetitions across varieties',
          },
          {
            zh: '样本少→把同株复制成多行',
            en: 'Few samples → duplicate rows from one plant',
          },
          {
            zh: '位置混杂→只加小数位',
            en: 'Position confounding → add decimals',
          },
        ],
        correct: 0,
        feedback: {
          zh: '新独立材料扩大适用范围；复制读数或小数不能修复取样和设计。',
          en: 'New independent material broadens scope; duplicate readings and decimals do not fix sampling or design.',
        },
        revisit: {
          zh: '回看局限→下一步箭头。',
          en: 'Revisit limitation → next test.',
        },
        id: 'L120-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '均值9与12 cm，哪个33.3%说法合适？',
          en: 'For means 9 and 12 cm, which 33.3% statement is justified?',
        },
        options: [
          {
            zh: '每株最终高度都增33.3%',
            en: 'Every final plant height increased by 33.3%',
          },
          {
            zh: '所有植物产量增33.3%',
            en: 'All plant yields rose by 33.3%',
          },
          {
            zh: '本样本7天平均增量相对9 cm高约33.3%',
            en: 'The sample mean seven-day increase is about 33.3% higher relative to 9 cm',
          },
        ],
        correct: 2,
        feedback: {
          zh: '分母9 cm是参考组平均增量；不能换成每株、最终高度或产量。',
          en: 'The denominator is the reference mean increase of 9 cm, not individual height, final height or yield.',
        },
        revisit: {
          zh: '核对数据框的7天株高增量标签。',
          en: 'Check “seven-day height increase” in the data box.',
        },
        id: 'L120-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'limitation在科学结论中表示什么？',
          en: 'What does limitation mean in a scientific conclusion?',
        },
        options: [
          {
            zh: '结论没有任何价值',
            en: 'The conclusion has no value',
          },
          {
            zh: '限制强度或适用范围的具体条件',
            en: 'A specific restriction on claim strength or scope',
          },
          {
            zh: '必须隐藏的坏消息',
            en: 'Bad news that must be hidden',
          },
        ],
        correct: 1,
        feedback: {
          zh: '局限让别人知道何处可用、何处还需新证据。',
          en: 'A limitation shows where an inference applies and where new evidence is needed.',
        },
        revisit: {
          zh: '回看一个品种/7天的限定语。',
          en: 'Revisit the one-variety/seven-day qualification.',
        },
        id: 'L120-q4',
      },
    ],
    minutes: 30,
    icon: '◎',
    summary: {
      zh: '科学结论与局限',
      en: 'Claims, evidence and limitations',
    },
    reference: {
      title: 'Scientific verification source',
      url: 'https://openstax.org/books/biology-2e/pages/1-1-the-science-of-biology',
    },
  },
];
