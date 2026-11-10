const clean = (value) => String(value || "").normalize("NFKC").trim();
export const normalizeWatchSymbol = (value) => clean(value).toUpperCase();
export const symbolFromWatchInput = (value) => /^[A-Za-z][A-Za-z0-9.-]{0,14}$/.test(clean(value)) ? normalizeWatchSymbol(value) : "";
export function watchIdentityKey(watch) {
  const symbol = normalizeWatchSymbol(watch.symbol || watch.research?.identity?.symbol || symbolFromWatchInput(watch.name));
  return symbol ? `symbol:${symbol}` : `name:${clean(watch.name).replace(/\s+/g, " ").toLowerCase()}`;
}
export function findDuplicateWatch(watchlist, candidate) {
  const key = watchIdentityKey(candidate);
  return watchlist.find((watch) => watch.id !== candidate.id && watchIdentityKey(watch) === key);
}
