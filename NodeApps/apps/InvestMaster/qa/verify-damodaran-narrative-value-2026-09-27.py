"""Independent selected narrative, reinvestment, terminal and financing bridges."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

checks = 0

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value,expected)
    else:
        n = D(value.numerator)/D(value.denominator)
        assert n.quantize(D(1).scaleb(-places),rounding=ROUND_HALF_UP)==D(str(expected)),(n,expected)
    checks += 1

# Customer timing, EBIT and cash; all teaching units kept consistent.
check(100*F('1.2')**3, '172.8')
check(10*F('.9')+3, 12)
check(F(10+12,2), 11)
check(110*F('.3'), 33)
check(33*F('.75'), '24.75')
check(33*F('.75')-9-2, '13.75')
check(10*F('.8')+2, 10)
check(90*F('.2')*F('.75')-11-3, '-.5')
check(200-70-90, 40)
check(F(40,200), '.2')
check(F('1.8')-F('.81')-F('.9'), '.09')
check(F('24.75')-14-2, '8.75')
# Investment at preceding year end, old capital return can deteriorate.
check(F(40,100)*F('.2'), '.08')
check(100-40, 60)
check(F('.1')/F('.2'), '.5')
check(F('.1')/F('.1'), 1)
check(F(9)/F('.12')-100, -25)
check(F(18)/F('.12')-100, 50)
check(120-36, 84)
check(F(36,120)*F('.15'), '.045')
check(F('.12')/F('.3'), '.4')
check(F('.12')/F('.15'), '.8')
check(500*F('.18')+40*F('.2'), 98)
check(500*F('.2')+40*F('.1'), 104)
check(108*F('.4'), '43.2')
check(108-108*F('.4'), '64.8')
check(108+F('43.2')*F('.2'), '116.64')
check(500*F('.19')+40*F('.15'), 101)
# Stable transition funding and terminal-year cash.
n2 = F('116.64')
n3 = n2*F('1.03')
check(n3, '120.1392')
check(n2*F('.03')/F('.15'), '23.328')
check(n2*(1-F('.03')/F('.15')), '93.312')
check(n3*F('.03')/F('.15'), '24.02784')
check(n3*(1-F('.03')/F('.15')), '96.11136')
check(n3*(1-F('.03')/F('.15'))/F('.07'), '1373.02',2)
check(n3*(1-F('.03')/F('.1'))/F('.07'), '1201.392')
check(n2*(1-F('.03')/F('.06')), '58.32')
# No growth-value claim without specifying which profit is fixed.
for growth in [F(0),F('.01'),F('.02'),F('.04')]:
    check(100*(1-growth/F('.08'))/(F('.08')-growth), 1250)
check(100*F('1.02')/F('.08'), 1275)
check(100*F('.8')/F('.06'), '1333.33',2)
check(100*(1-F('.02')/F('.06'))/F('.06'), '1111.11',2)
check(F(12)/F('.06'), 200)
check(F(12)/F('.07'), '171.43',2)
check(F(12)/F('.08'), 150)
check(F(200-150,200), '.25')
check(200+20-70-10, 140)
check(F(140,10), 14)
check(F(140,8)/F(140,10)-1, '.25')
check(F(120,200), '.6')
# Quarterly endpoints locate a quarter, not an exact intra-quarter date.
cash = F(3000)
balances = []
for q in range(1,9):
    cash -= 300 if q <= 4 else 450
    balances.append(cash)
check(balances[3], 1800)
check(balances[4], 1350)
check(balances[5], 900)
check(balances[6], 450)
check(balances[7], 0)
check(next(q for q,c in enumerate(balances,1) if c<500), 7)
check(500-balances[6], 50)
check(F(900-500,450), F(8,9))
check(900-450*F(8,9), 500)
# Ordinary dilution and separately defined dated liquidation payoffs.
share = F(4000,14000)
check(100*share, '28.57',2)
check(1-share, F(5,7))
check(F('.7')*20000+F('.3')*2000, 14600)
check(14600*(1-share), '10428.57',2)
def payouts(total,preference=F(4000)):
    new=min(total,max(preference,total*share))
    return new,total-new
good_new,good_old=payouts(F(20000))
bad_new,bad_old=payouts(F(2000))
check(good_new, '5714.29',2)
check(good_old, '14285.71',2)
check(bad_new, 2000)
check(bad_old, 0)
check(F('.7')*good_old+F('.3')*bad_old, 10000)
check(F('.7')*good_new+F('.3')*bad_new, 4600)
check(14600*F(5,7)-10000, '428.57',2)
# Same-period amounts before any common illustrative discount.
_,old_exit=payouts(F(10000))
discount=F('1.1')**2
check(old_exit/discount, '4958.68',2)
check(F(10000)/discount, '8264.46',2)
check(F(4000)/discount, '3305.79',2)
check(payouts(F(10000)/discount,F(4000)/discount)[1],old_exit/discount)
check(F(10000)/discount-4000, '4264.46',2)
print(f'{checks} selected Damodaran narrative, value and funding checks passed.')
