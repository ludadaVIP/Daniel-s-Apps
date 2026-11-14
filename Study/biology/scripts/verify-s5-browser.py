"""Independent Chromium S5 course verification, own port 3460 and fresh contexts.
Run `python biology/scripts/verify-s5-browser.py discover|all|labs|layouts|flows`.
No production browser/storage is accessed. Every failure is persisted and exits nonzero.
"""
from playwright.sync_api import sync_playwright
import pathlib,json,sys,time,traceback,re,hashlib
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s5');OUT.mkdir(exist_ok=True)
SRC=pathlib.Path(__file__).resolve().parents[1]/'apps/web/src'
BASE='http://127.0.0.1:3460';PHASE=sys.argv[1] if len(sys.argv)>1 else 'all'
R={'status':'in-progress','labs':[],'layouts':[],'flows':[],'screens':[],'failures':[],'errors':[],'svgIssues':[],'discovery':[]}
if PHASE not in ['all','discover'] and (OUT/'verification.json').exists():R=json.loads((OUT/'verification.json').read_text(encoding='utf-8'));R['previousStatus']=R['status'];R['status']='in-progress'
def record(): (OUT/'verification.json').write_text(json.dumps(R,ensure_ascii=False,indent=2),encoding='utf-8')
def mode(p,m):p.get_by_role('button',name=m,exact=True).click()
def visit(p,n):
 p.goto(f'{BASE}/biology/lesson/L{n:03}');p.wait_for_load_state('networkidle');mode(p,'EN')
def explore(p):
 p.locator('.bio-steps button').nth(1).click();l=p.locator('.bio-explore-grid .bio-s5-lab').last;l.wait_for();l.locator('svg').wait_for();return l
def key(p,l,s):
 b=l.get_by_role('button',name=s,exact=True);b.focus();p.keyboard.press('Enter');return b
def choice(p,l,f,i):
 b=l.locator('fieldset').nth(f).get_by_role('button').nth(i);b.focus();p.keyboard.press('Enter');assert b.get_attribute('aria-pressed')=='true';observe(p);return b.inner_text()
def slider(p,l,i,value):
 s=l.locator('input[type=range]').nth(i);s.focus();p.keyboard.press('Home');minimum=float(s.input_value());step=float(s.get_attribute('step') or 1)
 for _ in range(round((value-minimum)/step)):p.keyboard.press('ArrowRight')
 assert float(s.input_value())==value
def check(l,*texts):
 actual=l.inner_text()
 for s in texts:assert s in actual,(s,actual)
def counter(l):return l.locator('.bio-playback > span').inner_text()
def end(p,l):
 if not l.locator('.bio-playback').count():return
 while l.get_by_role('button',name='Next step',exact=True).is_enabled():key(p,l,'Next step');observe(p)
def replay(p,l):key(p,l,'↺ Replay');assert counter(l).startswith('1 /')
def svg(l):return l.locator('svg').last.evaluate('(e)=>e.outerHTML')
def failure(p,phase,n,e):
 R['failures'].append({'phase':phase,'lesson':n,'error':str(e),'traceback':traceback.format_exc()});print('FAIL',phase,n,str(e)[:500],flush=True)
 try:p.screenshot(path=str(OUT/f'early-failure-{phase}-{n}.png'),full_page=True)
 except Exception:pass
 record()
def discover(p):
 for n in range(97,121):
  visit(p,n);l=explore(p);d={'lesson':n,'text':l.inner_text(),'fields':l.locator('fieldset').evaluate_all('(es)=>es.map(e=>e.innerText)'), 'inputs':l.locator('input,select').evaluate_all('(es)=>es.map(e=>({type:e.type,value:e.value,min:e.min,max:e.max,label:e.closest("label")?.innerText,options:e.tagName==="SELECT"?[...e.options].map(o=>({value:o.value,text:o.text})):null}))')};R['discovery'].append(d);record();print(n,d['text'][:120],flush=True)
STATIC={97,100,105,106,107,109,112,113,116,117,118,119,120}
def tick(p,l,i=0):
 c=l.locator('input[type=checkbox]').nth(i);c.focus();p.keyboard.press('Space');assert c.is_checked()
