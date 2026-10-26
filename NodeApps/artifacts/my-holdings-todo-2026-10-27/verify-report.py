from pathlib import Path
import json
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
file=root/'apps/my_holdings/data/reports/research/my-holdings-research-clpt-2026-10-27.html'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,channel='msedge')
    for width,height in [(1440,1000),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(file.as_uri(),wait_until='networkidle')
        check=page.evaluate('''() => {
          const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
          const anchors=[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href').slice(1));
          return {title:document.title,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
          svgs:document.querySelectorAll('svg').length,characters:document.body.innerText.length,
          duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),badAnchors:anchors.filter(id=>!document.getElementById(id)),
          externalScripts:[...document.scripts].map(e=>e.src).filter(Boolean),replacementChars:document.body.innerText.includes('\uFFFD')};
        }''')
        assert check['scrollWidth']<=width+1,check
        assert check['svgs']==4,check
        assert check['characters']>5000,check
        assert not check['duplicateIds'] and not check['badAnchors'] and not check['externalScripts'] and not check['replacementChars'],check
        assert not errors,errors
        page.screenshot(path=str(out/f'clpt-{width}.png'))
        page.locator('#valuation').scroll_into_view_if_needed()
        page.screenshot(path=str(out/f'clpt-valuation-{width}.png'))
        results.append(check)
        page.close()
    browser.close()
(out/'report-verification.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False))
