import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Compass,
  Edit3,
  ExternalLink,
  GraduationCap,
  Home as HomeIcon,
  LayoutGrid,
  Library,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";

import "./styles.css";
import {
  createJournalEntry,
  createWatchlistItem,
  deleteJournalEntry,
  deleteWatchlistItem,
  fetchBriefDoc,
  fetchBriefList,
  fetchCase,
  fetchCases,
  fetchJournal,
  fetchKnowledgeDoc,
  fetchKnowledgeTree,
  fetchMeta,
  fetchModel,
  fetchModels,
  fetchWatchlist,
  updateJournalEntry,
  updateWatchlistItem,
} from "./services/api";

const PILLARS = [
  { value: "value", label: "Value · 价值投资", short: "价值" },
  { value: "frontier", label: "Frontier · 新兴前沿", short: "前沿" },
  { value: "wisdom", label: "Wisdom · 商业认知", short: "认知" },
  { value: "foundations", label: "Foundations · 基础", short: "基础" },
  { value: "psychology", label: "Psychology · 行为/心理", short: "心理" },
  { value: "other", label: "Other · 其他", short: "其他" },
];

const PILLAR_LABEL = Object.fromEntries(PILLARS.map((p) => [p.value, p.short]));
const PILLAR_FULL = Object.fromEntries(PILLARS.map((p) => [p.value, p.label]));

const DIRECTIONS = [
  { value: "buy", label: "Buy · 建仓 / 买入" },
  { value: "hold", label: "Hold · 持有" },
  { value: "trim", label: "Trim · 减仓" },
  { value: "sell", label: "Sell · 清仓" },
  { value: "avoid", label: "Avoid · 主动回避" },
  { value: "watch", label: "Watch · 仅观察" },
];

const DIRECTION_LABEL = Object.fromEntries(DIRECTIONS.map((d) => [d.value, d.label]));

const DEFAULT_COGNITIVE_PROMPTS = [
  "我是不是在锚定最近的价格？",
  "我是不是在追热点 / 怕错过？",
  "如果别人不知道这是我做的，我还会不会做？",
  "我能用一句话给一个 10 岁孩子解释这个生意吗？",
  "什么证据出现会让我反向操作？",
];

const TABS = [
  { id: "home", label: "首页", icon: HomeIcon, kind: "live" },
  { id: "watchlist", label: "关注清单", icon: Target, kind: "live" },
  { id: "journal", label: "决策日志", icon: Pencil, kind: "live" },
  { id: "knowledge", label: "知识库", icon: Library, kind: "live" },
  { id: "models", label: "思维模型", icon: Brain, kind: "live" },
  { id: "cases", label: "案例库", icon: BookOpen, kind: "live" },
  { id: "brief", label: "市场简报", icon: Newspaper, kind: "live" },
  { id: "training", label: "训练", icon: GraduationCap, kind: "soon" },
];

const SOON_DESCRIPTIONS = {
  training:
    "Phase 5 开放：每日金句、案例练习题、认知偏差小测。",
};

// ============================================================
// Curated reading paths — what each overview should ACTUALLY show.
// The sidebar already lists everything; the overview's job is to give
// a curated entry point + reason why this order, not duplicate the list.
// ============================================================

const KNOWLEDGE_READING_PATH = [
  { slug: "power-of-compounding", why: '复利的数学是所有价值投资的起点。先理解为什么 30 年不是 30 倍，再谈"长期"。' },
  { slug: "loss-aversion", why: '你的大脑天生反对复利——损失痛苦是收益快乐的 2.25 倍。不认识敌人，纪律永远不稳。' },
  { slug: "buffett-12-principles", why: 'Buffett 59 年蒸馏的 12 个判断题。业务 4 + 管理 4 + 财务 4 的可执行清单。' },
  { slug: "three-financial-statements", why: '12 条原则的财务落地工具。三表互相校验是识破 Enron / Wirecard 类欺诈的底层方法。' },
  { slug: "naval-four-leverages", why: '为什么 SaaS 估值倍数 = 制造业的 10 倍？理解杠杆类型才看得懂任何估值差异。' },
  { slug: "bitcoin-as-hard-money", why: '53 年法币史的现代结局。理解硬通货叙事的逻辑根基，前沿才有锚点。' },
];

const MODELS_READING_PATH = [
  { slug: "inversion", why: 'Munger 的第一思维工具。问"怎么必然失败"比"怎么成功"有用 10 倍。' },
  { slug: "incentives", why: '看不见的激励驱动一切。99% 的"看不懂"是因为没看激励结构。' },
  { slug: "circle-of-competence", why: '大多数人破产不是知识不够，是不知道自己不知道。Dunning-Kruger 的投资版。' },
  { slug: "margin-of-safety", why: 'Graham 三字诀。承认估值会错的数学防线。从 Graham 进化到 Buffett 后期。' },
  { slug: "mr-market", why: '把市场拟人化。Graham 1949 年的心理工具至今未过时。' },
  { slug: "lollapalooza", why: '所有模型的综合应用。识别"多偏差同向" = 识别真危机和真伟大公司。' },
];

const CASES_READING_PATH = [
  { slug: "1972-sees-candies", why: 'Buffett 投资哲学的拐点。读懂它你才懂 Berkshire 后 50 年和价值投资进化的逻辑。' },
  { slug: "2003-amazon-buffett-miss", why: '同一个 Buffett 错过了什么、为什么、代价多大。能力圈纪律的真实成本。' },
  { slug: "1998-ltcm-collapse", why: '聪明 + 杠杆 = 毁灭。Munger 用反演避开 LTCM 的最经典示范。' },
  { slug: "2010-bitcoin-early-believers", why: '4 类早期信仰者对比：Hal Finney / Wences / 李笑来 / Roger Ver。"押注重到改变人生"的样本。' },
  { slug: "2022-luna-terra-collapse", why: '现代旁氏的完整解剖。最近最完整的负向 Lollapalooza 教科书。' },
];