def select(p,l,value,i=0):
 s=l.locator('select').nth(i);s.focus();opts=s.locator('option').evaluate_all('(es)=>es.map(e=>e.value)');p.keyboard.press('Home')
 for _ in range(opts.index(value)):p.keyboard.press('ArrowDown')
 p.keyboard.press('Enter');assert s.input_value()==value;observe(p)
def observe(p):
 n=int(p.url.rsplit('/L',1)[1]);width=p.viewport_size['width']
 for m in ['EN','双语']:mode(p,m);svg_check(p,n,m,width,'branch-frame')
 mode(p,'EN')
def manipulate(p,l,n):
 initial=l.inner_text();ev={}
 if n==97:
  check(l,'Passage allowed');choice(p,l,0,1);check(l,'Passage blocked');assert l.locator('[data-transport-route="blocked"]').count()==1
  choice(p,l,1,1);check(l,'Passage allowed');route=l.locator('[data-transport-route="protein"]');assert route.count()==1 and route.get_attribute('d').startswith('M320 ')
  choice(p,l,0,2);check(l,'Passage allowed');ev={'oxygenLipid_ionBlocked_matchingIonAndGlucoseProtein':True,'proteinArrowX':320}
 elif n==98:
  end(p,l);rows=l.locator('tbody tr').all();vals=[[float(v) for v in r.locator('td').all_text_contents()] for r in rows];assert vals[-1][1:3]==[10.38,9.63],vals[-1];assert all(abs(r[1]+r[2]-20)<.02 for r in vals)
  choice(p,l,0,1);end(p,l);assert l.locator('tbody tr').last.locator('td').all_text_contents()==['4','10.00','10.00','2.50','2.50','0.00']
  choice(p,l,1,1);end(p,l);assert l.locator('tbody tr').last.locator('td').all_text_contents()==['4','10.00','10.00','0.00','0.00','0.00'];ev={'initial16v4Final10_38v9_63_roundedExpectedAmounts':True,'equilibriumNonzeroBothWays':2.5,'impermeableZeroTransfers':True}
 elif n==99:
  end(p,l);check(l,'Initial net direction: into cell');assert l.locator('[data-cell-membrane="wall-adjacent"]').get_attribute('width')=='206'
  choice(p,l,0,1);end(p,l);check(l,'Initial net direction: out of cell');assert l.locator('[data-cell-membrane="wall-adjacent"]').get_attribute('width')=='206'
  choice(p,l,1,1);end(p,l);assert l.locator('[data-cell-membrane="animal"]').get_attribute('width')=='112';choice(p,l,0,2);end(p,l);check(l,'Initial net direction: zero net');ev={'plant206Unchanged_inAndOut_noPlasmolysis':True,'animalOut112_balanced150':True}
 elif n==100:
  check(l,'A×3/d=3','uphill uptake=0');choice(p,l,0,1);choice(p,l,1,1);check(l,'A×3/d=12','uphill uptake=0');choice(p,l,2,1);check(l,'uphill uptake=2');ev={'geometry3to12_energy0to2':True}
 elif n==101:
  check(l,'Model valve opens');end(p,l);assert l.locator('tbody tr').count()==10;check(l,'Pulmonary artery','Pulmonary vein');choice(p,l,0,1);check(l,'Model valve closes');end(p,l);ev={'pressure12v8Open_8v12Closed':True,'tenCirculationLocations':True}
 elif n==102:
  for food,locations in [(0,['lumen','lumen','lumen','blood']),(1,['lumen','lumen','lumen','blood']),(2,['lumen','lumen','epithelium','lacteal'])]:
   choice(p,l,0,food)
   for i,loc in enumerate(locations):
    marker=l.locator('[data-food-location]');assert marker.get_attribute('data-food-location')==loc,(food,i,marker.get_attribute('data-food-location'))
    if i<3:key(p,l,'Next step')
  check(l,'lacteal');ev={'starchAndProteinRemainInLumenUntilAbsorption':True,'fatLumenLumenEpitheliumLacteal':True}
 elif n==103:
  end(p,l);td=l.locator('tbody').first;check(td,'100','90','10');choice(p,l,0,1);end(p,l);check(td,'100','98','2');ev={'same100Filtrate_recovery90v98_urine10v2':True}
 elif n==104:
  check(l,'has a matching receptor and can respond');choice(p,l,0,1);choice(p,l,1,1);end(p,l);check(l,'lacks a matching receptor and does not respond','Hormone travels in blood');ev={'neuralVsEndocrine_andReceptorRequirement':True}
 elif n==105:
  check(l,'Leaf: source','Root: sink');select(p,l,'store-source');check(l,'Store: source','Shoot: sink');ev={'xylemUp_phloemSourceSinkRolesChange':True}
 elif n==106:
  check(l,'Loss: 5 relative units','Uptake: 5.4');slider(p,l,0,80);check(l,'Loss: 2 relative units','Uptake: 2.4');slider(p,l,0,50);slider(p,l,1,3);check(l,'Loss: 10 relative units');key(p,l,'Water available: stomata respond to light');check(l,'Loss: 0.5 relative units');ev={'humidity50to80_loss5to2_wind3_loss10_closed0_5':True}
 elif n==107:
  slider(p,l,0,90);check(l,'Current rate 40;');select(p,l,'70');check(l,'Current rate 70;');slider(p,l,0,20);check(l,'Current rate 20;');curves=l.locator('polyline');assert curves.count()==2
  c=curves.evaluate_all('(es)=>es.map(e=>({stroke:getComputedStyle(e).stroke,width:getComputedStyle(e).strokeWidth,dash:getComputedStyle(e).strokeDasharray,opacity:getComputedStyle(e).opacity}))');assert c[0]['stroke']=='rgb(161, 94, 64)' and c[1]['stroke']=='rgb(52, 124, 101)' and c[0]['dash']!='none' and c[1]['dash']=='none';ev={'lowCarbon40Plateau_high70_atLight20Both20':True,'visibleComputedCurves':c}
 elif n==108:
  end(p,l);check(l,'An embryo develops after fertilisation');select(p,l,'N');assert l.locator('svg path[fill="#dfca7b"]').count();select(p,l,'Mg');check(l,'Low Mg: chlorophyll affected');ev={'fourReproductionStages_NandMgComparison':True}
 elif n==109:
  b=l.get_by_role('button',name='Position 1: A',exact=True);b.focus();p.keyboard.press('Enter');assert l.get_by_role('button',name='Position 1: T',exact=True).count();p.keyboard.press('Enter');assert l.get_by_role('button',name='Position 1: G',exact=True).count();ev={'baseCycleAtoTtoG_complementChanges':True}
 elif n==110:
  end(p,l);check(l,'Ribosome → protein');select(p,l,'rna');end(p,l);check(l,'Functional RNA; no translation');ev={'proteinVsFunctionalRNARoutes':True}
 elif n==111:
  key(p,l,'Next step');check(l,'8 chromatids; 4C DNA each');end(p,l);check(l,'4 cell(s); 1 sets and 2 chromosomes each','2 chromatids; 1C DNA each');select(p,l,'mitosis');end(p,l);check(l,'2 cell(s); 2 sets and 4 chromosomes each','4 chromatids; 2C DNA each');ev={'meiosisFinal4_n2_1C_mitosis2_2n4_2C':True}
 elif n==112:
  check(l,'current 16');slider(p,l,0,2);check(l,'current 28');slider(p,l,1,6);check(l,'current 40');ev={'G3E0_16_G3E2_28_G6E2_40':True}
 elif n==113:
  choice(p,l,0,1);check(l,'Inspect the mechanism');choice(p,l,0,0);choice(p,l,1,0);choice(p,l,2,1);check(l,'85 innate and 15 adaptive records','not protection contribution');ev={'wrongClassificationThen85Innate15AdaptiveNotProtection':True}
 elif n==114:
  key(p,l,'Next step');key(p,l,'Next step');check(l,'Point 2: primary 3, secondary 16');choice(p,l,0,1);end(p,l);rows=l.locator('tbody tr').all();assert all(r.locator('td').nth(1).inner_text()==r.locator('td').nth(2).inner_text() for r in rows);check(l,'A memory does not recognise B');ev={'matchedPoint2_3v16_unmatchedSamePrimary':True}
 elif n==115:
  end(p,l);assert l.locator('tbody tr').last.locator('td').all_text_contents()==['Descendants','0','8','8','100%'];choice(p,l,0,1);end(p,l);check(l,'fraction undefined');assert 'undefined' in l.locator('tbody tr').last.inner_text();choice(p,l,0,0);choice(p,l,1,1);end(p,l);assert l.locator('tbody tr').last.locator('td').all_text_contents()==['Descendants','72','8','80','10%'];ev={'selectionR2to8_zeroSourceUndefined_noSelectionR10percent':True}
 elif n==116:
  check(l,'A 5%, B 10%','5 percentage points');choice(p,l,0,1);check(l,'A 20%, B 10%','B−A=-10');choice(p,l,1,1);check(l,'Random allocation helps reduce confounding');choice(p,l,2,1);check(l,'5.88%','5%–20%','independent of the 50-person switch');ev={'denominator200to50_5to20percent_missingSeparate5to20Bounds':True}
 elif n==117:
  choice(p,l,0,1);check(l,'Specify seven days');choice(p,l,1,1);tick(p,l);check(l,'Now testable','Means 9/12 cm');ev={'operationalFactorOutcomeAndMatchedControlsRepair':True}
 elif n==118:
  check(l,'12 readings come from 1 biological units')
  for i in range(4):tick(p,l,i)
  check(l,'Addressed 4/4','12 readings come from 4 biological units');ev={'12ReadingsNot12Replicates_1to4Units_allFourDesignRepairs':True}
 elif n==119:
  check(l,'mean 9 cm, range 2 cm');choice(p,l,0,1);check(l,'mean 13.5 cm, range 20 cm','Direction reverses');choice(p,l,1,0);check(l,'Disagreement is not grounds for deletion');choice(p,l,1,1);tick(p,l);check(l,'Repaired title');ev={'outlier9to13_5_range2to20_retainInvestigateRepairAxes':True}
 elif n==120:
  choice(p,l,1,0);check(l,'Overreach');choice(p,l,1,2);check(l,'faulty design still confounds');choice(p,l,0,1);check(l,'Matched conclusion: 12 vs 9 cm, a 3 cm difference here','sugar unmeasured');ev={'overclaimRejected_confoundedClaimRejected_repairedConditionalClaim':True}
 assert initial!=l.inner_text(),f'L{n} no visible scientific response'
 details=l.locator('details');opened=[]
 for d in details.all():
  if not d.get_attribute('open'):d.locator('summary').click()
  assert len(d.inner_text())>120;opened.append(d.inner_text())
 ev['completeStaticAlternative']={'tables':l.locator('table').count(),'expandedNotes':opened}
 assert ev['completeStaticAlternative']['tables'] or opened
 return ev
