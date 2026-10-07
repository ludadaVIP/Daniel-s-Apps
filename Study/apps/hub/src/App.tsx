import { lazy, Suspense, useEffect } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import type { LanguageMode, SubjectId } from '@study/shared';
import { LanguageSwitcher, useLanguageMode } from '@study/ui';
import { subjects, type Subject } from './subjects';

const ChemistryPage = lazy(() => import('./ChemistryPage'));
const PhysicsPage = lazy(() => import('./PhysicsPage'));

function subjectIcon(id: SubjectId) {
  if (id === 'physics') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M2 20c5-12 9-12 14 0s9 12 14 0"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M2 26h28"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".6"
        />
      </svg>
    );
  }
  if (id === 'chemistry') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="3" fill="currentColor" />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          transform="rotate(120 16 16)"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M5 27C6 10 16 3 29 3c0 13-7 23-24 24Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M6 26 23 10M14 19l-1-8M18 15l8 1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function words(mode: LanguageMode, zh: string, en: string) {
  return mode === 'en' ? en : zh;
}

function Header({
  mode,
  setMode,
}: {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
}) {
  return (
    <header className="study-header">
      <Link to="/" className="study-title" aria-label="Study home">
        Study
      </Link>
      <div className="study-actions">
        <LanguageSwitcher
          mode={mode}
          onChange={setMode}
          className="study-language"
        />
        <span className="study-count">
          3 {mode === 'en' ? 'SUBJECTS' : '学科'}
        </span>
      </div>
    </header>
  );
}

function SubjectCard({
  subject,
  mode,
}: {
  subject: Subject;
  mode: LanguageMode;
}) {
  return (
    <Link to={subject.path} className={`study-card study-card-${subject.id}`}>
      <div className="study-card-top">
        <span className="study-card-icon">{subjectIcon(subject.id)}</span>
        <span className="study-card-kind">{subject.name.en}</span>
      </div>
      <div className="study-card-content">
        <h2>{words(mode, subject.name.zh, subject.name.en)}</h2>
        <p>{words(mode, subject.phrase.zh, subject.phrase.en)}</p>
        <span className="study-card-status">
          {subject.available
            ? words(mode, '学习路径已开放', 'Learning path open')
            : words(mode, '即将开始', 'Coming later')}
        </span>
      </div>
      <span className="study-card-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

function Hub() {
  const [mode, setMode] = useLanguageMode();
  useEffect(() => {
    document.title = 'Study · 科学学习';
  }, []);
  return (
    <div className="study-hub">
      <Header mode={mode} setMode={setMode} />
      <main
        className="study-grid"
        aria-label={words(mode, '选择学科', 'Choose a subject')}
      >
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} mode={mode} />
        ))}
      </main>
      <footer className="study-footer">
        {words(mode, '物理 · 化学 · 生物', 'Physics · Chemistry · Biology')}
      </footer>
    </div>
  );
}

function ComingSoon({ subject }: { subject: Subject }) {
  const [mode, setMode] = useLanguageMode();
  useEffect(() => {
    document.title = `${subject.name.en} · Study`;
  }, [subject]);
  return (
    <div className="study-hub">
      <Header mode={mode} setMode={setMode} />
      <main className="study-preview">
        <Link to="/" className="study-back">
          ← {words(mode, '全部学科', 'All subjects')}
        </Link>
        <div className={`study-preview-icon study-card-${subject.id}`}>
          {subjectIcon(subject.id)}
        </div>
        <p className="study-preview-kind">{subject.name.en}</p>
        <h1>{words(mode, subject.name.zh, subject.name.en)}</h1>
        <p className="study-preview-description">
          {words(mode, subject.phrase.zh, subject.phrase.en)}
        </p>
        <p className="study-preview-status">
          {words(
            mode,
            '课程正在规划中。',
            'This subject path is being planned.',
          )}
        </p>
        <Link to="/chemistry" className="study-preview-link">
          {words(mode, '先看看化学 →', 'Explore chemistry →')}
        </Link>
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route
        path="/chemistry/*"
        element={
          <Suspense
            fallback={<div className="study-loading">Loading Chemistry…</div>}
          >
            <ChemistryPage />
          </Suspense>
        }
      />
      <Route
        path="/physics/*"
        element={
          <Suspense
            fallback={<div className="study-loading">Loading Physics…</div>}
          >
            <PhysicsPage />
          </Suspense>
        }
      />
      <Route path="/biology" element={<ComingSoon subject={subjects[2]!} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
