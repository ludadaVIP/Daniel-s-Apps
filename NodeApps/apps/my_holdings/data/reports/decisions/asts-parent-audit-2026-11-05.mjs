import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Separate JavaScript reconstruction of economic cash, claims and ownership.
// Does not import or execute the evidence author's Python model.
const dir=new URL('./',import.meta.url);
const raw=await fs.readFile(new URL('asts-evidence-model-2026-11-05.json',dir),'utf8');
export const evidence=JSON.parse(raw);
const m=evidence.methodology, notes=evidence.capital.notes;
let checks=0;
function near(a,b,label){checks++;if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>1e-6*Math.max(1,Math.abs(a)) )throw Error(`ASTS parent audit ${label}: ${a} / ${b}`);}
const add=(arr,f=x=>x)=>arr.reduce((s,v)=>s+f(v),0);

export function reconstruct(a,mask,inputs={}){
  let cash=m.openingCashM+(inputs.cash_delta||0),wip=inputs.wip_override??m.openingPaidSatelliteWipM,shares=m.startingFullyDilutedUnitsM,nwc=m.openingOperatingNwcM,raised=0,trinity=m.trinityStartingPrincipalM;
  let cohorts=m.openingCohorts.map(c=>({...c}));const ground=[];const rows=[];
  for(let i=0;i<10;i++){
    const year=2027+i,retiring=cohorts.filter(c=>year-c.year>=c.life),surviving=cohorts.filter(c=>year-c.year<c.life);
    const additions=a.fleet[i]-add(surviving,c=>c.count),unit=a.unitSatelliteCostM*(1+m.unitCostInflation)**i*(inputs.cost_scale??1);
    const procurement=additions*unit/(1-a.launchFailureCostRate),credit=Math.min(wip,procurement);wip-=credit;
    const satDa=add(surviving,c=>c.count*c.unitCost/c.life)+add(retiring,c=>c.count*c.unitCost/c.life/2)+additions*unit/a.satelliteLife/2;
    const groundDa=m.initialGroundDaM+add(ground,c=>c/m.groundAssetLife)+a.groundCapexM[i]/m.groundAssetLife/2,da=satDa+groundDa;
    ground.push(a.groundCapexM[i]);cohorts=[...surviving,{year,count:additions,unitCost:unit,life:a.satelliteLife}];
    const users=a.usersM[i]*(inputs.user_multiplier??1),netArpu=a.retailMonthly*a.astRevenueShare,service=users*netArpu*12,revenue=service+a.otherRevenueM[i];
    const ebitda=service*(a.serviceContribution+(inputs.margin_delta??0))+a.otherRevenueM[i]*a.otherContribution-a.fixedOpexM[i]-a.spectrumAnnualM*1.02**i,ebit=ebitda-da;
    const newNwc=revenue*m.nwcPctRevenue,dNwc=newNwc-nwc;nwc=newNwc;
    const capex=procurement-credit+a.groundCapexM[i]+m.otherSpectrumClosingCashM[i],opTax=Math.max(ebit,0)*m.taxRate;
    const fcff=ebit-opTax+da-capex-dNwc-m.prepaymentNoncashRevenueM[i];
    let interest=trinity*m.trinityCashRate+(year===2030?m.trinityEndFeeM:0)+(year<=2028?m.ubsAnnualNetSpreadM:0),principal=m.trinityPrincipalScheduleM[i],converted=0;
    trinity-=m.trinityPrincipalScheduleM[i];
    for(let j=0;j<notes.length;j++){
      const n=notes[j];if(year>n.maturityYear)continue;
      interest+=n.principalM*n.coupon*(year===n.maturityYear?n.maturityYearCoupons/2:1);
      if(year===n.maturityYear){if(mask[j])converted+=n.principalM*n.conversionRatePer1000/1000;else principal+=n.principalM;}
    }
    const tax=Math.max(ebit-interest,0)*m.taxRate,release=year===2028?m.ubsCollateralRestrictedM-m.ubsPrincipalMatchedM:0;
    const equityCash=ebit-tax+da-capex-dNwc-m.prepaymentNoncashRevenueM[i]-interest-principal+release;
    const before=cash+equityCash,needed=Math.max(0,m.minimumCashM-before)/(1-m.equityIssueCost),gross=Math.min(needed,a.maxAnnualGrossEquityM,Math.max(0,a.maxTotalGrossEquityM-raised));
    const issuePrice=a.equityIssuePrice[i]*(inputs.issue_price_scale??1),net=gross*(1-m.equityIssueCost),newShares=gross/issuePrice;
    raised+=gross;shares+=newShares+converted;
    const available=before+net,gap=Math.max(0,m.minimumCashM-available),distribution=i>=5&&gap<1e-7?Math.max(0,available-m.minimumCashM):0;
    cash=available-distribution;
    rows.push({year,t:i+1,usersM:users,netMonthlyArpu:netArpu,serviceRevenueM:service,revenueM:revenue,ebitdaM:ebitda,satelliteDaM:satDa,groundDaM:groundDa,daM:da,ebitM:ebit,taxM:tax,operatingTaxM:opTax,retiredSatellites:add(retiring,c=>c.count),newSatellites:additions,endFleet:a.fleet[i],unitSatelliteCostM:unit,grossSatelliteProcurementM:procurement,prepaidWipUsedM:credit,remainingPrepaidWipM:wip,cashCapexM:capex,operatingNwcM:nwc,deltaNwcM:dNwc,fcffM:fcff,interestCashM:interest,principalCashM:principal,fcfeBeforeNewEquityM:equityCash,equityGrossM:gross,equityNetM:net,equityIssuePrice:issuePrice,equityIssuedSharesM:newShares,noteConvertedSharesM:converted,endSharesM:shares,endCashM:cash,financingShortfallM:gap,distributionM:distribution,financingGrossCumulativeM:raised});
    if(gap>1e-7)return {rows,failed:true,todayValue:0,year5Price:0};
  }
  const last=rows[9],g=a.terminalGrowth,ke=a.equityCost;
  const satReplacement=last.endFleet*last.unitSatelliteCostM*(1+g)/a.satelliteLife/(1-a.launchFailureCostRate),groundReplacement=last.groundDaM*(1+g),economicDa=satReplacement+groundReplacement;
  const terminalEbitda=last.ebitdaM*(1+g),terminalEbit=terminalEbitda-economicDa,terminalTax=Math.max(terminalEbit,0)*m.taxRate;
  const assetBase=last.endFleet*last.unitSatelliteCostM*(1+g)+400+add(a.groundCapexM),growthCapex=g*assetBase,terminalNwc=last.operatingNwcM*g;
  const terminalFcfe=terminalEbit-terminalTax-growthCapex-terminalNwc;
  const terminalEquity=Math.max(0,terminalFcfe/(ke-g))+Math.max(0,last.endCashM-m.minimumCashM),terminalPs=terminalEquity/last.endSharesM;
  // Direct discounted ownership cash flows, rather than the author's recursion.
  const valueAt=t=>add(rows.filter(r=>r.t>t),r=>(r.distributionM/r.endSharesM)/(1+ke)**(r.t-t))+terminalPs/(1+ke)**(10-t);
  const today=valueAt(0),year5=valueAt(5);
  const maturity=notes.map((n,j)=>{const row=rows.find(r=>r.year===n.maturityYear),cum=valueAt(row.t)+row.distributionM/row.endSharesM;return {converted:mask[j],price:cum,strike:n.conversionPrice,consistent:mask[j]?cum>=n.conversionPrice-1e-7:cum<=n.conversionPrice+1e-7};});
  return {rows,failed:false,todayValue:today,year5Price:year5,terminalEquity,terminalPs,terminalFcfe,terminalEbit,terminalTax,assetBase,growthCapex,satReplacement,groundReplacement,terminalPvFraction:terminalPs/(1+ke)**10/today,maturity,priceByYear:Object.fromEntries(rows.map(r=>[r.year,valueAt(r.t)]))};
}

