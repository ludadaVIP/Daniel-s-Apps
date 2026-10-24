import { t } from '../model';
const pair = (i: number) =>
  ['H23', 'H36'].map((u) => `${u}-MAINT-SPATIAL-STRUCTURE-Q${i}`);
const e = (
  skill: string,
  i: number,
  targets: string[],
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H06-L0${i}`,
  sourceTask: `H06-L0${i}-Q6`,
  targets,
  focus: t(z, en),
  rationale: t(rz, re),
});
export const spatialStructureRecurrence = [
  e(
    'spatial-incidence-and-coplanarity',
    1,
    pair(1),
    '不同点、非共线点与异面线的真实条件',
    'Distinct points,noncollinear points and genuine skew lines',
    'H23/H36分别以原点组和整体移位放大组证明两不同点给非零方向，重复一点可选两方向；参数直线同时解三坐标矛盾、方向不平行才判异面，并核ABC平面z0/z1与D不在。屏幕交叉不替代共面/相交依据。',
    'H23 uses an origin-based configuration and H36 a translated/scaled one. Both require distinct points for a nonzero line direction and give two lines through a repeated single point. Simultaneous coordinate contradictions plus nonparallel directions establish skewness; noncollinear ABC determines z=0 or z=1,excluding D. Screen crossings cannot certify incidence.',
  ),
  e(
    'solid-structure-and-height',
    2,
    pair(2),
    '棱柱锥计数、垂高与曲面边界',
    'Prism/pyramid counts,perpendicular height and curved boundaries',
    'H23数凸五边底棱柱10/15/7及锥6/10/6，H36数六边底12/18/8及7/12/7；两组均核V−E+F2并用底面积/垂高求60/20和90/30cm³，排斜棱替高。球完整曲面不是此有限多面体F中的平面多边形面，不混拓扑另分割定义。',
    'Pentagonal and hexagonal prisms/pyramids give separate vertex/edge/face counts with Euler value two. Perpendicular heights give volumes60/20 and90/30cm³ rather than using sloping edges. Both explain why a sphere’s whole curved boundary is not one planar polygonal face in this finite-polyhedron formula,and distinguish a separate topological decomposition.',
  ),
  e(
    'sections-and-face-identity',
    3,
    [...pair(3), ...pair(4)],
    '截面定维与展开后的面身份',
    'Section dimensions and folded face identities',
    'H23立方体和面截三角形2√3，极端改顶点/空；H36截矩形9√2，改沿棱/空，保范围及全部边界。另两组给实际编号单位正方形图，分别追交叉/阶梯的六面与相对面，反例2×3环折向冲突或六连条1/5、2/6重复，连通面积不认证有效网。',
    'H23 generates a triangular section of area2√3 then distinguishes vertex/empty contacts; H36 generates a rectangle of area9√2 then edge/empty contacts. Both retain all coordinate bounds. Actual labelled square diagrams support cross/stair net folding and opposite-face identities. A2×3 loop conflicts and a six-strip repeats faces: area and connectedness alone do not certify a cube net.',
  ),
  e(
    'spatial-distance-and-projection',
    4,
    pair(5),
    '线面角的正确投影与余角',
    'Correct line-plane projection versus its complementary angle',
    'H23长方体2/3/6给底对角√13、体对角7、线面cos√13/7与sin6/7；H36用4/4/7给4√2、9、cos4√2/9与sin7/9。亲画AG投影AC，另说明高/体对角是与竖直角的cos；真实边长与投影条件替代屏幕量角。',
    'Cuboids2/3/6 and4/4/7 give exact base/body diagonals and line-plane sine/cosine ratios. Both draw AG’s orthogonal projection AC and identify height/body diagonal as cosine of the complementary vertical angle,rather than using height as the in-plane adjacent side or measuring the screen.',
  ),
  e(
    'composite-volume-exposed-area',
    5,
    pair(6),
    '两张被遮面、分离与尺度',
    'Both hidden face patches,separation and scaling',
    'H23两块5×4×3和2×3×2合体积72、面和126，扣两份6得外露114；H36为6×3×2和3×2×2，体积48、面和104、外露92。分开不改总体积而恢复各面，全长倍2的面积/接触乘4体积乘8，明确内部不叠与贴合约束。',
    'H23 combines volumes to72 and separate surfaces126,subtracting both six-unit patches for114 exposed. H36 gives48,104 and92. Separation restores both surfaces without changing volume; doubling all lengths with the same contact relation multiplies areas/contact by four and volume by eight,under disjoint-interior premises.',
  ),
];
