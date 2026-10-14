import { climateLessonIds } from './climateModels';
import { ClimateExplorer } from './ClimateActivities';
import { weatherLessonIds } from './weatherModels';
import { WeatherExplorer } from './WeatherActivities';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import {
  assets,
  curriculum,
  lessonById,
  lessons,
  t,
  words,
  type Lesson,
  type Question,
} from './content';
import { Activity, activityFinished, RotationControls } from './Activities';
import {
  newSession,
  finishSession,
  type Session,
  type Store,
} from './progress';
import { AssetImage, Markdown, Text } from './ui';
import { ConceptDiagram, NZMap, RouteMap, WorldMap } from './visuals';
import { SkillExplorer } from './SkillActivities';
import { TerrainExplorer } from './TerrainActivities';
import { terrainLessonIds } from './terrainModels';
import { placeLessonIds } from './placeModels';
import { PlaceExplorer } from './PlaceActivities';
import { geologyLessonIds } from './geologyModels';
import { GeologyExplorer } from './GeologyActivities';
import { landscapeLessonIds } from './landscapeModels';
import { LandscapeExplorer } from './LandscapeActivities';
import { earthSurfaceLessonIds } from './earthSurfaceModels';
import { EarthSurfaceExplorer } from './EarthSurfaceActivities';
import { waterEarthLessonIds } from './waterEarthModels';
import { WaterEarthExplorer } from './WaterEarthActivities';
const steps = [
  t('神秘问题', 'Mystery'),
  t('观察预测', 'Observe'),
  t('图解故事', 'Story'),
  t('动手任务', 'Mission'),
  t('我来解释', 'Explain'),
  t('轻量回顾', 'Recall'),
  t('好奇心之门', 'Curiosity'),
];
export function RecallQuestion({
  question,
  mode,
  answer,
  onAnswer,
}: {
  question: Question;
  mode: LanguageMode;
  answer: number | undefined;
  onAnswer: (i: number) => void;
}) {
  return (
    <article className="geo-question">
      <h3>
        <Text mode={mode} text={question.prompt} />
      </h3>
      <div
        className="geo-option-list"
        role="group"
        aria-label={words(mode, question.prompt.zh, question.prompt.en)}
      >
        {question.options.map((option, i) => (
          <button
            key={i}
            aria-pressed={answer === i}
            onClick={() => onAnswer(i)}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            <Text mode={mode} text={option} />
          </button>
        ))}
      </div>
      {answer !== undefined && (
        <div
          className={`geo-feedback ${answer === question.answer ? 'success' : ''}`}
          role="status"
        >
          <strong>
            {words(
              mode,
              answer === question.answer ? '✓ 你的解释有依据' : '再看一条线索',
              answer === question.answer
                ? '✓ Supported by evidence'
                : 'Look at another clue',
            )}
          </strong>
          <Text
            mode={mode}
            text={
              answer === question.answer ? question.explanation : question.hint
            }
          />
          {answer !== question.answer && (
            <p>
              {words(
                mode,
                '可以直接重试，也可以返回图解重新观察。',
                'Retry, or revisit the diagrams to look again.',
              )}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
function Hero({
  lesson,
  mode,
  session,
  store,
}: {
  lesson: Lesson;
  mode: LanguageMode;
  session: Session;
  store: Store;
}) {
  if (climateLessonIds.includes(lesson.id))
    return (
      <ClimateExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (weatherLessonIds.includes(lesson.id))
    return (
      <WeatherExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (waterEarthLessonIds.includes(lesson.id))
    return (
      <WaterEarthExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (earthSurfaceLessonIds.includes(lesson.id))
    return (
      <EarthSurfaceExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (landscapeLessonIds.includes(lesson.id))
    return (
      <LandscapeExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (geologyLessonIds.includes(lesson.id))
    return (
      <GeologyExplorer
        mystery
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (placeLessonIds.includes(lesson.id))
    return (
      <PlaceExplorer
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (terrainLessonIds.includes(lesson.id))
    return (
      <TerrainExplorer
        id={lesson.id}
        mode={mode}
        state={session.activity}
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (['GEO-005', 'GEO-006', 'GEO-007', 'GEO-008'].includes(lesson.id))
    return (
      <SkillExplorer
        id={lesson.id}
        mode={mode}
        state={session.activity}
        panel={
          lesson.id === 'GEO-008'
            ? 1
            : lesson.id === 'GEO-007'
              ? 2
              : lesson.id === 'GEO-006'
                ? 2
                : 0
        }
        onChange={(activity) => store.patch(lesson.id, { activity })}
      />
    );
  if (lesson.id === 'GEO-002')
    return <WorldMap mode={mode} centre={session.activity.centre} />;
  if (lesson.id === 'GEO-004')
    return (
      <>
        <RotationControls
          mode={mode}
          value={session.activity.rotation}
          onChange={(rotation) =>
            store.patch(lesson.id, {
              activity: {
                ...session.activity,
                rotation,
                decisions: {
                  ...session.activity.decisions,
                  rotated: rotation
                    ? 'yes'
                    : (session.activity.decisions.rotated ?? ''),
                },
              },
            })
          }
        />
        <RouteMap mode={mode} rotation={session.activity.rotation} />
      </>
    );
  return <AssetImage id={lesson.hero} mode={mode} />;
}
function Story({
  lesson,
  mode,
  session,
  store,
}: {
  lesson: Lesson;
  mode: LanguageMode;
  session: Session;
  store: Store;
}) {
  const [panel, setPanel] = useState(0);
  const art = climateLessonIds.includes(lesson.id) ? (
    <ClimateExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : weatherLessonIds.includes(lesson.id) ? (
    <WeatherExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : waterEarthLessonIds.includes(lesson.id) ? (
    <WaterEarthExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : earthSurfaceLessonIds.includes(lesson.id) ? (
    <EarthSurfaceExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : landscapeLessonIds.includes(lesson.id) ? (
    <LandscapeExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : geologyLessonIds.includes(lesson.id) ? (
    <GeologyExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : placeLessonIds.includes(lesson.id) ? (
    <PlaceExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : terrainLessonIds.includes(lesson.id) ? (
    <TerrainExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : ['GEO-005', 'GEO-006', 'GEO-007', 'GEO-008'].includes(lesson.id) ? (
    <SkillExplorer
      id={lesson.id}
      mode={mode}
      state={session.activity}
      panel={panel}
      onChange={(activity) => store.patch(lesson.id, { activity })}
    />
  ) : lesson.id === 'GEO-001' ? (
    panel === 0 ? (
      <ConceptDiagram kind="surface" mode={mode} />
    ) : panel === 1 ? (
      <ConceptDiagram kind="section" mode={mode} />
    ) : (
      <WorldMap mode={mode} reveal />
    )
  ) : lesson.id === 'GEO-002' ? (
    panel < 2 ? (
      <WorldMap mode={mode} reveal centre={panel === 1 ? 180 : 0} />
    ) : (
      <ConceptDiagram kind="oceans" mode={mode} />
    )
  ) : lesson.id === 'GEO-003' ? (
    panel === 0 ? (
      <AssetImage id={lesson.hero} mode={mode} compact />
    ) : panel === 1 ? (
      <ConceptDiagram kind="legend" mode={mode} />
    ) : (
      <NZMap mode={mode} layer="terrain" />
    )
  ) : panel === 1 ? (
    <ConceptDiagram kind="north" mode={mode} />
  ) : (
    <>
      <RotationControls
        mode={mode}
        value={session.activity.rotation}
        onChange={(rotation) =>
          store.patch(lesson.id, {
            activity: {
              ...session.activity,
              rotation,
              decisions: {
                ...session.activity.decisions,
                rotated: rotation
                  ? 'yes'
                  : (session.activity.decisions.rotated ?? ''),
              },
            },
          })
        }
      />
      <RouteMap
        mode={mode}
        rotation={session.activity.rotation}
        route={
          panel === 2
            ? ['school', 'south', 'bridge', 'north', 'library']
            : ['school']
        }
      />
    </>
  );
  return (
    <>
      <div
        className="geo-story-tabs"
        role="group"
        aria-label={words(mode, '图解故事分页', 'Story panels')}
      >
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            aria-pressed={panel === i}
            onClick={() => setPanel(i)}
          >
            {String(i + 1).padStart(2, '0')} / {words(mode, '图解', 'Diagram')}
          </button>
        ))}
      </div>
      <div className="geo-story-grid">
        <div>{art}</div>
        <div className="geo-story-copy">
          <Markdown text={lesson.blocks[`story-${panel + 1}`]!} mode={mode} />
        </div>
      </div>
      <div className="geo-story-navigation">
        <button
          className="geo-button secondary"
          disabled={panel === 0}
          onClick={() => setPanel((p) => p - 1)}
        >
          {words(mode, '上一幅图解', 'Previous diagram')}
        </button>
        <span>{panel + 1} / 3</span>
        <button
          className="geo-button secondary"
          disabled={panel === 2}
          onClick={() => setPanel((p) => p + 1)}
        >
          {words(mode, '下一幅图解', 'Next diagram')} →
        </button>
      </div>
      <aside className="geo-notice">
        <Markdown mode={mode} text={lesson.blocks.misconception!} />
      </aside>
    </>
  );
}
export function LessonPage({
  store,
  mode,
}: {
  store: Store;
  mode: LanguageMode;
}) {
  const { lessonId } = useParams();
  const lesson = lessonById(lessonId);
  if (!lesson)
    return (
      <section className="geo-empty">
        <h1>{words(mode, '这节课尚未开放', 'This lesson is not open yet')}</h1>
        <p>
          {words(
            mode,
            `目前开放 ${lessons.length} 节完整课程，其他课见规划目录。`,
            `${lessons.length} complete lessons are open. Other lessons are in the roadmap.`,
          )}
        </p>
        <Link className="geo-button" to="/geography/path">
          {words(mode, '查看课程目录', 'View curriculum')}
        </Link>
      </section>
    );
  return (
    <LearningWorkspace
      key={lesson.id}
      lesson={lesson}
      store={store}
      mode={mode}
    />
  );
}
function LearningWorkspace({
  lesson,
  store,
  mode,
}: {
  lesson: Lesson;
  store: Store;
  mode: LanguageMode;
}) {
  const session = store.progress.sessions[lesson.id] ?? newSession();
  const [recallIndex, setRecallIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!store.progress.sessions[lesson.id]?.startedAt)
      store.patch(lesson.id, { startedAt: Date.now() });
  }, [lesson.id, store]);
  const setStep = (step: number) => {
    store.patch(lesson.id, { step });
    setFinished(false);
  };
  const questions = [...lesson.recall, lesson.transfer];
  const answered = questions.every((q) => session.answers[q.id] !== undefined);
  const hasExplanation = !!session.note.trim() || session.oral;
  const missionDone = activityFinished(lesson.id, session.activity);
  const ready =
    missionDone && hasExplanation && answered && session.prediction !== null;
  const canContinue =
    session.step === 1
      ? session.prediction !== null
      : session.step === 3
        ? missionDone
        : session.step === 4
          ? hasExplanation
          : session.step === 5
            ? answered
            : true;
  const next = lessons[lessons.indexOf(lesson) + 1];
  const stage = curriculum.find((s) => s.id === lesson.stage)!;
  return (
    <>
      <Link className="geo-back" to={`/geography/path?stage=${stage.id}`}>
        ←{' '}
        {words(
          mode,
          `${stage.title.zh} / 课程目录`,
          `${stage.title.en} / curriculum`,
        )}
      </Link>
      <header className="geo-lesson-heading">
        <div>
          <span className="geo-eyebrow">
            {stage.id} / {lesson.id} · {lesson.minutes}{' '}
            {words(mode, '分钟', 'MIN')}
          </span>
          <h1>
            <Text mode={mode} text={lesson.title} />
          </h1>
        </div>
        <span className="geo-badge">
          {session.completedAt ? '✓ ' : ''}
          {words(
            mode,
            session.completedAt ? '已探索' : '探索中',
            session.completedAt ? 'Explored' : 'Exploring',
          )}
        </span>
      </header>
      <nav
        className="geo-steps"
        aria-label={words(mode, '课程环节', 'Lesson steps')}
      >
        {steps.map((text, i) => (
          <button
            key={i}
            aria-current={session.step === i ? 'step' : undefined}
            onClick={() => setStep(i)}
          >
            <span>{i + 1}</span>
            <Text mode={mode} text={text} />
          </button>
        ))}
      </nav>
      <section className="geo-lesson-panel">
        <div className="geo-section-title">
          <span className="geo-eyebrow">0{session.step + 1} / 07</span>
          <h2>
            <Text mode={mode} text={steps[session.step]!} />
          </h2>
        </div>
        {session.step === 0 && (
          <>
            <h3 className="geo-mystery">
              <Text mode={mode} text={lesson.question} />
            </h3>
            <div className="geo-hook-grid">
              <Hero
                lesson={lesson}
                mode={mode}
                session={session}
                store={store}
              />
              <div>
                <Markdown text={lesson.blocks.hook!} mode={mode} />
                <div className="geo-objectives">
                  <span className="geo-eyebrow">
                    {words(mode, '这课我能学会', 'I WILL LEARN TO')}
                  </span>
                  <ul>
                    {lesson.outcomes.map((o, i) => (
                      <li key={i}>
                        <Text mode={mode} text={o} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        {session.step === 1 && (
          <>
            <Markdown text={lesson.blocks.hook!} mode={mode} />
            <Hero lesson={lesson} mode={mode} session={session} store={store} />
            <h3>
              {words(mode, '你的初步猜想是什么？', 'What is your first guess?')}
            </h3>
            <div className="geo-option-list">
              {lesson.prediction.map((p, i) => (
                <button
                  key={i}
                  aria-pressed={session.prediction === i}
                  onClick={() => store.patch(lesson.id, { prediction: i })}
                >
                  <Text mode={mode} text={p} />
                </button>
              ))}
            </div>
            {session.prediction !== null && (
              <p className="geo-feedback" role="status">
                <Text
                  mode={mode}
                  text={t(
                    '猜想已记录。先不用判断对错，带着它去找证据。',
                    'Guess recorded. No score: take it with you as you look for evidence.',
                  )}
                />
              </p>
            )}
          </>
        )}
        {session.step === 2 && (
          <Story lesson={lesson} mode={mode} session={session} store={store} />
        )}
        {session.step === 3 && (
          <>
            <Markdown mode={mode} text={lesson.blocks.mission!} />
            <Activity
              id={lesson.id}
              mode={mode}
              state={session.activity}
              onChange={(activity) => store.patch(lesson.id, { activity })}
            />
          </>
        )}
        {session.step === 4 && (
          <>
            <h3>
              <Text mode={mode} text={lesson.explanationPrompt} />
            </h3>
            <label className="geo-writing">
              <span>
                {words(mode, '我的发现与证据', 'My discovery and evidence')}
              </span>
              <textarea
                rows={5}
                maxLength={3000}
                placeholder={words(
                  mode,
                  '我观察到……，这说明……；还不能确定的是……',
                  'I observe …, which suggests …; I am still unsure about …',
                )}
                value={session.note}
                onChange={(e) =>
                  store.patch(lesson.id, { note: e.target.value })
                }
              />
            </label>
            <label className="geo-check">
              <input
                type="checkbox"
                checked={session.oral}
                onChange={(e) =>
                  store.patch(lesson.id, { oral: e.target.checked })
                }
              />
              <Text
                mode={mode}
                text={t(
                  '我已指着图口头解释给家长听，也可以不打字。',
                  'I pointed to the diagram and explained it aloud to a parent; typing is optional.',
                )}
              />
            </label>
            <aside className="geo-notice">
              <Text
                mode={mode}
                text={t(
                  '家长可以追问：“你的证据是什么？换一个地方还会这样吗？”自己的解释不会被机器自动评分。',
                  'A parent can ask: “What is your evidence? Would this hold in another place?” Your explanation is not scored automatically.',
                )}
              />
            </aside>
            <div className="geo-terms">
              {lesson.terms.map((term) => (
                <article key={term.name.en}>
                  <h4>
                    <Text mode={mode} text={term.name} />
                  </h4>
                  <p>
                    <Text mode={mode} text={term.meaning} />
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
        {session.step === 5 && (
          <>
            <div className="geo-row">
              <p>
                {words(
                  mode,
                  '先解释，再选择；最后一题换到新情境。',
                  'Explain before choosing; the last question uses a new situation.',
                )}
              </p>
              <span>
                {recallIndex + 1} / {questions.length}
              </span>
            </div>
            <RecallQuestion
              key={questions[recallIndex]!.id}
              question={questions[recallIndex]!}
              mode={mode}
              answer={session.answers[questions[recallIndex]!.id]}
              onAnswer={(i) =>
                store.patch(lesson.id, {
                  answers: {
                    ...session.answers,
                    [questions[recallIndex]!.id]: i,
                  },
                })
              }
            />
            <div className="geo-story-navigation">
              <button
                className="geo-button secondary"
                disabled={recallIndex === 0}
                onClick={() => setRecallIndex((i) => i - 1)}
              >
                {words(mode, '上一题', 'Previous')}
              </button>
              <div className="geo-question-dots">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    aria-label={`${words(mode, '回顾题', 'Recall question')} ${i + 1}`}
                    aria-current={i === recallIndex ? 'true' : undefined}
                    onClick={() => setRecallIndex(i)}
                  >
                    {session.answers[q.id] === undefined ? i + 1 : '✓'}
                  </button>
                ))}
              </div>
              <button
                className="geo-button secondary"
                disabled={recallIndex === questions.length - 1}
                onClick={() => setRecallIndex((i) => i + 1)}
              >
                {words(mode, '下一题', 'Next')} →
              </button>
            </div>
          </>
        )}
        {session.step === 6 && (
          <>
            <Markdown mode={mode} text={lesson.blocks.door!} />
            <h3>
              {words(
                mode,
                '这一课，我能做到哪一步？',
                'Where am I with this lesson?',
              )}
            </h3>
            <p className="geo-caption">
              {words(
                mode,
                '这是你和家长的自评，可以修改；不是自动考试评级。',
                'This is your own reflection with a parent, which you can change; it is not an automatic grade.',
              )}
            </p>
            <div className="geo-choices">
              {(
                [
                  ['explored', '已探索', 'Explored'],
                  ['explain', '能解释', 'Can explain'],
                  ['transfer', '能迁移', 'Can apply elsewhere'],
                ] as const
              ).map(([level, zh, en]) => (
                <button
                  key={level}
                  aria-pressed={session.level === level}
                  onClick={() => store.patch(lesson.id, { level })}
                >
                  {words(mode, zh, en)}
                </button>
              ))}
            </div>
            {!ready && (
              <div className="geo-notice">
                <p>
                  {words(
                    mode,
                    '留下这几条学习证据，就能记录本课：',
                    'Gather these learning records to finish:',
                  )}
                </p>
                <div className="geo-choices">
                  {[
                    [
                      session.prediction !== null,
                      1,
                      '观察猜想',
                      'A first guess',
                    ],
                    [missionDone, 3, '动手任务', 'The mission'],
                    [
                      hasExplanation,
                      4,
                      '文字或口头解释',
                      'Written or spoken explanation',
                    ],
                    [answered, 5, '三道回顾题', 'Three recall questions'],
                  ]
                    .filter(([done]) => !done)
                    .map(([, step, zh, en]) => (
                      <button
                        key={String(step)}
                        onClick={() => setStep(Number(step))}
                      >
                        {words(mode, String(zh), String(en))} ↗
                      </button>
                    ))}
                </div>
              </div>
            )}
            <button
              className="geo-button"
              disabled={!ready}
              onClick={() => {
                store.update((p) => finishSession(p, lesson.id));
                setFinished(true);
              }}
            >
              {words(mode, '记录本课探索', 'Record this exploration')} ✓
            </button>
            {finished && (
              <div className="geo-feedback success" role="status">
                ✓{' '}
                {store.error
                  ? words(
                      mode,
                      '本课已记录在当前会话，请导出手帐。',
                      'Recorded in this session. Please export your notebook.',
                    )
                  : words(
                      mode,
                      '本课已保存到此浏览器，7 天后可回访。',
                      'Saved in this browser; revisit in seven days.',
                    )}
              </div>
            )}
            <div className="geo-next-links">
              {next ? (
                <Link
                  className="geo-button secondary"
                  to={`/geography/lesson/${next.id}`}
                >
                  {words(mode, '探索下一课', 'Explore next')} →
                </Link>
              ) : (
                <Link className="geo-button secondary" to="/geography/notebook">
                  {words(
                    mode,
                    '查看发现与家庭反馈',
                    'View discoveries and family feedback',
                  )}{' '}
                  →
                </Link>
              )}
            </div>
          </>
        )}
      </section>
      <div className="geo-lesson-footer">
        <button
          className="geo-button secondary"
          disabled={session.step === 0}
          onClick={() => setStep(session.step - 1)}
        >
          ← {words(mode, '上一环节', 'Previous step')}
        </button>
        <span className="geo-caption">
          {words(
            mode,
            '猜错没关系，证据让解释更清楚。',
            'Guesses can change. Evidence makes explanations clearer.',
          )}
        </span>
        {session.step < 6 && (
          <button
            className="geo-button"
            disabled={!canContinue}
            onClick={() => setStep(session.step + 1)}
          >
            {words(mode, '下一环节', 'Next step')} →
          </button>
        )}
      </div>
      <details className="geo-parent">
        <summary>
          {words(
            mode,
            '家长指引与纸笔替代',
            'Parent guide & paper alternative',
          )}
        </summary>
        <Markdown mode={mode} text={lesson.blocks.parent!} />
      </details>
      <details className="geo-sources">
        <summary>
          {words(mode, '资料、图片来源与许可', 'Sources, images & reuse')}
        </summary>
        <p className="geo-caption">
          {words(
            mode,
            '课文由 Study 编写；来源用于事实与素材核对，不表示机构审阅或背书。',
            'Lesson text is authored by Study. Sources support fact and asset checks; institutions have not reviewed or endorsed the lessons.',
          )}
        </p>
        {lesson.sources.map((s) => (
          <article key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title} ↗
            </a>
            <p>
              <Text mode={mode} text={s.note} />
            </p>
          </article>
        ))}
        {assets
          .filter((a) => lesson.assetIds.includes(a.id))
          .map((a) => (
            <article key={a.id}>
              <strong>
                <Text mode={mode} text={t(a.title_zh, a.title_en)} />
              </strong>
              <p>
                {a.credit_text} · {a.data_year ?? 'v5.1.2'}
              </p>
              <p>{a.license}</p>
              {a.source_page_url.startsWith('https:') && (
                <a href={a.source_page_url} target="_blank" rel="noreferrer">
                  {words(mode, '素材来源', 'Asset source')} ↗
                </a>
              )}
              {a.license_url && (
                <a href={a.license_url} target="_blank" rel="noreferrer">
                  {' '}
                  · {words(mode, '使用条款', 'Reuse terms')} ↗
                </a>
              )}
              <small>
                {words(mode, '核对日期', 'Verified')}: {a.verified_on}
              </small>
            </article>
          ))}
      </details>
    </>
  );
}
