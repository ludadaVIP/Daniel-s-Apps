"""Independent S06 project Chromium acceptance. Uses isolated contexts on port 3460.
All non-empirical observations are explicitly marked TEST FIXTURE ONLY.
"""
from playwright.sync_api import sync_playwright
import json, pathlib, re, sys, time, traceback

sys.stdout.reconfigure(encoding='utf-8')
OUT = pathlib.Path(r'C:\Users\Administrator\.codex\visualizations\2026\11\10\01a1c7bf-87b4-7941-9aef-bad203405a02\biology-s6-project')
OUT.mkdir(exist_ok=True)
if (OUT/'verification.json').exists():
    history=OUT/'run-history';history.mkdir(exist_ok=True)
    (history/(str(time.time_ns())+'.json')).write_bytes((OUT/'verification.json').read_bytes())
BASE = 'http://127.0.0.1:3460'
CHROME = r'C:\Users\Administrator\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe'
KEY = 'study-biology-v1'
R = {'status':'in-progress','checks':[],'failures':[],'console':[],'pageerrors':[],'responses':[],'screens':[],'downloads':[]}

def save():
    (OUT/'verification.json').write_text(json.dumps(R, ensure_ascii=False, indent=2), encoding='utf-8')

def verify(name, condition, details=None):
    assert condition, (name, details)
    R['checks'].append({'name':name, 'details':details})
    save()
    print('PASS', name, flush=True)

def attach(page):
    page.on('console', lambda msg: R['console'].append({'type':msg.type,'text':msg.text}) if msg.type=='error' else None)
    page.on('pageerror', lambda error: R['pageerrors'].append(str(error)))
    page.on('response', lambda response: R['responses'].append({'url':response.url,'status':response.status}) if response.status>=400 else None)
    page.set_default_timeout(15000)

def visit(page, path='/biology/project/S06'):
    page.goto(BASE+path)
    page.wait_for_load_state('networkidle')

def english(page):
    page.get_by_role('button',name='EN',exact=True).click()

def state(page):
    return page.evaluate('(key)=>JSON.parse(localStorage.getItem(key))', KEY)

def screenshot(page,name,locator=None):
    (locator or page).screenshot(path=str(OUT/(name+'.png')), **({} if locator else {'full_page':True}))
    R['screens'].append(name+'.png')
    save()

