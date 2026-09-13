import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ArrowUpRight, BookOpen, Check, ChevronDown, CircleAlert, Cloud,
  Code2, FileText, Folder, FolderOpen, Grid2X2, Heart, LayoutList,
  LoaderCircle, MonitorUp, RefreshCw, Search, SlidersHorizontal, Tag, X,
} from 'lucide-react';
import { documentUrl, getDocument, listDocuments, openLibraryFolder, recordDocumentOpen, saveDocumentMetadata } from './api.js';

const STATUS = {
  unread: { label: '待阅读', color: '#718096' },
  reading: { label: '正在读', color: '#3b82f6' },
  finished: { label: '已读完', color: '#30a46c' },
};
const COVER_TONES = ['azure', 'coral', 'jade', 'violet', 'amber', 'slate'];
const SORTS = [
  ['recent', '最近打开'],
  ['updated', '最近更新'],
  ['title', '标题 A–Z'],
  ['size', '文件大小'],
];
const LAYOUT_VALUES = new Set(['grid', 'list']);
const SORT_VALUES = new Set(SORTS.map(([value]) => value));
const FILTER_VALUE_PATTERN = /^(?:all|favorites|status:(?:unread|reading|finished)|folder:[^\u0000-\u001f]{1,160}|tag:[^\u0000-\u001f]{1,36})$/;
const EMPTY_DRAFT = { documentId: null, title: '', summary: '', tags: '' };

function isStoredFilter(value) {
  return typeof value === 'string' && FILTER_VALUE_PATTERN.test(value);
}

function stored(key, fallback, isValid) {
  try {
    const value = localStorage.getItem(key);
    return value && isValid(value) ? value : fallback;
  } catch { return fallback; }
}

function useStoredState(key, fallback, isValid) {
  const [value, setValue] = useState(() => stored(key, fallback, isValid));
  useEffect(() => { try { localStorage.setItem(key, value); } catch {} }, [key, value]);
  const setValidatedValue = (next) => setValue((current) => {
    const candidate = typeof next === 'function' ? next(current) : next;
    return isValid(candidate) ? candidate : fallback;
  });
  return [value, setValidatedValue];
}

