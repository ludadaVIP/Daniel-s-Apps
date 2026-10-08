import { t } from './content/schema';
import { liftingFieldLimits, liftingState, type LiftingDraft } from './lifting';
import { liftingArms, liftingComparison } from './liftingDesign';
export const liftingFields = [
  {
    key: 'question',
    label: t('我想解决什么问题？', 'What problem will I solve?'),
    hint: t(
      '把实物目标写具体：同一小杯硬币，怎样用更轻的按压抬起来？',
      'Make the physical goal specific: how can a gentler push lift the same small cup of coins?',
    ),
  },
  {
    key: 'prediction',
    label: t('我的预测与理由', 'My prediction and reason'),
    hint: t(
      '手离支点更远，会更容易吗？手要走的距离呢？先写自己的想法。',
      'Will moving your hand farther from the pivot help? What about hand travel? Write your idea first.',
    ),
  },
  {
    key: 'materials',
    label: t('我实际准备的材料', 'My actual materials'),
    hint: t(
      '硬尺、橡皮、小纸杯、少量硬币、胶带；有测力计或电子秤也可用。',
      'A stiff ruler, eraser, small paper cup, a few coins and tape; a force meter or scale is optional.',
    ),
  },
  {
    key: 'procedure',
    label: t('我的比较计划', 'My comparison plan'),
    hint: t(
      '固定杯子、硬币、支点与载荷位置；改变手的位置，至少比较两种设置，再重复其中一种。',
      'Keep the cup, coins, pivot and load position fixed. Compare at least two hand positions, then repeat one.',
    ),
  },
  {
    key: 'construction',
    label: t('我做成的装置与标记', 'My build and position marks'),
    hint: t(
      '写载荷位置、手的位置、起始姿态，以及怎样防止杯子和支点滑动。',
      'Describe load and hand marks, starting pose and how you kept the cup and pivot from slipping.',
    ),
  },
  {
    key: 'observation',
    label: t('我发现了什么？', 'What did I find?'),
    hint: t(
      '引用自己的记录编号。也留下没抬起、感觉不明显或重复不同的情况。',
      'Refer to your trial numbers. Include no lift, unclear changes and inconsistent repeats.',
    ),
  },
  {
    key: 'explanation',
    label: t('为什么会这样？', 'Why might this happen?'),
    hint: t(
      '用支点、力臂、力和移动距离解释。没有测力计，就只谈观察到的趋势。',
      'Use pivot, lever arms, force and travel. Without a force meter, describe only the trend you observed.',
    ),
  },
  {
    key: 'uncertainty',
    label: t(
      '还不能确定什么？下一次怎么改？',
      'What is uncertain? What would I improve?',
    ),
    hint: t(
      '手感主观、尺子自重、支点摩擦、杯子晃动会怎样影响结论？',
      'How might subjective effort, ruler weight, pivot friction or a wobbling cup affect your conclusion?',
    ),
  },
].map((f) => ({
  ...f,
  max: liftingFieldLimits[f.key as keyof typeof liftingFieldLimits],
}));
export const liftingResultLabels = {
  unrecorded: t('未记录', 'Not recorded'),
  full: t('达到我设定的目标', 'Reached my target'),
  partial: t('抬起一部分', 'Lifted partly'),
  none: t('没有抬起', 'No lift'),
};
export const liftingStatus = (
  r: ReturnType<typeof liftingState>['trials'][number],
) =>
  r.excluded
    ? t('已说明原因，保留并排除', 'Reason given; retained and excluded')
    : r.pendingReason
      ? t('排除待补原因', 'Exclusion needs a reason')
      : r.used
        ? t('已核对，使用', 'Checked and used')
        : r.valid
          ? t('等待自己核对', 'Awaiting your check')
          : t('等待补充记录', 'Needs a record');
const both = (x: { zh: string; en: string }) => `${x.zh} / ${x.en}`;
const cell = (x: string) =>
  x.trim()
    ? x.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
    : '未测量或未填写 / Not measured or entered';
const own = (d: LiftingDraft, key: string) =>
  d.fields[key]?.trim() || '未填写 / Not entered';
