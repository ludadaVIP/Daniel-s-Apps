import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir=new URL('./',import.meta.url),file=new URL('crdo-evidence-model-2026-11-05.json',dir);
export const e=JSON.parse(await fs.readFile(file,'utf8'));
const k=e.capital,price=e.market.valuationPrice,sum=(a,f=x=>x)=>a.reduce((s,x)=>s+f(x),0);
let checks=0;
const near=(a,b,name)=>{checks++;if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>1e-6*Math.max(1,Math.abs(a)))throw Error(`CRDO independent audit ${name}: ${a}/${b}`);};
export function calculate(c,scale=1,extraDepositRatio=0){
  const revenues=c.revenues.map(x=>x*scale);for(const g of c.tailGrowth)revenues.push(revenues.at(-1)*(1+g));
  let nwc=288.798+313.051-101.822,cash=k.cashAndShortTermInvestments+k.optionExerciseProceeds,claims=k.knownFullyDilutedClaims,previousRevenue=e.facts.TTM.revenue;
  const years=revenues.map((revenue,i)=>{
    const newNwc=revenue*c.nwcRate[i],deltaNwc=newNwc-nwc;nwc=newNwc;
    const ebit=revenue*(c.preNewCompMargin[i]-c.newCompRate[i]),tax=Math.max(0,ebit)*c.tax[i],nopat=ebit-tax;
    const da=revenue*c.daRate,ppe=revenue*c.ppeRate,license=revenue*c.techRate,deposit=(i===0?102.4:0)+Math.max(0,revenue-previousRevenue)*extraDepositRatio;previousRevenue=revenue;
    const fcff=nopat+da-ppe-license-deltaNwc-deposit,earncash=i===1?c.earnoutCash:0;claims+=i===1?c.earnoutShares:0;cash+=fcff-earncash;
    if(cash<k.requiredOperatingReserveAssumption-1e-7)throw Error('Unmodeled financing need');
    return {year:2027+i,t:i+1,revenue,economicEBIT:ebit,cashOperatingTax:tax,NOPAT:nopat,DA:da,PPECapex:ppe,technologyLicenseCapex:license,allCashCapex:ppe+license,tradeNWC:nwc,deltaTradeNWC:deltaNwc,incrementalCapacityDeposits:deposit,FCFF:fcff,acquisitionEarnoutCash:earncash,FCFEafterAcquisitionClaims:fcff-earncash,economicShares:claims,cashAndInvestmentsEnd:cash,excessCashEnd:cash-k.requiredOperatingReserveAssumption,liquidityHeadroom:cash-k.requiredOperatingReserveAssumption};
  });
  const d=c.discount,g=c.g,stableRevenue=revenues[9]*(1+g),stableNopat=stableRevenue*c.terminalEBITMargin*(1-c.tax[9]),reinvestment=stableNopat*g/c.terminalROIC,terminalCash=stableNopat-reinvestment,terminal=terminalCash/(d-g);
  const startingSurplus=k.cashAndShortTermInvestments+k.optionExerciseProceeds-k.requiredOperatingReserveAssumption,denominator=k.knownFullyDilutedClaims+c.earnoutShares;
  const pvFlows=sum(years,r=>r.FCFEafterAcquisitionClaims/(1+d)**r.t),pvTerminal=terminal/(1+d)**10;
  const today=(startingSurplus+pvFlows+pvTerminal)/denominator;
  const checkpointOperating=sum(years.slice(5),r=>r.FCFEafterAcquisitionClaims/(1+d)**(r.t-5))+terminal/(1+d)**5;
  const future=(checkpointOperating+years[4].excessCashEnd)/years[4].economicShares;
  const crossFuture=(years[4].NOPAT*c.maturePE+years[4].excessCashEnd)/years[4].economicShares;
  return {years,terminal:{revenue:stableRevenue,NOPAT:stableNopat,reinvestment,FCFF:terminalCash,value:terminal,presentValue:pvTerminal},valuation:{todayValue:today,horizon2031DCFPrice:future,horizon2031MatureEarningsPrice:crossFuture,matureEarningsTodayValue:crossFuture/(1+d)**5,fiveYearAnnualizedReturn:(future/price)**.2-1,fiveYearTotalReturn:future/price-1,PVfutureCashFlowsAfterAcquisitionClaims:pvFlows,PVterminal:pvTerminal,initialExcessCash:startingSurplus,valuationDenominator:denominator,terminalShareOfOperatingValue:pvTerminal/(pvFlows+pvTerminal),DCFCheckpointOperatingValue:checkpointOperating,DCFCheckpointExcessCash:years[4].excessCashEnd}};
}
export const rebuilt={};
for(const [id,s]of Object.entries({...e.scenarios,...e.stress})){
  const scale=s.years[0].revenue/s.assumptions.revenues[0],r=calculate(s.assumptions,scale);rebuilt[id]=r;
  for(let i=0;i<10;i++)for(const [key,value]of Object.entries(r.years[i]))near(value,s.years[i][key],`${id}/${i+1}/${key}`);
  for(const [key,value]of Object.entries(r.terminal))near(value,s.terminal[key],id+'/terminal/'+key);
  for(const [key,value]of Object.entries(r.valuation))near(value,s.valuation[key],id+'/valuation/'+key);
}
for(const row of e.sensitivity)for(let i=0;i<row.growths.length;i++)near(calculate({...e.scenarios.base.assumptions,discount:row.discount,g:row.growths[i]}).valuation.todayValue,row.values[i],'Ke/g');
const rev=calculate(e.scenarios.base.assumptions,e.reverse.requiredForecastRevenueScale);near(rev.valuation.todayValue,price,'reverse market price');near(rev.years[4].revenue,e.reverse.required2031Revenue,'reverse revenue');
near(k.knownFullyDilutedClaims,k.issuedOrdinaryShares+k.RSUs+k.PSUs+k.options+k.exchangeableHyperlumeSubsidiaryShares,'all existing claims once');near(k.optionExerciseProceeds,k.options*k.optionWeightedExercise,'option capital once');
const anchors=JSON.parse(await fs.readFile(new URL('crdo-parent-financial-anchors-2026-11-05.json',dir),'utf8'));
const fields={revenue:'revenue',grossProfit:'grossProfit',ebit:'EBIT',netIncome:'netIncomeConsolidated',cfo:'CFO',ppeCapex:'PPEcashCapex',technologyLicenseCash:'technologyLicenseCash',sbc:'SBC',da:'DAexcludingAcquiredIntangibles'};
for(const row of anchors.annual){const found=e.facts.financialHistory.find(x=>x.fiscalYear===row.year);for(const [a,b]of Object.entries(fields))near(row[a],found[b],`original FY${row.year}/${a}`);}
for(const [a,b]of Object.entries(fields))near(anchors.ttm[a],e.facts.TTM[b],'original TTM '+a);
near(anchors.cfoParts.reduce((a,b)=>a+b,0),e.facts.latestQuarter.CFO,'full original Q1 cash bridge');
const ids=new Set(e.sources.map(s=>s.sourceId));if(ids.size!==e.sources.length)throw Error('Duplicate source identifiers');
function sourceCheck(x){if(!x||typeof x!=='object')return;for(const [key,v]of Object.entries(x)){if(key==='sourceId'&&typeof v==='string'&&!ids.has(v))throw Error('Unresolved source '+v);else if(key==='sourceIds'&&Array.isArray(v)){for(const id of v)if(!ids.has(id))throw Error('Unresolved source '+id);}else if(v&&typeof v==='object')sourceCheck(v);}}
sourceCheck(e.facts);sourceCheck(e.capital);
for(const s of e.sources){if(!s.url.startsWith('https://'))throw Error('Invalid source URL');if(s.local)await fs.access(new URL(s.local,dir));}
// Additional cash pressure; no assumed refunds on these extra deposit amounts.
e.parentAdditionalSensitivity={capacityDepositOnePercentIncrementalRevenue:calculate(e.scenarios.base.assumptions,1,.01).valuation,description:'额外每年按正收入增量1%预付供应押金，无未来返还信用；独立研究压力，不是已承诺支出。'};
if(!e.sources.some(s=>s.sourceId==='SECREFRESH'))e.sources.push({sourceId:'SECREFRESH',title:'SEC最新提交全表，核至2026-11-05UTC，最近10-Q仍9月2日',url:'https://data.sec.gov/submissions/CIK0001807794.json',date:'访问2026-11-05',local:'crdo-sec-refresh-submissions-2026-11-05.json'});
e.status='verified-frozen';e.independentAuditMethod='Independent JavaScript economic reconstruction and original-statement financial anchors; Python author model not imported or executed by auditor';e.frozenAtUTC??=new Date().toISOString();
const raw=JSON.stringify(e,null,2);await fs.writeFile(file,raw);
export const audit={passed:true,checks,at:new Date().toISOString(),modelSha256:createHash('sha256').update(raw).digest('hex'),originalFinancialAnchors:'crdo-parent-financial-anchors-2026-11-05.json',method:e.independentAuditMethod,scenarios:Object.fromEntries(Object.entries(e.scenarios).map(([id,s])=>[id,{today:s.valuation.todayValue,future:s.valuation.horizon2031DCFPrice,crossToday:s.valuation.matureEarningsTodayValue}]))};
await fs.writeFile(new URL('crdo-audit-evidence-2026-11-05.json',dir),JSON.stringify(audit,null,2));console.log(JSON.stringify(audit,null,2));
