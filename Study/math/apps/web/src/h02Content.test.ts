import { describe, it, expect } from 'vitest';
import {
  h02Lessons,
  h02CheckQuestions,
  h02ReviewQuestion,
} from './content/H02';
import {
  curriculum,
  lessons,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import {
  mappingModel,
  mappingAt,
  representationAt,
  propertyModel,
  auditOrderedPair,
  familyAt,
  transformModel,
  transformedAt,
  defaultTransform,
  inverseModel,
  piecewiseModel,
  piecewiseAt,
  piecewiseBudget,
  checkFunctionCode,
  type Family,
  type TransformParams,
  type PieceKind,
} from './functionConceptModels';
import { readRational } from './rationalModels';
import { readCoordinate } from './cartesianModels';
import { intervalContains } from './inequalityModels';
import { parseRealUnion, unionContains } from './logicModels';
import { readRadical, multiplyRadicals, radicalText } from './radicalModels';
const bodies = import.meta.glob('../../../content/lessons/H02-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h02Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h02CheckQuestions,
];
const ratio = (r: readonly bigint[], n: number, d = 1) =>
  expect(r[0]! * BigInt(d)).toBe(BigInt(n) * r[1]!);
function feeQuarter(kind: PieceKind, n: number): number | null {
  if (kind === 'parking')
    return n < 0 || n > 20
      ? null
      : n <= 4
        ? 0
        : n <= 12
          ? 2 * n - 8
          : 3 * n - 20;
  if (kind === 'parcel')
    return n <= 0 || n > 20 ? null : 4 * (n <= 4 ? 4 : n <= 12 ? 7 : 10);
  return n < 0 || n > 16 ? null : n === 0 ? 0 : 12 * Math.floor((n + 3) / 4);
}
describe('H02 function language, domain premises and exact correspondences', () => {
  it('opens the six planned titles with two examples per language, valid earlier bridges and the whole roadmap intact', () => {
    const reg = curriculum.flatMap((s) => s.units).flatMap((u) => u.lessons);
    expect(reg).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(238);
    expect(openUnits.length).toBeGreaterThanOrEqual(45);
    expect(
      reg
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      reg
        .filter((l) => l.id.startsWith('H02-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h02Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H02.questions).toHaveLength(8);
    for (const l of h02Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.findIndex((p) => p.id === id)).toBeGreaterThanOrEqual(0);
        expect(lessons.findIndex((p) => p.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h02ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 items while leaving twelve full arguments to human review', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('function odd inverse', q.answer)).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('independently anchors every lesson answer and choice', () => {
    const anchors: (string | null)[][] = [
      ['x<2 or x>2', '[0,9]', 'function', '{4,1,0}', 'x<=5', null],
      ['.25', '(1.5,.25)', '-1', 'outside-domain', 'undetermined', '{2,-2}'],
      ['even', 'decreasing', 'increasing', 'neither', 'both', null],
      ['(4,1)', '2x²-12x+17', '(1,4)', '(-2,8)', '[0,2]', '(-1,2)'],
      ['2', '[-1,11]', 'not-invertible', '-2', '√2', null],
      ['4 NZD', '7 NZD', '4 NZD', '6 NZD', '[0,3]', null],
    ];
    h02Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      anchors[i]!.forEach((v, j) =>
        expect(checkAnswer(v ?? 'argument', qs[j]!.answer), qs[j]!.id).toBe(
          v === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([0, 1, 2, 1, 0, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
  });
  it('distinguishes total single-valued mappings, many-to-one and unused codomain values', () => {
    expect(mappingModel('finite').valid).toBe(true);
    expect(mappingModel('missing').valid).toBe(false);
    expect(mappingModel('split').valid).toBe(false);
    expect(mappingModel('interval').valid).toBe(true);
    const m = mappingModel('finite');
    expect(m.codomain).toContain('9');
    expect(m.edges.some((p) => p.y === '9')).toBe(false);
    expect(m.edges.filter((p) => p.y === '1')).toHaveLength(2);
    expect(mappingAt('finite', '1/2')).toEqual({
      admissible: false,
      outputs: [],
    });
    expect(mappingAt('interval', '1/2')).toEqual({
      admissible: true,
      outputs: ['1/4'],
    });
    expect(mappingAt('missing', '2')).toEqual({
      admissible: true,
      outputs: [],
    });
    expect(mappingAt('split', '0').outputs).toEqual(['0', '1']);
  });
  it('audits continuous/discrete domains before evaluating given or unknown rules', () => {
    for (let n = -12; n <= 12; n++) {
      const raw = `${n}/4`,
        continuous = representationAt('continuous', raw),
        discrete = representationAt('discrete', raw),
        observed = representationAt('observations', raw),
        inside = Math.abs(n) <= 8;
      expect(continuous.status).toBe(inside ? 'value' : 'outside-domain');
      if (inside) ratio(continuous.value!, n * n - 32, 16);
      expect(discrete.status).toBe(
        inside && n % 4 === 0 ? 'value' : 'outside-domain',
      );
      expect(observed.status).toBe(
        !inside
          ? 'outside-domain'
          : Math.abs(n) === 4
            ? 'value'
            : 'undetermined',
      );
    }
  });
  it('audits strict monotonicity over ordered input grids and parity on the original domain', () => {
    for (const family of [
      'square',
      'cube',
      'absolute',
      'square-plus-one',
      'zero',
      'restricted-square',
    ] as Family[])
      for (const part of ['whole', 'left', 'right'] as const) {
        if (family === 'restricted-square' && part === 'left') continue;
        const m = propertyModel(family, part),
          xs = Array.from(
            { length: 4 * (m.studyHi - m.studyLo) + 1 },
            (_, i) => m.studyLo + i / 4,
          ),
          fn = (x: number) =>
            family === 'cube'
              ? x * x * x
              : family === 'absolute'
                ? Math.abs(x)
                : family === 'zero'
                  ? 0
                  : x * x + (family === 'square-plus-one' ? 1 : 0);
        let inc = true,
          dec = true;
        for (const x of xs)
          for (const y of xs)
            if (x < y) {
              inc &&= fn(x) < fn(y);
              dec &&= fn(x) > fn(y);
            }
        expect(m.monotonicity).toBe(
          inc ? 'increasing' : dec ? 'decreasing' : 'neither-strict',
        );
        expect(m.parity).toBe(
          family === 'restricted-square'
            ? 'neither'
            : family === 'zero'
              ? 'both'
              : family === 'cube'
                ? 'odd'
                : 'even',
        );
        if (m.lo === -m.hi)
          for (let n = 4 * m.lo; n <= 4 * m.hi; n++) {
            const a = familyAt(family, readRational(`${n}/4`)),
              b = familyAt(family, readRational(`${-n}/4`));
            if (m.parity === 'even' || m.parity === 'both')
              expect(a[0] * b[1]).toBe(b[0] * a[1]);
            if (m.parity === 'odd' || m.parity === 'both')
              expect(a[0] * b[1]).toBe(-b[0] * a[1]);
          }
      }
  });
  it('does not treat invalid ordered pairs or a zero value as a universal property proof', () => {
    expect(auditOrderedPair('square', 'whole', '-2', '-1')).toMatchObject({
      admissible: true,
      ordered: true,
      comparison: 1,
    });
    expect(auditOrderedPair('square', 'right', '-1', '1').admissible).toBe(
      false,
    );
    expect(auditOrderedPair('square', 'whole', '1', '1').ordered).toBe(false);
    expect(auditOrderedPair('square', 'whole', '2', '1').ordered).toBe(false);
    expect(propertyModel('restricted-square').parity).toBe('neither');
    expect(propertyModel('zero').monotonicity).toBe('neither-strict');
    expect(checkFunctionCode('non-monotone', 'neither-strict')).toBe(false);
  });
  it('independently recovers transformed point coordinates for 5832 configurations including reflection and collapse', () => {
    for (const family of ['square', 'cube', 'absolute'] as const)
      for (let a = -2; a <= 3; a++)
        for (const b of [-2, -1, 1, 2])
          for (const h of [-3, 0, 3])
            for (const k of [-3, 0, 3])
              for (let n = -4; n <= 4; n++) {
                const p: TransformParams = {
                    family,
                    a,
                    b,
                    h,
                    k,
                    restricted: true,
                  },
                  m = transformModel(p, `${n}/2`),
                  d = family === 'cube' ? 8 : family === 'absolute' ? 2 : 4,
                  baseN =
                    family === 'cube'
                      ? n * n * n
                      : family === 'absolute'
                        ? Math.abs(n)
                        : n * n;
                ratio(m.image[0], 2 * b * h + n, 2 * b);
                ratio(m.image[1], a * baseN + k * d, d);
                const at = transformedAt(
                  p,
                  `${m.image[0][0]}/${m.image[0][1]}`,
                )!;
                ratio(at, a * baseN + k * d, d);
              }
  });
  it('transforms stipulated domains even when a=0 and rejects b=0 and unsupported parameters', () => {
    const p = { ...defaultTransform, restricted: true, b: -2, a: 0 };
    const m = transformModel(p, '1');
    for (let n = -12; n <= 12; n++) {
      const x = n / 2,
        want = x >= 2 && x <= 4;
      expect(intervalContains(m.domain, readRational(`${n}/2`))).toBe(want);
      expect(transformedAt(p, `${n}/2`) !== null).toBe(want);
    }
    for (const patch of [
      { b: 0 },
      { b: 3 },
      { a: 4 },
      { a: 0.5 },
      { h: 4 },
      { k: -4 },
      { restricted: 'yes' },
    ])
      expect(() =>
        transformModel(
          { ...defaultTransform, ...patch } as TransformParams,
          '0',
        ),
      ).toThrow();
    expect(() =>
      transformModel({ ...defaultTransform, restricted: true }, '3'),
    ).toThrow();
  });
  it('exchanges exact inverse domains and ranges and recovers affine inputs', () => {
    for (let n = -4; n <= 24; n++) {
      const m = inverseModel('affine', `${n}/2`),
        inside = n >= -2 && n <= 22;
      expect(m.admissible).toBe(inside);
      expect(m.invertible).toBe(true);
      if (inside) {
        const x = readRational(m.preimages[0]!);
        ratio(x, n - 6, 4);
        ratio([2n * x[0] + 3n * x[1], x[1]], n, 2);
      }
    }
    expect(
      intervalContains(inverseModel('affine', '7').range, readRational('11')),
    ).toBe(true);
    expect(inverseModel('affine', '12').admissible).toBe(false);
  });
  it('retains both square preimages or the selected sign, with zero deduplicated and exact irrational roots', () => {
    for (const kind of [
      'square-full',
      'square-positive',
      'square-negative',
    ] as const)
      for (let n = -1; n <= 10; n++) {
        const m = inverseModel(kind, String(n)),
          inside = n >= 0 && n <= 9;
        expect(m.admissible).toBe(inside);
        expect(m.invertible).toBe(kind !== 'square-full');
        expect(m.preimages).toHaveLength(
          !inside ? 0 : kind === 'square-full' && n > 0 ? 2 : 1,
        );
        for (const raw of m.preimages) {
          const root = readRadical(raw)!;
          expect(radicalText(multiplyRadicals(root, root))).toBe(String(n));
          if (n > 0 && kind === 'square-negative')
            expect(raw.startsWith('-')).toBe(true);
          if (kind === 'square-positive')
            expect(raw.startsWith('-')).toBe(false);
        }
      }
    expect(inverseModel('square-full', '0')).toMatchObject({
      invertible: false,
      preimages: ['0'],
    });
    expect(inverseModel('square-positive', '2').preimages).toEqual(['√2']);
  });
  it('gives exactly one branch for every allowed input, with independent quarter-unit monetary values', () => {
    for (const kind of ['parking', 'parcel', 'started-hour'] as PieceKind[])
      for (let n = -4; n <= 24; n++) {
        const at = piecewiseAt(kind, `${n}/4`),
          expected = feeQuarter(kind, n),
          hits = piecewiseModel(kind).filter((p) =>
            intervalContains(p.domain, readRational(`${n}/4`)),
          ).length;
        expect(hits).toBe(expected === null ? 0 : 1);
        if (expected === null) expect(at).toBeNull();
        else ratio(at!.value, expected, 4);
      }
    expect(piecewiseAt('parking', '3')!.index).toBe(1);
    expect(piecewiseAt('parcel', '1')!.index).toBe(0);
    expect(piecewiseAt('started-hour', '1.5')!.value).toEqual(
      readRational('6'),
    );
  });
  it('audits full budget sets against each original rule including zero, open mass boundaries and capped domains', () => {
    for (const kind of ['parking', 'parcel', 'started-hour'] as PieceKind[])
      for (let budget = -1; budget <= 13; budget++)
        for (let n = -4; n <= 24; n++) {
          const cost = feeQuarter(kind, n);
          expect(
            unionContains(
              piecewiseBudget(kind, String(budget)),
              readRational(`${n}/4`),
            ),
            `${kind},${budget},${n}/4`,
          ).toBe(cost !== null && cost <= 4 * budget);
        }
    expect(piecewiseAt('parking', '3.5')!.value).toEqual(readRational('5.5'));
    expect(piecewiseAt('started-hour', '3.5')!.value).toEqual(
      readRational('12'),
    );
  });
  it('bounds unsupported model requests and ambiguous classification shortcuts', () => {
    expect(() => mappingModel('unknown' as never)).toThrow();
    expect(() => representationAt('unknown' as never, '1')).toThrow();
    expect(() => propertyModel('square', 'bad' as never)).toThrow();
    expect(() => propertyModel('restricted-square', 'left')).toThrow();
    expect(() => inverseModel('unknown' as never, '1')).toThrow();
    expect(() => piecewiseModel('unknown' as never)).toThrow();
    expect(() => piecewiseAt('parcel', '1/0')).toThrow();
    expect(checkFunctionCode('not invertible', 'invertible')).toBe(false);
    expect(checkFunctionCode('偶函数', 'even')).toBe(true);
  });
  it('independently audits all 480 retrieval rounds and their mathematical requests', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const q = h02ReviewQuestion(`H02-L0${i + 1}`, k),
          a = q.answerChecks!.accepted[0]!;
        ids.add(q.id);
        expect(checkAnswer(a, q.answer)).toBe(true);
        for (const wrong of q.answerChecks!.rejected)
          expect(checkAnswer(wrong, q.answer)).toBe(false);
        if (i === 0) {
          const set = parseRealUnion(a)!;
          for (let n = -16; n <= 16; n++) {
            const x = n / 2,
              want =
                k % 2 === 0
                  ? x !== (k % 7) - 3
                  : x >= 0 &&
                    x <=
                      Math.max(
                        (1 + (k % 3)) ** 2,
                        (1 + (Math.floor(k / 3) % 4)) ** 2,
                      );
            expect(unionContains(set, readRational(`${n}/2`))).toBe(want);
          }
        }
        if (i === 1) {
          if (k % 4 === 3) expect(a).toBe('undetermined');
          else {
            const x = ((k % 9) - 4) / 2,
              y = x * x - 2;
            if (k % 2 === 0) ratio(readRational(a), 4 * y, 4);
            else {
              const p = readCoordinate(a)!;
              ratio(p[0], 2 * x, 2);
              ratio(p[1], 4 * y, 4);
            }
          }
        }
        if (i === 2) {
          const f = k % 6,
            parity = Math.floor(k / 6) % 2 === 0,
            part = Math.floor(k / 6) % 3,
            want = parity
              ? ['even', 'odd', 'even', 'even', 'both', 'neither'][f]
              : f === 4
                ? 'neither-strict'
                : f === 1 || f === 5
                  ? 'increasing'
                  : part === 1
                    ? 'decreasing'
                    : part === 2
                      ? 'increasing'
                      : 'neither-strict';
          expect(a).toBe(want);
        }
        if (i === 3) {
          const p = readCoordinate(a)!,
            u = (k % 5) - 2,
            b = [-2, -1, 1, 2][Math.floor(k / 3) % 4]!,
            h = (k % 7) - 3,
            v = u ** (k % 2 ? 3 : 2),
            ay = ((k % 3) + 1) * v + (Math.floor(k / 7) % 7) - 3;
          ratio(p[0], b * h + u, b);
          ratio(p[1], ay);
        }
        if (i === 4) {
          const kind = k % 4,
            y = (k % 12) - 1;
          if (k % 5 === 0)
            expect(a).toBe(kind === 1 ? 'not-invertible' : 'invertible');
          else if (kind !== 0 && (y < 0 || y > 9))
            expect(a).toBe('outside-domain');
          else if (kind === 0) ratio(readRational(a), y - 3, 2);
          else {
            const roots = kind === 1 ? a.split(',') : [a];
            expect(roots).toHaveLength(kind === 1 && y > 0 ? 2 : 1);
            for (const raw of roots) {
              const r = readRadical(raw)!;
              expect(radicalText(multiplyRadicals(r, r))).toBe(String(y));
            }
          }
        }
        if (i === 5) {
          const kind = (['parking', 'parcel', 'started-hour'] as PieceKind[])[
            k % 3
          ]!;
          if (k % 2 === 0) {
            const cost = feeQuarter(kind, 2 * (k % 13));
            if (cost === null) expect(a).toBe('outside-domain');
            else ratio(readRational(a), cost, 4);
          } else {
            const set = parseRealUnion(a)!;
            for (let n = -2; n <= 24; n++) {
              const cost = feeQuarter(kind, n);
              expect(unionContains(set, readRational(`${n}/4`))).toBe(
                cost !== null && cost <= 4 * (k % 13),
              );
            }
          }
        }
      }
    expect(ids.size).toBe(480);
  });
  it('bounds raw review rounds and cycles deliberately without reusing IDs', () => {
    for (const id of ['H02-L00', 'H02-L07', 'H01-L01'])
      expect(() => h02ReviewQuestion(id, 0)).toThrow();
    for (const k of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h02ReviewQuestion('H02-L01', k)).toThrow();
    expect(h02ReviewQuestion('H02-L06', 100000).id).toBe('H02-L06-R100000');
    expect(h02ReviewQuestion('H02-L04', 80).answer).toEqual(
      h02ReviewQuestion('H02-L04', 0).answer,
    );
  });
});
