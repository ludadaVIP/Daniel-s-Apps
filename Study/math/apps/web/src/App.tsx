import { useEffect } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  LanguageSwitcher,
  StudyIcon,
  StudyShell,
  useLanguageMode,
} from '@study/ui';
import { curriculum } from './content';
import { t } from './model';
import { reviewQueue, useProgress } from './progress';
import { Text } from './ui';
import { words } from './pageSupport';
import { Home } from './Home';
import { PathPage } from './PathPage';
import { LessonPage } from './LessonPage';
import { Diagnostic } from './Diagnostic';
import { Review } from './Review';
import { Parent } from './Parent';
import { UnitCheck } from './UnitCheck';
export function App() {
  const [mode, setMode] = useLanguageMode(),
    store = useProgress(),
    location = useLocation();
  useEffect(() => {
    document.title = `${words(mode, '数学探索', 'Math Explorer')} · Study`;
    window.scrollTo(0, 0);
  }, [mode, location.pathname]);
  const nav = [
    ['/math', 'home', t('探索首页', 'Discover')],
    ['/math/check', 'keyboard', t('了解我的起点', 'Starting-point check')],
    ['/math/path', 'path', t('学习路线', 'Learning path')],
    ['/math/review', 'review', t('温故知新', 'Review')],
    ['/math/parent', 'report', t('家长与学习记录', 'Parents & records')],
  ] as const;
  const directory = curriculum.map((s) => ({
    id: s.id,
    title: `${s.id} · ${words(mode, s.title.zh.split('：')[0]!, s.title.en.split('—')[0]!)}`,
    href: `/math/path?stage=${s.id}`,
    children: s.units.map((u) => ({
      id: u.id,
      title: `${u.id} · ${words(mode, u.title.zh, u.title.en)}`,
      children: u.lessons.map((l) => ({
        id: l.id,
        title:
          mode === 'bilingual'
            ? `${l.title.zh} / ${l.title.en}`
            : words(mode, l.title.zh, l.title.en),
        href: l.available ? `/math/lesson/${l.id}` : undefined,
        badge: l.available
          ? store.progress.sessions[l.id]?.completedAt
            ? '✓'
            : undefined
          : words(mode, '规划中', 'Planned'),
      })),
    })),
  }));
  const title =
    nav.find((n) => n[0] === location.pathname)?.[2] ??
    t('课程学习', 'Lesson workspace');
  return (
    <div className="math-app study-learning-app">
      <StudyShell
        brand={
          <Link to="/math">
            <span className="math-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path
                  d="M24 6H8l10 10L8 26h16"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <strong>{words(mode, '数学探索', 'Math Explorer')}</strong>
              <small>Maths · Study</small>
            </div>
          </Link>
        }
        navigation={
          <>
            {nav.map(([url, icon, label]) => (
              <NavLink
                key={url}
                to={url}
                end={url === '/math'}
                aria-label={words(mode, label.zh, label.en)}
                title={words(mode, label.zh, label.en)}
              >
                <StudyIcon name={icon} />
                <span className="study-nav-label">
                  <Text mode={mode} text={label} />
                </span>
                {icon === 'review' &&
                  reviewQueue(store.progress).length > 0 && (
                    <b>{reviewQueue(store.progress).length}</b>
                  )}
              </NavLink>
            ))}
          </>
        }
        controls={<LanguageSwitcher mode={mode} onChange={setMode} />}
        home={
          <Link to="/" title={words(mode, '返回 Study', 'Back to Study')}>
            <StudyIcon name="back" />
            <span>Study</span>
          </Link>
        }
        label={words(mode, '数学学习导航', 'Maths navigation')}
        title={words(mode, title.zh, title.en)}
        subject={words(mode, '数学探索', 'Math Explorer')}
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
        mode={mode}
      >
        {store.error && (
          <div className="math-storage-error" role="alert">
            <Text
              mode={mode}
              text={t(
                '本机保存不可用或旧记录无法读取。当前仍可学习；旧数据不会被覆盖，请导出当前记录备份。',
                'Local storage is unavailable or earlier records could not be read. You can continue; earlier data will not be overwritten. Export current records for backup.',
              )}
            />
          </div>
        )}
        <main className="math-main">
          <Routes>
            <Route index element={<Home mode={mode} store={store} />} />
            <Route
              path="path"
              element={<PathPage mode={mode} store={store} />}
            />
            <Route
              path="check"
              element={<Diagnostic mode={mode} store={store} />}
            />
            <Route
              path="lesson/:lessonId"
              element={<LessonPage mode={mode} store={store} />}
            />
            <Route
              path="unit/:unitId/check"
              element={<UnitCheck mode={mode} store={store} />}
            />
            <Route
              path="review"
              element={<Review mode={mode} store={store} />}
            />
            <Route
              path="parent"
              element={<Parent mode={mode} store={store} />}
            />
            <Route path="*" element={<Navigate to="/math" replace />} />
          </Routes>
        </main>
        <footer className="math-footer">
          <span>MATH EXPLORER LAB · STUDY</span>
          <span>
            <Text
              mode={mode}
              text={
                store.error
                  ? t(
                      '○ 当前记录未保存，请导出备份',
                      '○ Records are unsaved; export a backup',
                    )
                  : t(
                      '● 学习记录保存在此浏览器',
                      '● Records stay in this browser',
                    )
              }
            />
          </span>
        </footer>
      </StudyShell>
    </div>
  );
}
