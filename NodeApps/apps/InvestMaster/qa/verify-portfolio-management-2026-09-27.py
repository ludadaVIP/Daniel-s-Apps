"""Selected independent portfolio calculations, in teaching units of 10,000 USD.

No application implementation is imported. Exact fractions precede display rounding.
This checks the specified examples, not all investment claims or real execution.
"""
from fractions import Fraction as F
from decimal import Decimal, getcontext, ROUND_HALF_UP

getcontext().prec = 40
checks = 0


def decimal(x):
    if isinstance(x, F):
        return Decimal(x.numerator) / Decimal(x.denominator)
    return Decimal(str(x))


def check(x, expected, places=None):
    global checks
    if places is None:
        assert x == F(str(expected)), (x, expected)
    else:
        actual = decimal(x).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert actual == Decimal(str(expected)), (actual, expected)
    checks += 1


def condition(ok):
    global checks
    assert ok
    checks += 1


# Policy: changes in prices, withdrawals and order of rebalancing.
stock, bond = 60*F('1.2'), 40*F('.95')
check(stock+bond, 110)
check(100*stock/(stock+bond), '65.45', 2)
check(stock-110*F('.6'), 6)
check(100*(stock-10)/100, 62)
check(stock-100*F('.6'), 12)
check(100*(110*F('.6'))/(110-10), 66)
stock, bond = 40*F('.75'), 60*F('1.05')
check(stock+bond, 93)
check(93*F('.4')-stock, '7.2')
check(100*stock/(stock+bond-13), '37.5')
check(100*(stock-13)/(stock+bond-13), '21.25')
check(F('.03')/F('.6'), '.05')

# Variance and money-/time-weighted performance.
variance = F('.6')**2*F('.2')**2+F('.4')**2*F('.1')**2+2*F('.6')*F('.4')*F('.2')*F('.1')*F('.2')
check(variance, '.01792')
check(decimal(variance).sqrt()*100, '13.39', 2)
check((F('1.2')*F('.8')-1)*100, -4)
check((decimal(F('.96')).sqrt()-1)*100, '-2.02', 2)
check((F('1.2')*F('.9')-1)*100, 8)
check((decimal(F('1.08')).sqrt()-1)*100, '3.92', 2)
x = (Decimal(-120)+Decimal(100800).sqrt())/200
condition(abs(100*x*x+120*x-216) < Decimal('1e-30'))
check((x-1)*100, '-1.25', 2)
check(216-100-120, -4)
check(F(50)/F('1.1')-F(100)/F('1.1')**2-100, '-137.19', 2)
check(F('.003')-F('.008'), '-.005')
check((F(100, 55)-1)*100, '81.82', 2)
check((F('1.08')*F('.95')-1)*100, '2.6')
check(100*F(-18)/(100+80*F(2, 3)), '-11.7391', 4)
check(100*(F(120, 100)*F(162, 200)-1), '-2.8')
check(100*(F(90, 100)*F(162, 170)-1), '-14.2353', 4)
check(100*F(4)/(100+20*F(25, 30)-10*F(10, 30)), '3.5294', 4)

# Bottom-up CAPM and small-sample regression, with debt beta zero.
for leveraged, de in [(F('1.1'), F('.5')), (F('1.4'), F(1)), (F('.95'), F('.25'))]:
    check(leveraged/(1+F('.75')*de), '.8')
check(F('.8')*(1+F('.75')*F(2, 3)), '1.2')
check(F('.03')+F('1.2')*F('.06'), '.102')
check(F(110)/F('1.102')-100, '-.18', 2)
xs, ys = list(map(F, [-10, 0, 10, 20])), list(map(F, [-11, 0, 13, 28]))
mx, my = sum(xs)/4, sum(ys)/4
sxx = sum((z-mx)**2 for z in xs)
beta = sum((a-mx)*(b-my) for a,b in zip(xs, ys))/sxx
alpha = my-beta*mx
check(beta, '1.3')
check(alpha, 1)
sse = sum((b-alpha-beta*a)**2 for a,b in zip(xs, ys))
check(sse, 4)
se = decimal(sse/2*(F(1, 4)+mx*mx/sxx)).sqrt()
t95 = decimal(2*F('.95')**2/(1-F('.95')**2)).sqrt()  # exact df=2 t quantile
check(decimal(alpha)-t95*se, '-2.33', 2)
check(decimal(alpha)+t95*se, '4.33', 2)

