import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { format } from 'prettier';

const webRoot = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(webRoot, '../../content/qa/SKILL_RECURRENCE.json');
const server = await createServer({
  root: webRoot,
  configFile: path.join(webRoot, 'vite.config.ts'),
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, watch: null },
});
try {
  const { curriculum, lessons, unitChecks } =
    await server.ssrLoadModule('/src/content.ts');
  const { maintenanceSets, recurrenceEvidence } = await server.ssrLoadModule(
    '/src/content/maintenance.ts',
  );
  const units = curriculum.flatMap((stage) =>
    stage.units.map((unit) => unit.id),
  );
  const unitIndex = new Map(units.map((unit, index) => [unit, index]));
  const lessonIndex = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const tasks = lessons.flatMap((lesson) =>
    [lesson.guided, ...lesson.questions, lesson.exit].map((question) => ({
      question,
      unit: lesson.unit,
      lesson: lesson.id,
    })),
  );
  const extraTasks = [
    ...Object.values(unitChecks),
    ...Object.values(maintenanceSets),
  ].flatMap((set) =>
    set.questions.map((question) => ({
      question,
      unit: set.unit,
      lesson: null,
    })),
  );
  const allTasks = [...tasks, ...extraTasks];
  const byId = new Map(allTasks.map((task) => [task.question.id, task]));
  if (byId.size !== allTasks.length)
    throw new Error('Duplicate task IDs in recurrence inventory');

  const skills = [
    ...new Set(
      lessons.flatMap((lesson) => [
        ...(lesson.skillTags ?? []),
        ...[lesson.guided, ...lesson.questions, lesson.exit].map(
          (q) => q.skill,
        ),
      ]),
    ),
  ];
  for (const evidence of recurrenceEvidence) {
    if (!skills.includes(evidence.skill))
      throw new Error(`Unknown source skill in evidence: ${evidence.skill}`);
  }
  // Exact tags are only search candidates. A reviewed rationale is an author's
  // semantic content audit, never proof of a particular learner's retention.
  const records = skills.map((skill) => {
    const source = lessons.find(
      (lesson) =>
        lesson.skillTags?.includes(skill) ||
        [lesson.guided, ...lesson.questions, lesson.exit].some(
          (q) => q.skill === skill,
        ),
    );
    const firstIndex = unitIndex.get(source.unit);
    const candidates = allTasks.filter(
      (task) =>
        task.question.skill === skill && unitIndex.get(task.unit) > firstIndex,
    );
    const reviewed = recurrenceEvidence
      .filter((evidence) => evidence.skill === skill)
      .map((evidence) => {
        const origin = lessonIndex.get(evidence.sourceLesson);
        const sourceTask = byId.get(evidence.sourceTask);
        if (
          !origin ||
          !unitIndex.has(origin.unit) ||
          !sourceTask ||
          sourceTask.lesson !== origin.id ||
          sourceTask.question.skill !== skill
        )
          throw new Error(`Invalid source evidence: ${skill}`);
        const targets = evidence.targets.map((id) => {
          const target = byId.get(id);
          if (
            !target ||
            !unitIndex.has(target.unit) ||
            unitIndex.get(target.unit) <= unitIndex.get(origin.unit)
          )
            throw new Error(`Invalid later-unit evidence: ${id}`);
          // A different tag can still apply the source concept. Preserve the
          // actual tag for scrutiny; only the explicit rationale claims semantic
          // recurrence. Exact-tag candidates above never become proof by count.
          return {
            unit: target.unit,
            task: id,
            taskSkill: target.question.skill,
          };
        });
        if (new Set(targets.map((target) => target.unit)).size < 2)
          throw new Error(`Fewer than two distinct later units: ${skill}`);
        if (!evidence.rationale.zh || !evidence.rationale.en)
          throw new Error(`Missing bilingual rationale: ${skill}`);
        return { ...evidence, targets };
      });
    return {
      skill,
      firstLesson: source.id,
      firstUnit: source.unit,
      sourceTasks: tasks
        .filter(
          (task) => task.unit === source.unit && task.question.skill === skill,
        )
        .map((task) => task.question.id),
      laterExactTagCandidates: Object.fromEntries(
        units
          .map((unit) => [
            unit,
            candidates
              .filter((task) => task.unit === unit)
              .map((task) => task.question.id),
          ])
          .filter(([, ids]) => ids.length),
      ),
      reviewedEvidence: reviewed,
      status: reviewed.length
        ? 'reviewed-content-evidence'
        : 'semantic-review-pending',
    };
  });
  const reviewedCount = records.filter(
    (record) => record.reviewedEvidence.length,
  ).length;
  const document = {
    schema: 1,
    scope:
      'Lesson-level skill tags and explicit task-level semantic recurrence evidence; not a complete taxonomy of every subskill and not learner trial evidence.',
    counts: {
      lessons: lessons.length,
      units: units.length,
      skills: records.length,
      reviewedSkills: reviewedCount,
      pendingSkills: records.length - reviewedCount,
    },
    records,
  };
  const serialised = await format(JSON.stringify(document), { parser: 'json' });
  if (process.argv.includes('--check')) {
    if ((await readFile(output, 'utf8')) !== serialised)
      throw new Error(
        'Recurrence inventory is stale. Re-run audit-skill-recurrence.mjs.',
      );
    console.log(
      'Recurrence inventory matches current source:',
      document.counts,
    );
  } else {
    await writeFile(output, serialised);
    console.log('Wrote recurrence inventory:', document.counts);
  }
} finally {
  await server.close();
}
