"""Build ten offline, auditable weekly index reports from FRED daily CSV files."""

from __future__ import annotations

import csv
import hashlib
import html
import math
import statistics
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source"
YEARS = range(2021, 2026)
SERIES = {
    "SP500": {
        "name": "标普 500",
        "latin": "S&P 500",
        "etf": "VOO",
        "provider": "S&P Dow Jones Indices LLC",
        "source": "https://fred.stlouisfed.org/series/SP500",
        "fund": "https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf",
        "accent": "#41c7ae",
        "compare": "NASDAQ100",
    },
    "NASDAQ100": {
        "name": "纳斯达克 100",
        "latin": "Nasdaq-100",
        "etf": "QQQM",
        "provider": "Nasdaq, Inc.",
        "source": "https://fred.stlouisfed.org/series/NASDAQ100",
        "fund": "https://www.invesco.com/us/en/financial-products/etfs/invesco-nasdaq-100-etf.html",
        "accent": "#87a7ff",
        "compare": "SP500",
    },
}


def read_daily(code: str) -> dict[date, float]:
    path = SOURCE / f"{code}_daily_FRED.csv"
    with path.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    assert len(rows) >= 1300, (code, len(rows))
    result = {}
    for row in rows:
        value = row[code]
        if value:
            result[date.fromisoformat(row["observation_date"])] = float(value)
    assert date(2020, 12, 31) in result, code
    assert date(2025, 12, 31) in result, code
    return result


DAILY = {code: read_daily(code) for code in SERIES}


def iso(d: date) -> str:
    return d.isoformat()


def fmt(n: float, digits: int = 2) -> str:
    return f"{n:,.{digits}f}"


def pct(n: float, digits: int = 2, signed: bool = True) -> str:
    return f"{n:+.{digits}f}%" if signed else f"{n:.{digits}f}%"


def e(s: object) -> str:
    return html.escape(str(s), quote=True)


def previous_close(daily: dict[date, float], day: date) -> tuple[date, float]:
    candidates = [d for d in daily if d < day]
    assert candidates
    d = max(candidates)
    return d, daily[d]


def weekly(code: str, year: int) -> list[dict]:
    daily = DAILY[code]
    days = sorted(d for d in daily if d.year == year)
    assert len(days) >= 240, (code, year, len(days))
    grouped: dict[date, list[date]] = defaultdict(list)
    for d in days:
        grouped[d - timedelta(days=d.weekday())].append(d)
    prior_date, prior = previous_close(daily, date(year, 1, 1))
    running_peak = prior
    records = []
    returns = []
    for monday, trading_days in sorted(grouped.items()):
        first, last = trading_days[0], trading_days[-1]
        close = daily[last]
        low, high = min(daily[d] for d in trading_days), max(daily[d] for d in trading_days)
        change = close - prior
        ret = (close / prior - 1) * 100
        returns.append(ret)
        running_peak = max(running_peak, close)
        drawdown = (close / running_peak - 1) * 100
        vol13 = statistics.stdev(returns[-13:]) * math.sqrt(52) if len(returns) >= 13 else None
        records.append({
            "number": len(records) + 1,
            "monday": monday,
            "first": first,
            "last": last,
            "prior_date": prior_date,
            "prior": prior,
            "close": close,
            "change": change,
            "return": ret,
            "low": low,
            "high": high,
            "range": (high - low) / prior * 100,
            "drawdown": drawdown,
            "vol13": vol13,
            "trading_days": len(trading_days),
        })
        prior_date, prior = last, close
    assert records[0]["prior_date"].year == year - 1
    assert records[-1]["last"] == max(days)
    assert abs(math.prod(1 + r["return"] / 100 for r in records) - records[-1]["close"] / records[0]["prior"]) < 1e-10
    return records


WEEKS = {(code, year): weekly(code, year) for code in SERIES for year in YEARS}


def path_points(points: list[tuple[float, float]]) -> str:
    return " ".join(("M" if i == 0 else "L") + f"{x:.1f},{y:.1f}" for i, (x, y) in enumerate(points))


