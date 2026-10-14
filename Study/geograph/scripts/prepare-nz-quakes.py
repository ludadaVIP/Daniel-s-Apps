"""Prepare a bounded 2020 GeoNet historical teaching sample from local GeoJSON.
Usage: python prepare-nz-quakes.py input.geojson --retrieved-on YYYY-MM-DD
No live call; SHA256 identifies exact source bytes. Query is documented below.
"""
from pathlib import Path
import argparse,json,hashlib,math
from datetime import datetime,timezone
parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);parser.add_argument('--retrieved-on',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[2];raw=args.source.read_bytes();source=json.loads(raw);records=[]
start=datetime(2020,1,1,tzinfo=timezone.utc);end=datetime(2021,1,1,tzinfo=timezone.utc)
for f in source['features']:
 p=f['properties']; lon,lat=f['geometry']['coordinates'];date=datetime.fromisoformat(p['origintime'].replace('Z','+00:00'))
 if p['eventtype']!='earthquake' or not start<=date<end:continue
 mag=p['magnitude'];depth=p['depth']
 assert all(isinstance(n,(int,float)) and math.isfinite(n) for n in [lon,lat,mag,depth])
 assert 164<=lon<=180 and -48<=lat<=-33 and mag>=4 and -10<=depth<=800
 records.append(dict(id=p['publicid'],time=p['origintime'],lon=lon,lat=lat,magnitude=mag,magnitudeType=p['magnitudetype'],depthKm=depth,status=p.get('evaluationstatus','unspecified')))
records.sort(key=lambda x:x['time']);assert len({x['id'] for x in records})==len(records) and len(records)<20000
meta=dict(source='GeoNet Aotearoa New Zealand Earthquake Catalogue',doi='https://doi.org/10.21420/0S8P-TZ38',sourceUrl='https://quakesearch.geonet.org.nz/geojson?limit=20000&bbox=164,-48,180,-33&minmag=4&startdate=2020-01-01T00:00:00&enddate=2021-01-01T00:00:00',period='2020 UTC',selection='Earthquakes; 2020-01-01 inclusive to 2021-01-01 exclusive; catalogue magnitude≥4; 164–180°E, 33–48°S. Not a completeness or hazard assessment.',retrievedOn=args.retrieved_on,sha256=hashlib.sha256(raw).hexdigest(),license='CC BY 3.0 NZ',licenseUrl='https://www.geonet.org.nz/policy',acknowledgement='We acknowledge the New Zealand GeoNet programme and its sponsors NHC, Earth Sciences NZ, LINZ, NEMA and MBIE for providing data used in this study.',count=len(records),records=records)
(root/'geograph/content/nz-earthquake-data.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print('GeoNet',len(records),'unique records',meta['sha256'])
