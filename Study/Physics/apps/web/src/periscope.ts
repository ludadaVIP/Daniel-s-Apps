import { materialNumber } from './materials';
export const MAX_PERISCOPE_TRIALS = 8;
export const periscopeFieldLimits = {
  question: 800,
  materials: 1000,
  procedure: 1200,
  construction: 1500,
  observation: 1200,
  explanation: 1500,
  uncertainty: 1200,
} as const;
export const periscopeFields = Object.entries(periscopeFieldLimits).map(
  ([key, max]) => ({ key, max }),
);
const planKeys = ['question', 'materials', 'procedure'];
const explanationKeys = ['observation', 'explanation', 'uncertainty'];
const resultKeys = ['unrecorded', 'visible', 'partial', 'not-visible'] as const;
export type PeriscopeTrial = {
  condition: string;
  angle: string;
  result: (typeof resultKeys)[number];
  observation: string;
  checked: boolean;
  excluded: boolean;
  reason: string;
};
export type PeriscopeDraft = {
  fields: Record<string, string>;
  buildChecked: boolean;
  fairChecked: boolean;
  trials: PeriscopeTrial[];
  step: number;
  updatedAt: number;
};
export const emptyPeriscopeTrial = (): PeriscopeTrial => ({
  condition: '',
  angle: '',
  result: 'unrecorded',
  observation: '',
  checked: false,
  excluded: false,
  reason: '',
});
export const emptyPeriscope = (): PeriscopeDraft => ({
  fields: {},
  buildChecked: false,
  fairChecked: false,
  trials: Array.from({ length: 3 }, emptyPeriscopeTrial),
  step: 0,
  updatedAt: 0,
});
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown, max: number) =>
  typeof x === 'string' ? x.slice(0, max) : '';
export function decodePeriscope(raw: unknown): PeriscopeDraft | undefined {
  if (!object(raw) || !object(raw.fields) || !Array.isArray(raw.trials)) return;
  const fields = raw.fields;
  const trials = raw.trials
    .slice(0, MAX_PERISCOPE_TRIALS)
    .map((x): PeriscopeTrial => {
      if (!object(x)) return emptyPeriscopeTrial();
      return {
        condition: text(x.condition, 300),
        angle: text(x.angle, 16),
        observation: text(x.observation, 800),
        result:
          typeof x.result === 'string' &&
          (resultKeys as readonly string[]).includes(x.result)
            ? (x.result as PeriscopeTrial['result'])
            : 'unrecorded',
        checked: x.checked === true,
        excluded: x.excluded === true,
        reason: text(x.reason, 500),
      };
    });
  while (trials.length < 3) trials.push(emptyPeriscopeTrial());
  return {
    fields: Object.fromEntries(
      periscopeFields.map((f) => [f.key, text(fields[f.key], f.max)]),
    ),
    trials,
    buildChecked: raw.buildChecked === true,
    fairChecked: raw.fairChecked === true,
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
export function periscopeTrial(r: PeriscopeTrial) {
  const angle = materialNumber(r.angle, 90, true);
  const valid =
    !!r.condition.trim() &&
    !!r.observation.trim() &&
    r.result !== 'unrecorded' &&
    (!r.angle.trim() || angle !== undefined);
  const pendingReason = r.excluded && !r.reason.trim(),
    excluded = r.excluded && !!r.reason.trim();
  const entered =
    [r.condition, r.angle, r.observation, r.reason].some((x) => !!x.trim()) ||
    r.result !== 'unrecorded' ||
    r.checked ||
    r.excluded;
  return {
    angle,
    valid,
    pendingReason,
    excluded,
    entered,
    used: valid && r.checked && !excluded,
    unresolved: entered && !excluded && (!valid || !r.checked || pendingReason),
  };
}
export function periscopeState(d: PeriscopeDraft) {
  const trials = d.trials.map(periscopeTrial),
    used = trials.flatMap((r, i) => (r.used ? [{ ...r, index: i }] : []));
  const conditions = new Set(
    used.map((r) =>
      d.trials[r.index]!.condition.normalize('NFKC')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase(),
    ),
  ).size;
  const planned = planKeys.every((key) => !!d.fields[key]?.trim());
  const built =
    !!d.fields.construction?.trim() && d.buildChecked && d.fairChecked;
  const explained = explanationKeys.every((key) => !!d.fields[key]?.trim());
  return {
    trials,
    used,
    conditions,
    planned,
    built,
    explained,
    completed:
      planned &&
      built &&
      explained &&
      used.length >= 3 &&
      conditions >= 2 &&
      !trials.some((r) => r.unresolved),
  };
}
export function revisePeriscopeField(
  d: PeriscopeDraft,
  key: string,
  value: string,
): PeriscopeDraft {
  if (d.fields[key] === value) return d;
  const changesBuild = ['materials', 'procedure', 'construction'].includes(key);
  return {
    ...d,
    fields: { ...d.fields, [key]: value },
    ...(changesBuild
      ? {
          buildChecked: false,
          fairChecked: false,
          trials: d.trials.map((r) => ({ ...r, checked: false })),
        }
      : {}),
  };
}
export function revisePeriscopeTrial(
  d: PeriscopeDraft,
  index: number,
  patch: Partial<PeriscopeTrial>,
): PeriscopeDraft {
  return {
    ...d,
    trials: d.trials.map((r, i) => {
      if (i !== index) return r;
      const changed = (
        ['condition', 'angle', 'result', 'observation'] as const
      ).some((key) => patch[key] !== undefined && patch[key] !== r[key]);
      return { ...r, ...patch, ...(changed ? { checked: false } : {}) };
    }),
  };
}
export const periscopeHasData = (d: PeriscopeDraft) =>
  Object.values(d.fields).some((x) => !!x.trim()) ||
  d.buildChecked ||
  d.fairChecked ||
  d.trials.some((r) => periscopeTrial(r).entered);
