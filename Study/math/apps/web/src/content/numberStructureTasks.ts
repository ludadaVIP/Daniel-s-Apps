import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeTasks = (unit: 'B03' | 'B05'): Question[] => {
  const first = unit === 'B03',
    id = (n: number) => unit + '-MAINT-B01-Q' + n;
  const original = first ? 20305 : 40506,
    digit = first ? 3 : 5;
  const windows = first
    ? [
        ['A', '0', '2000', '20', '13', '14'],
        ['B', '1200', '1500', '6', '2', '4'],
      ]
    : [
        ['A', '3000', '5000', '20', '7', '9'],
        ['B', '3600', '4000', '8', '2', '6'],
      ];
  const q6 = reasoning(
    id(6),
    t(
      '读回并改位：先把' +
        (first ? '20,305' : '40,506') +
        '读给家长听（可用熟悉的中文或英文，不以发音流利评分），写完整展开式。去掉阅读逗号后还是同数吗？若删掉千位的内部0，是什么数，哪个高位数字改变位置？另外每次从原数重新开始：①只把百位的' +
        digit +
        '移到空千位，原百位补0，其余位不动；②把原数整体乘10；③只把原千位数字增加1。分别生成新数与变化量，解释为什么①的一张数字卡贡献乘10，不等于整串数乘10。',
      'Read back and change places: say ' +
        (first ? '20,305' : '40,506') +
        ' to a parent in a familiar language (Chinese or English; pronunciation fluency is not a maths score), then write its FULL expansion. Does removing reading commas preserve the number? Delete the internal thousands zero: what numeral results, and which higher digit changes place? For EACH separate change restart from the ORIGINAL: (1) move ONLY the hundreds ' +
        digit +
        ' to the empty thousands place, leaving zero in hundreds and every other digit fixed; (2) multiply the WHOLE original by ten; (3) increase only the original thousands digit by one. Generate all new values and changes. Explain why a tenfold card contribution need not make the entire number tenfold.',
    ),
    'place-value',
    t(
      (first
        ? '读作“两万零三百零五”或“twenty thousand three hundred and five”；20,000+300+5=20,305。无逗号20305同值，删内部千位0后2305=2,305，2从万位变千位。①23,005，变化+2,700；3的贡献由300变3,000，但20,000和5不变。②203,050，变化+182,745，每一位贡献都乘10。③21,305，变化+1,000。'
        : '读作“四万零五百零六”或“forty thousand five hundred and six”；40,000+500+6=40,506。无逗号40506同值，删内部千位0后4506=4,506，4从万位变千位。①45,006，变化+4,500，5的贡献500变5,000，40,000和6不变。②405,060，变化+364,554，每位贡献都乘10。③41,506，变化+1,000。') +
        '三次不是接着上一步做；用新数减原数分别核。零加数可不写，但数字里的空位不能随意删。接纳意义正确的读法变体或家长读题帮助，核查孩子自己指出数位与数量关系。',
      (first
        ? 'Read “twenty thousand three hundred and five” or “两万零三百零五”. Expansion 20,000+300+5=20,305. Comma-free 20305 is equivalent; deleting the internal thousands zero gives 2305=2,305 and moves 2 from ten-thousands to thousands. Separate results: (1) 23,005, change +2,700; the 3 contributes 300 then 3,000 while 20,000 and five stay fixed. (2) 203,050, change +182,745; EVERY digit contribution is multiplied by ten. (3) 21,305, change +1,000.'
        : 'Read “forty thousand five hundred and six” or “四万零五百零六”. Expansion 40,000+500+6=40,506. Comma-free 40506 is equivalent; deleting the internal thousands zero gives 4506=4,506 and moves 4 from ten-thousands to thousands. Separate results: (1) 45,006, change +4,500; 500 becomes 5,000 while 40,000 and six stay fixed. (2) 405,060, change +364,554; EVERY digit contribution is multiplied by ten. (3) 41,506, change +1,000.') +
        ' Restart from the original EACH time and check new minus original. Omitting a zero addend is allowed; deleting a placeholder is different. Accept meaning-preserving spoken variants and reading assistance, while checking the learner identifies places and quantity relationships.',
    ),
    [
      t(
        '把原数每位乘的单位写出；只移动一张卡和移动整串数字分两张纸做。',
        'Write each original digit’s unit. Use separate workings for one moved card and the whole number.',
      ),
      t(
        '每种变化都重新从原数出发，再用减法核变化量。',
        'Restart from the original for each change, then check the difference by subtraction.',
      ),
    ],
  );
  q6.diagram = { kind: 'place', value: original, places: 5 };
  const q7 = reasoning(
    id(7),
    t(
      '先不用图，比较' +
        (first
          ? '42,999与43,001，再比较9,999与10,000'
          : '75,999与76,001，再比较999与1,000') +
        '，指出最高的第一个不同数位，低位的9为什么不能翻转顺序？再按表中两窗各自的起点、终点、等距区间数及从左起走过的区间数，分别求P、Q、每格值与Q−P。亲画两窗，把同一P、Q标进去：窗口或画在纸上的相对位置变了，数字、顺序和数值差会变吗？另有人把0,10,20,30依次画在纸尺0,2,4,5 cm处，能用这张图的最后一段更短来判30−20较小吗？指出问题并给一个统一刻度修法。',
      'Without a diagram, compare ' +
        (first
          ? '42,999 with 43,001, then 9,999 with 10,000'
          : '75,999 with 76,001, then 999 with 1,000') +
        '. Identify the HIGHEST first differing place and explain why trailing nines cannot reverse the order. Next use EACH window’s start, end, equal-interval count and travelled intervals from the LEFT endpoint in the table to generate P, Q, one-interval value and Q−P. Draw both windows and mark the SAME P and Q. Do changed windows or relative paper positions change values, order or numerical difference? A separate drawing puts values 0,10,20,30 at ruler positions 0,2,4,5 cm: does the shorter last segment show that 30−20 is smaller? Diagnose it and supply one uniformly scaled repair.',
    ),
    'whole-number-line',
    t(
      (first
        ? '42,999<43,001，同万位4后千位2<3；9,999<10,000，后者多一个万位。窗A每格100，P=0+13×100=1,300、Q=1,400；窗B每格50，P=1,200+2×50=1,300、Q=1,400；两窗Q−P=100。'
        : '75,999<76,001，同万位7后千位5<6；999<1,000，后者多一个千位。窗A每格100，P=3,000+7×100=3,700、Q=3,900；窗B每格50，P=3,600+2×50=3,700、Q=3,900；两窗Q−P=200。') +
        '先把个位对齐；首次差在某单位时，全部较低位合起来最多比该单位少1，所以不能抵过高位多出的至少一个单位。标数值的是同一P/Q，窗只改显示，不改数值，P<Q和数值差不变；不可把纸上像素/厘米当数值。错误尺的数值差全10，纸上间隔却2,2,1 cm，非统一刻度；可改位置0,2,4,6 cm。起点不是第一格；20个等距区间有21个刻度点。',
      (first
        ? '42,999<43,001: ten-thousands match at four, then thousands differ two versus three. 9,999<10,000 because the latter has a ten-thousands place. Window A: step 100, P=0+13×100=1,300, Q=1,400. Window B: step 50, P=1,200+2×50=1,300, Q=1,400. In BOTH, Q−P=100.'
        : '75,999<76,001: ten-thousands match at seven, then thousands differ five versus six. 999<1,000 because the latter has a thousands place. Window A: step 100, P=3,000+7×100=3,700, Q=3,900. Window B: step 50, P=3,600+2×50=3,700, Q=3,900. In BOTH, Q−P=200.') +
        ' Align ones. All lower places together are at most one less than the first differing unit, so cannot outweigh an extra higher unit. P and Q retain their numerical identities, P<Q and difference when the window changes; paper pixels/centimetres are not number values. The flawed ruler uses equal numerical gaps ten but paper gaps two,two,one cm. One repair is positions 0,2,4,6 cm. Count spaces: twenty equal intervals have twenty-one tick marks.',
    ),
    [
      t(
        '先算(终点−起点)÷区间数，再算起点+已走区间数×每格值。',
        'First compute (end−start)÷interval count, then start+travelled intervals×step.',
      ),
      t(
        '两窗逐项独立算，再比较同名点；也检查等数值差是否对应等图距。',
        'Calculate each window independently before comparing named points. Check equal value gaps against equal drawn gaps.',
      ),
    ],
  );
  q7.contextTable = {
    caption: t(
      '两个完整数轴窗口；P/Q列是从左端走过的区间数，不是坐标或刻度点数。图只给窗A的P，P数值未标。',
      'Two COMPLETE number-line windows. P/Q columns count intervals travelled from the left, not coordinates or tick marks. The figure gives only window A and its P, without the value label.',
    ),
    columns: [
      t('窗', 'Window'),
      t('起点', 'Start'),
      t('终点', 'End'),
      t('区间总数', 'Intervals'),
      t('到P已走', 'To P'),
      t('到Q已走', 'To Q'),
    ],
    rows: windows.map((r) => r.map((s) => t(s, s))),
  };
  q7.diagram = {
    kind: 'axis',
    start: Number(windows[0]![1]),
    end: Number(windows[0]![2]),
    divisions: 20,
    point: first ? 1300 : 3700,
    label: 'P',
    labelMode: 'endpoints',
    showIntervalValue: false,
  };
  const q8 = reasoning(
    id(8),
    t(
      '本题仅用非负整数，恰在中点时按约定取较大的相邻倍数。对表中每行，亲找两个相邻目标倍数、中点、两边距离，给近似值及单位。哪个情景恰在中点，进位经过哪些9，为什么不能只改一位后把其他9保留？同一个原数按不同精度所得近似值不同，必有人错吗？保留精确原数，区分近似号与精确等号。再把第2行的近似值到最近的千，与从原数直接做第3行比较；分别计算，为何不能总是连续舍入？最后以第2、3行的原数为人数、每人一张票，最近百数必够用吗？',
      'Use NONNEGATIVE whole numbers and the stated HALF-UP convention: a halfway tie chooses the larger neighbouring multiple. For EACH row, generate both neighbouring target multiples, midpoint, both distances, rounded value and precision. Which is a tie, and which nines are crossed by carrying? Why cannot the other nines simply remain unchanged? Must different precisions for one original value indicate an error? Preserve the exact input and distinguish “approximately” from exact equality. Next round row TWO’s APPROXIMATION to thousands and compare with direct row THREE from the original. Calculate both routes: why is repeated rounding not always reliable? Finally, if the original count in rows two/three is people needing one ticket each, must its nearest-hundred estimate supply enough?',
    ),
    'rounding',
    t(
      first
        ? '19,995到十的邻居19,990/20,000，中点19,995，两距5/5，按约定约20,000；连续进位穿过9，不能写19,910。5,465到百的邻居5,400/5,500，中点5,450，两距65/35，约5,500；到千邻居5,000/6,000，中点5,500，两距465/535，约5,000。单位不同所以5,500与5,000可同时正确；5,465原数未变。先百再千是5,465→5,500→6,000，不同于直接到千5,000；第一次近似把数推到下一精度中点，不能总连续舍入。5,500票在此例够且多35，但“最近百数总够”是错的：如5,401最近百5,400少1票。近似号不把原数变为精确5,500，不能用估数代替逐人需求。'
        : '99,950到百邻居99,900/100,000，中点99,950，两距50/50，按约定约100,000，进位穿过连续9；99,100不是结果。8,496到百邻居8,400/8,500，中点8,450，两距96/4，约8,500；到千邻居8,000/9,000，中点8,500，两距496/504，约8,000。两精度不同可同时正确，8,496原数未变。先百再千8,496→8,500→9,000，不同于直接到千8,000；第一次近似改了下一次判断。8,500票此例够且多4，但不是总够：8,401到百为8,400，少1票。这是足量约束，不改变最近百数规则。用近似号、注明精度，不能写原数精确等于近似值。',
      first
        ? '19,995 to tens: neighbours 19,990/20,000; midpoint 19,995; distances 5/5, so approximately 20,000 under HALF-UP. Carrying crosses the nines; 19,910 is not the result. For 5,465 to hundreds: neighbours 5,400/5,500, midpoint 5,450, distances 65/35, giving approximately 5,500. To thousands: neighbours 5,000/6,000, midpoint 5,500, distances 465/535, giving approximately 5,000. Different precisions allow BOTH results; the exact original remains 5,465. Successive rounding is 5,465→5,500→6,000, unlike direct rounding to 5,000. The first approximation moves to the coarser midpoint, so repeated rounding is not always reliable. Here 5,500 tickets suffice with 35 extra, but “nearest hundred ALWAYS suffices” is false: 5,401 rounds to 5,400, one short. Approximation does not make the original exactly 5,500 or replace the exact per-person requirement.'
        : '99,950 to hundreds: neighbours 99,900/100,000; midpoint 99,950; distances 50/50, so approximately 100,000 under HALF-UP. Carrying crosses the nines; 99,100 is incorrect. For 8,496 to hundreds: neighbours 8,400/8,500, midpoint 8,450, distances 96/4, giving approximately 8,500. To thousands: neighbours 8,000/9,000, midpoint 8,500, distances 496/504, giving approximately 8,000. Both precisions can be correct; the original remains 8,496. Successive rounding is 8,496→8,500→9,000, unlike direct rounding to 8,000; the first approximation changes the next decision. Here 8,500 tickets suffice with four extra, but not ALWAYS: 8,401 rounds to 8,400, one short. That is a sufficiency constraint, not a change to nearest-hundred rounding. Use an approximation sign and state precision rather than exact equality to the original.',
    ),
    [
      t(
        '先看要到十、百或千；每行都从原数直接找邻居。',
        'Check whether the unit is tens, hundreds or thousands; find neighbours directly from each original input.',
      ),
      t(
        '距离相等才用中点约定；保证够用是另外一个要求。',
        'Use the tie convention only for equal distances; guaranteeing enough is a separate requirement.',
      ),
    ],
  );
  q8.contextTable = {
    caption: t(
      '虚构人数记录与分别要求的精度；重复原数不是接着上一行舍入。',
      'Fictional count records with SEPARATE requested precisions. Repeated inputs do not mean rounding the previous row’s result.',
    ),
    columns: [t('精确原数', 'Exact input'), t('到最近的', 'Nearest')],
    rows: (first
      ? [
          ['19995', '10'],
          ['5465', '100'],
          ['5465', '1000'],
        ]
      : [
          ['99950', '100'],
          ['8496', '100'],
          ['8496', '1000'],
        ]
    ).map((r) => r.map((s) => t(s, s))),
  };
  const q9 = reasoning(
    id(9),
    t(
      '本题每个小单位方格代表1；百块、十条、一格都由相同小单位格组成。表给A/B两幅图各类块的数量，不是已求总值。先分别画A和B、写展开式、求总值及A比B多多少；它们块数相同就同量吗？再只从原A换出1个百为10个十，写新图各类数量、总值与块数，再反向换回。解释哪个数保持、哪个会变；B在写成数字时哪一位需0，为什么不能把空位直接删掉？',
      'Each small unit square represents ONE; hundred blocks, ten rods and single squares use the SAME small unit square. The table gives TYPE COUNTS for diagrams A/B, not their totals. Draw A and B, expand, calculate both totals and A−B. Do equal block counts imply equal amounts? Separately exchange ONE hundred in ORIGINAL A for ten tens. Generate the new type counts, total and block count, then exchange back. Explain what is conserved and what changes. Which place needs zero when writing B as a numeral, and why can it not be deleted?',
    ),
    'base-ten-model',
    t(
      first
        ? 'A是3百2十0一，300+20=320；B是3百0十2一，300+2=302，相差18。各5块不代表同量，因为十条值10、一格值1。A换组为2百12十0一，200+120=320，共14块；再用10十换1百回到3百2十0一、5块。守恒是单位格总值320，不是块数。B十位须0，302不是32。'
        : 'A是4百3十0一，400+30=430；B是4百0十3一，400+3=403，相差27。各7块不代表同量，十条值10、一格值1。A换组为3百13十0一，300+130=430，共16块；反换10十得4百3十0一、7块。总值430守恒，块数可变；B十位0不可删，403不是43。',
      first
        ? 'A: three hundreds,two tens,zero ones, so 300+20=320. B: three hundreds,zero tens,two ones, so 300+2=302. Difference 18. BOTH have five blocks but different values because a rod is ten units while a single is one. Exchange A to two hundreds,twelve tens,zero ones: 200+120=320, now fourteen blocks. Exchange ten tens back to recover three hundreds,two tens and five blocks. The conserved quantity is total UNIT value 320, not block count. B needs zero in tens: 302 is not 32.'
        : 'A: four hundreds,three tens,zero ones, so 400+30=430. B: four hundreds,zero tens,three ones, so 400+3=403. Difference 27. BOTH have seven blocks but different unit values. Exchange A to three hundreds,thirteen tens,zero ones: 300+130=430, now sixteen blocks. Exchanging ten tens back restores four hundreds,three tens and seven blocks. Total UNIT value 430 is conserved; block count may change. B needs zero in tens: 403 is not 43.',
    ),
    [
      t(
        '逐类用块数×单位值；块数相加与单位总值相加是两种计算。',
        'Multiply each type count by its UNIT value. Counting blocks and counting represented units are different calculations.',
      ),
      t(
        '换出1百，要从百块减1，再给十条加10；两种表示都重新求值。',
        'Remove one hundred block and add ten ten-rods. Recalculate both represented totals.',
      ),
    ],
  );
  q9.contextTable = {
    caption: t(
      '原图A/B的块种与数量；没有列出所求总值。',
      'Original diagrams A/B: block types and counts. Requested totals are not supplied.',
    ),
    columns: [
      t('种类', 'Type'),
      t('每块值', 'Value per block'),
      t('A块数', 'A count'),
      t('B块数', 'B count'),
    ],
    rows: [
      [
        t('百块', 'Hundred'),
        t('100', '100'),
        t(first ? '3' : '4', first ? '3' : '4'),
        t(first ? '3' : '4', first ? '3' : '4'),
      ],
      [
        t('十条', 'Ten'),
        t('10', '10'),
        t(first ? '2' : '3', first ? '2' : '3'),
        t('0', '0'),
      ],
      [
        t('一格', 'One'),
        t('1', '1'),
        t('0', '0'),
        t(first ? '2' : '3', first ? '2' : '3'),
      ],
    ],
  };
  return [q6, q7, q8, q9];
};
export const numberStructureTasks = {
  B03: makeTasks('B03'),
  B05: makeTasks('B05'),
};
