import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Independent reconstruction. Only declared anchors and scenario inputs are
// read from the final JSON. No Python source is imported or executed.
const directory = 'D:/Github/Daniel-s-Apps/NodeApps/apps/my_holdings/data/reports/decisions';
const inputPath = path.join(directory, 'hood-fcfe-evidence-model-2026-11-05.json');
const sourcePath = path.join(directory, 'hood-build-fcfe-model-2026-11-05.py');
const inputBytes = readFileSync(inputPath);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const inputHash = digest(inputBytes);
const expectedHash = '4b0e1baed825bbe46998a729a7ce2d7782dbc532d0de0ce7883b0ccd93721b4b';
if (inputHash !== expectedHash) throw new Error(`Unconfirmed model hash: ${inputHash}`);
const author = JSON.parse(inputBytes.toString('utf8'));
const anchors = author.anchors;
const scenario = Object.fromEntries(['bear','base','bull'].map(name => [name, structuredClone(author.paths[name].parameters)]));
const basicPlusAwards = anchors.basicShares + anchors.existingUnvestedRsu + anchors.existingUnvestedPsu;
const warrantNet = anchors.quote > anchors.warrantStrike ? anchors.warrants * (anchors.quote - anchors.warrantStrike) / anchors.quote : 0;
const reservedShares = basicPlusAwards + warrantNet;
let numericalChecks = 0;
let booleanChecks = 0;
let maxAbsoluteDifference = 0;
let maxRelativeDifference = 0;
const failures = [];
const caveats = [];

function compare(actual, expected, label) {
  if (typeof expected === 'number') {
    numericalChecks += 1;
    const absolute = Math.abs(actual - expected);
    const relative = absolute / Math.max(1, Math.abs(expected));
    maxAbsoluteDifference = Math.max(maxAbsoluteDifference, absolute);
    maxRelativeDifference = Math.max(maxRelativeDifference, relative);
    if (!Number.isFinite(actual) || absolute > 1e-7 + 1e-10 * Math.abs(expected)) failures.push({label,actual,expected,absolute,relative});
  } else if (typeof expected === 'boolean') {
    booleanChecks += 1;
    if (actual !== expected) failures.push({label,actual,expected});
  } else if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) throw new Error(`Shape mismatch: ${label}`);
    expected.forEach((value, index) => compare(actual[index], value, `${label}[${index}]`));
  } else if (expected && typeof expected === 'object') {
    for (const [key,value] of Object.entries(expected)) {
      if (key === 'parameters') continue; // Explicitly accepted input, not an independent fact test.
      if (!(key in actual)) throw new Error(`Missing reconstructed field: ${label}.${key}`);
      compare(actual[key], value, `${label}.${key}`);
    }
  }
}

function allocation(valueAt5, requiredReturn) {
  const perShareAt5 = Math.max(valueAt5, 0) / reservedShares;
  const hypotheticalMarketPriceAt3 = perShareAt5 / (1 + requiredReturn) ** 2;
  const unmodeledPremium = anchors.convertPrincipal * Math.max(hypotheticalMarketPriceAt3 / anchors.convertStrike - anchors.cappedCallCap / anchors.convertStrike, 0);
  return {
    todayValue: perShareAt5 / (1 + requiredReturn) ** 5,
    year5Price: perShareAt5,
    shares: reservedShares,
    returnAtQuote: Math.expm1(Math.log(perShareAt5 / anchors.quote) / 5),
    totalReturnAtQuote: perShareAt5 / anchors.quote - 1,
    netWarrantSharesReserved: warrantNet,
    warrantExerciseProceedsCredited: 0,
    conversionPriceProxyYear3: hypotheticalMarketPriceAt3,
    unmodeledNetConvertiblePremium: unmodeledPremium,
    convertibleAssumptionPass: unmodeledPremium === 0
  };
}

