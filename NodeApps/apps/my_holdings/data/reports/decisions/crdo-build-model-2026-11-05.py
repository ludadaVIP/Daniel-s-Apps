import json, math, hashlib, copy
from pathlib import Path
from datetime import datetime, timezone

P=Path(__file__).parent
OUT=P/'crdo-evidence-model-2026-11-05.json'
price=133.00
ordinary=187.951918
known_claims=ordinary+8.3+3.1+1.7+0.132
cash=764.258
option_cash=1.7*2.34
reserve=250.0
trade_nwc=288.798+313.051-101.822

sources=[
 {'sourceId':'K26','date':'2026-06-15','title':'FY2026 audited 10-K, year ended 2026-05-02, full financials and notes','url':'https://www.sec.gov/Archives/edgar/data/1807794/000162828026043303/crdo-20260502.htm','local':'crdo-10k-20260502.html'},
 {'sourceId':'Q27','date':'2026-09-02','title':'FY2027 Q1 10-Q, quarter ended 2026-08-01, full financials and notes','url':'https://www.sec.gov/Archives/edgar/data/1807794/000162828026060111/crdo-20260801.htm','local':'crdo-10q-20260801.html'},
 {'sourceId':'K24','date':'2024-06-24','title':'FY2024 audited 10-K, financials FY2022-FY2024','url':'https://www.sec.gov/Archives/edgar/data/1807794/000162828024029629/crdo-20240427.htm','local':'crdo-10k-20240427.html'},
 {'sourceId':'K23','date':'2023-06-23','title':'FY2023 audited 10-K, including FY2022 balance sheet','url':'https://www.sec.gov/Archives/edgar/data/1807794/000162828023023187/crdo-20230429.htm','local':'crdo-10k-20230429.html'},
 {'sourceId':'S8','date':'2026-09-02','title':'S-8 additional plan share registration, not completed public financing','url':'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001807794/e7feaccb-df6d-4afa-aab3-4cdaa1c23c1b.pdf','local':'crdo-s-8-09022026.pdf'},
 {'sourceId':'PROXY','date':'2026-08-25','title':'2026 definitive proxy, governance and executive compensation','url':'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001807794/250542a0-a9b9-4747-bf5d-ff16b4746f29.pdf','local':'crdo-def14a-08252026.pdf'},
 {'sourceId':'VOTE','date':'2026-10-16','title':'8-K shareholder vote on October 12, no financing event','url':'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001807794/5359e11e-9515-4405-9b81-1165709e1a1b.pdf','local':'crdo-8k-20261016.pdf'},
 {'sourceId':'YQUOTE','date':'2026-11-04','title':'Actual Chrome Yahoo CRDO quote body capture','url':'https://finance.yahoo.com/quote/CRDO/','local':'crdo-quote-browser-2026-11-05.json'},
 {'sourceId':'NEWSINDEX','date':'2026-11-05','title':'Actual Chrome IR news index; latest November 4 Oracle standard announcement','url':'https://investors.credosemi.com/news-events/news/default.aspx','local':'crdo-ir-news-browser-index-2026-11-05.json'},
 {'sourceId':'FILINGSINDEX','date':'2026-11-05','title':'Actual Chrome IR SEC filings index; latest non-insider filing 8-K October 16','url':'https://investors.credosemi.com/financials/sec-filings/default.aspx','local':'crdo-ir-filings-links-2026-11-05.json'},
]

