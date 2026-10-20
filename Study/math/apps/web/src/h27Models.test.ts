import { describe, it, expect } from 'vitest';
import { textR, addR, sameR } from './algebraModels';
import { dataNumber } from './dataModellingModels';
import {
  statisticsCases,
  correlationModel,
  transformPairs,
  regressionAudit,
  samplingDistribution,
  samplingSimulation,
  responseBounds,
} from './statisticsModels';
describe('H27 exact statistics against independent numerical and combinatorial oracles', () => {
  it('computes signed correlation independently, preserving scale and shift rules and separating constant columns', () => {
    for (const a of [-1, 0, 1])
      for (const b of [-1, 0, 1])
        for (const c of [-1, 0, 1]) {
          const rows = [a, b, c].map((y, i) => ({
              id: `R${i}`,
              x: String(i),
              y: String(y),
            })),
            m = correlationModel(rows),
            mean = (a + b + c) / 3,
            dy = [a - mean, b - mean, c - mean],
            sxy = -dy[0]! + dy[2]!,
            syy = dy.reduce((s, d) => s + d * d, 0);
          if (syy === 0) expect(m.value).toBeNull();
          else {
            expect(m.value).toBeCloseTo(sxy / Math.sqrt(2 * syy));
            expect(Math.abs(m.value!)).toBeLessThanOrEqual(1 + 1e-12);
          }
          const transformed = correlationModel(
            transformPairs(rows, '2', '3', '3', '-2'),
          );
          if (m.value === null) expect(transformed.value).toBeNull();
          else expect(transformed.value).toBeCloseTo(m.value);
          const reflected = correlationModel(
            transformPairs(rows, '1', '0', '-1', '6'),
          );
          if (m.value !== null) expect(reflected.value).toBeCloseTo(-m.value);
        }
    expect(correlationModel(statisticsCases.noisy).text).toBe('1/2');
    expect(correlationModel(statisticsCases.negative).text).toBe('-1');
    expect(correlationModel(statisticsCases.curve).text).toBe('0');
    expect(correlationModel(statisticsCases.flat).text).toBe('undefined');
    expect(correlationModel(statisticsCases.vertical).text).toBe('undefined');
    expect(correlationModel(statisticsCases.flat).fit.slope).not.toBeNull();
    expect(correlationModel(statisticsCases.vertical).fit.slope).toBeNull();
    expect(correlationModel(statisticsCases.influence).text).toBe('0');
    expect(correlationModel(statisticsCases.influence.slice(0, 4)).text).toBe(
      '1',
    );
  });
  it('verifies 200 candidate SSE decompositions, global lower bounds and exact orthogonality', () => {
    for (const rows of Object.values(statisticsCases))
      for (const a of ['-2', '0', '1', '1/2', '2'])
        for (const b of ['-1', '0', '1/2', '1', '2']) {
          const m = regressionAudit(rows, a, b),
            num = (s: string) =>
              s.includes('/')
                ? Number(s.split('/')[0]) / Number(s.split('/')[1])
                : Number(s),
            expected = rows.reduce(
              (s, r) => s + (num(r.y) - num(a) - num(b) * num(r.x)) ** 2,
              0,
            );
          expect(dataNumber(m.candidate.sse)).toBeCloseTo(expected);
          expect(sameR(m.gap, addR(m.levelCost, m.slopeCost))).toBe(true);
          expect(m.gap[0]).toBeGreaterThanOrEqual(0n);
        }
    const m = regressionAudit(statisticsCases.noisy, '1', '1/2');
    expect(textR(m.candidate.sse)).toBe('3/2');
    expect(textR(m.sumResidual)).toBe('0');
    expect(textR(m.sumXResidual)).toBe('0');
    expect(
      textR(regressionAudit(statisticsCases.noisy, '2', '0').candidate.sse),
    ).toBe('2');
    for (const b of ['-1', '0', '1', '2']) {
      const a = String(2 - 2 * Number(b)),
        v = regressionAudit(statisticsCases.vertical, a, b);
      expect(textR(v.gap)).toBe('0');
    }
  });
  it('preserves residual signs, original x, curve structure and the fan spread', () => {
    const u = regressionAudit(statisticsCases.curve, '2', '0');
    expect(u.candidate.rows.map((r) => textR(r.residual))).toEqual([
      '2',
      '-1',
      '-2',
      '-1',
      '2',
    ]);
    expect(textR(u.sumResidual)).toBe('0');
    expect(textR(u.candidate.sse)).toBe('14');
    const f = regressionAudit(statisticsCases.fan, '0', '2');
    expect(f.candidate.rows.map((r) => textR(r.residual))).toEqual([
      '-1/2',
      '1/2',
      '-2',
      '2',
      '-3',
      '3',
    ]);
    expect(textR(f.candidate.sse)).toBe('53/2');
  });
  it('enumerates distinct-identity subsets and computes exact finite-population sampling variance', () => {
    const means = [
        [0, 0, 4, 4],
        [0, 2, 2, 2, 2, 4],
        [4 / 3, 4 / 3, 8 / 3, 8 / 3],
        [2],
      ],
      sizes = [4, 6, 4, 1];
    for (let n = 1; n <= 4; n++) {
      const d = samplingDistribution(n),
        values = d.samples.map((s) => dataNumber(s.mean)).sort((a, b) => a - b);
      expect(d.samples).toHaveLength(sizes[n - 1]!);
      expect(values).toEqual(means[n - 1]);
      expect(new Set(d.samples.map((s) => s.ids.join(','))).size).toBe(
        sizes[n - 1],
      );
      expect(dataNumber(d.mean)).toBe(2);
      expect(dataNumber(d.variance)).toBeCloseTo(((4 / n) * (4 - n)) / 3);
      expect(dataNumber(d.bias)).toBe(0);
      for (const s of d.samples) {
        expect(new Set(s.ids).size).toBe(n);
        expect(s.indices).toHaveLength(n);
      }
      const c = samplingDistribution(n, 'convenience'),
        first = [0, 0, 4, 4].slice(0, n).reduce((s, v) => s + v, 0) / n;
      expect(dataNumber(c.mean)).toBeCloseTo(first);
      expect(dataNumber(c.bias)).toBeCloseTo(first - 2);
      expect(textR(c.variance)).toBe('0');
    }
    expect(
      samplingDistribution(2).distribution.map((d) => [
        d.value,
        textR(d.probability),
      ]),
    ).toEqual([
      ['0', '1/6'],
      ['2', '2/3'],
      ['4', '1/6'],
    ]);
  });
  it('reproduces seeded runs, preserves prefixes and separates empirical counts from exact theory', () => {
    for (const n of [1, 2, 3, 4])
      for (const seed of [0, 1, 7, 31, 4294967295])
        for (const design of ['srs', 'convenience'] as const) {
          const m = samplingSimulation(n, 48, seed, design);
          expect(m).toEqual(samplingSimulation(n, 48, seed, design));
          expect(m.draws.slice(0, 12)).toEqual(
            samplingSimulation(n, 12, seed, design).draws,
          );
          expect(m.empirical.reduce((s, r) => s + r.observed, 0)).toBe(48);
          for (const draw of m.draws) {
            expect(new Set(draw.ids).size).toBe(n);
            expect(
              m.exact.samples.some(
                (s) => s.ids.join(',') === draw.ids.join(','),
              ),
            ).toBe(true);
          }
          expect(m.exact).toEqual(samplingDistribution(n, design));
        }
    expect(samplingSimulation(2, 48, 1).draws).not.toEqual(
      samplingSimulation(2, 48, 7).draws,
    );
  });
  it('bounds every binary completion and rejects incoherent counts, protocol values and paired IDs', () => {
    for (let N = 1; N <= 8; N++)
      for (let n = 1; n <= N; n++)
        for (let yes = 0; yes <= n; yes++) {
          const b = responseBounds(N, n, yes);
          expect(dataNumber(b.sampleRate)).toBeCloseTo(yes / n);
          for (let u = 0; u <= N - n; u++) {
            expect((yes + u) / N).toBeGreaterThanOrEqual(
              dataNumber(b.lower) - 1e-12,
            );
            expect((yes + u) / N).toBeLessThanOrEqual(
              dataNumber(b.upper) + 1e-12,
            );
          }
          expect(dataNumber(b.lower)).toBeCloseTo(yes / N);
          expect(dataNumber(b.upper)).toBeCloseTo((yes + N - n) / N);
        }
    expect(textR(responseBounds(200, 20, 15).lower)).toBe('3/40');
    expect(textR(responseBounds(200, 20, 15).upper)).toBe('39/40');
    for (const args of [
      [0, 0, 0],
      [20, 0, 0],
      [10, 11, 1],
      [10, 5, 6],
      [10, 5, -1],
      [10, 1.5, 1],
    ])
      expect(() =>
        responseBounds(...(args as [number, number, number])),
      ).toThrow();
    for (const n of [0, 1.5, 5])
      expect(() => samplingDistribution(n)).toThrow();
    for (const seed of [-1, 0.5, 4294967296])
      expect(() => samplingSimulation(2, 12, seed)).toThrow();
    expect(() => samplingSimulation(2, 501, 1)).toThrow();
    expect(() =>
      correlationModel([
        { id: 'X', x: '1', y: '2' },
        { id: 'X', x: '2', y: '3' },
      ]),
    ).toThrow();
  });
});
