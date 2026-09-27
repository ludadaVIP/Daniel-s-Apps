"""Independent selected cash, valuation and nonlinear fee checks; no learner data."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

checks = 0

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value, expected)
    else:
        decimal = D(value.numerator) / D(value.denominator)
        assert decimal.quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP) == D(str(expected))
    checks += 1

# Alternative property: maintenance is distinct from NOI and financing.
noi = F(12)-4
check(noi, 8)
check(noi/F('.08'), 100)
check(noi-2, 6)
check(60*F('.05'), 3)
check((noi-2-3)/40, '.075')
check(F(9)-4-2-3, 0)
check(noi/F('.1')-60, 20)
check((20-F(40))/40, '-.5')
# Dated commitments and private asset multiples.
cash = F(120)-40
check(cash, 80)
cash -= 30
check(cash, 50)
cash -= 70
check(cash, -20)
check(F(25,90), '.28', 2)
check(F(80,90), '.89', 2)
check(F(105,90), '1.17', 2)
check(25+80-90, 15)
check(100-90, 10)
check(40-20, 20)
check(20+35-40, 15)
# Policy pressure: spending leaves NAV, calls exchange assets.
stocks = 420*F('.7')
bonds = 160*F('1.05')
private = 240*F('.8')
check(stocks, 294)
check(bonds, 168)
check(private, 192)
nav = 180+stocks+bonds+private
check(nav, 834)
check((1000-nav)/1000, '.166')
check(180+stocks+bonds+240, 882)
check(240-private, 48)
check(nav*F('.42')-stocks, '56.28')
nav -= 70
cash = F(180)-70-90
private += 90
check(nav, 764)
check(cash, 20)
check(private, 282)
check(cash+stocks+bonds+private, nav)
check(nav*F('.42')-stocks, '26.88')
check(100*private/nav, '36.9', 1)
check(70+90+20-100, 80)
check(F(80)/F('.7'), '114.3', 1)
# Entire short-bond position repriced, not just the sold portion.
check(200-60, 140)
check(100-60-80, -40)
sale = F(60)/F('.98')
check(sale, '61.22', 2)
remaining = F(90)-sale
check(remaining, '28.78', 2)
check(remaining*F('.98'), '28.2')
check(90*F('.02'), '1.8')
check(20+remaining*F('.98')+410+480, '938.2')
check(40-remaining*F('.98'), '11.8')
check(F(400)/(420+400)*100, '48.8', 1)
check(F(320)/(420+320)*100, '43.2', 1)
# Fee as a function of outcome: average after the threshold calculation.
def profit(rate):
    return 200*rate-2-F('.2')*max(200*(rate-F('.06')), 0)
good, bad = profit(F('.08')), profit(F('.04'))
check(good, '13.2')
check(bad, 6)
check(good/200, '.066')
check(bad/200, '.03')
check((good+bad)/2, '9.6')
check((good+bad)/400, '.048')
check(profit(F('.06'))/200, '.05')
check(profit(F('.06'))-(good+bad)/2, '.4')
check(good-F('1.4')-F('.6'), '11.2')
check((good-F('1.4')-F('.6'))/200, '.056')
check(F('.066')-F('.075'), '-.009')
check(200*F('1.066')*F('1.03'), '219.596')
check(200*F('1.06')**2, '224.72')
check(200*(F('1.066')*F('1.03')-F('1.06')**2), '-5.12', 2)
# Original review: two distinct sale-price ledgers, no duplicate loss.
check(70+80+20-120, 50)
check(1000-400*F('.3')-400*F('.2'), 800)
check(800-70, 730)
check(20+30+280+400, 730)
sale = F(50)/F('.97')
check(sale, '51.55', 2)
remaining = F(80)-sale
check(remaining, '28.45', 2)
extra_loss = sale-50
check(extra_loss, '1.55', 2)
check(20+remaining+280+400, '728.45', 2)
check(20+remaining+280+400, 730-extra_loss)
market_remaining = remaining*F('.97')
check(market_remaining, '27.6')
check(80*F('.03'), '2.4')
check(20+market_remaining+280+400, '727.6')
check(20+market_remaining+280+400, 730-80*F('.03'))
print(f'{checks} selected Swensen and alternative-asset checks passed.')