hist=[]
# Values copied from original statements, USD millions, shares millions. NI is consolidated = attributable as no NCI line.
rows=[
 (2022,'2021-05-02','2022-04-30',52,106.477,64.015,-21.968,-22.176,-30.832,17.580,0.0,9.188,4.793,0.0,259.322,0.0,144.755,88.398,29.524,27.337,8.487,334.163),
 (2023,'2022-05-01','2023-04-29',52,184.194,106.194,-21.235,-16.547,-24.615,21.713,.616,23.516,9.514,0.0,108.583,109.228,148.651,146.556,49.541,46.023,6.067,347.635),
 (2024,'2023-04-30','2024-04-27',52,192.970,119.431,-37.058,-28.369,32.737,15.652,3.052,39.022,13.771,0.0,66.942,343.061,164.305,155.091,59.662,25.907,13.417,540.198),
 (2025,'2024-04-28','2025-05-03',53,436.775,282.909,37.124,52.183,65.083,36.061,6.306,77.355,21.938,0.0,236.328,195.010,171.169,181.158,162.144,90.029,56.158,681.582),
 (2026,'2025-05-04','2026-05-02',52,1335.116,908.349,445.005,472.279,464.292,57.296,6.624,182.638,34.637,.400,1164.952,278.334,185.419,188.232,233.377,250.831,107.345,2063.612)
]
for r in rows:
 y,st,en,w,rev,gp,ebit,ni,cfo,ppe,tech,sbc,da,acqda,ce,inv,sh,wash,ar,stock,ap,eq=r
 hist.append(dict(fiscalYear=y,start=st,end=en,weeks=w,revenue=rev,grossProfit=gp,grossMargin=gp/rev,EBIT=ebit,operatingMargin=ebit/rev,netIncomeConsolidated=ni,netIncomeAttributable=ni,NIAttributionNote='No non-controlling interest line; all consolidated net income attributable to ordinary shareholders',CFO=cfo,PPEcashCapex=ppe,technologyLicenseCash=tech,allIdentifiedCashCapex=ppe+tech,otherCapitalizedCashSpend=None,otherCapitalizedCashSpendNote='Not separately disclosed; software included in PPE, R&D expensed; null is not zero',reportedPPEFCF=cfo-ppe,ownerFCFBeforeSBC=cfo-ppe-tech,ownerFCFAfterHistoricalSBC=cfo-ppe-tech-sbc,SBC=sbc,DAexcludingAcquiredIntangibles=da,acquiredIntangibleAmortization=acqda,cashEquivalents=ce,shortTermInvestments=inv,cashAndShortInvestments=ce+inv,interestBearingBorrowings=0.0,borrowingNote='No borrowing line on original balance sheet; operating leases and technology licenses handled in operating cash/capex',issuedShares=sh,weightedAverageDilutedShares=wash,receivables=ar,inventories=stock,payables=ap,equity=eq,ROE=ni/eq,sourceId='K24' if y<=2024 else 'K26',issuerRepurchases=0.0,repurchaseNote='No issuer buyback shown; RSU tax withholding is separate and not discretionary repurchase'))
# Original fiscal rule predates May2022: do not invent52-week FY2022.
hist[0]['start']='2021-05-01'; hist[0]['weeks']=None
hist[0]['periodNote']='Calendar fiscal year ended April30, before May2022 switch to52/53weeks.'
for i,h in enumerate(hist):
 h['netIncomeOverEndingEquityProxy']=h.pop('ROE')
 h['ROE']=h['netIncomeConsolidated']/((hist[i-1]['equity']+h['equity'])/2) if i else None
 h['ROENote']='Simple average beginning/end book equity; affected by equity issuance and acquisitions; no FY2022 beginning comparable ordinary equity used.'

q={'start':'2026-05-03','end':'2026-08-01','weeks':13,'revenue':479.003,'grossProfit':309.080,'EBIT':120.700,'netIncomeConsolidated':129.425,'netIncomeAttributable':129.425,'CFO':90.231,'PPEcashCapex':7.282,'technologyLicenseCash':5.172,'SBC':87.979,'DAexcludingAcquiredIntangibles':8.606,'acquiredIntangibleAmortization':11.600,'taxExpense':-.585,'taxRate':-.005,'sourceId':'Q27'}
pq={'start':'2025-05-04','end':'2025-08-02','weeks':13,'revenue':223.074,'grossProfit':150.368,'EBIT':60.742,'netIncomeConsolidated':63.399,'netIncomeAttributable':63.399,'CFO':54.168,'PPEcashCapex':2.821,'technologyLicenseCash':3.906,'SBC':35.455,'DAexcludingAcquiredIntangibles':5.460,'acquiredIntangibleAmortization':0.0,'sourceId':'Q27'}
ttm={'start':'2025-08-03','end':'2026-08-01','weeks':52,'formula':'FY2026 + FY2027Q1 - FY2026Q1; exact 13-week quarters, no 53-week mismatch','sourceIds':['K26','Q27']}
for k in ['revenue','grossProfit','EBIT','netIncomeConsolidated','netIncomeAttributable','CFO','PPEcashCapex','technologyLicenseCash','SBC','DAexcludingAcquiredIntangibles','acquiredIntangibleAmortization']:
 ttm[k]=hist[-1][k]+q[k]-pq[k]
ttm['reportedPPEFCF']=ttm['CFO']-ttm['PPEcashCapex']
ttm['ownerFCFBeforeSBC']=ttm['reportedPPEFCF']-ttm['technologyLicenseCash']
ttm['ownerFCFAfterHistoricalSBC']=ttm['ownerFCFBeforeSBC']-ttm['SBC']
ttm['grossMargin']=ttm['grossProfit']/ttm['revenue']

