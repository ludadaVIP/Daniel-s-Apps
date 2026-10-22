import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate, contextPack, observations, holdingQuoteLabel } from "./model.js";
import { previewBuy, consolidateHoldings } from "./positions.js";
import { hasCompleteResearch, undoableWatchRefreshIds } from "./quotes.js";
const seed = () =>
  JSON.parse(
    fs.readFileSync(
      new URL("../data/initial-state.json", import.meta.url),
      "utf8",
    ),
  );
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.00001, `${a} != ${b}`);
test("screenshot totals and cross-account aggregation preserve source market values", () => {
  const s = seed(),
    m = calculate(s);
  near(m.value, 94340.05);
  near(m.cost, 94997.59);
  near(m.pnl, -657.54);
  assert.equal(m.groups.length, 5);
  const voo = m.groups.find((g) => g.symbol === "VOO");
  assert.equal(voo.quantity, 115);
  near(voo.value, 80466.65);
  near(calculate(s, "a1").value, 37870.29);
  near(calculate(s, "a2").value, 56469.76);
  assert.equal(s.holdings[1].marketValue, 542);
  assert.notEqual(
    s.holdings[1].marketValue,
    s.holdings[1].quantity * s.holdings[1].price,
  );
});
test("currency pools, outflows and reserve do not silently assume a missing FX rate", () => {
  const s = seed();
  s.cash = [
    { currency: "NZD", amount: 2000 },
    { currency: "USD", amount: 1000 },
    { currency: "USD", amount: -300 },
  ];
  s.goals.reserve = 200;
  let m = calculate(s);
  near(m.cash, 700);
  near(m.available, 500);
  assert.equal(m.pendingCash[0][0], "NZD");
  s.fx.NZD = 0.6;
  m = calculate(s);
  near(m.cash, 1900);
  near(m.available, 1700);
  s.goals.currency = "CNY";
  assert.equal(calculate(s).available, null);
  s.fx.CNY = 0.14;
  near(calculate(s).available, 1872);
});
test("unconverted holdings are explicit and no empty portfolio produces NaN", () => {
  const s = seed();
  s.holdings[0].currency = "NZD";
  const m = calculate(s);
  assert.equal(m.unconverted, 1);
  near(m.value, 88498.71);
  s.holdings = [];
  const n = calculate(s);
  assert.equal(n.returnPct, 0);
  assert.deepEqual(n.groups, []);
});
test("AI context contains full records and unknown-date constraints without invented assumptions", () => {
  const s = seed();
  const p = contextPack(s, "watch", "微软");
  for (const x of [
    "微软",
    "2.0289",
    "5924.23",
    "priceDate",
    "cashLedger",
    "税务居民地或未来资金需求未提供时标明未知",
    "UTF-8",
  ])
    assert.ok(p.includes(x), x);
  assert.ok(observations(s).some((o) => o.title.includes("市值与")));
});
test("saved intraday prices show their actual Eastern timestamp and remain snapshots in AI context", () => {
  const s = seed();
  const holding = s.holdings[0];
  assert.equal(holdingQuoteLabel(holding), "尚未刷新价格");
  Object.assign(holding, {
    priceDate: "2026-10-20", priceType: "intraday", priceAsOf: "2026-10-20T15:04:59.000Z",
    priceFetchedAt: "2026-10-20T15:05:00.000Z", priceSource: "测试行情", priceSourceUrl: "https://example.com/",
  });
  assert.equal(holdingQuoteLabel(holding), "2026-10-20 · 盘中价 11:04:59 美东 · 测试行情");
  const context = contextPack(s);
  assert.match(context, /priceType/);
  assert.match(context, /2026-10-20T15:04:59.000Z/);
  assert.match(context, /不会自动刷新/);
  assert.match(context, /不可直接称为此刻实时行情/);
  delete holding.priceType;
  delete holding.priceAsOf;
  assert.equal(holdingQuoteLabel(holding), "2026-10-20 · 收盘价 · 测试行情");
  delete holding.priceSource;
  assert.equal(holdingQuoteLabel(holding), "2026-10-20 · 报价");
});
test("buy preview weights actual total costs, includes fees, and keeps other accounts separate", () => {
  const s = seed();
  Object.assign(s.holdings[0], { price: 298.64, priceDate: "2026-10-21", priceSource: "已保存报价" });
  const preview = previewBuy(s.holdings, { accountId: "a1", symbol: " qqqm ", currency: "USD", quantity: 50, price: 290, fees: 1 });
  assert.equal(preview.existing.id, "h1");
  assert.equal(preview.quantity, 70);
  assert.equal(preview.cost, 20425.23);
  assert.equal(preview.addedCost, 14501);
  near(preview.averagePrice, 20425.23 / 70);
  assert.equal(preview.marketValue, 20904.8);
  assert.equal(preview.quote.price, 298.64);
  assert.equal(s.holdings[4].quantity, 20);
  const differentCurrency = previewBuy(s.holdings, { accountId: "a1", symbol: "QQQM", currency: "HKD", quantity: 50, price: 290 });
  assert.equal(differentCurrency.existing, undefined);
  assert.equal(differentCurrency.quantity, 50);
});
test("legacy duplicate consolidation ignores a newer zero quote, preserves raw rows, and is idempotent", () => {
  const s = seed();
  Object.assign(s.holdings[0], { price: 298.64, priceDate: "2026-10-21", priceSource: "已保存报价" });
  const added = { ...s.holdings[0], id: "new-buy", symbol: "qqqm", quantity: 50, cost: 14500, averagePrice: 290, price: 0, priceDate: "2026-10-23", marketValue: 0 };
  const rows = [...s.holdings, added];
  const result = consolidateHoldings(rows);
  assert.equal(result.holdings.length, 7);
  assert.equal(result.merges.length, 1);
  const holding = result.holdings.find((h) => h.id === "h1");
  assert.equal(holding.quantity, 70);
  assert.equal(holding.cost, 20424.23);
  near(holding.averagePrice, 20424.23 / 70);
  assert.equal(holding.price, 298.64);
  assert.equal(holding.marketValue, 20904.8);
  assert.equal(result.merges[0].originals[1], added);
  assert.equal(rows[0].quantity, 20);
  assert.equal(consolidateHoldings(result.holdings).merges.length, 0);
});
test("purchase estimates are explicitly distinguished from market quotes", () => {
  const s = seed();
  Object.assign(s.holdings[0], { priceType: "purchase", price: 290, priceDate: "", priceSource: "买入价暂估" });
  assert.equal(holdingQuoteLabel(s.holdings[0]), "买入价暂估 · 待刷新行情");
  assert.match(contextPack(s), /purchase 表示按买入价暂估市值/);
});
test("complete watch research requires details and a report; batch undo excludes started and unrelated work", () => {
  assert.equal(hasCompleteResearch({ research: { summary: "仅摘要", details: "" }, report: "research/a.html" }), false);
  assert.equal(hasCompleteResearch({ research: { details: "完整内容" } }), false);
  assert.equal(hasCompleteResearch({ research: { details: "完整内容" }, report: "research/a.html" }), true);
  const state = { jobs: [
    { id: "old", kind: "watch", status: "waiting" },
    { id: "price", kind: "watch-quotes", status: "waiting", origin: "watch-refresh", batchId: "batch" },
    { id: "initial", kind: "watch", status: "waiting", origin: "watch-refresh", batchId: "batch" },
    { id: "started", kind: "watch-quotes", status: "waiting", origin: "watch-refresh", batchId: "batch", quotePolicy: { executedAt: "now" } },
  ] };
  assert.deepEqual(undoableWatchRefreshIds(state), ["price", "initial"]);
  assert.deepEqual(undoableWatchRefreshIds(state, ["price", "initial", "started"]), ["price", "initial"]);
  assert.deepEqual(undoableWatchRefreshIds(state, ["completed"]), []);
  assert.equal(holdingQuoteLabel({ price: 1674, priceDate: "2026-10-22", priceType: "close", priceAsOf: "2026-10-22T15:35:00.000Z", priceTimeZone: "Europe/London" }), "2026-10-22 · 收盘价 16:35:00 伦敦");
});
