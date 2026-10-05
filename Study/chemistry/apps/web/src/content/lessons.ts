import type { LocalizedText } from '@study/shared';
import { level2Lessons } from './level2';
import { level3Lessons } from './level3';
import { level4Lessons } from './level4';

export type LessonQuestion = {
  id: string;
  prompt: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
};

export type Lesson = {
  id: string;
  levelId: 'matter' | 'substances' | 'atoms' | 'table';
  order: number;
  title: LocalizedText;
  eyebrow: LocalizedText;
  hook: LocalizedText;
  hookHint: LocalizedText;
  bigIdea: LocalizedText;
  estimatedMinutes: number;
  everydayExamples: Array<{
    icon: string;
    title: LocalizedText;
    body: LocalizedText;
  }>;
  steps: Array<{ title: LocalizedText; body: LocalizedText }>;
  misconception: LocalizedText;
  mission: LocalizedText;
  vocabulary: Array<{ en: string; zh: string }>;
  questions: LessonQuestion[];
  interactive:
    | 'matter-sort'
    | 'particle-zoom'
    | 'state-lab'
    | 'phase-change-lab'
    | 'change-detective'
    | 'separation-lab'
    | 'element-gallery'
    | 'compound-builder'
    | 'particle-classifier'
    | 'atom-zoom'
    | 'proton-id'
    | 'neutron-mass'
    | 'electron-charge'
    | 'atomic-number-map'
    | 'mass-number-calc'
    | 'isotope-detective'
    | 'ion-transfer'
    | 'periodic-table-explorer'
    | 'group-family-match'
    | 'period-shell-viewer'
    | 'metal-property-lab'
    | 'nonmetal-evidence-sort';
};