def xy_plot(values: list[float], width=1250, height=330, pad=(62, 24, 30, 50), y_min=None, y_max=None):
    left, top, right, bottom = pad
    lo = min(values) if y_min is None else y_min
    hi = max(values) if y_max is None else y_max
    if abs(hi - lo) < 1e-9:
        hi, lo = hi + 1, lo - 1
    lo -= (hi - lo) * 0.06
    hi += (hi - lo) * 0.06
    plot_w, plot_h = width - left - right, height - top - bottom
    pts = [(left + i * plot_w / max(len(values) - 1, 1), top + (hi - v) / (hi - lo) * plot_h) for i, v in enumerate(values)]
    return pts, (lo, hi, left, top, plot_w, plot_h)


def axes(bounds, width=1250, height=330, mode="pct") -> str:
    lo, hi, left, top, plot_w, plot_h = bounds
    out = []
    for j in range(5):
        v = lo + (hi - lo) * j / 4
        y = top + (hi - v) / (hi - lo) * plot_h
        lab = f"{v:.0f}%" if mode == "pct" else f"{v:,.0f}"
        out.append(f'<line x1="{left}" y1="{y:.1f}" x2="{left + plot_w}" y2="{y:.1f}" stroke="#283345" stroke-width="1"/>')
        out.append(f'<text x="{left-12}" y="{y+4:.1f}" text-anchor="end" class="axis">{lab}</text>')
    for i, lab in enumerate(["1月", "3月", "5月", "7月", "9月", "11月"]):
        x = left + i * plot_w / 6
        out.append(f'<text x="{x:.1f}" y="{height-13}" class="axis">{lab}</text>')
    return "".join(out)


def compare_chart(code: str, year: int, rows: list[dict]) -> str:
    other_code = SERIES[code]["compare"]
    other = WEEKS[(other_code, year)]
    # Both series share U.S. trading dates here; enforce this for aligned chart points.
    assert [r["last"] for r in rows] == [r["last"] for r in other]
    a = [100 * r["close"] / rows[0]["prior"] for r in rows]
    b = [100 * r["close"] / other[0]["prior"] for r in other]
    pts_a, bounds = xy_plot(a + b, y_min=min(a+b+[100]), y_max=max(a+b+[100]))
    # xy_plot with concatenation changes x spacing; use its common y scale only.
    lo, hi, left, top, plot_w, plot_h = bounds
    def coordinates(vals):
        return [(left+i*plot_w/(len(vals)-1), top+(hi-v)/(hi-lo)*plot_h) for i,v in enumerate(vals)]
    ca, cb = coordinates(a), coordinates(b)
    base_y = top + (hi-100)/(hi-lo)*plot_h
    accent = SERIES[code]["accent"]
    other_accent = SERIES[other_code]["accent"]
    circles = "".join(f'<a href="#week-{r["number"]}"><circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="transparent"><title>第{r["number"]}周 · {iso(r["last"])} · {SERIES[code]["name"]} {v:.1f}</title></circle></a>' for r,(x,y),v in zip(rows,ca,a))
    return f'''<svg viewBox="0 0 1250 330" role="img" aria-label="{year}年两指数以去年末为100的周末点位比较" class="chart">
      {axes(bounds)}<line x1="{left}" y1="{base_y:.1f}" x2="{left+plot_w}" y2="{base_y:.1f}" stroke="#8997ad" stroke-dasharray="5 5"/>
      <path d="{path_points(cb)}" fill="none" stroke="{other_accent}" stroke-width="3" opacity=".58"/>
      <path d="{path_points(ca)}" fill="none" stroke="{accent}" stroke-width="4"/>
      {circles}</svg>'''


