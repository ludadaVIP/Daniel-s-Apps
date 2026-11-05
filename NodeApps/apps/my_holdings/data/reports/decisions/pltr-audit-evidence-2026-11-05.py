"""Independent numerical audit, then explicitly identified model refinements."""
import json, math
from pathlib import Path
from datetime import datetime, timezone
root=Path(__file__).parent
p=root/'pltr-evidence-model-2026-11-05.json'
d=json.loads(p.read_text(encoding='utf-8'))
def run(a, quote, shares=2.59, salescapital=None, constant_growth=None, tax_path=None):
    rev=8.532; rows=[]; cash0=10.561531-.8532-.117119
    sc=a['salesToCapital'] if salescapital is None else salescapital
    for n in range(1,11):
        prior=rev; growth=a['growth'][n-1] if constant_growth is None else constant_growth
        rev*=1+growth; tax=([.15,.15,.20,.20]+[.23]*6 if tax_path is None else tax_path)[n-1]
        ebit=rev*a['ebitMargin'][n-1]; nopat=ebit*(1-tax)
        reinv=0 if math.isinf(sc) else (rev-prior)/sc
        rows.append(dict(t=n,year=2026+n,revenueB=rev,growth=growth,ebitMargin=a['ebitMargin'][n-1],ebitB=ebit,tax=tax,nopatB=nopat,reinvestmentB=reinv,fcffB=nopat-reinv))
    w=a['wacc']; g=a['terminalGrowth']
    tv=rev*(1+g)*a['ebitMargin'][-1]*.77*(1-g/a['terminalROIC'])/(w-g)
    pv=sum(r['fcffB']/(1+w)**r['t'] for r in rows); tvpv=tv/(1+w)**10
    ev5=sum(r['fcffB']/(1+w)**(r['t']-5) for r in rows[5:])+tv/(1+w)**5
    cash5=cash0+sum(r['fcffB'] for r in rows[:5]); price5=(ev5+cash5)/shares
    mult5=(rows[4]['nopatB']*a['pe2031']+cash5)/shares
    return dict(assumptions=a.copy(),rows=rows,enterpriseValueB=pv+tvpv,netCashBridgeB=cash0,sharesB=shares,todayDCF=(pv+tvpv+cash0)/shares,terminalValuePVShare=tvpv/(pv+tvpv),operatingEV2031B=ev5,netCash2031B=cash5,price2031DCF=price5,cagrFromQuoteDCF=(price5/quote)**.2-1,totalReturnFromQuoteDCF=price5/quote-1,price2031NormalizedProfitMultiple=mult5,cagrFromQuoteMultiple=(mult5/quote)**.2-1,crossValueTodayAt15pct=mult5/1.15**5,entryReturn15=price5/1.15**5)
# Check independently that the initial JS arithmetic was internally correct.
checks=[]
for key,a in d['model']['scenarioAssumptions'].items():
    v=run(a,d['quote']['price']); old=d['model']['scenarios'][key]
    for metric in ['todayDCF','price2031DCF','price2031NormalizedProfitMultiple','entryReturn15']:
        assert abs(v[metric]-old[metric])<1e-10,(key,metric)
    checks.append(key+': independent Python matches original JS within1e-10')
# Refine opaque reinvestment conservatism, not a response to the market price.
for key,sc in [('bear',4),('base',6),('bull',10)]:
    d['model']['scenarioAssumptions'][key]['salesToCapital']=sc
