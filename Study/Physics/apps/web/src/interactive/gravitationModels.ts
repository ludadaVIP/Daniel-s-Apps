import { uniformCircle } from './circularModels';
import { nf } from './newtonModels';
import type { Pair } from './kinematicsModels';
export const gravitationKinds = [
  'pair',
  'inverse',
  'field',
  'g',
  'orbit',
  'satellite',
  'escape',
  'weightless',
] as const;
export type GravitationKind = (typeof gravitationKinds)[number];
/** Rounded classroom SI constant, not a fictional value of G. */
export const GRAVITY_G = 6.67e-11;
export const gravitationTitles: Record<GravitationKind, Pair> = {
  pair: ['两份质量，互相吸引', 'Two masses attract each other'],
  inverse: ['质量与距离的引力账', 'A gravity ledger for mass and distance'],
  field: ['同一地点，不同探测质量', 'One location, different test masses'],
  g: ['从表面高度读g', 'Read g from height above the surface'],
  orbit: ['同一出发点，不同切向初速', 'One start, different tangent speeds'],
  satellite: ['卫星与地面标记一起转', 'Satellite and ground marker rotate'],
  escape: [
    '向外走，还是永远不回来？',
    'Outward travel, or no eventual return?',
  ],
  weightless: [
    '秤不读数，引力还在吗？',
    'No scale reading: is gravity still present?',
  ],
};
export const gravitationOptions: Record<GravitationKind, Pair[]> = {
  pair: [
    ['B=1000 kg', 'B=1000 kg'],
    ['B=2000 kg', 'B=2000 kg'],
    ['B=4000 kg', 'B=4000 kg'],
  ],
  inverse: [
    ['μ=8 · r=2', 'μ=8 · r=2'],
    ['μ=16 · r=2', 'μ=16 · r=2'],
    ['μ=8 · r=4', 'μ=8 · r=4'],
  ],
  field: [
    ['m=1 · μ=8', 'm=1 · μ=8'],
    ['m=2 · μ=8', 'm=2 · μ=8'],
    ['m=1 · μ=16', 'm=1 · μ=16'],
  ],
  g: [
    ['μ=8 · h=0', 'μ=8 · h=0'],
    ['μ=16 · h=0', 'μ=16 · h=0'],
    ['μ=8 · h=1', 'μ=8 · h=1'],
  ],
  orbit: [
    ['0.85vc', '0.85vc'],
    ['vc', 'vc'],
    ['1.2vc', '1.2vc'],
  ],
  satellite: [
    ['低轨 r=1.5', 'Lower r=1.5'],
    ['同步 r=2', 'Synchronous r=2'],
    ['高轨 r=3', 'Higher r=3'],
  ],
  escape: [
    ['v₀=1.5', 'v₀=1.5'],
    ['v₀=√8', 'v₀=√8'],
    ['v₀=3.5', 'v₀=3.5'],
  ],
  weightless: [
    ['地板支撑', 'Supported floor'],
    ['共同下落', 'Shared fall'],
    ['共同绕行', 'Shared orbit'],
  ],
};
export const gravitationLimits: Record<
  GravitationKind,
  { label: Pair; min: number; max: number; step: number; unit: string }