configs={
 'bear':dict(revenues=[2100,2100,2268,2449.44,2596.4064],tailGrowth=[.05,.04,.035,.03,.025],preNewCompMargin=[.35,.33,.32,.31,.30,.29,.28,.28,.28,.28],newCompRate=[.09,.09,.085,.085,.08,.08,.08,.08,.08,.08],grossMargin=[.62,.60,.59,.58,.58,.58,.58,.58,.58,.58],tax=[.12,.16,.20,.22,.22,.22,.22,.22,.22,.22],nwcRate=[.32,.32,.31,.30,.30,.30,.30,.30,.30,.30],ppeRate=.04,techRate=.005,daRate=.025,discount=.14,g=.025,terminalROIC=.15,terminalEBITMargin=.20,earnoutShares=0.0,earnoutCash=0.0,maturePE=16,description='AI spending interruption and top-customer dual sourcing; gross margin erodes, inventories consume cash, copper demand plateaus; optical acquisitions fail to restore high growth'),
 'base':dict(revenues=[2500,3375,4320,5270.4,6166.368],tailGrowth=[.12,.10,.08,.06,.05],preNewCompMargin=[.43,.43,.425,.42,.415,.41,.405,.40,.40,.40],newCompRate=[.08,.075,.07,.065,.06,.06,.06,.06,.06,.06],grossMargin=[.67,.665,.66,.655,.65,.65,.65,.65,.65,.65],tax=[.10,.12,.15,.17,.18,.18,.18,.18,.18,.18],nwcRate=[.28,.27,.26,.25,.24,.24,.24,.24,.24,.24],ppeRate=.032,techRate=.004,daRate=.025,discount=.115,g=.035,terminalROIC=.30,terminalEBITMargin=.34,earnoutShares=1.4,earnoutCash=15.8,maturePE=25,description='AEC grows with AI clusters, optics and PCIe diversify revenue; price/competition gradually reduce margins while fabless scale preserves returns; no assumption of named anonymous customer'),
 'bull':dict(revenues=[2800,4060,5602.8,7283.64,8886.0408],tailGrowth=[.18,.14,.11,.08,.06],preNewCompMargin=[.46,.47,.47,.47,.47,.47,.47,.47,.47,.47],newCompRate=[.07,.065,.06,.055,.05,.05,.05,.05,.05,.05],grossMargin=[.69,.69,.69,.69,.69,.69,.69,.69,.69,.69],tax=[.08,.10,.12,.15,.18,.20,.20,.20,.20,.20],nwcRate=[.27,.25,.23,.22,.21,.21,.21,.21,.21,.21],ppeRate=.035,techRate=.004,daRate=.025,discount=.105,g=.04,terminalROIC=.35,terminalEBITMargin=.42,earnoutShares=2.8,earnoutCash=31.6,maturePE=32,description='224G AEC plus ZeroFlap optics, silicon photonics and PCIe become broad platforms; unit volume and product content expand with multiple AI customers; sustained premium margins require reliability value to exceed cheaper competing links')
}

