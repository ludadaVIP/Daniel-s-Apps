// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AnalysisLab, AnalysisHookArt } from './FunctionAnalysisLabs';
import { h26Lessons } from './content/H26';
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
describe('H26 function investigations, human review and independent records', () => {
  it('uses interval signs instead of height, keeps unrelated predictions and handles the corner', () => {
    const v = render(<AnalysisLab kind="analysis-sign" mode="en" />);
    const b = 'Predict interval behaviour',
      d = 'Predict derivative value at a';
    enter(b, 'increasing');
    check(b);
    matched(b);
    enter(d, '0');
    check(d);
    matched(d);
    select('Interval to classify', '1');
    expect(field(b)).toBe('');
    expect(field(d)).toBe('0');
    enter(b, 'decreasing');
    check(b);
    matched(b);
    click('Change display window');
    expect(field(b)).toBe('decreasing');
    select('Function family', 'cubic-flat');
    enter(d, '0');
    check(d);
    matched(d);
    enter(b, 'increasing');
    check(b);
    matched(b);
    select('Function family', 'corner');
    enter(d, 'undefined');
    check(d);
    matched(d);
    expect(
      v.container.querySelector('[data-function-curve="f-prime"]'),
    ).toBeNull();
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Interval sign audit' }),
    ).toBeTruthy();
  });
  it('distinguishes a local maximum from an endpoint maximum, ties and strict constant conventions', () => {
    render(<AnalysisLab kind="analysis-extrema" mode="en" />);
    const c = 'Predict strict local classification',
      g = 'Predict closed-interval maximum value';
    enter(c, 'local-max');
    check(c);
    matched(c);
    enter(g, '18');
    check(g);
    matched(g);
    select('Closed right endpoint, left fixed at −2', '2');
    expect(field(c)).toBe('local-max');
    expect(field(g)).toBe('');
    enter(g, '2');
    check(g);
    matched(g);
    click('Show/hide audit');
    expect(screen.getByText(/maximum 2 at -1, 2/)).toBeTruthy();
    select('Function family', 'cubic-flat');
    enter(c, 'neither');
    check(c);
    matched(c);
    select('Function family', 'corner');
    enter(c, 'local-min');
    check(c);
    matched(c);
    select('Function family', 'constant');
    enter(c, 'neither');
    check(c);
    matched(c);
    expect(screen.getByText(/every point of the closed interval/)).toBeTruthy();
  });
  it('checks equivalent product derivatives and preserves the full expression when only evaluation changes', () => {
    render(<AnalysisLab kind="analysis-product" mode="en" />);
    const p = 'Predict full derivative',
      r = 'Predict rate at a';
    enter(p, '2x(x-2)+x^2+1');
    check(p);
    matched(p);
    enter(r, '0');
    check(r);
    matched(r);
    select('Evaluation input a', '2');
    expect(field(p)).toBe('2x(x-2)+x^2+1');
    expect(field(r)).toBe('');
    enter(r, '5');
    check(r);
    matched(r);
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Differentiation structure audit' }),
    ).toBeTruthy();
    select('Product rule', '2');
    enter(p, '10x');
    check(p);
    matched(p);
    select('Product rule', '3');
    enter(p, '4x^3');
    check(p);
    matched(p);
  });
  it('keeps inner value, outer derivative and inner rate separate including constant and zero-rate inners', () => {
    render(<AnalysisLab kind="analysis-chain" mode="en" />);
    const p = 'Predict full derivative',
      r = 'Predict rate at a';
    enter(p, '3(2x+1)^2');
    check(p);
    expect(
      screen.getByRole('status', { name: `${p} feedback` }).textContent,
    ).not.toContain('matches');
    enter(p, '24x^2+24x+6');
    check(p);
    matched(p);
    enter(r, '54');
    check(r);
    matched(r);
    select('Evaluation input a', '0');
    expect(field(p)).toBe('24x^2+24x+6');
    expect(field(r)).toBe('');
    select('Composite rule', '1');
    enter(p, '4x(x^2+1)');
    check(p);
    matched(p);
    enter(r, '0');
    check(r);
    matched(r);
    select('Composite rule', '3');
    enter(p, '0');
    check(p);
    matched(p);
    click('Show/hide audit');
    expect(screen.getByText('g′(0)')).toBeTruthy();
  });
  it('rejects unsupported physical extrapolation without denying algebraic evaluation, and keeps speed nonnegative', () => {
    const v = render(<AnalysisLab kind="analysis-rates" mode="en" />);
    const r = 'Predict in-domain rate (m/s)',
      s = 'Predict speed (m/s)';
    enter(r, '-2');
    check(r);
    matched(r);
    enter(s, '2');
    check(s);
    matched(s);
    select('Time t (seconds)', '3');
    expect(field(r)).toBe('');
    expect(field(s)).toBe('2');
    enter(r, '2');
    check(r);
    matched(r);
    select('Fictional model', 'area');
    const a = 'Predict in-domain rate (m²/s)';
    select('Time t (seconds)', '1');
    enter(a, '12');
    check(a);
    matched(a);
    select('Time t (seconds)', '4');
    enter(a, 'undefined');
    check(a);
    matched(a);
    expect(v.container.querySelector('[data-function-point="A"]')).toBeNull();
    expect(screen.getByText(/Time is outside the model domain/)).toBeTruthy();
    click('Show/hide audit');
    expect(screen.getByText('36')).toBeTruthy();
    const samples = v.container
      .querySelector('[data-function-curve="model-domain"]')
      ?.getAttribute('points');
    expect(samples).toBeTruthy();
  });
  it('renders five lesson-specific hooks and both worked examples in the actual reading route', () => {
    for (const l of h26Lessons) {
      const art = render(
        <AnalysisHookArt
          kind={l.lab as Parameters<typeof AnalysisHookArt>[0]['kind']}
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
  it('restores supported guided answers without granting unworked lesson mastery', () => {
    for (const [id, answer] of [
      ['H26-L01', 'decreasing'],
      ['H26-L02', 'local-max'],
      ['H26-L03', '3x^2-4x+1'],
      ['H26-L04', '6(2x+1)^2'],
      ['H26-L05', '-2'],
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
  it('requires human review of the extremum argument and restores its original text', () => {
    const v = mount('/math/lesson/H26-L02');
    click(/^06 Reflect/);
    const text =
      'Engineering example: x^3 has zero slope at zero without an extremum. |x| has a strict minimum at zero without a derivative. On [-2,3], x^3-3x has absolute maximum 18 at 3 and minimum -2 at -2 and 1. Endpoints, differentiability and strict interior classification must be distinguished.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H26-L02']
        .answers['H26-L02-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H26-L02');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('changes the due retrieval without inheriting the preceding answer or success', () => {
    const v = mount('/math/lesson/H26-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '9');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'decreasing');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H26-L01'].round).toBe(1);
    saved.sessions['H26-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', 'decreasing');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', 'increasing');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('saves all eight unit tasks including two parent-reviewed arguments without awarding lesson mastery', () => {
    const v = mount('/math/unit/H26/check');
    ['decreasing', 'local-max', '3x^2-4x+1', '6(2x+1)^2', '-2'].forEach(
      (answer, i) => {
        click(`Question ${i + 1}`);
        enter('Your answer', answer);
        click(/Check answer/);
      },
    );
    click('Question 6');
    click(/Not differentiable, with a strict local minimum/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: x^3 has zero derivative at zero but no extremum. |x| has a strict minimum at its nondifferentiable corner. On [-2,3], the cubic has maximum 18 at endpoint 3, minimum -2 at -2 and 1. Stationarity is only necessary for differentiable interior extrema, not sufficient.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: side 1+2t m is valid for 0<=t<=3 s. At one, side is 3 m, area 9 m², area rate 2*3*2=12 m²/s. The units m times m/s give m²/s. Minus one produces a negative side and ten is outside the authorised domain; algebraic evaluation cannot establish contextual behaviour.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H26/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H26-L01'],
    ).toBeUndefined();
  });
});
