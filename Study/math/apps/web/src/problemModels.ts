import { boundedWhole } from './measurementModels';
export type Relation = 'parts' | 'comparison' | 'groups';
export type Unknown = 'result' | 'component';
export function barRelation(
  relation: Relation,
  a: number,
  b: number,
  unknown: Unknown,
) {
  boundedWhole(a, 100);
  boundedWhole(b, 100);
  if (relation === 'groups') {
    boundedWhole(a, 8, 1);
    boundedWhole(b, 20);
    if (unknown !== 'result')
      throw new RangeError('This equal-group model asks for the total');
  }
  if (relation === 'comparison' && a < b)
    throw new RangeError(
      'The first compared quantity must be at least the second',
    );
  const whole =
    relation === 'groups' ? a * b : relation === 'parts' ? a + b : a;
  const result =
    relation === 'groups'
      ? whole
      : relation === 'parts'
        ? unknown === 'result'
          ? whole
          : b
        : unknown === 'result'
          ? a - b
          : a;
  // Zero values retain zero width; the fallback scale only avoids division by zero.
  const scale = 420 / Math.max(whole, 1);
  return {
    whole,
    result,
    scale,
    aWidth: (relation === 'groups' ? b : a) * scale,
    bWidth: b * scale,
    gapWidth: (relation === 'comparison' ? a - b : b) * scale,
  };
}
export function cardJourney(boxes: number, each: number, given: number) {
  boundedWhole(boxes, 6, 1);
  boundedWhole(each, 10, 1);
  const total = boxes * each;
  boundedWhole(given, total);
  return { total, given, remaining: total - given };
}
export function relevantFacts(goal: 'change' | 'cost' | 'mass') {
  return goal === 'change' ? [0, 1, 2] : goal === 'cost' ? [1, 2] : null;
}
export function exactSelection(selected: number[], required: number[]) {
  if (new Set(selected).size !== selected.length) return false;
  return (
    selected.length === required.length &&
    required.every((i) => selected.includes(i))
  );
}
