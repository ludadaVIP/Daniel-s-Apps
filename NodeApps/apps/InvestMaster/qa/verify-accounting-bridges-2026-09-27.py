"""Independent exact arithmetic for selected teaching ledgers in all 8 accounting lessons.

No app formulas or learner records are imported. These checks verify the stated
hypothetical conditions, not accounting compliance of an actual company.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_HALF_UP

checks = 0


def check(actual, expected, places=None):
    global checks
    actual, expected = F(str(actual)), F(str(expected))
    if places is None:
        assert actual == expected, (actual, expected)
    else:
        with localcontext() as ctx:
            ctx.prec = 40
            d = Decimal(actual.numerator)/Decimal(actual.denominator)
            e = Decimal(expected.numerator)/Decimal(expected.denominator)
            assert d.quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP) == e, (d,e)
    checks += 1


def pv(flows, rate):
    return sum(F(str(c))/(1+rate)**t for t,c in enumerate(flows, 1))


# Three statements: independent direct receipts/payments and indirect bridge.
income, cogs, opex, depreciation, interest, tax = map(F,[200,120,40,10,5,5])
ni = income-cogs-opex-depreciation-interest-tax
receipts = income-(35-30)
purchases = cogs+(45-40)
supplier_payments = purchases-(30-25)
cfo_direct = receipts-supplier_payments-opex-interest-tax
cfo_indirect = ni+depreciation-(35-30)-(45-40)+(30-25)
check(ni,20)
check(receipts,195)
check(purchases,125)
check(supplier_payments,120)
check(cfo_direct,25)
check(cfo_direct,cfo_indirect)
cash, ppe, debt, equity = 20+cfo_direct-20-10, F(100+20-10), F(65-10), 100+ni
check(cash,15)
check(ppe,110)
check(debt,55)
check(equity,120)
check(cash+35+45+ppe,30+debt+equity)
check(cash-3+35+45+ppe,30+debt+equity-3)

# Working capital: clean ledger assumptions, followed by distinct credit-purchase proxy.
check((70+45-38)-(50+40-30),17)
check(30+8-17,21)
check(30+8-17-15,6)
nwc0=F(100+60-50-20)
nwc1=F(150+80-65-50)
nwc2=F(140+70-60-20)
check(nwc0,90)
check(nwc1,115)
check(nwc2,130)
check(90+20-(nwc1-nwc0),85)
check(70+20-(nwc2-nwc1),75)
check(90+20-((150+80-65-20)-nwc0),55)
dso=F(125,600)*365
dio=F(70,360)*365
dpo_proxy=F('57.5')/360*365
dpo_credit=F('57.5')/380*365
check(dso,'76.04',2)
check(dio,'70.97',2)
check(dpo_proxy,'58.30',2)
check(dso+dio-dpo_proxy,'88.72',2)
check(dpo_credit,'55.23',2)
check(dso+dio-dpo_credit,'91.78',2)
check(380-(65-50),365)
# Allowance example: both valid bridges yield the cash received, mixing yields 30.
check(100-10,90)
check(100-20,80)
check(80-10,70)
check(90+10-80,20)
check(90-70,20)
check(90+10-70,30)

# Leases, amortisation and historical acquisition NPV.
rate=F(1,20)
lease=pv([10,10],rate)
check(lease,'18.5941',4)
liability=lease
total_interest=F(0)
for expected in ['9.5238','0.0000']:
    int_payment=liability*rate
    total_interest+=int_payment
    liability+=int_payment-10
    check(liability,expected,4)
check(total_interest,20-lease)
check(lease/2+lease*rate,'10.2268',4)
check(lease/2+F(200,21)*rate,'9.7732',4)
check(pv([10,115],F(1,10))-150,'-45.87',2)

# Consolidation: assets, internal profit and noncontrolling ownership claims.
assets=600-80+200
check(assets,720)
check(assets,250+100+350+20)
profit_direct=(300+200-50)-(240+150-40)
profit_bridge=(300-240)+(200-150)-(50-40)
check(profit_direct,100)
check(profit_direct,profit_bridge)
check(50*F(1,5),10)
check((50-10)*F(1,5),8)
check(profit_direct-10,90)
check(profit_direct-8,92)
check(1000-200-250*F(1,5),750)
check(F(1000-260-200*F(1,5),100),7)

# Tax loss expiry, accounting consumption, and separate cash-tax PV.
profits=list(map(F,[40,30,20]))
remaining=F(80)
used=[]
cash_tax=[]
for t,p in enumerate(profits,1):
    offset=min(p,remaining) if t<=2 else F(0)
    used.append(offset)
    cash_tax.append((p-offset)*F(1,4))
    remaining-=offset
    if t==2:
        check(remaining,10)
        remaining=F(0)  # expires after the final permitted year-2 use.
check(sum(used),70)
for actual,expected in zip(cash_tax,[0,0,5]):
    check(actual,expected)
deferred_assets=list(map(F,['17.5','7.5',0,0]))
for t,p in enumerate(profits):
    deferred_expense=deferred_assets[t]-deferred_assets[t+1]
    net_profit=p-cash_tax[t]-deferred_expense
    check(net_profit,[30,'22.5',15][t])
    check(net_profit+deferred_expense,p-cash_tax[t])
check(pv([10,'7.5'],F(1,10)),'15.2893',4)
check(pv([5,'3.75'],F(1,10)),'7.6446',4)
check(F('7.5')-10*F(1,4),5)
dtl=[0,10,5,0]
for t,current in enumerate([15,30,30]):
    check(current+dtl[t+1]-dtl[t],25)
check(40*F(3,10),12)
check(15+10,25)  # All tax here in P&L.
check(15+(10-4),21)  # Counterexample: 4 of DTL recognised in OCI, not P&L.

# Pension defined-benefit and plan-asset roll-forwards, company-only cash.
obligation=F(120+8+6+12-6)
plan_assets=F(90)+F('4.5')-3+10-6
pnl=F(8)+F('1.5')
oci=F(12+3)
net_liability=obligation-plan_assets
check(obligation,140)
check(plan_assets,'95.5')
check(net_liability,'44.5')
check(net_liability,F(30)+pnl+oci-10)
check(-10,(net_liability-30)-(pnl+oci))
check(-pnl+pnl-10,-10)
check(pv(['16.5','18.15'],F(1,10)),30)
check(400-pv(['16.5','18.15'],F(1,10)),370)

# Revenue allocation, balance-sheet closure and direct/indirect cash.
device=F(1080)*F(900,1200)
service=F(1080)*F(300,1200)
earned_service=service*F(6,24)
contract_liability=service-earned_service
net_profit=device+earned_service-500-30
check(device,810)
check(service,270)
check(earned_service,'67.5')
check(device+earned_service,'877.5')
check(contract_liability,'202.5')
check(net_profit,'347.5')
check(600-500-30,70)
check(net_profit-480+contract_liability,70)
check(70+480,contract_liability+net_profit)

# Accounting quality: reported cash versus the stated timing sensitivity.
check(100+20+15-30-10+45+20,160)
check(160-45-20,95)
check(95-40,55)
print(f'{checks} independent accounting arithmetic checks passed.')
