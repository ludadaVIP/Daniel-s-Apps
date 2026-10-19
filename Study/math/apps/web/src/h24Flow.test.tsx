// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CountingLab, CountingHookArt } from './CountingLabs';
import { h24Lessons } from './content/H24';
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
describe('H24 interactive outcome identities and learning records', () => {
  it('distinguishes overlap from illegal stage pairs and preserves predictions while showing the audit', () => {
    render(<CountingLab kind="counting-principles" mode="en" />);
    const name = 'Predict distinct outcome count';
    enter(name, '5');
    check(name);
    matched(name);
    select('Category overlap', '1');
    expect(field(name)).toBe('');
    enter(name, '4');
    check(name);
    matched(name);
    click('Show/hide audit');
    expect(field(name)).toBe('4');
    expect(screen.getByText('A, B, C, D')).toBeTruthy();
    select('Counting structure', 'stages');
    expect(field(name)).toBe('');
    enter(name, '6');
    check(name);
    matched(name);
    select('Stage restriction', '1');
    enter(name, '4');
    check(name);
    matched(name);
    expect(screen.getByText('(3,1) (3,2)')).toBeTruthy();
  });
  it('enumerates ordered positions under both repetition rules and retains one empty outcome', () => {
    render(<CountingLab kind="counting-permutations" mode="en" />);
    const name = 'Predict selection count';
    enter(name, '12');
    check(name);
    matched(name);
    select('Positions or members r', '3');
    select('Repetition rule', '1');
    enter(name, '64');
    check(name);
    matched(name);
    click('Show/hide audit');
    expect(screen.getByText('AAA')).toBeTruthy();
    select('Positions or members r', '0');
    enter(name, '1');
    check(name);
    matched(name);
    expect(screen.getByText('∅')).toBeTruthy();
  });
  it('groups all orders with uniform factorial multiplicity for equal-role membership', () => {
    render(<CountingLab kind="counting-combinations" mode="en" />);
    enter('Predict selection count', '6');
    check('Predict selection count');
    matched('Predict selection count');
    click('Show/hide audit');
    expect(screen.getByText('AB, BA')).toBeTruthy();
    select('Positions or members r', '3');
    expect(screen.getByText('ABC, ACB, BAC, BCA, CAB, CBA')).toBeTruthy();
    enter('Predict selection count', '4');
    check('Predict selection count');
    matched('Predict selection count');
  });
  it('separates Pascal counts, substituted signed coefficients, zero-trial frequency and actual simulation', () => {
    const v = render(<CountingLab kind="counting-binomial" mode="en" />);
    const name = 'Predict the coefficient of this power';
    enter(name, '6');
    check(name);
    matched(name);
    select('Constant b', '-2');
    expect(field(name)).toBe('');
    enter(name, '24');
    check(name);
    matched(name);
    expect(screen.getAllByText('undefined')).toHaveLength(5);
    click('Add 20 simulated trials');
    expect(field(name)).toBe('24');
    expect(screen.getByText(/seed 12345, 20 trials/)).toBeTruthy();
    expect(screen.getAllByText('3/8').length).toBeGreaterThan(0);
    click('Show/hide audit');
    expect(
      v.container.querySelector('[data-pascal-row="4"][data-pascal-k="2"] text')
        ?.textContent,
    ).toBe('6');
    select('Power n', '0');
    expect(screen.getByText(/seed 12345, 0 trials/)).toBeTruthy();
    enter(name, '1');
    check(name);
    matched(name);
    click('Add 20 simulated trials');
    expect(screen.getAllByText('20').some((e) => e.tagName === 'TD')).toBe(
      true,
    );
    click('Change seed and clear simulation');
    expect(screen.getByText(/seed 12346, 0 trials/)).toBeTruthy();
  });
  it('changes conditioned denominators and distinguishes zero probability from an undefined empty condition', () => {
    const v = render(<CountingLab kind="counting-conditional" mode="en" />);
    const name = 'Predict probability or undefined';
    enter(name, '60%');
    check(name);
    matched(name);
    expect(
      v.container.querySelectorAll('[data-condition-active="true"]'),
    ).toHaveLength(2);
    select('Condition direction', 'B|A');
    expect(field(name)).toBe('');
    enter(name, '3/4');
    check(name);
    matched(name);
    select('Four-cell outcome model', '2');
    select('Condition direction', 'A|B');
    enter(name, '0');
    check(name);
    expect(
      screen.getByRole('status', { name: `${name} feedback` }).textContent,
    ).not.toContain('matches');
    enter(name, 'undefined');
    check(name);
    matched(name);
    select('Four-cell outcome model', '4');
    enter(name, '0');
    check(name);
    matched(name);
  });
  it('updates the reverse source probability and handles independence without dividing by zero', () => {
    render(<CountingLab kind="counting-bayes" mode="en" />);
    const p = 'Predict P(A|F)',
      ind = 'Predict independence';
    enter(p, '8/27');
    check(p);
    matched(p);
    enter(ind, 'dependent');
    check(ind);
    matched(ind);
    select('Source A base rate', '50');
    expect(field(p)).toBe('');
    expect(field(ind)).toBe('dependent');
    enter(p, '8/9');
    check(p);
    matched(p);
    select('Flag rates for the two sources', '20,20');
    enter(p, '1/2');
    check(p);
    matched(p);
    enter(ind, 'independent');
    check(ind);
    matched(ind);
    select('Flag rates for the two sources', '0,0');
    enter(p, 'undefined');
    check(p);
    matched(p);
    expect(field(ind)).toBe('independent');
    select('Source A base rate', '0');
    select('Flag rates for the two sources', '80,10');
    enter(p, '0');
    check(p);
    matched(p);
    click('Show/hide audit');
    expect(screen.getByText(/P\(F\|A\)=undefined/)).toBeTruthy();
  });
  it('renders all six bilingual hook diagrams and complete worked-example bodies', () => {
    for (const l of h24Lessons) {
      const art = render(
        <CountingHookArt
          kind={l.lab as Parameters<typeof CountingHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg[role="img"]')).toBeTruthy();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('persists corrected guided answers for all six lessons without granting mastery', () => {
    for (const [id, answer] of [
      ['H24-L01', '5'],
      ['H24-L02', '20'],
      ['H24-L03', '10'],
      ['H24-L04', '6'],
      ['H24-L05', '3/5'],
      ['H24-L06', '8/27'],
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
  it('keeps the base-rate exit explanation human-reviewed and retains the original text after refresh', () => {
    const v = mount('/math/lesson/H24-L06');
    click(/^06 Reflect/);
    const text =
      'Engineering example: for base rate 5%, flagged masses 40 and 95 give 8/27; at 50%, masses 400 and 50 give 8/9. Equal 20% rates preserve the prior and satisfy the product test. No flags means undefined reverse conditioning, not probability zero. These are hypothetical model masses.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H24-L06']
        .answers['H24-L06-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H24-L06');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records eight unit questions with two parent reviews independently of individual lesson completion', () => {
    const v = mount('/math/unit/H24/check');
    ['5', '20', '10', '6', '3/5', '8/27'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: AB,AC,AD,BC,BD,CD are six equal-role pairs. Each has two orders, such as AB and BA, so 12=6×2!. Distinct identities and no repetition ensure the same multiplicity for every set.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: source A flagged masses are 40 versus 95 from others at 5%, giving 8/27. At 50%, 400 versus 50 gives 8/9. Equal flag rates preserve the prior; zero flags leave reverse probability undefined. These are model masses, not observed data.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H24/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H24-L01'],
    ).toBeUndefined();
  });
  it('generates a fresh due counting retrieval without inheriting the previous answer', () => {
    const v = mount('/math/lesson/H24-L02');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '24');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '4');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H24-L02'].round).toBe(1);
    saved.sessions['H24-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '4');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '5');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
