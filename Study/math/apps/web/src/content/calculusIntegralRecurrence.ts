import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `integration-${i}`,
  sourceLesson: `H32-L0${i}`,
  sourceTask: `H32-L0${i}-Q6`,
  targets: ['H36', 'H38'].map((u) => `${u}-MAINT-CALCULUS-INTEGRAL-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const calculusIntegralRecurrence = [
  e(
    1,
    '分段时间权重、初始量与零时长',
    'Duration weights,initial state and zero duration',
    '两张实际分段率表宽分别(1,2,1)或(2,1,2)，新增10/11升、平均5/2或11/5，不是三个率的算术平均。新时刻分别核新增7/2或9/2、状态23/2或15/2与当前率分别1与5；零时长平均未定义，有限点改值不改累积。',
    'Actual piecewise tables have duration weights1/2/1 or2/1/2,giving additions ten/eleven litres and averages5/2 or11/5 rather than unweighted rate means. New times distinguish additions7/2,9/2 from states23/2,15/2 and current rates one/five. Zero-duration averages are undefined;finite point changes do not change accumulation.',
  ),
  e(
    2,
    '非等宽、合法采样与全网格误差',
    'Unequal widths,legal tags and whole-mesh error',
    '两幅实际非等宽中点矩形图要求生成左中右三和，平方函数中点不精确而仿射例精确。保首格宽1的序列虽格数增多，和趋7/3或8而非真8/3或9；Lipschitz逐格误差总界8mesh/6mesh覆盖任意合法采样，最大宽趋0而非只加格数。',
    'Actual unequal-width midpoint rectangles require all left/middle/right sums. Midpoint is inexact for the square but exact for the affine example. Keeping a width-one cell yields limits7/3 or eight rather than8/3 or nine despite increasing counts. Width-weighted bounds8mesh/6mesh control arbitrary legal tags when maximum width tends to zero.',
  ),
  e(
    3,
    '任意常数全族、初值与连通分支',
    'Complete constant families,initial data and connected components',
    '两新多项式净率分别生成全+C族，再用S(0)=4或S(1)=10固定为S(2)分别12或13并求导核回。C²漏负常数、2C−7仍全体；两原函数差导数0须同一连通区间。两支域导数1而差0/1的反例，及指数/三角回查均实际要求。',
    'New polynomial rates require complete+C families before initial data fixes states twelve/thirteen at time two. Derivatives check the rate. C² misses negative constants;2C−7 covers all. Equality up to one constant needs a connected interval;a two-component derivative-one counterexample has differences zero/one. Exponential/trigonometric primitives are checked too.',
  ),
  e(
    4,
    '有向贡献、无向区域与共同常数',
    'Signed contributions,unoriented regions and a shared constant',
    '两新一次函数以零点分段，原积分3/2或−3、面积5/2或5，反向只改积分符号。改上界使净0但总面积分别1与8，反驳函数恒0；等端点0与高度无关。同一C抵消，独立端点常数不是同一原函数。',
    'New linear examples split at zeros:integrals3/2 or−3 differ from areas5/2 or five. Reversing bounds changes signed integrals only. New upper bounds give zero net integral but total areas one/eight,refuting identical-zero claims. Equal endpoints ignore height. A common C cancels;separate endpoint constants are not one primitive.',
  ),
  e(
    5,
    '累积值、移动上限与跳点条件',
    'Accumulated values,moving limits and jump premises',
    '新上限2x/x²的累积先积分再求导核，A1为7/3或3/2而导数分别8或4；第二例0处内导0不能漏。邻近平均率的双侧论证需连续内点，跳率2/5的累积仍连续而左右导数不同，改单点值不改积分且不补导数。',
    'New2x/x² upper limits are integrated and differentiated independently. Values at one7/3,3/2 differ from derivatives eight/four;the second inner derivative vanishes at zero. Two-sided local averages need continuity/interior-point premises. A2/5 jump has continuous accumulation but unequal side derivatives;point edits change neither the integral nor derivative existence.',
  ),
  e(
    6,
    '三种量纲、净/总流与交点换边',
    'Three unit structures,gross/net flow and switching curves',
    '新运动分别算位移分别0与3、路程分别4与5、末位置分别3与8及两平均。新水量保初始和独立流出，分别总流入8/15、净4/12、末6/16并核非负。实际两曲线图先求交点再分三段绝对面积49/6或11/6，单位来自轴量而非像素，三个模型不混时间/状态。',
    'New motions distinguish displacements zero/three,distances four/five,final positions three/eight and both averages. Separate water models retain initial state/outflow,gross inflows eight/fifteen,net changes four/twelve,final amounts six/sixteen and nonnegativity. Actual curve plots require intersections and three absolute-area segments49/6 or11/6. Units derive from quantities,not pixels;the models do not share time/state.',
  ),
];
