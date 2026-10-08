import { describe, expect, it } from 'vitest';
import { decodeProgress } from './progress';
import { DETECTIVE_ID } from './projects';
import {
  decodeWalking,
  emptyWalking,
  walkingSeconds,
  walkingSummary,
  walkingGraph,
  walkingState,
  walkingMarkdown,
  walkingFields,
  type WalkingDraft,
} from './walking';
function recorded(): WalkingDraft {
  const draft = emptyWalking();
  draft.fields = {
    prediction: '可能相近',
    route: '卷尺测平坦路线',
    fair: '同一人同样步行',
    timing: '站立起步，家人计时',
    midpoint: '4',
    endpoint: '9',
    graphObservation: '回程另一次，未拼接',
    explanation: '不能只凭均值，计时反应仍不确定',
  };
  for (const distance of [5, 10, 20])
    for (const trial of [1, 2, 3])
      draft.readings[`${distance}-${trial}`] = {
        time: String(distance + trial - 2),
        note: '',
        excluded: false,
      };
  return draft;
}
describe('walking investigation with real entered evidence', () => {
  it('accepts bounded decimal seconds and retains invalid values rather than interpreting units or infinities', () => {
    for (const raw of [
      '',
      '0',
      '-1',
      '3 s',
      '1,5',
      '1e3',
      'Infinity',
      'NaN',
      '3601',
      '.0001',
    ])
      expect(walkingSeconds(raw)).toBeUndefined();
    expect(walkingSeconds(' ４.５ ')).toBe(4.5);
    expect(walkingSeconds('.125')).toBe(0.125);
    expect(walkingSeconds('3600')).toBe(3600);
    const draft = emptyWalking();
    draft.readings['5-1'] = { time: 'oops', note: '', excluded: false };
    expect(walkingSummary(draft, 5).count).toBe(0);
    expect(walkingMarkdown(draft)).toContain('oops');
  });
  it('pools distance and time, not arithmetic means of unequal trial speeds', () => {
    const draft = recorded(),
      group = walkingSummary(draft, 5);
    expect(group.meanTime).toBe(5);
    expect(group.range).toBe(2);
    expect(group.averageSpeed).toBe(15 / (4 + 5 + 6));
    expect(group.averageSpeed).not.toBe((5 / 4 + 5 / 5 + 5 / 6) / 3);
    expect(group.rawMean).toBe(group.meanTime);
  });
  it('requires an exclusion reason, preserves originals and restores them on unchecking', () => {
    const draft = recorded();
    draft.readings['5-1']!.excluded = true;
    expect(walkingSummary(draft, 5).count).toBe(3);
    expect(walkingSummary(draft, 5).complete).toBe(false);
    draft.readings['5-1']!.note = 'timer stopped early';
    const group = walkingSummary(draft, 5);
    expect(group.count).toBe(2);
    expect(group.rawMean).toBe(5);
    expect(group.meanTime).toBe(5.5);
    expect(group.averageSpeed).toBeCloseTo(10 / 11);
    expect(draft.readings['5-1']!.time).toBe('4');
    expect(group.complete).toBe(false);
    draft.readings['5-4'] = {
      time: '7',
      note: 'repeat after timer check',
      excluded: false,
    };
    expect(walkingSummary(draft, 5).complete).toBe(true);
    expect(walkingSummary(draft, 5).meanTime).toBe(6);
    draft.readings['5-2'] = {
      ...draft.readings['5-2']!,
      excluded: true,
      note: 'confirmed timer problem',
    };
    expect(walkingSummary(draft, 5).complete).toBe(false);
    draft.readings['5-1']!.excluded = false;
    expect(walkingSummary(draft, 5).count).toBe(3);
    expect(draft.readings['5-1']!.note).toBe('timer stopped early');
  });
  it('uses cumulative checkpoint times from one journey and rejects reversed or equal timestamps', () => {
    const draft = recorded(),
      graph = walkingGraph(draft)!;
    expect(graph.points).toEqual([
      { time: 0, distance: 0 },
      { time: 4, distance: 5 },
      { time: 9, distance: 10 },
    ]);
    expect(graph.firstSpeed).toBe(1.25);
    expect(graph.secondSpeed).toBe(1);
    expect(graph.averageSpeed).toBeCloseTo(10 / 9);
    for (const end of ['4', '3', 'bad', '0']) {
      draft.fields.endpoint = end;
      expect(walkingGraph(draft)).toBeUndefined();
    }
  });
  it('retains extra trials through reload and supports documented invalid procedure readings without using them', () => {
    const draft = recorded();
    draft.readings['5-4'] = { time: 'timer failed', note: '', excluded: false };
    expect(walkingSummary(draft, 5).complete).toBe(false);
    draft.readings['5-4'] = {
      time: 'timer failed',
      note: 'timer had no usable reading',
      excluded: true,
    };
    expect(walkingSummary(draft, 5).count).toBe(3);
    expect(walkingSummary(draft, 5).complete).toBe(true);
    draft.readings['20-12'] = {
      time: '22',
      note: 'extra trial',
      excluded: false,
    };
    draft.readings['20-13'] = {
      time: '23',
      note: 'outside bounded draft',
      excluded: false,
    };
    const decoded = decodeWalking(draft)!;
    expect(decoded.readings['20-12']?.time).toBe('22');
    expect(decoded.readings['20-13']).toBeUndefined();
    expect(walkingSummary(decoded, 20).trials).toHaveLength(12);
    expect(walkingMarkdown(decoded)).toContain('timer failed');
    expect(walkingMarkdown(decoded)).toContain('timer had no usable reading');
  });
  it('requires fair planning, three groups, a valid graph and an explanation for the record badge', () => {
    expect(walkingState(emptyWalking()).completed).toBe(false);
    const draft = recorded();
    expect(walkingState(draft).completed).toBe(true);
    for (const key of [
      'prediction',
      'route',
      'fair',
      'timing',
      'graphObservation',
      'explanation',
    ]) {
      const changed = { ...draft, fields: { ...draft.fields, [key]: ' ' } };
      expect(walkingState(changed).completed).toBe(false);
    }
    delete draft.readings['20-3'];
    expect(walkingState(draft).completed).toBe(false);
  });
  it('decodes walking drafts without losing detective records, notes or old completion IDs', () => {
    const raw = recorded();
    raw.fields.prediction = 'x'.repeat(1000);
    raw.fields.unknown = 'ignore';
    raw.readings['5-1']!.note = 'x'.repeat(900);
    raw.readings.unknown = { time: '5', note: '', excluded: true };
    const data = decodeProgress(
      JSON.stringify({
        notes: [
          { id: 'n', observation: '观察', question: '问题', createdAt: 1 },
        ],
        projects: {
          [DETECTIVE_ID]: { fields: { question: '为什么？' }, updatedAt: 1 },
        },
        walkingProject: raw,
      }),
    );
    expect(data.notes).toHaveLength(1);
    expect(data.projects?.[DETECTIVE_ID]?.fields.question).toBe('为什么？');
    expect(data.walkingProject?.fields.prediction).toHaveLength(800);
    expect(data.walkingProject?.fields.unknown).toBeUndefined();
    expect(data.walkingProject?.readings['5-1']?.note).toHaveLength(500);
    expect(data.walkingProject?.readings.unknown).toBeUndefined();
    for (const bad of [null, [], { fields: [] }, { fields: 'oops' }])
      expect(decodeWalking(bad)).toBeUndefined();
    expect(decodeProgress('{}')).toEqual({ lessons: {}, notes: [] });
  });
  it('exports raw readings, exclusion reasons and rounded derived values with bilingual labels', () => {
    const draft = recorded();
    draft.readings['5-1'] = {
      time: '4',
      note: 'timer|early\nchecked',
      excluded: true,
    };
    const report = walkingMarkdown(draft);
    expect(report).toContain('timer\\|early<br>checked');
    expect(report).toContain('| 5 | 1 | 4 | 1.25 | 是 / Yes');
    expect(report).toContain('(4 s, 5 m), (9 s, 10 m)');
    expect(report).toContain('Whole trip: 1.11 m/s');
    for (const f of walkingFields) {
      expect(report).toContain(f.label.zh);
      expect(report).toContain(f.label.en);
      expect(f.hint.zh).toBeTruthy();
      expect(f.hint.en).toBeTruthy();
    }
  });
});
