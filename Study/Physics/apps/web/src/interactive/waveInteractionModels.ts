import { nf } from './newtonModels';
export type InteractionKind =
  'reflection' | 'refraction' | 'diffraction' | 'interference' | 'standing';
export type Pair = [string, string];
export const interactionKinds: InteractionKind[] = [
  'reflection',
  'refraction',
  'diffraction',
  'interference',
  'standing',
];
export const interactionTitles: Record<InteractionKind, Pair> = {
  reflection: ['端点怎样把脉冲送回来', 'How an end returns a pulse'],
  refraction: ['同一个节奏，两种波速', 'One rhythm, two wave speeds'],
  diffraction: ['缝宽与波长一起比较', 'Compare opening with wavelength'],
  interference: ['相遇时相加，之后继续走', 'Add on meeting; keep travelling'],
  standing: ['不走的波节，仍动的弦', 'Stationary nodes, moving string'],
};
export const interactionOptions: Record<InteractionKind, Pair[]> = {
  reflection: [
    ['固定端', 'Fixed end'],
    ['自由端', 'Free end'],
    ['无反射端', 'Nonreflecting end'],
  ],
  refraction: [
    ['c₂=1 m/s', 'c₂=1 m/s'],
    ['c₂=2 m/s', 'c₂=2 m/s'],
    ['c₂=3 m/s', 'c₂=3 m/s'],
  ],
  diffraction: [
    ['a/λ=1', 'a/λ=1'],
    ['a/λ=2', 'a/λ=2'],
    ['a/λ=4', 'a/λ=4'],
  ],
  interference: [
    ['两个隆起', 'Two bumps'],
    ['隆起与凹陷', 'Bump and dip'],
    ['较小的凹陷', 'Smaller dip'],
  ],
  standing: [
    ['一个波腹', 'One antinode'],
    ['两个波腹', 'Two antinodes'],
    ['三个波腹', 'Three antinodes'],
  ],
};
export const interactionLimits: Record<
  InteractionKind,
  { min: number; max: number; step: number; label: Pair; unit: string }