d['quote'].update(price=170.26,timestamp='2026-11-04T11:23:00Z',providerLabel='Pre06:23ET',observedAtUtc='2026-11-04T11:25:18Z',freshnessAtObservationMinutes=2.30,limitation='Actual browser DOM; most recent observed public pre-market print06:23ET, Nov4 inferred following Nov3 formal close. May be delayed, not guaranteed execution. Snapshot is fresh at observation; final parent report should refresh if >20min old.')
quote=d['quote']['price']; d['model']['scenarios']={k:run(a,quote) for k,a in d['model']['scenarioAssumptions'].items()}
base=d['model']['scenarioAssumptions']['base']; b=d['model']['scenarios']['base']
d['model']['entry'].update(status='audited',firstMax=math.floor(min(b['entryReturn15'],b['todayDCF']*.8)),secondMax=math.floor(min(b['price2031DCF']/1.18**5,b['todayDCF']*.65)),thirdMax=math.floor(min(b['price2031DCF']/1.2**5,b['todayDCF']*.5)))
e=d['model']['entry']; e['nonOverlappingBands']=[{'name':'小仓观察','low':e['secondMax']+1,'high':e['firstMax']},{'name':'安全边际','low':e['thirdMax']+1,'high':e['secondMax']},{'name':'深度折价','low':.01,'high':e['thirdMax']}]
e['method']='First min(2031DCF/1.15^5,DCFtoday×80%); second min(2031DCF/1.18^5,DCFtoday×65%); third min(2031DCF/1.20^5,DCFtoday×50%). All ceilings floored; bands on whole-dollar planning grid.'
d['model']['reinvestmentAudit']={'definition':'Δrevenue / sales-to-capital is incremental NET operating capital (netCapEx + ΔoperatingNWC); excludes already-expensed R&D, S&M/FDE, salaries and SBC. No separate R&D capitalization or acquisition assumed.','ratios':{'bear':4,'base':6,'bull':10},'empiricalBridgeM':{'accountsReceivableUse':843.438,'prepaidAndOtherAssetsUse':162.110,'accountsPayableAccruedSource':204.240,'contractLiabilitiesSource':396.996,'netObservedOperatingCapitalUseExOtherLiabilities':404.312,'netCapexLessDA':29.969-22.031,'prior9MRevenue':3068.644,'current9MRevenue':5881.458,'incrementalRevenue':2812.814,'ratioOfIncrementalRevenue':(404.312+29.969-22.031)/2812.814},'caution':'9M cash changes are not same-period annual capital requirements; NWC includes invoicing timing/seasonality, not a permanent causal ratio. Main S/C6 is a conservative prospective economic assumption.','sensitivity':[{'salesToCapital':sc if math.isfinite(sc) else 'infinite: no extra net investment','todayDCF':run(base,quote,salescapital=sc)['todayDCF'],'price2031DCF':run(base,quote,salescapital=sc)['price2031DCF']} for sc in [3,6,10,math.inf]]}
d['model']['waccGrowthSensitivity']=[{'wacc':w,'terminalGrowth':g,'todayDCF':run({**base,'wacc':w,'terminalGrowth':g},quote)['todayDCF']} for w in [.09,.105,.12] for g in [.025,.035,.045]]
d['model']['terminalROICSensitivity']=[{'terminalROIC':r,'todayDCF':run({**base,'terminalROIC':r},quote)['todayDCF']} for r in [.30,.60,1.0]]
d['model']['shareClaimSensitivity']=[{'sharesB':s,'todayDCF':run(base,quote,shares=s)['todayDCF'],'price2031DCF':run(base,quote,shares=s)['price2031DCF']} for s in [2.409497474,2.573926,2.59,2.7]]
d['model']['taxSensitivity']={'normal23pctFromYear1':run(base,quote,tax_path=[.23]*10)['todayDCF'],'first2Years0ThenNormal23':run(base,quote,tax_path=[0,0]+[.23]*8)['todayDCF']}
# Reverse-DCF: hold base margins, taxes, S/C6, WACC10.5%,g3.5%,ROIC30%; solve one constant10y growth variable.
def solve(target):
    lo=-.05; hi=1.0
    for _ in range(100):
        mid=(lo+hi)/2
        if run(base,quote,constant_growth=mid)['todayDCF']<target: lo=mid
        else: hi=mid
    g=(lo+hi)/2; v=run(base,quote,constant_growth=g)
    return {'targetTodayPrice':target,'constant10yRevenueCAGR':g,'implied2031RevenueB':v['rows'][4]['revenueB'],'implied2036RevenueB':v['rows'][9]['revenueB'],'fixed':'Base margin/tax path;S/C6;WACC10.5%;g3.5%;terminalROIC30%;2.59b claims. One possible solution, not unique market forecast.'}
