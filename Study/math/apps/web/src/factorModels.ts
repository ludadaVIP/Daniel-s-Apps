import {
  equalPolynomial,
  parsePolynomial,
  isCollectedPolynomial,
  polynomialText,
  polynomialValue,
  scaleP,
  type Polynomial,
} from './polynomialModels';
type FactorNode = {
  kind: 'atom' | 'sum' | 'product' | 'division' | 'power' | 'negative';
  raw: string;
  children: FactorNode[];
  power?: number;
};
const node = (
  kind: FactorNode['kind'],
  raw: string,
  children: FactorNode[] = [],
): FactorNode => ({ kind, raw, children });
const normalise = (raw: string) =>
  raw
    .replace(/\s/g, '')
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/[²³⁴]/g, (c) => `^${c === '²' ? 2 : c === '³' ? 3 : 4}`);
function factorTree(
  raw: string,
  variables: readonly string[],
): FactorNode | null {
  if (!parsePolynomial(raw, variables)) return null;
  const s = normalise(raw),
    tokens = s.match(/\d+(?:\.\d*)?|\.\d+|[a-z]|[()+*/^-]/g) ?? [];
  if (tokens.join('') !== s || tokens.length > 160) return null;
  let cursor = 0;
  const atom = (): FactorNode => {
    const token = tokens[cursor++];
    if (token === '(') {
      const child = sum();
      if (tokens[cursor++] !== ')') throw Error('Bracket');
      return { ...child, raw: `(${child.raw})` };
    }
    if (
      token &&
      (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token) || variables.includes(token))
    )
      return node('atom', token);
    throw Error('Atom');
  };
  const power = (): FactorNode => {
    const base = atom();
    if (tokens[cursor] !== '^') return base;
    cursor++;
    const exp = tokens[cursor++];
    if (!exp || !/^[1-4]$/.test(exp)) throw Error('Power');
    return {
      ...node('power', `(${base.raw})^${exp}`, [base]),
      power: Number(exp),
    };
  };
  const unary = (): FactorNode => {
    if (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const sign = tokens[cursor++],
        child = unary();
      return sign === '+'
        ? child
        : node('negative', `-(${child.raw})`, [child]);
    }
    return power();
  };
  const product = (): FactorNode => {
    let left = unary();
    while (cursor < tokens.length) {
      const next = tokens[cursor],
        implicit =
          next === '(' ||
          (!!next && variables.includes(next)) ||
          (tokens[cursor - 1] === ')' && !!next && /^[\d.]/.test(next));
      if (next !== '*' && next !== '/' && !implicit) break;
      const op = implicit ? '*' : tokens[cursor++],
        right = unary();
      if (op === '/') {
        const p = parsePolynomial(right.raw, variables);
        if (!p || p.size !== 1 || !p.has('') || p.get('')![0] === 0n)
          throw Error('Constant denominator required');
      }
      left = node(
        op === '/' ? 'division' : 'product',
        `(${left.raw})${op}(${right.raw})`,
        [left, right],
      );
    }
    return left;
  };
  const sum = (): FactorNode => {
    let left = product();
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const sign = tokens[cursor++],
        right = product();
      left = node('sum', `(${left.raw})${sign}(${right.raw})`, [left, right]);
    }
    return left;
  };
  try {
    const root = sum();
    return cursor === tokens.length ? root : null;
  } catch {
    return null;
  }
}
const gcd = (a: bigint, b: bigint): bigint =>
  b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
