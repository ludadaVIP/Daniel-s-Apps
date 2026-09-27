"""Independent checks of selected hypothetical corporate finance models.

Exact fractions and final-only rounding; does not import app formulas or
certify sources, real companies, or learner competence. Python 3 only.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_HALF_UP
from itertools import product

checks = 0


def check(actual, expected, places=None):
    global checks
    if places is None:
        assert actual == F(str(expected)), (actual, expected)
    else:
        with localcontext() as ctx:
            ctx.prec = 40
            result = (Decimal(actual.numerator) / Decimal(actual.denominator)).quantize(
                Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert result == Decimal(str(expected)), (result, expected)
    checks += 1


def pv(flows, rate):
    return sum(F(str(c)) / (1 + rate)**t for t, c in enumerate(flows, 1))


# Capital allocation: scale, timing, indivisible project budget and cash floor.
r = F(1, 10)
a = -100 + pv([45, 45, 45], r)
b = -100 + pv([0, 70, 70], r)
check(F(50, 500), '.10')
check(a, '11.91', 2)
check(-100 + pv([40, 40, 40], r), '-.53', 2)
check(b, '10.44', 2)
check(a-b, '1.47', 2)
check(100+50-20-50-40, 40)
check(40-(100-100+50-20-50), 60)
check(-100+F(130)/(1+r), '18.18', 2)
check(-1000+F(1180)/(1+r), '72.73', 2)
check(-900+F(1050)/(1+r), '54.55', 2)
check(100*(F(1050, 900)-1), '16.67', 2)
costs = [60, 50, 50]
values = [F('82.5')/(1+r)-60, F('68.2')/(1+r)-50, F('68.2')/(1+r)-50]
check(values[0], 15)
check(values[1], 12)
check(F('82.5')/(1+r)/60, '1.25')
check(F('68.2')/(1+r)/50, '1.24')
for budget, expected in [(100, 24), (90, 15), (110, 27)]:
    feasible = [sum(v*x for v, x in zip(values, selection))
                for selection in product([0, 1], repeat=3)
                if sum(c*x for c, x in zip(costs, selection)) <= budget]
    check(max(feasible), expected)
check(F(900)/(100-F(100, 15)), '9.64', 2)
check(F(900)/(100-F(100, 5)), '11.25')
check(F(12)/r-150, -30)
check(F(16)/r-150, 10)
check(200-70-60-50-60, -40)

# No-tax M&M model, changing risk costs, and fixed five-year debt APV.
for debt, expected_ke, expected_equity in [(40, '13.33', 60), (70, '21.67', 30)]:
    equity = 100-debt
    ke = r+(r-F(1, 20))*F(debt, equity)
    check(100*ke, expected_ke, 2)
    check(ke*F(equity, 100)+F(1, 20)*F(debt, 100), r)
    check((10-debt*F(1, 20))/ke, expected_equity)
check(F(10)/F('.065'), '153.85', 2)
check(F('6.5')/r+70, 135)
w = F('.6')*F('.1')+F('.4')*F('.05')*F('.75')
check(w, '.075')
check(-100+F(110)/(1+w), '2.33', 2)
check(-100+F(100)/(1+w), '-6.98', 2)
check(-100+F(110)/F('1.12'), '-1.79', 2)
check(F('.3')*F('.16')+F('.7')*F('.08')*F('.75'), '.09')
operating = pv([170]*10, r)-1000
shield = pv([6]*5, F('.06'))
check(operating, '44.58', 2)
check(400*F('.06'), 24)
check(24*F('.25'), 6)
check(shield, '25.27', 2)
check(operating+shield, '69.85', 2)
check(operating+shield-20, '49.85', 2)

# Capital budgeting: multiple IRRs, incremental scale, working capital and tax.
check(-100+pv([60, 60], r), '4.13', 2)
check(-100+pv([60, 50], r), '-4.13', 2)
with localcontext() as ctx:
    ctx.prec = 40
    irr = (Decimal(69).sqrt()+3)/10-1
    assert (irr*100).quantize(Decimal('.01'), rounding=ROUND_HALF_UP) == Decimal('13.07')
    checks += 1
for rate in [F('.10'), F('.20')]:
    check(-100+pv([230, -132], rate), 0)
check(-100+pv([230, -132], F('.15')), '.1890', 4)
check(-100+F(140)/(1+r), '27.27', 2)
check(-1000+F(1250)/(1+r), '136.36', 2)
check(-900+F(1110)/(1+r), '109.09', 2)
check(100*(F(1110, 900)-1), '23.33', 2)
check(20+10-5, 25)
ebit = 150-80-50
cash = ebit*F('.75')+50
disposal = 10-(10-0)*F('.25')
check(ebit, 20)
check(cash, 65)
check(disposal, '7.5')
check(cash+disposal+20, '92.5')
base = -120+pv([cash, cash+disposal+20], r)
check(base, '15.54', 2)
check(-120+pv([cash, cash+disposal+20], F('.20')), '-1.60', 2)
stress_delta = pv([-13*F('.75')]*2, r)
check(stress_delta, '-16.92', 2)
check(base+stress_delta, '-1.38', 2)
check(-120+pv([65, F('82.5')], r), '7.27', 2)

# Agency: bonus included in company costs; debt/equity payoff conservation.
check(25-30, -5)
check(F(95, 10), '9.5')
check(80*F('.005'), '.4')
check(50-35, 15)
check(-5+8*F('.5'), -1)
for assets, expected_equity, expected_debt, expected_total in [
        ([130, 50], 25, 65, 90), ([133, 53], '26.5', '66.5', 93),
        ([138, 40], 29, 60, 89)]:
    equity = sum(max(v-80, 0) for v in assets)*F('.5')
    debt = sum(min(v, 80) for v in assets)*F('.5')
    check(equity, expected_equity)
    check(debt, expected_debt)
    check(equity+debt, expected_total)
check(29-25, 4)
check(60-65, -5)

# Buybacks and incremental employee services not already in valuation.
for price, expected in [(8, '10.29'), (12, '9.82'), (10, '10.00')]:
    remaining = 100-F(100, price)
    check(F(900)/remaining, expected, 2)
check(F(100)/(100-F(100, 8)), '1.143', 3)
check(100*(F(100)/(100-F(100, 8))-1), '14.3', 1)
check(F(900)/(100-F(100, 8)+5), '9.73', 2)
check(F(100)/(F(100, 8)-5), '13.33', 2)
check(F('92.5')*10-900, 25)
check(F('92.5')*F(900)/F('87.5')-900, '51.43', 2)

# Financing fit: economic NPV versus year-specific payment and retained cash.
check(-80+pv([30, 35, 35, 60], r), '43.48', 2)
year1_shortfall = 80*F('1.06')-30
check(year1_shortfall, '54.8')
check(year1_shortfall*F('1.10'), '60.28')
check(year1_shortfall*F('1.10')-35, '25.28')
for principal, cash_available, expected in zip([80, 60, 40, 20], [30, 35, 35, 60],
                                             ['1.21', '1.48', '1.56', '2.83']):
    check(F(cash_available)/(20+principal*F('.06')), expected, 2)
retained = F(0)
for cash_available, expected in zip([30, 35, 35], ['25.2', '55.4', '85.6']):
    retained += cash_available-80*F('.06')
    check(retained, expected)
check(80*F('1.06')-60, '24.8')
check(retained+60-80*F('1.06'), '60.8')
check(F(30, 28), '1.07', 2)
check(F(26, 28), '.93', 2)
check(28-26, 2)

# Acquisition: probabilistic synergy, fixed share consideration and bid bounds.
ceiling = 400+120*F('.6')-30-10
check(ceiling, 432)
check(ceiling-420, 12)
check(ceiling-20, 412)
check(400+120*F('.3')-40, 396)
check(396-420, -24)
check(370+120*F('.6')-40, 402)
combined = 1000+ceiling
check((combined-420)/100, '10.12')
per_share = combined/F(142)
old = 100*per_share
seller = 42*per_share
check(per_share, '10.0845', 4)
check(old, '1008.45', 2)
check(old-1000, '8.45', 2)
check(seller, '423.55', 2)
check(old+seller, combined)
check(F(1360, 142), '9.58', 2)
check(F(1360, 142)*100, '957.75', 2)
check(combined/10-100, '43.2')
bound = combined/F('10.20')-100
check(bound, '40.3922', 4)
check(100*combined/(100+bound), 1020)
assert old < 1020
checks += 1

print(f'{checks} independent corporate finance arithmetic checks passed.')
