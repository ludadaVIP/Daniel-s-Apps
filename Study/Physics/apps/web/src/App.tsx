import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { LanguageSwitcher, useLanguageMode } from '@study/ui';
import { ProjectPage, ProjectCard } from './ProjectPage';
import { lessons, stages, units, t, type Lesson } from './content/lessons';
import { B, Icon, LessonArt, Text } from './ui';
import {
  dueLessons,
  freshLesson,
  useProgress,
  type ProgressStore,
} from './progress';
import { LessonPage, QuestionCard } from './LessonPage';
import { LessonLab } from './interactive/Labs';
import { experiments } from './content/experiments';
function OrbitArt({ mode }: { mode: LanguageMode }) {
  return (
    <div
      className="phy-orbit"
      role="img"
      aria-label={
        mode === 'en' ? 'An illustrated orbital playground' : '轨道探索插画'
      }
    >
      <svg viewBox="0 0 430 310" aria-hidden="true">
        <defs>
          <pattern
            id="phy-stars"
            width="29"
            height="29"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#c7b9ea" opacity=".3" />
          </pattern>
          <radialGradient id="phy-planet">
            <stop stopColor="#f4d7a4" />
            <stop offset="1" stopColor="#d8a766" />
          </radialGradient>
        </defs>
        <rect width="430" height="310" fill="url(#phy-stars)" />
        <circle
          cx="212"
          cy="152"
          r="112"
          fill="none"
          stroke="#c9b6ef"
          opacity=".18"
        />
        <circle
          cx="212"
          cy="152"
          r="76"
          fill="none"
          stroke="#c9b6ef"
          opacity=".2"
        />
        <ellipse
          cx="212"
          cy="152"
          rx="174"
          ry="62"
          transform="rotate(-26 212 152)"
          fill="none"
          stroke="#c6b4e9"
          strokeWidth="1.4"
        />
        <ellipse
          cx="212"
          cy="152"
          rx="137"
          ry="93"
          transform="rotate(40 212 152)"
          fill="none"
          stroke="#c6b4e9"
          strokeDasharray="4 7"
          opacity=".65"
        />
        <circle cx="212" cy="152" r="43" fill="url(#phy-planet)" />
        <path
          d="M179 139c12-13 29-16 44-8s21 13 30 6M172 161c16-6 31-3 40 4s20 10 34 10"
          fill="none"
          stroke="#c0945c"
          strokeWidth="5"
          opacity=".3"
        />
        <circle cx="198" cy="132" r="8" fill="#f5e4c4" opacity=".65" />
        <g className="phy-satellite">
          <circle cx="325" cy="55" r="15" fill="#cebfeb" />
          <circle cx="321" cy="50" r="4" fill="#e9dffb" />
        </g>
        <circle cx="98" cy="233" r="8" fill="#dfab8a" />
        <path
          d="M310 245h15m-7-7v15M98 59h12m-6-6v12"
          stroke="#ddd0f3"
          strokeWidth="1.5"
        />
        <path
          d="m289 78 23-5-3 22"
          fill="none"
          stroke="#e8dafa"
          strokeWidth="2"
        />
        <text
          x="310"
          y="148"
          fill="#d0bfe9"
          fontSize="12"
          fontFamily="monospace"
        >
          curiosity → discovery
        </text>
        <path d="M54 204h34" stroke="#bca5dc" />
        <text
          x="28"
          y="194"
          fill="#d0bfe9"
          fontSize="11"
          fontFamily="monospace"
        >
          WHAT IF?
        </text>
      </svg>
      <span className="phy-orbit-caption">
        FIG. 01 — A WORLD OF POSSIBILITIES
      </span>
    </div>
  );
}
function LessonCard({
  index,
  mode,
  store,
}: {
  index: number;
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const l = lessons[index]!;
  const p = store.progress.lessons[l.id];
  return (
    <Link
      to={`/physics/lesson/${l.id}`}
      className={`phy-lesson-card phy-art-${l.kind}`}
    >
      <div className="phy-card-art">
        <span className="phy-card-num">
          {String(index + 1).padStart(2, '0')}
        </span>
        <LessonArt kind={l.kind} />
        <span className="phy-card-status">
          {p?.completedAt ? (
            <>
              <Icon name="check" size={13} />
              <B zh="已完成" en="Complete" mode={mode} />
            </>
          ) : p ? (
            <B zh="学习中" en="In progress" mode={mode} />
          ) : (
            <>
              <Icon name="clock" size={12} />
              {l.minutes} min
            </>
          )}
        </span>
      </div>
      <div className="phy-card-copy">
        <h3>
          <Text value={l.title} mode={mode} />
        </h3>
        <p>
          <Text value={l.subtitle} mode={mode} />
        </p>
        <div className="phy-card-bottom">
          <span>
            <B
              zh={p?.completedAt ? '再探索一次' : p ? '继续学习' : '开始探索'}
              en={
                p?.completedAt
                  ? 'Explore again'
                  : p
                    ? 'Continue'
                    : 'Explore lesson'
              }
              mode={mode}
            />
          </span>
          <Icon name="arrow" size={18} />
        </div>
      </div>
    </Link>
  );
}
function Home({ mode, store }: { mode: LanguageMode; store: ProgressStore }) {
  const completed = lessons.filter(
    (l) => store.progress.lessons[l.id]?.completedAt,
  ).length;
  const next =
    lessons.find((l) => !store.progress.lessons[l.id]?.completedAt) ??
    lessons[0]!;
  const due = dueLessons(store.progress);
  return (
    <div className="phy-page">
      <div className="phy-greeting">
        <div>
          <p className="phy-eyebrow">YOUR EVERYDAY SCIENCE CLUB</p>
          <h1>
            <B
              zh="今天，发现一点不一样。"
              en="A little discovery, every day."
              mode={mode}
            />
          </h1>
        </div>
        <span className="phy-age">
          <span className="phy-live-dot" />
          <B
            zh="从零开始 · 10–15 岁"
            en="Start from zero · Ages 10–15"
            mode={mode}
          />
        </span>
      </div>
      <section className="phy-hero">
        <div className="phy-hero-copy">
          <span className="phy-hero-tag">
            <span /> <B zh="物理探索室" en="THE PHYSICS LAB" mode={mode} />
          </span>
          <h2>
            <B
              zh={'世界很奇妙，\n一起弄明白。'}
              en={'A curious world.\nLet’s figure it out.'}
              mode={mode}
            />
          </h2>
          <p>
            <B
              zh={'从一颗球、一束光开始，动手看懂世界。'}
              en={'A ball. A beam of light. Discover physics hands-on.'}
              mode={mode}
            />
          </p>
          <Link
            className="phy-button phy-button-peach"
            to={`/physics/lesson/${next.id}`}
          >
            <B
              zh={
                completed === lessons.length
                  ? '再探索一次'
                  : store.progress.lessons[next.id]
                    ? '继续我的探索'
                    : completed > 0
                      ? '开始下一场探索'
                      : '开始第一场探索'
              }
              en={
                completed === lessons.length
                  ? 'Explore again'
                  : store.progress.lessons[next.id]
                    ? 'Continue exploring'
                    : completed > 0
                      ? 'Start your next discovery'
                      : 'Start your first discovery'
              }
              mode={mode}
            />
            <Icon name="arrow" />
          </Link>
          <span className="phy-hero-foot">
            <B
              zh="先好奇，再动手，最后真正理解。"
              en="Wonder. Experiment. Understand."
              mode={mode}
            />
          </span>
        </div>
        <OrbitArt mode={mode} />
      </section>
      <div className="phy-dashboard-grid">
        <div className="phy-dashboard-left">
          <div className="phy-section-heading">
            <h2>
              <B zh="你的第一段旅程" en="Your first discoveries" mode={mode} />
            </h2>
            <Link to="/physics/path">
              <B
                zh={`全部 ${lessons.length} 课`}
                en={`All ${lessons.length} lessons`}
                mode={mode}
              />
              <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="phy-home-lessons">
            {[0, 1, 2].map((i) => (
              <LessonCard key={i} index={i} mode={mode} store={store} />
            ))}
          </div>
          <Link to="/physics/lab" className="phy-lab-invite">
            <div className="phy-invite-icon">
              <Icon name="lab" size={27} />
            </div>
            <div>
              <p className="phy-eyebrow">THE WHAT-IF CORNER</p>
              <h3>
                <B
                  zh="如果地面变得更光滑呢？"
                  en="What if the floor were smoother?"
                  mode={mode}
                />
              </h3>
              <p>
                <B
                  zh="改变一个条件，看小球能滚多远。"
                  en="Change one condition. See how far the ball rolls."
                  mode={mode}
                />
              </p>
            </div>
            <span className="phy-round-arrow">
              <Icon name="arrow" />
            </span>
          </Link>
        </div>
        <aside className="phy-dashboard-right">
          <section className="phy-today-card">
            <div className="phy-card-heading">
              <Icon name="sparkle" />
              <span>
                <B zh="今天的小目标" en="Today’s little goal" mode={mode} />
              </span>
              <span className="phy-tag">15 min</span>
            </div>
            <h3>
              <Text value={next.title} mode={mode} />
            </h3>
            <p>
              <Text value={next.subtitle} mode={mode} />
            </p>
            <div className="phy-today-progress">
              <span>
                <B zh="我的发现" en="My discoveries" mode={mode} />
              </span>
              <strong>
                {completed} / {lessons.length}
              </strong>
            </div>
            <div className="phy-progress-bar">
              <i style={{ width: `${(completed / lessons.length) * 100}%` }} />
            </div>
            <Link className="phy-today-link" to={`/physics/lesson/${next.id}`}>
              <B
                zh={completed === lessons.length ? '回顾第一课' : '去看看'}
                en={
                  completed === lessons.length
                    ? 'Revisit lesson one'
                    : 'Let’s explore'
                }
                mode={mode}
              />
              <Icon name="arrow" size={16} />
            </Link>
          </section>
          <Link className="phy-review-card" to="/physics/review">
            <Icon name="review" />
            <div>
              <h3>
                <B zh="让发现留久一点" en="Make discoveries last" mode={mode} />
              </h3>
              <p>
                <B
                  zh={
                    due.length
                      ? `${due.length} 节课等你复习`
                      : '学过的内容，会在这里等你复习。'
                  }
                  en={
                    due.length
                      ? `${due.length} lessons to revisit`
                      : 'Your discoveries will return here for review.'
                  }
                  mode={mode}
                />
              </p>
            </div>
            <Icon name="arrow" size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
function Path({ mode, store }: { mode: LanguageMode; store: ProgressStore }) {
  return (
    <div className="phy-page">
      <div className="phy-page-heading">
        <div>
          <p className="phy-eyebrow">SMALL STEPS, A BIG WORLD</p>
          <h1>
            <B
              zh="从好奇，到看懂世界。"
              en="From curiosity to understanding."
              mode={mode}
            />
          </h1>
          <p className="phy-lead">
            <B
              zh="不用急着学公式。先观察、提问，再一步步建立自己的物理地图。"
              en="No rush to equations. Observe, ask questions, and build your physics map one step at a time."
              mode={mode}
            />
          </p>
        </div>
      </div>
      {stages.map((stage, stageIndex) => {
        const available = lessons.filter((l) => l.stage === stageIndex);
        if (!available.length) return null;
        return (
          <section key={stage.title.en} className="phy-open-stage">
            <div className="phy-path-heading">
              <span className="phy-stage-number">
                {String(stageIndex).padStart(2, '0')}
              </span>
              <div>
                <h2>
                  <Text value={stage.title} mode={mode} />
                </h2>
                <p>
                  <B
                    zh={`已开放 ${available.length} 课 · 后续内容继续建设`}
                    en={`${available.length} ${available.length === 1 ? 'lesson' : 'lessons'} open · More to come`}
                    mode={mode}
                  />
                </p>
              </div>
              <span className="phy-tag">{stage.age}</span>
            </div>
            {Object.entries(units).map(([unit, title]) => {
              const group = available.filter((l) => l.unit === unit);
              if (!group.length) return null;
              return (
                <div key={unit} className="phy-course-unit">
                  <h3 className="phy-unit-title">
                    <Text value={title} mode={mode} />
                    <span>
                      {group.length}{' '}
                      <B
                        zh="课"
                        en={group.length === 1 ? 'lesson' : 'lessons'}
                        mode={mode}
                      />
                    </span>
                  </h3>
                  <div className="phy-path-lessons">
                    {group.map((l) => (
                      <LessonCard
                        key={l.id}
                        index={lessons.indexOf(l)}
                        mode={mode}
                        store={store}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {stageIndex === 0 && <ProjectCard mode={mode} store={store} />}
          </section>
        );
      })}
      <div className="phy-section-heading phy-roadmap-title">
        <h2>
          <B zh="接下来，世界更大。" en="A bigger world ahead." mode={mode} />
        </h2>
        <span>
          <B
            zh="长期课程地图 · 后续开放"
            en="Long-term roadmap · Coming later"
            mode={mode}
          />
        </span>
      </div>
      <p className="phy-soft">
        <B
          zh="先把观察、测量和数据读懂，再走向运动、力、能量与电磁。已有课程可以自由探索，后续按这个顺序逐步展开。"
          en="Build observation, measurement and data skills before motion, forces, energy and electromagnetism. Explore available lessons freely; later content will follow this progression."
          mode={mode}
        />
      </p>
      <div className="phy-roadmap">
        {stages.map(
          (s, i) =>
            !lessons.some((l) => l.stage === i) && (
              <article key={s.title.en}>
                <span className="phy-roadmap-number">
                  {String(i).padStart(2, '0')}
                </span>
                <div>
                  <h3>
                    <Text value={s.title} mode={mode} />
                  </h3>
                  <p>
                    <Text value={s.topics} mode={mode} />
                  </p>
                </div>
                <div className="phy-roadmap-meta">
                  <span>{s.age}</span>
                  <B zh="规划中" en="Planned" mode={mode} />
                </div>
              </article>
            ),
        )}
      </div>
    </div>
  );
}
function Lab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<Lesson['kind']>('friction');
  return (
    <div className="phy-page">
      <p className="phy-eyebrow">CHANGE ONE THING. DISCOVER SOMETHING.</p>
      <div className="phy-page-heading">
        <h1>
          <B zh="你的迷你实验室。" en="Your mini laboratory." mode={mode} />
        </h1>
        <span className="phy-tag">
          <Icon name="lab" />
          <B zh="自由探索" en="Free exploration" mode={mode} />
        </span>
      </div>
      <p className="phy-lead">
        <B
          zh="这里没有考试。先猜结果，再改变条件，看看你的猜想是否成立。"
          en="No test here. Make a prediction, change a condition, and see what happens."
          mode={mode}
        />
      </p>
      <div className="phy-lab-picker">
        <label>
          <B zh="选择一个实验" en="Choose an experiment" mode={mode} />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Lesson['kind'])}
          >
            {experiments.map((e) => (
              <option key={e.id} value={e.id}>
                {mode === 'en'
                  ? e.name.en
                  : mode === 'zh'
                    ? e.name.zh
                    : `${e.name.zh} · ${e.name.en}`}
              </option>
            ))}
          </select>
        </label>
        <span>
          <B
            zh={`${experiments.length} 个探索工作台`}
            en={`${experiments.length} exploration stations`}
            mode={mode}
          />
        </span>
      </div>
      <LessonLab key={kind} kind={kind} mode={mode} />
      <div className="phy-lab-notes">
        <Icon name="book" size={26} />
        <div>
          <h3>
            <B zh="刚刚发现了什么？" en="What did you notice?" mode={mode} />
          </h3>
          <p>
            <B
              zh="把“我看到的”与“我觉得是因为”分开写，像真正的物理学家一样。"
              en="Separate “what I saw” from “why I think it happened”, just like a physicist."
              mode={mode}
            />
          </p>
        </div>
        <Link className="phy-button phy-button-light" to="/physics/notebook">
          <B zh="记一笔" en="Make a note" mode={mode} />
          <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}
function Notebook({
  mode,
  store,
}: {
  mode: LanguageMode;
  store: ProgressStore;
}) {
  const [observation, setObservation] = useState('');
  const [question, setQuestion] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <div className="phy-page">
      <p className="phy-eyebrow">YOUR IDEAS BELONG HERE</p>
      <h1>
        <B zh="我的发现手帐。" en="My discovery notebook." mode={mode} />
      </h1>
      <p className="phy-lead">
        <B
          zh="不需要完美的答案。写下一个观察，留下一个好问题。"
          en="You don’t need a perfect answer. Capture an observation and a good question."
          mode={mode}
        />
      </p>
      <ProjectCard mode={mode} store={store} />
      <form
        className="phy-note-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!observation.trim()) return;
          store.update((old) => ({
            ...old,
            notes: [
              {
                id: crypto.randomUUID(),
                observation: observation.trim(),
                question: question.trim(),
                createdAt: Date.now(),
              },
              ...old.notes,
            ].slice(0, 100),
          }));
          setObservation('');
          setQuestion('');
          setSaved(true);
        }}
      >
        <label>
          <B zh="我观察到了…" en="I noticed…" mode={mode} />
          <textarea
            required
            maxLength={1500}
            value={observation}
            onChange={(e) => {
              setObservation(e.target.value);
              setSaved(false);
            }}
            placeholder={
              mode === 'en'
                ? 'The ball rolled farther on the smooth surface…'
                : '小球在光滑地面上滚得更远…'
            }
          />
        </label>
        <label>
          <B
            zh="我想知道为什么…（可选）"
            en="I wonder why… (optional)"
            mode={mode}
          />
          <textarea
            maxLength={1500}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              mode === 'en'
                ? 'What if we tried a different ball?'
                : '如果换一颗球，结果会一样吗？'
            }
          />
        </label>
        <div>
          <span className="phy-soft">
            <B
              zh="保存在这个浏览器中 · 最多 100 条"
              en="Saved in this browser · Up to 100 notes"
              mode={mode}
            />
          </span>
          <button className="phy-button" disabled={!observation.trim()}>
            <B zh="保存发现" en="Save discovery" mode={mode} />
            <Icon name="check" />
          </button>
        </div>
        {saved && (
          <p className="phy-explored" role="status">
            <B
              zh="发现已记下。继续保持好奇！"
              en="Discovery recorded. Stay curious!"
              mode={mode}
            />
          </p>
        )}
      </form>
      <div className="phy-section-heading">
        <h2>
          <B zh="我的记录" en="My field notes" mode={mode} />
        </h2>
        <span>{store.progress.notes.length}</span>
      </div>
      {!store.progress.notes.length ? (
        <div className="phy-empty">
          <Icon name="book" size={35} />
          <h3>
            <B
              zh="第一张空白页，等着你的发现。"
              en="A blank page awaits your first discovery."
              mode={mode}
            />
          </h3>
          <Link to="/physics/lab">
            <B
              zh="去实验室找一点灵感 →"
              en="Find inspiration in the lab →"
              mode={mode}
            />
          </Link>
        </div>
      ) : (
        <div className="phy-notes">
          {store.progress.notes.map((n) => (
            <article key={n.id}>
              <header>
                <span>
                  {new Date(n.createdAt).toLocaleDateString(
                    mode === 'en' ? 'en-NZ' : 'zh-CN',
                  )}
                </span>
                <button
                  className="phy-text-button"
                  onClick={() =>
                    store.update((old) => ({
                      ...old,
                      notes: old.notes.filter((note) => note.id !== n.id),
                    }))
                  }
                >
                  <B zh="删除" en="Delete" mode={mode} />
                </button>
              </header>
              <p>{n.observation}</p>
              {n.question && <blockquote>{n.question}</blockquote>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Review({ mode, store }: { mode: LanguageMode; store: ProgressStore }) {
  const due = dueLessons(store.progress);
  const [session, setSession] = useState<string[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const ids = session ?? due.map((l) => l.id);
  const active = lessons.filter((l) => ids.includes(l.id));
  return (
    <div className="phy-page">
      <p className="phy-eyebrow">A SECOND LOOK, A DEEPER UNDERSTANDING</p>
      <h1>
        <B
          zh="再遇见你的发现。"
          en="Meet your discoveries again."
          mode={mode}
        />
      </h1>
      <p className="phy-lead">
        <B
          zh="练习中犹豫过的概念，和完成一天后的课程，会来到这里。"
          en="Concepts you missed and lessons completed at least a day ago return here for a second look."
          mode={mode}
        />
      </p>
      {active.length === 0 ? (
        <div className="phy-empty">
          <Icon name="review" size={36} />
          <h2>
            <B
              zh="现在没有待复习的课。"
              en="You’re all caught up."
              mode={mode}
            />
          </h2>
          <p>
            <B
              zh="先完成一场探索；明天再看看，还记得什么。"
              en="Finish a discovery, then come back tomorrow and see what you remember."
              mode={mode}
            />
          </p>
          <Link className="phy-button" to="/physics/path">
            <B zh="去探索" en="Explore lessons" mode={mode} />
            <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        active.map((l) => {
          const p = store.progress.lessons[l.id] ?? freshLesson();
          const qs = [...l.questions, l.exit];
          const indexes = [
            ...new Set([...p.mistakes, String(l.questions.length)]),
          ].map(Number);
          return (
            <section className="phy-review-lesson" key={l.id}>
              <div className="phy-section-heading">
                <h2>
                  <Text value={l.title} mode={mode} />
                </h2>
                <Link to={`/physics/lesson/${l.id}`}>
                  <B zh="回看课程 →" en="Revisit lesson →" mode={mode} />
                </Link>
              </div>
              {indexes.map((i) => (
                <QuestionCard
                  key={i}
                  number="↻"
                  mode={mode}
                  question={qs[i]!}
                  answer={answers[`${l.id}-${i}`]}
                  onAnswer={(v) => {
                    if (!session) setSession(ids);
                    setAnswers((old) => ({ ...old, [`${l.id}-${i}`]: v }));
                  }}
                />
              ))}
              <button
                className="phy-button"
                disabled={indexes.some(
                  (i) => answers[`${l.id}-${i}`] !== qs[i]!.correct,
                )}
                onClick={() => {
                  store.saveLesson(l.id, (old) => ({
                    ...old,
                    mistakes: [],
                    reviewedAt: Date.now(),
                  }));
                  setSession(ids.filter((id) => id !== l.id));
                }}
              >
                <B zh="复习完成" en="Review complete" mode={mode} />
                <Icon name="check" />
              </button>
            </section>
          );
        })
      )}
    </div>
  );
}
export function App() {
  const [mode, setMode] = useLanguageMode();
  const store = useProgress();
  const location = useLocation();
  useEffect(() => {
    document.title = 'Physics Lab · 物理探索室';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  const count = lessons.filter(
    (l) => store.progress.lessons[l.id]?.completedAt,
  ).length;
  const due = dueLessons(store.progress).length;
  const nav = [
    { to: '/physics', icon: 'home', name: t('探索首页', 'Discover') },
    { to: '/physics/path', icon: 'path', name: t('学习路线', 'Learning path') },
    { to: '/physics/lab', icon: 'lab', name: t('互动实验室', 'Mini lab') },
    { to: '/physics/review', icon: 'review', name: t('温故知新', 'Review') },
    { to: '/physics/notebook', icon: 'book', name: t('发现手帐', 'Notebook') },
  ];
  return (
    <div className="phy-app">
      <aside className="phy-sidebar">
        <Link to="/physics" className="phy-brand">
          <span className="phy-brand-symbol">
            p<span>·</span>
          </span>
          <div>
            <strong>Physics Lab</strong>
            <span>物理探索室</span>
          </div>
        </Link>
        <p className="phy-sidebar-label">LET’S EXPLORE</p>
        <nav aria-label={mode === 'en' ? 'Main navigation' : '主导航'}>
          {nav.map((n) => (
            <NavLink
              end={n.to === '/physics'}
              key={n.to}
              to={n.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon name={n.icon} />
              <Text value={n.name} mode={mode} />
              {n.icon === 'review' && due > 0 && (
                <span className="phy-nav-count">{due}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="phy-sidebar-bottom">
          <div className="phy-sidebar-progress">
            <span>
              <B
                zh="一点点，走得很远。"
                en="Small steps go a long way."
                mode={mode}
              />
            </span>
            <strong>
              {count}
              <small> / {lessons.length}</small>
            </strong>
            <div className="phy-progress-bar">
              <i style={{ width: `${(count / lessons.length) * 100}%` }} />
            </div>
          </div>
          <Link className="phy-study-back" to="/">
            <Icon name="globe" size={18} />
            <B zh="返回 Study" en="Back to Study" mode={mode} />
            <span>↗</span>
          </Link>
        </div>
      </aside>
      <div className="phy-main-shell">
        <header className="phy-header">
          <div>
            <span className="phy-header-dot" />
            <B
              zh="观察世界，保持好奇"
              en="Observe the world. Stay curious."
              mode={mode}
            />
          </div>
          <LanguageSwitcher
            mode={mode}
            onChange={setMode}
            className="phy-language"
          />
        </header>
        {!store.storageAvailable && (
          <p className="phy-storage-message" role="status">
            <B
              zh="浏览器存储不可用；当前进度仅保留到关闭页面。"
              en="Browser storage is unavailable; this session’s progress will last until the page closes."
              mode={mode}
            />
          </p>
        )}
        <main className="phy-main">
          <Routes>
            <Route index element={<Home mode={mode} store={store} />} />
            <Route path="path" element={<Path mode={mode} store={store} />} />
            <Route
              path="lesson/:lessonId"
              element={
                <LessonPage key={location.pathname} mode={mode} store={store} />
              }
            />
            <Route
              path="project/detective"
              element={<ProjectPage mode={mode} store={store} />}
            />
            <Route path="lab" element={<Lab mode={mode} />} />
            <Route
              path="notebook"
              element={<Notebook mode={mode} store={store} />}
            />
            <Route
              path="review"
              element={<Review mode={mode} store={store} />}
            />
            <Route path="*" element={<Navigate to="/physics" replace />} />
          </Routes>
        </main>
        <footer className="phy-footer">
          <span>
            PHYSICS LAB <i>/</i> VOLUME 01
          </span>
          <B
            zh="每一个“为什么”，都是新的起点。"
            en="Every “why” is a new beginning."
            mode={mode}
          />
        </footer>
      </div>
    </div>
  );
}