def returns_chart(rows: list[dict]) -> str:
    width, height, left, top, right, bottom = 1250, 310, 64, 25, 25, 38
    plot_w, plot_h = width-left-right, height-top-bottom
    vals = [r["return"] for r in rows]
    limit = max(abs(min(vals)), abs(max(vals))) * 1.12
    zero_y = top + plot_h/2
    scale = plot_h/2/limit
    gap = plot_w/len(rows)
    out = [f'<line x1="{left}" y1="{zero_y:.1f}" x2="{left+plot_w}" y2="{zero_y:.1f}" stroke="#8d9db3"/>']
    for j in [-1, 1]:
        y = zero_y-j*limit*.5*scale
        out.append(f'<line x1="{left}" y1="{y:.1f}" x2="{left+plot_w}" y2="{y:.1f}" stroke="#283345"/>')
        out.append(f'<text x="{left-10}" y="{y+4:.1f}" text-anchor="end" class="axis">{j*limit*.5:+.1f}%</text>')
    for i, r in enumerate(rows):
        v = r["return"]
        x = left+(i+.12)*gap
        h = abs(v)*scale
        y = zero_y-h if v>=0 else zero_y
        color = "#41c7ae" if v>=0 else "#ff8c89"
        out.append(f'<a href="#week-{r["number"]}"><rect x="{x:.1f}" y="{y:.1f}" width="{gap*.76:.1f}" height="{max(h,1):.1f}" fill="{color}" opacity=".89"><title>第{r["number"]}周 · {iso(r["last"])} · {pct(v)}</title></rect></a>')
        if i % 8 == 0:
            out.append(f'<text x="{x:.1f}" y="{height-11}" class="axis">W{r["number"]:02d}</text>')
    return f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="逐周涨跌幅柱状图" class="chart">{"".join(out)}</svg>'


def drawdown_chart(rows: list[dict]) -> str:
    vals = [r["drawdown"] for r in rows]
    pts,bounds = xy_plot(vals, width=620, height=270, pad=(58,25,18,42), y_max=0)
    lo,hi,left,top,plot_w,plot_h = bounds
    zero = top+(hi-0)/(hi-lo)*plot_h
    fillpath = path_points(pts)+f" L{pts[-1][0]:.1f},{zero:.1f} L{pts[0][0]:.1f},{zero:.1f} Z"
    return f'<svg viewBox="0 0 620 270" role="img" aria-label="年内周末收盘回撤折线面积图" class="chart">{axes(bounds,620,270)}<path d="{fillpath}" fill="#ff8c89" opacity=".14"/><path d="{path_points(pts)}" fill="none" stroke="#ff8c89" stroke-width="3"/></svg>'


def volatility_chart(rows: list[dict]) -> str:
    vals = [r["vol13"] for r in rows]
    shown = [(i,v) for i,v in enumerate(vals) if v is not None]
    assert shown
    width,height,left,top,right,bottom = 620,270,58,25,18,42
    lo, hi = 0, max(v for _,v in shown)*1.12
    plot_w, plot_h = width-left-right,height-top-bottom
    pts = [(left+i*plot_w/(len(rows)-1),top+(hi-v)/(hi-lo)*plot_h) for i,v in shown]
    bounds=(lo,hi,left,top,plot_w,plot_h)
    return f'<svg viewBox="0 0 620 270" role="img" aria-label="13周滚动年化历史波动率折线图" class="chart">{axes(bounds,620,270)}<path d="{path_points(pts)}" fill="none" stroke="#b7a6fa" stroke-width="3"/></svg>'


def histogram(rows: list[dict]) -> str:
    vals=[r["return"] for r in rows]
    buckets=[(-math.inf,-3,"≤ −3%"),(-3,-1,"−3～−1%"),(-1,0,"−1～0%"),(0,1,"0～1%"),(1,3,"1～3%"),(3,math.inf,"> 3%")]
    counts=[sum(1 for v in vals if lo<v<=hi) for lo,hi,_ in buckets]
    maxc=max(counts)
    bars=[]
    for i,((_,_,label),count) in enumerate(zip(buckets,counts)):
        x=55+i*86
        y=205-count/maxc*150
        color="#ff8c89" if i<3 else "#41c7ae"
        bars.append(f'<rect x="{x}" y="{y:.1f}" width="60" height="{205-y:.1f}" rx="5" fill="{color}" opacity=".83"/><text x="{x+30}" y="{y-9:.1f}" class="axis" text-anchor="middle">{count}</text><text x="{x+30}" y="231" class="axis" text-anchor="middle">{label}</text>')
    return f'<svg viewBox="0 0 620 255" role="img" aria-label="周涨跌幅分布柱状图" class="chart"><line x1="40" y1="205" x2="590" y2="205" stroke="#59687e"/>{"".join(bars)}</svg>'


