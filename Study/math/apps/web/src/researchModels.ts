import {
  rational,
  addR,
  negR,
  divR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
export type QuartileConvention = 'exclude' | 'include';
const cmp = (a: Rational, b: Rational) => {
  const d = a[0] * b[1] - b[0] * a[1];
  return d < 0n ? -1 : d > 0n ? 1 : 0;
};
const mid = (v: Rational[]) =>
  v.length % 2
    ? v[Math.floor(v.length / 2)]!
    : divR(addR(v[v.length / 2 - 1]!, v[v.length / 2]!), [2n, 1n]);
export const numericR = (v: Rational) => Number(v[0]) / Number(v[1]);
export function fiveNumber(
  raw: readonly string[],
  convention: QuartileConvention = 'exclude',
) {
  if (
    raw.length < 2 ||
    raw.length > 40 ||
    !['exclude', 'include'].includes(convention)
  )
    throw new RangeError('Use two to forty values and a stated convention');
  const ordered = raw
      .map((s) => {
        const r = readRational(s);
        if (Math.abs(numericR(r)) > 1000 || !Number.isFinite(numericR(r)))
          throw new RangeError('Bounded observations');
        return r;
      })
      .sort(cmp),
    n = ordered.length,
    h = Math.floor(n / 2),
    extra = n % 2 && convention === 'include' ? 1 : 0,
    lower = ordered.slice(0, h + extra),
    upper = ordered.slice(n - h - extra),
    q1 = mid(lower),
    q3 = mid(upper),
    median = mid(ordered),
    min = ordered[0]!,
    max = ordered[n - 1]!;
  return {
    ordered,
    lower,
    upper,
    min,
    q1,
    median,
    q3,
    max,
    range: addR(max, negR(min)),
    iqr: addR(q3, negR(q1)),
    n,
    convention,
  };
}
export const quartileCases = [
  ['9', '2', '4', '4', '5', '7', '8', '1', '6'],
  ['8', '1', '4', '2', '6', '4', '7', '5'],
  ['4', '4', '4', '4', '4'],
  ['-2', '-1/2', '0', '1/2', '2'],
];
export function spreadGroups(extreme = false) {
  return [
    {
      name: 'A',
      values: ['4', '4', '5', '5', '5', '5', '6', '6', extreme ? '30' : '6'],
    },
    { name: 'B', values: ['0', '1', '2', '4', '5', '6', '8', '9', '10'] },
  ];
}
export type Association =
  'positive' | 'negative' | 'no-clear-linear' | 'curved';
export const associationAliases: Record<Association, string[]> = {
  positive: ['positive', '正相关', '正向关联', '正关联'],
  negative: ['negative', '负相关', '负向关联', '负关联'],
  'no-clear-linear': [
    'no-clear-linear',
    'no clear linear association',
    '无明显线性关联',
    '无明显线性相关',
  ],
  curved: ['curved', '非线性', '弯曲关联', '曲线关联'],
};
export function checkAssociation(raw: string, expected: Association) {
  return !!associationAliases[expected]?.includes(
    raw.trim().toLowerCase().replace(/\s+/g, ' '),
  );
}
export type PairedRecord = {
  id: string;
  x: string;
  y: string | null;
  group?: string;
};
export const pairedCases: {
  id: string;
  pattern: Association;
  records: PairedRecord[];
}[] = [
  {
    id: 'rising',
    pattern: 'positive',
    records: [2, 3, 2, 5, 5, null].map((y, i) => ({
      id: `P${i + 1}`,
      x: String(i + 1),
      y: y === null ? null : String(y),
    })),
  },
  {
    id: 'falling',
    pattern: 'negative',
    records: [8, 6, 7, 3, 2, null].map((y, i) => ({
      id: `N${i + 1}`,
      x: String(i + 1),
      y: y === null ? null : String(y),
    })),
  },
  {
    id: 'cloud',
    pattern: 'no-clear-linear',
    records: [
      [1, 2],
      [1, 6],
      [3, 2],
      [3, 6],
      [5, 2],
      [5, 6],
    ].map(([x, y], i) => ({ id: `C${i + 1}`, x: String(x), y: String(y) })),
  },
  {
    id: 'curve',
    pattern: 'curved',
    records: [9, 4, 1, 0, 1, 4, 9].map((y, i) => ({
      id: `U${i + 1}`,
      x: String(i + 1),
      y: String(y),
    })),
  },
];
export function pairedData(records: readonly PairedRecord[]) {
  if (
    !records.length ||
    records.length > 40 ||
    new Set(records.map((r) => r.id)).size !== records.length ||
    records.some((r) => !r.id)
  )
    throw new RangeError('Keep distinct record identities');
  const rows = records.map((r) => ({
    ...r,
    px: numericR(readRational(r.x)),
    py: r.y === null ? null : numericR(readRational(r.y)),
  }));
  if (
    rows.some(
      (r) =>
        !Number.isFinite(r.px) ||
        Math.abs(r.px) > 1000 ||
        (r.py !== null && (!Number.isFinite(r.py) || Math.abs(r.py) > 1000)),
    )
  )
    throw new RangeError('Bounded pair coordinates');
  return {
    rows,
    complete: rows.filter((r): r is typeof r & { py: number } => r.py !== null),
    missing: rows.filter((r) => r.py === null).length,
    total: rows.length,
  };
}
// Constructed observational data: positive association overall, zero covariance
// inside each weather group. This is a counterexample to a causal inference.
export const weatherRecords: PairedRecord[] = [
  ...[
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ].map(([x, y], i) => ({
    id: `C${i + 1}`,
    x: String(x),
    y: String(y),
    group: 'cool',
  })),
  ...[
    [7, 7],
    [7, 9],
    [9, 7],
    [9, 9],
  ].map(([x, y], i) => ({
    id: `W${i + 1}`,
    x: String(x),
    y: String(y),
    group: 'warm',
  })),
];
export type TrialRecord = {
  id: string;
  group: 'A' | 'B';
  value: string | null;
};
export function investigationRecords(corrected = false): TrialRecord[] {
  return [
    ...['4', '5', '5', '6', null, corrected ? '7' : '27'].map((value, i) => ({
      id: `A${i + 1}`,
      group: 'A' as const,
      value,
    })),
    ...['3', '4', '4', '5', '5', '6'].map((value, i) => ({
      id: `B${i + 1}`,
      group: 'B' as const,
      value,
    })),
  ];
}
export function investigationSummary(corrected = false) {
  const rows = investigationRecords(corrected);
  return {
    rows,
    missing: 1,
    groups: (['A', 'B'] as const).map((name) => {
      const group = rows.filter((r) => r.group === name),
        values = group.flatMap((r) => (r.value === null ? [] : [r.value]));
      return {
        name,
        invited: group.length,
        missing: group.length - values.length,
        values,
        summary: fiveNumber(values),
      };
    }),
  };
}
export type InvestigationState = {
  scope: 'records' | 'all';
  missing: 'retain' | 'zero';
  corrected: boolean;
  medianChecked: boolean;
};
export function investigationGate(stage: number, s: InvestigationState) {
  if (!Number.isInteger(stage) || stage < 0 || stage > 4)
    throw new RangeError('PPDAC stage');
  return stage === 0
    ? s.scope === 'records'
    : stage === 1
      ? s.missing === 'retain'
      : stage === 2
        ? s.corrected
        : stage === 3
          ? s.medianChecked
          : false;
}
export function investigationReport(draft: string, corrected: boolean) {
  if (!corrected || !draft.trim() || draft.length > 6000)
    throw new RangeError('Correct the source and write your own conclusion');
  const m = investigationSummary(true);
  return [
    'J88 · 虚构数据调查 / Fictional-data investigation',
    '问题 / Question: 比较本批 A/B 折法的下滑距离（cm）。 Compare recorded card-slide distances (cm) for folds A and B.',
    '计划 / Plan: 不同桌面、未随机分配，只描述本批。 Prepared observations from different desks; no random assignment. Results describe these records, not all folds.',
    '数据 / Data: 共12行，A5仍缺失；据原卡把A6由27纠正7，未删记录。 12 records; A5 missing retained, not zero. A6 corrected 27→7 against source card; no record deleted.',
    ...m.rows.map((r) => `${r.id}\t${r.group}\t${r.value ?? 'missing'}`),
    ...m.groups.map(
      (g) =>
        `${g.name}: n=${g.summary.n}; missing=${g.missing}; min,Q1,median,Q3,max=${[g.summary.min, g.summary.q1, g.summary.median, g.summary.q3, g.summary.max].map(textR).join(',')}; IQR=${textR(g.summary.iqr)}; range=${textR(g.summary.range)}`,
    ),
    '约定 / Convention: 奇数排除中位数；最小–最大须。 odd median excluded; min–max whiskers.',
    '我的结论草稿 / My conclusion draft (not automatically reviewed):',
    draft.trim(),
    '家长检查 / Parent check: 数值依据、有效条数、缺失、桌面混杂、范围与不确定性。 numerical evidence, n=5/6, missing record, desk confounding, scope and uncertainty.',
  ].join('\n');
}
export const translateData = (raw: string[], shift: number) =>
  raw.map((v) => textR(addR(readRational(v), rational(BigInt(shift)))));
