"""ASTS conditional research model. USD/share counts in millions, except per-share dollars.
No position, order, quote-store, or application job writes.
"""
import json, math, hashlib, itertools
from pathlib import Path
from datetime import datetime, timezone

P = Path(__file__).resolve().parent
OUT = P / 'asts-evidence-model-2026-11-05.json'
PRICE = 35.88
ECONOMIC_SHARES = (299789305 + 11215111 + 78163078) / 1e6
EXISTING_PROBABLE_AWARDS = 12.159478
START_SHARES = ECONOMIC_SHARES + EXISTING_PROBABLE_AWARDS
NOTES = [
    dict(id='2032-4.25', principalM=3.514, coupon=.0425, conversionRatePer1000=37.0535, maturityYear=2032, maturityDate='2032-03-01', maturityYearCoupons=1),
    dict(id='2032-2.375', principalM=325, coupon=.02375, conversionRatePer1000=13.875, maturityYear=2032, maturityDate='2032-10-15', maturityYearCoupons=2),
    dict(id='2034-1.625', principalM=1150, coupon=.01625, conversionRatePer1000=12.5672, maturityYear=2034, maturityDate='2034-02-01', maturityYearCoupons=1),
    dict(id='2036-2.00', principalM=1150, coupon=.02, conversionRatePer1000=10.3845, maturityYear=2036, maturityDate='2036-01-15', maturityYearCoupons=1),
    dict(id='2036-2.25', principalM=1075, coupon=.0225, conversionRatePer1000=8.5982, maturityYear=2036, maturityDate='2036-04-15', maturityYearCoupons=1),
]
for n in NOTES:
    n['conversionPrice'] = 1000/n['conversionRatePer1000']
    n['conversionSharesM'] = n['principalM'] * n['conversionRatePer1000'] / 1000

COMMON = dict(
    units='USD millions / million ordinary economic units; per-share amounts USD',
    valuationDate='2026-11-04', periodConvention='Ten annual research periods ending November 4, 2027 through November 4, 2036; 2031 is exactly five years. These are not fiscal-year forecasts.',
    openingCashBridge=dict(june30UnrestrictedCashM=2288.253, julyGrossDebtM=1150,
        julyNetDebtProceedsM=1131.14, julyCappedCallCashM=111.4,
        jul1ThroughNov4CashCapexM=600, jul1ThroughNov4NetCashOperatingBurnM=120,
        jul1ThroughNov4SpectrumCashM=35, jul1ThroughNov4OtherCashM=30,
        note='Only June cash, gross July proceeds and capped-call total are reported facts. July total net proceeds assumes the same 1.64% all-in fee ratio as the reported initial $1bn/$983.6m net; option-size fee may differ. All July-November uses are research estimates, not actual November liquidity. They cover the historical bridge only; first forecast period includes November-December 2026, so there is no omitted future stub or duplicate four-month burn.'),
    openingCashM=2288.253+1131.14-111.4-600-120-35-30,
    openingPaidSatelliteWipM=1200,
    openingPaidSatelliteWipNote='Research estimate, not reported fact: $1,724.085m June satellite/WIP/launch prepayments is not all usable future-production cash credit. Retain $1,200m estimated prepaid content at November 4 after deployments, timing, non-usable/design and other-content haircuts. Apply this credit against future gross satellite procurement exactly once. Sensitivity 0 to $1,700m; WIP is not added as a separate financial asset.',
    openingOperatingNwcM=30, nwcPctRevenue=.08,
    openingOperatingNwcNote='Research starting proxy, not precise November balance. June AR79.297+inventory28.417+prepaid16.729 minus AP60.615 and selected operating accruals46.862 equals16.966; capex content and intervening movements are unresolved. Do not include contract liabilities in NWC, because their future noncash recognition is deducted separately.',
    minimumCashM=500, equityIssueCost=.03,
    minimumCashPolicy='Research liquidity reserve required to continue the modeled project. Falling below it triggers an assumed project stop with zero common liquidation recovery, not a claim of legal insolvency or proven zero asset value. Report actual ending cash and reserve gap separately. Reserve remains committed operating liquidity and is not added as excess cash to terminal equity.',
    currentEconomicSharesM=ECONOMIC_SHARES, existingProbableAwardsM=EXISTING_PROBABLE_AWARDS,
    startingFullyDilutedUnitsM=START_SHARES,
    existingAwardsNote='12.159478m probable service/performance awards from diluted-EPS note fully included immediately, with no option exercise proceeds credited; conservative forfeiture/proceeds simplification. No future compensation awards are silently free: modeled future compensation is included as an economic cash replacement cost in fixed operating expenses. No future compensation-share addback/dilution on top. Additional contingent award overhang 2.852222m is sensitivity only.',
    taxRate=.25, normalTaxNote='Conservative all-economic-units, fully exchanged Up-C proxy: 25% tax on positive earnings, no NOL/step-up asset credit, no incremental TRA tax benefit. No NCI book-value subtraction. Actual taxes differ between C-corporation and LLC holders; TRA acceleration tail cannot be quantified from disclosed no-liability balance.',
    prepaymentNoncashRevenueM=[10,30,50,60,60,30,26.933,0,0,0],
    prepaymentNote='The full June $266.933m current+noncurrent contract liability, including SatCo contributed distribution-right deferred revenue, is treated as noncash recognition included in projected gross revenue and deducted from future collections. No new MNO prepayment source assumed. NWC excludes contract liabilities, preventing a second deduction.',
    trinityPrincipalScheduleM=[10,10,12,16.638,0,0,0,0,0,0],
    trinityStartingPrincipalM=48.638, trinityCashRate=.12,
    trinityEndFeeM=4.545,
    trinityNote='June balance held as conservative November proxy; annual principal timing research approximation to four five-year 2025 schedules with about $1.1m aggregate monthly payment and 9% end payment on $50.5m drawn. 12% modeled cash rate approximation; no undrawn $49.5m commitment counted as cash or financing.',
    ubsCollateralRestrictedM=428.4, ubsPrincipalMatchedM=420, ubsAnnualNetSpreadM=8.4,
    ubsTreatment='UBS principal420 and minimum collateral428.4 are matched outside free operating cash/debt. Collateral cash earns assumed benchmark matching benchmark borrowing cost; only contractual 2% spread ($8.4m/year) modeled through October2028, then residual8.4 released in period2028. $6.181m other restricted cash has no credited value. No Sound Point conditional facility is drawn or treated as cash.',
    otherSpectrumClosingCashM=[111.3,10,28.5,0,0,0,0,0,0,0],
    otherSpectrumClosingNote='Future cash: remaining Ligado closing30m plus all81.3m June stock-optional spectrum fees assumed settled in cash in period2027 (conservative no-subsequent-payment-credit choice). S-band anniversary10m in2028; next anniversary10m plus conditional satellite18.5m in2029. Already-paid Ligado520m and already-exercised warrants are not paid again. Future annual spectrum cash expense is separately in EBITDA. Opening81.3m is settlement of already capitalized/accrued access rights, distinct from new future-year100m+ expense; no stock-share benefit/dilution also counted for the same81.3m.',
    openingCohorts=[dict(year=2024,count=5,unitCost=30,life=5),dict(year=2025,count=1,unitCost=25,life=8),dict(year=2026,count=6,unitCost=25,life=8)],
    openingCommercialSatellites=12,
    initialCohortNote='IR 13 in-orbit spacecraft includes the test spacecraft: operational commercial proxy5 Block1+BB6+BB8-13=12; BB7 lost. Block1 five-year accounting life respected; Block2 life is scenario assumption, not guaranteed up-to-ten-year design life. Initial unit-cost book proxies are assumptions.',
    initialGroundDaM=40, groundAssetLife=10, unitCostInflation=.02,
    payoutConvention='No distributions in first five research periods; from period6 distribute all cash above $500m floor after capex, debt settlement and equity funding. These are owner-valuation cash distributions, not a prediction or announcement of company dividends. Five-year price excludes earlier dividends because first-five dividends are zero.',
    cappedCallTreatment='Baseline excludes all capped-call recoveries, after deducting purchase cash. Legal July conversion strike is $79.57, not $149.20 cap. This understates possible equity benefit and avoids relying on hedge-counterparty settlement/adjustments. Separate maximum July benefit sensitivity shown.',
    noteSettlementConvention='No assumed early conversion. At contractual maturity in the annual period, pay principal in cash if modeled ex-/cum-distribution common price is below strike, otherwise deliver principal/strike shares. Enumerate 32 treatment combinations and require self-consistency of maturity-year common value with strike. Exact intra-year path, make-whole rate changes, put/redemption events and option time value are not modeled; this is a conditional annual maturity proxy, not convertible fair-value pricing.',
)

