/** Discrete inventory model, not a time-dependent cell simulation. */
export function galvanicInventory(steps: number) {
  if (!Number.isInteger(steps) || steps < 0 || steps > 4)
    throw new RangeError(
      'The inventory permits zero to four reaction portions',
    );
  return {
    zincMetal: 4 - steps,
    zincIons: 2 + steps,
    leftNitrate: 4 + 2 * steps,
    copperMetal: 2 + steps,
    copperIons: 4 - steps,
    rightPotassium: 2 * steps,
    rightNitrate: 8,
    bridgePotassium: 8 - 2 * steps,
    bridgeNitrate: 8 - 2 * steps,
    electronTransfers: 2 * steps,
  };
}

export function canAdvanceGalvanic(
  steps: number,
  wire: boolean,
  bridge: boolean,
) {
  galvanicInventory(steps);
  return wire && bridge && steps < 4;
}

export const faradayConstant = 96485; // C/mol; rounded teaching value
export const copperMolarMass = 63.5; // g/mol; rounded teaching value

/** Constant current, Cu electrodes, Cu²⁺ electrolyte, 100% current efficiency. */
export function copperPlating(
  current: number,
  seconds: number,
  powered = true,
) {
  if (![current, seconds].every((n) => Number.isFinite(n) && n >= 0))
    throw new RangeError('Current and time must be finite and nonnegative');
  const charge = powered ? current * seconds : 0;
  const electronMoles = charge / faradayConstant;
  const copperMoles = electronMoles / 2;
  const mass = copperMoles * copperMolarMass;
  return { charge, electronMoles, copperMoles, mass };
}
