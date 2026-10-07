import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { lessons, t, type Question } from './content/lessons';
import { B, Icon, Text } from './ui';
import { freshLesson, isMastered, type ProgressStore } from './progress';
import { LessonLab } from './interactive/Labs';
export function QuestionCard({
  question,
  mode,
  answer,
  onAnswer,
  number,
}: {
  question: Question;
  mode: LanguageMode;
  answer?: number;
  onAnswer: (answer: number) => void;
  number: string;
}) {
  const correct = answer === question.correct;
  return (
    <div className="phy-question">
      <div className="phy-question-title">
        <span>{number}</span>
        <h3>
          <Text value={question.prompt} mode={mode} />
        </h3>
      </div>
      <div className="phy-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={
              answer === index ? (correct ? 'is-correct' : 'is-wrong') : ''
            }
            aria-pressed={answer === index}
            onClick={() => onAnswer(index)}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            <Text value={option} mode={mode} />
            {answer === index && <Icon name={correct ? 'check' : 'close'} />}
          </button>
        ))}
      </div>
      {answer !== undefined && (
        <div
          className={`phy-feedback ${correct ? 'correct' : 'wrong'}`}
          role="status"
        >
          <strong>
            <B
              zh={correct ? '想明白了！' : '再想一想，可以重试。'}
              en={
                correct ? 'You’ve got it!' : 'Think it through and try again.'
              }
              mode={mode}
            />
          </strong>
          <Text value={question.explanation} mode={mode} />
        </div>
      )}
    </div>
  );
}
const steps = [
  t('先猜一猜', 'Predict'),
  t('动手探索', 'Explore'),
  t('弄明白', 'Understand'),
  t('试试身手', 'Practice'),
  t('带走一个发现', 'Takeaway'),
];
export function LessonPage({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  const p = (lesson && store.progress.lessons[lesson.id]) || freshLesson();
  const step = p.step;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [lessonId, step]);
  if (!lesson) return <Navigate to="/physics/path" replace />;
  function patch(fields: Partial<typeof p>) {
    store.saveLesson(lesson!.id, (old) => ({
      ...old,
      ...fields,
      unlockedStep: Math.max(old.unlockedStep, fields.step ?? old.step),
    }));
  }
  function answer(index: number, value: number) {
    store.saveLesson(lesson!.id, (old) => ({
      ...old,
      answers: { ...old.answers, [index]: value },
      mistakes:
        value === [...lesson!.questions, lesson!.exit][index]?.correct
          ? old.mistakes
          : [...new Set([...old.mistakes, String(index)])],
    }));
  }
  const ready =
    step === 0
      ? p.prediction !== undefined
      : step === 1
        ? p.explored
        : step === 3
          ? lesson.questions.every((q, i) => p.answers[i] === q.correct)
          : true;
  const completed = !!p.completedAt;
  const next = lessons[lessons.indexOf(lesson) + 1];
  return (
    <div className="phy-page">
      <div className="phy-breadcrumb">
        <Link to="/physics/path">
          <B zh="探索路线" en="Learning path" mode={mode} />
        </Link>
        <span>/</span>
        <span>0{lessons.indexOf(lesson) + 1}</span>
      </div>
      <div className="phy-page-heading">
        <div>
          <p className="phy-eyebrow">
            FOUNDATIONS / DISCOVERY 0{lessons.indexOf(lesson) + 1}
          </p>
          <h1>
            <Text value={lesson.title} mode={mode} />
          </h1>
        </div>
        <span className="phy-tag">
          <Icon name="clock" />
          {lesson.minutes} <B zh="分钟" en="min" mode={mode} />
        </span>
      </div>
      <div className="phy-lesson-layout">
        <div>
          <nav
            className="phy-step-nav"
            aria-label={mode === 'en' ? 'Lesson steps' : '课程步骤'}
          >
            {steps.map((s, i) => (
              <button
                key={i}
                className={step === i ? 'active' : ''}
                disabled={i > p.unlockedStep}
                aria-current={step === i ? 'step' : undefined}
                onClick={() => patch({ step: i })}
              >
                <span>
                  {i < step ? <Icon name="check" size={13} /> : i + 1}
                </span>
                <Text value={s} mode={mode} />
              </button>
            ))}
          </nav>
          <section className="phy-lesson-body" key={`${lesson.id}-${step}`}>
            {step === 0 && (
              <>
                <p className="phy-eyebrow">
                  <B
                    zh="从一个问题开始"
                    en="START WITH A QUESTION"
                    mode={mode}
                  />
                </p>
                <h2>
                  <Text value={lesson.hook} mode={mode} />
                </h2>
                <p className="phy-lead">
                  <Text value={lesson.prediction} mode={mode} />
                </p>
                <div className="phy-predict">
                  {lesson.predictions.map((prediction, i) => (
                    <button
                      key={i}
                      className={p.prediction === i ? 'selected' : ''}
                      aria-pressed={p.prediction === i}
                      onClick={() => patch({ prediction: i })}
                    >
                      <span>{String.fromCharCode(65 + i)}</span>
                      <Text value={prediction} mode={mode} />
                      {p.prediction === i && <Icon name="check" />}
                    </button>
                  ))}
                </div>
                <p className="phy-soft">
                  <B
                    zh="这里不计分。带着你的猜想，去实验里找证据。"
                    en="No score here. Take your prediction into the experiment and look for evidence."
                    mode={mode}
                  />
                </p>
              </>
            )}
            {step === 1 && (
              <>
                <h2>
                  <B
                    zh="改变一点，发现不同。"
                    en="Change something. Notice the difference."
                    mode={mode}
                  />
                </h2>
                <p className="phy-lead">
                  <Text value={lesson.explore} mode={mode} />
                </p>
                <LessonLab
                  kind={lesson.kind}
                  mode={mode}
                  onExplore={() => patch({ explored: true })}
                />
                {p.explored && (
                  <p className="phy-explored">
                    <Icon name="check" />
                    <B
                      zh="已完成探索。再试一个条件，比较你的发现。"
                      en="Exploration recorded. Try another condition and compare."
                      mode={mode}
                    />
                  </p>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <h2>
                  <B zh="把发现连起来。" en="Connect the dots." mode={mode} />
                </h2>
                <p className="phy-concept">
                  <Text value={lesson.concept} mode={mode} />
                </p>
                {lesson.formula && (
                  <div className="phy-formula">
                    <Text value={lesson.formula} mode={mode} />
                  </div>
                )}
                <div className="phy-example">
                  <h3>
                    <B zh="一起想一个例子" en="A worked example" mode={mode} />
                  </h3>
                  <Text value={lesson.example} mode={mode} />
                </div>
                <div className="phy-misconception">
                  <Icon name="sparkle" />
                  <div>
                    <h3>
                      <B
                        zh="一个容易踩的坑"
                        en="A common misconception"
                        mode={mode}
                      />
                    </h3>
                    <Text value={lesson.misconception} mode={mode} />
                  </div>
                </div>
                <div className="phy-example">
                  <h3>
                    <B zh="在真实世界里" en="In the real world" mode={mode} />
                  </h3>
                  <Text value={lesson.realWorld} mode={mode} />
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2>
                  <B zh="你能解释它吗？" en="Can you explain it?" mode={mode} />
                </h2>
                <p className="phy-soft">
                  <B
                    zh="答错也没关系。看懂反馈后，可以重新选择。"
                    en="Mistakes are useful. Read the feedback, then try again."
                    mode={mode}
                  />
                </p>
                {lesson.questions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    mode={mode}
                    number={`0${i + 1}`}
                    answer={p.answers[i]}
                    onAnswer={(v) => answer(i, v)}
                  />
                ))}
              </>
            )}
            {step === 4 && (
              <>
                <div className="phy-takeaway">
                  <Icon name="sparkle" size={30} />
                  <p className="phy-eyebrow">
                    <B zh="今天带走的发现" en="TODAY’S TAKEAWAY" mode={mode} />
                  </p>
                  <h2>
                    <Text value={lesson.summary} mode={mode} />
                  </h2>
                </div>
                <QuestionCard
                  question={lesson.exit}
                  mode={mode}
                  number="↗"
                  answer={p.answers[lesson.questions.length]}
                  onAnswer={(v) => answer(lesson.questions.length, v)}
                />
                <div className="phy-example">
                  <h3>
                    <B zh="把物理带回家" en="Take physics home" mode={mode} />
                  </h3>
                  <Text value={lesson.homeExperiment} mode={mode} />
                </div>
                {completed && (
                  <div className="phy-completion" role="status">
                    <Icon name="check" />
                    <div>
                      <strong>
                        <B
                          zh="这节课完成啦！"
                          en="Lesson complete!"
                          mode={mode}
                        />
                      </strong>
                      <B
                        zh="明天回来复习，让发现变成真正的理解。"
                        en="Come back tomorrow to turn a discovery into lasting understanding."
                        mode={mode}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          <div className="phy-lesson-bottom">
            <button
              className="phy-text-button"
              disabled={step === 0}
              onClick={() => patch({ step: step - 1 })}
            >
              <B zh="← 上一步" en="← Back" mode={mode} />
            </button>
            <span>{step + 1} / 5</span>
            {step < 4 ? (
              <button
                className="phy-button"
                disabled={!ready}
                onClick={() => patch({ step: step + 1 })}
              >
                <B zh="继续探索" en="Continue" mode={mode} />
                <Icon name="arrow" />
              </button>
            ) : completed ? (
              <Link
                className="phy-button"
                to={next ? `/physics/lesson/${next.id}` : '/physics'}
              >
                <B
                  zh={next ? '下一课' : '回到探索室'}
                  en={next ? 'Next lesson' : 'Back to the lab'}
                  mode={mode}
                />
                <Icon name="arrow" />
              </Link>
            ) : (
              <button
                className="phy-button"
                disabled={!isMastered(lesson.id, p)}
                onClick={() => patch({ completedAt: Date.now() })}
              >
                <B zh="完成这节课" en="Complete lesson" mode={mode} />
                <Icon name="check" />
              </button>
            )}
          </div>
        </div>
        <aside className="phy-lesson-aside">
          <p className="phy-eyebrow">FIELD NOTES</p>
          <h3>
            <B zh="这一课的小词典" en="Your mini glossary" mode={mode} />
          </h3>
          {lesson.vocabulary.map((v) => (
            <div className="phy-vocab" key={v.en}>
              <strong>{v.zh}</strong>
              <span>{v.en}</span>
            </div>
          ))}
          <div className="phy-aside-tip">
            <Icon name="book" />
            <p>
              <B
                zh="理解之后，试着用自己的话讲给家人听。"
                en="Once you understand, explain it to someone in your own words."
                mode={mode}
              />
            </p>
            <Link to="/physics/notebook">
              <B zh="记下我的发现 →" en="Record my discovery →" mode={mode} />
            </Link>
          </div>
          <Link className="phy-aside-back" to="/physics">
            <B
              zh="← 随时回首页，进度已保留"
              en="← Return home; your place is saved"
              mode={mode}
            />
          </Link>
        </aside>
      </div>
    </div>
  );
}
