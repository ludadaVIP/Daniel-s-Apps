"""Rebuild the offline GEO-019 catalogue from the exact USGS GeoJSON query.
Download the source URL retained in content/earthquake-data.json, then:
python prepare-earthquakes.py source.geojson --retrieved-on YYYY-MM-DD
No network request is made by this script or by the lesson at runtime.
"""
import argparse
from datetime import date
import hashlib
import json
import math
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('--retrieved-on', type=date.fromisoformat, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
output = root / 'content/earthquake-data.json'
previous = json.loads(output.read_text())
raw = args.source.read_bytes()
catalogue = json.loads(raw)
assert catalogue['type'] == 'FeatureCollection'
start, end = 1577836800000, 1609459200000
records = []
for event in catalogue['features']:
    props, geometry = event['properties'], event['geometry']
    assert props['type'] == 'earthquake' and geometry['type'] == 'Point'
    lon, lat, depth = geometry['coordinates']
    assert all(isinstance(v, (int, float)) and math.isfinite(v) for v in [lon, lat, depth, props['mag'], props['time']])
    assert -180 <= lon <= 180 and -90 <= lat <= 90 and props['mag'] >= 6
    assert start <= props['time'] <= end
    if props['time'] == end:  # USGS API includes its end boundary; classroom year excludes it.
        continue
    records.append(dict(id=event['id'], time=props['time'], magnitude=props['mag'],
                        magnitudeType=props['magType'], lon=lon, lat=lat, depthKm=depth))
assert records and len({p['id'] for p in records}) == len(records)
records.sort(key=lambda p: p['time'])
result = dict(source=previous['source'], sourcePage=previous['sourcePage'],
              sha256=hashlib.sha256(raw).hexdigest(), retrievedOn=args.retrieved_on.isoformat(),
              period='2020-01-01 ≤ origin time < 2021-01-01 (UTC)', minimumMagnitude=6,
              selection='USGS preferred origin/magnitude; no contributor or depth filter; earthquake events only',
              count=len(records), events=records)
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(f'{len(records)} verified earthquake records; SHA256 {result["sha256"]}')