# IPS: liquidity, joint shock, and conservative currency rounding.
check(500*F('.08')*F('.6'), 24)
check(500*F('.25')*F('.4')+24, 74)
check(100+50+30-120-50, 10)
check(230*F('.4')+100*F('.15'), 107)
check(170-150, 20)
check(100*F(223, 243), '91.8', 1)
equity_max = (15-20*F('.25'))/F('.6')
sale_min = 40-equity_max
check(equity_max, F(50, 3))
check(sale_min, F(70, 3))
check(F('.6')*F('16.67')+5-15, '.002')
condition(F('233333.34')/10000 >= sale_min)
condition(F('233333.33')/10000 < sale_min)
condition(F('166666.66')/10000 <= equity_max)
check(max(sale_min, F(10)), sale_min)

# Euler risk allocation: negative component, sum and finite weight change.
variance = F('.6')**2*F('.04')+F('.4')**2*F('.01')-2*F('.6')*F('.4')*F('.01')
check(variance, '.0112')
sigma = decimal(variance).sqrt()
rc_a, rc_b = decimal(F('.6')*F('.020'))/sigma, decimal(F('.4')*F('-.002'))/sigma
condition(abs(rc_a+rc_b-sigma) < Decimal('1e-35'))
check(rc_a*100, '11.34', 2)
check(rc_b*100, '-.76', 2)
check(100*F('.012')/variance, '107.14', 2)
check(100*F('-.0008')/variance, '-7.14', 2)
newvar = F('.55')**2*F('.04')+F('.45')**2*F('.01')-2*F('.55')*F('.45')*F('.01')
check(newvar, '.009175')
check(decimal(newvar).sqrt()*100, '9.58', 2)
factorvar = F('.114')**2+F('.016')**2+2*F('.3')*F('.114')*F('.016')
check(factorvar, '.0143464')
check(decimal(factorvar).sqrt()*100, '11.98', 2)
check(500*(F('.184')+F('.032')+F('.06')), 138)

# Tail losses and actual cash: never use rounded display as payment amount.
check(200*F('.35')+150*F('.2')+50*F('.4'), 120)
sale = F(50)/F('.95')
haircut = sale*F('.05')
check(sale, '52.63157895', 8)
check((50-F('52.63')*F('.95'))*10000, 15)
condition(F('526315.79')/10000*F('.95') >= 50)
condition(F('526315.78')/10000*F('.95') < 50)
check(380-haircut-150, '227.37', 2)
check(247.5-(F(380)-haircut-150), '20.13', 2)
check(150-100-40*F('.95'), 12)
p_both, p_one = F('.04')**2, 2*F('.04')*F('.96')
condition(p_both < F('.05') < p_both+p_one)
es = (p_both+(F('.05')-p_both)*F('.5'))/F('.05')
check(es, '.516')
check(min(F(30)/es, F(120-80), F(300-150-50)), 40)
check(500-80-40-150, 230)
check(40*es, '20.64')
check(F(30)/F('.8'), '37.5')

# Single-period attribution plus two algebraically valid linking paths.
rb, rp = F('.6')*F('.1')+F('.4')*F('.02'), F('.7')*F('.12')+F('.3')*F('.01')
a = F('.1')*(F('.1')-rb)-F('.1')*(F('.02')-rb)
s = F('.6')*F('.02')-F('.4')*F('.01')
i = F('.1')*F('.02')+F('-.1')*F('-.01')
check(rb, '.068')
check(rp, '.087')
check(a, '.008')
check(s, '.008')
check(i, '.003')
check(a+s+i, rp-rb)
check(rp-rb-F('.006'), '.013')
rp2, rb2 = F('-.045'), F('-.03')
total_p, total_b = (1+rp)*(1+rp2)-1, (1+rb)*(1+rb2)-1
check(total_p, '.038085')
check(total_b, '.03596')
check(total_p-total_b, '.002125')
check(100*((1+total_p)/(1+total_b)-1), '.2051', 4)
path1 = [a*(1+rb2)+F('-.005')*(1+rp), s*(1+rb2)+F('-.01')*(1+rp), i*(1+rb2)]
path2 = [a*(1+rp2)+F('-.005')*(1+rb), s*(1+rp2)+F('-.01')*(1+rb), i*(1+rp2)]
check(sum(path1), total_p-total_b)
check(sum(path2), total_p-total_b)
condition(path1 != path2)

# Tax-aware target uses assets after costs as its denominator.
check(100*F(66)/F('109.44'), '60.31', 2)
cost_rate = F(1, 12)+F('.01')
trade = F(6)/(1-F('.6')*cost_rate)
check(trade, '6.355932', 6)
check((72-trade)/(110-cost_rate*trade), '.6')
check(trade*(1-cost_rate), '5.762712', 6)
check(F(72)/(110+10), '.6')

print(f'{checks} independent portfolio checks passed')
