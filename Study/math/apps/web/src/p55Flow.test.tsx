// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { EquationLab } from './EquationLabs';
import { EquationBoard, GrowingPatternView } from './EquationVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
vi.setConfig({ testTimeout: 20000 });
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const trial = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Trial candidate' }), {
    target: { value },
  });
const compare = () => click('Substitute into the original; compare sides');
const inverse = (value: string) => {
  select('Inverse operation', value);
  click('Check the operation choice');
};
const reveal = () =>
  click('I wrote the steps; check the solution and substitution');
const enter = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
    target: { value },
  });
const check = () =>
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('actual equation-model dispatch', () => {
  it('keeps foundational P55 models separate from H35 through actual lesson routes', () => {
    const hookClasses = [
      '.math-equation-board',
      '.math-algebra-balance',
      '.math-growing-pattern',
      '.math-equation-board',
      '.math-equation-board',
    ];
    for (let i = 1; i <= 5; i++) {
      const hook = mount('/math/lesson/P55-L0' + i);
      expect(hook.container.querySelector(hookClasses[i - 1]!)).not.toBeNull();
      hook.unmount();
      const explore = mount('/math/lesson/P55-L0' + i + '?step=1');
      expect(
        explore.container.querySelector('.math-equation-lab'),
      ).not.toBeNull();
      expect(explore.container.querySelector('.math-concept-lab')).toBeNull();
      explore.unmount();
    }
    for (let i = 1; i <= 5; i++) {
      const explore = mount('/math/lesson/H35-L0' + i + '?step=1');
      expect(explore.container.querySelector('.math-equation-lab')).toBeNull();
      expect(
        explore.container.querySelector('.math-concept-lab'),
      ).not.toBeNull();
      explore.unmount();
    }
  }, 60000);
});
describe('P55 workshop', () => {
  it('keeps the unknown hidden, evaluates candidate substitution exactly and resets on a changed equation', () => {
    render(<EquationLab kind="equation-box" mode="en" />);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Trial candidate',
        }) as HTMLInputElement
      ).value,
    ).toBe('');
    expect(screen.queryByText('□ = 12')).toBeNull();
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '= 12',
    );
    trial('10');
    compare();
    expect(screen.getByText(/Left 17, right 19: unequal/)).toBeTruthy();
    trial('12');
    compare();
    expect(
      screen.getByText(/Substitution gives 19 on both sides/),
    ).toBeTruthy();
    click('24 − □ = 9');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Trial candidate',
        }) as HTMLInputElement
      ).value,
    ).toBe('');
    trial('15');
    compare();
    expect(screen.getByText(/Substitution gives 9 on both sides/)).toBeTruthy();
    trial('0/0');
    compare();
    expect(screen.getByText(/valid exact number/)).toBeTruthy();
  });
  it('preserves the difference through simultaneous removals, clears old trial claims and contrasts a left-only action', () => {
    const view = render(<EquationLab kind="equation-balance" mode="en" />);
    expect(
      view.container.querySelectorAll('.equation-unit-counter'),
    ).toHaveLength(14);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'no trial comparison yet',
    );
    click('Compare sides for this candidate');
    expect(
      screen.getByText('Candidate 4: left 7, right 11; right is greater.'),
    ).toBeTruthy();
    for (let i = 0; i < 3; i++) click('I predicted; apply the operation');
    expect(
      view.container.querySelectorAll('.equation-unit-counter'),
    ).toHaveLength(8);
    expect(
      screen.queryByText('Candidate 4: left 7, right 11; right is greater.'),
    ).toBeNull();
    slide('Candidate box value', '8');
    click('Compare sides for this candidate');
    expect(
      screen.getByText('Candidate 8: left 8, right 8; equal.'),
    ).toBeTruthy();
    select('Operation target', 'left');
    select('Balance action', 'add-unit');
    click('I predicted; apply the operation');
    click('Compare sides for this candidate');
    expect(
      screen.getByText('Candidate 8: left 9, right 8; left is greater.'),
    ).toBeTruthy();
    expect(
      screen.getByText(/does not preserve the relationship in general/),
    ).toBeTruthy();
  });
  it('uses identical unknown boxes, handles zero known counters and leaves the board unchanged after impossible removal', () => {
    const view = render(<EquationLab kind="equation-balance" mode="en" />);
    select('Balance action', 'add-box');
    click('I predicted; apply the operation');
    expect(
      view.container.querySelectorAll('.equation-unknown-box'),
    ).toHaveLength(3);
    click('Restore □+3 and 11');
    select('Balance action', 'remove-box');
    click('I predicted; apply the operation');
    expect(screen.getByText(/not enough matching objects/)).toBeTruthy();
    expect(
      view.container.querySelectorAll('.equation-unknown-box'),
    ).toHaveLength(1);
    expect(
      view.container.querySelectorAll('.equation-unit-counter'),
    ).toHaveLength(14);
  });
  it('rejects an accidental first-term pattern rule, draws shared square edges once and supports equivalent expressions', () => {
    const view = render(<EquationLab kind="equation-pattern" mode="en" />);
    slide('Construction step n', '1');
    select('Pattern expression', '4n');
    click('Check the construction rule');
    expect(
      screen.getByText(/Accidentally fitting the first term is insufficient/),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'I calculated; check this term' }),
    ).toBeNull();
    select('Pattern expression', '1+3n');
    click('Check the construction rule');
    click('I calculated; check this term');
    expect(screen.getByText(/For n=1, 3×1\+1=4/)).toBeTruthy();
    slide('Construction step n', '8');
    expect(screen.queryByText(/For n=1/)).toBeNull();
    expect(view.container.querySelectorAll('[data-stick]')).toHaveLength(25);
    const lengths = [...view.container.querySelectorAll('line')].map(
      (e) =>
        Math.abs(Number(e.getAttribute('x2')) - Number(e.getAttribute('x1'))) +
        Math.abs(Number(e.getAttribute('y2')) - Number(e.getAttribute('y1'))),
    );
    expect(new Set(lengths)).toEqual(new Set([40]));
    click('Two rows plus one');
    slide('Construction step n', '6');
    expect(view.container.querySelectorAll('[data-counter]')).toHaveLength(13);
    expect(view.container.querySelectorAll('.extra')).toHaveLength(1);
  });
  it('selects legal inverse operations, shows equality-preserving lines and retains a noninteger solution', () => {
    render(<EquationLab kind="equation-one-step" mode="en" />);
    select('Equation to explore', '6');
    inverse('add');
    expect(
      screen.queryByRole('button', {
        name: 'I wrote the steps; check the solution and substitution',
      }),
    ).toBeNull();
    inverse('multiply');
    reveal();
    expect(screen.getByText('4 × x ÷ 4 = 5 ÷ 4')).toBeTruthy();
    expect(screen.getByText('x = 5/4')).toBeTruthy();
    trial('1');
    compare();
    expect(screen.getByText(/Left 4, right 5: unequal/)).toBeTruthy();
    trial('1.25');
    compare();
    expect(screen.getByText(/Substitution gives 5 on both sides/)).toBeTruthy();
  });
  it('separates zero-factor all-value/no-value cases without inventing a unique solution or dividing by zero', () => {
    render(<EquationLab kind="equation-one-step" mode="en" />);
    select('Equation to explore', '8');
    inverse('multiply');
    expect(
      screen.queryByRole('button', {
        name: 'I wrote the steps; check the solution and substitution',
      }),
    ).toBeNull();
    inverse('zero');
    reveal();
    expect(
      screen.getByText(/every allowed trial value works; there is no unique x/),
    ).toBeTruthy();
    trial('17/4');
    compare();
    expect(screen.getByText(/Substitution gives 0 on both sides/)).toBeTruthy();
    select('Equation to explore', '9');
    inverse('zero');
    reveal();
    expect(
      screen.getByText(/no value works, because zero times any number is zero/),
    ).toBeTruthy();
  });
  it('accepts equivalent story relationships, checks object units and preserves bilingual accessible labels without answer leaks', () => {
    render(<EquationLab kind="equation-story" mode="en" />);
    select('Story equation', 'c');
    click('Check the unknown and relationship');
    expect(
      screen.queryByRole('textbox', { name: 'Trial candidate' }),
    ).toBeNull();
    select('Story equation', 'b');
    click('Check the unknown and relationship');
    trial('12');
    compare();
    expect(
      screen.getByText(/Substitution gives 19 on both sides/),
    ).toBeTruthy();
    click('How long is each piece?');
    expect(screen.queryByText(/Substitution gives 19/)).toBeNull();
    select('Story equation', 'b');
    click('Check the unknown and relationship');
    expect(screen.getByText(/x uses unit m/)).toBeTruthy();
    trial('5/4');
    compare();
    expect(screen.getByText(/Substitution gives 5 on both sides/)).toBeTruthy();
    cleanup();
    render(
      <EquationBoard
        equation={{ kind: 'multiply', a: '4', b: '5' }}
        mode="bilingual"
      />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '5/4',
    );
    expect(screen.getByText(/The equal sign relates/)).toBeTruthy();
    cleanup();
    render(<GrowingPatternView pattern="squares" n={4} mode="en" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toContain(
      '13',
    );
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
});
describe('P55 learner records and publication', () => {
  it('restores a supported decimal solution after a wrong unit while retaining exact fraction equivalence', () => {
    const view = mount('/math/lesson/P55-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('1.25 L');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('1.25 m');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P55-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('1.25 m');
  });
  it('records bilingual stick units and restores a distant pattern answer', () => {
    const view = mount('/math/lesson/P55-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('31 根小棒');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P55-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('31 根小棒');
  });
  it('keeps saved equality reasoning and parent review separate from premature lesson mastery', () => {
    const view = mount('/math/lesson/P55-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The first expression is twelve, while twelve plus four is sixteen, so the chain is false. Use separate equations or add four to both sides of seven plus five equals twelve. Changing only one side changes the difference.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P55-L02');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P55-L02']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit-review answers and restores the final reasoning separately from individual lessons', () => {
    const view = mount('/math/unit/P55/check');
    for (const [index, value] of Object.entries({
      1: '18',
      2: '8',
      3: '22 sticks',
      4: '12',
      6: '7 pencils',
      7: '6 NZD',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 5');
    fireEvent.click(
      screen.getByRole('button', { name: /^C Add the same two to both sides/ }),
    );
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Define x as the length per piece in metres, not the piece count. Four pieces times this length equals the total five metres. Each is five quarters of a metre or one point two five metres. Multiplying by four restores five metres.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P55/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['P55-CHECK'].answers['P55-CHECK-Q3'].input).toBe(
      '22 sticks',
    );
    expect(saved.sessions['P55-L03']).toBeUndefined();
  });
  it('retrieves a changed construction with cleared input when a later saved review becomes due', () => {
    const view = mount('/math/lesson/P55-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('40');
    check();
    enter('31');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(/A row of 1 square follows the stated shared-edge/),
    ).toBeTruthy();
    enter('4 sticks');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P55-L03'].round).toBe(1);
    saved.sessions['P55-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/Two rows each have 2 counters/)).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('publishes all five planned lessons, eight check items and retrieval routes while retaining the prior 52 lessons', () => {
    const unit = lessons.filter((l) => l.unit === 'P55');
    expect(unit).toHaveLength(5);
    expect(unitChecks.P55.questions).toHaveLength(8);
    const priorUnits = [
      'B01',
      'B02',
      'B03',
      'B04',
      'B05',
      'B06',
      'P51',
      'P52',
      'P53',
      'P54',
    ];
    const expectedIds = priorUnits.flatMap((unit) =>
      Array.from(
        { length: ['P52', 'P53'].includes(unit) ? 6 : 5 },
        (_, i) => `${unit}-L${String(i + 1).padStart(2, '0')}`,
      ),
    );
    expect(
      lessons
        .filter((l) => priorUnits.includes(l.unit ?? ''))
        .map((l) => l.id)
        .sort(),
    ).toEqual(expectedIds.sort());
    unit.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    });
    const planned = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(planned).toHaveLength(358);
    expect(
      planned
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
  });
});