export function solve(a,inputs={}){
  const solutions=[],failures=[];
  for(let bits=0;bits<32;bits++){
    const mask=notes.map((_,j)=>Boolean(bits&(1<<(4-j)))),r=reconstruct(a,mask,inputs);
    if(r.failed)failures.push(r);else if(r.maturity.every(v=>v.consistent))solutions.push(r);
  }
  if(solutions.length)return solutions.sort((a,b)=>a.todayValue-b.todayValue)[0];
  if(failures.length===32)return failures[0];
  return {indeterminate:true};
}

export function reconstructPe(a,r){
  if(r.failed)return {todayValue:0,year5Price:0};
  const row=r.rows[4],excess=Math.max(0,row.endCashM-m.minimumCashM),values=[];
  for(let bits=0;bits<32;bits++){
    const mask=notes.map((_,j)=>Boolean(bits&(1<<j))),coupon=add(notes.filter((_,j)=>!mask[j]),n=>n.principalM*n.coupon),shares=row.endSharesM+add(notes.filter((_,j)=>mask[j]),n=>n.principalM*n.conversionRatePer1000/1000);
    const ni=Math.max(0,(row.ebitM-coupon)*(1-m.taxRate)),p=(ni*a.exitPE+excess)/shares;
    if(notes.every((n,j)=>mask[j]?p>=n.conversionPrice:p<=n.conversionPrice))values.push({year5Price:p,todayValue:p/(1+a.equityCost)**5,ni,shares});
  }
  if(!values.length)throw Error('No P/E claim solution');return values.sort((a,b)=>a.year5Price-b.year5Price)[0];
}

