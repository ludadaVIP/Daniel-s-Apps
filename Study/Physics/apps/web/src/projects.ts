import { t } from './content/schema';
export const DETECTIVE_ID = 'physics-detective';
export const detectiveFields = [
  {
    key: 'phenomenon',
    label: t('我的调查主题', 'My investigation'),
    hint: t(
      '例如：小球在桌面和毛巾上的运动',
      'For example: a ball on a table and a towel',
    ),
    max: 160,
  },
  {
    key: 'observation',
    label: t('我实际观察到了什么？', 'What did I actually observe?'),
    hint: t(
      '只写看到、听到或测到的，不急着解释。',
      'Write what you saw, heard or measured before explaining.',
    ),
    max: 1500,
  },
  {
    key: 'question',
    label: t('我想测试哪个小问题？', 'Which small question will I test?'),
    hint: t(
      '把“为什么”缩小成能比较的条件。',
      'Narrow the question to conditions you can compare.',
    ),
    max: 500,
  },
  {
    key: 'prediction',
    label: t('我先猜什么？为什么？', 'What do I predict, and why?'),
    hint: t(
      '这是猜想，还不是已经证实的结果。',
      'This is a prediction, not an established result.',
    ),
    max: 1000,
  },
  {
    key: 'change',
    label: t('我只改变什么？', 'What will I change?'),
    hint: t(
      '例如：桌面是否铺毛巾。',
      'For example: whether the table is covered by a towel.',
    ),
    max: 500,
  },
  {
    key: 'keep',
    label: t('哪些条件尽量保持相同？', 'What will I keep the same?'),
    hint: t(
      '例如：同一颗球、相同起始速率和平坦桌面。',
      'For example: the same ball, starting speed and level table.',
    ),
    max: 700,
  },
  {
    key: 'measure',
    label: t(
      '我测什么、用什么单位？',
      'What will I measure, and in which units?',
    ),
    hint: t(
      '例如：每次停止距离（cm），每种地面重复三次。',
      'For example: stopping distance (cm), three trials on each surface.',
    ),
    max: 700,
  },
  {
    key: 'result',
    label: t('真实结果是什么？', 'What were the actual results?'),
    hint: t(
      '保留每次读数。没有差异或实验没成功，也如实记录。',
      'Keep every reading. Record no difference or an unsuccessful experiment honestly too.',
    ),
    max: 2000,
  },
  {
    key: 'explanation',
    label: t(
      '结果支持什么？还有什么不确定？',
      'What do results support? What remains uncertain?',
    ),
    hint: t(
      '用自己的话联系力、运动或能量；不知道时可以写“还不确定”。',
      'Connect to forces, motion or energy in your own words; “not sure yet” is valid.',
    ),
    max: 2000,
  },
  {
    key: 'next',
    label: t(
      '下一次我还想测什么？（可选）',
      'What would I test next? (optional)',
    ),
    hint: t(
      '例如：换释放方法后，比较是否更公平？',
      'For example: would another release method make the comparison fairer?',
    ),
    max: 700,
  },
] as const;
export type ProjectDraft = {
  fields: Record<string, string>;
  updatedAt: number;
};
export function decodeProjects(
  raw: unknown,
): Record<string, ProjectDraft> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
  const record = (raw as Record<string, unknown>)[DETECTIVE_ID];
  if (!record || typeof record !== 'object' || Array.isArray(record)) return;
  const value = record as Partial<ProjectDraft>;
  if (
    !value.fields ||
    typeof value.fields !== 'object' ||
    Array.isArray(value.fields)
  )
    return;
  const fields = Object.fromEntries(
    detectiveFields.map((f) => [
      f.key,
      typeof value.fields?.[f.key] === 'string'
        ? value.fields[f.key]!.slice(0, f.max)
        : '',
    ]),
  );
  return {
    [DETECTIVE_ID]: {
      fields,
      updatedAt:
        typeof value.updatedAt === 'number' &&
        Number.isFinite(value.updatedAt) &&
        value.updatedAt > 0
          ? value.updatedAt
          : 0,
    },
  };
}
export function detectiveState(fields: Record<string, string>) {
  const filled = (key: string) => Boolean(fields[key]?.trim());
  const planned = [
    'observation',
    'question',
    'prediction',
    'change',
    'keep',
    'measure',
  ].every(filled);
  return {
    planned,
    completed: planned && ['result', 'explanation'].every(filled),
  };
}
export function detectiveMarkdown(fields: Record<string, string>) {
  return (
    '# 物理侦探 / Physics Detective\n\n' +
    detectiveFields
      .map(
        (f) =>
          `## ${f.label.zh} / ${f.label.en}\n\n${(fields[f.key]?.trim() || '—')
            .split('\n')
            .map((line) => '> ' + line)
            .join('\n')}\n`,
      )
      .join('\n') +
    '\n记录完整不等于解释已被证明。 / A complete record does not prove the explanation.\n'
  );
}
