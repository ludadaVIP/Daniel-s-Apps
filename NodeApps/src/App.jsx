import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Archive, BookOpenText, BrainCircuit, ChartNoAxesCombined, Check, Columns3, Compass, GripVertical, House, Landmark, MessageCircleQuestion, Network, NotebookPen, Save } from 'lucide-react';

const APPS = [
  {
    id: 'world-qa',
    name: 'World Q&A',
    kind: 'WORLD · QUESTIONS',
    description: '从底层问题入手，建立理解世界运行机制。',
    Icon: Compass,
    color: '#347d94',
    load: () => import('../apps/WorldQandA/entry.jsx'),
  },
  {
    id: 'belief-qa',
    name: 'BeliefQ&A',
    kind: 'FAITH · QUESTIONS',
    description: '围绕未信者真实问题，逐层预备可对话的回答。',
    Icon: MessageCircleQuestion,
    color: '#7956a8',
    load: () => import('../apps/BeliefQandA/entry.jsx'),
  },
  {
    id: 'investment',
    name: 'Investment',
    kind: 'INVEST',
    description: '投资工作台、知识库、案例与决策复盘。',
    Icon: Landmark,
    color: '#b67a38',
    load: () => import('../apps/investment/entry.jsx'),
  },
  {
    id: 'industry',
    name: 'Industry with coms',
    kind: 'MARKETS',
    description: '行业结构、上市公司与关键投资线索。',
    Icon: ChartNoAxesCombined,
    color: '#e9784a',
    load: () => import('../apps/industry/entry.jsx'),
  },
  {
    id: 'insight',
    name: 'InsightMatrix',
    kind: 'MATRIX',
    description: '将知识、思考与判断沉淀成可复盘的认知系统。',
    Icon: Network,
    color: '#499b82',
    load: () => import('../apps/insight/entry.jsx'),
  },
  {
    id: 'notebook',
    name: 'Notebook',
    kind: 'MD',
    description: '浏览、连接并编辑你的本地 Markdown 笔记库。',
    Icon: NotebookPen,
    color: '#5d82b5',
    load: () => import('../apps/notebook/entry.jsx'),
  },
  {
    id: 'html-library',
    name: 'VisualShelf',
    kind: 'HTML LIBRARY',
    description: '整理、预览和阅读独立 HTML 图文资料。',
    Icon: Archive,
    color: '#3b82f6',
    load: () => import('../apps/html-library/entry.jsx'),
  },
  {
    id: 'bible',
    name: 'BibleDevotion',
    kind: 'BIBLE',
    description: '逐章阅读经文，在同一处记录灵修与讨论问题。',
    Icon: BookOpenText,
    color: '#9c7140',
    load: () => import('../apps/bible/entry.jsx'),
  },
  {
    id: 'bible-parallel',
    name: 'Bible Parallel',
    kind: 'CUV · ESV · NVI',
    description: '逐节对齐阅读中文、英文与西班牙文圣经。',
    Icon: Columns3,
    color: '#1d6570',
    load: () => import('../apps/bible-parallel/entry.jsx'),
  },
  {
    id: 'recall-verses',
    name: 'Recall Verses',
    kind: 'CUV · RECALL',
    description: '隐藏易忘经节，在上下文中练习回想与背诵。',
    Icon: BrainCircuit,
    color: '#397b5b',
    load: () => import('../apps/recall-verses/entry.jsx'),
  },
];

const APP_ORDER_STORAGE_KEY = 'nodeapps.launcher.app-order.v1';

function restoreAppOrder() {
  try {
    const savedIds = JSON.parse(localStorage.getItem(APP_ORDER_STORAGE_KEY));
    if (!Array.isArray(savedIds)) return APPS;
    const appsById = new Map(APPS.map((app) => [app.id, app]));
    const restoredApps = savedIds.map((id) => appsById.get(id)).filter(Boolean);
    const restoredIds = new Set(restoredApps.map((app) => app.id));
    return [...restoredApps, ...APPS.filter((app) => !restoredIds.has(app.id))];
  } catch {
    return APPS;
  }
}

