import {
  parsePolynomial,
  plusP,
  timesP,
  polynomialText,
  polynomialValue,
  type Polynomial,
} from './polynomialModels';
const integer = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Bounded integer parameter');
  return n;
};
export function productGrid(
  rows: string[],
  columns: string[],
  variables = ['x'],
) {
  if (!rows.length || !columns.length || rows.length > 3 || columns.length > 3)
    throw new RangeError('One to three terms in each factor');
  const term = (s: string) => {
    const p = parsePolynomial(s, variables);
    if (!p || p.size > 1)
      throw new RangeError('Each source entry must be a monomial');
    return p;
  };
  const a = rows.map(term),
    b = columns.map(term);
  let total: Polynomial = new Map();
  const cells = a.flatMap((left, row) =>
    b.map((right, column) => {
      const p = timesP(left, right);
      total = plusP(total, p);
      return {
        id: `${row}-${column}`,
        row,
        column,
        left: rows[row]!,
        right: columns[column]!,
        polynomial: p,
        text: polynomialText(p),
      };
    }),
  );
  return {
    rows,
    columns,
    variables,
    cells,
    polynomial: total,
    result: polynomialText(total),
  };
}
export function monomialProduct(
  a: number,
  b: number,
  m: number,
  n: number,
  different: boolean,
) {
  integer(a, -4, 4);
  integer(b, -4, 4);
  integer(m, 1, 2);
  integer(n, 1, 2);
  if (typeof different !== 'boolean')
    throw new RangeError('Choose matching or different bases');
  const first = `${a}x^${m}`,
    second = `${b}${different ? 'y' : 'x'}^${n}`;
  return {
    ...productGrid([first], [second], ['x', 'y']),
    coefficient: a * b,
    factors: [
      ...Array<string>(m).fill('x'),
      ...Array<string>(n).fill(different ? 'y' : 'x'),
    ],
  };
}
export const singleProducts = [
  { rows: ['2x'], columns: ['x', '3'], area: true },
  { rows: ['-x'], columns: ['2x', '5'], area: false },
  { rows: ['(1/2)x'], columns: ['4x', '-6'], area: false },
  { rows: ['0'], columns: ['x^2', '-x', '2'], area: false },
];
export function singleProduct(index: number) {
  integer(index, 0, singleProducts.length - 1);
  const source = singleProducts[index]!;
  return { ...productGrid(source.rows, source.columns), area: source.area };
}
export function binomialProduct(a: number, b: number) {
  integer(a, -4, 4);
  integer(b, -4, 4);
  return productGrid(['x', String(a)], ['x', String(b)]);
}
export function squareIdentity(b: number, minus: boolean) {
  integer(b, 1, 4);
  if (typeof minus !== 'boolean') throw new RangeError('Choose a square sign');
  return {
    ...binomialProduct(minus ? -b : b, minus ? -b : b),
    b,
    minus,
    wrong: `x^2+${b * b}`,
  };
}
export function conjugateIdentity(b: number) {
  integer(b, 1, 4);
  return { ...binomialProduct(b, -b), b };
}
export function identityProbe(b: number, minus: boolean, x: number) {
  integer(x, -8, 8);
  const m = squareIdentity(b, minus);
  return {
    actual: polynomialValue(m.result, ['x'], { x: String(x) })!,
    missingMiddle: String(x * x + b * b),
    x,
  };
}
export type AreaSegment = { label: string; value: number };
export function partitionGrid(rows: AreaSegment[], columns: AreaSegment[]) {
  if (!rows.length || !columns.length || rows.length > 3 || columns.length > 3)
    throw new RangeError('Small area partition');
  for (const s of [...rows, ...columns]) integer(s.value, 0, 24);
  const width = columns.reduce((s, c) => s + c.value, 0),
    height = rows.reduce((s, r) => s + r.value, 0);
  if (!width || !height) throw new RangeError('Positive outer lengths');
  let y = 0;
  const cells = rows.flatMap((r, row) => {
    let x = 0;
    const band = columns.map((c, column) => {
      const cell = {
        id: `${row}-${column}`,
        row,
        column,
        x,
        y,
        width: c.value,
        height: r.value,
        area: c.value * r.value,
        label: `(${r.label})(${c.label})`,
      };
      x += c.value;
      return cell;
    });
    y += r.value;
    return band;
  });
  return { rows, columns, cells, width, height, area: width * height };
}
export function squareRemoval(x: number, b: number) {
  integer(x, 4, 8);
  integer(b, 1, 3);
  // Two strips overlap in the b-by-b corner: subtract each, then restore the overlap once.
  return {
    x,
    b,
    whole: x * x,
    strip: x * b,
    overlap: b * b,
    remaining: (x - b) * (x - b),
    removedOnce: 2 * x * b - b * b,
  };
}
export function differencePieces(x: number, b: number) {
  integer(x, 4, 8);
  integer(b, 1, 3);
  const h = x - b;
  return {
    x,
    b,
    height: h,
    width: x + b,
    area: x * x - b * b,
    before: [
      { id: 'A', x: 0, y: 0, width: x, height: h },
      { id: 'B', x: 0, y: h, width: h, height: b },
    ],
    after: [
      { id: 'A', x: 0, y: 0, width: x, height: h },
      { id: 'B', x, y: 0, width: b, height: h },
    ],
    removed: { x: h, y: h, width: b, height: b },
    pieceAreas: [x * h, b * h],
  };
}
