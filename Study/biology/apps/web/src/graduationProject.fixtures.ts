// TEST FIXTURES ONLY. Never imported by the product UI or used as real observations.
import {
  emptyGraduationProject,
  researchFields,
  type GraduationCaseId,
  type GraduationDraft,
} from './graduationProject';
export function researchFixture(id: GraduationCaseId): GraduationDraft {
  const draft = emptyGraduationProject();
  draft.active = id;
  const c = draft.cases[id];
  for (const key of researchFields)
    if (key !== 'secondLanguage')
      c.text[key] = `TEST FIXTURE ONLY / 自动验收虚构记录: ${key}.`;
  c.speech = c.speech.map((s, i) => ({
    ...s,
    notes: `TEST FIXTURE ONLY speaking note ${i + 1}: evidence, limits and next question.`,
    seconds: 45,
  }));
  c.rubric = c.rubric.map(() => true);
  if (id === 'official') {
    c.citations = ['W-N-8M', 'W-N-RC'];
    c.calculations = ['32.08', '20.24'];
  } else {
    c.startDate = '2026-10-01';
    c.activePlant = 'TEST-PLANT-A';
    c.records = [
      { id: 'Ptest0', plant: 'TEST-PLANT-A', day: 0, value: 10 },
      { id: 'Ptest3', plant: 'TEST-PLANT-A', day: 3, value: 12 },
      { id: 'Ptest5', plant: 'TEST-PLANT-A', day: 5, value: null },
      { id: 'Ptest10', plant: 'TEST-PLANT-A', day: 10, value: 15 },
      { id: 'Ptest-other', plant: 'TEST-PLANT-B', day: 0, value: 90 },
    ];
    c.citations = ['Ptest0', 'Ptest10'];
    c.calculations = ['5', '50'];
  }
  return draft;
}
