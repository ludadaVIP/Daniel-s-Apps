"""Run against an independently started Vite server at 127.0.0.1:3460.

python biology/scripts/verify-s3-browser.py
    Fresh isolated context: 24 labs, 48 Explore phone layouts, six lesson flows.
python biology/scripts/verify-s3-browser.py final
    Extend verification.json with 96 Predict/Reflect phone layouts, final L049
    classification checks, and desktop/phone end-state screenshots.
An optional numeric lesson start resumes lab coverage from an existing report.
Both commands return nonzero for failures, browser errors, or layout defects.
"""
from playwright.sync_api import sync_playwright
import json,pathlib,sys,re,traceback
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s3')
BASE='http://127.0.0.1:3460';ROOT=pathlib.Path(__file__).resolve().parents[1]/'apps/web/src'
FINAL=len(sys.argv)>1 and sys.argv[1]=='final'
START=74 if FINAL else int(sys.argv[1]) if len(sys.argv)>1 else 49
R=json.loads((OUT/'verification.json').read_text(encoding='utf-8')) if START>49 else {'labs':[],'flows':[],'errors':[],'clips':[],'mobile':[]}
R.pop('failure',None);R.pop('traceback',None)
R['finalStatus' if FINAL else 'status']='running'
conditions={49:'Baking yeast',50:'No available sugar',51:'Shared-air route',52:'Stomach',53:'Strawberry runner',54:'Strawberry: runners',55:'Chicken',56:'No matching receptor',57:'Sound vibration',58:'Motor link off',60:'Messenger B',61:'Downward disturbance',62:'Too cold',63:'Relatively low',64:'More dilute',65:'6 immigrants',66:'Watered',67:'12 quadrats',68:'Open',69:'Aa',70:'Local version 2',71:'Spot count',72:'Parent 1 AA'}
def exit_status(report, final=False):
 failed=(report.get('status')!='passed' or 'failure' in report
         or bool(report.get('errors')) or bool(report.get('clips'))
         or len(report.get('labs',[]))!=24 or len(report.get('mobile',[]))!=48
         or len(report.get('flows',[]))!=6)
 failed=failed or any(item['width']['scroll']>item['width']['client']+1
                      or item.get('smallControls') for item in report.get('mobile',[]))
 if final:
  failed=failed or report.get('finalStatus')!='passed' or len(report.get('finalScreens',[]))!=96
 return int(bool(failed))
def record(): (OUT/'verification.json').write_text(json.dumps(R,ensure_ascii=False,indent=2),encoding='utf-8')
def mode(page,m):page.get_by_role('button',name=m,exact=True).click()
def visit(page,n):
 page.goto(f'{BASE}/biology/lesson/L{n:03}');page.wait_for_load_state('networkidle');mode(page,'EN')
def explore(page):
 page.locator('.bio-steps button').nth(1).click();page.wait_for_load_state('networkidle');page.locator('.bio-explore-grid button').first.wait_for()
def clip(page,n,m):
 bad=page.locator('.bio-explore-grid svg text').evaluate_all('''es=>es.flatMap(e=>{let r=e.getBoundingClientRect(),s=e.closest('svg').getBoundingClientRect();return r.width&&r.height&&(r.left<s.left-1||r.right>s.right+1||r.top<s.top-1||r.bottom>s.bottom+1)?[{text:e.textContent,rect:{x:r.x,y:r.y,w:r.width,h:r.height},svg:{x:s.x,y:s.y,w:s.width,h:s.height}}]:[]})''')
 if bad:R['clips'].append({'lesson':n,'mode':m,'items':bad})
def shot(page,name):
 page.screenshot(path=str(OUT/name),full_page=True)
 if page.locator('.bio-lab, .bio-diversity-lab').count():page.locator('.bio-lab, .bio-diversity-lab').last.screenshot(path=str(OUT/('model-'+name)))
