export type AlgebraKind =
  | 'variables'
  | 'substitution'
  | 'rearrange'
  | 'ratio'
  | 'direct'
  | 'inverse'
  | 'square'
  | 'notation';
export const algebraKinds: AlgebraKind[] = [
  'variables',
  'substitution',
  'rearrange',
  'ratio',
  'direct',
  'inverse',
  'square',
  'notation',
];
function finite(n: number, min: number, max: number) {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new RangeError('Outside the teaching model range');
  return n;
}
export function algebraCase(index: number) {
  if (!Number.isInteger(index)) throw new RangeError('Case must be an integer');
  return finite(index, 0, 2);
}
export function robotTrip(speed: number, seconds: number, progress = 1) {
  finite(speed, 0, 3);
  finite(seconds, 0, 8);
  finite(progress, 0, 1);
  return {
    speed,
    seconds,
    distance: speed * seconds,
    elapsed: seconds * progress,
    position: speed * seconds * progress,
  };
}
export function lampEnergy(watts: number, duration: number, unit: 's' | 'min') {
  finite(watts, 0, 5);
  finite(duration, 0, 60);
  if (unit !== 's' && unit !== 'min') throw new RangeError('Unknown time unit');
  const seconds = duration * (unit === 'min' ? 60 : 1);
  return { watts, duration, unit, seconds, joules: watts * seconds };
}
export function tripTime(distance: number, speed: number) {
  finite(distance, 0, 240);
  finite(speed, 0, 6);
  // Even 0/0 is undetermined. Keep it out of the balance transformation.
  return { distance, speed, seconds: speed === 0 ? null : distance / speed };
}
export function mapScale(modelCm: number, metresPerCm: number) {
  finite(modelCm, 0, 8);
  finite(metresPerCm, 50, 200);
  return {
    modelCm,
    metresPerCm,
    realMetres: modelCm * metresPerCm,
    denominator: metresPerCm * 100,
  };
}
export function linearSpring(force: number) {
  finite(force, 0, 6);
  const stiffness = 20,
    restMetres = 0.2,
    extension = force / stiffness;
  return {
    force,
    stiffness,
    restMetres,
    extension,
    length: restMetres + extension,
    extensionPerForce: 1 / stiffness,
  };
}
export function contactPressure(area: number) {
  finite(area, 0.01, 0.08);
  const force = 600,
    pascals = force / area;
  return {
    force,
    area,
    pascals,
    kilopascals: pascals / 1000,
    product: pascals * area,
  };
}
export function cartEnergy(speed: number, mass = 2) {
  finite(speed, 0, 3);
  finite(mass, 0.5, 4);
  return {
    speed,
    mass,
    joules: 0.5 * mass * speed * speed,
    coefficient: 0.5 * mass,
  };
}
export function scientific(value: number) {
  if (!Number.isFinite(value))
    throw new RangeError('Finite magnitude required');
  if (value === 0) return { coefficient: 0, exponent: 0 };
  let exponent = Math.floor(Math.log10(Math.abs(value)));
  let coefficient = value / 10 ** exponent;
  // Powers near a floating boundary can otherwise produce 9.999… or 0.999….
  coefficient = Number(coefficient.toPrecision(12));
  if (Math.abs(coefficient) >= 10) {
    coefficient /= 10;
    exponent++;
  }
  if (Math.abs(coefficient) < 1) {
    coefficient *= 10;
    exponent--;
  }
  return { coefficient, exponent };
}
export function notationReading(exponent: number, unit: 'm' | 'mm' = 'm') {
  finite(exponent, -6, 6);
  if (!Number.isInteger(exponent))
    throw new RangeError('Integer exponent required');
  if (unit !== 'm' && unit !== 'mm')
    throw new RangeError('Unknown length unit');
  const metres = 4 * 10 ** exponent,
    displayed = metres * (unit === 'mm' ? 1000 : 1);
  return { metres, displayed, unit, ...scientific(displayed) };
}
export function algebraDefault(kind: AlgebraKind, index: number) {
  algebraCase(index);
  switch (kind) {
    case 'variables':
      return [1, 2, 1][index]!;
    case 'substitution':
      return [30, 0.5, 30][index]!;
    case 'rearrange':
      return [2, 4, 4][index]!;
    case 'ratio':
      return [3, 6, 3][index]!;
    case 'direct':
      return [2, 4, 6][index]!;
    case 'inverse':
      return [0.02, 0.04, 0.08][index]!;
    case 'square':
      return [1, 2, 3][index]!;
    case 'notation':
      return [-6, 3, 6][index]!;
  }
}
export function algebraReading(
  kind: AlgebraKind,
  index: number,
  custom = algebraDefault(kind, index),
  progress = 1,
) {
  algebraCase(index);
  finite(progress, 0, 1);
  switch (kind) {
    case 'variables':
      return robotTrip(custom, index === 2 ? 8 : 4, progress);
    case 'substitution':
      return lampEnergy(index === 2 ? 5 : 2, custom, index === 1 ? 'min' : 's');
    case 'rearrange':
      return tripTime(index === 2 ? 240 : 120, custom);
    case 'ratio':
      return mapScale(custom, index === 2 ? 200 : 100);
    case 'direct':
      return linearSpring(custom);
    case 'inverse':
      return contactPressure(custom);
    case 'square':
      return cartEnergy(custom);
    case 'notation':
      return notationReading(custom);
  }
}
