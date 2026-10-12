export type FoodMaterial = 'starch' | 'protein' | 'fibre';
export function digestiveState(material: FoodMaterial, frame: number) {
  const stage = Math.max(0, Math.min(5, frame));
  const product: 'glucose' | 'amino-acids' | 'fibre' =
    material === 'starch'
      ? 'glucose'
      : material === 'protein'
        ? 'amino-acids'
        : 'fibre';
  return {
    stage,
    product,
    form:
      material === 'fibre'
        ? 'chain'
        : stage >= 3
          ? 'units'
          : stage >= (material === 'starch' ? 0 : 2)
            ? 'fragments'
            : 'chain',
    absorbed: material !== 'fibre' && stage >= 4,
    destination:
      stage < 4
        ? 'lumen'
        : material === 'fibre'
          ? 'colon'
          : stage === 4
            ? 'blood'
            : 'liver',
  };
}
export type Gas = 'oxygen' | 'carbon';
export type PressureCase = 'usual' | 'equal' | 'reversed';
export function gasPressure(gas: Gas, scenario: PressureCase) {
  const usual = gas === 'oxygen' ? { air: 10, blood: 4 } : { air: 4, blood: 6 };
  const values =
    scenario === 'equal'
      ? { air: 8, blood: 8 }
      : scenario === 'reversed'
        ? { air: usual.blood, blood: usual.air }
        : usual;
  return {
    ...values,
    net:
      values.air === values.blood
        ? 'balanced'
        : values.air > values.blood
          ? 'air-to-blood'
          : 'blood-to-air',
  };
}
export function sphereSurface(count: 1 | 8) {
  const radius = count === 1 ? 2 : 1;
  return {
    count,
    radius,
    volume: ((count * 4) / 3) * Math.PI * radius ** 3,
    area: count * 4 * Math.PI * radius ** 2,
    volumeRatio: 1,
    areaRatio: count === 1 ? 1 : 2,
  };
}
export type Cargo = 'oxygen' | 'glucose' | 'carbon';
export const bloodPaths = {
  oxygen: [
    'air',
    'lung',
    'pulmonary-vein',
    'left-heart',
    'systemic-artery',
    'tissue',
    'cell',
  ],
  carbon: [
    'cell',
    'tissue',
    'systemic-vein',
    'right-heart',
    'pulmonary-artery',
    'lung',
    'air',
  ],
  glucose: [
    'gut',
    'portal',
    'liver',
    'systemic-vein',
    'right-heart',
    'pulmonary-artery',
    'lung',
    'pulmonary-vein',
    'left-heart',
    'systemic-artery',
    'tissue',
    'cell',
  ],
} as const;
export type BloodStation = (typeof bloodPaths)[Cargo][number];
export type HiddenLink = 'none' | 'absorption' | 'exchange' | 'transport';
export function deliveryLinks(hidden: HiddenLink) {
  return {
    absorption: hidden !== 'absorption',
    exchange: hidden !== 'exchange',
    transport: hidden !== 'transport',
  };
}
export function newDelivery(cargo: Cargo, hidden: HiddenLink) {
  const links = deliveryLinks(hidden);
  return (
    links.transport && (cargo === 'glucose' ? links.absorption : links.exchange)
  );
}
