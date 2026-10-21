// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProblemSolvingLab, ProblemSolvingHookArt } from './ProblemSolvingLabs';
import { h28Lessons } from './content/H28';
import { App } from './App';
import { STORAGE_KEY } from './progress';
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const check = (name: string) => click(`Check: ${name}`);
const matched = (name: string) =>
  expect(
    screen.getByRole('status', { name: `${name} feedback` }).textContent,
  ).toContain('matches');
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
describe('H28 investigations and preserved learning evidence', () => {
  it('allows independent task order and preserves only unchanged predictions', () => {
    const v = render(<ProblemSolvingLab kind="problem-decompose" mode="en" />);
    click('Decision');
    expect(
      screen.getByRole('status', { name: 'Task order feedback' }).textContent,
    ).toContain('Cost, Capacity');
    for (const s of [
      'Capacity',
      'Demand',
      'Shortage',
      'Packets',
      'Cost',
      'Decision',
    ])
      click(s);
    expect(v.container.querySelectorAll('[data-complete="true"]')).toHaveLength(
      6,
    );
    enter('Predict demand (cards)', '59');
    enter('Predict minimum packets', '7');
    enter('Predict A cost (credits)', '49');
    for (const name of [
      'Predict demand (cards)',
      'Predict minimum packets',
      'Predict A cost (credits)',
    ]) {
      check(name);
      matched(name);
    }
    select('Stock cards', '60');
    expect(field('Predict demand (cards)')).toBe('59');
    expect(field('Predict minimum packets')).toBe('');
    expect(field('Predict A cost (credits)')).toBe('');
    expect(v.container.querySelectorAll('[data-complete="true"]')).toHaveLength(
      0,
    );
    enter('Predict A cost (credits)', '7');
    check('Predict A cost (credits)');
    matched('Predict A cost (credits)');
    click('Show/hide audit');
    expect(v.container.querySelectorAll('[data-card]')).toHaveLength(60);
    expect(
      v.container.querySelectorAll('[data-source="purchase"]'),
    ).toHaveLength(0);
    select('Stock cards', '4');
    expect(
      v.container.querySelectorAll('[data-source="purchase"]'),
    ).toHaveLength(56);
    expect(
      v.container.querySelectorAll('[data-use="participant"]'),
    ).toHaveLength(54);
    expect(v.container.querySelectorAll('[data-use="reserve"]')).toHaveLength(
      5,
    );
    expect(v.container.querySelectorAll('[data-use="unused"]')).toHaveLength(1);
    select('Attendance', '0');
    expect(v.container.querySelectorAll('[data-use="reserve"]')).toHaveLength(
      0,
    );
    enter('Predict A cost (credits)', '0');
    check('Predict A cost (credits)');
    matched('Predict A cost (credits)');
  });
  it('switches variables without changing equality and plots exact discrete coordinates', () => {
    const v = render(<ProblemSolvingLab kind="problem-represent" mode="en" />);
    enter('Predict equal-cost positive packet count', '6');
    enter('Predict complete equal-cost attendance set', '{15,0,14}');
    select('Horizontal variable', 'packets');
    expect(field('Predict equal-cost positive packet count')).toBe('6');
    expect(field('Predict complete equal-cost attendance set')).toBe(
      '{15,0,14}',
    );
    for (const name of [
      'Predict equal-cost positive packet count',
      'Predict complete equal-cost attendance set',
    ]) {
      check(name);
      matched(name);
    }
    expect(
      v.container
        .querySelector('[data-plan="A"][data-x="6"]')
        ?.getAttribute('data-cost'),
    ).toBe('43');
    select('Horizontal variable', 'people');
    expect(
      v.container
        .querySelector('[data-plan="B"][data-x="0"]')
        ?.getAttribute('data-cost'),
    ).toBe('0');
    expect(v.container.querySelectorAll('polyline')).toHaveLength(0);
    select('Budget credits', '51');
    expect(field('Predict equal-cost positive packet count')).toBe('6');
    click('Show/hide audit');
    expect(screen.getByText(/current budget maxima A=18, B=20/)).toBeTruthy();
  });
  it('checks boundary-specific candidate verdicts, cancellation and capacity independently', () => {
    render(<ProblemSolvingLab kind="problem-boundaries" mode="en" />);
    const name = 'Predict candidate audit (valid/invalid)';
    enter(name, 'invalid');
    check(name);
    matched(name);
    select('Test attendance', '5');
    expect(field(name)).toBe('');
    enter(name, 'valid');
    check(name);
    matched(name);
    select('Candidate rule', 'keep-fee');
    select('Test attendance', '0');
    enter('Predict correct A cost', '0');
    check('Predict correct A cost');
    matched('Predict correct A cost');
    enter(name, 'invalid');
    check(name);
    matched(name);
    select('Candidate rule', 'ignore-capacity');
    select('Test attendance', '21');
    select('Budget credits', '200');
    enter(name, 'invalid');
    check(name);
    matched(name);
    click('Show/hide audit');
    expect(screen.getByText('false')).toBeTruthy();
  });
  it('distinguishes failed parsing, premise failure, agreement and arbitrary valid counterexamples', () => {
    render(<ProblemSolvingLab kind="problem-counterexample" mode="en" />);
    enter('Your counterexample', '(2,3)');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('Valid counterexample');
    select('Claim', 'cancel-factor');
    expect(field('Your counterexample')).toBe('');
    enter('Your counterexample', '2');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('premise fails');
    enter('Your counterexample', '1');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('agrees');
    enter('Your counterexample', '0');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('Valid counterexample');
    select('Claim', 'equal-perimeter');
    enter('Your counterexample', '(0,2)');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('premise fails');
    enter('Your counterexample', '(2,3)');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('Valid counterexample');
    enter('Your counterexample', '(1/101,2)');
    click('Check counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('bounds failed');
  });
  it('audits all stated scenarios without inheriting a baseline as a guarantee', () => {
    render(<ProblemSolvingLab kind="problem-report" mode="en" />);
    const base = 'Predict baseline cost (lowest attendance, three each)',
      worst = 'Predict maximum cost within assumptions',
      all = 'Predict feasibility throughout (valid/invalid)';
    enter(base, '49');
    enter(worst, '73');
    enter(all, 'invalid');
    for (const name of [base, worst, all]) {
      check(name);
      matched(name);
    }
    select('Budget credits', '70');
    expect(field(base)).toBe('49');
    expect(field(worst)).toBe('73');
    expect(field(all)).toBe('');
    select('Assumed attendance range', '18-22');
    expect(field(base)).toBe('49');
    expect(field(worst)).toBe('');
    select('Price plan', 'B');
    select('Assumed attendance range', '18-20');
    enter(worst, '63');
    check(worst);
    matched(worst);
    enter(all, 'valid');
    check(all);
    matched(all);
    click('Show/hide audit');
    expect(screen.getByText(/Across 6 scenarios/)).toBeTruthy();
    select('Assumed attendance range', '18-22');
    select('Budget credits', '200');
    enter(all, 'invalid');
    check(all);
    matched(all);
    expect(screen.getByText(/Capacity violations: present/)).toBeTruthy();
  });
  it('renders five meaningful hooks and both full examples through each actual reading route', () => {
    for (const l of h28Lessons) {
      const art = render(
        <ProblemSolvingHookArt
          kind={l.lab as Parameters<typeof ProblemSolvingHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores five corrected guided answers without completing unworked lessons', () => {
    for (const [id, answer] of [
      ['H28-L01', '7'],
      ['H28-L02', '6'],
      ['H28-L03', '0'],
      ['H28-L04', '(2,3)'],
      ['H28-L05', '73'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', answer!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(answer);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('requires parent review for counterexample reasoning and restores original learner writing', () => {
    const v = mount('/math/lesson/H28-L04');
    click(/^06 Reflect/);
    const text =
      'Engineering example: For the rational square-sum claim, (2,3) has true admissibility and unequal sides 25 and 13. One true-premise failure refutes the universal assertion. For x squared equals x, input two fails the premise and cannot refute the implication; input zero works. Parent review checks the full argument, not keywords.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H28-L04']
        .answers['H28-L04-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H28-L04');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('saves eight unit records and two separate human arguments independently of lesson mastery', () => {
    const v = mount('/math/unit/H28/check');
    ['7', '6', '0', '(2,3)', '73'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    click('Question 6');
    click(/Feasible throughout the explicit assumptions and range/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering review example: Choose (2,3) for the universal rational square-sum claim. Both inputs are in the domain; the sides are 25 and 13, so a true premise accompanies a false conclusion. Two is not a witness to x squared equals x implying x equals one, because its premise fails. One agreeing instance cannot prove an infinite-domain universal statement.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering review example: Assume stock four, five spares, packets of eight, capacity twenty, integer attendance eighteen through twenty and usage three or four, no additional loss or charges. Baseline A49 B47; six-case maxima A73 B63. At budget seventy B passes every scenario and A does not. This is conditional enumeration, without probabilities. Usage five, price changes, losses or attendance beyond twenty require new calculations.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H28/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H28-L01'],
    ).toBeUndefined();
  });
  it('changes a due packet retrieval without inheriting the old answer or success', () => {
    const v = mount('/math/lesson/H28-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '59');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '6');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H28-L01'].round).toBe(1);
    saved.sessions['H28-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '6');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '7');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