function reorderApps(apps, sourceId, targetId) {
  const sourceIndex = apps.findIndex((app) => app.id === sourceId);
  const targetIndex = apps.findIndex((app) => app.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return apps;
  const nextApps = [...apps];
  const [movedApp] = nextApps.splice(sourceIndex, 1);
  nextApps.splice(targetIndex, 0, movedApp);
  return nextApps;
}

const APP_STYLE_LOADERS = {
  'world-qa': () => import('../apps/WorldQandA/src/styles.css?inline'),
  'belief-qa': () => import('../apps/BeliefQandA/src/styles.css?inline'),
  investment: () => import('../apps/investment/src/styles.css?inline'),
  industry: () => import('../apps/industry/src/styles.css?inline'),
  insight: () => import('../apps/insight/src/styles.css?inline'),
  notebook: () => import('../apps/notebook/src/styles.css?inline'),
  'html-library': () => import('../apps/html-library/src/styles.css?inline'),
  bible: () => import('../apps/bible/src/styles.css?inline'),
  'bible-parallel': () => import('../apps/bible-parallel/src/styles.css?inline'),
  'recall-verses': () => import('../apps/recall-verses/src/styles.css?inline'),
};

const API_BACKED_APPS = new Set([
  'world-qa',
  'belief-qa',
  'investment',
  'insight',
  'notebook',
  'html-library',
  'bible',
  'bible-parallel',
  'recall-verses',
]);

const API_RETRY_DELAY = 250;
const API_MAX_RETRY_DELAY = 1500;

async function waitForApiReady(signal, appId) {
  let retryDelay = API_RETRY_DELAY;
  while (!signal.aborted) {
    try {
      const response = await fetch(`/api/apps/${encodeURIComponent(appId)}/health`, { cache: 'no-store', signal });
      if (response.ok) return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    retryDelay = Math.min(Math.round(retryDelay * 1.5), API_MAX_RETRY_DELAY);
  }
}

let activeAppStyle;
function applyAppStyles(id, css) {
  if (!activeAppStyle) {
    activeAppStyle = document.createElement('style');
    activeAppStyle.dataset.nodeappsAppStyles = '';
    document.head.append(activeAppStyle);
  }
  activeAppStyle.dataset.app = id;
  activeAppStyle.textContent = css;
}

function clearAppStyles() {
  if (activeAppStyle) activeAppStyle.textContent = '';
}

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function createLazyApp(app) {
  return lazy(async () => {
    const [module, styles] = await Promise.all([app.load(), APP_STYLE_LOADERS[app.id]()] );
    applyAppStyles(app.id, styles.default);
    await nextPaint();
    return module;
  });
}

function currentAppId() {
  const match = location.hash.match(/^#\/app\/([^/?]+)/);
  if (match) return match[1];
  const legacyRoute = location.hash.slice(1);
  return /^(today|explore|cases|graph|theses|profile|article\/)/.test(legacyRoute) ? 'insight' : null;
}

function normalizeLegacyInsightRoute() {
  const legacyRoute = location.hash.slice(1);
  if (/^(today|explore|cases|graph|theses|profile|article\/)/.test(legacyRoute)) {
    location.hash = `/app/insight/${legacyRoute}`;
  }
}

function Loading({ name }) {
  return <div className="app-loading" role="status"><span /><p>正在打开 {name}…</p></div>;
}

function AppGate({ app, SelectedApp }) {
  const requiresApi = API_BACKED_APPS.has(app.id);
  const [apiReady, setApiReady] = useState(!requiresApi);

  useEffect(() => {
    if (!requiresApi) return undefined;
    const controller = new AbortController();
    setApiReady(false);
    // The workspace API can listen before an individual lazy-loaded app has
    // initialized. Its centralized readiness endpoint completes that work
    // before this app's own data requests are allowed to begin.
    waitForApiReady(controller.signal, app.id).then(() => {
      if (!controller.signal.aborted) setApiReady(true);
    });
    return () => controller.abort();
  }, [requiresApi]);

  if (!apiReady) return <Loading name={app.name} />;
  return <Suspense fallback={<Loading name={app.name} />}><SelectedApp /></Suspense>;
}

function Home({ open }) {
  const [apps, setApps] = useState(restoreAppOrder);
  const [savedOrder, setSavedOrder] = useState(() => restoreAppOrder().map((app) => app.id).join(','));
  const [draggedId, setDraggedId] = useState(null);
  const currentOrder = apps.map((app) => app.id).join(',');
  const hasUnsavedOrder = currentOrder !== savedOrder;

  const moveApp = (sourceId, targetId) => {
    setApps((currentApps) => reorderApps(currentApps, sourceId, targetId));
  };

  const moveAppByOffset = (id, offset) => {
    setApps((currentApps) => {
      const sourceIndex = currentApps.findIndex((app) => app.id === id);
      const target = currentApps[sourceIndex + offset];
      return target ? reorderApps(currentApps, id, target.id) : currentApps;
    });
  };

  const beginDrag = (event, id) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedId(id);
  };

  const updateDrag = (event) => {
    if (!draggedId) return;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-app-id]');
    const targetId = target?.dataset.appId;
    if (targetId && targetId !== draggedId) moveApp(draggedId, targetId);
  };

  const endDrag = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDraggedId(null);
  };

  const saveOrder = () => {
    try {
      localStorage.setItem(APP_ORDER_STORAGE_KEY, JSON.stringify(apps.map((app) => app.id)));
      setSavedOrder(currentOrder);
    } catch { /* Keep the save action available when browser storage is disabled. */ }
  };

  return <main className="launcher-hub">
    <header className="launcher-hub-header">
      <div className="launcher-hub-heading">
        <h2>NodeApps</h2>
      </div>
      <div className="launcher-hub-actions">
        <span>{APPS.length} APPS</span>
        <button className="launcher-save-order" type="button" onClick={saveOrder} disabled={!hasUnsavedOrder}>
          {hasUnsavedOrder ? <Save size={15} strokeWidth={2} /> : <Check size={15} strokeWidth={2} />}
          {hasUnsavedOrder ? '保存布局' : '布局已保存'}
        </button>
      </div>
    </header>
    <section className="launcher-hub-grid" aria-label="应用列表">
      {apps.map((app) => <article className={`launcher-hub-card${draggedId === app.id ? ' is-dragging' : ''}`} data-app-id={app.id} key={app.id} style={{ '--launcher-card-accent': app.color }}>
        <button className="launcher-card-drag-handle" type="button" aria-label={`拖动 ${app.name} 以调整顺序`} title="拖动排序" onPointerDown={(event) => beginDrag(event, app.id)} onPointerMove={updateDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveAppByOffset(app.id, -1); }
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveAppByOffset(app.id, 1); }
        }}><GripVertical size={18} strokeWidth={2.15} /></button>
        <button className="launcher-hub-card-launch" type="button" onClick={() => open(app.id)}>
          <span className="launcher-hub-card-top"><span className="launcher-hub-card-icon"><app.Icon size={21} strokeWidth={1.9} /></span><span className="launcher-hub-card-kind">{app.kind}</span></span>
          <span className="launcher-hub-card-body"><strong>{app.name}</strong><span>{app.description}</span></span>
          <span className="launcher-hub-card-arrow" aria-hidden="true">-&gt;</span>
        </button>
      </article>)}
    </section>
    <footer className="launcher-hub-footer"><code>Node.js · React · Vite</code><span>本地数据 · 多工具工作台</span></footer>
  </main>;
}

