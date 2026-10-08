import { t } from './content/schema';
import { materialNumber } from './materials';
export const insulationFormat = (n: number | undefined) =>
  n === undefined
    ? '—'
    : n.toFixed(Math.abs(n) > 0 && Math.abs(n) < 0.1 ? 3 : 2);
const fmt = insulationFormat;

export const MAX_INSULATION_READINGS = 12;
export const insulationPlanFields = [
  {
    key: 'question',
    label: t('我的问题与预测', 'My question and prediction'),
    hint: t(
      '哪种包裹方式可能让同样的温水降温更慢？先写理由。',
      'Which wrapping might slow cooling of matched warm water? Predict and give a reason.',
    ),
    max: 800,
  },
  {
    key: 'conditions',
    label: t(
      'A与B：只改变什么，保持什么？',
      'A and B: what changes, what stays the same?',
    ),
    hint: t(
      '标记A未包裹、B包裹。记录杯子、包裹材料、水量、起始温度、盖子和摆放位置；这些差别都可能影响结果。',
      'Label A bare and B wrapped. Record cups, wrapping, water amount, starting temperatures, lids and positions; differences can affect results.',
    ),
    max: 1200,
  },
  {
    key: 'procedure',
    label: t(
      '工具与计时、读温度的办法',
      'Tools, timing and temperature procedure',
    ),
    hint: t(
      '写温度计分度和秤分度。让家人帮忙，同一计时起点，每隔约2分钟读两杯；记录实际时间。两支探头检查差别；单支探头要记读数先后和时间差。',
      'Note thermometer and scale divisions. With a helper, use one clock, read both cups about every 2 minutes and record actual times. Check two probes for differences; with one probe note reading order and time delay.',
    ),
    max: 1500,
  },
] as const;
export const insulationExplainFields = [
  {
    key: 'observation',
    label: t(
      '曲线上哪几个读数支持我的发现？',
      'Which readings support my observation?',
    ),
    hint: t(
      '引用相同时间的温度和各自的降温量，也记录与预测不同的地方。',
      'Cite temperatures at matched times and each cup’s temperature drop, including surprises.',
    ),
    max: 1200,
  },
  {
    key: 'explanation',
    label: t(
      '证据支持怎样的解释？',
      'What explanation does the evidence support?',
    ),
    hint: t(
      '包裹可能减慢能量传递；不把“温度更高”直接等同于“内能更多”。起始条件不同时先说明限制，可以写暂不能判断。',
      'Wrapping may slow energy transfer. Higher temperature alone does not mean greater internal energy. State limits when starting conditions differ; no conclusion is valid.',
    ),
    max: 1500,
  },
  {
    key: 'uncertainty',
    label: t(
      '什么不确定，下次怎样改进？',
      'What is uncertain, and what would I improve?',
    ),
    hint: t(
      '考虑分度、探头差别、两杯读数时间差、室温变化和水量；另一组独立实验放在新的报告里，不能当作同一条曲线继续。',
      'Consider divisions, probe differences, delays between cups, room changes and water amount. A separate run needs a new report, not more points on this curve.',
    ),
    max: 1500,
  },
] as const;
export const insulationSetup = [
  {
    key: 'massA',
    label: t('A水质量 / g', 'A water mass / g'),
    max: 2000,
    zero: false,
  },
  {
    key: 'massB',
    label: t('B水质量 / g', 'B water mass / g'),
    max: 2000,
    zero: false,
  },
  {
    key: 'initialA',
    label: t('A起始温度 / °C', 'A initial temperature / °C'),
    max: 60,
    zero: true,
  },
  {
    key: 'initialB',
    label: t('B起始温度 / °C', 'B initial temperature / °C'),
    max: 60,
    zero: true,
  },
  {
    key: 'room',
    label: t('起始室温 / °C', 'Initial room temperature / °C'),
    max: 60,
    zero: true,
  },
] as const;
export type InsulationReading = {
  time: string;
  a: string;
  b: string;
  room: string;
  checked: boolean;
  excluded: boolean;
  note: string;
};
export type InsulationDraft = {
  fields: Record<string, string>;
  setup: Record<string, string>;
  initialChecked: boolean;
  readings: InsulationReading[];
  step: number;
  updatedAt: number;
};
export const emptyInsulationReading = (): InsulationReading => ({
  time: '',
  a: '',
  b: '',
  room: '',
  checked: false,
  excluded: false,
  note: '',
});
export const emptyInsulation = (): InsulationDraft => ({
  fields: {},
  setup: {},
  initialChecked: false,
  readings: Array.from({ length: 3 }, emptyInsulationReading),
  step: 0,
  updatedAt: 0,
});
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown, max: number) =>
  typeof x === 'string' ? x.slice(0, max) : '';
