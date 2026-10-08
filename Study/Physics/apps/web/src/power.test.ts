import { describe, expect, it } from 'vitest';
import { decodeProgress, freshLesson } from './progress';
import { lessons } from './content/lessons';
import {
  emptyPower,
  emptyPowerTrial,
  decodePower,
  powerNumber,
  powerReading,
  powerState,
  powerMarkdown,
  powerHasData,
  powerPlanFields,
  powerExplainFields,
  type PowerTrial,
} from './power';
const reading = (value: string): PowerTrial => ({
  ...emptyPowerTrial(),
  value,
  checked: true,
});
function recorded() {
  const d = emptyPower();
  d.mass = '50';
  d.risers = '20';
  d.massChecked = true;
  d.countChecked = true;
  d.heights = ['15', '15', '15'].map(reading);
  d.times = ['10', '12', '14'].map(reading);
  d.fields = Object.fromEntries(
    [...powerPlanFields, ...powerExplainFields].map((f) => [
      f.key,
      '自己的记录 / My own evidence',
    ]),
  );
  return d;
}
describe('stair-power investigation evidence', () => {
  it('converts vertical riser cm and uses total identical-task work / total ascent time', () => {
    const d = recorded(),
      s = powerState(d);
    expect(s).toMatchObject({
      mass: 50,
      risers: 20,
      rise: 3,
      work: 1500,
      power: 125,
      completed: true,
    });
    expect(s.times).toMatchObject({
      count: 3,
      mean: 12,
      range: 4,
      rawMean: 12,
    });
    expect(s.power).not.toBeCloseTo((150 + 125 + 1500 / 14) / 3);
    d.heights = ['14', '15', '16'].map(reading);
    expect(powerState(d).rise).toBe(3);
    expect(powerState(d).heights.range).toBe(2);
    d.mass = '60';
    expect(powerState(d).work).toBe(1800);
    d.risers = '10';
    expect(powerState(d).rise).toBe(1.5);
  });
  it('keeps unconfirmed numbers in raw evidence without converting them into used results', () => {
    const d = recorded();
    d.heights[0]!.value = '30';
    d.heights[0]!.checked = false;
    expect(powerState(d).heights).toMatchObject({
      mean: 15,
      rawMean: 20,
      count: 2,
      unresolved: true,
    });
    expect(powerState(d).completed).toBe(false);
    d.massChecked = false;
    expect(powerState(d).work).toBeUndefined();
    d.massChecked = true;
    d.countChecked = false;
    expect(powerState(d).power).toBeUndefined();
    d.countChecked = true;
    d.times.forEach((r) => (r.checked = false));
    expect(powerState(d).times.rawMean).toBe(12);
    expect(powerState(d).power).toBeUndefined();
  });
  it('retains valid pending exclusions, requires a reason and allows a replacement without deleting originals', () => {
    const d = recorded();
    d.times[0]!.excluded = true;
    expect(powerState(d)).toMatchObject({ power: 125, completed: false });
    expect(powerReading(d.times[0]!, 600)).toMatchObject({
      used: true,
      pendingReason: true,
    });
    d.times[0]!.note = 'timer started late';
    expect(powerState(d)).toMatchObject({ power: 1500 / 13, completed: false });
    expect(powerState(d).times).toMatchObject({ count: 2, rawMean: 12 });
    d.times.push(reading('13'));
    expect(powerState(d)).toMatchObject({ power: 1500 / 13, completed: true });
    expect(d.times[0]!.value).toBe('10');
    d.times[0]!.excluded = false;
    expect(powerState(d).times.count).toBe(4);
    expect(d.times[0]!.note).toBe('timer started late');
  });
  it('allows blank spare slots, but does not silently accept invalid, zero or fractional-riser data', () => {
    const d = recorded();
    d.times.push(emptyPowerTrial());
    expect(powerState(d).completed).toBe(true);
    d.times[3]!.value = 'timer failed';
    expect(powerState(d).completed).toBe(false);
    d.times[3]!.excluded = true;
    d.times[3]!.note = 'no usable timing';
    expect(powerState(d).completed).toBe(true);
    for (const invalid of [
      '0',
      '-1',
      '1e3',
      'NaN',
      'Infinity',
      '1,5',
      '50 kg',
      '0.0001',
    ])
      expect(powerNumber(invalid, 300)).toBeUndefined();
    expect(powerNumber(' ５０.５ ', 300)).toBe(50.5);
    expect(powerNumber('.125', 50)).toBe(0.125);
    for (const n of ['1.5', '0', '101', 'many']) {
      d.risers = n;
      expect(powerState(d).rise).toBeUndefined();
      expect(powerState(d).completed).toBe(false);
    }
  });
  it('requires the fair plan, two height readings, three times and explanations without rating ability', () => {
    expect(powerHasData(emptyPower())).toBe(false);
    expect(powerState(emptyPower()).completed).toBe(false);
    const d = recorded();
    for (const f of [...powerPlanFields, ...powerExplainFields])
      expect(
        powerState({ ...d, fields: { ...d.fields, [f.key]: '' } }).completed,
      ).toBe(false);
    d.fields.explanation = '暂不确定，需要改进计时';
    expect(powerState(d).completed).toBe(true);
    d.heights = d.heights.slice(0, 1);
    expect(powerState(d).completed).toBe(false);
    const tiny = recorded();
    tiny.mass = '.001';
    tiny.risers = '1';
    tiny.heights = [reading('.001'), reading('.001')];
    tiny.times = ['600', '600', '600'].map(reading);
    expect(powerState(tiny).power).toBeGreaterThan(0);
    expect(powerMarkdown(tiny)).toContain('e-');
  });
  it('bounds drafts, drops unknown fields and rejects malformed storage', () => {
    const d = recorded();
    d.times = Array.from({ length: 20 }, () => ({
      ...reading('10'),
      value: 'x'.repeat(40),
      note: 'y'.repeat(900),
    }));
    d.fields.question = 'z'.repeat(2000);
    d.fields.unknown = 'ignore';
    d.step = 99;
    d.updatedAt = Infinity;
    const out = decodePower(d)!;
    expect(out.times).toHaveLength(12);
    expect(out.times[0]!.value).toHaveLength(16);
    expect(out.times[0]!.note).toHaveLength(500);
    expect(out.fields.question).toHaveLength(800);
    expect(out.fields.unknown).toBeUndefined();
    expect(out.step).toBe(3);
    expect(out.updatedAt).toBe(0);
    expect(
      decodePower({
        ...d,
        heights: [null, { value: 12, checked: 'yes', note: 42 }],
      }),
    ).toMatchObject({
      heights: [
        { value: '', checked: false, note: '' },
        { value: '', checked: false, note: '' },
      ],
    });
    for (const raw of [
      null,
      [],
      {},
      { fields: [], heights: [], times: [] },
      { fields: {}, heights: 'oops', times: [] },
    ])
      expect(decodePower(raw)).toBeUndefined();
  });
  it('preserves previous course mastery, notes and other projects when adding power storage', () => {
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
        walkingProject: {
          fields: { route: 'old route' },
          readings: {},
          updatedAt: 1,
        },
        materialsProject: {
          fields: { question: 'old specimen' },
          specimens: [],
        },
        powerProject: recorded(),
      }),
    );
    expect(out.lessons[lesson.id]?.completedAt).toBe(1);
    expect(out.notes[0]?.observation).toBe('old observation');
    expect(out.walkingProject?.fields.route).toBe('old route');
    expect(out.materialsProject?.fields.question).toBe('old specimen');
    expect(powerState(out.powerProject!).completed).toBe(true);
    expect(decodeProgress('{}')).toEqual({ lessons: {}, notes: [] });
  });
  it('exports original errors, reasons, checked status, raw/used means and limitations bilingually', () => {
    const d = recorded();
    d.times.push({
      ...reading('wrong'),
      excluded: true,
      note: 'timer|failed\ntry again',
    });
    const report = powerMarkdown(d);
    expect(report).toContain('timer\\|failed<br>try again');
    expect(report).toContain(
      '| 4 | wrong | true | 有原因排除 / Excluded with reason',
    );
    expect(report).toContain('125.00 W');
    expect(report).toContain('not the arithmetic mean');
    expect(report).toContain('not full measurement uncertainty');
    expect(report).toContain('not chemical-energy consumption');
    for (const f of [...powerPlanFields, ...powerExplainFields]) {
      expect(report).toContain(f.label.zh);
      expect(report).toContain(f.label.en);
      expect(f.hint.zh).toBeTruthy();
      expect(f.hint.en).toBeTruthy();
    }
  });
});
