"""Independent selected examples from all nine quantitative lessons.

Fractions for finite models; Decimal for roots/logs. No app calculations imported.
Checks numerical implications, not truth of market inputs or learner competence.
"""
from fractions import Fraction as F
from decimal import Decimal as D, getcontext, ROUND_HALF_UP
from math import comb

getcontext().prec = 55
checks = 0


def dec(x):
    return D(x.numerator)/D(x.denominator) if isinstance(x, F) else D(str(x))


def check(x, target, places=None):
    global checks
    if places is None:
        assert x == F(str(target)), (x, target)
    else:
        actual = dec(x).quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP)
        assert actual == D(str(target)), (actual, target)
    checks += 1


def require(ok):
    global checks
    assert ok
    checks += 1


# Compounding, payment dates, all effective roots of a quadratic IRR.
check(100*F('1.08')**2, '116.64')
check((F('1.08')/F('1.03')-1)*100, '4.85', 2)
check(-100+F(60)/F('1.1')+F(60)/F('1.1')**2, '4.13', 2)
check(-100+F(60)/F('1.1')+F(50)/F('1.1')**2, '-4.13', 2)
check((dec(F('.75')).sqrt()-1)*100, '-13.40', 2)
check(F('1.05')*F('1.03')-1, '.0815')
check(F(103)/F('1.0815'), F(100)/F('1.05'))
check(F(100)/F('1.05')**2+F(130)/F('1.05')**3, '203.00', 2)
for rate, value in [('0','-2.000000'),('.05','-.680272'),('.10','0.000000'),('.15','.189036'),('.20','0.000000'),('.25','-.480000')]:
    x=1+F(rate)
    check(-100+F(230)/x-F(132)/x**2, value, 6)
check(230**2-4*100*F('132.5'), -100)
check(-100+F(230)/F('1.15')-F('132.5')/F('1.15')**2, '-.189036', 6)
x=(-D(100)+D(100**2+4*100*189).sqrt())/200
require(abs(100*x*x+100*x-189)<D('1e-45'))
check((x*x-1)*100,'-7.29',2)

# Probability, Bayes, prior predictive branch accounting and information value.
profits=list(map(F,[5,7,8,4,9,11,6,10,15,20]))
check(sum(profits)/10,'9.5')
check((sorted(profits)[4]+sorted(profits)[5])/2,'8.5')
check(F('.3')*5+F('.5')*10+F('.2')*20,'10.5')
check(F('.08')/(F('.08')+F('.18'))*100,'30.8',1)
check(F('.08')/(F('.08')+F('.045')),'.64')
check(F('.125')*(104-85),'2.375')
check(F('.05')*F('.8')/(F('.05')*F('.8')+F('.95')*F('.05'))*100,'45.71',2)
check(1-F('.95')**100,'0.9941',4)
check(F('.05')/100,'.0005')
check(100*F('.02')/F(45,85),'3.78',2)
# Long-short counterexample: correlation's sign effect reverses.
v0=F('1.5')**2*F('.2')**2+F('-.5')**2*F('.2')**2
v1=v0+2*F('1.5')*F('-.5')*F('.2')**2
check(dec(v0).sqrt()*100,'31.62',2)
check(dec(v1).sqrt()*100,20)
require(v0>v1)
post=F('.2')*F('.8')/(F('.2')*F('.8')+F('.8')*F('.3'))
check(post,'.4')
positive=post*F('.75')+(1-post)*F('.2')
h_pos=post*F('.75')/positive
h_neg=post*F('.25')/(1-positive)
check(positive,'.42')
check(h_pos,F(5,7))
check(positive*h_pos+(1-positive)*h_neg,post)
check(positive*(60+100*h_pos-105),'11.1')
joint_h=list(map(F,['.65','.15','.10','.10']))
joint_n=list(map(F,['.15','.15','.05','.65']))
check(sum(joint_h),1)
check(sum(joint_n),1)
check(joint_h[0]+joint_h[1],'.8')
check(joint_n[0]+joint_n[2],'.2')
both=F('.2')*joint_h[0]+F('.8')*joint_n[0]
only_first=F('.2')*joint_h[1]+F('.8')*joint_n[1]
hp=F('.2')*joint_h[0]/both
hn=F('.2')*joint_h[1]/only_first
predict=both/(both+only_first)
check(hp,'.52')
check(hn,'.2')
check(predict,'.625')
check(predict*hp+(1-predict)*hn,'.4')
check(predict*(60+100*hp-105),'4.375')

# Backtest selection, equal starting amounts and explicit total cash outcomes.
check((180*F('.12')+20*F('-.4'))/200,'.068')
check(F('.12')-F('.068'),'.052')
check(4*F('.002'),'.008')
check(F('.1')-F('.008')-F('.01'),'.082')
check(F('.082')-F('.08'),'.002')

# Mean and individual prediction intervals; full covariance vs lag grouping.
check(F(10,5),2)
check(20-F('2.064')*2,'15.87',2)
half=D('2.064')*10*D('1.04').sqrt()
check(20-half,'-1.05',2)
check(20+half,'41.05',2)
check((100*F('.15')+30*F('-.8'))/130*100,'-6.9',1)
for n,rho,expected in [(10,F('.5'),'5.0994'),(100,F('.5'),'1.7205'),(100,F('-.5'),'.5812')]:
    by_lag=F(100,n)*(1+2*sum((1-F(k,n))*rho**k for k in range(1,n)))
    by_matrix=sum(F(100)*rho**abs(i-j) for i in range(n) for j in range(n))/n**2
    check(by_lag,by_matrix)
    check(dec(by_lag).sqrt(),expected,4)

