import {
  constantMotion,
  motionInterval,
  kinematicsCase,
  type Pair,
} from './kinematicsModels';
export type TrajectoryKind =
  | 'position'
  | 'velocity'
  | 'acceleration'
  | 'uniform'
  | 'equations'
  | 'fall'
  | 'projectile';
export const trajectoryKinds: TrajectoryKind[] = [
  'position',
  'velocity',
  'acceleration',
  'uniform',
  'equations',
  'fall',
  'projectile',
];
const range = (n: number, lo: number, hi: number) => {
  if (!Number.isFinite(n) || n < lo || n > hi)
    throw new RangeError('Outside model range');
  return n;
};
export const fmt = (n: number) => String(Number(n.toFixed(4)));
export const trajectoryTitles: Record<TrajectoryKind, Pair> = {
  position: ['曲线的高度与倾斜', 'Height and slope of a curve'],
  velocity: ['速度图下的两种面积账', 'Two area ledgers under a velocity graph'],
  acceleration: ['加速度图积累什么', 'What an acceleration graph accumulates'],
  uniform: ['每秒的速度增量', 'Velocity gains each second'],
  equations: ['先选条件，再选公式', 'Choose conditions before an equation'],
  fall: [
    '同高释放，改变质量或重力',
    'Same release height, different mass or gravity',
  ],
  projectile: ['水平飞行，竖直下落', 'Horizontal travel, vertical fall'],
};
export const trajectoryOptions: Record<TrajectoryKind, Pair[]> = {
  position: [
    ['0→4 s · 去程', '0→4 s · outward'],
    ['2→6 s · 跨转向', '2→6 s · across the turn'],
    ['4→8 s · 回程', '4→8 s · return'],
  ],
  velocity: [
    ['0→4 s · 正面积', '0→4 s · positive area'],
    ['4→8 s · 负面积', '4→8 s · negative area'],
    ['0→8 s · 两种面积', '0→8 s · both areas'],
  ],
  acceleration: [
    ['0→2 s · a=+1', '0→2 s · a=+1'],
    ['2→4 s · a=0', '2→4 s · a=0'],
    ['4→6 s · a=−1', '4→6 s · a=−1'],
  ],
  uniform: [
    ['a=+1 · 恒定', 'a=+1 · constant'],
    ['a=0 · 恒定', 'a=0 · constant'],
    ['a=t/2 · 改变', 'a=t/2 · changing'],
  ],
  equations: [
    ['u,a,t → v', 'u,a,t → v'],
    ['u,a,t → s', 'u,a,t → s'],
    ['u,v,a → s', 'u,v,a → s'],
  ],
  fall: [
    ['0.1 kg · g=10', '0.1 kg · g=10'],
    ['0.5 kg · g=10', '0.5 kg · g=10'],
    ['0.5 kg · g=1.6', '0.5 kg · g=1.6'],
  ],
  projectile: [
    ['水平0 m/s', 'Horizontal 0 m/s'],
    ['水平4 m/s', 'Horizontal 4 m/s'],
    ['水平8 m/s', 'Horizontal 8 m/s'],
  ],
};
export function trajectoryDefault(kind: TrajectoryKind, index: number) {
  kinematicsCase(index);
  return kind === 'fall'
    ? 20
    : kind === 'projectile'
      ? [0, 4, 8][index]!
      : kind === 'uniform' || kind === 'equations'
        ? 4
        : kind === 'acceleration'
          ? [2, 4, 6][index]!
          : kind === 'position'
            ? [4, 6, 8][index]!
            : [4, 8, 8][index]!;
}
export function trajectoryLimits(kind: TrajectoryKind, index: number) {
  kinematicsCase(index);
  if (kind === 'equations')
    return {
      min: 4,
      max: 4,
      step: 1,
      unit: 's',
      label: ['规定时间', 'Prescribed duration'] as Pair,
    };
  if (kind === 'fall')
    return {
      min: 5,
      max: 20,
      step: 1,
      unit: 'm',
      label: ['自由释放高度', 'Free release height'] as Pair,
    };
  if (kind === 'projectile')
    return {
      min: 0,
      max: 10,
      step: 1,
      unit: 'm/s',
      label: ['自由水平初速度', 'Free horizontal launch velocity'] as Pair,
    };
  const start =
    kind === 'position'
      ? [0, 2, 4][index]!
      : kind === 'velocity'
        ? [0, 4, 0][index]!
        : kind === 'acceleration'
          ? index * 2
          : 0;
  return {
    min: start + 0.5,
    max: kind === 'acceleration' ? start + 2 : kind === 'uniform' ? 4 : 8,
    step: 0.5,
    unit: 's',
    label: ['自由区间终点', 'Free interval endpoint'] as Pair,
  };
}
export function stagedMotion(t: number) {
  range(t, 0, 6);
  if (t < 2) return constantMotion(0, 1, 1, t);
  if (t < 4) return constantMotion(4, 3, 0, t - 2);
  return constantMotion(10, 3, -1, t - 4);
}
export function uniformMotion(index: number, t: number) {
  kinematicsCase(index);
  range(t, 0, 4);
  return index === 2
    ? {
        position: t + t ** 3 / 12,
        velocity: 1 + (t * t) / 4,
        acceleration: t / 2,
      }
    : constantMotion(0, 1, index === 0 ? 1 : 0, t);
}
export function fallFlight(
  height: number,
  g: number,
  horizontal: number,
  t: number,
) {
  range(height, 5, 20);
  range(g, 1.6, 10);
  range(horizontal, 0, 10);
  const duration = Math.sqrt((2 * height) / g);
  range(t, 0, duration + 1e-9);
  const time = Math.min(t, duration);
  return {
    time,
    duration,
    x: horizontal * time,
    y: 0.5 * g * time * time,
    vx: horizontal,
    vy: g * time,
    g,
    height,
  };
}
export function equationCase(index: number) {
  kinematicsCase(index);
  return index === 0
    ? {
        u: 2,
        a: 1,
        t: 4,
        v: 6,
        s: 16,
        equation: 0,
        answer: 6,
        unit: 'm/s',
        known: [
          '已知u=2 m/s、a=1 m/s²、t=4 s；求v。',
          'Known u=2 m/s, a=1 m/s², t=4 s; find v.',
        ] as Pair,
      }
    : index === 1
      ? {
          u: 6,
          a: -1,
          t: 4,
          v: 2,
          s: 16,
          equation: 1,
          answer: 16,
          unit: 'm',
          known: [
            '已知u=6 m/s、a=−1 m/s²、t=4 s；求s。',
            'Known u=6 m/s, a=−1 m/s², t=4 s; find s.',
          ] as Pair,
        }
      : {
          u: 2,
          a: 1,
          t: 4,
          v: 6,
          s: 16,
          equation: 2,
          answer: 16,
          unit: 'm',
          known: [
            '已知u=2 m/s、v=6 m/s、a=1 m/s²；未给t，求s。',
            'Known u=2 m/s, v=6 m/s, a=1 m/s²; t is not given; find s.',
          ] as Pair,
        };
}
export const equationChoices = ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as'];
export function checkEquation(index: number, equation: number, text: string) {
  const c = equationCase(index),
    value = Number(text);
  return (
    equation === c.equation &&
    text.trim() !== '' &&
    Number.isFinite(value) &&
    Math.abs(value - c.answer) <= 0.01
  );
}
export function trajectoryConfig(
  kind: TrajectoryKind,
  index: number,
  value: number,
) {
  kinematicsCase(index);
  const limits = trajectoryLimits(kind, index);
  range(value, limits.min, limits.max);
  const start =
    kind === 'position'
      ? [0, 2, 4][index]!
      : kind === 'velocity'
        ? [0, 4, 0][index]!
        : kind === 'acceleration'
          ? index * 2
          : 0;
  const g = kind === 'fall' && index === 2 ? 1.6 : 10,
    height = kind === 'fall' ? value : 20;
  return {
    start,
    end:
      kind === 'fall' || kind === 'projectile'
        ? Math.sqrt((2 * height) / g)
        : value,
    g,
    height,
    horizontal: kind === 'projectile' ? value : 0,
    mass: index === 0 ? 0.1 : 0.5,
  };
}
export function trajectoryMotion(
  kind: TrajectoryKind,
  index: number,
  t: number,
) {
  if (kind === 'acceleration') return stagedMotion(t);
  if (kind === 'uniform') return uniformMotion(index, t);
  if (kind === 'equations') {
    const c = equationCase(index);
    return constantMotion(0, c.u, c.a, t);
  }
  return constantMotion(3, 4, -1, t);
}
export function trajectoryReading(
  kind: TrajectoryKind,
  index: number,
  value: number,
  progress = 1,
) {
  range(progress, 0, 1);
  const c = trajectoryConfig(kind, index, value),
    time = c.start + (c.end - c.start) * progress;
  if (kind === 'fall' || kind === 'projectile') {
    const m = fallFlight(c.height, c.g, c.horizontal, time);
    return {
      config: c,
      time,
      position: m.y,
      velocity: m.vy,
      acceleration: c.g,
      displacement: m.y,
      distance: m.y,
      deltaV: m.vy,
      mean: time > 0 ? m.y / time : null,
      x: m.x,
      vx: m.vx,
      vy: m.vy,
    };
  }
  const first = trajectoryMotion(kind, index, c.start),
    last = trajectoryMotion(kind, index, time),
    displacement = last.position - first.position;
  const distance =
    kind === 'position' || kind === 'velocity'
      ? motionInterval(3, 4, -1, c.start, time).distance
      : Math.abs(displacement);
  return {
    config: c,
    time,
    ...last,
    displacement,
    distance,
    deltaV: last.velocity - first.velocity,
    mean: time > c.start ? displacement / (time - c.start) : null,
    x: last.position,
    vx: last.velocity,
    vy: 0,
  };
}
export function trajectoryRecord(kind: TrajectoryKind, index: number): Pair {
  const m = trajectoryReading(kind, index, trajectoryDefault(kind, index)),
    c = m.config,
    interval = `${fmt(c.start)}→${fmt(c.end)} s`;
  if (kind === 'position')
    return [
      `${interval}：Δx=${fmt(m.displacement)} m；割线斜率=${fmt(m.mean!)} m/s；末端切线斜率v=${fmt(m.velocity)} m/s。`,
      `${interval}: Δx=${fmt(m.displacement)} m; secant slope=${fmt(m.mean!)} m/s; endpoint tangent slope v=${fmt(m.velocity)} m/s.`,
    ];
  if (kind === 'velocity')
    return [
      `${interval}：带符号面积=${fmt(m.displacement)} m；绝对面积=${fmt(m.distance)} m；v末=${fmt(m.velocity)} m/s。`,
      `${interval}: signed area=${fmt(m.displacement)} m; absolute area=${fmt(m.distance)} m; final v=${fmt(m.velocity)} m/s.`,
    ];
  if (kind === 'acceleration')
    return [
      `${interval}：a图面积=${fmt(m.deltaV)} m/s；v末=${fmt(m.velocity)} m/s；位移=${fmt(m.displacement)} m。`,
      `${interval}: a-graph area=${fmt(m.deltaV)} m/s; final v=${fmt(m.velocity)} m/s; displacement=${fmt(m.displacement)} m.`,
    ];
  if (kind === 'uniform') {
    const gains = Array.from({ length: 4 }, (_, j) =>
      fmt(
        uniformMotion(index, j + 1).velocity - uniformMotion(index, j).velocity,
      ),
    ).join(' / ');
    return [
      `逐秒Δv：${gains} m/s；v(4 s)=${fmt(m.velocity)} m/s；${index === 2 ? '非匀加速' : '恒定加速度'}。`,
      `Per-second Δv: ${gains} m/s; v(4 s)=${fmt(m.velocity)} m/s; ${index === 2 ? 'nonuniform acceleration' : 'constant acceleration'}.`,
    ];
  }
  if (kind === 'equations') {
    const q = equationCase(index);
    return [
      `${equationChoices[q.equation]}；核对${q.answer} ${q.unit}；动画末端v=${fmt(m.velocity)} m/s、s=${fmt(m.displacement)} m。`,
      `${equationChoices[q.equation]}; checked ${q.answer} ${q.unit}; animated endpoint v=${fmt(m.velocity)} m/s, s=${fmt(m.displacement)} m.`,
    ];
  }
  return kind === 'fall'
    ? [
        `h=${c.height} m；质量${c.mass} kg；g=${c.g} m/s²；落地前t=${fmt(m.time)} s、v=${fmt(m.vy)} m/s。`,
        `h=${c.height} m; mass ${c.mass} kg; g=${c.g} m/s²; just before contact t=${fmt(m.time)} s, v=${fmt(m.vy)} m/s.`,
      ]
    : [
        `h=20 m；vₓ=${c.horizontal} m/s；t=${fmt(m.time)} s；水平射程=${fmt(m.x)} m；落地前vᵧ=${fmt(m.vy)} m/s。`,
        `h=20 m; vₓ=${c.horizontal} m/s; t=${fmt(m.time)} s; horizontal range=${fmt(m.x)} m; just before contact vᵧ=${fmt(m.vy)} m/s.`,
      ];
}
