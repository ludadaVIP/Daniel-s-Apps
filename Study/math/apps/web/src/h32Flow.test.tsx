// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntegralLab, IntegralHookArt } from './IntegralLabs';
import { h32Lessons } from './content/H32';
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
describe('H32 investigations and preserved evidence', () => {
  it('keeps added-volume and average predictions while initial water or the view changes', () => {
    render(<IntegralLab kind="integral-accumulation" mode="en" />);
    enter('Added litres', '8');
    enter('Average rate (L/min)', '16/5');
    check('Added litres');
    matched('Added litres');
    enter('Actual litres', '8');
    select('Initial litres', '5');
    expect(field('Added litres')).toBe('8');
    expect(field('Actual litres')).toBe('');
    expect(field('Average rate (L/min)')).toBe('16/5');
    select('Plot role', 'amount');
    expect(field('Added litres')).toBe('8');
    select('End time', '0');
    enter('Average rate (L/min)', 'undefined');
    check('Average rate (L/min)');
    matched('Average rate (L/min)');
  });
  it('keeps mesh when tags change and audits actual nonuniform width products', () => {
    const v = render(<IntegralLab kind="integral-riemann" mode="en" />);
    enter('Weighted Riemann sum', '21/8');
    check('Weighted Riemann sum');
    matched('Weighted Riemann sum');
    enter('Mesh', '1/2');
    select('Tag rule', 'left');
    expect(field('Weighted Riemann sum')).toBe('');
    expect(field('Mesh')).toBe('1/2');
    select('Partition', 'custom');
    select('Tag rule', 'middle');
    enter('Weighted Riemann sum', '163/64');
    check('Weighted Riemann sum');
    matched('Weighted Riemann sum');
    click('Show/hide audit');
    expect(screen.getByText('75/256')).toBeTruthy();
    const intervals = [...v.container.querySelectorAll('polygon')].map((e) =>
      e.getAttribute('data-interval'),
    );
    expect(intervals).toEqual(['0,0.25', '0.25,1', '1,2']);
  });
  it('preserves a full-family response across display translations, but resets changed conditions', () => {
    render(<IntegralLab kind="integral-primitive" mode="en" />);
    enter('Full expression (include C)', 'x^3-4x+2C+5');
    check('Full expression (include C)');
    matched('Full expression (include C)');
    select('Displayed constant only', '5');
    expect(field('Full expression (include C)')).toBe('x^3-4x+2C+5');
    select('Primitive task', 'initial');
    expect(field('Expression satisfying the initial value')).toBe('');
    enter('Expression satisfying the initial value', 'x^3-4x+7');
    check('Expression satisfying the initial value');
    expect(screen.getByRole('status').textContent).toContain('Differentiate');
    enter('Expression satisfying the initial value', 'x^3-4x+5');
    check('Expression satisfying the initial value');
    matched('Expression satisfying the initial value');
  });
  it('preserves geometric area under bound reversal and represents a zero-length interval', () => {
    const v = render(<IntegralLab kind="integral-signed" mode="en" />);
    enter('Signed definite integral', '3/2');
    enter('Total geometric area', '5/2');
    select('Ordered bounds', '3,0');
    expect(field('Total geometric area')).toBe('5/2');
    expect(field('Signed definite integral')).toBe('');
    enter('Signed definite integral', '-3/2');
    check('Signed definite integral');
    matched('Signed definite integral');
    select('Ordered bounds', '2,2');
    expect(v.container.querySelectorAll('polygon')).toHaveLength(0);
    enter('Signed definite integral', '0');
    check('Signed definite integral');
    matched('Signed definite integral');
  });
  it('keeps local derivative under a changed fixed lower bound and rejects the step jump derivative', () => {
    render(<IntegralLab kind="integral-ftc" mode="en" />);
    enter('A′(x) (DNE if nonexistent)', '1');
    enter('Value of A(x)', '0');
    select('Fixed lower bound a', '0');
    expect(field('A′(x) (DNE if nonexistent)')).toBe('1');
    expect(field('Value of A(x)')).toBe('');
    select('k in upper limit kx', '2');
    enter('A′(x) (DNE if nonexistent)', '8');
    check('A′(x) (DNE if nonexistent)');
    matched('A′(x) (DNE if nonexistent)');
    select('Integrand', 'step');
    select('k in upper limit kx', '1');
    enter('A′(x) (DNE if nonexistent)', 'DNE');
    check('A′(x) (DNE if nonexistent)');
    matched('A′(x) (DNE if nonexistent)');
    click('Show/hide audit');
    expect(screen.getByText('Left slope')).toBeTruthy();
  });
  it('separates initial states and three unsigned pieces between crossing curves', () => {
    render(<IntegralLab kind="integral-applications" mode="en" />);
    enter('Signed total (m)', '5/2');
    enter('Total distance (m)', '13/2');
    enter('Final state (m)', '25/2');
    select('Initial state', '5');
    expect(field('Signed total (m)')).toBe('5/2');
    expect(field('Total distance (m)')).toBe('13/2');
    expect(field('Final state (m)')).toBe('');
    select('Application model', 'between');
    select('Interval setting', 'yes');
    enter('Geometric area (m²)', '4');
    check('Geometric area (m²)');
    matched('Geometric area (m²)');
    select('Area view', 'gap');
    expect(field('Geometric area (m²)')).toBe('4');
    click('Show/hide audit');
    expect(screen.getAllByText('4/3').length).toBeGreaterThanOrEqual(3);
  });
  it('renders six meaningful hooks and both examples on every actual reading route', () => {
    for (const l of h32Lessons) {
      const art = render(
        <IntegralHookArt
          kind={l.lab as Parameters<typeof IntegralHookArt>[0]['kind']}
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
  it('restores six supported guided answers without completing unfinished lessons', () => {
    for (const [id, answer] of [
      ['H32-L01', '8'],
      ['H32-L02', '21/8'],
      ['H32-L03', 'x^3-4x+C'],
      ['H32-L04', '3/2'],
      ['H32-L05', '4'],
      ['H32-L06', '13/2'],
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
  it('records eight unit items, requiring explicit human review for the theorem and application arguments', () => {
    const v = mount('/math/unit/H32/check');
    ['8', '21/8', 'x^3-4x+C', '3/2', '4', '13/2'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: A difference quotient is a shrinking-interval average; continuity makes it approach f(x). For upper2x multiply by2. Fixed lower bounds change only constants; one primitive gives F(b)-F(a). Step rates at1 have left/right slopes2/4, so A is continuous but not differentiable there.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: Integrating velocity t-2 over0..5 gives displacement5/2 m and split absolute contributions give distance13/2 m. Initial10 gives final25/2 m. Inflow2t over0..3 adds9 L; initial5 and no outflow give14 L. For curves2x and x² on-1..3 split at0/2 and sum three areas4/3 to give4 m², rather than signed-4/3.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H32/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H32-L01'],
    ).toBeUndefined();
  });
  it('changes a due accumulation retrieval without inheriting its old expression or success', () => {
    const v = mount('/math/lesson/H32-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '11');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '5/2');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H32-L01'].round).toBe(1);
    saved.sessions['H32-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '5/2');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '7/2');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