ASSUMPTIONS={
 'bear':dict(label='悲观：迟发/低付费/融资中断',equityCost=.20,terminalGrowth=.02,retailMonthly=6,astRevenueShare=.35,
    usersM=[.3,1,3,5,8,10,12,14,16,18], fleet=[25,40,55,65,75,80,85,90,90,90],
    otherRevenueM=[150,200,250,300,350,375,400,425,450,475], serviceContribution=.65,otherContribution=.30,
    fixedOpexM=[550,600,625,650,675,690,705,720,735,750], futureCompensationIncludedM=[150]*10,
    spectrumAnnualM=120,unitSatelliteCostM=30,satelliteLife=7,launchFailureCostRate=.08,
    groundCapexM=[200,150,120,100,100,100,100,100,100,100],
    equityIssuePrice=[10]*10,maxAnnualGrossEquityM=300,maxTotalGrossEquityM=500, exitPE=12),
 'base':dict(label='基准：分阶段商业化、稳步渗透',equityCost=.16,terminalGrowth=.03,retailMonthly=7,astRevenueShare=.45,
    usersM=[2,8,20,35,50,60,70,80,90,100], fleet=[45,70,90,100,110,120,130,140,150,160],
    otherRevenueM=[200,275,350,425,500,550,600,650,700,750], serviceContribution=.78,otherContribution=.35,
    fixedOpexM=[550,575,600,625,650,675,700,725,750,775],futureCompensationIncludedM=[150,150,160,170,180,190,200,210,220,230],
    spectrumAnnualM=100,unitSatelliteCostM=25,satelliteLife=8,launchFailureCostRate=.03,
    groundCapexM=[200,150,125,100,100,100,100,100,100,100],
    equityIssuePrice=[20,20,22,25,28,30,32,34,36,38],maxAnnualGrossEquityM=2000,maxTotalGrossEquityM=5000,exitPE=20),
 'bull':dict(label='乐观：强转化、高净分成、快速扩容',equityCost=.135,terminalGrowth=.035,retailMonthly=9,astRevenueShare=.50,
    usersM=[5,20,50,80,110,135,155,175,190,205],fleet=[55,90,120,150,180,200,220,235,245,248],
    otherRevenueM=[250,375,500,625,750,850,950,1050,1150,1250],serviceContribution=.83,otherContribution=.40,
    fixedOpexM=[550,600,650,700,750,800,850,900,950,1000],futureCompensationIncludedM=[150,175,200,225,250,275,300,325,350,375],
    spectrumAnnualM=100,unitSatelliteCostM=23,satelliteLife=10,launchFailureCostRate=.02,
    groundCapexM=[200,175,150,125,125,125,125,125,125,125],
    equityIssuePrice=[35,45,55,65,75,85,95,105,115,125],maxAnnualGrossEquityM=2000,maxTotalGrossEquityM=5000,exitPE=24),
}