# OLS normal equations from raw tables, solved with exact Gaussian elimination.
def fit(columns, y):
    rows=[list(map(F,row)) for row in zip(*columns)]
    y=list(map(F,y)); p=len(columns)
    a=[[sum(row[i]*row[j] for row in rows) for j in range(p)]+[sum(row[i]*v for row,v in zip(rows,y))] for i in range(p)]
    for k in range(p):
        pivot=next(i for i in range(k,p) if a[i][k])
        a[k],a[pivot]=a[pivot],a[k]
        scale=a[k][k];a[k]=[v/scale for v in a[k]]
        for i in range(p):
            if i!=k:
                scale=a[i][k];a[i]=[v-scale*u for v,u in zip(a[i],a[k])]
    b=[row[-1] for row in a]
    residual=[v-sum(c*r for c,r in zip(b,row)) for row,v in zip(rows,y)]
    return b,residual

xs=list(map(F,[-3,-2,-1,0,0,1,2,3]))
y=list(map(F,['-3.7','-1.7','-.1','-.5','.3','1.5','2.3','4.3']))
b,res=fit([[1]*8,xs],y)
require(b==[F('.3'),F('1.2')])
check(sum(res),0)
check(sum(x*e for x,e in zip(xs,res)),0)
sse=sum(e*e for e in res)
check(sse,'1.92')
check(sse/(8-2),'.32')
check(dec(sse/6/8).sqrt(),'.2')
sst=sum((v-sum(y)/8)**2 for v in y)
check(sst,'42.24')
check((1-sse/sst)*100,'95.45',2)
bnet,rnet=fit([[1]*8,xs],[v-F('.25') for v in y])
require(bnet==[F('.05'),F('1.2')] and rnet==res)
z=list(map(F,['-.5','-2','-1.5','1','1','-.5','0','2.5']))
yy=list(map(F,['-3.3','-1.1','.3','-.7','.1','1.5','2.1','3.5']))
b,res=fit([[1]*8,xs,z],yy)
require(b==[F('.3'),F('1.2'),F('-.4')])
check(sum(e*e for e in res),'1.6')
check(sum(a*e for a,e in zip(z,res)),0)
omitted,_=fit([[1]*8,xs],yy)
require(omitted==[F('.3'),F(1)])

# Tail quantile and probability mass fill; fixed weight vs buy-and-hold.
def es(distribution,confidence):
    remaining=1-confidence;total=F(0)
    for loss,prob in sorted(distribution,reverse=True):
        use=min(remaining,prob);total+=loss*use;remaining-=use
        if remaining==0:break
    require(remaining==0)
    return total/(1-confidence)

dist=[(F('-.05'),F('.8')),(F('.1'),F('.15')),(F('.4'),F('.05'))]
check(es(dist,F('.95')),'.4')
check(es(dist,F('.90')),'.25')
check(((D('1.12')**9*D('.45')).ln()/10).exp()-1,'.0224',4)
log_full=sum(dec(p)*dec(1-loss).ln() for loss,p in dist)
log_quarter=sum(dec(p)*dec(1-loss/4).ln() for loss,p in dist)
check(log_full,'-.002313',6)
check(log_quarter,'.000872',6)
check(25*F('1.05')*F('.6')+75,'90.75')
check(100*F('1.0125')*F('.9'),'91.125')
check(es([(F(0),F('.9216')),(F('.5'),F('.0768')),(F(1),F('.0016'))],F('.95')),'.516')

# Simulation expectation, Monte Carlo error and same annual cash, different dates.
check(F(106)/F('1.1')-80,'16.36',2)
check(F(84)/F('1.1')-80,'-3.64',2)
check(F(48,110)*100,'43.64',2)
check(dec(F('.24')/100000).sqrt()*100,'.1549',4)
check(F(60329,100000)*100-60,'.329')
check(F(60329,100000)*(F(150)/F('1.1')-80)+F(39671,100000)*(F(40)/F('1.1')-80),'16.692636',6)
check(F(1,2)*70+F(1,2)*0,35)
check(F(1,4)*(70+50+20+0),35)
check(max(30+5-0,30+5-35),35)
check(max(30+10-0,30+10-35),40)

# Exact binomial count law and zero-event limit; no app recurrence reused.
def binomial(n,p):
    return [F(comb(n,k))*p**k*(1-p)**(n-k) for k in range(n+1)]

null=binomial(250,F('.01'));alt=binomial(250,F('.02'))
check(sum(null),1)
check(sum(alt),1)
check(null[0]*100,'8.11',2)
check(sum(null[5:])*100,'10.7812',4)
check(sum(null[6:])*100,'4.1183',4)
check(sum(alt[6:])*100,'38.4033',4)
require(sum(null[5:])>F('.05')>sum(null[6:]))
upper=lambda n: 1-(D('.05').ln()/n).exp()
check(upper(250)*100,'1.1911',4)
require(upper(299)<=D('.01')<upper(298))
check((1-D('.00001'))**100000*100,'36.7878',4)
check(upper(100000)*100,'.002996',6)
check(F(1)-F('.00001'),F(99999,100000))
require(F(9999900)*F('.00001')*F('.01')>=1-F('.00001'))
require(F(9999899)*F('.00001')*F('.01')<1-F('.00001'))

print(f'{checks} independent quantitative-methods checks passed')
