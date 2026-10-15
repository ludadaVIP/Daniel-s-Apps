import { describe, it, expect } from 'vitest';
import {
  p63Lessons,
  p63CheckQuestions,
  p63ReviewQuestion,
} from './content/P63';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational, type AnswerSpec } from './model';
import {
  orderedRatio,
  ratioTerms,
  simplifyRatio,
  reduceBy,
  allocateRatio,
  ratioTable,
  checkRatioPair,
  mapScale,
  costCurve,
  graphCoordinates,
} from './ratioModels';
const markdown = import.meta.glob('../../../content/lessons/P63-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p63Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p63CheckQuestions,
];
const value = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
const quotient = (s: string) => {
  const [a, b] = s.replace(/：/g, ':').split(':');
  return value(a!) / value(b!);
};
// Values independently transcribed from the authored stems, not from workshop functions.
const ratios = [
  [2 / 3, 3 / 2, 2 / 5, 2 / 3, 0, 2 / 3],
  [2 / 3, 3 / 4, 2 / 3, 2 / 3, 3, 2 / 3],
];
const numbers = [
  [10, 15, 14 / 5, 0, 9, 20],
  [12, 12, 15, 3 / 4, 2, 12],
  [2.5, 1.2, 3, 1000, 25000, 700],
  [12, 5, 6, 4, 9, 6],
];
describe('P63 complete authored lessons', () => {
  it('registers six planned titles, complete bilingual examples, matching availability and backwards prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P63')!;
    expect(p63Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(lessons.filter((l) => l.unit === 'P63')).toHaveLength(6);
    expect(unitChecks.P63.questions).toHaveLength(8);
    expect(new Set(p63Lessons.map((l) => l.lab)).size).toBe(6);
    for (const l of p63Lessons) {
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
      for (const t of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(t.zh).toBeTruthy();
        expect(t.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((x) => x.id === id)!;
        expect(p, `${l.id}→${id}`).toBeTruthy();
        if (p.unit === 'P63') expect(p.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(all).toHaveLength(358);
    expect(
      all
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p63Lessons[5]!.familyChallenge!.en).toContain('No travel, purchase');
  });
  it('checks all 56 unique items, representation/quantity mix and manual reasoning rubrics', () => {
    expect(items).toHaveLength(56);
    expect(new Set(items.map((q) => q.id)).size).toBe(56);
    expect(items.filter((q) => q.answer.kind === 'ratio')).toHaveLength(14);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(28);
    expect(items.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(7);
    for (const q of items) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.solutionSteps!,
        ...q.hints,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
      } else {
        expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently verifies every constructed ratio or numeric answer, with ordered references and all unit-check answers', () => {
    p63Lessons.forEach((l, i) => {
      const qs = [
        l.guided,
        ...l.questions.filter(
          (q) => q.answer.kind === 'number' || q.answer.kind === 'ratio',
        ),
        l.exit,
      ];
      expect(qs).toHaveLength(6);
      qs.forEach((q, j) => {
        if (q.answer.kind === 'ratio')
          expect(quotient(q.answer.value), q.id).toBeCloseTo(
            ratios[i]![j]!,
            12,
          );
        else if (q.answer.kind === 'number')
          expect(value(q.answer.value), q.id).toBeCloseTo(
            numbers[i - 2]![j]!,
            12,
          );
        else throw new Error(q.id);
      });
    });
    const expected = [2 / 3, 30, 12, 800, 10, 4 / 5];
    p63CheckQuestions
      .filter((q) => q.answer.kind === 'number' || q.answer.kind === 'ratio')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(value(q.answer.value)).toBeCloseTo(expected[i]!, 12);
        else if (q.answer.kind === 'ratio')
          expect(quotient(q.answer.value)).toBeCloseTo(expected[i]!, 12);
      });
    expect(checkAnswer('2:3', p63Lessons[0]!.questions[2]!.answer)).toBe(false);
    expect(checkAnswer('250000 m', p63Lessons[4]!.guided.answer)).toBe(false);
  });
  it('requires the specified ordered ratio and simplest form while retaining exact quantities and correct bilingual units', () => {
    const equivalent = p63Lessons[0]!.guided.answer,
      simple = p63Lessons[1]!.guided.answer;
    for (const s of ['4:6', '2：3', ' 2 : 3 ', '0.6:0.9', '1/2:3/4'])
      expect(checkAnswer(s, equivalent), s).toBe(true);
    for (const s of ['3:2', '2:5', '2/3', '2:3%', '2 cm:3 cm'])
      expect(checkAnswer(s, equivalent), s).toBe(false);
    for (const s of ['2:3', '2：3', ' 2 : 3 '])
      expect(checkAnswer(s, simple), s).toBe(true);
    for (const s of ['4:6', '0.2:0.3', '2.0:3.0', '1/2:3/4'])
      expect(checkAnswer(s, simple), s).toBe(false);
    for (const s of ['14/5 升', '2.8 litres'])
      expect(checkAnswer(s, p63Lessons[2]!.questions[2]!.answer)).toBe(true);
    expect(checkAnswer('2.5 千米', p63Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('2.5 m', p63Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('NZ$12', p63Lessons[5]!.guided.answer)).toBe(true);
    expect(checkAnswer('12 L', p63Lessons[5]!.guided.answer)).toBe(false);
  });
  it('independently checks 480 retrieval evaluations and rejects unsupported identifiers', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 6; i++) {
        const id = p63Lessons[i]!.id,
          q = p63ReviewQuestion(id, k);
        let expected = 0;
        if (i === 0) expected = (2 + (k % 5)) / (3 + (Math.floor(k / 5) % 5));
        else if (i === 1)
          expected = (2 + (k % 4)) / (3 + (Math.floor(k / 4) % 4));
        else if (i === 2) {
          const a = 1 + (Math.floor(k / 8) % 3),
            b = 2 + (Math.floor(k / 24) % 3);
          expected = ((5 + (k % 8) * 5) * (k % 2 === 0 ? a : b)) / (a + b);
        } else if (i === 3) {
          const a = 2 + (k % 3),
            b = 3 + (Math.floor(k / 3) % 4);
          expected = (k % 2 === 1 ? a : b) * (1 + (Math.floor(k / 12) % 4));
        } else if (i === 4)
          expected =
            ((1 + (k % 5)) *
              [10000, 20000, 25000, 50000][Math.floor(k / 5) % 4]!) /
            200;
        else {
          const mode = k % 3,
            x = (1 + (Math.floor(k / 3) % 8)) / 2,
            rate = 1 + (Math.floor(k / 24) % 3);
          expected = mode === 2 ? x * x : rate * x + (mode === 1 ? 4 : 0);
        }
        if (q.answer.kind === 'number')
          expect(value(q.answer.value), q.id).toBeCloseTo(expected, 12);
        else if (q.answer.kind === 'ratio')
          expect(quotient(q.answer.value), q.id).toBeCloseTo(expected, 12);
        else throw new Error(q.id);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
        expect(p63ReviewQuestion(id, k + 80).stem).toEqual(q.stem);
      }
    for (const n of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => p63ReviewQuestion('P63-L01', n)).toThrow();
    expect(() => p63ReviewQuestion('P63-L99', 0)).toThrow();
  });
});
describe('P63 ratio mathematics and geometric evidence', () => {
  it('preserves part-to-part and part-to-whole quotients while handling a zero first term', () => {
    for (let a = 0; a <= 24; a++)
      for (let b = 1; b <= 24; b++) {
        const r = orderedRatio(a, b);
        expect(r.total).toBe(a + b);
        expect(r.value.n * b).toBe(a * r.value.d);
        expect(r.firstOfTotal.n * (a + b)).toBe(a * r.firstOfTotal.d);
        expect(r.simple[0] * b).toBe(r.simple[1] * a);
      }
    expect(orderedRatio(4, 6)).toMatchObject({
      value: { n: 2, d: 3 },
      firstOfTotal: { n: 2, d: 5 },
    });
    expect(checkAnswer('0:5', { kind: 'ratio', value: '0:1' })).toBe(true);
    expect(checkAnswer('0:0', { kind: 'ratio', value: '0:1' })).toBe(false);
  });
  it('verifies simplest integer results and all tested divisors without assuming equivalence is simplest', () => {
    for (let a = 0; a <= 30; a++)
      for (let b = 1; b <= 30; b++) {
        const m = simplifyRatio(`${a}:${b}`);
        let greatest = 1;
        for (let d = 1; d <= Math.max(1, a, b); d++)
          if (a % d === 0 && b % d === 0) greatest = d;
        expect(m.gcd).toBe(greatest);
        expect(m.simple).toEqual([a / greatest, b / greatest]);
        for (let divisor = 1; divisor <= 12; divisor++) {
          const r = reduceBy(a, b, divisor);
          if (a % divisor || b % divisor) expect(r.kind).toBe('invalid');
          else {
            expect(r.kind).toBe(
              divisor === greatest ? 'simplest' : 'equivalent',
            );
            if (r.kind !== 'invalid') {
              expect(r.first * b).toBe(r.second * a);
            }
          }
        }
      }
    expect(simplifyRatio('0.6:0.9')).toMatchObject({
      first: 6,
      second: 9,
      simple: [2, 3],
    });
    expect(simplifyRatio('1/2:3/4')).toMatchObject({
      first: 2,
      second: 3,
      simple: [2, 3],
    });
  });
  it('conserves every bounded allocation, preserves weights and retains fractional litres and the zero-total plan', () => {
    for (let total = 0; total <= 40; total++)
      for (let a = 1; a <= 6; a++)
        for (let b = 1; b <= 6; b++) {
          const m = allocateRatio(total, a, b);
          expect(m.first.n * m.second.d + m.second.n * m.first.d).toBe(
            total * m.first.d * m.second.d,
          );
          expect(m.first.n * m.second.d * b).toBe(m.second.n * m.first.d * a);
          const doubled = allocateRatio(total, 2 * a, 2 * b);
          expect(doubled.first).toEqual(m.first);
          expect(doubled.second).toEqual(m.second);
        }
    expect(allocateRatio(7, 2, 3)).toMatchObject({
      first: { n: 14, d: 5 },
      second: { n: 21, d: 5 },
    });
    expect(allocateRatio(0, 2, 3).first.n).toBe(0);
  });
  it('checks tables by independent quotient relationships, distinguishes equal differences and never divides the zero row', () => {
    for (let a = 1; a <= 6; a++)
      for (let b = 1; b <= 6; b++) {
        const rows = ratioTable(a, b);
        rows.forEach((r, i) => {
          expect(r.x).toBe(a * (i + 1));
          expect(r.y).toBe(b * (i + 1));
        });
        for (let x = 0; x <= 16; x++)
          for (let y = 0; y <= 16; y++)
            expect(checkRatioPair(a, b, x, y)).toBe(
              x === 0 && y === 0
                ? 'origin'
                : x / a === y / b
                  ? 'equivalent'
                  : 'different',
            );
      }
    expect(checkRatioPair(2, 3, 4, 5)).toBe('different');
    expect(checkRatioPair(2, 3, 4, 6)).toBe('equivalent');
    expect(checkRatioPair(2, 3, 0, 0)).toBe('origin');
    expect(checkRatioPair(2, 3, 0, 1)).toBe('different');
  });
  it('uses original-map coordinates and same-unit conversions, preserving distances while zoom and printed scale change', () => {
    for (const scale of [10000, 25000, 50000, 100000])
      for (let h = 0; h <= 6; h += 0.5)
        for (let v = 0; v <= 5; v += 0.5) {
          const m = mapScale(h, v, scale),
            z = mapScale(h, v, scale, 2);
          expect(m.realCm.n / m.realCm.d).toBe((h + v) * scale);
          expect(m.realM.n / m.realM.d).toBe(((h + v) * scale) / 100);
          expect(m.realKm.n / m.realKm.d).toBe(((h + v) * scale) / 100000);
          expect(z.realM).toEqual(m.realM);
          expect(z.pixelsPerOriginalCm).toBe(m.pixelsPerOriginalCm * 2);
          expect(z.printedScale).toBe(scale / 2);
          expect(z.barKm).toEqual(m.barKm);
        }
    expect(mapScale(3, 2, 50000).realKm).toEqual({ n: 5, d: 2 });
    expect(mapScale(0, 0, 50000).realCm.n).toBe(0);
  });
  it('distinguishes a line through the origin, a fixed-fee line and a curve through the origin and preserves graph coordinates under rescaling', () => {
    for (const kind of ['direct', 'fee', 'square'] as const)
      for (let rate = 1; rate <= 5; rate++) {
        const m = costCurve(kind, rate);
        expect(m.points).toHaveLength(17);
        expect(m.proportional).toBe(kind === 'direct');
        m.points.forEach((p) =>
          expect(p.y).toBe(
            kind === 'square'
              ? p.x * p.x
              : rate * p.x + (kind === 'fee' ? 4 : 0),
          ),
        );
        expect(m.atZero).toBe(kind === 'fee' ? 4 : 0);
        const normal = graphCoordinates(m.points, m.minimumY),
          wide = graphCoordinates(m.points, m.minimumY * 2);
        normal.forEach((p, i) => {
          expect(p.px).toBe(60 + p.x * 55);
          expect(p.py).toBe(300 - (240 * p.y) / m.minimumY);
          expect(wide[i]!.x).toBe(p.x);
          expect(wide[i]!.y).toBe(p.y);
          expect(300 - wide[i]!.py).toBe((300 - p.py) / 2);
        });
        const qs = m.rates.map((r) => r.perLitre.n / r.perLitre.d);
        expect(new Set(qs).size === 1).toBe(kind === 'direct');
      }
  });
  it('rejects undefined or malformed ratios and invalid model domains without changing ordinary numeric parsing', () => {
    const spec: AnswerSpec = { kind: 'ratio', value: '2:3' };
    for (const s of [
      '2:0',
      '0:0',
      '-2:3',
      '2:-3',
      '2::3',
      '2:3:4',
      '2/0:3',
      '2%:3',
      'two:three',
      ':3',
    ]) {
      expect(checkAnswer(s, spec), s).toBe(false);
      expect(ratioTerms(s), s).toBeNull();
    }
    for (const fn of [
      () => orderedRatio(1, 0),
      () => orderedRatio(-1, 2),
      () => simplifyRatio('0:0'),
      () => reduceBy(2, 3, 0),
      () => allocateRatio(7, 0, 3),
      () => allocateRatio(-1, 2, 3),
      () => ratioTable(0, 3),
      () => checkRatioPair(2, 3, 49, 2),
      () => mapScale(0.3, 2, 50000),
      () => mapScale(3, 2, 0),
      () => mapScale(3, 2, 50000, 3),
      () => costCurve('direct', 0),
      () => graphCoordinates([{ x: 9, y: 1 }], 40),
      () => graphCoordinates([{ x: 1, y: 41 }], 40),
    ])
      expect(fn).toThrow();
    expect(exactRational('6/16')).toEqual([3n, 8n]);
    expect(checkAnswer('4:6', { kind: 'number', value: '2/3' })).toBe(false);
  });
});
