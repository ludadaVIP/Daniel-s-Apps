"""Independent selected price, cash, credit and strict loss-budget checks."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP, ROUND_FLOOR

checks = 0

def decimal(value):
    value = F(value)
    return D(value.numerator) / D(value.denominator)

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value, expected)
    else:
        assert decimal(value).quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP) == D(str(expected)), (value, expected)
    checks += 1

# Valuation and conditional reverse probability; different assumptions explain
# the same observable price, so none is a uniquely identified market belief.
def expected(success, failure, probability):
    return F(probability)*success+(1-F(probability))*failure

def credit_expected(default_probability):
    return expected(108,40,1-F(default_probability))

def implied(price, rate, success, failure):
    return (F(price)*(1+F(rate))-failure)/(success-failure)

check(expected(120,60,'.7'),102)
check(F(102)/F('1.1'),'92.73',2)
check(100*implied(100,'.1',120,60),'83.33',2)
check(100*(implied(100,'.1',120,60)-F('.7')),'13.33',2)
check(implied(100,'.05',120,60),'.75')
check(F(102)/F('1.05'),'97.14',2)
check(100*implied(80,'.1',120,60),'46.67',2)
check(implied(100,'.1',120,80),'.75')
check(F(102)/F('1.1')-80,'12.73',2)
check(F(80-60,80),'.25')
check(F(2)/F('.25'),8)
check(F(2)/1,2)
check(F(100-60,100),'.4')

# Earnings and multiples: retain precision before displaying each grid cell.
grid = [
    ('0',['1000.0','1500.0','2500.0']),
    ('.1',['1610.5','2415.8','4026.3']),
    ('.2',['2488.3','3732.5','6220.8'])
]
for growth, cells in grid:
    profit = 100*(1+F(growth))**5
    for pe, cell in zip([10,15,25],cells):
        check(profit*pe,cell,1)
check(100*F('1.1')**5,'161.05',2)
check(100*F('1.2')**5,'248.83',2)
check(100*(100*F('1.1')**5*15/2500-1),'-3.37',2)
check(100*(100*F('1.2')**5*25/2500-1),'148.8',1)
check(F(2500,15),'166.67',2)
target = 2500*F('1.08')**5
check(target,'3673.32',2)
check(target/15,'244.89',2)
check(100*(decimal(F(2500,1500))**(D(1)/5)-1),'10.76',2)
check(100*(decimal(target/F(1500))**(D(1)/5)-1),'19.62',2)
check(100*(decimal(F('1.2')**5*F(15,25))**(D(1)/5)-1),'8.35',2)
check(-5*F('.02'),'-.1')
check(F('.03')/F('.3'),'.1')
check(10*F('1.25')**3,'19.53',2)
check(10*F('1.25')**3*18,'351.6',1)
check(100*(decimal(10*F('1.25')**3*18/300)**(D(1)/3)-1),'5.4',1)
check(10*F('1.15')**3,'15.21',2)
check(10*F('1.15')**3*18,'273.8',1)

# After-interest CFO bridges and separate versus sequential stress scenarios.
cash_one = 60+30-20-40
check(cash_one,30)
check(35-cash_one,5)
cash_two = cash_one+25-20-80
check(cash_two,-45)
check(20-cash_two,65)
check(60+(30+15)-15-20-40,cash_one)
check(cash_one+(25+15)-15-20-80,cash_two)
stress_one = 60+10-20-40
check(stress_one,10)
check(20-stress_one,10)
check(cash_one+(25-10)-20-80,-55)
check(20-(cash_one+(25-10)-20-80),75)
check(stress_one+(25-10)-20-80,-75)
check(20-(stress_one+(25-10)-20-80),95)
check(F('.03')/F('.6'),'.05')
check(500*F('.03'),15)
check(15-9,6)
check(F(6)/F('.6'),10)
check(F(10,500),'.02')
check(F(6)/F('.7'),'8.57',2)
check(9+25*F('.6'),24)  # repeating the whole budget would breach 15

# Bond re-pricing sums individual dated cash flows, not the annuity shortcut.
def price(yield_rate):
    discount = 1+F(yield_rate)
    return sum(F(4)/discount**t for t in range(1,6))+F(100)/discount**5

check(price('.04'),100)
check(price('.08'),'84.03',2)
check(100-price('.08'),'15.97',2)
check(credit_expected('.05'),'104.6')
check(credit_expected('.15'),'97.8')
check(100*(credit_expected('.05')/100-1),'4.6')
check(100*(credit_expected('.15')/100-1),'-2.2')
check(96*F('1.08'),'103.68')
max_default = (108-96*F('1.08'))/68
check(100*max_default,'6.35',2)
check(credit_expected(max_default),'103.68')
check(credit_expected('.1'),'101.2')
check(100*(credit_expected('.1')/96-1),'5.42',2)
check(100*(credit_expected('.05')/96-1),'8.96',2)
loss = F(56,96)
check(100*loss,'58.33',2)
limit = F('.005')/loss
check(100*limit,'0.857142857',9)
rounded_percent = (decimal(100*limit)/D('.01')).to_integral_value(rounding=ROUND_FLOOR)*D('.01')
check(rounded_percent,'.85')
check(F('.0085')*loss <= F('.005'),1)
check(F('.0086')*loss > F('.005'),1)
check(100*F('.0086')*loss,'0.501667',6)
check(5000000*limit,'42857.14',2)
check(5000000*F('.0085'),42500)
check(42500*loss,'24791.67',2)
check(5000000*F('.0086')*loss,'25083.33',2)

print(f'{checks} independent Marks checks passed')
