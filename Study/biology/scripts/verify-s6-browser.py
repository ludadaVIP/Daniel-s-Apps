"""Independent Chromium S6 course verification, own port 3460 and fresh contexts.
Run `python biology/scripts/verify-s6-browser.py discover|all|labs|layouts|flows`.
No production browser/storage is accessed. Every failure is persisted and exits nonzero.
"""
from playwright.sync_api import sync_playwright
import pathlib,json,sys,time,traceback,re,hashlib
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s6');OUT.mkdir(exist_ok=True)
SRC=pathlib.Path(__file__).resolve().parents[1]/'apps/web/src'
BASE='http://127.0.0.1:3460';PHASE=sys.argv[1] if len(sys.argv)>1 else 'all'
if (OUT/'verification.json').exists():
 archive=OUT/'run-history';archive.mkdir(exist_ok=True);(archive/f'{time.time_ns()}-before-{PHASE}.json').write_bytes((OUT/'verification.json').read_bytes())
R={'status':'in-progress','labs':[],'layouts':[],'flows':[],'screens':[],'failures':[],'errors':[],'svgIssues':[],'discovery':[]}
if PHASE not in ['all','discover'] and (OUT/'verification.json').exists():R=json.loads((OUT/'verification.json').read_text(encoding='utf-8'));R['previousStatus']=R['status'];R['status']='in-progress'
def record(): (OUT/'verification.json').write_text(json.dumps(R,ensure_ascii=False,indent=2),encoding='utf-8')
def mode(p,m):
 if m=='中':
  b=p.locator('button').filter(has_text=re.compile(r'^(中|中文|ZH)$')).first;b.click()
 else:p.get_by_role('button',name=m,exact=True).click()
def visit(p,n):
 p.goto(f'{BASE}/biology/lesson/L{n:03}');p.wait_for_load_state('networkidle');mode(p,'EN')
def explore(p):
 p.locator('.bio-steps button').nth(1).click();l=p.locator('.bio-explore-grid .bio-s6-lab').last;l.wait_for();l.locator('svg').wait_for();return l
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
 for n in range(121,145):
  visit(p,n);l=explore(p);d={'lesson':n,'text':l.inner_text(),'fields':l.locator('fieldset').evaluate_all('(es)=>es.map(e=>e.innerText)'), 'inputs':l.locator('input,select').evaluate_all('(es)=>es.map(e=>({type:e.type,value:e.value,min:e.min,max:e.max,label:e.closest("label")?.innerText,options:e.tagName==="SELECT"?[...e.options].map(o=>({value:o.value,text:o.text})):null}))')};R['discovery'].append(d);record();print(n,d['text'][:120],flush=True)
