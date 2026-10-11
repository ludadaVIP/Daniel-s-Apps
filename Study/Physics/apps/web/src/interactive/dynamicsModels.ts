import { kinematicsCase, type Pair } from './kinematicsModels';
import { nf } from './newtonModels';
export type DynamicsKind =
  'friction' | 'drag' | 'terminal' | 'elevator' | 'cars' | 'rockets';
export const dynamicsKinds: DynamicsKind[] = [
  'friction',
  'drag',
  'terminal',
  'elevator',
  'cars',
  'rockets',
];
const range = (n: number, lo: number, hi: number) => {
  if (!Number.isFinite(n) || n < lo || n > hi)
    throw new RangeError('Outside dynamics model');
  return n;
};
export const dynamicsTitles: Record<DynamicsKind, Pair> = {
  friction: ['先不动，再滑动，最后停下', 'Hold, slide, then stop'],
  drag: ['同质量，改变空气作用', 'Same mass, different air effects'],
  terminal: ['从两侧靠近同一个速度', 'Approach one speed from both sides'],
  elevator: ['电梯运动与秤的读数', 'Elevator motion and scale readings'],
  cars: ['地面对车的驱动与制动', 'Driving and braking from the road'],
  rockets: [
    '真空里喷出质量，改变速度',
    'Eject mass in vacuum, change velocity',
  ],
};
export const dynamicsOptions: Record<DynamicsKind, Pair[]> = {
  friction: [
    ['静止 · 推6 N', 'Rest · push 6 N'],
    ['静止 · 推14 N', 'Rest · push 14 N'],
    ['已滑动 · 松手', 'Sliding · release'],
  ],
  drag: [
    ['无空气作用', 'No air effects'],
    ['k=0.1 kg/m', 'k=0.1 kg/m'],
    ['k=0.4 kg/m', 'k=0.4 kg/m'],
  ],
  terminal: [
    ['初速0 m/s', 'Initial 0 m/s'],
    ['初速5 m/s', 'Initial 5 m/s'],
    ['初速8 m/s', 'Initial 8 m/s'],
  ],
  elevator: [
    ['向上 · 起停', 'Upward · start/stop'],
    ['向下 · 起停', 'Downward · start/stop'],
    ['向上 · 匀速段', 'Upward · steady segment'],
  ],
  cars: [
    ['驱动6 N', 'Drive 6 N'],
    ['驱动2 N', 'Drive 2 N'],
    ['制动6 N', 'Brake 6 N'],
  ],
  rockets: [
    ['关闭喷气', 'Thruster off'],
    ['喷速20 m/s', 'Exhaust 20 m/s'],
    ['喷速40 m/s', 'Exhaust 40 m/s'],
  ],
};
export const dynamicsNotes: Record<DynamicsKind, Pair> = {
  friction: [
    '水平2 kg块，g=10，N=20 N，μs=0.6、μk=0.4。静摩擦上限12 N，滑动摩擦8 N；到零速后重新判断静止，不让阻力把块推回去。理想干摩擦模型，忽略空气。',
    'Horizontal 2 kg block, g=10, N=20 N, μs=0.6 and μk=0.4. Static limit 12 N, sliding friction 8 N. Recheck rest at zero speed; resistance does not push it backwards. Ideal dry friction; air omitted.',
  ],
  drag: [
    '1 kg物体，向下为正，g=10。静止空气中D=kv²，k=½ρCdA，固定空气密度与形状；忽略浮力和地面，坐标是自释放点向下的距离。不是所有流速都适用的万能阻力公式。',
    '1 kg body, downward positive, g=10. In still air D=kv², k=½ρCdA, with fixed density and shape. Buoyancy and ground omitted; position is downward distance from release. This drag law is not universal for every flow regime.',
  ],
  terminal: [
    '同一1 kg物体，g=10、k=0.4 kg/m，向下为正，vt=5 m/s。分别从低于、等于、高于vt的初速观察1.5 s。有限时间的接近不等于精确到达；没有着地事件。',
    'Same 1 kg body, g=10, k=0.4 kg/m, downward positive, vt=5 m/s. Observe 1.5 s from below, exactly at and above vt. A finite-time approach is not exact arrival; no landing event.',
  ],
  elevator: [
    '研究站稳的乘客，竖直向上为正，g=10。起停用±2 m/s²，中间匀速，理想瞬时切换。向上/向下两趟4 s后停稳；第三组只是4 s匀速片段。秤读支持力N，不读质量变化。',
    'Target is a standing passenger; upward positive, g=10. Start/stop use ±2 m/s² with ideal instantaneous changes and a steady middle. Up/down trips finish at rest after 4 s; the third is only a 4 s steady segment. The scale reads support N, not changing mass.',
  ],
  cars: [
    '2 kg教学小车，地面惯性系。驱动或制动力是地面给轮胎的外力，受抓地上限限制；运动时额外阻力2 N。到零速后制动力为0，驱动不超过2 N时按静止阻力平衡。忽略打滑后的复杂轮胎动态，数值不代表真实汽车制动距离。',
    '2 kg teaching vehicle in the road inertial frame. Drive/brake force is an external road force on tyres, capped by grip; extra moving resistance is 2 N. At zero speed braking vanishes; drive up to 2 N is balanced at rest. Post-slip tyre dynamics omitted; numbers are not real-car stopping distances.',
  ],
  rockets: [
    '水平冷气喷射模型：初质量10 kg、干质量6 kg，真空且无重力，喷速相对飞行器固定，匀速排出质量q，T=qve。喷口压力项忽略；仍留在机上的质量m=10−qt。喷气示意箭头不是已排出气体的轨迹。',
    'Horizontal cold-gas model: initial mass 10 kg, dry mass 6 kg, vacuum and no gravity. Exhaust speed relative to craft is fixed; constant mass flow q gives T=qve. No nozzle pressure term; remaining onboard mass m=10−qt. Exhaust cue arrows are not trajectories of already expelled gas.',
  ],
};
export function dynamicsDefault(kind: DynamicsKind, index: number) {
  kinematicsCase(index);
  return kind === 'friction'
    ? [6, 14, 0][index]!
    : kind === 'drag'
      ? [0, 0.1, 0.4][index]!
      : kind === 'terminal'
        ? [0, 5, 8][index]!
        : kind === 'elevator'
          ? 2
          : kind === 'cars'
            ? 6
            : index === 0
              ? 0
              : 1;
}
export function dynamicsLimits(kind: DynamicsKind) {
  const v: Record<
    DynamicsKind,
    { min: number; max: number; step: number; unit: string; label: Pair }
  > = {
    friction: {
      min: 0,
      max: 14,
      step: 1,
      unit: 'N',
      label: ['自由推力', 'Free push'],
    },
    drag: {
      min: 0,
      max: 0.4,
      step: 0.05,
      unit: 'kg/m',
      label: ['自由空气作用系数k', 'Free air-effect coefficient k'],
    },
    terminal: {
      min: 0,
      max: 8,
      step: 0.5,
      unit: 'm/s',
      label: ['自由向下初速度', 'Free downward initial velocity'],
    },
    elevator: {
      min: 1,
      max: 3,
      step: 0.5,
      unit: 'kg',
      label: ['自由乘客质量', 'Free passenger mass'],
    },
    cars: {
      min: 0,
      max: 6,
      step: 1,
      unit: 'N',
      label: ['自由抓地力上限', 'Free grip-force cap'],
    },
    rockets: {
      min: 0,
      max: 2,
      step: 0.25,
      unit: 'kg/s',
      label: ['自由排气质量流率', 'Free exhaust mass flow'],
    },
  };
  return v[kind];
}
export const dynamicsDuration = (kind: DynamicsKind) =>
  kind === 'elevator' ? 4 : kind === 'terminal' ? 1.5 : 2;
