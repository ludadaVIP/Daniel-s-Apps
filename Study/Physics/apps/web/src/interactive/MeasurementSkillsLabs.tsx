import { useState, type ReactNode } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import {
  displacedVolume, blockVolume, calibrationReadings, referenceLength,
  repeatTimes, trialSummary, paperReading, type Trial,
} from './measurementSkills';
type Props = { mode: LanguageMode; onExplore?: () => void };
function Frame({ mode, zh, en, children, noteZh, noteEn }: Props & {
  zh: string; en: string; children: ReactNode; noteZh: string; noteEn: string;
}) {
  return <div className="phy-lab">
    <div className="phy-lab-toolbar"><span className="phy-lab-label">MEASURE / INVESTIGATE</span><B zh={zh} en={en} mode={mode} /></div>
    {children}
    <p className="phy-model-note"><B zh={noteZh} en={noteEn} mode={mode} /></p>
  </div>;
}
function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return <button className={selected ? 'selected' : ''} aria-pressed={selected} onClick={onClick}>{children}</button>;
}
function Record({ mode, onClick }: { mode: LanguageMode; onClick: () => void }) {
  return <button className="phy-button" onClick={onClick}><B zh="记录这次观察" en="Record this observation" mode={mode} /></button>;
}
function Result({ children }: { children: ReactNode }) {
  return <div className="phy-lab-result" aria-live="polite">{children}</div>;
}
function useCases(required: string[], onExplore?: () => void) {
  const [seen, setSeen] = useState<string[]>([]);
  return { seen, record: (...keys: string[]) => {
    const next = [...new Set([...seen, ...keys])];
    setSeen(next);
    if (required.every((c) => next.includes(c))) onExplore?.();
  }, count: required.filter((c) => seen.includes(c)).length };
}
export function VolumeLab({ mode, onExplore }: Props) {
  const [shape, setShape] = useState<'stone' | 'block'>('stone'),
    [immersed, setImmersed] = useState(false), [unit, setUnit] = useState<'mL' | 'cm³'>('mL');
  const cases = useCases(['stone', 'block', 'cm³'], onExplore),
    volume = shape === 'stone' ? 18 : blockVolume(2, 3, 4),
    reading = 40 + (immersed ? volume : 0), levelY = 255 - reading * 2;
  const label = mode === 'en' ? 'Cylinder before and after full immersion' : '完全浸没前后的量筒读数';
  return <Frame mode={mode} zh="水面告诉你：占了多少空间？" en="What occupied space does the water reveal?"
    noteZh="理想示例：初始水 40 mL，石头 18 cm³，长方体 2×3×4 cm。不吸水、不溶解、无气泡或溢水；量筒竖直。凹液面在视线同高处读最低点，图中液面简化。物体图标不按体积比例绘制。"
    noteEn="Ideal example: initial water 40 mL; stone 18 cm³; block 2×3×4 cm. No absorption, dissolution, bubbles or spills; cylinder vertical. Read a concave meniscus at its bottom at eye level; the diagram simplifies it. Object icons are not to volume scale.">
    <div className="phy-lab-controls"><div className="phy-segment" role="group" aria-label={mode === 'en' ? 'Object' : '物体'}>
      <Choice selected={shape === 'stone'} onClick={() => {setShape('stone');setImmersed(false);}}><B zh="小石头" en="Stone" mode={mode}/></Choice>
      <Choice selected={shape === 'block'} onClick={() => {setShape('block');setImmersed(false);}}><B zh="长方体" en="Block" mode={mode}/></Choice>
    </div><div className="phy-segment" role="group" aria-label={mode === 'en' ? 'Volume unit' : '体积单位'}>{(['mL', 'cm³'] as const).map((u) => <Choice key={u} selected={unit === u} onClick={() => setUnit(u)}>{u}</Choice>)}</div></div>
    <svg viewBox="0 0 620 300" className="phy-simulation" role="img" aria-label={label}>
      <path d="M225 30v225h140V30" fill="#f5f1fa" stroke="#b49cca" strokeWidth="3"/>
      <rect x="228" y={levelY} width="134" height={255-levelY} fill="#b4d8da" opacity=".7"/>
      <path d="M228 175h134" stroke="#87b7ba" strokeDasharray="5 5"/>
      {Array.from({length:21},(_,i) => <g key={i}><path d={`M365 ${255-i*10}h${i%2 ? 7:14}`} stroke="#a38cb7"/>{i%4===0 && <text x="389" y={260-i*10} fill="#79698b" fontSize="15">{i*5}</text>}</g>)}
      <text x="295" y="283" textAnchor="middle" fill="#79698b" fontSize="15">{unit}</text>
      <g transform={`translate(290,${immersed ? 221 : 70})`}>
        {shape === 'stone' ? <path d="m-30 0 8-20 31-6 21 22-7 22-36 2Z" fill="#bcad94" stroke="#a19077"/> : <><rect x="-27" y="-24" width="54" height="43" fill="#c7afd8"/><path d="m-27-24 15-10h54l-15 10m0 0 15-10v43l-15 10" fill="#a990bd"/></>}
      </g>
      <path d={`M365 ${levelY}h98`} stroke="#69999e" strokeWidth="2"/>
      <text x="472" y={levelY+5} fill="#537f84" fontSize="20">{reading} {unit}</text>
      <text x="60" y="160" fill="#79698b" fontSize="16">40 {unit}</text><path d="M138 175h82" stroke="#a4babe" strokeDasharray="4 4"/>
      {shape === 'block' && <text x="470" y="245" fill="#8c6ba4" fontSize="15">2 × 3 × 4 cm</text>}
    </svg>
    <div className="phy-lab-controls"><button className="phy-button secondary" onClick={() => setImmersed(!immersed)}><B zh={immersed ? '取出物体' : '完全浸入'} en={immersed ? 'Remove object' : 'Fully submerge'} mode={mode}/></button>
      <button className="phy-button" disabled={!immersed} onClick={() => {cases.record(shape, ...(unit==='cm³' ? ['cm³'] : []));}}><B zh="记录前后读数" en="Record both readings" mode={mode}/></button>
    </div>
    <Result><B zh={immersed ? `${reading} − 40 = ${displacedVolume(40, reading)} ${unit}` : '先读 40，再完全浸入物体。'} en={immersed ? `${reading} − 40 = ${displacedVolume(40, reading)} ${unit}` : 'Read 40 first, then fully submerge the object.'} mode={mode}/></Result>
    <p className="phy-skill-check"><B zh={`已比较 ${cases.count}/3：石头、长方体、cm³ 单位。`} en={`Compared ${cases.count}/3: stone, block and cm³ units.`} mode={mode}/></p>
  </Frame>;
}
export function AccuracyLab({ mode, onExplore }: Props) {
  const [biased, setBiased] = useState(true), [fine, setFine] = useState(true);
  const cases = useCases(['biased', 'coarse', 'fine'], onExplore),
    readings = calibrationReadings(biased ? 1 : 0, fine ? .1 : 1),
    summary = trialSummary(readings.map(value => ({value,invalid:false}))),
    x = (n:number) => 70 + (n-9)*160;
  return <Frame mode={mode} zh="已知参考 10 cm · 检查共同偏差" en="Known 10 cm reference · Check shared bias"
    noteZh="预设教学读数：细刻度为 0.1 cm，粗刻度为 1 cm；模型按最邻近刻度显示。不确定度并不只等于最小刻度；真实工具可有估读、方法误差和参考值不确定度。参考线在本模型中固定为 10 cm。"
    noteEn="Preset teaching readings: fine divisions 0.1 cm; coarse divisions 1 cm, rounded to the nearest mark. Uncertainty is not simply the division size; real readings may involve interpolation, method errors and reference uncertainty. This model fixes the reference at 10 cm.">
    <div className="phy-lab-controls"><div className="phy-segment" role="group" aria-label={mode==='en'?'Offset':'读数偏移'}>
      <Choice selected={biased} onClick={()=>setBiased(true)}><B zh="偏移 +1 cm" en="Offset +1 cm" mode={mode}/></Choice>
      <Choice selected={!biased} onClick={()=>setBiased(false)}><B zh="修正偏移" en="Offset corrected" mode={mode}/></Choice>
    </div><div className="phy-segment" role="group" aria-label={mode==='en'?'Ruler divisions':'尺子刻度'}>
      <Choice selected={!fine} onClick={()=>setFine(false)}><B zh="粗：1 cm" en="Coarse: 1 cm" mode={mode}/></Choice>
      <Choice selected={fine} onClick={()=>setFine(true)}><B zh="细：0.1 cm" en="Fine: 0.1 cm" mode={mode}/></Choice>
    </div></div>
    <svg viewBox="0 0 620 270" className="phy-simulation" role="img" aria-label={mode==='en'?'Three readings compared with the 10 cm reference':'三次读数与10厘米参考值比较'}>
      <rect x={x(10)-5} y="35" width="10" height="182" fill="#bdd0bd" opacity=".65"/>
      <text x={x(10)} y="25" textAnchor="middle" fontSize="15" fill="#6b826d">10 cm</text>
      <path d="M70 210h480" stroke="#a998b8"/>
      {Array.from({length:fine?31:4},(_,i)=> {const n=9+i*(fine?.1:1);return <g key={i}><path d={`M${x(n)} 210v${i%(fine?10:1)===0?13:6}`} stroke="#a998b8"/>{i%(fine?10:1)===0 && <text x={x(n)} y="247" textAnchor="middle" fontSize="15" fill="#79698b">{n.toFixed(0)}</text>}</g>;})}
      {readings.map((r,i)=><g key={i}><path d={`M70 ${65+i*48}h480`} stroke="#e0d5e9" strokeDasharray="4 5"/><circle cx={x(r)} cy={65+i*48} r="10" fill="#ab8bc5"/><text x={x(r)+20} y={71+i*48} fontSize="16" fill="#7b5a96">{r.toFixed(fine?1:0)} cm</text><text x="45" y={70+i*48} textAnchor="end" fontSize="14" fill="#9986a7">{i+1}</text></g>)}
    </svg>
    <div className="phy-lab-controls"><B zh="绿线是参考长度；圆点是三次示例读数。" en="Green line: reference length. Dots: three example readings." mode={mode}/><Record mode={mode} onClick={()=>cases.record(biased?'biased':fine?'fine':'coarse')}/></div>
    <Result><B zh={`示例平均值 ${summary.mean!.toFixed(1)} cm；相对参考偏差 ${(summary.mean!-referenceLength).toFixed(1)} cm。`} en={`Example mean ${summary.mean!.toFixed(1)} cm; difference from reference ${(summary.mean!-referenceLength).toFixed(1)} cm.`} mode={mode}/></Result>
    <p className="phy-skill-check"><B zh={`已记录 ${cases.count}/3：偏移读数、修正后的粗刻度与细刻度。`} en={`Recorded ${cases.count}/3: offset readings, corrected coarse and corrected fine.`} mode={mode}/></p>
  </Frame>;
}
export function RepeatsLab({ mode, onExplore }: Props) {
  const [trials, setTrials] = useState<Trial[]>([]), [log, setLog] = useState(false);
  const summary = trialSummary(trials), hasFourth=trials.length===4;
  const add = () => setTrials(old => [...old, {value: old.length<3 ? repeatTimes[old.length]! : 1, invalid:false}]);
  const flag = () => {
    setTrials(old=>old.map((r,i)=>i===3?{...r,invalid:true}:r));
    onExplore?.();
  };
  return <Frame mode={mode} zh="教学示例 · 相同动作的计时记录" en="Teaching example · Timing the same action"
    noteZh="这是预设的计时示例，用来练习证据处理，不是你完成的真实实验。前3次条件相同，第4次有已确认的操作错误。只因数值特别不能删掉；排除后的估计也不保证是真值。"
    noteEn="Preset timing examples for handling evidence, not a real experiment you performed. Conditions match in the first three; the fourth has a confirmed procedure error. An unusual number alone is not grounds for deletion. The resulting estimate is not guaranteed to be the true value.">
    <div className="phy-repeat-prompt"><B zh="同样的动作，略有不同的计时。先看证据，不挑数字。" en="The same action, with slightly different timing. Examine evidence without choosing favourite numbers." mode={mode}/></div>
    <div className="phy-data-table-wrap"><table className="phy-data-table"><caption><B zh="原始记录一直保留" en="Original records remain visible" mode={mode}/></caption><thead><tr><th><B zh="次序" en="Trial" mode={mode}/></th><th><B zh="时间（s）" en="Time (s)" mode={mode}/></th><th><B zh="状态" en="Status" mode={mode}/></th></tr></thead><tbody>
      {trials.map((r,i)=><tr key={i}><td>{i+1}</td><td>{r.value.toFixed(1)}</td><td><B zh={r.invalid?'提前停表：不纳入估计':'原始读数'} en={r.invalid?'Early stop: excluded from estimate':'Raw reading'} mode={mode}/></td></tr>)}
    </tbody></table></div>
    <div className="phy-lab-controls"><button className="phy-button" disabled={hasFourth} onClick={add}><B zh={trials.length===3?'查看第四次示例':'记录下一次示例'} en={trials.length===3?'Inspect fourth example':'Record next example'} mode={mode}/></button>
      {hasFourth && !log && <button className="phy-button secondary" onClick={()=>setLog(true)}><B zh="查看操作记录" en="Read procedure log" mode={mode}/></button>}
    </div>
    {log && <div className="phy-repeat-log"><B zh="操作记录：第四次在动作完成前误按停止，计时仅1.0 s。原始数值保留，给它标注方法问题。" en="Procedure log: in trial 4 the stop button was pressed before the action finished, after only 1.0 s. Retain the reading and annotate the procedure issue." mode={mode}/><button className="phy-button secondary" disabled={trials[3]?.invalid} onClick={flag}><B zh="标记提前停表，保留原值" en="Flag early stop; keep the reading" mode={mode}/></button></div>}
    <div className="phy-skill-readouts" aria-live="polite"><div><B zh="全部读数平均值" en="Mean of all readings" mode={mode}/><strong>{summary.rawMean===null?'—':`${summary.rawMean.toFixed(2)} s`}</strong></div><div><B zh="有效读数平均值" en="Valid-reading mean" mode={mode}/><strong>{summary.mean===null?'—':`${summary.mean.toFixed(2)} s`}</strong></div><div><B zh="有效读数极差" en="Valid-reading range" mode={mode}/><strong>{summary.range===null?'—':`${summary.range.toFixed(1)} s`}</strong></div></div>
    <p className="phy-skill-check"><B zh={`已保留 ${trials.length}/4 次记录${trials[3]?.invalid?'，并记录排除原因。':'；调查操作记录后，再判断是否纳入估计。'}`} en={`Retained ${trials.length}/4 readings${trials[3]?.invalid?', with the exclusion reason recorded.':'; investigate the procedure before deciding on inclusion.'}`} mode={mode}/></p>
  </Frame>;
}
export function PaperLab({ mode, onExplore }: Props) {
  const [count, setCount] = useState(1), [error, setError] = useState(0),
    [records, setRecords] = useState<{count:number;error:number;reading:number;estimate:number}[]>([]);
  const cases = useCases(['single','stack','error'],onExplore), result = paperReading(count,error),
    height=count*.1*12;
  const record=()=>{
    setRecords(old=>[...old.slice(-5),{count,error,reading:result.stackReading,estimate:result.estimate}]);
    if(count===1&&error===0)cases.record('single');
    if(count===100)cases.record(error?'error':'stack');
  };
  return <Frame mode={mode} zh="整叠厚度 ÷ 张数 · 间接测量" en="Stack thickness ÷ sheet count · Indirect measurement"
    noteZh="放大侧视模型，同种纸设为0.1 mm/张，无封面、空气隙或压缩。尺子最小刻度1 mm，模型把含0.18 mm固定端点变化的整叠长度取最近刻度。+1 mm按钮再加入整叠读数偏差，不改变纸张。实际纸张、按压力与工具不同，不会保证这些结果。"
    noteEn="Enlarged side-view model: similar sheets are 0.1 mm each, with no covers, gaps or compression. Ruler divisions are 1 mm; model stack readings include a fixed 0.18 mm endpoint variation then round to the nearest division. The +1 mm button adds stack-reading error without changing the paper. Real paper, pressure and tools need not give these results.">
    <div className="phy-lab-controls"><div className="phy-segment" role="group" aria-label={mode==='en'?'Sheet count':'纸张数'}>{[1,20,100].map(n=><Choice key={n} selected={count===n} onClick={()=>setCount(n)}><B zh={`${n} 张`} en={`${n} ${n===1?'sheet':'sheets'}`} mode={mode}/></Choice>)}</div><div className="phy-segment" role="group" aria-label={mode==='en'?'Stack reading error':'整叠读数偏差'}>{[0,1].map(n=><Choice key={n} selected={error===n} onClick={()=>setError(n)}><B zh={`偏差 +${n} mm`} en={`Error +${n} mm`} mode={mode}/></Choice>)}</div></div>
    <svg viewBox="0 0 620 265" className="phy-simulation" role="img" aria-label={mode==='en'?'Paper stack beside enlarged millimetre divisions':'纸叠与放大的毫米刻度'}>
      <rect x="95" y={218-height} width="250" height={Math.max(height,1.2)} fill="#f2dfb6" stroke="#bba172"/>
      {Array.from({length:Math.min(count,25)},(_,i)=><path key={i} d={`M95 ${218-i*height/Math.min(count,25)}h250`} stroke="#c7b18c" opacity=".7"/>)}
      <path d="M70 220h340M390 28v192" stroke="#a994ba" strokeWidth="2"/>
      {Array.from({length:16},(_,i)=><g key={i}><path d={`M390 ${218-i*12}h${i%5?10:18}`} stroke="#a994ba"/>{i%5===0&&<text x="421" y={223-i*12} fontSize="16" fill="#79698b">{i} mm</text>}</g>)}
      <path d={`M350 ${218-result.stackReading*12}h32`} stroke="#9874b2" strokeWidth="2"/>
      <text x="225" y="247" textAnchor="middle" fill="#8f764a" fontSize="17"><tspan>{count}</tspan> {mode==='en'?'sheet(s)':'张'}</text>
      <text x="475" y="110" fill="#9874b2" fontSize="22">{result.stackReading} mm</text>
    </svg>
    <div className="phy-lab-controls"><B zh={`已记录 ${cases.count}/3：一张、一百张、一百张加偏差。`} en={`Recorded ${cases.count}/3: one sheet, a hundred, a hundred with error.`} mode={mode}/><Record mode={mode} onClick={record}/></div>
    <Result><B zh={result.resolved?`${result.stackReading} ÷ ${count} = ${result.estimate.toFixed(2)} mm/张`:'单张太薄，刻度读不出来；0 mm 显示不意味着零厚度。'} en={result.resolved?`${result.stackReading} ÷ ${count} = ${result.estimate.toFixed(2)} mm per sheet`:'Too thin to resolve: a 0 mm display does not mean zero thickness.'} mode={mode}/></Result>
    {records.length>0&&<div className="phy-data-table-wrap"><table className="phy-data-table"><caption><B zh="比较你的模型记录" en="Compare your model records" mode={mode}/></caption><thead><tr><th><B zh="张数 / 偏差" en="Count / error" mode={mode}/></th><th><B zh="整叠（mm）" en="Stack (mm)" mode={mode}/></th><th><B zh="每张（mm）" en="Per sheet (mm)" mode={mode}/></th></tr></thead><tbody>{records.map((r,i)=><tr key={i}><td>{r.count} / +{r.error} mm</td><td>{r.reading}</td><td>{r.count===1?<B zh="读不出" en="Unresolved" mode={mode}/>:r.estimate.toFixed(2)}</td></tr>)}</tbody></table></div>}
  </Frame>;
}
