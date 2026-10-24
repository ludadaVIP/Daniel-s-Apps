import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const netCells = (first: boolean) =>
  first
    ? [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [1, 0],
        [1, 2],
      ]
    : [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
      ];
const netDiagram = (first: boolean): NumberDiagram => {
  const cells = netCells(first);
  return {
    kind: 'cartesian',
    bounds: { xMin: 0, xMax: 5, yMin: 0, yMax: 3.5, xStep: 1, yStep: 0.5 },
    points: cells.map(([x, y], i) => ({
      x: x! + 0.5,
      y: y! + 0.5,
      label: `${i + 1}`,
    })),
    curves: cells.map(([x, y], i) => ({
      name: `Square ${i + 1}`,
      points: [
        { x: x!, y: y! },
        { x: x! + 1, y: y! },
        { x: x! + 1, y: y! + 1 },
        { x: x!, y: y! + 1 },
        { x: x!, y: y! },
      ],
    })),
    caption: t(
      `给定编号1–6的六个单位正方形，左下角依次${cells.map(([x, y], i) => `${i + 1}:(${x},${y})`).join('；')}。坐标只规定纸上排布，尚未说明是否能折成六个不同面。`,
      `Given labelled unit squares 1–6, with lower-left corners ${cells.map(([x, y], i) => `${i + 1}:(${x},${y})`).join('; ')}. Coordinates specify the paper layout, without asserting that it folds to six distinct faces.`,
    ),
  };
};
const makeSet = (unit: 'H23' | 'H36') => {
  const first = unit === 'H23',
    id = (i: number) => `${unit}-MAINT-SPATIAL-STRUCTURE-Q${i}`;
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), skill, t(sz, se), [
      t(hz, he),
      t(
        '先画并保留点、棱、面身份；用真实分量和原条件核查，投影图的像不像不代替几何依据。',
        'Draw first, preserving point, edge and face identities. Check true components and original conditions; a suggestive projection is not a geometric proof.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-SPATIAL-STRUCTURE`,
    unit,
    bridge: 'H06-L01',
    bridgeByQuestion: Object.fromEntries(
      ['H06-L01', 'H06-L02', 'H06-L03', 'H06-L03', 'H06-L04', 'H06-L05'].map(
        (l, i) => [id(i + 1), l],
      ),
    ),
    title: t(
      '空间模型之后，再核结构、截面与外露面',
      'After spatial models, recheck structure, sections and exposed faces',
    ),
    intro: t(
      '六题分次，每次一题，图和理由可分开写。可用纸模型或纸笔，解释人工核验，不计时；所有尺寸为题设资料。',
      'Choose one of six tasks per sitting, splitting drawing and explanation if useful. Paper models or sketches are welcome. Arguments are human-reviewed without a timer; all dimensions are stipulated givens.',
    ),
    questions: [
      task(
        1,
        'spatial-incidence-and-coplanarity',
        `给${first ? 'A=(0,0,0),B=(1,0,0),C=(0,1,0),D=(0,0,1)' : 'A=(1,1,1),B=(3,1,1),C=(1,3,1),D=(1,1,3)'}。说明AB为什么确定一条完整直线，而重复A,A不行；再审直线AB与CD为相交、平行还是异面，写实际坐标依据。A,B,C确定哪平面，D在其中吗？不能从屏幕交叉断言相交。`,
        `Given ${first ? 'A=(0,0,0),B=(1,0,0),C=(0,1,0),D=(0,0,1)' : 'A=(1,1,1),B=(3,1,1),C=(1,3,1),D=(1,1,3)'},explain why AB determines a complete line but repeating A,A does not. Classify lines AB and CD as intersecting,parallel or skew,with coordinate evidence. Which plane do A,B,C determine,and does D belong? A screen crossing cannot certify intersection.`,
        first
          ? 'A≠B且B−A=(1,0,0)非零，故唯一AB；重复A只固定位置，AB与AD都是过A的不同方向，不能唯一。AB点(t,0,0)，CD点(0,1−s,s)，相交需s0又1−s0矛盾；方向(1,0,0)与(0,−1,1)不平行，故异面。A,B,C不共线，确定平面z0，D的z1不在；若两异面线共面则平面内非平行必相交，与无交矛盾。'
          : 'B−A=(2,0,0)非零，A≠B决定唯一完整直线；重复A仍可选AB或AD，方向未定。AB点(1+2t,1,1)，CD点(1,3−2s,1+2s)，相交会要求s0同时s1，矛盾；两方向不平行，故异面。A,B,C不共线，平面z1，D的z3在外；同一二维投影相交不移除第三坐标的矛盾。',
        first
          ? 'Distinct A,B give nonzero direction(1,0,0) and a unique line. Repeating A fixes only a position: AB and AD give different lines through it. AB=(t,0,0),CD=(0,1−s,s). Intersection would require s=0 and1−s=0 simultaneously,impossible. Directions are not parallel,so the lines are skew. Noncollinear A,B,C determine z=0,excluding D at z=1. Nonparallel coplanar lines would intersect,so these lines cannot be coplanar.'
          : 'Distinct A,B give nonzero direction(2,0,0). Repeated A leaves both AB and AD possible. AB=(1+2t,1,1),CD=(1,3−2s,1+2s). Intersection would require s=0 and s=1 simultaneously,impossible; directions are not parallel,so they are skew. Noncollinear A,B,C determine z=1,excluding D at z=3. A projection cannot remove the third-coordinate contradiction.',
        '写两条参数直线并同时核三分量；三个点确定平面还需不共线。',
        'Write both parametric lines and check all three components simultaneously. Three points determine a plane only when noncollinear.',
      ),
      task(
        2,
        'solid-structure-and-height',
        `给凸${first ? '五' : '六'}边形底的棱柱与棱锥，分别数顶点V、棱E、平面多边形面F，核V−E+F。两者底面积均${first ? 15 : 18}cm²，垂直高均${first ? 4 : 5}cm，另给一条斜棱${first ? 5 : 13}cm，求体积并说明该用哪个高。球的完整曲面能当此F的一个面代入吗？`,
        `For a prism and pyramid with a convex ${first ? 'pentagonal' : 'hexagonal'} base,count vertices V,edges E and planar polygonal faces F,and check V−E+F. Both have base area ${first ? 15 : 18}cm² and perpendicular height ${first ? 4 : 5}cm; a sloping edge measures ${first ? 5 : 13}cm. Find both volumes and justify the height used. May a sphere’s entire curved boundary count as one such F face?`,
        first
          ? '五棱柱V10/E15/F7，五棱锥V6/E10/F6，两者V−E+F2；底和侧面的身份分别计数。体积15×4=60cm³及15×4/3=20cm³；高是到底平面的垂距4，斜棱5不是此h。此有限多面体计数中的F只指平面多边形面；球的一个曲面不是一张这种面，不能写0−0+1再套2。拓扑分割需另定义，不把立体分类与其混用。'
          : '六棱柱V12/E18/F8，六棱锥V7/E12/F7，两者欧拉值2。体积18×5=90cm³和18×5/3=30cm³，使用垂直高5，不用斜棱13。F在本课有限多面体中数平面多边形面，球曲面不在该计数对象内；不能把完整曲面当F1而套此式。拓扑上的适当分割是另一个定义问题。',
        first
          ? 'The pentagonal prism has V10,E15,F7; the pyramid V6,E10,F6. Both give two. Volumes use perpendicular height four:60cm³ and20cm³,not the sloping edge five. Here F counts planar polygonal faces of a finite polyhedron. A sphere’s whole curved boundary is not one such face,so0−0+1 cannot be substituted into this formula. A separately defined topological decomposition is a different question.'
          : 'The hexagonal prism has V12,E18,F8; the pyramid V7,E12,F7. Both give two. Perpendicular height five gives volumes90cm³ and30cm³,not the sloping edge thirteen. F here counts planar polygonal faces of a finite polyhedron,not a sphere’s curved boundary. A topological decomposition requires a separate definition and cannot be silently substituted into this classification.',
        '把底面、侧面和顶点分别数；先辨垂高与斜棱，再辨多面体面与曲面。',
        'Count bases,sides and vertices separately. Distinguish perpendicular height from sloping edge,and polygonal faces from curved surfaces.',
      ),
      task(
        3,
        'sections-and-face-identity',
        first
          ? '立方体0≤x,y,z≤2被平面x+y+z=2截。列全部交点并按边界顺序连图，求精确截面积。再把右端改6和7，交集分别是什么维数？为什么不能继续假定三角形且面积公式不变？'
          : '立方体0≤x,y,z≤3被平面x+y=3截。列全部交点按边界顺序连图并求精确面积；再把右端改0和−1，交集分别是什么维数？空间图看似四边形是否足够判截面？',
        first
          ? 'Cut cube0≤x,y,z≤2 by x+y+z=2. List all section vertices,connect them in boundary order,and find exact area. Change the right side to six and seven: what are the intersections and dimensions? Why cannot the triangular area formula simply persist?'
          : 'Cut cube0≤x,y,z≤3 by x+y=3. List all section vertices in boundary order and find exact area. Change the right side to zero and negative one: what are the intersections and dimensions? Is a quadrilateral-looking projection sufficient?',
        first
          ? '交点(2,0,0),(0,2,0),(0,0,2)，各对距离2√2，等边三角形面积(√3/4)×8=2√3cm²。其余立方体棱无新交点，须由三坐标非负且和2核每边界。右端6时三项各≤2，和6仅(2,2,2)，交集维0不是三角；右端7超过最大和6，空集。接触顶点或无交不能套原二维截面积公式。'
          : '交点(0,3,0),(3,0,0),(3,0,3),(0,3,3)，上下平行边长3√2，竖边3且点积0，为矩形，面积9√2cm²。全部由x+y3、各坐标0..3的边界核出。右端0因x,y非负只能x=y0，交为整条棱(0,0,z),0≤z≤3，维1；右端−1不可能，空集。投影轮廓不决定交集维数，须用完整范围。',
        first
          ? 'Vertices are(2,0,0),(0,2,0),(0,0,2),each pair distance2√2,so the equilateral area is2√3cm². Nonnegative coordinates with sum two account for every edge intersection. At sum six,each coordinate must attain its maximum two: only(2,2,2),dimension zero. Sum seven exceeds the cube maximum six,giving the empty set. A point contact or empty intersection cannot inherit a two-dimensional triangular area formula.'
          : 'Vertices in order are(0,3,0),(3,0,0),(3,0,3),(0,3,3). Sides3√2 and3 are perpendicular,giving rectangle area9√2cm². Coordinate bounds certify all intersections. At sum zero,nonnegative x,y force x=y=0 and leave the entire edge(0,0,z),0≤z≤3,dimension one. Sum−1 is impossible,giving empty. A projected outline cannot determine the intersection dimension.',
        '先交平面与立方体的边界，再排重、定维；触顶点或沿棱不是原多边形。',
        'Intersect the plane with cube boundaries,remove duplicates and determine dimension. Vertex or edge contact is not the original polygon.',
      ),
      {
        ...task(
          4,
          'sections-and-face-identity',
          `图给六个编号单位正方形。先剪纸或逐个折向，判断是否为立方体有效展开图，写三个相对面编号对并说明六面不重复。再亲画${first ? '两行各三格的2×3矩形' : '同一行连续六格'}，各格按${first ? '下行从左到右1,2,3，上行4,5,6' : '从左到右1–6'}编号；指出折向矛盾或重复面，为什么连通、六格、面积6都不充分？`,
          `The figure gives six labelled unit squares. Cut/fold paper or track each face orientation to decide whether it is a cube net. Give all three opposite-face label pairs and explain six distinct faces. Then draw ${first ? 'a2×3 rectangle,labelled1,2,3 along the lower row and4,5,6 above' : 'six consecutive squares in one row,labelled1–6'}. Identify a folding conflict or repeated face. Why are connectedness,six squares and area six insufficient?`,
          first
            ? '给定排布可折六个不同面，相对面1/3、2/4、5/6。可固定1为基准面，沿四连格折向四个侧面，再将5/6折到剩余上下两面；面法向六种不重复。2×3矩形内有2×2环：从1经2到5与从1经4到5给5不同折向，不能保持每条共享边铰接且覆盖六不同面。面积和连通只检纸片，不检折后面身份。'
            : '给定阶梯排布六面互异，相对面1/4、2/5、3/6。逐个共享边转直角可给法向顺序z,x,y,−z,−x,−y，六种方向各一次。六连条折四格一周后，第5与1同面方向，第6与2同面方向，重叠而未覆盖六不同面；六格面积6且连通仍不够。要核折后面身份及相邻/相对关系。',
          first
            ? 'The given layout folds to six distinct faces,with opposite pairs1/3,2/4,5/6. A reference face and successive quarter-turns give six different normals. In the2×3 rectangle,the2×2 loop gives incompatible orientations for face five via1→2→5 versus1→4→5; it cannot preserve all shared-edge hinges and cover six distinct faces. Area and connectedness test the paper,not folded face identity.'
            : 'The staircase gives six distinct faces with opposite pairs1/4,2/5,3/6. Successive quarter-turns may give normals z,x,y,−z,−x,−y,each once. A six-square strip returns after four turns: face five repeats face one’s orientation and six repeats two,leaving overlaps and missing cube faces. Six connected squares of area six do not certify folded face identities or adjacency.',
          '给每张面保留编号，沿共享边追踪折向；同一面从不同路径必须得到同一朝向。',
          'Keep face labels while tracking quarter-turns across shared edges. Different paths to the same face must agree.',
        ),
        diagram: netDiagram(first),
      },
      task(
        5,
        'spatial-distance-and-projection',
        `长方体ABCD-EFGH的AB=${first ? 2 : 4}cm、BC=${first ? 3 : 4}cm、CG=${first ? 6 : 7}cm，竖棱垂直底面。画AG的底面正投影，求底面对角线AC、体对角线AG和G到底面距离；给AG与底面锐角θ的sin/cos，并解释${first ? '6/7' : '7/9'}何时是另一个角的cos。屏幕量角能取代这个投影吗？`,
        `A cuboid ABCD-EFGH has AB=${first ? 2 : 4}cm,BC=${first ? 3 : 4}cm and CG=${first ? 6 : 7}cm,with vertical edges perpendicular to the base. Draw AG’s orthogonal base projection. Find AC,AG and G’s distance to the base,and give sine/cosine of AG’s acute angle θ with the base. When is${first ? '6/7' : '7/9'} instead a cosine of another angle? Can a screen angle replace this projection?`,
        first
          ? 'AC=√13cm，AG=√(13+36)=7cm，G到平面垂距GC6cm。AG的底面投影是AC，线面角θ=∠GAC，cosθ=√13/7、sinθ=6/7。AG与竖直GC方向的锐角为θ的余角，其cos6/7；先指定两边才有这个身份。空间投影压缩不同方向，屏幕量角不保真实角，必须核正交投影和实际边长。'
          : 'AC=√32=4√2cm，AG=√(32+49)=9cm，点面距离GC7cm。投影AC与AG夹θ，cosθ=4√2/9、sinθ=7/9；与竖直方向的锐角为余角，cos7/9。不能把竖高当平面内邻边或由相机像素定角，投影图只是解释，真实正交关系才支撑公式。',
        first
          ? 'AC=√13cm,AG=√(13+36)=7cm,and the perpendicular point-to-plane distance is GC=6cm. The base projection of AG is AC,so θ=angle GAC,cosθ=√13/7 and sinθ=6/7. The acute angle with vertical direction GC is complementary and has cosine6/7. Specify both rays before identifying a ratio. Screen projection distorts angles; use actual orthogonal projection and lengths.'
          : 'AC=√32=4√2cm,AG=√(32+49)=9cm,and point-to-plane distance GC=7cm. AG projects to AC,so cosθ=4√2/9 and sinθ=7/9. Its acute angle with the vertical is complementary,with cosine7/9. A vertical height is not the in-plane adjacent side,and camera pixels cannot certify the true angle.',
        '把线面角改写成线与其正投影的夹角，再在真直角三角形里找邻边。',
        'Use the angle between the line and its orthogonal projection,then identify the adjacent side in the actual right triangle.',
      ),
      task(
        6,
        'composite-volume-exposed-area',
        `两实心长方体内部不重叠，无胶层：大块尺寸${first ? '5×4×3' : '6×3×2'}cm，小块${first ? '2×3×2' : '3×2×2'}cm。小块底面完整贴在大块顶面范围内，接触面积6cm²。分别求体积和各自表面积之和，再求组合体全部外露表面积，说明为什么要扣两份接触面。若分开留空隙，或整体各长度乘2，哪些量怎样变？`,
        `Two solid cuboids have disjoint interiors and no glue layer: the large block measures ${first ? '5×4×3' : '6×3×2'}cm and small block${first ? '2×3×2' : '3×2×2'}cm. The small base lies wholly within the large top with contact area6cm². Find combined volume,the sum of separate surface areas,and total exposed area. Why subtract two contact-face contributions? What changes if the blocks are separated by a gap,or every length doubles?`,
        first
          ? '体积60+12=72cm³，表面积大2(20+15+12)=94cm²、小2(6+4+6)=32cm²，原和126cm²。大顶被遮6，小底也原计6，外露126−2×6=114cm²，不是120；虽同一接触位置，原和含两张面身份。分开后无接触，外露126，体积仍72；相似整体长倍2后体积576cm³，外露456cm²，接触24cm²，面积乘4体积乘8。'
          : '体积36+12=48cm³，分别表面积大2(18+12+6)=72cm²、小2(6+6+4)=32cm²，和104cm²。外露104−6−6=92cm²；贴合处既藏大顶的一片也藏小底的一片，不能只扣一次。分开后外露104、体积48；所有长度倍2且贴合关系保持时体积384cm³、外露368cm²、接触24cm²，面积倍率4、体积8。',
        first
          ? 'Volume is60+12=72cm³. Separate surfaces are94 and32cm²,total126. The large top loses six exposed units and the small bottom loses six more: exposed area126−12=114cm²,not120. One contact location has two originally counted face identities. A gap removes contact,restoring126cm² without changing volume72. Doubling all lengths with the same arrangement gives volume576cm³,exposed area456cm² and contact24cm²: cubic versus square scaling.'
          : 'Volume is36+12=48cm³. Separate surfaces72+32 total104cm²; exposed area104−6−6=92cm². The contact hides one patch on each block,so subtract twice. A gap restores104cm² while volume stays48. Doubling all lengths and retaining the arrangement gives volume384cm³,exposed area368cm² and contact24cm²: area scales by four,volume by eight.',
        '先分别数每块的面，再给两张被遮面各作标记；体积不因贴合而重复扣掉。',
        'Count each block’s faces first,then mark both hidden patches. Contact does not require subtracting overlapping volume when interiors are disjoint.',
      ),
    ],
  };
};
export const spatialStructureRetrieval = {
  H23_SOLID: makeSet('H23'),
  H36_SOLID: makeSet('H36'),
};