d['model']['reverseDCF']=solve(quote)
d['model']['reverseDCFFor15pctAnnualReturn']={**solve(quote*1.15**5),'warning':'Mechanical scaled current-value hurdle only; not the main five-year return calculation. Use explicit2031DCF targets for actionable return.'}
d['model']['reverseDCFFor15pctAnnualReturn'].update(status='not_used_for_action_remove_to_avoid_time_mixing')
# Replace with a genuine five-year target solve using same operating model.
lo=-.05;hi=1
for _ in range(100):
    mid=(lo+hi)/2
    if run(base,quote,constant_growth=mid)['price2031DCF']<quote*1.15**5:lo=mid
    else:hi=mid
v=run(base,quote,constant_growth=(lo+hi)/2)
d['model']['reverseDCFFor15pctAnnualReturn']={'required2031Price':quote*1.15**5,'constant10yRevenueCAGR':(lo+hi)/2,'implied2031RevenueB':v['rows'][4]['revenueB'],'implied2036RevenueB':v['rows'][9]['revenueB'],'fixed':'Base margins/taxes/S-C6/WACC10.5/g3.5/ROIC30, solve 2031 price rather than current value. Holds2031 proceeds including retained5y FCFF.'}
d['facts']['annual']=[{'year':2021,'revenueM':1541.889,'grossProfitM':1202.485,'ebitM':-411.046,'netIncomeCommonM':-520.379,'cfoM':333.851,'capexM':12.627,'sbcM':778.215,'interestIncomeM':1.607,'basicWeightedSharesM':1923.617,'dilutedWeightedSharesM':1923.617},{'year':2022,'revenueM':1905.871,'grossProfitM':1497.322,'ebitM':-161.201,'netIncomeCommonM':-373.705,'cfoM':223.737,'capexM':40.027,'sbcM':564.798,'interestIncomeM':20.309,'basicWeightedSharesM':2063.793,'dilutedWeightedSharesM':2063.793,'cashPlusMarketableM':2633.675}]+[a for a in d['facts']['annual'] if a['year']>=2023]
for a in d['facts']['annual']:
    a.update(reportedFcfM=a['cfoM']-a['capexM'],grossMargin=a['grossProfitM']/a['revenueM'],ebitMargin=a['ebitM']/a['revenueM'],sbcPctRevenue=a['sbcM']/a['revenueM'])
