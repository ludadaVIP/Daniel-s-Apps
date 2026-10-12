import { nf } from './newtonModels';
export type WaveKind =
  | 'pulse'
  | 'transverse'
  | 'longitudinal'
  | 'wavelength'
  | 'clock'
  | 'amplitude'
  | 'speed'
  | 'relation';
export type Pair = [string, string];
export const waveKinds: WaveKind[] = [
  'pulse',
  'transverse',
  'longitudinal',
  'wavelength',
  'clock',
  'amplitude',
  'speed',
  'relation',
];
export const waveOptions: Record<WaveKind, Pair[]> = {
  pulse: [
    ['小脉冲', 'Small pulse'],
    ['大脉冲', 'Large pulse'],
    ['快脉冲', 'Fast pulse'],
  ],
  transverse: [
    ['向右传播', 'Rightward'],
    ['向左传播', 'Leftward'],
    ['更快向右', 'Faster rightward'],
  ],
  longitudinal: [
    ['λ=2 m · A=0.08 m', 'λ=2 m · A=0.08 m'],
    ['λ=3 m · A=0.08 m', 'λ=3 m · A=0.08 m'],
    ['λ=2 m · A=0.12 m', 'λ=2 m · A=0.12 m'],
  ],
  wavelength: [
    ['λ=1 m', 'λ=1 m'],
    ['λ=2 m', 'λ=2 m'],
    ['λ=3 m', 'λ=3 m'],
  ],
  clock: [
    ['f=0.5 Hz', 'f=0.5 Hz'],
    ['f=1 Hz', 'f=1 Hz'],
    ['f=2 Hz', 'f=2 Hz'],
  ],
  amplitude: [
    ['A=0.005 m', 'A=0.005 m'],
    ['A=0.01 m', 'A=0.01 m'],
    ['A=0.02 m', 'A=0.02 m'],
  ],
  speed: [
    ['F=0.25 N · μ=0.25 kg/m', 'F=0.25 N · μ=0.25 kg/m'],
    ['F=1 N · μ=0.25 kg/m', 'F=1 N · μ=0.25 kg/m'],
    ['F=1 N · μ=1 kg/m', 'F=1 N · μ=1 kg/m'],
  ],
  relation: [
    ['f=0.5 Hz', 'f=0.5 Hz'],
    ['f=1 Hz', 'f=1 Hz'],
    ['f=1.5 Hz', 'f=1.5 Hz'],
  ],
};
export const waveTitles: Record<WaveKind, Pair> = {
  pulse: ['标记留下，脉冲前进', 'Marker stays; pulse travels'],
  transverse: ['振动方向与传播方向', 'Oscillation versus propagation'],
  longitudinal: ['疏密向前，标记往返', 'Compressions travel; marker returns'],
  wavelength: [
    '同一时刻，量相邻同相点',
    'Measure adjacent same-phase points at one instant',
  ],
  clock: [
    '固定一个位置，数完整往返',
    'Count full cycles at one fixed position',
  ],
  amplitude: [
    '改振幅，不改频率与介质',
    'Change amplitude, keep frequency and medium',
  ],
  speed: [
    '介质条件决定理想弦波速',
    'Medium conditions set ideal string-wave speed',
  ],
  relation: [
    '频率改了，同介质的波长跟着改',
    'Change frequency: wavelength follows in the same medium',
  ],
};
export const waveLimits: Record<
  WaveKind,
  { min: number; max: number; step: number; label: Pair; unit: string }