function rebuild(parameters, overrides = {}) {
  const scale = overrides.scale ?? 1;
  const marginShift = overrides.marginShift ?? 0;
  const serviceShift = overrides.serviceShift ?? 0;
  const taxShift = overrides.taxShift ?? 0;
  const initialLoss = overrides.initialLoss ?? 0;
  const capitalMultiplier = overrides.capitalMultiplier ?? 1;
  const k = parameters.ke, g = parameters.g;
  if (k <= g) throw new Error('Invalid perpetuity spread');
  let capital = anchors.parentBook;
  let cumulativeCash = 0;
  let minimumCash = 0;
  let revenue = parameters.firstRevenue * scale;
  const rows = [];
  for (let yearIndex = 0; yearIndex < 10; yearIndex += 1) {
    const year = yearIndex + 1;
    if (yearIndex > 0) revenue *= 1 + parameters.growth[yearIndex - 1];
    const beforeCompMargin = parameters.preCompPretaxMargins[yearIndex] + marginShift;
    const compensation = revenue * (parameters.futureServiceCostPct[yearIndex] + serviceShift);
    const issuanceCost = year <= 3 ? anchors.unamortizedIssuanceCost / 3 : 0;
    const yieldLost = year >= 4 ? 0.035 * anchors.convertPrincipal : 0;
    const pretax = revenue * beforeCompMargin - compensation - issuanceCost - yieldLost;
    const tax = Math.max(pretax, 0) * (parameters.tax + taxShift);
    const groupEarnings = pretax - tax;
    const minority = Math.max(groupEarnings, 0) * parameters.nciProfitShare;
    const parentEarnings = groupEarnings - minority - (year === 1 ? initialLoss : 0);
    const capitalAtStart = capital;
    capital = Math.max(anchors.parentBook, parameters.capitalRevenueRatio * capitalMultiplier * revenue);
    const incrementalCapital = capital - capitalAtStart;
    const fcfe = parentEarnings - incrementalCapital;
    // Stage 1 retains all cash. Stage 2 distributes positive cash and requires
    // additional capital from the existing cash balance for negative FCFE.
    const distribution = year > 5 ? Math.max(fcfe, 0) : 0;
    cumulativeCash += fcfe - distribution;
    minimumCash = Math.min(minimumCash, cumulativeCash);
    rows.push({
      t:year, year:2026+year, revenue,
      preFutureServicePretaxMargin:beforeCompMargin,
      futureNewServiceCashCompensation:compensation,
      pretax, normalTax:tax, nciEarnings:minority,
      parentEconomicEarnings:parentEarnings,
      requiredCapitalOpening:capitalAtStart, requiredCapitalClosing:capital,
      capitalIncrease:incrementalCapital, ownerFcfe:fcfe,
      surplusBalance:cumulativeCash, distributionAfterYear5:distribution,
      debtAmortization:issuanceCost,
      lostInterestAfterPrincipalRepayment:yieldLost,
      roeOnOpeningRequiredCapital:parentEarnings/capitalAtStart
    });
  }
  const earnings11 = rows[9].parentEconomicEarnings * (1+g);
  const incrementalCapital11 = capital * g; // Explicit terminal capital-floor growth rule.
  const fcfe11 = earnings11 - incrementalCapital11;
  if (fcfe11 <= 0) throw new Error('Terminal owner cash flow not positive');
  const terminalValue10 = fcfe11 / (k-g);
  // Reconstruct the franchise value backwards, rather than reusing the
  // author's forward discounted summation.
  let franchise5 = terminalValue10;
  for (let index = 9; index >= 5; index -= 1) franchise5 = (franchise5 + rows[index].ownerFcfe) / (1+k);
  const retained5 = rows[4].surplusBalance;
  const equity5 = franchise5 + retained5;
  const immediatelyDistributable = rows.reduce((pv,row) => pv + row.ownerFcfe/(1+k)**row.t, 0) + terminalValue10/(1+k)**10;
  const primary = allocation(equity5,k);
  const earningsMultiple = allocation(rows[4].parentEconomicEarnings*parameters.pe5 + retained5,k);
  return {
    parameters, scale, capitalMultiplier, rows, primary, earningsMultiple,
    retainedSurplus5:retained5, franchiseDcf5:franchise5, unallocatedEquity5:equity5,
    standardImmediatelyDistributableFcfeToday:immediatelyDistributable,
    zeroYieldRetentionDrag:immediatelyDistributable-equity5/(1+k)**5,
    unfundedEquityNeed:Math.max(-minimumCash,0), fundingAssumptionPass:minimumCash>=-1e-8,
    terminal:{ownerFcfe:fcfe11,economicEarnings:earnings11,requiredCapital:capital,
      roe:earnings11/capital,reinvestmentFraction:incrementalCapital11/earnings11,
      payoutFraction:fcfe11/earnings11,equity:terminalValue10,impliedPe:terminalValue10/earnings11,
      impliedPriceBook:terminalValue10/capital,
      pvTerminalShareOfToday:terminalValue10/(1+k)**10/(equity5/(1+k)**5)}
  };
}

