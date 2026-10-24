import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { postRouteExtensionRetrieval } from './content/postRouteExtensionRetrieval';
import { postRouteCapstoneRetrieval } from './content/postRouteCapstoneRetrieval';
import { postRouteRecurrenceEvidence } from './content/postRouteRecurrenceEvidence';
import {
  postRouteUnits,
  formalRecurrenceUnitIds,
  recurrenceUnitIds,
  recurrenceUnitIndex,
  assertMaintenanceOwners,
} from './content/retrievalUnits';
import { maintenanceSets, maintenanceHref } from './content/maintenance';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer, type Question } from './model';
import { textR, rational, addR, mulR, divR, negR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { compareR } from './inequalityModels';
import { equalPolynomial, polynomialValue } from './polynomialModels';
import { plotBounds } from './cartesianModels';
import {
  recurrenceAudit,
  shortestAudit,
  validateGraph,
  matrixApply,
  matrixProduct,
  matrixText,
  checkMatrix2,
  matrixDet,
  type Matrix2,
  type GraphSpec,
} from './extensionModels';
import {
  rainInflow,
  waterLedger,
  lowerBoundTrace,
  linearTrace,
} from './capstoneModels';
const ext = Object.values(postRouteExtensionRetrieval),
  projects = Object.values(postRouteCapstoneRetrieval),
  sets = [...ext, ...projects];
const sub = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const sum = (xs: string[]) => xs.map(R).reduce(addR, rational(0n));
const normal = (s: string) => s.replaceAll('−', '-');
const csv = (s: string) =>
  normal(s)
    .trim()
    .split(',')
    .map((x) => textR(R(x.trim().replace(/^\+/, ''))));
const taskMap = new Map(
  Object.values(maintenanceSets).flatMap((set) =>
    set.questions.map((q) => [q.id, { q, unit: set.unit }] as const),
  ),
);
function waterGivens(q: Question) {
  const match = q.stem.en.match(
    /A=(\d+) m²,\s*η=([^,]+),\s*initial\s+0 L,\s*nominal demand\s+(\d+) L\/day/,
  )!;
  const area = Number(match[1]),
    eta = match[2]!,
    demand = match[3]!;
  const rain = q.contextTable!.rows.map((row) => Number(row[1]!.en));
  return {
    area,
    eta,
    demand,
    rain,
    inflows: rain.map((r) => rainInflow(area, eta, r)),
  };
}
const pathList = (
  edges: [string, string, number][],
  start: string,
  goal: string,
) => {
  const found: { path: string[]; cost: number }[] = [];
  const visit = (at: string, path: string[], cost: number) => {
    if (at === goal) {
      found.push({ path, cost });
      return;
    }
    for (const [u, v, w] of edges)
      if (u === at && !path.includes(v)) visit(v, [...path, v], cost + w);
  };
  visit(start, [start], 0);
  return found;
};
describe('real post-route recurrence units', () => {
  it('retains the formal curriculum and registers two distinct nonempty later owners with four real groups', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    expect(formalRecurrenceUnitIds).toHaveLength(67);
    expect(recurrenceUnitIds).toHaveLength(69);
    expect(postRouteUnits.map((u) => u.id)).toEqual(['R01', 'R02']);
    expect(sets).toHaveLength(4);
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const unit of postRouteUnits) {
      expect(unit.kind).toBe('maintenance-only');
      expect(formalRecurrenceUnitIds).not.toContain(unit.id);
      expect(Object.hasOwn(unitChecks, unit.id)).toBe(false);
      expect(recurrenceUnitIndex.get(unit.id)).toBeGreaterThan(
        recurrenceUnitIndex.get('H38')!,
      );
      expect(
        sets
          .filter((s) => s.unit === unit.id)
          .map((s) => s.id)
          .sort(),
      ).toEqual([...unit.groupIds].sort());
      expect(
        unit.title.zh && unit.title.en && unit.intro.zh && unit.intro.en,
      ).toBeTruthy();
    }
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(checkAnswer('proof all correct complete', q.answer)).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
    for (const pair of [ext, projects])
      for (let i = 0; i < 5; i++) {
        const material = (s: (typeof pair)[number]) =>
          JSON.stringify({
            stem: s.questions[i]!.stem,
            table: s.questions[i]!.contextTable,
            diagram: s.questions[i]!.diagram,
          });
        expect(material(pair[0]!)).not.toBe(material(pair[1]!));
      }
  });
  it('rejects fake owners,empty or undeclared post groups and duplicate identities instead of loosening the audit', () => {
    const all = Object.values(maintenanceSets),
      group = sets[0]!;
    expect(() => assertMaintenanceOwners(all)).not.toThrow();
    expect(() =>
      assertMaintenanceOwners([
        ...all,
        { id: 'R99-TEST', unit: 'R99', questions: [{ id: 'R99-TEST-Q1' }] },
      ]),
    ).toThrow(/Unknown maintenance owner/);
    expect(() =>
      assertMaintenanceOwners(all.filter((s) => s.id !== group.id)),
    ).toThrow(/Missing real post-route content/);
    expect(() =>
      assertMaintenanceOwners([
        ...all,
        {
          id: 'R01-UNDECLARED',
          unit: 'R01',
          questions: [{ id: 'R01-UNDECLARED-Q1' }],
        },
      ]),
    ).toThrow(/Undeclared post-route group/);
    expect(() =>
      assertMaintenanceOwners(
        all.map((s) => (s.id === group.id ? { ...s, questions: [] } : s)),
      ),
    ).toThrow(/one to ten tasks/);
    expect(() => assertMaintenanceOwners([...all, group])).toThrow(
      /Duplicate maintenance set ID/,
    );
  });
  it('links every H37/H38 lesson-level skill to exact real tasks in BOTH later units with bilingual semantic reasons', () => {
    const skills = new Set(
      lessons
        .filter((l) => l.unit === 'H37' || l.unit === 'H38')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(skills.size).toBe(10);
    expect(new Set(postRouteRecurrenceEvidence.map((e) => e.skill))).toEqual(
      skills,
    );
    for (const e of postRouteRecurrenceEvidence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      expect(
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
      expect(new Set(e.targets.map((id) => taskMap.get(id)!.unit))).toEqual(
        new Set(['R01', 'R02']),
      );
      for (const id of e.targets) {
        const target = taskMap.get(id)!;
        expect(target.q.skill).toBe(e.skill);
        expect(recurrenceUnitIndex.get(target.unit)).toBeGreaterThan(
          recurrenceUnitIndex.get(source.unit!)!,
        );
        const link = recurrenceLinksFor(source.id)
          .flatMap((g) => g.targets)
          .find((t) => t.id === id)!;
        const url = new URL(link.href, 'http://localhost');
        expect(url.pathname).toBe('/math/unit/' + target.unit + '/maintenance');
        expect(url.searchParams.get('question')).toBe(id);
        expect(
          maintenanceHref(
            sets.find((s) => s.questions.some((q) => q.id === id))!,
            id,
          ),
        ).toBe(link.href);
      }
    }
  });
  it('checks actual arbitrary induction-step identities and distinguishes bases,finite tests and jump-two reachability', () => {
    for (const [i, set] of ext.entries()) {
      const q = set.questions[0]!,
        step = normal(q.solution.en)
          .match(/so (?:the new sum is )?([^,]+),/)![1]!
          .replaceAll('k', 'x')
          .replaceAll('[', '(')
          .replaceAll(']', ')'),
        [left, right] = step.split('=');
      expect(equalPolynomial(left!, right!, ['x'])).toBe(true);
      for (let n = 1; n <= 8; n++) {
        const total = Array.from({ length: n }, (_, j) =>
          i === 0 ? 2 * (j + 1) : 5 * (j + 1) - 2,
        ).reduce((a, b) => a + b, 0);
        expect(total).toBe(i === 0 ? n * (n + 1) : (n * (5 * n + 1)) / 2);
      }
      expect(q.solution.en).toContain('ARBITRARY');
      expect(q.solution.en).toContain('CONDITIONAL');
      expect(q.solution.en).toContain('even base');
    }
  });
  it('uses actual recurrence prefixes and checks general closed-form steps,second seeds and undeclared-prefix counterexamples', () => {
    for (const [i, set] of ext.entries()) {
      const q = set.questions[1]!,
        model = recurrenceAudit(
          'affine',
          5,
          i === 0 ? 1 : 5,
          i === 0 ? 3 : 2,
          i === 0 ? 2 : -3,
        );
      const written = normal(q.solution.en).match(/u0…u5 are\s*([^.]*)\./)![1]!;
      expect(csv(written)).toEqual(model.rows!.map((row) => row[1]));
      expect(
        equalPolynomial(
          i === 0 ? '3(2x-1)+2' : '2(2x+3)-3',
          i === 0 ? '6x-1' : '4x+3',
          ['x'],
        ),
      ).toBe(true);
      for (let n = 0; n <= 5; n++)
        expect(model.rows![n]![1]).toBe(
          String(i === 0 ? 2 * 3 ** n - 1 : 2 ** (n + 1) + 3),
        );
      let product = 1;
      for (let j = 0; j < 5; j++) product *= 5 - j;
      expect(product).toBe(120);
      for (let n = 0; n < 5; n++)
        expect(
          Math.abs(
            Array.from({ length: 5 }, (_, j) => n - j).reduce(
              (a, b) => a * b,
              1,
            ),
          ),
        ).toBe(0);
      const two = (seed: number) => {
        const xs = [i === 0 ? 0 : 1, seed];
        while (xs.length < 5) {
          const m = xs.length;
          xs.push(
            i === 0 ? xs[m - 1]! + 2 * xs[m - 2]! : 2 * xs[m - 1]! - xs[m - 2]!,
          );
        }
        return xs;
      };
      for (const seed of i === 0 ? [1, 2] : [1, 3])
        expect(normal(q.solution.en)).toContain(two(seed).join(','));
      expect(q.solution.en).toContain('DOES NOT satisfy');
      expect(q.solution.en).toContain('zero-based');
    }
  });
  it('enumerates ALL simple paths from the actual directed tables,including zero cycles,isolates and negative-premise limits', () => {
    for (const [i, set] of ext.entries()) {
      const q = set.questions[2]!,
        edges = q.contextTable!.rows.map(
          (row) =>
            [row[0]!.en, row[1]!.en, Number(row[2]!.en)] as [
              string,
              string,
              number,
            ],
        ),
        nodes =
          i === 0 ? ['S', 'A', 'B', 'C', 'T', 'U'] : ['P', 'J', 'K', 'Q', 'Z'],
        start = nodes[0]!,
        goal = i === 0 ? 'T' : 'Q',
        isolate = nodes.at(-1)!;
      // A bijection into the existing A–F workbench checks the same graph
      // without expanding its public label/weight syntax.
      const names = new Map(
          nodes.map((n, j) => [n, String.fromCharCode(65 + j)]),
        ),
        g: GraphSpec = {
          nodes: [...names.values()],
          edges: edges.map(([a, b, w]) => [names.get(a)!, names.get(b)!, w]),
          directed: true,
          start: names.get(start)!,
          goal: names.get(goal)!,
        };
      const model = shortestAudit(g),
        all = pathList(edges, start, goal),
        cost = Math.min(...all.map((p) => p.cost)),
        optimal = all
          .filter((p) => p.cost === cost)
          .map((p) => p.path.join('→'))
          .sort();
      const expected =
        i === 0
          ? ['S→B→T', 'S→C→B→T']
          : ['P→J→Q', 'P→K→Q', 'P→J→K→Q', 'P→K→J→Q'];
      expect(cost).toBe(i === 0 ? 4 : 5);
      expect(model.distance).toBe(cost);
      expect(optimal).toEqual(expected.sort());
      expect(model.distances[names.get(isolate)!]).toBe(Infinity);
      expect(pathList(edges, goal, start)).toEqual([]);
      for (const route of optimal) expect(q.solution.en).toContain(route);
      if (i === 0) {
        const negative = edges.map(
          ([a, b, w]) =>
            [a, b, a === 'C' && b === 'A' ? -10 : w] as [
              string,
              string,
              number,
            ],
        );
        expect(
          Math.min(...pathList(negative, start, goal).map((p) => p.cost)),
        ).toBe(1);
        expect(() =>
          validateGraph({
            ...g,
            edges: negative.map(([a, b, w]) => [
              names.get(a)!,
              names.get(b)!,
              w,
            ]),
          }),
        ).toThrow();
      } else {
        expect(
          edges.filter(
            ([a, b, w]) =>
              w === 0 && ((a === 'J' && b === 'K') || (a === 'K' && b === 'J')),
          ),
        ).toHaveLength(2);
        expect(q.solution.en).toContain('infinitely many optimal WALKS');
      }
    }
  });
  it('extracts actual matrix products and verifies columns,order,two-sided inverses and distinct collapsed preimages', () => {
    for (const [i, set] of ext.entries()) {
      const q = set.questions[3]!,
        rows = q.contextTable!.rows,
        matrix = (id: string) =>
          rows
            .find((r) => r[0]!.en === id)!
            .slice(1)
            .map((c) => normal(c.en)) as unknown as Matrix2,
        A = matrix('A'),
        B = matrix('B'),
        P = matrix('P'),
        AB = matrixProduct(A, B),
        BA = matrixProduct(B, A),
        sol = normal(q.solution.en),
        v: readonly [string, string] = i === 0 ? ['2', '-1'] : ['1', '3'];
      const writtenAB = sol.match(/AB=(\[[^\]]+\])/)![1]!,
        writtenBA = sol.match(/BA=(\[[^\]]+\])/)![1]!;
      expect(checkMatrix2(writtenAB, matrixText(AB))).toBe(true);
      expect(checkMatrix2(writtenBA, matrixText(BA))).toBe(true);
      expect(matrixText(AB)).not.toBe(matrixText(BA));
      expect(matrixApply(A, ['1', '0'])).toEqual([A[0], A[2]]);
      expect(matrixApply(A, ['0', '1'])).toEqual([A[1], A[3]]);
      expect(matrixApply(AB, v)).toEqual(i === 0 ? ['-3', '-2'] : ['5', '3']);
      expect(matrixApply(BA, v)).toEqual(i === 0 ? ['-1', '-6'] : ['-7', '3']);
      const inv: Matrix2 = i === 0 ? ['0', '-1', '1/3', '0'] : AB,
        I: Matrix2 = ['1', '0', '0', '1'];
      if (i === 0)
        expect(
          checkMatrix2(
            sol.match(/inverse of AB is(\[[^\]]+\])/)![1]!,
            matrixText(inv),
          ),
        ).toBe(true);
      else expect(q.solution.en).toContain('its own inverse');
      expect(matrixProduct(AB, inv)).toEqual(I);
      expect(matrixProduct(inv, AB)).toEqual(I);
      expect(matrixApply(inv, matrixApply(AB, v))).toEqual(v);
      const p1: readonly [string, string] = i === 0 ? ['2', '5'] : ['1', '2'],
        p2: readonly [string, string] = i === 0 ? ['-3', '5'] : ['3', '0'];
      expect(matrixApply(P, p1)).toEqual(matrixApply(P, p2));
      expect(matrixDet(P)).toBe('0');
      expect(q.solution.en).toContain('Linearity is essential');
      expect(q.solution.en).toContain('AFFINE');
    }
  });
  it('rebuilds actual bisection trials and updated midpoints with exact errors,residuals and existence caveats', () => {
    for (const [i, set] of ext.entries()) {
      const q = set.questions[4]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Given polynomial required');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.points.map((p) => p.label)).toEqual(['L', 'R']);
      const formula = d.caption!.en.match(/f\(x\)=([^ ]+) and/)![1]!,
        value = (x: ReturnType<typeof R>) =>
          R(polynomialValue(formula, ['x'], { x: textR(x) })!);
      let lo = R('1'),
        hi = R('2'),
        last = R('0');
      const trials: string[] = [];
      for (let step = 0; step < 3; step++) {
        last = divR(addR(lo, hi), R('2'));
        trials.push(textR(last));
        if (value(last)[0] === 0n) throw Error('Unexpected exact hit');
        if (value(last)[0] * value(lo)[0] > 0n) lo = last;
        else hi = last;
      }
      expect(trials).toEqual(
        i === 0 ? ['3/2', '7/4', '13/8'] : ['3/2', '5/4', '11/8'],
      );
      const mid = divR(addR(lo, hi), R('2'));
      expect(textR(mid)).toBe(i === 0 ? '27/16' : '21/16');
      expect(textR(last)).not.toBe(textR(mid));
      expect(textR(sub(hi, lo))).toBe('1/8');
      expect(textR(divR(sub(hi, lo), R('2')))).toBe('1/16');
      const written = normal(q.solution.en).match(
        /CURRENT midpoint is\s*([^,]+)/,
      )![1]!;
      expect(textR(R(written))).toBe(textR(mid));
      const residue = value(mid),
        abs = residue[0] < 0n ? negR(residue) : residue;
      expect(textR(abs)).toBe(
        normal(q.solution.en).match(/residual\s*(\d+\/\d+)/)![1],
      );
      expect(textR(mulR(abs, R(i === 0 ? '1/1000' : '1/100')))).not.toBe(
        textR(abs),
      );
      expect(polynomialValue('(x-1)²', ['x'], { x: '1' })).toBe('0');
      for (const x of ['-1', '0', '1'])
        expect(polynomialValue('x(x-1)(x+1)', ['x'], { x })).toBe('0');
      expect(q.solution.en).toContain('not horizontal error');
      expect(q.solution.en).toContain('undefined/discontinuous');
      expect(q.solution.en).toContain('exact endpoint');
    }
  });
  it('matches every actual seven-column water row and independent conservation totals without expanding the water model', () => {
    expect(rainInflow(1, '1', 1)).toBe('1');
    for (const set of projects) {
      const q = set.questions[0]!,
        g = waterGivens(q),
        capacity = Number(q.stem.en.match(/Set C=(\d+)/)![1]),
        m = waterLedger(capacity, g.inflows, g.demand);
      expect(q.solution.en).toContain(
        'I=' + rainInflow(g.area, g.eta, 1) + 'r',
      );
      const written = q.solution.en.match(/rows are(.+?)\. Total/)![1]!,
        rows = [...written.matchAll(/\(([^()]+)\)/g)].map((match) =>
          csv(match[1]!),
        );
      expect(rows).toEqual(
        m.rows.map((r) => [
          r.opening,
          r.inflow,
          r.beforeUse,
          r.overflow,
          r.served,
          r.deficit,
          r.closing,
        ]),
      );
      expect(m.rows[2]!.deficit).toBe(g.demand);
      expect(m.rows[2]!.closing).toBe('0');
      expect(textR(sub(sub(sum(g.inflows), R(m.overflow)), R(m.served)))).toBe(
        m.closing,
      );
      expect(q.solution.en).toContain('inflow ' + textR(sum(g.inflows)));
      expect(q.solution.en).toContain('served ' + m.served);
      expect(q.solution.en).toContain('deficit ' + m.deficit);
      expect(q.solution.en).toContain('overflow ' + m.overflow);
    }
  });
  it('uses the actual capture batches for inclusive tolerance and frozen-model independent validation,including a genuine new failure', () => {
    for (const [i, set] of projects.entries()) {
      const q = set.questions[1]!,
        factor = Number(q.stem.en.match(/V=(\d+)r/)![1]),
        cap = Number(q.stem.en.match(/min\(\d+r,(\d+)\)/)![1]),
        tol = Number(q.stem.en.match(/\|residual\|≤(\d+) L/)![1]),
        rows = q.contextTable!.rows.map((r) => ({
          id: r[0]!.en,
          phase: r[1]!.en,
          r: Number(r[2]!.en),
          observed: Number(r[3]!.en),
        }));
      expect(
        rows
          .filter((r) => r.phase === 'A')
          .map((r) => r.observed - factor * r.r),
      ).toEqual([0, 0, 0]);
      const b = rows.filter((r) => r.phase === 'B'),
        c = rows.filter((r) => r.phase === 'C'),
        expected = [
          b.map((r) => r.observed - factor * r.r),
          b.map((r) => r.observed - Math.min(factor * r.r, cap)),
          c.map((r) => r.observed - Math.min(factor * r.r, cap)),
        ];
      const written = [
        ...normal(q.solution.en).matchAll(/residuals\s*([+-]?\d+,[+-]?\d+)/g),
      ].map((m) => csv(m[1]!).map(Number));
      expect(written).toEqual(expected);
      expect(expected[1]!.map((e) => Math.abs(e) <= tol)).toEqual([true, true]);
      expect(expected[2]!.map((e) => Math.abs(e) <= tol)).toEqual(
        i === 0 ? [true, true] : [true, false],
      );
      expect(q.solution.en).toContain('development data');
      expect(q.solution.en).toContain('NEW independent observations');
      expect(q.solution.en).toContain('BEFORE tank entry');
      if (i === 1)
        expect(q.solution.en).toContain('independent validation failure');
    }
  });
  it('counts actual ledger calls fairly including cached upper checks,and proves why a budget window breaks the joint search', () => {
    for (const [i, set] of projects.entries()) {
      const q = set.questions[2]!,
        g = waterGivens(q),
        U = Number(q.stem.en.match(/integers\s*0…(\d+)/)![1]),
        F = (c: number) => waterLedger(c, g.inflows, g.demand).meetsEveryDay,
        minimum = 3 * Number(g.demand);
      const run = (binary: boolean, predicate: (c: number) => boolean) => {
        const cache = new Map<number, boolean>(),
          calls: number[] = [],
          ask = (c: number) => {
            if (!cache.has(c)) {
              calls.push(c);
              cache.set(c, predicate(c));
            }
            return cache.get(c)!;
          };
        if (!ask(U)) return { answer: null, calls };
        if (binary) {
          const result = lowerBoundTrace(U, ask);
          return { answer: result.answer ?? U, calls };
        }
        return { answer: linearTrace(U + 1, ask).answer, calls };
      };
      const scan = run(false, F),
        binary = run(true, F);
      expect(scan.answer).toBe(minimum);
      expect(binary.answer).toBe(minimum);
      expect(scan.calls).toEqual([
        U,
        ...Array.from({ length: minimum + 1 }, (_, j) => j),
      ]);
      expect(scan.calls.length).toBe(i === 0 ? 56 : 62);
      const written = csv(
        q.solution.en.match(/subsequently tests\s*([\d,]+):seven/)![1]!,
      ).map(Number);
      expect(binary.calls).toEqual([U, ...written]);
      expect(binary.calls.length).toBe(8);
      const counts = [...q.solution.en.matchAll(/precheck=(\d+)/g)].map((m) =>
        Number(m[1]),
      );
      expect(counts).toEqual([scan.calls.length, binary.calls.length]);
      let ws = 0,
        wb = 0;
      for (let t = 0; t <= U; t++) {
        ws = Math.max(ws, run(false, (c) => c >= t).calls.length);
        wb = Math.max(wb, run(true, (c) => c >= t).calls.length);
      }
      expect(ws).toBe(U + 1);
      expect(wb).toBe(8);
      expect(run(false, () => false)).toEqual({ answer: null, calls: [U] });
      expect(run(true, () => false)).toEqual({ answer: null, calls: [U] });
      const price = q.stem.en.match(
          /price\s*(\d+)\+(\d+)C tokens and budget\s*(\d+)/,
        )!,
        fixed = Number(price[1]),
        rate = Number(price[2]),
        budget = Number(price[3]),
        joint = (c: number) => F(c) && fixed + rate * c <= budget;
      const feasible = Array.from({ length: U + 1 }, (_, c) => c).filter(joint);
      expect(feasible).toEqual(
        Array.from({ length: i === 0 ? 7 : 6 }, (_, j) => minimum + j),
      );
      expect(joint(U)).toBe(false);
      expect(joint(minimum)).toBe(true);
      expect(joint(feasible.at(-1)! + 1)).toBe(false);
      expect(run(true, joint).answer).toBeNull();
      expect(q.solution.en).toContain('not upward closed');
    }
  });
  it('verifies necessary prefix bounds and sufficient ledgers for ALL smaller capacities,not feasibility of one larger value', () => {
    for (const set of projects) {
      const q = set.questions[3]!,
        g = waterGivens(q),
        minimum = 3 * Number(g.demand),
        m = waterLedger(minimum, g.inflows, g.demand);
      expect(g.inflows.slice(1, 3)).toEqual(['0', '0']);
      expect(
        compareR(R(g.inflows[0]!), R(String(minimum))),
      ).toBeGreaterThanOrEqual(0);
      for (let C = 0; C < minimum; C++)
        expect(waterLedger(C, g.inflows, g.demand).meetsEveryDay).toBe(false);
      expect(m.meetsEveryDay).toBe(true);
      expect(
        waterLedger(minimum - 1, g.inflows, g.demand).rows[2]!.deficit,
      ).toBe('1');
      expect(waterLedger(minimum + 10, g.inflows, g.demand).meetsEveryDay).toBe(
        true,
      );
      expect(
        csv(
          q.solution.en.match(
            /closing(?: levels)?\s*([\d,]+)(?: L)?,\s*served/,
          )![1]!,
        ),
      ).toEqual(m.rows.map((r) => r.closing));
      expect(csv(q.solution.en.match(/overflow\s*([\d,]+) and/)![1]!)).toEqual(
        m.rows.map((r) => r.overflow),
      );
      expect(q.solution.en).toContain('ALL smaller integers');
      expect(q.solution.en).toContain('capacity alone');
    }
  });
  it('enumerates the actual complete catalogues,scenario intersections and costs,and proves dry-prefix impossibility independent of capacity', () => {
    for (const set of projects) {
      const q = set.questions[4]!,
        g = waterGivens(q),
        catalogue = csv(q.stem.en.match(/Catalogue C∈\{([^}]+)\}/)![1]!).map(
          Number,
        ),
        price = q.stem.en.match(/price\s*(\d+)\+(\d+)C tokens/)!,
        cost = (c: number) => Number(price[1]) + Number(price[2]) * c,
        budgets = [...q.stem.en.matchAll(/budget\s*(\d+)/g)].map((m) =>
          Number(m[1]),
        ),
        high = q.stem.en.match(/high daily demand\s*(\d+) L/)![1]!,
        dry = csv(q.stem.en.match(/rain\s*\[([^\]]+)\]/)![1]!).map(Number),
        dryInflows = dry.map((r) => rainInflow(g.area, g.eta, r));
      expect(catalogue).toHaveLength(7);
      expect(budgets).toHaveLength(2);
      const nominal = (c: number) =>
          waterLedger(c, g.inflows, g.demand).meetsEveryDay,
        stress = (c: number) => waterLedger(c, g.inflows, high).meetsEveryDay;
      const n = catalogue.filter((c) => nominal(c) && cost(c) <= budgets[0]!),
        both1 = catalogue.filter(
          (c) => nominal(c) && stress(c) && cost(c) <= budgets[0]!,
        ),
        both2 = catalogue.filter(
          (c) => nominal(c) && stress(c) && cost(c) <= budgets[1]!,
        );
      const written = [
        ...q.solution.en.matchAll(/ALL feasible\{([^}]+)\}/g),
      ].map((m) => csv(m[1]!).map(Number));
      expect(written).toEqual([n, both2]);
      expect(both1).toEqual([]);
      const cheapest = q.solution.en.match(/cheapest\s*(\d+),\s*cost\s*(\d+)/)!;
      expect(Number(cheapest[1])).toBe(n[0]);
      expect(Number(cheapest[2])).toBe(cost(n[0]!));
      const endings = [
        ...q.solution.en.matchAll(/closing\s*(\d+(?:,\d+)*)/g),
      ].map((m) => csv(m[1]!));
      expect(endings).toEqual([
        waterLedger(n[0]!, g.inflows, g.demand).rows.map((r) => r.closing),
        waterLedger(both2[0]!, g.inflows, high).rows.map((r) => r.closing),
      ]);
      const prefixNeed = mulR(R('4'), R(g.demand)),
        prefixIn = sum(dryInflows.slice(0, 4)),
        gap = sub(prefixNeed, prefixIn);
      expect(compareR(gap, R('0'))).toBeGreaterThan(0);
      expect(textR(gap)).toBe(g.demand);
      for (const c of [...catalogue, 300])
        expect(waterLedger(c, dryInflows, g.demand).meetsEveryDay).toBe(false);
      expect(q.solution.en).toContain('ANY capacity');
      expect(q.solution.en).toContain('CONDITIONAL');
      expect(q.solution.en).toContain('NEW independent data');
    }
  });
});
