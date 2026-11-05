export const DECISION_CAPITAL_USD = 400000;
export const DECISION_MASTERS = ["graham", "buffett", "munger", "lynch", "dalio", "soros", "marks"];
export const DECISION_TIERS = ["observation", "safety", "discount"];
export const DECISION_TIER_NAMES = ["一 · 小仓观察", "二 · 安全边际", "三 · 折价"];

export function decisionTaskQuestion(watch) {
  return `为 ${watch.symbol} ${watch.name} 重新完成七种投资思想的深度决策报告。执行时核验最新交易时段与价格（标真实报价时间；取不到实时价则明确最近可核验价）、最新官方财报、股数和稀释、现金债务、市场及重大事件。按格雷厄姆、巴菲特、芒格、彼得林奇、达利欧、索罗斯、霍华德马克斯的理论分别提出判断、证据、最强质疑和回应，再交叉辩论，明确这是方法模拟而非本人观点。先展示结论、三档入场价格（小仓观察/安全边际/折价）及40万美元组合的条件仓位、金额和股数；后展示业务与护城河、财务与治理、两种独立估值、反推预期、悲观/基准/乐观的今日价值和五年期末价格及收益、敏感性、风险、催化和失效条件。仓位需扣除已有直接与可核实ETF间接敞口并考虑主题重叠；三档资金是单只目标仓位内分配，不能把全部个股上限相加后同时下单。缺数据不编造价格；无合适机会可以0仓位。读取 apps/my_holdings/data/DECISION_REPORTS.md 的JSON契约，通过 POST /my-holdings/api/jobs/{任务ID}/complete 提交 {decision:完整报告对象}，服务端保存独立JSON和自包含HTML及历史版本。保留用户手填计划、行情和已有研究；无法完成则调用fail并保留旧报告。每完成一支，在当前聊天给出结论后继续下一支。`;
}

export function decisionEntryPlan(report) {
  const budget = report.capitalUsd * report.position.targetPct / 100;
  const remaining = Math.max(0, budget - report.position.existingExposureUsd - (report.position.pendingBuyUsd || 0));
  return report.entries.map((entry) => {
    const dollars = remaining * entry.budgetSharePct / 100;
    return { ...entry, dollars, shares: entry.high > 0 ? Math.floor(dollars / entry.high) : null };
  });
}

export function scenarioReturn(price, entry, years = 5) {
  return typeof price === "number" && Number.isFinite(price) && price >= 0 && typeof entry === "number" && entry > 0
    ? (price / entry) ** (1 / years) - 1 : null;
}

export function scenarioUpside(price, entry) {
  return typeof price === "number" && Number.isFinite(price) && price >= 0 && typeof entry === "number" && entry > 0
    ? price / entry - 1 : null;
}

