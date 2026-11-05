"""Independent Python audit of parent's self-consistent equity-financing supplement.
Does not read/import/execute the parent's JavaScript. Does not mutate the frozen model.
Reuses only the independently authored Python cash/cohort reconstruction function,
then solves the financing fixed point analytically by aggregate cash claims, not
by copying the parent's simultaneous-price iteration.
"""
import ast,copy,hashlib,itertools,json,math
from pathlib import Path
from datetime import datetime,timezone

P=Path(__file__).resolve().parent
BASE=P/'asts-evidence-model-2026-11-05.json'
ART=P/'asts-fair-financing-2026-11-05.json'
base_bytes=BASE.read_bytes(); artifact_bytes=ART.read_bytes()
model=json.loads(base_bytes); artifact=json.loads(artifact_bytes)
C=model['methodology'];N=model['capital']['notes'];checks=[];failures=[]

def check(label,actual,expected,abs_tol=3e-6,rel_tol=1e-8):
    if isinstance(actual,(int,float)) and isinstance(expected,(int,float)) and not isinstance(actual,bool) and not isinstance(expected,bool):
        ok=math.isfinite(actual) and math.isfinite(expected) and math.isclose(actual,expected,abs_tol=abs_tol,rel_tol=rel_tol)
    else:ok=actual==expected
    (checks if ok else failures).append(dict(check=label,recorded=actual,reconstructed=expected))

# Load function definitions only: no top-level execution, no original-audit file writes.
independent_source=P/'asts-audit-evidence-2026-11-05.py'
tree=ast.parse(independent_source.read_text(encoding='utf8'))
functions=[node for node in tree.body if isinstance(node,ast.FunctionDef) and node.name=='calculate']
assert len(functions)==1
scope=dict(C=C,N=N,itertools=itertools)
exec(compile(ast.Module(body=functions,type_ignores=[]),str(independent_source),'exec'),scope)
reconstruct=scope['calculate']

a=artifact['assumptions'];original=model['scenarios'][1]['assumptions']
for key in original:
    if key!='equityIssuePrice':check('unchanged assumption '+key,a[key],original[key])

cash_case=reconstruct(a,[False]*5)
check('solvent modeled reserve path',cash_case['failed'],False)
rows=cash_case['rows'];k=a['equityCost'];terminal=cash_case['terminalEquityM']
check('parent full row count',len(artifact['result']['rows']),len(rows))
for parent,indep in zip(artifact['result']['rows'],rows):
    for key in parent:
        if key in indep and isinstance(parent[key],(int,float)) and not isinstance(parent[key],bool):
            check(f"period{parent['year']} {key}",parent[key],indep[key])
    check(f"{parent['year']} net cash vs gross fee",parent['equityNetM'],parent['equityGrossM']*.97)
    check(f"{parent['year']} issued stock paid gross",parent['equityIssuedSharesM']*parent['equityIssuePrice'],parent['equityGrossM'])
    check(f"{parent['year']} separate interest + principal",indep['fcfeBeforeNewEquityM'],indep['fcffM']-indep['interestCashM']+indep['taxShieldM']-indep['principalCashM']+(8.4 if parent['year']==2028 else 0))
    check(f"{parent['year']} cash conservation",indep['endCashM'],indep['startCashM']+indep['fcfeBeforeNewEquityM']+indep['equityNetM']-indep['distributionM'])

# Under fair future issuance, current owners' aggregate claim equals all future
# distributions + terminal equity - gross contributions of future equity investors.
# Fees are already in the gross/net funding waterfall; using NET contributions here
# would incorrectly leave issuance costs borne by somebody other than shareholders.
aggregate={}
for t in range(0,11):
    aggregate[t]=sum((r['distributionM']-r['equityGrossM'])/(1+k)**(r['t']-t) for r in rows if r['t']>t)+terminal/(1+k)**(10-t)

