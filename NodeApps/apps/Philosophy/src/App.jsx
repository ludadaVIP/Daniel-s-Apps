import { useEffect, useMemo, useRef, useState } from 'react';
import Markdown from '../../../shared/markdown/Markdown.jsx';
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronRight, CircleHelp, Search } from 'lucide-react';
import { courseProgress, readProgress, restoreProgress, updateArtifact, updateLesson, writeProgress } from './progress.js';

const base = '/philosophy/api';
const routePrefix = '#/app/philosophy';

function routeFromHash() {
  const tail = location.hash.startsWith(`${routePrefix}/`) ? location.hash.slice(routePrefix.length + 1) : '';
  const [page, id] = tail.split('/');
  return { page: page || 'home', id: id ? decodeURIComponent(id) : null };
}

function go(page = 'home', id) {
  location.hash = `${routePrefix}/${page}${id ? `/${encodeURIComponent(id)}` : ''}`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function request(path, signal) {
  const response = await fetch(`${base}${path}`, { signal });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || '内容暂时无法读取。');
  return value;
}

function ProgressLine({ value }) {
  return <div className="ph-progress-track" aria-label={`已完成 ${value}%`}><span style={{ width: `${value}%` }} /></div>;
}

function Status({ lesson, progress }) {
  const state = progress.lessons[lesson.id];
  return <span className={`ph-status ${state?.completedAt ? 'is-done' : ''}`}>{state?.completedAt ? '已完成' : state?.openedAt ? '学习中' : '未开始'}</span>;
}

function LessonRow({ lesson, index, progress, context }) {
  return <button className="ph-lesson-row" type="button" onClick={() => go('lesson', lesson.id)}>
    <span className="ph-lesson-index">{String(index + 1).padStart(2, '0')}</span>
    <span className="ph-lesson-name"><strong>{lesson.title}</strong><small>{context || `${lesson.subtitle} · 建议研习 ${lesson.estimatedMinutes} 分钟起`}</small></span>
    <Status lesson={lesson} progress={progress} />
    <ChevronRight size={19} aria-hidden="true" />
  </button>;
}

