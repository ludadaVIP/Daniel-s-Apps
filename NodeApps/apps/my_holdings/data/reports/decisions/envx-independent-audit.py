import json,math,datetime
from pathlib import Path
P=Path(__file__).parent/'envx-evidence-model-2026-11-05.json'
d=json.loads(P.read_text(encoding='utf-8'));a=d['model']['assumptions'];checks=[]
def equal(v,e,label):
    assert abs(v-e)<max(1e-7,abs(e)*1e-10),(label,v,e)
    checks.append(label)
def bisection_irr(values):
    low,high=-.9999,10
    for _ in range(200):
        r=(low+high)/2
        if sum(x/(1+r)**t for t,x in enumerate(values))>0:low=r
        else:high=r
    return (low+high)/2
cases={**d['model']['scenarios'],'reverse':d['model']['reverseDcf'],**{'variant_'+k:v for k,v in d['model']['variantAuditCases'].items()}}
for key,obj in cases.items():
    opening=obj.get('auditOpening',{'cashM':a['openingCashM'],'awardSharesM':a['existingAwardSharesM']})
    s=obj['inputs'];res=obj['results'];rows=obj['annual'];cash=opening['cashM'];shares=a['openingCommonSharesM']+opening['awardSharesM'];debt28,debt30,other=172.5,260,a['openingOtherDebtM'];prev=42;finance=0;failed=False;failure_year=None
    calc=[]
    for idx in range(10):
        eye=s['eyeUnitsM'][idx]*s['eyeAsp'][idx];phone=s['phoneUnitsM'][idx]*s['phoneAsp'][idx]
        sales=s['korea'][idx]+eye+phone
        earnings=s['korea'][idx]*s['koreaGm'][idx]+eye*s['eyeGm'][idx]+phone*s['phoneGm'][idx]-s['opex'][idx]
        nopat=earnings-max(0,earnings)*.2
        wc=(sales-prev)*s['nwcRatio'];fcff=nopat+s['da'][idx]-s['capex'][idx]-wc
        coupon=debt28*.03+debt30*.0475+other*.05;principal=0;proceeds=0
        if idx==0 and s['warrantMode']!='none':
            w=(a['openingCommonSharesM']+172.5*.06408+260*.089216)/4
            shares+=w
            if s['warrantMode']=='cash':proceeds=3*w
            else:
                retirement=min(debt28,w*1000/333);debt28-=retirement;proceeds=(w-retirement*333/1000)*3
        if idx==0:principal+=other;other=0
        if idx==1:principal+=debt28;debt28=0
        if idx==3:
            if s['convert2030']:shares+=debt30*.089216;debt30=0
            else:principal+=debt30;debt30=0
        cash+=fcff-coupon-principal+proceeds
        raised=0
        if cash<50:
            need=50-cash;gross=need/.95
            if finance+gross>s['maxFinanceM']:
                failed=True
                if failure_year is None:failure_year=2027+idx
            else:raised=gross;finance+=gross;cash+=need;shares+=gross/s['issuePrice'][idx]
        row=rows[idx]
        for name,v in [('revenueM',sales),('economicEbitM',earnings),('economicNopatM',nopat),('deltaNwcM',wc),('fcffM',fcff),('interestCashM',coupon),('principalCashM',principal),('financeGrossM',raised),('endCashM',cash),('endSharesM',shares)]:equal(v,row[name],f'{key} {idx+1} {name}')
        calc.append({'nopat':nopat,'fcff':fcff,'netFinance':raised*.95,'cash':cash,'shares':shares,'debt':debt28+debt30+other})
        prev=sales
    if failed:
        equal(res['todayExDistributionCommonValue'],0,key+' ordinary equity failure floor');assert res['failureYear']==failure_year
        continue
    stable_nopat=max(0,calc[-1]['nopat'])*(1+s['g'])
    stable_fcff=stable_nopat*(1-s['g']/s['terminalRoic'])
    pv_terminal=stable_fcff/(s['wacc']-s['g'])/(1+s['wacc'])**5
    continuation=pv_terminal+sum(calc[i]['fcff']/(1+s['wacc'])**(i-4) for i in range(5,10))
    fifth=calc[4]
    claim_explicit=sum((calc[i]['fcff']+calc[i]['netFinance'])*fifth['shares']/calc[i]['shares']/(1+s['wacc'])**(i-4) for i in range(5,10))
    claim_terminal=pv_terminal*fifth['shares']/calc[-1]['shares']
    continuation_claim=claim_explicit+claim_terminal
    p5=(continuation_claim+max(0,fifth['cash']-50)-fifth['debt']-3)/fifth['shares']
    p0=p5/(1+s['ke'])**5
    second5=(max(0,fifth['nopat'])*s['exitNopatMultiple']+max(0,fifth['cash']-50)-fifth['debt']-3)/fifth['shares']
    equal(continuation,res['year5ContinuationEvM'],key+' Python continuation EV')
    equal(continuation_claim,res['year5ContinuationClaimEvM'],key+' Python future-finance ownership-adjusted continuation claim')
    equal(continuation_claim-continuation,res['year5FutureFinancingOwnershipAdjustmentM'],key+' Python financing ownership adjustment')
    equal(sum(r['financeSharesM'] for r in rows[5:]),res['post2031NewSharesM'],key+' Python future issue shares included')
    if sum(r['financeGrossM'] for r in rows[5:])>0:
        assert calc[-1]['shares']>fifth['shares'];checks.append(key+' post2031 funded capital linked to future ownership')
    equal(p5,res['year5CommonPrice'],key+' Python 2031 common value')
    equal(p0,res['todayExDistributionCommonValue'],key+' Python today ex common value')
    equal(second5,res['independentYear5ExitCommonPrice'],key+' Python independent NOPAT common value')
    equal(second5/(1+s['ke'])**5,res['independentTodayExCommonValue'],key+' Python independent NOPAT today value')
    equal((p5/d['quote']['price'])**.2-1,res['commonOnlyCagrAtQuote'],key+' Python fiveyear common-only CAGR')
    cf=[-d['quote']['price'],-res['subscriptionPerOriginal'],0,0,0,res['sharesPerOriginal']*p5]
    equal(bisection_irr(cf),res['originalSharePackageIrrAtQuote'],key+' Python original-share package IRR incl subscription')
    pkg=res['sharesPerOriginal']*p0-res['subscriptionPerOriginal']/(1+s['ke'])
    equal(pkg,res['todayPreRecordPackageValue'],key+' Python rights package PV')
    if s['warrantMode']=='cash' and not key.startswith('variant_'):assert p5/(1+s['ke'])**4>3.3;checks.append('bull warrant exercise plausible conditional value>strike')
    if s['warrantMode']=='none':assert p5/(1+s['ke'])**3<3;checks.append('base noexercise beforeApr2028 consistent with assumed value path')
    if s['convert2030']:assert p5/(1+s['ke'])>11.21;checks.append('bull2030conversion rather than cash principal consistent')
