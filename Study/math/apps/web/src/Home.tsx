import { Link } from 'react-router-dom';
import { lessons, lessonById, openUnits, unitChecks } from './content';
import { reviewQueue } from './progress';
import { HeroArt } from './Labs';
import { t } from './model';
import { Text } from './ui';
import { status, statuses, type Props } from './pageSupport';
const fractionArt: Record<string, string> = {
  'fraction-whole': '1/8 · 1/6',
  'fraction-kind': '7/4 > 1',
  'fraction-mixed': '2 ¾ = 11/4',
  'fraction-equivalent': '2/3 = 4/6',
  'fraction-simplify': '12/18 → 2/3',
  'fraction-compare': '3/4 > 2/3',
};
const operationArt: Record<string, string> = {
  'operation-parts': '8 + 5 = 13',
  'operation-array': '3 × 4 = 12',
  'operation-division': '24 ÷ 6 = 4',
  'operation-inverse': '12 ÷ 3 ↔ 3 × 4',
  'operation-choose': '+ − × ÷ ?',
};
function LessonCards({ mode, store, unitId }: Props & { unitId: string }) {
  return (
    <div className="math-lesson-grid">
      {lessons
        .filter((l) => l.unit === unitId)
        .map((l, i) => (
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
              {fractionArt[l.lab] ? (
                <span>{fractionArt[l.lab]}</span>
              ) : operationArt[l.lab] ? (
                <span>{operationArt[l.lab]}</span>
              ) : l.lab === 'decimal-place' ? (
                <span>0.307</span>
              ) : l.lab === 'decimal-compare' ? (
                <span>0.805 &gt; 0.8</span>
              ) : l.lab === 'decimal-add' ? (
                <span>1.2 + 0.45</span>
              ) : l.lab === 'decimal-multiply' ? (
                <span>0.325 × 4</span>
              ) : l.lab === 'decimal-divide' ? (
                <span>1.5 ÷ 4</span>
              ) : l.lab === 'decimal-application' ? (
                <span>NZ$1.25 × 3</span>
              ) : l.lab === 'number-reader' ? (
                <span>10,005</span>
              ) : l.lab === 'place-value' ? (
                <span>6 × 1,000</span>
              ) : l.lab === 'whole-line' ? (
                <span>500 ─ ● ─ 600</span>
              ) : l.lab === 'rounding' ? (
                <span>3,465 ≈ 3,500</span>
              ) : l.lab === 'regroup' ? (
                <span>100 = 10 × 10</span>
              ) : l.lab === 'parts' ? (
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
            text={t(
              `${openUnits.length} 个单元 · ${lessons.length} 节微课`,
              `${openUnits.length} UNITS · ${lessons.length} MICRO-LESSONS`,
            )}
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
                '每次约 12–20 分钟 · 按自己的节奏',
                'ABOUT 12–20 MIN · AT YOUR OWN PACE',
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
            <strong>
              {done} / {lessons.length}
            </strong>
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
      {openUnits.map((unit) => (
        <section key={unit.id} id={unit.id}>
          <div className="math-section-heading">
            <div>
              <span className="math-eyebrow">
                {unit.id} / {unit.title.en.toUpperCase()}
              </span>
              <h2>
                <Text
                  mode={mode}
                  text={
                    unit.id === 'B01'
                      ? t(
                          '把数看清楚，才能算得稳。',
                          'See numbers clearly. Build solid understanding.',
                        )
                      : unit.id === 'B04'
                        ? t(
                            '从一个整体，走进分数与小数。',
                            'One whole. A world of fractions and decimals.',
                          )
                        : unit.id === 'P52'
                          ? t(
                              '看清小单位，算懂小数。',
                              'Small units. Clear decimal thinking.',
                            )
                          : unit.id === 'P53'
                            ? t(
                                '同一整体，不同分法。',
                                'Same whole. Different ways to count.',
                              )
                            : unit.title
                  }
                />
              </h2>
            </div>
            <div className="math-unit-heading-links">
              {unit.id in unitChecks && (
                <Link to={`/math/unit/${unit.id}/check`}>
                  <Text mode={mode} text={t('单元小回顾', 'Unit review')} /> ↗
                </Link>
              )}
              <Link to={`/math/path?stage=${unit.stage}`}>
                <Text
                  mode={mode}
                  text={t('完整学习路线', 'Full learning path')}
                />{' '}
                ↗
              </Link>
            </div>
          </div>
          <LessonCards mode={mode} store={store} unitId={unit.id} />
        </section>
      ))}
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
