import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
import {
  solidCounts,
  solidVolume,
  cubeSection,
  solidNets,
  foldCubeNet,
  spaceDistances,
  compoundCase,
  type SolidCode,
} from '../solidModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
) => I(stem, { kind: 'number', value, unit }, step, wrong);
const R = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'radical', value }, step, wrong);
const C = (stem: Pair, value: SolidCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'solid-code', value }, step, wrong);
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  skill: string;
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['空间中的点线面', 'Points, lines and planes in space'],
    objective: [
      '用共面与共同点条件区分空间点、完整直线和平面的关系。',
      'Distinguish spatial point, full-line and plane relationships using coplanarity and common-point conditions.',
    ],
    hook: [
      '长方体ABCD-EFGH中，底棱AB与竖棱CG没有交点，它们一定平行吗？',
      'In cuboid ABCD-EFGH, base edge AB and vertical edge CG do not meet. Must their full lines be parallel?',
    ],
    prerequisites: ['P56-L05', 'J75-L01', 'H05-L04'],
    keywords: [
      ['共面', 'coplanar'],
      ['异面直线', 'skew lines'],
      ['包含关系', 'containment'],
    ],
    lab: 'solid-relations',
    skill: 'spatial-incidence-and-coplanarity',
    hints: [
      [
        '先分点、直线与平面，直线和平面可无限延伸；图中只画有限代表。',
        'Identify points, lines and planes. Full lines and planes extend indefinitely; a diagram shows finite representatives.',
      ],
      [
        '两不同直线不平行时，共面则相交，不共面则异面；线在面内需两个不同点作证。',
        'Distinct nonparallel lines intersect if coplanar and are skew if not. Two distinct points certify line containment in a plane.',
      ],
    ],
    items: [
      C(
        [
          '长方体A=(0,0,0)、B=(4,0,0)、C=(4,3,0)、G=(4,3,4)，完整直线AB与CG是什么关系？用skew/parallel/intersecting。',
          'For cuboid points A=(0,0,0), B=(4,0,0), C=(4,3,0), G=(4,3,4), classify full lines AB and CG: skew/parallel/intersecting.',
        ],
        'skew',
        [
          'AB始终y=z=0，CG始终x=4、y=3，不相交；方向分别沿x与z，不平行，所以异面。',
          'AB has y=z=0 throughout, while CG has x=4,y=3. They do not meet and their x/z directions are not parallel, hence are skew.',
        ],
        ['parallel', 'intersecting'],
      ),
      C(
        [
          '同一长方体中，完整直线AB与CD的关系是什么？',
          'In the same cuboid, classify full lines AB and CD.',
        ],
        'parallel',
        [
          '两线都在底面内且方向沿x，y分别0与3，故为不同平行线。',
          'Both lie in the base with x direction and different y values zero and three, so are distinct parallel lines.',
        ],
        ['skew', 'coincident'],
      ),
      C(
        [
          'A=(0,0,0)、B=(4,0,0)、E=(0,0,4)，直线AB与AE关系是什么？',
          'For A=(0,0,0), B=(4,0,0), E=(0,0,4), classify AB and AE.',
        ],
        'intersecting',
        [
          '两条不同直线有共同点A，所以相交，也必共面。',
          'The distinct lines share A, so intersect and are coplanar.',
        ],
        ['parallel', 'skew'],
      ),
      C(
        [
          'A、B是平面z=0内两个不同点，完整直线AB与该平面关系？写contained/parallel/intersecting。',
          'A and B are distinct points of plane z=0. Classify full line AB relative to the plane: contained/parallel/intersecting.',
        ],
        'contained',
        [
          '平面内两不同点确定的完整直线全部在平面内，不只线段在内。',
          'The complete line through two distinct points of a plane lies in the plane, not just the joining segment.',
        ],
        ['intersecting', 'parallel'],
      ),
      C(
        ['完整平面z=0与y=0有什么关系？', 'Classify full planes z=0 and y=0.'],
        'intersecting',
        [
          '共同点满足y=z=0，组成整条x轴；两个不同平面相交于一条直线。',
          'Their common points satisfy y=z=0 and form the full x-axis. Distinct intersecting planes meet in a line.',
        ],
        ['parallel', 'coincident'],
      ),
      E(
        [
          '有人说“空间两条直线没有交点，就必平行”。用本课AB与CG判断并解释。',
          'Someone says, “Two spatial lines that never meet must be parallel.” Use AB and CG to evaluate the claim.',
        ],
        [
          'AB与CG既不相交也不平行，是异面反例。平面内不同直线才有不交即平行的结论；空间中必须核对共面。换投影可能让图上交叉，不能制造空间共同点。',
          'AB and CG are nonintersecting and nonparallel, giving a skew counterexample. The nonintersecting-implies-parallel conclusion applies to distinct coplanar lines; space requires checking coplanarity. A new projection can show a crossing without creating a spatial common point.',
        ],
      ),
    ],
    pick: {
      stem: [
        '一条直线有一个点在平面内，能推出整条直线在平面内吗？',
        'Does one point of a line lying in a plane certify containment of the full line?',
      ],
      options: [
        ['能，一个共同点就足够', 'Yes, one common point suffices'],
        [
          '不能，还可能只穿过平面一次',
          'No, it may pass through the plane once',
        ],
        ['不能，因为直线永远不在平面内', 'No, a line can never lie in a plane'],
      ],
      feedback: [
        [
          'AE穿过z=0，仅A在面内，不能推出包含。',
          'AE passes through z=0 only at A; one point does not imply containment.',
        ],
        [
          '正确：需要直线的两个不同点在面内，或等价的充分条件。',
          'Correct: two distinct points of the line in the plane, or an equivalent sufficient condition, are needed.',
        ],
        [
          'AB就是在底面内的一条完整直线。',
          'Full line AB is contained in the base plane.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '为什么必须说平面内两个“不同”点确定一条直线？给一个点的反例。',
      'Why must the two points defining a line be distinct? Give a one-point counterexample.',
    ],
    rubric: [
      '同一个点重复两次没有给出唯一方向；经过A可有底面内AB，也可有出底面的AE。两个不同点才确定唯一完整直线。',
      'Repeating one point gives no unique direction: both in-plane AB and out-of-plane AE pass through A. Two distinct points determine a unique full line.',
    ],
    misconception: [
      '只看投影相交或不交，把异面当平行，或把一个共同点当整线包含。',
      'Reading incidence from projection, confusing skew with parallel, or treating one common point as containment.',
    ],
  },
  {
    title: ['棱柱、棱锥与球', 'Prisms, pyramids and spheres'],
    objective: [
      '按面与顶点结构识别立体，并用底面积和垂直高解释体积。',
      'Identify solids by face and vertex structure and explain volume using base area and perpendicular height.',
    ],
    hook: [
      '把棱锥顶点侧移，侧棱变长，但到底面的垂直高不变，体积会跟着变吗？',
      'Move a pyramid apex sideways. Lateral edges change but its perpendicular base height does not. Must volume change?',
    ],
    prerequisites: ['P56-L05', 'P56-L06', 'H06-L01'],
    keywords: [
      ['棱柱', 'prism'],
      ['棱锥', 'pyramid'],
      ['垂直高', 'perpendicular height'],
    ],
    lab: 'solid-types',
    skill: 'solid-structure-and-height',
    hints: [
      [
        '棱柱有两全等平行底面，棱锥有一个底面和一个顶点；球无平面多边形面。',
        'A prism has two congruent parallel bases, a pyramid one base and an apex; a sphere has no flat polygonal faces.',
      ],
      [
        '棱柱V=Bh，棱锥V=Bh/3，球V=4πr³/3；h是垂直距离，r不是直径。',
        'Use V=Bh for a prism, Bh/3 for a pyramid, and 4πr³/3 for a sphere. Height is perpendicular distance and r is not diameter.',
      ],
    ],
    items: [
      N(
        [
          '六棱柱有多少个平面面？包括两个底面。',
          'How many flat faces has a hexagonal prism, including its two bases?',
        ],
        '8',
        [
          '六个侧面加两个底面，F=n+2=8。',
          'Six lateral faces plus two bases give F=n+2=8.',
        ],
        ['6', '12'],
      ),
      N(
        ['六棱柱有多少条棱？', 'How many edges has a hexagonal prism?'],
        '18',
        [
          '上下底各6条，侧棱6条，总数3n=18。',
          'Six edges in each base plus six lateral edges give 3n=18.',
        ],
        ['12', '8'],
      ),
      N(
        [
          '四棱锥有多少个顶点？',
          'How many vertices has a square-based pyramid?',
        ],
        '5',
        [
          '底面四点加一个锥顶，V=n+1=5。',
          'Four base vertices plus the apex give V=n+1=5.',
        ],
        ['4', '8'],
      ),
      N(
        [
          '棱锥底面积12 cm²、垂直高6 cm，体积是多少cm³？',
          'A pyramid has base area 12 cm² and perpendicular height 6 cm. Find volume in cm³.',
        ],
        '24',
        [
          'V=Bh/3=12×6/3=24 cm³，不能把侧棱当垂直高。',
          'V=Bh/3=12×6/3=24 cm³; a lateral edge is not the perpendicular height.',
        ],
        ['72', '36'],
        'cm³',
      ),
      I(
        [
          '球的半径为3 cm，求体积，保留π。',
          'A sphere has radius 3 cm. Find its exact volume retaining π.',
        ],
        { kind: 'pi-multiple', coefficient: '36', value: '36π', unit: 'cm³' },
        [
          '4πr³/3=4×27π/3=36π cm³。若3是直径则须先减半，但题设是半径。',
          '4πr³/3=4×27π/3=36π cm³. A diameter would first be halved, but three is explicitly the radius.',
        ],
        ['12π', '108π'],
      ),
      E(
        [
          '两个棱柱底面积都12 cm²，垂直高都6 cm，其中一个斜移了上底。它们体积、侧棱和表面积一定都相同吗？',
          'Two prisms both have base area 12 cm² and perpendicular height 6 cm; one top is sheared sideways. Must their volumes, lateral edges and surface areas all agree?',
        ],
        [
          '体积都为72 cm³，因为Bh不变。斜移会改变部分侧棱长度及侧面的面积，所以不能从等体积推出等侧棱或等表面积；必须按真实面求表面积。',
          'Both volumes are 72 cm³ because Bh is unchanged. Shear can change lateral-edge lengths and lateral-face areas, so equal volume does not imply equal lateral edges or surface area. Calculate areas from the actual faces.',
        ],
      ),
    ],
    pick: {
      stem: [
        '棱锥公式Bh/3中的h是什么？',
        'What is h in the pyramid formula Bh/3?',
      ],
      options: [
        ['任意一条侧棱的长度', 'The length of any lateral edge'],
        [
          '顶点到底面所在平面的垂直距离',
          'Perpendicular distance from apex to the base plane',
        ],
        ['图上看起来竖直的一段', 'A segment that looks vertical on screen'],
      ],
      feedback: [
        [
          '侧棱一般斜着，不等于垂直高。',
          'A lateral edge is generally sloping and differs from height.',
        ],
        [
          '正确；垂足可在底面内部或其延伸平面上。',
          'Correct; the perpendicular foot may lie inside the base or on its extended plane.',
        ],
        [
          '观察方向会改变屏幕投影，不能由屏幕竖直定义空间垂直。',
          'The camera changes projection; screen vertical does not define spatial perpendicularity.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '球有一个曲面边界。为什么不能把它当作本课多面体公式V−E+F=2中的一个平面面？',
      'A sphere has one curved boundary. Why cannot it simply count as one flat face in this lesson’s polyhedron formula V−E+F=2?',
    ],
    rubric: [
      '本课V、E、F计有限多面体的顶点、棱、平面多边形面。球没有这些顶点与棱，也没有平面多边形面，不能把一个完整曲面替换为该F。若要用拓扑欧拉公式须另作合适分割，本课不把这件事与立体分类混同。',
      'Here V,E,F count vertices, edges and flat polygonal faces of a finite polyhedron. A sphere has none of those polygonal faces or edges, so its whole curved surface cannot substitute for F. A topological Euler calculation needs a suitable separate decomposition, beyond these elementary face counts.',
    ],
    misconception: [
      '把曲面辅助圆当棱、漏掉底面，或把斜高/侧棱代替垂直高。',
      'Counting sphere guides as edges, omitting bases, or substituting slant height/lateral edges for perpendicular height.',
    ],
  },
  {
    title: ['截面与展开图', 'Cross-sections and nets'],
    objective: [
      '用真实交点和面对应判断截面及展开图，保留相切与重叠边界。',
      'Use actual intersections and face correspondences to evaluate sections and nets, including tangency and overlap.',
    ],
    hook: [
      '六个正方形排成2×3矩形并相连，就一定能折成正方体吗？',
      'Six connected squares form a 2×3 rectangle. Must they fold into a cube?',
    ],
    prerequisites: ['H06-L01', 'H06-L02', 'P56-L06'],
    keywords: [
      ['截面', 'cross-section'],
      ['展开图', 'net'],
      ['面对应', 'face correspondence'],
    ],
    lab: 'solid-sections',
    skill: 'sections-and-face-identity',
    hints: [
      [
        '截面是立体与平面的真实交集，先找棱交点再去重；点和线段不是多边形。',
        'A section is the actual intersection with a plane. Find edge intersections and deduplicate; points and segments are not polygons.',
      ],
      [
        '展开保持每块面的身份。六格相连是必要条件之一，折后方向重叠仍无效。',
        'Unfolding preserves face identity. Six connected tiles are one necessary condition; overlapping folded directions still invalidate a net.',
      ],
    ],
    items: [
      N(
        [
          '正方体0≤x,y,z≤4 cm被平面z=2切开，截面面积是多少cm²？',
          'A cube 0≤x,y,z≤4 cm is cut by z=2. Find section area in cm².',
        ],
        '16',
        [
          '截面仍是边长4的正方形，面积4×4=16 cm²。',
          'The section is a square of side four, area 4×4=16 cm².',
        ],
        ['8', '32'],
        'cm²',
      ),
      N(
        [
          '同一正方体被x+y+z=6切开，截面有多少个不同顶点？',
          'The same cube is cut by x+y+z=6. How many distinct section vertices result?',
        ],
        '6',
        [
          '顶点是(4,2,0)的六种坐标排列，形成六边形，不是按原面数直接猜。',
          'The six permutations of (4,2,0) are section vertices, giving a hexagon; this is not guessed from the cube’s face count.',
        ],
        ['3', '4'],
      ),
      R(
        [
          '平面x+y+z=2截同一正方体，三顶点为(2,0,0)、(0,2,0)、(0,0,2)。求截面面积的精确数值，不附单位。',
          'Plane x+y+z=2 gives vertices (2,0,0),(0,2,0),(0,0,2). Find the exact numerical area, without a unit suffix.',
        ],
        '2sqrt(3)',
        [
          '每边2√2，等边三角形面积(√3/4)(2√2)²=2√3 cm²；投影面积不等于此面积。',
          'Each side is 2√2; the equilateral area is (√3/4)(2√2)²=2√3 cm², not the projected area.',
        ],
        ['2', '4sqrt(3)'],
      ),
      C(
        [
          '六个单位正方形排成完整2×3矩形。判断valid-net/invalid-net。',
          'Six unit squares form a full 2×3 rectangle. Classify valid-net/invalid-net.',
        ],
        'invalid-net',
        [
          '相连六格不够；沿共边折90°会有重复面方向及不一致闭环，不能占满六个不同面。',
          'Six connected squares are insufficient. Quarter-turn folds create repeated face directions and inconsistent cycles, failing to cover six distinct cube faces.',
        ],
        ['valid-net', 'prism'],
      ),
      N(
        [
          '边长4 cm的正方体展开后，六个面的总面积是多少cm²？忽略接缝。',
          'A cube of side 4 cm is unfolded. Find total area of its six faces in cm², ignoring tabs.',
        ],
        '96',
        [
          '六个边长4的正方形，6×4²=96 cm²；折叠不改变面片面积。',
          'Six squares of side four have area 6×4²=96 cm²; folding preserves their areas.',
        ],
        ['16', '64'],
        'cm²',
      ),
      E(
        [
          '在0≤x,y,z≤4的正方体中，z=0的交集与x+y=0的交集有什么区别？说明为什么不能都叫四边形截面。',
          'For the cube 0≤x,y,z≤4, compare intersections with z=0 and x+y=0. Why are they not both quadrilateral sections?',
        ],
        [
          'z=0与一个底面重合，交集是边长4的正方形，面积16。x+y=0在x,y非负时只可能x=y=0，所以交集是z从0到4的一条棱，面积0。更极端x+y+z=0只有一个顶点；在边界不能伪造二维多边形。',
          'z=0 coincides with a square base face of area 16. With nonnegative x,y, x+y=0 forces x=y=0, so the intersection is one full edge, 0≤z≤4, of area zero. At x+y+z=0 it is just one vertex. Boundary intersections need not be two-dimensional polygons.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于正方体展开图，哪项最准确？',
        'Which statement about cube nets is most accurate?',
      ],
      options: [
        ['任意六个相连正方形都行', 'Any six connected squares work'],
        ['只要总面积等于六个面就行', 'Equal total area alone is sufficient'],
        [
          '还需折后六面互不重叠并正确相接',
          'Folded faces must be distinct, nonoverlapping and correctly joined',
        ],
      ],
      feedback: [
        [
          '2×3矩形就是反例；连通只是一项必要条件。',
          'A 2×3 rectangle is a counterexample; connectivity is only one necessary condition.',
        ],
        [
          '面积相同并不提供空间面对应。',
          'Equal area does not establish spatial face correspondence.',
        ],
        [
          '正确：保持编号，跟踪每面折转与对面关系。',
          'Correct: preserve IDs and track folds and opposite-face correspondences.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '“六块相连、面积正确”为什么仍不足以保证有效展开图？用2×3排布说明。',
      'Why are six connected tiles with the correct area insufficient for a valid net? Use the 2×3 arrangement.',
    ],
    rubric: [
      '每块都须折到正方体的一个不同面。2×3的折向会冲突或重叠，不能覆盖六个不同面，虽然面积与连通都满足。应说明面身份与折后相邻/相对关系，不能只凭轮廓像不像。',
      'Each tile must fold to a different cube face. The 2×3 arrangement has conflicting or overlapping folds and fails to cover six distinct faces despite correct area and connectivity. Explain face identity and folded adjacency/opposition, rather than outline resemblance.',
    ],
    misconception: [
      '把投影面积当截面面积，把相切棱当四边形，或只数六格就判展开图有效。',
      'Using projected area as section area, inventing a polygon at a tangent edge, or validating a net by tile count alone.',
    ],
  },
  {
    title: ['空间距离与角', 'Spatial distances and angles'],
    objective: [
      '用垂足、投影与直角三角形确定所求空间距离或角。',
      'Identify requested spatial distances or angles using perpendicular feet, projections and right triangles.',
    ],
    hook: [
      '长方体长3、宽4、高12，从A到G沿三条棱走19 cm，为何直线距离只有13 cm？',
      'In a 3×4×12 cuboid, a three-edge route A to G travels 19 cm. Why is the direct distance only 13 cm?',
    ],
    prerequisites: ['H06-L01', 'H05-L05', 'J87-L04', 'J96-L01'],
    keywords: [
      ['垂足', 'perpendicular foot'],
      ['正投影', 'orthogonal projection'],
      ['线面角', 'line-plane angle'],
    ],
    lab: 'solid-distances',
    skill: 'spatial-distance-and-projection',
    hints: [
      [
        '先明确点点、点线、点面或异面线距离；最短线段必须连在所问对象上且满足垂直条件。',
        'Identify point-point, point-line, point-plane or skew-line distance. A shortest segment must meet the requested objects with appropriate perpendicularity.',
      ],
      [
        '先求底面对角线，再求空间对角线；线面角由直线与其正投影组成，不是与法线或屏幕底边的角。',
        'Find the base diagonal before the space diagonal. A line-plane angle uses the line and its orthogonal projection, not its angle with a normal or screen baseline.',
      ],
    ],
    items: [
      R(
        [
          '长方体A=(0,0,0)、B=(3,0,0)、C=(3,4,0)、G=(3,4,12)。求AG长度的精确数值，不附单位。',
          'For cuboid A=(0,0,0),B=(3,0,0),C=(3,4,0),G=(3,4,12), find the exact numerical length AG, without a unit suffix.',
        ],
        '13',
        [
          'AC=√(3²+4²)=5；GC垂直底面，所以AG=√(5²+12²)=13 cm。',
          'AC=√(3²+4²)=5; GC is perpendicular to the base, so AG=√(5²+12²)=13 cm.',
        ],
        ['19', '169'],
      ),
      N(
        [
          '同一长方体中，G到底面ABCD所在平面的距离是多少cm？',
          'In the same cuboid, find distance from G to the plane ABCD in cm.',
        ],
        '12',
        [
          '垂足为C，最短距离GC=12 cm；AG斜着不是点面距离。',
          'The foot is C, giving perpendicular distance GC=12 cm; sloping AG is not the point-plane distance.',
        ],
        ['13', '5'],
        'cm',
      ),
      R(
        [
          '同一长方体中，G到完整直线AB的距离是多少？只填精确长度数值。',
          'In the same cuboid, find distance from G to full line AB. Enter only the exact numerical length.',
        ],
        '4sqrt(10)',
        [
          '垂足为B，GB在垂直于AB的侧面内；GB=√(4²+12²)=√160=4√10 cm。',
          'The foot is B; GB lies in a plane perpendicular to AB. GB=√(4²+12²)=√160=4√10 cm.',
        ],
        ['12', '13'],
      ),
      N(
        [
          '同一长方体中，异面直线AB与CG的距离是多少cm？',
          'In the same cuboid, find distance between skew lines AB and CG in cm.',
        ],
        '4',
        [
          'BC连接B∈AB与C∈CG，且同时垂直两线，所以公垂线段长BC=4 cm。',
          'BC joins B on AB to C on CG and is perpendicular to both, giving distance BC=4 cm.',
        ],
        ['3', '12'],
        'cm',
      ),
      R(
        [
          '同一长方体中，AG与底面ABCD的锐角θ，求cosθ的精确值。',
          'In the same cuboid, let θ be the acute angle between AG and base plane ABCD. Find exact cosθ.',
        ],
        '5/13',
        [
          'AG的正投影为AC，故θ=∠GAC，cosθ=AC/AG=5/13。',
          'The projection of AG is AC, so θ=∠GAC and cosθ=AC/AG=5/13.',
        ],
        ['12/13', '3/13'],
      ),
      E(
        [
          '比较A→B→C→G的路线长度、两点A/G距离和点G到底面距离；为什么是三个不同数？',
          'Compare route A→B→C→G, point-point distance A to G and distance from G to the base plane. Why are the three numbers different?',
        ],
        [
          '路线沿三条棱长3+4+12=19 cm；两点最短直线段AG=13 cm；点面距离为垂直段GC=12 cm。三者所问对象与允许路径不同，不能因为都用cm就混为一谈。',
          'The edge route has length 3+4+12=19 cm; the shortest segment between A and G is AG=13 cm; point-plane distance is perpendicular GC=12 cm. They use different objects and permitted paths, despite sharing centimetre units.',
        ],
      ),
    ],
    pick: {
      stem: [
        'AG与底面的线面角，应取哪两条射线的夹角？',
        'Which rays define the line-plane angle of AG with the base?',
      ],
      options: [
        ['AG与AC（AG的正投影）', 'AG and AC, its orthogonal projection'],
        ['AG与GC（底面法线）', 'AG and GC, a base normal'],
        ['AG与屏幕水平线', 'AG and the screen horizontal'],
      ],
      feedback: [
        [
          '正确：把G垂直投到底面C，A本来在面内。',
          'Correct: project G perpendicularly to C while A already lies in the base.',
        ],
        [
          '与法线的锐角是余角，不能直接替代线面角。',
          'The acute angle with a normal is complementary, not the requested angle itself.',
        ],
        [
          '投影依观察方向改变，屏幕水平没有该空间含义。',
          'Projection changes with the camera; screen horizontal has no such spatial meaning.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '长方体ABCD-EFGH底边AB=3 cm、BC=4 cm，竖棱CG=12 cm。有人给AG与底面夹角的cos写12/13。指出它对应什么，并给出正确投影解释。',
      'In cuboid ABCD-EFGH, AB=3 cm, BC=4 cm and vertical CG=12 cm. Someone gives 12/13 as the cosine of the angle between AG and the base. Identify that ratio and explain the correct projection.',
    ],
    rubric: [
      '底面正投影AC=5、AG=13、垂直高GC=12。线面角θ=∠GAC，cosθ=5/13，sinθ=12/13；12/13也可作为AG与竖直方向锐角的余弦。必须先指定角的两边，不能用投影图量角。',
      'The base projection AC=5, AG=13 and perpendicular GC=12. For θ=∠GAC, cosθ=5/13 and sinθ=12/13;12/13 is also the cosine of the acute angle with the vertical direction. Identify both angle rays before using ratios; do not measure the perspective diagram.',
    ],
    misconception: [
      '混淆路线和最短距离、漏垂足，或把与法线夹角当线面角。',
      'Confusing a route with shortest distance, omitting a perpendicular foot, or substituting a normal angle for a line-plane angle.',
    ],
  },
  {
    title: ['体积与表面积综合', 'Combined volumes and surface areas'],
    objective: [
      '在无内部重叠的拼合体中分别核算体积与外露面积，并解释缩放与单位。',
      'Calculate volume and exposed area separately for joined solids with disjoint interiors, explaining scale and units.',
    ],
    hook: [
      '6×4×2 cm底块上放3×2×2 cm小块，两个完整表面积直接相加就是涂色面积吗？',
      'Place a3×2×2 cm block on a6×4×2 cm base block. Does adding their full surface areas give the painted area?',
    ],
    prerequisites: ['H06-L02', 'H06-L03', 'P56-L06', 'P63-L05'],
    keywords: [
      ['接触面', 'contact face'],
      ['外露面积', 'exposed area'],
      ['比例缩放', 'scale change'],
    ],
    lab: 'solid-composite',
    skill: 'composite-volume-exposed-area',
    hints: [
      [
        '先画接触片并写尺寸；内部不重叠时体积相加，面片本身不占体积。',
        'Identify and dimension the contact patch. Add volumes when interiors are disjoint; a face patch contributes no volume.',
      ],
      [
        '外露面积=两完整表面积之和−2×接触面积；长度乘k，面积乘k²、体积乘k³。',
        'Exposed area equals both full surface areas minus twice contact area. Scaling lengths by k scales area by k² and volume by k³.',
      ],
    ],
    items: [
      N(
        [
          '6×4×2 cm底块上平放3×2×2 cm小块，内部无重叠。总体积是多少cm³？',
          'A3×2×2 cm block sits flush on a6×4×2 cm base without overlapping interiors. Find total volume in cm³.',
        ],
        '60',
        [
          '底块48、小块12，体积和60 cm³。接触面积不是要减去的体积。',
          'The blocks have volumes 48 and 12, totaling 60 cm³. Contact area is not volume to subtract.',
        ],
        ['48', '54'],
        'cm³',
      ),
      N(
        [
          '同一拼合体，接触片为3×2 cm。两块完整表面积分别88、32 cm²，求外露总面积。',
          'For the same assembly the contact patch is 3×2 cm. Full surface areas are 88 and 32 cm². Find exposed total area.',
        ],
        '108',
        [
          '88+32−2×6=108 cm²，两份接触面都埋在内部。',
          '88+32−2×6=108 cm²; both copies of the contact patch are buried.',
        ],
        ['120', '114'],
        'cm²',
      ),
      N(
        [
          '同一拼合体中，两个块实际接触的面片面积是多少cm²？',
          'Find the actual contact-patch area of the same joined blocks in cm².',
        ],
        '6',
        [
          '小块底面完全落在大块顶面内，交叠片3×2=6 cm²，不是整个大块顶面24。',
          'The smaller base lies fully within the large top, so the shared patch is 3×2=6 cm², not the entire 24 cm² top.',
        ],
        ['12', '24'],
        'cm²',
      ),
      N(
        [
          '单独一个无盖长方体盒，底6×4 cm、垂直高2 cm，忽略厚度和接缝。材料面片总面积是多少cm²？',
          'A separate open-top cuboid box has base 6×4 cm and height 2 cm. Ignore thickness and tabs. Find material face area in cm².',
        ],
        '64',
        [
          '保留底24与四侧2×6×2+2×4×2=40，合计64 cm²；只去顶24。',
          'Retain bottom 24 and four walls 2×6×2+2×4×2=40, totaling 64 cm². Remove only the top 24.',
        ],
        ['88', '40'],
        'cm²',
      ),
      N(
        [
          '将原体积60 cm³拼合体的所有长度放大为2倍，总体积是多少cm³？',
          'Scale every length of the original 60 cm³ assembly by two. Find the new volume in cm³.',
        ],
        '480',
        [
          '体积乘2³=8，60×8=480 cm³；原外露面积108则乘4得432 cm²。',
          'Volume scales by 2³=8, so 60×8=480 cm³; exposed area 108 instead scales by four to 432 cm².',
        ],
        ['120', '240'],
        'cm³',
      ),
      E(
        [
          '纸上展示台模型由6×4×2 cm底块与平放其上的3×2×2 cm顶块拼成，接触片3×2 cm，内部不重叠。每1 cm模型长度代表实际10 cm。求实际体积与外露面积；每张材料覆盖0.5 m²，须买几整张？说明模型假设。',
          'A paper display-plinth model has a 6×4×2 cm base and a 3×2×2 cm top block, flush over a 3×2 cm contact patch with disjoint interiors. Each model centimetre represents 10 cm. Find actual volume and exposed area. Sheets cover 0.5 m² each; how many whole sheets are needed? State assumptions.',
        ],
        [
          '长度乘10，体积60×1000=60000 cm³=60 L，外露面积108×100=10800 cm²=1.08 m²。1.08/0.5=2.16，须3整张；已假设零厚度、无内部重叠、忽略裁切损耗，不把精确面积份额当整张采购数。',
          'Lengths scale by ten: volume 60×1000=60000 cm³=60 L and exposed area 108×100=10800 cm²=1.08 m². The fraction 1.08/0.5=2.16 requires three whole sheets. State zero thickness, disjoint interiors and no cutting loss; the exact area quotient differs from the whole purchase count.',
        ],
      ),
    ],
    pick: {
      stem: [
        '两个块粘合后，为什么外露面积要减去两份接触片？',
        'Why subtract two contact patches after joining two blocks?',
      ],
      options: [
        [
          '接触片属于两块各一个原表面，现在都不外露',
          'Each original solid contributes one patch and both become buried',
        ],
        ['接触片的体积损失了两次', 'Contact volume is lost twice'],
        [
          '任意拼合都应减去两个完整大面',
          'Every assembly removes two entire large faces',
        ],
      ],
      feedback: [
        [
          '正确；先算实际接触片，再从两份原表面积中各去一份。',
          'Correct: find the actual patch and remove one copy from each original surface area.',
        ],
        [
          '面片没有三维体积，体积在无内部重叠时仍相加。',
          'A face patch has no three-dimensional volume; disjoint-interior volumes still add.',
        ],
        [
          '部分接触只减重合片，不减掉仍外露的剩余面。',
          'Partial contact removes only the common patch, preserving exposed remainders.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '有人算外露面积为88+32−6=114 cm²。指出漏掉哪一片，并核对正确结果。',
      'Someone calculates exposed area as 88+32−6=114 cm². Identify the omitted removal and check the result.',
    ],
    rubric: [
      '88包含大块顶面接触区，32包含小块底面接触区；这两份面积6都不外露，故应120−12=108 cm²。虽然几何接触片只有一个位置，原表面积和把它的两个面身份各算过一次。',
      'The 88 includes the large top patch and the 32 includes the small bottom patch. Both 6 cm² copies are buried, giving 120−12=108 cm². One geometric contact location was counted twice in the sum of separate surface areas, once for each face identity.',
    ],
    misconception: [
      '把体积和表面积混算、只扣一次接触、去掉整个大面，或把长度倍率用于所有量。',
      'Mixing volume and area, subtracting contact once, removing an entire large face, or applying a length factor to every quantity.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  const s = specs[i]!;
  if (v.answer.kind === 'explain')
    return reasoning(id, T(v.stem), s.skill, v.answer.rubric, s.hints.map(T));
  const value = 'value' in v.answer ? String(v.answer.value) : '';
  const result = numeric(
    id,
    T(v.stem),
    value,
    s.skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(v.step)],
    { accepted: [value], rejected: v.wrong },
  );
  result.answer = v.answer;
  return result;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h06Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H06-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H10',
    unit: 'H06',
    order: i + 1,
    nzYearHints: [10, 11, 12],
    cnGradeHints: [10],
    contentStatus: 'ready',
    skillTags: [s.skill],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(`${id}-Q6`, T(s.reason), s.skill, T(s.rubric), s.hints.map(T)),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: [
        t(
          '所问的是完整直线、平面、面片、距离还是面积？前提是什么？',
          'Are you studying full lines, planes, face patches, distances or areas? What are the premises?',
        ),
        t(
          '换视角后什么保持？能用坐标、面身份或单位独立核验吗？',
          'What survives a camera change? Can coordinates, face identity or units independently audit it?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h06ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H06-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H06 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24;
  let item: Item;
  if (i === 0) {
    const codes: SolidCode[] = [
        'skew',
        'parallel',
        'intersecting',
        'contained',
        'coincident',
        'intersecting',
      ],
      stems: Pair[] = [
        [
          '长方体ABCD-EFGH中，完整直线AB与CG的关系',
          'In cuboid ABCD-EFGH, classify full lines AB and CG',
        ],
        [
          '长方体ABCD-EFGH中，完整直线AB与CD的关系',
          'In cuboid ABCD-EFGH, classify full lines AB and CD',
        ],
        [
          '长方体ABCD-EFGH中，完整直线AB与AE的关系',
          'In cuboid ABCD-EFGH, classify full lines AB and AE',
        ],
        [
          '完整直线AB与底面ABCD的关系',
          'Classify full line AB relative to base plane ABCD',
        ],
        ['完整直线AB与BA的关系', 'Classify full lines AB and BA'],
        ['底面ABCD与侧面ABFE所在平面的关系', 'Classify planes ABCD and ABFE'],
      ];
    const j = k % 6,
      a = 2 + Math.floor(k / 6);
    item = C(
      [
        `${stems[j]![0]}？底边${a} cm，其他尺寸正且垂直。`,
        `${stems[j]![1]}. Base edge ${a} cm, with positive orthogonal dimensions.`,
      ],
      codes[j]!,
      [
        '根据三维关系，不从屏幕交叉下结论。',
        'Use spatial incidence rather than screen crossings.',
      ],
      ['sphere', 'valid-net'],
    );
  } else if (i === 1) {
    const n = 3 + (k % 6),
      height = 3 + Math.floor(k / 6),
      kind = k % 2 === 0 ? 'prism' : 'pyramid',
      m = solidCounts(kind, n),
      ask = k % 3;
    item =
      ask === 2
        ? N(
            [
              `${n}棱${kind === 'prism' ? '柱' : '锥'}底面积12 cm²，垂直高${height} cm，求体积cm³。`,
              `An ${n}-gonal ${kind} has base area 12 cm² and perpendicular height ${height} cm. Find volume in cm³.`,
            ],
            textR(solidVolume(kind, 12, height)),
            [
              '用底面积与垂直高，棱锥再除3。',
              'Use base area and perpendicular height, dividing by three for a pyramid.',
            ],
            ['999', '-1'],
            'cm³',
          )
        : N(
            [
              `${n}棱${kind === 'prism' ? '柱' : '锥'}，垂直高${height} cm，求${ask === 0 ? '平面面数' : '棱数'}。`,
              `For an ${n}-gonal ${kind} with height ${height} cm, find ${ask === 0 ? 'flat face count' : 'edge count'}.`,
            ],
            String(ask === 0 ? m.faces : m.edges),
            [
              '按结构分组计数，高度不改变面棱数。',
              'Group by structure; height does not alter face or edge counts.',
            ],
            ['999', '-1'],
          );
  } else if (i === 2) {
    const net = k % 2 === 1;
    if (net) {
      const keys = ['cross', 'stair', 'rectangle', 'strip'] as const,
        key = keys[Math.floor(k / 2) % 4]!,
        m = foldCubeNet(solidNets[key]),
        labels: Record<typeof key, Pair> = {
          cross: [
            '四格带第二格上下各接一格',
            'a four-square belt with flaps above and below its second square',
          ],
          stair: [
            '坐标(0,0),(1,0),(1,1),(2,1),(2,2),(3,2)',
            'cells (0,0),(1,0),(1,1),(2,1),(2,2),(3,2)',
          ],
          rectangle: ['2×3矩形', 'a 2×3 rectangle'],
          strip: ['一行六格', 'six squares in one row'],
        },
        side = 1 + Math.floor(k / 8);
      item = C(
        [
          `边长${side} cm的六格排布：${labels[key][0]}。判断valid-net/invalid-net。`,
          `Six squares of side ${side} cm form ${labels[key][1]}. Classify valid-net/invalid-net.`,
        ],
        m.valid ? 'valid-net' : 'invalid-net',
        [
          '保持面对应，长度缩放不修复重叠。',
          'Track face identity; scaling does not repair overlapping folds.',
        ],
        ['sphere', 'skew'],
      );
    } else {
      const side = 2 + Math.floor(k / 8),
        d =
          k % 8 === 0
            ? 0
            : k % 8 === 2
              ? side
              : k % 8 === 4
                ? 2 * side
                : 3 * side + 1,
        diagonal = k % 8 !== 2,
        m = cubeSection(
          side,
          diagonal ? [1, 1, 1] : [0, 0, 1],
          rational(BigInt(d)),
        );
      item = N(
        [
          `0≤x,y,z≤${side}的正方体与${diagonal ? 'x+y+z' : 'z'}=${d}相交，数不同顶点/端点，空集记0。`,
          `Intersect cube 0≤x,y,z≤${side} with ${diagonal ? 'x+y+z' : 'z'}=${d}. Count distinct vertices/endpoints; use 0 for empty.`,
        ],
        String(m.points.length),
        [
          '棱交点去重，边界可能退化。',
          'Deduplicate edge intersections and preserve degenerate boundaries.',
        ],
        ['999', '-1'],
      );
    }
  } else if (i === 3) {
    const a = 3 + (k % 4),
      b = 4 + (Math.floor(k / 4) % 3),
      h = 2 + Math.floor(k / 12) * 4,
      m = spaceDistances(a, b, h),
      query = k % 3;
    item = R(
      [
        `长方体a=${a},b=${b},h=${h} cm，求${query === 0 ? '空间对角线AG长度数值' : query === 1 ? 'G到底面距离数值' : 'AG与底面夹角的cos'}，长度不附单位。`,
        `For cuboid a=${a},b=${b},h=${h} cm, find ${query === 0 ? 'numerical space diagonal AG' : query === 1 ? 'numerical distance G to the base' : 'cosine of the angle AG makes with the base'}. Omit unit suffixes for lengths.`,
      ],
      query === 0 ? m.body : query === 1 ? m.pointPlane : m.linePlaneCos,
      [
        '用垂足C与底面投影AC辨认量。',
        'Use foot C and base projection AC to identify the quantity.',
      ],
      ['999', '-999'],
    );
  } else {
    const kind = (['top', 'full-width', 'side', 'gap'] as const)[k % 4]!,
      scale = 1 + Math.floor(k / 12),
      m = compoundCase(kind, scale),
      query = k % 3,
      label: Record<typeof kind, Pair> = {
        top: ['顶放3×2×2块', 'a 3×2×2 block on top'],
        'full-width': ['顶放3×4×2块', 'a 3×4×2 block on top'],
        side: [
          '侧放3×2×2块（接触2×2面）',
          'a 3×2×2 block at the side (2×2 contact)',
        ],
        gap: ['分开放3×2×2块', 'a separate 3×2×2 block'],
      };
    item = N(
      [
        `底块6×4×2，${label[kind][0]}，全部长度乘${scale}，单位cm。求${query === 0 ? '总体积cm³' : query === 1 ? '接触面积cm²' : '外露总面积cm²'}。`,
        `Base 6×4×2 with ${label[kind][1]}, all lengths scaled by ${scale} in cm. Find ${query === 0 ? 'total volume in cm³' : query === 1 ? 'contact area in cm²' : 'exposed total area in cm²'}.`,
      ],
      String(query === 0 ? m.volume : query === 1 ? m.contact : m.surface),
      [
        '体积加，表面积去两份实际接触；倍率分别立方/平方。',
        'Add volumes, subtract two contact patches from surface area; use cubic/square scaling.',
      ],
      ['999', '-1'],
      query === 0 ? 'cm³' : 'cm²',
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h06CheckQuestions: Question[] = [
  q('H06-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('H06-CHECK-Q2', 1, specs[1]!.items[3]!),
  q('H06-CHECK-Q3', 2, specs[2]!.items[3]!),
  q('H06-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('H06-CHECK-Q5', 4, specs[4]!.items[1]!),
  pick('H06-CHECK-Q6', 2),
  reasoning(
    'H06-CHECK-Q7',
    T(specs[3]!.reason),
    specs[3]!.skill,
    T(specs[3]!.rubric),
    specs[3]!.hints.map(T),
  ),
  q('H06-CHECK-Q8', 4, specs[4]!.items[5]!),
];
