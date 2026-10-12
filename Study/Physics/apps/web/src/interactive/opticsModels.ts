import { pointOnPath, type Point } from './lightModels';
import { nf } from './newtonModels';
import { waveNumber } from './waveModels';
export type OpticsKind =
  | 'reflection'
  | 'mirror'
  | 'refraction'
  | 'snell'
  | 'index'
  | 'critical'
  | 'fibre';
export type Pair = [string, string];
export const opticsKinds: OpticsKind[] = [
  'reflection',
  'mirror',
  'refraction',
  'snell',
  'index',
  'critical',
  'fibre',
];
export const lightSpeed = 299792458;
const radians = (a: number) => (a * Math.PI) / 180,
  degrees = (a: number) => (a * 180) / Math.PI;
function valid(v: number, min: number, max: number) {
  if (!Number.isFinite(v) || v < min || v > max)
    throw new RangeError('Outside geometric optics model');
  return v;
}
export const opticsTitles: Record<OpticsKind, Pair> = {
  reflection: ['转动镜子，跟住反射方向', 'Turn the mirror; follow reflection'],
  mirror: ['真实光路与向后的延长线', 'Real rays and backward extensions'],
  refraction: [
    '换介质，比较法线两侧',
    'Change medium; compare from the normal',
  ],
  snell: ['用正弦比检验折射规律', 'Test refraction with sine ratios'],
  index: [
    '同一节奏，不同波速与波长',
    'Same frequency; different speed and wavelength',
  ],
  critical: [
    '临界、掠射与全反射',
    'Critical angle, grazing and total reflection',
  ],
  fibre: [
    '芯与包层，不是银色镜壁',
    'Core and cladding, not silver mirror walls',
  ],
};
export const criticalAngle = degrees(Math.asin(1 / 1.5));
export const fibreAngle = 90 - degrees(Math.asin(1.45 / 1.5));
export const opticsOptions: Record<OpticsKind, Pair[]> = {
  reflection: [
    ['入射基准0°', 'Base incidence 0°'],
    ['入射基准30°', 'Base incidence 30°'],
    ['入射基准60°', 'Base incidence 60°'],
  ],
  mirror: [
    ['物距0.5 m', 'Object 0.5 m'],
    ['物距1 m', 'Object 1 m'],
    ['物距1.5 m', 'Object 1.5 m'],
  ],
  refraction: [
    ['空气→玻璃', 'Air → glass'],
    ['玻璃→空气', 'Glass → air'],
    ['空气→水', 'Air → water'],
  ],
  snell: [
    ['n₂=1.333', 'n₂=1.333'],
    ['n₂=1.5', 'n₂=1.5'],
    ['n₂=2', 'n₂=2'],
  ],
  index: [
    ['n=1', 'n=1'],
    ['n=1.333', 'n=1.333'],
    ['n=1.5', 'n=1.5'],
  ],
  critical: [
    ['入射30°', 'Incidence 30°'],
    ['精确临界角', 'Exact critical angle'],
    ['入射60°', 'Incidence 60°'],
  ],
  fibre: [
    ['轴向0°', 'Axial angle 0°'],
    ['轴向12°', 'Axial angle 12°'],
    ['轴向30°', 'Axial angle 30°'],
  ],
};
export const opticsLimits: Record<
  OpticsKind,
  { min: number; max: number; step: number | 'any'; label: Pair; unit: string }
