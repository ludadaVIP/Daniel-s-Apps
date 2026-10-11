import type { Pair } from './kinematicsModels';
import { nf } from './newtonModels';
export const momentumKinds = [
  'quantity',
  'conservation',
  'collisions',
  'separation',
  'impulse',
  'restraints',
] as const;
export type MomentumKind = (typeof momentumKinds)[number];
export const momentumTitles: Record<MomentumKind, Pair> = {
  quantity: ['同速小车，动量相同吗？', 'Same speed, same momentum?'],
  conservation: [
    '画圈以后，总动量变了吗？',
    'Draw a boundary: did total momentum change?',
  ],
  collisions: [
    '弹开或黏住，哪一笔账相同？',
    'Bounce or stick: which ledger agrees?',
  ],
  separation: [
    '弹簧放开，为什么两车反向走？',
    'Release a spring: why do carts separate?',
  ],
  impulse: [
    '同样接住，怎样改变力的峰值？',
    'Same catch: how can force peaks differ?',
  ],
  restraints: [
    '延长停止时间，要多留多少距离？',
    'A longer stop needs how much space?',
  ],
};
export const momentumOptions: Record<MomentumKind, Pair[]> = {
  quantity: [
    ['1 kg · +2 m/s', '1 kg · +2 m/s'],
    ['2 kg · +2 m/s', '2 kg · +2 m/s'],
    ['1 kg · −2 m/s', '1 kg · −2 m/s'],
  ],
  conservation: [
    ['等质量 · 外力0', 'Equal masses · external 0'],
    ['B更重 · 外力0', 'Heavier B · external 0'],
    ['等质量 · 外力+2 N', 'Equal masses · external +2 N'],
  ],
  collisions: [
    ['完全弹性', 'Elastic'],
    ['部分回弹', 'Partial rebound'],
    ['黏住', 'Stick together'],
  ],
  separation: [
    ['等质量 · 初始静止', 'Equal masses · initially at rest'],
    ['B更重 · 初始静止', 'Heavier B · initially at rest'],
    ['等质量 · 整体向右', 'Equal masses · moving together'],
  ],
  impulse: [
    ['矩形 · 0.2 s', 'Rectangle · 0.2 s'],
    ['三角形 · 0.2 s', 'Triangle · 0.2 s'],
    ['三角形 · 0.8 s', 'Triangle · 0.8 s'],
  ],
  restraints: [
    ['短时停止 · 0.1 s', 'Short stop · 0.1 s'],
    ['延长 · 0.4 s', 'Longer · 0.4 s'],
    ['再延长 · 0.8 s', 'Longer again · 0.8 s'],
  ],
};
export const momentumNotes: Record<MomentumKind, Pair> = {
  quantity: [
    '水平向右为正；同一参考系，无水平合力。箭头表示动量，不是力。质量1或2 kg，位置范围为教学轨道。',
    'Horizontal rightward is positive in one reference frame; no horizontal net force. Arrows show momentum, not force. Teaching masses are 1 or 2 kg.',
  ],
  conservation: [
    '系统是A+B。低摩擦一维教学模型；接触从1 s开始持续0.6 s，用规定的平滑脉冲表示可变形连接器作用，不模拟真实车身形变。外力按质量比例分配，使相对运动保持相同。',
    'The system is A+B. A low-friction 1D teaching model: contact begins at 1 s for 0.6 s, with a prescribed smooth pulse representing a deformable connector, not realistic body deformation. External force is distributed in proportion to mass, keeping relative motion the same.',
  ],
  collisions: [
    '相同初态A=B=2 kg，uA=4、uB=0 m/s，外合力0。e是碰撞后分离速率/碰撞前接近速率。动能比较必须取接触前、接触后；接触中还可有储存的形变能。',
    'Same initial state: A=B=2 kg, uA=4, uB=0 m/s, zero external net force. e is final separation speed / initial approach speed. Compare kinetic energy before and after contact; deformation can store energy during contact.',
  ],
  separation: [
    '这里“爆炸模型”是内部储能释放的两车模型，用弹簧替代；不含火药、气体或碎片。内力脉冲持续1 s，两车所受冲量始终等大反向。自由改变传递冲量。',
    'Our explosion model uses two carts releasing stored internal energy, represented by a spring; no explosives, gas or fragments. The internal pulse lasts 1 s and delivers equal opposite impulses. Adjust the transferred impulse.',
  ],
  impulse: [
    '0.5 kg教学球从4 m/s停到0，净水平力采用规定矩形或三角形，不声称是真实手掌力曲线。停止后力归零、位置固定。改变持续时间，保持总冲量不变。',
    'A 0.5 kg teaching ball stops from 4 m/s under a prescribed rectangular or triangular horizontal net force, not a measured hand-force curve. Force becomes zero after stopping and position stays fixed. Change duration at fixed impulse.',
  ],
  restraints: [
    '1 kg、4 m/s教学滑块；净力为规定恒力，停止后归零。用来比较时间、距离和平均力，不是乘员或碰撞伤害模型，也不预测真实安全带/气囊力曲线。',
    'A 1 kg teaching slider at 4 m/s has prescribed constant net force until rest, then zero. This compares time, distance and mean force; it is not an occupant or injury model and does not predict real belt/airbag force curves.',
  ],
};
function bounded(n: number, low: number, high: number) {
  if (!Number.isFinite(n) || n < low || n > high)
    throw new RangeError('Outside momentum model domain');
  return n;
}
function selected(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 2)
    throw new RangeError('Invalid comparison');
  return n;
}
export const momentumLimits: Record<
  MomentumKind,
  { min: number; max: number; step: number; unit: string; label: Pair }
