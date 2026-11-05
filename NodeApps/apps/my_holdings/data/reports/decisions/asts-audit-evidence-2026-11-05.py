"""Independent reconstruction: reads only frozen candidate JSON, never imports builder.
Uses closed-form per-share future cash claims instead of builder's backwards recursion.
"""
import json,math,hashlib,itertools
from pathlib import Path
from datetime import datetime,timezone

P=Path(__file__).resolve().parent
F=P/'asts-evidence-model-2026-11-05.json'
M=json.loads(F.read_text(encoding='utf8')); C=M['methodology']; N=M['capital']['notes']; checks=[]; failures=[]

def eq(label,a,b,rel=2e-9,absolute=2e-6):
    if a is None or b is None:
        good=a is None and b is None
    elif isinstance(a,bool) or isinstance(b,bool):good=a==b
    else:good=math.isfinite(a) and math.isfinite(b) and math.isclose(a,b,rel_tol=rel,abs_tol=absolute)
    (checks if good else failures).append(dict(check=label,expected=b,recorded=a))

def calculate(a,mask,kw=None):
    z=kw or {};r=[];coh=[dict(c) for c in C['openingCohorts']]; ground=[]
    cash=C['openingCashM']+z.get('cash_delta',0);shares=C['startingFullyDilutedUnitsM'];nwc=C['openingOperatingNwcM']
    wip=z.get('wip_override',C['openingPaidSatelliteWipM']); trinity=C['trinityStartingPrincipalM'];funded=0
    for i,y in enumerate(range(2027,2037)):
        d={};pre_count=sum(c['count'] for c in coh);remaining=[];retired=0;dep=0
        for c in coh:
            if y-c['year']>=c['life']:
                retired+=c['count'];dep+=c['count']*c['unitCost']/c['life']*.5
            else:remaining.append(c);dep+=c['count']*c['unitCost']/c['life']
        coh=remaining
        new=a['fleet'][i]-sum(c['count'] for c in coh)
        unit=a['unitSatelliteCostM']*z.get('cost_scale',1)*(1+C['unitCostInflation'])**i
        gross=new*unit/(1-a['launchFailureCostRate']);credit=min(wip,gross);wip-=credit
        dep+=new*unit/a['satelliteLife']*.5
        coh.append(dict(year=y,count=new,unitCost=unit,life=a['satelliteLife']))
        ground_dep=C['initialGroundDaM']+(sum(ground)+a['groundCapexM'][i]/2)/C['groundAssetLife'];ground.append(a['groundCapexM'][i])
        da=dep+ground_dep
        user=a['usersM'][i]*z.get('user_multiplier',1);netarpu=a['retailMonthly']*a['astRevenueShare']
        sr=user*netarpu*12;revenue=sr+a['otherRevenueM'][i]
        spectrum=a['spectrumAnnualM']*1.02**i
        EBITDA=sr*(a['serviceContribution']+z.get('margin_delta',0))+a['otherRevenueM'][i]*a['otherContribution']-a['fixedOpexM'][i]-spectrum
        EBIT=EBITDA-da;opTax=max(0,EBIT)*C['taxRate'];new_nwc=C['nwcPctRevenue']*revenue;change=new_nwc-nwc;nwc=new_nwc
        capex=gross-credit+a['groundCapexM'][i]+C['otherSpectrumClosingCashM'][i]
        fcf=EBIT-opTax+da-capex-change-C['prepaymentNoncashRevenueM'][i]
        interest=trinity*C['trinityCashRate']+(C['trinityEndFeeM'] if y==2030 else 0)+(C['ubsAnnualNetSpreadM'] if y<=2028 else 0)
        debtpay=C['trinityPrincipalScheduleM'][i];trinity-=debtpay;converted=0
        for n,conv in zip(N,mask):
            if y<n['maturityYear']:interest+=n['principalM']*n['coupon']
            elif y==n['maturityYear']:
                interest+=n['principalM']*n['coupon']*n['maturityYearCoupons']/2
                if conv:converted+=n['principalM']*n['conversionRatePer1000']/1000
                else:debtpay+=n['principalM']
        tax=max(0,EBIT-interest)*C['taxRate'];release=8.4 if y==2028 else 0
        fcfe=fcf-interest+opTax-tax-debtpay+release
        before=cash+fcfe;required=max(0,C['minimumCashM']-before)/(1-C['equityIssueCost'])
        gross_equity=min(required,a['maxAnnualGrossEquityM'],max(0,a['maxTotalGrossEquityM']-funded));funded+=gross_equity
        net=gross_equity*(1-C['equityIssueCost']);px=a['equityIssuePrice'][i]*z.get('issue_price_scale',1);issued=gross_equity/px
        starting_shares=shares;shares+=issued+converted;after=before+net;gap=max(0,C['minimumCashM']-after)
        payout=max(0,after-C['minimumCashM']) if i>=5 and gap<1e-7 else 0
        cash_end=after-payout
        d.update(year=y,t=i+1,usersM=user,netMonthlyArpu=netarpu,serviceRevenueM=sr,revenueM=revenue,spectrumCashOpexM=spectrum,
          ebitdaM=EBITDA,satelliteDaM=dep,groundDaM=ground_dep,daM=da,ebitM=EBIT,operatingTaxM=opTax,taxM=tax,taxShieldM=opTax-tax,
          startFleet=pre_count,retiredSatellites=retired,newSatellites=new,endFleet=a['fleet'][i],unitSatelliteCostM=unit,
          grossSatelliteProcurementM=gross,prepaidWipUsedM=credit,remainingPrepaidWipM=wip,cashSatelliteCapexM=gross-credit,
          cashCapexM=capex,operatingNwcM=nwc,deltaNwcM=change,noncashPrepaidRevenueM=C['prepaymentNoncashRevenueM'][i],
          fcffM=fcf,interestCashM=interest,principalCashM=debtpay,fcfeBeforeNewEquityM=fcfe,startCashM=cash,cashBeforeEquityM=before,
          equityGrossNeededM=required,equityGrossM=gross_equity,equityNetM=net,equityFeeM=gross_equity-net,equityIssuePrice=px,
          equityIssuedSharesM=issued,noteConvertedSharesM=converted,startSharesM=starting_shares,endSharesM=shares,endCashM=cash_end,
          financingShortfallM=gap,distributionM=payout,distributionPerShare=payout/shares,financingGrossCumulativeM=funded)
        r.append(d);cash=cash_end
        if gap>1e-7:return dict(rows=r,failed=True,todayValue=0,year5Price=0)
    last=r[-1];g=a['terminalGrowth'];k=a['equityCost']
    maintsat=last['endFleet']*last['unitSatelliteCostM']*(1+g)/a['satelliteLife']/(1-a['launchFailureCostRate'])
    maintground=last['groundDaM']*(1+g);stable_da=maintsat+maintground
    stable_ebit=last['ebitdaM']*(1+g)-stable_da
    stable_tax=max(0,stable_ebit)*C['taxRate']
    assetbase=last['endFleet']*last['unitSatelliteCostM']*(1+g)+400+sum(a['groundCapexM'])
    growthcapex=g*assetbase;stable_capex=stable_da+growthcapex;dnwc=last['operatingNwcM']*g
    stable_fcf=stable_ebit-stable_tax+stable_da-stable_capex-dnwc
    terminal=max(0,stable_fcf/(k-g))+max(0,last['endCashM']-C['minimumCashM'])
    terminal_ps=terminal/last['endSharesM']
    prices={}
    for t in range(0,11):
        prices[t]=sum(row['distributionPerShare']/(1+k)**(row['t']-t) for row in r if row['t']>t)+terminal_ps/(1+k)**(10-t)
    consistent=[]
    for n,conv in zip(N,mask):
        row=r[n['maturityYear']-2027];p=prices[row['t']]+row['distributionPerShare']
        consistent.append(p>=n['conversionPrice']-1e-7 if conv else p<=n['conversionPrice']+1e-7)
    return dict(rows=r,failed=False,todayValue=prices[0],year5Price=prices[5],prices=prices,terminalEquityM=terminal,terminalPerShare=terminal_ps,
       terminalFCFFM=stable_fcf,terminalCapexM=stable_capex,terminalGrowthCapexM=growthcapex,terminalEconomicDaM=stable_da,terminalEbitM=stable_ebit,terminalTaxM=stable_tax,
       consistent=all(consistent),mask=list(mask))

