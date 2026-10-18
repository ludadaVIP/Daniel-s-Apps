import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  createHtmlLibraryApp,
  initializeHtmlLibrary,
} from "../../html-library/server/index.js";
import { contextPack, CURRENCIES } from "../src/model.js";
import { validateResearch, researchHtml } from "./ai.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const error = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const text = (v, max = 12000) => typeof v === "string" && v.length <= max;
const num = (v, min = 0, max = 1e14) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const date = (v) =>
  text(v, 10) &&
  (v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))));
const nyParts = (dateValue = new Date()) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(dateValue)
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour), minute: Number(p.minute) };
};
export async function fetchDailyClose(symbol) {
  if (!/^[A-Z0-9.^-]{1,24}$/.test(symbol)) throw error("股票代码格式无效。");
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
  );
  url.searchParams.set("range", "10d");
  url.searchParams.set("interval", "1d");
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 MyHoldings/1.0" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw error(`行情服务返回 ${response.status}。`, 502);
  const body = await response.json();
  const chart = body.chart?.result?.[0];
  if (!chart?.timestamp?.length) throw error(`没有找到 ${symbol} 的日收盘行情。`, 404);
  const zone = chart.meta?.exchangeTimezoneName || "America/New_York";
  const now = nyParts();
  const afterClose = now.hour > 16 || (now.hour === 16 && now.minute >= 10);
  const closes = chart.indicators?.quote?.[0]?.close || [];
  const rows = chart.timestamp
    .map((stamp, i) => ({
      date: new Intl.DateTimeFormat("en-CA", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(stamp * 1000)),
      price: closes[i],
    }))
    .filter((row) => Number.isFinite(row.price))
    .filter((row) => row.date < now.date || (row.date === now.date && afterClose));
  const latest = rows.at(-1);
  if (!latest) throw error(`尚無 ${symbol} 已完成的交易日收盘价。`, 404);
  return { ...latest, source: "Yahoo Finance" };
}
export function validateState(s) {
  if (!s || s.version !== 1) throw error("备份版本无效。");
  for (const k of [
    "accounts",
    "holdings",
    "watchlist",
    "cash",
    "journal",
    "analyses",
    "jobs",
  ])
    if (!Array.isArray(s[k]) || s[k].length > 10000)
      throw error(`数据格式无效：${k}`);
  for (const k of [
    "accounts",
    "holdings",
    "watchlist",
    "cash",
    "journal",
    "analyses",
    "jobs",
  ]) {
    const ids = new Set();
    for (const r of s[k]) {
      if (!r || !text(r.id, 100) || !r.id || ids.has(r.id))
        throw error(`记录 ID 无效或重复：${k}`);
      ids.add(r.id);
    }
  }
  if (
    !s.accounts.length ||
    s.accounts.some(
      (a) => !text(a.name, 100) || !a.name.trim() || !text(a.note),
    )
  )
    throw error("账户名称不能为空。");
  for (const h of s.holdings)
    if (
      !s.accounts.some((a) => a.id === h.accountId) ||
      !text(h.symbol, 40) ||
      !h.symbol.trim() ||
      !text(h.name, 300) ||
      !CURRENCIES.includes(h.currency) ||
      !num(h.quantity) ||
      !num(h.price) ||
      !num(h.marketValue) ||
      !num(h.cost) ||
      !num(h.averagePrice) ||
      !(h.changePct === null || num(h.changePct, -100, 1e8)) ||
      !date(h.priceDate) ||
      !(h.priceSource === undefined || text(h.priceSource, 100)) ||
      !date(h.recordedAt) ||
      !text(h.sector, 100) ||
      !text(h.source, 200) ||
      !text(h.thesis) ||
      !text(h.exitRule)
    )
      throw error("持仓数据无效；请检查金额、数量、币种与日期。");
  for (const w of s.watchlist) {
    if (
      !text(w.name, 300) ||
      !w.name.trim() ||
      !text(w.symbol, 40) ||
      !text(w.note) ||
      !text(w.trigger) ||
      !text(w.status, 40)
    )
      throw error("关注记录无效。");
    if (w.research) validateResearch(w.research);
  }
  for (const c of s.cash)
    if (
      !num(c.amount, -1e14) ||
      c.amount === 0 ||
      c.currency !== "USD" ||
      !date(c.date) ||
      !c.date ||
      !text(c.note, 2000) ||
      !text(c.kind, 100)
    )
      throw error("资金流水无效。");
  for (const j of s.journal)
    if (!date(j.date) || !text(j.title, 300) || !text(j.body, 20000))
      throw error("决策日志无效。");
  for (const a of s.analyses) {
    validateResearch(a.research);
    if (!text(a.date, 40) || !text(a.kind, 40) || !text(a.report, 300))
      throw error("研究记录无效。");
  }
  const g = s.goals;
  if (
    !g ||
    !CURRENCIES.includes(g.currency) ||
    !(g.target === null || num(g.target, 0.01)) ||
    !num(g.reserve) ||
    !num(g.maxPosition, 1, 100) ||
    !num(g.maxDrawdown, 0, 100) ||
    !date(g.date) ||
    !text(g.horizon, 300) ||
    !text(g.notes) ||
    !(g.objective === undefined || text(g.objective, 5000))
  )
    throw error("投资目标格式无效。");
  if (
    !s.fx ||
    s.fx.USD !== 1 ||
    CURRENCIES.some((c) => s.fx[c] !== null && !num(s.fx[c], 0.00000001, 1e8))
  )
    throw error("汇率格式无效；请填写每单位外币兑换的美元数。");
  return s;
}
export async function createHoldingsApp({
  dataDirectory = path.join(root, "data"),
  quoteFetcher = fetchDailyClose,
} = {}) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.mkdir(path.join(dataDirectory, "backups"), { recursive: true });
  const reports = path.join(dataDirectory, "reports"),
    catalog = path.join(dataDirectory, "report-catalog.json");
  await initializeHtmlLibrary({
    libraryDirectory: reports,
    catalogPath: catalog,
  });
  for (const dir of ["market", "portfolio", "research"])
    await fs.mkdir(path.join(reports, dir), { recursive: true });
  const file = path.join(dataDirectory, "state.json");
  const todoFile = path.join(dataDirectory, "CODEX_TODO.md");
  try {
    await fs.access(file);
  } catch {
    await fs.copyFile(
      path.join(root, "data/initial-state.json"),
      file,
      fs.constants.COPYFILE_EXCL,
    );
  }
  const read = async () =>
    validateState(JSON.parse(await fs.readFile(file, "utf8")));
  let tail = Promise.resolve();
  const serial = (fn) => {
    const p = tail.then(fn, fn);
    tail = p.catch(() => {});
    return p;
  };
  const syncCodexTodo = async (s) => {
    const waiting = s.jobs.filter((j) => j.status === "waiting");
    const lines = [
      "# My Holdings · Codex 待办",
      "",
      "> 这是本地排队文件，会随 `state.json` 一起通过 GitHub 同步。应用不会启动 Codex CLI 或后台任务。",
      "> 用户明确交代 Codex 执行待办后，再读取此文件和 `state.json`，完成后将报告保存到 `reports/`，并通过应用的本地 API 回写状态。",
      "",
      `最近同步：${s.updatedAt || "尚未保存"}`,
      "",
    ];
    if (!waiting.length) lines.push("当前没有等待中的任务。", "");
    for (const job of waiting) {
      const watch = s.watchlist.find((w) => w.id === job.watchId);
      lines.push(
        `## ${job.kind === "watch" ? "标的研究" : job.kind === "market" ? "行情分析" : "组合分析"} · ${watch?.name || job.question || "持仓组合"}`,
        `- 状态：等待 Codex · 任务 ID：${job.id}`,
        `- 创建时间：${job.date}`,
        `- 关注记录 ID：${job.watchId || "无"}`,
        "- 运行方式：只在用户明确要求时执行；联网核对数据日期与来源；报告保存为独立 HTML。",
        "",
      );
    }
    await fs.writeFile(todoFile, lines.join("\n"));
  };
  const write = async (s) => {
    validateState(s);
    const previous = await fs.readFile(file, "utf8");
    const stamp = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    await fs.writeFile(
      path.join(dataDirectory, "backups", stamp + ".json"),
      previous,
    );
    s.revision = (s.revision || 0) + 1;
    s.updatedAt = new Date().toISOString();
    const tmp = file + "." + randomUUID() + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(s, null, 2) + "\n");
    await fs.rename(tmp, file);
    await syncCodexTodo(s);
    const backups = (await fs.readdir(path.join(dataDirectory, "backups")))
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();
    await Promise.all(
      backups
        .slice(30)
        .map((f) => fs.unlink(path.join(dataDirectory, "backups", f))),
    );
    return s;
  };
  await serial(async () => {
    const s = await read();
    let changed = false;
    for (const j of s.jobs)
      if (j.status === "running") {
        j.status = "waiting";
        j.error = "等待你下次明确交给 Codex 执行。";
        changed = true;
      }
    if (changed) await write(s);
    else await syncCodexTodo(s);
  });
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "8mb" }));
  app.use((req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      (req.get("sec-fetch-site") === "cross-site" ||
        (req.get("origin") &&
          req.get("origin") !== `${req.protocol}://${req.get("host")}` &&
          !["http://127.0.0.1:5888", "http://localhost:5888"].includes(
            req.get("origin"),
          )))
    )
      return next(error("只允许本地应用页面修改数据。", 403));
    next();
  });
  app.get("/api/state", async (_req, res, next) => {
    try {
      res.set("Cache-Control", "no-store").json(await read());
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/codex/queue", async (_req, res, next) => {
    try {
      const s = await read();
      res.set("Cache-Control", "no-store").json({
        jobs: s.jobs.filter((j) => j.status === "waiting"),
        context: contextPack(s, "portfolio"),
      });
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs", async (req, res, next) => {
    try {
      const kind = ["watch", "portfolio", "market"].includes(req.body.kind)
        ? req.body.kind
        : "portfolio";
      const result = await serial(async () => {
        const s = await read();
        const watch = kind === "watch"
          ? s.watchlist.find((w) => w.id === req.body.watchId)
          : null;
        if (kind === "watch" && !watch) throw error("关注标的不存在。", 404);
        if (kind === "watch" && s.jobs.some((j) => j.status === "waiting" && j.watchId === watch.id))
          throw error("这个标的已经在 Codex 待办队列中。", 409);
        if (kind !== "watch" && s.jobs.some((j) => j.status === "waiting" && j.kind === kind))
          throw error("相同类型的任务已经在待办队列中。", 409);
        const job = {
          id: randomUUID(),
          kind,
          watchId: watch?.id || null,
          question: text(req.body.question || "", 4000) ? req.body.question : "",
          status: "waiting",
          date: new Date().toISOString(),
          error: "",
        };
        s.jobs = [...s.jobs.slice(-49), job];
        return { state: await write(s), job };
      });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/:id/complete", async (req, res, next) => {
    try {
      if (!text(req.body.report, 500) || !req.body.report.toLowerCase().endsWith(".html"))
        throw error("请提供 reports 文件夹中的 HTML 相对路径。");
      let relative = req.body.report.replaceAll("\\", "/");
      const marker = "/data/reports/";
      if (relative.includes(marker)) relative = relative.split(marker).at(-1);
      relative = relative.replace(/^reports\//, "");
      const reportPath = path.resolve(reports, relative);
      if (!reportPath.startsWith(reports + path.sep)) throw error("报告路径无效。");
      const reportStat = await fs.stat(reportPath);
      if (!reportStat.isFile()) throw error("HTML 报告文件不存在。");
      const result = await serial(async () => {
        const s = await read();
        const job = s.jobs.find((j) => j.id === req.params.id);
        if (!job) throw error("待办任务不存在。", 404);
        const report = path.relative(reports, reportPath).split(path.sep).join("/");
        job.status = "done";
        job.report = report;
        job.error = "";
        job.completedAt = new Date().toISOString();
        if (!req.body.research) throw error("完成任务时请一并回写结构化 research，应用才能更新分析卡片。");
        const research = validateResearch(req.body.research);
        if (job.kind === "watch") {
          const w = s.watchlist.find((row) => row.id === job.watchId);
          if (w) {
            w.research = research;
            if (!w.symbol && research.identity?.symbol) w.symbol = research.identity.symbol.slice(0, 40);
            w.researchedAt = job.completedAt;
            w.report = report;
          }
        }
        s.analyses.unshift({ id: randomUUID(), kind: job.kind, date: job.completedAt, research, report });
        return write(s);
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/:id/fail", async (req, res, next) => {
    try {
      if (!text(req.body.reason || "", 1000)) throw error("失败原因过长。");
      const result = await serial(async () => {
        const s = await read();
        const job = s.jobs.find((j) => j.id === req.params.id);
        if (!job) throw error("待办任务不存在。", 404);
        job.status = "failed";
        job.error = req.body.reason || "Codex 已执行，但未能完成此任务。";
        return write(s);
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  app.put("/api/state", async (req, res, next) => {
    try {
      res.json(
        await serial(async () => {
          const current = await read();
          if (req.body.revision !== current.revision)
            throw error("数据已更新，请刷新后重试；未保存的表单仍保留。", 409);
          const candidate = validateState(req.body);
          candidate.jobs = current.jobs;
          candidate.analyses = current.analyses;
          for (const w of candidate.watchlist) {
            const existing = current.watchlist.find((row) => row.id === w.id);
            if (existing?.research) {
              w.research = existing.research;
              if (!w.symbol && existing.research.identity?.symbol)
                w.symbol = existing.research.identity.symbol.slice(0, 40);
              w.researchedAt = existing.researchedAt;
              w.report = existing.report;
            }
          }
          return write(candidate);
        }),
      );
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/restore", async (req, res, next) => {
    try {
      res.json(
        await serial(async () => {
          const current = await read();
          if (current.jobs.some((j) => j.status === "running"))
            throw error("AI 任务进行中，完成后再恢复备份。", 409);
          if (req.body.revision !== current.revision)
            throw error("数据已更新，请刷新后恢复。", 409);
          const candidate = structuredClone(validateState(req.body.state));
          candidate.revision = current.revision;
          candidate.jobs = [];
          return write(candidate);
        }),
      );
    } catch (e) {
      next(e);
    }
  });
  const saveReport = async (research, kind) => {
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}.html`,
      folder =
        kind === "watch"
          ? "research"
          : kind === "market"
            ? "market"
            : "portfolio";
    await fs.writeFile(
      path.join(reports, folder, name),
      researchHtml(research, new Date().toISOString()),
      { flag: "wx" },
    );
    return `${folder}/${name}`;
  };
  app.post("/api/market/refresh", async (_req, res, next) => {
    try {
      const before = await read();
      const symbols = [...new Set(before.holdings.map((h) => h.symbol.toUpperCase()))];
      const quotes = await Promise.all(symbols.map(async (symbol) => {
        try { return { symbol, ...(await quoteFetcher(symbol)) }; }
        catch (e) { return { symbol, error: e.message || "行情获取失败" }; }
      }));
      const result = await serial(async () => {
        const s = await read();
        const bySymbol = new Map(quotes.filter((q) => Number.isFinite(q.price) && q.price > 0).map((q) => [q.symbol, q]));
        for (const h of s.holdings) {
          const q = bySymbol.get(h.symbol.toUpperCase());
          if (!q) continue;
          h.price = q.price;
          h.priceDate = q.date;
          h.priceSource = q.source || "Yahoo Finance";
          h.marketValue = Math.round(h.quantity * h.price * 100) / 100;
        }
        s.marketUpdatedAt = new Date().toISOString();
        return { state: await write(s), quotes };
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/research/import", async (req, res, next) => {
    try {
      const research = validateResearch(req.body.research);
      const kind = req.body.watchId ? "watch" : "portfolio";
      res.json(
        await serial(async () => {
          const s = await read();
          const w = req.body.watchId
            ? s.watchlist.find((w) => w.id === req.body.watchId)
            : null;
          if (req.body.watchId && !w) throw error("关注标的不存在。", 404);
          const report = await saveReport(research, kind);
          const finishedAt = new Date().toISOString();
          if (w) {
            w.research = research;
            if (!w.symbol && research.identity?.symbol)
              w.symbol = research.identity.symbol.slice(0, 40);
            w.researchedAt = finishedAt;
            w.report = report;
          }
          const job = s.jobs.findLast((j) =>
            j.status === "waiting" &&
            j.kind === kind &&
            (kind !== "watch" || j.watchId === req.body.watchId),
          );
          if (job) {
            job.status = "done";
            job.report = report;
            job.completedAt = finishedAt;
            job.error = "";
          }
          s.analyses.unshift({
            id: randomUUID(),
            kind,
            date: finishedAt,
            research,
            report,
          });
          return write(s);
        }),
      );
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/reports/import", async (req, res, next) => {
    try {
      const { html, name, folder } = req.body;
      if (
        !text(html, 6000000) ||
        !/<(?:!doctype\s+html|html|head|body)[\s>]/i.test(html)
      )
        throw error("请导入完整的 HTML 文件。");
      if (
        !text(name, 160) ||
        !name ||
        /[\\/:*?"<>|\x00-\x1f]/.test(name) ||
        name.startsWith(".") ||
        !/.html?$/i.test(name) ||
        !["market", "portfolio", "research"].includes(folder)
      )
        throw error("文件名或分类无效。");
      const filename = path.join(reports, folder, name);
      try {
        await fs.writeFile(filename, html, { flag: "wx" });
      } catch (e) {
        if (e.code === "EEXIST")
          throw error("同名报告已存在，请修改文件名后重试。", 409);
        throw e;
      }
      res.status(201).json({ path: `${folder}/${name}` });
    } catch (e) {
      next(e);
    }
  });
  app.use(
    "/library",
    createHtmlLibraryApp({ libraryDirectory: reports, catalogPath: catalog }),
  );
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API 不存在。" }),
  );
  app.use((e, _req, res, _next) => {
    if (!e.status) console.error("[My Holdings]", e);
    res
      .status(e.status || 500)
      .json({ error: e.status ? e.message : "本地数据读写失败，请检查日志。" });
  });
  return app;
}
