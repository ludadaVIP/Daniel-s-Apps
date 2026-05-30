import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  Copy,
  Edit3,
  Flame,
  FolderPlus,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Plus,
  Repeat2,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";

import "./styles.css";
import {
  createDate,
  createRecurring,
  createTodo,
  deleteDate,
  deleteRecurring,
  deleteTodo,
  duplicateTodo,
  fetchDate,
  fetchPlanner,
  updateDate,
  updateRecurring,
  updateTodo,
} from "./services/api";

const STATUS_OPTIONS = [
  { value: "todo", label: "未开始" },
  { value: "doing", label: "进行中" },
  { value: "done", label: "已完成" },
  { value: "skipped", label: "跳过" },
];

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "紧急" },
  { value: "high", label: "高" },
  { value: "normal", label: "普通" },
  { value: "low", label: "低" },
];

const ENERGY_OPTIONS = [
  { value: "high", label: "高能量" },
  { value: "medium", label: "中等" },
  { value: "low", label: "低能量" },
];

const MONTH_NAMES = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const WEEKDAY_OPTIONS = [
  { value: 1, label: "周一" },
  { value: 2, label: "周二" },
  { value: 3, label: "周三" },
  { value: 4, label: "周四" },
  { value: 5, label: "周五" },
  { value: 6, label: "周六" },
  { value: 0, label: "周日" },
];

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function localDateIso(date = new Date()) {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return copy.toISOString().slice(0, 10);
}

function dateLabel(date) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      weekday: "short",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(`${date}T12:00:00`));
  } catch {
    return date;
  }
}

function shiftDate(date, amount) {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + amount);
  return localDateIso(next);
}

function progress(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function makeDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function displayDateTitle(day, fallbackDate, today = localDateIso(), compact = false) {
  const date = day?.date || fallbackDate || "";
  if (!date) return "";
  if (date === today) return "今天";
  if (day?.title && day.title !== date && day.title !== "今天") return day.title;
  return compact ? dateLabel(date).replace(/^\d{2}\/\d{2}/, "") : date;
}

function sidebarDayTitle(day, today = localDateIso()) {
  return displayDateTitle(day, day?.date, today, true);
}

function nextTodoAction(status) {
  if (status === "todo") return { label: "开始", next: "doing" };
  if (status === "doing") return { label: "完成", next: "done" };
  return { label: "重开", next: "todo" };
}

function monthWindow(monthText) {
  const [year, month] = monthText.split("-").map(Number);
  const first = new Date(year, month - 1, 1, 12);
  const last = new Date(year, month, 0, 12);
  const start = new Date(first);
  start.setDate(first.getDate() - 31);
  const end = new Date(last);
  end.setDate(last.getDate() + 92);
  return { start: localDateIso(start), end: localDateIso(end) };
}

function monthCells(monthText) {
  const [year, month] = monthText.split("-").map(Number);
  const first = new Date(year, month - 1, 1, 12);
  const last = new Date(year, month, 0, 12);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const cells = [];
  const current = new Date(start);
  while (cells.length < 42) {
    cells.push({
      date: localDateIso(current),
      inMonth: current.getMonth() === month - 1,
      day: current.getDate(),
    });
    current.setDate(current.getDate() + 1);
  }
  return cells;
}

function plannerDayMap(planner) {
  const map = new Map();
  for (const year of planner.tree || []) {
    for (const month of year.months || []) {
      for (const day of month.days || []) {
        map.set(day.date, day);
      }
    }
  }
  return map;
}

function DateModal({ initialDate, onClose, onSave }) {
  const [date, setDate] = useState(initialDate?.date || localDateIso());
  const [title, setTitle] = useState(initialDate?.title || "");
  const [notes, setNotes] = useState(initialDate?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({ date, title: title.trim() || date, notes });
      onClose();
    } catch (err) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="todo-modal-backdrop" onMouseDown={onClose}>
      <form className="todo-date-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{initialDate ? "编辑日期" : "新增日期"}</h2>
          <button type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        </header>
        <label>
          <span>日期</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          <span>标题</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：周一深度工作日" />
        </label>
        <label>
          <span>日计划备注</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="今天最重要的原则、限制或提醒" />
        </label>
        {error && <div className="todo-form-error">{error}</div>}
        <footer>
          <button type="button" className="todo-secondary" onClick={onClose}>取消</button>
          <button type="submit" className="todo-primary" disabled={saving}>
            {saving ? <Loader2 className="todo-spin" size={15} /> : <CalendarDays size={15} />}
            <span>{saving ? "保存中" : "保存日期"}</span>
          </button>
        </footer>
      </form>
    </div>
  );
}

