import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const api='http://127.0.0.1:5889/my-holdings/api';
const state=async()=>{const r=await fetch(api+'/state');assert.equal(r.status,200);return r.json();};
const before=await state();const watch=before.watchlist.find(w=>w.symbol==='MSFT');
assert.equal(watch.decisionReport,undefined);
const job=before.jobs.find(j=>j.kind==='decision-report'&&j.watchId===watch.id&&j.status==='waiting');assert.ok(job);
const portfolio=JSON.parse(execFileSync(process.execPath,['apps/my_holdings/scripts/decision-portfolio-context.mjs','MSFT'],{encoding:'utf8'}));
const input='apps/my_holdings/data/reports/decisions/msft-analysis-input-2026-11-06.json';
const report=JSON.parse(await fs.readFile(input,'utf8'));
assert.equal(report.position.existingExposureUsd,portfolio.company.value);
assert.equal(report.position.pendingBuyUsd,portfolio.pendingKnownLimitBuyUsd);
let response;
try {response=execFileSync(process.execPath,['apps/my_holdings/scripts/save-decision-report.mjs',input],{encoding:'utf8'});}catch(e){response='Response error; disk/API checked before any retry: '+e.message;}
const after=await state();
assert.equal(after.jobs.find(j=>j.id===job.id).status,'done');
const updated=after.watchlist.find(w=>w.id===watch.id);assert.ok(updated.decisionReport);
const strip=s=>{const x=structuredClone(s);for(const k of ['revision','updatedAt','watchlist','jobs','analyses'])delete x[k];return x;};
assert.deepEqual(strip(after),strip(before));
const wa=structuredClone(after.watchlist);delete wa.find(w=>w.id===watch.id).decisionReport;
assert.deepEqual(wa,before.watchlist);
assert.deepEqual(after.jobs.filter(j=>j.id!==job.id),before.jobs.filter(j=>j.id!==job.id));
assert.deepEqual(after.analyses.slice(1),before.analyses);
const base='apps/my_holdings/data/reports/';
const saved=JSON.parse(await fs.readFile(base+updated.decisionReport.json,'utf8'));assert.deepEqual(saved,report);
const html=await fs.readFile(base+updated.decisionReport.report,'utf8');assert.ok(html.includes('（Asia/Shanghai）'));
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const evidence={savedAt:new Date().toISOString(),jobId:job.id,reference:updated.decisionReport,beforeRevision:before.revision,afterRevision:after.revision,
 userDataUnchanged:true,protectedDataHashBefore:sha(strip(before)),protectedDataHashAfter:sha(strip(after)),
 watchManualDataPreserved:true,otherJobsPreserved:true,previousAnalysesPreserved:true,jsonMatchesInput:true,htmlTimezone:'Asia/Shanghai',response};
await fs.writeFile('apps/my_holdings/data/reports/decisions/msft-save-audit-2026-11-06.json',JSON.stringify(evidence,null,2)+'\n');
await fetch('http://127.0.0.1:5889/my-holdings/library/api/documents?refresh=1');
const url='http://127.0.0.1:5889/my-holdings/library/document/'+Buffer.from(updated.decisionReport.report).toString('base64url');
assert.equal((await fetch(url)).status,200);
console.log(JSON.stringify({url,saved:true,reference:updated.decisionReport,userDataUnchanged:true}));
