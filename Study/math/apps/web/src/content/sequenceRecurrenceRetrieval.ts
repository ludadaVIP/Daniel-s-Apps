import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H31' | 'H38') => {
  const first = unit === 'H31',
    id = (i: number) => `${unit}-MAINT-SEQUENCE-Q${i}`;
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
        '写序号范围、完整规则与非零条件；有限观察用于发现，不代替一般推导。模型中的时间顺序要画清。',
        'State index domains,complete rules and nonzero premises. Finite observations suggest patterns but do not replace general derivations. Draw the timing order in a model.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-SEQUENCE`,
    unit,
    bridge: 'H07-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((i) => [id(i), `H07-L0${i}`]),
    ),
    title: t(
      '优化与项目之后，再核数列和时序',
      'After optimisation and projects,recheck sequences and timing',
    ),
    intro: t(
      '六题分次，每次一题，推导和时间线可分开完成。全部人工核验，不计时；储蓄数值为理想虚构数学模型，无费用或逐期舍入。',
      'Choose one of six tasks per sitting,splitting derivation and timelines if useful. Every argument is human-reviewed without a timer. Savings values are fictional ideal mathematical models,with no fees or periodic rounding.',
    ),
    questions: [
      task(
        1,
        'sequence-index-rule-evidence',
        `仅观测正整数序号n=1,2,3的项${first ? '2,5,8' : '1,4,9'}。给两个不同完整公式都吻合它们，但第四项不同；可从${first ? '3n−1' : 'n²'}及加上(n−1)(n−2)(n−3)开始。解释为何“下一项条件不足”不等于判常见猜测错。若题设数列只定义n=1,2,…，能因公式可代0就把a₀当原数列项吗？`,
        `Only terms at positive integer indices1,2,3 are observed:${first ? '2,5,8' : '1,4,9'}. Give two complete rules matching all three but with different fourth terms; start from${first ? '3n−1' : 'n²'} and add(n−1)(n−2)(n−3). Why does non-identification not make the familiar guess wrong? If the declared sequence domain starts at one,does substituting zero into a formula make a₀ part of that sequence?`,
        first
          ? 'aₙ=3n−1和bₙ=3n−1+(n−1)(n−2)(n−3)，均定义所有正整数n。前三序号附加项0，同为2,5,8；n4时附加6，a₄11、b₄17。两个不同完整规则已证有限前缀不唯一，不是证11不可能。若另明确等差才可选第一种；未给机制就保留条件不足。n0在原序号域外，公式可延伸不等于题设已定义a₀。'
          : 'aₙ=n²与bₙ=n²+(n−1)(n−2)(n−3)在所有正整数可算；前三项1,4,9，第四分别16和22。额外项在三个观测序号各0，n4为6，是明确多模型依据。16可以是正确规则的下一项，只是原有限观测不足以唯一选择；需要另给平方规则或机制。a₀不在原正整数域，代数延伸须另声明，不能把它当既有观测。',
        first
          ? 'Rules aₙ=3n−1 and bₙ=3n−1+(n−1)(n−2)(n−3) are defined for every positive integer n. The added term vanishes at1,2,3,but equals six at4,so fourth terms are eleven and seventeen. This proves non-identification,not that eleven is impossible. A stipulated arithmetic rule would add the needed premise. Index zero is outside the declared sequence domain; an algebraic extension is a separately declared sequence.'
          : 'Rules aₙ=n² and bₙ=n²+(n−1)(n−2)(n−3) match1,4,9,but give fourth terms sixteen and twenty-two. The added product is zero at each observed index and six at four. Sixteen remains possible;the finite observations do not identify it uniquely without an extra rule. Substituting zero into a formula does not place a₀ inside the original positive-integer domain.',
        '让附加项在每个已知序号为0，再找一个后续序号不为0；域另行核。',
        'Make an added term vanish at every observed index but not at a later one. Check the domain separately.',
      ),
      task(
        2,
        'arithmetic-index-gaps',
        `已明确等差数列，${first ? 'a₂=5,a₇=20' : 'a₃=8,a₉=−4'}。从序号间隔求d及a₁，再求${first ? 'a₁₀' : 'a₆'}，写一般恢复理由。另只有${first ? 'a₂=5' : 'a₃=8'}写了两遍，给两个不同公差的完整等差数列都符合；为什么不能算0/0就说d0？`,
        `An ARITHMETIC sequence has${first ? 'a₂=5,a₇=20' : 'a₃=8,a₉=−4'}. Recover d and a₁ from the index gap,then find${first ? 'a₁₀' : 'a₆'},with a general reason. If only${first ? 'a₂=5' : 'a₃=8'} is written twice,give two complete arithmetic sequences with different differences. Why cannot0/0 justify d=0?`,
        first
          ? 'aⱼ−aᵢ=(j−i)d，因j≠i可除序号差。d=(20−5)/(7−2)=3，a₁=5−3=2，a₁₀=2+9×3=29。只重复a₂5，aₙ=5的d0和bₙ=n+3的d1都符合，不能唯一；重复同序号没有新增间隔条件，0/0无定义，不是证明d0。'
          : '两项差=(序号差)d，仅不同序号可除。d=(−4−8)/(9−3)=−2，a₁=8−2(−2)=12，a₆=12+5(−2)=2。只重复a₃8时，aₙ=8的d0和bₙ=n+5的d1都符合；同一条件两遍不定公差，不能把0/0解释成0。',
        first
          ? 'Generally aⱼ−aᵢ=(j−i)d,and division requires j≠i. Thus d=(20−5)/(7−2)=3,a₁=2,and a₁₀=29. Repeating a₂=5 admits both constant aₙ=5 with d0 and bₙ=n+3 with d1. The repeated index supplies no new gap;0/0 is undefined,not evidence for d0.'
          : 'The term difference is the index gap times d,with distinct indices required for division. Hence d=(−4−8)/(9−3)=−2,a₁=12,a₆=2. Repeating a₃=8 admits aₙ=8 with d0 and bₙ=n+5 with d1. Two copies of one condition do not identify d,and0/0 does not mean zero.',
        '先数两个序号之间有几个等差步；重复条件不是新方程。',
        'Count the equal-difference steps between indices. A repeated condition is not a new independent equation.',
      ),
      task(
        3,
        'arithmetic-sum-two-copies',
        `给a₁=${first ? 2 : 12}、d=${first ? 3 : -2}，n为正整数。把前n项正序与倒序各写一份，推导Sₙ；求${first ? 'S₁₀、S₉' : 'S₈、S₇'}并相减恢复末项。为什么Sₙ/n通常不是aₙ？定义S₀后说明n1时差式仍成立。`,
        `Let a₁=${first ? 2 : 12},d=${first ? 3 : -2},with positive integer n. Write the first n terms forwards and backwards to derive Sₙ. Find${first ? 'S₁₀,S₉' : 'S₈,S₇'} and subtract to recover the last term. Why is Sₙ/n usually not aₙ? Define S₀ and check the difference rule at n1.`,
        first
          ? '正倒两份逐列配对，各和a₁+aₙ=2a₁+(n−1)d，共n列，故2Sₙ=n(2a₁+(n−1)d)。S₁₀=10(4+27)/2=155，S₉=9(4+24)/2=126，a₁₀=155−126=29。S₁₀/10=31/2是平均项，不是末项29。一般Sₙ−Sₙ₋₁前n−1项抵消留下aₙ；定义空和S₀0，n1给S₁−S₀=a₁2，边界一致。'
          : '倒序相加后每列a₁+aₙ，n列给2Sₙ=n(2a₁+(n−1)d)，不是直接把一份求和翻倍。S₈=8(24−14)/2=40，S₇=7(24−12)/2=42，a₈=40−42=−2；负末项使部分和可减少，并非计算必错。S₈/8=5是平均，不是−2。前项抵消给一般aₙ=Sₙ−Sₙ₋₁；空和S₀0使n1也给a₁12。',
        first
          ? 'Pairing forward and reverse copies gives n columns each equal to a₁+aₙ=2a₁+(n−1)d,so2Sₙ=n(2a₁+(n−1)d). S₁₀=155,S₉=126,and their difference recovers a₁₀=29. S₁₀/10=31/2 is the average,not the last term. In general the first n−1 terms cancel in Sₙ−Sₙ₋₁. Defining the empty sum S₀=0 preserves this at n1,giving a₁=2.'
          : 'Pairing forward and reverse copies gives n equal columns a₁+aₙ,so2Sₙ=n(2a₁+(n−1)d). S₈=40,S₇=42,their difference a₈=−2. A negative last term may reduce a partial sum. S₈/8=5 is an average,not−2. Cancellation gives aₙ=Sₙ−Sₙ₋₁ generally; empty sum S₀=0 makes it valid at n1 with a₁=12.',
        '每列配的是两份不同顺序的和；从相邻部分和恢复项时保留负数与空和。',
        'Pair two ordered copies. Preserve negative terms and the empty sum when recovering a term from consecutive partial sums.',
      ),
      task(
        4,
        'geometric-ratio-sign-zero',
        `本课等比定义要求每项非零、公比非零。给a₁=${first ? 8 : -3}、q=${first ? '−1/2' : '−2'}，写前五项、逐个相邻商与通项，说明符号交替和n−1指数。另从a₁=${first ? 8 : -3}每次乘0的递推能算吗，为什么不属于此等比定义？全零序列能用0/0得到公比1吗？`,
        `The course definition of geometric sequence requires nonzero terms and a nonzero common ratio. With a₁=${first ? 8 : -3},q=${first ? '−1/2' : '−2'},give the first five terms,every adjacent ratio and the nth term. Explain alternating signs and exponent n−1. Is the recurrence multiplying${first ? 8 : -3} by zero computable,and why is it outside this geometric definition? May0/0 assign ratio one to an all-zero sequence?`,
        first
          ? '前五项8,−4,2,−1,1/2，四个相邻商全−1/2，通项8(−1/2)^(n−1)，n从1起所以首项乘倍率0次。非零负公比每步反向，符号依n−1奇偶，不能只取绝对值漏号。乘0递推可得8,0,0,…，但后续商0/0无定义，不满足每项非零/固定非零公比的本课约定。全零序列也不能用未定义商声称公比1；递推可算与被定义为等比是两命题。'
          : '前五项−3,6,−12,24,−48，相邻商全−2，通项−3(−2)^(n−1)。首项n1对应指数0，负倍率使符号交替，长度倍率2不保符号。乘0递推仍唯一给−3,0,0,…，但后续0/0无定义，按本课非零项与非零公比要求不是等比。全零的商未定义，不能据此选1或任意唯一公比；声明递推模型与相邻商定义要区分。',
        first
          ? 'Terms8,−4,2,−1,1/2 have four adjacent ratios−1/2. The rule is8(−1/2)^(n−1):index one has zero multiplications. Negative ratio reverses sign each step,so parity of n−1 matters. Multiplying by zero is a valid recurrence giving8,0,0,…,but later ratios0/0 are undefined and violate this course’s nonzero-term/nonzero-ratio definition. An all-zero sequence cannot obtain ratio one from0/0. Computable recurrence and geometric classification are different claims.'
          : 'Terms−3,6,−12,24,−48 have ratio−2 and rule−3(−2)^(n−1). Index one uses exponent zero; a negative ratio alternates signs,which an absolute scale factor alone loses. Zero-multiplier recurrence is computable as−3,0,0,…,but later0/0 ratios fail the course’s nonzero-term/nonzero-ratio definition. The all-zero case cannot identify a ratio from an undefined quotient. Preserve the declared convention.',
        '算商前查分母，写通项前查首项序号；能运行的递推不一定属于所声明的数列类别。',
        'Check denominators before ratios and the first index before the nth-term exponent. A computable recurrence need not belong to the declared sequence class.',
      ),
      task(
        5,
        'finite-geometric-tail-and-unit-ratio',
        `给有限n项和Sₙ=a₁+a₁q+…+a₁q^(n−1)。写Sₙ和qSₙ错位相减，保留最后尾项，推q≠1时通式。取a₁=${first ? 3 : -2},q=${first ? '1/2' : '−1/2'},n=${first ? 4 : 5}求精确和；与直接丢尾项给a₁/(1−q)比较差多少。若q改1，如何回原和求值而不除0？`,
        `For finite Sₙ=a₁+a₁q+…+a₁q^(n−1),subtract shifted qSₙ from Sₙ,retaining the final tail,and derive the formula for q≠1. Evaluate exactly for a₁=${first ? 3 : -2},q=${first ? '1/2' : '−1/2'},n=${first ? 4 : 5}. How far is it from a₁/(1−q) obtained by discarding the tail? If q becomes one,return to the original sum instead of dividing by zero.`,
        first
          ? '两份中间项逐项消去，(1−q)Sₙ=a₁−a₁qⁿ，故Sₙ=a₁(1−qⁿ)/(1−q)，q≠1。本题3+3/2+3/4+3/8=45/8；尾项a₁q⁴=3/16，除1−q后与丢尾候选6相差3/8，有限和小于6。不能把未论证的无穷过程代替四项和。q1时原四项均3，和12，一般na₁，不用分母0；n0若定义空和则为0。'
          : '错位消中间项得(1−q)Sₙ=a₁−a₁qⁿ，保尾项才可除非零1−q。五项−2+1−1/2+1/4−1/8=−11/8；a₁q⁵=1/16，除1−q=3/2给1/24。丢尾候选−4/3比有限和大1/24，并非尾很小就能当相等。q1时五项均−2，原和−10，一般na₁；空和另定义S₀0，不以0/0计算。',
        first
          ? 'Shifted subtraction cancels middle terms: (1−q)Sₙ=a₁−a₁qⁿ,hence Sₙ=a₁(1−qⁿ)/(1−q) for q≠1. The four terms sum to45/8. The retained tail a₁q⁴=3/16,divided by1−q,shows the discarded-tail candidate six exceeds the finite sum by3/8. An unproved infinite process cannot replace four terms. For q1,the original four terms are all three,so the sum is twelve,generally na₁. A separately defined empty sum S₀ is zero.'
          : 'Shifted subtraction gives(1−q)Sₙ=a₁−a₁qⁿ;the tail remains before division by nonzero1−q. The five terms sum to−11/8. Here a₁q⁵=1/16,and division by3/2 gives1/24:the discarded-tail candidate−4/3 exceeds the finite sum by1/24. A small tail is not an exact zero. With q1,the original five terms are all−2,giving−10,generally na₁. Define S₀=0 separately rather than using0/0.',
        '将两行项对齐，最后一项从哪一行留下、符号是什么；q1分支回原和。',
        'Align the two rows and track which final term survives with which sign. For q1,return to the original sum.',
      ),
      task(
        6,
        'savings-affine-recurrence-and-timing',
        `理想虚构模型B₀=${first ? 80 : 60}NZD、每期倍率q=${first ? '3/2' : '1/2'}、固定存入c=${first ? 4 : 6}NZD，不舍入无费用。先按“增长后期末存”画两期时间线，列B₁/B₂和递推；再改“期初存后增长”从同一初值求C₁/C₂。对一般n分别分离初始余额和每笔存款的剩余增长期数，写有限和；解释原B是否等比，另核q1及n0边界。`,
        `A fictional ideal model has B₀=${first ? 80 : 60}NZD,period multiplier q=${first ? '3/2' : '1/2'} and fixed deposit c=${first ? 4 : 6}NZD,without rounding or fees. First draw two periods with growth followed by an END deposit,giving B₁,B₂ and the recurrence. Then switch to a START deposit followed by growth,from the same initial balance,giving C₁,C₂. For general n,separate the initial balance from each deposit’s remaining growth periods in a finite sum. Is this B sequence geometric? Check q1 and n0 separately.`,
        first
          ? '期末Bₖ=qBₖ₋₁+c：80×3/2+4=124，再124×3/2+4=190。期初Cₖ=q(Cₖ₋₁+c)：(80+4)×3/2=126，再(126+4)×3/2=195，先后不能换。一般期末Bₙ=80qⁿ+4Σ(j=0..n−1)qʲ，最后一笔0期、第一笔n−1期；期初Cₙ=80qⁿ+4Σ(j=1..n)qʲ，每笔多一次增长。B₁/B₀=31/20、B₂/B₁=95/62不同，所以这些余额不是公比q的等比，尽管每笔贡献可按等比和相加。q1两时序同80+4n；n0空存款和，仍80，单位NZD。'
          : '期末Bₖ=qBₖ₋₁+c给60×1/2+6=36，再36×1/2+6=24；期初Cₖ=q(Cₖ₋₁+c)给33，再(33+6)/2=39/2。一般期末Bₙ=60qⁿ+6Σ(j=0..n−1)qʲ，期初Cₙ=60qⁿ+6Σ(j=1..n)qʲ；期初每笔比期末多经一次倍率，即使倍率小于1也须保时序。B₁/B₀=3/5、B₂/B₁=2/3不等，所以给定余额不等比，不能把每期乘1/2忽略新增6。q1两者60+6n；n0初始60、空和0，单位NZD，无舍入假设不擅加。',
        first
          ? 'End deposits give Bₖ=qBₖ₋₁+c:balances124,190. Start deposits give Cₖ=q(Cₖ₋₁+c):126,195. The order matters. Generally Bₙ=80qⁿ+4Σ(j=0..n−1)qʲ:the last deposit grows zero times and the first n−1 times. Cₙ=80qⁿ+4Σ(j=1..n)qʲ gives each deposit one extra growth. Ratios B₁/B₀=31/20 and B₂/B₁=95/62 differ,so these balances are not geometric even though deposit contributions form a finite geometric sum. At q1,both become80+4n;at n0,the deposit sum is empty and the balance remains80NZD.'
          : 'End timing gives Bₖ=qBₖ₋₁+c with balances36,24. Start timing gives Cₖ=q(Cₖ₋₁+c) with33,39/2. Generally Bₙ=60qⁿ+6Σ(j=0..n−1)qʲ and Cₙ=60qⁿ+6Σ(j=1..n)qʲ. Start deposits experience one extra multiplier,even when it is below one. Ratios3/5 and2/3 differ,so the stipulated balances are not geometric;the added six cannot be ignored. At q1,both become60+6n;at n0,empty deposit sum leaves60NZD. Preserve the given no-rounding model and units.',
        '按“存入→增长”或“增长→存入”写每个箭头，再给每笔钱数还经过几期。',
        'Write each deposit/growth arrow in order,then count the remaining multiplications for each contribution.',
      ),
    ],
  };
};
export const sequenceRecurrenceRetrieval = {
  H31_SEQUENCE: makeSet('H31'),
  H38_SEQUENCE: makeSet('H38'),
};
