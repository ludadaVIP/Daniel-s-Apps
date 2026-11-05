import json, hashlib
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
NOW = datetime.now(timezone.utc).isoformat()
SOURCES = {
    'q3': {'title':'Robinhood 2026 Q3 Form 10-Q','url':'https://www.sec.gov/Archives/edgar/data/1783879/000178387926000167/hood-20260930.htm','period_end':'2026-09-30','filed':'2026-10-28','file':'hood-fin-2026Q3-10Q-jina.txt'},
    'fy25': {'title':'Robinhood 2025 Form 10-K/A','url':'https://investors.robinhood.com/static-files/36353485-5cd1-4eb2-9eb4-6d266f75374b','period_end':'2025-12-31','filed':'2026-02-20','file':'hood-fin-2025-10KA-jina.txt','note':'Amends original 2026-02-18 10-K solely for table/header formatting; no reported financial result changes.'},
    'fy23': {'title':'Robinhood 2023 Form 10-K','url':'https://www.sec.gov/Archives/edgar/data/1783879/000178387924000054/hood-20231231.htm','period_end':'2023-12-31','filed':'2024-02-27','file':'hood-fin-2023-10K-jina.txt'},
    'amended': {'title':'2026 Q3 amended earnings release, Exhibit 99.1','url':'https://www.sec.gov/Archives/edgar/data/1783879/000178387926000170/q32026robinhoodamendedex991.htm','mirror_url':'https://robinhood.gcs-web.com/static-files/097e3ef5-f1a9-4981-b224-c58d9da67159','period_end':'2026-09-30','filed':'2026-10-28','file':'hood-fin-2026Q3-amended-release-jina.txt'},
    '8ka': {'title':'2026 Q3 8-K/A amendment explanation','url':'https://www.sec.gov/Archives/edgar/data/1783879/000178387926000170/hood-20261027.htm','period_end':'2026-09-30','filed':'2026-10-28','file':'hood-fin-2026Q3-8KA-jina.txt'},
}
texts = {}
for k, s in SOURCES.items():
    p = ROOT / s['file']
    s.update(accessed_at_utc=NOW, local_file=str(p), sha256=hashlib.sha256(p.read_bytes()).hexdigest(), transport='Public official source, via Jina text preprocessing; selected core tables cross-checked using web source renderer. No browser/CDP/UI used.')
    texts[k] = p.read_text(encoding='utf-8')

# All financial amounts below are USD millions, and shares millions unless exact shares explicitly stated.
annual = []
values = [
    (2021,1815,-3687,3456,-3685,2,-885,63,20,1572,492.381190,492.381190,863.912613,7293,0,'fy23'),
    (2022,1358,-1028,2369,-1027,1,-852,28,29,654,878.630024,878.630024,892.751571,6956,0,'fy23'),
    (2023,1865,-541,2401,-533,8,1181,2,19,871,890.857659,890.857659,872.162664,6696,0,'fy25'),
    (2024,2951,1411,1897,1064,-347,-157,13,37,304,881.113156,906.171504,884.492983,7972,0,'fy25'),
    (2025,4473,1883,2379,2108,225,1638,15,39,305,888.504958,918.781846,901.328432,9151,11,'fy25'),
]
for y,rev,ni,opex,pretax,tax,cfo,ppe,software,sbc,basic,diluted,endshares,equity,nci,source in values:
    row = dict(period=f'FY{y}',period_end=f'{y}-12-31',net_revenue=rev,net_income_consolidated=ni,net_income_parent=ni,nci_net_income=0,operating_expenses=opex,pretax_income=pretax,tax_provision=tax,CFO=cfo,cash_purchases_PPE_software=ppe,cash_capitalized_internal_software=software,cash_capex=ppe+software,mechanical_CFO_minus_cash_capex=cfo-ppe-software,SBC_expensed=sbc,weighted_average_basic_shares=basic,weighted_average_diluted_shares=diluted,period_end_shares=endshares,equity_including_NCI=equity,NCI_equity=nci,parent_equity=equity-nci,source_id=source)
    row['operating_profit_calculated'] = rev-opex
    row['operating_margin_calculated'] = (rev-opex)/rev
    row['net_margin_parent_calculated'] = ni/rev
    row['SBC_to_revenue_calculated'] = sbc/rev
    annual.append(row)
