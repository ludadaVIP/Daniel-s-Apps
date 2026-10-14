import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AnswerSpec =
  | {
      kind: 'number';
      value: string;
      unit?:
        | 'NZD'
        | 'dm'
        | 'dm²'
        | 'cm³'
        | 'dm³'
        | 'm³'
        | 'mL'
        | 'cm²'
        | 'm²'
        | 'mm'
        | 'cm'
        | 'm'
        | 'L'
        | 'km'
        | '°'
        | 'people'
        | 'cards'
        | 'bags'
        | 'pencils'
        | 'min'
        | 'sticks';
      formats?: ('decimal' | 'fraction' | 'percent')[];
      fractionRule?: 'unit' | 'improper' | 'mixed' | 'simplest';
      requiredDenominator?: number;
    }
  | { kind: 'choice'; value: string }
  | { kind: 'explain'; rubric: LocalizedText };
export type NumberDiagram =
  | { kind: 'geo-rectangle'; w: number; h: number }
  | { kind: 'geo-triangle'; b: number; h: number; apex: number }
  | { kind: 'geo-parallel'; b: number; h: number; shift: number }
  | { kind: 'geo-trapezoid'; a: number; b: number; h: number; shift: number }
  | { kind: 'geo-prism'; w: number; d: number; h: number; unit?: 'cm' | 'dm' }
  | { kind: 'geo-net'; w: number; d: number; h: number; lid: boolean }
  | {
      kind: 'equation-board';
      equation: {
        kind: 'add' | 'subtract' | 'subtract-from' | 'multiply' | 'divide';
        a: string;
        b: string;
        reversed?: boolean;
      };
      symbol?: 'x' | '□';
    }
  | { kind: 'growing-pattern'; pattern: 'squares' | 'counters'; n: number }
  | {
      kind: 'fraction-operation';
      left: { n: number; d: number };
      right: { n: number; d: number };
      operation: '+' | '−';
    }
  | { kind: 'integer-array'; n: number; rows: number; hideColumns?: boolean }
  | {
      kind: 'integer-common';
      a: number;
      b: number;
      mode: 'factors' | 'multiples';
    }
  | {
      kind: 'problem-bars';
      relation: 'parts' | 'comparison' | 'groups';
      a: number;
      b: number;
      unknown: 'result' | 'component';
      unit: LocalizedText;
    }
  | {
      kind: 'measurement-ruler';
      startMm: number;
      endMm: number;
      unit: 'cm' | 'mm';
    }
  | {
      kind: 'measurement-grid';
      width: number;
      height: number;
      selected: number[];
    }
  | {
      kind: 'measurement-bars';
      values: { label: LocalizedText; count: number }[];
      max: number;
      step: number;
    }
  | { kind: 'calculation-area'; a: number; b: number }
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
    | 'fraction-add-like'
    | 'fraction-subtract-like'
    | 'fraction-add-unlike'
    | 'fraction-subtract-unlike'
    | 'fraction-story'
    | 'equation-box'
    | 'equation-balance'
    | 'equation-pattern'
    | 'equation-one-step'
    | 'equation-story'
    | 'geo-units'
    | 'geo-rectangle'
    | 'geo-triangle'
    | 'geo-parallel-trapezoid'
    | 'geo-volume'
    | 'geo-surface'
    | 'operation-parts'
    | 'operation-array'
    | 'operation-division'
    | 'operation-inverse'
    | 'operation-choose'
    | 'calculation-regroup'
    | 'calculation-split'
    | 'calculation-area'
    | 'calculation-division'
    | 'calculation-estimate'
    | 'measurement-length'
    | 'measurement-perimeter'
    | 'measurement-area'
    | 'measurement-angle'
    | 'measurement-bars'
    | 'problem-information'
    | 'problem-represent'
    | 'problem-two-step'
    | 'problem-relevance'
    | 'problem-explain'
    | 'integer-mixed'
    | 'integer-order'
    | 'integer-factors'
    | 'integer-prime'
    | 'integer-common';
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
export function exactRational(raw: string): [bigint, bigint] | null {
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
      .replace(/\s*(?:NZD|dollars?|新西兰元|纽元)$/i, '');
  if (spec.unit === 'km')
    clean = clean.replace(/\s*(?:km|kilometres?|kilometers?|千米|公里)$/i, '');
  if (spec.unit === 'm')
    clean = clean.replace(/\s*(?:m|metres?|meters?|米)$/i, '');
  if (spec.unit === 'L')
    clean = clean.replace(/\s*(?:l|litres?|liters?|升)$/i, '');
  if (spec.unit === 'dm')
    clean = clean.replace(/\s*(?:dm|decimetres?|decimeters?|分米)$/i, '');
  if (spec.unit === 'dm²')
    clean = clean.replace(
      /\s*(?:dm(?:²|\^2|2)|square decimetres?|square decimeters?|平方分米)$/i,
      '',
    );
  if (spec.unit === 'mL')
    clean = clean.replace(/\s*(?:ml|millilitres?|milliliters?|毫升)$/i, '');
  if (spec.unit === 'cm³')
    clean = clean.replace(
      /\s*(?:cm(?:³|\^3|3)|cubic centimetres?|cubic centimeters?|立方厘米)$/i,
      '',
    );
  if (spec.unit === 'dm³')
    clean = clean.replace(
      /\s*(?:dm(?:³|\^3|3)|cubic decimetres?|cubic decimeters?|立方分米)$/i,
      '',
    );
  if (spec.unit === 'm³')
    clean = clean.replace(
      /\s*(?:m(?:³|\^3|3)|cubic metres?|cubic meters?|立方米)$/i,
      '',
    );
  if (spec.unit === 'cm²')
    clean = clean.replace(
      /\s*(?:cm(?:²|\^2|2)|square centimetres?|平方厘米)$/i,
      '',
    );
  if (spec.unit === 'm²')
    clean = clean.replace(/\s*(?:m(?:²|\^2|2)|square metres?|平方米)$/i, '');
  if (spec.unit === 'mm')
    clean = clean.replace(/\s*(?:mm|millimetres?|毫米)$/i, '');
  if (spec.unit === 'cm')
    clean = clean.replace(/\s*(?:cm|centimetres?|厘米)$/i, '');
  if (spec.unit === '°')
    clean = clean.replace(/\s*(?:°|degrees?|deg|度)$/i, '');
  if (spec.unit === 'people')
    clean = clean.replace(/\s*(?:people|persons?|人)$/i, '');
  if (spec.unit === 'cards')
    clean = clean.replace(/\s*(?:cards?|张(?:卡片|卡)?)$/i, '');
  if (spec.unit === 'bags') clean = clean.replace(/\s*(?:bags?|袋)$/i, '');
  if (spec.unit === 'pencils')
    clean = clean.replace(/\s*(?:pencils?|支(?:铅笔)?)$/i, '');
  if (spec.unit === 'sticks')
    clean = clean.replace(/\s*(?:sticks?|matchsticks?|根(?:小棒)?)$/i, '');
  if (spec.unit === 'min')
    clean = clean.replace(/\s*(?:mins?|minutes?|分钟)$/i, '');
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
  const actual = exactRational(clean),
    expected = exactRational(spec.value);
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