export const reconstructed={};
for(const s of evidence.scenarios){
  const r=solve(s.assumptions);if(r.indeterminate)throw Error('Main scenario indeterminate '+s.id);reconstructed[s.id]=r;
  near(r.todayValue,s.todayValue,s.id+'/today');near(r.year5Price,s.year5Price,s.id+'/year5');
  if(r.rows.length!==s.rows.length)throw Error('Row count '+s.id);
  for(let i=0;i<r.rows.length;i++)for(const [k,v] of Object.entries(r.rows[i]))near(v,s.rows[i][k],`${s.id}/${r.rows[i].year}/${k}`);
  if(!r.failed){near(r.terminalEquity,s.terminal.equityValueM,s.id+'/terminal');near(r.terminalFcfe,s.terminal.fcffM,s.id+'/terminal cash');near(r.terminalPvFraction,s.terminalPvFraction,s.id+'/terminal proportion');for(const v of r.maturity)if(!v.consistent)throw Error('Maturity mismatch');}
  const pe=reconstructPe(s.assumptions,r);near(pe.todayValue,s.secondMethod.todayValue,s.id+'/P/E PV');near(pe.year5Price,s.secondMethod.year5Price,s.id+'/P/E future');
}
const base=evidence.scenarios.find(s=>s.id==='base');
for(const row of evidence.stress.baseKeGMatrix){const r=solve({...base.assumptions,equityCost:row.equityCost,terminalGrowth:row.g});if(r.indeterminate){if(row.todayValue!==null)throw Error('Sensitivity unresolved');}else {near(r.todayValue,row.todayValue,'matrix PV');near(r.year5Price,row.year5Price,'matrix future');}}
for(const row of evidence.stress.linkedOperatingAndFinancingStress){const r=solve(base.assumptions,row.inputs);if(r.indeterminate){if(row.todayValue!==null)throw Error('Expected unresolved sensitivity');}else {near(r.todayValue,row.todayValue,'stress '+row.name);near(r.year5Price,row.year5Price,'stress future '+row.name);near(r.rows.at(-1).financingGrossCumulativeM,row.totalGrossEquityM,'stress funding');near(r.rows.at(-1).endSharesM,row.endingSharesM,'stress shares');}}
const reverse=solve(base.assumptions,{user_multiplier:evidence.reverse.userMultiplier});near(reverse.todayValue,evidence.reverse.targetPrice,'reverse price');near(reverse.rows[4].usersM,evidence.reverse.users2031M,'reverse users');

// Original-statement anchors were separately read by the parent before this model.
const anchors=JSON.parse(await fs.readFile(new URL('asts-parent-financial-anchors-2026-11-05.json',dir),'utf8'));
const mapping={revenue:'revenueM',ebit:'ebitM',consolidatedNetIncome:'netLossConsolidatedM',parentNetIncome:'netLossParentCommonM',cfo:'cfoM',ppeCapex:'cashCapexM'};
for(const row of anchors.annual){const actual=evidence.facts.history.find(h=>h.period===`FY${row.year}`);for(const [key,field]of Object.entries(mapping))near(row[key],actual[field],`history${row.year}/${key}`);}
for(const [key,field]of Object.entries(mapping))near(anchors.ttm[key],evidence.facts.ttm[field],'TTM '+key);
near(add([evidence.capital.classASharesM,evidence.capital.classBSharesM,evidence.capital.classCSharesM]),evidence.capital.economicCommonUnitsM,'Up-C units');
near(add(evidence.capital.notes,n=>n.principalM)+m.trinityStartingPrincipalM+m.ubsPrincipalMatchedM,evidence.capital.actualDebtPlusJulyGrossM,'debt principal bridge');
near(add(m.prepaymentNoncashRevenueM),evidence.facts.revenueRecognition.contractLiabilityM,'prepaid cash recognition');

export const parentAudit={passed:true,checks,at:new Date().toISOString(),modelSha256:createHash('sha256').update(raw).digest('hex'),method:'Independent JavaScript reconstruction from economic assumptions; direct per-share future distributions/terminal ownership, debt settlement consistency, capex/cohort replacement, annual equity funding, P/E claims, reverse, sensitivity and separately-read original financial anchors.',scenarios:evidence.scenarios.map(s=>({id:s.id,today:s.todayValue,year5:s.year5Price,peToday:s.secondMethod.todayValue,peYear5:s.secondMethod.year5Price}))};
await fs.writeFile(new URL('asts-parent-audit-2026-11-05.json',dir),JSON.stringify(parentAudit,null,2));
console.log(JSON.stringify(parentAudit,null,2));