export default function App() {
  const [selected, setSelected] = useState(currentAppId);
  const [dockVisible, setDockVisible] = useState(true);
  useEffect(() => {
    const sync = () => {
      normalizeLegacyInsightRoute();
      setSelected(currentAppId());
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  const app = useMemo(() => APPS.find((item) => item.id === selected), [selected]);
  const SelectedApp = useMemo(() => (app ? createLazyApp(app) : null), [app]);
  useEffect(() => {
    if (!app) clearAppStyles();
  }, [app]);
  useEffect(() => {
    if (!app) return undefined;
    let frame;
    const onScroll = (event) => {
      const target = event.target;
      const offset = target === document ? window.scrollY : target.scrollTop;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setDockVisible(offset < 18));
    };
    setDockVisible(true);
    window.addEventListener('scroll', onScroll, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll, true); };
  }, [app]);
  const open = (id) => { location.hash = `/app/${id}`; };
  const back = () => { location.hash = ''; };
  if (!app) return <Home open={open} />;
  return <div className="launcher-app-shell" style={{ '--launcher-accent': app.color }}>
    <nav className={`launcher-dock ${dockVisible ? 'is-visible' : ''}`} aria-label="应用导航">
      <button onClick={back} title="回到 NodeApps 首页"><House size={17} strokeWidth={2.1} /><span>返回工作台</span></button>
    </nav>
    <div className="launcher-app-content"><AppGate key={app.id} app={app} SelectedApp={SelectedApp} /></div>
  </div>;
}