STATIC={125,127,128,133,135,136,138,140,141,142,143,144}

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
 initial=svg(l);ev={'branches':[]}
 def snap(label):
  if l.locator('.bio-playback').count():
   replay(p,l);observe(p)
  end(p,l)
  ev['branches'].append({'label':label,'text':l.inner_text(),'svgHash':hashlib.sha256(svg(l).encode()).hexdigest(),'svgText':l.locator('svg text').all_text_contents()})
  observe(p)
 def slider_to(i,value):slider(p,l,i,value);snap(f'range-{i}={value}')
 def toggle(i=0):
  c=l.locator('input[type=checkbox]').nth(i);c.focus();p.keyboard.press('Space');snap(f'checkbox-{i}={c.is_checked()}')
 def plain(i=0):
  # Scope via direct non-playback ancestor; selection is based on discovered rendered buttons.
  b=l.locator('button').all()[i];b.focus();p.keyboard.press('Enter');snap('button:'+b.inner_text())
 def pick(f,i):choice(p,l,f,i);snap(f'choice-{f}={i}')
 end(p,l);snap('default-final')
 if n==121:slider_to(0,2);check(l,'4 duplexes','6 new strands');slider_to(0,4);check(l,'16 duplexes','30 new strands')
 elif n in [122,123]:
  plain();check(l,'GCC');assert 'GCC' in ''.join(l.locator('svg text').all_text_contents());plain();check(l,'GCU')
 elif n==124:
  slider_to(0,4);slider_to(1,0);rows=l.locator('tbody tr').all();assert all(float(r.locator('td').nth(2).inner_text())==0 for r in rows);slider_to(1,.5)
 elif n==125:
  check(l,'Total ΔG=-10','driving conditions met');plain();check(l,'driving conditions not met');slider_to(0,40);plain();check(l,'Total ΔG=10','driving conditions not met')
 elif n==126:
  check(l,'net ATP ≈30');plain();check(l,'net ATP ≈2','Lactate fermentation');plain();check(l,'net ATP ≈30')
 elif n==127:slider_to(0,0);check(l,'Budget supports 0.00');slider_to(1,0);slider_to(0,36);check(l,'Budget supports 0.00');slider_to(1,24);check(l,'Budget supports 2.00')
 elif n==128:
  active=l.locator('[data-feedback=active]');assert active.locator('path').count()==2;assert active.locator('path').last.get_attribute('d')=='M240 150h30'
  slider_to(1,16);check(l,'flux=1.80');plain();check(l,'flux=9.00','No E₁ connection: no inhibition');inactive=l.locator('[data-feedback=inactive]');assert inactive.locator('path').count()==1;assert inactive.locator('path').get_attribute('d')=='M622 175V135H360';assert not l.locator('[data-feedback=active]').count();slider_to(0,12);check(l,'flux=10.29')
 elif n==129:toggle(0);toggle(0);toggle(1)
 elif n==130:
  before=l.locator('svg polyline').evaluate_all('(es)=>es.map(e=>e.getAttribute("points"))');toggle();check(l,'50 Hz');after=l.locator('svg polyline').evaluate_all('(es)=>es.map(e=>e.getAttribute("points"))');assert before!=after;toggle()
 elif n==131:toggle();check(l,'k=0.6, d=1');toggle();check(l,'k=0.3, d=0')
 elif n==132:toggle(0);toggle(0);toggle(1)
 elif n==133:
  slider_to(0,0);slider_to(1,0);slider_to(2,0);check(l,'undefined, not zero');slider_to(0,20);slider_to(1,40);slider_to(2,40);toggle();check(l,'p=80/200=0.400')
 elif n==134:
  original=l.locator('tbody').inner_text();slider_to(0,18);assert l.locator('tbody').inner_text()!=original;slider_to(0,17);assert l.locator('tbody').inner_text()==original
  toggle(1);toggle(2);rows=l.locator('tbody tr');assert rows.nth(1).locator('td').nth(1).inner_text()=='0.533';toggle(0);toggle(3)
 elif n==135:plain();toggle();check(l,'clades remain AB, CD and ABCD')
 elif n==136:toggle();check(l,'A means 10→20 cm; B 14→16 cm');toggle();check(l,'A means 10→16 cm; B 14→20 cm')
 elif n==137:
  assert l.locator('tbody tr td').all_text_contents()==['4','32.00','0.00','32.00','30.00','Valid in model']
  pick(1,0);assert l.locator('tbody tr td').all_text_contents()==['4','10.13','0.00','10.13','8.13','Valid in model']
  pick(2,1);assert l.locator('tbody tr td').all_text_contents()==['4','10.13','5.06','10.13','8.13','Target in blank; invalid'];check(l,'invalid controls');replay(p,l);assert l.locator('tbody tr td').all_text_contents()==['0','2.00','1.00','2.00','0.00','Target in blank; invalid'];observe(p);end(p,l)
  pick(2,2);assert l.locator('tbody tr td').all_text_contents()==['4','2.00','0.00','2.00','0.00','Not valid'];check(l,'without deleting DNA')
  pick(2,0);pick(0,0);assert l.locator('tbody tr td').all_text_contents()==['4','0.00','0.00','10.13','8.13','Valid in model'];check(l,'No starting target')
  replay(p,l);assert l.locator('tbody tr td').all_text_contents()==['0','0.00','0.00','2.00','0.00','Not yet run'];check(l,'amplification has not been tested');observe(p);end(p,l)

 elif n==138:pick(0,1);pick(1,1);check(l,'ATCG','AGCT');pick(2,1);check(l,'Overreach');pick(2,2)
 elif n==139:pick(0,1);check(l,'Denominator switch');pick(0,2);check(l,'untested sites');pick(0,0);check(l,'12/20=60%')
 elif n==140:pick(0,1);pick(1,1);check(l,'Defensible');pick(1,2);check(l,'Unknown does not mean proven harmful');l.locator('textarea').fill('Independent evidence of ecological impact would change my decision.');snap('edited-revision-rule')
 elif n==141:pick(0,2);check(l,'cannot separate trees');pick(1,1);pick(0,1);check(l,'Answerable');l.locator('textarea').fill('How do public counts vary at matched effort?');snap('edited-question')
 elif n==142:pick(0,1);pick(1,1);check(l,'B−A is two records per five minutes');pick(0,0);check(l,'NA is not zero');pick(0,1)
 elif n==143:pick(0,0);check(l,'B mean 5');pick(1,1);pick(2,2);check(l,'NA was not observed');pick(0,1);pick(1,0);pick(2,1);check(l,'A mean 2, B mean 4')
 elif n==144:
  pick(0,1);assert 'Trees double' in l.locator('textarea').nth(0).input_value();pick(0,0);l.locator('textarea').nth(2).fill(' '.join(['evidence']*315));slider_to(0,105);check(l,'315 words, about 3.0 minutes');slider_to(0,70);check(l,'about 4.5 minutes')
 else:raise AssertionError(n)
 for d in l.locator('details').all():
  if d.get_attribute('open') is None:d.locator('summary').click()
  assert len(d.inner_text())>80
 assert len(ev['branches'])>=3
 ev['staticAlternatives']={'tables':l.locator('table').count(),'details':l.locator('details[open]').count(),'text':l.inner_text()}
 # Read-only inspection after actual UI manipulation verifies onExplore persistence.
 data=p.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))')
 assert data['sessions'][f'L{n:03}']['explored'] is True,data
 ev['onExplorePersisted']=True
 return ev

