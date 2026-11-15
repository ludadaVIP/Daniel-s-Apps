import type { Lesson } from '../schema';
/** Original bilingual S06 pilot; all numerical records are fictional teaching data. */
export const signalingEvolutionLessons: Lesson[] = [
  {
    title: {
      zh: '受体与细胞信号',
      en: 'Receptors and cell signalling',
    },
    hook: {
      zh: '同一信号到达两种细胞，为什么可能只有一种响应？即使两者都有受体呢？',
      en: 'Why might only one of two cells respond to the same signal, even when both have a receptor?',
    },
    objectives: [
      {
        zh: '用受体→传导→响应解释条件性响应。',
        en: 'Explain conditional responses through receptor → relay → response.',
      },
      {
        zh: '用对照区分不能结合与结合后不能传导。',
        en: 'Distinguish failed binding from a failed downstream relay.',
      },
      {
        zh: '用数值证据提出有边界的机制解释。',
        en: 'Use numerical evidence for a qualified mechanism claim.',
      },
    ],
    prediction: [
      {
        zh: '信号必须进入所有细胞才有作用',
        en: 'Signals must enter every cell to work',
      },
      {
        zh: '受体和下游状态共同影响响应',
        en: 'Receptors and downstream conditions both affect responses',
      },
      {
        zh: '只要结合受体就必有完全相同响应',
        en: 'Binding always produces an identical response',
      },
    ],
    terms: [
      {
        word: {
          zh: '信号分子',
          en: 'signalling molecule',
        },
        meaning: {
          zh: '携带细胞间信息、可与受体相互作用的分子。',
          en: 'A molecule carrying information between cells and interacting with a receptor.',
        },
      },
      {
        word: {
          zh: '受体',
          en: 'receptor',
        },
        meaning: {
          zh: '识别并结合合适信号的蛋白质。',
          en: 'A protein that recognises and binds a suitable signal.',
        },
      },
      {
        word: {
          zh: '配体',
          en: 'ligand',
        },
        meaning: {
          zh: '与特定分子结合的分子，此处为受体的结合对象。',
          en: 'A molecule binding another molecule; here the receptor-binding partner.',
        },
      },
      {
        word: {
          zh: '信号传导',
          en: 'signal transduction',
        },
        meaning: {
          zh: '把接收信号转成胞内变化的过程。',
          en: 'Conversion of a received signal into intracellular changes.',
        },
      },
      {
        word: {
          zh: '靶细胞',
          en: 'target cell',
        },
        meaning: {
          zh: '在相应条件下能对信号作出响应的细胞。',
          en: 'A cell able to respond to a signal under appropriate conditions.',
        },
      },
      {
        word: {
          zh: '细胞响应',
          en: 'cellular response',
        },
        meaning: {
          zh: '信号后出现的细胞活动变化。',
          en: 'A change in cellular activity following a signal.',
        },
      },
      {
        word: {
          zh: '对照',
          en: 'control',
        },
        meaning: {
          zh: '帮助比较特定条件效应的参照。',
          en: 'A reference comparison for investigating a condition.',
        },
      },
    ],
    mission: {
      zh: '画一条有条件的接收→传导→响应链，给一个中断位置和能区分它的观测。',
      en: 'Draw a conditional reception → transduction → response chain, mark one interruption and identify an observation that could locate it.',
    },
    id: 'L129',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '膜外金色信号、跨膜受体、胞内传导与响应分区；亮色表示激活，不能把箭头读成信号分子穿膜。',
      en: 'Locate the extracellular gold signal, receptor, internal relay and response. Colour means activation; arrows do not mean that this ligand crosses the membrane.',
    },
    reference: {
      title: 'OpenStax Biology 2e §9.1',
      url: 'https://openstax.org/books/biology-2e/pages/9-1-signaling-molecules-and-cellular-receptors',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '图中信号必须穿膜吗？',
          en: 'Must this signal cross the membrane?',
        },
        options: [
          {
            zh: '不必，表面受体可传递信息',
            en: 'No; a surface receptor can transmit information',
          },
          {
            zh: '必须变成DNA',
            en: 'It must become DNA',
          },
          {
            zh: '必须进入细胞核',
            en: 'It must enter the nucleus',
          },
        ],
        correct: 0,
        feedback: {
          zh: '表面受体能连接胞外结合和胞内变化；不要把箭头当物质穿膜。',
          en: 'Surface receptors link external binding to internal changes; arrows are not ligand transport.',
        },
        revisit: {
          zh: '回看膜两侧与金色信号位置。',
          en: 'Revisit the membrane and gold signal.',
        },
        id: 'L129-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '同受体的两细胞为何响应不同？',
          en: 'Why can two cells with the same receptor respond differently?',
        },
        options: [
          {
            zh: '受体保证全部细胞相同',
            en: 'A receptor guarantees identical cells',
          },
          {
            zh: '下游网络或状态可能不同',
            en: 'Downstream networks or states can differ',
          },
          {
            zh: '信号一定不存在',
            en: 'The signal must be absent',
          },
        ],
        correct: 1,
        feedback: {
          zh: '结合之后还有条件步骤；同受体不等于同下游。',
          en: 'Conditional steps follow binding; the same receptor does not imply identical downstream machinery.',
        },
        revisit: {
          zh: '关闭下游，保留受体再看图。',
          en: 'Keep the receptor and switch off the relay.',
        },
        id: 'L129-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '80/100与78/100结合，60/100与5/100响应，支持什么？',
          en: 'Binding is 80/100 versus 78/100; responses 60/100 versus 5/100. What is supported?',
        },
        options: [
          {
            zh: '已证明全部细胞死亡',
            en: 'All cells are proven dead',
          },
          {
            zh: '乙完全没有受体',
            en: 'B has no receptors',
          },
          {
            zh: '应检验结合后步骤，不能直接定位蛋白',
            en: 'Investigate post-binding steps; no protein is identified yet',
          },
        ],
        correct: 2,
        feedback: {
          zh: '响应差55个百分点但结合接近，支持后续检验，不是最终分子证明。',
          en: 'Responses differ by 55 percentage points despite similar binding; this motivates a test, not a final molecular diagnosis.',
        },
        revisit: {
          zh: '比较结合与响应两个节点。',
          en: 'Compare the binding and response nodes.',
        },
        id: 'L129-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'signal transduction指什么？',
          en: 'What is signal transduction?',
        },
        options: [
          {
            zh: '信号转成胞内变化',
            en: 'Conversion of a signal into internal changes',
          },
          {
            zh: '所有信号进入细胞核',
            en: 'All signals entering the nucleus',
          },
          {
            zh: '细胞复制全部DNA',
            en: 'Copying all cellular DNA',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'transduction强调信息转换，不等于配体运输。',
          en: 'Transduction concerns information conversion, not necessarily ligand transport.',
        },
        revisit: {
          zh: '回看受体后胞内传导节点。',
          en: 'Revisit the internal relay after the receptor.',
        },
        id: 'L129-q4',
      },
    ],
  },
  {
    title: {
      zh: '神经信息传递进阶',
      en: 'Neural communication',
    },
    hook: {
      zh: '强刺激会让每个神经电峰更高，还是让一秒内的峰更多？',
      en: 'Does stronger stimulation make each nerve spike taller, or produce more spikes per second?',
    },
    objectives: [
      {
        zh: '用等幅峰和频率解释刺激强度编码。',
        en: 'Explain intensity coding using equal-amplitude spikes and frequency.',
      },
      {
        zh: '区分轴突膜电位传播与化学突触传递。',
        en: 'Distinguish propagation along an axon from chemical synaptic transmission.',
      },
      {
        zh: '用ms、mV和Hz读图并限定模型结论。',
        en: 'Read ms, mV and Hz and limit claims from the model.',
      },
    ],
    prediction: [
      {
        zh: '强刺激常增加频率或募集更多神经元',
        en: 'Stronger stimuli often increase frequency or recruit neurons',
      },
      {
        zh: '强刺激必使单个峰无限变高',
        en: 'Stronger stimuli make each spike indefinitely taller',
      },
      {
        zh: '递质沿整个轴突高速流动',
        en: 'Transmitter flows down the whole axon',
      },
    ],
    terms: [
      {
        word: {
          zh: '动作电位',
          en: 'action potential',
        },
        meaning: {
          zh: '达阈值后产生的可再生膜电位事件。',
          en: 'A regenerative membrane-voltage event after threshold.',
        },
      },
      {
        word: {
          zh: '阈值',
          en: 'threshold',
        },
        meaning: {
          zh: '触发再生电位的关键膜状态条件。',
          en: 'A membrane condition for triggering a regenerative event.',
        },
      },
      {
        word: {
          zh: '频率',
          en: 'frequency',
        },
        meaning: {
          zh: '单位时间的重复次数，此处以Hz表示。',
          en: 'Events per unit time, here expressed in Hz.',
        },
      },
      {
        word: {
          zh: '轴突',
          en: 'axon',
        },
        meaning: {
          zh: '沿其膜传播动作电位的神经元突起。',
          en: 'A neuronal extension along whose membrane spikes propagate.',
        },
      },
      {
        word: {
          zh: '突触',
          en: 'synapse',
        },
        meaning: {
          zh: '细胞间传递信息的连接。',
          en: 'A junction for communication between cells.',
        },
      },
      {
        word: {
          zh: '神经递质',
          en: 'neurotransmitter',
        },
        meaning: {
          zh: '化学突触中释放并作用于受体的信号。',
          en: 'A signal released at chemical synapses to act on receptors.',
        },
      },
      {
        word: {
          zh: '不应期',
          en: 'refractory period',
        },
        meaning: {
          zh: '一次电位后短暂不易再触发的时期。',
          en: 'A short period of reduced ability to trigger another spike.',
        },
      },
    ],
    mission: {
      zh: '画“轴突电位→末端释放→突触后受体”三格，用一个带单位的频率计算说明信息。',
      en: 'Draw axon voltage → terminal release → postsynaptic receptor, and include one frequency calculation with units.',
    },
    id: 'L130',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '比较−70 mV基线、+30 mV峰值和100 ms内峰数；下方流程框展示轴突电活动与突触化学传递的区别。',
      en: 'Compare the −70 mV baseline, +30 mV peaks and spike counts in 100 ms; the separate process boxes distinguish axonal electrical activity from chemical synaptic transmission.',
    },
    reference: {
      title: 'OpenStax Biology 2e §35.2',
      url: 'https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '强弱刺激图最关键的差别？',
          en: 'What is the key difference between the two traces?',
        },
        options: [
          {
            zh: '强刺激峰高翻倍',
            en: 'Stronger stimulation doubles spike height',
          },
          {
            zh: '峰数/频率增加，峰值相同',
            en: 'More spikes/higher frequency with the same peak',
          },
          {
            zh: '强刺激没有阈值',
            en: 'Strong stimulation removes threshold',
          },
        ],
        correct: 1,
        feedback: {
          zh: '图中两者峰值均+30 mV；强度可通过频率与募集编码。',
          en: 'Both peak at +30 mV; intensity can be coded by frequency and recruitment.',
        },
        revisit: {
          zh: '对齐两条波形的纵轴和100 ms窗口。',
          en: 'Align the voltage axes and 100 ms windows.',
        },
        id: 'L130-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '轴突内主要传播什么？',
          en: 'What mainly propagates along the axon?',
        },
        options: [
          {
            zh: '递质流过整个轴突',
            en: 'Transmitter flowing down the whole axon',
          },
          {
            zh: '抗体',
            en: 'Antibodies',
          },
          {
            zh: '相邻膜段再生的电位变化',
            en: 'Regenerated voltage changes in adjacent membrane',
          },
        ],
        correct: 2,
        feedback: {
          zh: '递质在化学突触处释放；轴突传播靠膜电活动再生。',
          en: 'Transmitter is released at a chemical synapse; axonal propagation regenerates membrane activity.',
        },
        revisit: {
          zh: '回看流程第3与第4步。',
          en: 'Revisit stages 3 and 4.',
        },
        id: 'L130-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '100 ms内5峰相当于？',
          en: 'Five spikes per 100 ms correspond to?',
        },
        options: [
          {
            zh: '50 Hz',
            en: '50 Hz',
          },
          {
            zh: '5 Hz',
            en: '5 Hz',
          },
          {
            zh: '500 mV',
            en: '500 mV',
          },
        ],
        correct: 0,
        feedback: {
          zh: '100 ms=0.1 s；5/0.1=50次/s。频率与电压单位不同。',
          en: '100 ms = 0.1 s; 5/0.1 = 50 events/s. Frequency and voltage use different units.',
        },
        revisit: {
          zh: '核对图上窗口和峰计数。',
          en: 'Check the window and spike count.',
        },
        id: 'L130-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'refractory period是什么？',
          en: 'What is a refractory period?',
        },
        options: [
          {
            zh: '任何刺激都会加倍峰高',
            en: 'A time when any input doubles peak height',
          },
          {
            zh: '一次峰后短暂不易再次触发的时期',
            en: 'A brief period of reduced ability to fire again',
          },
          {
            zh: '递质沿轴突流动时间',
            en: 'Transmitter travel time along the axon',
          },
        ],
        correct: 1,
        feedback: {
          zh: '通道恢复等过程使紧接着的再触发受限制。',
          en: 'Channel recovery and related processes restrict immediately repeated firing.',
        },
        revisit: {
          zh: '回看Explain的不应期段。',
          en: 'Revisit the refractory-period paragraph.',
        },
        id: 'L130-q4',
      },
    ],
  },
  {
    title: {
      zh: '负反馈与激素调节',
      en: 'Negative feedback and hormones',
    },
    hook: {
      zh: '为什么能减小偏差的反馈回路，仍可能慢慢回稳或暂时越过目标？',
      en: 'Why can a corrective feedback loop return slowly or temporarily pass its target?',
    },
    objectives: [
      {
        zh: '追踪刺激、感受、控制、效应与反馈。',
        en: 'Trace stimulus, sensing, control, effectors and feedback.',
      },
      {
        zh: '比较增益和延迟如何改变模型轨迹。',
        en: 'Compare how gain and delay change a model trajectory.',
      },
      {
        zh: '用胰岛素或ADH举例，区分机制与人体预测。',
        en: 'Use insulin or ADH to distinguish mechanisms from human predictions.',
      },
    ],
    prediction: [
      {
        zh: '负反馈总是瞬间精确回到目标',
        en: 'Negative feedback instantly returns exactly to target',
      },
      {
        zh: '延迟和响应强度可改变回稳轨迹',
        en: 'Delay and response strength can alter the return trajectory',
      },
      {
        zh: '负反馈只能让所有变量都下降',
        en: 'Negative feedback makes every variable decrease',
      },
    ],
    terms: [
      {
        word: {
          zh: '稳态',
          en: 'homeostasis',
        },
        meaning: {
          zh: '通过调节使内部条件保持在可维持的范围。',
          en: 'Regulation maintaining internal conditions within workable ranges.',
        },
      },
      {
        word: {
          zh: '负反馈',
          en: 'negative feedback',
        },
        meaning: {
          zh: '响应削弱最初偏差或刺激的回路。',
          en: 'A loop whose response reduces the initial deviation or stimulus.',
        },
      },
      {
        word: {
          zh: '效应器',
          en: 'effector',
        },
        meaning: {
          zh: '执行调节响应的细胞或器官。',
          en: 'A cell or organ carrying out a corrective response.',
        },
      },
      {
        word: {
          zh: '增益',
          en: 'gain',
        },
        meaning: {
          zh: '本模型中每步修正偏差的比例参数。',
          en: 'The model parameter controlling correction per step.',
        },
      },
      {
        word: {
          zh: '延迟',
          en: 'delay',
        },
        meaning: {
          zh: '感知与效应之间的时间间隔。',
          en: 'A lag between sensing and the resulting effect.',
        },
      },
      {
        word: {
          zh: '胰岛素',
          en: 'insulin',
        },
        meaning: {
          zh: '胰腺分泌、参与降低血糖的激素。',
          en: 'A pancreatic hormone participating in lowering blood glucose.',
        },
      },
      {
        word: {
          zh: '抗利尿激素',
          en: 'ADH',
        },
        meaning: {
          zh: '参与增加肾水重吸收的激素。',
          en: 'A hormone involved in increasing kidney water reabsorption.',
        },
      },
    ],
    mission: {
      zh: '给胰岛素或ADH画闭环，标明原刺激、效应和返回箭头；再改变一个连接，写有条件预测。',
      en: 'Draw a closed insulin or ADH loop, identifying stimulus, effect and returning arrow. Change one connection and write a conditional prediction.',
    },
    id: 'L131',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '纵轴是与目标的偏差、不是激素浓度；虚线为目标，完整数据在表中。',
      en: 'The vertical axis is deviation from target, not hormone concentration. The dashed line marks the target; the table gives complete data.',
    },
    reference: {
      title: 'OpenStax Biology 2e §37.3',
      url: 'https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '负反馈的“负”表示？',
          en: 'What does “negative” mean in negative feedback?',
        },
        options: [
          {
            zh: '响应削弱原偏差',
            en: 'The response reduces the original deviation',
          },
          {
            zh: '所有量永远下降',
            en: 'Every quantity always falls',
          },
          {
            zh: '激素一定有害',
            en: 'The hormone is harmful',
          },
        ],
        correct: 0,
        feedback: {
          zh: '方向是反向抵消；偏低变量也可被提升。',
          en: 'The response opposes deviation; a low variable can be raised.',
        },
        revisit: {
          zh: '回看目标线与偏差方向。',
          en: 'Revisit the target and deviation direction.',
        },
        id: 'L131-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '失水后ADH增多的基本效应？',
          en: 'What is a basic effect of increased ADH after water loss?',
        },
        options: [
          {
            zh: '停止所有肾功能',
            en: 'Stop all kidney function',
          },
          {
            zh: '增加肾水重吸收',
            en: 'Increase kidney water reabsorption',
          },
          {
            zh: '直接制造新水分子',
            en: 'Create new water molecules',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'ADH改变水重吸收，保留已有水而非制造水。',
          en: 'ADH changes reabsorption, retaining existing water rather than making it.',
        },
        revisit: {
          zh: '回看静态ADH闭环说明。',
          en: 'Revisit the static ADH loop.',
        },
        id: 'L131-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: 'x=10且每步无延迟修正30%，两步后？',
          en: 'Starting x=10 with 30% correction per step and no lag, after two steps?',
        },
        options: [
          {
            zh: '4',
            en: '4',
          },
          {
            zh: '0',
            en: '0',
          },
          {
            zh: '4.9任意单位',
            en: '4.9 arbitrary units',
          },
        ],
        correct: 2,
        feedback: {
          zh: '10→7→4.9；第二步修正当前7的30%，不是再减3。',
          en: '10→7→4.9; the second correction is 30% of seven, not another three.',
        },
        revisit: {
          zh: '查完整表第0–2步。',
          en: 'Check table steps 0–2.',
        },
        id: 'L131-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'effector指？',
          en: 'What is an effector?',
        },
        options: [
          {
            zh: '执行响应的细胞或器官',
            en: 'A cell or organ carrying out a response',
          },
          {
            zh: '任意外部刺激',
            en: 'Any external stimulus',
          },
          {
            zh: '图上时间单位',
            en: 'The graph time unit',
          },
        ],
        correct: 0,
        feedback: {
          zh: '效应器执行改变变量的动作；感受装置负责检测。',
          en: 'An effector acts to change the variable; a sensor detects.',
        },
        revisit: {
          zh: '回看闭环中响应一段。',
          en: 'Revisit the response segment of the loop.',
        },
        id: 'L131-q4',
      },
    ],
  },
  {
    title: {
      zh: '免疫系统的协同',
      en: 'Immune system interactions',
    },
    hook: {
      zh: '抗体能结合游离目标，谁处理感染细胞？少一条协作分支会怎样？',
      en: 'Antibodies bind extracellular targets. Who deals with infected cells, and what if a cooperating branch is missing?',
    },
    objectives: [
      {
        zh: '连接APC、辅助T、B/浆细胞和CD8的分工。',
        en: 'Connect the roles of APCs, helper T, B/plasma and CD8 cells.',
      },
      {
        zh: '用条件移除比较支持协作机制。',
        en: 'Use conditional removal comparisons to investigate cooperation.',
      },
      {
        zh: '区分抗体、细胞杀伤、记忆与感染结局。',
        en: 'Distinguish antibody, cellular killing, memory and infection outcome.',
      },
    ],
    prediction: [
      {
        zh: '抗体包办所有免疫作用',
        en: 'Antibodies carry out every immune function',
      },
      {
        zh: '记忆保证今后永不感染',
        en: 'Memory guarantees no future infection',
      },
      {
        zh: '不同细胞协作但效应对象不同',
        en: 'Cells cooperate while acting on different targets',
      },
    ],
    terms: [
      {
        word: {
          zh: '抗原呈递细胞',
          en: 'antigen-presenting cell',
        },
        meaning: {
          zh: '处理并呈递抗原信息以帮助T细胞激活的细胞。',
          en: 'A cell that processes and presents antigen information to help activate T cells.',
        },
      },
      {
        word: {
          zh: '辅助T细胞',
          en: 'helper T cell',
        },
        meaning: {
          zh: '通过信号帮助协调适应性反应的T细胞。',
          en: 'A T cell helping coordinate adaptive responses through signals.',
        },
      },
      {
        word: {
          zh: 'B细胞',
          en: 'B cell',
        },
        meaning: {
          zh: '可在适当激活后形成浆细胞和记忆细胞的淋巴细胞。',
          en: 'A lymphocyte that can form plasma and memory cells after suitable activation.',
        },
      },
      {
        word: {
          zh: '浆细胞',
          en: 'plasma cell',
        },
        meaning: {
          zh: '分泌抗体的分化B细胞。',
          en: 'A differentiated B cell that secretes antibody.',
        },
      },
      {
        word: {
          zh: 'CD8效应细胞',
          en: 'CD8 effector cell',
        },
        meaning: {
          zh: '能识别并杀伤某些感染细胞的T细胞。',
          en: 'A T cell capable of recognising and killing certain infected cells.',
        },
      },
      {
        word: {
          zh: '抗体',
          en: 'antibody',
        },
        meaning: {
          zh: '结合特定抗原的蛋白质，可帮助中和或标记。',
          en: 'An antigen-binding protein that can help neutralise or tag targets.',
        },
      },
      {
        word: {
          zh: '免疫记忆',
          en: 'immune memory',
        },
        meaning: {
          zh: '使后续特异响应不同的持久细胞状态或细胞群。',
          en: 'Persistent cellular states or populations changing later specific responses.',
        },
      },
    ],
    mission: {
      zh: '画两条协作分支，并用80/78单位与60/100、5/100说明为什么一种指标不能代表全部防御。',
      en: 'Draw both cooperating branches and use 80/78 units and 60/100 versus 5/100 to explain why one index cannot represent all defence.',
    },
    id: 'L132',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '沿上方抗体分支和下方感染细胞杀伤分支走一遍；虚线连接是协调/呈递，不是抗体流向CD8。',
      en: 'Trace the upper antibody branch and lower infected-cell-killing branch. Dashed connections show coordination/presentation, not antibody flowing into CD8 cells.',
    },
    reference: {
      title: 'OpenStax Biology 2e §42.2',
      url: 'https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '浆细胞主要做什么？',
          en: 'What is a main plasma-cell action?',
        },
        options: [
          {
            zh: '把T细胞变成病毒',
            en: 'Turn T cells into viruses',
          },
          {
            zh: '分泌抗体',
            en: 'Secrete antibodies',
          },
          {
            zh: '自己变成抗原呈递分子',
            en: 'Become antigen-presentation molecules',
          },
        ],
        correct: 1,
        feedback: {
          zh: '浆细胞是B细胞分化后的效应细胞，分泌抗体而不是抗体本身分裂。',
          en: 'Plasma cells are differentiated B effectors; they secrete antibody. Antibodies themselves do not divide.',
        },
        revisit: {
          zh: '回看B→浆细胞→抗体分支。',
          en: 'Revisit B → plasma cell → antibody.',
        },
        id: 'L132-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '抗体与CD8效应细胞的分工？',
          en: 'How do antibodies and CD8 effectors differ?',
        },
        options: [
          {
            zh: '两者都直接吞噬全部目标',
            en: 'Both engulf every target',
          },
          {
            zh: '抗体杀死所有感染细胞',
            en: 'Antibodies kill every infected cell',
          },
          {
            zh: '抗体结合抗原，CD8可杀伤感染细胞',
            en: 'Antibodies bind antigen; CD8 can kill infected cells',
          },
        ],
        correct: 2,
        feedback: {
          zh: '识别结合和细胞杀伤是不同效应；其他免疫成分也参与。',
          en: 'Binding and infected-cell killing are different effects, with other immune components also participating.',
        },
        revisit: {
          zh: '比较图的上方与下方终点。',
          en: 'Compare the upper and lower endpoints.',
        },
        id: 'L132-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '去掉已有CD8，抗体80→78单位，杀伤60/100→5/100，说明？',
          en: 'Removing available CD8 changes antibody 80→78 units and killing 60/100→5/100. What follows?',
        },
        options: [
          {
            zh: '这两种效应在本条件可分开变化',
            en: 'These effects can change separately under these conditions',
          },
          {
            zh: '人体感染率一定为5%',
            en: 'Human infection risk must be 5%',
          },
          {
            zh: '抗体负责全部杀伤',
            en: 'Antibody supplies all killing',
          },
        ],
        correct: 0,
        feedback: {
          zh: '相同分母下杀伤差55个百分点；体外指标不能直接转成人体风险。',
          en: 'Killing differs by 55 percentage points with matched denominators; culture measures are not human risk.',
        },
        revisit: {
          zh: '回看上下两条分支及Explain记录。',
          en: 'Revisit both branches and the fictional records.',
        },
        id: 'L132-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'antigen-presenting cell的作用？',
          en: 'What does an antigen-presenting cell do?',
        },
        options: [
          {
            zh: '制造所有免疫记忆',
            en: 'Manufacture all immune memory',
          },
          {
            zh: '处理并呈递抗原信息',
            en: 'Process and present antigen information',
          },
          {
            zh: '把抗体变成细菌',
            en: 'Turn antibodies into bacteria',
          },
        ],
        correct: 1,
        feedback: {
          zh: '呈递连接识别与T细胞激活，仍需要合适其他信号。',
          en: 'Presentation links recognition to T-cell activation alongside appropriate additional signals.',
        },
        revisit: {
          zh: '回看最左APC节点。',
          en: 'Revisit the leftmost APC node.',
        },
        id: 'L132-q4',
      },
    ],
  },
  {
    title: {
      zh: '等位基因频率与种群',
      en: 'Allele frequencies',
    },
    hook: {
      zh: '40%的植株是Aa，能直接说A占种群基因的40%吗？',
      en: 'If 40% of plants are Aa, does A make up 40% of the allele copies?',
    },
    objectives: [
      {
        zh: '从二倍体基因型计数求等位基因频率。',
        en: 'Calculate allele frequencies from diploid genotype counts.',
      },
      {
        zh: '区分个体比例、拷贝频率与抽样范围。',
        en: 'Distinguish organism fractions, allele-copy frequencies and sampling scope.',
      },
      {
        zh: '在明确假设下使用可选Hardy–Weinberg基准。',
        en: 'Use an optional Hardy–Weinberg benchmark under explicit assumptions.',
      },
    ],
    prediction: [
      {
        zh: 'A频率只等于AA比例',
        en: 'A frequency equals the AA fraction alone',
      },
      {
        zh: '每个Aa也贡献一个A拷贝',
        en: 'Each Aa contributes one A copy too',
      },
      {
        zh: '每个样本都必有p²、2pq、q²比例',
        en: 'Every sample must have p², 2pq and q² genotype proportions',
      },
    ],
    terms: [
      {
        word: {
          zh: '等位基因',
          en: 'allele',
        },
        meaning: {
          zh: '同一基因位置的不同版本。',
          en: 'A version at a gene locus.',
        },
      },
      {
        word: {
          zh: '基因型',
          en: 'genotype',
        },
        meaning: {
          zh: '本课指一个位点上的等位基因组合。',
          en: 'Here, the allele combination at one locus.',
        },
      },
      {
        word: {
          zh: '基因库',
          en: 'gene pool',
        },
        meaning: {
          zh: '指定种群中可传递的遗传变异总集合。',
          en: 'The transmissible genetic variation in a specified population.',
        },
      },
      {
        word: {
          zh: '等位基因频率',
          en: 'allele frequency',
        },
        meaning: {
          zh: '某等位版本占该位点全部拷贝的比例。',
          en: 'The fraction of locus copies that are a particular allele.',
        },
      },
      {
        word: {
          zh: '二倍体',
          en: 'diploid',
        },
        meaning: {
          zh: '每个相应常染色体位点通常有两个拷贝。',
          en: 'Usually having two copies of an autosomal locus.',
        },
      },
      {
        word: {
          zh: '杂合子',
          en: 'heterozygote',
        },
        meaning: {
          zh: '某位点有两个不同等位基因的个体。',
          en: 'An organism with two different alleles at a locus.',
        },
      },
      {
        word: {
          zh: '随机交配',
          en: 'random mating',
        },
        meaning: {
          zh: '相对研究位点的基因型不影响配偶组合。',
          en: 'Mating independent of genotype at the studied locus.',
        },
      },
    ],
    mission: {
      zh: '为一份样本写两个分母，分别报Aa个体比例与A拷贝频率，并写一条不能由样本推出的结论。',
      en: 'Report an Aa organism fraction and an A-copy frequency with their different denominators, then state one unsupported conclusion.',
    },
    id: 'L133',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '三个基因型框下面各有两个拷贝；绿色为A、金色为a，先数拷贝再算比例。',
      en: 'Each genotype has two allele-copy symbols: green A and gold a. Count copies before calculating fractions.',
    },
    reference: {
      title: 'OpenStax Biology 2e §19.1',
      url: 'https://openstax.org/books/biology-2e/pages/19-1-population-evolution',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: 'Aa植株贡献几个A拷贝？',
          en: 'How many A copies does an Aa plant contribute?',
        },
        options: [
          {
            zh: '0',
            en: '0',
          },
          {
            zh: '2',
            en: '2',
          },
          {
            zh: '1',
            en: '1',
          },
        ],
        correct: 2,
        feedback: {
          zh: '每个二倍体该位点有两个拷贝；Aa各一份A、a。',
          en: 'This diploid locus has two copies; Aa has one of each.',
        },
        revisit: {
          zh: '回看Aa下两个不同颜色圆。',
          en: 'Revisit the two different circles under Aa.',
        },
        id: 'L133-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '空样本的A频率是？',
          en: 'What is A frequency in an empty sample?',
        },
        options: [
          {
            zh: '未定义',
            en: 'Undefined',
          },
          {
            zh: '0，证明A消失',
            en: 'Zero, proving loss of A',
          },
          {
            zh: '1',
            en: 'One',
          },
        ],
        correct: 0,
        feedback: {
          zh: '没有分母不能计算；非空全aa才是p=0。',
          en: 'No denominator means no frequency; a nonempty all-aa sample has p=0.',
        },
        revisit: {
          zh: '把三个滑块都调0，再与仅aa>0比较。',
          en: 'Set all sliders to zero, then compare with aa>0 only.',
        },
        id: 'L133-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '20 AA、40 Aa、40 aa时p(A)？',
          en: 'For 20 AA, 40 Aa and 40 aa, what is p(A)?',
        },
        options: [
          {
            zh: '20/100=0.2',
            en: '20/100=0.2',
          },
          {
            zh: '(2×20+40)/200=0.4',
            en: '(2×20+40)/200=0.4',
          },
          {
            zh: '80/100=0.8',
            en: '80/100=0.8',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'A有80拷贝，总共200；不能把拷贝数除以植株数。',
          en: 'There are 80 A copies out of 200; do not divide copies by organisms.',
        },
        revisit: {
          zh: '核对拷贝总数与N。',
          en: 'Check the total copies and N.',
        },
        id: 'L133-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'heterozygote指？',
          en: 'What is a heterozygote?',
        },
        options: [
          {
            zh: '某等位版本的频率',
            en: 'An allele frequency',
          },
          {
            zh: '总是有两个相同等位',
            en: 'Always two identical alleles',
          },
          {
            zh: '某位点具有两个不同等位基因的个体',
            en: 'An organism with two different alleles at a locus',
          },
        ],
        correct: 2,
        feedback: {
          zh: '本课Aa是杂合子；频率是种群统计而非个体名称。',
          en: 'Aa is heterozygous here; frequency is a population statistic, not an organism label.',
        },
        revisit: {
          zh: '回看Aa框。',
          en: 'Revisit the Aa box.',
        },
        id: 'L133-q4',
      },
    ],
  },
  {
    title: {
      zh: '自然选择、漂变与迁移',
      en: 'Selection, drift and gene flow',
    },
    hook: {
      zh: 'A从0.4升到0.6，能只看这两个数就断定它更有适应优势吗？',
      en: 'If A rises from 0.4 to 0.6, do those two values prove an adaptive advantage?',
    },
    objectives: [
      {
        zh: '用机制区分选择、漂变和基因流。',
        en: 'Distinguish selection, drift and gene flow by mechanism.',
      },
      {
        zh: '以随机种子复验并比较不同N的波动。',
        en: 'Reproduce seeded runs and compare fluctuations across N.',
      },
      {
        zh: '用加权分母计算迁入并限定轨迹证据。',
        en: 'Calculate immigration with a weighted denominator and qualify trajectory evidence.',
      },
    ],
    prediction: [
      {
        zh: '频率升高一定证明自然选择',
        en: 'Rising frequency necessarily proves selection',
      },
      {
        zh: '漂变只在小种群发生',
        en: 'Drift occurs only in small populations',
      },
      {
        zh: '多种过程可同时改变频率',
        en: 'Several processes can alter frequency together',
      },
    ],
    terms: [
      {
        word: {
          zh: '自然选择',
          en: 'natural selection',
        },
        meaning: {
          zh: '可遗传差异造成相对繁殖贡献不同。',
          en: 'Heritable differences causing unequal relative reproductive contributions.',
        },
      },
      {
        word: {
          zh: '适合度',
          en: 'fitness',
        },
        meaning: {
          zh: '特定条件下对后代基因库的相对贡献。',
          en: 'Relative contribution to later gene pools under specified conditions.',
        },
      },
      {
        word: {
          zh: '遗传漂变',
          en: 'genetic drift',
        },
        meaning: {
          zh: '有限群体随机抽样引起的频率变化。',
          en: 'Frequency changes caused by random sampling in finite populations.',
        },
      },
      {
        word: {
          zh: '基因流',
          en: 'gene flow',
        },
        meaning: {
          zh: '迁入并进入繁殖群体等过程造成的等位基因流动。',
          en: 'Movement of alleles through migration into breeding populations and related processes.',
        },
      },
      {
        word: {
          zh: '随机种子',
          en: 'random seed',
        },
        meaning: {
          zh: '使同一随机模型能够复验的初始编码。',
          en: 'An initial code enabling a random model run to be reproduced.',
        },
      },
      {
        word: {
          zh: '固定',
          en: 'fixation',
        },
        meaning: {
          zh: '某等位基因频率达到1的状态。',
          en: 'A state in which an allele frequency reaches one.',
        },
      },
      {
        word: {
          zh: '瓶颈',
          en: 'bottleneck',
        },
        meaning: {
          zh: '群体数量大幅减少、随机遗传取样可增强的事件。',
          en: 'A sharp population reduction that can intensify genetic sampling effects.',
        },
      },
    ],
    mission: {
      zh: '对比选择单独与漂变单独两情景，记录N、种子、起终频率；提出区分两者还需要的证据。',
      en: 'Compare selection-only and drift-only scenarios, recording N, seed and starting/ending frequencies. Propose evidence needed to distinguish their mechanisms.',
    },
    id: 'L134',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '图示A频率0–1和世代；每次只显示到当前代，完整轨迹在静态表中。',
      en: 'Inspect A frequency from 0–1 across generations. The plot reveals the current generation; the static table contains the full trajectory.',
    },
    reference: {
      title: 'OpenStax Biology 2e §19.2',
      url: 'https://openstax.org/books/biology-2e/pages/19-2-population-genetics',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '选择与漂变最核心区别？',
          en: 'What distinguishes selection from drift?',
        },
        options: [
          {
            zh: '选择涉及遗传差异的繁殖贡献，漂变是随机取样',
            en: 'Selection involves unequal reproductive contributions; drift is random sampling',
          },
          {
            zh: '漂变总有明确目的',
            en: 'Drift always has a purpose',
          },
          {
            zh: '选择是个体努力改变等位基因',
            en: 'Selection is effort changing alleles',
          },
        ],
        correct: 0,
        feedback: {
          zh: '选择按适合度加权；漂变不按优劣挑选。二者可共存。',
          en: 'Selection weights relative fitness; drift samples without judging value. They can coexist.',
        },
        revisit: {
          zh: '分别关闭选择或漂变比较说明。',
          en: 'Compare the selection and drift controls separately.',
        },
        id: 'L134-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: 'A=0、无迁入/突变时，漂变能创造A吗？',
          en: 'At p(A)=0 with no immigration/mutation, can drift create A?',
        },
        options: [
          {
            zh: '能，因为群体需要',
            en: 'Yes, because the population needs it',
          },
          {
            zh: '不能，抽样只能取已有拷贝',
            en: 'No; sampling uses available copies',
          },
          {
            zh: '一定每代创造一半',
            en: 'It creates half the copies every generation',
          },
        ],
        correct: 1,
        feedback: {
          zh: '0频率是无来源模型的边界；迁入或突变需明确另加。',
          en: 'Zero is a boundary when no source exists; migration or mutation must be specified.',
        },
        revisit: {
          zh: '回看频率范围与无突变说明。',
          en: 'Revisit the frequency bounds and no-mutation assumption.',
        },
        id: 'L134-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '20株p=.4加10株p=.8，混合频率？',
          en: '20 plants at p=.4 plus 10 at p=.8: pooled frequency?',
        },
        options: [
          {
            zh: '.6，直接取平均',
            en: '.6, an unweighted average',
          },
          {
            zh: '1.2',
            en: '1.2',
          },
          {
            zh: '16/30≈.533',
            en: '16/30≈.533',
          },
        ],
        correct: 2,
        feedback: {
          zh: '分母N+M=30，权重不同；二倍体因子2相消。',
          en: 'The denominator is N+M=30 with unequal weights; the diploid factor two cancels.',
        },
        revisit: {
          zh: '回看迁入开关和加权公式。',
          en: 'Revisit the migration control and weighted formula.',
        },
        id: 'L134-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'fitness在这里指？',
          en: 'What does fitness mean here?',
        },
        options: [
          {
            zh: '特定条件下相对繁殖贡献',
            en: 'Relative reproductive contribution under specified conditions',
          },
          {
            zh: '努力程度',
            en: 'Effort',
          },
          {
            zh: '任何环境都更高等',
            en: 'Being superior in every environment',
          },
        ],
        correct: 0,
        feedback: {
          zh: '适合度依赖环境和后代贡献，不是意志或先进程度。',
          en: 'Fitness depends on environment and offspring contribution, not willpower or progress.',
        },
        revisit: {
          zh: '回看AA/Aa/aa的权重。',
          en: 'Revisit the AA/Aa/aa weights.',
        },
        id: 'L134-q4',
      },
    ],
  },
  {
    title: {
      zh: '系统发育与共同祖先',
      en: 'Phylogeny and common ancestry',
    },
    hook: {
      zh: '把一棵树的两条枝上下交换，A与B会突然不再是近亲吗？',
      en: 'If two branches swap vertical positions, do A and B stop being close relatives?',
    },
    objectives: [
      {
        zh: '按共同祖先和clade而非上下顺序读树。',
        en: 'Read trees by common ancestors and clades, not vertical order.',
      },
      {
        zh: '说明旋转节点为何不改变拓扑。',
        en: 'Explain why rotating a node preserves topology.',
      },
      {
        zh: '用共享衍生特征和分子证据评价有边界假说。',
        en: 'Evaluate a qualified hypothesis using shared derived and molecular characters.',
      },
    ],
    prediction: [
      {
        zh: '上下越高代表越先进',
        en: 'A higher tip is more advanced',
      },
      {
        zh: '旋转会改变所有共同祖先',
        en: 'Rotation changes all common ancestors',
      },
      {
        zh: '旋转可保留同一祖先与全部后代组合',
        en: 'Rotation can retain an ancestor and all its descendants',
      },
    ],
    terms: [
      {
        word: {
          zh: '系统发育',
          en: 'phylogeny',
        },
        meaning: {
          zh: '类群演化关系与历史。',
          en: 'Evolutionary relationships and history among taxa.',
        },
      },
      {
        word: {
          zh: '共同祖先',
          en: 'common ancestor',
        },
        meaning: {
          zh: '两个或更多后代谱系共有的祖先。',
          en: 'An ancestor shared by two or more descendant lineages.',
        },
      },
      {
        word: {
          zh: '演化支',
          en: 'clade',
        },
        meaning: {
          zh: '一个共同祖先及其全部后代。',
          en: 'A common ancestor and all its descendants.',
        },
      },
      {
        word: {
          zh: '共享衍生特征',
          en: 'shared derived character',
        },
        meaning: {
          zh: '相对祖先状态新出现并由一组后代共享的特征。',
          en: 'A derived character shared by descendants relative to an ancestral state.',
        },
      },
      {
        word: {
          zh: '趋同进化',
          en: 'convergent evolution',
        },
        meaning: {
          zh: '不同谱系独立演化出相似特征。',
          en: 'Independent evolution of similar features in different lineages.',
        },
      },
      {
        word: {
          zh: '同源',
          en: 'homology',
        },
        meaning: {
          zh: '由于共同祖先而有的对应关系。',
          en: 'Correspondence due to shared ancestry.',
        },
      },
      {
        word: {
          zh: '拓扑',
          en: 'topology',
        },
        meaning: {
          zh: '树中分支连接的模式，不是纸上朝向。',
          en: 'The branching connection pattern, not its drawing orientation.',
        },
      },
    ],
    mission: {
      zh: '用旋转前后两棵树列相同clade，再给一条支持分组的证据与一条替代解释。',
      en: 'List matching clades before and after rotation, then give supporting evidence and one alternative interpretation.',
    },
    id: 'L135',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '四个虚构类群A–D，根部共同祖先分成AB与CD；无时间或变化量标度。',
      en: 'Four fictional taxa A–D split into AB and CD from a common ancestor. No time or amount-of-change scale is supplied.',
    },
    reference: {
      title: 'OpenStax Biology 2e §20.2',
      url: 'https://openstax.org/books/biology-2e/pages/20-2-determining-evolutionary-relationships',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '旋转根部之后AB的关系？',
          en: 'After rotating the root branches, what happens to AB?',
        },
        options: [
          {
            zh: '不再共享祖先',
            en: 'They no longer share an ancestor',
          },
          {
            zh: '亲缘关系不变',
            en: 'Their relationship is unchanged',
          },
          {
            zh: 'A变成B的直接祖先',
            en: 'A becomes the direct ancestor of B',
          },
        ],
        correct: 1,
        feedback: {
          zh: '旋转改图形方向，不改共同祖先下的成员。',
          en: 'Rotation changes layout, not descendant membership.',
        },
        revisit: {
          zh: '旋转并追踪AB节点。',
          en: 'Rotate and trace the AB node.',
        },
        id: 'L135-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '无标度树可以读出什么？',
          en: 'What can an unscaled tree establish?',
        },
        options: [
          {
            zh: '每条枝确切年龄',
            en: 'Exact branch ages',
          },
          {
            zh: '上方物种更先进',
            en: 'Higher species are more advanced',
          },
          {
            zh: '图示分支连接与共同祖先关系',
            en: 'The depicted branching and common-ancestry relationships',
          },
        ],
        correct: 2,
        feedback: {
          zh: '时间和变化量要额外标度，拓扑本身不提供年龄。',
          en: 'Time or change requires a stated scale; topology alone gives no ages.',
        },
        revisit: {
          zh: '回看无标度提示和节点。',
          en: 'Revisit the no-scale note and nodes.',
        },
        id: 'L135-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '一个同源位点G/G/T/T支持AB分组，最合理结论？',
          en: 'A homologous site G/G/T/T supports grouping AB. Best conclusion?',
        },
        options: [
          {
            zh: '提供有限支持，需更多独立证据',
            en: 'Limited support; more independent evidence is needed',
          },
          {
            zh: '已绝对证明全部历史',
            en: 'It absolutely proves the whole history',
          },
          {
            zh: '所有相似必为共同祖先新特征',
            en: 'Every similarity must be a shared derived trait',
          },
        ],
        correct: 0,
        feedback: {
          zh: '单字符可能多次变化；更多位点、外群和统计支持可检验。',
          en: 'A single character can change repeatedly; additional sites, outgroups and support measures help test it.',
        },
        revisit: {
          zh: '切换证据并检查只有一个字符。',
          en: 'Switch evidence and inspect the single character.',
        },
        id: 'L135-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'clade的定义？',
          en: 'What is a clade?',
        },
        options: [
          {
            zh: '纸面上相邻两种',
            en: 'Two adjacent taxa on paper',
          },
          {
            zh: '一个共同祖先及其全部后代',
            en: 'A common ancestor and all descendants',
          },
          {
            zh: '只选外表相似者',
            en: 'Any visually similar organisms',
          },
        ],
        correct: 1,
        feedback: {
          zh: '必须包含全部后代，不能随意排除节点下成员。',
          en: 'All descendants must be included; do not omit members under the node.',
        },
        revisit: {
          zh: '回看AB、CD、ABCD。',
          en: 'Revisit AB, CD and ABCD.',
        },
        id: 'L135-q4',
      },
    ],
  },
  {
    title: {
      zh: '多基因性状与环境',
      en: 'Polygenic traits and environment',
    },
    hook: {
      zh: '一种植物在强光下更高，能说它的基因一定更“高大”吗？',
      en: 'If a plant is taller in brighter light, does that prove its genes make it taller?',
    },
    objectives: [
      {
        zh: '用两品系×两环境设计区分来源。',
        en: 'Use a two-lineage × two-environment design to distinguish influences.',
      },
      {
        zh: '计算重复数据均值与环境响应差异。',
        en: 'Calculate replicate means and differences in environmental responses.',
      },
      {
        zh: '说明多基因、相关与遗传率的条件边界。',
        en: 'Explain the conditional limits of polygenic effects, correlation and heritability.',
      },
    ],
    prediction: [
      {
        zh: '只比较两株就能分开所有基因环境作用',
        en: 'Two plants separate all genetic and environmental influences',
      },
      {
        zh: '遗传率是某个人由基因决定的百分比',
        en: 'Heritability is an individual genetic-destiny percentage',
      },
      {
        zh: '需要让两品系都出现在两环境并重复',
        en: 'Both lineages need both environments with replication',
      },
    ],
    terms: [
      {
        word: {
          zh: '多基因性状',
          en: 'polygenic trait',
        },
        meaning: {
          zh: '受两个或更多基因位点影响的性状。',
          en: 'A trait influenced by two or more gene loci.',
        },
      },
      {
        word: {
          zh: '表型',
          en: 'phenotype',
        },
        meaning: {
          zh: '在一定条件下可观察或测量的性状。',
          en: 'An observable or measurable trait under specified conditions.',
        },
      },
      {
        word: {
          zh: '环境',
          en: 'environment',
        },
        meaning: {
          zh: '影响生长和表达等过程的外部条件。',
          en: 'External conditions influencing growth, expression and other processes.',
        },
      },
      {
        word: {
          zh: '反应规范',
          en: 'reaction norm',
        },
        meaning: {
          zh: '同一基因型或品系在不同环境下的表型响应模式。',
          en: 'The phenotype-response pattern of a genotype or lineage across environments.',
        },
      },
      {
        word: {
          zh: '交互作用',
          en: 'interaction',
        },
        meaning: {
          zh: '某因素的效应随另一因素条件而改变。',
          en: 'An effect of one factor that changes with another factor.',
        },
      },
      {
        word: {
          zh: '重复',
          en: 'replicate',
        },
        meaning: {
          zh: '按设计独立处理并测量的实验单位。',
          en: 'An experimental unit independently treated and measured in the design.',
        },
      },
      {
        word: {
          zh: '遗传率',
          en: 'heritability',
        },
        meaning: {
          zh: '特定群体条件下表型变异中与遗传差异相关的统计量。',
          en: 'A population- and condition-specific statistic relating phenotypic variation to genetic differences.',
        },
      },
    ],
    mission: {
      zh: '从四格数据写一段CER，包含两种响应差、单位、重复数、机制可能性和一条不能推出的结论。',
      en: 'Write a CER from the four cells, including both response differences, units, replication, a possible mechanism and one unsupported conclusion.',
    },
    id: 'L136',
    minutes: 38,
    icon: '◈',
    summary: {
      zh: '绿色A、金色B；点是不同独立植物，连线连接各处理组均值，不是同株同时处于两环境。',
      en: 'Green A and gold B; points are different independent plants. Lines join treatment-group means, not one plant simultaneously in two environments.',
    },
    reference: {
      title: 'NHGRI: Polygenic Trait',
      url: 'https://www.genome.gov/genetics-glossary/Polygenic-Trait',
    },
    questions: [
      {
        skill: 'concept',
        prompt: {
          zh: '怎样避免品系与光照完全混杂？',
          en: 'How can lineage and light avoid complete confounding?',
        },
        options: [
          {
            zh: 'A只低光，B只高光',
            en: 'Only A in lower light and B in higher light',
          },
          {
            zh: '只多次测同一株',
            en: 'Measure the same plant repeatedly',
          },
          {
            zh: 'A、B各在两环境且独立重复',
            en: 'Both lineages in both environments with independent replicates',
          },
        ],
        correct: 2,
        feedback: {
          zh: '交叉设计让同环境比品系、同品系比环境；重复仍需独立单位。',
          en: 'Crossing conditions allows within-environment and within-lineage comparisons; replicates must be independent units.',
        },
        revisit: {
          zh: '回看四格数据表和n=3。',
          en: 'Revisit the four cells and n=3.',
        },
        id: 'L136-q1',
      },
      {
        skill: 'concept',
        prompt: {
          zh: '遗传率能说明什么？',
          en: 'What can heritability describe?',
        },
        options: [
          {
            zh: '特定群体条件下的变异关系',
            en: 'Variation relationships in a specified population and environment',
          },
          {
            zh: '个人命运被基因决定的百分比',
            en: 'A percentage of an individual genetic destiny',
          },
          {
            zh: '环境永远无效',
            en: 'Environment can never matter',
          },
        ],
        correct: 0,
        feedback: {
          zh: '它是群体统计量，依赖环境与变异范围，不是个人百分比分解。',
          en: 'It is a population statistic dependent on environment and variation, not an individual percentage breakdown.',
        },
        revisit: {
          zh: '回看模型限制和Depth。',
          en: 'Revisit the model limits and Depth.',
        },
        id: 'L136-q2',
      },
      {
        skill: 'reasoning',
        prompt: {
          zh: '交互情景A10→20、B14→16 cm，说明？',
          en: 'In the interaction scenario A10→20 and B14→16 cm, what follows?',
        },
        options: [
          {
            zh: '两者环境效应相同',
            en: 'Their environmental effects are identical',
          },
          {
            zh: 'A+10、B+2 cm，本条件响应不同',
            en: 'A+10 and B+2 cm; responses differ here',
          },
          {
            zh: '已经找出单个负责基因',
            en: 'One causal gene has been identified',
          },
        ],
        correct: 1,
        feedback: {
          zh: '差值不同且排序改变支持交互；未测基因不能锁定分子原因。',
          en: 'Different changes and reversed ranking support interaction; unmeasured genes remain unidentified.',
        },
        revisit: {
          zh: '切到交互数据，分别减两组均值。',
          en: 'Switch to interaction data and subtract within lineages.',
        },
        id: 'L136-q3',
      },
      {
        skill: 'vocabulary',
        prompt: {
          zh: 'reaction norm指什么？',
          en: 'What is a reaction norm?',
        },
        options: [
          {
            zh: '一个生物必有的固定高度',
            en: 'An organism fixed height',
          },
          {
            zh: '染色体总数',
            en: 'Chromosome number',
          },
          {
            zh: '同基因型/品系跨环境的表型响应模式',
            en: 'A genotype/lineage phenotype-response pattern across environments',
          },
        ],
        correct: 2,
        feedback: {
          zh: '它描述响应随环境改变，不要求同株同时占两环境。',
          en: 'It describes response across environments, without placing one plant in both simultaneously.',
        },
        revisit: {
          zh: '回看A、B的均值连线。',
          en: 'Revisit the mean lines for A and B.',
        },
        id: 'L136-q4',
      },
    ],
  },
];
