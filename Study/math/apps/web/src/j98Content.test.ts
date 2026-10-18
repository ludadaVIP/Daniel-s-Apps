import { describe, it, expect } from 'vitest';
import {
  j98Lessons,
  j98CheckQuestions,
  j98ReviewQuestion,
} from './content/J98';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  rectangleLink,
  integrationGraph,
  strategyCases,
  strategyState,
  tryStrategy,
  auditCases,
  rampModel,
  defaultRamp,
  parseRampDraft,
  rampReport,
  checkIntegrationVerdict,
  type RampParams,
  type StrategyKind,
} from './integrationModels';
const bodies = import.meta.glob('../../../content/lessons/J98-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j98Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j98CheckQuestions,
];
const fraction = (
  r: readonly bigint[],
  n: bigint | number,
  d: bigint | number = 1,
) => expect(r[0]! * BigInt(d)).toBe(BigInt(n) * r[1]!);
function constraints(p: RampParams) {
  const h = BigInt(p.riseCm),
    r = BigInt(p.runCm),
    w = BigInt(p.widthCm),
    b = BigInt(p.budget),
    areaN = (h * h + r * r) * w * w,
    scale = 100000000n;
  return {
    height: h >= 60n,
    run: r <= 240n,
    grade: 4n * h <= r,
    area: areaN <= 9n * scale,
    budget: 3600n * areaN <= b * b * scale,
  };
}
function cents(p: RampParams) {
  const h = BigInt(p.riseCm),
    r = BigInt(p.runCm),
    w = BigInt(p.widthCm),
    n = 36n * (h * h + r * r) * w * w,
    d = 100n;
  let lo = 0n,
    hi = 100000n;
  while (lo + 1n < hi) {
    const m = (lo + hi) / 2n;
    if (m * m * d <= n) lo = m;
    else hi = m;
  }
  const c = 4n * n >= (2n * lo + 1n) ** 2n * d ? lo + 1n : lo;
  return `${c / 100n}.${String(c % 100n).padStart(2, '0')}`;
}
function permutations(a: string[]): string[][] {
  return a.length
    ? a.flatMap((v, i) =>
        permutations(a.filter((_, j) => i !== j)).map((p) => [v, ...p]),
      )
    : [[]];
}
describe('J98 structural links, evidence boundaries and exact paper constraints', () => {
  it('registers all five planned titles and closes J09 without discarding any of the 358 IDs', () => {
    const reg = curriculum.flatMap((s) => s.units).flatMap((u) => u.lessons);
    expect(reg).toHaveLength(358);
    expect(
      reg
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      reg
        .filter((l) => l.id.startsWith('J98-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j98Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(
      curriculum
        .find((s) => s.id === 'J09')!
        .units.every((u) => u.lessons.every((l) => l.available)),
    ).toBe(true);
    expect(unitChecks.J98.questions).toHaveLength(8);
    for (const l of j98Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j98ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 items while leaving ten explanations for human review', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('valid correct model proof', q.answer)).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('anchors every constructed item and choice independently', () => {
    const a: (string | null)[][] = [
      ['x²+2x', '4x+4', '15 m²', '6', '4', null],
      ['2x+3', '2', '6 L', 'insufficient', 'outside-domain', '4 L'],
      ['28 m', '6', '5', '24/5 km/h', '5/4 h', '36 m'],
      ['invalid', '-3,3', '15 m²', '36.9°', 'insufficient', null],
      ['sqrt(153/25)', '25%', '3√17/5', 'NZ$148.43', 'invalid', null],
    ];
    j98Lessons.forEach((l, i) => {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      a[i]!.forEach((v, j) =>
        expect(checkAnswer(v ?? 'reason', qs[j]!.answer), qs[j]!.id).toBe(
          v === null ? null : true,
        ),
      );
      expect(
        checkAnswer(String([2, 0, 1, 2, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    [
      'x²+2x',
      '2x+3',
      '24/5 km/h',
      'insufficient',
      '148.43',
      null,
      '0',
      null,
    ].forEach((v, i) =>
      expect(checkAnswer(v ?? 'reason', j98CheckQuestions[i]!.answer)).toBe(
        v === null ? null : true,
      ),
    );
  });
  it('checks rectangle partitions and perimeter for 160 rational instances without a sampled identity oracle', () => {
    for (let q = 1; q <= 32; q++)
      for (let d = 0; d <= 4; d++) {
        const m = rectangleLink(`${q}/4`, d);
        fraction(m.area, q * q + 4 * q * d, 16);
        fraction(m.perimeter, q + 2 * d, 1);
        expect(
          checkAnswer(m.areaExpression, {
            kind: 'polynomial',
            value: d ? `x*x+${d}*x` : 'x*x',
            variables: ['x'],
          }),
        ).toBe(true);
        expect(
          checkAnswer(m.perimeterExpression, {
            kind: 'polynomial',
            value: `2*(x+x+${d})`,
            variables: ['x'],
          }),
        ).toBe(true);
      }
  });
  it('separates given affine and piecewise rules from count domains and insufficient observations', () => {
    for (let q = 0; q <= 18; q++) {
      const x = q / 2,
        drain = integrationGraph('drain', String(x));
      fraction(drain.value!, x <= 3 ? 24 - 2 * q : x <= 6 ? 12 : 36 - 2 * q, 2);
      const a = integrationGraph('affine', String(x));
      expect(a.domain).toBe(x <= 4);
      if (x <= 4) fraction(a.value!, q + 3);
      else expect(a.value).toBeNull();
      const c = integrationGraph('count', String(x));
      expect(c.domain).toBe(q % 2 === 0 && x <= 5);
      if (c.domain) fraction(c.value!, q + 3);
      else expect(c.value).toBeNull();
      const o = integrationGraph('observations', String(x));
      expect(o.defined).toBe(x === 0 || x === 1);
      if (o.defined) fraction(o.value!, x);
      else expect(o.value).toBeNull();
    }
  });
  it('accepts justified strategy orders, including three legal journey preparations, while rejecting premature targets', () => {
    for (const kind of ['garden', 'diagonal', 'journey'] as StrategyKind[]) {
      const ids =
        kind === 'garden'
          ? ['model', 'solve', 'domain', 'target']
          : kind === 'diagonal'
            ? ['premise', 'square', 'positive', 'target']
            : ['times', 'total-time', 'distance', 'target'];
      let valid = 0;
      for (const order of permutations(ids)) {
        try {
          strategyState(kind, order);
          valid++;
        } catch {
          /* Unjustified permutation rejected. */
        }
      }
      expect(valid).toBe(kind === 'journey' ? 3 : 1);
      expect(tryStrategy(kind, [], 'target').reason).toBe('missing');
      expect(tryStrategy(kind, [], 'trap').reason).toBe('trap');
      expect(() => strategyState(kind, ['target'])).toThrow();
      expect(() => tryStrategy(kind, [], 'unknown')).toThrow();
      const first = ids[0]!;
      expect(tryStrategy(kind, [first], first).reason).toBe('duplicate');
    }
    expect(strategyCases.journey.answer).toBe('24/5');
  });
  it('keeps refuted, underdetermined, verified and outside-domain verdicts distinct', () => {
    expect(auditCases.map((c) => c.verdict)).toEqual([
      'invalid',
      'invalid',
      'invalid',
      'insufficient',
      'invalid',
      'valid',
    ]);
    for (const [value, words] of Object.entries({
      valid: ['VALID', '成立', '已核验'],
      invalid: ['invalid', '错误', '不成立'],
      insufficient: ['insufficient', '证据不足'],
      'outside-domain': ['outside-domain', '不在定义域'],
    }))
      for (const word of words)
        expect(checkIntegrationVerdict(word, value as 'valid')).toBe(true);
    expect(checkIntegrationVerdict('invalid', 'insufficient')).toBe(false);
    expect(checkIntegrationVerdict('insufficient', 'outside-domain')).toBe(
      false,
    );
    expect(checkIntegrationVerdict('yes', 'valid')).toBe(false);
  });
  it('anchors default ramp units, exact radicals and final money independently', () => {
    const m = rampModel(defaultRamp);
    fraction(m.h, 3, 5);
    fraction(m.r, 12, 5);
    fraction(m.square, 153, 25);
    fraction(m.grade, 1, 4);
    fraction(m.costSquare, 22032);
    expect(m.lengthExact).toBe('3√17/5');
    expect(m.areaExact).toBe('3√17/5');
    expect(m.costExact).toBe('36√17');
    expect(m.costRounded).toBe('148.43');
    expect(m.angleRounded).toBe('14.0');
    expect(m.feasible).toBe(true);
  });
  it('independently audits 4320 bounded paper designs using integer squared inequalities', () => {
    for (let h = 10; h <= 150; h += 10)
      for (let r = 50; r <= 400; r += 50)
        for (let w = 40; w <= 150; w += 10)
          for (const b of [80, 150, 300]) {
            const p = { riseCm: h, runCm: r, widthCm: w, budget: b },
              m = rampModel(p),
              c = constraints(p);
            expect(m.checks).toEqual(c);
            expect(m.feasible).toBe(Object.values(c).every(Boolean));
            expect(m.costRounded).toBe(cents(p));
          }
  });
  it('distinguishes width-only and uniform scaling and catches a budget-only near miss', () => {
    const a = rampModel(defaultRamp),
      b = rampModel({ ...defaultRamp, widthCm: 120 });
    expect(b.lengthExact).toBe(a.lengthExact);
    fraction(b.grade, 1, 4);
    expect(b.checks.area).toBe(true);
    expect(b.checks.budget).toBe(false);
    expect(b.costRounded).toBe('178.12');
    const half = rampModel({
      riseCm: 30,
      runCm: 120,
      widthCm: 50,
      budget: 150,
    });
    fraction(a.areaSquare, half.areaSquare[0] * 16n, half.areaSquare[1]);
    fraction(a.costSquare, half.costSquare[0] * 16n, half.costSquare[1]);
    fraction(half.grade, 1, 4);
  });
  it('includes exact area and budget equality before rejecting the next wider design', () => {
    const p = { riseCm: 150, runCm: 200, widthCm: 120, budget: 180 },
      m = rampModel(p);
    expect(m.areaExact).toBe('3');
    expect(m.costExact).toBe('180');
    expect(m.checks.area).toBe(true);
    expect(m.checks.budget).toBe(true);
    const wider = rampModel({ ...p, widthCm: 121 });
    expect(wider.checks.area).toBe(false);
    expect(wider.checks.budget).toBe(false);
    expect(m.checks.grade).toBe(false);
  });
  it('rejects invalid model inputs without accepting invalid geometry or silent extension', () => {
    for (const x of ['0', '-1', '9', 'bad'])
      expect(() => rectangleLink(x, 2)).toThrow();
    expect(() => rectangleLink('3', 5)).toThrow();
    for (const x of ['-1', '10', 'bad'])
      expect(() => integrationGraph('drain', x)).toThrow();
    for (const p of [
      { ...defaultRamp, riseCm: 0 },
      { ...defaultRamp, runCm: 401 },
      { ...defaultRamp, widthCm: 39 },
      { ...defaultRamp, budget: 79 },
      { ...defaultRamp, riseCm: 60.5 },
    ])
      expect(() => rampModel(p)).toThrow();
  });
  it('validates versioned project drafts and preserves the original argument without accepting corrupt data', () => {
    const p = {
      version: 1,
      params: { ...defaultRamp, widthCm: 120 },
      notes: 'My argument\nkeeps every constraint.',
    };
    expect(parseRampDraft(JSON.stringify(p))).toEqual(p);
    for (const raw of [
      '{bad',
      JSON.stringify({ ...p, version: 2 }),
      JSON.stringify({ ...p, notes: 7 }),
      JSON.stringify({ ...p, notes: 'x'.repeat(6001) }),
      JSON.stringify({ ...p, params: { ...defaultRamp, runCm: 0 } }),
      'x'.repeat(20001),
    ])
      expect(parseRampDraft(raw)).toBeNull();
    expect(
      parseRampDraft(
        JSON.stringify({ ...p, params: { ...p.params, extra: 'ignored' } }),
      )!.params,
    ).not.toHaveProperty('extra');
  });
  it('exports auditable exact and approximate evidence without calling a draft a reviewed completion', () => {
    const text = rampReport(
      defaultRamp,
      'Use the right angle and compare a width-only alternative.',
    );
    expect(text).toContain('length=3√17/5 m');
    expect(text).toContain('cost=NZ$36√17');
    expect(text).toContain('NZ$148.43');
    expect(text).toContain('Use the right angle');
    expect(text).toContain('not automatically reviewed');
    expect(text).toContain('Exporting does not award lesson mastery');
    const other = rampReport({ ...defaultRamp, widthCm: 120 }, 'Budget fails.');
    expect(other).toContain('not all met');
    expect(other).toContain('178.12');
    for (const s of ['', '  ', 'x'.repeat(6001)])
      expect(() => rampReport(defaultRamp, s)).toThrow();
  });
  it('independently validates all 400 retrieval results, including squared rounding to cents', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const q = j98ReviewQuestion(`J98-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) {
          const d = 1 + (k % 4);
          expected = k % 2 === 0 ? `x*x+${d}*x` : `4*x+${2 * d}`;
        } else if (i === 1) {
          if (k % 3 === 0) {
            const x = (k % 17) / 2;
            expected = String(x <= 3 ? 12 - 2 * x : x <= 6 ? 6 : 18 - 2 * x);
          } else
            expected =
              k % 3 === 1
                ? `${1 + (k % 4)}x+${1 + (Math.floor(k / 4) % 5)}`
                : 'insufficient';
        } else if (i === 2) {
          if (k % 2 === 0)
            expected = String(4 * (2 + (k % 7)) + 2 * (1 + (k % 3)));
          else {
            const a = 2 + (k % 5);
            expected = `${a * (a + 2)}/${a + 1}`;
          }
        } else if (i === 3)
          expected = [
            'invalid',
            'invalid',
            'invalid',
            'insufficient',
            'invalid',
            'valid',
          ][k % 6]!;
        else {
          const p = {
            riseCm: [30, 45, 60, 75, 90][k % 5]!,
            runCm: [180, 240, 300][Math.floor(k / 5) % 3]!,
            widthCm: [80, 100, 120][Math.floor(k / 15) % 3]!,
            budget: [120, 150, 180][Math.floor(k / 45) % 3]!,
          };
          expected =
            k % 4 === 0
              ? cents(p)
              : Object.values(constraints(p)).every(Boolean)
                ? 'valid'
                : 'invalid';
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('unknown', q.answer)).toBe(false);
      }
  });
  it('bounds review IDs and rounds while retaining the planned cyclic bank', () => {
    for (const id of ['J98-L00', 'J98-L06', 'J97-L01'])
      expect(() => j98ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j98ReviewQuestion('J98-L01', n)).toThrow();
    expect(j98ReviewQuestion('J98-L01', 0).stem).toEqual(
      j98ReviewQuestion('J98-L01', 80).stem,
    );
    expect(j98ReviewQuestion('J98-L01', 0).id).not.toBe(
      j98ReviewQuestion('J98-L01', 80).id,
    );
  });
});