export function decodeInsulation(raw: unknown): InsulationDraft | undefined {
  if (
    !object(raw) ||
    !object(raw.fields) ||
    !object(raw.setup) ||
    !Array.isArray(raw.readings)
  )
    return;
  const fields = raw.fields,
    setup = raw.setup;
  const readings = raw.readings.slice(0, MAX_INSULATION_READINGS).map((x) => {
    if (!object(x)) return emptyInsulationReading();
    return {
      time: text(x.time, 16),
      a: text(x.a, 16),
      b: text(x.b, 16),
      room: text(x.room, 16),
      checked: x.checked === true,
      excluded: x.excluded === true,
      note: text(x.note, 500),
    };
  });
  while (readings.length < 3) readings.push(emptyInsulationReading());
  return {
    fields: Object.fromEntries(
      [...insulationPlanFields, ...insulationExplainFields].map((f) => [
        f.key,
        text(fields[f.key], f.max),
      ]),
    ),
    setup: Object.fromEntries(
      insulationSetup.map((f) => [f.key, text(setup[f.key], 16)]),
    ),
    initialChecked: raw.initialChecked === true,
    readings,
    step: Number.isInteger(raw.step)
      ? Math.min(3, Math.max(0, raw.step as number))
      : 0,
    updatedAt:
      typeof raw.updatedAt === 'number' &&
      Number.isFinite(raw.updatedAt) &&
      raw.updatedAt > 0
        ? raw.updatedAt
        : 0,
  };
}
export function insulationReading(raw: InsulationReading) {
  const time = materialNumber(raw.time, 120),
    a = materialNumber(raw.a, 60, true),
    b = materialNumber(raw.b, 60, true),
    room = materialNumber(raw.room, 60, true);
  const valid =
    time !== undefined &&
    a !== undefined &&
    b !== undefined &&
    (!raw.room.trim() || room !== undefined);
  const pendingReason = raw.excluded && !raw.note.trim(),
    excluded = raw.excluded && !!raw.note.trim();
  const entered =
    [raw.time, raw.a, raw.b, raw.room, raw.note].some((x) => !!x.trim()) ||
    raw.checked ||
    raw.excluded;
  return {
    time,
    a,
    b,
    room,
    valid,
    pendingReason,
    excluded,
    entered,
    used: valid && raw.checked && !excluded,
    unresolved:
      entered && !excluded && (!valid || !raw.checked || pendingReason),
  };
}
export function insulationState(draft: InsulationDraft) {
  const initialA = materialNumber(draft.setup.initialA ?? '', 60, true),
    initialB = materialNumber(draft.setup.initialB ?? '', 60, true),
    room = materialNumber(draft.setup.room ?? '', 60, true),
    massA = materialNumber(draft.setup.massA ?? '', 2000),
    massB = materialNumber(draft.setup.massB ?? '', 2000);
  const initialValid = [initialA, initialB, room, massA, massB].every(
    (x) => x !== undefined,
  );
  const baseline = initialValid && draft.initialChecked;
  const readings = draft.readings.map(insulationReading),
    used = readings.filter((r) => r.used);
  const ordered = used.every((r, i) => i === 0 || r.time! > used[i - 1]!.time!);
  const planned = insulationPlanFields.every(
    (f) => !!draft.fields[f.key]?.trim(),
  );
  const explained = insulationExplainFields.every(
    (f) => !!draft.fields[f.key]?.trim(),
  );
  const last = ordered ? used.at(-1) : undefined;
  return {
    initialA,
    initialB,
    room,
    massA,
    massB,
    initialValid,
    baseline,
    readings,
    used,
    ordered,
    planned,
    unequalStart: initialValid && (initialA !== initialB || massA !== massB),
    notWarm: initialValid && (initialA! <= room! || initialB! <= room!),
    dropA: baseline && last ? initialA! - last.a! : undefined,
    dropB: baseline && last ? initialB! - last.b! : undefined,
    completed:
      planned &&
      explained &&
      baseline &&
      used.length >= 3 &&
      ordered &&
      !readings.some((r) => r.unresolved),
  };
}
export function insulationHasData(d: InsulationDraft) {
  return (
    Object.values(d.fields).some((x) => !!x.trim()) ||
    Object.values(d.setup).some((x) => !!x.trim()) ||
    d.initialChecked ||
    d.readings.some((r) => insulationReading(r).entered)
  );
}
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
export function insulationMarkdown(d: InsulationDraft) {
  const s = insulationState(d),
    blocks = [
      '# 双杯保温调查 / Two-cup insulation investigation',
      '',
      '> 自己的测量；完整记录不是科学正确性或理解程度的认证。 / My measurements; a complete record does not certify scientific correctness or understanding.',
      '',
      s.completed
        ? '**记录完整 / Record complete**'
        : '**记录进行中 / Record in progress**',
    ];
  for (const f of insulationPlanFields)
    blocks.push(
      '',
      `## ${f.label.zh} / ${f.label.en}`,
      ...(d.fields[f.key] ?? '').split(/\r?\n/).map((line) => `> ${line}`),
    );
  blocks.push('', '## 起点：同一次实验的0 min / Start: 0 min of this run');
  for (const f of insulationSetup)
    blocks.push(
      `- ${f.label.zh} / ${f.label.en}: ${cell(d.setup[f.key] ?? '') || '—'}`,
    );
  blocks.push(
    `- 起点确认 / Initial conditions checked: ${d.initialChecked}`,
    '',
    '## 保留的原读数 / Retained original readings',
    '| # | min | A °C | B °C | 室温 / Room °C | 确认 / Checked | 状态 / Status | 备注 / Note |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  );
  d.readings.forEach((r, i) => {
    const v = s.readings[i]!;
    blocks.push(
      `| ${i + 1} | ${cell(r.time)} | ${cell(r.a)} | ${cell(r.b)} | ${cell(r.room)} | ${r.checked} | ${v.excluded ? '有原因排除 / Excluded with reason' : v.pendingReason ? '待补原因 / Reason needed' : v.used ? '使用 / Used' : '未使用 / Not used'} | ${cell(r.note)} |`,
    );
  });
  blocks.push(
    '',
    `- 已确认使用 / Checked used: ${s.used.length}`,
    `- 使用时间严格递增 / Used times strictly increasing: ${s.ordered}`,
    `- 最新使用时间 / Latest used time: ${s.ordered ? fmt(s.used.at(-1)?.time) : '—'} min`,
    `- 各自降温量 T₀−T / Each temperature drop: A ${fmt(s.dropA)} °C; B ${fmt(s.dropB)} °C`,
    `- 起始水量或温度有差别 / Unequal starting mass or temperature: ${s.unequalStart}`,
    `- 至少一杯不是从高于室温开始 / At least one cup not initially warmer than room: ${s.notWarm}`,
  );
  for (const f of insulationExplainFields)
    blocks.push(
      '',
      `## ${f.label.zh} / ${f.label.en}`,
      ...(d.fields[f.key] ?? '').split(/\r?\n/).map((line) => `> ${line}`),
    );
  blocks.push(
    '',
    '## 怎样读这份记录 / Reading this record',
    '- 不同时间不是重复测量，不计算温度均值；没有自动判定哪种材料最好。 / Different times are not repeat trials: no mean temperature or automatic best-material verdict.',
    '- 虚线只连接已确认的同次实验读数，读数之间的路径是近似；时间重复或倒序时不连线。 / Dashed connections approximate between checked readings in one run; duplicate or reversed times are not connected.',
    '- 有原因的排除可撤销，原读数不删除；不同数值本身不是排除理由。 / Reasoned exclusions are reversible and retain originals; difference alone is not a reason.',
    '- 起点、水量、杯子、盖子、探头和环境影响比较。降温量是温度差，不是传出能量或材料的热导率。 / Starting conditions, amount, cups, lids, probes and environment affect comparisons. Temperature drop is not energy transferred or material conductivity.',
    '- 显示小数不代表温度计精度；本报告不拟合模拟课的传热参数。 / Displayed decimals are not thermometer precision; this report does not fit the virtual lesson’s heat-transfer parameters.',
  );
  return blocks.join('\n');
}