def solve(a,kw=None):
    valid=[];fail=[]
    for mask in itertools.product([False,True],repeat=5):
        v=calculate(a,mask,kw)
        if v['failed']:fail.append(v)
        elif v['consistent']:valid.append(v)
    if valid:return min(valid,key=lambda r:r['todayValue'])
    if len(fail)==32:return fail[0]
    return None

# Capital and genuine TTM checks independent of scenario rows.
eq('economic shares',(M['capital']['economicCommonUnitsM']),(299789305+11215111+78163078)/1e6)
eq('current full units',C['startingFullyDilutedUnitsM'],M['capital']['economicCommonUnitsM']+12.159478)
eq('cash bridge',C['openingCashM'],2288.253+1131.14-111.4-600-120-35-30)
eq('june cash split',M['facts']['currentBalanceSheet']['totalCashIncludingRestrictedM'],2288.253+434.581)
eq('non UBS funded debt',M['capital']['nonUbsDebtModelStartM'],sum(n['principalM'] for n in N)+48.638)
eq('debt plus July',M['capital']['actualDebtPlusJulyGrossM'],M['capital']['actualDebtJune30M']+1150)
eq('noncash advance amortization',sum(C['prepaymentNoncashRevenueM']),266.933)
eq('Trinity principal schedule',sum(C['trinityPrincipalScheduleM']),48.638)
eq('TTM revenue',M['facts']['ttm']['revenueM'],70.918+46.255-1.874)
eq('TTM EBIT',M['facts']['ttm']['ebitM'],(70.918-358.631)+(46.255-493.244)-(1.874-137.634))
eq('TTM consolidated NI',M['facts']['ttm']['netLossConsolidatedM'],-461.011-549.5+199.531)
eq('TTM parent NI',M['facts']['ttm']['netLossParentCommonM'],-341.940-421.921+145.100)
eq('TTM CFO',M['facts']['ttm']['cfoM'],-71.517-145.212+72.024)
eq('TTM CapEx',M['facts']['ttm']['cashCapexM'],1064.741+859.215-430.622)
eq('TTM reported FCF',M['facts']['ttm']['reportedFcfM'],(-71.517-145.212+72.024)-(1064.741+859.215-430.622))
for n in N:
    eq('strike '+n['id'],n['conversionPrice'],1000/n['conversionRatePer1000'])
    eq('convert shares '+n['id'],n['conversionSharesM'],n['principalM']*n['conversionRatePer1000']/1000)