def build_rows(a,mask,user_multiplier=1, cash_delta=0,wip_override=None,cost_scale=1, margin_delta=0, issue_price_scale=1):
    cash=COMMON['openingCashM']+cash_delta; shares=START_SHARES
    paid_wip=COMMON['openingPaidSatelliteWipM'] if wip_override is None else wip_override
    old_nwc=COMMON['openingOperatingNwcM'];cohorts=[dict(c) for c in COMMON['openingCohorts']]
    ground=[]; trinity=48.638;raised=0;rows=[];failed=False
    for i,y in enumerate(range(2027,2037)):
        previous_count=sum(c['count'] for c in cohorts)
        retiring=[c for c in cohorts if y-c['year']>=c['life']]
        retiring_count=sum(c['count'] for c in retiring)
        old_da=sum(c['count']*c['unitCost']/c['life'] for c in cohorts if c not in retiring)
        retirement_da=sum(c['count']*c['unitCost']/c['life']/2 for c in retiring)
        cohorts=[c for c in cohorts if c not in retiring]
        end_count=a['fleet'][i]; additions=end_count-sum(c['count'] for c in cohorts)
        assert additions>=0
        unit=a['unitSatelliteCostM']*(1+COMMON['unitCostInflation'])**i*cost_scale
        gross_sat_capex=additions*unit/(1-a['launchFailureCostRate'])
        wip_used=min(paid_wip,gross_sat_capex);paid_wip-=wip_used
        cash_sat_capex=gross_sat_capex-wip_used
        new=dict(year=y,count=additions,unitCost=unit,life=a['satelliteLife']);cohorts.append(new)
        satellite_da=old_da+retirement_da+additions*unit/a['satelliteLife']/2
        ground_da=COMMON['initialGroundDaM']+sum(c/COMMON['groundAssetLife'] for c in ground)+a['groundCapexM'][i]/COMMON['groundAssetLife']/2
        ground.append(a['groundCapexM'][i]);da=satellite_da+ground_da
        users=a['usersM'][i]*user_multiplier;arpu=a['retailMonthly']*a['astRevenueShare']
        service=users*arpu*12;other=a['otherRevenueM'][i];revenue=service+other
        compensation=a['futureCompensationIncludedM'][i]
        fixed=a['fixedOpexM'][i]
        assert fixed>=compensation
        spectrum=a['spectrumAnnualM']*(1.02**i)
        ebitda=service*(a['serviceContribution']+margin_delta)+other*a['otherContribution']-fixed-spectrum
        ebit=ebitda-da
        nwc=revenue*COMMON['nwcPctRevenue'];delta_nwc=nwc-old_nwc;old_nwc=nwc
        prepay=COMMON['prepaymentNoncashRevenueM'][i]
        capex=cash_sat_capex+a['groundCapexM'][i]+COMMON['otherSpectrumClosingCashM'][i]
        operating_tax=max(ebit,0)*COMMON['taxRate']
        fcff=ebit-operating_tax+da-capex-delta_nwc-prepay
        interest=0;principal=0;converted=0;note_events=[]
        for n,conv in zip(NOTES,mask):
            if y>n['maturityYear']:continue
            annual_interest=n['principalM']*n['coupon']
            interest+=annual_interest*(n['maturityYearCoupons']/2 if y==n['maturityYear'] else 1)
            if y==n['maturityYear']:
                if conv: converted+=n['conversionSharesM']
                else:principal+=n['principalM']
                note_events.append(dict(id=n['id'],treatment='stock conversion' if conv else 'cash principal',principalM=n['principalM'],newSharesM=n['conversionSharesM'] if conv else 0,conversionPrice=n['conversionPrice']))
        trinity_interest=trinity*COMMON['trinityCashRate']
        trinity_principal=COMMON['trinityPrincipalScheduleM'][i]
        interest+=trinity_interest
        if y==2030: interest+=COMMON['trinityEndFeeM']
        trinity-=trinity_principal;principal+=trinity_principal
        ubs_spread=COMMON['ubsAnnualNetSpreadM'] if y<=2028 else 0
        interest+=ubs_spread
        release=8.4 if y==2028 else 0
        tax=max(ebit-interest,0)*COMMON['taxRate']
        tax_shield=operating_tax-tax
        fcfe_before_finance=fcff-interest+tax_shield-principal+release
        cash_before=cash+fcfe_before_finance
        deficit=max(0,COMMON['minimumCashM']-cash_before)
        gross_needed=deficit/(1-COMMON['equityIssueCost'])
        allowed=min(a['maxAnnualGrossEquityM'],max(0,a['maxTotalGrossEquityM']-raised))
        issue_gross=min(allowed,gross_needed);issue_net=issue_gross*(1-COMMON['equityIssueCost'])
        issue_price=a['equityIssuePrice'][i]*issue_price_scale
        issue_shares=issue_gross/issue_price;raised+=issue_gross
        shares_start=shares;shares+=issue_shares+converted
        cash_after=cash_before+issue_net
        shortfall=max(0,COMMON['minimumCashM']-cash_after)
        dividend=max(0,cash_after-COMMON['minimumCashM']) if i>=5 and shortfall<1e-7 else 0
        cash_end=cash_after-dividend
        row=dict(year=y,t=i+1,periodEnd=f'{y}-11-04',usersM=users,retailMonthly=a['retailMonthly'],astRevenueShare=a['astRevenueShare'],netMonthlyArpu=arpu,
            serviceRevenueM=service,otherRevenueM=other,revenueM=revenue,serviceContributionMargin=a['serviceContribution']+margin_delta,
            otherContributionMargin=a['otherContribution'],fixedEconomicOpexM=fixed,futureCompensationIncludedM=compensation,spectrumCashOpexM=spectrum,
            ebitdaM=ebitda,satelliteDaM=satellite_da,groundDaM=ground_da,daM=da,ebitM=ebit,operatingTaxM=operating_tax,taxM=tax,taxShieldM=tax_shield,
            startFleet=previous_count,retiredSatellites=retiring_count,newSatellites=additions,endFleet=end_count,unitSatelliteCostM=unit,
            grossSatelliteProcurementM=gross_sat_capex,prepaidWipUsedM=wip_used,remainingPrepaidWipM=paid_wip,cashSatelliteCapexM=cash_sat_capex,
            groundCapexM=a['groundCapexM'][i],spectrumClosingCapexM=COMMON['otherSpectrumClosingCashM'][i],cashCapexM=capex,
            operatingNwcM=nwc,deltaNwcM=delta_nwc,noncashPrepaidRevenueM=prepay,fcffM=fcff,
            interestCashM=interest,trinityPrincipalM=trinity_principal,principalCashM=principal,ubsCollateralResidualReleaseM=release,noteEvents=note_events,
            fcfeBeforeNewEquityM=fcfe_before_finance,startCashM=cash,cashBeforeEquityM=cash_before,equityGrossNeededM=gross_needed,
            equityGrossM=issue_gross,equityNetM=issue_net,equityFeeM=issue_gross-issue_net,equityIssuePrice=issue_price,equityIssuedSharesM=issue_shares,
            noteConvertedSharesM=converted,startSharesM=shares_start,endSharesM=shares,endCashM=cash_end,
            financingShortfallM=shortfall,distributionM=dividend,distributionPerShare=dividend/shares,financingGrossCumulativeM=raised)
        rows.append(row);cash=cash_end
        if shortfall>1e-7:failed=True;break
    return rows,failed

