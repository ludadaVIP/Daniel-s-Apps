"""Independent arithmetic for selected six economic/market teaching lessons.

Exact fractions; not a macro forecast or factual audit of all cited sources.
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


# Macro: purchasing power, yield/spread decomposition, sequential equity changes.
check(100*(F('1.06')/F('1.08')-1), '-1.85', 2)
check(-8*F('.005'), '-.04')
check(-5*F('.002'), '-.01')
check(100*(1-5*F('.002')), 99)
yield_change = F('-.005')+F('.012')
check(yield_change, '.007')
check(100*(-5*yield_change), '-3.5')
check(100*(1-5*yield_change), '96.5')
check(100*(-5*F('-.005')), '2.5')
check(100*(-5*F('.012')), -6)
check(F(10)/F('.1'), 100)
check(F(9)/F('.1'), 90)
new = F(9)/F('.11')
check(new, '81.82', 2)
check(100-new, '18.18', 2)
check(90-new, '8.18', 2)
check((60-30)*F('.1'), 3)

# FX return, covered interest parity and fixed forward delivery after default.
check(110*F('6.3'), 693)
check(100*(F(693, 700)-1), -1)
check(90*8, 720)
check(100*(F(720, 700)-1), '2.86', 2)
check(100*(F('1.08')/F('1.05')-1), '2.86', 2)
check(100*7-40*7-300, 120)
check(100*6-40*6-300, 60)
forward = 7*F('1.02')/F('1.05')
check(forward, '6.8')
check(105*forward, 714)
check(100*(105*forward/700-1), 2)
check(105*8, 840)
check(60*8, 480)
check(105-60, 45)
check(45*8, 360)
check(105*forward-45*8, 354)
check(100*(F(354, 700)-1), '-49.43', 2)
check(100*(F(480, 700)-1), '-31.43', 2)

# International transactions versus stocks; reciprocal currency percentage.
check(120-150, -30)
check(10-40, -30)
check(-100-30+15, -115)
check(100*(F('1.65')/F('1.50')-1), 10)
check(100*(F('1.50')/F('1.65')-1), '-9.09', 2)
check(100*F('1.65')-100*F('1.50'), 15)
check(-28-(-30+0), 2)
check(-30+0+2, -28)

# Static depth, quote versus execution, and settlement cash rather than clean price.
buy = 100*101+400*102+500*104
sell = 100*99+400*98+500*95
check(buy, 102900)
check(F(buy, 1000), '102.90')
check(buy-1000*101, 1900)
check(sell, 96600)
check(F(sell, 1000), '96.60')
check(buy-sell, 6300)
check(100*F(buy-sell, buy), '6.12', 2)
check(100+400, 500)
clean = 100000*F('98.25')/100
accrued = 100000*F('1.20')/100
check(clean, 98250)
check(accrued, 1200)
check(clean+accrued+80, 99530)
check(clean+accrued+80-99500, 30)
check(F('.03')-2*F('.005')-F('.008'), '.012')
check(1_000_000*(F('.03')-2*F('.005')-F('.008')), 12000)
check(F('.01')-F('.015'), '-.005')

# Competitive equilibrium, tax incidence and explicitly nonnegative low-Q MC.
p = F(120-20, 2+3)
q = 120-2*p
pc = F(120-20+3*5, 2+3)
pp = pc-5
qt = 120-2*pc
for actual, expected in [(p, 20), (q, 80), (pc, 23), (pp, 18), (qt, 74),
                         (pc-p, 3), (p-pp, 2), (pc*qt, 1702), (pp*qt, 1332),
                         (5*qt, 370), (F(2)*p/q, '.5'), (F(3)*p/q, '.75')]:
    check(actual, expected)
cs0 = F(1, 2)*(60-p)*q
cs1 = F(1, 2)*(60-pc)*qt
vc0 = F(1, 2)*(q-20)*p
vc1 = F(1, 2)*(qt-20)*pp
ps0 = p*q-vc0
ps1 = pp*qt-vc1
for actual, expected in [(cs0, 1600), (cs1, 1369), (cs0-cs1, 231),
                         (vc0, 600), (vc1, 486), (ps0, 1000), (ps1, 846),
                         (ps0-ps1, 154), (cs0-cs1+ps0-ps1-5*qt, 15)]:
    check(actual, expected)
check(F(1, 2)*5*(q-qt), 15)
check(q*F('.1')*(p-15), 40)
contribution = qt*F('.1')*(pp-15)
check(contribution, '22.2')
check(100*(40-contribution)/40, '44.5')
check(100*F(40)/(pp-15)/qt, '18.02', 2)

# Uniform monopoly price: complete square independently checked by MR=MC.
for price, expected_q, expected_revenue, expected_profit in [
        (25, 50, 1250, 450), (30, 40, 1200, 500),
        (35, 30, 1050, 450), (50, 0, 0, -300)]:
    quantity = 100-2*price
    check(quantity, expected_q)
    check(price*quantity, expected_revenue)
    check((price-10)*quantity-300, expected_profit)
check(50-40, 10)
check(F(2*30, 40), '1.5')
check(F(30-10, 30), 1/F('1.5'))
check((35-10-10)*(100-2*35)-300, 150)
check((40-10-10)*(100-2*40)-300, 100)
check((30-10-10)*(100-2*30)-300, 100)
check(25*30, 750)
check(10*30, 300)
check(35*30, 1050)
check((32-14)*36-300, 348)
check((25-14)*50-300, 250)
check(F(2*32, 36), '1.7778', 4)
check((30-10)*40-400, 400)
check(F(150-20, 2+3), 26)
check(150-2*26, 98)
check(F(98-80, 26-20), 3)
check(F(74-80, 23-20), -2)

# Repricing dates, bank cash/equity reconciliation and simultaneous constraints.
check(100*(F('.07')-F('.05')), 2)
check(F(20, 5), 4)
check(F(20, 7), '2.86', 2)
interest = 100*(F('.05')+F('.07'))/2
check(interest, 6)
check(F(20)/interest, '3.33', 2)
check(500*F('.6')*F('.02')-1000*F('.01'), -4)
for loan_interest, deposit_interest, other_interest, impairment, expected in [
        (F(30), F('8.5'), F(2), F(4),
         ['28.5', '3.1667', '11.5', '2.875', '8.625', '112.625', '1008.625']),
        (F('37.2'), F('13.6'), F(3), F(15),
         ['29.6', '3.2889', '1.6', '.4', '1.2', '116.2', '1001.2'])]:
    nii = loan_interest+9-deposit_interest-other_interest
    pretax = nii+5-18-impairment
    tax = pretax*F('.25')
    ni = pretax-tax
    cash = 100+ni+impairment
    assets = 600-impairment+300+cash
    for actual, target in zip([nii, 100*nii/900, pretax, tax, ni, cash, assets], expected):
        check(actual, target, 4 if actual == 100*nii/900 else None)
    check(assets, 900+100+ni)
check(10000*F('1.1')/900, '12.22', 2)
check(100*F('108.625')/750, '14.4833', 4)
check(100*F('101.2')/900, '11.2444', 4)
check(900*F('.12')-F('101.2'), '6.8')
check(F('101.2')+F('6.8'), 108)
check(F('116.2')+F('6.8'), 123)
capital = F('101.2')+10
cash = F('116.2')+10
capital_limit = capital/F('.12')-900
cash_limit = cash-100
check(capital_limit, '26.6667', 4)
check(cash_limit, '26.2')
x = min(capital_limit, cash_limit)
check(x, '26.2')
check(585+x+300+cash-x, 900+capital)
check(capital-(900+x)*F('.12'), '.056')
check(capital-F('.12')*920, '.8')
check(cash-20-100, '6.2')
check(capital-F('1.2'), 110)

print(f'{checks} independent economic/market arithmetic checks passed.')
