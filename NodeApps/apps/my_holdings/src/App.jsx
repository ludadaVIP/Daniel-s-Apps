import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Download,
  Ellipsis,
  FileCode2,
  Gauge,
  LayoutDashboard,
  ListFilter,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  Target,
  Trash2,
  Undo2,
  Upload,
  Wallet,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import {
  calculate,
  observations,
  contextPack,
  holdingQuoteLabel,
  money,
  pct,
  id,
} from "./model.js";
import { BASE, request, download, localDate } from "./api.js";
import { PRICE_REFRESH_QUESTION, quoteTaskGuidance, hasCompleteResearch, watchResearchQuestion, undoableWatchRefreshIds } from "./quotes.js";
import {
  Modal,
  Field,
  HoldingForm,
  BuyForm,
  WatchForm,
  CashForm,
  GoalsForm,
  JournalForm,
  SaveButton,
} from "./Forms.jsx";
import { Reports } from "./Reports.jsx";
import {
  CONVERSION_PAIRS,
  INITIAL_CONVERTER_STATE,
} from "./converter.js";
const NAV = [
  ["overview", "总览", LayoutDashboard],
  ["holdings", "我的持仓", Wallet],
  ["watch", "近期关注", Star],
  ["converter", "换算工具", ArrowRightLeft],
  ["analysis", "组合分析", BarChart3],
  ["cash", "弹药与目标", Target],
  ["reports", "行情与档案", FileCode2],
  ["ai", "AI 工作台", Sparkles],
  ["journal", "决策日志", BookOpen],
];
function readPanel(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved == null ? fallback : saved !== "closed";
  } catch {
    return fallback;
  }
}
const COLORS = [
  "#36735c",
  "#96b598",
  "#b7c9d8",
  "#d3bd94",
  "#8e9e91",
  "#a99ab7",
];
const when = (d) =>
  d
    ? new Date(d).toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "尚未生成";
const preciseUSD = (value) =>
  Number.isFinite(Number(value)) ? `US$${Number(value).toFixed(4)}` : "—";
const WATCH_SORT_OPTIONS = [
  { id: "name", label: "名称", title: "按名称排序" },
  { id: "price", label: "报价", title: "按当前报价从低到高排序" },
  { id: "gap", label: "价差 ↑", title: "等待价差比例从低到高排序" },
  { id: "attention", label: "关注", title: "按关注度从高到低排序：4、3、2、1" },
];
const WATCH_ATTENTION_OPTIONS = [
  { level: 4, label: "最关注" },
  { level: 3, label: "中等关注" },
  { level: 2, label: "留着看看" },
  { level: 1, label: "留着以后再说" },
];
const watchAttention = (watch) =>
  WATCH_ATTENTION_OPTIONS.some(({ level }) => level === watch?.attention)
    ? watch.attention
    : 2;
