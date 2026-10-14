import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lessonById, reviewQuestionFor } from './content';
import { reviewQueue } from './progress';
import { t, type Attempt } from './model';
import { Text } from './ui';
import { Question } from './Question';
import { Intro, type Props } from './pageSupport';
export function Review({ mode, store }: Props) {
  const queue = reviewQueue(store.progress);
  return (
    <>
      <Intro
        mode={mode}
        kicker="COME BACK TO AN IDEA"
        title={t('再见面，会懂得更稳。', 'Meet an idea again. Make it stick.')}
        body={t(
          '需要提示的题型会带着新数字回来。已完成的课默认三天后重温一次，记录会继续保留。',
          'Ideas needing support return with new numbers. Completed lessons are revisited after three days; your earlier records stay saved.',
        )}
      />
      {queue.length ? (
        queue.map((l) => (
          <ReviewItem key={l.id} lessonId={l.id} mode={mode} store={store} />
        ))
      ) : (
        <section className="math-empty">
          <span>✦</span>
          <h2>
            <Text
              mode={mode}
              text={t('现在没有待复习的内容。', 'Nothing waiting for review.')}
            />
          </h2>
          <p>
            <Text
              mode={mode}
              text={t(
                '可以继续探索，也可以回到喜欢的模型。',
                'Keep exploring, or revisit a favourite model.',
              )}
            />
          </p>
          <Link className="math-button" to="/math">
            <Text mode={mode} text={t('回到探索', 'Back to Discover')} />
          </Link>
        </section>
      )}
    </>
  );
}
function ReviewItem({ mode, store, lessonId }: Props & { lessonId: string }) {
  const l = lessonById(lessonId)!;
  const saved = store.progress.reviews[lessonId];
  const round = saved?.round ?? 0;
  const q = reviewQuestionFor(lessonId, round);
  const [attempt, setAttempt] = useState<Attempt>(() => ({
    input: '',
    tries: 0,
    hints: 0,
    correct: false,
    independent: false,
    ...(saved?.completedAt ? {} : saved),
  }));
  return (
    <section className="math-panel">
      <div className="math-row">
        <h3>
          <Text mode={mode} text={l.title} />
        </h3>
        <Link to={`/math/lesson/${l.id}?step=1`}>
          <Text mode={mode} text={t('回看模型', 'Revisit the model')} /> ↗
        </Link>
      </div>
      <Question
        mode={mode}
        question={q}
        attempt={attempt}
        onChange={(a) => {
          setAttempt(a);
          store.setProgress((old) => ({
            ...old,
            reviews: {
              ...old.reviews,
              [l.id]: { ...a, round },
            },
          }));
        }}
      />
      {attempt.correct && (
        <button
          className="math-button secondary"
          onClick={() => {
            store.setProgress((old) => ({
              ...old,
              reviews: {
                ...old.reviews,
                [l.id]: {
                  ...attempt,
                  round: round + 1,
                  completedAt: new Date().toISOString(),
                },
              },
              sessions: {
                ...old.sessions,
                [l.id]: {
                  ...old.sessions[l.id]!,
                  nextReview: new Date(
                    Date.now() + (attempt.independent ? 7 : 1) * 86400000,
                  ).toISOString(),
                },
              },
            }));
          }}
        >
          <Text mode={mode} text={t('记录这次复习', 'Save this review')} /> ✓
        </button>
      )}
    </section>
  );
}
