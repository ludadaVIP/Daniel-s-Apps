import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
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
  money,
  pct,
  id,
} from "./model.js";
import { BASE, request, download, localDate } from "./api.js";
import {
  Modal,
  Field,
  HoldingForm,
  WatchForm,
  CashForm,
  GoalsForm,
  JournalForm,
  SaveButton,
} from "./Forms.jsx";
import { Reports } from "./Reports.jsx";
const NAV = [
  ["overview", "总览", LayoutDashboard],
  ["holdings", "我的持仓", Wallet],
  ["watch", "近期关注", Star],
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
function Stat({ label, value, sub, negative = false, icon: Icon }) {
  return (
    <article className="mh-stat">
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
  onClose,
  onNavigate,
  onOpenReport,
  onEdit,
  onRefreshPrices,
  onQueueTask,
  onCopyQueue,
}) {
  const cash = state.cash.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const watchCurrency = watch?.research?.quote?.currency || watch?.research?.identity?.currency || "USD";
  const title = {
    overview: "今日摘要",
    holdings: holding ? "持仓详情" : "账户摘要",
    watch: "关注详情",
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
          <p className="mh-sidebar-objective">{state.marketUpdatedAt ? `收盘价最近更新于 ${when(state.marketUpdatedAt)}` : "当前显示初始截图价格"}</p>
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
          <small>持有 {holding.quantity} 股 · {holding.priceDate || "尚未刷新收盘价"}</small>
          <div className="mh-focus-prices">
            <span>当前价格<strong>{money(holding.price, holding.currency)}</strong></span>
            <span>成本均价<strong>{money(holding.averagePrice, holding.currency)}</strong></span>
          </div>
        </div>
        <section><button className="mh-button" onClick={() => onEdit({ type: "holding", item: holding })}><Pencil size={14} /> 编辑核心数据</button><button className="mh-text-button" onClick={() => onRefreshPrices()}><RefreshCw size={13} /> 请求更新收盘价</button></section>
      </> : <>
        <section className="mh-side-summary">
          <span className="mh-eyebrow">ACCOUNTS</span>
          <strong>{money(portfolio.value)}</strong>
          {state.accounts.map((a, index) => {
            const value = state.holdings.filter((h) => h.accountId === a.id).reduce((sum, h) => sum + Number(h.marketValue || 0), 0);
            return <div className="mh-side-account" key={a.id}><i className={`tone-${index % 2}`} /><span>{a.name}</span><b>{money(value)}</b></div>;
          })}
        </section>
        <section><h3>价格数据</h3><p className="mh-sidebar-objective">{state.marketUpdatedAt ? `上次收盘价更新：${when(state.marketUpdatedAt)}` : "当前为导入的截图记录"}</p><button className="mh-button" onClick={() => onRefreshPrices()}><RefreshCw size={14} /> 加入收盘价更新待办</button></section>
      </>)}
      {tab === "watch" && (watch ? <>
        <div className="mh-watch-focus">
          <span className="mh-ticker">{(watch.symbol || watch.name).slice(0, 2)}</span>
          <span className="mh-queue-pill">{watch.price != null ? `报价 ${watch.priceDate || "已更新"}` : "等待更新"}</span>
          <h2>{watch.symbol || watch.name}</h2><p>{watch.name}</p>
          <strong>{watch.price == null ? "等待更新" : money(watch.price, watch.research?.quote?.currency || "USD")}</strong>
          <small>{watch.priceSourceUrl ? <a href={watch.priceSourceUrl} target="_blank" rel="noopener noreferrer">{watch.priceSource || "行情来源"} · {watch.priceDate}</a> : watch.priceSource || "尚无来源"}</small>
          <div className="mh-watch-focus-target"><span>等待股价</span><b>{watch.targetPrice > 0 ? money(watch.targetPrice, watchCurrency) : "尚未设置"}</b></div>
          {watch.targetPrice > 0 && watch.price > 0 && <div className={`mh-watch-focus-gap ${watch.price <= watch.targetPrice ? "touched" : ""}`}>
            {watch.price <= watch.targetPrice ? <><CheckCircle2 size={15} /> 已触及等待价</> : <>距离等待价 {(((watch.targetPrice / watch.price) - 1) * 100).toFixed(2)}%</>}
          </div>}
        </div>
        <section>
          <h3>研究摘要</h3>
          <p className="mh-side-summary-text">{watch.research?.summary || "研究请求已排队，结果完成后会显示在这里。"}</p>
          {watch.report && <button className="mh-button" onClick={() => onOpenReport(watch.report)}><FileCode2 size={14} /> 打开完整研究</button>}
          <button className="mh-text-button" onClick={() => onQueueTask("watch", watch.id, `刷新关注标的 ${watch.name} ${watch.symbol}：联网核实最近一个已完成交易日的最新收盘价，在 research.quote 返回 price、date、currency、source、sourceUrl；并更新近期财报、新闻、展望和风险，生成带来源 HTML。`)}><RefreshCw size={13} /> 请求更新这个标的</button>
        </section>
      </> : <section className="mh-side-empty"><Star size={19} /><p>添加关注标的后，这里会显示等待价格、当前价格与研究摘要。</p><button className="mh-primary" onClick={() => onNavigate("watch")}>添加关注</button></section>)}
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
    [watchTargetDrafts, setWatchTargetDrafts] = useState({}),
    [showAllResearch, setShowAllResearch] = useState(false),
    [question, setQuestion] = useState(""),
    [aiKind, setAiKind] = useState("portfolio"),
    [provider, setProvider] = useState("ChatGPT"),
    [stress, setStress] = useState(20),
    [importText, setImportText] = useState(""),
    [accountNames, setAccountNames] = useState(null);
  const stateRef = useRef(state),
    busyRef = useRef(false),
    priceAlertKeys = useRef(new Set()),
    timer = useRef();
  stateRef.current = state;
  const notify = (text, error = false) => {
    setToast({ text, error });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), error ? 10000 : 3500);
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
  const mutate = async (fn, { close = true } = {}) => {
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
      notify("已保存到本地");
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
  const remove = (key, item) => setModal({ type: "delete", key, item });
  const openReport = (path) => {
    if (!path) return;
    const id = btoa(unescape(encodeURIComponent(path)))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    window.open(`${BASE}/library/document/${encodeURIComponent(id)}`, "_blank", "noopener,noreferrer");
  };
  const queueTask = async (kind = "portfolio", watchId, prompt = question, { quiet = false } = {}) => {
    try {
      const r = await request("/api/jobs", { kind, watchId, question: prompt });
      setState(r.state);
      stateRef.current = r.state;
      if (!quiet) notify(kind === "quotes" ? "收盘价更新已加入待办" : "已加入待办");
      return true;
    } catch (e) {
      if (e.message.includes("已经在待办队列")) {
        notify("这项任务已在等待 Codex 的队列里");
        return true;
      }
      notify(e.message, true);
      return false;
    }
  };
  const refreshPrices = () =>
    queueTask(
      "quotes",
      null,
      "更新全部持仓标的最近一个已完成美股交易日的收盘价，并记录交易日期与数据来源。",
    );
  const refreshWatchlist = async () => {
    const current = stateRef.current;
    if (!current?.watchlist.length) return notify("先添加关注标的", true);
    const pending = new Set(
      current.jobs.filter((j) => j.kind === "watch" && j.status === "waiting").map((j) => j.watchId),
    );
    const targets = current.watchlist.filter((w) => !pending.has(w.id));
    if (!targets.length) return notify("关注标的更新已在待办队列中");
    let queued = 0;
    for (const w of targets) {
      const ok = await queueTask(
        "watch",
        w.id,
        `刷新关注标的 ${w.name} ${w.symbol}：联网核实最近一个已完成交易日的最新收盘价，在 research.quote 返回 price、date、currency、source、sourceUrl；同时更新近期财报、重要新闻、公司展望与风险，生成带来源的自包含中文 HTML。不得编造实时价格或投资建议。`,
        { quiet: true },
      );
      if (ok) queued++;
    }
    await refresh();
    notify(`已将 ${queued} 个关注更新请求加入待办`);
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
    const prompt = `请在当前 NodeApps 工作区执行 My Holdings 中等待的任务。先读取 apps/my_holdings/data/CODEX_TODO.md 与 apps/my_holdings/data/state.json，只处理 status 为 waiting 的任务。\n\n收盘价任务（kind=quotes）：联网核对全部持仓代码最近一个已完成的美股交易日收盘价。每个代码都要有价格、交易日期与来源；若来源无法核实，就将任务标记为未完成。不要生成 HTML，也不要改动平均成本或总成本。完成后 POST ${location.origin}${BASE}/api/jobs/{任务ID}/complete，JSON 格式为 {"quotes":[{"symbol":"VOO","price":700.12,"date":"2026-10-16","source":"来源名称"}],"summary":"更新说明"}。\n\n研究任务（kind=watch、portfolio、market）：联网核实最新资料并生成自包含中文 HTML，保存到 apps/my_holdings/data/reports/ 对应目录；然后调用 complete API，提交 report 相对路径与完整 research 对象。关注标的任务必须在 research.quote 中返回最近完整交易日收盘价：{"price":123.45,"date":"2026-10-16","currency":"USD","source":"来源名称","sourceUrl":"https://来源页面"}，并在报告中注明日期与来源。无法完成时调用 /my-holdings/api/jobs/{任务ID}/fail 并说明原因。不要做买卖或交易。\n\n当前等待任务：\n${JSON.stringify(pending, null, 2)}\n\n${contextPack(stateRef.current, "portfolio", "仅处理上述待办任务，并回写结果。")}`;
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
    watchFocus = state.watchlist.find((w) => w.id === selectedWatchId) || state.watchlist[0],
    waitingJobs = state.jobs.filter((j) => j.status === "waiting" || j.status === "failed"),
    completedJobs = state.jobs.filter((j) => j.status === "done").sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date)),
    visibleHoldings = state.holdings.filter((h) =>
      `${h.symbol} ${h.name} ${h.sector}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const page = (id) => {
    setTab(id);
    setQuery("");
  };
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
        value={(state.goals.objective || state.goals.notes || "").trim() ? "已记录" : "待填写"}
        sub={(state.goals.objective || state.goals.notes || "").trim() || "写下一句话，给组合分析一个方向"}
        icon={Target}
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
                <small>{h.priceDate ? `${h.priceDate} · ${h.priceSource || "收盘"}` : "点击刷新收盘价"}</small>
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
                  <Plus size={17} /> 记录持仓
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
                    <p>原始市值保留，盈亏按市值减成本计算</p>
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
                  <button className="mh-button" onClick={refreshPrices} disabled={state.jobs.some((j) => j.kind === "quotes" && j.status === "waiting")}>
                    <RefreshCw size={15} />
                    {state.jobs.some((j) => j.kind === "quotes" && j.status === "waiting") ? "收盘价已排队" : "刷新收盘价"}
                  </button>
                  <button className="mh-primary" onClick={() => setModal({ type: "holding" })}>
                    <Plus size={17} /> 新增持仓
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
                        <div className="mh-account-total"><small>当前市值</small><strong>{money(total)}</strong><button className="mh-text-button" onClick={() => setModal({ type: "holding", accountId: a.id })}><Plus size={14} /> 添加到此账户</button></div>
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
                <div className="mh-heading-actions">
                  <label className="mh-search">
                    <Search size={16} />
                    <input aria-label="搜索关注标的" placeholder="搜索关注…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </label>
                  <button className="mh-primary" onClick={() => setModal({ type: "watch" })}>
                    <Plus size={17} /> 添加关注
                  </button>
                  <button
                    className="mh-button"
                    onClick={refreshWatchlist}
                    disabled={!state.watchlist.length || state.watchlist.every((w) => state.jobs.some((j) => j.watchId === w.id && j.status === "waiting"))}
                  >
                    <RefreshCw size={15} /> 刷新关注
                  </button>
                </div>,
              )}
              <div className="mh-watch-grid">
                {state.watchlist
                  .filter((w) =>
                    `${w.name} ${w.symbol}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((w) => {
                    const job = state.jobs.findLast((j) => j.watchId === w.id);
                    const price = Number.isFinite(Number(w.price)) && w.price != null ? Number(w.price) : null;
                    const targetPrice = w.targetPrice == null ? null : Number(w.targetPrice);
                    const distance = price != null && targetPrice > 0 ? ((targetPrice / price) - 1) * 100 : null;
                    const targetDraft = watchTargetDrafts[w.id] ?? (targetPrice ?? "");
                    const quoteCurrency = w.research?.quote?.currency || w.research?.identity?.currency || "USD";
                    return (
                      <article className={`mh-watch-card ${watchFocus?.id === w.id ? "selected" : ""}`} key={w.id}>
                        <header>
                          <span className="mh-ticker">
                            {(w.symbol || w.name).slice(0, 2)}
                          </span>
                          <button className="mh-watch-identity" onClick={() => { setSelectedWatchId(w.id); if (matchMedia("(min-width: 1001px)").matches) setRight(true); }}>
                            <h3>{w.name}</h3>
                            <small>{w.symbol || "待核实代码"} · {w.status || "关注中"}</small>
                          </button>
                          <span className={`mh-queue-pill ${job?.status || "waiting"}`}>{job?.status === "done" ? "已更新" : job?.status === "failed" ? "未完成" : "等待更新中"}</span>
                          <button
                            className="mh-icon"
                            aria-label={`编辑关注 ${w.name}`}
                            onClick={() => setModal({ type: "watch", item: w })}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="mh-icon"
                            aria-label={`删除关注 ${w.name}`}
                            onClick={() => remove("watchlist", w)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </header>
                        <div className="mh-watch-prices">
                          <div>
                            <small>当前股价</small>
                            <strong>{price == null ? "等待更新" : money(price, quoteCurrency)}</strong>
                            <small>{w.priceDate || "尚无报价日期"}</small>
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
                              onChange={(e) => setWatchTargetDrafts((d) => ({ ...d, [w.id]: e.target.value }))}
                              onBlur={() => {
                                const draft = watchTargetDrafts[w.id];
                                if (draft === undefined) return;
                                setWatchTargetDrafts((d) => { const next = { ...d }; delete next[w.id]; return next; });
                                if ((draft === "" ? null : Number(draft)) !== (targetPrice ?? null)) saveWatchTarget(w.id, draft);
                              }}
                              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                            />
                          </label>
                          <div className={`mh-watch-distance ${distance != null && distance < 0 ? "below" : ""}`}>
                            <small>等待价差</small>
                            <strong>{distance == null ? "—" : `${distance > 0 ? "+" : ""}${distance.toFixed(2)}%`}</strong>
                            {price != null && targetPrice > 0 && price <= targetPrice && <span>已触及</span>}
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
                  })}
              </div>
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
                    <h3>待办</h3>
                    {waitingJobs.length ? waitingJobs.slice().reverse().map((j) => (
                      <div className="mh-job" key={j.id}>
                        <span className={`mh-job-icon ${j.status}`}>
                          {j.status === "failed" ? <X size={17} /> : <LoaderCircle size={17} />}
                        </span>
                        <div>
                          <strong>{j.kind === "watch" ? `研究 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "关注标的"}` : j.kind === "market" ? "行情研究" : j.kind === "quotes" ? "持仓收盘价更新" : "持仓分析"}</strong>
                          <small>{when(j.date)} · {j.status === "failed" ? `未完成${j.error ? ` · ${j.error}` : ""}` : "等待交给 Codex"}</small>
                        </div>
                      </div>
                    )) : <p className="mh-job-empty">当前没有待办</p>}
                  </section>
                  <section className="mh-job-column">
                    <h3>最近完成</h3>
                    {completedJobs.length ? completedJobs.slice(0, 4).map((j) => (
                      <div className="mh-job" key={j.id}>
                        <span className="mh-job-icon done"><CheckCircle2 size={17} /></span>
                        <div>
                          <strong>{j.kind === "watch" ? `研究 ${state.watchlist.find((w) => w.id === j.watchId)?.symbol || "关注标的"}` : j.kind === "market" ? "行情研究" : j.kind === "quotes" ? "持仓收盘价更新" : "持仓分析"}</strong>
                          <small>{when(j.completedAt || j.date)} · 已完成并保存</small>
                        </div>
                        {j.report && <button className="mh-icon" aria-label="打开报告" onClick={() => openReport(j.report)}><ArrowUpRight size={15} /></button>}
                      </div>
                    )) : <p className="mh-job-empty">完成的任务会出现在这里</p>}
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
          onClose={() => toggle("right")}
          onNavigate={page}
          onOpenReport={openReport}
          onEdit={(form) => setModal(form)}
          onRefreshPrices={refreshPrices}
          onQueueTask={queueTask}
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
              holding: modal.item ? "编辑持仓" : "记录一笔持仓",
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
                  <div><strong>{w.symbol || w.name}</strong><small>当前 {money(w.price, w.research?.quote?.currency || "USD")} · 等待 {money(w.targetPrice, w.research?.quote?.currency || "USD")} · 报价日期 {w.priceDate || "未知"}</small></div>
                  <button className="mh-text-button" onClick={() => { setSelectedWatchId(w.id); setModal(null); page("watch"); }}>查看 <ArrowRight size={13} /></button>
                </div>
              ))}
              <p className="mh-help">这是最近一次保存的收盘价触发提醒；需要最新报价时，请在「近期关注」点击更新。</p>
            </div>
          )}
          {modal.type === "holding" && (
            <HoldingForm
              item={modal.item}
              accounts={state.accounts}
              defaultAccountId={modal.accountId}
              busy={busy}
              onSave={(v) => upsert("holdings", v)}
            />
          )}
          {modal.type === "watch" && (
            <WatchForm
              item={modal.item}
              busy={busy}
              onSave={async (v) => {
                const success = await upsert("watchlist", v);
                if (success && !modal.item) {
                  const queued = await queueTask("watch", v.id, `研究并更新关注标的：${v.name} ${v.symbol}。核实最近完整交易日收盘价，并在 research.quote 返回 price、date、currency、source、sourceUrl；更新近期财报、重要新闻、业务展望和主要风险，生成带来源的自包含 HTML。`);
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
                  onClick={() => queueTask("watch", modal.item.id, `研究关注标的：${modal.item.name} ${modal.item.symbol}`)}
                >
                  <Sparkles size={15} /> 加入 / 重新加入待办
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