# Reconstruct exact fair issue prices forward from independently derived aggregate
# post-financing value: P=(Vpost-GrossNewMoney)/OldShares. This directly solves all
# four simultaneous fixed-point equations, without using the artifact's prices.
shares=C['startingFullyDilutedUnitsM'];fair_prices=[];fair_shares={};fair_marks={};funding=[]
for r in rows:
    old=shares;gross=r['equityGrossM'];post=aggregate[r['t']]
    if gross>0:
        price=(post-gross)/old
        check(f"{r['year']} positive financing value",price>0,True)
        new=gross/price;shares+=new
        funding.append(dict(year=r['year'],grossM=gross,netM=r['equityNetM'],feeM=gross-r['equityNetM'],
          issuePrice=price,newSharesM=new,oldSharesM=old,postSharesM=shares,postMoneyEquityValueM=post,
          fixedPointResidual=post/shares-price,oldHolderValuePreIssueM=post-gross))
        check(f"{r['year']} analytic fixed issue price",r['equityIssuePrice'],price)
        check(f"{r['year']} post-money value equals issue price",post/shares,price,abs_tol=1e-10,rel_tol=1e-12)
    else:price=a['equityIssuePrice'][r['t']-1]
    fair_prices.append(price);fair_shares[r['year']]=shares;fair_marks[r['year']]=post/shares
    check(f"{r['year']} analytic dynamic shares",r['endSharesM'],shares)

exact_a=copy.deepcopy(a);exact_a['equityIssuePrice']=fair_prices
exact=reconstruct(exact_a,[False]*5)
check('analytic terminal equity',artifact['result']['terminalEquity'],exact['terminalEquityM'])
check('terminal capex still funded',artifact['result']['terminalFcfe'],exact['terminalFCFFM'])
check('terminal excludes mandatory500m cash reserve',exact['rows'][-1]['endCashM'],500)
check('terminal growth strictly below Ke',exact_a['terminalGrowth']<exact_a['equityCost'],True)

today=aggregate[0]/C['startingFullyDilutedUnitsM']
p5=aggregate[5]/fair_shares[2031]
check('fair today aggregate formula',artifact['result']['todayValue'],today)
check('fair2031 aggregate formula',artifact['result']['year5Price'],p5)
# An independent second identity uses actual future per-share ownership rather
# than aggregate new-money subtraction, catching post2031 dilution errors.
owner_today=sum(r['distributionM']/fair_shares[r['year']]/(1+k)**r['t'] for r in rows)+terminal/fair_shares[2036]/(1+k)**10
owner_p5=sum(r['distributionM']/fair_shares[r['year']]/(1+k)**(r['t']-5) for r in rows if r['t']>5)+terminal/fair_shares[2036]/(1+k)**5
check('owner per-share today identity',today,owner_today,abs_tol=1e-9,rel_tol=1e-10)
check('owner per-share2031 identity',p5,owner_p5,abs_tol=1e-9,rel_tol=1e-10)
check('not terminal divided by stale2031shares',fair_shares[2036]>fair_shares[2031],True)
check('funding unchanged',rows[-1]['financingGrossCumulativeM'],model['scenarios'][1]['rows'][-1]['financingGrossCumulativeM'])

for n in N:
    year=n['maturityYear'];row=next(r for r in exact['rows'] if r['year']==year)
    common=fair_marks[year]+row['distributionM']/fair_shares[year]
    check('cash-note treatment rational at maturity '+n['id'],common<n['conversionPrice'],True)
    check('no note shares plus cash principal '+n['id'],row['noteConvertedSharesM'],0)
for year,p in artifact['result']['priceByYear'].items():check('future price '+str(year),p,fair_marks[int(year)])

# Independent2031 mature earnings crosscheck, including all-note coupons because
# resulting price remains below every legal conversion strike.
row5=exact['rows'][4];annual_coupon=sum(n['principalM']*n['coupon'] for n in N)
net_income=max(0,row5['ebitM']-annual_coupon)*(1-C['taxRate'])
excess=max(0,row5['endCashM']-C['minimumCashM'])
pe_price=(net_income*a['exitPE']+excess)/fair_shares[2031]
pe_today=pe_price/(1+k)**5
check('PE2031 earnings',artifact['secondMethod']['ni'],net_income)
check('PE2031 shares',artifact['secondMethod']['shares'],fair_shares[2031])
check('PE2031 price',artifact['secondMethod']['year5Price'],pe_price)
check('PEtoday price',artifact['secondMethod']['todayValue'],pe_today)
check('PE all-note debt treatment',pe_price<min(n['conversionPrice'] for n in N),True)

