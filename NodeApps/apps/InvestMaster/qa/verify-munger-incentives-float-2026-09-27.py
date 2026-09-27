"""Independent selected contribution, incentive, NPV and float scope bridges."""
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

checks = 0

def check(value, expected, places=None):
    global checks
    value = F(value)
    if places is None:
        assert value == F(str(expected)), (value,expected)
    else:
        n = D(value.numerator)/D(value.denominator)
        assert n.quantize(D(1).scaleb(-places),rounding=ROUND_HALF_UP) == D(str(expected)), (n,expected)
    checks += 1

# Contribution is a partial operating bridge, not distributable cash.
check(F(60,100),'.6')
check(60*2-150,-30)
check(F(150,2),75)
check(75*2-150,0)
check(80*2-150,10)
check(80*F('1.8')-150,-6)  # scaling does not assure unchanged unit contribution
check(80*2-150-15,-5)  # omitted necessary annual spending reverses apparent cash
check(F('.7')*40+F('.3')*(-80),4)
check(30-10,20)
check(15-5,10)

# Contract amounts, cash received and commissions are different bases.
check(100*F('.05'),5)
check(80-70-5,5)
check((100-70)-5,25)
check(80-70-8-5,-3)
check(80*F('.05'),4)
check(78-50-5-4,19)
check(19-(-3),22)
pre_commission_a = 80-70-8
pre_commission_b = 78-50-5
check(pre_commission_a,2)
check(pre_commission_b,23)
check(max(pre_commission_a,0)*F('.2'),'.4')
check(pre_commission_a*(1-F('.2')),'1.6')
check(max(pre_commission_b,0)*F('.2'),'4.6')
check(pre_commission_b*(1-F('.2')),'18.4')
check(100*F('.1')-100*F('.06'),4)
check(8-6,2)
# A cash classification counterexample: same total cash, different CFO.
receipts, other_cost, maintenance = 100,60,10
expense_cfo = receipts-other_cost-maintenance
capital_cfo = receipts-other_cost
capital_cfi = -maintenance
check(expense_cfo,30)
check(capital_cfo,40)
check(capital_cfo+capital_cfi,expense_cfo)
check(capital_cfo-0,40)  # cancel capital spending affects free cash, not CFO
check((capital_cfo-0)-(capital_cfo-maintenance),10)
check((expense_cfo+10)-expense_cfo,10)  # delayed operating payment boosts CFO today

# Annual share bases held fixed throughout each comparison year.
check(F(20,10),2)
check(F(30,20),'1.5')
check(F(30,20)/F(20,10)-1,'-.25')
check(F(30,20)-1,'.5')  # total CFO grows 50%, not per-share cash

# Incremental after-tax project cash arrives at each year end.
discount = F('1.1')
pv = sum(F(12)/discount**t for t in range(1,6))
check(pv,'45.49',2)
check(pv-80,'-34.51',2)
terminal_required = (80-pv)*discount**5
check(terminal_required,'55.58',2)
check(pv+terminal_required/discount**5-80,0)
with_sale = pv+60/discount**5-80
check(with_sale,'2.74',2)
check(15-with_sale,'12.26',2)
check(pv+F(50)/discount**5-80 < 0,1)
check(pv+F(60)/discount**5-80 > 0,1)
check(80*discount**5-sum(12*discount**(5-t) for t in range(1,6)),terminal_required)
check((pv-80)+(60/discount**5),with_sale)

# Float financing cost and shareholder hurdle use declared asset scope.
premium, claims, expense, float_base = F(100),F(65),F(30),F(80)
check((claims+expense)/premium,'.95')
check(premium-claims-expense,5)
check(float_base*F('.04'),'3.2')
check(5+float_base*F('.04'),'8.2')
stress_claims = claims+15
underwriting = premium-stress_claims-expense
check(stress_claims,80)
check((stress_claims+expense)/premium,'1.1')
check(underwriting,-10)
check(underwriting+float_base*F('.04'),'-6.8')
check(F(10)/float_base,'.125')
equity_cost = 20*F('.1')
check(equity_cost,2)
for rate, income, subtotal, economic in [('.04','3.2','-6.8','-8.8'),('.125',10,0,-2),('.15',12,2,0)]:
    invest_income = float_base*F(rate)
    check(invest_income,income)
    check(underwriting+invest_income,subtotal)
    check(underwriting+invest_income-equity_cost,economic)
check((10+equity_cost)/float_base,'.15')
# The additional 20 of equity can earn income if its assets are investible.
full_asset_base = float_base+20
check(full_asset_base,100)
check((10+equity_cost)/full_asset_base,'.12')
check(full_asset_base*F('.12')-10-equity_cost,0)
check(float_base*F('.12')-10-equity_cost,'-2.4')
check(full_asset_base*F('.15')-10-equity_cost,3)
check(F(160)*F('.04'),'6.4')
check(F(160)*F('.04')-20,'-13.6')  # larger float with doubled loss need not help

print(f'{checks} independent Munger checks passed')