export const lessons: Lesson[] = [
  {
    id: 'what-is-matter',
    levelId: 'matter',
    order: 1,
    title: { zh: '什么是物质？', en: 'What is matter?' },
    eyebrow: { zh: '第 1 课 · 从身边出发', en: 'Lesson 1 · Start nearby' },
    hook: {
      zh: '空气看不见，却能顶起降落伞。它到底算不算“东西”？',
      en: 'Air is invisible, yet it holds up a parachute. Does it count as “stuff”?',
    },
    hookHint: {
      zh: '先别急着找定义。捏住一个鼓起的气球：里面的空气占了空间，也让气球变重了一点。',
      en: 'Do not reach for a definition yet. Squeeze an inflated balloon: its air takes up space and makes it slightly heavier.',
    },
    bigIdea: {
      zh: '物质是有质量、并占据空间的东西。',
      en: 'Matter is anything that has mass and takes up space.',
    },
    estimatedMinutes: 12,
    everydayExamples: [
      {
        icon: '🥛',
        title: { zh: '牛奶', en: 'Milk' },
        body: {
          zh: '能称重，也会占满杯子。',
          en: 'It can be weighed and fills part of a cup.',
        },
      },
      {
        icon: '💨',
        title: { zh: '空气', en: 'Air' },
        body: {
          zh: '看不见，但能装进气球。',
          en: 'Invisible, but it can fill a balloon.',
        },
      },
      {
        icon: '🔦',
        title: { zh: '光', en: 'Light' },
        body: {
          zh: '传递能量，却不是物质。',
          en: 'It carries energy, but is not matter.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先问：它占空间吗？',
          en: 'First ask: does it take up space?',
        },
        body: {
          zh: '把石头放进水里，水面会上升；给气球吹气，气球会变大。固体和气体都在“占位置”。',
          en: 'Drop a stone into water and the level rises; blow into a balloon and it grows. Solids and gases both occupy room.',
        },
      },
      {
        title: { zh: '再问：它有质量吗？', en: 'Then ask: does it have mass?' },
        body: {
          zh: '质量不是“看起来有多大”。一个装满空气的篮球，会比放掉空气后略重。',
          en: 'Mass is not how large something looks. A fully inflated ball is slightly heavier than the same ball deflated.',
        },
      },
      {
        title: { zh: '两个条件要同时满足', en: 'Both clues belong together' },
        body: {
          zh: '声音、热和光可以影响物质，也可以传递能量，但它们本身不是由一团物质组成的。',
          en: 'Sound, heat and light can affect matter and transfer energy, but they are not themselves lumps of matter.',
        },
      },
    ],
    misconception: {
      zh: '“看不见”不等于“不存在”，也不等于“不是物质”。空气、氧气和水蒸气都是物质。',
      en: 'Invisible does not mean nonexistent—or non-matter. Air, oxygen and water vapour are all matter.',
    },
    mission: {
      zh: '厨房侦探：找出三种物质和一种不是物质的现象。对每个选择说出理由：它是否有质量、是否占空间？',
      en: 'Kitchen detective: find three examples of matter and one phenomenon that is not matter. Justify each using mass and space.',
    },
    vocabulary: [
      { en: 'matter', zh: '物质' },
      { en: 'mass', zh: '质量' },
      { en: 'occupy space', zh: '占据空间' },
    ],
    interactive: 'matter-sort',
    questions: [
      {
        id: 'matter-q1',
        prompt: { zh: '下列哪一项是物质？', en: 'Which one is matter?' },
        options: [
          { zh: '手电筒发出的光', en: 'Light from a torch' },
          { zh: '杯子里的空气', en: 'Air inside a cup' },
          { zh: '铃声', en: 'The sound of a bell' },
        ],
        answer: 1,
        explanation: {
          zh: '空气有质量并占据杯中的空间；光和声音是能量传递的方式。',
          en: 'Air has mass and occupies space; light and sound are ways energy travels.',
        },
      },
      {
        id: 'matter-q2',
        prompt: {
          zh: '怎样最有力地证明空气占据空间？',
          en: 'What best shows that air takes up space?',
        },
        options: [
          { zh: '看到天空是蓝色', en: 'Seeing a blue sky' },
          { zh: '给气球吹气，气球变大', en: 'A balloon expands when inflated' },
          { zh: '听到风声', en: 'Hearing the wind' },
        ],
        answer: 1,
        explanation: {
          zh: '进入气球的空气需要空间，因此把气球撑大。',
          en: 'The air entering the balloon needs room, so the balloon expands.',
        },
      },
      {
        id: 'matter-q3',
        prompt: {
          zh: '“看不见的东西都不是物质。”这句话为什么错？',
          en: 'Why is “invisible things are not matter” wrong?',
        },
        options: [
          {
            zh: '空气看不见，但有质量并占空间',
            en: 'Air is invisible but has mass and takes up space',
          },
          {
            zh: '任何看不见的东西都很轻',
            en: 'All invisible things are light',
          },
          { zh: '只有液体才是物质', en: 'Only liquids are matter' },
        ],
        answer: 0,
        explanation: {
          zh: '判断物质看的是质量和空间，不是肉眼能否看见。',
          en: 'Matter is identified by mass and space, not by whether our eyes can see it.',
        },
      },
    ],
  },
  {
    id: 'particles-everywhere',
    levelId: 'matter',
    order: 2,
    title: { zh: '一切由粒子构成', en: 'Everything is made of particles' },
    eyebrow: {
      zh: '第 2 课 · 放大看不见的世界',
      en: 'Lesson 2 · Zoom into the unseen',
    },
    hook: {
      zh: '一滴香水留在房间一角，为什么另一头的人也能闻到？',
      en: 'A drop of perfume stays in one corner. Why can someone across the room smell it?',
    },
    hookHint: {
      zh: '气味没有瞬间“传送”。组成香水的微小粒子在空气中不断运动、散开。',
      en: 'The smell does not teleport. Tiny perfume particles move and spread through the air.',
    },
    bigIdea: {
      zh: '所有物质都由极小、不断运动的粒子构成；粒子之间有空隙。',
      en: 'All matter is made of tiny moving particles with spaces between them.',
    },
    estimatedMinutes: 14,
    everydayExamples: [
      {
        icon: '🌸',
        title: { zh: '香味扩散', en: 'A scent spreads' },
        body: {
          zh: '气味粒子从拥挤处走向各处。',
          en: 'Scent particles spread away from a crowded region.',
        },
      },
      {
        icon: '🍬',
        title: { zh: '糖消失了？', en: 'Did sugar vanish?' },
        body: {
          zh: '糖粒子散入水中，仍然尝得到。',
          en: 'Sugar particles spread through water and can still be tasted.',
        },
      },
      {
        icon: '🎈',
        title: { zh: '空气可压缩', en: 'Air compresses' },
        body: {
          zh: '气体粒子之间有很大的空隙。',
          en: 'Gas particles have large gaps between them.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '粒子小到看不见', en: 'Particles are too small to see' },
        body: {
          zh: '一小滴水中也有数量惊人的水粒子。图中的小球是模型，不是粒子的真实颜色和大小。',
          en: 'Even a tiny drop holds an astonishing number of water particles. Diagram dots are models, not their real colour or size.',
        },
      },
      {
        title: { zh: '粒子一直在运动', en: 'Particles never stop moving' },
        body: {
          zh: '温度越高，粒子通常运动得越快。这就是热水里的颜色比冷水里扩散得更快的原因。',
          en: 'Particles usually move faster at higher temperatures. That is why colour spreads faster in warm water than cold water.',
        },
      },
      {
        title: { zh: '粒子之间有空隙', en: 'There is space between particles' },
        body: {
          zh: '用堵住出口的注射器推空气，体积会变小；空气粒子没有缩小，是它们之间的距离变小了。',
          en: 'Push trapped air in a syringe and its volume falls. The particles do not shrink; the gaps between them do.',
        },
      },
    ],
    misconception: {
      zh: '物质连续得像一整块，并不代表里面没有粒子和空隙。我们的眼睛分辨不了如此小的尺度。',
      en: 'Matter can look continuous even though it contains particles and gaps; our eyes cannot resolve that tiny scale.',
    },
    mission: {
      zh: '在一杯静止的水中轻放一滴食用色素，不要搅拌。每分钟观察一次，画下颜色边界的变化。',
      en: 'Place one drop of food colouring in still water without stirring. Sketch how the colour boundary changes each minute.',
    },
    vocabulary: [
      { en: 'particle', zh: '粒子' },
      { en: 'diffusion', zh: '扩散' },
      { en: 'particle model', zh: '粒子模型' },
    ],
    interactive: 'particle-zoom',
    questions: [
      {
        id: 'particle-q1',
        prompt: {
          zh: '糖溶解在水中后，糖粒子怎样了？',
          en: 'What happens to sugar particles when sugar dissolves?',
        },
        options: [
          { zh: '消失了', en: 'They disappear' },
          {
            zh: '均匀散入水粒子之间',
            en: 'They spread among the water particles',
          },
          { zh: '变成了水粒子', en: 'They turn into water particles' },
        ],
        answer: 1,
        explanation: {
          zh: '糖粒子仍存在，只是分散到肉眼看不见。',
          en: 'The sugar particles remain, but spread too widely to see.',
        },
      },
      {
        id: 'particle-q2',
        prompt: {
          zh: '密封注射器里的空气被压缩时，什么变小了？',
          en: 'When trapped air is compressed, what becomes smaller?',
        },
        options: [
          { zh: '每个空气粒子', en: 'Each air particle' },
          { zh: '粒子之间的距离', en: 'The distances between particles' },
          { zh: '粒子的数量', en: 'The number of particles' },
        ],
        answer: 1,
        explanation: {
          zh: '粒子大小和数量不变，空隙变小。',
          en: 'Particle size and number stay the same; the gaps shrink.',
        },
      },
      {
        id: 'particle-q3',
        prompt: {
          zh: '为什么温暖房间里的香味通常扩散更快？',
          en: 'Why does scent usually spread faster in a warm room?',
        },
        options: [
          { zh: '粒子运动更快', en: 'Particles move faster' },
          { zh: '粒子变得更大', en: 'Particles become larger' },
          { zh: '空气不再是物质', en: 'Air stops being matter' },
        ],
        answer: 0,
        explanation: {
          zh: '较高温度意味着粒子平均运动得更快。',
          en: 'A higher temperature means faster particle motion on average.',
        },
      },
    ],
  },
  {
    id: 'states-of-matter',
    levelId: 'matter',
    order: 3,
    title: { zh: '固体、液体和气体', en: 'Solids, liquids and gases' },
    eyebrow: {
      zh: '第 3 课 · 同一种水的三副面孔',
      en: 'Lesson 3 · Three faces of water',
    },
    hook: {
      zh: '冰、水和水蒸气明明是同一种物质，为什么行为完全不同？',
      en: 'Ice, water and water vapour are the same substance—so why do they behave so differently?',
    },
    hookHint: {
      zh: '关键不在粒子“换了身份”，而在粒子的排列、距离和运动方式改变了。',
      en: 'The particles do not change identity. Their arrangement, spacing and movement change.',
    },
    bigIdea: {
      zh: '物态取决于粒子怎样排列和运动，不是由粒子的形状决定。',
      en: 'A state of matter depends on how particles are arranged and move—not on particle shape.',
    },
    estimatedMinutes: 15,
    everydayExamples: [
      {
        icon: '🧊',
        title: { zh: '冰块', en: 'Ice cube' },
        body: { zh: '形状和体积都固定。', en: 'Fixed shape and fixed volume.' },
      },
      {
        icon: '💧',
        title: { zh: '一杯水', en: 'A glass of water' },
        body: {
          zh: '体积固定，形状随容器。',
          en: 'Fixed volume, container-shaped.',
        },
      },
      {
        icon: '☁️',
        title: { zh: '水蒸气', en: 'Water vapour' },
        body: {
          zh: '会扩散并充满可用空间。',
          en: 'Spreads to fill available space.',
        },
      },
    ],
    steps: [
      {
        title: { zh: '固体：原地振动', en: 'Solid: vibrating in place' },
        body: {
          zh: '粒子紧密、有规则地排列，彼此吸引较强，只能在固定位置附近振动。',
          en: 'Particles are closely, regularly packed and strongly attracted, so they vibrate around fixed positions.',
        },
      },
      {
        title: {
          zh: '液体：贴近但能换位',
          en: 'Liquid: close but able to swap',
        },
        body: {
          zh: '粒子仍然靠近，却能互相滑过，所以液体能流动并改变形状。',
          en: 'Particles stay close but slide past one another, allowing liquids to flow and change shape.',
        },
      },
      {
        title: {
          zh: '气体：相隔很远、自由飞行',
          en: 'Gas: far apart and free-moving',
        },
        body: {
          zh: '粒子快速、随机地运动，碰到容器壁后改变方向，因此气体会充满整个容器。',
          en: 'Particles move rapidly and randomly, bouncing off walls, so a gas fills its container.',
        },
      },
    ],
    misconception: {
      zh: '气体粒子本身不会膨胀到填满房间；是大量微小粒子分散开，占据了更大的总体空间。',
      en: 'Gas particles do not swell to fill a room; many tiny particles spread out across a larger total space.',
    },
    mission: {
      zh: '把同样体积的水倒进高杯和宽碗。记录“变了什么、没变什么”，再用粒子模型解释。',
      en: 'Pour the same water into a tall glass and a wide bowl. Record what changes and what stays, then explain with particles.',
    },
    vocabulary: [
      { en: 'solid', zh: '固体' },
      { en: 'liquid', zh: '液体' },
      { en: 'gas', zh: '气体' },
    ],
    interactive: 'state-lab',
    questions: [
      {
        id: 'state-q1',
        prompt: { zh: '液体为什么能流动？', en: 'Why can a liquid flow?' },
        options: [
          {
            zh: '粒子可以互相滑过',
            en: 'Its particles can slide past one another',
          },
          { zh: '它没有粒子', en: 'It has no particles' },
          { zh: '粒子都固定不动', en: 'Its particles are fixed' },
        ],
        answer: 0,
        explanation: {
          zh: '液体粒子彼此靠近，却没有固定位置。',
          en: 'Liquid particles stay close but are not locked into fixed positions.',
        },
      },
      {
        id: 'state-q2',
        prompt: {
          zh: '哪一种物态最容易压缩？',
          en: 'Which state is easiest to compress?',
        },
        options: [
          { zh: '固体', en: 'Solid' },
          { zh: '液体', en: 'Liquid' },
          { zh: '气体', en: 'Gas' },
        ],
        answer: 2,
        explanation: {
          zh: '气体粒子之间有很大的空隙可被压小。',
          en: 'Gas particles have large gaps that can be reduced.',
        },
      },
      {
        id: 'state-q3',
        prompt: {
          zh: '冰融化成水时，水粒子发生了什么？',
          en: 'When ice melts, what happens to its water particles?',
        },
        options: [
          { zh: '变成另一种粒子', en: 'They become a different particle' },
          {
            zh: '获得运动能力，排列不再固定',
            en: 'They move more and lose the fixed arrangement',
          },
          { zh: '完全消失', en: 'They disappear' },
        ],
        answer: 1,
        explanation: {
          zh: '粒子身份不变，改变的是运动和排列。',
          en: 'Particle identity stays the same; movement and arrangement change.',
        },
      },
    ],
  },
  {
    id: 'changes-of-state',
    levelId: 'matter',
    order: 4,
    title: { zh: '状态变化', en: 'Changes of state' },
    eyebrow: {
      zh: '第 4 课 · 水没有消失',
      en: 'Lesson 4 · The water did not vanish',
    },
    hook: {
      zh: '湿衣服没有达到 100°C，为什么挂一下午还是会干？',
      en: 'Wet clothes never reach 100°C, so why do they still dry?',
    },
    hookHint: {
      zh: '液面上总有少数跑得特别快的水粒子。只要它们挣脱周围粒子的吸引，就能进入空气。',
      en: 'A few water particles at the surface are always unusually fast. If they escape their neighbours’ attraction, they enter the air.',
    },
    bigIdea: {
      zh: '状态变化时，粒子身份不变；能量改变的是粒子的运动、距离和排列。',
      en: 'During a change of state, particle identity stays the same; energy changes their motion, spacing and arrangement.',
    },
    estimatedMinutes: 16,
    everydayExamples: [
      {
        icon: '👕',
        title: { zh: '衣服晾干', en: 'Laundry dries' },
        body: {
          zh: '液面粒子逃入空气，这是蒸发。',
          en: 'Surface particles escape into the air: evaporation.',
        },
      },
      {
        icon: '🪞',
        title: { zh: '镜子起雾', en: 'A misty mirror' },
        body: {
          zh: '水蒸气遇冷变成小水滴。',
          en: 'Water vapour cools into tiny liquid drops.',
        },
      },
      {
        icon: '🧊',
        title: { zh: '冰饮冒“白气”', en: 'Mist by an iced drink' },
        body: {
          zh: '白雾不是水蒸气，而是空气中凝结的小水滴。',
          en: 'The mist is condensed droplets, not invisible water vapour.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '加热：先让粒子动得更快',
          en: 'Heating: first, particles move faster',
        },
        body: {
          zh: '固体吸收能量后，粒子振动越来越强。到熔点，继续加入的能量主要用来松开粒子间的束缚，所以熔化过程中温度可以暂时不变。',
          en: 'As a solid absorbs energy, its particles vibrate more. At the melting point, added energy mainly loosens attractions, so temperature can pause while melting occurs.',
        },
      },
      {
        title: {
          zh: '蒸发和沸腾不是一回事',
          en: 'Evaporation and boiling differ',
        },
        body: {
          zh: '蒸发只发生在液面，任何温度都能进行；沸腾发生在整个液体中，达到沸点时会形成气泡。风大、表面积大、温度高都会加快蒸发。',
          en: 'Evaporation happens only at the surface and at any temperature. Boiling happens throughout a liquid at its boiling point, forming bubbles. Wind, area and warmth speed evaporation.',
        },
      },
      {
        title: {
          zh: '冷却：粒子慢下来、重新靠近',
          en: 'Cooling: particles slow and gather',
        },
        body: {
          zh: '气体粒子失去能量后凝结成液体；液体继续失去能量会凝固。粒子没有“变成冷粒子”，仍是原来的物质。',
          en: 'Gas particles lose energy and condense; a liquid losing more energy freezes. They do not become “cold particles”—they remain the same substance.',
        },
      },
    ],
    misconception: {
      zh: '液体不必沸腾才会变成气体。水洼在普通气温下变干，就是表面粒子持续蒸发；真正的水蒸气是看不见的。',
      en: 'A liquid need not boil to become gas. A puddle dries at ordinary temperatures by surface evaporation, and water vapour itself is invisible.',
    },
    mission: {
      zh: '用两张同样大小的湿纸巾做比赛：一张摊开，一张折叠。每 10 分钟摸一摸或称一称，解释哪张先干以及为什么。',
      en: 'Race two equally wet paper towels: spread one out and fold the other. Check every ten minutes and explain which dries first and why.',
    },
    vocabulary: [
      { en: 'evaporation', zh: '蒸发' },
      { en: 'boiling', zh: '沸腾' },
      { en: 'condensation', zh: '凝结' },
      { en: 'melting / freezing', zh: '熔化 / 凝固' },
    ],
    interactive: 'phase-change-lab',
    questions: [
      {
        id: 'phase-q1',
        prompt: {
          zh: '水在 25°C 也能慢慢减少，最合理的解释是什么？',
          en: 'Water slowly disappears at 25°C. What is the best explanation?',
        },
        options: [
          {
            zh: '表面较快的粒子逃入空气',
            en: 'Faster surface particles escape into the air',
          },
          { zh: '水偷偷沸腾了', en: 'The water secretly boiled' },
          { zh: '水粒子被消灭了', en: 'Water particles were destroyed' },
        ],
        answer: 0,
        explanation: {
          zh: '蒸发可在任何温度发生，只需要液面粒子有足够能量挣脱吸引。',
          en: 'Evaporation can happen at any temperature when surface particles have enough energy to escape attractions.',
        },
      },
      {
        id: 'phase-q2',
        prompt: {
          zh: '纯冰在熔化过程中继续吸热，温度为什么可能保持在 0°C？',
          en: 'Why can pure melting ice stay at 0°C while absorbing energy?',
        },
        options: [
          {
            zh: '能量主要用来克服粒子间吸引',
            en: 'Energy mainly overcomes attractions between particles',
          },
          { zh: '冰停止吸收能量', en: 'The ice stops absorbing energy' },
          { zh: '温度计坏了', en: 'The thermometer is broken' },
        ],
        answer: 0,
        explanation: {
          zh: '相变平台不是“没有能量进入”，而是能量先改变粒子排列。',
          en: 'A phase-change plateau does not mean no energy enters; the energy first changes particle arrangement.',
        },
      },
      {
        id: 'phase-q3',
        prompt: {
          zh: '浴室镜子上的小水滴主要来自哪里？',
          en: 'Where do droplets on a bathroom mirror mainly come from?',
        },
        options: [
          { zh: '镜子内部渗出来', en: 'They seep from inside the mirror' },
          {
            zh: '空气中的水蒸气遇冷凝结',
            en: 'Water vapour in the air cools and condenses',
          },
          { zh: '镜子制造了水', en: 'The mirror makes water' },
        ],
        answer: 1,
        explanation: {
          zh: '温暖潮湿的空气接触较冷镜面，水粒子失去能量并聚成液滴。',
          en: 'Warm humid air meets the cooler mirror; water particles lose energy and gather into droplets.',
        },
      },
    ],
  },
  {
    id: 'physical-vs-chemical-change',
    levelId: 'matter',
    order: 5,
    title: {
      zh: '物理变化与化学变化',
      en: 'Physical vs chemical change',
    },
    eyebrow: {
      zh: '第 5 课 · 当物质真的换了身份',
      en: 'Lesson 5 · When matter changes identity',
    },
    hook: {
      zh: '巧克力融化后还能凝固，面包烤焦后却回不去——真正的区别在哪里？',
      en: 'Melted chocolate can solidify again, but burnt toast cannot go back. What is the real difference?',
    },
    hookHint: {
      zh: '不要只看“能不能恢复”。更可靠的问题是：变化前后的粒子还是同一种物质吗？',
      en: 'Do not rely only on reversibility. Ask a stronger question: are the particles still the same substances afterward?',
    },
    bigIdea: {
      zh: '物理变化重新安排原有粒子；化学变化把原子重新组合，产生新物质。',
      en: 'A physical change rearranges existing particles; a chemical change rearranges atoms into new substances.',
    },
    estimatedMinutes: 17,
    everydayExamples: [
      {
        icon: '🍫',
        title: { zh: '巧克力融化', en: 'Chocolate melts' },
        body: {
          zh: '状态改变，主要成分身份仍在。',
          en: 'State changes; the substances keep their identities.',
        },
      },
      {
        icon: '🔩',
        title: { zh: '铁钉生锈', en: 'An iron nail rusts' },
        body: {
          zh: '铁与氧等反应，生成了铁锈。',
          en: 'Iron reacts with oxygen and more to form rust.',
        },
      },
      {
        icon: '🧂',
        title: { zh: '盐溶于水', en: 'Salt dissolves' },
        body: {
          zh: '盐粒子分散开，蒸发水后仍可取回盐。',
          en: 'Salt particles spread out and can be recovered by evaporating water.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先追踪物质身份',
          en: 'Track the identity first',
        },
        body: {
          zh: '冰融化时，固态水粒子变成能滑动的液态水粒子，仍然是 H₂O。木材燃烧时，原子重新组合成二氧化碳、水等新物质。',
          en: 'When ice melts, solid water particles become mobile liquid water particles—still H₂O. When wood burns, atoms recombine into carbon dioxide, water and other new substances.',
        },
      },
      {
        title: {
          zh: '像侦探一样搜集多条证据',
          en: 'Collect several clues like a detective',
        },
        body: {
          zh: '持续的颜色或气味改变、放热或吸热、发光、产生气体或沉淀，都可能提示新物质形成。但单独一条现象通常不能定案。',
          en: 'Lasting colour or odour change, heat transfer, light, gas or a precipitate can suggest new substances. One clue alone rarely proves the case.',
        },
      },
      {
        title: {
          zh: '“不可逆”只是线索，不是定义',
          en: 'Irreversible is a clue, not the definition',
        },
        body: {
          zh: '剪碎纸张很难复原，却没有生成新物质；有些化学反应在合适条件下又能逆转。判断核心始终是有没有新物质。',
          en: 'Cut paper is hard to restore but no new substance forms; some chemical reactions can reverse under suitable conditions. New substances are the key.',
        },
      },
    ],
    misconception: {
      zh: '看到气泡不一定就是化学变化：水沸腾也有气泡，那是水蒸气。必须结合原料、产物和其他证据判断。',
      en: 'Bubbles do not automatically mean chemical change. Boiling water bubbles contain water vapour. Judge using reactants, products and multiple clues.',
    },
    mission: {
      zh: '观察做饭过程中的三个变化，例如切菜、融化黄油、煎鸡蛋。为每个变化写下“物质身份是否改变”的证据。',
      en: 'Observe three cooking changes—perhaps chopping, melting butter and frying an egg. Record evidence for whether substance identity changed.',
    },
    vocabulary: [
      { en: 'physical change', zh: '物理变化' },
      { en: 'chemical change', zh: '化学变化' },
      { en: 'evidence', zh: '证据' },
      { en: 'new substance', zh: '新物质' },
    ],
    interactive: 'change-detective',
    questions: [
      {
        id: 'change-q1',
        prompt: {
          zh: '下列哪项最能定义化学变化？',
          en: 'Which statement best defines a chemical change?',
        },
        options: [
          { zh: '外形发生改变', en: 'Shape changes' },
          { zh: '产生一种或多种新物质', en: 'One or more new substances form' },
          { zh: '变化很难逆转', en: 'The change is hard to reverse' },
        ],
        answer: 1,
        explanation: {
          zh: '化学变化的核心是原子重新组合、物质身份改变。',
          en: 'The defining feature is atoms rearranging so substance identities change.',
        },
      },
      {
        id: 'change-q2',
        prompt: {
          zh: '把粉笔压成粉末属于哪类变化？',
          en: 'What kind of change is crushing chalk into powder?',
        },
        options: [
          { zh: '物理变化', en: 'Physical change' },
          { zh: '化学变化', en: 'Chemical change' },
          {
            zh: '无法判断，因为不能复原',
            en: 'Impossible to tell because it cannot be restored',
          },
        ],
        answer: 0,
        explanation: {
          zh: '颗粒变小但物质身份未变；难以恢复原状并不能把它变成化学变化。',
          en: 'The pieces get smaller but identity remains; difficulty reversing it does not make it chemical.',
        },
      },
      {
        id: 'change-q3',
        prompt: {
          zh: '哪组现象最有力地支持发生了化学变化？',
          en: 'Which observation most strongly supports a chemical change?',
        },
        options: [
          {
            zh: '冰块变小并出现水',
            en: 'An ice cube shrinks and water appears',
          },
          { zh: '物体被切成两半', en: 'An object is cut in half' },
          {
            zh: '混合后持续放热并产生一种无法由沸腾解释的气体',
            en: 'Mixing releases heat and forms a gas not explained by boiling',
          },
        ],
        answer: 2,
        explanation: {
          zh: '多条相互支持的证据，比单一外观变化更能说明生成了新物质。',
          en: 'Multiple supporting clues are stronger evidence of new substances than one appearance change.',
        },
      },
    ],
  },
  ...level2Lessons,
  ...level3Lessons,
  ...level4Lessons,
];

export function getLesson(id: string | undefined) {
  return lessons.find((lesson) => lesson.id === id);
}
