from pathlib import Path
import json
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    for symbol in ['oklo', 'cbrs', 'aaoi', 'mp']:
        file = root / f'apps/my_holdings/data/reports/research/my-holdings-research-{symbol}-2026-10-26.html'
        assert file.is_file(), str(file)
        for label, width, height in [('desktop',1440,1000),('mobile',390,844)]:
            page = browser.new_page(viewport={'width':width,'height':height}, device_scale_factor=1)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.goto(file.as_uri(),wait_until='networkidle')
            check = page.evaluate('''() => {
              const ids = [...document.querySelectorAll('[id]')].map(e=>e.id);
              const anchors = [...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href').slice(1));
              return {title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
                svg:document.querySelectorAll('svg').length,bodyLength:document.body.innerText.length,
                duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),missingAnchors:anchors.filter(id=>!document.getElementById(id)),
                invalidLinks:[...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')).filter(h=>!h.startsWith('#')&&!/^https?:/.test(h)),
                replacementChars:document.body.innerText.includes('\uFFFD'),externalScripts:[...document.scripts].map(s=>s.src).filter(Boolean)};
            }''')
            assert check['scrollWidth']<=width+1, (symbol,label,'overflow',check)
            assert not check['duplicateIds'], (symbol,check)
            assert not check['missingAnchors'], (symbol,check)
            assert not check['invalidLinks'], (symbol,check)
            assert not check['replacementChars'], (symbol,check)
            assert not errors, (symbol,errors)
            assert check['bodyLength']>2500, (symbol,check)
            page.screenshot(path=str(out/f'{symbol}-{label}.png'))
            if symbol=='cbrs':
                page.locator('#model').scroll_into_view_if_needed()
                page.screenshot(path=str(out/f'{symbol}-model-{label}.png'))
            results.append({'symbol':symbol,'layout':label,**check,'errors':errors})
            page.close()
    browser.close()
(out/'report-verification.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False))
