import { curriculum } from '../content';
import { t } from '../model';
// These are real content owners after H38,not formal lessons or unit checks.
export const postRouteUnits = [
  {
    id: 'R01',
    kind: 'maintenance-only',
    title: t('重建与核验', 'Rebuild and verify'),
    intro: t(
      '在终章之后，从新给定重建拓展方法与项目模型；把证明、账本和验证对象说完整。',
      'After the capstone,rebuild extension methods and project models from new givens,with complete proofs,ledgers and validation targets.',
    ),
    groupIds: ['R01-MAINT-EXTENSION', 'R01-MAINT-PROJECT'],
  },
  {
    id: 'R02',
    kind: 'maintenance-only',
    title: t('迁移与质疑', 'Transfer and challenge'),
    intro: t(
      '另换情境，检查零权环、独立新数据和压力条件，保留反例与不确定结论。',
      'Change contexts again to examine zero-cost cycles,new independent data and stress conditions,retaining counterexamples and uncertainty.',
    ),
    groupIds: ['R02-MAINT-EXTENSION', 'R02-MAINT-PROJECT'],
  },
] as const;
export const formalRecurrenceUnitIds = curriculum.flatMap((stage) =>
  stage.units.map((unit) => unit.id),
);
export const recurrenceUnitIds = [
  ...formalRecurrenceUnitIds,
  ...postRouteUnits.map((unit) => unit.id),
];
export const recurrenceUnitIndex = new Map(
  recurrenceUnitIds.map((id, i) => [id, i]),
);
export const postRouteUnitFor = (id: string | undefined) =>
  postRouteUnits.find((unit) => unit.id === id);
type OwnedSet = {
  id: string;
  unit: string;
  questions: readonly { id: string }[];
};
export function assertMaintenanceOwners(sets: readonly OwnedSet[]) {
  if (new Set(recurrenceUnitIds).size !== recurrenceUnitIds.length)
    throw Error('Duplicate formal/post-route owner');
  const byId = new Map(sets.map((set) => [set.id, set]));
  if (byId.size !== sets.length) throw Error('Duplicate maintenance set ID');
  const taskIds = sets.flatMap((set) => set.questions.map((q) => q.id));
  if (new Set(taskIds).size !== taskIds.length)
    throw Error('Duplicate maintenance task ID');
  for (const set of sets) {
    if (!recurrenceUnitIndex.has(set.unit))
      throw Error('Unknown maintenance owner: ' + set.unit);
    if (set.questions.length < 1 || set.questions.length > 10)
      throw Error('Maintenance group must have one to ten tasks: ' + set.id);
    const owner = postRouteUnitFor(set.unit);
    if (owner && !(owner.groupIds as readonly string[]).includes(set.id))
      throw Error('Undeclared post-route group: ' + set.id);
  }
  for (const owner of postRouteUnits)
    for (const id of owner.groupIds) {
      const set = byId.get(id);
      if (!set || set.unit !== owner.id || !set.questions.length)
        throw Error('Missing real post-route content: ' + id);
    }
}
