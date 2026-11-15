import type { Lesson } from '../schema';

export const biotechnologyResearchLessons: Lesson[] = [
  {
    id: 'L137',
    title: {
      zh: 'PCR为什么能检测DNA？',
      en: 'The Principle of PCR',
    },
    hook: {
      zh: '没有目标模板却运行很多轮，会不会“复制”出目标？空白也有信号时，样本信号还能直接相信吗？',
      en: 'Can many cycles copy a target that was never present? Can a sample signal be trusted if the blank also signals?',
    },
    objectives: [
      {
        zh: '连接模板、引物和聚合酶，解释目标区段选择性复制。',
        en: 'Connect template, primers and polymerase to selective target copying.',
      },
      {
        zh: '有条件使用理想倍增公式，比较效率。',
        en: 'Use ideal doubling conditionally and compare efficiencies.',
      },
      {
        zh: '用空白/阳性对照解释污染、抑制和未检出局限。',
        en: 'Use blank/positive controls to interpret contamination, inhibition and non-detection.',
      },
    ],
    prediction: [
      {
        zh: '有模板、合适引物与聚合酶才可复制目标区段。',
        en: 'A target template, suitable primers and polymerase enable target copying.',
      },
      {
        zh: '没有目标也会因循环多而必然产生目标。',
        en: 'Enough cycles necessarily produce the target without a template.',
      },
      {
        zh: '空白有信号时反而说明样本更可靠。',
        en: 'A signalling blank makes the sample more reliable.',
      },
    ],
    terms: [
      {
        word: {
          zh: '模板',
          en: 'template',
        },
        meaning: {
          zh: '供互补链复制的信息来源。',
          en: 'The information source for a complementary copy.',
        },
      },
      {
        word: {
          zh: '引物',
          en: 'primer',
        },
        meaning: {
          zh: '与模板互补并为延伸提供起点的短核酸。',
          en: 'A short nucleic acid binding complementarily and providing an extension start.',
        },
      },
      {
        word: {
          zh: 'DNA聚合酶',
          en: 'DNA polymerase',
        },
        meaning: {
          zh: '延伸DNA新链的酶。',
          en: 'An enzyme extending a new DNA strand.',
        },
      },
      {
        word: {
          zh: '扩增',
          en: 'amplification',
        },
        meaning: {
          zh: '增加选定区段的拷贝量。',
          en: 'Increasing copies of a selected segment.',
        },
      },
      {
        word: {
          zh: '循环',
          en: 'cycle',
        },
        meaning: {
          zh: '本概念模型中一轮重复复制过程。',
          en: 'One repeated copying round in this conceptual model.',
        },
      },
      {
        word: {
          zh: '空白对照',
          en: 'blank control',
        },
        meaning: {
          zh: '不含目标模板的比较，用于检查污染等。',
          en: 'A no-target comparison checking contamination and related problems.',
        },
      },
      {
        word: {
          zh: '阳性对照',
          en: 'positive control',
        },
        meaning: {
          zh: '预期能给出信号的已知比较。',
          en: 'A known comparison expected to yield a signal.',
        },
      },
      {
        word: {
          zh: '抑制',
          en: 'inhibition',
        },
        meaning: {
          zh: '使预期扩增受阻的影响。',
          en: 'An influence that obstructs expected amplification.',
        },
      },
    ],
    questions: [
      {
        id: 'L137-q1',
        skill: 'concept',
        prompt: {
          zh: 'PCR在本课主要做什么？',
          en: 'What does PCR principally do here?',
        },
        options: [
          {
            zh: '复制选定DNA区段',
            en: 'Copy a selected DNA segment',
          },
          {
            zh: '改写所有基因',
            en: 'Rewrite every gene',
          },
          {
            zh: '直接读全部碱基',
            en: 'Read every base directly',
          },
        ],
        correct: 0,
        feedback: {
          zh: '引物界定目标、聚合酶复制；扩增不等于编辑或测序。',
          en: 'Primers bound a target and polymerase copies it; amplification is neither editing nor sequencing.',
        },
        revisit: {
          zh: '回看图中目标两端与灰色侧翼。',
          en: 'Revisit the target boundaries and grey flanking DNA.',
        },
      },
      {
        id: 'L137-q2',
        skill: 'concept',
        prompt: {
          zh: '空白有目标信号应怎样解释？',
          en: 'How should a target signal in the blank be treated?',
        },
        options: [
          {
            zh: '不影响任何结论',
            en: 'It affects no conclusions',
          },
          {
            zh: '提示污染，先检查再解释样本',
            en: 'Suspect contamination; investigate before interpreting samples',
          },
          {
            zh: '证明样本中目标很多',
            en: 'It proves abundant target in the sample',
          },
        ],
        correct: 1,
        feedback: {
          zh: '空白不应有目标。其信号使来源不确定，不能把所有信号归样本。',
          en: 'A target-free blank should not signal. Its signal makes origin uncertain, so not all signal can be attributed to the sample.',
        },
        revisit: {
          zh: '回看空白列与对照情境。',
          en: 'Revisit the blank column and control scenario.',
        },
      },
      {
        id: 'L137-q3',
        skill: 'reasoning',
        prompt: {
          zh: '2份目标、4轮、理想100%效率得多少？',
          en: 'With two target copies and four ideal 100%-efficient cycles, how many result?',
        },
        options: [
          {
            zh: '8份，所有真实样本都如此',
            en: '8, in every real sample',
          },
          {
            zh: '32份，只在理想假设下',
            en: '32, only under ideal assumptions',
          },
          {
            zh: '0份，因为PCR不能复制',
            en: '0, because PCR cannot copy',
          },
        ],
        correct: 1,
        feedback: {
          zh: '2×2⁴=32；50%固定效率时为2×1.5⁴=10.125期望份，真实过程还有平台期。',
          en: '2×2⁴=32; fixed 50% efficiency gives 2×1.5⁴=10.125 expected copies, while real processes also plateau.',
        },
        revisit: {
          zh: '回看循环4与效率按钮。',
          en: 'Revisit cycle 4 and efficiency settings.',
        },
      },
      {
        id: 'L137-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'inhibition指什么？',
          en: 'What does inhibition mean?',
        },
        options: [
          {
            zh: '确定不存在目标',
            en: 'Proven target absence',
          },
          {
            zh: '把DNA改写',
            en: 'Rewriting DNA',
          },
          {
            zh: '阻碍预期扩增',
            en: 'Obstructing expected amplification',
          },
        ],
        correct: 2,
        feedback: {
          zh: '抑制阻止新增而不删除原有模板；本模型阳性仍2份、新增0，对照不通过。现实未检出不等于不存在。',
          en: 'Inhibition prevents new copies without deleting templates: the model positive remains at two, adds zero and fails controls. Real non-detection is not absence.',
        },
        revisit: {
          zh: '回看共有抑制时阳性2份、新增0和独立对照状态。',
          en: 'Revisit the inhibited positive’s two copies, zero increase and separate control status.',
        },
      },
    ],
    mission: {
      zh: '画“模板→目标增加→对照→有限结论”四格概念卡，用中英各一句描述未检出边界。',
      en: 'Draw template → target increase → controls → bounded claim. Write one sentence in each language explaining the boundary of non-detection.',
    },
    minutes: 35,
    icon: '⌘',
    summary: {
      zh: '没有目标模板却运行很多轮，会不会“复制”出目标？空白也有信号时，样本信号还能直接相信吗？',
      en: 'Can many cycles copy a target that was never present? Can a sample signal be trusted if the blank also signals?',
    },
    reference: {
      title: 'NHGRI: Polymerase Chain Reaction Fact Sheet',
      url: 'https://www.genome.gov/about-genomics/fact-sheets/Polymerase-Chain-Reaction-Fact-Sheet',
    },
  },
  {
    id: 'L138',
    title: {
      zh: '电泳和测序如何读信息？',
      en: 'Reading DNA Evidence',
    },
    hook: {
      zh: '两条带出现在相近高度，是否意味着碱基顺序相同？为什么ATCG与AGCT能有相同长度？',
      en: 'Do bands at similar heights have the same base order? Why can ATCG and AGCT have equal length?',
    },
    objectives: [
      {
        zh: '解释DNA向正极迁移与常见小片段迁得较远。',
        en: 'Explain migration towards the positive pole and generally farther movement of smaller fragments.',
      },
      {
        zh: '用marker估计大小并承认误差与分辨力。',
        en: 'Use markers to estimate size while recognising error and resolution.',
      },
      {
        zh: '区分电泳大小、测序顺序和身份主张的证据层级。',
        en: 'Distinguish size, sequence and identity claims as different evidence levels.',
      },
    ],
    prediction: [
      {
        zh: '大小相同的片段可以有不同序列。',
        en: 'Equal-size fragments can have different sequences.',
      },
      {
        zh: '一条带能直接读出每个碱基。',
        en: 'One band directly reveals every base.',
      },
      {
        zh: '同高条带足以确定唯一身份和行为。',
        en: 'Matching band heights establish unique identity and behaviour.',
      },
    ],
    terms: [
      {
        word: {
          zh: '电泳',
          en: 'electrophoresis',
        },
        meaning: {
          zh: '用电场使分子迁移并分离的技术。',
          en: 'A technique separating molecules by movement in an electric field.',
        },
      },
      {
        word: {
          zh: '条带',
          en: 'band',
        },
        meaning: {
          zh: '许多迁移位置相近分子的可见信号。',
          en: 'Visible signal from many molecules at similar migration positions.',
        },
      },
      {
        word: {
          zh: '标记标准',
          en: 'marker',
        },
        meaning: {
          zh: '提供已知片段大小的比较。',
          en: 'A comparison containing fragments of known sizes.',
        },
      },
      {
        word: {
          zh: '碱基对',
          en: 'base pair',
        },
        meaning: {
          zh: '双链DNA片段大小常用单位bp。',
          en: 'A common unit, bp, for double-stranded DNA fragment size.',
        },
      },
      {
        word: {
          zh: '测序',
          en: 'sequencing',
        },
        meaning: {
          zh: '确定核酸碱基的排列顺序。',
          en: 'Determining the order of nucleic-acid bases.',
        },
      },
      {
        word: {
          zh: '分辨力',
          en: 'resolution',
        },
        meaning: {
          zh: '区分接近信号的能力。',
          en: 'Ability to distinguish nearby signals.',
        },
      },
      {
        word: {
          zh: '迁移',
          en: 'migration',
        },
        meaning: {
          zh: '分子在介质中位置发生变化。',
          en: 'Change of molecular position through a medium.',
        },
      },
      {
        word: {
          zh: '测量误差',
          en: 'measurement error',
        },
        meaning: {
          zh: '读数与所测量量的差异或不确定。',
          en: 'Difference or uncertainty associated with a measured value.',
        },
      },
    ],
    questions: [
      {
        id: 'L138-q1',
        skill: 'concept',
        prompt: {
          zh: '本课常见DNA片段迁移方向是什么？',
          en: 'Which direction do typical DNA fragments move here?',
        },
        options: [
          {
            zh: '向正极',
            en: 'Towards the positive pole',
          },
          {
            zh: '永远停在起点',
            en: 'Always remain at the origin',
          },
          {
            zh: '因为正电而向负极',
            en: 'Towards negative because DNA is positive',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'DNA骨架带负电，电场中向正极；介质与大小也影响迁移。',
          en: 'DNA’s backbone is negatively charged, so migration is towards the positive pole; medium and size also matter.',
        },
        revisit: {
          zh: '回看右侧正极箭头和marker。',
          en: 'Revisit the positive-pole arrow and marker.',
        },
      },
      {
        id: 'L138-q2',
        skill: 'concept',
        prompt: {
          zh: '一条约400 bp的带直接提供什么？',
          en: 'What does an approximately 400 bp band directly provide?',
        },
        options: [
          {
            zh: '完整基因组序列',
            en: 'A complete genome sequence',
          },
          {
            zh: '相对于标准的片段大小证据',
            en: 'Fragment-size evidence relative to a marker',
          },
          {
            zh: '唯一身份和行为',
            en: 'Unique identity and behaviour',
          },
        ],
        correct: 1,
        feedback: {
          zh: '条带位置支持大小估计，不逐个读碱基，更不证明行为。',
          en: 'Position supports a size estimate, not base-by-base reading or behaviour.',
        },
        revisit: {
          zh: '回看底部ATCG与AGCT等长反例。',
          en: 'Revisit the equal-length ATCG/AGCT counterexample.',
        },
      },
      {
        id: 'L138-q3',
        skill: 'reasoning',
        prompt: {
          zh: '样本与参照同约400 bp；给定窗口分别ATCG和AGCT。最佳结论？',
          en: 'Sample and reference are both about 400 bp; stated windows are ATCG and AGCT. Best conclusion?',
        },
        options: [
          {
            zh: '同大小所以序列完全相同',
            en: 'Same size means identical sequence',
          },
          {
            zh: '窗口不同，片段大小仍可相同；全基因组未知',
            en: 'Windows differ while fragment sizes can match; whole genomes remain unknown',
          },
          {
            zh: '测序否定电泳原理',
            en: 'Sequencing disproves electrophoresis',
          },
        ],
        correct: 1,
        feedback: {
          zh: '两工具测不同层次；局部序列差异与相同长度并不矛盾。',
          en: 'The tools assess different evidence layers; local sequence differences are consistent with equal lengths.',
        },
        revisit: {
          zh: '切换只有电泳/再给测序并比较能说什么。',
          en: 'Switch gel-only/add-sequence and compare permitted statements.',
        },
      },
      {
        id: 'L138-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'resolution在此指什么？',
          en: 'What does resolution mean here?',
        },
        options: [
          {
            zh: '政策决议',
            en: 'A policy decision',
          },
          {
            zh: '把每条带变成一个人',
            en: 'Assigning each band to a person',
          },
          {
            zh: '区分相近信号的能力',
            en: 'Ability to distinguish nearby signals',
          },
        ],
        correct: 2,
        feedback: {
          zh: '画出两个位置不保证实际仪器可区分；要知道分辨力和误差。',
          en: 'Two drawn positions do not guarantee instrumental distinguishability; resolution and error matter.',
        },
        revisit: {
          zh: '回看400/450 bp与7.2示意单位差。',
          en: 'Revisit 400/450 bp and their 7.2 schematic-unit separation.',
        },
      },
    ],
    mission: {
      zh: '为U35听证会写“大小≠序列≠唯一身份”的三层证据卡，保留bp单位和一项测量局限。',
      en: 'For the U35 hearing, prepare size ≠ sequence ≠ unique identity cards, retaining bp and one measurement limitation.',
    },
    minutes: 35,
    icon: '⌘',
    summary: {
      zh: '两条带出现在相近高度，是否意味着碱基顺序相同？为什么ATCG与AGCT能有相同长度？',
      en: 'Do bands at similar heights have the same base order? Why can ATCG and AGCT have equal length?',
    },
    reference: {
      title: 'NHGRI: Electrophoresis; DNA Sequencing',
      url: 'https://www.genome.gov/genetics-glossary/Electrophoresis',
    },
  },
  {
    id: 'L139',
    title: {
      zh: '基因工程与基因编辑概念',
      en: 'Genetic Engineering and Editing',
    },
    hook: {
      zh: '把DNA在靶位点切开，是否等于每个细胞都获得同一个预期结果？12/20能写成100份里已有60份成功吗？',
      en: 'Does a targeted cut give every cell the same intended result? Does 12/20 mean 60 of 100 were observed to succeed?',
    },
    objectives: [
      {
        zh: '区别PCR扩增、引入遗传材料与靶向编辑。',
        en: 'Distinguish PCR amplification, introduced genetic material and targeted editing.',
      },
      {
        zh: '用切割后修复解释混合结果。',
        en: 'Explain mixed outcomes through repair following a cut.',
      },
      {
        zh: '以真实分母和检测范围评价成功率、脱靶与性状主张。',
        en: 'Evaluate success, off-target and trait claims using tested denominators and coverage.',
      },
    ],
    prediction: [
      {
        zh: '靶向后修复可能产生多种结果。',
        en: 'Targeted cutting can be followed by different repair outcomes.',
      },
      {
        zh: 'PCR复制就是把目标基因改写。',
        en: 'PCR copying rewrites the target gene.',
      },
      {
        zh: '测到一个预期产物就证明所有材料无脱靶。',
        en: 'One intended product proves every sample has no off-target change.',
      },
    ],
    terms: [
      {
        word: {
          zh: '基因工程',
          en: 'genetic engineering',
        },
        meaning: {
          zh: '用技术改变遗传材料的广义做法。',
          en: 'A broad use of technology to alter genetic material.',
        },
      },
      {
        word: {
          zh: '基因组编辑',
          en: 'genome editing',
        },
        meaning: {
          zh: '针对基因组位置进行改变的方法集合。',
          en: 'Methods for making targeted genomic changes.',
        },
      },
      {
        word: {
          zh: '转基因',
          en: 'transgenesis',
        },
        meaning: {
          zh: '将外源遗传材料引入生物的做法。',
          en: 'Introducing foreign genetic material into an organism.',
        },
      },
      {
        word: {
          zh: '靶位点',
          en: 'target site',
        },
        meaning: {
          zh: '计划影响的基因组位置。',
          en: 'A genomic location intended to be affected.',
        },
      },
      {
        word: {
          zh: '修复',
          en: 'repair',
        },
        meaning: {
          zh: '细胞处理DNA损伤或断裂的过程。',
          en: 'Cellular processes responding to DNA damage or breaks.',
        },
      },
      {
        word: {
          zh: '脱靶',
          en: 'off-target change',
        },
        meaning: {
          zh: '预期位置以外的改变。',
          en: 'A change outside the intended location.',
        },
      },
      {
        word: {
          zh: '未完全编辑',
          en: 'incomplete editing',
        },
        meaning: {
          zh: '部分材料或细胞仍未获得预期改变。',
          en: 'Some material or cells lack the intended change.',
        },
      },
      {
        word: {
          zh: '代表性',
          en: 'representativeness',
        },
        meaning: {
          zh: '样本反映所讨论总体的程度。',
          en: 'How well a sample reflects the population being discussed.',
        },
      },
    ],
    questions: [
      {
        id: 'L139-q1',
        skill: 'concept',
        prompt: {
          zh: 'PCR和编辑的主要区别是什么？',
          en: 'What principally distinguishes PCR from editing?',
        },
        options: [
          {
            zh: 'PCR增拷贝；编辑改变序列',
            en: 'PCR increases copies; editing changes sequence',
          },
          {
            zh: '两者都必然加入外源DNA',
            en: 'Both necessarily add foreign DNA',
          },
          {
            zh: 'PCR能任意指定新性状',
            en: 'PCR specifies any new trait',
          },
        ],
        correct: 0,
        feedback: {
          zh: '复制信息与改写信息是不同目标；有的编辑不引入外源DNA。',
          en: 'Copying and rewriting information have different goals; some editing does not introduce foreign DNA.',
        },
        revisit: {
          zh: '回看靶向、切割、修复的顺序。',
          en: 'Revisit targeting, cutting and repair.',
        },
      },
      {
        id: 'L139-q2',
        skill: 'concept',
        prompt: {
          zh: '为什么切割不等于指定产物？',
          en: 'Why does cutting not guarantee a specified product?',
        },
        options: [
          {
            zh: 'DNA不能修复',
            en: 'DNA cannot be repaired',
          },
          {
            zh: '修复可产生不同改变或仍未改变',
            en: 'Repair can yield different changes or no intended change',
          },
          {
            zh: '每次都会产生新物种',
            en: 'Every cut creates a new species',
          },
        ],
        correct: 1,
        feedback: {
          zh: '工具影响靶位点后，细胞修复与材料差异仍影响结果，需检测产物。',
          en: 'Cellular repair and material differences still affect outcomes after targeting, so products need assessment.',
        },
        revisit: {
          zh: '回看预期12、其他5、未变3分支。',
          en: 'Revisit branches: intended 12, other repair 5, unchanged 3.',
        },
      },
      {
        id: 'L139-q3',
        skill: 'reasoning',
        prompt: {
          zh: '100份中测20份，12预期。哪句诚实？',
          en: 'Of 100 samples, 20 assessed and 12 intended. Which statement is honest?',
        },
        options: [
          {
            zh: '已知100份里60份成功',
            en: '60 of 100 are known successful',
          },
          {
            zh: '已测20份的60%预期，80份未知',
            en: '60% of 20 assessed are intended; 80 are unknown',
          },
          {
            zh: '其余80份一定失败',
            en: 'The other 80 certainly failed',
          },
        ],
        correct: 1,
        feedback: {
          zh: '12/20=60%，不能把未测变成已知成功或失败；取样代表性也未知。',
          en: '12/20=60%; unassessed samples are neither known successes nor failures, and representativeness is unspecified.',
        },
        revisit: {
          zh: '回看图题只测20/100和底部80未测。',
          en: 'Revisit the 20/100 title and 80-unassessed note.',
        },
      },
      {
        id: 'L139-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'off-target change指什么？',
          en: 'What is an off-target change?',
        },
        options: [
          {
            zh: '目标DNA复制增多',
            en: 'More copies of target DNA',
          },
          {
            zh: '预期位置外的改变',
            en: 'A change outside the intended location',
          },
          {
            zh: '任何有益性状',
            en: 'Any beneficial trait',
          },
        ],
        correct: 1,
        feedback: {
          zh: '靶位点正确不证明其他位点都没改变；检测覆盖范围要说清。',
          en: 'A correct target does not establish absence of changes elsewhere; assessment coverage must be specified.',
        },
        revisit: {
          zh: '回看尚需检查其他位点的提示。',
          en: 'Revisit the note about assessing other sites.',
        },
      },
    ],
    mission: {
      zh: '给U35报告补“已测分母/未测材料/检测覆盖范围”三栏，不把60%当全体保证。',
      en: 'Add tested denominator, unassessed material and assessment coverage to the U35 report; do not turn 60% into a universal guarantee.',
    },
    minutes: 35,
    icon: '⌘',
    summary: {
      zh: '把DNA在靶位点切开，是否等于每个细胞都获得同一个预期结果？12/20能写成100份里已有60份成功吗？',
      en: 'Does a targeted cut give every cell the same intended result? Does 12/20 mean 60 of 100 were observed to succeed?',
    },
    reference: {
      title: 'NHGRI: How Does Genome Editing Work?',
      url: 'https://www.genome.gov/about-genomics/policy-issues/Genome-Editing/How-genome-editing-works',
    },
  },
  {
    id: 'L140',
    title: {
      zh: '生物伦理与社会决策',
      en: 'Bioethics and Decision-Making',
    },
    hook: {
      zh: '同一份有限的植物编辑证据，为什么有人支持封闭研究，有人支持先补证据再扩大？谁应该参与决定？',
      en: 'Why might the same limited plant-editing evidence support contained research or a pause before expansion? Who should participate?',
    },
    objectives: [
      {
        zh: '区分经验事实、不确定与价值判断。',
        en: 'Separate empirical facts, uncertainties and value judgements.',
      },
      {
        zh: '比较至少两种可辩护决定并回应反方理由。',
        en: 'Compare two defensible decisions and answer a counterargument.',
      },
      {
        zh: '把同意、公平、生态与治理写成可修订条件。',
        en: 'Turn consent, fairness, ecology and governance into revisable conditions.',
      },
    ],
    prediction: [
      {
        zh: '相同事实下不同价值权衡可得不同合理选择。',
        en: 'Different reasonable choices can follow from the same facts and different value priorities.',
      },
      {
        zh: '存在未知就等于已经证明有害。',
        en: 'Uncertainty means harm has been proven.',
      },
      {
        zh: '实验有潜在效益就不需受影响者参与。',
        en: 'Potential benefits remove the need for stakeholder participation.',
      },
    ],
    terms: [
      {
        word: {
          zh: '生物伦理',
          en: 'bioethics',
        },
        meaning: {
          zh: '对生命科学行动中的价值和责任进行论证。',
          en: 'Reasoning about values and responsibilities in life science.',
        },
      },
      {
        word: {
          zh: '经验事实',
          en: 'empirical fact',
        },
        meaning: {
          zh: '能用观察或测量检查的陈述。',
          en: 'A statement checkable through observation or measurement.',
        },
      },
      {
        word: {
          zh: '不确定性',
          en: 'uncertainty',
        },
        meaning: {
          zh: '证据尚不能确定的范围或问题。',
          en: 'Questions or ranges not settled by available evidence.',
        },
      },
      {
        word: {
          zh: '利益相关者',
          en: 'stakeholder',
        },
        meaning: {
          zh: '受到决定影响或有相关责任的人群。',
          en: 'People affected by a decision or bearing relevant responsibilities.',
        },
      },
      {
        word: {
          zh: '知情同意',
          en: 'informed consent',
        },
        meaning: {
          zh: '在获得充分信息并自愿情况下作出同意。',
          en: 'Voluntary agreement based on adequate information.',
        },
      },
      {
        word: {
          zh: '公平',
          en: 'equity',
        },
        meaning: {
          zh: '关注利益、风险和参与机会如何分配。',
          en: 'Attention to distribution of benefits, risks and participation.',
        },
      },
      {
        word: {
          zh: '治理',
          en: 'governance',
        },
        meaning: {
          zh: '作决定、监督、追责和修订的安排。',
          en: 'Arrangements for decisions, oversight, accountability and revision.',
        },
      },
      {
        word: {
          zh: '权衡',
          en: 'trade-off',
        },
        meaning: {
          zh: '在不同效益、风险或价值间作选择。',
          en: 'A choice involving competing benefits, risks or values.',
        },
      },
    ],
    questions: [
      {
        id: 'L140-q1',
        skill: 'concept',
        prompt: {
          zh: '哪句是本情境的经验事实？',
          en: 'Which is an empirical fact in this scenario?',
        },
        options: [
          {
            zh: '已测20份有12份目标产物',
            en: '12 of 20 assessed samples have the intended product',
          },
          {
            zh: '任何成本都值得承担',
            en: 'Any cost is worth paying',
          },
          {
            zh: '公平不重要',
            en: 'Fairness does not matter',
          },
        ],
        correct: 0,
        feedback: {
          zh: '12/20可核查；值得和重要表达价值，不能混成实验直接结论。',
          en: '12/20 can be checked; worth and importance express values, not direct experimental findings.',
        },
        revisit: {
          zh: '回看事实/未知/价值三圆。',
          en: 'Revisit the fact/unknown/value circles.',
        },
      },
      {
        id: 'L140-q2',
        skill: 'concept',
        prompt: {
          zh: '哪个治理条件最能支持可修订决定？',
          en: 'Which governance condition best supports revision?',
        },
        options: [
          {
            zh: '永不公开失败',
            en: 'Never disclose failures',
          },
          {
            zh: '独立检查、停止条件和重审时间',
            en: 'Independent checks, stopping conditions and review timing',
          },
          {
            zh: '只问支持者',
            en: 'Consult supporters only',
          },
        ],
        correct: 1,
        feedback: {
          zh: '监督与重审让新证据真正影响行动，也需要受影响者有意义参与。',
          en: 'Oversight and review allow new evidence to change action, with meaningful stakeholder participation.',
        },
        revisit: {
          zh: '回看决定反馈中的新证据与重审条件。',
          en: 'Revisit new-evidence and review conditions in the feedback.',
        },
      },
      {
        id: 'L140-q3',
        skill: 'reasoning',
        prompt: {
          zh: '两人分别支持继续封闭研究和暂缓扩大，怎样评价？',
          en: 'One person supports contained research, another a pause before expansion. How should they be evaluated?',
        },
        options: [
          {
            zh: '按是否同意老师',
            en: 'By agreement with the teacher',
          },
          {
            zh: '看事实准确、权衡透明、回应反方和修订条件',
            en: 'By accurate facts, transparent trade-offs, counterarguments and revision conditions',
          },
          {
            zh: '只按最后立场',
            en: 'By final stance alone',
          },
        ],
        correct: 1,
        feedback: {
          zh: '两种决定都可合理；评证据与理由品质，不把一个政策当唯一道德答案。',
          en: 'Both can be defensible; evaluate evidence and reasoning, not one policy as the only moral answer.',
        },
        revisit: {
          zh: '切换两个决定，比较各自成本和理由。',
          en: 'Switch both decisions and compare their costs and reasons.',
        },
      },
      {
        id: 'L140-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'stakeholder在这里指谁？',
          en: 'Who is a stakeholder here?',
        },
        options: [
          {
            zh: '仅实验工具',
            en: 'Only laboratory equipment',
          },
          {
            zh: '仅研究者',
            en: 'Only researchers',
          },
          {
            zh: '受影响者和有相关责任者',
            en: 'Affected people and relevant responsible parties',
          },
        ],
        correct: 2,
        feedback: {
          zh: '农户、当地社群、研究者、生态管理者和消费者可能承受不同利益与风险。',
          en: 'Farmers, communities, researchers, ecological managers and consumers can face different benefits and risks.',
        },
        revisit: {
          zh: '回看受影响者、信息参与与公平提示。',
          en: 'Revisit participation, informed agreement and fairness.',
        },
      },
    ],
    mission: {
      zh: '完成U35虚拟DNA听证CER，附两种决定的权衡与自己的修订条件；论证可用中文，另练英文有限结论。',
      en: 'Complete the U35 virtual DNA hearing CER with trade-offs for both decisions and your revision condition. Reason in Chinese if useful; separately practise an English bounded claim.',
    },
    minutes: 40,
    icon: '⌘',
    summary: {
      zh: '同一份有限的植物编辑证据，为什么有人支持封闭研究，有人支持先补证据再扩大？谁应该参与决定？',
      en: 'Why might the same limited plant-editing evidence support contained research or a pause before expansion? Who should participate?',
    },
    reference: {
      title: 'HHS: Belmont Report (reasoning principles, not plant regulation)',
      url: 'https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html',
    },
  },
  {
    id: 'L141',
    title: {
      zh: '找一个值得研究的问题',
      en: 'Finding a Research Question',
    },
    hook: {
      zh: '“树越多鸟就越多吗？”很有趣，但两地点几次观察能回答因果吗？描述变化的研究是否同样有价值？',
      en: '“Do more trees mean more birds?” is interesting, but can a few visits establish causality? Can description be valuable research?',
    },
    objectives: [
      {
        zh: '将兴趣改成有对象、指标、地点与时期的问题。',
        en: 'Turn curiosity into a question with organisms, measures, place and period.',
      },
      {
        zh: '区分描述、比较和因果问题及所需设计。',
        en: 'Distinguish descriptive, comparative and causal questions and their designs.',
      },
      {
        zh: '选官方公开数据或安全观察并检查可行性与来源。',
        en: 'Select official public data or safe observations and check feasibility and provenance.',
      },
    ],
    prediction: [
      {
        zh: '描述某地记录变化也是有效研究。',
        en: 'Describing changes in records at a site is valid research.',
      },
      {
        zh: '凡研究都必须主动操控一个生物变量。',
        en: 'Every study must manipulate a biological variable.',
      },
      {
        zh: '只要问题写“为什么”就能从相关图证明原因。',
        en: 'Adding “why” allows a correlation chart to prove a cause.',
      },
    ],
    terms: [
      {
        word: {
          zh: '研究问题',
          en: 'research question',
        },
        meaning: {
          zh: '明确所要回答及其边界的问题。',
          en: 'A question specifying the intended answer and its scope.',
        },
      },
      {
        word: {
          zh: '描述性研究',
          en: 'descriptive study',
        },
        meaning: {
          zh: '记录对象的分布、数量或变化。',
          en: 'A study describing distribution, quantity or change.',
        },
      },
      {
        word: {
          zh: '比较',
          en: 'comparison',
        },
        meaning: {
          zh: '在明确条件下对照不同记录。',
          en: 'Contrasting records under specified conditions.',
        },
      },
      {
        word: {
          zh: '因果',
          en: 'causation',
        },
        meaning: {
          zh: '某因素改变导致响应改变的关系。',
          en: 'A relationship in which changing one factor changes a response.',
        },
      },
      {
        word: {
          zh: '操作性定义',
          en: 'operational definition',
        },
        meaning: {
          zh: '把概念落实成可记录指标的说明。',
          en: 'A definition translating a concept into a recordable measure.',
        },
      },
      {
        word: {
          zh: '范围',
          en: 'scope',
        },
        meaning: {
          zh: '研究适用的对象、地点、时期等边界。',
          en: 'The organisms, place, period and other boundaries of a study.',
        },
      },
      {
        word: {
          zh: '数据来源',
          en: 'data provenance',
        },
        meaning: {
          zh: '数据由谁、何时、如何形成的记录。',
          en: 'A record of who produced data, when and how.',
        },
      },
      {
        word: {
          zh: '可行性',
          en: 'feasibility',
        },
        meaning: {
          zh: '资源、时间与安全允许研究完成的程度。',
          en: 'Whether resources, time and safety allow a study to be completed.',
        },
      },
    ],
    questions: [
      {
        id: 'L141-q1',
        skill: 'concept',
        prompt: {
          zh: '哪题用本表可回答？',
          en: 'Which question can this table answer?',
        },
        options: [
          {
            zh: '两地点同日5 min记录数怎样比较？',
            en: 'How do records compare on matched five-minute visits?',
          },
          {
            zh: '所有森林因树量增加了多少鸟？',
            en: 'How many birds did trees add in every forest?',
          },
          {
            zh: '全部鸟的终生存活率多少？',
            en: 'What is lifetime survival of every bird?',
          },
        ],
        correct: 0,
        feedback: {
          zh: '同日等努力记录是表内指标；没有树量操控或终生跟踪。',
          en: 'Matched equal-effort records are measured here; trees were not manipulated and lifetimes were not tracked.',
        },
        revisit: {
          zh: '回看问题漏斗的对象、时期、单位。',
          en: 'Revisit organisms, period and units in the question funnel.',
        },
      },
      {
        id: 'L141-q2',
        skill: 'concept',
        prompt: {
          zh: '描述性问题是否必须主动操控变量？',
          en: 'Must a descriptive question manipulate a variable?',
        },
        options: [
          {
            zh: '必须，否则不算科学',
            en: 'Yes, otherwise it is not science',
          },
          {
            zh: '不必，规范观察或官方数据也可回答',
            en: 'No; systematic observation or official data can answer it',
          },
          {
            zh: '不必，所以不用方法记录',
            en: 'No, so methods need not be recorded',
          },
        ],
        correct: 1,
        feedback: {
          zh: '问题类型决定设计；描述仍需明确指标、来源与局限。',
          en: 'Question type shapes design; description still needs measures, provenance and limits.',
        },
        revisit: {
          zh: '回看描述A变化的可回答示例。',
          en: 'Revisit the answerable descriptive example for site A.',
        },
      },
      {
        id: 'L141-q3',
        skill: 'reasoning',
        prompt: {
          zh: '把“鸟很多”改成什么最可核查？',
          en: 'Which replacement for “many birds” is most checkable?',
        },
        options: [
          {
            zh: '很自然的感觉',
            en: 'A natural feeling',
          },
          {
            zh: '地点A，第1/3/10天每5 min鸟记录数',
            en: 'Bird records at A per five-minute visit on days 1/3/10',
          },
          {
            zh: '任何地点所有鸟都喜欢树',
            en: 'All birds everywhere like trees',
          },
        ],
        correct: 1,
        feedback: {
          zh: '对象、地点、时间与努力单位让记录可复核；不把记录数偷换成总体。',
          en: 'Organisms, place, dates and effort make records checkable; they do not turn records into population abundance.',
        },
        revisit: {
          zh: '回看修测量与边界按钮。',
          en: 'Revisit measurement-and-scope options.',
        },
      },
      {
        id: 'L141-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'data provenance强调什么？',
          en: 'What does data provenance emphasise?',
        },
        options: [
          {
            zh: '图的颜色',
            en: 'Chart colours',
          },
          {
            zh: '只有最大数',
            en: 'Only the largest value',
          },
          {
            zh: '数据的来源、时间和形成方法',
            en: 'Data origin, timing and production method',
          },
        ],
        correct: 2,
        feedback: {
          zh: '机构、原表、日期、单位和方法使别人能追查，官网身份不消除数据局限。',
          en: 'Institution, original table, dates, units and methods allow checking; an official source does not erase limitations.',
        },
        revisit: {
          zh: '回看研究问题与来源自查。',
          en: 'Revisit the question and source checks.',
        },
      },
    ],
    mission: {
      zh: '为U36写一个主问题、一个可用来源/观察计划和一个现在答不了的问题；毕业报告必须标明真实数据来源。',
      en: 'For U36 write one main question, one usable source/observation plan and one question currently unanswerable. The final report must identify its real data provenance.',
    },
    minutes: 35,
    icon: '◈',
    summary: {
      zh: '“树越多鸟就越多吗？”很有趣，但两地点几次观察能回答因果吗？描述变化的研究是否同样有价值？',
      en: '“Do more trees mean more birds?” is interesting, but can a few visits establish causality? Can description be valuable research?',
    },
    reference: {
      title: 'DOC: Five-minute bird counts (records are an index)',
      url: 'https://www.doc.govt.nz/our-work/five-minute-bird-counts/',
    },
  },
  {
    id: 'L142',
    title: {
      zh: '设计研究和收集证据',
      en: 'Designing an Investigation',
    },
    hook: {
      zh: '同一地点访问四次，是四个独立地点吗？没去观察的那天能不能在表里填0？',
      en: 'Are four visits to one site four independent sites? Can a missed visit be recorded as zero?',
    },
    objectives: [
      {
        zh: '明确取样单位、重复测量和配对或独立设计。',
        en: 'Specify sampling units, repeated measures and paired or independent designs.',
      },
      {
        zh: '检查观察努力、偏差、混杂与缺失。',
        en: 'Check effort, bias, confounding and missingness.',
      },
      {
        zh: '让采集记录与研究问题一致并保留原始来源。',
        en: 'Align records with the question and preserve original provenance.',
      },
    ],
    prediction: [
      {
        zh: '同日配对可帮助比较，但不是多个独立生境。',
        en: 'Pairing dates helps comparison but does not create independent habitats.',
      },
      {
        zh: '缺失填0可以让研究更完整。',
        en: 'Filling missing with zero makes a study more complete.',
      },
      {
        zh: '观察更久通常不需记录，因为都是记录数。',
        en: 'Observation duration need not be recorded because both are counts.',
      },
    ],
    terms: [
      {
        word: {
          zh: '取样单位',
          en: 'sampling unit',
        },
        meaning: {
          zh: '被选择并作为观察或处理基础的对象。',
          en: 'The entity selected as a basis for observation or treatment.',
        },
      },
      {
        word: {
          zh: '重复测量',
          en: 'repeated measures',
        },
        meaning: {
          zh: '对同一单位在不同时间等条件下再次记录。',
          en: 'Recording the same unit again over time or conditions.',
        },
      },
      {
        word: {
          zh: '配对设计',
          en: 'paired design',
        },
        meaning: {
          zh: '按同一单位或合理匹配条件比较。',
          en: 'A comparison using the same units or justified matches.',
        },
      },
      {
        word: {
          zh: '独立样本',
          en: 'independent sample',
        },
        meaning: {
          zh: '不是同一单位重复记录的独立取样。',
          en: 'Sampling distinct independent units rather than repeated records of one.',
        },
      },
      {
        word: {
          zh: '观察努力',
          en: 'sampling effort',
        },
        meaning: {
          zh: '如观察时间、面积等采集投入。',
          en: 'Collection effort such as observation time or area.',
        },
      },
      {
        word: {
          zh: '取样偏差',
          en: 'sampling bias',
        },
        meaning: {
          zh: '取样过程系统性偏向某些对象或条件。',
          en: 'Systematic preference for some units or conditions during sampling.',
        },
      },
      {
        word: {
          zh: '混杂',
          en: 'confounding',
        },
        meaning: {
          zh: '其他因素与比较因素共同变化，使解释混在一起。',
          en: 'Other factors vary with the comparison factor and mix explanations.',
        },
      },
      {
        word: {
          zh: '缺失值',
          en: 'missing value',
        },
        meaning: {
          zh: '未获得所需记录，不等同观察为0。',
          en: 'An unavailable record, different from an observed zero.',
        },
      },
    ],
    questions: [
      {
        id: 'L142-q1',
        skill: 'concept',
        prompt: {
          zh: 'A第7天未访应怎样记录？',
          en: 'How should A’s missed day-7 visit be recorded?',
        },
        options: [
          {
            zh: 'NA并说明未访',
            en: 'NA, explaining the missed visit',
          },
          {
            zh: '0，因为没有看见',
            en: '0, because none was seen',
          },
          {
            zh: '复制上次4',
            en: 'Copy the previous four',
          },
        ],
        correct: 0,
        feedback: {
          zh: '未访没有观察结果；0要求确实按方法观察却未记录到。',
          en: 'An unmade visit has no outcome; zero requires an actual observation with no records.',
        },
        revisit: {
          zh: '回看第7天A的NA和努力0 min。',
          en: 'Revisit A day 7: NA and zero minutes of effort.',
        },
      },
      {
        id: 'L142-q2',
        skill: 'concept',
        prompt: {
          zh: '本表8行是否代表8个独立地点？',
          en: 'Do eight rows represent eight independent sites?',
        },
        options: [
          {
            zh: '是，行数就是样本地点数',
            en: 'Yes; row count equals site count',
          },
          {
            zh: '否，是两个地点的重复访问',
            en: 'No; they are repeated visits to two sites',
          },
          {
            zh: '是，因为数字不同',
            en: 'Yes, because values differ',
          },
        ],
        correct: 1,
        feedback: {
          zh: '取样层级由对象和设计决定，不由表格行数或数值不同决定。',
          en: 'Sampling level follows entities and design, not row count or differing values.',
        },
        revisit: {
          zh: '回看地点A/B两行时间配对图。',
          en: 'Revisit the A/B repeated-visit diagram.',
        },
      },
      {
        id: 'L142-q3',
        skill: 'reasoning',
        prompt: {
          zh: '公平比较本表最好先怎样处理？',
          en: 'What is the best initial comparison for this table?',
        },
        options: [
          {
            zh: 'B10 min与A缺失当0比较',
            en: 'Compare B ten minutes with A missing as zero',
          },
          {
            zh: '用1/3/10天同5 min完整配对，同时保留排除说明',
            en: 'Use complete five-minute pairs on days 1/3/10 and document exclusions',
          },
          {
            zh: '删所有不喜欢的值',
            en: 'Delete all unwelcome values',
          },
        ],
        correct: 1,
        feedback: {
          zh: '等努力同日减少一部分差异；保留原表和排除理由，不隐藏第7天。',
          en: 'Equal-effort matched dates reduce some differences; retain the original table and exclusion reasons.',
        },
        revisit: {
          zh: '回看完整配对日期与B第7天10 min。',
          en: 'Revisit complete paired dates and B day-7 effort.',
        },
      },
      {
        id: 'L142-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'sampling effort指什么？',
          en: 'What is sampling effort?',
        },
        options: [
          {
            zh: '研究者是否喜欢结果',
            en: 'Whether the researcher likes the result',
          },
          {
            zh: '论文标题长度',
            en: 'Length of a paper title',
          },
          {
            zh: '采集时间、面积等投入',
            en: 'Collection time, area and related effort',
          },
        ],
        correct: 2,
        feedback: {
          zh: '记录更多可能只因观察更久；努力要与指标一起保存。',
          en: 'More records can result simply from longer observation; save effort alongside the outcome.',
        },
        revisit: {
          zh: '回看表格min列。',
          en: 'Revisit the min column.',
        },
      },
    ],
    mission: {
      zh: '为U36写取样单位、配对/独立、努力、混杂、缺失记录规则五行计划，并说明每项改进针对什么问题。',
      en: 'For U36 write sampling unit, paired/independent structure, effort, confounding and missing-record rules, linking each improvement to a problem.',
    },
    minutes: 35,
    icon: '◈',
    summary: {
      zh: '同一地点访问四次，是四个独立地点吗？没去观察的那天能不能在表里填0？',
      en: 'Are four visits to one site four independent sites? Can a missed visit be recorded as zero?',
    },
    reference: {
      title: 'UC Berkeley, Philip Stark: Does Treatment Have an Effect?',
      url: 'https://www.stat.berkeley.edu/~stark/SticiGui/Text/experiments.htm',
    },
  },
  {
    id: 'L143',
    title: {
      zh: '分析数据与识别局限',
      en: 'Analysing Data and Limitations',
    },
    hook: {
      zh: 'A的缺失若填0，均值为什么从2变成1.5？均值柱更高就能宣布“显著”或因果吗？',
      en: 'Why does filling A’s missing value with zero change its mean from 2 to 1.5? Does a taller mean bar establish significance or causality?',
    },
    objectives: [
      {
        zh: '保留单位、分母、缺失和真实时间间隔作图。',
        en: 'Plot with units, denominators, missingness and actual time intervals.',
      },
      {
        zh: '计算均值与范围并区别置信区间。',
        en: 'Calculate mean and range and distinguish them from confidence intervals.',
      },
      {
        zh: '用数据→推理→局限修正过强结论。',
        en: 'Repair overstrong conclusions using data → reasoning → limitation.',
      },
    ],
    prediction: [
      {
        zh: '图形选择能隐藏原始差异与取样问题。',
        en: 'Chart choices can hide raw variation and sampling problems.',
      },
      {
        zh: '均值柱高差直接证明统计显著。',
        en: 'Different bar heights directly establish statistical significance.',
      },
      {
        zh: '把日期画成等间距永远不影响解释速度。',
        en: 'Equal spacing of dates never affects interpretation of change rates.',
      },
    ],
    terms: [
      {
        word: {
          zh: '均值',
          en: 'mean',
        },
        meaning: {
          zh: '有效观察值之和除以其个数。',
          en: 'Sum of observed values divided by their number.',
        },
      },
      {
        word: {
          zh: '范围',
          en: 'range',
        },
        meaning: {
          zh: '最大值减最小值，描述样本散布。',
          en: 'Maximum minus minimum, describing sample spread.',
        },
      },
      {
        word: {
          zh: '置信区间',
          en: 'confidence interval',
        },
        meaning: {
          zh: '用明确统计方法估计参数不确定性的区间。',
          en: 'An interval from a specified statistical method describing parameter uncertainty.',
        },
      },
      {
        word: {
          zh: '分母',
          en: 'denominator',
        },
        meaning: {
          zh: '比例或平均所依据的基数。',
          en: 'The base used for a fraction or average.',
        },
      },
      {
        word: {
          zh: '比例尺',
          en: 'scale',
        },
        meaning: {
          zh: '图上位置与数值之间的对应。',
          en: 'The mapping between plotted position and value.',
        },
      },
      {
        word: {
          zh: '相关',
          en: 'correlation',
        },
        meaning: {
          zh: '变量共同变化的统计关系，不自动表因果。',
          en: 'A statistical pattern of covariation, not automatically causation.',
        },
      },
      {
        word: {
          zh: '统计显著',
          en: 'statistical significance',
        },
        meaning: {
          zh: '依赖假设和适当分析的推断结论。',
          en: 'An inference requiring assumptions and appropriate analysis.',
        },
      },
      {
        word: {
          zh: '局限',
          en: 'limitation',
        },
        meaning: {
          zh: '限制结论强度或适用范围的具体条件。',
          en: 'A specific restriction on inference strength or scope.',
        },
      },
    ],
    questions: [
      {
        id: 'L143-q1',
        skill: 'concept',
        prompt: {
          zh: 'A为2、4、NA、0，均值是什么？',
          en: 'A has 2, 4, NA and 0. What is its mean?',
        },
        options: [
          {
            zh: '2，分母3个已观察值',
            en: '2, with three observed values',
          },
          {
            zh: '1.5，缺失必须算0',
            en: '1.5, because missing must count as zero',
          },
          {
            zh: '3，只留非零',
            en: '3, retaining only nonzero values',
          },
        ],
        correct: 0,
        feedback: {
          zh: '0是有效记录而NA不是；(2+4+0)/3=2，不能随意换分母。',
          en: 'Zero is observed; NA is not. (2+4+0)/3=2, without arbitrary denominator changes.',
        },
        revisit: {
          zh: '回看原表NA、0与均值输出。',
          en: 'Revisit NA, zero and the mean output.',
        },
      },
      {
        id: 'L143-q2',
        skill: 'concept',
        prompt: {
          zh: 'A的0–4记录，范围4表示什么？',
          en: 'What does A’s range of four records, from 0 to 4, describe?',
        },
        options: [
          {
            zh: '95%置信区间',
            en: 'A 95% confidence interval',
          },
          {
            zh: '样本最大减最小的散布',
            en: 'Sample spread: maximum minus minimum',
          },
          {
            zh: '总体真实值必在0–4',
            en: 'Population truth must lie between 0 and 4',
          },
        ],
        correct: 1,
        feedback: {
          zh: '范围描述观察值散布；没有指定推断方法，不能标成CI或总体保证。',
          en: 'Range describes observed spread; without an inferential method it is neither a CI nor a population guarantee.',
        },
        revisit: {
          zh: '回看原始点与“未画置信区间”。',
          en: 'Revisit raw points and “no confidence interval shown”.',
        },
      },
      {
        id: 'L143-q3',
        skill: 'reasoning',
        prompt: {
          zh: '本表最合适的结论是哪句？',
          en: 'Which conclusion best fits the table?',
        },
        options: [
          {
            zh: '树量导致全部鸟显著翻倍',
            en: 'Trees significantly doubled all birds',
          },
          {
            zh: '可比3日期B记录均比A多2/5 min，仍不能推因果或总体密度',
            en: 'Across three comparable dates B has two more records/5 min, without establishing causality or density',
          },
          {
            zh: '记录有局限就完全没价值',
            en: 'Limitations make the records worthless',
          },
        ],
        correct: 1,
        feedback: {
          zh: '差异有描述价值；地点、努力、发现概率与设计限制更强结论。',
          en: 'The difference has descriptive value; sites, effort, detectability and design limit stronger claims.',
        },
        revisit: {
          zh: '回看修正结论反馈和完整配对。',
          en: 'Revisit repaired-claim feedback and complete pairs.',
        },
      },
      {
        id: 'L143-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'limitation应怎样使用？',
          en: 'How should limitation be used?',
        },
        options: [
          {
            zh: '只写“人为误差”就够',
            en: 'Write only “human error”',
          },
          {
            zh: '隐藏使报告更漂亮',
            en: 'Hide it to improve presentation',
          },
          {
            zh: '指具体边界并连接下一步改进',
            en: 'Name a specific boundary and link it to a next improvement',
          },
        ],
        correct: 2,
        feedback: {
          zh: '一个地点/类型→增加独立地点；努力不同→预定统一访问，比空泛标签更有用。',
          en: 'One site per setting → add independent sites; unequal effort → standardise planned visits. Specific links beat vague labels.',
        },
        revisit: {
          zh: '回看局限→标准化与独立地点建议。',
          en: 'Revisit limitations linked to standardisation and independent sites.',
        },
      },
    ],
    mission: {
      zh: '为U36保留原始表、含单位的图和一句数据→推理→局限；给每项局限配一个可行改进。',
      en: 'For U36 keep the raw table, a chart with units and a data → reasoning → limitation statement; match each limitation with a feasible improvement.',
    },
    minutes: 35,
    icon: '◈',
    summary: {
      zh: 'A的缺失若填0，均值为什么从2变成1.5？均值柱更高就能宣布“显著”或因果吗？',
      en: 'Why does filling A’s missing value with zero change its mean from 2 to 1.5? Does a taller mean bar establish significance or causality?',
    },
    reference: {
      title:
        'UC Berkeley, Philip Stark: observational comparisons and confounding',
      url: 'https://www.stat.berkeley.edu/~stark/SticiGui/Text/experiments.htm',
    },
  },
  {
    id: 'L144',
    title: {
      zh: '给别人讲明白你的发现',
      en: 'Communicating a Discovery',
    },
    hook: {
      zh: '同一图能被讲成“树让所有鸟翻倍”或“本记录B较高”。怎样让听众核查哪一步有证据、哪一步仍未知？',
      en: 'The same chart can become “trees double all birds” or “B is higher in these records”. How can listeners check what is supported and what remains unknown?',
    },
    objectives: [
      {
        zh: '用问题、方法、图、结论、局限与来源组织研究表达。',
        en: 'Organise communication around question, method, chart, conclusion, limitations and sources.',
      },
      {
        zh: '修订英文摘要和科学含义一致的双语图注。',
        en: 'Revise an English abstract and scientifically aligned bilingual caption.',
      },
      {
        zh: '准备3–5分钟讲稿/分镜并按自己语速排练。',
        en: 'Prepare a 3–5 minute script/storyboard and rehearse at your own pace.',
      },
    ],
    prediction: [
      {
        zh: '清楚表达要让数值、单位、结论与局限对应。',
        en: 'Clear communication aligns numbers, units, claims and limitations.',
      },
      {
        zh: '把局限删掉能让科学报告更强。',
        en: 'Removing limitations makes a scientific report stronger.',
      },
      {
        zh: '科学理解必须用流利英语才能证明。',
        en: 'Scientific understanding requires fluent English.',
      },
    ],
    terms: [
      {
        word: {
          zh: '摘要',
          en: 'abstract',
        },
        meaning: {
          zh: '概括问题、方法、主要结果和边界的短文。',
          en: 'A short account of question, methods, main results and scope.',
        },
      },
      {
        word: {
          zh: '图注',
          en: 'caption',
        },
        meaning: {
          zh: '说明图显示什么、单位、条件与必要边界。',
          en: 'Text explaining a figure, units, conditions and needed boundaries.',
        },
      },
      {
        word: {
          zh: '主张',
          en: 'claim',
        },
        meaning: {
          zh: '用证据回答研究问题的陈述。',
          en: 'A statement answering the research question with evidence.',
        },
      },
      {
        word: {
          zh: '证据',
          en: 'evidence',
        },
        meaning: {
          zh: '与主张有关的可核查记录。',
          en: 'Checkable records relevant to a claim.',
        },
      },
      {
        word: {
          zh: '推理',
          en: 'reasoning',
        },
        meaning: {
          zh: '说明证据为什么支持有限主张的逻辑。',
          en: 'Logic connecting evidence to a bounded claim.',
        },
      },
      {
        word: {
          zh: '引用',
          en: 'citation',
        },
        meaning: {
          zh: '指向所用信息原始来源的标记。',
          en: 'A reference directing readers to a source used.',
        },
      },
      {
        word: {
          zh: '分镜',
          en: 'storyboard',
        },
        meaning: {
          zh: '按顺序安排图、讲解与停顿的计划。',
          en: 'A sequence planning visuals, explanation and pauses.',
        },
      },
      {
        word: {
          zh: '修订',
          en: 'revision',
        },
        meaning: {
          zh: '根据证据或反馈改进表达与结论。',
          en: 'Improving communication and claims using evidence or feedback.',
        },
      },
    ],
    questions: [
      {
        id: 'L144-q1',
        skill: 'concept',
        prompt: {
          zh: '图注最需要包括哪项？',
          en: 'What does the caption most need?',
        },
        options: [
          {
            zh: '记录指标、单位、日期、样本与排除说明',
            en: 'Measure, units, dates, samples and exclusions',
          },
          {
            zh: '只有好看的标题',
            en: 'Only an attractive title',
          },
          {
            zh: '未计算的显著星号',
            en: 'Uncomputed significance stars',
          },
        ],
        correct: 0,
        feedback: {
          zh: '图注让读者在不听讲的情况下仍知道图的对象与边界。',
          en: 'A caption lets readers understand what the chart shows and its boundaries without hearing the talk.',
        },
        revisit: {
          zh: '回看可编辑双语图注的5 min与缺失。',
          en: 'Revisit five-minute units and missingness in the editable caption.',
        },
      },
      {
        id: 'L144-q2',
        skill: 'concept',
        prompt: {
          zh: '科学理解和英语应怎样评价？',
          en: 'How should science understanding and English be evaluated?',
        },
        options: [
          {
            zh: '口音不标准就科学不及格',
            en: 'An accent means science failure',
          },
          {
            zh: '推理可任选语言，另提供英文摘要和双语图注支架',
            en: 'Reason in a chosen language, with scaffolds for an English abstract and bilingual caption',
          },
          {
            zh: '只写英文，不需数值',
            en: 'English alone, with no data',
          },
        ],
        correct: 1,
        feedback: {
          zh: '生物推理不被英语流利度锁住；成品仍应有实际的双语科学信息。',
          en: 'English fluency must not gate biological reasoning; the product still needs actual bilingual scientific information.',
        },
        revisit: {
          zh: '回看图底部语言分工和摘要模板。',
          en: 'Revisit the language support and abstract model.',
        },
      },
      {
        id: 'L144-q3',
        skill: 'reasoning',
        prompt: {
          zh: '如何修“Trees double all bird populations”？',
          en: 'How should “Trees double all bird populations” be repaired?',
        },
        options: [
          {
            zh: '只加definitely',
            en: 'Only add definitely',
          },
          {
            zh: '改为本3配对日期记录均值2/4，不能推树量因果或总体',
            en: 'Report means 2/4 across three paired dates, without inferring tree causality or population abundance',
          },
          {
            zh: '删掉所有局限',
            en: 'Remove all limitations',
          },
        ],
        correct: 1,
        feedback: {
          zh: '修订要补对象、数据、单位和推断边界；不是只换一个语气词。',
          en: 'Repair requires organisms, data, units and inference limits, not a single qualifying word.',
        },
        revisit: {
          zh: '比较过强摘要和含证据示范稿。',
          en: 'Compare the overstrong abstract with the evidence-based model.',
        },
      },
      {
        id: 'L144-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'abstract在研究报告里指什么？',
          en: 'What does abstract mean in a research report?',
        },
        options: [
          {
            zh: '装饰图案',
            en: 'A decorative pattern',
          },
          {
            zh: '从来不能改的标题',
            en: 'An unchangeable title',
          },
          {
            zh: '问题、方法、结果与边界的简短概括',
            en: 'A brief account of question, methods, findings and scope',
          },
        ],
        correct: 2,
        feedback: {
          zh: '摘要帮助读者快速判断研究回答了什么，并保留关键局限。',
          en: 'An abstract helps readers identify the answer and its key limits quickly.',
        },
        revisit: {
          zh: '回看英文摘要首句、数值句、局限句。',
          en: 'Revisit the question, numerical and limitation sentences in the abstract.',
        },
      },
    ],
    mission: {
      zh: '提交U36研究方案、数据图和双语结论，衔接《我的生命科学研究》：官方公开生态数据或安全自录观察、英文摘要、双语图注、来源、局限与3–5分钟讲稿/分镜。生物解释语言自选。',
      en: 'Submit the U36 plan, chart and bilingual conclusion for My Biology Investigation: official public ecological data or safe self-recorded observations, English abstract, bilingual caption, sources, limitations and a 3–5 minute script/storyboard. Choose your language for biological explanation.',
    },
    minutes: 40,
    icon: '◈',
    summary: {
      zh: '同一图能被讲成“树让所有鸟翻倍”或“本记录B较高”。怎样让听众核查哪一步有证据、哪一步仍未知？',
      en: 'The same chart can become “trees double all birds” or “B is higher in these records”. How can listeners check what is supported and what remains unknown?',
    },
    reference: {
      title: 'UC Berkeley, Philip Stark: evidence and causal boundaries',
      url: 'https://www.stat.berkeley.edu/~stark/SticiGui/Text/experiments.htm',
    },
  },
];
