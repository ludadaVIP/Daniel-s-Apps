import{describe,expect,it}from'vitest';
import{protectionCircuit,rustComparison,rustDays,rustRecords}from'./corrosionEvidence';
describe('rust comparisons and protective coupling',()=>{
  it('audits all 432 question/record/day combinations against the four isolated treatments',()=>{
    let fair=0,supported=0,notYet=0;
    for(let q=0;q<4;q++)for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(const day of [1,3,5]){
      const l=rustComparison(q,a,b,day),treatment=q+1;
      const expected=(a===0&&b===treatment)||(b===0&&a===treatment);
      expect(l.fair).toBe(expected);
      expect(l.different).toBe(l.firstLevel!==l.secondLevel);
      if(l.fair){fair++;if(l.different)supported++;else notYet++;}else expect(l.conclusion).toBe('not-controlled');
    }
    expect({fair,supported,notYet}).toEqual({fair:24,supported:18,notYet:6});
  });
  it('keeps a fair early comparison inconclusive when no visible difference has appeared yet',()=>{
    expect(rustComparison(0,0,1,1)).toMatchObject({fair:true,different:false,conclusion:'not-yet-visible'});
    expect(rustComparison(0,0,1,5)).toMatchObject({fair:true,different:true,conclusion:'supported'});
  });
  it('does not attribute a confounded comparison to a target treatment or count one record twice as control',()=>{
    expect(rustComparison(2,0,5,5)).toMatchObject({fair:false,changed:['temperature','area'],conclusion:'not-controlled'});
    expect(rustComparison(0,0,0,5)).toMatchObject({fair:false,changed:[]});
  });
  it('uses authored ordinal observations with a common baseline and matched observation days',()=>{
    expect(rustDays).toEqual([0,1,3,5]);
    for(const r of rustRecords){expect(r.levels).toHaveLength(4);expect(r.levels[0]).toBe(0);for(const level of r.levels)expect([0,1,2,3]).toContain(level);}
    expect(rustRecords[3]!.levels).toEqual(rustRecords[5]!.levels);
    expect(rustComparison(2,3,5,5).fair).toBe(false);
  });
  it('requires both metal and electrolyte connections in all eight coupling states',()=>{
    for(const metal of ['Zn','Cu'] as const)for(const electronic of [false,true])for(const ionic of [false,true]){
      const l=protectionCircuit(metal,electronic,ionic);
      expect(l.coupled).toBe(electronic&&ionic);
      if(!l.coupled)expect(l).toMatchObject({donor:'none',cathode:'none',effect:'uncoupled'});
    }
  });
  it('reverses the cross-metal donor when zinc is replaced by copper without changing the pathways',()=>{
    expect(protectionCircuit('Zn',true,true)).toMatchObject({donor:'Zn',cathode:'Fe',effect:'sacrificial'});
    expect(protectionCircuit('Cu',true,true)).toMatchObject({donor:'Fe',cathode:'Cu',effect:'iron-at-risk'});
  });
  it('does not turn an uncoupled neighbouring zinc block into sacrificial protection',()=>{
    expect(protectionCircuit('Zn',false,true).effect).toBe('uncoupled');
    expect(protectionCircuit('Zn',true,false).effect).toBe('uncoupled');
  });
  it('rejects unsupported records, questions, days and companion metals',()=>{
    for(const args of [[4,0,1,5],[0,-1,1,5],[0,0,6,5],[0,0,1,2],[0,0,1,0]])expect(()=>rustComparison(...args as [number,number,number,number])).toThrow();
    expect(()=>protectionCircuit('Mg' as 'Zn',true,true)).toThrow();
  });
});