function Home({ courses, roadmap, progress, changeProgress }) {
  const importInput = useRef(null);
  const [backupMessage, setBackupMessage] = useState('');
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ ...progress, app: 'nodeapps.philosophy' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `philosophy-learning-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupMessage('学习档案已导出。');
  };
  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('文件超过 10 MB，请检查所选档案。');
      const restored = restoreProgress(JSON.parse(await file.text()), courses);
      if (!writeProgress(restored)) throw new Error('浏览器无法保存导入的档案，请检查储存空间。');
      changeProgress(restored);
      setBackupMessage('学习档案已恢复，原有本机记录已替换。');
    } catch (error) { setBackupMessage(error.message || '档案无法读取。'); }
  };
  const lessons = courses.flatMap((course) => course.lessons);
  const plannedCount = roadmap.flatMap((level) => level.courses).reduce((total, course) => total + course.lessons.length, 0);
  const next = lessons.find((lesson) => lesson.id === progress.lastLessonId && !progress.lessons[lesson.id]?.completedAt)
    || lessons.find((lesson) => !progress.lessons[lesson.id]?.completedAt);
  const nextCourse = courses.find((course) => course.id === next?.courseId);
  const done = lessons.filter((lesson) => progress.lessons[lesson.id]?.completedAt).length;
  return <>
    <section className="ph-hero">
      <div className="ph-hero-copy">
        <p className="ph-eyebrow">一个人的哲学研习室 <span>·</span> 四阶段 / {plannedCount} 课路线图</p>
        <h1>从一个问题，<br /><em>走向更清楚的思想。</em></h1>
        <p className="ph-hero-description">循着课程阅读、提出理由、认真回应反对意见。这里从哲学的基本功开始，慢慢建立自己的判断。</p>
        {next && <button className="ph-primary" type="button" onClick={() => go('lesson', next.id)}>{progress.lastLessonId ? '继续学习' : '开始第一课'} <ArrowRight size={18} /></button>}
      </div>
      <div className="ph-argument-card" aria-label="学习方法：问题、理由、反对意见、再思考">
        <span className="ph-card-kicker">一段思考，如何展开</span>
        <div className="ph-thought-line"><span>问</span><p>什么是公平？</p></div>
        <div className="ph-thought-line"><span>证</span><p>我为什么这样判断？</p></div>
        <div className="ph-thought-line"><span>辩</span><p>最强的反对意见是什么？</p></div>
        <div className="ph-thought-line"><span>修</span><p>我的看法需要怎样改变？</p></div>
        <div className="ph-card-foot">不急于结论，先学会把理由说清楚。</div>
      </div>
    </section>

    <div className="ph-home-grid">
      <section className="ph-current">
        <div className="ph-section-head"><span>接下来</span><span>YOUR NEXT READING</span></div>
        {next ? <button className="ph-current-card" type="button" onClick={() => go('lesson', next.id)}>
          <span className="ph-current-label">{nextCourse?.title} / 第 {next.order} 课</span>
          <strong>{next.title}</strong>
          <span>{next.subtitle}</span>
          <span className="ph-current-action">打开课程 <ArrowRight size={17} /></span>
        </button> : <div className="ph-current-card"><strong>所有课次已标记完成</strong><span>请用阶段作品、外部评阅与修订记录检查真正掌握的程度。</span></div>}
      </section>
      <section className="ph-overview">
        <div className="ph-section-head"><span>学习进度</span><span>THE FULL CURRICULUM</span></div>
        <div className="ph-overview-count"><strong>{done}</strong><span> / {lessons.length} 节课程</span></div>
        <ProgressLine value={lessons.length ? Math.round(done / lessons.length * 100) : 0} />
        <p>25 门课程已全部开放，共 {plannedCount} 节。完成标记仅记录学习，不代表掌握。</p>
        <button className="ph-text-link" type="button" onClick={() => go('curriculum')}>查看课程目录 <ArrowRight size={16} /></button>
        <div className="ph-backup"><span>本机学习档案</span><p>答案和阶段作品保存在此浏览器。定期导出备份；导入会替换当前记录。</p><div><button type="button" onClick={exportBackup}>导出档案</button><button type="button" onClick={() => importInput.current?.click()}>导入档案</button><input ref={importInput} hidden type="file" accept="application/json,.json" onChange={importBackup} /></div>{backupMessage && <small role="status">{backupMessage}</small>}</div>
      </section>
    </div>
    <section className="ph-home-courses">
      <div className="ph-section-head"><span>从这里开始</span><span>FOUNDATIONS</span></div>
      <div className="ph-course-grid">{courses.filter((course) => course.level === 1).map((course) => <CourseCard key={course.id} course={course} progress={progress} />)}</div>
      <button className="ph-text-link ph-all-courses" type="button" onClick={() => go('curriculum')}>浏览全部 25 门课程 <ArrowRight size={16} /></button>
    </section>
  </>;
}

function CourseCard({ course, progress }) {
  const counts = courseProgress(course, progress);
  return <button className="ph-course-card" type="button" onClick={() => go('course', course.id)}>
    <span className="ph-course-card-top"><span>LEVEL {String(course.level).padStart(2, '0')} · COURSE {String(course.order).padStart(2, '0')}</span><ArrowRight size={18} /></span>
    <strong>{course.title}</strong><span className="ph-course-en">{course.titleEn}</span>
    <p>{course.description}</p>
    <span className="ph-course-card-bottom">{counts.completed} / {counts.total} 节已完成 <ProgressLine value={counts.percent} /></span>
  </button>;
}

function RoadmapLessonRow({ planned, published, index, progress }) {
  if (published) return <LessonRow lesson={published} index={index} progress={progress} />;
  return <div className="ph-lesson-row ph-planned-row">
    <span className="ph-lesson-index">{String(index + 1).padStart(2, '0')}</span>
    <span className="ph-lesson-name"><strong>{planned.title}</strong><small>{planned.focus}</small></span>
    <span className="ph-status">待写作</span>
  </div>;
}

function Curriculum({ roadmap, courses, progress }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const published = new Map(courses.flatMap((course) => course.lessons.map((lesson) => [lesson.id, lesson])));
  const matches = roadmap.map((level) => ({ ...level, courses: level.courses.map((course) => ({
    ...course,
    lessons: `${course.title} ${course.titleEn} ${course.description} ${course.competency} ${course.artifact}`.toLocaleLowerCase().includes(normalized)
      ? course.lessons
      : course.lessons.filter((lesson) => `${lesson.title} ${lesson.focus} ${(published.get(lesson.id)?.tags || []).join(' ')}`.toLocaleLowerCase().includes(normalized)),
  })).filter((course) => !normalized || course.lessons.length) })).filter((level) => level.courses.length);
  const plannedCount = roadmap.flatMap((level) => level.courses).reduce((total, course) => total + course.lessons.length, 0);
  const publishedCount = courses.flatMap((course) => course.lessons).length;
  return <section className="ph-page">
    <div className="ph-page-intro"><p className="ph-eyebrow">CURRICULUM / 四阶段路线图</p><h1>先学会推理，<br />再与整个思想史交手。</h1><p>共 {plannedCount} 节课，{publishedCount} 节可阅读。展开课程可看每节课的核心任务，进入课程可记录阶段作品与评阅。</p></div>
    <nav className="ph-level-nav" aria-label="跳转到学习阶段">{roadmap.map((level) => <button key={level.id} type="button" onClick={() => document.getElementById(`ph-level-${level.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>0{level.id}</span>{level.title}</button>)}</nav>
    <label className="ph-search"><Search size={18} /><span className="ph-sr-only">搜索课程或课次</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索课次、主题或关键词" /></label>
    {matches.length ? matches.map((level) => <section className="ph-roadmap-level" id={`ph-level-${level.id}`} key={level.id}>
      <div className="ph-level-head"><span>LEVEL 0{level.id}</span><div><strong>{level.title}</strong><small>{level.titleEn}</small><p>{level.question}</p></div></div>
      <div className="ph-roadmap-grid">{level.courses.map((course) => <details className="ph-roadmap-course" key={`${course.id}-${Boolean(normalized)}`} open={normalized ? true : undefined}>
        <summary><span className="ph-roadmap-course-code">COURSE {String(course.order).padStart(2, '0')}</span><strong>{course.title}</strong><span className="ph-course-en">{course.titleEn}</span><span className="ph-roadmap-course-count">已开放 {course.publishedCount} / {course.lessons.length} 课 <ChevronRight size={17} /></span></summary>
        <div className="ph-roadmap-course-detail"><p>{course.description}</p><p><b>练成什么</b> {course.competency}</p><p><b>阶段作品</b> {course.artifact}</p>
          {course.publishedCount > 0 && <button className="ph-text-link" type="button" onClick={() => go('course', course.id)}>进入课程 <ArrowRight size={16} /></button>}
          <div className="ph-roadmap-lessons">{course.lessons.map((lesson) => <RoadmapLessonRow key={lesson.id} planned={lesson} published={published.get(lesson.id)} index={lesson.order - 1} progress={progress} />)}</div>
        </div>
      </details>)}</div>
    </section>) : <div className="ph-empty">没有找到相关课程。试试更短的关键词。</div>}
  </section>;
}

