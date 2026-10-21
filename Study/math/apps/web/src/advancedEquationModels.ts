import { rational, textR } from './algebraModels';
import { circularAt } from './circularModels';
import { radicalText, readRadical } from './radicalModels';

const integer = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Integer outside the stated teaching model');
  return n;
};
export type SquareBranch = 'right' | 'left' | 'whole';
export const finiteText = (xs: (number | string)[]) => `{${xs.join(',')}}`;
const fraction = (n: number, d = 1) => textR(rational(BigInt(n), BigInt(d)));
export function compositionAudit(
  shift: number,
  branch: SquareBranch,
  x: number,
) {
  integer(shift, -3, 3);
  integer(x, -5, 5);
  if (!['right', 'left', 'whole'].includes(branch))
    throw new RangeError('Square branch');
  const allowed = (u: number) =>
    branch === 'whole' || (branch === 'right' ? u >= 0 : u <= 0);
  const inner = x + shift,
    output = allowed(inner) ? inner * inner : null;
  const reverse = allowed(x) ? x * x + shift : null;
  const inverseCandidates = (square: number) => {
    integer(square, 0, 64);
    const root = Math.sqrt(square);
    if (!Number.isInteger(root))
      throw new RangeError('This exact audit uses square outputs');
    return [...new Set([-root, root])]
      .filter(allowed)
      .map((u) => u - shift)
      .sort((a, b) => a - b);
  };
  return {
    shift,
    branch,
    x,
    inner,
    output,
    reverse,
    allowed,
    inverseCandidates,
    domain:
      branch === 'whole'
        ? 'R'
        : branch === 'right'
          ? `[${-shift},∞)`
          : `(-∞,${-shift}]`,
    inverseDomain: '[0,∞)',
    invertible: branch !== 'whole',
    expression: `(x+(${shift}))^2`,
  };
}
export type LogEquationKind = 'exponential' | 'logarithm' | 'product';
export function logEquationAudit(
  kind: LogEquationKind,
  base: number,
  shift: number,
  power: number,
) {
  if (!['exponential', 'logarithm', 'product'].includes(kind))
    throw new RangeError('Equation family');
  integer(base, 2, 4);
  integer(shift, -3, 3);
  integer(power, -3, 4);
  if (kind === 'product') {
    // Two exact examples: log2(x−1)+log2(x+1)=3; log2(x−3)+log2(x+3)=4.
    if (
      base !== 2 ||
      ![1, 3].includes(shift) ||
      power !== (shift === 1 ? 3 : 4)
    )
      throw new RangeError('Choose a declared exact product example');
    const r = shift === 1 ? 3 : 5;
    return {
      kind,
      base,
      shift,
      power,
      domain: `(${shift},∞)`,
      candidates: [String(-r), String(r)],
      solutions: [String(r)],
      expression: `log_${base}(x−${shift})+log_${base}(x+${shift})=${power}`,
      lhs: (x: number) =>
        x > shift ? Math.log(x * x - shift * shift) / Math.log(base) : null,
      rhs: power,
    };
  }
  const amount =
    power >= 0
      ? rational(BigInt(base ** power))
      : rational(1n, BigInt(base ** -power));
  const solution =
    kind === 'exponential'
      ? String(shift + power)
      : textR(rational(BigInt(shift) * amount[1] + amount[0], amount[1]));
  return {
    kind,
    base,
    shift,
    power,
    domain: kind === 'exponential' ? 'R' : `(${shift},∞)`,
    candidates: [solution],
    solutions: [solution],
    expression:
      kind === 'exponential'
        ? `${base}^(x−(${shift}))=${base}^(${power})`
        : `log_${base}(x−(${shift}))=${power}`,
    lhs: (x: number) =>
      kind === 'exponential'
        ? base ** (x - shift)
        : x > shift
          ? Math.log(x - shift) / Math.log(base)
          : null,
    rhs: kind === 'exponential' ? base ** power : power,
  };
}
export type IdentityCase = 'quotient' | 'tangent' | 'sine-division';
export function identityAudit(kind: IdentityCase, coefficient: string) {
  if (!['quotient', 'tangent', 'sine-division'].includes(kind))
    throw new RangeError('Identity family');
  const p = circularAt(coefficient);
  const hole =
    kind === 'quotient'
      ? p.cos === '1'
      : kind === 'tangent'
        ? p.cos === '0'
        : p.sin === '0';
  const simplified =
    kind === 'quotient' ? radicalText(readRadical(`1+(${p.cos})`)!) : p.sin;
  return {
    kind,
    coefficient,
    point: p,
    hole,
    original:
      kind === 'quotient'
        ? 's²/(1−c)'
        : kind === 'tangent'
          ? '(s/c)c'
          : '(1−c²)/s',
    rewrite: kind === 'quotient' ? '1+c' : 's',
    only: kind === 'quotient' ? ('c' as const) : ('s' as const),
    value: simplified,
    excluded:
      kind === 'quotient'
        ? ['0', '2']
        : kind === 'tangent'
          ? ['1/2', '3/2']
          : ['0', '1', '2'],
    holdsOnOriginalDomain: !hole,
  };
}
export function parameterAudit(
  a: number,
  b: number,
  h: number,
  k: number,
  u: number,
) {
  for (const n of [a, b, h, k, u]) integer(n, -3, 3);
  const sourceY = u * u + u;
  const coefficients = [
    a * b * b,
    -2 * a * b * b * h + a * b,
    a * b * b * h * h - a * b * h + k,
  ];
  return {
    a,
    b,
    h,
    k,
    u,
    sourceY,
    coefficients,
    x: b === 0 ? null : fraction(b * h + u, b),
    y: String(a * sourceY + k),
    preimageCode:
      b === 0
        ? u === 0
          ? ('undetermined' as const)
          : ('outside-domain' as const)
        : null,
    constant: a === 0 || b === 0,
    horizontalScale: b === 0 ? null : fraction(1, Math.abs(b)),
    value: (x: number) => a * ((b * (x - h)) ** 2 + b * (x - h)) + k,
    exactValue: (x: number) => {
      integer(x, -5, 5);
      return String(
        coefficients[0]! * x * x + coefficients[1]! * x + coefficients[2]!,
      );
    },
    expression: `(${a})*(((${b})*(x-(${h})))^2+(${b})*(x-(${h})))+(${k})`,
  };
}
export type EquationAuditCase = 'radical' | 'rational' | 'absolute' | 'product';
export type CandidateEvidence = {
  x: number;
  domain: boolean;
  sign: boolean;
  valid: boolean;
  left: number | null;
  right: number;
};
export function solutionAudit(kind: EquationAuditCase, p: number, q: number) {
  if (!['radical', 'rational', 'absolute', 'product'].includes(kind))
    throw new RangeError('Equation family');
  let domain = 'R',
    expression = '',
    candidates: number[] = [],
    lhs: (x: number) => number | null = () => 0,
    rhs: (x: number) => number = () => 0,
    domainAt: (x: number) => boolean = () => true,
    signAt: (x: number) => boolean = () => true;
  if (kind === 'radical') {
    if (![2, 6].includes(p) || q !== 0)
      throw new RangeError('Declared radical examples');
    expression = `sqrt(x+${p})=x`;
    domain = `[${-p},∞)`;
    candidates = p === 2 ? [-1, 2] : [-2, 3];
    domainAt = (x) => x >= -p;
    signAt = (x) => x >= 0;
    lhs = (x) => (domainAt(x) ? Math.sqrt(x + p) : null);
    rhs = (x) => x;
  } else if (kind === 'rational') {
    integer(p, 1, 3);
    integer(q, 0, 8);
    expression = `(x²−${p * p})/(x−${p})=${q}`;
    domain = `(-∞,${p}) U (${p},∞)`;
    candidates = [q - p];
    domainAt = (x) => x !== p;
    lhs = (x) => (domainAt(x) ? (x * x - p * p) / (x - p) : null);
    rhs = () => q;
  } else if (kind === 'absolute') {
    integer(p, -3, 3);
    integer(q, -2, 3);
    expression = `|x−(${p})|=${q}`;
    candidates = q < 0 ? [] : q === 0 ? [p] : [p - q, p + q];
    lhs = (x) => Math.abs(x - p);
    rhs = () => q;
  } else {
    integer(p, 1, 4);
    if (q !== 0) throw new RangeError('Zero product target');
    expression = `x(x−${p})=0`;
    candidates = [0, p];
    lhs = (x) => x * (x - p);
  }
  const rows: CandidateEvidence[] = candidates.map((x) => {
    const left = lhs(x),
      right = rhs(x),
      domain = domainAt(x),
      sign = signAt(x);
    return {
      x,
      left,
      right,
      domain,
      sign,
      valid: domain && sign && left === right,
    };
  });
  return {
    kind,
    p,
    q,
    domain,
    expression,
    candidates,
    rows,
    lhs,
    rhs,
    domainAt,
    solutions: rows.filter((r) => r.valid).map((r) => r.x),
  };
}