annual[0]['comparability_note']='2021 IPO/share class conversions make weighted-average share counts incomparable with end-of-period shares. Loss includes 2,045 change in fair value of convertible notes/warrant liability; 2021 IPO recognition included approximately 1,010 SBC.'
annual[2]['comparability_note']='SBC includes 485 charge related to cancellation of 2021 founders market-based RSUs. FY2025 presentation separates credit loss provision from operations; total opex unchanged.'
annual[3]['comparability_note']='2024 GAAP net income includes a 347 tax benefit; deferred-tax valuation allowance release makes headline net margin non-recurring.'
annual[4]['comparability_note']='2025 effective tax rate 10.7%; tax-rate reconciliation includes 184 SBC tax benefit and 66 research/development tax credits.'

periods = {
    '9M2025': dict(net_revenue=3190,net_income_consolidated=1278,net_income_parent=1278,nci_net_income=0,operating_expenses=1746,pretax_income=1447,tax_provision=169,CFO=2575,cash_capex=41,SBC_expensed=229),
    '9M2026': dict(net_revenue=3799,net_income_consolidated=1395,net_income_parent=1379,nci_net_income=16,operating_expenses=2129,pretax_income=1745,tax_provision=350,CFO=3983,cash_capex=63,SBC_expensed=277),
    'Q32025': dict(net_revenue=1274,net_income_consolidated=556,net_income_parent=556,nci_net_income=0,operating_expenses=639,pretax_income=634,tax_provision=78,SBC_expensed=78,weighted_average_basic_shares=889,weighted_average_diluted_shares=918),
    'Q32026': dict(net_revenue=1424,net_income_consolidated=476,net_income_parent=468,nci_net_income=8,operating_expenses=739,pretax_income=625,tax_provision=149,SBC_expensed=80,weighted_average_basic_shares=898,weighted_average_diluted_shares=911),
}
ttm = {key: annual[-1][key]-periods['9M2025'][key]+periods['9M2026'][key] for key in periods['9M2025']}
ttm.update(period='TTM ended 2026-09-30',method='FY2025 - 9M2025 + 9M2026',source_ids=['fy25','q3'])
ttm['mechanical_CFO_minus_cash_capex'] = ttm['CFO']-ttm['cash_capex']
ttm['operating_profit_calculated'] = ttm['net_revenue']-ttm['operating_expenses']
ttm['net_margin_parent_calculated'] = ttm['net_income_parent']/ttm['net_revenue']
ttm['operating_margin_calculated'] = ttm['operating_profit_calculated']/ttm['net_revenue']
ttm['effective_tax_rate_calculated'] = ttm['tax_provision']/ttm['pretax_income']
ttm['ROE_using_average_parent_equity_calculated'] = ttm['net_income_parent']/((8567+10001)/2)
ttm['ROE_equity_comparators'] = {'2025-09-30':8567,'2026-09-30':10001,'source':'q3 equity statements'}

