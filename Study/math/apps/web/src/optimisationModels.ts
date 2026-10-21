import {
  rational,
  addR,
  mulR,
  divR,
  negR,
  sameR,
  textR,
  parseAffine,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { equalPolynomial } from './polynomialModels';
import { checkCircleIdentity } from './circularModels';
import {
  shapeModel,
  signR,
  type AnalysisFamily,
} from './functionAnalysisModels';
import { asNumber } from './calculusModels';
export type AdvancedForm = 'natural' | 'base' | 'trig';
/** Replace only verified function atoms, then prove polynomial identity in formal atoms.
 * No numeric sampling, eval, or matching against one display string. */
export function derivativeAtoms(
  raw: string,
  family: AdvancedForm,
  rate = '1',
  base = 2,
): string | null {
  if (raw.length > 220 || !['natural', 'base', 'trig'].includes(family))
    return null;
  const source = raw
    .replace(/\s/g, '')
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/[²³⁴]/g, (s) => `^${s === '²' ? 2 : s === '³' ? 3 : 4}`);
  let i = 0,
    out = '';
  try {
    const r = readRational(rate);
    if (
      !r[0] ||
      Math.abs(asNumber(r)) > 6 ||
      !Number.isSafeInteger(base) ||
      base < 2 ||
      base > 10
    )
      return null;
    const argument = () => {
      if (source[i] === '(') {
        const start = ++i;
        let depth = 1;
        while (i < source.length && depth) {
          if (source[i] === '(') depth++;
          if (source[i] === ')') depth--;
          i++;
        }
        if (depth) throw Error('Unclosed function');
        return source.slice(start, i - 1);
      }
      const m = source.slice(i).match(/^[+-]?(?:(?:\d+(?:\.\d+)?|\.\d+)\*?)?x/);
      if (!m) throw Error('Argument required');
      i += m[0].length;
      return m[0];
    };
    const inner = (s: string) => {
      const a = parseAffine(s, 'x');
      if (!a || a.b[0]) throw Error('Use the stated linear argument');
      return a.a;
    };
    while (i < source.length) {
      const token = source.slice(i).match(/^(sin|cos|exp|ln)/)?.[0];
      if (token) {
        i += token.length;
        const arg = argument();
        if (token === 'ln') {
          if (
            family !== 'base' ||
            !sameR(readRational(arg), rational(BigInt(base)))
          )
            return null;
          out += 'l';
          continue;
        }
        const k = inner(arg);
        if (token === 'exp') {
          if (family !== 'natural' || !sameR(k, r)) return null;
          out += 'z';
          continue;
        }
        if (family !== 'trig' || (!sameR(k, r) && !sameR(k, negR(r))))
          return null;
        out += token === 'sin' ? (sameR(k, r) ? 's' : '(-s)') : 'c';
        continue;
      }
      if (source.startsWith('e^', i)) {
        i += 2;
        if (family !== 'natural' || !sameR(inner(argument()), r)) return null;
        out += 'z';
        continue;
      }
      const number = source.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/)?.[0];
      if (number) {
        i += number.length;
        if (family === 'base' && source[i] === '^' && Number(number) === base) {
          i++;
          if (!sameR(inner(argument()), rational(1n))) return null;
          out += 'z';
        } else out += number;
        continue;
      }
      const ch = source[i++]!;
      if (!/[x()+*/^+-]/.test(ch)) return null;
      out += ch;
    }
    return out;
  } catch {
    return null;
  }
}
export function checkAdvancedDerivative(
  raw: string,
  value: string,
  family: AdvancedForm,
  rate = '1',
  base = 2,
) {
  const a = derivativeAtoms(raw, family, rate, base),
    b = derivativeAtoms(value, family, rate, base);
  if (a === null || b === null) return false;
  return family === 'trig'
    ? checkCircleIdentity(a, b)
    : equalPolynomial(a, b, family === 'natural' ? ['x', 'z'] : ['l', 'z']);
}
export type AdvancedCode =
  | 'vertical'
  | 'singular'
  | 'off-curve'
  | 'not-attained'
  | 'empty-domain'
  | 'speeding-up'
  | 'slowing-down'
  | 'instant-rest'
  | 'neither';