const rubric = [
  ['text', '文本准确', '原典与研究文献的主张是否准确、可定位'],
  ['concept', '概念精度', '关键术语和论题范围是否清楚且一致'],
  ['argument', '论证力度', '前提是否有依据，推理是否经受反例'],
  ['opponent', '反方处理', '是否回应对手最强而非最弱的版本'],
  ['revision', '回应与修订', '批评是否实际改变论证结构或结论范围'],
  ['sources', '来源可核查', '引文、版本、数据与案例来源能否复核'],
];

function ArtifactReview({ course, artifact, onChange }) {
  const ratings = artifact.ratings || {};
  return <details className="ph-artifact-review">
    <summary><span>阶段作品研修档案</span><span>记录证据、六维自评与读者批评 <ChevronRight size={17} /></span></summary>
    <div className="ph-artifact-body">
      <p className="ph-artifact-intro">目标作品：{course.artifact}。以下内容只保存在本机；自评是修订工具，不能代替独立评阅或证明已掌握。</p>
      <label className="ph-artifact-field">作品位置或版本
        <input value={artifact.reference || ''} onChange={(event) => onChange({ reference: event.target.value })} placeholder="例如：论文标题、文件位置、版本日期" />
      </label>
      <label className="ph-artifact-field">证据笔记
        <textarea value={artifact.evidence || ''} onChange={(event) => onChange({ evidence: event.target.value })} rows={3} placeholder="列出证明、原典段落、论文页码或作品中的关键证据" />
      </label>
      <div className="ph-artifact-rubric"><strong>六维自评</strong><p>0 无证据 · 1 初步陈述 · 2 可重构论证 · 3 回应强反例 · 4 经批评后完成实质修订。每项评分须由上方作品证据支撑。</p>
        {rubric.map(([id, title, hint]) => <label key={id}><span><b>{title}</b><small>{hint}</small></span><select value={ratings[id] ?? ''} onChange={(event) => onChange({ ratings: { ...ratings, [id]: event.target.value } })}><option value="">未评</option>{[0, 1, 2, 3, 4].map((score) => <option key={score} value={score}>{score}</option>)}</select></label>)}
      </div>
      <label className="ph-artifact-field">外部读者意见
        <textarea value={artifact.feedback || ''} onChange={(event) => onChange({ feedback: event.target.value })} rows={3} placeholder="记录读者是谁、何时评阅，以及最有力的批评；若尚无读者，请写明" />
      </label>
      <label className="ph-artifact-field">修订记录
        <textarea value={artifact.revision || ''} onChange={(event) => onChange({ revision: event.target.value })} rows={3} placeholder="旧论题 → 批评 → 新论题；说明改变的代价" />
      </label>
    </div>
  </details>;
}