def discover(page):
    visit(page);english(page)
    data={'text':page.locator('.bio-graduation').inner_text(),'inputs':page.locator('.bio-graduation input,.bio-graduation textarea,.bio-graduation select').evaluate_all('(es)=>es.map(e=>({tag:e.tagName,type:e.type,value:e.value,label:e.closest("label")?.innerText}))')}
    (OUT/'discovery.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    screenshot(page,'discovery-official')
    print(json.dumps(data,ensure_ascii=False)[:12000])

def root(page):return page.locator('.bio-graduation')
def sections(page):return root(page).locator(':scope > section')
def case(page, name):
    page.locator('.bio-graduation-cases button').nth(0 if name=='official' else 1).click()
    assert state(page)['projects']['S06']['active']==name
def current(page,name=None):
    d=state(page)['projects']['S06'];return d['cases'][name or d['active']]
def fill_calcs(page,first,second):
    inputs=sections(page).nth(1).locator('input:not([type=checkbox])')
    inputs.nth(0).fill(str(first));inputs.nth(1).fill(str(second))
def citations(page,indexes=(0,1)):
    boxes=page.locator('.bio-graduation-citations input')
    for index in indexes:boxes.nth(index).check()
def save_case(page):
    page.get_by_role('button',name='Save this case as a complete report',exact=True).click()
def fill_research(page,path):
    fields=page.locator('.bio-graduation-field textarea')
    names=['question','method','conditions','source','claim','reasoning','mechanism','limitation','alternative','nextQuestion','variable','measured','controls','sampling','challenge','references','revisionWhat','revisionWhy','secondLanguage']
    text={
      'question':'在这些记录中，年末年龄组成有什么差异？',
      'method':'按原表行求和，再以幼狼除以全部狼；这是一份描述性分析。',
      'conditions':'2025-12-31 年末快照，全园两地区；不作为当前数量。',
      'source':'US National Park Service annual report 2025，物理第5页；2026-11-15 查阅。',
      'claim':'北部17/53约32.08%，内部0/31为0%，但不能据此证明地区导致差异。',
      'reasoning':'W-N-8M为7/16，W-N-RC为4/16；北部合并17/53，全园17/84，不平均各群百分比。',
      'mechanism':'迁移、食物、疾病可提出假设，本表没有测量这些原因。',
      'limitation':'年龄构成不是出生率或存活率；十行分类不是十次独立实验。',
      'alternative':'观测努力及群体成员迁入迁出也可能改变记录，需要跟踪才能区分。',
      'nextQuestion':'连续多年记录群体进入离开和年龄组成是否保持相同描述？',
      'variable':'观察性比较地区和年度，不干扰动物。',
      'measured':'固定日期计数成年与幼狼，单位只，并记录努力。',
      'controls':'记录季节、努力、群体变化及潜在混杂。',
      'sampling':'群体为记录单位；重复年份不是新的独立群体。',
      'challenge':'若新增核验记录使两地份额相近，这将挑战差异描述。',
      'references':'US NPS annual report 2025 p5；https://www.nps.gov/yell/learn/nature/wolf.htm 为背景。',
      'revisionWhat':'把出生率改成年末幼狼份额。',
      'revisionWhy':'表中没有全年出生和生存数据，需保留正确分母。',
      'secondLanguage':'Optional practice: These observations do not establish a cause.'}
    for i,name in enumerate(names):
        value=('TEST FIXTURE ONLY / 自动验收虚构文字（非实际科研） '+path+' '+name+'：'+text[name])
        if path=='observation':value='TEST FIXTURE ONLY / 虚构植物验收，非真实测量 '+name+'。单株正常照料下纵向记录，n=1；缺失不是零。'
        fields.nth(i).fill(value)
    story=sections(page).nth(3).locator('fieldset')
    for i in range(5):
        story.nth(i).locator('textarea').nth(0).fill(f'TEST FIXTURE ONLY {path} segment {i+1}: explain the question, cited evidence and its limits in my own words.')
        story.nth(i).locator('textarea').nth(1).fill(f'第{i+1}段可选双语练习，非真实研究数据。')
    for b in sections(page).nth(4).locator('input[type=checkbox]').all():b.check()
    verify(path+' all 19 report fields and five self-written notes entered through UI', all(current(page)['text'][n] for n in names))

def add_record(page,plant,day,value):
    f=sections(page).nth(0).locator('fieldset')
    inputs=f.locator('input:not([type=checkbox])')
    inputs.nth(0).fill(plant);inputs.nth(1).fill(str(day))
    if value is None:f.locator('input[type=checkbox]').check()
    else:inputs.nth(2).fill(str(value))
    f.get_by_role('button',name='Add record',exact=True).click()

def svg_check(page,name):
    data=page.locator('.bio-graduation-graph svg').evaluate('''svg=>{const b=svg.viewBox.baseVal;return [...svg.querySelectorAll('text')].map(e=>{const r=e.getBBox();return {text:e.textContent,x:r.x,y:r.y,width:r.width,height:r.height,out:r.x<-.5||r.y<-.5||r.x+r.width>b.width+.5||r.y+r.height>b.height+.5}})}''')
    verify(name+' SVG text stays within viewBox',not any(x['out'] for x in data),data)

def no_overflow(page,name):
    dims=page.evaluate('({viewport:innerWidth,body:document.body.scrollWidth,document:document.documentElement.scrollWidth})')
    verify(name+' no whole-page horizontal overflow',max(dims['body'],dims['document'])<=dims['viewport']+1,dims)

def download(page,name,expected_values=()):
    with page.expect_download() as pending:page.locator('.bio-graduation a[download]').click()
    d=pending.value;path=OUT/(name+'.html');d.save_as(str(path));R['downloads'].append(path.name);save()
    report=page.context.new_page();attach(report);report.goto(path.as_uri());report.wait_for_load_state('networkidle')
    verify(name+' actual download and offline render',report.locator('h1').inner_text()=='我的生命科学研究 / My Biology Investigation')
    body=report.locator('body').inner_text()
    for value in expected_values:verify(name+' retains '+value[:45],value in body)
    verify(name+' is offline standalone and has no executable injected content',report.locator('script,img,iframe,foreignObject').count()==0 and not report.evaluate('Boolean(window.S6_XSS)'))
    for width in [1366,390]:
        report.set_viewport_size({'width':width,'height':950});no_overflow(report,name+f' offline {width}')
        screenshot(report,name+f'-offline-{width}-graph',report.locator('.graph'))
        # Natural text wrapping, not height/line clamps.
        verify(name+f' offline {width} prose fully laid out',report.locator('p.student').evaluate_all('(es)=>es.every(e=>e.scrollHeight<=e.clientHeight+1&&getComputedStyle(e).overflow!=="hidden")'))
    report.emulate_media(media='print');no_overflow(report,name+' print')
    screenshot(report,name+'-print-graph',report.locator('.graph'))
    report.close();return path

def ui_flow(page):
    visit(page);english(page)
    verify('Initial official and observation contain no saved reports',root(page).locator('input[type=checkbox]:checked').count()==0)
    save_case(page)
    verify('Empty report cannot save and has actionable feedback',not current(page).get('savedAt') and 'Complete research fields' in root(page).inner_text())
    table=sections(page).nth(0).locator('tbody tr')
    verify('Official all ten transcribed rows displayed',table.count()==10)
    verify('Both zero-denominator loner rows remain NA',all('NA / 未定义' in table.filter(has_text=id).inner_text() for id in ['W-N-L','W-I-L']))
    citations(page)
    root(page).get_by_label('Analysis scope',exact=False).select_option('Interior')
    verify('Changing scope clears citations',current(page)['citations']==[])
    verify('Interior pooled fraction is zero over 31', 'Pooled share 0/31 ×100 = 0%' in root(page).inner_text())
    root(page).get_by_label('Graph type',exact=False).select_option('shares')
    verify('Interior graph shows 0/31=0%, not NA','0/31 = 0%' in page.locator('.bio-graduation-graph').inner_text())
    svg_check(page,'official Interior shares')
    root(page).get_by_label('Analysis scope',exact=False).select_option('Northern Range')
    verify('Northern pooled fraction uses all 53 wolves','Pooled share 17/53 ×100 = 32.08%' in root(page).inner_text())
    root(page).get_by_label('Analysis scope',exact=False).select_option('all')
    verify('All pooled summary is 17/84','Pooled share 17/84 ×100 = 20.24%' in root(page).inner_text())
    verify('Two regional graph bars are weighted within regions',all(x in page.locator('.bio-graduation-graph').inner_text() for x in ['17/53 = 32.08%','0/31 = 0%']))
    svg_check(page,'official all shares');screenshot(page,'official-shares',sections(page).nth(1))
    root(page).get_by_label('Graph type',exact=False).select_option('counts')
    svg_check(page,'official all counts')
    fill_calcs(page,'47.22','20.24');verify('Wrong adult denominator returns revision feedback','↺ 17 ÷ 53' in root(page).inner_text())
    fill_calcs(page,'32.08','20.24');citations(page);fill_research(page,'official')
    save_case(page);verify('Official report saves without prerequisite check answers',bool(current(page).get('savedAt')) and not state(page)['projects']['S06']['answers'])
    official_saved=current(page)['savedAt']
    screenshot(page,'official-review-saved',sections(page).nth(4))
    case(page,'observation')
    verify('Observation starts genuinely blank',current(page)['records']==[] and 'No records yet' in root(page).inner_text())
    screenshot(page,'observation-initial-empty',sections(page).nth(0))
    root(page).get_by_label('Start date (real day 0)',exact=True).fill('2026-10-01')
    for day,value in [(0,10),(3,12),(5,None),(10,15)]:add_record(page,'TEST-PLANT-A',day,value)
    add_record(page,'TEST-PLANT-B',0,90)
    c=current(page)
    verify('Five test-only rows entered individually through UI',len(c['records'])==5)
    verify('Missing is null and valid heights retained',[r['value'] for r in c['records']]==[10,12,None,15,90])
    verify('Observation independent n=1 and difference5/relative50',all(s in root(page).inner_text() for s in ['3 valid readings; independent plant n=1','Last−first: 5 cm; relative change: 50%']))
    graph=page.locator('.bio-graduation-graph svg')
    verify('Other plant not graphed and NA breaks line',graph.locator('circle').count()==3 and graph.locator('path[stroke-width="3"]').count()==1 and '90 cm' not in graph.text_content())
    coords=graph.locator('circle').evaluate_all('(es)=>es.map(e=>+e.getAttribute("cx"))')
    verify('Graph uses actual irregular day spacing',abs((coords[1]-coords[0])/(coords[2]-coords[0])-.3)<1e-9,coords)
    svg_check(page,'plant irregular days');screenshot(page,'observation-graph',sections(page).nth(1))
    fill_calcs(page,5,50);citations(page,(0,2));fill_research(page,'observation')
    # Explicit boundary: each note is required and total timing is a real gate.
    seconds=sections(page).nth(3).locator('input[type=number]')
    seconds.nth(0).fill('1');seconds.nth(1).fill('1');save_case(page)
    verify('137 seconds cannot save',not current(page).get('savedAt') and '180–300 seconds' in root(page).inner_text())
    seconds.nth(0).fill('45');seconds.nth(1).fill('45');save_case(page)
    verify('Observation saves with225second five-part script',bool(current(page).get('savedAt')))
    verify('Saving observation preserved official save',current(page,'official')['savedAt']==official_saved)
    page.reload();page.wait_for_load_state('networkidle');english(page)
    verify('Both independent saved cases survive reload',all(current(page,id).get('savedAt') for id in ['official','observation']))
    # Edit a cited record with stable ID: saved state revoked and stale citation removed.
    before=current(page);old_id=before['records'][0]['id']
    rows=sections(page).nth(0).locator('tbody tr')
    rows.nth(0).get_by_role('button',name='Edit',exact=True).click()
    f=sections(page).nth(0).locator('fieldset');f.locator('input:not([type=checkbox])').nth(2).fill('0')
    f.get_by_role('button',name='Apply record edit',exact=True).click()
    verify('Cited record edit retains ID, removes citation and own saved flag',current(page)['records'][0]['id']==old_id and old_id not in current(page)['citations'] and not current(page).get('savedAt'))
    verify('Real zero retained and relative change undefined','Last−first: 15 cm; relative change: NA / 未定义%' in root(page).inner_text())
    verify('Other case stays saved after observation edit',current(page,'official')['savedAt']==official_saved)
    fill_calcs(page,15,'NA');citations(page,(0,2));save_case(page)
    verify('First zero accepts NA calculation and complete save',bool(current(page).get('savedAt')))
    root(page).get_by_label('One plant for the graph and analysis',exact=False).select_option('TEST-PLANT-B')
    verify('Switching plant clears current citations and save',current(page)['citations']==[] and not current(page).get('savedAt'))
    verify('Single other-plant value does not pool plants','1 valid readings; independent plant n=1' in root(page).inner_text())
    save_case(page);verify('Only one valid reading cannot save',not current(page).get('savedAt'))
    root(page).get_by_label('One plant for the graph and analysis',exact=False).select_option('TEST-PLANT-A')
    fill_calcs(page,15,'NA');citations(page,(0,2));save_case(page)
    # Delete cited last record then re-add it (new stable ID).
    last_id=current(page)['records'][3]['id']
    sections(page).nth(0).locator('tbody tr').nth(3).get_by_role('button',name='Delete',exact=True).click()
    verify('Deleting cited row revokes save and removes stale ID',last_id not in current(page)['citations'] and not current(page).get('savedAt') and len(current(page)['records'])==4)
    add_record(page,'TEST-PLANT-A',10,15);fill_calcs(page,15,'NA');citations(page,(0,2));save_case(page)
    verify('Readded record can be re-cited and saved',bool(current(page).get('savedAt')))
    # Six real UI answers, one intentionally incorrect to inspect the exported learner label.
    case(page,'official')
    check=sections(page).nth(5)
    for i,answer in enumerate([1,1,2,0,1,2]):
        check.locator('.bio-options').nth(i).get_by_role('button').nth(answer).click()
        check.get_by_role('button',name='View explanation →',exact=True).first.click()
    verify('All six answers, five correct through UI','Answered 6/6, correct 5/6' in check.inner_text())
    verify('Own missing lessons/missions still block graduation','S06: 0/24 lessons, 0/6 missions' in root(page).inner_text())
    download(page,'official-saved-five-correct',['Needs revision / 需订正','3 amino acids; UAA adds another residue','Answered / 已答 6/6; correct / 正确 5/6','W-N-8M','W-I-L','TEST FIXTURE ONLY','revisionWhy'])
    check.get_by_role('button',name='Think again',exact=True).nth(0).click()
    check.locator('.bio-options').nth(0).get_by_role('button').nth(0).click()
    check.get_by_role('button',name='View explanation →',exact=True).click()
    verify('Wrong check can be corrected without changing reports','Answered 6/6, correct 6/6' in check.inner_text() and current(page).get('savedAt')==official_saved)
    case(page,'observation')
    download(page,'observation-saved-zero',['NA / 未定义','TEST-PLANT-A','TEST-PLANT-B','Excluded: other plant','Planned total / 计划总时长: 225 s','TEST FIXTURE ONLY','segment 5','revisionWhy'])
    (OUT/'ui-flow-storage.json').write_text(json.dumps(state(page),ensure_ascii=False,indent=2),encoding='utf-8')

def layout_matrix(page,prefix):
    for path in ['official','observation']:
        case(page,path)
        for width in [1366,390]:
            page.set_viewport_size({'width':width,'height':950})
            for mode in ['EN','双语']:
                page.get_by_role('button',name=mode,exact=True).click()
                label=f'{prefix}-{path}-{width}-{mode}'
                no_overflow(page,label);svg_check(page,label)
                screenshot(page,label+'-graph',sections(page).nth(1))
                screenshot(page,label+'-report-fields',page.locator('.bio-graduation-field').nth(4))
                graph=page.locator('.bio-graduation-graph')
                graph.focus();page.keyboard.press('Home')
                before=graph.evaluate('e=>e.scrollLeft')
                page.keyboard.press('ArrowRight');page.wait_for_timeout(200)
                after=graph.evaluate('e=>e.scrollLeft')
                scrollable=graph.evaluate('e=>e.scrollWidth>e.clientWidth')
                verify(label+' named graph keyboard scroll',bool(graph.get_attribute('aria-label')) and (not scrollable or after>before),{'before':before,'after':after,'scrollable':scrollable})
    english(page)

def missions_and_gates(page):
    for unit,n in [(31,123),(32,127),(33,131),(34,134),(35,138),(36,143)]:
        visit(page,f'/biology/notebook?unit=U{unit}');english(page)
        form=page.locator('form').filter(has=page.get_by_role('button',name='Save my evidence ✓',exact=True))
        verify(f'U{unit} evidence mission entry has 3 CER fields',form.locator('textarea').count()==3)
        for i in range(3):form.locator('textarea').nth(i).fill(f'TEST FIXTURE ONLY U{unit} CER field {i}: evidence conditions, numerical comparison, limited inference.')
        form.get_by_role('button',name='Save my evidence ✓',exact=True).click()
        verify(f'U{unit} mission genuinely saved',bool(state(page)['missions'][f'U{unit}'].get('savedAt')))
        verify(f'U{unit} all four lesson links',all(page.locator(f'a[href="/biology/lesson/L{x}"]').count() for x in range((unit-1)*4+1,unit*4+1)))
        verify(f'U{unit} representative interactive rendered',page.locator('.bio-s6-lab svg').count()>0)
    visit(page);english(page)
    verify('Six saved missions do not substitute for own 24 lessons','S06: 0/24 lessons, 6/6 missions' in root(page).inner_text())
    # TEST FIXTURE ONLY: stage completion marks and old records; no claim of 24 actual student completions.
    before=state(page)
    fixture=page.evaluate('''async key=>{
      const p=await import('/src/progress.ts');const c=await import('/src/content.ts');
      let s=JSON.parse(localStorage.getItem(key));
      const mods=await Promise.all([import('/src/project.ts'),import('/src/leafProject.ts'),import('/src/ecoProject.ts'),import('/src/storyProject.ts'),import('/src/evidenceProject.ts')]);
      const funcs=['emptyProject','emptyLeafProject','emptyEcoProject','emptyStoryProject','emptyEvidenceProject'];
      mods.forEach((m,i)=>{s.projects['S0'+(i+1)]=m[funcs[i]]()});
      for(const n of [1,25,49,73,97]){const id='L'+String(n).padStart(3,'0');s.sessions[id]={step:3,note:'TEST ONLY legacy '+id,explored:true,completedAt:10};const q=c.lessons.find(l=>l.id===id).questions[0];s.answers[q.id]={choice:q.correct,first:q.correct,at:10}}
      for(const id of ['U01','U07','U13','U19','U25'])s=p.withMission(s,id,{object:'TEST ONLY '+id,evidence:'old evidence',reasoning:'old reasoning',savedAt:10});
      const clean=p.decodeProgress(JSON.stringify(s));localStorage.setItem(key,JSON.stringify(clean));
      return {storage:clean,outcomes:[p.stageOutcome,p.leafStageOutcome,p.ecoStageOutcome,p.storyStageOutcome,p.evidenceStageOutcome].map(f=>f(clean))}
    }''',KEY)
    page.reload();page.wait_for_load_state('networkidle');english(page)
    verify('Browser restored valid legacy S01–S05 draft records',all(id in state(page)['projects'] for id in ['S01','S02','S03','S04','S05']))
    page.evaluate('''key=>{const s=JSON.parse(localStorage.getItem(key));for(let n=121;n<=144;n++)s.sessions['L'+n]={step:3,note:'TEST ONLY completed gate fixture',completedAt:10};localStorage.setItem(key,JSON.stringify(s))}''',KEY)
    page.reload();page.wait_for_load_state('networkidle');english(page)
    verify('Own24 fixture + six UI missions +savedcase +6correct yields S06 complete','✓ S06 explored: your 24 lessons' in root(page).inner_text())
    after=state(page)
    verify('Legacy projects remain byte-for-byte deep equal after S06 gate',all(after['projects'][id]==fixture['storage']['projects'][id] for id in ['S01','S02','S03','S04','S05']))
    old=page.evaluate('''async key=>{const p=await import('/src/progress.ts');const s=p.decodeProgress(localStorage.getItem(key));return [p.stageOutcome,p.leafStageOutcome,p.ecoStageOutcome,p.storyStageOutcome,p.evidenceStageOutcome].map(f=>f(s))}''',KEY)
    verify('Five old stage outcomes stay independent',old==fixture['outcomes'],old)
    page.evaluate('''key=>{const s=JSON.parse(localStorage.getItem(key));delete s.projects.S06.answers['S06-Q6'];localStorage.setItem(key,JSON.stringify(s))}''',KEY)
    page.reload();page.wait_for_load_state('networkidle');english(page)
    verify('Five answered even five correct cannot graduate','S06: 24/24 lessons, 6/6 missions' in root(page).inner_text() and 'Answered 5/6, correct 5/6' in root(page).inner_text())
    check=sections(page).nth(5);check.locator('.bio-options').nth(5).get_by_role('button').nth(2).click();check.get_by_role('button',name='View explanation →',exact=True).click()
    case(page,'official');root(page).get_by_label('Analysis scope',exact=False).select_option('Interior')
    verify('Editing official leaves valid observation saved and S06 complete','✓ S06 explored' in root(page).inner_text() and current(page,'observation').get('savedAt') and not current(page).get('savedAt'))
    case(page,'observation');page.locator('.bio-graduation-field textarea').nth(4).fill('TEST ONLY changed observation claim')
    verify('Both reports unsaved blocks S06 despite lessons/missions/checks','S06: 24/24 lessons, 6/6 missions' in root(page).inner_text())
    # Restore the independently completed UI flow for later layout/payload tests.
    page.evaluate('(a)=>localStorage.setItem(a.key,JSON.stringify(a.data))',{'key':KEY,'data':before})
    page.reload();page.wait_for_load_state('networkidle');english(page)
    visit(page,'/biology/lesson/L144');english(page)
    page.locator('.bio-steps button').nth(0).click();page.locator('.bio-predict .bio-options button').nth(0).click()
    page.locator('.bio-steps button').nth(1).click();page.locator('.bio-explore-grid .bio-s6-lab textarea').first.fill('TEST ONLY: explain the paired observations and limits, without a causal claim.')
    page.locator('.bio-steps button').nth(2).click()
    answers=page.evaluate("async()=>((await import('/src/content.ts')).lessons.find(l=>l.id==='L144').questions.map(q=>q.correct))")
    for i,answer in enumerate(answers):
        page.locator('.bio-question .bio-options button').nth(answer).click();page.get_by_role('button',name='Check & explain →',exact=True).click()
        if i<3:page.get_by_role('button',name='Next question →',exact=True).click()
    page.locator('.bio-steps button').nth(3).click();page.locator('.bio-finish textarea').fill('TEST ONLY: 我学到图注、数值、范围和局限应一致。')
    page.get_by_role('button',name='Finish lesson & save discoveries ✓',exact=True).click()
    verify('L144 terminal routes to actual S06-P01 and has no L145',page.locator('a[href="/biology/project/S06"]').count()>0 and page.locator('a[href="/biology/lesson/L145"]').count()==0)
    page.get_by_role('link',name='Open graduation investigation S06-P01 →',exact=True).click();page.wait_for_selector('.bio-graduation')
    verify('L144 actual final project link opens workbench','/biology/project/S06' in page.url)

def stress(page):
    # TEST FIXTURE ONLY: boundary data, never presented as a completed empirical investigation.
    payload='TEST FIXTURE ONLY <script>window.S6_XSS=1</script><img src=x onerror="window.S6_XSS=1"> &\u0001 '+('中W'*3500)+' https://example.invalid/'+('W'*3000)+' END-OF-LONG-FIELD'
    data=state(page);d=data['projects']['S06'];c=d['cases']['observation'];d['active']='observation';c.pop('savedAt',None)
    c['records']=[{'id':f'Pstress{i}','plant':'TEST-PLANT-A' if i<91 else 'TEST-PLANT-B','day':i*2,'value':None if i==2 else i} for i in range(100)]
    c['activePlant']='TEST-PLANT-A';c['citations']=['Pstress0','Pstress90'];c['calculations']=['90','NA'];c['text']['claim']=payload
    c['text']['references']='TEST ONLY https://example.invalid/'+('LongUrl'*800)+' LAST-REFERENCE'
    c['speech'][4]['notes']='TEST ONLY LAST SPEAKING NOTE '+('Long statement 中文 '*400)+' LAST-SPEAKING-END'
    d['cases']['official']['text']['claim']=payload;d['cases']['official'].pop('savedAt',None)
    page.evaluate('(a)=>localStorage.setItem(a.key,JSON.stringify(a.data))',{'key':KEY,'data':data});page.reload();page.wait_for_load_state('networkidle');english(page)
    verify('100 boundary records decode and render',len(current(page)['records'])==100 and sections(page).nth(0).locator('tbody tr').count()==100)
    verify('Boundary graph keeps90 valid selected heights and excludes9 otherplants',page.locator('.bio-graduation-graph circle').count()==90)
    add_record(page,'TEST-PLANT-A',999,12)
    verify('UI rejects101st record',len(current(page)['records'])==100 and root(page).locator('[role=alert]').count()>0)
    layout_matrix(page,'stress')
    case(page,'observation');english(page)
    verify('UI student payload never executes',not page.evaluate('Boolean(window.S6_XSS)') and root(page).locator('script,img').count()==0)
    path=download(page,'observation-stress100',['Pstress99','Pstress90','Excluded: other plant','NA / 缺失','END-OF-LONG-FIELD','LAST-REFERENCE','LAST-SPEAKING-END','DRAFT / 草稿'])
    report=page.context.new_page();attach(report);report.goto(path.as_uri());report.wait_for_load_state('networkidle')
    text=report.locator('body').inner_text()
    verify('Full7000-character mixed prose retained',('中W'*3500) in text)
    verify('Illegal XML input made visible, text payload stays inert','\uFFFD' in text and '<script>window.S6_XSS=1</script>' in text)
    verify('All100 raw records present offline',report.locator('tbody tr').count()==100)
    report.close()

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=CHROME)
        context=browser.new_context(viewport={'width':1366,'height':950},accept_downloads=True)
        page=context.new_page();attach(page)
        try:
            if len(sys.argv)>1 and sys.argv[1]=='discover':discover(page);R['status']='discovered'
            else:
                if len(sys.argv)>1 and sys.argv[1]=='resume':
                    visit(page);page.evaluate('(a)=>localStorage.setItem(a.key,JSON.stringify(a.data))',{'key':KEY,'data':json.loads((OUT/'ui-flow-storage.json').read_text(encoding='utf-8'))});page.reload();page.wait_for_load_state('networkidle');english(page)
                else:ui_flow(page)
                layout_matrix(page,'normal');missions_and_gates(page);stress(page)
                verify('No browser console errors',R['console']==[],R['console'])
                verify('No uncaught page errors',R['pageerrors']==[],R['pageerrors'])
                verify('No failed responses',R['responses']==[],R['responses'])
                R['status']='passed'
            save()
        except Exception as error:
            R['status']='failed';R['failures'].append({'error':str(error),'traceback':traceback.format_exc()});save()
            screenshot(page,'failure')
            raise
        finally:
            context.close();browser.close()

if __name__=='__main__':main()
