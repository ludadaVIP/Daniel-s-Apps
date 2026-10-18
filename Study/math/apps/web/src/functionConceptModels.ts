import {
  addR,
  mulR,
  divR,
  negR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import {
  compareR,
  interval,
  intervalContains,
  intersectIntervals,
  parseRealSet,
  solveInequality,
  inequalityAt,
  type RealInterval,
} from './inequalityModels';
import { normalUnion, type RealUnion } from './logicModels';
import { principalRadical, radicalText, squareRoots } from './radicalModels';
export type FunctionCode =
  | 'function'
  | 'not-function'
  | 'outside-domain'
  | 'undetermined'
  | 'increasing'
  | 'decreasing'
  | 'neither-strict'
  | 'even'
  | 'odd'
  | 'both'
  | 'neither'
  | 'invertible'
  | 'not-invertible';
const names: Record<FunctionCode, string[]> = {
  function: ['function', '函数'],
  'not-function': ['not-function', '不是函数'],
  'outside-domain': ['outside-domain', '不在定义域', '域外'],
  undetermined: ['undetermined', '无法唯一确定', '不能确定'],
  increasing: ['increasing', '严格递增', '递增'],
  decreasing: ['decreasing', '严格递减', '递减'],
  'neither-strict': ['neither-strict', '既非严格递增也非严格递减'],
  even: ['even', '偶', '偶函数'],
  odd: ['odd', '奇', '奇函数'],
  both: ['both', '既奇又偶'],
  neither: ['neither', '非奇非偶'],
  invertible: ['invertible', '有反函数'],
  'not-invertible': ['not-invertible', '无反函数'],
};
export const checkFunctionCode = (raw: string, value: FunctionCode) =>
  names[value].includes(raw.trim().toLowerCase());
const R = readRational,
  Z = R('0');
export const rationalNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export type MappingKind = 'finite' | 'interval' | 'missing' | 'split';
export function mappingModel(kind: MappingKind) {
  if (!['finite', 'interval', 'missing', 'split'].includes(kind))
    throw new RangeError('Unknown mapping');
  const inputs = ['-2', '-1', '0', '1', '2'],
    codomain = ['0', '1', '4', '9'];
  let edges = inputs.map((x) => ({ x, y: textR(mulR(R(x), R(x))) }));
  if (kind === 'missing') edges = edges.filter((p) => p.x !== '2');
  if (kind === 'split') edges.push({ x: '0', y: '1' });
  const valid =
    kind === 'interval' ||
    inputs.every((x) => edges.filter((p) => p.x === x).length === 1);
  return {
    inputs,
    codomain,
    edges,
    valid,
    domain: kind === 'interval' ? '[-2,3]' : `{${inputs}}`,
    range: kind === 'interval' ? '[0,9]' : '{0,1,4}',
  };
}
export function mappingAt(kind: MappingKind, raw: string) {
  const m = mappingModel(kind),
    x = R(raw),
    key = textR(x),
    admissible =
      kind === 'interval'
        ? intervalContains(parseRealSet('[-2,3]')!, x)
        : m.inputs.includes(key);
  return {
    admissible,
    outputs: !admissible
      ? []
      : kind === 'interval'
        ? [textR(mulR(x, x))]
        : m.edges.filter((p) => p.x === key).map((p) => p.y),
  };
}
export type RepresentationKind = 'continuous' | 'discrete' | 'observations';
export function representationAt(kind: RepresentationKind, raw: string) {
  if (!['continuous', 'discrete', 'observations'].includes(kind))
    throw new RangeError('Unknown representation');
  const x = R(raw),
    admissible =
      kind === 'discrete'
        ? ['-2', '-1', '0', '1', '2'].includes(textR(x))
        : intervalContains(parseRealSet('[-2,2]')!, x);
  if (!admissible) return { status: 'outside-domain' as const, value: null };
  if (kind === 'observations')
    return sameR(x, R('-1')) || sameR(x, R('1'))
      ? { status: 'value' as const, value: R('1') }
      : { status: 'undetermined' as const, value: null };
  return { status: 'value' as const, value: addR(mulR(x, x), R('-2')) };
}
export type Family =
  | 'square'
  | 'cube'
  | 'absolute'
  | 'square-plus-one'
  | 'zero'
  | 'restricted-square';
export function familyAt(kind: Family, x: Rational): Rational {
  switch (kind) {
    case 'cube':
      return mulR(mulR(x, x), x);
    case 'absolute':
      return [x[0] < 0n ? -x[0] : x[0], x[1]];
    case 'zero':
      return Z;
    case 'square-plus-one':
      return addR(mulR(x, x), R('1'));
    case 'square':
    case 'restricted-square':
      return mulR(x, x);
    default:
      throw new RangeError('Unknown function family');
  }
}
export type IntervalPart = 'whole' | 'left' | 'right';
export function propertyModel(kind: Family, part: IntervalPart = 'whole') {
  familyAt(kind, Z);
  if (
    !['whole', 'left', 'right'].includes(part) ||
    (kind === 'restricted-square' && part === 'left')
  )
    throw new RangeError('Unsupported nondegenerate interval');
  const end = kind === 'cube' ? 2 : 3,
    lo = kind === 'restricted-square' ? 0 : -end,
    hi = end;
  const studyLo = part === 'right' ? 0 : lo,
    studyHi = part === 'left' ? 0 : hi;
  const parity: FunctionCode =
    kind === 'restricted-square'
      ? 'neither'
      : kind === 'zero'
        ? 'both'
        : kind === 'cube'
          ? 'odd'
          : 'even';
  const monotonicity: FunctionCode =
    kind === 'zero'
      ? 'neither-strict'
      : kind === 'cube'
        ? 'increasing'
        : studyLo >= 0
          ? 'increasing'
          : studyHi <= 0
            ? 'decreasing'
            : 'neither-strict';
  return {
    lo,
    hi,
    studyLo,
    studyHi,
    domain: interval(R(String(lo)), R(String(hi)), true, true),
    study: interval(R(String(studyLo)), R(String(studyHi)), true, true),
    parity,
    monotonicity,
  };
}
export function auditOrderedPair(
  kind: Family,
  part: IntervalPart,
  x1Raw: string,
  x2Raw: string,
) {
  const m = propertyModel(kind, part),
    x1 = R(x1Raw),
    x2 = R(x2Raw),
    f1 = familyAt(kind, x1),
    f2 = familyAt(kind, x2);
  return {
    admissible: intervalContains(m.study, x1) && intervalContains(m.study, x2),
    ordered: compareR(x1, x2) < 0,
    f1,
    f2,
    comparison: compareR(f1, f2),
  };
}
export type TransformParams = {
  family: 'square' | 'cube' | 'absolute';
  a: number;
  b: number;
  h: number;
  k: number;
  restricted: boolean;
};
export const defaultTransform: TransformParams = {
  family: 'square',
  a: 2,
  b: 1,
  h: 3,
  k: -1,
  restricted: false,
};
export function transformModel(p: TransformParams, sourceRaw: string) {
  if (
    !['square', 'cube', 'absolute'].includes(p.family) ||
    !Number.isInteger(p.a) ||
    p.a < -2 ||
    p.a > 3 ||
    ![-2, -1, 1, 2].includes(p.b) ||
    !Number.isInteger(p.h) ||
    Math.abs(p.h) > 3 ||
    !Number.isInteger(p.k) ||
    Math.abs(p.k) > 3 ||
    typeof p.restricted !== 'boolean'
  )
    throw new RangeError('Invalid graph transformation');
  const source = R(sourceRaw);
  if (p.restricted && !intervalContains(parseRealSet('[-2,2]')!, source))
    throw new RangeError('Source outside restricted domain');
  const y = familyAt(p.family, source),
    xNew = addR(R(String(p.h)), divR(source, R(String(p.b)))),
    yNew = addR(R(String(p.k)), mulR(R(String(p.a)), y));
  const half = divR(R('2'), R(String(Math.abs(p.b)))),
    domain = p.restricted
      ? interval(
          addR(R(String(p.h)), negR(half)),
          addR(R(String(p.h)), half),
          true,
          true,
        )
      : interval(null, null);
  return { source: [source, y] as const, image: [xNew, yNew] as const, domain };
}
export function transformedAt(p: TransformParams, raw: string) {
  transformModel(p, '0');
  const x = R(raw),
    source = mulR(R(String(p.b)), addR(x, negR(R(String(p.h)))));
  if (p.restricted && !intervalContains(parseRealSet('[-2,2]')!, source))
    return null;
  return addR(R(String(p.k)), mulR(R(String(p.a)), familyAt(p.family, source)));
}
export type InverseKind =
  'affine' | 'square-full' | 'square-positive' | 'square-negative';
export function inverseModel(kind: InverseKind, raw: string) {
  if (
    !['affine', 'square-full', 'square-positive', 'square-negative'].includes(
      kind,
    )
  )
    throw new RangeError('Unknown inverse case');
  const query = R(raw),
    affine = kind === 'affine',
    domain = parseRealSet(
      affine
        ? '[-2,4]'
        : kind === 'square-positive'
          ? '[0,3]'
          : kind === 'square-negative'
            ? '[-3,0]'
            : '[-3,3]',
    )!,
    range = parseRealSet(affine ? '[-1,11]' : '[0,9]')!,
    admissible = intervalContains(range, query);
  const preimages = !admissible
    ? []
    : affine
      ? [textR(divR(addR(query, R('-3')), R('2')))]
      : kind === 'square-full'
        ? squareRoots(raw)
        : [
            kind === 'square-positive' || !query[0]
              ? radicalText(principalRadical(query))
              : `-${radicalText(principalRadical(query))}`,
          ];
  return {
    domain,
    range,
    admissible,
    preimages,
    invertible: kind !== 'square-full',
  };
}
export type PieceKind = 'parking' | 'parcel' | 'started-hour';
export type FunctionPiece = {
  domain: RealInterval;
  m: string;
  b: string;
  zh: string;
  en: string;
};
export function piecewiseModel(kind: PieceKind): FunctionPiece[] {
  if (kind === 'parking')
    return [
      {
        domain: parseRealSet('[0,1]')!,
        m: '0',
        b: '0',
        zh: '0≤t≤1：免费，C=0',
        en: '0≤t≤1: free, C=0',
      },
      {
        domain: parseRealSet('(1,3]')!,
        m: '2',
        b: '-2',
        zh: '1<t≤3：C=2(t−1)',
        en: '1<t≤3: C=2(t−1)',
      },
      {
        domain: parseRealSet('(3,5]')!,
        m: '3',
        b: '-5',
        zh: '3<t≤5：C=4+3(t−3)',
        en: '3<t≤5: C=4+3(t−3)',
      },
    ];
  if (kind === 'parcel')
    return [
      {
        domain: parseRealSet('(0,1]')!,
        m: '0',
        b: '4',
        zh: '0<m≤1：整件C=4',
        en: '0<m≤1: whole parcel C=4',
      },
      {
        domain: parseRealSet('(1,3]')!,
        m: '0',
        b: '7',
        zh: '1<m≤3：整件C=7',
        en: '1<m≤3: whole parcel C=7',
      },
      {
        domain: parseRealSet('(3,5]')!,
        m: '0',
        b: '10',
        zh: '3<m≤5：整件C=10',
        en: '3<m≤5: whole parcel C=10',
      },
    ];
  if (kind === 'started-hour')
    return [
      {
        domain: parseRealSet('{0}')!,
        m: '0',
        b: '0',
        zh: 't=0：C=0',
        en: 't=0: C=0',
      },
      ...Array.from({ length: 4 }, (_, i) => ({
        domain: parseRealSet(`(${i},${i + 1}]`)!,
        m: '0',
        b: String(3 * (i + 1)),
        zh: `${i}<t≤${i + 1}：C=${3 * (i + 1)}`,
        en: `${i}<t≤${i + 1}: C=${3 * (i + 1)}`,
      })),
    ];
  throw new RangeError('Unknown piecewise model');
}
export function piecewiseAt(kind: PieceKind, raw: string) {
  const x = R(raw),
    pieces = piecewiseModel(kind),
    hits = pieces
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => intervalContains(p.domain, x));
  if (hits.length > 1) throw new Error('Overlapping function branches');
  const hit = hits[0];
  return hit
    ? { index: hit.i, value: addR(mulR(R(hit.p.m), x), R(hit.p.b)) }
    : null;
}
export function piecewiseBudget(kind: PieceKind, budgetRaw: string): RealUnion {
  const budget = R(budgetRaw);
  return normalUnion(
    piecewiseModel(kind).map((p) =>
      intersectIntervals(
        p.domain,
        solveInequality(inequalityAt(`${p.m}x+(${p.b})<=${textR(budget)}`)),
      ),
    ),
  );
}
