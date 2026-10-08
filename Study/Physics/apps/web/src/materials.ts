import { t } from './content/schema';
import { blockVolume, displacedVolume } from './interactive/measurementSkills';
import { DENSITY_SAMPLES } from './interactive/densityModels';

export const MATERIAL_IDS = ['A', 'B', 'C', 'D'] as const;
export const MAX_MATERIAL_TRIALS = 6;
export type MaterialId = (typeof MATERIAL_IDS)[number];
export type VolumeMethod = 'block' | 'displacement';
export const materialReferences = [
  {
    id: 'wood',
    name: t('木头样品', 'Wood sample'),
    density: DENSITY_SAMPLES.wood.density,
    color: '#d4b387',
  },
  {
    id: 'plastic',
    name: t('塑料样品', 'Plastic sample'),
    density: 1.02,
    color: '#bca8ce',
  },
  {
    id: 'aluminium',
    name: t('铝样品', 'Aluminium sample'),
    density: DENSITY_SAMPLES.aluminium.density,
    color: '#babcc8',
  },
  {
    id: 'steel',
    name: t('钢样品', 'Steel sample'),
    density: DENSITY_SAMPLES.steel.density,
    color: '#9e9fab',
  },
] as const;
export const materialPlanFields = [
  {
    key: 'question',
    label: t(
      '我要调查什么物体？先猜材料与理由。',
      'Which object will I investigate? Predict its material and why.',
    ),
    hint: t(
      '选一个小物体，先猜，不急着找“正确答案”。',
      'Choose a small object and predict before seeking an answer.',
    ),
    max: 800,
  },
  {
    key: 'tools',
    label: t('工具、单位与最小分度', 'Tools, units and smallest divisions'),
    hint: t(
      '例如：秤显示g，尺显示cm，量筒显示mL；写出能读到的最小变化。没有合适工具时先保存计划。',
      'For example: scale in g, ruler in cm, cylinder in mL. Note the smallest readable change. Save a plan if tools are unavailable.',
    ),
    max: 800,
  },
  {
    key: 'procedure',
    label: t(
      '怎样保证测的是同一个完整样品？',
      'How will I measure the same complete specimen?',
    ),
    hint: t(
      '先测干燥质量，检查去皮；再量三边，或完整浸没、无气泡地排水。保持样品与方法一致。',
      'Measure dry mass and check tare first; then use three edges or full, bubble-free immersion. Keep the specimen and method consistent.',
    ),
    max: 1000,
  },
] as const;
export const materialSampleFields = [
  {
    key: 'observation',
    label: t('我实际看到了什么？', 'What did I actually observe?'),
    hint: t(
      '形状、空洞、吸水、气泡或测量困难；先写观察。',
      'Shape, cavities, absorption, bubbles or measurement difficulties: begin with observations.',
    ),
    max: 1000,
  },
  {
    key: 'judgment',
    label: t(
      '我的材料判断，有什么证据？',
      'What material do I suspect, and what is the evidence?',
    ),
    hint: t(
      '引用自己的质量、体积与密度；可以写“几个可能”或“暂不能判断”。',
      'Use your own mass, volume and density. Several possibilities or no conclusion are valid.',
    ),
    max: 1500,
  },
  {
    key: 'uncertainty',
    label: t(
      '什么还不确定，下次怎么查？',
      'What remains uncertain, and how could I investigate next?',
    ),
    hint: t(
      '密度相近不代表同一种材料。考虑分度、形状、空洞、混合材料或吸水；重复并不能自动消除偏差。',
      'Similar density does not prove identity. Consider divisions, shape, cavities, mixtures or absorption; repeating does not automatically remove bias.',
    ),
    max: 1500,
  },
] as const;
export const materialReadingKeys = [
  'mass',
  'length',
  'width',
  'height',
  'before',
  'after',
] as const;
export type MaterialReadingKey = (typeof materialReadingKeys)[number];
export type MaterialTrial = Record<MaterialReadingKey, string> & {
  method: VolumeMethod;
  dryMass: boolean;
  volumeChecked: boolean;
  note: string;
  excluded: boolean;
};
export type MaterialSpecimen = {
  id: MaterialId;
  label: string;
  fields: Record<string, string>;
  trials: MaterialTrial[];
};
export type MaterialsDraft = {
  fields: Record<string, string>;
  specimens: MaterialSpecimen[];
  activeId: MaterialId;
  step: number;
  updatedAt: number;
};
export const emptyMaterialTrial = (
  method: VolumeMethod = 'block',
): MaterialTrial => ({
  method,
  mass: '',
  length: '',
  width: '',
  height: '',
  before: '',
  after: '',
  dryMass: false,
  volumeChecked: false,
  note: '',
  excluded: false,
});
export const emptyMaterial = (id: MaterialId): MaterialSpecimen => ({
  id,
  label: '',
  fields: {},
  trials: [emptyMaterialTrial(), emptyMaterialTrial()],
});
export const emptyMaterials = (): MaterialsDraft => ({
  fields: {},
  specimens: [emptyMaterial('A')],
  activeId: 'A',
  step: 0,
  updatedAt: 0,
});
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max: number) =>
  typeof v === 'string' ? v.slice(0, max) : '';