def finish(a,mask,rows,failed):
    if failed:
        return dict(rows=rows,failed=True,failureYear=rows[-1]['year'],todayValue=0,year5Price=0,totalReturn=-1,cagr=-1,terminalEquityM=0,terminalPerShare=0,terminalGrowthFCFFM=0,maturityChecks=[],
         projectStopReason='Assumed project stop when research financing caps cannot sustain500m liquidity reserve, with zero common liquidation recovery. This is a deliberate full-loss stress, not a prediction of legal insolvency.',
         stopCashM=rows[-1]['endCashM'],reserveShortfallM=rows[-1]['financingShortfallM'],hardNegativeCash=rows[-1]['endCashM']<0,
         post2031DilutionNote='Financing stops at explicitly assumed availability caps; no liquidation recovery assumed; common failure value0 is a full-loss stress, not a prediction.')
    last=rows[-1];g=a['terminalGrowth'];ke=a['equityCost']
    assert ke>g
    tr_revenue=last['revenueM']*(1+g)
    tr_ebitda=last['ebitdaM']*(1+g)
    # Long-run replacement at current cost, not historical depreciation. Growth capex is additional.
    sat_maintenance=last['endFleet']*last['unitSatelliteCostM']*(1+g)/a['satelliteLife']/(1-a['launchFailureCostRate'])
    ground_maintenance=last['groundDaM']*(1+g)
    economic_da=sat_maintenance+ground_maintenance
    terminal_ebit=tr_ebitda-economic_da
    terminal_tax=max(terminal_ebit,0)*COMMON['taxRate']
    asset_base=last['endFleet']*last['unitSatelliteCostM']*(1+g)+400+sum(a['groundCapexM'])
    growth_capex=g*asset_base
    terminal_capex=sat_maintenance+ground_maintenance+growth_capex
    terminal_delta_nwc=last['operatingNwcM']*g
    terminal_fcff=terminal_ebit-terminal_tax+economic_da-terminal_capex-terminal_delta_nwc
    terminal_surplus_cash=max(0,last['endCashM']-COMMON['minimumCashM'])
    terminal_equity=max(0,terminal_fcff/(ke-g))+terminal_surplus_cash
    terminal_ps=terminal_equity/last['endSharesM']
    price_after={2036:terminal_ps}
    for row in reversed(rows[:-1]):
        nxt=rows[rows.index(row)+1]
        price_after[row['year']]=(nxt['distributionPerShare']+price_after[nxt['year']])/(1+ke)
    today=(rows[0]['distributionPerShare']+price_after[2027])/(1+ke)
    p5=price_after[2031]
    checks=[]
    for n,conv in zip(NOTES,mask):
        r=next(r for r in rows if r['year']==n['maturityYear'])
        maturity_stock_value=price_after[n['maturityYear']]+r['distributionPerShare']
        consistent=(maturity_stock_value>=n['conversionPrice']-1e-7) if conv else (maturity_stock_value<=n['conversionPrice']+1e-7)
        checks.append(dict(id=n['id'],converted=bool(conv),maturityPrice=maturity_stock_value,strike=n['conversionPrice'],consistent=consistent))
    return dict(rows=rows,failed=False,todayValue=today,year5Price=p5,totalReturn=p5/PRICE-1,cagr=(p5/PRICE)**.2-1,
       terminal=dict(g=g,equityCost=ke,revenueM=tr_revenue,ebitdaM=tr_ebitda,economicDaM=economic_da,ebitM=terminal_ebit,taxM=terminal_tax,
       replacementSatelliteCashM=sat_maintenance,replacementGroundCashM=ground_maintenance,assetBaseM=asset_base,growthCapexM=growth_capex,
       totalCapexM=terminal_capex,deltaNwcM=terminal_delta_nwc,fcffM=terminal_fcff,operatingValueM=max(0,terminal_fcff/(ke-g)),cashM=last['endCashM'],surplusCashM=terminal_surplus_cash,equityValueM=terminal_equity,
       perShare=terminal_ps,incrementalReinvestmentRate=growth_capex/max(1,terminal_ebit-terminal_tax),growthImpliedRoic=(terminal_ebit-terminal_tax)*g/max(1,growth_capex),
       note='All convertible principal settled by2036; terminal therefore unlevered FCFF equals equity operating cash. No NOL/capped-call asset or separate NCI deduction. Replacement plus growth capex both paid. g below Ke. No perpetual external funding is assumed; positive terminal FCFF must fund growth and replacement.'),
       maturityChecks=checks, priceAfterDistributionByYear=price_after,
       terminalPvFraction=(terminal_ps/(1+ke)**10)/today if today else None,
       post2031DilutionNote='2031 price is sum of future distributions divided by the actual future end-share count at each payment plus terminal value divided by2036 end shares, all discounted to2031. It is not terminal EV divided by the2031 share count.')

def run(a,**kwargs):
    consistent=[]; failures=[]
    for mask in itertools.product([False,True],repeat=len(NOTES)):
        rows,failed=build_rows(a,mask,**kwargs);r=finish(a,mask,rows,failed)
        if failed:
            failures.append(r)
            continue
        if all(c['consistent'] for c in r['maturityChecks']):consistent.append(r)
    if not consistent:
        if len(failures)==32:return failures[0]
        raise RuntimeError('No self-consistent debt/stock maturity treatment')
    # Rare threshold multiplicity gets conservative treatment, explicitly recorded.
    r=min(consistent,key=lambda r:r['todayValue']);r['consistentSettlementSolutions']=len(consistent)
    return r

def pe_crosscheck(a,r):
    if r['failed']:return dict(status='financing-failure',todayValue=0,year5Price=0,totalReturn=-1,cagr=-1)
    row=r['rows'][4];base_shares=row['endSharesM'];base_ebit=row['ebitM']
    coupon=sum(n['principalM']*n['coupon'] for n in NOTES)
    excess=max(0,row['endCashM']-COMMON['minimumCashM'])
    cases=[]
    for mask in itertools.product([False,True],repeat=5):
        convshares=sum(n['conversionSharesM'] for n,c in zip(NOTES,mask) if c)
        remain_coupon=sum(n['principalM']*n['coupon'] for n,c in zip(NOTES,mask) if not c)
        income=max(0,(base_ebit-remain_coupon)*(1-COMMON['taxRate']))
        eq=income*a['exitPE']+excess
        price=eq/(base_shares+convshares)
        good=all((price>=n['conversionPrice'] if c else price<=n['conversionPrice']) for n,c in zip(NOTES,mask))
        if good:cases.append((price,income,base_shares+convshares,mask))
    if not cases:raise RuntimeError('PE conversion inconsistency')
    price,income,shares,mask=min(cases)
    return dict(status='conditional-independent-normalized-earnings',year5Price=price,todayValue=price/(1+a['equityCost'])**5,
      netIncomeM=income,exitPE=a['exitPE'],base2031EconomicEbitM=base_ebit,originalNoteCouponM=coupon,fullyConvertedForEps=[n['id'] for n,c in zip(NOTES,mask) if c],
      sharesM=shares,excessCashM=excess,totalReturn=price/PRICE-1,cagr=(price/PRICE)**.2-1,
      note='Independent normalized2031 earnings-capitalization method. P/E12/20/24 are explicit research multiples, not verified live peer quotes. EPS includes future cash replacement compensation and economic depreciation. Existing notes use an as-converted diluted-EPS proxy only when resulting price exceeds legal strike; principal is not additionally deducted from a P/E equity value. No hedge offset credited. This lens assumes refinancing/conversion of debt is achievable and is less sensitive to post2031 capital needs than cash-waterfall DCF, so disagreement is a risk signal, not a vote average.')

