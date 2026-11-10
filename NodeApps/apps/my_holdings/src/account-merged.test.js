import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeAccountHoldings } from "./positions.js";

const position = (overrides = {}) => ({ id: "d", accountId: "a1", symbol: "VOO", currency: "USD", quantity: 10, cost: 1001, marketValue: 1201, price: 120, ...overrides });

test("cross-account view weights actual costs and preserves saved values without changing positions", () => {
  const holdings = Object.freeze([
    Object.freeze(position()),
    Object.freeze(position({ id: "r", accountId: "a2", symbol: " voo ", quantity: 30, cost: 3303, marketValue: 3903, price: 130 })),
  ]);
  const [merged] = mergeAccountHoldings(holdings);
  assert.equal(merged.symbol, "VOO");
  assert.equal(merged.quantity, 40);
  assert.equal(merged.cost, 4304);
  assert.equal(merged.averagePrice, 107.6);
  assert.equal(merged.marketValue, 5104);
  assert.equal(merged.pnl, 800);
  assert.equal(merged.returnPct, 800 / 4304 * 100);
  assert.deepEqual(merged.sources, holdings);
  assert.equal(holdings[1].symbol, " voo ");
  assert.equal(holdings[0].quantity, 10);
});

test("same symbol in different currencies stays separate, with fractional shares and zero cost supported", () => {
  const result = mergeAccountHoldings([
    position({ quantity: 0.1, cost: 0 }),
    position({ id: "r", accountId: "a2", quantity: 0.2, cost: 0 }),
    position({ id: "hk", currency: "HKD", quantity: 5, cost: 99 }),
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[0].quantity, 0.3);
  assert.equal(result[0].averagePrice, 0);
  assert.equal(result[0].returnPct, 0);
  assert.equal(result[1].currency, "HKD");
  assert.equal(result[1].quantity, 5);
  assert.deepEqual(mergeAccountHoldings([]), []);
  assert.equal(mergeAccountHoldings([position({ quantity: 0, cost: 0 })])[0].averagePrice, 0);
});
