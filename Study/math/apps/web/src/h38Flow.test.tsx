// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CapstoneLab, CapstoneHookArt } from './CapstoneLabs';
import { h38Lessons } from './content/H38';
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

describe('H38 modelling, independent validation and durable capstone evidence', () => {
  it('retains inflow when capacity changes but recomputes spill, closing storage and zero-capacity geometry', () => {
    const v = render(<CapstoneLab kind="capstone-model" mode="en" />);
    enter('Collected inflow before storage/L', '90');
    check('Collected inflow before storage/L');
    matched('Collected inflow before storage/L');
    enter('Daily overflow/L', '30');
    check('Daily overflow/L');
    matched('Daily overflow/L');
    enter('Daily closing storage/L', '30');
    check('Daily closing storage/L');
    matched('Daily closing storage/L');
    select('Tank capacity/L', '90');
    expect(field('Collected inflow before storage/L')).toBe('90');
    expect(field('Daily overflow/L')).toBe('');
    enter('Daily closing storage/L', '60');
    check('Daily closing storage/L');
    matched('Daily closing storage/L');
    select('Tank capacity/L', '0');
    enter('Daily closing storage/L', '0');
    check('Daily closing storage/L');
    matched('Daily closing storage/L');
    expect(v.container.querySelector('svg rect')?.getAttribute('height')).toBe(
      '0',
    );
    expect(v.container.innerHTML).not.toContain('NaN');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Daily water ledger' }).textContent,
    ).toContain('30');
  });
  it('holds validation back until revealed, preserves signed residuals and distinguishes fitting a revision from fresh validation', () => {
    const v = render(<CapstoneLab kind="capstone-validation" mode="en" />);
    expect(
      v.container.querySelectorAll('[data-capture-set="validation"]'),
    ).toHaveLength(0);
    expect(
      screen.queryByRole('textbox', { name: 'Signed residual at 8 mm/L' }),
    ).toBeNull();
    enter('Model prediction at 8 mm/L', '120');
    check('Model prediction at 8 mm/L');
    matched('Model prediction at 8 mm/L');
    click('Show/hide validation data');
    expect(
      v.container.querySelectorAll('[data-capture-set="validation"]'),
    ).toHaveLength(2);
    enter('Signed residual at 8 mm/L', '15');
    check('Signed residual at 8 mm/L');
    expect(
      screen.getByRole('status', { name: 'Signed residual at 8 mm/L feedback' })
        .textContent,
    ).not.toContain('matches');
    enter('Signed residual at 8 mm/L', '-15');
    check('Signed residual at 8 mm/L');
    matched('Signed residual at 8 mm/L');
    enter('All validation points within 5 L (true/false)', 'false');
    check('All validation points within 5 L (true/false)');
    matched('All validation points within 5 L (true/false)');
    select('Candidate capture model', 'capped');
    expect(field('Model prediction at 8 mm/L')).toBe('');
    enter('All validation points within 5 L (true/false)', 'true');
    check('All validation points within 5 L (true/false)');
    matched('All validation points within 5 L (true/false)');
    expect(screen.getByText(/they become development data/)).toBeTruthy();
    click('Show/hide validation data');
    expect(
      v.container.querySelectorAll('[data-capture-set="validation"]'),
    ).toHaveLength(0);
  });
  it('compares the same full simulation calls and suppresses binary results for a nonmonotone budget predicate', () => {
    render(<CapstoneLab kind="capstone-efficiency" mode="en" />);
    enter('Actual binary predicate calls', '7');
    check('Actual binary predicate calls');
    matched('Actual binary predicate calls');
    enter('Actual linear predicate calls', '91');
    check('Actual linear predicate calls');
    matched('Actual linear predicate calls');
    select('Search predicate', 'budget-window');
    expect(
      screen.queryByRole('textbox', { name: 'Actual binary predicate calls' }),
    ).toBeNull();
    enter('Binary search justified (true/false)', 'false');
    check('Binary search justified (true/false)');
    matched('Binary search justified (true/false)');
    click('Show/hide audit');
    expect(screen.getAllByText('not justified')).toHaveLength(3);
    select('Search predicate', 'water');
    select('Maximum candidate capacity/L', '60');
    enter('Actual binary predicate calls', '5');
    check('Actual binary predicate calls');
    matched('Actual binary predicate calls');
    enter('Actual linear predicate calls', '61');
    check('Actual linear predicate calls');
    matched('Actual linear predicate calls');
    expect(screen.getAllByText('none')).toHaveLength(2);
  });
  it('separates sufficient and minimal candidates and supplies both a global bound and boundary counterexample', () => {
    render(<CapstoneLab kind="capstone-argument" mode="en" />);
    enter('Candidate supplies every day (true/false)', 'true');
    check('Candidate supplies every day (true/false)');
    matched('Candidate supplies every day (true/false)');
    enter('Candidate is minimal (true/false)', 'true');
    check('Candidate is minimal (true/false)');
    matched('Candidate is minimal (true/false)');
    select('Candidate for argument/L', '100');
    expect(field('Candidate supplies every day (true/false)')).toBe('true');
    expect(field('Candidate is minimal (true/false)')).toBe('');
    enter('Candidate is minimal (true/false)', 'false');
    check('Candidate is minimal (true/false)');
    matched('Candidate is minimal (true/false)');
    select('Candidate for argument/L', '89');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Candidate total deficit/L1');
  });
  it('requires complete catalog sets and keeps budget infeasibility distinct from a dry-spell supply failure', () => {
    const v = render(<CapstoneLab kind="capstone-project" mode="en" />);
    enter('All feasible catalog capacities', '{90}');
    check('All feasible catalog capacities');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('All feasible catalog capacities', '{100,100}');
    check('All feasible catalog capacities');
    matched('All feasible catalog capacities');
    select('Budget/toy credits', '200');
    expect(field('All feasible catalog capacities')).toBe('');
    enter('All feasible catalog capacities', '∅');
    check('All feasible catalog capacities');
    matched('All feasible catalog capacities');
    select('Required scenarios', 'both');
    select('Budget/toy credits', '280');
    enter('All feasible catalog capacities', '{120}');
    check('All feasible catalog capacities');
    matched('All feasible catalog capacities');
    select('Required scenarios', 'including-dry');
    select('Budget/toy credits', '360');
    enter('All feasible catalog capacities', '{}');
    check('All feasible catalog capacities');
    matched('All feasible catalog capacities');
    expect(
      v.container.querySelectorAll(
        '[data-project-capacity][data-water-ok="true"]',
      ),
    ).toHaveLength(0);
    expect(
      v.container.querySelectorAll('[data-project-capacity]'),
    ).toHaveLength(9);
  });
  it('renders five topic-specific hooks and both full examples on real reading routes', () => {
    for (const l of h38Lessons) {
      const art = render(
        <CapstoneHookArt
          kind={l.lab as Parameters<typeof CapstoneHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      expect(art.container.querySelector('foreignObject')).toBeNull();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores five supported guided answers without granting unfinished lessons mastery', () => {
    for (const [id, answer] of [
      ['H38-L01', '90'],
      ['H38-L02', '120'],
      ['H38-L03', '7'],
      ['H38-L04', '90'],
      ['H38-L05', '{100}'],
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
  it('preserves a full capstone report only after explicit human review, without keyword-based approval', () => {
    const v = mount('/math/lesson/H38-L05');
    click(/^06 Reflect/);
    const report =
      'Engineering review example: Use fictional A20 m², capture 3/4, initial zero, collection before use and cost 40+2C over catalog 0,20,…,160. Intersect all daily water constraints with budget. Nominal budget 240 yields {100}, cost 240; nominal plus high use needs at least 120, so budget 240 is infeasible and 280 yields {120}. Verify both ledgers and boundary sizes. The dry spell has only 90 L before four days need 120, so no capacity creates the missing 30. State units, data provenance, assumptions, full feasible set, minimal-cost argument, independent validation and limits; no all-weather promise.';
    enter('Your reasoning', report);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H38-L05']
        .answers['H38-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H38-L05');
    expect(field('Your reasoning')).toBe(report);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records five calculations and three independent reports, then restores all eight separately from lesson mastery', () => {
    const v = mount('/math/unit/H38/check');
    ['90', '120', '7', '90', '{100}'].forEach((a, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', a);
      click(/Check answer/);
    });
    const reports = [
      'Engineering review example: Calibration fits V=15r. Held-out residuals are 105−120=−15 and 100−150=−50, outside predeclared 5 L tolerance. The capped model gives 0 and −5, within tolerance, but these data become development data if used to revise it. Obtain fresh validation, retain units and avoid causal claims.',
      'Engineering review example: State nominal rainfall, roof20, capture3/4, demand30, initial zero and collection first. Only day one supplies the first three days, so capacity at least 90 is necessary. C90 closing stores 60,30,0,60,30 meet every demand, proving sufficiency; C89 misses one litre on day three. The result excludes catalog and budget and is not an all-weather guarantee.',
      'Engineering review example: Catalog0,20,…,160 and cost40+2C give nominal feasible {100} at budget240, cost240. Both nominal and high-use scenarios need120, so budget240 gives empty set and budget280 gives {120}. Use daily ledgers to verify sufficiency and necessity bounds to exclude smaller choices. The dry spell brings90 before demand120, so no larger empty tank repairs the deficit. State fictional data, units, timing, independent validation and limits.',
    ];
    reports.forEach((r, i) => {
      click(`Question ${i + 6}`);
      enter('Your reasoning', r);
      expect(screen.getByText(new RegExp(`Recorded ${i + 5}/8`))).toBeTruthy();
      parent();
    });
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H38/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H38-L01'],
    ).toBeUndefined();
  });
  it('changes retrieval conditions and clears the preceding answer and success on a new round', () => {
    const v = mount('/math/lesson/H38-L03');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '91');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '5');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H38-L03'].round).toBe(1);
    saved.sessions['H38-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '5');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '12');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