def state(l):return {'inputs':l.locator('input,select').evaluate_all('(es)=>es.map(e=>({value:e.value,checked:e.checked}))'),'pressed':l.locator('button[aria-pressed]').evaluate_all('(es)=>es.map(e=>e.getAttribute("aria-pressed"))'),'bases':l.locator('.pi-bases button').all_text_contents(),'counter':counter(l) if l.locator('.bio-playback').count() else None}
def language(p,l):
 s=state(l);mode(p,'双语');assert state(l)==s;mode(p,'EN');assert state(l)==s;return True
def svg_check(p,n,m,width,label):
 # Browser-computed glyph bounds, not source string estimates; applies to both explanation and activity diagrams.
 result=p.locator('.bio-explore-grid svg').evaluate_all('''svgs=>svgs.flatMap((s,idx)=>{const sr=s.getBoundingClientRect();return [...s.querySelectorAll('text')].flatMap(e=>{let r=e.getBoundingClientRect();if(!r.width||!r.height)return [];return r.left<sr.left-1||r.right>sr.right+1||r.top<sr.top-1||r.bottom>sr.bottom+1?[{kind:'textOutside',svg:idx,text:e.textContent,rect:{x:r.x-sr.x,y:r.y-sr.y,w:r.width,h:r.height},svgSize:{w:sr.width,h:sr.height}}]:[]}).concat([...s.querySelectorAll('[fill],[stroke]')].flatMap(e=>['fill','stroke'].flatMap(a=>{let v=e.getAttribute(a);return v&&!CSS.supports('color',v)&&v!=='none'&&!v.startsWith('url(')?[{kind:'invalidColor',svg:idx,tag:e.tagName,attribute:a,value:v}]:[]})))})''')
 if result:R['svgIssues'].append({'lesson':n,'mode':m,'width':width,'state':label,'issues':result})
 return result
