import {createServer} from 'vite';
import {writeFile} from 'node:fs/promises';
const server=await createServer({root:process.cwd(),logLevel:'error',appType:'custom',server:{middlewareMode:true,watch:null}});
try {
 const {lessons,unitChecks}=await server.ssrLoadModule('/src/content.ts');
 const {maintenanceSets,recurrenceEvidence}=await server.ssrLoadModule('/src/content/maintenance.ts');
 const source=lessons.filter(l=>l.unit==='J74'),evidence=recurrenceEvidence.filter(e=>e.sourceLesson.startsWith('J74-'));
 const all=[...lessons.flatMap(l=>[l.guided,...l.questions,l.exit]),...Object.values(unitChecks).flatMap(s=>s.questions),...Object.values(maintenanceSets).flatMap(s=>s.questions)];
 const targets=[...new Set(evidence.flatMap(e=>e.targets))].map(id=>all.find(q=>q.id===id));
 await writeFile('../../../.j74-source-audit.json',JSON.stringify({source,evidence,targets},null,2));
 console.log(JSON.stringify({source:source.length,tasks:source.reduce((n,l)=>n+l.questions.length+2,0),evidence:evidence.length,refs:evidence.reduce((n,e)=>n+e.targets.length,0),targets:targets.length,groups:Object.keys(maintenanceSets).length,taskTotal:Object.values(maintenanceSets).reduce((n,s)=>n+s.questions.length,0),owners:new Set(Object.values(maintenanceSets).map(s=>s.unit)).size,ownerGroups:Object.values(maintenanceSets).filter(s=>['J74','J75','J74'].includes(s.unit)).map(s=>({id:s.id,questions:s.questions.length}))}));
}finally {await server.close()}
