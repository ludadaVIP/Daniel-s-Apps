import { describe, it, expect } from 'vitest';
import { probabilityMeaningRetrieval } from './content/probabilityMeaningRetrieval';
import { probabilityProcessRetrieval } from './content/probabilityProcessRetrieval';
import { countingStructureRetrieval } from './content/countingStructureRetrieval';
import { probabilityProcessRecurrence } from './content/probabilityProcessRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum, lessonById } from './content';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { numberedPairs, jointModel, simulatePairs } from './probabilityModels';
import { treeEvent } from './inferenceModels';
import { rational, textR } from './algebraModels';

const sets = Object.values(probabilityMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const frac = (n: number, d: number) => textR(rational(BigInt(n), BigInt(d)));
const hit = (pair: string) => pair.split('-')[0]![0] !== pair.split('-')[1]![0];
const records = (i: number, seed: number) =>
  sets[i]!.questions[2]!.contextTable!.rows.filter((r) =>
    r[0]!.en.startsWith(seed + '-'),
  ).map((r) => r[2]!.en);

describe('J97 event boundaries, response scope and preserved seeded records', () => {
  it('transposes the full table while following original event labels rather than switching the conditioning event', () => {
    for (let i = 0; i < 2; i++) {
      const cells = row(i, 1, 'V').split('=')[1]!.split(',').map(Number);
      const m = jointModel(cells),
        transposed = jointModel([cells[0]!, cells[2]!, cells[1]!, cells[3]!]);
      expect(transposed.pA).toEqual(m.pB);
      expect(transposed.pB).toEqual(m.pA);
      expect(transposed.pAB).toEqual(m.pAB);
      expect(transposed.independent).toBe(m.independent);
      expect(textR(m.pA)).toBe(i === 0 ? '1/3' : '1/4');
      expect(textR(m.pB)).toBe(i === 0 ? '1/2' : '3/5');
      expect(sets[i]!.questions[0]!.stem.en).toContain(
        'preserving original A/B identities',
      );
    }
  });
  it('preserves all eleven old references and primary bridges while sharing six new cards and four effective old cards', () => {
    const refs = probabilityProcessRecurrence.flatMap((e) => e.targets);
    expect(refs).toHaveLength(25);
    expect(new Set(refs).size).toBe(19);
    expect(
      refs.filter((id) => id.includes('-PROBABILITY-MEANING-')),
    ).toHaveLength(10);
    expect(
      refs.filter((id) => id.includes('-COUNTING-STRUCTURE-')),
    ).toHaveLength(4);
    expect(
      refs.filter(
        (id) =>
          !id.includes('-PROBABILITY-MEANING-') &&
          !id.includes('-COUNTING-STRUCTURE-'),
      ),
    ).toHaveLength(11);
    for (const s of Object.values(probabilityProcessRetrieval)) {
      expect(s.questions).toHaveLength(3);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J97-L02',
        'J97-L05',
        'J97-L01',
      ]);
    }
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of probabilityProcessRecurrence)
      for (const id of e.targets) {
        const s = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        );
        const unit =
          s?.unit ?? lessonById(id.replace(/-(?:Q\d+|X|G)$/, ''))!.unit!;
        expect(order.indexOf(unit)).toBeGreaterThan(order.indexOf('J97'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    expect(lessons).toHaveLength(358);
  });
  it('keeps bilingual original tables, separate keys and fully human-reviewed arguments', () => {
    for (const s of sets) {
      expect(Object.values(maintenanceSets)).toContain(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J97-L03',
        'J97-L04',
        'J97-L05',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('independent probability all good', q.answer),
        ).toBeNull();
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.zh && c.en)),
        ).toBe(true);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
  it('separates positive disjointness, reachable zero branches and impossible first conditions', () => {
    for (let i = 0; i < 2; i++) {
      const n = Number(row(i, 1, 'T').match(/B1\.\.B(\d)/)![1]) + 1;
      const die = Number(row(i, 1, 'M').match(/1\.\.(\d+)/)![1]);
      const values = Array.from({ length: die }, (_, k) => k + 1);
      expect(values.filter((x) => x % 2 === 0)).toHaveLength(die / 2);
      expect(jointModel([0, die / 2, die / 2, 0]).independent).toBe(false);
      const m = numberedPairs(1, n - 1, false);
      const rr = m.leaves.find((l) => l.code === 'RR')!;
      expect(textR(rr.firstProbability)).toBe('1/' + n);
      expect(textR(rr.conditionalProbability)).toBe('0');
      expect(textR(rr.probability)).toBe('0');
      expect(textR(m.leaves.find((l) => l.code === 'BB')!.probability)).toBe(
        i === 0 ? '1/2' : '3/5',
      );
      for (const first of ['R', 'B']) {
        const outgoing = m.leaves
          .filter((l) => l.first === first)
          .map(
            (l) =>
              Number(l.conditionalProbability[0]) /
              Number(l.conditionalProbability[1]),
          );
        expect(outgoing.reduce((a, b) => a + b, 0)).toBe(1);
      }
      const zeroBlue = Number(row(i, 1, 'Z').match(/B1\.\.B(\d)/)![1]);
      expect(
        numberedPairs(0, zeroBlue, false).leaves.some((l) => l.first === 'R'),
      ).toBe(false);
      expect(() => rational(0n, 0n)).toThrow();
      expect(sets[i]!.questions[0]!.solution.en).toContain(
        'ordinary conditional is undefined',
      );
    }
  });
  it('counts nontrivial independent events inside a no-replacement space and audits complements by all three disjoint paths', () => {
    for (let i = 0; i < 2; i++) {
      const e = row(i, 1, 'E'),
        ds = e
          .match(/D=\{(.+)\}/)![1]!
          .split(';')
          .map((x) => x.replace('→', '-'));
      const b = Number(row(i, 1, 'T').match(/B1\.\.B(\d)/)![1]),
        m = numberedPairs(1, b, false);
      const a = m.labelled.filter((p) => p.id.startsWith('R1-')),
        d = m.labelled.filter((p) => ds.includes(p.id)),
        ab = a.filter((p) => ds.includes(p.id));
      expect(d).toHaveLength(ds.length);
      expect(ab).toHaveLength(1);
      expect(ab.length * m.labelledTotal).toBe(a.length * d.length);
      expect(a.length).toBeGreaterThan(0);
      expect(d.length).toBeLessThan(m.labelledTotal);
      const red = Number(row(i, 1, 'C').match(/R1\.\.R(\d)/)![1]);
      const c = numberedPairs(red, 2, false),
        noBlue = treeEvent(c, 'two-red'),
        atleast = treeEvent(c, 'at-least-blue');
      expect(noBlue.labelledHits + atleast.labelledHits).toBe(c.labelledTotal);
      expect(textR(atleast.probability)).toBe(i === 0 ? '7/10' : '5/6');
      expect(atleast.paths).toEqual(['RB', 'BR', 'BB']);
      expect(textR(atleast.probability)).not.toBe(
        textR(treeEvent(c, 'different').probability),
      );
    }
  });
  it('distinguishes target, frame census, response rate, respondent proportion and an undefined zero-response ratio', () => {
    for (let i = 0; i < 2; i++) {
      const a = row(i, 2, 'A'),
        size = Number(a.match(/each (\d+)/)![1]),
        yes = a
          .match(/counts ([\d/]+)/)![1]!
          .split('/')
          .map(Number);
      expect(
        frac(
          yes.reduce((n, k) => n + k, 0),
          3 * size,
        ),
      ).toBe('1/2');
      expect(frac(yes[0]!, size)).toBe(i === 0 ? '1/4' : '1/6');
      const r = row(i, 2, 'R'),
        [inv, resp, y] = [
          ...r.matchAll(/(?:Invited|responded|yes) (\d+)/g),
        ].map((m) => Number(m[1]));
      expect(inv! - resp!).toBe(4);
      expect(frac(resp!, inv!)).toBe(i === 0 ? '3/5' : '5/9');
      expect(frac(y!, resp!)).toBe(i === 0 ? '2/3' : '2/5');
      expect(frac(y!, inv!)).not.toBe(frac(y!, resp!));
      expect(row(i, 2, 'Z')).toContain('all three answers unknown');
      expect(frac(0, 3)).toBe('0');
      expect(sets[i]!.questions[1]!.stem.en).toContain(
        'DESIGN a fictional population',
      );
      expect(sets[i]!.questions[1]!.solution.en).toContain(
        'complete accurate A responses sufficient',
      );
    }
  });
  it('checks every authored seeded ID using an independent bigint generator, retaining prefixes and both complete runs', () => {
    for (let i = 0; i < 2; i++)
      for (const seed of [37, 38]) {
        const reds = i === 0 ? 3 : 2,
          tokens = [
            ...Array.from({ length: reds }, (_, k) => 'R' + (k + 1)),
            'B1',
            'B2',
          ];
        let state = BigInt(seed);
        const choose = (n: number) => {
          state = (1664525n * state + 1013904223n) % 4294967296n;
          return Number(((2n * state + 1n) * BigInt(n)) / 8589934592n);
        };
        const oracle = Array.from({ length: 12 }, () => {
          const k = choose(tokens.length),
            first = tokens[k]!,
            rest = tokens.filter((_, j) => j !== k);
          return first + '-' + rest[choose(rest.length)]!;
        });
        const actual = records(i, seed);
        expect(actual).toEqual(oracle);
        expect(actual).toHaveLength(12);
        const run = simulatePairs(reds, 2, false, 'different', seed, 12),
          prefix = simulatePairs(reds, 2, false, 'different', seed, 10);
        expect(run.records.map((r) => r.first + '-' + r.second)).toEqual(
          actual,
        );
        expect(run.records.slice(0, 10)).toEqual(prefix.records);
        expect(actual.filter(hit)).toHaveLength(
          seed === 37 ? (i === 0 ? 7 : 10) : i === 0 ? 9 : 8,
        );
      }
  });
  it('combines unequal batches by counts, keeps cumulative points/window identity and marks ungenerated own output pending', () => {
    for (let i = 0; i < 2; i++) {
      const a = records(i, 37),
        before = a.slice(0, 10).filter(hit).length,
        extra = a.slice(10).filter(hit).length;
      expect(frac(before + extra, 12)).toBe(i === 0 ? '7/12' : '5/6');
      expect(frac(before + extra * 5, 20)).toBe(i === 0 ? '11/20' : '9/10');
      expect(frac(before + extra * 5, 20)).not.toBe(frac(before + extra, 12));
      const theory = i === 0 ? 3 / 5 : 2 / 3;
      expect(Math.abs((before + extra) / 12 - theory)).toBeGreaterThan(
        Math.abs(before / 10 - theory),
      );
      expect(
        a
          .slice(0, 3)
          .map((_, k) => frac(a.slice(0, k + 1).filter(hit).length, k + 1)),
      ).toEqual(['1', '1/2', '1/3']);
      expect(a.slice(2).filter(hit)).toHaveLength(i === 0 ? 6 : 9);
      expect(sets[i]!.questions[2]!.stem.en).toContain(
        'Mark ungenerated data PENDING',
      );
      expect(sets[i]!.questions[2]!.stem.en).toContain(
        '100 complete rounds EACH',
      );
    }
  });
  it('reuses actual directional/zero conditional and impossible-event tasks without changing their H24 bridges', () => {
    for (const s of Object.values(countingStructureRetrieval)) {
      const q4 = s.questions[3]!,
        q5 = s.questions[4]!;
      expect(q4.stem.en).toContain('P(B|A)');
      expect(q4.stem.en).toContain('cells(0,2,0,4)');
      expect(q5.stem.en).toContain('P(A)=0');
      expect(s.bridgeByQuestion[q4.id]).toBe('H24-L05');
      expect(s.bridgeByQuestion[q5.id]).toBe('H24-L06');
      expect(probabilityProcessRecurrence[0]!.targets).toContain(q4.id);
      expect(probabilityProcessRecurrence[0]!.targets).toContain(q5.id);
    }
  });
});
