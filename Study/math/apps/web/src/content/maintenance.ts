import { researchMeaningRetrieval } from './researchMeaningRetrieval';
import { pythagoreanMeaningRetrieval } from './pythagoreanMeaningRetrieval';
import { congruenceMeaningRetrieval } from './congruenceMeaningRetrieval';
import { functionMeaningRetrieval } from './functionMeaningRetrieval';
import { inequalityMeaningRetrieval } from './inequalityMeaningRetrieval';
import { systemMeaningRetrieval } from './systemMeaningRetrieval';
import { factorMeaningRetrieval } from './factorMeaningRetrieval';
import { identityMeaningRetrieval } from './identityMeaningRetrieval';
import { inferenceMeaningRetrieval } from './inferenceMeaningRetrieval';
import { cartesianMeaningRetrieval } from './cartesianMeaningRetrieval';
import { planeMeaningRetrieval } from './planeMeaningRetrieval';
import { linearMeaningRetrieval } from './linearMeaningRetrieval';
import { polynomialMeaningRetrieval } from './polynomialMeaningRetrieval';
import { rationalMeaningRetrieval } from './rationalMeaningRetrieval';
import { appliedMeaningRetrieval } from './appliedMeaningRetrieval';
import { chanceMeaningRetrieval } from './chanceMeaningRetrieval';
import { circleMeaningRetrieval } from './circleMeaningRetrieval';
import { algebraMeaningRetrieval } from './algebraMeaningRetrieval';
import { signedMeaningRetrieval } from './signedMeaningRetrieval';
import { ratioMeaningRetrieval } from './ratioMeaningRetrieval';
import { percentMeaningRetrieval } from './percentMeaningRetrieval';
import { fractionMultiplicativeRetrieval } from './fractionMultiplicativeRetrieval';
import { calculationStructureRetrieval } from './calculationStructureRetrieval';
import { fractionDecimalMeaningRetrieval } from './fractionDecimalMeaningRetrieval';
import { measurementMeaningRetrieval } from './measurementMeaningRetrieval';
import { wordProblemMeaningRetrieval } from './wordProblemMeaningRetrieval';
import { integerStructureRetrieval } from './integerStructureRetrieval';
import { decimalStructureRetrieval } from './decimalStructureRetrieval';
import { fractionStructureRetrieval } from './fractionStructureRetrieval';
import { additiveFractionRetrieval } from './additiveFractionRetrieval';
import { equationMeaningRetrieval } from './equationMeaningRetrieval';
import { geometryConservationRetrieval } from './geometryConservationRetrieval';
import { dataMeaningRetrieval } from './dataMeaningRetrieval';
import { operationMeaningRetrieval } from './operationMeaningRetrieval';
import { numberStructureTasks } from './numberStructureTasks';
import { t, type Question } from '../model';
import { numeric, reasoning } from './builders';
import { foundationRetrieval } from './foundationRetrieval';
import { foundationRecurrence } from './foundationRecurrence';
import { numberTheoryRetrieval } from './numberTheoryRetrieval';
import { primaryRecurrence } from './primaryRecurrence';
import { earlyAlgebraRecurrence } from './earlyAlgebraRecurrence';
import { fractionRetrieval } from './fractionRetrieval';
import { fractionRecurrence } from './fractionRecurrence';
import { geometryDataRetrieval } from './geometryDataRetrieval';
import { geometryDataRecurrence } from './geometryDataRecurrence';
import { fractionOperationsRetrieval } from './fractionOperationsRetrieval';
import { fractionOperationsRecurrence } from './fractionOperationsRecurrence';
import { percentRetrieval } from './percentRetrieval';
import { percentRecurrence } from './percentRecurrence';
import { relationsRetrieval } from './relationsRetrieval';
import { relationsRecurrence } from './relationsRecurrence';
import { primaryCapstoneRetrieval } from './primaryCapstoneRetrieval';
import { primaryCapstoneRecurrence } from './primaryCapstoneRecurrence';
import { coreAlgebraRetrieval } from './coreAlgebraRetrieval';
import { coreAlgebraRecurrence } from './coreAlgebraRecurrence';
import { geometryGraphRetrieval } from './geometryGraphRetrieval';
import { geometryGraphRecurrence } from './geometryGraphRecurrence';
import { polynomialSystemRetrieval } from './polynomialSystemRetrieval';
import { polynomialSystemRecurrence } from './polynomialSystemRecurrence';
import { inequalityFunctionRetrieval } from './inequalityFunctionRetrieval';
import { inequalityFunctionRecurrence } from './inequalityFunctionRecurrence';
import { congruenceMotionRetrieval } from './congruenceMotionRetrieval';
import { congruenceMotionRecurrence } from './congruenceMotionRecurrence';
import { dataEnquiryRetrieval } from './dataEnquiryRetrieval';
import { dataEnquiryRecurrence } from './dataEnquiryRecurrence';
import { rootQuadraticRetrieval } from './rootQuadraticRetrieval';
import { rootQuadraticRecurrence } from './rootQuadraticRecurrence';
import { probabilityProcessRetrieval } from './probabilityProcessRetrieval';
import { probabilityProcessRecurrence } from './probabilityProcessRecurrence';
import { similarityCircleTrigRetrieval } from './similarityCircleTrigRetrieval';
import { similarityCircleTrigRecurrence } from './similarityCircleTrigRecurrence';
import { integrationAuditRetrieval } from './integrationAuditRetrieval';
import { integrationAuditRecurrence } from './integrationAuditRecurrence';
import { logicFunctionRetrieval } from './logicFunctionRetrieval';
import { logicFunctionRecurrence } from './logicFunctionRecurrence';
import { exponentialLogRetrieval } from './exponentialLogRetrieval';
import { exponentialLogRecurrence } from './exponentialLogRecurrence';
import { circularRecurrenceRetrieval } from './circularRecurrenceRetrieval';
import { circularRecurrenceEvidence } from './circularRecurrenceEvidence';
import { vectorLanguageRetrieval } from './vectorLanguageRetrieval';
import { vectorLanguageRecurrence } from './vectorLanguageRecurrence';
import { spatialStructureRetrieval } from './spatialStructureRetrieval';
import { spatialStructureRecurrence } from './spatialStructureRecurrence';
import { sequenceRecurrenceRetrieval } from './sequenceRecurrenceRetrieval';
import { sequenceRecurrenceEvidence } from './sequenceRecurrenceEvidence';
import { dataLanguageRetrieval } from './dataLanguageRetrieval';
import { dataLanguageRecurrence } from './dataLanguageRecurrence';
import { complexRecurrenceRetrieval } from './complexRecurrenceRetrieval';
import { complexRecurrenceEvidence } from './complexRecurrenceEvidence';
import { conicDefinitionRetrieval } from './conicDefinitionRetrieval';
import { conicDefinitionRecurrence } from './conicDefinitionRecurrence';
import { spaceVectorRetrieval } from './spaceVectorRetrieval';
import { spaceVectorRecurrence } from './spaceVectorRecurrence';
import { countingStructureRetrieval } from './countingStructureRetrieval';
import { countingStructureRecurrence } from './countingStructureRecurrence';
import { derivativeMeaningRetrieval } from './derivativeMeaningRetrieval';
import { derivativeMeaningRecurrence } from './derivativeMeaningRecurrence';
import { functionAnalysisRetrieval } from './functionAnalysisRetrieval';
import { functionAnalysisRecurrence } from './functionAnalysisRecurrence';
import { statisticsRetrieval } from './statisticsRetrieval';
import { statisticsRecurrence } from './statisticsRecurrence';
import { representationRetrieval } from './representationRetrieval';
import { problemSolvingRecurrence } from './problemSolvingRecurrence';
import { optimisationRecurrenceRetrieval } from './optimisationRecurrenceRetrieval';
import { optimisationRecurrenceEvidence } from './optimisationRecurrenceEvidence';
import { calculusIntegralRetrieval } from './calculusIntegralRetrieval';
import { calculusIntegralRecurrence } from './calculusIntegralRecurrence';
import { distributionRecurrenceRetrieval } from './distributionRecurrenceRetrieval';
import { distributionRecurrenceEvidence } from './distributionRecurrenceEvidence';
import { inferenceRecurrenceRetrieval } from './inferenceRecurrenceRetrieval';
import { inferenceRecurrenceEvidence } from './inferenceRecurrenceEvidence';
import { advancedEquationRecurrenceRetrieval } from './advancedEquationRecurrenceRetrieval';
import { advancedEquationRecurrenceEvidence } from './advancedEquationRecurrenceEvidence';
import { analyticGeometryRecurrenceRetrieval } from './analyticGeometryRecurrenceRetrieval';
import { analyticGeometryRecurrenceEvidence } from './analyticGeometryRecurrenceEvidence';
import { postRouteExtensionRetrieval } from './postRouteExtensionRetrieval';
import { postRouteCapstoneRetrieval } from './postRouteCapstoneRetrieval';
import { postRouteRecurrenceEvidence } from './postRouteRecurrenceEvidence';
import { assertMaintenanceOwners } from './retrievalUnits';

