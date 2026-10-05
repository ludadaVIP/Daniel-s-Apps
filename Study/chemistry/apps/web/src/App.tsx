import { Link, NavLink, Route, Routes } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { LanguageSwitcher, Localized, useLanguageMode } from '@study/ui';
import { pathLevels } from './content/path';

const copy = {
  brand: { zh: '化学学习路径', en: 'Chemistry Path' },
  home: { zh: '今天', en: 'Today' },
  path: { zh: '学习路径', en: 'Learning path' },
  stage: { zh: '从好奇开始', en: 'Start with curiosity' },
  foundation: { zh: '01 · 打好基础', en: '01 · Build the foundations' },
  heroTitle: {
    zh: '把看不见的世界，\n一点点弄明白。',
    en: 'Make sense of the\ninvisible world.',
  },
  heroBody: {
    zh: '从一杯水、一口空气开始。每次只学一个概念，自己动手想一想，再用练习检验是否真正理解。',
    en: 'Start with a glass of water and the air around you. Explore one idea at a time, think it through, then check what you really understand.',
  },
  explore: { zh: '看看学习路径', en: 'Explore the path' },
  next: { zh: '第一站', en: 'First stop' },
  firstLesson: { zh: '什么是物质？', en: 'What is matter?' },
  firstBody: {
    zh: '空气算物质吗？光算吗？先从这个问题出发。',
    en: 'Is air matter? What about light? Begin with a question.',
  },
  coming: { zh: '课程内容正在准备中', en: 'Lesson content is being prepared' },
  rhythm: { zh: '学习的节奏', en: 'A learning rhythm' },
  rhythmBody: {
    zh: '先观察 → 再理解 → 动手尝试 → 检查掌握 → 按时复习',
    en: 'Observe → Understand → Try → Check mastery → Review',
  },
  pathTitle: { zh: '一条有来由的路。', en: 'A path that makes sense.' },
  pathBody: {
    zh: '先学会描述物质，再走向粒子、原子和元素。每一步都建立在前一步的理解之上。',
    en: 'Describe matter first. Then move to particles, atoms and elements. Each step builds on the last.',
  },
  preview: { zh: '课程路线预览', en: 'Curriculum preview' },
  lessonUnit: { zh: '课', en: 'lessons' },
  topics: { zh: '将会学到', en: 'Coming topics' },
  footer: {
    zh: '理解 · 练习 · 掌握 · 复习',
    en: 'Understand · Practice · Master · Review',
  },
} satisfies Record<string, LocalizedText>;

function Wordmark() {
  return (
    <span className="wordmark" aria-hidden="true">
      <span className="wordmark-dot wordmark-dot-one" />
      <span className="wordmark-dot wordmark-dot-two" />
      <span className="wordmark-dot wordmark-dot-three" />
      <span className="wordmark-center" />
    </span>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ParticleIllustration() {
  const particles = [
    [68, 99],
    [116, 79],
    [166, 112],
    [214, 83],
    [268, 109],
    [91, 157],
    [146, 174],
    [194, 150],
    [250, 179],
    [297, 153],
    [64, 224],
    [124, 237],
    [181, 211],
    [234, 246],
    [287, 220],
  ];

  return (
    <div
      className="particle-illustration"
      role="img"
      aria-label="粒子模型 · Particle model"
    >
      <div className="illustration-label">FIG 01 / PARTICLE MODEL</div>
      <svg viewBox="0 0 360 320" aria-hidden="true" className="particle-svg">
        <defs>
          <linearGradient id="particle" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9ccac6" />
            <stop offset="1" stopColor="#408e8b" />
          </linearGradient>
        </defs>
        <circle cx="180" cy="160" r="140" fill="#e4f0ed" />
        <circle
          cx="180"
          cy="160"
          r="105"
          fill="none"
          stroke="#bedbd6"
          strokeDasharray="4 8"
        />
        <circle
          cx="180"
          cy="160"
          r="72"
          fill="none"
          stroke="#bedbd6"
          strokeDasharray="4 8"
        />
        {particles.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r={index % 3 === 0 ? 17 : 14}
              fill="url(#particle)"
            />
            <circle
              cx={x! - 4}
              cy={y! - 5}
              r="4"
              fill="#d7f1ea"
              opacity=".84"
            />
          </g>
        ))}
        <path
          d="M286 70 C323 87 334 118 326 145"
          fill="none"
          stroke="#ec937b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="m322 137 4 10 7-9"
          fill="none"
          stroke="#ec937b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="diagram-note diagram-note-left">matter / 物质</span>
      <span className="diagram-note diagram-note-right">particles / 粒子</span>
    </div>
  );
}

