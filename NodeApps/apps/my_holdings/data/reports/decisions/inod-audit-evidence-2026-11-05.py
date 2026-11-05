"""Independent Python arithmetic reconstruction; does not call the JS model."""
import json, math, hashlib
from pathlib import Path
from datetime import datetime, timezone

D=Path(__file__).resolve().parent
P=D/'inod-evidence-model-2026-11-05.json'
m=json.loads(P.read_text(encoding='utf-8'))
c=m['capital']; price=m['market']['price']; checks=[]

def eq(a,b,label,tol=1e-8):
    assert abs(a-b)<=tol*max(1,abs(a),abs(b)),f'{label}: {a} != {b}'
    checks.append(label)

def claim_value(equity):
    n0=c['commonShares']+c['rsuShares']+c['performanceRsuShares']
    v=equity/n0
    for _ in range(30):
        itm=[o for o in c['options'] if v>o['strike']]
        n=n0+sum(o['shares'] for o in itm)
        proceeds=sum(o['shares']*o['strike'] for o in itm)
        v=(equity+proceeds)/n
    return v,n,proceeds

def reconstruct(a):
    prev=a['startRevenue2026']; rows=[]
    for i in range(10):
        rev=a['revenue2027'] if i==0 else prev*(1+a['growth'][i])
        ebit=rev*a['margins'][i]
        nopat=ebit-max(ebit,0)*a['tax']
        da=rev*.025; capex=da+rev*a['netCapexRatio']
        nwc=(rev-prev)*a['nwcRatio']; reinvest=capex-da+nwc
        rows.append(dict(revenue=rev,ebit=ebit,nopat=nopat,da=da,capex=capex,deltaNwc=nwc,reinvestment=reinvest,fcff=nopat-reinvest))
        prev=rev
    tn=rows[-1]['revenue']*(1+a['g'])*a['terminalMargin']*(1-a['tax'])
    tf=tn*(1-a['g']/a['terminalRoic'])
    tv=tf/(a['wacc']-a['g'])
    pe=sum(r['fcff']/(1+a['wacc'])**(i+1) for i,r in enumerate(rows))
    pt=tv/(1+a['wacc'])**10
    ev=pe+pt
    today=claim_value(ev+c['netNonoperatingAssets'])[0]
    ev5=sum(r['fcff']/(1+a['wacc'])**(i-4) for i,r in enumerate(rows) if i>=5)+tv/(1+a['wacc'])**5
    nc5=c['netNonoperatingAssets']+sum(r['fcff'] for r in rows[:5])
    p5=claim_value(ev5+nc5)[0]
    px=claim_value(rows[4]['ebit']*a['exitEbitMultiple']+nc5)[0]
    return dict(rows=rows,ev=ev,today=today,p2031=p5,cross2031=px,crossToday=px/(1+a['ke'])**5,pvTerminal=pt,pvExplicit=pe,terminalFcff=tf)

for s in m['scenarios']+[m['stress']]:
    a=s['assumptions']; r=reconstruct(a)
    assert a['wacc']>a['g'] and a['terminalRoic']>a['g']
    for i,(p,q) in enumerate(zip(r['rows'],s['rows'])):
        for k in p: eq(p[k],q[k],f"{s['id']} year{i+1} {k}")
    for k in ['today','ev','pvTerminal','pvExplicit']:eq(r[k],s['valuation'][k],s['id']+' '+k)
    eq(r['p2031'],s['fiveYear']['price'],s['id']+' horizon price')
    eq(r['cross2031'],s['crossCheck']['price2031'],s['id']+' cross horizon')
    eq(r['crossToday'],s['crossCheck']['today'],s['id']+' cross today')
    eq((r['p2031']/price)**.2-1,s['fiveYear']['cagr'],s['id']+' CAGR')
    eq(r['p2031']/price-1,s['fiveYear']['totalReturn'],s['id']+' return')
    cash=c['netNonoperatingAssets']+c['requiredOperatingCashReserve']
    for y,row in zip(s['liquidity'],r['rows']):
        cash+=row['fcff'];eq(cash,y['endingCashBeforeOptionalDistributions'],s['id']+' liquidity')
        assert cash>=c['requiredOperatingCashReserve'] and y['externalEquityNeeded']==0

base=m['scenarios'][1]
for row in m['sensitivity']:
    a=dict(base['assumptions'],wacc=row['wacc'],g=row['terminalGrowth'])
    eq(reconstruct(a)['today'],row['value'],'WACC/g sensitivity')

for rv in m['reverse']['results']:
    a=dict(base['assumptions'],revenue2027=rv['fixed2027Revenue'],growth=[0]+[rv['constant2028to2036Growth']]*9,margins=[rv['afterCompensationEbitMargin']]*10,terminalMargin=rv['afterCompensationEbitMargin'],wacc=rv['wacc'])
    r=reconstruct(a);eq(r['today'],price,'reverse price')
    eq(r['rows'][4]['revenue'],rv['result2031Revenue'],'reverse2031Revenue')

vref=min(base['valuation']['today'],base['crossCheck']['today'])
fref=min(base['fiveYear']['price'],base['crossCheck']['price2031'])
for e in m['entry']['stages']:
    eq(min(fref/(1+m['entry']['requiredReturn'])**5,vref*(1-e['margin'])),e['ceiling'],'entry '+e['stage'])
bridge=m['facts']['h1']['cashFlowBridge']
eq(sum(v for k,v in bridge.items() if k!='cfo'),bridge['cfo'],'cash flow GAAP bridge')
eq(250.371-116.371,134,'float exclusion approximate')
eq(134-20-9.534-1.665-.650,c['netNonoperatingAssets'],'capital bridge')
eq(m['facts']['ttm']['revenue'],251.663+182.238-116.737,'TTM revenue')
eq(m['facts']['ttm']['cfo'],46.752+164.441-14.990,'TTM CFO')
assert len({s['url'] for s in m['sources']})==len(m['sources'])
assert m['facts']['business']['currentSegments']==1
assert m['portfolio']['pendingLimitBuyUsd']==1080
eq(m['portfolio']['remainingTargetAfterCurrentAndPendingUsd'],400000*.01-1080,'remaining budget')
assert not any('probability' in s for s in m['scenarios'])
eq(m['facts']['annual'][0]['ebit'],-1.651,'2021 EBIT excludes PPP and interest')
eq(m['facts']['annual'][1]['basicShares'],27.278,'2022 original shares scaling')
assert m['market']['sourceId']=='quote-moomoo'
assert m['market']['timestampPrecision']=='minute'

now=datetime.now(timezone.utc).isoformat()
m['status']='verified-frozen';m['frozenAtUtc']=now
m['audit']={'independentLanguage':'Python','script':Path(__file__).name,'checks':len(checks),'passed':True,'at':now,'scope':'arithmetic, claims, timing convention, quote propagation and consistency; does not establish assumptions as facts'}
P.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
result={'passed':True,'checks':len(checks),'at':now,'modelSha256':hashlib.sha256(P.read_bytes()).hexdigest(),'quote':m['market'],'scenarios':[{**{'id':s['id']},**{k:s['valuation'][k] for k in ['today','terminalShareOfEv']},'p2031':s['fiveYear']['price'],'cagr':s['fiveYear']['cagr']} for s in m['scenarios']],'stress':{'today':m['stress']['valuation']['today'],'minCash':min(x['endingCashBeforeOptionalDistributions'] for x in m['stress']['liquidity'])},'entry':m['entry']}
(D/'inod-audit-evidence-2026-11-05.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=True,indent=2))
