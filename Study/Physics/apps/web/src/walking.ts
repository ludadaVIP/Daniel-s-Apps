import { t } from './content/schema';
export const walkingDistances = [5, 10, 20] as const;
export const MAX_WALKING_TRIALS = 12;
export const walkingReadingIds = walkingDistances.flatMap((d) =>
  Array.from({ length: MAX_WALKING_TRIALS }, (_, i) => `${d}-${i + 1}`),
);
export const walkingFields = [
  {
    key: 'prediction',
    label: t(
      '距离变长，平均速率会怎样？先猜一猜。',
      'How might average speed change with distance? Predict first.',
    ),
    hint: t(
      '可以猜相近，也可以猜不同；写下理由。',
      'Similar or different are both valid predictions: give a reason.',
    ),
    max: 800,
  },
  {
    key: 'route',
    label: t('路线与测距方法', 'Route and distance measurement'),
    hint: t(
      '平坦、安静、无车辆的直线路线；量出并标记5、10、20 m。不够长时先保存部分记录。',
      'Use a level, quiet straight route away from vehicles. Measure and mark 5, 10 and 20 m; save a partial draft if space is limited.',
    ),
    max: 800,
  },
  {
    key: 'fair',
    label: t('尽量保持哪些条件相同？', 'Which conditions will stay similar?'),
    hint: t(
      '同一人、鞋、地面、自然步行方式；不比赛，不追求最快。',
      'Same walker, shoes, surface and comfortable walking style. This is not a race.',
    ),
    max: 800,
  },
  {
    key: 'timing',
    label: t('怎样起步和计时？', 'How will starting and timing work?'),
    hint: t(
      '站立起步，还是先走起来？所有试验用同一种方法。请家人帮忙；从起点开始计时，到终点停止。',
      'Standing start or already walking? Use one method throughout. Ask a helper to time from the start line to the finish.',
    ),
    max: 800,
  },
  {
    key: 'midpoint',
    label: t(
      '同一趟10 m：到5 m的累计时间（s）',
      'One 10 m trip: elapsed time at 5 m (s)',
    ),
    hint: t(
      '从同一个起点计时；经过5 m时读数，继续走，不重置计时器。',
      'Time from one start; note the 5 m reading while continuing, without resetting.',
    ),
    max: 16,
  },
  {
    key: 'endpoint',
    label: t(
      '同一趟10 m：到10 m的累计时间（s）',
      'Same 10 m trip: elapsed time at 10 m (s)',
    ),
    hint: t(
      '必须晚于5 m读数。这是另一次完整行程，不是把上面两组试验拼接。',
      'Must be later than the 5 m reading. This is a separate whole trip, not two trials joined together.',
    ),
    max: 16,
  },
  {
    key: 'graphObservation',
    label: t('这一趟发生了什么？', 'What happened on this trip?'),
    hint: t(
      '是否停留、加快、转弯？记录实际观察。只有两个检查点不能定位所有变化。',
      'Any pause, faster walking or turn? Record observations. Two checkpoints cannot locate every change.',
    ),
    max: 1000,
  },
  {
    key: 'explanation',
    label: t(
      '我的数据支持什么？还有什么不确定？',
      'What do my data support? What remains uncertain?',
    ),
    hint: t(
      '比较三组平均速率和时间范围；联系起步、计时反应或真实步速变化，不凭一条读数下结论。没有明显差异也可以。',
      'Compare average speeds and time ranges; consider starting, timing reaction or real pace changes. Avoid conclusions from one reading. No clear difference is valid too.',
    ),
    max: 2000,
  },
  {
    key: 'next',
    label: t('下次怎样改进？（可选）', 'What would I improve next? (optional)'),
    hint: t(
      '例如：练习计时，或用同样的移动起步方法重新比较。',
      'For example: practise timing, or repeat with a consistent moving start.',
    ),
    max: 800,
  },
] as const;
export type WalkingReading = { time: string; note: string; excluded: boolean };
export type WalkingDraft = {
  fields: Record<string, string>;
  readings: Record<string, WalkingReading>;
  updatedAt: number;
};
export const emptyWalking = (): WalkingDraft => ({
  fields: {},
  readings: {},
  updatedAt: 0,
});
export function decodeWalking(raw: unknown): WalkingDraft | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
  const value = raw as Partial<WalkingDraft>;
  if (
    !value.fields ||
    typeof value.fields !== 'object' ||
    Array.isArray(value.fields)
  )
    return;
  const fields = Object.fromEntries(
    walkingFields.map((f) => [
      f.key,
      typeof value.fields?.[f.key] === 'string'
        ? value.fields[f.key]!.slice(0, f.max)
        : '',
    ]),
  );
  const readings: WalkingDraft['readings'] = {};
  for (const id of walkingReadingIds) {
    const r = value.readings?.[id];
    if (r && typeof r === 'object' && !Array.isArray(r)) {
      readings[id] = {
        time: typeof r.time === 'string' ? r.time.slice(0, 16) : '',
        note: typeof r.note === 'string' ? r.note.slice(0, 500) : '',
        excluded: r.excluded === true,
      };
    }
  }
  return {
    fields,
    readings,
    updatedAt:
      typeof value.updatedAt === 'number' &&
      Number.isFinite(value.updatedAt) &&
      value.updatedAt > 0
        ? value.updatedAt
        : 0,
  };
}
// Decimal seconds only. Preserve invalid raw entries for correction/export.
export function walkingSeconds(raw: string | undefined): number | undefined {
  const text = raw?.normalize('NFKC').trim() ?? '';
  if (!/^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/.test(text)) return;
  const n = Number(text);
  return Number.isFinite(n) && n > 0 && n <= 3600 ? n : undefined;
}
export function walkingSummary(draft: WalkingDraft, distance: number) {
  const count = Math.max(
    3,
    ...Array.from({ length: MAX_WALKING_TRIALS }, (_, i) => i + 1).filter(
      (n) => draft.readings[`${distance}-${n}`],
    ),
  );
  const trials = Array.from({ length: count }, (_, i) => i + 1).map((n) => {
    const raw = draft.readings[`${distance}-${n}`];
    const time = walkingSeconds(raw?.time);
    const excluded = raw?.excluded === true && Boolean(raw.note.trim());
    return {
      trial: n,
      raw,
      time,
      excluded,
      pendingReason: raw?.excluded === true && !raw.note.trim(),
      speed: time === undefined ? undefined : distance / time,
    };
  });
  const all = trials.filter((r) => r.time !== undefined);
  const used = all.filter((r) => !r.excluded);
  const times = used.map((r) => r.time!);
  const sum = times.reduce((a, b) => a + b, 0);
  return {
    distance,
    trials,
    validCount: all.length,
    count: times.length,
    rawMean: all.length
      ? all.reduce((sum, r) => sum + r.time!, 0) / all.length
      : undefined,
    meanTime: times.length ? sum / times.length : undefined,
    range: times.length ? Math.max(...times) - Math.min(...times) : undefined,
    averageSpeed: times.length ? (distance * times.length) / sum : undefined,
    complete:
      times.length >= 3 &&
      !trials.some(
        (r) =>
          r.pendingReason ||
          (Boolean(r.raw?.time.trim()) && r.time === undefined && !r.excluded),
      ),
  };
}
export function walkingGraph(draft: WalkingDraft) {
  const middle = walkingSeconds(draft.fields.midpoint),
    end = walkingSeconds(draft.fields.endpoint);
  if (middle === undefined || end === undefined || end <= middle) return;
  return {
    middle,
    end,
    points: [
      { time: 0, distance: 0 },
      { time: middle, distance: 5 },
      { time: end, distance: 10 },
    ],
    firstSpeed: 5 / middle,
    secondSpeed: 5 / (end - middle),
    averageSpeed: 10 / end,
  };
}
export function walkingState(draft: WalkingDraft) {
  const filled = (key: string) => Boolean(draft.fields[key]?.trim());
  const planned = ['prediction', 'route', 'fair', 'timing'].every(filled);
  const groups = walkingDistances.map((d) => walkingSummary(draft, d));
  const measured = groups.every((g) => g.complete);
  return {
    planned,
    measured,
    completed:
      planned &&
      measured &&
      !!walkingGraph(draft) &&
      filled('graphObservation') &&
      filled('explanation'),
    groups,
  };
}
export function walkingNumber(value: number | undefined) {
  if (value === undefined) return '—';
  return value.toFixed(value > 0 && value < 0.1 ? 3 : 2);
}
export function walkingMarkdown(draft: WalkingDraft) {
  const lines = [
    '# 我的步行研究 / My walking investigation',
    '',
    '## 计划与解释 / Plan and explanation',
    '',
  ];
  for (const f of walkingFields)
    lines.push(
      `### ${f.label.zh} / ${f.label.en}`,
      '',
      ...(draft.fields[f.key]?.trim() || '—').split('\n').map((s) => '> ' + s),
      '',
    );
  lines.push(
    '## 每次原始记录 / Every original reading',
    '',
    '| 距离 Distance (m) | 次数 Trial | 时间 Time (s) | 本次速率 Speed (m/s) | 排除 Excluded | 备注 Note |',
    '| --- | --- | --- | --- | --- | --- |',
  );
  const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  for (const distance of walkingDistances) {
    const group = walkingSummary(draft, distance);
    for (const r of group.trials)
      lines.push(
        `| ${distance} | ${r.trial} | ${cell(r.raw?.time || '—')} | ${walkingNumber(r.speed)} | ${r.excluded ? '是 / Yes' : r.pendingReason ? '待补原因 / Reason needed' : '否 / No'} | ${cell(r.raw?.note || '—')} |`,
      );
  }
  lines.push(
    '',
    '## 各距离汇总 / Summary by distance',
    '',
    '| 距离 Distance (m) | 使用次数 Used | 原始均时 Raw mean (s) | 使用均时 Used mean (s) | 时间范围 Range (s) | 合并平均速率 Pooled average (m/s) |',
    '| --- | --- | --- | --- | --- | --- |',
  );
  for (const distance of walkingDistances) {
    const g = walkingSummary(draft, distance);
    lines.push(
      `| ${distance} | ${g.count}/${g.trials.length} | ${walkingNumber(g.rawMean)} | ${walkingNumber(g.meanTime)} | ${walkingNumber(g.range)} | ${walkingNumber(g.averageSpeed)} |`,
    );
  }
  const graph = walkingGraph(draft);
  if (graph)
    lines.push(
      '',
      `同一趟10 m / One 10 m trip: (0 s, 0 m), (${graph.middle} s, 5 m), (${graph.end} s, 10 m).`,
      `两段平均速率 / Segment averages: ${walkingNumber(graph.firstSpeed)}, ${walkingNumber(graph.secondSpeed)} m/s; 全程 / Whole trip: ${walkingNumber(graph.averageSpeed)} m/s.`,
    );
  lines.push(
    '',
    '数据由学习者输入，未自动核实。合并速率 = 各次路程总和 / 各次计时总和；不含试验之间的等待。图线连接检查点仅作近似，不能证明匀速。显示值已四舍五入。',
    'Learner-entered data are not automatically verified. Pooled speed = summed trial distances / summed trial times; waits between trials excluded. Lines between checkpoints are approximations, not proof of constant speed. Displayed values are rounded.',
    '',
    '记录完整不等于科学解释已被证明。 / A complete record does not prove the explanation.',
    '',
  );
  return lines.join('\n');
}