export function frictionMotion(push: number, u: number, t: number) {
  range(push, 0, 14);
  range(u, 0, 3);
  range(t, 0, 2);
  const mass = 2,
    normal = 20,
    staticLimit = 12,
    kinetic = 8;
  if (u === 0 && push <= staticLimit)
    return {
      position: 0,
      velocity: 0,
      acceleration: 0,
      friction: push === 0 ? 0 : -push,
      push,
      mass,
      normal,
      state: 'static' as const,
      stopTime: null,
    };
  const a = (push - kinetic) / mass,
    stopTime = a < 0 ? -u / a : null;
  if (stopTime !== null && t >= stopTime)
    return {
      position: u * stopTime + (a * stopTime ** 2) / 2,
      velocity: 0,
      acceleration: 0,
      friction: push === 0 ? 0 : -push,
      push,
      mass,
      normal,
      state: 'static' as const,
      stopTime,
    };
  return {
    position: u * t + (a * t * t) / 2,
    velocity: u + a * t,
    acceleration: a,
    friction: -kinetic,
    push,
    mass,
    normal,
    state: 'sliding' as const,
    stopTime,
  };
}
export function quadraticFall(mass: number, k: number, u: number, t: number) {
  range(mass, 1, 3);
  range(k, 0, 0.4);
  range(u, 0, 8);
  range(t, 0, 2);
  const g = 10,
    weight = mass * g;
  if (k === 0)
    return {
      position: u * t + (g * t * t) / 2,
      velocity: u + g * t,
      acceleration: g,
      drag: 0,
      weight,
      mass,
      terminal: null,
    };
  const terminal = Math.sqrt(weight / k),
    z = (g * t) / terminal,
    r = u / terminal;
  const h = Math.tanh(z),
    velocity = (terminal * (r + h)) / (1 + r * h);
  const position =
    r === 1
      ? terminal * t
      : (terminal ** 2 / g) *
        (Math.log1p(2 * Math.sinh(z / 2) ** 2) + Math.log1p(r * h));
  const drag = k * velocity ** 2;
  return {
    position,
    velocity,
    acceleration: (weight - drag) / mass,
    drag,
    weight,
    mass,
    terminal,
  };
}
export function elevatorMotion(index: number, mass: number, t: number) {
  kinematicsCase(index);
  range(mass, 1, 3);
  range(t, 0, 4);
  const sign = index === 1 ? -1 : 1;
  let displacement: number, velocity: number, acceleration: number;
  if (index === 2) {
    displacement = 2 * t;
    velocity = 2;
    acceleration = 0;
  } else if (t < 1) {
    displacement = sign * t * t;
    velocity = sign * 2 * t;
    acceleration = sign * 2;
  } else if (t < 3) {
    displacement = sign * (1 + 2 * (t - 1));
    velocity = sign * 2;
    acceleration = 0;
  } else if (t < 4) {
    const s = t - 3;
    displacement = sign * (5 + 2 * s - s * s);
    velocity = sign * (2 - 2 * s);
    acceleration = -sign * 2;
  } else {
    displacement = sign * 6;
    velocity = 0;
    acceleration = 0;
  }
  return {
    position: 10 + displacement,
    velocity,
    acceleration,
    mass,
    weight: mass * 10,
    normal: mass * (10 + acceleration),
    phase:
      index === 2
        ? 'steady'
        : t < 1
          ? 'start'
          : t < 3
            ? 'steady'
            : t < 4
              ? 'stop'
              : 'arrived',
  };
}
export function vehicleMotion(index: number, cap: number, t: number) {
  kinematicsCase(index);
  range(cap, 0, 6);
  range(t, 0, 2);
  const mass = 2,
    u = index === 0 ? 2 : 4,
    request = index === 1 ? 2 : 6,
    applied = Math.min(request, cap) * (index === 2 ? -1 : 1),
    resistance = -2,
    a = (applied + resistance) / mass,
    stopTime = a < 0 ? -u / a : null;
  if (stopTime !== null && t >= stopTime) {
    const traction = index === 2 ? 0 : applied;
    return {
      position: u * stopTime + (a * stopTime ** 2) / 2,
      velocity: 0,
      acceleration: 0,
      mass,
      traction,
      resistance: -traction,
      cap,
      stopTime,
      state: 'stopped' as const,
    };
  }
  return {
    position: u * t + (a * t * t) / 2,
    velocity: u + a * t,
    acceleration: a,
    mass,
    traction: applied,
    resistance,
    cap,
    stopTime,
    state: 'moving' as const,
  };
}
export function rocketMotion(q: number, exhaustSpeed: number, t: number) {
  range(q, 0, 2);
  range(exhaustSpeed, 20, 40);
  range(t, 0, 2);
  const initialMass = 10,
    mass = initialMass - q * t,
    exhaustMass = q * t,
    thrust = q * exhaustSpeed;
  const r = exhaustMass / initialMass,
    log = -Math.log1p(-r);
  let position = 0;
  if (r > 0) {
    let integral = 0;
    if (r < 1e-4)
      for (let n = 2; n <= 8; n++) integral += r ** n / (n * (n - 1));
    else integral = r + (1 - r) * Math.log1p(-r);
    position = (exhaustSpeed * t * integral) / r;
  }
  return {
    mass,
    exhaustMass,
    thrust,
    acceleration: thrust / mass,
    velocity: exhaustSpeed * log,
    position,
    q,
    exhaustSpeed,
  };
}
export type DynamicsReading = {
  time: number;
  duration: number;
  position: number;
  velocity: number;
  acceleration: number;
  mass: number;
  positive: number;
  negative: number;
  net: number;
  state: Pair;
  terminal: number | null;
  extra: string;
};
export function dynamicsReading(
  kind: DynamicsKind,
  index: number,
  value: number,
  progress = 1,
): DynamicsReading {
  kinematicsCase(index);
  range(progress, 0, 1);
  const limit = dynamicsLimits(kind);
  range(value, limit.min, limit.max);
  const duration = dynamicsDuration(kind),
    time = duration * progress;
  if (kind === 'friction') {
    const m = frictionMotion(value, index === 2 ? 3 : 0, time);
    return {
      ...m,
      time,
      duration,
      positive: m.push,
      negative: m.friction,
      net: m.push + m.friction,
      state:
        m.state === 'static'
          ? ['静摩擦 · 保持静止', 'Static friction · held at rest']
          : ['滑动摩擦', 'Sliding friction'],
      terminal: null,
      extra: 'μs=0.6 · μk=0.4 · N=20 N',
    };
  }
  if (kind === 'drag' || kind === 'terminal') {
    const m = quadraticFall(
      1,
      kind === 'drag' ? value : 0.4,
      kind === 'terminal' ? value : 0,
      time,
    );
    return {
      ...m,
      time,
      duration,
      positive: m.weight,
      negative: -m.drag,
      net: m.weight - m.drag,
      state: ['向下为正', 'Downward positive'],
      extra: m.terminal === null ? 'k=0' : `vt=${nf(m.terminal)} m/s`,
    };
  }
  if (kind === 'elevator') {
    const m = elevatorMotion(index, value, time);
    const phase: Record<string, Pair> = {
      start: ['起步', 'Starting'],
      steady: ['匀速', 'Steady'],
      stop: ['刹车', 'Braking'],
      arrived: ['已停稳', 'At rest'],
    };
    return {
      ...m,
      time,
      duration,
      positive: m.normal,
      negative: -m.weight,
      net: m.normal - m.weight,
      state: phase[m.phase]!,
      terminal: null,
      extra: `m=${nf(value)} kg · W=${nf(m.weight)} N`,
    };
  }
  if (kind === 'cars') {
    const m = vehicleMotion(index, value, time);
    return {
      ...m,
      time,
      duration,
      positive: m.traction,
      negative: m.resistance,
      net: m.traction + m.resistance,
      state:
        m.state === 'stopped'
          ? ['已停稳 · 不倒着滑', 'Stopped · no reverse slide']
          : ['仍在向右行驶', 'Still moving right'],
      terminal: null,
      extra: `grip≤${nf(value)} N`,
    };
  }
  const m = rocketMotion(value, index === 2 ? 40 : 20, time);
  return {
    ...m,
    time,
    duration,
    positive: m.thrust,
    negative: 0,
    net: m.thrust,
    state: ['喷速相对飞行器', 'Exhaust speed relative to craft'],
    terminal: null,
    extra: `m=${nf(m.mass)} kg · out=${nf(m.exhaustMass)} kg`,
  };
}
export function dynamicsRecord(kind: DynamicsKind, index: number): Pair {
  const value = dynamicsDefault(kind, index),
    m = dynamicsReading(kind, index, value);
  if (kind === 'elevator') {
    const n = [0.5, 2, 3.5]
      .map((t) => nf(elevatorMotion(index, value, t).normal))
      .join('/');
    return [
      `起步/匀速/刹车N=${n} N；4 s后v=${nf(m.velocity)} m/s，x=${nf(m.position)} m；质量仍${value} kg。`,
      `Start/steady/braking N=${n} N; at 4 s v=${nf(m.velocity)} m/s, x=${nf(m.position)} m; mass stays ${value} kg.`,
    ];
  }
  if (kind === 'rockets')
    return [
      `2 s后机上${nf(m.mass)} kg，排出${nf(10 - m.mass)} kg；T=${nf(m.net)} N，a=${nf(m.acceleration)} m/s²，v=${nf(m.velocity)} m/s，x=${nf(m.position)} m。`,
      `At 2 s onboard ${nf(m.mass)} kg, expelled ${nf(10 - m.mass)} kg; T=${nf(m.net)} N, a=${nf(m.acceleration)} m/s², v=${nf(m.velocity)} m/s, x=${nf(m.position)} m.`,
    ];
  return [
    `t=${m.time} s，m=${nf(m.mass)} kg：两项力${nf(m.positive)}/${nf(m.negative)} N；合力${nf(m.net)} N，a=${nf(m.acceleration)} m/s²，v=${nf(m.velocity)} m/s，位移${nf(m.position)} m。${m.state[0]}。`,
    `t=${m.time} s, m=${nf(m.mass)} kg: force terms ${nf(m.positive)}/${nf(m.negative)} N; net ${nf(m.net)} N, a=${nf(m.acceleration)} m/s², v=${nf(m.velocity)} m/s, displacement ${nf(m.position)} m. ${m.state[1]}.`,
  ];
}
