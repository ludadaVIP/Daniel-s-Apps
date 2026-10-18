import { describe, it, expect } from 'vitest';
import {
  h05Lessons,
  h05CheckQuestions,
  h05ReviewQuestion,
} from './content/H05';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { rational, textR, sameR, mulR } from './algebraModels';
import { radicalNumber } from './trigModels';
import {
  readVector,
  vectorText,
  addV,
  subtractV,
  scaleV,
  dotV,
  crossV,
  squareV,
  sameV,
  isZeroV,
  betweenV,
  midpointV,
  lengthV,
  directionV,
  angleV,
  multipleV,
  geometricCase,
  checkVectorCode,
} from './vectorModels';
const bodies = import.meta.glob('../../../content/lessons/H05-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h05Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h05CheckQuestions,
];
describe('H05 plane vectors', () => {
  it('opens the six verified planned titles with complete bilingual bodies and earlier prerequisites', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(256);
    expect(openUnits.length).toBeGreaterThanOrEqual(48);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H05-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h05Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H05.questions).toEqual(h05CheckQuestions);
    for (const l of h05Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h05ReviewQuestion(l.id, 0));
    }
  });
  it('checks authored anchors, canonical answers, distractors and fourteen human arguments', () => {
    const anchors = [
      ['5', 'equal', 'different', 'same-direction', '0', null],
      ['(2,6)', '(4,-2)', '(-2,0)', '(0,0)', '(0,5)', null],
      ['(-6,2)', '(-2,3)', '10', 'undefined', '-3', null],
      ['(5,3)', '(-5,-3)', '(4,2)', '(1/2,5/2)', 'sqrt(13)', null],
      ['1', '90°', 'sqrt(2)/2', 'obtuse', 'undefined', null],
      ['(5,3)', '(5/2,3/2)', 'rectangle', 'rhombus', 'degenerate', null],
    ];
    h05Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((a, j) =>
        expect(checkAnswer(a ?? 'argument', qs[j]!.answer), qs[j]!.id).toBe(
          a === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([1, 0, 1, 2, 1, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.stem.zh).toBeTruthy();
      expect(q.stem.en).toBeTruthy();
      expect(q.solution.en).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('vector scalar angle', q.answer)).toBeNull();
        continue;
      }
      expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('parses rational components and distinguishes equivalent values from malformed or wrongly ordered pairs', () => {
    expect(vectorText(readVector('（1/2，−0.75）'))).toBe('(1/2, -3/4)');
    expect(checkAnswer('(10/2,6/2)', h05Lessons[3]!.guided.answer)).toBe(true);
    expect(checkAnswer('(3,5)', h05Lessons[3]!.guided.answer)).toBe(false);
    for (const s of [
      '(1,2,3)',
      '(1/0,2)',
      '(NaN,2)',
      '(1m,2m)',
      '[1,2]',
      '(sqrt(2),1)',
    ])
      expect(() => readVector(s)).toThrow();
    expect(checkVectorCode('反向', 'opposite-direction')).toBe(true);
    expect(checkVectorCode('钝角', 'straight')).toBe(false);
    expect(checkAnswer('0.707', h05Lessons[4]!.questions[2]!.answer)).toBe(
      false,
    );
  });
  it('verifies rational algebra and position invariants on 1225 independent integer vector pairs', () => {
    let count = 0;
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++)
        for (let a = -2; a <= 2; a++)
          for (let b = -2; b <= 2; b++) {
            const u = readVector(`(${x},${y})`),
              v = readVector(`(${a},${b})`),
              shift = readVector('(2,-1)');
            expect(vectorText(addV(u, v))).toBe(`(${x + a}, ${y + b})`);
            expect(vectorText(subtractV(u, v))).toBe(`(${x - a}, ${y - b})`);
            expect(sameV(addV(u, v), addV(v, u))).toBe(true);
            expect(vectorText(addV(u, betweenV(u, v)))).toBe(vectorText(v));
            expect(vectorText(betweenV(addV(u, shift), addV(v, shift)))).toBe(
              `(${a - x}, ${b - y})`,
            );
            expect(textR(dotV(u, v))).toBe(String(x * a + y * b));
            expect(textR(crossV(u, v))).toBe(String(x * b - y * a));
            expect(textR(squareV(u))).toBe(String(x * x + y * y));
            const mid = midpointV(u, v);
            expect(sameR(mid[0], rational(BigInt(x + a), 2n))).toBe(true);
            expect(sameR(mid[1], rational(BigInt(y + b), 2n))).toBe(true);
            count++;
          }
    expect(count).toBe(1225);
  });
  it('checks scalar laws, magnitude scaling and all/none/unique multiplier cases without dividing by a zero component', () => {
    let count = 0;
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++)
        for (let n = -4; n <= 4; n++) {
          const u = readVector(`(${x},${y})`),
            v = readVector('(2,-1)'),
            k = rational(BigInt(n), 2n),
            scaled = scaleV(k, u);
          expect(
            sameV(scaleV(k, addV(u, v)), addV(scaleV(k, u), scaleV(k, v))),
          ).toBe(true);
          expect(textR(squareV(scaled))).toBe(
            textR(rational(BigInt(n * n * (x * x + y * y)), 4n)),
          );
          const recovered = multipleV(u, scaled);
          if (x === 0 && y === 0) expect(recovered.kind).toBe('all');
          else {
            expect(recovered.kind).toBe('unique');
            if (recovered.kind === 'unique')
              expect(sameR(recovered.factor, k)).toBe(true);
          }
          count++;
        }
    expect(count).toBe(441);
    expect(multipleV(readVector('(0,0)'), readVector('(1,0)')).kind).toBe(
      'none',
    );
    expect(multipleV(readVector('(0,2)'), readVector('(0,-6)'))).toEqual({
      kind: 'unique',
      factor: rational(-3n),
    });
    expect(multipleV(readVector('(1,2)'), readVector('(2,5)')).kind).toBe(
      'none',
    );
    expect(
      checkAnswer(lengthV(readVector('(-6,2)')), {
        kind: 'radical',
        value: '2sqrt(10)',
      }),
    ).toBe(true);
  });
  it('handles directions, exact cosines, strict endpoint angles and zero vectors on an independent grid', () => {
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++)
        for (let a = -2; a <= 2; a++)
          for (let b = -2; b <= 2; b++) {
            const u = readVector(`(${x},${y})`),
              v = readVector(`(${a},${b})`),
              dot = x * a + y * b,
              cross = x * b - y * a,
              zero = (x === 0 && y === 0) || (a === 0 && b === 0),
              m = angleV(u, v),
              expected = zero
                ? 'undefined'
                : cross === 0
                  ? dot > 0
                    ? 'zero-angle'
                    : 'straight'
                  : dot === 0
                    ? 'right'
                    : dot > 0
                      ? 'acute'
                      : 'obtuse';
            expect(m.kind).toBe(expected);
            expect(directionV(u, v)).toBe(
              zero
                ? 'undefined'
                : cross !== 0
                  ? 'not-parallel'
                  : dot > 0
                    ? 'same-direction'
                    : 'opposite-direction',
            );
            if (zero) expect(m.cosine).toBeNull();
            else
              expect(radicalNumber(m.cosine!)).toBeCloseTo(
                dot / (Math.hypot(x, y) * Math.hypot(a, b)),
                12,
              );
            expect(dot * dot + cross * cross).toBe(
              (x * x + y * y) * (a * a + b * b),
            );
          }
    expect(
      checkAnswer(
        angleV(readVector('(1,0)'), readVector('(1,1)')).cosine ?? '',
        { kind: 'radical', value: 'sqrt(2)/2' },
      ),
    ).toBe(true);
    expect(angleV(readVector('(3,0)'), readVector('(-2,0)')).kind).toBe(
      'straight',
    );
    expect(angleV(readVector('(0,0)'), readVector('(0,0)')).dot[0]).toBe(0n);
    expect(isZeroV(readVector('(0,0)'))).toBe(true);
  });
  it('verifies 175 translated geometry cases with exact fourth vertices, areas, midpoints and classification premises', () => {
    const cases = [
      ['general', 4, 1, 1, 3, 'parallelogram', 11],
      ['rectangle', 4, 0, 0, 3, 'rectangle', 12],
      ['rhombus', 3, 1, 1, 3, 'rhombus', 8],
      ['square', 3, 1, -1, 3, 'square', 10],
      ['degenerate', 4, 0, 2, 0, 'degenerate', 0],
    ] as const;
    let count = 0;
    for (const [name, ux, uy, vx, vy, kind, area] of cases)
      for (let tx = -3; tx <= 3; tx++)
        for (let ty = -2; ty <= 2; ty++) {
          const m = geometricCase(name, `(${tx},${ty})`),
            ax = -2 + tx,
            ay = -1 + ty;
          expect(vectorText(m.c)).toBe(`(${ax + ux + vx}, ${ay + uy + vy})`);
          expect(m.kind).toBe(kind);
          expect(textR(m.area)).toBe(String(area));
          expect(sameV(m.midAC, m.midBD)).toBe(true);
          expect(
            sameR(m.midAC[0], rational(BigInt(2 * ax + ux + vx), 2n)),
          ).toBe(true);
          expect(
            sameR(m.midAC[1], rational(BigInt(2 * ay + uy + vy), 2n)),
          ).toBe(true);
          count++;
        }
    expect(count).toBe(175);
    const a = readVector('(-2,0)'),
      b = readVector('(2,0)'),
      c = readVector('(1,2)'),
      d = readVector('(-1,2)');
    expect(textR(squareV(betweenV(a, c)))).toBe('13');
    expect(textR(squareV(betweenV(b, d)))).toBe('13');
    expect(sameV(c, subtractV(addV(b, d), a))).toBe(false);
  });
  it('audits the family challenge with distinct route lengths, a common displacement and squared unit scaling', () => {
    const m = geometricCase('square', '(2,1)'),
      k = rational(10n),
      edgeA = scaleV(k, m.u),
      edgeB = scaleV(k, m.v),
      diagonal = scaleV(k, betweenV(m.a, m.c));
    expect(vectorText(diagonal)).toBe('(20, 40)');
    expect(sameV(addV(edgeA, edgeB), diagonal)).toBe(true);
    expect(
      checkAnswer(`(${lengthV(edgeA)})+(${lengthV(edgeB)})`, {
        kind: 'radical',
        value: '20sqrt(10)',
      }),
    ).toBe(true);
    expect(
      checkAnswer(lengthV(diagonal), { kind: 'radical', value: '20sqrt(5)' }),
    ).toBe(true);
    expect(vectorText(scaleV(k, m.midAC))).toBe('(10, 20)');
    expect(textR(mulR(rational(100n), m.area))).toBe('1000');
    expect(h05Lessons[5]!.familyChallenge?.en).toContain('ten metres');
  });
  it('retrieves 144 independently checked variants including zero, same-direction and degenerate boundaries', () => {
    const caseData = [
      [4, 1, 1, 3, 'parallelogram'],
      [4, 0, 0, 3, 'rectangle'],
      [3, 1, 1, 3, 'rhombus'],
      [3, 1, -1, 3, 'square'],
      [4, 0, 2, 0, 'degenerate'],
    ] as const;
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 24; k++) {
        const id = `H05-L0${i + 1}`,
          q = h05ReviewQuestion(id, k),
          x = (k % 6) - 2,
          y = Math.floor(k / 6) - 1;
        let expected: string;
        if (i === 0) expected = `sqrt(${x * x + y * y})`;
        else if (i === 1)
          expected =
            k % 2 === 0 ? `(${x + 2},${y - 1})` : `(${x - 2},${y + 1})`;
        else if (i === 2)
          expected = `(${(((k % 5) - 2) * x) / 2},${(((k % 5) - 2) * y) / 2})`;
        else if (i === 3) {
          const dx = (k % 4) - 1,
            dy = (Math.floor(k / 4) % 3) + 1;
          expected = k % 2 ? `(${x + dx / 2},${y + dy / 2})` : `(${dx},${dy})`;
        } else if (i === 4) {
          const dot = 2 * x - y,
            cross = -x - 2 * y;
          expected =
            k % 3 === 0 || k === 4 || k === 8
              ? x === 0 && y === 0
                ? 'undefined'
                : cross === 0
                  ? dot > 0
                    ? 'zero-angle'
                    : 'straight'
                  : dot === 0
                    ? 'right'
                    : dot > 0
                      ? 'acute'
                      : 'obtuse'
              : String(dot);
        } else {
          const [ux, uy, vx, vy, kind] = caseData[k % 5]!;
          expected =
            k % 3 === 0 ? kind : `(${-2 + x + ux + vx},${-1 + y + uy + vy})`;
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(h05ReviewQuestion(id, k + 24).answer).toEqual(q.answer);
        expect(h05ReviewQuestion(id, k + 24).id).not.toBe(q.id);
      }
    for (const l of h05Lessons)
      expect(
        new Set(
          Array.from(
            { length: 24 },
            (_, k) => h05ReviewQuestion(l.id, k).stem.en,
          ),
        ).size,
      ).toBe(24);
    expect(h05ReviewQuestion('H05-L05', 4).answer).toEqual({
      kind: 'vector-code',
      value: 'zero-angle',
    });
    expect(h05ReviewQuestion('H05-L05', 8).answer).toEqual({
      kind: 'vector-code',
      value: 'undefined',
    });
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h05ReviewQuestion('H05-L01', n)).toThrow();
    expect(() => h05ReviewQuestion('H05-L07', 0)).toThrow();
  });
});