def month_table(code: str, year: int, rows: list[dict]) -> str:
    out=[]
    daily=DAILY[code]
    for month in range(1,13):
        subset=[r for r in rows if r["last"].month==month]
        if not subset:
            continue
        _, month_base=previous_close(daily,date(year,month,1))
        month_last=max(d for d in daily if d.year==year and d.month==month)
        total=(daily[month_last]/month_base-1)*100
        best=max(subset,key=lambda r:r["return"])
        worst=min(subset,key=lambda r:r["return"])
        out.append(f'<tr><th>{month:02d}月</th><td>{len(subset)}</td><td class="{ "pos" if total>=0 else "neg"}">{pct(total)}</td><td>{sum(r["return"]>0 for r in subset)}</td><td>{sum(r["return"]<0 for r in subset)}</td><td>{pct(best["return"])} · W{best["number"]:02d}</td><td>{pct(worst["return"])} · W{worst["number"]:02d}</td></tr>')
    return "".join(out)


def table_rows(rows: list[dict]) -> str:
    out=[]
    for r in rows:
        cls="pos" if r["return"]>=0 else "neg"
        weekly_window=f'{r["monday"].month:02d}/{r["monday"].day:02d}–{(r["monday"]+timedelta(days=6)).month:02d}/{(r["monday"]+timedelta(days=6)).day:02d}'
        vol="—" if r["vol13"] is None else pct(r["vol13"],signed=False)
        out.append(f'''<tr id="week-{r["number"]}" data-search="W{r["number"]:02d} {iso(r["last"])} {weekly_window}">
          <th>W{r["number"]:02d}</th><td>{weekly_window}</td><td>{iso(r["prior_date"])}</td><td class="num">{fmt(r["prior"])}</td>
          <td>{iso(r["last"])}</td><td class="num">{fmt(r["close"])}</td><td class="num {cls}">{r["change"]:+,.2f}</td>
          <td class="num {cls} emphasis">{pct(r["return"])}</td><td class="num">{fmt(r["low"])}–{fmt(r["high"])}</td>
          <td class="num">{pct(r["range"],signed=False)}</td><td class="num neg">{pct(r["drawdown"])}</td><td class="num">{vol}</td></tr>''')
    return "".join(out)


def summary(code: str, year: int, rows: list[dict]) -> dict:
    ret=(rows[-1]["close"]/rows[0]["prior"]-1)*100
    rets=[r["return"] for r in rows]
    best=max(rows,key=lambda r:r["return"])
    worst=min(rows,key=lambda r:r["return"])
    maxdown=min(rows,key=lambda r:r["drawdown"])
    meanabs=statistics.mean(abs(v) for v in rets)
    down3=sum(v<=-3 for v in rets)
    up3=sum(v>=3 for v in rets)
    negstreak=cur=0
    for v in rets:
        cur=cur+1 if v<0 else 0
        negstreak=max(negstreak,cur)
    return dict(ret=ret,best=best,worst=worst,maxdown=maxdown,meanabs=meanabs,down3=down3,up3=up3,negstreak=negstreak)


