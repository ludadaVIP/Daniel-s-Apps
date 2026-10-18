import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate, contextPack, observations } from "./model.js";
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
