"""Authoritative FCFE model. The earlier RIM model is a rejected prototype."""
import json, math, copy, hashlib
from pathlib import Path

OUT=Path(__file__).resolve().parent
seed=json.loads((OUT/'hood-prototype-rim-model-2026-11-05.json').read_text(encoding='utf8'))
A=copy.deepcopy(seed['anchors'])
A['sources']=['2026 Q3 Form 10-Q filed 2026-10-28','Amended Exhibit 99.1 filed 2026-10-28']
A['quote']=87.33
P={n:copy.deepcopy(v['parameters']) for n,v in seed['paths'].items()}
for n,c in [('bear',2.0),('base',1.5),('bull',1.3)]: P[n]['capitalRevenueRatio']=c
Q=A['basicShares']+A['existingUnvestedRsu']+A['existingUnvestedPsu']
WNET=A['warrants']*max(1-A['warrantStrike']/A['quote'],0)
SHARES=Q+WNET

def allocate(equity5,k):
    price5=max(0,equity5/SHARES)
    conversion_proxy=price5/(1+k)**2
    premium=A['convertPrincipal']/A['convertStrike']*max(conversion_proxy-A['cappedCallCap'],0)
    return {'todayValue':price5/(1+k)**5,'year5Price':price5,'shares':SHARES,
      'returnAtQuote':(price5/A['quote'])**.2-1,'totalReturnAtQuote':price5/A['quote']-1,
      'netWarrantSharesReserved':WNET,'warrantExerciseProceedsCredited':0,
      'conversionPriceProxyYear3':conversion_proxy,'unmodeledNetConvertiblePremium':premium,
      'convertibleAssumptionPass':premium==0}

def model(p,scale=1,margin_shift=0,service_shift=0,tax_shift=0,loss1=0,capital_multiplier=1):
    k=p['ke'];g=p['g'];assert k>g
    revenue=p['firstRevenue']*scale;capital=A['parentBook'];cash=0;minimum=0;rows=[]
    for i in range(10):
      if i: revenue*=1+p['growth'][i-1]
      comp=revenue*(p['futureServiceCostPct'][i]+service_shift)
      pre_comp=revenue*(p['preCompPretaxMargins'][i]+margin_shift)
      amort=A['unamortizedIssuanceCost']/3 if i<3 else 0
      # Cash-funded repayment cancels an already booked debt liability against
      # a 3.5%-yield financing asset. No second principal/equity deduction.
      lost_interest=A['convertPrincipal']*.035 if i>=3 else 0
      pretax=pre_comp-comp-amort-lost_interest
      taxes=max(pretax,0)*(p['tax']+tax_shift)
      group=pretax-taxes;nci=max(group,0)*p['nciProfitShare']
      earnings=group-nci-(loss1 if i==0 else 0)
      opening=capital
      capital=max(A['parentBook'],p['capitalRevenueRatio']*capital_multiplier*revenue)
      increase=capital-opening
      fcfe=earnings-increase
      # Negative owner cash flow uses accumulated cash first. A negative
      # balance is an explicit funding gap, never silently clipped to zero.
      if i<5: cash+=fcfe
      elif fcfe<0: cash+=fcfe
      minimum=min(minimum,cash)
      rows.append({'t':i+1,'year':2027+i,'revenue':revenue,'preFutureServicePretaxMargin':p['preCompPretaxMargins'][i]+margin_shift,
       'futureNewServiceCashCompensation':comp,'pretax':pretax,'normalTax':taxes,'nciEarnings':nci,
       'parentEconomicEarnings':earnings,'requiredCapitalOpening':opening,'requiredCapitalClosing':capital,
       'capitalIncrease':increase,'ownerFcfe':fcfe,'surplusBalance':cash,
       'distributionAfterYear5':max(fcfe,0) if i>=5 else 0,
       'debtAmortization':amort,'lostInterestAfterPrincipalRepayment':lost_interest,
       'roeOnOpeningRequiredCapital':earnings/opening})
    # At terminal date the capital floor itself also grows at g. This is a
    # conservative explicit rule even if revenue has not escaped the floor.
    ni11=rows[-1]['parentEconomicEarnings']*(1+g)
    reinvest=g*capital;fcfe11=ni11-reinvest
    assert fcfe11>0
    tv=fcfe11/(k-g)
    franchise5=sum(r['ownerFcfe']/(1+k)**(r['t']-5) for r in rows[5:])+tv/(1+k)**5
    retained5=rows[4]['surplusBalance']
    equity5=franchise5+retained5
    primary=allocate(equity5,k)
    earnings_method=allocate(rows[4]['parentEconomicEarnings']*p['pe5']+retained5,k)
    standard=sum(r['ownerFcfe']/(1+k)**r['t'] for r in rows)+tv/(1+k)**10
    return {'parameters':copy.deepcopy(p),'scale':scale,'capitalMultiplier':capital_multiplier,'rows':rows,
      'primary':primary,'earningsMultiple':earnings_method,'retainedSurplus5':retained5,
      'franchiseDcf5':franchise5,'unallocatedEquity5':equity5,
      'standardImmediatelyDistributableFcfeToday':standard,
      'zeroYieldRetentionDrag':standard-equity5/(1+k)**5,
      'unfundedEquityNeed':max(-minimum,0),'fundingAssumptionPass':minimum>=-1e-8,
      'terminal':{'ownerFcfe':fcfe11,'economicEarnings':ni11,'requiredCapital':capital,
       'roe':ni11/capital,'reinvestmentFraction':reinvest/ni11,'payoutFraction':1-reinvest/ni11,
       'equity':tv,'impliedPe':tv/ni11,'impliedPriceBook':tv/capital,
       'pvTerminalShareOfToday':tv/(1+k)**10/(equity5/(1+k)**5)}}