sources=[
 dict(id='q2-10q',title='ASTS Q2 2026 Form10-Q, statements and notes4/6/9/10/11/12/13/14',date='2026-08-10',period='2026-06-30',url='https://www.sec.gov/Archives/edgar/data/1780312/000119312526342550/asts-20260630.htm',raw='asts-2026-08-10-10-q.txt'),
 dict(id='fy25-10k',title='ASTS FY2025 Form10-K, audited2023-25 statements and debt notes',date='2026-03-02',period='2025-12-31',url='https://www.sec.gov/Archives/edgar/data/1780312/000178031226000006/asts-20251231.htm',raw='asts-2026-03-02-10-k.txt'),
 dict(id='fy22-10k',title='ASTS FY2022 Form10-K,2021/22 Nano revenue and Up-C combination',date='2023-03-31',url='https://www.sec.gov/Archives/edgar/data/1780312/000095017023011124/asts-20221231.htm',raw='asts-2023-03-31-10-k.txt'),
 dict(id='q2-release',title='Company Q2 business update / nonGAAP reconciliation',date='2026-08-10',url='https://www.sec.gov/Archives/edgar/data/1780312/000119312526342540/asts-ex99_1.htm',raw='asts-q2-2026-asts-ex99_1.htm.txt'),
 dict(id='q2-deck',title='Company Q2 presentation;45 early2027 / backlog / beta / spacecraft',date='2026-08-10',url='https://www.sec.gov/Archives/edgar/data/1780312/000119312526342540/asts-ex99_2.htm',raw='asts-q2-2026-asts-ex99_2.htm.txt'),
 dict(id='july-offer',title='July20 debt closing8-K; initial1bn net983.6m, terms/hedge',date='2026-07-20',url='https://www.sec.gov/Archives/edgar/data/1780312/000149315226033912/form8-k.htm',raw='asts-2026-07-20-8-k.txt'),
 dict(id='july-liquidity',title='July15 liquidity and offering8-K',date='2026-07-15',url='https://www.sec.gov/Archives/edgar/data/1780312/000149315226033365/form8-k.htm',raw='asts-2026-07-15-8-k.txt'),
 dict(id='sep-coc',title='Sept28 compensation COC policy8-K; no change-of-control transaction',date='2026-09-28',url='https://www.sec.gov/Archives/edgar/data/1780312/000149315226044647/form8-k.htm',raw='asts-2026-09-28-8-k.txt'),
 dict(id='oct-cfo',title='Oct20 CFO employment8-K',date='2026-10-20',url='https://www.sec.gov/Archives/edgar/data/1780312/000149315226047766/form8-k.htm',raw='asts-2026-10-20-8-k.txt'),
 dict(id='sec-submissions',title='SEC full recent filing list through Nov4; no later10-Q or financing8-K',date='accessed2026-11-04',url='https://data.sec.gov/submissions/CIK0001780312.json',raw='asts-sec-submissions-2026-11-05.json'),
 dict(id='sec-companyfacts',title='SEC XBRL; cross-check only, original statements control when tags mix parent/consolidated/rounded cash',date='accessed2026-11-04',url='https://data.sec.gov/api/xbrl/companyfacts/CIK0001780312.json',raw='asts-sec-companyfacts-2026-11-05.json'),
 dict(id='quote-moomoo',title='Moomoo quote in real Chrome; regular35.62, post35.88',date='2026-11-04 17:44 ET tick;captured22:45:30.651UTC',url='https://www.moomoo.com/stock/ASTS-US',raw='asts-quote-browser-2026-11-05-refreshed.json'),
 dict(id='q3-date',title='Company events;Q3 Nov9, not published as of research cutoff',date='accessed2026-11-04',url='https://investors.ast-science.com/events'),
 dict(id='oct-readiness',title='AST official Oct20 readiness release via issuer BusinessWire',date='2026-10-20',url='https://www.businesswire.com/news/home/20261020527793/en/',raw='asts-readiness-2026-11-05.json'),
 dict(id='brazil',title='AST official Brazil authorization/ground plan via issuer BusinessWire',date='2026-10-26',url='https://www.businesswire.com/news/home/20261026540919/en/',raw='asts-brazil-2026-11-05.json'),
 dict(id='fcc',title='FCC248 satellite and SCS grant with conditions, reviewed independently by parent',date='2026-04-21',url='https://docs.fcc.gov/public/attachments/DA-26-391A1.txt',raw='asts-parent-fcc-2026-11-05.json'),
 dict(id='att-handoff',title='AT&T successful Oct21 handoff disclosure;still advancing beta/commercial',date='2026-11-02',url='https://about.att.com/story/2026/att-ast-spacemobile-engineering-connected-world.html',raw='asts-parent-att-handoff-2026-11-05.json'),
 dict(id='starlink',title='Starlink official mobile offering, parent independent capture',date='accessed2026-11-04',url='https://starlink.com/business/mobile',raw='asts-parent-starlink-2026-11-05.json'),
 dict(id='tmobile',title='T-Satellite official live commercial pricing/limitations, parent review',date='accessed2026-11-04',url='https://www.t-mobile.com/coverage/satellite-phone-service',raw='asts-parent-tmobile-2026-11-05.json'),
]

history=[]
histrows=[
 (2021,12.405,7.563,91.588,-73.261,-30.553,-80.095,15.080,3.736,2.913,321.787,'fy22-10k'),
 (2022,13.825,6.714,152.875,-103.113,-31.640,-156.464,57.284,9.391,4.711,238.588,'fy22-10k'),
 (2023,0,None,222.367,-222.677,-87.561,-148.942,118.807,13.289,54.469,85.622,'fy25-10k'),
 (2024,4.418,None,247.180,-526.330,-300.083,-126.143,174.127,32.039,63.340,564.988,'fy25-10k'),
 (2025,70.918,35.216,358.631,-461.011,-341.940,-71.517,1064.741,47.490,51.111,2335.683,'fy25-10k'),
]
for year,rev,cogs,opex,conni,parentni,cfo,cap,sbc,da,cash,src in histrows:
    # Before2023 cost-of-sales was outside displayed total operating expenses.
    ebit=rev-opex-(cogs if year<2023 else 0)
    history.append(dict(period=f'FY{year}',revenueM=rev,costRevenueReportedM=cogs,grossMargin=(rev-cogs)/rev if cogs is not None and rev else None,
        ebitM=ebit,operatingMargin=ebit/rev if rev else None,netLossConsolidatedM=conni,netLossParentCommonM=parentni,
        cfoM=cfo,cashCapexM=cap,reportedFcfM=cfo-cap,sbcExpenseM=sbc,daM=da,unrestrictedCashM=cash,sourceId=src,
        note='2021/22 revenue from NanoAvionics sold Sep2022, not satellite broadband;2021 parent P&L loss30.553 includes pre-combination portion, EPS numerator18.973 differs.' if year<2023 else '2023/24 cost of revenue not separately presented; do not label gross margin100%.2025 revenue gateways/government, no SpaceMobile access revenue.'))

