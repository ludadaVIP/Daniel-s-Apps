import { describe, it, expect } from 'vitest';
import {
  j92Lessons,
  j92CheckQuestions,
  j92ReviewQuestion,
} from './content/J92';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  parseQuadraticEquation,
  solveQuadratic,
  checkQuadraticEquation,
  readRadicalSet,
  checkRadicalSet,
  quadraticCandidateAudit,
  completingSquare,
  feasibleQuadraticRoots,
  inQuadraticDomain,
  meaningCases,
  factoringCases,
  completingCases,
  applicationCases,
} from './quadraticModels';
import { readRadical, radicalText } from './radicalModels';
import { quadraticCurve, approximateRoot } from './QuadraticVisuals';
import { textR } from './algebraModels';
const bodies = import.meta.glob('../../../content/lessons/J92-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j92Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j92CheckQuestions,
];
describe('J92 complete quadratic content and exact roots', () => {
  it('registers six planned bilingual lessons, earlier prerequisites and two examples per language', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('J92-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j92Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J92.questions).toHaveLength(8);
    for (const l of j92Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.stage).toBe('J09');
      expect(l.contentStatus).toBe('ready');
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.keywords).toHaveLength(3);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const k = lessons.findIndex((v) => v.id === id);
        expect(k, id).toBeGreaterThanOrEqual(0);
        expect(k, id).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j92ReviewQuestion(l.id, 0));
    }
  });
  it('checks every accepted and rejected form in 56 authored items, preserving human review', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(9);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.stem.zh.length).toBeGreaterThan(5);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('quadratic model proof', q.answer)).toBeNull();
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id} accepts ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id} rejects ${raw}`).toBe(
          false,
        );
    }
  });
  it('independently anchors every constructed answer and all seven choices', () => {
    const values: (string | null)[][] = [
      ['3,2', 'linear', '2', '∅', 'identity', '4,0'],
      ['3,0', '(x-3)(x-2)', '1/2,-1', '4,-1', '-2', '2,0'],
      ['9', '1,-7', '9/4', '2±√5', '∅', '(-3±√13)/2'],
      ['(3±√5)/2', '2,-1/2', '24', '1±√6/2', 'linear', '-1'],
      ['2', '1', '0', '2', 'linear', '1'],
      ['40=x²+3x', '5', '∅', '1', '5=2x*x', null],
    ];
    for (const [i, l] of j92Lessons.entries()) {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      for (const [j, raw] of values[i]!.entries())
        expect(
          checkAnswer(raw ?? 'Reason supplied', qs[j]!.answer),
          qs[j]!.id,
        ).toBe(raw === null ? null : true);
      expect(
        checkAnswer(String([1, 1, 0, 1, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    }
    for (const [i, raw] of [
      'linear',
      '0,5',
      '-2±√5',
      '2,-1/2',
      '1',
      null,
      '1',
      null,
    ].entries())
      expect(
        checkAnswer(raw ?? 'Reason supplied', j92CheckQuestions[i]!.answer),
      ).toBe(raw === null ? null : true);
  });
  it('classifies only after cancellation, including identity, contradiction and higher degree', () => {
    for (const [source, kind] of [
      ['x²+x=x²+3', 'linear'],
      ['x²=x²', 'identity'],
      ['x²+1=x²', 'contradiction'],
      ['x³+x²=0', 'higher'],
      ['0x²+2x=4', 'linear'],
      ['(x-2)²=0', 'quadratic'],
    ])
      expect(parseQuadraticEquation(source!)!.kind).toBe(kind);
    expect(solveQuadratic('x²=x²').roots).toBeNull();
    expect(solveQuadratic('x³=0').roots).toBeNull();
    expect(solveQuadratic('1=0').roots).toEqual([]);
    for (const s of [
      '',
      'x=',
      'x=y',
      'x²==1',
      'x²=1=0',
      '1/x=2',
      'x^5=0',
      'x²=√2',
      'x²=Infinity',
      'x²=1001',
      'x'.repeat(301),
    ])
      expect(parseQuadraticEquation(s)).toBeNull();
  });
  it('solves 2,028 signed integer quadratics against independent discriminants and original substitution', () => {
    let total = 0;
    for (let a = -6; a <= 6; a++)
      if (a)
        for (let b = -6; b <= 6; b++)
          for (let c = -6; c <= 6; c++) {
            const source = `${a}x²+(${b})x+(${c})=0`,
              s = solveQuadratic(source),
              d = b * b - 4 * a * c;
            total++;
            expect(textR(s.discriminant!)).toBe(String(d));
            expect(s.roots).toHaveLength(d < 0 ? 0 : d === 0 ? 1 : 2);
            const expected =
              d < 0
                ? []
                : d === 0
                  ? [-b / (2 * a)]
                  : [
                      (-b - Math.sqrt(d)) / (2 * a),
                      (-b + Math.sqrt(d)) / (2 * a),
                    ];
            const actual = s.roots!.map(approximateRoot).sort((x, y) => x - y);
            expected.sort((x, y) => x - y);
            for (const [i, r] of s.roots!.entries()) {
              const v = approximateRoot(r);
              expect(a * v * v + b * v + c).toBeCloseTo(0, 9);
              expect(
                quadraticCandidateAudit(source, radicalText(r))!.equationPass,
              ).toBe(true);
              expect(actual[i]).toBeCloseTo(expected[i]!, 11);
            }
          }
    expect(total).toBe(2028);
  });
  it('clears rational coefficients and negative common factors without losing exact roots', () => {
    for (const source of [
      '(1/2)x²-(3/2)x+1=0',
      '-20x²+60x-40=0',
      'x²/10-3x/10+1/5=0',
    ])
      expect(
        checkRadicalSet('1,2', solveQuadratic(source).roots!.map(radicalText)),
      ).toBe(true);
    expect(
      checkRadicalSet(
        '(3±√5)/2',
        solveQuadratic('-x²+3x-1=0').roots!.map(radicalText),
      ),
    ).toBe(true);
    expect(textR(solveQuadratic('(1/2)x²-(3/2)x+1=0').discriminant!)).toBe(
      '1/4',
    );
  });
  it('checks full centred radical sets, singleton repetition and empty-set semantics', () => {
    for (const raw of [
      '(3±√5)/2',
      '{(3-√5)/2,(3+√5)/2}',
      'x=(3+sqrt(5))/2;x=(3-sqrt(5))/2',
      '(6+/-√20)/4',
    ])
      expect(checkRadicalSet(raw, ['(3-√5)/2', '(3+√5)/2'])).toBe(true);
    for (const raw of [
      '(3+√5)/2',
      '1,2',
      '(3-√5)/2,(3-√5)/2',
      '(3±√5)/2,4',
      '3±√5',
      '1,2,3',
      'x=',
      'NaN',
      '±√-1',
    ])
      expect(checkRadicalSet(raw, ['(3-√5)/2', '(3+√5)/2'])).toBe(false);
    for (const raw of [
      '无实数解',
      'no real solutions',
      '∅',
      '{}',
      '无可行解',
      'no feasible solutions',
    ])
      expect(checkRadicalSet(raw, [])).toBe(true);
    expect(checkRadicalSet('0', [])).toBe(false);
    expect(checkRadicalSet('2,2', ['2'])).toBe(false);
    expect(checkRadicalSet('2±0', ['2'])).toBe(true);
    expect(readRadicalSet('±1±2')).toBeNull();
  });
  it('retains original quantity sides while separately recognising equivalent solution sets', () => {
    for (const raw of ['x(x+3)=40', '40=x²+3x', 'x*x+3*x=40'])
      expect(checkQuadraticEquation(raw, 'x(x+3)=40')).toBe(true);
    for (const raw of ['x²+3x-40=0', '(x-5)(x+8)=0', '2x²+6x=80']) {
      expect(checkQuadraticEquation(raw, 'x(x+3)=40')).toBe(false);
      expect(checkQuadraticEquation(raw, 'x(x+3)=40', false)).toBe(true);
    }
    for (const raw of ['x=5', 'x=-8', 'x²+3x=20'])
      expect(checkQuadraticEquation(raw, 'x(x+3)=40', false)).toBe(false);
  });
  it('checks every catalogue root in the original and keeps contexts distinct', () => {
    const sources = [
      ...meaningCases,
      ...factoringCases.map((c) => c.source),
      ...completingCases,
      ...applicationCases.map((c) => c.source),
    ];
    for (const source of sources)
      for (const r of solveQuadratic(source).roots ?? [])
        expect(
          quadraticCandidateAudit(source, radicalText(r))!.equationPass,
        ).toBe(true);
    expect(
      quadraticCandidateAudit('x(x+3)=40', '-8', 'positive'),
    ).toMatchObject({
      equationPass: true,
      contextPass: false,
      accepted: false,
      left: '40',
      right: '40',
    });
    expect(quadraticCandidateAudit('x(x+3)=40', '6', 'positive')).toMatchObject(
      { equationPass: false, contextPass: true, accepted: false },
    );
    expect(quadraticCandidateAudit('2x²=5', '√10/2', 'whole')).toMatchObject({
      equationPass: true,
      contextPass: false,
    });
    expect(
      quadraticCandidateAudit('x²-6x+5=0', '5', 'first-two'),
    ).toMatchObject({ equationPass: true, contextPass: false });
    expect(
      applicationCases.map((c) => feasibleQuadraticRoots(c.source, c.domain)),
    ).toEqual([['5'], [], ['1'], ['1']]);
  });
  it('uses exact signed radical comparisons at domain boundaries', () => {
    for (const [raw, domain, wanted] of [
      ['2-√5', 'positive', false],
      ['√5-2', 'positive', true],
      ['√2-√3', 'positive', false],
      ['0', 'positive', false],
      ['0', 'whole', true],
      ['1/2', 'whole', false],
      ['2', 'first-two', true],
      ['0', 'first-two', true],
      ['2+√2/100', 'first-two', false],
      ['2-√2/100', 'first-two', true],
    ] as const)
      expect(inQuadraticDomain(readRadical(raw)!, domain), raw).toBe(wanted);
  });
  it('independently verifies completing terms and Bézier values rather than labels', () => {
    for (const [source, p, added, rhs] of [
      ['x²+6x=7', '3', '9', '16'],
      ['x²+3x=1', '3/2', '9/4', '13/4'],
      ['x²-4x=1', '-2', '4', '5'],
      ['x²+4x=-5', '2', '4', '-1'],
    ]) {
      const m = completingSquare(source!);
      expect([textR(m.p), textR(m.added), textR(m.completed)]).toEqual([
        p,
        added,
        rhs,
      ]);
    }
    for (const source of [...meaningCases, '(x-8)(x-10)=0', '-2x²+3x+2=0'])
      for (const wide of [false, true]) {
        const m = quadraticCurve(source, wide),
          [p0, p1, p2] = m.control;
        for (let j = 0; j <= 20; j++) {
          const t = j / 20,
            bezier = (key: 'x' | 'y') =>
              (1 - t) ** 2 * p0![key] +
              2 * t * (1 - t) * p1![key] +
              t * t * p2![key],
            x = bezier('x');
          expect(bezier('y')).toBeCloseTo(m.a * x * x + m.b * x + m.c, 10);
        }
      }
  });
  it('validates 480 retrieval rounds with independent integer-root, square and domain anchors', () => {
    for (const [i, l] of j92Lessons.entries())
      for (let k = 0; k < 80; k++) {
        const q = j92ReviewQuestion(l.id, k),
          u = (k % 9) - 4,
          v = (Math.floor(k / 9) % 9) - 4,
          p = (k % 5) + 1,
          n = (k % 7) + 1;
        let answer: string;
        if (i === 0 && k % 4 === 0)
          answer = k % 8 === 0 ? 'linear' : 'contradiction';
        else if (i <= 1) answer = [...new Set([u, v])].join(',');
        else if (i === 2)
          answer = k % 4 === 0 ? String(p * p) : `${-p}±√${n + p * p}`;
        else if (i === 3) {
          const a = k % 2 ? -2 : 2,
            d = u * u - 4 * a * v;
          answer =
            d < 0
              ? '∅'
              : d === 0
                ? String(-u / (2 * a))
                : `(${-u}±√${d})/(${2 * a})`;
        } else if (i === 4) answer = String([2, 1, 0][k % 3]);
        else answer = k % 4 === 0 ? `${n * (n + p)}=x(x+${p})` : String(n);
        expect(checkAnswer(answer, q.answer), q.id).toBe(true);
        expect(q.id).toBe(`${l.id}-R${k}`);
        for (const bad of q.answerChecks!.rejected)
          expect(checkAnswer(bad, q.answer)).toBe(false);
      }
    for (const [id, k] of [
      ['J92-L07', 0],
      ['J92-L01', -1],
      ['J92-L01', 1.5],
      ['J92-L01', 100001],
    ] as const)
      expect(() => j92ReviewQuestion(id, k)).toThrow();
  });
});