results={n:model(p) for n,p in P.items()}
assert all(v['fundingAssumptionPass'] and v['primary']['convertibleAssumptionPass'] and v['earningsMultiple']['convertibleAssumptionPass'] for v in results.values())
b=results['base'];ref=min(b['primary']['todayValue'],b['earningsMultiple']['todayValue']);future=min(b['primary']['year5Price'],b['earningsMultiple']['year5Price'])
return_limit=future/1.15**5
highs=[math.floor(min(ref*(1-m),return_limit)*100)/100 for m in [.25,.35,.45]]
entries=[{'tier':'observation','low':round(highs[1]+.01,2),'high':highs[0],'budgetSharePct':25},
 {'tier':'safety','low':round(highs[2]+.01,2),'high':highs[1],'budgetSharePct':35},
 {'tier':'discount','low':math.ceil(ref*.35*100)/100,'high':highs[2],'budgetSharePct':40}]
assert all(e['low']<=e['high'] for e in entries)
lo=0;hi=1.5
for _ in range(100):
 mid=(lo+hi)/2
 if model(P['base'],margin_shift=mid)['primary']['todayValue']<A['quote']:lo=mid
 else:hi=mid
reverse=model(P['base'],margin_shift=(lo+hi)/2)
assert reverse['primary']['convertibleAssumptionPass']
max_feasible_shift=1-max(P['base']['preCompPretaxMargins'])
feasible_reverse=model(P['base'],margin_shift=max_feasible_shift)
sensitivity=[]
for k in [.105,.115,.125,.135,.145]:
 vals=[]
 for g in [.02,.025,.03,.035,.04]:
  p=copy.deepcopy(P['base']);p.update(ke=k,g=g);v=model(p)
  vals.append({'g':g,'todayValue':v['primary']['todayValue']})
 sensitivity.append({'ke':k,'values':vals})
capital_sensitivity=[]
for c in [1,1.3,1.5,1.7,2,2.2]:
 p=copy.deepcopy(P['base']);p['capitalRevenueRatio']=c;v=model(p)
 capital_sensitivity.append({'capitalRevenueRatio':c,'todayValueBeforeFundingAdjustment':v['primary']['todayValue'],
  'fundingAssumptionPass':v['fundingAssumptionPass'],'unfundedEquityNeed':v['unfundedEquityNeed']})
stress={
 'revenueMinus20MarginMinus5pp':model(P['base'],scale=.8,margin_shift=-.05),
 'futureServiceCompPlus3pp':model(P['base'],service_shift=.03),
 'normalTaxPlus5pp':model(P['base'],tax_shift=.05),
 'requiredCapitalPlus25pct':model(P['base'],capital_multiplier=1.25),
 'cashCreditOperationalLoss2500':model(P['bear'],loss1=2500)}