function Course({ course, roadmapCourse, progress, changeProgress }) {
  if (!course) return <Missing />;
  const counts = courseProgress(course, progress);
  const published = new Map(course.lessons.map((lesson) => [lesson.id, lesson]));
  return <section className="ph-page ph-course-page">
    <button className="ph-back" type="button" onClick={() => go('curriculum')}><ArrowLeft size={16} /> 返回课程目录</button>
    <div className="ph-page-intro"><p className="ph-eyebrow">LEVEL {String(course.level).padStart(2, '0')} / COURSE {String(course.order).padStart(2, '0')}</p><h1>{course.title}</h1><span className="ph-english-title">{course.titleEn}</span><p>{course.description}</p></div>
    <div className="ph-course-summary"><span>{course.lessons.length} 节课程</span><span>课内研习建议 {course.lessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0)} 分钟起，作品另计</span><span>{counts.completed} 节已完成</span></div>
    <ProgressLine value={counts.percent} />
    {roadmapCourse && <div className="ph-course-goal"><p><strong>课程能力</strong>{roadmapCourse.competency}</p><p><strong>阶段作品</strong>{roadmapCourse.artifact}</p></div>}
    {course.body && <section className="ph-course-intro"><div className="ph-section-head"><span>课程导读</span><span>HOW TO STUDY</span></div><div className="ph-prose"><Markdown>{course.body}</Markdown></div></section>}
    {roadmapCourse && <ArtifactReview key={course.id} course={roadmapCourse} artifact={progress.artifacts?.[course.id] || {}} onChange={(patch) => changeProgress((current) => updateArtifact(current, course.id, patch))} />}
    <div className="ph-section-head ph-lesson-heading"><span>课程内容</span><span>LESSONS</span></div>
    <div className="ph-lesson-list">{(roadmapCourse?.lessons || course.lessons).map((lesson, index) => <RoadmapLessonRow key={lesson.id} planned={lesson} published={published.get(lesson.id)} index={index} progress={progress} />)}</div>
  </section>;
}

function Question({ question, answer, onAnswer }) {
  const [revealed, setRevealed] = useState(false);
  return <div className="ph-question">
    <label htmlFor={`ph-answer-${question.id}`}>{question.prompt}</label>
    <textarea id={`ph-answer-${question.id}`} value={answer || ''} onChange={(event) => onAnswer(question.id, event.target.value)} placeholder="先写下自己的思路……" rows={4} />
    <div className="ph-question-actions"><span>输入后自动保存在本机</span><button type="button" onClick={() => setRevealed((value) => !value)}>{revealed ? '收起参考思路' : '查看参考思路'}</button></div>
    {revealed && <div className="ph-guidance"><strong>参考思路</strong><p>{question.guidance}</p></div>}
  </div>;
}

