import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const shares=292,price=485;
function irr(entry,divs,exit){let lo=-.95,hi=2;for(let i=0;i<100;i++){const r=(lo+hi)/2,pv=divs.reduce((s,x,j)=>s+x/(1+r)**(j+1),0)+exit/(1+r)**5;if(pv>entry)lo=r;else hi=r;}return (lo+hi)/2;}
const specs={bear:{cash1:4000,growth:[.03,.04,.04,.04,.04,.035,.03,.03,.03],eps1:16,epsGrowth:.04,pe5:20,ke:.115,g:.025,divGrowth:.03},base:{cash1:4600,growth:[.09,.09,.08,.08,.07,.06,.05,.04,.04],eps1:18.5,epsGrowth:.08,pe5:25,ke:.095,g:.03,divGrowth:.07},bull:{cash1:5000,growth:[.12,.12,.11,.10,.09,.08,.07,.06,.05],eps1:19.5,epsGrowth:.11,pe5:29,ke:.085,g:.035,divGrowth:.09}};
function model(p){let cash=p.cash1,retained=0;const rows=[];for(let t=1;t<=10;t++){if(t>1)cash*=1+p.growth[t-2];const dividendPerShare=3.88*(1+p.divGrowth)**t;const dividend=dividendPerShare*shares;if(t<=5)retained+=cash-dividend;assert(cash>=dividend);rows.push({t,year:2026+t,ownerCash:cash,dividendPerShare,retainedFirstFive:retained});}
 const tv=rows[9].ownerCash*(1+p.g)/(p.ke-p.g);
 const operating5=rows.slice(5).reduce((s,x)=>s+x.ownerCash/(1+p.ke)**(x.t-5),0)+tv/(1+p.ke)**5;
 const dividends=rows.slice(0,5).map(x=>x.dividendPerShare),p5=(operating5+retained)/shares;
 const v0=dividends.reduce((s,x,i)=>s+x/(1+p.ke)**(i+1),0)+p5/(1+p.ke)**5;
 const eps5=p.eps1*(1+p.epsGrowth)**4,p5pe=eps5*p.pe5+retained/shares;
 const v0pe=dividends.reduce((s,x,i)=>s+x/(1+p.ke)**(i+1),0)+p5pe/(1+p.ke)**5;
 return {parameters:p,rows,shares,dividends,retainedCash5:retained,operatingValue5:operating5,todayValue:v0,year5Price:p5,earningsToday:v0pe,earningsYear5:p5pe,eps5,irr:irr(price,dividends,p5),earningsIrr:irr(price,dividends,p5pe),terminalShare:tv/(1+p.ke)**10/shares/v0};}
const scenarios=Object.fromEntries(Object.entries(specs).map(([k,p])=>[k,model(p)]));const b=scenarios.base;
const ref=Math.min(b.todayValue,b.earningsToday),exit=Math.min(b.year5Price,b.earningsYear5),maxReturn=b.dividends.reduce((s,d,i)=>s+d/1.12**(i+1),0)+exit/1.12**5;
const highs=[.85,.75,.65].map(f=>Math.floor(Math.min(ref*f,maxReturn)*100)/100);
const entries=[{tier:'observation',low:highs[1]+.01,high:highs[0],budgetSharePct:25},{tier:'safety',low:highs[2]+.01,high:highs[1],budgetSharePct:35},{tier:'discount',low:Math.ceil(ref*.5*100)/100,high:highs[2],budgetSharePct:40}];
const sensitivity=[.085,.095,.105].map(ke=>({ke,values:[.02,.03,.04].map(g=>({g,value:model({...specs.base,ke,g}).todayValue}))}));
let lo=.1,hi=4;for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(model({...specs.base,cash1:specs.base.cash1*mid}).todayValue<price)lo=mid;else hi=mid;}
const output={version:1,units:'USD million; shares million; per-share USD',price,shares,scenarios,entries,requiredAnnualReturn:.12,reference:ref,maxByReturn:maxReturn,sensitivity,reverseOwnerCash1:specs.base.cash1*(lo+hi)/2,
anchors:{nineMonthCfo:3661,capex:93,nciDistributions:269,companyFcf:3299,sbc:127,annualizedAfterSbcProxy:(3299-127)*4/3,debt:13062,cash:2441,redeemableNci:5348,currentBasicShares:289.9,dividendQuarter:.97},
assumptions:['Equity owner cash after interest, minority cash payments, net investment and economic SBC; no second debt/NCI subtraction or cash add-back.','292m fixed economic claims vs289.9m basic is a conservative dilution buffer, not exact fully diluted award count. Future SBC cash replacement charged; no additional future grant dilution or buyback benefit.','First five years actual-model dividends paid; residual owner cash retained at zero return, added to year5 price once. Existing cash and operating capital are not separately added. After year5 full potential owner cash distributable is a valuation assumption.','Debt stock refinanced at broadly unchanged after-tax financing cost; refinancing failure or NCI redemption requires rebuilding cash and entitlement, not treating funding proceeds as profit.','Research periods 2027-2036 approximately 12 months from valuation, not company guidance. EPS1 and cash1 are forecasts, not reported actuals. Mobility excluded; no assumed proceeds for Capital IQ strategic review.','Economic income/cash excludes new idle-cash interest; year5 EPS multiple therefore adds retained surplus once. P/E assumptions are not same-day comparable measurements.']};
await fs.writeFile(new URL('spgi-model-2026-11-05.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{today:x.todayValue,price5:x.year5Price,peToday:x.earningsToday,pe5:x.earningsYear5,irr:x.irr,peIrr:x.earningsIrr,terminalShare:x.terminalShare}])),entries,reverse:output.reverseOwnerCash1},null,2));
