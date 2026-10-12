import { SOUND_AIR_SPEED, SOUND_WATER_SPEED } from './soundModels';
import { nf } from './newtonModels';
import { waveNumber } from './waveModels';
export type AcousticKind =
  | 'propagation'
  | 'pitch'
  | 'level'
  | 'resonance'
  | 'columns'
  | 'doppler'
  | 'echo'
  | 'imaging';
export type Pair = [string, string];
export const acousticKinds: AcousticKind[] = [
  'propagation',
  'pitch',
  'level',
  'resonance',
  'columns',
  'doppler',
  'echo',
  'imaging',
];
export const acousticTitles: Record<AcousticKind, Pair> = {
  propagation: ['空气留下，声音到达', 'Air stays; sound arrives'],
  pitch: ['同一时间，数声压周期', 'Count pressure cycles in one window'],
  level: [
    '声压、强度与分贝分别记',
    'Separate pressure, intensity and decibels',
  ],
  resonance: [
    '同样推动，节奏改变响应',
    'Same forcing; rhythm changes response',
  ],
  columns: [
    '开闭端约束不同的量',
    'Open/closed ends constrain different quantities',
  ],
  doppler: ['波源节奏与接收节奏', 'Source rhythm and received rhythm'],
  echo: ['往返时间与传感器盲区', 'Round-trip time and sensor blind region'],
  imaging: ['回波深度、细节与衰减', 'Echo depth, detail and attenuation'],
};
export const acousticOptions: Record<AcousticKind, Pair[]> = {
  propagation: [
    ['空气', 'Air'],
    ['淡水', 'Fresh water'],
    ['真空', 'Vacuum'],
  ],
  pitch: [
    ['200 Hz', '200 Hz'],
    ['400 Hz', '400 Hz'],
    ['800 Hz', '800 Hz'],
  ],
  level: [
    ['2 mPa RMS', '2 mPa RMS'],
    ['4 mPa RMS', '4 mPa RMS'],
    ['8 mPa RMS', '8 mPa RMS'],
  ],
  resonance: [
    ['推动1 Hz', 'Drive 1 Hz'],
    ['推动2 Hz', 'Drive 2 Hz'],
    ['推动3 Hz', 'Drive 3 Hz'],
  ],
  columns: [
    ['两端开 · 0.5 m', 'Open/open · 0.5 m'],
    ['一端闭 · 0.5 m', 'Closed/open · 0.5 m'],
    ['一端闭 · 0.25 m', 'Closed/open · 0.25 m'],
  ],
  doppler: [
    ['波源靠近', 'Source approaches'],
    ['波源静止', 'Source stationary'],
    ['波源远离', 'Source recedes'],
  ],
  echo: [
    ['目标0.5 m', 'Target 0.5 m'],
    ['目标1 m', 'Target 1 m'],
    ['目标2 m', 'Target 2 m'],
  ],
  imaging: [
    ['2 MHz', '2 MHz'],
    ['5 MHz', '5 MHz'],
    ['10 MHz', '10 MHz'],
  ],
};
export const acousticLimits: Record<
  AcousticKind,
  { min: number; max: number; step: number; label: Pair; unit: string }
