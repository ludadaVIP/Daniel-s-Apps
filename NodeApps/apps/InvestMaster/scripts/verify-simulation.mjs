// Original teaching models only. No prices, accounts or learning records are read.
// Usage: node scripts/verify-simulation.mjs [draws] [nonzero-32-bit-seed]
const draws = Number(process.argv[2] ?? 100000);
const seed = Number(process.argv[3] ?? 20260925);
if (!Number.isSafeInteger(draws) || draws < 100 || draws > 1000000) {
  throw new Error('draws must be an integer between 100 and 1000000');
}
if (!Number.isSafeInteger(seed) || seed < 1 || seed > 0xffffffff) {
  throw new Error('seed must be an integer between 1 and 4294967295');
}

// Initialize once per run; advance the state for each draw.
// This small PRNG is for reproducing the exercise, not validating financial models.
let state = seed >>> 0;
function uniform() {
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  return (state >>> 0) / 4294967296;
}

const goodNpv = 150 / 1.1 - 80;
const badNpv = 40 / 1.1 - 80;
let goodCount = 0;
for (let i = 0; i < draws; i += 1) if (uniform() < 0.6) goodCount += 1;
const badCount = draws - goodCount;
const analyticMean = 0.6 * goodNpv + 0.4 * badNpv;
const simulatedMean = (goodCount * goodNpv + badCount * badNpv) / draws;
const modelLossProbability = 0.4;
const probabilityMcse = Math.sqrt(0.4 * 0.6 / draws);
const meanMcse = Math.sqrt(0.6 * (goodNpv - analyticMean) ** 2
  + 0.4 * (badNpv - analyticMean) ** 2) / Math.sqrt(draws);
console.log(JSON.stringify({
  model: 'Two-state teaching NPV; amounts in millions; specified probabilities only',
  draws, seed, goodCount, badCount, analyticMean, simulatedMean,
  modelLossProbability, simulatedLossProbability: badCount / draws,
  probabilityMcse, meanMcse,
  meanDeviationInModelStandardErrors: (simulatedMean - analyticMean) / meanMcse,
  interpretation: 'MCSE assumes independent draws under the specified model. It excludes uncertainty in inputs and structure. The seeded exercise does not prove these assumptions.',
}, null, 2));

// A separate exact finite-path exercise: receipts at two dates, then payments.
function cashPath(receipts, reserve, floor) {
  let cash = reserve;
  let policyBreached = false;
  const steps = [];
  for (let i = 0; i < receipts.length; i += 1) {
    const available = cash + receipts[i];
    const payment = 30;
    if (available < payment) {
      steps.push({ period: i + 1, available, payment, fundingGap: payment - available });
      return { reserve, failed: true, policyBreached: true, endingCash: null, steps };
    }
    cash = available - payment;
    if (cash < floor) policyBreached = true;
    steps.push({ period: i + 1, available, payment, cashAfterPayment: cash });
  }
  return { reserve, failed: false, policyBreached, endingCash: cash, steps };
}
for (const reserve of [0, 20, 30, 35]) {
  const late = cashPath([0, 70], reserve, 5);
  const even = cashPath([35, 35], reserve, 5);
  console.log(JSON.stringify({
    model: 'Separate two-date teaching cash paths; equal specified probabilities',
    reserve, late, even,
    exactPaymentFailureProbability: (Number(late.failed) + Number(even.failed)) / 2,
    exactPolicyBreachProbability: (Number(late.policyBreached) + Number(even.policyBreached)) / 2,
  }));
}
