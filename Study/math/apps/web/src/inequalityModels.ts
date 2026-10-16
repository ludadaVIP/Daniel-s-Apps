import { addR, negR, mulR, divR, sameR, textR, parseAffine, evaluateAffine, affineText, type Rational, type Affine } from './algebraModels';
import { readRational } from './rationalModels';
export type InequalitySign = '<' | '<=' | '>' | '>=' | '=';
export type Inequality = { left: Affine; right: Affine; sign: InequalitySign };
export type RealInterval = { kind: 'empty' } | { kind: 'interval'; low: Rational | null; high: Rational | null; lowClosed: boolean; highClosed: boolean };
const Z: Rational = [0n, 1n];
export const compareR = (a: Rational, b: Rational) => { const n = a[0] * b[1] - b[0] * a[1]; return n < 0n ? -1 : n > 0n ? 1 : 0; };
export const reverseSign = (s: InequalitySign): InequalitySign => ({ '<': '>', '<=': '>=', '>': '<', '>=': '<=', '=': '=' } as const)[s];
export function relationHolds(a: Rational, s: InequalitySign, b: Rational) { const c = compareR(a, b); return s === '<' ? c < 0 : s === '<=' ? c <= 0 : s === '>' ? c > 0 : s === '>=' ? c >= 0 : c === 0; }
export const emptyInterval = (): RealInterval => ({ kind: 'empty' });
export function interval(low: Rational | null, high: Rational | null, lowClosed = false, highClosed = false): RealInterval {
  if (low && high && (compareR(low, high) > 0 || (sameR(low, high) && !(lowClosed && highClosed)))) return emptyInterval();
  return { kind: 'interval', low, high, lowClosed: !!low && lowClosed, highClosed: !!high && highClosed };
}
export const allReals = () => interval(null, null);
export function intersectIntervals(a: RealInterval, b: RealInterval): RealInterval {
  if (a.kind === 'empty' || b.kind === 'empty') return emptyInterval();
  const lc = !a.low ? -1 : !b.low ? 1 : compareR(a.low, b.low),
    hc = !a.high ? 1 : !b.high ? -1 : compareR(a.high, b.high);
  return interval(lc > 0 ? a.low : b.low, hc < 0 ? a.high : b.high, lc === 0 ? a.lowClosed && b.lowClosed : lc > 0 ? a.lowClosed : b.lowClosed, hc === 0 ? a.highClosed && b.highClosed : hc < 0 ? a.highClosed : b.highClosed);
}
export function intervalContains(s: RealInterval, x: Rational) {
  return s.kind === 'interval' && (!s.low || relationHolds(x, s.lowClosed ? '>=' : '>', s.low)) && (!s.high || relationHolds(x, s.highClosed ? '<=' : '<', s.high));
}
export function sameInterval(a: RealInterval, b: RealInterval) {
  if (a.kind === 'empty' || b.kind === 'empty') return a.kind === b.kind;
  return ((!a.low && !b.low) || (!!a.low && !!b.low && sameR(a.low, b.low))) && ((!a.high && !b.high) || (!!a.high && !!b.high && sameR(a.high, b.high))) && a.lowClosed === b.lowClosed && a.highClosed === b.highClosed;
}
const normalise = (s: string) => s.replace(/[−－]/g, '-').replace(/≤|≦/g, '<=').replace(/≥|≧/g, '>=').replace(/＜/g, '<').replace(/＞/g, '>').replace(/＝/g, '=').trim();
export function parseInequality(raw: string): Inequality | null {
  if (raw.length > 400) return null;
  const pieces = normalise(raw).split(/(<=|>=|<|>|=)/);
  if (pieces.length !== 3) return null;
  const left = parseAffine(pieces[0]!, 'x'), right = parseAffine(pieces[2]!, 'x');
  return left && right ? { left, right, sign: pieces[1] as InequalitySign } : null;
}
export const inequalityText = (e: Inequality) => `${affineText(e.left)} ${e.sign.replace('<=', '≤').replace('>=', '≥')} ${affineText(e.right)}`;
export function solveInequality(e: Inequality): RealInterval {
  const a = addR(e.left.a, negR(e.right.a)), b = addR(e.right.b, negR(e.left.b));
  if (!a[0]) return relationHolds(Z, e.sign, b) ? allReals() : emptyInterval();
  const edge = divR(b, a), s = a[0] < 0n ? reverseSign(e.sign) : e.sign;
  return s === '=' ? interval(edge, edge, true, true) : s === '<' || s === '<=' ? interval(null, edge, false, s === '<=') : interval(edge, null, s === '>=', false);
}
/** Restricted exact real sets: one interval, a point, all reals or empty.
 * Two inequalities mean AND; unions and variable divisors are deliberately rejected. */
