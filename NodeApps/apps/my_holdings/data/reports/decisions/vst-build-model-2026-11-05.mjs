import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const shares=350,price=120.39;
// USD millions. Conservative transaction bridge, not a reported Nov balance sheet.
const bridge={debtJune:19595,receivables:300,affiliate:438,forwardPurchase:613,cashJune:-435,cogentrixCash:2300,cogentrixDebt:1500,juniorNotes:1500,redeemedPreferred:-1000};
const netClaims=Object.values(bridge).reduce((a,b)=>a+b,0),preferred=1476.066;
const specs={bear:{cash1:2200,growth:[0,0,.02,.02,.02,.02,.02,.02,.02],ke:.13,g:.015,ebitda1:7000,ebitdaGrowth:.015,multiple0:8,multiple5:8},base:{cash1:2930,growth:[.07,.07,.06,.05,.045,.04,.035,.03,.03],ke:.11,g:.025,ebitda1:8150,ebitdaGrowth:.045,multiple0:10,multiple5:9.5},bull:{cash1:3900,growth:[.11,.10,.09,.08,.07,.06,.05,.04,.04],ke:.095,g:.03,ebitda1:8800,ebitdaGrowth:.07,multiple0:12,multiple5:11}};
function irr(divs,exit){let lo=-.95,hi=2;for(let i=0;i<90;i++){let r=(lo+hi)/2;let pv=divs.reduce((s,d,j)=>s+d/(1+r)**(j+1),0)+exit/(1+r)**5;if(pv>price)lo=r;else hi=r;}return (lo+hi)/2;}
function calc(p){let cash=p.cash1,retained=0;const rows=[];for(let t=1;t<=10;t++){if(t>1)cash*=1+p.growth[t-2];const div=.924*1.05**t;if(t<=5)retained+=cash-div*shares;rows.push({t,year:2026+t,cash,dividend:div});}
const tv=rows[9].cash*(1+p.g)/(p.ke-p.g),op5=rows.slice(5).reduce((s,x)=>s+x.cash/(1+p.ke)**(x.t-5),0)+tv/(1+p.ke)**5;
const divs=rows.slice(0,5).map(x=>x.dividend),dcf5=(op5+retained)/shares;
const dcf0=divs.reduce((s,d,i)=>s+d/(1+p.ke)**(i+1),0)+dcf5/(1+p.ke)**5;
const ev0=(p.ebitda1*p.multiple0-netClaims-preferred)/shares,ebitda5=p.ebitda1*(1+p.ebitdaGrowth)**4,ev5=(ebitda5*p.multiple5-netClaims-preferred+retained)/shares;
assert(retained>0);return {parameters:p,rows,divs,retained,dcf0,dcf5,ev0,ev5,ebitda5,irr:irr(divs,dcf5),evIrr:irr(divs,ev5),terminalShare:tv/(1+p.ke)**10/shares/dcf0};}
const scenarios=Object.fromEntries(Object.entries(specs).map(([k,p])=>[k,calc(p)])),b=scenarios.base;
const reference=Math.min(b.dcf0,b.ev0),maxReturn=b.divs.reduce((s,d,i)=>s+d/1.15**(i+1),0)+Math.min(b.dcf5,b.ev5)/1.15**5;
const highs=[.85,.75,.65].map(x=>Math.floor(Math.min(reference*x,maxReturn)*100)/100);
const entries=[{tier:'observation',low:+(highs[1]+.01).toFixed(2),high:highs[0],budgetSharePct:25},{tier:'safety',low:+(highs[2]+.01).toFixed(2),high:highs[1],budgetSharePct:35},{tier:'discount',low:Math.ceil(reference*.5*100)/100,high:highs[2],budgetSharePct:40}];
const sensitivity=[.10,.11,.12].map(ke=>({ke,values:[.015,.025,.035].map(g=>({g,value:calc({...specs.base,ke,g}).dcf0}))}));
let lo=.1,hi=3;for(let i=0;i<90;i++){let x=(lo+hi)/2;if(calc({...specs.base,cash1:x*2930}).dcf0<price)lo=x;else hi=x;}
const out={units:'USD million; shares million; per share USD',price,shares,bridge,netClaims,preferred,scenarios,reference,maxReturn,entries,sensitivity,reverseCash1:2930*(lo+hi)/2,
cashBridge2027:{adjustedEbitda:8150,cashInterest:-1400,cashTax:-300,maintenanceAndFuel:-2150,growthCapex:-800,helix:-200,closureAndOther:-100,preferredDividend:-120,economicSbc:-150},
assumptions:['2027 forecasts, not company guidance. EBITDA 8150 = pre-Cogentrix midpoint opportunity 7600 + approximate Cogentrix 550; no separate Meta upside added. Cash bridge totals2930. Annual owner cash growth is net of future reinvestment/tax/financing, not revenue growth.','Net claims24811 is stress funding proxy built from June balances plus announced transaction terms. Assumes new borrowing funds2300 cash consideration; subsequent operating cash/debt paydowns, working capital true-ups, fees and further buybacks unknown. Actual closing balance sheet not available; avoid false precision. No700 tax-benefit cash add-back.','350m fixed claims vs June335.961+5m deal shares+buffer9.039. Future SBC economic cash cost deducted, no extra future buyback gain. Fixed debt refinanced; no free leverage benefit.','First5 forecast dividends from current0.924 annual rate grow5%; all residual cash retained zero-interest and added at year5 once. No separate June cash add-back in DCF; cash debt bridge used only EV. No future acquisitions or debt paydown earnings benefit.','EV multiples are research assumptions, not current peer measurements. EV excludes nuclear decommissioning trust assets; dedicated trust net obligations embedded in operating closure costs, regulatory failure requires rebuild. DOE loan neither cash windfall nor current debt.']};
assert.equal(Object.values(out.cashBridge2027).reduce((a,b)=>a+b,0),2930);
await fs.writeFile(new URL('vst-model-2026-11-05.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({netClaims,scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{dcf0:x.dcf0,dcf5:x.dcf5,ev0:x.ev0,ev5:x.ev5,irr:x.irr,evIrr:x.evIrr,terminalShare:x.terminalShare}])),reference,maxReturn,entries,sensitivity,reverse:out.reverseCash1},null,2));