full_reserve=A['basicShares']+A['existingUnvestedRsu']+A['existingUnvestedPsu']+A['warrants']
output={'version':2,'model':'FCFE with explicit required economic capital; authoritative final model',
 'analysisDate':'2026-11-05','anchors':A,'paths':results,
 'purchase':{'requiredAnnualReturn':.15,'referenceToday':ref,'referenceYear5':future,'maxByReturn':return_limit,'entries':entries},
 'reverse':{'fixedRevenueAndCapitalPath':True,'requiredUniformPretaxMarginIncrease':(lo+hi)/2,
  'peakRequiredPreCompPretaxMargin':max(P['base']['preCompPretaxMargins'])+(lo+hi)/2,
  'economicallyFeasibleWithin100pctMargin':(lo+hi)/2<=max_feasible_shift,
  'maxFeasibleUniformShift':max_feasible_shift,'todayValueAt100pctPeakPreCompMargin':feasible_reverse['primary']['todayValue'],
  'todayValueAtUnconstrainedMathematicalRoot':reverse['primary']['todayValue'],'unfundedEquityNeedAtRoot':reverse['unfundedEquityNeed'],
  'requiredPe5AtKe':(A['quote']*(1+P['base']['ke'])**5*SHARES-b['retainedSurplus5'])/b['rows'][4]['parentEconomicEarnings'],
  'requiredPe5For15pctReturn':(A['quote']*1.15**5*SHARES-b['retainedSurplus5'])/b['rows'][4]['parentEconomicEarnings']},
 'sensitivity':sensitivity,'capitalSensitivity':capital_sensitivity,'stresses':stress,
 'grossWarrantReserveSensitivity':{'shares':full_reserve,'baseToday':b['unallocatedEquity5']/full_reserve/(1+P['base']['ke'])**5,
  'baseYear5':b['unallocatedEquity5']/full_reserve},
 'scope':[
  '金额百万美元、股数百万股；2027-2036表示分析日起十个近似12个月研究期间，非公司FY指引。财务锚点仍为2026-09-30，未编造11月实际余额。',
  '当前归母权益10001全部作为初始必要资本；不另加集团现金、投资、客户资产或监管超额资本，不再次减已经入账债务。',
  '所需资本K=max(10001,c×收入)为研究经济资本预算，不是监管最低资本；c低于现时B/TTM收入1.968意味着资本效率改善，非已被证明的事实。衰退不释放初始资本；终值资本floor也按g增长。',
  '经济盈利以正常税与全周期信用/经营成本计，6.4m旧奖分配一次；8%等未来薪酬是未来新增服务报酬现金等价，不再摊销同批旧奖，不另增加未来奖励股数。',
  'FCFE=归母经济盈利−所需资本增量。前五年零分红回购，FCFE以0%收益留存；2031将这笔留存现金加一次；未来6-10年现金流和终值已包含经营资本，不再加K。',
  '独立盈利法2031=经济归母盈利×16/24/30倍+上述留存现金；P/E是研究倍数，不是同日同行实测。差距体现增长久期和资本需求不确定性，不能当相互印证。',
  '未来股票回购可视为现金分配的替代，但本模型前五年不假设回购收益；若实际有净回购须联动现金与股数重算，不另加回购收益率。',
  '权证按当前同一报价87.33假设净股交割储备，两法分母相同，不加现金行权资本；并披露8.74m全保留分母敏感性。这不是精确市场期权估值或真实已发行股数。',
  '2029偿本假设释放原已计收益的3.5%融资资产；净权益不减，2030起盈利减77m税前失息，不再从独立留存现金减同笔本金。合并现金不证明母公司可合法调配流动性。',
  '可转债本金必须现金付；所有公开主情景的t3内在价格代理低于237.8475 capped-call cap，故不假设12.6m无条件转股。超cap/对手方失效须重建溢价现金和融资，不使用未调整价格。',
  '负FCFE先冲累积盈余，仍不足的资本缺口明示，缺口压力价格为融资前诊断，不能当可投资每股价值。未假设外部融资或保证不会融资。',
  '独立财务审查否决的RIM原型已保留，未用于本最终模型和三档入场。']}
path=OUT/'hood-fcfe-evidence-model-2026-11-05.json'
path.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
summary={n:{'todayFcfe':v['primary']['todayValue'],'year5Fcfe':v['primary']['year5Price'],
 'todayEarnings':v['earningsMultiple']['todayValue'],'year5Earnings':v['earningsMultiple']['year5Price'],
 'revenue5':v['rows'][4]['revenue'],'earnings5':v['rows'][4]['parentEconomicEarnings'],
 'retainedCash5':v['retainedSurplus5'],'terminalRoe':v['terminal']['roe'],'terminalShare':v['terminal']['pvTerminalShareOfToday']} for n,v in results.items()}
print(json.dumps({'values':summary,'purchase':output['purchase'],'reverse':output['reverse'],
 'capitalSensitivity':capital_sensitivity,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()},ensure_ascii=False,indent=2))
