import { t } from './content/schema';
import {
  periscopeFieldLimits,
  periscopeState,
  type PeriscopeDraft,
} from './periscope';
export const periscopePlanFields = [
  {
    key: 'question',
    label: t('我的问题与预测', 'My question and prediction'),
    hint: t(
      '从挡板后面能看到纸上的箭头吗？转动下镜时，你预测会怎样？先写理由。',
      'Can you see a paper arrow past a barrier? Predict what turning the lower mirror will change, and why.',
    ),
    max: periscopeFieldLimits.question,
  },
  {
    key: 'materials',
    label: t('我的材料与工具', 'My materials and tools'),
    hint: t(
      '纸板或纸盒、两面小塑料镜、胶带、尺和纸箭头。写下实际使用的材料；请家人帮忙裁切。',
      'Cardboard, two small plastic craft mirrors, tape, a ruler and a paper arrow. Record what you actually use; ask a helper to cut openings.',
    ),
    max: periscopeFieldLimits.materials,
  },
  {
    key: 'procedure',
    label: t(
      '一次只改什么，保持什么？',
      'What changes, and what stays the same?',
    ),
    hint: t(
      '固定目标、上镜、眼睛位置与照明，只改变下镜倾斜。试一次起始设置、改变角度，再回到起始设置；写下你的比较办法。',
      'Keep the target, upper mirror, eye position and lighting fixed; change only the lower tilt. Try the starting setting, change the tilt, then return to the start. Describe your comparison.',
    ),
    max: periscopeFieldLimits.procedure,
  },
] as const;
export const periscopeBuildField = {
  key: 'construction',
  label: t(
    '我怎样安装，两次反射怎样走？',
    'My build and the two-reflection path',
  ),
  hint: t(
    '记录上下窗口、镜面朝向、倾斜估计，以及“目标→上镜→下镜→眼睛”三段光路。可以先在纸上画，再在这里描述。',
    'Record the windows, reflective faces, estimated tilts and the three segments: target → upper mirror → lower mirror → eye. Sketch on paper, then describe it here.',
  ),
  max: periscopeFieldLimits.construction,
} as const;
export const periscopeExplainFields = [
  {
    key: 'observation',
    label: t(
      '哪些观察支持我的发现？',
      'Which observations support my finding?',
    ),
    hint: t(
      '引用具体记录编号与设置；写看到的箭头、字母或缺失部分。看不到也如实记录。',
      'Cite record numbers and settings. Describe the arrow, letters or missing parts you saw. Keep observations where nothing was visible too.',
    ),
    max: periscopeFieldLimits.observation,
  },
  {
    key: 'explanation',
    label: t('光路怎样解释结果？', 'How does the light path explain it?'),
    hint: t(
      '联系两次反射和光进入眼睛；改变镜面会改变出射方向。观察不够时，可以写暂不能判断。',
      'Connect two reflections with light reaching your eye. Tilting a mirror changes the outgoing direction. If evidence is insufficient, say the result is inconclusive.',
    ),
    max: periscopeFieldLimits.explanation,
  },
  {
    key: 'uncertainty',
    label: t(
      '哪里不确定，下次怎样改？',
      'What is uncertain, and what would I change?',
    ),
    hint: t(
      '考虑眼睛位置、窗口大小、镜面平整度、角度估计与照明。下次只改变一个因素，再比较。',
      'Consider eye position, window size, mirror flatness, estimated angles and lighting. Change one factor at a time next time.',
    ),
    max: periscopeFieldLimits.uncertainty,
  },
] as const;
export const periscopeFields = [
  ...periscopePlanFields,
  periscopeBuildField,
  ...periscopeExplainFields,
];
export const periscopeResults = {
  unrecorded: t('还未观察', 'Not observed yet'),
  visible: t('看见目标', 'Target visible'),
  partial: t('只看见部分', 'Partly visible'),
  'not-visible': t('看不到目标', 'Target not visible'),
};

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
export function periscopeMarkdown(d: PeriscopeDraft) {
  const s = periscopeState(d),
    blocks = [
      '# 我的潜望镜调查 / My periscope investigation',
      '',
      '> 自己的观察；记录完整不代表装置成功或理解已认证。 / My observations; completeness does not certify a successful device or understanding.',
      '',
      s.completed
        ? '**记录完整 / Record complete**'
        : '**记录进行中 / Record in progress**',
    ];
  for (const f of [...periscopePlanFields, periscopeBuildField])
    blocks.push(
      '',
      `## ${f.label.zh} / ${f.label.en}`,
      ...(d.fields[f.key] ?? '').split(/\r?\n/).map((line) => `> ${line}`),
    );
  blocks.push(
    '',
    `- 安装确认 / Build checked: ${d.buildChecked}`,
    `- 比较条件确认 / Comparison conditions checked: ${d.fairChecked}`,
    '',
    '## 保留的原始观察 / Retained original observations',
    '| # | 设置 / Setting | 下镜倾斜 / Lower tilt ° | 结果 / Result | 我的观察 / My observation | 确认 / Checked | 状态 / Status | 排除原因 / Exclusion reason |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  );
  d.trials.forEach((r, i) => {
    const v = s.trials[i]!,
      result = periscopeResults[r.result];
    blocks.push(
      `| ${i + 1} | ${cell(r.condition)} | ${cell(r.angle) || '未测 / Not measured'} | ${result.zh} / ${result.en} | ${cell(r.observation)} | ${r.checked} | ${v.excluded ? '有原因排除 / Excluded with reason' : v.pendingReason ? '待补原因 / Reason needed' : v.used ? '使用 / Used' : '未使用 / Not used'} | ${cell(r.reason)} |`,
    );
  });
  blocks.push(
    '',
    `- 已确认使用 / Checked used: ${s.used.length}`,
    `- 使用的不同设置标签 / Distinct used setting labels: ${s.conditions}`,
  );
  for (const f of periscopeExplainFields)
    blocks.push(
      '',
      `## ${f.label.zh} / ${f.label.en}`,
      ...(d.fields[f.key] ?? '').split(/\r?\n/).map((line) => `> ${line}`),
    );
  blocks.push(
    '',
    '## 怎样读这份记录 / Reading this record',
    '- 角度选填，指镜面与水平的夹角，不是与法线的入射角。 / Optional tilt is measured from horizontal, not the incidence angle from the normal.',
    '- 不同标签不能证明比较公平；可见程度来自观察者，不计算平均分或成功率。 / Different labels do not prove a fair comparison. Visibility is an observation, not an averaged score or success rate.',
    '- 动画只追踪一个点的理想光线，不是实测数据，也不保证完整图像清晰。 / The animation traces an ideal ray from one point; it is not measured data or a guarantee of a clear full image.',
    '- 排除需要原因，可撤销；原始输入保留。看不到目标也可以形成完整报告。 / Exclusion needs a reason and is reversible; originals remain. An unsuccessful view can still yield a complete report.',
    '- 此记录保存在当前设备浏览器。 / This record is saved in this device’s browser.',
    '',
    '## 制作参考 / Build references',
    '- Science Museum Group: https://www.sciencemuseumgroup.org.uk/sites/default/files/2025-12/SMG-Learning-Activities-360-Periscope.pdf',
    '- Science Foundation Ireland: https://www.sfi.ie/site-files/primary-science/media/pdfs/col/make_a_periscope.pdf',
  );
  return blocks.join('\n');
}
