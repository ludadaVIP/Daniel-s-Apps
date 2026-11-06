import fs from 'node:fs/promises';
// USD millions, shares millions. Point-in-time awards; no weighted-average EPS dilution used.
const initialShares=394.058648+14.989686+5.726040+5.504194+18.198656+1; // 1m reserve for acquisition RSUs, estimate not disclosed count
const notes=[{principal:212.310,strike:16.81,coupon:.0325,due:2030},{principal:233.389,strike:13.64,coupon:.035,due:2029},{principal:1000,strike:85.63,coupon:0,due:2031},{principal:1150,strike:51.40,coupon:.0025,due:2032},{principal:1150,strike:51.40,coupon:.01,due:2033},{principal:3000,strike:73.07,coupon:.01,due:2033}];
const configs={
 bear:{rev:[3000,3700,4300,4700,5000],margin:.43,capex:[11500,7500,6500,5500,4500],newDebt:[2500,1500,1000,500,500],repay:[1500,1800,2000,2500,2500],prepay:[0,-500,-500,-500,-500],issue:6,priceDue:8,wacc:.16,ke:.22,maint:.36,depr:.35,exitEBIT:10,fade:[.05,.04,.03,.03,.03,.03,.03,.03,.03,.03],endMargin:.44,rate:.105},
 base:{rev:[4500,6200,8000,10000,12000],margin:.55,capex:[10000,6500,6000,5500,5000],newDebt:[4000,3000,3000,2000,2000],repay:[1500,1800,2000,2500,2500],prepay:[600,300,0,-300,-300],issue:15,priceDue:25,wacc:.12,ke:.18,maint:.28,depr:.32,exitEBIT:12,fade:[.14,.12,.10,.08,.07,.06,.05,.04,.04,.03],endMargin:.57,rate:.085},
 bull:{rev:[6000,9000,12500,16000,20000],margin:.62,capex:[10500,8500,8000,7500,7000],newDebt:[4500,4000,3500,3000,2500],repay:[1500,1800,2000,2500,2500],prepay:[1000,700,300,0,-300],issue:30,priceDue:90,wacc:.10,ke:.16,maint:.24,depr:.29,exitEBIT:14,fade:[.18,.16,.14,.12,.10,.08,.06,.05,.04,.03],endMargin:.63,rate:.075}
};
function operatingEV(c,wacc=c.wacc,maint=c.maint){let rev=c.rev.at(-1),v=0;
 for(let i=0;i<10;i++){const before=rev;rev*=1+c.fade[i];const margin=c.margin+(c.endMargin-c.margin)*(i+1)/10,tax=Math.max(0,margin-c.depr)*rev*.25,fcf=rev*margin-tax-rev*maint-(rev-before)*1.2;v+=fcf/(1+wacc)**(i+1);}
 const next=rev*1.03,tax=Math.max(0,c.endMargin-c.depr)*next*.25,fcf=next*c.endMargin-tax-next*maint-(next-rev)*1.2;
 return Math.max(0,v+fcf/(wacc-.03)/(1+wacc)**10);
}
function run(c){let cash=5895.591+1670.252+5107+2000+400-300-300-7000-1825.392,bank=938+5107+243.796+21.950,ns=structuredClone(notes),shares=initialShares,raised=0;const rows=[];
 // H2 stub: restricted capex release and committed draw once; 2000 future prepayments are a conditional assumption.
 for(let i=0;i<5;i++){const year=2027+i,rev=c.rev[i],ebitda=rev*c.margin,ebit=ebitda-rev*c.depr,tax=Math.max(0,ebit)*.25;
  const interest=ns.reduce((a,n)=>a+n.principal*n.coupon,0)+(bank+.5*(c.newDebt[i]-c.repay[i]))*c.rate;
  cash+=ebitda-tax-interest-c.capex[i]+c.prepay[i]+c.newDebt[i]-c.repay[i];bank+=c.newDebt[i]-c.repay[i];let notePaid=0,noteConverted=0;
  ns=ns.filter(n=>{const earlyBull=year===2031&&c.priceDue===90&&150>=1.3*n.strike;if(n.due!==year&&!earlyBull)return true;if(c.priceDue>n.strike||earlyBull){const added=n.principal/n.strike;shares+=added;noteConverted+=added;}else{cash-=n.principal;notePaid+=n.principal;}return false;});
  let rightsCash=0,rightsShares=0;if(year===2030&&c.priceDue>70){rightsCash=2100;rightsShares=30;cash+=rightsCash;shares+=rightsShares;} // bull assumes full vesting and exercise before May2031
  let equity=0;if(cash<1000){equity=1000-cash;cash=1000;shares+=equity/(c.issue*.95);raised+=equity;}
  rows.push({year,rev,ebitda,ebit,tax,interest,capex:c.capex[i],prepayChange:c.prepay[i],newDebt:c.newDebt[i],repay:c.repay[i],notePaid,noteConverted,rightsCash,rightsShares,equity,bank,noteDebt:ns.reduce((a,n)=>a+n.principal,0),cash,shares});
 }
 const debt=bank+ns.reduce((a,n)=>a+n.principal,0),ev=operatingEV(c),exitEV=rows.at(-1).ebit*c.exitEBIT;
 const price=enterprise=>Math.max(0,(enterprise+cash-debt)/shares),dcf=price(ev),multiple=price(exitEV);
 return {parameters:c,stubCash:5647.451,rows,cash,debt,shares,raised,enterpriseDCF:ev,dcf:{price5:dcf,today:dcf/1.0/(1+c.ke)**5,cagr:(dcf/18.79)**.2-1},multiple:{price5:multiple,today:multiple/(1+c.ke)**5,cagr:(multiple/18.79)**.2-1}};
}
const scenarios=Object.fromEntries(Object.entries(configs).map(([id,c])=>[id,run(c)])),b=scenarios.base;
const reference=Math.min(b.dcf.today,b.multiple.today),returnLimit=Math.min(b.dcf.price5,b.multiple.price5)/1.25**5,hi=[.80,.65,.50].map(k=>Math.floor(Math.min(k*reference,returnLimit)*100)/100);
const entries=hi.map((high,i)=>({tier:['observation','safety','discount'][i],low:i<2?+(hi[i+1]+.01).toFixed(2):Math.floor(high*.6*100)/100,high,budgetSharePct:[25,35,40][i]}));
const sensitivity=[.23,.28,.33].map(maint=>({maint,today:Math.max(0,(operatingEV(configs.base,.12,maint)+b.cash-b.debt)/b.shares)/1.18**5}));
const reverseEBIT=(18.79*1.18**5*b.shares-b.cash+b.debt)/12;
const model={units:'USD million, shares million',initialShares,notes,scenarios,reference,returnLimit,entries,sensitivity,reverseEBIT,notesPolicy:'Only notes maturing through2031 convert if scenario maturity stock assumption exceeds strike. Otherwise cash repay. Base/bear later high-strike notes remain debt; bull assumes150USD2031stock satisfies conditional early-conversion trigger, converts remaining notes gross without capped-call benefit. Stress alternative needed if early conversion; not a promise of refinancing.',equityPolicy:'Existing service/performanceRSUs, options and July coCEO18.199m granted awards fully added; Aug actual count includes Mirantis12.6m, not added twice. Future SBC economically in margin as cash equivalent. No extra credit for options proceeds. Nvidia30m@$70 expiringMay2031 excluded in base/bear; bull assumes all vested and cash exercised in2030, adds30m shares and2100m cash.',capitalPolicy:'H2 existing capex commitment13.810bn split7bn stub andatleast6.810bn2027 capex. AP1.825bn paid additionally. Release restricted1.670bn only to capex, leave53.684mrestricted excluded. CommittedGPU draw3.645bn+2.4bn less938mdrawn=5.107bn; additional400m headline financing is not treated as unconditionally incremental added once, debt added once. Future debt/new prepayments not guaranteed. Existing prepayments not double added. New prepayments need ongoing service/decline modeled through2027-31 cashchanges.',valuationPolicy:'Economic EBITDA after future SBC, EBIT after hardware depreciation; GPU/data-center maintenance capex and expansion reinvestment explicitly inDCF. Positive EBIT25%cash tax, noNOL benefit. Lease finance inbankdebt, operatinglease costs inmargin; no distributions.'};

await fs.writeFile(new URL('iren-model-2026-11-06.json',import.meta.url),JSON.stringify(model,null,2)+'\n');
console.log(JSON.stringify({scenarios:Object.fromEntries(Object.entries(scenarios).map(([k,x])=>[k,{dcf:x.dcf,multiple:x.multiple,raised:x.raised,debt:x.debt,shares:x.shares,cash:x.cash}])),entries,sensitivity,reverseEBIT},null,2));
