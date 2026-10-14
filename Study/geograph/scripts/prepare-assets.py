"""Build local teaching base maps from Natural Earth v5.1.2 GeoJSON.
Usage: python3 geograph/scripts/prepare-assets.py /path/to/land.json /path/to/countries.json
Source URLs and reuse details are in metadata/asset-manifest.json.
"""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[2]
def polygons(geometry):
 return geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
def path_from(features,project):
 out=[]
 for f in features:
  for polygon in polygons(f['geometry']):
   for ring in polygon:
    out.append('M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in (project(*p[:2]) for p in ring))+'Z')
 return ''.join(out)
land=json.loads(Path(sys.argv[1]).read_text());countries=json.loads(Path(sys.argv[2]).read_text())
world=path_from(land['features'],lambda lon,lat:((lon+180)*2.5,(90-lat)*2.5))
nz=path_from([f for f in countries['features'] if f['properties']['ADM0_A3']=='NZL'],lambda lon,lat:((lon-165)*42,(-39-lat)*58))
(root/'geograph/content/map-data.json').write_text(json.dumps(dict(world=world,nz=nz))+'\n')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450"><title>World land and ocean base map / 世界陆海底图</title><rect width="900" height="450" fill="#dbe9ec"/><path d="{world}" fill="#ced5b4" stroke="#6a8177" stroke-width=".6"/><path d="M0 225H900" stroke="#889fa0" stroke-dasharray="4 6"/></svg>'
(root/'public/geography/maps/world-land.svg').write_text(svg+'\n')