function CuratedPath({ items, resolve, onPick, emptyText }) {
  const valid = items
    .map((it) => ({ ...it, resolved: resolve(it.slug) }))
    .filter((it) => it.resolved);

  if (valid.length === 0) {
    return <p className="inv-empty">{emptyText || "（暂无内容）"}</p>;
  }

  return (
    <ol className="inv-curated-list">
      {valid.map((pick, i) => (
        <li key={pick.slug}>
          <span className="inv-curated-num">{i + 1}</span>
          <div className="inv-curated-body">
            <button
              type="button"
              className="inv-curated-link"
              onClick={() => onPick(pick.resolved.target)}
            >
              {pick.resolved.title}
            </button>
            <p className="inv-curated-why">{pick.why}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function localDateIso(date = new Date()) {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return copy.toISOString().slice(0, 10);
}

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function joinList(list) {
  return Array.isArray(list) ? list.join(", ") : "";
}

function splitList(text) {
  return String(text || "")
    .split(/[,，\n]/)
    .map((piece) => piece.trim())
    .filter(Boolean);
}

function emptyWatchlistDraft() {
  return {
    ticker: "",
    name: "",
    pillar: "value",
    thesis: "",
    catalyst: "",
    risk: "",
    entry_zone: "",
    exit_zone: "",
    position_size: "",
    opened_at: localDateIso(),
    linked_models: [],
    linked_cases: [],
    tags: [],
    notes: "",
    status: "active",
  };
}

function emptyJournalDraft() {
  return {
    date: localDateIso(),
    asset: "",
    direction: "watch",
    thesis: "",
    pre_mortem: "",
    cognitive_check: [],
    size: "",
    outcome: "",
    lesson: "",
    linked_models: [],
    linked_watchlist: [],
    tags: [],
  };
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [meta, setMeta] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [journal, setJournal] = useState([]);
  const [knowledgeTree, setKnowledgeTree] = useState(null);
  const [knowledgePath, setKnowledgePath] = useState(null);
  const [modelsList, setModelsList] = useState(null);
  const [modelSlug, setModelSlug] = useState(null);
  const [briefList, setBriefList] = useState(null);
  const [briefKind, setBriefKind] = useState("daily");
  const [briefPath, setBriefPath] = useState(null);
  const [casesList, setCasesList] = useState(null);
  const [caseSlug, setCaseSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [m, w, j] = await Promise.all([fetchMeta(), fetchWatchlist(), fetchJournal()]);
      setMeta(m);
      setWatchlist(w.items || []);
      setJournal(j.entries || []);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        await refresh();
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  const counts = useMemo(() => {
    const pending = journal.filter(
      (entry) => !(entry.outcome || "").trim() || !(entry.lesson || "").trim(),
    ).length;
    return {
      watchlist: watchlist.length,
      journal: journal.length,
      journal_pending: pending,
      knowledge: meta?.counts?.knowledge ?? 0,
      models: meta?.counts?.models ?? 0,
      daily: meta?.counts?.daily ?? 0,
      weekly: meta?.counts?.weekly ?? 0,
    };
  }, [watchlist, journal, meta]);

  // Lazy-load knowledge tree the first time the tab opens.
  useEffect(() => {
    if (tab !== "knowledge" || knowledgeTree) return;
    fetchKnowledgeTree()
      .then(setKnowledgeTree)
      .catch((e) => setError(e.message || String(e)));
  }, [tab, knowledgeTree]);

  // Lazy-load model list the first time the tab opens.
  useEffect(() => {
    if (tab !== "models" || modelsList) return;
    fetchModels()
      .then((d) => setModelsList(d.items || []))
      .catch((e) => setError(e.message || String(e)));
  }, [tab, modelsList]);

  // Lazy-load brief list (daily + weekly together) the first time brief opens.
  useEffect(() => {
    if (tab !== "brief" || briefList) return;
    fetchBriefList()
      .then(setBriefList)
      .catch((e) => setError(e.message || String(e)));
  }, [tab, briefList]);

  // Lazy-load cases list.
  useEffect(() => {
    if (tab !== "cases" || casesList) return;
    fetchCases()
      .then((d) => setCasesList(d))
      .catch((e) => setError(e.message || String(e)));
  }, [tab, casesList]);

  // Click on a [[wiki-link]] inside markdown → jump to the matching entry.
  const openWikiLink = useCallback(
    async (slug) => {
      // Try models first (flat slugs).
      const tryModels = async () => {
        let list = modelsList;
        if (!list) {
          try {
            const data = await fetchModels();
            list = data.items || [];
            setModelsList(list);
          } catch {
            list = [];
          }
        }
        return list.find((m) => m.slug === slug);
      };
      const tryKnowledge = async () => {
        let tree = knowledgeTree;
        if (!tree) {
          try {
            tree = await fetchKnowledgeTree();
            setKnowledgeTree(tree);
          } catch {
            tree = { categories: [] };
          }
        }
        for (const cat of tree.categories || []) {
          const doc = (cat.docs || []).find((d) => d.slug === slug);
          if (doc) return doc;
        }
        return null;
      };
      const tryCases = async () => {
        let data = casesList;
        if (!data) {
          try {
            data = await fetchCases();
            setCasesList(data);
          } catch {
            data = { items: [] };
          }
        }
        return (data.items || []).find((c) => c.slug === slug);
      };

      const modelHit = await tryModels();
      if (modelHit) {
        setTab("models");
        setModelSlug(slug);
        return;
      }
      const docHit = await tryKnowledge();
      if (docHit) {
        setTab("knowledge");
        setKnowledgePath(docHit.path);
        return;
      }
      const caseHit = await tryCases();
      if (caseHit) {
        setTab("cases");
        setCaseSlug(slug);
        return;
      }
      setError(`内部链接 [[${slug}]] 还没指向已存在的条目。`);
    },
    [knowledgeTree, modelsList, casesList],
  );

  return (
    <div className="inv-shell">
      <aside className="inv-sidebar">
        <div className="inv-brand">
          <div className="inv-brand-mark">
            <TrendingUp size={20} strokeWidth={2.2} />
          </div>
          <div>
            <p className="inv-brand-name">Investment</p>
            <p className="inv-brand-tag">学习 · 思考 · 复盘</p>
          </div>
        </div>

        <nav className="inv-nav" aria-label="模块导航">
          {TABS.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={classes("inv-nav-item", isActive && "is-active", item.kind === "soon" && "is-soon")}
                onClick={() => setTab(item.id)}
              >
                <Icon size={16} strokeWidth={1.9} />
                <span>{item.label}</span>
                {item.kind === "soon" && <span className="inv-nav-soon">即将</span>}
              </button>
            );
          })}
        </nav>

        <button type="button" className="inv-refresh" onClick={refresh} title="刷新">
          <RefreshCcw size={14} strokeWidth={2} />
          <span>刷新</span>
        </button>
      </aside>

      <main className="inv-main">
        {error && (
          <div className="inv-banner inv-banner-error">
            <AlertTriangle size={14} strokeWidth={2} />
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="关闭">
              <X size={14} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="inv-loading">
            <Loader2 size={18} className="inv-spin" />
            <span>正在加载本地数据…</span>
          </div>
        ) : tab === "home" ? (
          <HomeView meta={meta} counts={counts} watchlist={watchlist} journal={journal} onGo={setTab} />
        ) : tab === "watchlist" ? (
          <WatchlistView
            items={watchlist}
            onChange={setWatchlist}
            onError={setError}
            onAfterMutation={refresh}
          />
        ) : tab === "journal" ? (
          <JournalView
            entries={journal}
            onChange={setJournal}
            onError={setError}
            onAfterMutation={refresh}
          />
        ) : tab === "knowledge" ? (
          <KnowledgeView
            tree={knowledgeTree}
            selectedPath={knowledgePath}
            onSelect={setKnowledgePath}
            onWikiLink={openWikiLink}
            onError={setError}
          />
        ) : tab === "models" ? (
          <ModelsView
            items={modelsList}
            selectedSlug={modelSlug}
            onSelect={setModelSlug}
            onWikiLink={openWikiLink}
            onError={setError}
          />
        ) : tab === "brief" ? (
          <BriefView
            list={briefList}
            kind={briefKind}
            onKindChange={(k) => {
              setBriefKind(k);
              setBriefPath(null);
            }}
            selectedPath={briefPath}
            onSelect={setBriefPath}
            onWikiLink={openWikiLink}
            onError={setError}
          />
        ) : tab === "cases" ? (
          <CasesView
            data={casesList}
            selectedSlug={caseSlug}
            onSelect={setCaseSlug}
            onWikiLink={openWikiLink}
            onError={setError}
          />
        ) : (
          <ComingSoonView tabId={tab} />
        )}
      </main>
    </div>
  );
}

// ============================================================
// Home dashboard
// ============================================================

function HomeView({ meta, counts, watchlist, journal, onGo }) {
  const recentWatch = watchlist.slice(0, 3);
  const recentJournal = journal.slice(0, 3);

  return (
    <div className="inv-home">
      <header className="inv-home-hero">
        <p className="inv-home-eyebrow">个人投研工作台</p>
        <h1>看懂世界 · 形成观点 · 下注 · 复盘</h1>
        <p className="inv-home-sub">
          这不是炒股工具。它是个长期生长的学习与决策仓库——前期靠 AI 灌知识，中期靠你写决策日志，长期靠复盘把经验沉淀。
        </p>
      </header>

      <section className="inv-home-grid">
        <DashCard
          accent="#1e3a5f"
          icon={Target}
          title="关注清单"
          value={counts.watchlist}
          unit="个标的"
          hint="每个标的有明确 thesis / catalyst / risk"
          cta="查看"
          onClick={() => onGo("watchlist")}
        />
        <DashCard
          accent="#7a4b1e"
          icon={Pencil}
          title="决策日志"
          value={counts.journal}
          unit="条决策"
          hint={counts.journal_pending ? `${counts.journal_pending} 条等你写复盘` : "都已复盘 ✓"}
          cta="查看"
          onClick={() => onGo("journal")}
        />
        <DashCard
          accent="#2d6a4f"
          icon={Library}
          title="知识库"
          value={counts.knowledge}
          unit="篇笔记"
          hint={counts.knowledge ? "AI 持续灌内容（宁缺毋滥）" : "Phase 3 已开放，等待 AI 灌内容"}
          cta="进入"
          onClick={() => onGo("knowledge")}
        />
        <DashCard
          accent="#6a3f86"
          icon={Brain}
          title="思维模型"
          value={counts.models}
          unit="个模型"
          hint={counts.models ? "Munger 多元思维框架" : "等待 AI 写入"}
          cta="进入"
          onClick={() => onGo("models")}
        />
        <DashCard
          accent="#a55a26"
          icon={Newspaper}
          title="市场简报"
          value={counts.daily + counts.weekly}
          unit={`篇（日 ${counts.daily} · 周 ${counts.weekly}）`}
          hint={counts.daily + counts.weekly ? "跟着每日/每周看世界" : "Phase 4 已开放"}
          cta="进入"
          onClick={() => onGo("brief")}
        />
      </section>

      <section className="inv-home-row">
        <div className="inv-home-card">
          <header>
            <h2>最近关注</h2>
            <button type="button" className="inv-link" onClick={() => onGo("watchlist")}>
              全部 →
            </button>
          </header>
          {recentWatch.length === 0 ? (
            <p className="inv-empty">还没有关注标的。点 "关注清单" 写下第一个 thesis。</p>
          ) : (
            <ul className="inv-mini-list">
              {recentWatch.map((item) => (
                <li key={item.id}>
                  <span className="inv-mini-tag">{PILLAR_LABEL[item.pillar] || "其他"}</span>
                  <strong>{item.ticker || item.name || "未命名"}</strong>
                  <span className="inv-mini-thesis">{truncate(item.thesis, 60) || "（无 thesis）"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inv-home-card">
          <header>
            <h2>最近决策</h2>
            <button type="button" className="inv-link" onClick={() => onGo("journal")}>
              全部 →
            </button>
          </header>
          {recentJournal.length === 0 ? (
            <p className="inv-empty">还没有决策记录。点 "决策日志" 写下今天的第一条。</p>
          ) : (
            <ul className="inv-mini-list">
              {recentJournal.map((entry) => (
                <li key={entry.id}>
                  <span className="inv-mini-tag">{entry.date}</span>
                  <strong>
                    {DIRECTION_LABEL[entry.direction]?.split(" · ")[0] || entry.direction} · {entry.asset || "—"}
                  </strong>
                  <span className="inv-mini-thesis">{truncate(entry.thesis, 60) || "（无 thesis）"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="inv-home-tips">
        <h3>三句话使用指南</h3>
        <ol>
          <li>
            <strong>关注清单</strong> 不是"我喜欢的股票列表"，而是"我有一个具体看法的标的"。没有 thesis 的不要加。
          </li>
          <li>
            <strong>决策日志</strong> 是和未来的自己对话。重点是 <em>pre-mortem</em> 和 <em>认知检查</em>——结果不重要，思考路径重要。
          </li>
          <li>
            想知道 App 整体设计、未来要做什么、AI 怎么协作？读仓库根目录的{" "}
            <code>Investment.md</code> 和 <code>backend/data/Investment/README.md</code>。
          </li>
        </ol>
      </section>

      {meta && (
        <footer className="inv-home-meta">
          <span>当前阶段：{meta.phase}</span>
          <span>·</span>
          <span>数据目录：<code>{shortPath(meta.data_dir)}</code></span>
        </footer>
      )}
    </div>
  );
}

function DashCard({ accent, icon: Icon, title, value, unit, hint, cta, onClick }) {
  return (
    <button type="button" className="inv-dash-card" style={{ "--card-accent": accent }} onClick={onClick}>
      <div className="inv-dash-icon">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="inv-dash-title">{title}</div>
      <div className="inv-dash-value">
        <span className="inv-dash-number">{value}</span>
        <span className="inv-dash-unit">{unit}</span>
      </div>
      <div className="inv-dash-hint">{hint}</div>
      <div className="inv-dash-cta">{cta} →</div>
    </button>
  );
}

function truncate(text, limit) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length <= limit ? s : s.slice(0, limit) + "…";
}

function shortPath(p) {
  if (!p) return "";
  const parts = String(p).split(/[/\\]/);
  return parts.slice(-3).join("/");
}

// ============================================================
// Watchlist view
// ============================================================

function WatchlistView({ items, onChange, onError, onAfterMutation }) {
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [pillarFilter, setPillarFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    if (!pillarFilter) return items;
    return items.filter((item) => item.pillar === pillarFilter);
  }, [items, pillarFilter]);

  const handleCreate = async (draft) => {
    try {
      const created = await createWatchlistItem(draft);
      onChange((prev) => [created, ...prev]);
      setCreating(false);
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    }
  };

  const handleUpdate = async (id, draft) => {
    try {
      setBusyId(id);
      const updated = await updateWatchlistItem(id, draft);
      onChange((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setEditingId(null);
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("确定删除？这个标的的 thesis / catalyst / risk 都会一起丢。")) return;
    try {
      setBusyId(id);
      await deleteWatchlistItem(id);
      onChange((prev) => prev.filter((it) => it.id !== id));
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="inv-page">
      <header className="inv-page-head">
        <div>
          <h1>关注清单</h1>
          <p className="inv-page-sub">
            每个标的都要有 <em>thesis（为什么看好/看空）</em> · <em>catalyst（什么会兑现）</em> · <em>risk（什么会破产）</em>。
            没有这三样就不要加。
          </p>
        </div>
        <div className="inv-page-actions">
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            className="inv-select"
            title="按支柱过滤"
          >
            <option value="">全部支柱（{items.length}）</option>
            {PILLARS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.short}（{items.filter((it) => it.pillar === p.value).length}）
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inv-btn inv-btn-primary"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
          >
            <Plus size={14} strokeWidth={2.2} />
            <span>新增标的</span>
          </button>
        </div>
      </header>

      {creating && (
        <WatchlistForm
          initial={emptyWatchlistDraft()}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          submitLabel="保存"
        />
      )}

      {filtered.length === 0 && !creating ? (
        <div className="inv-empty-card">
          <Compass size={28} strokeWidth={1.6} />
          <h3>关注清单还是空的</h3>
          <p>建议从你最熟悉的 1-2 个标的开始（不是你想买的，而是你最看得懂的）。</p>
        </div>
      ) : (
        <ul className="inv-card-list">
          {filtered.map((item) =>
            editingId === item.id ? (
              <li key={item.id}>
                <WatchlistForm
                  initial={item}
                  onSubmit={(draft) => handleUpdate(item.id, draft)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="保存修改"
                />
              </li>
            ) : (
              <li key={item.id}>
                <WatchlistCard
                  item={item}
                  busy={busyId === item.id}
                  onEdit={() => {
                    setEditingId(item.id);
                    setCreating(false);
                  }}
                  onDelete={() => handleDelete(item.id)}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function WatchlistCard({ item, busy, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const hasThesis = (item.thesis || "").trim().length > 0;

  return (
    <article className={classes("inv-card", busy && "is-busy")}>
      <header className="inv-card-head">
        <div className="inv-card-title">
          <span className="inv-pillar-chip" data-pillar={item.pillar}>
            {PILLAR_LABEL[item.pillar] || "其他"}
          </span>
          <h3>
            {item.ticker && <code className="inv-ticker">{item.ticker}</code>}
            <span>{item.name || "未命名"}</span>
          </h3>
        </div>
        <div className="inv-card-actions">
          <button type="button" className="inv-icon-btn" onClick={onEdit} title="编辑">
            <Edit3 size={14} />
          </button>
          <button type="button" className="inv-icon-btn inv-danger" onClick={onDelete} title="删除">
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {hasThesis ? (
        <p className="inv-card-thesis">{item.thesis}</p>
      ) : (
        <p className="inv-card-thesis inv-faded">（这条还没有 thesis，写一条吧）</p>
      )}

      <div className="inv-card-grid">
        <Field label="Catalyst 催化剂" value={item.catalyst} />
        <Field label="Risk 风险" value={item.risk} />
        <Field label="Entry 入场区间" value={item.entry_zone} inline />
        <Field label="Exit 退出区间" value={item.exit_zone} inline />
        <Field label="Position 仓位" value={item.position_size} inline />
        <Field label="Opened 关注于" value={item.opened_at} inline />
      </div>

      <footer className="inv-card-foot">
        <button type="button" className="inv-link" onClick={() => setOpen((o) => !o)}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? "收起" : "更多"}
        </button>
        {open && (
          <div className="inv-card-extra">
            <Field label="Linked models" value={joinList(item.linked_models)} inline />
            <Field label="Linked cases" value={joinList(item.linked_cases)} inline />
            <Field label="Tags" value={joinList(item.tags)} inline />
            <Field label="Notes" value={item.notes} />
          </div>
        )}
      </footer>
    </article>
  );
}

function WatchlistForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [draft, setDraft] = useState(() => ({ ...initial }));
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...draft,
        linked_models: typeof draft.linked_models === "string" ? splitList(draft.linked_models) : draft.linked_models,
        linked_cases: typeof draft.linked_cases === "string" ? splitList(draft.linked_cases) : draft.linked_cases,
        tags: typeof draft.tags === "string" ? splitList(draft.tags) : draft.tags,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inv-form" onSubmit={submit}>
      <div className="inv-form-row">
        <label>
          <span>Ticker（代码）</span>
          <input value={draft.ticker} onChange={set("ticker")} placeholder="如 BRK.B / BTC / 600519" maxLength={24} />
        </label>
        <label>
          <span>名称 <em>必填</em></span>
          <input value={draft.name} onChange={set("name")} placeholder="如 Berkshire Hathaway B" maxLength={120} required />
        </label>
        <label>
          <span>支柱 Pillar</span>
          <select value={draft.pillar} onChange={set("pillar")}>
            {PILLARS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="inv-form-full">
        <span>Thesis（核心论点）<em>越具体越好</em></span>
        <textarea rows={4} value={draft.thesis} onChange={set("thesis")} placeholder="为什么看好/看空。1-3 段，不要复制别人的。" />
      </label>

      <div className="inv-form-row">
        <label>
          <span>Catalyst（什么会让 thesis 兑现）</span>
          <textarea rows={3} value={draft.catalyst} onChange={set("catalyst")} />
        </label>
        <label>
          <span>Risk（什么会让 thesis 破产）</span>
          <textarea rows={3} value={draft.risk} onChange={set("risk")} />
        </label>
      </div>

      <div className="inv-form-row">
        <label>
          <span>Entry 入场区间</span>
          <input value={draft.entry_zone} onChange={set("entry_zone")} placeholder="如 PE&lt;15 或 价格 30-35" />
        </label>
        <label>
          <span>Exit 退出区间</span>
          <input value={draft.exit_zone} onChange={set("exit_zone")} placeholder="如 PE&gt;30 或 thesis 失效" />
        </label>
        <label>
          <span>Position 仓位</span>
          <input value={draft.position_size} onChange={set("position_size")} placeholder="如 5% / 3 手" />
        </label>
        <label>
          <span>Opened 关注于</span>
          <input type="date" value={draft.opened_at} onChange={set("opened_at")} />
        </label>
      </div>

      <div className="inv-form-row">
        <label>
          <span>Linked models（思维模型 slug，逗号分隔）</span>
          <input
            value={Array.isArray(draft.linked_models) ? draft.linked_models.join(", ") : draft.linked_models}
            onChange={set("linked_models")}
            placeholder="如 margin-of-safety, inversion"
          />
        </label>
        <label>
          <span>Linked cases（案例 slug）</span>
          <input
            value={Array.isArray(draft.linked_cases) ? draft.linked_cases.join(", ") : draft.linked_cases}
            onChange={set("linked_cases")}
            placeholder="如 1972-sees-candies"
          />
        </label>
        <label>
          <span>Tags 标签</span>
          <input
            value={Array.isArray(draft.tags) ? draft.tags.join(", ") : draft.tags}
            onChange={set("tags")}
            placeholder="如 消费, 强护城河"
          />
        </label>
      </div>

      <label className="inv-form-full">
        <span>Notes（随手笔记）</span>
        <textarea rows={3} value={draft.notes} onChange={set("notes")} />
      </label>

      <div className="inv-form-actions">
        <button type="button" className="inv-btn" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="inv-btn inv-btn-primary" disabled={submitting}>
          {submitting ? <Loader2 size={14} className="inv-spin" /> : <Sparkles size={14} />}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}

// ============================================================
// Decision journal view
// ============================================================

function JournalView({ entries, onChange, onError, onAfterMutation }) {
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    if (!showPending) return entries;
    return entries.filter((e) => !(e.outcome || "").trim() || !(e.lesson || "").trim());
  }, [entries, showPending]);

  const handleCreate = async (draft) => {
    try {
      const created = await createJournalEntry(draft);
      onChange((prev) => [created, ...prev]);
      setCreating(false);
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    }
  };

  const handleUpdate = async (id, draft) => {
    try {
      setBusyId(id);
      const updated = await updateJournalEntry(id, draft);
      onChange((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setEditingId(null);
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("确定删除这条决策日志？")) return;
    try {
      setBusyId(id);
      await deleteJournalEntry(id);
      onChange((prev) => prev.filter((it) => it.id !== id));
      onAfterMutation?.();
    } catch (e) {
      onError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="inv-page">
      <header className="inv-page-head">
        <div>
          <h1>决策日志</h1>
          <p className="inv-page-sub">
            学 Buffett/Munger 的写法：先写 <em>thesis</em>，再做 <em>pre-mortem（如果失败了，最可能是因为什么）</em>，
            最后过一遍 <em>认知偏差检查</em>。事后回来填 outcome 和 lesson。
          </p>
        </div>
        <div className="inv-page-actions">
          <label className="inv-checkbox">
            <input type="checkbox" checked={showPending} onChange={(e) => setShowPending(e.target.checked)} />
            <span>仅显示待复盘</span>
          </label>
          <button
            type="button"
            className="inv-btn inv-btn-primary"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
          >
            <Plus size={14} strokeWidth={2.2} />
            <span>新增一条</span>
          </button>
        </div>
      </header>

      {creating && (
        <JournalForm
          initial={emptyJournalDraft()}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          submitLabel="保存"
        />
      )}

      {filtered.length === 0 && !creating ? (
        <div className="inv-empty-card">
          <LayoutGrid size={28} strokeWidth={1.6} />
          <h3>{showPending ? "没有待复盘的决策。" : "决策日志还是空的。"}</h3>
          <p>
            {showPending
              ? "所有决策都已经写了 outcome 和 lesson — 这才是真正的复利。"
              : "可以先写一条 \"今天没下注，但我观察到了 X\"，让自己习惯把思考留下来。"}
          </p>
        </div>
      ) : (
        <ul className="inv-card-list">
          {filtered.map((entry) =>
            editingId === entry.id ? (
              <li key={entry.id}>
                <JournalForm
                  initial={entry}
                  onSubmit={(draft) => handleUpdate(entry.id, draft)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="保存修改"
                />
              </li>
            ) : (
              <li key={entry.id}>
                <JournalCard
                  entry={entry}
                  busy={busyId === entry.id}
                  onEdit={() => {
                    setEditingId(entry.id);
                    setCreating(false);
                  }}
                  onDelete={() => handleDelete(entry.id)}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function JournalCard({ entry, busy, onEdit, onDelete }) {
  const pending = !(entry.outcome || "").trim() || !(entry.lesson || "").trim();
  return (
    <article className={classes("inv-card", busy && "is-busy")}>
      <header className="inv-card-head">
        <div className="inv-card-title">
          <span className="inv-pillar-chip" data-direction={entry.direction}>
            {DIRECTION_LABEL[entry.direction]?.split(" · ")[0] || entry.direction}
          </span>
          <h3>
            <span>{entry.asset || "未命名标的"}</span>
            <code className="inv-ticker">{entry.date}</code>
          </h3>
          {pending && <span className="inv-pending-badge">待复盘</span>}
        </div>
        <div className="inv-card-actions">
          <button type="button" className="inv-icon-btn" onClick={onEdit} title="编辑">
            <Edit3 size={14} />
          </button>
          <button type="button" className="inv-icon-btn inv-danger" onClick={onDelete} title="删除">
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {(entry.thesis || "").trim() && <Field label="Thesis" value={entry.thesis} />}
      {(entry.pre_mortem || "").trim() && <Field label="Pre-mortem（最可能怎么失败）" value={entry.pre_mortem} />}

      {entry.cognitive_check?.length > 0 && (
        <div className="inv-checklist">
          <span className="inv-field-label">认知检查</span>
          <ul>
            {entry.cognitive_check.map((q, i) => (
              <li key={i}>· {q}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="inv-card-grid">
        {entry.size && <Field label="Size 仓位" value={entry.size} inline />}
        {entry.linked_watchlist?.length > 0 && (
          <Field label="Linked watchlist" value={joinList(entry.linked_watchlist)} inline />
        )}
        {entry.linked_models?.length > 0 && (
          <Field label="Linked models" value={joinList(entry.linked_models)} inline />
        )}
        {entry.tags?.length > 0 && <Field label="Tags" value={joinList(entry.tags)} inline />}
      </div>

      {(entry.outcome || "").trim() && <Field label="Outcome（事后结果）" value={entry.outcome} />}
      {(entry.lesson || "").trim() && <Field label="Lesson（学到了什么）" value={entry.lesson} />}
    </article>
  );
}

function JournalForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [draft, setDraft] = useState(() => ({ ...initial }));
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const toggleCheck = (q) =>
    setDraft((d) => {
      const list = Array.isArray(d.cognitive_check) ? d.cognitive_check : [];
      return list.includes(q)
        ? { ...d, cognitive_check: list.filter((x) => x !== q) }
        : { ...d, cognitive_check: [...list, q] };
    });

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...draft,
        cognitive_check: Array.isArray(draft.cognitive_check)
          ? draft.cognitive_check
          : splitList(draft.cognitive_check),
        linked_models: typeof draft.linked_models === "string" ? splitList(draft.linked_models) : draft.linked_models,
        linked_watchlist:
          typeof draft.linked_watchlist === "string" ? splitList(draft.linked_watchlist) : draft.linked_watchlist,
        tags: typeof draft.tags === "string" ? splitList(draft.tags) : draft.tags,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentChecks = Array.isArray(draft.cognitive_check) ? draft.cognitive_check : [];

  return (
    <form className="inv-form" onSubmit={submit}>
      <div className="inv-form-row">
        <label>
          <span>日期 <em>必填</em></span>
          <input type="date" value={draft.date} onChange={set("date")} required />
        </label>
        <label>
          <span>标的 / 资产 <em>必填</em></span>
          <input value={draft.asset} onChange={set("asset")} placeholder="如 BTC / 茅台 / AAPL" maxLength={120} required />
        </label>
        <label>
          <span>方向</span>
          <select value={draft.direction} onChange={set("direction")}>
            {DIRECTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="inv-form-full">
        <span>Thesis（为什么这个决策）</span>
        <textarea rows={4} value={draft.thesis} onChange={set("thesis")} />
      </label>

      <label className="inv-form-full">
        <span>Pre-mortem（如果一年后这个决策失败了，最可能的原因是什么）<em>这一栏价值最高</em></span>
        <textarea rows={3} value={draft.pre_mortem} onChange={set("pre_mortem")} />
      </label>

      <div className="inv-form-full">
        <span className="inv-field-label">认知偏差检查（勾选你过了一遍的问题）</span>
        <div className="inv-cog-grid">
          {DEFAULT_COGNITIVE_PROMPTS.map((q) => (
            <label key={q} className="inv-cog-item">
              <input type="checkbox" checked={currentChecks.includes(q)} onChange={() => toggleCheck(q)} />
              <span>{q}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="inv-form-row">
        <label>
          <span>Size 仓位 / 金额</span>
          <input value={draft.size} onChange={set("size")} placeholder="如 3% / 1 万元" />
        </label>
        <label>
          <span>Linked watchlist（ticker 或 slug）</span>
          <input
            value={Array.isArray(draft.linked_watchlist) ? draft.linked_watchlist.join(", ") : draft.linked_watchlist}
            onChange={set("linked_watchlist")}
          />
        </label>
        <label>
          <span>Linked models</span>
          <input
            value={Array.isArray(draft.linked_models) ? draft.linked_models.join(", ") : draft.linked_models}
            onChange={set("linked_models")}
            placeholder="如 margin-of-safety"
          />
        </label>
        <label>
          <span>Tags</span>
          <input
            value={Array.isArray(draft.tags) ? draft.tags.join(", ") : draft.tags}
            onChange={set("tags")}
          />
        </label>
      </div>

      <details className="inv-form-details">
        <summary>事后复盘（先写决策，过段时间回来填）</summary>
        <label className="inv-form-full">
          <span>Outcome（实际发生了什么）</span>
          <textarea rows={3} value={draft.outcome} onChange={set("outcome")} />
        </label>
        <label className="inv-form-full">
          <span>Lesson（学到什么，下次怎么改）</span>
          <textarea rows={3} value={draft.lesson} onChange={set("lesson")} />
        </label>
      </details>

      <div className="inv-form-actions">
        <button type="button" className="inv-btn" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="inv-btn inv-btn-primary" disabled={submitting}>
          {submitting ? <Loader2 size={14} className="inv-spin" /> : <Sparkles size={14} />}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}

// ============================================================
// Shared field renderer
// ============================================================

function Field({ label, value, inline = false }) {
  const text = (value ?? "").toString();
  if (!text.trim()) return null;
  return (
    <div className={classes("inv-field", inline && "is-inline")}>
      <span className="inv-field-label">{label}</span>
      <div className="inv-field-value">{text}</div>
    </div>
  );
}

// ============================================================
// Markdown reader (used by Knowledge + Models)
// ============================================================

const WIKI_LINK_RX = /\[\[([\w一-龥-]+)\]\]/g;
const WIKI_HREF_PREFIX = "#inv-link/";

function preprocessWikiLinks(body) {
  return String(body || "").replace(WIKI_LINK_RX, (_match, slug) => `[${slug}](${WIKI_HREF_PREFIX}${slug})`);
}

function MarkdownReader({ body, onWikiLink }) {
  const processed = useMemo(() => preprocessWikiLinks(body), [body]);
  const components = useMemo(
    () => ({
      a: ({ href, children, ...props }) => {
        if (href && href.startsWith(WIKI_HREF_PREFIX)) {
          const slug = href.slice(WIKI_HREF_PREFIX.length);
          return (
            <button
              type="button"
              className="inv-wiki-link"
              onClick={() => onWikiLink?.(slug)}
              title={`跳转到 [[${slug}]]`}
            >
              {children}
            </button>
          );
        }
        return (
          <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
            {children}
            <ExternalLink size={11} strokeWidth={2} className="inv-ext-icon" />
          </a>
        );
      },
    }),
    [onWikiLink],
  );
  return (
    <div className="inv-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processed}
      </ReactMarkdown>
    </div>
  );
}

function MetaHeader({ meta }) {
  if (!meta) return null;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  return (
    <header className="inv-doc-head">
      <div className="inv-doc-crumbs">
        {meta.pillar && <span className="inv-pillar-chip" data-pillar={meta.pillar}>{PILLAR_LABEL[meta.pillar] || meta.pillar}</span>}
        {meta.origin_field && <span className="inv-doc-origin">源：{meta.origin_field}</span>}
        {meta.created && <span className="inv-doc-date">{meta.created}</span>}
      </div>
      <h1>{meta.title || meta.slug}</h1>
      {meta.source && (
        <p className="inv-doc-source">出处：{meta.source}</p>
      )}
      {tags.length > 0 && (
        <div className="inv-doc-tags">
          {tags.map((t) => (
            <span key={t} className="inv-tag-chip">
              <Tag size={10} strokeWidth={2} /> {t}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

// ============================================================
// Knowledge view
// ============================================================

function KnowledgeView({ tree, selectedPath, onSelect, onWikiLink, onError }) {
  const [doc, setDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState({});

  // Auto-expand all categories on first load.
  useEffect(() => {
    if (!tree?.categories) return;
    setOpenCats((prev) => {
      const next = { ...prev };
      for (const cat of tree.categories) {
        if (next[cat.key] === undefined) next[cat.key] = true;
      }
      return next;
    });
  }, [tree]);

  // Load doc when selection changes.
  useEffect(() => {
    if (!selectedPath) {
      setDoc(null);
      return;
    }
    let alive = true;
    setLoadingDoc(true);
    fetchKnowledgeDoc(selectedPath)
      .then((d) => {
        if (alive) setDoc(d);
      })
      .catch((e) => {
        if (alive) onError(e.message || String(e));
      })
      .finally(() => {
        if (alive) setLoadingDoc(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedPath, onError]);

  const filteredTree = useMemo(() => {
    if (!tree) return null;
    const q = query.trim().toLowerCase();
    if (!q) return tree;
    return {
      ...tree,
      categories: tree.categories
        .map((cat) => ({
          ...cat,
          docs: cat.docs.filter((d) => {
            const hay = `${d.title} ${d.slug} ${(d.tags || []).join(" ")} ${d.one_line || ""}`.toLowerCase();
            return hay.includes(q);
          }),
        }))
        .filter((cat) => cat.docs.length > 0),
    };
  }, [tree, query]);

  if (!tree) {
    return (
      <div className="inv-loading">
        <Loader2 size={18} className="inv-spin" />
        <span>正在读取知识库…</span>
      </div>
    );
  }

  return (
    <div className="inv-twocol">
      <aside className="inv-twocol-side">
        <div className="inv-search-box">
          <Search size={14} strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="按标题 / 标签 / slug 过滤"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} title="清空">
              <X size={12} />
            </button>
          )}
        </div>

        {filteredTree.categories.length === 0 ? (
          <div className="inv-side-empty">
            {tree.total === 0
              ? "知识库还是空的。让 AI 按 README 节奏写就行。"
              : "当前过滤没有结果。"}
          </div>
        ) : (
          <nav className="inv-tree">
            {filteredTree.categories.map((cat) => {
              const open = openCats[cat.key] ?? true;
              return (
                <div key={cat.key} className="inv-tree-cat">
                  <button
                    type="button"
                    className="inv-tree-cat-head"
                    onClick={() => setOpenCats((p) => ({ ...p, [cat.key]: !open }))}
                  >
                    {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <span>{cat.label}</span>
                    <span className="inv-tree-count">{cat.docs.length}</span>
                  </button>
                  {open && (
                    <ul className="inv-tree-list">
                      {cat.docs.map((d) => (
                        <li key={d.path}>
                          <button
                            type="button"
                            className={classes("inv-tree-item", selectedPath === d.path && "is-active")}
                            onClick={() => onSelect(d.path)}
                            title={d.one_line || d.title}
                          >
                            <span className="inv-tree-title">{d.title}</span>
                            {d.tags?.length > 0 && (
                              <span className="inv-tree-tags">{d.tags.slice(0, 2).join(" · ")}</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </aside>

      <section className="inv-twocol-main">
        {!selectedPath ? (
          <KnowledgeOverview tree={tree} onPick={onSelect} />
        ) : loadingDoc ? (
          <div className="inv-loading">
            <Loader2 size={18} className="inv-spin" />
            <span>载入中…</span>
          </div>
        ) : doc ? (
          <article className="inv-doc">
            <MetaHeader meta={doc.meta} />
            <MarkdownReader body={doc.body} onWikiLink={onWikiLink} />
          </article>
        ) : (
          <p className="inv-empty">没找到这篇笔记。</p>
        )}
      </section>
    </div>
  );
}

function KnowledgeOverview({ tree, onPick }) {
  const resolve = (slug) => {
    for (const cat of tree?.categories || []) {
      const doc = (cat.docs || []).find((d) => d.slug === slug);
      if (doc) return { title: doc.title, target: doc.path };
    }
    return null;
  };
  const total = tree?.total ?? 0;

  return (
    <div className="inv-overview">
      <header>
        <p className="inv-home-eyebrow">Knowledge · 知识库</p>
        <h1>静态知识沉淀</h1>
        <p className="inv-page-sub">
          <strong>左侧</strong>是 {total} 篇完整目录（按 pillar 分组、可搜索过滤）。
          <strong>这里</strong>只做一件侧栏做不到的事：告诉你<em>从哪一篇开始读 + 为什么是这个顺序</em>。
        </p>
      </header>

      <section className="inv-curated">
        <h2>如果你刚开始，按这个顺序读</h2>
        <CuratedPath
          items={KNOWLEDGE_READING_PATH}
          resolve={resolve}
          onPick={onPick}
          emptyText="知识库还是空的。让 AI 按 README 节奏写就行。"
        />
      </section>
    </div>
  );
}

// ============================================================
// Models view
// ============================================================

function ModelsView({ items, selectedSlug, onSelect, onWikiLink, onError }) {
  const [model, setModel] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [query, setQuery] = useState("");
  const [pillarFilter, setPillarFilter] = useState("");

  useEffect(() => {
    if (!selectedSlug) {
      setModel(null);
      return;
    }
    let alive = true;
    setLoadingModel(true);
    fetchModel(selectedSlug)
      .then((m) => {
        if (alive) setModel(m);
      })
      .catch((e) => {
        if (alive) onError(e.message || String(e));
      })
      .finally(() => {
        if (alive) setLoadingModel(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedSlug, onError]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items.filter((m) => {
      if (pillarFilter && m.pillar !== pillarFilter) return false;
      if (!q) return true;
      const hay = `${m.title} ${m.slug} ${(m.tags || []).join(" ")} ${m.one_line || ""} ${m.origin_field || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, pillarFilter]);

  if (!items) {
    return (
      <div className="inv-loading">
        <Loader2 size={18} className="inv-spin" />
        <span>正在读取思维模型库…</span>
      </div>
    );
  }

  const pillarCounts = items.reduce((acc, m) => {
    const key = m.pillar || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="inv-twocol">
      <aside className="inv-twocol-side">
        <div className="inv-search-box">
          <Search size={14} strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="按名称 / 标签 / 来源学科搜"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              <X size={12} />
            </button>
          )}
        </div>
        <div className="inv-pillar-bar">
          <button
            type="button"
            className={classes("inv-pillar-btn", !pillarFilter && "is-active")}
            onClick={() => setPillarFilter("")}
          >
            全部 <span>{items.length}</span>
          </button>
          {PILLARS.map((p) =>
            pillarCounts[p.value] ? (
              <button
                key={p.value}
                type="button"
                className={classes("inv-pillar-btn", pillarFilter === p.value && "is-active")}
                onClick={() => setPillarFilter(p.value === pillarFilter ? "" : p.value)}
                data-pillar={p.value}
              >
                {p.short} <span>{pillarCounts[p.value]}</span>
              </button>
            ) : null,
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="inv-side-empty">
            {items.length === 0
              ? "思维模型库还是空的。让 AI 按 README 节奏写。"
              : "当前过滤没有结果。"}
          </div>
        ) : (
          <ul className="inv-model-list">
            {filtered.map((m) => (
              <li key={m.slug}>
                <button
                  type="button"
                  className={classes("inv-model-item", selectedSlug === m.slug && "is-active")}
                  onClick={() => onSelect(m.slug)}
                >
                  <div className="inv-model-row">
                    <span className="inv-pillar-chip" data-pillar={m.pillar}>{PILLAR_LABEL[m.pillar] || "?"}</span>
                    <span className="inv-model-title">{m.title}</span>
                  </div>
                  {m.one_line && <p className="inv-model-oneline">{m.one_line}</p>}
                  {m.origin_field && (
                    <span className="inv-model-origin">源：{m.origin_field}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="inv-twocol-main">
        {!selectedSlug ? (
          <ModelsOverview items={items} onPick={onSelect} />
        ) : loadingModel ? (
          <div className="inv-loading">
            <Loader2 size={18} className="inv-spin" />
            <span>载入中…</span>
          </div>
        ) : model ? (
          <article className="inv-doc">
            <MetaHeader meta={{ ...model.meta, slug: model.slug }} />
            <MarkdownReader body={model.body} onWikiLink={onWikiLink} />
          </article>
        ) : (
          <p className="inv-empty">没找到这个模型。</p>
        )}
      </section>
    </div>
  );
}

function ModelsOverview({ items, onPick }) {
  const resolve = (slug) => {
    const m = (items || []).find((x) => x.slug === slug);
    return m ? { title: m.title, target: m.slug } : null;
  };
  const total = items?.length ?? 0;

  return (
    <div className="inv-overview">
      <header>
        <p className="inv-home-eyebrow">Mental Models · 思维模型</p>
        <h1>多元思维框架</h1>
        <p className="inv-page-sub">
          Munger 的 lattice of mental models：从数学、物理、生物、心理、经济、哲学借来的<em>思维原语</em>。
          <strong>左侧</strong>是 {total} 个完整列表（按 pillar 过滤、可搜索）。
          <strong>这里</strong>只给 Munger 优先级最高的 6 个 + 为什么先学它们。
        </p>
      </header>

      <section className="inv-curated">
        <h2>如果你只学 6 个模型，学这些</h2>
        <CuratedPath
          items={MODELS_READING_PATH}
          resolve={resolve}
          onPick={onPick}
          emptyText="还没有模型。让 AI 按 README 节奏写就行。"
        />
      </section>
    </div>
  );
}

// ============================================================
// Cases view (历史投资案例)
// ============================================================

const OUTCOME_LABEL = {
  winner: "胜",
  loser: "败",
  mixed: "混",
};

function decadeOf(era) {
  const year = parseInt((era || "").slice(0, 4), 10);
  if (!year || Number.isNaN(year)) return "未定";
  return `${Math.floor(year / 10) * 10}s`;
}

function CasesView({ data, selectedSlug, onSelect, onWikiLink, onError }) {
  const [caseDoc, setCaseDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [pillarFilter, setPillarFilter] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!selectedSlug) {
      setCaseDoc(null);
      return;
    }
    let alive = true;
    setLoadingDoc(true);
    fetchCase(selectedSlug)
      .then((d) => {
        if (alive) setCaseDoc(d);
      })
      .catch((e) => {
        if (alive) onError(e.message || String(e));
      })
      .finally(() => {
        if (alive) setLoadingDoc(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedSlug, onError]);

  if (!data) {
    return (
      <div className="inv-loading">
        <Loader2 size={18} className="inv-spin" />
        <span>正在读取案例库…</span>
      </div>
    );
  }

  const items = data.items || [];
  const filtered = items.filter((c) => {
    if (outcomeFilter && c.winner_or_loser !== outcomeFilter) return false;
    if (pillarFilter && c.pillar !== pillarFilter) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${c.title} ${c.slug} ${(c.tags || []).join(" ")} ${c.one_line || ""} ${c.era || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Group by decade descending.
  const decades = new Map();
  for (const c of filtered) {
    const d = decadeOf(c.era);
    if (!decades.has(d)) decades.set(d, []);
    decades.get(d).push(c);
  }
  const groups = Array.from(decades.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="inv-twocol">
      <aside className="inv-twocol-side">
        <div className="inv-search-box">
          <Search size={14} strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="按标题 / 人物 / 年代搜"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="inv-pillar-bar">
          <button
            type="button"
            className={classes("inv-pillar-btn", !outcomeFilter && "is-active")}
            onClick={() => setOutcomeFilter("")}
          >
            全部 <span>{items.length}</span>
          </button>
          {["winner", "loser", "mixed"].map((o) =>
            (data.outcomes || {})[o] ? (
              <button
                key={o}
                type="button"
                className={classes("inv-pillar-btn", outcomeFilter === o && "is-active")}
                onClick={() => setOutcomeFilter(o === outcomeFilter ? "" : o)}
              >
                {OUTCOME_LABEL[o]} <span>{data.outcomes[o]}</span>
              </button>
            ) : null,
          )}
        </div>

        {Object.keys(data.pillars || {}).length > 1 && (
          <div className="inv-pillar-bar">
            {PILLARS.map((p) =>
              (data.pillars || {})[p.value] ? (
                <button
                  key={p.value}
                  type="button"
                  className={classes("inv-pillar-btn", pillarFilter === p.value && "is-active")}
                  onClick={() => setPillarFilter(p.value === pillarFilter ? "" : p.value)}
                  data-pillar={p.value}
                >
                  {p.short} <span>{data.pillars[p.value]}</span>
                </button>
              ) : null,
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="inv-side-empty">
            {items.length === 0 ? "案例库还是空的。" : "当前过滤没有结果。"}
          </div>
        ) : (
          <nav className="inv-tree">
            {groups.map(([decade, list]) => (
              <div key={decade} className="inv-tree-cat">
                <div className="inv-tree-cat-head" style={{ cursor: "default" }}>
                  <span style={{ marginLeft: 4 }}>{decade}</span>
                  <span className="inv-tree-count">{list.length}</span>
                </div>
                <ul className="inv-tree-list">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        className={classes("inv-tree-item", selectedSlug === c.slug && "is-active")}
                        onClick={() => onSelect(c.slug)}
                        title={c.one_line || c.title}
                      >
                        <span className="inv-brief-row">
                          <span className="inv-brief-key">{c.era}</span>
                          <span className={classes("inv-outcome-tag", `is-${c.winner_or_loser}`)}>
                            {OUTCOME_LABEL[c.winner_or_loser] || "?"}
                          </span>
                        </span>
                        <span className="inv-tree-title inv-brief-title">{c.title}</span>
                        {c.one_line && (
                          <span className="inv-tree-tags">{truncate(c.one_line, 48)}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>

      <section className="inv-twocol-main">
        {!selectedSlug ? (
          <CasesOverview data={data} onPick={onSelect} />
        ) : loadingDoc ? (
          <div className="inv-loading">
            <Loader2 size={18} className="inv-spin" />
            <span>载入中…</span>
          </div>
        ) : caseDoc ? (
          <article className="inv-doc">
            <CaseHeader meta={caseDoc.meta} />
            <MarkdownReader body={caseDoc.body} onWikiLink={onWikiLink} />
          </article>
        ) : (
          <p className="inv-empty">没找到这个案例。</p>
        )}
      </section>
    </div>
  );
}

function CaseHeader({ meta }) {
  if (!meta) return null;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const outcome = String(meta.winner_or_loser || "mixed").toLowerCase();
  return (
    <header className="inv-doc-head">
      <div className="inv-doc-crumbs">
        {meta.era && <span className="inv-pillar-chip" data-kind="daily">{meta.era}</span>}
        {meta.pillar && (
          <span className="inv-pillar-chip" data-pillar={meta.pillar}>
            {PILLAR_LABEL[meta.pillar] || meta.pillar}
          </span>
        )}
        <span className={classes("inv-outcome-tag", `is-${outcome}`)}>
          {outcome === "winner" ? "胜：值得学" : outcome === "loser" ? "败：值得避" : "混：复杂"}
        </span>
      </div>
      <h1>{meta.title || meta.slug}</h1>
      {meta.source && <p className="inv-doc-source">出处：{meta.source}</p>}
      {tags.length > 0 && (
        <div className="inv-doc-tags">
          {tags.map((t) => (
            <span key={t} className="inv-tag-chip">
              <Tag size={10} strokeWidth={2} /> {t}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

function CasesOverview({ data, onPick }) {
  const items = data.items || [];
  const resolve = (slug) => {
    const c = items.find((x) => x.slug === slug);
    return c ? { title: c.title, target: c.slug } : null;
  };

  return (
    <div className="inv-overview">
      <header>
        <p className="inv-home-eyebrow">Cases · 案例库</p>
        <h1>历史的非随机样本</h1>
        <p className="inv-page-sub">
          Munger："读历史是最便宜的教育——别人花一辈子学到的事，你只需要花一周读完。"
          <strong>左侧</strong>是 {items.length} 个完整时间轴（按年代分组、可按胜/败/混过滤）。
          <strong>这里</strong>是<em>推荐起手的 5 个</em>，按学习价值（不是时间）排序。
        </p>
      </header>

      <section className="inv-curated">
        <h2>如果你只读 5 个案例，读这些</h2>
        <CuratedPath
          items={CASES_READING_PATH}
          resolve={resolve}
          onPick={onPick}
          emptyText="案例库还是空的。"
        />
      </section>
    </div>
  );
}

// ============================================================
// Brief view (daily + weekly market notes)
// ============================================================

const MONTH_LABEL_CN = {
  "01": "一月", "02": "二月", "03": "三月", "04": "四月",
  "05": "五月", "06": "六月", "07": "七月", "08": "八月",
  "09": "九月", "10": "十月", "11": "十一月", "12": "十二月",
};

function formatYearMonthLabel(ym) {
  if (!/^\d{4}-\d{2}$/.test(ym || "")) return ym || "未知";
  const [y, m] = ym.split("-");
  return `${y} · ${MONTH_LABEL_CN[m] || m}`;
}

function BriefView({ list, kind, onKindChange, selectedPath, onSelect, onWikiLink, onError }) {
  const [doc, setDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    if (!selectedPath) {
      setDoc(null);
      return;
    }
    let alive = true;
    setLoadingDoc(true);
    fetchBriefDoc(selectedPath)
      .then((d) => {
        if (alive) setDoc(d);
      })
      .catch((e) => {
        if (alive) onError(e.message || String(e));
      })
      .finally(() => {
        if (alive) setLoadingDoc(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedPath, onError]);

  if (!list) {
    return (
      <div className="inv-loading">
        <Loader2 size={18} className="inv-spin" />
        <span>正在读取市场简报…</span>
      </div>
    );
  }

  const items = kind === "weekly" ? list.weekly : list.daily;
  const groups = (() => {
    if (kind === "weekly") {
      return [{ key: "all", label: "", items, showHeader: false }];
    }
    const byMonth = new Map();
    for (const it of items) {
      const ym = (it.date || it.slug || "").slice(0, 7);
      if (!byMonth.has(ym)) byMonth.set(ym, []);
      byMonth.get(ym).push(it);
    }
    return Array.from(byMonth.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([ym, list]) => ({
        key: ym,
        label: formatYearMonthLabel(ym),
        items: list,
        showHeader: true,
      }));
  })();

  return (
    <div className="inv-twocol">
      <aside className="inv-twocol-side">
        <div className="inv-brief-toggle">
          <button
            type="button"
            className={classes("inv-brief-toggle-btn", kind === "daily" && "is-active")}
            onClick={() => onKindChange("daily")}
          >
            每日 <span>{list.daily.length}</span>
          </button>
          <button
            type="button"
            className={classes("inv-brief-toggle-btn", kind === "weekly" && "is-active")}
            onClick={() => onKindChange("weekly")}
          >
            每周 <span>{list.weekly.length}</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="inv-side-empty">
            还没有{kind === "daily" ? "日报" : "周报"}。AI 按当日 / 当周生成。
          </div>
        ) : (
          <nav className="inv-tree">
            {groups.map((group) => (
              <div key={group.key} className="inv-tree-cat">
                {group.showHeader && (
                  <div className="inv-tree-cat-head" style={{ cursor: "default" }}>
                    <span style={{ marginLeft: 4 }}>{group.label}</span>
                    <span className="inv-tree-count">{group.items.length}</span>
                  </div>
                )}
                <ul className="inv-tree-list" style={!group.showHeader ? { paddingLeft: 0 } : undefined}>
                  {group.items.map((it) => (
                    <li key={it.path}>
                      <button
                        type="button"
                        className={classes("inv-tree-item", selectedPath === it.path && "is-active")}
                        onClick={() => onSelect(it.path)}
                        title={it.one_line || it.title}
                      >
                        <span className="inv-brief-row">
                          <span className="inv-brief-key">
                            {kind === "daily"
                              ? `${(it.date || "").slice(5)}${it.weekday ? " · " + it.weekday : ""}`
                              : it.slug}
                          </span>
                          {it.sample && <span className="inv-sample-tag">样本</span>}
                        </span>
                        <span className="inv-tree-title inv-brief-title">{it.title}</span>
                        {it.one_line && (
                          <span className="inv-tree-tags">{truncate(it.one_line, 40)}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>

      <section className="inv-twocol-main">
        {!selectedPath ? (
          <BriefOverview list={list} onPick={(path, k) => { onKindChange(k); onSelect(path); }} />
        ) : loadingDoc ? (
          <div className="inv-loading">
            <Loader2 size={18} className="inv-spin" />
            <span>载入中…</span>
          </div>
        ) : doc ? (
          <article className="inv-doc">
            {doc.meta?.sample && (
              <div className="inv-sample-banner">
                <strong>样本内容</strong> · 这份是 Phase 4 上线时的演示，
                数据为基于 2026 宏观环境的合理推演而非实时报价。真实日报/周报由 AI 在当日用真实数据生成。
              </div>
            )}
            <BriefHeader meta={doc.meta} kind={doc.kind} />
            <MarkdownReader body={doc.body} onWikiLink={onWikiLink} />
          </article>
        ) : (
          <p className="inv-empty">没找到这份简报。</p>
        )}
      </section>
    </div>
  );
}

function BriefHeader({ meta, kind }) {
  if (!meta) return null;
  return (
    <header className="inv-doc-head">
      <div className="inv-doc-crumbs">
        <span className="inv-pillar-chip" data-kind={kind}>
          {kind === "weekly" ? "Weekly · 每周" : "Daily · 每日"}
        </span>
        {kind === "daily" && meta.date && (
          <span className="inv-doc-date">{meta.date}{meta.weekday ? ` · ${meta.weekday}` : ""}</span>
        )}
        {kind === "weekly" && meta.week_start && meta.week_end && (
          <span className="inv-doc-date">{meta.week_start} → {meta.week_end}</span>
        )}
        {kind === "weekly" && meta.focus_industry && (
          <span className="inv-doc-origin">聚焦：{meta.focus_industry}</span>
        )}
        {meta.generated_by && (
          <span className="inv-doc-origin">by {meta.generated_by}</span>
        )}
      </div>
      <h1>{meta.title || meta.slug}</h1>
    </header>
  );
}

function BriefOverview({ list, onPick }) {
  const latestDaily = list.daily[0];
  const latestWeekly = list.weekly[0];

  return (
    <div className="inv-overview">
      <header>
        <p className="inv-home-eyebrow">Brief · 市场简报</p>
        <h1>日报 + 周报</h1>
        <p className="inv-page-sub">
          每日宏观速读（信号 + 噪音分流）和每周行业深度（Bull vs Bear 对撞）。
          <strong>左侧</strong>是完整时间轴（按月分组）；<strong>这里</strong>只聚焦
          <em>今天和本周</em>——简报的价值在时效，不在归档。
        </p>
      </header>

      {!latestDaily && !latestWeekly ? (
        <p className="inv-empty">还没有简报。AI 会按 README 模板在当日 / 当周生成。</p>
      ) : (
        <div className="inv-brief-spotlight">
          {latestDaily && (
            <article className="inv-spotlight-card">
              <span className="inv-spotlight-label">
                最新日报 · {latestDaily.date}
                {latestDaily.weekday ? ` · ${latestDaily.weekday}` : ""}
                {latestDaily.sample ? " · 样本" : ""}
              </span>
              <h2>
                <button type="button" onClick={() => onPick(latestDaily.path, "daily")}>
                  {latestDaily.title}
                </button>
              </h2>
              {latestDaily.one_line && (
                <p className="inv-spotlight-snippet">{latestDaily.one_line}</p>
              )}
            </article>
          )}
          {latestWeekly && (
            <article className="inv-spotlight-card">
              <span className="inv-spotlight-label">
                本周深度 · {latestWeekly.week_start} → {latestWeekly.week_end}
                {latestWeekly.sample ? " · 样本" : ""}
              </span>
              <h2>
                <button type="button" onClick={() => onPick(latestWeekly.path, "weekly")}>
                  {latestWeekly.title}
                </button>
              </h2>
              {latestWeekly.focus_industry && (
                <p className="inv-spotlight-focus">聚焦：{latestWeekly.focus_industry}</p>
              )}
              {latestWeekly.one_line && (
                <p className="inv-spotlight-snippet">{latestWeekly.one_line}</p>
              )}
            </article>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Placeholder for future phases
// ============================================================

function ComingSoonView({ tabId }) {
  const tab = TABS.find((t) => t.id === tabId);
  const Icon = tab?.icon || Library;
  return (
    <div className="inv-page">
      <div className="inv-soon">
        <div className="inv-soon-icon">
          <Icon size={32} strokeWidth={1.6} />
        </div>
        <h1>{tab?.label}</h1>
        <p>{SOON_DESCRIPTIONS[tabId] || "即将开放。"}</p>
        <div className="inv-soon-hint">
          <strong>怎么让它开放更快？</strong>
          <p>
            读仓库根目录 <code>Investment.md</code>，告诉 AI："开始做 Phase 3 — {tab?.label}"。
            AI 会先读 <code>backend/data/Investment/README.md</code> + <code>INDEX.md</code>，按节奏增量写。
          </p>
        </div>
      </div>
    </div>
  );
}
