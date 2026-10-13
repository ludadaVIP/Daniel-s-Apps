import { q, t } from './schema';
export const leafRouteIds = ['water', 'carbon', 'light', 'sugar'] as const;
export type LeafRoute = (typeof leafRouteIds)[number];
export type RouteTag = 'unmarked' | 'matter' | 'energy' | 'both';
export type LeafDraft = {
  routes: Record<LeafRoute, { tag: RouteTag; note: string }>;
  zh: string;
  en: string;
  answers: Record<string, number>;
  savedAt?: number;
};
export const emptyLeafProject = (): LeafDraft => ({
  routes: {
    water: { tag: 'unmarked', note: '' },
    carbon: { tag: 'unmarked', note: '' },
    light: { tag: 'unmarked', note: '' },
    sugar: { tag: 'unmarked', note: '' },
  },
  zh: '',
  en: '',
  answers: {},
});
export const routeTags = {
  unmarked: t('待标注', 'Unmarked'),
  matter: t('物质', 'Matter'),
  energy: t('能量', 'Energy'),
  both: t('物质 + 储存化学能', 'Matter + stored chemical energy'),
};
export const leafRoutes = {
  water: {
    name: t('① 水的路线', '① Water route'),
    short: t('水', 'Water'),
    tag: 'matter' as RouteTag,
    lesson: 'L041',
    prompt: t(
      '水从哪里来？怎样到叶？叶中的水还有哪些去向？',
      'Where does water come from, how does it reach the leaf, and where can it go?',
    ),
    steps: [
      t(
        '土壤中的水是物质，水势条件决定净移动趋势。',
        'Soil water is matter; water-potential conditions determine its net movement tendency.',
      ),
      t(
        '合适条件下，水可穿过根的组织与细胞边界到木质部。',
        'Under suitable conditions, water crosses root tissues and cell boundaries to reach xylem.',
      ),
      t(
        '木质部连续水路连接根、茎与叶；蒸腾有助形成拉力。',
        'Continuous xylem water routes link root, stem and leaf; transpiration helps create tension.',
      ),
      t(
        '水到叶肉组织：少量参与光合作用，也支持细胞与运输。',
        'Water reaches mesophyll; some participates in photosynthesis and it also supports cells and transport.',
      ),
      t(
        '许多水从湿润表面蒸发到气隙，再经气孔以水蒸气离开。水不是变成光。',
        'Much water evaporates from moist surfaces into air spaces, then leaves through stomata as vapour. It does not turn into light.',
      ),
    ],
    example: t(
      '例：土壤→根→木质部→叶；蒸发后经气孔失水。',
      'Example: soil → root → xylem → leaf; after evaporation, water vapour leaves via stomata.',
    ),
    feedback: t(
      '水分子是物质；运输和变化过程需要能量，不让水本身成为“光能”。',
      'Water molecules are matter. Transport and changes involve energy, but water itself is not light energy.',
    ),
  },
  carbon: {
    name: t('② CO₂的路线', '② CO₂ route'),
    short: t('二氧化碳', 'Carbon dioxide'),
    tag: 'matter' as RouteTag,
    lesson: 'L034',
    prompt: t(
      '制糖中的碳从哪里来？经过哪道边界？',
      'Where does the carbon in sugar-making come from, and which boundary does it cross?',
    ),
    steps: [
      t(
        '空气中有CO₂，分子携带碳原子；本例给定向叶内净扩散的条件。',
        'Air contains CO₂ molecules carrying carbon atoms; this example assumes net diffusion into the leaf.',
      ),
      t(
        'CO₂经气孔进入叶片气隙；气孔不是糖的输送管。',
        'CO₂ enters leaf air spaces through stomata, which are not sugar-transport tubes.',
      ),
      t(
        'CO₂经过湿润表面和细胞边界，到达有叶绿体的叶肉细胞。',
        'CO₂ crosses moist surfaces and cellular boundaries to reach chloroplast-containing mesophyll cells.',
      ),
      t(
        '光合作用固定CO₂中的碳，形成有机物。光供应能量，不供应碳。',
        'Photosynthesis fixes CO₂ carbon into organic material. Light supplies energy, not carbon.',
      ),
      t(
        '糖中的碳可进入生长材料，也可经细胞呼吸返回CO₂；并非每个碳立刻返回。',
        'Sugar carbon can enter growth materials or return as CO₂ through respiration; not every carbon returns immediately.',
      ),
    ],
    example: t(
      '例：空气CO₂→气孔→叶肉/叶绿体→有机物的碳。',
      'Example: air CO₂ → stomata → mesophyll/chloroplasts → carbon in organic material.',
    ),
    feedback: t(
      'CO₂是物质。糖的碳来自CO₂，不来自阳光或矿质营养。',
      'CO₂ is matter. Sugar carbon comes from CO₂, not sunlight or minerals.',
    ),
  },
  light: {
    name: t('③ 光的作用', '③ Light’s role'),
    short: t('光', 'Light'),
    tag: 'energy' as RouteTag,
    lesson: 'L034',
    prompt: t(
      '光做什么？它是否提供糖里的碳原子？',
      'What does light do? Does it supply carbon atoms in sugar?',
    ),
    steps: [
      t(
        '合适的光到达绿色叶片，是能量输入。',
        'Suitable light reaches a green leaf as an energy input.',
      ),
      t(
        '叶肉细胞的叶绿体吸收部分光；不是所有照到的光都被利用。',
        'Mesophyll chloroplasts absorb some light; not all incident light is used.',
      ),
      t(
        '光驱动光合作用的过程；CO₂、水等条件也要满足。',
        'Light drives photosynthetic processes alongside requirements such as CO₂ and water.',
      ),
      t(
        '能量转化使有机物形成；图中不计算光强或制糖速率。',
        'Energy conversion supports organic-material formation; intensity and sugar-making rate are not calculated.',
      ),
      t(
        '能量储存在糖等有机物的化学体系中；细胞呼吸可把部分转移到ATP，也散出热。',
        'Energy is stored in the chemical system of sugars and other organic material; respiration transfers some to ATP and releases heat.',
      ),
    ],
    example: t(
      '例：光供能；CO₂供碳，二者作用不同。',
      'Example: light supplies energy; CO₂ supplies carbon. Their roles differ.',
    ),
    feedback: t(
      '这里的光箭头表示能量输入，不是水、CO₂或糖分子的移动。',
      'This light arrow represents energy input rather than moving water, CO₂ or sugar molecules.',
    ),
  },
  sugar: {
    name: t('④ 糖的路线', '④ Sugar route'),
    short: t('糖', 'Sugars'),
    tag: 'both' as RouteTag,
    lesson: 'L042',
    prompt: t(
      '糖是物质还是能量？哪里制造，哪里需要？',
      'Is sugar matter or energy? Where is it made and needed?',
    ),
    steps: [
      t(
        '本例假设成熟绿色叶片制造有机物，是糖的源。',
        'This example assumes a mature green leaf making organic material as a sugar source.',
      ),
      t(
        '光合作用产物可转成蔗糖等。糖分子是物质，并储存化学能。',
        'Photosynthetic products can form sucrose and other sugars. Sugar molecules are matter and store chemical energy.',
      ),
      t(
        '蔗糖等可进入韧皮部，连接糖的源与需要/储存糖的库。',
        'Sucrose can enter phloem linking sources with sinks that use or store sugars.',
      ),
      t(
        '本图画成熟叶→生长根，只是一个方向例子；储存根也能供新芽。',
        'The drawn mature-leaf → growing-root direction is one example; a storage root can also supply a bud.',
      ),
      t(
        '根可用糖作生长材料并进行细胞呼吸；根不需要叶绿体才能呼吸。',
        'Roots can use sugars as growth material and in cellular respiration; respiration does not require chloroplasts.',
      ),
    ],
    example: t(
      '例：成熟叶制糖→韧皮部→生长根；糖可供材料与呼吸。',
      'Example: mature leaf → phloem → growing root; sugars support materials and respiration.',
    ),
    feedback: t(
      '糖不是纯能量。它是可运输的物质，也储存化学能；化学能不是另一个沿管流动的分子。',
      'Sugar is not pure energy: it is transported matter storing chemical energy. Chemical energy is not a separate molecule flowing beside it.',
    ),
  },
};
const revisit = t(
  '沿图解再走一遍，区分来源、边界与去向。',
  'Trace the diagram again, separating source, boundary and destination.',
);
export const leafStageQuestions = [
  q(
    'S02-q1',
    'concept',
    t(
      '绿色叶肉与地下生长根，哪句话更合理？',
      'Which comparison of green mesophyll and a growing underground root is reasonable?',
    ),
    [
      t('只有绿色叶肉能进行细胞呼吸', 'Only green mesophyll can respire'),
      t(
        '叶肉可有叶绿体制糖；两者都能进行细胞呼吸',
        'Mesophyll can have chloroplasts to make sugars; both can respire',
      ),
      t(
        '根必须先长出叶绿体才可用糖',
        'Roots need chloroplasts before using sugar',
      ),
    ],
    1,
    t(
      '光合作用与细胞呼吸是不同过程。根可收到糖并呼吸，植物夜晚也呼吸。',
      'Photosynthesis and respiration differ. Roots can receive sugar and respire, and plants respire at night too.',
    ),
    revisit,
  ),
  q(
    'S02-q2',
    'reasoning',
    t(
      '把光标成“提供糖的碳”，怎样修正？',
      'How should “light supplies sugar carbon” be corrected?',
    ),
    [
      t(
        '光供能，CO₂供碳；两者不是同一种输入',
        'Light supplies energy and CO₂ supplies carbon; they are different inputs',
      ),
      t('把CO₂改成能量，其他不动', 'Relabel CO₂ as energy'),
      t('糖的碳来自土壤矿质营养', 'Sugar carbon comes from soil minerals'),
    ],
    0,
    t(
      '光箭头是能量输入，CO₂分子携带碳。物质守恒与能量转化要分别解释。',
      'The light arrow shows energy input; CO₂ carries carbon. Explain matter conservation and energy conversion separately.',
    ),
    revisit,
  ),
  q(
    'S02-q3',
    'concept',
    t(
      '叶中的水变成水蒸气离开，应怎样连图？',
      'How should leaf-water loss as vapour be drawn?',
    ),
    [
      t(
        '水→木质部→叶；到叶的水全部制糖，不会蒸发',
        'Water → xylem → leaf; all arriving water makes sugars, with no evaporation',
      ),
      t(
        '根→韧皮部→叶，液态水直接从气孔流出',
        'Root → phloem → leaf, with liquid water flowing directly out of stomata',
      ),
      t(
        '根→木质部→叶，湿表面蒸发→气隙→气孔→空气',
        'Root → xylem → leaf; moist-surface evaporation → air space → stomata → air',
      ),
    ],
    2,
    t(
      '液态水的长距离运输与水蒸气扩散是不同环节。蒸腾有助产生木质部拉力，不是根像心脏主动泵水。',
      'Long-distance liquid transport and vapour diffusion are different links. Transpiration helps xylem tension; roots are not a heart-like pump.',
    ),
    revisit,
  ),
  q(
    'S02-q4',
    'reasoning',
    t(
      '本图糖从叶到根，能说韧皮部永远向下吗？',
      'Sugar moves leaf → root here. Is phloem always downward?',
    ),
    [
      t(
        '是，因为糖永远由叶送往根',
        'Yes; sugars always move from leaves to roots',
      ),
      t(
        '不能；成熟叶→根是一个源库例子，储存根也可供芽',
        'No; mature leaf → root is one source/sink example, and storage roots can supply buds',
      ),
      t('不能，因为木质部才运输糖', 'No; xylem transports sugars'),
    ],
    1,
    t(
      '方向取决于源与库。本图选定生长根为库；不同组织的路线可不同，不表示同一管无限双向。',
      'Direction depends on sources and sinks. This drawing chooses a growing root sink; different pathways can differ without implying unlimited two-way flow in one tube.',
    ),
    revisit,
  ),
  q(
    'S02-q5',
    'reasoning',
    t(
      '叶中的有机物被动物吃下后，哪种追踪更合理？',
      'After an animal eats plant organic material, which trace is reasonable?',
    ),
    [
      t(
        '能量最终回到太阳，形成和碳一样的循环',
        'Energy returns to the sun in the same cycle as carbon',
      ),
      t(
        '植物糖中的碳一定全部立刻呼出',
        'All carbon in plant sugars is immediately exhaled',
      ),
      t(
        '食物经消化/吸收/运输供细胞；碳可返回CO₂，能量经活动与热继续转移',
        'Food is digested, absorbed and transported to cells; carbon can return as CO₂ while energy transfers through activity and heat',
      ),
    ],
    2,
    t(
      '联系叶片、身体合作系统与食物关系；并非所有碳立即呼出，能量流动也不等于碳循环。',
      'Connect the leaf, cooperating body systems and feeding relationships. Not all carbon is immediately exhaled, and energy flow differs from carbon cycling.',
    ),
    revisit,
  ),
];
export const leafQuestionLessons = ['L026', 'L034', 'L043', 'L042', 'L039'];
export function leafTextReady(d: LeafDraft) {
  return (
    leafRouteIds.every(
      (id) => d.routes[id].tag !== 'unmarked' && !!d.routes[id].note.trim(),
    ) &&
    !!d.zh.trim() &&
    !!d.en.trim()
  );
}
export function leafLabelCheck(d: LeafDraft) {
  return leafRouteIds.filter((id) => d.routes[id].tag === leafRoutes[id].tag)
    .length;
}
export function leafUnderstanding(d: LeafDraft) {
  return {
    answered: leafStageQuestions.filter((q) => d.answers[q.id] !== undefined)
      .length,
    correct: leafStageQuestions.filter((q) => d.answers[q.id] === q.correct)
      .length,
  };
}
export function decodeLeafProject(data: LeafDraft): LeafDraft {
  if (
    !data ||
    !data.routes ||
    typeof data.zh !== 'string' ||
    typeof data.en !== 'string' ||
    !data.answers ||
    typeof data.answers !== 'object'
  )
    throw new Error('Invalid leaf project');
  const d = emptyLeafProject();
  for (const id of leafRouteIds) {
    const r = data.routes[id];
    if (
      !r ||
      !['unmarked', 'matter', 'energy', 'both'].includes(r.tag) ||
      typeof r.note !== 'string'
    )
      throw new Error('Invalid leaf route');
    d.routes[id] = { tag: r.tag, note: r.note.slice(0, 600) };
  }
  d.zh = data.zh.slice(0, 1000);
  d.en = data.en.slice(0, 1000);
  for (const q of leafStageQuestions) {
    const a = data.answers[q.id];
    if (a === undefined) continue;
    if (!Number.isInteger(a) || a < 0 || a >= q.options.length)
      throw new Error('Invalid leaf answer');
    d.answers[q.id] = a;
  }
  if (Number.isFinite(data.savedAt) && data.savedAt! > 0 && leafTextReady(d))
    d.savedAt = data.savedAt;
  return d;
}
