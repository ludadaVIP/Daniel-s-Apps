"""Independent selected numerical bridges in the five graduation lessons.

Exact arithmetic before display rounding; no app code or learner data imported.
"""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP, getcontext

getcontext().prec = 40
checks = 0


def check(value, expected, places=None):
    global checks
    if places is None:
        assert value == F(str(expected)), (value, expected)
    else:
        d = D(value.numerator)/D(value.denominator)
        rounded = d.quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert rounded == D(str(expected)), (rounded, expected)
    checks += 1


def require(ok):
    global checks
    assert ok
    checks += 1


# Integrated research: same issuer and budget, not separate diversification.
check(40*F('.5')+30*F('.2'), 26)
check(100*F(26,500), '5.2')
check(500*F('.04'), 20)
require(F(26)>500*F('.04'))
check(F('.03')/F('.6'), '.05')

# Three statements, full precision receivable difference and explicit horizon.
check(100+20-20-10+5, 95)
check((100+20+20-10+5)-95, 40)
check(90+20-35-15, 60)
check(800+100-250-50, 600)
check(F(600,30), 20)
begin = F(1000*60,365)
ar75, ar60 = F(1100*75,365), F(1100*60,365)
check(begin, '164.38', 2)
check(ar75, '226.03', 2)
check(ar75-begin, '61.64', 2)
check(ar60-begin, '16.44', 2)
nopat = 1100*F('.16')*(1-F('.25'))
check(nopat, 132)
fcf75, fcf60 = nopat+45-90-(ar75-begin), nopat+45-90-(ar60-begin)
check(fcf75, '25.36', 2)
check(fcf60, '70.56', 2)
check(fcf60-fcf75, '45.21', 2)
check(F('61.64')-F('16.44'), '45.20', 2)
annuity = sum(F(1)/F('1.1')**year for year in range(1,6))
check((fcf60-fcf75)*annuity, '171.36', 2)
check(F('45.21')*annuity, '171.38', 2)

# Bond promised vs scenario cash, rate changes and cash before interest.
price = lambda y: F(5)/(1+y)+F(105)/(1+y)**2
p6,p7,p9 = [price(F(y)) for y in ['.06','.07','.09']]
check(p6, '98.17', 2)
check(p7, '96.38', 2)
check(p9, '92.96', 2)
duration = (F(5)/F('1.06')+2*F(105)/F('1.06')**2)/p6/F('1.06')
check(duration, '1.84', 2)
check(100*(p7/p6-1), '-1.82', 2)
check(100*(p9/p6-1), '-5.30', 2)
check(80+10-30, 60)
check(80+10-18, 72)
check(97+F('2.5'), '99.5')
check(F('.9')*105+F('.1')*40, '98.5')
expected_pv = F(5)/F('1.06')+F('98.5')/F('1.06')**2
check(expected_pv, '92.38', 2)
check(p6-expected_pv, '5.78', 2)
check(F(130-10-80,100), '.4')
check(max(90-10-80,0), 0)
check(97+5*F(3,4), '100.75')

# IPS: cash, investment loss and payment are distinct quantities.
check(25+10-20, 15)
check(50*F('.65')+30*F('.9')+20, '79.5')
check(100*F(15)/F('32.5'), '46.15', 2)
check(15+8, 23)
limit = (15-30*F('.1'))/F('.35')
check(limit, F(240,7))
require(F('34.29')>limit)
check(35*F('.35')+30*F('.1'), '15.25')
check(34*F('.35')+30*F('.1'), '14.9')
check(34*F('.65')+30*F('.9')+36, '85.1')
check(36-25, 11)
check(F('85.1')-25, '60.1')
check((15-30*F('.2'))/F('.35'), '25.71', 2)

# Defense: expected loss vs scenario loss; par is an explicit teaching condition.
check(F(100-80,100)*100, 20)
check(F(80-70,70)*100, '14.29', 2)
check(100*F('.2')*F('.4'), 8)
check(100*F('.2')*F('.7'), 14)
check(100*F('.7'), 70)
check(500*F('.03'), 15)
check(F(15)/F('.4'), '37.5')
check(F(15)/F('.7'), '21.43', 2)
check(F(15)/(F('.8')-F('.3')), 30)
check(30*(F('.8')-F('.3')), 15)

print(f'{checks} independent capstone cash/value checks passed')