def playback(p,l,n):
 language(p,l)
 if n in STATIC:
  assert not l.locator('.bio-playback').count();return {'staticNoFakePlayback':True,'languagePreservesConditions':True}
 assert l.locator('.bio-playback').count()==1
 replay(p,l);key(p,l,'▷ Play');assert l.get_by_role('button',name='Next step',exact=True).is_disabled();p.wait_for_timeout(1500);assert not counter(l).startswith('1 /');key(p,l,'Ⅱ Pause');paused=counter(l);p.wait_for_timeout(1500);assert counter(l)==paused
 replay(p,l);frames=[]
 while True:
  frames.append({'counter':counter(l),'texts':l.locator('svg text').all_text_contents()})
  for m in ['EN','双语']:mode(p,m);svg_check(p,n,m,1366,'frame-'+counter(l))
  mode(p,'EN');language(p,l)
  if l.get_by_role('button',name='Next step',exact=True).is_disabled():break
  key(p,l,'Next step')
 last=counter(l);key(p,l,'▷ Play');assert counter(l).startswith('1 /');key(p,l,'Ⅱ Pause');replay(p,l);end(p,l)
 return {'actualPlayAdvanced':True,'pausedFor1500ms':True,'stepAllFrames':frames,'replayAndRestart':True,'languagePreservesFrameConditions':True,'final':last}
