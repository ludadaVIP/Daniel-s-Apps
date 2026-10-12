import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { LanguageSwitcher, StudyHeader, useLanguageMode } from '@study/ui';
import type { LanguageMode } from '@study/shared';
import { lessons, questions, section, t, type Question } from './content';
import curriculum from '../../../curriculum/index.json';
import { Diagram, Explore, Sprout } from './Explore';
import {
  newSession,
  outcome,
  reviewQueue,
  useProgress,
  type Store,
} from './progress';
import { Markdown, Text } from './ui';
type PageProps = { store: Store; mode: LanguageMode };
const words = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const stageTitles = [
  t('生命侦探', 'Life Detective'),
  t('细胞与身体', 'Cells & Systems'),
  t('生命的联系', 'Connected Life'),
  t('看见机制', 'How Life Works'),
  t('中学生物核心', 'Biology Core'),
  t('高中生物桥梁', 'Senior Biology Bridge'),
];
function Home({ store, mode }: PageProps) {
  const { progress } = store;
  const completed = lessons.filter(
    (l) => progress.sessions[l.id]?.completedAt,
  ).length;
  const next =
    lessons.find((l) => !progress.sessions[l.id]?.completedAt) ?? lessons[0]!;
  const review = reviewQueue(progress).length;
  return (
    <>
      <div className="bio-page-heading">
        <span className="bio-eyebrow">
          {words(mode, '属于你的生命探索之旅', 'YOUR JOURNEY INTO LIFE')}
        </span>
        <span className="bio-pilot">
          {words(mode, '第一版 · 4 节课', 'FIRST EDITION · 4 LESSONS')}
        </span>
      </div>
      <section className="bio-hero">
        <div className="bio-hero-copy">
          <span className="bio-kicker">BIOLOGY EXPLORER / 01</span>
          <h1>
            <Text
              mode={mode}
              text={t(
                '从一颗种子，\n重新认识生命。',
                'A small seed.\nA whole world of life.',
              )}
            />
          </h1>
          <p>
            <Text
              mode={mode}
              text={t(
                '先好奇，再找证据。用几个小实验，发现生命藏着的大秘密。',
                'Start with curiosity. Follow the evidence. Discover life’s big secrets through small experiments.',
              )}
            />
          </p>
          <Link className="bio-button" to={`/biology/lesson/${next.id}`}>
            <Text
              mode={mode}
              text={
                completed === 4
                  ? t('再探索一次', 'Explore again')
                  : progress.sessions[next.id]
                    ? t('继续我的探索', 'Continue exploring')
                    : lessons.indexOf(next) > 0
                      ? t('开始下一课', 'Start the next lesson')
                      : t('开始第一课', 'Start the first lesson')
              }
            />
            <span>↗</span>
          </Link>
          <div className="bio-hero-meta">
            <span>
              {words(mode, '11–16 岁 · 自主学习', 'AGES 11–16 · AT YOUR PACE')}
            </span>
            <span>
              {words(mode, '每课约 15–18 分钟', '15–18 MIN / LESSON')}
            </span>
          </div>
        </div>
        <div className="bio-hero-art">
          <span className="bio-orbit" />
          <Sprout />
          <span className="bio-art-note top">
            {words(
              mode,
              '一片叶子，一个能量工厂',
              'A leaf. An energy factory.',
            )}
            <i>↘</i>
          </span>
          <span className="bio-art-note bottom">
            {words(mode, '小小的胚，新的开始', 'An embryo. A new beginning.')}
            <i>↗</i>
          </span>
          <span className="bio-art-index">
            FIG. 01 / {words(mode, '生命从这里开始', 'LIFE BEGINS HERE')}
          </span>
        </div>
      </section>
      <section className="bio-path">
        <div className="bio-section-heading">
          <div>
            <span className="bio-eyebrow">
              UNIT 01 / {words(mode, '生命是什么？', 'WHAT IS LIFE?')}
            </span>
            <h2>
              <Text
                mode={mode}
                text={t(
                  '四个谜题，开启生命侦探模式。',
                  'Four mysteries. Become a life detective.',
                )}
              />
            </h2>
          </div>
          <div className="bio-progress-label">
            {completed}
            <span> / 4 {words(mode, '已探索', 'explored')}</span>
            <div className="bio-progress-track">
              <i style={{ width: `${completed * 25}%` }} />
            </div>
          </div>
        </div>
        <div className="bio-lessons">
          {lessons.map((lesson, i) => {
            const s = progress.sessions[lesson.id];
            return (
              <Link
                to={`/biology/lesson/${lesson.id}`}
                className={`bio-lesson-card ${s?.completedAt ? 'complete' : ''}`}
                key={lesson.id}
              >
                <div className="bio-card-top">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="bio-card-status">
                    {s?.completedAt
                      ? '✓ ' + words(mode, '已探索', 'Explored')
                      : s
                        ? words(mode, '继续', 'Continue')
                        : words(mode, '可学习', 'Ready')}
                  </span>
                </div>
                <span
                  className={`bio-card-symbol symbol-${i}`}
                  aria-hidden="true"
                >
                  {lesson.icon}
                </span>
                <h3>
                  <Text mode={mode} text={lesson.title} />
                </h3>
                <p>
                  <Text
                    mode={mode}
                    text={
                      [
                        t(
                          '机器人和火焰也会动。',
                          'Robots and flames move too.',
                        ),
                        t('植物怎样回应世界？', 'How do plants respond?'),
                        t(
                          '给种子一个醒来的理由。',
                          'Give a seed a reason to wake.',
                        ),
                        t(
                          '用证据探讨生命的边界。',
                          'Explore life’s boundary with evidence.',
                        ),
                      ][i]!
                    }
                  />
                </p>
                <div className="bio-card-bottom">
                  <span>
                    {lesson.minutes}{' '}
                    {words(mode, '分钟 · 互动探索', 'min · Interactive')}
                  </span>
                  <span>↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <div className="bio-home-bottom">
        <Link to="/biology/notebook" className="bio-mission-card">
          <span className="bio-mission-icon">⌕</span>
          <div>
            <span className="bio-eyebrow">
              {words(mode, '单元小任务', 'UNIT MISSION')}
            </span>
            <h3>
              <Text
                mode={mode}
                text={t(
                  '给一个身边的物体，写一份生命证据。',
                  'Build a case for something nearby.',
                )}
              />
            </h3>
            <p>
              {words(
                mode,
                '我看到了什么？我的解释是什么？',
                'What did I observe? What is my explanation?',
              )}
            </p>
          </div>
          <span>→</span>
        </Link>
        <Link className="bio-review-card" to="/biology/review">
          <span className="bio-eyebrow">
            {words(mode, '轻松回忆一下', 'A LITTLE RECALL')}
          </span>
          <h3>
            {review > 0
              ? words(
                  mode,
                  `${review} 个线索待回顾`,
                  `${review} clues to revisit`,
                )
              : words(mode, '发现会慢慢积累', 'Discoveries take time')}
          </h3>
          <p>
            <Text
              mode={mode}
              text={t(
                '答错没关系。带着提示，再想一次。',
                'Mistakes are clues. Use a hint and think again.',
              )}
            />
          </p>
          <span>→</span>
        </Link>
      </div>
      <details className="bio-roadmap">
        <summary>
          <Text
            mode={mode}
            text={t(
              '接下来，生命的地图会延伸到哪里？',
              'Where does the map of life lead next?',
            )}
          />
          <span>＋</span>
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '六阶段路线覆盖初中核心概念并衔接高中。首版只开放上面4课，其余内容尚在制作；按能力探索，不按年龄锁课。',
              'Six stages cover secondary-school concepts and build towards senior biology. Only the four lessons above are open; later lessons are planned. Explore by ability, without age locks.',
            )}
          />
        </p>
        <div className="bio-stage-list">
          {curriculum.map((stage, i) => (
            <details key={stage.id}>
              <summary>
                <b>{stage.id}</b>
                <Text mode={mode} text={stageTitles[i]!} />
                <small>
                  {words(
                    mode,
                    i === 0 ? '4课可学习' : '尚在制作',
                    i === 0 ? '4 lessons open' : 'Planned',
                  )}
                </small>
              </summary>
              {stage.units.map((unit) => (
                <div className="bio-roadmap-unit" key={unit.id}>
                  <strong>{unit.id}</strong>
                  <ul>
                    {unit.lessons.map((l) => (
                      <li key={l.id}>
                        {l.status === 'available' ? (
                          <Link to={`/biology/lesson/${l.id}`}>
                            <span>{l.id}</span>
                            <Text mode={mode} text={t(l.zh, l.en)} />
                            <b>↗</b>
                          </Link>
                        ) : (
                          <div>
                            <span>{l.id}</span>
                            <Text mode={mode} text={t(l.zh, l.en)} />
                            <small>{words(mode, '规划中', 'Planned')}</small>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </details>
          ))}
        </div>
      </details>
    </>
  );
}
function QuestionCard({
  q,
  store,
  mode,
  review = false,
  onNext,
  nextLabel,
}: PageProps & {
  q: Question;
  review?: boolean;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const saved = store.progress.answers[q.id];
  const [choice, setChoice] = useState<number | undefined>(
    review ? undefined : saved?.choice,
  );
  const [submitted, setSubmitted] = useState(!review && !!saved);
  const correct = choice === q.correct;
  return (
    <div className="bio-question">
      <span className="bio-eyebrow">
        {words(
          mode,
          q.skill === 'vocabulary'
            ? '英语词汇 · 单独记录'
            : q.skill === 'reasoning'
              ? '推理与证据'
              : '理解与运用',
          q.skill === 'vocabulary'
            ? 'VOCABULARY · SEPARATE RESULT'
            : q.skill === 'reasoning'
              ? 'REASONING & EVIDENCE'
              : 'UNDERSTANDING & APPLICATION',
        )}
      </span>
      <h2>
        <Text mode={mode} text={q.prompt} />
      </h2>
      <div className="bio-options">
        {q.options.map((option, i) => (
          <button
            key={option.en}
            disabled={submitted}
            aria-pressed={choice === i}
            className={`${choice === i ? 'selected ' : ''}${submitted && i === q.correct ? 'correct ' : ''}${submitted && choice === i && !correct ? 'incorrect' : ''}`}
            onClick={() => setChoice(i)}
          >
            <span className="bio-option-letter">
              {String.fromCharCode(65 + i)}
            </span>
            <Text mode={mode} text={option} />
            {submitted && i === q.correct && <b>✓</b>}
          </button>
        ))}
      </div>
      {!submitted ? (
        <button
          className="bio-button"
          disabled={choice === undefined}
          onClick={() => {
            if (choice !== undefined) {
              store.answer(q.id, choice);
              setSubmitted(true);
            }
          }}
        >
          {words(mode, '查看解释', 'Check & explain')} →
        </button>
      ) : (
        <>
          <div
            className={`bio-feedback ${correct ? '' : 'retry'}`}
            role="status"
          >
            <strong>
              {words(
                mode,
                correct ? '这条证据找对了。' : '找到一个值得再想的地方。',
                correct ? 'That evidence fits.' : 'A clue worth another look.',
              )}
            </strong>
            <p>
              <Text mode={mode} text={q.feedback} />
            </p>
            {!correct && (
              <p className="bio-hint">
                <Text mode={mode} text={q.revisit} />
              </p>
            )}
          </div>
          <div className="bio-question-actions">
            <button
              className="bio-text-button"
              onClick={() => {
                setSubmitted(false);
                setChoice(undefined);
              }}
            >
              {words(mode, '重新想一次', 'Try again')}
            </button>
            {onNext && (
              <button className="bio-button" onClick={onNext}>
                {nextLabel ?? words(mode, '下一题', 'Next question')} →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
function LessonPage({ store, mode }: PageProps) {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return <Navigate to="/biology" replace />;
  return (
    <LessonBody
      key={lesson.id}
      lessonId={lesson.id}
      store={store}
      mode={mode}
    />
  );
}
function LessonBody({
  lessonId,
  store,
  mode,
}: PageProps & { lessonId: string }) {
  const lesson = lessons.find((l) => l.id === lessonId)!;
  const s = store.progress.sessions[lesson.id] ?? newSession();
  const [questionIndex, setQuestionIndex] = useState(
    Math.max(
      0,
      lesson.questions.findIndex((q) => !store.progress.answers[q.id]),
    ),
  );
  const [explorePanel, setExplorePanel] = useState(0);
  const result = outcome(lesson, store.progress);
  const next = lessons[lessons.indexOf(lesson) + 1];
  function move(step: number) {
    store.session(lesson.id, { step });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const steps = [
    t('先猜', 'Predict'),
    t('发现', 'Explore'),
    t('挑战', 'Challenge'),
    t('带走', 'Reflect'),
  ];
  return (
    <>
      <Link className="bio-back" to="/biology">
        ← {words(mode, '回到探索地图', 'Back to the map')}
      </Link>
      <div className="bio-lesson-heading">
        <span className="bio-eyebrow">
          S01 / U01 / {lesson.id} · {lesson.minutes}{' '}
          {words(mode, '分钟', 'MIN')}
        </span>
        <h1>
          <Text mode={mode} text={lesson.title} />
        </h1>
      </div>
      <ol
        className="bio-steps"
        aria-label={words(mode, '学习步骤', 'Lesson steps')}
      >
        {steps.map((step, i) => (
          <li
            key={step.en}
            className={s.step === i ? 'active' : s.step > i ? 'done' : ''}
            aria-current={s.step === i ? 'step' : undefined}
          >
            <span>{s.step > i ? '✓' : i + 1}</span>
            <Text mode={mode} text={step} />
          </li>
        ))}
      </ol>
      {s.step === 0 && (
        <section className="bio-predict">
          <div className="bio-predict-art">
            {lesson.id === 'L004' ? (
              <svg
                viewBox="0 0 420 300"
                role="img"
                aria-label={words(
                  mode,
                  '病毒结构示意，非按比例绘制',
                  'Virus schematic, not to scale',
                )}
              >
                <path
                  d="M210 49 299 99 299 201 210 251 121 201 121 99Z"
                  fill="#e3cbd5"
                  stroke="#9f6476"
                  strokeWidth="3"
                />
                <path
                  d="m132 108 78 44 77-44m-155 84 78-40 77 40M210 62v175"
                  stroke="#c396a6"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M180 113q53 11 12 42t40 24"
                  stroke="#9b7698"
                  strokeWidth="6"
                  fill="none"
                />
              </svg>
            ) : (
              <Sprout step={lesson.id === 'L003' ? 0 : 2} />
            )}
            <span className="bio-question-mark">?</span>
          </div>
          <div>
            <span className="bio-eyebrow">
              {words(mode, '今天的谜题', 'TODAY’S MYSTERY')}
            </span>
            <h2>
              <Text mode={mode} text={lesson.hook} />
            </h2>
            <p className="bio-muted">
              <Text
                mode={mode}
                text={t(
                  '先选一个想法。猜错也没关系，预测不会评分。',
                  'Choose an initial idea. Predictions are not scored.',
                )}
              />
            </p>
            <div className="bio-options">
              {lesson.prediction.map((option, i) => (
                <button
                  key={option.en}
                  aria-pressed={s.prediction === i}
                  className={s.prediction === i ? 'selected' : ''}
                  onClick={() => store.session(lesson.id, { prediction: i })}
                >
                  <span className="bio-option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Text mode={mode} text={option} />
                </button>
              ))}
            </div>
            <button
              className="bio-button"
              disabled={s.prediction === undefined}
              onClick={() => move(1)}
            >
              {words(mode, '带着猜想，找证据', 'Follow the evidence')} →
            </button>
          </div>
        </section>
      )}
      {s.step === 1 && (
        <>
          <div
            className="study-stage-picker"
            role="group"
            aria-label={words(mode, '探索内容', 'Exploration panels')}
          >
            {[
              t('操作模型', 'Interactive model'),
              t('理解线索', 'Explanation'),
              t('小词典', 'Glossary'),
            ].map((panel, i) => (
              <button
                key={panel.en}
                aria-pressed={explorePanel === i}
                onClick={() => setExplorePanel(i)}
              >
                {words(mode, panel.zh, panel.en)}
              </button>
            ))}
          </div>
          <div hidden={explorePanel !== 0}>
            <div className="bio-objectives">
              <span className="bio-eyebrow">
                {words(mode, '这次你会发现', 'YOU WILL DISCOVER')}
              </span>
              {lesson.objectives.map((o) => (
                <p key={o.en}>
                  ✦ <Text mode={mode} text={o} />
                </p>
              ))}
            </div>
            <div className="bio-explore-grid">
              <Diagram id={lesson.id} mode={mode} />
              <Explore
                id={lesson.id}
                mode={mode}
                onExplore={() => {
                  if (!s.explored) store.session(lesson.id, { explored: true });
                }}
              />
            </div>
          </div>
          <div className="bio-explanation" hidden={explorePanel !== 1}>
            <span className="bio-eyebrow">
              {words(mode, '把线索连起来', 'CONNECT THE CLUES')}
            </span>
            <Markdown mode={mode} text={section(lesson.id, 'Explain')} />
            <div className="bio-misconception">
              <strong>
                {words(mode, '容易搞错的地方', 'A COMMON MISCONCEPTION')}
              </strong>
              <Markdown
                mode={mode}
                text={section(lesson.id, 'Misconception')}
              />
            </div>
            <details>
              <summary>
                {words(
                  mode,
                  '再想深一点 · 适合想多探索的你',
                  'Go deeper · A bridge to advanced ideas',
                )}
              </summary>
              <Markdown mode={mode} text={section(lesson.id, 'Depth')} />
            </details>
          </div>
          <div className="bio-terms" hidden={explorePanel !== 2}>
            {lesson.terms.map((term) => (
              <div key={term.word.en}>
                <strong>
                  <Text mode={mode} text={term.word} />
                </strong>
                <p>
                  <Text mode={mode} text={term.meaning} />
                </p>
              </div>
            ))}
          </div>
          <div className="bio-bottom-actions">
            <button className="bio-text-button" onClick={() => move(0)}>
              ← {words(mode, '我的预测', 'My prediction')}
            </button>
            <div>
              {!s.explored && (
                <p className="bio-muted">
                  {words(
                    mode,
                    '先点选证据或操作一次模型，再来挑战。',
                    'Inspect evidence or operate the model before the challenge.',
                  )}
                </p>
              )}
              <button
                className="bio-button"
                disabled={!s.explored}
                onClick={() => move(2)}
              >
                {words(mode, '试试我发现了什么', 'Test my discoveries')} →
              </button>
            </div>
          </div>
        </>
      )}
      {s.step === 2 && (
        <div className="bio-challenge-wrap">
          <div className="bio-quiz-count">
            <span>
              {questionIndex + 1} / {lesson.questions.length}
            </span>
            <div>
              {lesson.questions.map((q, i) => (
                <button
                  key={q.id}
                  className={i === questionIndex ? 'active' : ''}
                  aria-label={`${words(mode, '第', 'Question ')}${i + 1}`}
                  aria-current={i === questionIndex ? 'true' : undefined}
                  onClick={() => setQuestionIndex(i)}
                >
                  {store.progress.answers[q.id] ? '✓' : i + 1}
                </button>
              ))}
            </div>
          </div>
          <QuestionCard
            key={lesson.questions[questionIndex]!.id}
            q={lesson.questions[questionIndex]!}
            mode={mode}
            store={store}
            onNext={() =>
              questionIndex < 3
                ? setQuestionIndex((v) => v + 1)
                : result.answered
                  ? move(3)
                  : setQuestionIndex(
                      Math.max(
                        0,
                        lesson.questions.findIndex(
                          (q) => !store.progress.answers[q.id],
                        ),
                      ),
                    )
            }
            nextLabel={
              questionIndex === 3
                ? words(
                    mode,
                    result.answered ? '看看我的发现' : '完成剩余问题',
                    result.answered
                      ? 'See my discoveries'
                      : 'Finish remaining questions',
                  )
                : undefined
            }
          />
          <button className="bio-text-button" onClick={() => move(1)}>
            ← {words(mode, '回看图解和模型', 'Revisit diagrams and model')}
          </button>
          {result.answered && (
            <button className="bio-text-button" onClick={() => move(3)}>
              {words(mode, '查看本课发现', 'See lesson discoveries')} →
            </button>
          )}
        </div>
      )}
      {s.step === 3 && (
        <section className="bio-finish">
          <span className="bio-finish-symbol">✧</span>
          <span className="bio-eyebrow">
            {words(
              mode,
              '每一次解释，都是一个发现',
              'EVERY EXPLANATION IS A DISCOVERY',
            )}
          </span>
          <h2>
            <Text
              mode={mode}
              text={
                result.mastered
                  ? t('你已经把线索连起来了。', 'You have connected the clues.')
                  : t(
                      '你发现了值得继续探索的线索。',
                      'You have found clues to explore further.',
                    )
              }
            />
          </h2>
          <div className="bio-outcomes">
            {(
              [
                ['concept', t('生物理解', 'Biology understanding')],
                ['reasoning', t('推理与证据', 'Reasoning & evidence')],
                ['vocabulary', t('英语术语', 'English vocabulary')],
              ] as const
            ).map(([key, title]) => (
              <div key={key}>
                <strong>
                  {result[key].correct}
                  <small> / {result[key].total}</small>
                </strong>
                <Text mode={mode} text={title} />
              </div>
            ))}
          </div>
          <p className="bio-muted">
            <Text
              mode={mode}
              text={t(
                '英语单独记录。你可以继续下一课，也可以带着提示复习。',
                'English is recorded separately. Continue or revisit a concept with a hint.',
              )}
            />
          </p>
          <label className="bio-note-label">
            <Text mode={mode} text={t('我今天发现……', 'Today I discovered…')} />
            <textarea
              maxLength={2000}
              value={s.note}
              placeholder={words(
                mode,
                '用自己的话写一句，中文或英文都可以。',
                'Write one sentence in your own words.',
              )}
              onChange={(e) =>
                store.session(lesson.id, { note: e.target.value })
              }
            />
          </label>
          <div className="bio-real-world">
            <span className="bio-eyebrow">
              {words(mode, '把好奇心带到生活里', 'TAKE YOUR CURIOSITY OUTSIDE')}
            </span>
            <p>
              <Text mode={mode} text={lesson.mission} />
            </p>
          </div>
          {!s.completedAt ? (
            <button
              className="bio-button"
              disabled={
                !result.answered || s.prediction === undefined || !s.explored
              }
              onClick={() =>
                store.session(lesson.id, { completedAt: Date.now() })
              }
            >
              {words(
                mode,
                '完成本课，保存发现',
                'Finish lesson & save discoveries',
              )}{' '}
              ✓
            </button>
          ) : (
            <div className="bio-finish-links">
              <span className="bio-saved-message">
                ✓ {words(mode, '本课已完成', 'Lesson complete')}
              </span>
              <Link
                className="bio-button"
                to={next ? `/biology/lesson/${next.id}` : '/biology/notebook'}
              >
                {words(
                  mode,
                  next ? '下一课' : '去做单元小任务',
                  next ? 'Next lesson' : 'Try the unit mission',
                )}{' '}
                →
              </Link>
            </div>
          )}
          <div className="bio-finish-links">
            <button className="bio-text-button" onClick={() => move(2)}>
              ← {words(mode, '再想想挑战题', 'Revisit the challenges')}
            </button>
            <Link to="/biology/review">
              {words(mode, '回顾线索', 'Revisit clues')} →
            </Link>
          </div>
        </section>
      )}
      <div className="bio-source-note">
        <details>
          <summary>
            {words(
              mode,
              '课程依据与图示来源',
              'Content references & illustration sources',
            )}
          </summary>
          <p>
            {words(
              mode,
              '讲解、题目与SVG为本项目原创，参考资料用于核对概念。首版内容为试学稿，待实际试用反馈。',
              'Explanations, questions and SVG diagrams are original. References support concept checks. These are pilot lessons awaiting learner feedback.',
            )}
          </p>
          <a
            href={
              lesson.id === 'L004'
                ? 'https://openstax.org/books/biology-2e/pages/21-1-viral-evolution-morphology-and-classification'
                : lesson.id === 'L003'
                  ? 'https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization'
                  : 'https://openstax.org/books/biology-2e/pages/1-2-themes-and-concepts-of-biology'
            }
            target="_blank"
            rel="noreferrer"
          >
            OpenStax Biology 2e ↗
          </a>
        </details>
      </div>
    </>
  );
}
function Review({ store, mode }: PageProps) {
  const [ids] = useState(() =>
    reviewQueue(store.progress)
      .slice(0, 4)
      .map((q) => q.id),
  );
  const [index, setIndex] = useState(0);
  const q = questions.find((q) => q.id === ids[index]);
  return (
    <>
      <div className="bio-section-heading">
        <div>
          <span className="bio-eyebrow">
            RECALL / {words(mode, '轻松回顾', 'A LITTLE RECALL')}
          </span>
          <h1>
            <Text
              mode={mode}
              text={t(
                '让发现留得更久一点。',
                'Make discoveries last a little longer.',
              )}
            />
          </h1>
        </div>
      </div>
      <p className="bio-muted">
        <Text
          mode={mode}
          text={t(
            '每轮最多4题，错题优先；完成后的第1、7、30天，再回忆几条熟悉的线索。不需要打卡。',
            'Up to four questions per round, with mistakes first. Clues return about 1, 7 and 30 days after completion. No daily streak required.',
          )}
        />
      </p>
      {q ? (
        <div className="bio-challenge-wrap">
          <p className="bio-eyebrow">
            {index + 1} / {ids.length}
          </p>
          <QuestionCard
            key={q.id}
            q={q}
            store={store}
            mode={mode}
            review
            onNext={() => setIndex((i) => i + 1)}
            nextLabel={words(mode, '继续回顾', 'Continue review')}
          />
          <Link
            className="bio-text-button"
            to={`/biology/lesson/${q.id.split('-')[0]}`}
          >
            {words(mode, '回到这节课查看线索', 'Revisit this lesson')} ↗
          </Link>
        </div>
      ) : (
        <div className="bio-empty">
          <span>✧</span>
          <h2>
            <Text
              mode={mode}
              text={
                ids.length
                  ? t('这一轮回顾完成了。', 'This recall round is complete.')
                  : t(
                      '暂时没有更多线索要回顾。',
                      'No more clues to revisit right now.',
                    )
              }
            />
          </h2>
          <p>
            <Text
              mode={mode}
              text={t(
                '可以继续探索，或在笔记里写下一个新的“为什么”。',
                'Continue exploring or add a new “why” to your notebook.',
              )}
            />
          </p>
          {reviewQueue(store.progress).length > 0 && (
            <p>
              <Text
                mode={mode}
                text={t(
                  '还有一些线索留给下一轮。下次进入复习会再次出现。',
                  'Some clues remain for another round. They will return when you reopen review.',
                )}
              />
            </p>
          )}
          <Link className="bio-button" to="/biology">
            {words(mode, '回到探索地图', 'Back to the map')} →
          </Link>
        </div>
      )}
    </>
  );
}
function Notebook({ store, mode }: PageProps) {
  const m = store.progress.mission;
  const complete =
    lessons.every((l) => store.progress.sessions[l.id]?.completedAt) &&
    !!m.savedAt;
  return (
    <>
      <span className="bio-eyebrow">
        FIELD NOTES / {words(mode, '生命侦探笔记', 'LIFE DETECTIVE NOTES')}
      </span>
      <h1>
        <Text
          mode={mode}
          text={t(
            '把“我觉得”，变成“我发现”。',
            'Turn “I think” into “I found”.',
          )}
        />
      </h1>
      <section className="bio-mission-form">
        <div>
          <span className="bio-eyebrow">
            UNIT 01 / {words(mode, '探究任务', 'INVESTIGATION')}
          </span>
          <h2>
            <Text
              mode={mode}
              text={t(
                '它是活的吗？拿出你的证据。',
                'Is it alive? Build your evidence.',
              )}
            />
          </h2>
          <p>
            <Text
              mode={mode}
              text={t(
                '在家里选一个物体。把观察和解释分开：我认为……，因为我观察到……，这说明……。可以记录“不确定”，并说还需要什么证据。',
                'Choose something at home. Separate observation and explanation: I claim …, I observed …, this suggests … . You can be unsure and explain what evidence is missing.',
              )}
            />
          </p>
          <span className="bio-unit-status">
            {words(
              mode,
              complete
                ? '✓ 单元探索已完成'
                : '4课 + 一份证据笔记，完成单元探索',
              complete
                ? '✓ Unit explored'
                : '4 lessons + one evidence note to complete the unit',
            )}
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            store.update((p) => ({
              ...p,
              mission: { ...p.mission, savedAt: Date.now() },
            }));
          }}
        >
          {(
            [
              [
                'object',
                t(
                  '① 我的主张：哪个物体？活的、不活的，还是不确定？',
                  '① Claim: what object? Living, non-living, or unsure?',
                ),
              ],
              [
                'evidence',
                t(
                  '② 我的证据：我实际观察到了什么？',
                  '② Evidence: what did I actually observe?',
                ),
              ],
              [
                'reasoning',
                t(
                  '③ 我的推理：证据如何支持判断？还缺什么？',
                  '③ Reasoning: how does it support the claim? What is missing?',
                ),
              ],
            ] as const
          ).map(([key, text]) => (
            <label key={key}>
              <Text mode={mode} text={text} />
              <textarea
                required
                maxLength={2000}
                value={m[key]}
                onChange={(e) =>
                  store.update((p) => ({
                    ...p,
                    mission: {
                      ...p.mission,
                      [key]: e.target.value,
                      savedAt: undefined,
                    },
                  }))
                }
              />
            </label>
          ))}
          <button
            className="bio-button"
            disabled={
              ![m.object, m.evidence, m.reasoning].every((s) => s.trim())
            }
          >
            {words(mode, '保存这份生命证据', 'Save my evidence')} ✓
          </button>
          {m.savedAt && (
            <span className="bio-saved-message" role="status">
              ✓ {words(mode, '证据笔记已记录', 'Evidence note recorded')}
            </span>
          )}
        </form>
      </section>
      <h2>
        <Text
          mode={mode}
          text={t('我的发现收藏', 'My collection of discoveries')}
        />
      </h2>
      <div className="bio-notes">
        {lessons.map((lesson) => {
          const s = store.progress.sessions[lesson.id];
          return (
            <article key={lesson.id}>
              <span className="bio-eyebrow">
                {lesson.id} /{' '}
                {s?.completedAt
                  ? '✓'
                  : s
                    ? words(mode, '探索中', 'EXPLORING')
                    : words(mode, '尚未探索', 'NOT STARTED')}
              </span>
              <h3>
                <Text mode={mode} text={lesson.title} />
              </h3>
              <p className={s?.note ? '' : 'bio-muted'}>
                {s?.note ||
                  words(
                    mode,
                    '还没有记录。学完后，用一句话留下你的发现。',
                    'No note yet. Record a discovery after this lesson.',
                  )}
              </p>
              <Link to={`/biology/lesson/${lesson.id}`}>
                {words(mode, '打开课程', 'Open lesson')} ↗
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
export function App() {
  const [mode, setMode] = useLanguageMode();
  const store = useProgress();
  const location = useLocation();
  const review = reviewQueue(store.progress).length;
  useEffect(() => {
    document.title = `${words(mode, '生命探索', 'Biology Explorer')} · Study`;
    window.scrollTo(0, 0);
  }, [location.pathname, mode]);
  return (
    <div className="bio-app study-learning-app">
      <div className="bio-main-wrap">
        <StudyHeader
          brand={
            <Link to="/biology">
              <span className="bio-brand-icon">❧</span>
              <div>
                <strong>{words(mode, '生命探索', 'Biology Explorer')}</strong>
                <small>Biology · Study</small>
              </div>
            </Link>
          }
          navigation={
            <>
              <NavLink to="/biology" end>
                {words(mode, '探索首页', 'Discover')}
              </NavLink>
              <NavLink to="/biology/review">
                {words(mode, '温故知新', 'Review')}
                {review > 0 && <b>{review}</b>}
              </NavLink>
              <NavLink to="/biology/notebook">
                {words(mode, '发现手帐', 'Notebook')}
              </NavLink>
            </>
          }
          controls={<LanguageSwitcher mode={mode} onChange={setMode} />}
          home={<Link to="/">← Study</Link>}
          label={words(mode, '生物学习导航', 'Biology navigation')}
        />
        {store.error && (
          <div className="bio-storage-error" role="alert">
            {store.error}
          </div>
        )}
        <main className="bio-main">
          <Routes>
            <Route index element={<Home store={store} mode={mode} />} />
            <Route
              path="lesson/:lessonId"
              element={<LessonPage store={store} mode={mode} />}
            />
            <Route
              path="review"
              element={<Review store={store} mode={mode} />}
            />
            <Route
              path="notebook"
              element={<Notebook store={store} mode={mode} />}
            />
            <Route path="*" element={<Navigate to="/biology" replace />} />
          </Routes>
        </main>
        <footer className="bio-footer">
          <span>BIOLOGY EXPLORER · STUDY</span>
          <span className={store.error ? 'bio-unsaved' : ''}>
            ●{' '}
            {words(
              mode,
              store.error
                ? '当前记录未保存'
                : store.saved
                  ? '已在此浏览器保存'
                  : '记录保存在此浏览器',
              store.error
                ? 'Unsaved session'
                : store.saved
                  ? 'Saved in this browser'
                  : 'Progress stays in this browser',
            )}
          </span>
        </footer>
      </div>
    </div>
  );
}
