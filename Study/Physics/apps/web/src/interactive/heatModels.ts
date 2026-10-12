import { nf } from './newtonModels';
import { waveNumber } from './waveModels';
export type Pair = [string, string];
export type HeatKind =
  'particles' | 'internal' | 'temperature' | 'capacity' | 'phase' | 'latent';
export const heatKinds: HeatKind[] = [
  'particles',
  'internal',
  'temperature',
  'capacity',
  'phase',
  'latent',
];
export const boltzmann = 1.380649e-23,
  avogadro = 6.02214076e23,
  gasConstant = boltzmann * avogadro,
  atomicUnit = 1.66054e-27;
function valid(x: number, min: number, max: number) {
  if (!Number.isFinite(x) || x < min || x > max)
    throw new RangeError('Outside thermal model');
  return x;
}
export function gasState(T: number, massU: number, moles = 0.001) {
  valid(T, 150, 600);
  valid(massU, 1, 100);
  valid(moles, 0.0001, 0.01);
  const mass = massU * atomicUnit,
    meanK = 1.5 * boltzmann * T,
    U = 1.5 * moles * gasConstant * T;
  return {
    T,
    massU,
    mass,
    moles,
    meanK,
    U,
    rms: Math.sqrt((3 * boltzmann * T) / mass),
    N: moles * avogadro,
  };
}
const phi = (1 + Math.sqrt(5)) / 2;
const directions = Array.from({ length: 6 }, (_, i) => {
  const axis = Math.floor(i / 2),
    sign = i % 2 ? -1 : 1;
  return axis === 0
    ? [0, 1, sign * phi]
    : axis === 1
      ? [1, sign * phi, 0]
      : [sign * phi, 0, 1];
});
const speeds = [0.4, 0.8, 1.1, 1.5],
  speedNorm = Math.sqrt(speeds.reduce((a, v) => a + v * v, 0) / 4),
  boxLength = 1e-6;
/** Point-particle wall reflection. At a boundary the right-hand velocity is used. */
export function reflectedCoordinate(
  start: number,
  velocity: number,
  time: number,
  L = boxLength,
) {
  valid(start, 0, L);
  valid(time, 0, 1e-8);
  valid(L, 1e-8, 1e-3);
  valid(velocity, -10000, 10000);
  const raw = start + velocity * time,
    phase = ((raw % (2 * L)) + 2 * L) % (2 * L),
    nearLow = phase < 1e-15 || 2 * L - phase < 1e-15,
    nearHigh = Math.abs(phase - L) < 1e-15;
  const position = nearLow
    ? 0
    : nearHigh
      ? L
      : phase < L
        ? phase
        : 2 * L - phase;
  return {
    position,
    velocity: nearLow
      ? Math.abs(velocity)
      : nearHigh
        ? -Math.abs(velocity)
        : velocity * (phase < L ? 1 : -1),
  };
}
export function gasParticles(
  T: number,
  massU: number,
  time: number,
  amount: 1 | 2 = 1,
) {
  const g = gasState(T, massU);
  valid(time, 0, 1e-8);
  if (amount !== 1 && amount !== 2)
    throw new RangeError('Invalid representative amount');
  const out: {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    group: number;
    speed: number;
  }[] = [];
  for (let copy = 0; copy < amount; copy++)
    for (let group = 0; group < 4; group++)
      for (let d = 0; d < 6; d++) {
        const key = copy * 24 + group * 6 + d,
          start = [
            0.1 + ((key * 37 + 11) % 79) / 100,
            0.1 + ((key * 29 + 7) % 79) / 100,
            0.1 + ((key * 43 + 3) % 79) / 100,
          ].map((v) => v * boxLength),
          direction = directions[d]!,
          norm = Math.hypot(...direction),
          v = direction.map(
            (x) => ((x / norm) * g.rms * speeds[group]!) / speedNorm,
          );
        for (const sign of [1, -1]) {
          const coordinates = start.map((x, j) =>
            reflectedCoordinate(
              sign > 0 ? x : boxLength - x,
              sign * v[j]!,
              time,
            ),
          );
          out.push({
            x: coordinates[0]!.position,
            y: coordinates[1]!.position,
            z: coordinates[2]!.position,
            vx: coordinates[0]!.velocity,
            vy: coordinates[1]!.velocity,
            vz: coordinates[2]!.velocity,
            group,
            speed: Math.hypot(...v),
          });
        }
      }
  return out;
}
export function contactState(
  Ca: number,
  Cb: number,
  Ta: number,
  Tb: number,
  G: number,
  time: number,
) {
  valid(Ca, 1, 100);
  valid(Cb, 1, 100);
  valid(Ta, 150, 600);
  valid(Tb, 150, 600);
  valid(G, 0, 2);
  valid(time, 0, 30);
  const equilibrium = (Ca * Ta + Cb * Tb) / (Ca + Cb),
    difference = (Ta - Tb) * Math.exp(-G * (1 / Ca + 1 / Cb) * time),
    A = equilibrium + (Cb / (Ca + Cb)) * difference,
    B = equilibrium - (Ca / (Ca + Cb)) * difference;
  return {
    Ca,
    Cb,
    Ta,
    Tb,
    G,
    time,
    equilibrium,
    A,
    B,
    Qa: Ca * (A - Ta),
    Qb: Cb * (B - Tb),
    powerIntoA: G * (B - A),
    Ua: Ca * A,
    Ub: Cb * B,
  };
}
export function sensibleHeating(
  mass: number,
  c: number,
  absorbedPower: number,
  time: number,
) {
  valid(mass, 0.05, 0.2);
  valid(c, 500, 5000);
  valid(absorbedPower, 0, 84);
  valid(time, 0, 10);
  const Q = absorbedPower * time,
    C = mass * c;
  return {
    mass,
    c,
    absorbedPower,
    time,
    Q,
    C,
    rise: Q / C,
    temperature: 20 + Q / C,
    perKelvin: C,
  };
}
export const iceC = 2100,
  waterC = 4200,
  fusionL = 334000,
  vaporL = 2260000;
