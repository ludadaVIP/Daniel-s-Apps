"""Derive the main-island overview from Natural Earth v5.1.2 country polygons.
Usage: python prepare-nz-overview.py /path/ne_10m_admin_0_countries.geojson
The local equirectangular teaching approximation uses cos(41°) ≈ 0.755.
It excludes offshore geometry outside 165–180°E and 33–48°S, not a claim about territory.
"""
import json
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[2]
source = json.loads(Path(sys.argv[1]).read_text())
paths = []
for feature in source['features']:
    if feature['properties']['ADM0_A3'] != 'NZL':
        continue
    geometry = feature['geometry']
    polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    for polygon in polygons:
        if not all(165 < lon < 180 and -48 < lat < -33 for lon, lat, *_ in polygon[0]):
            continue
        for ring in polygon:
            paths.append('M' + 'L'.join(f'{(lon - 164) * 45 * .755:.2f},{(-lat - 33) * 45:.2f}' for lon, lat, *_ in ring) + 'Z')
result = dict(coast=''.join(paths), referenceLatitude=-41,
              source='Natural Earth v5.1.2 ne_10m_admin_0_countries',
              projection='Local equirectangular approximation: x=(lon−164)×45×0.755; y=(−lat−33)×45; major islands only')
(root / 'geograph/content/nz-overview-data.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
