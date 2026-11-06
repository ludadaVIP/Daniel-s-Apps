import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const shares=1900,price=440.48;
function irr(entry,divs,exit){let lo=-.95,hi=2;for(let i=0;i<100;i++){const r=(lo+hi)/2,pv=divs.reduce((s,x,j)=>s+x/(1+r)**(j+1),0)+exit/(1+r)**5;if(pv>entry)lo=r;else hi=r;}return (lo+hi)/2;}
const specs={bear:{cash1:21000,growth:[.03,.04,.04,.04,.04,.035,.03,.03,.03],eps1:12.8,epsGrowth:.04,pe5:20,ke:.115,g:.025,divGrowth:.03},base:{cash1:24000,growth:[.09,.09,.08,.08,.07,.06,.05,.04,.04],eps1:14.3,epsGrowth:.095,pe5:26,ke:.095,g:.03,divGrowth:.07},bull:{cash1:27000,growth:[.12,.12,.11,.10,.09,.08,.07,.06,.05],eps1:15.2,epsGrowth:.11,pe5:29,ke:.085,g:.035,divGrowth:.09}};
function model(p){let cash=p.cash1,retained=0;const rows=[];for(let t=1;t<=10;t++){if(t>1)cash*=1+p.growth[t-2];const dividendPerShare=3.12*(1+p.divGrowth)**t;const dividend=dividendPerShare*shares;if(t<=5)retained+=cash-dividend-(t===1?2400:0);assert(cash>=dividend);rows.push({t,year:2026+t,ownerCash:cash,dividendPerShare,retainedFirstFive:retained});}
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
anchors:{cfoFY:23728,capexFY:1671,sbcFY:928,ownerCashProxy:21129,debt:22071,unrestrictedCash:12938,investments:1239,restrictedLitigationCash:628,clientCollateral:4349,litigationProvision:1764,litigationLiability:990,quarterDilutedShares:1880,dividendQuarter:.780,biocatchCashCost:2400},
assumptions:['Equity economic owner cash after interest, tax, capex, future cash-replacement SBC and expected ongoing legal cost. Cash1=24000 forecast vsFY2026 CFO23728-capex1671-SBC928=21129 proxy. Do not add back all litigation as cost-free. Tax normalized18.5% approximately in EPS forecast; cash conversion may differ.',
'1900m fixed equivalentA fully diluted claims vsQ4 average1880m, FY average1910m. Covers all classes/preferred on as-converted basis, not raw1728m A-only. Future cash-based SBC economic expense, no free buyback or duplicate grant dilution. Changes to classB/VE conversion ratios may require rebuild.',
'First5 forecast dividends from3.12 annual rate; retained residual zero-yield added at2031 once. BioCatch2400 acquisition cash deducted first year; no separate earnings synergy or funding share issue assumed. No future acquisitions or buyback gain.',
'Debt broadly refinanced at comparable cost; owner cash/EPS already after interest. No second full debt subtraction or cash add-back. Litigation escrow628 and client collateral4349 excluded from shareholder surplus; opening liquidity/capital retained for settlement and business needs.',
'Future normal EPS14.3 after GAAP SBC, preferred/all-class rights and recurring legal cost. PE26 is research assumption, not current peer quote. Core EPS excludes earnings on new idle cash, permitting one retained cash addition.',
'FY2026 full-year release is unaudited, latest available10-Q June2026 and10-K FY2025. Cashflow starts2027 approximately12-month projection, not Visa guidance. Litigation/antitrust/routing changes may impair economics rather than just create a one-time payable.']};
await fs.writeFile(new URL('v-model-2026-11-05.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{today:x.todayValue,price5:x.year5Price,peToday:x.earningsToday,pe5:x.earningsYear5,irr:x.irr,peIrr:x.earningsIrr,terminalShare:x.terminalShare}])),entries,reverse:output.reverseOwnerCash1},null,2));