def calculate(c,rev_scale=1.0):
 revs=[r*rev_scale for r in c['revenues']]
 for g in c['tailGrowth']:revs.append(revs[-1]*(1+g))
 priorNwc=trade_nwc; balance=cash+option_cash; shares=known_claims
 output=[]
 for i,rev in enumerate(revs):
  year=i+1;nwc=rev*c['nwcRate'][i];dnwc=nwc-priorNwc;priorNwc=nwc
  prenew=rev*c['preNewCompMargin'][i];newcomp=rev*c['newCompRate'][i]
  ebit=prenew-newcomp;tax=max(0,ebit)*c['tax'][i];nopat=ebit-tax
  da=rev*c['daRate'];ppe=rev*c['ppeRate'];tech=rev*c['techRate']
  deposit=102.4 if i==0 else 0.0
  # Earnout cash is acquisition consideration, a single equity cash claim below operating FCFF.
  fcff=nopat+da-ppe-tech-dnwc-deposit
  earncash=c['earnoutCash'] if i==1 else 0.0
  shareadd=c['earnoutShares'] if i==1 else 0.0
  shares+=shareadd
  prefinance=balance+fcff-earncash
  need=max(0,reserve-prefinance)
  # All selected scenarios have positive liquidity. No hypothetical high-price share issue can silently fill a deficit.
  if need>1e-8:raise ValueError('Financing required; must solve financing price/ownership explicitly')
  balance=prefinance
  output.append(dict(year=2027+i,t=year,periodLabel=f'Valuation-year {year}: 12 months ending 4 November {2027+i}; research forecast, not company fiscal guidance',revenue=rev,grossMargin=c['grossMargin'][i],otherOpexIncludingOrganicDABeforeNewServiceCompRate=c['grossMargin'][i]-c['preNewCompMargin'][i],preNewGrantCompEBIT=prenew,newServiceCompensationCash=newcomp,newServiceCompensationRate=c['newCompRate'][i],economicEBIT=ebit,economicEBITMargin=ebit/rev,taxRate=c['tax'][i],cashOperatingTax=tax,NOPAT=nopat,DA=da,PPECapex=ppe,technologyLicenseCapex=tech,allCashCapex=ppe+tech,tradeNWC=nwc,deltaTradeNWC=dnwc,incrementalCapacityDeposits=deposit,FCFF=fcff,acquisitionEarnoutCash=earncash,FCFEafterAcquisitionClaims=fcff-earncash,economicShares=shares,earnoutSharesIssued=shareadd,netExternalFinancing=0.0,financingPrice=None,cashAndInvestmentsEnd=balance,operatingReserve=reserve,excessCashEnd=max(0,balance-reserve),liquidityHeadroom=balance-reserve))
 k=c['discount'];g=c['g'];sfinal=known_claims+c['earnoutShares']
 terminalRev=revs[-1]*(1+g);terminalNopat=terminalRev*c['terminalEBITMargin']*(1-c['tax'][-1]);reinvest=terminalNopat*g/c['terminalROIC'];fcfterm=terminalNopat-reinvest;tv=fcfterm/(k-g)
 pvflows=sum(y['FCFEafterAcquisitionClaims']/(1+k)**y['t'] for y in output)
 pvtv=tv/(1+k)**10
 # Existing and contingent acquisition share claims are allocated from inception for valuation, conservatively including their claim on retained early cash.
 initialexcess=cash+option_cash-reserve
 v0=(initialexcess+pvflows+pvtv)/sfinal
 ev5=sum(y['FCFEafterAcquisitionClaims']/(1+k)**(y['t']-5) for y in output[5:])+tv/(1+k)**5
 ph=(ev5+output[4]['excessCashEnd'])/output[4]['economicShares']
 mature_p5=(output[4]['NOPAT']*c['maturePE']+output[4]['excessCashEnd'])/output[4]['economicShares']
 return dict(assumptions=c,years=output,terminal=dict(year=2036,firstStableYear=2037,revenue=terminalRev,economicEBITMargin=c['terminalEBITMargin'],taxRate=c['tax'][-1],NOPAT=terminalNopat,growth=g,incrementalROIC=c['terminalROIC'],reinvestmentRate=g/c['terminalROIC'],reinvestment=reinvest,FCFF=fcfterm,value=tv,presentValue=pvtv),valuation=dict(todayValue=v0,enterpriseValueBeforeEarnoutCash=pvflows+pvtv+sum(y['acquisitionEarnoutCash']/(1+k)**y['t'] for y in output),initialExcessCash=initialexcess,PVfutureCashFlowsAfterAcquisitionClaims=pvflows,PVterminal=pvtv,terminalShareOfOperatingValue=pvtv/(pvflows+pvtv),valuationDenominator=sfinal,horizon2031Date='2031-11-04',horizon2031DCFPrice=ph,horizon2031MatureEarningsPrice=mature_p5,matureEarningsPE=c['maturePE'],matureEarningsTodayValue=mature_p5/(1+k)**5,fiveYearAnnualizedReturn=(ph/price)**.2-1,fiveYearTotalReturn=ph/price-1,todayUpside=v0/price-1,firstFiveYearDividends=0.0,DCFCheckpointOperatingValue=ev5,DCFCheckpointExcessCash=output[4]['excessCashEnd'],returnPriceAt12Percent=ph/(1.12**5),returnPriceAt15Percent=ph/(1.15**5),margin25Price=v0*.75,entryMax12PercentAnd25Margin=min(ph/(1.12**5),v0*.75),entryMax15PercentAnd30Margin=min(ph/(1.15**5),v0*.70)))