function watchGapPct(watch) {
  const price = watch?.price == null ? NaN : Number(watch.price);
  const target = watch?.targetPrice == null ? NaN : Number(watch.targetPrice);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(target) || target <= 0)
    return null;
  return price <= target ? 0 : ((price - target) / price) * 100;
}
function isIndexOrEtf(watch) {
  const kind = [
    watch?.assetType,
    watch?.type,
    watch?.category,
    watch?.name,
    watch?.symbol,
  ].filter(Boolean).join(" ");
  return /etf|指数|指数基金|index fund|index/i.test(kind);
}
function sortWatchlist(rows, mode) {
  const byName = (a, b) =>
    (a.name || a.symbol || "").localeCompare(b.name || b.symbol || "", "zh-CN", {
      numeric: true,
      sensitivity: "base",
    }) || (a.symbol || "").localeCompare(b.symbol || "");
  return rows.slice().sort((a, b) => {
    if (mode === "name") return byName(a, b);
    if (mode === "attention")
      return watchAttention(b) - watchAttention(a) || byName(a, b);
    if (mode === "price") {
      const aPrice = a.price == null ? NaN : Number(a.price);
      const bPrice = b.price == null ? NaN : Number(b.price);
      const aKnown = Number.isFinite(aPrice) && aPrice > 0;
      const bKnown = Number.isFinite(bPrice) && bPrice > 0;
      if (aKnown !== bKnown) return aKnown ? -1 : 1;
      return aKnown ? aPrice - bPrice || byName(a, b) : byName(a, b);
    }
    const aGap = watchGapPct(a);
    const bGap = watchGapPct(b);
    if ((aGap == null) !== (bGap == null)) return aGap == null ? 1 : -1;
    return aGap == null ? byName(a, b) : aGap - bGap || byName(a, b);
  });
}
function rankWatchPriorities(rows) {
  return rows
    .map((item) => ({ item, gap: watchGapPct(item) }))
    .filter(({ gap }) => gap !== null)
    .sort((a, b) =>
      a.gap - b.gap ||
      (a.item.name || a.item.symbol || "").localeCompare(
        b.item.name || b.item.symbol || "",
        "zh-CN",
        { numeric: true },
      ),
    );
}
function previousLocalDate(date) {
  const previous = new Date(`${date}T00:00:00.000Z`);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return previous.toISOString().slice(0, 10);
}
function Empty({ icon: Icon = Sprout, title, text, action }) {
  return (
    <div className="mh-empty">
      <Icon size={32} strokeWidth={1.4} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
function Stat({ label, value, sub, negative = false, icon: Icon, variant = "" }) {
  return (
    <article className={`mh-stat${variant ? ` mh-stat-${variant}` : ""}`}>
      <div>
        <span>{label}</span>
        {Icon && <Icon size={17} />}
      </div>
      <strong className={negative ? "mh-loss" : ""}>{value}</strong>
      <small>{sub}</small>
    </article>
  );
}
function Allocation({ groups, value, compact = false }) {
  let offset = 0;
  const stops = groups.map((g, i) => {
    const start = offset;
    offset += g.weight;
    return `${COLORS[i % COLORS.length]} ${start}% ${offset}%`;
  });
  return (
    <div className={`mh-allocation ${compact ? "compact" : ""}`}>
      <div
        className="mh-donut"
        style={{
          background: value ? `conic-gradient(${stops.join(",")})` : "#e6ebe5",
        }}
      >
        <div>
          <span>{groups.length}</span>
          <small>合并标的</small>
        </div>
      </div>
      <div className="mh-legend">
        {groups.map((g, i) => (
          <div key={`${g.symbol}${g.currency}`}>
            <i style={{ background: COLORS[i % COLORS.length] }} />
            <span>
              {g.symbol}
              {g.currency !== "USD" ? ` · ${g.currency}` : ""}
            </span>
            <strong>{pct(g.weight)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
function ResearchBody({ research, date, onReport }) {
  return (
    <div className="mh-research">
      <span className="mh-tag">
        <Sparkles size={12} /> AI 研究 · {when(date)}
      </span>
      <h2>{research.title}</h2>
      {research.identity && (
        <div className="mh-identity-grid">
          {[
            ["公司", research.identity.name],
            ["代码", research.identity.symbol],
            ["交易所", research.identity.exchange],
            ["币种", research.identity.currency],
            ["行业", research.identity.sector],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{value || "待核实"}</strong>
            </div>
          ))}
        </div>
      )}
      <p className="mh-lead">{research.summary}</p>
      <div className="mh-prose">{research.details}</div>
      <h3>主要风险</h3>
      <ul>
        {research.risks.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <h3>催化因素 / 关注条件</h3>
      <ul>
        {research.catalysts.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <div className="mh-note">
        <strong>待核实项</strong>
        <p>
          {research.uncertainty ||
            "AI 未列出额外待核实项；请自行核对数据日期。"}
        </p>
      </div>
      <h3>资料来源</h3>
      <div className="mh-source-links">
        {research.sources.length ? (
          research.sources.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
              <ArrowUpRight size={13} />
            </a>
          ))
        ) : (
          <span className="mh-muted">未提供来源，请先核实。</span>
        )}
      </div>
      {onReport && (
        <button className="mh-button" onClick={onReport}>
          <FileCode2 size={16} /> 打开 HTML 报告
        </button>
      )}
    </div>
  );
}
function RightPanel({
  tab,
  state,
  portfolio,
  reports,
  allAnalyses,
  notes,
  holding,
  watch,
  watchPriorities,
  yesterdayWatchRanks,
  onClose,
  onNavigate,
  onSelectWatch,
  onOpenReport,
  onEdit,
  onRefreshPrices,
  onQueueTask,
  onRefreshConverter,
  converterPending,
  onCopyQueue,
}) {
  const cash = state.cash.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const watchCurrency = watch?.priceCurrency || watch?.research?.quote?.currency || watch?.research?.identity?.currency || "USD";
  const converter = state.converter || INITIAL_CONVERTER_STATE;
  const title = {
    overview: "今日摘要",
    holdings: holding ? "持仓详情" : "账户摘要",
    watch: watch ? "关注详情" : "价差优先榜",
    converter: "换算公式",
    analysis: "体检档案",
    cash: "资金与目标",
    reports: "档案索引",
    ai: "任务状态",
    journal: "最近决策",
  }[tab];
  const reportLinks = (items, emptyText) => items.length ? items.map((a) => (
    <button className="mh-side-history" key={a.id} onClick={() => onOpenReport(a.report)}>
      <FileCode2 size={15} />
      <span><strong>{a.research.title}</strong><small>{when(a.date)}</small></span>
      <ArrowUpRight size={13} />
    </button>
  )) : <p className="mh-side-empty">{emptyText}</p>;
  const selectedWatchGap = watch ? watchGapPct(watch) : null;
  const selectedWatchTouched = watch?.price > 0 && watch?.targetPrice > 0 && watch.price <= watch.targetPrice;
  return (
    <aside className="mh-rightbar">
      <header>
        <span>{title}</span>
        <button className="mh-icon" aria-label="关闭右栏" onClick={onClose}><PanelRightClose size={17} /></button>
      </header>
      {tab === "overview" && <>
        <section className="mh-side-summary">
          <span className="mh-eyebrow">PORTFOLIO SNAPSHOT</span>
          <strong>{money(portfolio.value)}</strong>
          <div><span>总成本</span><b>{money(portfolio.cost)}</b></div>
          <div><span>浮动盈亏</span><b className={portfolio.pnl < 0 ? "mh-loss" : "mh-gain"}>{money(portfolio.pnl)}</b></div>
          <div><span>持仓记录</span><b>{portfolio.holdings.length} 条 · {state.accounts.length} 个账户</b></div>
        </section>
        <section>
          <div className="mh-section-heading"><h3>数据快照</h3><ShieldCheck size={15} /></div>
          <p className="mh-sidebar-objective">{state.marketUpdatedAt ? `价格最近更新于 ${when(state.marketUpdatedAt)}` : "当前显示初始截图价格"}</p>
          <button className="mh-text-button" onClick={() => onNavigate("holdings")}>核对持仓 <ArrowRight size={13} /></button>
        </section>
        <section>
          <div className="mh-section-heading"><h3>最近一次持仓体检</h3></div>
          {reports[0] ? <>{reportLinks(reports.slice(0, 1), "暂无体检报告")}<p className="mh-side-summary-text">{reports[0].research.summary}</p></> : <p className="mh-side-empty">体检结果会保存在这里</p>}
          <button className="mh-text-button" onClick={() => onNavigate("analysis")}>打开组合分析 <ArrowRight size={13} /></button>
        </section>
        <section>
          <div className="mh-section-heading"><h3>需要留意</h3><span className="mh-tag">{notes.length}</span></div>
          {notes.slice(0, 3).map((n) => <p className="mh-side-note" key={n.title}><i className={n.tone === "amber" ? "amber" : ""} />{n.title}</p>)}
        </section>
      </>}
      {tab === "holdings" && (holding ? <>
        <div className="mh-focus">
          <span className="mh-ticker">{holding.symbol.slice(0, 2)}</span>
          <h2>{holding.symbol}</h2><p>{holding.name}</p>
          <span className="mh-tag">{state.accounts.find((a) => a.id === holding.accountId)?.name}</span>
          <strong>{money(holding.marketValue, holding.currency)}</strong>
          <small>持有 {holding.quantity} 股 · {holdingQuoteLabel(holding)}</small>
          <div className="mh-focus-prices">
            <span>当前价格<strong>{money(holding.price, holding.currency)}</strong></span>
            <span>成本均价<strong>{money(holding.averagePrice, holding.currency)}</strong></span>
          </div>
        </div>
        <section><button className="mh-primary" onClick={() => onEdit({ type: "holding", buyHolding: holding })}><Plus size={14} /> 追加买入</button><button className="mh-text-button" onClick={() => onEdit({ type: "holding", item: holding })}><Pencil size={14} /> 修正持仓</button><button className="mh-text-button" onClick={() => onRefreshPrices()}><RefreshCw size={13} /> 刷新价格</button></section>
        {(state.holdingTrades || []).some((trade) => trade.holdingId === holding.id) && <section>
          <h3>买入与初始记录</h3>
          {(state.holdingTrades || []).filter((trade) => trade.holdingId === holding.id).slice(-8).reverse().map((trade) => <p className="mh-side-note" key={trade.id}><span><strong>{trade.type === "buy" ? "买入" : "合并前记录"} {trade.quantity} 股 · {money(trade.price, trade.currency)}</strong><br /><small>{trade.date || "日期未知"}{trade.type === "import" ? "（记录日）" : ""} · 成本 {money(trade.cost, trade.currency)}{trade.fees ? ` · 含费用 ${money(trade.fees, trade.currency)}` : ""}</small></span></p>)}
          <p className="mh-help">按录入顺序显示最近 8 笔；修正持仓不会改写历史记录。</p>
        </section>}
      </> : <>
        <section className="mh-side-summary">
          <span className="mh-eyebrow">ACCOUNTS</span>
          <strong>{money(portfolio.value)}</strong>
          {state.accounts.map((a, index) => {
            const value = state.holdings.filter((h) => h.accountId === a.id).reduce((sum, h) => sum + Number(h.marketValue || 0), 0);
            return <div className="mh-side-account" key={a.id}><i className={`tone-${index % 2}`} /><span>{a.name}</span><b>{money(value)}</b></div>;
          })}
        </section>
        <section><h3>价格数据</h3><p className="mh-sidebar-objective">{state.marketUpdatedAt ? `上次价格更新：${when(state.marketUpdatedAt)}` : "当前为导入的截图记录"}</p><p className="mh-sidebar-objective">待办执行时，常规交易时段取盘中价，其余时间取最近交易日收盘价。</p><button className="mh-button" onClick={() => onRefreshPrices()}><RefreshCw size={14} /> 刷新价格</button></section>
      </>)}
      {tab === "watch" && (watch ? <>
        <div className="mh-watch-focus">
          <div className="mh-watch-focus-labels">
            <span className="mh-ticker">{(watch.symbol || watch.name).slice(0, 2)}</span>
            <span className="mh-tag">{isIndexOrEtf(watch) ? "指数 / ETF" : "个股"}</span>
            <span className={"mh-queue-pill " + (selectedWatchTouched ? "done" : "")}>{selectedWatchTouched ? "已触及等待价" : watch.priceDate ? "报价 " + watch.priceDate : "等待报价"}</span>
          </div>
          <h2>{watch.symbol || watch.name}</h2>
          <p>{watch.name}</p>
          <div className="mh-watch-detail-prices">
            <div><small>当前报价</small><strong>{watch.price == null ? "暂无报价" : money(watch.price, watchCurrency)}</strong></div>
            <div><small>等待股价</small><strong>{watch.targetPrice > 0 ? money(watch.targetPrice, watchCurrency) : "尚未设置"}</strong></div>
            <div className={selectedWatchTouched ? "touched" : ""}><small>等待价差比例</small><strong>{selectedWatchGap == null ? "—" : selectedWatchGap.toFixed(2) + "%"}</strong></div>
          </div>
          <small className="mh-watch-detail-source">{watch.priceSourceUrl ? <a href={watch.priceSourceUrl} target="_blank" rel="noopener noreferrer">{holdingQuoteLabel(watch)}</a> : holdingQuoteLabel(watch)}</small>
          {watch.targetPrice > 0 ? <p className="mh-watch-gap-explainer">{selectedWatchTouched ? "最近保存报价已达到或低于你设定的等待价。" : "价差按当前报价相对等待价的距离计算；距离越小，排序越靠前。"}</p> : <p className="mh-watch-gap-explainer">你还没有填写等待价；填写后会自动参加价差排序。</p>}
        </div>
        <section className="mh-watch-detail-section">
          <div className="mh-section-heading"><h3>研究摘要</h3>{watch.report && <button className="mh-icon" aria-label="打开完整研究报告" onClick={() => onOpenReport(watch.report)}><FileCode2 size={15} /></button>}</div>
          <p className="mh-side-summary-text">{watch.research?.summary || "研究请求已排队，结果完成后会显示在这里。"}</p>
          {watch.report && <button className="mh-button" onClick={() => onOpenReport(watch.report)}><FileCode2 size={14} /> 打开完整研究</button>}
        </section>
        {watch.research?.risks?.length > 0 && <section className="mh-watch-detail-section">
          <h3>主要风险</h3>
          <ul className="mh-watch-key-points">{watch.research.risks.slice(0, 2).map((risk, i) => <li key={i}>{risk}</li>)}</ul>
        </section>}
        {watch.research?.catalysts?.length > 0 && <section className="mh-watch-detail-section">
          <h3>后续关注</h3>
          <ul className="mh-watch-key-points">{watch.research.catalysts.slice(0, 2).map((point, i) => <li key={i}>{point}</li>)}</ul>
        </section>}
        <section className="mh-watch-detail-actions">
          <button className="mh-text-button" onClick={() => onSelectWatch(null)}><ArrowDownLeft size={13} /> 返回价差优先榜</button>
          {watch.targetPrice <= 0 && <button className="mh-text-button" onClick={() => onEdit({ type: "watch", item: watch })}><Pencil size={13} /> 填写等待价</button>}
          <button className="mh-text-button" onClick={() => onQueueTask("watch-quotes", watch.id)}><RefreshCw size={13} /> 仅刷新价格</button>
          <button className="mh-text-button" onClick={() => onQueueTask("watch", watch.id, watchResearchQuestion(watch, true), { refreshResearch: true })}><Sparkles size={13} /> {hasCompleteResearch(watch) ? "更新完整研究" : "生成完整研究"}</button>
        </section>
      </> : <section className="mh-watch-priority">
        <div className="mh-watch-priority-heading">
          <div><span className="mh-eyebrow">NEAREST TO YOUR PRICE</span><h3>等待价差最低</h3></div>
          <span className="mh-tag">{watchPriorities.length} 项</span>
        </div>
        <p className="mh-watch-priority-intro">按最近保存报价到等待价的比例，从近到远排列。只有已填等待价且有报价的标的会进入这里。</p>
        {watchPriorities.length ? <div className="mh-watch-priority-list">
          {watchPriorities.map(({ item, gap }, index) => {
            const currency = item.priceCurrency || item.research?.quote?.currency || item.research?.identity?.currency || "USD";
            const touched = gap === 0;
            const previousRank = yesterdayWatchRanks.get(item.id);
            const movement = previousRank == null ? 0 : previousRank - index - 1;
            const movementLabel = movement > 0 ? `↑ ${movement}名` : movement < 0 ? `↓ ${Math.abs(movement)}名` : "持平";
            const movementText = movement > 0 ? `上升 ${movement} 名` : movement < 0 ? `下降 ${Math.abs(movement)} 名` : "排名持平";
            return <button className="mh-watch-priority-row" key={item.id} onClick={() => onSelectWatch(item.id)} aria-label={"查看 " + (item.symbol || item.name) + "，等待价差 " + gap.toFixed(2) + "%，" + movementText}>
              <span className="mh-priority-rank">{index + 1}</span>
              <span className="mh-priority-copy">
                <span>
                  <strong>{item.symbol || item.name}</strong>
                  <em>{isIndexOrEtf(item) ? "指数 / ETF" : "个股"}</em>
                  <small className={`mh-priority-movement ${movement > 0 ? "up" : movement < 0 ? "down" : "flat"}`}>{movementLabel}</small>
                </span>
                <small>{item.name}</small>
              </span>
              <span className={"mh-priority-gap " + (touched ? "touched" : "")}>
                <strong>{touched ? "已触及" : gap.toFixed(2) + "%"}</strong>
                <small>{money(item.price, currency)} → {money(item.targetPrice, currency)}</small>
              </span>
            </button>;
          })}
        </div> : <div className="mh-watch-priority-empty"><Target size={21} /><strong>还没有可排序的等待价</strong><p>填写等待价并确保有最新报价后，标的会自动出现在这里。没有等待价的标的仍保留在左侧分类列表。</p></div>}
        <div className="mh-watch-priority-footnote"><span className="mh-dot" /> 价差越小，越接近你的等待价</div>
      </section>)}
      {tab === "converter" && <>
        <section className="mh-side-summary">
          <span className="mh-eyebrow">PAIRED PRICE RATIOS</span>
          <strong>2 组换算</strong>
          {CONVERSION_PAIRS.map((pair) => {
            const calibration = converter.calibrations.find((row) => row.pairId === pair.id);
            return <div className="mh-converter-side-row" key={pair.id}>
              <span>{pair.baseSymbol} → {pair.targetSymbol}</span>
              <b>{calibration ? calibration.ratio.toFixed(6) : "待校准"}</b>
              <small>{calibration ? `截至 ${calibration.asOf}` : "请求首次校准"}</small>
            </div>;
          })}
        </section>
        <section>
          <div className="mh-section-heading"><h3>公式口径</h3><ArrowRightLeft size={15} /></div>
          <p className="mh-sidebar-objective">{converter.calibrations.every((row) => row.method === "synchronized_intraday") ? "使用最近 10 个共同交易日、伦敦 16:25 同一时点的配对价格；参考带取比值 P25–P75。" : "当前只有不同收市时点的日线样本，系数仅为临时估算且不显示误差带。更新时改取最近 10 个共同交易日、伦敦 16:25 的同步配对价。"} 两组都按 USD 价格配对。</p>
          <button className="mh-button" onClick={onRefreshConverter} disabled={converterPending}>
            {converterPending ? <LoaderCircle size={14} className="mh-spin" /> : <RefreshCw size={14} />}
            {converterPending ? "公式更新已排队" : "请求更新公式"}
          </button>
        </section>
      </>}
      {tab === "analysis" && <>
        <section className="mh-side-summary"><span className="mh-eyebrow">AUTOMATIC CHECKS</span><strong>{notes.length} 项观察</strong><p className="mh-side-summary-text">本地按保存的持仓、报价和目标计算；AI 体检需手动加入 Codex 待办。</p><button className="mh-primary" onClick={() => onQueueTask("portfolio", null, "今日持仓体检：结合当前两个账户的全部持仓、最新可核实行情与公司信息，复核集中度、重叠风险、宏观和个股风险、现金弹药与目标，给出支持与反证、观察触发条件和保持不动方案，生成完整 HTML 报告。")}>今日持仓体检</button></section>
        <section><div className="mh-section-heading"><h3>过往体检</h3><span className="mh-tag">{reports.length}</span></div>{reportLinks(reports.slice(0, 8), "还没有历史体检")}</section>
        <section><h3>本地观察</h3>{notes.slice(0, 4).map((n) => <p className="mh-side-note" key={n.title}><i className={n.tone === "amber" ? "amber" : ""} />{n.title}</p>)}</section>
      </>}
      {tab === "cash" && <>
        <section className="mh-side-summary"><span className="mh-eyebrow">USD AMMUNITION</span><strong>{state.cash.length ? money(portfolio.available) : "待录入"}</strong><div><span>资金流水合计</span><b>{money(cash)}</b></div><button className="mh-text-button" onClick={() => onEdit({ type: "cash" })}><Plus size={13} /> 记录一笔资金</button></section>
        <section><div className="mh-section-heading"><h3>目标状态</h3></div><p className="mh-sidebar-objective">{(state.goals.objective || state.goals.notes || "").trim() ? "投资目标已记录" : "尚未设置投资目标"}</p></section>
        <section><h3>最近资金记录</h3>{state.cash.length ? state.cash.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map((row) => <div className="mh-side-cash" key={row.id}><strong className={row.amount >= 0 ? "mh-gain" : "mh-loss"}>{row.amount > 0 ? "+" : ""}{money(row.amount)}</strong><span>{row.kind} · {row.date}</span></div>) : <p className="mh-side-empty">暂无资金流水</p>}</section>
      </>}
      {tab === "reports" && <>
        <section className="mh-side-summary"><span className="mh-eyebrow">SAVED RESEARCH</span><strong>{allAnalyses.length} 份报告</strong><div><span>公司研究</span><b>{allAnalyses.filter((a) => a.kind === "watch").length}</b></div><div><span>持仓体检</span><b>{allAnalyses.filter((a) => a.kind === "portfolio").length}</b></div><div><span>行情研究</span><b>{allAnalyses.filter((a) => a.kind === "market").length}</b></div><button className="mh-text-button" onClick={() => onNavigate("ai")}>查看任务状态 <ArrowRight size={13} /></button></section>
        <section><h3>最近保存</h3>{reportLinks(allAnalyses.slice(0, 5), "尚无研究报告")}</section>
      </>}
      {tab === "ai" && <>
        <section className="mh-side-summary"><span className="mh-eyebrow">CODEX QUEUE</span><strong>{state.jobs.filter((j) => j.status === "waiting").length} 项待办</strong><div><span>已完成</span><b>{state.jobs.filter((j) => j.status === "done").length}</b></div><div><span>未完成</span><b>{state.jobs.filter((j) => j.status === "failed").length}</b></div><button className="mh-button" onClick={onCopyQueue}><Copy size={14} /> 复制待办给 Codex</button></section>
        <section><h3>最近完成</h3>{reportLinks(allAnalyses.slice(0, 4), "完成的研究会保存在这里")}</section>
      </>}
      {tab === "journal" && <>
        <section className="mh-side-summary"><span className="mh-eyebrow">DECISION LOG</span><strong>{state.journal.length} 条记录</strong><button className="mh-primary" onClick={() => onEdit({ type: "journal" })}><Plus size={14} /> 写一条决策</button></section>
        <section><h3>最近记录</h3>{state.journal.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map((j) => <button className="mh-side-history" key={j.id} onClick={() => onEdit({ type: "journal", item: j })}><BookOpen size={15} /><span><strong>{j.title}</strong><small>{j.date}</small></span><Pencil size={13} /></button>)}</section>
      </>}
      <footer><span className="mh-dot" /> 数据留在本机 · 研究由你掌握</footer>
    </aside>
  );
}
const CONVERTER_TASK_GUIDANCE = "利用伦敦与美国常规交易时段重叠，在最近 10 个共同交易日分别采集伦敦时间 16:25:00±30 秒的同一时点价格；每组 10 天必须统一取价方法。优先取双方可核验的买卖盘中间价（baseAt 与 targetAt 相差不超过 15 秒）；其次用同一 UTC 分钟的一分钟收盘价；若数据源只提供五分钟线，可用同一 UTC 五分钟区间、在 16:25 收盘的配对价格。时间戳为价格实际对应的 UTC 时点、伦敦当地日期一致，不能以两地各自收盘价或不同时间的日线价代替，也不能混用 GBP/EUR。保存全部原始价格、精确时间戳和 HTTPS 来源 URL。无法核验完整同步样本就调用 fail，保留旧公式，不要猜测或补造价格。提交 method=synchronized_intraday、sampleType=midquote、minute_close 或 five_minute_close、10 条 observations（date、baseAt、targetAt、basePrice、targetPrice）及 sources.base / sources.target。API 检查每组 10 个日期和时间匹配，以 10 个配对比值的中位数计算中心系数，以 P25–P75 计算近期典型参考带。无需 HTML，不改持仓。";

function converterSeedValues(calibrations) {
  return Object.fromEntries(CONVERSION_PAIRS.map((pair) => {
    const calibration = calibrations?.find((row) => row.pairId === pair.id);
    const latest = calibration?.observations?.slice().sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    const base = Number.isFinite(latest?.basePrice) ? latest.basePrice : latest?.baseClose;
    return [pair.id, {
      base: Number.isFinite(base) ? base.toFixed(2) : "",
      target: Number.isFinite(base) && calibration?.ratio ? (base * calibration.ratio).toFixed(4) : "",
      driver: "base",
    }];
  }));
}
function ConverterPage({ converter }) {
  const current = converter || INITIAL_CONVERTER_STATE;
  const [values, setValues] = useState(() => converterSeedValues(current.calibrations));
  useEffect(() => {
    setValues((previous) => Object.fromEntries(CONVERSION_PAIRS.map((pair) => {
      const calibration = current.calibrations.find((row) => row.pairId === pair.id);
      const prior = previous[pair.id] || {};
      const ratio = Number(calibration?.ratio);
      if (!Number.isFinite(ratio) || ratio <= 0) return [pair.id, prior];
      const driver = prior.driver || "base";
      if (driver === "target" && prior.target !== undefined && prior.target !== "") {
        const target = Number(prior.target);
        return [pair.id, { ...prior, base: Number.isFinite(target) ? (target / ratio).toFixed(4) : "" }];
      }
      const base = Number(prior.base);
      if (prior.base !== undefined && prior.base !== "")
        return [pair.id, { ...prior, target: Number.isFinite(base) ? (base * ratio).toFixed(4) : "" }];
      return [pair.id, converterSeedValues(current.calibrations)[pair.id]];
    })));
  }, [current.updatedAt]);
  const updatePrice = (pair, side, raw) => {
    const calibration = current.calibrations.find((row) => row.pairId === pair.id);
    const ratio = Number(calibration?.ratio);
    setValues((previous) => {
      const next = { ...previous[pair.id], driver: side };
      if (raw === "") {
        next[side] = "";
        next[side === "base" ? "target" : "base"] = "";
        return { ...previous, [pair.id]: next };
      }
      const value = Number(raw);
      next[side] = raw;
      if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(ratio) || ratio <= 0) {
        next[side === "base" ? "target" : "base"] = "";
      } else {
        next[side === "base" ? "target" : "base"] =
          side === "base" ? (value * ratio).toFixed(4) : (value / ratio).toFixed(4);
      }
      return { ...previous, [pair.id]: next };
    });
  };
  return (
    <div className="mh-converter-page">
      <div className="mh-converter-intro">
        <span className="mh-eyebrow">SHORT-TERM PRICE REFERENCE</span>
        <p>输入任一边的价格，另一边即时估算。只有同一交易时刻的配对样本才会显示参考带；不同时间的日线数据不用于伪造误差区间。</p>
      </div>
      <div className="mh-converter-grid">
        {CONVERSION_PAIRS.map((pair) => {
          const calibration = current.calibrations.find((row) => row.pairId === pair.id);
          const ratio = Number(calibration?.ratio);
          const pairValues = values[pair.id] || {};
          const driver = pairValues.driver || "base";
          const sourceValue = Number(pairValues[driver]);
          const hasEstimate = Number.isFinite(sourceValue) && sourceValue > 0 && Number.isFinite(ratio) && ratio > 0;
          const synchronized = calibration?.method === "synchronized_intraday";
          const outputLow = hasEstimate && synchronized
            ? driver === "base" ? sourceValue * calibration.lowRatio : sourceValue / calibration.highRatio
            : null;
          const outputHigh = hasEstimate && synchronized
            ? driver === "base" ? sourceValue * calibration.highRatio : sourceValue / calibration.lowRatio
            : null;
          const outputSymbol = driver === "base" ? pair.targetSymbol : pair.baseSymbol;
          const outputEstimate = hasEstimate
            ? driver === "base" ? sourceValue * ratio : sourceValue / ratio
            : null;
          const rangeSpanPct = hasEstimate && synchronized && outputEstimate > 0
            ? ((outputHigh - outputLow) / outputEstimate) * 100
            : null;
          return (
            <section className="mh-panel mh-converter-card" key={pair.id}>
              <header className="mh-converter-card-head">
                <div><span className="mh-eyebrow">INDEX PAIR</span><h2>{pair.title}</h2></div>
                <span className="mh-tag">USD · USD</span>
              </header>
              <div className="mh-converter-fields">
                <label className={driver === "base" ? "mh-converter-field active" : "mh-converter-field"}>
                  <span><strong>{pair.baseSymbol}</strong><small>{pair.baseVenue} · USD</small></span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    aria-label={`${pair.baseSymbol} 价格`}
                    value={pairValues.base ?? ""}
                    onChange={(event) => updatePrice(pair, "base", event.target.value)}
                    placeholder="输入价格"
                  />
                  <small>{pair.baseName}</small>
                </label>
                <span className="mh-converter-link" aria-hidden="true"><ArrowRightLeft size={18} /></span>
                <label className={driver === "target" ? "mh-converter-field active target" : "mh-converter-field target"}>
                  <span><strong>{pair.targetSymbol}</strong><small>{pair.targetVenue} · USD</small></span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    aria-label={`${pair.targetSymbol} 价格`}
                    value={pairValues.target ?? ""}
                    onChange={(event) => updatePrice(pair, "target", event.target.value)}
                    placeholder="输入价格"
                  />
                  <small>{pair.targetName}</small>
                </label>
              </div>
              <div className="mh-converter-ratio">
                <span>{pair.targetSymbol} ÷ {pair.baseSymbol}</span>
                <strong>{Number.isFinite(ratio) && ratio > 0 ? ratio.toFixed(8) : "待校准"}</strong>
                <small>{calibration ? synchronized ? `${calibration.observationCount} 个共同交易日 · 16:25 同步${calibration.sampleType === "midquote" ? "盘口中间价" : calibration.sampleType === "five_minute_close" ? "5 分钟线收盘价" : "1 分钟线收盘价"}` : `${calibration.observationCount} 个交易日 · 日线临时系数（时点未同步）` : "请求更新公式以生成首个系数"}</small>
              </div>
              <div className="mh-converter-range">
                <span>{synchronized ? calibration.observationCount === 10 ? "近期配对比值中间 50%（P25–P75）" : "五日同步样本范围" : "同步参考带"}</span>
                <strong>{!hasEstimate ? "输入一个价格后显示" : synchronized ? `${outputSymbol} ${preciseUSD(outputLow)} – ${preciseUSD(outputHigh)}` : "同步校准后显示"}</strong>
                <small>{!hasEstimate ? "" : synchronized ? `${calibration.observationCount} 个同一时点配对样本；${calibration.observationCount === 10 ? `P25–P75 带宽 ${rangeSpanPct.toFixed(2)}%，仅表示近期典型范围` : `样本极值跨度 ${rangeSpanPct.toFixed(2)}%`}，不是预测或保证` : "旧日线样本时点不一致，已隐藏其宽幅区间；当前中心值仅供粗略参考"}</small>
              </div>
              <footer className="mh-converter-meta">
                <span>{calibration ? `数据截至 ${calibration.asOf}` : "公式尚未校准"}</span>
                <span>
                  <a href={pair.issuerUrl} target="_blank" rel="noopener noreferrer">发行方资料</a>
                  <a href={calibration?.sources?.base || pair.baseUrl} target="_blank" rel="noopener noreferrer">{pair.baseSymbol} 行情源</a>
                  <a href={calibration?.sources?.target || pair.targetUrl} target="_blank" rel="noopener noreferrer">{pair.targetSymbol} 行情源</a>
                </span>
              </footer>
            </section>
          );
        })}
      </div>
      <div className="mh-converter-caveat">
        <ShieldCheck size={16} />
        <p>{current.calibrations.some((row) => row.method !== "synchronized_intraday") ? "标注“日线临时系数”的配对仍是粗略估算，误差带已隐藏。点击“请求更新公式”后，会采集最近 10 个共同交易日伦敦时间 16:25 附近的同步配对价；双边盘口报价相差不得超过 15 秒，分钟线须来自相同 UTC 分钟或五分钟区间，最终中心值取比值中位数，参考带取 P25–P75。" : `当前系数来自同一时点的历史配对价格（${Math.min(...current.calibrations.map((row) => row.observationCount))}–${Math.max(...current.calibrations.map((row) => row.observationCount))} 日）；中心值取比值中位数，参考带是 P25–P75 的近期典型范围，不是预测或保证。`} 四位小数只是计算显示精度，不代表可成交精度；基金跟踪同一指数也可能因费用、股息处理和买卖价差而不同。下单前请核对 IBKR 实时报价并使用限价单。</p>
      </div>
      <section className="mh-converter-principle" aria-labelledby="mh-converter-principle-title">
        <header className="mh-converter-principle-head">
          <span className="mh-eyebrow">HOW THE CONVERSION WORKS</span>
          <h2 id="mh-converter-principle-title">换算原理｜同一指数、同期价格、比例换算</h2>
          <p>这不是把两只 ETF 的价格当成相同，而是用它们近期同步的“每份价格比例”做短期估算。</p>
        </header>
        <div className="mh-converter-principle-grid">
          <article>
            <span className="mh-converter-principle-step">01 · 共同基准</span>
            <h3>它们跟踪同一个指数</h3>
            <p><strong>VOO ↔ SPYL</strong> 都跟踪 S&amp;P 500；<strong>QQQM ↔ CNDX</strong> 都跟踪 Nasdaq-100。四个页面报价均为美元，因此这两组换算不需要再乘汇率。</p>
            <p>同一指数的涨跌会让两只基金的每份净值同向、近似同比例变化，因此价格比例短期通常较稳定。每份净资产基数不同，股价尺度也不同；例如 CNDX 单份价格高于 QQQM，不表示它跟踪的指数涨得更多。</p>
          </article>
          <article>
            <span className="mh-converter-principle-step">02 · 同时点配对</span>
            <h3>先算出每一天的比例</h3>
            <p>在双方共同交易的时段，取同一 UTC 时刻（或同一根分钟线）的两边价格，计算：</p>
            <div className="mh-converter-formula"><code>当日比例 = 目标 ETF 价格 ÷ 基准 ETF 价格</code></div>
            <p>必须对齐时刻，因为指数在盘中持续变化；拿不同时间的价格相除，会把行情涨跌误当成基金比例变化。</p>
          </article>
          <article>
            <span className="mh-converter-principle-step">03 · 得出估算</span>
            <h3>用近期比例中位数换算</h3>
            <div className="mh-converter-formula"><code>目标价 ≈ 输入价 × 近期比例中位数</code></div>
            <div className="mh-converter-formula"><code>反向估算 ≈ 输入价 ÷ 近期比例中位数</code></div>
            <p>多日比例的中位数不容易被某一天的异常报价带偏；它代表近期中心关系，不是永久固定的公式。</p>
          </article>
        </div>
        <div className="mh-converter-principle-bottom">
          <div>
            <h3>参考区间怎么看</h3>
            <p>同步样本达到 10 个时，页面用比例的 P25–P75（中间一半样本）作为近期典型波动带。它帮助判断估值大约落在哪一段，不是预测区间，也不保证成交价一定落在其中；样本不足时会显示样本范围或暂不显示。</p>
          </div>
          <div>
            <h3>为什么比例仍会变</h3>
            <p>管理费和跟踪误差、分红与累积方式、基金资产和每份份额的设定，以及买卖价差或短时溢折价，都会让两边比例缓慢漂移。因此它适合给熟悉的 VOO/QQQM 价格找一个 SPYL/CNDX 的短期参考，实际下单仍应核对同一时刻的实时报价。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default function HoldingsApp() {
  const [state, setState] = useState(null),
    [fatal, setFatal] = useState(""),
    [tab, setTab] = useState("overview"),
    [left, setLeft] = useState(() => readPanel("mh-left", true)),
    [right, setRight] = useState(() =>
      readPanel("mh-right", matchMedia("(min-width: 1001px)").matches),
    ),
    [query, setQuery] = useState(""),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false),
    [toast, setToast] = useState(null),
    [selected, setSelected] = useState(null),
    [selectedWatchId, setSelectedWatchId] = useState(null),
    [watchRefreshBatchIds, setWatchRefreshBatchIds] = useState(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("mh-watch-refresh-batch") || "[]");
        return Array.isArray(saved) ? saved.filter((jobId) => typeof jobId === "string") : [];
      } catch {
        return [];
      }
    }),
    [watchRefreshBusy, setWatchRefreshBusy] = useState(false),
    [watchSort, setWatchSort] = useState(() => {
      try {
        const saved = localStorage.getItem("mh-watch-sort");
        return WATCH_SORT_OPTIONS.some((option) => option.id === saved) ? saved : "gap";
      } catch {
        return "gap";
      }
    }),
    [watchTargetDrafts, setWatchTargetDrafts] = useState({}),
    [attentionPickerId, setAttentionPickerId] = useState(null),
    [showAllWatchStocks, setShowAllWatchStocks] = useState(false),
    [watchStockColumnCount, setWatchStockColumnCount] = useState(1),
    [showAllResearch, setShowAllResearch] = useState(false),
    [showAllWaitingJobs, setShowAllWaitingJobs] = useState(false),
    [showAllCompletedJobs, setShowAllCompletedJobs] = useState(false),
    [question, setQuestion] = useState(""),
    [aiKind, setAiKind] = useState("portfolio"),
    [provider, setProvider] = useState("ChatGPT"),
    [stress, setStress] = useState(20),
    [importText, setImportText] = useState(""),
    [accountNames, setAccountNames] = useState(null);
  const stateRef = useRef(state),
    busyRef = useRef(false),
    watchStockGridRef = useRef(null),
    priceAlertKeys = useRef(new Set()),
    timer = useRef();
  stateRef.current = state;
  const notify = (text, error = false) => {
    setToast({ text, error });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), error ? 10000 : 3500);
  };
  const rememberWatchRefreshBatch = (jobIds) => {
    const uniqueIds = [...new Set(jobIds)];
    setWatchRefreshBatchIds(uniqueIds);
    try {
      localStorage.setItem("mh-watch-refresh-batch", JSON.stringify(uniqueIds));
    } catch {}
  };
  const refresh = async () => {
    try {
      const s = await request("/api/state");
      setState(s);
      setFatal("");
      return s;
    } catch (e) {
      setFatal(e.message);
    }
  };
  useEffect(() => {
    refresh();
    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (!state) return;
    let active = true;
    const saveDailyRank = async () => {
      try {
        const result = await request("/api/watchlist/rank-snapshot", {
          date: localDate(),
          watchIds: rankWatchPriorities(state.watchlist).map(({ item }) => item.id),
        });
        if (active && result.state.revision !== stateRef.current?.revision) {
          setState(result.state);
          stateRef.current = result.state;
        }
      } catch (error) {
        if (active) console.error("无法保存关注榜单的每日名次。", error);
      }
    };
    saveDailyRank();
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const rollover = setTimeout(saveDailyRank, Math.max(1000, nextDay.getTime() - now.getTime()));
    return () => {
      active = false;
      clearTimeout(rollover);
    };
  }, [state?.watchlist]);
  useEffect(() => {
    if (!attentionPickerId) return;
    const closeAttentionPicker = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".mh-watch-attention-control"))
        setAttentionPickerId(null);
    };
    document.addEventListener("pointerdown", closeAttentionPicker);
    return () => document.removeEventListener("pointerdown", closeAttentionPicker);
  }, [attentionPickerId]);
  useEffect(() => {
    if (!state || modal) return;
    const alerts = state.watchlist.filter((w) => {
      const reached = w.price != null && Number.isFinite(Number(w.price)) && Number(w.targetPrice) > 0 && Number(w.price) <= Number(w.targetPrice);
      const key = `${w.id}:${w.targetPrice}:${w.priceDate}:${w.price}`;
      if (!reached || priceAlertKeys.current.has(key)) return false;
      priceAlertKeys.current.add(key);
      return true;
    });
    if (alerts.length) setModal({ type: "priceAlerts", items: alerts });
  }, [state, modal]);
  useEffect(() => {
    let active = true;
    const poll = setInterval(async () => {
      try {
        const s = await request("/api/state");
        if (
          active &&
          !busyRef.current &&
          s.revision !== stateRef.current?.revision
        ) {
          setState(s);
          stateRef.current = s;
        }
      } catch {}
    }, 6000);
    return () => {
      active = false;
      clearInterval(poll);
    };
  }, []);
  useLayoutEffect(() => {
    const grid = watchStockGridRef.current;
    if (tab !== "watch" || !grid) return;
    const measureColumns = () => {
      const columns = getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(Boolean).length;
      setWatchStockColumnCount((current) => current === columns ? current : columns);
    };
    measureColumns();
    const observer = new ResizeObserver(measureColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [tab, state, query]);
  useEffect(() => {
    if (!state || watchRefreshBusy || !watchRefreshBatchIds.length) return;
    const hasWaitingBatchJob = watchRefreshBatchIds.some((jobId) =>
      state.jobs.some((job) => job.id === jobId && ["watch", "watch-quotes"].includes(job.kind) && job.status === "waiting"),
    );
    if (!hasWaitingBatchJob) rememberWatchRefreshBatch([]);
  }, [state, watchRefreshBusy, watchRefreshBatchIds]);
  const toggle = (side) => {
    if (side === "left")
      setLeft((v) => {
        try {
          localStorage.setItem("mh-left", v ? "closed" : "open");
        } catch {}
        return !v;
      });
    else
      setRight((v) => {
        try {
          localStorage.setItem("mh-right", v ? "closed" : "open");
        } catch {}
        return !v;
      });
  };
  const mutate = async (fn, { close = true, successMessage = "已保存到本地" } = {}) => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    try {
      const draft = structuredClone(stateRef.current);
      fn(draft);
      const saved = await request("/api/state", draft, "PUT");
      setState(saved);
      stateRef.current = saved;
      if (close) setModal(null);
      if (successMessage) notify(successMessage);
      return true;
    } catch (e) {
      notify(e.message, true);
      if (e.message.includes("已更新")) await refresh();
      return false;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const upsert = async (key, value) =>
    mutate((s) => {
      const i = s[key].findIndex((r) => r.id === value.id);
      if (i >= 0) s[key][i] = value;
      else s[key].push(value);
    });
  const recordBuy = async (buy) => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await request("/api/holdings/buy", { ...buy, revision: stateRef.current.revision });
      setState(result.state);
      stateRef.current = result.state;
      setSelected(result.holding?.id || null);
      setModal(null);
      notify(result.duplicate ? "这笔买入已经保存，未重复计入" : `${result.merged ? "已追加买入" : "已记录买入"}：${result.holding.symbol} 共 ${result.holding.quantity} 股，成本均价 ${money(result.holding.averagePrice, result.holding.currency)}`);
      return true;
    } catch (e) {
      notify(e.message, true);
      if (e.message.includes("已更新")) await refresh();
      return false;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const saveWatchAttention = (watchId, attention) =>
    mutate((s) => {
      const watch = s.watchlist.find((row) => row.id === watchId);
      if (watch) watch.attention = attention;
    }, { close: false, successMessage: "关注等级已更新" });
  const remove = (key, item) => setModal({ type: "delete", key, item });
  const openReport = (path) => {
    if (!path) return;
    const id = btoa(unescape(encodeURIComponent(path)))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    window.open(`${BASE}/library/document/${encodeURIComponent(id)}`, "_blank", "noopener,noreferrer");
  };
  const queueTask = async (kind = "portfolio", watchId, prompt = question, { quiet = false, refreshResearch = false } = {}) => {
    try {
      const r = await request("/api/jobs", { kind, watchId, question: prompt, refreshResearch });
      setState(r.state);
      stateRef.current = r.state;
      if (!quiet) notify(["quotes", "watch-quotes"].includes(kind) ? "价格更新已加入待办，按实际执行时段取价" : kind === "converter" ? "换算公式更新已加入待办" : "研究已加入待办");
      return true;
    } catch (e) {
      if (/已经在.*待办队列/.test(e.message)) {
        if (!quiet) notify("这项任务已在等待 Codex 的队列里");
        return false;
      }
      notify(e.message, true);
      return false;
    }
  };
  const refreshPrices = () =>
    queueTask(
      "quotes",
      null,
      PRICE_REFRESH_QUESTION,
    );
  const refreshConverter = () => queueTask(
    "converter",
    null,
    `提高两组价格换算的精度：VOO→SPYL（pairId=sp500）与 QQQM→CNDX（pairId=nasdaq100）。先核实发行方、指数和 USD 挂牌代码。${CONVERTER_TASK_GUIDANCE}`,
  );
  const refreshWatchlist = async () => {
    if (watchRefreshBusy) return;
    setWatchRefreshBusy(true);
    try {
      const current = stateRef.current;
      const undoableIds = undoableWatchRefreshIds(current, watchRefreshBatchIds);
      if (undoableIds.length) {
        const result = await request("/api/jobs/cancel", { jobIds: undoableIds });
        setState(result.state);
        stateRef.current = result.state;
        rememberWatchRefreshBatch([]);
        const cancelledCount = result.cancelledIds?.length || 0;
        if (cancelledCount) {
          notify(cancelledCount < undoableIds.length
            ? `已撤销 ${cancelledCount} 项仍在等待的关注更新；已开始或完成的任务保留。`
            : `已撤销本次新增的 ${cancelledCount} 项关注更新待办。`);
        } else {
          notify("这批关注更新已经开始或完成，无法撤销。", true);
        }
        return;
      }

      rememberWatchRefreshBatch([]);
      if (!current?.watchlist.length) return notify("先添加关注标的", true);
      const result = await request("/api/jobs/batch-watch", {});
      setState(result.state);
      stateRef.current = result.state;
      const createdIds = (result.jobs || []).map((job) => job.id);
      rememberWatchRefreshBatch(createdIds);
      if (createdIds.length) {
        const prices = result.jobs.filter((job) => job.kind === "watch-quotes").length;
        const studies = result.jobs.filter((job) => job.kind === "watch").length;
        notify(`已加入 ${prices} 项价格更新${studies ? `、${studies} 项首次研究` : "；已有完整研究保留"}；再次点击可撤销未开始的任务。`);
      }
      else notify("没有新增任务：关注更新已在待办队列中。");
    } catch (error) {
      notify(error.message || "关注更新操作失败。", true);
    } finally {
      setWatchRefreshBusy(false);
    }
  };
  const saveWatchTarget = (watchId, rawValue) => {
    const value = rawValue === "" ? null : Number(rawValue);
    if (value !== null && (!Number.isFinite(value) || value < 0)) return notify("等待价格需要是大于 0 的数字", true);
    mutate((s) => {
      const item = s.watchlist.find((w) => w.id === watchId);
      if (item) item.targetPrice = value;
    }, { close: false });
  };
  const copy = async (kind = aiKind, focus) => {
    const prompt = `请按适合 ${provider} 的深度研究方式完成以下任务。\n${contextPack(stateRef.current, kind, focus ? `优先研究：${focus.name} ${focus.symbol}；${focus.note}；关注条件：${focus.trigger}` : question)}`;
    try {
      await navigator.clipboard.writeText(prompt);
      notify(`完整资料包已复制，可粘贴给 ${provider}`);
    } catch {
      setImportText(prompt);
      setModal({ type: "copy" });
    }
  };
  const copyQueue = async () => {
    const pending = stateRef.current.jobs.filter((j) => j.status === "waiting");
    const prompt = `请在当前 NodeApps 工作区执行 My Holdings 中等待的任务。先读取 apps/my_holdings/data/CODEX_TODO.md 与 apps/my_holdings/data/state.json，只处理 status 为 waiting 的任务。\n\n${quoteTaskGuidance(`${location.origin}${BASE}`)}\n\n换算公式任务（kind=converter）：先核对 VOO/SPYL 与 QQQM/CNDX 的发行方、指数和 USD 挂牌代码。${CONVERTER_TASK_GUIDANCE} 完成时 POST ${location.origin}${BASE}/api/jobs/{任务ID}/complete，提交包含两组 calibrations 的 JSON。\n\n研究任务（kind=watch、portfolio、market）：联网核实资料并生成自包含中文 HTML，保存到 apps/my_holdings/data/reports/ 对应目录；然后调用 complete API，提交 report 相对路径与完整 research 对象。watch 的 researchMode=initial 只补缺失研究，执行前若已有完整研究则直接 complete 回写跳过说明；researchMode=refresh 才是用户明确要求更新完整研究。价格任务独立执行；报告中的历史报价不可覆盖最新行情。无法完成时调用 /my-holdings/api/jobs/{任务ID}/fail 并说明原因。不要做买卖或交易。\n\n当前等待任务：\n${JSON.stringify(pending, null, 2)}\n\n${contextPack(stateRef.current, "portfolio", "仅处理上述待办任务，并回写结果。")}`;
    try {
      await navigator.clipboard.writeText(prompt);
      notify("待办与持仓背景已复制；粘贴给 Codex 后由它处理并回写结果");
    } catch {
      setImportText(prompt);
      setModal({ type: "copy" });
    }
  };
  if (!state)
    return (
      <div className="mh-loading">
        {fatal ? (
          <>
            <h2>暂时无法读取持仓</h2>
            <p>{fatal}</p>
            <button onClick={refresh}>重试</button>
          </>
        ) : (
          <>
            <LoaderCircle className="mh-spin" />
            <p>正在打开你的持仓室…</p>
          </>
        )}
      </div>
    );
  const m = calculate(state),
    notes = observations(state),
    focus = state.holdings.find((h) => h.id === selected),
    portfolioReports = state.analyses.filter((a) => a.kind === "portfolio").sort((a, b) => b.date.localeCompare(a.date)),
    latest = portfolioReports[0],
    allAnalyses = state.analyses.slice().sort((a, b) => b.date.localeCompare(a.date)),
    watchFocus = state.watchlist.find((w) => w.id === selectedWatchId) || null,
    watchPriorities = rankWatchPriorities(state.watchlist),
    waitingJobs = state.jobs.filter((j) => j.status === "waiting" || j.status === "failed"),
    completedJobs = state.jobs.filter((j) => {
      if (j.status !== "done") return false;
      const completedAt = Date.parse(j.completedAt || j.date);
      return Number.isFinite(completedAt) && completedAt >= Date.now() - 2 * 24 * 60 * 60 * 1000;
    }).sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date)),
    visibleHoldings = state.holdings.filter((h) =>
      `${h.symbol} ${h.name} ${h.sector}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const yesterday = previousLocalDate(localDate());
  const yesterdayWatchRanks = new Map(
    (state.watchRankHistory || [])
      .find((snapshot) => snapshot.date === yesterday)
      ?.watchIds.map((watchId, index) => [watchId, index + 1]) || [],
  );
  const watchRefreshPending = undoableWatchRefreshIds(state, watchRefreshBatchIds).length > 0;
  const page = (id) => {
    setTab(id);
    setQuery("");
    if (id === "watch") {
      setShowAllWatchStocks(false);
      setSelectedWatchId(null);
      setRight(true);
    }
  };
  const setWatchSortMode = (mode) => {
    setWatchSort(mode);
    try {
      localStorage.setItem("mh-watch-sort", mode);
    } catch {}
  };
  const selectWatch = (watchId) => {
    setSelectedWatchId(watchId);
    setRight(true);
  };
  const visibleWatchlist = state.watchlist.filter((watch) =>
    `${watch.name} ${watch.symbol}`.toLowerCase().includes(query.toLowerCase()),
  );
  const watchStocks = sortWatchlist(visibleWatchlist.filter((watch) => !isIndexOrEtf(watch)), watchSort);
  const watchFunds = sortWatchlist(visibleWatchlist.filter(isIndexOrEtf), watchSort);
  const collapsedWatchStockLimit = watchStockColumnCount * 3;
  const visibleWatchStocks = showAllWatchStocks
    ? watchStocks
    : watchStocks.slice(0, collapsedWatchStockLimit);
  const heading = (eyebrow, title, subtitle, action) => (
    <div className="mh-page-heading">
      <div className="mh-heading-copy">
        <div className="mh-heading-line">
          <h1>{title}</h1>
          {eyebrow && <span className="mh-eyebrow">{eyebrow}</span>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
  const stats = (scope = m) => (
    <div className="mh-stats">
      <Stat
        label="持仓市值 · USD"
        value={money(scope.value)}
        sub={`${scope.holdings.length} 条记录 · ${scope.groups.length} 个合并标的`}
        icon={Wallet}
      />
      <Stat
        label="浮动盈亏 · USD"
        value={`${scope.pnl > 0 ? "+" : ""}${money(scope.pnl)}`}
        sub={`${pct(scope.returnPct)} · 相对已录入总成本`}
        negative={scope.pnl < 0}
        icon={BarChart3}
      />
      <Stat
        label="可部署弹药 · USD"
        value={state.cash.length ? money(m.available) : "待录入"}
        sub={
          state.cash.length ? "已扣除目标币种的预留金额" : "尚未录入资金流水"
        }
        icon={CircleDollarSign}
      />
      <Stat
        label="投资目标"
        value={(state.goals.objective || state.goals.notes || "").trim() || "写下一句话，给组合分析一个方向"}
        sub={(state.goals.objective || state.goals.notes || "").trim() ? "已设置" : "尚未设置"}
        icon={Target}
        variant="goal"
      />
    </div>
  );
  const holdingsTable = (rows = visibleHoldings, limit) => (
    <div className="mh-table-wrap">
      <table className="mh-table">
        <thead>
          <tr>
            <th>标的</th>
            <th>持有数量</th>
            <th>当前价格</th>
            <th>成本均价</th>
            <th>市值 / 总成本</th>
            <th>浮动盈亏</th>
            <th aria-label="操作"></th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, limit).map((h) => (
            <tr
              key={h.id}
              className={selected === h.id ? "selected" : ""}
              onClick={() => {
                setSelected(h.id);
                if (matchMedia("(min-width: 1001px)").matches) setRight(true);
              }}
            >
              <td>
                <div className="mh-asset">
                  <span className={`mh-ticker t-${h.symbol.charCodeAt(0) % 3}`}>
                    {h.symbol.slice(0, 2)}
                  </span>
                  <span>
                    <strong>{h.symbol}</strong>
                    <small>
                      {state.accounts.find((a) => a.id === h.accountId)?.name} ·{" "}
                      {h.sector}
                    </small>
                  </span>
                </div>
              </td>
              <td>
                {h.quantity}
                <small>股</small>
              </td>
              <td>
                {money(h.price, h.currency)}
                <small title={h.priceSourceUrl || undefined}>{holdingQuoteLabel(h)}</small>
              </td>
              <td>
                {money(h.averagePrice, h.currency)}
              </td>
              <td>
                <span className="mh-value">{money(h.marketValue, h.currency)}</span>
                <small>成本 {money(h.cost, h.currency)}</small>
              </td>
              <td
                className={h.marketValue - h.cost < 0 ? "mh-loss" : "mh-gain"}
              >
                <strong>{money(h.marketValue - h.cost, h.currency)}</strong>
                <small>
                  {pct(h.cost ? ((h.marketValue - h.cost) / h.cost) * 100 : 0)}
                </small>
              </td>
              <td>
                <div className="mh-row-actions">
                  <button className="mh-icon" aria-label={`追加买入 ${h.symbol} ${state.accounts.find((a) => a.id === h.accountId)?.name}`} onClick={(e) => {
                    e.stopPropagation();
                    setModal({ type: "holding", buyHolding: h });
                  }}><Plus size={14} /></button>
                  <button
                    className="mh-icon"
                    aria-label={`编辑 ${h.symbol} ${state.accounts.find((a) => a.id === h.accountId)?.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ type: "holding", item: h });
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  {tab === "holdings" && (
                    <button
                      className="mh-icon"
                      aria-label={`删除 ${h.symbol}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        remove("holdings", h);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <Empty
          title="这里还没有持仓"
          text="添加第一条持仓，或者调整搜索条件。"
        />
      )}
    </div>
  );
  const renderWatchCard = (w) => {
    const relatedJobs = state.jobs.filter((j) => ["watch", "watch-quotes"].includes(j.kind) && j.watchId === w.id);
    const job = relatedJobs.findLast((j) => j.status === "waiting") || relatedJobs.at(-1);
    const jobLabel =
      job?.status === "done"
        ? job.kind === "watch-quotes" ? "价格已更新" : "研究已完成"
        : job?.status === "failed"
          ? "未完成"
          : job?.status === "waiting"
            ? job.kind === "watch-quotes" ? "等待价格更新" : "等待研究"
            : w.researchedAt || w.report || w.research
              ? "已有研究"
              : "未排队";
    const queueStatus = job?.status || (w.researchedAt || w.report || w.research ? "done" : "idle");
    const price = w.price == null || !Number.isFinite(Number(w.price)) ? null : Number(w.price);
    const targetPrice = w.targetPrice == null ? null : Number(w.targetPrice);
    const distance = watchGapPct(w);
    const targetDraft = watchTargetDrafts[w.id] ?? (targetPrice ?? "");
    const quoteCurrency = w.priceCurrency || w.research?.quote?.currency || w.research?.identity?.currency || "USD";
    const attention = watchAttention(w);
    const attentionOpen = attentionPickerId === w.id;
    const cardName = (w.name || w.symbol || "").trim();
    const cardSymbol = (w.symbol || "").trim();
    const nameBeforeSymbol = cardName.slice(0, cardName.length - cardSymbol.length);
    const alreadyIncludesSymbol = cardSymbol &&
      cardName.slice(-cardSymbol.length).toUpperCase() === cardSymbol.toUpperCase() &&
      /[-–—]\s*$/.test(nameBeforeSymbol);
    const displayName = alreadyIncludesSymbol
      ? nameBeforeSymbol.replace(/[-–—]\s*$/, "").trim() || cardName
      : cardName;
    const showCardSymbol = cardSymbol && displayName.toUpperCase() !== cardSymbol.toUpperCase();
    return (
      <article
        className={`mh-watch-card attention-${attention} ${watchFocus?.id === w.id ? "selected" : ""} ${attentionOpen ? "priority-picker-open" : ""}`}
        key={w.id}
        onClick={(event) => {
          if (event.target.closest("button, input, a, label")) return;
          selectWatch(w.id);
        }}
      >
        <header>
          <button className="mh-watch-identity" onClick={() => selectWatch(w.id)}>
            <h3>
              <span className="mh-watch-name">{displayName}</span>
              {showCardSymbol && <span className="mh-watch-symbol">- {cardSymbol}</span>}
              {!cardSymbol && <span className="mh-watch-symbol missing">- 代码待核实</span>}
            </h3>
          </button>
          <div
            className="mh-watch-attention-control"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setAttentionPickerId(null);
            }}
          >
            <button
              type="button"
              className="mh-watch-attention-trigger"
              aria-label={`当前关注度 ${attention}，点击更改`}
              aria-haspopup="true"
              aria-expanded={attentionOpen}
              title={`关注度 ${attention} · ${WATCH_ATTENTION_OPTIONS.find((option) => option.level === attention)?.label}`}
              onClick={() => setAttentionPickerId((openId) => openId === w.id ? null : w.id)}
            >
              <span className={`mh-watch-attention-swatch attention-${attention}`} aria-hidden="true" />
            </button>
            {attentionOpen && <div className="mh-watch-attention-menu" role="group" aria-label="选择关注度">
              {WATCH_ATTENTION_OPTIONS.map((option) => (
                <button
                  key={option.level}
                  type="button"
                  className={attention === option.level ? "selected" : ""}
                  aria-label={`${option.level}，${option.label}`}
                  aria-pressed={attention === option.level}
                  title={`${option.level} · ${option.label}`}
                  disabled={busy}
                  onClick={() => {
                    setAttentionPickerId(null);
                    if (attention !== option.level) saveWatchAttention(w.id, option.level);
                  }}
                >
                  <span className={`mh-watch-attention-swatch attention-${option.level}`}>{option.level}</span>
                </button>
              ))}
            </div>}
          </div>
          <span className={`mh-queue-pill ${queueStatus}`}>{jobLabel}</span>
          <button
            className="mh-icon"
            aria-label={`编辑关注 ${w.name}`}
            onClick={() => setModal({ type: "watch", item: w })}
          ><Pencil size={15} /></button>
          <button
            className="mh-icon"
            aria-label={`删除关注 ${w.name}`}
            onClick={() => remove("watchlist", w)}
          ><Trash2 size={15} /></button>
        </header>
        <div className="mh-watch-prices">
          <div>
            <small>当前报价</small>
            <strong>{price == null ? "等待更新" : money(price, quoteCurrency)}</strong>
            <small>{holdingQuoteLabel({ ...w, priceSource: "" })}</small>
          </div>
          <label>
            <small>等待股价 · {quoteCurrency}</small>
            <input
              type="number"
              min="0.01"
              step="any"
              aria-label={`${w.symbol || w.name} 等待股价`}
              placeholder="输入价格"
              value={targetDraft}
              onChange={(event) => setWatchTargetDrafts((drafts) => ({ ...drafts, [w.id]: event.target.value }))}
              onBlur={() => {
                const draft = watchTargetDrafts[w.id];
                if (draft === undefined) return;
                setWatchTargetDrafts((drafts) => { const next = { ...drafts }; delete next[w.id]; return next; });
                if ((draft === "" ? null : Number(draft)) !== (targetPrice ?? null)) saveWatchTarget(w.id, draft);
              }}
              onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
            />
          </label>
          <div className={`mh-watch-distance ${distance === 0 ? "touched" : ""}`}>
            <small>等待价差</small>
            <strong>{distance == null ? "—" : `${distance.toFixed(2)}%`}</strong>
            {distance === 0 && <span>已触及</span>}
          </div>
        </div>
        <footer>
          <span className="mh-watch-quote-source">
            {w.priceSourceUrl ? <a href={w.priceSourceUrl} target="_blank" rel="noopener noreferrer">{w.priceSource || "行情来源"}</a> : w.priceSource || "价格与研究由更新任务回填"}
          </span>
          {w.report && <button className="mh-text-button" onClick={() => openReport(w.report)}><FileCode2 size={14} /> 打开完整研究</button>}
        </footer>
      </article>
    );
  };
  return (
    <div
      className={`mh-app ${left ? "" : "left-closed"} ${right ? "" : "right-closed"}`}
    >
      <aside className="mh-sidebar">
        <div className="mh-brand-row">
          <a
            className="mh-brand"
            href="#/app/my-holdings"
            onClick={() => page("overview")}
          >
            <span>
              <Sprout size={23} />
            </span>
            {left && (
              <div>
                <strong>My Holdings</strong>
                <small>我的持仓室</small>
              </div>
            )}
          </a>
          <button
            className="mh-side-toggle"
            aria-label={left ? "折叠左栏" : "展开左栏"}
            onClick={() => toggle("left")}
          >
            {left ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
        </div>
        <div className="mh-nav-label">{left ? "投资工作空间" : "···"}</div>
        <nav>
          {NAV.map(([key, label, Icon]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => page(key)}
              title={label}
            >
              <Icon size={19} />
              {left && (
                <>
                  <span>{label}</span>
                  {key === "watch" && state.watchlist.length > 0 && (
                    <small>{state.watchlist.length}</small>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
        {left && (
          <div className="mh-side-quote">
            <Sprout size={23} strokeWidth={1.3} />
            <p>
              好投资，
              <br />
              从看清自己开始。
            </p>
            <small>慢一点，也可以走很远。</small>
          </div>
        )}
        <footer>
          <button
            onClick={() => {
              setAccountNames(structuredClone(state.accounts));
              setModal({ type: "settings" });
            }}
            title="账户与数据"
          >
            <Settings2 size={18} />
            {left && <span>账户与数据</span>}
          </button>
          {left && (
            <small>
              <i /> 本地文件存储
            </small>
          )}
        </footer>
      </aside>
      <div className="mh-workspace">
        <header className="mh-topbar">
          <div className="mh-breadcrumb">
            个人投资 <ChevronRight size={13} />
            <strong>{NAV.find((n) => n[0] === tab)[1]}</strong>
          </div>
          <div>
            <span className="mh-saved">
              <ShieldCheck size={14} />
              {busy ? "保存中…" : "本地已保存"}
            </span>
            <button
              className="mh-icon"
              aria-label="刷新持仓数据"
              onClick={async () => {
                await refresh();
                notify("已重新读取本地文件");
              }}
            >
              <RefreshCw size={16} />
            </button>
            <button
              className="mh-icon"
              aria-label={right ? "折叠右栏" : "展开右栏"}
              onClick={() => toggle("right")}
            >
              {right ? (
                <PanelRightClose size={18} />
              ) : (
                <PanelRightOpen size={18} />
              )}
            </button>
            <span className="mh-avatar">D</span>
          </div>
        </header>
        <main className="mh-main">
          {tab === "overview" && (
            <>
              {heading(
                "YOUR WEALTH, WITH INTENTION",
                "看清当下，从容向前。",
                "两个账户，一幅完整的投资图景。",
                <button
                  className="mh-primary"
                  onClick={() => setModal({ type: "holding" })}
                >
                  <Plus size={17} /> 记录买入
                </button>,
              )}
              {stats()}
              <div className="mh-overview-grid">
                <section className="mh-panel">
                  <div className="mh-section-heading">
                    <div>
                      <h2>组合全景</h2>
                      <p>跨账户合并 · 按已折算市值</p>
                    </div>
                    <span className="mh-tag">USD</span>
                  </div>
                  <Allocation groups={m.groups} value={m.value} />
                  <div className="mh-panel-bottom">
                    <span>持仓总成本</span>
                    <strong>{money(m.cost)}</strong>
                  </div>
                </section>
                <section className="mh-panel mh-insight-card">
                  <div className="mh-section-heading">
                    <div>
                      <span className="mh-eyebrow">A LITTLE CLARITY</span>
                      <h2>今天，先看这几件事</h2>
                    </div>
                    <Sparkles size={22} />
                  </div>
                  {notes.slice(0, 3).map((n, i) => (
                    <div className="mh-insight" key={n.title}>
                      <span>0{i + 1}</span>
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.text}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    className="mh-text-button"
                    onClick={() => page("analysis")}
                  >
                    查看组合分析 <ArrowRight size={15} />
                  </button>
                </section>
              </div>
              <section className="mh-panel">
                <div className="mh-section-heading">
                  <div>
                    <h2>我的持仓</h2>
                    <p>按账户分别累计股数与成本；报价保留日期与来源</p>
                  </div>
                  <button
                    className="mh-text-button"
                    onClick={() => page("holdings")}
                  >
                    管理全部 <ArrowRight size={14} />
                  </button>
                </div>
                {holdingsTable(visibleHoldings, 7)}
              </section>
              <div className="mh-bottom-note">
                <ShieldCheck size={14} /> 无虚构收益曲线 · 无自动交易 ·
                每一次判断都有据可查
              </div>
            </>
          )}
          {tab === "holdings" && (
            <>
              {heading(
                "THE POSITIONS YOU OWN",
                "我的持仓",
                "",
                <div className="mh-heading-actions">
                  <label className="mh-search">
                    <Search size={16} />
                    <input aria-label="搜索持仓" placeholder="代码、名称、分类" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </label>
                  <button className="mh-button" onClick={refreshPrices} title="加入待办；实际执行时，常规交易时段取盘中价，其余时间取最近交易日收盘价" disabled={state.jobs.some((j) => j.kind === "quotes" && j.status === "waiting")}>
                    <RefreshCw size={15} />
                    {state.jobs.some((j) => j.kind === "quotes" && j.status === "waiting") ? "价格已排队" : "刷新价格"}
                  </button>
                  <button className="mh-primary" onClick={() => setModal({ type: "holding" })}>
                    <Plus size={17} /> 记录买入
                  </button>
                </div>,
              )}
              {stats(m)}
              <div className="mh-account-stack">
                {state.accounts.map((a, index) => {
                  const rows = visibleHoldings.filter((h) => h.accountId === a.id);
                  const total = rows.reduce((sum, h) => sum + (h.marketValue || 0), 0);
                  return (
                    <section className={`mh-panel mh-account-section account-tone-${index % 2}`} key={a.id}>
                      <div className="mh-account-heading">
                        <div><span className="mh-account-mark" /><div><span className="mh-eyebrow">ACCOUNT {index + 1}</span><h2>{a.name}</h2></div><span className="mh-tag">{rows.length} 项</span></div>
                        <div className="mh-account-total"><small>当前市值</small><strong>{money(total)}</strong><button className="mh-text-button" onClick={() => setModal({ type: "holding", accountId: a.id })}><Plus size={14} /> 记录买入</button></div>
                      </div>
                      {holdingsTable(rows)}
                    </section>
                  );
                })}
              </div>
              <div className="mh-panel-bottom holdings-export">
                <button className="mh-text-button" onClick={() => download("my-holdings.csv", "\uFEFF" + [["账户","代码","名称","币种","股数","当前价格","成本均价","报价日期","总成本","总市值","浮盈亏"].join(","), ...m.holdings.map((h) => [state.accounts.find((a) => a.id === h.accountId)?.name,h.symbol,h.name,h.currency,h.quantity,h.price,h.averagePrice,h.priceDate,h.cost,h.marketValue,h.marketValue-h.cost].map((v) => '"'+String(v ?? "").replace(/^[=+@-]/,"'").replaceAll('"','""')+'"').join(","))].join("\r\n"), "text/csv;charset=utf-8")}>导出 CSV <Download size={14} /></button>
              </div>
            </>
          )}
          {tab === "watch" && (
            <>
              {heading(
                "GOOD IDEAS CAN WAIT",
                "近期关注",
                "",
                <div className="mh-heading-actions mh-watch-heading-actions">
                  <label className="mh-search">
                    <Search size={16} />
                    <input aria-label="搜索关注标的" placeholder="搜索关注…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </label>
                  <div className="mh-watch-sort-switch" role="group" aria-label="关注标的排序方式" data-active={watchSort}>
                    <span className="mh-watch-sort-indicator" aria-hidden="true" />
                    {WATCH_SORT_OPTIONS.map((option) => (
                      <button key={option.id} type="button" title={option.title} aria-pressed={watchSort === option.id} onClick={() => setWatchSortMode(option.id)}>{option.label}</button>
                    ))}
                  </div>
                  <button className="mh-primary" onClick={() => setModal({ type: "watch" })}>
                    <Plus size={17} /> 添加关注
                  </button>
                  <button
                    className="mh-button"
                    onClick={refreshWatchlist}
                    title="刷新全部关注价格；交易时段取盘中价，其余时间取最近收盘价。仅缺少完整研究的标的补充首次研究。"
                    disabled={watchRefreshBusy || !state.watchlist.length}
                  >
                    {watchRefreshBusy ? <LoaderCircle size={15} className="mh-spin" /> : watchRefreshPending ? <Undo2 size={15} /> : <RefreshCw size={15} />}
                    {watchRefreshBusy ? "处理中…" : watchRefreshPending ? "撤销本次刷新" : "刷新关注"}
                  </button>
                </div>,
              )}
              {visibleWatchlist.length ? <div className="mh-watch-categories">
                <section className="mh-watch-category mh-watch-category-funds">
                  <header><div><span className="mh-watch-category-mark" /><h2>指数 / ETF</h2></div><span>{watchFunds.length} 项</span></header>
                  {watchFunds.length ? <div className="mh-watch-grid">{watchFunds.map(renderWatchCard)}</div> : <p className="mh-watch-category-empty">没有匹配的指数或 ETF</p>}
                </section>
                <section className="mh-watch-category mh-watch-category-stocks">
                  <header>
                    <div><span className="mh-watch-category-mark" /><h2>个股</h2></div>
                    <div className="mh-watch-category-meta">
                      <span>{watchStocks.length} 项</span>
                      {watchStocks.length > collapsedWatchStockLimit && <button
                        type="button"
                        className="mh-text-button mh-watch-expand"
                        aria-expanded={showAllWatchStocks}
                        aria-label={showAllWatchStocks ? "收起个股列表" : "展开个股列表"}
                        title={showAllWatchStocks ? "收起个股列表" : "展开个股列表"}
                        onClick={() => setShowAllWatchStocks((expanded) => !expanded)}
                      >
                        <ChevronDown size={13} className={showAllWatchStocks ? "is-expanded" : ""} />
                        {showAllWatchStocks ? "收起" : "展开"}
                      </button>}
                    </div>
                  </header>
                  {watchStocks.length ? <>
                    <div className="mh-watch-grid" ref={watchStockGridRef}>{visibleWatchStocks.map(renderWatchCard)}</div>
                  </> : <p className="mh-watch-category-empty">没有匹配的个股</p>}
                </section>
              </div> : state.watchlist.length ? (
                <Empty icon={Search} title="没有匹配的关注标的" text="调整搜索词后，这里会显示完整分类清单。" />
              ) : null}
              {!state.watchlist.length && (
                <Empty
                  icon={Star}
                  title="让好公司，先进入你的视野"
                  text="只需填写名字或代码。价格、估值和行动条件，留给研究慢慢厘清。"
                  action={
                    <button
                      className="mh-primary"
                      onClick={() => setModal({ type: "watch" })}
                    >
                      <Plus size={16} /> 添加第一个关注
                    </button>
                  }
                />
              )}
            </>
          )}
          {tab === "converter" && (
            <>
              {heading(
                "PRICE PAIR ESTIMATOR",
                "换算工具",
                "VOO 与 QQQM 的美元参考价，换算成对应的爱尔兰 UCITS ETF 价格。",
                <button
                  className="mh-primary"
                  onClick={refreshConverter}
                  disabled={state.jobs.some((job) => job.kind === "converter" && job.status === "waiting")}
                >
                  {state.jobs.some((job) => job.kind === "converter" && job.status === "waiting")
                    ? <LoaderCircle size={15} className="mh-spin" />
                    : <RefreshCw size={15} />}
                  {state.jobs.some((job) => job.kind === "converter" && job.status === "waiting")
                    ? "公式更新已排队"
                    : "请求更新公式"}
                </button>,
              )}
              <ConverterPage converter={state.converter} />
            </>
          )}
          {tab === "analysis" && (
            <>
              {heading(
                "UNDERSTAND BEFORE YOU ACT",
                "组合分析",
                "当前风险体检 · Codex 深度研究",
                <button
                  className="mh-primary"
                  disabled={state.jobs.some((j) => j.kind === "portfolio" && j.status === "waiting")}
                  onClick={() => queueTask("portfolio", null, question || "今日持仓体检：结合当前两个账户的全部持仓、最新可核实行情和公司信息，复核集中度、重叠风险、宏观与个股风险、现金弹药及我的目标；给出支持与反证、需要观察的触发条件和保持不动的方案，生成完整 HTML 报告。")}
                >
                  <Sparkles size={17} />
                  {state.jobs.some((j) => j.kind === "portfolio" && j.status === "waiting") ? "体检已排队" : "今日持仓体检"}
                </button>,
              )}
              <section className="mh-panel mh-queue-summary">
                <div><span className="mh-eyebrow">CODEX QUEUE</span><h2>待办状态</h2><p>应用保存任务和资料；是否执行由你下次给 Codex 的指令决定。</p></div>
                <div className="mh-queue-counts">
                  <span><strong>{state.jobs.filter((j) => j.status === "waiting").length}</strong>等待做</span>
                  <span><strong>{state.jobs.filter((j) => j.status === "done").length}</strong>已完成</span>
                  <span><strong>{state.jobs.filter((j) => j.status === "failed").length}</strong>未完成</span>
                </div>
                <button className="mh-button" onClick={copyQueue}><Copy size={15} /> 复制待办给 Codex</button>
              </section>
              <div className="mh-overview-grid">
                <section className="mh-panel">
                  <div className="mh-section-heading">
                    <div>
                      <h2>配置与集中度</h2>
                      <p>本地计算 · 非 AI 预测</p>
                    </div>
                  </div>
                  <Allocation groups={m.groups} value={m.value} />
                  <div className="mh-panel-bottom">
                    按证券代码统计；未获取 ETF
                    最新成分股，不代表穿透后的行业权重。
                  </div>
                </section>
                <section className="mh-panel">
                  <div className="mh-section-heading">
                    <div>
                      <h2>如果市场回撤…</h2>
                      <p>统一价格冲击 · 汇率与现金保持不变</p>
                    </div>
                    <Gauge size={22} />
                  </div>
                  <div className="mh-stress">
                    <span>
                      持仓价格下跌 <strong>{stress}%</strong>
                    </span>
                    <input
                      aria-label="压力测试跌幅"
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={stress}
                      onChange={(e) => setStress(Number(e.target.value))}
                    />
                    <div>
                      <span>潜在市值损失</span>
                      <strong className="mh-loss">
                        −{money((m.value * stress) / 100)}
                      </strong>
                    </div>
                    <div>
                      <span>压力后的持仓市值</span>
                      <strong>{money(m.value * (1 - stress / 100))}</strong>
                    </div>
                    <div>
                      <span>含已折算现金的资产</span>
                      <strong>
                        {money(m.value * (1 - stress / 100) + m.cash)}
                      </strong>
                    </div>
                    <p>
                      {state.goals.objective || state.goals.notes
                        ? `你的目标：${(state.goals.objective || state.goals.notes).slice(0, 100)}`
                        : "尚未填写目标；当前滑块仅用于情景演示。"}
                      这是假设情景，不是损失概率或最大风险估计。
                    </p>
                  </div>
                </section>
              </div>
              <section className="mh-panel">
                <div className="mh-section-heading">
                  <div>
                    <h2>组合体检</h2>
                    <p>根据你已保存的数据自动检查</p>
                  </div>
                  <ShieldCheck size={20} />
                </div>
                <div className="mh-health-grid">
                  {notes.map((n) => (
                    <article className={`mh-health ${n.tone}`} key={n.title}>
                      <span className="mh-dot" />
                      <div>
                        <h3>{n.title}</h3>
                        <p>{n.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              {latest ? (
                <section className="mh-panel mh-report-synopsis">
                  <div className="mh-section-heading">
                    <div>
                      <span className="mh-eyebrow">最近一次持仓体检 · {when(latest.date)}</span>
                      <h2>{latest.research.title}</h2>
                    </div>
                    <button className="mh-button" onClick={() => openReport(latest.report)}><FileCode2 size={15} /> 打开完整报告</button>
                  </div>
                  <p>{latest.research.summary}</p>
                </section>
              ) : (
                <section className="mh-panel mh-report-synopsis empty">
                  <div><Sparkles size={19} /><strong>还没有持仓体检报告</strong><span>点击「今日持仓体检」后，报告会排入 Codex 待办。</span></div>
                  <button className="mh-text-button" onClick={copyQueue}><Copy size={14} /> 复制待办给 Codex</button>
                </section>
              )}
            </>
          )}
          {tab === "cash" && (
            <>
              {heading(
                "CAPITAL WITH A PURPOSE",
                "弹药与目标",
                "",
                <button
                  className="mh-primary"
                  onClick={() => setModal({ type: "cash" })}
                >
                  <Plus size={17} /> 记一笔资金
                </button>,
              )}
              <div className="mh-cash-grid">
                <section className="mh-capital-card">
                  <span className="mh-eyebrow">READY WHEN YOU ARE</span>
                  <h2>可部署弹药</h2>
                  <strong>
                    {state.cash.length ? money(m.available) : "待录入"}
                  </strong>
                  <p>已记录的 USD 可投资金</p>
                  <small>工资或其他收入随到随记；这是手工资金池，不是券商实时余额。</small>
                </section>
                <section className="mh-panel">
                  <div className="mh-section-heading">
                    <div>
                      <h2>我的目标</h2>
                    </div>
                    <button
                      className="mh-icon"
                      aria-label="编辑投资目标"
                      onClick={() => setModal({ type: "goals" })}
                    >
                      <Pencil size={17} />
                    </button>
                  </div>
                  <div className="mh-goal">
                    <p className="mh-objective-text">{state.goals.objective || state.goals.notes || "尚未填写目标"}</p>
                  </div>
                </section>
              </div>
              <section className="mh-panel">
                <div className="mh-section-heading">
                  <div>
                    <h2>资金流水</h2>
                    <p>多笔收入合并管理；投资拨款请记为支出</p>
                  </div>
                  <span className="mh-tag">{state.cash.length} 笔</span>
                </div>
                {state.cash.length ? (
                  <div className="mh-table-wrap">
                    <table className="mh-table">
                      <thead>
                        <tr>
                          <th>来源 / 用途</th>
                          <th>日期</th>
                          <th>金额</th>
                          <th>备注</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...state.cash]
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((c) => (
                            <tr key={c.id}>
                              <td>
                                <div className="mh-asset">
                                  <span className="mh-ticker">
                                    {c.amount > 0 ? (
                                      <ArrowDownLeft size={19} />
                                    ) : (
                                      <ArrowUpRight size={19} />
                                    )}
                                  </span>
                                  <strong>{c.kind}</strong>
                                </div>
                              </td>
                              <td>{c.date}</td>
                              <td
                                className={c.amount > 0 ? "mh-gain" : "mh-loss"}
                              >
                                {c.amount > 0 ? "+" : ""}
                                {money(c.amount, c.currency)}
                              </td>
                              <td className="mh-cell-note">{c.note || "—"}</td>
                              <td>
                                <div className="mh-row-actions">
                                  <button
                                    className="mh-icon"
                                    aria-label={`编辑资金 ${c.kind}`}
                                    onClick={() =>
                                      setModal({ type: "cash", item: c })
                                    }
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    className="mh-icon"
                                    aria-label={`删除资金 ${c.kind}`}
                                    onClick={() => remove("cash", c)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty
                    icon={CircleDollarSign}
                    title="把第一笔弹药放进来"
                    text="工资、奖金或其他可投资收入，随到随记。应急资金在目标中单独预留。"
                  />
                )}
              </section>
            </>
          )}
          {tab === "reports" && (
            <Reports
              notify={notify}
              revision={state.analyses.length}
            />
          )}
          {tab === "ai" && (
            <>
              {heading(
                "A BETTER SECOND OPINION",
                "AI 工作台",
                "收好完整背景和待办；你交给 Codex 后，它再联网研究并保存 HTML。",
              )}
              <div className="mh-ai-flow">
                <span>
                  <b>01</b> 选问题
                </span>
                <ArrowRight size={17} />
                <span>
                  <b>02</b> AI 研究
                </span>
                <ArrowRight size={17} />
                <span>
                  <b>03</b> 保存 HTML
                </span>
                <ArrowRight size={17} />
                <span>
                  <b>04</b> 行动与复盘
                </span>
              </div>
              <section className="mh-panel">
                <div className="mh-section-heading">
                  <div>
                    <h2>把背景交给 AI</h2>
                    <p>持仓与任务保存为工作区文件，可随 NodeApps GitHub 同步到其他电脑。</p>
                  </div>
                  <Sparkles size={23} />
                </div>
                <div className="mh-form-grid">
                  <Field label="研究方向">
                    <select
                      value={aiKind}
                      onChange={(e) => setAiKind(e.target.value)}
                    >
                      <option value="portfolio">持仓与资金安排</option>
                      <option value="market">行情与组合适配</option>
                    </select>
                  </Field>
                  <Field label="复制给哪位 AI">
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                    >
                      {["ChatGPT", "Claude", "Gemini", "Codex", "其他 AI"].map(
                        (p) => (
                          <option key={p}>{p}</option>
                        ),
                      )}
                    </select>
                  </Field>
                </div>
                <Field label="这一次，你最关心什么？">
                  <textarea
                    rows={4}
                    maxLength={4000}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：下一笔工资到账后，怎样配置才能避免科技股敞口继续增加？请包含继续等待的方案。"
                  />
                </Field>
                <div className="mh-ai-actions">
                  <button
                    className="mh-primary"
                    onClick={() => queueTask(aiKind, null, question || "请结合当前持仓、资金与目标完成研究，并生成带来源的 HTML。")}
                  >
                    <Sparkles size={17} /> 排入 Codex 待办
                  </button>
                  <button className="mh-button" onClick={() => copy()}>
                    <Copy size={16} /> 复制完整资料给 {provider}
                  </button>
                  <button className="mh-button" onClick={copyQueue}>
                    <Copy size={16} /> 复制全部待办给 Codex
                  </button>
                  <button className="mh-button" onClick={() => page("reports")}>
                    <Upload size={16} /> 保存 AI 返回的 HTML
                  </button>
                </div>
                <p className="mh-help">
                  待办不会自行运行。复制给不同 AI 只在你点击时复制文本；返回的 HTML 可导入档案，Codex 完成任务后也会回写状态。
                </p>
              </section>
              <section className="mh-panel">
                <div className="mh-section-heading">
                  <div>
                    <h2>研究任务与成果</h2>
                  </div>
                </div>
                <div className="mh-job-columns">
                  <section className="mh-job-column">
                    <div className="mh-job-column-heading">
                      <h3>待办</h3>
                      {waitingJobs.length > 5 && (
                        <button className="mh-job-toggle" type="button" aria-expanded={showAllWaitingJobs} aria-controls="mh-waiting-jobs" onClick={() => setShowAllWaitingJobs((value) => !value)}>
                          {showAllWaitingJobs ? "收起" : `展开其余 ${waitingJobs.length - 5} 项`} <ChevronDown size={13} />
                        </button>
                      )}
                    </div>
                    <div id="mh-waiting-jobs">
                      {waitingJobs.length ? waitingJobs.slice().reverse().slice(0, showAllWaitingJobs ? waitingJobs.length : 5).map((j) => (
                        <div className="mh-job" key={j.id}>
                          <span className={`mh-job-icon ${j.status}`}>
                            {j.status === "failed" ? <X size={17} /> : <LoaderCircle size={17} />}
                          </span>
                          <div>
                            <strong>{j.kind === "watch" ? `研究 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "关注标的"}` : j.kind === "watch-quotes" ? `关注价格 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "标的"}` : j.kind === "market" ? "行情研究" : j.kind === "quotes" ? "持仓价格更新" : j.kind === "converter" ? "换算公式更新" : "持仓分析"}</strong>
                            <small>{when(j.date)} · {j.status === "failed" ? `未完成${j.error ? ` · ${j.error}` : ""}` : "等待交给 Codex"}</small>
                          </div>
                        </div>
                      )) : <p className="mh-job-empty">当前没有待办</p>}
                    </div>
                  </section>
                  <section className="mh-job-column">
                    <div className="mh-job-column-heading">
                      <h3>最近完成</h3>
                      {completedJobs.length > 5 && (
                        <button className="mh-job-toggle" type="button" aria-expanded={showAllCompletedJobs} aria-controls="mh-completed-jobs" onClick={() => setShowAllCompletedJobs((value) => !value)}>
                          {showAllCompletedJobs ? "收起" : `展开其余 ${completedJobs.length - 5} 项`} <ChevronDown size={13} />
                        </button>
                      )}
                    </div>
                    <div id="mh-completed-jobs">
                      {completedJobs.length ? completedJobs.slice(0, showAllCompletedJobs ? completedJobs.length : 5).map((j) => (
                        <div className="mh-job" key={j.id}>
                          <span className="mh-job-icon done"><CheckCircle2 size={17} /></span>
                          <div>
                            <strong>{j.kind === "watch" ? `研究 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "关注标的"}` : j.kind === "watch-quotes" ? `关注价格 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "标的"}` : j.kind === "market" ? "行情研究" : j.kind === "quotes" ? "持仓价格更新" : j.kind === "converter" ? "换算公式更新" : "持仓分析"}</strong>
                            <small>{when(j.completedAt || j.date)} · 已完成并保存</small>
                          </div>
                          {j.report && <button className="mh-icon" aria-label="打开报告" onClick={() => openReport(j.report)}><ArrowUpRight size={15} /></button>}
                        </div>
                      )) : <p className="mh-job-empty">完成的任务会出现在这里</p>}
                    </div>
                  </section>
                </div>
              </section>
              {allAnalyses.length > 0 && (
                <section className="mh-panel">
                  <div className="mh-section-heading mh-history-heading">
                    <h2>研究记录</h2>
                    <span className="mh-tag">{allAnalyses.length} 份</span>
                    <button className="mh-text-button" onClick={() => setShowAllResearch((v) => !v)}>
                      {showAllResearch ? "收起" : `展开全部 ${allAnalyses.length} 份`} <ChevronDown size={14} className={showAllResearch ? "rotated" : ""} />
                    </button>
                  </div>
                  {(showAllResearch ? allAnalyses : allAnalyses.slice(0, 3)).map((a) => (
                    <button
                      className="mh-history"
                      key={a.id}
                      onClick={() => openReport(a.report)}
                    >
                      <FileCode2 size={20} />
                      <span>
                        <strong>{a.research.title}</strong>
                        <small>
                          {when(a.date)} · {a.research.summary.slice(0, 70)}
                        </small>
                      </span>
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                  {!showAllResearch && allAnalyses.length > 3 && <p className="mh-history-more">其余 {allAnalyses.length - 3} 份已折叠</p>}
                </section>
              )}
            </>
          )}
          {tab === "journal" && (
            <>
              {heading(
                "REMEMBER WHY YOU DECIDED",
                "决策日志",
                "记下当时的理由，让未来的自己有据可循。",
                <button
                  className="mh-primary"
                  onClick={() => setModal({ type: "journal" })}
                >
                  <Plus size={17} /> 写一条决策
                </button>,
              )}
              {state.journal.length ? (
                <div className="mh-journal-list">
                  {[...state.journal]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((j) => (
                      <article className="mh-panel" key={j.id}>
                        <div className="mh-section-heading">
                          <div>
                            <span className="mh-eyebrow">{j.date}</span>
                            <h2>{j.title}</h2>
                          </div>
                          <div className="mh-row-actions">
                            <button
                              className="mh-icon"
                              aria-label={`编辑日志 ${j.title}`}
                              onClick={() =>
                                setModal({ type: "journal", item: j })
                              }
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="mh-icon"
                              aria-label={`删除日志 ${j.title}`}
                              onClick={() => remove("journal", j)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mh-prose">{j.body}</div>
                      </article>
                    ))}
                </div>
              ) : (
                <Empty
                  icon={BookOpen}
                  title="投资，也是认识自己的过程"
                  text="买入、继续持有、放弃一个机会，都值得留下一句为什么。"
                  action={
                    <button
                      className="mh-primary"
                      onClick={() => setModal({ type: "journal" })}
                    >
                      写下第一条判断
                    </button>
                  }
                />
              )}
            </>
          )}
        </main>
      </div>
      {right && (
        <RightPanel
          tab={tab}
          state={state}
          portfolio={m}
          reports={portfolioReports}
          allAnalyses={allAnalyses}
          notes={notes}
          holding={tab === "holdings" ? focus : null}
          watch={watchFocus}
          watchPriorities={watchPriorities}
          yesterdayWatchRanks={yesterdayWatchRanks}
          onClose={() => toggle("right")}
          onNavigate={page}
          onSelectWatch={selectWatch}
          onOpenReport={openReport}
          onEdit={(form) => setModal(form)}
          onRefreshPrices={refreshPrices}
          onQueueTask={queueTask}
          onRefreshConverter={refreshConverter}
          converterPending={state.jobs.some((job) => job.kind === "converter" && job.status === "waiting")}
          onCopyQueue={copyQueue}
        />
      )}
      {toast && (
        <div
          className={`mh-toast ${toast.error ? "error" : ""}`}
          role={toast.error ? "alert" : "status"}
        >
          {toast.error ? <X size={17} /> : <Check size={17} />}
          <span>{toast.text}</span>
          <button aria-label="关闭提示" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}
      {modal && (
        <Modal
          title={
            {
              holding: modal.item ? "修正持仓" : "记录买入",
              watch: modal.item ? "编辑关注" : "添加一个关注",
              cash: modal.item ? "编辑资金流水" : "记一笔资金",
              goals: "投资目标",
              journal: modal.item ? "编辑决策" : "写下一个判断",
              delete: "删除这条记录",
              research: "标的研究",
              importResearch: "导入 AI 研究",
              priceAlerts: "等待股价触发",
              settings: "账户与数据",
              restore: "恢复数据备份",
              copy: "复制研究资料",
            }[modal.type]
          }
          onClose={() => {
            if (!busy) setModal(null);
          }}
          wide={[
            "holding",
            "research",
            "goals",
            "copy",
            "importResearch",
          ].includes(modal.type)}
        >
          {modal.type === "priceAlerts" && (
            <div className="mh-price-alerts">
              <p>以下关注标的的最近保存价格已达到或低于等待股价。</p>
              {modal.items.map((w) => (
                <div className="mh-price-alert" key={w.id}>
                  <span className="mh-ticker">{(w.symbol || w.name).slice(0, 2)}</span>
                  <div><strong>{w.symbol || w.name}</strong><small>当前 {money(w.price, w.priceCurrency || w.research?.quote?.currency || "USD")} · 等待 {money(w.targetPrice, w.priceCurrency || w.research?.quote?.currency || "USD")} · 报价日期 {w.priceDate || "未知"}</small></div>
                  <button className="mh-text-button" onClick={() => { setSelectedWatchId(w.id); setModal(null); page("watch"); }}>查看 <ArrowRight size={13} /></button>
                </div>
              ))}
              <p className="mh-help">这是最近一次保存的报价触发提醒；需要最新报价时，请在「近期关注」点击更新。</p>
            </div>
          )}
          {modal.type === "holding" && (modal.item ? (
            <HoldingForm
              item={modal.item}
              accounts={state.accounts}
              defaultAccountId={modal.accountId}
              busy={busy}
              onSave={(v) => upsert("holdings", v)}
            />
          ) : <BuyForm holding={modal.buyHolding} holdings={state.holdings} accounts={state.accounts} defaultAccountId={modal.accountId} busy={busy} onSave={recordBuy} />)}
          {modal.type === "watch" && (
            <WatchForm
              item={modal.item}
              busy={busy}
              onSave={async (v) => {
                const success = await upsert("watchlist", v);
                if (success && !modal.item) {
                  const queued = await request("/api/jobs/batch-watch", { jobs: [{ watchId: v.id }], origin: "watch-add" }).then((result) => { setState(result.state); stateRef.current = result.state; notify("已加入价格更新与首次研究待办"); return true; }).catch((error) => { notify(error.message, true); return false; });
                  if (!queued) await refresh();
                }
              }}
            />
          )}
          {modal.type === "cash" && (
            <CashForm
              item={modal.item}
              busy={busy}
              onSave={(v) => upsert("cash", v)}
            />
          )}
          {modal.type === "goals" && (
            <GoalsForm
              state={state}
              busy={busy}
              onSave={(v) => mutate((s) => Object.assign(s, v))}
            />
          )}
          {modal.type === "journal" && (
            <JournalForm
              item={modal.item}
              busy={busy}
              onSave={(v) => upsert("journal", v)}
            />
          )}
          {modal.type === "delete" && (
            <>
              <p>
                删除「
                {modal.item.symbol ||
                  modal.item.name ||
                  modal.item.kind ||
                  modal.item.title}
                」？每次保存前会自动保留数据备份。
              </p>
              <footer className="mh-form-footer">
                <button className="mh-button" onClick={() => setModal(null)}>
                  取消
                </button>
                <button
                  className="mh-danger"
                  disabled={busy}
                  onClick={() =>
                    mutate((s) => {
                      s[modal.key] = s[modal.key].filter(
                        (r) => r.id !== modal.item.id,
                      );
                      if (modal.key === "watchlist") {
                        for (const job of s.jobs)
                          if (job.watchId === modal.item.id && job.status === "waiting") {
                            job.status = "failed";
                            job.error = "关注标的已删除，任务已取消。";
                          }
                      }
                    })
                  }
                >
                  删除记录
                </button>
              </footer>
            </>
          )}
          {modal.type === "research" && (
            <>
              {modal.item.research ? (
                <ResearchBody
                  research={modal.item.research}
                  date={modal.item.researchedAt}
                  onReport={
                    modal.item.report
                      ? () => openReport(modal.item.report)
                      : null
                  }
                />
              ) : (
                <Empty
                  icon={Sparkles}
                  title={modal.item.name}
                  text="此标的已保存为待办；执行研究后，摘要和报告会回填到这里。"
                />
              )}
              <div className="mh-ai-actions">
                <button
                  className="mh-button"
                  onClick={() => copy("watch", modal.item)}
                >
                  <Copy size={15} /> 复制给 AI
                </button>
                <button
                  className="mh-button"
                  onClick={() => {
                    setImportText("");
                    setModal({ type: "importResearch", item: modal.item });
                  }}
                >
                  <Upload size={15} /> 导入研究 JSON
                </button>
                <button
                  className="mh-primary"
                  onClick={() => queueTask("watch", modal.item.id, watchResearchQuestion(modal.item, true), { refreshResearch: true })}
                >
                  <Sparkles size={15} /> 更新完整研究
                </button>
              </div>
            </>
          )}
          {modal.type === "importResearch" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const research = JSON.parse(
                    importText.replace(/^```(?:json)?\s*|\s*```$/g, ""),
                  );
                  const s = await request("/api/research/import", {
                    watchId: modal.item.id,
                    research,
                  });
                  setState(s);
                  setModal(null);
                  notify("研究已回填，HTML 已自动保存");
                } catch (e) {
                  notify(e.message, true);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Field label="粘贴 AI 返回的完整研究 JSON">
                <textarea
                  className="mh-code"
                  rows={15}
                  required
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={
                    '{"title":"公司研究","summary":"简述","details":"完整研究","risks":[],"catalysts":[],"sources":[{"label":"官方来源","url":"https://..."}],"uncertainty":"待核实项"}'
                  }
                />
              </Field>
              <SaveButton busy={busy} label="回填卡片并保存报告" />
            </form>
          )}
          {modal.type === "settings" && (
            <>
              <h3>两个账户的名字</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate((s) => {
                    s.accounts = accountNames;
                  });
                }}
              >
                {accountNames?.map((a, i) => (
                  <Field key={a.id} label={`账户 ${i + 1}`}>
                    <input
                      required
                      maxLength={100}
                      value={a.name}
                      onChange={(e) =>
                        setAccountNames((rows) =>
                          rows.map((row) =>
                            row.id === a.id
                              ? { ...row, name: e.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Field>
                ))}
                <SaveButton busy={busy} label="保存账户名称" />
              </form>
              <hr />
              <h3>数据备份</h3>
              <p className="mh-help">
                JSON 备份包含持仓、资金、目标、日志和研究文字。HTML
                原文件与截图需一并复制整个 my_holdings 文件夹；服务端保留最近 30
                次修改前的 JSON。
              </p>
              <div className="mh-ai-actions">
                <button
                  className="mh-button"
                  onClick={() =>
                    download(
                      `my-holdings-${localDate()}.json`,
                      JSON.stringify(state, null, 2),
                    )
                  }
                >
                  <Download size={15} /> 导出 JSON 备份
                </button>
                <button
                  className="mh-button"
                  onClick={() => {
                    setImportText("");
                    setModal({ type: "restore" });
                  }}
                >
                  <Upload size={15} /> 恢复 JSON
                </button>
              </div>
              <h3>文件位置</h3>
              <p className="mh-help">
                <code>apps/my_holdings/data/state.json</code>
                <br />
                截图文字：
                <code>apps/my_holdings/holdings-transcription.md</code>
                <br />
                HTML：<code>apps/my_holdings/data/reports/</code>
              </p>
            </>
          )}
          {modal.type === "restore" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const s = await request("/api/restore", {
                    revision: state.revision,
                    state: JSON.parse(importText),
                  });
                  setState(s);
                  setModal(null);
                  notify("备份已恢复；恢复前的数据已自动备份");
                } catch (e) {
                  notify(e.message, true);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <p className="mh-help">
                恢复会替换当前记录。当前数据会先存入 backups；HTML
                原文件不会被替换。
              </p>
              <Field label="选择 JSON 备份">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 7000000) {
                        notify("备份文件过大", true);
                        return;
                      }
                      setImportText(await f.text());
                    }
                  }}
                />
              </Field>
              <Field label="或粘贴 JSON">
                <textarea
                  required
                  className="mh-code"
                  rows={10}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
              </Field>
              <SaveButton busy={busy} label="确认恢复这份备份" />
            </form>
          )}
          {modal.type === "copy" && (
            <>
              <p>浏览器未允许直接复制，请选择下面的资料手动复制。</p>
              <textarea
                className="mh-code"
                rows={16}
                readOnly
                value={importText}
                onFocus={(e) => e.target.select()}
              />
              <button
                className="mh-button"
                onClick={() =>
                  download("investment-context.md", importText, "text/markdown")
                }
              >
                <Download size={15} /> 下载资料包
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
