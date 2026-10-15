import { describe, it, expect } from 'vitest';
import {
  p64Lessons,
  p64CheckQuestions,
  p64ReviewQuestion,
} from './content/P64';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  signedWhole,
  signedLabel,
  temperatureReading,
  signedAxisPosition,
  axisWalk,
  compareSigned,
  signedMovement,
  absoluteDistance,
} from './signedModels';
const markdown = import.meta.glob('../../../content/lessons/P64-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p64Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p64CheckQuestions,
];
const value = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
// Independently transcribed from each authored stem: guided, Q2–Q5, exit.
const expected = [
  [-4, 3, 0, -7, 6, -9],
  [-5, -7, 3, -1, -3, -11],
  [-3, -4, -2, -2, 0, -9],
  [2, -3, -7, 2, 0, 5],
  [6, 9, 4, 0, 7, 11],
];
describe('P64 authored signed-number lessons', () => {
  it('publishes five planned bilingual lessons with two examples per language and valid backwards prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P64')!;
    expect(p64Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(lessons.filter((l) => l.unit === 'P64')).toHaveLength(5);
    expect(unitChecks.P64.questions).toHaveLength(8);
    expect(new Set(p64Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p64Lessons) {
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
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((x) => x.id === id)!;
        expect(p, `${l.id}→${id}`).toBeTruthy();
        if (p.unit === 'P64') expect(p.order).toBeLessThan(l.order!);
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
    expect(p64Lessons[4]!.familyChallenge!.en).toContain('no thermometer');
  });
  it('validates all 48 unique items, two hints, bilingual evidence, specific option feedback and manual rubrics', () => {
    expect(items).toHaveLength(48);
    expect(new Set(items.map((q) => q.id)).size).toBe(48);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(36);
    expect(items.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
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
  it('independently checks every authored numeric answer and separates endpoint, temperature, order and distance', () => {
    p64Lessons.forEach((l, i) => {
      const qs = [
        l.guided,
        ...l.questions.filter((q) => q.answer.kind === 'number'),
        l.exit,
      ];
      expect(qs).toHaveLength(6);
      qs.forEach((q, j) => {
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(value(q.answer.value), q.id).toBe(expected[i]![j]);
      });
    });
    const checks = [-6, -7, -2, 4, -5, 9];
    p64CheckQuestions
      .filter((q) => q.answer.kind === 'number')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(value(q.answer.value), q.id).toBe(checks[i]);
      });
    expect(checkAnswer('5', p64Lessons[3]!.guided.answer)).toBe(false);
    expect(checkAnswer('-6', p64Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('3', p64Lessons[2]!.guided.answer)).toBe(false);
  });
  it('accepts exact signed values, full-width signs and Celsius spellings without accepting wrong units or expressions', () => {
    const temp = p64Lessons[0]!.guided.answer;
    for (const s of ['-4', '−4°C', '－4℃', '-8/2 摄氏度', '-4 degrees Celsius'])
      expect(checkAnswer(s, temp), s).toBe(true);
    for (const s of ['4', '-4 m', '-4%', '--4', '−＋4', '(-4)', '0-4'])
      expect(checkAnswer(s, temp), s).toBe(false);
    expect(checkAnswer('＋3℃', p64Lessons[0]!.questions[1]!.answer)).toBe(true);
    expect(checkAnswer('−0℃', p64Lessons[0]!.questions[2]!.answer)).toBe(true);
    expect(checkAnswer('0%', p64Lessons[4]!.questions[3]!.answer)).toBe(false);
    for (let n = -20; n <= 20; n++) {
      const spec = {
        kind: 'number',
        value: String(n),
        formats: ['decimal', 'fraction'],
      } as const;
      expect(
        checkAnswer(String(n), { ...spec, formats: ['decimal', 'fraction'] }),
      ).toBe(true);
      expect(exactRational(String(n).replace('-', '－'))).toEqual([
        BigInt(n),
        1n,
      ]);
    }
    expect(exactRational('＋4')).toEqual([4n, 1n]);
  });
  it('checks 400 retrieval evaluations independently, including both operations and zero cases', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 5; i++) {
        const id = p64Lessons[i]!.id,
          q = p64ReviewQuestion(id, k);
        if (q.answer.kind !== 'number') throw new Error(q.id);
        let expected = 0;
        if (i === 0 || i === 1) expected = -12 + (k % 25);
        else if (i === 2) {
          const a = -1 - (k % 12),
            b = -1 - (Math.floor(k / 12) % 12);
          expected = k % 2 === 0 ? Math.max(a, b) : Math.min(a, b);
        } else if (i === 3) {
          const start = -10 + ((k * 5) % 21),
            term = -8 + ((k * 7) % 17);
          let end = start;
          const direction = (k % 2 === 0 ? 1 : -1) * (term < 0 ? -1 : 1);
          for (let j = 0; j < Math.abs(term); j++) end += direction;
          expected = end;
        } else expected = Math.abs(-12 + (k % 25));
        expect(value(q.answer.value), q.id).toBe(expected);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
        expect(p64ReviewQuestion(id, k + 80).stem).toEqual(q.stem);
      }
    for (const n of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => p64ReviewQuestion('P64-L01', n)).toThrow();
    expect(() => p64ReviewQuestion('P64-L99', 0)).toThrow();
  });
});
describe('P64 signed models and invariant units', () => {
  it('preserves one-degree thermometer spacing, a fixed zero reference and valid column heights below zero', () => {
    for (let n = -15; n <= 15; n++) {
      const m = temperatureReading(n);
      expect(m.y).toBe(220 - 12 * n);
      expect(m.zeroY).toBe(220);
      expect(m.steps).toBe(n < 0 ? -n : n);
      expect(m.bottomY - m.y).toBeGreaterThanOrEqual(0);
      expect(m.side).toBe(n < 0 ? 'below' : n > 0 ? 'above' : 'zero');
      if (n < 15) expect(m.y - temperatureReading(n + 1).y).toBe(12);
    }
    expect(temperatureReading(-4).y).toBe(268);
    expect(temperatureReading(4).y).toBe(172);
    expect(Object.is(temperatureReading(-0).value, -0)).toBe(false);
  });
  it('uses equal axis units across zero, preserves ordered positions and has no wraparound at the workshop boundary', () => {
    for (let n = -12; n <= 12; n++) {
      const p = signedAxisPosition(n);
      expect(p.x).toBe(332 + n * 24);
      expect(p.zeroX).toBe(332);
      expect(p.width).toBe(664);
      if (n < 12) expect(signedAxisPosition(n + 1).x - p.x).toBe(24);
    }
    expect(axisWalk(-1, 'right')).toBe(0);
    expect(axisWalk(0, 'left')).toBe(-1);
    expect(axisWalk(-12, 'left')).toBe(-12);
    expect(axisWalk(12, 'right')).toBe(12);
    expect(signedAxisPosition(-18, -18, 12).x).toBe(44);
    expect(signedAxisPosition(18, -12, 18).x).toBe(764);
  });
  it('compares full signed positions, including all bounded equal points and the negative-digit trap', () => {
    for (let a = -12; a <= 12; a++)
      for (let b = -12; b <= 12; b++) {
        const m = compareSigned(a, b),
          pa = signedAxisPosition(a).x,
          pb = signedAxisPosition(b).x;
        expect(m.relation).toBe(pa < pb ? '<' : pa > pb ? '>' : '=');
        expect(m.equal).toBe(pa === pb);
      }
    expect(compareSigned(-8, -3).relation).toBe('<');
    expect(compareSigned(-1, 0).relation).toBe('<');
    expect(compareSigned(2, 5).relation).toBe('<');
  });
  it('independently walks every start, operation and signed term and conserves distance through zero and expanded windows', () => {
    for (let start = -10; start <= 10; start++)
      for (let term = -8; term <= 8; term++)
        for (const op of ['+', '−'] as const) {
          const m = signedMovement(start, op, term),
            visited = [start];
          let point = start;
          const step = (op === '+' ? 1 : -1) * (term < 0 ? -1 : 1);
          for (let n = 0; n < Math.abs(term); n++) {
            point += step;
            visited.push(point);
          }
          expect(m.end).toBe(point);
          expect(m.delta).toBe(point - start);
          expect(m.distance).toBe(visited.length - 1);
          expect(m.end - m.delta).toBe(start);
          expect(m.crossesZero).toBe(
            visited.some((v) => v < 0) && visited.some((v) => v > 0),
          );
          expect(m.reachesZero).toBe(point === 0 && start !== 0);
          expect(m.waypoints[0]).toBe(start);
          expect(m.waypoints.at(-1)).toBe(point);
          expect(
            m.waypoints
              .slice(1)
              .reduce((sum, n, i) => sum + Math.abs(n - m.waypoints[i]!), 0),
          ).toBe(m.distance);
          expect(m.firstLeg + m.remaining).toBe(m.distance);
          expect(m.min).toBeLessThanOrEqual(point);
          expect(m.max).toBeGreaterThanOrEqual(point);
          m.waypoints.forEach((n) => {
            const p = signedAxisPosition(n, m.min, m.max);
            expect(p.x).toBeGreaterThan(0);
            expect(p.x).toBeLessThan(p.width);
          });
        }
    expect(signedMovement(-3, '+', 5)).toMatchObject({
      end: 2,
      delta: 5,
      distance: 5,
      waypoints: [-3, 0, 2],
    });
    expect(signedMovement(-3, '−', -5)).toMatchObject({ end: 2, delta: 5 });
    expect(signedMovement(-5, '+', 5)).toMatchObject({
      crossesZero: false,
      reachesZero: true,
    });
    expect(signedMovement(-10, '−', 8).end).toBe(-18);
    expect(signedMovement(-3, '+', 0).distance).toBe(0);
  });
  it('measures absolute value by repeated moves toward zero and distinguishes opposite, signed order and another endpoint', () => {
    for (let n = -12; n <= 12; n++) {
      const m = absoluteDistance(n);
      let point = n,
        count = 0;
      while (point !== 0) {
        point += point > 0 ? -1 : 1;
        count++;
      }
      expect(m.distance).toBe(count);
      expect(m.opposite + n).toBe(0);
      expect(m.nonnegative).toBe(true);
      expect(absoluteDistance(m.opposite).distance).toBe(m.distance);
    }
    expect(absoluteDistance(6)).toMatchObject({ opposite: -6, distance: 6 });
    expect(absoluteDistance(0)).toMatchObject({ opposite: 0, distance: 0 });
    expect(signedLabel(-0)).toBe('0');
    expect(signedLabel(3, true)).toBe('+3');
    expect(signedLabel(-3)).toBe('−3');
    expect(absoluteDistance(-4).distance).toBe(4);
    expect(signedMovement(-4, '+', 7).distance).toBe(7);
  });
  it('rejects fractional integers, invalid windows, unsupported operations and out-of-range values rather than clipping results', () => {
    for (const fn of [
      () => signedWhole(NaN),
      () => signedWhole(0.5),
      () => signedWhole(41),
      () => temperatureReading(-16),
      () => signedAxisPosition(13),
      () => signedAxisPosition(0, 1, 12),
      () => signedAxisPosition(0, 0, 0),
      () => axisWalk(13, 'left'),
      () => signedMovement(11, '+', 1),
      () => signedMovement(1, '+', 9),
      () => absoluteDistance(-13),
    ])
      expect(fn).toThrow();
    for (const s of ['--4', '＋－4', '4−', '-4+2', '(−4)'])
      expect(exactRational(s), s).toBeNull();
  });
});
