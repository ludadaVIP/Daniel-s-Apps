// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  AdvancedEquationLab,
  AdvancedEquationHookArt,
} from './AdvancedEquationLabs';
import { h35Lessons } from './content/H35';
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
describe('H35 domains, original equations and durable learning evidence', () => {
  it('audits composition order, branches and rejected intermediate inputs', () => {
    const v = render(
      <AdvancedEquationLab kind="equation-composition" mode="en" />,
    );
    enter('H(x)=f(g(x))', '9');
    check('H(x)=f(g(x))');
    matched('H(x)=f(g(x))');
    enter('Domain of H', '[-1,∞)');
    check('Domain of H');
    matched('Domain of H');
    enter('All preimages of 9 under H', '{2}');
    check('All preimages of 9 under H');
    matched('All preimages of 9 under H');
    select('Input x', '-2');
    expect(field('Domain of H')).toBe('[-1,∞)');
    enter('H(x)=f(g(x))', 'outside-domain');
    check('H(x)=f(g(x))');
    matched('H(x)=f(g(x))');
    select('Domain branch of f', 'whole');
    expect(field('Domain of H')).toBe('');
    enter('All preimages of 9 under H', '{-4,2}');
    check('All preimages of 9 under H');
    matched('All preimages of 9 under H');
    expect(
      v.container.querySelectorAll('[data-function-curve^="inverse-"]'),
    ).toHaveLength(2);
    click('Show/hide audit');
    expect(screen.getByText('not-invertible')).toBeTruthy();
  });
  it('retains separate positive arguments while exponential and negative-log equations remain exact', () => {
    const v = render(
      <AdvancedEquationLab kind="equation-logarithms" mode="en" />,
    );
    enter('Complete original solution set', '{-3,3}');
    check('Complete original solution set');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Complete original solution set', '{3}');
    check('Complete original solution set');
    matched('Complete original solution set');
    select('Product example h', '3');
    expect(field('Complete original solution set')).toBe('');
    enter('Original domain', '(3,∞)');
    check('Original domain');
    matched('Original domain');
    select('Equation family', 'logarithm');
    select('Base b', '3');
    select('Shift h', '-1');
    select('Target exponent k', '-2');
    enter('Complete original solution set', '{-8/9}');
    check('Complete original solution set');
    matched('Complete original solution set');
    const points = v.container
      .querySelector('[data-function-curve="original LHS"]')!
      .getAttribute('points')!;
    expect(points).not.toContain('NaN');
    expect(points).not.toContain('Infinity');
  });
  it('preserves original holes while the polynomial rewrite has extended values', () => {
    const v = render(
      <AdvancedEquationLab kind="equation-identities" mode="en" />,
    );
    enter('Simplified result (only c)', '1+c');
    check('Simplified result (only c)');
    matched('Simplified result (only c)');
    enter('Excluded angles in [0,2π] (multiples of pi)', '0,2pi');
    check('Excluded angles in [0,2π] (multiples of pi)');
    matched('Excluded angles in [0,2π] (multiples of pi)');
    enter('Probe belongs to original domain', 'out');
    check('Probe belongs to original domain');
    matched('Probe belongs to original domain');
    select('Probe angle θ/π', '1/6');
    expect(field('Simplified result (only c)')).toBe('1+c');
    expect(field('Probe belongs to original domain')).toBe('');
    select('Identity example', 'tangent');
    expect(
      [...v.container.querySelectorAll('[data-excluded-angle]')].map((el) =>
        el.getAttribute('data-excluded-angle'),
      ),
    ).toEqual(['0.5', '1.5']);
    select('Probe angle θ/π', '1/2');
    click('Show/hide audit');
    expect(screen.getByText('outside-domain')).toBeTruthy();
  });
  it('derives reciprocal horizontal mapping and handles every zero-parameter case', () => {
    const v = render(
      <AdvancedEquationLab kind="equation-parameters" mode="en" />,
    );
    enter('x corresponding to source input u', '3/2');
    check('x corresponding to source input u');
    matched('x corresponding to source input u');
    enter('Polynomial for G', '8x^2-12x+3');
    check('Polynomial for G');
    matched('Polynomial for G');
    expect(v.container.querySelector('[data-coordinate="1.5,3"]')).toBeTruthy();
    select('Parameter a', '1');
    expect(field('x corresponding to source input u')).toBe('3/2');
    expect(field('Polynomial for G')).toBe('');
    select('Parameter b', '0');
    enter('x corresponding to source input u', 'outside-domain');
    check('x corresponding to source input u');
    matched('x corresponding to source input u');
    select('Parameter u', '0');
    enter('x corresponding to source input u', 'undetermined');
    check('x corresponding to source input u');
    matched('x corresponding to source input u');
    enter('Polynomial for G', '-1');
    check('Polynomial for G');
    matched('Polynomial for G');
  });
  it('requires complete sets and distinguishes sign failure, holes, coincident roots and lost zero', () => {
    render(<AdvancedEquationLab kind="equation-solutions" mode="en" />);
    enter('Complete real solution set', '{-1,2}');
    check('Complete real solution set');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Complete real solution set', '{2}');
    check('Complete real solution set');
    matched('Complete real solution set');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Candidate-by-candidate audit' })
        .textContent,
    ).toContain('-1truefalse1-1false');
    select('Audit family', 'rational');
    enter('Complete real solution set', '∅');
    check('Complete real solution set');
    matched('Complete real solution set');
    select('Audit family', 'absolute');
    expect(
      (
        screen.getByRole('combobox', {
          name: 'Right-side case',
        }) as HTMLSelectElement
      ).value,
    ).toBe('other');
    enter('Complete real solution set', '{-1,3}');
    check('Complete real solution set');
    matched('Complete real solution set');
    select('Right-side case', 'zero');
    enter('Complete real solution set', '{1}');
    check('Complete real solution set');
    matched('Complete real solution set');
    select('Right-side case', 'negative');
    enter('Complete real solution set', '{}');
    check('Complete real solution set');
    matched('Complete real solution set');
    select('Audit family', 'product');
    enter('Complete real solution set', '{0,3}');
    check('Complete real solution set');
    matched('Complete real solution set');
  });
  it('renders meaningful hooks and both complete examples on all five actual reading routes', () => {
    for (const l of h35Lessons) {
      const art = render(
        <AdvancedEquationHookArt
          kind={l.lab as Parameters<typeof AdvancedEquationHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      expect(art.container.querySelector('foreignObject')).toBeNull();
      if (l.id === 'H35-L01')
        expect(
          art.container.querySelectorAll('[data-function-curve^="inverse-"]'),
        ).toHaveLength(2);
      if (l.id === 'H35-L03')
        expect(
          art.container.querySelectorAll('[data-excluded-angle]'),
        ).toHaveLength(2);
      if (l.id === 'H35-L04')
        expect(
          art.container.querySelector('[data-coordinate="1.5,3"]'),
        ).toBeTruthy();
      if (l.id === 'H35-L05')
        expect(
          art.container.querySelector('[data-coordinate="2,2"]'),
        ).toBeTruthy();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores all five supported guided answers without completing unfinished practice', () => {
    for (const [id, answer] of [
      ['H35-L01', '[-1,∞)'],
      ['H35-L02', '{3}'],
      ['H35-L03', '1+c'],
      ['H35-L04', '3/2'],
      ['H35-L05', '{2}'],
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
  it('restores the original identity argument only after explicit human review', () => {
    const v = mount('/math/lesson/H35-L03');
    click(/^06 Reflect/);
    const report =
      'Engineering example: s²=(1−c)(1+c), so cancel only when 1−c is nonzero. The original excludes θ=2kπ. At zero its quotient is undefined, although the extension is two. Preserve the domain and justify all angles symbolically; a few graph samples are not a proof.';
    enter('Your reasoning', report);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H35-L03']
        .answers['H35-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H35-L03');
    expect(field('Your reasoning')).toBe(report);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records five constructed items and three independent human reports, preserving them across refresh', () => {
    const v = mount('/math/unit/H35/check');
    ['[-1,∞)', '{3}', '1+c', '3/2', '{2}'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    const reports = [
      'Engineering example: On all reals the square is not injective. Restrict u≥0 or u≤0, giving selected ±√y branches with y≥0. H=f∘g is undone by reversing order; for g=x+1 the selected inverse is ±√y−1, not a reciprocal.',
      'Engineering example: Factor s²=(1−c)(1+c), cancel only when 1−c≠0, and exclude θ=2kπ. The extension gives two at zero; the original is undefined. Graph sampling does not prove an identity for every allowed angle.',
      'Engineering example: sqrt(x+2)=x has squared candidates −1 and 2; −1 is defined but gives 1≠−1. The rational candidate two lies at an excluded hole, so its solution set is empty. In x(x−3)=0 retain both zero and three. State domains, all candidates, original substitution and completeness.',
    ];
    reports.forEach((report, i) => {
      click(`Question ${i + 6}`);
      enter('Your reasoning', report);
      expect(screen.getByText(new RegExp(`Recorded ${i + 5}/8`))).toBeTruthy();
      parent();
    });
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H35/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H35-L01'],
    ).toBeUndefined();
  });
  it('changes due domain retrievals without inheriting the previous set or success', () => {
    const v = mount('/math/lesson/H35-L05');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '{}');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '{3}');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H35-L05'].round).toBe(1);
    saved.sessions['H35-L05'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '{3}');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '{4}');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
