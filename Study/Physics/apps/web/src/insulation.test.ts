import { describe, expect, it } from 'vitest';
import {
  emptyInsulation,
  emptyInsulationReading,
  decodeInsulation,
  insulationReading,
  insulationState,
  insulationFormat,
  insulationMarkdown,
  insulationHasData,
  insulationPlanFields,
  insulationExplainFields,
} from './insulation';
import { decodeProgress, freshLesson } from './progress';
import { lessons } from './content/lessons';
import { emptyPower } from './power';
const reading = (time: string, a = '35', b = '38') => ({
  ...emptyInsulationReading(),
  time,
  a,
  b,
  checked: true,
});
function recorded() {
  const d = emptyInsulation();
  d.setup = {
    massA: '100',
    massB: '100',
    initialA: '40',
    initialB: '40',
    room: '20',
  };
  d.initialChecked = true;
  d.readings = [
    reading('2', '37', '39'),
    reading('4', '34', '38'),
    reading('6', '32', '37'),
  ];
  d.fields = Object.fromEntries(
    [...insulationPlanFields, ...insulationExplainFields].map((f) => [
      f.key,
      'My evidence / 我的证据',
    ]),
  );
  return d;
}
describe('learner insulation investigation', () => {
  it('uses matched later readings and each own baseline, without treating time points as repeats', () => {
    const d = recorded(),
      s = insulationState(d);
    expect(s).toMatchObject({
      completed: true,
      baseline: true,
      ordered: true,
      dropA: 8,
      dropB: 3,
      unequalStart: false,
      notWarm: false,
    });
    expect(s.used.map((r) => r.time)).toEqual([2, 4, 6]);
    expect(s).not.toHaveProperty('mean');
    expect(s).not.toHaveProperty('conductance');
    d.setup.initialB = '42';
    d.setup.massB = '110';
    expect(insulationState(d)).toMatchObject({
      completed: true,
      dropB: 5,
      unequalStart: true,
    });
  });
  it('retains nonmonotonic temperatures and signed warming without imposing model cooling', () => {
    const d = recorded();
    d.readings[1]!.a = '39';
    expect(insulationState(d).completed).toBe(true);
    expect(insulationFormat(-0.001)).toBe('-0.001');
    d.setup.initialA = '10';
    d.setup.initialB = '10';
    expect(insulationState(d)).toMatchObject({
      completed: true,
      notWarm: true,
      dropA: -22,
      dropB: -27,
    });
  });
  it('withholds latest drops and connection permission for duplicate or reversed used times', () => {
    for (const time of ['4', '3']) {
      const d = recorded();
      d.readings[2]!.time = time;
      expect(insulationState(d)).toMatchObject({
        ordered: false,
        completed: false,
        dropA: undefined,
        dropB: undefined,
      });
    }
    const d = recorded();
    d.readings[1]!.checked = false;
    expect(insulationState(d).used.map((r) => r.time)).toEqual([2, 6]);
    expect(insulationState(d).completed).toBe(false);
  });
  it('keeps pending exclusions used, requires reasons and retains originals when replacing a bad pair', () => {
    const d = recorded();
    d.readings[1]!.excluded = true;
    expect(insulationReading(d.readings[1]!)).toMatchObject({
      used: true,
      pendingReason: true,
      unresolved: true,
    });
    expect(insulationState(d).completed).toBe(false);
    d.readings[1]!.note = 'probe touched cup bottom';
    expect(insulationState(d).used).toHaveLength(2);
    d.readings.push(reading('8', '30', '36'));
    expect(insulationState(d)).toMatchObject({
      completed: true,
      dropA: 10,
      dropB: 4,
    });
    expect(d.readings[1]!.a).toBe('34');
    d.readings[1]!.excluded = false;
    expect(insulationState(d).used).toHaveLength(4);
    expect(d.readings[1]!.note).toBe('probe touched cup bottom');
  });
  it('accepts zero temperatures and bounded decimals, but rejects invalid paired data and optional room entries', () => {
    expect(insulationReading(reading(' ２.５ ', '０', '.125'))).toMatchObject({
      time: 2.5,
      a: 0,
      b: 0.125,
      used: true,
    });
    for (const time of [
      '0',
      '-1',
      '120.001',
      '1e2',
      '2 min',
      '1,5',
      'NaN',
      'Infinity',
    ])
      expect(insulationReading(reading(time)).used).toBe(false);
    for (const temp of ['-1', '60.001', 'warm', '1e1'])
      expect(insulationReading(reading('2', temp)).used).toBe(false);
    const d = recorded();
    d.readings.push(emptyInsulationReading());
    expect(insulationState(d).completed).toBe(true);
    d.readings[3]!.room = 'cold';
    expect(insulationState(d).completed).toBe(false);
    d.readings[3]!.excluded = true;
    d.readings[3]!.note = 'no pair measured';
    expect(insulationState(d).completed).toBe(true);
  });
  it('requires checked baseline, three used points, complete plan and explanations without claiming correctness', () => {
    expect(insulationHasData(emptyInsulation())).toBe(false);
    const d = recorded();
    d.initialChecked = false;
    expect(insulationState(d)).toMatchObject({
      completed: false,
      baseline: false,
      dropA: undefined,
    });
    d.initialChecked = true;
    d.setup.massA = '0';
    expect(insulationState(d).completed).toBe(false);
    for (const f of [...insulationPlanFields, ...insulationExplainFields])
      expect(
        insulationState({
          ...recorded(),
          fields: { ...recorded().fields, [f.key]: '' },
        }).completed,
      ).toBe(false);
    d.setup.massA = '100';
    d.fields.explanation = '暂时不能判断';
    expect(insulationState(d).completed).toBe(true);
  });
  it('bounds imported drafts, drops unknown fields and retains invalid raw text for correction', () => {
    const d = recorded();
    d.fields.question = 'q'.repeat(1800);
    d.fields.unknown = 'drop';
    d.setup.initialA = 'wrong text is retained';
    d.setup.unknown = 'drop';
    d.readings = Array.from({ length: 20 }, () => ({
      ...reading('2'),
      note: 'n'.repeat(900),
    }));
    d.step = 99;
    d.updatedAt = Infinity;
    const out = decodeInsulation(d)!;
    expect(out.fields.question).toHaveLength(800);
    expect(out.fields.unknown).toBeUndefined();
    expect(out.setup.unknown).toBeUndefined();
    expect(out.setup.initialA).toHaveLength(16);
    expect(out.readings).toHaveLength(12);
    expect(out.readings[0]!.note).toHaveLength(500);
    expect(out.step).toBe(3);
    expect(out.updatedAt).toBe(0);
    expect(
      decodeInsulation({ ...d, readings: [null, { checked: 'true', a: 42 }] })!
        .readings,
    ).toHaveLength(3);
    expect(decodeInsulation({ ...d, readings: [null] })!.readings[0]).toEqual(
      emptyInsulationReading(),
    );
    for (const raw of [
      null,
      [],
      {},
      { fields: [], setup: {}, readings: [] },
      { fields: {}, setup: {}, readings: 'bad' },
    ])
      expect(decodeInsulation(raw)).toBeUndefined();
  });
  it('preserves prior lessons, notes and all earlier field projects in the shared storage', () => {
    const lesson = lessons[0]!,
      p = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        completedAt: 1,
        answers: Object.fromEntries(
          [...lesson.questions, lesson.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const out = decodeProgress(
      JSON.stringify({
        lessons: { [lesson.id]: p },
        notes: [
          {
            id: 'old',
            observation: 'old observation',
            question: 'why',
            createdAt: 1,
          },
        ],
        projects: {
          'physics-detective': {
            fields: { phenomenon: 'old mystery' },
            updatedAt: 1,
          },
        },
        walkingProject: { fields: { route: 'old route' }, readings: {} },
        materialsProject: {
          fields: { question: 'old specimen' },
          specimens: [],
        },
        powerProject: { ...emptyPower(), fields: { question: 'old stairs' } },
        insulationProject: recorded(),
      }),
    );
    expect(out.lessons[lesson.id]?.completedAt).toBe(1);
    expect(out.notes[0]?.observation).toBe('old observation');
    expect(out.projects?.['physics-detective']).toBeDefined();
    expect(out.walkingProject?.fields.route).toBe('old route');
    expect(out.materialsProject?.fields.question).toBe('old specimen');
    expect(out.powerProject?.fields.question).toBe('old stairs');
    expect(insulationState(out.insulationProject!).completed).toBe(true);
    expect(decodeProgress('{}')).toEqual({ lessons: {}, notes: [] });
  });
  it('exports bilingual raw evidence, exclusions, conditions, signed differences and model limits', () => {
    const d = recorded();
    d.readings.push({
      ...reading('oops'),
      excluded: true,
      note: 'clock|stopped\nkeep original',
    });
    const report = insulationMarkdown(d);
    expect(report).toContain('| 4 | oops');
    expect(report).toContain('clock\\|stopped<br>keep original');
    expect(report).toContain('A 8.00 °C; B 3.00 °C');
    expect(report).toContain('no mean temperature');
    expect(report).toContain('not energy transferred');
    expect(report).toContain('does not fit');
    for (const f of [...insulationPlanFields, ...insulationExplainFields]) {
      expect(report).toContain(f.label.zh);
      expect(report).toContain(f.label.en);
      expect(f.hint.zh).toBeTruthy();
      expect(f.hint.en).toBeTruthy();
    }
  });
});
