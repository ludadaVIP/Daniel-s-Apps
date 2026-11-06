import fs from 'node:fs/promises';
const configs={
 bear:{book:8800,capital:8500,ni:[600,750,900,1100,1300],rwa:[65000,75000,85000,95000,105000],target:.16,distribute:.05,issue:8,ke:.18,endROTE:.10,endGrowth:.025,tailGrowth:.05,pe:12},
 base:{book:10000,capital:9800,ni:[1250,1600,2050,2550,3150],rwa:[68000,80000,92000,104000,116000],target:.14,distribute:.20,issue:15,ke:.13,endROTE:.17,endGrowth:.035,tailGrowth:.10,pe:22},
 bull:{book:10500,capital:10300,ni:[1400,2000,2900,4100,5600],rwa:[72000,90000,110000,135000,165000],target:.13,distribute:.20,issue:25,ke:.115,endROTE:.23,endGrowth:.04,tailGrowth:.15,pe:28}
};
function remainingValue(book,roe0,c,ke){let value=book;
 for(let i=0;i<10;i++){const g=c.tailGrowth-(c.tailGrowth-c.endGrowth)*(i+1)/10,roe=roe0+(c.endROTE-roe0)*(i+1)/10,ni=book*roe*(1+g/2);value+=(ni-ke*book)/(1+ke)**(i+1);book*=1+g;}
 const nextNI=book*c.endROTE*(1+c.endGrowth/2);return Math.max(0,value+(nextNI-ke*book)/(ke-c.endGrowth)/(1+ke)**10);
}
function run(c,ke=c.ke){let book=c.book,capital=c.capital,shares=1450,parentCash=0,raised=0;const rows=[];
 for(let i=0;i<5;i++){const begin=book,required=c.rwa[i]*c.target,capacity=Math.min(c.ni[i]*c.distribute,Math.max(0,capital+c.ni[i]-required)),retained=c.ni[i]-capacity;book+=retained;capital+=retained;parentCash+=capacity;let equity=0;
  if(capital<required){equity=required-capital;capital+=equity;book+=equity;shares+=equity/(c.issue*.95);raised+=equity;}
  rows.push({year:2027+i,ni:c.ni[i],rwa:c.rwa[i],required,beginBook:begin,capacity,retained,equity,book,capital,parentCash,shares,rote:c.ni[i]/((begin+book)/2)});
 }
 const value=remainingValue(book,rows.at(-1).rote,c,ke),rp=(value+parentCash)/shares,pp=(c.ni.at(-1)*c.pe+parentCash)/shares;
 return {parameters:c,rows,book,capital,shares,parentCash,raised,operatingResidualValue:value,residual:{today:rp/(1+ke)**5,price5:rp,cagr:(rp/15.865)**.2-1},pe:{today:pp/(1+ke)**5,price5:pp,cagr:(pp/15.865)**.2-1}};
}
const scenarios=Object.fromEntries(Object.entries(configs).map(([id,c])=>[id,run(c)])),b=scenarios.base,reference=Math.min(b.residual.today,b.pe.today),returnLimit=Math.min(b.residual.price5,b.pe.price5)/1.18**5,hi=[.85,.70,.55].map(k=>Math.floor(Math.min(reference*k,returnLimit)*100)/100);
const entries=hi.map((high,i)=>({tier:['observation','safety','discount'][i],low:i<2?+(hi[i+1]+.01).toFixed(2):Math.floor(high*.6*100)/100,high,budgetSharePct:[25,35,40][i]}));
const sensitivity=[.115,.13,.145].map(ke=>({ke,today:run(configs.base,ke).residual.today}));
const reversePE=(15.865*1.13**5*b.shares-b.parentCash)/configs.base.ni.at(-1);
const m={units:'USD million, shares million',scenarios,reference,returnLimit,entries,sensitivity,reversePE,bookPolicy:'Sept2026 equity11295.137,TCEabout9700 actual. Projected2027 openingTCE8800/10000/10500,CET1capital8500/9800/10300 assumptions afterQ4profit/loanFV/OCI; not reported actual. Future recurring acquisitions intangible amortization excluded from economicearnings but employeecompensation kept.',sharesPolicy:'Sept actual1296.617m. June options13.374m+RSU45.471m+PSU4.518m (June awards may later vest). Use1450m conservative future fullydilutedproxy, includesawards,ESPP,2029 spread and future countuncertainty; not pointactual. No exercise/cappedcall proceeds or buybacks. Future SBC treated as expense inNI, no same-award extra dilution.',bankPolicy:'Wholegroup equity afterliabilities. Loans/deposits/corporate debt not subtracted/added likeEV. 2026notes428m afterSepbalance expected cashprincipal settlement, no equity principal haircut twice. 2029note862.5m expected principal cash from assets/liabilities; potential excess shares in1450proxy, no debt forgiveness/hedge value credited. Fundingcost and tax inNI. Parentdistributablecapacity20%NI only if modeledCET1target14%RWA met; targets assumptions not statutoryminimum. Deficit raisesnetequity with5%friction. Cash retainedparent withoutinterest, not actual dividend promise.',methods:'Residual income onTCE after5yrs with10yrROTE/growth fade, no separategoodwill/software value; PE independent growthcomparison. Both add parentcapacitycash once and discount5yrs. Does not mix depositprincipal with marketEV.'};
await fs.writeFile(new URL('sofi-model-2026-11-06.json',import.meta.url),JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{residual:x.residual,pe:x.pe,raised:x.raised,shares:x.shares,book:x.book,cash:x.parentCash,rote5:x.rows.at(-1).rote}])),entries,sensitivity,reversePE},null,2));