scenarios={n:calculate(c) for n,c in configs.items()}
stress={}
for n,changes in [('persistent_new_comp_plus5pp',{'compAdd':.05}),('top_customer_revenue_loss_25pct_margin_minus5pp',{'revScale':.75,'marginAdd':-.05}),('combined_customer_comp_tax',{'revScale':.75,'marginAdd':-.05,'compAdd':.05,'taxAdd':.05})]:
 c=copy.deepcopy(configs['base'])
 c['preNewCompMargin']=[m+changes.get('marginAdd',0) for m in c['preNewCompMargin']]
 c['grossMargin']=[m+changes.get('marginAdd',0) for m in c['grossMargin']]
 c['newCompRate']=[m+changes.get('compAdd',0) for m in c['newCompRate']]
 c['terminalEBITMargin']+=changes.get('marginAdd',0)-changes.get('compAdd',0)
 c['tax']=[min(.35,t+changes.get('taxAdd',0)) for t in c['tax']]
 stress[n]=calculate(c,changes.get('revScale',1))

sensitivity=[]
for k in [.095,.105,.115,.125,.135]:
 rr=[]
 for g in [.025,.03,.035,.04,.045]:
  c=copy.deepcopy(configs['base']);c['discount']=k;c['g']=g;rr.append(calculate(c)['valuation']['todayValue'])
 sensitivity.append(dict(discount=k,growths=[.025,.03,.035,.04,.045],values=rr))

lo,hi=.1,10
for _ in range(120):
 mid=(lo+hi)/2
 if calculate(configs['base'],mid)['valuation']['todayValue']<price:lo=mid
 else:hi=mid
reverse=calculate(configs['base'],(lo+hi)/2)

facts=dict(entity={'name':'Credo Technology Group Holding Ltd','CIK':'0001807794','domicile':'Cayman Islands exempted company','exchange':'Nasdaq Stock Market','ticker':'CRDO','currency':'USD','security':'ordinary shares, $0.00005 par, one vote per share; no ADR ratio','fiscalRule':'52/53 weeks ending Saturday closest to April 30; extra week in Q1; FY2025 53 weeks, FY2026 52; current FY2027 ends 2027-05-01','sourceIds':['K26','Q27','PROXY']},financialHistory=hist,latestQuarter=q,priorYearQuarter=pq,TTM=ttm,business={'reportableSegments':1,'model':'Fabless product-focused copper/optical interconnect chips and system solutions; SerDes/DSP technology sold as AECs, ICs/optical DSPs/retimers, optical transceivers, SerDes chiplets and licensed IP; engineering/license sales can be lumpy','AECRevenueLatest':None,'opticalRevenueLatest':None,'IPRevenueLatest':None,'breakoutNote':'Latest FY2026/2027 filings no longer separately disclose AEC/DSP/optics/IP revenue or segment profit. Older FY2024 product sales 145.048, engineering19.898, IP28.024 are historical only, not current mix','olderFY2024Mix':{'productSales':145.048,'engineeringServices':19.898,'IPLicense':28.024,'sourceId':'K24'},'contractedRPO':4.2,'RPOAsOf':'2026-08-01','RPONote':'Expected within next12months; does not describe total short-cycle product orderbook. Management outlook and design wins are not contracted revenue','TAM':None,'TAMNote':'No independently verified current addressable-dollar market used to justify model revenue; revenue forecasts are research scenarios with explicit execution hurdles','sourceIds':['K26','Q27','K24']},concentration={'directContractingCustomerRevenueFY2026':{'A':.49,'B':.32},'top10FY2026':.90,'directContractingCustomerRevenueFY2027Q1':{'A':.43,'B':.28},'endCustomerRevenueFY2027Q1':{'C':.28,'D':.33,'E':.13,'F':.10},'receivableConcentration20260801':{'A':.57,'B':.28},'names':'Anonymous labels are not mapped to Microsoft/Amazon/Oracle/Meta or any unnamed hyperscaler','channels':'Contract manufacturers may place purchase orders and be financial-statement customers; end-user demand table is separate; geographic revenue is shipment destination, not customer domicile','supply':'FY2026 semiconductor wafers exclusively TSMC. Packaging Amkor/ASE; test KYEC/Sigurd; AEC manufacturing BizLink. Fabless does not eliminate concentration or required capacity funding','sourceIds':['K26','Q27']},guidance={'released':'2026-09-01','period':'FY2027Q2, not CY2026Q2','revenueRange':[525,535],'GAAPGrossMarginRange':[.629,.649],'nonGAAPGrossMarginRange':[.67,.69],'GAAPOperatingExpenseRange':[199,204],'nonGAAPOperatingExpenseRange':[100,105],'sourceId':'IR4','guidanceIsOrders':False},accounting={'auditor':'Ernst & Young LLP since2018','FY2026Opinion':'unqualified financial statements and effective ICFR','criticalAuditMatter':'Inventory valuation: FY2026 inventory250.8, obsolescence/product-demand assumptions','tax':'FY2026 reported tax3.156 on PBT475.435; SBC tax benefits73.448, R&D credits32.047, Cayman rate differential86.088 and valuation-allowance change78.617 are not a sustainable tax forecast. Q1 benefit.585 includes Dust purchase-accounting adjustment','Q1cashBridge':{'NI':129.425,'DA':8.606,'acquiredAmortization':11.6,'SBC':87.979,'inventoryWriteDown':3.911,'AR':-54.503,'inventory':-61.547,'otherCurrentAssets':-25.338,'otherNoncurrentAssets':6.515,'AP':-12.563,'accrualTaxesOther':-3.854,'CFO':90.231},'sourceIds':['K26','Q27']})