balance = {
    'asof':'2026-09-30','source_id':'q3','cash_and_cash_equivalents_consolidated':5829,
    'cash_securities_segregated_under_regulations':13443,'restricted_cash_current':28,'restricted_cash_noncurrent':14,
    'reported_CFS_segregated_cash_equivalents':8883,'reported_CFS_cash_including_segregated_restricted':14754,
    'stablecoin_owned':164,'deposits_with_clearing_organizations':1125,'receivables_from_users_net':23598,
    'securities_borrowed':4781,'user_held_fractional_shares':5123,'total_assets':58271,
    'payables_to_users':18473,'securities_loaned':19480,'fractional_shares_obligation':5123,
    'long_term_borrowings_carrying':2660,'other_current_liabilities':1509,'total_liabilities':48193,
    'equity_total':10078,'NCI_equity':77,'parent_equity':10001,'parent_equity_formula':'10078 - 77',
    'goodwill':515,'intangibles_net':231,'parent_tangible_equity_simple_calculation':9255,
    'parent_cash_free_to_distribute':None,'parent_cash_limitation':'Only consolidated cash is disclosed in selected latest materials; do not relabel 5829 as parent-company freely distributable or excess cash.',
    'customer_platform_assets':396000,'customer_platform_assets_treatment':'Customer metric, not an enterprise asset or additive equity value; users own securities. Off-balance sheet customer crypto custody 37900.'
}
reg_cap = {
    'source_id':'q3','asof':'2026-09-30','subsidiaries':[
        dict(entity='RHS',net_capital=4212,required=491,excess_reported=3721),
        dict(entity='RHF',net_capital=329,required=.25,excess_reported=329),
        dict(entity='RHD',net_capital=585,required=11,excess_reported=574),
        dict(entity='TradePMR',net_capital=18,required=.25,excess_reported=18),
    ],
    'prior_2025_12_31':[
        dict(entity='RHS',net_capital=3532,required=373,excess_reported=3159),
        dict(entity='RHF',net_capital=210,required=.25,excess_reported=210),
        dict(entity='RHD',net_capital=180,required=10,excess_reported=170),
        dict(entity='TradePMR',net_capital=13,required=.25,excess_reported=13),
    ],
    'status':'Disclosed entities compliant at period end; net capital and requirements fluctuate daily.',
    'interpretation':'Regulatory excess capital is not synonymous with freely withdrawable cash. Clearing collateral, operating liquidity, loan growth, covenant thresholds, other jurisdictions and stress buffers must be provided before any extraction. Do not add this table to B0 or cash.'
}
debt = {
    'source_id':'q3','convertible':dict(principal=2200,carrying_approx=2172,coupon=0,maturity='2029-10-01',effective_interest_rate=.0043,initial_conversion_price=174.42,conversion_rate_shares_per_1000=5.7332,potential_shares=12.6,conversion_principal_settlement='cash required up to principal; excess may be cash/shares/combination',shares_excluded_from_current_diluted_EPS_as_antidilutive=13,capped_call_cash_cost=123.2,capped_call_strike=174.4227,capped_call_cap=237.8475,stock_repurchase_from_proceeds=290,stock_repurchase_shares=2.7),
    'credit_card_ABS_series_2026_1':dict(principal=500,carrying=488,weighted_coupon=.0486,final_maturity='2031-07',revolving_period_end='2029-06',swap_notional=500,swap_liability=10),
    'credit_card_warehouse_borrowings_including_interest':839,'warehouse_classification':'Other current liabilities; separate from 2660 long-term borrowings and separate from ABS.',
    'credit_card_trust_revolver_commitment':1550,'credit_card_trust_warehouse_weighted_interest_rate':.0506,
    'credit_card_trust_creditors_recourse':'No recourse to general credit; trust assets settle trust obligations. Exposure includes trust net assets and expected credit losses.',
    'RHM_revolver_commitment':1125,'RHM_revolver_maturity':'2028-03-21','RHS_revolver_commitment':3325,'RHS_revolver_tenor_days':364,'RHM_RHS_revolver_drawn_at_period_end':0,
    'postperiod_event_2026_10_15':dict(ABS_series_2026_2_principal=500,weighted_coupon=.0558,final_maturity='2031-10',revolving_period_end='2029-09',note='Subsequent event, not included in September 30 balance. Do not add entire amount as net incremental debt without knowing warehouse repayments.'),
    'valuation_treatment':'RIM starts with parent book equity already net of all reported liabilities. Do not again subtract convertible/ABS debt or add consolidated cash. For EV-style analysis, separate financing of earning assets from general corporate debt and exclude customer payables/collateral from ordinary industrial debt. For converts, do not both deduct full debt and add all as-converted shares; model mandatory cash principal and share/capped-call excess consistently.'
}
capital = {
    'source_id':'q3','exact_shares_asof':'2026-10-21','classA_shares_exact':793425151,'classB_shares_exact':107066126,'total_shares_exact':900491277,
    'period_end_shares_2026_09_30_rounded_m':901,'q3_diluted_weighted_average_m':911,'nine_month_diluted_weighted_average_m':913,
    'warrants':dict(shares_m=8.74,strike=26.60,expiry='2031-02-12',exercise='cash or net share settlement'),
    'unvested_time_based_RSU_m':6,'unvested_RSU_weighted_grant_value_per_share':66.19,'PSU_max_shares_m':.4,'plan_awards_reserved_m':9,'shares_available_for_future_grants_m':348,
    'unvested_TradePMR_restricted_shares_m':1,'TradePMR_shares_note':'Already issued/outstanding; do not add again to current issued shares.',
    'unrecognized_SBC_expense':453,'unrecognized_SBC_weighted_recognition_years':1.04,
    'SBC_expensed_9M2026':277,'SBC_capitalized_in_software_9M2026':15,'SBC_total_equity_credit_9M2026':292,
    'repurchases_9M2026_program':399,'repurchases_9M2026_separate_convert_transaction':290,'repurchases_9M2026_total':689,'repurchase_shares_program_m':5.0,'repurchase_shares_convert_m':2.7,
    'interpretation':'Recurring SBC is an economic labor expense. Adding it back while ignoring dilution or offsetting repurchase cost overstates per-share value. Current diluted EPS denominator is period-weighted and does not contain antidilutive convert shares; future authorized shares are not all presently issued dilution.'
}
clean_surplus_items = [
    ('Opening parent equity, 2025-12-31',9140),('Parent net income',1379),('OCI',-17),('Option exercises',4),('ESPP issuance',17),('RSU tax withholding',-34),('Capped calls, equity-statement net amount',-93),('Share repurchases',-689),('SBC including capitalized SBC',292),('RVI deconsolidation APIC adjustment',2),
]
clean_surplus = {'source_id':'q3','period':'9M2026','items':[dict(item=k,amount=v) for k,v in clean_surplus_items],'closing_parent_equity_calculated':sum(v for k,v in clean_surplus_items),'closing_parent_equity_reported':10001,'note':'Capped-call cash payment 123.2 differs from net equity-statement reduction 93; use reported equity bridge, not cash outflow, when reconciling B0. A net-income-only retained-earnings book roll-forward is not actual clean surplus when these direct equity/owner transactions continue. OCI should be zero only as an explicit forecast assumption.'}

