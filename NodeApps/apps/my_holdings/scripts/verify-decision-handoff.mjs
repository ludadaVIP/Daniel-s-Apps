import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validateDecisionReport} from '../src/decision-reports.js';
const data=new URL('../data/',import.meta.url),raw=await fs.readFile(new URL('state.json',data),'utf8'),state=JSON.parse(raw),goal=JSON.parse(await fs.readFile(new URL('DECISION_GOAL.json',data),'utf8'));
const checkpoint=JSON.parse(await fs.readFile(new URL('DECISION_HANDOFF_STATE.json',data),'utf8'));
const sha=createHash('sha256').update(raw).digest('hex');
if(process.argv.includes('--strict-checkpoint')&&sha!==checkpoint.stateSha256)throw Error('State differs from migration checkpoint; inspect the newer data instead of overwriting it.');
let done=0;const waiting=[];
for(const target of goal.targets){
 const watch=state.watchlist.find(w=>w.id===target.watchId);if(!watch)throw Error('Missing target '+target.symbol);
 if(watch.decisionReport){
  const report=JSON.parse(await fs.readFile(new URL('reports/'+watch.decisionReport.json,data),'utf8'));validateDecisionReport(report,watch);
  const html=await fs.readFile(new URL('reports/'+watch.decisionReport.report,data),'utf8');
  if(!html.includes('<!doctype html>')||!html.includes('七种投资思想'))throw Error('Incomplete independent report '+target.symbol);
  done++;
 }else{const job=state.jobs.find(j=>j.watchId===watch.id&&j.kind==='decision-report'&&j.status==='waiting');if(!job)throw Error('Missing waiting report job '+target.symbol);waiting.push({symbol:target.symbol,jobId:job.id});}
}
if(done<checkpoint.completedCount)throw Error('Completed reports missing after transfer');
console.log(JSON.stringify({readOnly:true,stateRevision:state.revision,stateSha256:sha,checkpointMatches:sha===checkpoint.stateSha256,completed:done,total:goal.targets.length,waiting:waiting.length,next:waiting[0]||null},null,2));