def answers():
 d={}
 for file in ['connections.ts','regulation.ts','populations.ts']:
  text=(ROOT/'content'/file).read_text(encoding='utf-8')
  if file=='connections.ts':
   for a,b in re.findall(r"q\(\s*'(L\d+-q\d+)'[\s\S]*?\],\s*(\d),",text):d[a]=int(b)
  else:
   for a,b in re.findall(r"id: '(L\d+-q\d+)'[\s\S]*?correct: (\d)",text):d[a]=int(b)
 return d
if FINAL:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True);c=b.new_context(viewport={'width':390,'height':844});page=c.new_page()
  page.on('pageerror',lambda e:R['errors'].append(str(e)));page.on('console',lambda e:R['errors'].append(e.text) if e.type=='error' else None)
  R['finalScreens']=[]
  for n in range(49,73):
   visit(page,n)
   for step in [0,3]:
    page.locator('.bio-steps button').nth(step).click()
    for m in ['EN','双语']:
     mode(page,m);w=page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');assert w['scroll']==w['client'],(n,step,m,w)
     R['finalScreens'].append({'lesson':n,'step':step,'mode':m,'width':w})
   print('PASS PREDICT REFLECT PHONE',n,flush=True)
  visit(page,49);explore(page);g=page.locator('.bio-explore-grid');assert g.locator('.bio-playback').count()==0
  g.get_by_role('button',name='Baking yeast',exact=True).focus();page.keyboard.press('Enter');g.get_by_role('button',name='Matches this fungal example',exact=True).click();assert 'judgement matches' in g.inner_text()
  g.get_by_role('button',name='Hide structural evidence',exact=True).click();g.get_by_role('button',name='Displayed clues are insufficient',exact=True).click();assert 'judgement matches' in g.inner_text()
  mode(page,'双语');mode(page,'EN');assert g.get_by_role('button',name='Baking yeast',exact=True).get_attribute('aria-pressed')=='true';assert g.get_by_role('button',name='Reveal structural evidence',exact=True).is_visible()
  R['labs']=[r for r in R['labs'] if r['lesson']!='L049'];R['labs'].insert(0,{'lesson':'L049','timeControls':'not applicable: static classification model','sampleChange':True,'evidenceShowHideClassification':True,'noInertPlayback':True})
  R['L049Final']={'noInertPlayback':True,'classificationWithShownAndWithheldEvidence':True,'languagePreservedCondition':True}
  for width in [1366,390]:
   page.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
   for n in [50,61,67,72]:
    visit(page,n);explore(page);g=page.locator('.bio-explore-grid');g.get_by_role('button',name=conditions[n],exact=True).click()
    if n==72:g.get_by_role('button',name='Parent 2 aa',exact=True).click()
    pb=g.locator('.bio-playback')
    while pb.get_by_role('button',name='Next step',exact=True).is_enabled():pb.get_by_role('button',name='Next step',exact=True).focus();page.keyboard.press('Enter')
    for m in ['EN','双语']:
     mode(page,m);clip(page,n,m);shot(page,f'final-{width}-L{n:03}-{m if m=="EN" else "bi"}.png')
    mode(page,'EN')
    if n==61:assert '20' in g.inner_text() and '47' in g.inner_text()
    if n==67:assert '12 cells' in g.inner_text() and 'density' in g.inner_text() and 'estimate' in g.inner_text()
    if n==72:assert 'Parent 1: AA' in g.inner_text() and 'Parent 2: aa' in g.inner_text() and 'combination is Aa. 4/4 equally likely routes' in g.inner_text(),g.inner_text()
    print('PASS FINAL CROP',width,n,flush=True)
  R['finalStatus']='passed';record();b.close()
 print('FINAL FINISHED',len(R['finalScreens']));sys.exit(exit_status(R,final=True))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);c=b.new_context(viewport={'width':1366,'height':950},accept_downloads=True);page=c.new_page()
 page.on('pageerror',lambda e:R['errors'].append(str(e)));page.on('console',lambda e:R['errors'].append(e.text) if e.type=='error' else None)
 try:
  for n in range(START,73):
   visit(page,n);explore(page);grid=page.locator('.bio-explore-grid');before=grid.locator('svg').last.evaluate('(e)=>e.outerHTML')
   if n==59:
    grid.get_by_role('button',name='Motor neuron',exact=True).click();assert 'not the next station' in grid.inner_text()
    for name in ['Receptor','Sensory neuron','Spinal interneuron','Motor neuron','Muscle']:grid.get_by_role('button',name=name,exact=True).click()
    assert 'route is connected' in grid.inner_text()
   else:
    target=grid.get_by_role('button',name=conditions[n],exact=True);target.focus();page.keyboard.press('Enter');assert target.get_attribute('aria-pressed')=='true'
   if n==57:grid.get_by_role('button',name='Inner ear',exact=True).click()
   if n==60:grid.get_by_role('button',name='B receptor',exact=True).click()
   if n==69:grid.get_by_role('button',name='Sheltered',exact=True).click()
   if n==72:grid.get_by_role('button',name='Parent 2 aa',exact=True).click()
   if n==49:
    grid.get_by_role('button',name='Matches this fungal example',exact=True).click();assert 'judgement matches' in grid.inner_text()
    grid.get_by_role('button',name='Hide structural evidence',exact=True).click();grid.get_by_role('button',name='Displayed clues are insufficient',exact=True).click();assert 'judgement matches' in grid.inner_text();assert grid.locator('.bio-playback').count()==0
    R['labs']=[r for r in R['labs'] if r['lesson']!='L049'];R['labs'].append({'lesson':'L049','classificationEvidenceChange':True,'noInertPlayback':True});record();continue
   pb=grid.locator('.bio-playback');assert '1 /' in pb.inner_text()
   state=grid.locator('svg').last.evaluate('(e)=>e.outerHTML')
   # Language switch must preserve condition and animation step.
   pb.get_by_role('button',name='Next step',exact=True).click();counter=pb.locator('span').last.inner_text();assert counter.startswith('2 /')
   mode(page,'双语');assert pb.locator('span').last.inner_text()==counter;mode(page,'EN');assert pb.locator('span').last.inner_text()==counter
   pb.get_by_role('button',name='▷ Play',exact=True).click();assert pb.get_by_role('button',name='Next step',exact=True).is_disabled()
   pb.get_by_role('button',name='Ⅱ Pause',exact=True).click();paused=pb.locator('span').last.inner_text();page.wait_for_timeout(1500);assert pb.locator('span').last.inner_text()==paused
   steps=0
   while pb.get_by_role('button',name='Next step',exact=True).is_enabled():pb.get_by_role('button',name='Next step',exact=True).click();steps+=1;assert steps<6
   final=pb.locator('span').last.inner_text();a,z=map(int,final.split('/'));assert a==z
   end=grid.locator('svg').last.evaluate('(e)=>e.outerHTML');assert before!=state or before!=end,f'No condition or step scene change {n}'
   clip(page,n,'en')
   if n in [50,53,59,61,67,72]:shot(page,f'desktop-L{n:03}-en.png')
   mode(page,'双语');clip(page,n,'bi')
   if n in [50,53,59,61,67,72]:shot(page,f'desktop-L{n:03}-bi.png')
   mode(page,'EN');pb.get_by_role('button',name='↺ Replay',exact=True).click();assert pb.locator('span').last.inner_text().startswith('1 /')
   # automatic playback ends and can restart
   if n in [50,61,72]:
    pb.get_by_role('button',name='▷ Play',exact=True).click();page.wait_for_timeout((z-1)*1400+300);assert pb.locator('span').last.inner_text()==final;assert pb.get_by_role('button',name='▷ Play',exact=True).is_visible()
    pb.get_by_role('button',name='▷ Play',exact=True).click();assert pb.locator('span').last.inner_text().startswith('1 /');pb.get_by_role('button',name='Ⅱ Pause',exact=True).click()
   if n==67:
    grid.get_by_role('button',name='Choose cells',exact=True).click();assert 'Select at least one cell' in grid.inner_text()
    grid.get_by_text('Quadrat text buttons (diagram alternative)',exact=True).click();grid.get_by_role('button',name='Q01',exact=True).focus();page.keyboard.press('Enter');assert 'Q01; 1 cells' in grid.inner_text()
   if n==72:
    for _ in range(2):pb.get_by_role('button',name='Next step',exact=True).click()
    assert 'AA × aa' in grid.inner_text() or 'Aa' in grid.inner_text()
   R['labs'].append({'lesson':f'L{n:03}','condition':conditions.get(n,'correct five-station reflex built after rejected wrong card'),'finalFrame':final,'pauseStable':True,'languageStatePreserved':True,'keyboardCondition':True});print('PASS LAB',n,flush=True);record()
  START=49
  # Phone, both language modes, every lab; collect page overflow and svg clipping.
  R['mobile']=[];R['flows']=[];R.pop('failure',None);R.pop('traceback',None)
  page.set_viewport_size({'width':390,'height':844})
  for n in range(START,73):
   visit(page,n);explore(page)
   for m in ['EN','双语']:
    mode(page,m);w=page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
    clip(page,n,m);sizes=page.locator('.bio-explore-grid button:visible').evaluate_all('(es)=>es.map(e=>({text:e.innerText,h:e.getBoundingClientRect().height,w:e.getBoundingClientRect().width})).filter(e=>e.h<44||e.w<44)');R['mobile'].append({'lesson':n,'mode':m,'width':w,'smallControls':sizes})
    if n in [50,53,59,61,67,72]:shot(page,f'phone-L{n:03}-{m if m=="EN" else "bi"}.png')
   print('PASS MOBILE',n,flush=True);record()
  page.set_viewport_size({'width':1366,'height':950});correct=answers();assert len(correct)==96,len(correct)
  for n in [49,53,57,61,65,69]:
   visit(page,n);page.locator('.bio-steps button').nth(0).click();page.locator('.bio-predict .bio-options button').nth(1).click();explore(page);page.locator('.bio-explore-grid').get_by_role('button',name=conditions[n],exact=True).click()
   page.locator('.bio-steps button').nth(2).click()
   for qi in range(1,5):
    right=correct[f'L{n:03}-q{qi}'];chosen=(right+1)%3 if qi==1 else right
    page.locator('.bio-question .bio-options button').nth(chosen).click();page.get_by_role('button',name='Check & explain →',exact=True).click();assert page.locator('.bio-feedback').is_visible()
    if qi<4:page.get_by_role('button',name='Next question →',exact=True).click()
   page.locator('.bio-steps button').nth(3).click();note=f'Browser evidence L{n:03}: 我根据模型解释了机制。';page.locator('.bio-finish textarea').fill(note);page.get_by_role('button',name='Finish lesson & save discoveries ✓',exact=True).click();assert page.get_by_text('Lesson complete',exact=False).is_visible()
   page.reload();page.wait_for_load_state('networkidle');assert page.locator('.bio-finish textarea').input_value()==note
   page.goto(f'{BASE}/biology/review');page.wait_for_load_state('networkidle');assert page.locator('.bio-question').is_visible();assert f'L{n:03}' in page.locator('.bio-challenge-wrap a').get_attribute('href')
   page.locator('.bio-question .bio-options button').nth(correct[f'L{n:03}-q1']).click();page.get_by_role('button',name='Check & explain →',exact=True).click();assert 'That evidence fits.' in page.locator('.bio-feedback').inner_text()
   data=page.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))');assert data['answers'][f'L{n:03}-q1']['choice']==correct[f'L{n:03}-q1'];assert data['answers'][f'L{n:03}-q1']['first']!=(correct[f'L{n:03}-q1'])
   R['flows'].append({'lesson':n,'fourQuestions':True,'savedReloaded':True,'wrongEnteredRecallAndCorrected':True});print('PASS FLOW',n,flush=True);record()
  R['status']='passed'
 except Exception as e:
  R['failure']=str(e);R['traceback']=traceback.format_exc();shot(page,'failure.png');print(R['traceback'],flush=True)
 finally:
  record();b.close()
print(json.dumps({'status':R.get('status'),'labs':len(R['labs']),'mobile':len(R['mobile']),'flows':len(R['flows']),'errors':R['errors'],'clipGroups':len(R['clips']),'failure':R.get('failure')},ensure_ascii=False))
sys.exit(exit_status(R))
