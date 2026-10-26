import gzip
import hashlib
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
state_file = root / 'apps/my_holdings/data/state.json'
original = state_file.read_bytes()
state = json.loads(original)
backups = sorted((root / 'apps/my_holdings/data/backups').glob('*.json.gz'))
sample = backups[-1]
decoded = gzip.decompress(sample.read_bytes()).decode('utf-8')
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    for width in [1440,390]:
        page = browser.new_page(viewport={'width':width,'height':1000})
        errors=[]
        page.on('pageerror',lambda error: errors.append(str(error)))
        # Opening the app may submit a derived ranking snapshot. Test the UI
        # against a read-only state and never submit a real restore or edit.
        def api(route):
            request = route.request
            if request.method == 'GET':
                route.continue_()
            elif '/rank-snapshot' in request.url:
                route.fulfill(json={'state':state,'changed':False})
            else:
                route.abort()
        page.route('**/my-holdings/api/**',api)
        page.goto('http://127.0.0.1:5888/#/app/my-holdings',wait_until='networkidle')
        page.locator('button[title="账户与数据"]').click()
        settings=page.get_by_role('dialog')
        expect(settings).to_contain_text('普通修改每 5 分钟最多建立一个恢复点')
        settings.screenshot(path=str(out/f'settings-{width}.png'))
        settings.get_by_role('button',name='恢复备份',exact=True).click()
        dialog=page.get_by_role('dialog')
        expect(dialog).to_contain_text('JSON 或 gzip')
        dialog.locator('input[type="file"]').set_input_files(str(sample))
        expect(dialog.locator('textarea')).to_have_value(decoded)
        dialog.screenshot(path=str(out/f'restore-{width}.png'))
        dialog.locator('input[type="file"]').set_input_files({'name':'damaged.json.gz','mimeType':'application/gzip','buffer':b'\x1f\x8b\x08broken'})
        expect(dialog.locator('textarea')).to_have_value('')
        expect(page.get_by_text('无法读取备份，请检查 JSON / gzip 文件是否完整',exact=True)).to_be_visible()
        assert not errors,errors
        results.append({'width':width,'restoredTextBytes':len(decoded.encode('utf-8')),'gzipPicker':True,'damagedFileRejected':True,'errors':errors})
        page.close()
    browser.close()
after=state_file.read_bytes()
assert after==original,'UI verification must not mutate live data'
summary={'ui':results,'stateSha256':hashlib.sha256(after).hexdigest(),'stateRevision':state['revision'],'liveDataUnchanged':True}
(out/'ui-verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary))
