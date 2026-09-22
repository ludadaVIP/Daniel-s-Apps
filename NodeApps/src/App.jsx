import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Archive, BookOpenText, BrainCircuit, ChartNoAxesCombined, Compass, House, Landmark, MessageCircleQuestion, Network, NotebookPen } from 'lucide-react';

const APPS = [
  {
    id: 'world-qa',
    name: 'World Q&A',
    kind: 'WORLD · QUESTIONS',
    description: '从底层问题入手，建立理解世界的结构、机制与长期视角。',
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
    description: '像管理电子书一样整理、预览和阅读独立 HTML 图文资料。',
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
    id: 'recall-verses',
    name: 'Recall Verses',
    kind: 'CUV · RECALL',
    description: '隐藏易忘经节，在上下文中练习回想与背诵。',
    Icon: BrainCircuit,
    color: '#397b5b',
    load: () => import('../apps/recall-verses/entry.jsx'),
  },
];

const APP_STYLE_LOADERS = {
  'world-qa': () => import('../apps/WorldQandA/src/styles.css?inline'),
  'belief-qa': () => import('../apps/BeliefQandA/src/styles.css?inline'),
  investment: () => import('../apps/investment/src/styles.css?inline'),
  industry: () => import('../apps/industry/src/styles.css?inline'),
  insight: () => import('../apps/insight/src/styles.css?inline'),
  notebook: () => import('../apps/notebook/src/styles.css?inline'),
  'html-library': () => import('../apps/html-library/src/styles.css?inline'),
  bible: () => import('../apps/bible/src/styles.css?inline'),
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
  'recall-verses',
]);

const API_RETRY_DELAY = 250;
const API_MAX_RETRY_DELAY = 1500;

async function waitForApiReady(signal) {
  let retryDelay = API_RETRY_DELAY;
  while (!signal.aborted) {
    try {
      const response = await fetch('/api/health', { cache: 'no-store', signal });
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
    waitForApiReady(controller.signal).then(() => {
      if (!controller.signal.aborted) setApiReady(true);
    });
    return () => controller.abort();
  }, [requiresApi]);

  if (!apiReady) return <Loading name={app.name} />;
  return <Suspense fallback={<Loading name={app.name} />}><SelectedApp /></Suspense>;
}

function Home({ open }) {
  return <main className="launcher-hub">
    <header className="launcher-hub-header">
      <div className="launcher-hub-heading">
        <p className="launcher-hub-eyebrow">NODEAPPS</p>
        <h1>NodeApps</h1>
        <p>{APPS.length} 个独立保留的本地工具，点击卡片进入。</p>
      </div>
      <div className="launcher-hub-actions"><span>{APPS.length} APPS</span></div>
    </header>
    <section className="launcher-hub-grid" aria-label="应用列表">
      {APPS.map((app) => <button className="launcher-hub-card" key={app.id} onClick={() => open(app.id)} style={{ '--launcher-card-accent': app.color }}>
        <span className="launcher-hub-card-top"><span className="launcher-hub-card-icon"><app.Icon size={25} strokeWidth={1.9} /></span><span className="launcher-hub-card-kind">{app.kind}</span></span>
        <span className="launcher-hub-card-body"><strong>{app.name}</strong><span>{app.description}</span></span>
        <span className="launcher-hub-card-arrow" aria-hidden="true">-&gt;</span>
      </button>)}
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