const codeAliases: Record<AdvancedCode, string[]> = {
  vertical: ['vertical', '竖直切线'],
  singular: ['singular', '奇点'],
  'off-curve': ['off-curve', '不在曲线上'],
  'not-attained': ['not-attained', '未取到'],
  'empty-domain': ['empty-domain', '无可行解'],
  'speeding-up': ['speeding-up', '加速'],
  'slowing-down': ['slowing-down', '减速'],
  'instant-rest': ['instant-rest', '瞬时静止'],
  neither: ['neither', '两者都不是'],
};
export const checkAdvancedCode = (raw: string, value: AdvancedCode) =>
  codeAliases[value].includes(raw.trim().toLowerCase());
export function implicitAudit(
  kind: 'circle' | 'cross',
  xRaw: string,
  yRaw: string,
  radius = 5,
) {
  if (
    !['circle', 'cross'].includes(kind) ||
    !Number.isSafeInteger(radius) ||
    radius < 1 ||
    radius > 12
  )
    throw new RangeError('Known bounded implicit curve');
  const x = readRational(xRaw),
    y = readRational(yRaw);
  if (Math.abs(asNumber(x)) > 20 || Math.abs(asNumber(y)) > 20)
    throw new RangeError('Bounded point');
  const xx = mulR(x, x),
    yy = mulR(y, y),
    on = sameR(
      addR(xx, kind === 'circle' ? yy : negR(yy)),
      rational(BigInt(kind === 'circle' ? radius * radius : 0)),
    ),
    fx = mulR(rational(2n), x),
    fy = mulR(rational(kind === 'circle' ? 2n : -2n), y);
  const status = !on
      ? 'off-curve'
      : !fx[0] && !fy[0]
        ? 'singular'
        : !fy[0]
          ? 'vertical'
          : 'regular',
    slope = status === 'regular' ? negR(divR(fx, fy)) : null;
  return { kind, x, y, radius, on, fx, fy, status, slope };
}
export type ExtremaInterval = {
  left: string;
  right: string;
  leftClosed: boolean;
  rightClosed: boolean;
};
export function extremaAudit(
  kind: Extract<AnalysisFamily, 'cubic-turn' | 'square' | 'corner'>,
  interval: ExtremaInterval,
) {
  if (!['cubic-turn', 'square', 'corner'].includes(kind))
    throw new RangeError('Known extrema family');
  const m = shapeModel(kind),
    left = readRational(interval.left),
    right = readRational(interval.right);
  if (
    asNumber(left) >= asNumber(right) ||
    Math.max(Math.abs(asNumber(left)), Math.abs(asNumber(right))) > 5
  )
    throw new RangeError('Ordered bounded interval');
  const candidates = [
    { x: left, included: interval.leftClosed, reason: 'left' },
    ...m.critical
      .filter((x) => x > asNumber(left) && x < asNumber(right))
      .map((x) => ({
        x: rational(BigInt(x)),
        included: true,
        reason: kind === 'corner' ? 'nondifferentiable' : 'stationary',
      })),
    { x: right, included: interval.rightClosed, reason: 'right' },
  ].map((c) => ({ ...c, y: m.value(c.x) }));
  let inf = candidates[0]!.y,
    sup = inf;
  for (const c of candidates) {
    if (signR(addR(c.y, negR(inf))) < 0) inf = c.y;
    if (signR(addR(c.y, negR(sup))) > 0) sup = c.y;
  }
  const minAt = candidates
      .filter((c) => c.included && sameR(c.y, inf))
      .map((c) => textR(c.x)),
    maxAt = candidates
      .filter((c) => c.included && sameR(c.y, sup))
      .map((c) => textR(c.x));
  return {
    m,
    interval,
    left,
    right,
    candidates,
    inf,
    sup,
    minAt,
    maxAt,
    min: minAt.length ? inf : null,
    max: maxAt.length ? sup : null,
  };
}
export function fenceAudit(length: number, cap: number, integer = false) {
  if (
    !Number.isSafeInteger(length) ||
    length < 12 ||
    length > 40 ||
    !Number.isSafeInteger(cap) ||
    cap < 0 ||
    cap > 20
  )
    throw new RangeError('Bounded whole fence parameters');
  const upper = Math.min(cap, length / 2),
    upperClosed = cap < length / 2,
    area = (x: Rational) =>
      mulR(x, addR(rational(BigInt(length)), mulR(rational(-2n), x))),
    allowed = (x: number) => x > 0 && 2 * x < length && x <= cap;
  const xs = integer
    ? Array.from({ length: Math.floor(upper) }, (_, i) =>
        rational(BigInt(i + 1)),
      ).filter((x) => allowed(asNumber(x)))
    : cap > 0
      ? [rational(BigInt(Math.min(length, 4 * cap)), 4n)]
      : [];
  let max: Rational | null = null;
  for (const x of xs) {
    const a = area(x);
    if (!max || signR(addR(a, negR(max))) > 0) max = a;
  }
  const best = xs.filter((x) => max && sameR(area(x), max));
  return {
    length,
    cap,
    integer,
    upper,
    upperClosed,
    area,
    allowed,
    candidates: xs.map((x) => ({
      x,
      y: addR(rational(BigInt(length)), mulR(rational(-2n), x)),
      area: area(x),
    })),
    max,
    best,
    bestText: best.length ? `{${best.map(textR).join(',')}}` : '∅',
    continuous: rational(BigInt(Math.min(length, 4 * cap)), 4n),
  };
}
export const positionBase = (t: Rational) =>
  mulR(t, mulR(addR(t, rational(-3n)), addR(t, rational(-3n))));