const independentlyRebuilt = Object.fromEntries(Object.entries(scenario).map(([key,value]) => [key,rebuild(value)]));
for (const name of ['bear','base','bull']) compare(independentlyRebuilt[name],author.paths[name],`paths.${name}`);
const base = independentlyRebuilt.base;
const baseParams = scenario.base;
const referenceToday = Math.min(base.primary.todayValue,base.earningsMultiple.todayValue);
const referenceAt5 = Math.min(base.primary.year5Price,base.earningsMultiple.year5Price);
const maxByReturn = referenceAt5 / 1.15**5;
const thresholds = [.25,.35,.45].map(margin => Math.floor(100*Math.min(referenceToday*(1-margin),maxByReturn))/100);
const centsRound = x => Math.round(x*100)/100;
const entries = [
  {tier:'observation',low:centsRound(thresholds[1]+.01),high:thresholds[0],budgetSharePct:25},
  {tier:'safety',low:centsRound(thresholds[2]+.01),high:thresholds[1],budgetSharePct:35},
  {tier:'discount',low:Math.ceil(referenceToday*.35*100)/100,high:thresholds[2],budgetSharePct:40}
];
compare({requiredAnnualReturn:.15,referenceToday,referenceYear5:referenceAt5,maxByReturn,entries},author.purchase,'purchase');

// On this positive-profit route, value is affine in a uniform margin shift.
// Solve it algebraically, independently of the author's bisection method.
const shifted1 = rebuild(baseParams,{marginShift:1});
const requiredShift = (anchors.quote-base.primary.todayValue)/(shifted1.primary.todayValue-base.primary.todayValue);
const root = rebuild(baseParams,{marginShift:requiredShift});
const peakBaseMargin = Math.max(...baseParams.preCompPretaxMargins);
const maximumFeasibleShift = 1-peakBaseMargin;
const feasibleLimit = rebuild(baseParams,{marginShift:maximumFeasibleShift});
const reverse = {
  fixedRevenueAndCapitalPath:true, requiredUniformPretaxMarginIncrease:requiredShift,
  peakRequiredPreCompPretaxMargin:peakBaseMargin+requiredShift,
  economicallyFeasibleWithin100pctMargin:requiredShift<=maximumFeasibleShift,
  maxFeasibleUniformShift:maximumFeasibleShift,
  todayValueAt100pctPeakPreCompMargin:feasibleLimit.primary.todayValue,
  todayValueAtUnconstrainedMathematicalRoot:root.primary.todayValue,
  unfundedEquityNeedAtRoot:root.unfundedEquityNeed,
  requiredPe5AtKe:(anchors.quote*(1+baseParams.ke)**5*reservedShares-base.retainedSurplus5)/base.rows[4].parentEconomicEarnings,
  requiredPe5For15pctReturn:(anchors.quote*1.15**5*reservedShares-base.retainedSurplus5)/base.rows[4].parentEconomicEarnings
};
compare(reverse,author.reverse,'reverse');
const sensitivity = [.105,.115,.125,.135,.145].map(ke => ({ke,values:[.02,.025,.03,.035,.04].map(g => ({g,todayValue:rebuild({...baseParams,ke,g}).primary.todayValue}))}));
compare(sensitivity,author.sensitivity,'sensitivity');
const capitalSensitivity = [1,1.3,1.5,1.7,2,2.2].map(capitalRevenueRatio => {
  const result = rebuild({...baseParams,capitalRevenueRatio});
  return {capitalRevenueRatio,todayValueBeforeFundingAdjustment:result.primary.todayValue,fundingAssumptionPass:result.fundingAssumptionPass,unfundedEquityNeed:result.unfundedEquityNeed};
});
compare(capitalSensitivity,author.capitalSensitivity,'capitalSensitivity');
const stress = {
  revenueMinus20MarginMinus5pp:rebuild(baseParams,{scale:.8,marginShift:-.05}),
  futureServiceCompPlus3pp:rebuild(baseParams,{serviceShift:.03}),
  normalTaxPlus5pp:rebuild(baseParams,{taxShift:.05}),
  requiredCapitalPlus25pct:rebuild(baseParams,{capitalMultiplier:1.25}),
  cashCreditOperationalLoss2500:rebuild(scenario.bear,{initialLoss:2500})
};
compare(stress,author.stresses,'stresses');
const grossShares = basicPlusAwards+anchors.warrants;
const grossSensitivity = {shares:grossShares,baseToday:base.unallocatedEquity5/grossShares/(1+baseParams.ke)**5,baseYear5:base.unallocatedEquity5/grossShares};
compare(grossSensitivity,author.grossWarrantReserveSensitivity,'grossWarrantReserveSensitivity');

