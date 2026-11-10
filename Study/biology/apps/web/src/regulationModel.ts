/** Qualitative teaching rules, not physiological measurements or clinical predictions. */
export type Stimulus = 'light' | 'sound' | 'pressure';
export type Receptor = 'eye' | 'ear' | 'skin';
export const receptorFor: Record<Stimulus, Receptor> = {
  light: 'eye', sound: 'ear', pressure: 'skin',
};
export function detects(stimulus: Stimulus, receptor: Receptor) {
  return receptorFor[stimulus] === receptor;
}
export type PathCondition = 'intact' | 'sensory-gap' | 'motor-gap';
export function neuralReach(condition: PathCondition, frame: number) {
  const limit = condition === 'sensory-gap' ? 0 : condition === 'motor-gap' ? 2 : 4;
  return Math.min(Math.max(Math.floor(frame), 0), limit);
}
export const reflexRoute = ['receptor', 'sensory', 'relay', 'motor', 'muscle'] as const;
export type ReflexPart = (typeof reflexRoute)[number];
export function addReflexPart(route: readonly ReflexPart[], part: ReflexPart) {
  const correct = reflexRoute[route.length] === part;
  return { correct, route: correct ? [...route, part] : [...route] };
}
export type Messenger = 'A' | 'B';
export type CellReceptors = 'A' | 'B' | 'both';
export function hormoneTarget(messenger: Messenger, receptors: CellReceptors) {
  return receptors === 'both' || receptors === messenger;
}
export type Disturbance = 'high' | 'low';
/** Arbitrary units and snapshots; the rule illustrates opposition, not a bodily rate. */
export function feedbackSeries(direction: Disturbance, enabled: boolean) {
  const upper = [50, 80, 69, 61, 55, 53];
  const values = direction === 'high' ? upper : upper.map((x) => 100 - x);
  return enabled ? values : [50, ...Array<number>(5).fill(values[1]!)];
}
export type ThermalState = 'warm' | 'cold';
export type AirMoisture = 'drier' | 'humid';
export function thermalResponse(state: ThermalState, air: AirMoisture) {
  return {
    vessels: state === 'warm' ? 'wider' : 'narrower',
    shivering: state === 'cold',
    evaporation: state === 'cold' ? 'not-highlighted' : air === 'drier' ? 'greater' : 'reduced',
    direction: state === 'warm' ? 'heat-loss' : 'heat-conservation',
  } as const;
}
export function glucoseResponse(state: Disturbance) {
  return state === 'high'
    ? { cells: 'beta', hormone: 'insulin', liver: 'store', tendency: 'down' } as const
    : { cells: 'alpha', hormone: 'glucagon', liver: 'release', tendency: 'up' } as const;
}
export type WaterState = 'concentrated' | 'dilute';
export function waterResponse(state: WaterState) {
  return {
    adh: state === 'concentrated' ? 'more' : 'less',
    permeability: state === 'concentrated' ? 'higher' : 'lower',
    reabsorption: state === 'concentrated' ? 'more' : 'less',
    urineVolume: state === 'concentrated' ? 'less' : 'more',
    urineConcentration: state === 'concentrated' ? 'higher' : 'lower',
    thirst: state === 'concentrated' ? 'can-increase' : 'not-highlighted',
  } as const;
}
