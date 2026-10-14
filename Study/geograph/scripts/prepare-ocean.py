"""Build offline North Atlantic January/July OI SST V2 climatology views.
Usage: python prepare-ocean.py /path/sst.ltm.nc /path/lsmask.nc
Requires numpy/netCDF4. Source data stay local; output retains original 1° cells.
"""
from pathlib import Path
import sys,json,hashlib
import numpy as np
from netCDF4 import Dataset
ROOT=Path(__file__).resolve().parents[2]
p,m=map(Path,sys.argv[1:3])
with Dataset(p) as d, Dataset(m) as mask:
 assert d.variables['time'].climo_period=='1991/01/01 - 2020/12/31', 'Unexpected climatology period; review lesson labels before rebuilding'
 assert d.variables['sst'].units=='degC' and d.variables['sst'].standard_name=='sea_surface_temperature'
 a=d.variables['sst'][:]; lat=np.asarray(d.variables['lat'][:]);lon=(np.asarray(d.variables['lon'][:])+180)%360-180
 sea=np.asarray(mask.variables['mask'][0]);assert sea.shape==(180,360) and a.shape==(12,180,360)
 assert np.array_equal(mask.variables['lat'][:],d.variables['lat'][:]) and np.array_equal(mask.variables['lon'][:],d.variables['lon'][:])
 # Mask1 is sea: verified at Atlantic(34.5,-70.5); mask0 at inland North America.
 assert sea[55,289]==1 and sea[50,260]==0
 colours=['#4e709f','#729db1','#a6c4c7','#cdd8b0','#dfcb8e','#dca46d','#b9664f'];cuts=[5,10,15,20,25,30]
 for month,name in [(0,'jan'),(6,'jul')]:
  parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 735 455"><title>NOAA OI SST V2: '+name+' 1991–2020 monthly climatology, °C; Study rendering</title><desc>North Atlantic 85°W–20°E, 0–65°N; original 1-degree cells. Grey is land, ocean is temperature, not velocity or air temperature.</desc><rect width="735" height="455" fill="#e1e4da"/>']
  for i in np.flatnonzero((lat>0)&(lat<65)):
   for j in np.flatnonzero((lon>-85)&(lon<20)):
    if sea[i,j]!=1 or np.ma.is_masked(a[month,i,j]):continue
    v=float(a[month,i,j]);assert -5<=v<=40 and np.isfinite(v)
    x=(lon[j]-.5+85)*7;y=(65-lat[i]-.5)*7;c=colours[int(np.searchsorted(cuts,v,side='right'))]
    parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="7" height="7" fill="{c}"/>')
  parts.append('</svg>');(ROOT/f'public/geography/maps/sst-{name}-1991-2020.svg').write_text(''.join(parts))
 points=[]
 for key,lo in [('A',-70.5),('B',-14.5)]:
  i=int(np.argmin(abs(lat-34.5)));j=int(np.argmin(abs(lon-lo)))
  assert sea[i,j]==1
  assert np.all(d.variables['valid_yr_count'][[0,6],i,j]==30)
  points.append(dict(id=key,lat=float(lat[i]),lon=float(lon[j]),jan=round(float(a[0,i,j]),1),jul=round(float(a[6,i,j]),1)))
 meta=dict(source='NOAA Optimum Interpolation (OI) SST V2 via NOAA PSL',period='1991–2020',sourcePeriod=d.variables['time'].climo_period,units='°C',variable='sea_surface_temperature',shape=list(a.shape),months=[1,7],extent=dict(west=-85,east=20,south=0,north=65),method='Original 1° grid cells; January/July long-term monthly mean; no interpolation or annual averaging. NOAA land-sea mask, 1=sea. Points retain 30 valid years.',sourceUrl='https://downloads.psl.noaa.gov/Datasets/noaa.oisst.v2/sst.ltm.nc',maskUrl='https://downloads.psl.noaa.gov/Datasets/noaa.oisst.v2/lsmask.nc',sha256=hashlib.sha256(p.read_bytes()).hexdigest(),maskSha256=hashlib.sha256(m.read_bytes()).hexdigest(),colours=colours,cuts=cuts,points=points)
 (ROOT/'geograph/content/ocean-temperature-data.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print(json.dumps(meta,ensure_ascii=False,indent=2))