summaries=[]
for s in M['scenarios']:
    a=s['assumptions'];v=solve(a)
    assert v is not None
    eq(s['id']+' failure',s['failed'],v['failed'])
    eq(s['id']+' rowcount',len(s['rows']),len(v['rows']))
    for actual,calc in zip(s['rows'],v['rows']):
        for field,num in calc.items():eq(f"{s['id']} {calc['year']} {field}",actual[field],num)
        eq('gross issuance share cash '+str(calc['year']),actual['equityIssuedSharesM']*actual['equityIssuePrice'],actual['equityGrossM'])
        eq('cash conservation '+str(calc['year']),actual['startCashM']+actual['fcfeBeforeNewEquityM']+actual['equityNetM']-actual['distributionM'],actual['endCashM'])
        eq('no double note principal/stock '+str(calc['year']),sum(e['principalM'] for e in actual['noteEvents'] if e['treatment']=='cash principal')+actual['trinityPrincipalM'],actual['principalCashM'])
    for f in ['todayValue','year5Price']:eq(s['id']+' '+f,s[f],v[f])
    eq(s['id']+' totalReturn',s['totalReturn'],v['year5Price']/M['market']['price']-1)
    eq(s['id']+' CAGR',s['cagr'],(v['year5Price']/M['market']['price'])**.2-1 if not v['failed'] else -1)
    second=s['secondMethod']
    if not v['failed']:
        for f,cf in [('equityValueM','terminalEquityM'),('perShare','terminalPerShare'),('fcffM','terminalFCFFM'),('totalCapexM','terminalCapexM'),('growthCapexM','terminalGrowthCapexM'),('economicDaM','terminalEconomicDaM'),('ebitM','terminalEbitM'),('taxM','terminalTaxM')]:eq(s['id']+' terminal '+f,s['terminal'][f],v[cf])
        eq(s['id']+' reserve not distributable',s['terminal']['surplusCashM'],max(0,s['rows'][-1]['endCashM']-500))
        row=v['rows'][4];converted=second['fullyConvertedForEps'];ishares=sum(n['conversionSharesM'] for n in N if n['id'] in converted)
        coupons=sum(n['principalM']*n['coupon'] for n in N if n['id'] not in converted)
        ni=max(0,(row['ebitM']-coupons)*(1-C['taxRate']))
        ps=(ni*a['exitPE']+max(0,row['endCashM']-500))/(row['endSharesM']+ishares)
        eq(s['id']+' P/E earnings',second['netIncomeM'],ni);eq(s['id']+' P/E2031',second['year5Price'],ps);eq(s['id']+' P/E today',second['todayValue'],ps/(1+a['equityCost'])**5)
        for n in N:eq(s['id']+' PE convert logic '+n['id'],n['id'] in converted,ps>=n['conversionPrice'])
        for j,p in v['prices'].items():
            if j>=1:eq(s['id']+' owner value at '+str(j),s['priceAfterDistributionByYear'][str(2026+j)],p)
        for c in s['maturityChecks']:eq(s['id']+' maturity consistent '+c['id'],c['consistent'],True)
        eq(s['id']+' positive terminal CF',v['terminalFCFFM']>0,True)
        eq(s['id']+' g below Ke',a['terminalGrowth']<a['equityCost'],True)
    else:
        eq(s['id']+' actual stop cash',s['stopCashM'],v['rows'][-1]['endCashM'])
        eq(s['id']+' hard negative vs reserve',s['hardNegativeCash'],v['rows'][-1]['endCashM']<0)
    summaries.append(dict(id=s['id'],todayValue=v['todayValue'],year5Price=v['year5Price'],endSharesM=v['rows'][-1]['endSharesM'],equityGrossM=v['rows'][-1]['financingGrossCumulativeM'],failed=v['failed']))

