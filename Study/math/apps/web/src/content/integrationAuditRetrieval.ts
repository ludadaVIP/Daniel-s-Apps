import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H28' | 'H38') => {
  const first = u === 'H28',
    qid = (i: number) => `${u}-MAINT-INTEGRATION-AUDIT-Q${i}`;
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(qid(i), t(z, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '每一步对应原条件、所求对象和允许域；给反例须满足前提，数值核对还要保单位和完整性。',
        'Tie every step to original conditions, the requested quantity and domain. A counterexample must satisfy premises; numerical checks must retain units and completeness.',
      ),
    ]);
  const vertices = first
    ? [
        { x: 0, y: 12, label: 'A' },
        { x: 3, y: 6, label: 'B' },
        { x: 5, y: 6, label: 'C' },
        { x: 8, y: 0, label: 'D' },
      ]
    : [
        { x: 0, y: 20, label: 'A' },
        { x: 2, y: 12, label: 'B' },
        { x: 4, y: 12, label: 'C' },
        { x: 7, y: 0, label: 'D' },
      ];
  const graph: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: 0,
      xMax: first ? 9 : 8,
      yMin: 0,
      yMax: first ? 14 : 24,
      xStep: 1,
      yStep: first ? 2 : 4,
    },
    points: vertices,
    curves: [{ name: 'V(t)', points: vertices }],
    xLabel: 't / min',
    yLabel: 'V / L',
    caption: t(
      `完整给定分段直线规则，依次连接${vertices.map((p) => `${p.label}(${p.x},${p.y})`).join('、')}；坐标为(t min,V L)，仅定义0≤t≤${first ? 8 : 7}，各端点包含。`,
      `Complete given piecewise-linear rule through ${vertices.map((p) => `${p.label}(${p.x},${p.y})`).join(', ')} in order, with coordinates (t min,V L), defined only for 0≤t≤${first ? 8 : 7}, with included endpoints.`,
    ),
  };
  return {
    id: `${u}-MAINT-INTEGRATION-AUDIT`,
    unit: u,
    bridge: 'J98-L02',
    bridgeByQuestion: Object.fromEntries(
      ['J98-L02', 'J98-L03', 'J98-L04'].map((l, i) => [qid(i + 1), l]),
    ),
    title: t(
      '综合项目之后，再核依据与策略',
      'After integrated projects, recheck evidence and strategy',
    ),
    intro: t(
      '三题分次每次一题，先自己读图、列依赖或造反例，再写理由。图中曲线明确是给定规则，有限观察另列；所有情境虚构，全部人工核验，不计时。',
      'Choose one of three tasks per sitting. Read the graph, list dependencies or construct a counterexample before explaining. The plotted curve is explicitly a given rule; finite observations are separate. Contexts are fictional and all work is human-reviewed without a timer.',
    ),
    questions: [
      {
        ...task(
          1,
          'integration-graph-assumptions',
          `下图不是只给四个测点，而是题设在端点间完整连成的水量规则，域0≤t≤${first ? 8 : 7}min。读V(${first ? '5/2' : '3/2'})、V(${first ? 4 : 3})、V(${first ? '13/2' : '11/2'})及各段L/min变化率；空后未给规则，能外推负水量吗？另K(n)=${first ? '4n+2' : '6n+1'}张卡，只许整包n∈{${first ? '0,1,2,3,4,5' : '0,1,2,3,4'}}，半包虽算4张可买么、图可连线么？最后只观察${first ? '(0,0),(1,1)' : '(1,2),(2,4)'}且未给函数族，给两个相合而在${first ? 2 : 3}输出不同的完整规则，说明三种资料为何能支持不同延伸。`,
          `The graph is a COMPLETE given water rule connecting endpoints, not merely four measurements, with domain 0≤t≤${first ? 8 : 7} min. Read V(${first ? '5/2' : '3/2'}),V(${first ? 4 : 3}),V(${first ? '13/2' : '11/2'}) and each segment’s L/min rate. No rule is given after emptying: may negative water be extrapolated? Separately, K(n)=${first ? '4n+2' : '6n+1'} cards permits whole packs n∈{${first ? '0,1,2,3,4,5' : '0,1,2,3,4'}}. Half a pack yields four cards; is it allowed, and may the points be joined? Finally only observations ${first ? '(0,0),(1,1)' : '(1,2),(2,4)'} are given without a function class. Give two matching complete rules with different outputs at ${first ? 'two' : 'three'}. Explain why the three kinds of information support different extensions.`,
          first
            ? '题设完整折线允许段内插值：0..3为12−2t，3..5暂停6，5..8为16−2t，所以V(5/2)=7L、V4=6L、V(13/2)=3L，率−2、0、−2L/min。共同端点两式同值，t8含0L，之后不在域，不能延伸负水或冒称已给停水后规则。K只画n0..5的离散点2,6,10,14,18,22；n1/2代数4张仍输入不允许，不能连半包。两观测可同时由f=x与g=x²符合，x2输出2与4不同，未给函数族不唯一；不从两点擅定直线。视窗或轴单位显示改变不改坐标率，图中连续连接仅因题设给定，不是见两点就可连或外推。'
            : '折线本身是完整规则：0..2为20−4t，2..4暂停12，4..7为28−4t，故V(3/2)=14L、V3=12L、V(11/2)=6L，率−4、0、−4L/min。端点一致，t7含0L；后续无给定规则，不能以画窗仍有空间而外推负水。K仅n0..4整数点1,7,13,19,25；半包代数4张不修复不允许输入，不能连接成连续购买。观测(1,2)/(2,4)可由f=2x与g=2x+(x−1)(x−2)同过，x3给6与8不唯一。坐标单位和题设域决定率与合法延伸，不依屏幕像素；有限观察不自动给线性假设，已给完整图和已给离散规则各有不同前提。',
          first
            ? 'Because the complete line is GIVEN, interpolate only within its segments: 12−2t on0..3,six on3..5,16−2t on5..8. Queries give seven,six,three L with rates −2,zero,−2 L/min. Adjacent formulas agree at endpoints and t8 includes zero L. Later inputs are outside the domain; neither negative water nor a post-stop rule was given. Cards have only n0..5 outputs2,6,10,14,18,22; a half-pack giving integer four remains inadmissible and points are not joined. The observations fit both f=x and g=x², giving two and four at input two. Without a function class, the prediction is not unique. Viewport/axis display changes do not alter coordinate rates. Connecting the water points is justified by the stated full rule, not by a general licence to connect/extrapolate any observations.'
            : 'The line is a full given rule:20−4t on0..2,twelve on2..4,28−4t on4..7. Queries give fourteen,twelve,six L and rates −4,zero,−4 L/min. Formulas agree at shared endpoints and t7 includes zero. Nothing specifies later inputs, so unused display space cannot justify negative water. Cards allow integer n0..4 only,outputs1,7,13,19,25. Integer four at half a pack does not validate that input or continuous joining. Observations(1,2),(2,4) fit both f=2x and g=2x+(x−1)(x−2),giving six and eight at three. Coordinate units and declared domains, not pixels, determine rates and extension. Finite observations do not imply linearity; a complete given graph and a discrete rule each have distinct premises.',
          '先辨这条连线是题设给定还是自己猜的；暂停段也有完整输入和零变化率。',
          'Decide first whether a connecting line is given or guessed. A pause segment still contains inputs with zero rate.',
        ),
        diagram: graph,
      },
      task(
        2,
        'integration-dependent-strategy',
        `矩形宽x cm、长x+${first ? 2 : 3}cm、面积${first ? 24 : 28}cm²；写一种从原数量关系到周长的策略链，保全部方程根与正长度筛选。另同一路线去返单程${first ? 6 : 12}km，去速${first ? 3 : 4}、返速${first ? 2 : 6}km/h，不停留，求总平均速度并写依赖链。哪些准备可独立或换序、哪些结论须等条件齐？“卡片顺序合法”能代替完整理由吗，算法必须唯一吗？`,
        `A rectangle has width x cm,length x+${first ? 2 : 3} cm and area ${first ? 24 : 28} cm². Give one strategy chain from original quantities to perimeter, retaining every algebraic root and positive-length filtering. Separately, an out-and-back route has one-way distance ${first ? 6 : 12} km,speeds ${first ? 3 : 4} and ${first ? 2 : 6} km/h and no stops. Find total average speed with dependencies. Which preparations may run independently or change order, and which conclusions need all inputs? Do legal cards replace reasons or require one unique algorithm?`,
        `矩形x(x+${first ? 2 : 3})=${first ? 24 : 28}→${first ? '(x+6)(x−4)=0' : '(x+7)(x−4)=0'}→候选${first ? '{−6,4}' : '{−7,4}'}→x>0且x+${first ? 2 : 3}>0筛x4→长${first ? 6 : 7}→周长${first ? 20 : 22}cm，代面积4×${first ? 6 : 7}=${first ? 24 : 28}cm²。去返时间${first ? '6/3=2、6/2=3' : '12/4=3、12/6=2'}h→总5h；可独立先算总路程${first ? 12 : 24}km，两量齐后平均=${first ? '12/5' : '24/5'}km/h，不能取速率算术均值${first ? '5/2' : '5'}。原域、代数建模、总路程可先准备；可以换合法算法或先保两候选再联核，但最终另一边/周长须对应允许尺寸，平均必须依总距离和总时间，不能用尚未证明结论。卡片只查依赖，自己须说明每步依据、单位、完整根与原式回验，不强制唯一顺序。`,
        `Rectangle: x(x+${first ? 2 : 3})=${first ? 24 : 28}→${first ? '(x+6)(x−4)=0' : '(x+7)(x−4)=0'}→candidates ${first ? '{−6,4}' : '{−7,4}'}→positive x and x+${first ? 2 : 3} retain x4→length ${first ? 'six' : 'seven'}→perimeter ${first ? 'twenty' : 'twenty-two'} cm. Check original area4×${first ? 6 : 7}=${first ? 24 : 28} cm². Travel times ${first ? '6/3=two and6/2=three' : '12/4=three and12/6=two'} hours total five; total distance ${first ? 'twelve' : 'twenty-four'} km can be prepared independently. Once both are known, average=${first ? '12/5' : '24/5'} km/h, not the arithmetic speed mean ${first ? '5/2' : 'five'}. Domain,model and distance preparations may change order; valid algorithms can differ or jointly screen candidates later. Final perimeter must belong to admissible dimensions, and average needs both total distance/time. Cards check only dependencies; provide reasons,units,complete roots and original checks without imposing one unique algorithm.`,
        '给每个中间量画入箭头；总距离与总时间可分支准备，但平均速度节点要同时等两者。',
        'Draw incoming dependencies for each quantity. Distance and time may be prepared in parallel,but average speed needs both.',
      ),
      task(
        3,
        'integration-reasonableness-audit',
        `把三项分别判“有反例所以错”“条件不足不能唯一”“已按条件核验”，必须给具体依据：①${first ? 'x²=9的完整实根只有{3}' : 'x²−2x=0的完整实根只有{2}'}；②仅观察${first ? '(0,0),(1,1)就断输入2必输出2' : '(1,2),(2,4)就断输入3必输出6'}，未给函数族；③${first ? '已知直角三角形两腿5cm与12cm，正斜边13cm' : '已知矩形边3cm与4cm，对角线5cm'}。③若把单位写cm²，数字仍一样能过吗？视窗外形和答案像不像可替这些核验吗？`,
        `Classify each claim as refuted by a counterexample,insufficient for uniqueness,or verified under its premises,with concrete evidence: (1) ${first ? 'x²=9 has complete real-root set {3}' : 'x²−2x=0 has complete real-root set {2}'}; (2) only ${first ? '(0,0),(1,1) are observed,so input two must output two' : '(1,2),(2,4) are observed,so input three must output six'},with no function class; (3) ${first ? 'a GIVEN right triangle with legs five/twelve cm has positive hypotenuse thirteen cm' : 'a GIVEN rectangle with sides three/four cm has diagonal five cm'}. Does writing cm² in (3) still pass because the number matches? Can appearance or plausible-looking answers replace these audits?`,
        first
          ? '①有反例−3，平方9满足原式但不在所称完整集合，故完整性主张错；不因3自身满足就过。②条件不足，f=x与g=x²均过两点，输入2给2和4，不能唯一；未证明实际值一定不是2。③按已知直角5²+12²=169=13²且正根13cm核验，不能删直角前提推广任意三角形。写13cm²是长度单位错，数字一样也不算全部核过。像素外形、合理数量级和少数点吻合不能代这些原条件、精确值、单位及全根检查。'
          : '①反例0使原式0成立而被漏，完整集合应{0,2}，仅2满足不证完整。②f=2x与g=2x+(x−1)(x−2)都过两观测，输入3给6与8不同，故未唯一而不是已证真实输出不等6。③矩形定义给直角，3²+4²=25，距离正根5cm，原条件已核；5cm²单位仍错。三种判断逻辑不同：实际反例否定、条件不足保未知、满足前提的推导支持本例，不能因看起来合理混成通过，也不从本例通过推所有未知题都通过。',
        first
          ? 'First is refuted by −3,satisfying x²=9 but missing from the claimed complete set; checking three alone is insufficient. Second lacks uniqueness: f=x and g=x² match the observations but give two/four at input two. This does not prove the actual output cannot be two. Third is verified under the GIVEN right angle:5²+12²=13² with positive length thirteen cm,not a rule for arbitrary triangles. Thirteen cm² has the wrong length unit despite matching digits. Pixel appearance,plausible magnitude and finite matches do not replace original premises,exactness,units or completeness.'
          : 'First has counterexample zero,which satisfies the original but is missing; the complete set is {0,2}. Second is insufficient: f=2x and g=2x+(x−1)(x−2) agree with both observations but give six/eight at three. That does not prove the actual output differs from six. Third uses the rectangle’s given right angle:3²+4²=25,positive diagonal five cm. Five cm² still has a wrong unit. Refutation,remaining uncertainty and verification under premises are different conclusions. Plausibility cannot merge them into approval,and a verified example does not certify all unknown future problems.',
        '反例要真满足原前提；不唯一要给两种相合规则；核验要把直角、正长度和单位都保留。',
        'A counterexample must meet premises; nonuniqueness needs two matching rules; verification retains right angle,positive length and units.',
      ),
    ],
  };
};
export const integrationAuditRetrieval = {
  H28: makeSet('H28'),
  H38: makeSet('H38'),
};