d['facts']['annual'][2]['cashPlusMarketableM']=3674.179
d['facts']['latestReporting'].update(latestActual='Q3 and9M ended2026-09-30; earnings November2,10-Q filed November3,2026',Q3TenQAvailableInIR=True)
d['facts']['Q3'].update(governmentRevenueM=1145.540,commercialRevenueM=1167.871,usRevenueM=1937.189,restOfWorldRevenueM=376.222,receivablesCustomerIConcentration=.27,revenueCustomerOver10pct=False,rpoB=4.9,rpoJune2026B=4.9,rpoNext12MonthsPct=.44,rpoNext13To36MonthsPct=.37,billingsM=2454.396,priorBillingsM=1225.548,usCommercialCustomerCount=686)
d['facts']['Q3']['billingsGrowth']=2454.396/1225.548-1
d['facts']['Q3']['ndrPreviousQuarter']=1.57
d['facts']['Q32025ContractBase']={'tcvM':2760,'tcvGrowth':1.51,'usCommercialTcvM':1310,'usCommercialTcvGrowth':3.42,'usCommercialRdvM':3630,'usCommercialRdvGrowth':1.99,'largeDealsAbove1m':204,'above5m':91,'above10m':53,'caution':'Prior large base; contract durations and ACV not numerically disclosed in these obtained releases. TCV+6% not evidence by itself of demand slowdown. NDR165%, billings+100%, revenue+96% supply contrary evidence; RPOflat4.9b is monitor.'}
d['facts']['sharesAndGovernance'].update(october26BasicSharesB=2.409497474,september30BasicSharesB=2.409153,september30OptionsM=146.841,september30OptionsStrike=10.16,september30RsusM=35.503,september30PrsusM=.140,september30SarsM=18.511,september30SarsStrike=134.77,unrecognizedOptionsCompensationM=343,unrecognizedSarsCompensationM=252,unrecognizedRsusCompensationM=1400,modelBasis='Oct26 exact basic2.409497474b + Sept30 award inventory:146.841m options at10.16 treasury method+35.643m RSU/P-RSU+SAR economic shares approximation, at quote≈2.587b; rounded2.59b. Not a claim that Q3 weighted2573.926m equals current outstanding.')
d['facts']['capitalCommitments']={'cloudHostingContractMinimumB':5.6,'agreementAmended':'2026-03','through':'2036-02-29','annualMinimumM':[268,979],'creditFacilityUndrawnM':500,'debtDrawnM':0,'repurchaseNineMonths2026M':1.5,'note':'Hosting commitment is operating cost already in margin assumptions; no extra full5.6b debt deduction. Revenue stress can make annual minimum costly.'}
d['facts']['customerConcentration']={'top20TTMAvgRevenueM':146,'priorTTMAvgRevenueM':83,'top20ApproxTTMRevenueM':2920,'top20ApproxPctTTM':2920/d['facts']['TTM']['revenueM'],'noCustomerAbove10pctRevenue':True,'customerIShareOfReceivables':.27,'note':'Top20 average is rounded, so total share approximate; revenue diversification does not remove27%AR collection concentration.'}
d['facts']['taxQuality']={'noUSUKValuationAllowanceReleaseAsOfSept30':True,'actualNineMonthEffectiveRate':41.142/3117.947,'normalModelRate':.23,'note':'Do not invent one-time tax release in Q3: full allowance remains. Future release could boost GAAP net income without equivalent recurring cash generation; long-term23% matches adjusted EPS reconciliation.'}
d['accounting']['sbc']+=' Current unvested award dilution and future expense amortization can overlap under this conservative approximate framework; do not claim exact elimination of every legacy overlap. Basic vs2.59b claims sensitivity bounds effect≈7.5%; no full extra future dilution applied to same modeled SBC.'
d['accounting']['reinvestment']='Incremental NET operating capital only, Δrevenue/S-C4/6/10; R&D/FDE/SBC already fully expensed. Main base6 versus initial3 correction reflects historical9M NWC bridge; see sensitivity.'
d['accounting']['contracts']+=' Q2 andQ3 reported RPO both4.9b rounded, not the misread4.45b from PDF extraction. Short-termRPO44%≈2.156b, not totalRDV6.517b. No numeric ACV/duration obtained; leave unquantified.'
d['sources'] += [{'id':'Q3_10Q','title':'Q3 2026 Form10-Q, exact latest shares and notes','published':'2026-11-03','period':'2026-09-30 and shares2026-10-26','url':'https://www.sec.gov/Archives/edgar/data/1321655/000132165526000048/pltr-20260930.htm','irPdfUrl':'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001321655/46450a50-7a35-4819-affd-42cdb01d3299.pdf','localFile':'pltr-q3-10q-source-2026-11-05.txt','retrieval':'Actual Chrome SEC DOM, original text.'},{'id':'FY23','title':'2023 Form10-K official IR linked archive','published':'2024-02-20','period':'FY2021–23','url':'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001321655/301c4e7c-bc97-4414-ad8b-3c84568750eb.pdf','localFile':'pltr-fy23-source-2026-11-05.pdf'},{'id':'Q325','title':'Q3 2025 earnings release, prior contract base','published':'2025-11-03','period':'Q3 ended2025-09-30','url':'https://investors.palantir.com/news-details/2025/Palantir-Reports-Q3-2025-U-S--Comm-Revenue-Growth-of-121-YY-and-Revenue-Growth-of-63-YY-Guides-Q4-Revenue-to-61-YY-and-U-S--Comm-Revenue-to-121-YY-Raises-FY-2025-Revenue-Guidance-to-53-YY-Crushing-Consensus-Expectations/','localFile':'pltr-q325-source-2026-11-05.txt'}]
d['audit']={'status':'passed_with_explicit_model_limitations','auditedAtUtc':datetime.now(timezone.utc).isoformat(),'independentComputation':checks,'criticalCorrections':['ObtainedNov3 latest10-Q; replaced staleQ2 share/award evidence.','RPOwas4.9b inbothJune/September; PDFtextnumberorder was unsafe.','S-C3→6 base refinement for netcapital; ratios3/6/10/infinite shown.','Latestquote169.68 at06:20ET, observed11:21:37UTC.'],'checks':['TTM=FY25+9M26−9M25, not annualizedQ3; CFO andCapEx sameperiod.','Q3reportedCFO−CapEx1196.556m differs adjustedFCF1216.077m by19.521m payrolltaxaddback.','10year terminalFCFF grows with g and reinvestment g/ROIC.','2031continuationEV excludes cash generatedfirst5years; retainedFCFF addedonce.','EBITexcludesinterest/investmentgains; cashbridgeaddedonce.','No futureSBCaddback or separate buybackyield.','NominalUSDpre-tax/fee/FX investor returns; corporate tax normalized.','No userstate/positions/orders mutated.'],'limitations':['10forwardperiod fiscal approximation, not exactdatedstub DCF.','Unvestedlegacy awardexpense/dilution conservative overlap; not an exactoptionpricing valuation.','Terminal30%ROIC conservative forassetlightfirm, sensitivity30/60/100 provided.','Normalizedoperatingprofitmultiple is assumed valuation standard, not a fabricatedobservedpeer P/E.','No numeric ACV/duration inobtained releases; contractmix may explain TCVpath.','No independently evidenced probabilityweights; scenariovaluations not forecasts.']}
d['sources']=list({s['id']:s for s in d['sources']}.values())
d['audit']['criticalCorrections'][-1]='Latestquote170.26 at06:23ET, observed11:25:18UTC.'
if 'currentMultiples' in d:
    qcap=quote*d['facts']['sharesAndGovernance']['october26BasicSharesB']; t=d['facts']['TTM']; cm=d['currentMultiples']
    cm.update(marketCapUsingExactBasicSharesB=qcap,economicClaimValueUsingModelSharesB=quote*2.59,simpleEVB=qcap-10.561531,evToTtmSales=(qcap-10.561531)/(t['revenueM']/1000),evToFY2026GuidanceSales=(qcap-10.561531)/8.532,priceToTtmCommonEarnings=qcap/(t['netIncomeCommonM']/1000),priceToReportedTtmCfoMinusCapex=qcap/(t['reportedFcfM']/1000))