function Lesson({ id, course, progress, changeProgress }) {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!id) return undefined;
    const controller = new AbortController();
    setLesson(null);
    setError('');
    request(`/lessons/${encodeURIComponent(id)}`, controller.signal).then(setLesson).catch((failure) => {
      if (failure.name !== 'AbortError') setError(failure.message);
    });
    return () => controller.abort();
  }, [id]);
  useEffect(() => {
    if (!lesson) return;
    changeProgress((current) => updateLesson(current, lesson.id, { openedAt: current.lessons[lesson.id]?.openedAt || new Date().toISOString(), lastOpenedAt: new Date().toISOString() }));
  }, [lesson?.id]);

  if (!course) return <Missing />;
  if (error) return <div className="ph-message"><h2>这节课暂时无法打开</h2><p>{error}</p><button className="ph-text-link" onClick={() => go('course', course.id)}>返回课程 <ArrowRight size={16} /></button></div>;
  if (!lesson) return <div className="ph-message" role="status">正在打开课次…</div>;

  const currentIndex = course.lessons.findIndex((item) => item.id === id);
  const previous = course.lessons[currentIndex - 1];
  const next = course.lessons[currentIndex + 1];
  const state = progress.lessons[id] || { answers: {} };
  const onAnswer = (questionId, value) => changeProgress((current) => updateLesson(current, id, { answers: { ...current.lessons[id]?.answers, [questionId]: value } }));
  const toggleReview = () => changeProgress((current) => updateLesson(current, id, { review: !current.lessons[id]?.review }));
  const toggleComplete = () => changeProgress((current) => updateLesson(current, id, { completedAt: current.lessons[id]?.completedAt ? null : new Date().toISOString() }));

  return <div className="ph-reader-shell">
    <div className="ph-reader-top"><button className="ph-back" onClick={() => go('course', course.id)}><ArrowLeft size={16} /> {course.title}</button><span>第 {currentIndex + 1} / {course.lessons.length} 课</span></div>
    <article className="ph-reader">
      <header className="ph-reader-header"><p className="ph-eyebrow">{course.title} · LESSON {String(lesson.order).padStart(2, '0')}</p><h1>{lesson.title}</h1><p>{lesson.subtitle}</p><div className="ph-reader-meta"><span>建议研习 {lesson.estimatedMinutes} 分钟起</span><Status lesson={lesson} progress={progress} /></div></header>
      <div className="ph-prose"><Markdown>{lesson.body}</Markdown></div>
      {lesson.questions.length > 0 && <section className="ph-questions"><div className="ph-section-head"><span>把理解写下来</span><span>{lesson.questions.length} QUESTIONS</span></div><p className="ph-questions-intro">先独立作答，再看参考思路。这里没有自动评分。</p>{lesson.questions.map((question) => <Question key={question.id} question={question} answer={state.answers?.[question.id]} onAnswer={onAnswer} />)}</section>}
      <div className="ph-lesson-actions"><button className={`ph-review-button ${state.review ? 'is-active' : ''}`} type="button" onClick={toggleReview}><Bookmark size={17} fill={state.review ? 'currentColor' : 'none'} />{state.review ? '已加入回顾' : '稍后回顾'}</button><button className="ph-primary" type="button" onClick={toggleComplete}>{state.completedAt ? <><Check size={17} /> 已完成 · 撤销</> : <>标记完成 <Check size={17} /></>}</button></div>
    </article>
    <nav className="ph-reader-bottom" aria-label="课次导航"><div>{previous && <button onClick={() => go('lesson', previous.id)}><ArrowLeft size={16} /><span>上一课<strong>{previous.title}</strong></span></button>}</div><div>{next && <button onClick={() => go('lesson', next.id)}><span>下一课<strong>{next.title}</strong></span><ArrowRight size={16} /></button>}</div></nav>
  </div>;
}