> = {
  propagation: {
    min: 0.1,
    max: 3,
    step: 0.1,
    label: ['自由探针距离', 'Free probe distance'],
    unit: 'm',
  },
  pitch: {
    min: 200,
    max: 800,
    step: 100,
    label: ['自由源频率', 'Free source frequency'],
    unit: 'Hz',
  },
  level: {
    min: 1,
    max: 10,
    step: 1,
    label: ['自由有效声压', 'Free RMS pressure'],
    unit: 'mPa',
  },
  resonance: {
    min: 0.5,
    max: 3.5,
    step: 0.5,
    label: ['自由推动频率', 'Free drive frequency'],
    unit: 'Hz',
  },
  columns: {
    min: 0.2,
    max: 1,
    step: 0.05,
    label: ['自由有效管长', 'Free effective tube length'],
    unit: 'm',
  },
  doppler: {
    min: -0.4,
    max: 0.4,
    step: 0.1,
    label: ['自由波源速度比vₛ/c', 'Free source speed ratio vₛ/c'],
    unit: '',
  },
  echo: {
    min: 0.02,
    max: 3,
    step: 0.02,
    label: ['自由目标距离', 'Free target distance'],
    unit: 'm',
  },
  imaging: {
    min: 0.1,
    max: 2,
    step: 0.1,
    label: ['自由界面间距', 'Free boundary separation'],
    unit: 'mm',
  },
};
function valid(value: number, min: number, max: number) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw new RangeError('Outside acoustic model domain');
  return value;
}
export function acousticDefault(kind: AcousticKind, index: number) {
  if (
    !acousticKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid acoustic case');
  return kind === 'propagation' || kind === 'imaging'
    ? 1
    : kind === 'pitch'
      ? [200, 400, 800][index]!
      : kind === 'level'
        ? [2, 4, 8][index]!
        : kind === 'resonance'
          ? [1, 2, 3][index]!
          : kind === 'columns'
            ? [0.5, 0.5, 0.25][index]!
            : kind === 'doppler'
              ? [0.2, 0, -0.2][index]!
              : [0.5, 1, 2][index]!;
}
export function acousticParameters(
  kind: AcousticKind,
  index: number,
  custom: number | null = null,
) {
  const value = custom ?? acousticDefault(kind, index);
  acousticDefault(kind, index);
  const lim = acousticLimits[kind];
  valid(value, lim.min, lim.max);
  const c =
    kind === 'imaging'
      ? 1540
      : kind === 'propagation' && index === 1
        ? SOUND_WATER_SPEED
        : SOUND_AIR_SPEED;
  const frequency =
    kind === 'pitch'
      ? value
      : kind === 'resonance'
        ? value
        : kind === 'columns'
          ? c / ((index === 0 ? 2 : 4) * value)
          : kind === 'echo'
            ? 40000
            : kind === 'imaging'
              ? [2, 5, 10][index]! * 1e6
              : 400;
  return {
    kind,
    index,
    value,
    c,
    frequency,
    active: kind !== 'propagation' || index !== 2,
    rms: kind === 'level' ? value * 0.001 : 0.002,
    duration:
      kind === 'propagation'
        ? 0.025
        : kind === 'resonance'
          ? 8
          : kind === 'doppler' || kind === 'echo'
            ? 0.02
            : kind === 'imaging'
              ? 60e-6
              : 0.01,
    distance: kind === 'propagation' || kind === 'echo' ? value : 5,
    length: kind === 'columns' ? value : 0.5,
    density: kind === 'propagation' && index === 1 ? 1000 : 1.2,
    closed: kind === 'columns' && index > 0,
    sourceVelocity: kind === 'doppler' ? value * c : 0,
    separationMM: kind === 'imaging' ? value : 1,
  };
}
export type AcousticParameters = ReturnType<typeof acousticParameters>;
export const referencePressure = 20e-6;
export function pressureLevel(rms: number) {
  valid(rms, 1e-9, 1000);
  return 20 * Math.log10(rms / referencePressure);
}
export function soundIntensity(
  rms: number,
  density = 1.2,
  speed = SOUND_AIR_SPEED,
) {
  valid(rms, 0, 1000);
  valid(density, 0.001, 20000);
  valid(speed, 1, 10000);
  return (rms * rms) / (density * speed);
}
export function soundPacket(p: AcousticParameters, x: number, t: number) {
  valid(x, 0, 3);
  valid(t, 0, p.duration);
  const s = t - x / p.c,
    tau = 4 / p.frequency,
    A = 1e-7;
  if (!p.active || s <= 0 || s >= tau)
    return { displacement: 0, velocity: 0, pressure: 0 };
  const envelope = Math.sin((Math.PI * s) / tau) ** 2,
    derivative = (Math.PI / tau) * Math.sin((2 * Math.PI * s) / tau),
    w = 2 * Math.PI * p.frequency;
  const displacement = A * envelope * Math.sin(w * s),
    velocity =
      A * (derivative * Math.sin(w * s) + envelope * w * Math.cos(w * s));
  return { displacement, velocity, pressure: p.density * p.c * velocity };
}
export function forcedResponse(frequency: number, t: number) {
  valid(frequency, 0.5, 3.5);
  valid(t, 0, 8);
  const f0 = 2,
    zeta = 0.15,
    w0 = 2 * Math.PI * f0,
    w = 2 * Math.PI * frequency,
    alpha = zeta * w0,
    wd = w0 * Math.sqrt(1 - zeta * zeta),
    force = 0.1,
    mass = 1;
  const a = w0 * w0 - w * w,
    b = 2 * alpha * w,
    den = a * a + b * b,
    C = (force * a) / (mass * den),
    D = (force * b) / (mass * den),
    P = -C,
    Q = (alpha * P - w * D) / wd;
  const e = Math.exp(-alpha * t),
    co = Math.cos(wd * t),
    si = Math.sin(wd * t);
  const displacement =
    C * Math.cos(w * t) + D * Math.sin(w * t) + e * (P * co + Q * si);
  const velocity =
    -C * w * Math.sin(w * t) +
    D * w * Math.cos(w * t) +
    e * ((Q * wd - alpha * P) * co + (-P * wd - alpha * Q) * si);
  const acceleration =
    (force / mass) * Math.cos(w * t) -
    2 * alpha * velocity -
    w0 * w0 * displacement;
  return {
    displacement,
    velocity,
    acceleration,
    steadyAmplitude: force / (mass * Math.sqrt(den)),
    phase: Math.atan2(b, a),
    force: force * Math.cos(w * t),
    naturalFrequency: f0,
    zeta,
  };
}
export function columnSample(p: AcousticParameters, x: number, t: number) {
  valid(x, 0, p.length);
  valid(t, 0, p.duration);
  const k = p.closed ? Math.PI / (2 * p.length) : Math.PI / p.length,
    w = 2 * Math.PI * p.frequency;
  const shape = p.closed ? Math.sin(k * x) : Math.cos(k * x),
    gradient = p.closed ? Math.cos(k * x) : -Math.sin(k * x);
  return {
    displacement: shape * Math.cos(w * t),
    pressure: -gradient * Math.cos(w * t),
    displacementVelocity: -w * shape * Math.sin(w * t),
  };
}
export function dopplerReading(p: AcousticParameters, t: number) {
  valid(t, 0, p.duration);
  const firstArrival = 5 / p.c,
    receivedPeriod = (1 - p.value) / p.frequency;
  const fronts = Array.from(
    { length: Math.floor(p.frequency * t + 1e-10) + 1 },
    (_, n) => {
      const emitted = n / p.frequency;
      return {
        emitted,
        centre: p.sourceVelocity * emitted,
        radius: p.c * Math.max(0, t - emitted),
        arrival: firstArrival + emitted * (1 - p.value),
      };
    },
  );
  return {
    observedFrequency: 1 / receivedPeriod,
    receivedPeriod,
    firstArrival,
    spacingAhead: (p.c - p.sourceVelocity) / p.frequency,
    spacingBehind: (p.c + p.sourceVelocity) / p.frequency,
    sourcePosition: p.sourceVelocity * t,
    arrivals: fronts.filter((f) => f.arrival <= t + 1e-12).length,
    fronts,
  };
}
export function echoReading(p: AcousticParameters, t: number) {
  valid(t, 0, p.duration);
  const roundTrip = (2 * p.distance) / p.c,
    pulseDuration = 8 / p.frequency,
    blanking = 0.0005,
    detectable = roundTrip >= blanking;
  const front =
    t <= p.distance / p.c
      ? p.c * t
      : t <= roundTrip
        ? 2 * p.distance - p.c * t
        : 0;
  return {
    roundTrip,
    pulseDuration,
    blanking,
    detectable,
    arrived: t >= roundTrip,
    front,
    inferredDistance:
      detectable && t >= roundTrip ? (p.c * roundTrip) / 2 : null,
    minimumRange: (p.c * blanking) / 2,
  };
}
export function echoEnvelope(t: number, start: number, duration: number) {
  const s = (t - start) / duration;
  return s <= 0 || s >= 1 ? 0 : Math.sin(Math.PI * s) ** 2;
}
export function ultrasoundReading(frequencyMHz: number, separationMM: number) {
  valid(frequencyMHz, 2, 10);
  valid(separationMM, 0.1, 2);
  const c = 1540,
    cycles = 4,
    pulseFWHM = cycles / (frequencyMHz * 1e6),
    depths = [0.03, 0.03 + separationMM * 0.001];
  const echoes = depths.map((z) => ({
    depth: z,
    time: (2 * z) / c,
    lossDB: 2 * 0.5 * frequencyMHz * (z * 100),
    amplitude: 10 ** ((-2 * 0.5 * frequencyMHz * (z * 100)) / 20),
  }));
  return { c, pulseFWHM, axialFWHM: (c * pulseFWHM) / 2, echoes };
}
export function ultrasoundEnvelope(
  frequencyMHz: number,
  separationMM: number,
  t: number,
) {
  valid(t, 0, 60e-6);
  const m = ultrasoundReading(frequencyMHz, separationMM);
  return m.echoes.reduce(
    (sum, e) =>
      sum +
      e.amplitude *
        Math.exp(-4 * Math.log(2) * ((t - e.time) / m.pulseFWHM) ** 2),
    0,
  );
}
export function acousticReading(p: AcousticParameters, progress: number) {
  valid(progress, 0, 1);
  const time = p.duration * progress;
  return {
    ...p,
    time,
    wavelength: p.c / p.frequency,
    level: pressureLevel(p.rms),
    intensity: soundIntensity(p.rms),
    packet: p.kind === 'propagation' ? soundPacket(p, p.distance, time) : null,
    response: p.kind === 'resonance' ? forcedResponse(p.frequency, time) : null,
    column: p.kind === 'columns' ? columnSample(p, p.length / 4, time) : null,
    doppler: p.kind === 'doppler' ? dopplerReading(p, time) : null,
    echo: p.kind === 'echo' ? echoReading(p, time) : null,
    ultrasound:
      p.kind === 'imaging'
        ? ultrasoundReading(p.frequency / 1e6, p.separationMM)
        : null,
  };
}
export function acousticRecord(p: AcousticParameters) {
  const m = acousticReading(p, 1);
  if (p.kind === 'propagation')
    return p.active
      ? 'c=' +
          p.c +
          ' m/s; d=' +
          nf(p.distance) +
          ' m; arrival=' +
          nf((p.distance / p.c) * 1000) +
          ' ms; λ=' +
          nf(m.wavelength) +
          ' m'
      : 'vacuum: no mechanical sound; no arrival or sound wavelength';
  if (p.kind === 'pitch')
    return (
      'f=' +
      p.frequency +
      ' Hz; T=' +
      nf(1000 / p.frequency) +
      ' ms; λ=' +
      nf(m.wavelength) +
      ' m; cycles in 10 ms=' +
      nf(0.01 * p.frequency) +
      '; p_RMS=2 mPa'
    );
  if (p.kind === 'level')
    return (
      'f=400 Hz; p_RMS=' +
      nf(p.rms * 1000) +
      ' mPa; SPL=' +
      nf(m.level) +
      ' dB re 20 µPa; I=' +
      waveNumber(m.intensity) +
      ' W/m²'
    );
  if (p.kind === 'resonance')
    return (
      'f=' +
      p.frequency +
      ' Hz; f₀=2 Hz; ζ=0.15; steady A=' +
      nf(m.response!.steadyAmplitude * 1000) +
      ' mm; x(8 s)=' +
      nf(m.response!.displacement * 1000) +
      ' mm'
    );
  if (p.kind === 'columns')
    return (
      'L=' +
      nf(p.length) +
      ' m; ' +
      (p.closed ? 'closed/open' : 'open/open') +
      '; f₁=' +
      nf(p.frequency) +
      ' Hz; λ=' +
      nf(m.wavelength) +
      ' m; open end p′=0'
    );
  if (p.kind === 'doppler')
    return (
      'f_src=400 Hz; vₛ=' +
      nf(p.sourceVelocity) +
      ' m/s; f_recv=' +
      nf(m.doppler!.observedFrequency) +
      ' Hz; λ_front=' +
      nf(m.doppler!.spacingAhead) +
      ' m; received crests=' +
      m.doppler!.arrivals
    );
  if (p.kind === 'echo')
    return (
      'f=40 kHz; target=' +
      nf(p.distance) +
      ' m; round trip=' +
      nf(m.echo!.roundTrip * 1000) +
      ' ms; range=' +
      (m.echo!.inferredDistance === null
        ? 'not measured'
        : nf(m.echo!.inferredDistance) + ' m') +
      '; blanking=0.5 ms'
    );
  return (
    'f=' +
    nf(p.frequency / 1e6) +
    ' MHz; separation=' +
    nf(p.separationMM) +
    ' mm; axial FWHM=' +
    nf(m.ultrasound!.axialFWHM * 1000) +
    ' mm; echo₁=' +
    nf(m.ultrasound!.echoes[0]!.time * 1e6) +
    ' µs; loss₁=' +
    nf(m.ultrasound!.echoes[0]!.lossDB) +
    ' dB; A₁/A₀=' +
    nf(m.ultrasound!.echoes[0]!.amplitude)
  );
}
export const acousticConditions: Record<AcousticKind, Pair> = {
  propagation: [
    '一维线性流体声波，规定空气343 m/s、ρ=1.2 kg/m³，淡水1480 m/s、ρ=1000 kg/m³。400 Hz、4周期紧支撑位移包络u=10⁻⁷sin²(πs/τ)sin(2πfs)，s=t−x/c、τ=4/f，窗外为零。局部v=∂u/∂t，声压p′=ρcv；真空不传机械声。粒子位移放大200000倍，图中间距不能当真实密度，颜色仅表示声压正负；横向1 m=160 px。没有扩散、衰减或随机热运动。',
    'One-dimensional linear fluid acoustics with prescribed air c=343 m/s, ρ=1.2 kg/m³ and fresh water c=1480 m/s, ρ=1000 kg/m³. A 400 Hz, four-cycle compact displacement packet uses u=10⁻⁷sin²(πs/τ)sin(2πfs), s=t−x/c, τ=4/f, zero outside. Local v=∂u/∂t and pressure p′=ρcv. Vacuum carries no mechanical sound. Displacement is magnified 200000 times; drawn spacing is not actual density and colour denotes pressure sign only. Horizontal 1 m=160 px. No spreading, loss or random thermal motion.',
  ],
  pitch: [
    '纯正弦，空气343 m/s、p_RMS=2 mPa固定，10 ms共同时间窗；p′=√2 p_RMS cos(2πft)，λ=c/f。试听复用低输出短音，不校准图中声压；耳朵、设备和环境影响听感。画面放慢，试听为真实频率，试听不代替完整规定观察。',
    'Pure sine in air at 343 m/s, held p_RMS=2 mPa and common 10 ms window. p′=√2 p_RMS cos(2πft), λ=c/f. Optional low-output short tones reuse existing controls; device gain is not calibrated to displayed pressure. Perception depends on ears, devices and environment. Visual motion is slowed; audio uses real frequency and does not replace full comparisons.',
  ],
  level: [
    '纯正弦400 Hz，空气ρ=1.2 kg/m³、c=343 m/s。声压级L_p=20log₁₀(p_RMS/20µPa)，强度I=p_RMS²/(ρc)。声压级采用20µPa参考，不把另用1pW/m²参考定义的强度级当成精确相同。分贝是对数测量值，响度是听觉感受；本图不是设备声压计或听力检查，不播放校准分贝。',
    'Pure 400 Hz sine, air ρ=1.2 kg/m³, c=343 m/s. SPL L_p=20log₁₀(p_RMS/20µPa); intensity I=p_RMS²/(ρc). SPL uses 20µPa, not silently a different 1pW/m² intensity reference. Decibels are logarithmic measurements; loudness is perception. This is not a device sound meter or hearing assessment; no calibrated SPL playback is provided.',
  ],
  resonance: [
    '受迫阻尼振子m=1 kg、f₀=2 Hz、ζ=0.15、F₀=0.1 N，从x=v=0出发，解x″+2ζω₀x′+ω₀²x=(F₀/m)cosωt，含暂态与稳态。稳态幅度F₀/[m√((ω₀²−ω²)²+(2ζω₀ω)²)]。位移幅度峰频f₀√(1−2ζ²)≈1.954 Hz，并非严格2 Hz；2 Hz只是在三组规定频率中最大。慢速机械振子说明共振机制，不是假定2 Hz能听见。',
    'Driven damped oscillator: m=1 kg, f₀=2 Hz, ζ=0.15, F₀=0.1 N, starting from x=v=0. Exact transient/steady response solves x″+2ζω₀x′+ω₀²x=(F₀/m)cosωt. Steady amplitude F₀/[m√((ω₀²−ω²)²+(2ζω₀ω)²)]. The displacement peak is near 1.954 Hz, not exactly 2 Hz; 2 Hz is largest among presets. Slow mechanical motion illustrates resonance, not audible 2 Hz sound.',
  ],
  columns: [
    '均匀无损一维空气柱c=343 m/s，只准备基频纯模态。开端p′=0、位移为波腹；闭端u=0、声压为波腹。两开端f₁=c/(2L)、λ=2L，一闭一开f₁=c/(4L)、λ=4L。点沿管运动，位移归一放大；时间图高度不是空气上下运动。忽略管口修正、黏性和驱动建立；L是有效长度，不能直接作为真实瓶子频率预测。',
    'Uniform lossless 1D air column at 343 m/s; prepared pure fundamental. Open end: pressure node/displacement antinode; closed end: displacement node/pressure antinode. Open/open f₁=c/(2L), λ=2L; closed/open f₁=c/(4L), λ=4L. Dots move along the tube with normalized enlargement; pressure plot height is not vertical air motion. No end correction, viscosity or driven build-up; effective L is not an exact bottle-frequency predictor.',
  ],
  doppler: [
    '静止空气c=343 m/s，波源从x=0匀速移动，|vₛ|≤0.4c；固定接收点x=5 m，f_src=400 Hz。波面在t_e=n/f发出，中心vₛt_e、半径c(t−t_e)。到达t_n=5/c+(1−vₛ/c)t_e，f_recv=f_src/(1−vₛ/c)。图为等比例平面截面1 m=20 px；计数不是响度，波源和接收点在本窗内不相遇。不含移动接收器、风、反射或相对论效应。',
    'Still air at 343 m/s; source starts at x=0 with |vₛ|≤0.4c, fixed receiver x=5 m and source f=400 Hz. Crest emitted at t_e=n/f is centred at vₛt_e with radius c(t−t_e). Arrival t_n=5/c+(1−vₛ/c)t_e, giving f_recv=f_src/(1−vₛ/c). Equal-scale plane section: 1 m=20 px. Crest count is not loudness; source/receiver do not meet. No moving observer, wind, reflections or relativistic effect.',
  ],
  echo: [
    '空气343 m/s，40 kHz、8周期包络，脉冲0.2 ms；发射接收共点，静止正对目标，Δt=2d/c。发射后0.5 ms不接收，并丢弃起始落在盲窗中的回波，最小量程0.08575 m。回波归一，不含真实反射强度、噪声或器件延迟；可探测条件不是传感器规格。移动点是脉冲前沿，不是空气粒子；超声不播放音频。',
    'Air 343 m/s; 40 kHz eight-cycle 0.2 ms pulse. Colocated transmitter/receiver faces a fixed target; Δt=2d/c. Receiver is blanked for 0.5 ms and discards echoes starting in that interval, giving minimum range 0.08575 m. Normalized echoes omit real reflection strengths, noise and hardware delays; detectability is not a sensor specification. Moving dot is a pulse front, not material; ultrasound is not played as audio.',
  ],
  imaging: [
    '虚构均匀软组织A线：c=1540 m/s，界面30 mm和30 mm+间距；2/5/10 MHz载频、等效4周期高斯包络FWHM=4/f。回波中心t=2z/c，轴向模糊FWHM=cτ/2。规定衰减0.5 dB/(cm·MHz)，往返幅度比10^(−2αfz/20)。同样弱反射、固定增益；直接叠加包络，不是原始载波压力，忽略多次反射、散射和聚焦。高斯尾部不是真实前沿，检查线只是揭示A线数据。不是人体图像、诊断或治疗模拟；真实分辨率和穿透还受其他因素影响。',
    'Fictional uniform soft-tissue A-line: c=1540 m/s, interfaces at 30 mm and 30 mm plus separation; 2/5/10 MHz carrier, effective four-cycle Gaussian envelope FWHM=4/f. Echo centres t=2z/c; axial blur FWHM=cτ/2. Prescribed attenuation 0.5 dB/(cm·MHz) gives round-trip amplitude 10^(−2αfz/20). Equal weak reflectivities, fixed gain, envelope addition rather than raw pressure. No multiple reflections, scattering or focusing. Gaussian tails are not physical fronts; inspection reveals A-line data. No real patient image, diagnosis or therapy is simulated.',
  ],
};
export const acousticSources: Record<AcousticKind, string> = {
  propagation:
    'https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound',
  pitch:
    'https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound',
  level:
    'https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity',
  resonance:
    'https://openstax.org/books/university-physics-volume-1/pages/15-6-forced-oscillations',
  columns:
    'https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave',
  doppler:
    'https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect',
  echo: 'https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound',
  imaging:
    'https://www.nibib.nih.gov/science-education/science-topics/ultrasound',
};
