import fs from 'node:fs/promises';
const actualShares=340.354193+23.493796,existingAwards=13.509243+23.920384+.013970+.123204+1.065594,shares0=actualShares+existingAwards;
const noteShares=38.488890,strike=460/noteShares,cap=18.04;
const configs={
 bear:{rev:[480,520,560,600,640],gm:[.53,.53,.54,.54,.55],opex:[350,365,380,395,410],capex:[.23,.22,.21,.20,.19],cash:730,ke:.20,wacc:.16,exitSales:1.5,price2030:4,issue:4,fade:[.06,.05,.04,.03,.03,.03,.03,.03,.03,.03],endMargin:.06},
 base:{rev:[550,670,810,970,1150],gm:[.57,.58,.60,.61,.62],opex:[350,375,410,450,495],capex:[.22,.19,.17,.15,.14],cash:780,ke:.16,wacc:.12,exitSales:4,price2030:12,issue:8,fade:[.16,.14,.12,.10,.08,.07,.06,.05,.04,.04],endMargin:.23},
 bull:{rev:[610,820,1090,1430,1840],gm:[.60,.63,.65,.67,.68],opex:[360,410,475,555,650],capex:[.22,.19,.17,.15,.14],cash:820,ke:.14,wacc:.10,exitSales:6,price2030:25,issue:15,fade:[.20,.18,.16,.14,.12,.10,.08,.06,.05,.04],endMargin:.31}
};
function futureEV(c,wacc=c.wacc){let rev=c.rev.at(-1),v=0,margin0=c.gm.at(-1)-c.opex.at(-1)/rev;
 for(let i=0;i<10;i++){let old=rev;rev*=1+c.fade[i];let margin=margin0+(c.endMargin-margin0)*(i+1)/10,fcf=rev*margin*.79-rev*.06+(rev-old)*.15;v+=fcf/(1+wacc)**(i+1);}
 const next=rev*1.03,fcf=next*c.endMargin*.79-next*.06+(next-rev)*.15;
 return Math.max(0,v+fcf/(wacc-.03)/(1+wacc)**10);
}
function run(c,settle='cash'){let cash=c.cash,wc=-200,shares=shares0,raised=0;const rows=[];
 for(let i=0;i<5;i++){const rev=c.rev[i],ebit=rev*c.gm[i]-c.opex[i],tax=Math.max(0,ebit)*.21,newWC=-.15*rev,dwc=newWC-wc,fcf=ebit-tax+rev*.08-rev*c.capex[i]-dwc;wc=newWC;cash+=fcf;let debtPayment=0,netNewShares=0,hedge=0;
  cash-=i<3?2.3:i===3?1.82:0; // 0.50% coupon; approximate Jan-Oct 2030
  if(i===3){const s=c.price2030;hedge=noteShares*Math.min(Math.max(s-strike,0),cap-strike);
   if(settle==='shares'&&s>strike){netNewShares=noteShares-hedge/s;shares+=netNewShares;}
   else {debtPayment=460+noteShares*Math.max(s-strike,0)-hedge;cash-=debtPayment;}
  }
  let equity=0;if(cash<100){equity=100-cash;cash=100;shares+=equity/(c.issue*.95);raised+=equity;}
  rows.push({year:2027+i,rev,ebit,tax,capex:rev*c.capex[i],depreciation:rev*.08,dwc,fcf,debtPayment,hedge,netNewShares,equity,shares,cash});
 }
 const ev=futureEV(c),dcfPrice=(ev+cash)/shares,salesPrice=(c.rev.at(-1)*c.exitSales+cash)/shares;
 return {parameters:c,settlement:settle,rows,cash,shares,raised,enterpriseDCF:ev,dcf:{price5:dcfPrice,today:dcfPrice/(1+c.ke)**5,cagr:(dcfPrice/11.578)**.2-1},sales:{price5:salesPrice,today:salesPrice/(1+c.ke)**5,cagr:(salesPrice/11.578)**.2-1}};
}
const scenarios=Object.fromEntries(Object.entries(configs).map(([k,c])=>[k,run(c)])),b=scenarios.base,shareSettlement=run(configs.base,'shares');
const reference=Math.min(b.dcf.today,b.sales.today),returnLimit=Math.min(b.dcf.price5,b.sales.price5)/1.22**5,hi=[.85,.70,.55].map(k=>Math.floor(Math.min(reference*k,returnLimit)*100)/100);
const entries=hi.map((high,i)=>({tier:['observation','safety','discount'][i],low:i<2?+(hi[i+1]+.01).toFixed(2):Math.floor(high*.6*100)/100,high,budgetSharePct:[25,35,40][i]}));
const sensitivity=[.10,.12,.14].map(wacc=>({wacc,today:(futureEV(configs.base,wacc)+b.cash)/b.shares/1.16**5}));
const reverseRevenue=(11.578*1.16**5*b.shares-b.cash)/4;
const m={units:'USD million, shares million',actualShares,existingAwards,shares0,noteShares,strike,cap,openingCashNote:'865.418 July cash+shortterm excludes restricted8.498. Estimated Jan2027 opening cash730/780/820, not actual, no unissued ATM proceeds. Opening operatingWC -200 proxy captures customer advances; normalizing to -15% revenue consumes advance benefit.',sbc:'Existing awards added gross without exercise cash. Future SBC retained as cash-equivalent operating cost; no same-award future dilution double charge.',cashFlow:'GAAP EBIT including lease/SBC, positive EBIT taxed21%, D&A8% revenue. Capex includes satellite/software replenishment, normalizes14% beyond2031. No dividends or cash interest income. Debt retired in2030 with capped-call net settlement; prepayment capital counted through WC, not all free cash.',scenarios,shareSettlement,sensitivity,reverseRevenue,reference,returnLimit,entries};
await fs.writeFile(new URL('pl-model-2026-11-06.json',import.meta.url),JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{dcf:x.dcf,sales:x.sales,raised:x.raised,cash:x.cash,shares:x.shares,notePayment:x.rows[3].debtPayment}])),shareSettlement:{dcf:shareSettlement.dcf,sales:shareSettlement.sales},sensitivity,reverseRevenue,entries},null,2));
