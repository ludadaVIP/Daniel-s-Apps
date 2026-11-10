import { calculate, holdingQuoteLabel, money, pct, usd } from "./model.js";
import { mergeAccountHoldings } from "./positions.js";

const shares = (quantity) => quantity.toLocaleString("en-US", { maximumFractionDigits: 10 });

export function AccountMerged({ state, query = "" }) {
  const accountName = (id) => state.accounts.find((account) => account.id === id)?.name || "未分配账户";
  const summary = calculate(state);
  const merged = mergeAccountHoldings(state.holdings).sort((a, b) =>
    (usd(b.marketValue, b.currency, state.fx) ?? -Infinity) - (usd(a.marketValue, a.currency, state.fx) ?? -Infinity) || a.symbol.localeCompare(b.symbol),
  );
  const rows = merged.filter((holding) => `${holding.symbol} ${holding.name} ${holding.sector}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="mh-panel mh-lookthrough mh-account-merged" aria-labelledby="mh-account-merged-title">
      <div className="mh-lookthrough-heading">
        <div className="mh-lookthrough-title">
          <h2 id="mh-account-merged-title">账户合并 <span>{rows.length} 个标的</span></h2>
          <p>{state.accounts.map((account) => account.name).join(" + ")} · 相同代码与币种合并</p>
        </div>
      </div>
      <div className="mh-lookthrough-summary">
        <div><small>合并证券市值 · USD</small><strong>{money(summary.value)}<span>总成本 {money(summary.cost)}</span></strong></div>
        <div><small>账户现金 · USD</small><strong>{money(summary.accountCash)}<span>含现金合计 {money(summary.value + summary.accountCash)}</span></strong></div>
        <div><small>浮动盈亏 · USD</small><strong className={summary.pnl < 0 ? "mh-loss" : "mh-gain"}>{money(summary.pnl)}<span>{pct(summary.returnPct)}</span></strong></div>
      </div>
      <div className="mh-table-wrap">
        <table className="mh-table mh-positions-table mh-merged-table">
          <colgroup><col className="mh-col-asset" /><col className="mh-col-quantity" /><col className="mh-col-price" /><col className="mh-col-cost" /><col className="mh-col-value" /><col className="mh-col-pnl" /></colgroup>
          <thead><tr><th>标的 / 账户来源</th><th>合计数量 <span className="mh-column-unit">/ 股</span></th><th>当前价格</th><th>成本均价</th><th>市值 / 总成本</th><th>浮动盈亏</th></tr></thead>
          <tbody>{rows.map((holding) => {
            const samePrice = holding.sources.every((source) => source.price === holding.sources[0].price);
            const quoteLabels = [...new Set(holding.sources.map(holdingQuoteLabel))];
            return <tr key={holding.key}>
              <td><div className="mh-asset"><span className={`mh-ticker t-${holding.symbol.charCodeAt(0) % 3}`}>{holding.symbol.slice(0, 2)}</span><span><strong>{holding.symbol}</strong><small title={holding.name}>{holding.sources.map((source) => `${accountName(source.accountId)} ${shares(source.quantity)} 股`).join(" · ")}</small></span></div></td>
              <td>{shares(holding.quantity)}</td>
              <td><div className="mh-holding-price">
                {samePrice ? <><strong className="mh-table-price">{money(holding.sources[0].price, holding.currency)}</strong><small title={quoteLabels.join("；")}>{quoteLabels.length === 1 ? quoteLabels[0] : "报价时间 / 来源不同"}</small></> : <><strong className="mh-merged-mixed-price">分账户报价</strong>{holding.sources.map((source) => <small key={source.id} title={holdingQuoteLabel(source)}>{accountName(source.accountId)} {money(source.price, source.currency)}</small>)}</>}
              </div></td>
              <td><strong className="mh-table-price">{money(holding.averagePrice, holding.currency)}</strong></td>
              <td><span className="mh-value">{money(holding.marketValue, holding.currency)}</span><small>成本 {money(holding.cost, holding.currency)}</small></td>
              <td className={holding.pnl < 0 ? "mh-loss" : "mh-gain"}><strong>{money(holding.pnl, holding.currency)}</strong><small>{pct(holding.returnPct)}</small></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {!rows.length && <p className="mh-lookthrough-message">{merged.length ? "没有匹配的持仓，请调整搜索条件。" : "暂无持仓，记录买入后会自动汇总。"}</p>}
      <div className="mh-lookthrough-tail"><span>股数、市值与成本按账户相加；成本均价 = 合计成本 ÷ 合计股数。汇总不含独立可部署弹药。</span>{query && <span>搜索仅筛选明细，顶部为全部持仓合计。</span>}</div>
      {summary.unconverted > 0 && <p className="mh-lookthrough-warning">{summary.unconverted} 条持仓缺少汇率，未计入 USD 合计；原币明细仍保留。</p>}
    </section>
  );
}
