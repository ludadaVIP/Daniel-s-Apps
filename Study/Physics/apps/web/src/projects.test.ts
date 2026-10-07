import { describe, expect, it } from 'vitest';
import {
  DETECTIVE_ID,
  detectiveFields,
  decodeProjects,
  detectiveState,
  detectiveMarkdown,
} from './projects';
import { decodeProgress } from './progress';
describe('Physics Detective records', () => {
  it('retains existing notes while accepting bounded, known project fields', () => {
    const data = decodeProgress(
      JSON.stringify({
        notes: [
          { id: 'n', observation: '观察', question: '问题', createdAt: 1 },
        ],
        projects: {
          [DETECTIVE_ID]: {
            fields: {
              observation: 'x'.repeat(2000),
              question: '会变吗？',
              unexpected: 'ignore',
            },
            updatedAt: 3,
          },
        },
      }),
    );
    expect(data.notes).toHaveLength(1);
    expect(data.projects?.[DETECTIVE_ID]?.fields.observation).toHaveLength(
      1500,
    );
    expect(data.projects?.[DETECTIVE_ID]?.fields.question).toBe('会变吗？');
    expect(data.projects?.[DETECTIVE_ID]?.fields.unexpected).toBeUndefined();
  });
  it('recovers from invalid project storage without discarding the old progress format', () => {
    for (const bad of [
      null,
      [],
      { [DETECTIVE_ID]: null },
      { [DETECTIVE_ID]: { fields: [] } },
    ])
      expect(decodeProjects(bad)).toBeUndefined();
    expect(decodeProgress('{}')).toEqual({ lessons: {}, notes: [] });
  });
  it('requires a prediction and controlled test plan before a complete investigation record, while allowing inconclusive evidence', () => {
    const fields = {
      observation: '球停了',
      question: '毛巾会改变距离吗？',
      prediction: '可能更短',
      change: '毛巾',
      keep: '球与起始速率',
      measure: '停止距离 cm，重复三次',
    };
    expect(detectiveState({})).toEqual({ planned: false, completed: false });
    expect(detectiveState(fields)).toEqual({ planned: true, completed: false });
    expect(
      detectiveState({
        ...fields,
        result: '没有测出可靠差异',
        explanation: '还不确定，可能释放方法不稳定',
      }),
    ).toEqual({ planned: true, completed: true });
    expect(
      detectiveState({
        ...fields,
        keep: ' ',
        result: '有结果',
        explanation: '不确定',
      }).completed,
    ).toBe(false);
  });
  it('exports every prompt bilingually with the learner’s exact multiline evidence', () => {
    const report = detectiveMarkdown({
      result: '1: 30 cm\n2: 32 cm\n3: 31 cm',
    });
    expect(report).toContain('> 1: 30 cm\n> 2: 32 cm\n> 3: 31 cm');
    for (const f of detectiveFields) {
      expect(report).toContain(f.label.zh);
      expect(report).toContain(f.label.en);
      expect(f.hint.zh).toBeTruthy();
      expect(f.hint.en).toBeTruthy();
    }
    expect(report).toContain('A complete record does not prove');
  });
});
