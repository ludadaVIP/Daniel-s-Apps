"""Convert NOAA NCEP/NCAR R1 2 m monthly climatology to a small offline map.
Usage: python prepare-climate.py /path/air.2m.mon.ltm.1991-2020.nc
Requires numpy and netCDF4. No network request; source provenance and hash retained.
The annual mean weights the 12 monthly means by exact calendar days for the 1991–2020 period.
No interpolation: original Gaussian grid cell edges are midpoint latitude boundaries.
"""
from pathlib import Path
import sys, json, hashlib, calendar
import numpy as np
from netCDF4 import Dataset
ROOT=Path(__file__).resolve().parents[2]
p=Path(sys.argv[1]); ds=Dataset(p)
assert ds.variables['air'].units=='degK'
assert ds.variables['air'].level_desc=='2 m'
assert ds.variables['time'].climo_period=='1991/01/01 - 2020/12/31'
assert np.all(ds.variables['valid_yr_count'][:]==30)
assert not np.ma.getmaskarray(ds.variables['air'][:]).any()
a=np.asarray(ds.variables['air'][:],dtype=float)
assert a.shape==(12,94,192) and np.isfinite(a).all() and a.min() >= 150 and a.max() <= 400
days=np.array([sum(calendar.monthrange(y,m)[1] for y in range(1991,2021))/30 for m in range(1,13)])
annual=np.average(a,axis=0,weights=days)-273.15
lat=np.asarray(ds.variables['lat'][:]);lon=np.asarray(ds.variables['lon'][:]); order=np.argsort((lon+180)%360-180);lon=(lon[order]+180)%360-180; annual=annual[:,order]
edges=np.r_[90,(lat[:-1]+lat[1:])/2,-90]
colors=['#345b91','#6f9fbc','#bbd4d4','#eadba5','#d9aa72','#b96450','#873e42']; cuts=[-20,-10,0,10,20,30]
parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450"><title>1991–2020 NCEP/NCAR Reanalysis 1 annual mean 2 m air temperature, °C; Study rendering, NOAA PSL data</title>']
for i in range(94):
 y=(90-edges[i])*2.5;h=(edges[i]-edges[i+1])*2.5
 for j in range(192):
  v=annual[i,j]; color=colors[int(np.searchsorted(cuts,v,side='right'))];x=(lon[j]+180-0.9375)*2.5
  # Wrap the half-cell at the antimeridian; remaining cells need no interpolation.
  for xx in [x]+([x+900] if x<0 else []):
   parts.append(f'<rect x="{xx:.3f}" y="{y:.3f}" width="4.689" height="{h+.004:.3f}" fill="{color}"/>')
parts.append('</svg>');out=ROOT/'public/geography/maps/climate-1991-2020.svg';out.write_text(''.join(parts))
points=[]
for name,zh,la,lo,terrain in [('tropical','热带低地',0,22.5,'low'),('temperate','温带低地',50,11.25,'low'),('polar','格陵兰高纬度',75,-41.25,'high'),('plateau','青藏高原',31,86.25,'high'),('lowland','相近纬度低地',31,116.25,'low')]:
 i=int(np.argmin(abs(lat-la)));j=int(np.argmin(abs(lon-lo)))
 points.append(dict(id=name,zh=zh,lat=round(float(lat[i]),3),lon=round(float(lon[j]),3),celsius=round(float(annual[i,j]),1),terrain=terrain))
meta=dict(source='NCEP/NCAR Reanalysis 1, NOAA PSL',period='1991–2020',units='°C',level='2 m above model surface',method='Day-weighted mean of 12 long-term monthly means; exact calendar days for 1991–2020 (Feb 28.2666667 days). Original Gaussian grid, no interpolation.',sourceUrl='https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.derived/surface_gauss/air.2m.mon.ltm.1991-2020.nc',sha256=hashlib.sha256(p.read_bytes()).hexdigest(),shape=list(a.shape),sourcePeriod=ds.variables['time'].climo_period,monthWeights=days.tolist(),points=points)
(ROOT/'geograph/content/climate-data.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print(json.dumps(meta,ensure_ascii=False,indent=2))
