import { describe, it, expect } from 'vitest';
import {
  h07Lessons,
  h07CheckQuestions,
  h07ReviewQuestion,
} from './content/H07';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import {
  rational,
  addR,
  mulR,
  negR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import {
  sequenceAt,
  prefixExtension,
  arithmeticTerm,
  arithmeticSum,
  arithmeticPairs,
  recoverArithmetic,
  recoveredTerm,
  geometricTerm,
  geometricSum,
  geometricTail,
  geometricDefinition,
  adjacentRatio,
  savingsLedger,
  savingsFormula,
  savingsCase,
  savingsCases,
  firstSavingsPeriod,
  roundCents,
  moneyText,
  checkSequenceCode,
  type SavingsConfig,
} from './sequenceModels';
const bodies = import.meta.glob('../../../content/lessons/H07-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h07Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h07CheckQuestions,
];
const subtract = (a: Rational, b: Rational) => addR(a, negR(b));
const power = (a: Rational, n: number) => {
  let v = rational(1n);
  for (let k = 0; k < n; k++) v = mulR(v, a);
  return v;
};
describe('H07 sequences, finite sums and fictional savings', () => {
  it('opens six verified titles with full bilingual lessons and valid earlier prerequisites', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(267);
    expect(openUnits.length).toBeGreaterThanOrEqual(50);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H07-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h07Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H07.questions).toEqual(h07CheckQuestions);
    for (const l of h07Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.parent.prompts).toHaveLength(2);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const index = lessons.findIndex((p) => p.id === id);
        expect(index, id).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h07ReviewQuestion(l.id, 0));
    }
  });
  it('audits fifty-six authored anchors, accepted equivalents, wrong answers and fourteen human arguments', () => {
    const anchors = [
      ['8', 'outside-domain', 'insufficient', '26', '2+2(n-1)'],
      ['20', '3', '5', '-2', '-3'],
      ['40', '14', '16', '80', '0'],
      ['-24', '1/4', '-16', 'both', 'undefined'],
      ['45', '30', '15/2', '0', '3'],
      ['142', '144.1', '100', '5', '0.07'],
    ];
    h07Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([2, 0, 1, 2, 0, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(7);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('sequence index growth', q.answer)).toBeNull();
        continue;
      }
      expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer)).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
    expect(checkAnswer('NZ$142', h07Lessons[5]!.guided.answer)).toBe(true);
    expect(checkAnswer('142 cm', h07Lessons[5]!.guided.answer)).toBe(false);
    expect(
      checkAnswer('1441/10 NZD', h07Lessons[5]!.questions[1]!.answer),
    ).toBe(true);
    expect(checkSequenceCode('条件不足', 'insufficient')).toBe(true);
    expect(checkSequenceCode('both', 'geometric')).toBe(false);
  });
  it('uses positive integer indices and distinguishes explicit rules from nonunique finite prefixes', () => {
    for (let n = 1; n <= 24; n++) {
      expect(sequenceAt('add', n)).toEqual(rational(BigInt(2 * n)));
      expect(sequenceAt('square', n)).toEqual(rational(BigInt(n * n + 1)));
      expect(sequenceAt('double', n)).toEqual(rational(2n ** BigInt(n)));
      expect(sequenceAt('observed', n)).toEqual(
        n <= 3 ? rational(BigInt(2 * n)) : 'insufficient',
      );
      expect((n + 1) ** 2 - n * n).toBe(2 * n + 1);
    }
    for (const n of [0, -1, 1.5, NaN, Infinity])
      expect(sequenceAt('add', n)).toBe('outside-domain');
    expect(() => sequenceAt('add', 25)).toThrow();
    for (let n = 1; n <= 3; n++)
      expect(prefixExtension(n, true)).toEqual(prefixExtension(n));
    expect(prefixExtension(4)).toEqual(rational(8n));
    expect(prefixExtension(4, true)).toEqual(rational(14n));
  });
  it('checks 1575 arithmetic prefixes by iteration and recovers rules from signed index gaps', () => {
    let prefixes = 0;
    for (let first = -3; first <= 3; first++)
      for (let twice = -4; twice <= 4; twice++) {
        const a = rational(BigInt(first)),
          d = rational(BigInt(twice), 2n);
        let value = a,
          total = rational(0n);
        for (let n = 0; n <= 24; n++) {
          if (n > 0) {
            if (n > 1) value = addR(value, d);
            total = addR(total, value);
            expect(sameR(arithmeticTerm(a, d, n), value)).toBe(true);
            const paired = arithmeticPairs(a, d, n);
            expect(paired.forward).toHaveLength(n);
            expect(paired.reverse).toEqual([...paired.forward].reverse());
            for (let j = 0; j < n; j++)
              expect(
                sameR(
                  addR(paired.forward[j]!, paired.reverse[j]!),
                  paired.pairTotal,
                ),
              ).toBe(true);
            expect(sameR(paired.doubleSum, mulR(rational(2n), total))).toBe(
              true,
            );
          }
          expect(sameR(arithmeticSum(a, d, n), total)).toBe(true);
          prefixes++;
        }
        for (let p = 1; p <= 8; p++)
          for (let r = 1; r <= 8; r++) {
            const ap = addR(a, mulR(rational(BigInt(p - 1)), d)),
              ar = addR(a, mulR(rational(BigInt(r - 1)), d)),
              m = recoverArithmetic(p, ap, r, ar);
            if (p === r) {
              expect(m.kind).toBe('insufficient');
              expect(recoveredTerm(m, p)).toEqual(ap);
            } else {
              expect(m.kind).toBe('unique');
              if (m.kind === 'unique') {
                expect(sameR(m.first, a)).toBe(true);
                expect(sameR(m.step, d)).toBe(true);
              }
            }
          }
      }
    expect(prefixes).toBe(1575);
    const repeated = recoverArithmetic(3, rational(7n), 3, rational(7n));
    expect(recoveredTerm(repeated, 3)).toEqual(rational(7n));
    expect(recoveredTerm(repeated, 1)).toBe('insufficient');
    const conflict = recoverArithmetic(3, rational(7n), 3, rational(8n));
    expect(conflict.kind).toBe('inconsistent');
    expect(recoveredTerm(conflict, 3)).toBe('inconsistent');
  });
  it('checks 1225 multiplicative prefixes, finite tails, unit ratios and zero quotients without 0/0', () => {
    let prefixes = 0;
    for (let initial = -3; initial <= 3; initial++)
      for (const raw of ['-2', '-1', '-1/2', '0', '1/2', '1', '2']) {
        const a = rational(BigInt(initial)),
          q = readRational(raw);
        let value = a,
          total = rational(0n);
        expect(geometricDefinition(a, q)).toBe(initial !== 0 && raw !== '0');
        for (let n = 0; n <= 24; n++) {
          if (n > 0) {
            if (n > 1) value = mulR(value, q);
            total = addR(total, value);
            expect(sameR(geometricTerm(a, q, n), value)).toBe(true);
            expect(adjacentRatio(a, q, n)).toEqual(value[0] === 0n ? null : q);
            const previous = geometricSum(a, q, n - 1);
            expect(sameR(subtract(total, previous), value)).toBe(true);
          }
          expect(sameR(geometricSum(a, q, n), total)).toBe(true);
          const tail = geometricTail(a, q, n);
          expect(sameR(tail, mulR(a, power(q, n)))).toBe(true);
          expect(
            sameR(mulR(subtract(rational(1n), q), total), subtract(a, tail)),
          ).toBe(true);
          prefixes++;
        }
      }
    expect(prefixes).toBe(1225);
    expect(geometricSum(rational(5n), rational(1n), 6)).toEqual(rational(30n));
    expect(geometricSum(rational(3n), rational(-1n), 6)).toEqual(rational(0n));
    expect(geometricSum(rational(3n), rational(-1n), 5)).toEqual(rational(3n));
    expect(geometricTerm(rational(3n), rational(0n), 1)).toEqual(rational(3n));
    expect(adjacentRatio(rational(3n), rational(0n), 1)).toEqual(rational(0n));
    expect(adjacentRatio(rational(3n), rational(0n), 2)).toBeNull();
  });
  it('reconciles 108 exact and cent-posted configurations with independent contributions and integer-cent ledgers', () => {
    let configurations = 0;
    for (const initialRaw of ['0', '0.05', '100'])
      for (const depositRaw of ['0', '0.01', '10'])
        for (const qRaw of ['9/10', '1', '11/10'])
          for (const timing of ['end', 'start'] as const)
            for (const policy of ['ideal', 'cents'] as const) {
              const c: SavingsConfig = {
                  initial: readRational(initialRaw),
                  deposit: readRational(depositRaw),
                  multiplier: readRational(qRaw),
                  timing,
                  policy,
                },
                m = savingsLedger(c, 12);
              let cents = (c.initial[0] * 100n) / c.initial[1];
              const depositCents = (c.deposit[0] * 100n) / c.deposit[1];
              expect(savingsLedger(c, 0).balance).toEqual(c.initial);
              for (let n = 1; n <= 12; n++) {
                const row = m.rows[n - 1]!;
                expect(row.period).toBe(n);
                expect(row.opening).toEqual(
                  n === 1 ? c.initial : m.rows[n - 2]!.closing,
                );
                expect(row.before).toEqual(
                  timing === 'start' ? c.deposit : rational(0n),
                );
                expect(row.after).toEqual(
                  timing === 'end' ? c.deposit : rational(0n),
                );
                expect(
                  sameR(
                    addR(
                      addR(row.opening, row.before),
                      addR(row.interest, row.after),
                    ),
                    row.closing,
                  ),
                ).toBe(true);
                if (policy === 'ideal') {
                  let independent = mulR(c.initial, power(c.multiplier, n));
                  for (let deposited = 1; deposited <= n; deposited++)
                    independent = addR(
                      independent,
                      mulR(
                        c.deposit,
                        power(
                          c.multiplier,
                          n - deposited + (timing === 'start' ? 1 : 0),
                        ),
                      ),
                    );
                  expect(sameR(row.closing, independent)).toBe(true);
                  expect(sameR(savingsFormula(c, n), independent)).toBe(true);
                } else {
                  if (timing === 'start') cents += depositCents;
                  cents =
                    (2n * cents * c.multiplier[0] + c.multiplier[1]) /
                    (2n * c.multiplier[1]);
                  if (timing === 'end') cents += depositCents;
                  expect(sameR(row.closing, rational(cents, 100n))).toBe(true);
                }
              }
              expect(
                sameR(
                  m.contributed,
                  addR(c.initial, mulR(rational(12n), c.deposit)),
                ),
              ).toBe(true);
              expect(sameR(addR(m.contributed, m.gain), m.balance)).toBe(true);
              configurations++;
            }
    expect(configurations).toBe(108);
    expect(savingsLedger(savingsCase('standard'), 2).balance).toEqual(
      rational(142n),
    );
    expect(savingsLedger(savingsCase('standard', 'start'), 2).balance).toEqual(
      rational(1441n, 10n),
    );
    const ideal = savingsLedger(savingsCase('tiny'), 2).balance,
      posted = savingsLedger(savingsCase('tiny', 'end', 'cents'), 2).balance;
    expect(ideal).toEqual(rational(121n, 2000n));
    expect(posted).toEqual(rational(7n, 100n));
    expect(roundCents(ideal)).toEqual(rational(6n, 100n));
    expect(moneyText(ideal)).toBe('≈NZ$0.06');
    expect(moneyText(posted)).toBe('NZ$0.07');
    expect(moneyText(rational(-3n, 2n))).toBe('−NZ$1.50');
    expect(roundCents(rational(1n, 200n))).toEqual(rational(1n, 100n));
  });
  it('finds exact first whole target periods, including period zero and a bounded miss that later reaches eight', () => {
    for (const kind of Object.keys(
      savingsCases,
    ) as (keyof typeof savingsCases)[])
      for (const timing of ['end', 'start'] as const)
        for (const policy of ['ideal', 'cents'] as const) {
          const c = savingsCase(kind, timing, policy),
            target = readRational(savingsCases[kind].target),
            ledger = savingsLedger(c, 12),
            balances = [c.initial, ...ledger.rows.map((r) => r.closing)];
          for (let limit = 0; limit <= 12; limit++) {
            const first = balances
                .slice(0, limit + 1)
                .findIndex((r) => r[0] * target[1] >= target[0] * r[1]),
              result = firstSavingsPeriod(c, target, limit);
            expect(result.kind).toBe(first === -1 ? 'not-reached' : 'reached');
            if (result.kind === 'reached') {
              expect(result.period).toBe(first);
              expect(result.balance).toEqual(balances[first]);
              expect(result.previous).toEqual(
                first === 0 ? null : balances[first - 1],
              );
              if (result.previous)
                expect(
                  result.previous[0] * target[1] <
                    target[0] * result.previous[1],
                ).toBe(true);
            }
          }
        }
    expect(
      firstSavingsPeriod(savingsCase('already'), rational(200n), 6),
    ).toMatchObject({ kind: 'reached', period: 0, previous: null });
    expect(
      firstSavingsPeriod(savingsCase('beyond'), rational(200n), 6).kind,
    ).toBe('not-reached');
    expect(
      firstSavingsPeriod(savingsCase('beyond'), rational(200n), 12),
    ).toMatchObject({ kind: 'reached', period: 8 });
    for (const timing of ['end', 'start'] as const)
      expect(
        firstSavingsPeriod(savingsCase('standard', timing), rational(200n), 6),
      ).toMatchObject({ kind: 'reached', period: 5 });
  });
  it('audits all 144 retrievals with independent small-parameter answers, distinct stems and bounded IDs', () => {
    for (let i = 0; i < 6; i++) {
      const id = `H07-L0${i + 1}`,
        stems = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const q = h07ReviewQuestion(id, k);
        stems.add(q.stem.en);
        let expected: string;
        if (i === 0) {
          const n = (k % 6) + 1,
            kind = Math.floor(k / 6);
          expected =
            kind === 0
              ? String(2 * n)
              : kind === 1
                ? String(n * n + 1)
                : kind === 2
                  ? String(2 ** n)
                  : n <= 3
                    ? String(2 * n)
                    : 'insufficient';
        } else if (i === 1) {
          const a = -2 + (k % 6),
            d = Math.floor(k / 6) - 1,
            n = 3 + (k % 4);
          expected = String(k % 2 === 0 ? a + (n - 1) * d : d);
        } else if (i === 2) {
          const a = 1 + (k % 4),
            d = (Math.floor(k / 4) % 3) - 1,
            n = 3 + Math.floor(k / 12) * 2;
          let total = 0;
          for (let j = 0; j < n; j++) total += a + j * d;
          expected = String(total);
        } else if (i === 3) {
          const a = readRational(['-2', '0', '3'][Math.floor(k / 8)]!),
            r = readRational(['-2', '-1', '0', '1/2'][k % 4]!),
            n = 2 + (Math.floor(k / 4) % 2);
          let v = a;
          for (let j = 1; j < n; j++) v = mulR(v, r);
          expected =
            k % 3 === 0
              ? v[0] === 0n
                ? 'undefined'
                : textR(r)
              : k % 3 === 1
                ? textR(v)
                : a[0] !== 0n && r[0] !== 0n
                  ? 'geometric'
                  : 'not-geometric';
        } else if (i === 4) {
          const a = rational(BigInt(1 + (k % 3))),
            r = readRational(['-1', '1/2', '1', '2'][Math.floor(k / 3) % 4]!),
            n = 3 + Math.floor(k / 12);
          let v = a,
            s = rational(0n);
          for (let j = 0; j < n; j++) {
            s = addR(s, v);
            v = mulR(v, r);
          }
          expected = textR(s);
        } else {
          let v = rational(BigInt(50 + 10 * (k % 3)));
          const d = rational(BigInt(5 + 5 * (Math.floor(k / 3) % 2))),
            n = 1 + (Math.floor(k / 6) % 2),
            start = k >= 12;
          for (let j = 0; j < n; j++)
            v = start
              ? mulR(addR(v, d), rational(11n, 10n))
              : addR(mulR(v, rational(11n, 10n)), d);
          expected = textR(v);
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(h07ReviewQuestion(id, k + 24).answer).toEqual(q.answer);
        expect(h07ReviewQuestion(id, k + 24).id).not.toBe(q.id);
      }
      expect(stems.size, id).toBe(24);
      expect(h07ReviewQuestion(id, 100000).id).toContain('100000');
    }
    expect(checkAnswer('60', h07ReviewQuestion('H07-L06', 0).answer)).toBe(
      true,
    );
    expect(checkAnswer('71', h07ReviewQuestion('H07-L06', 1).answer)).toBe(
      true,
    );
    for (const n of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => h07ReviewQuestion('H07-L01', n)).toThrow();
    expect(() => h07ReviewQuestion('H07-L07', 0)).toThrow();
  });
  it('rejects unsupported domains and separates ideal formulas from cent posting', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity, 25]) {
      expect(() => arithmeticTerm(rational(1n), rational(1n), n)).toThrow();
      expect(() => geometricTerm(rational(1n), rational(1n), n)).toThrow();
    }
    expect(arithmeticSum(rational(2n), rational(3n), 0)).toEqual(rational(0n));
    expect(geometricSum(rational(2n), rational(0n), 0)).toEqual(rational(0n));
    expect(() => geometricSum(rational(1001n), rational(2n), 4)).toThrow();
    expect(() =>
      savingsFormula(savingsCase('tiny', 'end', 'cents'), 2),
    ).toThrow();
    expect(() =>
      savingsLedger(
        { ...savingsCase('tiny', 'end', 'cents'), initial: rational(1n, 200n) },
        2,
      ),
    ).toThrow();
    expect(() =>
      savingsLedger(
        { ...savingsCase('standard'), multiplier: rational(0n) },
        2,
      ),
    ).toThrow();
    expect(() =>
      savingsLedger({ ...savingsCase('standard'), deposit: rational(-1n) }, 2),
    ).toThrow();
    expect(() => roundCents(rational(-1n))).toThrow();
    expect(() =>
      firstSavingsPeriod(savingsCase('standard'), rational(-1n)),
    ).toThrow();
    const end = savingsLedger(savingsCase('standard'), 3),
      start = savingsLedger(savingsCase('standard', 'start'), 3);
    expect(end.balance).toEqual(rational(831n, 5n));
    expect(start.balance).toEqual(rational(16951n, 100n));
    expect(end.contributed).toEqual(rational(130n));
    expect(end.gain).toEqual(rational(181n, 5n));
    expect(start.gain).toEqual(rational(3951n, 100n));
    expect(
      sameR(
        divR(rational(120n), rational(100n)),
        divR(rational(142n), rational(120n)),
      ),
    ).toBe(false);
  });
});
