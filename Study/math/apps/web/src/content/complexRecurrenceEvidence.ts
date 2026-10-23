import { t } from '../model';
const entry = (
  skill: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H21-L0${i}`,
  sourceTask: `H21-L0${i}-Q6`,
  targets: ['H35', 'H37'].map((u) => `${u}-MAINT-COMPLEX-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const complexRecurrenceEvidence = [
  entry(
    'complex-domain-square-cycle',
    1,
    '扩域、完整根集与负幂',
    'Domain extension,complete roots and negative powers',
    '两组分别在实/复域解u²+9/16=0；实平方非负与复域零乘积给完整集，再由i⁴=1和1/i=−i核负幂及高幂。扩域不改变实数平方的性质，代候选不替完整性论证。',
    'Both solve u²+9/16=0 in each domain. Nonnegative real squares and complex factorisation establish complete sets. The four-cycle and reciprocal then handle negative and high powers. Enlarging the domain changes available elements,not real squares;substitution alone does not establish completeness.',
  ),
  entry(
    'complex-coefficients-equality',
    2,
    '实系数条件与虚部坐标',
    'Real-coefficient premises and imaginary coordinates',
    '两组在明示实a,b下配对两系数；虚部是实数，虚数项才含i，点坐标均为实数。另给确实满足原式的复参数对，展示移除实数前提后原唯一性论证失效。',
    'Both match coefficients under an explicit real-parameter premise,distinguish imaginary part from imaginary term,and plot real coordinates. A different complex-parameter pair satisfies each original equation,showing why the original uniqueness argument cannot survive removal of its premise.',
  ),
  entry(
    'complex-distribution-collection',
    3,
    '分配四项与平方交叉项',
    'Four distributed products and square cross terms',
    '两组新数均计算和差积平方，保留四个乘积后用i²=−1收集实虚部。一般(a+bi)²=(a²−b²)+2abi解释遗漏交叉项为何错误，实例仅核回而不替通式。',
    'New complex pairs require sums,differences,products and squares. All four products precede i² replacement and collection. The general square identity explains missing cross terms;examples check the result rather than replacing the general argument.',
  ),
  entry(
    'complex-conjugate-norm',
    4,
    '共轭、模与零除数',
    'Conjugate,modulus and zero denominators',
    '3−4i和−5+12i分别区分共轭与负数、模与平方模，以正实模平方有理化并乘回。一般实系数论证共轭等负数当且仅当a=0；模零当且仅当a=b=0，零仍有共轭和模但不能作除数。',
    'Both distinguish conjugation from negation and modulus from squared modulus,rationalise via a positive squared modulus,and multiply back. Real-coefficient arguments give conjugate=negative iff a=0 and modulus zero iff a=b=0. Zero retains its conjugate and modulus but cannot serve as divisor.',
  ),
  entry(
    'complex-plane-centre-transform',
    5,
    '非原点中心、零位移与矩阵',
    'Nonorigin centres,zero displacement and matrices',
    '两幅等尺度实际坐标图仅给中心与原始点，须生成位移、像点、圆和逆变换。通式(a,b)→(−b,a)保长度，矩阵作用于中心化位移；T(0)非零辨仿射。中心仍有像，零位移无夹角，不把旋转角误赋给零箭头。',
    'Actual equal-scale figures supply only centre and original point;learners generate displacement,image,circle and inverse. General(a,b)→(−b,a) preserves length. The matrix acts on centred displacement;nonzero T(0) distinguishes the affine full map. The centre has an image but zero arrows have no angle.',
  ),
];
