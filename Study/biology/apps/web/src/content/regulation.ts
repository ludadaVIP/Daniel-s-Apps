import type { Lesson } from '../schema';
export const regulationLessons: Lesson[] = [
  {
    id: 'L057',
    title: {
      zh: '身体怎样接收信息？',
      en: 'Receptors and signals',
    },
    hook: {
      zh: '看见一只鸟、听见它鸣叫、感觉羽毛轻触皮肤，三条消息怎样变成大脑可以处理的信息？神经里会不会真的跑着一幅鸟的照片？',
      en: 'Seeing a bird, hearing its song and feeling a feather touch skin begin in different ways. How do they become information the brain can process? Does a tiny bird photograph travel through a nerve?',
    },
    objectives: [
      {
        zh: '用刺激→感受器→神经信息解释三种典型感觉通道。',
        en: 'Explain three representative sensory channels using stimulus → receptor → neural information.',
      },
      {
        zh: '区分刺激的物理形式、神经信号与大脑形成的知觉。',
        en: 'Distinguish physical stimuli, neural signals and brain-based perception.',
      },
      {
        zh: '说明一个简化配对模型能够支持和不能支持的结论。',
        en: 'State what a simplified channel-matching model does and does not establish.',
      },
    ],
    prediction: [
      {
        zh: '声音和光原样沿神经跑到脑',
        en: 'Sound and light travel unchanged along nerves',
      },
      {
        zh: '不同感受器把刺激转换为神经信息',
        en: 'Different receptors transduce stimuli into neural information',
      },
      {
        zh: '所有皮肤感觉都由一种细胞完成',
        en: 'One cell type produces every skin sensation',
      },
    ],
    mission: {
      zh: '只用已有的安全生活经验，列出看见、听见、轻触各一种刺激及其典型感受器，写出中间的“转换”，不要测试强光、噪声或疼痛。',
      en: 'Using familiar safe experiences, list a stimulus and representative receptor for vision, hearing and gentle touch, including the transduction step. Do not test bright light, noise or pain.',
    },
    summary: {
      zh: '刺激怎样变成脑能使用的信息？',
      en: 'How do stimuli become neural information?',
    },
    terms: [
      {
        word: {
          zh: '刺激',
          en: 'stimulus',
        },
        meaning: {
          zh: '能引起生物响应的内外条件变化。',
          en: 'A change in internal or external conditions that can elicit a response.',
        },
      },
      {
        word: {
          zh: '感受器',
          en: 'receptor',
        },
        meaning: {
          zh: '能够检测特定类型刺激的细胞、结构或神经末梢。',
          en: 'A cell, structure or nerve ending able to detect particular kinds of stimuli.',
        },
      },
      {
        word: {
          zh: '感觉转换',
          en: 'sensory transduction',
        },
        meaning: {
          zh: '把刺激的作用转换为神经系统可使用的信号。',
          en: 'Conversion of a stimulus into a signal usable by the nervous system.',
        },
      },
      {
        word: {
          zh: '神经信号',
          en: 'neural signal',
        },
        meaning: {
          zh: '神经细胞产生和传递的信息形式。',
          en: 'Information generated and transmitted by nerve cells.',
        },
      },
      {
        word: {
          zh: '知觉',
          en: 'perception',
        },
        meaning: {
          zh: '脑对感觉信息进行整合和解释形成的体验。',
          en: 'Experience arising from brain integration and interpretation of sensory information.',
        },
      },
      {
        word: {
          zh: '机械感受器',
          en: 'mechanoreceptor',
        },
        meaning: {
          zh: '对形变、压力或振动等机械作用敏感的感受器。',
          en: 'A receptor sensitive to mechanical effects such as deformation, pressure or vibration.',
        },
      },
    ],
    questions: [
      {
        id: 'L057-q1',
        skill: 'concept',
        prompt: {
          zh: '感受器在本课路线中最关键的作用是什么？',
          en: 'What is the key receptor role in this lesson?',
        },
        options: [
          {
            zh: '把相应刺激转换为可影响神经活动的信号',
            en: 'Transduce an appropriate stimulus into a signal influencing neural activity',
          },
          {
            zh: '独自完成对物体身份的有意识解释',
            en: 'Independently form a conscious interpretation of object identity',
          },
          {
            zh: '检测刺激而不改变任何细胞活动',
            en: 'Detect a stimulus without changing any cellular activity',
          },
        ],
        correct: 0,
        feedback: {
          zh: '感受器完成检测与转换，随后信息才由中枢整合解释。',
          en: 'Receptors detect and transduce; CNS integration and interpretation follow.',
        },
        revisit: {
          zh: '回看“刺激→感受器→神经信号”三段图。',
          en: 'Revisit stimulus → receptor → neural signal.',
        },
      },
      {
        id: 'L057-q2',
        skill: 'concept',
        prompt: {
          zh: '听见声音时，沿听觉神经路线递送的主要是什么？',
          en: 'What is carried along an auditory neural pathway?',
        },
        options: [
          {
            zh: '原来的空气振动原样前进',
            en: 'The unchanged original air vibration',
          },
          {
            zh: '神经信息',
            en: 'Neural information',
          },
          {
            zh: '所有感觉都沿同一条无区分路线',
            en: 'Every sense uses one undifferentiated route',
          },
        ],
        correct: 1,
        feedback: {
          zh: '声音引起受体转换，沿神经递送的是活动信息，而不是一团声音或鸟的照片。',
          en: 'Sound causes transduction; neural activity carries information rather than a parcel of sound or a bird photograph.',
        },
        revisit: {
          zh: '回看内耳通道的转换与讲解第二段。',
          en: 'Revisit inner-ear transduction and explanation paragraph two.',
        },
      },
      {
        id: 'L057-q3',
        skill: 'reasoning',
        prompt: {
          zh: '暗处听见鸟叫但看不清鸟，证据能支持什么？',
          en: 'Hearing a bird in dim light without seeing it clearly supports which claim?',
        },
        options: [
          {
            zh: '鸟一定没有颜色',
            en: 'The bird must lack colour',
          },
          {
            zh: '听觉好就证明视觉功能受损',
            en: 'Good hearing establishes impaired vision',
          },
          {
            zh: '听觉线索可用，视觉线索仍不足',
            en: 'Auditory evidence is usable while visual evidence remains insufficient',
          },
        ],
        correct: 2,
        feedback: {
          zh: '不同通道的刺激条件不同。需要更多线索才能解释视觉证据不足的原因。',
          en: 'Different channels have different stimulus conditions. More evidence is needed to explain the limited visual information.',
        },
        revisit: {
          zh: '重读暗房情境，区分观察与解释。',
          en: 'Revisit the dim-room case and separate observation from explanation.',
        },
      },
      {
        id: 'L057-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '把刺激转换为神经信息的过程叫什么？',
          en: 'What is the conversion of a stimulus into neural information called?',
        },
        options: [
          {
            zh: 'sensory transduction / 感觉转换',
            en: 'sensory transduction',
          },
          {
            zh: 'sensory adaptation / 感觉适应',
            en: 'sensory adaptation',
          },
          {
            zh: 'nerve conduction / 神经传导',
            en: 'nerve conduction',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Sensory transduction强调信息形式的转换，不是把刺激物质运进脑。',
          en: 'Sensory transduction changes the form of information; it does not transport the stimulus material into the brain.',
        },
        revisit: {
          zh: '复习transduction词卡与第一段机制。',
          en: 'Revisit the transduction term and first mechanism paragraph.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/36-1-sensory-processes',
    },
  },
  {
    id: 'L058',
    title: {
      zh: '神经信息的路径',
      en: 'Neural pathways',
    },
    hook: {
      zh: '手碰到书本，然后决定把它拿起来。知道“碰到了”与让肌肉“动起来”，会不会走同一条单行路线？',
      en: 'Your hand touches a book and you decide to lift it. Do incoming touch information and outgoing movement instructions follow the same one-way route?',
    },
    objectives: [
      {
        zh: '沿图区分感觉神经元、中枢整合、运动神经元与效应器。',
        en: 'Distinguish sensory neurons, CNS integration, motor neurons and effectors on a pathway.',
      },
      {
        zh: '解释单个神经元内传播与许多突触处递送的不同。',
        en: 'Distinguish propagation within a neuron from transmission at many synapses.',
      },
      {
        zh: '依据模型连接条件，判断输入到达和动作输出是否分别有证据。',
        en: 'Use model connections to distinguish evidence for incoming information and motor output.',
      },
    ],
    prediction: [
      {
        zh: '知道碰到东西就代表肌肉指令已递送',
        en: 'Receiving touch information guarantees motor delivery',
      },
      {
        zh: '感觉输入与运动输出有方向不同的路线',
        en: 'Sensory input and motor output have different directions',
      },
      {
        zh: '所有信息只在肌肉里处理',
        en: 'All processing occurs inside muscles',
      },
    ],
    mission: {
      zh: '为“摸到书，再决定拿起书”画两色路线：输入到中枢与输出到肌肉。每一段说明传递方向，再写“收到信息”与“完成动作”需要哪些不同证据。',
      en: 'Draw two colours for touching a book and deciding to lift it: input to CNS and output to muscle. Label directions and explain the different evidence needed for receiving information versus completing movement.',
    },
    summary: {
      zh: '把输入与输出分开追踪。',
      en: 'Trace input and output separately.',
    },
    terms: [
      {
        word: {
          zh: '神经元',
          en: 'neuron',
        },
        meaning: {
          zh: '接收、处理和递送信息的神经细胞。',
          en: 'A nerve cell that receives, processes and transmits information.',
        },
      },
      {
        word: {
          zh: '感觉神经元',
          en: 'sensory neuron',
        },
        meaning: {
          zh: '将信息传向中枢神经系统的神经元。',
          en: 'A neuron carrying information towards the central nervous system.',
        },
      },
      {
        word: {
          zh: '运动神经元',
          en: 'motor neuron',
        },
        meaning: {
          zh: '将信号传向肌肉等效应器的神经元。',
          en: 'A neuron carrying signals towards effectors such as muscles.',
        },
      },
      {
        word: {
          zh: '中枢神经系统',
          en: 'central nervous system',
        },
        meaning: {
          zh: '由脑和脊髓构成，参与信息整合。',
          en: 'The brain and spinal cord, involved in information integration.',
        },
      },
      {
        word: {
          zh: '突触',
          en: 'synapse',
        },
        meaning: {
          zh: '神经细胞与另一细胞递送信息的连接部位。',
          en: 'A junction where a neuron communicates with another cell.',
        },
      },
      {
        word: {
          zh: '效应器',
          en: 'effector',
        },
        meaning: {
          zh: '产生响应的肌肉或腺体等结构。',
          en: 'A structure such as muscle or gland that produces a response.',
        },
      },
    ],
    questions: [
      {
        id: 'L058-q1',
        skill: 'concept',
        prompt: {
          zh: '感觉神经元的方向是？',
          en: 'Which direction describes a sensory neuron?',
        },
        options: [
          {
            zh: '从中枢传向肌肉',
            en: 'From CNS towards muscle',
          },
          {
            zh: '将信息传向中枢',
            en: 'Carrying information towards CNS',
          },
          {
            zh: '只在两块肌肉之间传递，不涉及中枢',
            en: 'Only between two muscles without CNS involvement',
          },
        ],
        correct: 1,
        feedback: {
          zh: '感觉输入指向中枢；运动输出指向肌肉等效应器。',
          en: 'Sensory input travels towards the CNS; motor output towards effectors such as muscle.',
        },
        revisit: {
          zh: '沿五站图的1→2→3与3→4→5分别追踪。',
          en: 'Trace stations 1→2→3 separately from 3→4→5.',
        },
      },
      {
        id: 'L058-q2',
        skill: 'concept',
        prompt: {
          zh: '许多化学突触怎样影响下一细胞？',
          en: 'How do many chemical synapses affect the next cell?',
        },
        options: [
          {
            zh: '释放化学信使',
            en: 'Release chemical messengers',
          },
          {
            zh: '电活动以完全相同的方式直接跨过所有间隙',
            en: 'Electrical activity crosses every gap unchanged',
          },
          {
            zh: '两细胞必须融合成一根连续管道',
            en: 'The cells must fuse into one continuous tube',
          },
        ],
        correct: 0,
        feedback: {
          zh: '许多突触利用递质，电活动与化学递送是相连但不同的过程。',
          en: 'Many synapses use neurotransmitters; electrical propagation and chemical transmission are connected but different processes.',
        },
        revisit: {
          zh: '回看讲解“神经元不是中空的电线”。',
          en: 'Revisit “A neuron is not a hollow electrical wire.”',
        },
      },
      {
        id: 'L058-q3',
        skill: 'reasoning',
        prompt: {
          zh: '关闭模型运动连接后，输入已到中枢，哪项结论最好？',
          en: 'After the model motor link is off, input reaches the CNS. Which conclusion is justified?',
        },
        options: [
          {
            zh: '一个运动连接关闭就证明所有运动都停止',
            en: 'One switched-off motor link establishes loss of all movement',
          },
          {
            zh: '输出未到达就证明输入也未到达',
            en: 'No output proves no input arrived',
          },
          {
            zh: '本条输入可到达，但所选输出未递送',
            en: 'This input arrives but the selected output is not delivered',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型支持特定路线判断，不支持真实损伤、所有通路或长期结果的判断。',
          en: 'The model supports a particular route claim, not claims about injury, all pathways or long-term outcomes.',
        },
        revisit: {
          zh: '对比完整连接与“关闭运动连接”的第三、第四站。',
          en: 'Compare stations three and four with the motor link off.',
        },
      },
      {
        id: 'L058-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '产生动作响应的肌肉在这条路线中叫什么？',
          en: 'What is the response-producing muscle called in this pathway?',
        },
        options: [
          {
            zh: 'receptor / 感受器',
            en: 'receptor',
          },
          {
            zh: 'effector / 效应器',
            en: 'effector',
          },
          {
            zh: 'interneuron / 中间神经元',
            en: 'interneuron',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'Effector是执行响应的结构；receptor主要检测刺激。',
          en: 'An effector performs the response; a receptor detects a stimulus.',
        },
        revisit: {
          zh: '对照词卡receptor与effector，再看路线两端。',
          en: 'Compare receptor and effector cards and both pathway ends.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate',
    },
  },
  {
    id: 'L059',
    title: {
      zh: '反射为什么快？',
      en: 'Reflexes',
    },
    hook: {
      zh: '故事中的人物还没来得及认真想“该缩手”，手已开始避开有害刺激。脊髓在做什么，脑是否完全被排除？只操作模型，不做疼痛或热物实验。',
      en: 'A story character starts withdrawing a hand before consciously deciding what to do. What is the spinal cord doing, and is the brain excluded? Use the model only; no pain or hot-object experiment.',
    },
    objectives: [
      {
        zh: '按信息方向搭建本例五环节缩手反射路线。',
        en: 'Build the five-part withdrawal pathway in information-flow order.',
      },
      {
        zh: '解释脊髓整合与脑得到信息可以同时属于同一事件。',
        en: 'Explain how spinal integration and information reaching the brain can belong to the same event.',
      },
      {
        zh: '说明反射弧图不能用于计算真实时间或概括所有反射。',
        en: 'Explain why this reflex diagram neither calculates real timing nor represents every reflex.',
      },
    ],
    prediction: [
      {
        zh: '任何反射都完全不让脑知道',
        en: 'No reflex ever informs the brain',
      },
      {
        zh: '脊髓可组织缩手，脑也会收到信息',
        en: 'Spinal circuits can organise withdrawal while the brain also receives information',
      },
      {
        zh: '运动神经元先检测皮肤刺激',
        en: 'Motor neurons detect skin stimuli first',
      },
    ],
    mission: {
      zh: '在屏幕内搭完五站路线，另画一条通向脑的信息支路。用两句话解释为什么不必先等有意识决定，但也不能说脑永远不知道。',
      en: 'Build the five stations on screen and draw a separate information branch towards the brain. Explain why a prior conscious decision is unnecessary but the brain is not permanently uninformed.',
    },
    summary: {
      zh: '搭建反射弧，也别忘了脑。',
      en: 'Build a reflex arc without forgetting the brain.',
    },
    terms: [
      {
        word: {
          zh: '反射',
          en: 'reflex',
        },
        meaning: {
          zh: '由神经回路组织的较自动响应，不需先作有意识决定。',
          en: 'A relatively automatic neural response not requiring a prior conscious decision.',
        },
      },
      {
        word: {
          zh: '反射弧',
          en: 'reflex arc',
        },
        meaning: {
          zh: '从感受器到神经整合和效应器的功能路线。',
          en: 'A functional route from receptor through neural integration to effector.',
        },
      },
      {
        word: {
          zh: '脊髓',
          en: 'spinal cord',
        },
        meaning: {
          zh: '中枢神经系统的一部分，可参与反射整合与上下行递送。',
          en: 'Part of the CNS supporting reflex integration and ascending/descending communication.',
        },
      },
      {
        word: {
          zh: '中间神经元',
          en: 'interneuron',
        },
        meaning: {
          zh: '连接和整合神经元信息的神经细胞。',
          en: 'A neuron linking and integrating information between neurons.',
        },
      },
      {
        word: {
          zh: '缩手反射',
          en: 'withdrawal reflex',
        },
        meaning: {
          zh: '对有害刺激作出回撤动作的反射，本例含多个突触。',
          en: 'A withdrawal response to a harmful stimulus; this example is polysynaptic.',
        },
      },
      {
        word: {
          zh: '有意识的决定',
          en: 'conscious decision',
        },
        meaning: {
          zh: '需要有意识处理和选择的行动决定。',
          en: 'An action choice involving conscious processing.',
        },
      },
    ],
    questions: [
      {
        id: 'L059-q1',
        skill: 'concept',
        prompt: {
          zh: '本例缩手路线在感觉与运动神经元之间有什么？',
          en: 'What links sensory and motor neurons in this withdrawal example?',
        },
        options: [
          {
            zh: '先经过脑内有意识决定的必需环节',
            en: 'An obligatory prior conscious-decision step in the brain',
          },
          {
            zh: '脊髓中的中间神经元',
            en: 'Interneurons in the spinal cord',
          },
          {
            zh: '图中只允许感觉神经元直接连到肌肉',
            en: 'Only a direct sensory-neuron-to-muscle connection',
          },
        ],
        correct: 1,
        feedback: {
          zh: '本例是多突触缩手反射；不能把它推成每种反射都含同样连接。',
          en: 'This is a polysynaptic withdrawal example, not identical wiring for every reflex.',
        },
        revisit: {
          zh: '重新搭建第三站，核对“脊髓中间神经元”。',
          en: 'Rebuild station three: spinal interneuron.',
        },
      },
      {
        id: 'L059-q2',
        skill: 'concept',
        prompt: {
          zh: '脊髓属于哪一部分？',
          en: 'Which system includes the spinal cord?',
        },
        options: [
          {
            zh: '中枢神经系统',
            en: 'Central nervous system',
          },
          {
            zh: '只属于外周感觉末梢',
            en: 'Peripheral sensory endings only',
          },
          {
            zh: '中枢之外的运动末梢',
            en: 'Motor endings outside the CNS',
          },
        ],
        correct: 0,
        feedback: {
          zh: '脑和脊髓共同组成中枢，反射可在脊髓中整合。',
          en: 'The brain and spinal cord form the CNS, and spinal circuits can integrate reflexes.',
        },
        revisit: {
          zh: '对照L058的中枢词卡与本图第三站。',
          en: 'Compare the CNS term from L058 with station three.',
        },
      },
      {
        id: 'L059-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型显示缩手路线和通脑支路，哪句话最好？',
          en: 'The model shows withdrawal and a brain branch. Which statement is best?',
        },
        options: [
          {
            zh: '脑永远不知道刺激',
            en: 'The brain never receives information',
          },
          {
            zh: '必须等所有动作完成才开始向脑传递',
            en: 'Brain transmission begins only after all movement ends',
          },
          {
            zh: '脊髓可组织响应，相关信息也可到脑',
            en: 'Spinal circuits can organise a response while related information also reaches the brain',
          },
        ],
        correct: 2,
        feedback: {
          zh: '图中分步表示功能顺序，不是所有通路的严格时间表。',
          en: 'The steps show functional order, not a strict timetable for every pathway.',
        },
        revisit: {
          zh: '回看金色虚线与“不是等时阶段”的说明。',
          en: 'Revisit the gold branch and the unequal-time-step note.',
        },
      },
      {
        id: 'L059-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'Reflex arc最恰当的中文是？',
          en: 'What does reflex arc mean?',
        },
        options: [
          {
            zh: '感觉转换',
            en: 'Sensory transduction',
          },
          {
            zh: '反射弧',
            en: 'Reflex arc',
          },
          {
            zh: '知觉解释',
            en: 'Perceptual interpretation',
          },
        ],
        correct: 1,
        feedback: {
          zh: '反射弧是受体—神经整合—效应器的功能路线，不是只指弯曲的线。',
          en: 'A reflex arc is a functional receptor–integration–effector route, not merely a curved line.',
        },
        revisit: {
          zh: '复习反射弧词卡并口述五站。',
          en: 'Revisit the reflex-arc term and explain all five stations.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/35-3-the-central-nervous-system',
    },
  },
  {
    id: 'L060',
    title: {
      zh: '激素怎样传递信息？',
      en: 'Introducing hormones',
    },
    hook: {
      zh: '血液会经过许多细胞。为什么同一种激素能改变某些细胞的活动，却不会让所有细胞做完全相同的事？',
      en: 'Blood passes many cells. Why can one hormone change some cells without making every cell do exactly the same thing?',
    },
    objectives: [
      {
        zh: '追踪分泌→血液运输→受体匹配→响应的内分泌路线。',
        en: 'Trace endocrine secretion → blood transport → receptor match → response.',
      },
      {
        zh: '用对照解释信使到达与靶细胞响应不同。',
        en: 'Use a comparison to distinguish messenger arrival from target-cell response.',
      },
      {
        zh: '比较神经与激素递送，避免“任何激素都慢”的绝对判断。',
        en: 'Compare neural and hormonal communication without claiming all hormones are slow.',
      },
    ],
    prediction: [
      {
        zh: '血流经过的所有细胞都同样响应',
        en: 'Every cell contacted by blood responds identically',
      },
      {
        zh: '合适受体与细胞内过程共同决定响应',
        en: 'Suitable receptors and intracellular processes determine response',
      },
      {
        zh: '激素是细胞活动的主要食物',
        en: 'Hormones are the main food for cell activities',
      },
    ],
    mission: {
      zh: '用A/B两种虚构信使与三种受体细胞，记录至少一组“都到达、响应不同”的比较；写一句英文解释靶细胞不只由距离决定。',
      en: 'Use fictional A/B messengers and three receptor sets to record a comparison with equal arrival but different responses. Write an English sentence explaining why distance alone does not define a target.',
    },
    summary: {
      zh: '血液到达不等于细胞响应。',
      en: 'Arrival in blood does not guarantee a response.',
    },
    terms: [
      {
        word: {
          zh: '激素',
          en: 'hormone',
        },
        meaning: {
          zh: '由细胞释放、在较远靶细胞等处传递调节信息的化学信使。',
          en: 'A chemical messenger released by cells to regulate targets, often at a distance.',
        },
      },
      {
        word: {
          zh: '内分泌',
          en: 'endocrine signalling',
        },
        meaning: {
          zh: '化学信使经内环境和血液到达较远靶细胞的信号方式。',
          en: 'Signalling in which messengers travel through internal fluids and blood to distant targets.',
        },
      },
      {
        word: {
          zh: '靶细胞',
          en: 'target cell',
        },
        meaning: {
          zh: '具有适合受体并可产生相应响应的细胞。',
          en: 'A cell with suitable receptors and the capacity for a corresponding response.',
        },
      },
      {
        word: {
          zh: '受体',
          en: 'receptor',
        },
        meaning: {
          zh: '能够识别特定信号的细胞分子结构。',
          en: 'A cellular molecular structure able to recognise a particular signal.',
        },
      },
      {
        word: {
          zh: '特异性',
          en: 'specificity',
        },
        meaning: {
          zh: '信号与受体等之间有选择的匹配关系。',
          en: 'Selective matching between signals and receptors or other structures.',
        },
      },
      {
        word: {
          zh: '化学信使',
          en: 'chemical messenger',
        },
        meaning: {
          zh: '以分子形式在细胞间传递信息的物质。',
          en: 'A molecule conveying information between cells.',
        },
      },
    ],
    questions: [
      {
        id: 'L060-q1',
        skill: 'concept',
        prompt: {
          zh: '哪种条件最直接决定本模型细胞是否响应A？',
          en: 'Which condition determines response to A in this model?',
        },
        options: [
          {
            zh: '细胞与分泌位置的距离本身',
            en: 'Distance from the secretory source alone',
          },
          {
            zh: '有没有匹配A的受体',
            en: 'Presence of a matching A receptor',
          },
          {
            zh: '只看血液是否经过，不看受体',
            en: 'Blood passage alone, regardless of receptors',
          },
        ],
        correct: 1,
        feedback: {
          zh: '血液经过不等于响应。比较时固定信使A，只改变受体配置；没有匹配受体就不显示所选响应。',
          en: 'Blood passage is not response. Hold messenger A fixed and vary the receptor set; without a match, the selected response is absent.',
        },
        revisit: {
          zh: '让A分别经过A受体与B受体配置，比较末帧。',
          en: 'Compare the final frame for A with A versus B receptors.',
        },
      },
      {
        id: 'L060-q2',
        skill: 'concept',
        prompt: {
          zh: '激素最恰当的角色是什么？',
          en: 'What best describes a hormone’s role?',
        },
        options: [
          {
            zh: '调节细胞活动的化学信使',
            en: 'A chemical messenger regulating cell activity',
          },
          {
            zh: '直接替代葡萄糖供能的燃料',
            en: 'A fuel directly replacing glucose',
          },
          {
            zh: '直接催化消化反应的酶',
            en: 'An enzyme directly catalysing digestion',
          },
        ],
        correct: 0,
        feedback: {
          zh: '激素传递调节信息，细胞依靠自己的机制、物质和能量执行。',
          en: 'Hormones convey regulatory information; cells execute using their mechanisms, matter and energy.',
        },
        revisit: {
          zh: '回看“激素发信息，细胞完成工作”。',
          en: 'Revisit “Hormones convey information; cells do the work.”',
        },
      },
      {
        id: 'L060-q3',
        skill: 'reasoning',
        prompt: {
          zh: '甲乙都接触A，只有甲响应，怎样解释最稳妥？',
          en: 'Both cells encounter A but only one responds. Which interpretation is strongest?',
        },
        options: [
          {
            zh: 'A没有到过乙',
            en: 'A did not reach the other cell',
          },
          {
            zh: '任何激素都不能影响乙',
            en: 'No hormone can affect the other cell',
          },
          {
            zh: '先比较匹配受体，再核查细胞内条件',
            en: 'Compare matching receptors, then intracellular conditions',
          },
        ],
        correct: 2,
        feedback: {
          zh: '到达证据已相同，应该检查识别和响应过程；不应推成所有激素或所有细胞的结论。',
          en: 'Arrival evidence is equal, so examine recognition and response rather than generalising to every hormone or cell.',
        },
        revisit: {
          zh: '对照相同信使、不同受体，再读进阶说明。',
          en: 'Compare the same messenger with different receptors, then read Depth.',
        },
      },
      {
        id: 'L060-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '能对特定信使产生相应响应的细胞叫什么？',
          en: 'What is a cell able to respond to a particular messenger called?',
        },
        options: [
          {
            zh: 'target cell / 靶细胞',
            en: 'target cell',
          },
          {
            zh: 'endocrine cell / 内分泌细胞',
            en: 'endocrine cell',
          },
          {
            zh: 'sensory receptor / 感觉感受器',
            en: 'sensory receptor',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Target cell强调受体和响应能力，而不是细胞离分泌处最近。',
          en: 'Target cell refers to receptors and response capacity, not necessarily nearest distance.',
        },
        revisit: {
          zh: '复习target cell词卡，解释与血流经过的区别。',
          en: 'Review target cell and distinguish it from blood passage.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/37-2-how-hormones-work',
    },
  },
  {
    id: 'L061',
    title: {
      zh: '什么是稳态？',
      en: 'What is homeostasis?',
    },
    hook: {
      zh: '一条真正稳定的生命曲线，会不会完全没有起伏？让一个虚构内部条件先偏高、再偏低，看看同一个负反馈原则能不能解释两个方向。',
      en: 'Must a stable living system produce a perfectly flat line? Disturb one fictional internal condition upwards and downwards, then ask whether the same negative-feedback principle explains both responses.',
    },
    objectives: [
      {
        zh: '把稳态解释为条件在适宜范围内动态调节。',
        en: 'Explain homeostasis as dynamic regulation within a suitable range.',
      },
      {
        zh: '识别扰动、检测、整合、效应器与反馈的因果联系。',
        en: 'Connect disturbance, detection, integration, effector and feedback causally.',
      },
      {
        zh: '从两条模型记录判断响应是否抵消最初偏离，并说明模型局限。',
        en: 'Use two model records to judge whether a response opposes the initial deviation and state model limits.',
      },
    ],
    prediction: [
      {
        zh: '稳态意味着数值永远精确不变',
        en: 'Homeostasis means a value never changes at all',
      },
      {
        zh: '负反馈只能把数值向下调',
        en: 'Negative feedback can only lower a value',
      },
      {
        zh: '负反馈抵消偏离，方向可向上或向下',
        en: 'Negative feedback opposes deviation, upwards or downwards',
      },
    ],
    mission: {
      zh: '分别记录向上与向下扰动的第2、3、6点，计算或比较离50的偏差。为两种情况各画“偏离→检测→响应→抵消偏离”箭头，再解释为什么向上纠偏也叫负反馈。',
      en: 'Record snapshots 2, 3 and 6 after upward and downward disturbances and compare their deviations from 50. Draw deviation → detection → response → opposing deviation for each and explain why an upward correction can also be negative feedback.',
    },
    summary: {
      zh: '偏高与偏低，怎样都能纠偏？',
      en: 'How can opposite deviations both be corrected?',
    },
    terms: [
      {
        word: {
          zh: '稳态',
          en: 'homeostasis',
        },
        meaning: {
          zh: '通过调节把内部条件保持在适宜范围的动态过程。',
          en: 'Dynamic regulation maintaining internal conditions within suitable ranges.',
        },
      },
      {
        word: {
          zh: '负反馈',
          en: 'negative feedback',
        },
        meaning: {
          zh: '响应抵消引起它的最初偏离。',
          en: 'A response opposes the original deviation that triggered it.',
        },
      },
      {
        word: {
          zh: '偏离',
          en: 'deviation',
        },
        meaning: {
          zh: '某条件相对参考状态或范围的改变。',
          en: 'A departure from a reference condition or range.',
        },
      },
      {
        word: {
          zh: '调节中心',
          en: 'control centre',
        },
        meaning: {
          zh: '整合信息并协调响应的功能环节。',
          en: 'A functional component integrating information and coordinating a response.',
        },
      },
      {
        word: {
          zh: '效应器',
          en: 'effector',
        },
        meaning: {
          zh: '执行调节响应的结构，如肌肉或腺体。',
          en: 'A structure performing a regulatory response, such as muscle or gland.',
        },
      },
      {
        word: {
          zh: '参考范围',
          en: 'reference range',
        },
        meaning: {
          zh: '本模型用来比较偏离与恢复的约定范围，不是个人健康阈值。',
          en: 'An agreed model range for comparing deviations and recovery, not a personal health threshold.',
        },
      },
    ],
    questions: [
      {
        id: 'L061-q1',
        skill: 'concept',
        prompt: {
          zh: '稳态最准确的含义是什么？',
          en: 'Which definition best describes homeostasis?',
        },
        options: [
          {
            zh: '内部条件每时每刻精确相同',
            en: 'Internal conditions are identical at every instant',
          },
          {
            zh: '通过动态调节维持适宜范围',
            en: 'Dynamic regulation maintains suitable ranges',
          },
          {
            zh: '外界条件完全不再变化',
            en: 'External conditions stop changing',
          },
        ],
        correct: 1,
        feedback: {
          zh: '外界与身体活动持续变化；调节维持适宜范围，而不是冻结条件。',
          en: 'External conditions and activity continue changing; regulation maintains ranges rather than freezing conditions.',
        },
        revisit: {
          zh: '看绿带、扰动点与后续曲线。',
          en: 'Compare the green band, disturbance and subsequent trace.',
        },
      },
      {
        id: 'L061-q2',
        skill: 'concept',
        prompt: {
          zh: '哪个关系定义了负反馈？',
          en: 'Which relationship defines negative feedback?',
        },
        options: [
          {
            zh: '响应抵消引发它的偏离',
            en: 'The response opposes the triggering deviation',
          },
          {
            zh: '响应永远让所有数值下降',
            en: 'The response always lowers every variable',
          },
          {
            zh: '响应永远发生在脑中',
            en: 'The response always occurs inside the brain',
          },
        ],
        correct: 0,
        feedback: {
          zh: '方向由偏离决定，检测与整合也不一定只在脑。',
          en: 'Direction depends on the deviation, and detection/integration are not confined to the brain.',
        },
        revisit: {
          zh: '分别比较高、低扰动时离50的距离。',
          en: 'Compare deviations from 50 after high and low disturbances.',
        },
      },
      {
        id: 'L061-q3',
        skill: 'reasoning',
        prompt: {
          zh: '50→20→31→39最支持哪一解释？',
          en: 'Which interpretation is best supported by 50→20→31→39?',
        },
        options: [
          {
            zh: '后续上升必定是放大最初扰动',
            en: 'The later rise must amplify the initial disturbance',
          },
          {
            zh: '回升证明永远没有偏离',
            en: 'The rise proves no deviation ever occurred',
          },
          {
            zh: '后续回升抵消最初下降，符合负反馈方向',
            en: 'The later rise opposes the initial fall, consistent with negative feedback',
          },
        ],
        correct: 2,
        feedback: {
          zh: '最初扰动是向下，后续偏差缩小；只看曲线上升会误判。',
          en: 'The initial disturbance is downwards and later deviation shrinks; judging only the rise misidentifies feedback.',
        },
        revisit: {
          zh: '播放向下扰动，先标出第1→2点，再标出第2→4点。',
          en: 'Play the downward disturbance and compare snapshots 1→2 with 2→4.',
        },
      },
      {
        id: 'L061-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'Homeostasis对应哪个概念？',
          en: 'Which concept corresponds to homeostasis?',
        },
        options: [
          {
            zh: '只指固定体温',
            en: 'Only a fixed body temperature',
          },
          {
            zh: '稳态：动态维持适宜内部条件',
            en: 'Homeostasis: dynamic maintenance of suitable internal conditions',
          },
          {
            zh: '外界环境不变',
            en: 'An unchanging external environment',
          },
        ],
        correct: 1,
        feedback: {
          zh: '稳态涉及多种内部条件，调节允许适度变化。',
          en: 'Homeostasis concerns several internal variables and allows regulated variation.',
        },
        revisit: {
          zh: '复习homeostasis与reference range词卡。',
          en: 'Revisit homeostasis and reference range.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/33-3-homeostasis',
    },
  },
  {
    id: 'L062',
    title: {
      zh: '太热或太冷会怎样？',
      en: 'Temperature regulation',
    },
    hook: {
      zh: '两个虚构场景中空气都比皮肤凉，一个较干、一个较湿。为什么流汗同样明显，冷却效果仍可能不同？寒冷时“少散热”和“多产热”又有什么区别？',
      en: 'In two fictional scenes air is cooler than skin, but one is drier and one more humid. Why might equally visible sweat have different cooling effects? In cold conditions, how do conserving and generating heat differ?',
    },
    objectives: [
      {
        zh: '用热量流动解释皮肤血管、汗蒸发和颤抖的作用。',
        en: 'Explain skin vessels, sweat evaporation and shivering through heat transfer.',
      },
      {
        zh: '在其他条件相同时，比较空气湿度对蒸发条件的影响。',
        en: 'Compare humidity effects on evaporation with other conditions held constant.',
      },
      {
        zh: '区分保热与产热，并避免把模型箭头当作真实速率。',
        en: 'Distinguish conserving from generating heat and avoid interpreting arrows as real rates.',
      },
    ],
    prediction: [
      {
        zh: '汗只要出现在皮肤上就有同样的冷却',
        en: 'Visible sweat always gives equal cooling',
      },
      {
        zh: '蒸发条件与皮肤血流都影响散热',
        en: 'Evaporation conditions and skin blood flow affect heat loss',
      },
      {
        zh: '寒冷时皮肤血管扩张是主要保热办法',
        en: 'Wider skin vessels are the main way to conserve heat when cold',
      },
    ],
    mission: {
      zh: '用模型填写两组比较：偏热时较干/较湿空气；偏热/偏冷时皮肤血管与肌肉。每组写“保持什么、改变什么、哪条热量路线改变”，不测体温或做冷热实验。',
      en: 'Use the model for two comparisons: drier/more humid air when warm, and warm/cold states for skin vessels and muscle. State controls, the changed factor and the affected heat route; no temperature measurement or hot/cold experiment.',
    },
    summary: {
      zh: '区分保热、产热与蒸发散热。',
      en: 'Separate heat conservation, generation and evaporation.',
    },
    terms: [
      {
        word: {
          zh: '体温调节',
          en: 'thermoregulation',
        },
        meaning: {
          zh: '通过产热、散热等过程调节身体温度。',
          en: 'Regulation of body temperature through heat production and heat exchange.',
        },
      },
      {
        word: {
          zh: '血管扩张',
          en: 'vasodilation',
        },
        meaning: {
          zh: '血管变宽，可改变某区域血流和热量运输。',
          en: 'Widening of vessels, altering regional blood flow and heat transport.',
        },
      },
      {
        word: {
          zh: '血管收缩',
          en: 'vasoconstriction',
        },
        meaning: {
          zh: '血管变窄，可减少皮肤血流和相应散热。',
          en: 'Narrowing of vessels, which can reduce skin blood flow and heat loss.',
        },
      },
      {
        word: {
          zh: '蒸发',
          en: 'evaporation',
        },
        meaning: {
          zh: '液态水变为水蒸气的过程，需要能量。',
          en: 'Liquid water becoming vapour, requiring energy.',
        },
      },
      {
        word: {
          zh: '颤抖',
          en: 'shivering',
        },
        meaning: {
          zh: '肌肉快速不自主活动，增加代谢产热。',
          en: 'Rapid involuntary muscle activity increasing metabolic heat production.',
        },
      },
      {
        word: {
          zh: '热量传递',
          en: 'heat transfer',
        },
        meaning: {
          zh: '因温度差等发生的热能转移。',
          en: 'Transfer of thermal energy associated with temperature differences and other exchange conditions.',
        },
      },
    ],
    questions: [
      {
        id: 'L062-q1',
        skill: 'concept',
        prompt: {
          zh: '较冷时哪项主要增加产热，而不只是减少热流失？',
          en: 'Which cold response primarily increases heat production?',
        },
        options: [
          {
            zh: '皮肤血管收缩',
            en: 'Cutaneous vasoconstriction',
          },
          {
            zh: '肌肉颤抖',
            en: 'Muscle shivering',
          },
          {
            zh: '减少皮肤表面血流',
            en: 'Reduced skin blood flow',
          },
        ],
        correct: 1,
        feedback: {
          zh: '颤抖增加肌肉代谢；血管收缩更直接影响向皮肤的热运输。',
          en: 'Shivering increases muscle metabolism; vessel constriction more directly affects heat transport towards skin.',
        },
        revisit: {
          zh: '比较冷状态折线肌肉与较窄红色血管。',
          en: 'Compare the shivering zigzag and narrow red vessels in the cold state.',
        },
      },
      {
        id: 'L062-q2',
        skill: 'concept',
        prompt: {
          zh: '为什么较湿空气可能削弱汗的蒸发散热？',
          en: 'Why can more humid air reduce evaporative cooling?',
        },
        options: [
          {
            zh: '皮肤与空气间的水蒸气条件差减小',
            en: 'A smaller skin-to-air water-vapour gradient',
          },
          {
            zh: '空气越湿，水蒸气条件差就一定越大',
            en: 'More humid air necessarily increases that gradient',
          },
          {
            zh: '湿度只影响血管，不影响蒸发',
            en: 'Humidity affects vessels but not evaporation',
          },
        ],
        correct: 0,
        feedback: {
          zh: '水仍可蒸发，但在其他条件相同的比较中，较湿空气减小蒸发驱动力；不等于零。',
          en: 'Water can still evaporate, but greater humidity reduces the gradient with other conditions held equal; it need not become zero.',
        },
        revisit: {
          zh: '保持偏热，比较较干与较湿的蓝色箭头。',
          en: 'Keep the warm state and compare blue arrows in drier versus more humid air.',
        },
      },
      {
        id: 'L062-q3',
        skill: 'reasoning',
        prompt: {
          zh: '汗滴数量相同就能证明两情境冷却量相同吗？',
          en: 'Do equal visible sweat droplets prove equal cooling in two situations?',
        },
        options: [
          {
            zh: '能，因为汗滴数就是蒸发量',
            en: 'Yes: drop count equals evaporated volume',
          },
          {
            zh: '能，只要都发生皮肤血管扩张',
            en: 'Yes, provided skin vessels dilate in both',
          },
          {
            zh: '不能，还要比较蒸发条件、风和衣物等',
            en: 'No; evaporation conditions, wind and clothing also matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '看得见的汗不等于已蒸发的水，单一观察不足以比较热量收支。',
          en: 'Visible sweat is not water already evaporated; one observation cannot establish equal heat balance.',
        },
        revisit: {
          zh: '回看湿度对照和讲解第二段。',
          en: 'Revisit the humidity comparison and explanation paragraph two.',
        },
      },
      {
        id: 'L062-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'Vasoconstriction指什么？',
          en: 'What is vasoconstriction?',
        },
        options: [
          {
            zh: '血管变窄',
            en: 'Vessel narrowing',
          },
          {
            zh: '血管变宽',
            en: 'Vessel widening',
          },
          {
            zh: '汗转成水蒸气',
            en: 'Sweat turning to vapour',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Constriction是变窄，dilation是扩张；两者影响区域血流。',
          en: 'Constriction means narrowing; dilation means widening. Both alter regional blood flow.',
        },
        revisit: {
          zh: '对照vasoconstriction与vasodilation词卡。',
          en: 'Compare the vasoconstriction and vasodilation terms.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/33-3-homeostasis',
    },
  },
  {
    id: 'L063',
    title: {
      zh: '血糖调节的基本概念',
      en: 'Blood glucose regulation',
    },
    hook: {
      zh: '同一套调节系统面对“相对偏高”和“相对偏低”两种情况，为什么需要不同信号？胰岛素是不是把糖直接变成能量的工具？',
      en: 'Why does one regulatory system use different signals for relatively high and low glucose? Is insulin itself a tool that directly turns sugar into energy?',
    },
    objectives: [
      {
        zh: '区分胰岛β细胞/胰岛素与α细胞/胰高血糖素两条路线。',
        en: 'Distinguish beta-cell/insulin and alpha-cell/glucagon routes.',
      },
      {
        zh: '用葡萄糖摄取、储存和肝释放解释回调方向。',
        en: 'Explain corrective trends using glucose uptake, storage and liver release.',
      },
      {
        zh: '把信号分子与运输物质分开，并说明定性模型不能判读个人健康。',
        en: 'Separate signalling molecules from transported matter and state why this qualitative model cannot assess personal health.',
      },
    ],
    prediction: [
      {
        zh: '任何血糖变化都由同一种激素向下调',
        en: 'One hormone lowers glucose after every change',
      },
      {
        zh: '偏高与偏低可用不同信号协调相反方向',
        en: 'Different signals coordinate opposing responses to high and low states',
      },
      {
        zh: '胰岛素本身就是细胞呼吸释放的能量',
        en: 'Insulin itself is energy released by cellular respiration',
      },
    ],
    mission: {
      zh: '画两条对照路线：相对偏高→β细胞→胰岛素→摄取/储存；相对偏低→α细胞→胰高血糖素→肝释放。用不同颜色标信号和葡萄糖，再写一句英文解释二者为什么都可属于负反馈。',
      en: 'Draw paired high → beta cells → insulin → uptake/storage and low → alpha cells → glucagon → liver-release routes. Colour signals separately from glucose and write an English sentence explaining why both can be negative feedback.',
    },
    summary: {
      zh: '激素传信息，葡萄糖是物质。',
      en: 'Hormones signal; glucose is matter.',
    },
    terms: [
      {
        word: {
          zh: '血糖',
          en: 'blood glucose',
        },
        meaning: {
          zh: '血液中的葡萄糖，是细胞可利用的一种燃料物质。',
          en: 'Glucose in blood, a fuel substance available to cells.',
        },
      },
      {
        word: {
          zh: '胰岛',
          en: 'pancreatic islet',
        },
        meaning: {
          zh: '胰腺中包含多种内分泌细胞的细胞群。',
          en: 'A pancreatic cluster containing several endocrine cell types.',
        },
      },
      {
        word: {
          zh: '胰岛素',
          en: 'insulin',
        },
        meaning: {
          zh: '由β细胞释放、促进特定组织摄取与储存等的激素。',
          en: 'A beta-cell hormone promoting uptake and storage in particular tissues, among other actions.',
        },
      },
      {
        word: {
          zh: '胰高血糖素',
          en: 'glucagon',
        },
        meaning: {
          zh: '由α细胞释放、促进肝增加葡萄糖释放等的激素。',
          en: 'An alpha-cell hormone promoting increased liver glucose release, among other actions.',
        },
      },
      {
        word: {
          zh: '糖原',
          en: 'glycogen',
        },
        meaning: {
          zh: '由葡萄糖单元组成的储存多糖。',
          en: 'A storage polysaccharide built from glucose units.',
        },
      },
      {
        word: {
          zh: '负反馈',
          en: 'negative feedback',
        },
        meaning: {
          zh: '调节响应抵消最初偏离的关系。',
          en: 'Regulation in which a response opposes an initial deviation.',
        },
      },
    ],
    questions: [
      {
        id: 'L063-q1',
        skill: 'concept',
        prompt: {
          zh: '相对偏高时，哪组配对正确？',
          en: 'Which pairing fits relatively high glucose?',
        },
        options: [
          {
            zh: 'α细胞—胰岛素',
            en: 'Alpha cells—insulin',
          },
          {
            zh: 'β细胞—胰岛素',
            en: 'Beta cells—insulin',
          },
          {
            zh: '肝细胞—胰岛素分泌',
            en: 'Liver cells—insulin secretion',
          },
        ],
        correct: 1,
        feedback: {
          zh: '胰岛β细胞释放胰岛素；肝是重要靶组织之一，不是本例胰岛素来源。',
          en: 'Pancreatic beta cells release insulin. The liver is an important target, not the insulin source in this example.',
        },
        revisit: {
          zh: '回看高状态的上方细胞与信号标签。',
          en: 'Revisit source-cell and hormone labels in the high state.',
        },
      },
      {
        id: 'L063-q2',
        skill: 'concept',
        prompt: {
          zh: '本模型的胰高血糖素路线怎样帮助抵消偏低？',
          en: 'How does the glucagon route oppose a low state here?',
        },
        options: [
          {
            zh: '促进肝向血液释放葡萄糖',
            en: 'Promoting liver glucose release to blood',
          },
          {
            zh: '促进肝把更多血糖储存成糖原',
            en: 'Promoting liver storage of blood glucose as glycogen',
          },
          {
            zh: '促使肌肉直接把糖原排入血液',
            en: 'Making muscle release glycogen directly into blood',
          },
        ],
        correct: 0,
        feedback: {
          zh: '胰高血糖素是信号；本例显示肝糖原提供葡萄糖，物质与信息分开追踪。',
          en: 'Glucagon is a signal; liver glycogen supplies glucose in this example. Track matter separately from information.',
        },
        revisit: {
          zh: '切到低状态，沿下方糖原→葡萄糖箭头追踪。',
          en: 'Switch to the low state and trace glycogen → glucose.',
        },
      },
      {
        id: 'L063-q3',
        skill: 'reasoning',
        prompt: {
          zh: '信号X增加后肝释放葡萄糖增加，最稳妥的解释是？',
          en: 'Signal X rises before increased liver glucose release. Which interpretation is strongest?',
        },
        options: [
          {
            zh: '一定是胰岛素，因为所有激素都促进储存',
            en: 'It must be insulin because every hormone promotes storage',
          },
          {
            zh: '已能确认X分子的化学身份',
            en: 'Its chemical identity is established',
          },
          {
            zh: '方向较符合胰高血糖素路线，但还需来源/受体等证据',
            en: 'The direction fits the glucagon route, but source/receptor evidence is still needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '一个作用方向有助于提出解释，却不足以唯一鉴定信号，也不应排除其他调节。',
          en: 'A response direction helps suggest an explanation but cannot uniquely identify a signal or exclude other regulation.',
        },
        revisit: {
          zh: '对照两种状态的信号与肝箭头，再读Apply。',
          en: 'Compare both signal/liver routes and revisit Apply.',
        },
      },
      {
        id: 'L063-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'Glycogen在本课中是什么？',
          en: 'What is glycogen here?',
        },
        options: [
          {
            zh: '糖原：葡萄糖组成的储存多糖',
            en: 'Glycogen: a glucose-based storage polysaccharide',
          },
          {
            zh: '胰高血糖素的英文缩写',
            en: 'An abbreviation for glucagon',
          },
          {
            zh: '血液中的另一种激素',
            en: 'Another blood hormone',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Glycogen是储存物质；glucagon是化学信使，拼写相近但功能不同。',
          en: 'Glycogen stores material; glucagon is a chemical messenger. Similar spellings do not mean identical roles.',
        },
        revisit: {
          zh: '并排复习glycogen与glucagon词卡。',
          en: 'Compare glycogen and glucagon term cards.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes',
    },
  },
  {
    id: 'L064',
    title: {
      zh: '水分平衡',
      en: 'Water balance',
    },
    hook: {
      zh: '肾把更多水重吸收回身体，为什么形成的尿量反而可能减少？保住水与补进水，是不是同一件事？',
      en: 'Why can greater kidney water reabsorption produce less urine? Are conserving water and adding water to the body the same process?',
    },
    objectives: [
      {
        zh: '追踪下丘脑产生ADH、垂体后叶释放、肾响应的信号路线。',
        en: 'Trace hypothalamic ADH production, posterior-pituitary release and kidney response.',
      },
      {
        zh: '解释集合管水通透性、重吸收与相对尿量/浓度的关系。',
        en: 'Connect collecting-duct permeability, reabsorption and relative urine volume/concentration.',
      },
      {
        zh: '区分保水、排水与口渴相关摄入，不把模型当作个人饮水建议。',
        en: 'Distinguish conservation, water excretion and thirst-related intake without turning the model into drinking advice.',
      },
    ],
    prediction: [
      {
        zh: '重吸收越多，尿量一定越多',
        en: 'More reabsorption necessarily means more urine',
      },
      {
        zh: 'ADH让肾制造新水',
        en: 'ADH makes the kidneys create new water',
      },
      {
        zh: '更多水回到血液时，留在尿中的水相对更少',
        en: 'More water returning to blood leaves relatively less water in urine',
      },
    ],
    mission: {
      zh: '为较浓/较稀两种模型状态各记录ADH、集合管通透性、重吸收、尿量的相对方向。另画口渴与摄入支路，说明肾保水不会制造水；不改变饮水，不收集个人尿液数据。',
      en: 'Record relative ADH, collecting-duct permeability, reabsorption and urine-volume trends for concentrated/dilute model states. Add a thirst/intake branch and explain why conservation creates no water. Do not change drinking or collect personal urine data.',
    },
    summary: {
      zh: '水回到血液，尿中就相对更少。',
      en: 'More water returns to blood; relatively less remains in urine.',
    },
    terms: [
      {
        word: {
          zh: '水分平衡',
          en: 'water balance',
        },
        meaning: {
          zh: '水的摄入、产生和丢失等过程共同影响的内部状态。',
          en: 'An internal balance influenced by water intake, metabolic production and losses.',
        },
      },
      {
        word: {
          zh: '抗利尿激素',
          en: 'antidiuretic hormone (ADH)',
        },
        meaning: {
          zh: '由下丘脑产生、经垂体后叶释放，调节肾保水等的激素。',
          en: 'A hypothalamic hormone released from the posterior pituitary, regulating kidney water conservation among other actions.',
        },
      },
      {
        word: {
          zh: '重吸收',
          en: 'reabsorption',
        },
        meaning: {
          zh: '物质从肾管液返回内环境和血液的过程。',
          en: 'Movement of substances from kidney tubular fluid back towards internal fluids and blood.',
        },
      },
      {
        word: {
          zh: '集合管',
          en: 'collecting duct',
        },
        meaning: {
          zh: '肾中水通透性可受ADH调节的管道部位。',
          en: 'A kidney duct whose water permeability can be regulated by ADH.',
        },
      },
      {
        word: {
          zh: '渗透',
          en: 'osmosis',
        },
        meaning: {
          zh: '水通过选择透过性膜的净移动。',
          en: 'Net water movement across a selectively permeable membrane.',
        },
      },
      {
        word: {
          zh: '溶质浓度',
          en: 'solute concentration',
        },
        meaning: {
          zh: '一定量溶液中的溶质含量，此处用于相对比较。',
          en: 'Solute content relative to solution quantity, used here for relative comparison.',
        },
      },
    ],
    questions: [
      {
        id: 'L064-q1',
        skill: 'concept',
        prompt: {
          zh: 'ADH的产生与释放位置怎样配对？',
          en: 'Which pairing describes ADH production and release?',
        },
        options: [
          {
            zh: '肾产生，垂体后叶释放',
            en: 'Kidneys produce it; posterior pituitary releases it',
          },
          {
            zh: '下丘脑产生，垂体后叶释放',
            en: 'Hypothalamus produces it; posterior pituitary releases it',
          },
          {
            zh: '垂体后叶产生，下丘脑释放',
            en: 'Posterior pituitary produces it; hypothalamus releases it',
          },
        ],
        correct: 1,
        feedback: {
          zh: '下丘脑产生的ADH沿神经元到垂体后叶储存并释放，之后经血液到肾。',
          en: 'Hypothalamic ADH travels along neurons to the posterior pituitary for storage/release, then in blood to kidneys.',
        },
        revisit: {
          zh: '逐步看左侧下丘脑→垂体后叶→血液三站。',
          en: 'Step through hypothalamus → posterior pituitary → blood.',
        },
      },
      {
        id: 'L064-q2',
        skill: 'concept',
        prompt: {
          zh: '其他条件相同，水重吸收相对增加，意味着哪种趋势？',
          en: 'Other conditions equal, greater water reabsorption suggests which trend?',
        },
        options: [
          {
            zh: '留在尿中的水相对少',
            en: 'Relatively less water remains in urine',
          },
          {
            zh: '相同滤过下更多水留在尿中',
            en: 'More water remains in urine with the same filtration',
          },
          {
            zh: '尿量只由滤过决定，重吸收不影响它',
            en: 'Only filtration determines urine volume; reabsorption has no effect',
          },
        ],
        correct: 0,
        feedback: {
          zh: '重吸收路线回到血液方向，与留在管液中最终排出的方向不同。',
          en: 'Reabsorption returns water towards blood, unlike water remaining in tubular fluid for excretion.',
        },
        revisit: {
          zh: '对照横向蓝箭头与管内向下箭头。',
          en: 'Compare sideways blue arrows with the downward tubular arrow.',
        },
      },
      {
        id: 'L064-q3',
        skill: 'reasoning',
        prompt: {
          zh: '重吸收增加、尿量减少，能否证明失去的水已全部补回？',
          en: 'Do more reabsorption and less urine prove all lost water has been replaced?',
        },
        options: [
          {
            zh: '能，因为肾会按需要制造水',
            en: 'Yes: kidneys create water as needed',
          },
          {
            zh: '能，因为尿量等于全部水收支',
            en: 'Yes: urine volume is the entire water budget',
          },
          {
            zh: '不能；减少损失与摄入补充不同，还缺其他收支',
            en: 'No; reducing loss differs from intake and other budget data are missing',
          },
        ],
        correct: 2,
        feedback: {
          zh: '保水改变丢失路线，不能单独证明摄入与所有其他损失已平衡。',
          en: 'Conservation changes a loss route; it cannot alone establish balance between intake and all other losses.',
        },
        revisit: {
          zh: '回看讲解“保住水不等于补进水”与口渴支路。',
          en: 'Revisit conservation versus addition and the thirst branch.',
        },
      },
      {
        id: 'L064-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'Reabsorption指的是哪条方向？',
          en: 'Which direction is reabsorption?',
        },
        options: [
          {
            zh: '管液中的物质回到内环境/血液',
            en: 'Tubular material returning towards internal fluids/blood',
          },
          {
            zh: '血液中的部分成分进入肾小囊',
            en: 'Blood components entering the glomerular capsule',
          },
          {
            zh: '物质从管周血液进入管液',
            en: 'Material entering tubular fluid from surrounding blood',
          },
        ],
        correct: 0,
        feedback: {
          zh: 'Reabsorption中的re-强调返回；与摄入和排出分开追踪。',
          en: 'The re- in reabsorption emphasises return. Track it separately from intake and excretion.',
        },
        revisit: {
          zh: '复习reabsorption词卡，沿横向水路口述。',
          en: 'Review reabsorption and describe the sideways water route.',
        },
      },
    ],
    minutes: 25,
    icon: '↔',
    reference: {
      title: 'OpenStax Biology 2e',
      url: 'https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes',
    },
  },
];
