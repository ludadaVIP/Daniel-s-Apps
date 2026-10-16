import { describe, it, expect } from 'vitest';
import {
  j87Lessons,
  j87CheckQuestions,
  j87ReviewQuestion,
} from './content/J87';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { readCoordinate, coordinateText } from './cartesianModels';
import { rational, sameR, addR, negR, mulR } from './algebraModels';
import {
  rigidImage,
  origin,
  midpoint,
  squaredDistance,
  transformTriangle,
  integerRoot,
  exactRootText,
  readRootLength,
  checkRootLength,
  dissection,
  pythagoreanSquare,
  pythagoreanClassification,
  pythagoreanCases,
  type RigidTransform,
  type PlanePoint,
} from './pythagoreanModels';
const markdown = import.meta.glob('../../../content/lessons/J87-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j87Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j87CheckQuestions,
];
const point = (s: string) => readCoordinate(s)!;
const area = (p: PlanePoint[]) =>
  Math.abs(
    p.reduce((s, v, i) => {
      const w = p[(i + 1) % p.length]!;
      return s + v.x * w.y - v.y * w.x;
    }, 0),
  ) / 2;
const cross = (a: PlanePoint, b: PlanePoint, p: PlanePoint) =>
  (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
// Independent convex clipping checks every pair, rather than only total areas.
function intersection(subject: PlanePoint[], clip: PlanePoint[]) {
  let out = subject;
  for (let i = 0; i < clip.length; i++) {
    const a = clip[i]!,
      b = clip[(i + 1) % clip.length]!,
      input = out;
    out = [];
    if (!input.length) break;
    for (let j = 0; j < input.length; j++) {
      const p = input[j]!,
        q = input[(j + 1) % input.length]!,
        cp = cross(a, b, p),
        cq = cross(a, b, q),
        insideP = cp >= -1e-10,
        insideQ = cq >= -1e-10;
      if (insideP) out.push(p);
      if (insideP !== insideQ) {
        const t = cp / (cp - cq);
        out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
      }
    }
  }
  return out;
}
describe('J87 exact transformations, area rearrangement and Pythagorean premises', () => {
  it('registers five planned bilingual lessons with earlier skill bridges and two full examples per language', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons),
      planned = units.find((u) => u.id === 'J87')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(planned.lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      j87Lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J87.questions).toHaveLength(8);
    for (const l of j87Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(j87ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 bilingual items including exact roots and nine human-reviewed explanations', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      coordinate: 12,
      number: 4,
      'root-length': 10,
      'proof-verdict': 1,
      'geometry-class': 6,
      choice: 6,
      explain: 9,
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
        expect(checkAnswer('area root converse proof', q.answer)).toBeNull();
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
  it('independently records the 33 constructed answers and six choices', () => {
    const values = [
      ['(1,-1)', '(-3,-2)', '(-2,-1)', '(-2,-2)', '5', '(-3,1/2)'],
      ['(-1,2)', '(1,-2)', '(-1,3)', '(1,1)', '120', '(1,2)'],
      ['25', '13', '13', null, 'insufficient', '10'],
      ['5', '12', 'sqrt(13)', '1.25', '3', '√34'],
      ['right', 'obtuse', 'acute', 'impossible', null, 'right'],
    ];
    j87Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) => {
        const s = values[i]![j];
        if (s === null) expect(q.answer.kind).toBe('explain');
        else expect(checkAnswer(s!, q.answer), q.id).toBe(true);
      });
      expect(
        checkAnswer(String([1, 0, 2, 0, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['(-1,2)', '(-1,-3)', '8', '2√5', 'obtuse'].forEach((s, i) =>
      expect(checkAnswer(s, j87CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j87CheckQuestions[5]!.answer.kind).toBe('explain');
    expect(checkAnswer('2', j87CheckQuestions[6]!.answer)).toBe(true);
  });
  it('preserves exact distances and inverses in 4,779 half-unit point/transform cases', () => {
    const transforms: RigidTransform[] = [];
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++)
        transforms.push({
          kind: 'translate',
          vector: [
            [BigInt(x), 1n],
            [BigInt(y), 1n],
          ],
        });
    for (const line of ['x-axis', 'y-axis', 'x=1', 'y=x'] as const)
      transforms.push({ kind: 'reflect', line });
    for (const center of [origin, point('(1,1)')])
      for (const turns of [1, 2, 3] as const)
        transforms.push({ kind: 'rotate', center, turns });
    expect(transforms).toHaveLength(59);
    let count = 0;
    for (let x = -4; x <= 4; x++)
      for (let y = -4; y <= 4; y++) {
        const p = point(`(${x}/2,${y}/2)`),
          q = point(`(${x + 3}/2,${y - 1}/2)`);
        for (const t of transforms) {
          const image = rigidImage(p, t),
            other = rigidImage(q, t);
          expect(sameR(squaredDistance(image, other), rational(5n, 2n))).toBe(
            true,
          );
          const inverse: RigidTransform =
            t.kind === 'translate'
              ? {
                  kind: 'translate',
                  vector: [negR(t.vector[0]), negR(t.vector[1])],
                }
              : t.kind === 'reflect'
                ? t
                : { ...t, turns: (4 - t.turns) as 1 | 2 | 3 };
          expect(rigidImage(image, inverse)).toEqual(p);
          if (t.kind === 'rotate' && t.turns === 2)
            expect(midpoint(p, image)).toEqual(t.center);
          count++;
        }
      }
    expect(count).toBe(4779);
    expect(
      coordinateText(
        rigidImage(point('(4,-2)'), { kind: 'reflect', line: 'x=1' }),
      ),
    ).toBe('(-2, -2)');
    expect(
      rigidImage(point('(2,1)'), {
        kind: 'rotate',
        center: point('(1,1)'),
        turns: 1,
      }),
    ).toEqual(point('(1,2)'));
  });
  it('preserves source data and orientation for rotations/translations while reversing it for reflections', () => {
    const original = structuredClone(transformTriangle),
      a = point('(0,0)'),
      b = point('(1,0)'),
      c = point('(0,1)');
    for (const t of [
      { kind: 'translate', vector: point('(2,-1)') },
      { kind: 'reflect', line: 'x=1' },
      { kind: 'reflect', line: 'y=x' },
      { kind: 'rotate', center: point('(1,1)'), turns: 1 },
    ] as RigidTransform[]) {
      const p = rigidImage(a, t),
        q = rigidImage(b, t),
        r = rigidImage(c, t),
        dx1 = addR(q[0], negR(p[0])),
        dy1 = addR(q[1], negR(p[1])),
        dx2 = addR(r[0], negR(p[0])),
        dy2 = addR(r[1], negR(p[1])),
        det = addR(mulR(dx1, dy2), negR(mulR(dy1, dx2)));
      expect(det).toEqual([t.kind === 'reflect' ? -1n : 1n, 1n]);
    }
    expect(transformTriangle).toEqual(original);
  });
  it('compares nonnegative root lengths by exact squares with rational factors, rejecting negative and truncated answers', () => {
    for (const raw of ['√20', '2√5', 'sqrt(20)', '(2)√(5)', '√80/2'])
      expect(checkRootLength(raw, '20'), raw).toBe(true);
    for (const raw of ['√13', 'sqrt(13)'])
      expect(checkRootLength(raw, '13')).toBe(true);
    for (const raw of [
      '3.61',
      '13',
      '-√13',
      '-3.6055',
      '√(−13)',
      '√13cm',
      'x+√13',
    ])
      expect(checkRootLength(raw, '13'), raw).toBe(false);
    expect(checkRootLength('(2/3)√18', '8')).toBe(true);
    expect(checkRootLength('√8/2', '2')).toBe(true);
    expect(checkRootLength('sqrt(25/16)', '25/16')).toBe(true);
    expect(checkRootLength('1.25', '25/16')).toBe(true);
    expect(checkRootLength('0', '0')).toBe(true);
    expect(checkRootLength('√0', '0')).toBe(true);
    for (let k = 1; k <= 5; k++)
      for (let n = 1; n <= 30; n++)
        expect(checkRootLength(`${k}√${n}`, String(k * k * n))).toBe(true);
  });
  it('formats exact rational roots and verifies integer square roots including large BigInts', () => {
    for (let n = 0n; n <= 300n; n++) {
      const r = integerRoot(n);
      expect(r * r <= n && (r + 1n) * (r + 1n) > n).toBe(true);
      expect(checkRootLength(exactRootText([n, 1n]), String(n))).toBe(true);
    }
    const n = 10n ** 100n + 123n,
      r = integerRoot(n);
    expect(r * r <= n && (r + 1n) * (r + 1n) > n).toBe(true);
    expect(exactRootText([100n, 64n])).toBe('5/4');
    expect(exactRootText([13n, 1n])).toBe('√13');
  });
  it('checks 25 actual dissections for congruent pieces, square gaps, full coverage and pairwise non-overlap in both arrangements', () => {
    for (let a = 1; a <= 5; a++)
      for (let b = 1; b <= 5; b++) {
        const m = dissection(a, b);
        for (const layout of [m.hyp, m.legs]) {
          const shapes = [...layout.pieces, ...layout.gaps];
          for (const p of shapes)
            for (const v of p) {
              expect(v.x >= 0 && v.x <= m.s && v.y >= 0 && v.y <= m.s).toBe(
                true,
              );
            }
          expect(shapes.reduce((s, p) => s + area(p), 0)).toBeCloseTo(
            m.s * m.s,
            10,
          );
          for (let i = 0; i < shapes.length; i++)
            for (let j = i + 1; j < shapes.length; j++)
              expect(area(intersection(shapes[i]!, shapes[j]!))).toBeLessThan(
                1e-8,
              );
          for (const p of layout.pieces) {
            expect(area(p)).toBeCloseTo((a * b) / 2, 10);
            const squared = p
              .map((v, i) => {
                const w = p[(i + 1) % 3]!;
                return (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
              })
              .sort((x, y) => x - y);
            expect(squared).toEqual(
              [a * a, b * b, a * a + b * b].sort((x, y) => x - y),
            );
          }
        }
        const gap = m.hyp.gaps[0]!;
        expect(area(gap)).toBe(a * a + b * b);
        for (let i = 0; i < 4; i++) {
          const p = gap[i]!,
            q = gap[(i + 1) % 4]!,
            r = gap[(i + 2) % 4]!,
            dx = q.x - p.x,
            dy = q.y - p.y;
          expect(dx * dx + dy * dy).toBe(a * a + b * b);
          expect(dx * (r.x - q.x) + dy * (r.y - q.y)).toBe(0);
        }
        expect(m.legs.gaps.map(area)).toEqual([a * a, b * b]);
      }
  });
  it('solves hypotenuses and legs from exact premises without mixing square values or supplying missing right angles', () => {
    expect(pythagoreanSquare('3', '4', 'hypotenuse')).toMatchObject({
      kind: 'length',
      square: [25n, 1n],
      text: '5',
    });
    expect(pythagoreanSquare('5', '13', 'leg')).toMatchObject({
      kind: 'length',
      square: [144n, 1n],
      text: '12',
    });
    expect(pythagoreanSquare('3/4', '1', 'hypotenuse')).toMatchObject({
      kind: 'length',
      square: [25n, 16n],
      text: '5/4',
    });
    expect(pythagoreanSquare('3', '4', 'hypotenuse', false)).toEqual({
      kind: 'insufficient',
    });
    expect(pythagoreanSquare('5', '5', 'leg')).toEqual({ kind: 'impossible' });
    expect(pythagoreanSquare('-3', '4', 'hypotenuse', false)).toEqual({
      kind: 'impossible',
    });
    for (const c of pythagoreanCases)
      expect(
        pythagoreanSquare(c.a, c.b, c.unknown, c.id !== 'no-right').kind,
      ).toBe(c.id === 'no-right' ? 'insufficient' : 'length');
  });
  it('independently classifies 1,000 integer triples, exact fractional triples and near-right data without floating tolerance', () => {
    for (let x = 1; x <= 10; x++)
      for (let y = 1; y <= 10; y++)
        for (let z = 1; z <= 10; z++) {
          const [a, b, c] = [x, y, z].sort((a, b) => a - b) as [
            number,
            number,
            number,
          ];
          const expected =
            a + b <= c
              ? 'impossible'
              : c * c === a * a + b * b
                ? 'right'
                : c * c > a * a + b * b
                  ? 'obtuse'
                  : 'acute';
          expect(
            pythagoreanClassification([String(z), String(x), String(y)])!.kind,
          ).toBe(expected);
        }
    expect(pythagoreanClassification(['3/5', '1', '4/5'])!.kind).toBe('right');
    expect(pythagoreanClassification(['1', '1', '1.414213562373'])!.kind).toBe(
      'acute',
    );
    expect(pythagoreanClassification(['0.000000000001', '1', '1'])!.kind).toBe(
      'acute',
    );
    expect(pythagoreanClassification(['1', '2', '3'])!.kind).toBe('impossible');
  });
  it('independently checks 400 retrieval questions, including 20 human area arguments', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = j87ReviewQuestion(`J87-L0${i + 1}`, k),
          n = (k % 9) - 4,
          d = (k % 2) + 1,
          b = (k % 7) - 3;
        if (i === 2 && k % 4 === 0) {
          expect(q.answer.kind).toBe('explain');
          expect(checkAnswer('right gap proof', q.answer)).toBeNull();
          continue;
        }
        let value: string;
        if (i === 0)
          value =
            k % 3 === 0
              ? `(${n + 2 * d}/${d},${b - 1})`
              : k % 3 === 1
                ? `(${-n}/${d},${b})`
                : `(${b},${n}/${d})`;
        else if (i === 1)
          value = k % 2 === 0 ? `(${2 - n},${2 - b})` : `(${-b},${n})`;
        else if (i === 2)
          value = String(((k % 6) + 1) ** 2 + ((k % 5) + 1) ** 2);
        else if (i === 3)
          value = `sqrt(${((k % 6) + 1) ** 2 + ((k % 7) + 1) ** 2})`;
        else value = ['right', 'obtuse', 'acute', 'impossible'][k % 4]!;
        expect(checkAnswer(value, q.answer), q.id).toBe(true);
        for (const raw of q.answerChecks!.accepted)
          expect(checkAnswer(raw, q.answer)).toBe(true);
        for (const raw of q.answerChecks!.rejected)
          expect(checkAnswer(raw, q.answer)).toBe(false);
      }
  });
  it('rejects malformed root expressions, invalid geometric inputs and unsupported review data', () => {
    for (const s of [
      '√',
      'sqrt(x)',
      '√2+√2',
      'sqrt(2)+1',
      '1/0',
      'x',
      'sqrt(2);process.exit()',
      'NaN',
      '∞',
      '2'.repeat(181),
    ])
      expect(readRootLength(s), s).toBeNull();
    expect(() => integerRoot(-1n)).toThrow();
    expect(() => dissection(0, 3)).toThrow();
    expect(() =>
      rigidImage(origin, {
        kind: 'reflect',
        line: 'bad',
      } as unknown as RigidTransform),
    ).toThrow();
    expect(pythagoreanClassification(['1', '2'])).toBeNull();
    expect(pythagoreanClassification(['a', '2', '3'])).toBeNull();
    for (const [id, k] of [
      ['J87-L00', 0],
      ['J86-L01', 0],
      ['J87-L01', -1],
      ['J87-L01', 0.1],
      ['J87-L01', 100001],
    ] as const)
      expect(() => j87ReviewQuestion(id, k)).toThrow();
  });
});
