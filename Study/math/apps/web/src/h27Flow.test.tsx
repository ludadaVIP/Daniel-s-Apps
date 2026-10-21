// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StatisticsLab, StatisticsHookArt } from './StatisticsLabs';
import { h27Lessons } from './content/H27';
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
describe('H27 statistics investigations and preserved learning evidence', () => {
  it('keeps r invariant under positive units, flips its sign under reflection and separates zero from undefined', () => {
    const v = render(<StatisticsLab kind="stats-correlation" mode="en" />),
      r = 'Predict correlation r',
      s = 'Predict r squared';
    enter(r, '1/2');
    check(r);
    matched(r);
    enter(s, '1/4');
    check(s);
    matched(s);
    select('Numerical conversion', 'units');
    expect(field(r)).toBe('1/2');
    expect(field(s)).toBe('1/4');
    select('Numerical conversion', 'reflect');
    expect(field(r)).toBe('');
    expect(field(s)).toBe('1/4');
    enter(r, '-1/2');
    check(r);
    matched(r);
    select('Paired data', 'flat');
    enter(r, 'undefined');
    check(r);
    matched(r);
    select('Paired data', 'curve');
    enter(r, '0');
    check(r);
    matched(r);
    select('Numerical conversion', 'units');
    select('Paired data', 'influence');
    expect(
      v.container
        .querySelector('[data-stat-point="P5"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('10,0');
    enter(r, '0');
    check(r);
    matched(r);
    click('Compare with/without point five (not a claim of error)');
    expect(field(r)).toBe('');
    enter(r, '1');
    check(r);
    matched(r);
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Centred-pair audit' }),
    ).toBeTruthy();
  });
  it('audits vertical SSE and global gap while keeping the fitted slope independent of candidate changes', () => {
    const v = render(<StatisticsLab kind="stats-least-squares" mode="en" />),
      e = 'Predict candidate SSE',
      b = 'Predict optimal slope';
    enter(e, '3/2');
    check(e);
    matched(e);
    enter(b, '1/2');
    check(b);
    matched(b);
    select('Candidate intercept a', '0');
    expect(field(e)).toBe('');
    expect(field(b)).toBe('1/2');
    select('Candidate slope b', '1');
    enter(e, '2');
    check(e);
    matched(e);
    click('Show/hide vertical residuals');
    expect(field(e)).toBe('2');
    expect(v.container.querySelector('[data-stat-residual]')).toBeNull();
    click('Show/hide vertical residuals');
    const segment = v.container.querySelector('[data-stat-residual="P2"]')!;
    expect(segment.getAttribute('x1')).toBe(segment.getAttribute('x2'));
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Per-point residual audit' }),
    ).toBeTruthy();
    select('Fitting data', 'vertical');
    enter(b, 'not-identified');
    check(b);
    matched(b);
  });
  it('preserves original x and signed residuals when switching representations, including a missed U shape and a fan', () => {
    const v = render(<StatisticsLab kind="stats-residuals" mode="en" />),
      r = 'Predict selected signed residual',
      s = 'Predict signed residual sum';
    enter(r, '2');
    check(r);
    matched(r);
    enter(s, '0');
    check(s);
    matched(s);
    select('Observed record', '2');
    expect(field(r)).toBe('');
    expect(field(s)).toBe('0');
    enter(r, '-2');
    check(r);
    matched(r);
    expect(
      v.container
        .querySelector('[data-stat-point="P3"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('3,-2');
    click('Switch scatter / residual plot');
    expect(field(r)).toBe('-2');
    expect(
      v.container
        .querySelector('[data-stat-point="P3"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('3,0');
    select('Fitting data', 'fan');
    enter(r, '-1/2');
    check(r);
    matched(r);
    click('Show/hide audit');
    expect(screen.getAllByText('53/2')).toHaveLength(2);
  });
  it('separates exact sampling theory from repetitions and preserves unchanged population and variance predictions', () => {
    const v = render(<StatisticsLab kind="stats-sampling" mode="en" />),
      p = 'Predict population mean',
      q = 'Predict exact sampling variance';
    enter(p, '2');
    check(p);
    matched(p);
    enter(q, '4/3');
    check(q);
    matched(q);
    select('Repetitions', '192');
    select('Random seed', '31');
    expect(field(p)).toBe('2');
    expect(field(q)).toBe('4/3');
    expect(
      [...v.container.querySelectorAll('[data-sampling-observed]')].reduce(
        (s, e) => s + Number(e.getAttribute('data-count')),
        0,
      ),
    ).toBe(192);
    select('Selection design', 'convenience');
    expect(field(q)).toBe('');
    enter(q, '0');
    check(q);
    matched(q);
    enter('Predict latest sample mean', '0');
    check('Predict latest sample mean');
    matched('Predict latest sample mean');
    click('Show/hide audit');
    expect(screen.getByText('-2')).toBeTruthy();
    select('Sample size per round n', '4');
    expect(field(q)).toBe('0');
    expect(v.container.querySelectorAll('[data-sampling-exact]')).toHaveLength(
      1,
    );
  });
  it('keeps observed proportions distinct from population bounds, unknown outcomes and independent design cards', () => {
    const v = render(<StatisticsLab kind="stats-limits" mode="en" />),
      p = 'Predict observed yes proportion',
      l = 'Predict minimum population proportion',
      u = 'Predict maximum population proportion';
    enter(p, '75%');
    check(p);
    matched(p);
    enter(l, '3/40');
    check(l);
    matched(l);
    enter(u, '39/40');
    check(u);
    matched(u);
    expect(
      v.container.querySelectorAll('[data-response-state="unknown"]'),
    ).toHaveLength(180);
    select('Independent design card (does not alter data above)', '2');
    expect(field(l)).toBe('3/40');
    select('Members with known outcomes', '40');
    expect(field(p)).toBe('75%');
    expect(field(l)).toBe('');
    enter(l, '3/20');
    check(l);
    matched(l);
    select('Members with known outcomes', '200');
    expect(
      v.container.querySelectorAll('[data-response-state="unknown"]'),
    ).toHaveLength(0);
    enter(l, '3/4');
    check(l);
    matched(l);
    enter(u, '3/4');
    check(u);
    matched(u);
  });
  it('renders five meaningful hooks and both full examples through each actual reading route', () => {
    for (const l of h27Lessons) {
      const art = render(
        <StatisticsHookArt
          kind={l.lab as Parameters<typeof StatisticsHookArt>[0]['kind']}
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
      ['H27-L01', '1/2'],
      ['H27-L02', '1/2'],
      ['H27-L03', '-1/2'],
      ['H27-L04', '6'],
      ['H27-L05', '3/4'],
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
  it('requires parent review for sampling reasoning and restores original learner writing', () => {
    const v = mount('/math/lesson/H27-L04');
    click(/^06 Reflect/);
    const text =
      'Engineering example: AB mean 0; AC,AD,BC,BD mean 2; CD mean 4, each probability 1/6. Expectation 2 and variance 4/3 describe n=2 samples. Repetitions change empirical frequencies, not n. Always choosing AB has zero variance but bias -2. Restore the population between rounds; a seeded simulation is reproducible rather than a proof of probabilities.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H27-L04']
        .answers['H27-L04-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H27-L04');
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
    const v = mount('/math/unit/H27/check');
    ['1/2', '1/2', '-1/2', '6', '3/4'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    click('Question 6');
    click(/Under appropriate conditions it supports treatment comparisons/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: The six equally likely identity pairs have means 0,2,2,2,2,4. E=2 and variance=4/3. Changing n changes the exact distribution, while repetitions only approximate it and need not improve each run. Always choosing AB gives mean 0, variance 0 and bias -2. Restore the population each round; enumerate rather than treating simulation as proof.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: Fifteen of twenty known outcomes gives 75%, while 180 unknown outcomes allow population proportion 15/200 to 195/200. These are logical bounds, not confidence intervals. Proper random sampling supports uncertain population estimates; random assignment supports participant treatment comparisons under suitable assumptions, not automatic generalisation. Group outcomes and independent validation are still required. High r cannot prove causation or reliable extrapolation.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H27/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H27-L01'],
    ).toBeUndefined();
  });
  it('changes a due correlation retrieval without inheriting the old answer or success', () => {
    const v = mount('/math/lesson/H27-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '1/4');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '1/2');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H27-L01'].round).toBe(1);
    saved.sessions['H27-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '1/2');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '-1/2');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
