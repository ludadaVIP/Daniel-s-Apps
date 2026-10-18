import { describe, it, expect } from 'vitest';
import {
  h04Lessons,
  h04CheckQuestions,
  h04ReviewQuestion,
} from './content/H04';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { rational, textR } from './algebraModels';
import { readRational } from './rationalModels';
import { radicalNumber } from './trigModels';
import {
  angleText,
  checkAngle,
  checkAngleSet,
  checkCircularValue,
  degreeToPi,
  piToDegree,
  circularAt,
  waveModel,
  checkCircleIdentity,
  circleRemainder,
  circularSolutions,
  solutionText,
  type CircularFamily,
} from './circularModels';
const bodies = import.meta.glob('../../../content/lessons/H04-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h04Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h04CheckQuestions,
];
describe('H04 radian inputs, signed coordinates, identities and complete roots', () => {
  it('opens precisely six verified planned lessons with bilingual examples and earlier bridges', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(250);
    expect(openUnits.length).toBeGreaterThanOrEqual(47);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H04-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h04Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H04.questions).toEqual(h04CheckQuestions);
    for (const l of h04Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n, id).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h04ReviewQuestion(l.id, 0));
    }
  });
  it('anchors all 56 authored answers independently and leaves twelve arguments human-reviewed', () => {
    const anchors = [
      ['5pi/6', '-135°', '2pi cm', '-5pi/2', '4pi', '1.5 rad'],
      ['-1/2', '-sqrt(2)/2', 'undefined', '1/2', '1/2', '7pi/6'],
      ['-1', '2pi', '1', '{0,pi,2pi}', 'even', '1'],
      ['2', 'pi', 'pi/2', '1', '1', null],
      ['s^2', 'c^2', '1', '-4/5', null, null],
      [
        '{pi/6,5pi/6}',
        '{2pi/3,4pi/3}',
        '{pi/12,5pi/12,13pi/12,17pi/12}',
        '{-3pi/4,pi/4}',
        '{pi,2pi}',
        null,
      ],
    ];
    h04Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((v, j) =>
        expect(checkAnswer(v ?? 'argument', qs[j]!.answer), qs[j]!.id).toBe(
          v === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([0, 1, 1, 2, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.solution.zh).toBeTruthy();
      expect(q.solution.en).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('sin cos domain', q.answer)).toBeNull();
        continue;
      }
      expect(
        checkAnswer(q.answer.value, q.answer),
        `${q.id}: canonical answer`,
      ).toBe(true);
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id}: rejects ${a}`).toBe(false);
    }
  });
  it('keeps exact radian inputs distinct from coterminal rotations, decimal pi and degree units', () => {
    expect(checkAngle('150*pi/180 rad', '5/6')).toBe(true);
    expect(checkAngle('−5π/2', '-5/2')).toBe(true);
    expect(checkAngle('-pi/2', '-5/2')).toBe(false);
    expect(checkAngle('1.5707963268', '1/2')).toBe(false);
    expect(checkAngle('90°', '1/2')).toBe(false);
    expect(checkAngle('pi/2 degrees', '1/2')).toBe(false);
    expect(checkAngle('ππ', '1')).toBe(false);
    for (let d = -720; d <= 720; d += 15) {
      const r = degreeToPi(String(d));
      expect(textR(piToDegree(textR(r)))).toBe(String(d));
      expect(checkAngle(angleText(r), textR(r))).toBe(true);
    }
    expect(checkAnswer('1.5 radians', h04Lessons[0]!.exit.answer)).toBe(true);
    expect(checkAnswer('1.5°', h04Lessons[0]!.exit.answer)).toBe(false);
  });
  it('checks exact finite angle sets without modulo-merging or losing interval endpoints', () => {
    expect(checkAngleSet('{2π,0,π}', ['0', '1', '2'])).toBe(true);
    expect(checkAngleSet('{0,pi,pi,2pi}', ['0', '1', '2'])).toBe(true);
    expect(checkAngleSet('{0,pi}', ['0', '1', '2'])).toBe(false);
    expect(checkAngleSet('{pi/6,5pi/6,13pi/6}', ['1/6', '5/6'])).toBe(false);
    for (const s of ['∅', '{}', 'empty set', '空集'])
      expect(checkAngleSet(s, [])).toBe(true);
    for (const s of ['all', '{pi/6,}', '{90°,pi}', '[pi,2pi]', '{3.14159}'])
      expect(checkAngleSet(s, ['1'])).toBe(false);
  });
  it('anchors exact special-angle values and every signed quadrant against an independent numerical circle', () => {
    expect(
      checkCircularValue('(sqrt(6)-sqrt(2))/4', circularAt('1/12').sin),
    ).toBe(true);
    expect(checkCircularValue('2-sqrt(3)', circularAt('1/12').tan)).toBe(true);
    expect(circularAt('1/2').tan).toBeNull();
    expect(circularAt('-1/2').tan).toBeNull();
    expect(circularAt('1').tan).toBe('0');
    for (let i = -48; i <= 48; i++) {
      const r = rational(BigInt(i), 12n),
        m = circularAt(textR(r)),
        theta = (i * Math.PI) / 12;
      expect(radicalNumber(m.sin)).toBeCloseTo(Math.sin(theta), 12);
      expect(radicalNumber(m.cos)).toBeCloseTo(Math.cos(theta), 12);
      if (((i % 12) + 12) % 12 === 6) expect(m.tan).toBeNull();
      else expect(radicalNumber(m.tan!)).toBeCloseTo(Math.tan(theta), 10);
      expect(textR(m.theta)).toBe(textR(r));
    }
    expect(checkCircularValue('0.70710678', circularAt('1/4').sin)).toBe(false);
    expect(checkCircularValue('Infinity', null)).toBe(false);
    expect(checkCircularValue('无定义', null)).toBe(true);
    for (const a of ['1/5', '201', '-201'])
      expect(() => circularAt(a)).toThrow();
  });
  it('tracks exact wave outputs, reflection, half-period scaling and constant degeneracy', () => {
    let count = 0;
    for (const family of ['sin', 'cos'] as const)
      for (const a of [-2, 0, 3])
        for (const b of [-2, -1, 1, 2])
          for (const h of ['-1/2', '0', '1/4'])
            for (const d of [-1, 0, 2])
              for (const x of ['0', '1/4', '1/2']) {
                const m = waveModel(
                    { family, a: String(a), b: String(b), h, d: String(d) },
                    x,
                  ),
                  v = (s: string) =>
                    Number(readRational(s)[0]) / Number(readRational(s)[1]);
                expect(radicalNumber(m.output)).toBeCloseTo(
                  d + a * Math[family](b * (v(x) - v(h)) * Math.PI),
                  11,
                );
                expect(textR(m.amplitude)).toBe(String(Math.abs(a)));
                expect(
                  m.period ? Number(m.period[0]) / Number(m.period[1]) : null,
                ).toBe(a === 0 ? null : 2 / Math.abs(b));
                count++;
              }
    expect(count).toBe(648);
    expect(
      waveModel({ family: 'sin', a: '0', b: '2', h: '0', d: '3' }, '1/5')
        .output,
    ).toBe('3');
    expect(
      waveModel({ family: 'sin', a: '3', b: '2', h: '1/2', d: '4' }, '3/4')
        .output,
    ).toBe('7');
    expect(() =>
      waveModel({ family: 'sin', a: '1', b: '0', h: '0', d: '0' }, '0'),
    ).toThrow();
  });
  it('proves supported identities by exact elimination and separately checks completion form', () => {
    expect(circleRemainder('s^2+c^2-1')?.size).toBe(0);
    expect(circleRemainder('(s^2+c^2)^2-1')?.size).toBe(0);
    expect(checkCircleIdentity('(s+c)^2-2sc', '1')).toBe(true);
    expect(checkCircleIdentity('s+c', '1')).toBe(false);
    expect(checkCircleIdentity('c^2', '1-s^2')).toBe(true);
    expect(checkCircleIdentity('1-c^2', 's^2', 's')).toBe(false);
    expect(checkCircleIdentity('s^2', 's^2', 's')).toBe(true);
    expect(checkCircleIdentity('s^2+c^2', '1', 'constant')).toBe(false);
    expect(checkCircleIdentity('(1-c^2)/s^2', '1')).toBe(false);
    expect(checkCircleIdentity('s^2+c^2', '1')).toBe(true);
    for (const s of ['s^8', '1/s', 'sin(x)', 'c^2=1-s^2'])
      expect(checkCircleIdentity(s, '1')).toBe(false);
  });
  it('finds complete finite roots under signs, inner multipliers, shifts and three endpoint conventions', () => {
    const base = {
      family: 'sin' as const,
      b: '1',
      h: '0',
      target: '0',
      low: '0',
      high: '2',
      lowClosed: true,
      highClosed: true,
    };
    expect(solutionText(circularSolutions(base))).toBe('{0,pi,2pi}');
    expect(solutionText(circularSolutions({ ...base, lowClosed: false }))).toBe(
      '{pi,2pi}',
    );
    expect(
      solutionText(circularSolutions({ ...base, highClosed: false })),
    ).toBe('{0,pi}');
    expect(
      solutionText(
        circularSolutions({
          ...base,
          b: '2',
          target: '1/2',
          highClosed: false,
        }),
      ),
    ).toBe('{pi/12,5pi/12,13pi/12,17pi/12}');
    expect(
      solutionText(
        circularSolutions({
          ...base,
          h: '1/4',
          target: '1/2',
          highClosed: false,
        }),
      ),
    ).toBe('{5pi/12,13pi/12}');
    expect(
      solutionText(
        circularSolutions({
          ...base,
          family: 'tan',
          target: '1',
          low: '-1',
          high: '1',
          highClosed: false,
        }),
      ),
    ).toBe('{-3pi/4,pi/4}');
    let count = 0;
    for (const family of ['sin', 'cos', 'tan'] as CircularFamily[])
      for (const target of family === 'tan'
        ? ['0', '1', '-1']
        : ['0', '1/2', '-1/2', '1', '-1', '2'])
        for (const b of [-2, -1, 1, 2])
          for (const h of ['0', '1/2'])
            for (const bounds of [
              { low: 0, high: 2, lc: true, hc: false },
              { low: 0, high: 2, lc: false, hc: true },
              { low: -1, high: 1, lc: true, hc: true },
            ]) {
              const expected: string[] = [],
                level =
                  target === '1/2'
                    ? 0.5
                    : target === '-1/2'
                      ? -0.5
                      : Number(target),
                shift = h === '0' ? 0 : 0.5;
              for (let j = -24; j <= 48; j++) {
                const x = j / 24;
                if (
                  x < bounds.low ||
                  x > bounds.high ||
                  (x === bounds.low && !bounds.lc) ||
                  (x === bounds.high && !bounds.hc)
                )
                  continue;
                const u = b * (x - shift) * Math.PI;
                if (family === 'tan' && Math.abs(Math.cos(u)) < 1e-9) continue;
                if (Math.abs(Math[family](u) - level) < 1e-9)
                  expected.push(textR(rational(BigInt(j), 24n)));
              }
              const roots = circularSolutions({
                family,
                target,
                b: String(b),
                h,
                low: String(bounds.low),
                high: String(bounds.high),
                lowClosed: bounds.lc,
                highClosed: bounds.hc,
              });
              expect(roots.map(textR)).toEqual(expected);
              count++;
            }
    expect(count).toBe(360);
    expect(() => circularSolutions({ ...base, target: '1/3' })).toThrow();
    expect(() => circularSolutions({ ...base, b: '0' })).toThrow();
    expect(() => circularSolutions({ ...base, low: '3' })).toThrow();
  });
  it('independently verifies 144 retrieval variants and preserves round IDs without claiming infinite uniqueness', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 24; k++) {
        const id = `H04-L0${i + 1}`,
          q = h04ReviewQuestion(id, k);
        let a: string;
        if (i === 0) a = angleText(rational(BigInt(k - 8), 12n));
        else if (i === 1 || i === 2) {
          const f = (
              i === 1 ? ['sin', 'cos', 'tan'][k % 3] : ['sin', 'cos'][k % 2]
            ) as CircularFamily,
            theta = ((k - (i === 1 ? 6 : 0)) * Math.PI) / 12;
          if (f === 'tan' && Math.abs(Math.cos(theta)) < 1e-9) a = 'undefined';
          else {
            expect(q.answer.kind).toBe('circle-trig');
            const value = (
              q.answer as Extract<typeof q.answer, { kind: 'circle-trig' }>
            ).value;
            expect(radicalNumber(value)).toBeCloseTo(Math[f](theta), 10);
            a = value;
          }
        } else if (i === 3)
          a =
            k % 2
              ? angleText(rational(2n, BigInt((k % 4) + 1)))
              : String((Math.floor(k / 4) % 3) + 1);
        else if (i === 4) a = String(k + 1);
        else {
          const f = ['sin', 'cos', 'tan'][
              Math.floor(k / 4) % 3
            ] as CircularFamily,
            n = (k % 4) + 1,
            target = k < 12 ? 0 : 1,
            out: string[] = [];
          for (let j = 0; j < n * 12; j++) {
            const x = j / 12,
              u = x * Math.PI;
            if (f === 'tan' && Math.abs(Math.cos(u)) < 1e-9) continue;
            if (Math.abs(Math[f](u) - target) < 1e-9)
              out.push(angleText(rational(BigInt(j), 12n)));
          }
          a = `{${out.join(',')}}`;
        }
        expect(checkAnswer(a, q.answer), q.id).toBe(true);
        expect(h04ReviewQuestion(id, k + 24).answer).toEqual(q.answer);
        expect(h04ReviewQuestion(id, k + 24).id).not.toBe(q.id);
      }
    for (const l of h04Lessons)
      expect(
        new Set(
          Array.from(
            { length: 24 },
            (_, k) => h04ReviewQuestion(l.id, k).stem.en,
          ),
        ).size,
      ).toBe(24);
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h04ReviewQuestion('H04-L01', n)).toThrow();
    expect(() => h04ReviewQuestion('H04-L07', 0)).toThrow();
  });
});
