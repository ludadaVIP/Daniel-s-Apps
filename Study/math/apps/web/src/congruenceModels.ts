export type Vertex = 'A' | 'B' | 'C';
export type TriangleSide = 'AB' | 'BC' | 'CA';
export type CongruenceRule = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'insufficient';
export type ProofVerdict =
  'sufficient' | 'insufficient' | 'congruent' | 'not-congruent';
export type CongruenceFacts = { sides: TriangleSide[]; angles: Vertex[] };
export type GeoPoint = { x: number; y: number };
export function checkGeometryCode(
  raw: string,
  value: string,
  reversible = false,
) {
  const clean = (s: string) =>
    s.trim().toUpperCase().replace(/^[△Δ]/, '').replace(/\s/g, '');
  const a = clean(raw),
    b = clean(value);
  return (
    /^[A-Z]{1,3}$/.test(a) &&
    a.length === b.length &&
    (a === b || (reversible && a === [...b].reverse().join('')))
  );
}
export function checkCongruenceRule(
  raw: string,
  value: CongruenceRule,
  alternatives: CongruenceRule[] = [],
) {
  const s = raw.trim().toUpperCase().replace(/\s+/g, ' '),
    rule =
      s === '条件不足' || s === 'INSUFFICIENT' || s === 'NOT ENOUGH INFORMATION'
        ? 'insufficient'
        : s;
  return [value, ...alternatives].includes(rule as CongruenceRule);
}
export function checkProofVerdict(raw: string, value: ProofVerdict) {
  const aliases: Record<ProofVerdict, string[]> = {
    sufficient: ['sufficient', '条件充分', '充分'],
    insufficient: ['insufficient', '条件不足', '不充分'],
    congruent: ['congruent', '全等'],
    'not-congruent': ['not congruent', 'not-congruent', '不全等'],
  };
  return aliases[value].includes(raw.trim().toLowerCase().replace(/\s+/g, ' '));
}
/** Equalities refer to an already fixed correspondence of two nondegenerate triangles.
 * These are the four general criteria taught here; no right-angle premise is supplied. */