capital={'issuedOrdinaryShares':ordinary,'issuedSharesAsOf':'2026-08-25','issuedSharesLatestVerified':True,'issuedSharesAsOfValuationDate':None,'ordinarySharesAuthorized':1000,'currentAwardsAsOf':'2026-08-01','RSUs':8.3,'PSUs':3.1,'options':1.7,'optionWeightedExercise':2.34,'optionExerciseProceeds':option_cash,'exchangeableHyperlumeSubsidiaryShares':.132,'knownFullyDilutedClaims':known_claims,'currentUnpurchasedESPPShareClaim':None,'ESPPNote':'FY2026 ESPP issued .2m;7.5m shares available; current unpurchased offering rights not separately disclosed. Future discount cost included within replacement compensation. 1m extra claims reduce value about0.5%; do not equate7.5m reserve with shares outstanding','CEOaward':{'shares':1.437,'insideQ1PSUTotal':True,'performanceEnd':'2031-06-30','revenueHurdles':[2500,3500,4500,5500,6500,7500],'stockPriceHurdles':[244.7,293.64,342.58,391.52,440.46,489.40],'note':'Revenue and stock hurdles both required; separate 2025 off-cycle executive awards also exist; counting full3.1mPSU is conservative and not forecast vesting'},'S8registration':{'date':'2026-09-02','additionalAutomaticReserve':9.807841,'previouslyRegisteredReturnedReserve':.297379,'publicFinancingProceeds':None,'note':'Registration/reserve only; neither completed issuance nor new cash financing'},'cashAndShortTermInvestments':cash,'cashBalanceAsOf':'2026-08-01','cashBalanceAsOfValuationDate':None,'requiredOperatingReserveAssumption':reserve,'currentInterestBearingBorrowings':0,'operatingLeaseLiability':26.205,'leaseHandling':'Rent retained in operating margin, no separate debt deduction. Reported total-debt aggregators may label operating leases as debt','technologyLicenseUnconditionalCommitment':9.495,'manufacturingUnconditionalCommitment':212.717,'commitmentAsOf':'2026-08-01','capacityDepositsAlreadyPaid':88.4,'additionalCapacityDepositsAfterQuarterEnd':102.4,'depositsHandling':'Existing deposits are operating assets, not added as excesscash. Incremental102.4 paid in valuation-year1. Manufacturing purchases represented in cost/working capital, not all deducted again as debt','ATM':{'announced':'2025-10','grossAuthorization':750,'status':'completed FY2026','sharesApprox':4.8,'netProceeds':736.327,'issuanceCosts':13.7,'remainingCapacity':0},'acquisitions':[{'name':'Hyperlume','closed':'2025-09-29','purchaseConsideration':92.017,'cashConsideration':88.698,'settlementOfVestedAwards':3.319,'netCashPaid':82.564,'goodwill':69.134,'intangibles':17.2,'postCombinationAwards':'87k replacement RSUs plus132k parent restricted shares and132k subsidiary exchangeable restricted shares; service awards, separate from price'},{'name':'CoMira Solutions','closed':'2026-02-25','cashPurchaseConsideration':35.073,'netCashPaid':30.344,'goodwill':21.789,'intangibles':12},{'name':'DustPhotonics','closed':'2026-05-28','totalPurchaseConsideration':1251.111,'cashConsideration':769.587,'netCashPaid':735.619,'ordinaryShareConsideration':169.069,'ordinarySharesIssued':.760,'replacementPreCombinationAwardConsideration':2.455,'earnoutAcquisitionDateFairValue':310,'earnoutEquityFairValue':300,'earnoutCashFairValue':10,'contractualMaximumSharesApprox':2.8,'contractualMaximumCashApprox':31.6,'oldSigningTermsSuperseded':'April13 proposal .92m upfront shares+3.21m contingent shares; use completed May28 terms','goodwill':895.839,'intangibles':361.7,'postCombinationRSUs':.754,'postCombinationAwardsInQ1RSUTotal':True,'PPA':'Preliminary estimates; acquired developed technology264m, IPRD82.8m, customer relations15m; pro forma revenue not presented as immaterial','handling':'Purchase cash already reduced August1 balance, not paid again in projections. Only future conditional cash and shares modeled. Do not divide FV300 by stock price to invent shares'}],'sourceIds':['K26','Q27','S8','PROXY','VOTE']}