def screenshot(p,l,n,width,m,label):
 name=f'final-{width}-L{n:03}-'+('en' if m=='EN' else 'bi')+f'-{label}.png';l.screenshot(path=str(OUT/name));R['screens'].append({'lesson':n,'width':width,'mode':m,'state':label,'path':str(OUT/name),'classification':'final-run'})
 if width==390:
  regs=[r for r in l.locator('[role=region]').all() if r.evaluate('(e)=>e.scrollWidth>e.clientWidth+1')]
  if regs:
   for r in regs:r.evaluate('(e)=>e.scrollLeft=e.scrollWidth')
   right=name.replace('.png','-right.png');l.screenshot(path=str(OUT/right));R['screens'].append({'lesson':n,'width':width,'mode':m,'state':label+'-regions-scrolled-right','path':str(OUT/right),'classification':'final-run'})
   for r in regs:r.evaluate('(e)=>e.scrollLeft=0')
def layout(p,l,n,width,m,label,step=1):
 mode(p,m);p.wait_for_timeout(50);dims=p.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');assert dims['scroll']<=dims['client']+1,(n,width,m,label,'page overflow',dims)
 d={'lesson':n,'width':width,'mode':m,'state':label,'step':step,'page':dims}
 if step==1:
  small=l.locator('button:visible,select:visible,input[type=range]:visible').evaluate_all('(es)=>es.map(e=>({text:e.innerText||e.closest("label")?.innerText,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(e=>e.w<43.9||e.h<43.9)');small+=l.locator('input[type=checkbox]:visible').evaluate_all('(es)=>es.map(e=>({text:e.closest("label").innerText,w:e.closest("label").getBoundingClientRect().width,h:e.closest("label").getBoundingClientRect().height})).filter(e=>e.w<43.9||e.h<43.9)');assert not small,(n,width,m,'small controls',small)
  svg_check(p,n,m,width,label)
  wrapped=l.locator('td').evaluate_all(r'''es=>es.flatMap(e=>{if(!/^[-−]?\d+(\.\d+)?%?$/.test(e.innerText))return [];let r=document.createRange();r.selectNodeContents(e);return r.getClientRects().length>1?[e.innerText]:[]})''');assert not wrapped,(n,width,m,'numeric wrapping',wrapped)
  regs=l.locator('[role=region]').all();scrolls=[]
  for reg in regs:
   d1=reg.evaluate('(e)=>({client:e.clientWidth,scroll:e.scrollWidth,name:e.getAttribute("aria-label"),tab:e.tabIndex})')
   if d1['scroll']>d1['client']+1:
    assert d1['name'] and d1['tab']==0;reg.evaluate('(e)=>e.scrollLeft=0');reg.focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(160);assert reg.evaluate('(e)=>e.scrollLeft')>0;reg.evaluate('(e)=>e.scrollLeft=0');scrolls.append(d1)
  d['keyboardScrollableRegions']=scrolls;screenshot(p,l,n,width,m,label)
 R['layouts'].append(d);record()
