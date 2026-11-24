import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized, QuestionNavigator } from '@study/ui';
import { getLesson, type Lesson } from './content/lessons';
import './LessonScaffolding.css';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export function LearningGoals({
  lesson,
  mode,
}: {
  lesson: Lesson;
  mode: LanguageMode;
}) {
  if (!lesson.learning) return null;
  return (
    <section className="chem-learning-goals">
      <h2>
        <Localized
          mode={mode}
          text={t('学完能做到什么', 'What you will be able to do')}
        />
      </h2>
      <ul>
        {lesson.learning.objectives.map((objective) => (
          <li key={objective.en}>
            <Localized text={objective} mode={mode} />
          </li>
        ))}
      </ul>
      <p>
        <Localized
          mode={mode}
          text={
            lesson.learning.prerequisites.length
              ? t(
                  '先确认这些基础；不熟悉就打开回看：',
                  'Check these foundations; revisit any unfamiliar idea:',
                )
              : t(
                  '这一课不需要化学前置知识，可以从这里开始。',
                  'This lesson needs no prior chemistry knowledge; begin here.',
                )
          }
        />
      </p>
      {lesson.learning.prerequisites.length > 0 && (
        <div className="chem-prerequisite-links">
          {lesson.learning.prerequisites.map((id) => {
            const prerequisite = getLesson(id);
            return (
              prerequisite && (
                <Link key={id} to={`/chemistry/lesson/${id}`}>
                  <Localized text={prerequisite.title} mode={mode} />
                </Link>
              )
            );
          })}
        </div>
      )}
    </section>
  );
}

export function WorkedExampleAndChecks({
  lesson,
  mode,
}: {
  lesson: Lesson;
  mode: LanguageMode;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const learning = lesson.learning;
  if (!learning) return null;
  const question = learning.quickChecks[index]!;
  const answer = answers[question.id];
  return (
    <div className="chem-learning-support">
      <section className="chem-worked-example">
        <h3>
          <Localized
            mode={mode}
            text={t('跟着推理一个例子', 'Follow one worked example')}
          />
        </h3>
        <p>
          <Localized text={learning.workedExample.prompt} mode={mode} />
        </p>
        <details>
          <summary>
            <Localized
              mode={mode}
              text={t(
                '先想一想，再展开推理',
                'Think first, then reveal the reasoning',
              )}
            />
          </summary>
          <ol>
            {learning.workedExample.steps.map((step) => (
              <li key={step.en}>
                <Localized text={step} mode={mode} />
              </li>
            ))}
          </ol>
          <p>
            <strong>
              <Localized text={learning.workedExample.answer} mode={mode} />
            </strong>
          </p>
        </details>
      </section>
      <section
        className="chem-quick-check"
        aria-label={mode === 'en' ? 'Quick checks' : '即时检查'}
      >
        <h3>
          <Localized
            mode={mode}
            text={t(
              '停一下，检查有没有弄明白',
              'Pause and check your understanding',
            )}
          />
        </h3>
        <QuestionNavigator
          mode={mode}
          index={index}
          count={learning.quickChecks.length}
          onChange={setIndex}
        />
        <p>
          <strong>
            <Localized text={question.prompt} mode={mode} />
          </strong>
        </p>
        <div className="chem-check-options">
          {question.options.map((option, i) => (
            <button
              type="button"
              key={option.en}
              aria-pressed={answer === i}
              onClick={() =>
                setAnswers((previous) => ({ ...previous, [question.id]: i }))
              }
            >
              <span>{String.fromCharCode(65 + i)}.</span>{' '}
              <Localized text={option} mode={mode} />
            </button>
          ))}
        </div>
        {answer !== undefined && (
          <div className="chem-check-feedback" role="status">
            <strong>
              <Localized
                mode={mode}
                text={
                  answer === question.answer
                    ? t('这个判断有依据。', 'That judgment is supported.')
                    : t(
                        '再想一下，看看这条线索。',
                        'Think again using this clue.',
                      )
                }
              />
            </strong>
            <p>
              <Localized text={question.explanation} mode={mode} />
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export function ExplainInYourWords({
  lesson,
  mode,
}: {
  lesson: Lesson;
  mode: LanguageMode;
}) {
  if (!lesson.learning) return null;
  return (
    <section className="chem-explain-again">
      <h3>
        <Localized
          mode={mode}
          text={t(
            '离开选项，用自己的话解释',
            'Leave the options behind: explain in your own words',
          )}
        />
      </h3>
      <p>
        <Localized text={lesson.learning.explainPrompt} mode={mode} />
      </p>
      <p>
        <Localized
          mode={mode}
          text={t(
            '先不看例题，口头讲一遍或写在纸上，再和家人核对。能选对选项，还不等于能独立解释。',
            'Explain aloud or on paper without looking at the example, then discuss with someone. Choosing an option alone does not establish independent understanding.',
          )}
        />
      </p>
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '需要帮助？换一种方式理解',
              'Need help? Try another explanation',
            )}
          />
        </summary>
        <p>
          <Localized text={lesson.learning.anotherWay} mode={mode} />
        </p>
      </details>
    </section>
  );
}
