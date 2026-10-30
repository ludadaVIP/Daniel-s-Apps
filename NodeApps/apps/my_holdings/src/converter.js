export const CONVERSION_PAIRS = [
  {
    id: "sp500",
    title: "S&P 500",
    baseSymbol: "VOO",
    baseName: "Vanguard S&P 500 ETF",
    baseVenue: "NYSE Arca",
    baseCurrency: "USD",
    baseUrl: "https://stockanalysis.com/etf/voo/history/",
    targetSymbol: "SPYL",
    targetName: "State Street SPDR S&P 500 UCITS ETF (Acc)",
    targetVenue: "London · USD",
    targetCurrency: "USD",
    targetUrl: "https://stockanalysis.com/quote/lon/SPYL/history/",
    issuerUrl:
      "https://www.ssga.com/library-content/products/factsheets/etfs/emea/factsheet-emea-en_gb-spyl-gy.pdf",
  },
  {
    id: "nasdaq100",
    title: "Nasdaq-100",
    baseSymbol: "QQQM",
    baseName: "Invesco NASDAQ 100 ETF",
    baseVenue: "NASDAQ",
    baseCurrency: "USD",
    baseUrl: "https://chartexchange.com/symbol/nasdaq-qqqm/historical/",
    targetSymbol: "CNDX",
    targetName: "iShares NASDAQ 100 UCITS ETF",
    targetVenue: "London · USD",
    targetCurrency: "USD",
    targetUrl: "https://stockanalysis.com/quote/lon/CNDX/history/",
    issuerUrl:
      "https://www.ishares.com/uk/individual/en/products/253741/ishares-nasdaq-100-ucits-etf",
  },
];

const initialObservations = {
  sp500: [
    { date: "2026-10-14", baseOpen: 712.32, baseClose: 707.43, targetOpen: 19.37, targetClose: 19.18 },
    { date: "2026-10-15", baseOpen: 704.33, baseClose: 709.43, targetOpen: 19.05, targetClose: 19.14 },
    { date: "2026-10-16", baseOpen: 710.75, baseClose: 701.61, targetOpen: 19.22, targetClose: 19.13 },
    { date: "2026-10-19", baseOpen: 705.27, baseClose: 704.60, targetOpen: 19.11, targetClose: 19.14 },
    { date: "2026-10-20", baseOpen: 704.01, baseClose: 706.80, targetOpen: 19.09, targetClose: 19.12 },
  ],
  nasdaq100: [
    { date: "2026-10-14", baseOpen: 303.89, baseClose: 300.13, targetOpen: 1756.4, targetClose: 1733.4 },
    { date: "2026-10-15", baseOpen: 295.86, baseClose: 299.79, targetOpen: 1700.4, targetClose: 1709.8 },
    { date: "2026-10-16", baseOpen: 298.70, baseClose: 292.26, targetOpen: 1721.4, targetClose: 1696.2 },
    { date: "2026-10-19", baseOpen: 296.30, baseClose: 295.78, targetOpen: 1700.2, targetClose: 1710.0 },
    { date: "2026-10-20", baseOpen: 294.52, baseClose: 295.30, targetOpen: 1696.0, targetClose: 1696.6 },
  ],
};

const median = (values) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const quantile = (values, p) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const fraction = position - lower;
  return sorted[lower] + (sorted[Math.min(lower + 1, sorted.length - 1)] - sorted[lower]) * fraction;
};

export function ratioStats(observations, method = "daily_ohlc", { robustBand = true } = {}) {
  const synchronized = method === "synchronized_intraday";
  const ratios = synchronized
    ? observations.map((row) => row.targetPrice / row.basePrice)
    : observations.flatMap((row) => [
        row.targetOpen / row.baseOpen,
        row.targetClose / row.baseClose,
      ]);
  return {
    ratio: median(ratios),
    // Synchronized observations use the middle half of matched ratios as a
    // typical reference band. Legacy daily OHLC values stay intact in storage,
    // but the UI must not present those unsynchronized extrema as useful bounds.
    lowRatio: synchronized && robustBand ? quantile(ratios, 0.25) : Math.min(...ratios),
    highRatio: synchronized && robustBand ? quantile(ratios, 0.75) : Math.max(...ratios),
    sampleCount: ratios.length,
  };
}

export function createInitialConverterState() {
  return {
    updatedAt: "2026-10-21T00:00:00.000Z",
    calibrations: CONVERSION_PAIRS.map((pair) => {
      const observations = structuredClone(initialObservations[pair.id]);
      const stats = ratioStats(observations);
      return {
        pairId: pair.id,
        method: "daily_ohlc",
        ...stats,
        observationCount: observations.length,
        asOf: observations.at(-1).date,
        updatedAt: "2026-10-21T00:00:00.000Z",
        observations,
        sources: { base: pair.baseUrl, target: pair.targetUrl },
      };
    }),
  };
}

export const INITIAL_CONVERTER_STATE = createInitialConverterState();

// Live mode derives its input on every render; historical calibration samples
// are never a substitute for the current holding quote.
export function converterInputValues(calibration, holdingQuote, draft) {
  const driver = draft?.driver || "base";
  const raw = draft ? draft.value : holdingQuote?.price == null ? "" : String(holdingQuote.price);
  const ratio = Number(calibration?.ratio);
  const value = Number(raw);
  const valid = raw !== "" && Number.isFinite(value) && value > 0 && Number.isFinite(ratio) && ratio > 0;
  const converted = valid ? (driver === "base" ? value * ratio : value / ratio).toFixed(4) : "";
  return { driver, base: driver === "base" ? raw : converted, target: driver === "target" ? raw : converted };
}

export function calibrationAccuracy(calibration) {
  if (calibration?.method !== "synchronized_intraday" || !(calibration.ratio > 0)) return null;
  const errors = (calibration.observations || [])
    .filter((row) => row.basePrice > 0 && row.targetPrice > 0)
    .map((row) => Math.abs((row.basePrice * calibration.ratio / row.targetPrice - 1) * 100));
  return errors.length ? { medianAbsolutePct: median(errors), maxAbsolutePct: Math.max(...errors) } : null;
}
