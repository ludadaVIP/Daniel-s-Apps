import { kineticEnergy } from './energyModels';
import { nf } from './newtonModels';
import type { Pair } from './kinematicsModels';
export type CircularKind =
  'path' | 'tangent' | 'acceleration' | 'force' | 'turning' | 'orbit' | 'loop';
export const circularKinds: CircularKind[] = [
  'path',
  'tangent',
  'acceleration',
  'force',
  'turning',
  'orbit',
  'loop',
];
export const circularTitles: Record<CircularKind, Pair> = {
  path: ['绕一圈：路程、周期与频率', 'One lap: distance, period and frequency'],
  tangent: ['放开以后，沿哪个方向？', 'Which direction after release?'],
  acceleration: ['速率不变，速度却在变', 'Constant speed, changing velocity'],
  force: [
    '向内的合力，究竟来自谁？',
    'Which interaction supplies the inward net force?',
  ],
  turning: ['同一弯道，可用横向力的界限', 'One bend, limited lateral force'],
  orbit: [
    '卫星：引力不断改变方向',
    'Satellite: gravity keeps changing direction',
  ],
  loop: [
    '环形轨道：能量够，接触也够吗？',
    'Vertical loop: enough energy and contact?',
  ],
};
export const circularOptions: Record<CircularKind, Pair[]> = {
  path: [
    ['r=1 · v=1', 'r=1 · v=1'],
    ['r=2 · v=1', 'r=2 · v=1'],
    ['r=2 · v=2', 'r=2 · v=2'],
  ],
  tangent: [
    ['逆时针', 'Anticlockwise'],
    ['顺时针', 'Clockwise'],
    ['四分之一圈时放开', 'Release at a quarter lap'],
  ],
  acceleration: [
    ['r=2 · v=1', 'r=2 · v=1'],
    ['r=2 · v=2', 'r=2 · v=2'],
    ['r=1 · v=2', 'r=1 · v=2'],
  ],
  force: [
    ['m=1 · r=2', 'm=1 · r=2'],
    ['m=2 · r=2', 'm=2 · r=2'],
    ['m=1 · r=1', 'm=1 · r=1'],
  ],
  turning: [
    ['r=2 · v=2', 'r=2 · v=2'],
    ['r=2 · v=3', 'r=2 · v=3'],
    ['r=1 · v=2', 'r=1 · v=2'],
  ],
  orbit: [
    ['m=1 · r=2', 'm=1 · r=2'],
    ['m=2 · r=2', 'm=2 · r=2'],
    ['m=1 · r=4', 'm=1 · r=4'],
  ],
  loop: [
    ['底端K=20 J', 'Bottom K=20 J'],
    ['底端K=25 J', 'Bottom K=25 J'],
    ['底端K=30 J', 'Bottom K=30 J'],
  ],
};
export const circularLimits = {
  path: {
    label: ['自由半径', 'Free radius'] as Pair,
    min: 0.75,
    max: 2.5,
    step: 0.25,
    unit: 'm',
  },
  tangent: {
    label: ['自由速率', 'Free speed'] as Pair,
    min: 0.5,
    max: 1.5,
    step: 0.25,
    unit: 'm/s',
  },
  acceleration: {
    label: ['自由速率', 'Free speed'] as Pair,
    min: 0.5,
    max: 3,
    step: 0.5,
    unit: 'm/s',
  },
  force: {
    label: ['自由质量', 'Free mass'] as Pair,
    min: 0.5,
    max: 3,
    step: 0.5,
    unit: 'kg',
  },
  turning: {
    label: ['自由初速', 'Free initial speed'] as Pair,
    min: 1,
    max: 3.5,
    step: 0.5,
    unit: 'm/s',
  },
  orbit: {
    label: ['自由轨道半径', 'Free orbital radius'] as Pair,
    min: 2,
    max: 4,
    step: 0.5,
    unit: 'm',
  },
  loop: {
    label: ['自由底端动能', 'Free bottom kinetic energy'] as Pair,
    min: 18,
    max: 36,
    step: 1,
    unit: 'J',
  },
};
export const circularNotes: Record<CircularKind, Pair> = {
  path: [
    '水平质点做规定的匀速圆周运动，长度m、速率m/s；固定观察2π s，不是每次都一圈。T=2πr/v、f=1/T。路程累计，位移从共同起点指向当前位置。',
    'A point follows prescribed uniform circular motion in metres and m/s. The fixed observation window is 2π s, not always one lap. T=2πr/v and f=1/T. Distance accumulates; displacement runs from the shared start to the current point.',
  ],
  tangent: [
    '光滑水平桌面，r=2 m、m=1 kg；重力与支持力抵消。观察半圈所需时长；第三次在四分之一圈时撤去绳拉力，此后合力0、沿当时切线匀速走。场景中的速度/加速度箭头只比方向，分量图另有共同量尺。',
    'Smooth horizontal table, r=2 m and m=1 kg; gravity and support cancel. Observe a half-lap time. In case three, remove tension at a quarter lap; net force becomes zero and motion continues uniformly along that instant’s tangent. Scene velocity/acceleration arrows compare direction only; the component diagram uses a common scale.',
  ],
  acceleration: [
    '匀速圆周运动观察四分之一圈。瞬时加速度朝当前圆心，大小v²/r；从起点到当前时刻的平均加速度为Δv/Δt，两者不必相等。Δt=0时图用极限值；速率不变不表示速度向量不变。',
    'Observe a quarter lap of uniform circular motion. Instantaneous acceleration points inward with magnitude v²/r; interval-average acceleration is Δv/Δt and need not equal the instantaneous vector. At Δt=0 the plot uses the limit. Constant speed does not mean constant velocity.',
  ],
  force: [
    '光滑水平桌面，速率2 m/s，观察半圈。绳拉力提供水平径向合力；竖直支持力与重力相抵。力账的三行是需求、来源和合力的比较，不能把“所需向心力”再加一次。',
    'Smooth horizontal table at 2 m/s, observed for a half lap. Tension supplies the horizontal radial net force; support and gravity balance vertically. The three force rows compare requirement, source and net result; do not add the required centripetal force again.',
  ],
  turning: [
    '1 kg玩具滑块，g=10 m/s²，水平横向力上限μmg=4 N（μ=0.4）。沿速度垂直方向施加恒定横向力，取所需值与上限的较小者；不够时实际曲率半径mv²/F更大。两条轨迹从同一点同一切线出发，观察计划四分之一圈的时间。这是受限转弯几何，不预测真实轮胎滑移、制动或道路事故。',
    'A 1 kg toy slider with g=10 m/s² has lateral-force limit μmg=4 N (μ=0.4). Apply a constant force perpendicular to velocity, capped at that limit. Insufficient force gives a larger actual curvature radius mv²/F. Both paths share start and tangent; observe the planned quarter-lap time. This capped-turning geometry does not predict real tyre slip, braking or crashes.',
  ],
  orbit: [
    '虚构缩尺引力系统，中心体半径1 m，μ=GM=8 m³/s²。无空气与推进力；引力独自提供圆轨道合力。初速必须按v=√(μ/r)选取，本实验不把任意速率都画成圆轨道。观察四分之一圈；数值不是地球卫星参数。',
    'A fictional small-scale gravity system has central radius 1 m and μ=GM=8 m³/s². No air or thrust; gravity alone supplies the circular-orbit net force. Initial speed is chosen as √(μ/r); arbitrary speeds are not drawn as circular orbits. Observe a quarter lap; values are not Earth-satellite parameters.',
  ],
  loop: [
    '1 kg质点车在r=1 m竖直圆环内侧，g=10 m/s²，无摩擦。轨道只能推、不能拉，车未被夹持；底端势能0。能量决定沿轨速度，数值积分对应真实时间；N降到0而继续贴轨需负N时脱离，随后只受重力，止于首次回到底端高度，未建模碰撞。真实过山车的轮组可夹持轨道，不能直接套用此接触条件。',
    'An unrestrained 1 kg point-cart moves inside a vertical r=1 m loop with g=10 m/s² and no friction. The track can push but cannot pull; bottom U=0. Energy sets track speed and numerical integration supplies physical time. It leaves when N reaches zero and continued contact would require negative N, then follows gravity-only flight until first reaching bottom height; impact is omitted. Real coaster wheel assemblies can hold the track, so this contact condition does not apply directly.',
  ],
};
const finite = (n: number) => {
  if (!Number.isFinite(n)) throw new RangeError('Expected finite input');
  return n;
};
const positive = (n: number) => {
  if (finite(n) <= 0) throw new RangeError('Expected positive input');
  return n;
};
const checkIndex = (i: number) => {
  if (!Number.isInteger(i) || i < 0 || i > 2)
    throw new RangeError('Invalid comparison');
};
export function circularDefault(kind: CircularKind, index: number) {
  checkIndex(index);
  return {
    path: [1, 2, 2],
    tangent: [1, 1, 1],
    acceleration: [1, 2, 2],
    force: [1, 2, 1],
    turning: [2, 3, 2],
    orbit: [2, 2, 4],
    loop: [20, 25, 30],
  }[kind][index]!;
}
export function uniformCircle(
  radius: number,
  speed: number,
  time: number,
  mass = 1,
  direction = 1,
) {
  positive(radius);
  positive(speed);
  positive(mass);
  if (finite(time) < 0 || ![1, -1].includes(direction))
    throw new RangeError('Invalid circular motion');
  const theta = (direction * speed * time) / radius,
    c = Math.cos(theta),
    s = Math.sin(theta),
    ac = (speed * speed) / radius;
  return {
    x: radius * c,
    y: radius * s,
    vx: -direction * speed * s,
    vy: direction * speed * c,
    ax: -ac * c,
    ay: -ac * s,
    theta,
    period: (2 * Math.PI * radius) / speed,
    ac,
    force: mass * ac,
  };
}
type LoopEvent = {
  energy: number;
  endAngle: number;
  release: boolean;
  trackTime: number;
  flightTime: number;
  duration: number;
  angles: number[];
  times: number[];
};
const loopCache = new Map<number, LoopEvent>();
const loopSpeed = (energy: number, angle: number) =>
  Math.sqrt(2 * energy - 20 * (1 - Math.cos(angle)));
