import { describe, expect, it } from 'vitest';
import { decodeStoryProject, emptyStoryProject, editStoryCase, mean, plantObservations, storyCaseReady, storyEvidence, storyModelValue, storyStageQuestions, storyTopics, type StoryTopic } from './storyProject';
import { storySceneSvg, storySvg } from './storySvg';
import { decodeProgress, emptyProgress, storyStageOutcome, withMission, withStoryProject } from './progress';
import { emptyProject } from './project';
import { emptyLeafProject } from './leafProject';
import { emptyEcoProject } from './ecoProject';

function ready(topic: StoryTopic) {
  const d=emptyStoryProject(),c=d.cases[topic]; d.topic=topic;
  c.frames=c.frames.map((_,i)=>({zh:`第${i+1}格：解释证据与机制。`,en:''}));
  c.citations=storyEvidence(topic,c.input).slice(0,2).map((r)=>r.id);
  for(const key of ['observation','assumptions','chain','variable','measured','controls','challenge','zh'] as const)c[key]=`${key}：自己的解释与检验方案`;
  c.savedAt=10;
  return d;
}
describe('three-topic scientific storyboard',()=>{
  it('supports each substantive topic independently, preserves drafts on switching, and invalidates only edited work',()=>{
    let d=ready('plant'); d.cases.enzyme=ready('enzyme').cases.enzyme; d.cases.ecology=ready('ecology').cases.ecology;
    for(const topic of storyTopics)expect(storyCaseReady(topic,d.cases[topic])).toBe(true);
    d=decodeStoryProject({...d,topic:'enzyme'});
    expect(d.cases.plant.savedAt).toBe(10);
    d=editStoryCase(d,'enzyme',{chain:'修订机制'});
    expect(d.cases.enzyme.savedAt).toBeUndefined(); expect(d.cases.plant.savedAt).toBe(10);
    expect(d.cases.ecology.frames[3]!.zh).toContain('第4格');
    expect(decodeStoryProject(d).cases.enzyme.chain).toBe('修订机制');
  });
  it('checks structure without grading prose or requiring English; missing evidence and test-plan links do not qualify',()=>{
    const d=ready('plant'),c=d.cases.plant;
    expect(storyCaseReady('plant',c)).toBe(true); expect(c.en).toBe('');
    expect(storyCaseReady('plant',{...c,frames:c.frames.slice(1)})).toBe(false);
    expect(storyCaseReady('plant',{...c,citations:[c.citations[0]!,c.citations[0]!]})).toBe(false);
    expect(storyCaseReady('plant',{...c,citations:['plant-0','forged-999']})).toBe(false);
    expect(storyCaseReady('plant',{...c,challenge:' '})).toBe(false);
    expect(storyCaseReady('plant',{...c,repeats:1})).toBe(false);
    const partial=emptyStoryProject(); partial.cases.plant.savedAt=100;
    expect(decodeStoryProject(partial).cases.plant.savedAt).toBeUndefined();
  });
  it('rejects malformed enums, frames, numbers, excessive writing and invalid answer indices',()=>{
    for(const mutate of [
      (d:ReturnType<typeof emptyStoryProject>)=>{Object.assign(d,{topic:'unknown'});},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.plant.frames=[];},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.plant.input=NaN;},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.plant.input=99;},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.enzyme.repeats=Infinity;},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.ecology.repeats=2.5;},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.plant.frames[0]!.en='x'.repeat(1201);},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.cases.plant.citations=['plant-0','999 grams'];},
      (d:ReturnType<typeof emptyStoryProject>)=>{d.answers['S04-q6']=3;},
    ]){const d=emptyStoryProject();mutate(d);expect(()=>decodeStoryProject(d)).toThrow();}
    expect(()=>decodeStoryProject({topic:'plant',cases:{},answers:{}})).toThrow();
    const d=emptyStoryProject();for(const q of storyStageQuestions)d.answers[q.id]=q.correct;
    expect(decodeStoryProject(d).answers).toEqual(d.answers);expect(storyStageQuestions).toHaveLength(6);
  });
  it('computes dry-mass cohort differences separately from photosynthesis and uses declared enzyme/ecology models',()=>{
    expect(plantObservations.map((r)=>mean(r.final)-mean(r.initial))).toEqual([expect.closeTo(.1),expect.closeTo(.26)]);
    for(const row of plantObservations){expect(row.baselineCohort).not.toBe(row.endpointCohort);expect(row.initial).toHaveLength(3);expect(row.final).toHaveLength(3);}
    expect(storyEvidence('plant',20).map((r)=>r.value)).toEqual([expect.closeTo(.30),expect.closeTo(.46)]);
    expect(storyModelValue('plant',20)).toBe(40);expect(storyModelValue('plant',60)).toBe(100);
    expect(storyEvidence('enzyme',5).map((r)=>r.value)).toEqual([expect.closeTo(16.76891097,4),80,80,6.4]);
    expect(storyModelValue('ecology',0)).toBeCloseTo(20/30);
    expect(storyModelValue('ecology',1)).toBeCloseTo(30/45);
    expect(storyEvidence('ecology',0).find((r)=>r.id==='ecology-drought-single-30')?.value).toBe(88);
    expect(storyEvidence('ecology',1).find((r)=>r.id==='ecology-flood-redundant-30')?.value).toBe(92);
  });
  it('round-trips old project shapes and counts only own 24 lessons, six tasks, saved case and six answered checks',()=>{
    let p=emptyProgress();p.projects={S01:emptyProject(),S02:emptyLeafProject(),S03:emptyEcoProject()};
    const old=structuredClone(p.projects), d=ready('enzyme');p=withStoryProject(p,d);
    for(let n=1;n<=72;n++)p.sessions[`L${String(n).padStart(3,'0')}`]={step:3,note:'旧记录',completedAt:1};
    expect(storyStageOutcome(p)).toEqual({lessons:0,missions:0,complete:false});
    for(let n=73;n<=96;n++)p.sessions[`L${n.toString().padStart(3,'0')}`]={step:3,note:'新记录',completedAt:1};
    for(let n=19;n<=24;n++)p=withMission(p,`U${n}`,{object:'主张',evidence:'证据',reasoning:'机制',savedAt:2});
    for(const q of storyStageQuestions)d.answers[q.id]=q.correct;
    p=withStoryProject(p,d);expect(storyStageOutcome(p).complete).toBe(true);
    const restored=decodeProgress(JSON.stringify(p));expect(restored.version).toBe(1);
    expect(restored.projects.S01).toEqual(old.S01);expect(restored.projects.S02).toEqual(old.S02);expect(restored.projects.S03).toEqual(old.S03);
    expect(restored.projects.S04).toEqual(d);expect(restored.sessions.L001?.note).toBe('旧记录');
    delete d.answers['S04-q6'];expect(storyStageOutcome(withStoryProject(p,d)).complete).toBe(false);
    d.answers['S04-q6']=0;expect(storyStageOutcome(withStoryProject(p,d)).complete).toBe(true);
    d.answers['S04-q5']=0;expect(storyStageOutcome(withStoryProject(p,d)).complete).toBe(false);
    expect(storyStageOutcome(withStoryProject(p,editStoryCase(ready('enzyme'),'enzyme',{chain:'改动'}))).complete).toBe(false);
  });
  it('exports four distinct illustrated frames and every long caption, record and field with escaped XML',()=>{
    for(const topic of storyTopics){
      const c=ready(topic).cases[topic], attack='<script>alert("x")</script>&尾';
      c.frames[3]!.zh='中文说明'.repeat(150)+attack;
      c.frames[3]!.en='Long scientific caption with spaces. '.repeat(25)+'END-EN';
      c.challenge='最后一项不得丢失 END-CHALLENGE';
      const svg=storySvg(topic,c);
      expect(svg).toContain('&lt;script&gt;');expect(svg).not.toContain('<script>');expect(svg).not.toContain('foreignObject');
      expect(svg.replace(/<[^>]+>/g,'')).toContain('END-CHALLENGE');
      expect(svg.replace(/<[^>]+>/g,'')).toContain('END-EN');
      for(const record of storyEvidence(topic,c.input))expect(svg).toContain(record.id);
      const geometry=Array.from({length:4},(_,i)=>storySceneSvg(topic,i,c.input).replace(/<text[\s\S]*?<\/text>/g,'').replace(/<title>[\s\S]*?<\/title>/g,''));
      expect(new Set(geometry).size).toBe(4);
      expect(Number(svg.match(/height="(\d+)"/)?.[1])).toBeGreaterThan(2500);
      const flattened=svg.replace(/<[^>]+>/g,'');expect(flattened.match(/中文说明/g)?.length).toBe(150);
      expect(flattened.match(/Long scientific caption with spaces\./g)?.length).toBe(25);
    }
  });
});
