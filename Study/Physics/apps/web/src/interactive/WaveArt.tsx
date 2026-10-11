import type { WaveKind } from './waveModels';
export function WaveArt({kind}:{kind:WaveKind}) {
  const formulas={pulse:'disturbance →',transverse:'u ⊥ c',longitudinal:'u ∥ c',wavelength:'λ: same phase',clock:'T = 1/f',amplitude:'A ≠ 2A',speed:'c = √(F/μ)',relation:'c = fλ'};
  return <g><text x="30" y="30" fontSize="17" fill="#6c5b7c">{formulas[kind]}</text><path d="M30 95H270" fill="none" stroke="#b9b1c1" strokeDasharray="4 4"/>{kind==='longitudinal'?Array.from({length:25},(_,i)=><circle key={i} cx={30+10*i+5*Math.cos(i*Math.PI/4)} cy="95" r={i===12?5:3} fill={i===12?'#d9bc85':'#ae99bf'}/>):<path d={Array.from({length:121},(_,i)=>`${i?'L':'M'}${30+i*2} ${95-25*(kind==='pulse'?Math.exp(-(((i-60)/15)**2)):Math.cos(i*Math.PI/30))}`).join(' ')} stroke="#ae99bf" strokeWidth="3" fill="none"/>}<circle cx="150" cy={kind==='longitudinal'?95:70} r="5" fill="#d9bc85"/><path d="M225 50h35m-7-5l7 5-7 5" fill="none" stroke="#9b80b0" strokeWidth="2"/></g>;
}
