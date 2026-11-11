"""Actual isolated S4 Chromium verification; requires owned Vite on 127.0.0.1:3460.
python biology/scripts/verify-s4-browser.py [labs|layouts|flows|screens|all]
Writes partial/final JSON and representative crops; exits nonzero on any defect.
"""
from playwright.sync_api import sync_playwright
import json,pathlib,sys,re,traceback,time
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s4');OUT.mkdir(exist_ok=True)
ROOT=pathlib.Path(__file__).resolve().parents[1]/'apps/web/src';BASE='http://127.0.0.1:3460'
PHASE=sys.argv[1] if len(sys.argv)>1 else 'all'
R=json.loads((OUT/'verification.json').read_text(encoding='utf-8')) if PHASE!='all' and (OUT/'verification.json').exists() else {'labs':[],'layouts':[],'flows':[],'errors':[],'clips':[],'failures':[],'screens':[]}
R['status']='in-progress';R['phase']=PHASE;R['isolatedContext']=True
STATIC={73,76,77,79}
SELECT={75,79,81,86,87,96}
def record(): (OUT/'verification.json').write_text(json.dumps(R,ensure_ascii=False,indent=2),encoding='utf-8')
def mode(p,m): p.get_by_role('button',name=m,exact=True).click()
def visit(p,n):
 p.goto(f'{BASE}/biology/lesson/L{n:03}');p.wait_for_load_state('networkidle');mode(p,'EN')
def explore(p):
 p.locator('.bio-steps button').nth(1).click();p.locator('.bio-explore-grid button').first.wait_for();p.locator('.bio-explore-grid .bio-lab').last.wait_for()
 return p.locator('.bio-explore-grid .bio-lab').last
def btn(l,s):return l.get_by_role('button',name=s,exact=True)
def key(p,l,s):
 target=btn(l,s);pressed=target.get_attribute('aria-pressed');target.focus();p.keyboard.press('Enter')
 if pressed is not None: assert target.get_attribute('aria-pressed')=='true',s
 return target
def svg(l):return l.locator('svg').last.evaluate('(e)=>e.outerHTML')
def counter(l):return l.locator('.bio-playback').last.locator(':scope > span').inner_text()
def next_(p,l):key(p,l,'Next step')
def end(p,l):
 count=0
 while btn(l,'Next step').is_enabled():next_(p,l);count+=1;assert count<8
 a,z=map(int,counter(l).split('/'));assert a==z
 return counter(l)
def replay(p,l):key(p,l,'↺ Replay');assert counter(l).startswith('1 /')
def slider(p,l,i,value):
 s=l.locator('input[type=range]').nth(i);s.focus();p.keyboard.press('Home')
 cur=float(s.input_value());step=float(s.get_attribute('step') or 1)
 for _ in range(round((value-cur)/step)):p.keyboard.press('ArrowRight')
 assert float(s.input_value())==value,(i,value,s.input_value())
def check(l,*texts):
 text=l.inner_text()
 for s in texts:assert s in text,(s,text)
def clip(p,n,m,width,where):
 bad=p.locator('.bio-explore-grid svg text').evaluate_all('''es=>es.flatMap(e=>{let r=e.getBoundingClientRect(),s=e.closest('svg').getBoundingClientRect();return r.width&&r.height&&(r.left<s.left-1||r.right>s.right+1||r.top<s.top-1||r.bottom>s.bottom+1)?[{text:e.textContent,rect:{x:r.x,y:r.y,w:r.width,h:r.height},svg:{x:s.x,y:s.y,w:s.width,h:s.height}}]:[]})''')
 if bad:R['clips'].append({'lesson':n,'mode':m,'width':width,'state':where,'items':bad})
