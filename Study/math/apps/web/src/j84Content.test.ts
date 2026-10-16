import { describe,it,expect } from 'vitest';
import { j84Lessons,j84CheckQuestions,j84ReviewQuestion } from './content/J84';
import { lessons,curriculum,unitChecks,reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { readRational } from './rationalModels';
import { textR } from './algebraModels';
import { parseInequality,inequalityAt,solveInequality,parseRealSet,checkRealSet,intervalContains,intersectIntervals,sameInterval,realSetText,auditInequality,transformInequality,inequalityTrace,relationInequalities,oneStepInequalities,multiStepInequalities,intersectionInequalities,type InequalitySign } from './inequalityModels';
const markdown=import.meta.glob('../../../content/lessons/J84-*.md',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
const all=[...j84Lessons.flatMap(l=>[l.guided,...l.questions,l.exit]),...j84CheckQuestions];
const set=(s:string)=>parseRealSet(s)!;
const truth=(l:number,sign:string,r:number)=>sign==='<'?l<r:sign==='<='?l<=r:sign==='>'?l>r:sign==='>='?l>=r:l===r;
const signs:InequalitySign[]=['<','<=','>','>=','='];
describe('J84 exact real sets and justified inequality operations',()=>{
  it('registers the five planned lessons with bilingual bodies, two examples each and prior skill bridges',()=>{
    const units=curriculum.flatMap(s=>s.units),registry=units.flatMap(u=>u.lessons),planned=units.find(u=>u.id==='J84')!;
    expect(registry).toHaveLength(358);
    expect(registry.filter(l=>l.available).map(l=>l.id).sort()).toEqual(lessons.map(l=>l.id).sort());
    expect(planned.lessons.map(l=>({id:l.id,title:l.title}))).toEqual(j84Lessons.map(l=>({id:l.id,title:l.title})));
    expect(unitChecks.J84.questions).toHaveLength(8);
    for(const l of j84Lessons){expect(l.contentStatus).toBe('ready');expect(l.questions).toHaveLength(6);expect(l.keywords).toHaveLength(3);expect(l.minutes).toBeLessThanOrEqual(20);
      for(const p of [...l.prerequisites,l.parent.bridge]){expect(lessons.find(v=>v.id===p)).toBeTruthy();expect(lessons.findIndex(v=>v.id===p)).toBeLessThan(lessons.indexOf(l));}
      const [zh,en]=markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');expect(zh!.length).toBeGreaterThan(700);expect(en!.length).toBeGreaterThan(1400);expect(zh!.match(/### 例/g)).toHaveLength(2);expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id,0)).toEqual(j84ReviewQuestion(l.id,0));
    }
  });
  it('executes accepted/rejected examples for all 48 complete bilingual items without auto-scoring explanations',()=>{
    expect(all).toHaveLength(48);expect(new Set(all.map(q=>q.id)).size).toBe(48);
    for(const [kind,count] of Object.entries({'real-set':33,number:3,choice:6,explain:6}))expect(all.filter(q=>q.answer.kind===kind)).toHaveLength(count);
    for(const q of all){expect(q.stem.zh.length).toBeGreaterThan(5);expect(q.stem.en.length).toBeGreaterThan(10);expect(q.hints).toHaveLength(2);expect(q.solution.zh.length).toBeGreaterThan(10);expect(q.solution.en.length).toBeGreaterThan(15);if(q.answer.kind==='explain'){expect(checkAnswer('intersection negative endpoint',q.answer)).toBeNull();continue;}for(const raw of q.answerChecks!.accepted)expect(checkAnswer(raw,q.answer),`${q.id}: ${raw}`).toBe(true);for(const raw of q.answerChecks!.rejected)expect(checkAnswer(raw,q.answer),`${q.id} rejects ${raw}`).toBe(false);}
  });
  it('independently records the 36 constructed answers, choices and integer-budget maximum',()=>{
    const values=[['x<3','x>=-2','x<=4','x>-1','x>=1/2','x>-4'],['x<=4','x>3','x>-2','x<=6','x>-3','x<=4.5'],['x>-3','x<=-2','x<-6','4','-1.5','x>=-1.25'],['x<=7','x<-8','所有实数','无解','x<=-7/3','x<4/3'],['[-1,4)','无解','{2}','∅','[0,3.5]','5']];
    j84Lessons.forEach((l,i)=>{[l.guided,...l.questions.slice(1,5),l.exit].forEach((q,j)=>expect(checkAnswer(values[i]![j]!,q.answer),q.id).toBe(true));expect(checkAnswer(String([2,1,0,2,1][i]),l.questions[0]!.answer)).toBe(true);});
    ['x<=-1','x<=-2/3','x<=5','(1,3]','∅','{0}'].forEach((v,i)=>expect(checkAnswer(v,j84CheckQuestions[i]!.answer)).toBe(true));
    expect(3*5+2).toBeLessThanOrEqual(18);expect(3*6+2).toBeGreaterThan(18);
  });
  it('accepts exact equivalent interval/affine forms but separates open ends, singleton, samples and real domains',()=>{
    for(const raw of ['3>x','2x<6','x+1<4','-x>-3','(-inf,3)','（x）＜3'])expect(checkRealSet(raw,'x<3'),raw).toBe(true);
    for(const raw of ['x<=3','3','x=3','{0,1,2}','all rational numbers','x<3 or x>1','[3,inf]'])expect(checkRealSet(raw,'x<3'),raw).toBe(false);
    for(const raw of ['-1<=x<4','x<4;x>=-1','4>x>=-1','[-1,4)','x>=-1 and x<4','x>=-1且x<4'])expect(checkRealSet(raw,'-1<=x<4'),raw).toBe(true);
    expect(checkRealSet('x=2','x>=2;x<=2')).toBe(true);expect(checkRealSet('{2}','x>2;x<=2')).toBe(false);
    expect(checkRealSet('所有实数','0<=1')).toBe(true);expect(checkRealSet('∅','0<0')).toBe(true);expect(checkRealSet('x<=-2.33','x<=-7/3')).toBe(false);
  });
  it('checks 3,125 integer affine relations against 53,125 independent half-step truth evaluations',()=>{
    const bad:string[]=[];let relations=0,evaluations=0;
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)for(let c=-2;c<=2;c++)for(let d=-2;d<=2;d++)for(const sign of signs){
      const source=`${a}x+(${b})${sign}${c}x+(${d})`,s=solveInequality(inequalityAt(source));relations++;
      for(let p=-8;p<=8;p++){const expected=truth(a*p+2*b,sign,c*p+2*d),actual=intervalContains(s,readRational(`${p}/2`));evaluations++;if(actual!==expected)bad.push(`${source} at ${p}/2`);}
    }
    expect(relations).toBe(3125);expect(evaluations).toBe(53125);expect(bad).toEqual([]);
  });
  it('intersects 400 strict/inclusive bound pairs including same-point touches and independently tests 16,400 quarter steps',()=>{
    const bad:string[]=[];let cases=0,checks=0;
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)for(const s1 of signs.slice(0,4))for(const s2 of signs.slice(0,4)){
      const one=set(`x${s1}${a}`),two=set(`x${s2}${b}`),both=intersectIntervals(one,two);cases++;
      expect(sameInterval(both,intersectIntervals(two,one))).toBe(true);
      for(let p=-20;p<=20;p++){checks++;if(intervalContains(both,readRational(`${p}/4`))!==(truth(p,s1,4*a)&&truth(p,s2,4*b)))bad.push(`${a}${s1},${b}${s2}:${p}`);}
    }
    expect(cases).toBe(400);expect(checks).toBe(16400);expect(bad).toEqual([]);
    expect(realSetText(set('x>=2;x<=2'))).toBe('x = 2');expect(realSetText(set('x>2;x<=2'))).toBe('∅');expect(realSetText(set('x>-2;x>=1'))).toBe('x ≥ 1');
  });
  it('retains exact thirds and classifies constant truths with strictness instead of dividing by zero',()=>{
    for(const [source,answer] of [['-3(x+2)>=1','x<=-7/3'],['(x-1)/3>(x+2)/2','x<-8'],['0x<=0','all reals'],['0x<0','none'],['2(x+1)<=2x+3','all reals'],['2(x+1)<2x+1','none']])expect(checkRealSet(source!,answer!)).toBe(true);
    const p=set('x=1/3');expect(intervalContains(p,readRational('0.333333'))).toBe(false);expect(intervalContains(p,readRational('2/6'))).toBe(true);
  });
  it('audits the same exact candidate in originals, including equality boundaries, fractions and off-window values',()=>{
    expect(auditInequality(inequalityAt('x<3'),'3')!.pass).toBe(false);expect(auditInequality(inequalityAt('x<=3'),'3')!.pass).toBe(true);
    expect(auditInequality(inequalityAt('-3(x+2)>=1'),'-7/3')).toEqual({x:'-7/3',left:'1',right:'1',pass:true});
    expect(auditInequality(inequalityAt('x<3'),'-100')!.pass).toBe(true);expect(auditInequality(inequalityAt('x<3'),'1/0')).toBeNull();
  });
  it('checks reversible operations, sign reversal and invalid zero/unknown factors without relying on a few input samples',()=>{
    let valid=0;
    for(const source of oneStepInequalities)for(const op of ['+','−','×','÷'] as const)for(const k of [-3,-2,-1,1,2,3]){
      const reverse=(op==='×'||op==='÷')&&k<0,r=transformInequality(inequalityAt(source),op,String(k),'both',reverse);
      expect(r.safeRule).toBe(true);expect(r.preserves).toBe(true);valid++;
      const wrong=transformInequality(inequalityAt(source),op,String(k),'both',!reverse);expect(wrong.safeRule).toBe(false);expect(wrong.preserves).toBe(false);
    }
    expect(valid).toBe(96);
    const e=inequalityAt('x+3<=7');expect(transformInequality(e,'−','3','left',false).preserves).toBe(false);
    expect(transformInequality(inequalityAt('x<3'),'+','x','both',false).safeRule).toBe(true);
    for(const [op,amount,reason] of [['×','0','zero-factor'],['÷','0','zero-divisor'],['×','x','unknown-sign'],['÷','-x','unknown-sign'],['+','x^2','invalid']] as const){const r=transformInequality(e,op,amount,'both',false);expect(r.next).toBeNull();expect(r.reason).toBe(reason);}
    const coincidence=transformInequality(inequalityAt('0<1'),'+','0','left',false);expect(coincidence.preserves).toBe(true);expect(coincidence.safeRule).toBe(false);
  });
  it('keeps every traced step equivalent, preserves negative division and classifies vanishing variables',()=>{
    const expected=['x ≤ 7','x < -8','ℝ','∅','x ≤ -7/3'];
    multiStepInequalities.forEach((source,i)=>{const rows=inequalityTrace(inequalityAt(source));expect(rows).toHaveLength(4);expect(rows.at(-1)!.text).toBe(expected[i]);for(const r of rows)expect(checkRealSet(r.text,source),r.text).toBe(true);});
    for(const source of [...relationInequalities,...oneStepInequalities,...multiStepInequalities,...intersectionInequalities.map(r=>r.join(';'))])expect(checkRealSet(realSetText(set(source)),source)).toBe(true);
  });
  it('verifies all 400 review rounds against independently derived bounds or constant truth outcomes',()=>{
    for(let i=0;i<5;i++)for(let k=0;k<80;k++){
      const q=j84ReviewQuestion(`J84-L0${i+1}`,k),n=k%9-4,d=[1,2,3][k%3]!,sign=['<','<=','>','>='][k%4]!,flip=sign.startsWith('<')?sign.replace('<','>'):sign.replace('>','<');
      let expected:string;if(i<2)expected=`x${sign}${n}/${d}`;else if(i===2)expected=`x${flip}${n}/${d}`;else if(i===3)expected=k%6===0?'all reals':k%6===1?'none':`x${flip}${-n}/${d}`;else expected=k%4===1?'none':k%4===2?`x=${n}/${d}`:`${n}/${d}${k%4===3?'<':'<='}x<=${n+3}/${d}`;
      expect(checkAnswer(expected,q.answer),q.id).toBe(true);for(const raw of q.answerChecks!.accepted)expect(checkAnswer(raw,q.answer)).toBe(true);for(const raw of q.answerChecks!.rejected)expect(checkAnswer(raw,q.answer)).toBe(false);
    }
  });
  it('rejects malformed, nonlinear, executable and out-of-scope inputs rather than evaluating arbitrary text',()=>{
    for(const raw of ['','x','x<>2','x<1<2<3','x<3;','x<3;;x>1','x<3 or x>5','x*x<4','1/x>0','x<1/0','y<2','Math.random()<1','x<2;process.exit()','[0,inf]','[-inf,0]','{1,2}','x'.repeat(601)])expect(parseRealSet(raw),raw).toBeNull();
    expect(parseInequality('x<2<3')).toBeNull();expect(()=>inequalityAt('x')).toThrow();
    for(const [id,k] of [['J84-L00',0],['J83-L01',0],['J84-L01',-1],['J84-L01',0.1],['J84-L01',100001]] as const)expect(()=>j84ReviewQuestion(id,k)).toThrow();
    expect(textR(readRational('-2/6'))).toBe('-1/3');
  });
});
