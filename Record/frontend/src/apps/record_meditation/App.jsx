import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bold,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  FileSpreadsheet,
  Heading2,
  Italic,
  KeyRound,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Lock,
  PenSquare,
  Plus,
  Quote,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import "./styles.css";
import {
  changePassword as changePasswordApi,
  createEntry,
  deleteEntry,
  exportAllUrl,
  exportCsvUrl,
  exportMonthUrl,
  exportYearUrl,
  fetchCalendar,
  fetchMonth,
  search as searchApi,
  updateEntry,
  verifyPassword,
} from "./services/api";

const MAX_PASSWORD_ATTEMPTS = 3;

const MONTH_LABEL_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_LABEL_ZH = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function escapeHtml(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatRelative(iso) {
  if (!iso) return "";
  try {
    const dt = new Date(iso);
    const diff = Date.now() - dt.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 30 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return dt.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Editor — a tiny contenteditable wrapper with a toolbar.
// ---------------------------------------------------------------------------

function Editor({ valueRef, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && valueRef.current !== ref.current.innerHTML) {
      ref.current.innerHTML = valueRef.current || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = useCallback(
    (command, arg) => {
      document.execCommand(command, false, arg);
      if (ref.current) onChange(ref.current.innerHTML);
      ref.current?.focus();
    },
    [onChange],
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("链接地址:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  return (
    <div className="rec-editor">
      <div className="rec-editor-toolbar" role="toolbar">
        <button type="button" title="加粗" onClick={() => exec("bold")}><Bold size={14} /></button>
        <button type="button" title="斜体" onClick={() => exec("italic")}><Italic size={14} /></button>
        <button type="button" title="二级标题" onClick={() => exec("formatBlock", "<h2>")}><Heading2 size={14} /></button>
        <button type="button" title="引用" onClick={() => exec("formatBlock", "<blockquote>")}><Quote size={14} /></button>
        <button type="button" title="无序列表" onClick={() => exec("insertUnorderedList")}><List size={14} /></button>
        <button type="button" title="有序列表" onClick={() => exec("insertOrderedList")}><ListOrdered size={14} /></button>
        <button type="button" title="链接" onClick={insertLink}><Link2 size={14} /></button>
        <span className="rec-editor-hint">Markdown 不支持，直接输入即可，工具条用于排版</span>
      </div>
      <div
        ref={ref}
        className="rec-editor-area"
        contentEditable
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar — calendar nav (years → months → days)
// ---------------------------------------------------------------------------

function Sidebar({
  calendar,
  loading,
  activeKey,
  openYear,
  openMonth,
  onPickMonth,
  onPickDay,
  onNew,
  query,
  onQuery,
  tagFilter,
  onTagFilter,
  allTags,
  onChangePassword,
  collapsed,
  onToggleCollapse,
}) {
  if (collapsed) {
    return (
      <aside className="rec-sidebar is-collapsed">
        <button
          type="button"
          className="rec-sidebar-toggle"
          onClick={onToggleCollapse}
          title="展开侧栏"
          aria-label="展开侧栏"
        >
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }
  // Group months into years (in order they came from the API: newest first)
  const years = useMemo(() => {
    const map = new Map();
    for (const month of calendar?.months || []) {
      if (!map.has(month.year)) map.set(month.year, []);
      map.get(month.year).push(month);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
  }, [calendar]);

  return (
    <aside className="rec-sidebar">
      <div className="rec-brand">
        <div className="rec-brand-mark"><PenSquare size={18} /></div>
        <div className="rec-brand-text">
          <p>Record &amp; Meditation</p>
          <span>记录 · 反思 · 复盘</span>
        </div>
        <button
          type="button"
          className="rec-sidebar-toggle"
          onClick={onToggleCollapse}
          title="折叠侧栏"
          aria-label="折叠侧栏"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      <button type="button" className="rec-new-button" onClick={onNew}>
        <Plus size={16} /> 新建条目
      </button>

      <button type="button" className="rec-lock-trigger" onClick={onChangePassword}>
        <KeyRound size={13} /> 修改密码
      </button>

      <label className="rec-search">
        <Search size={14} />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="搜索标题 / 摘要 / 正文"
        />
        {query && (
          <button type="button" onClick={() => onQuery("")} aria-label="clear">
            <X size={12} />
          </button>
        )}
      </label>

      {allTags.length > 0 && (
        <div className="rec-tag-row">
          <button
            type="button"
            className={classes("rec-tag-chip", !tagFilter && "is-active")}
            onClick={() => onTagFilter("")}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={classes("rec-tag-chip", tagFilter === tag && "is-active")}
              onClick={() => onTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <nav className="rec-tree" aria-label="时间导航">
        {loading && (
          <div className="rec-loading-nav">
            <Loader2 className="rec-spin" size={14} />
            <span>加载中…</span>
          </div>
        )}
        {years.length === 0 && !loading && (
          <p className="rec-empty">还没有任何条目，点上面的「新建条目」开始吧。</p>
        )}
        {years.map(([year, months]) => (
          <div key={year} className="rec-year">
            <div className="rec-year-head">
              <Calendar size={13} /> {year}
              <small>{months.reduce((sum, m) => sum + m.count, 0)} 条</small>
            </div>
            {months.map((month) => {
              const monthKey = `${month.year}-${String(month.month).padStart(2, "0")}`;
              const open = openYear === month.year && openMonth === month.month;
              return (
                <div key={monthKey} className={classes("rec-month", open && "is-open")}>
                  <button
                    type="button"
                    className={classes("rec-month-button", activeKey === monthKey && "is-selected")}
                    onClick={() => onPickMonth(month.year, month.month)}
                  >
                    <ChevronRight size={13} className={open ? "is-rotated" : ""} />
                    <span>{MONTH_LABEL_EN[month.month - 1]} · {MONTH_LABEL_ZH[month.month - 1]}</span>
                    <small>{month.count}</small>
                  </button>
                  {open && (
                    <div className="rec-day-list">
                      {month.days.map((day) => (
                        <button
                          key={`${monthKey}-${day.day}`}
                          type="button"
                          className="rec-day-button"
                          onClick={() => onPickDay(month.year, month.month, day.day)}
                        >
                          <span>{String(day.day).padStart(2, "0")}</span>
                          <small>{day.count}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Entry card — collapsed view + expand to full body
// ---------------------------------------------------------------------------

function EntryCard({ entry, expanded, onToggle, onEdit, onDelete }) {
  return (
    <article className={classes("rec-card", expanded && "is-expanded")}>
      <header className="rec-card-head">
        <div className="rec-card-date">
          <strong>{entry.date}</strong>
          <small>{formatRelative(entry.updatedAt)}</small>
        </div>
        <div className="rec-card-title-wrap">
          <h3 className="rec-card-title" onClick={onToggle}>
            {entry.mood && <span className="rec-card-mood">{entry.mood}</span>}
            {entry.title}
          </h3>
          {(entry.tags || []).length > 0 && (
            <div className="rec-card-tags">
              {(entry.tags || []).map((tag) => (
                <span key={tag} className="rec-card-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="rec-card-actions">
          <button type="button" onClick={onEdit} title="编辑"><PenSquare size={15} /></button>
          <button type="button" onClick={onDelete} title="删除" className="is-danger"><Trash2 size={15} /></button>
        </div>
      </header>
      {!expanded && (
        <p className="rec-card-summary" onClick={onToggle}>{entry.summary}</p>
      )}
      {expanded && (
        <div
          className="rec-card-body"
          /* trusted: body was sanitised on the server */
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      )}
      <footer className="rec-card-foot">
        <span>{entry.wordCount || 0} 词</span>
        <button type="button" className="rec-collapse" onClick={onToggle}>
          {expanded ? "折叠" : "展开"}
        </button>
      </footer>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Editor modal — used for both "new" and "edit"
// ---------------------------------------------------------------------------

function EditorModal({ initial, onClose, onSave }) {
  const [date, setDate] = useState(initial?.date || todayIso());
  const [title, setTitle] = useState(initial?.title || "");
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(", "));
  const [mood, setMood] = useState(initial?.mood || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const bodyRef = useRef(initial?.body || "");

  const setBody = useCallback((html) => {
    bodyRef.current = html;
  }, []);

  const submit = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      await onSave({
        date,
        title: title.trim() || "Untitled",
        body: bodyRef.current || "",
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        mood: mood.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  }, [date, title, tagsText, mood, onSave, onClose]);

  return (
    <div className="rec-modal-backdrop" onClick={onClose}>
      <div className="rec-modal" onClick={(event) => event.stopPropagation()}>
        <header className="rec-modal-head">
          <h2>{initial ? "编辑条目" : "新建条目"}</h2>
          <button type="button" onClick={onClose} aria-label="close"><X size={18} /></button>
        </header>
        <div className="rec-modal-row">
          <label>
            <span>日期</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="rec-flex-1">
            <span>标题</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="一句话总结今天的想法" />
          </label>
          <label className="rec-mood-input">
            <span>心情</span>
            <input value={mood} onChange={(event) => setMood(event.target.value)} placeholder="🌤" maxLength={4} />
          </label>
        </div>
        <label className="rec-modal-tags">
          <span>标签（逗号分隔）</span>
          <input value={tagsText} onChange={(event) => setTagsText(event.target.value)} placeholder="AI对话, 读书笔记, 反思" />
        </label>
        <Editor valueRef={bodyRef} onChange={setBody} placeholder="今天的想法 / 笔记 / 感想 …" />
        {error && <div className="rec-modal-error">{error}</div>}
        <footer className="rec-modal-foot">
          <button type="button" className="rec-secondary" onClick={onClose}>取消</button>
          <button type="button" className="rec-primary" onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="rec-spin" size={14} /> : <Save size={14} />}
            <span>{saving ? "保存中…" : "保存"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password gate
// ---------------------------------------------------------------------------

function LockScreen({ onUnlock, onCancel, attemptsLeft }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(async (event) => {
    event?.preventDefault?.();
    if (busy || !password) return;
    setBusy(true);
    setError("");
    try {
      const result = await verifyPassword(password);
      if (result.ok) {
        onUnlock();
        return;
      }
      setError(result.error || "密码错误");
      setPassword("");
      onCancel(); // count this as a failed attempt
    } catch (err) {
      setError(err.message || "验证失败");
    } finally {
      setBusy(false);
    }
  }, [password, busy, onUnlock, onCancel]);

  return (
    <div className="rec-lock">
      <form className="rec-lock-card" onSubmit={submit}>
        <div className="rec-lock-icon"><Lock size={26} /></div>
        <h2>Record &amp; Meditation</h2>
        <p className="rec-lock-sub">这是私人记录区，请输入密码进入。初始密码 123456，进入后可在左侧「修改密码」中更换。</p>
        <label className="rec-lock-field">
          <span>密码</span>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••"
            autoComplete="current-password"
          />
        </label>
        {error && <div className="rec-lock-error">{error}</div>}
        <p className="rec-lock-hint">密码以 bcrypt 加密保存在本地数据目录，无法被反向破解。</p>
        <div className="rec-lock-actions">
          <button type="submit" className="rec-lock-primary" disabled={busy || !password}>
            {busy ? <Loader2 className="rec-spin" size={14} /> : <Lock size={14} />}
            <span>{busy ? "验证中…" : "进入"}</span>
          </button>
        </div>
        <p className="rec-lock-attempts">还剩 {attemptsLeft} 次机会，错误 3 次将返回主页。</p>
      </form>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async (event) => {
    event?.preventDefault?.();
    setError("");
    setSuccess("");
    if (!current || !next) {
      setError("请填写当前密码和新密码。");
      return;
    }
    if (next.length < 4) {
      setError("新密码至少 4 个字符。");
      return;
    }
    if (next !== confirm) {
      setError("两次输入的新密码不一致。");
      return;
    }
    setBusy(true);
    try {
      const result = await changePasswordApi(current, next);
      if (result.ok) {
        setSuccess("密码已更新。");
        setCurrent("");
        setNext("");
        setConfirm("");
      } else {
        setError(result.error || "修改失败");
      }
    } catch (err) {
      setError(err.message || "修改失败");
    } finally {
      setBusy(false);
    }
  }, [current, next, confirm]);

  return (
    <div className="rec-modal-backdrop" onClick={onClose}>
      <div className="rec-modal" onClick={(event) => event.stopPropagation()}>
        <header className="rec-modal-head">
          <h2>修改密码</h2>
          <button type="button" onClick={onClose} aria-label="close"><X size={18} /></button>
        </header>
        <form onSubmit={submit}>
          <div className="rec-modal-row">
            <label className="rec-flex-1">
              <span>当前密码</span>
              <input type="password" value={current} onChange={(event) => setCurrent(event.target.value)} autoComplete="current-password" />
            </label>
          </div>
          <div className="rec-modal-row">
            <label className="rec-flex-1">
              <span>新密码</span>
              <input type="password" value={next} onChange={(event) => setNext(event.target.value)} autoComplete="new-password" />
            </label>
            <label className="rec-flex-1">
              <span>确认新密码</span>
              <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
            </label>
          </div>
          {error && <div className="rec-modal-error">{error}</div>}
          {success && <div className="rec-lock-error" style={{ background: "#e7f5ec", color: "#2b7b73" }}>{success}</div>}
          <footer className="rec-modal-foot">
            <button type="button" className="rec-secondary" onClick={onClose}>关闭</button>
            <button type="submit" className="rec-primary" disabled={busy}>
              {busy ? <Loader2 className="rec-spin" size={14} /> : <Save size={14} />}
              <span>{busy ? "保存中…" : "更新密码"}</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

export default function RecordMeditationApp() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const attemptsLeft = Math.max(0, MAX_PASSWORD_ATTEMPTS - attempts);

  const handleFailedAttempt = useCallback(() => {
    setAttempts((current) => {
      const next = current + 1;
      if (next >= MAX_PASSWORD_ATTEMPTS) {
        navigate("/", { replace: true });
      }
      return next;
    });
  }, [navigate]);

  if (!unlocked) {
    return (
      <LockScreen
        onUnlock={() => setUnlocked(true)}
        onCancel={handleFailedAttempt}
        attemptsLeft={attemptsLeft}
      />
    );
  }

  return <RecordMeditationAppInner />;
}

function RecordMeditationAppInner() {
  const [calendar, setCalendar] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitial, setEditorInitial] = useState(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filterDay, setFilterDay] = useState(null);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshCalendar = useCallback(async () => {
    setLoadingCalendar(true);
    try {
      const data = await fetchCalendar();
      setCalendar(data);
      if (!year || !month) {
        const first = data.months?.[0];
        if (first) {
          setYear(first.year);
          setMonth(first.month);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCalendar(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshCalendar();
  }, [refreshCalendar]);

  const reloadMonth = useCallback(async (y, m) => {
    if (!y || !m) return;
    setLoadingMonth(true);
    try {
      const data = await fetchMonth(y, m);
      setMonthData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMonth(false);
    }
  }, []);

  useEffect(() => {
    reloadMonth(year, month);
    setFilterDay(null);
  }, [year, month, reloadMonth]);

  // Debounced search
  useEffect(() => {
    const needle = query.trim();
    if (!needle && !tagFilter) {
      setSearchResults(null);
      return undefined;
    }
    setSearching(true);
    const handle = window.setTimeout(async () => {
      try {
        const data = await searchApi({ q: needle, tag: tagFilter });
        setSearchResults(data.matches || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [query, tagFilter]);

  const onPickMonth = useCallback((y, m) => {
    setYear(y);
    setMonth(m);
    setFilterDay(null);
    setSearchResults(null);
  }, []);

  const onPickDay = useCallback((y, m, d) => {
    setYear(y);
    setMonth(m);
    setFilterDay(d);
    setSearchResults(null);
  }, []);

  const openNew = useCallback(() => {
    setEditorInitial(null);
    setEditorOpen(true);
  }, []);

  const openEdit = useCallback((entry) => {
    setEditorInitial(entry);
    setEditorOpen(true);
  }, []);

  const handleSave = useCallback(
    async (payload) => {
      if (editorInitial) {
        await updateEntry(editorInitial.id, payload);
      } else {
        await createEntry(payload);
      }
      await refreshCalendar();
      // After save, jump to that entry's month.
      const [y, m] = payload.date.split("-").map(Number);
      setYear(y);
      setMonth(m);
      await reloadMonth(y, m);
    },
    [editorInitial, refreshCalendar, reloadMonth],
  );

  const handleDelete = useCallback(
    async (entry) => {
      if (!window.confirm(`确定删除 “${entry.title}” 吗？此操作不可撤销。`)) return;
      try {
        await deleteEntry(entry.id);
        await refreshCalendar();
        await reloadMonth(year, month);
      } catch (err) {
        setError(err.message);
      }
    },
    [refreshCalendar, reloadMonth, year, month],
  );

  // What to show in the right pane:
  const displayedEntries = useMemo(() => {
    if (searchResults !== null) {
      // search mode returns summaries — we have to fetch body lazily, so show summaries with no expand
      return searchResults.map((row) => ({ ...row, body: "" }));
    }
    const list = monthData?.entries || [];
    if (filterDay) {
      const want = `-${String(filterDay).padStart(2, "0")}`;
      return list.filter((entry) => entry.date.endsWith(want));
    }
    return list;
  }, [searchResults, monthData, filterDay]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const m of calendar?.months || []) {
      for (const tag of m.tags || []) set.add(tag);
    }
    return [...set].sort();
  }, [calendar]);

  const activeKey = year && month ? `${year}-${String(month).padStart(2, "0")}` : "";
  const monthTotal = monthData?.entries?.length || 0;
  const heroTitle = searchResults !== null
    ? "搜索结果"
    : year && month
      ? `${year} · ${MONTH_LABEL_EN[month - 1]} / ${MONTH_LABEL_ZH[month - 1]}`
      : "选择一个月份开始";

  return (
    <div className={classes("rec-shell", sidebarCollapsed && "is-sidebar-collapsed")}>
      <Sidebar
        calendar={calendar}
        loading={loadingCalendar}
        activeKey={activeKey}
        openYear={year}
        openMonth={month}
        onPickMonth={onPickMonth}
        onPickDay={onPickDay}
        onNew={openNew}
        query={query}
        onQuery={setQuery}
        tagFilter={tagFilter}
        onTagFilter={setTagFilter}
        allTags={allTags}
        onChangePassword={() => setChangePwOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />

      <main className="rec-content">
        <section className="rec-hero">
          <div className="rec-hero-main">
            <div className="rec-kicker">
              <Sparkles size={14} />
              <span>记录想法、读书笔记、AI 对话、讲座感想；以后每月、每年都能整体回看</span>
            </div>
            <h1>{heroTitle}</h1>
            <p>
              {searchResults !== null
                ? `共找到 ${displayedEntries.length} 条`
                : filterDay
                  ? `${year}-${String(month).padStart(2, "0")}-${String(filterDay).padStart(2, "0")} · ${displayedEntries.length} 条`
                  : `本月共 ${monthTotal} 条，按日期倒序`}
            </p>
          </div>
          <div className="rec-export">
            <h4>导出</h4>
            <div className="rec-export-row">
              {year && month && (
                <a className="rec-export-btn" href={exportMonthUrl(year, month)} target="_blank" rel="noreferrer">
                  <FileDown size={14} /> 本月 JSON
                </a>
              )}
              {year && (
                <a className="rec-export-btn" href={exportYearUrl(year)} target="_blank" rel="noreferrer">
                  <Download size={14} /> {year} 年打包
                </a>
              )}
              <a className="rec-export-btn" href={exportCsvUrl()} target="_blank" rel="noreferrer">
                <FileSpreadsheet size={14} /> 全部 CSV 索引
              </a>
              <a className="rec-export-btn" href={exportAllUrl()} target="_blank" rel="noreferrer">
                <Download size={14} /> 全部打包
              </a>
            </div>
            <p className="rec-export-hint">CSV 与 backend/data/RecordMeditation/entries-index.csv 同步，可以直接用 Excel 浏览历史回顾。</p>
          </div>
        </section>

        {error && (
          <div className="rec-error" role="alert">
            {error}
            <button type="button" onClick={() => setError("")}>×</button>
          </div>
        )}

        {(loadingMonth || searching) && (
          <div className="rec-loading">
            <Loader2 className="rec-spin" size={18} /> 加载中…
          </div>
        )}

        <section className="rec-list">
          {displayedEntries.length === 0 && !loadingMonth && !searching && (
            <div className="rec-empty-state">
              {searchResults !== null
                ? "没有匹配的条目，换个关键词或者标签试试。"
                : "这一段还没有条目。右上角「+ 新建条目」开始记录吧。"}
            </div>
          )}
          {displayedEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id && searchResults === null}
              onToggle={() => {
                if (searchResults !== null) {
                  // jump to that entry's month + expand
                  const [y, m] = entry.date.split("-").map(Number);
                  setQuery("");
                  setTagFilter("");
                  setSearchResults(null);
                  setYear(y);
                  setMonth(m);
                  setExpandedId(entry.id);
                  return;
                }
                setExpandedId((id) => (id === entry.id ? "" : entry.id));
              }}
              onEdit={() => openEdit(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))}
        </section>
      </main>

      {editorOpen && (
        <EditorModal
          initial={editorInitial}
          onClose={() => setEditorOpen(false)}
          onSave={handleSave}
        />
      )}

      {changePwOpen && (
        <ChangePasswordModal onClose={() => setChangePwOpen(false)} />
      )}
    </div>
  );
}
