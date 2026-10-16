// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FactorLab, FactorHookArt } from './FactorLabs';
import { App } from './App';
import { j82Lessons } from './content/J82';
import { STORAGE_KEY } from './progress';
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
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const verify = (name: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name })).getByRole('button', {
      name: 'Check my result',
    }),
  );
const feedback = (name: string) =>
  within(screen.getByRole('group', { name })).getByRole('status', {
    name: 'Factor feedback',
  }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
const name = 'My product of factors';
describe('J82 structural factorisation workshops', () => {
  it('distinguishes a nongreatest common factor from a greatest one and an excessive extraction', () => {
    const v = render(<FactorLab kind="factor-common" mode="en" />);
    click('Test common factor 3x');
    expect(
      screen.getByRole('status', { name: 'Common-factor observation' })
        .textContent,
    ).toContain('common factor remains');
    click('Test common factor 6x');
    expect(
      screen.getByRole('status', { name: 'Common-factor observation' })
        .textContent,
    ).toContain('greatest numerical');
    click('Test common factor 6x^2');
    expect(
      screen.getByRole('status', { name: 'Common-factor observation' })
        .textContent,
    ).toContain('not an integer monomial');
    enter(name, '3x(2x+4)');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '6x(x+2)');
    verify(name);
    expect(feedback(name)).toContain('match');
    click('Show or hide term remainders');
    expect(
      v.container.querySelectorAll('[data-common-remainder]'),
    ).toHaveLength(2);
    expect(field(name)).toBe('6x(x+2)');
  });
  it('resets old remainder and candidate evidence while accepting balanced signs and two letters', () => {
    const v = render(<FactorLab kind="factor-common" mode="en" />);
    click('Test common factor 6x');
    click('Show or hide term remainders');
    enter(name, '6x(x+2)');
    choose('Common-factor experiment', '1');
    expect(field(name)).toBe('');
    expect(
      v.container.querySelectorAll('[data-common-remainder]'),
    ).toHaveLength(0);
    expect(
      screen.queryByRole('status', { name: 'Common-factor observation' }),
    ).toBeNull();
    enter(name, '3x(3-2x)');
    verify(name);
    expect(feedback(name)).toContain('match');
    choose('Common-factor experiment', '2');
    enter(name, '4xy(2x-3y)');
    verify(name);
    expect(feedback(name)).toContain('match');
  });
  it('requires continued difference-of-squares factoring rather than just two equivalent brackets', () => {
    const v = render(<FactorLab kind="factor-difference" mode="en" />);
    enter(name, '(x-3)^2');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '(x+3)(x-3)');
    verify(name);
    expect(feedback(name)).toContain('match');
    choose('Difference-of-squares experiment', '2');
    expect(field(name)).toBe('');
    click('Show or hide the first step');
    expect(
      v.container.querySelector('[data-first-factor-step]')!.textContent,
    ).toContain('(x²−4)(x²+4)');
    enter(name, '(x²-4)(x²+4)');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '(x²+4)(x+2)(x-2)');
    verify(name);
    expect(feedback(name)).toContain('match');
  });
  it('withdraws the factor task for a sum of squares and retains outside numerical content when factoring', () => {
    const v = render(<FactorLab kind="factor-difference" mode="en" />);
    choose('Difference-of-squares experiment', '4');
    expect(screen.queryByRole('textbox', { name })).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Structure observation' }).textContent,
    ).toContain('sum of squares');
    expect(v.container.querySelectorAll('[data-area-cell]')).toHaveLength(0);
    choose('Difference-of-squares experiment', '3');
    enter(name, '2(x²-9)');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '2(x-3)(x+3)');
    verify(name);
    expect(feedback(name)).toContain('match');
  });
  it('checks the middle coefficient before offering a perfect-square factor answer', () => {
    render(<FactorLab kind="factor-square" mode="en" />);
    enter(name, 'x²+6x+9');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '(x+3)^2');
    verify(name);
    expect(feedback(name)).toContain('match');
    click('Compare both candidate squares');
    expect(screen.getByText('(x−3)² = x² − 6x + 9')).toBeTruthy();
    slide('Middle coefficient m', '4');
    expect(screen.queryByRole('textbox', { name })).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Structure observation' }).textContent,
    ).toContain('does not match');
    expect(screen.queryByText('(x−3)² = x² − 6x + 9')).toBeNull();
    slide('Middle coefficient m', '-6');
    expect(field(name)).toBe('');
    enter(name, '(3-x)²');
    verify(name);
    expect(feedback(name)).toContain('match');
  });
  it('checks both product and sum, reveals complete integer pairs and accepts reordered factors', () => {
    const v = render(<FactorLab kind="factor-quadratic" mode="en" />);
    expect(v.container.querySelectorAll('[data-area-cell]')).toHaveLength(0);
    enter('First integer r', '1');
    enter('Second integer s', '6');
    click('Check my pair');
    expect(
      screen.getByRole('status', { name: 'Pair feedback' }).textContent,
    ).toContain('sum 7, target 5');
    enter('First integer r', '2');
    enter('Second integer s', '3');
    click('Check my pair');
    expect(
      screen.getByRole('status', { name: 'Pair feedback' }).textContent,
    ).toContain('Both conditions match');
    click('Show or hide integer product pairs');
    expect(v.container.querySelectorAll('[data-area-cell]')).toHaveLength(4);
    expect(v.container.querySelectorAll('[data-integer-pair]')).toHaveLength(4);
    expect(v.container.querySelectorAll('[data-pair-hit="true"]')).toHaveLength(
      1,
    );
    enter(name, '(x+3)(x+2)');
    verify(name);
    expect(feedback(name)).toContain('match');
  });
  it('states a missing-integer-pair conclusion within scope and handles zero constant without an infinite list', () => {
    const v = render(<FactorLab kind="factor-quadratic" mode="en" />);
    enter('First integer r', '2');
    slide('Linear coefficient p', '1');
    slide('Constant q', '1');
    expect(field('First integer r')).toBe('');
    expect(screen.queryByRole('textbox', { name })).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Integer-scope observation' })
        .textContent,
    ).toContain('not a claim about every other number domain');
    slide('Linear coefficient p', '4');
    slide('Constant q', '0');
    enter(name, 'x(x+4)');
    verify(name);
    expect(feedback(name)).toContain('match');
    click('Show or hide integer product pairs');
    expect(v.container.querySelectorAll('[data-integer-pair]')).toHaveLength(1);
    expect(screen.getByText(/infinitely many product-zero pairs/)).toBeTruthy();
  });
  it('uses coefficients to reveal an incorrect middle despite agreement at zero and clears edited evidence', () => {
    const v = render(<FactorLab kind="factor-check" mode="en" />);
    click('Expand my proposal');
    expect(
      v.container.querySelector('[data-proposal-expansion]')!.textContent,
    ).toBe('x^2 + 7x + 6');
    expect(
      screen.getByRole('status', { name: 'Expansion-check feedback' })
        .textContent,
    ).toContain('coefficients differ');
    click('Test x=0');
    expect(
      screen.getByRole('status', { name: 'Substitution observation' })
        .textContent,
    ).toContain('source 6, proposal 6');
    click('Test x=1');
    expect(
      screen.getByRole('status', { name: 'Substitution observation' })
        .textContent,
    ).toContain('source 12, proposal 14');
    enter('Proposed factorisation', '(x+2)(x+3)');
    expect(v.container.querySelector('[data-proposal-expansion]')).toBeNull();
    expect(
      screen.queryByRole('status', { name: 'Substitution observation' }),
    ).toBeNull();
    click('Expand my proposal');
    expect(
      screen.getByRole('status', { name: 'Expansion-check feedback' })
        .textContent,
    ).toContain('complete');
  });
  it('separates unfinished equivalence from completed factor and expansion tasks in the same experiment', () => {
    render(<FactorLab kind="factor-check" mode="en" />);
    choose('Expansion-check experiment', '2');
    click('Expand my proposal');
    expect(
      screen.getByRole('status', { name: 'Expansion-check feedback' })
        .textContent,
    ).toContain('unfinished');
    enter(name, '2x(x+2)');
    verify(name);
    expect(feedback(name)).toContain('match');
    enter('My expanded check', '2x(x+2)');
    verify('My expanded check');
    expect(feedback('My expanded check')).toContain('Already equivalent');
    enter('My expanded check', '2x²+4x');
    verify('My expanded check');
    expect(feedback('My expanded check')).toContain('match');
    enter('Proposed factorisation', 'x/0');
    click('Expand my proposal');
    expect(
      screen.getByRole('status', { name: 'Expansion-check feedback' })
        .textContent,
    ).toContain('outside the supported grammar');
  });
  it('keeps five opening investigations as questions', () => {
    for (const l of j82Lessons) {
      const v = render(
        <FactorHookArt
          kind={l.lab as Parameters<typeof FactorHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J82 complete lesson and persistence flows', () => {
  it('renders every English body and both bilingual sections with two full examples each', () => {
    for (const l of j82Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J82-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries across all five lessons without completing unfinished practice', () => {
    for (const [id, wrong, right] of [
      ['J82-L01', '3x(2x+4)', '6x(x+2)'],
      ['J82-L02', '(x-3)²', '(x+3)(x-3)'],
      ['J82-L03', '(x-3)²', '(x+3)²'],
      ['J82-L04', '(x+1)(x+6)', '(x+3)(x+2)'],
      ['J82-L05', '2(x²-9)', '2(x+3)(x-3)'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/04 Together/);
      enter('Your answer', wrong!);
      check();
      enter('Your answer', right!);
      check();
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(right);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('treats a stopped but equivalent factorisation as a form retry and saves the complete three-factor representation', () => {
    const v = mount('/math/lesson/J82-L02');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '(x²-4)(x²+4)');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '(x²+4)(x+2)(x-2)');
    check();
    v.unmount();
    mount('/math/lesson/J82-L02');
    expect(field('Your answer')).toBe('(x²+4)(x+2)(x-2)');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('accepts balanced reversed signs in a repeated factor and restores the original Unicode writing', () => {
    const v = mount('/math/lesson/J82-L03');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '（y−x）²');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J82-L03');
    expect(field('Your answer')).toBe('（y−x）²');
  });
  it('keeps reasoning human-reviewed and leaves unworked lessons incomplete', () => {
    mount('/math/lesson/J82-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'The proposal and source agree at zero but differ at one. Expanding gives middle coefficient seven instead of five. Separately, 2(x²-9) expands correctly but needs further conjugate factors. Integer scope and complete factor structure must both be checked. This is not solving for roots or cancelling away zero.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J82-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records eight independent unit-check tasks with factorisation, expansion and parent reasoning saved separately', () => {
    const v = mount('/math/unit/J82/check');
    for (const [n, input] of Object.entries({
      1: '6x(2x+3)',
      2: '(x+4)(x-4)',
      3: '(x-5)²',
      4: '(x-2)(x+4)',
      5: '2x(x+2)(x-2)',
      6: 'x²-x-6',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Extract common content first, recognise formula structure, and match both product and sum for monic quadratics. Expand all factors and compare every coefficient. A matching expansion can still be unfinished. Integer scope is explicit; numerical agreement at one input is insufficient.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J82/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J82-L05'],
    ).toBeUndefined();
  });
  it('changes quadratic retrieval factors and clears preceding input and success', () => {
    const v = mount('/math/lesson/J82-L04');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '(x-3)(x+2)');
    check();
    enter('Your answer', '(x+3)(x-2)');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '(x-4)²');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J82-L04'].round).toBe(1);
    saved.sessions['J82-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(x-3)(x-4)');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
