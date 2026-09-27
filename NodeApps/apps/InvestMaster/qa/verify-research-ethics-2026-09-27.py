"""Independent arithmetic for selected research ethics teaching examples.

No app imports or personal data; arithmetic is not a legal compliance audit.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_HALF_UP

checks = 0


def check(actual, expected, places=None):
    global checks
    if places is None:
        assert actual == F(str(expected)), (actual, expected)
    else:
        with localcontext() as ctx:
            ctx.prec = 40
            result = (Decimal(actual.numerator)/Decimal(actual.denominator)).quantize(
                Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert result == Decimal(str(expected)), (result, expected)
    checks += 1


# Twenty independent all-null trials: event probability versus truth of selection.
for n, expected, places in [(1, '5.0', 1), (5, '22.6', 1), (20, '64.15', 2)]:
    check(100*(1-F('.95')**n), expected, places)
p_any = 1-F('.95')**20
# All rules are known false: if selection occurs, selected rule is false.
check(p_any/p_any, 1)
check(100*(F('1.08')*F('.99')-1), '6.92')
check(100*(F('1.08')-F('.01')-1), 7)

# Client payment gates, reliable maturity and immediate sale haircuts (USD 10,000).
check(120+40+340, 500)
check(100+50+25, 175)
check(175-120-40, 15)
check(100+25-120, 5)
cash = 120+15
check(cash, 135)
for movement, expected in [(-100, 35), (40, 75), (-50, 25)]:
    cash += movement
    check(cash, expected)
check(F(15)/F('.65'), '23.08', 2)
bond_sale = 40*F('.98')
check(bond_sale, '39.2')
check(120+bond_sale, '159.2')
check(120+bond_sale-100-50, '9.2')
check(25-(120+bond_sale-100-50), '15.8')

# Allocation: quantity and total cost conservation can hide client cost transfer.
check(1_000_000*F('.004'), 4000)
fractions = [F(600, 1000), F(400, 1000)]
fair_qty = [600*f for f in fractions]
fair_cost = [(300*20+300*21)*f for f in fractions]
check(fair_qty[0], 360)
check(fair_qty[1], 240)
check(sum(fair_qty), 600)
check(fair_cost[0], 7380)
check(fair_cost[1], 4920)
check(sum(fair_cost), 12300)
for cost, qty in zip(fair_cost, fair_qty):
    check(cost/qty, '20.50')
biased = [F(300*20+60*21), F(240*21)]
check(biased[0], 7260)
check(biased[1], 5040)
check(sum(biased), sum(fair_cost))
check(fair_cost[0]-biased[0], 120)
check(biased[1]-fair_cost[1], 120)

# Maintenance capex omission and quote relative to corrected value, no growth.
cfo = 50+10-15
fcf = cfo-20
check(cfo, 45)
check(fcf, 25)
old = cfo/F('.09')
new = fcf/F('.09')
check(old, 500)
check(new, '277.78', 2)
check(old-new, '222.22', 2)
check(old/10, 50)
check(new/10, '27.78', 2)
check(100*(old/10-35)/(old/10), 30)
check(100*(35-new/10)/(new/10), 26)

# Survivor selection and fee basis; all accounts have no external flows here.
check(100*(F(120+80, 200)-1), 0)
check(119+79, 198)
check(100*(F(198, 200)-1), -1)
check(0-5, -5)
check(-1-5, -6)
check(100*(F(132, 100)-1), 32)
check(100*(F(120, 100)-1), 20)
# Identical endpoints/flows, but two distinct cash-flow-day valuations.
check(100*F(162-100-80)/(100+80*F(20, 30)), '-11.7391', 4)
check(100*(F(120, 100)*F(162, 200)-1), '-2.8')
check(100*(F(90, 100)*F(162, 170)-1), '-14.2353', 4)

print(f'{checks} independent research ethics arithmetic checks passed.')
