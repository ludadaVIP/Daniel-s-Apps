import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  allExercises,
  assessments,
  exercises,
  labExercises,
  lessonMarkdown,
  lessons,
  skills,
  weeks,
  words,
} from './content';
import { errorLabels, type Exercise, type Lesson } from './content/schema';
import { lessonOutcome, type Attempt } from './engine';
import {
  newSession,
  STORAGE_KEY,
  useProgress,
  type ProgressStore,
} from './progress';
import {
  AssessmentPage,
  AssessmentLinks,
  GraduationResult,
} from './components/Assessment';
import { Question } from './components/Question';
import { Icon, stopAudio, WordCard } from './components/ui';

function mastered(store: ProgressStore, lesson: Lesson) {
  const s = store.progress.sessions[lesson.id];
  return (
    !!s?.finishedAt &&
    lessonOutcome(
      exercises.filter((q) => q.lessonId === lesson.id),
      s.answers,
    ).mastered
  );
}
function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · 拼音侦探 · Study`;
    stopAudio();
    window.scrollTo(0, 0);
    return stopAudio;
  }, [title]);
}
function DateStamp() {
  return (
    <span className="py-date">
      {new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date())}
    </span>
  );
}
function ToneArt() {
  return (
    <div
      className="py-tone-art"
      aria-label="拼音声调：一声平，二声升，三声先降后升，四声降"
    >
      <div className="py-art-label">
        声音有迹可循 <span>THE SOUND LAB</span>
      </div>
      <div className="py-art-grid">
        {['mā', 'má', 'mǎ', 'mà'].map((p, i) => (
          <div key={p}>
            <svg viewBox="0 0 120 75" fill="none" aria-hidden="true">
              <path
                d="M10 60h100M10 38h100M10 16h100"
                stroke="currentColor"
                strokeDasharray="3 5"
                opacity=".14"
              />
              <path
                d={
                  [
                    'M14 18h92',
                    'M14 58 106 18',
                    'M14 32 54 60 106 15',
                    'M14 15 106 60',
                  ][i]
                }
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <strong>{p}</strong>
            <small>{['平稳', '上扬', '转弯', '落下'][i]}</small>
          </div>
        ))}
      </div>
      <div className="py-art-footer">
        <span>汉字 → 声音 → 拼音 → 键盘</span>
        <Icon name="spark" size={17} />
      </div>
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="py-page-heading">
      <span className="py-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function Home({ store }: { store: ProgressStore }) {
  usePageTitle('任务首页');
  const complete = lessons.filter((l) => mastered(store, l)).length;
  const current =
    lessons.find((l) => l.available && !mastered(store, l)) ??
    lessons[lessons.length - 1]!;
  const due = Object.values(store.progress.cards).filter(
    (c) => Date.parse(c.due) <= Date.now(),
  ).length;
  const recentErrors = [...store.progress.attempts]
    .reverse()
    .filter((a) => !a.correct)
    .slice(0, 12);
  const tags = [
    ...new Set(
      recentErrors
        .map((a) => allExercises.find((q) => q.id === a.questionId)?.errorTag)
        .filter((t) => t !== undefined),
    ),
  ];
  return (
    <>
      <div className="py-topline">
        <span className="py-eyebrow">你的中文，新的一种打开方式</span>
        <DateStamp />
      </div>
      <section className="py-hero">
        <div>
          <div className="py-pill">PINYIN DETECTIVE / 拼音侦探</div>
          <h1>
            你会说的中文，
            <br />
            现在，<em>也会拼。</em>
          </h1>
          <p>
            用你熟悉的声音，解开字母的线索。
            <br />
            从读出一个音节，到用键盘表达自己的想法。
          </p>
          <Link className="py-button" to={`/pinyin/lesson/${current.id}`}>
            {complete === lessons.length
              ? '回顾最后一课'
              : store.progress.sessions[current.id]
                ? '继续我的任务'
                : current.number === 1
                  ? '开启第一个任务'
                  : '开始下一课'}
            <Icon name="arrow" size={18} />
          </Link>
          <span className="py-hero-note">每次约 15–20 分钟 · 按自己的节奏</span>
          <Link className="py-diagnosis-link" to="/pinyin/assessment/A00">
            开始前，先看看已有基础（约 7 分钟） →
          </Link>
        </div>
        <ToneArt />
      </section>
      <section className="py-dashboard-strip" aria-label="学习概况">
        <div>
          <span className="py-small-label">路线进度</span>
          <strong>
            {complete}
            <small> / 24 课</small>
          </strong>
          <div className="py-progress-track">
            <span style={{ width: `${(complete / 24) * 100}%` }} />
          </div>
          <small>全部 24 课已开放</small>
        </div>
        <div>
          <span className="py-small-label">下一条线索</span>
          <strong className="py-next-title">
            {String(current.number).padStart(2, '0')} · {current.title}
          </strong>
          <small>先发现，再练习，最后独立挑战</small>
        </div>
        <Link className="py-review-link" to="/pinyin/review">
          <div className="py-review-icon">
            <Icon name="clock" size={23} />
          </div>
          <div>
            <span className="py-small-label">今日复习</span>
            <strong>{due ? `${due} 条线索待巩固` : '还没有到期的线索'}</strong>
            <small>
              {due
                ? '选最多 5 题，约 3–5 分钟'
                : '学过的线索会在 1、3、7 天后回来'}
            </small>
          </div>
          <Icon name="arrow" />
        </Link>
      </section>
      <section id="roadmap" className="py-roadmap">
        <div className="py-section-heading">
          <div>
            <span className="py-eyebrow">THE LEARNING TRAIL</span>
            <h2>六周，解锁拼音的使用方式</h2>
          </div>
          <span className="py-muted">24 个小任务 · 认读 + 打字</span>
        </div>
        <div className="py-week-grid">
          {weeks.map((week, i) => (
            <article className="py-week py-week-live" key={week.code}>
              <div className="py-week-header">
                <span className="py-week-number">0{i + 1}</span>
                <div>
                  <span className="py-eyebrow">
                    WEEK 0{i + 1} / {week.code}
                  </span>
                  <h3>{week.title}</h3>
                  <p>{week.detail}</p>
                </div>
                <span className="py-week-status">
                  {
                    lessons.filter(
                      (l) => l.week === i + 1 && mastered(store, l),
                    ).length
                  }{' '}
                  / 4 掌握
                </span>
              </div>
              <div className="py-lesson-list">
                {lessons
                  .filter((l) => l.week === i + 1)
                  .map((l) =>
                    l.available ? (
                      <Link to={`/pinyin/lesson/${l.id}`} key={l.id}>
                        <span
                          className={`py-lesson-dot ${mastered(store, l) ? 'done' : ''}`}
                        >
                          {mastered(store, l)
                            ? '✓'
                            : String(l.number).padStart(2, '0')}
                        </span>
                        <span>{l.title}</span>
                        <small>
                          {mastered(store, l)
                            ? '已掌握'
                            : store.progress.sessions[l.id]?.finishedAt
                              ? '再巩固'
                              : store.progress.sessions[l.id]
                                ? '继续'
                                : `${l.minutes} 分钟`}
                        </small>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    ) : (
                      <div key={l.id} className="py-planned-lesson">
                        <span>{String(l.number).padStart(2, '0')}</span>
                        <span>{l.title}</span>
                        <small>未发布</small>
                      </div>
                    ),
                  )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <AssessmentLinks store={store} />
      <section className="py-home-bottom">
        <Link className="py-lab-teaser" to="/pinyin/lab">
          <Icon name="keyboard" size={29} />
          <div>
            <span className="py-eyebrow">KEYBOARD LAB</span>
            <h3>把声音，变成打出来的中文</h3>
            <p>提前体验字母拼写和真实输入法。这里不计课程通关。</p>
          </div>
          <Icon name="arrow" />
        </Link>
        <div className="py-error-teaser">
          <h3>最近需要巩固</h3>
          {tags.length ? (
            <div className="py-tags">
              {tags.map((t) => (
                <span className="py-pill" key={t}>
                  {errorLabels[t]}
                </span>
              ))}
            </div>
          ) : (
            <p>做过练习后，这里会记录你的薄弱线索。</p>
          )}
          <Link to="/pinyin/report">查看学习报告 →</Link>
        </div>
      </section>
    </>
  );
}

const stepNames = ['快速回顾', '发现规律', '跟着练', '独立挑战', '任务收获'];
function LessonPage({
  store,
  parent,
}: {
  store: ProgressStore;
  parent: boolean;
}) {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId && l.available);
  if (!lesson) return <Navigate to="/pinyin" replace />;
  return (
    <LessonView key={lesson.id} lesson={lesson} store={store} parent={parent} />
  );
}
function LessonView({
  lesson,
  store,
  parent,
}: {
  lesson: Lesson;
  store: ProgressStore;
  parent: boolean;
}) {
  usePageTitle(lesson.title);
  const session = store.progress.sessions[lesson.id] ?? newSession();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [session.step, session.card, session.cursor]);
  const [hideHanzi, setHideHanzi] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [slow, setSlow] = useState(false);
  const markdown = lessonMarkdown(lesson.number);
  const cards = markdown.split(/\n(?=## )/).slice(1);
  const cardIndex = Math.min(session.card, cards.length - 1);
  const lessonQuestions = exercises.filter((q) => q.lessonId === lesson.id);
  const phase =
    session.step === 0 ? 'review' : session.step === 2 ? 'guided' : 'challenge';
  const queue = lessonQuestions.filter((q) => q.phase === phase);
  const question = queue[Math.min(session.cursor, queue.length - 1)];
  const outcome = lessonOutcome(lessonQuestions, session.answers);
  const nextLesson = lessons.find(
    (l) => l.number === lesson.number + 1 && l.available,
  );
  const patch = (fields: Partial<typeof session>) =>
    store.patchSession(lesson.id, fields);
  function next() {
    stopAudio();
    if (session.cursor + 1 < queue.length)
      patch({ cursor: session.cursor + 1 });
    else {
      const nextStep = session.step + 1;
      patch({
        step: nextStep,
        cursor: 0,
        ...(nextStep === 4 ? { finishedAt: new Date().toISOString() } : {}),
      });
    }
  }
  function answer(
    correct: boolean,
    response: string,
    source: Attempt['source'],
    durationMs: number,
  ) {
    if (question)
      store.answer(lesson.id, {
        questionId: question.id,
        correct,
        response,
        source,
        durationMs,
        context: 'lesson',
        at: new Date().toISOString(),
      });
  }
  const weak = [
    ...new Set(
      lessonQuestions
        .filter((q) => session.answers[q.id] && !session.answers[q.id]!.correct)
        .flatMap((q) => q.skillIds),
    ),
  ];
  return (
    <>
      <div className="py-breadcrumb">
        <Link to="/pinyin">任务首页</Link>
        <span>/</span>
        <span>
          第 {lesson.week} 周 · 任务 {String(lesson.number).padStart(2, '0')}
        </span>
      </div>
      <div className="py-lesson-heading">
        <PageHeading
          eyebrow={`CASE ${String(lesson.number).padStart(2, '0')} / ${weeks[lesson.week - 1]!.code}`}
          title={lesson.title}
          description={lesson.subtitle}
        />
        <Link className="py-pause" to="/pinyin">
          今天到这里 · 自动保存
        </Link>
      </div>
      <div className="py-steps" aria-label="课程步骤">
        {stepNames.map((name, i) => (
          <div
            className={`${session.step === i ? 'active' : ''} ${session.step > i ? 'past' : ''}`}
            aria-current={session.step === i ? 'step' : undefined}
            key={name}
          >
            <span>{session.step > i ? '✓' : i + 1}</span>
            {name}
          </div>
        ))}
      </div>
      <div className="py-learning-layout">
        <div className="py-learning-main">
          {session.step === 1 ? (
            <div className="py-microcourse">
              <div className="py-card-counter">
                <span className="py-eyebrow">一张卡片，一个发现</span>
                <span>
                  {cardIndex + 1} / {cards.length}
                </span>
              </div>
              <div className="py-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {cards[cardIndex]}
                </ReactMarkdown>
              </div>
              <div className="py-course-actions">
                <button
                  disabled={cardIndex === 0}
                  className="py-button py-secondary"
                  onClick={() => {
                    stopAudio();
                    patch({ card: cardIndex - 1 });
                  }}
                >
                  上一张
                </button>
                <button
                  className="py-button"
                  onClick={() => {
                    stopAudio();
                    if (cardIndex + 1 < cards.length)
                      patch({ card: cardIndex + 1 });
                    else patch({ step: 2, cursor: 0 });
                  }}
                >
                  {cardIndex + 1 < cards.length ? '下一个发现' : '开始跟练'}
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          ) : session.step === 4 ? (
            <div className="py-result">
              <div className="py-result-icon">
                <Icon name={outcome.mastered ? 'check' : 'spark'} size={34} />
              </div>
              <span className="py-eyebrow">MISSION COMPLETE</span>
              <h2>
                {outcome.mastered
                  ? '这组线索，掌握了。'
                  : '完成了任务，留几条线索再练。'}
              </h2>
              <p>
                独立挑战 {outcome.correct} / {outcome.total} · 正确率{' '}
                {outcome.percent}%
              </p>
              <p className="py-muted">
                85%
                以上且没有同一知识点连续错两次，标记已掌握。朗读结果来自学生或家长确认。
              </p>
              {weak.length > 0 && (
                <div className="py-tags">
                  {weak.map((id) => (
                    <span className="py-pill" key={id}>
                      {skills.find((s) => s.id === id)?.label ?? id}
                    </span>
                  ))}
                </div>
              )}
              <div className="py-result-actions">
                {lesson.assessmentId && (
                  <Link
                    className="py-button py-secondary"
                    to={`/pinyin/assessment/${lesson.assessmentId}`}
                  >
                    {
                      assessments.find((a) => a.id === lesson.assessmentId)
                        ?.title
                    }{' '}
                    →
                  </Link>
                )}
                {nextLesson ? (
                  <Link
                    className="py-button"
                    to={`/pinyin/lesson/${nextLesson.id}`}
                  >
                    下一课
                    <Icon name="arrow" />
                  </Link>
                ) : (
                  <Link className="py-button" to="/pinyin">
                    回到任务路线
                    <Icon name="arrow" />
                  </Link>
                )}
                <Link className="py-button py-secondary" to="/pinyin/review">
                  巩固错题
                </Link>
                <button
                  className="py-text-button"
                  onClick={() =>
                    patch({ ...newSession(), finishedAt: undefined })
                  }
                >
                  重新练这一课
                </button>
              </div>
              {!nextLesson && (
                <p className="py-muted">
                  24 课准备已完成。进入综合挑战，分别检验朗读与真实输入能力。
                </p>
              )}
            </div>
          ) : question ? (
            <>
              <div className="py-question-counter">
                <span>
                  {session.step === 0
                    ? lesson.number === 1
                      ? '无压力热身 · 先观察这几张声音名片'
                      : '回顾上次的线索'
                    : session.step === 2
                      ? '跟练时可以参考右侧声音名片'
                      : '独立挑战 · 先自己想，再作答'}
                </span>
                <strong>
                  {session.cursor + 1} / {queue.length}
                </strong>
              </div>
              <div className="py-progress-track">
                <span
                  style={{ width: `${(session.cursor / queue.length) * 100}%` }}
                />
              </div>
              <Question
                key={`${session.step}-${question.id}`}
                question={question}
                result={session.answers[question.id]}
                onAnswer={answer}
                onNext={next}
                nextLabel={
                  session.cursor + 1 === queue.length
                    ? session.step === 3
                      ? '查看任务收获'
                      : '进入下一环节'
                    : '下一条线索'
                }
                parent={parent}
              />
            </>
          ) : null}
        </div>
        <aside className="py-learning-aside">
          <div className="py-side-note">
            <Icon name="book" />
            <h3>{session.step === 3 ? '独立侦查时间' : '你的声音名片'}</h3>
            <p>
              {session.step === 3
                ? '这一轮先自己解码。每题提交后会给你具体解释；朗读题先读，再揭示汉字。'
                : '汉字、拼音、声音是同一条线索。试试逐步隐藏提示。'}
            </p>
          </div>
          {session.step !== 3 && session.step !== 4 && (
            <>
              <div className="py-card-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={hideHanzi}
                    onChange={(e) => setHideHanzi(e.target.checked)}
                  />
                  隐藏汉字
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hidePinyin}
                    onChange={(e) => setHidePinyin(e.target.checked)}
                  />
                  隐藏拼音
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={slow}
                    onChange={(e) => setSlow(e.target.checked)}
                  />
                  慢速播放
                </label>
              </div>
              <div className="py-word-grid">
                {lesson.wordIds.map((id) => (
                  <WordCard
                    key={id}
                    word={words[id]!}
                    hideHanzi={hideHanzi}
                    hidePinyin={hidePinyin}
                    slow={slow}
                  />
                ))}
              </div>
            </>
          )}
          <div className="py-side-reminder">
            <span className="py-eyebrow">记住这个区别</span>
            <p>
              <strong>读：</strong> nǐ hǎo
              <br />
              <strong>敲：</strong> nihao
              <br />
              <strong>选：</strong> 你好
            </p>
            <small>本地普通话合成示范音 · 不用麦克风</small>
          </div>
        </aside>
      </div>
    </>
  );
}

function Practice({
  store,
  parent,
  kind,
}: {
  store: ProgressStore;
  parent: boolean;
  kind: 'review' | 'lab';
}) {
  usePageTitle(kind === 'review' ? '今日复习' : '键盘实验室');
  const id = kind;
  const session = store.progress.sessions[id];
  const due = Object.values(store.progress.cards)
    .filter((c) => Date.parse(c.due) <= Date.now())
    .sort(
      (a, b) =>
        b.wrongStreak - a.wrongStreak || Date.parse(a.due) - Date.parse(b.due),
    )
    .map((c) => c.questionId)
    .filter((qid) => allExercises.some((q) => q.id === qid))
    .slice(0, 5);
  const active =
    session?.ids
      ?.map((qid) => allExercises.find((q) => q.id === qid))
      .filter((q): q is Exercise => !!q) ?? [];
  const start = (ids: string[]) =>
    store.patchSession(id, { ...newSession(), ids, finishedAt: undefined });
  const q = active[session?.cursor ?? 0];
  function answer(
    correct: boolean,
    response: string,
    source: Attempt['source'],
    durationMs: number,
  ) {
    if (q)
      store.answer(id, {
        questionId: q.id,
        correct,
        response,
        source,
        durationMs,
        at: new Date().toISOString(),
        context: kind,
      });
  }
  function next() {
    stopAudio();
    if (session && session.cursor + 1 < active.length)
      store.patchSession(id, { cursor: session.cursor + 1 });
    else store.patchSession(id, { finishedAt: new Date().toISOString() });
  }
  return (
    <>
      <PageHeading
        eyebrow={kind === 'review' ? 'REVISIT THE CLUES' : 'KEYBOARD LAB'}
        title={
          kind === 'review'
            ? '让线索，变成熟悉的本领。'
            : '把你想说的，亲手打出来。'
        }
        description={
          kind === 'review'
            ? '错过的声音优先回来。每次最多五题，复习和课程进度分开记录。'
            : '先试无调字母，再用系统中文拼音输入法选出汉字。实验室不计课程通关。'
        }
      />
      {kind === 'lab' && (
        <div className="py-lab-guide">
          <div>
            <span>01</span>
            <h3>字母练习</h3>
            <p>用英文键盘敲 nihao。这里检查你有没有拼对。</p>
          </div>
          <div>
            <span>02</span>
            <h3>中文输入</h3>
            <p>切换到系统拼音输入法，敲全拼，再选候选词。最终留下「你好」。</p>
          </div>
          <div>
            <span>03</span>
            <h3>安装与切换</h3>
            <p>
              Mac：系统设置 → 键盘 → 文本输入 →
              添加「拼音－简体」。Windows：添加「中文（简体，中国）」，用 Win +
              空格切换。
            </p>
          </div>
        </div>
      )}
      {!session?.ids?.length || session.finishedAt ? (
        <div className="py-empty-panel">
          <Icon name={kind === 'review' ? 'clock' : 'keyboard'} size={38} />
          <h2>
            {session?.finishedAt
              ? '这一轮完成了。'
              : kind === 'review'
                ? due.length
                  ? `${due.length} 条线索等你回来。`
                  : '今天没有到期的线索。'
                : '准备好键盘，开始一个小实验。'}
          </h2>
          {session?.finishedAt && (
            <p>
              本轮{' '}
              {Object.values(session.answers).filter((a) => a.correct).length} /{' '}
              {active.length} 题正确。需要巩固的内容已放回复习队列。
            </p>
          )}
          <p>
            {kind === 'review'
              ? '答对后，按上一次正确日期安排 1、3、7 天的回顾。同一天重复作答不加速升级。'
              : '女 nǚ / 绿 lǜ：支持此规则的全拼输入法通常敲 nv / lv。下方将提供目标词示范。'}
          </p>
          <div className="py-result-actions">
            {kind === 'lab' ? (
              <button
                className="py-button"
                onClick={() => start(labExercises.map((q) => q.id))}
              >
                开始键盘实验
                <Icon name="arrow" />
              </button>
            ) : due.length ? (
              <button className="py-button" onClick={() => start(due)}>
                开始今日复习
                <Icon name="arrow" />
              </button>
            ) : Object.keys(store.progress.cards).length ? (
              <button
                className="py-button py-secondary"
                onClick={() =>
                  start(
                    Object.values(store.progress.cards)
                      .sort((a, b) => Date.parse(a.due) - Date.parse(b.due))
                      .slice(0, 5)
                      .map((c) => c.questionId),
                  )
                }
              >
                提前复习五条线索
              </button>
            ) : (
              <Link className="py-button" to="/pinyin/lesson/L01">
                先开启第一个任务
              </Link>
            )}
            <Link className="py-text-button" to="/pinyin">
              返回路线
            </Link>
          </div>
        </div>
      ) : (
        q && (
          <div className="py-practice-panel">
            <div className="py-question-counter">
              <span>{kind === 'lab' ? '键盘实验' : '今日线索'}</span>
              <strong>
                {(session.cursor ?? 0) + 1} / {active.length}
              </strong>
              <Link to="/pinyin">今天到这里</Link>
            </div>
            {kind === 'lab' && q.wordId && (
              <div className="py-keyboard-hint">
                <span>
                  读：<strong>{words[q.wordId]!.pinyinMarked}</strong>
                </span>
                <span>
                  敲：<code>{words[q.wordId]!.pinyinPlain}</code>
                </span>
                <span>
                  选：<strong>{words[q.wordId]!.hanzi}</strong>
                </span>
              </div>
            )}
            <Question
              key={`${id}-${session.cursor}-${q.id}`}
              question={q}
              result={session.answers[q.id]}
              onAnswer={answer}
              onNext={next}
              nextLabel={
                session.cursor + 1 === active.length
                  ? '完成这一轮'
                  : '下一条线索'
              }
              parent={parent}
            />
          </div>
        )
      )}
    </>
  );
}

function Toolkit() {
  usePageTitle('拼音工具箱');
  const [hideHanzi, setHideHanzi] = useState(false);
  return (
    <>
      <PageHeading
        eyebrow="YOUR FIELD GUIDE"
        title="需要时，回来查一查。"
        description="声音名片、声调路线、完整声母和拼写规则。需要时按知识点返回课程。"
      />
      <div className="py-toolkit-grid">
        <section className="py-toolkit-card">
          <div className="py-section-heading">
            <h2>六个基本韵母</h2>
            <label className="py-toggle">
              <input
                type="checkbox"
                checked={hideHanzi}
                onChange={(e) => setHideHanzi(e.target.checked)}
              />
              隐藏汉字
            </label>
          </div>
          <div className="py-vowels">
            {['a', 'bo', 'e', 'yi', 'wu', 'yu'].map((id) => (
              <div key={id}>
                <strong>{words[id]!.final}</strong>
                <WordCard
                  word={words[id]!}
                  hideHanzi={hideHanzi}
                  hidePinyin={false}
                  slow={false}
                />
              </div>
            ))}
          </div>
          <p className="py-muted">
            示范播放的是对应中文词。波包含声母 b；衣、乌、鱼分别写
            yī、wū、yú，其基本韵母对应 i、u、ü。
          </p>
        </section>
        <ToneArt />
        <section className="py-toolkit-card">
          <h2>21 个声母</h2>
          <div className="py-initials">
            {'b p m f d t n l g k h j q x zh ch sh r z c s'
              .split(' ')
              .map((p) => (
                <span key={p}>{p}</span>
              ))}
          </div>
          <p>b/p、d/t：重点感受是否送气。声母短读，紧接韵母，连成完整音节。</p>
          <Link className="py-text-button" to="/pinyin/lesson/L04">
            到第四课动手拼 →
          </Link>
        </section>
        <section className="py-toolkit-card">
          <h2>阅读与键入，对照着看</h2>
          <table className="py-reference-table">
            <thead>
              <tr>
                <th>汉字</th>
                <th>规范拼音</th>
                <th>常用全拼键入</th>
              </tr>
            </thead>
            <tbody>
              {['nihao', 'nv', 'lv', 'school'].map((id) => (
                <tr key={id}>
                  <td>{words[id]!.hanzi}</td>
                  <td>{words[id]!.pinyinMarked}</td>
                  <td>
                    <code>{words[id]!.pinyinPlain}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="py-muted">
            v 是常见键入约定，规范拼音写 ü。具体以正在使用的输入法为准。
          </p>
          <Link className="py-button py-secondary" to="/pinyin/lab">
            打开键盘实验室
            <Icon name="arrow" size={16} />
          </Link>
        </section>
        <section className="py-toolkit-card">
          <h2>拼写规则速查</h2>
          <div className="py-rule-links">
            {[
              ['L09', '复韵母 ai ei ao ou'],
              ['L10', 'ui iu ie üe er'],
              ['L11', '前鼻韵母 an en in un ün'],
              ['L12', '后鼻韵母 ang eng ing ong'],
              [
                'L13',
                '介音组合 ia/iao/ian/iang/iong/ua/uo/uai/uan/uang/üe/üan',
              ],
              ['L14', '省写、ü 与 v'],
              ['L15', 'y/w、整体认读与隔音符号'],
              ['L16', '标调、轻声与连读'],
            ].map(([id, label]) => (
              <Link key={id} to={`/pinyin/lesson/${id}`}>
                {label} →
              </Link>
            ))}
          </div>
          <p>
            整体认读：zhi chi shi ri zi ci si yi wu yu ye yue yuan yin yun
            ying。
          </p>
        </section>
      </div>
    </>
  );
}

function download(content: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Report({
  store,
  parent,
  setParent,
}: {
  store: ProgressStore;
  parent: boolean;
  setParent: (v: boolean) => void;
}) {
  usePageTitle('学习报告');
  const attempts = store.progress.attempts;
  const skillStats = skills.map((s) => {
    const data = attempts.filter((a) =>
      allExercises.find((q) => q.id === a.questionId)?.skillIds.includes(s.id),
    );
    return {
      ...s,
      total: data.length,
      correct: data.filter((a) => a.correct).length,
    };
  });
  const read = attempts.filter(
    (a) =>
      allExercises.find((q) => q.id === a.questionId)?.type === 'read_aloud',
  );
  const reading = attempts.filter((a) =>
    skills.some(
      (s) =>
        s.dimension === 'reading' &&
        allExercises
          .find((q) => q.id === a.questionId)
          ?.skillIds.includes(s.id),
    ),
  );
  const typing = attempts.filter(
    (a) =>
      allExercises.find((q) => q.id === a.questionId)?.type ===
      'type_hanzi_ime',
  );
  const dimension = (data: Attempt[]) =>
    data.length
      ? `${Math.round((data.filter((a) => a.correct).length / data.length) * 100)}%`
      : '待体验';
  const errors = attempts
    .filter((a) => !a.correct)
    .reduce(
      (counts, a) => {
        const q = allExercises.find((q) => q.id === a.questionId);
        if (q) counts[q.errorTag] = (counts[q.errorTag] ?? 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );
  return (
    <>
      <PageHeading
        eyebrow="PROGRESS, NOT PRESSURE"
        title="看见学会了什么。"
        description="认读和真实中文输入分别记录。结果帮助安排下一次练习，不比较速度。"
      />
      <div className="py-report-summary">
        <div>
          <span className="py-small-label">课程掌握</span>
          <strong>
            {lessons.filter((l) => mastered(store, l)).length}
            <small> / 24</small>
          </strong>
          <p>全部 24 课已开放</p>
        </div>
        <div>
          <span className="py-small-label">认读练习正确率</span>
          <strong>{dimension(reading)}</strong>
          <p>{reading.length} 次回答 · 含自评朗读</p>
        </div>
        <div>
          <span className="py-small-label">真实中文输入正确率</span>
          <strong>{dimension(typing)}</strong>
          <p>{typing.length} 次最终汉字提交</p>
        </div>
      </div>
      <GraduationResult store={store} />
      <AssessmentLinks store={store} />
      <div className="py-report-grid">
        <section className="py-toolkit-card">
          <h2>知识点线索</h2>
          <p className="py-muted">
            统计全部已提交回答，包括复习与实验室；课程通关只看本课独立挑战。
          </p>
          <div className="py-skill-list">
            {skillStats.map((s) => (
              <div key={s.id}>
                <div>
                  <span>{s.label}</span>
                  <small>
                    {s.total ? `${s.correct} / ${s.total}` : '尚未练习'}
                  </small>
                </div>
                <div className="py-progress-track">
                  <span
                    style={{
                      width: `${s.total ? (s.correct / s.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <div>
          <section className="py-toolkit-card">
            <h2>容易漏掉的线索</h2>
            {Object.entries(errors).length ? (
              Object.entries(errors)
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count]) => (
                  <div className="py-error-row" key={tag}>
                    <span>{errorLabels[tag as keyof typeof errorLabels]}</span>
                    <strong>{count} 次</strong>
                  </div>
                ))
            ) : (
              <p className="py-muted">
                暂时没有错题记录。完成练习后，薄弱点会出现在这里。
              </p>
            )}
            <Link className="py-text-button" to="/pinyin/review">
              去巩固线索 →
            </Link>
          </section>
          <section className="py-toolkit-card py-parent">
            <h2>家长观察</h2>
            <label className="py-toggle">
              <input
                type="checkbox"
                checked={parent}
                onChange={(e) => setParent(e.target.checked)}
              />
              开启家长确认朗读
            </label>
            <p className="py-muted">
              开启后，朗读题标记为家长观察。已有结果不会改变；这不是权限锁。
            </p>
            <p className="py-muted">
              朗读共 {read.length} 次：学生自评{' '}
              {read.filter((a) => a.source === 'self').length} 次，家长确认{' '}
              {read.filter((a) => a.source === 'parent').length} 次。
            </p>
            <label htmlFor="py-parent-notes">下次学习的小提醒</label>
            <textarea
              id="py-parent-notes"
              rows={4}
              value={store.progress.parentNotes}
              onChange={(e) => store.setNotes(e.target.value)}
              placeholder="例如：ü 的口型再练一下；不用着急。"
            />
            <div className="py-parent-actions">
              <button
                className="py-button py-secondary"
                onClick={() =>
                  download(
                    JSON.stringify(store.progress, null, 2),
                    'pinyin-progress.json',
                  )
                }
              >
                导出学习记录
              </button>
              {store.error && (
                <button
                  className="py-text-button"
                  onClick={() => {
                    try {
                      download(
                        localStorage.getItem(STORAGE_KEY) ?? '{}',
                        'pinyin-original-record.json',
                      );
                    } catch {
                      /* Storage access is already surfaced in the banner. */
                    }
                  }}
                >
                  导出原始记录
                </button>
              )}
              <button
                className="py-danger-button"
                onClick={() => {
                  if (
                    window.confirm(
                      '清除本浏览器的拼音学习记录和家长备注？建议先导出备份。',
                    )
                  )
                    store.reset();
                }}
              >
                重置拼音记录
              </button>
            </div>
          </section>
        </div>
      </div>
      <div className="py-report-footnote">
        <Icon name="spark" />
        <p>
          证书以最新一轮综合挑战的五项达标结果为准。朗读来自学生自评或家长确认；输入检查最终文字。学习记录只保存在这个浏览器，建议定期导出备份。
        </p>
      </div>
    </>
  );
}

