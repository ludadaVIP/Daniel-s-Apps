"""Independent debt, FX, covariance and dated cash bridges; teaching units only."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

checks = 0

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value, expected)
    else:
        n = D(value.numerator) / D(value.denominator)
        assert n.quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP) == D(str(expected)), (n, expected)
    checks += 1

# Matching pre-debt cash and debt-service denominators.
check(F(100, 40), '2.5')
check(F(100, 80), '1.25')
check(F(20 + 30, 100), '.5')
check(F(50, 80), '.625')
check(F(15 + 45, 120), '.5')
check(F(60, 90), '.6667', 4)
check(F(50, 100) * F(100, 50), 1)
check(80 - 50, 30)
# Same-bank lending creates matching claims; repayment extinguishes both.
check(100 - 100, 0)
check(100 - 20, 80)
check((100 - 20) - (100 - 20), 0)
check(100 - 100 + 100, 100)  # transfer between deposit holders preserves total

# CFO is after interest/tax; dated cash cannot borrow from later quarters.
def capacity(cash, annual_cfo, annual_capex, floor, quarter):
    return F(cash) + F(annual_cfo - annual_capex) * F(quarter, 4) - floor

for cfo, quarter, available, gap in [(120,4,120,80),(120,2,90,110),(80,4,80,120),(80,2,70,130)]:
    a = capacity(100, cfo, 60, 40, quarter)
    check(a, available)
    check(200-a, gap)
check(capacity(60,120,60,40,4),80)
check(200-capacity(60,120,60,40,4),120)
check(capacity(60,120,60,40,2),50)
check(200-capacity(60,120,60,40,2),150)

# Nominal stocks, income collapse and the reciprocal currency quote.
check(F(100,50),2)
check(F(90,40),'2.25')
check(F(100,40),'2.5')
check(F(80,40),2)
check(F(80,50),'1.6')
check(100*5,500)
check(100*6,600)
check(F(600,500)-1,'.2')
check(1-F(1,6)/F(1,5),'0.1667',4)
check(F(5)/F('.8'),'6.25')
check(100*F('6.25'),625)
check(F(625,500)-1,'.25')
check(F(30)/F('.8'),'37.5')
check(30*F('1.2'),36)

# Covariance contributions independently sum to portfolio variance.
ws, wb, ss, sb = F('.6'), F('.4'), F('.2'), F('.1')
vs, vb = (ws*ss)**2, (wb*sb)**2
check(vs,'.0144')
check(vb,'.0016')
for rho, variance, stock_share, bond_share, volatility in [
    (F(0),'.016','90.0','10.0','12.65'),
    (F('.5'),'.0208','80.8','19.2','14.42'),
    (F('-.5'),'.0112','107.1','-7.1','10.58')]:
    half_cross = ws*wb*ss*sb*rho
    total = vs+vb+2*half_cross
    check(total,variance)
    check((vs+half_cross)+(vb+half_cross),total)
    check(100*(vs+half_cross)/total,stock_share,1)
    check(100*(vb+half_cross)/total,bond_share,1)
    root = (D(total.numerator)/D(total.denominator)).sqrt()*100
    check(root,volatility,2)
check(vs+vb+2*ws*wb*ss*sb,'.0256')
check(F(1,3)*ss,F(2,3)*sb)
check(ws*F('-.25')+wb*F('.1'),'-.11')
check(ws*F('-.25')+wb*F('-.15'),'-.21')

# Bank provisioning versus legal forgiveness: do not book the loss twice.
check(F(100,20),5)
check(F(100,15),'6.67',2)
check(30-15,15)
check(F(120,100),'1.2')
check(F(80,100),'.8')
for face, allowance, cash, equity in [(100,0,20,20),(100,20,20,0),(80,0,20,0),(80,0,40,20)]:
    check(face-allowance+cash-100,equity)

# Selling collateral also reduces the borrowing base.
stock = 60*F('.75'); bond = 80*F('.85'); debt = F(40)
check(stock,45)
check(bond,68)
check(stock+bond-debt,73)
check(1-F(73,100),'.27')
check(debt-bond*F('.5'),6)
sold = (debt-bond*F('.5'))/(1-F('.5'))
check(sold,12)
check(bond-sold,56)
check(debt-sold,28)
check((debt-sold)/(bond-sold),'.5')
check(F(34,62) > F('.5'),1)  # selling 6 does not meet the same limit
# Additional sale-only 2% execution loss, remaining collateral marks unchanged.
sold_with_discount = (debt-bond*F('.5'))/(F('.98')-F('.5'))
check(sold_with_discount,'12.5')
check(sold_with_discount*F('.98'),'12.25')
check(stock+bond-sold_with_discount-(debt-sold_with_discount*F('.98')),'72.75')

# Cash reserve for a specified payment before allocating risk assets.
check(500-120,380)
check(380*ws,228)
check(380*wb,152)
loss = 228*F('.25')+152*F('.15')
check(loss,'79.8')
check(500-loss,'420.2')
check(500-loss-100,'320.2')
check(120-100,20)
check(500*(1-F('.21')),395)

print(f'{checks} independent Dalio checks passed')
