import { parseAffine, textR } from './algebraModels';
function atom(raw: string) {
  const s = raw
    .trim()
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/／/g, '/');
  if (!/^(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)|[+-]?\d+\s*\/\s*\d+)$/.test(s))
    return null;
  const value = parseAffine(s);
  return value && !value.a[0] ? textR(value.b) : null;
}
export function parseNumberSet(raw: string): string[] | null {
  if (raw.length > 180) return null;
  const s = raw.trim();
  if (/^(?:no\s+modes?|none|无众数|没有众数|无|∅|\{\})$/i.test(s)) return [];
  const parts = s.split(/[,，、;；]/).map(atom);
  if (
    !parts.length ||
    parts.length > 20 ||
    parts.some((v) => v === null) ||
    new Set(parts).size !== parts.length
  )
    return null;
  return (parts as string[]).sort();
}
export function checkNumberSet(input: string, expected: string[]) {
  const actual = parseNumberSet(input),
    wanted = expected.map(atom);
  if (
    !actual ||
    wanted.some((v) => v === null) ||
    new Set(wanted).size !== wanted.length
  )
    return false;
  return actual.join('|') === (wanted as string[]).sort().join('|');
}
