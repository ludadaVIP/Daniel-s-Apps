import { t } from './content/schema';
import { materialNumber as decimal, materialFormat as fmt } from './materials';
import { liftingTask } from './interactive/workModels';

export const MAX_POWER_TRIALS = 12;
export const powerPlanFields = [
  {
    key: 'question',
    label: t('我的问题与预测', 'My question and prediction'),
    hint: t(
      '同一段楼梯，时间不同，功与功率会怎样？先猜理由。',
      'For the same flight, how could different times affect work and power? Predict why.',
    ),
    max: 800,
  },
  {
    key: 'route',
    label: t('同一段楼梯与起终点', 'Same flight and endpoints'),
    hint: t(
      '写出下层与上层的标记；本档案只比较同一段楼梯、同一总质量。',
      'Name the lower and upper marks. This record compares one flight and one total mass.',
    ),
    max: 800,
  },
  {
    key: 'tools',
    label: t('工具、单位与最小分度', 'Tools, units and smallest divisions'),
    hint: t(
      '质量用kg，竖直台阶高度用cm，时间用s。记录秤、尺和计时器能读到的最小变化。',
      'Use kg, vertical riser cm and time s. Note the smallest readable scale, ruler and timer changes.',
    ),
    max: 800,
  },
  {
    key: 'procedure',
    label: t(
      '同一次上楼，怎样开始与停止计时？',
      'How will timing start and stop on the same ascent?',
    ),
    hint: t(
      '请家人计时，明确越过起终点的时刻，包含这次上楼中的停顿。普通步行，休息后再重复；不追求最快。',
      'Ask a helper to time crossing the endpoints, including pauses during that ascent. Walk normally, rest before repeating and do not chase a fastest time.',
    ),
    max: 1200,
  },
] as const;
export const powerExplainFields = [
  {
    key: 'observation',
    label: t('我看到的变化与记录', 'Changes I observed and recorded'),
    hint: t(
      '引用每次时间及范围；有没有起停延迟、途中停顿或不同动作？',
      'Refer to trial times and their range. Was there start/stop delay, a pause or a changed movement?',
    ),
    max: 1200,
  },
  {
    key: 'explanation',
    label: t('我的功与功率解释', 'My explanation of work and power'),
    hint: t(
      '同质量、同竖直高度，mgh基本相同。时间不同，功率估算怎样改变？结果不能代表健康或食物消耗。',
      'At the same mass and vertical rise, mgh is essentially unchanged. How does time affect estimated power? This does not measure health or food-energy use.',
    ),
    max: 1500,
  },
  {
    key: 'uncertainty',
    label: t(
      '误差线索与下一次调查',
      'Uncertainty clues and a next investigation',
    ),
    hint: t(
      '想想尺的分度、台阶不等高、秤的偏差、手动反应时间与起终点速度。重复不能消除所有偏差；不确定也可以记录。',
      'Consider ruler divisions, unequal risers, scale bias, manual reaction time and endpoint speeds. Repeating does not remove every bias; uncertainty belongs in the record.',
    ),
    max: 1500,
  },
] as const;
export type PowerTrial = {
  value: string;
  checked: boolean;
  excluded: boolean;
  note: string;
};
export type PowerDraft = {
  fields: Record<string, string>;
  mass: string;
  risers: string;
  massChecked: boolean;
  countChecked: boolean;
  heights: PowerTrial[];
  times: PowerTrial[];
  step: number;
  updatedAt: number;
};
export const emptyPowerTrial = (): PowerTrial => ({
  value: '',
  checked: false,
  excluded: false,
  note: '',
});
export const emptyPower = (): PowerDraft => ({
  fields: {},
  mass: '',
  risers: '',
  massChecked: false,
  countChecked: false,
  heights: Array.from({ length: 2 }, emptyPowerTrial),
  times: Array.from({ length: 3 }, emptyPowerTrial),
  step: 0,
  updatedAt: 0,
});
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max: number) =>
  typeof v === 'string' ? v.slice(0, max) : '';