function primitiveKey(p: Polynomial): string | null {
  if (!p.size || [...p.values()].some((c) => c[1] !== 1n)) return null;
  const content = [...p.values()].reduce((a, c) => gcd(a, c[0]), 0n);
  if (content !== 1n) return null;
  const first = [...p].sort(
    ([a], [b]) => b.length - a.length || a.localeCompare(b),
  )[0]![1];
  const positive = first[0] < 0n ? scaleP(p, [-1n, 1n]) : p;
  return [...positive]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, c]) => `${k}:${c[0]}`)
    .join('|');
}
// Expand only the supplied outer product structure. Additive nodes remain visible
// factors, so an equivalent expanded sum cannot masquerade as a completed product.
export function visibleFactorKeys(
  raw: string,
  variables: readonly string[] = ['x'],
): string[] | null {
  const tree = factorTree(raw, variables);
  if (!tree) return null;
  const visit = (n: FactorNode): string[] => {
    if (n.kind === 'product')
      return [...visit(n.children[0]!), ...visit(n.children[1]!)];
    if (n.kind === 'division' || n.kind === 'negative')
      return visit(n.children[0]!);
    if (n.kind === 'power')
      return Array.from({ length: n.power! }, () =>
        visit(n.children[0]!),
      ).flat();
    const p = parsePolynomial(n.raw, variables)!;
    if (!p.size) throw Error('Zero factor');
    if (p.size === 1 && p.has('')) return [];
    if (!isCollectedPolynomial(n.raw, variables))
      throw Error('Finish collecting each factor');
    const key = primitiveKey(p);
    if (!key)
      throw Error('Extract integer content from each nonconstant factor');
    return [key];
  };
  try {
    const keys = visit(tree);
    return keys.length <= 16 ? keys.sort() : null;
  } catch {
    return null;
  }
}
export function checkFactorisation(
  raw: string,
  expected: string,
  variables: readonly string[] = ['x'],
) {
  if (!equalPolynomial(raw, expected, variables)) return false;
  const actual = visibleFactorKeys(raw, variables),
    target = visibleFactorKeys(expected, variables);
  return (
    actual !== null &&
    target !== null &&
    actual.length === target.length &&
    actual.every((k, i) => k === target[i])
  );
}
const whole = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Bounded integer');
  return n;
};
export type FactorTerm = { coefficient: number; key: string };
const numericGcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : numericGcd(b, a % b);
function termMap(terms: FactorTerm[]): Polynomial {
  if (
    terms.length < 2 ||
    terms.length > 4 ||
    new Set(terms.map((t) => t.key)).size !== terms.length
  )
    throw new RangeError('Two to four distinct monomial types');
  return new Map(
    terms.map((t) => {
      whole(t.coefficient, -100, 100);
      if (
        t.coefficient === 0 ||
        !/^[xy]{0,4}$/.test(t.key) ||
        [...t.key].sort().join('') !== t.key
      )
        throw new RangeError('Nonzero source monomial');
      return [t.key, [BigInt(t.coefficient), 1n] as const];
    }),
  );
}
export function commonFactor(terms: FactorTerm[]) {
  const source = termMap(terms),
    coefficient = terms.reduce((g, t) => numericGcd(g, t.coefficient), 0),
    letters = ['x', 'y']
      .map((v) =>
        v.repeat(
          Math.min(
            ...terms.map((t) => [...t.key].filter((c) => c === v).length),
          ),
        ),
      )
      .join('');
  const quotients = terms.map((t) => {
    let key = t.key;
    for (const c of letters) key = key.replace(c, '');
    return { coefficient: t.coefficient / coefficient, key };
  });
  const factor = polynomialText(
      new Map([[letters, [BigInt(coefficient), 1n]]]),
    ),
    remainder = polynomialText(
      new Map(
        quotients.map((t) => [t.key, [BigInt(t.coefficient), 1n] as const]),
      ),
    );
  return {
    terms,
    source: polynomialText(source),
    coefficient,
    key: letters,
    factor,
    remainder,
    quotients,
    result: `(${factor})(${remainder})`,
  };
}
export function inspectCommonFactor(terms: FactorTerm[], candidate: string) {
  const m = commonFactor(terms),
    p = parsePolynomial(candidate, ['x', 'y']);
  if (!p || p.size !== 1) return { valid: false, greatest: false };
  const [key, c] = [...p][0]!;
  if (c[1] !== 1n || c[0] === 0n || c[0] > 100n || c[0] < -100n)
    return { valid: false, greatest: false };
  const coefficient = Number(c[0]),
    valid = terms.every((t) => {
      let rest = t.key;
      for (const v of key) {
        const i = rest.indexOf(v);
        if (i < 0) return false;
        rest = rest.slice(0, i) + rest.slice(i + 1);
      }
      return t.coefficient % coefficient === 0;
    });
  return {
    valid,
    greatest: valid && Math.abs(coefficient) === m.coefficient && key === m.key,
  };
}
export const commonCases: FactorTerm[][] = [
  [
    { coefficient: 6, key: 'xx' },
    { coefficient: 12, key: 'x' },
  ],
  [
    { coefficient: -6, key: 'xx' },
    { coefficient: 9, key: 'x' },
  ],
  [
    { coefficient: 8, key: 'xxy' },
    { coefficient: -12, key: 'xyy' },
  ],
  [
    { coefficient: 6, key: 'xxx' },
    { coefficient: 9, key: 'xx' },
  ],
];
const linear = (a: number, b: number) =>
  polynomialText(
    new Map(
      [
        ['x', [BigInt(a), 1n]],
        ['', [BigInt(b), 1n]],
      ].filter(([, c]) => (c as readonly bigint[])[0] !== 0n) as [
        string,
        readonly [bigint, bigint],
      ][],
    ),
  );
