// @vitest-environment jsdom
import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { render,screen,fireEvent,cleanup,within } from '@testing-library/react';
import { MemoryRouter,Routes,Route } from 'react-router-dom';
import { InequalityLab,InequalityHookArt } from './InequalityLabs';
import { InequalityLine } from './InequalityVisuals';
import { parseRealSet } from './inequalityModels';
import { App } from './App';
import { j84Lessons } from './content/J84';
import { STORAGE_KEY } from './progress';
beforeEach(()=>{localStorage.clear();localStorage.setItem('study-language','en');vi.stubGlobal('scrollTo',vi.fn());Element.prototype.scrollIntoView=vi.fn();vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>{cb(0);return 0;});vi.stubGlobal('cancelAnimationFrame',vi.fn());});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const click=(name:string|RegExp)=>fireEvent.click(screen.getByRole('button',{name}));
const enter=(name:string,value:string)=>fireEvent.change(screen.getByRole('textbox',{name}),{target:{value}});
const choose=(name:string,value:string)=>fireEvent.change(screen.getByRole('combobox',{name}),{target:{value}});
const slide=(name:string,value:string)=>fireEvent.change(screen.getByRole('slider',{name}),{target:{value}});
const field=(name:string)=>(screen.getByRole('textbox',{name}) as HTMLInputElement).value;
const result=()=>screen.getByRole('status',{name:'Inequality feedback'}).textContent;
const task='My complete solution set';
const submit=()=>click('Check solution set');
const mount=(path:string)=>render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/math/*" element={<App/>}/></Routes></MemoryRouter>);
const check=()=>click(/Check answer/);
describe('J84 exact-set workshops and visual boundaries',()=>{
  it('separates one candidate, the drawn full set and ten finite integer samples',()=>{
    const v=render(<InequalityLab kind="inequality-meaning" mode="en"/>);
    click('Check all original conditions');expect(screen.getByRole('status',{name:'Candidate audit'}).textContent).toContain('not a shared solution');
    enter('Candidate value','2.9');click('Check all original conditions');expect(screen.getByRole('status',{name:'Candidate audit'}).textContent).toContain('one solution only');
    enter('Drawing boundary','3');click('Check number-line sketch');expect(screen.getByRole('status',{name:'Sketch feedback'}).textContent).toContain('match');
    fireEvent.click(screen.getByRole('checkbox',{name:'Include boundary'}));click('Check number-line sketch');expect(screen.getByRole('status',{name:'Sketch feedback'}).textContent).toContain('Check the boundary');
    click('Inspect ten integer samples');expect(v.container.querySelectorAll('[data-inequality-sample]')).toHaveLength(10);expect(v.container.querySelectorAll('[data-inequality-sample][data-pass="true"]')).toHaveLength(7);
    enter(task,'3');submit();expect(result()).toContain('boundary');enter(task,'3>x');submit();expect(result()).toContain('matches');
    choose('Inequality experiment','1');expect(field(task)).toBe('');expect(v.container.querySelectorAll('[data-inequality-sample]')).toHaveLength(0);expect(screen.queryByRole('status',{name:'Candidate audit'})).toBeNull();
  });
  it('retains original conditions and only adopts justified common operations, with undo',()=>{
    const v=render(<InequalityLab kind="inequality-step" mode="en"/>);click('Check and try step');expect(v.container.querySelector('[data-current-inequality]')!.textContent).toBe('x ≤ 4');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(2);expect(screen.getByRole('group',{name:'Original conditions retained'}).textContent).toContain('x+3<=7');
    choose('Sides changed','left');click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('one-sided');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(2);
    enter(task,'x<=4');submit();expect(result()).toContain('matches');click('Undo last step');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(1);expect(field(task)).toBe('x<=4');
  });
  it('requires negative scaling reversal and rejects zero or unknown-sign factors without adopting them',()=>{
    const v=render(<InequalityLab kind="inequality-step" mode="en"/>);choose('Inequality experiment','3');choose('Operation','÷');enter('Operation amount','-2');click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('negative scaling reverses');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(1);
    fireEvent.click(screen.getByRole('checkbox',{name:'Reverse comparison'}));click('Check and try step');expect(v.container.querySelector('[data-current-inequality]')!.textContent).toBe('x > -3');
    enter('Operation amount','0');click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('undefined');enter('Operation amount','x');click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('unknown sign');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(2);
    choose('Operation','×');enter('Operation amount','0');click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('erases order');
  });
  it('keeps direction when adding a negative and does not infer reversal from the minus sign alone',()=>{
    const v=render(<InequalityLab kind="inequality-step" mode="en"/>);choose('Operation','+');enter('Operation amount','-3');click('Check and try step');expect(v.container.querySelector('[data-current-inequality]')!.textContent).toBe('x ≤ 4');
    fireEvent.click(screen.getByRole('checkbox',{name:'Reverse comparison'}));click('Check and try step');expect(screen.getByRole('status',{name:'Step rule feedback'}).textContent).toContain('Addition/subtraction keeps direction');expect(v.container.querySelectorAll('[data-inequality-history]')).toHaveLength(2);
  });
  it('predicts reflection before revealing products, retaining identity labels and distinguishing zero collapse',()=>{
    const v=render(<InequalityLab kind="inequality-reverse" mode="en"/>);expect(screen.queryByRole('status',{name:'Reflection observation'})).toBeNull();click('Reveal products and check prediction');expect(screen.getByRole('status',{name:'Reflection observation'}).textContent).toContain('4 > -6');expect(v.container.querySelectorAll('svg')).toHaveLength(2);expect(v.container.textContent).toContain('ka');
    choose('Predicted comparison','reverse');click('Reveal products and check prediction');expect(screen.getByRole('status',{name:'Reflection observation'}).textContent).toContain('prediction matches');
    slide('k','0');expect(screen.queryByRole('status',{name:'Reflection observation'})).toBeNull();choose('Predicted comparison','equal');click('Reveal products and check prediction');expect(screen.getByRole('status',{name:'Reflection observation'}).textContent).toContain('cannot be recovered');slide('a','3');slide('k','2');click('Reveal products and check prediction');expect(screen.getByRole('status',{name:'Reflection observation'}).textContent).toContain('original numbers are equal');
  });
  it('reveals four justified steps with undo and preserves entered success across view changes',()=>{
    const v=render(<InequalityLab kind="inequality-linear" mode="en"/>);expect(v.container.querySelectorAll('[data-inequality-step]')).toHaveLength(0);
    for(let i=0;i<4;i++)click('Next step with reason');expect(v.container.querySelectorAll('[data-inequality-step]')).toHaveLength(4);expect(v.container.querySelector('[data-inequality-step="4"]')!.textContent).toContain('x ≤ 7');click('Undo one step');expect(v.container.querySelectorAll('[data-inequality-step]')).toHaveLength(3);
    enter(task,'x<=7');submit();click('Show or hide solution graph');click('Change number-line window');expect(field(task)).toBe('x<=7');expect(result()).toContain('matches');
    choose('Inequality experiment','1');expect(field(task)).toBe('');expect(v.container.querySelectorAll('[data-inequality-step]')).toHaveLength(0);click('Show or hide solution graph');expect(v.container.querySelectorAll('[data-set-endpoint]')).toHaveLength(0);expect(v.container.querySelector('[data-set-continuation="left"]')).toBeTruthy();click('Change number-line window');expect(v.container.querySelector('[data-set-endpoint="-8"]')!.getAttribute('data-closed')).toBe('false');
  });
  it('separates true and false constant relations after variables cancel without division by zero',()=>{
    const v=render(<InequalityLab kind="inequality-linear" mode="en"/>);choose('Inequality experiment','2');for(let i=0;i<4;i++)click('Next step with reason');expect(v.container.querySelector('[data-inequality-step="4"]')!.textContent).toContain('ℝ');enter(task,'all rational numbers');submit();expect(result()).not.toContain('matches');enter(task,'all reals');submit();expect(result()).toContain('matches');
    choose('Inequality experiment','3');for(let i=0;i<4;i++)click('Next step with reason');expect(v.container.querySelector('[data-inequality-step="4"]')!.textContent).toContain('∅');enter(task,'0');submit();expect(result()).not.toContain('matches');enter(task,'none');submit();expect(result()).toContain('matches');
  });
  it('audits one candidate in both conditions and shows the precise mixed-endpoint intersection on request',()=>{
    const v=render(<InequalityLab kind="inequality-intersection" mode="en"/>);enter('Candidate value','5');click('Check all original conditions');expect(v.container.querySelectorAll('[data-candidate-pass="true"]')).toHaveLength(1);expect(v.container.querySelectorAll('[data-candidate-pass="false"]')).toHaveLength(1);expect(screen.queryByRole('group',{name:'Shared solution set'})).toBeNull();
    enter(task,'[-1,4)');submit();expect(result()).toContain('matches');click('Show or hide intersection');const g=screen.getByRole('group',{name:'Shared solution set'});expect(g.querySelector('[data-set-endpoint="-1"]')!.getAttribute('data-closed')).toBe('true');expect(g.querySelector('[data-set-endpoint="4"]')!.getAttribute('data-closed')).toBe('false');
  });
  it('distinguishes closed touching singleton, open touching empty, and stronger same-direction bounds',()=>{
    render(<InequalityLab kind="inequality-intersection" mode="en"/>);choose('Inequality experiment','2');enter(task,'{2}');submit();expect(result()).toContain('matches');click('Show or hide intersection');expect(screen.getByRole('group',{name:'Shared solution set'}).querySelectorAll('[data-set-endpoint]')).toHaveLength(1);
    choose('Inequality experiment','3');expect(field(task)).toBe('');enter(task,'x=2');submit();expect(result()).not.toContain('matches');enter(task,'∅');submit();expect(result()).toContain('matches');click('Show or hide intersection');expect(screen.getByRole('group',{name:'Shared solution set'}).querySelectorAll('[data-set-endpoint]')).toHaveLength(0);
    choose('Inequality experiment','4');enter(task,'x>-2');submit();expect(result()).not.toContain('matches');enter(task,'x>=1');submit();expect(result()).toContain('matches');
  });
  it('keeps an off-window nonempty interval distinct from an empty set and retains the input while widening',()=>{
    render(<InequalityLab kind="inequality-intersection" mode="en"/>);choose('Inequality experiment','5');enter(task,'7<=x<10');submit();click('Show or hide intersection');let g=screen.getByRole('group',{name:'Shared solution set'});expect(g.textContent).toContain('No part in this window');expect(g.querySelectorAll('[data-set-endpoint]')).toHaveLength(0);click('Change number-line window');g=screen.getByRole('group',{name:'Shared solution set'});expect(g.querySelectorAll('[data-set-endpoint]')).toHaveLength(2);expect(field(task)).toBe('7<=x<10');expect(result()).toContain('matches');
  });
  it('draws a fractional boundary exactly, one marker for a singleton, and no invented finite endpoint for all reals',()=>{
    let v=render(<InequalityLine set={parseRealSet('x<=-7/3')!} mode="en"/>);expect(v.container.querySelector('[data-set-endpoint="-7/3"]')!.getAttribute('data-closed')).toBe('true');expect(screen.getByRole('region',{name:'Solution set'}).getAttribute('tabindex')).toBe('0');v.unmount();
    v=render(<InequalityLine set={parseRealSet('all reals')!} mode="en"/>);expect(v.container.querySelectorAll('[data-set-endpoint]')).toHaveLength(0);expect(v.container.querySelectorAll('[data-set-continuation]')).toHaveLength(2);v.unmount();
    v=render(<InequalityLine set={parseRealSet('{2}')!} mode="en"/>);expect(v.container.querySelectorAll('[data-set-endpoint]')).toHaveLength(1);
  });
  it('keeps the five opening investigations as questions rather than solved conclusions',()=>{for(const l of j84Lessons){const v=render(<InequalityHookArt kind={l.lab as Parameters<typeof InequalityHookArt>[0]['kind']} mode="en"/>);expect(v.container.textContent).toContain('?');v.unmount();}});
});
describe('J84 complete lessons and persistent independent answers',()=>{
  it('renders every English body and both bilingual sections with two complete examples each',()=>{
    for(const l of j84Lessons){const v=mount(`/math/lesson/${l.id}`);click(/03 Understand/);expect(v.container.querySelectorAll('.math-prose section[lang="en"] h3')).toHaveLength(2);v.unmount();}
    localStorage.setItem('study-language','bilingual');const v=mount('/math/lesson/J84-L05');click(/03/);for(const lang of ['zh','en'])expect(v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`)).toHaveLength(2);
  });
  it('restores original solution-set representations after supported retries across all five lessons',()=>{
    for(const [id,wrong,right] of [['J84-L01','3','3>x'],['J84-L02','x>=4','(-inf,4]'],['J84-L03','x<-3','−3＜x'],['J84-L04','x>=7','2x<=14'],['J84-L05','-1<x<4','[-1,4)']]){
      const v=mount(`/math/lesson/${id}`);click(/04 Together/);enter('Your answer',wrong!);check();enter('Your answer',right!);check();expect(screen.getByText('✓ Completed with support. Your understanding is growing.')).toBeTruthy();v.unmount();const w=mount(`/math/lesson/${id}`);expect(field('Your answer')).toBe(right);expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!].completedAt).toBeUndefined();w.unmount();
    }
  });
  it('rejects truncated fractional boundaries and preserves exact inclusive ranges after refresh',()=>{
    const v=mount('/math/lesson/J84-L04');click(/05 Practice/);click('Question 5');enter('Your answer','x<=-2.33');check();expect(screen.queryByText('✓ You found it independently.')).toBeNull();enter('Your answer','−3x≥7');check();expect(screen.getByText('✓ Completed with support. Your understanding is growing.')).toBeTruthy();v.unmount();mount('/math/lesson/J84-L04');expect(field('Your answer')).toBe('−3x≥7');
  });
  it('distinguishes a contextual integer maximum from a real upper bound and keeps explanation review human',()=>{
    mount('/math/lesson/J84-L05');click(/06/);enter('Your answer','16/3');check();enter('Your answer','5');check();expect(screen.getByText('✓ Completed with support. Your understanding is growing.')).toBeTruthy();click(/05 Practice/);click('Question 6');enter('Your reasoning','Both endpoints must pass every original condition. Two closed touching bounds keep one point; an open side removes it. Continuous litres allow fractions while whole bags must be integers. Five bags cost seventeen; six cost twenty and exceed eighteen.');expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();fireEvent.click(screen.getByText('Parent review · look at the reasoning'));click('Parent confirms: reasoning makes sense');expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J84-L05'].completedAt).toBeUndefined();
  });
  it('saves eight independent unit-check answers including empty/singleton cases and parent reasoning',()=>{
    const v=mount('/math/unit/J84/check');for(const [n,value] of Object.entries({1:'x<=-1',2:'x<=-2/3',3:'x<=5',4:'(1,3]',5:'none',6:'{0}'})){click(`Question ${n}`);enter('Your answer',value);check();}click('Question 7');click(/^B /);check();click('Question 8');enter('Your reasoning','A full real solution set includes all passing values. Negative scaling reflects order. Closed touching bounds keep a point and open touching bounds may leave none. Count domains filter integers; six bags exceed the original budget, so five is the maximum.');fireEvent.click(screen.getByText('Parent review · look at the reasoning'));click('Parent confirms: reasoning makes sense');expect(screen.getByText(/Recorded 8\/8; 8 independently completed/)).toBeTruthy();v.unmount();mount('/math/unit/J84/check');expect(screen.getByRole('button',{name:'Question 8'}).getAttribute('aria-pressed')).toBe('true');expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J84-L05']).toBeUndefined();
  });
  it('changes retrieval ranges without inheriting the previous input or success evidence',()=>{
    const v=mount('/math/lesson/J84-L03');click(/04 Together/);enter('Your answer','x<-3');check();enter('Your answer','x>-3');check();fireEvent.click(screen.getByRole('link',{name:'Review'}));enter('Your answer','x> -4');check();click(/Save this review/);v.unmount();const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)!);expect(saved.reviews['J84-L03'].round).toBe(1);saved.sessions['J84-L03'].nextReview='2000-01-01T00:00:00.000Z';localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));mount('/math/review');expect(field('Your answer')).toBe('');enter('Your answer','x>=-3/2');check();expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
