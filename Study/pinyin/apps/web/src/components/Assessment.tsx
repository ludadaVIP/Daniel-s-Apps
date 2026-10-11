import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { assessments, assessmentExercises } from '../content';
import type { Assessment } from '../content/schema';
import { assessmentOutcome, type Attempt } from '../engine';
import { newSession, type ProgressStore } from '../progress';
import { Question } from './Question';
import { stopAudio } from './ui';

function questionsFor(assessment: Assessment) {
  return assessment.questionIds.map((id) =>
    assessmentExercises.find((q) => q.id === id)!,
  );
}
function outcomeFor(assessment: Assessment, store: ProgressStore) {
  return assessmentOutcome(
    assessment,
    questionsFor(assessment),
    store.progress.sessions[assessment.id]?.answers ?? {},
  );
}
export function AssessmentLinks({ store }: { store: ProgressStore }) {
  return (
    <section className="py-assessments">
      <div className="py-section-heading">
        <div>
          <span className="py-eyebrow">CHECK THE CLUES</span>
          <h2>看看本领，能用起来了吗？</h2>
        </div>
        <span className="py-muted">开始前小侦查 + 每周挑战</span>
      </div>
      <div className="py-assessment-grid">
        {assessments.map((a) => {
          const session = store.progress.sessions[a.id];
          const result = outcomeFor(a, store);
          return (
            <Link key={a.id} to={`/pinyin/assessment/${a.id}`}>
              <span className="py-eyebrow">
                {a.afterLesson
                  ? `第 ${a.afterLesson} 课后`
                  : '从这里了解现有基础'}
              </span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <small>
                {session?.finishedAt
                  ? a.id === 'A00'
                    ? '已记录基础'
                    : result.passed
                      ? '各项达标 ✓'
                      : '有线索待巩固'
                  : session
                    ? '继续挑战 →'
                    : `约 ${a.minutes} 分钟 →`}
              </small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
function AbilityChart({
  assessment,
  store,
}: {
  assessment: Assessment;
  store: ProgressStore;
}) {
  const outcome = outcomeFor(assessment, store);
  return (
    <div className="py-ability-chart">
      {outcome.groups.map((g) => (
        <div key={g.id}>
          <div>
            <strong>{g.label}</strong>
            <span>
              {g.complete
                ? `${g.correct} / ${g.total} · ${Math.round(g.accuracy * 100)}%`
                : '尚未完成'}
            </span>
          </div>
          <div className="py-progress-track">
            <span style={{ width: `${g.accuracy * 100}%` }} />
          </div>
          <small>
            {g.minCorrect !== undefined
              ? `要求独立读对至少 ${g.minCorrect} 项`
              : `要求至少 ${Math.round((g.minAccuracy ?? 0) * 100)}%`}
            {g.complete && ` · ${g.passed ? '已达标' : '继续巩固'}`}
          </small>
        </div>
      ))}
    </div>
  );
}
function Certificate({
  assessment,
  store,
}: {
  assessment: Assessment;
  store: ProgressStore;
}) {
  const [name, setName] = useState('拼音侦探');
  const session = store.progress.sessions[assessment.id]!;
  const result = outcomeFor(assessment, store);
  const date = new Date(session.finishedAt!).toLocaleDateString('zh-CN');
  const sources = Object.values(session.answers).filter(
    (a) => a.source !== 'automatic',
  );
  const source = sources.every((a) => a.source === 'parent')
    ? '朗读由家长确认'
    : '朗读含学生自评';
  function download() {
    const escape = (s: string) =>
      s.replace(
        /[<>&"']/g,
        (c) =>
          ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&apos;',
          })[c]!,
      );
    const rows = result.groups
      .map(
        (g, i) =>
          `<text x="140" y="${450 + i * 54}" font-size="24">${escape(g.label)}：${g.correct}/${g.total} · ${Math.round(g.accuracy * 100)}%</text>`,
      )
      .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#faf6ee"/><rect x="40" y="40" width="1120" height="820" rx="12" fill="none" stroke="#275b4b" stroke-width="3"/><g fill="#203d33" font-family="PingFang SC,Microsoft YaHei,sans-serif"><text x="140" y="150" font-size="20" letter-spacing="4">STUDY / PINYIN DETECTIVE</text><text x="140" y="245" font-size="56">拼音使用能力证书</text><text x="140" y="330" font-size="36">${escape(name.trim().slice(0, 30) || '拼音侦探')}</text><text x="140" y="385" font-size="25">已完成综合挑战，以下五项分别达标：</text>${rows}<text x="140" y="770" font-size="20">${escape(date)} · ${escape(source)} · 输入检查最终汉字与标点</text><text x="140" y="815" font-size="18">课程学习记录 · 用拼音读懂声音，亲手打出你的世界。</text></g></svg>`;
    const url = URL.createObjectURL(
      new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pinyin-certificate.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="py-certificate">
      <span className="py-eyebrow">PINYIN DETECTIVE / 五项分别达标</span>
      <h2>你已经能用拼音，做真实的事了。</h2>
      <p>
        从一个音节，到一段自己输入的中文。继续用它写消息、读故事、分享发现。
      </p>
      <label>
        证书上的名字
        <input
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <p className="py-muted">
        {date} · {source} · 输入检查最终汉字与标点。证书是课程学习记录。
      </p>
      <button className="py-button" onClick={download}>
        下载我的证书（SVG） ↓
      </button>
    </section>
  );
}
export function GraduationResult({ store }: { store: ProgressStore }) {
  const assessment = assessments.find((a) => a.id === 'A06')!;
  const session = store.progress.sessions.A06;
  if (!session?.finishedAt) return null;
  const result = outcomeFor(assessment, store);
  return (
    <section className="py-toolkit-card">
      <h2>我的拼音使用能力图</h2>
      <p>
        分别看音节、词语、短文、输入操作和段落输入。任何一项都不会被其他项目的高分抵消。
      </p>
      <AbilityChart assessment={assessment} store={store} />
      {result.passed && <Certificate assessment={assessment} store={store} />}
    </section>
  );
}
export function AssessmentPage({
  store,
  parent,
}: {
  store: ProgressStore;
  parent: boolean;
}) {
  const { assessmentId } = useParams();
  const assessment = assessments.find((a) => a.id === assessmentId);
  if (!assessment) return <Navigate to="/pinyin" replace />;
  return (
    <AssessmentView
      key={assessment.id}
      assessment={assessment}
      store={store}
      parent={parent}
    />
  );
}
function AssessmentView({
  assessment,
  store,
  parent,
}: {
  assessment: Assessment;
  store: ProgressStore;
  parent: boolean;
}) {
  const session = store.progress.sessions[assessment.id];
  const questions = questionsFor(assessment);
  const q = questions[session?.cursor ?? 0];
  const result = outcomeFor(assessment, store);
  const diagnosis = assessment.id === 'A00';
  useEffect(() => {
    document.title = `${assessment.title} · 拼音侦探 · Study`;
    window.scrollTo(0, 0);
    stopAudio();
    return stopAudio;
  }, [assessment.title, session?.cursor, session?.finishedAt]);
  function answer(
    correct: boolean,
    response: string,
    source: Attempt['source'],
    durationMs: number,
  ) {
    if (q)
      store.answer(assessment.id, {
        questionId: q.id,
        correct,
        response,
        source,
        durationMs,
        context: 'lesson',
        at: new Date().toISOString(),
      });
  }
  function next() {
    stopAudio();
    if (session && session.cursor + 1 < questions.length)
      store.patchSession(assessment.id, { cursor: session.cursor + 1 });
    else
      store.patchSession(assessment.id, {
        finishedAt: new Date().toISOString(),
      });
  }
  function start() {
    store.patchSession(assessment.id, {
      ...newSession(),
      ids: assessment.questionIds,
      finishedAt: undefined,
    });
  }
  return (
    <>
      <div className="py-breadcrumb">
        <Link to="/pinyin">任务首页</Link>
        <span>/</span>
        <span>{assessment.title}</span>
      </div>
      <div className="py-page-heading">
        <span className="py-eyebrow">
          {diagnosis ? 'YOUR STARTING POINT' : 'INDEPENDENT CHALLENGE'}
        </span>
        <h1>{assessment.title}</h1>
        <p>{assessment.description}</p>
      </div>
      {!session?.ids?.length ? (
        <section className="py-empty-panel">
          <h2>{diagnosis ? '看看已经熟悉什么。' : '先独立尝试，再核对。'}</h2>
          <p>
            朗读先只看拼音；读完再揭示汉字、听示范、记录读对的数量。可以回首页休息，重新打开会接着上次的位置。
          </p>
          <p>
            真实输入请切换到系统中文拼音输入法，亲手打出汉字。应用检查最终文字，是否独立使用输入法由学生或家长确认。
          </p>
          <button className="py-button" onClick={start}>
            开始{diagnosis ? '小侦查' : '挑战'} →
          </button>
        </section>
      ) : session.finishedAt ? (
        <section className="py-toolkit-card">
          <span className="py-eyebrow">YOUR DISCOVERIES</span>
          <h2>
            {diagnosis
              ? '起点已记录，开始新的发现。'
              : result.passed
                ? '这一组本领，各项达标了。'
                : '完成挑战，继续巩固这些线索。'}
          </h2>
          {diagnosis ? (
            <p>
              这是现有基础记录，没有通关门槛。从第一课开始，把会说的中文和拼音连接起来。
            </p>
          ) : (
            <AbilityChart assessment={assessment} store={store} />
          )}
          {assessment.id === 'A04' && (
            <p>薄弱音组继续复习，同时可以进入第 17 课体验输入法。</p>
          )}
          {assessment.id === 'A06' && result.passed && (
            <Certificate assessment={assessment} store={store} />
          )}
          <div className="py-result-actions">
            <Link
              className="py-button"
              to={
                diagnosis
                  ? '/pinyin/lesson/L01'
                  : assessment.afterLesson && assessment.afterLesson < 24
                    ? `/pinyin/lesson/L${String(assessment.afterLesson + 1).padStart(2, '0')}`
                    : '/pinyin/report'
              }
            >
              {diagnosis
                ? '开始第一课'
                : assessment.afterLesson && assessment.afterLesson < 24
                  ? '进入下一课'
                  : '查看完整报告'}{' '}
              →
            </Link>
            <Link className="py-button py-secondary" to="/pinyin/review">
              巩固错题
            </Link>
            <button className="py-text-button" onClick={start}>
              重新挑战这一组
            </button>
          </div>
        </section>
      ) : q ? (
        <>
          <div className="py-question-counter">
            <span>
              {diagnosis
                ? '记录现有基础 · 不用着急'
                : '独立挑战 · 不打开课中提示'}
            </span>
            <strong>
              {session.cursor + 1} / {questions.length}
            </strong>
          </div>
          <div className="py-progress-track">
            <span
              style={{ width: `${(session.cursor / questions.length) * 100}%` }}
            />
          </div>
          <Question
            key={q.id}
            question={q}
            result={session.answers[q.id]}
            parent={parent}
            onAnswer={answer}
            onNext={next}
            nextLabel={
              session.cursor + 1 === questions.length
                ? '查看挑战收获'
                : '下一组线索'
            }
          />
          <Link className="py-pause" to="/pinyin">
            今天到这里 · 自动保存
          </Link>
        </>
      ) : null}
    </>
  );
}
