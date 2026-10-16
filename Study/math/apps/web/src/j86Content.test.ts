import { describe, it, expect } from 'vitest';
import {
  j86Lessons,
  j86CheckQuestions,
  j86ReviewQuestion,
} from './content/J86';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  availableCongruenceRules,
  checkGeometryCode,
  checkCongruenceRule,
  checkProofVerdict,
  sssTriangle,
  sasTriangle,
  angleTriangle,
  ssaAlternatives,
  trianglePose,
  isoscelesModel,
  parallelogramModel,
  parallelogramCounterexample,
  parallelogramTests,
  proofScenarios,
  proofState,
  tryProofCard,
  type GeoPoint,
  type CongruenceFacts,
} from './congruenceModels';
const markdown = import.meta.glob('../../../content/lessons/J86-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j86Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j86CheckQuestions,
];
const distance = (a: GeoPoint, b: GeoPoint) => Math.hypot(a.x - b.x, a.y - b.y);
const cross = (a: GeoPoint, b: GeoPoint, c: GeoPoint) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const angle = (a: GeoPoint, b: GeoPoint, c: GeoPoint) =>
  (Math.acos(
    Math.max(
      -1,
      Math.min(
        1,
        ((b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y)) /
          (distance(a, b) * distance(a, c)),
      ),
    ),
  ) *
    180) /
  Math.PI;