def shot(p,n,width,m,state='final'):
 name=f'{state}-{width}-L{n:03}-{m if m=="EN" else "bi"}.png'
 p.locator('.bio-explore-grid .bio-lab').last.screenshot(path=str(OUT/('model-'+name)))
 R['screens'].append({'lesson':n,'width':width,'mode':m,'state':state,'path':str(OUT/('model-'+name))})
 if width==390 and n>=89:
  region=p.locator('.bio-explore-grid .bio-lab').last.locator('[role=region]:has(> svg)');region.evaluate('(e)=>{e.scrollLeft=e.scrollWidth}')
  p.locator('.bio-explore-grid .bio-lab').last.screenshot(path=str(OUT/('right-model-'+name)))
  R['screens'].append({'lesson':n,'width':width,'mode':m,'state':state+'-diagram-scrolled-right','path':str(OUT/('right-model-'+name))})
  region.evaluate('(e)=>{e.scrollLeft=0}')
def fail(p,phase,n,e):
 item={'phase':phase,'lesson':n,'message':str(e),'traceback':traceback.format_exc()};R['failures'].append(item)
 print('FAIL',phase,n,item['message'],flush=True)
 try:p.screenshot(path=str(OUT/f'failure-{phase}-{n}.png'),full_page=True)
 except Exception:pass
 record()
