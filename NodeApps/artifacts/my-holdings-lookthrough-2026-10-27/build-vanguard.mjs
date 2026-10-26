import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const directory=new URL('./',import.meta.url);
const retrievedAt=new Date().toISOString();
const round=value=>Number(value.toFixed(8));
const funds=[];
for(const {symbol,id,slug} of [
 {symbol:'VOO',id:'0968',slug:'vanguard-sp-500-etf'},
 {symbol:'VGT',id:'0958',slug:'vanguard-information-technology-etf'}
]) {
 const raw=await fs.readFile(new URL(`vanguard-evidence/${symbol.toLowerCase()}-official-latest.json`,directory),'utf8');
 const sourceData=JSON.parse(raw);
 const asOf=sourceData.latestEffectiveDate;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error('Unverified holdings date');
 const book=sourceData[asOf];
 const holdings=[];
 for(const group of ['equity','fixedIncome','shortTermReserves','derivatives']){
  if(!Array.isArray(book[group]))throw new Error(`Missing complete ${group} array`);
  for(const item of book[group]){
   const rawSymbol=item.ticker||'';
   const name=item.holdingName||item.description;
   const isCvr=/\bCVR\b/.test(name);
   const assetType=group==='equity'?(isCvr?'contingent_value_right':'equity'):group==='fixedIncome'?'fixed_income':group==='derivatives'?'derivative':rawSymbol==='USD'?'cash':'short_term_reserve';
   const weightPct=typeof item.percentOfFunds==='number'?item.percentOfFunds:null;
   if(weightPct!==null&&!Number.isFinite(weightPct))throw new Error('Nonfinite official weight');
   if(weightPct===null&&!isCvr)throw new Error('Missing weight outside disclosed CVR');
   holdings.push({
    symbol:rawSymbol.replaceAll('/','.'),
    name,weightPct,assetType,currency:'USD',
    sourceGroup:group,
    ...(rawSymbol.includes('/')?{sourceSymbol:rawSymbol}:{}),
    ...(item.cusip?{cusip:item.cusip}:{}),
    ...(item.sedol?{sedol:item.sedol}:{}),
    ...(item.country?{country:item.country}:{}),
    ...(item.sector?{sector:item.sector}:{}),
    ...(typeof item.marketValue==='number'?{marketValueUSD:item.marketValue}:{}),
    ...(typeof item.quantity==='number'?{quantity:item.quantity}:{}),
    ...(item.numberOfContracts!==undefined?{numberOfContracts:item.numberOfContracts}:{}),
    ...(weightPct===null?{weightStatus:'issuer_blank',note:'Official percentOfFunds is blank; retained as null rather than assigning zero or deriving a weight from an unverified denominator.'}:{weightStatus:'issuer_reported'})
   });
  }
 }
 const count=type=>holdings.filter(h=>h.assetType===type).length;
 const sum=type=>round(holdings.filter(h=>!type||h.assetType===type).reduce((s,h)=>s+(h.weightPct??0),0));
 const equityKeys=holdings.filter(h=>h.assetType==='equity').map(h=>h.symbol);
 if(new Set(equityKeys).size!==equityKeys.length)throw new Error('Duplicate ordinary equity ticker');
 const total=sum();
 if(Math.abs(total-100)>.01)throw new Error('Official book does not reconcile near 100%');
 const sourceUrl=`https://advisors.vanguard.com/investments/products/api/funds/${id}/holdings/latest`;
 funds.push({
  symbol,asOf,retrievedAt,currency:'USD',
  source:'Vanguard official holdings API (issuer, primary)',sourceUrl,
  sourceType:'primary',
  fundPageUrl:`https://advisors.vanguard.com/investments/products/${symbol.toLowerCase()}/${slug}`,
  weightBasis:'Official percentOfFunds field, expressed in percentage points (8.38984 means 8.38984%, not 0.0838984%). Preserved without normalization; market prices are not used.',
  holdings,
  coverage:{
   completeReportedBook:true,
   reportedEquityGroupCount:book.equity.length,
   equityCount:count('equity'),equityWeightPct:sum('equity'),
   contingentValueRightCount:count('contingent_value_right'),
   cashCount:count('cash'),cashWeightPct:sum('cash'),
   shortTermReserveCount:count('short_term_reserve'),shortTermReserveWeightPct:sum('short_term_reserve'),
   fixedIncomeCount:count('fixed_income'),fixedIncomeWeightPct:sum('fixed_income'),
   derivativeCount:count('derivative'),derivativeReportedWeightPct:sum('derivative'),
   totalCount:holdings.length,totalKnownWeightPct:total,
   missingWeightCount:holdings.filter(h=>h.weightPct===null).length,
   residualTo100Pct:round(100-total),
   top10OrdinaryEquityWeightPct:round(holdings.filter(h=>h.assetType==='equity').sort((a,b)=>b.weightPct-a.weightPct).slice(0,10).reduce((s,h)=>s+h.weightPct,0))
  },
  evidence:{
   rawFile:`vanguard-evidence/${symbol.toLowerCase()}-official-latest.json`,
   rawSha256:createHash('sha256').update(raw).digest('hex'),
   pageFile:`vanguard-evidence/${symbol.toLowerCase()}-advisors.html`,
   latestDateField:sourceData.latestEffectiveDate,
   dailyEndpointCheck:{url:`https://advisors.vanguard.com/investments/products/api/funds/${id}/holdings/daily`,status:404,checkedAt:retrievedAt}
  },
  notes:[
   'Latest complete issuer holdings response retrieved on 2026-10-27 Pacific/Auckland has latestEffectiveDate 2026-09-30. Retrieval date is not the holdings date. The public daily endpoint returned 404 for this passive ETF.',
   'Use assetType=equity for ordinary-stock look-through. Cash, short-term reserves, derivatives and contingent-value rights are retained separately and must not be presented as ordinary-stock ownership.',
   'Selected exactly one non-duplicated issuer view: equity + fixedIncome + shortTermReserves + derivatives. shortTermReservesMoneyMarket and allocationToUnderlyingFunds repeat holdings and are not added again.',
   'Some issuer equity names omit share class, so distinct tickers and CUSIPs are preserved. BRK/B and BF/B are normalized to BRK.B and BF.B with original sourceSymbol retained.',
   'Percentages are the issuer-reported portfolio proportions across the underlying share-class portfolio, not individual ETF-share market values. ETF market capitalization or prices are never used to derive security weights.',
   'Derivative percentOfFunds and marketValue are preserved as reported; notionalValue is blank in this response. No unsupported conversion to delta-adjusted underlying exposure is performed.',
   ...(symbol==='VOO'?[
    'The ordinary-equity weights sum slightly above 100%, offset by net negative USD cash and other reported categories. Do not renormalize to 100%, because that would change disclosed exposures.',
    'Two CVR positions have blank official weights and are retained with weightPct=null. The 503 ordinary-stock rows all have official numeric weights; this does not truncate the stock universe.'
   ]:[])
  ]
 });
}
await fs.writeFile(new URL('vanguard.json',directory),JSON.stringify({funds},null,2)+'\n');
console.log(JSON.stringify(funds.map(f=>({symbol:f.symbol,asOf:f.asOf,coverage:f.coverage})),null,2));