export function parseRealSet(raw: string): RealInterval | null {
  if (raw.length > 600) return null;
  const s = normalise(raw).toLowerCase();
  if (['none', 'no solution', 'no solutions', 'empty', 'empty set', '无解', '空集', '∅', '{}'].includes(s)) return emptyInterval();
  if (['all', 'all reals', 'all real numbers', 'real numbers', 'r', 'ℝ', '任意实数', '所有实数', '全体实数'].includes(s)) return allReals();
  const bracket = s.match(/^([[(])\s*([^,]+)\s*,\s*([^,]+)\s*([)\]])$/);
  if (bracket) {
    const [, l, lo, hi, h] = bracket;
    try {
      const low = ['-inf', '-infinity', '-∞'].includes(lo!.trim()) ? null : readRational(lo!.trim()),
        high = ['inf', '+inf', 'infinity', '+infinity', '∞', '+∞'].includes(hi!.trim()) ? null : readRational(hi!.trim());
      if ((!low && l !== '(') || (!high && h !== ')')) return null;
      // Reversed or open equal endpoints are valid empty-set descriptions.
      return interval(low, high, l === '[', h === ']');
    } catch { return null; }
  }
  const point = s.match(/^\{([^,{}]+)\}$/);
  if (point) { try { const p = readRational(point[1]!); return interval(p, p, true, true); } catch { return null; } }
  const parts = s.replace(/；/g, ';').split(/;|\n|\band\b|且/).map(p => p.trim());
  if (!parts.length || parts.length > 2 || parts.some(p => !p)) return null;
  let result = allReals();
  for (const part of parts) {
    const chain = part.split(/(<=|>=|<|>|=)/);
    if (chain.length !== 3 && chain.length !== 5) return null;
    for (let i = 0; i + 2 < chain.length; i += 2) {
      const e = parseInequality(chain.slice(i, i + 3).join(''));
      if (!e) return null;
      result = intersectIntervals(result, solveInequality(e));
    }
  }
  return result;
}
export function checkRealSet(input: string, expected: string) { const a = parseRealSet(input), b = parseRealSet(expected); return !!a && !!b && sameInterval(a, b); }
export function realSetText(s: RealInterval) {
  if (s.kind === 'empty') return '∅';
  if (!s.low && !s.high) return 'ℝ';
  if (s.low && s.high && sameR(s.low, s.high)) return `x = ${textR(s.low)}`;
  if (!s.low) return `x ${s.highClosed ? '≤' : '<'} ${textR(s.high!)}`;
  if (!s.high) return `x ${s.lowClosed ? '≥' : '>'} ${textR(s.low)}`;
  return `${textR(s.low)} ${s.lowClosed ? '≤' : '<'} x ${s.highClosed ? '≤' : '<'} ${textR(s.high)}`;
}
export function auditInequality(e: Inequality, raw: string) {
  try { const x = readRational(raw), left = evaluateAffine(e.left, x), right = evaluateAffine(e.right, x); return { x: textR(x), left: textR(left), right: textR(right), pass: relationHolds(left, e.sign, right) }; } catch { return null; }
}
export type InequalityOperation = '+' | '−' | '×' | '÷';
export function transformInequality(e: Inequality, op: InequalityOperation, raw: string, side: 'both' | 'left', reverse: boolean) {
  if (!['+', '−', '×', '÷'].includes(op) || !['both', 'left'].includes(side)) throw new RangeError('Invalid inequality operation');
  const amount = parseAffine(raw, 'x');
  if (!amount) return { next: null, safeRule: false, preserves: false, reason: 'invalid' as const };
  if ((op === '×' || op === '÷') && amount.a[0]) return { next: null, safeRule: false, preserves: false, reason: 'unknown-sign' as const };
  if ((op === '×' || op === '÷') && !amount.b[0]) return { next: null, safeRule: false, preserves: false, reason: op === '÷' ? 'zero-divisor' as const : 'zero-factor' as const };
  const plus = (a: Affine, b: Affine): Affine => ({ a: addR(a.a, b.a), b: addR(a.b, b.b) }), scale = (a: Affine, k: Rational): Affine => ({ a: mulR(a.a, k), b: mulR(a.b, k) });
  const change = (a: Affine) => op === '+' ? plus(a, amount) : op === '−' ? plus(a, scale(amount, [-1n, 1n])) : scale(a, op === '×' ? amount.b : divR([1n, 1n], amount.b));
  const shouldReverse = (op === '×' || op === '÷') && amount.b[0] < 0n, next = { left: change(e.left), right: side === 'both' ? change(e.right) : e.right, sign: reverse ? reverseSign(e.sign) : e.sign };
  return { next, safeRule: side === 'both' && reverse === shouldReverse, preserves: sameInterval(solveInequality(e), solveInequality(next)), reason: side !== 'both' ? 'one-sided' as const : reverse !== shouldReverse ? 'direction' as const : 'reversible' as const };
}
export function inequalityTrace(e: Inequality) {
  const a = addR(e.left.a, negR(e.right.a)), c = addR(e.right.b, negR(e.left.b)), rows: { reason: 'collect' | 'gather-x' | 'gather-constants' | 'divide' | 'constant'; text: string }[] = [{ reason: 'collect', text: inequalityText(e) }];
  rows.push({ reason: 'gather-x', text: inequalityText({ left: { a, b: e.left.b }, right: { a: Z, b: e.right.b }, sign: e.sign }) });
  const gathered = { left: { a, b: Z }, right: { a: Z, b: c }, sign: e.sign };
  rows.push({ reason: 'gather-constants', text: inequalityText(gathered) });
  rows.push({ reason: !a[0] ? 'constant' : 'divide', text: realSetText(solveInequality(e)) });
  return rows;
}
export const relationInequalities = ['x<3', 'x<=3', 'x>=-2', '3>x'];
export const oneStepInequalities = ['x+3<=7', '3x>-6', 'x/2<=3', '-2x<6'];
export const multiStepInequalities = ['3(x-2)<=2x+1', '(x-1)/3>(x+2)/2', '2(x+1)<=2x+3', '2(x+1)<2x+1', '-3(x+2)>=1'];
export const intersectionInequalities = [['x>=-1', 'x<4'], ['x>3', 'x<=1'], ['x>=2', 'x<=2'], ['x>2', 'x<=2'], ['x>-2', 'x>=1'], ['x>=7', 'x<10']];
export function inequalityAt(source: string) { const e = parseInequality(source); if (!e) throw new RangeError('Invalid affine inequality'); return e; }