export function validateDecisionReport(report, watch) {
  const fail = (message) => { throw Object.assign(new Error(`决策报告：${message}`), { status: 400 }); };
  const str = (v, max = 16000) => typeof v === "string" && !!v.trim() && v.length <= max;
  const number = (v, min = 0, max = 1e14) => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
  const date = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v));
  const url = (v) => { try { return str(v, 1500) && new URL(v).protocol === "https:"; } catch { return false; } };
  if (!report || report.version !== 1 || !str(report.symbol, 40) || !str(report.name, 300) ||
      report.symbol.toUpperCase() !== watch.symbol.toUpperCase() || !str(report.exchange, 100) ||
      report.currency !== "USD" || report.capitalUsd !== DECISION_CAPITAL_USD || report.horizonYears !== 5 ||
      !date(report.analysisDate) || !str(report.dataAsOf, 1000) || !str(report.financialPeriod, 300)) fail("证券、日期或40万美元/五年口径无效。");
  const q = report.quote;
  if (!q || !(q.price === null ? (q.date === "" || date(q.date)) && (q.sourceUrl === null || url(q.sourceUrl))
      : number(q.price, 0.000001) && date(q.date) && url(q.sourceUrl)) || q.date > report.analysisDate ||
      !str(q.type, 80) || !str(q.note, 2000) || !str(q.source, 300)) fail("报价须有真实日期、类型、限制和HTTPS来源；未核验用null。");
  const v = report.verdict;
  if (!v || !str(v.stance, 100) || !str(v.conclusion, 6000) || !str(v.confidence, 300) || !str(v.limitations, 6000) ||
      !(v.valueLow === null && v.valueHigh === null || number(v.valueLow) && number(v.valueHigh, v.valueLow))) fail("结论与今天价值区间无效。");
  if (v.summary !== undefined && !str(v.summary, 600)) fail("首屏摘要过长或无效。");
  const p = report.position;
  if (!p || !number(p.targetPct, 0, 100) || !number(p.maxPct, p.targetPct, 100) ||
      !number(p.existingExposureUsd) || !str(p.rationale, 6000) || !str(p.portfolioFit, 6000)) fail("仓位与已有敞口口径无效。");
  if (p.currentAdditionalPct !== undefined && !number(p.currentAdditionalPct, 0, p.maxPct)) fail("当前新增仓位无效。");
  if (p.pendingBuyUsd !== undefined && !number(p.pendingBuyUsd)) fail("已记录待成交买单金额无效。");
  if (!Array.isArray(report.entries) || report.entries.length !== 3) fail("须包含三档入场区间。");
  let previousLow = Infinity;
  for (const [i, e] of report.entries.entries()) {
    if (e.tier !== DECISION_TIERS[i] || !str(e.condition, 4000) || !number(e.budgetSharePct, 0, 100)) fail("入场档位或条件无效。");
    if (e.low === null && e.high === null) continue;
    if (!number(e.low, 0.000001) || !number(e.high, e.low) || e.high >= previousLow) fail("三档价格须由高到低且不重叠；缺数据用null。");
    previousLow = e.low;
  }
  if (Math.abs(report.entries.reduce((s, e) => s + e.budgetSharePct, 0) - 100) > 0.001) fail("三档资金比例须合计100%（目标仓位内）。");
  if (!Array.isArray(report.scenarios) || report.scenarios.length !== 3 || report.scenarios.some((s, i) =>
      s.id !== ["bear", "base", "bull"][i] || !str(s.label, 100) || !str(s.assumptions) ||
      !(s.todayValue === null || number(s.todayValue)) || !(s.year5Price === null || number(s.year5Price)))) fail("须给出三种经营路径的今日价值与五年期末价格；无法估算用null。");
  if (!Array.isArray(report.masters) || report.masters.length !== 7 || new Set(report.masters.map((m) => m.id)).size !== 7 ||
      report.masters.some((m) => !DECISION_MASTERS.includes(m.id) || ["name", "judgment", "evidence", "challenge", "response"].some((k) => !str(m[k])))) fail("须给出七种不同思想的判断、证据、质疑与回应。");
  for (const key of ["debate", "sections", "sources", "reviewTriggers", "invalidation"]) {
    if (!Array.isArray(report[key]) || !report[key].length || report[key].length > 60) fail(`${key}缺失或过长。`);
  }
  if (report.debate.some((d) => ["question", "bull", "bear", "resolution"].some((k) => !str(d[k]))) ||
      report.sections.some((s) => !str(s.title, 300) || !str(s.body, 60000)) ||
      report.sources.some((s) => !str(s.label, 500) || !url(s.url) || !str(s.date, 300)) ||
      [...report.reviewTriggers, ...report.invalidation].some((s) => !str(s, 5000))) fail("论据、辩论、来源或复查条件格式无效。");
  if (report.figures !== undefined && (!Array.isArray(report.figures) || report.figures.length > 8 || report.figures.some((f) =>
      !str(f.title, 300) || !str(f.unit, 100) || !str(f.note, 2000) || !Array.isArray(f.rows) || !f.rows.length || f.rows.length > 20 ||
      f.rows.some((r) => !str(r.label, 40) || !number(r.value))))) fail("图表数据格式无效。");
  return report;
}
