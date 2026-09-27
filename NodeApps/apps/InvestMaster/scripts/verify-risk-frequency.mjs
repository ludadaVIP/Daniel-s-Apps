// Exact benchmarks for original teaching models. No prices or user data are read.
// npm run verify:risk-frequency
// Probabilities are fractions of one; monetary units are not involved here.
import assert from 'node:assert/strict';

function binomialDistribution(n, p) {
  const probabilities = [Math.exp(n * Math.log1p(-p))];
  for (let k = 0; k < n; k += 1) {
    probabilities.push(probabilities[k] * ((n - k) / (k + 1)) * (p / (1 - p)));
  }
  const mass = probabilities.reduce((sum, value) => sum + value, 0);
  assert(Math.abs(mass - 1) < 1e-12, 'The finite probability masses must sum to one');
  return probabilities;
}

const zeroUpper95 = (n) => -Math.expm1(Math.log(0.05) / n);
const tailAt = (probabilities, minimumCount) => probabilities
  .slice(minimumCount).reduce((sum, value) => sum + value, 0);

const n = 250;
const nullDistribution = binomialDistribution(n, 0.01);
const alternativeDistribution = binomialDistribution(n, 0.02);
const criticalCount = nullDistribution.findIndex((_, k) => tailAt(nullDistribution, k) <= 0.05);
assert.equal(criticalCount, 6);
const minimumZeroCountSample = Math.ceil(Math.log(0.05) / Math.log1p(-0.01));
assert.equal(minimumZeroCountSample, 299);
assert(zeroUpper95(minimumZeroCountSample) <= 0.01);
assert(zeroUpper95(minimumZeroCountSample - 1) > 0.01);

console.log(JSON.stringify({
  model: 'Original one-day continuous-loss VaR frequency exercise; independent Bernoulli exceptions',
  fixedSampleSize: n,
  nullExceptionProbability: 0.01,
  expectedNullExceptionCount: n * 0.01,
  probabilityOfZeroExceptions: nullDistribution[0],
  rejectAtOrAboveCount: criticalCount,
  probabilityAtOrAboveFive: tailAt(nullDistribution, 5),
  nullRejectionProbability: tailAt(nullDistribution, criticalCount),
  powerAtTwoPercentExceptions: tailAt(alternativeDistribution, criticalCount),
  oneSided95UpperIfZeroObserved: zeroUpper95(n),
  minimumFixedSampleForZeroObservedUpperAtMostOnePercent: minimumZeroCountSample,
  interpretation: 'A predeclared one-sided test, not regulatory traffic lights. Failing to reject is not model certification. Frequency excludes severity, clustering and liquidity. The zero-observed limit is conditional on that hypothetical observation.',
}, null, 2));

const specifiedRareProbability = 0.00001;
const relativePrecisionTarget = 0.1;
const minimumDrawsForRelativeMcse = Math.ceil((1 - specifiedRareProbability)
  / (relativePrecisionTarget ** 2 * specifiedRareProbability));
for (const draws of [100000, 1000000]) {
  console.log(JSON.stringify({
    model: 'Separate original rare-event simulation benchmark; exact formulas, no random draws performed',
    specifiedRareProbability,
    draws,
    expectedEventCount: draws * specifiedRareProbability,
    probabilityOfNoEvents: Math.exp(draws * Math.log1p(-specifiedRareProbability)),
    probabilityMcse: Math.sqrt(specifiedRareProbability * (1 - specifiedRareProbability) / draws),
    relativeMcse: Math.sqrt((1 - specifiedRareProbability) / (draws * specifiedRareProbability)),
    oneSided95UpperIfZeroObserved: zeroUpper95(draws),
    minimumDrawsForRelativeMcseAtMostTenPercent: minimumDrawsForRelativeMcse,
    interpretation: 'Given-model independent sampling only. An unknown rate confidence limit is not a posterior or an upper bound on omitted real-world mechanisms. MCSE precision is not a 95 percent relative error guarantee.',
  }, null, 2));
}