> = {
  reflection: {
    min: -1,
    max: 1,
    step: 0.25,
    label: ['自由反射系数r', 'Free reflection coefficient r'],
    unit: '',
  },
  refraction: {
    min: 0,
    max: 35,
    step: 5,
    label: ['自由入射角i', 'Free incidence angle i'],
    unit: '°',
  },
  diffraction: {
    min: 0.5,
    max: 6,
    step: 0.5,
    label: ['自由缝宽比a/λ', 'Free opening ratio a/λ'],
    unit: '',
  },
  interference: {
    min: -1,
    max: 1,
    step: 0.25,
    label: ['自由第二脉冲比b', 'Free second-pulse ratio b'],
    unit: '',
  },
  standing: {
    min: 3,
    max: 9,
    step: 0.5,
    label: ['自由弦长L', 'Free string length L'],
    unit: 'm',
  },
};
export function interactionDefault(kind: InteractionKind, index: number) {
  if (
    !interactionKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid wave interaction');
  return kind === 'reflection'
    ? [-1, 1, 0][index]!
    : kind === 'diffraction'
      ? [1, 2, 4][index]!
      : kind === 'interference'
        ? [1, -1, -0.5][index]!
        : kind === 'standing'
          ? 6
          : 30;
}
export type InteractionParameters = {
  kind: InteractionKind;
  index: number;
  value: number;
  duration: number;
  amplitude: number;
  speed: number;
  length: number;
  frequency: number;
  mode: number;
  ratio: number;
  incidence: number;
  refraction: number;
  wavelength: number;
};
const radians = (deg: number) => (deg * Math.PI) / 180;
export function interactionParameters(
  kind: InteractionKind,
  index: number,
  custom: number | null = null,
): InteractionParameters {
  if (
    !interactionKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid wave interaction');
  const value = custom ?? interactionDefault(kind, index),
    lim = interactionLimits[kind];
  if (!Number.isFinite(value) || value < lim.min || value > lim.max)
    throw new RangeError('Wave control outside model domain');
  const speed = kind === 'standing' ? 3 : kind === 'interference' ? 1.5 : 2;
  const length = kind === 'standing' ? value : kind === 'reflection' ? 8 : 10;
  const mode = index + 1,
    frequency = kind === 'standing' ? (mode * speed) / (2 * length) : 1;
  const incidence = kind === 'refraction' ? radians(value) : 0,
    ratio = kind === 'refraction' ? (index + 1) / 2 : value;
  const refraction =
    kind === 'refraction' ? Math.asin(ratio * Math.sin(incidence)) : 0;
  return {
    kind,
    index,
    value,
    duration: kind === 'reflection' ? 6 : 4,
    amplitude: kind === 'standing' ? 0.005 : 0.01,
    speed,
    length,
    frequency,
    mode,
    ratio,
    incidence,
    refraction,
    wavelength:
      kind === 'refraction'
        ? index + 1
        : kind === 'diffraction'
          ? 0.5
          : speed / frequency,
  };
}
// Compact C3 pulse. Its support, derivatives and energy are finite at the edges.
export function interactionPulse(z: number, amplitude = 0.01, width = 0.8) {
  if (
    !Number.isFinite(z) ||
    !Number.isFinite(amplitude) ||
    !Number.isFinite(width) ||
    width <= 0
  )
    throw new RangeError('Invalid pulse');
  if (Math.abs(z) >= width) return { u: 0, dx: 0 };
  const a = (Math.PI * z) / (2 * width),
    c = Math.cos(a),
    s = Math.sin(a);
  return {
    u: amplitude * c ** 4,
    dx: (-2 * Math.PI * amplitude * c ** 3 * s) / width,
  };
}
export function interactionSample(
  p: InteractionParameters,
  x: number,
  time: number,
) {
  if (
    !Number.isFinite(x) ||
    x < 0 ||
    x > p.length ||
    !Number.isFinite(time) ||
    time < 0 ||
    time > p.duration
  )
    throw new RangeError('Sample outside window');
  let first = 0,
    second = 0,
    dx = 0,
    velocity = 0;
  if (p.kind === 'reflection' || p.kind === 'interference') {
    const left = interactionPulse(x - (2 + p.speed * time), p.amplitude);
    const right = interactionPulse(
      x - ((p.kind === 'reflection' ? 14 : 8) - p.speed * time),
      p.amplitude * p.ratio,
    );
    first = left.u;
    second = right.u;
    dx = left.dx + right.dx;
    velocity = -p.speed * left.dx + p.speed * right.dx;
  } else if (p.kind === 'standing') {
    const k = (p.mode * Math.PI) / p.length,
      w = 2 * Math.PI * p.frequency;
    first = p.amplitude * Math.sin(k * x - w * time);
    second = p.amplitude * Math.sin(k * x + w * time);
    dx = 2 * p.amplitude * k * Math.cos(k * x) * Math.cos(w * time);
    velocity = -2 * p.amplitude * w * Math.sin(k * x) * Math.sin(w * time);
  } else throw new RangeError('No string displacement in this angular model');
  return { first, second, u: first + second, dx, velocity };
}
export function diffractionAmplitude(ratio: number, angleDegrees: number) {
  if (
    !Number.isFinite(ratio) ||
    ratio <= 0 ||
    !Number.isFinite(angleDegrees) ||
    Math.abs(angleDegrees) > 90
  )
    throw new RangeError('Invalid diffraction parameters');
  const beta = Math.PI * ratio * Math.sin(radians(angleDegrees));
  return Math.abs(beta) < 1e-9 ? 1 : Math.sin(beta) / beta;
}
export function diffractionFirstMinimum(ratio: number) {
  if (!Number.isFinite(ratio) || ratio <= 0)
    throw new RangeError('Invalid opening ratio');
  return ratio < 1 ? null : (Math.asin(1 / ratio) * 180) / Math.PI;
}
// Same frequency and equal tangential phase gradient on both sides of y=0.
export function refractionPhase(
  p: InteractionParameters,
  x: number,
  y: number,
  time: number,
) {
  const angle = y <= 0 ? p.incidence : p.refraction,
    speed = y <= 0 ? 2 : 2 * p.ratio;
  return (
    2 *
    Math.PI *
    p.frequency *
    ((Math.sin(angle) * x + Math.cos(angle) * y) / speed - time)
  );
}
export function stringEnergy(
  p: InteractionParameters,
  time: number,
  steps = 600,
) {
  if (!Number.isInteger(steps) || steps < 2)
    throw new RangeError('Invalid integration mesh');
  let kinetic = 0,
    potential = 0;
  const step = p.length / steps,
    mu = 0.25,
    tension = mu * p.speed ** 2;
  for (let i = 0; i <= steps; i++) {
    const s = interactionSample(p, i * step, time),
      weight = i === 0 || i === steps ? 0.5 : 1;
    kinetic += weight * 0.5 * mu * s.velocity ** 2 * step;
    potential += weight * 0.5 * tension * s.dx ** 2 * step;
  }
  return { kinetic, potential, total: kinetic + potential };
}
export function interactionReading(p: InteractionParameters, progress: number) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1)
    throw new RangeError('Invalid inspection progress');
  const time = p.duration * progress,
    probe =
      p.kind === 'reflection' ? 6 : p.kind === 'standing' ? p.length / 4 : 5;
  const sample =
    p.kind === 'refraction' || p.kind === 'diffraction'
      ? null
      : interactionSample(p, probe, time);
  const minimum =
    p.kind === 'diffraction' ? diffractionFirstMinimum(p.ratio) : null;
  const amplitude =
    p.kind === 'diffraction' ? diffractionAmplitude(p.ratio, 30) : 1;
  return {
    ...p,
    time,
    probe,
    sample,
    minimum,
    probeAmplitude: amplitude,
    probeIntensity: amplitude ** 2,
    energy:
      p.kind === 'interference' || p.kind === 'standing'
        ? stringEnergy(p, time)
        : null,
  };
}
export function interactionRecord(p: InteractionParameters) {
  const m = interactionReading(p, 1);
  if (p.kind === 'reflection')
    return `t=6 s; r=${nf(p.ratio)}; R=r²=${nf(p.ratio ** 2)}; absorbed=${nf(1 - p.ratio ** 2)}; u₆=${nf(m.sample!.u)} m`;
  if (p.kind === 'refraction')
    return `f=1 Hz; c₁=2 m/s; c₂=${p.index + 1} m/s; i=${nf(p.value)}°; r=${nf((p.refraction * 180) / Math.PI)}°; λ₁=2 m; λ₂=${p.index + 1} m`;
  if (p.kind === 'diffraction')
    return `a/λ=${nf(p.ratio)}; θ₁=${m.minimum === null ? 'none' : nf(m.minimum) + '°'}; I(30°)/I(0)=${nf(m.probeIntensity)}`;
  if (p.kind === 'interference')
    return `t=4 s; b=${nf(p.ratio)}; u₅=${nf(m.sample!.u)} m; E=${nf(m.energy!.total * 1e6)} µJ; x₁=8 m; x₂=2 m`;
  return `L=${nf(p.length)} m; n=${p.mode}; f=${nf(p.frequency)} Hz; λ=${nf(p.wavelength)} m; nodes=${p.mode + 1}; antinodes=${p.mode}; E=${nf(m.energy!.total * 1e6)} µJ`;
}
export const interactionConditions: Record<InteractionKind, Pair> = {
  reflection: [
    '小振幅、线性、无色散弦，x≤8 m；c=2 m/s、μ=0.25 kg/m、F=1 N。u=P(x−2−ct)+rP(x−14+ct)，P=A cos⁴(πz/1.6)在|z|<0.8 m，其余为零。镜像项只在真实弦范围绘制。r=−1固定端u=0；r=+1自由端∂u/∂x=0；r=0匹配吸收端，不是松开绳端。中间r代表线性耗散终端，能量反射比例R=r²，余量被终端吸收。只观察第一次反射，不加左端反射。空间尺：横向1 m=60 px、位移1 m=3000 px。',
    'Small-amplitude linear nondispersive string, x≤8 m; c=2 m/s, μ=0.25 kg/m, F=1 N. u=P(x−2−ct)+rP(x−14+ct), with P=A cos⁴(πz/1.6) for |z|<0.8 m and zero elsewhere. Image terms are drawn only on the physical string. r=−1 fixes u=0; r=+1 imposes ∂u/∂x=0; r=0 is a matched absorber, not a loose end. Intermediate r represents a linear dissipative termination: energy reflection R=r²; the rest is absorbed. First reflection only, no left-end return. Horizontal 1 m=60 px; displacement 1 m=3000 px.',
  ],
  refraction: [
    '稳定单频平面波在两种均匀、各向同性、无色散介质交界处；f=1 Hz、c₁=2 m/s，c₂=1/2/3 m/s。相位沿界面连续，sin i/c₁=sin r/c₂，λ=c/f。两角从法线量，不从界面量。允许i≤35°，没有临界角外的数据；这里只绘制透射波的方向与相位，不计算反射振幅、能量分配或真实水深波速。图中空间方向保持同一比例：1 m=48 px。',
    'Established monochromatic plane waves across homogeneous isotropic nondispersive media; f=1 Hz, c₁=2 m/s, c₂=1/2/3 m/s. Tangential phase continuity gives sin i/c₁=sin r/c₂ and λ=c/f. Angles are measured from the normal. i≤35° stays below the critical domain. Only transmitted direction and phase are modelled, without reflection amplitudes, energy partition or a real water-depth solver. Equal spatial scale: 1 m=48 px.',
  ],
  diffraction: [
    '均匀照明单缝的标量夫琅禾费远场近似：β=π(a/λ)sinθ，振幅比sinβ/β，归一化平均强度I/I₀=(sinβ/β)²。λ=0.5 m、虚构观测距离D=1000 m，D远大于最大a²/λ=18 m；角度窗口±75°。缝图只示意宽度比，扇形是角度分布，不是近场波面或传播路程。每个缝宽都把自身轴向强度归一成1，不能据此比较总透过能量。时间窗用f=1 Hz展示30°处的相位响应，强度为时间平均。a<λ时不存在非零阶暗纹；a=λ的首暗纹仅在90°边界。',
    'Uniformly illuminated scalar Fraunhofer single slit: β=π(a/λ)sinθ, amplitude ratio sinβ/β, normalized mean intensity (sinβ/β)². λ=0.5 m and fictional D=1000 m, much larger than maximum a²/λ=18 m; angular window ±75°. Opening and fan show ratios and angles, not near-field fronts or travel distances. Each width normalizes its own on-axis intensity to 1; total transmitted energy cannot be compared from this plot. A 1 Hz phase illustration follows the 30° probe; intensity is time-averaged. a<λ has no nonzero-order minimum; a=λ places the first at the 90° edge.',
  ],
  interference: [
    '理想线性弦上两个紧支撑脉冲：u₁=P(x−2−1.5t)，u₂=bP(x−8+1.5t)，u=u₁+u₂；A=0.01 m、半宽0.8 m、μ=0.25 kg/m、F=0.5625 N。窗口4 s内没有端点作用，两个脉冲相遇后继续各自传播。动能K=∫½μu̇²dx，弹性势能U=∫½F(∂u/∂x)²dx，使用600段梯形积分，图中单位µJ。反向传播项的交叉能量互相抵消，K+U守恒；位移暂时为零不等于速度为零。弦图横向1 m=48 px、竖向1 m=3000 px。',
    'Two compact pulses on an ideal linear string: u₁=P(x−2−1.5t), u₂=bP(x−8+1.5t), u=u₁+u₂. A=0.01 m, half-width 0.8 m, μ=0.25 kg/m, F=0.5625 N. No boundary acts within the 4 s window; pulses continue through one another. K=∫½μu̇²dx and U=∫½F(∂u/∂x)²dx use 600 trapezoidal intervals; plots use µJ. Counterpropagating cross-energy terms cancel, so K+U is conserved. Zero displacement does not imply zero velocity. Horizontal 1 m=48 px; vertical 1 m=3000 px.',
  ],
  standing: [
    '无阻尼、两端固定的理想弦单一本征模：u=A sin(kx−ωt)+A sin(kx+ωt)=2A sin(kx)cosωt。A=0.005 m、c=3 m/s、μ=0.25 kg/m、k=nπ/L，λ=2L/n、f=nc/(2L)。波节jL/n，波腹(j+½)L/n。标记位于每次选定弦长的L/4。演示直接准备纯模态，没有模拟驱动、共振建立、衰减或真实琴音；低频是便于观察的虚构弦参数。两行波平均功率相反，驻波平均净传递功率为零，但局部瞬时能量流可非零。水平弦长按图宽归一、位移1 m=3000 px。',
    'Undamped pure normal mode on an ideal string fixed at both ends: u=A sin(kx−ωt)+A sin(kx+ωt)=2A sin(kx)cosωt. A=0.005 m, c=3 m/s, μ=0.25 kg/m, k=nπ/L, λ=2L/n, f=nc/(2L). Nodes jL/n; antinodes (j+½)L/n. Marker is at L/4 of each selected string. A pure mode is prepared directly: no driven build-up, damping or actual instrument audio is simulated. Slow fictional parameters allow observation. Opposing mean travelling powers cancel; instantaneous local energy flow can remain. Length is normalized to diagram width; displacement 1 m=3000 px.',
  ],
};
export const interactionSources: Record<InteractionKind, string> = {
  reflection:
    'https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves',
  refraction:
    'https://openstax.org/books/physics/pages/13-3-wave-interaction-superposition-and-interference',
  diffraction:
    'https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction',
  interference:
    'https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves',
  standing:
    'https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance',
};