def manipulate(p,l,n):
 before=svg(l);evidence={}
 if n==73:
  slider(p,l,0,4);check(l,'A=96.0','V=64.0','A/V=1.50');key(p,l,'Flattened');check(l,'V=64.0');evidence={'equalVolumeShapeComparison':True,'keyboardSlider':4}
 elif n==74:
  check(l,'2n = 4; chromosomes 4; DNA 2C');next_(p,l);check(l,'2n = 4; chromosomes 4; DNA 4C');assert before!=svg(l);next_(p,l);check(l,'2n = 4; chromosomes 4; DNA 4C');key(p,l,'Yes');check(l,'Held at the G2 check');assert btn(l,'Next step').count()==0;key(p,l,'No');check(l,'DNA 2C');evidence={'S_changes_DNA_not_ploidy':True,'checkpointPreventsM':True}
 elif n==75:
  key(p,l,'2. Prophase');key(p,l,'Move earlier');key(p,l,'4. Anaphase');key(p,l,'Move earlier');check(l,'Order correct.');end(p,l);check(l,'Daughter chromosomes per pole: 4 / 4');key(p,l,'Yes');end(p,l);check(l,'Daughter chromosomes per pole: 5 / 3','A2');evidence={'keyboardSortedCards':True,'normal4v4_error5v3':True}
 elif n==76:
  key(p,l,'Muscle');check(l,'M','ON');key(p,l,'No');check(l,'Without suitable progenitors');key(p,l,'Neuronal');check(l,'Neuronal profile: expression only');evidence={'expressionAndRepairBoundary':True}
 elif n==77:
  check(l,'Activation energy 25','ΔG remains −15');key(p,l,'No');check(l,'Activation energy 70','R:20','P:5','ΔG remains −15');evidence={'barrier70v25_sameEndpoints20v5_deltaGminus15':True}
 elif n==78:
  key(p,l,'Non-matching B here');end(p,l);check(l,'converted 0; enzyme 1');key(p,l,'Matching substrate A');end(p,l);check(l,'converted 1; enzyme 1');slider(p,l,0,0);end(p,l);check(l,'No substrate, no new product','converted 0; enzyme 1');evidence={'mismatch_zeroSubstrate_enzymeReuse':True}
 elif n==79:
  key(p,l,'Chill then assay at 40°C');check(l,'Current initial rate=80.0');cold=svg(l);key(p,l,'Heat then assay at 40°C');check(l,'Current initial rate=6.4');assert cold!=svg(l);key(p,l,'pH');slider(p,l,1,3);check(l,'pH: 3');evidence={'coldRewarm80_heatDamage6_4':True,'pHKeyboardSlider':3}
 elif n==80:
  key(p,l,'Triglyceride');key(p,l,'Bile (not an enzyme)');end(p,l);check(l,'smaller droplets; same triglyceride molecules');bile=svg(l);key(p,l,'Lipase');end(p,l);check(l,'fatty acids','monoglycerides');assert bile!=svg(l);key(p,l,'Amylase');end(p,l);check(l,'substrate unchanged in this selected route');evidence={'bileEmulsifies_lipaseHydrolyses_wrongAgentRejected':True}
 elif n==81:
  end(p,l);check(l,'Net equation: C6, H12, O18');key(p,l,'Trace released oxygen');end(p,l);check(l,'C6, H24, O24','12 H₂O','Isotope evidence');evidence={'netC6H12O18_expandedC6H24O24_water12':True}
 elif n==82:
  slider(p,l,0,100);slider(p,l,1,10);slider(p,l,2,25);check(l,'Limits: co2');key(p,l,'Keep comparison (up to 8)');slider(p,l,1,100);slider(p,l,2,20);check(l,'Limits: temperature');key(p,l,'Keep comparison (up to 8)');assert l.locator('tbody tr').count()==2;l.locator('select').select_option('temperature');evidence={'limitingFactorChanged_co2ToTemperature':True,'retainedTwoComparisons':True}
 elif n==83:
  key(p,l,'Human cell: low-O₂ lactate');end(p,l);check(l,'lactate','NAD⁺');lactate=svg(l);key(p,l,'Yeast: low-O₂ ethanol');end(p,l);check(l,'ethanol','CO₂');assert lactate!=svg(l);evidence={'distinctFermentationProducts_NADregeneration':True}
 elif n==84:
  l.locator('input[type=checkbox]').uncheck();slider(p,l,0,7);check(l,'Start 3 + regenerate 0; 3 tasks');end(p,l);check(l,'done 3; left 0; unmet 4');l.locator('input[type=checkbox]').focus();p.keyboard.press('Space');end(p,l);check(l,'done 7; left 0; unmet 0');evidence={'finiteATP_withoutEnergy3_withEnergy7_budgetCloses':True}
 elif n==85:
  l.locator('input[type=checkbox]').uncheck();end(p,l);check(l,'4 chromosomes','4 DNA');unrep=svg(l);l.locator('input[type=checkbox]').focus();p.keyboard.press('Space');end(p,l);check(l,'4 chromosomes','8 DNA');assert unrep!=svg(l);evidence={'chromosomes4_DNA4v8':True}
 elif n==86:
  check(l,'1 cells; each 4 chromosomes, 8 DNA molecules, 2n, 4C');l.locator('input[type=checkbox]').nth(0).focus();p.keyboard.press('Space');next_(p,l);next_(p,l);check(l,'2 cells; each 2 chromosomes, 4 DNA molecules, 1n, 2C');next_(p,l);check(l,'4 cells; each 2 chromosomes, 2 DNA molecules, 1n, 1C');s=svg(l);l.locator('input[type=checkbox]').nth(1).focus();p.keyboard.press('Space');end(p,l);assert s!=svg(l);evidence={'afterS2n4C_afterI_n2C_afterII_n1C':True,'orientationAndCrossover':True}
 elif n==87:
  sels=l.locator('select');sels.nth(0).select_option('AA');sels.nth(1).select_option('aa');end(p,l);check(l,'AA 0%; Aa 100%; aa 0%');sels.nth(0).select_option('Aa');sels.nth(1).select_option('Aa');sels.nth(2).select_option('1');sels.nth(3).select_option('1');end(p,l);check(l,'Build: a (parent A) + a (parent B) = aa','AA 25%; Aa 50%; aa 25%');assert l.locator('svg rect[stroke="#ac6257"]').count() or 'aa' in svg(l);evidence={'AAxaa_allAa_AaxAa_1_2_1_selectedaa':True}
 elif n==88:
  slider(p,l,0,4);seed=l.locator('input[type=number]');seed.fill('42');small=l.locator('tbody').inner_text();key(p,l,'Next batch (seed + 1)');seed.fill('42');assert l.locator('tbody').inner_text()==small;slider(p,l,0,120);large=l.locator('tbody').inner_text();assert small!=large;rows=l.locator('tbody tr').all();assert sum(int(r.locator('td').last.inner_text()) for r in rows)==120;key(p,l,'Next batch (seed + 1)');assert l.locator('tbody').inner_text()!=large;evidence={'small4_large120_seed42Reproduced_newBatchDiffers':True}
 elif n==89:
  key(p,l,'Animal skin mutation');end(p,l);check(l,'ordinarily lacks a gamete-transmission route');skin=svg(l);key(p,l,'Recombine existing versions');end(p,l);check(l,'alleles remain A/a and B/b');assert skin!=svg(l);evidence={'somaticVsHeritable_recombinationNoNewAllele':True}
 elif n==90:
  key(p,l,'A contributes1, B2');end(p,l);rows=l.locator('tbody tr');assert rows.last.locator('td').first.inner_text()=='0.1111';key(p,l,'Initial A0');end(p,l);assert all(float(r.locator('td').first.inner_text())==0 for r in l.locator('tbody tr').all());evidence={'selectionFrequency0_1111_initialA0Stays0':True}
 elif n==91:
  key(p,l,'Molecular comparisons');end(p,l);check(l,'100','4','18','17');molecular=svg(l);key(p,l,'Corresponding anatomy');end(p,l);assert molecular!=svg(l);evidence={'independentMolecularAndAnatomyEvidence':True}
 elif n==92:
  end(p,l);beforeRotation=svg(l);key(p,l,'Rotate branches');end(p,l);assert beforeRotation!=svg(l);check(l,'((Amber,Birch),Cobalt)','rotation preserves common ancestry');evidence={'rotationChangesDrawing_preservesTopology':True}
 elif n==93:
  end(p,l);rows=l.locator('tbody tr');totals=[int(r.locator('td').last.inner_text()) for r in rows.all()];assert len(set(totals))==1;burn=rows.last.inner_text();key(p,l,'No combustion');end(p,l);assert l.locator('tbody tr').last.inner_text()!=burn;assert all(int(r.locator('td').last.inner_text())==totals[0] for r in l.locator('tbody tr').all());evidence={'allSixFramesTotalConserved':totals[0],'combustionToggleChangesStores':True}
 elif n==94:
  forms=[]
  while True:
   forms.append(re.search(r'Current form: (.*?)\.',l.inner_text()).group(1))
   if not btn(l,'Next step').is_enabled():break
   next_(p,l)
  key(p,l,'Denitrification to air');end(p,l);check(l,'Current form: N₂');evidence={'uptakeRouteForms':forms,'denitrificationReturnsN2':True}
 elif n==95:
  key(p,l,'20% transfer');end(p,l);values=[]
  for row in l.locator('tbody tr').all():
   v=[float(x) for x in row.locator('td').all_text_contents()];assert abs(v[0]-sum(v[1:]))<.001;values.append(v)
  assert values[0]==[1000,200,300,500];key(p,l,'5% transfer');end(p,l);assert l.locator('tbody tr').first.locator('td').nth(1).inner_text()=='50.00';evidence={'levelBudgetsClose_20percent':values,'5percentNext50':True}
 elif n==96:
  end(p,l);check(l,'Day 0','Day 1','Day 30','indices measure litter-decomposition rate, not species counts','baseline moisture is restored until day30');different=svg(l);key(p,l,'Four, similar sensitivities');end(p,l);assert different!=svg(l);check(l,'Resistance(day1/100)=0.40');key(p,l,'One, drought tolerant');end(p,l);check(l,'Resistance(day1/100)=0.65');key(p,l,'Flooding');end(p,l);assert '0.65' not in l.locator('p').filter(has_text='Resistance(day1/100)').inner_text();evidence={'threeCommunitiesMatchedProtocol_day0_1_30':True,'floodCounterexample':True}
 assert n==74 or before!=svg(l),f'No scientific SVG change in L{n:03}'
 return evidence

