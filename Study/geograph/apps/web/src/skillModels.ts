/** Teaching models use declared units, dates and geometry, never device location. */
export const scaleModel = (zoom: number) => ({
  straightKm: 10,
  routeKm: 16,
  separation: 200 * zoom,
  barPixels: 100,
  barKm: 5 / zoom,
});
export const coordinateTargets = [
  { id: 'nz', zh: '新西兰附近', en: 'Near New Zealand', lat: -40, lon: 175 },
  { id: 'sahara', zh: '撒哈拉内陆', en: 'Inside the Sahara', lat: 25, lon: 15 },
  {
    id: 'pacific',
    zh: '太平洋赤道区域',
    en: 'Equatorial Pacific',
    lat: 0,
    lon: -150,
  },
] as const;
export const coordinateMatch = (
  lat: number,
  lon: number,
  target: (typeof coordinateTargets)[number],
) => lat === target.lat && lon === target.lon;
export const cities = [
  {
    id: 'auckland',
    zh: '奥克兰',
    en: 'Auckland',
    zone: 'Pacific/Auckland',
    offsets: [13, 12],
    lon: 174.8,
  },
  {
    id: 'london',
    zh: '伦敦',
    en: 'London',
    zone: 'Europe/London',
    offsets: [0, 1],
    lon: -0.1,
  },
  {
    id: 'tokyo',
    zh: '东京',
    en: 'Tokyo',
    zone: 'Asia/Tokyo',
    offsets: [9, 9],
    lon: 139.7,
  },
  {
    id: 'honolulu',
    zh: '檀香山',
    en: 'Honolulu',
    zone: 'Pacific/Honolulu',
    offsets: [-10, -10],
    lon: -157.9,
  },
] as const;
export const timeDates = ['2026-01-15', '2026-07-15'] as const;
export type City = (typeof cities)[number];
export function cityTime(
  dateIndex: number,
  utcHour: number,
  city: City,
  useIntl = true,
) {
  const date = timeDates[dateIndex === 1 ? 1 : 0];
  const hour =
    Number.isInteger(utcHour) && utcHour >= 0 && utcHour <= 23 ? utcHour : 12;
  const instant = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00Z`);
  if (useIntl) {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: city.zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(instant);
      const get = (key: string) => parts.find((p) => p.type === key)!.value;
      const localDate = `${get('year')}-${get('month')}-${get('day')}`;
      const hour = Number(get('hour'));
      const localMillis = Date.parse(
        `${localDate}T${get('hour')}:${get('minute')}:00Z`,
      );
      return {
        hour,
        date: localDate,
        offset: (localMillis - instant.getTime()) / 3600000,
        fallback: false,
      };
    } catch {
      /* Fixed-date verified examples remain usable without time-zone support. */
    }
  }
  const offset = city.offsets[dateIndex === 1 ? 1 : 0];
  const local = new Date(instant.getTime() + offset * 3600000);
  return {
    hour: local.getUTCHours(),
    date: local.toISOString().slice(0, 10),
    offset,
    fallback: true,
  };
}
export function meetingWorks(dateIndex: number, utcHour: number) {
  const a = cityTime(dateIndex, utcHour, cities[0]);
  const l = cityTime(dateIndex, utcHour, cities[1]);
  return a.hour >= 19 && a.hour <= 21 && l.hour >= 7 && l.hour <= 9;
}
export const isLit = (rotation: number) =>
  Math.cos((rotation * Math.PI) / 180) > 1e-8;
/** A spherical, geometric model: no refraction, terrain, weather or solar-disc width. */
export function seasonLight(latitude: number, quarter: number, tilt = 23.4) {
  const declination = [0, tilt, 0, -tilt][quarter] ?? 0;
  const rad = Math.PI / 180;
  const boundary = -Math.tan(latitude * rad) * Math.tan(declination * rad);
  const daylight =
    (24 * Math.acos(Math.max(-1, Math.min(1, boundary)))) / Math.PI;
  const noonHeight = 90 - Math.abs(latitude - declination);
  return { declination, daylight, noonHeight };
}
export function skillValue(
  decisions: Record<string, string>,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = Number(decisions[key]);
  return decisions[key] !== undefined &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : fallback;
}
export function skillFinished(id: string, decisions: Record<string, string>) {
  if (id === 'GEO-005')
    return (
      decisions['scale-wide'] === '10' &&
      decisions['scale-close'] === '10' &&
      decisions['scale-route'] === '16'
    );
  if (id === 'GEO-006')
    return coordinateTargets.every(
      (p) => decisions[`located-${p.id}`] === `${p.lat},${p.lon}`,
    );
  if (id === 'GEO-007')
    return ['0', '1'].every((date) => {
      const hour = Number(decisions[`meeting-${date}`]);
      return (
        decisions[`meeting-${date}`] !== undefined &&
        Number.isInteger(hour) &&
        hour >= 0 &&
        hour <= 23 &&
        meetingWorks(Number(date), hour)
      );
    });
  if (id === 'GEO-008')
    return ['day', 'night', 'june', 'december', 'untilted'].every(
      (key) => decisions[`observed-${key}`] === 'yes',
    );
  return false;
}
