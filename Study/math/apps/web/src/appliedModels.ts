// Fictional, exact classroom models. Money is stored as whole cents.
const integer = (n: number, min: number, max: number) => {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Outside model domain');
  return n;
};
export function fraction(n: number, d: number): string {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d <= 0)
    throw new RangeError('Invalid fraction');
  let a = Math.abs(n),
    b = d;
  while (b) [a, b] = [b, a % b];
  return d / a === 1 ? String(n / a) : `${n / a}/${d / a}`;
}
export function journey(distance: number, moving: number, stop: number) {
  integer(distance, 0, 1000);
  integer(moving, 1, 600);
  integer(stop, 0, 600);
  return {
    distance,
    moving,
    stop,
    elapsed: moving + stop,
    movingSpeed: fraction(distance * 60, moving),
    averageSpeed: fraction(distance * 60, moving + stop),
  };
}
export function workModel(amount: number, rates: number[], minutes: number) {
  integer(amount, 1, 1000);
  integer(minutes, 0, 120);
  if (!rates.length || rates.length > 4)
    throw new RangeError('One to four pumps');
  rates.forEach((r) => integer(r, 0, 20));
  const rate = rates.reduce((s, r) => s + r, 0),
    done = Math.min(amount, rate * minutes);
  return {
    rate,
    done,
    remaining: amount - done,
    finish: rate === 0 ? null : fraction(amount, rate),
  };
}
export function budgetModel(
  budget: number,
  ticketCents: number,
  discount: number,
  other: number,
  reserveRate: number,
) {
  [budget, ticketCents, other].forEach((n) => integer(n, 0, 1000000));
  integer(discount, 0, 100);
  integer(reserveRate, 0, 100);
  // Lesson inputs ensure exact cents. No hidden per-ticket or checkout rounding.
  if ((ticketCents * discount) % 100 || (budget * reserveRate) % 100)
    throw new RangeError('A rounding rule is required');
  const saving = (ticketCents * discount) / 100,
    reserve = (budget * reserveRate) / 100;
  const spend = ticketCents - saving + other,
    usable = budget - reserve;
  return {
    saving,
    tickets: ticketCents - saving,
    reserve,
    spend,
    usable,
    headroom: usable - spend,
    feasible: spend <= usable,
  };
}
export const chartRows = [
  { zh: '周一', en: 'Monday', count: 12 },
  { zh: '周二', en: 'Tuesday', count: 18 },
  { zh: '周三', en: 'Wednesday', count: null },
  { zh: '周四', en: 'Thursday', count: 24 },
];
export function chartCost(count: number | null, fare = 400, groupFee = 1000) {
  integer(fare, 0, 10000);
  integer(groupFee, 0, 10000);
  if (count === null) return null;
  integer(count, 0, 1000);
  return count * fare + groupFee;
}
export const routes = [
  { id: 'direct', zh: '直达', en: 'Direct', oneWay: 40, groupFare: 4000 },
  { id: 'scenic', zh: '绕行', en: 'Scenic', oneWay: 60, groupFare: 2400 },
] as const;
export const activities = [
  { id: 'museum', zh: '展馆', en: 'Museum', minutes: 90, ticket: 1200 },
  { id: 'garden', zh: '花园', en: 'Garden', minutes: 60, ticket: 800 },
  { id: 'trail', zh: '步道', en: 'Trail', minutes: 90, ticket: 0 },
] as const;
export function tripModel(
  people: number,
  budget: number,
  reserve: number,
  discount: number,
  routeId: string,
  activityId: string,
  deadline: number,
) {
  integer(people, 1, 8);
  integer(deadline, 60, 600);
  const route = routes.find((r) => r.id === routeId),
    activity = activities.find((a) => a.id === activityId);
  if (!route || !activity) throw new RangeError('Unknown itinerary');
  const cash = budgetModel(
    budget,
    activity.ticket * people,
    discount,
    route.groupFare + 600 * people,
    reserve,
  );
  const segments = [
    { id: 'out', minutes: route.oneWay },
    { id: 'visit', minutes: activity.minutes },
    { id: 'lunch', minutes: 30 },
    { id: 'back', minutes: route.oneWay },
    { id: 'buffer', minutes: 30 },
  ];
  let elapsed = 0;
  const timeline = segments.map((s) => {
    const from = elapsed;
    elapsed += s.minutes;
    return { ...s, from, to: elapsed };
  });
  return {
    ...cash,
    transport: route.groupFare,
    lunch: 600 * people,
    originalTickets: activity.ticket * people,
    timeline,
    elapsed,
    deadline,
    timeHeadroom: deadline - elapsed,
    timeFeasible: elapsed <= deadline,
    feasible: cash.feasible && elapsed <= deadline,
  };
}
export const money = (cents: number) => `NZ$${(cents / 100).toFixed(2)}`;
export const clock = (minutesAfterNine: number) => {
  integer(minutesAfterNine, 0, 900);
  const m = 540 + minutesAfterNine;
  return `${Math.floor(m / 60)
    .toString()
    .padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
};
