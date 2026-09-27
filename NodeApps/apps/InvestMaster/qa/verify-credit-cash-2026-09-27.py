"""Independent checks for five credit lessons' specified teaching inputs."""
from fractions import Fraction as F
from decimal import Decimal, getcontext

getcontext().prec = 40
checks = 0


def check(actual, expected):
    global checks
    assert actual == expected, (actual, expected)
    checks += 1


def rounded(value, places):
    return (Decimal(value.numerator) / Decimal(value.denominator)).quantize(Decimal(places))


# Survival chain; default events are mutually exclusive, not independent trials.
survival = F(1)
unconditional = []
for hazard in [F(3, 100), F(6, 100), F(10, 100)]:
    unconditional.append(survival * hazard)
    survival *= 1 - hazard
check(unconditional, [F(3, 100), F(291, 5000), F(4559, 50000)])
check(survival, F(41031, 50000))
check(sum(unconditional), 1 - survival)
check(sum(unconditional), F(8969, 50000))
losses = [60 * probability for probability in unconditional]
check(losses, [F(9, 5), F(873, 250), F(13677, 2500)])
check(sum(losses), F(26907, 2500))
discounted_loss = sum(loss / F(108, 100) ** year for year, loss in enumerate(losses, 1))
check(rounded(discounted_loss, "0.0001"), Decimal("9.0034"))
check(rounded(1 - F(96, 100) ** 5, "0.0001"), Decimal("0.1846"))
check(rounded(1 - F(97, 100) ** 3, "0.0001"), Decimal("0.0873"))
check(F(35) / F(108, 100) ** 3, F(546875, 19683))

# Macro weights versus the weights conditional on default.
joint = [F(8, 10) * F(2, 100), F(2, 10) * F(12, 100)]
pd = sum(joint)
check(pd, F(4, 100))
weights_given_default = [value / pd for value in joint]
check(weights_given_default, [F(4, 10), F(6, 10)])
lgds = [F(40, 100), F(70, 100)]
conditional_lgd = sum(weight * lgd for weight, lgd in zip(weights_given_default, lgds))
check(conditional_lgd, F(58, 100))
el = 100 * sum(probability * lgd for probability, lgd in zip(joint, lgds))
check(el, F(232, 100))
check(100 * pd * conditional_lgd, el)
check(100 * pd * (F(8, 10) * lgds[0] + F(2, 10) * lgds[1]), F(184, 100))
check(el - F(184, 100), F(48, 100))

# Specified single pool and Pier 1 contractual order; amounts are synthetic.
check((80 - 50) / F(60), F(1, 2))
check(F(80 - 50 - 20, 60), F(1, 6))
check(F(120 - 80 - 20, 60), F(1, 3))
check(F(120 - 80 - 35, 60), F(1, 12))
claims = [F(4), F(54), F(103, 10), F(2), F(3), F(15), F(0), F(2), F(20)]
for pool, expected in [
    (F(80), [F(4), F(54), F(103, 10), F(2), F(3), F(67, 10), F(0), F(0), F(0)]),
    (F(100), [F(4), F(54), F(103, 10), F(2), F(3), F(15), F(0), F(2), F(97, 10)]),
]:
    remaining = pool
    allocations = []
    for claim in claims:
        payment = min(remaining, claim)
        allocations.append(payment)
        remaining -= payment
    check(allocations, expected)
    check(sum(allocations) + remaining, pool)

# Cash after interest must not be charged the same interest again.
check(80 + 150 - 15 - 30 - 10 - 40 - 40, 95)
check(80 + 80 - 30 + 5 - 40 - 40, 55)
check(80 + 5 - 10 - 40, 35)
check(50 - (80 + 5 - 10 - 40), 15)
check(30 + 80 - 35 - 70, 5)
check(30 + 80 - 15 - 35 - 70, -10)
check(500 - 400 - 300, -200)

# Quarterly refinancing requirement, with no interest on hypothetical new funds.
cash = 25
cash_path = []
for inflow, principal in zip([-10, 5, 10, 35], [0, 60, 0, 0]):
    cash += inflow - 3 - principal
    cash_path.append(cash)
check(cash_path, [12, -46, -39, -7])
check(10 - min(cash_path), 56)
check(F(180 - 25, 4), F(155, 4))
check(rounded(F(180 - 25, 35), "0.01"), Decimal("4.43"))
check(60 * (F(11, 100) - F(6, 100)), 3)

# Joint withdrawal and impairment; identical toy book-equity/CET1 assumptions.
sold = F(50) / F(9, 10)
sale_loss = sold - 50
equity = 80 - sale_loss - 30
assets = 770 + 150 - sold
check(assets, 780 + 40 + equity)
check(50 + sold * F(9, 10) - 100, 0)
check(rounded(equity / 700 * 100, "0.01"), Decimal("6.35"))
check(F(40) / F(9, 10) - 40, F(40, 9))
print(f"Independent credit numeric checks: {checks}")
print(f"Overall annual PD: {pd}, default-weighted LGD: {conditional_lgd}, EL: {el}")
print(f"Three-year discounted loss: {float(discounted_loss)}")
