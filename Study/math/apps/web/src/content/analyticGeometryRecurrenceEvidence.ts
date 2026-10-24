import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `analytic-geometry-${i}`,
  sourceLesson: `H36-L0${i}`,
  sourceTask: `H36-L0${i}-Q6`,
  targets: ['H37', 'H38'].map((u) => `${u}-MAINT-ANALYTIC-GEOMETRY-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const analyticGeometryRecurrenceEvidence = [
  e(
    1,
    '完整交点与次数前提',
    'Complete intersections and degree premises',
    '两新非零方向参数先求t再还原完整点集(±8,6)/(±3,4)，精确回两式。圆竖切线重根与竖线抛物线一次单交点分开，渐近线代入常数矛盾，不把唯一点自动当切点或只交x根。',
    'New nonzero-direction parameters require full point sets(±8,6)/(±3,4) and original checks. Repeated circle roots differ from linear vertical-parabola singletons;asymptote substitution is a constant contradiction. A singleton does not automatically prove tangency,nor do x roots finish an intersection.',
  ),
  e(
    2,
    '反构可达与半平面孔',
    'Inverse reachability,half-planes and holes',
    '平移固定端点的新中点轨迹分别上半圆心(2,1)半径3排(5,1)，或下半圆心(−1,2)半径2排(−3,2)。四候选逐一反构唯一P，保另一端点、极点与错误半平面，必要/充分均实际要求。',
    'Shifted midpoint loci are upper circle centre(2,1),radius three,excluding(5,1),or lower circle centre(−1,2),radius two,excluding(−3,2). Four candidates reconstruct unique sources,distinguishing retained endpoints/poles from holes and wrong half-planes. Necessity and sufficiency are both required.',
  ),
  e(
    3,
    '参数像、漏点及非时间',
    'Parameter images,omissions and no automatic clock',
    '半径6/4的新有理参数在全有限R漏E，反解证明其余全可达。新限制[−1,1]/有限[1,∞)重建不同完整圆弧及端点；三点精确弦长反匀速，导数模2r/(1+t²)也非常数，极限不当有限取值。',
    'New radius-six/four rational maps omit E for all finite parameters,and inverse reconstruction covers every other point. Restrictions[−1,1]/finite[1,∞) give different complete arcs/endpoints. Exact three-point chords refute uniform motion;derivative magnitude2r/(1+t²) is not constant. A limit is not a finite value.',
  ),
  e(
    4,
    '零向量、共线与双向圆周角',
    'Zero vectors,collinearity and two-way diameter angles',
    '新平移直径端点给点积(x−1)²+(y+2)²−25或(x+2)²+(y−1)²−16，轨迹排A/B。实际源AB/P/C图不泄圆；P/C/Q/T分核普通钝/平/普通锐/零角，点积0与零向量无定义不可混。',
    'Translated diameter endpoints give dots(x−1)²+(y+2)²−25 or(x+2)²+(y−1)²−16,excluding A/B from the locus. Actual given AB/P/C plots do not reveal the circle. P/C/Q/T separately give obtuse/straight/acute/zero angles;zero-dot endpoint vectors leave angles undefined.',
  ),
  e(
    5,
    '全通道净高与坐标模型',
    'Whole-passage clearance and coordinate models',
    '新10×5与8×4半轴上屋顶，在两净高算完整区间/两边界/总宽；偏心1的通道即使总宽相等、中心足够，高净高仍失败。一般闭区间全包含证明、H0/顶点零宽/超高空集、上下半与模型限度均保留。',
    'Upper roofs with semiaxes10×5 and8×4 require full intervals,both boundaries and full widths at two clearances. Off-centre-one passages fail at the higher clearance despite matching total width and adequate central height. Whole-interval containment,H0/apex zero-width/above-roof emptiness,upper-section restrictions and model limits remain explicit.',
  ),
];
