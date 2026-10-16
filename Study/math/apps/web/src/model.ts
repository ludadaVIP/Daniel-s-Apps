import {
  checkSimilarityClass,
  checkSimilarityRule,
  type SimilarityClass,
  type SimilarityRule,
} from './similarityModels';
import {
  checkParabolaOpening,
  checkQuadraticForm,
  type ParabolaOpening,
  type QuadraticForm,
} from './parabolaModels';
import {
  checkRadicalSet,
  checkQuadraticEquation,
  checkQuadraticKind,
  type QuadraticKind,
} from './quadraticModels';
import {
  checkRadical,
  checkRootSet,
  checkRealClass,
  checkRoundedRoot,
  type RealClass,
} from './radicalModels';
import type { LocalizedText } from '@study/shared';
import { equivalentExpression } from './algebraModels';
import { checkPiMultiple } from './circleModels';
import { checkNumberSet } from './numberSetAnswers';
import {
  equalPolynomial,
  isCollectedPolynomial,
  isFinishedPolynomialProduct,
} from './polynomialModels';
import { checkLinearEquation, checkSolutionClass } from './linearModels';
import { checkGeometryClass, type GeometryClass } from './planeModels';
import { checkOutcomeSet } from './inferenceModels';
import { checkFactorisation } from './factorModels';
import { checkSystemModel, checkSystemClass } from './systemModels';
import {
  checkGeometryCode,
  checkCongruenceRule,
  checkProofVerdict,
  type CongruenceRule,
  type ProofVerdict,
} from './congruenceModels';
import {
  checkAssociation,
  type Association,
  type PairedRecord,
} from './researchModels';
import { checkRootLength } from './pythagoreanModels';
import { checkRealSet } from './inequalityModels';
import { checkFunctionClass, type FunctionClass } from './functionModels';
import {
  checkCoordinate,
  type PlotBounds,
  type PlotPoint,
} from './cartesianModels';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AnswerSpec =
  | { kind: 'similarity-class'; value: SimilarityClass }
  | {
      kind: 'similarity-rule';
      value: SimilarityRule;
      alternatives?: SimilarityRule[];
    }
  | { kind: 'parabola-class'; value: ParabolaOpening }
  | { kind: 'quadratic-form'; value: string; form?: QuadraticForm }
  | { kind: 'quadratic-roots'; values: string[]; value: string }
  | { kind: 'quadratic-equation'; value: string; model?: boolean }
  | { kind: 'quadratic-kind'; value: QuadraticKind }
  | { kind: 'radical'; value: string; simplified?: boolean }
  | { kind: 'root-set'; radicand: string; value: string }
  | { kind: 'real-class'; value: RealClass }
  | { kind: 'root-rounded'; radicand: string; places: number; value: string }
  | { kind: 'association'; value: Association }
  | { kind: 'root-length'; value: string; square: string }
  | { kind: 'geometry-code'; value: string; reversible?: boolean }
  | {
      kind: 'congruence-rule';
      value: CongruenceRule;
      alternatives?: CongruenceRule[];
    }
  | { kind: 'proof-verdict'; value: ProofVerdict }
  | { kind: 'function-class'; value: FunctionClass }
  | { kind: 'real-set'; value: string }
  | { kind: 'linear-system'; value: string }
  | { kind: 'system-class'; value: 'none' | 'infinite' }
  | { kind: 'factorisation'; value: string; variables: string[] }
  | { kind: 'outcome-set'; values: string[]; value: string }
  | { kind: 'coordinate'; value: string }
  | { kind: 'geometry-class'; value: GeometryClass }
  | { kind: 'linear-equation'; value: string; model?: boolean }
  | { kind: 'solution-class'; value: 'none' | 'all' }
  | {
      kind: 'polynomial';
      value: string;
      variables: string[];
      collected?: boolean;
      finishedProduct?: boolean;
    }
  | { kind: 'number-set'; values: string[]; value: string }
  | {
      kind: 'pi-multiple';
      coefficient: string;
      value: string;
      unit: 'cm' | 'cm²' | 'cm³';
    }
  | { kind: 'expression'; value: string; variable: 'n' | 'x' }
  | { kind: 'ratio'; value: string; simplest?: boolean }
  | {
      kind: 'number';
      value: string;
      unit?:
        | 'NZD'
        | 'g'
        | '°C'
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
        | 'visits'
        | 'cards'
        | 'groups'
        | 'bags'
        | 'pencils'
        | 'min'
        | 'h'
        | 'years'
        | 'km/h'
        | 'sticks';
      formats?: ('decimal' | 'fraction' | 'percent')[];
      fractionRule?: 'unit' | 'improper' | 'mixed' | 'simplest';
      requiredDenominator?: number;
    }
  | { kind: 'choice'; value: string }
  | { kind: 'explain'; rubric: LocalizedText };
