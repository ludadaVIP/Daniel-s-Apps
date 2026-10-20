// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CalculusLab, CalculusHookArt } from './CalculusLabs';
import { h25Lessons } from './content/H25';
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
describe('H25 derivative investigations and independent learning records', () => {
  it('separates output change from average, retains constant-shift invariants and rejects a zero denominator', () => {
    const v = render(<CalculusLab kind="calculus-average" mode="en" />),
      dy = 'Predict output change Δy',
      avg = 'Predict average rate';
    enter(dy, '8');
    check(dy);
    matched(dy);
    enter(avg, '4');
    check(avg);
    matched(avg);
    select('Vertical translation', '4');
    expect(field(dy)).toBe('8');
    expect(field(avg)).toBe('4');
    click('Change display window');
    expect(field(avg)).toBe('4');
    expect(
      v.container
        .querySelector('[data-function-point="B"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('3,13');
    select('End b', '1');
    expect(field(avg)).toBe('');
    enter(avg, 'undefined');
    check(avg);
    matched(avg);
    expect(
      v.container.querySelector('[data-function-curve="secant"]'),
    ).toBeNull();
  });
  it('keeps a derivative prediction when h changes while showing no fake secant at h zero', () => {
    const v = render(<CalculusLab kind="calculus-secant" mode="en" />),
      q = 'Predict current quotient',
      d = 'Predict finite derivative';
    enter(q, '3');
    check(q);
    matched(q);
    enter(d, '2');
    check(d);
    matched(d);
    select('Increment h or zero boundary', '-1/10');
    expect(field(q)).toBe('');
    expect(field(d)).toBe('2');
    enter(q, '1.9');
    check(q);
    matched(q);
    select('Increment h or zero boundary', '0');
    enter(q, 'undefined');
    check(q);
    matched(q);
    expect(
      v.container.querySelector('[data-function-curve="secant"]'),
    ).toBeNull();
    expect(
      v.container.querySelector('[data-function-curve="tangent"]'),
    ).toBeTruthy();
    select('Function rule', 'x^3');
    select('Increment h or zero boundary', '1/10');
    enter(q, '331/100');
    check(q);
    matched(q);
    enter(d, '3');
    check(d);
    matched(d);
  });
  it('distinguishes a punctured limit, a patched point and a jump without bridging branches or covering the hole', () => {
    const v = render(<CalculusLab kind="calculus-limit" mode="en" />),
      lim = 'Predict two-sided limit',
      point = 'Predict centre value';
    enter(lim, '2');
    check(lim);
    matched(lim);
    enter(point, 'undefined');
    check(point);
    matched(point);
    expect(
      v.container.querySelector(
        '[data-function-end="1,2"][data-closed="false"]',
      ),
    ).toBeTruthy();
    expect(v.container.querySelector('[data-function-point="L"]')).toBeNull();
    expect(
      screen.getByRole('region', { name: 'Current approach samples' })
        .textContent,
    ).toContain('21/10');
    select('Approach distance δ', '1/2');
    expect(v.container.querySelector('[data-function-point="L"]')).toBeTruthy();
    expect(field(lim)).toBe('2');
    select('Limit case', 'patched');
    expect(field(lim)).toBe('2');
    expect(field(point)).toBe('');
    enter(point, '5');
    check(point);
    matched(point);
    expect(
      v.container.querySelector(
        '[data-function-end="1,5"][data-closed="true"]',
      ),
    ).toBeTruthy();
    select('Limit case', 'jump');
    enter(lim, 'DNE');
    check(lim);
    matched(lim);
    enter(point, '2');
    check(point);
    matched(point);
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      2,
    );
    for (const el of v.container.querySelectorAll('[data-function-curve]'))
      expect(
        new Set(
          el
            .getAttribute('points')!
            .split(' ')
            .map((p) => p.split(',')[1]),
        ).size,
      ).toBe(1);
  });
  it('handles signed instantaneous rates, translated positions and continuous nondifferentiable corners', () => {
    const v = render(<CalculusLab kind="calculus-instant" mode="en" />),
      q = 'Predict current quotient',
      d = 'Predict finite derivative';
    enter(q, '5');
    check(q);
    matched(q);
    enter(d, '4');
    check(d);
    matched(d);
    select('Position constant shift', '4');
    expect(field(q)).toBe('5');
    expect(field(d)).toBe('4');
    select('Function rule', 'absolute');
    select('Fixed input a', '0');
    enter(q, '1');
    check(q);
    matched(q);
    enter(d, 'undefined');
    check(d);
    matched(d);
    expect(
      v.container.querySelector('[data-function-curve="tangent"]'),
    ).toBeNull();
    select('Increment h or zero boundary', '-1');
    expect(field(d)).toBe('undefined');
    enter(q, '-1');
    check(q);
    matched(q);
    select('Function rule', 'x^3');
    enter(d, '0');
    check(d);
    matched(d);
    expect(
      v.container.querySelector('[data-function-curve="tangent"]'),
    ).toBeTruthy();
  });
  it('keeps an entire derivative function separate from a point evaluation and draws D on the derivative graph', () => {
    const v = render(<CalculusLab kind="calculus-rules" mode="en" />),
      f = 'Predict derivative function',
      at = 'Predict derivative value here';
    enter(f, '3(3x²)-2');
    check(f);
    matched(f);
    enter(at, '7');
    check(at);
    matched(at);
    select('Evaluation input a', '2');
    expect(field(f)).toBe('3(3x²)-2');
    expect(field(at)).toBe('');
    enter(at, '34');
    check(at);
    matched(at);
    expect(v.container.textContent).toContain(
      'Some selected points lie outside this window',
    );
    select('Polynomial to differentiate', '0');
    enter(f, '0');
    check(f);
    matched(f);
    enter(at, '0');
    check(at);
    matched(at);
    expect(
      v.container
        .querySelector('[data-function-point="D"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('2,0');
  });
  it('checks complete tangent equations and retains them on display changes, including horizontal and crossing tangents', () => {
    const v = render(<CalculusLab kind="calculus-tangent" mode="en" />),
      eq = 'Predict complete tangent equation';
    enter('Predict contact height', '4');
    check('Predict contact height');
    matched('Predict contact height');
    enter(eq, 'y=4x');
    check(eq);
    expect(
      screen.getByRole('status', { name: `${eq} feedback` }).textContent,
    ).not.toContain('matches');
    enter(eq, '2y-8x=-8');
    check(eq);
    matched(eq);
    click('Change display window');
    expect(field(eq)).toBe('2y-8x=-8');
    select('Curve rule', 'x^3');
    select('Contact input a', '0');
    enter(eq, 'y=0');
    check(eq);
    matched(eq);
    expect(
      v.container
        .querySelector('[data-function-point="A"]')
        ?.getAttribute('data-coordinate'),
    ).toBe('0,0');
    select('Curve rule', 'x^3-3x');
    select('Contact input a', '1');
    enter(eq, 'y=-2');
    check(eq);
    matched(eq);
  });
  it('renders six meaningful hook diagrams and two complete English worked examples per lesson', () => {
    for (const l of h25Lessons) {
      const art = render(
        <CalculusHookArt
          kind={l.lab as Parameters<typeof CalculusHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      if (l.id === 'H25-L03')
        expect(
          art.container.querySelector(
            '[data-function-end="1,2"][data-closed="false"]',
          ),
        ).toBeTruthy();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores supported guided answers across six lessons without awarding unworked lesson mastery', () => {
    for (const [id, answer] of [
      ['H25-L01', '4'],
      ['H25-L02', '5/2'],
      ['H25-L03', '2'],
      ['H25-L04', '4'],
      ['H25-L05', '9x^2-2'],
      ['H25-L06', 'y=4x-4'],
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
  it('keeps corner explanations parent-reviewed and preserves original text after refresh', () => {
    const v = mount('/math/lesson/H25-L04');
    click(/^06 Reflect/);
    const text =
      'Engineering example: |x| has value zero and both value limits zero, so it is continuous. Its quotient |h|/h is -1 on the left and 1 on the right, giving no finite derivative. For x^3 at zero the quotient h^2 tends to zero, but the curve crosses its horizontal tangent and has no local extremum there.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H25-L04']
        .answers['H25-L04-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H25-L04');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('saves all eight unit questions and two human proofs independently from lesson mastery', () => {
    const v = mount('/math/unit/H25/check');
    ['4', '5/2', '2', '4', '9x^2-2', 'y=4x-4'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    click('Question 7');
    enter(
      'Your reasoning',
      'Engineering example: The hole has limits 2 and 2 with undefined point value. Patching the value to 5 preserves limit 2. The jump has limits 0 and 2 with point value 2, so no two-sided limit. None is continuous at one; patching the hole to 2 would be. Finite tables suggest, rather than prove, complete neighbourhood behaviour.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Engineering example: x^2 at 2 has contact (2,4), slope 4, tangent y=4x-4. The line y=2x passes through the point but has wrong slope. x^3 crosses tangent y=0 at zero. The tangent y=-2 to x^3-3x at one also meets the curve at -2. Tangency is a local derivative condition.',
    );
    expect(screen.getByText(/Recorded 7\/8/)).toBeTruthy();
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H25/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H25-L01'],
    ).toBeUndefined();
  });
  it('changes a due average-rate retrieval without inheriting the preceding answer or success', () => {
    const v = mount('/math/lesson/H25-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '8');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-3');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H25-L01'].round).toBe(1);
    saved.sessions['H25-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-3');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '-1');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
