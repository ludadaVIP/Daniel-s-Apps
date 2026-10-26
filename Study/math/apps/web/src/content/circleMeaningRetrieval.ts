import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J91' | 'J92') => {
  const near = unit === 'J91',
    id = (n: number) => `${unit}-MAINT-CIRCLE-MEANING-Q${n}`;
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
        '一次一个编号分问或独立分支，可分多次、不计时。先画图、标量名和单位、自行计算再逐项人审。允许口述与熟悉语言，读题协助与数学提示分开。',
        'Work on ONE numbered part or independent branch per untimed sitting. Draw, label quantities/units and calculate independently before human review of every requirement. Oral or familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '原条件；各独立分支见题干。表内不预填待求长度、面积、比值或体积。',
        'Original conditions; the prompt separates independent branches. Requested lengths, areas, quotients and volumes are not prefilled.',
      ),
      columns: [t('编号', 'ID'), t('含义', 'Meaning'), t('给定值', 'Given')],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const d = near ? 5 : 7,
    other = near ? 1 : 1.5,
    r = d / 2;
  const q1 = card(
    1,
    'circle-centre-radius-diameter',
    '① 圆O的直径为D cm，亲画两条相反方向半径并求每条长度；旋转草图，端点与量名怎样保留？再画两端在圆周却不经过O的弦，解释为何不能把它折半当半径。再另画一条过O且两端在圆周的弦时，它还能同时称弦与直径吗，重合端点需错开吗？② 另圆P的半径为S cm，比较圆O半径与圆P直径，检验“直径永远大于半径”。结论d=2r需要保哪一个圆？③ 保D为给定数学长度，屏幕放大两倍或看起来小成一个点，会改变半径值、正长度条件吗？给d=0能否做C/d实验？',
    '① Circle O has diameter D cm. DRAW its two opposite radii and find each length, then rotate the sketch while retaining endpoints and quantity names. Draw a chord missing O and explain why halving it does not give the radius. Redraw a chord through O with boundary endpoints: is it BOTH chord and diameter? Must coincident endpoints be separated? ② A DIFFERENT circle P has radius S cm. Compare O’s radius with P’s diameter to test “a diameter always exceeds a radius”. Which circle must d=2r refer to? ③ With D a mathematical given, do twice-size display zoom or a point-like appearance change its radius or positive-length condition? Could d=0 be used in C/d?',
    `圆O半径${r}cm，两份回D=${d}cm，不必取整；旋转保端点/过O/长度。偏心弦非直径、半长非半径；过O且端点在圆周时既弦又直径，重合端点合标不造新位置。圆P直径${2 * other}cm，小于O半径${r}cm，故跨圆“直径总大”不成立；d=2r须同圆。屏幕缩放或像点不改给定长度，图上像素不是实际cm；数学半径仍正，d=0不可相除。`,
    `O’s radius is ${r}cm; two recover D=${d}cm without rounding. Rotation retains endpoints, centre incidence and length. An off-centre chord is not a diameter and its half is not a radius. Through O with boundary endpoints it is BOTH; merge coincident labels. P has diameter ${2 * other}cm, less than O’s radius ${r}cm, refuting the unrestricted cross-circle claim. d=2r requires the SAME circle. Display zoom or point-like appearance does not alter the mathematical length; pixels are not physical centimetres. The radius remains positive and d=0 cannot be a divisor.`,
    '每条长度先写所属圆与r/d角色；相同位置合标，换屏幕不换数学给定。',
    'Name the circle and radius/diameter role of every length. Merge coincident positions; display changes do not change givens.',
  );
  table(q1, [
    ['D', '圆O直径/cm', 'Circle O diameter/cm', String(d)],
    ['S', '另圆P半径/cm', 'Different circle P radius/cm', String(other)],
  ]);

  const circumference = near ? '18.9' : '25.1',
    diameterMM = near ? 60 : 80,
    quotient = near ? '3.15' : '3.1375';
  const q2 = card(
    2,
    'pi-measurement-ratio',
    '本表全为给定假想有限精度读数。① C以cm给、d以mm给，先统一到cm，再另统一到mm，各算C/d；解释为何两种合法单位给同一无量纲商。直接用表中数码相除会错多少倍？再误用半径作分母，商变什么？② 保原读数，不改成记忆的3.14；说明它与理想π、按规则模拟、真实测量各有什么区别，有限表能证明π恰为3.14或无理吗？③ 独立分支：直径改0或负长度，各为什么不用于这项实验？若实际纸条只绕半周或被拉长，应改写来源与条件还是修改π去凑数据？无需真实测量。',
    'All readings here are GIVEN FICTIONAL finite-precision data. ① C uses cm and d uses mm. Convert both to cm, then independently to mm, calculating C/d in each. Why do valid common units give the same dimensionless quotient? By what factor is direct division of unmatched numerical entries wrong? Recalculate with radius mistakenly used as divisor. ② Retain the actual readings rather than forcing 3.14. Distinguish their quotient, ideal π, rule-generated simulation and physical measurement. Can a finite table prove π exactly 3.14 or irrational? ③ Independently consider zero diameter and negative lengths. If a paper strip covered only half a turn or stretched, should the source/conditions or π be changed? No actual measurement is needed.',
    `d=${diameterMM / 10}cm，C/d=${circumference}÷${diameterMM / 10}=${quotient}；同换mm为${Number(circumference) * 10}÷${diameterMM}，商相同无单位。直接${circumference}/${diameterMM}小十倍；除半径${diameterMM / 20}cm则商${near ? '6.3' : '6.275'}，是读数C/d的二倍，不是π。读数商非精确π，给定/模拟/实测须如实区分；有限表不证精确小数或无理性。零直径不能除，负长度不合该情境。半周不是整周C，拉伸改变测量过程，须重记条件/检查数据，理想π不为凑值改变。`,
    `d=${diameterMM / 10}cm, so C/d=${circumference}÷${diameterMM / 10}=${quotient}; in mm use ${Number(circumference) * 10}÷${diameterMM}, the same dimensionless quotient. Unmatched ${circumference}/${diameterMM} is ten times too small. Dividing by radius ${diameterMM / 20}cm gives ${near ? '6.3' : '6.275'}, twice the reading quotient, not π. A data quotient is not exact π; label given, simulated and physically observed sources honestly. A finite table proves neither an exact decimal nor irrationality. Zero division is invalid and negative lengths are outside this setting. Half a wrap is not full C; stretching changes the measurement process. Report/check conditions rather than changing ideal π.`,
    '先给每个数带上实际单位再换算；把数据之比与理想常数分开报告。',
    'Attach actual units before conversion; report a reading quotient separately from the ideal constant.',
  );
  table(q2, [
    ['C', '给定假想周长/cm', 'Given fictional circumference/cm', circumference],
    ['D', '给定假想直径/mm', 'Given fictional diameter/mm', String(diameterMM)],
  ]);

  const cc = near ? '21.98' : '28.26',
    wheelD = near ? 3 : 5,
    turns = near ? 3 : 4,
    semiR = near ? 2 : 3;
  const q3 = card(
    3,
    'circle-circumference',
    '① 分支A的C是按π≈3.14计算得到的周长值，不是实测。按同一约定反求d和r，再乘回C；不要混入另一π近似或把直径再乘二。② 分支B直径W cm的轮无滑动滚N整周，先求一周精确边界，再求精确总路程，保留π及长度单位；如果只有半周或发生滑动，原整周乘法还可直接照套吗？③ 分支C半径H cm的半圆形纸片，亲描半周弧与完整边框两种对象，分别给精确长度；比较二者为何不一样。边框同时含非π直段时，不能为了填某个单π系数框而删去直径。',
    '① Branch A’s C is a CALCULATED circumference using π≈3.14, not a physical reading. Invert under the SAME convention to find d and r, then multiply back; do not mix approximations or double a diameter again. ② In branch B a diameter-W-cm wheel rolls N COMPLETE turns without slipping. Find exact one-turn boundary and total travel with π and length units. Could half a turn or slipping use the same whole-turn multiplication unchanged? ③ In branch C trace a radius-H-cm semicircular sheet’s ARC and its WHOLE BORDER separately, giving each exact length. Why do they differ? A straight non-π contribution must not be dropped to fit a single-π-coefficient answer box.',
    `A：${cc}÷3.14=${near ? 7 : 9}cm为直径，再除2得r=${near ? 3.5 : 4.5}cm，按同约定乘回${cc}。B：一周${wheelD}πcm，${turns}周${wheelD * turns}πcm；半周应为${wheelD}/2·πcm，无滑动条件不满足不能由周数直接认路程。C：半周弧${semiR}πcm，整边框${semiR}π+${2 * semiR}cm，直径直段必须另加；二者均长度非cm²。混合π与直段答案是纸笔精确式，不以有限小数冒充精确π或强塞单倍数输入。`,
    `A: ${cc}÷3.14 gives diameter ${near ? 7 : 9}cm and radius ${near ? 3.5 : 4.5}cm; using the same convention recovers ${cc}. B: one turn is ${wheelD}πcm and ${turns} turns ${wheelD * turns}πcm. Half a turn instead covers (${wheelD}/2)πcm without slipping; slipping removes that direct travel inference. C: arc=${semiR}πcm, whole border=(${semiR}π+${2 * semiR})cm, including the straight diameter. Both use length, not cm². This mixed exact paper expression does not fit a single π multiple and must not lose its straight part or replace π by a finite decimal.`,
    '先描所问边界；反求沿原约定逆回，滚动另核整周数与无滑动条件。',
    'Trace the requested boundary. Invert the stated approximation convention; check complete-turn and no-slip premises separately.',
  );
  table(q3, [
    [
      'C',
      'A：按π≈3.14的计算周长/cm',
      'A: calculated circumference with π≈3.14/cm',
      cc,
    ],
    ['W', 'B：轮直径/cm', 'B: wheel diameter/cm', String(wheelD)],
    ['N', 'B：无滑动整周数', 'B: complete no-slip turns', String(turns)],
    [
      'H',
      'C：另半圆半径/cm',
      'C: separate semicircle radius/cm',
      String(semiR),
    ],
  ]);

  const areaD = near ? 6 : 10,
    areaR = areaD / 2;
  const q4 = card(
    4,
    'circle-area-rearrangement',
    '① 给定直径D cm，先标r，再写精确面积与按π≈3.14的计算面积，解释直接平方D会错几倍；同时列同圆精确周长并辨单位，不把量相加。② 画两幅同批八片等扇形的原圆/交错排列，逐片标号追踪。说明有限弧边和内弦辅助形、半周对应哪条长边；有限辅助底高是否已经等于πr与r？改64片时真正总面积变吗？③ 分支S把所有实际长度放大二倍，分支V只把同一图屏幕放大二倍：分别比较r、周长、面积，解释平方来自两个长度因素。不能把多切几片或屏幕像素倍数当实际圆面积倍数。',
    '① Given diameter D cm, label r before finding exact area and the calculation with π≈3.14. What factor error comes from squaring D directly? Also give the same circle’s exact circumference with its unit; do not add quantities of different dimensions. ② DRAW the original and alternately rearranged SAME eight sectors, labelling every piece. Explain retained arcs, inner chord guides and which half-boundary supplies a long edge. Are finite guide dimensions already πr and r? Does using 64 pieces change total area? ③ In branch S DOUBLE actual lengths; in branch V merely double the display size of the SAME circle. Compare r, circumference and area separately, explaining the two length factors behind the square. More pieces or more pixels do not enlarge the physical circle.',
    `r=${areaR}cm，A=${areaR * areaR}πcm²，按3.14为${((areaR * areaR * 314) / 100).toFixed(2)}cm²；直接πD²为正确值4倍。同圆C=${areaD}πcm，非面积。每片刚性移动保弧/半径/面积，八片或64片合计仍${areaR * areaR}π；内弦辅助形漏弓形而非原片丢失，有限底高未精确等πr/r，细分才趋近，一条长边对应半周。S实际r加倍、C加倍、A四倍为${4 * areaR * areaR}πcm²；V只显示放大，原r/C/A均不变，不能拿屏幕尺当真实cm。`,
    `r=${areaR}cm, A=${areaR * areaR}πcm²; using 3.14 gives ${((areaR * areaR * 314) / 100).toFixed(2)}cm². πD² would be four times too large. Circumference=${areaD}πcm, a different quantity. Rigid motion retains every arc, radius and area; eight or 64 pieces still sum to ${areaR * areaR}π. Inner chord guides omit curved segments that remain in the pieces. Finite guide dimensions are not exactly πr/r; refinement approaches them, with one long edge from half a circumference. S doubles actual r and C, quadrupling A to ${4 * areaR * areaR}πcm². V changes only display size; original r/C/A remain fixed, and screen-ruler pixels are not physical centimetres.`,
    '先从直径回半径，再分别追踪两条长度因素；区分改对象、改切片和改显示。',
    'Recover radius first and track both length factors. Distinguish changing the object, its partition and its display.',
  );
  table(q4, [
    [
      'D',
      '原理想圆直径/cm',
      'Original ideal circle diameter/cm',
      String(areaD),
    ],
  ]);

  const inner = near ? 2 : 3,
    height = near ? 4 : 5,
    outer = inner + 1,
    outerH = height + 2;
  const q5 = card(
    5,
    'cylinder-faces-volume',
    '① 分支I为理想薄壁圆柱，内半径R、内高H且按薄壁忽略厚度：画同尺展开，求侧面长/宽、一个圆面、零/一/两圆面所需面片总面积与完整内部体积，保π和量纲。去盖、去底各改变什么，面积够是否保证实际采购纸张够？② 分支E是另一个厚壁实际容器，已给内R/H及外S/T：只求满至给定内高的内部体积，并量化错误套外部尺寸的体积及多算量。此分支外尺寸不能反过来塞进I的薄壁表面积模型；无需假定壁厚或算真实壁材面积。③ 回分支I，仅高度变两倍：比较圆底、侧面积、两底封闭总面积与体积，哪些二倍、哪些不二倍？再用1cm³=1mL写容量；平方厘米能否直接改名mL？没有底的侧筒即使有几何体积数，也不能直接称可盛液体容量。',
    '① Branch I is an IDEAL thin-walled cylinder with internal R/H, ignoring thickness. DRAW a common-scale net; find side length/width, one end area, total face areas for zero/one/two ends, and full internal volume, retaining π and dimensions. What changes when lid/base is removed? Does face area alone ensure purchased sheet dimensions suffice? ② Branch E is a SEPARATE actual thick-walled container with inner R/H and outer S/T. Find volume filled to the stated inner height, the erroneous outside-dimension volume and its excess. Do not reuse outer dimensions in I’s thin-wall face model; no wall-thickness inference or actual material area is requested. ③ Return to I and double ONLY height. Compare base, side, closed two-end area and volume: which double and which do not? Convert capacity using 1cm³=1mL; may cm² simply be renamed mL? A baseless sleeve’s geometric volume is not automatically retainable liquid capacity.',
    `I侧面长${2 * inner}πcm、宽${height}cm，侧${2 * inner * height}πcm²、每底${inner * inner}πcm²；0/1/2圆面总${2 * inner * height}/${2 * inner * height + inner * inner}/${2 * inner * height + 2 * inner * inner}倍πcm²。内V=${inner * inner * height}πcm³=${inner * inner * height}πmL。去盖少一底面积不改内尺寸，去底不能直接盛水；面片不含接缝/废料，面积总量不保证纸张尺寸排得下。E真内V同为${inner * inner * height}π，错外算${outer * outer * outerH}πcm³，多${outer * outer * outerH - inner * inner * height}π；外空间不是内容量，两个分支尺寸不混用于薄壁面片。I仅高加倍：底仍${inner * inner}π，侧${4 * inner * height}π，封闭${4 * inner * height + 2 * inner * inner}πcm²，不等原封闭的二倍${4 * inner * height + 4 * inner * inner}π；V二倍${2 * inner * inner * height}πcm³。面积与空间不相加，cm²不能直接换mL。`,
    `I: side length=${2 * inner}πcm, width=${height}cm, side area=${2 * inner * height}πcm², one end=${inner * inner}πcm². For 0/1/2 ends totals are ${2 * inner * height}/${2 * inner * height + inner * inner}/${2 * inner * height + 2 * inner * inner} times πcm². Internal V=${inner * inner * height}πcm³=${inner * inner * height}πmL. Removing a lid saves one end without changing internal dimensions; removing the base prevents direct storage. Face area excludes seams/waste and does not ensure a sheet’s dimensions can fit the net. E: actual inner V is ${inner * inner * height}π; the wrong outer calculation gives ${outer * outer * outerH}πcm³, excess ${outer * outer * outerH - inner * inner * height}π. Outer space is not inner capacity; keep these branches separate for material modelling. Doubling ONLY I’s height retains end ${inner * inner}π, doubles side to ${4 * inner * height}π, and yields closed area ${4 * inner * height + 2 * inner * inner}πcm² rather than ${4 * inner * height + 4 * inner * inner}π (twice the original closed area). Volume doubles to ${2 * inner * inner * height}πcm³. Do not add area to space or relabel cm² as mL.`,
    '先标分支与内外尺寸，再指面/数面/说量纲；只改高度时圆底没有随之加倍。',
    'Label branch and inner/outer dimensions before counting faces and naming dimensions. Doubling height alone does not double the ends.',
  );
  table(q5, [
    [
      'R',
      '两分支给定内半径/cm',
      'Given inner radius in both branches/cm',
      String(inner),
    ],
    [
      'H',
      '两分支给定内高/cm',
      'Given inner height in both branches/cm',
      String(height),
    ],
    ['S', '仅分支E外半径/cm', 'Branch E ONLY outside radius/cm', String(outer)],
    ['T', '仅分支E外高/cm', 'Branch E ONLY outside height/cm', String(outerH)],
  ]);
  return {
    id: `${unit}-MAINT-CIRCLE-MEANING`,
    unit,
    title: t(
      '圆的量名、反求与尺寸参照',
      'Circle quantities, inverse calculations and dimension references',
    ),
    bridge: 'P66-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P66-L0${n}`]),
    ),
    intro: t(
      '五张纸笔卡可分多次，一次一个编号小问或独立分支、不计时。先自己画图、标量名单位与条件，再逐项人审，允许口述和熟悉语言。只用给定假想数据与纸图，不需真实测量、滚动物体、切割硬罐或购买；读题协助与数学提示分开。',
      'Five paper cards may span untimed sittings, ONE numbered part or independent branch at a time. Draw and label quantities, units and conditions before human review of every requirement; oral or familiar-language responses are welcome. Given fictional data and sketches require no actual measurement, rolling objects, cutting cans or purchases. Separate reading assistance from mathematical hints.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const circleMeaningRetrieval = {
  J91_CIRCLE_MEANING: makeSet('J91'),
  J92_CIRCLE_MEANING: makeSet('J92'),
};
