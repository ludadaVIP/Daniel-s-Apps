import type { Lesson } from '../schema';
export const cellLessons: Lesson[] = [
  {
    id: 'L025',
    title: {
      zh: '动物细胞结构',
      en: 'Inside an animal cell',
    },
    minutes: 20,
    icon: '◎',
    summary: {
      zh: '脸颊里的一小格，为什么不是装水的空袋子？',
      en: 'Why is a cheek cell more than a bag of water?',
    },
    hook: {
      zh: '你吃东西时，口腔内表面的细胞一直在维持边界、更新蛋白质。把一格典型动物细胞转过来，找出这些工作怎样配合。这里用模型，不用采集口腔样本。',
      en: 'Cells lining your mouth maintain boundaries and renew proteins as you eat. Turn a typical animal-cell model and investigate how these jobs cooperate. No cheek sampling is needed.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells',
    },
    objectives: [
      {
        zh: '指出膜、细胞质、核、线粒体与核糖体，并联系它们的作用。',
        en: 'Locate the membrane, cytoplasm, nucleus, mitochondria and ribosomes, connecting them to jobs.',
      },
      {
        zh: '区分教学模型展示的结构与普通光学图像能提供的证据。',
        en: 'Distinguish modelled structures from evidence available in an ordinary light-microscope image.',
      },
    ],
    prediction: [
      {
        zh: '内部只有水，细胞核做所有工作',
        en: 'Only water is inside; the nucleus does every job',
      },
      {
        zh: '不同结构协作，转动图不会改变各自功能',
        en: 'Structures cooperate; turning the diagram does not change their jobs',
      },
      {
        zh: '每个动物细胞一定都是圆形',
        en: 'Every animal cell must be round',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞膜',
          en: 'cell membrane',
        },
        meaning: {
          zh: '分隔内外，并选择性调节物质交换。',
          en: 'Separates inside from outside and selectively regulates exchange.',
        },
      },
      {
        word: {
          zh: '细胞质',
          en: 'cytoplasm',
        },
        meaning: {
          zh: '细胞膜内、细胞核外的区域，含液体、结构与许多反应。',
          en: 'The region inside the membrane but outside the nucleus, containing fluid, structures and many reactions.',
        },
      },
      {
        word: {
          zh: '细胞核',
          en: 'nucleus',
        },
        meaning: {
          zh: '这类细胞内储存大部分DNA，参与调节活动。',
          en: 'Stores most DNA in these cells and helps regulate activities.',
        },
      },
      {
        word: {
          zh: '线粒体',
          en: 'mitochondrion',
        },
        meaning: {
          zh: '承担有氧细胞呼吸的重要步骤，把养分中的能量转移到ATP。',
          en: 'Carries out major stages of aerobic respiration, transferring nutrient energy to ATP.',
        },
      },
      {
        word: {
          zh: '核糖体',
          en: 'ribosome',
        },
        meaning: {
          zh: '按信息把氨基酸连接成蛋白质的小结构。',
          en: 'A small structure assembling amino acids into proteins using information.',
        },
      },
      {
        word: {
          zh: 'DNA',
          en: 'DNA',
        },
        meaning: {
          zh: '能储存遗传信息的分子，不是会思考的小脑袋。',
          en: 'A molecule storing genetic information, not a thinking miniature brain.',
        },
      },
    ],
    mission: {
      zh: '不采样：画出膜、细胞质、核和一个线粒体，把每个部位与一种工作连起来。再写一句：图中的哪些细节不能说是我用裸眼看见的？',
      en: 'Without sampling, sketch membrane, cytoplasm, nucleus and a mitochondrion, linking each to a job. State which details you cannot claim to have seen with the naked eye.',
    },
    questions: [
      {
        id: 'L025-q1',
        skill: 'concept',
        prompt: {
          zh: '动物细胞的“边界调节”主要关联哪个结构？',
          en: 'Which structure mainly regulates an animal cell’s boundary?',
        },
        options: [
          {
            zh: '细胞膜',
            en: 'Cell membrane',
          },
          {
            zh: '细胞壁',
            en: 'Cell wall',
          },
          {
            zh: '叶绿体',
            en: 'Chloroplast',
          },
        ],
        correct: 0,
        feedback: {
          zh: '典型动物细胞没有植物式细胞壁。膜分隔内外并选择性调节交换；不是一层绝对不透的塑料。',
          en: 'Typical animal cells lack a plant-style wall. Their membrane separates inside from outside and selectively regulates exchange; it is not impermeable plastic.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L025-q2',
        skill: 'concept',
        prompt: {
          zh: '把细胞图转90°，以下哪项应该改变？',
          en: 'After turning the cell diagram by 90°, what should change?',
        },
        options: [
          {
            zh: '核糖体开始储存大部分DNA',
            en: 'Ribosomes begin storing most DNA',
          },
          {
            zh: '屏幕位置改变，结构与功能关系保持',
            en: 'Screen positions change; structure–function relationships remain',
          },
          {
            zh: '线粒体变成细胞核',
            en: 'Mitochondria become nuclei',
          },
        ],
        correct: 1,
        feedback: {
          zh: '转动只是改变模型的朝向。细胞功能不由“屏幕左边或右边”决定。',
          en: 'Rotation changes model orientation, not identity or function. Screen left and right do not determine cell jobs.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L025-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一张普通光学口腔细胞图没有清楚的小点，能证明没有核糖体吗？',
          en: 'An ordinary cheek-cell light micrograph shows no clear tiny dots. Does this establish absence of ribosomes?',
        },
        options: [
          {
            zh: '能，没看见就不存在',
            en: 'Yes; unseen means absent',
          },
          {
            zh: '不能，但因此所有细胞必定都有细胞壁',
            en: 'No, so all cells must have walls',
          },
          {
            zh: '不能，观察工具与分辨能力有限，需别的证据',
            en: 'No; resolution and preparation limit observation, so other evidence is needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型能标出工具难以分辨的结构。没有看清不是不存在；普通光学图也不能直接证明所有功能正在进行。',
          en: 'Models can show structures beyond a tool’s resolution. Failure to resolve is not absence, nor does an ordinary image prove all depicted activities.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L025-q4',
        skill: 'vocabulary',
        prompt: {
          zh: '哪个英文词指把氨基酸组装成蛋白质的结构？',
          en: 'Which English term names a structure assembling amino acids into proteins?',
        },
        options: [
          {
            zh: 'nucleus',
            en: 'nucleus',
          },
          {
            zh: 'ribosome',
            en: 'ribosome',
          },
          {
            zh: 'cell wall',
            en: 'cell wall',
          },
        ],
        correct: 1,
        feedback: {
          zh: '核糖体是ribosome，细胞核是nucleus。核提供信息，核糖体承担组装，不能互换。',
          en: 'Ribosome names the assembly structure; nucleus stores information. Their cooperating jobs are distinct.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
    ],
  },
  {
    id: 'L026',
    title: {
      zh: '植物细胞结构',
      en: 'Inside a plant cell',
    },
    minutes: 20,
    icon: '▧',
    summary: {
      zh: '洋葱来自植物，为什么这一格没有叶绿体？',
      en: 'An onion is a plant. Why does this cell lack chloroplasts?',
    },
    hook: {
      zh: '绿色叶片与地下洋葱鳞叶，都是植物的一部分。它们的细胞有共同结构，却不一定做同样的工作。切换两格模型，找到“都有”和“因工作而异”。',
      en: 'A green leaf and an underground onion bulb are parts of plants. Their cells share structures but need not do the same jobs. Compare two models to discover what is shared and what varies.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells',
    },
    objectives: [
      {
        zh: '比较细胞壁与膜的位置及作用，找出植物和动物细胞的共性。',
        en: 'Compare wall and membrane positions and jobs, finding features shared by plant and animal cells.',
      },
      {
        zh: '解释为什么不能把叶绿体画进每个植物细胞。',
        en: 'Explain why chloroplasts should not be drawn in every plant cell.',
      },
    ],
    prediction: [
      {
        zh: '每个植物细胞都必须有叶绿体',
        en: 'Every plant cell must contain chloroplasts',
      },
      {
        zh: '细胞壁代替了细胞膜',
        en: 'The cell wall replaces the membrane',
      },
      {
        zh: '植物细胞仍有膜与线粒体，叶绿体取决于类型',
        en: 'Plant cells still have membranes and mitochondria; chloroplasts depend on cell type',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞壁',
          en: 'cell wall',
        },
        meaning: {
          zh: '植物细胞膜外的支持结构，主要含纤维素。',
          en: 'A supporting structure outside a plant cell membrane, mainly containing cellulose.',
        },
      },
      {
        word: {
          zh: '叶绿体',
          en: 'chloroplast',
        },
        meaning: {
          zh: '含叶绿素、进行光合作用的细胞器；不是所有植物细胞都有。',
          en: 'A chlorophyll-containing organelle carrying out photosynthesis; absent from many plant cells.',
        },
      },
      {
        word: {
          zh: '液泡',
          en: 'vacuole',
        },
        meaning: {
          zh: '被膜包围、含细胞液的结构；成熟植物细胞常有大中央液泡。',
          en: 'A membrane-bound compartment containing cell sap; mature plant cells often have a large central vacuole.',
        },
      },
      {
        word: {
          zh: '叶肉',
          en: 'mesophyll',
        },
        meaning: {
          zh: '叶片中承担大量光合作用的内部组织。',
          en: 'Internal leaf tissue carrying out much of a leaf’s photosynthesis.',
        },
      },
      {
        word: {
          zh: '纤维素',
          en: 'cellulose',
        },
        meaning: {
          zh: '植物细胞壁的一种主要材料，不是细胞的膜。',
          en: 'A major plant-wall material, distinct from the cell membrane.',
        },
      },
    ],
    mission: {
      zh: '用现有洋葱或照片，与一片绿叶作外观对照。再借助课程模型写出两格细胞的共同结构和一个差别，标清“模型推断”，不用切片、染色或买显微镜。',
      en: 'Compare an existing onion or photo with a green leaf. Use lesson models to record shared cell structures and one difference, labelled as model-based inference. No slicing, staining or microscope purchase needed.',
    },
    questions: [
      {
        id: 'L026-q1',
        skill: 'concept',
        prompt: {
          zh: '叶肉细胞的细胞壁内侧还应有什么边界？',
          en: 'What boundary lies inside a mesophyll cell wall?',
        },
        options: [
          {
            zh: '没有其他边界',
            en: 'No other boundary',
          },
          {
            zh: '细胞膜',
            en: 'Cell membrane',
          },
          {
            zh: '第二个叶绿体外壳',
            en: 'A second chloroplast shell',
          },
        ],
        correct: 1,
        feedback: {
          zh: '壁在膜外侧，提供支持；膜选择性调节细胞内外交换。一个不代替另一个。',
          en: 'The wall supports the cell outside the membrane. The membrane selectively regulates exchange; one does not replace the other.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L026-q2',
        skill: 'concept',
        prompt: {
          zh: '地下洋葱鳞叶的典型表皮细胞没有叶绿体，哪项解释合理？',
          en: 'A typical epidermal cell of an underground onion bulb lacks chloroplasts. What is reasonable?',
        },
        options: [
          {
            zh: '它仍是植物细胞，所在部位通常不是主要光合作用场所',
            en: 'It is still a plant cell; that part is usually not a main photosynthetic site',
          },
          {
            zh: '它一定是动物细胞',
            en: 'It must be an animal cell',
          },
          {
            zh: '它既没有叶绿体，也不需要细胞呼吸',
            en: 'Without chloroplasts it has no need for respiration',
          },
        ],
        correct: 0,
        feedback: {
          zh: '不同植物细胞因位置和工作而异。典型地下鳞叶不代表绿色叶肉，缺叶绿体也不代表缺线粒体。',
          en: 'Plant cells vary with location and role. Typical underground bulb epidermis differs from green mesophyll; lacking chloroplasts does not mean lacking mitochondria.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L026-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只有一张“砖块形”的图，怎样更可靠地比较植物和动物细胞？',
          en: 'With only a brick-shaped drawing, how can you compare plant and animal cells more reliably?',
        },
        options: [
          {
            zh: '只按形状猜，越方越像植物',
            en: 'Judge only by how square it is',
          },
          {
            zh: '把所有绿色小块叫作线粒体',
            en: 'Call all green blobs mitochondria',
          },
          {
            zh: '核对外侧壁、内侧膜和来源，并说明图示的简化',
            en: 'Check wall, inner membrane and source, stating the drawing’s simplifications',
          },
        ],
        correct: 2,
        feedback: {
          zh: '真实细胞形状多样。图的来源、结构证据和限制比单凭形状可靠；本课三个模型都不是实测照片。',
          en: 'Real shapes vary. Source, structural evidence and limits are stronger than shape alone; the three models are not measured micrographs.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L026-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'vacuole在本课代表什么？',
          en: 'What does vacuole mean here?',
        },
        options: [
          {
            zh: '细胞外的空空气',
            en: 'Empty air outside the cell',
          },
          {
            zh: '含细胞液、由膜包围的结构',
            en: 'A membrane-bound compartment containing cell sap',
          },
          {
            zh: '每个植物细胞都有的大脑',
            en: 'A brain in every plant cell',
          },
        ],
        correct: 1,
        feedback: {
          zh: '液泡含细胞液，成熟植物细胞常有大中央液泡；不是空气洞。形态与大小随细胞类型和状态变化。',
          en: 'A vacuole contains cell sap rather than air. Mature plant cells often have a large central vacuole, with size varying by type and state.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
    ],
  },
  {
    id: 'L027',
    title: {
      zh: '细胞器各做什么？',
      en: 'Cell parts and jobs',
    },
    minutes: 20,
    icon: '⇢',
    summary: {
      zh: '叶片到了夜晚，细胞就停工了吗？',
      en: 'Do leaf cells shut down at night?',
    },
    hook: {
      zh: '白天叶片利用光制造糖。夜晚没有光，叶片细胞仍要维持边界、制造蛋白质、获取可用能量。沿着信息、原料与能量的线索，看看谁与谁合作。',
      en: 'Leaves use light to make sugars by day. At night, their cells still maintain boundaries, make proteins and obtain usable energy. Follow information, materials and energy to see how parts cooperate.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells',
    },
    objectives: [
      {
        zh: '把核、核糖体、线粒体和叶绿体与不同任务连接。',
        en: 'Connect nucleus, ribosomes, mitochondria and chloroplasts with different tasks.',
      },
      {
        zh: '区分光合作用与细胞呼吸，说明植物昼夜都可能呼吸。',
        en: 'Distinguish photosynthesis from cellular respiration, explaining plant respiration by day and night.',
      },
    ],
    prediction: [
      {
        zh: '没有光就没有任何细胞活动',
        en: 'Without light there is no cellular activity',
      },
      {
        zh: '有储存养分和适宜条件，夜晚仍可呼吸与更新蛋白质',
        en: 'With stored nutrients and suitable conditions, cells can respire and renew proteins at night',
      },
      {
        zh: '叶绿体负责所有蛋白质制造',
        en: 'Chloroplasts make all proteins',
      },
    ],
    terms: [
      {
        word: {
          zh: '细胞器',
          en: 'organelle',
        },
        meaning: {
          zh: '细胞内承担特定作用的结构，例如核、线粒体与叶绿体。',
          en: 'A specialised structure inside a cell, such as a nucleus, mitochondrion or chloroplast.',
        },
      },
      {
        word: {
          zh: '细胞呼吸',
          en: 'cellular respiration',
        },
        meaning: {
          zh: '把养分中的化学能转移到细胞可利用的形式。',
          en: 'Transfers chemical energy in nutrients into forms a cell can use.',
        },
      },
      {
        word: {
          zh: 'ATP',
          en: 'ATP',
        },
        meaning: {
          zh: '细胞中可快速转移能量的一种分子，不是食物或电。',
          en: 'A molecule used for rapid energy transfer in cells, not food or electricity.',
        },
      },
      {
        word: {
          zh: '蛋白质',
          en: 'protein',
        },
        meaning: {
          zh: '由氨基酸构成，参与结构、运输和许多反应等工作。',
          en: 'Made of amino acids, with roles in structure, transport and many reactions.',
        },
      },
      {
        word: {
          zh: '氨基酸',
          en: 'amino acid',
        },
        meaning: {
          zh: '制造蛋白质的基本原料。',
          en: 'A building block used to make proteins.',
        },
      },
      {
        word: {
          zh: '光合作用',
          en: 'photosynthesis',
        },
        meaning: {
          zh: '利用光能，以水与二氧化碳合成糖等有机物。',
          en: 'Uses light energy, water and carbon dioxide to make sugars and other organic substances.',
        },
      },
    ],
    mission: {
      zh: '为一格叶肉细胞画白天与夜晚两栏。标出哪里需要光，哪里利用已有糖；另画核的信息副本到核糖体的路线。别把DNA画成离开细胞核运输能量的箭头。',
      en: 'Draw day and night columns for a mesophyll cell. Mark the light-dependent job and the use of existing sugars. Add an information-copy route from nucleus to ribosomes; do not draw DNA leaving the nucleus to carry energy.',
    },
    questions: [
      {
        id: 'L027-q1',
        skill: 'concept',
        prompt: {
          zh: '有氧气和已有糖的叶肉细胞在夜晚，哪项仍可进行？',
          en: 'At night, with oxygen and existing sugar, what can a mesophyll cell still do?',
        },
        options: [
          {
            zh: '不需要光的细胞呼吸',
            en: 'Cellular respiration without light',
          },
          {
            zh: '没有光也持续进行需光的光合作用',
            en: 'Light-dependent photosynthesis without light',
          },
          {
            zh: '只能利用叶绿体呼吸',
            en: 'Respire only through chloroplasts',
          },
        ],
        correct: 0,
        feedback: {
          zh: '光合作用需要光。细胞呼吸可利用已有养分，线粒体承担其重要步骤，植物昼夜都需要可用能量。',
          en: 'Photosynthesis needs light. Respiration can use existing nutrients, with major stages in mitochondria; plants need usable energy by day and night.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L027-q2',
        skill: 'concept',
        prompt: {
          zh: '核的信息、核糖体与线粒体的协作，哪项更准确？',
          en: 'Which account of nucleus, ribosomes and mitochondria cooperating is more accurate?',
        },
        options: [
          {
            zh: '细胞核把DNA送出，直接变成能量',
            en: 'The nucleus exports DNA that becomes energy',
          },
          {
            zh: '线粒体自己制造所有蛋白质和糖',
            en: 'Mitochondria make every protein and sugar',
          },
          {
            zh: '信息副本指导组装，核糖体用原料制造蛋白质，能量支持过程',
            en: 'An information copy guides assembly; ribosomes use materials to make proteins, supported by energy',
          },
        ],
        correct: 2,
        feedback: {
          zh: '核内信息可通过RNA副本指导蛋白质组装。原料、信息与能量不同，箭头不是把DNA搬去“烧掉”。',
          en: 'Nuclear information can guide protein assembly through RNA copies. Materials, information and energy are different; DNA is not carried away to burn.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L027-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型显示植物夜晚仍呼吸，为什么不能推断任意叶片夜晚的呼吸量？',
          en: 'Why can this model not predict the nighttime respiration amount of any leaf?',
        },
        options: [
          {
            zh: '因为植物实际从不呼吸',
            en: 'Because plants never respire',
          },
          {
            zh: '模型假定细胞活着且有养分氧气，没有数量、温度或实测速率',
            en: 'It assumes viable cells with nutrients and oxygen, without quantities, temperature or measured rates',
          },
          {
            zh: '因为夜晚所有植物都完全相同',
            en: 'Because all plants are identical at night',
          },
        ],
        correct: 1,
        feedback: {
          zh: '这只是条件与作用的定性模型，不是速率模拟。种类、状态、温度和养分等都会影响真实活动。',
          en: 'This qualitative model represents conditions and jobs, not rates. Species, state, temperature and nutrient supply affect real activity.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L027-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'cellular respiration与breathing的关系怎样？',
          en: 'How does cellular respiration relate to breathing?',
        },
        options: [
          {
            zh: '两个词完全同义',
            en: 'They are identical',
          },
          {
            zh: '只有动物有cellular respiration',
            en: 'Only animals have cellular respiration',
          },
          {
            zh: '前者是细胞过程，后者是吸气呼气等通气动作',
            en: 'The first is a cellular process; the second is ventilation such as inhaling and exhaling',
          },
        ],
        correct: 2,
        feedback: {
          zh: '植物细胞也可进行cellular respiration。吸气呼气能帮助动物供应氧，却不是细胞内能量转移过程本身。',
          en: 'Plant cells can respire too. Ventilation helps supply animals with oxygen but is distinct from energy transfer within cells.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
    ],
  },
  {
    id: 'L028',
    title: {
      zh: '从细胞到器官',
      en: 'Cells, tissues and organs',
    },
    minutes: 20,
    icon: '▥',
    summary: {
      zh: '一格会制糖的细胞，为什么还不能代替整片叶？',
      en: 'Why can one sugar-making cell not replace a whole leaf?',
    },
    hook: {
      zh: '一格叶肉细胞能做光合作用，叶片却还需要保护、交换和运输。换到小肠：吸收细胞也离不开组织与整个器官。用两条路线追踪“分工怎样变成合作”。',
      en: 'A mesophyll cell can photosynthesise, yet a leaf also needs protection, exchange and transport. In the intestine, an absorptive cell also relies on tissues and an organ. Trace two routes from specialisation to cooperation.',
    },
    reference: {
      title: 'OpenStax Biology 2e · The Plant Body',
      url: 'https://openstax.org/books/biology-2e/pages/30-1-the-plant-body',
    },
    objectives: [
      {
        zh: '联系细胞、组织、器官与个体，区分细胞器和器官。',
        en: 'Connect cells, tissues, organs and organisms, distinguishing an organelle from an organ.',
      },
      {
        zh: '用两种以上组织的协作解释叶片或小肠为何是器官。',
        en: 'Explain a leaf or intestine as an organ through cooperation between multiple tissues.',
      },
    ],
    prediction: [
      {
        zh: '只要有一格叶肉细胞，就等于拥有完整叶片',
        en: 'One mesophyll cell is already a whole leaf',
      },
      {
        zh: '组织和器官只是同一个东西的两个名字',
        en: 'Tissue and organ are two names for the same thing',
      },
      {
        zh: '不同组织协作，器官才完成较完整的工作',
        en: 'Different tissues cooperate so an organ can perform a broader job',
      },
    ],
    terms: [
      {
        word: {
          zh: '特化',
          en: 'specialisation',
        },
        meaning: {
          zh: '细胞的结构和活动适合某种工作。',
          en: 'Cell structures and activities suited to particular jobs.',
        },
      },
      {
        word: {
          zh: '组织',
          en: 'tissue',
        },
        meaning: {
          zh: '承担相关功能的细胞及周围物质组成的结构，不必每格完全一样。',
          en: 'Cells and surrounding material working in related functions; cells need not all be identical.',
        },
      },
      {
        word: {
          zh: '器官',
          en: 'organ',
        },
        meaning: {
          zh: '由不同组织协作完成特定功能的结构。',
          en: 'A structure in which different tissues cooperate in a function.',
        },
      },
      {
        word: {
          zh: '上皮组织',
          en: 'epithelial tissue',
        },
        meaning: {
          zh: '覆盖表面或衬在内部，依位置承担保护、吸收等作用。',
          en: 'Covers surfaces or lines spaces, with jobs such as protection or absorption depending on location.',
        },
      },
      {
        word: {
          zh: '运输组织',
          en: 'vascular tissue',
        },
        meaning: {
          zh: '植物中包括运输水与矿质养分的木质部、运输有机物的韧皮部。',
          en: 'Plant tissue including xylem for water and minerals and phloem for organic substances.',
        },
      },
    ],
    mission: {
      zh: '选一片现有叶子或小肠课中图，画细胞→组织→器官→个体四层。给器官至少标两种合作工作；标清哪些来自直接观察、哪些来自课程解释。',
      en: 'Choose an existing leaf or the lesson intestine model. Draw cell → tissue → organ → organism and at least two cooperating jobs in the organ. Label direct observations separately from lesson explanations.',
    },
    questions: [
      {
        id: 'L028-q1',
        skill: 'concept',
        prompt: {
          zh: '为什么叶片属于器官，而不只是叶肉组织？',
          en: 'Why is a leaf an organ rather than just mesophyll tissue?',
        },
        options: [
          {
            zh: '它只含一种完全相同的细胞',
            en: 'It contains only one identical cell type',
          },
          {
            zh: '叶肉、表皮和运输等不同组织协作',
            en: 'Mesophyll, epidermal and vascular tissues cooperate',
          },
          {
            zh: '所有绿色物体都叫器官',
            en: 'Every green object is an organ',
          },
        ],
        correct: 1,
        feedback: {
          zh: '叶肉参与制糖，表皮提供界面与保护，运输组织连到其他部位。这些组织共同组成叶片器官。',
          en: 'Mesophyll helps make sugars, epidermis provides an interface and protection, and vascular tissue links other parts. They form a leaf organ together.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L028-q2',
        skill: 'concept',
        prompt: {
          zh: '哪条从小到大的路线合理？',
          en: 'Which small-to-large route is appropriate?',
        },
        options: [
          {
            zh: '小肠→上皮组织→吸收细胞→人体',
            en: 'Intestine → epithelium → absorptive cell → person',
          },
          {
            zh: '叶绿体→完整叶片→一个细胞→植物',
            en: 'Chloroplast → leaf → cell → plant',
          },
          {
            zh: '吸收细胞→上皮组织→小肠→人体',
            en: 'Absorptive cell → epithelium → intestine → person',
          },
        ],
        correct: 2,
        feedback: {
          zh: '这是组成层次，不是一个细胞自己依次变成整个小肠。小肠还包含肌肉、结缔与神经等组织。',
          en: 'These are organisational levels, not one cell transforming into an intestine. An intestine includes muscle, connective and nervous tissues too.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L028-q3',
        skill: 'reasoning',
        prompt: {
          zh: '一块叶肉组织能制糖，为什么不等于完整叶片？',
          en: 'A piece of mesophyll can make sugars. Why is it not a complete leaf?',
        },
        options: [
          {
            zh: '缺少完整的保护、交换与运输协作，不能只按一个功能判断',
            en: 'It lacks the full cooperation for protection, exchange and transport; one function is insufficient',
          },
          {
            zh: '能制糖就证明拥有所有组织',
            en: 'Sugar-making proves all tissues are present',
          },
          {
            zh: '因为绿色细胞并不是真细胞',
            en: 'Because green cells are not real cells',
          },
        ],
        correct: 0,
        feedback: {
          zh: '一个功能只是部分证据。完整器官的工作来自多种组织协作，本课组织小图没有画全叶片。',
          en: 'One function is only part of the evidence. An organ works through multiple tissues; the tissue schematic is not a whole leaf.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
      {
        id: 'L028-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'organ与organelle分别对应什么？',
          en: 'What do organ and organelle refer to?',
        },
        options: [
          {
            zh: '都指人体大脑',
            en: 'Both mean a human brain',
          },
          {
            zh: '器官与细胞内特定功能结构',
            en: 'An organ and a specialised structure within a cell',
          },
          {
            zh: '个体与生态系统',
            en: 'Organism and ecosystem',
          },
        ],
        correct: 1,
        feedback: {
          zh: '叶片是organ，叶绿体是organelle。它们在不同组成层次，词相近不代表位置和大小相同。',
          en: 'A leaf is an organ; a chloroplast is an organelle. Similar words describe different organisational levels.',
        },
        revisit: {
          zh: '回看图解与逐步模型。',
          en: 'Revisit the diagram and stepwise model.',
        },
      },
    ],
  },
];
