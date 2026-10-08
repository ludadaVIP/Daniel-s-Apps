import { materialNumber } from './materials';
export const MAX_LIFTING_TRIALS = 8;
export const liftingFieldLimits = {
  question: 800,
  prediction: 800,
  materials: 1000,
  procedure: 1200,
  construction: 1500,
  observation: 1200,
  explanation: 1500,
  uncertainty: 1200,
} as const;
export const designBounds = {
  weight: [10, 60],
  heightCm: [1, 4],
  forceLimit: [5, 30],
  travelLimitCm: [3, 20],
  efficiency: [0.5, 1],
  effortArmCm: [10, 40],
} as const;
export type LiftingDesign = Record<keyof typeof designBounds, number>;
export const defaultLiftingDesign = (): LiftingDesign => ({
  weight: 40,
  heightCm: 2,
  forceLimit: 15,
  travelLimitCm: 10,
  efficiency: 0.8,
  effortArmCm: 40,
});
export const liftingResults = [
  'unrecorded',
  'full',
  'partial',
  'none',
] as const;
export const trialNumbers = {
  effortArmCm: 100,
  loadArmCm: 100,
  payloadG: 200,
  effortN: 50,
  handTravelCm: 200,
  liftCm: 20,
} as const;
export type LiftingTrial = Record<keyof typeof trialNumbers, string> & {
  result: (typeof liftingResults)[number];
  observation: string;
  checked: boolean;
  excluded: boolean;
  reason: string;
};
export type LiftingDraft = {
  fields: Record<string, string>;
  design: LiftingDesign;
  buildChecked: boolean;
  fairChecked: boolean;
  trials: LiftingTrial[];
  step: number;
  updatedAt: number;
};
export const emptyLiftingTrial = (): LiftingTrial => ({
  effortArmCm: '',
  loadArmCm: '',
  payloadG: '',
  effortN: '',
  handTravelCm: '',
  liftCm: '',
  result: 'unrecorded',
  observation: '',
  checked: false,
  excluded: false,
  reason: '',
});
export const emptyLifting = (): LiftingDraft => ({
  fields: {},
  design: defaultLiftingDesign(),
  buildChecked: false,
  fairChecked: false,
  trials: Array.from({ length: 3 }, emptyLiftingTrial),
  step: 0,
  updatedAt: 0,
});
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown, max: number) =>
  typeof x === 'string' ? x.slice(0, max) : '';
