import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuestionNavigator } from '@study/ui';
import { diagnosticGroups } from './content';
import { t, checkAnswer, diagnosticSummary } from './model';
import { Text } from './ui';
import { Intro, words, type Props } from './pageSupport';
export function Diagnostic({ mode, store }: Props) {
  const [group, setGroup] = useState(0);
  const g = diagnosticGroups[group]!;
  return (
    <>
      <Intro
        mode={mode}
        kicker="FIND YOUR STARTING POINT / D00"
        title={t('认识你已经会的。', 'Discover what you already know.')}
        body={t(
          '不是考试，不计时。每组 6 题，可分开完成；不确定和跳过都没关系。结果只是学习建议，可以自己调整起点。',
          'No exam, no timer. Six questions per group, completed separately. Unsure and skipped answers are fine. Recommendations are provisional; choose your own starting point.',
        )}
      />
      <div className="math-diagnostic-tabs">
        {diagnosticGroups.map((g, i) => {
          const summary = diagnosticSummary(g.questions, store.progress);
          return (
            <button
              key={g.id}
              aria-pressed={i === group}
              onClick={() => setGroup(i)}
            >
              <b>{g.id}</b>
              <Text mode={mode} text={g.title} />
              <small>{summary.answered}/6</small>
            </button>
          );
        })}
      </div>
      <DiagnosticGroup key={g.id} group={group} mode={mode} store={store} />
      <div className="math-section-heading">
        <h2>
          <Text
            mode={mode}
            text={t('四种能力，分别看见。', 'Four areas. Individual insights.')}
          />
        </h2>
      </div>
      <div className="math-diagnostic-results">
        {diagnosticGroups.map((g) => {
          const summary = diagnosticSummary(g.questions, store.progress);
          return (
            <section className="math-panel" key={g.id}>
              <h3>
                <Text mode={mode} text={g.title} />
              </h3>
              <p>
                <Text
                  mode={mode}
                  text={
                    summary.answered === 6
                      ? t(
                          `${summary.independent} 个独立完成，${6 - summary.independent} 个值得再聊聊。不是正式能力测量，还需解释或再次观察。`,
                          `${summary.independent} independently completed; ${6 - summary.independent} to discuss. This is not a validated assessment; reasoning and another observation are still needed.`,
                        )
                      : t(
                          `已记录 ${summary.answered}/6 题，完成后再看建议。`,
                          `${summary.answered}/6 recorded. Complete the group for a recommendation.`,
                        )
                  }
                />
              </p>
              {summary.answered === 6 && (
                <div className="math-hint">
                  <Text
                    mode={mode}
                    text={
                      summary.independent >= 4
                        ? t(
                            '初步看来可以尝试更多探索；先让孩子解释一题，确认理解。',
                            'Tentatively ready to explore further. Ask the learner to explain one answer first.',
                          )
                        : g.bridge
                    }
                  />
                  {['D01', 'D02', 'D03', 'D04'].includes(g.id) &&
                    summary.independent < 4 && (
                      <Link
                        className="math-button secondary"
                        to={
                          g.id === 'D01'
                            ? '/math/lesson/B01-L01'
                            : g.id === 'D02'
                              ? '/math/lesson/B04-L01'
                              : g.id === 'D03'
                                ? '/math/lesson/B05-L01'
                                : '/math/lesson/B06-L01'
                        }
                      >
                        <Text
                          mode={mode}
                          text={
                            g.id === 'D01'
                              ? t('从位值开始探索', 'Explore place value first')
                              : g.id === 'D02'
                                ? t(
                                    '从等份开始探索',
                                    'Explore equal parts first',
                                  )
                                : g.id === 'D03'
                                  ? t(
                                      '从测量与图形开始探索',
                                      'Explore measurement and shapes first',
                                    )
                                  : t(
                                      '从问题的数量关系开始探索',
                                      'Explore problem-solving relationships first',
                                    )
                          }
                        />{' '}
                        →
                      </Link>
                    )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
function DiagnosticGroup({ mode, store, group }: Props & { group: number }) {
  const g = diagnosticGroups[group]!;
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      g.questions.findIndex((q) => !store.progress.diagnostic[q.id]),
    ),
  );
  const q = g.questions[index]!,
    saved = store.progress.diagnostic[q.id];
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const input = drafts[q.id] ?? saved?.input ?? '';
  const save = (result: 'correct' | 'help' | 'skipped') =>
    store.setProgress((old) => ({
      ...old,
      diagnostic: { ...old.diagnostic, [q.id]: { input, result } },
    }));
  const completed = g.questions.every((q) => store.progress.diagnostic[q.id]);
  return (
    <section className="math-panel">
      <QuestionNavigator
        index={index}
        count={6}
        mode={mode}
        onChange={setIndex}
      />
      <div className="math-question">
        <span className="math-eyebrow">{q.id}</span>
        <h3>
          <Text mode={mode} text={q.stem} />
        </h3>
        {q.answer.kind === 'choice' ? (
          <div className="math-options">
            {q.options?.map((o) => (
              <button
                key={o.id}
                aria-pressed={input === o.id}
                onClick={() => setDrafts((old) => ({ ...old, [q.id]: o.id }))}
              >
                <Text mode={mode} text={o.text} />
              </button>
            ))}
          </div>
        ) : (
          <label className="math-answer">
            <Text mode={mode} text={t('你的答案', 'Your answer')} />
            <div className="math-input-row">
              <input
                aria-label={words(mode, '诊断答案', 'Diagnostic answer')}
                type="text"
                value={input}
                onChange={(e) =>
                  setDrafts((old) => ({ ...old, [q.id]: e.target.value }))
                }
              />
              {q.answer.kind === 'number' && q.answer.unit && (
                <span>{q.answer.unit}</span>
              )}
            </div>
          </label>
        )}
        <div className="math-row math-question-actions">
          <button
            className="math-button"
            disabled={!input.trim()}
            onClick={() => {
              save(checkAnswer(input, q.answer) ? 'correct' : 'help');
              if (index < 5) setIndex(index + 1);
            }}
          >
            <Text mode={mode} text={t('记录我的答案', 'Record my answer')} /> →
          </button>
          <button
            className="math-button secondary"
            onClick={() => {
              save('help');
              if (index < 5) setIndex(index + 1);
            }}
          >
            <Text mode={mode} text={t('我不确定', 'I’m not sure')} />
          </button>
          <button
            className="math-button text"
            onClick={() => {
              save('skipped');
              if (index < 5) setIndex(index + 1);
            }}
          >
            <Text mode={mode} text={t('先跳过', 'Skip for now')} />
          </button>
        </div>
        {saved && (
          <p className="math-muted" role="status">
            <Text
              mode={mode}
              text={t(
                '✓ 这一题已记录，可以修改后重新记录。',
                '✓ This question is recorded. You can edit and record again.',
              )}
            />
          </p>
        )}
        {completed && (
          <details className="math-parent-card">
            <summary>
              <Text
                mode={mode}
                text={t(
                  '本组完成 · 和家长一起回看方法',
                  'Group complete · review the methods with a parent',
                )}
              />
            </summary>
            {g.questions.map((q) => (
              <p key={q.id}>
                <b>{q.id} </b>
                <Text mode={mode} text={q.solution} />
              </p>
            ))}
          </details>
        )}
      </div>
    </section>
  );
}
