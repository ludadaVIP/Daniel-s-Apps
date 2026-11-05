import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(dir,'aehr-evidence-model-2026-11-05.json');
const d=JSON.parse(fs.readFileSync(file,'utf8'));
const raw=JSON.parse(fs.readFileSync(path.join(dir,'aehr-quote-dom-2026-11-05.json'),'utf8').replace(/^\uFEFF/,''));
const sec=JSON.parse(fs.readFileSync(path.join(dir,'aehr-sec-latest-verification-2026-11-05.json'),'utf8').replace(/^\uFEFF/,''));
const ir=JSON.parse(fs.readFileSync(path.join(dir,'aehr-ir-latest-verification-2026-11-05.json'),'utf8').replace(/^\uFEFF/,''));
const m=raw.text.match(/Aehr Test Systems \(AEHR\)\nWatchlist\n([\d.]+)\n[^\n]+\n(Trading Nov 4 (\d\d):(\d\d) ET)/);
if(!m)throw new Error('Current trading quote DOM pattern not matched');
const p=Number(m[1]);
const etHour=Number(m[3]);
const stamp=`2026-11-04T${String(etHour+5).padStart(2,'0')}:${m[4]}:00Z`;
d.quote={...d.quote,price:p,session:'regular-session intraday',timestamp:stamp,providerLabel:m[2],observedAtUtc:raw.at,limitation:'Actual Chrome DOM headline quote, provider labels Real-Time/Trading; may be delayed, not guaranteed executable. Formal prior close remains Nov3 65.11. Intraday quote replaces obsolete pre-market reference.'};
d.shared.quotePrice=p;
for(const s of Object.values(d.scenarios)){
  s.totalReturn=s.value2031/p-1;s.cagr=(s.value2031/p)**.2-1;
  const n=s.normalizedProfitMultiple;n.totalReturn=n.value2031/p-1;n.cagr=(n.value2031/p)**.2-1;
}
const b=d.shared.bridge;
function priceOf(a){
  let prev=d.shared.openingRevenueRunRateM;
  const cf=a.revenueM.map((rev,i)=>{const f=rev*a.ebitMargins[i]*(1-a.tax)-Math.max(0,rev-prev)/a.salesToIncrementalCapital;prev=rev;return f;});
  const tv=a.revenueM.at(-1)*a.ebitMargins.at(-1)*(1-a.tax)*(1+a.g)*(1-a.g/a.terminalRoic)/(a.wacc-a.g);
  const ev=cf.reduce((s,c,i)=>s+c/(1+a.wacc)**(i+1),0)+tv/(1+a.wacc)**10;
  return(ev+b.netNonOperatingAssetsM)/b.sharesM;
}
let low=0,high=1;
for(let i=0;i<100;i++){
  const g=(low+high)/2;
  const a={...d.scenarioAssumptions.base,revenueM:d.scenarioAssumptions.base.revenueM.map((_,i)=>150*(1+g)**i)};
  if(priceOf(a)<p)low=g;else high=g;
}
const g=(low+high)/2,rev=d.scenarioAssumptions.base.revenueM.map((_,i)=>150*(1+g)**i);
d.reverse={...d.reverse,implied2027To2036Cagr:g,impliedRevenuePathM:rev,implied2027RevenueM:rev[0],implied2031RevenueM:rev[4],implied2036RevenueM:rev[9],implied2031EbitM:rev[4]*.24,implied2031NopatM:rev[4]*.24*.75,marketEconomicEvM:p*b.sharesM-b.netNonOperatingAssetsM,guideForwardEconomicEvToSales:(p*b.sharesM-b.netNonOperatingAssetsM)/150};
d.facts.latestReporting.secDomVerifiedAtUtc=sec.at;
d.facts.latestReporting.q1Fy27TenQFound=sec.tenq.some(x=>/2026.*September|September.*2026|2026-09-25/i.test(x.text));
if(d.facts.latestReporting.q1Fy27TenQFound)throw new Error('New Q1 10Q requires review before finalizing refresh');
d.facts.latestNewsCheck={verifiedAtUtc:ir.at,url:ir.url,latestCompanyReleaseDate:'2026-11-02',noNewNovember4CompanyAnnouncementFound:true,description:'Actual official company news-page DOM remains Nov2 Q1 results, with Oct29 boardappointment next. SEC latestnoninsiderfiling remains Nov2 earnings8K. No newmaterialfilingannouncement identified duringrefresh.'};
d.audit.quoteRefreshedAtUtc=raw.at;
d.audit.status='quote_refreshed_pending_independent_reaudit';
d.generatedAtUtc=raw.at;
fs.writeFileSync(file,JSON.stringify(d,null,2));
console.log(JSON.stringify({quote:d.quote,secVerifiedAt:sec.at,newsVerifiedAt:ir.at,reverse:d.reverse,scenarios:Object.fromEntries(Object.entries(d.scenarios).map(([k,s])=>[k,{today:s.todayValue,future:s.value2031,cagr:s.cagr,normalCagr:s.normalizedProfitMultiple.cagr}]))},null,2));