export function decodeLifting(raw: unknown): LiftingDraft | undefined {
  if (!object(raw) || !object(raw.fields) || !Array.isArray(raw.trials)) return;
  const fields = raw.fields,
    defaults = defaultLiftingDesign(),
    design = object(raw.design) ? raw.design : {};
  const trials = raw.trials
    .slice(0, MAX_LIFTING_TRIALS)
    .map((x): LiftingTrial => {
      if (!object(x)) return emptyLiftingTrial();
      return {
        ...emptyLiftingTrial(),
        ...Object.fromEntries(
          Object.keys(trialNumbers).map((key) => [key, text(x[key], 16)]),
        ),
        result:
          typeof x.result === 'string' &&
          (liftingResults as readonly string[]).includes(x.result)
            ? (x.result as LiftingTrial['result'])
            : 'unrecorded',
        observation: text(x.observation, 800),
        reason: text(x.reason, 500),
        checked: x.checked === true,
        excluded: x.excluded === true,
      };
    });
  while (trials.length < 3) trials.push(emptyLiftingTrial());
  return {
    fields: Object.fromEntries(
      Object.entries(liftingFieldLimits).map(([key, max]) => [
        key,
        text(fields[key], max),
      ]),
    ),
    design: Object.fromEntries(
      Object.entries(designBounds).map(([key, [min, max]]) => {
        const value = design[key];
        return [
          key,
          typeof value === 'number' &&
          Number.isFinite(value) &&
          value >= min &&
          value <= max
            ? value
            : defaults[key as keyof LiftingDesign],
        ];
      }),
    ) as LiftingDesign,
    buildChecked: raw.buildChecked === true,
    fairChecked: raw.fairChecked === true,
    trials,
    step: Number.isInteger(raw.step)
      ? Math.max(0, Math.min(3, raw.step as number))
      : 0,
    updatedAt:
      typeof raw.updatedAt === 'number' &&
      Number.isFinite(raw.updatedAt) &&
      raw.updatedAt > 0
        ? raw.updatedAt
        : 0,
  };
}
export function liftingTrial(r: LiftingTrial) {
  const numbers = Object.fromEntries(
    Object.entries(trialNumbers).map(([key, max]) => [
      key,
      materialNumber(
        r[key as keyof typeof trialNumbers],
        max,
        key === 'handTravelCm' || key === 'liftCm',
      ),
    ]),
  ) as Record<keyof typeof trialNumbers, number | undefined>;
  const valid =
    numbers.effortArmCm !== undefined &&
    numbers.loadArmCm !== undefined &&
    Object.keys(trialNumbers).every(
      (key) =>
        !r[key as keyof typeof trialNumbers].trim() ||
        numbers[key as keyof typeof trialNumbers] !== undefined,
    ) &&
    r.result !== 'unrecorded' &&
    !!r.observation.trim() &&
    !(
      r.result === 'none' &&
      numbers.liftCm !== undefined &&
      numbers.liftCm > 0
    ) &&
    !(['full', 'partial'].includes(r.result) && numbers.liftCm === 0);
  const pendingReason = r.excluded && !r.reason.trim(),
    excluded = r.excluded && !!r.reason.trim();
  const entered =
    [
      ...Object.keys(trialNumbers).map(
        (key) => r[key as keyof typeof trialNumbers],
      ),
      r.observation,
      r.reason,
    ].some((x) => !!x.trim()) ||
    r.result !== 'unrecorded' ||
    r.checked ||
    r.excluded;
  return {
    ...numbers,
    valid,
    pendingReason,
    excluded,
    entered,
    used: valid && r.checked && !excluded,
    unresolved: entered && !excluded && (!valid || !r.checked || pendingReason),
  };
}
export function liftingState(d: LiftingDraft) {
  const trials = d.trials.map(liftingTrial),
    used = trials.flatMap((r, i) => (r.used ? [{ ...r, index: i }] : []));
  const groups = new Map<number, typeof used>();
  used.forEach((r) =>
    groups.set(r.loadArmCm!, [...(groups.get(r.loadArmCm!) ?? []), r]),
  );
  const compared = [...groups.values()].some(
    (rows) =>
      rows.length >= 3 &&
      new Set(rows.map((r) => r.effortArmCm)).size >= 2 &&
      rows.some(
        (r) =>
          rows.filter((other) => other.effortArmCm === r.effortArmCm).length >=
          2,
      ),
  );
  const planned = ['question', 'prediction', 'materials', 'procedure'].every(
      (key) => !!d.fields[key]?.trim(),
    ),
    built = !!d.fields.construction?.trim() && d.buildChecked && d.fairChecked,
    explained = ['observation', 'explanation', 'uncertainty'].every(
      (key) => !!d.fields[key]?.trim(),
    );
  return {
    trials,
    used,
    compared,
    planned,
    built,
    explained,
    completed:
      planned &&
      built &&
      explained &&
      compared &&
      !trials.some((r) => r.unresolved),
  };
}
export function reviseLiftingField(
  d: LiftingDraft,
  key: string,
  value: string,
): LiftingDraft {
  if (d.fields[key] === value) return d;
  return {
    ...d,
    fields: { ...d.fields, [key]: value },
    ...(['materials', 'procedure', 'construction'].includes(key)
      ? {
          buildChecked: false,
          fairChecked: false,
          trials: d.trials.map((r) => ({ ...r, checked: false })),
        }
      : {}),
  };
}
export function reviseLiftingTrial(
  d: LiftingDraft,
  index: number,
  patch: Partial<LiftingTrial>,
): LiftingDraft {
  return {
    ...d,
    trials: d.trials.map((r, i) =>
      i !== index
        ? r
        : {
            ...r,
            ...patch,
            ...((
              [
                ...Object.keys(trialNumbers),
                'result',
                'observation',
              ] as (keyof LiftingTrial)[]
            ).some((key) => patch[key] !== undefined && patch[key] !== r[key])
              ? { checked: false }
              : {}),
          },
    ),
  };
}
export const liftingHasData = (d: LiftingDraft) =>
  Object.values(d.fields).some((x) => !!x.trim()) ||
  d.buildChecked ||
  d.fairChecked ||
  d.trials.some((r) => liftingTrial(r).entered) ||
  Object.entries(d.design).some(
    ([key, value]) =>
      value !== defaultLiftingDesign()[key as keyof LiftingDesign],
  );