cfo_bridge = [('Net income consolidated',1395),('D&A',72),('Credit-loss provision',163),('Deferred taxes',63),('SBC expensed',277),('Deconsolidation gain',-107),('Equity securities realized/unrealized loss',46),('Other noncash',26)]
working = [('Segregated securities',-4360),('Broker receivables',-111),('User receivables',-4939),('Securities borrowed',-2373),('Clearing deposits',-423),('Deferred customer match',-190),('Other assets/prepaids',-328),('Payables/accruals',47),('Payables to users',6447),('Securities loaned',7854),('Other liabilities',424)]
cash_quality = {'source_id':'q3','period':'9M2026','noncash_bridge':[dict(item=k,amount=v) for k,v in cfo_bridge],'income_plus_noncash':sum(v for k,v in cfo_bridge),'asset_liability_changes':[dict(item=k,amount=v) for k,v in working],'asset_liability_changes_total':sum(v for k,v in working),'CFO':3983,'cash_capex_PPE':31,'cash_capex_software':32,'mechanical_CFO_minus_capex':3920,'credit_card_receivables_purchased_in_investing_CF':10834,'credit_card_collections_in_investing_CF':9961,'credit_card_net_cash_investment':873,'warehouse_borrowing_CF':757,'warehouse_repayment_CF':523,'ABS_borrowing_CF':500,'credit_card_incremental_financing_CF':734,'credit_card_net_cash_funding_gap_before_other_items':139,'warning':'These are consolidated cash-accounting flows, not owner earnings. Net customer funding changes and restricted/segregated movements dominate CFO; loan origination purchases are in investing CF, and financing proceeds are not distributable earnings.'}