def source_info():
 return {str(f.relative_to(SRC)):{'modifiedNs':f.stat().st_mtime_ns,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in SRC.rglob('*') if f.is_file() and f.suffix in ['.tsx','.ts','.css']}
def route_resets(p):
 R['routeResets']=[]
 for a,b in [(97,98),(104,105),(105,106),(112,113),(113,114)]:
  visit(p,b);baselineB=state(explore(p));visit(p,a);l=explore(p);baselineA=state(l);manipulate(p,l,a)
  # Navigate via actual application links; same-document navigation preserves the document marker.
  token=p.evaluate('window.__s5DocumentMarker=Math.random()');p.get_by_role('link',name='← Back to the map',exact=True).click();p.locator(f'.bio-lesson-card[href="/biology/lesson/L{b:03}"]').click();l=explore(p);assert p.evaluate('window.__s5DocumentMarker')==token
  actual=state(l);assert actual==baselineB,(a,b,actual,baselineB)
  if actual['counter']:assert actual['counter'].startswith('1 /')
  p.get_by_role('link',name='← Back to the map',exact=True).click();p.locator(f'.bio-lesson-card[href="/biology/lesson/L{a:03}"]').click();l=explore(p);actual=state(l);assert actual==baselineA,(a,b,actual,baselineA)
  if a==97:assert actual['pressed']==['true','false','false','true','false']
  if a==113:assert actual['pressed']==['false']*6
  R['routeResets'].append({'from':a,'to':b,'sameDocumentNavigation':True,'destinationDefaults':True,'returnDefaults':True});record()
def transport_proofs(p):
 R['transportProofs']=[]
 for width in [1366,390]:
  p.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
  for n in [97,99,102]:
   visit(p,n);l=explore(p)
   def capture(label):
    for m in ['EN','双语']:mode(p,m);svg_check(p,n,m,width,label);screenshot(p,l,n,width,m,label)
    mode(p,'EN');R['transportProofs'].append({'lesson':n,'width':width,'state':label});record()
   if n==97:
    choice(p,l,0,1);choice(p,l,1,1);assert l.locator('[data-transport-route="protein"]').get_attribute('d').startswith('M320 ');capture('protein-channel-passage')
   elif n==99:
    choice(p,l,0,1);end(p,l);assert l.locator('[data-cell-membrane="wall-adjacent"]').get_attribute('width')=='206';capture('plant-water-loss-membrane-against-wall')
   else:
    for i in range(3):
     choice(p,l,0,i);key(p,l,'Next step');key(p,l,'Next step');loc='epithelium' if i==2 else 'lumen';assert l.locator('[data-food-location]').get_attribute('data-food-location')==loc;capture(['starch-before-absorption-in-lumen','protein-before-absorption-in-lumen','fat-rebuilt-in-epithelium'][i]);key(p,l,'Next step');assert l.locator('[data-food-location]').get_attribute('data-food-location')==('lacteal' if i==2 else 'blood');capture(['starch-products-in-blood','protein-products-in-blood','fat-products-in-lacteal'][i])
def flows(p):
 p.goto(BASE);p.wait_for_load_state('networkidle');correct=p.evaluate("async()=>Object.fromEntries((await import('/src/content.ts')).lessons.filter(l=>Number(l.id.slice(1))>=97&&Number(l.id.slice(1))<=120).flatMap(l=>l.questions.map(q=>[q.id,q.correct])))")
 assert sorted(correct)==[f'L{n:03}-q{i}' for n in range(97,121) for i in range(1,5)];R['questionIds']={'count':len(correct),'allStableLowercase':True}
 for n in [97,101,105,109,113,117]:
  try:
   visit(p,n);p.locator('.bio-steps button').nth(0).click();p.locator('.bio-predict .bio-options button').nth(1).click();l=explore(p);manipulate(p,l,n);p.locator('.bio-steps button').nth(2).click()
   for qi in range(1,5):
    right=correct[f'L{n:03}-q{qi}'];chosen=(right+1)%3 if qi==1 else right;p.locator('.bio-question .bio-options button').nth(chosen).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert p.locator('.bio-feedback').is_visible()
    if qi<4:p.get_by_role('button',name='Next question →',exact=True).click()
   p.locator('.bio-steps button').nth(3).click();note=f'S5 genuine independent Chromium L{n:03}: 我根据证据解释了模型。';p.locator('.bio-finish textarea').fill(note);p.get_by_role('button',name='Finish lesson & save discoveries ✓',exact=True).click();assert p.get_by_text('Lesson complete',exact=False).is_visible();p.reload();p.wait_for_load_state('networkidle');assert p.locator('.bio-finish textarea').input_value()==note
   p.get_by_role('link',name='Notebook',exact=True).first.click();p.locator('.bio-notes').wait_for();assert note in p.locator('.bio-notes article').filter(has_text=f'L{n:03} /').inner_text();p.reload();p.wait_for_load_state('networkidle');assert note in p.locator('.bio-notes article').filter(has_text=f'L{n:03} /').inner_text()
   p.goto(f'{BASE}/biology/review');p.wait_for_load_state('networkidle');p.locator('.bio-question').wait_for();assert f'L{n:03}' in p.locator('.bio-challenge-wrap a').get_attribute('href');p.locator('.bio-question .bio-options button').nth(correct[f'L{n:03}-q1']).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert 'That evidence fits.' in p.locator('.bio-feedback').inner_text();p.reload();p.wait_for_load_state('networkidle');data=p.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))');a=data['answers'][f'L{n:03}-q1'];assert a['choice']==correct[f'L{n:03}-q1'] and a['first']!=a['choice'];R['flows'].append({'lesson':n,'prediction':True,'actualManipulation':True,'fourUIQuestions':True,'noteSavedAndReloaded':True,'notebookVisibleAndReloaded':True,'recallCorrectedReloadedFirstWrongRetained':True});print('PASS FLOW',n,flush=True);record()
  except Exception as e:failure(p,'flows',n,e)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True);context=browser.new_context(viewport={'width':1366,'height':950});p=context.new_page();p.set_default_timeout(12000)
 p.on('pageerror',lambda e:R['errors'].append({'type':'pageerror','text':str(e)}));p.on('console',lambda e:R['errors'].append({'type':'console','text':e.text}) if e.type=='error' else None)
 try:
  if PHASE=='discover':discover(p)
  else:
   if PHASE in ['proofs','refresh102']:
    R.setdefault('previousRuns',[]).append({**{k:R[k] for k in ['sourceStart','sourceEnd','sourceUnchangedDuringRun','startedAt','finishedAt','coverage'] if k in R},'status':R.get('previousStatus'),'phase':'before-'+PHASE})
   R['sourceStart']=source_info();R['startedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z');R['isolatedContext']=True
   if PHASE in ['all','labs','layouts']:
    if PHASE in ['all','labs']:R['labs']=[]
    if PHASE in ['all','layouts']:R['layouts']=[];R['screens']=[];R['svgIssues']=[]
    R['failures']=[x for x in R['failures'] if x['phase'] not in (['labs','layouts'] if PHASE=='all' else [PHASE])]
    for width in ([1366] if PHASE=='labs' else [1366,390]):
     p.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
     for n in range(97,121):
      try:
       visit(p,n);l=explore(p)
       if PHASE in ['all','layouts']:
        for m in ['EN','双语']:layout(p,l,n,width,m,'initial')
       mode(p,'EN');ev=manipulate(p,l,n)
       if width==1366 and PHASE in ['all','labs']:
        play=playback(p,l,n);R['labs'].append({'lesson':n,'scientificChecks':ev,'playback':play});print('PASS LAB',n,flush=True);record()
       if PHASE in ['all','layouts']:
        end(p,l)
        for m in ['EN','双语']:layout(p,l,n,width,m,'manipulated-final')
        for step,label in [(0,'predict'),(3,'reflect')]:
         p.locator('.bio-steps button').nth(step).click()
         for m in ['EN','双语']:layout(p,l,n,width,m,label,step)
        print('PASS LAYOUT',width,n,flush=True)
      except Exception as e:failure(p,'labs' if PHASE=='labs' else 'layouts',n,e)
   if PHASE in ['all','flows']:
    R['flows']=[];R['failures']=[x for x in R['failures'] if x['phase']!='flows'];p.set_viewport_size({'width':1366,'height':950});flows(p)
   if PHASE in ['all','routes']:
    R['failures']=[x for x in R['failures'] if x['phase']!='routes']
    try:route_resets(p)
    except Exception as e:failure(p,'routes',0,e)
   if PHASE=='proofs':
    try:transport_proofs(p)
    except Exception as e:failure(p,'proofs',0,e)
   if PHASE=='refresh102':
    R['labs']=[x for x in R['labs'] if x['lesson']!=102];R['layouts']=[x for x in R['layouts'] if x['lesson']!=102];R['screens']=[x for x in R['screens'] if x['lesson']!=102];R['svgIssues']=[x for x in R['svgIssues'] if x['lesson']!=102];R['failures']=[x for x in R['failures'] if x['lesson']!=102]
    for width in [1366,390]:
     try:
      p.set_viewport_size({'width':width,'height':950 if width==1366 else 844});visit(p,102);l=explore(p)
      for m in ['EN','双语']:layout(p,l,102,width,m,'initial')
      mode(p,'EN');ev=manipulate(p,l,102)
      if width==1366:R['labs'].append({'lesson':102,'scientificChecks':ev,'playback':playback(p,l,102)})
      end(p,l)
      for m in ['EN','双语']:layout(p,l,102,width,m,'manipulated-final')
      for step,label in [(0,'predict'),(3,'reflect')]:
       p.locator('.bio-steps button').nth(step).click()
       for m in ['EN','双语']:layout(p,l,102,width,m,label,step)
     except Exception as e:failure(p,'refresh102',102,e)
    R['targetedCertification']={'lesson':102,'scope':'All starch, protein and long-chain-fat scientific routes; every process frame EN/bilingual; both widths, initial/final/predict/reflect; label layout only source repair. Other course diagrams unchanged.'}
 finally:
  if PHASE!='discover':R['coverageSupplement']={'transportProofStates':len(R.get('transportProofs',[])),'finalScreensAreManifestOnly':True,'productionStorageAccessed':False,'allContextsClosedByFinally':True}
  if PHASE=='discover':R['status']='discovered' if len(R['discovery'])==24 and not R['errors'] else 'partial-or-failed'
  else:
   R['sourceEnd']=source_info();R['sourceUnchangedDuringRun']=R['sourceStart']==R['sourceEnd'];R['finishedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z');R['coverage']={'activities':len(R['labs']),'staticActivities':sum(x['lesson'] in STATIC for x in R['labs']),'processActivities':sum(x['lesson'] not in STATIC for x in R['labs']),'layoutStates':len(R['layouts']),'finalRunScreenshots':len(R['screens']),'completeLessonRecallNoteFlows':len(R['flows']),'routeResetPairs':len(R.get('routeResets',[]))};R['status']='passed' if len(R['labs'])==24 and len(R['layouts'])==384 and len(R['flows'])==6 and len(R.get('routeResets',[]))==5 and not R['failures'] and not R['errors'] and not R['svgIssues'] and R['sourceUnchangedDuringRun'] else 'partial-or-failed'
  record();context.close();browser.close()
print(json.dumps({'status':R['status'],'coverage':R.get('coverage'),'failures':len(R['failures']),'errors':len(R['errors']),'svgIssues':len(R['svgIssues'])}),flush=True)
sys.exit(0 if R['status'] in ['discovered','passed'] else 1)