> = {
  pulse: {
    min: 0.5,
    max: 2,
    step: 0.5,
    label: ['自由脉冲波速', 'Free pulse wave speed'],
    unit: 'm/s',
  },
  transverse: {
    min: 0.5,
    max: 2,
    step: 0.5,
    label: ['自由传播速率', 'Free propagation speed'],
    unit: 'm/s',
  },
  longitudinal: {
    min: 0.04,
    max: 0.12,
    step: 0.02,
    label: ['自由纵向振幅', 'Free longitudinal amplitude'],
    unit: 'm',
  },
  wavelength: {
    min: 0.5,
    max: 3,
    step: 0.25,
    label: ['自由波长', 'Free wavelength'],
    unit: 'm',
  },
  clock: {
    min: 0.5,
    max: 2,
    step: 0.25,
    label: ['自由频率', 'Free frequency'],
    unit: 'Hz',
  },
  amplitude: {
    min: 0.005,
    max: 0.02,
    step: 0.005,
    label: ['自由振幅', 'Free amplitude'],
    unit: 'm',
  },
  speed: {
    min: 0.0625,
    max: 1,
    step: 0.0625,
    label: ['自由弦张力', 'Free string tension'],
    unit: 'N',
  },
  relation: {
    min: 0.5,
    max: 2,
    step: 0.25,
    label: ['自由驱动频率', 'Free driving frequency'],
    unit: 'Hz',
  },
};
function finite(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n) || n < lo || n > hi)
    throw new RangeError('Wave parameter outside teaching domain');
}
function caseIndex(i: number) {
  finite(i, 0, 2);
  if (!Number.isInteger(i)) throw new RangeError('Invalid comparison');
}
export function waveDefault(k: WaveKind, i: number) {
  caseIndex(i);
  return {
    pulse: [1, 1, 2],
    transverse: [1, 1, 2],
    longitudinal: [0.08, 0.08, 0.12],
    wavelength: [1, 2, 3],
    clock: [0.5, 1, 2],
    amplitude: [0.005, 0.01, 0.02],
    speed: [0.25, 1, 1],
    relation: [0.5, 1, 1.5],
  }[k][i]!;
}
export type WaveParameters = {
  kind: WaveKind;
  amplitude: number;
  speed: number;
  direction: 1 | -1;
  frequency: number | null;
  wavelength: number | null;
  period: number | null;
  linearDensity: number;
  tension: number;
  halfWidth: number;
  duration: number;
};
export function waveParameters(
  kind: WaveKind,
  index: number,
  value: number,
): WaveParameters {
  caseIndex(index);
  const lim = waveLimits[kind];
  finite(value, lim.min, lim.max);
  let amplitude = 0.01,
    speed = 1,
    frequency = 0.5,
    direction: 1 | -1 = 1,
    linearDensity = 0.25;
  if (kind === 'pulse') {
    amplitude = index === 1 ? 0.02 : 0.01;
    speed = value;
  }
  if (kind === 'transverse') {
    speed = value;
    direction = index === 1 ? -1 : 1;
  }
  if (kind === 'longitudinal') {
    amplitude = value;
    frequency = index === 1 ? 1 / 3 : 0.5;
  }
  if (kind === 'wavelength') frequency = 1 / value;
  if (kind === 'clock' || kind === 'relation') frequency = value;
  if (kind === 'amplitude') amplitude = value;
  if (kind === 'speed') {
    linearDensity = index === 2 ? 1 : 0.25;
    speed = Math.sqrt(value / linearDensity);
  }
  return {
    kind,
    amplitude,
    speed,
    direction,
    frequency: kind === 'pulse' ? null : frequency,
    wavelength: kind === 'pulse' ? null : speed / frequency,
    period: kind === 'pulse' ? null : 1 / frequency,
    linearDensity,
    tension: linearDensity * speed ** 2,
    halfWidth: 0.75,
    duration: 4,
  };
}
/** Displacement is indexed by equilibrium material position, not moving particle position. */
export function waveSample(p: WaveParameters, x: number, time: number) {
  finite(x, 0, 10);
  finite(time, 0, p.duration);
  let displacement: number, slope: number, curvature: number;
  if (p.kind === 'pulse') {
    const z = (x - 1 - p.speed * time) / p.halfWidth;
    if (Math.abs(z) >= 1)
      return {
        displacement: 0,
        velocity: 0,
        acceleration: 0,
        slope: 0,
        strain: 0,
        stretch: 1,
        densityRatio: 1,
      };
    const a = (Math.PI * z) / 2,
      c = Math.cos(a),
      s = Math.sin(a);
    displacement = p.amplitude * c ** 4;
    slope = ((-2 * Math.PI * p.amplitude) / p.halfWidth) * c ** 3 * s;
    curvature =
      ((Math.PI ** 2 * p.amplitude) / p.halfWidth ** 2) *
      (3 * c * c * s * s - c ** 4);
  } else {
    const k = (2 * Math.PI) / p.wavelength!,
      phase = k * (x - p.direction * p.speed * time);
    displacement = p.amplitude * Math.cos(phase);
    slope = -p.amplitude * k * Math.sin(phase);
    curvature = -k * k * displacement;
  }
  const velocity = -p.direction * p.speed * slope,
    acceleration = p.speed ** 2 * curvature;
  const strain = p.kind === 'longitudinal' ? slope : 0,
    stretch = 1 + strain;
  return {
    displacement,
    velocity,
    acceleration,
    slope,
    strain,
    stretch,
    densityRatio: 1 / stretch,
  };
}
export const waveStart = (p: WaveParameters) =>
  p.kind === 'pulse'
    ? 1
    : p.direction === 1
      ? 0
      : Math.floor(8 / p.wavelength!) * p.wavelength!;