credit = {'source_id':'q3','asof':'2026-09-30','margin_book':22100,'margin_book_growth_yoy':.59,'purchased_card_receivables_net':1510,'purchased_card_receivables_net_prior_2025_12_31':786,'card_loans_on_balance_gross':1645,'card_loans_off_balance_gross':196,'card_loans_total_gross':1841,'card_loans_total_gross_prior':1040,'past_due_total':102,'past_due_90plus':33,'past_due_percent_reported':.06,'below640_FICO_share':.05,'below640_prior_share':.03,'FICO_above690_share':.75,'FICO_above690_prior_share':.78,'allowance_on_balance':134,'allowance_off_balance':40,'nine_month_card_provision_on_balance':125,'nine_month_card_provision_off_balance':18,'q3_card_provision_on_balance':57,'q3_card_provision_off_balance':4,'card_net_interest_9M2026':122,'card_net_interest_Q32026':50,'coastal_bank_funding_capacity':500,'coastal_bank_off_balance_risk':'Receivables and bank funding are not on the balance sheet; Robinhood bears losses under program terms. Bank legal ownership does not remove Robinhood economic credit risk.','interpretation':'9M card provisions 143 exceed card net interest 122; Q3 provisions 61 exceed card net interest 50. This comparison excludes card noninterest revenue and operating/rewards/network expenses, so it is a warning about immature earnings and credit cost, not a full segment-profit calculation. Margin lending and customer collateral require liquidity and risk capital; customer collateral itself is not enterprise wealth.'}

nonoperating = {'source_ids':['q3','fy25','amended','8ka'],'RVI_deconsolidation_gain_9M2026':106,'RVII_deconsolidation_gain_9M2026':1,'retained_RVI_value':361,'retained_RVII_value':23,'q3_realized_unrealized_fund_losses_adjustment':67,'nine_month_realized_unrealized_fund_gains_adjustment':62,'nine_month_other_income_net':75,'RVI_management_fee':'2% NAV','RVII_management_fee':'2% NAV plus 20% incentive fee on realized capital gains','2025_effective_tax_rate':.107,'2025_SBC_tax_benefit':184,'2025_RD_tax_credits':66,'q3_2026_effective_tax_rate_calculated':149/625,'nine_month_2026_effective_tax_rate_calculated':350/1745,'amended_adjusted_net_income_Q3':542,'amended_adjusted_net_income_9M':1409,'amended_adjusted_earnings_bridge_Q3':'468 + 2 CFO/restructuring SBC + 67 investment losses + 9 acquired-intangible amortization - 4 tax impact = 542','unamended_HTML_adjusted_net_income_Q3_obsolete':550,'amendment_reason':'8-K/A solely revises tax effect presentation of non-GAAP adjustments; GAAP unchanged. 550 to 542 is not a new 8 NCI adjustment.','valuation_interpretation':'Strip nonrecurring investment/deconsolidation effects for normal operating earnings and set a defensible through-cycle tax rate. Retained fund fair values are already in B0; do not add them again in RIM. In sum-of-parts, remove related earnings and capital before adding investment value separately.'}

acquisitions = {'source_id':'q3','TradePMR':dict(closed='2025-02-26',cash_consideration_final=169,postclose_employee_shares_value=100,postclose_vesting_years=4,goodwill=105,intangibles=81),'Bitstamp':dict(closed='2025-06-02',cash_consideration_final=224,goodwill=93,intangibles=70),'MIAXdx_Rothera':dict(closed='2026-01-20',acquired_interest=.90,cash_consideration=79,SIG_contribution=41,goodwill=23,intangible_licenses=47),'WonderFi':dict(closed='2026-06-01',cash_consideration=178,goodwill=119,intangibles=50),'note':'TradePMR 169 cash plus 100 postclose employment compensation must not be mislabeled 269 acquisition consideration; employee service cost is SBC. Business combinations bring customer cash AND offsetting customer obligations. Acquired segregated customer funds are not cash windfalls.'}

limits = [
    'No independently disclosed current parent-only freely distributable cash figure found in selected latest filings; consolidated cash is not sufficient to infer excess cash.',
    'Regulatory capital table covers named US entities; other jurisdictions/crypto licenses and business stress buffers may require more capital. Minimum regulatory capital is not a sufficient estimate of optimal operating capital.',
    'Cash capex does not distinguish maintenance versus growth. Internally developed software capitalization and capitalized SBC should remain explicit.',
    'TTM and annual values use reported rounded millions. TTM is a derived period, not a management forecast. No share price or investment recommendation is supplied by this evidence file.',
    '2025 annual cash-flow reconciliation comparative cash balances as rendered via text preprocessing show historical-period values that do not readily reconcile with the 2023 original report. Historical cash-balance series has deliberately not been constructed from that table. Core income/CFO/capex and latest Q3 balance sheet are separately identified; this is not evidence of financial misstatement.',
    'Latest segregated aggregate includes cash and securities, whereas the CFS reconciliation is cash/equivalents only. Do not treat their difference, or the full segregated aggregate, as excess corporate cash. Selected fair-value tables should not be used as a complete allocation of that aggregate without full ledger detail.',
]

