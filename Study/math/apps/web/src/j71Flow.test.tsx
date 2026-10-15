// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RationalLab } from './RationalLabs';
import { App } from './App';
import { j71Lessons } from './content/J71';
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
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const feedback = () =>
  screen.getByRole('status', { name: 'Workshop feedback' }).textContent;
const verify = () => click('Check my relationship');
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('J71 rational-number workshops', () => {
  it('distinguishes sign, opposite and reciprocal; reflection merges at zero and resets old evidence', () => {
    const v = render(<RationalLab kind="rational-sign" mode="en" />);
    choose('Number category', 'negative');
    enter('My opposite', '-2/3');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My opposite', '1.5');
    verify();
    expect(feedback()).toContain('Values and conditions correct');
    click('Show or hide reflection across zero');
    expect(v.container.querySelectorAll('[data-rational-value]')).toHaveLength(
      2,
    );
    slide('Numerator n', '0');
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    choose('Number category', 'positive');
    enter('My opposite', '0');
    verify();
    expect(feedback()).toContain('Recheck');
    choose('Number category', 'zero');
    enter('My opposite', '-0');
    verify();
    expect(feedback()).toContain('correct');
    click('Show or hide reflection across zero');
    expect(v.container.querySelectorAll('[data-rational-value]')).toHaveLength(
      1,
    );
    expect(
      v.container.querySelector('[data-rational-value]')!.textContent,
    ).toContain('A=B');
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
  it('separates directed change from absolute distances for across-zero, same-side and coincident points', () => {
    const v = render(<RationalLab kind="rational-distance" mode="en" />);
    enter('My |A|', '1.5');
    enter('My A–B distance', '2');
    verify();
    expect(feedback()).toContain('correct');
    slide('Numerator of B', '-1');
    enter('My |A|', '3/2');
    enter('My A–B distance', '2');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My A–B distance', '1');
    verify();
    expect(feedback()).toContain('correct');
    slide('Numerator of A', '1');
    slide('Numerator of B', '-3');
    expect(screen.getByText(/Directed change B−A=-2/)).toBeTruthy();
    enter('My |A|', '1/2');
    enter('My A–B distance', '-2');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My A–B distance', '2');
    verify();
    expect(feedback()).toContain('correct');
    slide('Numerator of A', '-3');
    expect(v.container.querySelectorAll('[data-rational-value]')).toHaveLength(
      1,
    );
    enter('My |A|', '3/2');
    enter('My A–B distance', '0');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('uses common fractional units without equating a rightward move with a positive endpoint', () => {
    const v = render(<RationalLab kind="rational-add" mode="en" />);
    click('Move along the change to the result');
    expect(
      v.container.querySelector('[data-rational-value="-1/4"]'),
    ).toBeTruthy();
    expect(screen.getByText(/Common unit 1\/4/)).toBeTruthy();
    enter('My result', '1/4');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My result', '-0.25');
    verify();
    expect(feedback()).toContain('correct');
    slide('Start numerator', '-2');
    choose('Start denominator', '3');
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    expect(v.container.querySelector('[data-rational-segment]')).toBeNull();
    click('Move along the change to the result');
    expect(screen.getByText(/Common unit 1\/6/)).toBeTruthy();
    enter('My result', '-1/6');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('rewrites only the subtrahend, retains the start and supports zero subtraction', () => {
    const v = render(<RationalLab kind="rational-subtract" mode="en" />);
    enter('Opposite of the subtrahend', '-1/2');
    enter('My result', '-1/4');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('Opposite of the subtrahend', '1/2');
    verify();
    expect(feedback()).toContain('correct');
    click('Rewrite as adding the opposite and move');
    expect(
      v.container.querySelector('[data-rational-value="-1/4"]'),
    ).toBeTruthy();
    slide('Second numerator', '1');
    click('Rewrite as adding the opposite and move');
    expect(
      screen.getByText(/Rewrite as \(-3\/4\) \+ \(-1\/2\) = -5\/4/),
    ).toBeTruthy();
    slide('Second numerator', '0');
    enter('Opposite of the subtrahend', '0');
    enter('My result', '-3/4');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('reflects and scales exactly, distinguishes reciprocals and does not invent zero-divisor results', () => {
    const v = render(<RationalLab kind="rational-scale" mode="en" />);
    click('Show or hide the scaling result');
    expect(v.container.querySelector('[data-rational-value="1"]')).toBeTruthy();
    enter('My result', '1');
    verify();
    expect(feedback()).toContain('correct');
    choose('Operation', 'divide');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My result', '1');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My result', '9/4');
    verify();
    expect(feedback()).toContain('correct');
    slide('Second numerator', '0');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Domain feedback' }).textContent,
    ).toContain('undefined');
    slide('First numerator', '0');
    expect(
      screen.getByRole('status', { name: 'Domain feedback' }).textContent,
    ).toContain('no unique quotient');
    choose('Operation', 'multiply');
    enter('My result', '0');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('reveals complete equivalent expressions and clears old steps after a parameter change', () => {
    const v = render(<RationalLab kind="rational-mixed" mode="en" />);
    expect(v.container.querySelectorAll('[data-expression-step]')).toHaveLength(
      0,
    );
    click('Reveal the next equivalent step');
    expect(
      v.container.querySelector('[data-expression-step]')!.textContent,
    ).toContain('((-1/4) × (-2/3))');
    click('Reveal the next equivalent step');
    expect(
      (
        screen.getByRole('button', {
          name: 'Reveal the next equivalent step',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    enter('My exact result', '1/6');
    verify();
    expect(feedback()).toContain('correct');
    slide('Parameter a', '3');
    expect(v.container.querySelectorAll('[data-expression-step]')).toHaveLength(
      0,
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });
  it('distinguishes −2² from (−2)² and original left-to-right division from altered denominator brackets', () => {
    const v = render(<RationalLab kind="rational-mixed" mode="en" />);
    choose('Expression family', 'powers');
    expect(
      v.container.querySelector('[data-expression-initial]')!.textContent,
    ).toBe('−2²');
    enter('My exact result', '4');
    verify();
    expect(feedback()).toContain('Recheck');
    enter('My exact result', '-4');
    verify();
    expect(feedback()).toContain('correct');
    click('Toggle brackets that change the structure');
    enter('My exact result', '4');
    verify();
    expect(feedback()).toContain('correct');
    choose('Expression family', 'association');
    enter('My exact result', '1');
    verify();
    expect(feedback()).toContain('correct');
    click('Toggle brackets that change the structure');
    enter('My exact result', '9');
    verify();
    expect(feedback()).toContain('correct');
  });
  it('stops a whole mixed expression at an intermediate zero divisor', () => {
    const v = render(<RationalLab kind="rational-mixed" mode="en" />);
    choose('Expression family', 'zero');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Domain feedback' }).textContent,
    ).toContain('undefined, not zero');
    click('Reveal the next equivalent step');
    click('Reveal the next equivalent step');
    expect(v.container.querySelectorAll('[data-expression-step]')).toHaveLength(
      2,
    );
    expect(
      v.container.querySelectorAll('[data-expression-step]')[1]!.textContent,
    ).toContain('Undefined (zero divisor)');
    expect(
      (
        screen.getByRole('button', {
          name: 'Reveal the next equivalent step',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
describe('J71 bilingual study and persistent independent evidence', () => {
  it('opens all six planned hooks and two English examples per lesson, plus both language bodies', () => {
    for (const l of j71Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        v.container.querySelector('.math-rational-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/J71-L06');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects a reciprocal as an opposite and restores an exact decimal answer', () => {
    const v = mount('/math/lesson/J71-L01');
    click(/04 Together/);
    enter('Your answer', '-2/3');
    check();
    enter('Your answer', '1.5');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J71-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('1.5');
  });
  it('rejects a directed negative distance and restores the pairwise distance with practice position', () => {
    const v = mount('/math/lesson/J71-L02');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '-2');
    check();
    enter('Your answer', '2');
    check();
    v.unmount();
    mount('/math/lesson/J71-L02');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2');
    expect(
      screen
        .getByRole('button', { name: 'Question 2' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('restores fractional addition without accepting a positive endpoint or expression as a scalar', () => {
    const v = mount('/math/lesson/J71-L03');
    click(/04 Together/);
    enter('Your answer', '1/4');
    check();
    enter('Your answer', '-3/4+1/2');
    check();
    enter('Your answer', '−0.25');
    check();
    v.unmount();
    mount('/math/lesson/J71-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('−0.25');
  });
  it('restores subtraction as adding the opposite and an exact inverse-checked quotient', () => {
    const a = mount('/math/lesson/J71-L04');
    click(/04 Together/);
    enter('Your answer', '-5/4');
    check();
    enter('Your answer', '-1/4');
    check();
    a.unmount();
    const b = mount('/math/lesson/J71-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('-1/4');
    b.unmount();
    const c = mount('/math/lesson/J71-L05');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '3/8');
    check();
    enter('Your answer', '3/2');
    check();
    c.unmount();
    mount('/math/lesson/J71-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('3/2');
  });
  it('persists different power scopes as different records', () => {
    const v = mount('/math/lesson/J71-L06');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '4');
    check();
    enter('Your answer', '-4');
    check();
    click('Question 3');
    enter('Your answer', '4');
    check();
    v.unmount();
    mount('/math/lesson/J71-L06');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('4');
    click('Question 2');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('-4');
  });
  it('records reviewed structure reasoning without completing an unfinished lesson', () => {
    mount('/math/lesson/J71-L06');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'The outside minus in -2² follows squaring2 and gives-4, whereas a signed base(-2) squared gives4. Equal-precedence division and multiplication go left to right, yielding9. Grouping2 times-3 as the divisor inserts new brackets and gives a different expression1. Preserve all remaining terms and stop if a divisor becomes zero.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J71-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves eight review items independently of individual lessons', () => {
    const v = mount('/math/unit/J71/check');
    for (const [n, input] of Object.entries({
      1: '0.75',
      2: '7/6',
      3: '-0.25',
      4: '1/3',
      5: '6/5',
      6: '0',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^B 0×q=0 holds/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Distance is two regardless of direction. Opposite3/2 sums to zero with-3/2; reciprocal-2/3 multiplies to one. Outside minus after2² gives-4, but signed(-2)² gives4. Zero divided by nonzero is zero; division by zero is undefined because the inverse check is impossible or non-unique.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J71/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J71-L06'],
    ).toBeUndefined();
  });
  it('changes a saved mixed-operation retrieval from a fraction to an outside-minus square with cleared evidence', () => {
    const v = mount('/math/lesson/J71-L06');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '4');
    check();
    enter('Your answer', '-4');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Calculate [(−0/2)+1/2]×(−2/3).')).toBeTruthy();
    enter('Your answer', '-1/3');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J71-L06'].round).toBe(1);
    saved.sessions['J71-L06'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('Evaluate −2².')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    enter('Your answer', '-4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
