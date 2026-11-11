import { t, q, term, type Lesson } from '../schema';

const look = (zh: string, en: string) =>
  t(
    `回看${zh}，再用一条证据解释。`,
    `Revisit ${en}, then explain using one piece of evidence.`,
  );
export const connectionLessons: Lesson[] = [
  {
    id: 'L049',
    title: t('细菌、真菌与微生物', 'Microorganisms around us'),
    summary: t(
      '看不见，不等于结构相同。',
      'Invisible to the eye does not mean structurally identical.',
    ),
    icon: '◌',
    minutes: 25,
    hook: t(
      '一小块面包酵母和一小群细菌，看起来都只是小点。它们的细胞内部会一样吗？如果把一个蘑菇放大，它又和酵母有什么关系？',
      'Baking yeast and a group of bacteria may look like tiny dots. Are their cells the same inside? How could a mushroom be related to yeast?',
    ),
    objectives: [
      t(
        '比较代表细菌、酵母与霉菌的细胞结构。',
        'Compare the cell structures of representative bacteria, yeast and mould.',
      ),
      t(
        '解释没有细胞核为什么不等于没有DNA。',
        'Explain why lacking a nucleus does not mean lacking DNA.',
      ),
      t(
        '区分已知样本的结构比较与未知微生物的鉴定。',
        'Distinguish structural comparison of known samples from identifying unknown microbes.',
      ),
    ],
    prediction: [
      t('只要很小就都是细菌', 'Anything tiny is a bacterium'),
      t(
        '需要比较细胞结构与更多证据',
        'We need cell structure and further evidence',
      ),
      t('酵母和蘑菇毫无关系', 'Yeast and mushrooms cannot be related'),
    ],
    terms: [
      term(
        '微生物',
        'microorganism',
        '通常需放大才能仔细观察的微小生物，不是单一分类群。',
        'A small organism usually needing magnification for detailed observation, not one taxonomic group.',
      ),
      term(
        '细菌',
        'bacterium',
        '没有膜包围的细胞核的原核生物之一。',
        'A prokaryotic organism without a membrane-bound nucleus.',
      ),
      term(
        '真菌',
        'fungus',
        '包括酵母与霉菌等的真核生物类群。',
        'A eukaryotic group including yeasts and moulds.',
      ),
      term(
        '酵母',
        'yeast',
        '以单细胞形式生长的一类真菌。',
        'A fungus growing in a predominantly unicellular form.',
      ),
      term(
        '菌丝',
        'hypha',
        '许多真菌的细长丝状结构，能组成菌丝体。',
        'A threadlike fungal structure; hyphae can form a mycelium.',
      ),
      term(
        '细胞核',
        'nucleus',
        '由膜包围、含主要遗传物质的细胞结构。',
        'A membrane-bound cell structure containing the main genetic material.',
      ),
    ],
    mission: t(
      '给图中的细菌、酵母与菌丝各写一条结构证据，并写出一条图不能证明的事。',
      'Record one structural clue for each representative sample and one claim the diagram cannot establish.',
    ),
    reference: {
      title: 'OpenStax: Prokaryotic cells',
      url: 'https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells',
    },
    questions: [
      q(
        'L049-q1',
        'concept',
        t(
          '图中代表细菌没有细胞核，DNA在哪里？',
          'The representative bacterium lacks a nucleus. What about its DNA?',
        ),
        [
          t('它没有DNA', 'It has no DNA'),
          t(
            'DNA在细胞内，但不包在细胞核中',
            'DNA is inside the cell without a nucleus around it',
          ),
          t('DNA只在细胞外', 'DNA occurs only outside the cell'),
        ],
        1,
        t(
          '细胞核是包围主要DNA的结构，不是DNA本身；细菌仍需遗传信息。',
          'A nucleus encloses the main DNA; it is not DNA itself. Bacteria still carry genetic information.',
        ),
        look('细菌图的DNA线索', 'the bacterial DNA clue'),
      ),
      q(
        'L049-q2',
        'concept',
        t('哪一对都属于真菌？', 'Which pair both belong to fungi?'),
        [
          t('酵母与霉菌', 'Yeast and mould'),
          t('细菌与病毒', 'Bacteria and viruses'),
          t('酵母与所有单细胞生物', 'Yeast and all unicellular organisms'),
        ],
        0,
        t(
          '真菌可以是单细胞酵母，也可以由许多菌丝组成；单细胞并不等于细菌。',
          'Fungi include unicellular yeast and forms made of many hyphae. Unicellular does not mean bacterial.',
        ),
        look('酵母与菌丝比较', 'the yeast–hypha comparison'),
      ),
      q(
        'L049-q3',
        'reasoning',
        t(
          '未知照片只显示一个椭圆轮廓。最有依据的结论是什么？',
          'An unknown image shows only an oval outline. Which conclusion is justified?',
        ),
        [
          t('一定是酵母，因为有椭圆形', 'Definitely yeast because it is oval'),
          t(
            '一定会致病，因为它很小',
            'Definitely pathogenic because it is small',
          ),
          t(
            '还需尺度、结构与其他鉴定证据',
            'Scale, structure and further identification evidence are needed',
          ),
        ],
        2,
        t(
          '这张教学图预先标定了样本；未知照片没有这些前提。轮廓不能单独确定身份，更不能诊断致病性。',
          'The teaching samples are pre-labelled; an unknown photo lacks those premises. Outline alone establishes neither identity nor pathogenicity.',
        ),
        look(
          '已标定样本与未知照片的区别',
          'known samples versus unknown images',
        ),
      ),
      q(
        'L049-q4',
        'vocabulary',
        t('Hypha 指什么？', 'What is a hypha?'),
        [
          t('细菌细胞核', 'A bacterial nucleus'),
          t('真菌的丝状结构', 'A threadlike fungal structure'),
          t('病毒的蛋白质外壳', 'A viral protein coat'),
        ],
        1,
        t(
          'Hypha 是菌丝，复数为 hyphae；许多菌丝交织可构成 mycelium（菌丝体）。',
          'Hypha is singular and hyphae plural; interwoven hyphae can form a mycelium.',
        ),
        look('菌丝词卡', 'the hypha word card'),
      ),
    ],
  },
  {
    id: 'L050',
    title: t('微生物也会帮忙', 'Helpful microbes'),
    summary: t(
      '面团为什么会鼓起来？角色要看作用证据。',
      'Why does dough rise? Roles need evidence of effects.',
    ),
    icon: '⋯',
    minutes: 25,
    hook: t(
      '面包师把酵母加入面团，森林里真菌把落叶慢慢分解。为什么人会主动使用一些微生物，却要防止另一些造成伤害？',
      'A baker adds yeast to dough while fungi slowly decompose forest litter. Why do we deliberately use some microbes and prevent harm from others?',
    ),
    objectives: [
      t(
        '用活酵母和糖的条件比较解释发酵模型中的CO₂来源。',
        'Use yeast-viability and sugar controls to explain CO₂ in a fermentation model.',
      ),
      t(
        '用作用与情境证据判断微生物角色。',
        'Use effects and context to judge a microbe’s role.',
      ),
      t(
        '将分解者的作用连接到物质循环。',
        'Connect decomposer activity to material cycling.',
      ),
    ],
    prediction: [
      t('所有微生物都应该消失', 'All microbes should disappear'),
      t('所有真菌都可以做食物', 'All fungi are suitable as food'),
      t(
        '作用取决于种类、条件与情境',
        'Effects depend on organism, conditions and context',
      ),
    ],
    terms: [
      term(
        '发酵',
        'fermentation',
        '不需要氧参与的一类细胞供能过程；本例酵母产乙醇与CO₂。',
        'A cellular energy-releasing process that does not require oxygen; this yeast example produces ethanol and CO₂.',
      ),
      term(
        '底物',
        'substrate',
        '反应过程中被作用的物质，本模型为可利用的糖。',
        'A substance acted on in a process; here, available sugar.',
      ),
      term(
        '二氧化碳',
        'carbon dioxide',
        '酵母发酵的一种产物，可形成气泡。',
        'A product of yeast fermentation that can form gas bubbles.',
      ),
      term(
        '分解者',
        'decomposer',
        '利用并分解死有机物的生物。',
        'An organism that uses and breaks down dead organic matter.',
      ),
      term(
        '物质循环',
        'material cycling',
        '元素在生物与非生物环境之间转移和再利用。',
        'Transfer and reuse of elements between organisms and the non-living environment.',
      ),
      term(
        '对照',
        'control',
        '用于比较某条件作用的参照情境。',
        'A comparison case used to examine a condition’s effect.',
      ),
    ],
    mission: t(
      '完成四张角色证据卡；为一个“有帮助”和一个“还不知道”各写证据，避免按颜色分类。',
      'Classify four role-evidence cards. Explain one helpful and one unknown case without using colour as the deciding clue.',
    ),
    reference: {
      title: 'OpenStax: Beneficial prokaryotes',
      url: 'https://openstax.org/books/biology-2e/pages/22-5-beneficial-prokaryotes',
    },
    questions: [
      q(
        'L050-q1',
        'concept',
        t(
          '在本课固定的酵母发酵条件下，面团膨起直接与什么有关？',
          'Under this lesson’s fixed fermentation conditions, what directly helps dough expand?',
        ),
        [
          t('CO₂形成气泡', 'CO₂ forms bubbles'),
          t('酵母进行光合作用', 'Yeast photosynthesises'),
          t(
            '酵母变大直接把面团顶起，气体不参与',
            'Larger yeast cells push dough up without gas',
          ),
        ],
        0,
        t(
          '活酵母利用糖可产生CO₂，气体能形成气泡。条件与面团性质会影响真实结果，本图不计算产量。',
          'Live yeast can use sugar to produce CO₂, allowing bubbles. Actual results depend on conditions and dough properties; the model gives no yield.',
        ),
        look('糖→酵母→产物路线', 'the sugar → yeast → products route'),
      ),
      q(
        'L050-q2',
        'concept',
        t(
          '落叶分解怎样与下一轮植物生长联系？',
          'How can leaf-litter decomposition connect to future plant growth?',
        ),
        [
          t('能量全部循环回阳光', 'All energy cycles back to sunlight'),
          t(
            '完整落叶不经分解就被根吸收',
            'Roots absorb intact leaves without breakdown',
          ),
          t(
            '矿质元素可重新进入环境并被利用',
            'Mineral elements can return to the environment and be reused',
          ),
        ],
        2,
        t(
          '元素可以再利用，能量在过程中逐步散为热。分解不等于把完整落叶直接送入根。',
          'Elements can be reused while energy is gradually dissipated as heat. A whole leaf is not taken directly into roots.',
        ),
        look('分解者与物质循环', 'decomposers and material cycling'),
      ),
      q(
        'L050-q3',
        'reasoning',
        t(
          '未知彩色斑点没有身份与作用记录。能否判为“可食用有益菌”？',
          'An unknown coloured spot has no identity or effect record. Can it be called an edible helpful microbe?',
        ),
        [
          t('能，因为有颜色就活跃', 'Yes, because colour shows activity'),
          t(
            '不能；还缺身份、安全与作用证据',
            'No; identity, safety and effect evidence are missing',
          ),
          t(
            '能，因为所有真菌都用于面包',
            'Yes, because every fungus is used in bread',
          ),
        ],
        1,
        t(
          '已知面包酵母的用途不能推广到未知斑点。看不出危害不等于已证明安全，不需培养或品尝来完成本课。',
          'Known baking-yeast uses cannot be generalised to an unknown spot. Absence of visible harm is not proof of safety; culturing or tasting is unnecessary.',
        ),
        look('未知角色证据卡', 'the unknown-role evidence card'),
      ),
      q(
        'L050-q4',
        'vocabulary',
        t('哪项最准确表达 decomposer？', 'Which best describes a decomposer?'),
        [
          t('只吃阳光的动物', 'An animal eating sunlight'),
          t('所有引起疾病的生物', 'Every disease-causing organism'),
          t(
            '分解死有机物的生物',
            'An organism breaking down dead organic matter',
          ),
        ],
        2,
        t(
          'Decomposer 描述生态作用，并不表示一种外观或一个单一分类群。',
          'Decomposer names an ecological role, not one appearance or taxonomic group.',
        ),
        look('分解者词卡', 'the decomposer word card'),
      ),
    ],
  },
  {
    id: 'L051',
    title: t('病原体与传播概念', 'Pathogens and transmission'),
    summary: t(
      '一条传播路线还缺哪些条件才可能感染？',
      'What lies between a transfer route and infection?',
    ),
    icon: '↝',
    minutes: 25,
    hook: t(
      '在虚构教室里，来源可能经物体表面和手接近入口，也可能经过共同空气。删除一条线，为什么不能宣布所有传播机会都没有了？',
      'In a fictional classroom, a source may reach an entry site through a surface and hand, or through shared air. Why does deleting one link not eliminate every opportunity?',
    ),
    objectives: [
      t(
        '区分病原体、传播机会与感染。',
        'Distinguish a pathogen, a transfer opportunity and infection.',
      ),
      t(
        '追踪接触与共同空气两种独立路线。',
        'Trace separate contact and shared-air routes.',
      ),
      t(
        '解释针对一个环节的改变为何不能代表所有风险归零。',
        'Explain why changing one link does not make all risks zero.',
      ),
    ],
    prediction: [
      t('碰到微生物一定生病', 'Contact with a microbe guarantees disease'),
      t(
        '需要结合来源、途径、入口与宿主条件',
        'Source, route, entry and host conditions matter',
      ),
      t(
        '删除接触连接后空气路线也消失',
        'Removing contact also removes the air route',
      ),
    ],
    terms: [
      term(
        '病原体',
        'pathogen',
        '能够在特定宿主和条件下造成疾病的感染因子。',
        'An infectious agent capable of causing disease in a host under relevant conditions.',
      ),
      term(
        '传播',
        'transmission',
        '感染因子通过某种途径转移的过程。',
        'Transfer of an infectious agent through a route.',
      ),
      term(
        '宿主',
        'host',
        '可被相关感染因子利用或感染的生物。',
        'An organism used or infected by a relevant infectious agent.',
      ),
      term(
        '接触',
        'contact',
        '直接接触或通过物体表面形成的一类途径。',
        'A route involving direct touch or transfer via surfaces.',
      ),
      term(
        '感染',
        'infection',
        '相关因子进入宿主并建立活动的过程，不等同一次接触。',
        'Establishment and activity of an agent in a host, not simply one contact.',
      ),
      term(
        '证据',
        'evidence',
        '能用于支持或限制某个解释的观察与可靠记录。',
        'Observations and reliable records supporting or limiting an explanation.',
      ),
    ],
    mission: t(
      '画两条虚构路径；移除接触路径中的一个连接，写下改变了什么、没有证据断定什么。',
      'Draw two fictional routes. Remove one contact-route link and explain what changed and what remains unproven.',
    ),
    reference: {
      title: 'CDC: How infections spread',
      url: 'https://www.cdc.gov/children-and-school-preparedness/infection-prevention/appendix-a.html',
    },
    questions: [
      q(
        'L051-q1',
        'concept',
        t(
          '一条“来源→表面→手→入口”连线首先表示什么？',
          'What does a source → surface → hand → entry chain first represent?',
        ),
        [
          t('四个人已确诊', 'Four people have been diagnosed'),
          t(
            '一次触摸的精确感染率',
            'The exact infection probability of one touch',
          ),
          t('一个可能的转移途径', 'A possible transfer route'),
        ],
        2,
        t(
          '连线说明路径可以连接，不提供感染诊断、剂量或概率。',
          'A connected path shows a transfer possibility, not diagnosis, dose or probability.',
        ),
        look('路径图的文字边界', 'the route diagram’s stated limits'),
      ),
      q(
        'L051-q2',
        'concept',
        t('病原体与微生物是什么关系？', 'How do pathogens relate to microbes?'),
        [
          t('所有微生物都致病', 'Every microbe causes disease'),
          t(
            '有些感染因子致病，许多微生物不致病或有帮助',
            'Some infectious agents cause disease; many microbes are harmless or helpful',
          ),
          t('病毒是具有细胞核的细菌', 'A virus is a bacterium with a nucleus'),
        ],
        1,
        t(
          '病原体按造成疾病的能力描述；“微生物”不自动给出危害判断。病毒也不具有细胞结构。',
          'Pathogen concerns disease-causing ability; “microbe” alone does not determine harm. Viruses also lack cellular structure.',
        ),
        look(
          'U13的角色证据与结构比较',
          'U13 role evidence and structural comparisons',
        ),
      ),
      q(
        'L051-q3',
        'reasoning',
        t(
          '模型移除了表面→手连接，但共同空气路线仍相连。哪句符合证据？',
          'The surface → hand link is removed, while shared air remains connected. Which claim fits?',
        ),
        [
          t(
            '接触链被中断，另一条机会路线仍存在',
            'The contact chain stops while another opportunity route remains',
          ),
          t(
            '每个真实人都绝不会感染',
            'No real person can possibly become infected',
          ),
          t('所有清洁方法都无作用', 'All cleaning methods are ineffective'),
        ],
        0,
        t(
          '改变了被选连接，应限定结论的范围。这既不证明风险为零，也不证明改变毫无作用。',
          'The selected link changed, so the conclusion must retain that scope. It proves neither zero risk nor uselessness.',
        ),
        look('切换接触与空气路线后的对照', 'the contact-versus-air comparison'),
      ),
      q(
        'L051-q4',
        'vocabulary',
        t(
          'Transmission 最接近哪一意思？',
          'Which meaning best matches transmission?',
        ),
        [
          t('一定患病', 'Certain illness'),
          t('细胞核', 'Nucleus'),
          t('通过途径转移或传播', 'Transfer through a route'),
        ],
        2,
        t(
          'Transmission 是传播；infection 是感染，disease 是疾病，三者不能换成同一件事。',
          'Transmission, infection and disease name different ideas and are not interchangeable.',
        ),
        look('传播词卡', 'the transmission word card'),
      ),
    ],
  },
  {
    id: 'L052',
    title: t('身体的第一道防线', 'The body’s first defences'),
    summary: t(
      '皮肤、黏液和胃酸怎样合作，却仍不是绝对墙？',
      'How do skin, mucus and stomach acid help without being absolute walls?',
    ),
    icon: '▱',
    minutes: 25,
    hook: t(
      '我们每天接触许多微生物，身体却不是每次都被感染。皮肤能挡什么？呼吸道不能封死，又怎样清理吸入的颗粒？',
      'We meet microbes daily without infection every time. What can skin block? Airways cannot be sealed, so how do they help clear inhaled particles?',
    ),
    objectives: [
      t(
        '用结构与功能解释皮肤、黏液/纤毛和胃酸的防护作用。',
        'Explain skin, mucus/cilia and stomach acid through structure and function.',
      ),
      t(
        '区分物理阻挡、机械清除与化学抑制。',
        'Distinguish physical blocking, mechanical clearance and chemical inhibition.',
      ),
      t(
        '解释一层屏障有局限为什么不等于必然感染。',
        'Explain why a barrier limitation does not imply certain infection.',
      ),
    ],
    prediction: [
      t('身体表面完全没有微生物', 'Body surfaces contain no microbes'),
      t('每个屏障都能杀死所有病原体', 'Every barrier kills all pathogens'),
      t(
        '多种屏障以不同机制降低进入或建立感染的机会',
        'Different barrier mechanisms reduce opportunities for entry or establishment',
      ),
    ],
    terms: [
      term(
        '屏障',
        'barrier',
        '限制进入或通过的一层结构或条件。',
        'A structure or condition limiting entry or passage.',
      ),
      term(
        '黏液',
        'mucus',
        '可黏附颗粒的分泌物，参与保护表面。',
        'A secretion that can trap particles and help protect surfaces.',
      ),
      term(
        '纤毛',
        'cilia',
        '某些细胞表面可摆动的细小结构。',
        'Small movable structures on certain cell surfaces.',
      ),
      term(
        '胃酸',
        'stomach acid',
        '胃内酸性条件的来源，可抑制许多病原体。',
        'A source of acidic stomach conditions that can inhibit many pathogens.',
      ),
      term(
        '先天免疫',
        'innate immunity',
        '身体具有的较广泛、快速的防御机制。',
        'Broad, relatively rapid defence mechanisms present in the body.',
      ),
      term(
        '抑制',
        'inhibition',
        '降低某过程进行的能力，不必等于完全消灭。',
        'Reducing a process’s activity, not necessarily eliminating everything.',
      ),
    ],
    mission: t(
      '为三种屏障各写“结构或条件→作用→局限”，不用做身体试验。',
      'Write structure/condition → action → limitation for three barriers, without bodily experiments.',
    ),
    reference: {
      title: 'OpenStax: Innate immune response',
      url: 'https://openstax.org/books/biology-2e/pages/42-1-innate-immune-response',
    },
    questions: [
      q(
        'L052-q1',
        'concept',
        t(
          '呼吸道的黏液与纤毛怎样分工？',
          'How do airway mucus and cilia cooperate?',
        ),
        [
          t(
            '黏液捕获，纤毛推动黏液',
            'Mucus traps particles; cilia move mucus',
          ),
          t(
            '黏液负责移动，纤毛负责杀死全部颗粒',
            'Mucus moves particles while cilia kill every one',
          ),
          t(
            '黏住就等于所有病原体死亡，不需清除',
            'Trapping kills every pathogen, so clearance is unnecessary',
          ),
        ],
        0,
        t(
          '捕获和清除是两个相连过程；“黏住”不自动等于病原体全部死亡。',
          'Trapping and clearance are connected processes; being trapped does not automatically mean every pathogen dies.',
        ),
        look('呼吸道的两步作用', 'the two airway actions'),
      ),
      q(
        'L052-q2',
        'concept',
        t(
          '胃酸属于哪种主要防护机制？',
          'Which main defence mechanism involves stomach acid?',
        ),
        [
          t(
            '像筛网一样只让较小的病原体通过',
            'Sieving so that only smaller pathogens pass',
          ),
          t(
            '利用酸性条件抑制许多病原体',
            'Using acidic conditions to inhibit many pathogens',
          ),
          t(
            '胃酸能同样消灭每一种感染因子',
            'Stomach acid eliminates every infectious agent equally',
          ),
        ],
        1,
        t(
          '酸性是化学环境，不是机械筛网；不同病原体的耐受能力不同。',
          'Acidity is a chemical environment rather than a mechanical sieve; pathogen tolerance varies.',
        ),
        look('胃的作用与局限', 'stomach action and limits'),
      ),
      q(
        'L052-q3',
        'reasoning',
        t(
          '观察到皮肤有破口，能直接推断已经感染吗？',
          'Does observing broken skin directly establish infection?',
        ),
        [
          t(
            '能，破口和感染是同一意思',
            'Yes; a break and infection mean the same thing',
          ),
          t(
            '能，并可算出病原体数量',
            'Yes, and the pathogen count can be calculated',
          ),
          t(
            '不能；进入途径可能改变，仍需其他证据',
            'No; an entry route may change, but further evidence is needed',
          ),
        ],
        2,
        t(
          '防护机会改变与感染建立不同；后续还有多层防御。本课不用于判断真实伤口或健康。',
          'A changed entry opportunity differs from an established infection; further defence layers exist. This lesson does not assess real wounds or health.',
        ),
        look('皮肤限制情境的说明', 'the skin-limitation case'),
      ),
      q(
        'L052-q4',
        'vocabulary',
        t('Cilia 指本课哪种结构？', 'Which structure does cilia name here?'),
        [
          t('胃中的酸性液体', 'Acidic stomach fluid'),
          t(
            '推动黏液的细胞表面小结构',
            'Small cell-surface structures moving mucus',
          ),
          t('身体里的全部神经', 'All nerves in the body'),
        ],
        1,
        t(
          'Cilia 是纤毛，单数为 cilium；不要与mucus（黏液）混同。',
          'Cilia is the plural of cilium; distinguish it from mucus.',
        ),
        look('纤毛词卡与呼吸道图', 'the cilia card and airway diagram'),
      ),
    ],
  },
  {
    id: 'L053',
    title: t('生命有怎样的周期？', 'Life cycles'),
    summary: t(
      '毛虫不是小蝴蝶，种子也不是母株退回的模样。',
      'A caterpillar is not a small adult; a seed is not its parent reversed.',
    ),
    icon: '↻',
    minutes: 25,
    hook: t(
      '毛虫吃叶子，成蝶可能访花；蝌蚪与成蛙也很不一样。生命改变外形时，怎样判断是同一个体继续发育，还是出现了下一代？',
      'A caterpillar eats leaves while an adult butterfly may visit flowers. Tadpoles and adult frogs also differ. How can we distinguish one individual developing from a new generation appearing?',
    ),
    objectives: [
      t(
        '按顺序比较蝴蝶、代表青蛙与开花植物的生命周期。',
        'Compare ordered life cycles of butterflies, a representative frog and a flowering plant.',
      ),
      t(
        '区分变态、个体生长与代际繁殖。',
        'Distinguish metamorphosis, individual growth and reproduction across generations.',
      ),
      t(
        '根据阶段资源需求解释一个栖息地案例。',
        'Explain a habitat case using stage-specific resource needs.',
      ),
    ],
    prediction: [
      t(
        '生命周期的箭头让成体变回自己的卵',
        'A life-cycle arrow turns an adult into its own egg',
      ),
      t(
        '各物种都经历卵、幼虫、蛹、成虫',
        'Every species has egg, larva, pupa and adult stages',
      ),
      t(
        '不同阶段属于同一个体，繁殖再连接下一代',
        'Developmental stages belong to an individual; reproduction connects generations',
      ),
    ],
    terms: [
      term(
        '生命周期',
        'life cycle',
        '从生命开始、发育到产生下一代的阶段联系。',
        'Linked stages from a life’s beginning through development and production of a next generation.',
      ),
      term(
        '变态',
        'metamorphosis',
        '发育中身体结构和生活方式发生明显变化。',
        'A major developmental change in body organisation and way of life.',
      ),
      term(
        '幼虫',
        'larva',
        '某些动物与成体外形、生活方式明显不同的幼体。',
        'An immature animal stage differing substantially from the adult.',
      ),
      term(
        '蛹',
        'pupa',
        '完全变态昆虫中连接幼虫与成虫的发育阶段。',
        'A developmental stage between larva and adult in completely metamorphosing insects.',
      ),
      term(
        '世代',
        'generation',
        '在亲代与后代关系中区分的一代个体。',
        'A set of individuals distinguished through parent–offspring relationships.',
      ),
      term(
        '胚',
        'embryo',
        '新个体早期发育阶段；种子内也可有植物胚。',
        'An early developing individual, including a plant embryo within a seed.',
      ),
    ],
    mission: t(
      '把蝴蝶、青蛙、豌豆三条路线分别写出，标记哪些箭头是发育、哪个连接下一代。',
      'Write butterfly, frog and pea sequences, marking developmental arrows and the connection to a next generation.',
    ),
    reference: {
      title: 'Smithsonian: Butterflies and beyond',
      url: 'https://naturalhistory.si.edu/education/teaching-resources/life-science/butterflies-and-beyond',
    },
    questions: [
      q(
        'L053-q1',
        'concept',
        t(
          '成蝶经繁殖产生卵时，循环图应怎样理解？',
          'How should a cycle diagram be read when an adult butterfly reproduces to produce eggs?',
        ),
        [
          t(
            '成蝶身体缩小成原来的卵',
            'The adult body shrinks into its original egg',
          ),
          t(
            '产生下一代，而非同一个体倒退发育',
            'A next generation appears; the individual does not develop backwards',
          ),
          t(
            '卵与成蝶总是同一个体的同一时刻',
            'Egg and adult are always one individual at one moment',
          ),
        ],
        1,
        t(
          '发育连起一个个体的阶段；繁殖把亲代与后代连接起来。画成圆不表示时间倒流。',
          'Development links one individual’s stages; reproduction links parent and offspring. A circular drawing does not mean reversed time.',
        ),
        look('虚线的代际连接', 'the dashed generation link'),
      ),
      q(
        'L053-q2',
        'concept',
        t(
          '本课代表青蛙与蝴蝶的区别是什么？',
          'What distinguishes the representative frog and butterfly here?',
        ),
        [
          t('两者都必须有蛹期', 'Both must have a pupa'),
          t(
            '只有蝴蝶会发生发育变化',
            'Only a butterfly changes during development',
          ),
          t(
            '蝴蝶有蛹期，代表青蛙经历蝌蚪到幼蛙而无蛹期',
            'The butterfly has a pupa; the representative frog changes from tadpole to froglet without one',
          ),
        ],
        2,
        t(
          '两者都可有变态过程，但具体阶段与机制不同，不能把一个周期机械套给所有动物。',
          'Both can undergo metamorphosis, but their stages and mechanisms differ; one sequence does not apply to every animal.',
        ),
        look('两种动物四阶段图', 'the two animal sequences'),
      ),
      q(
        'L053-q3',
        'reasoning',
        t(
          '花园有成蝶可取食的花，却没有该种幼虫可吃的叶片。最合理的进一步判断是什么？',
          'A garden offers flowers for adult butterflies but no suitable leaves for that species’ larvae. What follows?',
        ),
        [
          t(
            '成蝶资源不能单独证明完整生命周期都得到支持',
            'Adult resources alone do not establish support for the entire life cycle',
          ),
          t(
            '只要看见成蝶，就证明幼虫也在本地成功生长',
            'Seeing an adult proves successful local larval growth',
          ),
          t(
            '幼虫一定会改吃所有花蜜',
            'Larvae must switch to feeding on all nectar',
          ),
        ],
        0,
        t(
          '阶段需求不同，移动的成蝶也可能来自别处。要核查幼虫食物和生存证据，不能凭一次见蝶确认繁殖成功。',
          'Stages have different needs, and a mobile adult may arrive from elsewhere. Larval food and survival evidence are needed to establish local reproductive success.',
        ),
        look('阶段与资源的解释', 'the stage–resource explanation'),
      ),
      q(
        'L053-q4',
        'vocabulary',
        t(
          'Metamorphosis 的核心含义是什么？',
          'What is central to metamorphosis?',
        ),
        [
          t(
            '个体发育中明显的结构变化',
            'Major structural change during individual development',
          ),
          t(
            '亲代的身体直接变成后代',
            'A parent’s body directly becoming its offspring',
          ),
          t('只表示身体等比例变大', 'Only proportional enlargement'),
        ],
        0,
        t(
          'Metamorphosis 指变态，常伴随生活方式变化；不只是等比例放大，也不等同繁殖。',
          'Metamorphosis is a major developmental transformation, often with changed ways of life; it is neither mere enlargement nor reproduction.',
        ),
        look('变态词卡', 'the metamorphosis word card'),
      ),
    ],
  },
  {
    id: 'L054',
    title: t('植物如何繁殖？', 'Plant reproduction'),
    summary: t(
      '花粉到了就有种子吗？草莓还有另一条路线。',
      'Does pollen arrival guarantee seeds? Strawberry offers another route.',
    ),
    icon: '✤',
    minutes: 28,
    hook: t(
      '豌豆花上有花粉，草莓旁伸出一根长茎。两者都可能带来新植株，却一定都需要精卵融合吗？',
      'A pea flower receives pollen while a strawberry sends out a long stem. Both may produce new plants, but do both need sperm–egg fusion?',
    ),
    objectives: [
      t(
        '区分传粉、受精和种子发育。',
        'Distinguish pollination, fertilisation and seed development.',
      ),
      t(
        '追踪花粉管、精细胞、胚珠与子房的关系。',
        'Trace relationships among pollen tube, sperm cells, ovule and ovary.',
      ),
      t(
        '比较种子繁殖与草莓匍匐茎营养繁殖。',
        'Compare reproduction by seeds and vegetative reproduction by strawberry runners.',
      ),
    ],
    prediction: [
      t(
        '花粉到柱头就等于受精完成',
        'Pollen arrival at the stigma is completed fertilisation',
      ),
      t(
        '两条路线都一定经过精卵融合',
        'Both routes necessarily involve sperm–egg fusion',
      ),
      t(
        '有性与营养繁殖可用不同路线形成新个体',
        'Sexual and vegetative routes can form new individuals differently',
      ),
    ],
    terms: [
      term(
        '传粉',
        'pollination',
        '花粉从花药到达合适柱头等接收结构的转移。',
        'Transfer of pollen from anther to a receiving structure such as a suitable stigma.',
      ),
      term('受精', 'fertilisation', '配子融合的过程。', 'Fusion of gametes.'),
      term(
        '花粉管',
        'pollen tube',
        '花粉萌发后形成、参与递送精细胞的管状结构。',
        'A tube formed after pollen germination that helps deliver sperm cells.',
      ),
      term(
        '胚珠',
        'ovule',
        '含有卵细胞等结构、受精后可形成种子的部位。',
        'A structure containing the egg and other cells that can develop into a seed after fertilisation.',
      ),
      term(
        '子房',
        'ovary',
        '含胚珠的花结构，通常参与形成果实。',
        'The floral structure containing ovules, usually developing into fruit.',
      ),
      term(
        '营养繁殖',
        'vegetative reproduction',
        '由根、茎或叶等营养结构产生新植株的无性繁殖。',
        'Asexual production of new plants from structures such as roots, stems or leaves.',
      ),
    ],
    mission: t(
      '画豌豆的花粉→花粉管→融合→种子路线，与草莓母株→匍匐茎→子株路线并列，写一项共性和一项关键差异。',
      'Compare pea pollen → tube → fusion → seed with strawberry parent → runner → daughter plant, giving a shared feature and a key difference.',
    ),
    reference: {
      title: 'OpenStax: Pollination and fertilisation',
      url: 'https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization',
    },
    questions: [
      q(
        'L054-q1',
        'concept',
        t(
          '相容花粉已到达柱头，但还没递送精细胞。哪句准确？',
          'Compatible pollen reaches a stigma, but sperm delivery has not occurred. Which statement is accurate?',
        ),
        [
          t(
            '传粉已发生，受精尚未由此证明',
            'Pollination has occurred; fertilisation is not established yet',
          ),
          t('每个胚珠已经成为成熟种子', 'Every ovule is already a mature seed'),
          t(
            '子房已经完成果实发育',
            'The ovary has completed fruit development',
          ),
        ],
        0,
        t(
          '转移花粉、递送精细胞、配子融合与后续发育是不同环节；先后衔接不表示同时完成。',
          'Pollen transfer, sperm delivery, fusion and later development are distinct linked events, not simultaneous achievements.',
        ),
        look('有性路线前两步', 'the first two sexual-route steps'),
      ),
      q(
        'L054-q2',
        'concept',
        t(
          '成功受精且后续条件适宜时，哪组对应正确？',
          'Following successful fertilisation and suitable later conditions, which correspondence is correct?',
        ),
        [
          t(
            '花粉粒→整个果实，柱头→种子',
            'Pollen grain → entire fruit; stigma → seed',
          ),
          t('胚珠→种子，子房通常→果实', 'Ovule → seed; ovary usually → fruit'),
          t('花粉管→幼苗的整条根', 'Pollen tube → the seedling’s entire root'),
        ],
        1,
        t(
          '胚珠内形成种子相关结构，子房通常发育成果实；真实果实还可有其他花部参与。',
          'The ovule develops seed structures while the ovary usually develops into fruit; other floral tissues can also contribute to some fruits.',
        ),
        look('胚珠与子房图解', 'the ovule–ovary diagram'),
      ),
      q(
        'L054-q3',
        'reasoning',
        t(
          '两朵花都收到花粉，只有一朵后续结出种子。哪项最符合本课模型？',
          'Two flowers receive pollen, but only one later develops seeds. Which interpretation fits the model?',
        ),
        [
          t(
            '没有种子的花从未收到花粉',
            'The seedless flower never received pollen',
          ),
          t(
            '只要花粉到达，所有胚珠都保证成种子',
            'Pollen arrival guarantees every ovule becomes a seed',
          ),
          t(
            '还需核查相容、融合和后续发育，传粉本身不足保证',
            'Compatibility, fusion and later development need checking; pollination alone is insufficient',
          ),
        ],
        2,
        t(
          '相同的传粉观察不能排除之后环节不同。模型比较相容性；真实情况还包括活性和环境等。',
          'The same pollination observation does not rule out differences later. The model compares compatibility; viability and environment also matter in reality.',
        ),
        look('相容与不相容分支', 'compatible versus incompatible branches'),
      ),
      q(
        'L054-q4',
        'vocabulary',
        t(
          '哪一情境体现 vegetative reproduction？',
          'Which case illustrates vegetative reproduction?',
        ),
        [
          t('精细胞与卵细胞融合', 'Sperm and egg fuse'),
          t(
            '草莓匍匐茎的节长根并形成子株',
            'A strawberry runner node roots and forms a daughter plant',
          ),
          t('花粉从花药到柱头', 'Pollen transfers from anther to stigma'),
        ],
        1,
        t(
          'Vegetative reproduction 使用营养结构形成新植株；草莓也能进行有性繁殖，不能把整个物种限定为一种方式。',
          'Vegetative reproduction uses vegetative structures to make new plants. Strawberries also reproduce sexually; a species need not have only one route.',
        ),
        look('草莓匍匐茎路线', 'the strawberry-runner route'),
      ),
    ],
  },
  {
    id: 'L055',
    title: t('动物生殖与发育基础', 'Animal reproduction and development'),
    summary: t(
      '受精在哪里，与胚胎在哪里发育，是两个问题。',
      'Where fertilisation occurs and where development occurs are different questions.',
    ),
    icon: '◒',
    minutes: 28,
    hook: t(
      '鸡把卵产在体外，却是体内受精。人类在体内发育，池蛙代表情境在水中受精。怎样把这些现象整理成两个独立问题？',
      'A chicken lays an egg outside its body after internal fertilisation. Humans develop internally, while the representative pond-frog case has fertilisation in water. How can two separate questions organise this evidence?',
    ),
    objectives: [
      t(
        '解释精子、卵细胞与受精卵的关系。',
        'Explain relationships among sperm, egg and zygote.',
      ),
      t(
        '分别比较给定动物的受精与发育场所。',
        'Compare fertilisation and development sites separately in specified animals.',
      ),
      t(
        '连接人类胚胎、胎儿与胎盘物质交换。',
        'Connect human embryonic and fetal development with placental exchange.',
      ),
    ],
    prediction: [
      t(
        '凡体内受精一定体内发育',
        'Internal fertilisation always means internal development',
      ),
      t(
        '必须分别问配子在哪融合、胚胎在哪发育',
        'Ask separately where gametes fuse and where embryos develop',
      ),
      t('新个体只继承卵细胞的DNA', 'Offspring inherit DNA only from the egg'),
    ],
    terms: [
      term(
        '配子',
        'gamete',
        '参与有性生殖融合的生殖细胞，例如精子和卵细胞。',
        'A reproductive cell that fuses in sexual reproduction, such as sperm or egg.',
      ),
      term(
        '精子',
        'sperm',
        '贡献遗传物质的一类配子。',
        'A gamete contributing genetic material.',
      ),
      term(
        '卵细胞',
        'egg cell',
        '贡献遗传物质和细胞物质的一类配子。',
        'A gamete contributing genetic material and cellular resources.',
      ),
      term(
        '受精卵',
        'zygote',
        '精子与卵细胞融合后形成的新个体起始细胞。',
        'The initial cell of a new individual formed by sperm–egg fusion.',
      ),
      term(
        '胎儿',
        'fetus',
        '人类等动物在胚胎早期之后继续发育的阶段。',
        'A later prenatal developmental stage following early embryonic development.',
      ),
      term(
        '胎盘',
        'placenta',
        '母体与胎儿间进行物质交换和其他支持的器官。',
        'An organ supporting exchange and other functions between pregnant parent and fetus.',
      ),
    ],
    mission: t(
      '为代表池蛙、鸡与人类做两列比较：受精场所/发育场所。再补一条卵黄或胎盘的营养联系。',
      'Compare fertilisation/development sites in the representative frog, chicken and human cases, adding a yolk or placental nourishment connection.',
    ),
    reference: {
      title: 'OpenStax: Fertilisation and early embryonic development',
      url: 'https://openstax.org/books/biology-2e/pages/43-6-fertilization-and-early-embryonic-development',
    },
    questions: [
      q(
        'L055-q1',
        'concept',
        t(
          '哪项正确比较鸡的受精与胚胎发育？',
          'Which correctly compares fertilisation and embryonic development in a chicken?',
        ),
        [
          t(
            '卵产体外，所以一定体外受精',
            'Egg laying outside means fertilisation must be external',
          ),
          t(
            '体内受精，胚胎可在产出的卵内继续发育',
            'Internal fertilisation; development can continue inside a laid egg',
          ),
          t(
            '卵壳代替精子完成受精',
            'The eggshell replaces sperm in fertilisation',
          ),
        ],
        1,
        t(
          '受精场所与发育场所是不同变量。鸡提供体内受精与体外卵内发育的组合。',
          'Fertilisation and development location are different variables. Chickens combine internal fertilisation with development within a laid egg.',
        ),
        look('鸡的两行场所对照', 'the two site labels for chicken'),
      ),
      q(
        'L055-q2',
        'concept',
        t(
          '胎盘物质交换的准确表述是哪项？',
          'Which statement accurately describes placental exchange?',
        ),
        [
          t(
            '母体和胎儿通常通过直接混合全部血液交换',
            'Exchange usually requires all maternal and fetal blood to mix directly',
          ),
          t(
            '胎盘只输送氧，不参与养分或废物交换',
            'The placenta transfers only oxygen, not nutrients or wastes',
          ),
          t(
            '物质可跨交换界面转移，母胎血液通常不直接混合',
            'Materials cross an exchange interface, usually without direct mixing of maternal and fetal blood',
          ),
        ],
        2,
        t(
          '胎盘支持氧与养分到达胎儿，以及一些废物返回母体侧；它不是把两套循环变成一条血管。',
          'The placenta supports oxygen/nutrient transfer and return of some wastes; the two circulations do not become one blood vessel.',
        ),
        look('人类胎儿期与交换说明', 'the fetal-stage exchange explanation'),
      ),
      q(
        'L055-q3',
        'reasoning',
        t(
          '有人把“未发生精卵融合”的本课有性路线画成正常出现受精卵。怎样评价？',
          'Someone draws a zygote on this lesson’s sexual route despite no sperm–egg fusion. How should this be evaluated?',
        ),
        [
          t(
            '与本模型前提不一致；先检查是否发生融合',
            'It contradicts the model premises; check fusion first',
          ),
          t(
            '只要把动画加快就正确',
            'It becomes correct by speeding up the animation',
          ),
          t(
            '说明所有动物都不需要配子',
            'It shows all animals do not need gametes',
          ),
        ],
        0,
        t(
          '这个模型专门追踪给定有性路线；未融合不能在该路线凭空生成受精卵。动物界存在其他生殖方式，不能反向把本模型当作全部动物的定义。',
          'The specified sexual route cannot generate a zygote without fusion. Other animal reproductive modes exist, so this model is not a definition of every animal.',
        ),
        look('融合开关与模型范围', 'the fusion control and model scope'),
      ),
      q(
        'L055-q4',
        'vocabulary',
        t('Zygote 对应哪一项？', 'What does zygote name?'),
        [
          t('尚未融合的精子', 'An unfused sperm'),
          t(
            '精子与卵细胞融合形成的受精卵',
            'The fertilised cell formed by sperm–egg fusion',
          ),
          t('母体与胎儿交换物质的胎盘', 'The placenta providing exchange'),
        ],
        1,
        t(
          'Zygote 是受精卵；gamete 是配子，placenta 是胎盘，三者阶段与作用不同。',
          'Zygote means fertilised cell; gamete and placenta name different cells or structures and roles.',
        ),
        look('受精卵词卡', 'the zygote word card'),
      ),
    ],
  },
  {
    id: 'L056',
    title: t('成长中的身体变化', 'Growth and puberty'),
    summary: t(
      '大小变化、功能成熟与个体节奏，怎样分别解释？',
      'How do size changes, functional maturity and individual timing differ?',
    ),
    icon: '⌁',
    minutes: 25,
    hook: t(
      '同班同学有的先长高，有的后来才明显变化。只看身高，就能给发育排出“先进”和“落后”吗？生长与成熟为何不能用一把尺子判断？',
      'Classmates may grow taller at different times. Can height rank them as ahead or behind in development? Why can one ruler not measure both growth and maturity?',
    ),
    objectives: [
      t(
        '区分生长的大小变化与发育的功能成熟。',
        'Distinguish increased size during growth from functional maturation during development.',
      ),
      t(
        '用信号与受体解释一个示意靶细胞反应。',
        'Use signal and receptor matching to explain an illustrative target-cell response.',
      ),
      t(
        '用证据边界解释青春期个体节奏差异，不对同学作诊断或排名。',
        'Use evidence limits to discuss variation in puberty timing without diagnosis or ranking.',
      ),
    ],
    prediction: [
      t(
        '同龄人的所有变化必须同步',
        'Every change must occur simultaneously in people of the same age',
      ),
      t(
        '更高就能证明所有系统更成熟',
        'Greater height proves all systems are more mature',
      ),
      t(
        '多种系统共同调节，变化与节奏可不同',
        'Several systems coordinate changes, and timing can differ',
      ),
    ],
    terms: [
      term(
        '生长',
        'growth',
        '大小或细胞数量、体积等的增加。',
        'An increase in size, cell number or cell volume.',
      ),
      term(
        '发育',
        'development',
        '结构与功能逐步形成和成熟的过程。',
        'Progressive formation and maturation of structures and functions.',
      ),
      term(
        '青春期',
        'puberty',
        '身体逐步发生与生殖成熟等有关变化的发育时期。',
        'A period of developmental changes associated with reproductive maturation and other bodily changes.',
      ),
      term(
        '激素',
        'hormone',
        '由细胞释放、影响具有相应受体靶细胞的化学信号。',
        'A chemical signal released by cells that affects targets with relevant receptors.',
      ),
      term(
        '受体',
        'receptor',
        '能识别相应信号并参与启动反应的结构。',
        'A structure recognising a relevant signal and helping initiate a response.',
      ),
      term(
        '个体差异',
        'individual variation',
        '不同个体在特征、变化或节奏等方面的不同。',
        'Differences among individuals in traits, changes or timing.',
      ),
    ],
    mission: t(
      '完成三张证据卡的分类，写一句支持尊重个体差异的科学解释。不需要输入或比较任何人的身体数据。',
      'Classify three evidence cards and write a scientific explanation respecting individual variation. No personal body data or comparisons are needed.',
    ),
    reference: {
      title: 'NHS: Puberty and variation',
      url: 'https://www.nhs.uk/conditions/early-or-delayed-puberty/',
    },
    questions: [
      q(
        'L056-q1',
        'concept',
        t(
          '哪一组最准确地区分生长与发育？',
          'Which best distinguishes growth and development?',
        ),
        [
          t(
            '骨长度增加可体现生长；生殖功能成熟体现发育',
            'Increased bone length can show growth; reproductive maturation shows development',
          ),
          t(
            '生长只发生在植物，发育只发生在动物',
            'Only plants grow and only animals develop',
          ),
          t(
            '所有外形变化都等于生殖功能已成熟',
            'Every appearance change proves reproductive maturity',
          ),
        ],
        0,
        t(
          '两个概念相互联系但强调不同方面；单一尺寸不能证明所有系统已成熟。',
          'The ideas are related but emphasise different aspects; one size measurement cannot establish maturity of every system.',
        ),
        look('生长与发育证据卡', 'the growth-versus-development cards'),
      ),
      q(
        'L056-q2',
        'concept',
        t(
          '示意激素经过许多细胞附近，为什么只有某些细胞出现所画的特定反应？',
          'Why do only some cells show the illustrated specific response when a hormone passes many cells?',
        ),
        [
          t(
            '激素只可能沿一根神经传播',
            'Hormones can travel only along one nerve',
          ),
          t(
            '其他细胞完全没有任何生命活动',
            'Other cells have no living activity',
          ),
          t(
            '特定反应需要相应受体与细胞内条件',
            'The specific response needs relevant receptors and cellular conditions',
          ),
        ],
        2,
        t(
          '循环能让信号分布到多处，反应取决于受体及细胞内机制；没有这一反应不等于细胞所有活动停止。',
          'Circulation distributes signals broadly. Receptors and internal mechanisms shape responses; lacking this response does not stop all cell activity.',
        ),
        look(
          '有/无匹配受体的比较',
          'matching versus non-matching receptor cases',
        ),
      ),
      q(
        'L056-q3',
        'reasoning',
        t(
          '两名同龄同学身高不同。仅凭这项记录可以得出什么？',
          'Two classmates of the same age have different heights. What follows from that record alone?',
        ),
        [
          t(
            '较高者的所有系统一定更成熟',
            'The taller person has more mature systems in every respect',
          ),
          t(
            '只能确认这次身高不同，不能单独判定青春期阶段或健康',
            'Only a height difference is established; puberty stage or health cannot be assigned from it alone',
          ),
          t('较矮者一定缺少某种激素', 'The shorter person must lack a hormone'),
        ],
        1,
        t(
          '身高只是一个指标，受遗传、营养与发育节奏等影响。没有额外证据，不能推断疾病、激素状态或个人价值。',
          'Height is one measure influenced by inheritance, nutrition and developmental timing. Without further evidence it cannot establish disease, hormone status or personal worth.',
        ),
        look('推断不足的证据卡', 'the unsupported-inference card'),
      ),
      q(
        'L056-q4',
        'vocabulary',
        t('Puberty 在本课指什么？', 'What does puberty mean here?'),
        [
          t('任何一次体重增加', 'Any single gain in body mass'),
          t(
            '所有人固定年龄同时发生的一天',
            'One fixed-age day identical for everyone',
          ),
          t(
            '包含生殖成熟等变化的一个发育时期',
            'A developmental period including changes associated with reproductive maturity',
          ),
        ],
        2,
        t(
          'Puberty 是青春期发育过程的一部分，不是用一个固定生日给所有人统一评分。',
          'Puberty is a developmental period, not a fixed birthday used to score everyone identically.',
        ),
        look('青春期词卡', 'the puberty word card'),
      ),
    ],
  },
];
