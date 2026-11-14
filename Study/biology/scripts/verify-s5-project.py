"""Independent actual Chromium S05 report, six missions and SVG regression.
Uses existing 127.0.0.1:3460 only; never starts/stops a server. All S05 report,
mission, question, export interactions are UI. Only old-record factories and
lesson completion counts for isolated stage-gating boundary probes are seeded.
"""
from playwright.sync_api import sync_playwright
import json,pathlib,sys,traceback,urllib.parse,xml.etree.ElementTree as ET,math
sys.stdout.reconfigure(encoding='utf-8')
OUT=pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s5\project');OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];screenshots=[];exports=[];geometries=[];scope_done=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'pass':bool(ok),'detail':detail});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def compact(s):return ''.join(s.split())
if '--render-existing' in sys.argv:
 with sync_playwright() as pw:
  br=pw.chromium.launch(headless=True);co=br.new_context(viewport={'width':1366,'height':950});reports=[]
  try:
   for path in sorted(OUT.glob('*.svg')):
    pg=co.new_page()
    try:
     pg.goto(path.as_uri());pg.wait_for_load_state('load');bounds=pg.locator('svg').first.evaluate('root=>[...root.querySelectorAll("text,circle,rect,line")].map(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return {text:e.textContent,tag:e.tagName,bad:b.x<v.x-.7||b.y<v.y-.7||b.x+b.width>v.x+v.width+.7||b.y+b.height>v.y+v.height+.7}})');check(path.stem+' final rerender all geometry fits',not any(x['bad'] for x in bounds),[x for x in bounds if x['bad']]);reports.append({'path':str(path),'items':len(bounds),'overflow':[x for x in bounds if x['bad']]})
     if 'END OF REPORT' in pg.locator('svg').first.text_content():
      texts=pg.locator('text').evaluate_all('(es)=>es.map(e=>({text:e.textContent,y:e.getBoundingClientRect().y+scrollY}))');positions=[('opening',0),('graph',100),('raw-middle',next(x['y'] for x in texts if x['text'].startswith('A-1 |'))-120),('student-middle',next(x['y'] for x in texts if x['text']=='mechanism')-120),('challenge-field',next(x['y'] for x in texts if x['text']=='challenge')-120),('last-fields',max(0,texts[-1]['y']-740))]
      for part,y in positions:
       pg.evaluate('(y)=>scrollTo(0,y)',y);pg.wait_for_timeout(200);dest=OUT/(path.stem+'-'+part+'.png');pg.screenshot(path=str(dest));screenshots.append(str(dest))
    finally:pg.close()
  except Exception as e:errors.append(str(e));traceback.print_exc()
  finally:co.close();br.close()
  res={'complete':not errors and all(x['pass'] for x in checks),'checks':checks,'passed':sum(x['pass'] for x in checks),'total':len(checks),'errors':errors,'geometry':reports,'screenshots':screenshots,'browser_context_closed':True,'server_started_or_stopped':False,'scope':'Actual final rerender of every downloaded SVG, own-viewBox text/shape bounds, and repaint-settled segmented screenshots of each long report.'};(OUT/'final-export-render-summary.json').write_text(json.dumps(res,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in res.items() if k not in ['checks','geometry','screenshots']},ensure_ascii=False))
 sys.exit(0 if res['complete'] else 1)

