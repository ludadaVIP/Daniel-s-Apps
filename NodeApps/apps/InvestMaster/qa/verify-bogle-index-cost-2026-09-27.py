"""Independent selected Bogle arithmetic. No app formulas or learner data imported."""
from decimal import Decimal as D, ROUND_HALF_UP, getcontext
from fractions import Fraction as F

getcontext().prec = 40
checks = 0

def check(value, expected, places=None):
    global checks
    value = D(value.numerator)/D(value.denominator) if isinstance(value,F) else D(str(value))
    if places is not None:
        value = value.quantize(D(1).scaleb(-places),rounding=ROUND_HALF_UP)
    assert value == D(str(expected)), (value,expected)
    checks += 1

# Market and subgroup wealth must reconcile before costs.
check(F('.6')*F('.1')+F('.4')*0, '.06')
check(1000*F('.06')-400*F('.06'), 36)
check(F(36,600), '.06')
check(F(36-20,400), '.04')
check(200*(F('.1')-F('.06')), 8)
check(400*(F('.04')-F('.06')), -8)
check((400*F('.058')+600*F('.048'))/1000, '.052')
check((400*F('.002')+600*F('.012'))/1000, '.008')
check(F(111+107+97-300,300), '.05')
check(F(111+107-200,200), '.09')
check(F('.05')-F('.058'), '-.008')
check(100*D('1.078')**20, '449.13', 2)
check(100*D('1.068')**20, '372.76', 2)
check(100*(D('1.078')**20-D('1.068')**20), '76.38', 2)
# Profile values, stable illustrative returns with a common fee convention.
check(100*D('1.069')**20, '379.8', 1)
check(100*D('1.059')**20, '314.7', 1)
check(100*(D('1.069')**20-D('1.059')**20), '65.1', 1)
# Index weights, cash-drag approximation, actual transaction price.
check(F(30,110)*100, '27.3', 1)
check(F(60,120), '.5')
check(F('37.5')/F('112.5')*100, '33.3', 1)
check(F('.098')-F('.001'), '.097')
check(F('.097')-F('.1'), '-.003')
check(D('1.097')*D('.998')/D('1.002')-1, '.0926', 4)
check(F(45,85)*100, '52.94', 2)
check(F(40,85)*100, '47.06', 2)
check(F(96-120,120), '-.2')
check(sum(w*w for w in [F('.4'),F('.3'),F('.2'),F('.1')]), '.3')
check(1/sum(w*w for w in [F(60,120),F(30,120),F(20,120),F(10,120)]), '2.88')
# Standard deviation is not a cash cost or a mean return gap.
def sample_variance(values):
    mean = sum(values)/len(values)
    return sum((v-mean)**2 for v in values)/(len(values)-1)
check(sample_variance([F('-.003')]*3), 0)
check(sample_variance([F('.003'),F('-.003'),F(0)]), '.000009')
check(D('.000009').sqrt(), '.003')
# Annualized IRR vs annualized TWR with year-end additional capital.
check(F('1.1')*F('.9')-1, '-.01')
check((F(100)*F('1.1')+100)*F('.9'), 189)
x = (-D(1)+D('8.56').sqrt())/2
check(x-1, '-.0371', 4)
check(100*x*x+100*x, '189.0000000000', 10)
check(D('.99').sqrt()-1, '-.0050', 4)
check((100*F('1.2')-20)*F('.8'), 80)
check((100*F('.8')-20)*F('1.2'), 72)
check(100*F('1.2')*F('.8'), 96)
check((500-120)*F('.65'), 247)
check((500-120)*F('.65')+120, 367)
# Lump sums vs individual dated contributions, two fee conventions.
check(D('1.069')**30, '7.40', 2)
check(D('1.059')**30, '5.58', 2)
check(D('1.069')**30-D('1.059')**30, '1.82', 2)
check(D('1.07')*(1-D('.001')), '1.06893')
check(D('1.07')*(1-D('.011')), '1.05823')
low = sum(D('1.069')**n for n in range(30))
high = sum(D('1.059')**n for n in range(30))
check(low, '92.78', 2)
check(high, '77.68', 2)
check(low-high, '15.10', 2)
check((D('1.069')**30-1)/D('.069'), '92.78', 2)
check((D('1.059')**30-1)/D('.059'), '77.68', 2)
print(f'{checks} selected Bogle index, cost and cash-flow checks passed.')
