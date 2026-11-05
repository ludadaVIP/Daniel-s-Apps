import { decisionEntryPlan, DECISION_TIER_NAMES, scenarioReturn, scenarioUpside } from "../src/decision-reports.js";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const money = (n) => n == null ? "待核验" : `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const percent = (n) => n == null ? "待核验" : `${(n * 100).toFixed(1)}%`;
const references = (s) => esc(s).replace(/\[S(\d+)\]/g, '<a href="#source-$1">[S$1]</a>');
const prose = (s) => `<p>${references(s).replaceAll("\n", "<br>")}</p>`;
const list = (items) => `<ul>${items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;

export function decisionResearch(r) {
  return { identity: { name: r.name, symbol: r.symbol, exchange: r.exchange, currency: r.currency, sector: "决策报告" },
    title: `${r.symbol} · 七种投资思想决策报告`, summary: r.verdict.conclusion,
    details: r.sections.map((s) => `${s.title}\n${s.body}`).join("\n\n"),
    risks: r.invalidation, catalysts: r.reviewTriggers,
    sources: r.sources.map(({ label, url }) => ({ label, url })), uncertainty: r.verdict.limitations };
}

function bars(title, rows, unit, note) {
  rows = rows.filter((r) => typeof r.value === "number" && Number.isFinite(r.value));
  if (!rows.length) return `<figure><h3>${esc(title)}</h3><p>缺少可核验数据，暂不绘图。</p></figure>`;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const height = 32 + rows.length * 44;
  return `<figure><h3>${esc(title)}</h3><svg viewBox="0 0 720 ${height}" role="img"><title>${esc(title)} · ${esc(unit)}</title>${rows.map((r, i) => `<text x="0" y="${i * 44 + 26}" font-size="14" fill="#263b35">${esc(r.label)}</text><rect x="158" y="${i * 44 + 10}" width="${r.value / max * 435}" height="24" fill="${i % 2 ? "#527c8c" : "#987a3e"}"/><text x="610" y="${i * 44 + 27}" font-size="14" fill="#263b35">${esc(r.value.toLocaleString("en-US", { maximumFractionDigits: 2 }))}</text>`).join("")}</svg><figcaption>${esc(unit)} · ${references(note)}</figcaption></figure>`;
}

export function decisionReportHtml(r, baseCss) {
  const entries = decisionEntryPlan(r);
  const budget = r.capitalUsd * r.position.targetPct / 100;
  const content = r.sections.map((s, i) => `<section id="analysis-${i}"><h2>${esc(s.title)}</h2>${prose(s.body)}</section>`).join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(r.verdict.conclusion)}"><title>${esc(r.symbol)} · 七种投资思想决策报告 · ${esc(r.analysisDate)}</title><style>${baseCss}\n.entry-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.entry{padding:18px;border:1px solid var(--line);border-top:4px solid var(--accent)}.entry strong{display:block;font:600 26px/1.5 Georgia,serif}.entry small{display:block}.decision{border-left:5px solid var(--accent);padding:20px 24px;background:#eee8d8}.decision h2{margin:0}p,li{overflow-wrap:anywhere}.table-wrap th,.table-wrap td{min-width:100px}section{scroll-margin-top:20px}.master{border-top:1px solid var(--line);padding:18px 0}</style></head><body><main><header><span class="eyebrow">MY HOLDINGS · ${esc(r.exchange)} · USD · 五年视角</span><h1>${esc(r.name)} <span class="muted">${esc(r.symbol)}</span></h1><p class="muted">分析日 ${esc(r.analysisDate)}（${esc(r.analysisTimeZone || "Pacific/Auckland")}）<br>资料截至 ${esc(r.dataAsOf)}<br>财报期 ${esc(r.financialPeriod)}</p></header>
  <section class="decision" id="conclusion"><h2>${esc(r.verdict.stance)}</h2>${prose(r.verdict.conclusion)}<p>结论置信度：${esc(r.verdict.confidence)}</p></section>
  <p>研究报价 <b>${money(r.quote.price)}</b> · ${esc(r.quote.type)} · ${esc(r.quote.date)}<br>${r.quote.sourceUrl ? `<a href="${esc(r.quote.sourceUrl)}">${esc(r.quote.source)}</a>` : esc(r.quote.source)} · ${esc(r.quote.note)}</p><p>今天合理价值：<b>${money(r.verdict.valueLow)}–${money(r.verdict.valueHigh)}</b></p>
  <section id="entry"><h2>三档入场计划</h2><p>组合基准 ${money(r.capitalUsd)}；${r.position.currentAdditionalPct !== undefined ? `当前新增 ${r.position.currentAdditionalPct}% = ${money(r.capitalUsd * r.position.currentAdditionalPct / 100)}；` : ""}单只条件目标 ${r.position.targetPct}% = ${money(budget)}，上限 ${r.position.maxPct}% = ${money(r.capitalUsd * r.position.maxPct / 100)}。已有公司敞口 ${money(r.position.existingExposureUsd)}；已记录买单 ${money(r.position.pendingBuyUsd || 0)}；待投入 ${money(Math.max(0, budget - r.position.existingExposureUsd - (r.position.pendingBuyUsd || 0)))}。</p><div class="entry-grid">${entries.map((e, i) => `<article class="entry"><h3>${DECISION_TIER_NAMES[i]}</h3><strong>${e.low == null ? "暂不报价" : `${money(e.low)}–${money(e.high)}`}</strong><small>剩余目标资金的 ${e.budgetSharePct}% · ${money(e.dollars)}</small><small>按区间上沿最多 ${e.shares ?? "—"} 股</small>${prose(e.condition)}</article>`).join("")}</div>${prose(r.position.rationale)}${prose(r.position.portfolioFit)}<p class="muted">每档为新增资金，不是累计仓位；整股数向下取整，未计税费与汇率。以下区间是研究条件，不是已提交的订单；所有股票的目标上限不能同时买满。</p></section>
  <nav><a href="#entry">入场计划</a><a href="#valuation">情景估值</a><a href="#debate">交叉辩论</a><a href="#masters">七种视角</a>${r.sections.map((s, i) => `<a href="#analysis-${i}">${esc(s.title)}</a>`).join("")}<a href="#sources">来源</a></nav>
  <section id="valuation"><h2>价值、五年目标与潜在回报</h2><p>今天折现价值与第五年期末价格分开。年化 = (第五年价格 ÷ 入场价格)^(1/5) − 1，税费前、无分红口径；若有分红，正文另列现金流IRR。</p><div class="table-wrap"><table><thead><tr><th>情景</th><th>经营假设</th><th>今天价值</th><th>五年期末价</th><th>相对研究报价总涨幅</th><th>五年年化</th></tr></thead><tbody>${r.scenarios.map((s) => `<tr><td>${esc(s.label)}</td><td>${esc(s.assumptions)}</td><td class="num">${money(s.todayValue)}</td><td class="num">${money(s.year5Price)}</td><td class="num">${percent(scenarioUpside(s.year5Price, r.quote.price))}</td><td class="num">${percent(scenarioReturn(s.year5Price, r.quote.price))}</td></tr>`).join("")}</tbody></table></div>${bars("今天价值与研究报价", [{ label: "研究报价", value: r.quote.price }, ...r.scenarios.map((s) => ({ label: s.label, value: s.todayValue }))], "美元/股", "情景为模型假设；今天价值已折现，不能当作五年卖出价。")}${bars("五年期末价格情景", r.scenarios.map((s) => ({ label: s.label, value: s.year5Price })), "美元/股", "非概率预测；经营路径、融资与稀释假设见正文。")}${bars("新增目标资金分配", entries.map((e, i) => ({ label: DECISION_TIER_NAMES[i], value: e.dollars })), "美元", "已扣除现有公司敞口；任何加仓都以基本面未失效为前提。")}</section>
  <section id="debate"><h2>交叉辩论与裁决</h2><p class="muted">以下为基于公开理论的分析模拟，非七位投资者本人的观点、原话或持仓声明。</p>${r.debate.map((d) => `<article class="master"><h3>${esc(d.question)}</h3>${prose(`多方：${d.bull}`)}${prose(`反方：${d.bear}`)}${prose(`裁决：${d.resolution}`)}</article>`).join("")}</section>
  <section id="masters"><h2>七种投资思想逐项质询</h2>${r.masters.map((m) => `<article class="master"><h3>${esc(m.name)}</h3>${prose(m.judgment)}${prose(`证据：${m.evidence}`)}${prose(`最强质疑：${m.challenge}`)}${prose(`回应与投资含义：${m.response}`)}</article>`).join("")}</section>${(r.figures || []).map((f) => bars(f.title, f.rows, f.unit, f.note)).join("")}${content}
  <section><h2>暂停投入与退出条件</h2>${list(r.invalidation)}<h2>后续财报与事件核验</h2>${list(r.reviewTriggers)}<h2>资料限制</h2>${prose(r.verdict.limitations)}</section><section id="sources" class="sources"><h2>可复核来源</h2><ol>${r.sources.map((s, i) => `<li id="source-${i + 1}"><a href="${esc(s.url)}">${esc(s.label)}</a> · ${esc(s.date)}</li>`).join("")}</ol></section><footer>研究假设与条件规划，不保证价格或收益。报告保留生成时的行情与资料，刷新后的新版本独立留档。</footer></main></body></html>`;
}
