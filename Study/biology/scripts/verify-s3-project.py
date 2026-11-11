from playwright.sync_api import sync_playwright
import json,pathlib,sys,re,traceback
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s3\project');OUT.mkdir(parents=True,exist_ok=True)
if '--export-counts' in sys.argv:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True);context=browser.new_context(accept_downloads=True);tab=context.new_page();problems=[];reports=[]
  tab.on('pageerror',lambda e:problems.append(str(e)))
  try:
   tab.goto('http://127.0.0.1:3460/biology/project/S03');tab.wait_for_load_state('networkidle');tab.get_by_role('button',name='EN',exact=True).click()
   def export_count(label,expected):
    with tab.expect_download() as event:tab.get_by_role('button',name='Download full bilingual report',exact=True).click()
    target=OUT/('report-'+label+'.txt');event.value.save_as(str(target));text=target.read_text(encoding='utf-8');line=next(x for x in text.splitlines() if 'Understanding check:' in x);assert all(part in line for part in expected.split("; ")),(expected,line);reports.append({'state':label,'line':line,'file':str(target),'pass':True})
   export_count('unanswered','0/5 answered; 0/5 correct')
   tab.get_by_role('button',name='Understanding check',exact=True).click()
   for n,answer in [(0,0),(1,2)]:
    tab.locator('.bio-stage-check .bio-eco-tabs button').nth(n).click();tab.locator('.bio-options button').nth(answer).click();tab.get_by_role('button',name='View explanation →',exact=True).click()
   tab.get_by_role('button',name='Investigation and report',exact=True).click();export_count('partial','2/5 answered; 1/5 correct')
   tab.get_by_role('button',name='Understanding check',exact=True).click()
   for n,answer in enumerate([1,2,0,1,2]):
    tab.locator('.bio-stage-check .bio-eco-tabs button').nth(n).click()
    if tab.get_by_role('button',name='Think again',exact=True).count():tab.get_by_role('button',name='Think again',exact=True).click()
    tab.locator('.bio-options button').nth(answer).click();tab.get_by_role('button',name='View explanation →',exact=True).click()
   tab.reload();tab.wait_for_load_state('networkidle');export_count('all-correct','5/5 answered; 5/5 correct')
  except Exception as exc:problems.append(str(exc))
  finally:context.close();browser.close()
  data={'checks':reports,'passed':len(reports),'total':3,'errors':problems,'browser_context_closed':True,'server_started_or_stopped':False};(OUT/'export-counts-summary.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(data,ensure_ascii=False,indent=2));sys.exit(1 if problems or len(reports) != 3 or any(not item['pass'] for item in reports) else 0)
results=[];errors=[];shots=[]
def check(name,condition,detail=None):
 results.append({'name':name,'pass':bool(condition),'detail':detail});assert condition,name
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);c=b.new_context(viewport={'width':1366,'height':950},accept_downloads=True);page=c.new_page()
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 def go(s):
  page.goto('http://127.0.0.1:3460/biology/'+s);page.wait_for_load_state('networkidle')
 def state():return page.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))')
 def en():page.get_by_role('button',name='EN',exact=True).click()
 def shot(name):
  f=OUT/(name+'.png');page.screenshot(path=str(f),full_page=True);shots.append(str(f))
 try:
  go('project/S03');en()
  fixture={'version':1,'sessions':{'L001':{'step':3,'note':'old S01 lesson sentinel','completedAt':1},'L025':{'step':3,'note':'old S02 lesson sentinel','completedAt':1}},'answers':{},'mission':{'object':'old default object','evidence':'old default evidence','reasoning':'old default reasoning','savedAt':1},'missions':{'U12':{'object':'old U12 paired key','evidence':'old U12 six image evidence','reasoning':'old U12 scope reasoning','savedAt':1}},'projects':{'S01':{'records':[{'name':'old record '+str(i),'evidence':'old evidence','habitat':'old habitat','question':'old question','source':'virtual'} for i in range(5)],'zh':'旧阶段一摘要','en':'Old stage one abstract','answers':{},'savedAt':1},'S02':{'routes':{k:{'tag':v,'note':'old '+k+' route sentinel'} for k,v in [('water','matter'),('carbon','matter'),('light','energy'),('sugar','both')]},'zh':'旧阶段二摘要','en':'Old stage two abstract','answers':{},'savedAt':1}}}
  page.evaluate('(x)=>localStorage.setItem("study-biology-v1",JSON.stringify(x))',fixture);page.reload();page.wait_for_load_state('networkidle')
  baseline=state();old_counts={}
  for stage in ['S01','S02']:
   go('project/'+stage);old_counts[stage]=page.locator('.bio-project-status').inner_text()
  go('project/S03');en()
  check('initial six random records',page.locator('tbody tr').count()==6)
  check('36 quadrat controls',page.locator('.bio-eco-grid button').count()==36)
  page.get_by_role('button',name='Draw 12 cells',exact=True).click();check('12 random records unique',page.locator('tbody tr').count()==12 and len(set(state()['projects']['S03']['sampleIds']))==12)
  page.get_by_role('button',name='Draw 6 cells',exact=True).click();check('return six random records',page.locator('tbody tr').count()==6)
  original=state()['projects']['S03']['sampleIds'];page.get_by_role('button',name='Draw another random set',exact=True).click();check('another random set changes seed and positions',state()['projects']['S03']['seed']==43 and original!=state()['projects']['S03']['sampleIds'])
  page.get_by_role('button',name='Choose cells for comparison',exact=True).focus();page.keyboard.press('Enter');page.get_by_role('button',name='Clear chosen cells',exact=True).click()
  for i in range(6):
   q=page.locator('.bio-eco-grid button').nth(i);q.focus();page.keyboard.press('Space')
  check('keyboard selects six manual quadrats',len(state()['projects']['S03']['sampleIds'])==6)
  check('manual raw count density estimate',page.locator('tbody tr').count()==6 and '4 plants ÷ 6 m² sampled = 0.667 plants/m²' in page.locator('.bio-eco-records').inner_text())
  for i in range(6,12):page.locator('.bio-eco-grid button').nth(i).click()
  check('manual 12 cap',page.locator('tbody tr').count()==12)
  page.locator('.bio-eco-grid button').nth(12).click();check('13th manual selection refused',page.locator('tbody tr').count()==12)
  for i in range(6,12):page.locator('.bio-eco-grid button').nth(i).click()
  estimate=page.locator('.bio-eco-records input');estimate.fill('999');page.get_by_role('button',name='Check calculation',exact=True).click();check('wrong arithmetic gets denominator feedback','Check the denominator' in page.locator('main').inner_text())
  estimate.fill('24');page.get_by_role('button',name='Check calculation',exact=True).click();check('correct calculation accepted','The calculation matches' in page.locator('main').inner_text())
  writing=['The roadside set is biased low; a random draw better represents all 36 cells. This chosen set is not an independent roadside comparison.','Q01-Q06 have 4 plants in 6 m²: density 0.667 plants/m² and estimated total 24 plants.','Roadside Q01-Q06 also gives 4/6 × 36 = 24 plants; teaching census is 96, so this set underestimates by 72.','Position and abundance co-vary; shade could be a mechanism but the counts alone do not prove it.','Measure light intensity and soil moisture at all 36 positions, and repeat independent random samples on another visit.','问题是怎样估计36平方米草地。路边6格有4株，估计24株；普查96株，局限是选择偏差，不能据此证明光照因果。','Six 1 m² roadside quadrats contain four plants, estimating 24 across 36 m². Selection bias and sampling variation limit inference. <script>window.__reportExecuted=true</script>']
  for i,v in enumerate(writing):page.locator('.bio-eco-writing textarea').nth(i).fill(v)
  page.get_by_role('button',name='Save research project',exact=True).click();check('full project saved',bool(state()['projects']['S03'].get('savedAt')))
  page.reload();page.wait_for_load_state('networkidle');check('all seven project fields recover',page.locator('.bio-eco-writing textarea').all_text_contents()==writing and bool(state()['projects']['S03'].get('savedAt')))
  page.locator('.bio-eco-writing textarea').nth(0).fill(writing[0]+' Revised.');writing[0]+=' Revised.';check('editing invalidates saved flag',not state()['projects']['S03'].get('savedAt'))
  page.get_by_role('button',name='Save research project',exact=True).click();check('resave restores saved flag',bool(state()['projects']['S03'].get('savedAt')))
  page.get_by_role('button',name='Reveal teaching census for checking',exact=True).click();check('teaching census96 exposed','The census is 96 plants' in page.locator('main').inner_text())
  shot('project-desktop-report')
  for selector,name in [('.bio-eco-workbench','project-desktop-workbench'),('.bio-eco-writing','project-desktop-writing')]:
   path=OUT/(name+'.png');page.locator(selector).screenshot(path=str(path));shots.append(str(path))
  with page.expect_download() as info:page.get_by_role('button',name='Download full bilingual report',exact=True).click()
  download=info.value;download.save_as(str(OUT/download.suggested_filename));report=(OUT/download.suggested_filename).read_text(encoding='utf-8')
  check('UTF8 full inert text export',download.suggested_filename.endswith('.txt') and all(v in report for v in writing) and all(f'Q{i:02}' in report for i in range(1,7)) and page.evaluate('window.__reportExecuted === undefined'),{'filename':download.suggested_filename,'bytes':len(report.encode('utf-8'))})
  page.get_by_role('button',name='Understanding check',exact=True).click()
  correct=[1,2,0,1,2]
  for n,answer in enumerate(correct):
   page.locator('.bio-stage-check .bio-eco-tabs button').nth(n).click();page.locator('.bio-options button').nth((answer+1)%3).click();page.get_by_role('button',name='View explanation →',exact=True).click()
   check('stage question '+str(n+1)+' wrong feedback','There is a clue to revisit.' in page.locator('.bio-stage-check').inner_text())
   page.get_by_role('button',name='Think again',exact=True).click();page.locator('.bio-options button').nth(answer).click();page.get_by_role('button',name='View explanation →',exact=True).click();check('stage question '+str(n+1)+' corrected','You identified the evidence.' in page.locator('.bio-stage-check').inner_text())
  page.reload();page.wait_for_load_state('networkidle');status=page.locator('.bio-eco-stage-status').inner_text();check('5/5 recover while incomplete stage stays in progress','S03 exploration in progress' in status and '0/24 lessons; 0/6 missions; project saved; 5/5 questions answered, 5/5 correct' in status,status)
  for stage in ['S01','S02']:
   go('project/'+stage);check(stage+' counts unchanged',page.locator('.bio-project-status').inner_text()==old_counts[stage])
  saved=state();check('older drafts missions sessions preserved',all(saved['projects'][s]==baseline['projects'][s] for s in ['S01','S02']) and saved['mission']==baseline['mission'] and saved['missions']['U12']==baseline['missions']['U12'] and saved['sessions']==baseline['sessions'])
  units={
   'U13':('A microbial role evidence exhibit','Sugar available',['Known yeast is helpful in dough while unknown spots need evidence.','With live yeast and sugar the model produces CO₂; without sugar new products are suppressed.','The comparison isolates sugar under fixed conditions; role is context-dependent and does not establish unknown-sample safety.']),
   'U14':('Life routes of two plants and one animal','Representative butterfly',['Pea seeds follow gamete fusion; strawberry runner offspring do not.','Pea ovules become seeds; runner nodes form daughter plants; butterfly has larva, pupa and adult stages.','Stage shape can change within one species; adult food alone does not establish larval habitat support.']),
   'U15':('Build and compare two information routes.','Motor neuron',['Receptor → sensory neuron → spinal interneuron → motor neuron → muscle.','Motor neuron was rejected in first position; receptor was accepted. Messenger A acts at A receptors, not B.','Route order and matching receptors explain response; arrival is insufficient, and model timing is not actual conduction speed.']),
   'U16':('Build evidence maps for two homeostatic loops.','Upward disturbance',['An upward deviation prompts an opposing response in a connected feedback loop.','At the displayed snapshots the connected model approaches reference 50; switched-off response does not oppose disturbance.','Compare deviation from 50 rather than whether both signal and response rise; units are arbitrary and not personal measurements.']),
   'U17':('Virtual quadrat study: estimate without pretending certainty.','Random positions',['Six 1 m² roadside cells contain four plants and estimate 24 across 36 m².','Roadside Q01-Q06 sum 4; census96 shows error-72. Seeds42 and43 provide independent location comparisons.','A roadside sample can be biased; measure moisture and light and repeat samples rather than infer rainfall causation.']),
   'U18':('An evidence file for a fictional species.','Exposed',['For fictional meadow glimmer plants, genes and environment can both affect a trait.','The L069 model compares one genotype in exposed versus sheltered conditions and AA/Aa/aa in one environment.','One locus is simplified; an expected ratio does not guarantee four offspring and does not predict complex human traits.'])}
  for unit,(title,control,values) in units.items():
   go('notebook?unit='+unit);check(unit+' specific prompt and live lab',title in page.locator('.bio-mission-form').inner_text() and page.get_by_role('button',name=control,exact=True).count()==1)
   fields=page.locator('.bio-mission-form textarea')
   for i,v in enumerate(values):fields.nth(i).fill(v)
   page.get_by_role('button',name='Save my evidence ✓',exact=True).click();page.reload();page.wait_for_load_state('networkidle');check(unit+' CER save reload',fields.all_text_contents()==values and bool(state()['missions'][unit].get('savedAt')))
   path=OUT/(unit+'-notebook-form.png');page.locator('.bio-mission-form').screenshot(path=str(path));shots.append(str(path))
  go('notebook?unit=U14');page.get_by_role('button',name='Strawberry runner',exact=True).click();page.locator('.bio-unit-switch a').filter(has_text='U13').click();page.wait_for_load_state('networkidle');check('client navigation resets incompatible selection',page.get_by_role('button',name='Sugar available',exact=True).get_attribute('aria-pressed')=='true')
  page.get_by_role('button',name='No available sugar',exact=True).focus();page.keyboard.press('Enter');check('unit model keyboard operation',page.get_by_role('button',name='No available sugar',exact=True).get_attribute('aria-pressed')=='true')
  page.get_by_role('button',name='中文',exact=True).click();page.get_by_role('button',name='EN',exact=True).click();check('same activity language switch preserves state',page.get_by_role('button',name='No available sugar',exact=True).get_attribute('aria-pressed')=='true')
  check('old U12 and default evidence intact after six missions',state()['mission']==baseline['mission'] and state()['missions']['U12']==baseline['missions']['U12'])
  shot('notebook-desktop-u13')
  go('project/S03');page.set_viewport_size({'width':390,'height':844});en()
  for mode,name in [('en','project-mobile-en'),('both','project-mobile-bilingual')]:
   if mode=='both':
    print('LANG',page.locator('header button').all_text_contents());page.get_by_role('button',name='双语',exact=True).click()
   check(name+' no horizontal overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})'))
   geometry=page.locator('main .bio-button, .bio-eco-controls button, .bio-eco-grid button').evaluate_all('(es)=>es.map(e=>({text:e.innerText,height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width,clipped:e.scrollWidth>e.clientWidth+1}))')
   check(name+' primary controls44 and labels unclipped',all(x['height']>=44 and not x['clipped'] for x in geometry),[x for x in geometry if x['height']<44 or x['clipped']])
   shot(name)
   for selector,part in [('.bio-eco-sampling','sampling'),('.bio-eco-records','records'),('.bio-eco-writing','writing')]:
    path=OUT/(name+'-'+part+'.png');page.locator(selector).screenshot(path=str(path));shots.append(str(path))
  check('no console or page errors',not errors,errors)
 except Exception as e:
  errors.append('TEST_FAILURE: '+str(e));traceback.print_exc();shot('failure')
 finally:
  summary={'checks':results,'passed':sum(x['pass'] for x in results),'total':len(results),'errors':errors,'screenshots':shots,'browser_context_closed':True,'server_started_or_stopped':False}
  try:
   (OUT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(summary,ensure_ascii=False,indent=2))
  finally:
   try:c.close()
   finally:b.close()
sys.exit(1 if errors or not results or any(not item['pass'] for item in results) else 0)