CSS = r"""
:root{color-scheme:dark;--bg:#0b111b;--panel:#141e2c;--panel2:#172437;--line:#2a3a4f;--text:#f2f6fc;--muted:#aebdd0;--up:#41c7ae;--down:#ff8c89;--gold:#f6ca73}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(ellipse at 15% 0%,#20314a 0%,#0b111b 46%);font:16px/1.55 Inter,"Segoe UI","Microsoft YaHei",sans-serif;color:var(--text)}
a{color:inherit}a:hover{color:var(--gold)}.shell{width:calc(100% - 72px);max-width:2820px;margin:auto;padding:30px 0 80px}
.top{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line);padding-bottom:18px}.brand{font-size:13px;letter-spacing:.18em;font-weight:800;color:var(--gold)}.toplinks{display:flex;gap:18px;color:var(--muted);font-size:14px}
.yearnav{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 26px}.yearnav a{border:1px solid var(--line);border-radius:9px;padding:8px 14px;text-decoration:none;color:var(--muted);font-weight:700}.yearnav a.active{background:var(--accent);border-color:var(--accent);color:#07131c}
.hero{display:grid;grid-template-columns:minmax(500px,1.8fr) minmax(310px,1fr);gap:26px;align-items:end;margin:34px 0 25px}.eyebrow{font-size:14px;letter-spacing:.12em;color:var(--accent);font-weight:800}.hero h1{font-size:clamp(42px,4.1vw,80px);line-height:1.08;letter-spacing:-.04em;margin:8px 0 10px}.sub{font-size:20px;color:var(--muted);max-width:820px;margin:0}.hero-note{border-left:3px solid var(--accent);padding:10px 0 10px 20px;color:var(--muted);font-size:16px}.hero-note strong{color:var(--text)}
.kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:13px;margin:24px 0 28px}.kpi{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:16px 18px;min-height:116px}.kpi .label{font-size:13px;color:var(--muted)}.kpi .value{font-size:clamp(23px,1.75vw,35px);font-weight:800;letter-spacing:-.025em;margin:6px 0 0}.kpi .fine{font-size:12px;color:var(--muted)}.pos{color:var(--up)!important}.neg{color:var(--down)!important}
.grid{display:grid;grid-template-columns:1.8fr 1fr;gap:18px}.card{background:linear-gradient(145deg,#172437,#111b29);border:1px solid var(--line);border-radius:16px;padding:20px 22px;min-width:0}.card h2{font-size:22px;margin:0 0 5px}.card p{margin:0 0 14px;color:var(--muted);font-size:14px}.wide{grid-column:1/-1}.chart{display:block;width:100%;height:auto;overflow:visible}.axis{fill:#aab8ca;font-size:12px;font-family:Inter,"Segoe UI",sans-serif}.legend{display:flex;gap:20px;align-items:center;color:var(--muted);font-size:13px}.swatch{display:inline-block;width:17px;height:3px;vertical-align:middle;margin-right:6px}
.insights{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}.insight{background:#121d2b;border:1px solid var(--line);border-radius:12px;padding:17px}.insight .tag{font-size:12px;color:var(--gold);font-weight:800;letter-spacing:.08em}.insight strong{display:block;font-size:19px;margin:6px 0}.insight p{margin:0;color:var(--muted);font-size:13px}
.datahead{display:flex;justify-content:space-between;align-items:end;gap:20px;margin:34px 0 13px}.datahead h2{margin:0;font-size:26px}.datahead p{margin:3px 0 0;color:var(--muted)}input[type=search]{background:#111c2a;color:var(--text);border:1px solid var(--line);border-radius:9px;padding:10px 14px;font-size:15px;min-width:250px}
.tablewrap{overflow:auto;border:1px solid var(--line);border-radius:14px;background:#111b28;max-height:760px}table{width:100%;border-collapse:collapse;white-space:nowrap;font-size:13px}th,td{padding:11px 13px;border-bottom:1px solid #253447;text-align:left}thead th{position:sticky;top:0;background:#223149;color:#dde8f4;z-index:2;font-weight:800}tbody tr:nth-child(even){background:#142031}tbody tr:hover{background:#24374d}tbody tr:target{outline:2px solid var(--gold);background:#27394b}.num{text-align:right;font-variant-numeric:tabular-nums}.emphasis{font-weight:800;font-size:14px}tfoot td{font-weight:800}
.method{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:22px}.method h2{font-size:20px;margin:0 0 8px}.method ul{margin:0;padding-left:20px;color:var(--muted)}.method li{margin:7px 0}.method a{color:#b8caff}.smalltable{width:100%;font-size:14px}.smalltable td,.smalltable th{padding:7px 9px}.smalltable th{color:var(--text)}.foot{color:var(--muted);font-size:12px;border-top:1px solid var(--line);margin-top:32px;padding-top:15px}.print{background:none;border:1px solid var(--line);color:var(--muted);border-radius:8px;padding:8px 12px;cursor:pointer}
@media(max-width:1450px){.kpis{grid-template-columns:repeat(3,1fr)}.insights{grid-template-columns:repeat(2,1fr)}}@media(max-width:950px){.shell{width:calc(100% - 28px)}.hero,.grid,.method{grid-template-columns:1fr}.hero{gap:16px}.hero h1{font-size:42px}.kpis{grid-template-columns:repeat(2,1fr)}.insights{grid-template-columns:1fr}.toplinks{display:none}}@media print{body{background:#fff;color:#111}.shell{width:100%;padding:0}.card,.kpi,.insight,.tablewrap{background:#fff;color:#111;border-color:#bbb}.yearnav,.print,input{display:none}.tablewrap{max-height:none;overflow:visible}thead th{position:static;background:#ddd;color:#111}tbody tr:nth-child(even){background:#eee}.method a{color:#111}}
"""


