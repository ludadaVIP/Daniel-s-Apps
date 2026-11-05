import json, math, copy, hashlib
from pathlib import Path

OUT = Path(__file__).resolve().parent
ANCHOR = {
    'units': 'USD million, shares million', 'quote': 87.33,
    'parentBook': 10001.0, 'consolidatedEquity': 10078.0, 'nciEquity': 77.0,
    'basicShares': 900.491277, 'basicShareDate': '2026-10-21',
    'existingUnvestedRsu': 6.0, 'existingUnvestedPsu': 0.4,
    'warrants': 8.74, 'warrantStrike': 26.60, 'warrantExerciseYear': 4.27,
    'convertPrincipal': 2200.0, 'convertCarryingValue': 2172.0,
    'unamortizedIssuanceCost': 28.1, 'convertSettlementYear': 3,
    'convertStrike': 174.4227, 'cappedCallCap': 237.8475,
    'consolidatedCash': 5829.0, 'restrictedCashAndSecurities': 13443.0,
    'ttmRevenue': 5082.0, 'ttmParentNetIncome': 1984.0,
    'sources': ['2026 Q3 10-Q, filed 2026-10-28', '2026-10-30 amended exhibit 99.1'],
}
PATHS = {
 'bear': {'label': '交易周期回落与合规成本上升', 'firstRevenue': 4600,
    'growth': [.05,.08,.08,.06,.05,.04,.04,.03,.03],
    'preCompPretaxMargins': [.30,.31,.33,.35,.36,.36,.36,.35,.35,.35],
    'futureServiceCostPct': [.09]*10, 'tax': .25, 'nciProfitShare': .015,
    'ke': .15, 'g': .02, 'pe5': 16},
 'base': {'label': '资金留存、期权与订阅扩张，利润正常化', 'firstRevenue': 6000,
    'growth': [.20,.18,.15,.12,.10,.08,.06,.05,.04],
    'preCompPretaxMargins': [.49,.50,.51,.52,.52,.51,.50,.49,.48,.48],
    'futureServiceCostPct': [.08,.08,.08,.08,.08,.08,.075,.075,.07,.07],
    'tax': .25, 'nciProfitShare': .02, 'ke': .125, 'g': .03, 'pe5': 24},
 'bull': {'label': '全球财富入口与多产品平台成功', 'firstRevenue': 6800,
    'growth': [.30,.25,.22,.20,.15,.12,.10,.08,.06],
    'preCompPretaxMargins': [.55,.57,.59,.60,.60,.59,.58,.57,.56,.55],
    'futureServiceCostPct': [.075,.075,.07,.07,.07,.065,.065,.06,.06,.06],
    'tax': .25, 'nciProfitShare': .025, 'ke': .11, 'g': .035, 'pe5': 30},
}

def allocated(equity5, ke):
    # The first five years contain no distributions. Existing awards are
    # allocated upfront; all future new service compensation is paid in cash.
    common = ANCHOR['basicShares'] + ANCHOR['existingUnvestedRsu'] + ANCHOR['existingUnvestedPsu']
    n_w = ANCHOR['warrants']
    strike = ANCHOR['warrantStrike']
    provisional_w_price = equity5 / common / (1+ke)**(5-ANCHOR['warrantExerciseYear'])
    exercised = provisional_w_price > strike
    shares5 = common + (n_w if exercised else 0)
    warrant_cash = n_w * strike if exercised else 0
    premium = 0.0
    note_shares = ANCHOR['convertPrincipal'] / ANCHOR['convertStrike']
    for _ in range(100):
        p5 = max(0.0, (equity5 + warrant_cash - premium) / shares5)
        conversion_price_proxy = p5 / (1+ke)**(5-ANCHOR['convertSettlementYear'])
        nxt = note_shares * max(conversion_price_proxy-ANCHOR['cappedCallCap'], 0)
        if abs(nxt-premium)<1e-10:
            premium=nxt
            break
        premium=nxt
    p5 = max(0.0, (equity5+warrant_cash-premium)/shares5)
    return {'todayValue': p5/(1+ke)**5, 'year5Price': p5,
        'shares5': shares5, 'warrantsExercised': exercised,
        'warrantCashAtHorizon': warrant_cash,
        'convertPremiumCashAfterCappedCall': premium,
        'conversionPriceProxyYear3': conversion_price_proxy,
        'returnAtQuote': (p5/ANCHOR['quote'])**.2-1,
        'totalReturnAtQuote': p5/ANCHOR['quote']-1}