export type MaintenanceSet = {
  id: string;
  unit: string;
  title: ReturnType<typeof t>;
  bridge: string;
  intro?: ReturnType<typeof t>;
  bridgeByQuestion?: Record<string, string>;
  questions: Question[];
};

// These are later-unit retrieval tasks, separate from both the unit check and
// the originating lesson's parameterised SRS. Keep all record IDs stable.
const numberTask = (
  id: string,
  zh: string,
  en: string,
  value: string,
  skill: string,
  hints: [string, string][],
  steps: [string, string][],
  rejected: string[],
  diagram?: Question['diagram'],
) =>
  numeric(
    id,
    t(zh, en),
    value,
    skill,
    hints.map(([z, e]) => t(z, e)),
    steps.map(([z, e]) => t(z, e)),
    { accepted: [value], rejected },
    diagram,
  );

export const maintenanceSets = {
  ...foundationRetrieval,
  ...numberTheoryRetrieval,
  ...fractionRetrieval,
  ...geometryDataRetrieval,
  ...fractionOperationsRetrieval,
  ...percentRetrieval,
  ...relationsRetrieval,
  ...primaryCapstoneRetrieval,
  ...coreAlgebraRetrieval,
  ...geometryGraphRetrieval,
  ...polynomialSystemRetrieval,
  ...inequalityFunctionRetrieval,
  ...congruenceMotionRetrieval,
  ...dataEnquiryRetrieval,
  ...rootQuadraticRetrieval,
  ...probabilityProcessRetrieval,
  ...similarityCircleTrigRetrieval,
  ...integrationAuditRetrieval,
  ...logicFunctionRetrieval,
  ...exponentialLogRetrieval,
  ...circularRecurrenceRetrieval,
  ...vectorLanguageRetrieval,
  ...spatialStructureRetrieval,
  ...sequenceRecurrenceRetrieval,
  ...dataLanguageRetrieval,
  ...complexRecurrenceRetrieval,
  ...conicDefinitionRetrieval,
  ...spaceVectorRetrieval,
  ...countingStructureRetrieval,
  ...derivativeMeaningRetrieval,
  ...functionAnalysisRetrieval,
  ...statisticsRetrieval,
  ...representationRetrieval,
  ...optimisationRecurrenceRetrieval,
  ...calculusIntegralRetrieval,
  ...distributionRecurrenceRetrieval,
  ...inferenceRecurrenceRetrieval,
  ...advancedEquationRecurrenceRetrieval,
  ...analyticGeometryRecurrenceRetrieval,
  ...postRouteExtensionRetrieval,
  ...postRouteCapstoneRetrieval,
  ...operationMeaningRetrieval,
  ...calculationStructureRetrieval,
  ...fractionDecimalMeaningRetrieval,
  ...measurementMeaningRetrieval,
  ...wordProblemMeaningRetrieval,
  ...integerStructureRetrieval,
  ...decimalStructureRetrieval,
  ...fractionStructureRetrieval,
  ...additiveFractionRetrieval,
  ...equationMeaningRetrieval,
  ...geometryConservationRetrieval,
  ...dataMeaningRetrieval,
  ...fractionMultiplicativeRetrieval,
  ...percentMeaningRetrieval,
  ...ratioMeaningRetrieval,
  ...signedMeaningRetrieval,
  ...algebraMeaningRetrieval,
  ...circleMeaningRetrieval,
  ...chanceMeaningRetrieval,
  ...appliedMeaningRetrieval,
  ...rationalMeaningRetrieval,
  ...polynomialMeaningRetrieval,
  ...linearMeaningRetrieval,
  ...planeMeaningRetrieval,
  ...cartesianMeaningRetrieval,
  ...inferenceMeaningRetrieval,
  ...identityMeaningRetrieval,
  ...factorMeaningRetrieval,
  ...systemMeaningRetrieval,
  ...inequalityMeaningRetrieval,
  ...functionMeaningRetrieval,
  ...congruenceMeaningRetrieval,
  ...pythagoreanMeaningRetrieval,
  ...researchMeaningRetrieval,
  B03: {
    id: 'B03-MAINT-B01',
    unit: 'B03',
    title: t(
      '计算之后，再看数的结构',
      'After calculating, revisit number structure',
    ),
    bridge: 'B01-L01',
    intro: t(
      '九题可分多次，每次只做一题或一个小问，不计时。先自行生成数字、图或理由，再核查；解释题只有全部小问核齐后才由家长确认。读题或发音可获得语言帮助，数学提示另行记录。',
      'Split these nine tasks across sittings, one task or subpart at a time, without a timer. Generate numbers, diagrams or reasons before checking; a parent confirms an explanation only after EVERY subpart is reviewed. Reading or pronunciation assistance is allowed; distinguish it from mathematical hints.',
    ),
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 2, 3, 4, 5].map((lesson, i) => [
        'B03-MAINT-B01-Q' + (i + 1),
        'B01-L0' + lesson,
      ]),
    ),

    questions: [
      numberTask(
        'B03-MAINT-B01-Q1',
        '虚构图书清单记录“四万零八百零六”本书。把本数写成数字，保留需要的占位零。',
        'A fictional library list records forty thousand eight hundred and six books. Write the count in digits, keeping necessary placeholder zeros.',
        '40806',
        'whole-number-reading',
        [
          [
            '先把万、千、百、十、个各留一格。',
            'Reserve places for ten-thousands, thousands, hundreds, tens and ones.',
          ],
          [
            '没有千和十，也要让百和个保持原位。',
            'Empty thousands and tens must still hold the other digits in place.',
          ],
        ],
        [
          [
            '40,000+800+6=40,806。千位和十位的零不能删去。',
            '40,000+800+6=40,806. Keep zeros in the thousands and tens places.',
          ],
        ],
        ['4806', '4086', '40860'],
      ),
      numberTask(
        'B03-MAINT-B01-Q2',
        '计算前先展开：7,604=7,000+□+4。方框表示数字6的值，是多少？',
        'Expand before calculating: 7,604=7,000+□+4. What value does digit 6 contribute in the box?',
        '600',
        'place-value',
        [
          [
            '从右向左找个、十、百。',
            'Locate ones, tens and hundreds from the right.',
          ],
          [
            '区别“有6个百”与“有6个一”。',
            'Distinguish six hundreds from six ones.',
          ],
        ],
        [
          [
            '6在百位，6×100=600；7,000+600+4=7,604。',
            'Six is in hundreds: 6×100=600; 7,000+600+4=7,604.',
          ],
        ],
        ['6', '60', '6000'],
      ),
      numberTask(
        'B03-MAINT-B01-Q3',
        '估算用的数轴从400到600分成10个等距区间，P在从400向右第4个区间的终点。把460、P和500从小到大排，写中间的数。',
        'An estimation number line from 400 to 600 has ten equal intervals. P ends the fourth interval to the right of 400. Order 460, P and 500 from least to greatest; enter the middle value.',
        '480',
        'whole-number-line',
        [
          [
            '数区间而不是数刻度点；先求每个区间的数值差。',
            'Count intervals, not tick marks; find the value of each interval.',
          ],
          [
            '从起点加上四个相同的差，再比较三个数。',
            'Add four equal increments to the start, then compare the three values.',
          ],
        ],
        [
          [
            '每格(600−400)÷10=20；P=400+4×20=480，所以460<480<500。',
            'Each interval is (600−400)÷10=20; P=400+4×20=480, so 460<480<500.',
          ],
        ],
        ['80', '460', '500', '404'],
        {
          kind: 'axis',
          start: 400,
          end: 600,
          divisions: 10,
          point: 480,
          label: 'P',
          labelMode: 'endpoints',
        },
      ),
      reasoning(
        'B03-MAINT-B01-Q4',
        t(
          '检查估算：小安把4,499先到最近的百得到4,500，再到最近的千得到5,000，声称这就是4,499到最近的千。请直接用相邻千数与距离判断，并解释为什么不能总是连续舍入。',
          'Check an estimate: Ana rounds 4,499 to the nearest hundred, getting 4,500, then to the nearest thousand, getting 5,000. She claims this rounds the original number to the nearest thousand. Use adjacent thousands and distances directly, and explain why repeated rounding is unreliable.',
        ),
        'rounding',
        t(
          '相邻千数为4,000和5,000；原数到它们的距离分别499、501，因此到最近的千是4,000。先到百把原数推到了千位中点4,500，再按五入到5,000，改变了判断。应从原始数直接按所需数位舍入，不拿估算证明精确答案。',
          'Adjacent thousands are 4,000 and 5,000, at distances 499 and 501 from the original, so the nearest thousand is 4,000. Rounding first to hundreds moves the number to midpoint 4,500; rounding that midpoint up gives 5,000 and changes the decision. Round the original directly to the required place; an estimate does not prove an exact calculation.',
        ),
        [
          t(
            '比较原始数到两端的距离。',
            'Compare distances from the original number to both ends.',
          ),
          t(
            '第一次舍入后还是原来那个数吗？',
            'Is the first rounded value still the original number?',
          ),
        ],
      ),
      reasoning(
        'B03-MAINT-B01-Q5',
        t(
          '用十进制图说明403−178：把403改画成3个百、9个十、13个一，数量是否改变？为什么不是3个百、10个十、13个一？再完成减法并用加法检查。可以画图或用文字写步骤。',
          'Use a base-ten diagram for 403−178. Does regrouping 403 as three hundreds, nine tens and thirteen ones change its value? Why not three hundreds, ten tens and thirteen ones? Finish the subtraction and check with addition. Draw or write the steps.',
        ),
        'base-ten-model',
        t(
          '4百0十3一先换成3百10十3一，再把一个十换10个一，成为3百9十13一，总值仍300+90+13=403；3百10十13一却是413，多算了换出的十。逐位减得2百2十5一，即225；225+178=403。核查换组守恒，不能只看最后225。',
          'Four hundreds, zero tens and three ones becomes three hundreds, ten tens and three ones. Exchange one ten for ten ones to get three hundreds, nine tens and thirteen ones: 300+90+13=403. Three hundreds, ten tens and thirteen ones instead totals 413, counting the exchanged ten twice. Subtract to get two hundreds, two tens and five ones, or 225; 225+178=403. Check conserved value during regrouping, not only the final 225.',
        ),
        [
          t(
            '每次换出一个大单位，要从原列减去它。',
            'Remove each larger unit that is exchanged.',
          ),
          t(
            '先把两种图都展开求总值，再逐位减。',
            'Expand both diagrams to check value, then subtract by place.',
          ),
        ],
      ),
      ...numberStructureTasks.B03,
    ],
  },
  B05: {
    id: 'B05-MAINT-B01',
    unit: 'B05',
    title: t(
      '读图之后，再看数的结构',
      'After reading charts, revisit number structure',
    ),
    bridge: 'B01-L01',
    intro: t(
      '九题可分多次，每次只做一题或一个小问，不计时。先自行生成数字、图或理由，再核查；解释题只有全部小问核齐后才由家长确认。读题或发音可获得语言帮助，数学提示另行记录。',
      'Split these nine tasks across sittings, one task or subpart at a time, without a timer. Generate numbers, diagrams or reasons before checking; a parent confirms an explanation only after EVERY subpart is reviewed. Reading or pronunciation assistance is allowed; distinguish it from mathematical hints.',
    ),
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 2, 3, 4, 5].map((lesson, i) => [
        'B05-MAINT-B01-Q' + (i + 1),
        'B01-L0' + lesson,
      ]),
    ),

    questions: [
      numberTask(
        'B05-MAINT-B01-Q1',
        '虚构步道年访问表写着“六万零七十人次”。把人次数写成数字；这里不是60,700。',
        'A fictional annual track-visits table records sixty thousand and seventy visits. Write the count in digits; this is not 60,700.',
        '60070',
        'whole-number-reading',
        [
          ['先分开六万与七十。', 'Separate sixty thousand from seventy.'],
          [
            '每一数位都留位置，不把七十写成七百。',
            'Keep a place for every digit; seventy is not seven hundred.',
          ],
        ],
        [
          [
            '60,000+70=60,070，千、百和个位都需占位。',
            '60,000+70=60,070; thousands, hundreds and ones need placeholders.',
          ],
        ],
        ['60700', '6070', '60007'],
      ),
      numberTask(
        'B05-MAINT-B01-Q2',
        '虚构表格的一行记31,040人次。写成30,000+□+40时，方框表示数字1的值，是多少？',
        'A row of a fictional table records 31,040 visits. In expansion 30,000+□+40, what value does digit 1 contribute?',
        '1000',
        'place-value',
        [
          ['把数字与其所在数位分开。', 'Distinguish a digit from its place.'],
          [
            '从右向左经过个、十、百，再到这个1。',
            'From the right pass ones, tens and hundreds before reaching this 1.',
          ],
        ],
        [
          [
            '1在千位，表示1,000；30,000+1,000+40=31,040。',
            'One is in thousands and contributes 1,000; 30,000+1,000+40=31,040.',
          ],
        ],
        ['1', '100', '10000'],
      ),
      numberTask(
        'B05-MAINT-B01-Q3',
        '人数刻度从200到500分成6个等距区间，P在从200向右第5个区间的终点。比较400、P和475，写从小到大排列时的中间数。',
        'A count scale from 200 to 500 has six equal intervals. P ends the fifth interval to the right of 200. Order 400, P and 475 from least to greatest; enter the middle value.',
        '450',
        'whole-number-line',
        [
          [
            '整段差是两个端点之差；不是从零开始。',
            'Use the difference between endpoints; the scale does not start at zero.',
          ],
          [
            '先算每段差，再把五段加到起点，最后排序。',
            'Find one interval, add five intervals to the start, then order.',
          ],
        ],
        [
          [
            '每格(500−200)÷6=50；P=200+5×50=450，400<450<475。',
            'Each interval is (500−200)÷6=50; P=200+5×50=450 and 400<450<475.',
          ],
        ],
        ['250', '400', '475', '205'],
        {
          kind: 'axis',
          start: 200,
          end: 500,
          divisions: 6,
          point: 450,
          label: 'P',
          labelMode: 'endpoints',
        },
      ),
      reasoning(
        'B05-MAINT-B01-Q4',
        t(
          '一份虚构访问表的精确人数为7,849，简报要求到最近的百。用相邻百数及距离解释应写多少。若活动必须给每位来访者各一张票，能直接用这个估数决定足够的票数吗？',
          'A fictional visits table gives an exact count of 7,849. A summary asks for the nearest hundred. Explain the rounded count using adjacent hundreds and distances. If every visitor must receive one ticket, can that estimate alone determine enough tickets?',
        ),
        'rounding',
        t(
          '相邻百数7,800与7,900，距离49与51，所以简报约7,800。必须逐人发票时7,800比精确7,849少49，不够；在一人一票且没有其他需求的题设下至少要7,849张。估算须说明用途；若整百购买，为保证够用可取7,900，但这是向上满足约束，不是把最近百数规则改成一律向上。',
          'Adjacent hundreds are 7,800 and 7,900, at distances 49 and 51; the summary is about 7,800. For one ticket each, 7,800 is short of the exact 7,849 by 49. At least 7,849 tickets are needed under the stated conditions. State the purpose of an estimate. If buying whole hundreds, 7,900 ensures enough, but that is rounding up to meet a constraint, not a rule that nearest-hundred rounding always goes up.',
        ),
        [
          t(
            '先找原始数两侧的整百，再比较距离。',
            'Locate adjacent hundreds and compare distances.',
          ),
          t(
            '“最近”与“保证每人都有”是同一个问题吗？',
            'Are nearest and enough for everyone the same question?',
          ),
        ],
      ),
      reasoning(
        'B05-MAINT-B01-Q5',
        t(
          '读图用的十进制卡代表人数：4张百卡、12张十卡、6张一卡。把10张十卡换成1张百卡后，卡片张数变少，代表的总人数是否也变少？画或写换前与换后的表示、总值，并解释。',
          'Base-ten cards represent a visitor count: four hundred-cards, twelve ten-cards and six one-cards. Exchange ten ten-cards for one hundred-card. Fewer cards remain: does the represented visitor count also fall? Draw or write both representations and totals, and explain.',
        ),
        'base-ten-model',
        t(
          '换前4×100+12×10+6=526；10个十与1个百等值，换后5×100+2×10+6=526。卡片张数从22减到13，但卡片有不同单位值，不能把张数当人数。总人数不变；图应显示成组的十与一个百等量，不仅写“不变”。',
          'Before exchange, 4×100+12×10+6=526. Ten tens and one hundred have equal value; afterwards 5×100+2×10+6=526. Card count falls from 22 to 13, but the cards have different unit values, so their number is not the represented visitor count. The value stays fixed. A diagram should show equal values for the ten tens and one hundred, not merely state unchanged.',
        ),
        [
          t(
            '先分别求各种卡代表的值，而不是只数卡片。',
            'Find the represented value of each card type, not just how many cards.',
          ),
          t(
            '10个十和1个百各表示多少？',
            'What value do ten tens and one hundred each represent?',
          ),
        ],
      ),
      ...numberStructureTasks.B05,
    ],
  },
};

