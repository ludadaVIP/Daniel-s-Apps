export const spaceKinds = [
  'day',
  'seasons',
  'moon',
  'system',
  'orbit',
  'stars',
  'galaxies',
  'distance',
] as const;
export type SpaceKind = (typeof spaceKinds)[number];
export const spaceCase = (index: number) => {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid space comparison');
};
const range = (n: number, min: number, max: number) => {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Space input outside declared model');
};
const rad = (a: number) => (a * Math.PI) / 180;
/** Ideal equinox equator, viewed above geographic north. Sun direction is fixed left. */
export function daylight(hour: number) {
  range(hour, 0, 24);
  const angle = (2 * Math.PI * (hour - 12)) / 24;
  const x = -Math.cos(angle),
    y = -Math.sin(angle);
  const solarCosine = -x;
  return {
    hour,
    x,
    y,
    solarCosine,
    state:
      Math.abs(solarCosine) < 1e-10
        ? 'horizon'
        : solarCosine > 0
          ? 'day'
          : 'night',
  };
}
/** Circular 1-AU orbit, fixed axial orientation, no atmosphere/refraction or weather. */
export function seasonReading(phase: number, latitude: number, tilt = 23.5) {
  range(phase, 0, 360);
  range(latitude, -65, 65);
  range(tilt, 0, 30);
  const declination = Math.asin(Math.sin(rad(tilt)) * Math.sin(rad(phase)));
  const latitudeRad = rad(latitude);
  const daylightHours =
    (24 *
      Math.acos(
        Math.max(
          -1,
          Math.min(1, -Math.tan(latitudeRad) * Math.tan(declination)),
        ),
      )) /
    Math.PI;
  const noonAltitude = 90 - Math.abs(latitude - (declination * 180) / Math.PI);
  return {
    phase,
    latitude,
    tilt,
    declination: (declination * 180) / Math.PI,
    daylightHours,
    noonAltitude,
    noonProjection: Math.max(0, Math.sin(rad(noonAltitude))),
    distanceAU: 1,
  };
}
/** Distant parallel sunlight. Elongation 0=new; right-lit waxing disc in chosen northern-up view. */
export function moonReading(angle: number) {
  range(angle, 0, 360);
  const a = rad(angle),
    illuminated = (1 - Math.cos(a)) / 2;
  return {
    angle,
    x: -Math.cos(a),
    y: -Math.sin(a),
    illuminated,
    day: (29.53 * angle) / 360,
    waxing: angle <= 180,
  };
}
/** Visible bright patch of a spherical disc. No Earth-shadow or eclipse calculation. */
export function moonPatch(angle: number, radius: number) {
  range(angle, 0, 360);
  range(radius, 1, 100);
  const c = Math.cos(rad(angle)),
    right = angle <= 180;
  const outer = Array.from({ length: 81 }, (_, i) => {
    const y = -1 + i / 40;
    return { x: (right ? 1 : -1) * Math.sqrt(Math.max(0, 1 - y * y)), y };
  });
  const boundary = [...outer].reverse().map((p) => ({ x: p.x * c, y: p.y }));
  return [...outer, ...boundary].map((p) => ({
    x: p.x * radius,
    y: p.y * radius,
  }));
}
export const planets = [
  { zh: '水星', en: 'Mercury', au: 0.387 },
  { zh: '金星', en: 'Venus', au: 0.723 },
  { zh: '地球', en: 'Earth', au: 1 },
  { zh: '火星', en: 'Mars', au: 1.524 },
  { zh: '木星', en: 'Jupiter', au: 5.203 },
  { zh: '土星', en: 'Saturn', au: 9.537 },
  { zh: '天王星', en: 'Uranus', au: 19.191 },
  { zh: '海王星', en: 'Neptune', au: 30.07 },
] as const;
export function solarRuler(index: number, cmPerAU = 10) {
  if (!Number.isInteger(index) || index < 0 || index >= planets.length)
    throw new RangeError('Invalid planet');
  range(cmPerAU, 5, 20);
  return {
    ...planets[index]!,
    cmPerAU,
    modelMetres: (planets[index]!.au * cmPerAU) / 100,
  };
}
export const orbitCases = ['circular', 'no-gravity', 'radial'] as const;
/** Central inverse-square attraction with normalized mu=1 and body radius=1.
 * Analytic circular motion, imagined no-gravity tangent, or rest-to-surface radial fall.
 * Four normalized time units, no atmosphere, impact or rotation; first contact ends fall. */
