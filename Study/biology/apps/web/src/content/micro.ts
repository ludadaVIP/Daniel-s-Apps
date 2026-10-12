import { t, q, term, type Lesson } from '../schema';
export const microLessons: Lesson[] = [
  {
    id: 'L005',
    reference: {
      title: 'OpenStax Biology 2e · Studying Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-1-studying-cells',
    },
    title: t('从鲸鱼到细胞', 'From whales to cells'),
    icon: '◎',
    minutes: 18,
    summary: t(
      '大身体，是靠一个巨型细胞吗？',
      'Does a big body need one giant cell?',
    ),
    hook: t(
      '鲸鱼比你大得多。它的细胞也都像足球一样大吗？从一片叶子放大进去，找找“大”到底来自哪里。',
      'A whale is much larger than you. Are all its cells football-sized? Zoom into a leaf and investigate where “big” comes from.',
    ),
    objectives: [
      t(
        '联系个体、器官、组织与细胞，解释身体的组成。',
        'Connect organisms, organs, tissues and cells.',
      ),
      t(
        '区分真实大小、图像大小与观察尺度。',
        'Distinguish real size, image size and observation scale.',
      ),
    ],
    prediction: [
      t('大生物一定由巨型细胞组成', 'Large organisms must have giant cells'),
      t(
        '大身体通常有更多细胞，细胞大小也会因类型而异',
        'A large body generally has more cells; cell sizes also vary by type',
      ),
      t('显微镜让细胞真的长大了', 'A microscope physically enlarges cells'),
    ],
    terms: [
      term(
        '尺度',
        'scale',
        '描述大小与观察范围，比较时要看单位。',
        'Describes size and viewing range; units matter.',
      ),
      term(
        '组织',
        'tissue',
        '一起承担相关功能的细胞及其周围物质组成的结构。',
        'Cells and associated material working together in related functions.',
      ),
      term(
        '器官',
        'organ',
        '由不同组织协作完成特定功能的结构。',
        'A structure with different tissues cooperating in a function.',
      ),
      term(
        '微米',
        'micrometre',
        'µm；1毫米等于1000微米。',
        'µm; 1 millimetre equals 1,000 micrometres.',
      ),
    ],
    mission: t(
      '拿一片常见植物的落叶，先描述整片，再描述边缘和叶脉。写出一个裸眼无法回答、需要换观察工具的问题。不必摘活叶。',
      'Describe a fallen leaf as a whole, then its edges and veins. Write one question that needs a different viewing tool. No need to pick a living leaf.',
    ),
    questions: [
      q(
        'L005-q1',
        'concept',
        t(
          '鲸鱼身体比小动物大得多，最合理的解释是什么？',
          'What best explains why a whale’s body is much larger than a small animal’s?',
        ),
        [
          t('每个细胞必定像足球一样大', 'Every cell must be football-sized'),
          t(
            '通常包含更多细胞；细胞大小也有差异',
            'It generally contains more cells; cell sizes vary too',
          ),
          t('鲸鱼的身体不需要细胞', 'Whales do not need cells'),
        ],
        1,
        t(
          '多细胞动物的身体大小不能简单等同于每个细胞的大小。细胞数量、类型和组织结构都重要。',
          'Body size is not simply the size of each cell. Cell number, type and organisation all matter.',
        ),
        t(
          '回看叶片 → 组织 → 细胞的图解。',
          'Revisit the leaf → tissue → cell diagram.',
        ),
      ),
      q(
        'L005-q2',
        'concept',
        t(
          '模型细胞直径是50µm，换成毫米是多少？',
          'A model cell has a diameter of 50µm. What is it in millimetres?',
        ),
        [
          t('0.05毫米', '0.05mm'),
          t('50毫米', '50mm'),
          t('50000毫米', '50,000mm'),
        ],
        0,
        t(
          '1毫米=1000微米，所以50÷1000=0.05毫米。50µm是这张模型的假设值，不是所有细胞的大小。',
          '1mm=1,000µm, so 50÷1,000=0.05mm. This is the model’s assumed size, not the size of every cell.',
        ),
        t(
          '切到细胞视野，查看50µm比例尺。',
          'Select the cell view and inspect its 50µm scale bar.',
        ),
      ),
      q(
        'L005-q3',
        'reasoning',
        t(
          '两张细胞图在屏幕上都宽5厘米，能判断两个真实细胞一样大吗？',
          'Two cell images are both 5cm wide on screen. Are the real cells necessarily equal in size?',
        ),
        [
          t(
            '能，屏幕宽度一样就是一样大',
            'Yes, equal screen width means equal real size',
          ),
          t('能，只要颜色一样', 'Yes, if the colours match'),
          t(
            '不能，还要比较比例尺或已知放大信息',
            'No; compare scale bars or known magnification information',
          ),
        ],
        2,
        t(
          '图像可以被缩放。屏幕上的大小不是真实尺寸证据；同样的图宽可能代表不同观察尺度。',
          'Images can be resized. Screen width alone is not evidence of real size; equal image widths can represent different scales.',
        ),
        t(
          '把模型视野从叶片切到细胞：显示区域相似，单位却变了。',
          'Switch from the leaf view to the cell view: a similar display area has different units.',
        ),
      ),
      q(
        'L005-q4',
        'vocabulary',
        t(
          '哪个词表示多个组织协作形成的“器官”？',
          'Which term describes a structure in which different tissues cooperate?',
        ),
        [
          t('organ · 器官', 'organ'),
          t('scale · 尺度', 'scale'),
          t('evidence · 证据', 'evidence'),
        ],
        0,
        t(
          'Organ是器官。叶片是植物器官，其内部有不同组织，而不是一格巨型细胞。',
          'An organ, such as a leaf, contains different tissues; it is not one giant cell.',
        ),
        t(
          '复习organ与tissue的词卡。',
          'Revisit the organ and tissue word cards.',
        ),
      ),
    ],
  },
  {
    id: 'L006',
    reference: {
      title: 'OpenStax Biology 2e · Studying Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-1-studying-cells',
    },
    title: t('放大镜与显微镜', 'Tools for looking closer'),
    icon: '⌕',
    minutes: 20,
    summary: t(
      '放得更大，为什么还是看不清？',
      'Why can a bigger image stay blurry?',
    ),
    hook: t(
      '把模糊照片放大十倍，能突然看见细胞核吗？显微镜的秘密，不只是让东西“看起来大”。',
      'If you enlarge a blurry photo ten times, will a nucleus suddenly appear? A microscope does more than make things look bigger.',
    ),
    objectives: [
      t(
        '区分放大倍数、分辨率与对焦。',
        'Distinguish magnification, resolution and focus.',
      ),
      t(
        '计算简单总放大倍数，解释高倍视野较小的原因。',
        'Calculate total magnification and explain the smaller field of view at higher power.',
      ),
    ],
    prediction: [
      t(
        '放大任何照片都能增加真实细节',
        'Enlarging any photo reveals new real detail',
      ),
      t(
        '既需要合适放大倍数，也需要分辨能力与对焦',
        'Useful views need magnification, resolving ability and focus',
      ),
      t(
        '显微镜的倍数越大，看到的范围越大',
        'Higher magnification shows a wider area',
      ),
    ],
    terms: [
      term(
        '放大倍数',
        'magnification',
        '图像与物体大小的比值；复合显微镜常用目镜×物镜计算。',
        'Image size relative to object size; commonly eyepiece × objective in a compound microscope.',
      ),
      term(
        '分辨率',
        'resolution',
        '把相近的细节区分开的能力。',
        'Ability to distinguish nearby details as separate.',
      ),
      term(
        '视野',
        'field of view',
        '一次观察能看到的标本范围。',
        'The specimen area visible in one view.',
      ),
      term(
        '对焦',
        'focus',
        '使目标所在平面成像清晰。',
        'Making the target plane appear sharp.',
      ),
    ],
    mission: t(
      '用手机拍一张有小字的食品包装照片，再放大这张照片。比较“字变大”与“新增细节”。模型显微镜为教学示意，不必购买器材，也不观察未知微生物。',
      'Photograph small text on a food label, then enlarge that same photo. Compare a larger image with genuinely new detail. No microscope purchase or unknown-microbe observation is needed.',
    ),
    questions: [
      q(
        'L006-q1',
        'concept',
        t(
          '目镜10×、物镜40×，总放大倍数是多少？',
          'With a 10× eyepiece and a 40× objective, what is the total magnification?',
        ),
        [t('50×', '50×'), t('4×', '4×'), t('400×', '400×')],
        2,
        t(
          '两次放大相乘：10×40=400。屏幕显示可能还被缩放，所以测真实大小最好看比例尺。',
          'The magnifications multiply: 10×40=400. A screen may resize the image further; use a scale bar to estimate real size.',
        ),
        t(
          '切换40×物镜，查看总放大倍数。',
          'Select the 40× objective and inspect the total magnification.',
        ),
      ),
      q(
        'L006-q2',
        'concept',
        t(
          '为什么把模糊照片放大，可能还是分不清两个小点？',
          'Why may enlarging a blurry photo still fail to separate two nearby dots?',
        ),
        [
          t(
            '原图没有分开的细节，单纯放大不能补回',
            'The original lacks separated detail; resizing cannot recover it',
          ),
          t('两个点一定是同一个细胞', 'The dots must be one cell'),
          t('所有大图都不能清晰', 'Large images can never be sharp'),
        ],
        0,
        t(
          '放大让已有图像变大；分辨率决定能否区分相近结构。对焦差也会丢失可见细节。',
          'Magnification enlarges an image; resolution separates close structures. Poor focus can also obscure detail.',
        ),
        t(
          '切换模型的“可分辨”与“合并”图像。',
          'Compare the model’s resolved and merged images.',
        ),
      ),
      q(
        'L006-q3',
        'reasoning',
        t(
          '换到高倍后找不到刚才的细胞，应怎样更稳妥地重新定位？',
          'A cell disappears after switching to high power. How should you relocate it?',
        ),
        [
          t(
            '盲目把高倍物镜压到玻片上',
            'Push the high-power lens onto the slide',
          ),
          t(
            '回到低倍，找到并居中目标，再换高倍',
            'Return to low power, find and centre it, then increase power',
          ),
          t('结论是细胞消失了', 'Conclude that the cell vanished'),
        ],
        1,
        t(
          '高倍观察范围较小，目标偏离中心可能离开视野。先低倍定位更容易；学校仪器按老师指导使用。',
          'Higher power shows less area, so an off-centre target may leave the view. Locate it at low power first; follow a teacher’s guidance with real instruments.',
        ),
        t('比较4×与40×物镜的视野。', 'Compare the 4× and 40× objective views.'),
      ),
      q(
        'L006-q4',
        'vocabulary',
        t(
          '把相近小点看成两个点，描述的是哪种能力？',
          'Which ability lets you distinguish two nearby points?',
        ),
        [
          t('growth · 生长', 'growth'),
          t('resolution · 分辨率', 'resolution'),
          t('organism · 生物', 'organism'),
        ],
        1,
        t(
          'Resolution是分辨能力。它与“图像放大多少倍”相关但不是同一个概念。',
          'Resolution concerns separation of detail. It is related to, but distinct from, magnification.',
        ),
        t('复习resolution词卡。', 'Revisit the resolution word card.'),
      ),
    ],
  },
  {
    id: 'L007',
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic Cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells',
    },
    title: t('第一次认识细胞', 'Meet the cell'),
    icon: '◌',
    minutes: 18,
    summary: t(
      '一个活细胞，为什么不像空盒子？',
      'Why is a living cell more than an empty box?',
    ),
    hook: t(
      '洋葱表皮看起来像一排排小房间。每一格都是空的吗？走进“活的小房间”，找找它怎样和外面交换物质。',
      'Onion skin resembles rows of tiny rooms. Are they empty? Explore a “living room” and how it exchanges substances with the outside.',
    ),
    objectives: [
      t(
        '识别细胞膜、细胞质和细胞核的入门功能。',
        'Identify introductory functions of the membrane, cytoplasm and nucleus.',
      ),
      t(
        '区别细胞膜与细胞壁，并避免“所有细胞都有核”的误解。',
        'Distinguish membrane and wall; avoid assuming every cell has a nucleus.',
      ),
    ],
    prediction: [
      t(
        '细胞壁与细胞膜是同一个结构',
        'The cell wall and membrane are the same structure',
      ),
      t(
        '细胞是有边界、内部活动和遗传信息的结构',
        'A cell has a boundary, internal activities and genetic information',
      ),
      t('所有细胞都有一个细胞核', 'Every cell has a nucleus'),
    ],
    terms: [
      term(
        '细胞膜',
        'cell membrane',
        '细胞的边界，帮助调节物质进出。',
        'The cellular boundary that helps regulate exchange.',
      ),
      term(
        '细胞质',
        'cytoplasm',
        '膜内、核外的细胞内容，含许多发生反应的结构与物质。',
        'Contents inside the membrane and outside the nucleus, with structures and substances involved in reactions.',
      ),
      term(
        '细胞核',
        'nucleus',
        '典型植物和动物细胞中，包围大部分DNA的结构。',
        'A structure enclosing most DNA in typical plant and animal cells.',
      ),
      term(
        '细胞壁',
        'cell wall',
        '植物细胞膜外的支持结构；不是细胞膜的替代品。',
        'A support layer outside a plant cell’s membrane, not a replacement for the membrane.',
      ),
    ],
    mission: t(
      '观察一层厨房洋葱表皮的整体样子，再与模型比较。写下模型帮你解释的一个问题，和裸眼仍看不见的一个细节；不需要把洋葱当作真实显微照片。',
      'Compare a thin kitchen onion skin with the model. Record one question the model helps explain and one detail invisible to the naked eye. The diagram is not a micrograph.',
    ),
    questions: [
      q(
        'L007-q1',
        'concept',
        t(
          '植物细胞有细胞壁，还需要细胞膜吗？',
          'Does a plant cell with a cell wall still need a membrane?',
        ),
        [
          t('不需要，有一个边界就够了', 'No; one boundary is enough'),
          t(
            '需要，膜负责细胞边界与物质交换的调节',
            'Yes; the membrane defines the cellular boundary and regulates exchange',
          ),
          t('只在晚上需要', 'Only at night'),
        ],
        1,
        t(
          '细胞壁与细胞膜承担不同功能。植物细胞有两者，动物细胞没有植物式细胞壁。',
          'The wall and membrane have different roles. Plant cells have both; animal cells lack a plant-type wall.',
        ),
        t(
          '逐步播放模型的外部 → 细胞壁 → 细胞膜。',
          'Step through outside → wall → membrane in the model.',
        ),
      ),
      q(
        'L007-q2',
        'concept',
        t(
          '看到一个没有细胞核的细菌，可以说它没有遗传信息吗？',
          'A bacterium has no nucleus. Does that mean it has no genetic information?',
        ),
        [
          t(
            '不可以，细菌有DNA，只是不被核包围',
            'No; it has DNA without an enclosing nucleus',
          ),
          t('可以，DNA只能在核内', 'Yes; DNA exists only in a nucleus'),
          t('可以，细菌不是细胞', 'Yes; bacteria are not cells'),
        ],
        0,
        t(
          '细菌有细胞膜、细胞质和遗传信息，但没有膜包围的核。典型细胞图不是所有细胞的模板。',
          'Bacteria have membranes, cytoplasm and genetic information, but no membrane-bound nucleus. A typical-cell diagram is not universal.',
        ),
        t(
          '切换植物细胞与细菌细胞图。',
          'Compare the plant and bacterial cell diagrams.',
        ),
      ),
      q(
        'L007-q3',
        'reasoning',
        t(
          '模型将某个颗粒挡在膜外。能得出“所有物质都不能进入细胞”吗？',
          'The model blocks one particle at the membrane. Does this mean no substance can enter a cell?',
        ),
        [
          t('能，膜是完全封闭的墙', 'Yes; the membrane is completely sealed'),
          t('能，细胞不需要外界物质', 'Yes; cells need nothing from outside'),
          t(
            '不能，模型只示范不同物质有不同进出条件',
            'No; the model illustrates that substances have different conditions for exchange',
          ),
        ],
        2,
        t(
          '细胞必须交换物质。真实进出取决于物质性质、膜蛋白和其他条件；本模型不模拟这些具体机制。',
          'Cells must exchange substances. Actual transport depends on substance properties, membrane proteins and other conditions; this model does not simulate those mechanisms.',
        ),
        t(
          '切换“可通过”与“需特定条件”，再查看模型说明。',
          'Compare the exchange examples and read the model notes.',
        ),
      ),
      q(
        'L007-q4',
        'vocabulary',
        t(
          '哪个术语对应调节细胞物质进出的边界？',
          'Which term names the boundary regulating cellular exchange?',
        ),
        [
          t('cell membrane · 细胞膜', 'cell membrane'),
          t('seed coat · 种皮', 'seed coat'),
          t('capsid · 衣壳', 'capsid'),
        ],
        0,
        t(
          'Cell membrane是细胞膜。种皮保护种子；衣壳包裹病毒遗传物质，不能混用。',
          'The cell membrane is a cellular boundary. A seed coat protects a seed; a capsid encloses viral genetic material.',
        ),
        t('复习cell membrane词卡。', 'Revisit the cell membrane word card.'),
      ),
    ],
  },
  {
    id: 'L008',
    reference: {
      title: 'OpenStax Biology 2e · Characteristics of Fungi',
      url: 'https://openstax.org/books/biology-2e/pages/24-1-characteristics-of-fungi',
    },
    title: t('单细胞与多细胞生命', 'One cell or many?'),
    icon: '▦',
    minutes: 20,
    summary: t(
      '酵母的一格，与洋葱的一格一样吗？',
      'Is one yeast cell like one onion cell?',
    ),
    hook: t(
      '做面包的酵母是一格格小细胞，洋葱表皮也是。为什么一格酵母可以是一个个体，而一格洋葱细胞只是植物的一部分？',
      'Baking yeast and onion skin both have cells. Why can one yeast cell be an organism, while one onion cell is part of a plant?',
    ),
    objectives: [
      t(
        '用生命活动是否由一个细胞完成，区分单细胞与多细胞。',
        'Distinguish unicellular and multicellular life by how life functions are organised.',
      ),
      t(
        '解释多细胞结构的分工和相互依赖。',
        'Explain division of labour and interdependence in multicellular life.',
      ),
    ],
    prediction: [
      t(
        '看到一堆细胞，就一定是一个多细胞个体',
        'Any group of cells must be one multicellular organism',
      ),
      t(
        '要看一个个体是否由一个细胞或多个协作细胞构成',
        'Check whether one organism consists of one cell or many cooperating cells',
      ),
      t(
        '单细胞生物不是完整生命',
        'Single-celled organisms are incomplete life',
      ),
    ],
    terms: [
      term(
        '单细胞',
        'unicellular',
        '一个细胞构成一个生物个体。',
        'One cell makes up an organism.',
      ),
      term(
        '多细胞',
        'multicellular',
        '一个生物个体由许多相互协作的细胞构成。',
        'An organism consists of many cooperating cells.',
      ),
      term(
        '分工',
        'division of labour',
        '不同细胞或结构承担不同任务。',
        'Different cells or structures carry out different tasks.',
      ),
      term(
        '相互依赖',
        'interdependence',
        '不同部分需要彼此提供的物质或功能。',
        'Parts rely on substances or functions provided by one another.',
      ),
    ],
    mission: t(
      '看食品包装：有无“面包酵母”字样？比较酵母与一片洋葱的细胞示意，完成U02证据笔记。只读标签，不培养或食用实验样品。',
      'Look for “baking yeast” on a food label. Compare yeast and onion cell diagrams, then complete the U02 evidence note. Read labels only; do not culture or eat experimental samples.',
    ),
    questions: [
      q(
        'L008-q1',
        'concept',
        t(
          '一格面包酵母细胞可以获取物质、释放能量并繁殖。这说明什么？',
          'One baking-yeast cell can obtain substances, release energy and reproduce. What does this illustrate?',
        ),
        [
          t(
            '单细胞也可以构成完整生物个体',
            'A single cell can form a complete organism',
          ),
          t(
            '任何一格洋葱细胞都等于一整株植物',
            'Every onion cell is a whole plant',
          ),
          t('酵母一定是细菌', 'Yeast must be bacteria'),
        ],
        0,
        t(
          '面包酵母是单细胞真菌，不是细菌。单细胞不等于缺少生命功能。',
          'Baking yeast is a unicellular fungus, not a bacterium. One cell can carry out the functions of a living organism.',
        ),
        t(
          '逐步查看酵母完成的生命活动。',
          'Step through the yeast life functions.',
        ),
      ),
      q(
        'L008-q2',
        'concept',
        t(
          '一株植物的叶片制造糖、根吸收水，怎样理解它们的关系？',
          'Leaves make sugars and roots take up water. How are their roles connected?',
        ),
        [
          t('两者完全不需要彼此', 'They never need each other'),
          t(
            '植物只是许多独立植物的集合',
            'A plant is merely a collection of independent plants',
          ),
          t(
            '分工协作，水和糖等物质在各部分之间运输',
            'They cooperate; substances such as water and sugars are transported between parts',
          ),
        ],
        2,
        t(
          '多细胞生物的不同细胞、组织和器官可以分工。分工需要交换物质和协调，不能把植物看作任意细胞堆。',
          'Multicellular cells, tissues and organs can specialise. Cooperation needs exchange and coordination, not just a pile of cells.',
        ),
        t(
          '查看根→叶的水路径与叶→其他部位的糖路径。',
          'Inspect water from roots to leaves and sugars from leaves to other parts.',
        ),
      ),
      q(
        'L008-q3',
        'reasoning',
        t(
          '一张图里有十个酵母细胞，能直接说“这是一个多细胞个体”吗？',
          'A picture shows ten yeast cells. Is it necessarily one multicellular organism?',
        ),
        [
          t('能，只要数量超过一就可以', 'Yes; any count above one is enough'),
          t(
            '不能，可能是十个单细胞个体，还要看组织关系与功能',
            'No; it may show ten unicellular organisms. Organisation and functions matter',
          ),
          t('不能，因为酵母没有细胞', 'No; yeast has no cells'),
        ],
        1,
        t(
          '“图中有多少细胞”与“一个个体由多少细胞构成”是不同问题。群体、菌落和多细胞个体不能仅靠数量区分。',
          'Cells in a picture and cells composing one organism are different questions. Cell count alone cannot distinguish a group, colony and multicellular organism.',
        ),
        t(
          '切换“多个酵母个体”与“植物组织”模型。',
          'Compare multiple yeast organisms with plant tissue.',
        ),
      ),
      q(
        'L008-q4',
        'vocabulary',
        t(
          '一个个体由一个细胞构成，对应哪个英文词？',
          'Which word describes an organism made of one cell?',
        ),
        [
          t('multicellular · 多细胞', 'multicellular'),
          t('organ · 器官', 'organ'),
          t('unicellular · 单细胞', 'unicellular'),
        ],
        2,
        t(
          'Unicellular表示单细胞；multicellular表示多细胞。两者都可以有完整的生命活动。',
          'Unicellular means one-celled; multicellular means many-celled. Both can describe living organisms.',
        ),
        t(
          '复习unicellular与multicellular词卡。',
          'Revisit unicellular and multicellular.',
        ),
      ),
    ],
  },
];
