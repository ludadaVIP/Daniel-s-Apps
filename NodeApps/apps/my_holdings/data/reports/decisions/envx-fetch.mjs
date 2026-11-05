import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const api='http://localhost:3456';
const act=async(action,body)=>{let r=await fetch(api+action,body===undefined?{}:{method:'POST',body});return r.json()};
let [mode,arg,out]=process.argv.slice(2);
if(mode==='new')console.log(JSON.stringify(await act('/new',arg)));
if(mode==='get'){
let r=await act('/eval?target='+arg,'JSON.stringify({url:location.href,title:document.title,text:document.body.innerText,links:[...document.querySelectorAll("a[href]")].map(a=>({text:a.innerText,url:a.href}))})');
let v=typeof r.value==='string'?JSON.parse(r.value):r;
if(out)fs.writeFileSync(path.join(dir,out),JSON.stringify(v,null,2));
console.log(JSON.stringify(v).slice(0,Number(process.env.ENVX_PRINT||1000)));
}
if(mode==='eval')console.log(JSON.stringify(await act('/eval?target='+arg,out)));
if(mode==='quarterlies')console.log(JSON.stringify(await act('/eval?target='+arg,'document.getElementById("edit-field-nir-sec-form-group-target-id").value="496";document.getElementById("edit-submit-widget-sec-filings").click();')));
if(mode==='close')console.log(JSON.stringify(await act('/close?target='+arg)));