function Review({ courses, progress }) {
  const lessons = courses.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson }))).filter(({ lesson }) => progress.lessons[lesson.id]?.review).sort((a, b) => Date.parse(progress.lessons[b.lesson.id]?.lastOpenedAt || progress.lessons[b.lesson.id]?.openedAt || 0) - Date.parse(progress.lessons[a.lesson.id]?.lastOpenedAt || progress.lessons[a.lesson.id]?.openedAt || 0));
  const date = (lesson) => {
    const value = progress.lessons[lesson.id]?.lastOpenedAt || progress.lessons[lesson.id]?.openedAt;
    return value && !Number.isNaN(Date.parse(value)) ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value)) : '日期未记录';
  };
  return <section className="ph-page"><div className="ph-page-intro"><p className="ph-eyebrow">REVIEW / 稍后回顾</p><h1>值得再想一遍的问题。</h1><p>阅读时标记的课次会留在这里，方便以后重新检查自己的答案。</p></div>{lessons.length ? <div className="ph-lesson-list">{lessons.map(({ course, lesson }, index) => <LessonRow key={lesson.id} lesson={lesson} index={index} progress={progress} context={`${course.title} · 上次研习 ${date(lesson)}`} />)}</div> : <div className="ph-empty"><Bookmark size={25} /><strong>还没有需要回顾的课次</strong><p>阅读时点击「稍后回顾」，课次就会出现在这里。</p><button className="ph-text-link" onClick={() => go('curriculum')}>浏览课程 <ArrowRight size={16} /></button></div>}</section>;
}

function Missing() { return <div className="ph-message"><CircleHelp size={26} /><h2>没有找到这个页面</h2><button className="ph-text-link" onClick={() => go('curriculum')}>查看课程目录 <ArrowRight size={16} /></button></div>; }

export default function Philosophy() {
  const [route, setRoute] = useState(routeFromHash);
  const [curriculum, setCurriculum] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(readProgress);
  const [storageError, setStorageError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const sync = () => setRoute(routeFromHash());
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    request('/curriculum', controller.signal).then(setCurriculum).catch((failure) => {
      if (failure.name !== 'AbortError') setError(failure.message);
    });
    return () => controller.abort();
  }, [reload]);
  useEffect(() => { if (!writeProgress(progress)) setStorageError(true); }, [progress]);

  const courses = curriculum?.courses || [];
  const roadmap = curriculum?.roadmap || [];
  const currentCourse = useMemo(() => courses.find((course) => course.id === (route.page === 'course' ? route.id : courses.find((item) => item.lessons.some((lesson) => lesson.id === route.id))?.id)), [courses, route]);
  const currentRoadmapCourse = roadmap.flatMap((level) => level.courses).find((course) => course.id === currentCourse?.id);

  return <div className="ph-app">
    <header className="ph-topbar"><button className="ph-brand" type="button" onClick={() => go()} aria-label="Philosophy 首页"><span className="ph-brand-mark">Φ</span><span><strong>Philosophy</strong><small>哲学研习室</small></span></button><nav aria-label="Philosophy 导航"><button className={route.page === 'home' ? 'is-current' : ''} onClick={() => go()}>首页</button><button className={route.page === 'curriculum' || route.page === 'course' || route.page === 'lesson' ? 'is-current' : ''} onClick={() => go('curriculum')}>课程</button><button className={route.page === 'review' ? 'is-current' : ''} onClick={() => go('review')}>回顾</button></nav><span className="ph-topbar-label">READ · REASON · REVISE</span></header>
    {storageError && <p className="ph-storage-error" role="alert">浏览器无法保存本机学习记录，请检查浏览器储存设置。</p>}
    <main className="ph-main">
      {error ? <div className="ph-message"><h2>课程暂时无法读取</h2><p>{error}</p><button className="ph-primary" onClick={() => setReload((value) => value + 1)}>重试 <ArrowRight size={16} /></button></div>
        : !curriculum ? <div className="ph-message" role="status">正在整理课程…</div>
          : route.page === 'home' ? <Home courses={courses} roadmap={roadmap} progress={progress} changeProgress={setProgress} />
            : route.page === 'curriculum' ? <Curriculum roadmap={roadmap} courses={courses} progress={progress} />
              : route.page === 'course' ? <Course course={currentCourse} roadmapCourse={currentRoadmapCourse} progress={progress} changeProgress={setProgress} />
                : route.page === 'lesson' ? <Lesson id={route.id} course={currentCourse} progress={progress} changeProgress={setProgress} />
                  : route.page === 'review' ? <Review courses={courses} progress={progress} /> : <Missing />}
    </main>
    <footer className="ph-footer"><span>Philosophy · 独立思考，从一课开始。</span><span>个人学习 · 本机记录</span></footer>
  </div>;
}