export type NumberDiagram =
  | { kind: 'similarity-pair'; factor: string }
  | { kind: 'similarity-nested' }
  | { kind: 'similarity-area'; sx: number; sy?: number }
  | {
      kind: 'parabola';
      source: string;
      level?: string;
      wide?: boolean;
      domain?: { lower: string; upper: string; whole?: boolean };
    }
  | { kind: 'quadratic-graph'; source: string; wide?: boolean }
  | { kind: 'completing-area'; source: string; xValue?: number }
  | { kind: 'radical-tiles'; radicand: string }
  | { kind: 'root-bounds'; radicand: string; places: number }
  | {
      kind: 'research-boxes';
      groups: { name: string; values: string[] }[];
      min?: number;
      max?: number;
      step?: number;
    }
  | {
      kind: 'research-scatter';
      records: PairedRecord[];
      xLabel?: string;
      yLabel?: string;
    }
  | {
      kind: 'pythagorean-triangle';
      a: string;
      b: string;
      unknown?: 'b' | 'c';
      right?: boolean;
      rectangle?: boolean;
    }
  | {
      kind: 'pythagorean-dissection';
      a: number;
      b: number;
      rearranged?: boolean;
    }
  | {
      kind: 'congruence-triangles';
      source: 'SSS' | 'SAS' | 'SSA' | 'ASA' | 'AAS' | 'AAA';
    }
  | { kind: 'congruence-isosceles'; apex: number }
  | {
      kind: 'congruence-quadrilateral';
      shear?: number;
      height?: number;
      diagonal?: boolean;
    }
  | { kind: 'inequality-line'; source: string; wide?: boolean }
  | {
      kind: 'dot-distribution';
      values: number[];
      max?: number;
      step?: number;
      name: string;
    }
  | {
      kind: 'cartesian';
      bounds: PlotBounds;
      points: PlotPoint[];
      curves?: {
        points: PlotPoint[];
        name: string;
        color?: string;
        dash?: string;
      }[];
      caption?: LocalizedText;
      xLabel?: string;
      yLabel?: string;
    }
  | { kind: 'plane-object'; object: 'point' | 'line' | 'ray' | 'segment' }
  | { kind: 'plane-intersection'; angle: number; rotation?: number }
  | { kind: 'plane-parallel'; top: number; bottom: number; parallel: boolean }
  | { kind: 'plane-triangle'; a: number; b: number }
  | { kind: 'rational-line'; points: { value: string; label: string }[] }
  | {
      kind: 'stats-order';
      values: number[];
      sorted?: boolean;
      highlight?: boolean;
    }
  | { kind: 'chance-spinner'; labels: string[]; weights: number[] }
  | { kind: 'chance-tokens'; counts: number[]; selected: number[] }
  | { kind: 'circle-parts'; r: number; angle?: number; offset?: number }
  | { kind: 'circle-sectors'; r: number; count: number; rearranged?: boolean }
  | { kind: 'cylinder-net'; r: number; h: number; lids: 0 | 1 | 2 }
  | { kind: 'algebra-groups'; n: number; inside: boolean }
  | { kind: 'signed-thermometer'; value: number; interval?: number }
  | {
      kind: 'signed-axis';
      points: { value: number; label: string }[];
      min?: number;
      max?: number;
      interval?: number;
      segments?: { from: number; to: number; arrow?: boolean }[];
    }
  | { kind: 'ratio-counters'; a: number; b: number }
  | { kind: 'ratio-shares'; total: number; a: number; b: number }
  | {
      kind: 'ratio-map';
      horizontal: number;
      vertical: number;
      scale: number;
      zoom?: number;
    }
  | {
      kind: 'ratio-graph';
      curve: 'direct' | 'fee' | 'square';
      rate: number;
      wide?: boolean;
    }
  | { kind: 'percent-grid'; value: { n: number; d: number } }
  | { kind: 'percent-source'; selected: number; total: number }
  | {
      kind: 'percent-axis';
      rate: number;
      wholeLabel: string;
      partLabel: string;
    }
  | { kind: 'product-repeat'; count: number; part: { n: number; d: number } }
  | {
      kind: 'product-share';
      amount: { n: number; d: number };
      people: number;
      stage?: number;
    }
  | {
      kind: 'product-area';
      left: { n: number; d: number };
      right: { n: number; d: number };
    }
  | {
      kind: 'product-groups';
      amount: { n: number; d: number };
      group: { n: number; d: number };
    }
  | {
      kind: 'data-line';
      points: { time: number; value: number | null }[];
      maxY: number;
    }
  | { kind: 'data-mean'; values: number[] }
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
    | 'ratio'
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
    | 'similarity-meaning'
    | 'similarity-tests'
    | 'similarity-sides'
    | 'similarity-area'
    | 'similarity-applications'
    | 'parabola-opening'
    | 'parabola-vertex'
    | 'parabola-forms'
    | 'parabola-intersections'
    | 'parabola-maximum'
    | 'quadratic-meaning'
    | 'quadratic-factor'
    | 'quadratic-complete'
    | 'quadratic-formula'
    | 'quadratic-discriminant'
    | 'quadratic-apply'
    | 'radical-meaning'
    | 'radical-real'
    | 'radical-simplify'
    | 'radical-operations'
    | 'radical-estimate'
    | 'research-quartiles'
    | 'research-spread'
    | 'research-scatter'
    | 'research-cause'
    | 'research-investigate'
    | 'pyth-translate'
    | 'pyth-rotate'
    | 'pyth-proof'
    | 'pyth-apply'
    | 'pyth-converse'
    | 'congruence-meaning'
    | 'congruence-sides'
    | 'congruence-angles'
    | 'congruence-isosceles'
    | 'congruence-parallelogram'
    | 'congruence-proof'
    | 'function-form'
    | 'function-slope'
    | 'function-intercept'
    | 'function-points'
    | 'function-compare'
    | 'function-context'
    | 'inequality-meaning'
    | 'inequality-step'
    | 'inequality-reverse'
    | 'inequality-linear'
    | 'inequality-intersection'
    | 'system-relations'
    | 'system-substitute'
    | 'system-eliminate'
    | 'system-graph'
    | 'system-model'
    | 'factor-common'
    | 'factor-difference'
    | 'factor-square'
    | 'factor-quadratic'
    | 'factor-check'
    | 'identity-monomial'
    | 'identity-distribute'
    | 'identity-binomial'
    | 'identity-square'
    | 'identity-difference'
    | 'infer-sample'
    | 'infer-distribution'
    | 'infer-outlier'
    | 'infer-space'
    | 'infer-tree'
    | 'cart-plane'
    | 'cart-plot'
    | 'cart-table'
    | 'cart-linear'
    | 'cart-context'
    | 'plane-objects'
    | 'plane-intersect'
    | 'plane-parallel'
    | 'plane-sum'
    | 'plane-classify'
    | 'plane-reasons'
    | 'linear-check'
    | 'linear-balance'
    | 'linear-brackets'
    | 'linear-fractions'
    | 'linear-model'
    | 'linear-context'
    | 'poly-substitute'
    | 'poly-like'
    | 'poly-distribute'
    | 'poly-sum'
    | 'poly-story'
    | 'rational-sign'
    | 'rational-distance'
    | 'rational-add'
    | 'rational-subtract'
    | 'rational-scale'
    | 'rational-mixed'
    | 'applied-travel'
    | 'applied-work'
    | 'applied-budget'
    | 'applied-chart'
    | 'applied-trip'
    | 'chance-order'
    | 'chance-summary'
    | 'chance-equal'
    | 'chance-event'
    | 'chance-frequency'
    | 'circle-parts'
    | 'circle-pi'
    | 'circle-circumference'
    | 'circle-area'
    | 'circle-cylinder'
    | 'algebra-letter'
    | 'algebra-nth'
    | 'algebra-expression'
    | 'algebra-balance'
    | 'algebra-brackets'
    | 'signed-temperature'
    | 'signed-line'
    | 'signed-compare'
    | 'signed-move'
    | 'signed-absolute'
    | 'ratio-compare'
    | 'ratio-simplify'
    | 'ratio-share'
    | 'ratio-table'
    | 'ratio-map'
    | 'ratio-graph'
    | 'percent-hundred'
    | 'percent-decimal'
    | 'percent-fraction'
    | 'percent-amount'
    | 'percent-whole'
    | 'percent-change'
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
    | 'data-frequency'
    | 'data-mean'
    | 'data-line'
    | 'data-chart'
    | 'data-recipe'
    | 'product-repeat'
    | 'product-area'
    | 'product-amount'
    | 'product-share'
    | 'product-whole-divide'
    | 'product-fraction-divide'
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
  const text = raw
    .trim()
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/／/g, '/')
    .replace(/％/g, '%');
  if (text.length > 60) return null;
  if (text.endsWith('%')) {
    const base = text.slice(0, -1).trim();
    if (base.includes('%')) return null;
    const parsed = exactRational(base);
    if (!parsed) return null;
    const d = parsed[1] * 100n,
      factor = gcd(parsed[0], d);
    return [parsed[0] / factor, d / factor];
  }
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
  if (spec.kind === 'similarity-class')
    return checkSimilarityClass(input, spec.value);
  if (spec.kind === 'similarity-rule')
    return checkSimilarityRule(input, spec.value, spec.alternatives);
  if (spec.kind === 'parabola-class')
    return checkParabolaOpening(input, spec.value);
  if (spec.kind === 'quadratic-form')
    return checkQuadraticForm(input, spec.value, spec.form);
  if (spec.kind === 'quadratic-roots')
    return checkRadicalSet(input, spec.values);
  if (spec.kind === 'quadratic-equation')
    return checkQuadraticEquation(input, spec.value, spec.model !== false);
  if (spec.kind === 'quadratic-kind')
    return checkQuadraticKind(input, spec.value);
  if (spec.kind === 'radical')
    return checkRadical(input, spec.value, spec.simplified);
  if (spec.kind === 'root-set') return checkRootSet(input, spec.radicand);
  if (spec.kind === 'real-class') return checkRealClass(input, spec.value);
  if (spec.kind === 'root-rounded')
    return checkRoundedRoot(input, spec.radicand, spec.places);
  if (spec.kind === 'association') return checkAssociation(input, spec.value);
  if (spec.kind === 'root-length') return checkRootLength(input, spec.square);
  if (spec.kind === 'geometry-code')
    return checkGeometryCode(input, spec.value, spec.reversible);
  if (spec.kind === 'congruence-rule')
    return checkCongruenceRule(input, spec.value, spec.alternatives);
  if (spec.kind === 'proof-verdict')
    return checkProofVerdict(input, spec.value);
  if (spec.kind === 'function-class')
    return checkFunctionClass(input, spec.value);
  if (spec.kind === 'real-set') return checkRealSet(input, spec.value);
  if (spec.kind === 'linear-system') return checkSystemModel(input, spec.value);
  if (spec.kind === 'system-class') return checkSystemClass(input, spec.value);
  if (spec.kind === 'factorisation')
    return checkFactorisation(input, spec.value, spec.variables);
  if (spec.kind === 'outcome-set') return checkOutcomeSet(input, spec.values);
  if (spec.kind === 'coordinate') return checkCoordinate(input, spec.value);
  if (spec.kind === 'geometry-class')
    return checkGeometryClass(input, spec.value);
  if (spec.kind === 'linear-equation')
    return checkLinearEquation(input, spec.value, spec.model !== false);
  if (spec.kind === 'solution-class')
    return checkSolutionClass(input, spec.value);
  if (spec.kind === 'polynomial')
    return (
      equalPolynomial(input, spec.value, spec.variables) &&
      (!spec.collected || isCollectedPolynomial(input, spec.variables)) &&
      (!spec.finishedProduct ||
        isFinishedPolynomialProduct(input, spec.variables))
    );
  if (spec.kind === 'number-set') return checkNumberSet(input, spec.values);
  if (spec.kind === 'pi-multiple')
    return checkPiMultiple(input, spec.coefficient, spec.unit);
  if (spec.kind === 'expression')
    return equivalentExpression(input, spec.value, spec.variable);
  if (spec.kind === 'explain') return null;
  if (spec.kind === 'choice') return input === spec.value;
  if (spec.kind === 'ratio') {
    const parse = (raw: string) => {
      const terms = raw.trim().replace(/：/g, ':').split(':');
      if (terms.length !== 2 || terms.some((s) => /[%％]/.test(s))) return null;
      const a = exactRational(terms[0]!),
        b = exactRational(terms[1]!);
      return a && b && a[0] >= 0n && a[1] > 0n && b[0] > 0n && b[1] > 0n
        ? { a, b, terms }
        : null;
    };
    const actual = parse(input),
      expected = parse(spec.value);
    if (!actual || !expected) return false;
    if (
      spec.simplest &&
      (!actual.terms.every((s) => /^\d+$/.test(s.trim())) ||
        gcd(actual.a[0], actual.b[0]) !== 1n)
    )
      return false;
    return (
      actual.a[0] * actual.b[1] * expected.b[0] * expected.a[1] ===
      expected.a[0] * expected.b[1] * actual.b[0] * actual.a[1]
    );
  }
  let clean = input.trim();
  if (spec.unit === 'years')
    clean = clean.replace(/\s*(?:years?|yrs?|岁|年)$/i, '');
  if (spec.unit === 'h') clean = clean.replace(/\s*(?:h|hours?|小时)$/i, '');
  if (spec.unit === 'km/h')
    clean = clean.replace(
      /\s*(?:km\s*\/\s*h|kilometres? per hour|kilometers? per hour|千米\s*\/\s*小时|公里\s*\/\s*小时)$/i,
      '',
    );
  if (spec.unit === 'groups')
    clean = clean.replace(/\s*(?:groups?|份|组)$/i, '');
  if (spec.unit === 'g') clean = clean.replace(/\s*(?:g|grams?|克)$/i, '');
  if (spec.unit === '°C')
    clean = clean.replace(/\s*(?:°\s*c|℃|degrees?\s*celsius|摄氏度)$/i, '');
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
  if (spec.unit === 'visits')
    clean = clean.replace(/\s*(?:visits?|人次)$/i, '');
  if (spec.unit === 'cards')
    clean = clean.replace(/\s*(?:cards?|张(?:卡片|卡)?)$/i, '');
  if (spec.unit === 'bags') clean = clean.replace(/\s*(?:bags?|袋)$/i, '');
  if (spec.unit === 'pencils')
    clean = clean.replace(/\s*(?:pencils?|支(?:铅笔)?)$/i, '');
  if (spec.unit === 'sticks')
    clean = clean.replace(/\s*(?:sticks?|matchsticks?|根(?:小棒)?)$/i, '');
  if (spec.unit === 'min')
    clean = clean.replace(/\s*(?:mins?|minutes?|分钟)$/i, '');
  clean = clean
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/／/g, '/')
    .replace(/％/g, '%');
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
  const format = clean.includes('%')
    ? 'percent'
    : clean.includes('/')
      ? 'fraction'
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
