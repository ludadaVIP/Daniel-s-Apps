import { rational, addR, negR, mulR, divR, sameR, textR, type Rational } from './algebraModels';
import { readRational } from './rationalModels';
import { principalRadical, radicalText } from './radicalModels';
export type Complex = [Rational,Rational];
export type ComplexCode='real'|'nonreal'|'pure-imaginary'|'not-pure-imaginary'|'undefined';
const names:Record<ComplexCode,string[]>={real:['real','实数'],nonreal:['nonreal','非实数'],'pure-imaginary':['pure-imaginary','纯虚数'],'not-pure-imaginary':['not-pure-imaginary','不是纯虚数','非纯虚数'],undefined:['undefined','无定义']};
export const checkComplexCode=(raw:string,value:ComplexCode)=>names[value].includes(raw.trim().toLowerCase());
export const complexNumber=(r:Rational)=>Number(r[0])/Number(r[1]);
export const complexZero=():Complex=>[rational(0n),rational(0n)];
export const complexOne=():Complex=>[rational(1n),rational(0n)];
export const complexI=():Complex=>[rational(0n),rational(1n)];
export function complexComponent(raw:string):Rational {
  const r=readRational(raw);
  if(r[1]>1000n||r[0]>1000n*r[1]||r[0]<-1000n*r[1])throw new RangeError('Bounded rational complex components');
  return r;
}
export const complex=(real:string,imaginary:string):Complex=>[complexComponent(real),complexComponent(imaginary)];
function bounded(z:Complex):Complex {
  if(z.some(r=>r[0].toString().length>80||r[1].toString().length>80))throw new RangeError('Bounded exact complex arithmetic');
  return z;
}
export const sameComplex=(z:Complex,w:Complex)=>sameR(z[0],w[0])&&sameR(z[1],w[1]);
export const isZeroComplex=(z:Complex)=>z[0][0]===0n&&z[1][0]===0n;
export const addComplex=(z:Complex,w:Complex):Complex=>bounded([addR(z[0],w[0]),addR(z[1],w[1])]);
export const negateComplex=(z:Complex):Complex=>[negR(z[0]),negR(z[1])];
export const subtractComplex=(z:Complex,w:Complex)=>addComplex(z,negateComplex(w));
export const multiplyComplex=(z:Complex,w:Complex):Complex=>bounded([addR(mulR(z[0],w[0]),negR(mulR(z[1],w[1]))),addR(mulR(z[0],w[1]),mulR(z[1],w[0]))]);
export const conjugateComplex=(z:Complex):Complex=>[z[0],negR(z[1])];
export const squareModulus=(z:Complex)=>addR(mulR(z[0],z[0]),mulR(z[1],z[1]));
export const modulusComplex=(z:Complex)=>radicalText(principalRadical(squareModulus(z)));
export function divideComplex(z:Complex,w:Complex):Complex {
  const norm=squareModulus(w);
  if(norm[0]===0n)throw new RangeError('Nonzero complex divisor');
  const product=multiplyComplex(z,conjugateComplex(w));
  return bounded([divR(product[0],norm),divR(product[1],norm)]);
}
export function powerComplex(z:Complex,n:number):Complex {
  if(!Number.isSafeInteger(n)||Math.abs(n)>12)throw new RangeError('Complex powers from minus twelve to twelve');
  if(isZeroComplex(z)&&n<=0)throw new RangeError('Do not assign zero to zero or a negative power');
  let result=complexOne();
  for(let k=0;k<Math.abs(n);k++)result=multiplyComplex(result,z);
  return n<0?divideComplex(complexOne(),result):result;
}
export function powerI(n:number):Complex {
  if(!Number.isSafeInteger(n)||Math.abs(n)>100000)throw new RangeError('Bounded integer exponent');
  const cycle=[complexOne(),complexI(),negateComplex(complexOne()),negateComplex(complexI())];
  return cycle[((n%4)+4)%4]!;
}
export function complexText(z:Complex):string {
  const [a,b]=z;
  if(b[0]===0n)return textR(a);
  const magnitude=textR(b[0]<0n?negR(b):b),term=`${magnitude==='1'?'':magnitude}i`;
  return a[0]===0n?`${b[0]<0n?'-':''}${term}`:`${textR(a)}${b[0]<0n?'-':'+'}${term}`;
}
type Node={kind:'number';raw:string}|{kind:'i'}|{kind:'unary';negative:boolean;child:Node}|{kind:'binary';op:'+'|'-'|'*'|'/';left:Node;right:Node}|{kind:'power';base:Node;exponent:number};
function normalize(raw:string) {
  return raw.trim().replace(/[−－]/g,'-').replace(/[×·]/g,'*').replace(/[÷／]/g,'/').replace(/（/g,'(').replace(/）/g,')').replace(/ⅈ/g,'i').toLowerCase();
}
function parseComplex(raw:string):Node {
  if(raw.length>240)throw new RangeError('Bounded complex expression');
  const input=normalize(raw),tokens:string[]=[];let offset=0;
  while(offset<input.length){if(/\s/.test(input[offset]!)){offset++;continue;}const match=input.slice(offset).match(/^(?:\d+(?:\.\d*)?|\.\d+|i|[()+\-*/^])/);if(!match)throw new RangeError('Use rational coefficients and i');tokens.push(match[0]);offset+=match[0].length;}
  if(!tokens.length||tokens.length>120)throw new RangeError('Use a nonempty bounded expression');
  let at=0;
  const atom=():Node=>{const token=tokens[at++];if(token==='('){const n=sum();if(tokens[at++]!==')')throw new RangeError('Balanced parentheses');return n;}if(token==='i')return {kind:'i'};if(token&&/^(?:\d|\.)/.test(token)){complexComponent(token);return {kind:'number',raw:token};}throw new RangeError('Expected a coefficient, i or parentheses');};
  const power=():Node=>{let n=atom();if(tokens[at]==='^'){at++;const enclosed=tokens[at]==='(';if(enclosed)at++;let sign=1;if(tokens[at]==='-'||tokens[at]==='+')sign=tokens[at++]==='-'?-1:1;const token=tokens[at++];if(!token||!/^\d+$/.test(token))throw new RangeError('Use a small integer exponent');const exponent=sign*Number(token);if(!Number.isSafeInteger(exponent)||Math.abs(exponent)>12)throw new RangeError('Powers from minus twelve to twelve');if(enclosed&&tokens[at++]!==')')throw new RangeError('Close exponent parentheses');n={kind:'power',base:n,exponent};}return n;};
  const unary=():Node=>{if(tokens[at]==='-'||tokens[at]==='+'){const negative=tokens[at++]==='-';return {kind:'unary',negative,child:unary()};}return power();};
  const product=():Node=>{let n=unary();while(at<tokens.length){const token=tokens[at],implicit=token==='('||token==='i'||!!token&&/^(?:\d|\.)/.test(token);if(token==='*'||token==='/'){at++;n={kind:'binary',op:token,left:n,right:unary()};}else if(implicit)n={kind:'binary',op:'*',left:n,right:unary()};else break;}return n;};
  const sum=():Node=>{let n=product();while(tokens[at]==='+'||tokens[at]==='-'){const op=tokens[at++] as '+'|'-';n={kind:'binary',op,left:n,right:product()};}return n;};
  const root=sum();if(at!==tokens.length)throw new RangeError('Unexpected trailing input');return root;
}
function evaluate(n:Node):Complex {
  if(n.kind==='number')return [complexComponent(n.raw),rational(0n)];
  if(n.kind==='i')return complexI();
  if(n.kind==='unary'){const value=evaluate(n.child);return n.negative?negateComplex(value):value;}
  if(n.kind==='power')return powerComplex(evaluate(n.base),n.exponent);
  const a=evaluate(n.left),b=evaluate(n.right);
  return n.op==='+'?addComplex(a,b):n.op==='-'?subtractComplex(a,b):n.op==='*'?multiplyComplex(a,b):divideComplex(a,b);
}
const realCoefficient=(n:Node):boolean=>n.kind==='number'||n.kind==='unary'&&realCoefficient(n.child)||n.kind==='binary'&&n.op==='/'&&realCoefficient(n.left)&&realCoefficient(n.right);
const bareI=(n:Node):boolean=>n.kind==='i'||n.kind==='unary'&&bareI(n.child);
function imaginaryTerm(n:Node):boolean {
  if(bareI(n))return true;
  if(n.kind==='unary')return imaginaryTerm(n.child);
  if(n.kind!=='binary')return false;
  if(n.op==='*')return realCoefficient(n.left)&&bareI(n.right)||bareI(n.left)&&realCoefficient(n.right);
  return n.op==='/'&&imaginaryTerm(n.left)&&realCoefficient(n.right);
}
function standardNode(n:Node):boolean {
  if(n.kind==='unary')return standardNode(n.child);
  if(realCoefficient(n)||imaginaryTerm(n))return true;
  return n.kind==='binary'&&(n.op==='+'||n.op==='-')&&(realCoefficient(n.left)&&imaginaryTerm(n.right)||imaginaryTerm(n.left)&&realCoefficient(n.right));
}
export const readComplex=(raw:string)=>evaluate(parseComplex(raw));
export function checkComplex(raw:string,expected:string,standard=false):boolean {
  try {const node=parseComplex(raw);return sameComplex(evaluate(node),readComplex(expected))&&(!standard||standardNode(node));}catch{return false;}
}
export const complexSetText=(values:Complex[])=>values.length?`{${values.map(complexText).join(',')}}`:'∅';
export function readComplexSet(raw:string):Complex[] {
  let input=normalize(raw).replace(/^[xz]\s*=\s*/,'').replace(/，/g,',').replace(/；/g,';');
  if(['∅','{}','empty','no-solutions','无解'].includes(input))return [];
  if(input.startsWith('{')&&input.endsWith('}'))input=input.slice(1,-1);
  if(input.includes('±')){if(!input.startsWith('±')||input.slice(1).includes('±'))throw new RangeError('Use one leading plus-minus');const z=readComplex(input.slice(1));return isZeroComplex(z)?[z]:[z,negateComplex(z)];}
  const entries:string[]=[];let depth=0,start=0;
  for(let i=0;i<input.length;i++){if(input[i]==='(')depth++;if(input[i]===')')depth--;if(depth<0)throw new RangeError('Balanced root expressions');if(depth===0&&[',',';'].includes(input[i]!)){entries.push(input.slice(start,i));start=i+1;}}
  if(depth!==0)throw new RangeError('Balanced root expressions');entries.push(input.slice(start));if(entries.length>12)throw new RangeError('Bounded finite root set');
  const result:Complex[]=[];
  for(const entry of entries){const z=readComplex(entry);if(!result.some(w=>sameComplex(z,w)))result.push(z);}
  return result;
}
export function checkComplexSet(raw:string,values:string[]):boolean {
  try{const a=readComplexSet(raw),b=values.map(readComplex);return a.length===b.length&&b.every(z=>a.some(w=>sameComplex(z,w)));}catch{return false;}
}
export function squareEquationRoots(rhs:number,domain:'real'|'complex'):Complex[] {
  if(![-9,-4,-1,0,1,4,9].includes(rhs)||!['real','complex'].includes(domain))throw new RangeError('Supported classroom square equation and domain');
  if(rhs<0&&domain==='real')return [];
  if(rhs===0)return [complexZero()];
  const magnitude=String(Math.sqrt(Math.abs(rhs))),root=rhs<0?complex('0',magnitude):complex(magnitude,'0');return [root,negateComplex(root)];
}
export const realOrNonreal=(z:Complex):ComplexCode=>z[1][0]===0n?'real':'nonreal';
export const pureImaginary=(z:Complex):ComplexCode=>z[0][0]===0n&&z[1][0]!==0n?'pure-imaginary':'not-pure-imaginary';
export type ComplexOperation='add'|'subtract'|'multiply';
export const applyComplexOperation=(z:Complex,w:Complex,operation:ComplexOperation)=>operation==='add'?addComplex(z,w):operation==='subtract'?subtractComplex(z,w):multiplyComplex(z,w);
export const complexOperands=[complex('2','1'),complex('1','-2'),complexZero(),complex('-1/2','1')];
export const complexPartners=[complex('3','-2'),complex('-1','1'),complexZero(),complex('0','2')];
export type ComplexTransform='translate'|'times-i'|'times-minus-i'|'conjugate'|'double'|'zero'|'turn-centre';
export function transformComplex(z:Complex,kind:ComplexTransform,centre:Complex=complexZero()):Complex {
  if(kind==='translate')return addComplex(z,complex('1','1'));
  if(kind==='times-i')return multiplyComplex(complexI(),z);
  if(kind==='times-minus-i')return multiplyComplex(negateComplex(complexI()),z);
  if(kind==='conjugate')return conjugateComplex(z);
  if(kind==='double')return multiplyComplex(complex('2','0'),z);
  if(kind==='zero')return complexZero();
  if(kind==='turn-centre')return addComplex(centre,multiplyComplex(complexI(),subtractComplex(z,centre)));
  throw new RangeError('Supported complex-plane transformation');
}