> = {
  reflection: {
    min: -10,
    max: 10,
    step: 1,
    label: ['自由镜面转角φ', 'Free mirror rotation φ'],
    unit: '°',
  },
  mirror: {
    min: -0.5,
    max: 0.5,
    step: 0.1,
    label: ['自由观察点高度y', 'Free observer height y'],
    unit: 'm',
  },
  refraction: {
    min: 0,
    max: 40,
    step: 5,
    label: ['自由入射角i', 'Free incidence angle i'],
    unit: '°',
  },
  snell: {
    min: 0,
    max: 65,
    step: 5,
    label: ['自由入射角i', 'Free incidence angle i'],
    unit: '°',
  },
  index: {
    min: 0.1,
    max: 1,
    step: 0.1,
    label: ['自由介质长度L', 'Free medium length L'],
    unit: 'm',
  },
  critical: {
    min: 0,
    max: 70,
    step: 'any',
    label: ['自由入射角i', 'Free incidence angle i'],
    unit: '°',
  },
  fibre: {
    min: 0,
    max: 40,
    step: 1,
    label: ['自由芯内轴向角α', 'Free internal axial angle α'],
    unit: '°',
  },
};
export function opticsDefault(kind: OpticsKind, index: number) {
  if (
    !opticsKinds.includes(kind) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2
  )
    throw new RangeError('Invalid optical case');
  return kind === 'reflection' || kind === 'mirror'
    ? 0
    : kind === 'refraction'
      ? 30
      : kind === 'snell'
        ? 45
        : kind === 'index'
          ? 0.3
          : kind === 'critical'
            ? [30, criticalAngle, 60][index]!
            : [0, 12, 30][index]!;
}
export function lightInterface(n1: number, n2: number, incidence: number) {
  valid(n1, 1, 3);
  valid(n2, 1, 3);
  valid(incidence, 0, 90);
  const i = radians(incidence),
    s = (n1 / n2) * Math.sin(i),
    critical = n1 > n2 ? degrees(Math.asin(n2 / n1)) : null;
  const state =
    n1 > n2 && s > 1 + 1e-12
      ? 'total'
      : n1 > n2 && Math.abs(s - 1) <= 1e-12
        ? 'critical'
        : 'transmitted';
  const transmitted =
      state === 'total' ? null : degrees(Math.asin(Math.min(1, s))),
    ci = Math.cos(i),
    ct = transmitted === null ? 0 : Math.cos(radians(transmitted));
  const rs = n1 === n2 ? 0 : (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct),
    rp = n1 === n2 ? 0 : (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct),
    Rs = state === 'total' || state === 'critical' ? 1 : rs * rs,
    Rp = state === 'total' || state === 'critical' ? 1 : rp * rp,
    R = (Rs + Rp) / 2;
  return {
    n1,
    n2,
    incidence,
    transmitted,
    critical,
    state,
    R,
    Rs,
    Rp,
    T: 1 - R,
    sinIncident: Math.sin(i),
    sinTransmitted:
      transmitted === null ? null : Math.sin(radians(transmitted)),
    speed1: lightSpeed / n1,
    speed2: lightSpeed / n2,
  };
}
export function reflectedDirection(base: number, rotation: number) {
  valid(base, 0, 60);
  valid(rotation, -10, 10);
  const incident = { x: Math.sin(radians(base)), y: -Math.cos(radians(base)) },
    normal = { x: Math.sin(radians(rotation)), y: Math.cos(radians(rotation)) },
    dot = incident.x * normal.x + incident.y * normal.y;
  const reflected = {
    x: incident.x - 2 * dot * normal.x,
    y: incident.y - 2 * dot * normal.y,
  };
  return {
    incident,
    normal,
    reflected,
    incidence: degrees(Math.acos(Math.min(1, -dot))),
    bearing: degrees(Math.atan2(reflected.x, reflected.y)),
  };
}
export type OpticalSegment = {
  from: Point;
  to: Point;
  n: number;
  power: number;
  startNS: number;
  endNS: number;
};
const segment = (
  from: Point,
  to: Point,
  n: number,
  power: number,
  startNS: number,
  metres = 1,
): OpticalSegment => ({
  from,
  to,
  n,
  power,
  startNS,
  endNS:
    startNS +
    ((Math.hypot(to.x - from.x, to.y - from.y) * metres * n) / lightSpeed) *
      1e9,
});
export function mirrorRays(distance: number, observerY: number) {
  valid(distance, 0.5, 1.5);
  valid(observerY, -0.5, 0.5);
  const object = { x: -distance, y: 0.4 },
    image = { x: distance, y: 0.4 };
  const rays = [observerY, observerY + 0.2].map((y) => {
    const eye = { x: -1.8, y },
      q = { x: 0, y: y + ((0.4 - y) * 1.8) / (distance + 1.8) },
      first = segment(object, q, 1, 1, 0),
      second = segment(q, eye, 1, 1, first.endNS);
    return { eye, q, path: [first, second], arrivalNS: second.endNS };
  });
  return { object, image, rays };
}
export function fibreRay(alpha: number) {
  valid(alpha, 0, 40);
  const L = 4,
    h = 0.6,
    n1 = 1.5,
    n2 = 1.45,
    angle = radians(alpha),
    interfaceReading = alpha === 0 ? null : lightInterface(n1, n2, 90 - alpha),
    R = interfaceReading?.R ?? 1,
    core: OpticalSegment[] = [],
    leaks: OpticalSegment[] = [],
    events: {
      x: number;
      y: number;
      timeNS: number;
      incidentPower: number;
      R: number;
    }[] = [];
  let x = 0,
    y = 0,
    sign = 1,
    power = 1,
    time = 0;
  for (let j = 0; j < 100; j++) {
    const toY = (sign * h) / 2,
      nextX = alpha === 0 ? Infinity : x + (toY - y) / (sign * Math.tan(angle));
    if (nextX >= L - 1e-12) {
      const end = { x: L, y: y + (L - x) * sign * Math.tan(angle) },
        s = segment({ x, y }, end, n1, power, time, 0.01);
      core.push(s);
      time = s.endNS;
      break;
    }
    const q = { x: nextX, y: toY },
      s = segment({ x, y }, q, n1, power, time, 0.01);
    core.push(s);
    time = s.endNS;
    const nextPower = interfaceReading
      ? 0.5 * interfaceReading.Rs ** (events.length + 1) +
        0.5 * interfaceReading.Rp ** (events.length + 1)
      : power;
    events.push({
      ...q,
      timeNS: time,
      incidentPower: power,
      R: power === 0 ? 0 : nextPower / power,
    });
    if (interfaceReading!.T > 0) {
      const tilt = Math.PI / 2 - radians(interfaceReading!.transmitted!),
        dx = Math.min(L - q.x, (0.9 - Math.abs(q.y)) / Math.tan(tilt)),
        end = { x: q.x + dx, y: q.y + sign * dx * Math.tan(tilt) };
      leaks.push(segment(q, end, n2, power - nextPower, time, 0.01));
    }
    x = q.x;
    y = q.y;
    sign = -sign;
    power = nextPower;
  }
  return {
    alpha,
    L,
    h,
    n1,
    n2,
    R,
    T: 1 - R,
    interfaceReading,
    core,
    leaks,
    events,
    retained: power,
    escaped: 1 - power,
    durationNS: time,
    criticalAxial: fibreAngle,
  };
}
export function opticalCursor(path: OpticalSegment[], timeNS: number) {
  valid(timeNS, 0, 100);
  if (!path.length) throw new RangeError('Empty optical path');
  if (timeNS < path[0]!.startNS) return null;
  const s = path.find((s) => timeNS <= s.endNS) || path[path.length - 1]!;
  const fraction = Math.min(
    1,
    Math.max(0, (timeNS - s.startNS) / (s.endNS - s.startNS)),
  );
  return {
    ...pointOnPath([s.from, s.to], fraction),
    power: s.power,
    arrived: timeNS >= path[path.length - 1]!.endNS,
  };
}
export function opticsParameters(
  kind: OpticsKind,
  index: number,
  custom: number | null = null,
) {
  const value = custom ?? opticsDefault(kind, index);
  opticsDefault(kind, index);
  const lim = opticsLimits[kind];
  valid(value, lim.min, lim.max);
  const n1 =
      (kind === 'refraction' && index === 1) || kind === 'critical' ? 1.5 : 1,
    n2 =
      kind === 'refraction'
        ? [1.5, 1, 1.333][index]!
        : kind === 'snell'
          ? [1.333, 1.5, 2][index]!
          : kind === 'index'
            ? [1, 1.333, 1.5][index]!
            : kind === 'critical'
              ? 1
              : 1;
  const incidence =
      kind === 'refraction' || kind === 'snell' || kind === 'critical'
        ? value
        : 0,
    interfaceReading =
      kind === 'refraction' || kind === 'snell' || kind === 'critical'
        ? lightInterface(n1, n2, incidence)
        : null,
    reflection =
      kind === 'reflection'
        ? reflectedDirection([0, 30, 60][index]!, value)
        : null,
    mirror =
      kind === 'mirror' ? mirrorRays([0.5, 1, 1.5][index]!, value) : null,
    fibre = kind === 'fibre' ? fibreRay(value) : null;
  let paths: OpticalSegment[][] = [];
  if (reflection) {
    const source = {
        x: -1.3 * reflection.incident.x,
        y: -1.3 * reflection.incident.y,
      },
      first = segment(source, { x: 0, y: 0 }, 1, 1, 0);
    paths = [
      [
        first,
        segment(
          { x: 0, y: 0 },
          { x: 1.3 * reflection.reflected.x, y: 1.3 * reflection.reflected.y },
          1,
          1,
          first.endNS,
        ),
      ],
    ];
  } else if (mirror) paths = mirror.rays.map((r) => r.path);
  else if (kind === 'index') {
    const first = segment({ x: -0.3, y: 0 }, { x: 0, y: 0 }, 1, 1, 0),
      second = segment({ x: 0, y: 0 }, { x: value, y: 0 }, n2, 1, first.endNS),
      third = segment({ x: value, y: 0 }, { x: 1.3, y: 0 }, 1, 1, second.endNS);
    paths = [[first, second, third]];
  } else if (fibre) paths = [fibre.core, ...fibre.leaks.map((s) => [s])];
  else if (interfaceReading) {
    const first = segment(
      {
        x: -1.3 * Math.sin(radians(incidence)),
        y: 1.3 * Math.cos(radians(incidence)),
      },
      { x: 0, y: 0 },
      n1,
      1,
      0,
    );
    if (kind === 'critical') {
      paths.push([
        first,
        segment(
          { x: 0, y: 0 },
          {
            x: 1.3 * Math.sin(radians(incidence)),
            y: 1.3 * Math.cos(radians(incidence)),
          },
          n1,
          interfaceReading.R,
          first.endNS,
        ),
      ]);
    }
    if (interfaceReading.state === 'transmitted') {
      paths.push([
        first,
        segment(
          { x: 0, y: 0 },
          {
            x: 1.3 * Math.sin(radians(interfaceReading.transmitted!)),
            y: -1.3 * Math.cos(radians(interfaceReading.transmitted!)),
          },
          n2,
          kind === 'critical' ? interfaceReading.T : 1,
          first.endNS,
        ),
      ]);
    }
  }
  const durationNS =
    fibre?.durationNS ??
    Math.max(...paths.map((path) => path[path.length - 1]!.endNS));
  return {
    kind,
    index,
    value,
    n1,
    n2,
    incidence,
    interfaceReading,
    reflection,
    mirror,
    fibre,
    paths,
    durationNS,
  };
}
export type OpticsParameters = ReturnType<typeof opticsParameters>;
export function opticsReading(p: OpticsParameters, progress: number) {
  valid(progress, 0, 1);
  const timeNS = progress * p.durationNS,
    bounces =
      p.fibre?.events.filter((e) => e.timeNS <= timeNS + 1e-12).length ?? 0;
  return {
    ...p,
    timeNS,
    cursors: p.paths.map((path) => opticalCursor(path, timeNS)),
    bounces,
    retained:
      p.fibre?.interfaceReading?.Rs !== undefined
        ? 0.5 *
          (p.fibre.interfaceReading.Rs ** bounces +
            p.fibre.interfaceReading.Rp ** bounces)
        : 1,
    escaped:
      p.fibre?.interfaceReading?.Rs !== undefined
        ? 1 -
          0.5 *
            (p.fibre.interfaceReading.Rs ** bounces +
              p.fibre.interfaceReading.Rp ** bounces)
        : 0,
    frequency: lightSpeed / 600e-9,
    wavelengthNM: 600 / p.n2,
    inferredIndex:
      p.interfaceReading &&
      p.interfaceReading.sinIncident > 1e-12 &&
      p.interfaceReading.sinTransmitted !== null
        ? (p.n1 * p.interfaceReading.sinIncident) /
          p.interfaceReading.sinTransmitted
        : null,
    slabTransitNS:
      p.kind === 'index' ? ((p.value * p.n2) / lightSpeed) * 1e9 : null,
    extraDelayNS:
      p.kind === 'index' ? ((p.value * (p.n2 - 1)) / lightSpeed) * 1e9 : null,
  };
}
export function opticsRecord(p: OpticsParameters) {
  const m = opticsReading(p, 1);
  if (p.kind === 'reflection')
    return (
      'φ=' +
      nf(p.value) +
      '°; i=r=' +
      nf(p.reflection!.incidence) +
      '°; outgoing bearing=' +
      nf(p.reflection!.bearing) +
      '°; path=' +
      nf(p.durationNS) +
      ' ns'
    );
  if (p.mirror)
    return (
      'd=' +
      nf(-p.mirror.object.x) +
      ' m; image d=' +
      nf(p.mirror.image.x) +
      ' m; observer y=' +
      nf(p.value) +
      ' m; arrival=' +
      nf(p.mirror.rays[0]!.arrivalNS) +
      ' ns; image is virtual'
    );
  if (p.kind === 'index')
    return (
      'n=' +
      nf(p.n2) +
      '; v=' +
      waveNumber(lightSpeed / p.n2) +
      ' m/s; λ=' +
      nf(m.wavelengthNM) +
      ' nm; L=' +
      nf(p.value) +
      ' m; slab time=' +
      nf(m.slabTransitNS!) +
      ' ns; extra=' +
      nf(m.extraDelayNS!) +
      ' ns'
    );
  if (p.fibre)
    return (
      'α=' +
      nf(p.value) +
      '°; n_core=1.5; n_clad=1.45; side hits=' +
      m.bounces +
      '; core exit=' +
      waveNumber(m.retained) +
      '; escaped=' +
      nf(m.escaped) +
      '; α_limit=' +
      nf(fibreAngle) +
      '°'
    );
  const v = p.interfaceReading!;
  return (
    'n₁=' +
    v.n1 +
    '; n₂=' +
    v.n2 +
    '; i=' +
    nf(v.incidence) +
    '°; r=' +
    (v.transmitted === null ? 'no propagating ray' : nf(v.transmitted) + '°') +
    '; ' +
    v.state +
    (p.kind === 'critical'
      ? '; R=' + nf(v.R) + '; T=' + nf(v.T)
      : '; inferred n₂=' +
        (m.inferredIndex === null
          ? 'undefined at normal incidence'
          : nf(m.inferredIndex)))
  );
}
export const opticsConditions: Record<OpticsKind, Pair> = {
  reflection: [
    '理想平面镜，固定入射方向，镜面法线转φ；单位向量反射v_r=v_i−2(v_i·n)n。角均从当前法线量。镜前/后各1.3 m，空间尺85 px/m。光标按真空c₀=299792458 m/s行进，再放慢到2.4秒；不是光子的拍摄。镜子转φ时出射方位转2φ。忽略吸收、表面粗糙和衍射。',
    'Ideal plane mirror, held incoming direction, normal rotation φ and vector reflection v_r=v_i−2(v_i·n)n. Angles use the current normal. Each segment is 1.3 m, equal spatial scale 85 px/m. Cursor travel uses c₀=299792458 m/s and is slowed to 2.4 seconds, not a photographed photon. Outgoing bearing rotates by 2φ. No loss, roughness or diffraction.',
  ],
  mirror: [
    '竖直平面镜x=0、y∈[−0.9,0.9] m。物点(−d,0.4)，虚像(d,0.4)，观察点x=−1.8、y与y+0.2。反射点由观察点到虚像连线与镜面的交点构造；全部交点在镜面内。实线O→镜→观察点，虚线只是向后的方向延长，不传光；两组观察点共享同一像。空间尺90 px/m；时间按真实路径/c₀计算。',
    'Vertical mirror x=0, y∈[−0.9,0.9] m. Object (−d,0.4), virtual image (d,0.4), observers x=−1.8 at y and y+0.2. Mirror intersections follow observer/image lines and stay within the mirror. Solid paths object→mirror→observer carry light; backward dashed extensions do not. Both observers locate one image. Equal scale 90 px/m, travel time real path/c₀.',
  ],
  refraction: [
    '单个平面界面、均匀无损且无色散的介质；n₁sin i=n₂sin r，v=c₀/n。三组n为1→1.5、1.5→1、1→1.333；i≤40°，均存在透射方向。仅追踪透射方向，忽略反射分支，不用线条亮度推断透射能量。界面前后各1.3 m，85 px/m；光标按各段n·路程/c₀推进。光线近似忽略波动衍射，动画2.4秒。',
    'One planar boundary in uniform lossless nondispersive media: n₁sin i=n₂sin r, v=c₀/n. Cases 1→1.5, 1.5→1 and 1→1.333 with i≤40°, all transmitting. Only the transmitted direction is traced; omitted reflection means brightness cannot indicate transmitted energy. Each segment 1.3 m, scale 85 px/m; cursor uses each segment n·distance/c₀. Geometric approximation omits diffraction and plays over 2.4 seconds.',
  ],
  snell: [
    '空气n₁=1进入n₂=1.333/1.5/2，入射角0–65°。每组固定n，比较sin r对sin i的斜率1/n₂。由已知n₁与两角反推n₂；i=r=0时0/0不定义，不能仅靠垂直入射角推断折射率。只画透射方向，忽略反射能量；600 nm真空波长在各组对应同一源频率，假定无色散。',
    'Air n₁=1 into n₂=1.333/1.5/2, incidence 0–65°. At held n, sin r versus sin i has slope 1/n₂. Infer n₂ using known n₁ and both angles; i=r=0 gives undefined 0/0 and cannot identify n from direction alone. Transmitted direction only, no reflection-energy inference. Vacuum wavelength 600 nm corresponds to one source frequency; no dispersion.',
  ],
  index: [
    '固定真空波长600 nm、频率c₀/λ₀；法向穿过长度L的无色散均匀材料n=1/1.333/1.5，前后空气段分别0.3 m、1.3−L m。v=c₀/n、λ=λ₀/n、材料段时长nL/c₀，额外延迟(n−1)L/c₀。图中光路用米，波长条用纳米，两种尺不同。理想化忽略界面反射、吸收和建立过程；无色散条件下脉冲/相速度相同。',
    'Fixed vacuum wavelength 600 nm and f=c₀/λ₀. Normal passage through length L of nondispersive material n=1/1.333/1.5; air segments 0.3 m and 1.3−L m. v=c₀/n, λ=λ₀/n, slab time nL/c₀, extra delay (n−1)L/c₀. Ray diagram uses metres; wavelength bars use nanometres with a separate scale. Idealized no boundary reflection, loss or build-up; nondispersive phase/pulse speeds coincide.',
  ],
  critical: [
    '无损非磁平面界面n₁=1.5→n₂=1；θ_c=asin(n₂/n₁)。i<θ_c有透射，i=θ_c是r=90°掠射极限，i>θ_c才称全反射。功率R为无偏振Fresnel两种偏振反射率的平均，T=1−R；临界点法向透射功率趋于0。临界方向用虚线而不画带能量的掠射脉冲；全反射的倏逝场、相位、穿隧不在本光线模型中。',
    'Lossless nonmagnetic plane interface n₁=1.5→n₂=1; θ_c=asin(n₂/n₁). Below: transmission. Equality: grazing r=90° limit. Above: total internal reflection. Unpolarized power R averages both Fresnel polarization reflectances; T=1−R, normal transmitted power tends to zero at criticality. The grazing construction is dashed without an energy-carrying transmitted cursor. Evanescent fields, phase and tunnelling are outside this ray model.',
  ],
  fibre: [
    '直的二维光导芯截面，芯n=1.5、包层n=1.45，长4 cm、厚0.6 cm，示意参数不是实际光纤直径；尺125 px/cm。已在芯内从中线发出，α从轴量，壁入射角i=90°−α。内部轴向全反射条件α<90°−asin(n_clad/n_core)≈14.835°，不是外部入射接受角。各次侧壁分别追踪s/p偏振的Fresnel能量，初始各占一半，反射后不重新设成等权；忽略干涉/吸收/弯曲，芯末端开口不反射。包层光线裁在观察窗口±0.9 cm，裁切不等于吸收；动画按各段折射率的光行时间。',
    'Straight 2D guide core, n=1.5, cladding n=1.45, 4 cm long and 0.6 cm thick: schematic dimensions, not a real fibre diameter. Equal scale 125 px/cm. Already injected at the core midline, α from axis, wall incidence i=90°−α. Internal axial TIR requires α<90°−asin(n_clad/n_core)≈14.835°, not an external acceptance angle. Track s/p Fresnel energy separately, initially half each; repeated reflections do not reset their weights; no interference, absorption or bending; the open core end has no reflection. Cladding paths are clipped at ±0.9 cm, not absorbed there. Cursor timing uses each segment’s refractive index.',
  ],
};
export const opticsSources: Record<OpticsKind, string> = {
  reflection:
    'https://openstax.org/books/university-physics-volume-3/pages/1-2-the-law-of-reflection',
  mirror:
    'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors',
  refraction:
    'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
  snell:
    'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
  index:
    'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
  critical:
    'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection',
  fibre:
    'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection',
};
