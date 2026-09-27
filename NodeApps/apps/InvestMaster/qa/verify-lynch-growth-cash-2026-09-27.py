"""Independent selected store, funding, per-share and reverse-growth bridges."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

checks = 0

def decimal(value):
    value = F(value)
    return D(value.numerator)/D(value.denominator)

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value,expected)
    else:
        assert decimal(value).quantize(D(1).scaleb(-places),rounding=ROUND_HALF_UP) == D(str(expected)), (value,expected)
    checks += 1

def annual_percent(ending, beginning, years):
    return 100*(decimal(F(ending)/F(beginning))**(D(1)/years)-1)

# Store cohorts: model operating cash separately from funding cash.
check(50*1-20,30)
check(F(30,1000),'.03')
check(150*8,1200)
check(200*1-50,150)
check(20*F('.25'),5)
for old, fresh, overhead, operating, net in [(50,5,25,30,-130),(70,5,30,45,-115),(90,0,30,60,60)]:
    check(old+fresh-overhead,operating)
    check(operating-(160 if fresh else 0),net)
check(130+115,245)
check(245-(40-20),225)
check(160-(40-20),140)
check(20+30,50)
check(160-(50-20),130)
check(20+45,65)
check(140+130,270)
check(40+270+30+45-320,65)
check(270-225,45)
check(F(270,20),'13.5')
check(50+F(270,20),'63.5')
check(100*F(50)/F('63.5'),'78.7',1)
check(F(30,50),'.6')
check(F(60)/F('63.5'),'.945',3)
check(100*((F(60)/F('63.5'))/F('.6')-1),'57.5',1)
check(F(270,15),18)
check(F(60,68),'.882',3)

# All principal is drawn at each year start; interest paid at year end.
rate = F('.08')
first_debt = F(140)
first_interest = first_debt*rate
first_cash = 20+30-first_interest
check(first_interest,'11.2')
check(first_cash,'38.8')
check(first_cash-20,'18.8')
second_debt = 160-(first_cash-20)
check(second_debt,'141.2')
total_debt = first_debt+second_debt
check(total_debt,'281.2')
second_interest = total_debt*rate
check(second_interest,'22.496')
check(20+45-second_interest,'42.504')
check(40+total_debt+30+45-320-first_interest-second_interest,'42.504')
check(60-second_interest,'37.504')

# Perpetuity starts at t=2, not t=1; finite life sums each dated payment.
check(20-5,15)
perpetuity_value = F(15)/F('.1')/F('1.1')
check(perpetuity_value,'136.36',2)
check(perpetuity_value-160,'-23.64',2)
check((perpetuity_value-160)*(1+1/F('1.1')),'-45.12',2)
finite_value = sum(F(15)/F('1.1')**t for t in range(2,7))
check(finite_value,'51.69',2)
check(finite_value-160,'-108.31',2)
check(160*F('.1')*F('1.1'),'17.6')
check((F('17.6')+5)/20,'1.13')

# Annual EPS uses weighted shares. All shares are issued at year start here.
check(F(130,110),'1.1818',4)
check(100*(F(130,110)-1),'18.18',2)
check(30/(100*(F(130,110)-1)),'1.65')
for year, profit, shares, eps in [(1,130,110,'1.1818'),(2,169,121,'1.3967'),(3,'219.7','133.1','1.6506')]:
    check(100*F('1.3')**year,profit)
    check(100*F('1.1')**year,shares)
    check(F(profit)/F(shares),eps,4)
check(F('1.3')**3,'2.197')
price = F('1.3')**3*20
check(price,'43.94')
check(100*(price/30-1),'46.47',2)
check(annual_percent(price,30,3),'13.57',2)
down_price = F('1.15')**3*15
check(down_price,'22.81',2)
check(100*(down_price/30-1),'-23.96',2)
diluted_price = (F('1.3')/F('1.1'))**3*20
check(diluted_price,'33.01',2)
check(100*(diluted_price/30-1),'10.04',2)
check(annual_percent(diluted_price,30,3),'3.24',2)
target = 30*F('1.1')**3
check(target,'39.93')
check(target/20,'1.9965')
check(target/20*F('133.1'),'265.73',2)
check(100*((target/20*F('133.1'))/F('219.7')-1),'20.95',2)
check(F(20,10),2)
# Independent counterexample: same ending shares, different annual EPS.
half_year_weighted = 100*F('.5')+110*F('.5')
check(half_year_weighted,105)
check(F(130)/half_year_weighted,'1.2381',4)
check(F(130,110),'1.1818',4)

# Half-year store operations do not match full-year mature unit economics.
check(50*10*F('.98'),490)
check(20*10*F('.5'),100)
check(490+100,590)
check(F(590,500)-1,'.18')
check(F(8)/F('1.2'),'6.67',2)
check(F(8)/F('.8'),10)
store_value = sum(F('1.2')/F('1.1')**t for t in range(1,6))
check(store_value,'4.5489',4)
check(8-store_value,'3.4511',4)
terminal = (8-store_value)*F('1.1')**5
check(terminal,'5.56',2)
check(store_value+terminal/F('1.1')**5-8,0)
check(store_value+F(8)/F('1.1')**5-8,'1.52',2)
check((store_value-8)*20,'-69.02',2)

# Tenbagger is defined per original share; billions and hundreds of millions.
check(100000000*100/1000000000,10)
check(100000000*1000/1000000000,100)
check(F(100,40),'2.5')
check(F('2.5')/F('.1'),25)
check(annual_percent(25,1,10),'37.97',2)
check(150000000*1000/1000000000,150)
check(F(150,40),'3.75')
check(F('3.75')/F('.1'),'37.5')
check(annual_percent('37.5',1,10),'43.68',2)
check(F(2500000000,150000000),'16.67',2)
check(F(2500000000,150000000)*40,'666.67',2)
check(F(2500000000,100000000)*20,500)
check(F(2500000000,150000000)*20,'333.33',2)

print(f'{checks} independent Lynch checks passed')
