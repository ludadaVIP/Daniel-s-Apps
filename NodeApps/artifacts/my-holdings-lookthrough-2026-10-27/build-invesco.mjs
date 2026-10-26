import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const raw=JSON.parse(fs.readFileSync(path.join(dir,'qqqm-invesco-holdings-raw.json'),'utf8'));
const decode=s=>s?.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
const assetType=row=>({COM:'equity',ADR:'equity',DRNY:'equity',MMT:'money_market_fund',IFUT:'derivative',CURRCOL:'cash_collateral',CURR:row.ticker==='USDPDV'?'dividend_receivable':'cash',UCURR:'uninvestible_cash',SYN:'synthetic_cash_offset'}[row.securityTypeCode]||'other');
const holdings=raw.holdings.map(h=>({symbol:h.ticker??h.cusip??null,sourceTicker:h.ticker,symbolType:h.ticker?'ticker':h.cusip?'source_security_identifier':'none',name:decode(h.issuerName),weightPct:h.percentageOfTotalNetAssets,assetType:assetType(h),currency:h.currency,securityTypeName:h.securityTypeName,securityTypeCode:h.securityTypeCode,securityIdentifier:h.cusip,marketValueUSD:h.marketValueBase,units:h.units,...(h.contractExpiryDate?{contractExpiryDate:h.contractExpiryDate}:{})}));
const known=holdings.filter(h=>Number.isFinite(h.weightPct));
const equity=holdings.filter(h=>h.assetType==='equity');
const round=v=>Math.round(v*1e9)/1e9;
const coverage={completePublishedList:true,reportedHoldingCount:raw.totalNumberOfHoldings,parsedHoldingCount:holdings.length,knownWeightRows:known.length,unknownWeightRows:holdings.length-known.length,equityHoldingCount:equity.length,equityWeightPct:round(equity.reduce((a,h)=>a+h.weightPct,0)),knownWeightSumPct:round(known.reduce((a,h)=>a+h.weightPct,0)),normalised:false,assetTypeTotals:holdings.reduce((a,h)=>{const t=a[h.assetType]??={count:0,knownWeightPct:0,unknownWeightRows:0};t.count++;if(Number.isFinite(h.weightPct))t.knownWeightPct=round(t.knownWeightPct+h.weightPct);else t.unknownWeightRows++;return a},{})};
const fund={symbol:'QQQM',name:'Invesco NASDAQ 100 ETF',isin:'US46138G6492',cusip:raw.cusip,currency:'USD',asOf:raw.effectiveBusinessDate,effectiveDate:raw.effectiveDate,retrievedAt:new Date().toISOString(),source:'Invesco official complete fund holdings API',sourceType:'primary',sourceUrl:'https://dng-api.invesco.com/cache/v1/accounts/en_US/shareclasses/46138G649/holdings/fund?idType=cusip&productType=ETF',productPageUrl:'https://www.invesco.com/us/en/financial-products/etfs/invesco-nasdaq-100-etf.html',holdings,coverage,notes:[
 'Official product HTML exposes this API endpoint in its Complete Holdings component (CUSIP 46138G649, locale en_US, idType cusip). Original HTML and raw API response are archived alongside this JSON.',
 'asOf uses the official effectiveBusinessDate 2026-10-23. effectiveDate is 2026-10-24; do not mislabel Saturday or retrieval day as a holdings trading date. This is the latest complete response returned by the un-dated official endpoint when retrieved.',
 'weightPct is copied exactly from percentageOfTotalNetAssets (% TNA), in percentage points (8.09727 means 8.09727%, not a fraction). No weights were inferred, rounded before storage, or normalised to 100%.',
 'All 108 published rows are retained. Common stock and ADR rows are equity; AGPXX is a money market fund, not a corporate equity. Futures, collateral, cash, lending balances and the negative synthetic cash offset retain their separate asset types.',
 'USD Pending Dividends has an official null percentageOfTotalNetAssets. Its weightPct remains null, not zero; market value is supplied only as official supporting evidence. Known weights net to 100.000001% from published precision; this does not establish an assigned weight for the null receivable row.',
 'Rows lacking official tickers use their official security identifier as symbol with symbolType=source_security_identifier. They must not be merged into corporate equity. Alphabet GOOG and GOOGL remain separate source share classes; issuer aggregation is a later explicit operation.',
 'All reported currency values are USD, verified on every raw holding. Direct equity look-through covers 99.8657% of NAV at the published business date; do not reweight equities to 100% or treat the balance as extra stock exposure.'
 ]};
if(raw.cusip!=='46138G649'||holdings.length!==raw.totalNumberOfHoldings||!holdings.every(h=>h.currency==='USD')||equity.some(h=>!(h.weightPct>=0)))throw Error('Invesco validation failed');
fs.writeFileSync(path.join(dir,'invesco.json'),JSON.stringify({funds:[fund]},null,2)+'\n');
console.log(JSON.stringify({symbol:fund.symbol,asOf:fund.asOf,effectiveDate:fund.effectiveDate,coverage},null,2));