def model(parameters, scale=1.0, margin_shift=0.0, service_shift=0.0, tax_shift=0.0,
          first_year_loss=0.0, terminal_roe_override=None):
    p=copy.deepcopy(parameters)
    k=p['ke']; g=p['g']; assert k>g
    revenue=p['firstRevenue']*scale; book=ANCHOR['parentBook']; rows=[]
    pv_ri=0.0; pv_dividends=0.0
    for i in range(10):
        if i: revenue*=1+p['growth'][i-1]
        service=revenue*(p['futureServiceCostPct'][i]+service_shift)
        earnings_before_service=revenue*(p['preCompPretaxMargins'][i]+margin_shift)
        amort=ANCHOR['unamortizedIssuanceCost']/3 if i<3 else 0.0
        # Repaying 0%-coupon principal swaps assets and liabilities, not equity.
        # Only lost asset yield is an income cost; principal is not subtracted
        # a second time from this equity valuation.
        lost_interest=ANCHOR['convertPrincipal']*.035 if i>=3 else 0.0
        pretax=earnings_before_service-service-amort-lost_interest
        tax=max(pretax,0)*(p['tax']+tax_shift)
        consolidated=pretax-tax
        nci=max(consolidated,0)*p['nciProfitShare']
        ni=consolidated-nci-(first_year_loss if i==0 else 0)
        dividend=0 if i<5 else max(ni,0)*.5
        ri=ni-k*book
        opening_book=book
        book+=ni-dividend
        pv_ri+=ri/(1+k)**(i+1)
        pv_dividends+=dividend/(1+k)**(i+1)
        rows.append({'year':2027+i,'t':i+1,'revenue':revenue,
            'preFutureServicePretaxMargin':p['preCompPretaxMargins'][i]+margin_shift,
            'newServiceCompensation':service,'pretax':pretax,'normalCashTax':tax,
            'nciEarnings':nci,'parentEconomicEarnings':ni,
            'bookOpening':opening_book,'bookClosing':book,'distribution':dividend,
            'residualIncome':ri,'roe':ni/opening_book,
            'debtAmortization':amort,'lostInterestAfterPrincipalRepayment':lost_interest})
    ni11=rows[-1]['parentEconomicEarnings']*(1+g)
    if terminal_roe_override is not None: ni11=book*terminal_roe_override
    roe_terminal=ni11/book
    terminal_dividend=ni11-g*book
    terminal_ri=ni11-k*book
    tv_ri=terminal_ri/(k-g)
    tv_equity=terminal_dividend/(k-g)
    raw0=ANCHOR['parentBook']+pv_ri+tv_ri/(1+k)**10
    raw5=rows[4]['bookClosing']+sum(r['residualIncome']/(1+k)**(r['t']-5) for r in rows[5:])+tv_ri/(1+k)**5
    ddm=pv_dividends+tv_equity/(1+k)**10
    assert abs(raw0-ddm)<1e-7
    assert abs(raw5/(1+k)**5-raw0)<1e-7
    assert terminal_dividend>0 and book>0
    primary=allocated(raw5,k)
    secondary=allocated(rows[4]['parentEconomicEarnings']*p['pe5'],k)
    primary['unallocatedEquityToday']=raw0;primary['unallocatedEquityYear5']=raw5
    secondary['pe5']=p['pe5'];secondary['parentEconomicEarnings5']=rows[4]['parentEconomicEarnings']
    return {'parameters':p,'rows':rows,'primary':primary,'earningsMultiple':secondary,
        'terminal':{'roe':roe_terminal,'growth':g,'reinvestmentFraction':g/roe_terminal,
          'payoutFraction':1-g/roe_terminal,'ri':terminal_ri,'equity':tv_equity,
          'justifiedPriceBook':tv_equity/book,
          'terminalEquityPvShareOfDdm':tv_equity/(1+k)**10/raw0,
          'riTerminalPvShareOfTotalValue':tv_ri/(1+k)**10/raw0},
        'ddmIdentity':ddm, 'noDistributionsYears1To5':True}

results={n:model(p) for n,p in PATHS.items()}
base=results['base']; primary=base['primary']; secondary=base['earningsMultiple']
reference=min(primary['todayValue'],secondary['todayValue'])
future_reference=min(primary['year5Price'],secondary['year5Price'])
return_limit=future_reference/1.15**5
highs=[math.floor(min(reference*(1-m),return_limit)*100)/100 for m in [.25,.35,.45]]
entries=[{'tier':'observation','low':round(highs[1]+.01,2),'high':highs[0],'budgetSharePct':25},
 {'tier':'safety','low':round(highs[2]+.01,2),'high':highs[1],'budgetSharePct':35},
 {'tier':'discount','low':math.ceil(reference*.35*100)/100,'high':highs[2],'budgetSharePct':40}]