# Preserve exact primary-source text windows, with local line references. SEC documents are public filings.
extract_specs = [
    ('fy23','(in millions, except share and per share data)2021 2022 2023',38),
    ('fy23','(in millions)2021 2022 2023\nOperating activities:',48),
    ('fy25','(in millions, except share and per share data) 2023 2024 2025',14),
    ('fy25','Operating activities: \n\nNet income (loss)',19),
    ('fy25','Year Ended December 31, 2025 Amount Percent',12),
    ('q3','CONDENSED CONSOLIDATED BALANCE SHEETS',83),
    ('q3','CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS',45),
    ('q3','CONDENSED CONSOLIDATED STATEMENTS OF CASH FLOWS',90),
    ('q3','Balance as of December 31, 2025',22),
    ('q3','NOTE 11: FINANCING ACTIVITIES',84),
    ('q3','As of October',3),
    ('q3','The table below summarizes the net capital',12),
    ('q3','Unvested at December 31, 2025',45),
    ('q3','Other income (expense), net decreased by $59',17),
    ('amended','Net income attributable to Robinhood .......',3),
    ('8ka','This Form 8-K/A',3),
]
extracts=[]
for sid, needle, count in extract_specs:
    source=texts[sid]
    idx=source.find(needle)
    if idx < 0:
        extracts.append(dict(source_id=sid,needle=needle,status='Exact anchor not found; full text file retained'))
        continue
    line=source[:idx].count('\n')+1
    extract='\n'.join(source[idx:].splitlines()[:count])
    extracts.append(dict(source_id=sid,url=SOURCES[sid]['url'],local_line_start=line,text=extract))

data=dict(instrument='Robinhood Markets, Inc. Nasdaq: HOOD Class A',analysis_date='2026-11-05',accessed_at_utc=NOW,units='USD millions; shares millions unless marked exact; GAAP unless marked adjusted/non-GAAP',sources=SOURCES,annual=annual,interim=periods,ttm=ttm,balance_sheet=balance,regulatory_capital=reg_cap,debt=debt,shares_and_compensation=capital,clean_surplus_bridge=clean_surplus,cashflow_quality=cash_quality,credit_and_capital_needs=credit,nonoperating_tax_and_amendment=nonoperating,acquisitions=acquisitions,limitations=limits,exact_source_text_windows=extracts)

assert ttm['net_revenue']==5082
assert ttm['net_income_parent']==1984
assert ttm['CFO']==3046
assert ttm['cash_capex']==76
assert clean_surplus['closing_parent_equity_calculated']==10001
assert cash_quality['income_plus_noncash']+cash_quality['asset_liability_changes_total']==3983
assert balance['total_assets']-balance['total_liabilities']-balance['NCI_equity']==10001
assert capital['classA_shares_exact']+capital['classB_shares_exact']==capital['total_shares_exact']
out=ROOT/'hood-financial-evidence-2026-11-05.json'
out.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')

md = ['# HOOD 财务核验工作底稿（不是最终决策报告）',f'访问时间：{NOW}；报告截至2026-09-30；金额为百万美元，股数为百万股。','',
'核心估值锚：归母权益10,001；TTM归母利润1,984；TTM收入5,082。RIM以归母权益为起点，不再另加集团现金、基金投资或监管超额资本，也不再减已入账债务。','',
'|期间|净收入|归母净利|CFO|现金CapEx|机械CFO−CapEx*|费用化SBC|期末归母权益|',
'|---|---:|---:|---:|---:|---:|---:|---:|']
for r in annual+[ttm]:
    md.append(f"|{r['period']}|{r['net_revenue']:,}|{r['net_income_parent']:,}|{r['CFO']:,}|{r['cash_capex']:,}|{r['mechanical_CFO_minus_cash_capex']:,}|{r['SBC_expensed']:,}|{r.get('parent_equity','—')}|")
