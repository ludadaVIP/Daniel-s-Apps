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
import { findCodex, runCodex, validateResearch, researchHtml } from "./ai.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const error = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const text = (v, max = 12000) => typeof v === "string" && v.length <= max;
const num = (v, min = 0, max = 1e14) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const date = (v) =>
  text(v, 10) &&
  (v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))));
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
      !CURRENCIES.includes(c.currency) ||
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
    !text(g.notes)
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
  aiRunner = runCodex,
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
        j.status = "failed";
        j.error = "服务已重启，上一次任务已中断，可重新生成。";
        changed = true;
      }
    if (changed) await write(s);
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
  app.get("/api/ai/status", async (_req, res, next) => {
    try {
      res.json({
        available: Boolean(await findCodex()),
        mode: "local-codex",
        note: "使用本机 CLI 登录；研究会发送到 Codex 服务，安装检测不代表登录已验证。",
      });
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
  app.post("/api/ai", async (req, res, next) => {
    try {
      const kind = ["watch", "portfolio", "market"].includes(req.body.kind)
        ? req.body.kind
        : "portfolio";
      if (!text(req.body.question || "", 4000)) throw error("研究问题过长。");
      const result = await serial(async () => {
        const s = await read();
        if (s.jobs.some((j) => j.status === "running"))
          throw error("已有研究正在生成，请稍候。", 409);
        const watch =
          kind === "watch"
            ? s.watchlist.find((w) => w.id === req.body.watchId)
            : null;
        if (kind === "watch" && !watch) throw error("关注标的不存在。", 404);
        const job = {
          id: randomUUID(),
          kind,
          watchId: watch?.id || null,
          status: "running",
          date: new Date().toISOString(),
          error: "",
        };
        s.jobs = [...s.jobs.slice(-19), job];
        const prompt = contextPack(
          s,
          kind,
          watch
            ? `研究此标的：${watch.name} ${watch.symbol}；我的笔记：${watch.note}；关注条件：${watch.trigger}`
            : req.body.question,
        );
        return { state: await write(s), job, prompt };
      });
      res.status(202).json({ job: result.job, state: result.state });
      void (async () => {
        try {
          const research = validateResearch(await aiRunner(result.prompt));
          const report = await saveReport(research, kind);
          await serial(async () => {
            const s = await read();
            const job = s.jobs.find((j) => j.id === result.job.id);
            if (!job) return;
            job.status = "done";
            job.report = report;
            if (kind === "watch") {
              const w = s.watchlist.find((w) => w.id === job.watchId);
              if (w) {
                w.research = research;
                if (!w.symbol && research.identity?.symbol)
                  w.symbol = research.identity.symbol.slice(0, 40);
                w.researchedAt = new Date().toISOString();
                w.report = report;
              }
            }
            s.analyses.unshift({
              id: randomUUID(),
              kind,
              date: new Date().toISOString(),
              research,
              report,
            });
            await write(s);
          });
        } catch (e) {
          await serial(async () => {
            const s = await read();
            const j = s.jobs.find((j) => j.id === result.job.id);
            if (j) {
              j.status = "failed";
              j.error = e.message;
              await write(s);
            }
          }).catch(console.error);
        }
      })();
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
          if (w) {
            w.research = research;
            if (!w.symbol && research.identity?.symbol)
              w.symbol = research.identity.symbol.slice(0, 40);
            w.researchedAt = new Date().toISOString();
            w.report = report;
          }
          s.analyses.unshift({
            id: randomUUID(),
            kind,
            date: new Date().toISOString(),
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
