import json, math, pathlib, datetime
directory=pathlib.Path(__file__).resolve().parent
filename=directory/'aehr-evidence-model-2026-11-05.json'
d=json.loads(filename.read_text(encoding='utf-8'))
b=d['shared']['bridge']; p0=d['quote']['price']
checks=[]
def close(a,b,label):
    assert math.isclose(a,b,abs_tol=1e-9,rel_tol=1e-11),(label,a,b)
    checks.append(label)
def value(a):
    cf=[]; previous=d['shared']['openingRevenueRunRateM']
    for sales,margin in zip(a['revenueM'],a['ebitMargins']):
        aftertax=sales*margin*(1-a['tax'])
        delta=max(sales-previous,0)/a['salesToIncrementalCapital']
        cf.append(aftertax-delta); previous=sales
    tv=a['revenueM'][-1]*a['ebitMargins'][-1]*(1-a['tax'])*(1+a['g'])*(1-a['g']/a['terminalRoic'])/(a['wacc']-a['g'])
    ev=sum(c/(1+a['wacc'])**(i+1) for i,c in enumerate(cf))+tv/(1+a['wacc'])**10
    ev5=sum(cf[i]/(1+a['wacc'])**(i-4) for i in range(5,10))+tv/(1+a['wacc'])**5
    cash5=sum(cf[:5]); current=(ev+b['netNonOperatingAssetsM'])/b['sharesM']
    future=(ev5+b['netNonOperatingAssetsM']+cash5)/b['sharesM']
    normal=(a['revenueM'][4]*a['ebitMargins'][4]*(1-a['tax'])*a['exitNopatMultiple']+b['netNonOperatingAssetsM']+cash5)/b['sharesM']
    return current,future,normal
for key,a in d['scenarioAssumptions'].items():
    current,future,normal=value(a); r=d['scenarios'][key]
    close(current,r['todayValue'],f'{key}: Python today DCF')
    close(future,r['value2031'],f'{key}: Python period5 continuation plus retained FCFF')
    close(normal,r['normalizedProfitMultiple']['value2031'],f'{key}: Python independent normalized NOPAT multiple')
    close(normal/(1+a['wacc'])**5,r['normalizedProfitMultiple']['todayValue'],f'{key}: normalized method today discount')
    close((future/p0)**.2-1,r['cagr'],f'{key}: five-period CAGR')
for annual in d['facts']['annual']:
    close(annual['cfoM']-annual['capexM'],annual['reportedFcfM'],f"FY{annual['year']}: CFO-CapEx reporting FCF")
for row in d['entry']['stages']:
    close(min(d['scenarios']['base']['value2031']/(1+row['requiredReturn'])**5,d['entry']['conservativeReferenceValue']*(1-row['margin'])),row['upper'],f"entry {row['name']}: minimum return/margin cap")
c=d['facts']['cashBridge']; close(c['startMay29M']+c['transition']['changeM']+c['q1']['changeM'],c['q1']['endSeptember25M'],'May to September cash includes transition month')
for name in ['transition','q1']:
    r=c[name];close(r['cfoM']+r['investingM']+r['financingM']+r['fxM'],r['changeM'],name+' cash-flow bridge')
profit=c['q1ProfitToCfo'];close(sum(x for k,x in profit.items() if k!='reportedCfoM'),profit['reportedCfoM'],'Q1 net income to CFO bridge')
r=d['reverse']; a=dict(d['scenarioAssumptions']['base']);a['revenueM']=r['impliedRevenuePathM'];close(value(a)[0],p0,'reverse DCF matches observed price')
d['audit']['status']='passed_with_explicit_model_limitations'
d['audit']['auditedAtUtc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
d['audit']['independentComputation']=checks
d['audit']['checks']=['Two independent mechanisms:10period operating FCFF and5year normalized NOPAT exit multiple.','No strict TTM fabricated across fiscal calendar change.','No SBC addback, interest-income capitalization, dividend/buyback yield or DTA value added.','Latest cash after Q1 capital build; opening investment starts from latest Q1 annual runrate132.028m.','Rent within economic EBIT, operating leases not separately subtracted.','Current15m operating cash reserve excluded from excess cash.','No user state/positions/plans/orders altered.']
filename.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':d['audit']['status'],'checks':len(checks),'scenarios':{k:{'today':v['todayValue'],'future':v['value2031'],'normalToday':v['normalizedProfitMultiple']['todayValue']} for k,v in d['scenarios'].items()}},indent=2))