export function decodePower(raw: unknown): PowerDraft | undefined {
  if (
    !object(raw) ||
    !object(raw.fields) ||
    !Array.isArray(raw.heights) ||
    !Array.isArray(raw.times)
  )
    return;
  const fields = raw.fields;
  const trials = (raw: unknown[], min: number) => {
    const result: PowerTrial[] = raw
      .slice(0, MAX_POWER_TRIALS)
      .filter(object)
      .map((r) => ({
        value: text(r.value, 16),
        checked: r.checked === true,
        excluded: r.excluded === true,
        note: text(r.note, 500),
      }));
    while (result.length < min) result.push(emptyPowerTrial());
    return result;
  };
  return {
    fields: Object.fromEntries(
      [...powerPlanFields, ...powerExplainFields].map((f) => [
        f.key,
        text(fields[f.key], f.max),
      ]),
    ),
    mass: text(raw.mass, 16),
    risers: text(raw.risers, 16),
    massChecked: raw.massChecked === true,
    countChecked: raw.countChecked === true,
    heights: trials(raw.heights, 2),
    times: trials(raw.times, 3),
    step:
      typeof raw.step === 'number' && Number.isInteger(raw.step)
        ? Math.max(0, Math.min(3, raw.step))
        : 0,
    updatedAt:
      typeof raw.updatedAt === 'number' &&
      Number.isFinite(raw.updatedAt) &&
      raw.updatedAt > 0
        ? raw.updatedAt
        : 0,
  };
}
export const powerNumber = decimal;
export const powerFormat = fmt;
export function powerReading(raw: PowerTrial, max: number) {
  const value = decimal(raw.value, max),
    excluded = raw.excluded && !!raw.note.trim(),
    pendingReason = raw.excluded && !raw.note.trim();
  const entered =
    !!raw.value.trim() || !!raw.note.trim() || raw.checked || raw.excluded;
  return {
    raw,
    value,
    entered,
    excluded,
    pendingReason,
    used: value !== undefined && raw.checked && !excluded,
    unresolved:
      entered &&
      !excluded &&
      (value === undefined || !raw.checked || pendingReason),
  };
}
export function powerSeries(trials: PowerTrial[], max: number) {
  const records = trials.map((raw, i) => ({
      ...powerReading(raw, max),
      trial: i + 1,
    })),
    numeric = records.filter((r) => r.value !== undefined),
    used = records.filter((r) => r.used);
  const mean = (rs: typeof records) =>
    rs.length
      ? rs.reduce((sum, r) => sum + r.value!, 0) / rs.length
      : undefined;
  return {
    records,
    count: used.length,
    mean: mean(used),
    rawMean: mean(numeric),
    range: used.length
      ? Math.max(...used.map((r) => r.value!)) -
        Math.min(...used.map((r) => r.value!))
      : undefined,
    unresolved: records.some((r) => r.unresolved || r.pendingReason),
  };
}
export function powerState(draft: PowerDraft) {
  const heights = powerSeries(draft.heights, 50),
    times = powerSeries(draft.times, 600),
    mass = decimal(draft.mass, 300),
    n = decimal(draft.risers, 100),
    risers = n !== undefined && Number.isInteger(n) ? n : undefined;
  const rise =
    risers !== undefined && heights.mean !== undefined
      ? (risers * heights.mean) / 100
      : undefined;
  const conditions = draft.massChecked && draft.countChecked;
  const work =
    conditions && mass !== undefined && rise !== undefined
      ? liftingTask(mass, rise, 1).work
      : undefined;
  const power =
    work !== undefined && times.mean !== undefined
      ? work / times.mean
      : undefined;
  const planned = powerPlanFields.every((f) => !!draft.fields[f.key]?.trim()),
    explained = powerExplainFields.every((f) => !!draft.fields[f.key]?.trim());
  return {
    heights,
    times,
    mass,
    risers,
    rise,
    work,
    power,
    conditions,
    planned,
    completed:
      planned &&
      explained &&
      work !== undefined &&
      times.count >= 3 &&
      heights.count >= 2 &&
      !times.unresolved &&
      !heights.unresolved,
  };
}
export function powerHasData(draft: PowerDraft) {
  return (
    !!draft.mass.trim() ||
    !!draft.risers.trim() ||
    draft.massChecked ||
    draft.countChecked ||
    Object.values(draft.fields).some((v) => !!v.trim()) ||
    [...draft.heights, ...draft.times].some((r) => powerReading(r, 600).entered)
  );
}
export function powerMarkdown(draft: PowerDraft) {
  const s = powerState(draft),
    lines = [
      '# 上楼功率调查 / Stair-power investigation',
      '',
      'P ≈ mgh/t; g = 10 N/kg. 读数来自学习者，未自动验证。 / Learner-entered readings, not automatically verified.',
      '',
      '同一楼梯、同一总质量，普通步行，不排名。 / Same flight and total mass, ordinary walking, no ranking.',
      '',
    ];
  const field = (
    label: { zh: string; en: string },
    value: string | undefined,
  ) =>
    lines.push(
      `### ${label.zh} / ${label.en}`,
      '',
      ...(value?.trim() || '—').split(/\r?\n/).map((v) => '> ' + v),
      '',
    );
  const cell = (v: string) => v.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  for (const f of powerPlanFields) field(f.label, draft.fields[f.key]);
  lines.push(
    `总质量 / Total mass (kg): ${cell(draft.mass || '—')}; 已确认kg与携带物 / kg and carried load checked: ${draft.massChecked}`,
    `竖直台阶数 / Vertical risers: ${cell(draft.risers || '—')}; 起终点已确认 / Endpoints checked: ${draft.countChecked}`,
    '',
  );
  for (const [label, series, unit] of [
    [t('竖直台阶高度', 'Vertical riser readings'), s.heights, 'cm'],
    [t('同一段上楼时间', 'Same-flight ascent times'), s.times, 's'],
  ] as const) {
    lines.push(
      `## ${label.zh} / ${label.en}`,
      '',
      `| 次 Trial | 原读数 Raw (${unit}) | 条件确认 Checked | 状态 Status | 备注 Note |`,
      '| --- | --- | --- | --- | --- |',
    );
    for (const r of series.records)
      lines.push(
        `| ${r.trial} | ${cell(r.raw.value || '—')} | ${r.raw.checked} | ${r.excluded ? '有原因排除 / Excluded with reason' : r.pendingReason ? '待补原因 / Reason needed' : r.used ? '参与汇总 / Used' : '未参与 / Not used'} | ${cell(r.raw.note || '—')} |`,
      );
    lines.push(
      '',
      `使用数 / Used: ${series.count}; 使用均值 / Used mean: ${fmt(series.mean)} ${unit}; 使用范围 / Used range: ${fmt(series.range)} ${unit}; 原始数值均值 / Raw numeric mean: ${fmt(series.rawMean)} ${unit}.`,
      '',
    );
  }
  lines.push(
    `垂直高度估算 / Estimated vertical rise: ${fmt(s.rise)} m = N × mean riser cm / 100.`,
    `势能增加估算 / Estimated gravitational increase: ${fmt(s.work)} J.`,
    `机械功率估算 / Estimated mechanical power: ${fmt(s.power)} W = mgh / mean used time.`,
    '',
  );
  for (const f of powerExplainFields) field(f.label, draft.fields[f.key]);
  lines.push(
    '汇总功率 = 各次同任务的总mgh / 使用总时间；不是各次功率的算术平均。原始数值均值包括未确认条件和排除记录；使用均值仅用已确认且未有原因排除的记录。',
    'Summary power = summed mgh for identical tasks / summed used times, not the arithmetic mean of trial powers. Raw numeric means include unchecked and excluded records; used means include checked records without reasoned exclusion.',
    '',
    '这是人+地球势能增加的机械功率估算，忽略起终点动能差及其他能量去向，不是人体化学能消耗、完整肌肉做功或健康指标。台阶近似等高；不等高时应分段量，而不能直接套用。',
    'This estimates mechanical power for the person–Earth gravitational increase, omitting endpoint kinetic changes and other destinations. It is not chemical-energy consumption, all muscular work or a health measure. Risers are approximately equal; unequal flights require separate measurements.',
    '',
    '范围仅表示这些读数的分散，不是完整测量不确定度。显示值四舍五入，不代表仪器精度。完整徽章表示记录填写，不证明实验正确或理解掌握。',
    'Ranges describe these readings, not full measurement uncertainty. Rounded displays do not claim instrument precision. Completion indicates filled records, not verified measurements or mastery.',
    '',
  );
  return lines.join('\n');
}
