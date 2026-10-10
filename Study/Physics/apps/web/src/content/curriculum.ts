import { t } from './schema';
export const units = {
  kinematics: t(
    '运动学：追踪位置、方向与变化',
    'Kinematics: follow position, direction and change',
  ),
  algebra: t(
    '物理中的代数：把规律变成工具',
    'Algebra for physics: turn patterns into tools',
  ),
  graphs: t('图像：把线读成物理故事', 'Graphs: read lines as physical stories'),
  vectors: t('向量：给物理量一个方向', 'Vectors: give quantities a direction'),
  solving: t(
    '八步解题：让答案有依据',
    'Eight-step reasoning: support your answers',
  ),
  curiosity: t('从好奇开始', 'Start with curiosity'),
  measurement: t(
    '测量，把感觉变成证据',
    'Measurement: from feelings to evidence',
  ),
  patterns: t('数据里藏着规律', 'Find patterns in data'),
  mysteries: t('解开生活的小谜题', 'Everyday physics mysteries'),
  motion: t('运动：位置、方向与快慢', 'Motion: position, direction and speed'),
  forces: t(
    '力：推拉、平衡与阻力',
    'Forces: interactions, balance and resistance',
  ),
  gravity: t('质量、重量与重力', 'Mass, weight & gravity'),
  density: t('密度与材料线索', 'Density & material clues'),
  energy: t(
    '能量：储备、转移与去向',
    'Energy: stores, transfers and destinations',
  ),
  work: t(
    '功与功率：改变多少，改变多快',
    'Work & power: how much, how quickly',
  ),
  thermal: t(
    '温度与热：追踪能量传递',
    'Temperature & heat: follow energy transfers',
  ),
  sound: t('声音：从振动到回波', 'Sound: from vibration to echoes'),
  light: t('光：沿光路寻找答案', 'Light: follow rays to answers'),
  pressure: t('压强：力分散到哪里？', 'Pressure: where is the force spread?'),
  buoyancy: t(
    '浮力：水和空气怎样托起物体？',
    'Buoyancy: how do water and air support objects?',
  ),
  machines: t(
    '简单机械：用距离交换力',
    'Simple machines: trade distance for force',
  ),
  electricity: t(
    '电学：电荷、能量与回路',
    'Electricity: charge, energy and circuits',
  ),
  magnetism: t(
    '磁学：方向、控制与能量',
    'Magnetism: direction, control and energy',
  ),
  space: t(
    '地球与宇宙：换视角，换尺度',
    'Earth & space: viewpoints and scales',
  ),
};
export const stages = [
  {
    title: t('物理启蒙', 'Physics foundations'),
    age: '10+',
    topics: t(
      '观察 · 提问 · 测量 · 生活中的物理',
      'Observe · Question · Measure · Everyday physics',
    ),
  },
  {
    title: t('初中物理 I', 'Junior physics I'),
    age: '10–12',
    topics: t(
      '测量 · 运动 · 力 · 重力 · 密度',
      'Measurement · Motion · Force · Gravity · Density',
    ),
  },
  {
    title: t('初中物理 II', 'Junior physics II'),
    age: '11–13',
    topics: t('能量 · 热 · 声音 · 光', 'Energy · Heat · Sound · Light'),
  },
  {
    title: t('初中物理 III', 'Junior physics III'),
    age: '12–14',
    topics: t(
      '压强 · 浮力 · 机械 · 电路 · 磁 · 宇宙',
      'Pressure · Buoyancy · Machines · Circuits · Magnetism · Space',
    ),
  },
  {
    title: t('高中桥梁', 'Physics bridge'),
    age: '13–15',
    topics: t(
      '图像 · 代数 · 向量 · 建模',
      'Graphs · Algebra · Vectors · Models',
    ),
  },
  {
    title: t('高中力学', 'High school mechanics'),
    age: '14+',
    topics: t(
      '运动学 · 牛顿定律 · 动量 · 引力',
      'Kinematics · Newton’s laws · Momentum · Gravitation',
    ),
  },
  {
    title: t('波动与热学', 'Waves & thermal physics'),
    age: '14+',
    topics: t('波 · 光学 · 热力学', 'Waves · Optics · Thermodynamics'),
  },
  {
    title: t('电磁学', 'Electricity & magnetism'),
    age: '15+',
    topics: t(
      '电场 · 电路 · 磁场 · 电磁感应',
      'Fields · Circuits · Magnetism · Induction',
    ),
  },
  {
    title: t('现代物理', 'Modern physics'),
    age: '15+',
    topics: t(
      '原子 · 量子 · 核 · 相对论入门',
      'Atoms · Quantum ideas · Nuclei · Relativity',
    ),
  },
];