export function liftingMarkdown(d: LiftingDraft) {
  const s = liftingState(d),
    model = liftingComparison(d.design);
  const field = (key: string) => {
    const f = liftingFields.find((x) => x.key === key)!;
    return `### ${both(f.label)}\n\n${own(d, key)}\n`;
  };
  return [
    '# 省力抬升装置 · 我的设计报告 / My lifting design report',
    '> 模型计算与自己的实物记录分开。记录完整表示填写完整，不证明装置性能或理解正确。 / Model calculations are separate from my physical records. Completeness means the record is filled, not that performance or understanding is certified.',
    `记录状态 / Record status: ${s.completed ? '完整 / Complete' : '进行中 / In progress'}`,
    '## 模型设计方案 / Model design',
    `载荷 / Load: ${d.design.weight} N; 目标升高 / Target rise: ${d.design.heightCm} cm; 力上限 / Force limit: ${d.design.forceLimit} N; 手行程上限 / Hand travel limit: ${d.design.travelLimitCm} cm; 假定效率 / Assumed efficiency: ${Math.round(d.design.efficiency * 100)}%.`,
    '轻杆、固定支点、缓慢移动、竖直力；载荷距支点10 cm，单次转动0–15°。效率是总能量损失的简化假设。大载荷只在模型中；实物用少量硬币。 / Light bar, fixed pivot, slow motion and vertical forces; load mark 10 cm from pivot, one 0–15° stroke. Efficiency is an aggregate loss assumption. Larger loads are virtual; use only a few coins physically.',
    [
      '| 手位置 / Hand mark | 所需力 / Required force | 所需行程 / Required travel | 模型条件 / Model constraints |',
      '| --- | --- | --- | --- |',
      ...liftingArms.map((arm) => {
        const m = liftingComparison(d.design, arm);
        const reasons = [
          !m.forceOK && '力超限 / Force over limit',
          !m.travelOK && '空间不足 / Travel over limit',
          !m.strokeOK && '单次行程不足 / Stroke too short',
        ]
          .filter(Boolean)
          .join('; ');
        return `| ${arm} cm | ${m.force.toFixed(2)} N | ${m.handTravelCm.toFixed(2)} cm | ${m.feasible ? '可行 / Feasible' : reasons} |`;
      }),
    ].join('\n'),
    `选择 / Selected: ${d.design.effortArmCm} cm; 单次最大升高 / Maximum rise: ${model.maxLiftCm.toFixed(2)} cm.`,
    `目标能量账本（所需值，并非实测） / Target energy ledger (required values, not measurements): ${model.inputWork.toFixed(3)} J 输入 / input; ${model.outputWork.toFixed(3)} J 有用输出 / useful output; ${model.loss.toFixed(3)} J 其他转移 / other transfers.`,
    ...['question', 'prediction', 'materials', 'procedure', 'construction'].map(
      field,
    ),
    `制作与位置已核对 / Build and marks checked: ${d.buildChecked ? '是 / Yes' : '否 / No'}; 相同杯子、载荷、支点与起始条件已核对 / Same cup, load, pivot and start checked: ${d.fairChecked ? '是 / Yes' : '否 / No'}.`,
    '## 我的实物记录（包括未成功和排除记录） / My physical trials (including unsuccessful and excluded trials)',
    [
      '| # | 手位置 cm / Hand mark | 载荷位置 cm / Load mark | 杯与硬币 g / Cup + coins | 手的力 N / Effort | 手移动 cm / Hand travel | 升高 cm / Rise | 结果 / Result | 观察 / Observation | 状态 / Status | 排除原因 / Exclusion reason |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      ...d.trials.map(
        (r, i) =>
          `| ${i + 1} | ${cell(r.effortArmCm)} | ${cell(r.loadArmCm)} | ${cell(r.payloadG)} | ${cell(r.effortN)} | ${cell(r.handTravelCm)} | ${cell(r.liftCm)} | ${both(liftingResultLabels[r.result])} | ${cell(r.observation)} | ${both(liftingStatus(s.trials[i]!))} | ${cell(r.reason)} |`,
      ),
    ].join('\n'),
    `使用 / Used: ${s.used.length}; 同一载荷位置的两种设置与一次重复 / Two settings and a repeat at one load mark: ${s.compared ? '已记录 / Recorded' : '仍需补充 / Still needed'}.`,
    ...['observation', 'explanation', 'uncertainty'].map(field),
    '没有仪器读数时，不计算实测机械优势或效率。记录的位置是沿杆的标记距离；实际力矩还取决于力的方向。尺子自重和摩擦可能使实物偏离轻杆模型。 / Without instrument readings, no measured mechanical advantage or efficiency is calculated. Marks are distances along the bar; torque also depends on force direction. Ruler weight and friction can change physical results.',
    '草稿保存在当前浏览器。 / Draft saved in this browser.',
    '## 延伸阅读 / Further reading',
    '- [NASA — Tiny Levers](https://www.grc.nasa.gov/WWW/K-12/Summer_Training/KaeAvenueES/Tiny_Lever.html)',
    '- [Science Buddies — Give It a Lift with a Lever](https://www.sciencebuddies.org/stem-activities/give-it-a-lift-with-a-lever)',
  ].join('\n\n');
}