function TodoModal({ initial, date, sections, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    date: initial?.date || date,
    title: initial?.title || "",
    status: initial?.status || "todo",
    priority: initial?.priority || "normal",
    section: initial?.section || sections[0] || "日常事务",
    startTime: initial?.startTime || "",
    dueTime: initial?.dueTime || "",
    estimateMinutes: initial?.estimateMinutes || 25,
    energy: initial?.energy || "medium",
    tags: (initial?.tags || []).join(", "),
    pinned: Boolean(initial?.pinned),
    notes: initial?.notes || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        date: form.date || date,
        estimateMinutes: Number(form.estimateMinutes) || 0,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="todo-modal-backdrop" onMouseDown={onClose}>
      <form className="todo-editor-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{initial?.id ? "编辑 Todo" : "新建 Todo"}</h2>
          <button type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        </header>
        <label className="todo-wide">
          <span>事项</span>
          <input value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="写下一个可执行动作" autoFocus />
        </label>
        <div className="todo-form-grid">
          <label>
            <span>日期</span>
            <input type="date" value={form.date} onChange={(event) => setField("date", event.target.value)} />
          </label>
          <label>
            <span>状态</span>
            <select value={form.status} onChange={(event) => setField("status", event.target.value)}>
              {STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>优先级</span>
            <select value={form.priority} onChange={(event) => setField("priority", event.target.value)}>
              {PRIORITY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>分类</span>
            <input list="todo-sections" value={form.section} onChange={(event) => setField("section", event.target.value)} />
            <datalist id="todo-sections">
              {sections.map((section) => <option key={section} value={section} />)}
            </datalist>
          </label>
          <label>
            <span>能量</span>
            <select value={form.energy} onChange={(event) => setField("energy", event.target.value)}>
              {ENERGY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>开始</span>
            <input type="time" value={form.startTime} onChange={(event) => setField("startTime", event.target.value)} />
          </label>
          <label>
            <span>截止</span>
            <input type="time" value={form.dueTime} onChange={(event) => setField("dueTime", event.target.value)} />
          </label>
          <label>
            <span>预计分钟</span>
            <input type="number" min="0" max="1440" value={form.estimateMinutes} onChange={(event) => setField("estimateMinutes", event.target.value)} />
          </label>
          <label className="todo-checkbox">
            <input type="checkbox" checked={form.pinned} onChange={(event) => setField("pinned", event.target.checked)} />
            <span>固定在顶部</span>
          </label>
        </div>
        <label className="todo-wide">
          <span>标签（逗号分隔）</span>
          <input value={form.tags} onChange={(event) => setField("tags", event.target.value)} placeholder="工作, 家庭, 健康" />
        </label>
        <label className="todo-wide">
          <span>备注</span>
          <textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="背景、检查标准、下一步" />
        </label>
        {error && <div className="todo-form-error">{error}</div>}
        <footer>
          <button type="button" className="todo-secondary" onClick={onClose}>取消</button>
          <button type="submit" className="todo-primary" disabled={saving}>
            {saving ? <Loader2 className="todo-spin" size={15} /> : <CheckCircle2 size={15} />}
            <span>{saving ? "保存中" : "保存 Todo"}</span>
          </button>
        </footer>
      </form>
    </div>
  );
}

function RecurringModal({ initial, date, sections, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    title: initial?.title || "",
    frequency: initial?.frequency || "daily",
    weekdays: initial?.weekdays || [1, 2, 3, 4, 5],
    startDate: initial?.startDate || date,
    endDate: initial?.endDate || "",
    active: initial?.active ?? true,
    priority: initial?.priority || "normal",
    section: initial?.section || sections[0] || "日常事务",
    startTime: initial?.startTime || "",
    dueTime: initial?.dueTime || "",
    estimateMinutes: initial?.estimateMinutes || 30,
    energy: initial?.energy || "medium",
    tags: (initial?.tags || []).join(", "),
    notes: initial?.notes || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleWeekday = (value) => {
    setForm((current) => {
      const next = current.weekdays.includes(value)
        ? current.weekdays.filter((item) => item !== value)
        : [...current.weekdays, value].sort((a, b) => a - b);
      return { ...current, weekdays: next };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        estimateMinutes: Number(form.estimateMinutes) || 0,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="todo-modal-backdrop" onMouseDown={onClose}>
      <form className="todo-editor-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{initial ? "编辑重复任务" : "新建重复任务"}</h2>
          <button type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        </header>
        <label className="todo-wide">
          <span>任务</span>
          <input value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="例如：学习西语半小时" autoFocus />
        </label>
        <div className="todo-form-grid">
          <label>
            <span>规律</span>
            <select value={form.frequency} onChange={(event) => setField("frequency", event.target.value)}>
              <option value="daily">每天</option>
              <option value="weekdays">工作日</option>
              <option value="weekly">每周指定日</option>
            </select>
          </label>
          <label>
            <span>开始日期</span>
            <input type="date" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} />
          </label>
          <label>
            <span>结束日期</span>
            <input type="date" value={form.endDate} onChange={(event) => setField("endDate", event.target.value)} />
          </label>
          <label>
            <span>分类</span>
            <input list="todo-sections" value={form.section} onChange={(event) => setField("section", event.target.value)} />
          </label>
          <label>
            <span>优先级</span>
            <select value={form.priority} onChange={(event) => setField("priority", event.target.value)}>
              {PRIORITY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>开始</span>
            <input type="time" value={form.startTime} onChange={(event) => setField("startTime", event.target.value)} />
          </label>
          <label>
            <span>截止</span>
            <input type="time" value={form.dueTime} onChange={(event) => setField("dueTime", event.target.value)} />
          </label>
          <label>
            <span>预计分钟</span>
            <input type="number" min="0" max="1440" value={form.estimateMinutes} onChange={(event) => setField("estimateMinutes", event.target.value)} />
          </label>
        </div>
        {form.frequency === "weekly" && (
          <div className="todo-weekday-row">
            {WEEKDAY_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.value}
                className={form.weekdays.includes(item.value) ? "is-active" : ""}
                onClick={() => toggleWeekday(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <label className="todo-wide">
          <span>标签（逗号分隔）</span>
          <input value={form.tags} onChange={(event) => setField("tags", event.target.value)} placeholder="学习, 西语, 每日" />
        </label>
        <label className="todo-wide">
          <span>备注</span>
          <textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="规则、目标或检查标准" />
        </label>
        <label className="todo-checkbox todo-wide">
          <input type="checkbox" checked={form.active} onChange={(event) => setField("active", event.target.checked)} />
          <span>启用这个重复任务</span>
        </label>
        {error && <div className="todo-form-error">{error}</div>}
        <footer>
          <button type="button" className="todo-secondary" onClick={onClose}>取消</button>
          <button type="submit" className="todo-primary" disabled={saving}>
            {saving ? <Loader2 className="todo-spin" size={15} /> : <Repeat2 size={15} />}
            <span>{saving ? "保存中" : "保存重复任务"}</span>
          </button>
        </footer>
      </form>
    </div>
  );
}

function Sidebar({
  planner,
  activeDate,
  today,
  collapsed,
  openYears,
  openMonths,
  onToggleCollapsed,
  onToggleYear,
  onToggleMonth,
  onSelectDate,
  onNewDate,
  onEditDay,
  onDeleteDay,
  onAddYear,
  onMoveYear,
  onDeleteYear,
  onAddMonth,
  onMoveMonth,
  onDeleteMonth,
}) {
  if (collapsed) {
    return (
      <aside className="todo-sidebar is-collapsed">
        <button type="button" className="todo-collapse-button" onClick={onToggleCollapsed} title="展开左栏">
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="todo-sidebar">
      <div className="todo-brand">
        <div className="todo-brand-mark"><ClipboardList size={20} /></div>
        <div>
          <p>Daily Todo</p>
          <span>{planner.stats?.dates || 0} 天 · {planner.stats?.open || 0} 个未完成</span>
        </div>
        <button type="button" className="todo-collapse-button" onClick={onToggleCollapsed} title="折叠左栏">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="todo-sidebar-actions">
        <button type="button" onClick={onNewDate}><Plus size={15} /> 日期</button>
        <button type="button" onClick={onAddYear}><FolderPlus size={15} /> 年</button>
      </div>

      <nav className="todo-tree" aria-label="每日计划日期">
        {(planner.tree || []).map((year) => {
          const yearOpen = openYears.has(year.year);
          return (
            <section key={year.year} className="todo-tree-year">
              <div className="todo-tree-row todo-year-row">
                <button type="button" onClick={() => onToggleYear(year.year)} className="todo-tree-main">
                  {yearOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  <span>{year.year}</span>
                  <small>{year.done}/{year.total}</small>
                </button>
                <button type="button" onClick={() => onAddMonth(year.year)} title="新增月份"><Plus size={13} /></button>
                <button type="button" onClick={() => onMoveYear(year)} title="修改年份"><Edit3 size={13} /></button>
                <button type="button" onClick={() => onDeleteYear(year)} title="删除年份"><Trash2 size={13} /></button>
              </div>
              {yearOpen && year.months.map((month) => {
                const monthKey = `${year.year}-${month.month}`;
                const monthOpen = openMonths.has(monthKey);
                return (
                  <div key={monthKey} className="todo-tree-month">
                    <div className="todo-tree-row todo-month-row">
                      <button type="button" onClick={() => onToggleMonth(monthKey)} className="todo-tree-main">
                        {monthOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span>{String(month.month).padStart(2, "0")} · {MONTH_NAMES[month.month - 1]}</span>
                        <small>{month.done}/{month.total}</small>
                      </button>
                      <button type="button" onClick={() => onNewDate(makeDate(year.year, month.month, 1))} title="新增日期"><Plus size={12} /></button>
                      <button type="button" onClick={() => onMoveMonth(month)} title="修改月份"><Edit3 size={12} /></button>
                      <button type="button" onClick={() => onDeleteMonth(month)} title="删除月份"><Trash2 size={12} /></button>
                    </div>
                    {monthOpen && (
                      <div className="todo-day-list">
                        {month.days.map((day) => (
                          <div key={day.date} className={classes("todo-day-row", activeDate === day.date && "is-active")}>
                            <button type="button" onClick={() => onSelectDate(day.date)} className="todo-day-main" title={day.title}>
                              <span className="todo-day-num">{String(day.day).padStart(2, "0")}</span>
                              <span className="todo-day-copy">
                                <strong>{sidebarDayTitle(day, today)}</strong>
                                <em>{day.open} 未完</em>
                              </span>
                              <small>{progress(day.done, day.total)}%</small>
                            </button>
                            <div className="todo-day-actions">
                              <button type="button" onClick={() => onEditDay(day)} title="编辑日期"><Edit3 size={12} /></button>
                              <button type="button" onClick={() => onDeleteDay(day.date)} title="删除日期"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

function TodoCard({ todo, onEdit, onDelete, onDuplicate, onStatus, onPin }) {
  const statusLabel = STATUS_OPTIONS.find((item) => item.value === todo.status)?.label || todo.status;
  const priorityLabel = PRIORITY_OPTIONS.find((item) => item.value === todo.priority)?.label || todo.priority;
  const statusAction = nextTodoAction(todo.status);
  return (
    <article className={classes("todo-card", `priority-${todo.priority}`, todo.status === "done" && "is-done", todo.pinned && "is-pinned")}>
      <div className={`todo-status-indicator status-${todo.status}`} title={`当前状态：${statusLabel}`}>
        {todo.status === "done" ? <CheckCircle2 size={20} /> : todo.status === "doing" ? <Flame size={20} /> : <Circle size={20} />}
        <span>{statusLabel}</span>
      </div>
      <div className="todo-card-body">
        <div className="todo-card-mainline">
          <div className="todo-card-title-line">
            {todo.pinned && <Star size={14} />}
            <h3>{todo.title}</h3>
          </div>
          <div className="todo-card-meta">
            <span className={`todo-pill priority-${todo.priority}`}>{priorityLabel}</span>
            <span>{todo.section}</span>
            {(todo.startTime || todo.dueTime) && <span>{todo.startTime || "--:--"} - {todo.dueTime || "--:--"}</span>}
            {todo.estimateMinutes > 0 && <span>{todo.estimateMinutes} 分钟</span>}
            {todo.energy && <span>{ENERGY_OPTIONS.find((item) => item.value === todo.energy)?.label || todo.energy}</span>}
            {(todo.tags || []).length > 0 && <span className="todo-inline-tags">{todo.tags.map((tag) => `#${tag}`).join(" ")}</span>}
            {todo.notes && <span className="todo-note-preview">{todo.notes}</span>}
          </div>
        </div>
      </div>
      <div className="todo-card-actions">
        <button type="button" className="todo-status-action" onClick={() => onStatus(statusAction.next)}>{statusAction.label}</button>
        <button type="button" onClick={() => onPin(!todo.pinned)} title="固定"><Star size={14} /></button>
        <button type="button" onClick={onDuplicate} title="复制到今天"><Copy size={14} /></button>
        <button type="button" onClick={onEdit} title="编辑"><Edit3 size={14} /></button>
        <button type="button" onClick={onDelete} title="删除" className="is-danger"><Trash2 size={14} /></button>
      </div>
    </article>
  );
}

function frequencyLabel(rule) {
  if (rule.frequency === "daily") return "每天";
  if (rule.frequency === "weekdays") return "工作日";
  const labels = (rule.weekdays || []).map((value) => WEEKDAY_OPTIONS.find((item) => item.value === value)?.label).filter(Boolean);
  return labels.length ? labels.join(" / ") : "每周";
}

function RecurringPanel({ rules, onNew, onEdit, onDelete }) {
  return (
    <section className="todo-recurring-panel">
      <header>
        <div>
          <p><Repeat2 size={15} /> 重复任务</p>
          <span>{rules.length} 条规律计划</span>
        </div>
        <button type="button" onClick={onNew}><Plus size={14} /> 新建</button>
      </header>
      {rules.length === 0 ? (
        <div className="todo-recurring-empty">把每天、每周固定要做的事放在这里。</div>
      ) : (
        <div className="todo-recurring-list">
          {rules.map((rule) => (
            <article key={rule.id} className={classes("todo-recurring-card", !rule.active && "is-paused")}>
              <div>
                <strong>{rule.title}</strong>
                <span>{frequencyLabel(rule)} · {rule.startDate}{rule.endDate ? ` - ${rule.endDate}` : ""}</span>
              </div>
              <small>{rule.estimateMinutes || 0} 分钟</small>
              <button type="button" onClick={() => onEdit(rule)} title="编辑"><Edit3 size={13} /></button>
              <button type="button" onClick={() => onDelete(rule)} title="删除"><Trash2 size={13} /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RecurringManagerModal({ rules, onClose, onNew, onEdit, onDelete }) {
  return (
    <div className="todo-modal-backdrop" onMouseDown={onClose}>
      <div className="todo-recurring-manager" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <h2>重复任务</h2>
            <span>{rules.length} 条规律计划，会自动生成到对应日期</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        </header>
        <RecurringPanel
          rules={rules}
          onNew={onNew}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

function CalendarView({ planner, month, activeDate, onMonth, onSelectDate, onNewTodo }) {
  const dayMap = useMemo(() => plannerDayMap(planner), [planner]);
  const cells = useMemo(() => monthCells(month), [month]);
  const [year, monthNumber] = month.split("-").map(Number);
  const moveMonth = (amount) => {
    const next = new Date(year, monthNumber - 1 + amount, 1, 12);
    onMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <section className="todo-calendar-view">
      <header className="todo-calendar-head">
        <button type="button" onClick={() => moveMonth(-1)} title="上个月"><ChevronLeft size={16} /></button>
        <div>
          <h2>{year} · {MONTH_NAMES[monthNumber - 1]}</h2>
          <span>安排未来事项，或查看重复任务生成后的日程密度</span>
        </div>
        <button type="button" onClick={() => moveMonth(1)} title="下个月"><ChevronRight size={16} /></button>
      </header>
      <div className="todo-calendar-weekdays">
        {["日", "一", "二", "三", "四", "五", "六"].map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="todo-calendar-grid">
        {cells.map((cell) => {
          const day = dayMap.get(cell.date);
          return (
            <div
              key={cell.date}
              className={classes("todo-calendar-cell", !cell.inMonth && "is-muted", activeDate === cell.date && "is-active")}
            >
              <button type="button" className="todo-calendar-day-button" onClick={() => onSelectDate(cell.date)}>
                <span>{cell.day}</span>
                {day && (
                  <div>
                    <strong>{day.open} open</strong>
                    <small>{day.done}/{day.total} done</small>
                  </div>
                )}
              </button>
              <button type="button" className="todo-calendar-add" onClick={() => onNewTodo(cell.date)} title="添加到这一天">
                <CalendarPlus size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DailyTodoApp() {
  const [today, setToday] = useState(localDateIso());
  const [planner, setPlanner] = useState({ tree: [], sections: [], recurring: [], tags: [], stats: {} });
  const [activeDate, setActiveDate] = useState(localDateIso());
  const [viewMode, setViewMode] = useState("day");
  const [calendarMonth, setCalendarMonth] = useState(localDateIso().slice(0, 7));
  const [dayData, setDayData] = useState(null);
  const [loadingPlanner, setLoadingPlanner] = useState(true);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openYears, setOpenYears] = useState(() => new Set([Number(localDateIso().slice(0, 4))]));
  const [openMonths, setOpenMonths] = useState(() => new Set([`${Number(localDateIso().slice(0, 4))}-${Number(localDateIso().slice(5, 7))}`]));
  const [dateModal, setDateModal] = useState(null);
  const [todoModal, setTodoModal] = useState(null);
  const [recurringModal, setRecurringModal] = useState(null);
  const [recurringManagerOpen, setRecurringManagerOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const loadPlanner = useCallback(async () => {
    setLoadingPlanner(true);
    setError("");
    try {
      const data = await fetchPlanner(monthWindow(calendarMonth));
      setPlanner(data);
      const hasActive = data.tree?.some((year) => year.months.some((month) => month.days.some((day) => day.date === activeDate)));
      if (!hasActive && activeDate !== localDateIso()) {
        const firstDate = data.tree?.[0]?.months?.[0]?.days?.[0]?.date;
        if (firstDate) setActiveDate(firstDate);
      }
      return data;
    } catch (err) {
      setError(err.message || "加载失败");
      return null;
    } finally {
      setLoadingPlanner(false);
    }
  }, [activeDate, calendarMonth]);

  const loadDay = useCallback(async (date) => {
    if (!date) return;
    setLoadingDay(true);
    setError("");
    try {
      const data = await fetchDate(date);
      setDayData(data);
    } catch (err) {
      if (err.message?.includes("not found")) {
        if (date === localDateIso()) {
          await createDate({ date, title: date });
          const data = await fetchDate(date);
          setDayData(data);
        } else {
          setDayData(null);
        }
      } else {
        setError(err.message || "加载日期失败");
      }
    } finally {
      setLoadingDay(false);
    }
  }, []);

  useEffect(() => {
    loadPlanner();
  }, [loadPlanner]);

  useEffect(() => {
    loadDay(activeDate);
    setCalendarMonth(activeDate.slice(0, 7));
    const year = Number(activeDate.slice(0, 4));
    const month = Number(activeDate.slice(5, 7));
    setOpenYears((current) => new Set([...current, year]));
    setOpenMonths((current) => new Set([...current, `${year}-${month}`]));
  }, [activeDate, loadDay]);

  useEffect(() => {
    const syncToday = () => {
      const currentToday = localDateIso();
      setToday((previousToday) => {
        if (previousToday === currentToday) return previousToday;
        setActiveDate((currentActive) => (currentActive === previousToday ? currentToday : currentActive));
        setCalendarMonth(currentToday.slice(0, 7));
        return currentToday;
      });
    };
    syncToday();
    const timer = window.setInterval(syncToday, 60 * 60_000);
    window.addEventListener("focus", syncToday);
    document.addEventListener("visibilitychange", syncToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", syncToday);
      document.removeEventListener("visibilitychange", syncToday);
    };
  }, []);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  const sections = useMemo(() => {
    const fromTodos = new Set((dayData?.todos || []).map((todo) => todo.section).filter(Boolean));
    return [...new Set([...(planner.sections || []), ...fromTodos])];
  }, [dayData, planner]);

  const visibleTodos = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (dayData?.todos || [])
      .filter((todo) => {
        if (statusFilter !== "all" && todo.status !== statusFilter) return false;
        if (sectionFilter !== "all" && todo.section !== sectionFilter) return false;
        if (!text) return true;
        return `${todo.title} ${todo.notes} ${(todo.tags || []).join(" ")}`.toLowerCase().includes(text);
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [dayData, query, sectionFilter, statusFilter]);

  const dayStats = useMemo(() => {
    const todos = dayData?.todos || [];
    const done = todos.filter((todo) => todo.status === "done").length;
    const doing = todos.filter((todo) => todo.status === "doing").length;
    const minutes = todos.reduce((sum, todo) => sum + (Number(todo.estimateMinutes) || 0), 0);
    return { total: todos.length, done, doing, open: todos.length - done, minutes, pct: progress(done, todos.length) };
  }, [dayData]);

  const saveDateModal = async (payload) => {
    if (dateModal?.mode === "edit") {
      const oldDate = dateModal.initial.date;
      const updated = await updateDate(oldDate, payload);
      setActiveDate(updated.date);
      await loadPlanner();
      await loadDay(updated.date);
      setStatus("日期已更新");
      return;
    }
    const created = await createDate(payload);
    setActiveDate(created.date);
    await loadPlanner();
    await loadDay(created.date);
    setStatus("日期已创建");
  };

  const saveTodoModal = async (payload) => {
    if (todoModal?.initial?.id) {
      await updateTodo(todoModal.initial.id, payload);
      setStatus("Todo 已更新");
    } else {
      await createTodo(payload);
      setStatus("Todo 已创建");
    }
    setActiveDate(payload.date || activeDate);
    await loadPlanner();
    await loadDay(payload.date || activeDate);
  };

  const saveRecurringModal = async (payload) => {
    if (recurringModal?.initial) {
      await updateRecurring(recurringModal.initial.id, payload);
      setStatus("重复任务已更新");
    } else {
      await createRecurring(payload, monthWindow(calendarMonth));
      setStatus("重复任务已创建");
    }
    await loadPlanner();
    await loadDay(activeDate);
  };

  const quickAdd = async (event) => {
    event.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;
    await createTodo({
      date: activeDate,
      title,
      section: sections[0] || "日常事务",
      priority: "normal",
      status: "todo",
      estimateMinutes: 25,
    });
    setQuickTitle("");
    await loadPlanner();
    await loadDay(activeDate);
  };

  const handleDeleteDay = async (date) => {
    if (!window.confirm(`删除 ${date} 以及这一天所有 todos？`)) return;
    await deleteDate(date);
    const data = await loadPlanner();
    const nextDate = data?.tree?.[0]?.months?.[0]?.days?.[0]?.date || localDateIso();
    setActiveDate(nextDate);
    setStatus("日期已删除");
  };

  const batchMoveDates = async (days, makeTarget, label) => {
    if (!days.length) return;
    if (!window.confirm(`${label} 会移动 ${days.length} 个日期以及其中所有 todos，继续吗？`)) return;
    for (const day of days) {
      const target = makeTarget(day.date);
      await updateDate(day.date, { date: target, title: day.title, notes: day.notes || "" });
    }
    await loadPlanner();
    setActiveDate(makeTarget(days[0].date));
    setStatus("日期结构已更新");
  };

  const handleAddYear = async () => {
    const year = window.prompt("新增年份:", String(new Date().getFullYear()));
    if (!year || !/^\d{4}$/.test(year)) return;
    const date = `${year}-01-01`;
    const created = await createDate({ date, title: `${year} 年计划起点` });
    setActiveDate(created.date);
    await loadPlanner();
  };

  const handleMoveYear = async (year) => {
    const next = window.prompt("修改年份为:", String(year.year));
    if (!next || !/^\d{4}$/.test(next) || Number(next) === year.year) return;
    const days = year.months.flatMap((month) => month.days);
    await batchMoveDates(days, (date) => `${next}${date.slice(4)}`, `把 ${year.year} 年改为 ${next} 年`);
  };

  const handleDeleteYear = async (year) => {
    const days = year.months.flatMap((month) => month.days);
    if (!window.confirm(`删除 ${year.year} 年下的 ${days.length} 天及 todos？`)) return;
    for (const day of days) await deleteDate(day.date);
    const data = await loadPlanner();
    setActiveDate(data?.tree?.[0]?.months?.[0]?.days?.[0]?.date || localDateIso());
  };

  const handleAddMonth = async (year) => {
    const month = window.prompt("新增月份 1-12:", String(new Date().getMonth() + 1));
    const number = Number(month);
    if (!Number.isInteger(number) || number < 1 || number > 12) return;
    const date = makeDate(year, number, 1);
    const created = await createDate({ date, title: `${year}-${String(number).padStart(2, "0")} 月计划` });
    setActiveDate(created.date);
    await loadPlanner();
  };

  const handleMoveMonth = async (month) => {
    const next = window.prompt("修改月份为 1-12:", String(month.month));
    const number = Number(next);
    if (!Number.isInteger(number) || number < 1 || number > 12 || number === month.month) return;
    await batchMoveDates(month.days, (date) => `${date.slice(0, 5)}${String(number).padStart(2, "0")}${date.slice(7)}`, `把 ${month.month} 月改为 ${number} 月`);
  };

  const handleDeleteMonth = async (month) => {
    if (!window.confirm(`删除 ${month.year}-${String(month.month).padStart(2, "0")} 下的 ${month.days.length} 天及 todos？`)) return;
    for (const day of month.days) await deleteDate(day.date);
    const data = await loadPlanner();
    setActiveDate(data?.tree?.[0]?.months?.[0]?.days?.[0]?.date || localDateIso());
  };

  const mutateTodo = async (todo, payload) => {
    await updateTodo(todo.id, payload);
    await loadPlanner();
    await loadDay(activeDate);
  };

  const handleDeleteRecurring = async (rule) => {
    if (!window.confirm(`删除重复任务 “${rule.title}”？未来未完成的自动实例也会移除。`)) return;
    await deleteRecurring(rule.id);
    await loadPlanner();
    await loadDay(activeDate);
    setStatus("重复任务已删除");
  };

  return (
    <div className={classes("todo-shell", sidebarCollapsed && "is-sidebar-collapsed")}>
      <Sidebar
        planner={planner}
        activeDate={activeDate}
        today={today}
        collapsed={sidebarCollapsed}
        openYears={openYears}
        openMonths={openMonths}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        onToggleYear={(year) => setOpenYears((current) => {
          const next = new Set(current);
          if (next.has(year)) next.delete(year);
          else next.add(year);
          return next;
        })}
        onToggleMonth={(month) => setOpenMonths((current) => {
          const next = new Set(current);
          if (next.has(month)) next.delete(month);
          else next.add(month);
          return next;
        })}
        onSelectDate={setActiveDate}
        onNewDate={(date) => setDateModal({ mode: "new", initial: { date: date || activeDate } })}
        onEditDay={(day) => setDateModal({ mode: "edit", initial: day })}
        onDeleteDay={handleDeleteDay}
        onAddYear={handleAddYear}
        onMoveYear={handleMoveYear}
        onDeleteYear={handleDeleteYear}
        onAddMonth={handleAddMonth}
        onMoveMonth={handleMoveMonth}
        onDeleteMonth={handleDeleteMonth}
      />

      <main className="todo-main">
        <header className="todo-topbar">
          <div className="todo-date-switcher">
            <button type="button" onClick={() => setActiveDate(shiftDate(activeDate, -1))} title="前一天"><ChevronLeft size={16} /></button>
            <div>
              <p>{displayDateTitle(dayData?.date, activeDate, today)}</p>
              <span>{activeDate} · {dateLabel(activeDate)}</span>
            </div>
            <button type="button" onClick={() => setActiveDate(shiftDate(activeDate, 1))} title="后一天"><ChevronRight size={16} /></button>
          </div>
          <div className="todo-top-actions">
            <div className="todo-view-switch" role="tablist" aria-label="视图">
              <button type="button" className={viewMode === "day" ? "is-active" : ""} onClick={() => setViewMode("day")}>
                <LayoutList size={14} /> 今日
              </button>
              <button type="button" className={viewMode === "calendar" ? "is-active" : ""} onClick={() => setViewMode("calendar")}>
                <CalendarRange size={14} /> 月历
              </button>
            </div>
            <button type="button" onClick={() => setDateModal({ mode: dayData ? "edit" : "new", initial: dayData?.date || { date: activeDate } })}>
              <Edit3 size={15} /> 日期
            </button>
            <button type="button" onClick={() => setRecurringManagerOpen(true)}>
              <Repeat2 size={15} /> 重复 {planner.recurring?.length || 0}
            </button>
            <button type="button" className="todo-primary-action" onClick={() => setTodoModal({ initial: null })}>
              <Plus size={15} /> Todo
            </button>
          </div>
        </header>

        {(error || status) && (
          <div className={classes("todo-message", error && "is-error")}>
            {error || status}
            <button type="button" onClick={() => { setError(""); setStatus(""); }}>×</button>
          </div>
        )}

        {viewMode === "calendar" ? (
          <>
            <CalendarView
              planner={planner}
              month={calendarMonth}
              activeDate={activeDate}
              onMonth={setCalendarMonth}
              onSelectDate={(date) => {
                setActiveDate(date);
                setViewMode("day");
              }}
              onNewTodo={(date) => {
                setActiveDate(date);
                setTodoModal({ initial: { date } });
              }}
            />
          </>
        ) : (
          <>
            <section className="todo-overview">
              <div className="todo-focus-panel">
                <div className="todo-kicker"><Sparkles size={14} /> 今日计划</div>
                <h1>{dayStats.open > 0 ? `还有 ${dayStats.open} 件事要推进` : "今天的清单干净了"}</h1>
                <p>{dayData?.date?.notes || "把今天变成一个可执行的清单：先定最重要的动作，再安排时间和能量。"}</p>
                <form className="todo-quick-add" onSubmit={quickAdd}>
                  <input value={quickTitle} onChange={(event) => setQuickTitle(event.target.value)} placeholder="快速添加一个待办" />
                  <button type="submit"><Plus size={15} /></button>
                </form>
              </div>
              <div className="todo-stats-grid">
                <div><CheckCircle2 size={18} /><strong>{dayStats.pct}%</strong><span>完成度</span></div>
                <div><LayoutList size={18} /><strong>{dayStats.total}</strong><span>总事项</span></div>
                <div><Flame size={18} /><strong>{dayStats.doing}</strong><span>进行中</span></div>
                <div><Clock3 size={18} /><strong>{dayStats.minutes}</strong><span>预计分钟</span></div>
              </div>
            </section>

            <section className="todo-controls">
              <label className="todo-search">
                <Search size={14} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、标签、备注" />
              </label>
              <div className="todo-segment">
                {["all", ...STATUS_OPTIONS.map((item) => item.value)].map((value) => (
                  <button type="button" key={value} className={statusFilter === value ? "is-active" : ""} onClick={() => setStatusFilter(value)}>
                    {value === "all" ? "全部" : STATUS_OPTIONS.find((item) => item.value === value)?.label}
                  </button>
                ))}
              </div>
              <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}>
                <option value="all">全部分类</option>
                {sections.map((section) => <option key={section} value={section}>{section}</option>)}
              </select>
            </section>

            {(loadingPlanner || loadingDay) && (
              <div className="todo-loading"><Loader2 className="todo-spin" size={18} /> 加载中...</div>
            )}

            <section className="todo-list" aria-label="每日 Todos">
              {!loadingDay && visibleTodos.length === 0 && (
                <div className="todo-empty">
                  <MoreHorizontal size={24} />
                  <p>{query || statusFilter !== "all" || sectionFilter !== "all" ? "没有匹配的待办。" : "这一天还没有 todo，先添加一个最小可执行动作。"}</p>
                </div>
              )}
              {visibleTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={() => setTodoModal({ initial: todo })}
                  onDelete={async () => {
                    if (!window.confirm(`删除 “${todo.title}”？`)) return;
                    await deleteTodo(todo.id);
                    await loadPlanner();
                    await loadDay(activeDate);
                  }}
                  onDuplicate={async () => {
                    await duplicateTodo(todo.id, activeDate);
                    await loadPlanner();
                    await loadDay(activeDate);
                    setStatus("已复制到当前日期");
                  }}
                  onStatus={(nextStatus) => mutateTodo(todo, { status: nextStatus })}
                  onPin={(pinned) => mutateTodo(todo, { pinned })}
                />
              ))}
            </section>
          </>
        )}
      </main>

      {dateModal && (
        <DateModal
          initialDate={dateModal.mode === "edit" ? dateModal.initial : dateModal.initial}
          onClose={() => setDateModal(null)}
          onSave={saveDateModal}
        />
      )}
      {todoModal && (
        <TodoModal
          initial={todoModal.initial}
          date={activeDate}
          sections={sections}
          onClose={() => setTodoModal(null)}
          onSave={saveTodoModal}
        />
      )}
      {recurringModal && (
        <RecurringModal
          initial={recurringModal.initial}
          date={activeDate}
          sections={sections}
          onClose={() => setRecurringModal(null)}
          onSave={saveRecurringModal}
        />
      )}
      {recurringManagerOpen && (
        <RecurringManagerModal
          rules={planner.recurring || []}
          onClose={() => setRecurringManagerOpen(false)}
          onNew={() => {
            setRecurringManagerOpen(false);
            setRecurringModal({ initial: null });
          }}
          onEdit={(rule) => {
            setRecurringManagerOpen(false);
            setRecurringModal({ initial: rule });
          }}
          onDelete={handleDeleteRecurring}
        />
      )}
    </div>
  );
}
