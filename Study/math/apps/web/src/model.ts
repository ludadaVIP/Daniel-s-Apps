import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AnswerSpec =
  | {
      kind: 'number';
      value: string;
      unit?: 'NZD' | 'cm²' | 'm' | 'L' | 'km';
      formats?: ('decimal' | 'fraction' | 'percent')[];
      fractionRule?: 'unit' | 'improper' | 'mixed' | 'simplest';
      requiredDenominator?: number;
    }
  | { kind: 'choice'; value: string }
  | { kind: 'explain'; rubric: LocalizedText };
export type NumberDiagram =
  | {
      kind: 'operation-counters';
      a: number;
      b: number;
      mode: 'join' | 'take' | 'compare';
    }
  | { kind: 'operation-array'; groups: number; perGroup: number }
  | {
      kind: 'operation-sharing';
      total: number;
      divisor: number;
      mode: 'share' | 'group';
    }
  | { kind: 'place'; value: number; places?: number }
  | { kind: 'fraction-bars'; values: { n: number; d: number }[] }
  | { kind: 'decimal-place'; milli: number }
  | {
      kind: 'axis';
      start: number;
      end: number;
      divisions: number;
      point: number;
      label?: string;
    };
export type Question = {
  id: string;
  stem: LocalizedText;
  lessonId?: string;
  type?:
    | 'numeric'
    | 'single_choice'
    | 'visual_select'
    | 'error_spotting'
    | 'fraction'
    | 'word_problem'
    | 'true_false_reason';
  difficulty?: 'foundation' | 'developing' | 'transfer';
  solutionSteps?: LocalizedText[];
  answerChecks?: { accepted: string[]; rejected: string[] };
  misconceptionTags?: string[];
  diagram?: NumberDiagram;
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
  lab:
    | 'parts'
    | 'fractions'
    | 'line'
    | 'decimal'
    | 'money'
    | 'number-reader'
    | 'place-value'
    | 'whole-line'
    | 'rounding'
    | 'regroup'
    | 'decimal-place'
    | 'decimal-compare'
    | 'decimal-add'
    | 'decimal-multiply'
    | 'decimal-divide'
    | 'decimal-application'
    | 'fraction-whole'
    | 'fraction-kind'
    | 'fraction-mixed'
    | 'fraction-equivalent'
    | 'fraction-simplify'
    | 'fraction-compare'
    | 'operation-parts'
    | 'operation-array'
    | 'operation-division'
    | 'operation-inverse'
    | 'operation-choose';
  stage?: string;
  unit?: string;
  order?: number;
  skillTags?: string[];
  nzYearHints?: number[];
  cnGradeHints?: number[];
  contentStatus?: 'draft' | 'ready';
  familyChallenge?: LocalizedText;
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
  const mixed = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = BigInt(mixed[1]!),
      n = BigInt(mixed[2]!),
      d = BigInt(mixed[3]!);
    if (!d || n >= d) return null;
    const total = whole * d + n,
      factor = gcd(total, d);
    return [total / factor, d / factor];
  }
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
  if (spec.unit === 'km') clean = clean.replace(/\s*(?:km|kilometres?)$/i, '');
  if (spec.unit === 'm') clean = clean.replace(/\s*(?:m|metres?)$/i, '');
  if (spec.unit === 'L') clean = clean.replace(/\s*(?:l|litres?)$/i, '');
  if (spec.unit === 'cm²') clean = clean.replace(/\s*cm(?:²|\^2|2)$/i, '');
  clean = clean.replace(/−/g, '-').replace(/／/g, '/');
  if (spec.fractionRule || spec.requiredDenominator !== undefined) {
    if (clean.length > 60) return false;
    if (
      spec.requiredDenominator !== undefined &&
      (!Number.isSafeInteger(spec.requiredDenominator) ||
        spec.requiredDenominator < 1)
    )
      return false;
    const fraction = clean.match(/^(\d+)\s*\/\s*(\d+)$/);
    const mixed = clean.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    const whole = /^\d+$/.test(clean);
    const n = fraction ? BigInt(fraction[1]!) : null;
    const d = fraction ? BigInt(fraction[2]!) : null;
    if (
      spec.requiredDenominator !== undefined &&
      (!d || d !== BigInt(spec.requiredDenominator))
    )
      return false;
    if (spec.fractionRule === 'unit' && (n !== 1n || !d)) return false;
    if (spec.fractionRule === 'improper' && (n === null || !d || n < d))
      return false;
    if (
      spec.fractionRule === 'mixed' &&
      !whole &&
      (!mixed ||
        BigInt(mixed[1]!) < 1n ||
        BigInt(mixed[2]!) === 0n ||
        !BigInt(mixed[3]!) ||
        BigInt(mixed[2]!) >= BigInt(mixed[3]!))
    )
      return false;
    if (
      spec.fractionRule === 'simplest' &&
      !whole &&
      (n === null || !d || gcd(n, d) !== 1n)
    )
      return false;
  }
  const format = clean.includes('/')
    ? 'fraction'
    : clean.includes('%')
      ? 'percent'
      : 'decimal';
  if (spec.formats && !spec.formats.includes(format)) return false;
  // Permit correctly grouped thousands; never silently turn a misplaced comma into a different number.
  if (/^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(clean))
    clean = clean.replace(/,/g, '');
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
            s.practiceIndex < 8)) &&
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
