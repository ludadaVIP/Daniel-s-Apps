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
  B03: {
    id: 'B03-MAINT-B01',
    unit: 'B03',
    title: t(
      '计算之后，再看数的结构',
      'After calculating, revisit number structure',
    ),
    bridge: 'B01-L01',
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
    ],
  },
};

export type MaintenanceUnit = keyof typeof maintenanceSets;
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
  {
    skill: 'whole-number-reading',
    focus: t('大数读写', 'Reading and writing larger numbers'),
    sourceLesson: 'B01-L01',
    sourceTask: 'B01-L01-Q2',
    targets: ['B03-MAINT-B01-Q1', 'B05-MAINT-B01-Q1'],
    rationale: t(
      '两处都把新的大数读法写成数字并保留内部或末尾占位零；不是抄写已给数字。',
      'Both require generating new larger numerals from number names while retaining internal or final zeros, rather than copying printed digits.',
    ),
  },
  {
    skill: 'place-value',
    focus: t('位值与展开', 'Place value and expansion'),
    sourceLesson: 'B01-L02',
    sourceTask: 'B01-L02-Q2',
    targets: ['B03-MAINT-B01-Q2', 'B05-MAINT-B01-Q2'],
    rationale: t(
      '两处都把数字所在位置解释为百或千的值，并补全展开式。',
      'Both interpret a digit as hundreds or thousands and complete the corresponding expanded form.',
    ),
  },
  {
    skill: 'whole-number-line',
    focus: t('数轴、比较与排序', 'Number lines, comparison and ordering'),
    sourceLesson: 'B01-L03',
    sourceTask: 'B01-L03-Q3',
    targets: ['B03-MAINT-B01-Q3', 'B05-MAINT-B01-Q3'],
    rationale: t(
      '两处都从非零起点按相等区间定位，再比较和排序；刻度与区间数均改变。',
      'Both locate a value from a nonzero origin using equal intervals, then compare and order; scales and interval counts change.',
    ),
  },
  {
    skill: 'rounding',
    focus: t('直接舍入与估算', 'Direct rounding and estimation'),
    sourceLesson: 'B01-L04',
    sourceTask: 'B01-L04-Q6',
    targets: ['B03-MAINT-B01-Q4', 'B05-MAINT-B01-Q4'],
    rationale: t(
      '两处都须用原数与相邻目标倍数的距离解释舍入；分别迁移到检查二次舍入及区分估数与足量约束。',
      'Both explain rounding from the original number using distances to adjacent target multiples, transferring to repeated-rounding errors and sufficient-quantity constraints.',
    ),
  },
  {
    skill: 'base-ten-model',
    focus: t('十进制换组守恒', 'Conserved value in base-ten exchanges'),
    sourceLesson: 'B01-L05',
    sourceTask: 'B01-L05-Q6',
    targets: ['B03-MAINT-B01-Q5', 'B05-MAINT-B01-Q5'],
    rationale: t(
      '两处都要求画或写十进制换组并证明数量守恒，分别用于退位减法与读图中的单位值。',
      'Both require drawing or writing a base-ten exchange and demonstrating conserved value, in regrouping subtraction and represented chart counts.',
    ),
  },
  {
    skill: 'part-whole-operation',
    focus: t('整体与部分', 'Wholes and parts'),
    sourceLesson: 'B02-L01',
    sourceTask: 'B02-L01-Q2',
    targets: ['B03-L01-Q5', 'B06-L02-Q6'],
    rationale: t(
      'B03把原有书与新增书合成整体；B06保持9+未知部分=24的关系，解释问号位置改变时为何用加或减。两处都要求重新生成结果或理由，保留整体、部分及逆向核查。',
      'B03 combines existing and newly received books into a whole. B06 keeps 9+unknown part=24 and explains why moving the unknown changes the required operation. Both regenerate an answer or argument using whole-part structure and an inverse check.',
    ),
  },
  {
    skill: 'comparison-difference',
    focus: t('比较中的差', 'Differences in comparisons'),
    sourceLesson: 'B02-L01',
    sourceTask: 'B02-L01-Q3',
    targets: ['B05-L05-Q3', 'B06-L02-Q3', 'B06-L02-Q5'],
    rationale: t(
      'B05从同一人数图读出公交10与步行8的差2；B06比较17m与9m得差8，并由Mina有9张且比Noah多4张反求Noah的5张。比较不要求拿走物体，“多”也不能机械触发加法。',
      'B05 reads a difference of two between bus count ten and walking count eight on one chart. B06 compares 17m with 9m, then works backwards from Mina having nine cards, four more than Noah, to Noah having five. Comparison need not remove objects, and the word more does not mechanically imply addition.',
    ),
  },
  {
    skill: 'equal-groups-array',
    focus: t('等组与阵列', 'Equal groups and arrays'),
    sourceLesson: 'B02-L02',
    sourceTask: 'B02-L02-Q6',
    targets: ['B03-L02-Q6', 'B06-L05-Q4'],
    rationale: t(
      'B03纠正6×(5+3)只给一行加3的错误，须把余下的3重复六行；B06把4cm×3cm的区域解释为三行、每行四个1cm²方格，共12cm²。两处把等组或阵列连接到乘法，而不是把组数与每组量相加。',
      'B03 repairs counting the remaining three only once in 6×(5+3), instead of repeating them across six rows. B06 interprets a 4cm by 3cm region as three rows of four 1cm² cells, totalling 12cm². Both connect equal groups or arrays to multiplication rather than adding group count and group size.',
    ),
  },
  {
    skill: 'sharing-grouping',
    focus: t('平均分与包含', 'Sharing and grouping'),
    sourceLesson: 'B02-L03',
    sourceTask: 'B02-L03-Q6',
    targets: ['P51-L03-G', 'P51-L03-Q5', 'P61-L04-G', 'P61-L05-Q6'],
    rationale: t(
      'P51先把24张卡分四行求每行6张，再将25张按每袋6张核查四满袋余1张，复现平均分与包含两种未知角色。P61把3/4L平均给两人得每人3/8L，再区分2L按每份3/4L的8/3份、两满份和余1/2L。两个后续单元都含两种除法意义；完整卡片与可分液体的范围及“份”“升”不能混淆。',
      'P51 shares 24 cards into four rows to find six per row, then groups 25 cards six per bag to check four full bags and one card left. P61 shares 3/4L between two people to get 3/8L each, then distinguishes 8/3 portions of size 3/4L from two full portions and 1/2L left. Both later units use sharing and grouping; respect indivisible cards versus divisible liquid and distinguish portion counts from litres.',
    ),
  },
  {
    skill: 'inverse-multiplication',
    focus: t('用乘法核查除法', 'Checking division with multiplication'),
    sourceLesson: 'B02-L04',
    sourceTask: 'B02-L04-Q6',
    targets: ['B03-L04-Q6', 'P55-L04-Q3', 'P55-L04-Q6'],
    rationale: t(
      'B03用201×5=1005及21×5=105检查商的占位零；P55从4x=5求精确因数5/4，又解释0x=0不能唯一确定x、0x=5无解。两处用乘法关系核查逆向恢复因数，后者明确保留非零除数条件，不能由乘回成立就允许除零。',
      'B03 checks quotient placeholders with 201×5=1005 and 21×5=105. P55 recovers exact factor 5/4 from 4x=5 and explains why 0x=0 does not determine a unique x while 0x=5 has no solution. Both use multiplication to check recovered factors; the latter explicitly retains the nonzero-divisor condition rather than treating a multiplication check as permission to divide by zero.',
    ),
  },
  {
    skill: 'operation-relationship',
    focus: t('按数量关系选运算', 'Choosing operations from relationships'),
    sourceLesson: 'B02-L05',
    sourceTask: 'B02-L05-Q6',
    targets: ['B06-L03-Q6', 'P51-L01-Q5'],
    rationale: t(
      'B06解释四盒每盒6张、合计送出5张应为4×6−5，4×(6−5)改变送出对象；P51从预算3000与十八套每套125生成3000−18×125=750。两处按数量角色决定先求等组总量，再从整体扣除，而不是见数就加减或按关键词猜。',
      'B06 explains why four boxes of six cards with five given away in total requires 4×6−5, while 4×(6−5) changes what is removed. P51 constructs 3000−18×125=750 from a budget and eighteen identically priced sets. Both choose operations from quantity roles: form an equal-group total, then subtract from a whole.',
    ),
  },
];