export const waveNumber = (n: number) =>
  n !== 0 && Math.abs(n) < 0.001 ? n.toExponential(3) : nf(n);
export function waveReading(
  kind: WaveKind,
  index: number,
  value: number,
  progress: number,
) {
  finite(progress, 0, 1);
  const p = waveParameters(kind, index, value),
    time = p.duration * progress,
    local = waveSample(p, 4, time);
  const phasePosition = waveStart(p) + p.direction * p.speed * time;
  const phaseDistance = p.speed * time,
    cycles = p.frequency === null ? null : p.frequency * time;
  const power =
    p.kind === 'pulse' || p.kind === 'longitudinal'
      ? null
      : 0.5 *
        p.linearDensity *
        p.speed *
        (2 * Math.PI * p.frequency!) ** 2 *
        p.amplitude ** 2;
  return {
    ...p,
    ...local,
    time,
    phasePosition,
    phaseDistance,
    cycles,
    completeCycles: cycles === null ? null : Math.floor(cycles + 1e-10),
    power,
  };
}
export function waveCrests(p: WaveParameters, time: number) {
  finite(time, 0, p.duration);
  if (p.wavelength === null) return [1 + p.speed * time];
  const lambda = p.wavelength,
    offset = (((p.direction * p.speed * time) % lambda) + lambda) % lambda;
  return Array.from(
    { length: Math.floor((10 - offset) / lambda + 1e-10) + 1 },
    (_, i) => offset + i * lambda,
  );
}
export const waveConditions: Record<WaveKind, Pair> = {
  pulse: [
    '预先存在的平滑有限脉冲，在理想无色散弦上平移；u=A cos⁴(πz/2)，|z|<1，外部为0，z=(x−1−ct)/0.75。横向标记的平衡位置x=4 m不变，速度是局部位移的时间导数。只显示10 m视窗，未画端点反射。单脉冲没有重复频率或周期。',
    'A pre-existing smooth compact pulse translates on an ideal nondispersive string: u=A cos⁴(πz/2) for |z|<1, zero outside, z=(x−1−ct)/0.75. The transverse marker retains equilibrium x=4 m; its velocity is the time derivative of local displacement. This is a 10 m window without endpoint reflections. One isolated pulse has no repetition frequency or period.',
  ],
  transverse: [
    '理想无色散弦，u=A cos[2π(x−dct)/λ]，d=±1。振动沿竖直，传播沿水平；不把振动速度当波速。源频率固定0.5 Hz，改变波速会同时改变波长。各设置代表不同理想介质条件，不模拟同一弦瞬间变速。',
    'Ideal nondispersive string u=A cos[2π(x−dct)/λ], d=±1. Oscillation is vertical; propagation is horizontal. Local particle velocity is not wave speed. The source frequency stays 0.5 Hz, so changing wave speed also changes wavelength. Settings represent separate medium conditions, not an instantaneous speed change on one string.',
  ],
  longitudinal: [
    '一维连续介质的示意位移u=A cos[2π(x−ct)/λ]，粒子位置X=x+u，x是平衡坐标。疏密由相邻间距与应变∂u/∂x表示；ρ/ρ₀=1/(1+∂u/∂x)为质量守恒的几何密度比。允许参数保证粒子不交叉。未求解真实空气的压力方程，振幅放大以便观察；下方箭头标明放大比例。纵波曲线的纵轴是水平位移，不能读成空气上下运动。',
    'Illustrative one-dimensional continuum displacement u=A cos[2π(x−ct)/λ], particle position X=x+u, where x is equilibrium position. Neighbour spacing and strain ∂u/∂x show compression; ρ/ρ₀=1/(1+∂u/∂x) is the geometric density ratio from mass conservation. Allowed parameters prevent crossing. This is not a real-air pressure solver; amplitudes are enlarged for visibility and the inset declares its scale. A longitudinal displacement graph plots horizontal displacement, not upward air motion.',
  ],
  wavelength: [
    '理想无色散弦c=1 m/s、A=0.01 m。设定λ后，驱动频率自动成为f=c/λ；不能在固定波速下独立改变λ而仍保持频率。尺子量同一时刻的相邻波峰；波峰到相邻波谷是λ/2。',
    'Ideal nondispersive string c=1 m/s, A=0.01 m. Selecting λ sets driving frequency f=c/λ; wavelength cannot change independently of frequency at fixed speed. The ruler measures adjacent crests at one instant; a crest to the adjacent trough is λ/2.',
  ],
  clock: [
    '理想弦c=1 m/s、A=0.01 m，驱动频率f决定T=1/f与λ=c/f。时间图只记录平衡位置x=4 m的同一个标记。完整次数计从初态返回相同振动状态的完整周期；不将半个往返算一次。4 s窗口可以包含非整数周期。',
    'Ideal string c=1 m/s, A=0.01 m. Source frequency sets T=1/f and λ=c/f. The time graph records one marker at equilibrium x=4 m. Completed cycles count full returns to the initial oscillation state, not half trips. The 4 s window can contain a noninteger number of periods.',
  ],
  amplitude: [
    '固定理想弦线密度μ=0.25 kg/m、张力0.25 N，c=1 m/s；源f=0.5 Hz、λ=2 m。只改A，平均传递功率P̄=½μc(2πf)²A²。纵向尺从平衡位置量到最大位移；峰谷差2A。能量关系限于这组线性理想弦条件，不能直接当响度或海浪高度规律。',
    'Hold ideal-string linear density μ=0.25 kg/m and tension0.25 N, giving c=1 m/s; source f=0.5 Hz, λ=2 m. Only A changes. Mean transmitted power P̄=½μc(2πf)²A². Amplitude is equilibrium to maximum displacement; peak-to-trough span is2A. This linear-string result is not a direct loudness or ocean-wave-height rule.',
  ],
  speed: [
    '理想柔弦、恒定张力F与线密度μ，c=√(F/μ)，源f=0.5 Hz、A=0.01 m。第三组线密度从0.25换为1 kg/m。自由控制只改当前组张力，并同步更新λ=c/f。实际粗绳、弯曲刚度与色散等被省略，数值用于教学，不代表具体乐器。',
    'Ideal flexible string under constant tension F with linear density μ: c=√(F/μ). Source f=0.5 Hz, A=0.01 m. The third comparison changes μ from0.25 to1 kg/m. Free control changes the selected string’s tension and updates λ=c/f. Real stiffness and dispersion are omitted; values are educational rather than predictions for a particular instrument.',
  ],
  relation: [
    '固定同一理想无色散弦：c=1 m/s、A=0.01 m。驱动频率变化，λ=c/f相应变化，T=1/f；不是提高频率就提高波速。一个周期里波形移动一波长。在色散介质里，改变频率可能改变相速度，那属于本模型之外的条件。',
    'Keep the same ideal nondispersive string: c=1 m/s, A=0.01 m. Changing source frequency changes λ=c/f and T=1/f; it does not increase wave speed here. The pattern moves one wavelength in one period. Frequency can change phase speed in a dispersive medium, outside this model’s conditions.',
  ],
};
export function waveRecord(k: WaveKind, i: number) {
  const m = waveReading(k, i, waveDefault(k, i), 1);
  return `t=${nf(m.time)} s; c=${nf(m.speed)} m/s; A=${nf(m.amplitude)} m; u₄=${nf(m.displacement)} m; v₄=${nf(m.velocity)} m/s; s_wave=${nf(m.phaseDistance)} m; x_upeak=${nf(m.phasePosition)} m${m.frequency === null ? '' : `; f=${nf(m.frequency)} Hz; T=${nf(m.period!)} s; λ=${nf(m.wavelength!)} m; n=${nf(m.cycles!)}`}${m.power === null ? '' : `; P̄=${waveNumber(m.power)} W`}${k === 'longitudinal' ? `; ρ/ρ₀=${nf(m.densityRatio)}` : ''}`;
}
