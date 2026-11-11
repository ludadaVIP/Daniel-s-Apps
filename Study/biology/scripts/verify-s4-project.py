"""Isolated actual-Chromium S04 project/notebook/export regression evidence.

Requires the already-owned Vite server at 127.0.0.1:3460. Does not manage it.
"""
from playwright.sync_api import sync_playwright
import json, pathlib, sys, traceback, urllib.parse, xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')
OUT = pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s4\project')
OUT.mkdir(parents=True, exist_ok=True)
checks, errors, screenshots, exports, geometry_reports = [], [], [], [], []
EXPECTED_TOPICS = ['plant', 'enzyme', 'ecology']

def check(name, passed, detail=None):
    checks.append({'name': name, 'pass': bool(passed), 'detail': detail})
    print(('PASS ' if passed else 'FAIL ')+name,flush=True)
    assert passed, name + ': ' + str(detail)

if '--responsive-only' in sys.argv:
    # A narrowly scoped CSS follow-up preserves the full behavioral summary.
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(viewport={'width':1366,'height':844})
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        try:
            page.goto('http://127.0.0.1:3460/biology/project/S04');page.wait_for_load_state('networkidle')
            for width in [1366,390]:
                page.set_viewport_size({'width':width,'height':844})
                for lang,label in [('EN','en'),('双语','bilingual')]:
                    page.get_by_role('button',name=lang,exact=True).click()
                    for name,title,condition,count in [('plant','Plant growth','Model light index 60',2),('enzyme','Enzyme activity','Cooled enzyme assay 40°C',4),('ecology','Ecological change','Flood',9)]:
                        page.get_by_role('button',name=title,exact=False).click()
                        # English controls have bilingual accessible names in dual mode.
                        page.get_by_role('button',name=condition,exact=False).click()
                        prefix=f'{width}-{label}-{name}'
                        ids=page.locator('.bio-story-controls tbody th').evaluate_all('''es=>es.map(e=>{
                          const node=e.firstChild, text=e.textContent, segments=[];
                          for(const m of text.matchAll(/[^-]+/g)){
                            const r=document.createRange();r.setStart(node,m.index);r.setEnd(node,m.index+m[0].length);
                            const lines=[...new Set([...r.getClientRects()].map(b=>Math.round(b.y)))];
                            segments.push({word:m[0],lines:lines.length});
                          }
                          const s=getComputedStyle(e);return {id:text,width:e.getBoundingClientRect().width,overflowWrap:s.overflowWrap,wordBreak:s.wordBreak,segments};
                        })''')
                        check(prefix+' all source records render',len(ids)==count,ids)
                        check(prefix+' IDs wrap only between hyphen segments',all(x['overflowWrap']=='normal' and x['wordBreak']=='normal' and all(s['lines']==1 for s in x['segments']) for x in ids),ids)
                        check(prefix+' no page horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                        geo=page.locator('.bio-story-topics button').evaluate_all('(es)=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))')
                        check(prefix+' topic buttons remain44 square',len(geo)==3 and all(x['w']>=44 and x['h']>=44 for x in geo),geo)
                        dest=OUT/(prefix+'-data.png');page.locator('.bio-story-controls').screenshot(path=str(dest));screenshots.append(str(dest))
        except Exception as e:
            errors.append('TEST_FAILURE: '+str(e));traceback.print_exc()
        finally:
            try:context.close()
            finally:browser.close()
            result={'checks':checks,'passed':sum(c['pass'] for c in checks),'total':len(checks),'expected':48,'errors':errors,'screenshots':screenshots,'browser_context_closed':True,'server_started_or_stopped':False,'scope':'Focused ID-column and topic-control CSS follow-up; full behavior retained in summary.json.'}
            (OUT/'responsive-summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
            print(json.dumps(result,ensure_ascii=False,indent=2))
    sys.exit(1 if errors or len(checks)!=48 or any(not c['pass'] for c in checks) else 0)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1366, 'height': 950}, accept_downloads=True)
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)

    def go(path):
        page.goto('http://127.0.0.1:3460/biology/' + path)
        page.wait_for_load_state('networkidle')

    def state():
        return page.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))')

    def shot(name, locator=None):
        target = OUT / (name + '.png')
        (locator or page).screenshot(path=str(target), **({} if locator else {'full_page': True}))
        screenshots.append(str(target))

    def topic(name):
        page.get_by_role('button', name={'plant': 'Plant growth', 'enzyme': 'Enzyme activity', 'ecology': 'Ecological change'}[name], exact=False).click()

    def values(locator):
        return locator.evaluate_all('(es)=>es.map(e=>e.value)')

    def bbox(svg_page):
        return svg_page.locator('svg').first.evaluate('''root => [...root.querySelectorAll('text')].map(e=>{
          const b=e.getBBox(), s=e.ownerSVGElement, v=s.viewBox.baseVal;
          return {text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height,
            view:[v.x,v.y,v.width,v.height],bad:b.x<v.x-.5||b.y<v.y-.5||b.x+b.width>v.x+v.width+.5||b.y+b.height>v.y+v.height+.5};
        }).filter(e=>e.bad)''')

    try:
        go('project/S04')
        page.get_by_role('button', name='EN', exact=True).click()
        # Import only empty draft factories to make valid old-stage sentinels; all S04 work below uses UI.
        page.evaluate('''async()=>{
          const [progress,s1,s2,s3]=await Promise.all([import('/src/progress.ts'),import('/src/project.ts'),import('/src/leafProject.ts'),import('/src/ecoProject.ts')]);
          const x=progress.emptyProgress();x.sessions.L001={step:3,note:'old S01 lesson sentinel',completedAt:1};
          x.sessions.L025={step:3,note:'old S02 lesson sentinel',completedAt:1};
          x.mission={object:'old default object',evidence:'old default evidence',reasoning:'old default reasoning',savedAt:1};
          x.missions.U18={object:'old U18 claim',evidence:'old U18 numeric evidence',reasoning:'old U18 reasoning',savedAt:1};
          x.projects.S01={...s1.emptyProject(),zh:'旧S01部分草稿'};
          x.projects.S02={...s2.emptyLeafProject(),zh:'旧S02部分草稿'};
          x.projects.S03={...s3.emptyEcoProject(),claim:'Old S03 partial draft sentinel'};
          localStorage.setItem('study-biology-v1',JSON.stringify(x));
        }''')
        page.reload(); page.wait_for_load_state('networkidle')
        baseline = state()
        check('incomplete project cannot save', page.get_by_role('button', name='Save this storyboard', exact=True).is_disabled())
        page.locator('.bio-story-card textarea').nth(0).fill('尚未完成的植物说明：只写一格，旧阶段仍须保留。')
        page.reload(); page.wait_for_load_state('networkidle')
        check('partial storyboard reload retains partial writing and old S01 S02 S03', values(page.locator('.bio-story-card textarea'))[0].startswith('尚未完成') and all(state()['projects'][s]==baseline['projects'][s] for s in ['S01','S02','S03']))

        expected = {}
        for name, rows, condition, needle in [('plant',2,'Model light index 60','100'),('enzyme',4,'Cooled enzyme assay 40°C','80.0'),('ecology',9,'Flood','%')]:
            topic(name)
            check(name+' numeric records rendered', page.locator('.bio-story-controls tbody tr').count()==rows)
            before = page.locator('.bio-story-controls').inner_text()
            page.get_by_role('button',name=condition,exact=True).focus(); page.keyboard.press('Enter')
            after = page.locator('.bio-story-controls').inner_text()
            check(name+' condition updates real model', before != after and needle in after, {'before':before,'after':after})
            for i in range(4):
                if i:
                    page.get_by_role('button', name='Next frame', exact=True).click()
                check(name+' guided frame '+str(i+1), str(i+1)+' / 4' in page.locator('.bio-playback').inner_text())
            page.get_by_role('button', name='Previous frame', exact=True).click()
            check(name+' previous frame', '3 / 4' in page.locator('.bio-playback').inner_text())
            page.get_by_role('button', name='Start again', exact=True).click()
            check(name+' restart frame', '1 / 4' in page.locator('.bio-playback').inner_text())
            check(name+' four illustrated frame images',page.locator('.bio-story-card img').count()==4)
            for i,src in enumerate(page.locator('.bio-story-card img').evaluate_all('(es)=>es.map(e=>e.src)')):
                xml=urllib.parse.unquote(src.split(',',1)[1]);(OUT/f'{name}-frame-{i+1}.svg').write_text(xml,encoding='utf-8')
                ET.fromstring(xml)
                visual=context.new_page()
                try:
                    visual.goto((OUT/f'{name}-frame-{i+1}.svg').as_uri());visual.wait_for_load_state('load')
                    bad=bbox(visual);geometry_reports.append({'source':f'{name}-frame-{i+1}','overflow':bad})
                    check(name+' source frame '+str(i+1)+' text fits viewBox',not bad,bad)
                    shot(f'{name}-frame-{i+1}',visual.locator('svg').first)
                finally:visual.close()
            selects=page.locator('.bio-story-citations select')
            selects.nth(0).select_option(index=1);selects.nth(1).select_option(index=2)
            captions=[]
            for i in range(4):
                zh=f'{name}第{i+1}格：原创虚构证据必须区分观测、机制假设与条件。独立重复与对照使解释可检验。'
                en=f'{name} frame {i+1}: fictional evidence supports a conditional mechanism, with independent replicates, controls and uncertainty.'
                captions += [zh,en]
            # A longer bilingual caption and literal markup exercise wrapping and XML inertness.
            captions[0]+=' '+('用数值和单位解释变化，不能把相关直接当作因果。'*12)
            captions[1]+=' '+('Long scientific caption retains every condition and limit. '*12)+' <script>window.__storyExecuted=true</script> & "quoted"'
            for i,v in enumerate(captions):page.locator('.bio-story-card textarea').nth(i).fill(v)
            writes=[
                name+' original fictional records: plant cohort means 0.20→0.30/0.46 g at day0/7; enzyme 16.8→80.0 and heated6.4 relative units; ecology day1/30 A70→90. Only applicable records support this topic.',
                '模型假设：其他条件相同；数值是原创虚构教学资料，不是真实新西兰测量。未测呼吸、完整蛋白结构或单种贡献。',
                '因为本题材的微观机制改变条件下的过程，所以可能出现所列现象；仅凭曲线不能证明全部因果。',
                '主动改变本题材对应变量：光指数、预处理温度或短暂土壤水分脉冲；每次只改变一项。',
                '记录匹配独立样本第0/7天干质量g，或同温测产物初速相对单位，或第0/1/30天落叶分解指数。',
                '固定初始样本、温度、时间与资源；设未改变条件的对照，并随机分配独立重复。',
                '若处理组未出现预期差异或恢复到对照水平，将挑战限制因素、不可逆损伤或耐湿性补偿的解释。最后检验字段必须完整保留。',
                '证据支持有条件的解释：先区分原始数值与模型设定，再用独立重复和可能反驳的结果检验。',
                'The evidence suggests a conditional explanation because the controlled comparison differs; however these fictional outputs do not prove a universal mechanism. LAST ENGLISH SUMMARY SENTINEL.',
            ]
            for i,v in enumerate(writes):page.locator('.bio-story-writing textarea').nth(i).fill(v)
            page.locator('.bio-story-writing input').fill('4')
            selects=page.locator('.bio-story-citations select')
            selects.nth(1).select_option(index=1)
            check(name+' duplicate citation cannot save',page.get_by_role('button',name='Save this storyboard',exact=True).is_disabled())
            selects.nth(1).select_option(index=2)
            # No English gate: all four EN captions and English summary may be blank.
            for i in range(4):page.locator('.bio-story-card textarea').nth(i*2+1).fill('')
            page.locator('.bio-story-writing textarea').nth(8).fill('')
            check(name+' Chinese-only structured project can save',page.get_by_role('button',name='Save this storyboard',exact=True).is_enabled())
            page.get_by_role('button',name='Save this storyboard',exact=True).click()
            only=state()['projects']['S04']['cases'][name]
            check(name+' Chinese-only save accepted without English grade',bool(only.get('savedAt')) and only['en']=='' and all(f['en']=='' for f in only['frames']))
            for i in range(4):page.locator('.bio-story-card textarea').nth(i*2+1).fill(captions[i*2+1])
            page.locator('.bio-story-writing textarea').nth(8).fill(writes[8])
            page.get_by_role('button',name='Save this storyboard',exact=True).click()
            expected[name]={'captions':captions,'writing':writes,'input':state()['projects']['S04']['cases'][name]['input']}
            check(name+' saves with all fields',bool(state()['projects']['S04']['cases'][name].get('savedAt')))
            page.reload();page.wait_for_load_state('networkidle')
            check(name+' UI and saved flag recover',values(page.locator('.bio-story-card textarea'))==captions and values(page.locator('.bio-story-writing textarea'))==writes and bool(state()['projects']['S04']['cases'][name].get('savedAt')))
            check(name+' condition and two numeric citations recover',state()['projects']['S04']['cases'][name]['input']==expected[name]['input'] and len(set(state()['projects']['S04']['cases'][name]['citations']))==2)
            shot(name+'-desktop-data',page.locator('.bio-story-controls'));shot(name+'-desktop-frames',page.locator('.bio-story-grid'));shot(name+'-desktop-writing',page.locator('.bio-story-writing'))
            with page.expect_download() as event:page.get_by_role('link',name='Download full storyboard SVG',exact=True).click()
            dest=OUT/event.value.suggested_filename;event.value.save_as(str(dest));xml=dest.read_text(encoding='utf-8');root=ET.fromstring(xml)
            textcontent=''.join(root.itertext())
            check(name+' actual SVG download valid and all prose retained',all(v.replace('\n','') in textcontent for v in captions+writes),{'file':str(dest),'bytes':dest.stat().st_size})
            check(name+' SVG inert with all four embedded illustrations',len(root.findall('.//{http://www.w3.org/2000/svg}svg'))==4 and not root.findall('.//{http://www.w3.org/2000/svg}script') and 'foreignObject' not in xml and '&lt;script&gt;' in xml)
            ids=page.locator('.bio-story-controls tbody th').all_text_contents()
            check(name+' export includes all source record IDs',all(i in textcontent for i in ids),ids)
            scientific={'plant':['12 plants','0.10 g','0.26 g','P20-D0','P60-D7','not paired'],
                        'enzyme':['16.8 relative initial-rate units','6.4 relative initial-rate units','75°C','pH7','not a universal'],
                        'ecology':['day 1 decomposition index 55','day 30 decomposition index 85','day 30 decomposition index 92','day 30 decomposition index 45','restored','65.7%','41.7%']}[name]
            check(name+' exported values units and scientific scope',all(s in textcontent for s in scientific),scientific)
            exported=context.new_page()
            try:
                exported.goto(dest.as_uri());exported.wait_for_load_state('load')
                bad=bbox(exported);geometry_reports.append({'source':dest.name,'overflow':bad})
                check(name+' actual downloaded SVG all text fits viewBoxes',not bad,bad)
                check(name+' literal markup does not execute',exported.evaluate('window.__storyExecuted === undefined'))
                exported.set_viewport_size({'width':900,'height':1000});shot(name+'-downloaded-full',exported.locator('svg').first)
                topshot=OUT/(name+'-downloaded-top-viewport.png');exported.screenshot(path=str(topshot));screenshots.append(str(topshot))
                # Full-size local SVG screenshots plus the end region permit visual review of final fields.
                exported.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)')
                endshot=OUT/(name+'-downloaded-end-viewport.png');exported.screenshot(path=str(endshot));screenshots.append(str(endshot))
            finally:exported.close()
            exports.append({'topic':name,'path':str(dest),'condition':expected[name]['input'],'records':ids})

        # Only the edited topic loses its save. Other cases continue to qualify.
        topic('plant');page.locator('.bio-story-writing textarea').nth(0).fill(expected['plant']['writing'][0]+' Revised.')
        s=state()['projects']['S04']['cases']
        check('editing invalidates only current topic',not s['plant'].get('savedAt') and bool(s['enzyme'].get('savedAt')) and bool(s['ecology'].get('savedAt')))
        topic('enzyme');check('switching retains other topic prose',values(page.locator('.bio-story-writing textarea'))==expected['enzyme']['writing'])
        topic('ecology');oldtext=values(page.locator('.bio-story-writing textarea'));page.get_by_role('button',name='Drought',exact=True).click()
        check('ecology condition clears stale citation IDs and save but retains prose',state()['projects']['S04']['cases']['ecology']['citations']==['',''] and values(page.locator('.bio-story-writing textarea'))==oldtext and not state()['projects']['S04']['cases']['ecology'].get('savedAt'))
        page.get_by_role('button',name='Flood',exact=True).click();page.locator('.bio-story-citations select').nth(0).select_option(index=1);page.locator('.bio-story-citations select').nth(1).select_option(index=2);page.get_by_role('button',name='Save this storyboard',exact=True).click()
        for i,correct in enumerate([0,1,2,0,1,2]):
            card=page.locator('.bio-story-check .bio-question').nth(i)
            card.locator('.bio-options button').nth((correct+1)%3).click();card.get_by_role('button',name='View explanation →',exact=True).click()
            check('question '+str(i+1)+' wrong feedback','There is a clue to revisit.' in card.inner_text())
            card.get_by_role('button',name='Think again',exact=True).click();card.locator('.bio-options button').nth(correct).click();card.get_by_role('button',name='View explanation →',exact=True).click()
            check('question '+str(i+1)+' corrected','You identified the evidence.' in card.inner_text())
        page.reload();page.wait_for_load_state('networkidle')
        check('six answers reload and incomplete stage remains in progress','6 / 6' in page.locator('.bio-story-check').inner_text() and 'Stage four: 0/24 lessons, 0/6 investigations' in page.locator('main > .bio-inquiry-result').inner_text())

        units={
          'U19':('Order, trace and explain daughter-cell information.','Yes','No'),
          'U20':('Test an explanation with curves, controls and recovery.','Heat then assay at 40°C','Fresh'),
          'U21':('A limiting-factor evidence file for a fictional leaf','CO₂','Light'),
          'U22':('Glowbean Punnett and repeated-sampling report','aa','Aa'),
          'U23':('An evidence file for selection across generations','A contributes1, B2','A contributes2, B1'),
          'U24':('Two accounts for one ecosystem','No combustion','Burn5 carbon units'),
        }
        for unit,(title,change,initial) in units.items():
            go('notebook?unit='+unit)
            check(unit+' meaningful unit-specific prompt and live model',title in page.locator('.bio-mission-form').inner_text() and len(page.locator('.bio-mission-form > div > p').first.inner_text())>200)
            before=page.locator('.bio-mission-diagram').inner_text()
            if unit=='U21':
                page.locator('.bio-mission-diagram input[type=range]').nth(1).fill('50')
            elif unit=='U22':
                page.locator('.bio-mission-diagram select').first.select_option('aa')
            else:
                page.get_by_role('button',name=change,exact=True).first.click()
            if unit in ['U19','U23','U24']:page.get_by_role('button',name='Next step',exact=True).click()
            after=page.locator('.bio-mission-diagram').inner_text()
            check(unit+' model controls change actual output',before!=after)
            cv=[unit+' conditional claim: compare stated conditions rather than universal conclusions.',unit+' numerical evidence from the live model and an independent controlled comparison; original fictional outputs.',unit+' mechanism links the result to the condition, with a measured limit and a possible challenging outcome.']
            for i,v in enumerate(cv):page.locator('.bio-mission-form textarea').nth(i).fill(v)
            page.get_by_role('button',name='Save my evidence ✓',exact=True).click();page.reload();page.wait_for_load_state('networkidle')
            check(unit+' CER saves and reloads',values(page.locator('.bio-mission-form textarea'))==cv and bool(state()['missions'][unit].get('savedAt')))
            shot(unit+'-notebook',page.locator('.bio-mission-form'))
        go('notebook?unit=U23');page.get_by_role('button',name='A contributes1, B2',exact=True).click()
        page.locator('.bio-unit-switch a').filter(has_text='U24').click();page.wait_for_load_state('networkidle')
        check('same family unit navigation resets local model',page.get_by_role('button',name='Burn5 carbon units',exact=True).get_attribute('aria-pressed')=='true')
        page.get_by_role('button',name='No combustion',exact=True).focus();page.keyboard.press('Enter')
        page.get_by_role('button',name='中文',exact=True).click();page.get_by_role('button',name='EN',exact=True).click()
        check('language switch preserves same activity state',page.get_by_role('button',name='No combustion',exact=True).get_attribute('aria-pressed')=='true')
        now=state();check('all old drafts missions and sessions intact',all(now['projects'][s]==baseline['projects'][s] for s in ['S01','S02','S03']) and now['mission']==baseline['mission'] and now['missions']['U18']==baseline['missions']['U18'] and now['sessions']==baseline['sessions'])

        go('project/S04')
        check('six own missions alone do not complete stage','Stage four: 0/24 lessons, 6/6 investigations' in page.locator('main > .bio-inquiry-result').inner_text())
        # Explicit isolated completion fixture exercises the rendered outcome boundary.
        page.evaluate('''()=>{const s=JSON.parse(localStorage.getItem('study-biology-v1'));for(let n=73;n<=96;n++)s.sessions['L'+String(n).padStart(3,'0')]={step:3,note:'isolated completion fixture',completedAt:1};localStorage.setItem('study-biology-v1',JSON.stringify(s));}''')
        page.reload();page.wait_for_load_state('networkidle')
        check('own24 own6 saved topic and six checks complete stage','Stage four explored: 24 lessons' in page.locator('main > .bio-inquiry-result').inner_text())
        page.evaluate('''()=>{const s=JSON.parse(localStorage.getItem('study-biology-v1'));delete s.sessions.L096.completedAt;localStorage.setItem('study-biology-v1',JSON.stringify(s));}''')
        page.reload();page.wait_for_load_state('networkidle')
        check('missing own lesson returns stage to in progress','Stage four: 23/24 lessons, 6/6 investigations' in page.locator('main > .bio-inquiry-result').inner_text())
        for width in [1366,390]:
            page.set_viewport_size({'width':width,'height':844})
            for lang,label in [('EN','en'),('双语','bilingual')]:
                page.get_by_role('button',name=lang,exact=True).click()
                for name in EXPECTED_TOPICS:
                    topic(name)
                    check(f'{width} {label} {name} no page horizontal overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})'))
                    geo=page.locator('main .bio-choice-row button, main .bio-playback button, main .bio-question-actions .bio-button').evaluate_all('(es)=>es.map(e=>({text:e.innerText,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,clipped:e.scrollWidth>e.clientWidth+1}))')
                    check(f'{width} {label} {name} primary controls at least44 square and unclipped',all(x['w']>=44 and x['h']>=44 and not x['clipped'] for x in geo),[x for x in geo if x['w']<44 or x['h']<44 or x['clipped']])
                    for sel,part in [('.bio-story-controls','data'),('.bio-story-grid','frames'),('.bio-story-writing','writing')]:shot(f'{width}-{label}-{name}-{part}',page.locator(sel))
        check('all three actual SVG exports complete',len(exports)==3 and [x['topic'] for x in exports]==EXPECTED_TOPICS)
        check('no browser console or page errors',not errors,errors)
    except Exception as exc:
        errors.append('TEST_FAILURE: '+str(exc));traceback.print_exc()
        try:shot('failure')
        except Exception:pass
    finally:
        try:context.close()
        finally:browser.close()
        data={'checks':checks,'passed':sum(x['pass'] for x in checks),'total':len(checks),'expected':143,'errors':errors,'exports':exports,'geometry':geometry_reports,'screenshots':screenshots,'browser_context_closed':True,'server_started_or_stopped':False,'scope':'Technical Chromium verification only; not child or external educational review.'}
        (OUT/'summary.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps(data,ensure_ascii=False,indent=2))
sys.exit(1 if errors or len(checks)!=143 or len(exports)!=3 or any(not x['pass'] for x in checks) else 0)
