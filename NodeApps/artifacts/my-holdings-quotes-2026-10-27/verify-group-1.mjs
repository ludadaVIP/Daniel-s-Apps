import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const symbols=JSON.parse(await fs.readFile(path.join(dir,'group-1.json'),'utf8'));
await fs.mkdir(path.join(dir,'evidence-group-1'),{recursive:true});
const strip=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const results=[];
for(let i=0;i<symbols.length;i+=3){
 const batch=await Promise.all(symbols.slice(i,i+3).map(async symbol=>{
  const sourceUrl=`https://stockanalysis.com/stocks/${symbol.toLowerCase()}/history/`;
  try{
   const response=await fetch(sourceUrl,{signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw Error(`HTTP ${response.status}`);
   const html=await response.text();
   await fs.writeFile(path.join(dir,'evidence-group-1',symbol+'.html'),html);
   const rows=[...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>[...m[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>strip(c[1])));
   const head=rows.find(r=>r[0]==='Date');
   if(!head||head[4]!=='Close'||head[5]!=='Adj. Close')throw Error('Historical header does not match Date/Open/High/Low/Close/Adj. Close');
   const row=rows.find(r=>r[0]==='Oct 26, 2026');
   if(!row)throw Error('No 2026-10-26 daily row');
   const provider=strip(html).match(/Data Source:\s*([^]*?)Last updated:/)?.[1]?.trim();
   if(!provider?.includes('S&P Global Market Intelligence'))throw Error('History provider not confirmed');
   const plain=strip(html);
   const title=strip(html.match(/<title>(.*?)<\/title>/s)?.[1]||'');
   if(!title.includes(`(${symbol})`))throw Error('Ticker identity mismatch');
   if(!plain.includes('USD'))throw Error('USD not verified');
   const price=Number(row[4].replaceAll(',',''));
   const high=Number(row[2].replaceAll(',','')),low=Number(row[3].replaceAll(',',''));
   if(!(price>0&&price>=low&&price<=high))throw Error('Invalid OHLC close');
   return {symbol,price,date:'2026-10-26',type:'close',currency:'USD',source:'StockAnalysis / S&P Global Market Intelligence (daily Close)',sourceUrl,evidence:`Read Daily historical table: headers ${head.join(' | ')}; row ${row.join(' | ')}. Selected Close column, not Adj. Close or after-hours. Page states USD; Data Source: ${provider}.`,status:'verified',verifiedAt:new Date().toISOString()};
  }catch(error){return{symbol,date:'2026-10-26',currency:'USD',status:'unverified',reason:String(error.message),sourceUrl}};
 }));
 results.push(...batch);
 console.log(batch.map(r=>({symbol:r.symbol,price:r.price,status:r.status,reason:r.reason})));
}
await fs.writeFile(path.join(dir,'verified-group-1.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({verified:results.filter(r=>r.status==='verified').length,total:results.length}));