h126=dict(period='H1 2026',revenueM=46.255,costRevenueReportedM=35.216,operatingExpensesM=493.244,ebitM=46.255-493.244,
    netLossConsolidatedM=-549.5,netLossParentCommonM=-421.921,cfoM=-145.212,cashCapexM=859.215,sbcExpenseM=118.820,capitalizedSbcM=4.080,
    daM=38.279,interestExpenseM=50.355,cashInterestM=23.556,sourceId='q2-10q')
h125=dict(period='H1 2025',revenueM=1.874,operatingExpensesM=137.634,ebitM=1.874-137.634,netLossConsolidatedM=-199.531,
    netLossParentCommonM=-145.1,cfoM=-72.024,cashCapexM=430.622,sbcExpenseM=18.351,daM=22.678,interestExpenseM=10.393,sourceId='q2-10q')
ttm=dict(period='TTM ended2026-06-30',formula='FY2025 + H12026 - H12025; parent and consolidated NI kept separate',sourceIds=['fy25-10k','q2-10q'])
for key in ['revenueM','ebitM','netLossConsolidatedM','netLossParentCommonM','cfoM','cashCapexM','sbcExpenseM','daM']:
    ttm[key]=history[-1][key]+h126[key]-h125[key]
ttm['reportedFcfM']=ttm['cfoM']-ttm['cashCapexM']
ttm['operatingMargin']=ttm['ebitM']/ttm['revenueM']

facts=dict(history=history,interim=[h125,h126],ttm=ttm,
 identity=dict(company='AST SpaceMobile, Inc.',symbol='ASTS',exchange='Nasdaq Global Select Market',shareClass='Class A common $0.0001 par',currency='USD',sourceId='q2-10q'),
 financialCutoff=dict(latestCompletePeriod='2026-06-30',latestAnnualPeriod='2025-12-31',q3Scheduled='2026-11-09 17:00 America/New_York',sourceIds=['sec-submissions','q3-date']),
 revenueRecognition=dict(statement='No SpaceMobile Service revenue recognized as of June30; all revenue currently equipment/software and government performance obligations. Partner subscriber reach is distribution opportunity, not paying AST users. Variable MNO revenue share constrained/excluded fromRPO.',contractLiabilityM=266.933,rpoApproxM=1200,rpoNext12Months=.066,augustCompanyBacklogApproxM=1300,sourceIds=['q2-10q','q2-release']),
 currentBalanceSheet=dict(date='2026-06-30',unrestrictedCashM=2288.253,totalRestrictedCashM=434.581,currentRestrictedM=6.181,noncurrentRestrictedM=428.4,
   totalCashIncludingRestrictedM=2722.834,netPpeM=2069.336,grossPpeM=2281.247,constructionSatelliteLaunchM=1724.085,
   assetsM=5854.885,liabilitiesM=3457.307,nciBookEquityM=503.561,accountsReceivableM=79.297,inventoryM=28.417,prepaidM=16.729,accountsPayableM=60.615,accruedM=103.340,sourceId='q2-10q'),
 cashFlowQuality=dict(statement='H1 net loss549.5→CFO-145.212 supported by SBC118.820, noncash inducement88.654, satellite writeoff125.911, D&A38.279; working-capital/advance receipts help cash but are not sustainable profits. FY25CFO-71.517 includes contract-liability inflow161.516. H1 investment adds cash spectrum42.103+Ligado advance100 outside cashPP&E859.215; all-investing cash-979.723 including21.595 insurance. ReportedCFO-CapEx is not FCFF.',h1NwcCashChangesM=dict(ar=-41.571,prepaidOther=-8.598,inventory=-16.410,apAccrued=45.552,contractLiability=39.952,other=-5.669),
   fy25ContractLiabilityInflowM=161.516,h1EmployeeWithholdingFinancingCashM=62.025,
   employeeWithholdingNote='Actual H1cash62.025m for employee withholding is financing outflow, not CFO, so CFO-CapEx omits it. Existing probable awards in this model use grossclaim dilution and zero credited exercise proceeds; no additional future withholding cash is charged for those same grossclaims. New future compensation is an explicit economic cash replacement in fixedOpex.',sourceIds=['q2-10q','fy25-10k']),
 normalizations=dict(h1GaapEbitM=-446.989,h1EbitExSatelliteLossM=-321.078,h1EbitExSatelliteLossAndSbcM=-202.258,h1AdjustedOpexM=210.234,
   statement='Adjusted operating costs remove D&A/SBC and satellite loss; these are not adjusted net profit or free cash. SBC retained economically in forecasts. BB7 loss excluded from normalized EBIT only, not historical capex or replacement risk.',sourceIds=['q2-release','q2-10q']),
 satelliteLoss=dict(date='2026-04-19',statement='New Glenn3 placed BB7 below planned orbit; BB7 deorbited. Insurance32.5 gross versus net loss125.911; promised replacement launch is not a replacement satellite.',netLossM=125.911,insuranceTotalM=32.5,insuranceCollectedM=21.595,insuranceReceivableM=10.9,sourceId='q2-10q'),
 deployment=dict(asOf='2026-08-10',spacecraftInOrbit=13,commercialSatelliteProxy=12,productionThrough=46,target='~45 satellites in orbit early2027; beta noncommercial2026;~25 noncontinuous selected markets,45-60continuouskeymarkets,~90targetedgeographies; capacity beyond90 requires additional satellites',directMaterialAndLaunchTargetUnitCostM=[21,23],costCaveat='Initial launches above range; estimate excludes certain initial validation satellites and relies on favorable future launch contracts, economies and cost reductions. Not total company investment per deployed satellite.',purchaseCommitmentsM=[775,795],sourceIds=['q2-deck','q2-10q']),
 octoberReadiness=dict(statement='Oct20 targets intermittent initial coverage before YE2026 inUS/Canada/Japan/UK/Saudi. More than60 gateways deployed/installed/or planning includes unfinished sites.3000cells enabled,~5600contiguousUS footprint planned; not continuous coverage.Production throughBB50 means in-process, not50finished/inorbit.',sourceId='oct-readiness'),
 brazil=dict(statement='Company reports Anatel30MHzS-band and secondary700MHz up to20MHz via four regional operators within licensed territories; four planned gateways; subject to authorizations/device compatibility/commercial arrangements, no disclosed cash economics or service date.',sourceId='brazil'),
 latestHandoff=dict(statement='AT&TNov2 reports Oct21successfulterrestrial/satellitehandoff with Ericsson/Nokia support. Technical milestone, still moving toward beta/commercial; no proven paying-user volume.',sourceId='att-handoff'),
 legal=dict(statement='June10Q management did not identify at least reasonably possible material litigation loss; latest Sept28/Oct20SEC8Ks are compensation/employment, not financing/control transactions. No inference that all legal/regulatory risk is absent.',sourceIds=['q2-10q','sep-coc','oct-cfo']),
 spectrum=dict(ligadoAdvanceAlreadyPaidM=520,ligadoRemainingClosingM=30,ligadoAnnualMinimumM=80,stockOptionalFeesAccruedM=81.3,
  statement='Ligado closing remains conditional on approvals;520capitaladvance not cash;100held in court escrow. Lband annual≥80 plus revenue share, CrownCastle usage+30%premium.550SoundPoint conditional undrawn facility not spendable cash; availability Oct5with180dayextension at1%fee uncertainasofNov; do not assume extension/draw. SpectrumCo/RevenueCo assets ring-fenced.',sourceIds=['q2-10q','fy25-10k']),
 roic=dict(value=None,reason='Precommercial loss maker; no mature positive NOPAT. LegacyNano revenue and extensive WIP make five-year ROIC/gross-margin trend unsuitable as maturity indicator. Cash-based reinvestment paths shown instead.',sourceIds=['fy22-10k','fy25-10k','q2-10q']))

