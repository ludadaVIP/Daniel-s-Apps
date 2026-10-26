import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir = new URL('./',import.meta.url);
const symbols=JSON.parse(await fs.readFile(new URL('group-2.json',dir),'utf8'));
const etfs=new Set(['VTI','VT','VGT','SOXX','SMH','VOO','QQQM']);
const decode=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;|&#160;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
await fs.mkdir(new URL('group-2-evidence/',dir),{recursive:true});
const results=[];
for(let offset=0;offset<symbols.length;offset+=4){
 const batch=await Promise.allSettled(symbols.slice(offset,offset+4).map(async symbol=>{
  const sourceUrl=`https://stockanalysis.com/${etfs.has(symbol)?'etf':'stocks'}/${symbol.toLowerCase()}/history/`;
  const html=await fs.readFile(new URL(`group-2-evidence/${symbol.replace('.','-')}.html`,dir),'utf8');
  const rows=[...html.matchAll(/<tr\b[^>]*>(.*?)<\/tr>/gs)].map(m=>({raw:m[0],cells:[...m[1].matchAll(/<t[dh]\b[^>]*>(.*?)<\/t[dh]>/gs)].map(m=>decode(m[1]))}));
  const header=rows.find(r=>r.cells.includes('Date')&&r.cells.includes('Close'));
  const row=rows.find(r=>r.cells[0]==='Oct 26, 2026');
  if(!header||!row) throw new Error(symbol+': missing target row or verified Close header');
  const closeIndex=header.cells.indexOf('Close');
  const price=Number(row.cells[closeIndex].replaceAll(',',''));
  if(!Number.isFinite(price)||price<=0) throw new Error(symbol+': invalid Close');
  const title=decode(html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]||'');
  const closeStamp=decode(html.match(/At close:[\s\S]{0,110}/)?.[0]||'');
  if(!closeStamp.includes('Oct 26, 2026, 4:00 PM EDT')) throw new Error(symbol+': formal close timestamp not confirmed');
  const sourceRegion=decode(html.slice(html.indexOf('Data Source:'),html.indexOf('Data Source:')+1400));
  if(!sourceRegion.includes('S&P Global Market Intelligence')) throw new Error(symbol+': provider not confirmed: '+sourceRegion);
  if(!html.includes('USD')) throw new Error(symbol+': USD not found');
  const identity=decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]||'');
  const evidence={symbol,url:sourceUrl,title,identity,closeStamp,headers:header.cells,targetRow:row.cells,sourceRegion,sha256:createHash('sha256').update(html).digest('hex'),fetchedAt:new Date().toISOString()};
  await fs.writeFile(new URL(`group-2-evidence/${symbol.replace('.','-')}.json`,dir),JSON.stringify(evidence,null,2)+'\n');
  return {symbol,price,date:'2026-10-26',type:'close',currency:'USD',source:'StockAnalysis / S&P Global Market Intelligence',sourceUrl,status:'verified',evidence:`${title}; 历史日线表头 ${header.cells.join(' | ')}; 2026-10-26行 ${row.cells.join(' | ')}; 取Close列（第${closeIndex+1}列），未取Adj. Close或盘后价；页面明确At close: Oct 26, 2026, 4:00 PM EDT，提供商S&P Global Market Intelligence。`};
 }));
 for(let i=0;i<batch.length;i++){const result=batch[i];if(result.status==='fulfilled')results.push(result.value);else results.push({symbol:symbols[offset+i],status:'unverified',reason:result.reason.message,date:'2026-10-26',currency:'USD'});}
 console.log(JSON.stringify(results.slice(offset).map(r=>({symbol:r.symbol,price:r.price,status:r.status,reason:r.reason}))));
}
const brk=results.find(r=>r.symbol==='BRK.B');
if(brk?.status==='verified'){
 brk.evidence+=' BRK.B为NYSE Berkshire Hathaway Class B，非BRK.A；正确StockAnalysis URL含brk.b。StockScan直接历史页面明确2026-10-26 closing 548.56，交叉一致。ChartExchange行546.60但页头At Close时间为当日2:28:48PM EDT，未达到16:00收盘，故不采用。';
 brk.identityEvidenceUrl='https://chartexchange.com/symbol/nyse-brk.b/historical/';
 brk.crossCheckSourceUrl='https://stockscan.io/stocks/BRK.B/price-history';
}
await fs.writeFile(new URL('verified-group-2.json',dir),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({verified:results.filter(r=>r.status==='verified').length,total:results.length}));
