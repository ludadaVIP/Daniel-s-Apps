// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DistributionLab, DistributionHookArt } from './DistributionLabs';
import { h33Lessons } from './content/H33';
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
describe('H33 investigations and preserved mathematical evidence', () => {
  it('constructs a full table and resets it when the numerical map changes', () => {
    render(<DistributionLab kind="distribution-table" mode="en" />);
    const name = 'Construct the complete distribution table';
    enter(name, '0:1/3;1:1/3;2:1/3');
    check(name);
    expect(screen.getByRole('status').textContent).toContain('Merge');
    enter(name, '2:0.25;1:0.5;0:1/4');
    check(name);
    matched(name);
    select('Numerical map', 'same');
    expect(field(name)).toBe('');
    enter(name, '1:1/2;0:1/2');
    check(name);
    matched(name);
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Discrete probability masses' }),
    ).toBeTruthy();
  });
  it('separates theoretical expectation from zero-trial and seeded finite means', () => {
    render(<DistributionLab kind="distribution-expectation" mode="en" />);
    const name = 'Predict E(Y)';
    enter(name, '3/2');
    check(name);
    matched(name);
    expect(screen.getByText(/undefined \(zero draws\)/)).toBeTruthy();
    click('Simulate ten more');
    expect(screen.getByText(/10 draws/)).toBeTruthy();
    select('Simulation seed', '1234');
    expect(field(name)).toBe('3/2');
    expect(screen.getByText(/undefined \(zero draws\)/)).toBeTruthy();
    select('a in Y=aX+b', '2');
    select('b in Y=aX+b', '1');
    expect(field(name)).toBe('');
    enter(name, '4');
    check(name);
    matched(name);
  });
  it('keeps spread predictions under translation and handles negative and zero scales', () => {
    render(<DistributionLab kind="distribution-spread" mode="en" />);
    const v = 'Predict Var(Y) (m²)',
      s = 'Predict SD(Y) (m, sqrt supported)',
      m = 'Predict E(Y) (m)';
    enter(v, '1');
    enter(s, '1');
    enter(m, '1');
    select('Translation b', '5');
    expect(field(v)).toBe('1');
    expect(field(s)).toBe('1');
    expect(field(m)).toBe('');
    select('Scale a', '-3');
    enter(v, '9');
    enter(s, '3');
    check(v);
    check(s);
    matched(v);
    matched(s);
    select('Scale a', '0');
    enter(v, '0');
    enter(s, '0');
    check(v);
    check(s);
    matched(v);
    matched(s);
    click('Show/hide audit');
    expect(screen.getByText(/sqrt\(0\)/)).toBeTruthy();
  });
  it('refuses unjustified binomial settings and retains zero-probability slots at endpoints', () => {
    render(<DistributionLab kind="distribution-binomial" mode="en" />);
    const p = 'Predict event probability';
    enter(p, '3/8');
    check(p);
    matched(p);
    select('Experiment conditions', 'bag');
    expect(screen.queryByRole('textbox', { name: p })).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('dependent');
    select('Experiment conditions', 'iid');
    select('Fixed trials n', '0');
    enter(p, '1');
    check(p);
    matched(p);
    select('Fixed trials n', '4');
    select('Success probability p', '1');
    select('Event', 'at-least');
    enter(p, '1');
    check(p);
    matched(p);
    click('Show/hide audit');
    expect(
      screen.getByText(/support contains only positive-mass values: \{4\}/),
    ).toBeTruthy();
  });
  it('preserves relative normal area across centre and scale changes and gives zero mass to a singleton', () => {
    render(<DistributionLab kind="distribution-normal" mode="en" />);
    const p = 'Predict probability (four decimals)';
    enter(p, '0.6827');
    check(p);
    matched(p);
    select('SD σ (cm)', '3');
    select('Mean μ (cm)', '10');
    expect(field(p)).toBe('0.6827');
    select('Probability interval', 'point');
    enter(p, '0.0000');
    check(p);
    matched(p);
    click('Show/hide audit');
    expect(screen.getByText('Point probability (exact)')).toBeTruthy();
  });
  it('keeps z and its probability under coordinate changes but resets the selected tail', () => {
    render(<DistributionLab kind="distribution-standard" mode="en" />);
    const z = 'Predict z-score',
      p = 'Predict event probability (four decimals)';
    enter(z, '-3/2');
    enter(p, '0.0668');
    check(z);
    check(p);
    matched(z);
    matched(p);
    select('Coordinate view', 'standard');
    select('Mean μ', '50');
    select('Positive SD σ', '5');
    expect(field(z)).toBe('-3/2');
    expect(field(p)).toBe('0.0668');
    select('Tail event', 'right');
    expect(field(p)).toBe('');
    enter(p, '0.9332');
    check(p);
    matched(p);
    select('Tail event', 'between');
    enter(p, '0.8664');
    check(p);
    matched(p);
  });
  it('renders six meaningful hooks and both examples on every actual reading route', () => {
    for (const l of h33Lessons) {
      const art = render(
        <DistributionHookArt
          kind={l.lab as Parameters<typeof DistributionHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      if (l.id === 'H33-L04') {
        expect(
          [...art.container.querySelectorAll('[data-value]')].map((e) =>
            e.getAttribute('data-value'),
          ),
        ).toEqual(['0', '1', '2', '3', '4']);
        expect(
          [...art.container.querySelectorAll('[data-mass]')].map((e) =>
            e.getAttribute('data-mass'),
          ),
        ).toEqual(['1/16', '1/4', '3/8', '1/4', '1/16']);
      }
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores six supported guided answers without completing unfinished lessons', () => {
    for (const [id, answer] of [
      ['H33-L01', '0:1/4;1:1/2;2:1/4'],
      ['H33-L02', '3/2'],
      ['H33-L03', '1'],
      ['H33-L04', '3/8'],
      ['H33-L05', '0.6827'],
      ['H33-L06', '-3/2'],
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
  it('restores a human-reviewed spread explanation as original writing', () => {
    const v = mount('/math/lesson/H33-L03');
    click(/^06 Reflect/);
    const text =
      'Engineering example: The0/2 distribution has mean1 and variance1, whereas-1/3 has the same mean and variance4. Squared deviations prevent cancellation. Translation preserves spread; scale a multiplies variance by a² and SD by absolute a. Metre values give m² variance and m SD. Zero variance concentrates mass at the mean and prevents dividing by SD for z; this is a model variance, not an n-1 sample estimate.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H33-L03']
        .answers['H33-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H33-L03');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records eight unit items only after explicit review of binomial and standardisation assumptions', () => {
    const v = mount('/math/unit/H33/check');
    ['0:1/4;1:1/2;2:1/4', '3/2', '1', '3/8', '0.6827', '-3/2'].forEach(
      (answer, i) => {
        click(`Question ${i + 1}`);
        enter('Your answer', answer);
        click(/Check answer/);
      },
    );
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: Exactly two successes in four iid trials has six disjoint orders, each p²(1-p)². At least one complements zero. Check fixed n, independence, binary outcomes and constant p; without replacement and stopping at first success violate assumptions. p0/1 and n0 are valid degenerate cases with zero variance.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: Under N(100,10²),85 and115 have z-1.5 and1.5. A left-tail table gives interval probability0.8664 by subtraction and right tail beyond120 as0.0228 by complement. Check whether a table instead gives zero-to-z area. z is signed and unitless, not a probability. SD must be positive; standardisation alone does not imply normality, and comparisons need a shared interpretation.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H33/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H33-L01'],
    ).toBeUndefined();
  });
  it('changes a due expectation retrieval without inheriting its old expression or success', () => {
    const v = mount('/math/lesson/H33-L02');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '4');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '1/2');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H33-L02'].round).toBe(1);
    saved.sessions['H33-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '1/2');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '1');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
