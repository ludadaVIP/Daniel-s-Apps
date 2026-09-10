import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BookOpenText, BrainCircuit, ChartNoAxesCombined, House, Landmark, Network, NotebookPen } from 'lucide-react';

const APPS = [
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
  investment: () => import('../apps/investment/src/styles.css?inline'),
  industry: () => import('../apps/industry/src/styles.css?inline'),
  insight: () => import('../apps/insight/src/styles.css?inline'),
  notebook: () => import('../apps/notebook/src/styles.css?inline'),
  bible: () => import('../apps/bible/src/styles.css?inline'),
  'recall-verses': () => import('../apps/recall-verses/src/styles.css?inline'),
};

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
  const match = location.hash.match(/^#\/app\/([^/]+)/);
  return match?.[1] ?? null;
}

function Loading({ name }) {
  return <div className="app-loading" role="status"><span /><p>正在打开 {name}…</p></div>;
}

function Home({ open }) {
  return <main className="launcher-hub">
    <header className="launcher-hub-header">
      <div className="launcher-hub-heading">
        <p className="launcher-hub-eyebrow">NODEAPPS</p>
        <h1>NodeApps</h1>
        <p>六个独立保留的本地工具，点击卡片进入。</p>
      </div>
      <div className="launcher-hub-actions"><span>6 APPS</span></div>
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
    const sync = () => setSelected(currentAppId());
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
    <div className="launcher-app-content"><Suspense fallback={<Loading name={app.name} />}><SelectedApp /></Suspense></div>
  </div>;
}
