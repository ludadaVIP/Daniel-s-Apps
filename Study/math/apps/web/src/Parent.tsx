import { Link } from 'react-router-dom';
import { lessons } from './content';
import { downloadProgress } from './progress';
import { t, lessonOutcome } from './model';
import { Text } from './ui';
import { Intro, words, status, statuses, type Props } from './pageSupport';
export function Parent({ mode, store }: Props) {
  const started = lessons.filter((l) => store.progress.sessions[l.id]);
  const ready = started.filter(
    (l) =>
      !!store.progress.sessions[l.id]?.completedAt &&
      lessonOutcome(l, store.progress.sessions[l.id]!) === 'ready_to_progress',
  );
  const next =
    lessons.find((l) => !store.progress.sessions[l.id]?.completedAt) ??
    lessons[0]!;
  return (
    <>
      <Intro
        mode={mode}
        kicker="LEARNING TOGETHER"
        title={t(
          '看见理解，陪伴下一步。',
          'Notice understanding. Support the next step.',
        )}
        body={t(
          '看独立完成、提示与解释，不用速度或一次表现定义孩子。记录仅保存在当前浏览器，可导出备份。',
          'Notice independent work, hints and explanations. Speed and a single attempt do not define the learner. Records stay in this browser and can be exported.',
        )}
      />
      <div className="math-parent-overview">
        <section className="math-panel">
          <span className="math-eyebrow">
            <Text mode={mode} text={t('已经理解的', 'IDEAS UNDERSTOOD')} />
          </span>
          <h2>{ready.length}</h2>
          <p>
            <Text
              mode={mode}
              text={t(
                '通过独立练习与解释复核',
                'With independent practice and reviewed reasoning',
              )}
            />
          </p>
        </section>
        <section className="math-panel">
          <span className="math-eyebrow">
            <Text mode={mode} text={t('下一次，试试', 'NEXT, TRY')} />
          </span>
          <Link to={`/math/lesson/${next.id}`}>
            <h3>
              <Text mode={mode} text={next.title} /> ↗
            </h3>
          </Link>
        </section>
        <section className="math-panel">
          <span className="math-eyebrow">
            <Text mode={mode} text={t('家长的好问题', 'A HELPFUL QUESTION')} />
          </span>
          <h3>
            <Text
              mode={mode}
              text={t(
                '你怎样知道答案合理？',
                'How do you know your answer is reasonable?',
              )}
            />
          </h3>
        </section>
      </div>
      <label className="math-panel math-answer">
        <h3>
          <Text mode={mode} text={t('调整起点', 'Choose a starting point')} />
        </h3>
        <p>
          <Text
            mode={mode}
            text={t(
              '所有已开放课程都可自由进入；这个设置只改变首页推荐。',
              'All open lessons are accessible; this setting only changes the home recommendation.',
            )}
          />
        </p>
        <select
          value={store.progress.preferredLesson ?? ''}
          onChange={(e) =>
            store.setProgress((old) => ({
              ...old,
              preferredLesson: e.target.value || undefined,
            }))
          }
        >
          <option value="">
            {words(mode, '自动推荐', 'Automatic suggestion')}
          </option>
          {lessons.map((l) => (
            <option value={l.id} key={l.id}>
              {l.id} · {words(mode, l.title.zh, l.title.en)}
            </option>
          ))}
        </select>
      </label>
      {started.length ? (
        started.map((l) => {
          const s = store.progress.sessions[l.id]!;
          return (
            <section className="math-panel" key={l.id}>
              <div className="math-row">
                <h3>
                  <Link to={`/math/lesson/${l.id}`}>
                    <Text mode={mode} text={l.title} /> ↗
                  </Link>
                </h3>
                <span className="math-status">
                  <Text mode={mode} text={statuses[status(l.id, store)]} />
                </span>
              </div>
              <div className="math-record-stats">
                <Text
                  mode={mode}
                  text={t(
                    `${l.questions.filter((q) => s.answers[q.id]?.independent).length}/${l.questions.length} 题独立完成`,
                    `${l.questions.filter((q) => s.answers[q.id]?.independent).length}/${l.questions.length} independently completed`,
                  )}
                />
                <Text
                  mode={mode}
                  text={t(
                    `${Object.values(s.answers).reduce((sum, a) => sum + a.hints, 0)} 次主动提示`,
                    `${Object.values(s.answers).reduce((sum, a) => sum + a.hints, 0)} hints requested`,
                  )}
                />
                <Text
                  mode={mode}
                  text={t(
                    s.parentChecked ? '解释已核对' : '解释待核对',
                    s.parentChecked
                      ? 'Reasoning reviewed'
                      : 'Reasoning awaiting review',
                  )}
                />
              </div>
              {s.explanation && <blockquote>{s.explanation}</blockquote>}
              {s.note && <p className="math-note">{s.note}</p>}
              <p>
                <Text mode={mode} text={l.parent.misconception} />
              </p>
              {s.explanation && (
                <label className="math-checkbox">
                  <input
                    type="checkbox"
                    checked={s.parentChecked}
                    onChange={(e) =>
                      store.update(l.id, (old) => ({
                        ...old,
                        parentChecked: e.target.checked,
                      }))
                    }
                  />
                  <Text
                    mode={mode}
                    text={t(
                      '我已核对孩子的解释，理由合理。',
                      'I reviewed the learner’s explanation and it makes sense.',
                    )}
                  />
                </label>
              )}
              <details className="math-parent-card">
                <summary>
                  <Text
                    mode={mode}
                    text={t(
                      '查看出口题复核依据',
                      'View exit-ticket review guidance',
                    )}
                  />
                </summary>
                <p>
                  <Text mode={mode} text={l.exit.solution} />
                </p>
                <p>
                  <Text mode={mode} text={l.exitReason} />
                </p>
                <p>
                  <Text mode={mode} text={l.parent.goal} />
                </p>
              </details>
            </section>
          );
        })
      ) : (
        <p className="math-empty">
          <Text
            mode={mode}
            text={t(
              '开始一节课后，发现与解释会出现在这里。',
              'Start a lesson and discoveries and reasoning will appear here.',
            )}
          />
        </p>
      )}
      <button
        className="math-button secondary"
        onClick={() => downloadProgress(store.progress)}
      >
        <Text
          mode={mode}
          text={t('导出学习记录（JSON）', 'Export learning records (JSON)')}
        />{' '}
        ↓
      </button>
    </>
  );
}