for (const [name,result] of Object.entries(independentlyRebuilt)) {
  if (!result.fundingAssumptionPass || !result.primary.convertibleAssumptionPass || !result.earningsMultiple.convertibleAssumptionPass) failures.push({label:`main scenario economic validity flags ${name}`,funding:result.fundingAssumptionPass,convertPrimary:result.primary.convertibleAssumptionPass,convertSecondary:result.earningsMultiple.convertibleAssumptionPass});
  if (result.terminal.reinvestmentFraction < 0 || result.terminal.reinvestmentFraction > 1) failures.push({label:`terminal reinvestment ${name}`,value:result.terminal.reinvestmentFraction});
}

const summary = Object.fromEntries(Object.entries(independentlyRebuilt).map(([name,v]) => [name,{
  todayFcfe:v.primary.todayValue,year5Fcfe:v.primary.year5Price,
  todayEarnings:v.earningsMultiple.todayValue,year5Earnings:v.earningsMultiple.year5Price,
  capital5:v.rows[4].requiredCapitalClosing,retainedCash5:v.retainedSurplus5,
  terminalRoe:v.terminal.roe,terminalImpliedPe:v.terminal.impliedPe,
  terminalValueShare:v.terminal.pvTerminalShareOfToday,
  fundingPass:v.fundingAssumptionPass,convertiblePass:v.primary.convertibleAssumptionPass&&v.earningsMultiple.convertibleAssumptionPass
}]));