export function differenceFactor(a: number, b: number) {
  whole(a, 1, 5);
  whole(b, 1, 6);
  const g = numericGcd(a, b),
    u = a / g,
    v = b / g;
  return {
    a,
    b,
    g,
    source: `${a * a}x^2-${b * b}`,
    result: `${g * g === 1 ? '' : g * g}(${linear(u, -v)})(${linear(u, v)})`,
  };
}
export function perfectSquareFactor(a: number, b: number, minus: boolean) {
  whole(a, 1, 5);
  whole(b, 1, 6);
  if (typeof minus !== 'boolean') throw new RangeError('Square sign');
  const g = numericGcd(a, b),
    u = a / g,
    v = (minus ? -b : b) / g;
  return {
    a,
    b,
    g,
    source: `${a * a}x^2+(${2 * a * (minus ? -b : b)})x+${b * b}`,
    result: `${g * g === 1 ? '' : g * g}(${linear(u, v)})^2`,
  };
}
export function quadraticSearch(p: number, q: number) {
  whole(p, -12, 12);
  whole(q, -36, 36);
  const pairs: { r: number; s: number; sum: number; hit: boolean }[] = [];
  if (q === 0) {
    const [r, s] = [0, p].sort((a, b) => a - b);
    pairs.push({ r: r!, s: s!, sum: p, hit: true });
  } else
    for (let r = -Math.abs(q); r <= Math.abs(q); r++) {
      if (!r || q % r) continue;
      const s = q / r;
      if (r > s) continue;
      pairs.push({ r, s, sum: r + s, hit: r + s === p });
    }
  const match = pairs.find((v) => v.hit),
    factor = match ? `(${linear(1, match.r)})(${linear(1, match.s)})` : null;
  return {
    p,
    q,
    source: polynomialText(parsePolynomial(`x^2+(${p})x+(${q})`)!),
    pairs,
    match,
    factor,
  };
}
export const checkingCases = [
  { source: 'x^2+5x+6', result: '(x+2)(x+3)', proposal: '(x+1)(x+6)' },
  { source: 'x^2-9', result: '(x-3)(x+3)', proposal: '(x-3)^2' },
  { source: '2x^2+4x', result: '2x(x+2)', proposal: '2(x^2+2x)' },
  { source: 'x^2-6x+9', result: '(x-3)^2', proposal: '(x+3)^2' },
];
export function inspectFactorProposal(
  source: string,
  expected: string,
  proposal: string,
) {
  const a = parsePolynomial(source),
    b = parsePolynomial(proposal);
  if (!a || !parsePolynomial(expected) || !equalPolynomial(source, expected))
    throw new RangeError('Consistent reference factorisation required');
  if (!b)
    return { status: 'invalid' as const, expanded: null, coefficients: [] };
  const keys = [...new Set([...a.keys(), ...b.keys()])].sort(
      (x, y) => y.length - x.length || x.localeCompare(y),
    ),
    same = equalPolynomial(source, proposal);
  return {
    status: same
      ? checkFactorisation(proposal, expected)
        ? ('complete' as const)
        : ('unfinished' as const)
      : ('different' as const),
    expanded: polynomialText(b),
    coefficients: keys.map((key) => ({
      key,
      source: a.get(key) ?? [0n, 1n],
      proposed: b.get(key) ?? [0n, 1n],
    })),
  };
}
export function factorProbe(source: string, proposal: string, x: number) {
  whole(x, -8, 8);
  return {
    source: polynomialValue(source, ['x'], { x: String(x) }),
    proposal: polynomialValue(proposal, ['x'], { x: String(x) }),
    x,
  };
}
