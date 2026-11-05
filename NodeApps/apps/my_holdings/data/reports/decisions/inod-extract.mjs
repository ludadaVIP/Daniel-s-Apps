import fs from 'node:fs/promises';
const d=new URL('.',import.meta.url), cf=JSON.parse(await fs.readFile(new URL('inod-companyfacts.html',d),'utf8'));
const g=cf.facts['us-gaap'];
const tags=['RevenueFromContractWithCustomerExcludingAssessedTax','Revenues','GrossProfit','CostOfRevenue','CostOfServices','OperatingIncomeLoss','IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest','InterestIncomeExpenseNet','InterestIncomeExpenseNonoperatingNet','InvestmentIncomeInterest','InterestExpense','IncomeTaxExpenseBenefit','NetIncomeLoss','NetCashProvidedByUsedInOperatingActivities','PaymentsToAcquirePropertyPlantAndEquipment','ShareBasedCompensation','DepreciationDepletionAndAmortization','CashAndCashEquivalentsAtCarryingValue','StockholdersEquity','CommonStockSharesOutstanding','WeightedAverageNumberOfDilutedSharesOutstanding','WeightedAverageNumberOfSharesOutstandingBasic'];
const sel=(tag,start,end)=>{const us=g[tag]?.units||{};let a=Object.values(us).flat().filter(x=>x.end===end&&(!start||x.start===start)&&['10-K','10-Q'].includes(x.form)&&x.filed<='2026-11-04');a.sort((x,y)=>y.filed.localeCompare(x.filed));return a[0]||null};
const hist=[];for(let y=2021;y<=2025;y++){const r={year:y};for(const t of tags)r[t]=sel(t,`${y}-01-01`,`${y}-12-31`);hist.push(r)};
const latest={};for(const t of tags)latest[t]=sel(t,'2026-01-01','2026-06-30');
await fs.writeFile(new URL('inod-financial-extraction.json',d),JSON.stringify({history:hist,h1:latest},null,2));
console.log(JSON.stringify({history:hist.map(h=>Object.fromEntries(Object.entries(h).map(([k,v])=>[k,v?.val??v]))),h1:Object.fromEntries(Object.entries(latest).map(([k,v])=>[k,v?.val??null]))},null,2));