def state(l):return {'inputs':l.locator('input,select').evaluate_all('(es)=>es.map(e=>({value:e.value,checked:e.checked}))'),'pressed':l.locator('button[aria-pressed]').evaluate_all('(es)=>es.map(e=>e.getAttribute("aria-pressed"))'),'counter':counter(l) if l.locator('.bio-playback').count() else None}
def language(p,l):
 s=state(l);mode(p,'双语');assert state(l)==s;mode(p,'EN');assert state(l)==s;return True
SVG_CHECK_JS = r"""svgs => {
 const issues=[];
 svgs.forEach((s,idx) => {
  const sr=s.getBoundingClientRect(), vb=s.viewBox.baseVal;
  for(const e of s.querySelectorAll('text')) {
   const r=e.getBoundingClientRect();
   if(r.width && r.height && (r.left<sr.left-1 || r.right>sr.right+1 || r.top<sr.top-1 || r.bottom>sr.bottom+1)) issues.push({kind:'textOutside',svg:idx,text:e.textContent});
  }
  for(const e of s.querySelectorAll('[fill],[stroke]')) {
   for(const a of ['fill','stroke']) {
    const v=e.getAttribute(a);
    if(v && v!=='none' && !v.startsWith('url(') && !CSS.supports('color',v)) issues.push({kind:'invalidColor',svg:idx,attribute:a,value:v});
   }
  }
  for(const e of s.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon')) {
   const b=e.getBBox();
   if(b.x<vb.x-1 || b.y<vb.y-1 || b.x+b.width>vb.x+vb.width+1 || b.y+b.height>vb.y+vb.height+1) issues.push({kind:'shapeOutside',svg:idx,tag:e.tagName,box:{x:b.x,y:b.y,w:b.width,h:b.height}});
  }
  for(const g of s.querySelectorAll('g')) {
   const r=g.querySelector(':scope>rect'), t=g.querySelector(':scope>text');
   if(!r || !t) continue;
   const rb=r.getBBox(), tb=t.getBBox();
   // Gel lanes and bars have external captions; only rounded compact nodes contain labels.
   if(rb.height>100 || !r.hasAttribute('rx')) continue;
   if(tb.x<rb.x+2 || tb.x+tb.width>rb.x+rb.width-2 || tb.y<rb.y || tb.y+tb.height>rb.y+rb.height) issues.push({kind:'nodeTextOutside',svg:idx,text:t.textContent,node:{x:rb.x,y:rb.y,w:rb.width,h:rb.height},textBox:{x:tb.x,y:tb.y,w:tb.width,h:tb.height}});
  }
 });
 return issues;
}"""
def svg_check(p,n,m,width,label):
 result=p.locator('.bio-explore-grid svg').evaluate_all(SVG_CHECK_JS)
 R.setdefault('svgChecks',[]).append({'lesson':n,'mode':m,'width':width,'state':label,'issues':len(result),'svgs':p.locator('.bio-explore-grid svg').count(),'frame':p.locator('.bio-playback > span').all_text_contents(),'digest':hashlib.sha256(p.locator('.bio-explore-grid').inner_html().encode()).hexdigest()})
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
 if width in [1366,390]:
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
 if step!=1:
  name=f'final-{width}-L{n:03}-'+('en' if m=='EN' else 'bi')+f'-{label}.png';target=p.locator('.bio-predict' if step==0 else '.bio-finish');target.screenshot(path=str(OUT/name));R['screens'].append({'lesson':n,'width':width,'mode':m,'state':label,'path':str(OUT/name),'classification':'final-run'})
 R['layouts'].append(d);record()