function formatDate(value) {
  if (!value) return '尚未打开';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function folderName(folder) { return folder || '根目录'; }
function stamp(value) { const time = new Date(value || 0).getTime(); return Number.isNaN(time) ? 0 : time; }

function summarize(items) {
  return items.reduce((result, item) => {
    result.total += 1;
    if (item.favorite) result.favorites += 1;
    result[item.readingStatus] += 1;
    return result;
  }, { total: 0, favorites: 0, unread: 0, reading: 0, finished: 0 });
}

function collectFacets(items) {
  const count = (items, property, transform = (value) => value) => {
    const entries = new Map();
    for (const item of items) for (const raw of (Array.isArray(item[property]) ? item[property] : [item[property]])) {
      const value = transform(raw);
      if (value) entries.set(value, (entries.get(value) || 0) + 1);
    }
    return [...entries.entries()].map(([name, total]) => ({ name, count: total })).sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
  };
  return { folders: count(items, 'folder', folderName), tags: count(items, 'tags') };
}

function mergeItem(items, item) { return items.map((candidate) => candidate.id === item.id ? { ...candidate, ...item } : candidate); }

function draftFromItem(item) {
  return {
    documentId: item?.id || null,
    title: item?.title || '',
    summary: item?.summary || '',
    tags: (item?.tags || []).join(', '),
  };
}

function Cover({ item, compact = false }) {
  const titleMark = [...(item.title || '文档')][0] || '文';
  return <div className={`vs-cover vs-tone-${item.coverTone || 'azure'} ${compact ? 'is-compact' : ''}`} aria-hidden="true">
    <span className="vs-cover-rail" style={{ '--vs-status-color': STATUS[item.readingStatus]?.color || STATUS.unread.color }} />
    <span className="vs-cover-index">{folderName(item.folder)}</span>
    <strong>{titleMark}</strong>
    <span className="vs-cover-stamp">HTML</span>
  </div>;
}

function Signals({ item, concise = false }) {
  const signals = [
    item.containsScripts && ['脚本', Code2],
    item.hasRemoteAssets && ['联网', Cloud],
    item.hasInteractiveContent && ['交互', MonitorUp],
  ].filter(Boolean);
  if (!signals.length) return concise ? null : <span className="vs-clean-signal">静态文档</span>;
  return <div className="vs-signals" aria-label="文档特征">
    {signals.map(([label, Icon]) => <span key={label} title={label}><Icon size={13} />{!concise && label}</span>)}
  </div>;
}

function EmptyState({ title, body, action }) {
  return <section className="vs-empty">
    <Archive size={31} strokeWidth={1.45} />
    <h2>{title}</h2><p>{body}</p>{action}
  </section>;
}

export default function VisualShelf() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [detailLoadingById, setDetailLoadingById] = useState({});
  const [detailErrorsById, setDetailErrorsById] = useState({});
  const [filter, setFilter] = useStoredState('visualshelf.view', 'all', isStoredFilter);
  const [layout, setLayout] = useStoredState('visualshelf.layout', 'grid', (value) => LAYOUT_VALUES.has(value));
  const [sort, setSort] = useStoredState('visualshelf.sort', 'recent', (value) => SORT_VALUES.has(value));
  const [search, setSearch] = useState('');
  const [openingFolder, setOpeningFolder] = useState(false);
  const [draftsById, setDraftsById] = useState({});
  const [savingById, setSavingById] = useState({});
  const itemsRef = useRef([]);
  const selectedIdRef = useRef(null);
  const selectionGenerationRef = useRef(0);
  const syncGenerationRef = useRef(0);
  const detailGenerationsRef = useRef(new Map());
  const documentGenerationsRef = useRef(new Map());
  const draftGenerationsRef = useRef(new Map());

  const stats = useMemo(() => summarize(items), [items]);
  const facets = useMemo(() => collectFacets(items), [items]);
  const selected = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);
  const draft = selected ? draftsById[selected.id] || draftFromItem(selected) : EMPTY_DRAFT;
  const detailLoading = Boolean(selectedId && detailLoadingById[selectedId]);
  const detailError = selectedId ? detailErrorsById[selectedId] || '' : '';
  const saving = Boolean(selectedId && savingById[selectedId]);
  const validFilters = useMemo(() => new Set([
    'all', 'favorites', ...Object.keys(STATUS).map((status) => `status:${status}`),
    ...facets.folders.map(({ name }) => `folder:${name}`),
    ...facets.tags.map(({ name }) => `tag:${name}`),
  ]), [facets]);

  const replaceItems = (updater) => setItems((current) => {
    const next = typeof updater === 'function' ? updater(current) : updater;
    itemsRef.current = next;
    return next;
  });
  const documentGeneration = (id) => documentGenerationsRef.current.get(id) || 0;
  const nextDocumentGeneration = (id) => {
    const next = documentGeneration(id) + 1;
    documentGenerationsRef.current.set(id, next);
    return next;
  };
  const draftGeneration = (id) => draftGenerationsRef.current.get(id) || 0;
  const setDocumentError = (id, message) => setDetailErrorsById((current) => {
    if (!message) {
      if (!Object.hasOwn(current, id)) return current;
      const { [id]: _removed, ...rest } = current;
      return rest;
    }
    return { ...current, [id]: message };
  });
  const setDetailLoading = (id, value) => setDetailLoadingById((current) => ({ ...current, [id]: value }));
  const ensureDraft = (item) => {
    if (!item?.id) return;
    setDraftsById((current) => Object.hasOwn(current, item.id) ? current : { ...current, [item.id]: draftFromItem(item) });
  };
  const selectDocument = (nextItemOrId) => {
    const nextId = typeof nextItemOrId === 'string' ? nextItemOrId : nextItemOrId?.id || null;
    const nextItem = typeof nextItemOrId === 'object'
      ? nextItemOrId
      : itemsRef.current.find((item) => item.id === nextId);
    if (selectedIdRef.current === nextId) {
      ensureDraft(nextItem);
      return;
    }
    // Update the ref in the click handler, not only after React commits state:
    // async A responses can otherwise slip into the interval before B renders.
    selectedIdRef.current = nextId;
    selectionGenerationRef.current += 1;
    setSelectedId(nextId);
    if (nextId) {
      ensureDraft(nextItem);
      setDocumentError(nextId, '');
    }
  };
  const changeDraft = (patch) => {
    const id = selectedIdRef.current;
    if (!id) return;
    draftGenerationsRef.current.set(id, draftGeneration(id) + 1);
    setDraftsById((current) => {
      const item = itemsRef.current.find((candidate) => candidate.id === id);
      const base = current[id] || draftFromItem(item);
      return { ...current, [id]: { ...base, ...patch, documentId: id } };
    });
  };

  const sync = async ({ initial = false } = {}) => {
    const requestGeneration = syncGenerationRef.current + 1;
    syncGenerationRef.current = requestGeneration;
    const selectionGeneration = selectionGenerationRef.current;
    const sourceGenerations = new Map(documentGenerationsRef.current);
    if (initial) setLoading(true); else setSyncing(true);
    setLoadError('');
    try {
      const payload = await listDocuments({ refresh: true });
      const received = payload.items || [];
      // A list response started for A must not replace B's current card data or
      // draft after the user has changed documents. Per-document generations
      // also protect an optimistic metadata update made while syncing.
      if (syncGenerationRef.current !== requestGeneration || selectionGenerationRef.current !== selectionGeneration) return;
      replaceItems((current) => {
        const currentById = new Map(current.map((item) => [item.id, item]));
        return received.map((item) => documentGeneration(item.id) !== (sourceGenerations.get(item.id) || 0)
          ? currentById.get(item.id) || item
          : item);
      });
      const retained = received.find((item) => item.id === selectedIdRef.current);
      if (retained) ensureDraft(retained);
      else selectDocument(received[0] || null);
    } catch (error) {
      if (syncGenerationRef.current === requestGeneration && selectionGenerationRef.current === selectionGeneration) {
        setLoadError(error.message || '无法读取书库。');
      }
    } finally {
      if (syncGenerationRef.current === requestGeneration) {
        setLoading(false); setSyncing(false);
      }
    }
  };

  useEffect(() => { sync({ initial: true }); }, []);
  useEffect(() => {
    if (!selectedId) return undefined;
    const selectionGeneration = selectionGenerationRef.current;
    const requestGeneration = (detailGenerationsRef.current.get(selectedId) || 0) + 1;
    const itemGeneration = documentGeneration(selectedId);
    const initialDraftGeneration = draftGeneration(selectedId);
    detailGenerationsRef.current.set(selectedId, requestGeneration);
    setDetailLoading(selectedId, true);
    setDocumentError(selectedId, '');
    let cancelled = false;
    getDocument(selectedId).then((detail) => {
      const stillSelected = !cancelled
        && selectedIdRef.current === selectedId
        && selectionGenerationRef.current === selectionGeneration
        && detailGenerationsRef.current.get(selectedId) === requestGeneration;
      if (!stillSelected) return;
      if (documentGeneration(selectedId) === itemGeneration) replaceItems((current) => mergeItem(current, detail));
      // Fetching detail is allowed to refresh an untouched draft only. Once a
      // user types (or saves) it can never overwrite that document's draft.
      if (draftGeneration(selectedId) === initialDraftGeneration) {
        setDraftsById((current) => ({ ...current, [selectedId]: draftFromItem(detail) }));
      }
    }).catch((error) => {
      if (!cancelled
        && selectedIdRef.current === selectedId
        && selectionGenerationRef.current === selectionGeneration
        && detailGenerationsRef.current.get(selectedId) === requestGeneration) {
        setDocumentError(selectedId, error.message || '无法读取文档详情。');
      }
    }).finally(() => {
      if (detailGenerationsRef.current.get(selectedId) === requestGeneration) setDetailLoading(selectedId, false);
    });
    return () => { cancelled = true; };
  }, [selectedId]);
  useEffect(() => {
    if (!validFilters.has(filter)) setFilter('all');
  }, [filter, validFilters]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const applyUpdate = (updated) => replaceItems((current) => mergeItem(current, updated));
  const persist = async (item, patch, successMessage = '', { savedDraftGeneration = null } = {}) => {
    const previous = itemsRef.current.find((candidate) => candidate.id === item.id) || item;
    const optimistic = { ...item, ...patch };
    const requestGeneration = nextDocumentGeneration(item.id);
    const selectionGeneration = selectionGenerationRef.current;
    applyUpdate(optimistic);
    try {
      const updated = await saveDocumentMetadata(item.id, patch);
      if (documentGeneration(item.id) === requestGeneration) {
        applyUpdate(updated);
        if (savedDraftGeneration !== null && draftGeneration(item.id) === savedDraftGeneration) {
          setDraftsById((current) => ({ ...current, [item.id]: draftFromItem(updated) }));
        }
        if (successMessage && selectedIdRef.current === item.id && selectionGenerationRef.current === selectionGeneration) setNotice(successMessage);
      }
      return updated;
    } catch (error) {
      if (documentGeneration(item.id) === requestGeneration) {
        applyUpdate(previous);
        setDocumentError(item.id, error.message || '保存失败，未应用此次修改。');
      }
      throw error;
    }
  };

  const recordOpen = (item) => {
    const previous = itemsRef.current.find((candidate) => candidate.id === item.id) || item;
    const optimistic = { ...item, lastOpenedAt: new Date().toISOString() };
    const requestGeneration = nextDocumentGeneration(item.id);
    applyUpdate(optimistic);
    recordDocumentOpen(item.id).then((updated) => {
      if (documentGeneration(item.id) === requestGeneration) applyUpdate(updated);
    }).catch((error) => {
      if (documentGeneration(item.id) !== requestGeneration) return;
      applyUpdate(previous);
      if (selectedIdRef.current === item.id) setNotice(error.message || '已打开文档，但未能记录阅读时间。');
    });
  };

  const openInNewTab = (item) => {
    // This must happen before awaiting the API call, or browser popup policies
    // may reject a legitimate user-initiated reading action.
    const tab = window.open(documentUrl(item.id), '_blank', 'noopener');
    try { if (tab) tab.opener = null; } catch {}
    recordOpen(item);
  };

  const openFolder = async () => {
    if (openingFolder) return;
    setOpeningFolder(true);
    try {
      await openLibraryFolder();
      setNotice('已在文件管理器中打开 HTML 书库。');
    } catch (error) {
      if (selectedIdRef.current) setDocumentError(selectedIdRef.current, error.message || '无法打开 HTML 书库文件夹。');
    } finally {
      setOpeningFolder(false);
    }
  };
  const saveEditor = async () => {
    const item = selected;
    const editorDraft = draft;
    if (!item || editorDraft.documentId !== item.id) return;
    const tags = [...new Set(editorDraft.tags.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean))];
    if (tags.length > 12) { setDocumentError(item.id, '最多可保存 12 个标签。'); return; }
    const savedDraftGeneration = draftGeneration(item.id);
    setSavingById((current) => ({ ...current, [item.id]: (current[item.id] || 0) + 1 }));
    setDocumentError(item.id, '');
    try { await persist(item, { title: editorDraft.title, summary: editorDraft.summary, tags }, '资料已保存', { savedDraftGeneration }); }
    catch {} finally {
      setSavingById((current) => {
        const nextCount = (current[item.id] || 1) - 1;
        if (nextCount > 0) return { ...current, [item.id]: nextCount };
        const { [item.id]: _finished, ...rest } = current;
        return rest;
      });
    }
  };

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('zh-CN');
    return items.filter((item) => {
      const matchesFilter = filter === 'all' ? true
        : filter === 'favorites' ? item.favorite
          : filter.startsWith('status:') ? item.readingStatus === filter.slice(7)
            : filter.startsWith('folder:') ? folderName(item.folder) === filter.slice(7)
              : filter.startsWith('tag:') ? item.tags.includes(filter.slice(4)) : true;
      const haystack = `${item.title} ${item.summary} ${item.relativePath} ${(item.tags || []).join(' ')}`.toLocaleLowerCase('zh-CN');
      return matchesFilter && (!needle || haystack.includes(needle));
    }).sort((left, right) => {
      if (sort === 'recent') return stamp(right.lastOpenedAt) - stamp(left.lastOpenedAt) || left.title.localeCompare(right.title, 'zh-Hans-CN');
      if (sort === 'updated') return stamp(right.updatedAt) - stamp(left.updatedAt) || left.title.localeCompare(right.title, 'zh-Hans-CN');
      if (sort === 'size') return right.bytes - left.bytes || left.title.localeCompare(right.title, 'zh-Hans-CN');
      return left.title.localeCompare(right.title, 'zh-Hans-CN');
    });
  }, [items, filter, search, sort]);

  if (loading) return <main className="visual-shelf vs-loading"><LoaderCircle size={28} /><p>正在整理你的 HTML 书架…</p></main>;
  if (loadError && !items.length) return <main className="visual-shelf vs-loading"><EmptyState title="书架尚未打开" body={loadError} action={<button className="vs-primary" onClick={() => sync({ initial: true })}><RefreshCw size={16} />重新读取</button>} /></main>;

  return <main className="visual-shelf">
    <header className="vs-header">
      <div className="vs-brand">
        <span className="vs-mark"><Archive size={21} /></span>
        <div><p>HTML LIBRARY</p><h1>VisualShelf</h1></div>
      </div>
      <div className="vs-header-rail" aria-label="馆藏状态">
        <span style={{ '--rail-color': STATUS.unread.color, '--rail-size': Math.max(1, stats.unread) }} />
        <span style={{ '--rail-color': STATUS.reading.color, '--rail-size': Math.max(1, stats.reading) }} />
        <span style={{ '--rail-color': STATUS.finished.color, '--rail-size': Math.max(1, stats.finished) }} />
      </div>
      <div className="vs-header-metrics">
        <span><strong>{stats.total}</strong>馆藏</span><span><strong>{stats.favorites}</strong>收藏</span><span><strong>{stats.reading}</strong>正在读</span>
      </div>
      <button className="vs-sync" onClick={() => sync()} disabled={syncing} title="重新扫描 HTML 文件夹"><RefreshCw size={16} className={syncing ? 'is-spinning' : ''} />{syncing ? '同步中' : '同步'}</button>
    </header>

    {loadError && <div className="vs-inline-error" role="status"><CircleAlert size={15} />{loadError}<button onClick={() => sync()}>重试</button></div>}

    <div className="vs-workspace">
      <aside className="vs-rail" aria-label="书库筛选">
        <section><p className="vs-rail-label">浏览</p>
          <RailButton active={filter === 'all'} onClick={() => setFilter('all')} icon={Archive} label="全部文档" count={stats.total} />
          <RailButton active={filter === 'favorites'} onClick={() => setFilter('favorites')} icon={Heart} label="收藏" count={stats.favorites} />
        </section>
        <section><p className="vs-rail-label">阅读状态</p>
          {Object.entries(STATUS).map(([value, state]) => <RailButton key={value} active={filter === `status:${value}`} onClick={() => setFilter(`status:${value}`)} label={state.label} count={stats[value]} dot={state.color} />)}
        </section>
        {facets.folders.length > 0 && <section><p className="vs-rail-label">文件夹</p>
          {facets.folders.map(({ name, count }) => <RailButton key={name} active={filter === `folder:${name}`} onClick={() => setFilter(`folder:${name}`)} icon={Folder} label={name} count={count} />)}
        </section>}
        {facets.tags.length > 0 && <section><p className="vs-rail-label">标签</p><div className="vs-rail-tags">
          {facets.tags.map(({ name, count }) => <button key={name} className={filter === `tag:${name}` ? 'active' : ''} onClick={() => setFilter(`tag:${name}`)}><span>#{name}</span><small>{count}</small></button>)}
        </div></section>}
      </aside>

      <section className="vs-catalog" aria-label="HTML 文档目录">
        {filtered.length ? <div className={`vs-document-grid ${layout === 'list' ? 'is-list' : ''}`}>{filtered.map((item) => <DocumentCard key={item.id} item={item} selected={selectedId === item.id} onSelect={() => selectDocument(item)} onFavorite={() => persist(item, { favorite: !item.favorite }, item.favorite ? '已取消收藏' : '已加入收藏')} onOpen={() => openInNewTab(item)} />)}</div> : <EmptyState title="没有符合条件的文档" body={search ? '换一个搜索词，或清除筛选后再试。' : '这个分类还没有图文资料。'} action={filter !== 'all' || search ? <button className="vs-secondary" onClick={() => { setFilter('all'); setSearch(''); }}>清除筛选</button> : null} />}
      </section>

      <aside className="vs-inspector" aria-label="书库检索与文档资料">
        <div className="vs-library-controls" aria-label="书库检索与显示设置">
          <label className="vs-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索标题、说明、标签…" aria-label="搜索文档" />{search && <button onClick={() => setSearch('')} aria-label="清除搜索"><X size={14} /></button>}</label>
          <div className="vs-browse-options"><label className="vs-sort"><SlidersHorizontal size={15} /><span className="sr-only">排序方式</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label><div className="vs-layout-toggle" aria-label="目录布局"><button className={layout === 'grid' ? 'active' : ''} onClick={() => setLayout('grid')} aria-label="卡片布局" aria-pressed={layout === 'grid'}><Grid2X2 size={17} /></button><button className={layout === 'list' ? 'active' : ''} onClick={() => setLayout('list')} aria-label="列表布局" aria-pressed={layout === 'list'}><LayoutList size={17} /></button></div></div>
        </div>
        {selected ? <Inspector item={selected} draft={draft} onDraftChange={changeDraft} saving={saving} loading={detailLoading} error={detailError} clearError={() => setDocumentError(selected.id, '')} onSave={saveEditor} onOpenFolder={openFolder} openingFolder={openingFolder} onOpen={() => openInNewTab(selected)} onFavorite={() => persist(selected, { favorite: !selected.favorite }, selected.favorite ? '已取消收藏' : '已加入收藏')} onStatus={(readingStatus) => persist(selected, { readingStatus }, '阅读状态已更新')} onTone={(coverTone) => persist(selected, { coverTone }, '封面颜色已更新')} /> : <EmptyState title="选一篇资料" body="从目录中选择一个 HTML 文件，即可编辑资料或开始阅读。" />}
      </aside>
    </div>
    {notice && <div className="vs-toast" role="status"><Check size={16} />{notice}</div>}
  </main>;
}

function RailButton({ active, onClick, icon: Icon, label, count, dot }) {
  return <button className={`vs-rail-button ${active ? 'active' : ''}`} onClick={onClick} aria-current={active ? 'page' : undefined}>{dot ? <i style={{ background: dot }} /> : Icon ? <Icon size={15} /> : null}<span>{label}</span><small>{count}</small></button>;
}

function DocumentCard({ item, selected, onSelect, onFavorite, onOpen }) {
  return <article className={`vs-document-card ${selected ? 'is-selected' : ''}`}>
    <button className="vs-card-select" onClick={onSelect} aria-label={`查看 ${item.title} 的资料`}>
      <Cover item={item} />
      <div className="vs-card-main"><div className="vs-card-overline"><span>{folderName(item.folder)}</span><span className={`vs-status vs-${item.readingStatus}`}>{STATUS[item.readingStatus]?.label || '待阅读'}</span></div><h3>{item.title}</h3><p>{item.summary || '暂无简介'}</p></div>
    </button>
    <div className="vs-card-footer"><span className="vs-path" title={item.relativePath}>{item.relativePath}</span><Signals item={item} concise /><div className="vs-card-actions"><button className={item.favorite ? 'is-favorite' : ''} onClick={onFavorite} aria-label={item.favorite ? '取消收藏' : '收藏'}><Heart size={16} fill={item.favorite ? 'currentColor' : 'none'} /></button><button onClick={onOpen} aria-label={`在新标签页打开 ${item.title}`}><ArrowUpRight size={16} /></button></div></div>
    {item.tags?.length > 0 && <div className="vs-card-tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>}
  </article>;
}

function Inspector({ item, draft, onDraftChange, saving, loading, error, clearError, onSave, onOpenFolder, openingFolder, onOpen, onFavorite, onStatus, onTone }) {
  return <div className="vs-inspector-content">
    <div className="vs-inspector-top"><p className="vs-eyebrow">文档资料 {loading && <LoaderCircle size={13} className="is-spinning" />}</p><button className={item.favorite ? 'is-favorite' : ''} onClick={onFavorite} aria-label={item.favorite ? '取消收藏' : '收藏'}><Heart size={17} fill={item.favorite ? 'currentColor' : 'none'} /></button></div>
    <Cover item={item} compact />
    <div className="vs-inspector-actions"><button className="vs-folder-action" onClick={onOpenFolder} disabled={openingFolder} title="在文件管理器中打开 HTML 书库根目录"><FolderOpen size={16} />{openingFolder ? '打开中' : '打开文件夹'}</button><button className="vs-primary" onClick={onOpen} title="在新的 Chrome 标签页中阅读"><BookOpen size={16} />阅读内容</button></div>
    <section className="vs-editor"><label>标题<input value={draft.title} maxLength="160" onChange={(event) => onDraftChange({ title: event.target.value })} /></label><label>简介<textarea value={draft.summary} maxLength="500" rows="4" onChange={(event) => onDraftChange({ summary: event.target.value })} placeholder="写一两句帮助未来的你识别这篇资料。" /></label><label>标签 <span>用逗号分隔</span><input value={draft.tags} onChange={(event) => onDraftChange({ tags: event.target.value })} placeholder="投资, 科普" /></label><button className="vs-save" onClick={onSave} disabled={saving}>{saving && <LoaderCircle size={15} className="is-spinning" />}{saving ? '保存中' : '保存资料'}</button></section>
    {error && <div className="vs-detail-error"><CircleAlert size={15} /><span>{error}</span><button onClick={clearError} aria-label="关闭错误"><X size={14} /></button></div>}
    <section className="vs-field-set"><p>阅读状态</p><div className="vs-status-options">{Object.entries(STATUS).map(([value, state]) => <button key={value} className={item.readingStatus === value ? 'active' : ''} onClick={() => onStatus(value)}><i style={{ background: state.color }} />{state.label}</button>)}</div></section>
    <section className="vs-field-set"><p>封面色标</p><div className="vs-tone-options">{COVER_TONES.map((tone) => <button key={tone} className={`vs-tone-${tone} ${item.coverTone === tone ? 'active' : ''}`} onClick={() => onTone(tone)} aria-label={`选择${tone}色`}><i /></button>)}</div></section>
    <section className="vs-source-info"><p><FileText size={14} />来源</p><code>{item.relativePath}</code><dl><div><dt>更新</dt><dd>{formatDate(item.updatedAt)}</dd></div><div><dt>大小</dt><dd>{formatSize(item.bytes)}</dd></div><div><dt>上次阅读</dt><dd>{formatDate(item.lastOpenedAt)}</dd></div></dl><div className="vs-signal-list"><Signals item={item} /></div></section>
  </div>;
}
