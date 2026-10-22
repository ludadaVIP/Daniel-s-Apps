import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; correct: number; options: Pair[]; feedback: Pair[] };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['直线与圆锥曲线交点', 'Line–conic intersections'],
    objective: [
      '先判代入式次数，再求并核验全部交点，区分二次相切与降次单交点。',
      'Check the substituted degree before solving and verifying all intersections, distinguishing quadratic tangency from a linear single intersection.',
    ],
    hook: [
      '竖线x=2与y=x²只有一个交点，它一定是切线吗？',
      'The vertical line x=2 meets y=x² once. Must it be tangent?',
    ],
    prerequisites: ['H22-L01', 'H22-L03', 'H22-L06', 'H35-L05'],
    keywords: [
      ['联立消元', 'simultaneous elimination'],
      ['次数检查', 'degree check'],
      ['完整交点集', 'complete intersection set'],
    ],
    lab: 'analytic-intersections',
    hints: [
      [
        '把直线写成P0+t d，d非零，再代入曲线；先看t²系数是否为0。',
        'Write the line as P0+t d with nonzero direction, substitute, and check whether the t² coefficient vanishes.',
      ],
      [
        '二次时用判别式，一次时解线性式，常数矛盾时为空；每个参数还原成点并代两式。',
        'Use a discriminant only for a quadratic, solve a linear reduction directly, and reject a nonzero constant. Recover points and check both original equations.',
      ],
    ],
    items: [
      {
        stem: [
          '求x²+y²=25与y=3的全部交点。',
          'Find all intersections of x²+y²=25 and y=3.',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{(-4,3);(4,3)}',
        },
        step: [
          '代入得x²=16，两个x分别与同一y=3配对，代回圆式均25。',
          'Substitution gives x²=16; pair both x-values with y=3 and verify the circle.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '圆x²+y²=25与y=5有几个不同交点？',
          'How many distinct intersections do x²+y²=25 and y=5 have?',
        ],
        answer: {
          kind: 'number',
          value: '1',
        },
        step: [
          'x²=0给二重根x0，但几何上只有点(0,5)。',
          'x²=0 is a repeated root but gives one geometric point, (0,5).',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求圆x²+y²=25与y=6的全部实交点。',
          'Find all real intersections of x²+y²=25 and y=6.',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{}',
        },
        step: [
          'x²=−11没有实根，故交点集为空。',
          'x²=−11 has no real roots, so the point set is empty.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求y=x²与x=2的全部交点。',
          'Find all intersections of y=x² and x=2.',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{(2,4)}',
        },
        step: [
          '竖直参数(2,t)代入给t=4，是一次式；不是二次重根相切。',
          'Parameter (2,t) gives t=4, a linear equation rather than quadratic repeated-root tangency.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求x²−y²=1与y=x的全部有限交点。',
          'Find all finite intersections of x²−y²=1 and y=x.',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{}',
        },
        step: [
          '代入得0=1，是常数矛盾；不能对消失的二次项硬套Δ。',
          'Substitution gives 0=1, a constant contradiction; a quadratic discriminant does not apply.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '用圆、竖线抛物线和渐近线例子解释判别式的前提，并论证交点完整。',
          'Explain the discriminant prerequisite using a circle, a vertical parabola intersection and an asymptote, proving completeness.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '直线P0+t d须d非零，参数表示整条直线。代入At²+Bt+C=0，A非零才用Δ，重根是一点并在本课非退化曲线上相切。x=2与y=x²代入为一次，唯一点(2,4)不意味着切线；双曲线与y=x降成矛盾，无有限交点。解出全部参数、还原全部点并代回两式，方程等价与直线参数覆盖性保证不漏点。',
            en: 'Use nonzero direction d so P0+t d covers the whole line. Only A≠0 permits the quadratic discriminant; a repeated root gives one tangent point on these nondegenerate conics. The vertical parabola example reduces linearly to (2,4), so uniqueness alone is not tangency. The hyperbola asymptote yields a contradiction and no finite intersection. Solve all parameters, recover all points and check both equations; equivalent substitution and complete line parameterisation establish completeness.',
          },
        },
        step: [
          '直线P0+t d须d非零，参数表示整条直线。代入At²+Bt+C=0，A非零才用Δ，重根是一点并在本课非退化曲线上相切。x=2与y=x²代入为一次，唯一点(2,4)不意味着切线；双曲线与y=x降成矛盾，无有限交点。解出全部参数、还原全部点并代回两式，方程等价与直线参数覆盖性保证不漏点。',
          'Use nonzero direction d so P0+t d covers the whole line. Only A≠0 permits the quadratic discriminant; a repeated root gives one tangent point on these nondegenerate conics. The vertical parabola example reduces linearly to (2,4), so uniqueness alone is not tangency. The hyperbola asymptote yields a contradiction and no finite intersection. Solve all parameters, recover all points and check both equations; equivalent substitution and complete line parameterisation establish completeness.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '只有一个有限交点，能直接推出相切吗？',
        'Does one finite intersection alone prove tangency?',
      ],
      options: [
        ['一定可以', 'Always'],
        ['不能，先核代入次数及几何条件', 'No; inspect the degree and geometry'],
        ['必须没有交点', 'It must mean no intersection'],
      ],
      correct: 1,
      feedback: [
        [
          '竖直线穿过抛物线就给反例。',
          'A vertical line through a parabola is a counterexample.',
        ],
        [
          '二次重根判据有非零二次系数前提。',
          'The repeated-root criterion requires a nonzero quadratic coefficient.',
        ],
        [
          '一个交点与零个交点不同。',
          'One intersection is not zero intersections.',
        ],
      ],
    },
    reason: [
      '为什么不能只提交x=−4,4，而省略交点的y坐标？',
      'Why is listing x=−4,4 alone not a complete intersection answer?',
    ],
    rubric: [
      '交点是有序坐标点，必须还原到同一条原直线；给x根只完成消元。这里两点为(−4,3)、(4,3)，应代回两式并说明全部参数已解。',
      'Intersections are ordered coordinate pairs on the original line. Giving only x-roots stops at elimination. Restore (−4,3) and (4,3), check both equations and account for every parameter root.',
    ],
    prompts: [
      [
        '代入后真的仍是二次吗？',
        'Is the substituted equation still quadratic?',
      ],
      [
        '每个参数根还原成了哪个点？',
        'Which point does each parameter root produce?',
      ],
    ],
    misconception: [
      '一个交点未必相切；重复根不是两个不同点。',
      'One intersection need not be tangency, and a repeated root is not two distinct points.',
    ],
  },
  {
    title: ['轨迹方程', 'Locus equations'],
    objective: [
      '通过中点坐标与反向重构，证明轨迹方程并保留运动范围和排除点。',
      'Use midpoint coordinates and reverse reconstruction to prove a locus, retaining motion restrictions and excluded points.',
    ],
    hook: [
      '中点满足一个圆方程，能直接说明整圆每点都可由原运动得到吗？',
      'If every midpoint satisfies a circle equation, must every point on that circle come from the original motion?',
    ],
    prerequisites: ['H22-L03', 'H05-L04', 'H36-L01'],
    keywords: [
      ['必要性', 'necessity'],
      ['充分性', 'sufficiency'],
      ['运动限制', 'motion restrictions'],
    ],
    lab: 'analytic-locus',
    hints: [
      [
        '固定A=(a,0)，动点P=(u,v)，中点M=(x,y)。先由u=2x−a、v=2y消去动点。',
        'For fixed A=(a,0), moving P=(u,v) and midpoint M=(x,y), reconstruct u=2x−a and v=2y.',
      ],
      [
        '再从任意满足候选方程的M反构P，检查原圆、允许半圆和被排除端点。',
        'Then start with an arbitrary candidate M, reconstruct P and verify the source circle, allowed semicircle and excluded endpoint.',
      ],
    ],
    items: [
      {
        stem: [
          'A=(2,0)，P在u²+v²=16完整圆上，M=(x,y)为AP中点。写M轨迹方程。',
          'Let A=(2,0), P move on u²+v²=16, and M=(x,y) be the midpoint of AP. Give the locus equation.',
        ],
        answer: {
          kind: 'plane-equation',
          value: '(2*x-2)^2+4*y^2=16',
        },
        step: [
          'P=(2x−2,2y)，代回源圆得到方程；完整圆时反构每点都合法。',
          'Substitute P=(2x−2,2y) into the source circle; reverse reconstruction is valid for every point of the full locus.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '同一A，P=(0,4)，求M坐标。',
          'For the same A and P=(0,4), find M.',
        ],
        answer: {
          kind: 'coordinate',
          value: '(1,2)',
        },
        step: [
          '横纵坐标分别取平均。',
          'Average the two x-coordinates and the two y-coordinates.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '轨迹(2x−2)²+4y²=16的圆心是什么？',
          'Find the centre of (2x−2)²+4y²=16.',
        ],
        answer: {
          kind: 'coordinate',
          value: '(1,0)',
        },
        step: ['除4得(x−1)²+y²=4。', 'Divide by four to get (x−1)²+y²=4.'],
        wrong: ['999'],
      },
      {
        stem: [
          '该轨迹圆的半径平方是多少？',
          'What is the squared radius of that locus circle?',
        ],
        answer: {
          kind: 'number',
          value: '4',
        },
        step: [
          '标准式右侧是4，半径2而半径平方4。',
          'The standard equation has right side four: radius two, squared radius four.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '改限源点v≥0，M=(1,−2)是否属于原中点轨迹？写in/out。',
          'Now require source v≥0. Does M=(1,−2) belong to the original midpoint locus? Enter in/out.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'out',
        },
        step: [
          '反构P=(0,−4)，在源圆但违反v≥0。',
          'Reconstruction gives P=(0,−4), on the circle but outside the allowed source motion.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '给中点轨迹的必要与充分证明，并处理上半圆排除P=(4,0)的情形。',
          'Prove both directions for the midpoint locus, then handle the upper semicircle excluding P=(4,0).',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '必要性由u=2x−2、v=2y代圆；充分性从候选M重构P，核圆并确认AP中点确为M。限v≥0等价y≥0，排除P=(4,0)还须排除M=(3,0)。仅写圆方程会多出下半圆与排除点；方程加限制、反向可达性一起才描述完整轨迹。',
            en: 'Necessity follows by substituting u=2x−2,v=2y. For sufficiency reconstruct P, verify the source circle and recover M as the midpoint. Source v≥0 means y≥0; excluding P=(4,0) also excludes M=(3,0). The circle equation alone adds the lower semicircle and forbidden endpoint. The full locus needs the equation, restrictions and reverse attainability.',
          },
        },
        step: [
          '必要性由u=2x−2、v=2y代圆；充分性从候选M重构P，核圆并确认AP中点确为M。限v≥0等价y≥0，排除P=(4,0)还须排除M=(3,0)。仅写圆方程会多出下半圆与排除点；方程加限制、反向可达性一起才描述完整轨迹。',
          'Necessity follows by substituting u=2x−2,v=2y. For sufficiency reconstruct P, verify the source circle and recover M as the midpoint. Source v≥0 means y≥0; excluding P=(4,0) also excludes M=(3,0). The circle equation alone adds the lower semicircle and forbidden endpoint. The full locus needs the equation, restrictions and reverse attainability.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '怎样补足“所有轨迹点满足方程”的逆向证明？',
        'How do we supplement the claim that all locus points satisfy an equation?',
      ],
      options: [
        ['只再画几个点', 'Plot a few more points'],
        ['把等式两边同时平方', 'Square both sides again'],
        [
          '从任意候选点重构合法源点',
          'Reconstruct a legal source from an arbitrary candidate',
        ],
      ],
      correct: 2,
      feedback: [
        [
          '有限样本不能证明整条候选曲线可达。',
          'Finitely many samples do not prove the entire candidate is attainable.',
        ],
        [
          '再平方不自动证明充分性，还可能添点。',
          'Another squaring step does not establish sufficiency and may add points.',
        ],
        [
          '逆向构造并核限制才能排除多余点。',
          'Reverse construction with restrictions rules out extra points.',
        ],
      ],
    },
    reason: [
      '中点候选M=(3,0)满足圆方程，为什么仍可能被排除？',
      'Why might M=(3,0) be excluded although it satisfies the circle equation?',
    ],
    rubric: [
      '它唯一反构为P=(4,0)。若原运动排除此点，中点也不可达；若原运动含此点，它便合法。轨迹必须连同运动说明，不能由方程自行决定端点是否包含。',
      'It reconstructs uniquely to P=(4,0). If the original motion excludes that point, the midpoint is unattainable; otherwise it is valid. The motion specification, not the equation alone, determines endpoint inclusion.',
    ],
    prompts: [
      [
        '你证明的是必要还是也证明了充分？',
        'Have you proved necessity only, or sufficiency too?',
      ],
      ['这个候选点反构后在哪里？', 'Where does this candidate reconstruct?'],
    ],
    misconception: [
      '方程满足不等于原运动可达；限制必须一起保留。',
      'Satisfying an equation does not establish attainability under the original motion.',
    ],
  },
  {
    title: ['解析几何中的参数法', 'Parametric methods in geometry'],
    objective: [
      '核验圆的有理参数表示，并用反参数发现漏点和限制区间对应的弧。',
      'Verify a rational circle parameterisation and use its inverse to identify omitted points and restricted arcs.',
    ],
    hook: [
      '分母1+t²永不为0，能推出参数式覆盖整圆吗？',
      'Since 1+t² never vanishes, does the parameterisation cover the entire circle?',
    ],
    prerequisites: ['H22-L03', 'H35-L01', 'H35-L05'],
    keywords: [
      ['参数表示', 'parameterisation'],
      ['反参数', 'inverse parameter'],
      ['漏点', 'omitted point'],
    ],
    lab: 'analytic-parameter',
    hints: [
      [
        '代x=r(1−t²)/(1+t²)、y=2rt/(1+t²)核x²+y²=r²；分母为正。',
        'Substitute x=r(1−t²)/(1+t²), y=2rt/(1+t²) into x²+y²=r²; its denominator is positive.',
      ],
      [
        '反解t=y/(x+r)，核x=−r时发生什么；参数区间改变时要检查像的弧与端点。',
        'Recover t=y/(x+r) and inspect x=−r. When restricting t, audit the resulting arc and its endpoints.',
      ],
    ],
    items: [
      {
        stem: [
          'r=5、t=1/2，x=5(1−t²)/(1+t²)、y=10t/(1+t²)。求参数点。',
          'For r=5 and t=1/2, use x=5(1−t²)/(1+t²), y=10t/(1+t²). Find the point.',
        ],
        answer: {
          kind: 'coordinate',
          value: '(3,4)',
        },
        step: [
          '分母5/4，x=3，y=4，且9+16=25。',
          'The denominator is 5/4, giving x=3,y=4 and 9+16=25.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '同一半径，全部有限实t漏掉哪个圆点？',
          'For the same radius, which circle point is omitted by all finite real t?',
        ],
        answer: {
          kind: 'coordinate',
          value: '(-5,0)',
        },
        step: [
          '反参数在x+5=0处分母0；x=−5在圆上只能y=0。',
          'The inverse denominator x+5 vanishes there; the circle forces y=0 when x=−5.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '圆点(0,5)的有限反参数t是多少？',
          'What finite inverse parameter t gives circle point (0,5)?',
        ],
        answer: {
          kind: 'number',
          value: '1',
        },
        step: ['t=y/(x+5)=5/5=1。', 't=y/(x+5)=1.'],
        wrong: ['999'],
      },
      {
        stem: [
          '若参数域改[0,1]，t=2是否允许？写in/out。',
          'If the parameter domain is [0,1], is t=2 allowed? Enter in/out.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'out',
        },
        step: [
          '代数式可算，但超出声明参数区间。',
          'The formula can be evaluated, but the parameter is outside the declared interval.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'r=5、t=0时参数点是多少？',
          'For r=5 and t=0, what is the point?',
        ],
        answer: {
          kind: 'coordinate',
          value: '(5,0)',
        },
        step: [
          '直接代入得圆的右端点。',
          'Substitution gives the right endpoint.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '证明参数式所得点都在圆上，并说明除漏点外如何反向恢复；解释t不等于匀速时间。',
          'Prove circle membership and reverse recovery away from the omitted point, explaining why t is not automatically uniform time.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '平方和分子为r²[(1−t²)²+4t²]=r²(1+t²)²，分母非零。任意圆点除E=(−r,0)都可令t=y/(x+r)，代回参数式恢复原点；E无有限t，要覆盖整圆另补。t∈[0,1]对应第一象限含端点弧；等t步长不等弧长，参数不自带时间或匀速意义。',
            en: 'The squared numerator is r²[(1−t²)²+4t²]=r²(1+t²)², proving membership. For any circle point other than E=(−r,0), t=y/(x+r) reconstructs it. E has no finite t and must be added separately for the whole circle. Restricting t to [0,1] gives the first-quadrant arc including endpoints. Equal parameter steps need not give equal arc lengths; a parameter is not automatically time or uniform motion.',
          },
        },
        step: [
          '平方和分子为r²[(1−t²)²+4t²]=r²(1+t²)²，分母非零。任意圆点除E=(−r,0)都可令t=y/(x+r)，代回参数式恢复原点；E无有限t，要覆盖整圆另补。t∈[0,1]对应第一象限含端点弧；等t步长不等弧长，参数不自带时间或匀速意义。',
          'The squared numerator is r²[(1−t²)²+4t²]=r²(1+t²)², proving membership. For any circle point other than E=(−r,0), t=y/(x+r) reconstructs it. E has no finite t and must be added separately for the whole circle. Restricting t to [0,1] gives the first-quadrant arc including endpoints. Equal parameter steps need not give equal arc lengths; a parameter is not automatically time or uniform motion.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '关于有限实t的覆盖范围，哪项正确？',
        'Which statement about coverage by finite real t is correct?',
      ],
      options: [
        [
          '覆盖圆但漏掉(−r,0)，须另补',
          'It covers the circle except (−r,0), which must be added',
        ],
        [
          '分母非零就保证无漏点',
          'A nonzero denominator guarantees no omission',
        ],
        ['只要代几个t即可证明覆盖', 'Several sample t-values prove coverage'],
      ],
      correct: 0,
      feedback: [
        [
          '用反参数检查覆盖，比只核代入更完整。',
          'Inverse recovery checks coverage beyond direct substitution.',
        ],
        [
          '非零分母保证可算，不保证满射。',
          'A nonzero denominator gives evaluability, not surjectivity.',
        ],
        ['有限样本不能覆盖性证明。', 'Finite samples cannot prove coverage.'],
      ],
    },
    reason: [
      't=0、1、2等步长，是否应画成同一时间间隔下的匀速点？用弦长反驳。',
      'Should t=0,1,2 be treated as equally timed constant-speed samples? Use chord lengths to challenge this.',
    ],
    rubric: [
      'r5时三点为(5,0)、(0,5)、(−3,4)，相邻弦长分别5√2与√10，显然不同；对应圆弧也不同。参数只给点的编码，若要物理时间或匀速，须额外规定关系并核速度。',
      'For radius five the points are (5,0),(0,5),(−3,4). Consecutive chords have lengths 5√2 and √10, so their minor arcs differ. The parameter labels points; physical time or constant speed requires another stated relation and a speed check.',
    ],
    prompts: [
      [
        '代入只证落在圆上，覆盖怎么证？',
        'Substitution proves membership; how do you prove coverage?',
      ],
      [
        '反参数在哪个点不能用？',
        'At which point does the inverse parameter fail?',
      ],
    ],
    misconception: [
      '每个参数有点，不等于每个圆点有参数；参数不是自动匀速。',
      'Every parameter yielding a point does not imply every circle point is attained; parameters are not automatically uniform speed.',
    ],
  },
  {
    title: ['向量与解析方法互证', 'Connecting vector and analytic proofs'],
    objective: [
      '把非零向量直角条件与圆方程双向核对，发现代数条件遗漏的端点。',
      'Check the nonzero-vector right-angle condition against a circle equation in both directions, identifying excluded endpoints.',
    ],
    hook: [
      '零向量与任何向量点积都为0，能说它们夹角总是90°吗？',
      'A zero vector has dot product zero with every vector. Is their angle always 90°?',
    ],
    prerequisites: ['H05-L05', 'H05-L06', 'H22-L03', 'H36-L02'],
    keywords: [
      ['数量积条件', 'dot-product condition'],
      ['非零向量', 'nonzero vectors'],
      ['互证', 'cross-verification'],
    ],
    lab: 'analytic-vectors',
    hints: [
      [
        'A=(−a,0)、B=(a,0)、P=(x,y)，展开(A−P)·(B−P)。',
        'For A=(−a,0),B=(a,0),P=(x,y), expand (A−P)·(B−P).',
      ],
      [
        '点积0还需两向量非零；反向从圆方程出发，排除A/B后才可得到直角。',
        'A zero dot product requires both vectors nonzero for a right angle. From the circle equation, exclude A/B before recovering the angle.',
      ],
    ],
    items: [
      {
        stem: [
          'A=(−3,0)、B=(3,0)、P=(0,3)，求(A−P)·(B−P)。',
          'For A=(−3,0),B=(3,0),P=(0,3), find (A−P)·(B−P).',
        ],
        answer: {
          kind: 'number',
          value: '0',
        },
        step: [
          '(−3,−3)·(3,−3)=−9+9=0，两向量都非零。',
          'The dot product is −9+9=0 and both vectors are nonzero.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '同一A/B，P=A时角APB是什么类型？写undefined或相应英文角类型。',
          'For the same A/B, when P=A how is angle APB classified? Enter undefined or the appropriate angle code.',
        ],
        answer: {
          kind: 'vector-code',
          value: 'undefined',
        },
        step: [
          '一条向量为零，角度无定义，不能由点积0推出直角。',
          'One vector is zero, so the angle is undefined despite zero dot product.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '角APB为直角的轨迹中，圆x²+y²=9须排除哪些点？',
          'Which points must be excluded from x²+y²=9 for the locus where angle APB is right?',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{(-3,0);(3,0)}',
        },
        step: [
          '固定端点A/B都使一条向量为零。',
          'Each fixed endpoint makes one of the vectors zero.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'A=(−3,0)、B=(3,0)，将点积0写成P=(x,y)的方程。',
          'For A=(−3,0),B=(3,0), write the zero-dot-product equation for P=(x,y).',
        ],
        answer: {
          kind: 'plane-equation',
          value: 'x^2+y^2=9',
        },
        step: [
          '展开得x²+y²−9=0，端点排除条件另保留。',
          'Expansion gives x²+y²−9=0; keep endpoint exclusions separately.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          'P=(0,0)时角APB类型是什么？',
          'When P=(0,0), how is angle APB classified?',
        ],
        answer: {
          kind: 'vector-code',
          value: 'straight',
        },
        step: [
          '非零反向共线向量，夹角180°，不是一般钝角。',
          'The nonzero vectors are oppositely collinear, giving a straight angle of 180°.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '用点积展开与圆周角两种方式说明直角轨迹，并审查A/B反例。',
          'Explain the right-angle locus using dot-product expansion and the angle-in-a-semicircle theorem, auditing the endpoints.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '展开点积为x²+y²−a²，非零向量点积0与直角等价；故原轨迹点在圆上。反之圆点除A/B使两向量非零且点积0，所以确为直角。几何上以AB为直径的圆周角为直角，逆向也需点不等于端点。A/B虽满足方程和点积0，角却无定义；必须把排除两点作为结论一部分。',
            en: 'The dot product expands to x²+y²−a². For nonzero vectors, zero dot product is equivalent to a right angle, proving both directions between the original locus and circle excluding A/B. Geometrically, an angle subtending diameter AB is right, with endpoints excluded. At A/B the equation and dot product still hold but the angle is undefined; retain those exclusions in the final claim.',
          },
        },
        step: [
          '展开点积为x²+y²−a²，非零向量点积0与直角等价；故原轨迹点在圆上。反之圆点除A/B使两向量非零且点积0，所以确为直角。几何上以AB为直径的圆周角为直角，逆向也需点不等于端点。A/B虽满足方程和点积0，角却无定义；必须把排除两点作为结论一部分。',
          'The dot product expands to x²+y²−a². For nonzero vectors, zero dot product is equivalent to a right angle, proving both directions between the original locus and circle excluding A/B. Geometrically, an angle subtending diameter AB is right, with endpoints excluded. At A/B the equation and dot product still hold but the angle is undefined; retain those exclusions in the final claim.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '关于“点积为0推出直角”，正确前提是什么？',
        'What condition is needed to infer a right angle from a zero dot product?',
      ],
      options: [
        ['只需坐标为整数', 'Only integer coordinates'],
        ['两个向量都非零', 'Both vectors are nonzero'],
        ['向量长度必须相等', 'The vector lengths must agree'],
      ],
      correct: 1,
      feedback: [
        [
          '实数坐标也可用，整数不是前提。',
          'Real coordinates are allowed; integrality is irrelevant.',
        ],
        [
          '夹角公式分母含两向量长度，不能为0。',
          'The angle formula divides by both vector lengths.',
        ],
        ['直角并不要求等长。', 'A right angle does not require equal lengths.'],
      ],
    },
    reason: [
      'P在圆内且不与A/B共线时，怎样用点积与图核夹角？圆心情形为何要分开？',
      'For a non-collinear interior P, how can the dot product classify the angle, and why treat the centre separately?',
    ],
    rubric: [
      '圆内x²+y²<a²，点积负；若非共线，角为钝角。圆心在AB线上，向量反向而非零，角为180°的平角；不能把所有负点积都只写一般钝角。',
      'Inside the circle the dot product is negative, giving an obtuse angle when non-collinear. At the centre the nonzero vectors are opposite, giving a straight angle of 180°. Negative dot product alone does not exclude this collinear boundary case.',
    ],
    prompts: [
      ['夹角的两条向量是否都非零？', 'Are both angle vectors nonzero?'],
      [
        '代数方程是否多包含了端点？',
        'Does the algebraic equation include extra endpoints?',
      ],
    ],
    misconception: [
      '点积0须核非零；圆内负点积还要分共线平角。',
      'Zero dot product requires a nonzero-vector check; a negative dot product can include a straight collinear angle.',
    ],
  },
  {
    title: ['圆锥曲线综合建模', 'Conic modelling problems'],
    objective: [
      '把屋顶净高条件转成受限椭圆截面的可行横坐标与完整宽度，并说明模型限制。',
      'Translate clearance into feasible horizontal coordinates and full width for a restricted elliptical roof section, explaining model limits.',
    ],
    hook: [
      '椭圆截面方程同时有上下两半，下面的点也能当作屋顶吗？',
      'An ellipse equation includes upper and lower halves. May a lower-half point count as part of the roof?',
    ],
    prerequisites: ['H22-L05', 'H36-L01', 'H36-L02', 'H35-L05'],
    keywords: [
      ['受限模型', 'restricted model'],
      ['完整宽度', 'full width'],
      ['可行边界', 'feasibility boundary'],
    ],
    lab: 'analytic-modelling',
    hints: [
      [
        '先说明原点、米单位和上半截面y≥0，再把净高H代入或写屋顶≥H。',
        'State the origin, metre units and upper section y≥0 before substituting clearance H or imposing roof height≥H.',
      ],
      [
        '两侧横坐标差是完整宽度，半轴不是全宽；顶点单点宽0，超顶高是无可行点。',
        'Subtract the two x-coordinates for full width, not a semiaxis. The apex gives one point of width zero; above it gives no feasible point.',
      ],
    ],
    items: [
      {
        stem: [
          '屋顶x²/25+y²/9=1、y≥0，坐标单位米。净高H=9/5米时最大完整水平宽度是多少米？',
          'A roof is x²/25+y²/9=1 with y≥0, in metres. At clearance H=9/5 metres, what is the full available horizontal width in metres?',
        ],
        answer: {
          kind: 'number',
          value: '8',
        },
        step: [
          '代入得x²=16，横坐标−4至4，完整宽4−(−4)=8米。',
          'Substitution gives x²=16; width is 4−(−4)=8 metres.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '同一屋顶，净高H=12/5米时完整宽度多少米？',
          'For the same roof, what is the full width at H=12/5 metres?',
        ],
        answer: {
          kind: 'number',
          value: '6',
        },
        step: [
          'x²=9，宽为3−(−3)=6米，净高上升可用宽度变小。',
          'x²=9 gives width six metres; increasing clearance reduces available width.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '求净高H=9/5处与原上半屋顶全部交点。',
          'Give all intersections of clearance H=9/5 with the original upper roof.',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{(-4,9/5);(4,9/5)}',
        },
        step: [
          '保留原y≥0和米单位，两侧都要给出。',
          'Retain y≥0 and metre units, reporting both sides.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '净高H=3米时，满足屋顶高度至少H的横坐标集合是什么？',
          'At clearance H=3 metres, which x-values have roof height at least H?',
        ],
        answer: {
          kind: 'real-union',
          value: '[0,0]',
        },
        step: [
          '只有顶点x0，集合为{0}或[0,0]，宽0不是空集。',
          'Only the apex x=0 qualifies. The singleton [0,0] has zero width but is not empty.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '净高H=4米时，原屋顶与该水平线的交点集是什么？',
          'At H=4 metres, what is the set of roof intersections with that horizontal line?',
        ],
        answer: {
          kind: 'plane-point-set',
          value: '{}',
        },
        step: [
          '净高超过半短轴3米，无可行点，不能把它当作顶点单点。',
          'Clearance exceeds the three-metre vertical semiaxis, giving no feasible point rather than an apex singleton.',
        ],
        wrong: ['999'],
      },
      {
        stem: [
          '写一份椭圆屋顶净高报告，给方程与限制、两种高度的宽度、边界情形和模型局限。',
          'Write an elliptical-roof clearance report with equation, restrictions, widths at two heights, boundary cases and limitations.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '取水平对称中心地面为原点，x/y单位米，屋顶为x²/25+y²/9=1且y≥0。H9/5给x∈[−4,4]宽8米，H12/5给[−3,3]宽6米；矩形通道在该宽内时两端最接近屋顶，须整个水平区间都符合净高。H3只顶点宽0，H4无可行点；下半椭圆不属屋顶。模型假定零厚度、精确截面与水平地面，几何可行不验证荷载、材料或施工。',
            en: 'Place the origin at the ground-level symmetry centre, with metre coordinates. The roof is x²/25+y²/9=1 and y≥0. H=9/5 gives x∈[−4,4] and width eight metres; H=12/5 gives [−3,3] and width six. For a rectangular passage, the corner positions are limiting and the entire interval must meet clearance. At H=3 there is only the zero-width apex; H=4 is infeasible. The lower ellipse is excluded. A zero-thickness exact section and level ground are assumptions; geometric feasibility does not verify loads, materials or construction.',
          },
        },
        step: [
          '取水平对称中心地面为原点，x/y单位米，屋顶为x²/25+y²/9=1且y≥0。H9/5给x∈[−4,4]宽8米，H12/5给[−3,3]宽6米；矩形通道在该宽内时两端最接近屋顶，须整个水平区间都符合净高。H3只顶点宽0，H4无可行点；下半椭圆不属屋顶。模型假定零厚度、精确截面与水平地面，几何可行不验证荷载、材料或施工。',
          'Place the origin at the ground-level symmetry centre, with metre coordinates. The roof is x²/25+y²/9=1 and y≥0. H=9/5 gives x∈[−4,4] and width eight metres; H=12/5 gives [−3,3] and width six. For a rectangular passage, the corner positions are limiting and the entire interval must meet clearance. At H=3 there is only the zero-width apex; H=4 is infeasible. The lower ellipse is excluded. A zero-thickness exact section and level ground are assumptions; geometric feasibility does not verify loads, materials or construction.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: ['H=3与H=4时的区别是什么？', 'What differs between H=3 and H=4?'],
      options: [
        ['都是空集', 'Both are empty'],
        ['都是宽度0的实际通道', 'Both are actual zero-width passages'],
        [
          '前者单点宽0，后者无可行点',
          'The first is a zero-width singleton; the second is infeasible',
        ],
      ],
      correct: 2,
      feedback: [
        ['顶点仍是合法屋顶点。', 'The apex remains a valid roof point.'],
        [
          '超过顶高没有点，不是一个宽0通道。',
          'Above the apex there is no point, not a zero-width passage.',
        ],
        [
          '先区分集合是否为空，再谈宽度与实际通道。',
          'Distinguish empty from singleton before discussing width or a physical passage.',
        ],
      ],
    },
    reason: [
      '为何只给椭圆方程还不足以回答现实屋顶净高问题？',
      'Why is the ellipse equation alone insufficient for a roof-clearance question?',
    ],
    rubric: [
      '还需坐标原点、单位、地面、上半截面y≥0、净高定义与通道位置；完整宽度与半宽也不同。方程包含下半椭圆，有限图窗不能替代原范围。数学截面只是一个模型，需说明假设与未检验的实际条件。',
      'Specify origin, units, floor, upper section y≥0, the clearance definition and passage position. Distinguish full width from half-width. The equation includes a lower half and a finite window does not define the physical domain. State assumptions and untested real conditions.',
    ],
    prompts: [
      ['你算的是半宽还是完整宽？', 'Have you found half-width or full width?'],
      [
        '这个点在椭圆上，也在原屋顶范围内吗？',
        'Is this point on the ellipse and within the actual roof section?',
      ],
    ],
    misconception: [
      '半轴不是全宽；下半椭圆不属屋顶；单点宽0不等于无可行点。',
      'A semiaxis is not full width; the lower ellipse is not the roof; zero-width singleton is not infeasibility.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `analytic-geometry-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(id, T(item.stem), skill, item.answer.rubric, hints.map(T));
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    hints.map(T),
    [T(hints[0]!), T(item.step)],
    { accepted: [value], rejected: item.wrong },
  );
  q.answer = item.answer;
  return q;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `analytic-geometry-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h36Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H36-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H12',
    unit: 'H36',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`analytic-geometry-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `analytic-geometry-${i + 1}`,
        T(s.rubric),
        s.hints.map(T),
      ),
    ],
    exit: question(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});