> = {
  quantity: {
    min: -4,
    max: 4,
    step: 0.5,
    unit: 'm/s',
    label: ['自由初速度', 'Free initial velocity'],
  },
  conservation: {
    min: 0,
    max: 4,
    step: 0.5,
    unit: 'N',
    label: ['自由外合力', 'Free external net force'],
  },
  collisions: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    label: ['自由回弹系数 e', 'Free restitution e'],
  },
  separation: {
    min: 0,
    max: 6,
    step: 0.5,
    unit: 'N·s',
    label: ['自由内部冲量大小', 'Free internal impulse magnitude'],
  },
  impulse: {
    min: 0.1,
    max: 1,
    step: 0.1,
    unit: 's',
    label: ['自由停止时长', 'Free stopping duration'],
  },
  restraints: {
    min: 0.1,
    max: 1,
    step: 0.1,
    unit: 's',
    label: ['自由停止时长', 'Free stopping duration'],
  },
};
export function momentumDefault(kind: MomentumKind, index: number) {
  selected(index);
  return {
    quantity: [2, 2, -2],
    conservation: [0, 0, 2],
    collisions: [1, 0.5, 0],
    separation: [4, 4, 4],
    impulse: [0.2, 0.2, 0.8],
    restraints: [0.1, 0.4, 0.8],
  }[kind][index]!;
}
export const momentumDuration = (kind: MomentumKind) =>
  kind === 'quantity'
    ? 2
    : kind === 'conservation' || kind === 'collisions'
      ? 3
      : kind === 'separation'
        ? 2
        : 1;