export function decodeMaterials(raw: unknown): MaterialsDraft | undefined {
  if (!object(raw) || !object(raw.fields) || !Array.isArray(raw.specimens))
    return;
  const planFields = raw.fields;
  const seen = new Set<MaterialId>(),
    specimens: MaterialSpecimen[] = [];
  for (const value of raw.specimens.slice(0, 4)) {
    if (
      !object(value) ||
      !MATERIAL_IDS.includes(value.id as MaterialId) ||
      seen.has(value.id as MaterialId)
    )
      continue;
    const id = value.id as MaterialId;
    seen.add(id);
    const fields = object(value.fields) ? value.fields : {};
    const trials: MaterialTrial[] = [];
    if (Array.isArray(value.trials))
      for (const r of value.trials.slice(0, MAX_MATERIAL_TRIALS)) {
        if (!object(r)) continue;
        trials.push({
          ...(Object.fromEntries(
            materialReadingKeys.map((k) => [k, text(r[k], 16)]),
          ) as Record<MaterialReadingKey, string>),
          method: r.method === 'displacement' ? 'displacement' : 'block',
          dryMass: r.dryMass === true,
          volumeChecked:
            (r.method === 'block' || r.method === 'displacement') &&
            r.volumeChecked === true,
          note: text(r.note, 500),
          excluded: r.excluded === true,
        });
      }
    while (trials.length < 2) trials.push(emptyMaterialTrial());
    specimens.push({
      id,
      label: text(value.label, 100),
      fields: Object.fromEntries(
        materialSampleFields.map((f) => [f.key, text(fields[f.key], f.max)]),
      ),
      trials,
    });
  }
  return {
    fields: Object.fromEntries(
      materialPlanFields.map((f) => [f.key, text(planFields[f.key], f.max)]),
    ),
    specimens: specimens.length ? specimens : [emptyMaterial('A')],
    activeId: specimens.some((s) => s.id === raw.activeId)
      ? (raw.activeId as MaterialId)
      : (specimens[0]?.id ?? 'A'),
    step:
      typeof raw.step === 'number' && Number.isInteger(raw.step)
        ? Math.min(3, Math.max(0, raw.step))
        : 0,
    updatedAt:
      typeof raw.updatedAt === 'number' &&
      Number.isFinite(raw.updatedAt) &&
      raw.updatedAt > 0
        ? raw.updatedAt
        : 0,
  };
}
/** Decimal readings only, in the units named by the field. Raw invalid text is retained. */
export function materialNumber(raw: string, max: number, allowZero = false) {
  const cleaned = raw.normalize('NFKC').trim();
  if (!/^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/.test(cleaned)) return;
  const n = Number(cleaned);
  return Number.isFinite(n) && (allowZero ? n >= 0 : n > 0) && n <= max
    ? n
    : undefined;
}
export function materialTrial(r: MaterialTrial) {
  const mass = materialNumber(r.mass, 5000),
    length = materialNumber(r.length, 100),
    width = materialNumber(r.width, 100),
    height = materialNumber(r.height, 100),
    before = materialNumber(r.before, 1000, true),
    after = materialNumber(r.after, 1000);
  const volume =
    r.method === 'block'
      ? length !== undefined && width !== undefined && height !== undefined
        ? blockVolume(length, width, height)
        : undefined
      : before !== undefined && after !== undefined && after > before
        ? displacedVolume(before, after)
        : undefined;
  const density =
    mass !== undefined && volume !== undefined ? mass / volume : undefined;
  const excluded = r.excluded && !!r.note.trim(),
    pendingReason = r.excluded && !r.note.trim();
  const entered =
    materialReadingKeys.some((k) => !!r[k].trim()) ||
    !!r.note.trim() ||
    r.dryMass ||
    r.volumeChecked ||
    r.excluded;
  const conditions = r.dryMass && r.volumeChecked;
  return {
    mass,
    volume,
    density,
    conditions,
    excluded,
    pendingReason,
    entered,
    used: density !== undefined && conditions && !excluded,
    unresolved:
      entered &&
      !excluded &&
      (density === undefined || !conditions || pendingReason),
  };
}
export function materialSummary(specimen: MaterialSpecimen) {
  const trials = specimen.trials.map((raw, i) => ({
    ...materialTrial(raw),
    raw,
    trial: i + 1,
  }));
  const numeric = trials.filter((r) => r.density !== undefined),
    used = trials.filter((r) => r.used);
  const sumMass = used.reduce((sum, r) => sum + r.mass!, 0),
    sumVolume = used.reduce((sum, r) => sum + r.volume!, 0);
  const density = used.length ? sumMass / sumVolume : undefined;
  return {
    trials,
    count: used.length,
    numericCount: numeric.length,
    density,
    meanMass: used.length ? sumMass / used.length : undefined,
    meanVolume: used.length ? sumVolume / used.length : undefined,
    rawDensity: numeric.length
      ? numeric.reduce((sum, r) => sum + r.mass!, 0) /
        numeric.reduce((sum, r) => sum + r.volume!, 0)
      : undefined,
    densityRange: used.length
      ? Math.max(...used.map((r) => r.density!)) -
        Math.min(...used.map((r) => r.density!))
      : undefined,
    complete:
      !!specimen.label.trim() &&
      used.length >= 2 &&
      !trials.some((r) => r.unresolved || r.pendingReason) &&
      materialSampleFields.every((f) => !!specimen.fields[f.key]?.trim()),
  };
}
export function materialsState(draft: MaterialsDraft) {
  const planned = materialPlanFields.every(
    (f) => !!draft.fields[f.key]?.trim(),
  );
  const summaries = draft.specimens.map(materialSummary);
  return {
    planned,
    count: summaries.filter((s) => s.complete).length,
    completed:
      planned && summaries.length > 0 && summaries.every((s) => s.complete),
    summaries,
  };
}
export function referenceDifference(
  density: number | undefined,
  reference: number,
) {
  return density !== undefined &&
    Number.isFinite(density) &&
    density > 0 &&
    Number.isFinite(reference) &&
    reference > 0
    ? (Math.abs(density - reference) / reference) * 100
    : undefined;
}
export function materialFormat(n: number | undefined) {
  if (n === undefined) return '—';
  if (n > 0 && (n < 0.001 || n >= 1e6)) return n.toExponential(2);
  return n.toFixed(n > 0 && n < 0.1 ? 3 : 2);
}
export function materialsHasData(draft: MaterialsDraft) {
  return (
    Object.values(draft.fields).some((s) => !!s.trim()) ||
    draft.specimens.some(
      (s) =>
        !!s.label.trim() ||
        Object.values(s.fields).some((v) => !!v.trim()) ||
        s.trials.some((r) => materialTrial(r).entered),
    )
  );
}
export function materialsMarkdown(draft: MaterialsDraft) {
  const lines = [
    '# 神秘材料调查 / Mystery Materials investigation',
    '',
    'ρ = m/V；读数来自学习者，身份未自动验证。 / Learner-entered readings; identity is not automatically verified.',
    '',
  ];
  const field = (name: { zh: string; en: string }, value: string | undefined) =>
    lines.push(
      `### ${name.zh} / ${name.en}`,
      '',
      ...(value?.trim() || '—').split(/\r?\n/).map((s) => '> ' + s),
      '',
    );
  const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  for (const f of materialPlanFields) field(f.label, draft.fields[f.key]);
  for (const specimen of draft.specimens) {
    lines.push(`## 档案 / Case ${specimen.id}`, '');
    field(t('样品名称', 'Specimen name'), specimen.label);
    const summary = materialSummary(specimen);
    lines.push(
      '| 次 Trial | 方法 Method | m (g) | 长 Length (cm) | 宽 Width (cm) | 高 Height (cm) | 初 Before (mL) | 末 After (mL) | V (cm³) | 表观ρ Apparent (g/cm³) | 干燥质量 Dry mass | 体积条件 Volume checked | 状态 Status | 备注 Note |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    );
    for (const r of summary.trials)
      lines.push(
        `| ${r.trial} | ${r.raw.method === 'block' ? '三边 / Edges' : '排水 / Displacement'} | ${materialReadingKeys.map((k) => cell(r.raw[k] || '—')).join(' | ')} | ${materialFormat(r.volume)} | ${materialFormat(r.density)} | ${r.raw.dryMass ? '是 / Yes' : '未确认 / Unconfirmed'} | ${r.raw.volumeChecked ? '是 / Yes' : '未确认 / Unconfirmed'} | ${r.excluded ? '有原因排除 / Excluded with reason' : r.pendingReason ? '待补排除原因 / Reason needed' : r.used ? '参与汇总 / Used' : '未参与汇总 / Not used'} | ${cell(r.raw.note || '—')} |`,
      );
    lines.push(
      '',
      `使用 / Used: ${summary.count}/${summary.trials.length}; 原始数值比值 / Raw numeric ratio: ${materialFormat(summary.rawDensity)} g/cm³.`,
      `使用均质量 / Used mean mass: ${materialFormat(summary.meanMass)} g; 使用均体积 / Used mean volume: ${materialFormat(summary.meanVolume)} cm³.`,
      `汇总ρ / Summary density = mean m / mean V: ${materialFormat(summary.density)} g/cm³; 本次ρ范围 / Trial density range: ${materialFormat(summary.densityRange)} g/cm³.`,
      '',
    );
    for (const f of materialSampleFields)
      field(f.label, specimen.fields[f.key]);
    lines.push(
      '| 教学参照 Teaching reference | ρ (g/cm³) | 相对差值 Relative difference (%) |',
      '| --- | --- | --- |',
    );
    for (const ref of materialReferences)
      lines.push(
        `| ${ref.name.zh} / ${ref.name.en} | ${ref.density.toFixed(2)} | ${materialFormat(referenceDifference(summary.density, ref.density))} |`,
      );
    lines.push('');
  }
  lines.push(
    '参照是前面实验规定的四个教学样品，不是天然材料范围。塑料和木头差异尤其大；合金、空洞、混合材料也会影响比较。',
    'References are four prescribed teaching samples, not natural-material ranges. Plastics and woods vary; alloys, cavities and mixtures affect comparisons.',
    '',
    '相对差值 = |测量ρ−参照ρ| / 参照ρ ×100%。接近不证明身份，没有设置识别容差或置信度。',
    'Relative difference = |measured density − reference density| / reference density ×100%. Proximity does not prove identity; no identification tolerance or confidence is assigned.',
    '',
    '原始数值比值包含所有可计算读数，包括未确认条件或有原因排除的数据；使用汇总只包含确认条件且未排除的记录。汇总ρ使用同一组记录的均m/均V，不是各ρ的简单平均。',
    'The raw numeric ratio includes all computable readings, including unconfirmed conditions and reasoned exclusions; the used summary includes checked, unexcluded records only. Summary density uses mean mass / mean volume from the same records, not the simple mean of trial densities.',
    '',
    '范围仅表示这些读数的分散，不是完整测量误差。显示值四舍五入；非常小或大的数用科学记数，读数精度未自动验证。完整徽章只表示记录填写，不证明测量或材料判断。',
    'Ranges describe these readings, not full measurement uncertainty. Displays are rounded; very small or large numbers use scientific notation and instrument precision is not automatically verified. Completion indicates filled records, not proven measurements or material identity.',
    '',
  );
  return lines.join('\n');
}