function permutations(a: string[]): string[][] {
  return a.length
    ? a.flatMap((x, i) =>
        permutations(a.filter((_, j) => j !== i)).map((rest) => [x, ...rest]),
      )
    : [[]];
}
describe('J86 sufficient congruence conditions and non-circular proofs', () => {
  it('registers six stable planned lessons, earlier prerequisites and two complete examples in each language', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons),
      planned = units.find((u) => u.id === 'J86')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(planned.lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      j86Lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J86.questions).toHaveLength(8);
    for (const l of j86Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.find((v) => v.id === id)).toBeTruthy();
        expect(lessons.findIndex((v) => v.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j86ReviewQuestion(l.id, 0));
    }
  });
  it('checks 56 bilingual items with 14 human-reviewed proofs and every accepted/rejected example', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    for (const [kind, count] of Object.entries({
      number: 12,
      'geometry-code': 7,
      'congruence-rule': 12,
      'proof-verdict': 4,
      choice: 7,
      explain: 14,
    }))
      expect(
        all.filter((q) => q.answer.kind === kind),
        kind,
      ).toHaveLength(count);
    for (const q of all) {
      expect(q.stem.zh.length).toBeGreaterThan(5);
      expect(q.stem.en.length).toBeGreaterThan(10);
      expect(q.hints).toHaveLength(2);
      expect(q.solution.zh.length).toBeGreaterThan(10);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('ASA common side proof', q.answer)).toBeNull();
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id} rejects ${raw}`).toBe(
          false,
        );
    }
  });
  it('independently transcribes the 35 constructed answers and seven choices, allowing justified ASA/AAS conversion', () => {
    const values = [
      ['DEF', 'FD', 'E', '7', '不全等', 'EFD'],
      ['SSS', 'SAS', '条件不足', '5', '条件不足', 'SAS'],
      ['ASA', 'AAS', '条件不足', '70', '40', 'ASA'],
      ['65', '40', '9', 'CA', null, '40'],
      ['110', '6', '充分', '条件不足', null, '5'],
      [null, null, null, 'CDA', 'AAS', null],
    ];
    j86Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) => {
        const v = values[i]![j];
        if (v !== null) expect(checkAnswer(v!, q.answer), q.id).toBe(true);
        else expect(q.answer.kind).toBe('explain');
      });
      expect(
        checkAnswer(String([0, 1, 0, 1, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['DFE', 'SAS', 'ASA', '50', 'insufficient'].forEach((v, i) =>
      expect(checkAnswer(v, j86CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j86CheckQuestions[5]!.answer.kind).toBe('explain');
    expect(checkAnswer('1', j86CheckQuestions[6]!.answer)).toBe(true);
  });
  it('exhausts 64 side/angle subsets using independent bit tests, rejecting general SSA and AAA', () => {
    for (let s = 0; s < 8; s++)
      for (let a = 0; a < 8; a++) {
        const f: CongruenceFacts = {
            sides: (['AB', 'BC', 'CA'] as const).filter((_, i) => s & (1 << i)),
            angles: (['A', 'B', 'C'] as const).filter((_, i) => a & (1 << i)),
          },
          r = availableCongruenceRules(f),
          sss = s === 7,
          sas = !!(
            (a & 1 && (s & 5) === 5) ||
            (a & 2 && (s & 3) === 3) ||
            (a & 4 && (s & 6) === 6)
          ),
          twoAngles = [0, 1, 1, 2, 1, 2, 2, 3][a]! >= 2,
          angleSide = twoAngles && s !== 0;
        expect(r.includes('SSS')).toBe(sss);
        expect(r.includes('SAS')).toBe(sas);
        expect(r.includes('ASA')).toBe(angleSide);
        expect(r.includes('AAS')).toBe(angleSide);
        expect(r.includes('insufficient')).toBe(!sss && !sas && !angleSide);
      }
    expect(
      availableCongruenceRules({ sides: ['AB', 'BC'], angles: ['A'] }),
    ).toEqual(['insufficient']);
    expect(
      availableCongruenceRules({ sides: [], angles: ['A', 'B', 'C'] }),
    ).toEqual(['insufficient']);
    expect(
      availableCongruenceRules({ sides: ['AB'], angles: ['A', 'B'] }),
    ).toEqual(['ASA', 'AAS']);
    expect(
      availableCongruenceRules({ sides: ['AB'], angles: ['A', 'C'] }),
    ).toEqual(['AAS', 'ASA']);
  });
  it('constructs all 729 small SSS triples with 369 nondegenerate triangles and independently checks every length', () => {
    let valid = 0;
    for (let ab = 1; ab <= 9; ab++)
      for (let bc = 1; bc <= 9; bc++)
        for (let ca = 1; ca <= 9; ca++) {
          const expected = ab + bc > ca && ab + ca > bc && bc + ca > ab,
            p = sssTriangle(ab, bc, ca);
          expect(!!p).toBe(expected);
          if (p) {
            expect(distance(p[0]!, p[1]!)).toBeCloseTo(ab, 10);
            expect(distance(p[1]!, p[2]!)).toBeCloseTo(bc, 10);
            expect(distance(p[2]!, p[0]!)).toBeCloseTo(ca, 10);
            expect(cross(p[0]!, p[1]!, p[2]!)).toBeGreaterThan(0);
            valid++;
          }
        }
    expect(valid).toBe(369);
  });
  it('preserves distances under 96 poses and distinguishes enlargement from rigid congruence', () => {
    const base = sssTriangle(4, 5, 3)!;
    let count = 0;
    for (let d = 0; d < 360; d += 15)
      for (const mirror of [false, true])
        for (const scale of [1, 1.5]) {
          const p = trianglePose(base, d, mirror, scale);
          for (let i = 0; i < 3; i++)
            expect(distance(p[i]!, p[(i + 1) % 3]!)).toBeCloseTo(
              distance(base[i]!, base[(i + 1) % 3]!) * scale,
              10,
            );
          expect(Math.abs(cross(p[0]!, p[1]!, p[2]!))).toBeCloseTo(
            12 * scale * scale,
            10,
          );
          count++;
        }
    expect(count).toBe(96);
    expect(checkGeometryCode('FD', 'DF', true)).toBe(true);
    expect(checkGeometryCode('DFE', 'DEF')).toBe(false);
    expect(checkGeometryCode('△DEF', 'DEF')).toBe(true);
    expect(checkProofVerdict('不全等', 'not-congruent')).toBe(true);
  });
  it('builds actual SSA and AAA counterexamples rather than misdrawing a supposedly fixed triangle', () => {
    const p = ssaAlternatives();
    expect(p).toHaveLength(2);
    const lengths = p.map((t) => distance(t[0]!, t[2]!));
    expect(lengths[0]).toBeCloseTo(3 * Math.sqrt(3) - Math.sqrt(7), 10);
    expect(lengths[1]).toBeCloseTo(3 * Math.sqrt(3) + Math.sqrt(7), 10);
    for (const t of p) {
      expect(distance(t[0]!, t[1]!)).toBeCloseTo(6, 10);
      expect(distance(t[1]!, t[2]!)).toBeCloseTo(4, 10);
      expect(angle(t[0]!, t[1]!, t[2]!)).toBeCloseTo(30, 10);
    }
    expect(ssaAlternatives(6, 3, 30)).toHaveLength(1);
    expect(ssaAlternatives(6, 2, 30)).toHaveLength(0);
    const a = angleTriangle(50, 60, 6),
      b = a.map((p) => ({ x: p.x * 1.4, y: p.y * 1.4 }));
    for (let i = 0; i < 3; i++)
      expect(angle(a[i]!, a[(i + 1) % 3]!, a[(i + 2) % 3]!)).toBeCloseTo(
        angle(b[i]!, b[(i + 1) % 3]!, b[(i + 2) % 3]!),
        10,
      );
    expect(distance(a[0]!, a[1]!)).not.toBeCloseTo(distance(b[0]!, b[1]!), 5);
  });
  it('constructs correct SAS/ASA angles and 13 isosceles models with equal legs and the requested apex', () => {
    for (const a of [20, 50, 90, 140]) {
      const p = sasTriangle(4, 3, a);
      expect(distance(p[0]!, p[1]!)).toBeCloseTo(4, 10);
      expect(distance(p[0]!, p[2]!)).toBeCloseTo(3, 10);
      expect(angle(p[0]!, p[1]!, p[2]!)).toBeCloseTo(a, 10);
    }
    const t = angleTriangle(50, 60, 6);
    expect(angle(t[0]!, t[1]!, t[2]!)).toBeCloseTo(50, 10);
    expect(angle(t[1]!, t[0]!, t[2]!)).toBeCloseTo(60, 10);
    expect(angle(t[2]!, t[0]!, t[1]!)).toBeCloseTo(70, 10);
    for (let a = 20; a <= 140; a += 10) {
      const m = isoscelesModel(a),
        p = m.points;
      expect(distance(p[0]!, p[1]!)).toBeCloseTo(5, 10);
      expect(distance(p[0]!, p[2]!)).toBeCloseTo(5, 10);
      expect(angle(p[0]!, p[1]!, p[2]!)).toBeCloseTo(a, 10);
      expect(angle(p[1]!, p[0]!, p[2]!)).toBeCloseTo((180 - a) / 2, 10);
      expect(m.base).toBe((180 - a) / 2);
    }
  });
  it('checks 25 parallelograms and genuine simple-convex counterexamples satisfying the stated incomplete premises', () => {
    for (let s = -2; s <= 2; s++)
      for (let h = 1; h <= 5; h++) {
        const { points: p, o } = parallelogramModel(s, h);
        expect(distance(p[0]!, p[1]!)).toBeCloseTo(distance(p[2]!, p[3]!), 10);
        expect(distance(p[1]!, p[2]!)).toBeCloseTo(distance(p[3]!, p[0]!), 10);
        expect(o).toEqual({
          x: (p[0]!.x + p[2]!.x) / 2,
          y: (p[0]!.y + p[2]!.y) / 2,
        });
        expect(o).toEqual({
          x: (p[1]!.x + p[3]!.x) / 2,
          y: (p[1]!.y + p[3]!.y) / 2,
        });
        expect(cross(p[0]!, p[1]!, p[3]!)).toBe(4 * h);
      }
    for (const id of ['one-parallel', 'mixed-pairs', 'one-equal']) {
      const p = parallelogramCounterexample(id);
      for (let i = 0; i < 4; i++)
        expect(cross(p[i]!, p[(i + 1) % 4]!, p[(i + 2) % 4]!)).toBeGreaterThan(
          0,
        );
      if (id === 'one-equal')
        expect(distance(p[0]!, p[1]!)).toBe(distance(p[2]!, p[3]!));
      else {
        expect(p[0]!.y).toBe(p[1]!.y);
        expect(p[2]!.y).toBe(p[3]!.y);
        expect(distance(p[0]!, p[3]!)).toBe(distance(p[1]!, p[2]!));
      }
      expect(
        (p[2]!.x - p[1]!.x) * (p[3]!.y - p[0]!.y) -
          (p[2]!.y - p[1]!.y) * (p[3]!.x - p[0]!.x),
      ).not.toBe(0);
    }
    expect(parallelogramTests.map((c) => c.sufficient)).toEqual([
      true,
      true,
      true,
      true,
      false,
      false,
      false,
    ]);
  });
  it('accepts exactly six topological orders of the five-step parallel proof, forbids circular shortcuts and recomputes undo facts', () => {
    const s = proofScenarios[0]!;
    let count = 0;
    for (const order of permutations([
      'angle-one',
      'angle-two',
      'common',
      'congruence',
      'corresponding',
    ])) {
      let history: string[] = [];
      for (const id of order) {
        const r = tryProofCard(s, history, id);
        if (!r.valid) break;
        history = r.history;
      }
      if (history.length === 5) {
        expect(proofState(s, history).has('AB=CD')).toBe(true);
        expect(proofState(s, history.slice(0, -1)).has('AB=CD')).toBe(false);
        count++;
      }
    }
    expect(count).toBe(6);
    expect(tryProofCard(s, [], 'congruence').missing).toHaveLength(3);
    expect(tryProofCard(s, [], 'circular').reason).toBe('circular');
    expect(tryProofCard(s, ['common'], 'common').reason).toBe('duplicate');
    const iso = proofScenarios[1]!,
      history = ['common', 'congruence', 'corresponding'];
    expect(proofState(iso, history).has('BD=DC')).toBe(true);
    expect(tryProofCard(iso, history, 'circular').valid).toBe(false);
    expect(() => proofState(s, ['congruence'])).toThrow();
  });
  it('independently checks 480 retrieval items including 80 human proofs and valid alternative angle criteria', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const q = j86ReviewQuestion(`J86-L0${i + 1}`, k);
        if (i === 5) {
          expect(q.answer.kind).toBe('explain');
          expect(checkAnswer('proof in my words', q.answer)).toBeNull();
          continue;
        }
        let expected: string;
        if (i === 0) expected = ['DE', 'DF', 'EF', 'ED', 'FD', 'FE'][k % 6]!;
        else if (i === 1)
          expected = k % 4 === 0 ? 'SSS' : k % 4 === 1 ? 'SAS' : 'insufficient';
        else if (i === 2)
          expected = k % 3 === 2 ? 'insufficient' : k % 3 === 0 ? 'AAS' : 'ASA';
        else if (i === 3) expected = String(80 - (k % 60));
        else
          expected = k % 2 === 0 ? String(2 * ((k % 7) + 1)) : 'insufficient';
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.accepted)
          expect(checkAnswer(raw, q.answer)).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer)).toBe(false);
      }
  });
  it('rejects degenerate geometry, malformed codes, invalid histories and unsupported review IDs', () => {
    for (const call of [
      () => sssTriangle(0, 2, 3),
      () => sasTriangle(3, 4, 180),
      () => angleTriangle(90, 90, 4),
      () => isoscelesModel(0),
      () => parallelogramModel(0, 0),
      () => ssaAlternatives(6, 4, NaN),
      () => trianglePose(sssTriangle(4, 5, 3)!, 0, false, 0),
      () => parallelogramCounterexample('bad'),
      () => proofState(proofScenarios[0]!, ['common', 'common']),
      () => tryProofCard(proofScenarios[0]!, [], 'bad'),
    ])
      expect(call).toThrow();
    expect(checkGeometryCode('ABC=DEF', 'DEF')).toBe(false);
    expect(checkCongruenceRule('AAA', 'ASA')).toBe(false);
    expect(checkProofVerdict('yes', 'sufficient')).toBe(false);
    for (const [id, k] of [
      ['J86-L00', 0],
      ['J85-L01', 0],
      ['J86-L01', -1],
      ['J86-L01', 0.1],
      ['J86-L01', 100001],
    ] as const)
      expect(() => j86ReviewQuestion(id, k)).toThrow();
  });
});
