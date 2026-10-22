// Regular US equity sessions, including scheduled holidays and early closes.
// Calendar reference: https://www.nyse.com/trade/hours-calendars
// Keep exceptional exchange closures here when they are announced.
const exceptionalClosures = new Set(["2025-01-09"]);
const eastern = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
const london = new Intl.DateTimeFormat("en-CA", { ...eastern.resolvedOptions(), timeZone: "Europe/London" });
const localParts = (at, market = "US") => Object.fromEntries(
  (market === "LSE" ? london : eastern).formatToParts(at).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
);
const dayString = (at) => at.toISOString().slice(0, 10);
const shiftDay = (date, days) => dayString(new Date(Date.parse(`${date}T12:00:00Z`) + days * 86_400_000));
const weekday = (date) => new Date(`${date}T12:00:00Z`).getUTCDay();
const nthWeekday = (year, month, day, occurrence) => {
  const first = `${year}-${String(month).padStart(2, "0")}-01`;
  return shiftDay(first, (day - weekday(first) + 7) % 7 + (occurrence - 1) * 7);
};
const observed = (date) => shiftDay(date, weekday(date) === 6 ? -1 : weekday(date) === 0 ? 1 : 0);
const holidayCache = new Map();
function easterSunday(year) {
  // Gregorian Easter; Good Friday is two days earlier.
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(Date.UTC(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, (h + l - 7 * m + 114) % 31 + 1));
}
function holidays(year) {
  if (holidayCache.has(year)) return holidayCache.get(year);
  const easter = easterSunday(year);
  const newYear = `${year}-01-01`;
  const memorial = `${year}-05-31`;
  const dates = new Set([
    // NYSE does not observe a Saturday New Year's Day on December 31.
    weekday(newYear) === 0 ? shiftDay(newYear, 1) : newYear,
    nthWeekday(year, 1, 1, 3), nthWeekday(year, 2, 1, 3),
    shiftDay(dayString(easter), -2),
    shiftDay(memorial, -((weekday(memorial) + 6) % 7)),
    observed(`${year}-07-04`), nthWeekday(year, 9, 1, 1),
    nthWeekday(year, 11, 4, 4), observed(`${year}-12-25`),
  ]);
  if (year >= 2022) dates.add(observed(`${year}-06-19`));
  holidayCache.set(year, dates);
  return dates;
}
// LSE business days and ETF closing auction:
// https://www.londonstockexchange.com/securities-trading/trading-access/business-days
// https://www.londonstockexchange.com/raise-finance/etps/how-list-etps-how-list
const londonHolidayCache = new Map();
function londonHolidays(year) {
  if (londonHolidayCache.has(year)) return londonHolidayCache.get(year);
  const lastMonday = (month) => {
    const last = dayString(new Date(Date.UTC(year, month, 0, 12)));
    return shiftDay(last, -((weekday(last) + 6) % 7));
  };
  const nextWeekday = (date) => {
    while ([0, 6].includes(weekday(date))) date = shiftDay(date, 1);
    return date;
  };
  const easter = dayString(easterSunday(year));
  const dates = new Set([nextWeekday(`${year}-01-01`), shiftDay(easter, -2), shiftDay(easter, 1),
    year === 2020 ? "2020-05-08" : nthWeekday(year, 5, 1, 1),
    year === 2022 ? "2022-06-02" : lastMonday(5), lastMonday(8)]);
  for (const day of [25, 26]) {
    let holiday = nextWeekday(`${year}-12-${day}`);
    while (dates.has(holiday)) holiday = nextWeekday(shiftDay(holiday, 1));
    dates.add(holiday);
  }
  if (year === 2022) { dates.add("2022-06-03"); dates.add("2022-09-19"); }
  if (year === 2023) dates.add("2023-05-08");
  londonHolidayCache.set(year, dates);
  return dates;
}
function closeMinute(date, market = "US") {
  if (market === "LSE") {
    if ([0, 6].includes(weekday(date)) || londonHolidays(Number(date.slice(0, 4))).has(date)) return null;
    // Include the scheduled five-minute closing auction before using a daily close.
    return (date.endsWith("-12-24") || date.endsWith("-12-31") ? 12 : 16) * 60 + 35;
  }
  if ([0, 6].includes(weekday(date)) || holidays(Number(date.slice(0, 4))).has(date) || exceptionalClosures.has(date)) return null;
  const thanksgiving = nthWeekday(Number(date.slice(0, 4)), 11, 4, 4);
  return date.endsWith("-07-03") || date.endsWith("-12-24") || date === shiftDay(thanksgiving, 1)
    ? 13 * 60 : 16 * 60;
}
function sessionTime(date, minute, market = "US") {
  // The local UTC offset at noon also applies throughout that day's session.
  const offsetHours = 12 - Number(localParts(new Date(`${date}T12:00:00Z`), market).hour);
  return new Date(Date.parse(`${date}T00:00:00Z`) + (minute + offsetHours * 60) * 60_000).toISOString();
}
export function quotePolicy(at = new Date(), market = "US") {
  const instant = new Date(at);
  const parts = localParts(instant, market);
  let date = `${parts.year}-${parts.month}-${parts.day}`;
  let close = closeMinute(date, market);
  const open = market === "LSE" ? 8 * 60 : 570;
  const minute = Number(parts.hour) * 60 + Number(parts.minute);
  const type = close !== null && minute >= open && minute < close ? "intraday" : "close";
  if (close === null || minute < open) {
    do { date = shiftDay(date, -1); close = closeMinute(date, market); } while (close === null);
  }
  return {
    executedAt: instant.toISOString(), type, date, market, timeZone: market === "LSE" ? "Europe/London" : "America/New_York",
    sessionOpenAt: sessionTime(date, open, market), sessionCloseAt: sessionTime(date, close, market),
  };
}
