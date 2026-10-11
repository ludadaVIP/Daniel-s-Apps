import { constantMotion, kinematicsCase, type Pair } from './kinematicsModels';
export type NewtonKind =
  'inertia' | 'net' | 'force' | 'mass' | 'diagram' | 'pairs';
export const newtonKinds: NewtonKind[] = [
  'inertia',
  'net',
  'force',
  'mass',
  'diagram',
  'pairs',
];
const range = (n: number, lo: number, hi: number) => {
  if (!Number.isFinite(n) || n < lo || n > hi)
    throw new RangeError('Outside Newton model');
  return n;
};
export const nf = (n: number) => String(Number(n.toFixed(4)));
export const newtonTitles: Record<NewtonKind, Pair> = {
  inertia: [
    '没有合力，还会继续走吗',
    'Will motion continue with zero net force?',
  ],
  net: ['同一辆车的合力账', 'A net-force ledger for one cart'],
  force: ['同质量，改变合力', 'Same mass, different net force'],
  mass: ['同合力，改变质量', 'Same net force, different mass'],
  diagram: ['只收集目标受到的力', 'Collect forces acting on the target'],
  pairs: ['两个物体，两个受力账', 'Two objects, two force ledgers'],
};
export const newtonOptions: Record<NewtonKind, Pair[]> = {
  inertia: [
    ['静止 · 无水平力', 'At rest · no horizontal force'],
    ['向右 · 无水平力', 'Rightward · no horizontal force'],
    ['向左 · 平衡拉力', 'Leftward · balanced pulls'],
  ],
  net: [
    ['+4−4 N', '+4−4 N'],
    ['+6−2 N', '+6−2 N'],
    ['+2−6 N', '+2−6 N'],
  ],
  force: [
    ['合力0 N', 'Net force 0 N'],
    ['合力2 N', 'Net force 2 N'],
    ['合力4 N', 'Net force 4 N'],
  ],
  mass: [
    ['质量1 kg', 'Mass 1 kg'],
    ['质量2 kg', 'Mass 2 kg'],
    ['质量4 kg', 'Mass 4 kg'],
  ],
  diagram: [
    ['光滑面 · 小车', 'Smooth surface · cart'],
    ['粗糙面 · 匀速小车', 'Rough surface · cruising cart'],
    ['光滑面 · 车与载荷', 'Smooth surface · cart and load'],
  ],
  pairs: [
    ['A=2 · B=2 kg', 'A=2 · B=2 kg'],
    ['A=2 · B=4 kg', 'A=2 · B=4 kg'],
    ['A=4 · B=2 kg', 'A=4 · B=2 kg'],
  ],
};
export function newtonDefault(kind: NewtonKind, index: number) {
  kinematicsCase(index);
  return kind === 'inertia'
    ? [0, 2, -2][index]!
    : kind === 'net'
      ? [4, 2, 6][index]!
      : kind === 'force'
        ? [0, 2, 4][index]!
        : kind === 'mass'
          ? [1, 2, 4][index]!
          : 4;
}
export function newtonLimits(kind: NewtonKind) {
  return kind === 'inertia'
    ? {
        min: -2,
        max: 2,
        step: 0.5,
        unit: 'm/s',
        label: ['自由初速度', 'Free initial velocity'] as Pair,
      }
    : kind === 'mass'
      ? {
          min: 1,
          max: 4,
          step: 0.5,
          unit: 'kg',
          label: ['自由质量', 'Free mass'] as Pair,
        }
      : kind === 'net'
        ? {
            min: 0,
            max: 6,
            step: 1,
            unit: 'N',
            label: ['自由向左拉力大小', 'Free leftward pull magnitude'] as Pair,
          }
        : kind === 'force'
          ? {
              min: 0,
              max: 4,
              step: 0.5,
              unit: 'N',
              label: ['自由向右合力', 'Free rightward net force'] as Pair,
            }
          : {
              min: 2,
              max: 6,
              step: 1,
              unit: 'N',
              label: [
                '自由相互作用力大小',
                'Free interaction force magnitude',
              ] as Pair,
            };
}
export function newtonConfig(kind: NewtonKind, index: number, value: number) {
  kinematicsCase(index);
  if (kind === 'diagram') range(value, 4, 4);
  else {
    const limits = newtonLimits(kind);
    range(value, limits.min, limits.max);
  }
  if (kind === 'pairs') {
    const mA = index === 2 ? 4 : 2,
      mB = index === 1 ? 4 : 2;
    return {
      mass: mA + mB,
      duration: 2,
      right: 0,
      left: 0,
      net: 0,
      u: 0,
      x0: (7 * mA + 9 * mB) / (mA + mB),
    };
  }
  const mass =
      kind === 'mass' ? value : kind === 'diagram' && index === 2 ? 4 : 2,
    duration = kind === 'inertia' ? 3 : 2;
  const right =
    kind === 'inertia'
      ? index === 2
        ? 4
        : 0
      : kind === 'net'
        ? [4, 6, 2][index]!
        : kind === 'force'
          ? value
          : kind === 'diagram'
            ? 6
            : 4;
  const left =
    kind === 'inertia'
      ? index === 2
        ? -4
        : 0
      : kind === 'net'
        ? -value
        : kind === 'diagram' && index === 1
          ? -6
          : 0;
  return {
    mass,
    duration,
    right,
    left,
    net: right + left,
    u:
      kind === 'inertia'
        ? value
        : kind === 'net'
          ? 1
          : kind === 'diagram' && index === 1
            ? 2
            : 0,
    x0: kind === 'inertia' ? 10 : kind === 'net' ? 5 : 1,
  };
}
export function forceResponse(
  mass: number,
  forces: number[],
  u: number,
  t: number,
  x0 = 1,
) {
  range(mass, 1, 8);
  range(u, -10, 10);
  range(t, 0, 3);
  range(x0, 0, 20);
  if (!forces.length)
    throw new RangeError('Use an explicit zero for no modeled force');
  for (const force of forces) range(force, -40, 40);
  const net = forces.reduce((a, b) => a + b, 0);
  range(net, -8, 8);
  return { ...constantMotion(x0, u, net / mass, t), mass, net, time: t };
}
export function interaction(mA: number, mB: number, force: number, t: number) {
  range(mA, 1, 4);
  range(mB, 1, 4);
  range(force, 2, 6);
  range(t, 0, 2);
  const A = constantMotion(7, 0, -force / mA, t),
    B = constantMotion(9, 0, force / mB, t);
  return {
    A,
    B,
    mA,
    mB,
    forceA: -force,
    forceB: force,
    totalMass: mA + mB,
    center: (mA * A.position + mB * B.position) / (mA + mB),
    initialCenter: (7 * mA + 9 * mB) / (mA + mB),
    momentum: mA * A.velocity + mB * B.velocity,
  };
}
export type ForceCard = {
  id: string;
  label: Pair;
  external: boolean;
  axis: 'x' | 'y';
  value: number;
  symbol: string;
};
export function forceCards(index: number): ForceCard[] {
  kinematicsCase(index);
  const loaded = index === 2,
    w = loaded ? 40 : 20,
    target = loaded ? ['车与载荷', 'cart + load'] : ['小车', 'cart'];
  return [
    {
      id: 'weight',
      label: [
        `地球→${target[0]}：重力${w} N向下`,
        `Earth → ${target[1]}: weight ${w} N down`,
      ],
      external: true,
      axis: 'y',
      value: -w,
      symbol: 'W',
    },
    {
      id: 'normal',
      label: [
        `轨道→${target[0]}：支持力${w} N向上`,
        `Track → ${target[1]}: normal ${w} N up`,
      ],
      external: true,
      axis: 'y',
      value: w,
      symbol: 'N',
    },
    {
      id: 'push',
      label: [
        `手→${target[0]}：推力6 N向右`,
        `Hand → ${target[1]}: push 6 N right`,
      ],
      external: true,
      axis: 'x',
      value: 6,
      symbol: 'P',
    },
    index === 1
      ? {
          id: 'friction',
          label: ['轨道→小车：摩擦6 N向左', 'Track → cart: friction 6 N left'],
          external: true,
          axis: 'x',
          value: -6,
          symbol: 'f',
        }
      : {
          id: 'outgoing',
          label: loaded
            ? [
                '载荷→车：接触力20 N向下（系统内）',
                'Load → cart: contact 20 N down (internal)',
              ]
            : ['小车→手：推力6 N向左', 'Cart → hand: push 6 N left'],
          external: false,
          axis: loaded ? 'y' : 'x',
          value: loaded ? -20 : -6,
          symbol: 'out',
        },
    {
      id: 'other',
      label: loaded
        ? [
            '车→载荷：接触力20 N向上（系统内）',
            'Cart → load: contact 20 N up (internal)',
          ]
        : ['小车→轨道：压力20 N向下', 'Cart → track: contact 20 N down'],
      external: false,
      axis: 'y',
      value: loaded ? 20 : -20,
      symbol: 'out',
    },
    {
      id: 'acceleration',
      label: ['“ma向右”作为额外的一股力', '“ma rightward” as an extra force'],
      external: false,
      axis: 'x',
      value: 6,
      symbol: 'ma',
    },
  ];
}
export function checkForceDiagram(index: number, selected: string[]) {
  const cards = forceCards(index),
    expected = cards.filter((c) => c.external).map((c) => c.id);
  return (
    new Set(selected).size === selected.length &&
    selected.length === expected.length &&
    expected.every((id) => selected.includes(id))
  );
}
export function newtonReading(
  kind: NewtonKind,
  index: number,
  value: number,
  progress = 1,
) {
  range(progress, 0, 1);
  const c = newtonConfig(kind, index, value),
    time = c.duration * progress;
  const motion = forceResponse(c.mass, [c.right, c.left], c.u, time, c.x0);
  const pair =
    kind === 'pairs'
      ? interaction(index === 2 ? 4 : 2, index === 1 ? 4 : 2, value, time)
      : null;
  return { config: c, ...motion, time, pair };
}
export function newtonRecord(kind: NewtonKind, index: number): Pair {
  const m = newtonReading(kind, index, newtonDefault(kind, index)),
    c = m.config;
  if (kind === 'pairs') {
    const p = m.pair!;
    return [
      `A受${p.forceA} N，B受${p.forceB} N；aA=${nf(p.forceA / p.mA)}、aB=${nf(p.forceB / p.mB)} m/s²；整体外部水平合力0，质心${nf(p.center)} m不变。`,
      `A receives ${p.forceA} N, B ${p.forceB} N; aA=${nf(p.forceA / p.mA)}, aB=${nf(p.forceB / p.mB)} m/s²; combined external horizontal force 0, center ${nf(p.center)} m unchanged.`,
    ];
  }
  return [
    `m=${c.mass} kg；水平力${c.right}与${c.left} N；合力${m.net} N；a=${nf(m.acceleration)} m/s²；${c.duration} s末v=${nf(m.velocity)} m/s，x=${nf(m.position)} m。`,
    `m=${c.mass} kg; horizontal forces ${c.right} and ${c.left} N; net ${m.net} N; a=${nf(m.acceleration)} m/s²; at ${c.duration} s, v=${nf(m.velocity)} m/s, x=${nf(m.position)} m.`,
  ];
}