# Independently perform a second fixed-point computation from different issue
# prices, as an iterative numerical crosscheck on the analytic solution.
iter_a=copy.deepcopy(original)
iter_a['equityIssuePrice']=[5.0]*10
iteration_log=[]
for step in range(1,301):
    value=reconstruct(iter_a,[False]*5)
    assert not value['failed']
    update=iter_a['equityIssuePrice'][:]
    residual=0
    for rr in value['rows']:
        if rr['equityGrossM']>0:
            idx=rr['t']-1;p=value['prices'][rr['t']]
            residual=max(residual,abs(p-update[idx]));update[idx]=p
    iter_a['equityIssuePrice']=update
    if step in [1,10,25,50,75,100] or residual<1e-10:iteration_log.append(dict(step=step,maxAbsolutePriceResidual=residual,todayValue=value['todayValue']))
    if residual<1e-10:break
for f in funding:check('independent iteration price '+str(f['year']),iter_a['equityIssuePrice'][f['year']-2027],f['issuePrice'],abs_tol=1e-8,rel_tol=1e-9)
check('independent iteration converged',residual<1e-10,True)

units=fair_shares[2036];llc_paired=model['capital']['classBSharesM']+model['capital']['classCSharesM']
equivalent_a=units-llc_paired;authorized=model['capital']['authorizedSharesM']['A']
shortfall=units-authorized;available=authorized-equivalent_a
authorization=dict(
 status='conditional-path-needs-authorization-or-revised-capital-plan',
 currentAuthorizedClassAM=authorized,modeledEconomicClaims2036M=units,
 classAProxyIfLLCPairedUnitsRemainUnexchangedM=equivalent_a,
 classAUnissuedCapacityAfterThatProxyM=available,pairedLLCExchangeClaimsM=llc_paired,
 allExchangeAndExistingProbableAwardCapacityShortfallM=shortfall,
 conclusion='877.503m经济claims不等于现在实际发行A股，但此新增股融资路径在保留89.378mLLC单位兑换所需A股后超过现800m授权约77.503m。单看实际A约788.124m低于800m会漏掉合同兑换储备。执行前须取得充分新增A授权及所需股东批准，或明确改用库存/购入A/符合合同的现金交换/另一资本路径并重算现金与股数。数学收敛不是融资与授权已落实。',
 contractSections=['11.5 ClassA redemption share reservation','11.1.2 CashSettlement limited to net proceeds of dedicated ClassA issuance'],
 sources=[dict(id='operating-agreement',title='Fifth Amended and Restated LLC Operating Agreement; incorporated as FY2025 10KExhibit10.8',url='https://www.sec.gov/Archives/edgar/data/1780312/000149315221008574/ex10-5.htm',date='2021-04-06 agreement;SEC2021-04-12;still referenced2026-03-02',raw='asts-2021-operating-agreement-ex10-5.txt'),
 dict(id='q2-10q',url='https://www.sec.gov/Archives/edgar/data/1780312/000119312526342550/asts-20260630.htm',date='2026-08-10',note='Note9 A800m authorized, UpC1:1exchange and cash restriction; no presumed future charter amendment.')],
 caveat='§11.5也容许交付已购入/库存A或现金结算，不应把800m描述为永远不可改变的企业股数上限；替代方案必须有相应资金/授权/合同依据，本模型均未落实。此检查不推断未来投票必获批准。')

check('full exchange over current authorization',units>authorized,True)
check('A-only appearance under authorization',equivalent_a<authorized,True)
check('LLC reservation exceeds residual authorization',llc_paired>available,True)

# A contractual date nuance in the pre-existing frozen research schedule: the
# Sep25,2025 S-band closing's second/third anniversaries fall in2027/2028.
# Shifting the10m aggregate payment earlier (2029 to2027) affects only ample
# pre-funding cash, not total need at the first2029 funding date or any valuation.
corrected_C=copy.deepcopy(C)
corrected_C['otherSpectrumClosingCashM'][0]+=10
corrected_C['otherSpectrumClosingCashM'][2]-=10
corrected_scope=dict(C=corrected_C,N=N,itertools=itertools)
exec(compile(ast.Module(body=functions,type_ignores=[]),str(independent_source),'exec'),corrected_scope)
corrected=corrected_scope['calculate'](exact_a,[False]*5)
check('anniversary timing2027 cash',corrected['rows'][0]['endCashM'],exact['rows'][0]['endCashM']-10)
check('anniversary timing2028 cash',corrected['rows'][1]['endCashM'],exact['rows'][1]['endCashM']-10)
check('anniversary timing aggregate financing unaffected',corrected['rows'][-1]['financingGrossCumulativeM'],exact['rows'][-1]['financingGrossCumulativeM'])
check('anniversary timing present value unaffected',corrected['todayValue'],exact['todayValue'])
check('anniversary timing2031 value unaffected',corrected['year5Price'],exact['year5Price'])
timing_observation=dict(status='contractual-timing-refinement-no-valuation-impact-in-this-model',
 sourceUrl='https://www.sec.gov/Archives/edgar/data/1780312/000178031226000006/asts-20251231.htm',sourceSection='Note15 GlobalS-bandSpectrumPriorityRightsAcquisition',
 fact='2025-09-25closing;10msecondanniversary2027-09-25;10mthirdanniversary2028-09-25.',
 researchScheduleIssue='Frozen base annual research convention endsNov4; its2028/2029anniversary payment schedule is a research timing approximation, not contractual due dates. Move10m from2029to2027 to align the two anniversary payments to2027/2028.',
 cash2027CorrectedM=corrected['rows'][0]['endCashM'],cash2028CorrectedM=corrected['rows'][1]['endCashM'],
 effect='Each first-two-year cash balance10m lower, both safely above500m modeled reserve; cumulative cash before2029funding then catches up. With no modeled cash-interest income, financing/shares/today/2031value unchanged. Frozen files preserved; any report of contractual payment dates should use2027/2028.')