export function availableCongruenceRules(f: CongruenceFacts): CongruenceRule[] {
  if (
    f.sides.some((s) => !['AB', 'BC', 'CA'].includes(s)) ||
    f.angles.some((a) => !['A', 'B', 'C'].includes(a))
  )
    throw new RangeError('Invalid corresponding element');
  const sides = new Set(f.sides),
    angles = new Set(f.angles),
    rules: CongruenceRule[] = [];
  if (sides.size === 3) rules.push('SSS');
  const adjacent: Record<Vertex, TriangleSide[]> = {
    A: ['AB', 'CA'],
    B: ['AB', 'BC'],
    C: ['BC', 'CA'],
  };
  if ([...angles].some((a) => adjacent[a].every((s) => sides.has(s))))
    rules.push('SAS');
  if (
    [...sides].some(
      (s) => angles.has(s[0] as Vertex) && angles.has(s[1] as Vertex),
    )
  )
    rules.push('ASA');
  if (
    angles.size >= 2 &&
    [...sides].some(
      (s) => [...angles].filter((a) => a !== s[0] && a !== s[1]).length > 0,
    )
  )
    rules.push('AAS');
  // The third corresponding angle follows from the angle sum, allowing the other angle-side criterion.
  if (angles.size >= 2 && sides.size) {
    if (!rules.includes('ASA')) rules.push('ASA');
    if (!rules.includes('AAS')) rules.push('AAS');
  }
  return rules.length ? rules : ['insufficient'];
}
export const sideCriteriaCases: CongruenceFacts[] = [
  { sides: ['AB', 'BC', 'CA'], angles: [] },
  { sides: ['AB', 'CA'], angles: ['A'] },
  { sides: ['AB', 'BC'], angles: ['A'] },
  { sides: ['AB', 'CA'], angles: [] },
];
export const angleCriteriaCases: CongruenceFacts[] = [
  { sides: ['AB'], angles: ['A', 'B'] },
  { sides: ['AB'], angles: ['A', 'C'] },
  { sides: [], angles: ['A', 'B', 'C'] },
];
const finitePositive = (n: number) => {
  if (!Number.isFinite(n) || n <= 0 || n > 10000)
    throw new RangeError('Positive bounded geometry input');
  return n;
};
export function sssTriangle(
  ab: number,
  bc: number,
  ca: number,
): GeoPoint[] | null {
  [ab, bc, ca].forEach(finitePositive);
  if (ab + bc <= ca || ab + ca <= bc || bc + ca <= ab) return null;
  const x = (ca * ca + ab * ab - bc * bc) / (2 * ab);
  return [
    { x: 0, y: 0 },
    { x: ab, y: 0 },
    { x, y: Math.sqrt(Math.max(0, ca * ca - x * x)) },
  ];
}
export function sasTriangle(ab: number, ca: number, a: number): GeoPoint[] {
  [ab, ca].forEach(finitePositive);
  if (!Number.isFinite(a) || a <= 0 || a >= 180)
    throw new RangeError('A nondegenerate included angle');
  const r = (a * Math.PI) / 180;
  return [
    { x: 0, y: 0 },
    { x: ab, y: 0 },
    { x: ca * Math.cos(r), y: ca * Math.sin(r) },
  ];
}
export function angleTriangle(a: number, b: number, ab: number): GeoPoint[] {
  finitePositive(ab);
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    a <= 0 ||
    b <= 0 ||
    a + b >= 180
  )
    throw new RangeError('Positive triangle angles summing below 180');
  const c = 180 - a - b,
    ca = (ab * Math.sin((b * Math.PI) / 180)) / Math.sin((c * Math.PI) / 180);
  return sasTriangle(ab, ca, a);
}
export function ssaAlternatives(ab = 6, bc = 4, a = 30): GeoPoint[][] {
  [ab, bc].forEach(finitePositive);
  if (!Number.isFinite(a) || a <= 0 || a >= 180)
    throw new RangeError('Proper SSA angle');
  const r = (a * Math.PI) / 180,
    disc = bc * bc - ab * ab * Math.sin(r) ** 2;
  const tolerance = 1e-12 * Math.max(1, ab * ab, bc * bc);
  if (disc < -tolerance) return [];
  const root = Math.abs(disc) <= tolerance ? 0 : Math.sqrt(disc),
    lengths = [ab * Math.cos(r) - root, ab * Math.cos(r) + root].filter(
      (x, i, arr) => x > 1e-10 && (i === 0 || Math.abs(x - arr[0]!) > 1e-10),
    );
  return lengths.map((ca) => sasTriangle(ab, ca, a));
}
export function trianglePose(
  points: GeoPoint[],
  degrees: number,
  mirror: boolean,
  scale = 1,
): GeoPoint[] {
  if (
    points.length !== 3 ||
    points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y)) ||
    !Number.isFinite(degrees) ||
    !Number.isFinite(scale) ||
    scale <= 0 ||
    scale > 2
  )
    throw new RangeError('Bounded triangle pose');
  const center = {
      x: points.reduce((s, p) => s + p.x, 0) / 3,
      y: points.reduce((s, p) => s + p.y, 0) / 3,
    },
    r = (degrees * Math.PI) / 180;
  return points.map((p) => {
    const x = (p.x - center.x) * (mirror ? -1 : 1) * scale,
      y = (p.y - center.y) * scale;
    return {
      x: x * Math.cos(r) - y * Math.sin(r),
      y: x * Math.sin(r) + y * Math.cos(r),
    };
  });
}
export function isoscelesModel(apex: number, leg = 5) {
  finitePositive(leg);
  if (!Number.isFinite(apex) || apex <= 0 || apex >= 180)
    throw new RangeError('Proper apex');
  const half = (apex * Math.PI) / 360,
    h = leg * Math.cos(half),
    w = leg * Math.sin(half);
  return {
    apex,
    base: (180 - apex) / 2,
    points: [
      { x: 0, y: h },
      { x: -w, y: 0 },
      { x: w, y: 0 },
    ] as GeoPoint[],
    d: { x: 0, y: 0 },
  };
}
export function parallelogramModel(shear: number, height: number) {
  if (
    !Number.isFinite(shear) ||
    Math.abs(shear) > 3 ||
    !Number.isFinite(height) ||
    height < 1 ||
    height > 6
  )
    throw new RangeError('Bounded parallelogram');
  return {
    points: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4 + shear, y: height },
      { x: shear, y: height },
    ],
    o: { x: (4 + shear) / 2, y: height / 2 },
  };
}
export const parallelogramTests = [
  { id: 'both-parallel', sufficient: true },
  { id: 'both-equal', sufficient: true },
  { id: 'same-pair', sufficient: true },
  { id: 'bisect', sufficient: true },
  { id: 'one-parallel', sufficient: false },
  { id: 'one-equal', sufficient: false },
  { id: 'mixed-pairs', sufficient: false },
] as const;
export function parallelogramCounterexample(id: string): GeoPoint[] {
  if (id === 'one-equal')
    return [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 3 },
      { x: 3, y: 7 },
    ];
  if (id === 'one-parallel' || id === 'mixed-pairs')
    return [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 5, y: 3 },
      { x: 1, y: 3 },
    ];
  throw new RangeError('Choose an insufficient condition');
}
export type ProofCard = { id: string; needs: string[]; gives: string };
export type ProofScenario = {
  id: 'parallel' | 'isosceles';
  givens: string[];
  goal: string;
  cards: ProofCard[];
};
export const proofScenarios: ProofScenario[] = [
  {
    id: 'parallel',
    givens: ['AB∥CD', 'BC∥AD'],
    goal: 'AB=CD',
    cards: [
      { id: 'angle-one', needs: ['AB∥CD'], gives: '∠BAC=∠DCA' },
      { id: 'angle-two', needs: ['BC∥AD'], gives: '∠BCA=∠DAC' },
      { id: 'common', needs: [], gives: 'AC=CA' },
      {
        id: 'congruence',
        needs: ['∠BAC=∠DCA', '∠BCA=∠DAC', 'AC=CA'],
        gives: '△ABC≅△CDA',
      },
      { id: 'corresponding', needs: ['△ABC≅△CDA'], gives: 'AB=CD' },
      { id: 'circular', needs: ['AB=CD'], gives: 'AB=CD' },
    ],
  },
  {
    id: 'isosceles',
    givens: ['AB=AC', '∠BAD=∠CAD', 'D∈BC'],
    goal: 'BD=DC',
    cards: [
      { id: 'common', needs: [], gives: 'AD=AD' },
      {
        id: 'congruence',
        needs: ['AB=AC', '∠BAD=∠CAD', 'AD=AD'],
        gives: '△ABD≅△ACD',
      },
      { id: 'corresponding', needs: ['△ABD≅△ACD'], gives: 'BD=DC' },
      { id: 'circular', needs: ['BD=DC'], gives: 'BD=DC' },
    ],
  },
];
export function proofState(s: ProofScenario, history: string[]) {
  if (new Set(history).size !== history.length)
    throw new RangeError('Repeated proof step');
  const facts = new Set(s.givens);
  for (const id of history) {
    const c = s.cards.find((c) => c.id === id);
    if (!c || c.id === 'circular' || c.needs.some((n) => !facts.has(n)))
      throw new RangeError('Invalid proof history');
    facts.add(c.gives);
  }
  return facts;
}
export function tryProofCard(s: ProofScenario, history: string[], id: string) {
  const facts = proofState(s, history),
    card = s.cards.find((c) => c.id === id);
  if (!card) throw new RangeError('Unknown proof card');
  const missing = card.needs.filter((n) => !facts.has(n));
  return card.id === 'circular'
    ? { valid: false, reason: 'circular' as const, missing, history }
    : history.includes(id)
      ? { valid: false, reason: 'duplicate' as const, missing, history }
      : missing.length
        ? { valid: false, reason: 'missing' as const, missing, history }
        : {
            valid: true,
            reason: 'justified' as const,
            missing,
            history: [...history, id],
          };
}
