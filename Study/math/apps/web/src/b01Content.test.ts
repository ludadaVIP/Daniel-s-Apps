import { describe, expect, it } from 'vitest';
import {
  b01Lessons,
  b01CheckQuestions,
  b01ReviewQuestion,
} from './content/B01';
import { checkAnswer } from './model';
import {
  placeValues,
  readWholeNumber,
  roundingModel,
  axisPosition,
  exchangeHundred,
  blockValue,
} from './numberModels';
const markdown = import.meta.glob('../../../content/lessons/B01-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
describe('B01 complete content contract', () => {
  it('has all five planned lessons, a complete bilingual explanation and real progression', () => {
    expect(b01Lessons.map((l) => l.id)).toEqual([
      'B01-L01',
      'B01-L02',
      'B01-L03',
      'B01-L04',
      'B01-L05',
    ]);
    for (const l of b01Lessons) {
      const text = markdown[`../../../content/lessons/${l.id}.md`]!;
      const [zh, en] = text.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.stage).toBe('B00');
      expect(l.unit).toBe('B01');
      expect(l.keywords).toHaveLength(3);
      expect(l.nzYearHints).toContain(6);
      expect(l.cnGradeHints!.length).toBeGreaterThan(0);
      expect(l.objective.zh).toBeTruthy();
      expect(l.objective.en).toBeTruthy();
      expect(l.questions).toHaveLength(6);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice').length,
      ).toBeLessThan(3);
      expect(l.questions.some((q) => q.answer.kind === 'explain')).toBe(true);
      l.prerequisites.forEach((id) =>
        expect(
          b01Lessons.some(
            (prereq) => prereq.id === id && prereq.order! < l.order!,
          ),
        ).toBe(true),
      );
      expect(b01Lessons.some((p) => p.id === l.parent.bridge)).toBe(true);
    }
    expect(b01Lessons[4]!.familyChallenge!.en).toContain('Family challenge');
  });
  it('checks every automatic answer against authored equivalents and meaningful incorrect answers', () => {
    const questions = [
      ...b01Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
      ...b01CheckQuestions,
    ];
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const q of questions) {
      expect(q.lessonId).toBeTruthy();
      expect(q.hints).toHaveLength(2);
      q.hints.forEach((h) => {
        expect(h.zh).toBeTruthy();
        expect(h.en).toBeTruthy();
      });
      expect(q.misconceptionTags!.length).toBeGreaterThan(0);
      expect(q.skill).toBeTruthy();
      expect(q.solution.zh).toBeTruthy();
      expect(q.solution.en).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        continue;
      }
      expect(q.solutionSteps!.length).toBeGreaterThan(0);
      expect(q.answerChecks!.accepted.length).toBeGreaterThan(0);
      expect(q.answerChecks!.rejected.length).toBeGreaterThan(0);
      q.answerChecks!.accepted.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((a) =>
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
      );
    }
    expect(b01CheckQuestions).toHaveLength(7);
  });
  it('independently verifies the new scenario answers, including carries and non-zero starts', () => {
    const oracle: Record<string, number> = {
      'B01-L01-G': 6 * 1000 + 4 * 10,
      'B01-L01-Q2': 8 * 10000 + 6,
      'B01-L01-Q3': 5 * 1000 + 7 * 10 + 2,
      'B01-L01-Q4': 200000 + 3000 + 9,
      'B01-L01-Q5': 1000000 + 20,
      'B01-L01-X': 4 * 100000 + 6 * 10,
      'B01-L02-G': 2 * 1000,
      'B01-L02-Q2': 40000 + 600 + 9,
      'B01-L02-Q3': 2 * 100,
      'B01-L02-Q4': 6000 / 600,
      'B01-L02-Q5': 9 * 1000 + 8 * 10 + 4,
      'B01-L02-X': 5 * 10000 + 7 * 100 + 2,
      'B01-L03-G': Math.max(5408, 5480),
      'B01-L03-Q2': [7306, 7360, 7036].sort((a, b) => a - b)[1]!,
      'B01-L03-Q3': 500 + 3 * 20,
      'B01-L03-Q4': 9870 - 9807,
      'B01-L03-Q5': Math.max(9999, 10002),
      'B01-L03-X': 1000 + 4 * 50,
      'B01-L04-G': Math.round(3465 / 100) * 100,
      'B01-L04-Q2': Math.round(6244 / 10) * 10,
      'B01-L04-Q3': Math.round(9995 / 10) * 10,
      'B01-L04-Q4': Math.round(3465 / 1000) * 1000,
      'B01-L04-Q5': Math.round(1980 / 100) * 100 + Math.round(3040 / 100) * 100,
      'B01-L04-X': Math.round(7850 / 100) * 100,
      'B01-L05-G': 3 * 100 + 2 * 10 + 5,
      'B01-L05-Q2': 4 * 100 + 6,
      'B01-L05-Q3': 10 * 10,
      'B01-L05-Q4': 2 * 100 + 14 * 10 + 3,
      'B01-L05-Q5': 230 - 203,
      'B01-L05-X': 3 * 100 + 13 * 10 + 7,
      'B01-CHECK-Q1': 90000 + 300 + 20,
      'B01-CHECK-Q2': 8 * 100,
      'B01-CHECK-Q3': Math.min(6090, 6900),
      'B01-CHECK-Q4': 300 + 3 * 50,
      'B01-CHECK-Q5': Math.round(8467 / 100) * 100,
      'B01-CHECK-Q6': 2 * 100 + 13 * 10 + 6,
    };
    const questions = [
      ...b01Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
      ...b01CheckQuestions,
    ];
    const auto = questions.filter((q) => q.answer.kind === 'number');
    expect(auto).toHaveLength(Object.keys(oracle).length);
    auto.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
  });
  it('keeps eighty review variations bounded and mathematically consistent', () => {
    for (let round = 0; round < 80; round++)
      for (const l of b01Lessons) {
        const q = b01ReviewQuestion(l.id, round);
        expect(q.answer.kind).toBe('number');
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id).toBe(false),
        );
        const expected =
          l.order === 1
            ? (31 + round) * 1000 + 7
            : l.order === 2
              ? (2 + (round % 7)) * 1000
              : l.order === 3
                ? 200 + round * 100 + 60
                : l.order === 4
                  ? Math.round((1245 + round * 100) / 10) * 10
                  : (1 + (round % 5)) * 100 +
                    (11 + (round % 8)) * 10 +
                    (round % 10);
        expect(checkAnswer(String(expected), q.answer), q.id).toBe(true);
      }
  });
});
describe('honest number models', () => {
  it('accepts thousands grouping without silently accepting malformed punctuation', () => {
    expect(checkAnswer('90,320', { kind: 'number', value: '90320' })).toBe(
      true,
    );
    expect(checkAnswer('90320', { kind: 'number', value: '90320' })).toBe(true);
    expect(checkAnswer('90,32', { kind: 'number', value: '9032' })).toBe(false);
    expect(checkAnswer('1,23,456', { kind: 'number', value: '123456' })).toBe(
      false,
    );
    expect(checkAnswer('90,320 cm', { kind: 'number', value: '90320' })).toBe(
      false,
    );
  });
  it.each([
    [0, '零', 'zero'],
    [10, '十', 'ten'],
    [1005, '一千零五', 'one thousand and five'],
    [10005, '一万零五', 'ten thousand and five'],
    [207040, '二十万七千零四十', 'two hundred and seven thousand and forty'],
    [
      340601,
      '三十四万零六百零一',
      'three hundred and forty thousand six hundred and one',
    ],
    [1000001, '一百万零一', 'one million and one'],
  ])('reads %i in both grouping systems', (n, zh, en) =>
    expect(readWholeNumber(Number(n))).toEqual({ zh, en }),
  );
  it('preserves each digit contribution across the supported range', () => {
    for (const n of [0, 7, 40, 406, 6040, 10005, 203009, 1000020, 9999999]) {
      const parts = placeValues(n);
      expect(parts.reduce((sum, p) => sum + p.contribution, 0)).toBe(n);
      expect(parts.map((p) => p.digit).join('')).toBe(
        String(n).padStart(7, '0'),
      );
    }
    expect(() => placeValues(-1)).toThrow();
    expect(() => placeValues(10000000)).toThrow();
  });
  it('rounds directly to the requested unit, handles ties and conserves distances', () => {
    expect(roundingModel(3465, 100).rounded).toBe(3500);
    expect(roundingModel(3465, 1000).rounded).toBe(3000);
    expect(roundingModel(9995, 10).rounded).toBe(10000);
    expect(roundingModel(4499, 1000).rounded).toBe(4000);
    expect(roundingModel(roundingModel(4499, 100).rounded, 1000).rounded).toBe(
      5000,
    );
    for (const u of [10, 100, 1000])
      for (const n of [0, 1, 50, 999, 3450, 3465, 9995, 10000]) {
        const m = roundingModel(n, u);
        expect(m.distanceLower + m.distanceUpper).toBe(u);
        expect(m.rounded % u).toBe(0);
        expect(m.rounded).toBe(Math.round(n / u) * u);
      }
  });
  it('uses true numerical distances for every zoom window', () => {
    expect(axisPosition(512, 0, 1000)).toBe(0.512);
    expect(axisPosition(512, 400, 600)).toBe(0.56);
    expect(axisPosition(512, 500, 520)).toBe(0.6);
    expect(axisPosition(560, 500, 600)).toBe(0.6);
    expect(() => axisPosition(1200, 500, 600)).toThrow();
    expect(() => axisPosition(1, 5, 5)).toThrow();
  });
  it('preserves total units in both directions of every permitted block exchange', () => {
    for (let hundreds = 0; hundreds < 5; hundreds++)
      for (let tens = 0; tens < 30; tens++)
        for (let ones = 0; ones < 10; ones++) {
          const b = { hundreds, tens, ones };
          for (const direction of ['to-tens', 'to-hundred'] as const) {
            const next = exchangeHundred(b, direction);
            expect(blockValue(next)).toBe(blockValue(b));
            expect(Object.values(next).every((v) => v >= 0)).toBe(true);
          }
        }
  });
});
