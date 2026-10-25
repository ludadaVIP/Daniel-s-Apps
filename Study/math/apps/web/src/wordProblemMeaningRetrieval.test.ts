import { describe, it, expect } from 'vitest';
import { wordProblemMeaningRetrieval } from './content/wordProblemMeaningRetrieval';
import { foundationRecurrence } from './content/foundationRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { checkAnswer } from './model';
import { barRelation, cardJourney } from './problemModels';
import { recurrenceLinksFor } from './recurrenceTargets';
import { isProblemLab } from './ProblemLabs';
import { isProblemSolvingLab } from './ProblemSolvingLabs';
const sets = Object.values(wordProblemMeaningRetrieval);
const rows = (s: (typeof sets)[number], index: number) =>
  s.questions[index]!.contextTable!.rows.map((r) => r.map((c) => c.en));
const number = (text: string) => Number(text.match(/\d+/)![0]);

describe('B06 goal, representation, plan and explanation retrieval', () => {
  it('adds two real later-unit groups with ten human tasks while preserving formal curriculum identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    const ids = new Set<string>();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('B06'));
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(s.id);
      expect(maintenanceHref(s)).toBe('/math/unit/' + s.unit + '/maintenance');
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('because right answer units', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('B06-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en && c.zh)),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(10);
    for (const l of lessons.filter((l) => l.unit === 'B06')) {
      expect(isProblemLab(l.lab)).toBe(true);
      expect(isProblemSolvingLab(l.lab)).toBe(false);
    }
    for (const l of lessons.filter((l) => l.unit === 'H28')) {
      expect(isProblemSolvingLab(l.lab)).toBe(true);
      expect(isProblemLab(l.lab)).toBe(false);
    }
  });
  it('reconstructs the requested length from actual mixed-unit fact cards, without adding a whole to its included part or birds', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        cards = rows(s, 0),
        mixed = cards[0]![2]!.match(/(\d+)m (\d+)cm/)!;
      const whole = Number(mixed[1]) * 100 + Number(mixed[2]),
        removed = number(cards[1]![2]!),
        birds = number(cards[2]![2]!),
        left = whole - removed;
      expect(cards.map((r) => r[0])).toEqual(['T', 'R', 'B']);
      expect(q.solution.en).toContain(
        'T and R are relevant knowns; B is unused',
      );
      expect(q.solution.en).toContain(
        whole + '−' + removed + '=' + left + ' cm',
      );
      expect(q.solution.zh).toContain(
        whole + '−' + removed + '=' + left + 'cm',
      );
      expect(q.solution.en).toContain(
        left + '+' + removed + '=' + whole + ' cm',
      );
      expect(left + removed).toBe(whole);
      expect(whole + removed + birds).not.toBe(left);
      expect(q.stem.en).toContain('FIRST answer only');
      expect(q.solution.en).toContain('no subtraction needed');
    }
  });
  it('moves unknowns through actual whole-part, comparison and equal-group tables and preserves zero widths', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        [w, c, e] = rows(s, 1),
        a = number(w![1]!),
        b = number(w![2]!),
        larger = number(c![1]!),
        smaller = number(c![2]!),
        groups = number(e![1]!),
        each = number(e![2]!);
      expect(w![0]).toBe('W');
      expect(c![0]).toBe('C');
      expect(e![0]).toBe('E');
      const whole = barRelation('parts', a, b, 'result'),
        part = barRelation('parts', a, b, 'component');
      expect(whole.aWidth + whole.bWidth).toBeCloseTo(420);
      expect(whole.aWidth / a).toBeCloseTo(whole.bWidth / b);
      expect(part.result).toBe(whole.whole - a);
      expect(q.solution.en).toContain(a + '+' + b + '=' + whole.result + ' cm');
      expect(q.solution.en).toContain(
        whole.result + '−' + a + '=' + part.result + ' cm',
      );
      const comparison = barRelation('comparison', larger, smaller, 'result'),
        gap = larger - smaller;
      expect(comparison.result).toBe(gap);
      expect(q.solution.en).toContain(larger + '−' + gap + '=' + smaller);
      expect(q.solution.en).toContain(smaller + '+' + gap + '=' + larger);
      const equal = barRelation('groups', groups, each, 'result');
      expect(q.solution.en).toContain(equal.result + '÷' + groups + '=' + each);
      expect(equal.aWidth * groups).toBeCloseTo(420);
      expect(barRelation('parts', a, 0, 'component').bWidth).toBe(0);
      expect(
        barRelation('comparison', smaller, smaller, 'result').gapWidth,
      ).toBe(0);
      const zero = barRelation('groups', groups, 0, 'result');
      expect(zero.result).toBe(0);
      expect(zero.aWidth).toBe(0);
      expect(zero.whole * zero.scale).toBe(0);
      expect(q.solution.en).toContain(groups + '×0=0 cards');
      expect(q.solution.zh).toContain('零段/差距/每组宽度为0');
      expect(q.solution.en).toContain('Comparison removes no cards');
    }
  });
  it('independently follows units and reverse checks in four actual two-step stories, distinguishing total removal from every-box removal', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        [m, a, d, u] = rows(s, 2),
        [boxes, each, given] = m!.slice(1).map(number),
        [p1, p2, per] = a!.slice(1).map(number),
        [stock, reserve, capacity] = d!.slice(1).map(number),
        [packs, perPack, loose] = u!.slice(1).map(number);
      const journey = cardJourney(boxes!, each!, given!),
        otherStory = boxes! * (each! - given!);
      expect(each! - given!).toBeGreaterThanOrEqual(0);
      expect(q.solution.en).toContain(
        boxes + '×' + each + '=' + journey.total + ' cards',
      );
      expect(q.solution.en).toContain(
        journey.total + '−' + given + '=' + journey.remaining + ' cards',
      );
      expect(q.solution.en).toContain(
        boxes + '×(' + each + '−' + given + ')=' + otherStory,
      );
      expect(otherStory).not.toBe(journey.remaining);
      expect(journey.remaining + given!).toBe(journey.total);
      const people = p1! + p2!,
        need = people * per!;
      expect(q.solution.en).toContain(
        '(' + p1 + '+' + p2 + ')×' + per + '=' + need,
      );
      expect(need / per! - p2!).toBe(p1);
      expect(p1! + p2! * per!).not.toBe(need);
      const available = stock! - reserve!,
        bags = available / capacity!;
      expect(capacity).toBeGreaterThan(0);
      expect(Number.isInteger(bags)).toBe(true);
      expect(q.solution.en).toContain(
        available + '÷' + capacity + '=' + bags + ' bags',
      );
      expect(bags * capacity! + reserve!).toBe(stock);
      const inside = packs! * perPack!,
        total = inside + loose!;
      expect(q.solution.en).toContain(
        packs + '×' + perPack + '+' + loose + '=' + total,
      );
      expect((total - loose!) / packs!).toBe(perPack);
      expect(cardJourney(boxes!, each!, journey.total).remaining).toBe(0);
      expect((stock! - stock!) / capacity!).toBe(0);
      expect(q.solution.en).toContain('determined zeros, not missing data');
    }
  });
  it('selects facts by goal and proves the original mass is not determined using two compatible completions', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        r = rows(s, 3),
        budget = number(r[0]![1]!),
        count = number(r[1]![1]!),
        price = number(r[2]![1]!),
        year = number(r[4]![1]!),
        cost = count * price;
      expect(r.map((x) => x[0])).toEqual(['F1', 'F2', 'F3', 'F4', 'F5', 'F6']);
      expect(r.some((x) => /grams|mass|kg/.test(x[1]!))).toBe(false);
      expect(q.solution.en).toContain(
        'Cost uses F2/F3: ' + count + '×' + price + '=NZ$' + cost,
      );
      expect(q.solution.en).toContain(
        'Remaining uses F1/F2/F3: ' +
          budget +
          '−' +
          cost +
          '=NZ$' +
          (budget - cost),
      );
      expect(q.solution.en).toContain(count * 100 + ' g');
      expect(q.solution.en).toContain(count * 150 + ' g');
      expect(count * 100).not.toBe(count * 150);
      expect(q.solution.en).toContain(count + '×200=' + count * 200 + ' g');
      expect(q.solution.en).toContain(
        '2025−' + year + '=' + (2025 - year) + ' years',
      );
      expect(q.solution.en).toContain('not elapsed exact anniversaries');
      expect(q.solution.zh).toContain('缺必要资料');
      expect(q.solution.zh).toContain('不能判0');
    }
  });
  it('separates card and money ledgers, repairs the actual invalid claim, switches giving to receiving and counts square units independently', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        data = Object.fromEntries(
          rows(s, 4).map(([id, value]) => [id!, number(value!)]),
        ),
        { N: n, E: e, L: l, G: g, P: p, B: budget, W: w, H: h } = data;
      const original = n! * e! + l!,
        left = original - g!,
        bad = n! + e! + l! - g!,
        spentCents = n! * p! * 100,
        changeCents = budget! * 100 - spentCents;
      expect(left).toBeGreaterThanOrEqual(0);
      expect(changeCents).toBeGreaterThanOrEqual(0);
      expect(bad).not.toBe(left);
      expect(q.solution.en).toContain(
        n + '+' + e + '+' + l + '−' + g + '=' + bad,
      );
      expect(q.solution.en).toContain(
        original + '−' + g + '=' + left + ' cards',
      );
      expect(q.solution.en).toContain(left + '+' + g + '=' + original);
      expect(q.solution.en).toContain(
        'Cost ' + n + '×' + p + '=NZ$' + spentCents / 100,
      );
      expect(q.solution.en).toContain(
        budget + '−' + spentCents / 100 + '=NZ$' + changeCents / 100,
      );
      expect(changeCents + spentCents).toBe(budget! * 100);
      expect(q.solution.en).toContain(
        original + '+' + g + '=' + (original + g!) + ' cards',
      );
      expect(q.solution.en).toContain(w + '×' + h + '=' + w! * h! + ' cm²');
      const squares = Array.from({ length: h! }, () =>
        Array.from({ length: w! }, () => 1),
      );
      expect(squares.flat().reduce((sum, x) => sum + x, 0)).toBe(w! * h!);
      expect(q.solution.en).toContain(
        'Accept ANY sound short text, diagram or spoken explanation',
      );
      expect(q.solution.zh).toContain(
        '人审关系/计算/单位/情境/有效核查而非关键词',
      );
    }
  });
  it('retains all nineteen earlier tasks and adds exact question links from all five source goals', () => {
    const evidence = foundationRecurrence.filter((e) =>
      e.sourceLesson.startsWith('B06-'),
    );
    expect(evidence).toHaveLength(5);
    expect(evidence.reduce((n, e) => n + e.targets.length, 0)).toBe(29);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(29);
    const original = [
      'P52-L06-Q6',
      'P55-L05-Q6',
      'P56-L02-Q4',
      'P51-MAINT-FOUNDATION-Q9',
      'P52-MAINT-FOUNDATION-Q9',
      'P52-L06-Q4',
      'P52-L06-Q5',
      'P57-L05-Q3',
      'P57-L05-Q4',
      'P57-L05-Q5',
      'P56-L03-Q3',
      'P56-L03-Q6',
      'P57-L01-Q6',
      'P57-L05-Q6',
      'P68-L04-Q6',
      'P51-L01-Q6',
      'P52-L03-Q6',
      'P52-L05-Q6',
      'P56-L02-Q6',
    ];
    expect(
      evidence
        .flatMap((e) => e.targets)
        .filter((id) => !id.includes('MAINT-WORD-PROBLEMS')),
    ).toEqual(original);
    for (const [i, e] of evidence.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id)!;
        expect(link.href).toBe(maintenanceHref(s, q.id));
      }
  });
});
