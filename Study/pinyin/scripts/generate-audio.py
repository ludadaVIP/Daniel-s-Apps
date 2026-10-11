"""macOS content-authoring tool; shipped WAV files play on every supported OS."""
import argparse
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--overwrite', action='store_true', help='Regenerate all audio.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'curriculum/lexicon/audio-manifest.json').read_text())
out = root / 'apps/web/src/audio'
out.mkdir(parents=True, exist_ok=True)
index_path = root / 'curriculum/lexicon/audio-generated.json'
index = json.loads(index_path.read_text()) if index_path.exists() else {}
generated = 0
with tempfile.TemporaryDirectory() as tmp:
    for item in manifest:
        fingerprint = hashlib.sha256(json.dumps({'voice':item['voice'], 'text':item['text'], 'rate':145}, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        target = out / f'{item["id"]}.wav'
        if not args.overwrite and target.exists() and index.get(item['id']) == fingerprint:
            continue
        source = Path(tmp) / f'{item["id"]}.aiff'
        subprocess.run(['say', '-v', item['voice'], '-r', '145', '-o', str(source), item['text']], check=True)
        subprocess.run(['afconvert', str(source), str(target), '-f', 'WAVE', '-d', 'LEI16'], check=True)
        index[item['id']] = fingerprint
        index_path.write_text(json.dumps(index, indent=2, sort_keys=True)+'\n')
        generated += 1
        if generated % 10 == 0: print(f'Generated {generated}: {item["id"]}', flush=True)
print(f'Audio ready: {len(manifest)} entries ({generated} regenerated).', flush=True)
