import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import {
  LanguageSwitcher,
  StudyIcon,
  StudyShell,
  useLanguageMode,
} from '@study/ui';
import type { LanguageMode } from '@study/shared';
import { curriculum, lessons, t, words } from './content';
import {
  dueLessons,
  newSession,
  newFeedback,
  useProgress,
  type Store,
} from './progress';
import { downloadText, Text } from './ui';
import { LessonPage } from './LessonPage';
import { Review } from './Review';
import { AtlasDownloads, atlasSources } from './AtlasEditor';
import { atlasMarkdown } from './atlasModel';
type PageProps = { store: Store; mode: LanguageMode };
const levelText = (level: string, mode: LanguageMode) =>
  level === 'transfer'
    ? words(mode, '能迁移', 'Can apply elsewhere')
    : level === 'explain'
      ? words(mode, '能解释', 'Can explain')
      : words(mode, '已探索', 'Explored');
function Home({ store, mode }: PageProps) {
  const completed = lessons.filter(
    (l) => store.progress.sessions[l.id]?.completedAt,
  ).length;
  const next =
    lessons.find((l) => !store.progress.sessions[l.id]?.completedAt) ??
    lessons[0]!;
  return (
    <>
      <div className="geo-page-intro">
        <span className="geo-eyebrow">
          {words(
            mode,
            '看世界 · 问为什么 · 寻找证据',
            'LOOK CLOSELY · ASK WHY · FOLLOW EVIDENCE',
          )}
        </span>
        <span className="geo-badge">
          {words(
            mode,
            `${lessons.length} 节完整双语课程`,
            `${lessons.length} COMPLETE BILINGUAL LESSONS`,
          )}
        </span>
      </div>
      <section className="geo-hero">
        <div className="geo-hero-copy">
          <span className="geo-kicker">
            GEOGRAPHY EXPLORER /{' '}
            {curriculum
              .filter((s) => s.lessons.some((l) => l.status === 'available'))
              .map((s) => s.id)
              .join(' · ')}
          </span>
          <h1>
            <Text
              mode={mode}
              text={t(
                '从一张地图，\n走向整个世界。',
                'One map.\nA world to explore.',
              )}
            />
          </h1>
          <p>
            <Text
              mode={mode}
              text={t(
                '从太空里的蓝色家园，到身边的方向与路线。先观察，再动手，把发现讲给家人听。',
                'From our blue home in space to directions close to home. Look, try, and tell your family what you discover.',
              )}
            />
          </p>
          <Link className="geo-button" to={`/geography/lesson/${next.id}`}>
            <Text
              mode={mode}
              text={
                completed === lessons.length
                  ? t('再探索一次', 'Explore again')
                  : store.progress.sessions[next.id]?.startedAt
                    ? t('继续我的探索', 'Continue exploring')
                    : completed
                      ? t('开始下一课', 'Start the next lesson')
                      : t('开始第一课', 'Start the first lesson')
              }
            />
            <span>↗</span>
          </Link>
          <div className="geo-hero-meta">
            <span>
              {words(
                mode,
                '11–16 岁 · 按自己的节奏',
                'AGES 11–16 · AT YOUR PACE',
              )}
            </span>
            <span>
              {words(
                mode,
                '基础课约25–40分钟 · 阶段作品可分两次',
                '25–40 MIN / LESSON · PROJECTS IN TWO SESSIONS',
              )}
            </span>
          </div>
        </div>
        <div className="geo-hero-art">
          <div className="geo-orbit-ring" />
          <img
            src="/geography/images/apollo17-earth.jpg"
            alt={words(
              mode,
              'NASA 阿波罗17号真实地球照片，1972年',
              'Real NASA Apollo 17 Earth photograph, 1972',
            )}
          />
          <span className="geo-art-note">
            {words(mode, '我们的蓝色家园', 'OUR BLUE HOME')}
            <i>↙</i>
          </span>
          <span className="geo-art-foot">
            FIG. 01 / NASA · APOLLO 17 · 1972
          </span>
        </div>
      </section>
      <section className="geo-home-path">
        <div className="geo-section-heading">
          <div>
            <span className="geo-eyebrow">01 / EXPLORE & EXPLAIN</span>
            <h2>
              <Text
                mode={mode}
                text={t(
                  '已开放的旅程：读图、地球塑形与天气',
                  'Open journeys: maps, a changing Earth and weather',
                )}
              />
            </h2>
          </div>
          <div className="geo-progress">
            <strong>{completed}</strong>
            <span>
              {' '}
              / {lessons.length} {words(mode, '已探索', 'explored')}
            </span>
            <div className="geo-progress-track">
              <i style={{ width: `${(completed / lessons.length) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="geo-lesson-cards">
          {lessons.map((l) => {
            const s = store.progress.sessions[l.id];
            return (
              <Link
                key={l.id}
                to={`/geography/lesson/${l.id}`}
                className={`geo-lesson-card ${s?.completedAt ? 'complete' : ''}`}
              >
                <div className="geo-row">
                  <span className="geo-eyebrow">
                    {l.stage} / {l.id}
                  </span>
                  <span className="geo-caption">
                    {s?.completedAt
                      ? '✓ ' + levelText(s.level, mode)
                      : s?.startedAt
                        ? words(mode, '继续', 'Continue')
                        : words(mode, '可学习', 'Ready')}
                  </span>
                </div>
                <span className="geo-card-symbol" aria-hidden="true">
                  {l.icon}
                </span>
                <h3>
                  <Text mode={mode} text={l.title} />
                </h3>
                <p>
                  <Text mode={mode} text={l.question} />
                </p>
                <div className="geo-row">
                  <small>
                    {l.minutes}{' '}
                    {words(mode, '分钟 · 观察 + 操作', 'MIN · LOOK + TRY')}
                  </small>
                  <span>↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="geo-roadmap">
        <div className="geo-section-heading">
          <div>
            <span className="geo-eyebrow">02 / THE BIG PICTURE</span>
            <h2>
              <Text
                mode={mode}
                text={t(
                  '六个阶段，把好奇心带远一点。',
                  'Six stages. Take curiosity further.',
                )}
              />
            </h2>
          </div>
          <Link className="geo-text-link" to="/geography/path">
            {words(mode, '完整 96 课目录', 'All 96 lessons')} →
          </Link>
        </div>
        <div className="geo-stage-cards">
          {curriculum.map((s, i) => (
            <Link key={s.id} to={`/geography/path?stage=${s.id}`}>
              <span className="geo-stage-number">0{i + 1}</span>
              <div>
                <h3>
                  <Text mode={mode} text={s.title} />
                </h3>
                <p>
                  {s.age} {words(mode, '岁', 'YEARS')} · 16{' '}
                  {words(mode, '课', 'LESSONS')}
                </p>
                <span className="geo-caption">
                  {s.lessons.some((l) => l.status === 'available')
                    ? words(
                        mode,
                        `${s.lessons.filter((l) => l.status === 'available').length} 课开放 · ${s.lessons.filter((l) => l.status !== 'available').length} 课规划中`,
                        `${s.lessons.filter((l) => l.status === 'available').length} open · ${s.lessons.filter((l) => l.status !== 'available').length} planned`,
                      )
                    : words(mode, '课程内容规划中', 'Content planned')}
                </span>
              </div>
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
      <div className="geo-home-bottom">
        <Link to="/geography/notebook">
          <StudyIcon name="notebook" />
          <h3>{words(mode, '留下我的发现', 'Keep my discoveries')}</h3>
          <p>
            {words(
              mode,
              '自己的解释、探索记录与家庭试学反馈。',
              'Your explanations, explorations and family feedback.',
            )}
          </p>
        </Link>
        <Link to="/geography/review">
          <StudyIcon name="review" />
          <h3>
            {words(
              mode,
              '换个问题，再用一次',
              'Use it again in a new question',
            )}
          </h3>
          <p>
            {words(
              mode,
              '不比速度，用证据检验理解。',
              'No race. Test understanding with evidence.',
            )}
          </p>
        </Link>
      </div>
    </>
  );
}
function Curriculum({ mode, store }: PageProps) {
  const [params, setParams] = useSearchParams();
  const selected =
    curriculum.find((s) => s.id === params.get('stage')) ?? curriculum[0]!;
  return (
    <>
      <span className="geo-eyebrow">LEARNING PATH / 96 LESSONS</span>
      <h1>
        <Text
          mode={mode}
          text={t('世界探索路线', 'Your world exploration path')}
        />
      </h1>
      <p className="geo-subtitle">
        <Text
          mode={mode}
          text={t(
            `六阶段，每阶段 16 课。${lessons.length} 课已开放；其余为规划，不计入已学或完成。`,
            `Six stages of 16 lessons. ${lessons.length} are open; planned content is not counted as learned or complete.`,
          )}
        />
      </p>
      <div
        className="geo-stage-selector"
        role="group"
        aria-label={words(mode, '选择学习阶段', 'Choose learning stage')}
      >
        {curriculum.map((s) => (
          <button
            key={s.id}
            aria-pressed={selected.id === s.id}
            onClick={() => setParams({ stage: s.id })}
          >
            {s.id}
            <Text mode={mode} text={s.title} />
          </button>
        ))}
      </div>
      <div className="geo-section-heading">
        <h2>
          <Text mode={mode} text={selected.title} />
        </h2>
        <span className="geo-caption">
          {selected.age} {words(mode, '岁 · 推荐年龄', 'YEARS · SUGGESTED AGE')}
        </span>
      </div>
      <div className="geo-curriculum-list">
        {selected.lessons.map((l, i) => {
          const done = store.progress.sessions[l.id]?.completedAt;
          const inner = (
            <>
              <span className="geo-course-number">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="geo-eyebrow">
                  {l.id}
                  {l.project
                    ? ' / ' + words(mode, '阶段作品', 'STAGE PROJECT')
                    : ''}
                </span>
                <h3>
                  <Text mode={mode} text={l.title} />
                </h3>
                {mode !== 'en' && <p>{l.question}</p>}
              </div>
              <span className="geo-course-status">
                {l.status === 'available'
                  ? done
                    ? '✓ ' + words(mode, '已探索', 'Explored')
                    : words(mode, '进入课程 ↗', 'Open lesson ↗')
                  : words(mode, '规划中', 'Planned')}
              </span>
            </>
          );
          return l.status === 'available' ? (
            <Link
              key={l.id}
              to={`/geography/lesson/${l.id}`}
              className="geo-course-row"
            >
              {inner}
            </Link>
          ) : (
            <article key={l.id} className="geo-course-row planned">
              {inner}
            </article>
          );
        })}
      </div>
    </>
  );
}
function Notebook({ mode, store }: PageProps) {
  const blocks = Array.from({ length: Math.ceil(lessons.length / 4) }, (_, i) =>
    lessons.slice(i * 4, i * 4 + 4),
  );
  const [feedbackBlock, setFeedbackBlock] = useState(lessons[0]!.id);
  const feedbackFor = (id: string) =>
    store.progress.feedbackByBlock[id] ??
    (id === lessons[0]!.id ? store.progress.feedback : newFeedback());
  const f = feedbackFor(feedbackBlock);
  const updateFeedback = (key: keyof typeof f, value: string | number) =>
    store.update((p) => ({
      ...p,
      ...(feedbackBlock === lessons[0]!.id
        ? { feedback: { ...f, [key]: value } }
        : {}),
      feedbackByBlock: {
        ...p.feedbackByBlock,
        [feedbackBlock]: { ...f, [key]: value },
      },
    }));
  function exportNotebook() {
    const body = lessons
      .map((l) => {
        const s = store.progress.sessions[l.id];
        return `## ${l.id} · ${l.title.zh} / ${l.title.en}\n\n${s?.completedAt ? 'Explored / 已探索' : 'In progress or not started / 探索中或未开始'}\n\n${s?.note || 'No written note / 暂无文字记录'}\n\nOral explanation / 口头解释: ${s?.oral ? 'Yes / 是' : 'Not recorded / 未记录'}\n\nSelf-assessment / 自评: ${s?.completedAt ? `${levelText(s.level, 'zh')} / ${levelText(s.level, 'en')}` : 'Not completed / 尚未完成'}\n${l.id === 'GEO-016' && s?.activity.atlas ? `\n${atlasMarkdown(s.activity.atlas, atlasSources())}\n` : ''}`;
      })
      .join('\n');
    downloadText(
      'geography-discoveries.md',
      `# 地理发现手帐 / Geography discovery notebook\n\n${body}\n## 家庭试学反馈 / Family feedback\n\n${blocks
        .map((block) => {
          const feedback = feedbackFor(block[0]!.id);
          return `### ${block[0]!.id}–${block.at(-1)!.id}\n\n兴趣 Interest: ${feedback.interest}/5\n独立解释 Independence: ${feedback.independence}/5\nUseful / 好用的图: ${feedback.useful}\nDifficult / 困难: ${feedback.difficult}\n`;
        })
        .join('\n')}`,
    );
  }
  return (
    <>
      <div className="geo-section-heading">
        <div>
          <span className="geo-eyebrow">FIELD NOTES / YOUR EVIDENCE</span>
          <h1>
            <Text
              mode={mode}
              text={t('我的地理发现', 'My geography discoveries')}
            />
          </h1>
        </div>
        <button className="geo-button secondary" onClick={exportNotebook}>
          {words(mode, '导出手帐', 'Export notebook')} ↓
        </button>
      </div>
      <p className="geo-subtitle">
        {words(
          mode,
          '学习状态是你和家长的自评，记录保存在当前浏览器。',
          'Learning levels are your reflections with a parent. Records stay in this browser.',
        )}
      </p>
      <div className="geo-notebook-grid">
        {lessons.map((l) => {
          const s = store.progress.sessions[l.id] ?? newSession();
          return (
            <article key={l.id}>
              <div className="geo-row">
                <span className="geo-eyebrow">{l.id}</span>
                <span className="geo-caption">
                  {s.completedAt
                    ? levelText(s.level, mode)
                    : s.startedAt
                      ? words(mode, '探索中', 'Exploring')
                      : words(mode, '未开始', 'Not started')}
                </span>
              </div>
              <h3>
                <Text mode={mode} text={l.title} />
              </h3>
              <label className="geo-writing">
                <span>{words(mode, '我的证据笔记', 'My evidence note')}</span>
                <textarea
                  rows={4}
                  maxLength={3000}
                  value={s.note}
                  placeholder={words(
                    mode,
                    '用自己的话留下发现……',
                    'Keep a discovery in your own words…',
                  )}
                  onChange={(e) => store.patch(l.id, { note: e.target.value })}
                />
              </label>
              {s.oral && (
                <p className="geo-caption">
                  ✓{' '}
                  {words(mode, '已记录口头解释', 'Spoken explanation recorded')}
                </p>
              )}
              {l.id === 'GEO-016' && s.activity.atlas && (
                <AtlasDownloads mode={mode} draft={s.activity.atlas} />
              )}
              <Link className="geo-text-link" to={`/geography/lesson/${l.id}`}>
                {words(mode, '回到图解与任务', 'Revisit diagrams and mission')}{' '}
                ↗
              </Link>
            </article>
          );
        })}
      </div>
      <details className="geo-parent-feedback" open>
        <summary>
          {words(
            mode,
            '每四课家庭试学反馈',
            'Family feedback every four lessons',
          )}
        </summary>
        <div
          className="geo-choices"
          role="group"
          aria-label={words(
            mode,
            '选择反馈课程组',
            'Choose feedback lesson block',
          )}
        >
          {blocks.map((block) => (
            <button
              key={block[0]!.id}
              aria-pressed={feedbackBlock === block[0]!.id}
              onClick={() => setFeedbackBlock(block[0]!.id)}
            >
              {block[0]!.id}–{block.at(-1)!.id}
            </button>
          ))}
        </div>
        <p>
          {words(
            mode,
            '问孩子：最有趣的发现是什么？能不用文字讲清一幅图吗？下次想探索哪里？',
            'Ask: What was most interesting? Can you explain a diagram without reading? What would you like to explore next?',
          )}
        </p>
        <div className="geo-feedback-form">
          {(
            [
              ['interest', '兴趣', 'Interest'],
              ['independence', '独立解释', 'Independent explanation'],
            ] as const
          ).map(([key, zh, en]) => (
            <label key={key}>
              <span>
                {words(mode, zh, en)} · {f[key]} / 5
              </span>
              <input
                type="range"
                min="1"
                max="5"
                value={f[key]}
                onChange={(e) => updateFeedback(key, Number(e.target.value))}
              />
            </label>
          ))}
          {(
            [
              ['useful', '哪张图最好用？', 'Which diagram helped most?'],
              [
                'difficult',
                '哪里太难或太长？',
                'What was too hard or too long?',
              ],
            ] as const
          ).map(([key, zh, en]) => (
            <label className="geo-writing" key={key}>
              <span>{words(mode, zh, en)}</span>
              <textarea
                rows={3}
                maxLength={3000}
                value={f[key]}
                onChange={(e) => updateFeedback(key, e.target.value)}
              />
            </label>
          ))}
        </div>
        <span className="geo-caption">
          {words(
            mode,
            '反馈仅保存在本机，可随手帐导出。',
            'Feedback stays locally and is included in the notebook export.',
          )}
        </span>
      </details>
    </>
  );
}
export function App() {
  const [mode, setMode] = useLanguageMode();
  const store = useProgress();
  const location = useLocation();
  useEffect(() => {
    document.title = `${words(mode, '地理探索', 'Geography Explorer')} · Study`;
    window.scrollTo(0, 0);
  }, [mode, location.pathname]);
  const nav = [
    ['/geography', 'home', '探索首页', 'Discover'],
    ['/geography/path', 'path', '学习路线', 'Learning path'],
    ['/geography/review', 'review', '温故知新', 'Review'],
    ['/geography/notebook', 'notebook', '发现手帐', 'Notebook'],
  ] as const;
  const directory = curriculum.map((s) => ({
    id: s.id,
    title:
      mode === 'bilingual'
        ? `${s.id} · ${s.title.zh} / ${s.title.en}`
        : `${s.id} · ${words(mode, s.title.zh, s.title.en)}`,
    href: `/geography/path?stage=${s.id}`,
    children: Array.from({ length: 4 }, (_, i) => ({
      id: `${s.id}-unit-${i}`,
      title: `${s.lessons[i * 4]!.id}–${s.lessons[i * 4 + 3]!.id}`,
      children: s.lessons.slice(i * 4, i * 4 + 4).map((l) => ({
        id: l.id,
        title:
          mode === 'bilingual'
            ? `${l.title.zh} / ${l.title.en}`
            : words(mode, l.title.zh, l.title.en),
        href:
          l.status === 'available' ? `/geography/lesson/${l.id}` : undefined,
        badge:
          l.status === 'available'
            ? store.progress.sessions[l.id]?.completedAt
              ? '✓'
              : undefined
            : words(mode, '规划中', 'Planned'),
      })),
    })),
  }));
  const title = location.pathname.includes('/lesson/')
    ? words(mode, '课程学习', 'Learning workspace')
    : (nav.find((n) => n[0] === location.pathname)?.[mode === 'en' ? 3 : 2] ??
      words(mode, '探索首页', 'Discover'));
  return (
    <div className="geo-app study-learning-app">
      <StudyShell
        brand={
          <Link to="/geography">
            <span className="geo-brand-icon">◎</span>
            <div>
              <strong>{words(mode, '地理探索', 'Geography Explorer')}</strong>
              <small>Geography · Study</small>
            </div>
          </Link>
        }
        navigation={
          <>
            {nav.map(([url, icon, zh, en]) => (
              <NavLink
                key={url}
                to={url}
                end={url === '/geography'}
                title={words(mode, zh, en)}
                aria-label={words(mode, zh, en)}
              >
                <StudyIcon name={icon} size={19} />
                <span className="study-nav-label">{words(mode, zh, en)}</span>
                {icon === 'review' && dueLessons(store.progress).length > 0 && (
                  <b>{dueLessons(store.progress).length}</b>
                )}
              </NavLink>
            ))}
          </>
        }
        controls={<LanguageSwitcher mode={mode} onChange={setMode} />}
        home={
          <Link to="/" title={words(mode, '返回 Study', 'Back to Study')}>
            <StudyIcon name="back" size={18} />
            <span>Study</span>
          </Link>
        }
        title={title}
        subject={words(mode, '地理探索', 'Geography Explorer')}
        mode={mode}
        directory={directory}
        activePath={location.pathname + location.search}
        renderLink={(href, content, className, active) => (
          <Link
            to={href}
            className={className}
            aria-current={active ? 'page' : undefined}
          >
            {content}
          </Link>
        )}
        label={words(mode, '地理学习导航', 'Geography navigation')}
      >
        {store.error && (
          <div className="geo-storage-error" role="alert">
            {store.error}
          </div>
        )}
        <main className="geo-main">
          <Routes>
            <Route index element={<Home store={store} mode={mode} />} />
            <Route
              path="path"
              element={<Curriculum store={store} mode={mode} />}
            />
            <Route
              path="lesson/:lessonId"
              element={<LessonPage store={store} mode={mode} />}
            />
            <Route
              path="review"
              element={<Review store={store} mode={mode} />}
            />
            <Route
              path="notebook"
              element={<Notebook store={store} mode={mode} />}
            />
            <Route path="*" element={<Navigate to="/geography" replace />} />
          </Routes>
        </main>
        <footer className="geo-footer">
          <span>GEOGRAPHY EXPLORER · STUDY</span>
          <span>
            {store.error
              ? words(mode, '○ 本机保存未成功', '○ Local save unavailable')
              : words(
                  mode,
                  '● 学习记录仅在此浏览器保存',
                  '● Learning records stay in this browser',
                )}
          </span>
        </footer>
      </StudyShell>
    </div>
  );
}