export function iceHeating(Q: number, mass = 0.1) {
  valid(Q, 0, 50000);
  valid(mass, 0.05, 0.2);
  if (Q > mass * (iceC * 10 + fusionL + waterC * 100))
    throw new RangeError('Boiling is outside this heating curve');
  const warmThreshold = mass * iceC * 10,
    meltThreshold = warmThreshold + mass * fusionL,
    Qice = Math.min(Q, warmThreshold),
    Qmelt = Math.min(Math.max(0, Q - warmThreshold), mass * fusionL),
    Qwater = Math.max(0, Q - meltThreshold),
    converted = Qmelt / fusionL,
    temperature =
      Q < warmThreshold
        ? -10 + Q / (mass * iceC)
        : Q <= meltThreshold
          ? 0
          : Qwater / (mass * waterC),
    state =
      Q < warmThreshold
        ? 'solid warming'
        : Q === warmThreshold
          ? 'solid at melting point'
          : Q < meltThreshold
            ? 'melting'
            : Q === meltThreshold
              ? 'liquid at melting point'
              : 'liquid warming';
  return {
    Q,
    mass,
    Qice,
    Qmelt,
    Qwater,
    converted,
    solid: mass - converted,
    liquid: converted,
    temperature,
    state,
    warmThreshold,
    meltThreshold,
  };
}
export function latentState(index: number, mass: number, progress: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid transition');
  valid(mass, 0.05, 0.2);
  valid(progress, 0, 1);
  const L = index === 1 ? vaporL : fusionL,
    sign = index === 2 ? -1 : 1,
    target = Math.min(20000, mass * L),
    Q = sign * target * progress,
    converted = Math.abs(Q) / L,
    remaining = mass - converted,
    time = (target * progress) / 100;
  return {
    index,
    mass,
    L,
    Q,
    converted,
    remaining,
    time,
    temperature: index === 1 ? 100 : 0,
    target,
    complete: progress === 1 && target === mass * L,
    sign,
  };
}
export const heatTitles: Record<HeatKind, Pair> = {
  particles: ['零平均速度，不是零运动', 'Zero mean velocity, not zero motion'],
  internal: ['每粒平均与整袋总量', 'Per-particle mean and whole-sample total'],
  temperature: [
    '接触后，温度趋同而能量转移',
    'Contact equalizes temperature by energy transfer',
  ],
  capacity: [
    '同样吸收功率，升温不同',
    'Equal absorbed power, different warming',
  ],
  phase: ['升温、融化、再升温', 'Warm, melt, then warm again'],
  latent: ['热量符号与转变质量', 'Signed heat and converted mass'],
};
export const heatOptions: Record<HeatKind, Pair[]> = {
  particles: [
    ['4 u，300 K', '4 u, 300 K'],
    ['4 u，600 K', '4 u, 600 K'],
    ['40 u，300 K', '40 u, 300 K'],
  ],
  internal: [
    ['1 mmol，300 K', '1 mmol, 300 K'],
    ['2 mmol，300 K', '2 mmol, 300 K'],
    ['1 mmol，600 K', '1 mmol, 600 K'],
  ],
  temperature: [
    ['热容量10/10 J/K', 'Capacities 10/10 J/K'],
    ['热容量20/10 J/K', 'Capacities 20/10 J/K'],
    ['同温，热容量不同', 'Same temperature, unequal capacities'],
  ],
  capacity: [
    ['100 g水', '100 g water'],
    ['200 g水', '200 g water'],
    ['100 g指定金属', '100 g assigned metal'],
  ],
  phase: [
    ['吸收1 kJ', 'Absorb 1 kJ'],
    ['吸收18.8 kJ', 'Absorb 18.8 kJ'],
    ['吸收42 kJ', 'Absorb 42 kJ'],
  ],
  latent: [
    ['0°C冰融化', 'Ice melts at 0°C'],
    ['100°C水汽化', 'Water vaporizes at 100°C'],
    ['0°C水凝固', 'Water freezes at 0°C'],
  ],
};
export const heatLimits: Record<
  HeatKind,
  { min: number; max: number; step: number; label: Pair; unit: string }