function Home({ mode }: { mode: LanguageMode }) {
  return (
    <div className="page-enter">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        <Localized text={copy.stage} mode={mode} />
      </div>
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="small-kicker">
            <Localized text={copy.foundation} mode={mode} />
          </span>
          <h1>
            <Localized
              text={copy.heroTitle}
              mode={mode}
              secondaryClassName="block text-[0.44em] leading-[1.2] font-medium tracking-normal text-[#759491] mt-4"
            />
          </h1>
          <p className="hero-description">
            <Localized text={copy.heroBody} mode={mode} />
          </p>
          <Link className="primary-button" to="/chemistry/path">
            <Localized
              text={copy.explore}
              mode={mode}
              secondaryClassName="block text-[0.7em] opacity-70"
            />
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ParticleIllustration />
      </section>

      <section
        className="bottom-grid"
        aria-label={mode === 'en' ? 'Learning preview' : '学习预览'}
      >
        <div className="first-card">
          <div className="card-topline">
            <span>01 / 25</span>
            <span>
              <Localized text={copy.next} mode={mode} />
            </span>
          </div>
          <h2>
            <Localized
              text={copy.firstLesson}
              mode={mode}
              secondaryClassName="block text-[0.56em] font-normal text-[#6f8e8b] mt-2"
            />
          </h2>
          <p>
            <Localized text={copy.firstBody} mode={mode} />
          </p>
          <div className="card-bottom">
            <span className="coming-dot" />
            <Localized text={copy.coming} mode={mode} />
          </div>
        </div>
        <div className="rhythm-card">
          <div className="rhythm-icon" aria-hidden="true">
            ↗
          </div>
          <h2>
            <Localized
              text={copy.rhythm}
              mode={mode}
              secondaryClassName="block text-[0.64em] font-normal opacity-60 mt-1"
            />
          </h2>
          <p>
            <Localized text={copy.rhythmBody} mode={mode} />
          </p>
          <div className="rhythm-dots" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
    </div>
  );
}

function Path({ mode }: { mode: LanguageMode }) {
  return (
    <div className="page-enter path-page">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        <Localized text={copy.preview} mode={mode} />
      </div>
      <div className="path-heading">
        <h1>
          <Localized
            text={copy.pathTitle}
            mode={mode}
            secondaryClassName="block text-[0.48em] text-[#759491] font-medium tracking-normal mt-3"
          />
        </h1>
        <p>
          <Localized text={copy.pathBody} mode={mode} />
        </p>
      </div>
      <div className="levels">
        {pathLevels.map((level) => (
          <article className="level-card" key={level.id}>
            <div className="level-number">{level.number}</div>
            <div className="level-main">
              <h2>
                <Localized
                  text={level.title}
                  mode={mode}
                  secondaryClassName="block text-[0.67em] text-[#6f8e8b] font-normal mt-1"
                />
              </h2>
              <p>
                <Localized text={level.description} mode={mode} />
              </p>
              <div className="topic-label">
                <Localized text={copy.topics} mode={mode} />
              </div>
              <div className="topic-list">
                {level.topics.map((topic) => (
                  <span key={topic.en}>
                    <Localized
                      text={topic}
                      mode={mode}
                      secondaryClassName="block text-[0.72em] opacity-55"
                    />
                  </span>
                ))}
              </div>
            </div>
            <div className="level-count">
              <strong>{level.lessonCount.toString().padStart(2, '0')}</strong>
              <Localized text={copy.lessonUnit} mode={mode} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function App() {
  const [mode, setMode] = useLanguageMode();

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link
          to="/chemistry"
          className="brand"
          aria-label={
            mode === 'en' ? 'Chemistry Path home' : '化学学习路径首页'
          }
        >
          <Wordmark />
          <span className="brand-name">
            <Localized
              text={copy.brand}
              mode={mode}
              secondaryClassName="block text-[0.62em] font-normal tracking-[.13em] opacity-60"
            />
          </span>
        </Link>
        <nav
          className="main-nav"
          aria-label={mode === 'en' ? 'Main navigation' : '主导航'}
        >
          <NavLink
            to="/chemistry"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <Localized
              text={copy.home}
              mode={mode}
              secondaryClassName="block text-[0.72em] font-normal opacity-60"
            />
          </NavLink>
          <NavLink
            to="/chemistry/path"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <Localized
              text={copy.path}
              mode={mode}
              secondaryClassName="block text-[0.72em] font-normal opacity-60"
            />
          </NavLink>
        </nav>
        <LanguageSwitcher
          mode={mode}
          onChange={setMode}
          className="language-switch"
        />
      </header>
      <Link
        className="chemistry-hub-button"
        to="/"
        aria-label={mode === 'en' ? 'Back to Study hub' : '返回 Study 首页'}
        title={mode === 'en' ? 'Back to Study hub' : '返回 Study 首页'}
      >
        <HomeIcon />
      </Link>
      <main className="main-content">
        <Routes>
          <Route index element={<Home mode={mode} />} />
          <Route path="path" element={<Path mode={mode} />} />
          <Route path="*" element={<Home mode={mode} />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>CHEMISTRY PATH / 01</span>
        <span>
          <Localized text={copy.footer} mode={mode} />
        </span>
      </footer>
    </div>
  );
}