const loopDt = (energy: number, a: number, b: number) =>
  ((b - a) / 6) *
  (1 / loopSpeed(energy, a) +
    4 / loopSpeed(energy, (a + b) / 2) +
    1 / loopSpeed(energy, b));
export function loopEvent(energy: number): LoopEvent {
  if (finite(energy) < 18 || energy > 36)
    throw new RangeError('Loop energy outside domain');
  const cached = loopCache.get(energy);
  if (cached) return cached;
  const release = energy < 25,
    endAngle = release ? Math.acos((2 - energy / 5) / 3) : 2 * Math.PI,
    n = 1024,
    angles = [0],
    times = [0];
  for (let i = 1; i <= n; i++) {
    const a = (endAngle * (i - 1)) / n,
      b = (endAngle * i) / n;
    angles.push(b);
    times.push(times[i - 1]! + loopDt(energy, a, b));
  }
  const trackTime = times[n]!,
    v = loopSpeed(energy, endAngle),
    vy = v * Math.sin(endAngle),
    height = 1 - Math.cos(endAngle),
    flightTime = release ? (vy + Math.sqrt(vy * vy + 20 * height)) / 10 : 0;
  const event = {
    energy,
    endAngle,
    release,
    trackTime,
    flightTime,
    duration: trackTime + flightTime,
    angles,
    times,
  };
  if (loopCache.size >= 32) loopCache.delete(loopCache.keys().next().value!);
  loopCache.set(energy, event);
  return event;
}
export function loopTrack(energy: number, elapsed: number) {
  if (finite(elapsed) < 0) throw new RangeError('Negative time');
  const event = loopEvent(energy),
    time = Math.min(elapsed, event.duration),
    flight = event.release && time >= event.trackTime;
  let theta = event.endAngle;
  if (time < event.trackTime) {
    let lo = 0,
      hi = event.times.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (event.times[mid]! <= time) lo = mid;
      else hi = mid;
    }
    const a = event.angles[lo]!,
      b = event.angles[hi]!;
    theta =
      a +
      ((b - a) * (time - event.times[lo]!)) /
        (event.times[hi]! - event.times[lo]!);
    for (let j = 0; j < 3; j++)
      theta = Math.max(
        a,
        Math.min(
          b,
          theta -
            (event.times[lo]! + loopDt(energy, a, theta) - time) *
              loopSpeed(energy, theta),
        ),
      );
  }
  const speed = loopSpeed(energy, theta),
    sin = Math.sin(theta),
    cos = Math.cos(theta),
    normal = flight ? 0 : Math.max(0, speed * speed + 10 * cos);
  let x = sin,
    y = -cos,
    vy = speed * sin;
  const vx = speed * cos,
    normalX = normal === 0 ? 0 : -normal * sin,
    normalY = normal * cos;
  if (flight) {
    const dt = time - event.trackTime;
    x += vx * dt;
    y += vy * dt - 5 * dt * dt;
    vy -= 10 * dt;
    if (time === event.duration) y = -1;
  }
  const kinetic = kineticEnergy(1, Math.hypot(vx, vy)),
    potential = 10 * (y + 1);
  const primitive = (w: number) =>
    0.5 * (w * Math.hypot(vx, w) + vx * vx * Math.asinh(w / Math.abs(vx)));
  const distance = flight
    ? event.endAngle + (primitive(speed * sin) - primitive(vy)) / 10
    : theta;
  return {
    time,
    x,
    y,
    vx,
    vy,
    ax: normalX,
    ay: normalY - 10,
    normal,
    normalX,
    normalY,
    theta,
    distance,
    kinetic,
    potential,
    total: kinetic + potential,
    flight,
    event,
    atEnd: time === event.duration,
  };
}
export type CircularReading = {
  time: number;
  duration: number;
  radius: number;
  actualRadius: number;
  mass: number;
  speed: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  initialVx: number;
  initialVy: number;
  theta: number;
  period: number;
  distance: number;
  displacement: number;
  deltaV: number;
  averageA: number;
  ac: number;
  force: number;
  demand: number;
  capacity: number;
  normal: number;
  normalX: number;
  normalY: number;
  kinetic: number;
  potential: number;
  total: number;
  contact: boolean;
  released: boolean;
  releaseTime: number;
  centerX: number;
  phase: Pair;
};
export function circularReading(
  kind: CircularKind,
  index: number,
  value: number,
  progress: number,
): CircularReading {
  checkIndex(index);
  finite(value);
  finite(progress);
  const limit = circularLimits[kind];
  if (value < limit.min || value > limit.max || progress < 0 || progress > 1)
    throw new RangeError('Outside circular teaching domain');
  const r: CircularReading = {
    time: 0,
    duration: 0,
    radius: 2,
    actualRadius: 2,
    mass: 1,
    speed: 1,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    initialVx: 0,
    initialVy: 0,
    theta: 0,
    period: 0,
    distance: 0,
    displacement: 0,
    deltaV: 0,
    averageA: 0,
    ac: 0,
    force: 0,
    demand: 0,
    capacity: 0,
    normal: 0,
    normalX: 0,
    normalY: 0,
    kinetic: 0,
    potential: 0,
    total: 0,
    contact: true,
    released: false,
    releaseTime: 0,
    centerX: 0,
    phase: ['沿圆运动', 'Following the circle'],
  };
  let direction = 1;
  if (kind === 'path') {
    r.radius = value;
    r.speed = index === 2 ? 2 : 1;
    r.duration = 2 * Math.PI;
  }
  if (kind === 'tangent') {
    r.speed = value;
    direction = index === 1 ? -1 : 1;
    r.duration = (Math.PI * r.radius) / r.speed;
    r.releaseTime = r.duration / 2;
  }
  if (kind === 'acceleration') {
    r.radius = index === 2 ? 1 : 2;
    r.speed = value;
    r.duration = (Math.PI * r.radius) / (2 * r.speed);
  }
  if (kind === 'force') {
    r.radius = index === 2 ? 1 : 2;
    r.mass = value;
    r.speed = 2;
    r.duration = (Math.PI * r.radius) / r.speed;
  }
  if (kind === 'turning') {
    r.radius = index === 2 ? 1 : 2;
    r.speed = value;
    r.capacity = 4;
    r.demand = (r.mass * r.speed ** 2) / r.radius;
    r.actualRadius = (r.mass * r.speed ** 2) / Math.min(r.demand, r.capacity);
    r.centerX = r.radius - r.actualRadius;
    r.duration = (Math.PI * r.radius) / (2 * r.speed);
  }
  if (kind === 'orbit') {
    r.radius = value;
    r.mass = index === 1 ? 2 : 1;
    r.speed = Math.sqrt(8 / r.radius);
    r.duration = (Math.PI * r.radius) / (2 * r.speed);
  }
  if (kind === 'loop') {
    const event = loopEvent(value),
      m = loopTrack(value, event.duration * progress);
    r.duration = event.duration;
    r.time = m.time;
    r.radius = 1;
    r.actualRadius = 1;
    r.speed = Math.hypot(m.vx, m.vy);
    r.x = m.x;
    r.y = m.y;
    r.vx = m.vx;
    r.vy = m.vy;
    r.ax = m.ax;
    r.ay = m.ay;
    r.initialVx = Math.sqrt(2 * value);
    r.initialVy = 0;
    r.theta = m.theta;
    r.normal = m.normal;
    r.normalX = m.normalX;
    r.normalY = m.normalY;
    r.kinetic = m.kinetic;
    r.potential = m.potential;
    r.total = m.total;
    r.contact = !m.flight;
    r.released = m.flight;
    r.releaseTime = event.trackTime;
    r.ac = m.flight ? 0 : r.speed ** 2;
    r.force = Math.hypot(r.ax, r.ay);
    r.demand = m.flight ? 0 : r.ac;
    r.period = event.release ? 0 : event.trackTime;
    r.distance = m.distance;
    r.displacement = Math.hypot(r.x, r.y + 1);
    r.phase = m.flight
      ? ['已脱轨：只受重力', 'Off track: gravity alone']
      : ['贴轨：速度随高度改变', 'On track: speed changes with height'];
  } else {
    r.time = r.duration * progress;
    if (kind !== 'turning') r.actualRadius = r.radius;
    const radius = r.actualRadius,
      base = uniformCircle(radius, r.speed, r.time, r.mass, direction);
    Object.assign(r, base);
    r.x += r.centerX;
    r.initialVy = direction * r.speed;
    if (kind === 'tangent' && index === 2 && r.time >= r.releaseTime) {
      const released = uniformCircle(r.radius, r.speed, r.releaseTime);
      r.x = released.x + released.vx * (r.time - r.releaseTime);
      r.y = released.y + released.vy * (r.time - r.releaseTime);
      r.vx = released.vx;
      r.vy = released.vy;
      r.ax = 0;
      r.ay = 0;
      r.ac = 0;
      r.force = 0;
      r.contact = false;
      r.released = true;
      r.phase = [
        '绳已撤去：沿当时切线',
        'Tension removed: along the release tangent',
      ];
    }
    r.distance = r.speed * r.time;
    r.displacement = Math.hypot(r.x - r.radius, r.y);
    if (kind !== 'turning') r.demand = r.mass * r.ac;
    r.kinetic = kineticEnergy(r.mass, r.speed);
    r.potential = kind === 'orbit' ? (-8 * r.mass) / r.radius : 0;
    r.total = r.kinetic + r.potential;
    if (kind === 'turning')
      r.phase =
        r.demand > r.capacity
          ? [
              '需求超过上限：实际转弯更宽',
              'Demand exceeds the limit: actual turn is wider',
            ]
          : [
              '横向力足够：沿计划弯道',
              'Enough lateral force: following the planned bend',
            ];
  }
  r.deltaV = Math.hypot(r.vx - r.initialVx, r.vy - r.initialVy);
  r.averageA = r.time === 0 ? Math.hypot(r.ax, r.ay) : r.deltaV / r.time;
  return r;
}
export function circularRecord(kind: CircularKind, index: number) {
  const r = circularReading(kind, index, circularDefault(kind, index), 1),
    base = `t=${nf(r.duration)} s; v=${nf(r.speed)} m/s; a=${nf(Math.hypot(r.ax, r.ay))} m/s²`;
  return kind === 'path'
    ? `${base}; s=${nf(r.distance)} m; |Δr|=${nf(r.displacement)} m; T=${nf(r.period)} s`
    : kind === 'turning'
      ? `${base}; Fneed=${nf(r.demand)} N; Factual=${nf(r.force)} N; ractual=${nf(r.actualRadius)} m`
      : kind === 'loop'
        ? `${base}; N=${nf(r.normal)} N; K=${nf(r.kinetic)} J; U=${nf(r.potential)} J; K+U=${nf(r.total)} J; ${r.released ? 'off track' : 'on track'}`
        : kind === 'orbit'
          ? `${base}; Fg=${nf(r.force)} N; T=${nf(r.period)} s`
          : `${base}; Fnet=${nf(r.force)} N; |Δv|=${nf(r.deltaV)} m/s; |Δv/Δt|=${nf(r.averageA)} m/s²`;
}
