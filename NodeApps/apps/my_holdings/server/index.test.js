import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHoldingsApp } from "./index.js";
import { quotePolicy } from "./market-session.js";
const research = {
  identity: {
    name: "微软",
    symbol: "MSFT",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "软件",
  },
  title: "验证报告 <script>",
  summary: "摘要",
  details: "持仓分析",
  risks: ["波动"],
  catalysts: ["待核实"],
  sources: [{ label: "官方", url: "https://example.com/" }],
  uncertainty: "日期未知",
};
async function setup(t, options = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "holdings-test-"));
  const app = await createHoldingsApp({ dataDirectory: dir, ...options });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(async () => {
    await new Promise((r) => server.close(r));
    await fs.rm(dir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (url, body, method) => {
    const r = await fetch(base + url, {
      method: method || (body ? "POST" : "GET"),
      headers: body ? { "Content-Type": "application/json" } : {},
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: r.status, data: await r.json() };
  };
  return { dir, base, call };
}
test("CRUD persistence, revision conflicts and backup recovery reject invalid financial data", async (t) => {
  const { call, dir } = await setup(t);
  const a = (await call("/api/state")).data;
  const initialBackups = (await fs.readdir(path.join(dir, "backups"))).length;
  assert.equal(a.holdings.length, 7);
  const stale = structuredClone(a);
  a.holdings.push({
    ...a.holdings[0],
    id: "test",
    symbol: "TEST",
    marketValue: 100,
  });
  const saved = await call("/api/state", a, "PUT");
  assert.equal(saved.status, 200);
  assert.equal(saved.data.holdings.length, 8);
  assert.equal(saved.data.revision, a.revision + 1);
  assert.equal((await call("/api/state", stale, "PUT")).status, 409);
  const invalid = structuredClone(saved.data);
  invalid.holdings[0].cost = -1;
  assert.equal((await call("/api/state", invalid, "PUT")).status, 400);
  const edited = structuredClone(saved.data);
  edited.holdings[0].thesis = "理由";
  const r = await call("/api/state", edited, "PUT");
  assert.equal(r.status, 200);
  const removed = structuredClone(r.data);
  removed.holdings = removed.holdings.filter((h) => h.id !== "test");
  assert.equal(
    (await call("/api/state", removed, "PUT")).data.holdings.length,
    7,
  );
  const backups = await fs.readdir(path.join(dir, "backups"));
  assert.equal(backups.length, initialBackups + 3);
  const restored = await call("/api/restore", { revision: r.data.revision + 1, state: stale });
  assert.equal(restored.status, 200);
  assert.equal(restored.data.holdings[0].thesis, "");
});
test("recording a buy merges only its account and currency, weights total costs and is safe to retry", async (t) => {
  const { call } = await setup(t);
  const before = (await call("/api/state")).data;
  before.holdings[0].price = 298.64;
  before.holdings[0].priceDate = "2026-10-21";
  before.holdings[0].priceSource = "测试行情";
  const current = (await call("/api/state", before, "PUT")).data;
  const buy = { id: "buy-qqqm", revision: current.revision, accountId: "a1", symbol: " qqqm ", currency: "USD", quantity: 50, price: 290, fees: 1, date: "2026-10-23" };
  const result = await call("/api/holdings/buy", buy);
  assert.equal(result.status, 200);
  assert.equal(result.data.merged, true);
  assert.equal(result.data.state.holdings.length, 7);
  const holding = result.data.holding;
  assert.equal(holding.id, "h1");
  assert.equal(holding.quantity, 70);
  assert.equal(holding.cost, 20425.23);
  assert.equal(holding.averagePrice, 20425.23 / 70);
  assert.equal(holding.marketValue, 20904.8);
  assert.equal(holding.price, 298.64);
  assert.equal(holding.priceDate, "2026-10-21");
  assert.deepEqual(result.data.state.holdings.find((h) => h.id === "h5"), current.holdings.find((h) => h.id === "h5"));
  assert.deepEqual(result.data.state.cash, current.cash);
  assert.equal(result.data.state.holdingTrades.length, 1);
  assert.equal(result.data.state.holdingTrades[0].cost, 14501);
  const replayed = await call("/api/holdings/buy", buy);
  assert.equal(replayed.status, 200);
  assert.equal(replayed.data.duplicate, true);
  assert.equal(replayed.data.state.revision, result.data.state.revision);
  assert.equal(replayed.data.holding.quantity, 70);
  assert.equal((await call("/api/holdings/buy", { ...buy, price: 291 })).status, 409);
  const corrected = structuredClone(result.data.state);
  corrected.holdings[0].thesis = "保留持仓修正与历史买入的区别";
  corrected.holdingTrades = [];
  const saved = await call("/api/state", corrected, "PUT");
  assert.equal(saved.status, 200);
  assert.equal(saved.data.holdingTrades.length, 1);
});
test("first buys use an explicit estimate or a saved quote, with fractional shares and currency separation", async (t) => {
  const { call } = await setup(t);
  let state = (await call("/api/state")).data;
  const bought = await call("/api/holdings/buy", { id: "buy-new", revision: state.revision, accountId: "a1", symbol: "NEW", currency: "USD", quantity: 0.125, price: 100, fees: 0.01, date: "2026-10-23" });
  assert.equal(bought.status, 200);
  assert.equal(bought.data.holding.cost, 12.51);
  assert.equal(bought.data.holding.quantity, 0.125);
  assert.equal(bought.data.holding.price, 100);
  assert.equal(bought.data.holding.priceType, "purchase");
  assert.equal(bought.data.holding.priceDate, "");
  assert.equal(bought.data.holding.marketValue, 12.5);
  state = bought.data.state;
  const separate = await call("/api/holdings/buy", { id: "buy-other-currency", revision: state.revision, accountId: "a1", symbol: "QQQM", currency: "HKD", quantity: 5, price: 300, date: "2026-10-23" });
  assert.equal(separate.status, 200);
  assert.equal(separate.data.merged, false);
  assert.equal(separate.data.holding.quantity, 5);
  assert.equal(separate.data.holding.priceType, "purchase");
  assert.equal(separate.data.state.holdings.find((h) => h.id === "h1").quantity, 20);
  assert.equal(separate.data.state.holdings.find((h) => h.id === "h5").quantity, 20);
  const sharedQuote = await call("/api/holdings/buy", { id: "buy-same-symbol-new-account", revision: separate.data.state.revision, accountId: "a2", symbol: "SMH", currency: "USD", quantity: 2, price: 500, date: "2026-10-23" });
  assert.equal(sharedQuote.status, 200);
  assert.equal(sharedQuote.data.merged, false);
  assert.equal(sharedQuote.data.holding.price, state.holdings.find((h) => h.symbol === "SMH").price);
  assert.equal(sharedQuote.data.holding.name, "VanEck Semiconductor ETF");
});
test("invalid or stale buys do not change holdings, and duplicate position edits are rejected", async (t) => {
  const { call } = await setup(t);
  const state = (await call("/api/state")).data;
  const buy = { id: "valid-buy", revision: state.revision, accountId: "a1", symbol: "QQQM", currency: "USD", quantity: 50, price: 290, date: "2026-10-23" };
  for (const bad of [{ quantity: 0 }, { price: 0 }, { fees: -1 }, { quantity: "50" }, { date: "" }, { symbol: " " }, { quantity: 1e14, price: 1e14 }]) {
    assert.equal((await call("/api/holdings/buy", { ...buy, ...bad })).status, 400, JSON.stringify(bad));
  }
  assert.equal((await call("/api/holdings/buy", { ...buy, accountId: "unknown" })).status, 404);
  assert.equal((await call("/api/holdings/buy", { ...buy, revision: state.revision - 1 })).status, 409);
  const duplicate = structuredClone(state);
  duplicate.holdings.push({ ...duplicate.holdings[0], id: "duplicate", symbol: " qqqm " });
  assert.equal((await call("/api/state", duplicate, "PUT")).status, 400);
  const after = (await call("/api/state")).data;
  assert.deepEqual(after.holdings, state.holdings);
  assert.equal(after.revision, state.revision);
});
test("concurrent repeated buy requests count once and different stale requests cannot lose updates", async (t) => {
  const { call } = await setup(t);
  const state = (await call("/api/state")).data;
  const buy = { id: "same-buy", revision: state.revision, accountId: "a1", symbol: "QQQM", currency: "USD", quantity: 50, price: 290, date: "2026-10-23" };
  const requests = await Promise.all([call("/api/holdings/buy", buy), call("/api/holdings/buy", buy)]);
  assert.deepEqual(requests.map((result) => result.status), [200, 200]);
  const after = (await call("/api/state")).data;
  assert.equal(after.holdings[0].quantity, 70);
  assert.equal(after.holdingTrades.length, 1);
  const conflicting = await Promise.all([
    call("/api/holdings/buy", { ...buy, id: "next-buy-1", revision: after.revision }),
    call("/api/holdings/buy", { ...buy, id: "next-buy-2", revision: after.revision }),
  ]);
  assert.deepEqual(conflicting.map((result) => result.status).sort(), [200, 409]);
  assert.equal((await call("/api/state")).data.holdings[0].quantity, 120);
});
test("old duplicate holdings are consolidated on restore and keep their full original records", async (t) => {
  const { call } = await setup(t);
  const state = (await call("/api/state")).data;
  const legacy = structuredClone(state);
  Object.assign(legacy.holdings[0], { price: 298.64, priceDate: "2026-10-21", priceSource: "测试行情" });
  const addition = { ...legacy.holdings[0], id: "old-new-qqqm", quantity: 50, averagePrice: 290, cost: 14500, price: 0, marketValue: 0, priceDate: "2026-10-23" };
  legacy.holdings.push(addition);
  const restored = await call("/api/restore", { revision: state.revision, state: legacy });
  assert.equal(restored.status, 200);
  assert.equal(restored.data.holdings.length, 7);
  assert.equal(restored.data.holdings[0].quantity, 70);
  assert.equal(restored.data.holdings[0].cost, 20424.23);
  assert.equal(restored.data.holdings[0].averagePrice, 20424.23 / 70);
  assert.equal(restored.data.holdings[0].marketValue, 20904.8);
  assert.equal(restored.data.holdingTrades.length, 2);
  assert.deepEqual(restored.data.holdingTrades.find((trade) => trade.originalHolding?.id === addition.id).originalHolding, addition);
  const again = await call("/api/restore", { revision: restored.data.revision, state: restored.data });
  assert.equal(again.status, 200);
  assert.equal(again.data.holdingTrades.length, 2);
  assert.equal(again.data.holdings[0].quantity, 70);
});
test("HTML import preserves bytes, discovers nested folders, blocks overwrite and path traversal", async (t) => {
  const { call, base } = await setup(t);
  const html =
    "<!doctype html><html><title>研究档案</title><body><h1>研究</h1><script>console.log(1)</script></body></html>";
  assert.equal(
    (
      await call("/api/reports/import", {
        name: "研究.html",
        folder: "market",
        html,
      })
    ).status,
    201,
  );
  assert.equal(
    (
      await call("/api/reports/import", {
        name: "研究.html",
        folder: "market",
        html,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await call("/api/reports/import", {
        name: "../escape.html",
        folder: "market",
        html,
      })
    ).status,
    400,
  );
  const docs = await call("/library/api/documents?refresh=1");
  assert.equal(docs.data.items.length, 1);
  const r = await fetch(`${base}/library/document/${docs.data.items[0].id}`);
  assert.equal(await r.text(), html);
  assert.ok(
    r.headers.get("content-security-policy").includes("sandbox allow-scripts"),
  );
  assert.ok(
    !r.headers.get("content-security-policy").includes("allow-same-origin"),
  );
});
test("watch and portfolio work are queued until explicitly handed to Codex, then linked to HTML", async (t) => {
  const { call, dir } = await setup(t);
  let s = (await call("/api/state")).data;
  s.watchlist.push({
    id: "watch1",
    name: "微软",
    symbol: "",
    status: "观察中",
    note: "",
    trigger: "",
    targetPrice: 300,
  });
  s = (await call("/api/state", s, "PUT")).data;
  const job = await call("/api/jobs", { kind: "watch", watchId: "watch1" });
  assert.equal(job.status, 201);
  assert.equal(job.data.state.jobs[0].status, "waiting");
  assert.equal((await call("/api/jobs", { kind: "watch", watchId: "watch1" })).status, 409);
  assert.equal((await call("/api/jobs", { kind: "portfolio" })).status, 201);
  const queue = await call("/api/codex/queue");
  assert.equal(queue.data.jobs.length, 2);
  assert.ok(queue.data.context.includes("5924.23"));
  const todo = await fs.readFile(path.join(dir, "CODEX_TODO.md"), "utf8");
  assert.match(todo, /微软/);
  assert.match(todo, /等待 Codex/);

  await call("/api/reports/import", { name: "watch.html", folder: "research", html: "<!doctype html><html><body>研究</body></html>" });
  const watchResearch = {
    ...research,
    quote: { price: 298.5, date: "2026-10-16", currency: "USD", source: "Exchange history", sourceUrl: "https://example.com/quotes" },
  };
  s = await call(`/api/jobs/${job.data.job.id}/complete`, { report: "research/watch.html", research: watchResearch });
  assert.equal(s.status, 200);
  s = s.data;
  assert.equal(s.jobs[0].status, "done");
  assert.equal(s.watchlist[0].research.title, research.title);
  assert.equal(s.watchlist[0].symbol, "MSFT");
  assert.equal(s.watchlist[0].price, 298.5);
  assert.equal(s.watchlist[0].priceDate, "2026-10-16");
  assert.equal(s.watchlist[0].priceSource, "Exchange history");
  assert.equal(s.watchlist[0].targetPrice, 300);
  assert.equal(s.analyses.length, 1);
  assert.equal(s.analyses[0].report, "research/watch.html");
});
test("failed Codex tasks retain an explicit not-done status", async (t) => {
  const { call } = await setup(t);
  const created = await call("/api/jobs", { kind: "portfolio" });
  const failed = await call(`/api/jobs/${created.data.job.id}/fail`, { reason: "尚未找到可靠来源" });
  assert.equal(failed.status, 200);
  assert.equal(failed.data.jobs[0].status, "failed");
  assert.equal(failed.data.jobs[0].error, "尚未找到可靠来源");
});
const watchRecord = (id, complete = false) => ({
  id, name: id, symbol: id.toUpperCase(), note: "", trigger: "", status: "关注中", attention: 2,
  ...(complete ? { research: { ...research, identity: { ...research.identity, symbol: id.toUpperCase() } }, report: `research/${id}.html`, researchedAt: "2026-10-16T22:00:00.000Z" } : {}),
});
test("London ETF prices follow their listing session, holidays, auctions and daylight saving", async (t) => {
  for (const [at, type, date, closeAt] of [
    ["2026-10-22T06:59:59Z", "close", "2026-10-21"],
    ["2026-10-22T07:00:00Z", "intraday", "2026-10-22"],
    ["2026-10-22T15:34:59Z", "intraday", "2026-10-22"],
    ["2026-10-22T15:35:00Z", "close", "2026-10-22", "2026-10-22T15:35:00.000Z"],
    ["2026-10-26T08:00:00Z", "intraday", "2026-10-26", "2026-10-26T16:35:00.000Z"],
    ["2026-04-06T15:00:00Z", "close", "2026-04-02"],
    ["2026-05-04T15:00:00Z", "close", "2026-05-01"],
    ["2026-05-25T15:00:00Z", "close", "2026-05-22"],
    ["2026-08-31T15:00:00Z", "close", "2026-08-28"],
    ["2026-12-24T12:35:00Z", "close", "2026-12-24", "2026-12-24T12:35:00.000Z"],
    ["2026-12-28T15:00:00Z", "close", "2026-12-24"],
    ["2027-01-01T15:00:00Z", "close", "2026-12-31"],
    ["2027-12-28T15:00:00Z", "close", "2027-12-24"],
  ]) {
    const policy = quotePolicy(at, "LSE");
    assert.equal(policy.type, type, at);
    assert.equal(policy.date, date, at);
    assert.equal(policy.timeZone, "Europe/London");
    if (closeAt) assert.equal(policy.sessionCloseAt, closeAt, at);
  }
  const { call } = await setup(t, { now: () => new Date("2026-10-22T19:15:00Z") });
  const state = (await call("/api/state")).data;
  const watch = watchRecord("cndx", true);
  watch.research.identity = { ...watch.research.identity, exchange: "LSE" };
  state.watchlist = [watch];
  await call("/api/state", state, "PUT");
  const job = (await call("/api/jobs", { kind: "watch-quotes", watchId: "cndx" })).data.job;
  const prepared = (await call(`/api/jobs/${job.id}/quote-policy`, {})).data;
  assert.equal(prepared.policy.type, "close");
  assert.equal(prepared.policy.market, "LSE");
  const completed = await call(`/api/jobs/${job.id}/complete`, { executedAt: prepared.policy.executedAt, quotes: [{ symbol: "CNDX", price: 1674, date: "2026-10-22", type: "close", currency: "USD", source: "LSE 日线", sourceUrl: "https://example.com/" }] });
  assert.equal(completed.status, 200);
  assert.equal(completed.data.watchlist[0].priceTimeZone, "Europe/London");
  assert.deepEqual(completed.data.watchlist[0].research, watch.research);
});
test("refreshing 57 researched watch items queues only prices and never drops active jobs", async (t) => {
  const { call, dir } = await setup(t);
  const initial = (await call("/api/state")).data;
  initial.watchlist = Array.from({ length: 57 }, (_, i) => watchRecord(`w${i}`, true));
  const saved = (await call("/api/state", initial, "PUT")).data;
  const batch = await call("/api/jobs/batch-watch", {});
  assert.equal(batch.status, 201);
  assert.equal(batch.data.jobs.length, 57);
  assert.ok(batch.data.jobs.every((job) => job.kind === "watch-quotes"));
  assert.equal(new Set(batch.data.jobs.map((job) => job.batchId)).size, 1);
  assert.deepEqual(batch.data.state.watchlist, saved.watchlist);
  const todo = await fs.readFile(path.join(dir, "CODEX_TODO.md"), "utf8");
  assert.match(todo, /关注价格更新/);
  assert.match(todo, /不得重新生成或改写研究/);
  const repeated = await call("/api/jobs/batch-watch", {});
  assert.equal(repeated.status, 200);
  assert.equal(repeated.data.jobs.length, 0);
  const market = await call("/api/jobs", { kind: "market" });
  assert.equal(market.status, 201);
  assert.equal(market.data.state.jobs.filter((job) => job.status === "waiting").length, 58);
  assert.equal((await call("/api/jobs", { kind: "watch", watchId: "w0" })).status, 409);
  const explicit = await call("/api/jobs", { kind: "watch", watchId: "w0", refreshResearch: true });
  assert.equal(explicit.status, 201);
  assert.equal(explicit.data.job.researchMode, "refresh");
});
test("watch refresh fills only missing research, deduplicates tasks, and undo leaves existing or started work", async (t) => {
  const { call } = await setup(t);
  const state = (await call("/api/state")).data;
  state.watchlist = [watchRecord("done", true), watchRecord("empty"), { ...watchRecord("partial", true), research: { ...research, details: "" } }];
  await call("/api/state", state, "PUT");
  const previous = (await call("/api/jobs", { kind: "watch", watchId: "empty" })).data.job;
  const batch = await call("/api/jobs/batch-watch", {});
  assert.equal(batch.status, 201);
  assert.equal(batch.data.jobs.filter((job) => job.kind === "watch-quotes").length, 3);
  assert.deepEqual(batch.data.jobs.filter((job) => job.kind === "watch").map((job) => job.watchId), ["partial"]);
  assert.equal(batch.data.jobs.find((job) => job.kind === "watch").researchMode, "initial");
  const price = batch.data.jobs.find((job) => job.kind === "watch-quotes");
  assert.equal((await call(`/api/jobs/${price.id}/quote-policy`, {})).status, 200);
  const cancelled = await call("/api/jobs/cancel", { jobIds: batch.data.jobs.map((job) => job.id) });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.data.cancelledIds.length, 3);
  assert.ok(cancelled.data.state.jobs.some((job) => job.id === previous.id));
  assert.ok(cancelled.data.state.jobs.some((job) => job.id === price.id));
  const invalid = await call("/api/jobs/batch-watch", { jobs: [{ watchId: "missing" }] });
  assert.equal(invalid.status, 404);
});
test("watch intraday prices use execution time and cannot alter research, files or holdings", async (t) => {
  let executionTime = new Date("2026-10-19T12:00:00Z");
  const { call, dir } = await setup(t, { now: () => executionTime });
  const state = (await call("/api/state")).data;
  state.watchlist = [{ ...watchRecord("msft", true), price: 298.5, priceDate: "2026-10-16", priceSource: "旧来源" }];
  const before = (await call("/api/state", state, "PUT")).data;
  const report = "<!doctype html><html><body>原有研究</body></html>";
  await fs.writeFile(path.join(dir, "reports/research/msft.html"), report);
  const job = (await call("/api/jobs", { kind: "watch-quotes", watchId: "msft" })).data.job;
  executionTime = new Date("2026-10-20T15:05:00Z");
  const prepare = await call(`/api/jobs/${job.id}/quote-policy`, {});
  assert.equal(prepare.data.policy.type, "intraday");
  assert.equal(prepare.data.target.currency, "USD");
  const q = { symbol: "MSFT", price: 310, date: "2026-10-20", type: "intraday", currency: "USD", asOf: "2026-10-20T15:04:59.000Z", source: "测试报价", sourceUrl: "https://example.com/quote" };
  const url = `/api/jobs/${job.id}/complete`;
  const payload = { executedAt: prepare.data.policy.executedAt, quotes: [q] };
  for (const bad of [{ currency: "EUR" }, { currency: undefined }, { symbol: "OTHER" }, { type: "close" }, { date: "2026-10-19" }, { asOf: "2026-10-20T14:00:00.000Z" }])
    assert.equal((await call(url, { ...payload, quotes: [{ ...q, ...bad }] })).status, 400, JSON.stringify(bad));
  assert.equal((await call(url, { ...payload, research })).status, 400);
  assert.equal((await call(url, { ...payload, report: "research/msft.html" })).status, 400);
  assert.equal((await call(url, { ...payload, quotes: [q, q] })).status, 400);
  const completed = await call(url, payload);
  assert.equal(completed.status, 200);
  const watch = completed.data.watchlist[0];
  assert.equal(watch.price, 310);
  assert.equal(watch.priceType, "intraday");
  assert.equal(watch.priceAsOf, q.asOf);
  assert.equal(watch.priceCurrency, "USD");
  assert.deepEqual(watch.research, before.watchlist[0].research);
  assert.equal(watch.report, before.watchlist[0].report);
  assert.equal(watch.researchedAt, before.watchlist[0].researchedAt);
  assert.deepEqual(completed.data.analyses, before.analyses);
  assert.deepEqual(completed.data.holdings, before.holdings);
  assert.equal(await fs.readFile(path.join(dir, "reports/research/msft.html"), "utf8"), report);
});
test("watch prices after close use today's completed session; names can resolve without generating research", async (t) => {
  const { call } = await setup(t, { now: () => new Date("2026-10-20T20:05:00Z") });
  const state = (await call("/api/state")).data;
  state.watchlist = [{ ...watchRecord("apple"), name: "苹果", symbol: "" }];
  await call("/api/state", state, "PUT");
  const job = (await call("/api/jobs", { kind: "watch-quotes", watchId: "apple" })).data.job;
  const prepare = (await call(`/api/jobs/${job.id}/quote-policy`, {})).data;
  assert.equal(prepare.policy.type, "close");
  assert.equal(prepare.policy.date, "2026-10-20");
  assert.deepEqual(prepare.symbols, []);
  const result = await call(`/api/jobs/${job.id}/complete`, { executedAt: prepare.policy.executedAt, quotes: [{ symbol: "AAPL", price: 200, date: prepare.policy.date, type: "close", currency: "USD", source: "来源", sourceUrl: "https://example.com/" }] });
  assert.equal(result.status, 200);
  assert.equal(result.data.watchlist[0].symbol, "AAPL");
  assert.equal(result.data.watchlist[0].priceType, "close");
  assert.equal(result.data.watchlist[0].priceAsOf, "2026-10-20T20:00:00.000Z");
  assert.equal(result.data.watchlist[0].research, undefined);
});
test("initial research skips an existing report; explicit research updates keep refreshed quotes intact", async (t) => {
  const { call, dir } = await setup(t);
  let state = (await call("/api/state")).data;
  state.watchlist = [watchRecord("msft")];
  await call("/api/state", state, "PUT");
  const initial = (await call("/api/jobs", { kind: "watch", watchId: "msft" })).data.job;
  assert.equal(initial.researchMode, "initial");
  state = (await call("/api/state")).data;
  Object.assign(state.watchlist[0], watchRecord("msft", true), { price: 310, priceCurrency: "USD", priceDate: "2026-10-20", priceType: "intraday", priceAsOf: "2026-10-20T15:00:00.000Z", priceFetchedAt: "2026-10-20T15:00:01.000Z" });
  const saved = (await call("/api/state", state, "PUT")).data;
  const skipped = await call(`/api/jobs/${initial.id}/complete`, {});
  assert.equal(skipped.status, 200);
  assert.deepEqual(skipped.data.watchlist[0].research, saved.watchlist[0].research);
  assert.equal(skipped.data.analyses.length, 0);
  assert.match(skipped.data.jobs.find((job) => job.id === initial.id).summary, /跳过首次研究/);
  const explicit = (await call("/api/jobs", { kind: "watch", watchId: "msft", refreshResearch: true })).data.job;
  await fs.writeFile(path.join(dir, "reports/research/new.html"), "<html>更新研究</html>");
  const newerResearch = { ...research, summary: "用户明确要求的新研究", quote: { price: 280, date: "2026-10-16", currency: "USD", source: "报告历史价", sourceUrl: "https://example.com/history" } };
  const completed = await call(`/api/jobs/${explicit.id}/complete`, { report: "research/new.html", research: newerResearch });
  assert.equal(completed.status, 200);
  assert.equal(completed.data.watchlist[0].research.summary, newerResearch.summary);
  assert.equal(completed.data.watchlist[0].price, 310);
  assert.equal(completed.data.watchlist[0].priceType, "intraday");
  assert.equal(completed.data.watchlist[0].priceAsOf, "2026-10-20T15:00:00.000Z");
  const imported = await call("/api/research/import", { watchId: "msft", research: newerResearch });
  assert.equal(imported.status, 200);
  assert.equal(imported.data.watchlist[0].price, 310);
});
test("old bulk research requests migrate to price-only jobs with initial research only where missing", async (t) => {
  const { call, dir } = await setup(t);
  const state = (await call("/api/state")).data;
  state.watchlist = [watchRecord("known", true), watchRecord("new")];
  state.jobs = state.watchlist.map((watch) => ({ id: `legacy-${watch.id}`, kind: "watch", watchId: watch.id, status: "waiting", date: new Date().toISOString(), question: `刷新关注标的 ${watch.name} ${watch.symbol}：生成带来源的自包含中文 HTML。不得编造实时价格或投资建议。`, error: "" }));
  await fs.writeFile(path.join(dir, "state.json"), JSON.stringify(state));
  await createHoldingsApp({ dataDirectory: dir });
  const migrated = (await call("/api/state")).data;
  assert.equal(migrated.jobs.filter((job) => job.kind === "watch-quotes").length, 2);
  assert.deepEqual(migrated.jobs.filter((job) => job.kind === "watch").map((job) => job.watchId), ["new"]);
  assert.deepEqual(migrated.watchlist, state.watchlist);
});
test("US quote policy handles session boundaries, DST, holidays, weekends and early closes", () => {
  for (const [at, type, date, closeAt] of [
    ["2026-10-19T13:29:59Z", "close", "2026-10-16", "2026-10-16T20:00:00.000Z"],
    ["2026-10-19T13:30:00Z", "intraday", "2026-10-19"],
    ["2026-10-19T19:59:59Z", "intraday", "2026-10-19"],
    ["2026-10-19T20:00:00Z", "close", "2026-10-19"],
    ["2026-10-19T01:00:00+13:00", "close", "2026-10-16"],
    ["2026-01-20T14:29:59Z", "close", "2026-01-16"],
    ["2026-01-20T14:30:00Z", "intraday", "2026-01-20", "2026-01-20T21:00:00.000Z"],
    ["2026-03-06T14:30:00Z", "intraday", "2026-03-06"],
    ["2026-03-09T13:30:00Z", "intraday", "2026-03-09"],
    ["2026-11-02T14:30:00Z", "intraday", "2026-11-02"],
    ["2026-04-03T16:00:00Z", "close", "2026-04-02"],
    ["2026-05-25T16:00:00Z", "close", "2026-05-22"],
    ["2026-06-19T16:00:00Z", "close", "2026-06-18"],
    ["2026-07-03T16:00:00Z", "close", "2026-07-02"],
    ["2026-09-07T16:00:00Z", "close", "2026-09-04"],
    ["2026-11-26T16:00:00Z", "close", "2026-11-25"],
    ["2026-11-27T17:59:59Z", "intraday", "2026-11-27", "2026-11-27T18:00:00.000Z"],
    ["2026-11-27T18:00:00Z", "close", "2026-11-27"],
    ["2026-12-24T18:00:00Z", "close", "2026-12-24"],
    ["2027-01-04T13:00:00Z", "close", "2026-12-31"],
    ["2027-06-18T16:00:00Z", "close", "2027-06-17"],
    ["2027-12-24T16:00:00Z", "close", "2027-12-23"],
    ["2027-12-31T16:00:00Z", "intraday", "2027-12-31"],
    ["2028-07-03T16:59:59Z", "intraday", "2028-07-03", "2028-07-03T17:00:00.000Z"],
    ["2028-07-03T17:00:00Z", "close", "2028-07-03"],
    ["2025-01-09T16:00:00Z", "close", "2025-01-08"],
  ]) {
    const policy = quotePolicy(at);
    assert.equal(policy.type, type, at);
    assert.equal(policy.date, date, at);
    if (closeAt) assert.equal(policy.sessionCloseAt, closeAt, at);
  }
});
test("price refresh queues without fetching; execution time selects intraday quotes and preserves costs", async (t) => {
  let executionTime = new Date("2026-10-19T12:00:00Z");
  const { call, dir } = await setup(t, { now: () => executionTime });
  const before = (await call("/api/state")).data;
  const queued = await call("/api/jobs", { kind: "quotes", question: "更新全部持仓收盘价" });
  assert.equal(queued.status, 201);
  assert.equal(queued.data.state.holdings[0].price, before.holdings[0].price);
  assert.equal(queued.data.job.quotePolicy, undefined);
  assert.match(queued.data.job.question, /实际执行时间/);
  assert.equal((await call("/api/jobs", { kind: "quotes" })).status, 409);
  const todoWhileWaiting = await fs.readFile(path.join(dir, "CODEX_TODO.md"), "utf8");
  assert.match(todoWhileWaiting, /价格更新/);
  assert.match(todoWhileWaiting, /quote-policy/);
  assert.match(todoWhileWaiting, /不要使用点击按钮或任务创建时间/);
  executionTime = new Date("2026-10-20T15:05:00Z");
  const prepared = await call(`/api/jobs/${queued.data.job.id}/quote-policy`, {});
  assert.equal(prepared.status, 200);
  const policy = prepared.data.policy;
  assert.equal(policy.type, "intraday");
  assert.equal(policy.date, "2026-10-20");
  assert.equal((await call("/api/state")).data.holdings[0].price, before.holdings[0].price);
  const symbols = [...new Set(before.holdings.map((h) => h.symbol))];
  const quotes = symbols.map((symbol) => ({ symbol, price: 123.45, date: policy.date, type: policy.type, asOf: "2026-10-20T15:04:59.000Z", source: "测试行情来源", sourceUrl: `https://example.com/${symbol}` }));
  const completed = await call(`/api/jobs/${queued.data.job.id}/complete`, {
    executedAt: policy.executedAt,
    quotes,
    summary: "全部持仓盘中价已更新",
  });
  assert.equal(completed.status, 200);
  assert.equal(completed.data.jobs.find((j) => j.id === queued.data.job.id).status, "done");
  for (const h of completed.data.holdings) {
    const old = before.holdings.find((x) => x.id === h.id);
    assert.equal(h.price, 123.45);
    assert.equal(h.priceDate, "2026-10-20");
    assert.equal(h.priceSource, "测试行情来源");
    assert.equal(h.priceType, "intraday");
    assert.equal(h.priceAsOf, "2026-10-20T15:04:59.000Z");
    assert.equal(h.priceFetchedAt, executionTime.toISOString());
    assert.equal(h.priceSourceUrl, `https://example.com/${h.symbol}`);
    assert.equal(h.marketValue, Math.round(h.quantity * 123.45 * 100) / 100);
    assert.equal(h.averagePrice, old.averagePrice);
    assert.equal(h.cost, old.cost);
  }
  assert.equal((await call("/api/market/refresh", {})).status, 404);
  const todo = await fs.readFile(path.join(dir, "CODEX_TODO.md"), "utf8");
  assert.match(todo, /当前没有等待中的任务/);
  assert.equal((await call(`/api/jobs/${queued.data.job.id}/quote-policy`, {})).status, 409);
  assert.equal((await call(`/api/jobs/${queued.data.job.id}/complete`, { executedAt: policy.executedAt, quotes })).status, 409);
});
test("quote completion rejects unprepared, mismatched, stale and incomplete prices atomically", async (t) => {
  const executionTime = new Date("2026-10-20T15:05:00Z");
  const { call } = await setup(t, { now: () => executionTime });
  const before = (await call("/api/state")).data;
  const job = (await call("/api/jobs", { kind: "quotes" })).data.job;
  const completeUrl = `/api/jobs/${job.id}/complete`;
  assert.equal((await call(completeUrl, { quotes: [] })).status, 409);
  const policy = (await call(`/api/jobs/${job.id}/quote-policy`, {})).data.policy;
  const quotes = [...new Set(before.holdings.map((h) => h.symbol))].map((symbol) => ({
    symbol, price: 123, date: policy.date, type: policy.type, asOf: "2026-10-20T15:00:00.000Z", source: "测试", sourceUrl: "https://example.com/",
  }));
  assert.equal((await call(completeUrl, { executedAt: "2026-10-19T15:05:00.000Z", quotes })).status, 409);
  for (const bad of [
    { type: "close" }, { date: "2026-10-19" }, { asOf: undefined },
    { asOf: "2026-10-20T14:44:59.000Z" }, { asOf: "2026-10-20T15:05:01.000Z" },
    { asOf: "2026-10-19T20:00:00.000Z" }, { sourceUrl: "http://example.com/" }, { sourceUrl: "https://" }, { price: -1 },
  ]) {
    const result = await call(completeUrl, { executedAt: policy.executedAt, quotes: [{ ...quotes[0], ...bad }, ...quotes.slice(1)] });
    assert.equal(result.status, 400, JSON.stringify(bad));
  }
  for (const invalidQuotes of [quotes.slice(1), [...quotes, quotes[0]], [{ ...quotes[0], symbol: "UNKNOWN" }, ...quotes.slice(1)]]) {
    assert.equal((await call(completeUrl, { executedAt: policy.executedAt, quotes: invalidQuotes })).status, 400);
  }
  const unchanged = (await call("/api/state")).data;
  assert.deepEqual(unchanged.holdings, before.holdings);
  assert.equal(unchanged.jobs.find((j) => j.id === job.id).status, "waiting");
});
test("an execution prepared before the close stays intraday; a new execution after close uses today's close", async (t) => {
  let executionTime = new Date("2026-11-27T17:59:00Z");
  const { call } = await setup(t, { now: () => executionTime });
  const job = (await call("/api/jobs", { kind: "quotes" })).data.job;
  const prepareUrl = `/api/jobs/${job.id}/quote-policy`;
  const policy = (await call(prepareUrl, {})).data.policy;
  executionTime = new Date("2026-11-27T18:02:00Z");
  const symbols = (await call("/api/state")).data.holdings.map((h) => h.symbol);
  const quotes = [...new Set(symbols)].map((symbol) => ({
    symbol, price: 125, date: policy.date, type: "intraday", asOf: policy.executedAt, source: "测试", sourceUrl: "https://example.com/",
  }));
  const completeUrl = `/api/jobs/${job.id}/complete`;
  assert.equal((await call(completeUrl, { executedAt: policy.executedAt, quotes })).status, 200);
  const nextJob = (await call("/api/jobs", { kind: "quotes" })).data.job;
  const nextPolicy = (await call(`/api/jobs/${nextJob.id}/quote-policy`, {})).data.policy;
  assert.equal(nextPolicy.type, "close");
  assert.equal(nextPolicy.date, "2026-11-27");
  const closes = quotes.map(({ asOf, ...q }) => ({ ...q, type: "close" }));
  const completed = await call(`/api/jobs/${nextJob.id}/complete`, { executedAt: nextPolicy.executedAt, quotes: closes });
  assert.equal(completed.status, 200);
  assert.equal(completed.data.holdings[0].priceType, "close");
  assert.equal(completed.data.holdings[0].priceAsOf, "2026-11-27T18:00:00.000Z");
});
test("a new quote policy invalidates an older execution attempt and rejects non-price tasks", async (t) => {
  let executionTime = new Date("2026-10-19T12:00:00Z");
  const { call } = await setup(t, { now: () => executionTime });
  const portfolio = (await call("/api/jobs", { kind: "portfolio" })).data.job;
  assert.equal((await call(`/api/jobs/${portfolio.id}/quote-policy`, {})).status, 409);
  assert.equal((await call("/api/jobs/missing/quote-policy", {})).status, 404);
  const job = (await call("/api/jobs", { kind: "quotes" })).data.job;
  const policy = (await call(`/api/jobs/${job.id}/quote-policy`, {})).data.policy;
  executionTime = new Date("2026-10-19T15:00:00Z");
  const newer = (await call(`/api/jobs/${job.id}/quote-policy`, {})).data.policy;
  assert.equal(policy.type, "close");
  assert.equal(newer.type, "intraday");
  assert.equal((await call(`/api/jobs/${job.id}/complete`, { executedAt: policy.executedAt, quotes: [] })).status, 409);
});

test("legacy Codex CLI failures return to the waiting queue", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "holdings-legacy-"));
  const state = JSON.parse(await fs.readFile(new URL("../data/initial-state.json", import.meta.url), "utf8"));
  state.watchlist.push({ id: "legacy-watch", name: "测试标的", symbol: "TEST", status: "观察中", note: "", trigger: "" });
  state.jobs.push({ id: "legacy-cli", kind: "watch", watchId: "legacy-watch", status: "failed", error: "未找到 Codex CLI。请安装并登录 Codex。", date: new Date().toISOString() });
  state.jobs.push({ id: "legacy-quotes", kind: "quotes", status: "waiting", question: "更新全部持仓收盘价", date: new Date().toISOString() });
  await fs.writeFile(path.join(dir, "state.json"), JSON.stringify(state));
  const app = await createHoldingsApp({ dataDirectory: dir });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(async () => { await new Promise((r) => server.close(r)); await fs.rm(dir, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const result = await (await fetch(base + "/api/state")).json();
  assert.equal(result.jobs.find((j) => j.id === "legacy-cli").status, "waiting");
  assert.equal(result.jobs.find((j) => j.id === "legacy-cli").error, "");
  assert.equal(result.watchlist.find((w) => w.id === "legacy-watch").symbol, "TEST");
  assert.match(result.jobs.find((j) => j.id === "legacy-quotes").question, /实际执行时间/);
  const todo = await fs.readFile(path.join(dir, "CODEX_TODO.md"), "utf8");
  assert.match(todo, /标的研究/);
  assert.match(todo, /quote-policy/);
});
test("external research import validates sources and auto-creates a report", async (t) => {
  const { call } = await setup(t);
  const invalid = {
    ...research,
    sources: [{ label: "bad", url: "javascript:alert(1)" }],
  };
  assert.equal(
    (await call("/api/research/import", { research: invalid })).status,
    400,
  );
  const invalidQuote = {
    ...research,
    quote: { price: 10, date: "2026-10-16", currency: "USD", source: "bad", sourceUrl: "javascript:alert(1)" },
  };
  assert.equal((await call("/api/research/import", { research: invalidQuote })).status, 400);
  const result = await call("/api/research/import", { research });
  assert.equal(result.status, 200);
  assert.equal(result.data.analyses.length, 1);
  assert.equal(
    (await call("/library/api/documents?refresh=1")).data.items.length,
    1,
  );
});
test("cross-origin mutations are refused", async (t) => {
  const { base } = await setup(t);
  const r = await fetch(base + "/api/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
    },
    body: "{}",
  });
  assert.equal(r.status, 403);
});

test("the known Vite origin can save through the API proxy", async (t) => {
  const { base, call } = await setup(t);
  const s = (await call("/api/state")).data;
  const r = await fetch(base + "/api/state", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://127.0.0.1:5888",
      "Sec-Fetch-Site": "same-origin",
    },
    body: JSON.stringify(s),
  });
  assert.equal(r.status, 200);
});