def verify_playback(p,l,n):
 if n in STATIC:
  assert btn(l,'Next step').count()==0;state=svg(l);mode(p,'双语');mode(p,'EN');assert svg(l)==state;return {'notApplicable':'static condition comparison; no time controls','languagePreservesConditions':True}
 replay(p,l);initialSvg=svg(l);next_(p,l);c=counter(l);assert c.startswith('2 /')
 state=l.locator('input,select').evaluate_all('(es)=>es.map(e=>({value:e.value,checked:e.checked}))');pressed=l.locator('button[aria-pressed]').evaluate_all('(es)=>es.map(e=>e.getAttribute("aria-pressed"))')
 mode(p,'双语');assert counter(l)==c;assert l.locator('input,select').evaluate_all('(es)=>es.map(e=>({value:e.value,checked:e.checked}))')==state;assert l.locator('button[aria-pressed]').evaluate_all('(es)=>es.map(e=>e.getAttribute("aria-pressed"))')==pressed
 mode(p,'EN');assert counter(l)==c
 key(p,l,'▷ Play');assert btn(l,'Next step').is_disabled();key(p,l,'Ⅱ Pause');pause=counter(l);p.wait_for_timeout(1500);assert counter(l)==pause
 final=end(p,l);assert svg(l)!=initialSvg
 replay(p,l)
 if n in [74,81,86,90,96]:
  key(p,l,'▷ Play');z=int(final.split('/')[1]);p.wait_for_timeout((z-1)*1400+350);assert counter(l)==final;assert btn(l,'▷ Play').is_visible();key(p,l,'▷ Play');assert counter(l).startswith('1 /');key(p,l,'Ⅱ Pause')
 end(p,l)
 return {'stepPauseEndReplay':True,'languagePreservesFrameConditions':True,'automaticEndRestart':n in [74,81,86,90,96],'finalFrame':final}