capital=dict(asOfShares='2026-08-06',classASharesM=299.789305,classBSharesM=11.215111,classCSharesM=78.163078,economicCommonUnitsM=ECONOMIC_SHARES,
 authorizedSharesM=dict(A=800,B=200,C=125,preferred=100),preferredOutstandingM=0,
 classBAndCNote='Non-economic voting securities paired1:1 with redeemable ASTLLC units. Add paired units once toA to value consolidated operations; do not additionally subtract NCI book value. Exchange intoA cancelsB/C and does not by itself create a second economic claim.',
 june30TotalEconomicUnitsM=299.731073+11.215111+78.163078,june30NciPercent=.23,
 probableAwardsM=12.159478,allPlansGrossOptionsM=4.283302+1.755869+.055718,allPlansGrossRsusAndRestrictedStockM=.832699+8.084112,
 additionalContingentOrScopeDifferenceM=2.852222,
 probableAwardsCaveat='ProbableEPSnote12.159478 differs from gross all-plan15.011700; some awards require unprobable performance and restricted-stock scope may overlap issued shares. Full gross difference is conservative sensitivity, not claimed current diluted shares.',
 options=[dict(plan='ASTLLC2019',sharesM=4.283302,exercisePrice=.95),dict(plan='2020',sharesM=1.755869,exercisePrice=8.95),dict(plan='2024',sharesM=.055718,exercisePrice=25)],
 rsu2020M=.832699,rsuAndStock2024M=8.084112,unrecognizedCompensationM=2.3+7.8+.5+289.8,
 warrants=dict(privatePlacementOutstanding=0,ligadoPennyOutstanding=0,statement='122000privatewarrants exercised109499shares and4.714226mpenny warrants exercised4.713671mshares cashless inQ12026, already in A. Do not add again.'),
 actualDebtJune30M=3022.152,actualDebtPlusJulyGrossM=4172.152,nonUbsDebtModelStartM=3752.152,notes=NOTES,
 debtNote='Debt principal not carrying amount netfees; no $50.236m issuance-cost addback treated as cash. July debt added once with matched net cash. Coupons modeled through legal maturity; conversions only under consistent conditional settlement, never both equity dilution and principal repayment for same note.',
 atm=dict(status='October2025$800mATMnearlyfullyused/terminatedMarch17,2026',q126SharesIssuedM=.874045,q126NetM=80.3,
   otherEquityCashH126M=85.265,statement='Previouslyissued ordinaryshares/repurchasefundings already in A. Registered capacity or authorized800mAshares is not new cash or automaticallyissued stock. No unreported new ATM assumed from stale shelf; recent SEC submissions checked throughNov4.'),
 tra=dict(recordedLiabilityM=0,savingsShare=.85,statement='85%of qualifying realized tax savings payable to TRA holders; parent-only claim; full DTA valuation allowance means no recordedTRA liability asofJune. Change-of-control/earlytermination couldacceleratepayments usingassumptions. NoextraNOL/stepupbenefitcredited in model, but tail unquantified; failurestressmayloseall.'),
 sourceIds=['q2-10q','fy25-10k','july-offer','sec-submissions'])

scenarios=[]
for key,a in ASSUMPTIONS.items():
    r=run(a);r['id']=key;r['label']=a['label'];r['assumptions']=a;r['secondMethod']=pe_crosscheck(a,r)
    if not r['failed']:
        r['year5Operating']={k:r['rows'][4][k] for k in ['usersM','netMonthlyArpu','revenueM','ebitM','fcffM','cashCapexM','endFleet','endCashM','endSharesM','financingGrossCumulativeM']}
    scenarios.append(r)

base=ASSUMPTIONS['base']; base_result=scenarios[1]
sens=[]
for ke in [.14,.16,.18,.20]:
    for g in [.02,.03,.04]:
        a={**base,'equityCost':ke,'terminalGrowth':g};r=run(a)
        sens.append(dict(equityCost=ke,g=g,todayValue=r['todayValue'],year5Price=r['year5Price']))

stress=[]
for name,kw in [
 ('zero-reusable-prepaid-WIP',dict(wip_override=0)),('full1700-prepaid-WIP',dict(wip_override=1700)),
 ('opening-cash600-lower',dict(cash_delta=-600)),('satellite-cost50pct-higher',dict(cost_scale=1.5)),
 ('net-users30pct-lower',dict(user_multiplier=.7)),('contribution-margin10pp-lower',dict(margin_delta=-.10)),
 ('equity-financing-at-half-price',dict(issue_price_scale=.5)),
 ('equity-financing-at-quarter-price',dict(issue_price_scale=.25)),
 ('equity-financing-at-tenth-price',dict(issue_price_scale=.1)),
 ('combined-users30lower-cost50higher-cash600lower-half-issue-price',dict(user_multiplier=.7,cost_scale=1.5,cash_delta=-600,issue_price_scale=.5))]:
    try:
        r=run(base,**kw)
        stress.append(dict(name=name,inputs=kw,todayValue=r['todayValue'],year5Price=r['year5Price'],failed=r['failed'],failureYear=r.get('failureYear'),
          totalGrossEquityM=r['rows'][-1]['financingGrossCumulativeM'],endingSharesM=r['rows'][-1]['endSharesM'],endingCashM=r['rows'][-1]['endCashM'],reserveShortfallM=r['rows'][-1]['financingShortfallM'],hardNegativeCash=r['rows'][-1]['endCashM']<0))
    except RuntimeError as exc:
        stress.append(dict(name=name,inputs=kw,todayValue=None,year5Price=None,status='annual-conversion-proxy-indeterminate',reason=str(exc),
         note='Do not turn an unresolved cash/stock settlement threshold into zero or a falsely precise number. Finance issue-price and conversion feedback need a finer intra-year model.'))

