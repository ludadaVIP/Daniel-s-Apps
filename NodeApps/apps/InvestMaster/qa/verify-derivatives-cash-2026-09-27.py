"""Independent arithmetic for the explicitly specified teaching contracts."""
from fractions import Fraction as F
from decimal import Decimal, getcontext

getcontext().prec = 50
checks = 0


def check(actual, expected):
    global checks
    assert actual == expected, (actual, expected)
    checks += 1


for price in [0, 80, 100, 120, 200]:
    check(max(price - 100, 0) + 100, max(100 - price, 0) + price)
    check((max(price - 100, 0) - 5) + (5 - max(price - 100, 0)), 0)

check((120 - 100 - 5) * 100, 1500)
check(100 * 100, 10000)
check(90 * 100 - 100 * 100 - 500, -1500)
check((5 - (200 - 100)) * 100, -9500)
check(3 * 1000, 3000)
check(10 * 1000, 10000)
check((3 + 10) * 1000, 13000)
check(5000 - 20000, -15000)
check(-15000 + 20000, 5000)
check(5000 + (120 - 95) * 1000, 30000)
check(30000 - 25000, 5000)
check(90000 + 5000, 95000)
check(90000 - 20000, 70000)
check(90000 + (100 - 95) * 600, 93000)
check((100 - 120) * 600, -12000)
check(F(88, 10) + F(998, 10) - F(122, 10) - F(953, 10), F(11, 10))
check(F(11, 10) - F(8, 10) - F(4, 10), -F(1, 10))

d1 = F(100, 103)
d2 = d1 / F(105, 100)
fixed_rate = (F(3, 100) * d1 + F(5, 100) * d2) / (d1 + d2)
check(fixed_rate, F(163, 4100))
low_value = 100 * (F(1, 100) - fixed_rate) / F(101, 100)
high_value = 100 * (F(7, 100) - fixed_rate) / F(107, 100)
check(low_value, -F(12200, 4141))
check(high_value, F(12400, 4387))
check(1 + 100 * (fixed_rate - F(1, 100)), 100 * fixed_rate)

check(F(4000000) * F(1, 10000) * F(92, 360), F(920, 9))
check(F(920, 9) / 25, F(184, 45))
check(F(4000000) * F(8, 100) * F(92, 360) - 10000, F(646000, 9))
check(F(4000000) * F(875, 10000) * F(92, 360) - 10000, F(715000, 9))
check(4800 - 6000 + 6000 + 16000, 20800)
check(11000 + 10000, 21000)
check(7800 - 4800 - 1200, 1800)
check(F(4000000) * F(8, 100) * F(92, 360) + 6000, F(790000, 9))

put = Decimal(12) + Decimal(100) / Decimal("1.05") + Decimal(3) / Decimal("1.05").sqrt() - Decimal(100)
check(put.quantize(Decimal("0.0001")), Decimal("10.1658"))
print(f"Independent derivative numeric checks: {checks}")
print(f"Dividend put: {put}")
print(f"Swap K: {float(fixed_rate)}, low/high values: {float(low_value)}, {float(high_value)}")
