import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AnswerSpec =
  | {
      kind: 'number';
      value: string;
      unit?: 'NZD' | 'cm²';
      formats?: ('decimal' | 'fraction' | 'percent')[];
    }
  | { kind: 'choice'; value: string }
  | { kind: 'explain'; rubric: LocalizedText };
export type Question = {
  id: string;
  stem: LocalizedText;
  answer: AnswerSpec;
  options?: { id: string; text: LocalizedText; feedback: LocalizedText }[];
  hints: LocalizedText[];
  solution: LocalizedText;
  skill: string;
  visual?: { n: number; d: number };
};
export type Lesson = {
  id: string;
  title: LocalizedText;
  objective: LocalizedText;
  prerequisites: string[];
  keywords: LocalizedText[];
  minutes: number;
  lab: 'parts' | 'fractions' | 'line' | 'decimal' | 'money';
  hook: LocalizedText;
  guided: Question;
  questions: Question[];
  exit: Question;
  exitReason: LocalizedText;
  parent: {
    goal: LocalizedText;
    misconception: LocalizedText;
    prompts: LocalizedText[];
    bridge: string;
  };
};
export type Attempt = {
  input: string;
  tries: number;
  hints: number;
  correct: boolean;
  independent: boolean;
  checked?: boolean;
};
export type Session = {
  step: number;
  practiceIndex?: number;
  answers: Record<string, Attempt>;
  explanation: string;
  parentChecked: boolean;
  completedAt?: string;
  nextReview?: string;
  note: string;
};
export type Progress = {
  version: 1;
  sessions: Record<string, Session>;
  diagnostic: Record<
    string,
    { input: string; result: 'correct' | 'help' | 'skipped' }
  >;
  lastLesson?: string;
  preferredLesson?: string;
  reviews: Record<
    string,
    {
      input: string;
      tries: number;
      hints?: number;
      correct?: boolean;
      independent?: boolean;
      checked?: boolean;
      completedAt?: string;
      round?: number;
    }
  >;
};
export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: {},
  diagnostic: {},
  reviews: {},
});
export const newSession = (): Session => ({
  step: 0,
  answers: {},
  explanation: '',
  parentChecked: false,
  note: '',
});
const gcd = (a: bigint, b: bigint): bigint =>
  b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
function rational(raw: string): [bigint, bigint] | null {
  const text = raw.trim().replace(/−/g, '-').replace(/／/g, '/');
  if (text.length > 60) return null;
  if (/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(text)) {
    const [n, d] = text.split('/').map((v) => BigInt(v.trim()));
    if (n === undefined || !d) return null;
    const factor = gcd(n, d);
    return [n / factor, d / factor];
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(text)) return null;
  const percent = text.endsWith('%');
  const clean = text.replace('%', '');
  const decimals = clean.split('.')[1]?.length ?? 0;
  const n = BigInt(clean.replace('.', ''));
  const d = 10n ** BigInt(decimals) * (percent ? 100n : 1n);
  const factor = gcd(n, d);
  return [n / factor, d / factor];
}
export function checkAnswer(input: string, spec: AnswerSpec): boolean | null {
  if (spec.kind === 'explain') return null;
  if (spec.kind === 'choice') return input === spec.value;
  let clean = input.trim();
  if (spec.unit === 'NZD')
    clean = clean
      .replace(/^(?:NZ\$|\$)\s*/i, '')
      .replace(/\s*(?:NZD|dollars?)$/i, '');
  if (spec.unit === 'cm²') clean = clean.replace(/\s*cm(?:²|\^2|2)$/i, '');
  const format = clean.includes('/')
    ? 'fraction'
    : clean.includes('%')
      ? 'percent'
      : 'decimal';
  if (spec.formats && !spec.formats.includes(format)) return false;
  const actual = rational(clean),
    expected = rational(spec.value);
  return (
    !!actual &&
    !!expected &&
    actual[0] * expected[1] === expected[0] * actual[1]
  );
}
export function lessonOutcome(lesson: Lesson, session: Session) {
  const independent = lesson.questions.filter(
    (q) => session.answers[q.id]?.correct && session.answers[q.id]?.independent,
  ).length;
  const exit =
    session.answers[lesson.exit.id]?.correct &&
    session.answers[lesson.exit.id]?.independent;
  return independent >= Math.ceil(lesson.questions.length * 0.8) &&
    exit &&
    session.parentChecked &&
    session.explanation.trim().length > 0
    ? 'ready_to_progress'
    : 'practice_needed';
}
export function diagnosticSummary(questions: Question[], progress: Progress) {
  const answered = questions.filter((q) => progress.diagnostic[q.id]);
  return {
    answered: answered.length,
    independent: answered.filter(
      (q) => progress.diagnostic[q.id]?.result === 'correct',
    ).length,
    skipped: answered.filter(
      (q) => progress.diagnostic[q.id]?.result === 'skipped',
    ).length,
  };
}
export function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const p = value as Progress;
  const record = (v: unknown) =>
    !!v && typeof v === 'object' && !Array.isArray(v);
  return (
    p.version === 1 &&
    record(p.sessions) &&
    record(p.diagnostic) &&
    record(p.reviews) &&
    Object.values(p.sessions).every(
      (s) =>
        record(s) &&
        Number.isInteger(s.step) &&
        s.step >= 0 &&
        s.step <= 5 &&
        (s.practiceIndex === undefined ||
          (Number.isInteger(s.practiceIndex) &&
            s.practiceIndex >= 0 &&
            s.practiceIndex < 5)) &&
        record(s.answers) &&
        typeof s.explanation === 'string' &&
        typeof s.parentChecked === 'boolean' &&
        typeof s.note === 'string' &&
        Object.values(s.answers).every(
          (a) =>
            record(a) &&
            typeof a.input === 'string' &&
            typeof a.correct === 'boolean' &&
            typeof a.independent === 'boolean' &&
            Number.isFinite(a.hints) &&
            Number.isFinite(a.tries),
        ),
    ) &&
    Object.values(p.reviews).every(
      (a) =>
        record(a) &&
        typeof a.input === 'string' &&
        Number.isInteger(a.tries) &&
        a.tries >= 0 &&
        (a.round === undefined ||
          (Number.isInteger(a.round) && a.round >= 0 && a.round <= 100000)),
    ) &&
    Object.values(p.diagnostic).every(
      (a) =>
        record(a) &&
        typeof a.input === 'string' &&
        ['correct', 'help', 'skipped'].includes(a.result),
    )
  );
}