def source_info():
 files=[f for f in SRC.rglob('*') if f.is_file() and f.suffix in ['.tsx','.ts','.css']];files+=list((SRC.parents[2]/'curriculum/s06').rglob('*.md'));files+=[SRC.parent/'index.html']
 return {str(f.relative_to(SRC.parents[2])):{'modifiedNs':f.stat().st_mtime_ns,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in files}
def route_resets(p):
 R['routeResets']=[]
 for a,b in [(121,122),(128,129),(129,130),(136,137),(137,138)]:
  visit(p,b);baselineB=state(explore(p));visit(p,a);l=explore(p);baselineA=state(l);manipulate(p,l,a)
  # Navigate via actual application links; same-document navigation preserves the document marker.
  token=p.evaluate('window.__s6DocumentMarker=Math.random()');p.get_by_role('link',name='← Back to the map',exact=True).click();p.locator(f'.bio-lesson-card[href="/biology/lesson/L{b:03}"]').click();l=explore(p);assert p.evaluate('window.__s6DocumentMarker')==token
  actual=state(l);assert actual==baselineB,(a,b,actual,baselineB)
  if actual['counter']:assert actual['counter'].startswith('1 /')
  p.get_by_role('link',name='← Back to the map',exact=True).click();p.locator(f'.bio-lesson-card[href="/biology/lesson/L{a:03}"]').click();l=explore(p);actual=state(l);assert actual==baselineA,(a,b,actual,baselineA)
  R['routeResets'].append({'from':a,'to':b,'sameDocumentNavigation':True,'destinationDefaults':True,'returnDefaults':True});record()

def flows(p):
 p.goto(BASE);p.wait_for_load_state('networkidle');correct=p.evaluate("async()=>Object.fromEntries((await import('/src/content.ts')).lessons.filter(l=>Number(l.id.slice(1))>=121&&Number(l.id.slice(1))<=144).flatMap(l=>l.questions.map(q=>[q.id,q.correct])))")
 assert sorted(correct)==[f'L{n:03}-q{i}' for n in range(121,145) for i in range(1,5)];R['questionIds']={'count':len(correct),'allStableLowercase':True,'ids':sorted(correct)}
 for n in ([int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else [121,125,129,133,137,141]):
  try:
   visit(p,n);p.locator('.bio-steps button').nth(0).click();p.locator('.bio-predict .bio-options button').nth(1).click();l=explore(p);manipulate(p,l,n);p.locator('.bio-steps button').nth(2).click()
   for qi in range(1,5):
    right=correct[f'L{n:03}-q{qi}'];chosen=(right+1)%3 if qi==1 else right;p.locator('.bio-question .bio-options button').nth(chosen).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert p.locator('.bio-feedback').is_visible()
    if qi<4:p.get_by_role('button',name='Next question →',exact=True).click()
   p.locator('.bio-steps button').nth(3).click();note=f'S6 genuine independent Chromium L{n:03}: 我根据证据解释了模型。';p.locator('.bio-finish textarea').fill(note);p.get_by_role('button',name='Finish lesson & save discoveries ✓',exact=True).click();assert p.get_by_text('Lesson complete',exact=False).is_visible();p.reload();p.wait_for_load_state('networkidle');assert p.locator('.bio-finish textarea').input_value()==note
   p.get_by_role('link',name='Notebook',exact=True).first.click();p.locator('.bio-notes').wait_for();assert note in p.locator('.bio-notes article').filter(has_text=f'L{n:03} /').inner_text();p.reload();p.wait_for_load_state('networkidle');assert note in p.locator('.bio-notes article').filter(has_text=f'L{n:03} /').inner_text()
   p.goto(f'{BASE}/biology/review');p.wait_for_load_state('networkidle');p.locator('.bio-question').wait_for();assert f'L{n:03}' in p.locator('.bio-challenge-wrap a').get_attribute('href');p.locator('.bio-question .bio-options button').nth(correct[f'L{n:03}-q1']).click();p.get_by_role('button',name='Check & explain →',exact=True).click();assert 'That evidence fits.' in p.locator('.bio-feedback').inner_text();p.reload();p.wait_for_load_state('networkidle');data=p.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))');a=data['answers'][f'L{n:03}-q1'];assert a['choice']==correct[f'L{n:03}-q1'] and a['first']!=a['choice'];R['flows'].append({'lesson':n,'prediction':True,'actualManipulation':True,'fourUIQuestions':True,'noteSavedAndReloaded':True,'notebookVisibleAndReloaded':True,'recallCorrectedReloadedFirstWrongRetained':True});print('PASS FLOW',n,flush=True);record()
  except Exception as e:failure(p,'flows',n,e)
