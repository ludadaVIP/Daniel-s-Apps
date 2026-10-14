import type { LanguageMode } from '@study/shared';
import {
  checkAnswer,
  t,
  type Attempt,
  type Question as QuestionData,
} from './model';
import { Strip, Text } from './ui';
export function Question({
  question: q,
  mode,
  attempt,
  onChange,
  exit = false,
}: {
  question: QuestionData;
  mode: LanguageMode;
  attempt?: Attempt;
  onChange: (a: Attempt) => void;
  exit?: boolean;
}) {
  const a = attempt ?? {
    input: '',
    tries: 0,
    hints: 0,
    correct: false,
    independent: false,
  };
  const edit = (input: string) =>
    onChange({
      ...a,
      input,
      checked: false,
      correct: false,
      independent: false,
    });
  const check = () => {
    const correct = checkAnswer(a.input, q.answer);
    if (correct === null) return;
    onChange({
      ...a,
      tries: a.tries + 1,
      checked: true,
      correct,
      independent: correct && a.tries === 0 && a.hints === 0,
    });
  };
  return (
    <div className="math-question">
      <span className="math-eyebrow">
        {q.id} ·{' '}
        <Text
          mode={mode}
          text={t(
            q.answer.kind === 'explain'
              ? '说说你的理由'
              : exit
                ? '换一个情境，独立试试'
                : '试着自己作答',
            q.answer.kind === 'explain'
              ? 'EXPLAIN YOUR THINKING'
              : exit
                ? 'A NEW CONTEXT · TRY INDEPENDENTLY'
                : 'MAKE YOUR OWN ANSWER',
          )}
        />
      </span>
      <h3>
        <Text mode={mode} text={q.stem} />
      </h3>
      {q.visual && <Strip n={q.visual.n} d={q.visual.d} />}
      {q.answer.kind === 'choice' ? (
        <div
          className="math-options"
          role="group"
          aria-label={mode === 'en' ? 'Answer choices' : '答案选项'}
        >
          {q.options?.map((o, i) => (
            <button
              key={o.id}
              type="button"
              disabled={a.checked && a.correct}
              aria-pressed={a.input === o.id}
              onClick={() => edit(o.id)}
            >
              <b>{String.fromCharCode(65 + i)}</b>
              <Text mode={mode} text={o.text} />
            </button>
          ))}
        </div>
      ) : q.answer.kind === 'explain' ? (
        <label className="math-answer">
          <span>
            <Text
              mode={mode}
              text={t(
                '写下自己的想法，也可以先画在纸上。',
                'Write your thinking, or draw it on paper first.',
              )}
            />
          </span>
          <textarea
            aria-label={mode === 'en' ? 'Your reasoning' : '我的解释'}
            rows={3}
            value={a.input}
            onChange={(e) => edit(e.target.value)}
            disabled={a.checked && a.correct}
          />
        </label>
      ) : (
        <label className="math-answer">
          <span>
            <Text
              mode={mode}
              text={t(
                '你的答案（分数可用 3/8）',
                'Your answer (fractions can use 3/8)',
              )}
            />
          </span>
          <div className="math-input-row">
            <input
              aria-label={mode === 'en' ? 'Your answer' : '我的答案'}
              autoComplete="off"
              type="text"
              value={a.input}
              onChange={(e) => edit(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  a.input.trim() &&
                  !(a.checked && a.correct)
                )
                  check();
              }}
              disabled={a.checked && a.correct}
            />
            {q.answer.unit && <span>{q.answer.unit}</span>}
          </div>
        </label>
      )}
      <div className="math-row math-question-actions">
        {q.answer.kind !== 'explain' && (
          <button
            className="math-button"
            disabled={!a.input.trim() || (a.checked && a.correct)}
            onClick={check}
          >
            <Text mode={mode} text={t('检查答案', 'Check answer')} />
            <span>→</span>
          </button>
        )}
        {!exit && (
          <button
            className="math-button secondary"
            disabled={a.hints >= q.hints.length || (a.checked && a.correct)}
            onClick={() => onChange({ ...a, hints: a.hints + 1 })}
          >
            <Text mode={mode} text={t('给我一点提示', 'A little hint')} />
          </button>
        )}
      </div>
      {a.hints > 0 && (
        <div className="math-hint">
          {q.hints.slice(0, a.hints).map((hint, i) => (
            <p key={i}>
              <Text mode={mode} text={hint} />
            </p>
          ))}
        </div>
      )}
      {a.checked && q.answer.kind !== 'explain' && (
        <div
          className={`math-feedback ${a.correct ? 'correct' : 'try-again'}`}
          role="status"
        >
          <strong>
            <Text
              mode={mode}
              text={
                a.correct
                  ? t(
                      a.independent
                        ? '✓ 独立完成，你找到了。'
                        : '✓ 提示或重试后完成，理解在进步。',
                      a.independent
                        ? '✓ You found it independently.'
                        : '✓ Completed with support. Your understanding is growing.',
                    )
                  : t(
                      '↳ 还差一点，换个角度试试。',
                      '↳ Nearly there. Try another perspective.',
                    )
              }
            />
          </strong>
          <p>
            <Text
              mode={mode}
              text={
                a.correct || a.tries >= 3
                  ? q.solution
                  : (q.options?.find((o) => o.id === a.input)?.feedback ??
                    q.hints[Math.min(a.tries - 1, q.hints.length - 1)]!)
              }
            />
          </p>
        </div>
      )}
      {q.answer.kind === 'explain' && (
        <details className="math-parent-card">
          <summary>
            <Text
              mode={mode}
              text={t(
                '家长复核 · 看解释，不只看关键词',
                'Parent review · look at the reasoning',
              )}
            />
          </summary>
          <p>
            <Text mode={mode} text={q.answer.rubric} />
          </p>
          <button
            className="math-button secondary"
            disabled={!a.input.trim() || (a.checked && a.correct)}
            onClick={() =>
              onChange({
                ...a,
                checked: true,
                correct: true,
                independent: a.hints === 0,
                tries: a.tries + 1,
              })
            }
          >
            <Text
              mode={mode}
              text={t(
                '家长确认：解释合理',
                'Parent confirms: reasoning makes sense',
              )}
            />
          </button>
          {a.checked && a.correct && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '✓ 家长已核对解释。',
                  '✓ Reasoning reviewed by a parent.',
                )}
              />
            </p>
          )}
        </details>
      )}
    </div>
  );
}