def build(code: str, year: int) -> None:
    cfg=SERIES[code]
    rows=WEEKS[(code,year)]
    stat=summary(code,year,rows)
    other=SERIES[cfg["compare"]]
    other_stat=summary(cfg["compare"],year,WEEKS[(cfg["compare"],year)])
    code_name="sp500" if code=="SP500" else "nasdaq100"
    other_name="nasdaq100" if code=="SP500" else "sp500"
    yearlinks="".join(f'<a class="{"active" if y==year else ""}" href="{code_name}_{y}.html">{y}</a>' for y in YEARS)
    crosslinks="".join(f'<a class="{"active" if y==year else ""}" href="{other_name}_{y}.html">{other["name"]} {y}</a>' for y in YEARS)
    rawpath=SOURCE/f"{code}_daily_FRED.csv"
    digest=hashlib.sha256(rawpath.read_bytes()).hexdigest()
    first, last=rows[0],rows[-1]
    posweeks=sum(r["return"]>0 for r in rows)
    negweeks=sum(r["return"]<0 for r in rows)
    anchor=first["prior"]
    source_dl=f'https://fred.stlouisfed.org/graph/fredgraph.csv?id={code}&cosd=2020-12-24&coed=2025-12-31'
    html_doc=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{year} {cfg["name"]} 每周波动 | {cfg["etf"]} 参考</title><style>{CSS}</style></head>