check('freeze preserved byte for byte',hashlib.sha256(BASE.read_bytes()).hexdigest(),hashlib.sha256(base_bytes).hexdigest())
market=model['market']['price']
result=dict(status='passed' if not failures else 'failed',auditedAtUtc=datetime.now(timezone.utc).isoformat(),
 parentArtifact=dict(file=ART.name,sha256=hashlib.sha256(artifact_bytes).hexdigest(),statusAtRead=artifact['status']),
 baseFrozenModel=dict(file=BASE.name,sha256=hashlib.sha256(base_bytes).hexdigest(),modified=False),
 independentEngine=dict(file=independent_source.name,sha256=hashlib.sha256(independent_source.read_bytes()).hexdigest(),
   note='Only prior independently authored Python calculate function AST compiled; no top-level execution, no parentJS imported/read/executed. Financing fixed point additionally solved analytically and by fresh iteration starting all issueprices5.'),
 checksPassed=len(checks),failures=failures,
 analyticalMethod='Vpost(t)=PV_t[future distributions − future gross equity subscriptions + terminal equity]; at a funding date P=(Vpost−currentGrossNewMoney)/priorShares; newShares=Gross/P. Cross-check actual future per-share distributions and terminal ownership separately. Issuance fees remain in cash financing need and gross subscription claim.',
 reconstructed=dict(todayValue=today,year5Price=p5,ownerIdentityToday=owner_today,ownerIdentity2031=owner_p5,
  shares2031M=fair_shares[2031],shares2036M=fair_shares[2036],grossNewEquityM=rows[-1]['financingGrossCumulativeM'],
  post2031GrossEquityM=sum(r['equityGrossM'] for r in rows if r['t']>5),
  totalReturn2031=p5/market-1,cagr2031=(p5/market)**.2-1,terminalPvFraction=(terminal/fair_shares[2036]/(1+k)**10)/today,
  secondMethod=dict(year5Price=pe_price,todayValue=pe_today,netIncomeM=net_income,pe=a['exitPE'],sharesM=fair_shares[2031],excessCashM=excess,totalReturn2031=pe_price/market-1,cagr2031=(pe_price/market)**.2-1)),
 financing=funding,futurePriceByYear=fair_marks,independentIteration=dict(initialIssuePrices=[5]*10,steps=step,lastMaxAbsolutePriceResidual=residual,log=iteration_log),
 authorization=authorization,contractualTimingObservation=timing_observation,
 limitations=['Mathematical finance/ownership consistency only. Future commercial capacity, netARPU, customer conversion, cash bridge and WIP credit remain unverified research assumptions.',
  'Fair-value issuance availability, current-authorized-share adequacy and future shareholder approval are not established.3%issuance fees and research liquidity reserve maintained.',
  'Annual maturity proxy and no capped-call recoveries retained; no additional net debt or NCIbook deduction from FCFE.',
  'IndependentP/E shares the operating hypotheses; it is a different capitalization lens, not independent proof of the commercial forecast.',
  'No probabilities invented; no modifications to frozen base model, positions, orders, price store, applicationstate or jobs. No browser tab opened.'])
out=P/'asts-fair-financing-independent-audit-2026-11-05.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf8')
print(json.dumps(result,ensure_ascii=False,indent=2)[:24000])
if failures:raise SystemExit(1)
