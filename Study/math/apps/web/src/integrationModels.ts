import {
  rational,
  addR,
  mulR,
  divR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import {
  principalRadical,
  radicalText,
  multiplyRadicals,
} from './radicalModels';
import { roundTrig } from './trigModels';
const whole = (n: number, min: number, max: number) => {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Bounded classroom quantity');
  return n;
};
const number = (r: Rational) => Number(r[0]) / Number(r[1]);
const compare = (a: Rational, b: Rational) => a[0] * b[1] <= b[0] * a[1];
export type IntegrationVerdict =
  'valid' | 'invalid' | 'insufficient' | 'outside-domain';
export function checkIntegrationVerdict(
  raw: string,
  value: IntegrationVerdict,
) {
  const words: Record<IntegrationVerdict, string[]> = {
    'outside-domain': ['outside-domain', 'outside domain', '不在定义域'],
    valid: ['valid', '成立', '已核验'],
    invalid: ['invalid', '错误', '不成立'],
    insufficient: ['insufficient', '证据不足', '条件不足'],
  };
  return words[value].includes(raw.trim().toLowerCase());
}
export function rectangleLink(x: string, offset: number) {
  whole(offset, 0, 4);
  const a = readRational(x);
  if (a[0] <= 0n || !compare(a, rational(8n)))
    throw new RangeError('Positive bounded side x');
  const b = addR(a, rational(BigInt(offset))),
    area = mulR(a, b),
    perimeter = mulR(rational(2n), addR(a, b));
  return {
    x: a,
    long: b,
    offset,
    area,
    perimeter,
    areaExpression: offset ? `x^2+${offset}x` : 'x^2',
    perimeterExpression: offset ? `4x+${2 * offset}` : '4x',
  };
}
export type IntegrationGraphKind =
  'affine' | 'drain' | 'count' | 'observations';
export function integrationGraph(kind: IntegrationGraphKind, query: string) {
  const x = readRational(query),
    n = number(x);
  if (
    !['affine', 'drain', 'count', 'observations'].includes(kind) ||
    n < 0 ||
    n > 9
  )
    throw new RangeError('Known bounded graph query');
  if (kind === 'affine')
    return {
      kind,
      x,
      value: n <= 4 ? addR(mulR(rational(2n), x), rational(3n)) : null,
      defined: n <= 4,
      domain: n <= 4,
    };
  if (kind === 'count')
    return {
      kind,
      x,
      value:
        x[1] === 1n && n <= 5
          ? addR(mulR(rational(2n), x), rational(3n))
          : null,
      defined: x[1] === 1n && n <= 5,
      domain: x[1] === 1n && n <= 5,
    };
  if (kind === 'observations')
    return {
      kind,
      x,
      value: n === 0 ? rational(0n) : n === 1 ? rational(1n) : null,
      defined: n === 0 || n === 1,
      domain: n === 0 || n === 1,
    };
  const value =
    n <= 3
      ? addR(rational(12n), mulR(rational(-2n), x))
      : n <= 6
        ? rational(6n)
        : addR(rational(18n), mulR(rational(-2n), x));
  return { kind, x, value, defined: true, domain: true };
}
export type StrategyKind = 'garden' | 'diagonal' | 'journey';
export type StrategyCard = {
  id: string;
  needs: string[];
  zh: string;
  en: string;
  trap?: boolean;
};
export const strategyCases: Record<
  StrategyKind,
  {
    zh: string;
    en: string;
    answer: string;
    unit: 'm' | 'km/h';
    cards: StrategyCard[];
  }
> = {
  garden: {
    zh: '长方形相邻边x与x+2 m，面积48 m²，求周长。',
    en: 'Rectangle sides x and x+2 m have area 48 m². Find perimeter.',
    answer: '28',
    unit: 'm',
    cards: [
      {
        id: 'model',
        needs: [],
        zh: '面积给x(x+2)=48',
        en: 'Area gives x(x+2)=48',
      },
      {
        id: 'solve',
        needs: ['model'],
        zh: '解得x=6或−8',
        en: 'Solve x=6 or −8',
      },
      {
        id: 'domain',
        needs: ['solve'],
        zh: '长度为正，只取x=6',
        en: 'Positive length retains x=6',
      },
      {
        id: 'target',
        needs: ['domain'],
        zh: '再求2(6+8)=28 m',
        en: 'Then compute 2(6+8)=28 m',
      },
      {
        id: 'trap',
        needs: [],
        trap: true,
        zh: '把48直接当周长',
        en: 'Treat 48 as perimeter',
      },
    ],
  },
  diagonal: {
    zh: '给定直角，两直角边3 m和4 m，求斜边。',
    en: 'Given a right angle with legs 3 m and 4 m, find hypotenuse.',
    answer: '5',
    unit: 'm',
    cards: [
      {
        id: 'premise',
        needs: [],
        zh: '先核所给直角和两直角边',
        en: 'Check the right angle and leg identities',
      },
      {
        id: 'square',
        needs: ['premise'],
        zh: '由勾股c²=3²+4²=25',
        en: 'Pythagoras gives c²=25',
      },
      {
        id: 'positive',
        needs: ['square'],
        zh: '长度取正根c=5',
        en: 'Take positive length c=5',
      },
      {
        id: 'target',
        needs: ['positive'],
        zh: '报告5 m并核大于每条直角边',
        en: 'Report 5 m and compare with each leg',
      },
      {
        id: 'trap',
        needs: [],
        trap: true,
        zh: '把两边直接相加得7',
        en: 'Add the two legs to get 7',
      },
    ],
  },
  journey: {
    zh: '去返各3 km，速度分别4、6 km/h，无停留。求全程平均速度。',
    en: 'Out and back are each 3 km, at 4 and 6 km/h with no stops. Find overall average speed.',
    answer: '24/5',
    unit: 'km/h',
    cards: [
      {
        id: 'times',
        needs: [],
        zh: '分段时间3/4 h与1/2 h',
        en: 'Segment times 3/4 h and 1/2 h',
      },
      {
        id: 'total-time',
        needs: ['times'],
        zh: '总时间5/4 h',
        en: 'Total time 5/4 h',
      },
      {
        id: 'distance',
        needs: [],
        zh: '总路程6 km',
        en: 'Total distance 6 km',
      },
      {
        id: 'target',
        needs: ['total-time', 'distance'],
        zh: '6÷(5/4)=24/5 km/h',
        en: '6÷(5/4)=24/5 km/h',
      },
      {
        id: 'trap',
        needs: [],
        trap: true,
        zh: '不管时间权重，平均4与6得5',
        en: 'Average 4 and 6 without time weights',
      },
    ],
  },
};
export function strategyState(kind: StrategyKind, history: string[]) {
  const s = strategyCases[kind];
  if (!s || history.length > 10 || new Set(history).size !== history.length)
    throw new RangeError('Valid strategy history');
  const facts = new Set<string>();
  for (const id of history) {
    const c = s.cards.find((v) => v.id === id);
    if (!c || c.trap || c.needs.some((n) => !facts.has(n)))
      throw new RangeError('Unjustified strategy step');
    facts.add(c.id);
  }
  return facts;
}
export function tryStrategy(kind: StrategyKind, history: string[], id: string) {
  const facts = strategyState(kind, history),
    c = strategyCases[kind].cards.find((v) => v.id === id);
  if (!c) throw new RangeError('Known strategy card');
  const missing = c.needs.filter((n) => !facts.has(n));
  return c.trap
    ? { valid: false, reason: 'trap', missing, history }
    : history.includes(id)
      ? { valid: false, reason: 'duplicate', missing, history }
      : missing.length
        ? { valid: false, reason: 'missing', missing, history }
        : {
            valid: true,
            reason: 'justified',
            missing,
            history: [...history, id],
          };
}
export const auditCases = [
  {
    zh: 'x²=9的全部实根只有3。',
    en: 'The complete real root set of x²=9 is just 3.',
    verdict: 'invalid' as const,
    reasonZh: '−3代回也得9，漏根。',
    reasonEn: '−3 also squares to nine, so a root is missing.',
    repair: 'roots',
  },
  {
    zh: '竖升3、水平4的坡面，坡度75%，所以坡角75°。',
    en: 'A rise-three/run-four slope has grade 75%, so its angle is 75°.',
    verdict: 'invalid' as const,
    reasonZh: '百分数不是角度，坡角约36.9°。',
    reasonEn: 'Percentage is not degrees; the angle is about 36.9°.',
    repair: 'angle',
  },
  {
    zh: '5 m乘3 m的长方形面积是15 m。',
    en: 'A 5 m by 3 m rectangle has area 15 m.',
    verdict: 'invalid' as const,
    reasonZh: '数值15正确，但面积单位须m²。',
    reasonEn: 'The value 15 is right but the area unit is m².',
    repair: 'area',
  },
  {
    zh: '只观测f(0)=0、f(1)=1，未给直线规则；有人预测f(2)=2。',
    en: 'Only f(0)=0 and f(1)=1 are observed, with no straight-line rule; someone predicts f(2)=2.',
    verdict: 'insufficient' as const,
    reasonZh: 'f=x与f=x²都吻合给定点，却在2处为2与4。',
    reasonEn: 'Both f=x and f=x² fit the observations but give 2 and 4 at two.',
    repair: 'none',
  },
  {
    zh: '去返等距离、速度4与6，平均速度一定5 km/h。',
    en: 'Equal out/back distances at speeds four and six give average speed exactly 5 km/h.',
    verdict: 'invalid' as const,
    reasonZh: '总路程除总时间才是24/5；分段时间不等。',
    reasonEn:
      'Total distance divided by total time is 24/5; the time weights differ.',
    repair: 'speed',
  },
  {
    zh: '已给直角、直角边3与4，斜边为5，因为25=9+16且长度取正。',
    en: 'Given a right angle with legs three and four, hypotenuse five follows from 25=9+16 and positive length.',
    verdict: 'valid' as const,
    reasonZh: '前提、平方关系和正长度均核验。',
    reasonEn: 'Premises, squared relation and positive length are all checked.',
    repair: 'length',
  },
];
export type RampParams = {
  riseCm: number;
  runCm: number;
  widthCm: number;
  budget: number;
};
export const defaultRamp: RampParams = {
  riseCm: 60,
  runCm: 240,
  widthCm: 100,
  budget: 150,
};
export function rampModel(p: RampParams) {
  whole(p.riseCm, 10, 150);
  whole(p.runCm, 50, 400);
  whole(p.widthCm, 40, 150);
  whole(p.budget, 80, 300);
  const h = rational(BigInt(p.riseCm), 100n),
    r = rational(BigInt(p.runCm), 100n),
    w = rational(BigInt(p.widthCm), 100n),
    square = addR(mulR(h, h), mulR(r, r)),
    root = principalRadical(square),
    areaRadical = multiplyRadicals(root, new Map([[1n, w]])),
    costRadical = multiplyRadicals(areaRadical, new Map([[1n, rational(60n)]])),
    length = Math.sqrt(number(square)),
    area = length * number(w),
    cost = area * 60,
    grade = divR(h, r),
    areaSquare = mulR(square, mulR(w, w)),
    costSquare = mulR(areaSquare, rational(3600n)),
    checks = {
      height: compare(rational(3n, 5n), h),
      run: compare(r, rational(12n, 5n)),
      grade: compare(grade, rational(1n, 4n)),
      area: compare(areaSquare, rational(9n)),
      budget: compare(costSquare, rational(BigInt(p.budget * p.budget))),
    };
  return {
    params: { ...p },
    h,
    r,
    w,
    square,
    grade,
    areaSquare,
    costSquare,
    lengthExact: radicalText(root),
    areaExact: radicalText(areaRadical),
    costExact: radicalText(costRadical),
    length,
    area,
    cost,
    costRounded: roundTrig(cost, 2),
    angleRounded: roundTrig((Math.atan(number(grade)) * 180) / Math.PI, 1),
    checks,
    feasible: Object.values(checks).every(Boolean),
  };
}
export const RAMP_DRAFT_KEY = 'study-math-j98-ramp-draft-v1';
export type RampDraft = { version: 1; params: RampParams; notes: string };
export function parseRampDraft(raw: string): RampDraft | null {
  if (raw.length > 20000) return null;
  try {
    const v = JSON.parse(raw) as RampDraft;
    if (
      v.version !== 1 ||
      typeof v.notes !== 'string' ||
      v.notes.length > 6000 ||
      !v.params
    )
      return null;
    rampModel(v.params);
    return {
      version: 1,
      params: {
        riseCm: v.params.riseCm,
        runCm: v.params.runCm,
        widthCm: v.params.widthCm,
        budget: v.params.budget,
      },
      notes: v.notes,
    };
  } catch {
    return null;
  }
}
export function rampReport(params: RampParams, notes: string) {
  if (!notes.trim() || notes.length > 6000)
    throw new RangeError('Write a bounded project argument');
  const m = rampModel(params);
  const names: Record<string, string> = {
    height: '高度 / Height',
    run: '水平距 / Horizontal run',
    grade: '坡度 / Grade',
    area: '坡面面积 / Inclined area',
    budget: '预算 / Budget',
  };
  return [
    '# J98 · 纸上滑板坡道 / Paper ramp design',
    '',
    '虚构数学任务：直角侧面、单块长方形坡面、同单位；不是实际施工图。 Fictional mathematics: right-triangle side and one rectangular inclined surface, common units; not a construction drawing.',
    '',
    '## 条件与输入 / Conditions and inputs',
    '',
    '约束 / Worksheet constraints: h≥0.6 m; horizontal run≤2.4 m; grade≤25%; inclined area≤3 m²; fictional surface rate NZ$60/m²; stated budget.',
    '',
    `输入 / Inputs: rise=${textR(m.h)} m; run=${textR(m.r)} m; width=${textR(m.w)} m; budget=NZ$${params.budget}`,
    '',
    '## 数学核验 / Mathematical audit',
    '',
    `精确 / Exact: length=${m.lengthExact} m; area=${m.areaExact} m²; cost=NZ$${m.costExact}; grade=${textR(m.grade)}`,
    '',
    `近似 / Approximate: angle≈${m.angleRounded}°; cost≈NZ$${m.costRounded} (nearest cent; compare constraints exactly before rounding)`,
    '',
    '| 纸上约束 / Worksheet constraint | 精确核验 / Exact audit |',
    '| --- | --- |',
    ...Object.entries(m.checks).map(
      ([name, ok]) =>
        `| ${names[name]} | ${ok ? '满足 / Meets worksheet constraint' : '未满足 / Does not meet worksheet constraint'} |`,
    ),
    '',
    `数学约束 / Mathematical constraints: ${m.feasible ? 'all met' : 'not all met'}`,
    '',
    '## 我的说明草稿 / My argument draft (not automatically reviewed)',
    '',
    notes.trim(),
    '',
    '## 家长审核 / Parent review',
    '',
    '核数量、单位、直角前提、精确比较、另一方案及局限。 Check quantities, units, right-angle premise, exact comparisons, one changed design and limitations. Exporting does not award lesson mastery.',
  ].join('\n');
}
