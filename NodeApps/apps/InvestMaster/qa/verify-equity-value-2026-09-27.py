"""Independent arithmetic checks for selected hypothetical equity lesson models.

Uses exact fractions; does not import the app, predict securities, or certify
every assertion in the lessons. Run with Python 3, no external dependencies.
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
            rounded = (Decimal(actual.numerator) / Decimal(actual.denominator)).quantize(
                Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert rounded == Decimal(str(expected)), (rounded, expected)
    checks += 1


def pv(flows, rate):
    return sum(F(str(c)) / (1 + rate)**t for t, c in enumerate(flows, 1))


# FCFF, FCFE, common equity, and dilution (lesson 1).
tax = F(1, 4)
ni = (100 - 12) * (1 - tax)
cfo = ni + 20 - 10
fcff = 100 * (1 - tax) + 20 - 30 - 10
check(ni, 66)
check(cfo, 76)
check(fcff, 55)
check(cfo - 30, 46)
check(fcff - 12 * (1 - tax), 46)
check(cfo - 30 - 50, -4)
check(-(cfo - 30 - 50 + 2), 2)
check(F(1000 + 100 - 300, 200), 4)
check(F(800, 220), '3.64', 2)
check(F(900 + 50 - 250 - 40, 110), 6)
check(200 * (1 - tax) + 30 - 70 - (-10), 120)
w = F(1, 10)
for g, expected in [(F(3, 100), '799.29'), (F(2, 100), '710.74')]:
    tv = 60 * (1 + g) / (w - g)
    check(pv([50, 55, 60 + tv], w), expected, 2)

# Reverse valuation, dated reinvestment and quote-implied ROIC (lesson 2).
check(F(6) / (F(9, 100) - F(3, 100)), 100)
check(F(9, 100) - F(6, 120), '.04')
n1 = 100 + 40 * F(1, 5)
n2 = n1 + n1 * F(2, 5) * F(1, 5)
n3 = n2 * F(103, 100)
cf1 = n1 * F(3, 5)
check(n1, 108)
check(n2, '116.64')
check(n3, '120.1392')
for roc, expected in [(F(15, 100), '1270.75'), (w, '1119.27')]:
    b = F(3, 100) / roc
    check(pv([cf1, n2*(1-b) + n3*(1-b)/F(7, 100)], w), expected, 2)
b_implied = 1 - (1300 - cf1/(1+w))*(1+w)**2/(n2+n3/F(7, 100))
check(100*b_implied, '18.07', 2)
check(100*F(3, 100)/b_implied, '16.60', 2)

# Joint transition cash and terminal assumptions (lessons 3 and 8).
def full_dcf(rate, growth, roc):
    n4 = F('166.32')
    cf4 = n4 * (1-growth/roc)
    cf5 = n4*(1+growth)*(1-growth/roc)
    tv4 = cf5/(rate-growth)
    return pv([60, 72, '110.4', cf4+tv4], rate)

matrix = [['1645.73','1668.66','1699.24'],
          ['1446.58','1446.58','1446.58'],
          ['1287.72','1274.21','1257.32']]
for i, rate in enumerate([F(9,100), w, F(11,100)]):
    for j, growth in enumerate([F(1,100), F(2,100), F(3,100)]):
        check(full_dcf(rate, growth, w), matrix[i][j], 2)
values = [full_dcf(w, F(2,100), roc) for roc in [F(6,100), w, F(14,100)]]
for value, expected in zip(values, ['1238.3171','1446.5815','1535.8377']):
    check(value, expected, 4)
prices = [(value+50-400-20)/100 for value in values]
check(sum(p*v for p,v in zip([F(3,10), F(1,2), F(1,5)], prices)), '10.319534', 6)
threshold = (F(4,5)*prices[1]+F(1,5)*prices[2]-F('10.5'))/(prices[1]-prices[0])
check(threshold*100, '21.33', 2)
check(F(90-50,90)*100, '44.44', 2)  # PV pressure gap, not promised cash return.

# Finite project cash and economic profit reconciliation (lesson 4).
finite_npv = pv([18, 15, 111], w)-100
check(finite_npv, '12.16', 2)
check(finite_npv, pv([8,5,1], w))
check(pv([18,18,118], w)-100, '19.89', 2)
check(pv([18,15,91], w)-100, '-2.87', 2)

# Customer value and cohort payment timestamps (lesson 5).
check(F(80)/(1+w-F(4,5)), '266.67', 2)
check(F(80)/(1+w-F(4,5))-120, '146.67', 2)
check(F(80)/(1+w-F(3,5))-120, 40)
check(pv([80,64], w), '125.62', 2)
acquired = [100000,200000,400000]
cash = F(0)
lows, closes = [], []
for t, people in enumerate(acquired):
    cash -= F(people*120,1000000)
    lows.append(cash)
    # First receipt at age 1; older cohorts continue conditionally at 80%.
    receipt = sum(F(acquired[s]*80,1000000)*F(4,5)**(t-s-1) for s in range(t))
    if t == 2:
        check(receipt, '22.4')
    cash += receipt
    closes.append(cash)
for actual, expected in zip(lows, [-12,-36,-76]):
    check(actual, expected)
for actual, expected in zip(closes, [-12,-28,'-53.6']):
    check(actual, expected)
check(-(60+min(lows)), 16)

# Bank clean surplus, payout capacity, and comparable common share bridge.
check(F(7)/(F(1,10)-F(1,20)), 140)
check(F(2)-6, -4)
check(min(F('111.2')-920*F(12,100),F('126.2')-20-100), '.8')
check(min(F('111.2')-F('926.2')*F(12,100),F('126.2')-F('26.2')-100), 0)
check(F(850-250-50,50), 11)
check(F(800,30), '26.67', 2)
check(F(900,70), '12.86', 2)
print(f'{checks} independent equity arithmetic checks passed.')
