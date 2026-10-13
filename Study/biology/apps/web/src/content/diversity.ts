import type { Lesson } from '../schema';
export const diversityLessons: Lesson[] = [
  {
    id: 'L045',
    title: {
      zh: '怎样给生物分类？',
      en: 'Classifying life',
    },
    summary: {
      zh: '六张图，怎样不靠猜名字找出它？',
      en: 'How can six pictures be identified without guessing names?',
    },
    hook: {
      zh: '一片蕨叶像羽毛，一只昆虫和蜘蛛都有分节的腿。别急着背名字：每问一个能检查的问题，就让候选集合变小。看不清也可以停在“未知”。',
      en: 'A fern frond resembles a feather; an insect and a spider both have jointed legs. Instead of memorising names, ask checkable questions to shrink the candidate set. Unclear clues can remain unknown.',
    },
    minutes: 20,
    icon: '⌘',
    objectives: [
      {
        zh: '依据可观察特征使用简单二分检索表。',
        en: 'Use observable traits in a simple binary identification key.',
      },
      {
        zh: '区分本例辨认路线与科学分类、演化关系。',
        en: 'Distinguish this identification route from classification and evolutionary relationships.',
      },
    ],
    prediction: [
      {
        zh: '只按颜色就能辨认所有生物',
        en: 'Colour alone identifies all life',
      },
      {
        zh: '逐步比较可核对的结构特征',
        en: 'Compare checkable structural traits step by step',
      },
      {
        zh: '每个未知都必须立刻猜名字',
        en: 'Every unknown needs an immediate guessed name',
      },
    ],
    terms: [
      {
        word: {
          zh: '特征',
          en: 'trait',
        },
        meaning: {
          zh: '可描述或检查的属性，例如羽毛、叶片或腿的结构。',
          en: 'A describable property such as feather, leaf or leg structure.',
        },
      },
      {
        word: {
          zh: '分类',
          en: 'classification',
        },
        meaning: {
          zh: '依据共同特征与亲缘等证据组织生物。',
          en: 'Organising life using shared traits and evidence of relationships.',
        },
      },
      {
        word: {
          zh: '检索表',
          en: 'identification key',
        },
        meaning: {
          zh: '用一系列选择缩小候选的辨认工具。',
          en: 'A tool narrowing candidates through a sequence of choices.',
        },
      },
      {
        word: {
          zh: '二分',
          en: 'binary choice',
        },
        meaning: {
          zh: '每步有两个相互区分的选项。',
          en: 'Two distinguishing alternatives at a step.',
        },
      },
      {
        word: {
          zh: '未知',
          en: 'unknown',
        },
        meaning: {
          zh: '证据不足时保留的状态，不等于不存在。',
          en: 'A retained state when evidence is insufficient, not absence.',
        },
      },
    ],
    questions: [
      {
        id: 'L045-q1',
        skill: 'concept',
        prompt: {
          zh: '本例辨认第一步最适合看什么？',
          en: 'What is suitable for the first identification step here?',
        },
        options: [
          {
            zh: '有植物叶片，还是动物结构',
            en: 'Plant leaves versus animal structures',
          },
          {
            zh: '它是不是我最喜欢的颜色',
            en: 'Whether it has my favourite colour',
          },
          {
            zh: '它是不是在左边',
            en: 'Whether it is on the left',
          },
        ],
        correct: 0,
        feedback: {
          zh: '本检索表限定六张图，用结构问题逐步缩小候选，不是所有生命的总分类。',
          en: 'This key covers six pictures and narrows candidates by structure; it is not a classification of all life.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L045-q2',
        skill: 'concept',
        prompt: {
          zh: '本例完整昆虫图与蜘蛛图怎样分开？',
          en: 'How are this complete insect and spider illustration separated?',
        },
        options: [
          {
            zh: '按屏幕上谁更大',
            en: 'By larger screen size',
          },
          {
            zh: '六腿与触角、或八腿',
            en: 'Six legs with antennae versus eight legs',
          },
          {
            zh: '都叫同一物种',
            en: 'Calling them one species',
          },
        ],
        correct: 1,
        feedback: {
          zh: '腿数只适用于这里完整成体图的比较。真实缺腿、遮挡或幼体时，要保留不确定。',
          en: 'Leg counts apply to these complete adult illustrations. Real damage, occlusion or immature forms require uncertainty.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L045-q3',
        skill: 'reasoning',
        prompt: {
          zh: '照片只拍到一半腿，下一步怎么做？',
          en: 'A photo shows only some legs. What next?',
        },
        options: [
          {
            zh: '把缺的腿当不存在',
            en: 'Treat hidden legs as absent',
          },
          {
            zh: '强迫走八腿支路',
            en: 'Force the eight-leg route',
          },
          {
            zh: '记下看不清，补观察或查可靠资料',
            en: 'Record uncertainty and seek more observations or reliable references',
          },
        ],
        correct: 2,
        feedback: {
          zh: '未知是诚实的结果。检索表对材料和特征完整性有要求，不能硬套。',
          en: 'Unknown is a valid result. A key has limits on samples and visible traits.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L045-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'identification key最接近什么？',
          en: 'What best describes an identification key?',
        },
        options: [
          {
            zh: '候选逐步减少的特征选择工具',
            en: 'A trait-choice tool narrowing candidates',
          },
          {
            zh: '打开细胞膜的钥匙',
            en: 'A key unlocking a membrane',
          },
          {
            zh: '证明所有生物年龄相同',
            en: 'Proof all life is the same age',
          },
        ],
        correct: 0,
        feedback: {
          zh: '检索表帮辨认；分支顺序不一定是祖先的分支顺序。',
          en: 'Keys aid identification; question order need not represent ancestral branching.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
    ],
    mission: {
      zh: '为六个课程样本写一张二分检索表，先用叶片/动物，再分蕨叶/带状叶、羽毛/分节腿、两种白羽位置与六/八腿。',
      en: 'Write a binary key for six lesson samples: leaves/animals, fronds/straps, feathers/jointed legs, white feather locations, and six/eight legs.',
    },
    reference: {
      title: 'Concept reference · Classifying life',
      url: 'https://openstax.org/books/biology-2e/pages/20-1-organizing-life-on-earth',
    },
  },
  {
    id: 'L046',
    title: {
      zh: '物种与共同特征',
      en: 'Species and similarities',
    },
    summary: {
      zh: '颜色不同可能同种，颜色相似可能不同种？',
      en: 'Can different colours belong to one species and similar colours to different species?',
    },
    hook: {
      zh: 'tūī的羽毛有时看起来深黑，有时闪着绿蓝光。kererū也可能有绿色光泽。颜色这条线索，到底能告诉我们多少？',
      en: 'Tūī plumage can look dark or iridescent green-blue, while kererū can also look green-toned. How far can colour take an explanation?',
    },
    minutes: 20,
    icon: '⌘',
    objectives: [
      {
        zh: '区分个体差异、物种和更大的共同类群。',
        en: 'Distinguish individual variation, species and broader groups.',
      },
      {
        zh: '用多类证据说明相似不等于同种。',
        en: 'Explain why similarity alone does not establish one species.',
      },
    ],
    prediction: [
      {
        zh: '相同颜色必然同种',
        en: 'Same colour guarantees one species',
      },
      {
        zh: '共同特征与物种身份需要分层、多证据判断',
        en: 'Shared traits and species identity need multiple lines of evidence at different levels',
      },
      {
        zh: '同种个体必须看起来完全一样',
        en: 'Individuals of one species must look identical',
      },
    ],
    terms: [
      {
        word: {
          zh: '物种',
          en: 'species',
        },
        meaning: {
          zh: '一种生物分类单位；边界依据多种证据和适用概念。',
          en: 'A unit of classification whose boundaries use multiple lines of evidence and suitable concepts.',
        },
      },
      {
        word: {
          zh: '个体差异',
          en: 'variation',
        },
        meaning: {
          zh: '同种个体也可能在大小、年龄、外观等方面不同。',
          en: 'Individuals within a species may differ in size, age or appearance.',
        },
      },
      {
        word: {
          zh: '亲缘',
          en: 'relatedness',
        },
        meaning: {
          zh: '与共同祖先有关的关系，不仅靠外形相似。',
          en: 'Relationship through common ancestry, not resemblance alone.',
        },
      },
      {
        word: {
          zh: '类群',
          en: 'group',
        },
        meaning: {
          zh: '具有某些共同特征或关系的一组生物，可含多个物种。',
          en: 'Organisms sharing traits or relationships, potentially including several species.',
        },
      },
      {
        word: {
          zh: '证据不足',
          en: 'insufficient evidence',
        },
        meaning: {
          zh: '现有线索不能支持更具体的结论。',
          en: 'Available clues do not support a more specific conclusion.',
        },
      },
    ],
    questions: [
      {
        id: 'L046-q1',
        skill: 'concept',
        prompt: {
          zh: '成体tūī在不同光线下羽色不同，是否因此变成不同物种？',
          en: 'Do different lighting views make adult tūī different species?',
        },
        options: [
          {
            zh: '会，光线改变物种',
            en: 'Yes; light changes species',
          },
          {
            zh: '不会，外观差异不直接改变物种身份',
            en: 'No; appearance differences do not directly change identity',
          },
          {
            zh: '羽毛会变成叶片',
            en: 'Feathers become leaves',
          },
        ],
        correct: 1,
        feedback: {
          zh: '模型提供已标定的tūī身份，比较观察条件；没有进行DNA检验。',
          en: 'The model supplies labelled tūī identity and compares viewing conditions; it performs no DNA test.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L046-q2',
        skill: 'concept',
        prompt: {
          zh: 'tūī和kererū都有羽毛，可以得出什么？',
          en: 'Tūī and kererū both have feathers. What follows?',
        },
        options: [
          {
            zh: '可联系鸟类共同特征，但它们是不同物种',
            en: 'They share bird traits while being different species',
          },
          {
            zh: '一定是同一物种',
            en: 'They must be one species',
          },
          {
            zh: '它们没有共同祖先',
            en: 'They have no common ancestry',
          },
        ],
        correct: 0,
        feedback: {
          zh: '鸟类是包含很多物种的更大类群。图中名称由可靠资料给定，单独羽毛不足以鉴定。',
          en: 'Birds form a broader group containing many species. Names are supplied from references; feathers alone do not identify species.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L046-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只看到一小片绿羽，最合理结论？',
          en: 'Only a small green feather patch is visible. Best conclusion?',
        },
        options: [
          {
            zh: '必定是tūī',
            en: 'Certainly tūī',
          },
          {
            zh: '必定是kererū',
            en: 'Certainly kererū',
          },
          {
            zh: '还不足以确认具体物种，需更多线索',
            en: 'Insufficient for species identity; more clues are needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '多种鸟可有相似羽色，观察角度也影响颜色。留未知比给出过强标签更可靠。',
          en: 'Several birds can show similar colour, and viewing angle matters. Unknown is better supported than an excessive label.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L046-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'variation在此最接近什么？',
          en: 'What does variation mean here?',
        },
        options: [
          {
            zh: '所有个体完全一样',
            en: 'All individuals identical',
          },
          {
            zh: '同种个体间也可有差异',
            en: 'Differences can occur within a species',
          },
          {
            zh: '只表示动物捕食',
            en: 'Only animal predation',
          },
        ],
        correct: 1,
        feedback: {
          zh: '差异不一定代表物种界限；也要区分个体差异与同一个体的观察条件变化。',
          en: 'Differences need not mark species boundaries; individual differences also differ from changed views of one individual.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
    ],
    mission: {
      zh: '写一个“相同类群但不同物种”的例子和一个“外观变化不能直接判断物种”的例子。',
      en: 'Write one shared-group/different-species example and one appearance change that does not establish a species difference.',
    },
    reference: {
      title: 'Concept reference · Species and similarities',
      url: 'https://openstax.org/books/biology-2e/pages/18-2-formation-of-new-species',
    },
  },
  {
    id: 'L047',
    title: {
      zh: '竞争、捕食与共生',
      en: 'Interactions in ecosystems',
    },
    summary: {
      zh: '邻居、食物与合作伙伴，怎样分？',
      en: 'How do neighbours, food and partners differ?',
    },
    hook: {
      zh: '两株幼苗都想接收到光；蜘蛛捕获昆虫；tūī从花取蜜，又可能带走花粉。同在一张图里，关系并不都一样，也不是“好生物”和“坏生物”的比赛。',
      en: 'Seedlings both need light, a spider catches an insect, and a tūī takes nectar while possibly carrying pollen. Sharing a scene does not mean sharing a relationship, or a contest of good and bad organisms.',
    },
    minutes: 20,
    icon: '⌘',
    objectives: [
      {
        zh: '用资源与作用辨别竞争、捕食和条件性互利。',
        en: 'Identify competition, predation and conditional mutual benefit through resources and effects.',
      },
      {
        zh: '区分访花行为、花粉转移与成功结实的证据。',
        en: 'Separate a visit, pollen transfer and successful fruit development.',
      },
    ],
    prediction: [
      {
        zh: '只要同处一地就一定互利',
        en: 'Living together always means mutual benefit',
      },
      {
        zh: '需看资源、行为与双方影响',
        en: 'Inspect resources, actions and effects on both sides',
      },
      {
        zh: '自然界的关系只分好与坏',
        en: 'Natural relationships are just good or bad',
      },
    ],
    terms: [
      {
        word: {
          zh: '竞争',
          en: 'competition',
        },
        meaning: {
          zh: '共同需求涉及有限资源，使用可使另一方可用量减少。',
          en: 'Shared demand for a limited resource, with use reducing access for others.',
        },
      },
      {
        word: {
          zh: '捕食',
          en: 'predation',
        },
        meaning: {
          zh: '捕食者取食猎物的关系。',
          en: 'A predator feeding on prey.',
        },
      },
      {
        word: {
          zh: '互利',
          en: 'mutualism',
        },
        meaning: {
          zh: '在适用条件下双方都受益的关系。',
          en: 'A relationship benefiting both sides under relevant conditions.',
        },
      },
      {
        word: {
          zh: '共生',
          en: 'symbiosis',
        },
        meaning: {
          zh: '通常指不同物种长期紧密生活；可包含多种效果。',
          en: 'Usually close, persistent association between different species, with varied effects.',
        },
      },
      {
        word: {
          zh: '资源',
          en: 'resource',
        },
        meaning: {
          zh: '生物使用的物质、能量来源或空间等。',
          en: 'Materials, energy sources, space or other things organisms use.',
        },
      },
    ],
    questions: [
      {
        id: 'L047-q1',
        skill: 'concept',
        prompt: {
          zh: '两株幼苗都依赖有限光，哪种关系最相关？',
          en: 'Two seedlings depend on limited light. Which relationship fits?',
        },
        options: [
          {
            zh: '共同资源的竞争',
            en: 'Competition for a shared resource',
          },
          {
            zh: '一株必须吃掉另一株',
            en: 'One must eat the other',
          },
          {
            zh: '必然相互传粉',
            en: 'They must pollinate each other',
          },
        ],
        correct: 0,
        feedback: {
          zh: '竞争无需直接打斗；遮光或资源使用就可改变机会。本图不推算生长量。',
          en: 'Competition need not involve fighting; shade or use can change access. Growth is not calculated.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L047-q2',
        skill: 'concept',
        prompt: {
          zh: '捕食示例中食物箭头从哪到哪？',
          en: 'Which way does the food arrow run in the predation example?',
        },
        options: [
          {
            zh: '蜘蛛→昆虫，因为蜘蛛追它',
            en: 'Spider → insect because the spider chases it',
          },
          {
            zh: '昆虫猎物→蜘蛛捕食者',
            en: 'Insect prey → spider predator',
          },
          {
            zh: '随便选',
            en: 'Either direction',
          },
        ],
        correct: 1,
        feedback: {
          zh: '箭头表达材料和能量的递送；追逐方向是另一种箭头用途。',
          en: 'The arrow describes material and energy transfer; pursuit is a different arrow meaning.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L047-q3',
        skill: 'reasoning',
        prompt: {
          zh: '只确认tūī取到花蜜，能断言花也受益吗？',
          en: 'Only nectar feeding is confirmed. Is plant benefit established?',
        },
        options: [
          {
            zh: '能，访问一定结实',
            en: 'Yes; visits guarantee fruit',
          },
          {
            zh: '能，所有关系都是互利',
            en: 'Yes; all relationships are mutualism',
          },
          {
            zh: '不能，还需花粉递送等证据',
            en: 'No; evidence such as pollen delivery is also needed',
          },
        ],
        correct: 2,
        feedback: {
          zh: '模型接触花粉支路支持潜在传粉帮助，仍不保证受精与种子发育。',
          en: 'Pollen-contact supports potential pollination benefit, not guaranteed fertilisation or seed development.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L047-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'symbiosis一定等于双方受益吗？',
          en: 'Does symbiosis always mean both benefit?',
        },
        options: [
          {
            zh: '不一定，共生也可包含寄生等关系',
            en: 'No; symbiosis can also include parasitism',
          },
          {
            zh: '一定，所有长期关系都互利',
            en: 'Yes; every persistent relation is mutual benefit',
          },
          {
            zh: '它只表示光合作用',
            en: 'It means only photosynthesis',
          },
        ],
        correct: 0,
        feedback: {
          zh: '互利与共生不能当作完全同义词。鸟访花是互利例子，不要求长期同居。',
          en: 'Mutualism and symbiosis are not perfect synonyms. Bird–flower mutual benefit need not be persistent cohabitation.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
    ],
    mission: {
      zh: '写一条资源→使用者路线和一个关系判断，标出直接行为线索与尚未确认结果。',
      en: 'Write a resource → user route and identify a relationship, separating visible behaviour from unconfirmed outcomes.',
    },
    reference: {
      title: 'Concept reference · Interactions in ecosystems',
      url: 'https://openstax.org/books/biology-2e/pages/45-6-community-ecology',
    },
  },
  {
    id: 'L048',
    title: {
      zh: '新西兰的独特生命',
      en: 'Life in Aotearoa New Zealand',
    },
    summary: {
      zh: '森林与海岸，不是两个名字而已。',
      en: 'Forest and coast are more than place names.',
    },
    hook: {
      zh: '一只tūī需要花蜜等食物，一只katipō需要沙丘里的隐蔽空间。给地图贴上生物名字之后，还得问：这里有哪些资源？如果一种资源改变，能推断到哪一步？',
      en: 'A tūī needs foods such as nectar; a katipō needs shelter in dunes. After naming organisms on a map, ask what resources are available and how far an explanation can follow a change.',
    },
    minutes: 20,
    icon: '⌘',
    objectives: [
      {
        zh: '把六个本地样本与代表性森林/海岸资源相联系。',
        en: 'Connect six local samples with representative forest/coastal resources.',
      },
      {
        zh: '区分原生与特有，限定资源改变的推断。',
        en: 'Distinguish native and endemic, and limit inferences from resource change.',
      },
    ],
    prediction: [
      {
        zh: '栖息地只需写地名',
        en: 'A habitat only needs a place name',
      },
      {
        zh: '需要食物、空间与环境条件的联系',
        en: 'Connect food, space and environmental conditions',
      },
      {
        zh: '原生生物一定只存在新西兰',
        en: 'Every native organism occurs only in New Zealand',
      },
    ],
    terms: [
      {
        word: {
          zh: '栖息地',
          en: 'habitat',
        },
        meaning: {
          zh: '生物生活的地方及相关资源、条件。',
          en: 'A place and associated resources and conditions supporting life.',
        },
      },
      {
        word: {
          zh: '原生',
          en: 'native',
        },
        meaning: {
          zh: '在某地区自然出现，不是由人引入。',
          en: 'Naturally occurring in a region rather than introduced by people.',
        },
      },
      {
        word: {
          zh: '特有',
          en: 'endemic',
        },
        meaning: {
          zh: '自然分布限于某一地区。',
          en: 'Naturally restricted to a particular region.',
        },
      },
      {
        word: {
          zh: '引入',
          en: 'introduced',
        },
        meaning: {
          zh: '因人类活动被带到原分布外的地区。',
          en: 'Brought by people beyond its original range.',
        },
      },
      {
        word: {
          zh: '保护',
          en: 'conservation',
        },
        meaning: {
          zh: '依据证据维护生命及其所需环境。',
          en: 'Evidence-informed care for life and the environments it requires.',
        },
      },
    ],
    questions: [
      {
        id: 'L048-q1',
        skill: 'concept',
        prompt: {
          zh: '栖息地解释中，什么比只写“森林”更有用？',
          en: 'What is more useful than just writing “forest”?',
        },
        options: [
          {
            zh: '说明食物、隐蔽空间与水光等条件',
            en: 'Describe food, shelter and water/light conditions',
          },
          {
            zh: '只换成英文单词',
            en: 'Only translate the word',
          },
          {
            zh: '说所有森林资源都一样',
            en: 'Say every forest has identical resources',
          },
        ],
        correct: 0,
        feedback: {
          zh: '同一地名包含许多微环境，不同生物需求也不同。',
          en: 'One place name includes many microhabitats and organisms have different needs.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L048-q2',
        skill: 'concept',
        prompt: {
          zh: 'native与endemic怎样区别？',
          en: 'How do native and endemic differ?',
        },
        options: [
          {
            zh: '完全同义，必须背一个',
            en: 'Identical synonyms',
          },
          {
            zh: '原生是自然出现；特有还限定自然分布地区',
            en: 'Native means natural occurrence; endemic also restricts natural range',
          },
          {
            zh: '原生就是刚出生',
            en: 'Native means newly born',
          },
        ],
        correct: 1,
        feedback: {
          zh: '一个生物可在多个地区原生；不能把“新西兰原生”自动读成“仅新西兰有”。',
          en: 'An organism may be native in several regions; native to New Zealand does not automatically mean only found there.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L048-q3',
        skill: 'reasoning',
        prompt: {
          zh: '模型减少花蜜来源，能算出明年tūī一定少多少吗？',
          en: 'After reducing nectar sources in the model, can next year’s tūī decrease be calculated?',
        },
        options: [
          {
            zh: '能，图中一朵花就是一只鸟',
            en: 'Yes; one flower equals one bird',
          },
          {
            zh: '能，按钮生成真实调查',
            en: 'Yes; the button generates a survey',
          },
          {
            zh: '不能，还需其他食物、迁移、繁殖与实际数据',
            en: 'No; other foods, movement, reproduction and real data matter',
          },
        ],
        correct: 2,
        feedback: {
          zh: '资源线索支持一个可能影响环节，不是种群预测。图中动物保留，避免把按钮变成即时灭绝。',
          en: 'A resource clue supports a possible link, not a population forecast. Animals stay visible rather than turning a button into instant extinction.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
      {
        id: 'L048-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'endemic最接近哪句话？',
          en: 'Which best describes endemic?',
        },
        options: [
          {
            zh: '所有会移动的动物',
            en: 'Every moving animal',
          },
          {
            zh: '所有绿色植物',
            en: 'Every green plant',
          },
          {
            zh: '自然分布限于某地区',
            en: 'Natural distribution restricted to a region',
          },
        ],
        correct: 2,
        feedback: {
          zh: '地区范围必须说明；分类状态、分布与保护优先级也需要资料核对。',
          en: 'Specify the region; status, range and conservation priorities need reference checks.',
        },
        revisit: {
          zh: '回看原始线索，再检查解释的范围。',
          en: 'Revisit original clues and check the explanation’s scope.',
        },
      },
    ],
    mission: {
      zh: '用六样本检索表挑一个生物，解释一项栖息需求与一种可能的资源变化；写一句英文及一条未确认内容。',
      en: 'Choose a key sample, explain a habitat need and a possible resource change, then add an English sentence and one uncertainty.',
    },
    reference: {
      title: 'Concept reference · Life in Aotearoa New Zealand',
      url: 'https://www.doc.govt.nz/nature/',
    },
  },
];