> = {
  particles: {
    min: 150,
    max: 600,
    step: 10,
    label: ['自由绝对温度T', 'Free absolute temperature T'],
    unit: 'K',
  },
  internal: {
    min: 150,
    max: 600,
    step: 10,
    label: ['自由绝对温度T', 'Free absolute temperature T'],
    unit: 'K',
  },
  temperature: {
    min: 250,
    max: 400,
    step: 10,
    label: ['自由B初温', 'Free initial temperature B'],
    unit: 'K',
  },
  capacity: {
    min: 0,
    max: 84,
    step: 1,
    label: ['自由吸收功率P', 'Free absorbed power P'],
    unit: 'W',
  },
  phase: {
    min: 0,
    max: 50,
    step: 0.1,
    label: ['自由吸收热量Q', 'Free absorbed heat Q'],
    unit: 'kJ',
  },
  latent: {
    min: 0.05,
    max: 0.2,
    step: 0.01,
    label: ['自由总质量m', 'Free total mass m'],
    unit: 'kg',
  },
};
export function heatDefault(kind: HeatKind, index: number) {
  if (
    !heatKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid thermal case');
  return kind === 'particles' || kind === 'internal'
    ? (index === 1 && kind === 'particles') ||
      (index === 2 && kind === 'internal')
      ? 600
      : 300
    : kind === 'temperature'
      ? index === 2
        ? 350
        : 300
      : kind === 'capacity'
        ? 42
        : kind === 'phase'
          ? [1, 18.8, 42][index]!
          : 0.1;
}
export function heatParameters(
  kind: HeatKind,
  index: number,
  custom: number | null = null,
) {
  const value = custom ?? heatDefault(kind, index);
  heatDefault(kind, index);
  valid(value, heatLimits[kind].min, heatLimits[kind].max);
  const massU = kind === 'particles' && index === 2 ? 40 : 4,
    moles = kind === 'internal' && index === 1 ? 0.002 : 0.001,
    Ca = kind === 'temperature' && index !== 0 ? 20 : 10,
    Cb = 10,
    Ta = index === 2 ? 350 : 400,
    mass =
      kind === 'capacity' && index === 1
        ? 0.2
        : kind === 'latent'
          ? value
          : 0.1,
    c = kind === 'capacity' && index === 2 ? 900 : 4200,
    physicalDuration =
      kind === 'particles' || kind === 'internal'
        ? 8e-10
        : kind === 'temperature'
          ? 30
          : kind === 'capacity'
            ? 10
            : kind === 'phase'
              ? (value * 1000) / 100
              : Math.min(20000, mass * (index === 1 ? vaporL : fusionL)) / 100;
  return {
    kind,
    index,
    value,
    massU,
    moles,
    Ca,
    Cb,
    Ta,
    mass,
    c,
    physicalDuration,
  };
}
export type HeatParameters = ReturnType<typeof heatParameters>;
export function heatReading(p: HeatParameters, progress: number) {
  valid(progress, 0, 1);
  const time = progress * p.physicalDuration,
    gas =
      p.kind === 'particles' || p.kind === 'internal'
        ? gasState(p.value, p.massU, p.moles)
        : null,
    particles = gas
      ? gasParticles(p.value, p.massU, time, p.moles === 0.002 ? 2 : 1)
      : [],
    contact =
      p.kind === 'temperature'
        ? contactState(p.Ca, p.Cb, p.Ta, p.value, 1, time)
        : null,
    heating =
      p.kind === 'capacity'
        ? sensibleHeating(p.mass, p.c, p.value, time)
        : null,
    phase = p.kind === 'phase' ? iceHeating(p.value * 1000 * progress) : null,
    latent =
      p.kind === 'latent' ? latentState(p.index, p.mass, progress) : null;
  return {
    ...p,
    progress,
    time,
    gas,
    particles,
    contact,
    heating,
    phase,
    latent,
  };
}
export function heatRecord(p: HeatParameters) {
  const m = heatReading(p, 1);
  if (m.gas && p.kind === 'particles')
    return `T=${nf(m.gas.T)} K; mass=${p.massU} u; mean K=${waveNumber(m.gas.meanK)} J; thermal RMS=${nf(m.gas.rms)} m/s; sample mean velocity=0`;
  if (m.gas)
    return `T=${nf(m.gas.T)} K; mass=${p.massU} u; n=${nf(p.moles * 1000)} mmol; mean K=${waveNumber(m.gas.meanK)} J; thermal RMS=${nf(m.gas.rms)} m/s; U=${nf(m.gas.U)} J; sample mean velocity=0`;
  if (m.contact) {
    const s = m.contact;
    return `C_A/C_B=${nf(s.Ca)}/${nf(s.Cb)} J/K; t=${nf(s.time)} s; T_A/T_B=${nf(s.A)}/${nf(s.B)} K; equilibrium=${nf(s.equilibrium)} K; Q_A/Q_B=${nf(s.Qa)}/${nf(s.Qb)} J`;
  }
  if (m.heating) {
    const h = m.heating;
    return `m=${nf(h.mass)} kg; c=${h.c} J/(kg K); P_abs=${nf(h.absorbedPower)} W; t=10 s; Q=${nf(h.Q)} J; ΔT=${nf(h.rise)} K; T=${nf(h.temperature)} °C`;
  }
  if (m.phase) {
    const s = m.phase;
    return `Q=${nf(s.Q / 1000)} kJ; t=${nf(m.time)} s; T=${nf(s.temperature)} °C; ice/water=${nf(s.solid * 1000)}/${nf(s.liquid * 1000)} g; ${s.state}`;
  }
  const s = m.latent!;
  return `m=${nf(s.mass)} kg; L=${nf(s.L / 1000)} kJ/kg; Q=${nf(s.Q / 1000)} kJ; changed=${nf(s.converted * 1000)} g; remaining=${nf(s.remaining * 1000)} g; T=${s.temperature} °C; t=${nf(s.time)} s${s.complete ? '; source stopped at completion' : ''}`;
}
const base = 'https://openstax.org/books/university-physics-volume-2/pages/';
export const heatSources: Record<HeatKind, string> = {
  particles: base + '2-2-pressure-temperature-and-rms-speed',
  internal: base + '2-3-heat-capacity-and-equipartition-of-energy',
  temperature: base + '1-1-temperature-and-thermal-equilibrium',
  capacity: base + '1-4-heat-transfer-specific-heat-and-calorimetry',
  phase: base + '1-5-phase-changes',
  latent: base + '1-5-phase-changes',
};
export const heatConditions: Record<HeatKind, Pair> = {
  particles: [
    '理想单原子点粒子，质量4或40 u为教学取整，u≈1.66054×10⁻²⁷ kg。1 μm立方盒，48个代表点投影到xy；三维速度计入能量。四档指定速率与十二个对称方向，不是完整Maxwell分布；镜像对使平均速度严格为0，分量均方相同。墙碰撞弹性，未解粒子间碰撞。0.8 ns物理过程放慢为2.4秒。',
    'Ideal monatomic points; teaching masses 4/40 u, u≈1.66054×10⁻²⁷ kg. A 1 μm cube with 48 representative xy projections; energy includes 3D velocity. Four prescribed speeds and twelve symmetric directions, not a full Maxwell distribution. Mirror pairs ensure zero mean and equal component mean squares. Elastic walls, no interparticle collisions. Physical 0.8 ns is slowed to 2.4 seconds.',
  ],
  internal: [
    '固定种类的理想单原子气体，U=3nRT/2，忽略粒子间势能及整体动能。1/2 mmol用48/96代表点，不是真实粒子数；图框仅展示代表轨迹，不给整份气体指定真实体积；其速度与三维能量沿用粒子台。能量以本模型0 K外推为参考，不能套给所有物质。',
    'Same monatomic ideal gas: U=3nRT/2, with negligible interaction potential and excluded bulk kinetic energy. 1/2 mmol use 48/96 representative points, not literal counts; the frame illustrates representative trajectories, not the whole sample’s volume; 3D speed/energy follows the particle bench. Zero is an extrapolated model reference, not a formula for all materials.',
  ],
  temperature: [
    '两个固定体积理想单原子气体，热容量Ca/Cb为10或20/10 J/K且恒定。外界隔热，只有Q̇_A=G(T_B−T_A)、G=1 W/K的内部传热；无体积功，U_A=CaT_A、U_B=CbT_B。30 s窗口末端一般只趋近而非强行等温。盒内静态点只示意数量，不是轨迹。',
    'Two fixed-volume monatomic ideal gases with constant capacities 10 or 20/10 J/K. Externally insulated; internal transfer Q̇_A=G(T_B−T_A), G=1 W/K, no volume work; U_A=CaT_A and U_B=CbT_B. The 30 s endpoint generally approaches rather than forcibly snaps to equilibrium. Static dots show quantity, not trajectories.',
  ],
  capacity: [
    '均匀水或指定金属样品，初温20°C，c分别取4200或900 J/(kg K)，在本小温区恒定。P是进入样品的净吸收功率，不是电器额定功率；忽略散热、容器热容量和另计膨胀功。10 s内无相变；Q=Pt=mcΔT。',
    'Uniform water/assigned metal initially at 20°C; c=4200/900 J/(kg K), constant over this small interval. P is net absorbed sample power, not appliance rating. Heat losses, container capacity and separate expansion work are omitted. No phase change over 10 s; Q=Pt=mcΔT.',
  ],
  phase: [
    '100 g纯水体系，初始−10°C冰，名义1 atm下0°C融化；c冰=2100、c水=4200 J/(kg K)，L融=334 kJ/kg。准平衡、均温，无散热，吸收功率100 W，在指定Q处停。面积记质量比例，不模拟体积、液位或浮力。Q账分升温与相变，不宣称全部潜热仅为势能。',
    '100 g pure-water system, initially ice at −10°C, melting at 0°C under nominal 1 atm; c_ice=2100, c_water=4200 J/(kg K), L_f=334 kJ/kg. Uniform quasi-equilibrium, no losses; net absorbed 100 W stops at selected Q. Areas encode mass, not volume, level or buoyancy. The Q ledger separates warming and transition, without claiming all latent heat is potential energy alone.',
  ],
  latent: [
    '纯水名义1 atm、从相边界开始；融化/凝固L=334 kJ/kg，汽化L=2260 kJ/kg。可运动边界维持压强，转变物质留在系统内；质量图不代表真实体积。净传热±100 W，最多20 kJ，到转变完成即停，未把多余目标热量塞进平台。L是该压强下单位质量转变所需热量，汽化的膨胀功包含在过程内；本台不单独计算ΔU。',
    'Pure water at nominal 1 atm, starting at a phase boundary; L_f=334 and L_v=2260 kJ/kg. A movable boundary maintains pressure; converted matter stays in the system. Mass diagrams do not depict volumes. Net transfer ±100 W, up to 20 kJ, stopping at completion. No surplus target heat is forced into a plateau. L is transition heat per mass at that pressure; vaporization includes expansion work, and this bench does not separately calculate ΔU.',
  ],
};