def layout(p,n,step,m,width,state='initial'):
 mode(p,m);w=p.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
 sizes=p.locator('.bio-explore-grid button:visible,.bio-explore-grid select:visible,.bio-explore-grid input[type=number]:visible,.bio-explore-grid input[type=range]:visible').evaluate_all('(es)=>es.map(e=>({text:e.innerText||e.closest("label")?.innerText,type:e.type,h:e.getBoundingClientRect().height,w:e.getBoundingClientRect().width})).filter(e=>e.h<43.9||e.w<43.9)') if step==1 else []
 # Checkbox's complete labelled hit area is assessed separately from native tiny glyph.
 checks=p.locator('.bio-explore-grid input[type=checkbox]:visible').evaluate_all('(es)=>es.map(e=>{let r=e.closest("label").getBoundingClientRect();return {text:e.closest("label").innerText,h:r.height,w:r.width}}).filter(e=>e.h<43.9||e.w<43.9)') if step==1 else []
 if step==1:clip(p,n,m,width,state)
 regions=p.locator('.bio-explore-grid [role=region]:has(> svg)').evaluate_all('(es)=>es.map(e=>({client:e.clientWidth,scroll:e.scrollWidth,tabindex:e.tabIndex,hint:e.getAttribute("aria-label")}))') if step==1 and n>=89 else []
 R['layouts'].append({'lesson':n,'step':step,'mode':m,'width':width,'page':w,'smallControls':sizes+checks,'state':state,'localDiagramScroll':regions});record()
 if step==1 and n>=89 and width==390:assert len(regions)==2 and all(r['client']<r['scroll'] and r['client']<=358 and r['tabindex']==0 for r in regions),(n,regions)
 assert w['scroll']<=w['client']+1,(n,step,m,width,w)
 assert not sizes+checks,(n,m,width,sizes+checks)

