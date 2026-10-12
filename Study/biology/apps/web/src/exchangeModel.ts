export type MembraneSubstance = 'oxygen' | 'sodium' | 'protein';
export function membraneRoute(
  substance: MembraneSubstance,
  sodiumChannel: boolean,
) {
  if (substance === 'oxygen') return 'lipid' as const;
  if (substance === 'sodium' && sodiumChannel) return 'channel' as const;
  return 'blocked' as const;
}
export type InitialLeft = 4 | 8 | 12;
export type Walker = { id: number; x: number; y: number };
export type DiffusionSnapshot = {
  tick: number;
  particles: Walker[];
  left: number;
  right: number;
  leftToRight: number;
  rightToLeft: number;
  trail: { x: number; y: number }[];
};
/** Independent point walkers on a 24×12 equal-volume lattice. Each proposal is
 * uniformly chosen from four directions, never from a concentration gradient.
 * Proposals beyond the reflecting outer boundary remain in place. Snapshots
 * collect 32 steps; crossing-event counts include repeat crossings. */
export function diffusionRun(
  initialLeft: InitialLeft,
  seed = 12345,
): DiffusionSnapshot[] {
  let state = seed >>> 0;
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
  let particles: Walker[] = Array.from({ length: 16 }, (_, id) => ({
    id,
    x: Math.floor(random() * 12) + (id < initialLeft ? 0 : 12),
    y: Math.floor(random() * 12),
  }));
  const snapshots: DiffusionSnapshot[] = [];
  let leftToRight = 0,
    rightToLeft = 0,
    trail = [{ x: particles[0]!.x, y: particles[0]!.y }];
  function capture(tick: number) {
    const left = particles.filter((p) => p.x < 12).length;
    snapshots.push({
      tick,
      particles: particles.map((p) => ({ ...p })),
      left,
      right: 16 - left,
      leftToRight,
      rightToLeft,
      trail: trail.map((p) => ({ ...p })),
    });
  }
  capture(0);
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;
  for (let interval = 1; interval <= 6; interval++) {
    leftToRight = 0;
    rightToLeft = 0;
    trail = [{ x: particles[0]!.x, y: particles[0]!.y }];
    for (let step = 0; step < 32; step++) {
      particles = particles.map((p) => {
        const [dx, dy] = directions[Math.floor(random() * 4)]!;
        const x = Math.max(0, Math.min(23, p.x + dx)),
          y = Math.max(0, Math.min(11, p.y + dy));
        if (p.x < 12 && x >= 12) leftToRight++;
        if (p.x >= 12 && x < 12) rightToLeft++;
        if (p.id === 0) trail.push({ x, y });
        return { ...p, x, y };
      });
    }
    capture(interval * 32);
  }
  return snapshots;
}
export type OutsideSolution = 'dilute' | 'same' | 'concentrated';
/** Initial net water tendency only: same temperature/pressure, a viable plant
 * cell with initially relatively impermeant solutes. No final water potential,
 * volume, concentration, turgor pressure or time is calculated. */
export function osmosisTendency(
  outside: OutsideSolution,
  waterPasses: boolean,
) {
  if (!waterPasses) return 'blocked' as const;
  return outside === 'dilute'
    ? ('into' as const)
    : outside === 'concentrated'
      ? ('out' as const)
      : ('balanced' as const);
}
export function boxMetrics(x: number, y: number, z: number, count = 1) {
  if (
    ![x, y, z].every((v) => Number.isFinite(v) && v > 0) ||
    !Number.isInteger(count) ||
    count < 1
  )
    throw new RangeError(
      'Positive lengths and a positive integer count are required',
    );
  const area = 2 * (x * y + x * z + y * z) * count,
    volume = x * y * z * count;
  return {
    area,
    volume,
    areaPerVolume: area / volume,
    centreDistance: Math.min(x, y, z) / 2,
  };
}
export const exchangeShapes = {
  large: { dimensions: [2, 2, 2], count: 1 },
  small: { dimensions: [1, 1, 1], count: 8 },
  flat: { dimensions: [4, 2, 1], count: 1 },
} as const;
export type ExchangeShape = keyof typeof exchangeShapes;
export function shapeMetrics(shape: ExchangeShape) {
  const s = exchangeShapes[shape];
  return boxMetrics(s.dimensions[0], s.dimensions[1], s.dimensions[2], s.count);
}
