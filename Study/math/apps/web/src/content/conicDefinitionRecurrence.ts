import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `analytic-${i}`,
  sourceLesson: `H22-L0${i}`,
  sourceTask: `H22-L0${i}-Q6`,
  targets: ['H36', 'H38'].map((u) => `${u}-MAINT-CONIC-DEFINITION-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const conicDefinitionRecurrence = [
  e(
    1,
    '非零方向、竖线与全参数覆盖',
    'Nonzero direction,vertical lines and full parameter coverage',
    '两组从点和非零方向生成参数式与一般式，包含竖直/水平边界；一般点向式反向用非零分量恢复t，给全部直线而非有限点。零方向只给点，一般式A=B=0给全平面或空，不误叫直线。',
    'Both construct parametric/general forms from a point and nonzero direction,including vertical/horizontal cases. A converse recovers t through a nonzero component and establishes full line coverage. Zero direction gives a point;A=B=0 gives a plane or empty set,not a line.',
  ),
  e(
    2,
    '垂足、方程缩放与最短性',
    'Foot,equation scaling and minimality',
    '两组精确求H与距离，验证归属和垂直。一般投影公式保非零法向量，任意Q的勾股恒等式证明全体最短；负倍式分子分母同乘绝对倍率，线上点距离零，不将竖直间隔当最短。',
    'Both calculate exact feet/distances and check membership/perpendicularity. General projection retains a nonzero normal. Pythagoras for arbitrary Q establishes global minimality. Negative equation scaling multiplies numerator and denominator by the same absolute factor;on-line distance is zero.',
  ),
  e(
    3,
    '配方、圆周/圆盘与退化集合',
    'Completing squares,circumference/disk and degeneracies',
    '两组新平移方程配方读中心、半径和平方半径，比较给定圆周点与圆心。实坐标非负平方和给正值圆、零单点、负值空集；距离非负保证双向等价，圆盘另用不等式而非混同圆周。',
    'Both complete translated square equations and distinguish centre,radius and squared radius. A point on the circumference differs from the centre. Nonnegative real squares classify positive,zero and negative RHS as circle,singleton and empty set. Reversible distance squaring and a separate disk inequality retain the definitions.',
  ),
  e(
    4,
    '有符号p、准线距离与退化直线',
    'Signed p,directrix distance and the degenerate line',
    '左右开口的新抛物线均先读4p再生成焦点准线，给定点精确核两距离。一般非负距离平方双向推Y²=4pX，p0时距离定义和代数式同给整直线，不能仍称非退化抛物线。',
    'New left/right-opening parabolas require extracting p from4p,constructing focus/directrix and checking both distances. Squaring nonnegative distances reversibly derives Y²=4pX. At p0,both the distance definition and equation give a whole line,not a nondegenerate parabola.',
  ),
  e(
    5,
    '焦距和、轴向与三角取等',
    'Focal sum,axis direction and triangle equality',
    '水平/竖直新椭圆区分2a与2c，恢复b²与方程并核顶点。小于焦距空、等于为闭焦线段、c0为圆另审a0；中心化距离消元与反向正根条件证明完整等价，不仅核若干点。',
    'Horizontal/vertical ellipses distinguish2a from2c,recover b²/equations and check a vertex. Below focal separation is empty;equality is the closed focal segment;coincident foci give a circle with a0 handled separately. Centred elimination and positive-root converse establish full equivalence beyond sample points.',
  ),
  e(
    6,
    '绝对差双支与最大差的两闭射线',
    'Absolute difference,both branches and two exterior rays',
    '水平/竖直双曲线固定焦点标签核两顶点有向差±6，绝对值保两支。差0中垂线、差10两外侧闭射线含焦点、差12空，保反三角取等。通式消元及正根反向恢复两支，避免平方加点或把极限差画整轴。',
    'Both orientations check signed differences±6 at vertices with fixed focal labels;absolute value retains both branches. Difference zero gives the perpendicular bisector,ten gives two closed exterior rays including foci,and twelve is impossible. General elimination and positive-root converse restore both branches without extraneous points.',
  ),
];