result={'status':'draft-model-awaiting-independent-rebuild','asOf':'2026-11-05','generatedUTC':datetime.now(timezone.utc).isoformat(),'ticker':'CRDO','units':{'money':'USD millions','shares':'millions','price':'USD per ordinary share'},'facts':facts,'capital':capital,'market':{'valuationPrice':price,'priceType':'official regular-session close','sessionDate':'2026-11-04','displayTime':'16:00:01 EST','timezone':'America/New_York (UTC-05:00)','closeUTC':'2026-11-04T21:00:01Z','afterHoursPrice':137,'afterHoursDisplayTime':'17:39:42 EST','afterHoursUTC':'2026-11-04T22:39:42Z','captureRawFile':'crdo-quote-browser-2026-11-05.json','sourceId':'YQUOTE','marketCapUsingLatestDisclosedShares':price*ordinary,'TTMPriceSales':price*ordinary/ttm['revenue'],'TTMGAAPPE':price*ordinary/ttm['netIncomeAttributable'],'TTMOwnerFCFAfterSBCYield':ttm['ownerFCFAfterHistoricalSBC']/(price*ordinary)},'sources':sources,'scenarios':scenarios,'stress':stress,'sensitivity':sensitivity,'reverse':{'price':price,'fixed':'Base margins, normalized taxes, working-capital ratios, capex, compensation, discount11.5%,g3.5%,ROIC30%; proportionally scale every forecast year revenue. One conditional inverse, not unique market belief','requiredForecastRevenueScale':(lo+hi)/2,'required2027Revenue':reverse['years'][0]['revenue'],'required2031Revenue':reverse['years'][4]['revenue'],'required2036Revenue':reverse['years'][9]['revenue'],'required2031EconomicEBIT':reverse['years'][4]['economicEBIT'],'2027to2031CAGR':(reverse['years'][4]['revenue']/reverse['years'][0]['revenue'])**.25-1,'reconstructedPrice':reverse['valuation']['todayValue']},'methodology':{'DCF':'10 explicit valuation-years 2027-2036 with differentiated growth fade; unlevered all-equity economic FCFF; WACC=Ke because no interest-bearing borrowings. PV future after-earnout cash flows+terminal+initial excesscash. Acquired intangible amortization is noncash and excluded from economic margins; organic PPE DA and all PPE+technology cash capex retained. Terminal FCFF=NOPAT*(1-g/ROIC).','calendar':'Forecast years are rolling12months ending November4, not fiscalyears or actual CY revenue; latest GAAP52week TTM used only as historical context. No unreported FY27Q2 result is invented.','SBC':'Fully count ALL known existing RSU/PSU/options/exchangeable claims. Future GAAP recognition of those same awards is not deducted again. Deduct recurring cash-equivalent cost for NEW future service awards, including ESPP discount, from pre-new-comp margin; future share count fixed for replacement cash policy. This is an economic valuation convention, not forecast reported GAAP earnings or management compensation policy. All current awards treated fully vested conservatively; latest rounded counts and outstanding ESPP rights remain limitations.','shareClaims':'Scenario earnout0/1.4/2.8m modeled issued year2; valuation conservatively allocates their claim from inception using known fully diluted+scenario earnout denominator. Annual cash/share tables show issuance timing. No hypothetical external share issuance, no growth financed at unjustified high stock price.','cashAndReturns':'August1 reported cash, not November actual cash. 250m retained operating reserve not added to terminal equity. No forecast dividends/buybacks; horizon2031 price adds first5year retainedFCF excesscash once, assumes0% interest on retained cash; do not also count retainedFCF as dividend. Today standard distributableFCFF DCF can exceed value under cash-dragging retention policy; no claim that five-year IRR must equal discount.','secondMethod':'2031 normalized economicNOPAT times16/25/32P/E plus excesscash, then discounted5years for today cross-check. Multiples are explicit research assumptions; no same-day peer financial/price comparison was verified. NOPAT approximates debt-free normalized earnings; excludes interest and exceptional tax benefits.','liquidity':'Annual beginningcash+FCFF−cashacquisitionearnout=endingcash; no automatic financing. If cash below250m floor, script raises rather than silently issuing equity. Lease expense remains in margin; manufacturing commitments in costs/NWC.','ROIC':'Terminal incremental ROIC is scenario assumption, not historical audited metric. Historical GAAP ROIC not mechanically calculated because cash/deposit/goodwill/old IPO capital distort invested-capital comparability.','unknowns':['Current unpurchased ESPP rights; November actual cash/sharecount; exact future product revenue mix, anonymous customer identities, backlog/orderbook beyond4.2RPO; independent market TAM/peer multiples; future litigation/competitive product economics'], 'entry':'Research hurdle12% annual and25% margin; cautious hurdle15% and30% margin. Entrymax=min(2031price/(1+r)^5,todayDCF*(1-margin)). No user-specific risk budget inferred.'}}
# Fresh observed overnight print, kept separate from official regular close.
fresh=json.loads((P/'crdo-refresh-yahoo-2026-11-05.json').read_text(encoding='utf-8'))
result['market'].update(priceType='overnight last trade, not executable quote',displayTime='2026-11-04 22:39:29 EST',quoteUTC='2026-11-05T03:39:29Z',capturedAtUTC=fresh['capturedAt'],regularClose=136.50,regularCloseUTC='2026-11-04T21:00:01Z',afterHoursPrice=133.94,afterHoursDisplayTime='Moomoo Post20:02ET',afterHoursUTC='2026-11-05T01:02:00Z',captureRawFile='crdo-refresh-yahoo-2026-11-05.json',sessionCaveat='Yahoo overnight22:39:29 is a distinct later trading venue/time than Moomoo post20:02; regular close independently agrees136.50. Do not combine venues or call either an executable bid/ask.')
for source in sources:
 if source['sourceId']=='YQUOTE': source.update(date=fresh['capturedAt'],local='crdo-refresh-yahoo-2026-11-05.json')
 if source['sourceId']=='NEWSINDEX': source.update(local='crdo-refresh-news-2026-11-05.json',date='accessed2026-11-05UTC; latestNov4')

