export type Reference = 'ground' | 'train';
export type Walking = -1 | 0 | 1;
export function trainView(time: number, frame: Reference, walking: Walking) {
  if (
    !Number.isFinite(time) ||
    !['ground', 'train'].includes(frame) ||
    ![-1, 0, 1].includes(walking)
  )
    throw new RangeError('Invalid train observation');
  const t = Math.max(0, Math.min(4, time)),
    train = 2 * t,
    groundPosition = train + 5 + walking * t,
    origin = frame === 'train' ? train : 0;
  return {
    time: t,
    origin,
    trainPosition: train - origin,
    passengerPosition: groundPosition - origin,
    passengerVelocity: 2 + walking - (frame === 'train' ? 2 : 0),
    groundPosition,
    trainSpeed: 2,
  };
}
export function returnJourney(time: number, pause = 0) {
  if (!Number.isFinite(time) || !Number.isFinite(pause) || pause < 0)
    throw new RangeError('Invalid journey');
  const end = 6 + pause,
    t = Math.max(0, Math.min(end, time));
  const outward = Math.min(t, 3) * 2,
    inward = Math.max(0, t - 3 - pause) * 2;
  return {
    time: t,
    totalTime: end,
    position: outward - inward,
    distance: outward + inward,
    displacement: outward - inward,
    phase:
      t < 3
        ? 'outward'
        : t < 3 + pause
          ? 'pause'
          : t < end
            ? 'return'
            : 'finished',
  };
}
export function averageTrip(pause: number) {
  if (!Number.isFinite(pause) || pause < 0)
    throw new RangeError('Invalid pause');
  const outwardDistance = 6,
    returnDistance = 6,
    outwardTime = 3,
    returnTime = 6,
    totalDistance = 12,
    totalTime = outwardTime + pause + returnTime;
  return {
    outwardDistance,
    returnDistance,
    outwardTime,
    returnTime,
    pause,
    totalDistance,
    totalTime,
    averageSpeed: totalDistance / totalTime,
    unweightedMean: (2 + 1) / 2,
    averageVelocity: 0,
  };
}
export function averageTripState(time: number, pause: number) {
  const trip = averageTrip(pause);
  if (!Number.isFinite(time)) throw new RangeError('Invalid observation time');
  const t = Math.max(0, Math.min(time, trip.totalTime)),
    outward = Math.min(t, 3) * 2,
    inward = Math.max(0, t - 3 - pause);
  return {
    ...trip,
    time: t,
    position: outward - inward,
    distance: outward + inward,
    phase:
      t < 3
        ? 'outward'
        : t < 3 + pause
          ? 'pause'
          : t < trip.totalTime
            ? 'return'
            : 'finished',
  };
}
