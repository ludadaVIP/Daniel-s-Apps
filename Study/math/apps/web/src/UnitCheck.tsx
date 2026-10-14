import { Link, useParams } from 'react-router-dom';
import { QuestionNavigator } from '@study/ui';
import { unitChecks, type UnitCheckId } from './content';
import { newSession, t } from './model';
import { Question } from './Question';
import { Text } from './ui';
import { Intro, type Props } from './pageSupport';
export function UnitCheck(props: Props) {
  const { unitId } = useParams();
  const check = unitChecks[unitId as UnitCheckId];
  if (!check)
    return (
      <>
        <Intro
          mode={props.mode}
          kicker="UNIT REVIEW"
          title={t(
            '这个单元回顾还在准备中。',
            'This unit review is being prepared.',
          )}
          body={t(
            '先探索已经开放的单元。',
            'Explore one of the open units first.',
          )}
        />
        <Link className="math-button" to="/math">
          <Text mode={props.mode} text={t('回到探索', 'Back to Discover')} />
        </Link>
      </>
    );
  const { mode, store } = props,
    s = store.progress.sessions[check.id] ?? newSession(),
    index = Math.min(s.practiceIndex ?? 0, check.questions.length - 1),
    q = check.questions[index]!;
  const recorded = check.questions.filter(
      (q) => s.answers[q.id]?.checked,
    ).length,
    independent = check.questions.filter(
      (q) => s.answers[q.id]?.correct && s.answers[q.id]?.independent,
    ).length;
  return (
    <>
      <Link className="math-back" to={`/math#${check.unit}`}>
        ← <Text mode={mode} text={t('回到这个单元', 'Back to this unit')} />
      </Link>
      <Intro
        mode={mode}
        kicker={`${check.unit} / UNIT REVIEW`}
        title={check.title}
        body={t(
          '把几节课的想法连起来。没有计时；可以分两次做，答案和提示都会保留。解释题仍由家长核对。',
          'Connect the ideas from several lessons. No timer; split this across two sessions if useful. Answers and hints stay saved, and a parent reviews the explanation.',
        )}
      />
      <section className="math-panel">
        <QuestionNavigator
          mode={mode}
          index={index}
          count={check.questions.length}
          onChange={(i) =>
            store.update(check.id, (old) => ({ ...old, practiceIndex: i }))
          }
        />
        <Question
          key={q.id}
          question={q}
          mode={mode}
          attempt={s.answers[q.id]}
          onChange={(a) =>
            store.update(check.id, (old) => ({
              ...old,
              answers: { ...old.answers, [q.id]: a },
            }))
          }
        />
      </section>
      <section className="math-panel">
        <h3>
          <Text
            mode={mode}
            text={t(
              '看看哪些想法已经连起来',
              'Notice which ideas are connected',
            )}
          />
        </h3>
        <p>
          <Text
            mode={mode}
            text={t(
              `已记录 ${recorded}/${check.questions.length} 题；${independent} 题独立完成。尚未核对的解释不算完成。`,
              `Recorded ${recorded}/${check.questions.length}; ${independent} independently completed. An explanation is unfinished until reviewed.`,
            )}
          />
        </p>
        {recorded === check.questions.length && (
          <div className="math-hint">
            <Text
              mode={mode}
              text={
                independent >= Math.ceil(check.questions.length * 0.8)
                  ? t(
                      '这次回顾有较好的独立完成证据。请孩子再用图说明一题，再决定下一步；一次表现不代表永久掌握。',
                      'This review gives useful evidence of independent understanding. Ask the learner to explain another answer with a diagram before choosing the next step; one attempt does not mean permanent mastery.',
                    )
                  : t(
                      '有些想法还值得再解释。先回到本单元的基础模型，用图重看；不必为了做满题量而赶进度。',
                      'Some ideas deserve another explanation. Revisit this unit’s foundation model; there is no need to rush for a question count.',
                    )
              }
            />
          </div>
        )}
        <Link
          className="math-button secondary"
          to={`/math/lesson/${check.bridge}?step=1`}
        >
          <Text
            mode={mode}
            text={t('回到基础模型', 'Revisit the foundation model')}
          />{' '}
          ↗
        </Link>
        <p className="math-muted">
          <Text
            mode={mode}
            text={t(
              '单元回顾的记录独立保存，不会修改各课的掌握状态。可以逐题回看方法；每课的复习仍在“温故知新”中继续。',
              'This review is stored separately and does not alter lesson mastery. Review each method here; lesson retrieval continues in the Review space.',
            )}
          />
        </p>
      </section>
    </>
  );
}