export type MaintenanceUnit = keyof typeof maintenanceSets;
assertMaintenanceOwners(Object.values(maintenanceSets));

export const maintenanceForUnit = (
  unit: string | undefined,
): MaintenanceSet[] =>
  Object.values(maintenanceSets).filter((set) => set.unit === unit);

export function maintenanceHref(set: MaintenanceSet, question?: string) {
  const params = new URLSearchParams();
  if (maintenanceForUnit(set.unit)[0]?.id !== set.id) params.set('set', set.id);
  if (question) params.set('question', question);
  const query = params.toString();
  return `/math/unit/${set.unit}/maintenance${query ? `?${query}` : ''}`;
}
export const recurrenceEvidence = [
  ...foundationRecurrence,
  ...primaryRecurrence,
  ...earlyAlgebraRecurrence,
  ...fractionRecurrence,
  ...geometryDataRecurrence,
  ...fractionOperationsRecurrence,
  ...percentRecurrence,
  ...relationsRecurrence,
  ...primaryCapstoneRecurrence,
  ...coreAlgebraRecurrence,
  ...geometryGraphRecurrence,
  ...polynomialSystemRecurrence,
  ...inequalityFunctionRecurrence,
  ...congruenceMotionRecurrence,
  ...dataEnquiryRecurrence,
  ...rootQuadraticRecurrence,
  ...probabilityProcessRecurrence,
  ...similarityCircleTrigRecurrence,
  ...integrationAuditRecurrence,
  ...logicFunctionRecurrence,
  ...exponentialLogRecurrence,
  ...circularRecurrenceEvidence,
  ...vectorLanguageRecurrence,
  ...spatialStructureRecurrence,
  ...sequenceRecurrenceEvidence,
  ...dataLanguageRecurrence,
  ...complexRecurrenceEvidence,
  ...conicDefinitionRecurrence,
  ...spaceVectorRecurrence,
  ...countingStructureRecurrence,
  ...derivativeMeaningRecurrence,
  ...functionAnalysisRecurrence,
  ...statisticsRecurrence,
  ...problemSolvingRecurrence,
  ...optimisationRecurrenceEvidence,
  ...calculusIntegralRecurrence,
  ...distributionRecurrenceEvidence,
  ...inferenceRecurrenceEvidence,
  ...advancedEquationRecurrenceEvidence,
  ...analyticGeometryRecurrenceEvidence,
  ...postRouteRecurrenceEvidence,
  {
    skill: 'whole-number-reading',
    focus: t('大数读写', 'Reading and writing larger numbers'),
    sourceLesson: 'B01-L01',
    sourceTask: 'B01-L01-Q2',
    targets: [
      'B03-MAINT-B01-Q1',
      'B05-MAINT-B01-Q1',
      'B03-MAINT-B01-Q6',
      'B05-MAINT-B01-Q6',
    ],
    rationale: t(
      '两处Q1由读法生成数字；新Q6反向读回20,305/40,506、展开并解释逗号可省与删除内部零改位。接受熟悉语言或读题协助，不以英文发音评数学。',
      'Both Q1s generate numerals from names. New Q6s read back20,305/40,506, expand them and distinguish optional commas from value-changing internal-zero deletion. Familiar languages/reading support are accepted without scoring English pronunciation.',
    ),
  },
  {
    skill: 'place-value',
    focus: t('位值与展开', 'Place value and expansion'),
    sourceLesson: 'B01-L02',
    sourceTask: 'B01-L02-Q2',
    targets: [
      'B03-MAINT-B01-Q2',
      'B05-MAINT-B01-Q2',
      'B03-MAINT-B01-Q6',
      'B05-MAINT-B01-Q6',
    ],
    rationale: t(
      '两处Q2重建百/千贡献；新Q6各从原数分别移一张数字卡、整数乘10、千位增加1，生成三个新数和变化量，区分一张卡贡献十倍与总数十倍。',
      'Both Q2s rebuild hundreds/thousands contributions. New Q6s independently move one card, multiply the entire number by ten and increment thousands, generating every result/change and separating card-contribution scaling from whole-number scaling.',
    ),
  },
  {
    skill: 'whole-number-line',
    focus: t('数轴、比较与排序', 'Number lines, comparison and ordering'),
    sourceLesson: 'B01-L03',
    sourceTask: 'B01-L03-Q3',
    targets: [
      'B03-MAINT-B01-Q3',
      'B05-MAINT-B01-Q3',
      'B03-MAINT-B01-Q7',
      'B05-MAINT-B01-Q7',
    ],
    rationale: t(
      'Q3从非零起点定位；新Q7各判最高不同数位/位数，再从两张完整窗口表重建同P/Q及差，解释改窗不改数值顺序；亲修非统一图距，不以纸上位置当数值。',
      'Q3s locate from nonzero origins. New Q7s compare the highest differing place/digit lengths, independently reconstruct the SAME P/Q and difference from two complete windows, explain invariant values/order and repair an inconsistently spaced scale.',
    ),
  },
  {
    skill: 'rounding',
    focus: t('直接舍入与估算', 'Direct rounding and estimation'),
    sourceLesson: 'B01-L04',
    sourceTask: 'B01-L04-Q6',
    targets: [
      'B03-MAINT-B01-Q4',
      'B05-MAINT-B01-Q4',
      'B03-MAINT-B01-Q8',
      'B05-MAINT-B01-Q8',
      'B03-L05-Q5',
      'P52-L02-Q5',
    ],
    rationale: t(
      'Q4核原数直接舍入与足量；新Q8逐行重建邻居、中点、距离与所需精度，19,995到十和99,950到百的中点连续进位亲生成，不以不同精度结果相异判错，原精确值保留。另B03-L05-Q5对199m/302m、P52-L02-Q5对1.24km/2.67km分别先舍入各量再估合计，并区分精确合计，补齐多量估算子目标。',
      'Q4s audit direct rounding and sufficiency. New Q8s generate neighbours, midpoint, distances and requested precision, including actual halfway carries at19,995/tens and99,950/hundreds, retaining exact inputs and distinguishing valid different precisions. B03-L05-Q5 and P52-L02-Q5 additionally round EACH of199m/302m or1.24km/2.67km before estimating sums, distinguishing approximate from exact totals.',
    ),
  },
  {
    skill: 'base-ten-model',
    focus: t('十进制换组守恒', 'Conserved value in base-ten exchanges'),
    sourceLesson: 'B01-L05',
    sourceTask: 'B01-L05-Q6',
    targets: [
      'B03-MAINT-B01-Q5',
      'B05-MAINT-B01-Q5',
      'B03-MAINT-B01-Q9',
      'B05-MAINT-B01-Q9',
    ],
    rationale: t(
      '原Q5保换组守恒；新Q9从单位值100/10/1与实际数量表亲画同块数不同值的320/302或430/403，并双向换1百/10十，核新块数14/16、总值不变与内部零。',
      'Original Q5s retain exchange conservation. New Q9s use given100/10/1 unit values and type counts to draw equal-block-count but unequal-value320/302 or430/403 diagrams, exchange in BOTH directions and check14/16 new blocks, invariant totals and placeholders.',
    ),
  },
  {
    skill: 'part-whole-operation',
    focus: t('整体与部分', 'Wholes and parts'),
    sourceLesson: 'B02-L01',
    sourceTask: 'B02-L01-Q2',
    targets: [
      'B03-L01-Q5',
      'B06-L02-Q6',
      'B06-MAINT-OPERATIONS-Q1',
      'P51-MAINT-OPERATIONS-Q1',
    ],
    rationale: t(
      'B03把原有书与新增书合成整体；B06保持9+未知部分=24的关系，解释问号位置改变时为何用加或减。两处都要求重新生成结果或理由，保留整体、部分及逆向核查。 新B06/P51各Q1生成合并、拿走、未移物的比较、整体已含已知部分四种图式，并独立预测新增1的变化。',
      'B03 combines existing and newly received books into a whole. B06 keeps 9+unknown part=24 and explains why moving the unknown changes the required operation. Both regenerate an answer or argument using whole-part structure and an inverse check. New B06/P51 Q1s generate combining, removal, unchanged-object comparison and included-part models, plus an independent one-more prediction.',
    ),
  },
  {
    skill: 'comparison-difference',
    focus: t('比较中的差', 'Differences in comparisons'),
    sourceLesson: 'B02-L01',
    sourceTask: 'B02-L01-Q3',
    targets: [
      'B05-L05-Q3',
      'B06-L02-Q3',
      'B06-L02-Q5',
      'B06-MAINT-OPERATIONS-Q1',
      'P51-MAINT-OPERATIONS-Q1',
    ],
    rationale: t(
      'B05从同一人数图读出公交10与步行8的差2；B06比较17m与9m得差8，并由Mina有9张且比Noah多4张反求Noah的5张。比较不要求拿走物体，“多”也不能机械触发加法。 新两组Q1在拿走和未移动两组中分别画同一减法的不同含义，保留两组原量与差/总量区分。',
      'B05 reads a difference of two between bus count ten and walking count eight on one chart. B06 compares 17m with 9m, then works backwards from Mina having nine cards, four more than Noah, to Noah having five. Comparison need not remove objects, and the word more does not mechanically imply addition. New Q1s draw different meanings of the same subtraction for removal versus two unmoved groups, retaining original amounts and separating difference from combined total.',
    ),
  },
  {
    skill: 'equal-groups-array',
    focus: t('等组与阵列', 'Equal groups and arrays'),
    sourceLesson: 'B02-L02',
    sourceTask: 'B02-L02-Q6',
    targets: [
      'B03-L02-Q6',
      'B06-L05-Q4',
      'B06-MAINT-OPERATIONS-Q2',
      'P51-MAINT-OPERATIONS-Q2',
    ],
    rationale: t(
      'B03纠正6×(5+3)只给一行加3的错误，须把余下的3重复六行；B06把4cm×3cm的区域解释为三行、每行四个1cm²方格，共12cm²。两处把等组或阵列连接到乘法，而不是把组数与每组量相加。 新两组Q2亲画阵列并说明换行列后的角色，按实际2/4/7或3/5/9修不等组，并区分零组与有组每组零。',
      'B03 repairs counting the remaining three only once in 6×(5+3), instead of repeating them across six rows. B06 interprets a 4cm by 3cm region as three rows of four 1cm² cells, totalling 12cm². Both connect equal groups or arrays to multiplication rather than adding group count and group size. New Q2s generate arrays and swapped row/column roles, repair unequal 2/4/7 or 3/5/9 groups, and distinguish zero groups from existing empty groups.',
    ),
  },
  {
    skill: 'sharing-grouping',
    focus: t('平均分与包含', 'Sharing and grouping'),
    sourceLesson: 'B02-L03',
    sourceTask: 'B02-L03-Q6',
    targets: [
      'P51-L03-G',
      'P51-L03-Q5',
      'P61-L04-G',
      'P61-L05-Q6',
      'B06-MAINT-OPERATIONS-Q3',
      'P51-MAINT-OPERATIONS-Q3',
    ],
    rationale: t(
      'P51先把24张卡分四行求每行6张，再将25张按每袋6张核查四满袋余1张，复现平均分与包含两种未知角色。P61把3/4L平均给两人得每人3/8L，再区分2L按每份3/4L的8/3份、两满份和余1/2L。两个后续单元都含两种除法意义；完整卡片与可分液体的范围及“份”“升”不能混淆。 新两组Q3用29/6或38/7及整除、零总量分别求分享/满箱/全部容器，余数正才加箱，另可分液体保精确分式及单位。',
      'P51 shares 24 cards into four rows to find six per row, then groups 25 cards six per bag to check four full bags and one card left. P61 shares 3/4L between two people to get 3/8L each, then distinguishes 8/3 portions of size 3/4L from two full portions and 1/2L left. Both later units use sharing and grouping; respect indivisible cards versus divisible liquid and distinguish portion counts from litres. New Q3s use 29/6 or 38/7, exact-divisibility and zero-total cases to distinguish sharing, full boxes and minimum all-item containers, adding a box only for positive remainder and retaining exact divisible-liquid shares.',
    ),
  },
  {
    skill: 'inverse-multiplication',
    focus: t('用乘法核查除法', 'Checking division with multiplication'),
    sourceLesson: 'B02-L04',
    sourceTask: 'B02-L04-Q6',
    targets: [
      'B03-L04-Q6',
      'P55-L04-Q3',
      'P55-L04-Q6',
      'B06-MAINT-OPERATIONS-Q4',
      'P51-MAINT-OPERATIONS-Q4',
    ],
    rationale: t(
      'B03用201×5=1005及21×5=105检查商的占位零；P55从4x=5求精确因数5/4，又解释0x=0不能唯一确定x、0x=5无解。两处用乘法关系核查逆向恢复因数，后者明确保留非零除数条件，不能由乘回成立就允许除零。 新两组Q4逐行核非零、等因数、零组、零每组与双零，保两种商角色及相同字面式，亲自给出两个不同的□值满足0×□=0，说明反推不唯一，不能据此允许除零。',
      'B03 checks quotient placeholders with 201×5=1005 and 21×5=105. P55 recovers exact factor 5/4 from 4x=5 and explains why 0x=0 does not determine a unique x while 0x=5 has no solution. Both use multiplication to check recovered factors; the latter explicitly retains the nonzero-divisor condition rather than treating a multiplication check as permission to divide by zero. New Q4s audit nonzero, equal-factor, zero-group, zero-size and double-zero rows, retain quotient roles despite identical expressions, and generate distinct zero-product witnesses without authorising zero division.',
    ),
  },
  {
    skill: 'operation-relationship',
    focus: t('按数量关系选运算', 'Choosing operations from relationships'),
    sourceLesson: 'B02-L05',
    sourceTask: 'B02-L05-Q6',
    targets: [
      'B06-L03-Q6',
      'P51-L01-Q5',
      'B06-MAINT-OPERATIONS-Q5',
      'P51-MAINT-OPERATIONS-Q5',
    ],
    rationale: t(
      'B06解释四盒每盒6张、合计送出5张应为4×6−5，4×(6−5)改变送出对象；P51从预算3000与十八套每套125生成3000−18×125=750。两处按数量角色决定先求等组总量，再从整体扣除，而不是见数就加减或按关键词猜。 新两组Q5依未知量和单位分别选择四种运算，再构造预算内的整数两物品采购修改，核成本、超额与余额，允许多种有效方案。',
      'B06 explains why four boxes of six cards with five given away in total requires 4×6−5, while 4×(6−5) changes what is removed. P51 constructs 3000−18×125=750 from a budget and eighteen identically priced sets. Both choose operations from quantity roles: form an equal-group total, then subtract from a whole. New Q5s select all four operations from unknown roles/units, then construct integer two-item budget repairs, checking costs, excess and balance while accepting multiple valid plans.',
    ),
  },
];
