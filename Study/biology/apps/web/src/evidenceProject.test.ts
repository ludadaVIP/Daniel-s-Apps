import { describe, expect, it } from 'vitest';
import {
  actualEvidenceCaption,
  calculationCorrect,
  decodeEvidenceProject,
  editEvidence,
  emptyEvidenceProject,
  evidenceQuestions,
  evidenceReady,
  evidenceSummary,
  evidenceTextFields,
  evidenceUnderstanding,
  percentChange,
  potatoRecords,
  saveEvidence,
  zeroEstimate,
} from './evidenceProject';
import { evidenceGraphSvg, evidenceSvg } from './evidenceSvg';
import {
  decodeProgress,
  emptyProgress,
  evidenceStageOutcome,
  storyStageOutcome,
  stageOutcome,
  leafStageOutcome,
  ecoStageOutcome,
  withEvidenceProject,
  withMission,
} from './progress';

export function readyEvidence() {
  const d = emptyEvidenceProject();
  d.calculations = [potatoRecords[1]!, potatoRecords[2]!].map((r) =>
    percentChange(r.before, r.after).toFixed(2),
  );
  d.xAxis = 0;
  d.yAxis = 0;
  d.display = 0;
  d.citations = ['mean-0.2', 'mean-0.4'];
  d.reviewed = true;
  for (const k of evidenceTextFields)
    d[k] = 'A substantive explanation in either language.';
  return d;
}
describe('S05 paired blocked evidence domain', () => {
  it('normalizes each paired change by initial mass, keeps losses signed and rejects invalid masses', () => {
    expect(percentChange(2, 2.2)).toBeCloseTo(10);
    expect(percentChange(2, 1.8)).toBeCloseTo(-10);
    for (const v of [0, -1, Infinity, NaN])
      expect(() => percentChange(v, 2)).toThrow();
    expect(() => percentChange(2, Infinity)).toThrow();
    const r = potatoRecords[1]!;
    expect(
      calculationCorrect(String(percentChange(r.before, r.after)), 0),
    ).toBe(true);
    expect(
      calculationCorrect(String((100 * (r.after - r.before)) / r.after), 0),
    ).toBe(false);
    expect(calculationCorrect('', 0)).toBe(false);
    expect(calculationCorrect('Infinity', 0)).toBe(false);
    expect(calculationCorrect('3', 9)).toBe(false);
  });
  it('retains 20 distinct treatment units, four biological blocks and n=4 at five levels', () => {
    expect(potatoRecords).toHaveLength(20);
    expect(new Set(potatoRecords.map((r) => r.id)).size).toBe(20);
    expect([...new Set(potatoRecords.map((r) => r.block))]).toEqual([
      'A',
      'B',
      'C',
      'D',
    ]);
    for (const block of ['A', 'B', 'C', 'D'])
      expect(
        potatoRecords
          .filter((r) => r.block === block)
          .map((r) => r.concentration),
      ).toEqual([0, 0.2, 0.4, 0.6, 0.8]);
    for (const row of evidenceSummary) {
      const rs = potatoRecords.filter(
          (r) => r.concentration === row.concentration,
        ),
        values = rs.map((r) => percentChange(r.before, r.after));
      expect(row.n).toBe(4);
      expect(row.mean).toBeCloseTo(values.reduce((a, b) => a + b, 0) / 4, 12);
      expect(row.min).toBe(Math.min(...values));
      expect(row.max).toBe(Math.max(...values));
      for (const r of rs) {
        expect(r.before * 100).toBeCloseTo(Math.round(r.before * 100));
        expect(r.after * 100).toBeCloseTo(Math.round(r.after * 100));
      }
    }
    const rs = potatoRecords.filter((r) => r.concentration === 0.2);
    const ratio = percentChange(
      rs.reduce((n, r) => n + r.before, 0),
      rs.reduce((n, r) => n + r.after, 0),
    );
    expect(Math.abs(evidenceSummary[1]!.mean - ratio)).toBeGreaterThan(0.001);
    expect(evidenceSummary[1]!.mean).toBeGreaterThan(0);
    expect(evidenceSummary[2]!.mean).toBeLessThan(0);
    expect(zeroEstimate).toBeGreaterThan(0.2);
    expect(zeroEstimate).toBeLessThan(0.4);
    expect(zeroEstimate).toBeCloseTo(0.3, 2);
  });
  it('validates calculations, graph, distinct real citations and self-review before saving; every edit invalidates', () => {
    const d = readyEvidence();
    expect(evidenceReady(d)).toBe(true);
    expect(saveEvidence(d, 20).savedAt).toBe(20);
    for (const bad of [
      { calculations: ['0', '0'] },
      { xAxis: 1 },
      { yAxis: 1 },
      { display: 1 },
      { citations: ['mean-0.2', 'mean-0.2'] },
      { citations: ['mean-0.2', 'invented'] },
      { reviewed: false },
      { mechanism: '' },
    ]) {
      const changed = { ...d, ...bad };
      expect(evidenceReady(changed)).toBe(false);
      expect(() => saveEvidence(changed, 20)).toThrow();
      expect(
        decodeEvidenceProject({ ...changed, savedAt: 20 }).savedAt,
      ).toBeUndefined();
    }
    expect(
      editEvidence(saveEvidence(d, 20), {
        challenge: 'Revised challenging outcome',
      }).savedAt,
    ).toBeUndefined();
    expect(
      decodeEvidenceProject({ ...d, savedAt: Infinity }).savedAt,
    ).toBeUndefined();
    expect(
      decodeEvidenceProject({ ...d, savedAt: Number.MAX_VALUE }).savedAt,
    ).toBeUndefined();
    expect(() => saveEvidence(d, Number.MAX_VALUE)).toThrow();
    for (const patch of [
      { xAxis: NaN },
      { display: 2 },
      { calculations: ['1'] },
      { answers: { 'S05-Q1': 99 } },
      { answers: [] },
      { claim: 10 },
    ])
      expect(() => decodeEvidenceProject({ ...d, ...patch })).toThrow();
  });
  it('requires all six cross-unit questions and permits corrected answers; rejects invalid answer indices', () => {
    const d = readyEvidence();
    for (const question of evidenceQuestions)
      d.answers[question.id] = question.correct;
    expect(evidenceUnderstanding(d)).toEqual({ answered: 6, correct: 6 });
    d.answers['S05-Q1'] = 0;
    expect(evidenceUnderstanding(d)).toEqual({ answered: 6, correct: 5 });
    d.answers['S05-Q1'] = 1;
    expect(evidenceUnderstanding(d).correct).toBe(6);
    delete d.answers['S05-Q6'];
    expect(evidenceUnderstanding(d).answered).toBe(5);
    expect(() =>
      decodeEvidenceProject({ ...d, answers: { 'S05-Q1': Infinity } }),
    ).toThrow();
  });
  it('preserves v1 old projects and isolates stage counts; savedAt alone cannot award S05', () => {
    const old = emptyProgress();
    old.sessions.L001 = { step: 3, note: 'old', completedAt: 10 };
    old.mission = {
      object: 'old',
      evidence: 'old',
      reasoning: 'old',
      savedAt: 10,
    };
    let p = withEvidenceProject(
      decodeProgress(JSON.stringify(old)),
      readyEvidence(),
    );
    for (let i = 1; i <= 96; i++)
      p.sessions[`L${String(i).padStart(3, '0')}`] = {
        step: 3,
        note: 'old',
        completedAt: 10,
      };
    expect(evidenceStageOutcome(p)).toEqual({
      lessons: 0,
      missions: 0,
      complete: false,
    });
    const before = [
      stageOutcome,
      leafStageOutcome,
      ecoStageOutcome,
      storyStageOutcome,
    ].map((fn) => fn(p));
    for (let i = 97; i <= 120; i++)
      p.sessions[`L${String(i).padStart(3, '0')}`] = {
        step: 3,
        note: 'S05',
        completedAt: 20,
      };
    for (let i = 25; i <= 30; i++)
      p = withMission(p, `U${i}`, {
        object: 'claim',
        evidence: 'data',
        reasoning: 'limits',
        savedAt: 20,
      });
    expect(evidenceStageOutcome(p).complete).toBe(false);
    const d = readyEvidence();
    for (const q of evidenceQuestions) d.answers[q.id] = q.correct;
    p = withEvidenceProject(p, saveEvidence(d, 20));
    p = decodeProgress(JSON.stringify(p));
    expect(evidenceStageOutcome(p)).toEqual({
      lessons: 24,
      missions: 6,
      complete: true,
    });
    expect(
      [stageOutcome, leafStageOutcome, ecoStageOutcome, storyStageOutcome].map(
        (fn) => fn(p),
      ),
    ).toEqual(before);
    expect(p.sessions.L001).toEqual(old.sessions.L001);
    expect(p.mission).toEqual(old.mission);
    const invalid = editEvidence(d, { citations: ['fake', 'fake'] });
    p = withEvidenceProject(p, { ...invalid, savedAt: 20 });
    expect(evidenceStageOutcome(p).complete).toBe(false);
    expect(
      decodeProgress(JSON.stringify(p)).projects.S05?.savedAt,
    ).toBeUndefined();
  });
  it('plots signed raw points, means and ranges; incorrect choices change actual output and caption', () => {
    const d = readyEvidence(),
      svg = evidenceGraphSvg(d);
    expect((svg.match(/<circle /g) ?? []).length).toBe(20);
    expect((svg.match(/<rect x=/g) ?? []).length).toBe(5);
    expect(svg).toContain('-20');
    expect(svg).toContain('stroke-dasharray="6 3"');
    expect(svg).toContain('mol/L');
    const wrong = { ...d, display: 1, yAxis: 1, xAxis: 1 };
    expect(evidenceGraphSvg(wrong)).not.toBe(svg);
    expect(evidenceGraphSvg(wrong)).not.toContain('<circle');
    expect(actualEvidenceCaption(wrong).en).toContain(
      'raw mass difference (g)',
    );
    expect(actualEvidenceCaption(wrong).en).toContain('hidden');
    expect(actualEvidenceCaption(wrong).zh).toContain('杯子类别');
  });
  it('exports every record, actual graph, long escaped prose, settings, all questions and final fields with dynamic height', () => {
    const d = readyEvidence();
    d.claim =
      '<script>alert("x")</script>&' + 'W'.repeat(1500) + '中文'.repeat(600);
    d.challenge = 'FINAL-CHALLENGE';
    d.languagePractice = 'FINAL-PRACTICE';
    const svg = evidenceSvg(d),
      short = evidenceSvg(readyEvidence());
    expect(evidenceSvg({ ...d, savedAt: Number.MAX_VALUE })).toContain(
      'Draft / 草稿',
    );
    const sanitized = evidenceSvg({
      ...d,
      challenge: 'control\u0000\ud800end',
    });
    for (const code of [0, 0xd800])
      expect(sanitized).not.toContain(String.fromCharCode(code));
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
    for (const r of potatoRecords)
      expect(svg).toContain(`${r.id} | ${r.block} |`);
    for (const s of evidenceSummary)
      expect(svg).toContain(
        `${s.concentration.toFixed(1)} | ${s.mean.toFixed(2)}`,
      );
    for (const question of evidenceQuestions)
      expect(svg).toContain(question.id);
    expect(svg).toContain('FINAL-CHALLENGE');
    expect(svg).toContain('FINAL-PRACTICE');
    expect(svg).toContain('END OF REPORT');
    expect(svg).toContain('Graph settings');
    expect(svg).toContain('<circle');
    expect(Number(svg.match(/height="(\d+)"/)![1])).toBeGreaterThan(
      Number(short.match(/height="(\d+)"/)![1]),
    );
    const width = 900,
      height = Number(svg.match(/height="(\d+)"/)![1]);
    for (const m of svg.matchAll(
      /<text x="([\d.]+)" y="([\d.]+)" font-size="([\d.]+)">([^<]*)<\/text>/g,
    )) {
      const content = m[4]!.replace(/&(?:lt|gt|quot|apos|amp);/g, 'X');
      // Conservative upper bound: each glyph at most one em (Arial W is < 1em).
      expect(
        Number(m[1]) + [...content].length * Number(m[3]),
      ).toBeLessThanOrEqual(width);
      expect(Number(m[2])).toBeLessThan(height);
    }
  });
});
