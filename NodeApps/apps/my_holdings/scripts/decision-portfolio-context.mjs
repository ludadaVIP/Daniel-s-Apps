import fs from "node:fs/promises";
import { lookThrough, validateFundHoldings } from "../src/lookthrough.js";
import { usd } from "../src/model.js";

const state = JSON.parse(await fs.readFile(new URL("../data/state.json", import.meta.url), "utf8"));
const funds = validateFundHoldings(JSON.parse(await fs.readFile(new URL("../data/fund-holdings.json", import.meta.url), "utf8")));
const portfolio = lookThrough(state.holdings, funds, { fx: state.fx });
const target = String(process.argv[2] || "").toUpperCase().replaceAll("/", ".");
if (!target) throw new Error("Supply one stock symbol; this helper is read-only.");
const company = portfolio.rows.find((r) => r.symbols.includes(target));
const symbols = new Set(company?.symbols || [target]);
const orders = (state.orders || []).filter((o) => symbols.has(o.symbol.toUpperCase().replaceAll("/", ".")) && o.side === "buy" && ["draft", "working", "partial"].includes(o.status))
  .map((o) => ({ id: o.id, symbol: o.symbol, status: o.status, orderType: o.orderType,
    remainingQuantity: Math.max(0, o.quantity - o.filledQuantity), limitPrice: o.limitPrice,
    currency: o.currency, potentialUsd: o.orderType === "limit" ? usd(Math.max(0, o.quantity - o.filledQuantity) * o.limitPrice, o.currency, state.fx) : null }));
console.log(JSON.stringify({ symbol: target, stateUpdatedAt: state.updatedAt, capitalBasisUsd: 400000,
  company: company || { symbols: [target], value: 0, directValue: 0, contributions: [] },
  fundsUsed: portfolio.usedFunds.map((f) => ({ symbol: f.symbol, asOf: f.asOf, stale: f.stale, sourceUrl: f.sourceUrl, heldValue: f.value })),
  quoteDates: portfolio.priceDates, missingFundOrFxCoverage: portfolio.excluded,
  pendingBuys: orders, pendingKnownLimitBuyUsd: orders.reduce((sum, o) => sum + (o.potentialUsd || 0), 0),
  allPortfolioTop10: portfolio.top10.map((c) => ({ symbols: c.symbols, value: c.value })),
  note: "保存行情与历史成分的估算，不是券商实时资产/冻结金额；未知基金或汇率会影响敞口完整性，市场单不能估计固定金额。"
}, null, 2));