assert entries[0]['low']<=entries[0]['high'] and entries[2]['low']<=entries[2]['high']
lo=.05;hi=10
for _ in range(100):
 mid=(lo+hi)/2
 if model(PATHS['base'],scale=mid)['primary']['todayValue']<ANCHOR['quote']:lo=mid
 else:hi=mid
reverse=model(PATHS['base'],scale=(lo+hi)/2)
sensitivity=[]
for k in [.105,.115,.125,.135,.145]:
 row={'ke':k,'values':[]}
 for g in [.02,.025,.03,.035,.04]:
  p=copy.deepcopy(PATHS['base']);p.update(ke=k,g=g)
  row['values'].append({'g':g,'todayValue':model(p)['primary']['todayValue']})
 sensitivity.append(row)
stresses={
 'revenueMinus20AndMarginMinus5pp':model(PATHS['base'],scale=.8,margin_shift=-.05),
 'futureServiceCostPlus3pp':model(PATHS['base'],service_shift=.03),
 'normalTaxPlus5pp':model(PATHS['base'],tax_shift=.05),
 'persistentRoeFadesToKe':model(PATHS['base'],terminal_roe_override=PATHS['base']['ke']),
 'cashCreditOperationalLoss2500':model(PATHS['bear'],first_year_loss=2500),
}
output={'version':1,'analysisDate':'2026-11-05','anchors':ANCHOR,'paths':results,
 'purchase':{'requiredAnnualReturn':.15,'referenceToday':reference,'referenceYear5':future_reference,
  'maxByReturn':return_limit,'entries':entries},
 'reverse':{'revenueScale':(lo+hi)/2,'firstRevenue':reverse['rows'][0]['revenue'],
   'revenue5':reverse['rows'][4]['revenue'],'revenue10':reverse['rows'][9]['revenue'],
   'parentEconomicEarnings5':reverse['rows'][4]['parentEconomicEarnings'],'todayValue':reverse['primary']['todayValue']},
 'sensitivity':sensitivity,'stresses':stresses,
 'limitations':[
  '母公司权益锚点止2026-09-30，不是11月5日实际权益。',
  '2026-10-21基本股数加9月30日未归属RSU/PSU为保守归属假设，两时点之间归属或已部分重叠；不宣称是精确现时完全摊薄股数。',
  '现有奖励一次性进入分母；未来新增服务报酬以现金等价成本扣减，不再额外增加未来奖励股数，不再摊销同批旧奖。',
  '未来现金报酬、正常税、利润率、少数权益及50%远期分配均为研究假设，不是管理层指引。',
  '前五年不分红或回购，第六年至第十年以50%经济盈利作潜在分配；独立盈利法不另加现金，避免双计。',
  '2029年按本金现金偿还；权益内已扣债务，不再次减2200或无条件加12.6m转股。超过capped-call上限才计净溢价现金。',
  '条件路径内权证在到期前价内则全部现金行权、股数增加8.74m；232.484m现金零收益留至2031，只加一次。不估计风险中性时间价值。',
  '模型不是完整法定/监管资本与清算现金预测，不能据集团现金断言母公司可立即分配全部现金；若受监管子公司不能调配流动性或增长需要新增股本，须重算。',
  'RIM与股利折现恒等只作算术核验，不冒充第二种独立估值；独立校验为正常化归母经济盈利的研究P/E资本化。'
 ]}
path=OUT/'hood-evidence-model-2026-11-05.json'
path.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
summary={n:{'todayRim':v['primary']['todayValue'],'year5Rim':v['primary']['year5Price'],
 'todayEarnings':v['earningsMultiple']['todayValue'],'year5Earnings':v['earningsMultiple']['year5Price'],
 'revenue5':v['rows'][4]['revenue'],'earnings5':v['rows'][4]['parentEconomicEarnings'],
 'roeTerminal':v['terminal']['roe'],'terminalDdmShare':v['terminal']['terminalEquityPvShareOfDdm']} for n,v in results.items()}
print(json.dumps({'values':summary,'purchase':output['purchase'],'reverse':output['reverse'],
 'modelSha256':hashlib.sha256(path.read_bytes()).hexdigest()},ensure_ascii=False,indent=2))
