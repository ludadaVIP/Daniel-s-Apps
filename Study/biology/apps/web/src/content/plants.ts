import { t, q, term, type Lesson } from '../schema';
export const plantLessons: Lesson[] = [
  {
    id: 'L009',
    title: t('植物怎样活下去？', 'What plants need'),
    icon: '☀',
    minutes: 20,
    summary: t(
      '浇水又施肥，为什么放在暗处还是长不好？',
      'Why can a watered, fertilised plant struggle in darkness?',
    ),
    hook: t(
      '一株薄荷有水、有土，却一直待在暗柜里。它缺少的只是“更多肥料”吗？帮它找齐制造糖的条件，再看看夜里发生什么。',
      'A mint plant has water and soil but stays in a dark cupboard. Does it just need more fertiliser? Find the conditions for sugar production, then investigate night-time.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Photosynthesis',
      url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis',
    },
    objectives: [
      t(
        '区分制造糖所用的物质与光能。',
        'Distinguish materials used to make sugars from light energy.',
      ),
      t(
        '解释植物夜间仍能进行细胞呼吸。',
        'Explain how plants can continue cellular respiration at night.',
      ),
    ],
    prediction: [
      t(
        '肥料就是植物的糖，越多越好',
        'Fertiliser is plant sugar; more is always better',
      ),
      t(
        '光、水和二氧化碳帮助植物制造糖',
        'Light, water and carbon dioxide support sugar production',
      ),
      t('夜里植物停止所有生命活动', 'Plants stop all life processes at night'),
    ],
    terms: [
      term(
        '光合作用',
        'photosynthesis',
        '利用光能，以水和二氧化碳等为原料制造糖等有机物的过程。',
        'A process using light energy and materials including water and carbon dioxide to make organic substances such as sugars.',
      ),
      term(
        '二氧化碳',
        'carbon dioxide',
        '空气中的一种气体，为植物制造糖提供碳。',
        'A gas in air that supplies carbon for sugar production.',
      ),
      term(
        '矿质营养',
        'mineral nutrients',
        '植物需要的无机营养，如氮、镁等；不等同于糖。',
        'Inorganic nutrients such as nitrogen and magnesium; not sugars.',
      ),
      term(
        '细胞呼吸',
        'cellular respiration',
        '细胞从有机物中释放可用能量的过程；不是吸气动作。',
        'Cell processes releasing usable energy from organic substances; not breathing movements.',
      ),
    ],
    mission: t(
      '观察一株熟悉的盆栽，记录它得到的光、水和空气。写一个合理的照料解释，不用故意让真实植物缺水或受损。',
      'Observe a familiar pot plant and record its access to light, water and air. Explain one care decision without deliberately withholding water or harming it.',
    ),
    questions: [
      q(
        'L009-q1',
        'concept',
        t(
          '水、二氧化碳和光各是什么角色？',
          'What roles do water, carbon dioxide and light have?',
        ),
        [
          t('全都是肥料', 'They are all fertilisers'),
          t('光是物质，水是能量', 'Light is matter; water is energy'),
          t(
            '水与二氧化碳提供物质，光提供能量',
            'Water and carbon dioxide supply matter; light supplies energy',
          ),
        ],
        2,
        t(
          '糖中有来自原料的原子，也储存化学能。光提供能量，却不是一种植物吸收后变成糖的“物质”。',
          'Sugars contain atoms from the starting materials and store chemical energy. Light supplies energy; it is not a material converted into sugar.',
        ),
        t(
          '查看模型中蓝色水滴、CO₂和黄色光线。',
          'Inspect the water droplets, CO₂ and yellow light rays.',
        ),
      ),
      q(
        'L009-q2',
        'concept',
        t(
          '有氧气和储存糖的健康植物，在夜里可以怎样？',
          'What can a healthy plant do at night if oxygen and stored sugars are available?',
        ),
        [
          t(
            '继续细胞呼吸，释放可用能量',
            'Continue cellular respiration and release usable energy',
          ),
          t('只能进行光合作用', 'Only perform photosynthesis'),
          t('停止所有细胞活动', 'Stop all cell activity'),
        ],
        0,
        t(
          '黑暗中本模型不制造新糖，但已有糖可以供细胞呼吸使用。光合作用与细胞呼吸是不同过程。',
          'The dark model does not make new sugars, but stored sugars can support respiration. Photosynthesis and respiration are different processes.',
        ),
        t(
          '把模型切到无光，播放至最后一帧。',
          'Switch light off and advance to the final frame.',
        ),
      ),
      q(
        'L009-q3',
        'reasoning',
        t(
          '两株同种薄荷，水和空气相近，一株在明亮处，一株在暗处。暗处长得较差，下一步怎样调查？',
          'Two mint plants have similar water and air but different light. The darker one grows poorly. How could you investigate?',
        ),
        [
          t(
            '直接断定所有植物都必须晒烈日',
            'Conclude that all plants need intense sun',
          ),
          t(
            '用多株相似植物比较光照，并控制其他条件',
            'Compare light using several similar plants while controlling other conditions',
          ),
          t(
            '把暗处植物的水、肥、光一起改变',
            'Change water, fertiliser and light together',
          ),
        ],
        1,
        t(
          '光是合理线索，但两株的差异可能还有别的原因。重复比较并控制条件，比一口断定原因更可靠；适宜光照因植物而异。',
          'Light is a plausible clue, but other differences may matter. Replication and controlled conditions strengthen the evidence; suitable light varies by plant.',
        ),
        t(
          '回看缺少一个条件时的结果；模型是解释线索，不是实验证明。',
          'Compare results when one condition is missing; a model is a clue, not experimental proof.',
        ),
      ),
      q(
        'L009-q4',
        'vocabulary',
        t(
          '哪个词指利用光能制造糖的过程？',
          'Which term describes making sugars using light energy?',
        ),
        [
          t('photosynthesis · 光合作用', 'photosynthesis'),
          t('organ · 器官', 'organ'),
          t('cellular respiration · 细胞呼吸', 'cellular respiration'),
        ],
        0,
        t(
          'Photosynthesis将光能联系到糖的制造。Cellular respiration从有机物释放可用能量，两者不能混用。',
          'Photosynthesis links light energy to sugar production. Cellular respiration releases usable energy from organic substances.',
        ),
        t('用词卡比较两个过程的作用。', 'Compare the process word cards.'),
      ),
    ],
  },
  {
    id: 'L010',
    title: t('根、茎、叶分工', 'Roots, stems and leaves'),
    icon: '↟',
    minutes: 18,
    summary: t(
      '根在土里，怎么得到叶片制造的糖？',
      'How does a root get sugars made in leaves?',
    ),
    hook: t(
      '浇水浇在根附近，叶片却得到水；糖在叶片制造，地下的根却也需要它。植物里面藏着怎样的“交通路线”？',
      'Water reaches roots, yet leaves receive it. Sugars are made in leaves, yet roots need them too. What transport routes connect the plant?',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Plant transport',
      url: 'https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    },
    objectives: [
      t(
        '追踪水由根经茎到叶的路线。',
        'Trace water from roots through stems to leaves.',
      ),
      t(
        '解释根、茎、叶的协作及糖向需求部位的运输。',
        'Explain cooperation and sugar transport towards parts that need it.',
      ),
    ],
    prediction: [
      t(
        '根吸收水，叶制造糖，茎连接和运输',
        'Roots take up water, leaves make sugars, stems connect and transport',
      ),
      t('根把土块变成糖', 'Roots turn chunks of soil into sugar'),
      t('茎只负责撑住植物', 'Stems only hold a plant upright'),
    ],
    terms: [
      term(
        '根',
        'root',
        '帮助固定植物，并从环境吸收水和矿质营养。',
        'Helps anchor a plant and take up water and mineral nutrients.',
      ),
      term(
        '茎',
        'stem',
        '连接器官，支持植物并提供运输通道。',
        'Connects organs, supports the plant and contains transport tissues.',
      ),
      term(
        '叶',
        'leaf',
        '许多植物进行光合作用的重要器官，也参与气体交换。',
        'An important photosynthetic organ in many plants; also involved in gas exchange.',
      ),
      term(
        '运输',
        'transport',
        '物质由一个部位移到另一个部位的过程。',
        'Movement of substances between different parts.',
      ),
    ],
    mission: t(
      '观察一株现有盆栽或照片，画出根—茎—叶。用蓝箭头画水的路线，用金箭头画叶片制造的糖到根或新芽的路线；看不到根可用虚线推测并注明。',
      'Observe an existing plant or photo. Draw roots, stem and leaves; use blue arrows for water and gold for sugars travelling to roots or growing buds. Mark unseen roots as an inference.',
    ),
    questions: [
      q(
        'L010-q1',
        'concept',
        t(
          '此模型的水由哪里进入，再到叶片？',
          'Where does water enter before reaching leaves in this model?',
        ),
        [
          t('根→茎→叶', 'Root → stem → leaf'),
          t('叶→土→根', 'Leaf → soil → root'),
          t('只有叶，不需要茎', 'Only leaves; stems are unnecessary'),
        ],
        0,
        t(
          '根吸收水，运输组织把水沿茎送到叶。这里追踪一条简化路线，不表示每滴水都进入光合作用。',
          'Roots take up water, and transport tissues carry it through stems to leaves. This is a simplified route, not a claim that every drop enters photosynthesis.',
        ),
        t(
          '选择“追踪水”，逐步查看四帧。',
          'Select “Trace water” and advance through four frames.',
        ),
      ),
      q(
        'L010-q2',
        'concept',
        t(
          '地下的根没有绿色叶片，怎样得到糖？',
          'How can underground roots receive sugars?',
        ),
        [
          t('把土当作糖直接吃掉', 'Eat soil as sugar'),
          t('只能等别人喂糖', 'Only receive sugar when humans feed them'),
          t(
            '叶片制造的糖可经运输组织送到根',
            'Sugars made in leaves can be transported to roots',
          ),
        ],
        2,
        t(
          '根与叶不是各自独立的植物。叶片制造的糖可供根使用或储存；根供给的水和矿质营养也帮助叶。',
          'Roots and leaves are parts of one plant. Leaves can supply sugars to roots for use or storage; roots supply water and minerals in return.',
        ),
        t(
          '切到“追踪糖”，看根和新芽两个去向。',
          'Switch to “Trace sugars”; inspect both roots and growing buds.',
        ),
      ),
      q(
        'L010-q3',
        'reasoning',
        t(
          '同学说：“糖的箭头向下，所以植物的糖永远只向下。”怎样回应？',
          'A classmate says: “The sugar arrow points down, so sugars always move down.” How would you respond?',
        ),
        [
          t('对，所有植物都一样', 'Correct; all plants are identical'),
          t(
            '图中只是一个去向，糖可运往上方新芽等需求部位',
            'The diagram shows one destination; sugars can also reach growing buds above',
          ),
          t('糖从来不会移动', 'Sugars never move'),
        ],
        1,
        t(
          '运输方向取决于来源和需要。这里同时画根和新芽；一条向下箭头不能代表全部情况。',
          'Transport depends on sources and destinations. Roots and growing buds are both shown; one downward arrow cannot represent every route.',
        ),
        t(
          '观察糖路线的分支，而不是只背箭头方向。',
          'Inspect the branching sugar route rather than memorising one direction.',
        ),
      ),
      q(
        'L010-q4',
        'vocabulary',
        t(
          '哪个词表示连接根与叶、含运输组织的“茎”？',
          'Which term means the structure connecting roots and leaves and containing transport tissues?',
        ),
        [
          t('root · 根', 'root'),
          t('leaf · 叶', 'leaf'),
          t('stem · 茎', 'stem'),
        ],
        2,
        t(
          'Stem是茎。茎兼有支持、连接和运输作用，一些茎还能储存物质或进行光合作用。',
          'A stem supports, connects and transports. Some stems also store substances or photosynthesise.',
        ),
        t(
          '指着整株植物图，说明stem如何连接器官。',
          'Use the plant diagram to explain how the stem connects organs.',
        ),
      ),
    ],
  },
  {
    id: 'L011',
    title: t('花与种子的旅行', 'Flowers, fruits and seeds'),
    icon: '✿',
    minutes: 20,
    summary: t(
      '豌豆荚也是果实？花粉和种子有什么区别？',
      'Is a pea pod a fruit? How are pollen and seeds different?',
    ),
    hook: t(
      '打开豌豆荚，里面的小豌豆从哪里来？把花粉、花、果实和种子排成一段故事，再让带着种子的果实开始旅行。',
      'Where did the peas inside a pod come from? Connect pollen, flowers, fruits and seeds into a story, then investigate their journeys.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Pollination and seeds',
      url: 'https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization',
    },
    objectives: [
      t(
        '区分传粉、受精、果实与种子。',
        'Distinguish pollination, fertilisation, fruits and seeds.',
      ),
      t(
        '依据结构推测传播方式，并说明推测的限度。',
        'Use structure to suggest dispersal routes and recognise limits.',
      ),
    ],
    prediction: [
      t('花粉就是一颗小种子', 'Pollen is a tiny seed'),
      t('只有甜的东西才是果实', 'Only sweet foods are fruits'),
      t(
        '种子形成需要过程，果实常帮助保护或传播种子',
        'Seeds develop through a process; fruits often protect or disperse them',
      ),
    ],
    terms: [
      term(
        '传粉',
        'pollination',
        '花粉到达花的柱头；不等同于受精。',
        'Pollen reaching a flower’s stigma; not the same as fertilisation.',
      ),
      term(
        '受精',
        'fertilisation',
        '生殖细胞结合，开始形成新个体的发育过程。',
        'Fusion of reproductive cells, initiating development of a new individual.',
      ),
      term(
        '果实',
        'fruit',
        '开花植物花的部分发育而来的结构，通常包围种子；可甜，也可不甜。',
        'A structure developing from flower parts in flowering plants, usually enclosing seeds; not necessarily sweet.',
      ),
      term(
        '传播',
        'dispersal',
        '种子或含种子的果实离开母株附近，移到别处。',
        'Movement of seeds or seed-containing fruits away from the parent plant.',
      ),
    ],
    mission: t(
      '观察家中已有的豌豆荚、番茄或照片，区分果实外部与种子。再从窗外看一种带翅或绒毛的果实，写出传播猜想及还需的证据。',
      'Inspect an existing pea pod, tomato or photo; distinguish fruit from seeds. Look for a winged or hairy fruit outside and suggest a dispersal route plus evidence still needed.',
    ),
    questions: [
      q(
        'L011-q1',
        'concept',
        t(
          '花粉落到柱头后，能说“种子已经形成”吗？',
          'Does pollen reaching a stigma mean a seed has already formed?',
        ),
        [
          t('能，花粉就是种子', 'Yes; pollen is a seed'),
          t(
            '不能，传粉之后还需要受精和发育等过程',
            'No; fertilisation and development must follow pollination',
          ),
          t('不能，因为植物不能繁殖', 'No; plants cannot reproduce'),
        ],
        1,
        t(
          '传粉是花粉到达柱头。适合的花粉萌发后，生殖细胞才能经后续过程完成受精；成功发育也需要条件。',
          'Pollination is pollen reaching the stigma. Suitable pollen can germinate, allowing later processes leading to fertilisation; development also needs suitable conditions.',
        ),
        t(
          '比较模型第2帧和第3帧。',
          'Compare frames 2 and 3 of the flower sequence.',
        ),
      ),
      q(
        'L011-q2',
        'concept',
        t(
          '豌豆荚和里面的小豌豆分别是什么？',
          'What are the pea pod and the peas inside?',
        ),
        [
          t(
            '荚是果实，里面的豌豆是种子',
            'The pod is a fruit; the peas are seeds',
          ),
          t('荚是根，豌豆是花粉', 'The pod is a root; peas are pollen'),
          t('都只是叶片', 'Both are leaves'),
        ],
        0,
        t(
          '“果实”是植物结构概念，不按甜不甜来分。豌豆荚由花的子房发育，胚珠发育成种子。',
          'Fruit is a botanical structure, not a sweetness category. The pod develops from the ovary, and ovules develop into seeds.',
        ),
        t(
          '看果荚剖面，分清外部荚壁和内部种子。',
          'Inspect the pod cutaway and distinguish its wall from the seeds.',
        ),
      ),
      q(
        'L011-q3',
        'reasoning',
        t(
          '一个小果实有细长绒毛。什么结论最合理？',
          'A small fruit has long fine hairs. Which conclusion is reasonable?',
        ),
        [
          t('一定会飞到100公里外', 'It will definitely travel 100km'),
          t('它已经学会飞行', 'It has learned to fly'),
          t(
            '绒毛可能帮助风传播，还需观察真实移动',
            'The hairs may help wind dispersal; observe actual movement to test this',
          ),
        ],
        2,
        t(
          '结构可以支持传播假说，却不能单独确定距离与成功落地。风、湿度和障碍物都会影响结果。',
          'Structure supports a dispersal hypothesis, but does not establish travel distance or successful arrival. Wind, moisture and obstacles affect outcomes.',
        ),
        t(
          '切到风传播，留意“示意路径，不预测距离”。',
          'Select wind dispersal and read the schematic-distance note.',
        ),
      ),
      q(
        'L011-q4',
        'vocabulary',
        t(
          '哪个词表示种子或果实离开母株的“传播”？',
          'Which term means seeds or fruits moving away from the parent plant?',
        ),
        [
          t('photosynthesis · 光合作用', 'photosynthesis'),
          t('pollination · 传粉', 'pollination'),
          t('dispersal · 传播', 'dispersal'),
        ],
        2,
        t(
          'Dispersal是传播，pollination是传粉。花粉的移动与含种子果实的移动是不同阶段。',
          'Dispersal and pollination refer to different stages: movement of seed-containing structures differs from pollen reaching a stigma.',
        ),
        t(
          '用词卡把pollination和dispersal放在生命故事的不同位置。',
          'Place pollination and dispersal at different points in the life story.',
        ),
      ),
    ],
  },
  {
    id: 'L012',
    title: t('为什么有的植物长刺？', 'Plants in different habitats'),
    icon: '♧',
    minutes: 20,
    summary: t(
      '仙人掌的刺，让它不再需要水了吗？',
      'Do spines mean a cactus no longer needs water?',
    ),
    hook: t(
      '仙人掌少有宽叶，睡莲却把宽叶铺在水面。它们面对的难题相同吗？换一个环境，看看同一种结构为什么会有好处，也有代价。',
      'Cacti have few broad leaves, while water lilies spread broad leaves across water. Do they face the same problems? Change the habitat and explore benefits and limitations.',
    ),
    reference: {
      title: 'OpenStax Biology 2e · Leaf adaptations',
      url: 'https://openstax.org/books/biology-2e/pages/30-4-leaves',
    },
    objectives: [
      t(
        '用结构→作用→环境的因果链解释一种适应。',
        'Explain an adaptation through structure → function → environment.',
      ),
      t(
        '识别适应的代价，避免“需要所以立刻长出”的解释。',
        'Recognise trade-offs and avoid need-based instant-change explanations.',
      ),
    ],
    prediction: [
      t(
        '仙人掌想省水，就立刻把叶变成刺',
        'A cactus instantly changes leaves into spines because it wants to save water',
      ),
      t(
        '结构特征与长期环境有关，但没有万能结构',
        'Traits relate to environments over generations; no structure is universally best',
      ),
      t('有刺就永远不需要水', 'Spines remove the need for water'),
    ],
    terms: [
      term(
        '栖息地',
        'habitat',
        '生物生活的地方及其条件，如光、水和温度。',
        'The place and conditions where an organism lives, including light, water and temperature.',
      ),
      term(
        '适应',
        'adaptation',
        '在特定环境中帮助生存或繁殖的可遗传特征。',
        'An inherited trait that helps survival or reproduction in a particular environment.',
      ),
      term(
        '蒸腾',
        'transpiration',
        '植物以水蒸气形式失水的过程，主要来自叶等部位。',
        'Loss of water vapour from a plant, mainly from leaves and other exposed parts.',
      ),
      term(
        '代价',
        'trade-off',
        '一个优势可能伴随另一方面的限制。',
        'A benefit can come with a limitation in another respect.',
      ),
    ],
    mission: t(
      '观察一株熟悉植物的叶形和环境，写“我观察到……；它可能帮助……；还需……证据”。只看不摸刺，不为试验改变真实植物环境。',
      'Observe a familiar plant’s leaf shape and surroundings. Write “I observe …; it may help …; I still need … evidence.” Look without touching spines or altering the plant’s environment.',
    ),
    questions: [
      q(
        'L012-q1',
        'concept',
        t(
          '许多仙人掌的刺叶与绿色厚茎可以怎样协作？',
          'How can spine-like leaves and thick green stems cooperate in many cacti?',
        ),
        [
          t(
            '刺吸收全部水，茎只负责支撑',
            'Spines absorb all water; stems only provide support',
          ),
          t(
            '刺叶减少失水面积，厚茎储水且可光合作用',
            'Reduced leaves limit exposed area; thick stems store water and can photosynthesise',
          ),
          t(
            '刺证明仙人掌永远不失水',
            'Spines prove a cactus never loses water',
          ),
        ],
        1,
        t(
          '减少叶面积可减少失水，厚茎可储水并承担光合作用。刺也可防御取食；不能用一种功能解释全部结构。',
          'Reduced leaf area can reduce water loss; thick green stems can store water and photosynthesise. Spines can also deter herbivores; one function does not explain everything.',
        ),
        t(
          '点图中“刺叶”和“厚茎”，比较两个作用。',
          'Inspect the spines and thick stem clues.',
        ),
      ),
      q(
        'L012-q2',
        'concept',
        t(
          '把仙人掌放进长期积水的土里，是更保险的照料吗？',
          'Is persistently waterlogged soil necessarily safer for a cactus?',
        ),
        [
          t(
            '不是，水太多会限制根的氧气等条件',
            'No; excess water can limit conditions such as root oxygen',
          ),
          t('是，植物越多水越好', 'Yes; more water is always better'),
          t('是，因为有刺能吸走所有水', 'Yes; spines absorb all the water'),
        ],
        0,
        t(
          '需要水不等于适合积水。许多根也需要氧气；不同植物对环境的适应不同。模型指出限制，不能当作浇水时间表。',
          'Needing water does not imply tolerating waterlogging. Many roots need oxygen; tolerance differs across plants. The model shows constraints, not a watering schedule.',
        ),
        t(
          '切到水面环境，查看厚茎植物的限制提示。',
          'Select the water habitat and inspect the thick-stem plant’s limitation.',
        ),
      ),
      q(
        'L012-q3',
        'reasoning',
        t(
          '“天气干了，这株植物想活下来，所以今天长出刺。”哪里需要改进？',
          'What is wrong with “It became dry, so this plant wanted to survive and grew spines today”?',
        ),
        [
          t(
            '应该说植物会有意识地设计器官',
            'Say plants consciously design organs',
          ),
          t(
            '个体因需要长出的结构必然遗传给后代',
            'Any structure grown because of need must be inherited by offspring',
          ),
          t(
            '可遗传差异可经许多代改变分布，不是愿望使个体立刻变形',
            'Inherited differences can change in frequency over generations; desire does not instantly reshape an individual',
          ),
        ],
        2,
        t(
          '个体可有生长和生理反应，但适应的演化涉及可遗传差异与不同的繁殖成功。换环境按钮只改变比较情境，不使植物变成另一种。',
          'Individuals can grow and respond physiologically, but evolutionary adaptation involves inherited differences and unequal reproductive success. The habitat button changes the comparison, not the species.',
        ),
        t(
          '阅读“再想深一点”，区分个体反应与多代变化。',
          'Read “Think deeper” to separate individual responses from changes across generations.',
        ),
      ),
      q(
        'L012-q4',
        'vocabulary',
        t(
          '哪个词描述“一个优势伴随另一方面限制”？',
          'Which word describes a benefit accompanied by a limitation?',
        ),
        [
          t('trade-off · 代价', 'trade-off'),
          t('tissue · 组织', 'tissue'),
          t('pollination · 传粉', 'pollination'),
        ],
        0,
        t(
          'Trade-off提醒我们看完整条件：宽叶可接收光，也增大暴露表面；实际失水还受气孔、外皮与环境影响。',
          'A trade-off invites a fuller comparison: broad leaves can intercept light but expose more surface. Actual water loss also depends on stomata, coverings and conditions.',
        ),
        t(
          '对比同一结构的“帮助”和“限制”。',
          'Compare the benefit and limitation of the same structure.',
        ),
      ),
    ],
  },
];
