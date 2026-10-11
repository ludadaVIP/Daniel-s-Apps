import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { LabMetric, LabOptions, useComparisons, type LabProps } from './LabControls';
import { useAnimation } from './useSimulation';
import { nf } from './newtonModels';
import { waveConditions, waveDefault, waveLimits, waveOptions, waveReading, waveRecord, waveSample, waveCrests, waveTitles, type WaveKind, type Pair, type WaveParameters } from './waveModels';
const word=(mode:LanguageMode,p:Pair)=>mode==='en'?p[1]:p[0];
type Reading=ReturnType<typeof waveReading>;
const line=(points:[number,number][])=>points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ');
function Arrow({x,y,dx,color='#efd28e'}:{x:number;y:number;dx:number;color?:string}) {return Math.abs(dx)<1e-9?<circle cx={x} cy={y} r="3" fill={color}/>:<path d={`M${x} ${y}h${dx}m${-Math.sign(dx)*7} -5l${Math.sign(dx)*7} 5l${-Math.sign(dx)*7} 5`} stroke={color} fill="none" strokeWidth="2"/>;}
function Ruler({x1,x2,y,label}:{x1:number;x2:number;y:number;label:string}) {return <g stroke="#b6a3c8" fill="#ddd1e7"><path d={`M${x1} ${y-5}v10m0-5H${x2}m0-5v10`} fill="none"/><text x={(x1+x2)/2} y={y-12} textAnchor="middle" stroke="none">{label}</text></g>;}
function Scene({m,mode}:{m:Reading;mode:LanguageMode}) {
  const X=(x:number)=>70+48*x,Y=(u:number)=>220-120*u,long=m.kind==='longitudinal',samples=Array.from({length:241},(_,i)=>[X(i/24),Y(waveSample(m,i/24,m.time).displacement)] as [number,number]),crests=waveCrests(m,m.time),mark=waveSample(m,4,m.time);
  return <svg viewBox="0 0 620 400" role="img" aria-label={word(mode,['介质标记与传播位置','Material marker and propagating pattern'])}>
    <text x="25" y="35">t={nf(m.time)} s</text><text x="350" y="35">c={nf(m.speed)} m/s</text>
    <text x="310" y="85" textAnchor="middle">{word(mode,['传播方向','Propagation direction'])}</text><Arrow x={m.direction===1?270:350} y={105} dx={m.direction*80}/>
    {!long&&m.wavelength!==null&&crests.length>1&&<Ruler x1={X(crests[0]!)} x2={X(crests[1]!)} y={145} label={`λ=${nf(m.wavelength)} m`}/>}
    <path d="M70 220H550" stroke="#91a1a7" strokeDasharray="5 5" fill="none"/>
    {long?<>
      {Array.from({length:41},(_,i)=>{const x=i/4,u=waveSample(m,x,m.time);return <g key={i}><circle cx={X(x)} cy="220" r="2" fill="#7b8d96"/><circle cx={X(x+u.displacement)} cy="220" r={i===16?7:4} fill={i===16?'#efd28e':u.strain<0?'#bba4cf':'#a2bec3'}/></g>;})}
      <path d={`M${X(4)} 260v55`} stroke="#91a1a7" strokeDasharray="3 3"/><Arrow x={X(4)} y={290} dx={300*mark.displacement}/>
      <text x="310" y="340" textAnchor="middle">{word(mode,['位移小窗：1 m = 300 px','Displacement inset: 1 m = 300 px'])}</text>
      <text x="310" y="150" textAnchor="middle">{word(mode,['紫：压缩；浅蓝：稀疏','Purple: compressed; blue: expanded'])}</text>
    </>:<>
      <path d={line(samples)} stroke="#bba4cf" strokeWidth="3" fill="none"/>
      {Array.from({length:41},(_,i)=><circle key={i} cx={X(i/4)} cy={Y(waveSample(m,i/4,m.time).displacement)} r="2.5" fill="#a9b9be"/>)}
      <path d={`M${X(4)} 150v140`} stroke="#91a1a7" strokeDasharray="3 3"/>
      <circle cx={X(4)} cy={Y(mark.displacement)} r="7" fill="#efd28e"/>
      <circle cx={X(m.phasePosition)} cy={Y(m.amplitude)} r="5" fill="none" stroke="#a2bec3" strokeWidth="2"/>
      <path d={`M570 220v${-120*m.amplitude}`} stroke="#b6a3c8"/>
      <text x="460" y="310">A={nf(m.amplitude)} m</text>
      <text x="310" y="340" textAnchor="middle">{word(mode,['黄：同一个标记；空心：同一波峰','Gold: same marker; ring: same crest'])}</text>
    </>}
    <text x="70" y="380">0</text><text x="305" y="380">5</text><text x="550" y="380" textAnchor="end">10</text><text x="570" y="380">x / m</text>
    <text x="310" y="60" textAnchor="middle">{word(mode,['标记的平衡位置：x=4 m','Marker equilibrium: x=4 m'])}</text>
  </svg>;
}
function Signal({m,mode}:{m:Reading;mode:LanguageMode}) {
  const max=m.kind==='longitudinal'?0.13:0.55,X=(t:number)=>80+460*t/4,Y=(u:number)=>190-100*u/max,all=Array.from({length:321},(_,i)=>[X(i/80),Y(waveSample(m,4,i/80).displacement)] as [number,number]),now=Array.from({length:161},(_,i)=>{const t=m.time*i/160;return [X(t),Y(waveSample(m,4,t).displacement)] as [number,number];});
  return <svg viewBox="0 0 620 400" role="img" aria-label={word(mode,['固定标记的位移时间图','Displacement–time graph of the fixed marker'])}>
    <text x="25" y="35">u / m</text><text x="310" y="60" textAnchor="middle">{word(mode,['同一个标记的时间记录','Time record of one marker'])}</text>
    <path d="M80 80V300H540M80 190H540" stroke="#91a1a7" fill="none"/>
    <text x="25" y="95">{nf(max)}</text><text x="25" y="195">0</text><text x="25" y="295">−{nf(max)}</text>
    <path d={line(all)} stroke="#8fa0a7" fill="none" strokeWidth="2"/><path d={line(now)} stroke="#efd28e" fill="none" strokeWidth="3"/>
    <circle cx={X(m.time)} cy={Y(m.displacement)} r="5" fill="#efd28e"/>
    <text x="80" y="325">0</text><text x="540" y="325" textAnchor="end">4</text><text x="525" y="355">t / s</text>
    {m.period!==null&&m.period<=4&&<Ruler x1={80} x2={X(m.period)} y={375} label={`T=${nf(m.period)} s`}/>}
    <text x="310" y="75" textAnchor="middle">{word(mode,[m.kind==='longitudinal'?'u是水平位移':'u是竖直位移',m.kind==='longitudinal'?'u is horizontal displacement':'u is vertical displacement'])}</text>
  </svg>;
}
function relation(p:WaveParameters,x:number) {switch(p.kind){case'pulse':return 1+p.speed*x;case'transverse':return p.direction===1?p.speed*x:8-p.speed*x;case'longitudinal':return waveSample(p,x,0).strain;case'wavelength':return 1/x;case'clock':return 1/x;case'amplitude':return 0.5*p.linearDensity*p.speed*(2*Math.PI*p.frequency!)**2*x*x;case'speed':return Math.sqrt(x/p.linearDensity);case'relation':return p.speed/x;}}
function Relation({m,mode}:{m:Reading;mode:LanguageMode}) {
  const k=m.kind,lim=waveLimits[k],spatial=k==='longitudinal',temporal=k==='pulse'||k==='transverse',min=spatial||temporal?0:lim.min,max=spatial?10:temporal?4:lim.max,yMin=spatial?-0.5:0,yMax=spatial?0.5:temporal?10:k==='wavelength'?2:k==='clock'||k==='relation'?2:k==='amplitude'?0.35:2;
  const labels:Record<WaveKind,[string,string,Pair]>={pulse:['t / s','x / m',['脉冲峰的位置','Pulse-peak position']],transverse:['t / s','x / m',['指定波峰的位置','Tracked-crest position']],longitudinal:['x / m','∂u/∂x',['当前疏密应变：负为压缩','Current spacing strain: negative is compression']],wavelength:['λ / m','f / Hz',['同波速下的波长与频率','Wavelength and frequency at fixed speed']],clock:['f / Hz','T / s',['频率与周期','Frequency and period']],amplitude:['A / m','P̄ / W',['同弦同频率的平均传递功率','Mean transmitted power: same string and frequency']],speed:['F / N','c / m/s',['当前线密度的张力与波速','Tension and speed at selected linear density']],relation:['f / Hz','λ / m',['同介质的频率与波长','Frequency and wavelength in one medium']]};
  const xValue=spatial?4:temporal?m.time:k==='wavelength'?m.wavelength!:k==='clock'||k==='relation'?m.frequency!:k==='amplitude'?m.amplitude:m.tension,X=(x:number)=>80+460*(x-min)/(max-min),Y=(y:number)=>250-170*(y-yMin)/(yMax-yMin),fn=(x:number)=>spatial?waveSample(m,x,m.time).strain:relation(m,x),points=Array.from({length:241},(_,i)=>{const x=min+(max-min)*i/240;return [X(x),Y(fn(x))] as [number,number];}),label=labels[k];
  return <svg viewBox="0 0 620 330" role="img" aria-label={word(mode,label[2])}>
    <text x="25" y="30">{label[1]}</text><text x="25" y="55">{word(mode,label[2])}</text>
    <path d="M80 75V250H540" fill="none" stroke="#91a1a7"/>{spatial&&<path d="M80 165H540" stroke="#91a1a7" strokeDasharray="4 4"/>}
    <text x="25" y="85">{nf(yMax)}</text><text x="25" y="255">{nf(yMin)}</text><text x="80" y="275">{nf(min)}</text><text x="540" y="275" textAnchor="end">{nf(max)}</text><text x="510" y="305">{label[0]}</text>
    <path d={line(points)} fill="none" stroke="#bba4cf" strokeWidth="2"/><circle cx={X(xValue)} cy={Y(fn(xValue))} r="5" fill="#efd28e"/>
  </svg>;
}
export function WaveLab({kind,mode,onExplore}:LabProps&{kind:WaveKind}) {
  const [index,setIndex]=useState(0),[custom,setCustom]=useState<number|null>(null),[probe,setProbe]=useState<number|null>(null),[records,setRecords]=useState<number[]>([]),gate=useComparisons(['0','1','2'],onExplore),canonical=custom===null;
  const animation=useAnimation(2.4,()=>{if(canonical){gate.record(String(index));setRecords(old=>[...new Set([...old,index])].sort());}}),value=custom??waveDefault(kind,index),lim=waveLimits[kind],progress=probe??animation.time/2.4,m=waveReading(kind,index,value,progress),reset=()=>{animation.reset();setProbe(null);};
  const metrics: [Pair,string][] = kind==='pulse'?[[['波形速率c','Pattern speed c'],`${nf(m.speed)} m/s`],[['标记平衡位置','Marker equilibrium'], '4 m'],[['标记位移u','Marker displacement u'],`${nf(m.displacement)} m`],[['脉冲峰位置','Pulse peak position'],`${nf(m.phasePosition)} m`]]:kind==='transverse'?[[['传播方向','Propagation direction'],word(mode,m.direction===1?['向右','Right']:['向左','Left'])],[['标记竖直速度','Marker vertical velocity'],`${nf(m.velocity)} m/s`],[['波形速率c','Pattern speed c'],`${nf(m.speed)} m/s`],[['标记水平位置','Marker horizontal position'],'4 m']]:kind==='longitudinal'?[[['标记水平位移','Marker horizontal displacement'],`${nf(m.displacement)} m`],[['局部密度比','Local density ratio'],nf(m.densityRatio)],[['波长λ','Wavelength λ'],`${nf(m.wavelength!)} m`],[['振幅A','Amplitude A'],`${nf(m.amplitude)} m`]]:kind==='wavelength'?[[['波长λ','Wavelength λ'],`${nf(m.wavelength!)} m`],[['峰到相邻谷','Crest to adjacent trough'],`${nf(m.wavelength!/2)} m`],[['源频率f','Source frequency f'],`${nf(m.frequency!)} Hz`],[['波形速率c','Pattern speed c'],`${nf(m.speed)} m/s`]]:kind==='clock'?[[['频率f','Frequency f'],`${nf(m.frequency!)} Hz`],[['周期T','Period T'],`${nf(m.period!)} s`],[['完整周期数','Completed cycles'],String(m.completeCycles)],[['周期数n=ft','Cycle count n=ft'],nf(m.cycles!)]]:kind==='amplitude'?[[['振幅A','Amplitude A'],`${nf(m.amplitude)} m`],[['峰谷差2A','Peak-to-trough span 2A'],`${nf(2*m.amplitude)} m`],[['频率f','Frequency f'],`${nf(m.frequency!)} Hz`],[['平均传递功率','Mean transmitted power'],`${nf(m.power!)} W`]]:kind==='speed'?[[['张力F','Tension F'],`${nf(m.tension)} N`],[['线密度μ','Linear density μ'],`${nf(m.linearDensity)} kg/m`],[['波形速率c','Pattern speed c'],`${nf(m.speed)} m/s`],[['波长λ','Wavelength λ'],`${nf(m.wavelength!)} m`]]:[[ ['频率f','Frequency f'],`${nf(m.frequency!)} Hz`],[['波长λ','Wavelength λ'],`${nf(m.wavelength!)} m`],[['波形速率c','Pattern speed c'],`${nf(m.speed)} m/s`],[['乘积fλ','Product fλ'],`${nf(m.frequency!*m.wavelength!)} m/s`]];
  return <div className="phy-lab phy-forces-lab phy-thermal-lab phy-pressure-lab phy-electric-lab phy-circular-lab phy-wave-lab">
    <div className="phy-lab-toolbar"><span>WAVES / FIRST PRINCIPLES</span><B zh={waveTitles[kind][0]} en={waveTitles[kind][1]} mode={mode}/></div>
    <LabOptions mode={mode} name={['规定比较','Required comparisons']} values={waveOptions[kind].map(([zh,en],id)=>({zh,en,id}))} value={canonical?index:-1} disabled={animation.running} set={i=>{setIndex(i);setCustom(null);reset();}}/>
    <label className="phy-electric-slider"><B zh={lim.label[0]} en={lim.label[1]} mode={mode}/><output>{nf(value)} {lim.unit}</output><input type="range" min={lim.min} max={lim.max} step={lim.step} value={value} disabled={animation.running} aria-label={word(mode,lim.label)} onChange={e=>{setCustom(Number(e.target.value));reset();}}/></label>
    <p className="phy-circular-phase"><B zh={kind==='longitudinal'?'标记水平往返；疏密图案向右':'标记上下往返；波形沿弦传播'} en={kind==='longitudinal'?'Marker moves horizontally; spacing pattern travels right':'Marker moves vertically; pattern travels along string'} mode={mode}/></p>
    <div className="phy-circular-scenes"><Scene m={m} mode={mode}/><Signal m={m} mode={mode}/></div>
    <div className="phy-thermal-metrics">{metrics.map(([title,v],i)=><LabMetric key={i} title={title} mode={mode}>{v}</LabMetric>)}</div>
    <Relation m={m} mode={mode}/>
    <p className="phy-model-note"><B zh="空间尺在同一时刻比较不同位置；时间图一直观察同一个标记。灰线显示完整4 s记录，黄线是已播放部分。纵波位移图的高度表示水平位移。" en="The spatial ruler compares positions at one instant; the time graph follows one marker. Grey shows the full 4 s record; gold shows elapsed time. Height on a longitudinal displacement graph means horizontal displacement." mode={mode}/></p>
    <p className="phy-model-note"><B zh="模型时长4 s，播放2.4秒；显示理想弦或放大的介质示意。" en="Model duration 4 s; playback 2.4 seconds. Ideal string or enlarged medium illustration." mode={mode}/></p>
    <details className="phy-energy-details"><summary><B zh="模型条件与原理来源" en="Model conditions and sources" mode={mode}/></summary><p className="phy-model-note"><B zh={waveConditions[kind][0]} en={waveConditions[kind][1]} mode={mode}/></p><p className="phy-model-note"><a href={`https://openstax.org/books/university-physics-volume-1/pages/${kind==='amplitude'?'16-3-wave-speed-on-a-stretched-string':kind==='pulse'||kind==='transverse'||kind==='longitudinal'?'16-1-traveling-waves':'16-2-mathematics-of-waves'}`} target="_blank" rel="noreferrer"><B zh="原理延伸 · OpenStax" en="Explore the principle · OpenStax" mode={mode}/></a></p></details>
    <label className="phy-electric-slider"><B zh="检查进度" en="Inspection progress" mode={mode}/><output>{nf(progress*100)}%</output><input type="range" min="0" max="100" step="2.5" value={progress*100} disabled={animation.running} aria-label={word(mode,['检查进度','Inspection progress'])} onChange={e=>setProbe(Number(e.target.value)/100)}/></label>
    <div className="phy-lab-actions"><button disabled={animation.running} onClick={()=>{setProbe(null);animation.start();}}><B zh="完整观察并记录" en="Observe motion and record" mode={mode}/></button><button disabled={animation.running} onClick={reset}><B zh="回到起点" en="Back to start" mode={mode}/></button></div>
    <p className="phy-lab-progress" role="status"><B zh={`已完成 ${gate.count}/3 个规定比较；检查时刻与自由设置不代替完整观察。`} en={`${gate.count}/3 required comparisons complete; inspection and free settings do not replace full observation.`} mode={mode}/></p>
    {records.length>0&&<div className="phy-data-table"><table><caption><B zh="完整观察的模型记录" en="Fully observed model records" mode={mode}/></caption><thead><tr><th><B zh="规定比较" en="Required comparison" mode={mode}/></th><th><B zh="读数与检查" en="Readings and checks" mode={mode}/></th></tr></thead><tbody>{records.map(i=><tr key={i}><td>{waveOptions[kind][i]![0]===waveOptions[kind][i]![1]?waveOptions[kind][i]![0]:<B zh={waveOptions[kind][i]![0]} en={waveOptions[kind][i]![1]} mode={mode}/>}</td><td>{waveRecord(kind,i)}</td></tr>)}</tbody></table></div>}
  </div>;
}
