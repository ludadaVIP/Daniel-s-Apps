import type { LocalizedText } from '@study/shared';
const t=(zh:string,en:string):LocalizedText=>({zh,en});
export type RustVariable='water'|'oxygen'|'salt'|'coated'|'temperature'|'area';
export const rustVariableLabels:Record<RustVariable,LocalizedText>={
  water:t('可用水','Available water'),oxygen:t('可用氧气','Available oxygen'),salt:t('加盐处理','Added-salt treatment'),coated:t('完整涂层','Intact coating'),temperature:t('温度','Temperature'),area:t('铁表面积','Iron surface area'),
};
export const rustQuestionVariables=['oxygen','water','salt','coated'] as const;
export const rustDays=[0,1,3,5] as const;
export const rustLevelLabels=[t('未见可见锈迹','No visible rust'),t('少量可见锈迹','Trace visible rust'),t('明显可见锈迹','Clear visible rust'),t('较多可见锈迹','More visible rust')] as const;
type RustRecord={id:string;conditions:Record<RustVariable,number|boolean>;levels:readonly number[]};
// Independently authored ordinal records, not measured data or a predictive rate law.
export const rustRecords:RustRecord[]=[
  {id:'A',conditions:{water:true,oxygen:true,salt:false,coated:false,temperature:20,area:1},levels:[0,0,1,2]},
  {id:'B',conditions:{water:true,oxygen:false,salt:false,coated:false,temperature:20,area:1},levels:[0,0,0,0]},
  {id:'C',conditions:{water:false,oxygen:true,salt:false,coated:false,temperature:20,area:1},levels:[0,0,0,0]},
  {id:'D',conditions:{water:true,oxygen:true,salt:true,coated:false,temperature:20,area:1},levels:[0,1,2,3]},
  {id:'E',conditions:{water:true,oxygen:true,salt:false,coated:true,temperature:20,area:1},levels:[0,0,0,0]},
  {id:'F',conditions:{water:true,oxygen:true,salt:false,coated:false,temperature:40,area:2},levels:[0,1,2,3]},
];
export type RustConclusion='supported'|'not-yet-visible'|'not-controlled';
export function rustComparison(question:number,left:number,right:number,day:number){
  if(!Number.isInteger(question)||!rustQuestionVariables[question]||![left,right].every(i=>Number.isInteger(i)&&!!rustRecords[i])||![1,3,5].includes(day))throw new Error('Invalid rust comparison');
  const a=rustRecords[left]!,b=rustRecords[right]!,target=rustQuestionVariables[question]!;
  const changed=(Object.keys(rustVariableLabels) as RustVariable[]).filter(key=>a.conditions[key]!==b.conditions[key]);
  const fair=left!==right&&changed.length===1&&changed[0]===target;
  const timeIndex=rustDays.indexOf(day as typeof rustDays[number]);
  const firstLevel=a.levels[timeIndex]!,secondLevel=b.levels[timeIndex]!,different=firstLevel!==secondLevel;
  const conclusion:RustConclusion=!fair?'not-controlled':different?'supported':'not-yet-visible';
  return{a,b,target,changed,fair,firstLevel,secondLevel,different,conclusion,day};
}
export type CompanionMetal='Zn'|'Cu';
export type CouplingEffect='sacrificial'|'iron-at-risk'|'uncoupled';
export function protectionCircuit(metal:CompanionMetal,metalLink:boolean,ionicLink:boolean){
  if(!['Zn','Cu'].includes(metal)||typeof metalLink!=='boolean'||typeof ionicLink!=='boolean')throw new Error('Invalid protection circuit');
  const coupled=metalLink&&ionicLink;
  const donor:CompanionMetal|'Fe'|'none'=!coupled?'none':metal==='Zn'?'Zn':'Fe';
  const cathode:CompanionMetal|'Fe'|'none'=!coupled?'none':metal==='Zn'?'Fe':'Cu';
  const effect:CouplingEffect=!coupled?'uncoupled':metal==='Zn'?'sacrificial':'iron-at-risk';
  return{metal,metalLink,ionicLink,coupled,donor,cathode,effect};
}
