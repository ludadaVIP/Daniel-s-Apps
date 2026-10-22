import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
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
    title: [
      '建立现实问题的数学模型',
      'Building a real-world mathematical model',
    ],
    objective: [
      '把雨量、面积、收集率和储水顺序转成带单位的逐日水量模型。',
      'Translate rainfall, area, collection fraction and storage order into a daily water-balance model with units.',
    ],
    hook: [
      '五天总雨水够用，为什么第三天仍可能缺水？',
      'Why might day three run short even when total rainwater over five days is enough?',
    ],
    prerequisites: ['H28-L01', 'H02-L06', 'H07-L01'],
    keywords: [
      ['变量与单位', 'variables and units'],
      ['水量平衡', 'water balance'],
      ['模型假设', 'model assumptions'],
    ],
    lab: 'capstone-model',
    hints: [
      [
        '先用1mm×1m²=1L换算，再乘收集率；把期初、进水和容量分开。',
        'Use 1 mm × 1 m² = 1 L, then multiply by collection fraction; separate opening storage, inflow and capacity.',
      ],
      [
        '先收至容量上限，多余溢流；再供应min(需求,存水)，余量不能负。',
        'Collect up to capacity, spill excess, then serve min(demand,stored). Storage cannot be negative.',
      ],
    ],
    items: [
      {
        stem: [
          '虚构雨水项目：屋顶20m²，收集率3/4，雨量[6,0,0,6,0]mm，每天需求30L，初始0，先收雨至容量C再用水，无蒸发或备用水。 第一天下雨6mm，入箱前共收集多少升？',
          'Fictional rainwater project: roof 20 m², collection fraction 3/4, rain [6,0,0,6,0] mm, demand 30 L/day, initial zero. Collect up to capacity C before use, with no evaporation or backup. Day one has 6 mm of rain. How many litres are collected before tank capacity is applied?',
        ],
        answer: {
          kind: 'number',
          value: '90',
        },
        step: [
          '20×6×3/4=90L，面积乘毫米已是升，不再乘1000。',
          '20×6×3/4=90 L; square metres times millimetres already give litres, with no extra factor 1000.',
        ],
        wrong: ['120', '90000'],
      },
      {
        stem: [
          '同一模型C=60L，第一天供水后日末存水多少升？',
          'In the same model with C=60 L, what is the closing storage after day-one supply?',
        ],
        answer: {
          kind: 'number',
          value: '30',
        },
        step: [
          '收集90，最多存60，溢流30，再供30，余30。',
          'Collect 90, store at most 60, spill 30, then serve 30 and retain 30.',
        ],
        wrong: ['60', '0'],
      },
      {
        stem: [
          '同一模型C=60L，第一天溢流多少升？',
          'With C=60 L in the same model, what is day-one overflow?',
        ],
        answer: {
          kind: 'number',
          value: '30',
        },
        step: [
          '先收后用，90−60=30L溢出，不是先扣当天需求才考虑容量。',
          'Collect before use: 90−60=30 L spills; do not subtract demand before applying capacity.',
        ],
        wrong: ['0', '60'],
      },
      {
        stem: [
          '面积20m²、收集率3/4，每增加1mm雨量，入箱前收集量增加多少升？',
          'For area 20 m² and fraction 3/4, how many litres before storage correspond to one additional mm of rain?',
        ],
        answer: {
          kind: 'number',
          value: '15',
        },
        step: [
          '20×3/4=15L/mm，先有单位再解释系数。',
          '20×3/4=15 L/mm; interpret the coefficient with its units.',
        ],
        wrong: ['20', '0.75'],
      },
      {
        stem: [
          '同一模型C=60L，第三天没有雨，缺少多少升才能满足需求？',
          'For C=60 L in the same model, day three has no rain. How many litres of demand are unmet?',
        ],
        answer: {
          kind: 'number',
          value: '30',
        },
        step: [
          '前三天日末为30,0,0；第三天供0，需求30，缺30。',
          'Closing stores are 30,0,0; day three serves zero against demand 30, leaving deficit 30.',
        ],
        wrong: ['0', '-30'],
      },
      {
        stem: [
          '写出模型的变量、单位、先后规则和C60首三天账本，解释为什么总量够仍可能缺水。',
          'State variables, units, order and the first three days at C60; explain why enough total inflow can still leave a daily deficit.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '雨量r/mm、面积A/m²、收集率η无量纲、容量与水量/L；1mm×1m²=1L，I=Aηr。期初s加进水，先取b=min(C,s+I)，溢流s+I−b，再供q=min(30,b)，期末b−q，缺口30−q。C60前三天期末30,0,0，第三天缺30；后来的雨不能倒流给第三天，首日溢流也不能留到以后。说明数据虚构、先收后用、无蒸发备用水等假设，现实要重新测量检验。',
            en: 'Use rainfall r in mm, roof A in m², dimensionless η, and capacity and volumes in L. Inflow I=Aηr because 1 mm × 1 m² = 1 L. Let b=min(C,s+I), spill s+I−b, serve q=min(30,b), close at b−q and record deficit 30−q. At C60 the first three closing stores are 30,0,0 and day three is short 30. Later rain cannot serve earlier demand, and spilled water is unavailable later. State fictional data, collection before use, and no evaporation or backup; real deployment requires measurement and validation.',
          },
        },
        step: [
          '雨量r/mm、面积A/m²、收集率η无量纲、容量与水量/L；1mm×1m²=1L，I=Aηr。期初s加进水，先取b=min(C,s+I)，溢流s+I−b，再供q=min(30,b)，期末b−q，缺口30−q。C60前三天期末30,0,0，第三天缺30；后来的雨不能倒流给第三天，首日溢流也不能留到以后。说明数据虚构、先收后用、无蒸发备用水等假设，现实要重新测量检验。',
          'Use rainfall r in mm, roof A in m², dimensionless η, and capacity and volumes in L. Inflow I=Aηr because 1 mm × 1 m² = 1 L. Let b=min(C,s+I), spill s+I−b, serve q=min(30,b), close at b−q and record deficit 30−q. At C60 the first three closing stores are 30,0,0 and day three is short 30. Later rain cannot serve earlier demand, and spilled water is unavailable later. State fictional data, collection before use, and no evaporation or backup; real deployment requires measurement and validation.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '哪个模型操作顺序符合题设？',
        'Which order matches the stated model?',
      ],
      correct: 1,
      options: [
        ['先用水再收雨', 'Use water before collecting'],
        [
          '先收至容量上限，再供当天需求',
          'Collect up to capacity, then serve demand',
        ],
        ['把五天总进水平均分配', 'Average total inflow across all days'],
      ],
      feedback: [
        [
          '这会改变首日是否能用到新雨水。',
          'This changes whether new rainfall can serve day one.',
        ],
        [
          '顺序决定溢流与可供水量。',
          'Order determines spill and available supply.',
        ],
        [
          '实际储水不能把未来进水提前。',
          'Storage cannot move future inflow into the past.',
        ],
      ],
    },
    reason: [
      '为什么不能只写总进水≥总需求？',
      'Why is total inflow ≥ total demand insufficient?',
    ],
    rubric: [
      '时间先后、容量与溢流都约束实际可用水。未来的雨不能补过去的需求，早来的过量水可能已溢出。必须逐日结转非负存水，再检查每一天的缺口，而不只比较五天总和。',
      'Timing, capacity and overflow constrain usable water. Future rainfall cannot meet past demand, and early surplus may already have spilled. Carry nonnegative storage forward day by day and inspect every deficit rather than comparing only totals.',
    ],
    prompts: [
      [
        '哪一步用到了升、毫米和平方米的换算？',
        'Where do litres, millimetres and square metres meet?',
      ],
      [
        '先收后用换成先用后收会改哪一天？',
        'Which day changes if collection and use are reversed?',
      ],
    ],
    misconception: [
      '总量够不保证逐日够；容量与时间不能从模型中删掉。',
      'Enough total water does not ensure daily supply; retain capacity and timing.',
    ],
  },
  {
    title: ['用图表检验假设', 'Testing assumptions with graphs'],
    objective: [
      '区分校准与留出数据，用有单位的残差按事先容差检验候选模型。',
      'Separate calibration from validation data and test a model with unit-bearing residuals against a predeclared tolerance.',
    ],
    hook: [
      '四个点都在直线上，第五个新点一定也在吗？',
      'If four points lie on a line, must a new fifth point lie on it too?',
    ],
    prerequisites: ['H27-L03', 'H27-L05', 'H38-L01'],
    keywords: [
      ['校准与验证', 'calibration and validation'],
      ['有符号残差', 'signed residual'],
      ['容差', 'tolerance'],
    ],
    lab: 'capstone-validation',
    hints: [
      [
        '先用声明模型预测，残差按实测−预测计算，不反号。',
        'Predict with the declared model; residual is observed minus predicted, not the reverse.',
      ],
      [
        '验证前固定5L容差，逐个核绝对残差；改模型后需新验证。',
        'Fix the 5 L tolerance before validation and check each absolute residual. A revised model needs new validation.',
      ],
    ],
    items: [
      {
        stem: [
          '校准点(0,0),(2,30),(4,60),(6,90)，单位(mm,L)。候选V=15r在r=8mm时预测多少L？',
          'Calibration points are (0,0),(2,30),(4,60),(6,90), in (mm,L). What does V=15r predict at r=8 mm?',
        ],
        answer: {
          kind: 'number',
          value: '120',
        },
        step: [
          '15×8=120L；这是模型预测，不是新实测。',
          '15×8=120 L; this is the model prediction, not a new measurement.',
        ],
        wrong: ['105', '15'],
      },
      {
        stem: [
          'r8mm实际收集105L，而模型预测120L。求有符号残差，单位L。',
          'At r=8 mm the observed volume is 105 L and prediction 120 L. Find the signed residual in L.',
        ],
        answer: {
          kind: 'number',
          value: '-15',
        },
        step: [
          '105−120=−15L，模型高估15L。',
          '105−120=−15 L: the model overpredicts by 15 L.',
        ],
        wrong: ['15', '225'],
      },
      {
        stem: [
          '事先规定每个留出点绝对残差≤5L。残差−15L的点合格吗？填true/false。',
          'The predeclared rule requires each held-out absolute residual ≤5 L. Does residual −15 L pass? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          '|−15|=15>5，不因残差为负就合格。',
          '|−15|=15>5; a negative residual is not automatically acceptable.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '无备用水且r=0时，候选V=15r+10预测多少升？',
          'With no extra water source at r=0, how many litres does candidate V=15r+10 predict?',
        ],
        answer: {
          kind: 'number',
          value: '10',
        },
        step: [
          '截距10L暴露零雨量与额外进水假设不一致。',
          'The 10 L intercept exposes conflict with the zero-rain, no-extra-source condition.',
        ],
        wrong: ['0', '15'],
      },
      {
        stem: [
          '改为V=min(15r,105)。留出点(8,105),(10,100)的最大绝对残差是多少L？',
          'For revised V=min(15r,105), what is the maximum absolute residual on held-out points (8,105),(10,100), in L?',
        ],
        answer: {
          kind: 'number',
          value: '5',
        },
        step: [
          '两点预测都105，残差0与−5，最大绝对值5。',
          'Both predictions are 105; residuals are zero and −5, so the largest absolute residual is five.',
        ],
        wrong: ['0', '50'],
      },
      {
        stem: [
          '用校准点、两留出点和5L容差评价直线与上限模型，并说明改模后的验证限制。',
          'Evaluate the line and capped model using calibration, two validation points and a 5 L tolerance, then state the limitation after revision.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '校准点全符合V=15r，但不能证明全域。留出r8实测105而预测120，残差−15；r10实测100而预测150，残差−50，都超5L。上限模型min(15r,105)两点预测105，残差0、−5，按≤5规则当前两点合格；但若由留出数据启发改模，已用它们开发，应收新独立数据。残差不证明溢流或堵塞等具体因果；观察在入箱前，不能把箱内饱和硬套为原因。',
            en: 'All calibration points fit V=15r, which does not prove it universally. At held-out rain eight, prediction 120 versus observed 105 gives −15; at ten, prediction 150 versus observed 100 gives −50, both beyond 5 L. The capped model predicts 105 at both, giving zero and −5, acceptable under the stated ≤5 rule on these points. If the held-out data inspired revision, they have become development data and new independent validation is needed. Residuals do not establish a specific cause such as blockage; measurements are before tank storage, so tank saturation cannot simply be asserted.',
          },
        },
        step: [
          '校准点全符合V=15r，但不能证明全域。留出r8实测105而预测120，残差−15；r10实测100而预测150，残差−50，都超5L。上限模型min(15r,105)两点预测105，残差0、−5，按≤5规则当前两点合格；但若由留出数据启发改模，已用它们开发，应收新独立数据。残差不证明溢流或堵塞等具体因果；观察在入箱前，不能把箱内饱和硬套为原因。',
          'All calibration points fit V=15r, which does not prove it universally. At held-out rain eight, prediction 120 versus observed 105 gives −15; at ten, prediction 150 versus observed 100 gives −50, both beyond 5 L. The capped model predicts 105 at both, giving zero and −5, acceptable under the stated ≤5 rule on these points. If the held-out data inspired revision, they have become development data and new independent validation is needed. Residuals do not establish a specific cause such as blockage; measurements are before tank storage, so tank saturation cannot simply be asserted.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: ['怎样最合理地使用新数据？', 'How should new data be used?'],
      correct: 2,
      options: [
        [
          '看到误差后放宽容差直到通过',
          'Widen tolerance after seeing errors until it passes',
        ],
        [
          '校准拟合好就不用验证',
          'Skip validation after a good calibration fit',
        ],
        [
          '事先定规则，留出检验；改模后再收新数据',
          'Predeclare a rule, validate, then obtain new data after revision',
        ],
      ],
      feedback: [
        [
          '事后改规则削弱检验意义。',
          'Changing the rule afterwards weakens the test.',
        ],
        [
          '拟合与预测检验不是同一证据。',
          'Fit and predictive validation are different evidence.',
        ],
        [
          '区分模型开发与独立检验。',
          'Separate development from independent evaluation.',
        ],
      ],
    },
    reason: [
      '验证图支持模型，就证明模型真实且有因果吗？',
      'Does a supportive validation plot establish truth and causation?',
    ],
    rubric: [
      '只说明当前观测在声明范围、度量与容差下未显示过大偏差。有限数据不能证明所有雨量，也不能区分所有潜在原因。交代测量误差、样本覆盖、留出用途和修模过程，超出范围的结论仍需新证据。',
      'It shows only that current observations do not exhibit excessive error under the stated scope, metric and tolerance. Finite data do not prove every rainfall value or identify all causes. State measurement uncertainty, coverage, validation use and revision history; broader claims need new evidence.',
    ],
    prompts: [
      ['这个点参与过选模型吗？', 'Was this point used to choose the model?'],
      [
        '负残差表示模型高估还是低估？',
        'Does a negative residual mean overprediction or underprediction?',
      ],
    ],
    misconception: [
      '拟合不是验证；容差应预先规定，残差不自动证明因果。',
      'Fit is not validation; predeclare tolerance and do not infer causes from residuals alone.',
    ],
  },
  {
    title: ['比较不同解法的效率', 'Comparing solution methods'],
    objective: [
      '在相同候选与判据下比较调用次数，并先核二分搜索的单调前提。',
      'Compare predicate calls for the same candidates and task, checking monotonicity before using binary search.',
    ],
    hook: [
      '更少的计算若漏掉有效方案，还能算更高效吗？',
      'Can fewer computations count as greater efficiency if they miss a valid plan?',
    ],
    prerequisites: ['H37-L03', 'H37-L05', 'H38-L01'],
    keywords: [
      ['判据调用', 'predicate call'],
      ['单调可行性', 'monotone feasibility'],
      ['最坏情况', 'worst case'],
    ],
    lab: 'capstone-efficiency',
    hints: [
      [
        '每次调用完整模拟五天；候选0..150，共151个，不计实际秒数。',
        'Each call simulates all five days. Candidates 0..150 give 151 values; count calls, not seconds.',
      ],
      [
        '二分只用于false后只会变true的判据；加预算可能形成中间可行窗口。',
        'Use binary search only for an upward-closed predicate; a budget can create a feasible middle window.',
      ],
    ],
    items: [
      {
        stem: [
          '名义雨水模型的每日供水判据在整数容量0..150上单调，最小合格90。按lo0、hi151（不含），mid=floor((lo+hi)/2)，合格令hi=mid，否则lo=mid+1，直到lo=hi。需要几次判据调用？',
          'The nominal daily-supply predicate on integer capacities 0..150 is monotone, first passing at 90. Start lo=0, hi=151 exclusive; test mid=floor((lo+hi)/2), set hi=mid if passing and lo=mid+1 otherwise, until equal. How many predicate calls occur?',
        ],
        answer: {
          kind: 'number',
          value: '7',
        },
        step: [
          '依次试75,113,94,85,90,88,89，共7次。',
          'The tested capacities are 75,113,94,85,90,88,89: seven calls.',
        ],
        wrong: ['8', '90'],
      },
      {
        stem: [
          '同样候选与供水判据，逐个从容量0试到首个合格90，需要几次完整模拟？',
          'For the same candidates and predicate, scanning from zero through first passing capacity 90 requires how many complete simulations?',
        ],
        answer: {
          kind: 'number',
          value: '91',
        },
        step: [
          '0也要测试，所以共91个候选，而非90。',
          'Zero is tested too, giving 91 candidates rather than 90.',
        ],
        wrong: ['90', '151'],
      },
      {
        stem: [
          '151个候选的这种二分，最坏调用上界ceil(log2(152))是多少？',
          'For 151 candidates this binary search has worst-case bound ceil(log2(152)). What is it?',
        ],
        answer: {
          kind: 'number',
          value: '8',
        },
        step: [
          '128<152≤256，向上取对数得8；某次实际7不等于最坏8。',
          '128<152≤256, so the ceiling is eight; an actual seven-call run differs from the worst case.',
        ],
        wrong: ['7', '151'],
      },
      {
        stem: [
          '把判据改成“供水达标且40+2C≤240”。C90合格、C110不合格。可直接沿用上述单调二分吗？填true/false。',
          'Change the predicate to supply met and 40+2C≤240. C90 passes but C110 fails. Is the monotone binary search justified directly? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          '预算让可行集只在90..100，不再是向上封闭。',
          'The budget restricts passing capacities to 90..100, which is not upward-closed.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '名义模型最小合格容量90，若只允许测试0..60且判据单调，应报告存在合格候选吗？填true/false。',
          'If the nominal first passing capacity is 90 but only candidates 0..60 are allowed, does a passing candidate exist? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          '上限仍不合格，当前候选范围无解，不把61当成可选容量。',
          'Even the upper bound fails; this candidate range has no solution, and 61 is not an available candidate.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '公平比较逐个扫描与二分的实际、最坏调用次数，并证明供水单调、反驳含预算判据的盲用。',
          'Compare actual and worst-case calls fairly; justify supply monotonicity and reject blind binary search with a budget.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '候选同为0..150，每次都完整模拟五天、同初值雨量需求。扫描到90共91次，二分试75,113,94,85,90,88,89共7次，151候选二分最坏8次，扫描最坏151。容量更大时min(C,s+I)不小，再减同一需求取非负，归纳得存水不减、缺口不增，供水判据单调。加预算变90..100窗口，C90真C110假，不能套该二分。调用次数不等于实际秒数，比较前需保证都解对同一问题。',
            en: 'Use identical candidates 0..150 and full five-day simulations with the same initial data. Scanning to 90 takes 91 calls; binary tests 75,113,94,85,90,88,89 in seven calls. Worst cases are eight and 151 calls respectively. Greater capacity cannot reduce min(C,s+I); subtracting the same demand and truncating at zero preserves storage order, so induction gives no greater deficit and an upward-closed supply predicate. Adding the budget creates window 90..100, with C90 true and C110 false, invalidating this binary search. Calls are not seconds; establish correctness on the same task before comparing efficiency.',
          },
        },
        step: [
          '候选同为0..150，每次都完整模拟五天、同初值雨量需求。扫描到90共91次，二分试75,113,94,85,90,88,89共7次，151候选二分最坏8次，扫描最坏151。容量更大时min(C,s+I)不小，再减同一需求取非负，归纳得存水不减、缺口不增，供水判据单调。加预算变90..100窗口，C90真C110假，不能套该二分。调用次数不等于实际秒数，比较前需保证都解对同一问题。',
          'Use identical candidates 0..150 and full five-day simulations with the same initial data. Scanning to 90 takes 91 calls; binary tests 75,113,94,85,90,88,89 in seven calls. Worst cases are eight and 151 calls respectively. Greater capacity cannot reduce min(C,s+I); subtracting the same demand and truncating at zero preserves storage order, so induction gives no greater deficit and an upward-closed supply predicate. Adding the budget creates window 90..100, with C90 true and C110 false, invalidating this binary search. Calls are not seconds; establish correctness on the same task before comparing efficiency.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '效率比较首先要固定什么？',
        'What must an efficiency comparison fix first?',
      ],
      correct: 0,
      options: [
        [
          '同一问题、候选、判据及正确性',
          'Same task, candidates, predicate and correctness',
        ],
        ['只看哪段代码更短', 'Only which code is shorter'],
        ['挑最快的一次计时', 'Pick the fastest single timing'],
      ],
      feedback: [
        [
          '再选清晰的成本指标，如完整模拟次数。',
          'Then choose a clear cost measure such as full simulation calls.',
        ],
        ['短代码可能解错或漏解。', 'Shorter code can be wrong or incomplete.'],
        [
          '一次计时受环境影响，也不能代替一般前提。',
          'One timing depends on environment and cannot replace general assumptions.',
        ],
      ],
    },
    reason: [
      '为什么单调供水加预算后可能失去二分前提？',
      'Why can adding a budget destroy monotonicity?',
    ],
    rubric: [
      '容量增加通常改善供水，却同时提高费用。两个约束交集可能只在中间一段成立，较大容量又失败。先把单调的最小供水需求求出，再独立检查预算，或完整枚举目录方案，不能把非单调联合判据硬当单调。',
      'Greater capacity improves supply but also raises cost. The joint condition may hold only in a middle interval and fail again for larger tanks. Find the monotone supply threshold before checking budget independently, or enumerate catalog options; do not assume the combined predicate remains monotone.',
    ],
    prompts: [
      [
        '每次计数是否包含相同的五天模拟？',
        'Does each counted call include the same five-day simulation?',
      ],
      [
        '容量更大时，这个判据还可能变回失败吗？',
        'Can this predicate become false again at a larger capacity?',
      ],
    ],
    misconception: [
      '先保正确再谈效率；实际次数不等于最坏次数，联合约束未必单调。',
      'Establish correctness before efficiency; actual is not worst-case, and joint constraints need not be monotone.',
    ],
  },
  {
    title: ['向他人解释完整推理', 'Presenting a complete argument'],
    objective: [
      '把必要下界与充分构造结合，向他人完整论证名义模型的最小水箱容量。',
      'Combine a necessary lower bound and sufficient construction to present a complete minimal-capacity argument.',
    ],
    hook: [
      '表中90L够用，为什么还不能只凭这一行说它最小？',
      'If a table shows 90 L works, why is that row alone not a minimality proof?',
    ],
    prerequisites: ['H28-L05', 'H37-L01', 'H38-L01'],
    keywords: [
      ['必要与充分', 'necessity and sufficiency'],
      ['最优性证书', 'optimality certificate'],
      ['结论范围', 'scope of conclusion'],
    ],
    lab: 'capstone-argument',
    hints: [
      [
        '前三天只有首日进水，共需90L，先从这段无后续进水期给必要下界。',
        'Only day one brings water for the first three days; their 90 L demand gives a necessary bound.',
      ],
      [
        '再列C90逐日账本证明充分；C100虽够用但不能叫最小。',
        'Then prove sufficiency with C90’s daily ledger; C100 works but is not minimal.',
      ],
    ],
    items: [
      {
        stem: [
          '虚构雨水项目：屋顶20m²，收集率3/4，雨量[6,0,0,6,0]mm，每天需求30L，初始0，先收雨至容量C再用水，无蒸发或备用水。 容量可取任意非负整数升，忽略预算。要覆盖首三天，用总需求推出的必要容量下界是多少L？',
          'Fictional rainwater project: roof 20 m², collection fraction 3/4, rain [6,0,0,6,0] mm, demand 30 L/day, initial zero. Collect up to capacity C before use, with no evaporation or backup. Capacity may be any nonnegative integer litre, ignoring budget. What necessary capacity lower bound follows from the first three days?',
        ],
        answer: {
          kind: 'number',
          value: '90',
        },
        step: [
          '首日收集后最多C升，后两天无进水，却共需3×30=90L。',
          'At most C litres are stored after day-one collection; no further inflow arrives during three demands of 30 L.',
        ],
        wrong: ['60', '30'],
      },
      {
        stem: [
          '名义模型C=100L每天够用。它是最小可行整数容量吗？填true/false。',
          'C=100 L supplies every day in the nominal model. Is it the minimum feasible integer capacity? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'false',
        },
        step: [
          'C90已满足全部需求，100只能证明可行，不能证明最小。',
          'C90 already serves every demand; 100 establishes feasibility, not minimality.',
        ],
        wrong: ['true'],
      },
      {
        stem: [
          '名义模型C=89L，在第三天缺多少L？',
          'In the nominal model at C=89 L, what is day-three deficit in L?',
        ],
        answer: {
          kind: 'number',
          value: '1',
        },
        step: [
          '首日收89供30余59，次日余29，第三天需30缺1。',
          'Day one retains 59 after serving 30; day two retains 29; day three is short one litre.',
        ],
        wrong: ['0', '30'],
      },
      {
        stem: [
          '名义模型C=90L，第四天日末存水多少L？',
          'For C=90 L in the nominal model, what is closing storage on day four, in L?',
        ],
        answer: {
          kind: 'number',
          value: '60',
        },
        step: [
          '第三天余0，第四天收90并供30，余60。',
          'Day three closes at zero; day four collects 90 and serves 30, leaving 60.',
        ],
        wrong: ['30', '90'],
      },
      {
        stem: [
          '在已声明名义模型下，C90同时满足下界并逐日够用。最小容量90的结论成立吗？填true/false。',
          'Within the stated nominal model, C90 meets the lower bound and supplies every day. Is the minimum-capacity conclusion 90 valid? Use true/false.',
        ],
        answer: {
          kind: 'logic-code',
          value: 'true',
        },
        step: [
          '必要排除更小者，充分构造给90可行；两方向合成最小性。',
          'Necessity excludes smaller capacities; the construction makes 90 feasible. Together they establish minimality.',
        ],
        wrong: ['false'],
      },
      {
        stem: [
          '面向没看过题目的人，完整证明名义模型最小整数容量90L，并说明现实与模型的边界。',
          'For a reader new to the problem, prove the nominal minimum integer capacity is 90 L and state the model’s limits.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '先给问题、五天雨量、A20m²、η3/4、每日30L、初始0、先收后用、无备用与蒸发。进水15r；首三天仅首日进水，需90L，收后存量≤C，故C≥90必要。取C90，逐日供水均30，期末60,30,0,60,30，证明充分，C89第三天缺1交叉核验。故在任意非负整数容量域内最小90；目录尺寸和预算尚未加入，天气与效率是虚构固定输入，不能说现实所有天气都有保证。',
            en: 'State the question, five-day rainfall, A20 m², η3/4, demand 30 L/day, initial zero, collection before use and no backup or evaporation. Inflow is 15r. Only day one supplies the first three days, needing 90 L, while storage after collection is at most C; hence C≥90. For C90 every day serves 30 and closing stores are 60,30,0,60,30, proving sufficiency; C89’s one-litre day-three deficit cross-checks the boundary. Thus the minimum among nonnegative integer capacities is 90. Catalog sizes and budget are not yet included; fictional fixed weather and efficiency do not guarantee all real weather.',
          },
        },
        step: [
          '先给问题、五天雨量、A20m²、η3/4、每日30L、初始0、先收后用、无备用与蒸发。进水15r；首三天仅首日进水，需90L，收后存量≤C，故C≥90必要。取C90，逐日供水均30，期末60,30,0,60,30，证明充分，C89第三天缺1交叉核验。故在任意非负整数容量域内最小90；目录尺寸和预算尚未加入，天气与效率是虚构固定输入，不能说现实所有天气都有保证。',
          'State the question, five-day rainfall, A20 m², η3/4, demand 30 L/day, initial zero, collection before use and no backup or evaporation. Inflow is 15r. Only day one supplies the first three days, needing 90 L, while storage after collection is at most C; hence C≥90. For C90 every day serves 30 and closing stores are 60,30,0,60,30, proving sufficiency; C89’s one-litre day-three deficit cross-checks the boundary. Thus the minimum among nonnegative integer capacities is 90. Catalog sizes and budget are not yet included; fictional fixed weather and efficiency do not guarantee all real weather.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '证明“90L最小”需要什么？',
        'What establishes that 90 L is minimal?',
      ],
      correct: 1,
      options: [
        ['只有90L够用的一行', 'Only one row showing 90 L works'],
        [
          '排除全部更小者，并证明90L可行',
          'Exclude every smaller value and prove 90 L works',
        ],
        ['只说图上看起来最小', 'Say it looks smallest on a plot'],
      ],
      feedback: [
        [
          '充分性没有排除更小者。',
          'Sufficiency alone does not exclude smaller values.',
        ],
        [
          '必要下界与充分构造共同给最小性。',
          'A necessary bound and sufficient construction establish minimality together.',
        ],
        ['有限像素不能替代论证。', 'Pixels do not replace an argument.'],
      ],
    },
    reason: [
      '为什么C100可行不能推出它最优？',
      'Why does feasibility of C100 not make it optimal?',
    ],
    rubric: [
      '可行只核这个候选满足需求，最优还要与所有允许更小或更便宜的方案比较。当前有90可行，直接反驳100最小；对90需必要下界覆盖所有更小值，再以账本证明其可行。比较范围和成本目标必须写清。',
      'Feasibility checks one candidate’s constraints; optimality compares all permitted smaller or cheaper options. A feasible 90 directly disproves minimality of 100. For 90, use a necessary bound covering every smaller value plus a sufficient ledger. State the comparison domain and objective.',
    ],
    prompts: [
      [
        '你证明的是够用，还是最小？',
        'Have you proved it works, or that it is minimal?',
      ],
      [
        '没有看过题目的人知道你的假设吗？',
        'Could a reader new to the problem identify your assumptions?',
      ],
    ],
    misconception: [
      '一行可行记录不是最优性证明；结论必须带适用范围。',
      'One feasible row is not an optimality proof; retain the conclusion’s scope.',
    ],
  },
  {
    title: ['终章项目：从问题到模型', 'Final capstone: from question to model'],
    objective: [
      '在目录、预算和明确情景下构造完整可行集合，提交含核验与局限的建模报告。',
      'Construct the complete feasible set under catalog, budget and scenario constraints, then present a model report with checks and limits.',
    ],
    hook: [
      '最小数学容量是90L，为什么最终采购方案却可能是100L，甚至无方案？',
      'If the mathematical minimum is 90 L, why might the final choice be 100 L—or no plan at all?',
    ],
    prerequisites: ['H38-L01', 'H38-L02', 'H38-L03', 'H38-L04'],
    keywords: [
      ['完整可行集合', 'complete feasible set'],
      ['压力情景', 'stress scenario'],
      ['模型报告', 'model report'],
    ],
    lab: 'capstone-project',
    hints: [
      [
        '目录仅0,20,…,160L，费用40+2C筹码。先核供水，再核预算，最后在可行者中比较。',
        'The catalog is 0,20,…,160 L, costing 40+2C toy credits. Check supply, then budget, then compare feasible options.',
      ],
      [
        '名义每日30L需至少90L；高用量每日40L需120L；长干期缺的是进水，增容不能造水。',
        'Nominal demand 30 L/day needs at least 90 L; high use at 40 needs 120 L; the dry spell lacks inflow, which extra capacity cannot create.',
      ],
    ],
    items: [
      {
        stem: [
          '虚构雨水项目：屋顶20m²，收集率3/4，雨量[6,0,0,6,0]mm，每天需求30L，初始0，先收雨至容量C再用水，无蒸发或备用水。 目录仅0,20,…,160L，费用40+2C筹码，预算240。求名义情景全部可行容量集合。',
          'Fictional rainwater project: roof 20 m², collection fraction 3/4, rain [6,0,0,6,0] mm, demand 30 L/day, initial zero. Collect up to capacity C before use, with no evaporation or backup. Catalog sizes are only 0,20,…,160 L; cost 40+2C toy credits, budget 240. Give all feasible nominal capacities as a set.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{100}',
        },
        step: [
          '供水需C≥90，预算C≤100，目录交集只有100。',
          'Supply requires C≥90, budget C≤100, and only 100 belongs to the catalog intersection.',
        ],
        wrong: ['{90}', '{80,100}', '{}'],
      },
      {
        stem: [
          '同一目录与预算240、名义情景，最便宜可行水箱容量是多少L？',
          'For the same catalog, budget 240 and nominal scenario, what capacity is the cheapest feasible tank, in L?',
        ],
        answer: {
          kind: 'number',
          value: '100',
        },
        step: [
          '90不在目录，100是唯一可行，也因费用随C严格增加而最便宜。',
          '90 is absent from the catalog; 100 is the only feasible choice and cost increases with C.',
        ],
        wrong: ['90', '80'],
      },
      {
        stem: [
          '容量100L的虚构采购总费用40+2C是多少筹码？',
          'What is the fictional total cost 40+2C of capacity 100 L, in toy credits?',
        ],
        answer: {
          kind: 'number',
          value: '240',
        },
        step: [
          '固定40加容量费200，共240，正好等于预算。',
          'The fixed 40 plus 200 gives 240, exactly the budget.',
        ],
        wrong: ['200', '280'],
      },
      {
        stem: [
          '改为同时覆盖名义情景和高用量情景：后者雨量[8,0,0,8,0]mm、每日40L，其他不变。预算仍240，求全部可行目录容量集合。',
          'Require both nominal and high-use scenarios: the latter has rain [8,0,0,8,0] mm and demand 40 L/day, with other rules unchanged. At budget 240, give the full feasible catalog set.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{}',
        },
        step: [
          '高用量需C≥120，但预算只允许C≤100，交集空。',
          'High use needs C≥120, but budget allows C≤100; the intersection is empty.',
        ],
        wrong: ['{100}', '{120}'],
      },
      {
        stem: [
          '仍须覆盖名义与高用量情景，预算提高至280筹码，求全部可行目录容量集合。',
          'Still requiring nominal and high-use scenarios, raise budget to 280 toy credits. Give all feasible catalog capacities.',
        ],
        answer: {
          kind: 'finite-set',
          value: '{120}',
        },
        step: [
          '供水C≥120、预算C≤120，所以目录仅120；280边界包含。',
          'Supply requires C≥120 and budget C≤120, leaving catalog size 120; equality at 280 is allowed.',
        ],
        wrong: ['{}', '{100,120}', '{140}'],
      },
      {
        stem: [
          '提交终章报告：比较名义预算240、名义加高用量预算240/280和长干期，写完整模型、可行集、最便宜方案及局限。',
          'Submit the final report comparing nominal budget 240, nominal plus high use at budgets 240/280, and a longer dry spell; include the full model, feasible sets, cheapest plans and limits.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '问题是在目录0,20,…,160中最小化40+2C筹码，同时每个指定情景每天无缺水且费用不超预算。说明数据全虚构，A20m² η3/4，初始0，先收后用，逐日水量按容量截断并扣实际供水。名义需要90但目录至少100；预算240给可行{100}、费用240。高用量首次进水120且前三日需120，联合情景最低120；预算240可行∅，预算280可行{120}费用280，列账本与边界核验。长干期前四日仅90进水却需120，即使大空箱也缺30，无可行目录。报告区分模型事实、假设、校准和验证；现实需雨量、效率、蒸发、维护与需求证据，不承诺所有天气。',
            en: 'Minimise 40+2C toy credits over catalog 0,20,…,160 while meeting every day of each required scenario and staying within budget. State fictional data, A20 m², η3/4, initial zero, collection before use and the daily capped-storage balance. Nominal supply needs 90 but the first catalog size is 100; budget 240 gives feasible {100}, cost 240. High use brings 120 initially and needs 120 over the first three days, so the joint threshold is 120. Budget 240 gives empty set; budget 280 gives {120}, cost 280, checked by ledgers and boundaries. In the dry spell only 90 arrives before four demands total 120; extra empty capacity cannot create the missing 30, so no catalog plan works. Separate model results, assumptions, calibration and validation; real rainfall, capture, evaporation, maintenance and demand evidence are needed without all-weather promises.',
          },
        },
        step: [
          '问题是在目录0,20,…,160中最小化40+2C筹码，同时每个指定情景每天无缺水且费用不超预算。说明数据全虚构，A20m² η3/4，初始0，先收后用，逐日水量按容量截断并扣实际供水。名义需要90但目录至少100；预算240给可行{100}、费用240。高用量首次进水120且前三日需120，联合情景最低120；预算240可行∅，预算280可行{120}费用280，列账本与边界核验。长干期前四日仅90进水却需120，即使大空箱也缺30，无可行目录。报告区分模型事实、假设、校准和验证；现实需雨量、效率、蒸发、维护与需求证据，不承诺所有天气。',
          'Minimise 40+2C toy credits over catalog 0,20,…,160 while meeting every day of each required scenario and staying within budget. State fictional data, A20 m², η3/4, initial zero, collection before use and the daily capped-storage balance. Nominal supply needs 90 but the first catalog size is 100; budget 240 gives feasible {100}, cost 240. High use brings 120 initially and needs 120 over the first three days, so the joint threshold is 120. Budget 240 gives empty set; budget 280 gives {120}, cost 280, checked by ledgers and boundaries. In the dry spell only 90 arrives before four demands total 120; extra empty capacity cannot create the missing 30, so no catalog plan works. Separate model results, assumptions, calibration and validation; real rainfall, capture, evaporation, maintenance and demand evidence are needed without all-weather promises.',
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '完整比较后无可行方案，应该怎样报告？',
        'If the complete comparison gives no feasible plan, what should be reported?',
      ],
      correct: 2,
      options: [
        ['忽略一个约束以凑出答案', 'Ignore a constraint to force an answer'],
        ['把90L当作目录有售', 'Pretend 90 L belongs to the catalog'],
        [
          '报告空集与冲突原因，提出需重新检验的改动',
          'Report the empty set and conflicting constraints, proposing changes for fresh checking',
        ],
      ],
      feedback: [
        [
          '改掉约束会换成另一个问题。',
          'Dropping a constraint changes the problem.',
        ],
        [
          '连续数学解不能代替真实目录。',
          'A continuous mathematical solution does not replace the catalog.',
        ],
        [
          '无解本身有信息，改条件后重新建模核验。',
          'Infeasibility is informative; revise conditions explicitly and recheck.',
        ],
      ],
    },
    reason: [
      '为什么高用量或长干期测试能改变方案，却不说明原计算必定错了？',
      'Why can stress scenarios change a plan without proving the original calculation was wrong?',
    ],
    rubric: [
      '原结论限定名义情景、需求和预算。压力测试改变输入或成功标准，可能改变可行集合；应明确重新计算，而不是把原范围结论冒充全情景保证。若新数据暴露假设不合适，再修改模型并独立验证。',
      'The original conclusion was conditional on nominal inputs, demand and budget. Stress tests change inputs or success criteria and can change the feasible set. Recalculate explicitly rather than turning a scoped result into an all-scenario guarantee. If new evidence challenges assumptions, revise the model and validate independently.',
    ],
    prompts: [
      [
        '哪些约束真正排除了这个方案？',
        'Which constraints actually exclude this plan?',
      ],
      [
        '如果没有可行方案，你能解释冲突而不是硬选吗？',
        'If no plan works, can you explain the conflict without forcing a choice?',
      ],
    ],
    misconception: [
      '目录、预算、供水与情景必须同时成立；无解也是有效建模结果。',
      'Catalog, budget, supply and scenario constraints must all hold; infeasibility is a valid modelling result.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `capstone-${i + 1}`;
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
    `capstone-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h38Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H38-L0${i + 1}`;
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
    unit: 'H38',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`capstone-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `capstone-${i + 1}`,
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

export function h38ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H38-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H38 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let stem: Pair, step: Pair, answer: AnswerSpec;
  if (i === 0) {
    stem = [
      `屋顶${10 * a}m²，收集率${b}/4，雨量2mm。入箱前收集多少L？`,
      `A roof of ${10 * a} m² captures fraction ${b}/4 of 2 mm rainfall. How many litres arrive before tank storage?`,
    ];
    answer = { kind: 'number', value: String(5 * a * b) };
    step = [
      '面积×毫米给升，再乘收集率。',
      'Area times millimetres gives litres; multiply by capture fraction.',
    ];
  } else if (i === 1) {
    const r = b + 3,
      p = 5 * a * r,
      observed = p - a - b;
    stem = [
      `候选V=${5 * a}r，r=${r}mm实测${observed}L。求实测−预测的有符号残差/L。`,
      `Candidate V=${5 * a}r; at r=${r} mm the observation is ${observed} L. Find signed residual observed minus predicted, in L.`,
    ];
    answer = { kind: 'number', value: String(-a - b) };
    step = [
      '先算预测，再从实测中减去预测。',
      'Calculate the prediction, then subtract it from the observation.',
    ];
  } else if (i === 2) {
    const n = 8 * a + b,
      w = Math.ceil(Math.log2(n + 1));
    stem = [
      `${n}个有序候选、false后不再变回的判据。扫描最坏${n}次，指定二分最坏ceil(log2(${n + 1}))次。二分最坏上界比扫描少几次调用？`,
      `There are ${n} ordered candidates with an upward-closed predicate. Linear worst case is ${n} calls; the specified binary worst case is ceil(log2(${n + 1})). How many calls does that worst-case bound save?`,
    ];
    answer = { kind: 'number', value: String(n - w) };
    step = [
      '比较两个最坏上界，不拿一次实际值混比。',
      'Compare both worst-case bounds rather than mixing in one realised run.',
    ];
  } else if (i === 3) {
    const d = 10 * a,
      n = b + 1;
    stem = [
      `初始0，首日进水${d * n}L，随后${b}天无进水，每日需${d}L，先收后用。要覆盖这${n}天，容量必要下界是多少L？`,
      `Initial storage is zero. Day one brings ${d * n} L, followed by ${b} dry days; demand is ${d} L/day, with collection before use. What necessary capacity lower bound covers all ${n} days, in L?`,
    ];
    answer = { kind: 'number', value: String(d * n) };
    step = [
      '整个无后续进水段的需求都要从首日存水供给。',
      'The whole span with no further inflow must be served from day-one stored water.',
    ];
  } else {
    const d = 10 * a,
      min = 20 * Math.ceil((3 * d) / 20),
      top = min + 20 * (b - 1),
      budget = 40 + 2 * top,
      values = Array.from({ length: b }, (_, j) => min + 20 * j);
    stem = [
      `目录0,20,…,300L，费用40+2C筹码、预算${budget}。初始0，五天入水[${3 * d},0,0,${3 * d},0]L，每天需${d}L，先收后用。求全部可行容量集合。`,
      `Catalog 0,20,…,300 L costs 40+2C toy credits with budget ${budget}. Initial zero; five-day inflows [${3 * d},0,0,${3 * d},0] L; demand ${d} L/day, collect before use. Give every feasible capacity.`,
    ];
    answer = { kind: 'finite-set', value: `{${values.join(',')}}` };
    step = [
      '供水需C≥三天需求，预算给C上界，再与目录取交集。',
      'Supply needs C≥three days of demand; intersect the budget upper bound with catalog sizes.',
    ];
  }
  return question(`${id}-R${round}`, i, { stem, step, answer, wrong: ['999'] });
}
export const h38CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H38-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H38-CHECK-Q6', 1, specs[1]!.items[5]!),
  question('H38-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H38-CHECK-Q8', 4, specs[4]!.items[5]!),
];