export function orbitReading(index: number, progress: number, startRadius = 2) {
  spaceCase(index);
  range(progress, 0, 1);
  range(startRadius, 1.5, 2.5);
  const clock = 4 * progress,
    circularSpeed = Math.sqrt(1 / startRadius);
  let x = startRadius,
    y = 0,
    vx = 0,
    vy = index === 2 ? 0 : circularSpeed,
    elapsed = clock,
    contact = false;
  if (index === 0) {
    const phase = clock / startRadius ** 1.5;
    x = startRadius * Math.cos(phase);
    y = startRadius * Math.sin(phase);
    vx = -circularSpeed * Math.sin(phase);
    vy = circularSpeed * Math.cos(phase);
  } else if (index === 1) y = circularSpeed * clock;
  else {
    const timeAt = (r: number) => {
      const u = r / startRadius;
      return (
        Math.sqrt(startRadius ** 3 / 2) *
        (Math.acos(Math.sqrt(u)) + Math.sqrt(u * (1 - u)))
      );
    };
    const contactTime = timeAt(1);
    contact = clock >= contactTime;
    elapsed = Math.min(clock, contactTime);
    let low = 1,
      high = startRadius;
    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      if (timeAt(mid) > elapsed) low = mid;
      else high = mid;
    }
    x = contact ? 1 : (low + high) / 2;
    vx = -Math.sqrt(Math.max(0, 2 * (1 / x - 1 / startRadius)));
  }
  const r = Math.hypot(x, y),
    speed = Math.hypot(vx, vy),
    gravity = index === 1 ? 0 : 1 / r ** 2;
  return {
    x,
    y,
    vx,
    vy,
    r,
    speed,
    gravity,
    ax: index === 1 ? 0 : -x / r ** 3,
    ay: index === 1 ? 0 : -y / r ** 3,
    clock,
    elapsed,
    contact,
    startRadius,
    initialSpeed: index === 2 ? 0 : circularSpeed,
    specificEnergy: speed ** 2 / 2 - (index === 1 ? 0 : 1 / r),
  };
}
/** Relative isotropic luminosity / distance²; detector area, spectrum, transmission fixed. */
export function starReading(luminosity: number, distance: number) {
  range(luminosity, 0.25, 4);
  range(distance, 1, 4);
  return {
    luminosity,
    distance,
    brightness: luminosity / distance ** 2,
    areaRatio: distance ** 2,
  };
}
export const cosmicLevels = [
  {
    zh: '太阳系',
    en: 'Solar system',
    memberZh: '太阳与绕行天体',
    memberEn: 'Sun and orbiting bodies',
    addressZh: '地球所在的行星系统',
    addressEn: 'Earth’s planetary system',
  },
  {
    zh: '银河系',
    en: 'Milky Way',
    memberZh: '恒星系统、气体和尘埃',
    memberEn: 'Star systems, gas and dust',
    addressZh: '太阳系所在的星系',
    addressEn: 'Our solar system’s galaxy',
  },
  {
    zh: '多个星系',
    en: 'Multiple galaxies',
    memberZh: '许多各自含恒星的星系',
    memberEn: 'Many galaxies, each with stars',
    addressZh: '更大宇宙中的一部分',
    addressEn: 'One part of the wider universe',
  },
] as const;
export function cosmicLevel(index: number) {
  spaceCase(index);
  return cosmicLevels[index]!;
}
export const AU_KM = 149597870.7;
export const LIGHT_KM_PER_SECOND = 299792.458;
export const JULIAN_YEAR_SECONDS = 365.25 * 24 * 60 * 60;
export const LIGHT_YEAR_KM = LIGHT_KM_PER_SECOND * JULIAN_YEAR_SECONDS;
export function lightTravel(distance: number, unit: 'AU' | 'ly', progress = 1) {
  range(distance, 0.25, 100000);
  range(progress, 0, 1);
  if (unit !== 'AU' && unit !== 'ly')
    throw new RangeError('Unsupported cosmic distance unit');
  const km = distance * (unit === 'AU' ? AU_KM : LIGHT_YEAR_KM),
    seconds = km / LIGHT_KM_PER_SECOND;
  return {
    distance,
    unit,
    km,
    seconds,
    years: seconds / JULIAN_YEAR_SECONDS,
    elapsed: seconds * progress,
    travelledKm: km * progress,
    arrived: progress === 1,
  };
}