// Integral of cumulative impulse fraction. Both derivatives are used by the motion model.
export function pulse(shape: 'rectangle' | 'triangle' | 'cosine', s: number) {
  bounded(s, 0, 1);
  if (shape === 'rectangle')
    return { fraction: s, integral: (s * s) / 2, density: 1 };
  if (shape === 'cosine')
    return {
      fraction: (1 - Math.cos(Math.PI * s)) / 2,
      integral: s / 2 - Math.sin(Math.PI * s) / (2 * Math.PI),
      density: (Math.PI * Math.sin(Math.PI * s)) / 2,
    };
  return s <= 0.5
    ? { fraction: 2 * s * s, integral: (2 * s * s * s) / 3, density: 4 * s }
    : {
        fraction: 1 - 2 * (1 - s) ** 2,
        integral: s - 0.5 + (2 * (1 - s) ** 3) / 3,
        density: 4 * (1 - s),
      };
}
export type PairMotion = {
  mA: number;
  mB: number;
  xA: number;
  xB: number;
  vA: number;
  vB: number;
  pA: number;
  pB: number;
  total: number;
  initial: number;
  externalImpulse: number;
  internalImpulse: number;
  forceA: number;
  forceB: number;
  energy: number;
  initialEnergy: number;
  finalEnergy: number;
  phase: Pair;
};
export function collisionMotion(
  mB: number,
  e: number,
  external: number,
  t: number,
): PairMotion {
  bounded(mB, 2, 4);
  bounded(e, 0, 1);
  bounded(external, 0, 4);
  bounded(t, 0, 3);
  const mA = 2,
    M = mA + mB,
    g = 4,
    mu = (mA * mB) / M,
    uCenter = (mA * g) / M,
    contact = 1,
    duration = 0.6;
  const elapsed = Math.max(0, t - contact),
    s = Math.min(1, elapsed / duration),
    curve = pulse('cosine', s),
    J = -mu * (1 + e) * g;
  const delivered = J * curve.fraction,
    velocityDelta = delivered / mu;
  const relativeIntegral =
    g * t +
    (J / mu) * (duration * curve.integral + Math.max(0, elapsed - duration));
  const center0 = (mA * 3 + mB * 10) / M,
    center = center0 + uCenter * t + (external * t * t) / (2 * M),
    vCenter = uCenter + (external * t) / M;
  const separation = 7 - relativeIntegral,
    vRelative = g + velocityDelta;
  const xA = center - (mB / M) * separation,
    xB = center + (mA / M) * separation,
    vA = vCenter + (mB / M) * vRelative,
    vB = vCenter - (mA / M) * vRelative;
  const internal =
    elapsed > 0 && elapsed < duration ? (J * curve.density) / duration : 0;
  const energy = 0.5 * mA * vA * vA + 0.5 * mB * vB * vB,
    initialEnergy = 0.5 * mA * g * g;
  const finalCenter = uCenter + (external * 3) / M;
  return {
    mA,
    mB,
    xA,
    xB,
    vA,
    vB,
    pA: mA * vA,
    pB: mB * vB,
    total: mA * vA + mB * vB,
    initial: mA * g,
    externalImpulse: external * t,
    internalImpulse: delivered,
    forceA: internal + (external * mA) / M,
    forceB: -internal + (external * mB) / M,
    energy,
    initialEnergy,
    finalEnergy: 0.5 * M * finalCenter ** 2 + 0.5 * mu * (e * g) ** 2,
    phase:
      t < contact
        ? ['接触前', 'Before contact']
        : t < contact + duration
          ? ['接触中', 'During contact']
          : ['接触后', 'After contact'],
  };
}
export function separationMotion(
  mB: number,
  u: number,
  J: number,
  t: number,
): PairMotion {
  bounded(mB, 2, 4);
  bounded(u, 0, 1);
  bounded(J, 0, 6);
  bounded(t, 0, 2);
  const mA = 2,
    s = Math.min(t, 1),
    c = pulse('cosine', s),
    integrated = J * (c.integral + Math.max(0, t - 1)),
    delivered = J * c.fraction;
  const vA = u - delivered / mA,
    vB = u + delivered / mB,
    f = t < 1 ? J * c.density : 0,
    energy = 0.5 * mA * vA * vA + 0.5 * mB * vB * vB,
    initialEnergy = 0.5 * (mA + mB) * u * u;
  return {
    mA,
    mB,
    xA: 6 + u * t - integrated / mA,
    xB: 9 + u * t + integrated / mB,
    vA,
    vB,
    pA: mA * vA,
    pB: mB * vB,
    total: mA * vA + mB * vB,
    initial: (mA + mB) * u,
    externalImpulse: 0,
    internalImpulse: -delivered,
    forceA: -f,
    forceB: f,
    energy,
    initialEnergy,
    finalEnergy: initialEnergy + 0.5 * J * J * (1 / mA + 1 / mB),
    phase:
      t < 1
        ? ['内部能量释放中', 'Releasing internal energy']
        : ['释放后匀速', 'Coasting after release'],
  };
}
export function stoppingMotion(
  mass: number,
  duration: number,
  shape: 'rectangle' | 'triangle',
  t: number,
) {
  bounded(mass, 0.5, 1);
  bounded(duration, 0.1, 1);
  bounded(t, 0, 1);
  const u = 4,
    J = -mass * u,
    s = Math.min(1, t / duration),
    c = pulse(shape, s),
    velocity = u * (1 - c.fraction),
    position = u * Math.min(t, duration) + (J / mass) * duration * c.integral,
    force = t < duration ? (J / duration) * c.density : 0;
  return {
    mass,
    duration,
    velocity,
    position,
    force,
    impulse: J * c.fraction,
    initialMomentum: mass * u,
    momentum: mass * velocity,
    average: J / duration,
    peak: Math.abs(J / duration) * (shape === 'triangle' ? 2 : 1),
    distance: (u * duration) / 2,
    energy: 0.5 * mass * velocity ** 2,
    phase: (t < duration
      ? ['正在停止', 'Stopping']
      : ['已经停稳', 'At rest']) as Pair,
  };
}
export type MomentumReading = {
  time: number;
  duration: number;
  xA: number;
  xB: number;
  vA: number;
  vB: number;
  mA: number;
  mB: number;
  pA: number;
  pB: number;
  total: number;
  initial: number;
  externalImpulse: number;
  impulse: number;
  force: number;
  energy: number;
  initialEnergy: number;
  finalEnergy: number;
  average: number;
  peak: number;
  stopDistance: number;
  phase: Pair;
  pair: boolean;
};
export function momentumReading(
  kind: MomentumKind,
  index: number,
  value: number,
  progress: number,
): MomentumReading {
  selected(index);
  const lim = momentumLimits[kind];
  bounded(value, lim.min, lim.max);
  bounded(progress, 0, 1);
  const duration = momentumDuration(kind),
    time = progress * duration;
  if (kind === 'quantity') {
    const m = index === 1 ? 2 : 1,
      v = value;
    return {
      time,
      duration,
      xA: 10 + v * time,
      xB: 0,
      vA: v,
      vB: 0,
      mA: m,
      mB: 0,
      pA: m * v,
      pB: 0,
      total: m * v,
      initial: m * v,
      externalImpulse: 0,
      impulse: 0,
      force: 0,
      energy: 0.5 * m * v * v,
      initialEnergy: 0.5 * m * v * v,
      finalEnergy: 0.5 * m * v * v,
      average: 0,
      peak: 0,
      stopDistance: 0,
      phase: ['匀速运动', 'Constant velocity'],
      pair: false,
    };
  }
  if (['conservation', 'collisions', 'separation'].includes(kind)) {
    const m =
      kind === 'separation'
        ? separationMotion(
            index === 1 ? 4 : 2,
            index === 2 ? 1 : 0,
            value,
            time,
          )
        : collisionMotion(
            kind === 'conservation' && index === 1 ? 4 : 2,
            kind === 'collisions' ? value : 0,
            kind === 'conservation' ? value : 0,
            time,
          );
    return {
      ...m,
      time,
      duration,
      impulse: m.internalImpulse,
      force: m.forceA,
      average: 0,
      peak: 0,
      stopDistance: 0,
      pair: true,
    };
  }
  const m = stoppingMotion(
    kind === 'impulse' ? 0.5 : 1,
    value,
    kind === 'impulse' && index !== 0 ? 'triangle' : 'rectangle',
    time,
  );
  return {
    time,
    duration,
    xA: 3 + m.position,
    xB: 0,
    vA: m.velocity,
    vB: 0,
    mA: m.mass,
    mB: 0,
    pA: m.momentum,
    pB: 0,
    total: m.momentum,
    initial: m.initialMomentum,
    externalImpulse: m.impulse,
    impulse: m.impulse,
    force: m.force,
    energy: m.energy,
    initialEnergy: 0.5 * m.mass * 16,
    finalEnergy: 0,
    average: m.average,
    peak: m.peak,
    stopDistance: m.distance,
    phase: m.phase,
    pair: false,
  };
}
export function momentumRecord(kind: MomentumKind, index: number): Pair {
  const m = momentumReading(kind, index, momentumDefault(kind, index), 1);
  const terms = `pA=${nf(m.pA)}${m.pair ? `, pB=${nf(m.pB)}` : ''}; Σp=${nf(m.total)} kg·m/s; Jext=${nf(m.externalImpulse)} N·s`;
  const more = m.pair
    ? `vA=${nf(m.vA)}, vB=${nf(m.vB)} m/s; K=${nf(m.initialEnergy)}→${nf(m.energy)} J`
    : kind === 'quantity'
      ? `m=${nf(m.mA)} kg; v=${nf(m.vA)} m/s; K=${nf(m.energy)} J`
      : `J=${nf(m.impulse)} N·s; Favg=${nf(m.average)} N; |Fpeak|=${nf(m.peak)} N; dstop=${nf(m.stopDistance)} m`;
  return [`${terms}；${more}`, `${terms}; ${more}`];
}
