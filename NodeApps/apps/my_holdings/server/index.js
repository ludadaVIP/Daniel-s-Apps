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
import { validateFundHoldings } from "../src/lookthrough.js";
import { PRICE_REFRESH_QUESTION, quoteTaskGuidance, hasCompleteResearch, watchQuoteQuestion, watchResearchQuestion } from "../src/quotes.js";
import { quotePolicy } from "./market-session.js";
import { normalizeSymbol, positionKey, roundMoney, previewBuy, applyHoldingQuote, consolidateHoldings } from "../src/positions.js";
import {
  CONVERSION_PAIRS,
  createInitialConverterState,
  ratioStats,
} from "../src/converter.js";
import { validateResearch, researchHtml } from "./ai.js";
import { atomicWriteFile, createBackupStore, sameStateContent } from "./backups.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const error = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const text = (v, max = 12000) => typeof v === "string" && v.length <= max;
const num = (v, min = 0, max = 1e14) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const filenameSlug = (value, fallback = "overview") =>
  String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || fallback;
const date = (v) =>
  text(v, 10) &&
  (v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))));
const timestamp = (v) =>
  text(v, 40) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v) &&
  Number.isFinite(Date.parse(v));
const httpsUrl = (v) => {
  if (!text(v, 1000)) return false;
  try {
    const url = new URL(v);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch { return false; }
};
const watchCurrency = (watch) => watch.priceCurrency || watch.research?.quote?.currency || watch.research?.identity?.currency || "";
function validateMarketQuote(q, policy, fetchedAt) {
  if (!q || !text(q.symbol, 40) || !q.symbol.trim() || !num(q.price, 0.000001) ||
      q.date !== policy.date || q.type !== policy.type || !text(q.source, 200) || !q.source.trim() || !httpsUrl(q.sourceUrl))
    throw error(`价格数据无效：需要 ${policy.date} 的${policy.type === "intraday" ? "盘中价" : "收盘价"}及 HTTPS 来源。`);
  if (policy.type === "intraday") {
    const asOf = Date.parse(q.asOf);
    if (!timestamp(q.asOf) || asOf < Date.parse(policy.sessionOpenAt) || asOf >= Date.parse(policy.sessionCloseAt) || asOf < Date.parse(policy.executedAt) - 20 * 60_000 || asOf > Date.parse(fetchedAt))
      throw error("盘中报价时间无效或已过期；请核实 asOf，不得使用旧收盘价。");
  } else if (q.asOf !== undefined && q.asOf !== policy.sessionCloseAt) {
    throw error(`收盘价 asOf 应为 ${policy.sessionCloseAt}，或省略此字段。`);
  }
}
function appendJobs(s, jobs) {
  s.jobs.push(...jobs);
  if (s.jobs.length <= 10000) return;
  const active = s.jobs.filter((job) => ["waiting", "running"].includes(job.status));
  if (active.length > 10000) throw error("待办数量已达上限，请先处理现有待办。", 409);
  const limit = 10000 - active.length;
  const history = s.jobs.filter((job) => !["waiting", "running"].includes(job.status));
  s.jobs = [...(limit ? history.slice(-limit) : []), ...active];
}
function applyResearchQuote(watch, quote) {
  // A research report is a dated snapshot; it cannot overwrite a price refresh.
  if (!quote || watch.priceFetchedAt || (watch.priceDate && watch.priceDate > quote.date)) return;
  Object.assign(watch, { price: quote.price, priceDate: quote.date, priceType: "close", priceCurrency: quote.currency,
    priceSource: quote.source, priceSourceUrl: quote.sourceUrl });
}
function removeOrphanedDecisionPlans(state) {
  const watchIds = new Set(state.watchlist.map((watch) => watch.id));
  state.journal = state.journal.filter((entry) => entry.kind !== "plan" || watchIds.has(entry.watchId));
}
const pruneExpiredCompletedJobs = (s, now = Date.now()) => {
  const cutoff = now - 2 * 24 * 60 * 60 * 1000;
  const retained = s.jobs.filter((job) => {
    if (job.status !== "done") return true;
    const completedAt = Date.parse(job.completedAt || job.date);
    return !Number.isFinite(completedAt) || completedAt >= cutoff;
  });
  if (retained.length === s.jobs.length) return false;
  s.jobs = retained;
  return true;
};
const nearLondonClose = (value, tradingDate, precise = false) => {
  if (!timestamp(value) || value.slice(0, 10) !== tradingDate) return false;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  const second = Number(parts.find((part) => part.type === "second")?.value);
  const localSeconds = hour * 3600 + minute * 60 + second;
  const targetSeconds = 16 * 3600 + 25 * 60;
  return precise
    ? Math.abs(localSeconds - targetSeconds) <= 30
    : localSeconds >= 16 * 3600 + 20 * 60 && localSeconds <= 16 * 3600 + 30 * 60;
};
const synchronizedPair = (baseAt, targetAt, sampleType, precise = false) => {
  const base = Date.parse(baseAt);
  const target = Date.parse(targetAt);
  if (!Number.isFinite(base) || !Number.isFinite(target)) return false;
  if (!precise) return Math.abs(base - target) <= 60_000;
  if (sampleType === "midquote") return Math.abs(base - target) <= 15_000;
  const barMs = sampleType === "five_minute_close" ? 300_000 : 60_000;
  return Math.floor(base / barMs) === Math.floor(target / barMs);
};
export function validateState(s, { allowDuplicateHoldings = false } = {}) {
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
      !(h.priceType === undefined || ["intraday", "close", "purchase"].includes(h.priceType)) ||
      !(h.priceAsOf === undefined || timestamp(h.priceAsOf)) ||
      !(h.priceFetchedAt === undefined || timestamp(h.priceFetchedAt)) ||
      !(h.priceSourceUrl === undefined || httpsUrl(h.priceSourceUrl)) ||
      !date(h.recordedAt) ||
      !text(h.sector, 100) ||
      !text(h.source, 200) ||
      !text(h.thesis) ||
      !text(h.exitRule)
    )
      throw error("持仓数据无效；请检查金额、数量、币种与日期。");
  if (!allowDuplicateHoldings && new Set(s.holdings.map(positionKey)).size !== s.holdings.length)
    throw error("同一账户、代码和币种只能有一项持仓；请通过「记录买入」追加股数，或修正已有持仓。");
  if (s.holdingTrades !== undefined) {
    if (!Array.isArray(s.holdingTrades) || s.holdingTrades.length > 10000)
      throw error("买入记录格式无效。");
    const tradeIds = new Set();
    for (const trade of s.holdingTrades) {
      if (!trade || !text(trade.id, 200) || !trade.id || tradeIds.has(trade.id) ||
          !["buy", "import"].includes(trade.type) || !text(trade.holdingId, 100) || !trade.holdingId ||
          !text(trade.accountId, 100) || !trade.accountId || !text(trade.symbol, 40) || !trade.symbol.trim() ||
          !CURRENCIES.includes(trade.currency) || !num(trade.quantity) || !num(trade.price) ||
          !num(trade.fees) || !num(trade.cost) || !date(trade.date) || !timestamp(trade.recordedAt))
        throw error("买入记录数据无效。");
      tradeIds.add(trade.id);
    }
  }
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
    if (
      !(w.targetPrice === undefined || w.targetPrice === null || num(w.targetPrice, 0.000001)) ||
      !(w.price === undefined || w.price === null || num(w.price, 0.000001)) ||
      !(w.priceDate === undefined || date(w.priceDate)) ||
      !(w.priceType === undefined || ["intraday", "close"].includes(w.priceType)) ||
      !(w.priceAsOf === undefined || timestamp(w.priceAsOf)) ||
      !(w.priceFetchedAt === undefined || timestamp(w.priceFetchedAt)) ||
      !(w.priceTimeZone === undefined || ["America/New_York", "Europe/London"].includes(w.priceTimeZone)) ||
      !(w.priceCurrency === undefined || (text(w.priceCurrency, 3) && /^[A-Z]{3}$/.test(w.priceCurrency))) ||
      !(w.priceSource === undefined || text(w.priceSource, 200)) ||
      !(w.attention === undefined || [1, 2, 3, 4, 5].includes(w.attention)) ||
      !(w.priceSourceUrl === undefined || (text(w.priceSourceUrl, 1000) && (!w.priceSourceUrl || /^https?:\/\//.test(w.priceSourceUrl))))
    )
      throw error("关注标的的价格或日期无效。");
    if (w.research) validateResearch(w.research);
  }
  if (
    s.watchRankHistory !== undefined &&
    (!Array.isArray(s.watchRankHistory) ||
      s.watchRankHistory.length > 2 ||
      s.watchRankHistory.some((snapshot) =>
        !snapshot ||
        !date(snapshot.date) ||
        !snapshot.date ||
        !Array.isArray(snapshot.watchIds) ||
        snapshot.watchIds.length > 10000 ||
        snapshot.watchIds.some((id) => !text(id, 100) || !id) ||
        new Set(snapshot.watchIds).size !== snapshot.watchIds.length,
      ))
  )
    throw error("关注榜单的每日名次数据无效。");
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
  const optionalNumber = (value, min, max = 1e14) =>
    value === undefined || value === null || num(value, min, max);
  const validRange = (low, high) =>
    (low === undefined || low === null) && (high === undefined || high === null) ||
    num(low, 0.000001) && num(high, 0.000001) && low <= high;
  const planEntries = s.journal.filter((entry) => entry.kind === "plan");
  if (new Set(planEntries.map((entry) => entry.watchId)).size !== planEntries.length)
    throw error("同一关注标的只能有一张个股行动计划。");
  for (const entry of planEntries) {
    const plan = entry.plan;
    if (
      !text(entry.watchId, 100) || !entry.watchId ||
      !plan || typeof plan !== "object" || Array.isArray(plan) ||
      !optionalNumber(plan.allocationPct, 0, 100) ||
      !validRange(plan.safetyLow, plan.safetyHigh) ||
      !validRange(plan.discountLow, plan.discountHigh)
    )
      throw error("个股行动计划无效；请检查仓位与价格区间。");
  }
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
  if (s.converter !== undefined) {
    const converter = s.converter;
    if (
      !converter ||
      typeof converter !== "object" ||
      !Array.isArray(converter.calibrations) ||
      converter.calibrations.length !== CONVERSION_PAIRS.length ||
      !text(converter.updatedAt, 40) ||
      !converter.updatedAt
    )
      throw error("换算公式数据无效。");
    const seenPairs = new Set();
    for (const calibration of converter.calibrations) {
      const pair = CONVERSION_PAIRS.find((item) => item.id === calibration?.pairId);
      if (!pair || seenPairs.has(calibration.pairId))
        throw error("换算公式缺少唯一的产品配对。");
      seenPairs.add(calibration.pairId);
      const method = calibration.method || "daily_ohlc";
      if (
        !["daily_ohlc", "synchronized_intraday"].includes(method) ||
        (method === "synchronized_intraday" && !["midquote", "minute_close", "five_minute_close"].includes(calibration.sampleType)) ||
        !num(calibration.ratio, 0.00000001) ||
        !num(calibration.lowRatio, 0.00000001) ||
        !num(calibration.highRatio, 0.00000001) ||
        calibration.lowRatio > calibration.ratio ||
        calibration.ratio > calibration.highRatio ||
        (method === "daily_ohlc"
          ? calibration.observationCount !== 5
          : ![5, 10].includes(calibration.observationCount)) ||
        !date(calibration.asOf) ||
        !calibration.asOf ||
        !text(calibration.updatedAt, 40) ||
        !calibration.updatedAt ||
        !Array.isArray(calibration.observations) ||
        calibration.observations.length !== calibration.observationCount ||
        !calibration.sources ||
        ![calibration.sources.base, calibration.sources.target].every(
          (url) => text(url, 1000) && /^https?:\/\//.test(url),
        )
      )
        throw error(`换算公式字段无效：${pair.id}。`);
      const dates = new Set();
      for (const row of calibration.observations) {
        const validPrices = method === "synchronized_intraday"
          ? timestamp(row?.baseAt) &&
            timestamp(row?.targetAt) &&
            nearLondonClose(row.baseAt, row.date, calibration.observationCount === 10) &&
            nearLondonClose(row.targetAt, row.date, calibration.observationCount === 10) &&
            synchronizedPair(row.baseAt, row.targetAt, calibration.sampleType, calibration.observationCount === 10) &&
            num(row?.basePrice, 0.000001) &&
            num(row?.targetPrice, 0.000001)
          : num(row?.baseOpen, 0.000001) &&
            num(row?.baseClose, 0.000001) &&
            num(row?.targetOpen, 0.000001) &&
            num(row?.targetClose, 0.000001);
        if (
          !row ||
          !date(row.date) ||
          !row.date ||
          dates.has(row.date) ||
          !validPrices
        )
          throw error(`换算公式观测值无效：${pair.id}。`);
        dates.add(row.date);
      }
      const stats = ratioStats(calibration.observations, method, {
        robustBand: calibration.observationCount === 10,
      });
      const observedThrough = [...dates].sort().at(-1);
      if (
        calibration.sampleCount !== stats.sampleCount ||
        Math.abs(calibration.ratio - stats.ratio) > 1e-10 ||
        Math.abs(calibration.lowRatio - stats.lowRatio) > 1e-10 ||
        Math.abs(calibration.highRatio - stats.highRatio) > 1e-10 ||
        calibration.asOf !== observedThrough
      )
        throw error(`换算公式与原始观测值不一致：${pair.id}。`);
    }
  }
  return s;
}
function consolidateStateHoldings(s, recordedAt) {
  const { holdings, merges } = consolidateHoldings(s.holdings);
  if (!merges.length) return false;
  s.holdings = holdings;
  s.holdingTrades ||= [];
  for (const { holding, originals } of merges) {
    for (const original of originals) {
      const id = `import:${original.id}`;
      if (s.holdingTrades.some((trade) => trade.id === id)) continue;
      s.holdingTrades.push({ id, type: "import", holdingId: holding.id, accountId: holding.accountId,
        symbol: holding.symbol, currency: holding.currency, quantity: original.quantity, price: original.averagePrice,
        fees: 0, cost: original.cost, date: original.recordedAt, recordedAt, originalHolding: original });
    }
  }
  return true;
}
export async function createHoldingsApp({
  dataDirectory = path.join(root, "data"),
  now = () => new Date(),
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
    validateState(JSON.parse(await fs.readFile(file, "utf8")), { allowDuplicateHoldings: true });
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
      "> 用户明确交代 Codex 执行待办后，再读取此文件和 `state.json`；研究任务保存 HTML，价格任务按执行时刻取盘中价或最近收盘价，换算任务回写同步配对观测。",
      "",
      `最近同步：${s.updatedAt || "尚未保存"}`,
      "",
    ];
    if (!waiting.length) lines.push("当前没有等待中的任务。", "");
    for (const job of waiting) {
      const watch = s.watchlist.find((w) => w.id === job.watchId);
      const title = job.kind === "converter"
        ? "VOO / SPYL · QQQM / CNDX"
        : watch?.name || job.question || "持仓组合";
      lines.push(
        `## ${job.kind === "watch" ? "标的研究" : job.kind === "watch-quotes" ? "关注价格更新" : job.kind === "market" ? "行情分析" : job.kind === "quotes" ? "价格更新" : job.kind === "converter" ? "换算公式更新" : "组合分析"} · ${title}`,
        `- 状态：等待 Codex · 任务 ID：${job.id}`,
        `- 创建时间：${job.date}`,
        `- 关注记录 ID：${job.watchId || "无"}`,
        job.question ? `- 本次请求：${job.question}` : "",
        watch?.targetPrice ? `- 用户等待价格：${watch.targetPrice} ${watch.research?.quote?.currency || "USD"}` : "",
        ["quotes", "watch-quotes"].includes(job.kind)
          ? `- ${quoteTaskGuidance()}`
          : job.kind === "converter"
            ? "- 核对 VOO/SPYL 与 QQQM/CNDX 的 USD 挂牌代码，取最近 10 个共同交易日伦敦时间 16:25:00±30 秒的同步盘中价；同一组 10 天统一使用盘口中间价（两边相差≤15秒）、同一 UTC 分钟的一分钟收盘价，或同一 UTC 五分钟区间且在 16:25 收盘的五分钟线。通过本地 API 回写 calibrations 与来源；系数取配对比值中位数，参考带取 P25–P75。无法找到可核验的同步数据就标记未完成并保留旧公式，不生成 HTML、不改持仓。"
            : job.kind === "watch"
              ? `- ${watchResearchQuestion(watch || { name: "标的已删除", symbol: "" }, job.researchMode !== "initial")}`
              : "- 只在用户明确要求时执行；联网核对数据日期与来源，生成独立 HTML，并通过本地 API 回写结构化研究。",
        "",
      );
    }
    await fs.writeFile(todoFile, lines.join("\n"));
  };
  const backupStore = createBackupStore(path.join(dataDirectory, "backups"), { now });
  await backupStore.initialize(await fs.readFile(file, "utf8"));
  const write = async (s, { forceBackup = false } = {}) => {
    pruneExpiredCompletedJobs(s, now().getTime());
    validateState(s);
    const previous = await fs.readFile(file, "utf8");
    const previousState = JSON.parse(previous);
    if (!forceBackup && sameStateContent(previousState, s)) return previousState;
    const backedUp = await backupStore.beforeWrite(previous, previousState, s, { force: forceBackup });
    s.revision = (previousState.revision || 0) + 1;
    s.updatedAt = now().toISOString();
    await atomicWriteFile(file, JSON.stringify(s, null, 2) + "\n");
    await syncCodexTodo(s);
    // Cleanup must not turn a successfully committed financial change into an
    // apparent failed request (and tempt the caller to repeat the operation).
    if (backedUp) await backupStore.prune().catch((e) => console.warn(`My Holdings: 备份清理延后: ${e.message}`));
    return s;
  };
  await serial(async () => {
    const s = await read();
    let changed = false;
    if (!s.converter) {
      s.converter = createInitialConverterState();
      changed = true;
    } else {
      for (const calibration of s.converter.calibrations) {
        if (!calibration.method) {
          calibration.method = "daily_ohlc";
          changed = true;
        }
      }
    }
    for (const w of s.watchlist) {
      if (w.attention === undefined) {
        w.attention = 2;
        changed = true;
      }
      if (!w.symbol && /^[A-Z][A-Z0-9.-]{0,14}$/.test(w.name)) {
        w.symbol = w.name;
        changed = true;
      }
    }
    if (!Array.isArray(s.watchRankHistory)) {
      s.watchRankHistory = [];
      changed = true;
    }
    for (const j of s.jobs)
      if (j.status === "failed" && /未找到 Codex CLI/.test(j.error || "")) {
        j.status = "waiting";
        j.error = "";
        changed = true;
      }
    for (const j of s.jobs)
      if (j.status === "running") {
        j.status = "waiting";
        j.error = "等待你下次明确交给 Codex 执行。";
        changed = true;
      }
    for (const j of s.jobs)
      if (j.kind === "quotes" && j.status === "waiting" && j.question !== PRICE_REFRESH_QUESTION) {
        j.question = PRICE_REFRESH_QUESTION;
        changed = true;
      }
    const migratedResearch = [];
    for (const job of s.jobs) {
      if (job.kind !== "watch" || job.status !== "waiting" || !job.question?.startsWith("刷新关注标的 ")) continue;
      const watch = s.watchlist.find((w) => w.id === job.watchId);
      if (!watch) continue;
      Object.assign(job, { kind: "watch-quotes", question: watchQuoteQuestion(watch), batchId: "legacy-watch-refresh", origin: "watch-refresh" });
      if (!hasCompleteResearch(watch) && !s.jobs.some((j) => j.kind === "watch" && j.watchId === watch.id && j.status === "waiting"))
        migratedResearch.push({ id: randomUUID(), kind: "watch", watchId: watch.id, researchMode: "initial", question: watchResearchQuestion(watch), status: "waiting", date: now().toISOString(), error: "", batchId: job.batchId, origin: job.origin });
      changed = true;
    }
    appendJobs(s, migratedResearch);
    if (consolidateStateHoldings(s, now().toISOString())) changed = true;
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
      const state = await serial(async () => {
        const s = await read();
        return pruneExpiredCompletedJobs(s, now().getTime()) ? write(s) : s;
      });
      res.set("Cache-Control", "no-store").json(state);
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/fund-holdings", async (_req, res, next) => {
    try {
      // Disclosures are independent of personal state and read afresh after a Codex review.
      const file = new URL("../data/fund-holdings.json", import.meta.url);
      const data = validateFundHoldings(JSON.parse(await fs.readFile(file, "utf8")));
      res.set("Cache-Control", "no-store").json(data);
    } catch (e) { next(e); }
  });
  app.post("/api/watchlist/rank-snapshot", async (req, res, next) => {
    try {
      const snapshotDate = req.body?.date;
      const watchIds = req.body?.watchIds;
      if (
        !date(snapshotDate) ||
        !snapshotDate ||
        !Array.isArray(watchIds) ||
        watchIds.length > 10000 ||
        watchIds.some((id) => !text(id, 100) || !id) ||
        new Set(watchIds).size !== watchIds.length
      )
        throw error("关注榜单的每日名次数据无效。");
      const result = await serial(async () => {
        const s = await read();
        const knownIds = new Set(s.watchlist.map((watch) => watch.id));
        if (watchIds.some((id) => !knownIds.has(id)))
          throw error("关注榜单包含已不存在的标的，请刷新页面后重试。", 409);
        const previousDate = new Date(`${snapshotDate}T00:00:00.000Z`);
        previousDate.setUTCDate(previousDate.getUTCDate() - 1);
        const yesterday = previousDate.toISOString().slice(0, 10);
        const history = s.watchRankHistory || [];
        const retained = history.filter((snapshot) =>
          snapshot.date === snapshotDate || snapshot.date === yesterday,
        );
        const existing = retained.find((snapshot) => snapshot.date === snapshotDate);
        const unchanged =
          existing &&
          existing.watchIds.length === watchIds.length &&
          existing.watchIds.every((id, index) => id === watchIds[index]) &&
          retained.length === history.length;
        if (unchanged) return { state: s, changed: false };
        s.watchRankHistory = [
          ...retained.filter((snapshot) => snapshot.date !== snapshotDate),
          { date: snapshotDate, watchIds },
        ].sort((a, b) => a.date.localeCompare(b.date));
        return { state: await write(s), changed: true };
      });
      res.json(result);
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
      const kind = ["watch", "watch-quotes", "portfolio", "market", "quotes", "converter"].includes(req.body.kind)
        ? req.body.kind
        : "portfolio";
      const result = await serial(async () => {
        const s = await read();
        const watch = ["watch", "watch-quotes"].includes(kind)
          ? s.watchlist.find((w) => w.id === req.body.watchId)
          : null;
        if (["watch", "watch-quotes"].includes(kind) && !watch) throw error("关注标的不存在。", 404);
        if (watch && s.jobs.some((j) => j.status === "waiting" && j.kind === kind && j.watchId === watch.id))
          throw error("这个标的已经在 Codex 待办队列中。", 409);
        if (kind === "watch" && hasCompleteResearch(watch) && req.body.refreshResearch !== true)
          throw error("该标的已有完整研究；日常请刷新价格，需要新研究请点击「更新完整研究」。", 409);
        if (!watch && s.jobs.some((j) => j.status === "waiting" && j.kind === kind))
          throw error("相同类型的任务已经在待办队列中。", 409);
        const job = {
          id: randomUUID(),
          kind,
          watchId: watch?.id || null,
          question: kind === "quotes" ? PRICE_REFRESH_QUESTION : kind === "watch-quotes" ? watchQuoteQuestion(watch) : kind === "watch" ? watchResearchQuestion(watch, req.body.refreshResearch === true) : text(req.body.question || "", 4000) ? req.body.question : "",
          ...(kind === "watch" ? { researchMode: req.body.refreshResearch === true ? "refresh" : "initial" } : {}),
          status: "waiting",
          date: new Date().toISOString(),
          error: "",
        };
        appendJobs(s, [job]);
        return { state: await write(s), job };
      });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/batch-watch", async (req, res, next) => {
    try {
      const requests = req.body?.jobs;
      if (requests !== undefined && (!Array.isArray(requests) || requests.length > 1000 || requests.some((item) =>
        !item || !text(item.watchId, 100) || !item.watchId,
      ))) throw error("批量关注更新列表无效。");
      const result = await serial(async () => {
        const s = await read();
        const waitingKeys = new Set(
          s.jobs.filter((job) => ["watch", "watch-quotes"].includes(job.kind) && job.status === "waiting").map((job) => `${job.kind}:${job.watchId}`),
        );
        const seenIds = new Set();
        const createdJobs = [];
        const batchId = randomUUID();
        const origin = req.body.origin === "watch-add" ? "watch-add" : "watch-refresh";
        for (const item of requests || s.watchlist.map((watch) => ({ watchId: watch.id }))) {
          const watch = s.watchlist.find((row) => row.id === item.watchId);
          if (!watch) throw error("批量关注更新中有标的已不存在，请刷新页面后重试。", 404);
          if (seenIds.has(watch.id)) continue;
          seenIds.add(watch.id);
          const common = { watchId: watch.id, status: "waiting", date: now().toISOString(), error: "", batchId, origin };
          if (!waitingKeys.has(`watch-quotes:${watch.id}`))
            createdJobs.push({ ...common, id: randomUUID(), kind: "watch-quotes", question: watchQuoteQuestion(watch) });
          if (!hasCompleteResearch(watch) && !waitingKeys.has(`watch:${watch.id}`))
            createdJobs.push({ ...common, id: randomUUID(), kind: "watch", researchMode: "initial", question: watchResearchQuestion(watch) });
        }
        if (!createdJobs.length) return { state: s, jobs: createdJobs };
        appendJobs(s, createdJobs);
        return { state: await write(s), jobs: createdJobs };
      });
      res.status(result.jobs.length ? 201 : 200).json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/cancel", async (req, res, next) => {
    try {
      const jobIds = req.body?.jobIds;
      if (!Array.isArray(jobIds) || jobIds.length > 1000 || jobIds.some((jobId) => !text(jobId, 100) || !jobId))
        throw error("待撤销的任务列表无效。");
      const result = await serial(async () => {
        const s = await read();
        const cancelIds = new Set(
          s.jobs
            .filter((job) => jobIds.includes(job.id) && ["watch", "watch-quotes"].includes(job.kind) && job.status === "waiting" && !job.quotePolicy)
            .map((job) => job.id),
        );
        const cancelledIds = [...cancelIds];
        if (!cancelledIds.length) return { state: s, cancelledIds };
        s.jobs = s.jobs.filter((job) => !cancelIds.has(job.id));
        return { state: await write(s), cancelledIds };
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/:id/quote-policy", async (req, res, next) => {
    try {
      const result = await serial(async () => {
        const s = await read();
        const job = s.jobs.find((j) => j.id === req.params.id);
        if (!job) throw error("待办任务不存在。", 404);
        if (!["quotes", "watch-quotes"].includes(job.kind) || job.status !== "waiting")
          throw error("只能为等待中的价格任务开始取价。", 409);
        const watch = job.kind === "watch-quotes" ? s.watchlist.find((w) => w.id === job.watchId) : null;
        if (job.kind === "watch-quotes" && !watch) throw error("关注标的已不存在。", 404);
        const market = watch && /\bLSE\b|London/i.test(watch.research?.identity?.exchange || "") ? "LSE" : "US";
        job.quotePolicy = quotePolicy(now(), market);
        await write(s);
        return { policy: job.quotePolicy, symbols: watch ? (watch.symbol ? [normalizeSymbol(watch.symbol)] : []) : [...new Set(s.holdings.map((h) => normalizeSymbol(h.symbol)))],
          ...(watch ? { target: { watchId: watch.id, name: watch.name, symbol: watch.symbol, currency: watchCurrency(watch), exchange: watch.research?.identity?.exchange || "" } } : {}) };
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/jobs/:id/complete", async (req, res, next) => {
    try {
      const quoteResult = await serial(async () => {
        const s = await read();
        const job = s.jobs.find((j) => j.id === req.params.id);
        if (!job) throw error("待办任务不存在。", 404);
        if (job.kind === "watch" && job.status !== "waiting") throw error("研究任务已结束；需要新研究时请明确创建更新任务。", 409);
        if (job.kind === "watch" && !s.watchlist.some((w) => w.id === job.watchId)) throw error("关注标的已不存在。", 404);
        if (job.kind === "watch" && job.researchMode === "initial" && job.status === "waiting" && hasCompleteResearch(s.watchlist.find((w) => w.id === job.watchId))) {
          Object.assign(job, { status: "done", completedAt: now().toISOString(), summary: "该标的已有完整研究，已跳过首次研究并保留已有报告。", error: "" });
          return write(s);
        }
        if (["quotes", "watch-quotes"].includes(job.kind)) {
          if (job.status !== "waiting") throw error("价格任务已结束，请重新创建待办。", 409);
          if (!timestamp(job.quotePolicy?.executedAt) || req.body.executedAt !== job.quotePolicy.executedAt)
            throw error("请先调用本任务的 quote-policy，并原样提交 executedAt。", 409);
          const policy = quotePolicy(job.quotePolicy.executedAt, job.quotePolicy.market || "US");
          const fetchedAt = now().toISOString();
          if (!Array.isArray(req.body.quotes) || req.body.quotes.length > 1000)
            throw error("价格任务需要提供 quotes 数组。" );
          if (job.kind === "watch-quotes") {
            const watch = s.watchlist.find((w) => w.id === job.watchId);
            if (!watch) throw error("关注标的已不存在。", 404);
            if (req.body.research !== undefined || req.body.report !== undefined) throw error("关注价格任务只更新报价，不接受研究或报告。");
            if (req.body.quotes.length !== 1) throw error("关注价格任务只能提交当前标的一条报价。");
            const q = req.body.quotes[0];
            validateMarketQuote(q, policy, fetchedAt);
            if ((watch.symbol && normalizeSymbol(watch.symbol) !== normalizeSymbol(q.symbol)) ||
                !text(q.currency, 3) || !/^[A-Z]{3}$/.test(q.currency) || (watchCurrency(watch) && watchCurrency(watch) !== q.currency))
              throw error("关注报价的证券代码或币种不符，请核实交易所与挂牌币种。");
            Object.assign(watch, { symbol: normalizeSymbol(q.symbol), price: q.price, priceDate: q.date, priceType: q.type,
              priceCurrency: q.currency, priceAsOf: q.type === "intraday" ? q.asOf : policy.sessionCloseAt,
              priceFetchedAt: fetchedAt, priceTimeZone: policy.timeZone, priceSource: q.source.trim(), priceSourceUrl: q.sourceUrl });
            Object.assign(job, { status: "done", completedAt: fetchedAt, error: "", summary: `已更新 ${watch.symbol} 的${q.type === "intraday" ? "盘中价" : "最近交易日收盘价"}；已有研究保留。` });
            s.watchlistUpdatedAt = fetchedAt;
            return write(s);
          }
          const expected = new Set(s.holdings.map((h) => h.symbol.trim().toUpperCase()));
          const received = new Set();
          for (const q of req.body.quotes) {
            validateMarketQuote(q, policy, fetchedAt);
            const symbol = q.symbol.trim().toUpperCase();
            if (!expected.has(symbol) || received.has(symbol)) throw error(`价格代码无效或重复：${symbol}。`);
            received.add(symbol);
          }
          const missing = [...expected].filter((symbol) => !received.has(symbol));
          if (missing.length) throw error(`尚未提供这些持仓的价格：${missing.join(", " )}`);
          const bySymbol = new Map(req.body.quotes.map((q) => [q.symbol.trim().toUpperCase(), q]));
          for (const h of s.holdings) {
            const q = bySymbol.get(h.symbol.trim().toUpperCase());
            h.price = q.price;
            h.priceDate = q.date;
            h.priceSource = q.source.trim().slice(0, 100);
            h.priceType = policy.type;
            h.priceAsOf = policy.type === "intraday" ? q.asOf : policy.sessionCloseAt;
            h.priceFetchedAt = fetchedAt;
            h.priceSourceUrl = q.sourceUrl;
            h.marketValue = Math.round(h.quantity * h.price * 100) / 100;
          }
          job.status = "done";
          job.summary = text(req.body.summary || "", 1000) && req.body.summary?.trim() ? req.body.summary : `已更新全部持仓的${policy.type === "intraday" ? "盘中价格" : "最近交易日收盘价"}。`;
          job.error = "";
          job.completedAt = fetchedAt;
          s.marketUpdatedAt = job.completedAt;
          return write(s);
        }
        if (job.kind === "converter") {
          const submitted = req.body?.calibrations;
          if (!Array.isArray(submitted) || submitted.length !== CONVERSION_PAIRS.length)
            throw error("换算公式任务需要提交两组 calibrations。");
          const now = new Date().toISOString();
          const seenPairs = new Set();
          const calibrations = submitted.map((input) => {
            const pair = CONVERSION_PAIRS.find((item) => item.id === input?.pairId);
            if (!pair || seenPairs.has(pair.id)) throw error("换算公式必须包含且只包含两组已配置产品。");
            seenPairs.add(pair.id);
            if (input.method !== "synchronized_intraday")
              throw error(`${pair.baseSymbol}/${pair.targetSymbol} 更新必须使用两边同一时点的盘中价格。`);
            if (!["midquote", "minute_close", "five_minute_close"].includes(input.sampleType))
              throw error(`${pair.baseSymbol}/${pair.targetSymbol} 必须为 10 天样本统一选择盘口中间价、一分钟收盘价或五分钟收盘价。`);
            if (!Array.isArray(input.observations) || input.observations.length !== 10)
              throw error(`${pair.baseSymbol}/${pair.targetSymbol} 必须提供最近 10 个共同交易日的同步样本。`);
            if (
              !input.sources ||
              ![input.sources.base, input.sources.target].every(
                (url) => text(url, 1000) && /^https:\/\//i.test(url),
              )
            )
              throw error(`${pair.baseSymbol}/${pair.targetSymbol} 缺少 HTTPS 行情来源链接。`);
            const observations = input.observations
              .map((row) => ({
                date: row?.date,
                baseAt: row?.baseAt,
                targetAt: row?.targetAt,
                basePrice: row?.basePrice,
                targetPrice: row?.targetPrice,
              }))
              .sort((a, b) => String(a.date).localeCompare(String(b.date)));
            const dates = new Set();
            for (const row of observations) {
              if (
                !row ||
                !date(row.date) ||
                !row.date ||
                dates.has(row.date) ||
                !nearLondonClose(row.baseAt, row.date, true) ||
                !nearLondonClose(row.targetAt, row.date, true) ||
                !synchronizedPair(row.baseAt, row.targetAt, input.sampleType, true) ||
                !num(row.basePrice, 0.000001) ||
                !num(row.targetPrice, 0.000001)
              )
                throw error(`${pair.baseSymbol}/${pair.targetSymbol} 的同步时间或价格无效；盘口报价须相差不超过 15 秒，分钟线必须来自同一 UTC 分钟或五分钟线必须来自同一 UTC 五分钟区间。`);
              dates.add(row.date);
            }
            const stats = ratioStats(observations, "synchronized_intraday");
            return {
              pairId: pair.id,
              method: "synchronized_intraday",
              sampleType: input.sampleType,
              ...stats,
              observationCount: observations.length,
              asOf: observations.at(-1).date,
              updatedAt: now,
              observations,
              sources: {
                base: input.sources.base.trim(),
                target: input.sources.target.trim(),
              },
            };
          });
          if (seenPairs.size !== CONVERSION_PAIRS.length)
            throw error("换算公式必须包含 VOO/SPYL 与 QQQM/CNDX 两组数据。");
          s.converter = { updatedAt: now, calibrations };
          job.status = "done";
          job.summary = text(req.body.summary || "", 1000)
            ? req.body.summary
            : "已更新两组基金的短期价格换算系数。";
          job.error = "";
          job.completedAt = now;
          return write(s);
        }
        return null;
      });
      if (quoteResult) return res.json(quoteResult);
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
        if (job.kind === "watch" && job.status !== "waiting") throw error("研究任务已结束。", 409);
        if (job.kind === "watch" && job.researchMode === "initial" && hasCompleteResearch(s.watchlist.find((w) => w.id === job.watchId))) {
          Object.assign(job, { status: "done", completedAt: now().toISOString(), summary: "该标的已有完整研究，已跳过首次研究并保留已有报告。", error: "" });
          return write(s);
        }
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
            applyResearchQuote(w, research.quote);
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
  app.post("/api/holdings/buy", async (req, res, next) => {
    try {
      const input = req.body;
      if (!text(input.id, 100) || !input.id || !text(input.accountId, 100) ||
          !text(input.symbol, 40) || !input.symbol.trim() || !CURRENCIES.includes(input.currency) ||
          !text(input.name || "", 300) || !text(input.sector || "", 100) ||
          !num(input.quantity, 0.00000001) || !num(input.price, 0.00000001) ||
          !num(input.fees ?? 0) || !date(input.date) || !input.date ||
          !num(roundMoney(input.quantity * input.price + (input.fees || 0))))
        throw error("买入数据无效；请填写账户、代码、正数股数、买入单价和日期。");
      const buy = { id: input.id, accountId: input.accountId, symbol: normalizeSymbol(input.symbol), currency: input.currency,
        quantity: input.quantity, price: input.price, fees: input.fees || 0, date: input.date };
      const result = await serial(async () => {
        const s = await read();
        const previous = s.holdingTrades?.find((trade) => trade.id === buy.id);
        if (previous) {
          if (previous.type !== "buy" || Object.keys(buy).some((key) => previous[key] !== buy[key]))
            throw error("这笔买入的标识已被使用，请关闭表单后重新记录。", 409);
          return { state: s, holding: s.holdings.find((h) => h.id === previous.holdingId), duplicate: true };
        }
        if (input.revision !== s.revision) throw error("数据已更新，请核对刷新后的合并预览再保存；表单已保留。", 409);
        if (!s.accounts.some((a) => a.id === buy.accountId)) throw error("账户不存在。", 404);
        const preview = previewBuy(s.holdings, buy);
        const base = preview.existing || { id: randomUUID(), accountId: buy.accountId, symbol: buy.symbol,
          name: input.name?.trim() || preview.quote?.name || buy.symbol, currency: buy.currency,
          sector: input.sector?.trim() || preview.quote?.sector || "其他", source: "手工买入",
          recordedAt: buy.date, thesis: "", exitRule: "" };
        const holding = applyHoldingQuote({ ...base, quantity: preview.quantity, cost: preview.cost, averagePrice: preview.averagePrice }, preview.quote, buy.price);
        const index = s.holdings.findIndex((h) => h.id === holding.id);
        if (index < 0) s.holdings.push(holding);
        else s.holdings[index] = holding;
        s.holdingTrades ||= [];
        s.holdingTrades.push({ ...buy, type: "buy", holdingId: holding.id, cost: preview.addedCost, recordedAt: now().toISOString() });
        return { state: await write(s), holding, merged: Boolean(preview.existing) };
      });
      res.json(result);
    } catch (e) { next(e); }
  });
  app.put("/api/state", async (req, res, next) => {
    try {
      res.json(
        await serial(async () => {
          const current = await read();
          if (req.body.revision !== current.revision)
            throw error("数据已更新，请刷新后重试；未保存的表单仍保留。", 409);
          const candidate = validateState(req.body);
          removeOrphanedDecisionPlans(candidate);
          candidate.jobs = current.jobs;
          candidate.analyses = current.analyses;
          if (current.holdingTrades) candidate.holdingTrades = current.holdingTrades;
          else delete candidate.holdingTrades;
          candidate.converter = candidate.converter || current.converter || createInitialConverterState();
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
          const candidate = structuredClone(validateState(req.body.state, { allowDuplicateHoldings: true }));
          removeOrphanedDecisionPlans(candidate);
          consolidateStateHoldings(candidate, now().toISOString());
          candidate.revision = current.revision;
          candidate.jobs = [];
          candidate.converter = candidate.converter || current.converter || createInitialConverterState();
          return write(candidate, { forceBackup: true });
        }),
      );
    } catch (e) {
      next(e);
    }
  });
  const saveReport = async (research, kind) => {
    const generatedAt = new Date().toISOString();
    const folder =
      kind === "watch" ? "research" : kind === "market" ? "market" : "portfolio";
    const reportType =
      kind === "watch"
        ? "research"
        : kind === "market"
          ? "market-review"
          : "portfolio-review";
    const subject = kind === "watch"
      ? research.identity?.symbol || research.identity?.name || research.title
      : kind === "market"
        ? research.identity?.symbol
        : "";
    const stem = [
      "my-holdings",
      reportType,
      subject ? filenameSlug(subject) : "",
      generatedAt.slice(0, 10),
    ].filter(Boolean).join("-");
    const directory = path.join(reports, folder);
    let name = `${stem}.html`;
    for (let suffix = 2; ; suffix += 1) {
      try {
        await fs.access(path.join(directory, name));
        name = `${stem}-${String(suffix).padStart(2, "0")}.html`;
      } catch (e) {
        if (e.code === "ENOENT") break;
        throw e;
      }
    }
    await fs.writeFile(
      path.join(reports, folder, name),
      researchHtml(research, generatedAt),
      { flag: "wx" },
    );
    return `${folder}/${name}`;
  };
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
            applyResearchQuote(w, research.quote);
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
