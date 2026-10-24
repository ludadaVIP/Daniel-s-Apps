import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `space-vector-${i}`,
  sourceLesson: `H23-L0${i}`,
  sourceTask: `H23-L0${i}-Q6`,
  targets: ['H36', 'H38'].map((u) => `${u}-MAINT-SPACE-VECTOR-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const spaceVectorRecurrence = [
  e(
    1,
    '三维位移、平移与投影漏项',
    'Three-dimensional displacement,translation and projection loss',
    '两组新端点算三分量位移、反向、模与中点及共同平移后的全部量。一般同加抵消说明不变量，实际xy投影平方25分别漏z平方9/4，不靠屏幕线长判断；零位移无方向，点位置不冒充相对位移。',
    'New endpoint pairs require all three displacement components,reverse,norm,midpoint and translated values. General cancellation proves invariance. Actual xy squared length25 omits z² nine/four,so screen lengths cannot certify space lengths. Zero has no direction and positions do not replace relative displacements.',
  ),
  e(
    2,
    '全分量线性组合与长度条件',
    'Full-component linear combinations and length conditions',
    '两组三维组合2u−3v/−2u+v由逆运算逐项核回，并写一般第j分量。平方模证明绝对数乘倍率，零源不称反向；正交单位向量反驳长度总相加，非零同向取等与零边界分开。',
    'Both three-dimensional combinations are recovered componentwise by inverse operations and a general jth-component formula. Squared norms justify absolute scalar length scaling. Zero has no opposite direction. Orthogonal unit vectors refute universal length additivity;nonzero same-direction equality and zero boundaries remain distinct.',
  ),
  e(
    3,
    '三项点积、向量角与较小线角',
    'Three-term dot product,vector angle and smaller line angle',
    '两组点积−2、模平方2/3，向量角余弦−√6/3而较小线角余弦√6/3；生成非零正交例并核三分量。零点积反例保两非零前提，结果为实标量，反向平角不混一般钝角。',
    'Both give dot−2 and squared norms two/three:vector cosine−√6/3 differs from smaller-line cosine√6/3. Learners construct a nonzero perpendicular vector and check all components. A zero-vector counterexample preserves nonzero premises. Dot products are real scalars;opposite straight angles differ from general obtuse angles.',
  ),
  e(
    4,
    '基点归属、唯一交点与异面',
    'Base membership,unique intersection and skew lines',
    '两组真实三维线面给在内/严格平行/唯一相交的三类，通式代入解释全部分支。线面垂直须方向平行非零法向；另两线方向点积0却z恒不相等，故异面，xy投影交点不当空间交点。',
    'Both three-dimensional line/plane sets realise containment,strict parallelism and unique intersection,with a general substitution classifying every case. Perpendicularity requires direction parallel to a nonzero normal. Extra lines have zero direction dot product but incompatible constant z values,so are skew despite crossing projections.',
  ),
  e(
    5,
    '垂足归属、非负距离与最短证明',
    'Foot membership,nonnegative distances and minimality',
    '两组分别求点到平面及直线的精确垂足和距离3/2，核归属与残余垂直。任意Q的点积/勾股链证明全体最短；平面连右端缩放、直线参数逆倍率、对象内点零距及零法向/方向均明示。',
    'Both find exact plane/line feet with distances three/two,checking membership and perpendicular residuals. Dot-product/Pythagorean arguments for arbitrary Q establish global minimality. Scaling includes the plane RHS and inverse line parameter. On-object zero distance and invalid zero normals/directions remain explicit.',
  ),
];
