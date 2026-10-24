import { t } from '../model';
import { reasoning } from './builders';

const bridges = (unit: string) =>
  Object.fromEntries(
    ['P61-L01', 'P61-L02', 'P61-L04', 'P61-L05', 'P61-L06'].map((l, i) => [
      `${unit}-MAINT-FRACTION-OPS-Q${i + 1}`,
      l,
    ]),
  );

// Drawings and inverse checks are part of each task, not optional evidence
// inferred from a correct final value. These records require human review.
export const fractionOperationsRetrieval = {
  P67: {
    id: 'P67-MAINT-FRACTION-OPS',
    unit: 'P67',
    bridge: 'P61-L01',
    bridgeByQuestion: bridges('P67'),
    title: t(
      '数据之后，再看分数怎样运算',
      'After data, revisit how fractions operate',
    ),
    intro: t(
      '完成P67后，每次选一两题。用固定整体画图，区分每份的量、份数与剩余量；家长核对理由再记录。五题可以分次完成。',
      'After P67, choose one or two tasks per sitting. Draw fixed wholes and distinguish amount per portion, portion count and remainder. A parent checks the reasoning before recording; split the five tasks across sessions.',
    ),
    questions: [
      reasoning(
        'P67-MAINT-FRACTION-OPS-Q1',
        t(
          '四个相同转盘模型，每个边框用3/5 m纸带。画固定1 m分数条，用重复相加求总长，并核四组的含义。为什么12/20 m不是总长？若做一个或零个模型呢？',
          'Four identical spinner models each need 3/5 m of border tape. Draw fixed one-metre fraction strips, find the total by repeated addition and explain the four groups. Why is 12/20 m not the total? What if you make one model or none?',
        ),
        'repeat-fraction',
        t(
          '每个1 m分成五等份，每组取三份。四组共十二个1/5 m，即3/5+3/5+3/5+3/5=12/5 m=2 2/5 m；分母仍是五，不因组数改变单位小份。12/20=3/5 m只是原来一组量，不是四组合计。一组3/5 m，零组0 m，均与乘1或0相容。',
          'Divide each one-metre whole into fifths and take three per group. Four groups contain twelve fifth-metres: 3/5+3/5+3/5+3/5=12/5 m=2 2/5 m. The share unit remains one fifth of a metre; group count does not change it. 12/20=3/5 m is only the original one-group amount. One group needs 3/5 m and zero groups need 0 m, consistent with factors one and zero.',
        ),
        [
          t(
            '先标清每一小份是多少米，再数共有几份。',
            'Label each small share in metres before counting shares.',
          ),
          t(
            '把错误答案约分，看看它表示几组原来的量。',
            'Reduce the proposed answer and compare it with one original group.',
          ),
        ],
      ),
      reasoning(
        'P67-MAINT-FRACTION-OPS-Q2',
        t(
          '画一个4列5行的单位面积框，整体为1。先涂3/4，再取已涂部分的2/5，重叠占原整体多少？用格子解释乘法。再用同样大小的框画5/4的2/5；解释为什么不能把已涂部分改叫新整体。乘数为1或0时怎样？',
          'Draw a four-column, five-row unit-area frame whose whole is one. Shade 3/4, then take 2/5 of the shaded part. What fraction of the original whole overlaps? Explain multiplication using cells. Then use equal-sized frames to draw 2/5 of 5/4. Why must the shaded part not replace the original reference whole? What happens with factors one and zero?',
        ),
        'fraction-area-product',
        t(
          '原整体20个等格，每格1/20；三列与两行重叠6格，所以(3/4)×(2/5)=6/20=3/10。画两个同样单位框，先取五列四分之一，再各取高度的2/5，合十个1/20，即(5/4)×(2/5)=10/20=1/2。2/5说取被选量的五分之二，但结果始终相对原单位框；不能把六格写成原整体的2/5。正量乘0到0、乘1不变，乘介于0与1的因子缩小该量；分数乘法不一定增大。',
          'The original whole has twenty equal cells, each 1/20. Three columns overlapping two rows give six cells, so (3/4)×(2/5)=6/20=3/10. In two equal unit frames take five quarter-columns, then two fifths of their height: ten twentieths, so (5/4)×(2/5)=1/2. The factor describes a fraction of the selected amount, but the result is measured against the original frame. Six cells are not 2/5 of that original whole. Multiplication by zero gives zero, by one preserves the amount, and by a positive factor below one scales it down; multiplication need not enlarge.',
        ),
        [
          t(
            '一个单位框内共有多少等格？重叠几列几行？',
            'How many equal cells are in one unit frame? How many columns and rows overlap?',
          ),
          t(
            '超过一个整体时，另画相同大小的框，不改变每格的值。',
            'For more than one whole, add equal-sized frames without changing a cell’s value.',
          ),
        ],
      ),
      reasoning(
        'P67-MAINT-FRACTION-OPS-Q3',
        t(
          '把3/5 L饮料平均分给四个杯子，允许连续分量且无损耗。画固定1 L的条，标每杯多少升，解释为什么除以4使每小份再均分，并乘回核验。若总量是0 L呢？',
          'Share 3/5 L equally among four cups, allowing divisible amounts without loss. Draw a fixed one-litre strip and label litres per cup. Explain why division by four subdivides each fifth, and multiply back to check. What if the total is 0 L?',
        ),
        'fraction-sharing',
        t(
          '把1 L分成20等份，每个1/5 L再分四份；3/5 L占十二个1/20 L，四杯各三份，即(3/5)÷4=3/20 L。四杯合4×3/20=12/20=3/5 L，保留总量。这里4是杯数，商是每杯量，不是能装几杯。0 L平均给四杯各0 L，仍有确定解；分的杯数必须为正整数。',
          'Split one litre into twentieths by dividing each fifth into four. The 3/5 L total occupies twelve twentieths, so each of four cups gets three: (3/5)÷4=3/20 L. Four cups contain 4×3/20=12/20=3/5 L, conserving the total. Four is cup count and the quotient is litres per cup, not how many cups can be filled. Sharing 0 L among four cups gives 0 L each with a unique result; cup count must be a positive integer.',
        ),
        [
          t(
            '让每个原来的五分之一都能平均分四份。',
            'Make each original fifth divisible into four equal shares.',
          ),
          t(
            '四个相同的每杯量相加，必须回到多少升？',
            'What total must four equal cup amounts reconstruct?',
          ),
        ],
      ),
      reasoning(
        'P67-MAINT-FRACTION-OPS-Q4',
        t(
          '有3 L，每标准份2/5 L。画固定1 L刻度条，分别报告标准份等量数、满份数、余下升数及它占一标准份的比例；乘回核验。再判断1 L相对于每标准份5/3 L相当于几标准份、有几满份。',
          'You have 3 L and each standard portion is 2/5 L. Draw fixed one-litre scales and report equivalent standard-portion count, full portions, leftover litres and the leftover fraction of one standard portion. Multiply back to check. Then compare 1 L with a standard portion of 5/3 L: how many equivalent portions and how many full ones?',
        ),
        'fraction-measurement-division',
        t(
          '3 L含十五个1/5 L，每标准份取两个，所以3÷(2/5)=15/2=7 1/2标准份等量。可取7满份共14/5 L，余1/5 L，是标准份2/5 L的一半；不能把半标准份叫1/2 L。7×2/5+1/5=3 L。1÷(5/3)=3/5标准份等量，0满份、余1 L；每标准份大于1 L时除后可以小于1，标准份等量数不必是完整实物个数。',
          'Three litres contain fifteen fifth-litres; each standard portion uses two, so 3÷(2/5)=15/2=7 1/2 equivalent portions. Seven full portions use 14/5 L, leaving 1/5 L, which is half of a 2/5 L standard portion, not 1/2 L. Check 7×2/5+1/5=3 L. Also 1÷(5/3)=3/5 equivalent portions: zero full portions and 1 L left. Dividing by a portion larger than one litre can give a count below one; equivalent-portion count need not be a whole-object count.',
        ),
        [
          t(
            '先统一成五分之一升，两个小格才是一标准份。',
            'Use fifth-litres; two small cells make one standard portion.',
          ),
          t(
            '余量的升数与余量占标准份的比例用不同参照。',
            'Leftover litres and the fraction of a standard portion use different references.',
          ),
        ],
      ),
      reasoning(
        'P67-MAINT-FRACTION-OPS-Q5',
        t(
          '求3/5÷2/3，先设商q，写q必须满足的乘法关系，再用除数的倒数解出并核验。为什么不能把被除数倒过来？说明0÷2/3、2/3÷0、0÷0以及“0的倒数”。',
          'Find (3/5)÷(2/3). First name the quotient q and its defining multiplication relation, then solve using the divisor’s reciprocal and check. Why must you not invert the dividend? Explain 0÷(2/3), (2/3)÷0, 0÷0 and the reciprocal of zero.',
        ),
        'reciprocal-reasoning',
        t(
          'q×2/3=3/5，两边乘3/2使原除数变1，得q=(3/5)×(3/2)=9/10；(9/10)×(2/3)=3/5。倒的是非零除数2/3，错误(5/3)×(2/3)=10/9乘回不能得3/5。0÷2/3=0，因为仅q=0满足关系。2/3÷0要求q×0=2/3，无解；0÷0要求q×0=0，任何q都满足而不唯一，仍未定义。0无倒数，因为0乘任何数都不是1。',
          'q×(2/3)=3/5. Multiplying both sides by 3/2 turns the original divisor into one, giving q=(3/5)×(3/2)=9/10; check (9/10)×(2/3)=3/5. Invert the nonzero divisor, not the dividend: (5/3)×(2/3)=10/9 fails the inverse check. 0÷(2/3)=0 uniquely. (2/3)÷0 would require q×0=2/3, which has no solution. 0÷0 would require q×0=0, satisfied by every q and hence not unique, so it is also undefined. Zero has no reciprocal because no product with zero is one.',
        ),
        [
          t(
            '先写“商×原除数=被除数”，还不急着翻分数。',
            'Write quotient × original divisor = dividend before inverting anything.',
          ),
          t(
            '除零时分别检查没有解与不唯一，不能只凭乘回0就说商成立。',
            'For zero divisors distinguish no solution from non-uniqueness; a zero product alone does not define a quotient.',
          ),
        ],
      ),
    ],
  },
  J74: {
    id: 'J74-MAINT-FRACTION-OPS',
    unit: 'J74',
    bridge: 'P61-L01',
    bridgeByQuestion: bridges('J74'),
    title: t(
      '几何之后，再解释分数运算',
      'After geometry, explain fraction operations again',
    ),
    intro: t(
      '完成J74后，每次选一两题。图上的固定单位、量与个数必须说清；先独立解释，需要时再看提示，家长逐题核对。',
      'After J74, choose one or two tasks per sitting. Explain fixed units, amounts and counts in your drawings. Try independently before hints; a parent checks each argument.',
    ),
    questions: [
      reasoning(
        'J74-MAINT-FRACTION-OPS-Q1',
        t(
          '几何草图上有五段相同长度，每段7/8 cm，不重叠地首尾相接。画固定1 cm条，用重复相加求总长，并解释35/40 cm为什么错。零段与一段怎样核验？',
          'A geometry sketch has five equal segments, each 7/8 cm, joined end to end without overlap. Draw fixed one-centimetre strips and use repeated addition for the total. Explain why 35/40 cm is wrong and check the zero-segment and one-segment cases.',
        ),
        'repeat-fraction',
        t(
          '每厘米八等份，五段含三十五个1/8 cm，总长35/8 cm=4 3/8 cm。分母八保留固定单位小份，五是组数；35/40=7/8 cm仍只是一段。零段长0 cm，一段长7/8 cm；纸笔画图可以放大，但单位标签不因此改值。',
          'Split each centimetre into eighths. Five segments contain thirty-five eighth-centimetres, totalling 35/8 cm=4 3/8 cm. Eight names the fixed share unit and five counts groups. 35/40=7/8 cm is still only one segment. Zero segments have length 0 cm and one has 7/8 cm. A drawing can be enlarged without changing its labelled units.',
        ),
        [
          t(
            '先写五个相同加数，再数八分之一厘米。',
            'Write five equal addends and count eighth-centimetres.',
          ),
          t(
            '把35/40与原来一段作等值比较。',
            'Compare 35/40 with the original single segment.',
          ),
        ],
      ),
      reasoning(
        'J74-MAINT-FRACTION-OPS-Q2',
        t(
          '在3列7行的单位面积框内，先涂2/3，再取已涂部分的3/7。画出重叠并报告占原整体几分之几。再用相同大小的单位框画4/3的3/7。解释原整体与“所取部分的整体”有何关系，并检查乘0与乘1。',
          'In a three-column, seven-row unit-area frame, shade 2/3 and take 3/7 of that shaded amount. Draw the overlap and report its fraction of the original whole. Then use equal-sized unit frames for 3/7 of 4/3. Explain the reference whole and the amount being selected from, and check multiplication by zero and one.',
        ),
        'fraction-area-product',
        t(
          '每个原单位框21等格，每格1/21；两列与三行重叠六格，(2/3)×(3/7)=6/21=2/7。四个三分之一列跨同样的单位框，各取三行，共十二格，(4/3)×(3/7)=12/21=4/7。3/7指被涂量的一部分，结果2/7或4/7仍以原单位框为1；不能改整体再把结果写3/7。量乘1不变、乘0为0，正量乘3/7缩小；原量4/3可超过1但所取量仍能小于1。',
          'Each original unit frame has twenty-one equal cells, each 1/21. Two columns and three rows overlap in six cells: (2/3)×(3/7)=6/21=2/7. Four third-columns across equal unit frames, with three rows selected, contain twelve cells: (4/3)×(3/7)=12/21=4/7. The factor 3/7 selects from the shaded amount; the answers are still measured against the original unit frame, not a renamed whole. Multiplying by one preserves the amount and by zero gives zero. A positive amount scaled by 3/7 shrinks; an original amount above one can yield a result below one.',
        ),
        [
          t(
            '每格相对原单位框是什么分数？',
            'What fraction of the original unit frame is each cell?',
          ),
          t(
            '四个三分之一不挤成同一个单位框，而是保持每框同样大。',
            'Do not squeeze four thirds into one unit frame; keep all unit frames equal-sized.',
          ),
        ],
      ),
      reasoning(
        'J74-MAINT-FRACTION-OPS-Q3',
        t(
          '把5/6 m纸带平均分成三段模型边线，允许精确分割且无损耗。画固定1 m条求每段米数，解释分数除以整数，并乘回检查。为什么5/(6+3) m不合关系？总长为0 m时呢？',
          'Share 5/6 m of tape equally into three model-edge segments, allowing exact cuts without loss. Draw a fixed one-metre strip, find metres per segment, explain fraction division by a whole number and check by multiplication. Why does 5/(6+3) m fail? What if total length is 0 m?',
        ),
        'fraction-sharing',
        t(
          '每个六分之一米再三等分，1 m有18小份，5/6 m占15份，三段各五份即5/18 m。三段合3×5/18=5/6 m。5/(6+3)=5/9 m，三段合5/3 m，比原总长大，不能随意在分母加3。三是段数，商单位是每段米数；总长0 m平均给三段各0 m，在数值模型中成立，不意味着有正长度实物段。',
          'Split each sixth-metre into three equal parts. One metre has eighteen shares and 5/6 m has fifteen; each segment gets five, or 5/18 m. Check 3×5/18=5/6 m. The proposed 5/(6+3)=5/9 m would total 5/3 m across three segments, exceeding the original. Three is segment count and the quotient is metres per segment. A zero total shared numerically across three segments gives zero each; this does not create positive-length physical segments.',
        ),
        [
          t(
            '先把每一个六分之一分成三等份。',
            'Divide each sixth into three equal shares.',
          ),
          t(
            '拿每段量乘三，是否恢复原长？',
            'Does three times the segment amount restore the original total?',
          ),
        ],
      ),
      reasoning(
        'J74-MAINT-FRACTION-OPS-Q4',
        t(
          '2 m长条按每标准段3/8 m来量。画固定1 m条，给出标准段等量数、满段数、余下米数与余量占一标准段的比例，乘回核验。再用每标准段5/4 m来量1 m，说明等量段数与满段数为何不同。',
          'Measure a two-metre strip in standard segments of 3/8 m. Draw fixed one-metre strips and give equivalent segment count, full segments, leftover metres and the leftover fraction of a standard segment. Check by multiplication. Then measure one metre using a standard segment of 5/4 m and distinguish equivalent and full-segment counts.',
        ),
        'fraction-measurement-division',
        t(
          '2 m有十六个1/8 m，每标准段占三格，所以2÷(3/8)=16/3=5 1/3标准段等量。五满段用15/8 m，余1/8 m，是3/8 m标准段的1/3，而不是1/3 m；5×3/8+1/8=2 m。1÷(5/4)=4/5标准段等量，可截0满段，余1 m。商比较的是总长与标准段量，不能把分数等量段数当已截出的完整段数。',
          'Two metres contain sixteen eighth-metres, while a standard segment uses three: 2÷(3/8)=16/3=5 1/3 equivalent segments. Five full segments use 15/8 m, leaving 1/8 m, which is 1/3 of a 3/8 m standard segment, not 1/3 m. Check 5×3/8+1/8=2 m. Also 1÷(5/4)=4/5 equivalent segments, zero full segments and one metre left. The quotient compares total length with standard-segment size; a fractional equivalent count is not a count of completed whole cuts.',
        ),
        [
          t(
            '把两米都按相同八分之一米分格，每三格圈一标准段。',
            'Divide both metres into equal eighth-metres and circle three cells per standard segment.',
          ),
          t(
            '余下一格的米数与它占三格的比例不同。',
            'The metres in one leftover cell differ from its fraction of a three-cell standard segment.',
          ),
        ],
      ),
      reasoning(
        'J74-MAINT-FRACTION-OPS-Q5',
        t(
          '求5/6÷7/4。先写商乘原除数等于被除数，再说明用哪个倒数、为什么，算出并反查。判断“除法总使数变小”，并用0÷7/4、7/4÷0、0÷0解释零的条件。',
          'Find (5/6)÷(7/4). First write quotient times original divisor equals dividend, then justify which reciprocal to use, calculate and check. Judge the claim that division always makes a number smaller, and explain zero conditions using 0÷(7/4), (7/4)÷0 and 0÷0.',
        ),
        'reciprocal-reasoning',
        t(
          'q×7/4=5/6，乘非零除数的倒数4/7得q=(5/6)×(4/7)=10/21；反查(10/21)×(7/4)=5/6。倒被除数会得到(6/5)×(7/4)=21/10，不能乘回原量。这里除以7/4使正量缩小，但除以1/2使它变为5/3而增大，所以不能说除法总变小。0÷7/4=0唯一；7/4÷0无解；0÷0所有q都满足乘法关系而不唯一，两种零除数都未定义。倒数使积为1，零不可能有倒数。',
          'q×(7/4)=5/6. Multiplying by the nonzero divisor’s reciprocal 4/7 gives q=(5/6)×(4/7)=10/21; check (10/21)×(7/4)=5/6. Inverting the dividend instead gives (6/5)×(7/4)=21/10 and fails the inverse check. Division by 7/4 shrinks this positive amount, but division by 1/2 gives 5/3 and enlarges it, disproving the general claim. 0÷(7/4)=0 uniquely; (7/4)÷0 has no solution; 0÷0 satisfies the multiplication relation for every q and is non-unique. Both zero-divisor quotients are undefined. A reciprocal gives product one, impossible for zero.',
        ),
        [
          t(
            '哪个因子要被变成1，才能单独留下商？',
            'Which factor must become one to leave the quotient alone?',
          ),
          t(
            '检查除数小于1、大于1和为0的情况，保留原来的非零条件。',
            'Check divisors below one, above one and zero, retaining the nonzero condition.',
          ),
        ],
      ),
    ],
  },
};
