import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { request } from "./api.js";
import { money } from "./model.js";
import { decisionEntryPlan, DECISION_TIER_NAMES, scenarioReturn, scenarioUpside } from "./decision-reports.js";

const returnText = (value) => value == null ? "待核验" : `${(100 * value).toFixed(1)}%`;
const quoteMoney = (value) => value == null ? "待核验" : money(value);

export function DecisionReport({ watch, jobs, onQueue, onOpenReport }) {
  const [result, setResult] = useState({ loading: true });
  const [submitting, setSubmitting] = useState(false);
  const [retry, setRetry] = useState(0);
  const container = useRef(null);
  const pending = jobs.find((j) => j.kind === "decision-report" && j.watchId === watch.id && j.status === "waiting");
  const lastJob = jobs.filter((j) => j.kind === "decision-report" && j.watchId === watch.id).slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  useEffect(() => {
    let active = true;
    setResult({ loading: true });
    request(`/api/decision-reports/${encodeURIComponent(watch.id)}`)
      .then((data) => { if (active) setResult({ decision: data.decision }); })
      .catch((error) => { if (active) setResult({ error: error.message }); });
    return () => { active = false; };
  }, [watch.id, watch.decisionReport?.json, watch.decisionReport?.updatedAt, retry]);
  useEffect(() => {
    const panel = container.current?.closest(".mh-rightbar");
    if (panel) panel.scrollTop = 0;
  }, [watch.id]);
  const refresh = async () => {
    setSubmitting(true);
    try { await onQueue("decision-report", watch.id); }
    finally { setSubmitting(false); }
  };
  const r = result.decision;
  return <div className="mh-decision-report" ref={container} key={watch.id}>
    <div className="mh-decision-report-toolbar">
      <div><strong>{watch.symbol}</strong><small>{r?.name || watch.name}</small></div>
      <button className="mh-button" disabled={!!pending || submitting} onClick={refresh} title="加入待办，由后续 Codex 根据最新财报、报价和市场重新分析">
        <RefreshCw size={13} />{submitting ? "排队中…" : pending ? "已加入待办" : r ? "刷新报告" : "生成报告"}
      </button>
    </div>
    {pending && <p className="mh-decision-report-notice" role="status">等待 Codex 重新分析。{r ? "当前显示上一版报告。" : "完成后在这里显示。"}</p>}
    {lastJob?.status === "failed" && <p role="status" className="mh-decision-report-notice">上次分析未完成：{lastJob.error}。可重新刷新；已有报告保留。</p>}
    {result.loading ? <p role="status">正在读取报告…</p> : result.error ? <div role="alert"><p>{result.error}</p><button className="mh-text-button" onClick={() => setRetry((n) => n + 1)}>重新读取</button></div> : !r ? <div className="mh-decision-report-empty"><h3>这支股票的决策报告尚未完成</h3><p>报告将先显示结论、三档入场价和40万美元组合仓位，再展开七种投资思想的辩论与估值依据。</p>{watch.report && <button className="mh-text-button" onClick={() => onOpenReport(watch.report)}>查看已有公司研究 <ArrowUpRight size={13} /></button>}</div> : <>
      <section className="mh-decision-verdict"><span>研究结论</span><h2>{r.verdict.stance}</h2><p>{r.verdict.summary || r.verdict.conclusion}</p></section>
      <div className="mh-decision-report-meta"><span>分析日 {r.analysisDate} · {r.financialPeriod}</span><span>研究报价 {quoteMoney(r.quote.price)} · {r.quote.date} · {r.quote.type}</span><span>今天价值 {r.verdict.valueLow == null ? "待核验" : `${money(r.verdict.valueLow)}–${money(r.verdict.valueHigh)}`}</span></div>
      <section className="mh-decision-entry-list"><h3>三档入场价格 · USD</h3>{decisionEntryPlan(r).map((e, i) => <article key={e.tier}>
        <span>{DECISION_TIER_NAMES[i]}</span><strong>{e.low == null ? "暂不报价" : `${money(e.low)}–${money(e.high)}`}</strong>
        <small>新增资金 {money(e.dollars)} · 上沿最多 {e.shares ?? "—"} 股</small><details><summary>入场前提与价格依据</summary><p>{e.condition}</p></details>
      </article>)}</section>
      <section className="mh-decision-position"><h3>40万美元组合 · 单只条件目标</h3><strong>{r.position.targetPct}% <span>/ 上限 {r.position.maxPct}%</span></strong>{r.position.currentAdditionalPct !== undefined && <p><b>当前新增 {r.position.currentAdditionalPct}% = {money(r.capitalUsd * r.position.currentAdditionalPct / 100)}</b></p>}<p>条件目标 {money(r.capitalUsd * r.position.targetPct / 100)} · 已有公司敞口 {money(r.position.existingExposureUsd)}{r.position.pendingBuyUsd > 0 && <> · 已排买单 {money(r.position.pendingBuyUsd)}</>}</p><details><summary>仓位依据与组合敞口</summary><p>{r.position.rationale}</p><small>{r.position.portfolioFit}</small><small>三档扣除已有公司敞口和已记录买单后分配；整股数向下取整，未计税费。每支股票的上限不能同时买满。</small></details></section>
      <button className="mh-button mh-decision-report-file" onClick={() => onOpenReport(watch.decisionReport?.report)}>打开独立完整报告 <ArrowUpRight size={14} /></button>
      <details><summary>完整结论、可信度与报价时点</summary><p>{r.verdict.conclusion}</p><p>可信度：{r.verdict.confidence}</p><p>{r.quote.note}</p></details>
      <section className="mh-decision-scenarios"><h3>五年目标与潜在收益</h3><small>情景假设，非收益保证；年化以研究报价为起点，不含分红与税费。</small>{r.scenarios.map((s) => <div key={s.id}><b>{s.label} · {quoteMoney(s.year5Price)}</b><span>总涨幅 {returnText(scenarioUpside(s.year5Price, r.quote.price))} · 年化 {returnText(scenarioReturn(s.year5Price, r.quote.price))}</span><p>{s.assumptions}</p></div>)}</section>
      <p className="mh-decision-report-method">以下为七位投资者理论的方法模拟，不代表他们本人的观点或原话。</p>
      <section><h3>交叉辩论与裁决</h3>{r.debate.map((d, i) => <details key={i} open={i === 0}><summary>{d.question}</summary><p><b>多方</b> {d.bull}</p><p><b>反方</b> {d.bear}</p><p><b>裁决</b> {d.resolution}</p></details>)}</section>
      <section><h3>七种投资思想</h3>{r.masters.map((m) => <details key={m.id}><summary>{m.name}</summary><p>{m.judgment}</p><p><b>证据</b> {m.evidence}</p><p><b>质疑</b> {m.challenge}</p><p><b>回应</b> {m.response}</p></details>)}</section>
      <section><h3>详细分析与估值</h3>{r.sections.map((s, i) => <details key={i}><summary>{s.title}</summary><p className="mh-decision-analysis-text">{s.body}</p></details>)}</section>
      <section><h3>失效与暂停条件</h3><ul>{r.invalidation.map((s, i) => <li key={i}>{s}</li>)}</ul><h3>后续核验</h3><ul>{r.reviewTriggers.map((s, i) => <li key={i}>{s}</li>)}</ul></section>
      <section><h3>资料限制与来源</h3><p>{r.verdict.limitations}</p><p>资料截至：{r.dataAsOf}</p><ol>{r.sources.map((s, i) => <li key={i}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a><small>{s.date}</small></li>)}</ol></section>
    </>}
  </div>;
}
