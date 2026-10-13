import { t, q, term, type Lesson } from '../schema';
export const bodyLessons: Lesson[] = [
  {
    id: 'L013',
    title: t('动物怎样取得食物？', 'How animals feed'),
    icon: '◒',
    minutes: 20,
    summary: t(
      '一口米饭，怎样变成细胞能用的材料？',
      'How does a bite of rice become usable cell material?',
    ),
    hook: t(
      '鸟用喙啄食，我们用牙齿咀嚼。可把米饭嚼碎，就能直接送进手臂细胞吗？跟踪一份午饭，看看身体还要做哪些工作。',
      'Birds peck with beaks; we chew with teeth. Can chewed rice go straight into arm cells? Follow lunch and discover the jobs still to be done.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Digestive processes',
      url: 'https://openstax.org/books/biology-2e/pages/34-3-digestive-system-processes',
    },
    objectives: [
      t(
        '区分取食、消化、吸收与运输。',
        'Distinguish feeding, digestion, absorption and transport.',
      ),
      t(
        '解释动物怎样从食物取得能量来源与建造材料。',
        'Explain how food supplies animals with energy sources and building materials.',
      ),
    ],
    prediction: [
      t(
        '嚼碎后，米粒直接流进肌肉',
        'Chewed rice grains flow straight into muscles',
      ),
      t(
        '先消化成小分子，再吸收和运输',
        'Digest into small molecules, then absorb and transport',
      ),
      t(
        '胃完成一切分解，血液运送食物小块',
        'The stomach does all breakdown; blood carries food pieces',
      ),
    ],
    terms: [
      term(
        '消化',
        'digestion',
        '把食物中的大分子等分解成可吸收的小分子的过程。',
        'Breaking down large food molecules into smaller absorbable molecules.',
      ),
      term(
        '吸收',
        'absorption',
        '消化产物等从消化道进入血液或淋巴的过程。',
        'Movement of digested products and other substances from the gut into blood or lymph.',
      ),
      term(
        '营养物质',
        'nutrient',
        '供身体获取能量、建造和维持功能的物质。',
        'A substance supporting energy supply, construction or body functions.',
      ),
      term(
        '小肠',
        'small intestine',
        '继续消化并吸收多数营养物质的器官。',
        'An organ where digestion continues and most nutrients are absorbed.',
      ),
    ],
    mission: t(
      '回想熟悉的一餐。选米饭或豆腐，用四个箭头说清从入口到细胞的旅程；不用改变饮食或做实验。',
      'Recall a familiar meal. Choose rice or tofu and explain its mouth-to-cell journey with four arrows; no diet changes or experiment needed.',
    ),
    questions: [
      q(
        'L013-q1',
        'concept',
        t(
          '米饭嚼碎后，哪项工作还需要进行？',
          'After rice is chewed, which job remains?',
        ),
        [
          t(
            '淀粉被进一步消化成可吸收的小分子',
            'Further digestion of starch into absorbable molecules',
          ),
          t(
            '颗粒嚼小后，不再需要酶的分解',
            'Small chewed pieces need no enzyme breakdown',
          ),
          t(
            '剩下的工作全部由胃完成',
            'The stomach completes every remaining job',
          ),
        ],
        0,
        t(
          '咀嚼让食物变小，但不是把所有大分子都拆开。消化酶还要继续分解淀粉。',
          'Chewing reduces food size without breaking down every large molecule. Digestive enzymes continue starch breakdown.',
        ),
        t(
          '比较食物旅程第1、2步。',
          'Compare steps 1 and 2 of the food journey.',
        ),
      ),
      q(
        'L013-q2',
        'concept',
        t(
          '小肠吸收葡萄糖，意味着什么？',
          'What does absorption of glucose in the small intestine mean?',
        ),
        [
          t(
            '食物分子在小肠腔内继续被分解',
            'Food molecules continue breaking down inside the gut',
          ),
          t(
            '葡萄糖穿过肠壁进入血液',
            'Glucose crosses the intestinal wall into blood',
          ),
          t(
            '血液沿血管把葡萄糖运到肌肉',
            'Blood carries glucose along vessels towards muscle',
          ),
        ],
        1,
        t(
          '消化是分解；吸收是跨过消化道的边界。血液随后把葡萄糖运往细胞。',
          'Digestion breaks molecules down; absorption crosses the gut boundary. Blood then carries glucose towards cells.',
        ),
        t('回看第3步的肠壁边界。', 'Revisit the gut boundary in step 3.'),
      ),
      q(
        'L013-q3',
        'reasoning',
        t(
          '“吃下豆腐，豆腐块就变成手臂肌肉。”怎样修正？',
          'How would you revise “Tofu chunks become arm muscles”?',
        ),
        [
          t(
            '牙齿磨小豆腐后，食物块直接进入肌肉',
            'Chewed tofu pieces directly enter muscles',
          ),
          t(
            '胃吸收全部蛋白质，再变成肌肉',
            'The stomach absorbs all protein and turns it into muscle',
          ),
          t(
            '蛋白质先消化、吸收和运输，细胞再利用材料',
            'Protein is digested, absorbed and transported; cells then use the materials',
          ),
        ],
        2,
        t(
          '细胞利用氨基酸等材料建造自身蛋白质，不是把豆腐块原样拼进去。图示是简化路线，不是测得的消化速度。',
          'Cells use materials such as amino acids to build their own proteins, rather than adding intact tofu chunks. The diagram is a simplified route, not measured digestion speed.',
        ),
        t('换成豆腐路线，走完四步。', 'Choose tofu and follow all four steps.'),
      ),
      q(
        'L013-q4',
        'vocabulary',
        t(
          '哪个词对应“吸收”？',
          'Which word means movement from the gut into blood or lymph?',
        ),
        [
          t('digestion · 消化', 'digestion'),
          t('absorption · 吸收', 'absorption'),
          t('joint · 关节', 'joint'),
        ],
        1,
        t(
          'Absorption 强调进入身体运输系统；digestion 强调分解食物。',
          'Absorption concerns entry into the body’s transport systems; digestion concerns breakdown.',
        ),
        t('比较两张词卡。', 'Compare the two vocabulary cards.'),
      ),
    ],
  },
  {
    id: 'L014',
    title: t('骨骼、肌肉与运动', 'How bodies move'),
    icon: '⌁',
    minutes: 15,
    summary: t(
      '抬起手臂时，谁在拉，谁在转？',
      'When an arm bends, what pulls and what pivots?',
    ),
    hook: t(
      '拿起一本书时，骨头为什么能转动？骨头在变短，还是肌肉在牵拉？用一个手臂模型找出“拉动”的搭档。',
      'When you pick up a book, why can bones turn? Do bones shorten, or do muscles pull? Find the partners in an arm model.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Joints and skeletal movement',
      url: 'https://openstax.org/books/biology-2e/pages/38-3-joints-and-skeletal-movement',
    },
    objectives: [
      t(
        '连接骨、关节、肌肉和肌腱的作用。',
        'Connect the roles of bones, joints, muscles and tendons.',
      ),
      t(
        '用相反方向的牵拉解释弯臂与伸臂。',
        'Explain bending and straightening through opposing pulls.',
      ),
    ],
    prediction: [
      t('骨头缩短，让手臂弯曲', 'Bones shorten to bend the arm'),
      t(
        '一块肌肉先拉、再主动推骨头',
        'One muscle pulls and then actively pushes a bone',
      ),
      t(
        '不同肌肉牵拉，让骨在关节处转动',
        'Different muscles pull, turning bones at a joint',
      ),
    ],
    terms: [
      term(
        '关节',
        'joint',
        '骨与骨连接的部位；不同关节允许不同运动。',
        'A connection between bones; different joints permit different movements.',
      ),
      term(
        '骨骼肌',
        'skeletal muscle',
        '通过收缩产生牵拉、帮助移动骨骼的肌肉。',
        'Muscle that generates pulling force through contraction to help move bones.',
      ),
      term(
        '肌腱',
        'tendon',
        '连接肌肉和骨的结缔组织。',
        'Connective tissue joining muscle to bone.',
      ),
      term(
        '拮抗作用',
        'antagonistic action',
        '肌肉产生相反方向运动的配合作用。',
        'Cooperation of muscles producing movements in opposing directions.',
      ),
    ],
    mission: t(
      '观察一次自然的拿书动作，或只回看模型。口述谁牵拉、哪里转动、骨的长度有没有变；无需举重或反复运动。',
      'Observe an ordinary book-picking movement or revisit the model. Explain what pulls, where it pivots and whether bone length changes; no weights or repeated exercise needed.',
    ),
    questions: [
      q(
        'L014-q1',
        'concept',
        t(
          '手臂模型弯曲时，什么保持不变？',
          'When the arm model bends, what stays the same?',
        ),
        [
          t('骨的长度', 'Bone length'),
          t('骨之间的角度', 'The angle between bones'),
          t('所有肌肉的形状', 'Every muscle’s shape'),
        ],
        0,
        t(
          '骨围绕关节转动，模型中的骨长度保持固定。角度变化不等于骨变短。',
          'Bones pivot at a joint while their model lengths remain fixed. A changed angle does not mean shorter bones.',
        ),
        t(
          '比较弯臂的第一帧与最后一帧。',
          'Compare the first and last bending frames.',
        ),
      ),
      q(
        'L014-q2',
        'concept',
        t(
          '肌腱在这个配合中做什么？',
          'What does a tendon do in this partnership?',
        ),
        [
          t(
            '连接骨与骨，限制关节过度移动',
            'Connects bone to bone and limits excessive joint motion',
          ),
          t(
            '连接肌肉和骨，传递牵拉',
            'Connects muscle to bone and transmits a pull',
          ),
          t(
            '自己收缩并主动推骨头',
            'Contracts itself and actively pushes bones',
          ),
        ],
        1,
        t(
          '肌肉收缩产生牵拉，肌腱把力传到骨。连接骨与骨的韧带是另一种结构。',
          'Muscle contraction generates a pull that tendons transmit to bone. Ligaments connecting bones are different structures.',
        ),
        t('看模型中的虚线肌腱。', 'Look at the dashed tendons in the model.'),
      ),
      q(
        'L014-q3',
        'reasoning',
        t(
          '“弯臂肌放松，就会主动把骨推回去。”哪里有问题？',
          'What is wrong with “A relaxed flexor actively pushes the bone back”?',
        ),
        [
          t(
            '角度变化一定意味着骨的长度改变',
            'A changing angle must mean changing bone length',
          ),
          t(
            '肌肉一放松，关节就不需要任何力也能伸直',
            'Relaxation alone straightens a joint without any force',
          ),
          t(
            '放松不是主动推；伸肌的牵拉可使手臂伸直',
            'Relaxation is not active pushing; an extensor can pull the arm straight',
          ),
        ],
        2,
        t(
          '骨骼肌主要产生牵拉。这里用屈肌与伸肌说明相反方向动作；真实动作还有多块肌肉、神经和外力参与。',
          'Skeletal muscles generate pulls. A flexor and extensor illustrate opposing actions; real movement also involves other muscles, nerves and external forces.',
        ),
        t(
          '切到伸臂，观察另一块肌肉。',
          'Switch to straightening and observe the other muscle.',
        ),
      ),
      q(
        'L014-q4',
        'vocabulary',
        t(
          '哪个词表示骨与骨连接的部位？',
          'Which word names a connection between bones?',
        ),
        [
          t('nutrient · 营养物质', 'nutrient'),
          t('receptor · 感受器', 'receptor'),
          t('joint · 关节', 'joint'),
        ],
        2,
        t(
          'Joint 是关节；tendon 是肌腱，连接肌肉与骨。',
          'A joint connects bones; a tendon connects muscle and bone.',
        ),
        t('回看 joint 词卡。', 'Revisit the joint card.'),
      ),
    ],
  },
  {
    id: 'L015',
    title: t('心脏和肺不停工作', 'Heart and lungs at work'),
    icon: '♡',
    minutes: 20,
    summary: t(
      '空气里的氧，怎样抵达脚上的细胞？',
      'How does oxygen in air reach cells in your feet?',
    ),
    hook: t(
      '走上楼梯，腿部细胞需要可用能量。肺在胸口，腿在下面，氧怎样跨过这段距离？跟踪氧的到达与二氧化碳的返回。',
      'Climbing stairs uses energy in leg cells. Lungs are in the chest and legs below: how does oxygen bridge that gap? Follow oxygen in and carbon dioxide back.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Heart and circulation',
      url: 'https://openstax.org/books/biology-2e/pages/40-3-mammalian-heart-and-blood-vessels',
    },
    objectives: [
      t(
        '区分肺的气体交换与心脏的泵血。',
        'Distinguish lung gas exchange from heart pumping.',
      ),
      t(
        '连起氧到细胞、二氧化碳回肺的路线。',
        'Connect oxygen delivery with carbon dioxide return.',
      ),
    ],
    prediction: [
      t(
        '吸进的整团空气由心脏直接输送到腿',
        'The heart sends inhaled air intact straight to the legs',
      ),
      t(
        '肺交换气体，心脏推动血液运输',
        'Lungs exchange gases; the heart drives blood transport',
      ),
      t(
        '肺能完成全身运输，不需要心脏接力',
        'Lungs do all body transport without help from the heart',
      ),
    ],
    terms: [
      term(
        '气体交换',
        'gas exchange',
        '氧与二氧化碳等气体跨过交换表面的过程。',
        'Movement of gases such as oxygen and carbon dioxide across an exchange surface.',
      ),
      term(
        '循环',
        'circulation',
        '血液沿心脏和血管通路流动。',
        'Blood flow through the heart and vessels.',
      ),
      term(
        '肺泡',
        'alveolus',
        '肺中参与气体交换的小气囊。',
        'A small air sac in the lung involved in gas exchange.',
      ),
      term(
        '细胞呼吸',
        'cellular respiration',
        '细胞从有机物中释放可用能量的过程。',
        'Cell processes that release usable energy from organic substances.',
      ),
    ],
    mission: t(
      '不用跑步或憋气，在纸上画两条路线：氧怎样到肌肉，二氧化碳怎样返回。再接上食物中的养分。',
      'Without running or holding your breath, sketch oxygen delivery and carbon dioxide return. Add a route for nutrients from food.',
    ),
    questions: [
      q(
        'L015-q1',
        'concept',
        t('哪一组分工正确？', 'Which partnership is correct?'),
        [
          t(
            '肺交换气体；心脏泵血',
            'Lungs exchange gases; the heart pumps blood',
          ),
          t(
            '心脏交换气体；肺泵血',
            'The heart exchanges gases; lungs pump blood',
          ),
          t(
            '肺和心脏都只负责吸气和呼气',
            'Lungs and heart both only inhale and exhale',
          ),
        ],
        0,
        t(
          '氧在肺的交换表面进入血液；不是把一口空气原样吹进血管。心脏推动血液流动。',
          'Oxygen enters blood across lung exchange surfaces; a breath is not blown intact into vessels. The heart drives blood flow.',
        ),
        t(
          '点击器官地图的肺与心脏。',
          'Select lungs and heart on the organ map.',
        ),
      ),
      q(
        'L015-q2',
        'concept',
        t(
          '细胞产生的二氧化碳怎样离开？',
          'How does carbon dioxide produced by cells leave?',
        ),
        [
          t(
            '血液直接回肺，不需要经过心脏',
            'Blood returns straight to lungs without passing the heart',
          ),
          t(
            '血液带回右心，再到肺，随呼气排出',
            'Blood carries it to the right heart, then lungs, for exhalation',
          ),
          t(
            '留在细胞里，只有氧能被血液运输',
            'It stays in cells; only oxygen can travel in blood',
          ),
        ],
        1,
        t(
          '回程也需要循环。右心把血液送向肺；肺再把二氧化碳转移到呼出的气体。',
          'The return also needs circulation. The right heart sends blood towards lungs, where carbon dioxide enters exhaled air.',
        ),
        t(
          '选择二氧化碳回程并走完四步。',
          'Follow all four carbon dioxide return steps.',
        ),
      ),
      q(
        'L015-q3',
        'reasoning',
        t(
          '“只要肺吸进氧，腿部细胞就自动得到氧。”漏了什么？',
          'What is missing from “Once lungs take in oxygen, leg cells automatically receive it”?',
        ),
        [
          t(
            '肺与细胞用同一条空气管直接连接',
            'Lungs and cells connect directly through one air tube',
          ),
          t(
            '氧在肺已变成能量，细胞不用再参与',
            'Oxygen becomes energy in lungs; cells need no further role',
          ),
          t(
            '跨入血液、经心脏和血管运输，再进入组织细胞',
            'Entry into blood, heart-and-vessel transport and delivery to tissue cells',
          ),
        ],
        2,
        t(
          '器官要通过通路合作。肺、心脏或肌肉单独一个，都不能说明整条供氧路线。',
          'Organs cooperate through connected routes. Lungs, heart or muscle alone cannot explain the entire oxygen pathway.',
        ),
        t(
          '在器官地图上连起肺、心脏与肌肉。',
          'Connect lungs, heart and muscle on the map.',
        ),
      ),
      q(
        'L015-q4',
        'vocabulary',
        t(
          '哪个词表示血液在心脏与血管中流动？',
          'Which word means blood flow through heart and vessels?',
        ),
        [
          t('circulation · 循环', 'circulation'),
          t('absorption · 吸收', 'absorption'),
          t('stimulus · 刺激', 'stimulus'),
        ],
        0,
        t(
          'Circulation 是循环；gas exchange 是气体交换，两者相互配合。',
          'Circulation and gas exchange are different cooperating processes.',
        ),
        t('复习 circulation 词卡。', 'Revisit the circulation card.'),
      ),
    ],
  },
  {
    id: 'L016',
    title: t('感官如何认识世界？', 'Our senses'),
    icon: '◉',
    minutes: 15,
    summary: t(
      '听到沙沙声，就一定知道是谁吗？',
      'Does a rustle tell you exactly who made it?',
    ),
    hook: t(
      '窗边传来“沙沙”声。你想到猫、纸袋，还是窗帘？感官给我们线索，脑怎样把线索变成解释？多看一眼，解释会不会改变？',
      'A rustle comes from a window. A cat, a paper bag or a curtain? Senses supply clues: how does the brain interpret them? Could another look change your explanation?',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Sensory processes',
      url: 'https://openstax.org/books/biology-2e/pages/36-1-sensory-processes',
    },
    objectives: [
      t(
        '连接刺激、感受器、神经信号与脑的解释。',
        'Connect stimuli, receptors, nerve signals and brain interpretation.',
      ),
      t(
        '区分直接线索和关于原因的推测。',
        'Separate direct clues from inferences about causes.',
      ),
    ],
    prediction: [
      t(
        '耳朵把一小团声音塞进脑',
        'Ears put a small lump of sound into the brain',
      ),
      t(
        '感受器把刺激转成神经信号，脑参与解释',
        'Receptors convert stimuli to nerve signals; the brain interprets',
      ),
      t(
        '只要听清声音，就能唯一确定声源',
        'Hearing a sound clearly uniquely identifies its source',
      ),
    ],
    terms: [
      term(
        '刺激',
        'stimulus',
        '能被感受系统检测的变化，如光或振动。',
        'A change detectable by a sensory system, such as light or vibration.',
      ),
      term(
        '感受器',
        'receptor',
        '响应特定刺激并参与信号转换的细胞或结构。',
        'A cell or structure responding to certain stimuli and helping convert signals.',
      ),
      term(
        '神经',
        'nerve',
        '传递信号的神经纤维束。',
        'A bundle of nerve fibres carrying signals.',
      ),
      term(
        '知觉',
        'perception',
        '脑对感官信息的组织与解释。',
        'The brain’s organisation and interpretation of sensory information.',
      ),
    ],
    mission: t(
      '安静地观察身边一个熟悉物体，用两种可用的感官记录线索。把“我看见/听见”与“我推测”分开，不需要尝味、强光或大声音。',
      'Quietly observe a familiar nearby object with two available senses. Separate “I see/hear” from “I infer”; no tasting, bright lights or loud sounds needed.',
    ),
    questions: [
      q(
        'L016-q1',
        'concept',
        t(
          '声音信息从耳朵到脑，靠什么传递？',
          'What carries sound information from ear to brain?',
        ),
        [
          t('一团空气直接进入脑', 'A lump of air goes into the brain'),
          t('神经信号', 'Nerve signals'),
          t('食物颗粒', 'Food particles'),
        ],
        1,
        t(
          '耳内感受细胞响应振动，参与把刺激转换为神经系统中的信号。脑参与识别与解释。',
          'Sensory cells in the ear respond to vibration and help convert the stimulus into nervous-system signals. The brain identifies and interprets them.',
        ),
        t(
          '回看路径的感受器和神经两步。',
          'Revisit the receptor and nerve steps.',
        ),
      ),
      q(
        'L016-q2',
        'concept',
        t(
          '“听到沙沙声”与“猫在窗边”有什么区别？',
          'How do “I hear a rustle” and “A cat is at the window” differ?',
        ),
        [
          t(
            '前者是线索，后者是对原因的推测',
            'The first is a clue; the second infers a cause',
          ),
          t(
            '只要声音听清了，两句都能证明有猫',
            'If heard clearly, both prove a cat is present',
          ),
          t(
            '猫的身份是耳朵直接听见的，不需要推测',
            'The ear directly hears a cat’s identity; no inference is needed',
          ),
        ],
        0,
        t(
          '同一种沙沙声可以有不同来源。感官有用，但从线索到原因还需要推理和更多证据。',
          'A rustle can have different sources. Senses are useful, but identifying a cause requires reasoning and further evidence.',
        ),
        t(
          '比较“只有声音”与“再看一眼”。',
          'Compare sound only with another look.',
        ),
      ),
      q(
        'L016-q3',
        'reasoning',
        t(
          '又看见窗帘在动。哪个结论最有根据？',
          'You also see the curtain move. Which conclusion is best supported?',
        ),
        [
          t(
            '窗帘在动，证明猫完全没有参与',
            'A moving curtain proves a cat had no involvement',
          ),
          t(
            '新视觉线索对声源解释没有帮助',
            'The new visual clue does not help explain the source',
          ),
          t(
            '窗帘可能是声源，仍可查看是否有其他来源',
            'The curtain may be the source; other possible sources can still be checked',
          ),
        ],
        2,
        t(
          '新线索能帮助修正解释，但看见窗帘动并不排除所有其他声源。把确定程度说清，是证据推理的一部分。',
          'New clues can revise an explanation, without excluding every other source. Stating how certain you are is part of evidence-based reasoning.',
        ),
        t(
          '回看第4步的两种线索结论。',
          'Revisit the two-clue conclusion in step 4.',
        ),
      ),
      q(
        'L016-q4',
        'vocabulary',
        t(
          '响应光或振动等刺激的细胞/结构叫作什么？',
          'What is a cell or structure responding to stimuli such as light or vibration called?',
        ),
        [
          t('tendon · 肌腱', 'tendon'),
          t('nutrient · 营养物质', 'nutrient'),
          t('receptor · 感受器', 'receptor'),
        ],
        2,
        t(
          'Receptor 是感受器，不同感受器响应不同类型的刺激。',
          'A receptor responds to stimuli; different receptors respond to different types.',
        ),
        t('复习 receptor 词卡。', 'Revisit the receptor card.'),
      ),
    ],
  },
];
