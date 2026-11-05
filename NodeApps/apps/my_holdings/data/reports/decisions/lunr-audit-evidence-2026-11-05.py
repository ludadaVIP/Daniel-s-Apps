import json, math, datetime
from pathlib import Path
p=Path(__file__).parent/'lunr-evidence-model-2026-11-05.json'
j=json.loads(p.read_text(encoding='utf8')); audit={}
for k,v in j['model']['scenarios'].items():
 sp=v['assumptions'];rr=v['rows'];res=v['result'];w=sp['wacc'];g=sp['g'];prev=.95
 for row in rr:
  assert abs(row['fcff']-(row['ebit']-max(row['ebit'],0)*.25+row['da']-row['capex']-(row['revenue']-prev)*.14))<1e-12
  assert abs(row['netDebtEnd']-(row['netDebtStart']+row['netFinancingCost']+row['separateConvertCoupon']-row['fcff']-row['legacyOrbitalRunoff']))<1e-12
  prev=row['revenue']
 tf=rr[-1]['revenue']*(1+g)*rr[-1]['ebitMargin']*.75*(1-g/sp['roic']);tv=tf/(w-g)
 ev=sum(row['fcff']/(1+w)**(i+1) for i,row in enumerate(rr))+tv/(1+w)**10
 p31=max(0,(sum((row['fcff']+row['legacyOrbitalRunoff'])/(1+w)**(row['year']-2031) for row in rr[5:])+tv/(1+w)**5-rr[4]['netDebtEnd'])/res['shares'])
 assert abs(ev-res['EV0'])<1e-12;assert abs(p31-res['price2031'])<1e-12
 audit[k]={'independentMath':'FCFF,netdebtroll,terminal,EV0,2031allrecomputedwithin1e-12billion','2030Price':res['price2030'],'convertStrike':13.1125,'routeConsistent': (res['price2030']>=13.1125) == (sp['conversion']=='shares'),'terminalPVFraction':res['terminalPVFraction']}
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
j['quote']['price']=10.73;j['quote']['timestamp']='2026-11-04T10:55:00Z';j['quote']['providerLabel']='Pre05:55ET';j['quote']['observedAtUtc']='2026-11-04T10:58:35Z';j['quote']['freshnessAtObservationMinutes']=3.58
for k,v in j['model']['scenarios'].items():
 r=v['result'];r['returnReference']=10.73;r['annualizedReturnAtReference']=(r['price2031']/10.73)**.2-1 if r['price2031']>0 else -1;r['upsideTodayAtReference']=r['valueToday']/10.73-1
j['model']['independentCrossCheck']['scopeNote']='AssumedsegmentEVmultiplesapplytoongoingfranchisesexcludingseparatelycarvedlegacyorbitalreceivableportfolio. Theseareunreportedresearchsegments/normalized2028profitsinadifferentrecoverypathfromDCF,notafact-boundsconfidenceinterval. Noaveragingthetwomethods.'
j['model']['sensitivity']['capexScope']='Incremental1/2%appliesexplicit2027-36forecastonly; terminalreinvestmentheldatg/ROIC. PersistentextraeconomiccapitalintensityrequireslowerterminalROICtoo.'
j['model']['position']['tranches']=[{'budgetUsd':b,'upperLimitResearchPrice':q,'wholeSharesAtUpperLimit':int(b/q),'maximumNotionalUsd':round(int(b/q)*q,2)} for b,q in zip([500,700,800],[3.39,2.82,2.01])]
j['audit']['independentMath']=audit;j['audit']['status']='facts-model-and-independent-audit-complete';j['audit']['completedAtUtc']=now
j['audit']['modelChallenge']=[
 {'issue':'Potentialunderstatement','detail':'BaseDCFdelaysmarginrecoveryto15%by2036; Q2LanterisEBIT24.5m/166.7m=14.7%alreadyprovesonequartermanufacturingprofitability. Groupoverhead,IM3/4lossesandnetworkbuildcanabsorbit. SOTPbase5.55assumesquicker2028normalizedprofitrecovery. NeedpostQ3cash/economicmargins,notraiseDCFbecausequote10.73.'},
 {'issue':'Unmodeledoptions','detail':'FutureLTVwins,largerMoonbasecampaigns,unawardedNSNSutilization,newM&Aandproprietarynetworkpremiumcouldcreatevaluebutnoverifiedprices/probabilities. Bullalreadyincludes5.145bn2036salesand22%EBIT; do notaddwhole4.82bnceilingasbonus.'},
 {'issue':'Capitalstructureconservatism','detail':'Nooption/warrantexerciseproceedscredited;grossoptionsharesratherthantreasuryshares. CappedcallfullcapconditionalPVmaxaddsabout0.494/sharebull; notenoughtoclosebasegap. FutureATMproceedsnotcreditedwithoutissuanceanddilution.'},
 {'issue':'Netdebtapproximation','detail':'Includingpension/securedreceivabledebtsbutpositiveNDfunding6.5%isresearchapproximation; cashredemption2030mayneedrefinancingdespitepositiveDCF. Bullasconvertedcashnotavailableuntilactualconversion. GrossliquiditynotprovedbynegativeproformaND.'},
 {'issue':'Legacyassetcarveout','detail':'Orbital2027+collectioncreditedexplicitlywithriskhaircut,2026collectionsinstubonly; noaddfullbalanceagain. Neworbitalreceivablefinancingassumedinside14%incrementalNWCmayunderstaterequirementifcustomersprepayless; testhigherNWCandterminalROIC.'},
 {'issue':'Preferredandstressequity','detail':'Bearpreferredredemptionclaim6.945mdeductedfromrawtodayequity;debtrolldoesnotseparatelyfundpreferredaccretionbutstressvaluealreadyzero. Truepreferredput2028couldbemorethan6.945mdueto10%PIK; zerocasehasnomeaningfulpositivefloor.'}]
p.write_text(json.dumps(j,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(audit));print('FINAL',p)
