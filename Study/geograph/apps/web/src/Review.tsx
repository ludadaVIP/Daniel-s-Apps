import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { lessons, t, words } from './content';
import { dueLessons, type Store } from './progress';
import { RecallQuestion } from './LessonPage';
import { Text } from './ui';
export function Review({ store, mode }: { store: Store; mode: LanguageMode }) {
  const explored = lessons.filter(
    (l) => store.progress.sessions[l.id]?.completedAt,
  );
  const [selected, setSelected] = useState('');
  const [answer, setAnswer] = useState<number>();
  const [saved, setSaved] = useState(false);
  const lesson = explored.find((l) => l.id === selected);
  const due = dueLessons(store.progress);
  return (
    <>
      <span className="geo-eyebrow">REVISIT / USE THE EVIDENCE</span>
      <h1>
        <Text
          mode={mode}
          text={t('换个问题，再用一次。', 'Use your evidence again.')}
        />
      </h1>
      <p className="geo-subtitle">
        <Text
          mode={mode}
          text={t(
            '完成课程 7 天后推荐回访，也可以随时再练。用一个迁移问题检验自己的解释，不计排名。',
            'A revisit is suggested seven days after a lesson, or practise whenever you like. Use a transfer question to check your explanation; there are no rankings.',
          )}
        />
      </p>
      {explored.length === 0 ? (
        <div className="geo-empty">
          <h2>
            {words(
              mode,
              '第一条发现，从探索开始。',
              'Your first discovery begins with exploring.',
            )}
          </h2>
          <p>
            {words(
              mode,
              '完成任意一课后，这里会出现可回访的课程。',
              'Complete a lesson and its revisit will appear here.',
            )}
          </p>
          <Link className="geo-button" to="/geography/lesson/GEO-001">
            {words(mode, '开始第一课', 'Start lesson one')} →
          </Link>
        </div>
      ) : (
        <>
          <div className="geo-review-list">
            {explored.map((l) => (
              <button
                key={l.id}
                aria-pressed={selected === l.id}
                onClick={() => {
                  setSelected(l.id);
                  setAnswer(undefined);
                  setSaved(false);
                }}
              >
                <span>{l.id}</span>
                <Text mode={mode} text={l.title} />
                <small>
                  {due.includes(l.id)
                    ? words(mode, '建议回访', 'Revisit suggested')
                    : words(mode, '随时练习', 'Practise anytime')}
                </small>
              </button>
            ))}
          </div>
          {lesson ? (
            <section className="geo-lesson-panel">
              <RecallQuestion
                question={lesson.transfer}
                mode={mode}
                answer={answer}
                onAnswer={(i) => {
                  setAnswer(i);
                  setSaved(false);
                }}
              />
              {answer === lesson.transfer.answer && (
                <button
                  className="geo-button"
                  onClick={() => {
                    store.patch(lesson.id, {
                      reviewAt: Date.now() + 7 * 86400000,
                    });
                    setSaved(true);
                  }}
                >
                  {words(mode, '记录这次回访', 'Record this revisit')} ✓
                </button>
              )}
              {saved && (
                <p className="geo-feedback success" role="status">
                  {words(
                    mode,
                    '已记录，7 天后再用一次。',
                    'Recorded. Use it again in seven days.',
                  )}
                </p>
              )}
              <Link
                className="geo-text-link"
                to={`/geography/lesson/${lesson.id}`}
              >
                {words(
                  mode,
                  '回到图解与任务',
                  'Return to diagrams and mission',
                )}{' '}
                ↗
              </Link>
            </section>
          ) : (
            <p className="geo-notice">
              {words(
                mode,
                '选一课，回到一个新情境里使用证据。',
                'Choose a lesson to use its evidence in a new situation.',
              )}
            </p>
          )}
        </>
      )}
    </>
  );
}
