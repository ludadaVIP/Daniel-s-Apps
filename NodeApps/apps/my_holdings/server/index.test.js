import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHoldingsApp } from "./index.js";
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
  assert.equal(saved.data.revision, 1);
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
  assert.equal(backups.length, 3);
  const restored = await call("/api/restore", { revision: 3, state: stale });
  assert.equal(restored.status, 200);
  assert.equal(restored.data.holdings[0].thesis, "");
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
  s = await call(`/api/jobs/${job.data.job.id}/complete`, { report: "research/watch.html", research });
  assert.equal(s.status, 200);
  s = s.data;
  assert.equal(s.jobs[0].status, "done");
  assert.equal(s.watchlist[0].research.title, research.title);
  assert.equal(s.watchlist[0].symbol, "MSFT");
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
test("market refresh updates only successfully fetched completed closes and preserves average cost", async (t) => {
  const { call } = await setup(t, {
    quoteFetcher: async (symbol) => {
      if (symbol === "SMH") throw new Error("fixture unavailable");
      return { price: 123.45, date: "2026-10-16", source: "test feed" };
    },
  });
  const before = (await call("/api/state")).data;
  const result = await call("/api/market/refresh", {});
  assert.equal(result.status, 200);
  const voo = result.data.state.holdings.find((h) => h.symbol === "VOO");
  const oldVoo = before.holdings.find((h) => h.id === voo.id);
  assert.equal(voo.price, 123.45);
  assert.equal(voo.priceDate, "2026-10-16");
  assert.equal(voo.priceSource, "test feed");
  assert.equal(voo.marketValue, Math.round(voo.quantity * 123.45 * 100) / 100);
  assert.equal(voo.averagePrice, oldVoo.averagePrice);
  assert.equal(voo.cost, oldVoo.cost);
  const smh = result.data.state.holdings.find((h) => h.symbol === "SMH");
  assert.equal(smh.price, before.holdings.find((h) => h.id === smh.id).price);
  assert.equal(result.data.quotes.find((q) => q.symbol === "SMH").error, "fixture unavailable");
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
