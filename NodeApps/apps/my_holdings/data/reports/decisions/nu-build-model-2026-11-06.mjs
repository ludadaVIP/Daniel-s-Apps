import fs from 'node:fs/promises';
const shares=4830.688659+19.204820+67.836231; // million; current actual + all existing awards gross, no exercise cash
const configs={
 bear:{book:13000,roe:[.15,.14,.14,.15,.15],retention:[.95,.95,.90,.85,.80],ke:.20,endROE:.13,endGrowth:.03,tailGrowth:.06,pe:8},
 base:{book:14800,roe:[.30,.29,.28,.27,.26],retention:[.8,.8,.75,.70,.65],ke:.15,endROE:.19,endGrowth:.04,tailGrowth:.14,pe:16},
 bull:{book:16000,roe:[.34,.34,.33,.32,.31],retention:[.8,.8,.75,.70,.65],ke:.13,endROE:.24,endGrowth:.05,tailGrowth:.18,pe:21}
};
function residualValue(book,c,ke=c.ke){let value=book;
 for(let i=0;i<10;i++){const g=c.tailGrowth-(c.tailGrowth-c.endGrowth)*(i+1)/10,roe=c.roe.at(-1)+(c.endROE-c.roe.at(-1))*(i+1)/10,ni=roe*book*(1+g/2),ri=ni-ke*book;value+=ri/(1+ke)**(i+1);book*=1+g;}
 const ni=c.endROE*book*(1+c.endGrowth/2),ri=ni-ke*book;
 return Math.max(0,value+ri/(ke-c.endGrowth)/(1+ke)**10);
}
function run(c,ke=c.ke){let book=c.book,parentCash=0;const rows=[];
 for(let i=0;i<5;i++){const begin=book,ni=begin*c.roe[i]/(1-c.roe[i]*c.retention[i]/2),retained=ni*c.retention[i],capacity=ni-retained;book+=retained;parentCash+=capacity;rows.push({year:2027+i,beginBook:begin,roe:c.roe[i],ni,retained,capacity,endBook:book,parentCash});}
 const operatingValue=residualValue(book,c,ke),rp=(operatingValue+parentCash)/shares,pp=(rows.at(-1).ni*c.pe+parentCash)/shares;
 return {parameters:c,rows,book,parentCash,operatingResidualValue:operatingValue,residual:{price5:rp,today:rp/(1+ke)**5,cagr:(rp/11.64)**.2-1},pe:{price5:pp,today:pp/(1+ke)**5,cagr:(pp/11.64)**.2-1}};
}
const scenarios=Object.fromEntries(Object.entries(configs).map(([id,c])=>[id,run(c)])),b=scenarios.base,reference=Math.min(b.residual.today,b.pe.today),returnLimit=Math.min(b.residual.price5,b.pe.price5)/1.18**5,hi=[.85,.70,.55].map(k=>Math.floor(Math.min(reference*k,returnLimit)*100)/100);
const entries=hi.map((high,i)=>({tier:['observation','safety','discount'][i],low:i<2?+(hi[i+1]+.01).toFixed(2):Math.floor(high*.6*100)/100,high,budgetSharePct:[25,35,40][i]}));
const sensitivity=[.13,.15,.17].map(ke=>({ke,today:run(configs.base,ke).residual.today}));
const reversePE=(11.64*1.15**5*shares-b.parentCash)/b.rows.at(-1).ni;
const m={units:'USD million, sharesmillion',shares,scenarios,reference,returnLimit,entries,sensitivity,reversePE,bookPolicy:'June2026 parent equity13249.670 actual; projected2026Dec starting book13000/14800/16000 is estimate after earnings, credit, FX and repurchases, not a reported current balance. No bank cash/deposits/loanassets added/subtracted separately.',sharesPolicy:'June actual4830.689m +existingSOP19.205m+RSU67.836m gross. No exerciseproceeds and no further buyback. Future employee compensation remains in modeled aftertaxROE; no same-award dilution double count.',capitalPolicy:'ROE on average capital, NI=beginBook*ROE/(1-retention*ROE/2). Retain65-95%income for growth, rest potential distribution accumulated as noninterest parent cash, no actualdividend promise. Needs localcapital transfer permission; regulatory capital and book are different. Tail bookgrowth14% fading4% with base ROE26%fading19%; capital retention implied by growth/earnings.',methods:'2031 remaining bank equity valued as book plus discountedfuture residualincome NI-Ke*beginBook over10yrs and terminal. Independent PE uses2031 aftertaxNI. Both add retained parent cash once, discount5yrs. All forecastsUSD, credit/tax/funding/SBC alreadyinROE, no local33%ROE extrapolation guarantee.'};
await fs.writeFile(new URL('nu-model-2026-11-06.json',import.meta.url),JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{residual:x.residual,pe:x.pe,book:x.book,cash:x.parentCash,net5:x.rows.at(-1).ni}])),entries,sensitivity,reversePE},null,2));
