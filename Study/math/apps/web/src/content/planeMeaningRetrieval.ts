import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J93' | 'J94') => {
  const near = unit === 'J93',
    id = (n: number) => `${unit}-MAINT-PLANE-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次一个编号分问或一个独立案例，可分次、不计时。画自己的图并标已知、对象与理由，再逐项人审；允许口述/熟悉语言，读题协助与数学提示分开。',
        'One numbered part or independent case per untimed sitting. Draw and label your own givens, objects and reasons before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '各行是独立原条件；先画位置与关系，不把不同案例拼成一张图。',
        'Rows give independent original conditions. Construct positions and relationships without combining separate cases into one diagram.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const p = near ? 22.5 : 32.5,
    q = near ? 37.5 : 47.5,
    whole = p + q,
    outside = near ? 90 : 120;
  const q1 = card(
    1,
    'geometric-objects-and-angle',
    '① 按I画两条原射线及内部OC，标共同顶点、每个已知小角，求∠AOB并说明为什么能相加；角名倒写∠BOA时顶点与指定角是否改变？② O是另一个独立案例：按给定射线次序画外部OD，求∠BOD。为什么不能把∠AOD与∠BOD相加当原∠AOB？指出重叠或整角与部分的关系，给一个数值反查。③ 独立画0°、30°、90°、120°、180°，分别命名，写锐/钝角的严格范围；把直角整体旋转后还是什么角？工作台只显示10°–170°，是否表示0°或180°不存在？改变画出的臂长能替代转角变化吗？',
    '① From I draw the original rays and interior OC, marking the common vertex and given parts. Find AOB and justify addition. Does reversing the name to BOA change the vertex or this specified angle? ② O is a SEPARATE case: draw outside OD in the stated order and find BOD. Why is AOD+BOD not the original AOB? Identify whole/part or overlapping regions and give a numerical check. ③ Independently draw and name 0°,30°,90°,120°,180°, stating strict acute/obtuse ranges. Rotate the right angle: what is it now? Does the activity display range 10°–170° imply zero/straight angles do not exist? Does extending drawn arms change the turn?',
    `I内部不重叠相邻部分相加${p}+${q}=${whole}°，O为共同顶点，AOB/BOA命名此指定角相同。独立O中OB在∠AOD内部，BOD=${outside}−${whole}=${outside - whole}°；AOD已含AOB及BOD，不能再加BOD当AOB，误加得${2 * outside - whole}°而原${whole}°。0为零角，30锐、90直、120钝、180平；锐0<θ<90，钝90<θ<180，边界另分。旋转直角仍90，臂同向延长只改画法；活动显示界不是数学存在界。须亲画位置，不能只复述和或差。`,
    `I partitions the angle into adjacent non-overlapping parts: ${p}+${q}=${whole}°. O is the vertex; AOB/BOA name the same specified angle. In SEPARATE case O, OB lies inside AOD, so BOD=${outside}−${whole}=${outside - whole}°. AOD already includes AOB and BOD; adding BOD again gives ${2 * outside - whole}°, not original ${whole}°. Zero is a zero angle; thirty acute, ninety right, 120 obtuse and 180 straight. Acute means 0<θ<90 and obtuse 90<θ<180, excluding their boundaries. Rotation preserves a right angle; extending arms preserves the turn. Display limits are not mathematical existence limits. Check the actual labelled diagram rather than quoting a sum/difference alone.`,
    '先标哪条射线在原角内部，再判断是两个不重叠部分相加，还是从整角扣一个部分。',
    'Locate the inside ray before deciding between adding non-overlapping parts and subtracting one part from a whole angle.',
  );
  table(q1, [
    [
      'I',
      '内部射线案例',
      'Interior-ray case',
      `OC在∠AOB内部；AOC=${p}°，COB=${q}°`,
      `OC is inside AOB; AOC=${p}°, COB=${q}°`,
    ],
    [
      'O',
      '独立外部射线案例',
      'Separate outside-ray case',
      `AOB=${whole}°；OD在该角外，OB在∠AOD内部；AOD=${outside}°`,
      `AOB=${whole}°; OD is outside that angle and OB is inside AOD; AOD=${outside}°`,
    ],
  ]);
  const v1 = near ? '4x+7.5' : '3x+12.5',
    v2 = near ? '2x+52.5' : 'x+67.5',
    x = near ? 22.5 : 27.5,
    angle = near ? 97.5 : 95,
    apex = near ? 37.5 : 52.5,
    acute = near ? 32.5 : 47.5,
    exterior = near ? 120.5 : 137.5,
    remote = near ? 48.5 : 68.25;
  const q2 = card(
    2,
    'vertical-and-adjacent-angles',
    '各案例独立。① V来自同两条相交直线的对顶位置，先按位置列方程，求x、这两个实际角及其余两角，核四角总和。x是否就是角度？四角总和360°能否单独证明任意指定两角相等？另画两垂直交线，找一对相等但不是对顶的同交点角，解释“邻补也可相等”。② I是等腰顶角，求每个底角，写为什么把剩余角和分成两等份；R是独立直角三角形，求第三角，不能把两案例混合。逐个检查三个内角正且和180°。③ E由一边延长形成，邻内角与它邻补；分别求另一个不相邻内角及邻接内角，圈清不同未知对象。给出内角和/平角两式及来源，不只写一个数字。',
    'Cases are independent. ① V is a vertically opposite pair from the SAME intersecting lines. Set up its equation from positions; find x, the actual pair and remaining two angles, then check the total. Is x itself the angle measure? Does total 360° alone prove an arbitrary selected pair equal? Separately draw perpendicular lines and identify equal NON-vertical angles at that same vertex: why can adjacent supplementary angles be equal? ② I gives an isosceles vertex angle: find EACH base angle and justify sharing the remainder equally. R is a SEPARATE right triangle: find its third angle. Check positive interiors and sum 180° in each. ③ E is formed by extending a side and is supplementary to its adjacent interior. Find the OTHER remote interior and the ADJACENT interior separately, marking the different targets. State the interior-sum/straight-angle equations and their reasons.',
    `V列${v1}=${v2}得x=${x}，原两个角${angle}°、另外两角${180 - angle}°，合360；x不是角值。360单一和式不指定对顶结构；结构来自两对反向射线。独立垂直时四角90，相邻两角相等且邻补但不对顶。I两等底角和180−${apex}，各${(180 - apex) / 2}°；R第三180−90−${acute}=${90 - acute}°。各内部角均正且和180。E另一远内=${exterior}−${remote}=${exterior - remote}°；邻内=180−${exterior}=${180 - exterior}°，它们不是同一对象。外角+邻内=180来自反向射线，三内角和180来自平面非退化三角形定理，比较相减得外角=两远内角和。`,
    `V: ${v1}=${v2} gives x=${x}, actual opposite angles ${angle}° each and remaining angles ${180 - angle}° each, totalling 360°. The parameter is not the angle. A total alone does not specify vertical structure, which comes from opposite arms. Perpendicular lines instead give four 90° angles; adjacent pairs are equal and supplementary without being vertical. I has equal bases ${(180 - apex) / 2}° each, sharing 180−${apex}; R has third angle 180−90−${acute}=${90 - acute}°. All interiors are positive and total 180 in their own triangle. For E, other remote=${exterior}−${remote}=${exterior - remote}°, while adjacent=180−${exterior}=${180 - exterior}°, different objects. Exterior+adjacent=180 follows from opposite rays, and the interior sum from the nondegenerate Euclidean triangle theorem. Comparing these yields exterior=sum of the two remote interiors.`,
    '先辨角的位置和题目所求，再列完整关系。参数x、实际角度、另远内角和邻内角分别标记。',
    'Identify positions and the requested object before forming a full relationship. Label x, actual measures, the other remote interior and the adjacent interior separately.',
  );
  table(q2, [
    [
      'V',
      '对顶角原表达式',
      'Original vertical-angle expressions',
      `(${v1})°，(${v2})°`,
    ],
    [
      'I',
      '独立等腰三角形',
      'Separate isosceles triangle',
      `顶角${apex}°`,
      `Vertex angle ${apex}°`,
    ],
    [
      'R',
      '独立直角三角形',
      'Separate right triangle',
      `一直角，另一内角${acute}°`,
      `One right angle; another interior ${acute}°`,
    ],
    [
      'E',
      '独立外角与远内角',
      'Separate exterior and remote interior',
      `外角${exterior}°；一个不相邻内角${remote}°`,
      `Exterior ${exterior}°; one non-adjacent interior ${remote}°`,
    ],
  ]);
  const a = near ? 4 : 5,
    b = near ? 7 : 9,
    lower = b - a,
    upper = a + b,
    bad = near ? [2, 2, 5] : [3, 3, 7],
    loose = lower + 0.5;
  const q3 = card(
    3,
    'triangle-class-and-existence',
    `① 按S从三条严格边不等式推第三边的完整实数范围，解释每个端点为何退化；第三边限正整数时列全部可选值、最小和最大，不把端点算入。若允许连续正长度，c=${loose}cm可行吗？整数滑块是否定义全部数学边长？② 独立B虽有两条等长，也先判断存在再分类；画统一比例长度条说明失败，不画假三角形套内角和。③ 自己构造等腰锐角、等腰直角、等腰钝角各一组内角，逐组核正性、180°与等底角，分别给边/角分类；再用等边解释“最具体名称”与“属于更宽等腰类”怎样同时成立。所有图以标出的条件作依据，不凭屏幕像素。`,
    `① From S derive the complete REAL third-side range using all strict triangle inequalities, explaining degeneration at EACH endpoint. For a positive INTEGER third side list EVERY option, minimum and maximum, excluding endpoints. If continuous positive lengths are allowed, is c=${loose} cm valid? Do integer sliders define all mathematical lengths? ② Separate B has two equal lengths: test existence BEFORE classifying. Draw proportional length bars to explain failure, rather than inventing a triangle and applying its angle sum. ③ Construct interior-angle sets for an isosceles ACUTE, RIGHT and OBTUSE triangle. Check positivity, total 180° and equal bases for each, and give both side/angle classifications. Explain how the most specific equilateral name coexists with membership in the broader isosceles class. Use stated conditions rather than pixels.`,
    `S三边正，严格${lower}<c<${upper}cm；下端${a}+${lower}=${b}，上端${a}+${b}=${upper}，均共线退化。整数全列${Array.from({ length: upper - lower - 1 }, (_, i) => lower + 1 + i).join('、')}，最小${lower + 1}最大${upper - 1}；实数${loose}在区间可行，整数UI不限制数学连续长度。B为${bad.join('、')}，两短和${bad[0]! + bad[1]!}<${bad[2]}，不成三角形，不能称等腰或按角贴名。三组可取${near ? '（70°、70°、40°）、（45°、45°、90°）、（25°、25°、130°）' : '（65°、65°、50°）、（45°、45°、90°）、（35°、35°、110°）'}，分别正、和180、两等底角且最大角锐/直/钝。接受其他满足条件的三组。等边三边全等仍至少两边相等，最具体等边不否认广义等腰。边类与角类可同时成立，存在性先核。`,
    `S permits ${lower}<c<${upper} cm. At the lower endpoint ${a}+${lower}=${b}; at the upper ${a}+${b}=${upper}. Both are degenerate. All integer choices are ${Array.from({ length: upper - lower - 1 }, (_, i) => lower + 1 + i).join(', ')}, minimum ${lower + 1}, maximum ${upper - 1}. Real ${loose} lies inside and is valid; integer controls do not restrict continuous mathematical lengths. B has lengths ${bad.join(', ')} with shorter sum ${bad[0]! + bad[1]!}<${bad[2]}, so no triangle exists and no side/angle triangle class applies. Example angle TRIPLES are ${near ? '(70°,70°,40°), (45°,45°,90°), (25°,25°,130°)' : '(65°,65°,50°), (45°,45°,90°), (35°,35°,110°)'}. Each is positive, totals 180 and has equal base angles, with an acute/right/obtuse maximum respectively; other valid constructed triples are welcome. Equilateral has three equal sides, hence at least two, so the most specific name retains inclusive isosceles membership. Side and angle classes coexist after existence has been checked.`,
    '先判三边能否围成非退化图形，再按实数或整数域列范围；按边与按最大角回答不同问题。',
    'Check nondegenerate existence before a real/integer range. Classification by sides and by the largest angle answers different questions.',
  );
  table(q3, [
    [
      'S',
      '固定两边',
      'Fixed two sides',
      `${a}cm、${b}cm；第三边c待定`,
      `${a} cm, ${b} cm; third side c unknown`,
    ],
    [
      'B',
      '独立三根长度条',
      'Separate three length bars',
      bad.map((n) => `${n}cm`).join('、'),
      bad.map((n) => `${n} cm`).join(', '),
    ],
  ]);
  return {
    id: `${unit}-MAINT-PLANE-MEANING`,
    unit,
    bridge: 'J74-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 5].map((l, i) => [id(i + 1), `J74-L0${l}`]),
    ),
    title: t(
      '角的位置、实际角值与三角形允许范围',
      'Angle positions, actual measures and admissible triangles',
    ),
    intro: t(
      '三张独立纸笔卡，每次一个编号或一个案例，可分多次、不计时。第2卡共享相交角与三角形计算，原九题的对象/平行/证明任务继续保留；新卡独立记录。先画图、标条件及自己的解释，再人审；允许口述与熟悉语言，读题协助和数学提示分开。虚构纸上几何，无需实测或购买。',
      'Three independent paper cards, one part or case per untimed sitting. Card two shares crossing-angle and triangle calculations; the original nine tasks remain. New cards keep separate records. Draw, label givens and explain before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Fictional paper geometry needs no measurement or purchase.',
    ),
    questions: [q1, q2, q3],
  };
};
export const planeMeaningRetrieval = {
  J93_PLANE_MEANING: makeSet('J93'),
  J94_PLANE_MEANING: makeSet('J94'),
};
