import { t, type Question } from '../model';
import { reasoning } from './builders';
const fraction = (n: number, d: number): string => {
  const gcd = (a: number, b: number): number =>
    b ? gcd(b, a % b) : Math.abs(a);
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const makeSet = (unit: 'P66' | 'J87') => {
  const near = unit === 'P66',
    id = (n: number) => `${unit}-MAINT-GEOMETRY-CONSERVATION-Q${n}`;
  const task = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次只做一个编号小问。先自己画、标单位和说明量的对象，再逐项核查；参考数字或关键词不能代替理由。',
        'Do ONE numbered part per sitting. Draw, label units and identify the measured object before reviewing every part; reference numbers or keywords cannot replace reasoning.',
      ),
    ]);
  const table = (
    q: Question,
    caption: [string, string],
    rows: [string, [string, string], string][],
  ) => {
    q.contextTable = {
      caption: t(...caption),
      columns: [
        t('编号', 'ID'),
        t('量名与单位', 'Quantity and unit'),
        t('原始记录', 'Original record'),
      ],
      rows: rows.map(([k, label, value]) => [
        t(k, k),
        t(...label),
        t(value, value),
      ]),
    };
  };
  const amount = near ? 450 : 125,
    cap = near ? '3/5' : '7/8',
    cc = near ? 600 : 875;
  const q1 = task(
    1,
    'metric-dimension-conversion',
    '① L/A/V分别以cm、cm²、cm³给数，独立改成m、m²、m³，写经dm单位的两级链并逆查原量；C把升改成cm³和mL。用方向数解释每级因子，不能只改单位名字。② 自画1m³分成dm³的层级示意，标一次只放大的1dm³里每层cm³块数、层数和总数，再说明它占整个m³多少份。屏幕放大这个子块或只换观察层，会让整个量改变吗？不必机械画出百万颗。③ Z零面积换单位仍为零，能因此把cm²直接当cm吗？从面积求边还缺什么关系或长度？',
    '① L/A/V give counts in cm, cm² and cm³. Independently rewrite them in m, m² and m³, showing two stages THROUGH dm units and reversing to the original. Convert C from litres to cm³ and mL. Explain the directional factors rather than renaming units. ② DRAW a hierarchy from 1m³ to dm³. For ONE zoomed 1dm³, label cm³ cubes per layer, layers and total, then its fraction of the whole m³. Does zooming this subunit or selecting a layer change the whole quantity? Do not mechanically draw a million cubes. ③ Z stays zero after area-unit conversion. Does matching zero permit treating cm² as cm? What relationship or length is missing to find an edge from area?',
    `L=${fraction(amount, 100)}m，链${amount}cm=${fraction(amount, 10)}dm=${fraction(amount, 100)}m；A=${fraction(amount, 10000)}m²，链${amount}cm²=${fraction(amount, 100)}dm²=${fraction(amount, 10000)}m²；V=${fraction(amount, 1000000)}m³，链${amount}cm³=${fraction(amount, 1000)}dm³=${fraction(amount, 1000000)}m³。逆链分别乘10/100/1000两次，实际量不变。C=${cc}cm³=${cc}mL。1m³有10×10×10=1000个dm³；放大的一dm³有每层100颗cm³、10层、1000颗，占整个m³的1/1000；整个m³共1000000颗cm³。换观察层不增加物体，放大不把子块变整个大块。Z 0m²=0cm²，数值同为0仍不把面积维度改成长；还需形状与一边或适当关系。`,
    `L=${fraction(amount, 100)}m: ${amount}cm=${fraction(amount, 10)}dm=${fraction(amount, 100)}m. A=${fraction(amount, 10000)}m²: ${amount}cm²=${fraction(amount, 100)}dm²=${fraction(amount, 10000)}m². V=${fraction(amount, 1000000)}m³: ${amount}cm³=${fraction(amount, 1000)}dm³=${fraction(amount, 1000000)}m³. Reverse each two-stage chain using factors 10,100,1000 respectively; the quantity stays fixed. C=${cc}cm³=${cc}mL. A 1m³ whole has 10×10×10=1000 dm³ subunits. ONE zoomed dm³ has 100 cm³ cubes per layer, 10 layers and 1000 cubes, representing 1/1000 of the m³; the whole has 1000000 cm³ cubes. Selecting a layer adds no objects, and zoom does not turn the subunit into the whole. Z:0m²=0cm²; the common numerical zero does not convert area into length. Finding an edge still needs a shape and another length or relationship.`,
    '先画一个大单位沿几个方向分成十份；面积、体积两级链各用自己的因子。',
    'Draw how many directions split a larger unit into tens; each dimension has its own factors at both stages.',
  );
  table(
    q1,
    [
      '同一行只改写同类量；R是放大参照，Z是零量边界。',
      'Within a row retain quantity and dimension; R is a zoom reference and Z a zero-quantity boundary.',
    ],
    [
      ['L', ['长度/cm', 'Length/cm'], String(amount)],
      ['A', ['面积/cm²', 'Area/cm²'], String(amount)],
      ['V', ['体积/cm³', 'Volume/cm³'], String(amount)],
      ['C', ['容量/L', 'Capacity/L'], cap],
      ['R', ['参照整体/m³', 'Reference whole/m³'], '1'],
      ['Z', ['面积/m²', 'Area/m²'], '0'],
    ],
  );
  const length = near ? '1.5' : '2.4',
    width = near ? 80 : 75,
    grid = near ? 10 : 15;
  const cmLength = near ? 150 : 240,
    rectArea = cmLength * width,
    perimeter = 2 * (cmLength + width),
    ia = near ? 42 : 63,
    iw = near ? 6 : 7;
  const pl = near ? 2 : 3,
    pw = near ? 6 : 7,
    se = near ? 4 : 5;
  const q2 = task(
    2,
    'rectangle-area',
    '① R两条边单位不同，先统一，再按G所给小方格边长画比例覆盖图，说明每格面积、每行数与行数；求面积的cm²与m²两种写法和周长的m写法。旋转图形后格数和边界怎样对应？无需机械画所有格，须标清可重复的行列。② I由面积和一边求另一边，给单位并代回；这是把面积直接换成长吗？③ P长方形与S正方形各画格图、算周长和面积。相同周长保证相同面积吗？正方形乘4量的是什么，数值偶合也能混用单位吗？',
    '① R has mixed edge units. Align them, then DRAW a scaled covering diagram using G’s small-square edge. State area per cell, cells per row and rows; give area in cm² AND m² and perimeter in m. Match cells and boundary after rotation. Repeated row/column labels may replace drawing every cell. ② I gives area and one edge: find the other with its unit and substitute. Is this direct area-to-length conversion? ③ DRAW P and S, calculate their perimeters and areas, and test whether equal perimeter guarantees equal area. What does four times a square edge measure, even if numerical values happen to coincide?',
    `R统一为${cmLength}cm与${width}cm；每格${grid}×${grid}=${grid * grid}cm²，${cmLength / grid}列${width / grid}行，面积${rectArea}cm²=${fraction(rectArea, 10000)}m²；周长${perimeter}cm=${fraction(perimeter, 100)}m。旋转交换行列且每格一一对应，面积与周长不变。I另一边${ia}÷${iw}=${ia / iw}cm，代回${ia / iw}×${iw}=${ia}cm²；这是用关系求新量，不是单位换算。P面积${pl * pw}cm²、周长${2 * (pl + pw)}cm；S面积${se * se}cm²、周长${4 * se}cm。周长相同面积不同。S四倍边长求边界，边长平方求覆盖，数字即使相同仍不混cm与cm²。`,
    `R has edges ${cmLength}cm and ${width}cm. Each cell is ${grid}×${grid}=${grid * grid}cm², with ${cmLength / grid} columns and ${width / grid} rows; area=${rectArea}cm²=${fraction(rectArea, 10000)}m², perimeter=${perimeter}cm=${fraction(perimeter, 100)}m. Rotation swaps rows/columns with a one-to-one cell match, preserving area and perimeter. I:other edge=${ia}÷${iw}=${ia / iw}cm; substitute ${ia / iw}×${iw}=${ia}cm². This finds a new quantity through a relationship, not direct unit conversion. P:area=${pl * pw}cm², perimeter=${2 * (pl + pw)}cm. S:area=${se * se}cm², perimeter=${4 * se}cm. Equal perimeter gives different areas. Four times a square edge measures boundary; its square measures coverage, even if raw numerical counts coincide.`,
    '两边先用同一种长度单位；画格时每格也有实际边长，不能把大格当1cm²。',
    'Align edge units and label the actual cell edge; a larger cell is not automatically 1cm².',
  );
  table(
    q2,
    [
      'R/I/P/S各独立；G指定R的小方格边长。',
      'R/I/P/S are independent; G specifies the covering-cell edge for R.',
    ],
    [
      ['R_L', ['R长/m', 'R length/m'], length],
      ['R_W', ['R宽/cm', 'R width/cm'], String(width)],
      ['G', ['R方格边长/cm', 'R grid edge/cm'], String(grid)],
      ['I_A', ['I面积/cm²', 'I area/cm²'], String(ia)],
      ['I_W', ['I已知边/cm', 'I known edge/cm'], String(iw)],
      ['P_L', ['P长/cm', 'P length/cm'], String(pl)],
      ['P_W', ['P宽/cm', 'P width/cm'], String(pw)],
      ['S', ['S正方形边/cm', 'S square edge/cm'], String(se)],
    ],
  );
  const b = near ? 5 : 7,
    h = 3,
    apex = -4,
    area = (b * h) / 2,
    inverseA = near ? 28 : 45,
    inverseB = near ? 7 : 9;
  const q3 = task(
    3,
    'triangle-rearrangement',
    '① 画A(0,0)、B(T_B,0)、C(T_X,T_H)，坐标长度单位cm；标直角和外侧垂足，AC已给5cm。先在纸上把C反射到T_R处，再配第二份与切拼矩形：逐步标一份或两份、底高、对应片及无缺口无重叠的边，求一份与配对面积。反射本身让总面积翻倍吗，为什么不能用AC当原AB的高，半格可丢吗？② I求未知垂直高并代回；再把原图的AC选作底，利用同一面积求对应高，说明不能沿用原来那条高。③ M先统一底高单位，求m²面积，说明它与原小图的数量关系；数值单位不能只靠屏幕大小决定。',
    '① DRAW A(0,0), B(T_B,0), C(T_X,T_H), coordinates in cm; mark the right angle and external foot. AC is given as 5cm. Reflect C to T_R on paper, THEN add a second copy and rearrange to a rectangle. Label one/two copies, base/height, corresponding pieces and matching edges without gaps/overlap. Find one-copy and pair areas. Does reflection itself double the total? Why is AC not height to AB, and may partial squares be dropped? ② Use I to find the unknown perpendicular height and substitute. Then choose original AC as base and find its corresponding height using the same area; why must the old altitude not simply be reused? ③ Align M’s mixed units and calculate area in m². Relate its quantity to the original small diagram, without using apparent screen size as unit evidence.',
    `原三角形底${b}、高3，AC=5因4²+3²=5²。左垂足在x=−4；反射后C=(${b + 4},3)，反射保一份面积${area}cm²，不新增片；配第二份后总${b * h}cm²，无损切拼成${b}×3矩形，回一份${fraction(b * h, 2)}cm²。斜边5含水平位移，不是原高3；部分格保留。I高=${inverseA}×2÷${inverseB}=${(2 * inverseA) / inverseB}cm，代回恢复${inverseA}cm²。改用AC=5作底，对应高=${fraction(b * h, 5)}cm，同一三角形面积不变，但高须垂直新底。M底${b * 10}cm、高30cm，面积${(b * 10 * 30) / 2}cm²=${fraction(b * 10 * 30, 20000)}m²，是原面积100倍，因为两条长度各10倍。`,
    `AB=${b}cm and height=3cm; AC=5cm since 4²+3²=5². The original foot is at x=−4. Reflection puts C at (${b + 4},3), preserving ONE area=${area}cm². Adding a copy gives pair area=${b * h}cm² and a ${b}×3 rectangle after lossless rearrangement; one copy is ${fraction(b * h, 2)}cm². The slanted five includes horizontal displacement and is not the old height three; retain partial cells. I:height=${inverseA}×2÷${inverseB}=${(2 * inverseA) / inverseB}cm, restoring ${inverseA}cm². Choosing AC=5 as base gives corresponding height=${fraction(b * h, 5)}cm; the same triangle keeps its area but needs a perpendicular to the NEW base. M:base=${b * 10}cm,height=30cm,area=${(b * 10 * 30) / 2}cm²=${fraction(b * 10 * 30, 20000)}m², one hundred times the small diagram because BOTH lengths scale by ten.`,
    '先区分保留原片的反射与新增副本；同一个三角形换底时面积不变，高须重新对应。',
    'Separate reflecting one piece from adding another; changing base preserves triangle area but changes its corresponding altitude.',
  );
  table(
    q3,
    [
      'T给原坐标与反射后横坐标，I与M为独立问题。',
      'T gives original coordinates and reflected x; I and M are independent problems.',
    ],
    [
      ['T_B', ['底AB/cm', 'Base AB/cm'], String(b)],
      ['T_H', ['C的纵坐标/cm', 'C y-coordinate/cm'], '3'],
      ['T_X', ['C原横坐标/cm', 'Original C x-coordinate/cm'], String(apex)],
      ['T_R', ['反射后横坐标/cm', 'Reflected x-coordinate/cm'], String(b + 4)],
      ['T_AC', ['斜边AC/cm', 'Slanted AC/cm'], '5'],
      ['I_A', ['I面积/cm²', 'I area/cm²'], String(inverseA)],
      ['I_B', ['I底/cm', 'I base/cm'], String(inverseB)],
      ['M_B', ['M底/m', 'M base/m'], near ? '0.5' : '0.7'],
      ['M_H', ['M高/cm', 'M height/cm'], '30'],
    ],
  );
  const pb = near ? 7 : 9,
    ph = near ? 4 : 3,
    shear = near ? 3 : 4,
    ta = near ? 4 : 5,
    tb = near ? 7 : 8,
    th = 3,
    pa = near ? 42 : 54,
    ih = 6;
  const q4 = task(
    4,
    'parallel-base-area',
    '① 用P的底、高及错移绝对值，分别画左错移、零错移和右错移。对两非零图标沿高切块、平移一个底宽到另一边的对应，核无空隙重叠；求每块及剩余面积。零错移还须硬切一块吗？为什么三图同面积而斜边/周长可不同，平行四边形不能一律除二？② T画两份全等梯形，标新底由哪些段相接，求一份的精确面积，保留半平方单位。交换两底后、两底都改成T_B后，各怎样解释图与公式？按本课“恰一对平行边”命名，相等底时还叫梯形吗？③ I根据面积和垂直高逆求底，并代回核查量与单位。',
    '① With P’s base, height and shear magnitude, DRAW left, zero and right shear. For each nonzero shear show a perpendicular cut and translate its piece by ONE base width, matching edges with no overlap/gaps. Find cut and remaining areas. Must a zero-shear rectangle be cut anyway? Explain why the three areas agree while side/perimeter can differ, and why a parallelogram is not automatically halved. ② DRAW two congruent T trapezoids and trace the joined base. Find one-copy EXACT area, retaining a half square. Explain exchanging bases and then setting both to T_B. Under the stated exactly-one-parallel-pair convention, is the equal-base shape still a trapezoid? ③ Use I’s area and perpendicular height to find base, then substitute with correct units.',
    `P三图面积${pb}×${ph}=${pb * ph}cm²；非零两图切块${shear}×${ph}÷2=${(shear * ph) / 2}cm²，剩${pb * ph - (shear * ph) / 2}cm²；只平移${pb}cm且匹配边，不以面积和相同替代无空隙检查。零错移就是矩形，无正面积切块。切拼始终一份不除二；斜边因水平错移可变。T两份底${ta}+${tb}=${ta + tb}、高3，总${(ta + tb) * 3}cm²，一份${fraction((ta + tb) * 3, 2)}cm²。交换底保和与面积；都改${tb}时(${tb}+${tb})×3÷2=${tb * 3}cm²，是平行四边形，狭义不叫梯形但式仍有效。I底${pa}÷${ih}=${pa / ih}cm，代回${pa / ih}×${ih}=${pa}cm²。`,
    `P:all three areas=${pb}×${ph}=${pb * ph}cm². Each nonzero cut=${shear}×${ph}÷2=${(shear * ph) / 2}cm²; remaining=${pb * ph - (shear * ph) / 2}cm². Translate by ${pb}cm and match boundaries; equal area totals alone do not certify gap-free coverage. Zero shear is already a rectangle with no positive-area cut. Rearrangement keeps ONE copy, so do not halve it; horizontal shear can change slanted sides. T:the pair joins base ${ta}+${tb}=${ta + tb}, height 3, area ${(ta + tb) * 3}cm²; one=${fraction((ta + tb) * 3, 2)}cm². Exchanging bases preserves sum/area. Equal bases ${tb} give (${tb}+${tb})×3÷2=${tb * 3}cm², a parallelogram under the exclusive naming convention while the expression remains valid. I:base=${pa}÷${ih}=${pa / ih}cm; substitute ${pa / ih}×${ih}=${pa}cm².`,
    '先标一份还是两份；左右切块的对应位置不同，但只能平移不能拉伸。',
    'Identify one copy versus two; left/right cut locations differ, but translating never stretches a piece.',
  );
  table(
    q4,
    [
      'P的错移为所给正数的负、零、正三种；所有尺寸cm，面积另标cm²。',
      'Use negative, zero and positive P shear; edge dimensions are cm and areas separately use cm².',
    ],
    [
      ['P_B', ['P底/cm', 'P base/cm'], String(pb)],
      ['P_H', ['P高/cm', 'P height/cm'], String(ph)],
      ['P_S', ['P错移绝对值/cm', 'P shear magnitude/cm'], String(shear)],
      ['T_A', ['T上底/cm', 'T top base/cm'], String(ta)],
      ['T_B', ['T下底/cm', 'T bottom base/cm'], String(tb)],
      ['T_H', ['T高/cm', 'T height/cm'], String(th)],
      ['I_A', ['I面积/cm²', 'I area/cm²'], String(pa)],
      ['I_H', ['I高/cm', 'I height/cm'], String(ih)],
    ],
  );
  const iw3 = near ? 5 : 6,
    id3 = near ? 3 : 4,
    ih3 = near ? 4 : 3,
    volume = iw3 * id3 * ih3,
    edge = near ? 2 : 3,
    v = near ? 84 : 120,
    vl = near ? 7 : 8,
    vd = near ? 4 : 5;
  const q5 = task(
    5,
    'unit-cube-volume',
    '① I为理想容器内部尺寸且装满到所给内部高度。画一层单位块位置图，标每格1cm³、每层数与层数，再求cm³、mL和L容量。换看另一层是否改变总体积？E只把同一组数改成外部尺寸、壁厚未知，能否沿用容量结论？说明已知外框量和仍缺的条件。② C为实心正方体，先画原层与层数，再把三条棱都加倍，核每层和层数分别变几倍、体积为何不是只翻倍；不要把投影面积当空间量。③ V由体积、长和宽求高，写单位、代回，并区别单层底面积与乘一个单位高得到的空间量。',
    '① I gives INTERNAL dimensions of an ideal container filled to the stated internal height. DRAW one layer’s cube-position map, label 1cm³ per tile, cubes per layer and layers, then capacity in cm³, mL AND L. Does inspecting another layer alter the whole? E reinterprets the SAME numbers as EXTERNAL dimensions with unknown walls: is the capacity still justified? State the known bounding quantity and missing information. ② For solid cube C, draw a layer and layer count, then DOUBLE ALL THREE edges. Track factors for each layer and number of layers to explain why volume does not merely double. A projection is not volume. ③ From V’s volume, length and depth, find height, retain its unit and substitute. Distinguish bottom-face area from the space contributed by a unit-height layer.',
    `I每层${iw3}×${id3}=${iw3 * id3}颗，${ih3}层，每格标该层1cm³块，总${volume}cm³=${volume}mL=${fraction(volume, 1000)}L。换层只换观察。E外框体积也为${volume}cm³，但容量需要内尺寸、壁厚与形状等，不能认定${volume}mL。C原每层${edge * edge}颗、${edge}层、${edge ** 3}cm³；加倍后每层${(2 * edge) ** 2}颗、${2 * edge}层、${(2 * edge) ** 3}cm³，层内4倍且层数2倍，总8倍。V底面积${vl}×${vd}=${vl * vd}cm²，每1cm高贡献${vl * vd}cm³，所求高${v}÷${vl * vd}=${v / (vl * vd)}cm，代回${vl}×${vd}×${v / (vl * vd)}=${v}cm³。`,
    `I:layer=${iw3}×${id3}=${iw3 * id3} cubes, layers=${ih3}, one 1cm³ cube per position, total=${volume}cm³=${volume}mL=${fraction(volume, 1000)}L. Changing inspected layer changes observation only. E:bounding volume is also ${volume}cm³, but capacity needs internal dimensions, walls and shape; ${volume}mL is unjustified. C:original layer=${edge * edge}, layers=${edge}, volume=${edge ** 3}cm³; doubled edges give layer=${(2 * edge) ** 2}, layers=${2 * edge}, volume=${(2 * edge) ** 3}cm³. Four times per layer and twice as many layers give EIGHT times volume. V:bottom area=${vl}×${vd}=${vl * vd}cm², so each 1cm-high layer contributes ${vl * vd}cm³. Height=${v}÷${vl * vd}=${v / (vl * vd)}cm; substitute ${vl}×${vd}×${v / (vl * vd)}=${v}cm³.`,
    '位置图一格标一颗有单位高度的小块；容量必须问内部，三棱加倍须逐方向追踪。',
    'A position-map tile marks a cube with unit height; capacity concerns the inside, and doubling requires tracking all three directions.',
  );
  table(
    q5,
    [
      'I尺寸为内部；E仅改成相同数字的外部尺寸。V独立，C为实心正方体。',
      'I dimensions are internal; E uses the same numbers as external dimensions. V is independent; C is a solid cube.',
    ],
    [
      ['I_L', ['内长/cm', 'Internal length/cm'], String(iw3)],
      ['I_D', ['内宽/cm', 'Internal depth/cm'], String(id3)],
      ['I_H', ['内高/cm', 'Internal height/cm'], String(ih3)],
      ['C', ['正方体原棱长/cm', 'Original cube edge/cm'], String(edge)],
      ['V_V', ['V体积/cm³', 'V volume/cm³'], String(v)],
      ['V_L', ['V长/cm', 'V length/cm'], String(vl)],
      ['V_D', ['V宽/cm', 'V depth/cm'], String(vd)],
    ],
  );
  const nw = near ? 5 : 6,
    nd = near ? 2 : 3,
    nh = near ? 3 : 2,
    allowance = near ? 8 : 10,
    surface = 2 * (nw * nd + nw * nh + nd * nh),
    open = surface - nw * nd,
    bw = 2 * (nw + nd),
    bh = nh + 2 * nd;
  const q6 = task(
    6,
    'box-surface-area',
    '① 画本课指定的整张网：A左、B前、C右、D后四侧面连成一排，E顶接B上方、F底接B下方，标所有尺寸和每面面积。求有盖与去E后无盖面片和、体积；S记你自己求得的有盖面片和，不能把内外两侧重算成双份纸板。② 求这张网有盖/无盖时的矩形外接宽高、面积和框内空白，说明空白不是盒面。纸B是1cm宽、Scm长的完整长条，面积是否足够保证这张有盖整网能放下？本题网必须完整，不分面裁，边与纸边平行，可整体旋转90度。指出尺寸障碍，不只比较面积；不要求搜索其他网的最优排版。③ 面片预算另加J明确给的接缝量，求预算，解释它为何仍不是任意纸张的尺寸保证，也不能把当前外接框称为所有方案的最小用纸量。',
    '① DRAW the SPECIFIED one-piece net: A left, B front, C right, D back in a side strip; E top above B and F bottom below B. Label dimensions and every face area. Find closed and open-top panel sums and volume. Let S be YOUR derived closed panel sum; do not double-count inside/outside as two boards. ② Find this net’s closed/open bounding width, height, area and blank cutting regions. Sheet B is a complete strip 1cm wide and S cm long: does its area guarantee this CLOSED net fits? Keep the net IN ONE PIECE, without splitting panels, aligned to sheet edges with an optional whole-net 90-degree rotation. Identify dimensional obstructions, not just area; no search for an optimal alternative net is required. ③ Add the SPECIFIED seam allowance J to the panel budget. Why does that budget still not guarantee arbitrary sheet dimensions, and why is this bounding frame not a universal minimum across layouts?',
    `网A/C各${nd}×${nh}=${nd * nh}cm²，B/D各${nw}×${nh}=${nw * nh}cm²，E/F各${nw}×${nd}=${nw * nd}cm²；S=${surface}cm²，无盖只去E得${open}cm²，体积${nw * nd * nh}cm³。有盖外接${bw}×${bh}=${bw * bh}cm²，空白${bw * bh - surface}cm²；无盖外接${bw}×${nh + nd}=${bw * (nh + nd)}cm²，空白${bw * (nh + nd) - open}cm²。纸B为1×${surface}，面积虽等S，1cm宽小于该网两种朝向的横向需求${bw}cm或${bh}cm，故所定完整网放不下；面片和只是必要面积预算，不是排版保证。接缝预算${surface}+${allowance}=${surface + allowance}cm²；余量明确但形状、尺寸和排版仍需说明。当前外接框含空白并只属此网，未证明所有网的最小纸张。`,
    `Net A/C each=${nd}×${nh}=${nd * nh}cm², B/D each=${nw}×${nh}=${nw * nh}cm², E/F each=${nw}×${nd}=${nw * nd}cm². S=${surface}cm²; removing ONLY E gives ${open}cm²; volume=${nw * nd * nh}cm³. Closed bounds=${bw}×${bh}=${bw * bh}cm², blank=${bw * bh - surface}cm². Open bounds=${bw}×${nh + nd}=${bw * (nh + nd)}cm², blank=${bw * (nh + nd) - open}cm². Sheet B is 1×${surface}, area S, but width 1 is below the net’s required ${bw}cm or ${bh}cm in the two allowed orientations. The specified one-piece net does not fit: panel area is an area budget, not a layout guarantee. Seam budget=${surface}+${allowance}=${surface + allowance}cm²; dimensions, shape and layout still matter. This bounding frame includes blanks and belongs to one net; it does not prove a universal minimum over layouts.`,
    '先标每个实际面一次，再画覆盖这张网的最小轴对齐外框；比较整张网的宽高而非只看总面积。',
    'Count each actual panel once, then bound THIS net with an axis-aligned rectangle; compare whole-net dimensions rather than area alone.',
  );
  table(
    q6,
    [
      '理想盒忽略厚度；J是另给接缝预算。纸B长S由自己的有盖面片和确定，非预填答案。',
      'Ideal thickness is ignored; J is a specified extra seam budget. Sheet B length S comes from your own closed panel sum, not a prefilled answer.',
    ],
    [
      ['L', ['盒长/cm', 'Box length/cm'], String(nw)],
      ['D', ['盒宽/cm', 'Box depth/cm'], String(nd)],
      ['H', ['盒高/cm', 'Box height/cm'], String(nh)],
      ['J', ['接缝预算/cm²', 'Seam allowance/cm²'], String(allowance)],
      ['B_W', ['纸B宽/cm', 'Sheet B width/cm'], '1'],
      ['B_L', ['纸B长/cm', 'Sheet B length/cm'], 'S'],
    ],
  );
  return {
    id: `${unit}-MAINT-GEOMETRY-CONSERVATION`,
    unit,
    title: t(
      '同量换写、切拼与实际排版',
      'Conserved quantities, dissection and actual layouts',
    ),
    bridge: 'P56-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), `P56-L0${n}`]),
    ),
    intro: t(
      '六张纸笔过程卡可分多次，一次只做一个编号小问，不计时。先画比例关系、命名对象和单位、写自己的理由，再核全部小问才确认。读题协助与数学提示分开，可口述或用熟悉语言。全部尺寸为假想记录，无需采购、剪纸、倒水或实际测量。',
      'Split SIX paper reasoning cards across sittings, ONE numbered part at a time without a timer. Draw proportional relationships, name objects/units and explain your own reasoning before reviewing EVERY part. Separate reading help from mathematical hints; oral or familiar-language explanations are welcome. All dimensions are fictional; no purchase, cutting, water activity or physical measurement is required.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const geometryConservationRetrieval = {
  P66_GEOMETRY_CONSERVATION: makeSet('P66'),
  J87_GEOMETRY_CONSERVATION: makeSet('J87'),
};
