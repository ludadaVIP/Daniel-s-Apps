import { describe, it, expect } from 'vitest';
import { dataMeaningRetrieval } from './content/dataMeaningRetrieval';
import { geometryDataRecurrence } from './content/geometryDataRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { lessons, curriculum, unitChecks } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  frequencyTable,
  meanSummary,
  shareOne,
  timeSeries,
  barScale,
} from './dataModels';
import { isDataLab } from './DataLabs';
import { isDataModellingLab } from './DataModellingLabs';
const sets = Object.values(dataMeaningRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((row) => row.map((c) => c.en));
const data = (s: (typeof sets)[number], i: number) =>
  Object.fromEntries(rows(s, i).map((row) => [row[0]!, row[2]!]));
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const fraction = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const list = (v: string) => v.split(',').map((s) => Number(s.trim()));
const total = (a: number[]) => a.reduce((s, v) => s + v, 0);
describe('P57 detailed data meaning and original evidence', () => {
  it('registers ten bilingual human tasks with exact later bridges while retaining default groups and formal identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id)),
      ids = new Set<string>();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P57'));
      expect(s.questions).toHaveLength(5);
      expect(maintenanceForUnit(s.unit)[0]!.id).not.toBe(s.id);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('zero missing same because', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P57-L0' + (i + 1));
        expect(q.contextTable!.rows).not.toHaveLength(0);
      }
    }
    expect(ids.size).toBe(10);
  });
  it('audits actual ID-linked raw/current entries, correction versus addition and unentered versus genuinely missing', () => {
    const cats = ['Walk', 'Bike', 'Bus', 'Other stated method'];
    for (const s of sets) {
      const q = s.questions[0]!,
        original = structuredClone(q.contextTable),
        r = rows(s, 0);
      expect(new Set(r.map((v) => v[0])).size).toBe(8);
      const count = (v: string[], c: string) => v.filter((x) => x === c).length;
      const raw = r.map((row) => row[1]!),
        entered = r.slice(0, 5).map((row) => row[2]!);
      expect(r.slice(5).every((row) => row[2] === 'Unentered')).toBe(true);
      expect(
        entered.map((v, i) => (v !== raw[i] ? r[i]![0] : null)).filter(Boolean),
      ).toEqual(['R3']);
      const stats = (v: string[]) => ({
        walk: count(v, 'Walk'),
        bike: count(v, 'Bike'),
        bus: count(v, 'Bus'),
        other: count(v, 'Other stated method'),
      });
      const before = stats(entered),
        after = stats(raw.slice(0, 5)),
        complete = stats(raw);
      for (const [label, c] of [
        ['First-five BEFORE', before],
        ['AFTER', after],
        ['COMPLETE', complete],
      ] as const)
        expect(q.solution.en).toContain(
          `${label}:walk=${c.walk},bike=${c.bike},bus=${c.bus},other=${c.other}`,
        );
      const model = frequencyTable(
        cats,
        raw.map((v) => (v === 'No response' ? null : v)),
      );
      expect(model.recorded).toBe(7);
      expect(model.missing).toBe(1);
      expect(model.invited).toBe(8);
      expect(model.rows.map((v) => v.count)).toEqual([
        complete.walk,
        complete.bike,
        complete.bus,
        complete.other,
      ]);
      expect(q.solution.en).toContain(
        `8−1−(${complete.walk}+${complete.bus}+0)=${complete.bike}`,
      );
      expect(8 - 1 - complete.walk - complete.bus - complete.other).toBe(
        complete.bike,
      );
      expect(complete.other).toBe(0);
      expect(total(Object.values(before))).toBe(4);
      expect(total(Object.values(after))).toBe(4);
      expect(q.solution.en).toContain(
        `After two NEW walkers:walk=${complete.walk + 2},answered=9,missing=1,invited=10`,
      );
      expect(q.contextTable).toEqual(original);
      expect(q.solution.en).toContain(
        'Distinct equal-valued IDs each count once',
      );
      expect(q.solution.en).toContain('TODAY');
      expect(q.solution.en).toContain('school-wide FAVOURITE');
    }
  });
  it('reconstructs total-preserving moves, exact means, approximations, independent missing records and distinct inverse distributions', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        d = data(s, 1),
        a = list(d.A!),
        b = list(d.B!),
        c = list(d.C!),
        big = list(d.D!);
      const A = total(a),
        B = total(b),
        D = total(big),
        mA = A / a.length,
        mD = D / big.length;
      expect(q.solution.en).toContain(`A:total=${A},count=3,mean=${mA} cards`);
      expect(a.includes(mA)).toBe(false);
      expect(a).toContain(0);
      expect(q.solution.en).toContain(`Omitting zero gives ${fraction(A, 2)}`);
      let moved = [...a],
        steps = 0;
      while (Math.max(...moved) - Math.min(...moved) > 1) {
        const before = [...moved],
          next = shareOne(moved);
        expect(moved).toEqual(before);
        expect(total(next)).toBe(A);
        expect(next).toHaveLength(3);
        const changes = next.map((v, i) => v - moved[i]!);
        expect(changes.filter((v) => v === 1)).toHaveLength(1);
        expect(changes.filter((v) => v === -1)).toHaveLength(1);
        moved = next;
        expect(++steps).toBeLessThan(100);
      }
      expect(moved).toEqual([mA, mA, mA]);
      expect(meanSummary(a).mean).toBe(mA);
      expect(q.solution.en).toContain(
        `B:total=${B},mean=${fraction(B, 3)} cards`,
      );
      const exact = meanSummary(b);
      expect(fraction(exact.n, exact.d)).toBe(fraction(B, 3));
      const [whole, dec] = d.B_P!.split('.'),
        approxN = Number(whole) * 100 + Number(dec),
        restored = approxN * 3;
      expect(restored).not.toBe(B * 100);
      expect(Math.abs(restored - B * 100)).toBe(1);
      expect(q.solution.en).toContain(`times three is ${restored / 100}`);
      expect(c).toEqual([0, 0, 0]);
      expect(meanSummary(c)).toMatchObject({ total: 0, count: 3, n: 0, d: 1 });
      expect(() => meanSummary([])).toThrow();
      const missing = d
          .M!.split(',')
          .map((v) => (v.trim() === '—' ? null : Number(v.trim()))),
        observed = missing.filter((v) => v !== null);
      expect(observed).toHaveLength(2);
      expect(q.solution.en).toContain(
        `observed-only mean=${fraction(total(observed), observed.length)}`,
      );
      expect(q.solution.en).toContain('FULL three-record mean is unknown');
      expect(Number(d.K_N) * Number(d.K_M)).toBe(D);
      const uniform = Array.from({ length: Number(d.K_N) }, () =>
        Number(d.K_M),
      );
      expect(total(uniform)).toBe(D);
      expect(uniform).not.toEqual(big);
      expect(meanSummary(big).mean).toBe(mD);
      expect(big.filter((v) => v === big[0])).toHaveLength(3);
      expect(q.solution.en).toContain(
        `mean=${mD} need not describe the majority`,
      );
    }
  });
  it('plots actual paired records on two scales, retains signed changes and isolates missing/zero branches from originals', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        points = rows(s, 2).map((row) => ({
          time: Number(row[1]),
          value: Number(row[2]),
        })),
        original = structuredClone(points);
      const gaps = points.slice(1).map((p, i) => p.time - points[i]!.time),
        changes = points.slice(1).map((p, i) => p.value - points[i]!.value);
      expect(q.solution.en).toContain(`time gaps=${gaps.join(':')} hours`);
      expect(q.solution.en).toContain(
        `Signed changes=${changes.map((v) => (v > 0 ? '+' + v : v)).join(',')}°C`,
      );
      expect(-changes[1]!).toBe(3);
      expect(total(changes)).toBe(points[3]!.value - points[0]!.value);
      const small = timeSeries(points, 20),
        large = timeSeries(points, 40),
        start = points[0]!.time,
        end = points[3]!.time;
      for (const [i, p] of points.entries()) {
        expect(small.points[i]!.x).toBeCloseTo(
          60 + (420 * (p.time - start)) / (end - start),
          10,
        );
        expect(small.points[i]!.value).toBe(p.value);
        expect(large.points[i]!.value).toBe(p.value);
        expect(260 - large.points[i]!.y!).toBeCloseTo(
          (260 - small.points[i]!.y!) / 2,
          10,
        );
      }
      const missing = points.map((p, i) => ({
          ...p,
          value: i === 2 ? null : p.value,
        })),
        zero = points.map((p, i) => ({ ...p, value: i === 2 ? 0 : p.value }));
      const M = timeSeries(missing, 20),
        Z = timeSeries(zero, 20);
      expect(M.points.filter((p) => p.y !== null)).toHaveLength(3);
      expect(M.segments).toHaveLength(1);
      expect(Z.points.filter((p) => p.y !== null)).toHaveLength(4);
      expect(Z.segments).toHaveLength(3);
      expect(Z.points[2]!.y).toBe(260);
      for (const possible of [0, 20]) {
        const candidate = points.map((p, i) => ({
          ...p,
          value: i === 2 ? possible : p.value,
        }));
        expect(candidate.filter((_, i) => i !== 2)).toEqual(
          points.filter((_, i) => i !== 2),
        );
      }
      expect(q.solution.en).toContain('not observed replacements');
      expect(q.solution.en).toContain('ESTIMATE label');
      expect(points).toEqual(original);
      expect(q.solution.en).toContain(
        `${points[3]!.value - 2}°C is compatible with all past points`,
      );
    }
  });
  it('checks actual baseline amounts versus original ratios and constructs equal-visit but different-distinct-person counterexamples', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        d = data(s, 3),
        n = (k: string) => Number(d[k]),
        values = [n('A'), n('B')],
        baseline = n('Z'),
        maximum = n('MAX');
      const rawRatio = fraction(values[1]!, values[0]!),
        above = values.map((v) => v - baseline);
      expect(above).toEqual([2, 8]);
      expect(above[1]! / above[0]!).toBe(4);
      expect(values[1]! / values[0]!).not.toBe(4);
      expect(q.solution.en).toContain(`original ratio=${rawRatio}, not four`);
      expect(q.solution.en).toContain(
        `difference=${values[1]}−${values[0]}=6 people`,
      );
      for (const origin of [0, baseline]) {
        const plotted = barScale(values, origin, maximum);
        for (const [i, p] of plotted.entries()) {
          expect(p.value).toBe(values[i]);
          expect(p.height).toBeCloseTo(
            (210 * (values[i]! - origin)) / (maximum - origin),
            10,
          );
        }
      }
      const first = Array.from({ length: values[0]! }, (_, i) => i),
        returning = Array.from({ length: values[1]! }, (_, i) => i),
        different = Array.from(
          { length: values[1]! },
          (_, i) => values[0]! + i,
        );
      expect(new Set([...first, ...returning]).size).toBe(values[1]);
      expect(new Set([...first, ...different]).size).toBe(total(values));
      expect(q.solution.en).toContain(`sum=${total(values)} person-visits`);
      expect(q.solution.en).toContain(
        `S:missing=${d.S_I}−${d.S_R}=${n('S_I') - n('S_R')}`,
      );
      expect(q.solution.en).toContain(
        'do not even reveal RESPONDENTS’ opinions',
      );
    }
  });
  it('independently enumerates least sufficient packs, threshold payments, exact budgets and a separate stock branch from the actual record table', () => {
    const least = (need: number, pack: number) =>
      Array.from({ length: 21 }, (_, i) => i).find((i) => i * pack >= need)!;
    for (const s of sets) {
      const q = s.questions[4]!,
        d = data(s, 4),
        n = (k: string) => Number(d[k]);
      const plans = list(d.T!).map((servings) => {
        const f = (n('F') * servings) / n('N'),
          m = (n('M') * servings) / n('N'),
          nf = least(f, n('F_Q')),
          nm = least(m, n('M_Q')),
          cost = nf * n('F_C') + nm * n('M_C');
        expect(nf * n('F_Q')).toBeGreaterThanOrEqual(f);
        expect((nf - 1) * n('F_Q')).toBeLessThan(f);
        expect(nm * n('M_Q')).toBeGreaterThanOrEqual(m);
        expect((nm - 1) * n('M_Q')).toBeLessThan(m);
        const lf = nf * n('F_Q') - f,
          lm = nm * n('M_Q') - m,
          budgetDifference = n('B') - cost;
        expect(q.solution.en).toContain(
          `n=${servings}:need=${f}g/${m}mL,packs=${nf}/${nm},paid=${cost}c,left=${lf}g/${lm}mL,budgetDifference=${budgetDifference}c`,
        );
        return { servings, f, m, nf, nm, cost, lf, lm };
      });
      expect(plans[0]!.cost).toBe(plans[1]!.cost);
      expect(plans[2]!.cost).toBeGreaterThan(plans[1]!.cost);
      expect(plans[0]!.cost).toBe(n('B'));
      expect(plans[1]!.cost).toBe(n('B'));
      const p = plans[2]!;
      expect(p.cost - n('B')).toBe(n('F_C'));
      expect(q.solution.en).toContain(`POSITIVE shortfall=${p.cost - n('B')}c`);
      expect(q.solution.en).toContain(`money left=${n('H') - p.cost}c`);
      const neededF = p.f - n('S_F'),
        neededM = p.m - n('S_M'),
        stockF = least(neededF, n('F_Q')),
        stockM = least(neededM, n('M_Q'));
      expect([stockF, stockM]).toEqual([1, 1]);
      expect(stockF * n('F_C') + stockM * n('M_C')).toBe(n('B'));
      expect(stockF * n('F_Q') + n('S_F') - p.f).toBe(0);
      expect(stockM * n('M_Q') + n('S_M') - p.m).toBe(p.lm);
      expect(q.solution.en).toContain(
        `remaining ${neededF}g as ONE flour pack`,
      );
      expect(q.solution.en).toContain(
        'Do not import stock into zero-stock cases',
      );
    }
  });
  it('keeps exact five-model families disjoint so H08 cannot intercept any P57 workshop or hook', () => {
    expect(lessons.filter((l) => isDataLab(l.lab)).map((l) => l.id)).toEqual(
      [1, 2, 3, 4, 5].map((n) => `P57-L0${n}`),
    );
    expect(
      lessons.filter((l) => isDataModellingLab(l.lab)).map((l) => l.id),
    ).toEqual([1, 2, 3, 4, 5].map((n) => `H08-L0${n}`));
    expect(
      lessons.some((l) => isDataLab(l.lab) && isDataModellingLab(l.lab)),
    ).toBe(false);
  });
  it('preserves twenty-one original references and appends ten exact later tasks without changing P56 evidence', () => {
    const es = geometryDataRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P57-'),
    );
    const original = [
      [
        'J76-L02-Q5',
        'J76-L01-X',
        'J76-L01-Q6',
        'J88-L05-Q2',
        'J88-L05-Q5',
        'J88-L05-Q6',
        'H08-L01-X',
      ],
      [
        'P67-L02-G',
        'P67-L02-Q4',
        'P67-L02-Q6',
        'J76-L03-G',
        'J76-L03-Q3',
        'J76-L03-Q6',
      ],
      ['P66-MAINT-MEASURE-Q7', 'J87-MAINT-MEASURE-Q7'],
      ['P68-L04-Q6', 'J75-L05-Q6', 'J88-L01-Q6', 'J88-L02-Q6'],
      ['P66-MAINT-MEASURE-Q6', 'J87-MAINT-MEASURE-Q6'],
    ];
    expect(es).toHaveLength(5);
    expect(es.reduce((n, e) => n + e.targets.length, 0)).toBe(31);
    expect(new Set(es.flatMap((e) => e.targets)).size).toBe(31);
    for (const [i, e] of es.entries()) {
      expect(e.targets.filter((t) => !t.includes('DATA-MEANING'))).toEqual(
        original[i],
      );
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        expect(
          recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === q.id)!.href,
        ).toBe(maintenanceHref(s, q.id));
      }
    }
    expect(
      geometryDataRecurrence
        .filter((e) => e.sourceLesson.startsWith('P56-'))
        .flatMap((e) => e.targets)
        .some((id) => id.includes('DATA-MEANING')),
    ).toBe(false);
  });
});
