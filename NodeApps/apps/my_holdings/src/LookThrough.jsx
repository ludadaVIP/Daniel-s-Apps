import { useEffect, useState } from "react";
import { Copy, ChevronDown, ExternalLink, RefreshCw } from "lucide-react";
import { request } from "./api.js";
import { calculate, money, pct } from "./model.js";
import { fundColor, FUND_REVIEW_PROMPT, lookThrough } from "./lookthrough.js";

export function LookThrough({ state, onCopyReview, fundSymbols = [] }) {
  const [data, setData] = useState(null), [error, setError] = useState("");
  const [accountId, setAccountId] = useState("all"), [expanded, setExpanded] = useState(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    request("/api/fund-holdings").then(d => { if (active) { setData(d); setError(""); } }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [reload]);
  const scope = state.accounts.some(a => a.id === accountId) ? accountId : "all";
  const portfolio = calculate(state, scope);
  const cashValue = scope === "all" ? portfolio.totalCash : portfolio.accountCash;
  const result = lookThrough(state.holdings, data, { accountId: scope, fx: state.fx, cashValue, fundSymbols });
  const activeSymbols = new Set(result.usedFunds.map(f => f.symbol));
  return (
    <section className="mh-panel mh-lookthrough" aria-labelledby="mh-lookthrough-title">
      <div className="mh-lookthrough-heading">
        <div className="mh-lookthrough-title"><h2 id="mh-lookthrough-title">个股穿透 <span>前 10 名</span></h2><p>合并基金重叠与直接持股 · 按估算敞口排序</p></div>
        <div className="mh-lookthrough-controls">
          <select aria-label="穿透账户" value={scope} onChange={e => { setAccountId(e.target.value); setExpanded(null); }}><option value="all">全部账户</option>{state.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
          <button className="mh-button" onClick={() => onCopyReview(FUND_REVIEW_PROMPT)} title="复制完整任务，粘贴给 Codex 后复核发行商权重"><Copy size={14} /> 复制复核任务</button>
        </div>
      </div>
      {error ? <div className="mh-lookthrough-message" role="alert">成分数据暂不可用：{error} <button className="mh-text-button" onClick={() => setReload(v => v + 1)}><RefreshCw size={13} /> 重试</button></div> : !data ? <p className="mh-lookthrough-message" role="status">正在读取基金成分…</p> : <>
        <div className="mh-lookthrough-summary">
          <div><small>总资产分母 · USD</small><strong>{money(result.totalAssetValue)}<span>证券 {money(result.totalValue)} · 现金 {money(result.cashValue)}</span></strong></div>
          <div><small>前十家公司占总资产</small><strong>{pct(result.top10Weight)}<span>约 {money(result.top10Value)}</span></strong></div>
          <div><small>已识别公司</small><strong>{result.rows.length}<span>家 · 同公司多类股合并</span></strong></div>
        </div>
        <div className="mh-lookthrough-legend" aria-label="穿透基金">{data.funds.map(f => <span key={f.symbol} className={!activeSymbols.has(f.symbol) ? "inactive" : ""}><i style={{ background: fundColor(f.symbol) }} />{f.symbol}<small>{activeSymbols.has(f.symbol) ? "" : "未持有 · 已支持"}</small></span>)}<span><i style={{ background: fundColor("direct") }} />直接持股</span></div>
        {!result.top10.length ? <p className="mh-lookthrough-message">这个账户暂无可穿透的股票持仓。录入持仓后会自动计算。</p> : <div className="mh-table-wrap"><table className="mh-exposure-table">
          <colgroup><col className="lt-company" /><col className="lt-value" /><col className="lt-weight" /><col className="lt-sources" /></colgroup>
          <thead><tr><th>公司 / 代码</th><th>估算敞口 · USD</th><th>占总资产</th><th>持有路径 <small>点击展开金额</small></th></tr></thead>
          <tbody>{result.top10.map((r, i) => <ExposureRow key={r.key} row={r} rank={i + 1} maxValue={result.top10[0].value} expanded={expanded === r.key} onToggle={() => setExpanded(expanded === r.key ? null : r.key)} />)}</tbody>
        </table></div>}
        <div className="mh-lookthrough-tail"><span>其余公司 <strong>{money(result.equityValue - result.top10Value)}</strong></span><span>基金非股票与披露差额 <strong>{money(result.residualValue)}</strong></span>{result.unclassifiedValue > 0 && <span>未穿透基金 <strong>{money(result.unclassifiedValue)}</strong></span>}</div>
        {result.excluded.length > 0 && <p className="mh-lookthrough-warning">待补齐：{result.excluded.map(x => `${x.symbol}（${x.reason}）`).join("；")}。缺失汇率的持仓不计入分母。</p>}
        <details className="mh-lookthrough-method"><summary>成分日期、来源与估算口径 <ChevronDown size={14} /></summary>
          <p className="mh-lookthrough-formula">公司敞口 = Σ（各基金持仓市值 × 公司在基金中的权重）+ 直接持股市值。公司占比以所选范围总资产为分母；全部账户视图计入账户现金与独立可部署弹药，单个账户视图计入该账户现金。持仓数量、价格、现金或汇率变化时自动重算。</p>
          <p>这是按已披露成分权重估算的公司经济敞口，不是直接登记持有的股票数量。权重随基金调仓和行情变化；持仓金额自动更新，基金权重由 Codex 复核后更新。</p>
          <p>股票采用披露原始权重，不强行归一到 100%；基金现金、货币基金、期货及其他衍生品不分配到个股，余额含披露精度差异。GOOG / GOOGL 等同公司多类股合并；各基金的披露日期可能不同。{result.priceDates.length ? `持仓报价日期：${result.priceDates.join("、")}。` : "部分持仓尚无已核实行情日期。"}</p>
          <div className="mh-lookthrough-sources">{data.funds.map(f => <div key={f.symbol}><strong>{f.symbol}</strong><span>成分截至 {f.asOf}{new Date() - new Date(`${f.asOf}T00:00:00Z`) > 45 * 86400000 && <em>建议复核</em>}</span><a href={f.sourceUrl} target="_blank" rel="noreferrer">{f.source} <ExternalLink size={11} /></a></div>)}</div>
        </details>
        <div className="mh-lookthrough-dates">{result.usedFunds.map(f => <span key={f.symbol}>{f.symbol} · {f.asOf}{f.stale ? " · 建议复核" : ""}</span>)}</div>
      </>}
    </section>
  );
}

function ExposureRow({ row: r, rank, maxValue, expanded, onToggle }) {
  return <>
    <tr>
      <td><div className="mh-exposure-company"><span className="mh-exposure-rank">{String(rank).padStart(2, "0")}</span><div><strong title={r.name}>{r.name}</strong><small>{r.symbols.join(" · ")}</small></div></div></td>
      <td className="mh-exposure-amount">{money(r.value)}<small>约</small></td>
      <td><strong>{pct(r.weight)}</strong><div className="mh-exposure-track" title="条长比较公司敞口，以首名为刻度；颜色表示基金贡献"><div className="mh-exposure-bar" style={{ width: `${r.value / maxValue * 100}%` }} aria-label={`${r.name}占持仓${pct(r.weight)}`}>{r.contributions.map(c => <i key={c.symbol} style={{ width: `${c.value / r.value * 100}%`, background: fundColor(c.symbol) }} />)}</div></div></td>
      <td><button className="mh-exposure-toggle" onClick={onToggle} aria-expanded={expanded} aria-controls={`exposure-${r.key}`}><span>{r.contributions.map(c => <span key={c.symbol}><i style={{ background: fundColor(c.symbol) }} />{c.symbol === "direct" ? "直接" : c.symbol}</span>)}</span><ChevronDown size={14} className={expanded ? "expanded" : ""} /></button></td>
    </tr>
    {expanded && <tr id={`exposure-${r.key}`} className="mh-exposure-detail"><td colSpan={4}><div>{r.contributions.map(c => <div key={c.symbol}><span><i style={{ background: fundColor(c.symbol) }} />{c.symbol === "direct" ? "直接持股" : c.symbol}</span><strong>{money(c.value)}</strong><small>{c.symbol === "direct" ? "按持仓市值计入" : `该公司占基金 ${pct(c.fundWeightPct)}`}</small></div>)}</div></td></tr>}
  </>;
}