# Complete source graph from actual issuer releases and independent primary checks.
monthnames=['January','February','March','April','May','June','July','August','September','October','November','December']
import re
for item in json.loads((P/'crdo-source-news-index-2026-11-05.json').read_text(encoding='utf-8')):
 text=(P/item['local']).read_text(encoding='utf-8')
 match=re.search(r'('+'|'.join(monthnames)+r')\s+(\d{1,2}),\s+(2026)',text)
 date=f'{match[3]}-{monthnames.index(match[1])+1:02d}-{int(match[2]):02d}' if match else 'accessed2026-11-04'
 title=item['t'].replace('Industry鈥檚','Industry’s')
 sources.append(dict(sourceId=item['sourceId'],date=date,title=title,url=item['u'],local=item['local']))
for sid,date,title,url,local in [
 ('MARVELL','2026-04-09','Marvell official hybrid AEC/ACC demonstration and link-reach distinctions','https://www.marvell.com/blogs/hybrid-aec-acc-cables-for-optimizing-infrastructure.html','crdo-parent-marvell-hybrid-2026-11-05.html'),
 ('NVIDIA','2026-06-01','NVIDIA official Spectrum-X CPO production announcement, scale-out/across','https://blogs.nvidia.com/blog/nvidia-gtc-taipei-computex-2026-news/','crdo-parent-nvidia-cpo-2026-11-05.html'),
 ('BROADCOM','2026-10-21','Broadcom integrated optics roadmap; some OCI products still future','https://www.broadcom.com/company/news/articles/optics/scaling-ai-infrastructure-with-integrated-optics','crdo-parent-broadcom-optics-browser-2026-11-05.json'),
 ('OCP','accessed2026-11-04','Official OCP contributions registry, two2026 optical telemetry specifications','https://www.opencompute.org/contributions/?project=Networking%2FOptics+Reliability','crdo-parent-ocp-registry-2026-11-05.html')]:
 sources.append(dict(sourceId=sid,date=date,title=title,url=url,local=local))

OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf-8')
print(json.dumps({'path':str(OUT),'scenarios':{n:s['valuation'] for n,s in scenarios.items()},'reverse':result['reverse'],'stress':{n:s['valuation']['todayValue'] for n,s in stress.items()}},ensure_ascii=False,indent=2))
