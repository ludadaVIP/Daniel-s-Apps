import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const [mode,arg,name]=process.argv.slice(2);
const proxy=async(route,body)=>{const r=await fetch('http://localhost:3456/'+route,body===undefined?{}:{method:'POST',body});return r.json()};
if(mode==='capture'){
 const r=await proxy('eval?target='+arg,'({title:document.title,url:location.href,text:document.body.innerText,links:Array.from(document.querySelectorAll("a")).map(a=>({text:a.innerText,url:a.href}))})');
 await fs.writeFile(path.join(dir,'inod-'+name+'.json'),JSON.stringify({capturedAt:new Date().toISOString(),...r.value},null,2));
 console.log(JSON.stringify({name,keys:Object.keys(r),length:r.value?.text?.length,head:r.value?.text?.slice(0,600)}));
}else if(mode==='eval')console.log(JSON.stringify(await proxy('eval?target='+arg,name)));
else if(mode==='new')console.log(JSON.stringify(await proxy('new',arg)));
else if(mode==='close')console.log(JSON.stringify(await proxy('close?target='+arg)));
else if(mode==='text'){
 const r=await fetch(arg,{headers:{'User-Agent':'DanielResearch contact investor@innodata.com'}});const txt=await r.text();
 await fs.writeFile(path.join(dir,'inod-'+name+'.html'),txt);console.log(JSON.stringify({status:r.status,len:txt.length,name}));
}