caveats.push(
  'This is independent arithmetic reconstruction and limited economic consistency review, not validation of forecasts, security fair value, legal capital sufficiency, or investment suitability.',
  'Operating revenue/margins/capital ratios, normal tax, NCI shares, 3.5% lost asset yield, zero-yield retained cash, and research P/E multiples are accepted scenario inputs; the audit does not establish them as economic facts.',
  'No current/excess corporate cash or customer/platform assets are added, and already recorded debt principal is not subtracted again. This treatment is consistent only with the declared debt-financed-asset release assumption and does not prove parent liquidity in 2029.',
  'Net warrant reserve is a common current-quote treasury-stock-style approximation, not an independently priced option. Existing award/date overlap and new cash-compensation calibration remain disclosed approximations.',
  'At terminal transition, the capital floor itself grows at g; this is an explicit change of the preterminal fixed-floor policy and is conservative when the floor remains binding. It is arithmetically coherent under that declared rule.',
  'A failed funding or capped-call flag invalidates the unadjusted per-share diagnostic as an investable value. No full financing, market option-path or above-cap convertible-premium cash model is validated here.',
  'P/E and FCFE disagreement reflects different growth-duration and capital assumptions. Taking their minimum is a disclosed action heuristic, not independent corroboration of intrinsic value.',
  'D&A and capitalized software are not modeled as separate FCFE reinvestment. The use of required total economic capital must implicitly include maintenance/growth reinvestment in nonfinancial operating assets; otherwise NI-minus-capital-growth would overstate cash. Capital coefficients are not a full asset/liability or regulatory capital forecast.',
  'Retained cash at year 5 is valued at par once. The model implicitly assumes that cash can be valued/realized separately at that horizon; permanent trapped cash, taxes on extraction, and subsidiary distribution constraints are not independently reconstructed.',
  'Near-12-month research periods are approximations rather than exact quarterly cash dates. The audit accepts the normalized salary/old award allocation convention and does not independently price each existing grant.'
);
const audit = {
  status:failures.length===0?'PASS_WITH_ECONOMIC_LIMITATIONS':'FAIL',
  auditedAtUtc:new Date().toISOString(),modelVersion:author.version,
  inputJson:inputPath,inputJsonSha256:inputHash,authorPython:sourcePath,authorPythonSha256:digest(readFileSync(sourcePath)),
  method:'Independent JavaScript. Reads declared JSON inputs only; reconstructs 10-year cash/capital rows, backwards franchise DCF, terminal, shared dilution, reverse algebraic root, grids and stresses. Never imports or executes author Python.',
  numericalChecks,booleanChecks,maxAbsoluteDifference,maxRelativeDifference,failures,
  summary,purchase:{referenceToday,referenceYear5:referenceAt5,maxByReturn,entries},reverse,
  capitalSensitivity,stressValidity:Object.fromEntries(Object.entries(stress).map(([name,v])=>[name,{fundingPass:v.fundingAssumptionPass,unfundedEquityNeed:v.unfundedEquityNeed,convertiblePass:v.primary.convertibleAssumptionPass&&v.earningsMultiple.convertibleAssumptionPass}])),
  coverage:['all numeric/boolean results under main paths, excluding accepted input parameters','25 Ke/g sensitivity cases','6 capital-ratio sensitivity cases','5 complete stress paths','entry thresholds/required-return limits','fixed-route margin reverse algebraic root and required exit P/E','gross warrant-share denominator sensitivity'],
  notCovered:caveats
};
writeFileSync(path.join(directory,'hood-independent-fcfe-audit-2026-11-05.json'),JSON.stringify(audit,null,2)+'\n','utf8');
const lines = [
  '# HOOD 最终FCFE模型独立复算与有限经济审查',
  `结果：${audit.status}；独立JS数值比对${numericalChecks}项、布尔比对${booleanChecks}项；最大绝对差${maxAbsoluteDifference}（金额单位百万美元）。`,
  `权威JSON SHA256：${inputHash}。未运行或导入作者Python。`,
  '', '|情景|今日FCFE|2031 FCFE|今日盈利法|2031盈利法|2031留存现金（百万美元）|融资/可转条件|',
  '|---|---:|---:|---:|---:|---:|---|',
  ...Object.entries(summary).map(([name,v])=>`|${name}|${v.todayFcfe.toFixed(4)}|${v.year5Fcfe.toFixed(4)}|${v.todayEarnings.toFixed(4)}|${v.year5Earnings.toFixed(4)}|${v.retainedCash5.toFixed(4)}|${v.fundingPass&&v.convertiblePass?'通过':'不通过'}|`),
  '', '覆盖：三主情景全部10年盈利/所需资本/FCFE/现金桥、终值及估值；25组Ke/g；6组资本系数；5个完整压力路径；三档价格及所需收益率；独立解析反推统一利润率增量和未来P/E；权证全部保留分母敏感性。',
  '', '资本系数压力：',...capitalSensitivity.map(v=>`- c=${v.capitalRevenueRatio}：${v.todayValueBeforeFundingAdjustment.toFixed(4)}，融资通过=${v.fundingAssumptionPass}，未融资缺口=${v.unfundedEquityNeed.toFixed(4)}百万美元。`),
  '', '经济限制与未覆盖：',...caveats.map(v=>`- ${v}`),
  '', '原型RIM已弃用，不在本次最终FCFE算术认证中。正式报告应按主情景适用范围引用结果；不通过融资/可转条件的压力数字只可标为融资前诊断。'
];
writeFileSync(path.join(directory,'hood-independent-fcfe-audit-2026-11-05.md'),lines.join('\n')+'\n','utf8');
console.log(JSON.stringify({status:audit.status,inputHash,numericalChecks,booleanChecks,maxAbsoluteDifference,maxRelativeDifference,summary,reverse,stressValidity:audit.stressValidity,failures},null,2));
if (failures.length) process.exitCode=1;