if '--missions-layout-only' in sys.argv:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True);context=browser.new_context(viewport={'width':1366,'height':844});pg=context.new_page();pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  try:
   for unit in ['U27','U28']:
    pg.goto('http://127.0.0.1:3460/biology/notebook?unit='+unit);pg.wait_for_load_state('networkidle')
    if '--probe-min-width' in sys.argv:pg.add_style_tag(content='.bio-mission-form > * {min-width:0}')
    for width in [1366,390]:
     pg.set_viewport_size({'width':width,'height':844})
     for lang in ['EN','双语']:
      pg.get_by_role('button',name=lang,exact=True).click();prefix=f'final-{unit}-{width}-'+('en' if lang=='EN' else 'bi');area=pg.locator('.bio-mission-form');dia=area.locator('.bio-mission-diagram');dia.scroll_into_view_if_needed()
      check(prefix+' no global horizontal overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),pg.evaluate('({page:document.documentElement.scrollWidth,width:innerWidth,wide:[...document.querySelectorAll("body *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,30).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,60),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width}))})'))
      regions=dia.locator('[role=region][tabindex="0"]').filter(has=pg.locator('svg'))
      check(prefix+' SVG has named focusable local scroll',regions.count()>0 and all(regions.nth(i).get_attribute('aria-label') for i in range(regions.count())))
      controls=area.locator('button,input,select,textarea').evaluate_all('(es)=>es.filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))');check(prefix+' visible control targets at least44px',all(x['w']>=43.9 and x['h']>=43.9 for x in controls),controls)
      for i in range(regions.count()):
       reg=regions.nth(i);reg.focus();reg.evaluate('(e)=>e.scrollLeft=0');pg.keyboard.press('ArrowRight');pg.wait_for_timeout(150);xy=reg.evaluate('(e)=>({scroll:e.scrollLeft,overflow:e.scrollWidth>e.clientWidth})');check(prefix+f' region{i} arrows scroll if overflowing',not xy['overflow'] or xy['scroll']>0,xy)
       for side,scroll in [('left',0),('right',100000)]:
        reg.evaluate('(e,x)=>e.scrollLeft=x',scroll);target=OUT/(prefix+'-'+side+'.png');reg.screenshot(path=str(target));screenshots.append(str(target))
      boxes=dia.locator('svg').evaluate_all('es=>es.flatMap(s=>[...s.querySelectorAll("text,rect,circle,line")].map(e=>{const b=e.getBBox(),v=s.viewBox.baseVal;return {tag:e.tagName,text:e.textContent,x:b.x,y:b.y,w:b.width,h:b.height,view:[v.x,v.y,v.width,v.height],bad:b.x<v.x-.7||b.y<v.y-.7||b.x+b.width>v.x+v.width+.7||b.y+b.height>v.y+v.height+.7}}))');check(prefix+' actual SVG text and geometry in viewBox',not any(x['bad'] for x in boxes),[x for x in boxes if x['bad']]);geometries.append({'label':prefix,'items':len(boxes),'overflow':[x for x in boxes if x['bad']]})
      target=OUT/(prefix+'-workspace.png');pg.screenshot(path=str(target));screenshots.append(str(target))
   for unit in ['U06','U24']:
    pg.goto('http://127.0.0.1:3460/biology/notebook?unit='+unit);pg.wait_for_load_state('networkidle');pg.set_viewport_size({'width':390,'height':844})
    for lang in ['EN','双语']:
     pg.get_by_role('button',name=lang,exact=True).click();prefix='legacy-'+unit+'-390-'+('en' if lang=='EN' else 'bi');area=pg.locator('.bio-mission-form');area.scroll_into_view_if_needed();check(prefix+' no global horizontal overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),pg.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})'))
     cols=area.evaluate('e=>[...e.children].map(x=>({w:x.getBoundingClientRect().width,parent:e.clientWidth,form:x.tagName==="FORM"}))');check(prefix+' shared mission columns remain inside form',all(x['w']<=x['parent'] for x in cols),cols);target=OUT/(prefix+'-workspace.png');pg.screenshot(path=str(target));screenshots.append(str(target))
   check('final mission-layout console/pageerror zero',not errors,errors)
  except Exception as e:errors.append(str(e));traceback.print_exc()
  finally:context.close();browser.close()
  res={'complete':not errors and len(checks)==49 and all(x['pass'] for x in checks),'checks':checks,'passed':sum(x['pass'] for x in checks),'total':len(checks),'errors':errors,'screenshots':screenshots,'geometry':geometries,'scope':'U27 L106 and U28 L110 final source after render-polish; 1366/390 EN/bilingual; named keyboard SVG scrolling, actual text/shape BBoxes, 44px controls, no page overflow. U06/U24 legacy 390 EN/bilingual page/form-column width only, without writing records or claiming old course functional acceptance. Earlier full behavior is retained in summary.json.','browser_context_closed':True,'server_started_or_stopped':False}
  (OUT/('mission-minwidth-probe.json' if '--probe-min-width' in sys.argv else 'final-mission-layout-summary.json')).write_text(json.dumps(res,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in res.items() if k not in ['checks','screenshots','geometry']},ensure_ascii=False),flush=True)
 sys.exit(0 if res['complete'] else 1)

with sync_playwright() as p:
 b=p.chromium.launch(headless=True);c=b.new_context(viewport={'width':1366,'height':950},accept_downloads=True);page=c.new_page()
 page.on('pageerror',lambda e:errors.append('pageerror: '+str(e)));page.on('console',lambda m:errors.append('console: '+m.text) if m.type=='error' else None)
 def go(path):page.goto('http://127.0.0.1:3460/biology/'+path);page.wait_for_load_state('networkidle')
 def state():return page.evaluate('JSON.parse(localStorage.getItem("study-biology-v1"))')
 def draft():return state()['projects']['S05']
 def en():page.get_by_role('button',name='EN',exact=True).click()
 def shot(name,loc=None):
  path=OUT/(name+'.png');(loc or page).screenshot(path=str(path),**({} if loc else {'full_page':False}));screenshots.append(str(path))
 def savebutton():return page.get_by_role('button',name='Save self-reviewed report',exact=True)
 def settings(a,b_,d):
  for i,v in enumerate([a,b_,d]):page.locator('.bio-evidence select').nth(i).select_option(str(v))
 def graph():return urllib.parse.unquote(page.locator('.bio-evidence figure img').get_attribute('src').split(',',1)[1])
 def geometry(visual,label):
  result=visual.locator('svg').first.evaluate('''root=>[...root.querySelectorAll('text,circle,line,rect')].map(e=>{const b=e.getBBox(),s=e.ownerSVGElement,v=s.viewBox.baseVal;return {tag:e.tagName,text:e.textContent,x:b.x,y:b.y,w:b.width,h:b.height,view:[v.x,v.y,v.width,v.height],bad:b.x<v.x-.7||b.y<v.y-.7||b.x+b.width>v.x+v.width+.7||b.y+b.height>v.y+v.height+.7}})''')
  bad=[x for x in result if x['bad']];geometries.append({'label':label,'items':len(result),'overflow':bad});check(label+' all actual rendered text/shape BBoxes fit own viewBox',not bad,bad)
 def render_svg(path,label,report=False):
  visual=c.new_page()
  try:
   visual.goto(path.as_uri());visual.wait_for_load_state('load');geometry(visual,label)
   check(label+' no script/foreignObject active',visual.locator('script,foreignObject').count()==0)
   if report:
    texts=visual.locator('text').evaluate_all('(es)=>es.map(e=>({text:e.textContent,y:e.getBoundingClientRect().y+scrollY}))')
    positions=[('opening',0),('graph',100),('raw-middle',next(x['y'] for x in texts if x['text'].startswith('A-1 |'))-120),('student-middle',next(x['y'] for x in texts if x['text']=='mechanism')-120),('challenge-field',next(x['y'] for x in texts if x['text']=='challenge')-120),('last-fields',max(0,texts[-1]['y']-740))]
    for part,y in positions:visual.evaluate('(y)=>scrollTo(0,y)',y);visual.wait_for_timeout(150);shot(label+'-'+part,visual)
   else:shot(label,visual.locator('svg').first)
  finally:visual.close()
 def download(label,expected=None,saved=False):
  with page.expect_download() as info:page.get_by_role('link',name='Download full SVG report (draft included)',exact=True).click()
  path=OUT/(label+'.svg');info.value.save_as(str(path));exports.append(str(path));xml=path.read_text(encoding='utf-8');root=ET.fromstring(xml);texts=''.join(root.itertext())
  check(label+' actual download is safe SVG',root.tag.endswith('svg') and not any(e.tag.split('}')[-1] in ['script','foreignObject'] for e in root.iter()))
  check(label+' END retained and accurate saved/draft status','END OF REPORT / 报告结束' in texts and (('Draft / 草稿' not in texts) if saved else 'Draft / 草稿' in texts))
  check(label+' all 20 raw IDs and five summaries',all(f'{block}-{n} | {block} |' in texts for block in 'ABCD' for n in range(1,6)) and all(f'{x:.1f} |' in texts for x in [0,.2,.4,.6,.8]) and 'Summary: external' in texts)
  check(label+' protocol assumptions captions calculations citations checks fields retained',all(x in texts for x in ['Protocol /','Assumptions and limits','中文图注','English caption','Percentage practice','Citations /','S05-Q6','Self-review','Graph settings','claim','mechanism','limitation','alternative','variable','measured','timing','controls','repeats','challenge']))
  if expected:check(label+' all student text preserved without truncation',all(compact(v) in compact(texts) for v in expected.values()),{'lengths':{k:len(v) for k,v in expected.items()}})
  render_svg(path,label,True);return texts
 def outcome():return page.evaluate('''async()=>{const m=await import('/src/progress.ts');return m.evidenceStageOutcome(JSON.parse(localStorage.getItem(m.STORAGE_KEY)))}''')
 def seed_count(n):
  page.evaluate('''n=>{const x=JSON.parse(localStorage.getItem('study-biology-v1'));for(let i=97;i<=120;i++){delete x.sessions['L'+String(i).padStart(3,'0')];if(i<97+n)x.sessions['L'+String(i).padStart(3,'0')]={step:3,note:'isolated boundary fixture, not a lesson UI claim',completedAt:1}}localStorage.setItem('study-biology-v1',JSON.stringify(x))}''',n);page.reload();page.wait_for_load_state('networkidle')
 try:
  go('project/S05');en();(OUT/'initial-dom.txt').write_text(page.locator('.bio-evidence').inner_text(),encoding='utf-8')
  check('discovered true report controls',page.locator('.bio-evidence input[type=text]').count()==2 and page.locator('.bio-evidence select').count()==5 and page.locator('.bio-evidence textarea').count()==11 and page.locator('.bio-evidence-question').count()==6)
  page.evaluate('''async()=>{const [pr,s1,s2,s3,s4]=await Promise.all([import('/src/progress.ts'),import('/src/project.ts'),import('/src/leafProject.ts'),import('/src/ecoProject.ts'),import('/src/storyProject.ts')]);const x=pr.emptyProgress();for(let i=1;i<=96;i++)x.sessions['L'+String(i).padStart(3,'0')]={step:3,note:'old lesson sentinel '+i,completedAt:1};x.mission={object:'old default object',evidence:'old default evidence',reasoning:'old default reasoning',savedAt:1};for(let i=2;i<=24;i++)x.missions['U'+String(i).padStart(2,'0')]={object:'old unit '+i,evidence:'old numerical evidence '+i,reasoning:'old paired reasoning '+i,savedAt:1};x.projects.S01=s1.emptyProject();x.projects.S01.records[0].evidence='S01 deep record <& 中文';x.projects.S01.zh='旧S01部分草稿';x.projects.S01.answers[s1.stageQuestions[0].id]=1;x.projects.S02=s2.emptyLeafProject();x.projects.S02.routes.water.note='S02 deep route 中文';x.projects.S02.answers[s2.leafStageQuestions[0].id]=1;x.projects.S03=s3.emptyEcoProject();x.projects.S03.claim='Old S03 claim 中文';x.projects.S03.answers[s3.ecoStageQuestions[0].id]=1;x.projects.S04=s4.emptyStoryProject();x.projects.S04.answers[s4.storyStageQuestions[0].id]=1;const sc=x.projects.S04.cases.plant;sc.frames=sc.frames.map((f,i)=>({zh:'旧S04已保存深层图注 '+i,en:'old frame '+i}));for(const k of ['observation','assumptions','chain','variable','measured','controls','challenge','zh'])sc[k]='old saved S04 '+k;sc.citations=s4.storyEvidence('plant',sc.input).slice(0,2).map(r=>r.id);sc.savedAt=1;x.projects.S04.cases.enzyme.frames[2].zh='旧S04未保存酶稿深层内容';localStorage.setItem(pr.STORAGE_KEY,JSON.stringify(x));}''')
  page.reload();page.wait_for_load_state('networkidle');baseline=state();(OUT/'old-baseline.json').write_text(json.dumps(baseline,ensure_ascii=False,indent=2),encoding='utf-8');check('version-one key and valid old S04 saved/draft sentinels survive initial decode',baseline['version']==1 and baseline['projects']['S04']['cases']['plant'].get('savedAt')==1 and '深层' in baseline['projects']['S04']['cases']['enzyme']['frames'][2]['zh'])
  check('96 old lessons and 24 old missions do not count S05',outcome()=={'lessons':0,'missions':0,'complete':False},outcome())
  check('empty draft cannot save',savebutton().is_disabled());download('empty-wrong-settings-draft')
  rows=page.locator('.bio-evidence table').nth(0).locator('tbody tr').evaluate_all('(es)=>es.map(e=>[...e.children].map(x=>x.textContent))')
  check('20 independent raw IDs four blocks five concentrations paired masses',len(rows)==20 and len({r[0] for r in rows})==20 and {r[1] for r in rows}==set('ABCD') and all(len([r for r in rows if r[2]==strval])==4 for strval in ['0.0','0.2','0.4','0.6','0.8']))
  vals={r[0]:(float(r[4])-float(r[3]))/float(r[3])*100 for r in rows}
  check('each displayed percentage independently recomputed from paired initial denominator',all(abs(vals[r[0]]-float(r[5]))<=.00501 for r in rows),vals)
  summaries=page.locator('.bio-evidence table').nth(1).locator('tbody tr').evaluate_all('(es)=>es.map(e=>[...e.children].map(x=>x.textContent))')
  calc=[]
  for r in summaries:
   v=[vals[x[0]] for x in rows if x[2]==r[0]];calc.append({'c':r[0],'mean':sum(v)/4,'min':min(v),'max':max(v),'n':len(v)})
  check('five summaries are mean of individual percentages with actual min max n4',len(calc)==5 and all(abs(float(r[1])-d['mean'])<=.00501 and abs(float(r[2])-d['min'])<=.00501 and abs(float(r[3])-d['max'])<=.00501 and int(r[4])==d['n']==4 for r,d in zip(summaries,calc)),calc)
  check('four biological blocks pairing protocol resolution and scientific assumptions visible',all(x in page.locator('.bio-evidence').inner_text() for x in ['only four biological blocks','not 20 tubers or 40','balance resolution 0.01 g','not a confidence interval','neither an exact intracellular']))
  inputs=page.locator('.bio-evidence input[type=text]')
  for i,bad,good in [(0,str(.09/3.09*100),'3'),(1,'5','-5')]:
   inputs.nth(i).fill(bad);feedback=inputs.nth(i).locator('..').inner_text();check(f'calculation {i+1} incorrect denominator/sign gives explanatory feedback','Do not divide by final mass; loss needs a minus sign' in feedback and '÷ 3.00 × 100' in feedback,feedback)
   shot('calculation-'+str(i+1)+'-feedback',inputs.nth(i).locator('..'));inputs.nth(i).fill(good);check(f'calculation {i+1} corrected UI accepted','Correct: the initial mass' in inputs.nth(i).locator('..').inner_text())
  for label,a,y,d,needle,zh in [('categories',1,0,0,'Cup category','杯子类别'),('raw-grams',0,1,0,'Raw mass difference (g)','原始质量差'),('mean-only',0,0,1,'Mean only','只显示方块均值')]:
   settings(a,y,d);xml=graph();root=ET.fromstring(xml);texts=''.join(root.itertext());caption=page.locator('figcaption').inner_text();check(label+' real graph changes with actual bilingual caption',needle in texts and zh in caption and 'DRAFT TO REPAIR' in caption,caption)
   if label=='raw-grams':
    gramcircles=root.findall('.//{*}circle');check('raw-grams actual per-strip geometry and labels match paired gram differences',len(gramcircles)==20 and all(abs(float(e.get('cy'))-(85+(16-(float(next(r for r in rows if r[0]==e.find('{*}title').text.split(':')[0])[4])-float(next(r for r in rows if r[0]==e.find('{*}title').text.split(':')[0])[3]))/.03)/40*300))<.0001 for e in gramcircles))
   if label=='mean-only':check('means-only removes raw points and ranges',len(root.findall('.//{*}circle'))==0 and len(root.findall('.//{*}rect'))==6)
   path=OUT/(label+'-graph.svg');path.write_text(xml,encoding='utf-8');render_svg(path,label+'-graph');download(label+'-draft')
  settings(0,0,0);xml=graph();root=ET.fromstring(xml);text=''.join(root.itertext());circles=root.findall('.//{*}circle');rects=root.findall('.//{*}rect');ranges=[e for e in root.findall('.//{*}line') if e.get('x1')==e.get('x2') and e.get('stroke')=='#256b68']
  check('correct graph exactly 20 raw points five means five min-max bars',len(circles)==20 and len(rects)-1==5 and len(ranges)==5,{'raw':len(circles),'means':len(rects)-1,'ranges':len(ranges)})
  check('correct graph signed zero axis title and bilingual caption',all(x in text for x in ['-20','-10','0','10','Mass change (%)','External sucrose concentration']) and root.find('{*}title').text=='External sucrose concentration and potato mass change after 60 min' and 'Circles are paired-strip values' in page.locator('figcaption').inner_text() and '竖线为min–max范围' in page.locator('figcaption').inner_text())
  expected_y=lambda v:85+(16-v)/40*300
  check('graph point geometry matches independently calculated percentages',all(abs(float(e.get('cy'))-expected_y(vals[e.find('{*}title').text.split(':')[0]]))<.0001 for e in circles))
  check('graph mean and minmax geometry matches raw calculations',all(abs(float(rects[i+1].get('y'))+4-expected_y(d['mean']))<.0001 and abs(float(ranges[i].get('y1'))-expected_y(d['min']))<.0001 and abs(float(ranges[i].get('y2'))-expected_y(d['max']))<.0001 for i,d in enumerate(calc)))
  path=OUT/'correct-graph.svg';path.write_text(xml,encoding='utf-8');render_svg(path,'correct-graph')
  cites=page.locator('.bio-evidence select');cites.nth(3).select_option('mean-0.2');cites.nth(4).select_option('mean-0.4')
  fields=['claim','mechanism','limitation','alternative','variable','measured','timing','controls','repeats','challenge'];prose=[
   '在二十二度六十分钟条件下，外液浓度升高，条的净质量变化由正变负；两组平均值约正百分之四和负百分之四。',
   '选择透过膜两侧水势差可驱动水的净移动；假设蔗糖在这段时间近似不透膜且其他净质量变化可忽略。',
   '零交点只是本条件下外液零净质量变化的估计，不能认定胞内浓度或达到平衡；范围是观测最小最大值不是置信区间。',
   '擦干差异、组织损伤或溶质移动都可能影响称重；可统一擦干并增加独立块茎检查替代解释。',
   '只改变外液蔗糖浓度，在原来零交点附近设置更多均匀的浓度水平。',
   '用相同天平记录每条初终质量，单位为克，并将配对差换算为百分比变化。',
   '分别在零分钟、三十分钟、六十分钟和一百二十分钟测量，并保留每条身份。',
   '温度、每杯体积、名义尺寸、批次与擦干方法保持相同，以原始未改变条件为比较基准。',
   '至少增加四个独立块茎，每个块内随机分配五种浓度，各条独立杯并保留配对身份。',
   '如果更长时间下零交点明显漂移或方向逆转，就挑战六十分钟已平衡以及单一渗透机制解释。最终挑战字段完整保留。']
  for i,v in enumerate(prose):page.locator('.bio-evidence textarea').nth(i).fill(v)
  check('self-review is a real save gate before review',savebutton().is_disabled());page.get_by_role('checkbox').check()
  for i,key in enumerate(fields):
   page.locator('.bio-evidence textarea').nth(i).fill('七字符不足');check(key+' under-eight characters cannot save',savebutton().is_disabled());page.locator('.bio-evidence textarea').nth(i).fill(prose[i])
  cites.nth(4).select_option('mean-0.2');check('duplicate otherwise-valid citations cannot save',savebutton().is_disabled());cites.nth(4).select_option('mean-0.4')
  check('Chinese-only ten scientific fields optional second language blank can save',savebutton().is_enabled() and page.locator('.bio-evidence textarea').nth(10).input_value()=='')
  page.get_by_text('One model argument and manual self-review rubric',exact=True).click();check('manual rubric and no automatic prose grading accurately described','You and a teacher assess prose quality' in page.locator('.bio-evidence').inner_text() and 'do not establish significance' in page.locator('.bio-evidence').inner_text())
  before=draft();page.reload();page.wait_for_load_state('networkidle');check('autosaved report survives reload',draft()==before);page.get_by_role('button',name='双语',exact=True).click();check('language switch retains all scientific fields',draft()==before);en();savebutton().click();check('structure save marker accepted Chinese-only report',bool(draft().get('savedAt')))
  check('saved report alone never completes S05',not outcome()['complete']);download('saved-chinese-report',dict(zip(fields,prose)),True)
  cards=page.locator('.bio-evidence-question');correct=[1,0,2,1,0,2]
  for i in range(6):
   card=cards.nth(i);card.locator('.bio-options button').nth((correct[i]+1)%3).click();card.get_by_role('button',name='View explanation →',exact=True).click();check('cross-unit question '+str(i+1)+' wrong produces substantive feedback','There is a clue to revisit' in card.inner_text() and card.get_by_role('link',name='Revisit the related lesson ↗',exact=True).get_attribute('href').endswith(['L099','L101','L106','L110','L116','L119'][i]))
   if i==4:check('health question explains denominator and confounding','Compare risks and study design; association alone does not rule out confounding' in card.inner_text());shot('denominator-question-feedback',card)
   if i!=5:
    card.get_by_role('button',name='Think again',exact=True).click();card.locator('.bio-options button').nth(correct[i]).click();card.get_by_role('button',name='View explanation →',exact=True).click();check('cross-unit question '+str(i+1)+' corrected after feedback','You identified the evidence' in card.inner_text())
  check('all six answered five correct retained and edits clear save marker',len(draft()['answers'])==6 and sum(draft()['answers'].get('S05-Q'+str(i+1))==correct[i] for i in range(6))==5 and not draft().get('savedAt'))
  scope_done.append('report data calculations graph gates autosave Chinese-only save six questions wrong feedback and five corrections')
  # Six notebook representative interactives and real CER persistence, isolated per unit.
  mission_expected={}
  for u in range(25,31):
   unit=f'U{u}';go('notebook?unit='+unit);en();area=page.locator('.bio-mission-form');diagram=area.locator('.bio-mission-diagram');beforetxt=diagram.inner_text();(OUT/(unit+'-dom.txt')).write_text(area.inner_text(),encoding='utf-8')
   links=diagram.locator('nav a').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))');expected_links=['/biology/lesson/L'+str(i).zfill(3) for i in range(97+(u-25)*4,101+(u-25)*4)]
   check(unit+' links all four own-unit lessons',links==expected_links,links)
   if u==25:
    diagram.get_by_role('button',name='−0.8 MPa',exact=True).click();check(unit+' osmosis control changes actual net direction','Initial net direction: out of cell' in diagram.inner_text());diagram.get_by_role('button',name='Animal cell',exact=True).click();diagram.get_by_role('button',name='Next step',exact=True).click();check(unit+' animal cell scenario and playback change',diagram.inner_text()!=beforetxt and '2 / 4' in diagram.inner_text())
   elif u==26:
    diagram.get_by_role('button',name='Upstream 8, downstream 12',exact=True).click();check(unit+' reverse pressure closes model valve','closes' in diagram.inner_text());diagram.get_by_role('button',name='Next step',exact=True).click();check(unit+' circulation playback updates','2 / 10' in diagram.inner_text())
   elif u==27:
    slider=diagram.locator('input[type=range]').nth(0);slider.focus();page.keyboard.press('End')
    for _ in range(20):page.keyboard.press('ArrowLeft')
    check(unit+' humidity 80 changes loss to2 uptake2.4','Loss: 2 relative units' in diagram.inner_text() and 'Uptake: 2.4' in diagram.inner_text(),diagram.inner_text())
   elif u==28:
    diagram.get_by_role('combobox').select_option('rna');diagram.get_by_role('button',name='Next step',exact=True).click();diagram.get_by_role('button',name='Next step',exact=True).click();check(unit+' functional RNA path actual response','Functional RNA' in diagram.inner_text() and '3 / 4' in diagram.inner_text(),diagram.inner_text())
   elif u==29:
    diagram.get_by_role('button',name='50 people',exact=True).click();check(unit+' denominator 50 changes actual risk20pct','A: 10/50 → 20%' in diagram.inner_text());diagram.get_by_role('button',name='A originally 200; 30 missing',exact=True).click();check(unit+' missingness scenario displays 10of170 and 5to20 bounds','10/170' in diagram.inner_text() and '5%–20%' in diagram.inner_text())
   else:
    diagram.get_by_role('button',name='Unverified: 8,9,28,9 cm',exact=True).click();diagram.get_by_role('checkbox').check();diagram.get_by_role('button',name='Check records/units/method; retain and report influence',exact=True).click();check(unit+' outlier changes actual mean13.5 range20','Current first mean 13.5 cm, range 20 cm' in diagram.inner_text());check(unit+' report linked',diagram.get_by_role('link',name='Create the biology evidence report →',exact=True).get_attribute('href')=='/biology/project/S05')
   text=[unit+'主张：代表模型给出有条件判断，需结合本单元其他课程。',unit+'证据：保留数值、单位、配对身份和条件，区分模型与观测。',unit+'推理：机制有假设并需独立重复和反驳结果验证。']
   for i,v in enumerate(text):area.locator('textarea').nth(i).fill(v)
   page.get_by_role('button',name='Save my evidence ✓',exact=True).click();check(unit+' real CER saves and marked',bool(state()['missions'][unit].get('savedAt')) and 'Evidence note recorded' in area.inner_text())
   area.locator('textarea').nth(2).fill(text[2]+'修订');check(unit+' editing clears saved marker',not state()['missions'][unit].get('savedAt'));page.reload();page.wait_for_load_state('networkidle');check(unit+' edited CER autosave reload survives',area.locator('textarea').nth(2).input_value()==text[2]+'修订');page.get_by_role('button',name='Save my evidence ✓',exact=True).click();mission_expected[unit]=state()['missions'][unit];shot(unit+'-mission',area)
   check(unit+' previous unit notes untouched',all(state()['missions'][key]==val for key,val in mission_expected.items()))
  scope_done.append('six mission interactives lesson links actual CER save edit reload and per-unit isolation')
  go('project/S05');en();check('six saved missions counted with no own lessons',outcome()['missions']==6 and outcome()['lessons']==0 and not outcome()['complete']);savebutton().click()
  # Independent stage-gating matrix uses fixture counts, with all report/mission work above done through UI.
  seed_count(23);check('23 own lessons cannot complete despite report six missions 5of6',not outcome()['complete'] and outcome()['lessons']==23)
  seed_count(24);check('24 own lessons six missions saved report all answered five correct completes',outcome()['complete'],outcome())
  # Remove one real saved mission fixture temporarily to prove six, then restore exactly.
  snapshot=state();page.evaluate('''()=>{const x=JSON.parse(localStorage.getItem('study-biology-v1'));delete x.missions.U30.savedAt;localStorage.setItem('study-biology-v1',JSON.stringify(x))}''');page.reload();page.wait_for_load_state('networkidle');check('five own missions insufficient',outcome()['missions']==5 and not outcome()['complete']);page.evaluate('x=>localStorage.setItem("study-biology-v1",JSON.stringify(x))',snapshot);page.reload();page.wait_for_load_state('networkidle')
  # UI edit of question proves saved marker invalidation; fewer correct threshold and all answered threshold.
  card=page.locator('.bio-evidence-question').nth(0);card.get_by_role('button',name='Think again',exact=True).click();card.locator('.bio-options button').nth(0).click();card.get_by_role('button',name='View explanation →',exact=True).click();savebutton().click();check('all answered but four correct insufficient',not outcome()['complete'])
  card.get_by_role('button',name='Think again',exact=True).click();card.locator('.bio-options button').nth(1).click();card.get_by_role('button',name='View explanation →',exact=True).click();savebutton().click();snapshot=state();page.evaluate('''()=>{const x=JSON.parse(localStorage.getItem('study-biology-v1'));delete x.projects.S05.answers['S05-Q6'];localStorage.setItem('study-biology-v1',JSON.stringify(x))}''');page.reload();page.wait_for_load_state('networkidle');check('five correct but sixth unanswered insufficient',not outcome()['complete']);page.evaluate('x=>localStorage.setItem("study-biology-v1",JSON.stringify(x))',snapshot);page.reload();page.wait_for_load_state('networkidle')
  page.locator('.bio-evidence textarea').nth(0).fill(prose[0]+'修订');check('editing saved report revokes savedAt and stage completion',not draft().get('savedAt') and not outcome()['complete']);savebutton().click();check('revised report resave restores stage completion',bool(draft().get('savedAt')) and outcome()['complete']);prose[0]+='修订'
  before=state();page.reload();page.wait_for_load_state('networkidle');after=state();(OUT/'after-state.json').write_text(json.dumps(after,ensure_ascii=False,indent=2),encoding='utf-8');check('reload preserves all old S1toS4 deep records answers drafts saved S04 marker',all(after['projects'][key]==baseline['projects'][key] for key in ['S01','S02','S03','S04']) and after['mission']==baseline['mission'] and all(after['missions'][key]==val for key,val in baseline['missions'].items()));check('v1 storage key stays unchanged and no S05 migration key',page.evaluate('Object.keys(localStorage).filter(x=>x.includes("biology"))')==['study-biology-v1'])
  scope_done.append('stage matrix old-stage exclusion 23vs24 lessons 5vs6 missions five-correct-all-answered saved-state edits and old S1-S4 deep compatibility')
  download('full-saved-report',dict(zip(fields,prose)),True)
  # Long mixed English, Chinese, unbroken Ws, URL and literal markup through UI; actual downloads render.
  long_values=dict(zip(fields,prose));long_values['claim']='Normal English scientific prose. '+('Water potential changes net movement under the stated conditions; uncertainty remains. '*30)+' student<script>alert(1)</script>& "quote" END ENGLISH'
  long_values['mechanism']=('选择透过膜水势差驱动水的净移动；这些是可检验的条件与假设。'*100)+'中文最后字段'
  long_values['limitation']='W'*1500+' https://example.invalid/'+('LongURLsegment'*100)+' URL-END'
  long_values['challenge']=prose[-1]+' FINAL CHALLENGE END 最终反驳字段 <script>&'
  for i,key in enumerate(fields):page.locator('.bio-evidence textarea').nth(i).fill(long_values[key])
  check('long UI edit still draft and not stage complete',not draft().get('savedAt') and not outcome()['complete']);download('long-unsafe-text-draft',long_values,False);check('download is not stage completion',not outcome()['complete']);savebutton().click();download('long-full-saved-report',long_values,True)
  scope_done.append('actual SVG empty wrong-categories raw-grams mean-only complete Chinese and long mixed-language safety exports rendered bbox geometry plus opening graph data end screenshots')
  # Responsive EN and bilingual data/graph/writing/feedback screens, target and local scroll checks.
  for width in [1366,390]:
   page.set_viewport_size({'width':width,'height':844})
   for lang in ['EN','双语']:
    page.get_by_role('button',name=lang,exact=True).click();prefix=f'{width}-'+('en' if lang=='EN' else 'bi')
    check(prefix+' report no page horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'),page.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})'))
    sizes=page.locator('.bio-evidence button,.bio-evidence select,.bio-evidence input:not([type=checkbox]),.bio-evidence .bio-button').evaluate_all('(es)=>es.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.slice(0,80),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))');check(prefix+' visible controls at least44 both dimensions',all(x['w']>=43.9 and x['h']>=43.9 for x in sizes),[x for x in sizes if x['w']<43.9 or x['h']<43.9])
    cb=page.locator('.bio-evidence-check').bounding_box();check(prefix+' checkbox entire label44 target',cb['width']>=44 and cb['height']>=44)
    nowrap=page.locator('.bio-evidence td,.bio-evidence th').evaluate_all('(es)=>es.every(e=>getComputedStyle(e).whiteSpace==="nowrap")');check(prefix+' IDs and numeric cells do not split',nowrap)
    regions=page.locator('.bio-evidence-scroll').evaluate_all('(es)=>es.map(e=>({role:e.getAttribute("role"),name:e.getAttribute("aria-label"),tab:e.tabIndex,overflow:e.scrollWidth>e.clientWidth}))');check(prefix+' required local table scroll named and keyboard focusable',len(regions)>=2 and all(r['role']=='region' and r['name'] and r['tab']==0 for r in regions),regions)
    for idx in range(2):
     reg=page.locator('.bio-evidence-scroll').nth(idx);reg.focus();start=reg.evaluate('(e)=>e.scrollLeft');page.keyboard.press('ArrowRight');page.wait_for_timeout(120);end=reg.evaluate('(e)=>e.scrollLeft');check(prefix+f' table{idx+1} keyboard horizontal scroll',end>start if width==390 else True,{'before':start,'after':end})
    gr=page.locator('.bio-evidence-graph-scroll');check(prefix+' graph scroll explicitly named focusable',gr.count()==1 and gr.get_attribute('role')=='region' and bool(gr.get_attribute('aria-label')) and gr.get_attribute('tabindex')=='0')
    gr.focus();gr.evaluate('(e)=>e.scrollLeft=0');page.keyboard.press('ArrowRight');page.wait_for_timeout(150);scroll=gr.evaluate('(e)=>e.scrollLeft');check(prefix+' graph keyboard scrolls on narrow screen',scroll>0 if width==390 else True,{'scroll':scroll});gr.evaluate('(e)=>e.scrollLeft=e.scrollWidth');shot(prefix+'-graph-right-end',gr);gr.evaluate('(e)=>e.scrollLeft=0');shot(prefix+'-graph-left-end',gr)
    img=page.locator('.bio-evidence figure img');iw=img.bounding_box()['width'];check(prefix+' graph minimum 13px source label remains readable >=10px',13*iw/760>=10,{'imageWidth':iw,'rendered13pxLabel':13*iw/760})
    for section,label in [(0,'workspace-data'),(1,'summary-calculation'),(2,'graph'),(3,'writing'),(4,'feedback')]:
     loc=page.locator('.bio-evidence > section').nth(section);loc.scroll_into_view_if_needed();shot(prefix+'-'+label)
  scope_done.append('1366 and390 EN bilingual workbench data graph writing feedback target sizes nowrap named keyboard table scrolling no page overflow')
  check('application console and pageerror zero',not errors,errors)
 except Exception as e:
  errors.append('TEST_EXCEPTION: '+str(e));traceback.print_exc()
  try:shot('failure-state');(OUT/'failure-dom.txt').write_text(page.locator('body').inner_text(),encoding='utf-8')
  except Exception:pass
 finally:
  try:(OUT/'geometry.json').write_text(json.dumps(geometries,ensure_ascii=False,indent=2),encoding='utf-8')
  finally:c.close();b.close()
  result={'complete':not errors and len(checks)==205 and len(scope_done)==5 and all(x['pass'] for x in checks),'checks':checks,'passed':sum(x['pass'] for x in checks),'total':len(checks),'errors':errors,'scope_done':scope_done,'screenshots':screenshots,'exports':exports,'browser_context_closed':True,'server_started_or_stopped':False,'seed_scope':'Isolated context only: valid old S01-S04 records/mission and old lesson sentinels; own lesson count fixtures used only for boundary matrix, not as proof of actual lesson completion. All S05 report, mission, question and download operations use actual UI. Separate course browser covers 24 activities plus six complete learning/recall flows.'}
  (OUT/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in result.items() if k not in ['checks','screenshots','exports']},ensure_ascii=False),flush=True)
sys.exit(0 if result['complete'] else 1)