md += ['', '*现金CapEx=购买PPE/软件+内部开发软件资本化的现金支出。该机械差额受客户保证金、证券借贷、隔离资金及贷款资本需求影响，不是可分配FCF；信用卡应收购买还列在投资现金流。', '',
'Q3合并净利476，归母468；9M合并1,395，归母1,379。TTM=FY2025−9M2025+9M2026，因此合并净利2,000和归母1,984不能混用。', '',
'可转债本金2,200，2029-10-01到期、必须现金结算本金，转股价174.42；潜在12.6百万股，季度稀释EPS因反稀释排除约13百万股。Capped calls行权价174.4227、封顶237.8475。另有信用卡ABS本金500、账面488；仓储融资本息839计入其他流动负债。母公司/RHS循环授信期末未提用不等于公司无债。10月15日另发ABS500属于期后事项，不能在不知偿还仓储融资金额时全视作净新增负债。', '',
'最新准确在外股数（2026-10-21）900.491277；季度加权稀释股数911，二者口径不同。9M回购689（计划399+可转债配套290），费用化SBC277、资本化SBC15。未归属RSU6、PSU最高0.4、已发行TradePMR未归属股1不能重复加入；未确认SBC453预计1.04年确认。认股权证8.74百万股、行权价26.60。', '',
'归母权益桥：9,140 + 归母净利1,379 − OCI17 + 期权4 + ESPP17 − RSU代扣税34 − capped calls权益净计入93 − 回购689 + SBC292 + RVI去并表APIC2 = 10,001。按净利润全留存机械推权益必须明示未来股权交易、SBC与OCI如何处理。', '',
'集团现金5,829不能自动标为母公司可分配现金；隔离现金/证券13,443、其他流动/非流动受限现金28/14均不得作为超额现金。RHS/RHF/RHD/TradePMR监管超额资本分别3,721/329/574/18，仍受日内波动、清算抵押、契约和经营资本需求限制。客户平台资产396,000以及客户托管加密资产37,900不属于可加到企业权益的财富。', '',
'9M CFO3,983中，净利加非现金调整为1,935，资产负债变化净增2,048；客户应付增加6,447、证券出借抵押负债增加7,854。信用卡净购买应收现金873列投资CF，仓储融资净流入234+ABS500仅补充734，差额139须由其他资金支持（不是信用卡资本要求的精确计量）。', '',
'信用卡毛贷款1,841（表内1,645+表外196），过去到期102，报告比例6%，90天以上33；FICO低于640占比由3%升至5%。9M信用卡净利息122、信用卡拨备143；Q3分别50/61；不能将净利息增长当成成熟盈利，仍需非利息收入、奖励/网络/运营成本才能计算完整分部利润。Margin book22,100，同比增长59%，贷款增长继续占用流动性和风险资本。', '',
'正常化净利需剔除RVI/RVII去并表与投资重估波动：9M去并表收益106+1，修订稿投资净收益调整62；Q3投资净损失67。RVI/RVII保留权益361/23已在B0内。FY2025税率10.7%，含SBC税收优惠184及研发抵免66；2024所得税为净收益347（递延税估值备抵释放影响），Q3/9M2026有效税率23.84%/20.06%，TTM16.87%，需显式正常税率。', '',
'非GAAP修订：10月28日8-K/A仅改非GAAP税务影响；GAAP不变。旧IR HTML的Adjusted NI550已过期；修订值542=归母468+转换/重组SBC2+投资损失67+收购无形摊销9−税影响4。9M修订Adjusted NI1,409。', '',
'收购最终对价：TradePMR现金169（另100为四年服务期薪酬，不是收购对价）；Bitstamp224；Rothera收购MIAXdx90%现金79（SIG出资41）；WonderFi178。收购客户隔离现金伴随客户负债，不能当作收购现金收益。', '',
'资料限制：'+ '；'.join(limits), '', '来源：']
for s in SOURCES.values():
    md.append(f"- [{s['title']}]({s['url']})，申报{s['filed']}，本地原文：{s['file']}。")
(ROOT/'hood-financial-evidence-2026-11-05.md').write_text('\n'.join(md),encoding='utf-8')
print(json.dumps({'json':str(out),'markdown':str(ROOT/'hood-financial-evidence-2026-11-05.md'),'TTM':ttm,'checks':'passed','source_windows_found':sum('text' in x for x in extracts),'source_windows_total':len(extracts)},ensure_ascii=False,indent=2))