if 'capitalStress' in d['model']:
    loss=1-d['model']['scenarios']['bear']['price2031DCF']/quote
    d['model']['capitalStress']['equityStress']=f'At quote{quote} bear2031DCF30.19 implies{loss:.2%}capitaldecline; theoretical100%loss possible. Strong liquiditydoesnotprotectstockvaluation.'
d['updatedAtUtc']=datetime.now(timezone.utc).isoformat()
assert abs(d['facts']['TTM']['revenueM']-7288.260)<1e-6
assert e['thirdMax']<e['secondMax']<e['firstMax']<quote
assert d['model']['scenarioAssumptions']['base']['wacc']>d['model']['scenarioAssumptions']['base']['terminalGrowth']
p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'path':str(p),'values':{k:{n:v[n] for n in ['todayDCF','price2031DCF','cagrFromQuoteDCF','price2031NormalizedProfitMultiple','crossValueTodayAt15pct','entryReturn15','terminalValuePVShare']} for k,v in d['model']['scenarios'].items()},'entry':e,'reverse':d['model']['reverseDCF'],'reverse15':d['model']['reverseDCFFor15pctAnnualReturn'],'reinvestmentSensitivity':d['model']['reinvestmentAudit']['sensitivity'],'roicSensitivity':d['model']['terminalROICSensitivity'],'ttm':d['facts']['TTM']},ensure_ascii=False,indent=2))
