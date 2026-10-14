import { Link } from 'react-router-dom';
import { lessons, lessonById } from './content';
import { reviewQueue } from './progress';
import { HeroArt } from './Labs';
import { t } from './model';
import { Text } from './ui';
import { status, statuses, type Props } from './pageSupport';
function LessonCards({ mode, store }: Props) {
  return (
    <div className="math-lesson-grid">
      {lessons.map((l, i) => (
        <Link
          to={`/math/lesson/${l.id}`}
          className="math-lesson-card"
          key={l.id}
        >
          <div className="math-row">
            <span className="math-lesson-number">0{i + 1}</span>
            <span className={`math-status ${status(l.id, store)}`}>
              <Text mode={mode} text={statuses[status(l.id, store)]} />
            </span>
          </div>
          <div className={`math-mini-art art-${l.lab}`} aria-hidden="true">
            {l.lab === 'parts' ? (
              <span>▰ ▰ ▰ ▱</span>
            ) : l.lab === 'fractions' ? (
              <span>
                ½ <i>=</i> ²⁄₄
              </span>
            ) : l.lab === 'line' ? (
              <span>0 ─ ● ─ 1</span>
            ) : l.lab === 'decimal' ? (
              <span>
                .01 <i>→</i> .10
              </span>
            ) : (
              <span>
                $ <i>2.50</i>
              </span>
            )}
          </div>
          <span className="math-eyebrow">{l.id}</span>
          <h3>
            <Text mode={mode} text={l.title} />
          </h3>
          <div className="math-card-footer">
            <span>
              <Text
                mode={mode}
                text={t(`约 ${l.minutes} 分钟`, `${l.minutes} min`)}
              />
            </span>
            <span>↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function Home({ mode, store }: Props) {
  const done = lessons.filter(
    (l) => store.progress.sessions[l.id]?.completedAt,
  ).length;
  const next =
    lessonById(store.progress.preferredLesson) ??
    lessonById(
      store.progress.lastLesson &&
        !store.progress.sessions[store.progress.lastLesson]?.completedAt
        ? store.progress.lastLesson
        : undefined,
    ) ??
    lessons.find((l) => !store.progress.sessions[l.id]?.completedAt) ??
    lessons[0]!;
  const due = reviewQueue(store.progress).length;
  return (
    <>
      <div className="math-row math-topline">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t('你的数学探索空间', 'YOUR SPACE TO MAKE SENSE OF MATHS')}
          />
        </span>
        <span className="math-badge">
          <Text
            mode={mode}
            text={t('首个单元 · 5 节微课', 'FIRST UNIT · 5 MICRO-LESSONS')}
          />
        </span>
      </div>
      <section className="math-hero">
        <div className="math-hero-copy">
          <span className="math-eyebrow">MATH EXPLORER LAB / 01</span>
          <h1>
            <Text
              mode={mode}
              text={t('先看见，再算懂。', 'See it. Make sense of it.')}
            />
          </h1>
          <p>
            <Text
              mode={mode}
              text={t(
                '把抽象的数字，变成可以触摸的发现。从一块巧克力开始，找到数学里的“为什么”。',
                'Turn abstract numbers into discoveries you can explore. Start with a chocolate bar. Find the “why” in maths.',
              )}
            />
          </p>
          <Link className="math-button" to={`/math/lesson/${next.id}`}>
            <Text
              mode={mode}
              text={t(
                store.progress.sessions[next.id] ? '继续我的探索' : '开始探索',
                store.progress.sessions[next.id]
                  ? 'Continue exploring'
                  : 'Start exploring',
              )}
            />
            <span>↗</span>
          </Link>
          <div className="math-hero-meta">
            <Text
              mode={mode}
              text={t(
                '每次 12–15 分钟 · 按自己的节奏',
                '12–15 MIN · AT YOUR OWN PACE',
              )}
            />
          </div>
        </div>
        <HeroArt />
      </section>
      <div className="math-overview">
        <div>
          <span className="math-overview-icon">◷</span>
          <div>
            <strong>{done} / 5</strong>
            <Text
              mode={mode}
              text={t('已留下学习记录', 'lessons with reflections')}
            />
          </div>
        </div>
        <div>
          <span className="math-overview-icon">↻</span>
          <div>
            <strong>{due}</strong>
            <Text
              mode={mode}
              text={t('等待重温的发现', 'discoveries to revisit')}
            />
          </div>
        </div>
        <div>
          <span className="math-overview-icon">∞</span>
          <div>
            <strong>
              <Text mode={mode} text={t('没有倒计时', 'No countdown')} />
            </strong>
            <Text
              mode={mode}
              text={t('理解比速度更重要', 'Understanding before speed')}
            />
          </div>
        </div>
      </div>
      <Link className="math-diagnostic-banner" to="/math/check">
        <span className="math-diagnostic-icon">⌕</span>
        <div>
          <h3>
            <Text
              mode={mode}
              text={t(
                '从哪里开始？一起找找看。',
                'Where to begin? Let’s find out.',
              )}
            />
          </h3>
          <p>
            <Text
              mode={mode}
              text={t(
                '4 个小题组，发现已经会的和可以再探索的。不计时，可以跳过。',
                'Four small question groups to find what you know and what to explore. No timer. Skip any question.',
              )}
            />
          </p>
        </div>
        <span className="math-banner-action">
          <Text
            mode={mode}
            text={t('了解我的起点', 'Find my starting point')}
          />{' '}
          →
        </span>
      </Link>
      <div className="math-section-heading">
        <div>
          <span className="math-eyebrow">B04 / FIRST FRACTIONS & DECIMALS</span>
          <h2>
            <Text
              mode={mode}
              text={t(
                '从一个整体，走进分数与小数。',
                'One whole. A world of fractions and decimals.',
              )}
            />
          </h2>
        </div>
        <Link to="/math/path">
          <Text mode={mode} text={t('完整学习路线', 'Full learning path')} /> ↗
        </Link>
      </div>
      <LessonCards mode={mode} store={store} />
      <div className="math-bottom-note">
        <span>✦</span>
        <Text
          mode={mode}
          text={t(
            '可以跳过已会的内容，也可以随时回头。每一课，都是一次小发现。',
            'Skip what you already know. Come back whenever you need. Every lesson is a small discovery.',
          )}
        />
      </div>
    </>
  );
}
