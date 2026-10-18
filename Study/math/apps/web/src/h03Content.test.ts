import { describe, it, expect } from 'vitest';
import {
  h03Lessons,
  h03CheckQuestions,
  h03ReviewQuestion,
} from './content/H03';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { rational, textR, sameR, mulR } from './algebraModels';
import {
  integerPower,
  rationalPower,
  exactLog,
  exponentialAt,
  firstWholeStep,
  readPositive,
} from './exponentialModels';
const bodies = import.meta.glob('../../../content/lessons/H03-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h03Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h03CheckQuestions,
];
describe('H03 complete bilingual unit and exact exponential models', () => {
  it('opens precisely the planned six titles, maintains earlier prerequisites and registers review/check routes', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(244);
    expect(openUnits.length).toBeGreaterThanOrEqual(46);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H03-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h03Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H03.questions).toEqual(h03CheckQuestions);
    for (const l of h03Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const earlier = lessons.findIndex((p) => p.id === id);
        expect(earlier, id).toBeGreaterThanOrEqual(0);
        expect(earlier).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h03ReviewQuestion(l.id, 0));
    }
    expect(h03Lessons[5]!.familyChallenge?.en).toContain('assumptions');
  });
  it('anchors every guided, practice and exit answer independently, leaving arguments human-reviewed', () => {
    const anchors = [
      ['1/8', '1/9', '1/64', '1/4', '6/5', '64'],
      ['9', '8', '1/9', '8', '4', null],
      ['48', '64', '5/4', '3/2', '7', '3'],
      ['-3', '0', '-3', '1/25', '3/2', '2'],
      ['5', '3', '0', '2/3', '3', null],
      ['3', '2.8', '3', '121', '2', null],
    ];
    h03Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((v, j) =>
        expect(checkAnswer(v ?? 'reason', qs[j]!.answer), qs[j]!.id).toBe(
          v === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([1, 1, 1, 2, 1, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(11);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.stem.en).toBeTruthy();
      expect(q.stem.zh).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('log domain exponent', q.answer)).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('preserves exact reciprocal laws and excludes undefined zero powers', () => {
    for (let a = -5; a <= 5; a++)
      if (a)
        for (let m = -8; m <= 8; m++)
          for (let n = -8; n <= 8; n++) {
            const b = rational(BigInt(a), 3n);
            expect(
              sameR(
                mulR(integerPower(b, m), integerPower(b, n)),
                integerPower(b, m + n),
              ),
            ).toBe(true);
          }
    expect(textR(integerPower(rational(-2n), -3))).toBe('-1/8');
    expect(textR(integerPower(rational(0n), 3))).toBe('0');
    for (const n of [0, -1, 0.5, Infinity, 41])
      expect(() => integerPower(rational(0n), n)).toThrow();
  });
  it('uses reduced positive-base rational powers and distinguishes irrational from undefined', () => {
    for (let root = 1; root <= 5; root++)
      for (let degree = 2; degree <= 6; degree++)
        for (let p = -4; p <= 4; p++) {
          const actual = rationalPower(
            rational(BigInt(root) ** BigInt(degree)),
            rational(BigInt(p), BigInt(degree)),
          )!;
          const expected =
            p < 0
              ? rational(1n, BigInt(root) ** BigInt(-p))
              : rational(BigInt(root) ** BigInt(p));
          expect(sameR(actual, expected)).toBe(true);
        }
    expect(textR(rationalPower(readPositive('1/16'), rational(-3n, 4n))!)).toBe(
      '8',
    );
    expect(textR(rationalPower(readPositive('64'), rational(2n, 6n))!)).toBe(
      '4',
    );
    expect(rationalPower(readPositive('2'), rational(1n, 2n))).toBeNull();
    for (const b of [rational(0n), rational(-8n)])
      expect(() => rationalPower(b, rational(1n, 3n))).toThrow();
    expect(() => rationalPower(rational(2n), rational(1n, 13n))).toThrow();
  });
  it('finds rational logarithms by exact prime vectors, including fractional bases and arguments', () => {
    for (const [a, b, expected] of [
      ['2', '8', '3'],
      ['2', '1/8', '-3'],
      ['1/2', '8', '-3'],
      ['4', '8', '3/2'],
      ['8', '4', '2/3'],
      ['9/4', '27/8', '3/2'],
      ['4/9', '8/27', '3/2'],
      ['2/3', '1', '0'],
    ]) {
      expect(textR(exactLog(readPositive(a!), readPositive(b!))!)).toBe(
        expected,
      );
    }
    expect(exactLog(readPositive('2'), readPositive('3'))).toBeNull();
    expect(exactLog(readPositive('4/9'), readPositive('2/9'))).toBeNull();
    for (const b of [rational(0n), rational(-1n), rational(1n)])
      expect(() => exactLog(b, rational(1n))).toThrow();
    for (const y of [rational(0n), rational(-4n)])
      expect(() => exactLog(rational(2n), y)).toThrow();
    expect(() => exactLog(rational(1000001n), rational(2n))).toThrow();
  });
  it('audits first integer thresholds independently on growth, decay, equality and initially-met cases', () => {
    for (let target = 1; target <= 100; target++) {
      const growth = firstWholeStep(
        rational(5n),
        rational(2n),
        rational(BigInt(target)),
      )!;
      expect(5 * 2 ** growth).toBeGreaterThanOrEqual(target);
      if (growth > 0) expect(5 * 2 ** (growth - 1)).toBeLessThan(target);
      const decay = firstWholeStep(
        rational(80n),
        rational(1n, 2n),
        rational(BigInt(target)),
      )!;
      expect(80 / 2 ** decay).toBeLessThanOrEqual(target);
      if (decay > 0) expect(80 / 2 ** (decay - 1)).toBeGreaterThan(target);
    }
    expect(firstWholeStep(rational(5n), rational(1n), rational(6n))).toBeNull();
    expect(firstWholeStep(rational(5n), rational(1n), rational(4n))).toBe(0);
    expect(() =>
      firstWholeStep(rational(0n), rational(2n), rational(4n)),
    ).toThrow();
    expect(textR(exponentialAt(rational(100n), rational(11n, 10n), 2))).toBe(
      '121',
    );
  });
  it('keeps equivalent numeric forms, domains and principal radical values distinct', () => {
    expect(checkAnswer('64 cm', h03Lessons[0]!.exit.answer)).toBe(true);
    expect(checkAnswer('64 m', h03Lessons[0]!.exit.answer)).toBe(false);
    expect(checkAnswer('2.80 days', h03Lessons[5]!.questions[1]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('2.8天', h03Lessons[5]!.questions[1]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('2.8 h', h03Lessons[5]!.questions[1]!.answer)).toBe(
      false,
    );
    expect(checkAnswer('3 hours', h03Lessons[5]!.questions[2]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('3 days', h03Lessons[5]!.questions[2]!.answer)).toBe(
      false,
    );
    expect(checkAnswer('0.125', h03Lessons[0]!.guided.answer)).toBe(true);
    expect(checkAnswer('-1/8', h03Lessons[0]!.guided.answer)).toBe(false);
    expect(checkAnswer('sqrt(2)', { kind: 'radical', value: 'sqrt(2)' })).toBe(
      true,
    );
    expect(checkAnswer('1.414', { kind: 'radical', value: 'sqrt(2)' })).toBe(
      false,
    );
    expect(checkAnswer('±sqrt(2)', { kind: 'radical', value: 'sqrt(2)' })).toBe(
      false,
    );
    expect(
      checkAnswer('3sqrt(2)/2', { kind: 'radical', value: '3sqrt(2)/2' }),
    ).toBe(true);
  });
  it('independently checks 144 retrieval variants and bounded round IDs', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 24; k++) {
        const id = `H03-L0${i + 1}`,
          q = h03ReviewQuestion(id, k),
          b = 2 + Math.floor(k / (i === 2 ? 5 : 9)),
          n = (k % 9) - 4;
        const expected =
          i === 0
            ? n >= 0
              ? String(b ** n)
              : `1/${b ** -n}`
            : i === 1
              ? (k % 5) - 2 >= 0
                ? String((2 + Math.floor(k / 5)) ** ((k % 5) - 2))
                : `1/${(2 + Math.floor(k / 5)) ** (2 - (k % 5))}`
              : i === 2
                ? String(3 * b ** (k % 5))
                : i === 3
                  ? String(n)
                  : i === 4
                    ? String(Math.floor(k / 4) - (k % 4))
                    : String(Math.ceil(Math.log2((11 + k) / 5)));
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('999', q.answer)).toBe(false);
        expect(h03ReviewQuestion(id, k + 24).answer).toEqual(q.answer);
        expect(h03ReviewQuestion(id, k + 24).id).not.toBe(q.id);
      }
    for (const l of h03Lessons)
      expect(
        new Set(
          Array.from(
            { length: 24 },
            (_, k) => h03ReviewQuestion(l.id, k).stem.en,
          ),
        ).size,
      ).toBe(24);
    for (const round of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => h03ReviewQuestion('H03-L01', round)).toThrow();
    expect(() => h03ReviewQuestion('H03-L07', 0)).toThrow();
    expect(h03ReviewQuestion('H03-L06', 100000).id).toBe('H03-L06-R100000');
  });
});
