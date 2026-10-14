"""Offline GEO-039/040 GPCP V2.3 monthly/annual precipitation reference.
Usage: python prepare-climate-processes.py GPCP_1991_2020.nc AIR_1991_2020.nc
Original 2.5° precipitation and Gaussian 2 m temperature grids stay separate.
Monthly precipitation rate × exact mean calendar days gives mm/month.
Sum the unrounded months for mm/year. No interpolation or desert classifier.
"""
from pathlib import Path
import sys,json,hashlib,calendar
import numpy as np
from netCDF4 import Dataset
ROOT=Path(__file__).resolve().parents[2]
p,a=map(Path,sys.argv[1:]);rain=Dataset(p);air=Dataset(a)
assert rain.version=='V2.3' and rain['precip'].units=='mm/day'
assert air['air'].units=='degK' and air['air'].level_desc=='2 m'
for ds in [rain,air]:
    assert ds['time'].climo_period=='1991/01/01 - 2020/12/31'
    assert np.all(ds['valid_yr_count'][:]==30)
days=np.array([sum(calendar.monthrange(y,m)[1] for y in range(1991,2021))/30 for m in range(1,13)])
r=rain['precip'][:];t=air['air'][:]
assert r.shape==(12,72,144) and t.shape==(12,94,192)
assert not np.ma.getmaskarray(r).any() and not np.ma.getmaskarray(t).any()
assert np.isfinite(r).all() and np.min(r)>=0 and np.isfinite(t).all()
r=np.asarray(r,dtype=float);t=np.asarray(t,dtype=float)-273.15
annual=np.sum(r*days[:,None,None],axis=0)
points=[]
for key,zh,en,la,lo,kind in [
 ('india-west','印度西岸附近','West India vicinity',19,73,'monsoon'),
 ('india-southeast','印度东南海岸附近','SE India coast vicinity',13.08,80.27,'monsoon'),
 ('sahara','撒哈拉样点','Sahara sample',24,15,'desert'),
 ('gobi','戈壁样点','Gobi sample',43,105,'desert'),
 ('atacama','阿塔卡马附近样点','Atacama vicinity sample',-24,290,'desert'),
 ('antarctica','南极内陆样点','Antarctic interior sample',-80,0,'desert')]:
    ri=int(np.argmin(abs(rain['lat'][:]-la)));rj=int(np.argmin(abs(rain['lon'][:]-lo)))
    ti=int(np.argmin(abs(air['lat'][:]-la)));tj=int(np.argmin(abs(air['lon'][:]-lo)))
    vals=r[:,ri,rj]*days
    points.append(dict(id=key,zh=zh,en=en,kind=kind,requested=dict(lat=la,lon=(lo+180)%360-180),rainGrid=dict(lat=float(rain['lat'][ri]),lon=float((rain['lon'][rj]+180)%360-180)),temperatureGrid=dict(lat=round(float(air['lat'][ti]),5),lon=float((air['lon'][tj]+180)%360-180)),monthlyRain=[round(float(v),1) for v in vals],annualRain=round(float(vals.sum())),monthlyTemperature=[round(float(v),1) for v in t[:,ti,tj]],annualTemperature=round(float(np.average(t[:,ti,tj],weights=days)),1)))
meta=dict(period='1991–2020',monthDays=days.tolist(),precipitationSource=dict(name='GPCP V2.3 satellite-gauge combined precipitation; data provided by NOAA PSL, Boulder, Colorado, USA',url='https://psl.noaa.gov/thredds/fileServer/Datasets/gpcp/precip.mon.ltm.1991-2020.nc',sha256=hashlib.sha256(p.read_bytes()).hexdigest(),shape=[12,72,144],inputUnits='mm/day',outputUnits='mm/month; mm/year',method='Rate multiplied by mean month length across1991–2020; annual sum before rounding. All valid-year counts30; original2.5° cells, no interpolation.'),temperatureSource=dict(name='NCEP/NCAR Reanalysis1, NOAA PSL',url='https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.derived/surface_gauss/air.2m.mon.ltm.1991-2020.nc',sha256=hashlib.sha256(a.read_bytes()).hexdigest(),shape=[12,94,192],units='°C at2 m above model surface',method='Kelvin−273.15; day-weighted annual mean. Separate nearest Gaussian cells; not the same cells as precipitation.'),points=points)
(ROOT/'geograph/content/climate-process-data.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
lat=np.asarray(rain['lat'][:]);lon=np.asarray(rain['lon'][:]);order=np.argsort((lon+180)%360-180);lon=(lon[order]+180)%360-180;annual=annual[:,order]
colors=['#cfb88b','#e8d7b2','#d6e0d0','#9bbcbc','#547f90'];cuts=[250,500,1000,2000]
out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450"><title>1991–2020 GPCP V2.3 estimated mean annual precipitation, mm/year liquid-water equivalent; original2.5-degree grid. Not an aridity or desert classification map.</title>']
for i in range(72):
    for j in range(144):
        color=colors[int(np.searchsorted(cuts,annual[i,j],side='right'))]
        out.append(f'<rect x="{(lon[j]+180-1.25)*2.5:.3f}" y="{(90-lat[i]-1.25)*2.5:.3f}" width="6.26" height="6.26" fill="{color}"/>')
out.append('</svg>');(ROOT/'public/geography/maps/precipitation-1991-2020.svg').write_text(''.join(out))
print(json.dumps(points,ensure_ascii=False,indent=2))
