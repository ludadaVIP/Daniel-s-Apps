export const normalizeSymbol = (symbol) => symbol.trim().toUpperCase();
export const positionKey = (holding) => JSON.stringify([holding.accountId, normalizeSymbol(holding.symbol), holding.currency]);
export const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// A read-only view across accounts: preserve each account's saved value and cost.
export function mergeAccountHoldings(holdings) {
  const groups = new Map();
  for (const holding of holdings) {
    const symbol = normalizeSymbol(holding.symbol);
    const key = JSON.stringify([symbol, holding.currency]);
    if (!groups.has(key)) groups.set(key, { key, symbol, name: holding.name, sector: holding.sector, currency: holding.currency, quantity: 0, cost: 0, marketValue: 0, sources: [] });
    const group = groups.get(key);
    group.quantity += holding.quantity;
    group.cost += holding.cost;
    group.marketValue += holding.marketValue;
    group.sources.push(holding);
  }
  return [...groups.values()].map((group) => {
    const quantity = Number(group.quantity.toFixed(10));
    const cost = roundMoney(group.cost), marketValue = roundMoney(group.marketValue);
    return { ...group, quantity, cost, marketValue, averagePrice: quantity > 0 ? cost / quantity : 0, pnl: roundMoney(marketValue - cost), returnPct: cost ? (marketValue - cost) / cost * 100 : 0 };
  });
}

const quoteKeys = ["price", "priceDate", "priceSource", "priceSourceUrl", "priceType", "priceSession", "priceTimeZone", "priceAsOf", "priceFetchedAt", "changePct"];

export function latestHoldingQuote(holdings, symbol, currency) {
  return holdings.filter((h) => normalizeSymbol(h.symbol) === normalizeSymbol(symbol) && h.currency === currency && h.price > 0 && h.priceType !== "purchase")
    .sort((a, b) => (b.priceAsOf || b.priceDate || "").localeCompare(a.priceAsOf || a.priceDate || ""))[0];
}
export function applyHoldingQuote(holding, quote, fallbackPrice) {
  const result = { ...holding };
  for (const key of quoteKeys) delete result[key];
  if (quote) {
    for (const key of quoteKeys) if (quote[key] !== undefined) result[key] = quote[key];
  } else {
    Object.assign(result, { price: fallbackPrice, priceDate: "", priceType: "purchase", priceSource: "买入价暂估", changePct: null });
  }
  result.marketValue = roundMoney(result.quantity * result.price);
  return result;
}
export function previewBuy(holdings, buy) {
  const existing = holdings.find((h) => positionKey(h) === positionKey(buy));
  const quantity = Number(((existing?.quantity || 0) + Number(buy.quantity || 0)).toFixed(10));
  const addedCost = roundMoney(Number(buy.quantity || 0) * Number(buy.price || 0) + Number(buy.fees || 0));
  const cost = roundMoney((existing?.cost || 0) + addedCost);
  const quote = latestHoldingQuote(holdings, buy.symbol, buy.currency);
  return { existing, quote, quantity, addedCost, cost, averagePrice: quantity > 0 ? cost / quantity : 0, marketValue: roundMoney(quantity * (quote?.price || Number(buy.price || 0))) };
}
export function consolidateHoldings(holdings) {
  const groups = new Map();
  for (const holding of holdings) {
    const key = positionKey(holding);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(holding);
  }
  const merges = [];
  const consolidated = [...groups.values()].map((rows) => {
    if (rows.length === 1) return rows[0];
    const quantity = Number(rows.reduce((sum, h) => sum + h.quantity, 0).toFixed(10));
    const cost = roundMoney(rows.reduce((sum, h) => sum + h.cost, 0));
    const averagePrice = quantity > 0 ? cost / quantity : 0;
    const holding = applyHoldingQuote({ ...rows[0], symbol: normalizeSymbol(rows[0].symbol), quantity, cost, averagePrice }, latestHoldingQuote(rows, rows[0].symbol, rows[0].currency), averagePrice);
    merges.push({ holding, originals: rows });
    return holding;
  });
  return { holdings: consolidated, merges };
}
