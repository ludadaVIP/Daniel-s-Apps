import { t, type Question, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H37' | 'H38') => {
  const first = unit === 'H37',
    id = (i: number) => `${unit}-MAINT-ANALYTIC-GEOMETRY-Q${i}`;
  const r = first ? 10 : 5,
    cy = first ? 6 : 4;
  const intersectionPlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: first ? -20 : -10,
      xMax: first ? 20 : 10,
      yMin: first ? -14 : -7,
      yMax: first ? 14 : 7,
      xStep: first ? 5 : 2,
      yStep: first ? 2 : 1,
    },
    points: [],
    curves: [
      {
        name: 'given circle',
        color: '#5850a1',
        points: Array.from({ length: 81 }, (_, i) => ({
          x: r * Math.cos((2 * Math.PI * i) / 80),
          y: r * Math.sin((2 * Math.PI * i) / 80),
        })),
      },
      {
        name: 'given secant line, not marked intersections',
        color: '#a14532',
        points: [
          { x: first ? -20 : -10, y: cy },
          { x: first ? 20 : 10, y: cy },
        ],
      },
    ],
    xLabel: 'x',
    yLabel: 'y',
    caption: t(
      `仅画第一模型的给定圆x²+y²=${r * r}与直线y=${cy}的有限窗口，交点未标出。两轴每单位等长；圆线是近似采样，须从原参数和方程求全部精确点。其余抛物线/双曲线是独立模型，不在本图。`,
      `Only the first model’s GIVEN circle x²+y²=${r * r} and line y=${cy} are shown in a finite window; intersections are unmarked. Axes have equal unit lengths. The circle is sampled approximately; derive ALL exact points from the original parameter/equations. The later parabola/hyperbola examples are SEPARATE models, not in this plot.`,
    ),
  };
  const h = first ? 1 : -2,
    k = first ? -2 : 1,
    a = first ? 5 : 4;
  const A = { x: h - a, y: k, label: 'A' },
    B = { x: h + a, y: k, label: 'B' },
    C = { x: h, y: k, label: 'C' },
    inside = { x: h, y: k + 2, label: 'P' };
  const diameterPlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: first ? -8 : -12,
      xMax: first ? 12 : 8,
      yMin: first ? -9 : -6,
      yMax: first ? 5 : 8,
      xStep: 2,
      yStep: 1,
    },
    points: [A, B, C, inside],
    curves: [
      {
        name: 'given segment AB, not the locus',
        color: '#a14532',
        points: [A, B],
      },
    ],
    xLabel: 'x',
    yLabel: 'y',
    caption: t(
      `给定A(${A.x},${A.y})、B(${B.x},${B.y})、中点C(${h},${k})及检验点P(${inside.x},${inside.y})。图只画给定AB线段，不画所求直角轨迹。两轴单位等长；角度分类必须先查零向量及共线，不能只读外观。`,
      `Given A(${A.x},${A.y}), B(${B.x},${B.y}), midpoint C(${h},${k}) and probe P(${inside.x},${inside.y}). Only the GIVEN AB segment is drawn, not the requested right-angle locus. Axes have equal unit lengths; check zero vectors and collinearity before classifying angles rather than reading appearances.`,
    ),
  };
  const roofA = first ? 10 : 8,
    roofB = first ? 5 : 4;
  const roofPlot: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: first ? -15 : -10,
      xMax: first ? 15 : 10,
      yMin: first ? -9 : -6,
      yMax: first ? 12 : 8,
      xStep: first ? 5 : 2,
      yStep: first ? 3 : 2,
    },
    points: [{ x: 0, y: roofB, label: 'R' }],
    curves: [
      {
        name: 'given UPPER roof only',
        color: '#5850a1',
        points: Array.from({ length: 81 }, (_, i) => {
          const x = -roofA + (2 * roofA * i) / 80;
          return {
            x,
            y: roofB * Math.sqrt(Math.max(0, 1 - (x * x) / (roofA * roofA))),
          };
        }),
      },
      {
        name: 'ground y=0',
        color: '#99929f',
        points: [
          { x: -roofA, y: 0 },
          { x: roofA, y: 0 },
        ],
      },
    ],
    xLabel: 'x (m)',
    yLabel: 'height y (m)',
    caption: t(
      `虚构零厚度上半截面x²/${roofA * roofA}+y²/${roofB * roofB}=1，y≥0；原点地面对称中心，地面y=0，R(0,${roofB})米。两轴单位等长，图窗不是原域；没有画所求净高线或通道。下半椭圆不是屋顶，尺寸均从精确方程计算，不量像素。`,
      `Fictional zero-thickness UPPER section x²/${roofA * roofA}+y²/${roofB * roofB}=1, y≥0. The origin is the ground-level symmetry centre, ground y=0, R(0,${roofB}) metres. Axes have equal units; the window is not the domain. Requested clearance lines/passages are not drawn. The lower ellipse is not roof; compute dimensions from the exact equation, not pixels.`,
    ),
  };
  const questions: Question[] = [
    reasoning(
      id(1),
      t(
        `图的第一模型为x²+y²=${r * r}，全直线(x, y)=(0,${cy})+t(${first ? '2' : '−1'},0)，t∈R；求全部t及全部交点，代回两式，解释为何不能只交x根。另将直线改为(x, y)=(${r},0)+t(0,2)；与首例比较Δ、重根与相切。再分别审查抛物线y=x²配竖线x=${first ? '3' : '−2'}、双曲线x²−y²=1配y=${first ? 'x' : '−x'}，代入后次数与完整交点怎样？方向向量0能当整条直线吗，唯一交点一定相切吗？`,
        `First use the pictured circle x²+y²=${r * r} and FULL line (x, y)=(0,${cy})+t(${first ? '2' : '−1'},0), t∈R. Find ALL parameters and coordinate intersections, substitute into BOTH equations and explain why x roots alone are incomplete. Then use (x, y)=(${r},0)+t(0,2), comparing discriminants, repeated roots and tangency. Separately audit y=x² with vertical x=${first ? '3' : '−2'}, and x²−y²=1 with y=${first ? 'x' : '−x'}. What degrees and COMPLETE point sets result? Can zero direction represent a whole line, and does one point always mean tangency?`,
      ),
      'analytic-geometry-1',
      t(
        `${first ? '首例4t²−64=0，t=±4，交点{(−8,6),(8,6)}，两点平方和100且同在y=6；Δ=1024>0。改竖切线x=10有4t²=0，唯一t=0给(10,0)，A=4、Δ=0且圆非退化，确相切。抛物线竖线x=3代入得y9，唯一(3,9)，关于直线参数是一次而非二次，竖线并非切线（该点切线斜率6）。' : '首例t²−9=0，t=±3，x=−t，交点{(−3,4),(3,4)}，两点平方和25且同在y=4；Δ=36>0。改竖切线x=5有4t²=0，唯一t=0给(5,0)，A=4、Δ=0且圆非退化，确相切。抛物线竖线x=−2代入得y4，唯一(−2,4)，关于直线参数是一次而非二次，竖线并非切线（该点切线斜率−4）。'} 双曲线配所给渐近方向直线代入恒0=1，为常数矛盾，无有限交点，不能套二次Δ。一般P₀+td只有d≠0才覆盖整条直线；d0只编码一点。先查At²+Bt+C的实际次数，A非零才用Δ；本圆重根为切点，但任意“一点”不足以认证相切。解尽所有参数再还原(x, y)，原式回代加参数覆盖性与代入等价保证点集完备；有限采样图不作完备性证据。`,
        `${first ? 'First:4t²−64=0 gives t=±4 and points{(−8,6),(8,6)}; both satisfy square sum 100 and y=6. Δ=1024>0. The vertical tangent x=10 gives 4t²=0, t=0 and(10,0); A=4,Δ=0 on a nondegenerate circle certify tangency. Vertical x=3 in the parabola gives y9, point(3,9), a LINEAR parameter equation rather than quadratic; the vertical line is not tangent because the tangent slope is six.' : 'First:t²−9=0 gives t=±3, x=−t and points{(−3,4),(3,4)}; both satisfy square sum 25 and y=4. Δ=36>0. The vertical tangent x=5 gives 4t²=0, t=0 and(5,0); A=4,Δ=0 on a nondegenerate circle certify tangency. Vertical x=−2 in the parabola gives y4, point(−2,4), a LINEAR parameter equation rather than quadratic; the tangent slope is −4, so the vertical is not tangent.'} The supplied asymptote-direction line in the hyperbola yields 0=1, a constant contradiction with NO finite points, not a quadratic discriminant case. P₀+td covers a full line only for d≠0; zero direction encodes just a point. Check the actual degree of At²+Bt+C before using Δ. Repetition gives tangency for this nondegenerate circle, but an arbitrary singleton does not. Solve every parameter, restore full ordered points and check originals; equivalent substitution plus full-line coverage proves completeness. A finite sampled plot cannot do so.`,
      ),
      [
        t(
          '写出完整直线参数后代入，先看最高次系数是否真非零。',
          'Substitute a complete line parameterisation, then check the actual leading coefficient.',
        ),
        t(
          't根不是交点；还原两坐标并分别回圆锥曲线和直线。',
          'A parameter root is not a coordinate point; restore BOTH coordinates and check the line and conic.',
        ),
      ],
    ),
    reasoning(
      id(2),
      t(
        first
          ? '固定A=(4,2)，P=(u, v)沿u²+v²=36、v≥0运动，但排除P=(6,0)。M=(x, y)为AP中点。推完整M轨迹：必要方程、半平面及排除点，再从任一候选M反构唯一P证明充分。审查M=(5,1)、(−1,1)、(2,4)、(2,−2)；哪些满足圆却不实际可达？只写圆方程是否足够？'
          : '固定A=(−2,4)，P=(u, v)沿u²+v²=16、v≤0运动，但排除P=(−4,0)。M=(x, y)为AP中点。推完整M轨迹：必要方程、半平面及排除点，再从任一候选M反构唯一P证明充分。审查M=(−3,2)、(1,2)、(−1,0)、(−1,4)；哪些满足圆却不实际可达？只写圆方程是否足够？',
        first
          ? 'Fix A=(4,2). P=(u, v) moves on u²+v²=36, v≥0, EXCLUDING P=(6,0). Its midpoint with A is M=(x, y). Derive the COMPLETE locus:necessary equation, half-plane and missing point, then reconstruct the UNIQUE P from every admitted candidate to prove sufficiency. Audit M=(5,1),(−1,1),(2,4),(2,−2). Which satisfy the circle but are unreachable? Is the circle equation alone enough?'
          : 'Fix A=(−2,4). P=(u, v) moves on u²+v²=16, v≤0, EXCLUDING P=(−4,0). Its midpoint with A is M=(x, y). Derive the COMPLETE locus:necessary equation, half-plane and missing point, then reconstruct the UNIQUE P from every admitted candidate to prove sufficiency. Audit M=(−3,2),(1,2),(−1,0),(−1,4). Which satisfy the circle but are unreachable? Is the circle equation alone enough?',
      ),
      'analytic-geometry-2',
      t(
        `${first ? 'u=2x−4，v=2y−2，代回得(x−2)²+(y−1)²=9，另y≥1并排M=(5,1)。反构同式保证P在原圆、v≥0且非(6,0)，AP中点确为M。四候选依次反构(6,0)被排、(−6,0)合法、(0,6)合法、(0,−6)违反上半限制。' : 'u=2x+2，v=2y−4，得(x+1)²+(y−2)²=4，另y≤2并排M=(−3,2)。反构保证原圆、v≤0且非(−4,0)，AP中点确为M。四候选依次反构(−4,0)被排、(4,0)合法、(0,−4)合法、(0,4)违反下半限制。'} 必要性只说明运动生成点都满足方程；充分性须让每个保留候选都能从原运动生成。中点关系可唯一反解，所以删去的源点恰对应一个删去的中点，不能借另一个P填补。方程、半平面、孔与双向可达性共同描述轨迹，闭端点除明确删去者外仍保留。`,
        `${first ? 'Reconstruct u=2x−4, v=2y−2. Substitution gives(x−2)²+(y−1)²=9, WITH y≥1 and M=(5,1) excluded. The same inverse guarantees original-circle membership, v≥0, not(6,0), and midpoint M. The four candidates reconstruct respectively(6,0):excluded;(−6,0):allowed;(0,6):allowed;(0,−6):wrong half-plane.' : 'Reconstruct u=2x+2, v=2y−4. Substitution gives(x+1)²+(y−2)²=4, WITH y≤2 and M=(−3,2) excluded. The same inverse guarantees original-circle membership, v≤0, not(−4,0), and midpoint M. Candidates reconstruct respectively(−4,0):excluded;(4,0):allowed;(0,−4):allowed;(0,4):wrong half-plane.'} Necessity puts every generated midpoint on the equation; sufficiency must generate EVERY retained candidate from the original motion. The midpoint inverse is unique, so the omitted source point removes exactly its midpoint and no other source can fill it. Equation, half-plane, hole and two-way reachability together describe the locus. Other closed endpoints remain included.`,
      ),
      [
        t(
          '中点式先反解u、v，再代原圆；运动限制也要换成x、y。',
          'Invert the midpoint equations for u, v, then substitute the original circle AND motion restrictions.',
        ),
        t(
          '每个候选只对应一个P，反构后逐项查半平面和删点。',
          'Each candidate has only one source P; check its half-plane and omitted-point condition.',
        ),
      ],
    ),
    reasoning(
      id(3),
      t(
        `给r=${first ? 6 : 4}，x=r(1−t²)/(1+t²)、y=2rt/(1+t²)，t先取所有有限实数。用恒等式证明圆归属，给完整像集、漏点与从一般圆点反解t的充分证明，为什么t→∞不能当一个有限t？算t=0,1,2三点和相邻弦长，能当等时间匀速吗？再限制t∈${first ? '[−1,1]' : '[1,∞)但t仍有限'}，给完整圆弧及端点包含性，用反解证明无漏/多点。若另把t规定为时间数值，导数模怎样变化？`,
        `For r=${first ? 6 : 4}, use x=r(1−t²)/(1+t²), y=2rt/(1+t²), initially for ALL FINITE real t. Prove circle membership by identity, identify the complete image/omitted point and reconstruct t from a general admitted circle point to prove sufficiency. Why is t→∞ not a finite parameter value? Calculate t=0,1,2 points and adjacent chord lengths:does the parameter imply equal-time uniform motion? Now restrict t to ${first ? '[−1,1]' : '[1,∞), still finite'}; give the FULL arc and endpoint inclusions, using the inverse to exclude missing/excess points. If t is separately declared a time coordinate, how does the derivative magnitude vary?`,
      ),
      'analytic-geometry-3',
      t(
        `${first ? '三点(6,0)、(0,6)、(−18/5,24/5)，弦长6√2、6√10/5，不相等。限[−1,1]恰为右闭半圆x≥0，端点(0,−6)/(0,6)都含。' : '三点(4,0)、(0,4)、(−12/5,16/5)，弦长4√2、4√10/5，不相等。限有限t≥1恰为左上弧x≤0, y>0，含(0,4)而不含(−4,0)。'} (1−t²)²+4t²=(1+t²)²且分母恒正，故x²+y²=r²。E=(−r,0)若由有限t产生会得1=−1，不可能；全圆要另补E。任意非E圆点x+r>0，取t=y/(x+r)，用y²=(r−x)(r+x)回代恢复x、y，给完整像为圆去E。限|t|≤1等价x≥0；限t≥1等价x≤0且y>0，反解t²=(r−x)/(r+x)≥1、t>0证明后一充分性。无限极限接近E不把E纳入有限参数像。两段是小于半圆的短弧，弦长随弧角严格增加，故这些等参数步长也不等弧长。t只是编码；若另声明为时间数值，x′=−4rt/(1+t²)²，y′=2r(1−t²)/(1+t²)²，模2r/(1+t²)非常数。原数学参数不自带真实时间或匀速含义。`,
        `${first ? 'Points(6,0),(0,6),(−18/5,24/5) have successive chord lengths 6√2 and 6√10/5, unequal. Restricting to[−1,1] gives exactly the RIGHT closed semicircle x≥0, including(0,−6),(0,6).' : 'Points(4,0),(0,4),(−12/5,16/5) have chords 4√2 and 4√10/5, unequal. Finite t≥1 gives exactly the upper-left arc x≤0, y>0, including(0,4) but excluding(−4,0).'} The identity(1−t²)²+4t²=(1+t²)² and positive denominator give x²+y²=r². A finite parameter producing E=(−r,0) would force 1=−1, impossible; add E separately for the whole circle. For any other circle point, x+r>0; set t=y/(x+r). With y²=(r−x)(r+x), substitution recovers BOTH coordinates. Thus the full image is the circle minus E. |t|≤1 is equivalent to x≥0. For t≥1, the image is x≤0, y>0; conversely t²=(r−x)/(r+x)≥1 and positive t prove sufficiency there. A limit approaching E does not include it among finite-parameter values. These adjacent short arcs are less than a semicircle and chord length strictly increases with arc angle, so unequal chords also give unequal arcs. t is an encoding; if separately declared time, x′=−4rt/(1+t²)², y′=2r(1−t²)/(1+t²)² have magnitude 2r/(1+t²), not constant. The original mathematical parameter supplies no real time or uniform-motion assumption.`,
      ),
      [
        t(
          '先通分平方和；再考察x+r的符号和是否为0。',
          'Combine the squared coordinates, then inspect the sign/zero of x+r.',
        ),
        t(
          '反解t可证明覆盖范围；弦长须从真实两点坐标算，不能只看Δt。',
          'Use inverse t to prove coverage; compute chords from actual coordinate differences, not Δt alone.',
        ),
      ],
    ),
    reasoning(
      id(4),
      t(
        `给定图中A/B/C/P，求所有使∠AMB为直角的M轨迹，用点积展开与直径圆周角分别作必要/充分证明。A/B明明满足所得圆方程，为何仍不在轨迹？亲算P点、C点及Q=(${h},${first ? 4 : 6})、T=(${first ? 7 : 3},${k})的两向量、点积、共线性和角类别。圆内都只能叫一般钝角、圆外都只能叫一般锐角吗？`,
        `From the GIVEN A/B/C/P, find every M with a right angle AMB, proving necessity AND sufficiency by dot expansion and by the diameter-angle theorem. Why are A/B excluded even though they satisfy the resulting circle equation? For P, C, Q=(${h},${first ? 4 : 6}) and T=(${first ? 7 : 3},${k}), compute the two vectors, dot product, collinearity and angle class. Are all inside points ordinary obtuse angles and all outside points ordinary acute angles?`,
      ),
      'analytic-geometry-4',
      t(
        `${first ? 'A(−4,−2)、B(6,−2)，一般点积(x−1)²+(y+2)²−25；完整轨迹该式=0但排A/B。P(1,0)两向量(−5,−2)/(5,−2)，点积−21、非共线钝角；C(1,−2)点积−25且反向，180°；Q(1,4)点积11、非共线锐角；T(7,−2)两向量(−11,0)/(−1,0)，点积11、同向，0°。' : 'A(−6,1)、B(2,1)，点积(x+2)²+(y−1)²−16；完整轨迹该式=0但排A/B。P(−2,3)两向量(−4,−2)/(4,−2)，点积−12、非共线钝角；C(−2,1)点积−16且反向，180°；Q(−2,6)点积9、非共线锐角；T(3,1)两向量(−9,0)/(−1,0)，点积9、同向，0°。'} 必要性先保两向量非零，直角使点积0而在圆上；充分性是圆上除A/B令两向量非零，点积0故直角。几何上以AB作直径，圆周角定理及其逆也保端点排除。A/B各有一个零向量，点积0却角未定义。圆内负点积在非共线时为一般钝角，共线内点为平角；圆外正点积非共线才为一般锐角，同向共线为0角。不能只由点积符号忽略零向量与共线边界。`,
        `${first ? 'A(−4,−2), B(6,−2) give dot=(x−1)²+(y+2)²−25. Its zero set EXCLUDING A/B is the full locus. P(1,0) has vectors(−5,−2),(5,−2), dot −21:noncollinear obtuse. C(1,−2) has dot −25, opposite vectors:180°. Q(1,4) has dot 11, noncollinear acute. T(7,−2) has vectors(−11,0),(−1,0), dot 11:same direction,0°.' : 'A(−6,1), B(2,1) give dot=(x+2)²+(y−1)²−16. Its zero set EXCLUDING A/B is the full locus. P(−2,3) has vectors(−4,−2),(4,−2), dot −12:noncollinear obtuse. C(−2,1) has dot −16, opposite vectors:180°. Q(−2,6) has dot 9, noncollinear acute. T(3,1) has vectors(−9,0),(−1,0), dot 9:same direction,0°.'} Necessity retains two NONZERO vectors:the right angle forces dot zero and circle membership. Conversely a circle point other than A/B has nonzero vectors and zero dot, hence a right angle. The diameter-angle theorem and its converse give the geometric proof with the SAME endpoint exclusions. At A/B one vector is zero:dot zero but angle undefined. Negative dot inside means ordinary obtuse ONLY when noncollinear; collinear interior points are straight angles. Positive dot outside means ordinary acute ONLY when noncollinear; same-direction collinear points have zero angle. Dot signs alone do not remove zero-vector/collinearity boundaries.`,
      ),
      [
        t(
          '先减去M写MA、MB，展开点积；别把零向量当垂直。',
          'Form MA and MB by subtracting M before expanding the dot; zero vectors do not define right angles.',
        ),
        t(
          '同一圆方程还要排端点；对正负点积再检查共线。',
          'Exclude endpoints from the circle equation; check collinearity as well as dot signs.',
        ),
      ],
    ),
    reasoning(
      id(5),
      t(
        `图给虚构上半椭圆屋顶，地面y=0，坐标米，H≥0为净高。求H=${first ? '3' : '12/5'}与H=${first ? '4' : '16/5'}时全部可用x、左右边界点及完整宽度，给一般公式与H=0、H=${roofB}、H>${roofB}情形。再核中心x=1、宽${first ? '12' : '48/5'}米的闭矩形通道：在这两高度分别能否全程容下？中心净高足够或总宽不超限是否就够？证明须查整个通道，区分零宽顶点与无点；说明坐标范围、上下半、厚度与实际模型局限。`,
        `Use the pictured fictional UPPER elliptical roof, ground y=0, metre coordinates and clearance H≥0. For H=${first ? '3' : '12/5'} and H=${first ? '4' : '16/5'}, find ALL feasible x values, both boundary roof points and FULL width. Give the general formula and H=0, H=${roofB}, H>${roofB} cases. Audit a CLOSED rectangular passage centred at x=1 with width ${first ? '12' : '48/5'} m at both heights:does the WHOLE passage fit? Is enough central height or total width alone sufficient? Prove the all-interval condition, distinguish a zero-width apex from no point, and report coordinate ranges, upper/lower sections, thickness and model limits.`,
      ),
      'analytic-geometry-5',
      t(
        `${first ? '屋顶x²/100+y²/25=1, y≥0；H=3得x∈[−8,8]，边界(±8,3)，完整宽16 m；H=4得[−6,6]、(±6,4)、宽12 m。通道中心1宽12的x段[−5,7]，低H=3全含，高H=4因右端7>6失败；右端屋顶高√51/2<4，中心虽足够也不能保全段。' : '屋顶x²/64+y²/16=1, y≥0；H=12/5得x∈[−32/5,32/5]，边界(±32/5,12/5)，宽64/5 m；H=16/5得[−24/5,24/5]、(±24/5,16/5)、宽48/5 m。中心1宽48/5通道x段[−19/5,29/5]，低H=12/5全含，高H=16/5因右端29/5>24/5失败；右端屋顶高√759/10<16/5，中心足够仍不保全段。'} 一般半轴a, b>0，0≤H≤b给|x|≤a√(1−H²/b²)，完整宽2a√(1−H²/b²)；H=0全底宽2a，H=b仅(0, b)、宽0（合法点不等于正宽通道），H>b空集。闭通道[c−w/2, c+w/2]可行当且仅当它整个含于此可行x闭区间；因区间与|x|结构，查最远|x|端点即可证明全部点，不是抽样几个位置。两给定中心通道宽等于高净高的总可用宽，却因偏心失败。原域|x|≤a，y为上支；图窗不是原域，下半不属屋顶。精确截面、水平地面、零厚度是数学假设，几何容下不验证荷载、材料或施工。`,
        `${first ? 'Roof x²/100+y²/25=1, y≥0. H=3 gives x∈[−8,8], boundary(±8,3), full width 16 m. H=4 gives[−6,6], boundary(±6,4), width 12 m. The centre-one, width-twelve passage spans[−5,7]:it fits wholly at H=3, but fails at H=4 because 7>6. Roof height at its right end is√51/2<4; central height does not guarantee full-span clearance.' : 'Roof x²/64+y²/16=1, y≥0. H=12/5 gives x∈[−32/5,32/5], boundary(±32/5,12/5), full width 64/5 m. H=16/5 gives[−24/5,24/5], boundary(±24/5,16/5), width 48/5 m. The centre-one, width 48/5 passage spans[−19/5,29/5]:it fits at the lower height, but fails at the higher because 29/5>24/5. Its right-end roof height is√759/10<16/5; central height does not guarantee the full span.'} For semiaxes a, b>0 and 0≤H≤b, feasibility is|x|≤a√(1−H²/b²), FULL width 2a√(1−H²/b²). H=0 gives the full 2a base; H=b gives ONLY(0, b), width zero:a legitimate point, not a positive-width passage. H>b is empty. A closed passage[c−w/2, c+w/2] fits IFF its ENTIRE interval lies in the feasible closed x interval. Its interval/absolute-value structure makes the furthest-|x| endpoint decisive for ALL points, not merely sampled positions. Both off-centre passages have width equal to the high-clearance total width yet fail after shifting. Original domain|x|≤a uses the upper branch; the plot window is not the domain, and the lower ellipse is not roof. Exact section, level ground and zero thickness are assumptions. Geometric fit verifies neither loads, materials nor construction.`,
      ),
      [
        t(
          '把屋顶高度≥H变成x的完整闭区间，半宽要乘2才是总宽。',
          'Turn roof height≥H into a COMPLETE closed x interval; double the half-width.',
        ),
        t(
          '通道是带位置的区间，先求两个端点，再查是否整个包含。',
          'A passage has a POSITION as well as width; find both endpoints and check whole-interval containment.',
        ),
      ],
    ),
  ];
  questions[0]!.diagram = intersectionPlot;
  questions[3]!.diagram = diameterPlot;
  questions[4]!.diagram = roofPlot;
  return {
    id: `${unit}-MAINT-ANALYTIC-GEOMETRY`,
    unit,
    title: t(
      '参数与项目之后，再证明点集完整',
      'After parameters and projects, prove complete point sets again',
    ),
    bridge: 'H36-L01',
    bridgeByQuestion: Object.fromEntries(
      questions.map((q, i) => [q.id, `H36-L0${i + 1}`]),
    ),
    intro: t(
      '五题各含独立模型，可分小问分次。先纸上列原条件、全部参数或反构点，再解释双向可达性。整题全部部分核完才确认；图仅给原始模型，不提供所求轨迹或净高答案，虚构截面不当真实测量。',
      'Split the five tasks into independent models/subparts across sittings. On paper, list original conditions, all parameters or reconstructed points before explaining two-way reachability. Confirm only after EVERY part is reviewed. Figures supply original givens, not the requested loci/clearance answers; fictional sections are not measurements.',
    ),
    questions,
  };
};
export const analyticGeometryRecurrenceRetrieval = {
  H37_ANALYTIC_GEOMETRY: makeSet('H37'),
  H38_ANALYTIC_GEOMETRY: makeSet('H38'),
};
