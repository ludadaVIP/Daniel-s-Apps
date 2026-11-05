// Refresh only observed market data and price-dependent calculations.
// Operating facts, capital claims, valuation assumptions and scenario values remain identical.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const dir=new URL('.',import.meta.url);
const load=async n=>JSON.parse(await fs.readFile(new URL(n,dir),'utf8'));
const modelName='inod-evidence-model-2026-11-05.json';
const m=await load(modelName), prior=structuredClone(m);
const q=await load('inod-quote-moomoo-refresh-2223.json');
const y=await load('inod-quote-yahoo-refresh-2223.json');
const news=await load('inod-news-refresh-2223.json');
const sec=await load('inod-submissions-refresh-2223.html');
const mm=q.text.match(/Innodata \(INOD\)\nWatchlist\n([\d.]+)\n[^\n]+\nClose Nov 4 (\d{2}:\d{2}) ET\n([\d.]+)\n[^\n]+\nPost (\d{2}:\d{2}) ET/);
if(!mm)throw Error('After-hours and regular-close DOM pattern not found');
const price=Number(mm[3]),close=Number(mm[1]);
const utc=t=>`2026-11-04T${String(Number(t.slice(0,2))+5).padStart(2,'0')}:${t.slice(3,5)}:00Z`;
const after= y.text.match(/At close: ([^\n]+)\n([\d.]+)\n[^\n]+\n[^\n]+\nAfter hours: ([^\n]+)/);
m.market={price,timestampText:`Post Nov 4 ${mm[4]} ET`,capturedAt:q.capturedAt,status:'after-hours (post-market), observed last trade; not regular-session close',sourceId:'quote-moomoo',timestampPrecision:'minute',quoteDate:'2026-11-04',quoteTimezone:'America/New_York (EST, UTC-5)',timestampUtc:utc(mm[4]),regularClose:{price:close,timestampText:`Close Nov 4 ${mm[2]} ET`,timestampUtc:utc(mm[2]),capturedAt:q.capturedAt,sourceId:'quote-moomoo',confirmedByYahooClose:43.30},alternateProviderObservation:{sourceId:'quote-yahoo',price:after?Number(after[2]):null,timestampText:after?.[3]??null,capturedAt:y.capturedAt,note:'Yahoo after-hours observation is older and differs from Moomoo; use the newer explicit Moomoo post-market tick as the scenario-return reference. Neither is an executable bid/ask.'}};
for(const s of [...m.scenarios,m.stress]){
 for(const [o,k] of [[s.fiveYear,'price'],[s.crossCheck,'price2031']]){
  o.totalReturn=o[k]/price-1;o.cagr=(o[k]/price)**.2-1;
 }
}
const c=m.capital;
const claim=eq=>{let p=eq/(c.commonShares+c.rsuShares+c.performanceRsuShares);for(let j=0;j<20;j++){let n=c.commonShares+c.rsuShares+c.performanceRsuShares,proceeds=0;for(const o of c.options)if(p>o.strike){n+=o.shares;proceeds+=o.shares*o.strike;}p=(eq+proceeds)/n;}return p;};
const base=m.scenarios.find(s=>s.id==='base').assumptions;
const solve=(target,margin)=>{
 const value=gr=>{let prev=base.startRevenue2026,sum=0,r=0;for(let i=0;i<10;i++){r=i?prev*(1+gr):base.revenue2027;const nopat=r*margin*(1-base.tax),fcff=nopat-r*base.netCapexRatio-(r-prev)*base.nwcRatio;sum+=fcff/(1+base.wacc)**(i+1);prev=r;}const terminalNopat=r*(1+base.g)*margin*(1-base.tax),tv=terminalNopat*(1-base.g/base.terminalRoic)/(base.wacc-base.g);return claim(sum+tv/(1+base.wacc)**10+c.netNonoperatingAssets);};
 let lo=-.1,hi=.8;for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(value(mid)<target)lo=mid;else hi=mid;}
 const gr=(lo+hi)/2;return {fixed2027Revenue:base.revenue2027,constant2028to2036Growth:gr,afterCompensationEbitMargin:margin,wacc:base.wacc,terminalGrowth:base.g,terminalRoic:base.terminalRoic,result2031Revenue:base.revenue2027*(1+gr)**4,result2036Revenue:base.revenue2027*(1+gr)**9,impliedCurrentValue:value(gr)};
};
m.reverse.results=m.reverse.results.map(r=>solve(price,r.afterCompensationEbitMargin));
m.valuationRatios.ordinaryMarketCapAtLastDisclosedShares=price*c.commonShares;
m.valuationRatios.claimAdjustedMarketCap=price*(c.commonShares+c.rsuShares+c.performanceRsuShares+c.options.reduce((a,o)=>a+(price>o.strike?o.shares:0),0))-c.options.reduce((a,o)=>a+(price>o.strike?o.shares*o.strike:0),0);
m.valuationRatios.ttmPeBasicEconomic=price*c.commonShares/m.facts.ttm.netIncome;
const now=new Date().toISOString();
m.informationCutoffUtc=now;m.status='market-refreshed-awaiting-independent-audit';
m.officialRefresh={checkedAtUtc:now,secSubmissionsRetrieved:'inod-submissions-refresh-2223.html',latestSecFiling:{date:sec.filings.recent.filingDate[0],form:sec.filings.recent.form[0],accession:sec.filings.recent.accessionNumber[0]},newFilingsSincePriorReview:false,irNewsCapturedAt:news.capturedAt,latestIrNewsDate:'2026-10-15',newOfficialMaterialAnnouncementsSincePriorReview:false,q3ReleaseStillFuture:'2026-11-05 after market close; conference call17:00EST =2026-11-06 11:00NZDT',sourceIds:['sec-submissions','news-ir']};
for(const s of m.sources){if(s.id==='quote-moomoo'){s.date=q.capturedAt;s.note='Chrome DOM regular close43.30 at16:00EST and after-hours43.990 at17:22EST; raw inod-quote-moomoo-refresh-2223.json, minute precision.';}if(s.id==='quote-yahoo'){s.date=y.capturedAt;s.note='Chrome DOM regular close43.30 at16:00EST, older after-hours43.30 at17:17EST; raw inod-quote-yahoo-refresh-2223.json. Quotes can differ across last-trade timestamps.';}if(s.id==='sec-submissions')s.date=now;}
m.sources.push({id:'news-ir',title:'Official IR news list refreshed after US close',date:news.capturedAt,url:'https://investor.innodata.com/news/default.aspx',note:'Latest item remains October15 Q3-results date announcement; no new material update shown as of capture.'});
m.sources=[...new Map(m.sources.map(s=>[s.url,s])).values()];
for(const key of ['facts','capital','methodology','sensitivity','entry','portfolio','riskSensitivity'])if(JSON.stringify(m[key])!==JSON.stringify(prior[key]))throw Error('Unexpected mutation of '+key);
for(let i=0;i<m.scenarios.length;i++)for(const key of ['assumptions','rows','terminal','valuation','liquidity'])if(JSON.stringify(m.scenarios[i][key])!==JSON.stringify(prior.scenarios[i][key]))throw Error('Unexpected scenario mutation '+key);
const backup='inod-evidence-model-2026-11-05-before-postmarket-2223.json';
try{await fs.access(new URL(backup,dir));}catch{await fs.writeFile(new URL(backup,dir),JSON.stringify(prior,null,2)+'\n');}
await fs.writeFile(new URL(modelName,dir),JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({market:m.market,reverse:m.reverse.results,returns:m.scenarios.map(s=>({id:s.id,cagr:s.fiveYear.cagr,totalReturn:s.fiveYear.totalReturn})),factsSha256:crypto.createHash('sha256').update(JSON.stringify(m.facts)).digest('hex'),officialRefresh:m.officialRefresh},null,2));
