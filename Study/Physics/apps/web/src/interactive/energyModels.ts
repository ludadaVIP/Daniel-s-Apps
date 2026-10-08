const finite = (value: number) => {
  if (!Number.isFinite(value)) throw new RangeError('Expected a finite number');
  return value;
};
const positive = (value: number) => {
  if (finite(value) <= 0) throw new RangeError('Expected a positive number');
  return value;
};
const fraction = (value: number) => {
  if (finite(value) < 0 || value > 1)
    throw new RangeError('Expected a fraction in [0,1]');
  return value;
};
const flag = (value: boolean) => {
  if (typeof value !== 'boolean') throw new TypeError('Expected a boolean');
  return value;
};

export function kineticEnergy(mass: number, velocity: number) {
  return finite(0.5 * positive(mass) * finite(velocity) ** 2);
}
export function gravitationalEnergy(
  mass: number,
  height: number,
  reference = 0,
  g = 10,
) {
  return finite(
    positive(mass) * positive(g) * (finite(height) - finite(reference)),
  );
}
export function elasticEnergy(stiffness: number, extension: number) {
  return finite(0.5 * positive(stiffness) * finite(extension) ** 2);
}

// An attached frictionless cart: stop playback at the first natural-length crossing.
export function springRelease(
  stiffness: number,
  initialExtension: number,
  time: number,
  mass = 0.5,
) {
  positive(stiffness);
  positive(mass);
  finite(initialExtension);
  if (finite(time) < 0) throw new RangeError('Expected nonnegative time');
  const omega = Math.sqrt(positive(stiffness / mass)),
    duration = Math.PI / (2 * omega);
  const finished = time >= duration;
  const angle = Math.min(time, duration) * omega;
  const extension = finished ? 0 : initialExtension * Math.cos(angle);
  const velocity = -initialExtension * omega * Math.sin(angle);
  const elastic = elasticEnergy(stiffness, extension),
    kinetic = kineticEnergy(mass, velocity);
  return {
    mass,
    stiffness,
    duration,
    time: Math.min(time, duration),
    extension,
    velocity,
    elastic,
    kinetic,
    total: elastic + kinetic,
    initial: elasticEnergy(stiffness, initialExtension),
    finished,
  };
}

// A prescribed 12 J portion, not a real battery's full capacity or discharge time.
export function lampLedger(on: boolean, phase: number) {
  flag(on);
  fraction(phase);
  const initial = 12,
    transferred = on ? initial * phase : 0;
  return {
    initial,
    remaining: initial - transferred,
    lightOut: transferred * 0.25,
    thermal: transferred * 0.75,
    transferred,
  };
}

// Position-based teaching ledger. It does not predict travel time or a measured friction coefficient.
// h(u)=(1-2u)^2 m; rough-path dissipation is prescribed as 4u J.
export function trackLedger(rough: boolean, position: number) {
  flag(rough);
  fraction(position);
  const initial = 10,
    mass = 1,
    g = 10;
  const turn = rough ? 0.9 : 1,
    u = Math.min(position, turn);
  const height = (1 - 2 * u) ** 2,
    potential = gravitationalEnergy(mass, height);
  const thermal = rough ? 4 * u : 0;
  const kinetic = Math.max(0, initial - potential - thermal);
  const atTurn = u >= turn;
  return {
    initial,
    mass,
    g,
    requestedPosition: position,
    position: u,
    turn,
    height,
    potential,
    kinetic,
    thermal,
    mechanical: potential + kinetic,
    total: potential + kinetic + thermal,
    speed: Math.sqrt((2 * kinetic) / mass),
    atTurn,
  };
}
export function trackRecovery(rough: boolean) {
  const end = trackLedger(rough, 1);
  return {
    ...end,
    useful: end.potential,
    efficiency: end.potential / end.initial,
  };
}
