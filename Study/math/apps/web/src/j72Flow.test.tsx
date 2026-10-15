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
import { PolynomialLab } from './PolynomialLabs';
import { App } from './App';
import { j72Lessons } from './content/J72';
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
const verify = (name?: string) => {
  const scope = name ? within(screen.getByRole('group', { name })) : screen;
  fireEvent.click(scope.getByRole('button', { name: 'Check my expression' }));
};
const feedback = (name?: string) =>
  (name ? within(screen.getByRole('group', { name })) : screen).getByRole(
    'status',
    { name: 'Workshop feedback' },
  ).textContent;
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('J72 symbolic workbenches', () => {
  it('substitutes every occurrence of negative fractional values and resets the preceding numerical task', () => {
    render(<PolynomialLab kind="poly-substitute" mode="en" />);
    expect(screen.getByText(/\(-2\)\^2\+2\(-2\)-3/)).toBeTruthy();
    enter('My substituted value', '-11');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My substituted value', '-3');
    verify();
    expect(feedback()).toContain('correct');
    choose('Denominator of x', '2');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My substituted value', '-4');
    verify();
    expect(feedback()).toContain('correct');
    choose('Expression family', 'two');
    slide('Value of y', '3');
    enter('My substituted value', '-7');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('preserves original cards while grouping and distinguishes equivalent but uncollected forms', () => {
    const v = render(<PolynomialLab kind="poly-like" mode="en" />);
    const ids = () =>
      Array.from(v.container.querySelectorAll('[data-source-id]'))
        .map((e) => e.getAttribute('data-source-id'))
        .sort();
    expect(ids()).toEqual(['A', 'B', 'C', 'D']);
    enter('My collected expression', '3x²+4x²-2x+1');
    verify();
    expect(feedback()).toContain('equivalent, but finish');
    enter('My collected expression', '7x²-2x+1');
    verify();
    expect(feedback()).toContain('correct');
    click('Group by variable part or restore');
    expect(ids()).toEqual(['A', 'B', 'C', 'D']);
    expect(v.container.querySelectorAll('.math-poly-bucket')).toHaveLength(3);
    slide('Coefficient of card C', '-3');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My collected expression', '-2x+1');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('treats xy and yx as one type while keeping linear and constant parts separate', () => {
    render(<PolynomialLab kind="poly-like" mode="en" />);
    choose('Variable part of A', 'xy');
    choose('Variable part of C', 'yx');
    enter('My collected expression', '7xy-2x+1');
    verify();
    expect(feedback()).toContain('correct');
    choose('Variable part of C', 'x');
    enter('My collected expression', '3xy+2x+1');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('requires distributing to every term and accepts an explicit zero result at the zero-factor boundary', () => {
    const v = render(<PolynomialLab kind="poly-distribute" mode="en" />);
    enter('My expanded and collected expression', '-2(3x-4)');
    verify();
    expect(feedback()).toContain('equivalent, but finish');
    enter('My expanded and collected expression', '-6x-4');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My expanded and collected expression', '8-6x');
    verify();
    expect(feedback()).toContain('correct');
    click('Show or hide term-by-term distribution');
    expect(v.container.querySelector('svg')).toBeTruthy();
    expect(screen.getByText(/giving -6x and 8/)).toBeTruthy();
    slide('Outside factor k', '0');
    expect(v.container.querySelector('svg')).toBeNull();
    enter('My expanded and collected expression', '0x');
    verify();
    expect(feedback()).toContain('equivalent, but finish');
    enter('My expanded and collected expression', '0');
    verify();
    expect(feedback()).toContain('correct');
    expect(screen.getAllByRole('group')).toHaveLength(1);
  });
  it('negates all of B and retains A, then changes the result appropriately for addition', () => {
    const v = render(<PolynomialLab kind="poly-sum" mode="en" />);
    click('Apply the outside sign and match like terms');
    expect(v.container.querySelectorAll('[data-source-id]')).toHaveLength(6);
    enter('My polynomial result', '2x²-x+3-x²-2x+4');
    verify();
    expect(feedback()).toContain('equivalent, but finish');
    enter('My polynomial result', 'x²-3x+7');
    verify();
    expect(feedback()).toContain('correct');
    choose('Operation between expressions', 'add');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My polynomial result', '3x²+x-1');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('retains a valid general expression when only its test assignment changes, clearing the numerical answer', () => {
    render(<PolynomialLab kind="poly-story" mode="en" />);
    enter('My general expression', '18');
    verify('My general expression');
    expect(feedback('My general expression')).toContain('Recheck');
    enter('My general expression', '2(2n+3)');
    verify('My general expression');
    enter('My numerical quantity', '18 NZD');
    verify('My numerical quantity');
    expect(feedback('My general expression')).toContain('correct');
    expect(feedback('My numerical quantity')).toContain('correct');
    slide('Test value n', '4');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'My general expression',
        }) as HTMLInputElement
      ).value,
    ).toBe('2(2n+3)');
    expect(feedback('My general expression')).toContain('correct');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'My numerical quantity',
        }) as HTMLInputElement
      ).value,
    ).toBe('');
    enter('My numerical quantity', '22');
    verify('My numerical quantity');
    expect(feedback('My numerical quantity')).toContain('correct');
  });
  it('changes the target from boundary to coverage while retaining one proportionally drawn rectangle', () => {
    const v = render(<PolynomialLab kind="poly-story" mode="en" />);
    choose('Context and target', 'perimeter');
    enter('My general expression', '2((n+2)+n)');
    verify('My general expression');
    enter('My numerical quantity', '16 cm');
    verify('My numerical quantity');
    expect(feedback('My numerical quantity')).toContain('correct');
    const rect = v.container.querySelector('svg rect')!;
    expect(
      Number(rect.getAttribute('width')) / Number(rect.getAttribute('height')),
    ).toBeCloseTo(5 / 3, 12);
    choose('Context and target', 'area');
    enter('My general expression', '4n+4');
    verify('My general expression');
    expect(feedback('My general expression')).toContain('Recheck');
    enter('My general expression', 'n(n+2)');
    verify('My general expression');
    enter('My numerical quantity', '15 cm');
    verify('My numerical quantity');
    expect(feedback('My numerical quantity')).toContain('Recheck');
    enter('My numerical quantity', '15 cm²');
    verify('My numerical quantity');
    expect(feedback('My numerical quantity')).toContain('correct');
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
});
describe('J72 authored lessons and durable records', () => {
  it('opens all five hooks and two English examples per lesson, plus both language bodies', () => {
    for (const l of j72Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        v.container.querySelector('.math-poly-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/J72-L05');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('restores negative substituted values without treating a sign error as independent success', () => {
    const v = mount('/math/lesson/J72-L01');
    click(/04 Together/);
    enter('Your answer', '-11');
    check();
    enter('Your answer', '-3');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J72-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('-3');
  });
  it('gives a specific form reminder for an uncollected identity and restores an order-independent completed expression', () => {
    const v = mount('/math/lesson/J72-L02');
    click(/04 Together/);
    enter('Your answer', '3x²+4x²+3x');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '3x+7x²');
    check();
    v.unmount();
    mount('/math/lesson/J72-L02');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('3x+7x²');
  });
  it('requires actual expansion and stores the equivalent expanded form', () => {
    const v = mount('/math/lesson/J72-L03');
    click(/04 Together/);
    enter('Your answer', '-2(3x-4)');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '8-6x');
    check();
    v.unmount();
    mount('/math/lesson/J72-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('8-6x');
  });
  it('preserves a whole-polynomial subtraction answer and a legitimate factored word model', () => {
    const a = mount('/math/lesson/J72-L04');
    click(/04 Together/);
    enter('Your answer', 'x²+x-1');
    check();
    enter('Your answer', 'x²-3x+7');
    check();
    a.unmount();
    const b = mount('/math/lesson/J72-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('x²-3x+7');
    b.unmount();
    const c = mount('/math/lesson/J72-L05');
    click(/04 Together/);
    enter('Your answer', '18');
    check();
    enter('Your answer', '2(2n+3)');
    check();
    c.unmount();
    mount('/math/lesson/J72-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2(2n+3)');
  });
  it('does not count one sampled value as an identity even when substitution happens to agree', () => {
    mount('/math/lesson/J72-L02');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '6xy');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '3xy+3y');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('records reviewed modelling reasoning without completing unfinished practice', () => {
    mount('/math/lesson/J72-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Let n be width in centimetres, n positive. Perimeter adds two lengths n+2 and two widths n, giving4n+4 cm. Area multiplies the sides, giving n(n+2) cm². At n=3 the numbers16 and15 differ in quantity and unit; neither replaces a general expression. Test values find mistakes but the side relationships justify the model.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J72-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves all eight unit-review records independently of lessons', () => {
    const v = mount('/math/unit/J72/check');
    for (const [n, input] of Object.entries({
      1: '15',
      2: '5x²-x',
      3: '6-3x',
      4: 'x²+3x-5',
      5: '5yx-y',
      6: '3n+5',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^B Only those two cases/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Retain A and negate every term of B, then collect matching variable parts; adding original B back recovers A. For width n and length n+2, n>0, perimeter4n+4 cm and area n(n+2) cm² come from different relationships. A few trial matches do not prove identity; compare exact coefficients and derive the model from quantities.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J72/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J72-L05'],
    ).toBeUndefined();
  });
  it('changes collected retrieval coefficients and clears prior expression and success evidence', () => {
    const v = mount('/math/lesson/J72-L02');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '6xy');
    check();
    enter('Your answer', '3xy+3y');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText(/Collect -3x²\+1x\+\(-2\)x²−x/)).toBeTruthy();
    enter('Your answer', '-5x²');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J72-L02'].round).toBe(1);
    saved.sessions['J72-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/Collect -2x²\+1x\+\(-1\)x²−x/)).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    enter('Your answer', '-3x²');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
