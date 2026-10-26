import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateResearch} from '../../apps/my_holdings/server/ai.js';
import {validateState} from '../../apps/my_holdings/server/index.js';
const dir='artifacts/my-holdings-todo-2026-10-26/';
const read=()=>JSON.parse(fs.readFileSync('apps/my_holdings/data/state.json','utf8'));
const before=JSON.parse(fs.readFileSync(dir+'before.json','utf8'));
const prices={OKLO:26.35,CBRS:110.82,AAOI:67.51,MP:38.30};
for(const symbol of Object.keys(prices)){
  const current=read();
  const target=current.watchlist.find(w=>w.symbol===symbol);
  const job=current.jobs.find(j=>j.watchId===target.id&&j.kind==='watch'&&before.jobs.some(b=>b.id===j.id));
  const report='research/my-holdings-research-'+symbol.toLowerCase()+'-2026-10-26.html';
  const research=JSON.parse(fs.readFileSync('apps/my_holdings/data/reports/'+report.replace(/\.html$/,'.json'),'utf8'));
  validateResearch(research);
  assert.equal(research.quote,undefined,'Research must not overwrite independent quote');
  assert.equal(research.identity.symbol,symbol);
  assert(fs.statSync('apps/my_holdings/data/reports/'+report).size>10000);
  if(job.status==='waiting'){
    const payload={report,research};
    fs.writeFileSync(dir+'complete-'+symbol+'.json',JSON.stringify(payload,null,2));
    const r=await fetch('http://127.0.0.1:5889/my-holdings/api/jobs/'+job.id+'/complete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok)throw Error(symbol+': '+JSON.stringify(data));
  }
  console.log(symbol+' research complete');
}
const after=read();
validateState(after);
assert.deepEqual(after.holdings,before.holdings,'Holdings, costs and quantities must be preserved');
for(const old of before.watchlist.filter(w=>!Object.keys(prices).includes(w.symbol)))assert.deepEqual(after.watchlist.find(w=>w.id===old.id),old,'Existing research must be preserved');
for(const [symbol,price]of Object.entries(prices)){
  const w=after.watchlist.find(w=>w.symbol===symbol);
  assert.equal(w.price,price);assert.equal(w.priceDate,'2026-10-23');assert.equal(w.priceType,'close');assert.equal(w.priceCurrency,'USD');
  assert(w.priceSourceUrl.startsWith('https://'));assert(w.priceFetchedAt);assert(w.researchedAt);assert(w.research.details.length>2500);assert(w.report);
}
const jobs=before.jobs.map(b=>after.jobs.find(j=>j.id===b.id));
assert.equal(jobs.length,8);
for(const j of jobs)assert.equal(j.status,'done');
assert.equal(after.jobs.filter(j=>j.status==='waiting').length,0);
const todo=fs.readFileSync('apps/my_holdings/data/CODEX_TODO.md','utf8');
assert(!todo.includes('状态：等待 Codex'));
const summary={completed:jobs.map(j=>({id:j.id,kind:j.kind,status:j.status,report:j.report})),waiting:0,holdingsPreserved:true,otherWatchlistPreserved:true,revision:after.revision,quotes:after.watchlist.filter(w=>Object.keys(prices).includes(w.symbol)).map(w=>({symbol:w.symbol,price:w.price,date:w.priceDate,type:w.priceType,report:w.report})),reportsVerifiedAt:new Date().toISOString()};
fs.writeFileSync(dir+'completion-verification.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