> = {
  pair: {
    label: ['自由B质量', 'Free B mass'],
    min: 500,
    max: 4000,
    step: 500,
    unit: 'kg',
  },
  inverse: {
    label: ['自由终点距离', 'Free final distance'],
    min: 2,
    max: 4,
    step: 0.25,
    unit: 'm',
  },
  field: {
    label: ['自由探测质量', 'Free test mass'],
    min: 0.5,
    max: 3,
    step: 0.5,
    unit: 'kg',
  },
  g: {
    label: ['自由终点高度', 'Free final height'],
    min: 0,
    max: 3,
    step: 0.25,
    unit: 'm',
  },
  orbit: {
    label: ['自由初速倍数', 'Free initial-speed factor'],
    min: 0.85,
    max: 1.25,
    step: 0.05,
    unit: 'vc',
  },
  satellite: {
    label: ['自由轨道半径', 'Free orbit radius'],
    min: 1.5,
    max: 3,
    step: 0.25,
    unit: 'm',
  },
  escape: {
    label: ['自由径向初速', 'Free radial initial speed'],
    min: 1.5,
    max: 3.5,
    step: 0.25,
    unit: 'm/s',
  },
  weightless: {
    label: ['自由乘客质量', 'Free passenger mass'],
    min: 1,
    max: 4,
    step: 0.5,
    unit: 'kg',
  },
};
export const gravitationNotes: Record<GravitationKind, Pair> = {
  pair: [
    '孤立的球对：A=1000 kg，B可变，初始中心距2 m，两球半径各0.1 m，从静止释放，观察2000 s。G取6.67×10⁻¹¹ SI；无其他天体、空气或推进，球形对称，未接触。+x向右，位置绕固定质心更新，两力等大反向；不同质量的加速度不同。箭头比较方向，微牛顿力账另用共同尺度。',
    'An isolated spherical pair: A=1000 kg, variable B, initial centre separation 2 m and radii 0.1 m each. Release from rest for 2000 s. G=6.67×10⁻¹¹ in SI; no other bodies, air or thrust. Positive x points right; positions evolve around the fixed mass centre before contact. Forces are equal and opposite; accelerations need not be equal. Scene arrows show direction; the micronewton ledger has a common scale.',
  ],
  inverse: [
    '虚构小尺度球形中心体，半径1 m，μ=GM为8或16 m³/s²，探测物1 kg。由外部装置在4 s内匀速把探测物从中心距2 m移到选定终点；这不是自由落体。画出的引力不等于含支撑作用的合力。r是中心距，不是离表面高度，F=μm/r²。',
    'A fictional small-scale spherical source has radius 1 m and μ=GM of 8 or 16 m³/s²; probe mass 1 kg. An external apparatus moves the probe uniformly from centre distance 2 m to the selected endpoint in 4 s; this is not free fall. The drawn gravity is not the net force including the apparatus. r is centre separation, not surface height; F=μm/r².',
  ],
  field: [
    '中心体半径1 m，μ=8或16 m³/s²，探测位置保持中心距2 m。外部装置在4 s内逐点扫描四分之一圆弧；轨迹表示取样位置，不是自由运动。g向量由中心体与位置决定，F=mg；探测质量足够小，不改变源。取消其他作用后的自由加速度才等于此g。',
    'Source radius 1 m, μ=8 or 16 m³/s²; all samples are at centre distance 2 m. An apparatus scans a quarter-circle in 4 s. The curve records sampling locations, not free motion. The source and position determine vector g; F=mg. The small probe does not alter the source. Its free acceleration equals g only after other forces are removed.',
  ],
  g: [
    '虚构非旋转球形天体半径R=1 m，μ=8或16 m³/s²，探测质量1 kg。4 s内由装置从表面移动到指定高度，只取样外部引力。r=R+h，g=μ/(R+h)²；G不是随位置改变的g。近地小高度可近似g恒定，跨越较大半径不能。',
    'Fictional nonrotating spherical body: R=1 m, μ=8 or 16 m³/s² and test mass 1 kg. An apparatus samples external gravity from surface to chosen height over 4 s. r=R+h and g=μ/(R+h)²; universal G is not location-dependent g. Constant g is a useful small-height approximation, not a model across large radii.',
  ],
  orbit: [
    '虚构中心体R=1 m、μ=8 m³/s²，固定于原点，卫星质量忽略其反作用。初始(r,0)=(2,0) m，速度沿+y，vc=2 m/s，观察4 s。只受中心引力，椭圆按开普勒时间推进；自由倍数0.85–1.25确保近心点在表面之外。灰线只展示这4 s，不代表所有轨道都是圆。',
    'Fictional fixed source R=1 m, μ=8 m³/s²; satellite back-reaction is negligible. Start at (2,0) m with +y velocity; vc=2 m/s. Observe 4 s under central gravity alone. Ellipses advance using Kepler time; factors 0.85–1.25 keep periapsis outside the source. Grey traces cover only these 4 s, not a claim that every orbit is circular.',
  ],
  satellite: [
    '虚构中心体R=1 m，μ=8 m³/s²，以ω=1 rad/s转动。只比较无阻力、无推进的赤道正向圆轨道，速率按√(μ/r)选定；观察中心体转一圈的2π s。卫星与地面标记同周期、同方向、赤道平面时才能保持同一地面经度。本参数不是地球或真实同步卫星数据。',
    'Fictional source R=1 m, μ=8 m³/s² and rotation ω=1 rad/s. Compare only equatorial prograde circular orbits without drag/thrust, setting speed to √(μ/r). Observe one body rotation, 2π s. Equal period, direction and equatorial plane allow a fixed ground longitude. Values are not Earth or actual synchronous-satellite data.',
  ],
  escape: [
    '虚构中心体R=1 m、μ=8 m³/s²，1 kg探测物从r₀=2 m径向向外发射，之后无推进与空气。U无穷远为0，ε=v²/2−μ/r，逃逸门槛√8 m/s。最多观察8 s；若先返回表面，止于碰撞之前，不把碰撞后速度画成0。负能量即使窗口内仍向外，也最终回返；非负能量在此无遮挡径向模型中可逃逸。',
    'Fictional source R=1 m, μ=8 m³/s². A 1 kg probe launches radially outward from r₀=2 m, then has no thrust or air. Set U=0 at infinity; ε=v²/2−μ/r and escape threshold √8 m/s. Observe up to 8 s or first surface contact, stopping before impact rather than setting post-impact speed to zero. Negative energy eventually returns even if this window shows outward motion; nonnegative energy escapes in this unobstructed radial model.',
  ],
  weightless: [
    '前两例为局部匀强g=10 m/s²：静止地板支持乘客，或理想小舱与乘客一起从静止下落1 s，忽略潮汐差别，结束时尚未撞地。第三例用μ=8、r=2的共同圆轨道，g=2 m/s²，观察四分之一圈；舱与乘客理想化为同一位置的质点。秤测接触支持力N，不测所有引力；失重不等于质量或引力消失。',
    'First two cases use local uniform g=10 m/s²: a stationary floor supports the passenger, or an ideal small cabin/passenger share a 1 s fall from rest, ignoring tidal differences and ending before ground impact. Case three shares a circular orbit with μ=8, r=2 and g=2 m/s² for a quarter lap; cabin/passenger are idealized at one point. The scale measures contact normal N, not all gravity. Weightlessness does not remove mass or gravity.',
  ],
};
const valid = (n: number, min: number, max: number) => {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Outside gravitation domain');
};
const indexCheck = (i: number) => {
  if (!Number.isInteger(i) || i < 0 || i > 2)
    throw new RangeError('Invalid gravitation comparison');
};
export function gravitationDefault(kind: GravitationKind, i: number) {
  indexCheck(i);
  return {
    pair: [1000, 2000, 4000],
    inverse: [2, 2, 4],
    field: [1, 2, 1],
    g: [0, 0, 1],
    orbit: [0.85, 1, 1.2],
    satellite: [1.5, 2, 3],
    escape: [1.5, Math.sqrt(8), 3.5],
    weightless: [2, 2, 2],
  }[kind][i]!;
}
/** Isolated radial relative fall from rest; dimensional time and fixed centre of mass. */
export function attractingPair(mA: number, mB: number, elapsed: number) {
  valid(mA, 500, 4000);
  valid(mB, 500, 4000);
  valid(elapsed, 0, 2000);
  const sum = mA + mB,
    mu = GRAVITY_G * sum,
    r0 = 2,
    factor = Math.sqrt(r0 ** 3 / (2 * mu));
  let lo = 0,
    hi = Math.PI / 2;
  for (let j = 0; j < 60; j++) {
    const eta = (lo + hi) / 2;
    if (factor * (eta + Math.sin(eta) * Math.cos(eta)) < elapsed) lo = eta;
    else hi = eta;
  }
  const eta = elapsed === 0 ? 0 : (lo + hi) / 2,
    r = r0 * Math.cos(eta) ** 2,
    relativeV = -Math.sqrt(Math.max(0, 2 * mu * (1 / r - 1 / r0))),
    force = (GRAVITY_G * mA * mB) / r ** 2;
  return {
    r,
    xA: (-mB / sum) * r,
    xB: (mA / sum) * r,
    vA: (-mB / sum) * relativeV,
    vB: (mA / sum) * relativeV,
    aA: force / mA,
    aB: -force / mB,
    force,
    kinetic:
      0.5 *
      (mA * ((mB / sum) * relativeV) ** 2 + mB * ((mA / sum) * relativeV) ** 2),
    potential: (-GRAVITY_G * mA * mB) / r,
  };
}
/** Kepler ellipse with the initial tangent speed free; start is periapsis or apoapsis. */
export function ellipseOrbit(factor: number, time: number) {
  valid(factor, 0.85, 1.25);
  valid(time, 0, 4);
  const mu = 8,
    r0 = 2,
    v0 = 2 * factor,
    energy = (v0 * v0) / 2 - mu / r0,
    a = -mu / (2 * energy),
    e = Math.abs(1 - r0 / a),
    atPeri = factor >= 1,
    orientation = atPeri ? 1 : -1,
    mean = (atPeri ? 0 : Math.PI) + Math.sqrt(mu / a ** 3) * time;
  let anomaly = mean;
  for (let j = 0; j < 12; j++)
    anomaly -=
      (anomaly - e * Math.sin(anomaly) - mean) / (1 - e * Math.cos(anomaly));
  const c = Math.cos(anomaly),
    s = Math.sin(anomaly),
    b = a * Math.sqrt(1 - e * e),
    r = a * (1 - e * c),
    rate = Math.sqrt(mu / a ** 3) / (1 - e * c),
    x = orientation * a * (c - e),
    y = orientation * b * s;
  return {
    x,
    y,
    vx: -orientation * a * s * rate,
    vy: orientation * b * c * rate,
    ax: (-mu * x) / r ** 3,
    ay: (-mu * y) / r ** 3,
    r,
    a,
    e,
    energy,
    peri: a * (1 - e),
    apo: a * (1 + e),
    period: 2 * Math.PI * Math.sqrt(a ** 3 / mu),
    angularMomentum: r0 * v0,
  };
}
/** Exact radial energy trajectory: bound degenerate ellipse, parabola or hyperbola. */
export function radialLaunch(initialSpeed: number, elapsed: number) {
  valid(initialSpeed, 1.5, 3.5);
  valid(elapsed, 0, 8);
  const mu = 8,
    r0 = 2,
    energy = initialSpeed ** 2 / 2 - mu / r0;
  let r = r0,
    time = elapsed,
    duration = 8,
    v = initialSpeed,
    contact = false,
    turnRadius: number | null = null;
  if (Math.abs(energy) < 1e-10) {
    r = (r0 ** 1.5 + 1.5 * Math.sqrt(2 * mu) * time) ** (2 / 3);
    v = Math.sqrt((2 * mu) / r);
  } else if (energy < 0) {
    const a = -mu / (2 * energy),
      n = Math.sqrt(mu / a ** 3),
      start = Math.acos(1 - r0 / a),
      startM = start - Math.sin(start),
      end = 2 * Math.PI - Math.acos(1 - 1 / a),
      contactTime = (end - Math.sin(end) - startM) / n;
    duration = Math.min(8, contactTime);
    time = Math.min(elapsed, duration);
    contact = elapsed >= contactTime;
    turnRadius = 2 * a;
    const mean = startM + n * time;
    let lo = start,
      hi = end;
    for (let j = 0; j < 60; j++) {
      const anomaly = (lo + hi) / 2;
      if (anomaly - Math.sin(anomaly) < mean) lo = anomaly;
      else hi = anomaly;
    }
    const anomaly = (lo + hi) / 2;
    r = contact ? 1 : a * (1 - Math.cos(anomaly));
    v = (a * Math.sin(anomaly) * n) / (1 - Math.cos(anomaly));
  } else {
    const a = mu / (2 * energy),
      n = Math.sqrt(mu / a ** 3),
      start = Math.acosh(1 + r0 / a),
      mean = Math.sinh(start) - start + n * time;
    let lo = start,
      hi = start + 1;
    while (Math.sinh(hi) - hi < mean) hi *= 2;
    for (let j = 0; j < 60; j++) {
      const anomaly = (lo + hi) / 2;
      if (Math.sinh(anomaly) - anomaly < mean) lo = anomaly;
      else hi = anomaly;
    }
    const anomaly = (lo + hi) / 2;
    r = a * (Math.cosh(anomaly) - 1);
    v = (a * Math.sinh(anomaly) * n) / (Math.cosh(anomaly) - 1);
  }
  if (elapsed === 0) {
    r = r0;
    v = initialSpeed;
  }
  return {
    r,
    v,
    time,
    duration,
    contact,
    energy,
    turnRadius,
    acceleration: -mu / r ** 2,
    kinetic: (v * v) / 2,
    potential: -mu / r,
    escapeSpeed: Math.sqrt((2 * mu) / r0),
    asymptoticSpeed: energy > 0 ? Math.sqrt(2 * energy) : 0,
  };
}
export type GravitationReading = {
  time: number;
  duration: number;
  mu: number;
  mass: number;
  r: number;
  height: number;
  g: number;
  force: number;
  normal: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  speed: number;
  kinetic: number;
  potential: number;
  total: number;
  period: number;
  phase: Pair;
  pair: ReturnType<typeof attractingPair> | null;
  ellipse: ReturnType<typeof ellipseOrbit> | null;
  launch: ReturnType<typeof radialLaunch> | null;
  bodyAngle: number;
  relativeAngle: number;
};
export function gravitationReading(
  kind: GravitationKind,
  i: number,
  value: number,
  p: number,
): GravitationReading {
  indexCheck(i);
  valid(p, 0, 1);
  const limits = gravitationLimits[kind];
  valid(value, limits.min, limits.max);
  const r: GravitationReading = {
    time: 4 * p,
    duration: 4,
    mu: 8,
    mass: 1,
    r: 2,
    height: 1,
    g: 2,
    force: 2,
    normal: 0,
    x: 2,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    speed: 0,
    kinetic: 0,
    potential: -4,
    total: -4,
    period: 0,
    phase: ['装置取样：不是自由落体', 'Apparatus sampling: not free fall'],
    pair: null,
    ellipse: null,
    launch: null,
    bodyAngle: 0,
    relativeAngle: 0,
  };
  if (kind === 'pair') {
    const q = attractingPair(1000, value, 2000 * p);
    r.pair = q;
    r.duration = 2000;
    r.time = 2000 * p;
    r.mass = 1000;
    r.r = q.r;
    r.x = q.xA;
    r.y = 0;
    r.vx = q.vA;
    r.ax = q.aA;
    r.force = q.force;
    r.g = q.aA;
    r.mu = GRAVITY_G * value;
    r.kinetic = q.kinetic;
    r.potential = q.potential;
    r.total = q.kinetic + q.potential;
    r.phase = [
      '孤立球对：都向对方加速',
      'Isolated pair: both accelerate toward the other',
    ];
  } else if (kind === 'inverse' || kind === 'g' || kind === 'field') {
    r.mu = i === (kind === 'field' ? 2 : 1) ? 16 : 8;
    if (kind === 'inverse') {
      r.r = 2 + (value - 2) * p;
      r.x = r.r;
      r.vx = (value - 2) / 4;
    }
    if (kind === 'g') {
      r.r = 1 + value * p;
      r.x = r.r;
      r.vx = value / 4;
    }
    if (kind === 'field') {
      r.mass = value;
      const angle = (Math.PI / 2) * p;
      r.x = 2 * Math.cos(angle);
      r.y = 2 * Math.sin(angle);
      r.vx = (-Math.PI / 4) * Math.sin(angle);
      r.vy = (Math.PI / 4) * Math.cos(angle);
      r.ax = (-(Math.PI ** 2) / 32) * Math.cos(angle);
      r.ay = (-(Math.PI ** 2) / 32) * Math.sin(angle);
    }
    r.g = r.mu / r.r ** 2;
    r.force = r.mass * r.g;
    r.height = r.r - 1;
    r.kinetic = (r.mass * (r.vx * r.vx + r.vy * r.vy)) / 2;
    r.potential = (-r.mu * r.mass) / r.r;
    r.total = r.kinetic + r.potential;
  } else if (kind === 'orbit') {
    const q = ellipseOrbit(value, r.time);
    r.ellipse = q;
    Object.assign(r, {
      x: q.x,
      y: q.y,
      vx: q.vx,
      vy: q.vy,
      ax: q.ax,
      ay: q.ay,
      r: q.r,
      g: 8 / q.r ** 2,
      force: 8 / q.r ** 2,
      kinetic: (q.vx * q.vx + q.vy * q.vy) / 2,
      potential: -8 / q.r,
      total: q.energy,
      period: q.period,
    });
    r.phase =
      value === 1
        ? ['圆轨道：切向初速恰好', 'Circular orbit: matching tangent speed']
        : [
            '椭圆轨道：速度与高度互换',
            'Elliptical orbit: speed trades with height',
          ];
  } else if (kind === 'satellite') {
    r.r = value;
    r.duration = 2 * Math.PI;
    r.time = r.duration * p;
    const q = uniformCircle(r.r, Math.sqrt(8 / r.r), r.time);
    Object.assign(r, q);
    r.g = q.ac;
    r.force = q.force;
    r.bodyAngle = r.time;
    r.relativeAngle = r.time * (Math.sqrt(8 / r.r ** 3) - 1);
    r.kinetic = 4 / r.r;
    r.potential = -8 / r.r;
    r.total = -4 / r.r;
    r.phase =
      r.r === 2
        ? ['与地面标记保持同一经度', 'Same longitude as the ground marker']
        : ['与地面标记相对移动', 'Moving relative to the ground marker'];
  } else if (kind === 'escape') {
    const end = radialLaunch(value, 8),
      q = radialLaunch(value, end.duration * p);
    r.launch = q;
    r.duration = end.duration;
    r.time = q.time;
    r.r = q.r;
    r.x = q.r;
    r.vx = q.v;
    r.ax = q.acceleration;
    r.g = -q.acceleration;
    r.force = r.g;
    r.kinetic = q.kinetic;
    r.potential = q.potential;
    r.total = q.kinetic + q.potential;
    r.phase = q.contact
      ? ['回到表面：止于碰撞前', 'Returned to surface: before impact']
      : q.energy < -1e-10
        ? ['负能量：最终回返', 'Negative energy: eventual return']
        : Math.abs(q.energy) < 1e-10
          ? [
              '临界逃逸：远处速率趋近0',
              'Threshold escape: speed tends to zero far away',
            ]
          : [
              '超临界逃逸：远处仍有速率',
              'Above threshold: speed remains far away',
            ];
  } else {
    r.mass = value;
    if (i < 2) {
      r.duration = 1;
      r.time = p;
      r.g = 10;
      r.force = 10 * value;
      r.normal = i === 0 ? r.force : 0;
      r.x = 0;
      r.y = i === 0 ? 10 : 10 - 5 * p * p;
      r.vy = i === 0 ? 0 : -10 * p;
      r.ay = i === 0 ? 0 : -10;
      r.kinetic = (value * r.vy * r.vy) / 2;
      r.potential = 10 * value * r.y;
      r.total = r.kinetic + r.potential;
    } else {
      r.duration = Math.PI / 2;
      r.time = r.duration * p;
      const q = uniformCircle(2, 2, r.time, value);
      Object.assign(r, q);
      r.g = 2;
      r.force = 2 * value;
      r.kinetic = 2 * value;
      r.potential = -4 * value;
      r.total = -2 * value;
    }
    r.phase =
      i === 0
        ? ['秤有支持力：静止', 'Scale supplies support: stationary']
        : ['共同自由落体：秤支持力0', 'Shared free fall: scale normal zero'];
  }
  r.speed = Math.hypot(r.vx, r.vy);
  return r;
}
export const gravitationNumber = (n: number) =>
  n !== 0 && Math.abs(n) < 0.0001 ? n.toExponential(3) : nf(n);
export function gravitationRecord(kind: GravitationKind, i: number) {
  const m = gravitationReading(kind, i, gravitationDefault(kind, i), 1);
  const base = `t=${nf(m.time)} s; r=${nf(m.r)} m; Fg=${gravitationNumber(m.force)} N; g=${gravitationNumber(m.g)} m/s²`;
  return kind === 'pair'
    ? `${base}; FA=+${gravitationNumber(m.force)} N; FB=−${gravitationNumber(m.force)} N; aA=${gravitationNumber(m.pair!.aA)}; aB=${gravitationNumber(m.pair!.aB)} m/s²; P=0`
    : kind === 'weightless'
      ? `t=${nf(m.time)} s; m=${nf(m.mass)} kg; Fg=${nf(m.force)} N; N=${nf(m.normal)} N; a=${nf(Math.hypot(m.ax, m.ay))} m/s²`
      : kind === 'escape'
        ? `${base}; v=${nf(m.vx)} m/s; K=${nf(m.kinetic)} J; U=${nf(m.potential)} J; E=${nf(m.total)} J`
        : kind === 'orbit' || kind === 'satellite'
          ? `${base}; v=${nf(m.speed)} m/s; T=${nf(m.period)} s; E=${nf(m.total)} J`
          : base;
}
