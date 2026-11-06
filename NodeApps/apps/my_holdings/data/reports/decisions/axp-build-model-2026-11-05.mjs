import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const price=336.20,shares=680,book0=(35797-1584)/shares;
const specs={bear:{eps1:15.5,epsGrowth:.03,coreGrowth:.06,fadeRoe:[.27,.24,.21,.18,.15],ke:.12,g:.02,pe5:15,divGrowth:.03},base:{eps1:18.5,epsGrowth:.075,coreGrowth:.08,fadeRoe:[.35,.34,.33,.32,.30],ke:.10,g:.03,pe5:20,divGrowth:.07},bull:{eps1:19.5,epsGrowth:.11,coreGrowth:.09,fadeRoe:[.37,.37,.36,.36,.35],ke:.09,g:.035,pe5:24,divGrowth:.09}};
function irr(divs,exit){let lo=-.95,hi=2;for(let i=0;i<90;i++){const r=(lo+hi)/2,pv=divs.reduce((s,d,j)=>s+d/(1+r)**(j+1),0)+exit/(1+r)**5;if(pv>price)lo=r;else hi=r;}return (lo+hi)/2;}
function calc(p){let book=book0,excess=0;const rows=[];for(let t=1;t<=10;t++){const opening=book,eps=t<=5?p.eps1*(1+p.epsGrowth)**(t-1):p.fadeRoe[t-6]*opening;
const growth=t<=5?p.coreGrowth:[.05,.05,.04,.03,p.g][t-6];book=opening*(1+growth);const potential=eps-(book-opening),dividend=3.8*(1+p.divGrowth)**t;assert(potential>0);if(t<=5){assert(potential>=dividend);excess+=potential-dividend;}
rows.push({t,year:2026+t,openingBook:opening,closingBook:book,eps,roe:eps/opening,residualIncome:eps-p.ke*opening,potentialCapitalReturn:potential,dividend});}
const tvRi=(p.fadeRoe[4]-p.ke)*book/(p.ke-p.g);
const coreV5=rows[4].closingBook+rows.slice(5).reduce((s,x)=>s+x.residualIncome/(1+p.ke)**(x.t-5),0)+tvRi/(1+p.ke)**5;
const rim5=coreV5+excess,pe5=rows[4].eps*p.pe5+excess,divs=rows.slice(0,5).map(x=>x.dividend);
const pvD=divs.reduce((s,d,i)=>s+d/(1+p.ke)**(i+1),0),rim0=pvD+rim5/(1+p.ke)**5,pe0=pvD+pe5/(1+p.ke)**5;
// Independent equivalent capital-return DDM reconciles RIM at year5.
const terminalPayout=(p.fadeRoe[4]-p.g)*book/(p.ke-p.g);
const coreDdm5=rows.slice(5).reduce((s,x)=>s+x.potentialCapitalReturn/(1+p.ke)**(x.t-5),0)+terminalPayout/(1+p.ke)**5;
assert(Math.abs(coreDdm5-coreV5)<1e-8);
return {parameters:p,rows,excess5:excess,coreV5,rim5,pe5,rim0,pe0,divs,irr:irr(divs,rim5),peIrr:irr(divs,pe5),ddmReconciles:true};}
const scenarios=Object.fromEntries(Object.entries(specs).map(([k,p])=>[k,calc(p)])),b=scenarios.base,reference=Math.min(b.rim0,b.pe0);
const maxReturn=b.divs.reduce((s,d,i)=>s+d/1.12**(i+1),0)+Math.min(b.rim5,b.pe5)/1.12**5;
const highs=[.85,.75,.65].map(f=>Math.floor(Math.min(reference*f,maxReturn)*100)/100),entries=[{tier:'observation',low:+(highs[1]+.01).toFixed(2),high:highs[0],budgetSharePct:25},{tier:'safety',low:+(highs[2]+.01).toFixed(2),high:highs[1],budgetSharePct:35},{tier:'discount',low:Math.ceil(reference*.5*100)/100,high:highs[2],budgetSharePct:40}];
const sensitivity=[.09,.10,.11].map(ke=>({ke,values:[.02,.03,.04].map(g=>({g,value:calc({...specs.base,ke,g}).rim0}))}));
let lo=.10,hi=.70;for(let i=0;i<90;i++){const x=(lo+hi)/2;if(calc({...specs.base,fadeRoe:[x,x,x,x,x]}).rim0<price)lo=x;else hi=x;}
const out={reverseFlatRoe6to10:(lo+hi)/2,units:'per share USD unless specified',price,shares,book0,anchors:{totalEquityMillion:35797,preferredCarryingMillion:1584,preferredLiquidationMillion:1600,basicSharesMillion:671,currentQuarterDilutedMillion:674,nineMonthSbcMillion:495,cet1:.109,effectiveMinimumCet1:.07},scenarios,reference,maxReturn,entries,sensitivity,
assumptions:['Common operating book starts total equity minus preferred carrying value, divided by680m fixed claims vs671m basic and674m diluted; not tangible capital or a liquidation floor. Goodwill/OCI remain in accounting book.','EPS forecasts after tax, credit costs, GAAP SBC expense, preferred dividends and ordinary reinvestment. No second SBC or debt/preferred subtraction. No future buyback EPS uplift. First-year normal EPS18.5 is forecast, vs2026 adjusted guidance17.60-17.90; excludes GBTG disposal gain and normalizes tax/reserve benefits.','Operating common book grows8% first5 in base, proxy for capital supporting balances, not exact CET1 bridge. Earnings minus required book growth is potential capital return. Only modeled dividends paid first5; residual held as zero-yield excess capital, added to year5 price once. Fixed claims, no extra share-count benefit. Real distributions subject to regulatory capital permission.','Years6-10 ROE fades to30% base; terminal book and EPS grow3%, payout EPS minus capital growth. RIM at year5 reconciles separately calculated distributable-capital DDM. Excess is excluded from modeled core EPS; no duplicate P/E cash earnings.','P/E is an independent research multiple, not a same-day peer quote. Core EPS5 times20 plus excess; today discounts year5 and dividends using same Ke. Terminal ROE durability is central method disagreement. No free deposit/cash add-back or corporate EV/EBITDA.']};
await fs.writeFile(new URL('axp-model-2026-11-05.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({book0,scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{rim0:x.rim0,rim5:x.rim5,pe0:x.pe0,pe5:x.pe5,irr:x.irr,peIrr:x.peIrr,eps5:x.rows[4].eps,excess:x.excess5}])),entries,sensitivity},null,2));