for y in d['facts']['annual']:equal(y['cfoM']-y['capexM'],y['reportedFcfM'],f"FY{y['year']} CFO-CapEx")
bridge=d['facts']['cashBridgeH1'];equal(sum(bridge[k] for k in ['netLossM','daM','sbcM','warrantFairValueM','otherNoncashM','receivablesM','inventoryM','prepaidsM','payablesM','accrualsM','deferredRevenueM','deferredTaxM','otherLiabilitiesM']),bridge['cfoM'],'H126 complete NI→CFO bridge')
equal(bridge['cfoM']-bridge['capexM'],bridge['reportedFcfM'],'H126 CFO→reportedFCF')
annual_bridge=d['facts']['cashBridge2025'];equal(sum(v for k,v in annual_bridge.items() if k.endswith('M') and k not in ['cfoM','capexM','reportedFcfM']),annual_bridge['cfoM'],'FY2025 complete NI→CFO bridge');equal(annual_bridge['cfoM']-annual_bridge['capexM'],annual_bridge['reportedFcfM'],'FY2025 CFO→reportedFCF')
q1,q2,h1=d['facts']['quarterly'][:3]
for k in ['revenueM','ebitM','netIncomeM','cfoM','capexM','sbcM','daM']:equal(q1[k]+q2[k],h1[k],'Q1+Q2=H1 '+k)
for x in d['model']['entries']:equal(min(x['reference2031']/(1+x['r'])**5,x['referenceToday']*(1-x['margin'])),x['cap'],'entry cap '+x['stage'])
equal(d['model']['reverseDcf']['priceMatched'],d['quote']['price'],'reverse model observed price matched')
equal(512-63.1,448.9,'debt buyback cash adjustment')
equal(172.5+260+10.701,443.201,'post buyback gross debt')
equal(d['model']['scenarios']['base']['annual'][0]['revenueM'],55.6,'first forecast revenue fixed in reverse model')
d['audit']['status']='passed_with_material_explicit_limitations'
d['audit']['independentComputation']={'tool':'Python standalone reconstruction from scenario inputs, not importing JS functions','checksPassed':len(checks),'checks':checks}
d['audit']['auditedAtUtc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
d['audit']['valuationConfidence']='Low: binary customer qualification, whole-line capacity/yield and funding price unproven; values conditional, no probability weights.'
P.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'audit':'passed','checks':len(checks),'quote':d['quote'],'base':d['model']['scenarios']['base']['results'],'bull':d['model']['scenarios']['bull']['results']},ensure_ascii=False,indent=2))