<body style="--accent:{cfg["accent"]}"><main class="shell">
<header class="top"><div class="brand">MARKET WEEKLY ATLAS · 2021—2025</div><div class="toplinks"><a href="#overview">全年走势</a><a href="#volatility">波动与风险</a><a href="#weekly-data">逐周数据</a><a href="#method">数据口径</a><button class="print" onclick="window.print()">打印 / PDF</button></div></header>
<nav class="yearnav" aria-label="标普500年份">{yearlinks}</nav><nav class="yearnav" aria-label="纳斯达克100年份">{crosslinks}</nav>
<section class="hero"><div><div class="eyebrow">{year} · WEEKLY MARKET STUDY · 对应ETF {cfg["etf"]}</div><h1>{cfg["name"]}<br>{year} 每周波动</h1><p class="sub">完整记录 {len(rows)} 个交易周的前周收盘、本周收盘、涨跌幅与周内日收盘范围。将每一次起伏放回全年的走势和风险背景里看。</p></div><div class="hero-note"><strong>观察对象是指数，而非ETF成交价。</strong><br>{cfg["etf"]} 跟踪 {cfg["latin"]}；指数收盘点位不含ETF费率、交易价差、跟踪误差或分红再投资。因此图中的涨幅不可直接当作持有 {cfg["etf"]} 的实际回报。</div></section>
<section class="kpis" aria-label="全年关键数字">
<div class="kpi"><div class="label">全年指数涨跌 · 以前一年末为基准</div><div class="value {"pos" if stat["ret"]>=0 else "neg"}">{pct(stat["ret"])}</div><div class="fine">{fmt(anchor)} → {fmt(last["close"])} 点</div></div>
<div class="kpi"><div class="label">上涨 / 下跌周</div><div class="value">{posweeks} <span class="fine">/</span> {negweeks}</div><div class="fine">共 {len(rows)} 周；零涨跌 {len(rows)-posweeks-negweeks} 周</div></div>
<div class="kpi"><div class="label">平均每周绝对涨跌</div><div class="value">{pct(stat["meanabs"],signed=False)}</div><div class="fine">描述常见波动幅度，不表示方向</div></div>
<div class="kpi"><div class="label">最大上涨周</div><div class="value pos">{pct(stat["best"]["return"])}</div><div class="fine">W{stat["best"]["number"]:02d} · {iso(stat["best"]["last"])}</div></div>
<div class="kpi"><div class="label">最大下跌周</div><div class="value neg">{pct(stat["worst"]["return"])}</div><div class="fine">W{stat["worst"]["number"]:02d} · {iso(stat["worst"]["last"])}</div></div>
<div class="kpi"><div class="label">年内最大周末回撤</div><div class="value neg">{pct(stat["maxdown"]["drawdown"])}</div><div class="fine">以前一年末及年内周末高点为峰</div></div></section>
<section class="grid" id="overview"><article class="card wide"><h2>一年走势 · 与另一指数同基准比较</h2><p>将两指数的前一年最后交易日收盘归一为 100；每个点是本周最后一个交易日收盘。点击主线位置可跳到对应周明细。</p>{compare_chart(code,year,rows)}<div class="legend"><span><i class="swatch" style="background:{cfg["accent"]}"></i>{cfg["name"]} · 年末 {pct(stat["ret"])}</span><span><i class="swatch" style="background:{other["accent"]}"></i>{other["name"]} · 年末 {pct(other_stat["ret"])}</span></div></article>
<article class="card wide"><h2>每周收益 · 一眼看出大涨大跌发生在哪里</h2><p>周收益 = 本周收盘 ÷ 上周收盘 − 1。绿色上涨，红色下跌；柱子可点击跳至数据表。</p>{returns_chart(rows)}</article>
<article class="card" id="volatility"><h2>从年内高点回撤</h2><p>每周收盘相对截至当周最高收盘的跌幅；年初把前一年末收盘也计入峰值。</p>{drawdown_chart(rows)}</article>
<article class="card"><h2>13周滚动历史波动率</h2><p>最近13个周收益的样本标准差 × √52；该年的前12周未计算，图线从第13周开始。</p>{volatility_chart(rows)}</article>
<article class="card"><h2>周收益分布</h2><p>按周涨跌幅分组计数。边界按左开右闭；最左组包含等于 −3% 的周。</p>{histogram(rows)}</article>
<article class="card"><h2>逐月速览</h2><p>月涨跌按上月最后交易日收盘至本月最后交易日收盘计算；周数及最好/最差周按本周收盘日期归属，跨月周会跨越月界。</p><table class="smalltable"><thead><tr><th>月份</th><th>周数</th><th>涨跌</th><th>涨周</th><th>跌周</th><th>最好周</th><th>最差周</th></tr></thead><tbody>{month_table(code,year,rows)}</tbody></table></article></section>
<section class="insights" aria-label="阅读提示"><div class="insight"><div class="tag">TAIL RISK</div><strong>≤ −3% 的周：{stat["down3"]} 次</strong><p>≥ +3% 的周：{stat["up3"]} 次。以阈值看尾部，不只看全年平均数。</p></div><div class="insight"><div class="tag">DOWNSIDE RUN</div><strong>最长连续下跌：{stat["negstreak"]} 周</strong><p>连续周数只代表这段历史，并不能预测下一轮回撤。</p></div><div class="insight"><div class="tag">RANGE</div><strong>周内日收盘振幅</strong><p>表中高低值仅由该周每日收盘构成，不是盘中最高价或最低价。</p></div><div class="insight"><div class="tag">ETF LENS</div><strong>{cfg["etf"]} · 跟踪 {cfg["latin"]}</strong><p>若比较实际投资结果，另看ETF总回报、费率、税务、买卖价差及汇率。</p></div></section>
<section id="weekly-data"><div class="datahead"><div><h2>全部 {len(rows)} 周 · 可核对明细</h2><p>点击上方图表可定位；输入日期、W周号或周段可筛选。点位保留两位小数，百分比按未四舍五入的数计算后展示。</p></div><input type="search" id="filter" placeholder="查找 W08 / 2025-03-07" aria-label="筛选周明细"></div>
<div class="tablewrap"><table id="weekly-table"><thead><tr><th>周</th><th>日历周段</th><th>上周收盘日</th><th class="num">上周收盘</th><th>本周收盘日</th><th class="num">本周收盘</th><th class="num">涨跌点</th><th class="num">周涨跌</th><th class="num">本周日收盘低–高</th><th class="num">日收盘振幅</th><th class="num">年内回撤</th><th class="num">13周波动率</th></tr></thead><tbody>{table_rows(rows)}</tbody></table></div></section>
<section class="method" id="method"><article class="card"><h2>计算规则与边界</h2><ul><li><strong>周：</strong>按美东交易日期的周一至周日分组；跨年周在12月31日与1月1日切开，因此年初与年末可为不完整交易周。休市日无收盘价，以该周最后一个有值的交易日为“本周收盘”。</li><li><strong>上周收盘：</strong>本周之前最近一个有值的交易日收盘。第一周使用上一年最后交易日，保证全年周收益连乘等于全年指数涨跌。</li><li><strong>周涨跌：</strong>(本周收盘 ÷ 上周收盘 − 1) × 100%；涨跌点为两收盘之差。</li><li><strong>日收盘振幅：</strong>(本周最高日收盘 − 最低日收盘) ÷ 上周收盘 × 100%；这不是盘中振幅。</li><li><strong>年内回撤：</strong>本周收盘 ÷ 截至当周的最高周收盘（包括上一年末基准）− 1。</li><li><strong>13周波动率：</strong>最近13周周收益的样本标准差 × √52；这是历史指标，不是未来风险预测。</li></ul></article>
<article class="card"><h2>数据来源与核验</h2><ul><li>原始提供方：{e(cfg["provider"])}；通过美国圣路易斯联储 FRED 的 <a href="{cfg["source"]}" target="_blank" rel="noopener">{code} 每日收盘序列</a> 取得，单位为指数点。<a href="{source_dl}" target="_blank" rel="noopener">原始CSV下载链接</a> · <a href="source/{code}_daily_FRED.csv" download>本地原始CSV</a>。</li><li>ETF对应关系：<a href="{cfg["fund"]}" target="_blank" rel="noopener">{cfg["etf"]} 发行方产品资料</a>。本报告不使用ETF历史行情或基金净值。</li><li>数据提取日期：2026-09-28。数据区间：2020-12-24 至 2025-12-31；报告范围：{year}-01-01 至 {year}-12-31。原始文件 SHA-256：<code>{digest}</code>。</li><li>验证：有效交易日按原始CSV中的非空收盘价筛选；同年每个交易日只归入一个周；周收益连乘已和首尾收盘之比核对。跨指数比较的周末日期已逐项核对一致。</li><li>指数是价格指数，未计股息；ETF实际回报还受分红、费用、跟踪和交易因素影响。历史波动不能保证未来表现。</li></ul></article></section>
<footer class="foot">数据归属 {e(cfg["provider"])}，经 FRED 提供。图表与统计由原始每日收盘数据计算。本资料用于历史研究；请参阅来源页面的版权及使用条款。</footer>
</main><script>const input=document.getElementById('filter');input.addEventListener('input',()=>{{let q=input.value.trim().toLowerCase();document.querySelectorAll('#weekly-table tbody tr').forEach(tr=>{{tr.hidden=!tr.dataset.search.toLowerCase().includes(q)}})}});</script></body></html>'''
    (ROOT/f"{code_name}_{year}.html").write_text(html_doc,encoding="utf-8")


if __name__ == "__main__":
    for code in SERIES:
        for year in YEARS:
            build(code,year)
            stat=summary(code,year,WEEKS[(code,year)])
            print(f"{code:9s} {year}: {len(WEEKS[(code,year)])} weeks, annual {stat['ret']:+.4f}%, first {WEEKS[(code,year)][0]['prior_date']}, last {WEEKS[(code,year)][-1]['last']}")
