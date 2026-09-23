import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, FileText, GripVertical, Menu,
  Pencil, Plus, Search, Trash2, X,
} from "lucide-react";
import { createNote, deleteNote, fetchNotes, searchNotes, updateNote } from "./api.js";
import "./styles.css";

const MONTHS = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const today = new Date();

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(key, withWeekday = false) {
  const date = parseDate(key);
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日${withWeekday ? ` · ${weekday}` : ""}`;
}

function monthCells(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return {
      key: dateKey(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    };
  });
}

function isToday(key) {
  return key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());
}

export default function CalendarApp() {
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(dateKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [activeNote, setActiveNote] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelMode, setPanelMode] = useState("day");
  const [quickTitle, setQuickTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const quickInput = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchNotes()
      .then((data) => { if (!cancelled) setNotes(data.notes || {}); })
      .catch(() => { if (!cancelled) setError("无法读取日历记录，请确认本地服务已启动。"); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (panelMode !== "search" || !query) {
      setSearchResults([]);
      setSearching(false);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      searchNotes(query)
        .then((data) => { if (!cancelled) setSearchResults(data.results || []); })
        .catch((caught) => { if (!cancelled) setError(caught.message || "搜索没有完成。"); })
        .finally(() => { if (!cancelled) setSearching(false); });
    }, 180);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [panelMode, searchQuery]);

  const cells = useMemo(() => monthCells(view.year, view.month), [view]);
  const selectedNotes = notes[selectedDate] || [];
  const selectedIndex = activeNote ? selectedNotes.findIndex((note) => note.id === activeNote.id) : -1;
  const isDraft = activeNote?.id === "draft";

  function pickDate(key) {
    setSelectedDate(key);
    setActiveNote(null);
    setPanelMode("day");
    setError("");
    const date = parseDate(key);
    if (date.getFullYear() !== view.year || date.getMonth() !== view.month) {
      setView({ year: date.getFullYear(), month: date.getMonth() });
    }
    setTimeout(() => quickInput.current?.focus(), 0);
  }

  function shiftMonth(amount) {
    const date = new Date(view.year, view.month + amount, 1);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  }

  function goToday() {
    const key = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    setView({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedDate(key);
    setActiveNote(null);
    setPanelMode("day");
  }

  async function addQuickNote(event) {
    event.preventDefault();
    const title = quickTitle.trim();
    if (!title || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await createNote({ date: selectedDate, title, detail: "" });
      setNotes(data.notes);
      setQuickTitle("");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSaving(false);
    }
  }

  function openDetail(note) {
    setPanelOpen(true);
    setPanelMode("day");
    setActiveNote({ ...note });
    setError("");
  }

  function openNewDetail() {
    if (selectedNotes.length >= 5) {
      setError("一天最多记录 5 件事。可以先整理或删除一条。")
      return;
    }
    setPanelOpen(true);
    setPanelMode("day");
    setActiveNote({ id: "draft", title: "", detail: "" });
    setError("");
  }

  function openSearch() {
    setPanelOpen(true);
    setPanelMode("search");
    setActiveNote(null);
    setError("");
  }

  function openSearchResult(result) {
    pickDate(result.date);
    setPanelOpen(true);
    setPanelMode("day");
    setActiveNote({ ...result.note });
  }

  async function saveDetail(event) {
    event.preventDefault();
    if (!activeNote || saving) return;
    const title = activeNote.title.trim();
    if (!title) {
      setError("给这件事写一个简短标题。")
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = isDraft
        ? await createNote({ date: selectedDate, title, detail: activeNote.detail.trim() })
        : await updateNote(activeNote.id, { title, detail: activeNote.detail.trim() });
      setNotes(data.notes);
      setActiveNote(data.note);
      if (isDraft) setActiveNote(data.note);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeActiveNote() {
    if (!activeNote || isDraft || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await deleteNote(activeNote.id);
      setNotes(data.notes);
      setActiveNote(null);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`cal-app${panelOpen ? " is-panel-open" : " is-panel-closed"}`}>
      <section className="cal-workspace" aria-label="月历">
        <header className="cal-header">
          <div className="cal-brand">
            <span className="cal-brand-mark"><CalendarDays size={19} /></span>
            <span>日历</span>
          </div>
          <div className="cal-month-nav" aria-label="切换月份">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="上个月"><ChevronLeft size={19} /></button>
            <button type="button" className="cal-month-name" onClick={goToday}>{view.year} 年 {MONTHS[view.month]}</button>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="下个月"><ChevronRight size={19} /></button>
          </div>
          <div className="cal-header-actions">
            <button type="button" className="cal-today-button" onClick={goToday}>今天</button>
            <button type="button" className="cal-search-button" onClick={openSearch}><Search size={16} /><span>搜索</span></button>
            <button type="button" className="cal-panel-button" onClick={() => setPanelOpen((value) => !value)} title={panelOpen ? "收起详情栏" : "展开详情栏"}>
              {panelOpen ? <X size={18} /> : <Menu size={19} />}
              <span>{panelOpen ? "收起" : "详情"}</span>
            </button>
          </div>
        </header>

        <div className="cal-grid" role="grid" aria-label={`${view.year} 年 ${MONTHS[view.month]}`}>
          {WEEKDAYS.map((day) => <div className="cal-weekday" key={day}>{day}</div>)}
          {cells.map((cell) => {
            const entries = notes[cell.key] || [];
            const selected = cell.key === selectedDate;
            return (
              <article
                className={`cal-day${cell.inMonth ? "" : " is-outside"}${selected ? " is-selected" : ""}${isToday(cell.key) ? " is-today" : ""}`}
                key={cell.key}
                onClick={() => pickDate(cell.key)}
                role="gridcell"
                aria-selected={selected}
              >
                <div className="cal-day-head"><span>{cell.day}</span>{entries.length > 0 && <small>{entries.length}</small>}</div>
                <div className="cal-day-notes">
                  {entries.slice(0, 5).map((note) => (
                    <div className="cal-note" key={note.id}>
                      <button type="button" className="cal-note-title" onClick={(event) => { event.stopPropagation(); openDetail(note); }} title="编辑这条记录">{note.title}</button>
                      <button type="button" className="cal-note-detail-button" onClick={(event) => { event.stopPropagation(); openDetail(note); }} aria-label={`查看 ${note.title} 的详情`} title="在右栏查看详情"><FileText size={13} /></button>
                    </div>
                  ))}
                </div>
                {entries.length < 5 && cell.inMonth && <button type="button" className="cal-day-add" aria-label={`${cell.day} 日添加记录`} onClick={(event) => { event.stopPropagation(); pickDate(cell.key); openNewDetail(); }}><Plus size={14} /></button>}
              </article>
            );
          })}
        </div>
      </section>

      <aside className="cal-panel" aria-label="当天记录">
        <div className="cal-panel-top">
          <p className="cal-panel-label">当天</p>
          <h1>{formatDate(selectedDate, true)}</h1>
          <p className="cal-panel-subtitle">{selectedNotes.length ? `已记下 ${selectedNotes.length} 件事` : "留下一件值得记住的小事"}</p>
        </div>

        {error && <p className="cal-error" role="alert">{error}</p>}

        {panelMode === "search" ? (
          <div className="cal-search-view">
            <div className="cal-search-view-head">
              <button type="button" className="cal-back-list" onClick={() => setPanelMode("day")}><ChevronLeft size={17} /> 返回当天</button>
              <span>全部日历</span>
            </div>
            <label className="cal-search-field">
              <Search size={17} />
              <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索标题或详情" aria-label="搜索全部日历" />
              {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="清空搜索"><X size={15} /></button>}
            </label>
            <div className="cal-search-results">
              {!searchQuery.trim() && <div className="cal-search-empty"><Search size={22} /><p>搜索所有月份的标题和详情。</p></div>}
              {searching && <p className="cal-search-status">正在搜索…</p>}
              {!searching && searchQuery.trim() && searchResults.length === 0 && <div className="cal-search-empty"><p>没有找到相关记录。</p></div>}
              {searchResults.map((result) => (
                <button type="button" className="cal-search-result" key={result.note.id} onClick={() => openSearchResult(result)}>
                  <span>{formatDate(result.date)}</span>
                  <strong>{result.note.title}</strong>
                  {result.note.detail && <small>{result.note.detail}</small>}
                </button>
              ))}
            </div>
          </div>
        ) : !activeNote ? (
          <>
            <form className="cal-quick-add" onSubmit={addQuickNote}>
              <input ref={quickInput} value={quickTitle} onChange={(event) => setQuickTitle(event.target.value)} maxLength="120" placeholder="写下一件事，按 Enter 保存" aria-label="快速记录" />
              <button type="submit" disabled={!quickTitle.trim() || saving} aria-label="保存记录"><Plus size={18} /></button>
            </form>
            <div className="cal-panel-list">
              {selectedNotes.map((note, index) => (
                <div className="cal-panel-note" key={note.id}>
                  <span className="cal-note-number">{pad(index + 1)}</span>
                  <button type="button" onClick={() => openDetail(note)}>{note.title}</button>
                  <button type="button" className="cal-open-note" onClick={() => openDetail(note)} aria-label={`编辑 ${note.title}`}><Pencil size={14} /></button>
                </div>
              ))}
              {selectedNotes.length === 0 && <div className="cal-empty"><span>•</span><p>还没有记录<br />从一件很小的事开始。</p></div>}
            </div>
            <button type="button" className="cal-detail-add" onClick={openNewDetail} disabled={selectedNotes.length >= 5}><Plus size={16} /> 写一条详细记录</button>
          </>
        ) : (
          <form className="cal-editor" onSubmit={saveDetail}>
            <div className="cal-editor-head">
              <button type="button" className="cal-back-list" onClick={() => { setActiveNote(null); setError(""); }}><ChevronLeft size={17} /> 返回当天</button>
              {!isDraft && <button type="button" className="cal-delete-button" onClick={removeActiveNote} disabled={saving} aria-label="删除记录"><Trash2 size={16} /></button>}
            </div>
            <label>
              <span>标题</span>
              <input autoFocus value={activeNote.title} onChange={(event) => setActiveNote({ ...activeNote, title: event.target.value })} maxLength="120" placeholder="例如：带宝宝洗澡" />
            </label>
            <label className="cal-detail-field">
              <span>详情 <em>可留空</em></span>
              <textarea value={activeNote.detail} onChange={(event) => setActiveNote({ ...activeNote, detail: event.target.value })} maxLength="8000" placeholder="补充一点背景、花费、感受或之后要记得的事…" />
            </label>
            <div className="cal-editor-footer">
              {!isDraft && <span><GripVertical size={14} /> 第 {selectedIndex + 1} 条</span>}
              <button type="submit" disabled={saving}>{saving ? "保存中…" : "保存记录"}</button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
