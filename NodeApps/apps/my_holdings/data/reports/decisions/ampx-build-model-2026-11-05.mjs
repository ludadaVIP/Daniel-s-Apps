import fs from 'node:fs/promises';
const openingShares=146.080618+6.5369+4.876581; // million: actual + all existing options/RSUs; no exercise proceeds credited
const configs={
 bear:{rev:[160,190,220,250,280],gm:[.23,.24,.25,.26,.27],opex:[58,65,72,78,85],cash:45,ke:.22,wacc:.19,exitSales:.8,netProject:[15,25,10,0,0],issue:2,warrants:false,fade:[.08,.06,.04,.03,.03,.03,.03,.03,.03,.03],terminalMargin:.04},
 base:{rev:[210,310,440,590,760],gm:[.30,.32,.34,.35,.35],opex:[61,75,94,118,145],cash:60,ke:.18,wacc:.14,exitSales:2.5,netProject:[10,15,0,0,0],issue:4,warrants:false,fade:[.20,.18,.16,.14,.12,.10,.08,.06,.05,.04],terminalMargin:.18},
 bull:{rev:[250,410,640,920,1250],gm:[.33,.36,.38,.39,.40],opex:[65,88,122,165,215],cash:70,ke:.16,wacc:.12,exitSales:4,netProject:[5,10,0,0,0],issue:8,warrants:true,fade:[.24,.21,.18,.15,.12,.10,.08,.06,.05,.04],terminalMargin:.25}
};
function operatingValue(c,wacc=c.wacc){let revenue=c.rev.at(-1),v=0,last;
 for(let i=0;i<10;i++){const g=c.fade[i],before=revenue;revenue*=1+g;
  // Smooth margin from the fixed 2031 operating margin, not shrinking opex divided by growing revenue.
  const fixedMargin=c.gm.at(-1)-c.opex.at(-1)/c.rev.at(-1),m=fixedMargin+(c.terminalMargin-fixedMargin)*(i+1)/10;
  const fcf=revenue*m*.79-revenue*.01-(revenue-before)*.20;v+=fcf/(1+wacc)**(i+1);last={revenue,fcf,margin:m};
 }
 const g=.03,r=last.revenue*(1+g),fcf=r*c.terminalMargin*.79-r*.01-(r-last.revenue)*.20;
 return Math.max(0,v+fcf/(wacc-g)/(1+wacc)**10);
}
function scenario(c){let cash=c.cash,shares=openingShares,wc=40,raised=0;const rows=[];
 for(let i=0;i<5;i++){const rev=c.rev[i],ebit=rev*c.gm[i]-c.opex[i],tax=Math.max(0,ebit)*.21,dwc=rev*.20-wc,fcf=ebit-tax-rev*.01-dwc-c.netProject[i];wc=rev*.20;cash+=fcf;let warrants=0;
  // Bull-only cash exercise before September 2027 expiry; neither base nor bear assumes it finances operations.
  if(i===0&&c.warrants){warrants=9.470959*11.5+1.0036*12.5;shares+=10.474559;cash+=warrants;}
  let equity=0;if(cash<20){equity=20-cash;cash=20;shares+=equity/(c.issue*.95);raised+=equity;}
  rows.push({year:2027+i,rev,gm:c.gm[i],opex:c.opex[i],ebit,tax,dwc,fcf,netProject:c.netProject[i],warrantCash:warrants,equity,shares,cash});
 }
 const ev=operatingValue(c),price5=(ev+cash)/shares,salesPrice=(c.rev.at(-1)*c.exitSales+cash)/shares;
 return {parameters:c,rows,shares,cash,raised,enterpriseDCF:ev,dcf:{price5,today:price5/(1+c.ke)**5,cagr:(price5/7.475)**.2-1},sales:{price5:salesPrice,today:salesPrice/(1+c.ke)**5,cagr:(salesPrice/7.475)**.2-1}};
}
const scenarios=Object.fromEntries(Object.entries(configs).map(([id,c])=>[id,scenario(c)])),b=scenarios.base;
const ref=Math.min(b.dcf.today,b.sales.today),returnLimit=Math.min(b.dcf.price5,b.sales.price5)/1.25**5;
const hi=[.8,.65,.5].map(k=>Math.floor(Math.min(ref*k,returnLimit)*100)/100);
const entries=hi.map((high,i)=>({tier:['observation','safety','discount'][i],high,low:i<2?Number((hi[i+1]+.01).toFixed(2)):Math.floor(hi[2]*.6*100)/100,budgetSharePct:[25,35,40][i]}));
const sensitivity=[.12,.14,.16].map(wacc=>({wacc,today:(operatingValue(configs.base,wacc)+b.cash)/b.shares/1.18**5}));
const reverse2031Revenue=(7.475*1.18**5*b.shares-b.cash)/2.5;
const model={units:'USD millions, shares millions; prices USD',openingShares,openingCashNote:'June cash 74.517; estimated Dec2026 cash 45/60/70, not reported actual. No government $75m added to opening cash.',sbc:'All existing options and RSUs added gross without proceeds. Future SBC treated as cash-equivalent economic opex; no additional share dilution for same future SBC.',grant:'Base net parent cash proxy25, bull15, bear50 over build. Approx100m total incl partner/in-kind less conditional75m grant; parent share/timing unknown. Model does not claim full grant funded.',forecastTaxes:'21% positive EBIT; no NOL benefit. Lease costs in operating expenses, lease liability not deducted again. No debt, dividends or interest income assumed.',scenarios,sensitivity,reverse2031Revenue,reference:ref,returnLimit,entries};
await fs.writeFile(new URL('ampx-model-2026-11-05.json',import.meta.url),JSON.stringify(model,null,2)+'\n');
console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{dcf:x.dcf,sales:x.sales,raised:x.raised,cash:x.cash,shares:x.shares}])),entries,sensitivity,reverse2031Revenue},null,2));