lo=.01;hi=10
for _ in range(70):
    mid=(lo+hi)/2;r=run(base,user_multiplier=mid)
    if r['todayValue']<PRICE:lo=mid
    else:hi=mid
multiple=(lo+hi)/2;reverse_result=run(base,user_multiplier=multiple)
reverse=dict(targetPrice=PRICE,method='Solve uniform multiplier on base paid-equivalent users only; keep base retail/share/margins/fleet/capex/financing policies and taxes. This is one conditional solution, not the actual unique market forecast.',
    userMultiplier=multiple,users2031M=base['usersM'][4]*multiple,users2036M=base['usersM'][-1]*multiple,
    year2031=reverse_result['rows'][4],todayValueReconstructed=reverse_result['todayValue'],
    feasibility='No independently disclosed sustainable whole-satellite throughput, busy-hour geographic loading, churn, realized ARPU or commercial capacity sold. Holding the fleet fixed while scaling users is an unvalidated commercial/technical requirement, not proof it fits. Regional/spot-beam constraints can dominate global average.')

capacity=[]
for users,fleet,label in [(50,110,'base2031'),(110,180,'bull2031'),(reverse['users2031M'],110,'reverse2031')]:
    for gb in [.1,1,5]:
        mean_total_gbps=users*1e6*gb*8/(30*24*3600)
        capacity.append(dict(case=label,paidEquivalentUsersM=users,fleet=fleet,monthlyGbPerUser=gb,meanGlobalGbps=mean_total_gbps,
          usefulGeographicDuty=.30,protocolPayloadEfficiency=.75,requiredGrossGbpsPerUsefulSatellite=mean_total_gbps/(fleet*.30*.75)))

model=dict(schema='asts-evidence-model/v1',status='pending-independent-audit',symbol='ASTS',company='AST SpaceMobile, Inc.',analysisDate='2026-11-05',
 informationCutoffUtc=datetime.now(timezone.utc).isoformat(),currency='USD',units='All money USD millions and shares million unless explicitly USD/share, percentages or counts.',
 market=dict(price=PRICE,status='observed after-hours last trade, not executable quote',timestampText='Post17:44ETNov4',timestampUtc='2026-11-04T22:44:00Z',capturedAtUtc='2026-11-04T22:45:30.651Z',regularClose=35.62,regularCloseTimestamp='2026-11-04T21:00:00Z',
  quoteDate='2026-11-04',timezone='America/New_York EST UTC-5',sourceId='quote-moomoo',economicCommonMarketCapM=ECONOMIC_SHARES*PRICE,note='RealChromequote; market-cap widget10.68bn usesA-only economic scope. All389.167494meconomicunits must enter consolidated valuation. Tick timestamp precision is one minute, independent of capture timestamp.'),
 facts=facts,capital=capital,sources=sources,methodology=COMMON,scenarios=scenarios,
 stress=dict(baseKeGMatrix=sens,linkedOperatingAndFinancingStress=stress,additionalContingentAwardFullDilutionPct=2.852222/START_SHARES,
  financingValidityNote='All funding caps and issueprices are research assumptions, not committed facilities. Base2029/30/34/36 assumed issueprices22/25/34/38 materially exceed same-case modeled common value near7/8/12/15; successful financing at these prices is not assured and must not support an unconditional entry ladder. Tenth-price stress exceeds current800m authorizedClassA capacity after awards/conversions and would require further shareholder authorization; it is conditional on that authorization as well as funding, not presently executable capacity.',
  noFurtherFinancingTail='If equity/launch/spectrum authorizations cannot be obtained, operating case does not survive. Common value can be0. No probabilities invented.',
  cappedCallMaximumJulyBenefitM=NOTES[2]['conversionSharesM']*(149.1975-NOTES[2]['conversionPrice']),
  cappedCallBenefitNote='Undiscounted theoretical maximum for July calls only, if valid and fullysettled in-the-money at cap; not included baseline; no double use of spent premium or legal conversionstrike.'),
 reverse=reverse,capacityRequirementCrosscheck=dict(rows=capacity,note='Illustrative data demand, not verified satellite capacity. Neither10GHzprocessingbandwidth nor200Mbpspeak-per-user proves sustainableaggregateGbps.0.1GBlightbackup is verydifferentfrom5GBmassbroadband.'),
 limitations=[
  'Conditional research valuations, low confidence; not currently verified commercial earnings power or a precise appraisal. Commercial broadband access revenue and paying-equivalent subscribers remain unproven.',
  'Latest full financials June30, sharecount Aug6; no exact Novembercash/sharecount. Bridge uses explicit research assumptions and latest reported balances; material capital unknowns persist beforeNov9Q3.',
  'Two valuation lenses share unproven operating inputs; cashflow and matureearnings logic differ, but convergence would not independentlyvalidate throughput/pricing.',
  'Future issueprices/availability, userconversion, ASTnetshare, capexcashWIPcredit, margin, usefulsatellitelife, licensefees and terminalgrowth are research assumptions, not contractualguidance.',
  'Annual conversion treatment ignores pathdependent earlyputs/makewhole and option timevalue; baseline foregoes cappedcallbenefit. Legal conversionstrike79.57 distinct from149.20hedgecap.',
  'TRA acceleration/liability and contingent performanceawarddetails not precisely measurable; no taxasset benefit or NCIbookdeduction used. No probability-weightedexpectedvalue invented.',
  'Required sustainable satellitecapacity/spot-beambusyhourloading cannot be independentlyvalidated from disclosedpeakmetrics. Treatbase/bull and reverse as conditions toverify, not capacity-certifiedforecasts.',
  'No portfolio, manualprice, application job, order or trading data altered.'
 ])
OUT.write_text(json.dumps(model,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf8')
print(OUT)
for s in scenarios:
    print(s['id'], 'DCF',round(s['todayValue'],4),'2031',round(s['year5Price'],4),'CAGR',round(s['cagr'],4),'PE',round(s['secondMethod']['todayValue'],4),round(s['secondMethod']['year5Price'],4),'equity',round(s['rows'][-1]['financingGrossCumulativeM'],3),'shares',round(s['rows'][-1]['endSharesM'],3))
print('reverse_users2031',reverse['users2031M'])