with sync_playwright() as pw:
 browser=context=p=None
 R['sourceStart']=source_info();R['startedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z')
 try:
  browser=pw.chromium.launch(headless=True,executable_path=r'C:\Users\Administrator\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe');context=browser.new_context(viewport={'width':1366,'height':950});p=context.new_page();p.set_default_timeout(12000)
  p.on('response',lambda r:R.setdefault('badResponses',[]).append({'status':r.status,'url':r.url}) if r.status>=400 else None);p.on('pageerror',lambda e:R['errors'].append({'type':'pageerror','text':str(e)}));p.on('console',lambda e:R['errors'].append({'type':'console','text':e.text,'location':e.location}) if e.type=='error' else None)
  if PHASE=='discover':discover(p)
  else:
   R['errors']=[];R['badResponses']=[];R['sourceStart']=source_info();R['startedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z');R['isolatedContext']=True
   if PHASE in ['all','labs','layouts','refresh']:
    if PHASE=='refresh':
     targets=[int(x) for x in sys.argv[2].split(',')];R['labs']=[x for x in R['labs'] if x['lesson'] not in targets];R['layouts']=[x for x in R['layouts'] if x['lesson'] not in targets];R['screens']=[x for x in R['screens'] if x['lesson'] not in targets];R['svgIssues']=[x for x in R['svgIssues'] if x['lesson'] not in targets];R['failures']=[x for x in R['failures'] if x['lesson'] not in targets];R.setdefault('targetedCertifications',[]).append({'lessons':targets,'scope':'Fresh genuine controls/branches/all frames, every 1366/390 EN/bilingual initial/final/predict/reflect, three-language initial SVG, local-scroll accessibility and screenshots. Supersedes archived tests for these lessons only.'})
    if PHASE in ['all','labs']:R['labs']=[]
    if PHASE in ['all','layouts']:R['layouts']=[];R['screens']=[];R['svgIssues']=[]
    R['failures']=[x for x in R['failures'] if x['phase'] not in (['labs','layouts'] if PHASE=='all' else [PHASE])]
    for width in ([1366] if PHASE=='labs' else [1366,390]):
     p.set_viewport_size({'width':width,'height':950 if width==1366 else 844})
     for n in ([int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else range(121,145)):
      try:
       visit(p,n);l=explore(p)
       if PHASE in ['all','layouts','refresh']:
        for m in ['中','EN','双语']:
         mode(p,m);svg_check(p,n,m,width,'initial-three-language')
        for m in ['EN','双语']:layout(p,l,n,width,m,'initial')
       mode(p,'EN');ev=manipulate(p,l,n)
       if width==1366 and PHASE in ['all','labs','refresh']:
        play=playback(p,l,n);R['labs'].append({'lesson':n,'scientificChecks':ev,'playback':play});print('PASS LAB',n,flush=True);record()
       if PHASE in ['all','layouts','refresh']:
        end(p,l)
        for m in ['EN','双语']:layout(p,l,n,width,m,'manipulated-final')
        for step,label in [(0,'predict'),(3,'reflect')]:
         p.locator('.bio-steps button').nth(step).click()
         for m in ['EN','双语']:layout(p,l,n,width,m,label,step)
        print('PASS LAYOUT',width,n,flush=True)
      except Exception as e:failure(p,'labs' if PHASE=='labs' else 'layouts',n,e)
   if PHASE in ['all','flows']:
    targets=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else [121,125,129,133,137,141];R['flows']=[x for x in R['flows'] if x['lesson'] not in targets];R['failures']=[x for x in R['failures'] if x['phase']!='flows' or x['lesson'] not in targets];p.set_viewport_size({'width':1366,'height':950});flows(p)
   if PHASE=='contentproofs':
    R['contentProofs']=[];R['curveProofs']=[]
    for n in range(121,145):
     visit(p,n);l=explore(p);end(p,l)
     for m in ['EN','双语']:
      mode(p,m)
      curves=l.locator('polyline').evaluate_all("es=>es.map(e=>({points:e.getAttribute('points'),stroke:getComputedStyle(e).stroke,width:parseFloat(getComputedStyle(e).strokeWidth),opacity:parseFloat(getComputedStyle(e).opacity)}))")
      assert all(c['stroke']!='none' and c['width']>0 and c['opacity']>0 for c in curves),curves
      R['curveProofs'].append({'lesson':n,'mode':m,'computedPolylines':curves})
      p.get_by_role('button',name='Explanation' if m=='EN' else '理解线索',exact=True).click()
      source=p.evaluate("async id=>(await import('/src/content.ts')).section(id,'Explain').en",f'L{n:03}')
      last=source.strip().split('\n\n')[-1];last=re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',last);last=re.sub(r'[*_`#]','',last)
      actual=p.locator('.bio-explanation > .bio-prose').first.inner_text();normal=lambda x:re.sub(r'\s+',' ',x).strip()
      assert normal(last) in normal(actual),(n,m,last,actual)
      R['contentProofs'].append({'lesson':n,'mode':m,'lastEnglishParagraphActuallyRendered':last,'sourceEnglishChars':len(source)})
      p.get_by_role('button',name='Interactive model' if m=='EN' else '操作模型',exact=True).click()
     record()
   if PHASE=='visuals':
    for n in ([int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else [121,125,127,128,129,130,131,132,137,138,140,143,144]):
     visit(p,n);l=explore(p);manipulate(p,l,n)
     for m in ['EN','双语']:
      mode(p,m);name=f'visual-L{n}-{m}.png';l.locator('svg').screenshot(path=str(OUT/name));R['screens'].append({'lesson':n,'width':1366,'mode':m,'state':'visual-scientific-final','path':str(OUT/name),'classification':'manual-candidate'})
     record()
   if PHASE in ['all','routes']:
    R['failures']=[x for x in R['failures'] if x['phase']!='routes']
    try:route_resets(p)
    except Exception as e:failure(p,'routes',0,e)

 except BaseException as e:
  failure(p,PHASE,0,e)
 finally:
  if PHASE!='discover':R['coverageSupplement']={'scope':'24 genuine activities; 6 complete learning/notebook/recall flows, separate from graduation project','finalScreensAreManifestOnly':True,'productionStorageAccessed':False,'allContextsClosedByFinally':True}
  if PHASE=='discover':R['status']='discovered' if len(R['discovery'])==24 and not R['errors'] else 'partial-or-failed'
  else:
   R['sourceEnd']=source_info();R.setdefault('sourceHistory',[]).append({'phase':PHASE,'startedAt':R['startedAt'],'finishedAt':time.strftime('%Y-%m-%dT%H:%M:%S%z'),'start':R['sourceStart'],'end':R['sourceEnd'],'changed':[k for k in set(R['sourceStart'])|set(R['sourceEnd']) if R['sourceStart'].get(k)!=R['sourceEnd'].get(k)]});R['sourceUnchangedDuringRun']=R['sourceStart']==R['sourceEnd'];R['finishedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z');R['coverage']={'activities':len(R['labs']),'staticActivities':sum(x['lesson'] in STATIC for x in R['labs']),'processActivities':sum(x['lesson'] not in STATIC for x in R['labs']),'layoutStates':len(R['layouts']),'finalRunScreenshots':len(R['screens']),'completeLessonRecallNoteFlows':len(R['flows']),'routeResetPairs':len(R.get('routeResets',[]))};R['status']='passed' if len(R['labs'])==24 and len(R['layouts'])==384 and len(R['flows'])==6 and len(R.get('routeResets',[]))==5 and not R['failures'] and not R['errors'] and not R['svgIssues'] and R['sourceUnchangedDuringRun'] else 'partial-or-failed'
  record()
  if context is not None:context.close()
  if browser is not None:browser.close()
print(json.dumps({'status':R['status'],'coverage':R.get('coverage'),'failures':len(R['failures']),'errors':len(R['errors']),'svgIssues':len(R['svgIssues'])}),flush=True)
sys.exit(0 if R['status'] in ['discovered','passed'] else 1)
