import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { lookThrough, validateFundHoldings } from "./lookthrough.js";

const equity = (symbol, weightPct) => ({ symbol, name: symbol, weightPct, assetType: "equity" });
const fund = (symbol, holdings) => ({ symbol, complete: true, asOf: "2026-09-30", retrievedAt: "2026-10-26T00:00:00Z", source: "Issuer", sourceUrl: "https://issuer.example/holdings", holdings });
const data = () => ({ version: 1, funds: [
  fund("VOO", [equity("GOOGL", 10), equity("NVDA", 30), equity("OTHER", 60)]),
  fund("QQQM", [equity("GOOG", 15), equity("GOOGL", 5), equity("NVDA", 20), equity("AMZN", 50), { symbol: "USD", name: "Cash", weightPct: 10, assetType: "cash" }]),
  fund("VGT", [equity("NVDA", 100)]),
] });
const position = (symbol, value, accountId = "a") => ({ symbol, name: symbol, accountId, currency: "USD", quantity: value / 10, price: 10, marketValue: value, priceDate: "2026-10-26" });
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);

test("cross-account fund overlap and direct holdings aggregate without double-counting share classes", () => {
  const holdings = [position("VOO", 1000), position("VOO", 2000, "b"), position("QQQM", 500), position("NVDA", 100)];
  const original = JSON.stringify(holdings), weights = data();
  validateFundHoldings(weights);
  const r = lookThrough(holdings, weights);
  near(r.totalValue, 3600);
  const nvda = r.rows.find(c => c.key === "NVDA"), alphabet = r.rows.find(c => c.key === "ALPHABET");
  near(nvda.value, 1100); near(nvda.weight, 1100 / 3600 * 100); near(nvda.directValue, 100);
  assert.equal(nvda.fundCount, 2); assert.equal(nvda.contributions.length, 3);
  near(alphabet.value, 400); assert.deepEqual(alphabet.symbols, ["GOOG", "GOOGL"]);
  near(alphabet.contributions.find(c => c.symbol === "QQQM").fundWeightPct, 20);
  near(nvda.contributions.find(c => c.symbol === "VOO").fundWeightPct, 30);
  near(r.residualValue, 50); assert.equal(r.usedFunds.length, 2);
  near(lookThrough(holdings, weights, { accountId: "b" }).totalValue, 2000);
  near(lookThrough(holdings, weights, { accountId: "b" }).rows.find(c => c.key === "NVDA").value, 600);
  assert.equal(JSON.stringify(holdings), original);
});

test("quantities, prices and newly purchased VGT recalculate immediately; cost does not affect exposure", () => {
  const h = position("VOO", 1000), weights = data();
  near(lookThrough([h], weights).rows.find(c => c.key === "NVDA").value, 300);
  h.quantity *= 2; h.cost = 99999;
  near(lookThrough([h], weights).rows.find(c => c.key === "NVDA").value, 600);
  h.price = 20;
  near(lookThrough([h], weights).rows.find(c => c.key === "NVDA").value, 1200);
  const r = lookThrough([h, position("VGT", 1000)], weights);
  near(r.rows.find(c => c.key === "NVDA").value, 2200); assert.equal(r.usedFunds.length, 2);
});

test("ranking uses full disclosed portfolios before selecting ten companies", () => {
  const funds = ["AAA", "BBB"].map(symbol => fund(symbol, [...Array.from({ length: 10 }, (_, i) => equity(`${symbol}${i}`, 9.1)), equity("SHARED", 9)]));
  const weights = { version: 1, funds }; validateFundHoldings(weights);
  const r = lookThrough([position("AAA", 1000), position("BBB", 1000)], weights);
  assert.equal(r.rows.length, 21); assert.equal(r.top10.length, 10); assert.equal(r.top10[0].key, "SHARED");
  near(r.top10[0].value, 180);
});

test("cash, money markets, futures, rights and null weights do not become corporate stock exposure", () => {
  const f = fund("SOXX", [equity("NVDA", 99), { symbol: "XTSLA", name: "Treasury money market", weightPct: .5, assetType: "money_market_fund" },
    { symbol: "NQZ6", name: "Future", weightPct: .1, assetType: "derivative", notionalValueUsd: 5000 },
    { symbol: "USD", name: "Cash", weightPct: .4, assetType: "cash" }, { symbol: "CVR", name: "Right", weightPct: null, assetType: "contingent_value_right" }]);
  const weights = { version: 1, funds: [f] }; validateFundHoldings(weights);
  const r = lookThrough([position("SOXX", 1000)], weights);
  assert.equal(r.rows.length, 1); near(r.rows[0].value, 990); near(r.residualValue, 10);
});

test("uncovered ETFs and missing FX are explicit and do not masquerade as direct stocks", () => {
  const unknown = { ...position("NEW", 1000), name: "New Index ETF" };
  const foreign = { ...position("STOCK", 100), currency: "NZD" };
  let r = lookThrough([position("VOO", 1000), unknown, foreign], data());
  near(r.totalValue, 2000); near(r.unclassifiedValue, 1000); assert.equal(r.excluded.length, 2);
  assert.ok(!r.rows.some(c => ["NEW", "STOCK"].includes(c.key)));
  r = lookThrough([foreign], data(), { fx: { NZD: .6 } }); near(r.totalValue, 60); near(r.rows[0].value, 60);
  r = lookThrough([position("VTI", 500)], data(), { fundSymbols: ["VTI"] });
  assert.equal(r.rows.length, 0); near(r.unclassifiedValue, 500);
});

test("snapshot dates stay visible and old disclosure is flagged without replacing it with today's date", () => {
  const r = lookThrough([position("VOO", 1000)], data(), { now: new Date("2026-11-16T00:00:00Z") });
  assert.equal(r.usedFunds[0].asOf, "2026-09-30"); assert.equal(r.usedFunds[0].stale, true);
  assert.deepEqual(r.priceDates, ["2026-10-26"]);
});

test("snapshot validation rejects truncated, duplicate and missing stock weights without renormalizing valid data", () => {
  const invalid = mutate => { const d = data(); mutate(d); assert.throws(() => validateFundHoldings(d)); };
  invalid(d => d.funds[0].holdings.pop());
  invalid(d => d.funds[0].holdings.push(equity("NVDA", 1)));
  invalid(d => d.funds[0].holdings[0].weightPct = null);
  invalid(d => d.funds[0].holdings[0].weightPct = -1);
  invalid(d => d.funds[0].sourceUrl = "http://issuer.example");
  invalid(d => d.funds[0].asOf = "2027-01-01");
  invalid(d => d.funds[0].asOf = "2026-02-31");
  invalid(d => d.funds[0].complete = false);
  const d = data(); d.funds[0].holdings[0].weightPct += .02;
  validateFundHoldings(d); near(d.funds[0].holdings.reduce((n, h) => n + h.weightPct, 0), 100.02);
});

test("shipped snapshots cover all five requested funds with full, validated issuer disclosures", () => {
  const d = JSON.parse(fs.readFileSync(new URL("../data/fund-holdings.json", import.meta.url), "utf8"));
  validateFundHoldings(d);
  assert.ok(["QQQM", "SMH", "SOXX", "VGT", "VOO"].every(s => d.funds.some(f => f.symbol === s)));
  assert.ok(d.funds.find(f => f.symbol === "VOO").holdings.filter(h => h.assetType === "equity").length >= 490);
});
