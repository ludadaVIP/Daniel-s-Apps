import test from "node:test";
import assert from "node:assert/strict";
import { converterInputValues, calibrationAccuracy } from "./converter.js";
import { latestHoldingQuote } from "./positions.js";

test("converter follows refreshed holdings, selecting the newest account quote", () => {
  const holdings = [
    { symbol: "VOO", currency: "USD", price: 709.63, priceAsOf: "2026-10-21T15:25:00Z" },
    { symbol: "VOO", currency: "USD", price: 694.88, priceAsOf: "2026-10-30T20:40:00Z" },
    { symbol: "VOO", currency: "NZD", price: 1200, priceAsOf: "2026-10-30T21:00:00Z" },
  ];
  const calibration = { ratio: 0.027 };
  assert.equal(converterInputValues(calibration, latestHoldingQuote(holdings, "VOO", "USD")).base, "694.88");
  holdings[1] = { ...holdings[1], price: 700, priceAsOf: "2026-10-30T21:00:00Z" };
  assert.equal(converterInputValues(calibration, latestHoldingQuote(holdings, "VOO", "USD")).target, "18.9000");
});

test("missing holdings never seed prices from historical calibration observations", () => {
  const calibration = { ratio: 5.7, observations: [{ basePrice: 298.43 }] };
  assert.deepEqual(converterInputValues(calibration, undefined), { driver: "base", base: "", target: "" });
  assert.equal(latestHoldingQuote([{ symbol: "QQQM", currency: "USD", price: 300, priceType: "purchase" }], "QQQM", "USD"), undefined);
});

test("manual reverse conversion survives ratio updates and can return to holdings", () => {
  const quote = { price: 284.459 };
  const draft = { driver: "target", value: "1800" };
  assert.equal(converterInputValues({ ratio: 6 }, quote, draft).base, "300.0000");
  assert.equal(converterInputValues({ ratio: 5 }, quote, draft).base, "360.0000");
  assert.equal(converterInputValues({ ratio: 6 }, quote).base, "284.459");
  assert.equal(converterInputValues({ ratio: 6 }, quote, { driver: "base", value: "" }).target, "");
});

test("accuracy reports the largest observed miss instead of treating the middle band as an error bound", () => {
  const result = calibrationAccuracy({ method: "synchronized_intraday", ratio: 2, observations: [
    { basePrice: 100, targetPrice: 200 }, { basePrice: 100, targetPrice: 200 }, { basePrice: 100, targetPrice: 250 },
  ] });
  assert.equal(result.medianAbsolutePct, 0);
  assert.ok(Math.abs(result.maxAbsolutePct - 20) < 1e-10);
});