export function motionAudit(scale = 1, offset = 0, time = '2', end = 4) {
  if (
    !Number.isSafeInteger(scale) ||
    ![-2, -1, 1, 2, 3, 4, 5, 6].includes(scale) ||
    !Number.isSafeInteger(offset) ||
    Math.abs(offset) > 12 ||
    !Number.isSafeInteger(end) ||
    end < 2 ||
    end > 6
  )
    throw new RangeError('Bounded motion parameters');
  const t = readRational(time);
  if (asNumber(t) < 0 || asNumber(t) > end)
    throw new RangeError('Time in stated interval');
  const c = rational(BigInt(scale)),
    position = (x: Rational) =>
      addR(mulR(c, positionBase(x)), rational(BigInt(offset))),
    velocity = (x: Rational) =>
      mulR(
        c,
        addR(
          addR(mulR(rational(3n), mulR(x, x)), mulR(rational(-12n), x)),
          rational(9n),
        ),
      ),
    acceleration = (x: Rational) =>
      mulR(c, addR(mulR(rational(6n), x), rational(-12n))),
    v = velocity(t),
    a = acceleration(t),
    speed = rational(v[0] < 0n ? -v[0] : v[0], v[1]),
    classification: AdvancedCode = !v[0]
      ? 'instant-rest'
      : !a[0]
        ? 'neither'
        : signR(mulR(v, a)) > 0
          ? 'speeding-up'
          : 'slowing-down';
  const cuts = [0, 1, 3, end]
      .filter((x, i, arr) => x <= end && arr.indexOf(x) === i)
      .sort((x, y) => x - y),
    segments = cuts.slice(1).map((x, i) => {
      const from = cuts[i]!,
        change = addR(
          position(rational(BigInt(x))),
          negR(position(rational(BigInt(from)))),
        );
      return {
        from,
        to: x,
        change,
        distance: rational(change[0] < 0n ? -change[0] : change[0], change[1]),
      };
    }),
    distance = segments.reduce((s, x) => addR(s, x.distance), rational(0n)),
    displacement = addR(
      position(rational(BigInt(end))),
      negR(position(rational(0n))),
    );
  return {
    scale,
    offset,
    t,
    end,
    position,
    velocity,
    acceleration,
    v,
    a,
    speed,
    classification,
    segments,
    distance,
    displacement,
    averageVelocity: divR(displacement, rational(BigInt(end))),
    averageSpeed: divR(distance, rational(BigInt(end))),
  };
}
