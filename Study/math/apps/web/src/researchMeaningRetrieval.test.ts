import { describe, it, expect } from 'vitest';
import { researchMeaningRetrieval } from './content/researchMeaningRetrieval';
import { dataEnquiryRecurrence } from './content/dataEnquiryRecurrence';
import { dataEnquiryRetrieval } from './content/dataEnquiryRetrieval';
import { inferenceMeaningRetrieval } from './content/inferenceMeaningRetrieval';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { fiveNumber, numericR, pairedData } from './researchModels';
import { addR, mulR, textR } from './algebraModels';
import { readRational as R } from './rationalModels';
const sets = Object.values(researchMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const raw = (s: string) => s.replace(/cm/g, '').replace(/−/g, '-');
const summary = (xs: string[]) => {
  const s = fiveNumber(xs);
  return [s.min, s.q1, s.median, s.q3, s.max, s.iqr, s.range].map(textR);
};
describe('J88 exact distribution and source evidence', () => {
  it('preserves eight old tasks and bridges, adds six cards and reuses two translation cards', () => {
    const refs = dataEnquiryRecurrence.flatMap((e) => e.targets);
    expect(refs).toHaveLength(24);
    expect(new Set(refs).size).toBe(16);
    expect(refs.filter((id) => id.includes('-DATA-ENQUIRY-'))).toHaveLength(10);
    expect(refs.filter((id) => id.includes('-RESEARCH-MEANING-'))).toHaveLength(
      12,
    );
    expect(
      refs.filter((id) => id.includes('-INFERENCE-MEANING-')),
    ).toHaveLength(2);
    for (const s of Object.values(dataEnquiryRetrieval)) {
      expect(s.questions).toHaveLength(4);
      expect(s.bridgeByQuestion[s.questions[2]!.id]).toBe('J88-L05');
    }
    for (const s of Object.values(inferenceMeaningRetrieval))
      expect(s.bridgeByQuestion[s.questions[1]!.id]).toBe('J76-L02');
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J88-L01',
        'J88-L03',
        'J88-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('PPDAC median correct all done', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en && c.zh)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('recomputes actual signed fractional E rows and closed-boundary memberships', () => {
    for (const i of [0, 1]) {
      const xs = Array.from({ length: 8 }, (_, j) =>
        raw(row(i, 1, `E${j + 1}`)),
      );
      expect(summary(xs)).toEqual(
        i === 0
          ? ['-2', '-1/4', '1/4', '1', '3', '5/4', '5']
          : ['-3', '-5/4', '-3/4', '0', '2', '5/4', '5'],
      );
      const s = fiveNumber(xs),
        bounds = [s.min, s.q1, s.median, s.q3, s.max].map(numericR);
      const groups = bounds
        .slice(0, 4)
        .map((a, j) =>
          xs.flatMap((x, k) =>
            numericR(R(x)) >= a && numericR(R(x)) <= bounds[j + 1]!
              ? [`E${k + 1}`]
              : [],
          ),
        );
      expect(groups).toEqual([
        ['E1', 'E2'],
        ['E3', 'E4'],
        ['E5', 'E6', 'E7'],
        ['E6', 'E7', 'E8'],
      ]);
      expect(groups.flat()).toHaveLength(10);
      expect(s.lower).toHaveLength(4);
      expect(s.upper).toHaveLength(4);
      expect(xs.map((x) => textR(R(x)))).not.toContain(textR(s.q1));
      expect(xs.map((x) => textR(R(x)))).not.toContain(textR(s.median));
    }
  });
  it('handles all-equal, two-record and single-record cases without deleting or inventing observations', () => {
    for (const i of [0, 1]) {
      const equal = Array(5).fill(i === 0 ? '0' : '-1') as string[];
      expect(summary(equal)).toEqual([
        ...Array(5).fill(i === 0 ? '0' : '-1'),
        '0',
        '0',
      ]);
      expect(summary(i === 0 ? ['-1', '1'] : ['-2', '0'])).toEqual(
        i === 0
          ? ['-1', '-1', '0', '1', '1', '2', '2']
          : ['-2', '-2', '-1', '0', '0', '2', '2'],
      );
      expect(() => fiveNumber([i === 0 ? '0' : '-1'])).toThrow(RangeError);
      expect(row(i, 1, 'D')).toContain('D1–D5');
      expect(row(i, 1, 'B')).toContain('B2=');
      expect(row(i, 1, 'S')).toContain('only one observation');
    }
  });
  it('recomputes translation invariance and positive fractional scale from original E, not display changes', () => {
    for (const i of [0, 1]) {
      const xs = Array.from({ length: 8 }, (_, j) =>
        R(raw(row(i, 1, `E${j + 1}`))),
      );
      const u = xs.map((x) => textR(addR(x, R(i === 0 ? '-3' : '2'))));
      expect(summary(u).slice(1, 4)).toEqual(
        i === 0 ? ['-13/4', '-11/4', '-2'] : ['3/4', '5/4', '2'],
      );
      expect(summary(u).slice(5)).toEqual(['5/4', '5']);
      const v = xs.map((x) => textR(mulR(x, R(i === 0 ? '2' : '3/2'))));
      expect(summary(v)).toEqual(
        i === 0
          ? ['-4', '-1/2', '1/2', '2', '6', '5/2', '10']
          : ['-9/2', '-15/8', '-9/8', '0', '3', '15/8', '15/2'],
      );
      expect(row(i, 1, 'U/V')).toContain(i === 0 ? 'x′=2x' : 'x′=3x/2');
    }
  });
  it('uses actual P/N pairs for local reversals, missingness and duplicate identities', () => {
    for (const i of [0, 1]) {
      const parse = (id: string) =>
        [...row(i, 2, id).matchAll(/[PN]\d+=\((\d+),(\d+|missing)\)/g)].map(
          (m) => ({
            id: m[0].split('=')[0]!,
            x: m[1]!,
            y: m[2] === 'missing' ? null : m[2]!,
          }),
        );
      const p = parse('P'),
        n = parse('N');
      expect(p).toHaveLength(6);
      expect(n).toHaveLength(5);
      const before = pairedData(p);
      expect(before.complete).toHaveLength(5);
      expect(p[2]!.y).toBe(String(2 + i));
      expect(p[1]!.y).toBe(String(3 + i));
      expect(n[2]!.y).toBe(String(4 + i));
      const after = pairedData([...p, { ...p[1]!, id: 'P7' }]);
      expect(after.complete).toHaveLength(6);
      expect(new Set(after.complete.map((p) => `${p.x},${p.y}`)).size).toBe(5);
      expect(p[5]!.y).toBeNull();
      const dx = Number(p[4]!.x) - Number(p[0]!.x),
        dy = Number(p[4]!.y) - Number(p[0]!.y);
      expect([dx, dy, dx / 2, dy / (dx / 2)]).toEqual([4, 4, 2, 2]);
      expect(sets[i]!.questions[1]!.stem.en).toContain(
        'one to two rounds per division',
      );
      expect(sets[i]!.questions[1]!.solution.en).toContain(
        'without changing original pairs,direction or strength',
      );
    }
  });
  it('recomputes within-weather flat means and pooled positive direction from all eight supplied points', () => {
    for (const i of [0, 1]) {
      const w = [...row(i, 2, 'W').matchAll(/([CW]\d)=\((\d+),(\d+)\)/g)].map(
        (m) => ({ id: m[1]!, x: Number(m[2]), y: Number(m[3]) }),
      );
      expect(w).toHaveLength(8);
      for (const [prefix, lo, hi, mean] of [
        ['C', 1 + i, 3 + i, 3 + i],
        ['W', 7 + i, 9 + i, 9 + i],
      ] as const) {
        const g = w.filter((p) => p.id.startsWith(prefix));
        for (const x of [lo, hi]) {
          const ys = g.filter((p) => p.x === x).map((p) => p.y);
          expect(ys).toHaveLength(2);
          expect(ys.reduce((a, b) => a + b, 0) / 2).toBe(mean);
        }
      }
      const mx = w.reduce((a, p) => a + p.x, 0) / 8,
        my = w.reduce((a, p) => a + p.y, 0) / 8;
      expect(
        w.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0),
      ).toBeGreaterThan(0);
    }
  });
  it('reconstructs correction and source-confirmed counterfactual independently from raw rows', () => {
    for (const i of [0, 1]) {
      const a = Array.from({ length: 6 }, (_, j) => row(i, 3, `A${j + 1}`));
      const b = Array.from({ length: 6 }, (_, j) =>
        raw(row(i, 3, `B${j + 1}`)),
      );
      expect(a[4]).toBe('missing');
      const original = a.filter((x) => x !== 'missing').map(raw);
      expect(original.at(-1)).toBe(i === 0 ? '26' : '37');
      const source = row(i, 3, 'SRC').match(/A6 source=(\d+)cm/)![1]!;
      const corrected = [...original.slice(0, -1), source];
      expect(summary(corrected)).toEqual(
        i === 0
          ? ['2', '5/2', '3', '5', '6', '5/2', '4']
          : ['3', '7/2', '4', '6', '7', '5/2', '4'],
      );
      expect(summary(b)).toEqual(
        i === 0
          ? ['1', '2', '5/2', '3', '5', '1', '4']
          : ['2', '3', '7/2', '4', '6', '1', '4'],
      );
      expect(summary(original)).toEqual(
        i === 0
          ? ['2', '5/2', '3', '15', '26', '25/2', '24']
          : ['3', '7/2', '4', '21', '37', '35/2', '34'],
      );
      expect(a[5]).toBe(i === 0 ? '26cm' : '37cm');
      expect(sets[i]!.questions[2]!.contextTable!.rows).toHaveLength(13);
    }
  });
});