base=M['scenarios'][1]['assumptions']
for cell in M['stress']['baseKeGMatrix']:
    v=solve({**base,'equityCost':cell['equityCost'],'terminalGrowth':cell['g']})
    eq('sensitivity today',cell['todayValue'],v['todayValue']);eq('sensitivity year5',cell['year5Price'],v['year5Price'])
for case in M['stress']['linkedOperatingAndFinancingStress']:
    v=solve(base,case['inputs'])
    if v is None:
        eq('stress indeterminate '+case['name'],case['todayValue'],None)
    else:
        for f in ['todayValue','year5Price']:eq('stress '+case['name']+' '+f,case[f],v[f])
        eq('stress cash '+case['name'],case['endingCashM'],v['rows'][-1]['endCashM'])

# Independently solve reverse via bisection (not reading builder's reverse rows as a result).
left=.01;right=10
for _ in range(70):
    mid=(left+right)/2;v=solve(base,{'user_multiplier':mid})
    assert v is not None
    if v['todayValue']<M['market']['price']:left=mid
    else:right=mid
mult=(left+right)/2;eq('reverse multiplier',M['reverse']['userMultiplier'],mult)
eq('reverse users2031',M['reverse']['users2031M'],50*mult)
eq('reverse target price',M['reverse']['todayValueReconstructed'],M['market']['price'])
for row in M['capacityRequirementCrosscheck']['rows']:
    gbps=row['paidEquivalentUsersM']*1e6*row['monthlyGbPerUser']*8/(30*24*3600)
    eq('demand globalGbps',row['meanGlobalGbps'],gbps)
    eq('demand per sat',row['requiredGrossGbpsPerUsefulSatellite'],gbps/(row['fleet']*.30*.75))

if failures:
    output=dict(status='failed',checksPassed=len(checks),failures=failures)
else:
    M['status']='verified-frozen'
    M['audit']=dict(status='passed',method='Independent Python reconstruction from JSON inputs; no builder import; closed-form owner claims instead of recursive price calculation.',checksPassed=len(checks),auditedAtUtc=datetime.now(timezone.utc).isoformat(),limitationsPreserved=True)
    F.write_text(json.dumps(M,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf8')
    output=dict(status='passed',modelFile=F.name,modelSha256=hashlib.sha256(F.read_bytes()).hexdigest(),auditedAtUtc=datetime.now(timezone.utc).isoformat(),checksPassed=len(checks),failures=[],summaries=summaries,
      scope=['Capital economicunits and debt/cash matches','Original-statement TTM','Every annual operating/FCFF/cash/debt/equity row','Gross issuance vs net cash and fees','Per-year future shareholder ownership','No principal plus conversion double claim','Terminal reserve/growth/replacement reinvestment','Independent matureP/E','All sensitivity cells and null-indeterminate stress','Reverse DCF and capacity math'],
      limitations=M['limitations'])
(P/'asts-audit-evidence-2026-11-05.json').write_text(json.dumps(output,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf8')
print(json.dumps(output,ensure_ascii=False,indent=2)[:16000])
if failures:raise SystemExit(1)
