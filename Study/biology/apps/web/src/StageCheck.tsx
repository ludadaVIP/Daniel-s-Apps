import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { t, type Question } from './schema';
import { Text } from './ui';

export function CheckCard({
  question,
  relatedLesson,
  answer,
  save,
  mode,
}: {
  question: Question;
  relatedLesson: string;
  answer: number | undefined;
  save: (value: number) => void;
  mode: LanguageMode;
}) {
  const [choice, setChoice] = useState(answer),
    [submitted, setSubmitted] = useState(answer !== undefined);
  return (
    <>
      <h2>
        <Text mode={mode} text={question.prompt} />
      </h2>
      <div className="bio-options">
        {question.options.map((o, i) => (
          <button
            key={i}
            aria-pressed={choice === i}
            disabled={submitted}
            onClick={() => setChoice(i)}
          >
            <span>{'ABC'[i]}</span>
            <Text mode={mode} text={o} />
          </button>
        ))}
      </div>
      {submitted ? (
        <div className="bio-inquiry-result" role="status">
          <Text
            mode={mode}
            text={
              choice === question.correct
                ? t('这条证据找对了。', 'You identified the evidence.')
                : t('还有值得回看的线索。', 'There is a clue to revisit.')
            }
          />
          <Text mode={mode} text={question.feedback} />
          <Link to={`/biology/lesson/${relatedLesson}`}>
            <Text
              mode={mode}
              text={t('回看相关课程 ↗', 'Revisit the related lesson ↗')}
            />
          </Link>
          <button onClick={() => setSubmitted(false)}>
            <Text mode={mode} text={t('重新想一次', 'Think again')} />
          </button>
        </div>
      ) : (
        <button
          className="bio-button"
          disabled={choice === undefined}
          onClick={() => {
            save(choice!);
            setSubmitted(true);
          }}
        >
          <Text mode={mode} text={t('查看解释 →', 'View explanation →')} />
        </button>
      )}
    </>
  );
}