export function h36ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H36-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H36 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = I(
      [
        `求圆(x−${a})²+(y−${b})²=25与y=${b + 3}的全部交点。`,
        `Find all intersections of (x−${a})²+(y−${b})²=25 with y=${b + 3}.`,
      ],
      {
        kind: 'plane-point-set',
        value: `{(${a - 4},${b + 3});(${a + 4},${b + 3})}`,
      },
      [
        '平移回圆心坐标后得水平偏移±4，再还原两个点。',
        'Relative to the centre, the horizontal offsets are ±4; restore both points.',
      ],
    );
  else if (i === 1)
    item = I(
      [
        `固定A=(${a},0)，源圆u²+v²=${4 * b * b}完整运动，M=(x,y)为中点。写轨迹方程。`,
        `Fix A=(${a},0), let P traverse u²+v²=${4 * b * b}, and let M=(x,y) be its midpoint with A. Give the locus equation.`,
      ],
      { kind: 'plane-equation', value: `(2*x-${a})^2+4*y^2=${4 * b * b}` },
      [
        '由P=(2x−a,2y)代回源圆，再核反向重构。',
        'Substitute P=(2x−a,2y), then check reverse reconstruction.',
      ],
    );
  else if (i === 2) {
    const r = a + 1,
      den = 4 + b * b;
    item = I(
      [
        `圆半径r=${r}，参数t=${b}/2。用x=r(1−t²)/(1+t²)、y=2rt/(1+t²)，求点坐标。`,
        `For radius r=${r} and t=${b}/2, use x=r(1−t²)/(1+t²), y=2rt/(1+t²) to find the point.`,
      ],
      {
        kind: 'coordinate',
        value: `(${r * (4 - b * b)}/${den},${4 * r * b}/${den})`,
      },
      [
        '把分子分母同乘4，保留精确分数。',
        'Multiply numerator and denominator by four and keep exact fractions.',
      ],
    );
  } else if (i === 3)
    item = I(
      [
        `A=(−${a},0)、B=(${a},0)、P=(0,${b})，求(A−P)·(B−P)。`,
        `For A=(−${a},0), B=(${a},0), P=(0,${b}), find (A−P)·(B−P).`,
      ],
      { kind: 'number', value: String(b * b - a * a) },
      [
        '展开为x²+y²−a²，仍须另核非零条件才解释角度。',
        'Expand to x²+y²−a²; angle interpretation still needs nonzero vectors.',
      ],
    );
  else {
    const A = 5 * (a + 2),
      B = 3 * b;
    item = I(
      [
        `上半屋顶x²/${A * A}+y²/${B * B}=1、y≥0，单位米。净高为${3 * B}/5米，求完整可用宽度。`,
        `The upper roof x²/${A * A}+y²/${B * B}=1, y≥0, uses metres. Find its full available width at clearance ${3 * B}/5 metres.`,
      ],
      { kind: 'number', value: String(8 * (a + 2)) },
      [
        '净高为竖半轴3/5，半宽为水平半轴4/5，再乘2。',
        'The height ratio is 3/5, giving half-width 4/5 of the horizontal semiaxis; double it.',
      ],
    );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h36CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H36-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H36-CHECK-Q6', 1, specs[1]!.items[5]!),
  question('H36-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H36-CHECK-Q8', 4, specs[4]!.items[5]!),
];
