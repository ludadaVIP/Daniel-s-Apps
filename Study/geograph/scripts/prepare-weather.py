"""Offline NCEP/NCAR R1 daily and 1991–2020 climatology extraction.
Usage: python prepare-weather.py AIR2020 RAIN2020 AIRLTM RAINLTM
Requires numpy/netCDF4. Retains exact source hashes, grid and UTC dates.
Rain rate × 86400 gives mm/day liquid-water equivalent, not monthly total.
"""
from pathlib import Path
import sys, json, hashlib
import numpy as np
from netCDF4 import Dataset, num2date

ROOT = Path(__file__).resolve().parents[2]
paths = list(map(Path, sys.argv[1:]))
assert len(paths) == 4
datasets = [Dataset(p) for p in paths]
lat = np.asarray(datasets[0]['lat'][:], dtype=float)
lon = np.asarray(datasets[0]['lon'][:], dtype=float)
for d in datasets:
    assert np.array_equal(d['lat'][:], lat) and np.array_equal(d['lon'][:], lon)
for d in datasets[:2]:
    assert len(d['time']) == 366 and d['time'].avg_period == '0000-00-01 00:00:00'
assert np.array_equal(datasets[0]['time'][:], datasets[1]['time'][:])
assert np.all(np.diff(datasets[0]['time'][:]) == 24)
for d in datasets[2:]:
    assert d['time'].climo_period == '1991/01/01 - 2020/12/31'
    assert np.all(d['valid_yr_count'][:] == 30)
assert datasets[0]['air'].units == datasets[2]['air'].units == 'degK'
assert datasets[1]['prate'].units == datasets[3]['prate'].units == 'Kg/m^2/s'
arrays = []
for k,d in enumerate(datasets):
    a=d['air' if k%2 == 0 else 'prate'][:]
    assert not np.ma.getmaskarray(a).any() and np.isfinite(a).all()
    assert a.shape == ((366 if k<2 else 12),94,192)
    assert np.min(a) >= (150 if k % 2 == 0 else 0)
    arrays.append(np.asarray(a,dtype=float) - 273.15 if k%2 == 0 else np.asarray(a,dtype=float)*86400)
dates = [str(dt)[:10] for dt in num2date(datasets[0]['time'][:],datasets[0]['time'].units)]
assert dates[0]=='2020-01-01' and dates[-1]=='2020-12-31'
points=[]
for key,zh,en,la,lo in [('nz','南岛附近网格','South Island vicinity cell',-43.5,172.5),('europe','欧洲中纬度网格','European midlatitude cell',50,11.25)]:
    i=int(np.argmin(abs(lat-la)));j=int(np.argmin(abs(lon-lo)))
    points.append(dict(id=key,zh=zh,en=en,lat=round(float(lat[i]),5),lon=float(lon[j]),temperature=[round(float(v),1) for v in arrays[2][:,i,j]],rain=[round(float(v),2) for v in arrays[3][:,i,j]],days=[dict(date=dt,temperature=round(float(arrays[0][dates.index(dt),i,j]),1),rain=round(float(arrays[1][dates.index(dt),i,j]),2)) for dt in ['2020-01-11','2020-01-15']]))
urls=[
 'https://psl.noaa.gov/thredds/fileServer/Datasets/ncep.reanalysis/Dailies/surface_gauss/air.2m.gauss.2020.nc',
 'https://psl.noaa.gov/thredds/fileServer/Datasets/ncep.reanalysis/Dailies/surface_gauss/prate.sfc.gauss.2020.nc',
 'https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.derived/surface_gauss/air.2m.mon.ltm.1991-2020.nc',
 'https://psl.noaa.gov/thredds/fileServer/Datasets/ncep.reanalysis.derived/surface_gauss/prate.sfc.mon.ltm.1991-2020.nc']
meta=dict(source='NCEP/NCAR Reanalysis 1; data provided by NOAA PSL, Boulder, Colorado, USA',period='1991–2020',dailyPeriod='2020 UTC',temperatureUnits='°C',rainUnits='mm/day liquid-water equivalent',method='Original Gaussian grid, nearest cell, no interpolation. Kelvin minus 273.15; precipitation rate kg/m²/s multiplied by 86400. Climatology monthly mean daily rate, not monthly precipitation total. All climatology valid_yr_count=30. Reanalysis estimates, not station observations or forecasts.',sources=[dict(url=u,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),shape=list(a.shape)) for u,p,a in zip(urls,paths,arrays)],points=points)
(ROOT/'geograph/content/weather-data.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
world=json.loads((ROOT/'geograph/content/map-data.json').read_text())['world']
edges=np.r_[90,(lat[:-1]+lat[1:])/2,-90]
colors=['#edf3f1','#cee1df','#87b7ba','#427b93','#27435e'];cuts=[.1,1,5,10]
for day in ['2020-01-11','2020-01-15']:
    a=arrays[1][dates.index(day)]
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 680"><title>NCEP/NCAR R1 estimated daily precipitation, {day} 00–24 UTC; mm/day liquid-water equivalent</title><rect width="780" height="680" fill="#fbfaf5"/><text x="60" y="30" font-family="sans-serif" font-size="22">{day} UTC · mm/day</text><defs><clipPath id="map"><rect x="60" y="70" width="600" height="500"/></clipPath></defs><g clip-path="url(#map)">']
    for i in range(94):
        for j in range(192):
            x=60+(lon[j]-.9375-164)*37.5;y=70+(-edges[i]-30)*25
            w=1.875*37.5;h=(edges[i]-edges[i+1])*25
            if x+w<60 or x>660 or y+h<70 or y>570:continue
            color=colors[int(np.searchsorted(cuts,a[i,j],side='right'))]
            out.append(f'<rect x="{x:.3f}" y="{y:.3f}" width="{w+.01:.3f}" height="{h+.01:.3f}" fill="{color}"/>')
    out.append(f'<path d="{world}" transform="matrix(15 0 0 10 -12840 -2930)" fill="none" stroke="#3a4e42" stroke-width=".1"/>')
    p=points[0];x=60+(p['lon']-164)*37.5;y=70+(-p['lat']-30)*25
    out.append(f'<circle cx="{x}" cy="{y}" r="8" fill="#b96450" stroke="white" stroke-width="2"/></g><rect x="60" y="70" width="600" height="500" fill="none" stroke="#465e59"/>')
    for la in [30,35,40,45,50]:out.append(f'<text x="8" y="{75+(la-30)*25}" font-family="sans-serif" font-size="16">{la}°S</text>')
    for lo in [164,168,172,176,180]:out.append(f'<text x="{45+(lo-164)*37.5}" y="595" font-family="sans-serif" font-size="16">{lo}°E</text>')
    out.append('<path d="M710 130V85L703 99M710 85L717 99" fill="none" stroke="#3a4e42" stroke-width="3"/><text x="702" y="75" font-family="sans-serif" font-size="19">N</text>')
    for n,label in enumerate(['&lt;0.1','0.1–&lt;1','1–&lt;5','5–&lt;10','≥10']):out.append(f'<rect x="{60+n*120}" y="615" width="22" height="20" fill="{colors[n]}"/><text x="{87+n*120}" y="631" font-family="sans-serif" font-size="15">{label}</text>')
    out.append('<text x="60" y="663" font-family="sans-serif" font-size="15">NOAA PSL / NCEP–NCAR R1 · Natural Earth · Study rendering</text></svg>')
    (ROOT/f'public/geography/maps/weather-rain-{day}.svg').write_text(''.join(out))
print(json.dumps(points,ensure_ascii=False,indent=2))
