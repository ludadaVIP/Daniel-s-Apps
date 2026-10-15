// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AlgebraLab } from './AlgebraLabs';
import { App } from './App';
import { p65Lessons } from './content/P65';
import { STORAGE_KEY } from './progress';
vi.setConfig({ testTimeout: 20000 });
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
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const apply = () => click('Apply and inspect the solution set');
describe('P65 operational algebra models', () => {
  it('substitutes repeated n consistently at positive, zero and negative inputs', () => {
    render(<AlgebraLab kind="algebra-letter" mode="en" />);
    click('Check substitution and shorthand');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('= 11');
    slide('Value of n', '0');
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    click('Check substitution and shorthand');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('= 3');
    slide('Value of n', '-2');
    click('Check substitution and shorthand');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('= -1');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('both n values in this row are -2');
  });
  it('retains the fixed two while constructing stages and rejects the growth-only rule', () => {
    const v = render(<AlgebraLab kind="algebra-nth" mode="en" />);
    expect(
      v.container.querySelectorAll('[data-variable-counter]'),
    ).toHaveLength(12);
    expect(v.container.querySelectorAll('[data-fixed-counter]')).toHaveLength(
      2,
    );
    select('Choose the general rule', '3n');
    click('Check the nth term against construction');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('differs');
    slide('Constructed stage n', '1');
    expect(
      v.container.querySelectorAll('[data-variable-counter]'),
    ).toHaveLength(3);
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    select('Choose the general rule', '3n+2');
    click('Check the nth term against construction');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('Stage 20 has 62');
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
  it('accepts constructed expressions and distinguishes per-bag extras from extras overall, including zero', () => {
    const v = render(<AlgebraLab kind="algebra-expression" mode="en" />);
    expect(v.container.querySelector('svg')!.textContent).not.toContain(
      '3(n + 2)',
    );
    expect(screen.getByRole('textbox').getAttribute('placeholder')).toBeNull();
    expect(v.container.querySelectorAll('[data-fixed-counter]')).toHaveLength(
      6,
    );
    enter('My general expression', '3n+2');
    click('Check the structure for every allowed n');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('Not equivalent');
    enter('My general expression', 'n+n+n+6');
    click('Check the structure for every allowed n');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('Equivalent expression');
    slide('Circles per bag n', '0');
    expect(
      v.container.querySelectorAll('[data-variable-counter]'),
    ).toHaveLength(0);
    expect(v.container.querySelectorAll('[data-fixed-counter]')).toHaveLength(
      6,
    );
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    click('Switch extras inside or outside the bags');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    expect(v.container.querySelectorAll('[data-fixed-counter]')).toHaveLength(
      2,
    );
    enter('My general expression', '2');
    click('Check the structure for every allowed n');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('Not equivalent');
    enter('My general expression', '3*n+2');
    click('Check the structure for every allowed n');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('current total is 2');
  });
  it('distinguishes a candidate balancing a damaged equation from solving the original', () => {
    const v = render(<AlgebraLab kind="algebra-balance" mode="en" />);
    select('Apply to both or left only', 'left');
    apply();
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('solution set changed');
    enter('Candidate x (integer or fraction)', '10');
    expect(v.container.querySelector('[data-algebra-left]')!.textContent).toBe(
      '10',
    );
    expect(v.container.querySelector('[data-algebra-right]')!.textContent).toBe(
      '10',
    );
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('left 20, right 10; unequal');
    click('Restore original equation');
    expect(
      screen.getByRole('list', { name: 'Transformation record' }).children,
    ).toHaveLength(0);
    select('Apply to both or left only', 'both');
    apply();
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('solution set is preserved');
    enter('Candidate x (integer or fraction)', '5');
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('x=5 solves the original');
  });
  it('solves a negative one-step case and rejects zero multiplication and division without appending a step', () => {
    render(<AlgebraLab kind="algebra-balance" mode="en" />);
    select('Original equation', '1');
    select('Transformation', '−');
    enter('Operation amount', '5');
    apply();
    enter('Candidate x (integer or fraction)', '−3');
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('left 2 = right 2');
    select('Transformation', '×');
    enter('Operation amount', '0');
    apply();
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('loses solution information');
    select('Transformation', '÷');
    apply();
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('division by zero is undefined');
    expect(
      screen.getByRole('list', { name: 'Transformation record' }).children,
    ).toHaveLength(1);
  });
  it('undoes brackets in two stages and keeps fractional solutions exact', () => {
    const v = render(<AlgebraLab kind="algebra-brackets" mode="en" />);
    apply();
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('preserved');
    select('Transformation', '−');
    enter('Operation amount', '2');
    apply();
    enter('Candidate x (integer or fraction)', '3');
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('x=3 solves');
    select('Original equation', '4');
    select('Transformation', '÷');
    enter('Operation amount', '3');
    apply();
    select('Transformation', '−');
    enter('Operation amount', '2');
    apply();
    enter('Candidate x (integer or fraction)', '-0.33');
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('left 501/100, right 5; unequal');
    enter('Candidate x (integer or fraction)', '−1/3');
    click('Check in the original equation');
    expect(
      screen.getByRole('status', { name: 'Workshop feedback' }).textContent,
    ).toContain('x=-1/3 solves the original');
    expect(v.container.querySelector('[data-algebra-left]')!.textContent).toBe(
      '-1/3',
    );
    v.rerender(<AlgebraLab kind="algebra-brackets" mode="bilingual" />);
    expect(screen.getByText(/代回原式：左 5 = 右 5/)).toBeTruthy();
    expect(
      screen.getByText(/Original substitution: left 5 = right 5/),
    ).toBeTruthy();
  });
});
describe('P65 bilingual content and saved learning', () => {
  it('opens all five lessons with two English examples and both languages when requested', () => {
    for (const l of p65Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        document.querySelector('.math-algebra-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P65-L03');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects a current numerical total and missing distribution, then restores an equivalent expression', () => {
    const v = mount('/math/lesson/P65-L03');
    click(/04 Together/);
    enter('Your answer', '15');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '3n+2');
    check();
    enter('Your answer', 'n+n+n+6');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P65-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('n+n+n+6');
  });
  it('retains an exact negative fraction and its practice position after rejecting a rounded value', () => {
    const v = mount('/math/lesson/P65-L05');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '-0.33');
    check();
    enter('Your answer', '−2/6');
    check();
    v.unmount();
    mount('/math/lesson/P65-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('−2/6');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('requires parent reasoning review without declaring an unfinished lesson mastered', () => {
    mount('/math/lesson/P65-L02');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Three rows of n plus two fixed pieces give 3n+2. A growth of three alone misses the fixed two. A finite list allows many possible continuations; the given construction supports every stage.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P65-L02']
        .completedAt,
    ).toBeUndefined();
  });
  it('records eight unit-check answers including two constructed expressions and independent parent evidence', () => {
    const v = mount('/math/unit/P65/check');
    for (const [n, answer] of Object.entries({
      1: '−1',
      2: '29',
      3: '3n+6',
      4: '−3.5',
      5: '1/2',
      7: 'n+n+n+n+n+1',
    })) {
      click(`Question ${n}`);
      enter('Your answer', answer);
      check();
    }
    click('Question 6');
    click(/^A Divide both sides/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Three bags of n+2 contain 3n+6, whereas two extras overall give 3n+2. For 3(x+2)=5, divide both sides by three and subtract two: x=-1/3. Substitute: three times five thirds is five.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P65/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P65-L05'],
    ).toBeUndefined();
  });
  it('changes the expression retrieval after a saved review and clears its preceding answer', () => {
    const v = mount('/math/lesson/P65-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '3(n+2)');
    check();
    enter('Your answer', '3n+2');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(
        '2 bags each contain n+1 pieces. Write the general total.',
      ),
    ).toBeTruthy();
    enter('Your answer', '2n+2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P65-L03'].round).toBe(1);
    saved.sessions['P65-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText(
        '3 bags each contain n+1 pieces. Write the general total.',
      ),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
