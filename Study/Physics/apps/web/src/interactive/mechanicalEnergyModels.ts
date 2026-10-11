import {
  elasticEnergy,
  gravitationalEnergy,
  kineticEnergy,
  springRelease,
} from './energyModels';
import { averagePower, forceWork, rampTask } from './workModels';
import { nf } from './newtonModels';
import type { Pair } from './kinematicsModels';
export type MechanicalEnergyKind =
  'angle' | 'braking' | 'height' | 'spring' | 'conservation' | 'power';
export const mechanicalEnergyKinds: MechanicalEnergyKind[] = [
  'angle',
  'braking',
  'height',
  'spring',
  'conservation',
  'power',
];
export const mechanicalEnergyTitles: Record<MechanicalEnergyKind, Pair> = {
  angle: ['斜拉箱子的功账', 'The work ledger of an angled pull'],
  braking: ['刹车：速度平方的代价', 'Braking: the cost of speed squared'],
  height: [
    '同一山顶，不同路线与零点',
    'One summit, different paths and zero levels',
  ],
  spring: ['弹簧：变化的力也能做功', 'Spring: work by a changing force'],
  conservation: [
    '滑坡：机械能与总能量',
    'Downhill: mechanical and total energy',
  ],
  power: ['同一搬运：快慢与效率', 'One lifting task: speed and efficiency'],
};
export const mechanicalEnergyOptions: Record<MechanicalEnergyKind, Pair[]> = {
  angle: [
    ['水平拉 · 0°', 'Horizontal · 0°'],
    ['斜拉 · 60°', 'Angled · 60°'],
    ['竖直力 · 90°', 'Vertical force · 90°'],
  ],
  braking: [
    ['2 m/s · 4 N', '2 m/s · 4 N'],
    ['4 m/s · 4 N', '4 m/s · 4 N'],
    ['4 m/s · 8 N', '4 m/s · 8 N'],
  ],
  height: [
    ['竖直 · 地面为零', 'Vertical · ground zero'],
    ['斜坡 · 地面为零', 'Ramp · ground zero'],
    ['斜坡 · 山顶为零', 'Ramp · summit zero'],
  ],
  spring: [
    ['20 N/m · 0.5 m', '20 N/m · 0.5 m'],
    ['20 N/m · 1 m', '20 N/m · 1 m'],
    ['40 N/m · 1 m', '40 N/m · 1 m'],
  ],
  conservation: [
    ['光滑 · 0 N', 'Smooth · 0 N'],
    ['阻力 · 2 N', 'Resistance · 2 N'],
    ['阻力 · 4 N', 'Resistance · 4 N'],
  ],
  power: [
    ['光滑 · 4 s', 'Smooth · 4 s'],
    ['光滑 · 2 s', 'Smooth · 2 s'],
    ['阻力2 N · 2 s', 'Resistance 2 N · 2 s'],
  ],
};
export const mechanicalEnergyLimits = {
  angle: {
    label: ['自由夹角', 'Free force angle'] as Pair,
    min: 0,
    max: 180,
    step: 15,
    unit: '°',
  },
  braking: {
    label: ['自由初速', 'Free initial speed'] as Pair,
    min: 1,
    max: 5,
    step: 0.5,
    unit: 'm/s',
  },
  height: {
    label: ['自由上升高度', 'Free rise'] as Pair,
    min: 0.5,
    max: 2,
    step: 0.25,
    unit: 'm',
  },
  spring: {
    label: ['自由压缩量', 'Free compression'] as Pair,
    min: 0.25,
    max: 1.5,
    step: 0.25,
    unit: 'm',
  },
  conservation: {
    label: ['自由阻力', 'Free resistance'] as Pair,
    min: 0,
    max: 8,
    step: 1,
    unit: 'N',
  },
  power: {
    label: ['自由搬运时间', 'Free task time'] as Pair,
    min: 1,
    max: 6,
    step: 0.5,
    unit: 's',
  },
};
export const mechanicalEnergyNotes: Record<MechanicalEnergyKind, Pair> = {
  angle: [
    '2 kg质点箱子初速2 m/s，恒力4 N；光滑水平面，忽略滚动与空气阻力。N=mg−Fsinθ始终为正。位移水平，因此重力与支持力的功均为0。播放1 s，不把反向拉力当推进力。',
    'A 2 kg point-like case starts at 2 m/s under a constant 4 N force on a smooth horizontal surface. Rolling and air resistance are omitted. N=mg−Fsinθ stays positive. Vertical forces do zero work over horizontal displacement. The interval is 1 s; a backward pull does negative work.',
  ],
  braking: [
    '2 kg滑块受恒定反向净力；停止后净力、速度均置0，位置保持。没有反应时间、轮胎转动或真实道路模型；只隔离动能与制动距离的关系。',
    'A 2 kg slider experiences a constant opposing net force. After stopping, force and velocity are zero and position stays fixed. Reaction time, rotating tyres and real roads are omitted to isolate kinetic energy and braking distance.',
  ],
  height: [
    '2 kg负载在2 s内匀速上升，g=10 m/s²；光滑斜坡长为高度的2倍。起停加速段省略，动能恒定而非必为0。零点改变U的数值，不改变ΔU、重力的功或运动。',
    'A 2 kg load rises steadily in 2 s, with g=10 m/s². The smooth ramp is twice its rise. Start/stop acceleration ramps are omitted; kinetic energy is constant, not necessarily zero. A new zero level changes U, not ΔU, gravitational work or motion.',
  ],
  spring: [
    '1 kg小车连着理想弹簧，水平光滑，压缩后静止释放；播放止于第一次恢复原长，不表示车从此停止。以朝原长方向为正；F=k(c−s)，图下面积是弹簧已做的正功。',
    'A 1 kg cart is attached to an ideal spring on a smooth horizontal track and released from rest after compression. Playback ends at its first natural-length crossing, not a permanent stop. Toward natural length is positive; F=k(c−s), and shaded area is spring work already delivered.',
  ],
  conservation: [
    '2 kg质点滑块从高2 m、长4 m斜坡顶端静止释放，g=10 m/s²。阻力沿坡恒定，模型范围内小于下滑重力分量10 N；止于坡底。系统包含滑块、地球与轨道，把耗散计入热能。',
    'A 2 kg point-like slider is released from rest down a 4 m ramp rising 2 m, with g=10 m/s². Constant resistance is below the 10 N downhill gravity component throughout this model. Playback ends at the bottom. The system includes slider, Earth and track; dissipation is counted as thermal energy.',
  ],
  power: [
    '2 kg负载沿长2 m、高1 m斜坡匀速搬运，g=10 m/s²。恒定阻力为0或2 N，省略起停加速；功率显示搬运区间内的Fv，终点是该区间结束读数。效率只指这次提升的有用势能/输入功。',
    'A 2 kg load moves steadily up a 2 m ramp rising 1 m, with g=10 m/s². Resistance is 0 or 2 N; acceleration ramps are omitted. Power is Fv during the task, with the endpoint marking the end of that interval. Efficiency means useful potential-energy gain divided by input work for this task.',
  ],
};
const finite = (n: number) => {
  if (!Number.isFinite(n)) throw new RangeError('Expected finite input');
  return n;
};
export function mechanicalEnergyDefault(
  kind: MechanicalEnergyKind,
  index: number,
) {
  checkIndex(index);
  return {
    angle: [0, 60, 90],
    braking: [2, 4, 4],
    height: [1, 1, 1],
    spring: [0.5, 1, 1],
    conservation: [0, 2, 4],
    power: [4, 2, 2],
  }[kind][index]!;
}
function checkIndex(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid comparison');
}
export type MechanicalEnergyReading = {
  time: number;
  duration: number;
  mass: number;
  s: number;
  x: number;
  height: number;
  v: number;
  force: number;
  angle: number;
  work: number;
  gravityWork: number;
  frictionWork: number;
  netWork: number;
  kinetic: number;
  initialK: number;
  potential: number;
  initialU: number;
  thermal: number;
  total: number;
  initialTotal: number;
  input: number;
  useful: number;
  power: number;
  usefulPower: number;
  efficiency: number;
  length: number;
  rise: number;
  reference: number;
  compression: number;
  stiffness: number;
  forceInitial: number;
  forceFinal: number;
};
export function mechanicalEnergyReading(
  kind: MechanicalEnergyKind,
  index: number,
  value: number,
  progress: number,
): MechanicalEnergyReading {
  checkIndex(index);
  finite(value);
  finite(progress);
  const limits = mechanicalEnergyLimits[kind];
  if (value < limits.min || value > limits.max || progress < 0 || progress > 1)
    throw new RangeError('Outside teaching domain');
  const r: MechanicalEnergyReading = {
    time: progress,
    duration: 1,
    mass: 2,
    s: 0,
    x: 0,
    height: 0,
    v: 0,
    force: 0,
    angle: 0,
    work: 0,
    gravityWork: 0,
    frictionWork: 0,
    netWork: 0,
    kinetic: 0,
    initialK: 0,
    potential: 0,
    initialU: 0,
    thermal: 0,
    total: 0,
    initialTotal: 0,
    input: 0,
    useful: 0,
    power: 0,
    usefulPower: 0,
    efficiency: 1,
    length: 0,
    rise: 0,
    reference: 0,
    compression: 0,
    stiffness: 0,
    forceInitial: 0,
    forceFinal: 0,
  };
  if (kind === 'angle') {
    r.angle = value;
    const fx =
        Math.abs(value - 90) < 1e-12
          ? 0
          : 4 * Math.cos((value * Math.PI) / 180),
      a = fx / r.mass;
    r.v = 2 + a * r.time;
    r.s = 2 * r.time + 0.5 * a * r.time ** 2;
    r.x = r.s;
    r.work = forceWork(fx, 4 * Math.sin((value * Math.PI) / 180), r.s, 0);
    r.netWork = r.work;
    r.force = fx;
    r.initialK = kineticEnergy(r.mass, 2);
    r.kinetic = kineticEnergy(r.mass, r.v);
    r.forceInitial = fx;
    r.forceFinal = fx;
    r.length = 2 + 0.5 * a;
  } else if (kind === 'braking') {
    const f = index === 2 ? 8 : 4;
    r.duration = (r.mass * value) / f;
    r.time = r.duration * progress;
    const t = r.time;
    r.v = Math.max(0, value - (f / r.mass) * t);
    r.s = value * t - ((0.5 * f) / r.mass) * t * t;
    r.x = r.s;
    r.force = progress === 1 ? 0 : -f;
    r.work = -f * r.s;
    r.netWork = r.work;
    r.initialK = kineticEnergy(r.mass, value);
    r.kinetic = kineticEnergy(r.mass, r.v);
    r.thermal = -r.work;
    r.forceInitial = -f;
    r.forceFinal = -f;
    r.length = r.initialK / f;
  } else if (kind === 'height' || kind === 'power') {
    r.rise = kind === 'height' ? value : 1;
    r.length = kind === 'height' ? (index === 0 ? value : 2 * value) : 2;
    r.reference = kind === 'height' && index === 2 ? r.rise : 0;
    const friction = kind === 'power' && index === 2 ? 2 : 0;
    const task = rampTask(r.mass, r.rise, r.length, friction);
    r.duration = kind === 'height' ? 2 : value;
    r.time = r.duration * progress;
    r.s = r.length * progress;
    r.x = task.horizontal * progress;
    r.height = r.rise * progress;
    r.v = r.length / r.duration;
    r.force = task.force;
    r.forceInitial = task.force;
    r.forceFinal = task.force;
    r.work = task.input * progress;
    r.gravityWork = -task.useful * progress;
    r.frictionWork = -task.thermal * progress;
    r.netWork = 0;
    r.potential = gravitationalEnergy(r.mass, r.height, r.reference);
    r.initialU = gravitationalEnergy(r.mass, 0, r.reference);
    r.kinetic = kineticEnergy(r.mass, r.v);
    r.initialK = r.kinetic;
    r.thermal = task.thermal * progress;
    r.input = r.work;
    r.useful = task.useful * progress;
    r.efficiency = task.efficiency;
    r.power = averagePower(task.input, r.duration);
    r.usefulPower = averagePower(task.useful, r.duration);
  } else if (kind === 'spring') {
    r.mass = 1;
    r.compression = value;
    r.stiffness = index === 2 ? 40 : 20;
    const duration = Math.PI / (2 * Math.sqrt(r.stiffness / r.mass));
    const motion = springRelease(
      r.stiffness,
      -value,
      duration * progress,
      r.mass,
    );
    r.duration = duration;
    r.time = motion.time;
    r.s = value + motion.extension;
    r.x = 2 + motion.extension;
    r.v = motion.velocity;
    r.force = motion.extension === 0 ? 0 : -r.stiffness * motion.extension;
    r.forceInitial = r.stiffness * value;
    r.forceFinal = 0;
    r.length = value;
    r.initialU = elasticEnergy(r.stiffness, value);
    r.potential = motion.elastic;
    r.kinetic = motion.kinetic;
    r.work = r.initialU - r.potential;
    r.netWork = r.work;
  } else {
    r.length = 4;
    r.rise = 2;
    const component = 10,
      a = (component - value) / r.mass;
    r.duration = Math.sqrt((2 * r.length) / a);
    r.time = r.duration * progress;
    r.s = Math.min(r.length, 0.5 * a * r.time ** 2);
    r.x = (Math.sqrt(12) * r.s) / 4;
    r.height = 2 - r.s / 2;
    r.v = a * r.time;
    r.force = component - value;
    r.forceInitial = r.force;
    r.forceFinal = r.force;
    r.initialU = 40;
    r.potential = gravitationalEnergy(r.mass, r.height);
    r.kinetic = kineticEnergy(r.mass, r.v);
    r.gravityWork = component * r.s;
    r.frictionWork = -value * r.s;
    r.thermal = value * r.s;
    r.work = r.gravityWork;
    r.netWork = r.gravityWork + r.frictionWork;
  }
  r.total = r.kinetic + r.potential + r.thermal;
  r.initialTotal = r.initialK + r.initialU;
  return r;
}
export function mechanicalEnergyRows(
  kind: MechanicalEnergyKind,
  r: MechanicalEnergyReading,
): [Pair, number][] {
  switch (kind) {
    case 'angle':
      return [
        [['拉力的功', 'Pull work'], r.work],
        [['竖直力的功', 'Vertical-force work'], 0],
        [['ΔK = W净', 'ΔK = Wnet'], r.netWork],
      ];
    case 'braking':
      return [
        [['初始K', 'Initial K'], r.initialK],
        [['当前K', 'Current K'], r.kinetic],
        [['W净 = ΔK', 'Wnet = ΔK'], r.netWork],
      ];
    case 'height':
      return [
        [['初始U', 'Initial U'], r.initialU],
        [['当前U', 'Current U'], r.potential],
        [['ΔU = −W重', 'ΔU = −Wgravity'], r.potential - r.initialU],
      ];
    case 'spring':
      return [
        [['弹性U', 'Elastic U'], r.potential],
        [['动能K', 'Kinetic K'], r.kinetic],
        [['U + K', 'U + K'], r.total],
      ];
    case 'conservation':
      return [
        [['重力U', 'Gravity U'], r.potential],
        [['动能K', 'Kinetic K'], r.kinetic],
        [['热能Q', 'Thermal Q'], r.thermal],
      ];
    case 'power':
      return [
        [['输入功', 'Input work'], r.input],
        [['有用ΔU', 'Useful ΔU'], r.useful],
        [['热能Q', 'Thermal Q'], r.thermal],
      ];
  }
}
export function mechanicalEnergyRecord(
  kind: MechanicalEnergyKind,
  index: number,
): string {
  const r = mechanicalEnergyReading(
    kind,
    index,
    mechanicalEnergyDefault(kind, index),
    1,
  );
  const common = `s=${nf(r.s)} m; t=${nf(r.duration)} s; K=${nf(r.kinetic)} J; Wnet=${nf(r.netWork)} J`;
  return kind === 'height'
    ? `${common}; U₀=${nf(r.initialU)} J; U=${nf(r.potential)} J; ΔU=${nf(r.potential - r.initialU)} J`
    : kind === 'spring' || kind === 'conservation'
      ? `${common}; U=${nf(r.potential)} J; Q=${nf(r.thermal)} J; U+K+Q=${nf(r.total)} J`
      : kind === 'power'
        ? `${common}; Win=${nf(r.input)} J; ΔU=${nf(r.useful)} J; Pin=${nf(r.power)} W; η=${nf(r.efficiency * 100)}%`
        : `${common}; K₀=${nf(r.initialK)} J; ${kind === 'braking' ? 'Wbrake' : 'Wpull'}=${nf(r.work)} J; ΔK=${nf(r.kinetic - r.initialK)} J`;
}