def answers(p):
 if p.url=='about:blank':p.goto(BASE);p.wait_for_load_state('networkidle')
 # Read shipped metadata from the locally served application; all submissions use UI.
 d=p.evaluate("""async()=>Object.fromEntries((await import('/src/content.ts')).lessons.filter(l=>Number(l.id.slice(1))>=73&&Number(l.id.slice(1))<=96).flatMap(l=>l.questions.map(q=>[q.id,q.correct])))""")
 assert len(d)==96,len(d)
 return d

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True);context=browser.new_context(viewport={'width':1366,'height':950},accept_downloads=True);p=context.new_page();p.set_default_timeout(10000)
 p.on('pageerror',lambda e:R['errors'].append({'kind':'pageerror','message':str(e)}));p.on('console',lambda e:R['errors'].append({'kind':'console','message':e.text}) if e.type=='error' else None)
 try:
  if PHASE in ['all','labs']:
   R['labs']=[];R['failures']=[x for x in R['failures'] if x['phase']!='labs']
   for n in range(73,97):
    try:
     visit(p,n);l=explore(p);e=manipulate(p,l,n);play=verify_playback(p,l,n)
     for m in ['EN','双语']:
      mode(p,m);clip(p,n,m,1366,'manipulated-final')
      if n in SELECT:shot(p,n,1366,m)
     mode(p,'EN');R['labs'].append({'lesson':n,'scientificChecks':e,'playback':play});print('PASS LAB',n,flush=True);record()
    except Exception as e:fail(p,'labs',n,e)
  if PHASE in ['all','screens']:
   R['failures']=[x for x in R['failures'] if x['phase']!='screens'];R['tableRetest']=[]
   for width in [1366,390]:
    p.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
    for n in [74,79,86,89,90,93,94,95,96]:
     try:
      visit(p,n);l=explore(p);manipulate(p,l,n)
      if n==79:
       key(p,l,'Temperature');key(p,l,'Chill then assay at 40°C')
       for m in ['EN','双语']:mode(p,m);shot(p,n,width,m,'cold-rewarmed')
       mode(p,'EN');key(p,l,'Heat then assay at 40°C')
      if n==86:l.locator('input[type=checkbox]').nth(0).check()
      if n not in STATIC:end(p,l)
      for m in ['EN','双语']:
       mode(p,m);clip(p,n,m,width,'representative-final');shot(p,n,width,m,'representative-final')
       if n in [90,93,95,96]:
        pageWidth=p.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
        wrapped=l.locator('table td').evaluate_all(r'''es=>es.filter(e=>/^\d+(\.\d+)?$/.test(e.innerText)).flatMap(e=>{let r=document.createRange();r.selectNodeContents(e);return r.getClientRects().length>1?[e.innerText]:[]})''')
        table=l.locator('table').evaluate('(e)=>({width:e.getBoundingClientRect().width,parentClient:e.parentElement.clientWidth,parentScroll:e.parentElement.scrollWidth})')
        data={'lesson':n,'width':width,'mode':m,'page':pageWidth,'table':table,'wrappedNumericCells':wrapped}
        if n in [93,95,96] and width==390:
         reg=l.locator('[role=region]:not(:has(> svg))');assert reg.get_attribute('aria-label') and reg.get_attribute('tabindex')=='0'
         assert reg.count()==1;reg.evaluate('(e)=>{e.scrollLeft=0}');reg.focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(200);data['keyboardTableScroll']=reg.evaluate('(e)=>e.scrollLeft')>0;assert data['keyboardTableScroll']
         reg.evaluate('(e)=>{e.scrollLeft=e.scrollWidth}');l.screenshot(path=str(OUT/f'data-right-390-L{n:03}-{m if m=="EN" else "bi"}.png'));reg.evaluate('(e)=>{e.scrollLeft=0}')
        R['tableRetest'].append(data);assert pageWidth['scroll']==pageWidth['client'];assert not wrapped,(n,width,m,wrapped)

      print('PASS REPRESENTATIVE',width,n,flush=True);record()
     except Exception as e:fail(p,'screens',n,e)
  if PHASE in ['all','layouts']:
   R['layouts']=[];R['failures']=[x for x in R['failures'] if x['phase']!='layouts']
   for width in [1366,390]:
    p.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
    for n in range(73,97):
     try:
      visit(p,n);l=explore(p)
      for m in ['EN','双语']:layout(p,n,1,m,width)
      if width==390:
       mode(p,'EN');manipulate(p,l,n)
       if n not in STATIC:end(p,l)
       for m in ['EN','双语']:
        layout(p,n,1,m,width,'manipulated-final')
        if n in SELECT:shot(p,n,width,m)
       if n>=89:
        mode(p,'EN');regions=p.locator('.bio-explore-grid [role=region]:has(> svg)');assert regions.count()==2
        for region in regions.all():
         region.evaluate('(e)=>{e.scrollLeft=0}');region.focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(200);assert region.evaluate('(e)=>e.scrollLeft')>0
      for step in [0,3]:
       p.locator('.bio-steps button').nth(step).click()
       for m in ['EN','双语']:layout(p,n,step,m,width)
      print('PASS LAYOUT',width,n,flush=True)
     except Exception as e:fail(p,'layouts',n,e)
  if PHASE in ['all','flows']:
   R['flows']=[];R['failures']=[x for x in R['failures'] if x['phase']!='flows'];p.set_viewport_size({'width':1366,'height':950});correct=answers(p)
   for n in [73,77,81,85,89,93]:
    try:
     visit(p,n);p.locator('.bio-steps button').nth(0).click();p.locator('.bio-predict .bio-options button').nth(1).click();l=explore(p);manipulate(p,l,n);p.locator('.bio-steps button').nth(2).click()
     prefix=f'L{n:03}-'+('Q' if 81<=n<=88 else 'q')
     for qi in range(1,5):
      right=correct[f'{prefix}{qi}'];chosen=(right+1)%3 if qi==1 else right;p.locator('.bio-question .bio-options button').nth(chosen).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert p.locator('.bio-feedback').is_visible()
      if qi<4:p.get_by_role('button',name='Next question →',exact=True).click()
     p.locator('.bio-steps button').nth(3).click();note=f'S4 independent browser evidence L{n:03}: 我根据模型解释了机制。';p.locator('.bio-finish textarea').fill(note);p.get_by_role('button',name='Finish lesson & save discoveries ✓',exact=True).click();assert p.get_by_text('Lesson complete',exact=False).is_visible();p.reload();p.wait_for_load_state('networkidle');assert p.locator('.bio-finish textarea').input_value()==note
     p.goto(f'{BASE}/biology/review');p.wait_for_load_state('networkidle');p.locator('.bio-question').wait_for();assert f'L{n:03}' in p.locator('.bio-challenge-wrap a').get_attribute('href');p.locator('.bio-question .bio-options button').nth(correct[f'{prefix}1']).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert 'That evidence fits.' in p.locator('.bio-feedback').inner_text();data=p.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))');ans=data['answers'][f'{prefix}1'];assert ans['choice']==correct[f'{prefix}1'] and ans['first']!=ans['choice'];R['flows'].append({'lesson':n,'fourQuestions':True,'genuineExploration':True,'savedReloadedBilingualNote':True,'wrongFirstRecallCorrectFirstRetained':True});print('PASS FLOW',n,flush=True);record()
    except Exception as e:fail(p,'flows',n,e)
 finally:
  R['coverage']={'scientificLabs':len(R['labs']),'staticLabs':4,'processLabs':20,'geometryStates':len(R['layouts']),'desktopInitialStates':sum(x['width']==1366 for x in R['layouts']),'phoneStatesIncludingManipulatedFinals':sum(x['width']==390 for x in R['layouts']),'phonePredictReflectStates':sum(x['width']==390 and x['step'] in [0,3] for x in R['layouts']),'phoneExploreStatesIncludingFinals':sum(x['width']==390 and x['step']==1 for x in R['layouts']),'lessonRecallPersistenceFlows':len(R['flows']),'tableRetestStates':len(R.get('tableRetest',[]))}
  R['status']='passed' if len(R['labs'])==24 and len(R['flows'])==6 and len(R['layouts'])==336 and len(R.get('tableRetest',[]))==16 and not R['failures'] and not R['errors'] and not R['clips'] else 'partial-or-failed';record();context.close();browser.close()
print(json.dumps({'status':R['status'],'labs':len(R['labs']),'layouts':len(R['layouts']),'flows':len(R['flows']),'errors':len(R['errors']),'clips':len(R['clips']),'failures':len(R['failures'])},ensure_ascii=False),flush=True)
sys.exit(0 if R['status']=='passed' else 1)