export function App() {
  const store = useProgress();
  const [parent, setParent] = useState(false);
  return (
    <div className="py-app">
      <aside className="py-sidebar">
        <Link className="py-brand" to="/pinyin">
          <span className="py-brand-symbol">pī</span>
          <div>
            <strong>拼音侦探</strong>
            <small>PINYIN DETECTIVE</small>
          </div>
        </Link>
        <span className="py-sidebar-label">你的探索空间</span>
        <nav className="py-nav" aria-label="拼音应用导航">
          <NavLink to="/pinyin" end>
            <Icon name="map" />
            任务首页
          </NavLink>
          <NavLink to="/pinyin/review">
            <Icon name="clock" />
            今日复习
          </NavLink>
          <NavLink to="/pinyin/toolkit">
            <Icon name="book" />
            拼音工具箱
          </NavLink>
          <NavLink to="/pinyin/lab">
            <Icon name="keyboard" />
            键盘实验室
          </NavLink>
          <NavLink to="/pinyin/report">
            <Icon name="chart" />
            学习报告
          </NavLink>
        </nav>
        <div className="py-sidebar-bottom">
          <div className="py-sidebar-motto">
            <span>一步一个发现</span>
            <p>
              读懂声音，
              <br />
              打出你的世界。
            </p>
            <span className="py-motto-line" />
          </div>
          <Link to="/" className="py-study-back">
            <Icon name="home" size={17} />
            返回 Study<span>↗</span>
          </Link>
        </div>
      </aside>
      <div className="py-main-wrap">
        <header className="py-mobile-brand">
          <Link to="/pinyin">拼音侦探</Link>
          <Link to="/">Study ↗</Link>
        </header>
        {store.error && (
          <div className="py-storage-error" role="alert">
            {store.error}
            <Link to="/pinyin/report">打开家长报告 →</Link>
          </div>
        )}
        {parent && (
          <div className="py-parent-banner">
            家长观察已开启 · 朗读由家长确认
            <button onClick={() => setParent(false)}>退出</button>
          </div>
        )}
        <main className="py-main">
          <Routes>
            <Route index element={<Home store={store} />} />
            <Route
              path="lesson/:lessonId"
              element={<LessonPage store={store} parent={parent} />}
            />
            <Route
              path="review"
              element={<Practice kind="review" store={store} parent={parent} />}
            />
            <Route
              path="lab"
              element={<Practice kind="lab" store={store} parent={parent} />}
            />
            <Route
              path="assessment/:assessmentId"
              element={<AssessmentPage store={store} parent={parent} />}
            />
            <Route path="toolkit" element={<Toolkit />} />
            <Route
              path="report"
              element={
                <Report store={store} parent={parent} setParent={setParent} />
              }
            />
            <Route path="*" element={<Navigate to="/pinyin" replace />} />
          </Routes>
        </main>
        <footer className="py-footer">
          <span>STUDY / 拼音侦探</span>
          <span>
            先读懂声音，再用拼音表达。
            <span className="py-local-dot" /> 本地保存
          </span>
        </footer>
      </div>
    </div>
  );
}
